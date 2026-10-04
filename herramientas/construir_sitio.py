"""Nodo determinista: genera la tienda estática (sitio/) y el CSV de importación a Shopify.

Fuentes: datos/catalogo.json, datos/fichas.json, datos/marca.json, datos/tienda.json.
Imágenes: herramientas/plantilla/img/<nombre>.jpg (+ .webp opcional): hero y <id-producto>.
Si falta una imagen se usa una ilustración SVG. Las imágenes generadas (no fotos del producto
real) se rotulan como "Imagen referencial".
El sitio funciona gratis en GitHub Pages: el formulario contra entrega arma el pedido
y lo envía por WhatsApp al número configurado en datos/tienda.json.
"""
import csv
import html
import json
import shutil
import subprocess
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITIO = RAIZ / "sitio"
PLANTILLA = RAIZ / "herramientas" / "plantilla"
REGIONES = ["Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo", "Valparaíso",
            "Metropolitana", "O'Higgins", "Maule", "Ñuble", "Biobío", "La Araucanía", "Los Ríos",
            "Los Lagos", "Aysén", "Magallanes"]
REGIONES_EXTREMAS = {"Aysén", "Magallanes"}

ICONOS = {
    "pago": '<path d="M3 7h18v10H3z"/><circle cx="12" cy="12" r="2.5"/><path d="M6 10v4M18 10v4"/>',
    "envio": '<path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z"/><circle cx="6" cy="17.5" r="1.5"/><circle cx="17" cy="17.5" r="1.5"/>',
    "garantia": '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    "retracto": '<path d="M4 12a8 8 0 1 0 3-6.2"/><path d="M4 4v4h4"/>',
    "chat": '<path d="M4 5h16v11H9l-5 4z"/>',
    "check": '<path d="M5 12l5 5 9-10"/>',
    "x": '<path d="M6 6l12 12M18 6L6 18"/>',
    "kit": '<path d="M4 8h16v12H4z"/><path d="M2 8h20M12 8v12M12 8c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1"/>',
    "estrella": '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    "carro": '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11L21 7H6.5"/>',
    "calendario": '<path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"/>',
    "flecha": '<path d="M5 12h14M13 6l6 6-6 6"/>',
}


def icono(nombre, clase="ico"):
    return f'<svg class="{clase}" viewBox="0 0 24 24" aria-hidden="true">{ICONOS[nombre]}</svg>'


def cargar(nombre):
    return json.loads((RAIZ / "datos" / nombre).read_text(encoding="utf-8"))


def clp(n):
    return "$" + f"{n:,}".replace(",", ".")


def e(t):
    return html.escape(str(t))


def tamano(ruta):
    """(ancho, alto) con ImageMagick si está; evita saltos de diseño (CLS)."""
    try:
        w, h = subprocess.run(["identify", "-format", "%w %h", str(ruta)], capture_output=True, text=True, check=True).stdout.split()
        return int(w), int(h)
    except (OSError, subprocess.CalledProcessError, ValueError):
        return None


def img_tag(nombre, alt, base, clase="", carga="lazy", prioridad=False, sizes="100vw"):
    jpg = PLANTILLA / "img" / f"{nombre}.jpg"
    if not jpg.exists():
        return None
    dim = tamano(jpg)
    wh = f' width="{dim[0]}" height="{dim[1]}"' if dim else ""
    fuentes = []
    if (PLANTILLA / "img" / f"{nombre}.webp").exists():
        srcset = f"{base}img/{nombre}.webp {dim[0] if dim else 1200}w"
        if (PLANTILLA / "img" / f"{nombre}-900.webp").exists():
            srcset = f"{base}img/{nombre}-900.webp 900w, " + srcset
        fuentes.append(f'<source type="image/webp" srcset="{srcset}" sizes="{sizes}">')
    pr = ' fetchpriority="high"' if prioridad else ""
    return (f'<picture>{"".join(fuentes)}<img class="{clase}" src="{base}img/{nombre}.jpg" alt="{e(alt)}"{wh} '
            f'loading="{carga}" decoding="async"{pr}></picture>')


