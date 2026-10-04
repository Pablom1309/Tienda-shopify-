"""Nodo determinista: genera la tienda estática (sitio/) y el CSV de importación a Shopify.

Fuentes: datos/catalogo.json, datos/fichas.json, datos/marca.json, datos/tienda.json.
Imágenes: herramientas/plantilla/img/<nombre>.jpg (hero.jpg y <id-producto>.jpg). Si falta
una imagen se usa una ilustración SVG. Las imágenes generadas (no fotos del producto real)
se rotulan como "Imagen referencial".
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
PLANTILLA = RAIZ / "herramientas" / "plantilla"
REGIONES = ["Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso",
            "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos",
            "Los Lagos", "Aysén", "Magallanes"]

ICONOS = {
    "pago": '<path d="M3 7h18v10H3z"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/>',
    "envio": '<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/>',
    "garantia": '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    "retracto": '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v4h4"/>',
    "chat": '<path d="M4 5h16v11H9l-5 4z"/>',
    "check": '<path d="M5 12l5 5 9-10"/>',
    "kit": '<path d="M4 8h16v12H4z"/><path d="M2 8h20M12 8v12M12 8c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1"/>',
    "estrella": '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
}


def icono(nombre, clase="ico"):
    return f'<svg class="{clase}" viewBox="0 0 24 24" aria-hidden="true">{ICONOS[nombre]}</svg>'


def cargar(nombre):
    return json.loads((RAIZ / "datos" / nombre).read_text(encoding="utf-8"))


def clp(n):
    return "$" + f"{n:,}".replace(",", ".")


def e(t):
    return html.escape(str(t))


def imagen(nombre, alt, base, clase="foto", referencial=True):
    """<figure> con la imagen si existe en la plantilla; si no, ilustración SVG."""
    if (PLANTILLA / "img" / f"{nombre}.jpg").exists():
        nota = '<figcaption>Imagen referencial</figcaption>' if referencial else ""
        return f'<figure class="{clase}"><img src="{base}img/{nombre}.jpg" alt="{e(alt)}" loading="lazy" decoding="async">{nota}</figure>'
    return f'<figure class="{clase} ilus">{ilustracion(nombre)}</figure>'


def ilustracion(pid):
    if pid == "kit-pelo-cero":
        figura = '<rect x="60" y="70" width="120" height="60" rx="30" fill="var(--primario)"/><rect x="170" y="88" width="70" height="24" rx="12" fill="var(--primario)" opacity=".7"/><g fill="var(--acento)">' + "".join(f'<circle cx="{75 + i * 15}" cy="140" r="5"/>' for i in range(7)) + "</g>"
    else:
        figura = '<rect x="40" y="110" width="220" height="50" rx="14" fill="var(--primario)" opacity=".85"/><rect x="200" y="40" width="34" height="70" rx="10" fill="var(--acento)"/>'
    return f'<svg viewBox="0 0 300 200" role="img" aria-label="Ilustración del producto">{figura}</svg>'


def pagina(marca, tienda, titulo, descripcion, cuerpo, base="", canonica=None, imagen_og=None):
    c = marca["colores"]
    url = (tienda.get("url_sitio") or "").rstrip("/")
    can = f'<link rel="canonical" href="{e(url + "/" + canonica)}">' if url and canonica is not None else ""
    og = f'<meta property="og:image" content="{e(url + "/" + imagen_og)}">' if url and imagen_og else ""
    wa = tienda.get("whatsapp")
    flotante_wa = f'<a class="wa" href="https://wa.me/{e(wa)}" aria-label="Escríbenos por WhatsApp">{icono("chat")}</a>' if wa else ""
    return f"""<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(titulo)}</title>
