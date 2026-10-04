"""Nodo determinista: genera la tienda estática (sitio/) y el CSV de importación a Shopify.

Fuentes: datos/catalogo.json, datos/fichas.json, datos/marca.json, datos/tienda.json.
El sitio funciona gratis en GitHub Pages: el formulario contra entrega arma el pedido
y lo envía por WhatsApp al número configurado en datos/tienda.json.
"""
import csv
import html
import json
import shutil
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITIO = RAIZ / "sitio"
REGIONES = ["Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso",
            "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos",
            "Los Lagos", "Aysén", "Magallanes"]


def cargar(nombre):
    return json.loads((RAIZ / "datos" / nombre).read_text(encoding="utf-8"))


def clp(n):
    return "$" + f"{n:,}".replace(",", ".")


def e(t):
    return html.escape(str(t))


def pagina(marca, tienda, titulo, descripcion, cuerpo, base="", canonica=None):
    c = marca["colores"]
    url = tienda.get("url_sitio")
    can = f'<link rel="canonical" href="{e(url.rstrip("/") + "/" + canonica)}">' if url and canonica is not None else ""
    return f"""<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(titulo)}</title>
<meta name="description" content="{e(descripcion)}">
{can}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family={marca['tipografia']}:wght@400;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{base}estilos.css">
<style>:root{{--primario:{c['primario']};--acento:{c['acento']};--fondo:{c['fondo']};--texto:{c['texto']}}}</style>
</head>
<body>
<header class="barra"><a class="logo" href="{base}index.html">{e(marca['nombre'])}</a><span class="sello">Pagas al recibir · Despacho a todo Chile</span></header>
<main>
{cuerpo}
</main>
<footer class="pie">
<nav><a href="{base}despacho.html">Despacho</a><a href="{base}cambios.html">Cambios, retracto y garantía</a><a href="{base}privacidad.html">Privacidad</a><a href="{base}contacto.html">Contacto</a></nav>
<p>{e(tienda.get('razon_social') or marca['nombre'])}{' · RUT ' + e(tienda['rut']) if tienda.get('rut') else ''}{' · ' + e(tienda['direccion_comercial']) if tienda.get('direccion_comercial') else ''}</p>
</footer>
<script src="{base}pedido.js" defer></script>
</body>
</html>
"""


def ilustracion(pid):
    """Ilustración SVG mientras no haya fotos reales del producto (nunca imágenes ajenas)."""
    if pid == "kit-pelo-cero":
        figura = '<rect x="60" y="70" width="120" height="60" rx="30" fill="var(--primario)"/><rect x="170" y="88" width="70" height="24" rx="12" fill="var(--primario)" opacity=".7"/><g fill="var(--acento)">' + "".join(f'<circle cx="{75 + i * 15}" cy="140" r="5"/>' for i in range(7)) + '</g><path d="M70 50c10-12 20 12 30 0s20 12 30 0 20 12 30 0" stroke="var(--primario)" stroke-width="4" fill="none" opacity=".5"/>'
    else:
        figura = '<rect x="40" y="110" width="220" height="50" rx="14" fill="var(--primario)" opacity=".85"/><path d="M60 125h180M60 145h180" stroke="#fff" stroke-width="3" opacity=".4"/><rect x="200" y="40" width="34" height="70" rx="10" fill="var(--acento)"/><rect x="190" y="30" width="54" height="16" rx="8" fill="var(--acento)" opacity=".7"/>'
    return f'<svg viewBox="0 0 300 200" role="img" aria-label="Ilustración del producto (foto real pendiente)" class="ilus"><rect width="300" height="200" rx="20" fill="#fff"/>{figura}</svg>'