def imagen(nombre, alt, base, clase="foto", referencial=True, sizes="(min-width:900px) 50vw, 100vw"):
    tag = img_tag(nombre, alt, base, sizes=sizes)
    if tag:
        nota = '<figcaption>Imagen referencial</figcaption>' if referencial else ""
        return f'<figure class="{clase}">{tag}{nota}</figure>'
    return f'<figure class="{clase} ilus">{ilustracion(nombre)}</figure>'


def ilustracion(pid):
    if pid == "kit-pelo-cero":
        figura = '<rect x="60" y="70" width="120" height="60" rx="30" fill="var(--primario)"/><rect x="170" y="88" width="70" height="24" rx="12" fill="var(--primario)" opacity=".7"/>'
    else:
        figura = '<rect x="40" y="110" width="220" height="50" rx="14" fill="var(--primario)" opacity=".85"/><rect x="200" y="40" width="34" height="70" rx="10" fill="var(--acento)"/>'
    return f'<svg viewBox="0 0 300 200" role="img" aria-label="Ilustración del producto">{figura}</svg>'


def ld(datos):
    return f'<script type="application/ld+json">{json.dumps(datos, ensure_ascii=False)}</script>'


def pagina(marca, tienda, titulo, descripcion, cuerpo, base="", canonica=None, imagen_og=None, precarga=None, extra_ld=()):
    c = marca["colores"]
    url = (tienda.get("url_sitio") or "").rstrip("/")
    can = f'<link rel="canonical" href="{e(url + "/" + canonica)}">' if url and canonica is not None else ""
    og = f'<meta property="og:image" content="{e(url + "/" + imagen_og)}">' if url and imagen_og else ""
    pre = f'<link rel="preload" as="image" href="{base}{precarga}" fetchpriority="high">' if precarga else ""
    wa = tienda.get("whatsapp")
    flotante_wa = f'<a class="wa" href="https://wa.me/{e(wa)}" aria-label="Escríbenos por WhatsApp">{icono("chat")}</a>' if wa else ""
    org = {"@context": "https://schema.org", "@type": "Organization", "name": marca["nombre"], "slogan": marca["promesa"]}
    if url:
        org["url"] = url + "/"
    if tienda.get("correo"):
        org["email"] = tienda["correo"]
    scripts = "".join(ld(x) for x in (org, *extra_ld))
    return f"""<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(titulo)}</title>
<meta name="description" content="{e(descripcion)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="es_CL">
<meta property="og:site_name" content="{e(marca['nombre'])}">
<meta property="og:title" content="{e(titulo)}">
<meta property="og:description" content="{e(descripcion)}">
{og}
<meta name="twitter:card" content="summary_large_image">
{can}
<meta name="theme-color" content="{c['primario']}">
<link rel="icon" href="{base}favicon.svg" type="image/svg+xml">
{pre}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family={marca['tipografia']}:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{base}estilos.css">
<style>:root{{--primario:{c['primario']};--acento:{c['acento']};--fondo:{c['fondo']};--texto:{c['texto']}}}</style>
{scripts}
</head>
<body>
<a class="saltar" href="#contenido">Saltar al contenido</a>
<div class="anuncio"><span>{icono('pago', 'ico ico-s')} Pagas al recibir</span><span class="sep" aria-hidden="true">·</span><span>{icono('envio', 'ico ico-s')} Despacho a todo Chile</span><span class="sep ocultar-movil" aria-hidden="true">·</span><span class="ocultar-movil">{icono('garantia', 'ico ico-s')} Garantía legal 6 meses</span></div>
<header class="barra"><div class="contenedor barra-in"><a class="logo" href="{base}index.html" aria-label="{e(marca['nombre'])}, inicio"><svg class="logo-huella" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="16" rx="5" ry="4"/><circle cx="5.5" cy="10" r="2.2"/><circle cx="9.5" cy="5.5" r="2.2"/><circle cx="14.5" cy="5.5" r="2.2"/><circle cx="18.5" cy="10" r="2.2"/></svg>{e(marca['nombre'])}</a>
<nav class="menu" aria-label="Principal"><a href="{base}index.html#kits">Kits</a><a href="{base}index.html#como-funciona">Cómo funciona</a><a href="{base}index.html#preguntas">Preguntas</a><a class="boton boton-chico" href="{base}index.html#kits">{icono('carro', 'ico ico-s')} Comprar</a></nav></div></header>
<main id="contenido">
{cuerpo}
</main>
<footer class="pie">
<div class="contenedor pie-in">
<div class="pie-marca"><p class="logo">{e(marca['nombre'])}</p><p>{e(marca['promesa'])}</p><p class="pie-sello">{icono('pago', 'ico ico-s')} Pago contra entrega · {icono('envio', 'ico ico-s')} Envíos a todo Chile</p></div>
<div><p class="pie-tit">Tienda</p><nav class="pie-nav"><a href="{base}index.html#kits">Kits</a><a href="{base}index.html#como-funciona">Cómo funciona</a><a href="{base}index.html#preguntas">Preguntas frecuentes</a></nav></div>
<div><p class="pie-tit">Ayuda</p><nav class="pie-nav"><a href="{base}despacho.html">Despacho</a><a href="{base}cambios.html">Cambios, retracto y garantía</a><a href="{base}privacidad.html">Privacidad</a><a href="{base}contacto.html">Contacto</a></nav></div>
</div>
<p class="legal-pie">© {e(tienda.get('razon_social') or marca['nombre'])}{' · RUT ' + e(tienda['rut']) if tienda.get('rut') else ''}{' · ' + e(tienda['direccion_comercial']) if tienda.get('direccion_comercial') else ''} · Precios en pesos chilenos, IVA incluido.</p>
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


def como_funciona():
    pasos = [("carro", "Haz tu pedido", "Elige tu kit y deja tus datos de entrega. No pagas nada en la web."),
             ("chat", "Te confirmamos por WhatsApp", "Revisamos dirección y plazo contigo antes de despachar."),
             ("pago", "Pagas cuando llega", "Recibes el kit en tu puerta y pagas al repartidor.")]
    items = "".join(f'<li class="revelar"><span class="paso-num">{i}</span>{icono(ic)}<h3>{e(t)}</h3><p>{e(d)}</p></li>' for i, (ic, t, d) in enumerate(pasos, 1))
    return f'<section class="seccion contenedor" id="como-funciona"><p class="sobretitulo">Cómo funciona</p><h2>Comprar con pago contra entrega es así de simple</h2><ol class="tres-pasos">{items}</ol></section>'


def faq_general(tienda):
    pl = tienda["plazos_despacho"]
    preguntas = [
        ("¿Cómo funciona el pago contra entrega?", "Haces el pedido en la web sin pagar nada. Te confirmamos por WhatsApp y pagas al repartidor cuando recibes el producto."),
        ("¿Cuánto demora el despacho?", f"Región Metropolitana: {pl['RM']}. Otras regiones: {pl['regiones']}. Zonas extremas: {pl['zonas_extremas']}."),
        ("¿Y si el producto no me sirve?", "Tienes 10 días de retracto desde que lo recibes (sin uso y en su empaque) y 6 meses de garantía legal por fallas."),
        ("¿Por qué venden kits y no productos sueltos?", "Porque un problema casi nunca se resuelve con una sola pieza. El kit trae lo necesario para la mascota y para la casa, y te ahorra un segundo despacho."),
        ("¿Las fotos son del producto real?", "Algunas imágenes son referenciales y lo indicamos en cada una. La descripción, lo que incluye y el precio son exactos."),
    ]
    return preguntas


def bloque_faq(preguntas, titulo="Preguntas frecuentes", id_="preguntas"):
    items = "".join(f"<details><summary>{e(p)}</summary><div class='faq-r'><p>{e(r)}</p></div></details>" for p, r in preguntas)
    return f'<section class="seccion contenedor estrecho" id="{id_}"><p class="sobretitulo">{e(titulo)}</p><h2>Resolvemos tus dudas</h2><div class="faq">{items}</div></section>'


def ld_faq(preguntas):
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": p, "acceptedAnswer": {"@type": "Answer", "text": r}} for p, r in preguntas]}


def formulario(prod, ficha, tienda):
    unidad2 = round(prod["oferta_2"] / 2)
    opciones = [(1, prod["precio"], "1 kit", "", ""),
                (2, prod["oferta_2"], "2 kits", f"{clp(unidad2)} c/u · ahorras {clp(2 * prod['precio'] - prod['oferta_2'])}", "Mejor precio")]
    radios = "".join(
        f'<label class="opcion"><input type="radio" name="cantidad" value="{n}" data-precio="{p}" {"checked" if n == 1 else ""}>'
        f'<span class="opcion-txt"><strong>{e(t)}</strong>{f"<em>{e(a)}</em>" if a else ""}</span>'
        f'{f"<span class=insignia>{e(b)}</span>" if b else ""}<span class="opcion-precio">{clp(p)}</span></label>'
        for n, p, t, a, b in opciones)
    tallas = ""
    if ficha.get("tallas"):
        tallas = '<label class="campo">Talla de alfombra<select name="talla" required>' + "".join(
            f'<option value="{e(t["talla"])}">{e(t["talla"])} — {e(t["recomendado"])}</option>' for t in ficha["tallas"]) + "</select></label>"
    comp = prod.get("complemento")
    extra = f'<label class="extra"><input type="checkbox" name="complemento" value="{comp["precio"]}" data-nombre="{e(comp["nombre"])}"><span>Agregar <strong>{e(comp["nombre"])}</strong></span><span class="opcion-precio">+{clp(comp["precio"])}</span></label>' if comp else ""
    regiones = "".join(f'<option data-zona="{"extrema" if r in REGIONES_EXTREMAS else ("rm" if r == "Metropolitana" else "regiones")}">{e(r)}</option>' for r in REGIONES)
    aviso = "" if tienda.get("whatsapp") else '<p class="aviso">Estamos preparando la tienda: muy pronto podrás pedir aquí.</p>'
    return f"""<form class="pedido" id="pedido" data-producto="{e(ficha['titulo_seo'].split(':')[0])}" data-id="{e(prod['id'])}" data-wa="{e(tienda.get('whatsapp') or '')}" novalidate>