<meta name="description" content="{e(descripcion)}">
<meta property="og:title" content="{e(titulo)}">
<meta property="og:description" content="{e(descripcion)}">
{og}
{can}
<meta name="theme-color" content="{c['primario']}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family={marca['tipografia']}:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{base}estilos.css">
<style>:root{{--primario:{c['primario']};--acento:{c['acento']};--fondo:{c['fondo']};--texto:{c['texto']}}}</style>
</head>
<body>
<div class="anuncio">{icono('pago', 'ico ico-s')} Pagas al recibir · {icono('envio', 'ico ico-s')} Despacho a todo Chile</div>
<header class="barra"><div class="contenedor barra-in"><a class="logo" href="{base}index.html"><svg class="logo-huella" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16" rx="5" ry="4"/><circle cx="5.5" cy="10" r="2.2"/><circle cx="9.5" cy="5.5" r="2.2"/><circle cx="14.5" cy="5.5" r="2.2"/><circle cx="18.5" cy="10" r="2.2"/></svg>{e(marca['nombre'])}</a><nav class="menu"><a href="{base}index.html#kits">Kits</a><a href="{base}despacho.html">Despacho</a><a href="{base}contacto.html">Contacto</a></nav></div></header>
<main>
{cuerpo}
</main>
<footer class="pie">
<div class="contenedor pie-in">
<div><p class="logo">{e(marca['nombre'])}</p><p>{e(marca['promesa'])}</p></div>
<nav><a href="{base}despacho.html">Despacho</a><a href="{base}cambios.html">Cambios, retracto y garantía</a><a href="{base}privacidad.html">Privacidad</a><a href="{base}contacto.html">Contacto</a></nav>
</div>
<p class="legal-pie">{e(tienda.get('razon_social') or marca['nombre'])}{' · RUT ' + e(tienda['rut']) if tienda.get('rut') else ''}{' · ' + e(tienda['direccion_comercial']) if tienda.get('direccion_comercial') else ''}</p>
</footer>
{flotante_wa}
<script src="{base}pedido.js" defer></script>
</body>
</html>
"""


def sellos(tienda):
    pl = tienda["plazos_despacho"]
    items = [("pago", "Pagas al recibir", "Sin tarjeta ni pagos por adelantado"),
             ("envio", "Despacho a todo Chile", f"RM {pl['RM']}"),
             ("garantia", "Garantía legal", "6 meses por fallas"),
             ("retracto", "Retracto", "10 días desde que lo recibes")]
    return '<ul class="sellos">' + "".join(f'<li>{icono(i)}<div><strong>{e(t)}</strong><span>{e(s)}</span></div></li>' for i, t, s in items) + "</ul>"


def formulario(prod, ficha, tienda):
    opciones = [(1, prod["precio"], "1 kit", ""), (2, prod["oferta_2"], "2 kits", f"Ahorras {clp(2 * prod['precio'] - prod['oferta_2'])}")]
    radios = "".join(
        f'<label class="opcion"><input type="radio" name="cantidad" value="{n}" data-precio="{p}" {"checked" if n == 1 else ""}>'
        f'<span class="opcion-txt"><strong>{e(t)}</strong>{f"<em>{e(a)}</em>" if a else ""}</span><span class="opcion-precio">{clp(p)}</span></label>'
        for n, p, t, a in opciones)
    tallas = ""
    if ficha.get("tallas"):
        tallas = '<label class="campo">Talla de alfombra<select name="talla" required>' + "".join(
            f'<option value="{e(t["talla"])}">{e(t["talla"])} — {e(t["recomendado"])}</option>' for t in ficha["tallas"]) + "</select></label>"
    comp = prod.get("complemento")
    extra = f'<label class="extra"><input type="checkbox" name="complemento" value="{comp["precio"]}" data-nombre="{e(comp["nombre"])}"><span>Agregar <strong>{e(comp["nombre"])}</strong></span><span class="opcion-precio">+{clp(comp["precio"])}</span></label>' if comp else ""
    regiones = "".join(f"<option>{e(r)}</option>" for r in REGIONES)
    aviso = "" if tienda.get("whatsapp") else '<p class="aviso">Estamos preparando la tienda: muy pronto podrás pedir aquí.</p>'
    return f"""<form class="pedido" id="pedido" data-producto="{e(ficha['titulo_seo'].split(':')[0])}" data-wa="{e(tienda.get('whatsapp') or '')}" novalidate>
