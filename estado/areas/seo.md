# Área: SEO y contenido

Agente: `seo-contenido`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
- (sesión ads 2026-10-05) [contenido] Mientras no se confirme la función, renombrar Pelo Cero a "cepillo con niebla de agua" en la ficha (legal I4).
- (sesión competencia 2026-10-05) [seo] Palabras de búsqueda de pieza suelta (cepillo autolimpiante gato, guante removedor, toalla microfibra perro) para las fichas; Petco y TusMascotas rankean por marca.
- (sesión legal 2026-10-05) contenido: Pelo Cero, revisar "a vapor" frente a la FAQ "no es vapor caliente" (I4); completar medidas y materiales de los 3 kits (I3).
- (sesión legal 2026-10-05) [contenido] Retirar de portada/fichas cualquier "exactos"; mantener lo marcado como pendiente sin cifras inventadas.
- (sesión direccion 2026-10-05) [seo] Revisar el HTML regenerado de los 3 kits (título, meta, canónica, `Product` coherente con el precio visible y el despacho) apenas diseño integre los cambios. Sumar a "Qué incluye" las palabras de pieza suelta.
- (ads 2026-10-05) [contenido] Mientras no se confirme la función, renombrar Pelo Cero a "cepillo con niebla de agua" en la ficha (legal I4).
- (competencia 2026-10-05) [seo] Palabras de búsqueda de pieza suelta (cepillo autolimpiante gato, guante removedor, toalla microfibra perro) para las fichas; Petco y TusMascotas rankean por marca.
1. Guía "Verano con tu perro": esqueleto listo en `datos/guias/verano-con-tu-perro.md`. Redactar borrador (26-oct), revisión legal (2-nov), publicar 9-nov (plazo 15-nov). Falta fuente institucional para la parte de cuidados (si no hay, omitir).
2. Aplicar y verificar las correcciones P0/P1 de `datos/seo/auditoria.md` cuando diseño las implemente (revisar HTML regenerado).
3. Guía "Menos pelo en casa" con enlaces a Pelo Cero, Gato Sin Pelusas y Baño y Secado.
4. Mapa de palabras clave por página para el resto de los 17 kits (hoy solo los 3 de partida) y medir con Search Console cuando exista dominio verificado.
5. Revisar medidas y materiales cuando operaciones los confirme (tarea I3 de legal) y reflejarlos en FAQ y especificaciones.

## Hecho
- 2026-10-05 (sesión 17:35): revisión del sitio rediseñado. Ya resuelto en el HTML: imagen principal `eager` + `fetchpriority="high"`, `og:type=product` + `og:url` + `twitter:*`, `srcset` 450/900, bloque "Otros kits" en fichas, alt de Baño, `lastmod` en sitemap, `offers.url`, `deliveryTime`, `image` como arreglo, title/meta de Pelo Cero sin "vapor", h1 únicos de beneficio. Pendiente: lo listado abajo.
- 2026-10-05: palabras clave de pieza suelta de los 3 kits (todas sin dato de volumen) en `datos/seo/palabras-clave-piezas.md`.
- 2026-10-05: esqueleto de la guía en `datos/guias/verano-con-tu-perro.md` (meta interna: borrador 26-oct, publicada 9-nov, plazo 15-nov).
- 2026-10-05: auditoría técnica de los 3 kits de partida, sitemap, robots e index. Informe con corrección exacta, títulos y metas por kit en `datos/seo/auditoria.md`.
- 2026-10-05: tarea I4 de legal resuelta en propuesta: "a vapor" contradice la FAQ; texto corregido "cepillo con bruma" (título, meta, subtítulo, "qué incluye", alt, handle) listo para aplicar.
- Precio, moneda CLP y disponibilidad del `Product` verificados coherentes con página y `datos/catalogo.json` en los 3 kits.

