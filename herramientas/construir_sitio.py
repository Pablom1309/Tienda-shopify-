"""Nodo determinista: genera la tienda estática (sitio/) y el CSV de importación a Shopify.

Fuentes: datos/catalogo.json, datos/fichas.json, datos/marca.json, datos/tienda.json.
Imágenes: herramientas/plantilla/img/<nombre>.jpg (+ .webp opcional): hero y <id-producto>.
Si falta una imagen se usa una ilustración SVG. Las imágenes generadas (no fotos del producto
real) se rotulan como "Imagen referencial".
El sitio funciona gratis en GitHub Pages: el formulario contra entrega arma el pedido
y lo envía por WhatsApp al número configurado en datos/tienda.json.
"""
import csv
import datetime
import hashlib
import html
import json
import re
import shutil
import subprocess
from urllib.parse import quote
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITIO = RAIZ / "sitio"
PLANTILLA = RAIZ / "herramientas" / "plantilla"


def version(archivo):
    """Huella corta del archivo: cambia la URL cuando cambia el contenido y evita la caché vieja del celular."""
    return hashlib.sha1((PLANTILLA / archivo).read_bytes()).hexdigest()[:8]
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
    "caja": '<path d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5l9 4.5 9-4.5M12 12v9"/>',
    "check": '<path d="M5 12l5 5 9-10"/>',
    "x": '<path d="M6 6l12 12M18 6L6 18"/>',
    "kit": '<path d="M4 8h16v12H4z"/><path d="M2 8h20M12 8v12M12 8c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1"/>',
    "estrella": '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
    "carro": '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12h11L21 7H6.5"/>',
    "calendario": '<path d="M4 6h16v14H4zM4 10h16M8 3v5M16 3v5"/>',
    "flecha": '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "whatsapp": '<path d="M3 21l1.65-4.9A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.8c.2 3 2.9 5.9 6 6.3l1.2-1.5-2.1-1.1-1 .8c-.9-.4-1.9-1.4-2.3-2.4l.8-1-1.1-2.1z"/>',
    "telefono": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    "correo": '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    "mapa": '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    "ayuda": '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
    "instagram": '<rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4zM17.5 6.5h.01"/>',
    "tiktok": '<path d="M9 12a4 4 0 1 0 4 4V3a5 5 0 0 0 5 5"/>',
    "facebook": '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
}

REDES = {"instagram": "Instagram", "tiktok": "TikTok", "facebook": "Facebook"}


def wa_numero(tienda):
    """'56979814797' -> '+56 9 7981 4797' (formato legible; el enlace usa el número limpio)."""
    n = re.sub(r"\D", "", tienda.get("whatsapp") or "")
    return f"+{n[:2]} {n[2]} {n[3:7]} {n[7:]}" if len(n) == 11 else (f"+{n}" if n else "")


def wa_url(tienda, texto="Hola Kuchiwau, tengo una consulta"):
    n = re.sub(r"\D", "", tienda["whatsapp"])
    return f"https://wa.me/{n}?text={quote(texto)}"


def redes_html(tienda, marca, clase="redes", con_wa=True):
    """Íconos de contacto/redes. WhatsApp siempre (cuenta real); el resto solo si hay URL en datos/tienda.json."""
    items = []
    if con_wa and tienda.get("whatsapp"):
        items.append(("whatsapp", "WhatsApp", wa_url(tienda)))
    for k, nombre in REDES.items():
        if (tienda.get("redes") or {}).get(k):
            items.append((k, nombre, tienda["redes"][k]))
    if not items:
        return ""
    return f'<ul class="{clase}">' + "".join(
        f'<li><a href="{e(u)}" target="_blank" rel="noopener noreferrer" aria-label="{nombre} de {e(marca["nombre"])} (se abre en otra pestaña)" title="{nombre}">{icono(i)}</a></li>'
        for i, nombre, u in items) + "</ul>"


def isla(nombre="flecha"):
    """Flecha (o ícono) simple al final del botón; se desplaza en hover. Sin círculo ni burbuja."""
    return f'<span class="boton-ico" aria-hidden="true">{icono(nombre, "ico")}</span>'


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


def generar_variantes():
    """Crea variantes webp de 450 px (y 900 si la original es mayor) con ImageMagick, si está disponible.
    Se guardan en herramientas/plantilla/img; sin ImageMagick se omiten y la página usa solo la original."""
    carpeta = PLANTILLA / "img"
    for webp in sorted(carpeta.glob("*.webp")):
        if re.search(r"-(450|900)\.webp$", webp.name):
            continue
        dim = tamano(webp)
        if not dim:
            return
        for w in (450, 900):
            destino = carpeta / f"{webp.stem}-{w}.webp"
            if w < dim[0] and not destino.exists():
                try:
                    subprocess.run(["convert", str(webp), "-resize", f"{w}x", "-quality", "78", str(destino)], check=True, capture_output=True)
                except (OSError, subprocess.CalledProcessError):
                    return


def img_tag(nombre, alt, base, clase="", carga="lazy", prioridad=False, sizes="100vw"):
    jpg = PLANTILLA / "img" / f"{nombre}.jpg"
    if not jpg.exists():
        return None
    dim = tamano(jpg)
    wh = f' width="{dim[0]}" height="{dim[1]}"' if dim else ""
    fuentes = []
    if (PLANTILLA / "img" / f"{nombre}.webp").exists():
        ancho = dim[0] if dim else 1200
        cand = [(w, f"{nombre}-{w}.webp") for w in (450, 900) if w < ancho and (PLANTILLA / "img" / f"{nombre}-{w}.webp").exists()]
        cand.append((ancho, f"{nombre}.webp"))
        srcset = ", ".join(f"{base}img/{n} {w}w" for w, n in cand)
        fuentes.append(f'<source type="image/webp" srcset="{srcset}" sizes="{sizes}">')
    pr = ' fetchpriority="high"' if prioridad else ""
    return (f'<picture>{"".join(fuentes)}<img class="{clase}" src="{base}img/{nombre}.jpg" alt="{e(alt)}"{wh} '
            f'loading="{carga}" decoding="async"{pr}></picture>')


def imagen(nombre, alt, base, clase="foto", referencial=True, sizes="(min-width:900px) 50vw, 100vw", principal=False):
    tag = img_tag(nombre, alt, base, sizes=sizes, carga="eager" if principal else "lazy", prioridad=principal)
    if tag:
        nota = '<figcaption>Foto referencial</figcaption>' if referencial else ""
        return f'<figure class="{clase}">{tag}{nota}</figure>'
    return f'<figure class="{clase} ilus">{ilustracion(nombre)}</figure>'


