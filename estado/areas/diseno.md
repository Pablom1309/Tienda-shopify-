# Área: Diseño y conversión

Agente: `disenador-web`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
- (marca 2026-10-05) [diseno] Microcopys cercanos, prácticos y sobrios: verbos cortos ("Pide el tuyo", "Mira qué trae", "Escríbenos por WhatsApp"), sin mayúsculas gritonas, sin urgencia; "Pagas al recibir" solo en el botón/zona de compra (un mensaje, un lugar). Estrella #FFC845 solo en detalles, no como calificación (no hay reseñas).
- (marca 2026-10-05) [diseno] En lugar de fotos de stock, ilustraciones planas simples (huella, cepillo, toalla, varita) sobre fondo crema #FFF8F0 o #FCEFE3 para los espacios sin foto real; se reemplazan por la foto real de la unidad apenas exista. Nunca ilustrar antes/después ni mascotas "sufriendo".
- (marca 2026-10-05) [diseno] Íconos de la web en trazo redondeado de 2 px (como la huella del isotipo), azul tinta #24316B con un solo detalle mandarina #FF8A4C (la estrella de 4 puntas del isotipo) en el elemento clave de cada ícono; mismo set para "qué incluye", pasos de uso y pie.
- (seo 2026-10-05) [diseno] Handle de Pelo Cero: `kit-pelo-cero-cepillo-bruma-mascotas` solo si la URL actual aún no se usa en anuncios ni está indexada; actualizar sitemap y canónica.
- (seo 2026-10-05) [diseno] Agregar `404.html` con enlaces a los kits (alt, srcset y lastmod ya hechos).
- (seo 2026-10-05) [diseno] (títulos de las fichas ya vienen de `datos/fichas.json`; falta que marca/SEO los actualice, no es del generador) Reemplazar `<title>` y `<meta name="description">` de los 3 kits por los de `datos/seo/auditoria.md` (máx. 60 y 155 caracteres) y usar `titulo_seo`/`meta_descripcion` de ahí cuando marca actualice las fichas.
- (ads 2026-10-05) [diseno] Declarar el costo de despacho (C3) en ficha y despacho cuando exista el dato (Purchase->Lead ya hecho).
- (competencia 2026-10-05) [diseno] En la ficha, mostrar qué incluye cada kit y medidas "por confirmar con proveedor"; sin comparar con precios de piezas sueltas ni "precio de referencia".
- (legal 2026-10-05) diseno: cargar el píxel solo con aviso y opción de rechazar (coordinar con ads); Lead ya en `pedido.js`.
- (legal 2026-10-05) diseno (cuando existan los datos del dueño): integrar el texto de `datos/legal/privacidad.md` en `privacidad.html`; reemplazar `contacto.html` y el pie con los textos de C1; reemplazar `cambios.html` con el texto de I1; añadir el enlace "Cómo usamos tus datos" en la casilla de consentimiento y el aviso de una línea bajo el botón de WhatsApp (textos auxiliares en privacidad.md). Mientras razón social, RUT, domicilio y correo sean null, mostrar aviso interno y no publicar.
- Formulario móvil: probar envío real en iPhone/Android (teclado, autocompletar) y reducir campos si Baymard lo respalda.
- Ficha: galería con 2.ª foto (contenido del kit) cuando existan fotos reales; hoy solo hay una imagen referencial por kit.
- Página Nosotros honesta (backlog P3).
- Página de gracias con complemento de un clic (backlog P3).
- Rendimiento: peso por página, fuentes autohospedadas (backlog P3).