<p class="pedido-tit">1. Elige tu oferta</p>
<div class="opciones">{radios}</div>
{tallas}
{extra}
<p class="pedido-tit">2. Datos de entrega</p>
<label class="campo">Nombre y apellido<input name="nombre" required autocomplete="name" placeholder="Ej: Camila Rojas"><small class="error-txt">Escribe tu nombre.</small></label>
<label class="campo">Teléfono (WhatsApp)<input name="telefono" type="tel" required inputmode="tel" pattern="[0-9 +]{{8,15}}" placeholder="9 1234 5678" autocomplete="tel"><small class="error-txt">Revisa el número (8 a 15 dígitos).</small></label>
<div class="fila">
<label class="campo">Región<select name="region" required><option value="">Elige</option>{regiones}</select><small class="error-txt">Elige tu región.</small></label>
<label class="campo">Comuna<input name="comuna" required autocomplete="address-level2" placeholder="Ej: Ñuñoa"><small class="error-txt">Escribe tu comuna.</small></label>
</div>
<label class="campo">Dirección y referencias<input name="direccion" required placeholder="Calle, número, depto, referencia" autocomplete="street-address"><small class="error-txt">Escribe tu dirección.</small></label>
<p class="entrega" id="entrega" hidden>{icono('calendario', 'ico ico-s')} <span></span></p>
<div class="total"><span>Total a pagar al recibir</span><strong id="total">{clp(prod['precio'])}</strong></div>
<button type="submit" class="boton boton-grande">{icono('chat')} Confirmar pedido por WhatsApp</button>
{aviso}
<ul class="garantias-form"><li>{icono('pago', 'ico ico-s')} No pagas nada ahora</li><li>{icono('retracto', 'ico ico-s')} 10 días de retracto</li><li>{icono('garantia', 'ico ico-s')} Datos protegidos</li></ul>
</form>"""


def comparacion(prod, ficha):
    filas = [("Lo necesario para la mascota y la casa", True, False),
             ("Un solo despacho", True, False),
             ("Pagas al recibir", True, None),
             ("Confirmación por WhatsApp antes de despachar", True, None),
             ("Garantía legal y retracto con un solo vendedor", True, False)]
    def celda(v):
        if v is None:
            return '<td class="tal-vez">Depende</td>'
        return f'<td class="{"si" if v else "no"}">{icono("check" if v else "x", "ico ico-s")}<span class="sr">{"Sí" if v else "No"}</span></td>'
    cuerpo = "".join(f"<tr><th scope='row'>{e(t)}</th>{celda(a)}{celda(b)}</tr>" for t, a, b in filas)
    return f"""<section class="seccion contenedor estrecho"><p class="sobretitulo">Por qué un kit</p><h2>El kit frente a comprar por partes</h2>