def ilustracion(pid):
    """Imagen provisional de marca para productos sin foto (no inventa cómo se ve el producto)."""
    iso = (PLANTILLA / "isotipo.svg").read_text(encoding="utf-8").strip()
    iso = iso.replace("<svg ", '<svg class="ilus-iso" aria-hidden="true" ', 1).replace(' role="img" aria-label="Kuchiwau"', "")
    return f'{iso}<span class="ilus-txt">Foto real muy pronto</span>'


def iso_svg(clase="ilus-iso"):
    """Isotipo de marca como marca de agua (para espacios de imagen de ambiente aún sin foto)."""
    iso = (PLANTILLA / "isotipo.svg").read_text(encoding="utf-8").strip()
    return iso.replace("<svg ", f'<svg class="{clase}" aria-hidden="true" ', 1).replace(' role="img" aria-label="Kuchiwau"', "")


def ambiente(nombre, base="", sizes="50vw", principal=False):
    """Imagen de ambiente decorativa (alt vacío). Devuelve None si el archivo no existe: la sección se diseña sin imagen."""
    return img_tag(nombre, "", base, clase="ambiente-img", sizes=sizes, carga="eager" if principal else "lazy", prioridad=principal)


def ld(datos):
    return f'<script type="application/ld+json">{json.dumps(datos, ensure_ascii=False)}</script>'


def logo_svg(pie=False):
    """Isotipo + palabra (texto convertido a trazos, color heredado) desde herramientas/plantilla."""
    iso = (PLANTILLA / "isotipo.svg").read_text(encoding="utf-8").strip()
    if pie:
        iso = iso.replace('fill="#24316B"', 'fill="#FFF8F0"', 1).replace('<g fill="#FFF8F0">', '<g fill="#24316B">')
    iso = iso.replace("<svg ", '<svg class="logo-iso" aria-hidden="true" ', 1).replace(' role="img" aria-label="Kuchiwau"', "")
    palabra = (PLANTILLA / "palabra.svg").read_text(encoding="utf-8").strip().replace("<svg ", '<svg class="logo-palabra" aria-hidden="true" ', 1)
    return iso + palabra


# Paleta de marca vigente (ronda 10, 2026-10-05): azul tinta del logo como color protagonista (encabezado de portada, botón
# principal, pie), mandarina apagada como acento sobre azul y neutros cálidos de fondo. Sin degradados ni saturación alta.
# Derivados (tinta profunda, acento para texto sobre claro, bandejas tonales) viven en estilos.css, bloque "Ronda 10".
PALETA_TIENDA = {"primario": "#24316B", "acento": "#E8935F", "fondo": "#F6F2EA", "texto": "#1C2033"}