def formulario(prod, ficha, tienda):
    opciones = [(1, prod["precio"], "1 kit"), (2, prod["oferta_2"], f"2 kits (ahorras {clp(2 * prod['precio'] - prod['oferta_2'])})")]
    radios = "".join(
        f'<label class="opcion"><input type="radio" name="cantidad" value="{n}" data-precio="{p}" {"checked" if n == 1 else ""}><span>{e(t)}</span><strong>{clp(p)}</strong></label>'
        for n, p, t in opciones)
    tallas = ""
    if ficha.get("tallas"):
        tallas = '<label>Talla de alfombra<select name="talla" required>' + "".join(
            f'<option value="{e(t["talla"])}">{e(t["talla"])} — {e(t["recomendado"])}</option>' for t in ficha["tallas"]) + "</select></label>"
    comp = prod.get("complemento")
    extra = f'<label class="check"><input type="checkbox" name="complemento" value="{comp["precio"]}" data-nombre="{e(comp["nombre"])}"> Agregar {e(comp["nombre"])} por {clp(comp["precio"])}</label>' if comp else ""
    regiones = "".join(f"<option>{e(r)}</option>" for r in REGIONES)
    aviso = "" if tienda.get("whatsapp") else '<p class="aviso">Tienda en preparación: los pedidos se habilitan cuando se configure el WhatsApp de atención.</p>'
    return f"""<form class="pedido" id="pedido" data-producto="{e(ficha['titular'])}" data-nombre="{e(prod['id'])}" data-wa="{e(tienda.get('whatsapp') or '')}">
<h2>Pide ahora, pagas al recibir</h2>
{radios}
{tallas}
{extra}
<label>Nombre y apellido<input name="nombre" required autocomplete="name"></label>
<label>Teléfono (WhatsApp)<input name="telefono" required inputmode="tel" pattern="[0-9 +]{{8,15}}" placeholder="9 1234 5678" autocomplete="tel"></label>
<label>Región<select name="region" required><option value="">Elige tu región</option>{regiones}</select></label>
<label>Comuna<input name="comuna" required autocomplete="address-level2"></label>
<label>Dirección y referencias<input name="direccion" required placeholder="Calle, número, depto, referencia" autocomplete="street-address"></label>
<p class="total">Total a pagar al recibir: <strong id="total">{clp(prod['precio'])}</strong></p>
<button type="submit">Confirmar pedido por WhatsApp</button>
{aviso}
<p class="letra">Te escribiremos para confirmar antes de despachar. Usamos tus datos solo para gestionar este pedido.</p>
</form>"""


def pagina_producto(prod, ficha, marca, tienda):
    benef = "".join(f'<li><strong>{e(b["titulo"])}</strong><span>{e(b["texto"])}</span></li>' for b in ficha["beneficios"])
    pasos = "".join(f"<li>{e(p)}</li>" for p in ficha["como_usar"])
    incluye = "".join(f"<li>{e(i)}</li>" for i in ficha["incluye"])
    faq = "".join(f"<details><summary>{e(f['p'])}</summary><p>{e(f['r'])}</p></details>" for f in ficha["faq"])
    plazos = tienda["plazos_despacho"]
    datos_estructurados = {
        "@context": "https://schema.org", "@type": "Product", "name": ficha["titulo_seo"].split(" | ")[0],
        "description": ficha["meta_descripcion"], "brand": {"@type": "Brand", "name": marca["nombre"]},
        "offers": {"@type": "Offer", "priceCurrency": "CLP", "price": prod["precio"], "availability": "https://schema.org/InStock"},
    }
    cuerpo = f"""<section class="heroe">
<div class="media">{ilustracion(prod['id'])}<p class="nota-foto">Foto real del producto: pendiente de la muestra.</p></div>
<div class="compra">
<h1>{e(ficha['titular'])}</h1>
<p class="sub">{e(ficha['subtitular'])}</p>
<p class="precio">{clp(prod['precio'])} <span>o 2 por {clp(prod['oferta_2'])}</span></p>
<ul class="confianza"><li>💵 Pagas al recibir</li><li>🚚 RM {e(plazos['RM'])} · Regiones {e(plazos['regiones'])}</li><li>🛡️ Garantía legal 6 meses · Retracto 10 días</li></ul>
{formulario(prod, ficha, tienda)}
</div>
</section>
<section class="bloque"><h2>Por qué funciona</h2><ul class="beneficios">{benef}</ul></section>
<section class="bloque"><h2>Cómo se usa</h2><ol class="pasos">{pasos}</ol><h3>Qué incluye</h3><ul>{incluye}</ul></section>
<section class="bloque"><h2>Reseñas</h2><p>Todavía no tenemos reseñas: solo publicaremos opiniones de clientes que hayan recibido su pedido.</p></section>
<section class="bloque"><h2>Preguntas frecuentes</h2>{faq}</section>
<a class="flotante" href="#pedido">Pedir ahora · {clp(prod['precio'])}</a>
<script type="application/ld+json">{json.dumps(datos_estructurados, ensure_ascii=False)}</script>"""
    return pagina(marca, tienda, ficha["titulo_seo"], ficha["meta_descripcion"], cuerpo, base="../", canonica=f"productos/{ficha['handle']}.html")


