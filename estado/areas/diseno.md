# Área: Diseño y conversión

Agente: `disenador-web`. Lo actualiza el propio agente en cada ronda.

## Diagnóstico 2026-10-05 con skills
Skills usadas: impeccable (critique.md y audit.md, modo "Launcher unavailable": sin detector, evaluación manual + Playwright), redesign-existing-projects, design-taste-frontend (lectura: tienda DTC de confianza para dueños de mascotas, lenguaje cálido y sobrio, se conserva Fraunces + Nunito + tinta/mandarina/crema), find-animation-opportunities, improve-animations y review-animations (STANDARDS.md), break-ui. Capturas base: scratchpad/capturas/base-*.png (390 y 1366).
Puntaje heurístico (Nielsen, estimado, los 10 aplican): 31/40 (Bueno). Visibilidad 3, Match mundo real 4, Control 3, Consistencia 3, Prevención de errores 3, Reconocimiento 3, Flexibilidad 3, Estética minimalista 3 (ruido de etiquetas repetidas), Recuperación de errores 3, Ayuda 3.
Top 10 problemas (P0 bloquea, P1 mayor, P2 menor):
1. [P1] Hero escritorio: el bloque de texto quedaba centrado por el flex y desalineado del logo, y el titular se acercaba a la cara del perro. HECHO.
2. [P1] Hero móvil: el kicker en píldora gris sobre la foto, tres líneas de kicker, dos botones apilados y ningún kit a la vista. HECHO (kicker en línea, imagen 4:3, secundario como enlace).
3. [P1] Ficha móvil: la bajada se cortaba con puntos suspensivos a mitad de frase ("para que us…"). HECHO.
4. [P1] "Imagen referencial" repetido en las 8 fotos de la grilla ("un mensaje, un lugar"). HECHO: una nota sobre la grilla; se mantiene en la ficha y en "Otros kits".
5. [P1] Contacto: título, botón y flotante decían lo mismo ("Escríbenos por WhatsApp") y el botón se partía en 2 líneas en móvil. HECHO (botón "Abrir WhatsApp", flotante oculto en contacto).
6. [P1] Móvil: el botón flotante de WhatsApp tapaba texto del formulario en la ficha (el header ya tiene WhatsApp). HECHO: oculto en fichas móvil.
7. [P2] Kickers en MAYÚSCULAS espaciadas en todas las secciones (choca con el tono "sin mayúsculas gritonas"). HECHO: minúsculas con filete mandarina.
8. [P2] Ritmo plano: portada con todo sobre el mismo crema. HECHO: "Cómo funciona" en banda suave de ancho completo; espaciado 88/56.
9. [P2] Tarjetas sin dato útil de contenido y precio secundario de 11 px. HECHO: "Kit de N piezas" (dato de la ficha), 2 por $X a .8rem, nombre en 2 líneas máx., etiqueta en una línea.
10. [P2] Cabecera desborda a 320 px (61 px de scroll horizontal) y títulos en peso 700 pesados. HECHO: cabecera compacta a <360 px; títulos Fraunces 600 con tracking -0.022em; cifras tabulares.

## Próximas tareas
- (ronda 4) [diseno] Fuentes autohospedadas (Fraunces/Nunito subset) para quitar el salto de fuente y la dependencia de Google; en el entorno sin fuentes se ve el respaldo (Times/DejaVu), en celulares reales no.
- (ronda 4) [diseno] Ficha escritorio: galería con miniaturas cuando existan 2.ª y 3.ª foto reales; hoy una sola imagen 4:5.
- (ronda 4) [diseno] Íconos propios del set de marca (trazo 2 px + estrella mandarina) en lugar de los genéricos.
- (ronda 4) [diseno] Sección "Reseñas reales, pronto" de la ficha: evaluar acortarla a una línea hasta que existan reseñas verificadas.
- (ronda 4) [diseno] Animación de apertura del FAQ (altura con grid 0fr->1fr) y transición entre páginas, solo si no empeora el rendimiento.
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
- 2026-10-05 (ronda 4, pedido del dueño: nivel de las mejores tiendas) Lote de diseño con skills (ver Diagnóstico): hero alineado y compacto en móvil, kickers en minúscula con filete, títulos 600, cifras tabulares, nota única de fotos referenciales, tarjetas con "Kit de N piezas" y casos extremos controlados, "Cómo funciona" en banda de ancho completo, ficha con bajada completa y etiqueta mandarina suave, flotante de WhatsApp oculto donde estorba, contacto con botón corto, cabecera sin desborde a 320 px. Movimiento: revelado 400 ms/12 px con ease-out propio, tarjetas y filtros con feedback `:active`, reduced-motion sin desplazamientos. Estrés (break-ui, inyectando datos en Playwright, sin toggles en el sitio): nombre de kit de 100+ caracteres, precio $1.299.990 en tarjeta y ficha, etiqueta larga, 320/390/1366 px sin scroll horizontal. Capturas: scratchpad/capturas/r4-*.png. verificar.py = 0; consola sin errores (salvo Google Fonts bloqueado por el proxy).
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