def pagina(marca, tienda, titulo, descripcion, cuerpo, base="", canonica=None, imagen_og=None, precarga=None, extra_ld=(), tipo_og="website", clase_body="", pago_en_anuncio=True):
    c = {**marca["colores"], **PALETA_TIENDA}
    url = (tienda.get("url_sitio") or "").rstrip("/")
    can = f'<link rel="canonical" href="{e(url + "/" + canonica)}">' if url and canonica is not None else ""
    og = f'<meta property="og:image" content="{e(url + "/" + imagen_og)}">' if url and imagen_og else ""
    if og and (PLANTILLA / imagen_og).exists() and tamano(PLANTILLA / imagen_og):
        ow, oh = tamano(PLANTILLA / imagen_og)
        og += f'<meta property="og:image:width" content="{ow}"><meta property="og:image:height" content="{oh}">'
    if url and canonica is not None:
        og += f'<meta property="og:url" content="{e(url + "/" + canonica)}">'
    pre = f'<link rel="preload" as="image" href="{base}{precarga}" fetchpriority="high">' if precarga else ""
    wa = tienda.get("whatsapp")
    # Dueño 2026-10-06: WhatsApp en pocos lugares (formulario, contacto y una línea en el pie); sin flotante ni ícono en el encabezado; sin teléfono.
    flotante_wa = ""
    hdr_wa = ""
    if wa:
        pie_contacto = f'<a class="pie-lnk" href="{e(wa_url(tienda))}" target="_blank" rel="noopener noreferrer">WhatsApp {e(wa_numero(tienda))}</a>'
    else:
        pie_contacto = ""
    if tienda.get("correo"):
        pie_contacto += f'<a class="pie-lnk" href="mailto:{e(tienda["correo"])}">{icono("correo", "ico ico-s")} {e(tienda["correo"])}</a>'
    if tienda.get("direccion_comercial"):
        pie_contacto += f'<span class="pie-lnk">{icono("mapa", "ico ico-s")} {e(tienda["direccion_comercial"])}</span>'
    org = {"@context": "https://schema.org", "@type": "Organization", "name": marca["nombre"], "slogan": marca["promesa"]}
    if url:
        org["url"] = url + "/"
    if tienda.get("correo"):
        org["email"] = tienda["correo"]
    sociales = [u for u in (tienda.get("redes") or {}).values() if isinstance(u, str) and u.startswith("http")]
    if sociales:
        org["sameAs"] = sociales
    scripts = "".join(ld(x) for x in (org, *extra_ld))
    fuentes = f"https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family={marca['tipografia']}:wght@400;600;700;800&display=swap"
    pago_anuncio = f'<span class="anuncio-pago">{icono("pago", "ico ico-s")} Pagas al recibir</span><span class="sep" aria-hidden="true">·</span>' if pago_en_anuncio else ""
    return f"""<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(titulo)}</title>
<meta name="description" content="{e(descripcion)}">
<meta property="og:type" content="{tipo_og}">
<meta property="og:locale" content="es_CL">
<meta property="og:site_name" content="{e(marca['nombre'])}">
<meta property="og:title" content="{e(titulo)}">
<meta property="og:description" content="{e(descripcion)}">
{og}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(titulo)}">
<meta name="twitter:description" content="{e(descripcion)}">
{can}
<meta name="theme-color" content="{c['fondo']}">
<link rel="icon" href="{base}favicon.svg" type="image/svg+xml">
{pre}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="{fuentes}" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="{fuentes}"></noscript>
<link rel="stylesheet" href="{base}estilos.css?v={version('estilos.css')}">
<style>:root{{--primario:{c['primario']};--acento:{c['acento']};--fondo:{c['fondo']};--texto:{c['texto']}}}</style>
{scripts}
</head>
<body class="{clase_body}">
<a class="saltar" href="#contenido">Saltar al contenido</a>
<div class="anuncio">{pago_anuncio}<span class="anuncio-envio">{icono('envio', 'ico ico-s')} Despachos a todo Chile, plazos por zona</span><span class="sep ocultar-movil" aria-hidden="true">·</span><span class="ocultar-movil">{icono('garantia', 'ico ico-s')} Garantía legal 6 meses</span></div>
<header class="barra"><div class="contenedor barra-in"><a class="logo" href="{base}index.html" aria-label="{e(marca['nombre'])}, inicio">{logo_svg()}</a>
<nav class="menu" aria-label="Principal"><a href="{base}index.html#kits">Kits</a><a href="{base}index.html#como-funciona">Cómo funciona</a><a href="{base}index.html#preguntas">Preguntas</a><a href="{base}contacto.html">Contacto</a></nav>
<div class="barra-acc">{hdr_wa}<a class="boton boton-chico" href="{base}index.html#kits">Comprar {isla('carro')}</a></div></div></header>
<main id="contenido">
{cuerpo}
</main>
<footer class="pie">
<div class="contenedor pie-in">
<div class="pie-marca"><p class="logo logo-pie" aria-label="{e(marca['nombre'])}">{logo_svg(pie=True)}</p><p>Kits de cuidado para perros y gatos.</p>{redes_html(tienda, marca, "redes redes-pie", con_wa=False)}</div>
<div><p class="pie-tit">Tienda</p><nav class="pie-nav"><a href="{base}index.html#kits">Kits</a><a href="{base}index.html#como-funciona">Cómo funciona</a><a href="{base}index.html#preguntas">Preguntas frecuentes</a></nav></div>
<div><p class="pie-tit">Ayuda</p><nav class="pie-nav"><a href="{base}despacho.html">Despacho</a><a href="{base}cambios.html">Cambios, retracto y garantía</a><a href="{base}privacidad.html">Privacidad</a><a href="{base}contacto.html">Contacto</a></nav></div>
<div><p class="pie-tit">Contacto</p><nav class="pie-nav">{pie_contacto}</nav></div>
</div>
<p class="legal-pie">© {e(tienda.get('razon_social') or marca['nombre'])}{' · RUT ' + e(tienda['rut']) if tienda.get('rut') else ''}{' · ' + e(tienda['direccion_comercial']) if tienda.get('direccion_comercial') else ''} · Precios en pesos chilenos, IVA incluido.</p>
</footer>
{flotante_wa}
<script src="{base}pedido.js?v={version('pedido.js')}" defer></script>
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
    pasos = [("carro", "Haz tu pedido", "Elige tu kit y deja tus datos de entrega. Sin cuenta ni tarjeta."),
             ("chat", "Te confirmamos por WhatsApp", "Revisamos dirección y plazo contigo antes de despachar."),
             ("pago", "Pagas cuando llega", "Recibes el kit en tu puerta y pagas al repartidor.")]
    items = "".join(f'<li><span class="paso-num">{i}</span><div><h3>{e(t)}</h3><p>{e(d)}</p></div></li>' for i, (ic, t, d) in enumerate(pasos, 1))
    foto = ambiente("ambiente-entrega", sizes="(min-width:900px) 40vw, 100vw")
    visual = f'<div class="como-visual"><div class="marco"><figure class="foto foto-ambiente">{foto}</figure></div></div>' if foto else ""
    nota = f'<p class="nota-cambios">{icono("retracto", "ico ico-s")} ¿No te convenció? Tienes 10 días de retracto desde que lo recibes. <a href="cambios.html">Ver cambios y garantía</a></p>'
    return (f'<section class="seccion seccion-suave" id="como-funciona"><div class="contenedor como{" como-con-img" if foto else ""}">'
            f'<div class="como-txt"><h2>Comprar es así de simple</h2><ol class="tres-pasos pasos-ed">{items}</ol>{nota}</div>{visual}</div></section>')


def faq_general(tienda):
    pl = tienda["plazos_despacho"]
    preguntas = [
        ("¿Cuánto demora el despacho?", f"Región Metropolitana: {pl['RM']}. Otras regiones: {pl['regiones']}. Zonas extremas: {pl['zonas_extremas']}."),
        ("¿Por qué venden kits y no productos sueltos?", "Porque un problema casi nunca se resuelve con una sola pieza. El kit trae lo necesario para la mascota y para la casa, y te ahorra un segundo despacho."),
        ("¿Las fotos son del producto real?", "Algunas imágenes son referenciales y lo indicamos en cada una. Las medidas y materiales de cada kit los confirmamos antes de despachar; escríbenos por WhatsApp si quieres saberlos antes de pedir."),
    ]
    return preguntas


def bloque_faq(preguntas, titulo="Preguntas frecuentes", id_="preguntas"):
    items = "".join(f"<details><summary>{e(p)}</summary><div class='faq-r'><p>{e(r)}</p></div></details>" for p, r in preguntas)
    return f'<section class="seccion contenedor estrecho" id="{id_}"><h2>{e(titulo)}</h2><div class="faq">{items}</div></section>'


def ld_faq(preguntas):
    return {"@context": "https://schema.org", "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": p, "acceptedAnswer": {"@type": "Answer", "text": r}} for p, r in preguntas]}


def formulario(prod, ficha, tienda):
    ahorro2 = max(0, 2 * prod["precio"] - prod["oferta_2"])
    opciones = [(1, prod["precio"], 0, "1 unidad"), (2, prod["oferta_2"], ahorro2, "2 unidades")]
    radios = "".join(
        f'<label class="cant"><input type="radio" name="cantidad" value="{n}" data-precio="{p}" data-ahorro="{a}" aria-label="{t}" {"checked" if n == 1 else ""}><span>{n}</span></label>'
        for n, p, a, t in opciones)
    tallas = ""
    if ficha.get("tallas"):
        tallas = '<label class="campo">Talla de alfombra<select name="talla" required>' + "".join(
            f'<option value="{e(t["talla"])}">{e(t["talla"])} — {e(t["recomendado"])}</option>' for t in ficha["tallas"]) + "</select></label>"
    comp = prod.get("complemento")
    extra = f'<label class="extra"><input type="checkbox" name="complemento" value="{comp["precio"]}" data-nombre="{e(comp["nombre"])}"><span>Agregar <strong>{e(comp["nombre"])}</strong></span><span class="opcion-precio">+{clp(comp["precio"])}</span></label>' if comp else ""
    regiones = "".join(f'<option data-zona="{"extrema" if r in REGIONES_EXTREMAS else ("rm" if r == "Metropolitana" else "regiones")}">{e(r)}</option>' for r in REGIONES)
    aviso = "" if tienda.get("whatsapp") else '<p class="aviso">Estamos preparando la tienda: muy pronto podrás pedir aquí.</p>'
    return f"""<form class="pedido" id="pedido" data-producto="{e(ficha['titulo_seo'].split(':')[0])}" data-id="{e(prod['id'])}" data-wa="{e(tienda.get('whatsapp') or '')}" novalidate>