<p class="pedido-tit">Elige tu oferta</p>
<div class="opciones">{radios}</div>
{tallas}
{extra}
<p class="pedido-tit">Datos de entrega</p>
<label class="campo">Nombre y apellido<input name="nombre" required autocomplete="name" placeholder="Ej: Camila Rojas"></label>
<label class="campo">Teléfono (WhatsApp)<input name="telefono" type="tel" required inputmode="tel" pattern="[0-9 +]{{8,15}}" placeholder="9 1234 5678" autocomplete="tel"></label>
<div class="fila">
<label class="campo">Región<select name="region" required><option value="">Elige</option>{regiones}</select></label>
<label class="campo">Comuna<input name="comuna" required autocomplete="address-level2" placeholder="Ej: Ñuñoa"></label>
</div>
<label class="campo">Dirección y referencias<input name="direccion" required placeholder="Calle, número, depto, referencia" autocomplete="street-address"></label>
<div class="total"><span>Total a pagar al recibir</span><strong id="total">{clp(prod['precio'])}</strong></div>
<button type="submit" class="boton boton-grande">{icono('chat')} Confirmar pedido por WhatsApp</button>
{aviso}
<p class="letra">{icono('garantia', 'ico ico-s')} Te escribimos para confirmar antes de despachar. Usamos tus datos solo para este pedido.</p>
</form>"""


def pagina_producto(prod, ficha, marca, tienda):
    benef = "".join(f'<li>{icono("check")}<div><strong>{e(b["titulo"])}</strong><p>{e(b["texto"])}</p></div></li>' for b in ficha["beneficios"])
    pasos = "".join(f'<li><span class="num">{i}</span><p>{e(p)}</p></li>' for i, p in enumerate(ficha["como_usar"], 1))
    incluye = "".join(f"<li>{icono('check', 'ico ico-s')}{e(i)}</li>" for i in ficha["incluye"])
    faq = "".join(f"<details><summary>{e(f['p'])}</summary><p>{e(f['r'])}</p></details>" for f in ficha["faq"])
    ahorro = 2 * prod["precio"] - prod["oferta_2"]
    datos_estructurados = {
        "@context": "https://schema.org", "@type": "Product", "name": ficha["titulo_seo"].split(" | ")[0],
        "description": ficha["meta_descripcion"], "brand": {"@type": "Brand", "name": marca["nombre"]},
        "offers": {"@type": "Offer", "priceCurrency": "CLP", "price": prod["precio"], "availability": "https://schema.org/InStock"},
    }
    cuerpo = f"""<section class="producto contenedor">
<div class="galeria">{imagen(prod['id'], ficha['alt_imagenes'][0], '../', 'foto foto-producto')}</div>
<div class="compra">
<span class="etiqueta">{icono('kit', 'ico ico-s')} Kit completo</span>
<h1>{e(ficha['titular'])}</h1>
<p class="sub">{e(ficha['subtitular'])}</p>
<div class="precio"><strong>{clp(prod['precio'])}</strong><span class="chip">Lleva 2 y ahorra {clp(ahorro)}</span></div>
<ul class="mini-sellos"><li>{icono('pago', 'ico ico-s')} Pagas al recibir</li><li>{icono('envio', 'ico ico-s')} RM {e(tienda['plazos_despacho']['RM'])}</li><li>{icono('garantia', 'ico ico-s')} Garantía 6 meses</li></ul>
{formulario(prod, ficha, tienda)}
</div>
</section>
<section class="banda"><div class="contenedor">{sellos(tienda)}</div></section>
<section class="seccion contenedor"><p class="sobretitulo">Por qué funciona</p><h2>Todo lo que necesitas, en un solo pedido</h2><ul class="beneficios">{benef}</ul></section>
<section class="seccion seccion-suave"><div class="contenedor dos-col"><div><p class="sobretitulo">Cómo se usa</p><h2>Listo en minutos</h2><ol class="pasos">{pasos}</ol></div><div class="caja"><h3>Qué incluye</h3><ul class="incluye">{incluye}</ul></div></div></section>
<section class="seccion contenedor"><p class="sobretitulo">Opiniones</p><h2>Reseñas reales, pronto</h2><p class="nota">Solo publicaremos opiniones de clientes que hayan recibido su pedido. Sin reseñas inventadas.</p></section>
<section class="seccion contenedor estrecho"><p class="sobretitulo">Preguntas frecuentes</p><h2>Resolvemos tus dudas</h2><div class="faq">{faq}</div></section>
<a class="flotante" href="#pedido">Pedir ahora · {clp(prod['precio'])}</a>
<script type="application/ld+json">{json.dumps(datos_estructurados, ensure_ascii=False)}</script>"""
    og = f"img/{prod['id']}.jpg" if (PLANTILLA / "img" / f"{prod['id']}.jpg").exists() else None
    return pagina(marca, tienda, ficha["titulo_seo"], ficha["meta_descripcion"], cuerpo, base="../",
                  canonica=f"productos/{ficha['handle']}.html", imagen_og=og)


def portada(productos, marca, tienda):
    tarjetas = "".join(f"""<a class="tarjeta" href="productos/{e(f['handle'])}.html">{imagen(p['id'], f['alt_imagenes'][0], '', 'foto foto-tarjeta')}