def portada(productos, marca, tienda):
    tarjetas = "".join(f"""<a class="tarjeta" href="productos/{e(f['handle'])}.html">{ilustracion(p['id'])}<h3>{e(f['titulo_seo'].split(':')[0])}</h3><p>{e(f['subtitular'])}</p><strong>{clp(p['precio'])}</strong></a>"""
                       for p, f in productos)
    pilares = "".join(f"<li><strong>{e(x['pilar'])}</strong><span>{e(x['prueba'])}</span></li>" for x in marca["pilares"])
    cuerpo = f"""<section class="portada"><h1>{e(marca['promesa'])}</h1><p>Kits de cuidado en casa para perros y gatos. Te confirmamos por WhatsApp y pagas cuando llega.</p></section>
<section class="grilla">{tarjetas}</section>
<section class="bloque"><h2>Cómo trabajamos</h2><ul class="beneficios">{pilares}</ul></section>"""
    return pagina(marca, tienda, f"{marca['nombre']} — kits de cuidado para mascotas con pago al recibir", marca["promesa"], cuerpo, canonica="")


def legales(marca, tienda):
    pl = tienda["plazos_despacho"]
    falta = '<p class="aviso">Dato pendiente de completar por la tienda.</p>'
    contacto = "".join(f"<li>{k}: {e(v)}</li>" for k, v in (("WhatsApp", tienda.get("whatsapp")), ("Correo", tienda.get("correo")), ("Dirección", tienda.get("direccion_comercial"))) if v) or ""
    paginas = {
        "despacho.html": ("Despacho", f"""<h1>Despacho</h1><p>Despachamos a todo Chile con pago contra entrega. Antes de enviar, confirmamos cada pedido por WhatsApp.</p>
<ul><li>Región Metropolitana: {e(pl['RM'])}.</li><li>Otras regiones: {e(pl['regiones'])}.</li><li>Zonas extremas: {e(pl['zonas_extremas'])}.</li></ul>
<p>El plazo corre desde la confirmación del pedido. Si la transportadora no puede entregar, te contactamos para coordinar un nuevo intento.</p>"""),
        "cambios.html": ("Cambios, retracto y garantía", """<h1>Cambios, retracto y garantía</h1>
<h2>Derecho a retracto</h2><p>Tienes 10 días desde que recibes el producto para retractarte de la compra, con el producto sin uso y en su empaque (Ley 19.496).</p>
<h2>Garantía legal</h2><p>Si el producto presenta una falla, tienes 6 meses desde la recepción para elegir entre cambio, reparación o devolución del dinero.</p>
<h2>Cómo solicitarlo</h2><p>Escríbenos por WhatsApp o correo con tu número de pedido y una foto del producto. Te respondemos en un máximo de 2 días hábiles.</p>"""),
        "privacidad.html": ("Privacidad", """<h1>Política de privacidad</h1><p>Usamos tu nombre, teléfono y dirección solo para confirmar, despachar y dar soporte a tu pedido. Los compartimos únicamente con el proveedor y la transportadora que lo entregan.</p>
<p>No enviamos mensajes promocionales sin tu consentimiento expreso. Puedes pedir acceso, corrección o eliminación de tus datos escribiéndonos (Ley 19.628 y Ley 21.719).</p>"""),
        "contacto.html": ("Contacto", f"<h1>Contacto</h1><ul>{contacto}</ul>{'' if contacto else falta}"),
    }
    for archivo, (titulo, cuerpo) in paginas.items():
        (SITIO / archivo).write_text(pagina(marca, tienda, f"{titulo} | {marca['nombre']}", f"{titulo} de {marca['nombre']}", f'<section class="bloque legal">{cuerpo}</section>', canonica=archivo), encoding="utf-8")