<div class="cant-fila"><p class="pedido-tit">Cantidad</p>
<div class="cantidad" role="radiogroup" aria-label="Cantidad">{radios}</div></div>
{tallas}
{extra}
<p class="pedido-tit">Datos de entrega</p>
<label class="campo">Nombre y apellido<input name="nombre" id="f-nombre" required autocomplete="name" autocapitalize="words" maxlength="80" placeholder="Ej: Camila Rojas" aria-describedby="e-nombre"><small class="error-txt" id="e-nombre">Escribe tu nombre y apellido.</small></label>
<label class="campo">Celular (WhatsApp)<input name="telefono" id="f-telefono" type="tel" required inputmode="tel" autocomplete="tel" maxlength="20" placeholder="9 1234 5678" aria-describedby="e-telefono"><small class="error-txt" id="e-telefono">Escribe tu celular de 9 dígitos, por ejemplo 9 1234 5678.</small></label>
<div class="fila">
<label class="campo">Región<select name="region" id="f-region" required autocomplete="address-level1" aria-describedby="e-region"><option value="">Elige tu región</option>{regiones}</select><small class="error-txt" id="e-region">Elige tu región.</small></label>
<label class="campo">Comuna<input name="comuna" id="f-comuna" required autocomplete="address-level2" autocapitalize="words" maxlength="60" placeholder="Ej: Ñuñoa" aria-describedby="e-comuna"><small class="error-txt" id="e-comuna">Escribe tu comuna.</small></label>
</div>
<label class="campo">Calle y número<input name="direccion" id="f-direccion" required autocomplete="address-line1" maxlength="120" placeholder="Ej: Av. Irarrázaval 1234" aria-describedby="e-direccion"><small class="error-txt" id="e-direccion">Escribe tu calle y número.</small></label>
<label class="campo">Depto, casa o referencia <span class="opcional">(opcional)</span><input name="referencia" id="f-referencia" autocomplete="address-line2" maxlength="120" placeholder="Ej: depto 502, portón negro"></label>
<p class="entrega" id="entrega" hidden>{icono('calendario', 'ico ico-s')} <span></span></p>
<div class="total"><div><span>Total a pagar al recibir</span><small class="total-nota" id="total-nota" hidden></small></div><strong id="total">{clp(prod['precio'])}</strong></div>
<p class="form-aviso" id="form-aviso" role="alert" hidden></p>
<button type="submit" class="boton boton-grande"><span class="boton-txt">Confirmar por WhatsApp</span> {isla('whatsapp')}</button>
{aviso}
<div class="pedido-ok" id="pedido-ok" role="status" aria-live="polite" hidden><span class="ok-check" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11"/><path d="M7 12.5l3.2 3.2L17 8.8"/></svg></span><strong>Abrimos WhatsApp con tu pedido <span id="ok-num"></span>.</strong><p>Envía el mensaje para que lo confirmemos antes de despachar. Guarda el número por si necesitas escribirnos.</p><a class="boton boton-fantasma-claro" id="ok-enlace" href="#" target="_blank" rel="noopener noreferrer">{icono('whatsapp', 'ico ico-s')} Abrir WhatsApp otra vez</a></div>
<label class="consentimiento"><input type="checkbox" name="consentimiento" value="si"><span>Quiero recibir por WhatsApp recordatorios y novedades de Kuchiwau (opcional; puedes darte de baja cuando quieras).</span></label>
<ul class="garantias-form"><li><a href="../cambios.html">{icono('retracto', 'ico ico-s')} 10 días de retracto</a></li><li><a href="../privacidad.html">{icono('garantia', 'ico ico-s')} Cómo usamos tus datos</a></li></ul>
</form>"""


def comparacion(prod, ficha):
    filas = [("Un solo despacho", True, False),
             ("Confirmación por WhatsApp antes de despachar", True, None),
             ]
    def celda(v):
        if v is None:
            return '<td class="tal-vez">Depende</td>'
        return f'<td class="{"si" if v else "no"}">{icono("check" if v else "x", "ico ico-s")}<span class="sr">{"Sí" if v else "No"}</span></td>'
    cuerpo = "".join(f"<tr><th scope='row'>{e(t)}</th>{celda(a)}{celda(b)}</tr>" for t, a, b in filas)
    return f"""<section class="seccion contenedor estrecho"><h2>El kit frente a comprar por partes</h2>
<div class="tabla-envoltura"><table class="comparacion"><thead><tr><th></th><th scope="col">{e(ficha['titulo_seo'].split(':')[0])}</th><th scope="col">Piezas sueltas</th></tr></thead><tbody>{cuerpo}</tbody></table></div></section>"""


def pagina_producto(prod, ficha, marca, tienda, productos=()):
    benef = "".join(f'<li><div><strong>{e(b["titulo"])}</strong><p>{e(b["texto"])}</p></div></li>' for b in ficha["beneficios"])
    pasos = "".join(f'<li><span class="num">{i}</span><p>{e(p)}</p></li>' for i, p in enumerate(ficha["como_usar"], 1))
    # Medidas: solo se muestran si el dato ya está en la ficha; si no, se declara "por confirmar con proveedor".
    tiene_medida = lambda t: re.search(r"\d\s*(x|cm|mm|ml|\bm\b)|\d,\d\s*m\b", t) is not None
    incluye = "".join(f'<li><span class="inc-ico" aria-hidden="true">{icono("caja")}</span><span>{e(t)}</span></li>' for t in ficha["incluye"])
    tag_contenido = img_tag(f"{prod['id']}-contenido", "Piezas del " + ficha["titulo_seo"].split(":")[0] + ": " + "; ".join(ficha["incluye"])[:120], "../", sizes="(min-width:900px) 40vw, 100vw")
    contenido = f'<figure class="foto-contenido">{tag_contenido}</figure>' if tag_contenido else ""
    nombre = ficha["titulo_seo"].split(":")[0]
    url = (tienda.get("url_sitio") or "").rstrip("/")
    preguntas = [(f["p"], f["r"]) for f in ficha["faq"]]
    producto_ld = {
        "@context": "https://schema.org", "@type": "Product", "name": ficha["titulo_seo"].split(" | ")[0],
        "description": ficha["meta_descripcion"], "brand": {"@type": "Brand", "name": marca["nombre"]}, "sku": f"KW-{prod['id'].upper()}",
        "offers": {"@type": "Offer", **({"url": f"{url}/productos/{ficha['handle']}.html"} if url else {}), "priceCurrency": "CLP", "price": prod["precio"], "availability": "https://schema.org/InStock",
                   "itemCondition": "https://schema.org/NewCondition",
                   "hasMerchantReturnPolicy": {"@type": "MerchantReturnPolicy", "applicableCountry": "CL",
                                               "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow", "merchantReturnDays": 10},
                   "shippingDetails": {"@type": "OfferShippingDetails", "shippingDestination": {"@type": "DefinedRegion", "addressCountry": "CL"},
                                       "deliveryTime": {"@type": "ShippingDeliveryTime", "handlingTime": {"@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY"},
                                                        "transitTime": {"@type": "QuantitativeValue", "minValue": 2, "maxValue": 7, "unitCode": "DAY"}}}},
    }
    if url and (PLANTILLA / "img" / f"{prod['id']}.jpg").exists():
        producto_ld["image"] = [f"{url}/img/{prod['id']}.jpg"] + ([f"{url}/img/{prod['id']}-contenido.jpg"] if tag_contenido else [])
    migas_ld = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Inicio", **({"item": url + "/"} if url else {})},
        {"@type": "ListItem", "position": 2, "name": "Kits", **({"item": url + "/#kits"} if url else {})},
        {"@type": "ListItem", "position": 3, "name": nombre}]}
    cuerpo = f"""<nav class="migas contenedor" aria-label="Migas de pan"><a href="../index.html">Inicio</a><span aria-hidden="true">/</span><a href="../index.html#kits">Kits</a><span aria-hidden="true">/</span><span aria-current="page">{e(nombre)}</span></nav>
