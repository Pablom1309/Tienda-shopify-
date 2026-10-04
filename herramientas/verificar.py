"""Chequeos deterministas (CI y nodo auditor). Sale con código 1 si hay errores."""
import csv
import json
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PROHIBIDAS = r"\b(cura|curar|sana|previene|alivia|golpe de calor|garantizad[oa]s?|100 ?% efectiv|milagro|¿tu (perro|gato) sufre)"
errores, avisos = [], []


def cargar(n):
    return json.loads((RAIZ / "datos" / n).read_text(encoding="utf-8"))


for n in ("supuestos.json", "candidatos.json", "economia.json", "ranking.json", "catalogo.json", "fichas.json", "marca.json", "tienda.json", "plan_ads.json"):
    try:
        cargar(n)
    except Exception as ex:  # noqa: BLE001
        errores.append(f"{n}: JSON inválido ({ex})")
if errores:
    print("\n".join(errores)); sys.exit(1)

cat, ranking = cargar("catalogo.json"), {r["id"]: r for r in cargar("ranking.json")["ranking"]}
fichas = {f["id"]: f for f in cargar("fichas.json")["fichas"]}
activos = [p for p in cat["productos"] if p["estado"] in ("aprobado_para_test", "escalar")]
max_activos = cargar("supuestos.json").get("max_activos", 2)
if len(activos) > max_activos:
    errores.append(f"catálogo: {len(activos)} productos activos (máximo {max_activos})")
for p in activos:
    if not ranking.get(p["id"], {}).get("pasa_porton"):
        errores.append(f"{p['id']}: aprobado sin pasar el portón duro")
    if p["id"] not in fichas:
        errores.append(f"{p['id']}: aprobado sin ficha")
    pagina = next((RAIZ / "sitio" / "productos").glob(f"{fichas.get(p['id'], {}).get('handle', '???')}.html"), None)
    if not pagina:
        errores.append(f"{p['id']}: sin página en sitio/ (ejecuta construir_sitio.py)")
    elif "$" + f"{p['precio']:,}".replace(",", ".") not in pagina.read_text(encoding="utf-8"):
        errores.append(f"{p['id']}: precio del sitio distinto al catálogo")

precios_csv = {r["Handle"]: int(r["Variant Price"]) for r in csv.DictReader((RAIZ / "shopify" / "productos.csv").open(encoding="utf-8"))}
for p in activos:
    h = fichas.get(p["id"], {}).get("handle")
    if h and precios_csv.get(h) != p["precio"]:
        errores.append(f"{p['id']}: precio del CSV de Shopify distinto al catálogo")

for archivo in [RAIZ / "datos" / "fichas.json", RAIZ / "datos" / "plan_ads.json", *(RAIZ / "sitio").rglob("*.html")]:
    texto = archivo.read_text(encoding="utf-8")
    for m in re.finditer(PROHIBIDAS, texto, flags=re.I):
        linea = texto.count("\n", 0, m.start()) + 1
        errores.append(f"{archivo.relative_to(RAIZ)}:{linea}: expresión prohibida '{m.group(0)}'")

legal = (RAIZ / "sitio" / "cambios.html").read_text(encoding="utf-8") if (RAIZ / "sitio" / "cambios.html").exists() else ""
if "10 días" not in legal or "6 meses" not in legal:
    errores.append("sitio/cambios.html: falta retracto de 10 días o garantía legal de 6 meses")

for k, v in cargar("tienda.json").items():
    if v is None:
        avisos.append(f"portón humano pendiente: datos/tienda.json → {k}")

print("\n".join([f"ERROR {e}" for e in errores] + [f"AVISO {a}" for a in avisos]) or "OK")
sys.exit(1 if errores else 0)