<div class="tarjeta-cuerpo"><span class="etiqueta">{e(p['rol'].split('(')[0].strip().capitalize())}</span><h3>{e(f['titulo_seo'].split(':')[0])}</h3><p>{e(f['subtitular'])}</p>
<div class="tarjeta-pie"><strong>{clp(p['precio'])}</strong><span class="boton boton-chico">Ver kit →</span></div></div></a>"""
                       for p, f in productos)
    pilares = "".join(f'<li>{icono(i)}<div><strong>{e(x["pilar"])}</strong><p>{e(x["prueba"])}</p></div></li>'
                      for i, x in zip(("kit", "garantia", "estrella"), marca["pilares"]))
    hero_img = f'<img class="hero-img" src="img/hero.jpg" alt="Perro y gato descansando en un living luminoso" fetchpriority="high">' if (PLANTILLA / "img" / "hero.jpg").exists() else ""
    cuerpo = f"""<section class="hero{' hero-con-img' if hero_img else ''}">{hero_img}
<div class="contenedor hero-in"><p class="sobretitulo">Kits de cuidado para perros y gatos</p>
<h1>{e(marca['promesa'])}</h1>
<p class="hero-sub">Soluciones completas para el pelo y el calor, probadas para la vida en casa. Te confirmamos por WhatsApp y pagas cuando llega.</p>
<div class="hero-acciones"><a class="boton boton-grande" href="#kits">Ver los kits</a><span class="hero-nota">{icono('pago', 'ico ico-s')} Pago contra entrega</span></div></div></section>
<section class="banda"><div class="contenedor">{sellos(tienda)}</div></section>
<section class="seccion contenedor" id="kits"><p class="sobretitulo">Nuestros kits</p><h2>Elige el que necesita tu casa</h2><div class="grilla">{tarjetas}</div></section>
<section class="seccion seccion-suave"><div class="contenedor"><p class="sobretitulo">Cómo trabajamos</p><h2>Comprar aquí es simple y seguro</h2><ul class="pilares">{pilares}</ul></div></section>
<section class="seccion contenedor cta-final"><h2>¿Dudas antes de pedir?</h2><p>Escríbenos y te ayudamos a elegir el kit para tu mascota.</p><a class="boton" href="contacto.html">Contáctanos</a></section>"""
    return pagina(marca, tienda, f"{marca['nombre']} — kits de cuidado para mascotas con pago al recibir", marca["promesa"],
                  cuerpo, canonica="", imagen_og="img/hero.jpg" if hero_img else None)


def legales(marca, tienda):
    pl = tienda["plazos_despacho"]
    falta = '<p class="aviso">Dato pendiente de completar por la tienda.</p>'
    contacto = "".join(f"<li><strong>{k}:</strong> {e(v)}</li>" for k, v in (("WhatsApp", tienda.get("whatsapp")), ("Correo", tienda.get("correo")), ("Dirección", tienda.get("direccion_comercial"))) if v) or ""
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
        (SITIO / archivo).write_text(pagina(marca, tienda, f"{titulo} | {marca['nombre']}", f"{titulo} de {marca['nombre']}",
                                            f'<section class="seccion contenedor estrecho legal">{cuerpo}</section>', canonica=archivo), encoding="utf-8")


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
        shutil.copy(PLANTILLA / archivo, SITIO / archivo)
    if (PLANTILLA / "img").exists():
        shutil.copytree(PLANTILLA / "img", SITIO / "img")
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