<div class="tabla-envoltura"><table class="comparacion"><thead><tr><th></th><th scope="col">{e(ficha['titulo_seo'].split(':')[0])}</th><th scope="col">Piezas sueltas</th></tr></thead><tbody>{cuerpo}</tbody></table></div></section>"""


def pagina_producto(prod, ficha, marca, tienda):
    benef = "".join(f'<li class="revelar">{icono("check")}<div><strong>{e(b["titulo"])}</strong><p>{e(b["texto"])}</p></div></li>' for b in ficha["beneficios"])
    pasos = "".join(f'<li><span class="num">{i}</span><p>{e(p)}</p></li>' for i, p in enumerate(ficha["como_usar"], 1))
    incluye = "".join(f"<li>{icono('check', 'ico ico-s')}{e(i)}</li>" for i in ficha["incluye"])
    ahorro = 2 * prod["precio"] - prod["oferta_2"]
    nombre = ficha["titulo_seo"].split(":")[0]
    url = (tienda.get("url_sitio") or "").rstrip("/")
    preguntas = [(f["p"], f["r"]) for f in ficha["faq"]]
    producto_ld = {
        "@context": "https://schema.org", "@type": "Product", "name": ficha["titulo_seo"].split(" | ")[0],
        "description": ficha["meta_descripcion"], "brand": {"@type": "Brand", "name": marca["nombre"]}, "sku": f"HS-{prod['id'].upper()}",
        "offers": {"@type": "Offer", "priceCurrency": "CLP", "price": prod["precio"], "availability": "https://schema.org/InStock",
                   "itemCondition": "https://schema.org/NewCondition",
                   "hasMerchantReturnPolicy": {"@type": "MerchantReturnPolicy", "applicableCountry": "CL",
                                               "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow", "merchantReturnDays": 10},
                   "shippingDetails": {"@type": "OfferShippingDetails", "shippingDestination": {"@type": "DefinedRegion", "addressCountry": "CL"}}},
    }
    if url and (PLANTILLA / "img" / f"{prod['id']}.jpg").exists():
        producto_ld["image"] = f"{url}/img/{prod['id']}.jpg"
    migas_ld = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Inicio", **({"item": url + "/"} if url else {})},
        {"@type": "ListItem", "position": 2, "name": nombre}]}
    cuerpo = f"""<nav class="migas contenedor" aria-label="Migas de pan"><a href="../index.html">Inicio</a><span aria-hidden="true">/</span><a href="../index.html#kits">Kits</a><span aria-hidden="true">/</span><span aria-current="page">{e(nombre)}</span></nav>
