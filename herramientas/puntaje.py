"""Nodo determinista: puntaje ponderado + portón duro de filtros.

Lee candidatos, economía y supuestos; escribe datos/ranking.json.
El validador (agente) revisa el ranking: no aprueba nada que el portón duro rechace.
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent

PESOS = {
    "demanda": 0.20,
    "estacionalidad": 0.15,
    "demostrable": 0.15,
    "baja_comparabilidad": 0.15,
    "logistica": 0.10,
    "ajuste_nicho": 0.10,
    "recompra": 0.05,
    "economia": 0.10,
}


def cargar(nombre):
    return json.loads((RAIZ / "datos" / nombre).read_text(encoding="utf-8"))


def nota_economia(eco):
    """0-5 según el ROAS de equilibrio de la mezcla base (más bajo = más holgura)."""
    roas = eco["mezcla_base"]["roas_equilibrio"]
    if roas is None:
        return 0
    return max(0.0, min(5.0, (5.0 - roas) * 2.5))  # ROAS 3 -> 5 ; ROAS 5 -> 0


def portón(cand, eco, f):
    motivos = []
    if eco["margen_bruto"] < f["margen_bruto_min"]:
        motivos.append(f"margen {eco['margen_bruto']:.0%} < {f['margen_bruto_min']:.0%}")
    if not f["precio_min"] <= cand["precio"] <= f["precio_max"]:
        motivos.append("precio fuera de rango")
    if cand["riesgo_politica"] > f["riesgo_politica_max"]:
        motivos.append(f"riesgo de política {cand['riesgo_politica']}")
    if eco["escenarios"]["pesimista"]["G"] <= 0:
        motivos.append("pierde con entrega pesimista")
    roas = eco["mezcla_base"]["roas_equilibrio"]
    if roas is None or roas > f["roas_equilibrio_base_max"]:
        motivos.append(f"ROAS de equilibrio (mezcla base) {roas} > {f['roas_equilibrio_base_max']}")
    return motivos


def main():
    s = cargar("supuestos.json")
    f = s["filtros"]
    cands = {c["id"]: c for c in cargar("candidatos.json")["candidatos"]}
    ecos = {e["id"]: e for e in cargar("economia.json")["productos"]}
    filas = []
    for cid, cand in cands.items():
        eco = ecos[cid]
        notas = dict(cand["criterios"], economia=round(nota_economia(eco), 2))
        puntaje = round(sum(PESOS[k] * notas[k] for k in PESOS), 2)
        motivos = portón(cand, eco, f)
        if puntaje < f["puntaje_min"]:
            motivos.append(f"puntaje {puntaje} < {f['puntaje_min']}")
        filas.append({"id": cid, "nombre": cand["nombre"], "nicho": cand["nicho"], "puntaje": puntaje,
                      "pasa_porton": not motivos, "motivos_rechazo": motivos, "notas": notas})
    filas.sort(key=lambda r: (r["pasa_porton"], r["puntaje"]), reverse=True)
    (RAIZ / "datos" / "ranking.json").write_text(json.dumps({"pesos": PESOS, "ranking": filas}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for r in filas:
        estado = "PASA " if r["pasa_porton"] else "FALLA"
        print(f"{estado} {r['puntaje']:>4} {r['id']:32} {'; '.join(r['motivos_rechazo'])}")


if __name__ == "__main__":
    main()
