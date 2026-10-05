# Área: SEO y contenido

Agente: `seo-contenido`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
1. Guía "Verano con tu perro" en `datos/guias/` (plazo 15-nov; empezar la semana del 12-oct; fuentes: `investigacion/estacionalidad-trends.md`, sin afirmaciones de salud; enlazar a Kit Verano Fresco y piscina plegable).
2. Aplicar y verificar las correcciones P0/P1 de `datos/seo/auditoria.md` cuando diseño las implemente (revisar HTML regenerado).
3. Guía "Menos pelo en casa" con enlaces a Pelo Cero, Gato Sin Pelusas y Baño y Secado.
4. Mapa de palabras clave por página para el resto de los 17 kits (hoy solo los 3 de partida) y medir con Search Console cuando exista dominio verificado.
5. Revisar medidas y materiales cuando operaciones los confirme (tarea I3 de legal) y reflejarlos en FAQ y especificaciones.

## Hecho
- 2026-10-05: auditoría técnica de los 3 kits de partida, sitemap, robots e index. Informe con corrección exacta, títulos y metas por kit en `datos/seo/auditoria.md`.
- 2026-10-05: tarea I4 de legal resuelta en propuesta: "a vapor" contradice la FAQ; texto corregido "cepillo con bruma" (título, meta, subtítulo, "qué incluye", alt, handle) listo para aplicar.
- Precio, moneda CLP y disponibilidad del `Product` verificados coherentes con página y `datos/catalogo.json` en los 3 kits.

## Propuestas para otras áreas
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