<section class="producto contenedor">
<div class="galeria">{imagen(prod['id'], ficha['alt_imagenes'][0], '../', 'foto foto-producto')}
<ul class="galeria-sellos"><li>{icono('pago', 'ico ico-s')} Pago contra entrega</li><li>{icono('envio', 'ico ico-s')} Envío a todo Chile</li><li>{icono('retracto', 'ico ico-s')} 10 días de retracto</li></ul></div>
<div class="compra">
<span class="etiqueta">{icono('kit', 'ico ico-s')} Kit completo · {len(ficha['incluye'])} piezas</span>
<h1>{e(ficha['titular'])}</h1>
<p class="sub">{e(ficha['subtitular'])}</p>
<div class="precio"><strong>{clp(prod['precio'])}</strong><span class="chip">Lleva 2 y ahorra {clp(ahorro)}</span></div>
<p class="iva">IVA incluido · Pagas al recibir</p>
{formulario(prod, ficha, tienda)}
</div>
</section>
<section class="banda"><div class="contenedor">{sellos(tienda)}</div></section>
<section class="seccion contenedor"><p class="sobretitulo">Por qué funciona</p><h2>Todo lo que necesitas, en un solo pedido</h2><ul class="beneficios">{benef}</ul></section>
<section class="seccion seccion-suave"><div class="contenedor dos-col"><div><p class="sobretitulo">Cómo se usa</p><h2>Listo en minutos</h2><ol class="pasos">{pasos}</ol></div><div class="caja revelar"><h3>Qué incluye</h3><ul class="incluye">{incluye}</ul><p class="nota-chica">Medidas y materiales exactos: los publicamos al recibir la ficha del proveedor.</p></div></div></section>
{comparacion(prod, ficha)}
<section class="seccion contenedor estrecho"><p class="sobretitulo">Opiniones</p><h2>Reseñas reales, pronto</h2><div class="resenas-vacio">{icono('estrella')}<p>Solo publicamos opiniones de clientes que recibieron su pedido. Sin reseñas inventadas: cuando lleguen, las verás aquí.</p></div></section>
{bloque_faq(preguntas, id_="preguntas-producto")}
<section class="cta-final"><div class="contenedor"><h2>¿Listo para probarlo?</h2><p>Pides hoy, te confirmamos por WhatsApp y pagas cuando llega.</p><a class="boton boton-grande boton-auto" href="#pedido">Pedir {e(nombre)} · {clp(prod['precio'])}</a></div></section>
<div class="barra-compra" id="barra-compra"><div><strong>{clp(prod['precio'])}</strong><span>Pagas al recibir</span></div><a class="boton" href="#pedido">Pedir ahora</a></div>"""
    og = f"img/{prod['id']}.jpg" if (PLANTILLA / "img" / f"{prod['id']}.jpg").exists() else None
    return pagina(marca, tienda, ficha["titulo_seo"], ficha["meta_descripcion"], cuerpo, base="../",
                  canonica=f"productos/{ficha['handle']}.html", imagen_og=og, extra_ld=(producto_ld, migas_ld, ld_faq(preguntas)))


def portada(productos, marca, tienda):
    tarjetas = "".join(f"""<a class="tarjeta revelar" href="productos/{e(f['handle'])}.html">{imagen(p['id'], f['alt_imagenes'][0], '', 'foto foto-tarjeta', sizes='(min-width:900px) 50vw, 100vw')}