## Hecho
- 2026-10-05 (ronda 3) `pedido.js`: evento del píxel `Purchase` -> `Lead` al abrir WhatsApp (Purchase queda documentado: solo con confirmación real). Imágenes: el build genera variantes webp de 450 px con ImageMagick (`convert`; Pillow no está instalado) y `srcset` 450w/900w con `sizes`; alt de Baño y Secado = "Toalla de microfibra, cepillo de silicona y guante de baño para perros" (`ALT_PRINCIPAL` en el generador); `lastmod` en sitemap.xml. Un solo mensaje "Pagas al recibir": ficha = barra superior (se quitó de la lista bajo el precio); portada = barra + paso 3 de "Cómo funciona" (se quitó la píldora del pie y el título pasó a "Comprar es así de simple"). Botón WhatsApp flotante solo ícono en fichas de escritorio (tapaba el precio de "2 kits"). Verificado en 390 y 1366 (portada, ficha Baño y Secado, contacto): sin scroll horizontal; único error de consola es Google Fonts bloqueado por el proxy del entorno; verificar.py = 0.
- 2026-10-05 (pedido directo del dueño) Salto visual: página de contacto nueva (tarjeta WhatsApp con botón "Escríbenos por WhatsApp" a wa.me con mensaje prellenado, número "+56 9 7981 4797" como enlace wa.me y tarjeta "Llámanos" tel:, correo/dirección solo si no son null, tarjetas de ayuda a Despacho, Cambios y Preguntas); íconos SVG de WhatsApp/Instagram/TikTok/Facebook en pie y contacto (redes solo si `datos/tienda.json` -> `redes.*` no es null; hoy solo WhatsApp); botón flotante de WhatsApp en todas las páginas (sube sobre la barra fija en fichas móvil, safe-area); header con ícono WhatsApp y enlace Contacto; hero con chip y botón fantasma; tarjetas de producto con etiqueta sobre la foto y botón circular; íconos en recuadro en beneficios y cómo funciona; pie en 4 columnas con "Pago contra entrega". Verificado en 390 y 1366 px (portada, ficha Baño y Secado, contacto): sin scroll horizontal ni errores de consola; verificar.py = 0.
- 2026-10-05 (ronda 2) Paquete SEO/conversión: foto principal de la ficha `loading="eager" fetchpriority="high"` (LCP); bloque "Otros kits / También te puede servir" con 2 tarjetas por ficha (Baño a Pelo Cero y Verano Fresco; Gato Sin Pelusas a Aseo de Gato y Pelo Cero; Pelo Cero a Gato Sin Pelusas y Baño; el resto, los 2 primeros de la vitrina); `og:type=product` en fichas, `og:url`, `og:image:width/height`, `twitter:title/description`; JSON-LD con `offers.url`, `deliveryTime` (handling 0-1, tránsito 2-7 días) e `image` como arreglo. Sin `priceValidUntil` ni `shippingRate` (no hay dato confirmado). Verificado en 390 y 1366 px (index, 2 fichas): sin scroll horizontal ni errores de consola; verificar.py = 0.
- 2026-10-05 Ficha móvil (390 px): foto 4:3, migas ocultas, precio + IVA + "Pagas al recibir" + plazo RM/regiones + botón "Pedir este kit" sobre el pliegue (precio y=633, botón y=791 de 844; antes precio 933-967 y botón 1850+). Barra fija ya no repite "Pagas al recibir". "Qué incluye": cada pieza sin medida dice "Medidas: por confirmar con proveedor". Vitrina con Baño y Secado primero y kits con foto antes (ya estaba en `orden_vitrina`). Verificado en 390 y 1366 px, 3 kits, sin scroll horizontal ni errores de consola; verificar.py = 0.

## Propuestas para otras áreas
- Dueño/Dirección: completar `redes` en `datos/tienda.json` al crear las cuentas (LANZAMIENTO 0.4); los íconos aparecen solos.
- Operaciones/Dropi: medidas y materiales reales de las piezas de los 3 kits de partida, para reemplazar "por confirmar con proveedor".
- Marca: fotos reales del kit y una segunda toma de contenido; hoy son referenciales.
- Legal: confirmar que la línea "Pagas al recibir" más el retracto del formulario cubren lo exigible.

## Pendientes del dueño
