# Área: Diseño y conversión

Agente: `disenador-web`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
- (seo 2026-10-05) [diseno] Handle de Pelo Cero: `kit-pelo-cero-cepillo-bruma-mascotas` solo si la URL actual aún no se usa en anuncios ni está indexada; actualizar sitemap y canónica.
- (seo 2026-10-05) [diseno] Alt de la foto principal de Baño y Secado: "Toalla de microfibra, cepillo de silicona y guante de baño para perros"; `srcset` con 450w y 900w; `lastmod` en `sitemap.xml`; agregar `404.html` con enlaces a los kits.
- (seo 2026-10-05) [diseno] (títulos de las fichas ya vienen de `datos/fichas.json`; falta que marca/SEO los actualice, no es del generador) Reemplazar `<title>` y `<meta name="description">` de los 3 kits por los de `datos/seo/auditoria.md` (máx. 60 y 155 caracteres) y usar `titulo_seo`/`meta_descripcion` de ahí cuando marca actualice las fichas.
- (ads 2026-10-05) [diseno] Cambiar el evento Purchase a Lead/InitiateCheckout en `pedido.js` (I5); declarar el costo de despacho (C3) en ficha y despacho.
- (competencia 2026-10-05) [diseno] En la ficha, mostrar qué incluye cada kit y medidas "por confirmar con proveedor"; sin comparar con precios de piezas sueltas ni "precio de referencia".
- (competencia 2026-10-05) [diseno] Un solo bloque de confianza por ficha que diga "Pagas al recibir" como diferenciador (los competidores leídos no lo ofrecen), sin repetirlo.
- (legal 2026-10-05) diseno: cambiar `pedido.js` línea 154 de `Purchase` a `Lead` o `InitiateCheckout`; cargar el píxel solo con aviso y opción de rechazar (coordinar con ads).
- (legal 2026-10-05) diseno (cuando existan los datos del dueño): integrar el texto de `datos/legal/privacidad.md` en `privacidad.html`; reemplazar `contacto.html` y el pie con los textos de C1; reemplazar `cambios.html` con el texto de I1; añadir el enlace "Cómo usamos tus datos" en la casilla de consentimiento y el aviso de una línea bajo el botón de WhatsApp (textos auxiliares en privacidad.md). Mientras razón social, RUT, domicilio y correo sean null, mostrar aviso interno y no publicar.
- Formulario móvil: probar envío real en iPhone/Android (teclado, autocompletar) y reducir campos si Baymard lo respalda.
- Ficha: galería con 2.ª foto (contenido del kit) cuando existan fotos reales; hoy solo hay una imagen referencial por kit.
- Revisar repetición de "Pagas al recibir" (barra superior, ficha, total del formulario): un solo lugar por página.
- Página Nosotros honesta (backlog P3).
- Página de gracias con complemento de un clic (backlog P3).
- Rendimiento: peso por página, fuentes autohospedadas (backlog P3).

## Hecho
- 2026-10-05 (ronda 2) Paquete SEO/conversión: foto principal de la ficha `loading="eager" fetchpriority="high"` (LCP); bloque "Otros kits / También te puede servir" con 2 tarjetas por ficha (Baño a Pelo Cero y Verano Fresco; Gato Sin Pelusas a Aseo de Gato y Pelo Cero; Pelo Cero a Gato Sin Pelusas y Baño; el resto, los 2 primeros de la vitrina); `og:type=product` en fichas, `og:url`, `og:image:width/height`, `twitter:title/description`; JSON-LD con `offers.url`, `deliveryTime` (handling 0-1, tránsito 2-7 días) e `image` como arreglo. Sin `priceValidUntil` ni `shippingRate` (no hay dato confirmado). Verificado en 390 y 1366 px (index, 2 fichas): sin scroll horizontal ni errores de consola; verificar.py = 0.
- 2026-10-05 Ficha móvil (390 px): foto 4:3, migas ocultas, precio + IVA + "Pagas al recibir" + plazo RM/regiones + botón "Pedir este kit" sobre el pliegue (precio y=633, botón y=791 de 844; antes precio 933-967 y botón 1850+). Barra fija ya no repite "Pagas al recibir". "Qué incluye": cada pieza sin medida dice "Medidas: por confirmar con proveedor". Vitrina con Baño y Secado primero y kits con foto antes (ya estaba en `orden_vitrina`). Verificado en 390 y 1366 px, 3 kits, sin scroll horizontal ni errores de consola; verificar.py = 0.

## Propuestas para otras áreas
- Operaciones/Dropi: medidas y materiales reales de las piezas de los 3 kits de partida, para reemplazar "por confirmar con proveedor".
- Marca: fotos reales del kit y una segunda toma de contenido; hoy son referenciales.
- Legal: confirmar que la línea "Pagas al recibir" más el retracto del formulario cubren lo exigible.

## Pendientes del dueño
