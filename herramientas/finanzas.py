"""Nodo determinista: plan financiero del test (presupuesto, equilibrio, caja 30/60/90 días, sensibilidad).

Supuestos propios en datos/supuestos.json → bloque "finanzas". Lee economia/candidatos/plan_ads; escribe datos/finanzas.json.
Ganancia por pedido generado (antes de anuncios), igual que economia.py:
  G = c·e·(P − Cp − k·P) − c·F − c·(1 − e)·Fd − fijo     (P y Cp ponderados por la mezcla de la oferta de 2 unidades)
Caja: el anuncio se paga el mismo día; el neto de cada pedido llega `desfase_cobro_dias` después (entrega + liquidación Dropi + retiro).
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def cargar(nombre):
    return json.loads((RAIZ / "datos" / nombre).read_text(encoding="utf-8"))


def g_mezcla(cand, s, e, k, fd):
    c, fijo, m = s["tasa_confirmacion"], s["costo_fijo_por_pedido"], s.get("mezcla_oferta_2u", 0)
    p, cp, f, p2 = cand["precio"], cand["costo_estimado"], cand["flete_estimado"], cand.get("precio_2u")
    g = lambda pr, co: c * e * (pr - co - k * pr) - c * f - c * (1 - e) * fd - fijo
    return (1 - m) * g(p, cp) + (m * g(p2, 2 * cp) if p2 else 0)


def simular(prods, fz, cpa_real, dias=90):
    """prods: lista de dicts con G, test (presupuesto, dias), inicio, fin, gasto_diario_escala."""
    caja, minimo, flujo = 0.0, 0.0, [0.0] * (dias + fz["desfase_cobro_dias"] + 1)
    gasto_total = pedidos_total = 0.0
    for p in prods:
        pasa = cpa_real <= p["G"]
        for d in range(p["inicio"], min(p["fin"], dias) + 1):
            en_test = d < p["inicio"] + p["test_dias"]
            gasto = p["test_presupuesto"] / p["test_dias"] if en_test else (p["gasto_diario_escala"] if pasa else 0)
            pedidos = gasto / cpa_real
            flujo[d] -= gasto
            flujo[d + fz["desfase_cobro_dias"]] += pedidos * (p["G"] + fz["fijo_por_pedido_en_G"])
            flujo[d] -= pedidos * fz["fijo_por_pedido_en_G"]
            gasto_total += gasto
            pedidos_total += pedidos
    for d in range(1, dias + 1):
        if d % 30 == 1:
            flujo[d] -= fz["costos_fijos_mensuales"]
    cortes = {}
    for d in range(1, dias + 1):
        caja += flujo[d]
        minimo = min(minimo, caja)
        if d in (30, 60, 90):
            cortes[d] = round(caja)
    return {"caja": cortes, "caja_minima": round(minimo), "gasto_anuncios": round(gasto_total), "pedidos_generados": round(pedidos_total)}


def main():
    s, eco = cargar("supuestos.json"), cargar("economia.json")
    fz = s["finanzas"]
    cands = {c["id"]: c for c in cargar("candidatos.json")["candidatos"]}
    plan = {p["id"]: p for p in cargar("plan_ads.json")["productos"]}
    e_base, k0, fd0 = s["escenarios_entrega"]["base"], s["comision_plataforma"], s["flete_devolucion"]
    salida = {"supuestos": fz, "productos": [], "sensibilidad": {}, "caja": {}}

    prods = []
    for pid, cfg in fz["calendario"].items():
        cand, est = cands[pid], plan[pid]["estructura"]
        G = g_mezcla(cand, s, e_base, k0, fd0)
        prods.append({"id": pid, "G": G, "test_presupuesto": est["presupuesto_total_test"], "test_dias": est["dias"],
                      "inicio": cfg["inicio_dia"], "fin": cfg["fin_dia"], "gasto_diario_escala": cfg["gasto_diario_escala"]})
        sens = {}
        for nombre_e, e in s["escenarios_entrega"].items():
            for etiqueta, k, fd in (("supuesto", k0, fd0), ("con_comision_y_devolucion", fz["comision_alternativa"], fz["flete_devolucion_alternativo"])):
                g = g_mezcla(cand, s, e, k, fd)
                sens[f"{nombre_e}|{etiqueta}"] = {"G": round(g), "por_100k_anuncios": {str(cpa): round(100000 / cpa * g - 100000) for cpa in fz["cpa_escenarios"]}}
        salida["sensibilidad"][pid] = sens
        pedidos_fijos = fz["costos_fijos_mensuales"] / G
        salida["productos"].append({"id": pid, "G_base": round(G), "test_presupuesto": est["presupuesto_total_test"],
                                    "pedidos_para_juzgar_test": round(est["presupuesto_total_test"] / G, 1)})
    for cpa in fz["cpa_escenarios"]:
        salida["caja"][str(cpa)] = simular(prods, fz, cpa)
    (RAIZ / "datos" / "finanzas.json").write_text(json.dumps(salida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for p in salida["productos"]:
        print(p)
    for cpa, r in salida["caja"].items():
        print(f"CPA {cpa}: {r}")
    for pid, sens in salida["sensibilidad"].items():
        print(pid)
        for k, v in sens.items():
            print(f"  {k:42} G {v['G']:>6}  resultado por $100.000 en anuncios: {v['por_100k_anuncios']}")


if __name__ == "__main__":
    main()