def csv_shopify(productos, marca):
    cols = ["Handle", "Title", "Body (HTML)", "Vendor", "Product Category", "Type", "Tags", "Published",
            "Option1 Name", "Option1 Value", "Variant SKU", "Variant Inventory Policy", "Variant Fulfillment Service",
            "Variant Price", "Variant Requires Shipping", "Variant Taxable", "SEO Title", "SEO Description", "Status"]
    destino = RAIZ / "shopify" / "productos.csv"
    with destino.open("w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(cols)
        for p, f in productos:
            cuerpo = "<p>" + html.escape(f["subtitular"]) + "</p><ul>" + "".join(f"<li><strong>{html.escape(b['titulo'])}</strong>: {html.escape(b['texto'])}</li>" for b in f["beneficios"]) + "</ul>"
            variantes = [t["talla"] for t in f.get("tallas", [])] or ["Default Title"]
            for i, v in enumerate(variantes):
                primera = i == 0
                w.writerow([f["handle"], f["titulo_seo"].split(" | ")[0] if primera else "", cuerpo if primera else "",
                            marca["nombre"] if primera else "", "", "Mascotas" if primera else "", "mascotas,kit,contra-entrega" if primera else "",
                            "FALSE" if primera else "", "Talla" if f.get("tallas") else "Title", v,
                            (f"HS-{p['id'].upper()}" + ("" if v == "Default Title" else f"-{v}"))[:40], "deny", "manual", p["precio"], "TRUE", "TRUE",
                            f["titulo_seo"] if primera else "", f["meta_descripcion"] if primera else "", "draft" if primera else ""])


def main():
    marca, tienda = cargar("marca.json"), cargar("tienda.json")
    fichas = {f["id"]: f for f in cargar("fichas.json")["fichas"]}
    productos = [(p, fichas[p["id"]]) for p in cargar("catalogo.json")["productos"]
                 if p["estado"] in ("aprobado_para_test", "escalar") and p["id"] in fichas]
    if SITIO.exists():
        shutil.rmtree(SITIO)
    (SITIO / "productos").mkdir(parents=True)
    for archivo in ("estilos.css", "pedido.js"):
        shutil.copy(RAIZ / "herramientas" / "plantilla" / archivo, SITIO / archivo)
    (SITIO / "index.html").write_text(portada(productos, marca, tienda), encoding="utf-8")
    for p, f in productos:
        (SITIO / "productos" / f"{f['handle']}.html").write_text(pagina_producto(p, f, marca, tienda), encoding="utf-8")
    legales(marca, tienda)
    (SITIO / "robots.txt").write_text("User-agent: *\nAllow: /\n" + (f"Sitemap: {tienda['url_sitio'].rstrip('/')}/sitemap.xml\n" if tienda.get("url_sitio") else ""), encoding="utf-8")
    if tienda.get("url_sitio"):
        base = tienda["url_sitio"].rstrip("/")
        urls = [base + "/"] + [f"{base}/productos/{f['handle']}.html" for _, f in productos]
        (SITIO / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "".join(f"<url><loc>{u}</loc></url>" for u in urls) + "</urlset>\n", encoding="utf-8")
    csv_shopify(productos, marca)
    print(f"Sitio: {len(productos)} productos -> {SITIO.relative_to(RAIZ)}/ ; CSV Shopify -> shopify/productos.csv")


if __name__ == "__main__":
    main()
