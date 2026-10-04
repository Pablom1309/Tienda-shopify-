"""Nodo determinista del analista: agrega datos/resultados/*.csv (excepto PLANTILLA) por producto."""
import csv
import json
from collections import defaultdict
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CAMPOS = ["gasto_ads", "impresiones", "clics", "pedidos_generados", "confirmados", "despachados", "entregados", "devueltos", "ingreso_cobrado"]


def div(a, b):
    return round(a / b, 3) if b else None


def main():
    archivos = [p for p in (RAIZ / "datos" / "resultados").glob("*.csv") if p.name != "PLANTILLA.csv"]
    if not archivos:
        print("Sin resultados reales todavía: el nodo analista-resultados no se activa.")
        return
    tot = defaultdict(lambda: dict.fromkeys(CAMPOS, 0.0))
    for a in archivos:
        for fila in csv.DictReader(a.open(encoding="utf-8")):
            for c in CAMPOS:
                tot[fila["producto_id"]][c] += float(fila[c] or 0)
    eco = {p["id"]: p for p in json.loads((RAIZ / "datos" / "economia.json").read_text(encoding="utf-8"))["productos"]}
    salida = {}
    for pid, t in tot.items():
        salida[pid] = {
            "pedidos_generados": int(t["pedidos_generados"]),
            "ctr": div(t["clics"], t["impresiones"]),
            "conversion": div(t["pedidos_generados"], t["clics"]),
            "tasa_confirmacion": div(t["confirmados"], t["pedidos_generados"]),
            "tasa_entrega": div(t["entregados"], t["despachados"]),
            "cpa": round(t["gasto_ads"] / t["pedidos_generados"]) if t["pedidos_generados"] else None,
            "cpa_equilibrio_supuesto": eco.get(pid, {}).get("escenarios", {}).get("base", {}).get("cpa_equilibrio"),
            "mer": div(t["ingreso_cobrado"], t["gasto_ads"]),
            "gasto": round(t["gasto_ads"]),
        }
    (RAIZ / "datos" / "resultados_resumen.json").write_text(json.dumps(salida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(salida, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