<section class="producto contenedor">
<div class="galeria">{galeria(prod, ficha)}</div>
<div class="compra">
<h1>{e(ficha['titular'])}</h1>
<p class="sub">{e(ficha['subtitular'])}</p>
<div class="precio"><strong>{clp(prod['precio'])}</strong><span class="iva">IVA incluido</span></div>
<ul class="clave"><li>{icono('pago', 'ico')} <span><strong>Pagas al recibir.</strong></span></li><li>{icono('envio', 'ico')} <span>Llega en {e(tienda['plazos_despacho']['RM'])} en RM; {e(tienda['plazos_despacho']['regiones'])} en regiones.</span></li></ul>
<a class="boton boton-grande cta-ficha" href="#pedido">Pide el tuyo {isla()}</a>
<div class="pedido-marco">{formulario(prod, ficha, tienda)}</div>
</div>
</section>
<section class="seccion contenedor"><h2>Por qué funciona</h2><ul class="beneficios beneficios-ed">{benef}</ul></section>
<section class="seccion seccion-suave"><div class="contenedor dos-col"><div><h2>Cómo se usa: listo en minutos</h2><ol class="pasos">{pasos}</ol></div><div class="caja"><div class="caja-in"><h3>Qué incluye</h3><p class="caja-sub">{len(ficha['incluye'])} {'pieza' if len(ficha['incluye']) == 1 else 'piezas'} en un solo pedido</p>{contenido}<ul class="incluye">{incluye}</ul>{NOTA_NO_INCLUYE.get(prod['id'], '')}<p class="nota-chica">Medidas y materiales: te los confirmamos por WhatsApp antes de despachar.</p></div></div></div></section>
{comparacion(prod, ficha)}
{bloque_faq(preguntas, id_="preguntas-producto")}
{otros_kits(prod, productos)}
<section class="cta-final"><div class="contenedor"><h2>¿Listo para probarlo?</h2><p>Elige la cantidad y deja tus datos: toma menos de un minuto.</p><a class="boton boton-grande boton-auto" href="#pedido">Pide el tuyo · {clp(prod['precio'])} {isla()}</a></div></section>
<div class="barra-compra" id="barra-compra"><div><strong>{clp(prod['precio'])}</strong></div><a class="boton" href="#pedido">Pide el tuyo {isla()}</a></div>"""
    og = f"img/{prod['id']}.jpg" if (PLANTILLA / "img" / f"{prod['id']}.jpg").exists() else None
    return pagina(marca, tienda, titulo_web(ficha, marca), meta_web(ficha), cuerpo, base="../",
                  canonica=f"productos/{ficha['handle']}.html", imagen_og=og, extra_ld=(producto_ld, migas_ld, ld_faq(preguntas)), tipo_og="product", clase_body="ficha", pago_en_anuncio=False)


NOTA_NO_INCLUYE = {"kit-bano-secado-perro": '<p class="nota-chica"><strong>No incluye shampoo.</strong> Usas el que ya tienes.</p>'}
ALT_PRINCIPAL = {"kit-bano-secado-perro": "Toalla de microfibra, cepillo de silicona y guante de baño para perros"}


def alt_principal(p, f):
    return ALT_PRINCIPAL.get(p["id"], f["alt_imagenes"][0])


# Títulos SEO propuestos por el área SEO (datos/seo/auditoria.md); el resto se acorta solo si pasa de 60 caracteres.
SEO_TITULO = {"kit-bano-secado-perro": "Kit de baño para perros: toalla, cepillo y guante",
              "kit-gato-sin-pelusas": "Cepillo para gatos autolimpiante + removedor",
              "kit-verano-fresco": "Kit Verano Fresco: alfombra refrigerante + botella de paseo",
              "piscina-plegable-perros-120": "Piscina plegable para perros 120x30 cm"}


def titulo_web(ficha, marca):
    """<title> de la ficha: máx. 60 caracteres incluida la marca. Quita piezas del final ("+ x", ", x") antes que cortar una palabra."""
    sufijo = f" | {marca['nombre']}"
    base = SEO_TITULO.get(ficha["id"]) or ficha["titulo_seo"].split(" | ")[0]
    while len(base + sufijo) > 60 and " + " in base:
        base = base.rsplit(" + ", 1)[0]
    if len(base + sufijo) > 60 and ", " in base:
        base = base.rsplit(", ", 1)[0]
    if len(base + sufijo) > 60:
        base = base.split(":")[0]
    if len(base + sufijo) > 60:
        base = base[:60 - len(sufijo) - 1].rsplit(" ", 1)[0].rstrip(",;:") + "…"
    return base + sufijo


def meta_web(ficha):
    """Meta descripción: máx. 155 caracteres y siempre termina en "Pagas al recibir." (se recorta la descripción, no la frase)."""
    frase = "Pagas al recibir."
    m = re.sub(r"\s*Pagas al recibir\.?\s*$", "", ficha["meta_descripcion"].strip(), flags=re.I).rstrip(". ")
    tope = 155 - len(frase) - 2
    if len(m) > tope:
        m = m[:tope].rsplit(" ", 1)[0].rstrip(",;:. ")
    return f"{m}. {frase}"


def fotos_extra(pid):
    """Segunda y tercera foto reales de la ficha (<id>-2.jpg, <id>-3.jpg). Sin ellas no hay miniaturas."""
    return [n for n in (f"{pid}-2", f"{pid}-3") if (PLANTILLA / "img" / f"{n}.jpg").exists()]


def galeria(prod, ficha):
    """Foto principal + miniaturas solo si existen fotos extra reales (hoy hay una sola por kit)."""
    alt = alt_principal(prod, ficha)
    principal = imagen(prod["id"], alt, "../", "foto foto-producto", principal=True)
    extra = fotos_extra(prod["id"])
    if not extra:
        return f'<div class="marco">{principal}</div>'
    todas = [prod["id"]] + extra
    miniaturas = "".join(
        f'<button type="button" class="mini{" activa" if i == 0 else ""}" data-foto="{n}" aria-label="Ver foto {i + 1} de {len(todas)}" aria-pressed="{"true" if i == 0 else "false"}">'
        f'{img_tag(n, "", "../", clase="mini-img", sizes="72px") or ""}</button>' for i, n in enumerate(todas))
    return f'<div class="marco">{principal}<div class="miniaturas" role="group" aria-label="Fotos del kit">{miniaturas}</div></div>'


def etiqueta_publica(p):
    """Etiqueta corta para la tarjeta: 'etiqueta' explícita o el comienzo del rol sin notas internas."""
    if p.get("etiqueta"):
        return p["etiqueta"]
    return re.split(r"[:(;,.]", p.get("rol", ""))[0].strip().capitalize()


def beneficio(f):
    """Una línea corta de beneficio, tomada de la propia ficha: la 2.ª frase del subtítulo si es breve; si no, el 1.er beneficio."""
    partes = re.split(r"(?<=\.)\s+", f["subtitular"].strip())
    if len(partes) > 1 and len(partes[1]) <= 56:
        return partes[1].rstrip(".")
    return f["beneficios"][0]["titulo"] if f.get("beneficios") else ""


def tarjeta(p, f, mascota, base, referencial=False):
    """Tarjeta de kit (doble marco sobrio): bandeja tonal + foto cuadrada, categoría, nombre, beneficio, piezas, precio y acción."""
    img = imagen(p['id'], alt_principal(p, f), base, 'foto foto-tarjeta', referencial=referencial, sizes='(min-width:1100px) 25vw, (min-width:700px) 33vw, 50vw')
    piezas = len(f.get("incluye") or [])
    n_piezas = f'<small class="tarjeta-piezas">{piezas} {"pieza" if piezas == 1 else "piezas"}</small>' if piezas else ""
    ben = beneficio(f)
    return f"""<a class="tarjeta" data-mascota="{mascota}" href="{base}productos/{e(f['handle'])}.html"><div class="tarjeta-img">{img}</div>
