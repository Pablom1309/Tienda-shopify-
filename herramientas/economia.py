"""Nodo determinista: unidad económica contra entrega por pedido generado.

G = c·e·(P − Cp − k·P) − c·F − c·(1 − e)·Fd − costo_fijo
CPA de equilibrio = G ; ROAS de equilibrio = P / G

Lee datos/candidatos.json y datos/supuestos.json; escribe datos/economia.json.
"""
import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def cargar(nombre):
    return json.loads((RAIZ / "datos" / nombre).read_text(encoding="utf-8"))


def ganancia_por_pedido(precio, costo, flete, c, e, fd=0, k=0, fijo=0):
    return c * e * (precio - costo - k * precio) - c * flete - c * (1 - e) * fd - fijo


def iva_por_pedido(precio, costo, c, e, iva):
    """IVA débito neto de crédito (supone factura del proveedor) sobre lo entregado."""
    return c * e * (precio - costo) * iva / (1 + iva)


def evaluar(cand, s):
    c, fd, k, fijo, iva = (s["tasa_confirmacion"], s["flete_devolucion"],
                           s["comision_plataforma"], s["costo_fijo_por_pedido"], s["iva"])
    p, cp, f = cand["precio"], cand["costo_estimado"], cand["flete_estimado"]
    escenarios = {}
    for nombre, e in s["escenarios_entrega"].items():
        g = ganancia_por_pedido(p, cp, f, c, e, fd, k, fijo)
        g_iva = g - iva_por_pedido(p, cp, c, e, iva)
        escenarios[nombre] = {
            "entrega": e,
            "G": round(g),
            "G_con_iva": round(g_iva),
            "cpa_equilibrio": round(g),
            "roas_equilibrio": round(p / g, 2) if g > 0 else None,
            "cpa_objetivo": round(g - s["ganancia_deseada_por_pedido"]),
        }
    # Oferta de 2 unidades: un solo flete, diluye el costo fijo por paquete.
    e_base = s["escenarios_entrega"]["base"]
    p2 = cand.get("precio_2u")
    g2 = ganancia_por_pedido(p2, 2 * cp, f, c, e_base, fd, k, fijo) if p2 else None
    # Mezcla esperada: parte de los pedidos toma la oferta de 2 unidades.
    mezcla = s.get("mezcla_oferta_2u", 0) if g2 else 0
    g1 = escenarios["base"]["G"]
    g_mix = (1 - mezcla) * g1 + mezcla * (g2 or 0)
    aov = (1 - mezcla) * p + mezcla * (p2 or 0)
    return {
        "id": cand["id"],
        "precio": p,
        "margen_bruto": round((p - cp) / p, 3),
        "escenarios": escenarios,
        "mezcla_base": {"aov": round(aov), "G": round(g_mix), "roas_equilibrio": round(aov / g_mix, 2) if g_mix > 0 else None},
        "oferta_2u": {"precio": p2, "G_base": round(g2), "roas_equilibrio": round(p2 / g2, 2)} if g2 and g2 > 0 else None,
    }


def aplicar_costos_reales(cands):
    """Si el dueño anotó costo/flete reales en datos/verificacion_dropi.csv, reemplazan a los estimados."""
    import csv
    ruta = RAIZ / "datos" / "verificacion_dropi.csv"
    if not ruta.exists():
        return
    reales = {f["id"]: f for f in csv.DictReader(ruta.open(encoding="utf-8"))}
    num = lambda v: int("".join(ch for ch in (v or "") if ch.isdigit()) or 0)
    for c in cands:
        f = reales.get(c["id"])
        if not f:
            continue
        if num(f.get("costo_real_total")):
            c["costo_estimado"], c["costo_verificado"] = num(f["costo_real_total"]), True
        if num(f.get("flete_real")):
            c["flete_estimado"] = num(f["flete_real"])


def main():
    s = cargar("supuestos.json")
    cands = cargar("candidatos.json")["candidatos"]
    aplicar_costos_reales(cands)
    salida = {"supuestos_usados": {k: s[k] for k in ("tasa_confirmacion", "escenarios_entrega", "flete_devolucion", "comision_plataforma", "costo_fijo_por_pedido")},
              "productos": [evaluar(c, s) for c in cands]}
    (RAIZ / "datos" / "economia.json").write_text(json.dumps(salida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{'producto':32} {'margen':>6} {'G pes':>7} {'G base':>7} {'ROAS eq base':>12} {'G 2u':>7} {'ROAS eq mezcla':>14}")
    for r in salida["productos"]:
        esc = r["escenarios"]
        print(f"{r['id']:32} {r['margen_bruto']:>6.0%} {esc['pesimista']['G']:>7} {esc['base']['G']:>7} "
              f"{str(esc['base']['roas_equilibrio']):>12} {str(r['oferta_2u']['G_base'] if r['oferta_2u'] else '-'):>7} {str(r['mezcla_base']['roas_equilibrio']):>14}")


if __name__ == "__main__":
    main()