## Propuestas para otras áreas
Sesión 2026-10-05 (revisión tras rediseño, en orden de prioridad):
- [diseno] Title de Baño y Secado (87 caracteres) y Gato Sin Pelusas (82): reemplazar por `Kit de baño para perros: toalla, cepillo y guante | Kuchiwau` (60) y `Cepillo para gatos autolimpiante + removedor | Kuchiwau` (56). Mismo cambio en `og:title`, `twitter:title` y `name` del JSON-LD si corresponde.
- [diseno] Meta de Baño y de Gato Sin Pelusas: agregar " Pagas al recibir." al final (Pelo Cero ya la tiene; los otros dos no).
- [diseno] `Product.offers`: falta `priceValidUntil` (fecha real de revisión de precio) y `shippingDetails.shippingRate` (solo cuando operaciones confirme la tarifa; si no, omitir). No agregar `aggregateRating`.
- [diseno] Kit Verano Fresco: la meta no tiene condición de compra ni palabra clave; title de 78 caracteres. Propuesta title `Kit Verano Fresco: alfombra refrigerante + botella de paseo | Kuchiwau`; meta `Alfombra de gel que se siente fresca sin congelar ni enchufar y botella bebedero para los paseos. Pagas al recibir.`
- [diseno] Piscina plegable: title de 70 caracteres; propuesta `Piscina plegable para perros 120x30 cm | Kuchiwau`.
- [diseno] Jerarquía: el HTML de las fichas pasa de `h1` a `h2` ("Por qué funciona", etc.) y `h3` solo en tarjetas y "Qué incluye"; correcto. En la home verificar un solo `h1`.
- [diseno] Enlace "Kits" de migas apunta a `index.html#kits` y el `BreadcrumbList` omite ese nivel: agregar `{"position":2,"name":"Kits","item":"<home>#kits"}` o quitar "Kits" del HTML. Prioridad baja.
- [diseno] Alt de foto de contenido de Verano Fresco: "Todo lo que trae el Kit Verano Fresco" a "Alfombra refrigerante y botella bebedero del Kit Verano Fresco". Las fotos de contenido en `loading="lazy"` están bien.
- [diseno] Bloque "Otros kits": agregar un tercer enlace en cada ficha (hoy 2 tarjetas) y, cuando exista, "Guía: Verano con tu perro" en Verano Fresco y Piscina. Plantilla de guía: `Article` + `FAQPage` + `BreadcrumbList`, y agregar al sitemap.
- [diseno] Rendimiento percibido: las dos familias de Google Fonts bloquean el render; auto-hospedarlas (woff2 con `font-display: swap`) y `preload` de la de títulos. Prioridad baja.
- [diseno] Handle de Pelo Cero aún lleva "vapor" (URL, canónica, sitemap, enlaces de index y fichas): ver propuesta de handle más abajo; decidir antes de pautar.
- [marca] Palabras de pieza suelta por ficha en `datos/seo/palabras-clave-piezas.md`: usar en subtítulo, "qué incluye", alt y FAQ, una vez cada una, sin listas de palabras.

Propuestas anteriores (aún vigentes cuando no estén resueltas arriba):
- [diseno] En las fichas, la primera imagen de la galería: `loading="eager" fetchpriority="high"` en lugar de `loading="lazy"` (imagen LCP).
- [diseno] Reemplazar `<title>` y `<meta name="description">` de los 3 kits por los de `datos/seo/auditoria.md` (máx. 60 y 155 caracteres) y usar `titulo_seo`/`meta_descripcion` de ahí cuando marca actualice las fichas.
- [diseno] JSON-LD `Product`: agregar `offers.url` (canónica), `offers.priceValidUntil`, `shippingDetails.shippingRate` y `deliveryTime` (2 a 4 días hábiles RM, 3 a 7 regiones; tarifa solo si operaciones la confirma), `image` como arreglo. Sin `aggregateRating` ni `review` hasta tener reseñas reales.
- [diseno] `og:type` a `product`; agregar `og:url`, `twitter:title`, `twitter:description`, `og:image:width` y `og:image:height`.
- [diseno] Bloque "Otros kits" (2 a 3 enlaces con texto descriptivo) en cada ficha: Baño y Secado a Pelo Cero y Verano Fresco; Gato Sin Pelusas a Aseo de Gato y Pelo Cero; Pelo Cero a Gato Sin Pelusas y Baño y Secado. Enlazar a las guías cuando existan.
- [diseno] Alt de la foto principal de Baño y Secado: "Toalla de microfibra, cepillo de silicona y guante de baño para perros"; `srcset` con 450w y 900w; `lastmod` en `sitemap.xml`; agregar `404.html` con enlaces a los kits.
- [marca] Textos de `datos/fichas.json` de Pelo Cero (sin vapor): `titulo_seo` "Kit Pelo Cero: cepillo con bruma + removedor"; `meta_descripcion` "Cepillo con bruma de agua 3 en 1 y removedor reutilizable para el pelo suelto de tu perro, en el sillón y la ropa. Pagas al recibir."; `subtitular` "Cepillo con bruma 3 en 1 + removedor reutilizable. Pensado para perros que sueltan pelo: uno para tu regalón y otro para la casa."; "qué incluye" "1 cepillo con bruma 3 en 1"; alt "Cepillo con bruma soltando el pelo muerto de un perro en el living"; beneficio 1 "Pensado para que el pelo suelto quede en las cerdas de silicona en vez de volar por la casa."; FAQ "¿Sale vapor caliente?" con "No. Es una bruma fina de agua a temperatura ambiente, no vapor caliente." (confirmar antes con el proveedor). Revisar con legal. Si la ficha tiene otro dueño, que dirección lo derive.
- [marca] En Pelo Cero, la FAQ "¿Sirve para perros y gatos?": confirmar con el proveedor o dejar solo perros y enlazar a Gato Sin Pelusas (evita competir entre fichas).
- [operaciones] Confirmar con el proveedor que la bruma es a temperatura ambiente; tarifa real de despacho para `shippingRate`; medidas y materiales de los 3 kits.
- [diseno] Handle de Pelo Cero: `kit-pelo-cero-cepillo-bruma-mascotas` solo si la URL actual aún no se usa en anuncios ni está indexada; actualizar sitemap y canónica.

## Pendientes del dueño
- Confirmar el dominio público definitivo: hoy las canónicas apuntan a `https://pablom1309.github.io/Tienda-shopify-/`. No enviar el sitemap a Search Console hasta confirmarlo.
- Verificar la propiedad en Google Search Console (acción humana).