<div class="tarjeta-cuerpo"><h3><span>{e(f['titulo_seo'].split(':')[0])}</span></h3><p class="tarjeta-meta">{e(etiqueta_publica(p))}{' · ' + str(piezas) + (' pieza' if piezas == 1 else ' piezas') if piezas else ''}</p>{f'<p class="tarjeta-beneficio">{e(ben)}</p>' if ben else ''}
<div class="tarjeta-pie"><strong>{clp(p['precio'])}</strong></div><span class="tarjeta-btn" aria-hidden="true">Ver kit {icono('flecha', 'ico ico-s')}</span></div></a>"""


RELACIONADOS = {"kit-bano-secado-perro": ["kit-pelo-cero", "kit-verano-fresco"],
                "kit-gato-sin-pelusas": ["kit-gato-aseo-unas-pelo", "kit-pelo-cero"],
                "kit-pelo-cero": ["kit-gato-sin-pelusas", "kit-bano-secado-perro"]}


def otros_kits(prod, productos):
    por_id = {p["id"]: (p, f) for p, f in productos}
    ids = [i for i in RELACIONADOS.get(prod["id"], []) if i in por_id]
    ids += [p["id"] for p, _ in productos if p["id"] != prod["id"] and p["id"] not in ids]
    elegidos = [por_id[i] for i in ids[:3]]
    if not elegidos:
        return ""
    cards = "".join(tarjeta(p, f, "", "../", referencial=True).replace(" revelar", "") for p, f in elegidos)
    return f'<section class="seccion contenedor" id="otros-kits"><h2>Otros kits que te pueden servir</h2><div class="grilla grilla-otros">{cards}</div></section>'


def portada(productos, marca, tienda):
    def mascota(p):
        if p.get("mascota"):
            return p["mascota"]
        t = (p["id"] + " " + p.get("rol", "")).lower()
        return "gato" if "gato" in t else ("perro" if "perro" in t or "paseo" in t else "ambos")
    tarjetas = "".join(tarjeta(p, f, mascota(p), "") for p, f in productos)
    # Hero: con ambiente-hero.jpg (16:9) la imagen va al lado del texto; sin archivo, panel de marca (sin huecos rotos).
    hero = ambiente("ambiente-hero", sizes="(min-width:900px) 52vw, 100vw", principal=True)
    hero_visual = f'<div class="hero-visual"><div class="marco-azul"><figure class="foto foto-hero">{hero}</figure></div></div>' if hero else ""
    # Tiles de mascota: enlazan al filtro de la grilla; con ambiente-perros.jpg / ambiente-gatos.jpg muestran foto, si no un panel de marca.
    def tile(clave, nombre):
        n = sum(1 for p, f in productos if mascota(p) in (clave, "ambos"))
        foto = ambiente(f"ambiente-{nombre.lower()}", sizes="(min-width:1100px) 25vw, 50vw")
        img_tile = f'<div class="tile-img"><figure class="foto foto-tile">{foto}</figure></div>' if foto else ""
        return (f'<a class="tile{"" if foto else " tile-solo"}" href="#kits" data-filtro-ir="{clave}">{img_tile}'
                f'<span class="tile-pie"><span><strong>{nombre}</strong><small>{n} {"kit" if n == 1 else "kits"}</small></span>{icono("flecha", "ico ico-s")}</span></a>')
    mascotas = (f'<section class="seccion contenedor mascotas" aria-labelledby="t-mascota"><div class="mascotas-in"><div class="mascotas-txt"><h2 id="t-mascota">Elige por mascota</h2><p>Los mismos kits, filtrados para tu perro o tu gato.</p></div>'
                f'{tile("perro", "Perros")}{tile("gato", "Gatos")}</div></section>') if len(productos) > 3 else ""
    preguntas = faq_general(tienda)
    filtros = ('<div class="filtros" role="group" aria-label="Filtrar kits">'
               '<button type="button" class="filtro activo" data-filtro="todos" aria-pressed="true">Todos</button>'
               '<button type="button" class="filtro" data-filtro="perro" aria-pressed="false">Perros</button>'
               '<button type="button" class="filtro" data-filtro="gato" aria-pressed="false">Gatos</button></div>') if len(productos) > 6 else ""
    cuerpo = f"""<section class="hero{' hero-con-img' if hero else ' hero-solo'}">
