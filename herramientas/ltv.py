"""Nodo determinista: valor de vida (LTV) por pedido generado para productos con recompra.

Por pedido generado del primer producto:
  clientes = c · e                          (pedidos confirmados y entregados)
  G_recompra = c_r·e_r·(P_r − C_r) − c_r·F_r − fijo_r   (sin costo de anuncios: WhatsApp con consentimiento)
  LTV = G_primer_pedido(mezcla base) + clientes · tasa_recompra · pedidos_por_recomprador · G_recompra
El CPA de equilibrio con recompra es el LTV (sin costo de adquisición adicional).

Lee datos/supuestos.json y datos/economia.json; escribe datos/ltv.json.
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def cargar(nombre):
    return json.loads((RAIZ / "datos" / nombre).read_text(encoding="utf-8"))


def main():
    s = cargar("supuestos.json")
    r = s.get("recompra")
    if not r:
        print("Sin bloque 'recompra' en supuestos.json: nada que calcular.")
        return
    eco = {p["id"]: p for p in cargar("economia.json")["productos"]}
    c, e = s["tasa_confirmacion"], s["escenarios_entrega"]["base"]
    salida = {"supuestos": {k: r[k] for k in ("tasa_confirmacion_recompra", "entrega_recompra", "horizonte_meses", "escenarios")}, "productos": []}
    for pid, rp in r["productos"].items():
        if pid not in eco:
            continue
        g1 = eco[pid]["mezcla_base"]["G"]
        aov = eco[pid]["mezcla_base"]["aov"]
        g_r = (r["tasa_confirmacion_recompra"] * r["entrega_recompra"] * (rp["precio"] - rp["costo_estimado"])
               - r["tasa_confirmacion_recompra"] * rp["flete_estimado"] - r["costo_fijo_recompra"])
        esc = {}
        for nombre, x in r["escenarios"].items():
            extra = c * e * x["tasa_recompra"] * x["pedidos_por_recomprador"] * g_r
            ltv = g1 + extra
            esc[nombre] = {"ganancia_recompra": round(extra), "ltv": round(ltv), "roas_equilibrio_ltv": round(aov / ltv, 2)}
        salida["productos"].append({"id": pid, "G_primer_pedido": g1, "aov": aov, "pedido_recompra": rp["pedido_recompra"],
                                    "G_por_recompra": round(g_r), "escenarios": esc})
    (RAIZ / "datos" / "ltv.json").write_text(json.dumps(salida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    for p in salida["productos"]:
        print(f"{p['id']}: G primer pedido {p['G_primer_pedido']}, G por recompra {p['G_por_recompra']}")
        for n, x in p["escenarios"].items():
            print(f"  {n:10} +{x['ganancia_recompra']:>6}  LTV {x['ltv']:>6}  ROAS eq. con LTV {x['roas_equilibrio_ltv']}")


if __name__ == "__main__":
    main()