<div class="tarjeta-cuerpo"><span class="etiqueta">{e(p['rol'].split('(')[0].strip().capitalize())}</span><h3>{e(f['titulo_seo'].split(':')[0])}</h3><p>{e(f['subtitular'])}</p>
<ul class="tarjeta-incluye">{''.join(f"<li>{icono('check', 'ico ico-s')}{e(i)}</li>" for i in f['incluye'][:2])}</ul>
<div class="tarjeta-pie"><div><strong>{clp(p['precio'])}</strong><small>o 2 por {clp(p['oferta_2'])}</small></div><span class="boton boton-chico">Ver kit {icono('flecha', 'ico ico-s')}</span></div></div></a>"""
                       for p, f in productos)
    pilares = "".join(f'<li class="revelar">{icono(i)}<div><strong>{e(x["pilar"])}</strong><p>{e(x["prueba"])}</p></div></li>'
                      for i, x in zip(("kit", "garantia", "estrella"), marca["pilares"]))
    hero = img_tag("hero", "Perro y gato descansando juntos en un sillón de un living luminoso", "", "hero-img", carga="eager", prioridad=True)
    preguntas = faq_general(tienda)
    cuerpo = f"""<section class="hero{' hero-con-img' if hero else ''}">{hero or ''}
<div class="contenedor hero-in"><p class="sobretitulo">Kits de cuidado para perros y gatos</p>
<h1>Menos pelo en tu casa. Más frescura para tu mascota.</h1>
<p class="hero-sub">Soluciones completas para el pelo y el calor, pensadas para la vida en casa. Te confirmamos por WhatsApp y pagas cuando llega.</p>
<div class="hero-acciones"><a class="boton boton-grande" href="#kits">Ver los kits {icono('flecha', 'ico ico-s')}</a><a class="boton-texto" href="#como-funciona">¿Cómo funciona?</a></div>
<ul class="hero-confianza"><li>{icono('pago', 'ico ico-s')} Pago contra entrega</li><li>{icono('envio', 'ico ico-s')} Todo Chile</li><li>{icono('garantia', 'ico ico-s')} Garantía 6 meses</li></ul></div></section>
<section class="banda"><div class="contenedor">{sellos(tienda)}</div></section>
<section class="seccion contenedor" id="kits"><p class="sobretitulo">Nuestros kits</p><h2>Elige el que necesita tu casa</h2><div class="grilla">{tarjetas}</div></section>
{como_funciona()}
<section class="seccion seccion-oscura"><div class="contenedor riesgo"><div><p class="sobretitulo">Compra sin riesgo</p><h2>Si no te sirve, no es tu problema</h2><p>Pagas solo cuando el kit está en tus manos. Si no es lo que esperabas, tienes 10 días para retractarte, y 6 meses de garantía legal si presenta una falla.</p><a class="boton" href="cambios.html">Ver política de cambios</a></div>
<ul class="riesgo-lista"><li>{icono('pago')}<span><strong>$0 por adelantado</strong>Nada de tarjetas ni transferencias.</span></li><li>{icono('retracto')}<span><strong>10 días de retracto</strong>Desde que lo recibes.</span></li><li>{icono('garantia')}<span><strong>6 meses de garantía</strong>Cambio, reparación o devolución.</span></li></ul></div></section>
<section class="seccion seccion-suave"><div class="contenedor"><p class="sobretitulo">Cómo trabajamos</p><h2>Una tienda chica que cuida los detalles</h2><ul class="pilares">{pilares}</ul></div></section>
{bloque_faq(preguntas)}
<section class="cta-final"><div class="contenedor"><h2>¿Dudas antes de pedir?</h2><p>Escríbenos y te ayudamos a elegir el kit para tu mascota.</p><a class="boton boton-grande boton-auto" href="contacto.html">Contáctanos</a></div></section>"""
    url = (tienda.get("url_sitio") or "").rstrip("/")
    web_ld = {"@context": "https://schema.org", "@type": "WebSite", "name": marca["nombre"], **({"url": url + "/"} if url else {})}
    return pagina(marca, tienda, f"{marca['nombre']} — kits de cuidado para mascotas con pago al recibir", marca["promesa"],
                  cuerpo, canonica="", imagen_og="img/hero.jpg" if hero else None,
                  precarga="img/hero-900.webp" if (PLANTILLA / "img" / "hero-900.webp").exists() else None,
                  extra_ld=(web_ld, ld_faq(preguntas)))


def legales(marca, tienda):
    pl = tienda["plazos_despacho"]
    falta = '<p class="aviso">Estamos completando nuestros datos de contacto. Mientras tanto, escríbenos desde el formulario de pedido.</p>'
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
    for archivo in ("estilos.css", "pedido.js", "favicon.svg"):
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