<div class="contenedor hero-in"><div class="hero-txt">
<h1>Menos pelo en tu casa. Más frescura para tu mascota.</h1>
<p class="hero-sub">Soluciones completas para el pelo y el calor, pensadas para la vida en casa.</p>
<div class="hero-acciones"><a class="boton boton-grande" href="#kits">Mira los kits {isla()}</a><a class="boton boton-fantasma-claro" href="#como-funciona">¿Cómo funciona?</a></div></div>
{hero_visual}</div></section>
{mascotas}
<section class="seccion contenedor" id="kits"><h2>Elige el que necesita tu casa</h2><p class="nota-fotos">Algunas fotos son referenciales hasta que lleguen las reales.</p>{filtros}<p class="sr" id="conteo" role="status" aria-live="polite"></p><div class="grilla" id="grilla">{tarjetas}</div><div class="vacio" id="vacio" hidden><p><strong>Todavía no tenemos kits para esta mascota.</strong> Mira todos los que sí tenemos.</p><button type="button" class="boton boton-fantasma-claro boton-auto" data-filtro-todos>Ver todos los kits</button></div><nav class="paginas" id="paginas" aria-label="Páginas de kits" hidden></nav></section>
{como_funciona()}
{bloque_faq(preguntas)}"""
    url = (tienda.get("url_sitio") or "").rstrip("/")
    web_ld = {"@context": "https://schema.org", "@type": "WebSite", "name": marca["nombre"], **({"url": url + "/"} if url else {})}
    return pagina(marca, tienda, f"{marca['nombre']}: kits para perros y gatos con pago al recibir", marca["promesa"],
                  cuerpo, canonica="", imagen_og=None,
                  extra_ld=(web_ld, ld_faq(preguntas)))


def pagina_contacto(marca, tienda):
    wa = tienda.get("whatsapp")
    tarjetas = []
    if tienda.get("correo"):
        tarjetas.append(("correo", "Correo", f'<a class="contacto-dato" href="mailto:{e(tienda["correo"])}">{e(tienda["correo"])}</a>', "Para consultas con detalle o adjuntos."))
    if tienda.get("direccion_comercial"):
        tarjetas.append(("mapa", "Dirección", f'<span class="contacto-dato">{e(tienda["direccion_comercial"])}</span>', "Domicilio comercial."))
    hay_redes = any((tienda.get("redes") or {}).get(k) for k in REDES)
    if hay_redes:
        tarjetas.append(("instagram", "Síguenos", redes_html(tienda, marca, "redes redes-contacto"), "Nuestras cuentas oficiales."))
    cards = "".join(f'<li class="contacto-card">{icono(i, "ico ico-tile")}<h3>{t}</h3><p>{d}</p><p class="contacto-nota">{n}</p></li>' for i, t, d, n in tarjetas)
    if wa:
        principal = f"""<div class="contacto-wa"><div class="contacto-wa-txt"><span class="contacto-wa-ico">{icono('whatsapp', 'ico ico-tile ico-xl')}</span>
<h2>Escríbenos por WhatsApp</h2><p>Es nuestro canal principal: respondemos por ahí tus consultas y confirmamos tu pedido antes de despachar.</p>
<p class="contacto-num">{e(wa_numero(tienda))}</p></div>
<a class="boton boton-grande boton-wa" href="{e(wa_url(tienda))}" target="_blank" rel="noopener noreferrer">Abrir WhatsApp {isla('whatsapp')}</a></div>"""
    else:
        principal = '<p class="aviso">Estamos completando nuestros datos de contacto. Muy pronto podrás escribirnos desde aquí.</p>'
    ayuda = [("envio", "Despacho", "Plazos por región y cómo coordinamos la entrega.", "despacho.html"),
             ("retracto", "Cambios y garantía", "Retracto de 10 días y garantía legal de 6 meses.", "cambios.html"),
             ("ayuda", "Preguntas frecuentes", "Las dudas más comunes antes de pedir.", "index.html#preguntas")]
    ayuda_html = "".join(f'<li><a class="contacto-ayuda" href="{h}">{icono(i, "ico ico-tile")}<span><strong>{t}</strong><small>{d}</small></span>{icono("flecha", "ico ico-s ir")}</a></li>' for i, t, d, h in ayuda)
    return f"""<section class="contacto-hero"><div class="contenedor estrecho"><h1>Hablemos</h1><p class="hero-sub">¿Dudas sobre un kit, tu pedido o el despacho? Escríbenos y te ayudamos.</p></div></section>
<section class="contenedor estrecho contacto">{principal}
{f'<ul class="contacto-grid">{cards}</ul>' if cards else ''}
<h2 class="contacto-sub">Ayuda rápida</h2><ul class="contacto-ayudas">{ayuda_html}</ul>
<div class="reclamos"><h2 class="contacto-sub">Reclamos</h2><p>Si no quedas conforme con la respuesta, puedes acudir al SERNAC (<a href="https://www.sernac.cl" target="_blank" rel="noopener noreferrer">www.sernac.cl</a>) o al Juzgado de Policía Local de tu comuna.</p></div></section>"""


def legales(marca, tienda):
    pl = tienda["plazos_despacho"]
    paginas = {
        "despacho.html": ("Despacho", f"""<h1>Despacho</h1><p>Despachamos a todo Chile con pago contra entrega. Antes de enviar, confirmamos cada pedido por WhatsApp.</p>
<ul><li>Región Metropolitana: {e(pl['RM'])}.</li><li>Otras regiones: {e(pl['regiones'])}.</li><li>Zonas extremas: {e(pl['zonas_extremas'])}.</li></ul>
<p>El plazo corre desde que confirmamos tu pedido por WhatsApp.</p><p>Si no estás en el domicilio, la transportadora coordina contigo un nuevo intento. Si finalmente no hay entrega, no se cobra nada: pagas solo al recibir.</p>"""),
        "cambios.html": ("Cambios, retracto y garantía", """<h1>Cambios, retracto y garantía</h1>
<h2>Derecho a retracto</h2><p>Puedes arrepentirte de tu compra dentro de 10 días desde que recibes el producto (Ley 19.496, art. 3 bis). Escríbenos por WhatsApp con tu número de pedido y te indicamos cómo devolverlo.</p>
<h2>Garantía legal</h2><p>Si el producto llega con una falla o no corresponde a lo que ofrecimos, tienes 6 meses desde que lo recibes para elegir entre reparación, cambio o devolución del dinero (Ley 19.496, modificada por la Ley 21.398).</p>
<h2>Cómo solicitarlo</h2><p>Escríbenos desde la <a href="contacto.html">página de contacto</a> con tu número de pedido y una foto del producto. Te respondemos en un máximo de 2 días hábiles.</p>"""),
        "privacidad.html": ("Privacidad", """<h1>Política de privacidad</h1><p>Usamos tu nombre, teléfono y dirección solo para confirmar, despachar y dar soporte a tu pedido. Los compartimos únicamente con el proveedor y la transportadora que lo entregan.</p>
<p>No enviamos mensajes promocionales sin tu consentimiento expreso. Puedes pedir acceso, corrección o eliminación de tus datos escribiéndonos (Ley 19.628 y Ley 21.719).</p>"""),
    }
    for archivo, (titulo, cuerpo) in paginas.items():
        # El título pasa a la misma banda azul que Contacto; el texto legal no cambia.
        h1, resto = re.match(r"(<h1>.*?</h1>)(.*)", cuerpo, re.S).groups()
        banda = f'<section class="contacto-hero legal-hero"><div class="contenedor estrecho">{h1}</div></section>'
        (SITIO / archivo).write_text(pagina(marca, tienda, f"{titulo} | {marca['nombre']}", f"{titulo} de {marca['nombre']}",
                                            f'{banda}<section class="seccion contenedor estrecho"><div class="marco legal-marco"><div class="legal">{resto}</div></div></section>',
                                            canonica=archivo), encoding="utf-8")
    (SITIO / "contacto.html").write_text(pagina(marca, tienda, f"Contacto | {marca['nombre']}", f"Contacto de {marca['nombre']}: escríbenos por WhatsApp.",
                                                pagina_contacto(marca, tienda), canonica="contacto.html", clase_body="pg-contacto"), encoding="utf-8")


def pagina_404(marca, tienda, productos):
    """404 de marca: ruta absoluta al sitio (GitHub Pages la sirve desde cualquier ruta), sin canónica y con noindex."""
    raiz = (tienda.get("url_sitio") or "").rstrip("/") + "/"
    cards = "".join(tarjeta(p, f, "", raiz, referencial=True).replace(" revelar", "") for p, f in productos[:3])
    cuerpo = f"""<section class="e404"><div class="contenedor estrecho"><h1>No encontramos esa página</h1>
<p class="hero-sub">Puede que el enlace haya cambiado. Vuelve al inicio o escríbenos y te ayudamos.</p>
<div class="hero-acciones"><a class="boton boton-grande" href="{raiz}index.html">Ir al inicio {isla()}</a><a class="boton boton-grande boton-fantasma-claro" href="{wa_url(tienda)}" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a></div></div>
<div class="contenedor"><div class="grilla grilla-otros e404-kits">{cards}</div></div></section>"""
    html_ = pagina(marca, tienda, f"Página no encontrada | {marca['nombre']}", f"Página no encontrada en {marca['nombre']}.", cuerpo, base=raiz)
    return html_.replace("<head>", '<head>\n<meta name="robots" content="noindex">', 1)


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
                            (f"KW-{p['id'].upper()}" + ("" if v == "Default Title" else f"-{v}"))[:40], "deny", "manual", p["precio"], "TRUE", "TRUE",
                            f["titulo_seo"] if primera else "", f["meta_descripcion"] if primera else "", "draft" if primera else ""])


def main():
    marca, tienda = cargar("marca.json"), cargar("tienda.json")
    fichas = {f["id"]: f for f in cargar("fichas.json")["fichas"]}
    productos = [(p, fichas[p["id"]]) for p in cargar("catalogo.json")["productos"]
                 if p["estado"] in ("aprobado_para_test", "escalar") and p["id"] in fichas]
    orden = tienda.get("orden_vitrina", [])  # el dueño decide qué kit va primero; los no listados siguen en orden de catálogo
    tiene_foto = lambda pid: (PLANTILLA / "img" / f"{pid}.jpg").exists()
    productos.sort(key=lambda pf: (orden.index(pf[0]["id"]), 0) if pf[0]["id"] in orden else (len(orden), 0 if tiene_foto(pf[0]["id"]) else 1))
    if SITIO.exists():
        shutil.rmtree(SITIO)
    (SITIO / "productos").mkdir(parents=True)
    for archivo in ("estilos.css", "pedido.js", "favicon.svg"):
        shutil.copy(PLANTILLA / archivo, SITIO / archivo)
    if (PLANTILLA / "img").exists():
        generar_variantes()
        shutil.copytree(PLANTILLA / "img", SITIO / "img")
    (SITIO / "index.html").write_text(portada(productos, marca, tienda), encoding="utf-8")
    for p, f in productos:
        (SITIO / "productos" / f"{f['handle']}.html").write_text(pagina_producto(p, f, marca, tienda, productos), encoding="utf-8")
    legales(marca, tienda)
    (SITIO / "404.html").write_text(pagina_404(marca, tienda, productos), encoding="utf-8")
    (SITIO / "robots.txt").write_text("User-agent: *\nAllow: /\n" + (f"Sitemap: {tienda['url_sitio'].rstrip('/')}/sitemap.xml\n" if tienda.get("url_sitio") else ""), encoding="utf-8")
    if tienda.get("url_sitio"):
        base = tienda["url_sitio"].rstrip("/")
        hoy = datetime.date.today().isoformat()
        urls = [base + "/"] + [f"{base}/productos/{f['handle']}.html" for _, f in productos]
        (SITIO / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "".join(f"<url><loc>{u}</loc><lastmod>{hoy}</lastmod></url>" for u in urls) + "</urlset>\n", encoding="utf-8")
    csv_shopify(productos, marca)
    print(f"Sitio: {len(productos)} productos -> {SITIO.relative_to(RAIZ)}/ ; CSV Shopify -> shopify/productos.csv")


if __name__ == "__main__":
    main()
