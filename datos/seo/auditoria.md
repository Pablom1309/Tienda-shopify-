# Auditoría SEO técnica: 3 kits de partida (2026-10-05)

Alcance: `sitio/` (HTML generado, no editado) para Kit Baño y Secado, Kit Gato Sin Pelusas y Kit Pelo Cero, más `sitemap.xml`, `robots.txt` y `index.html`. Contraste con `datos/fichas.json` y `datos/catalogo.json`.
Etiquetas: [V] verificado en el HTML o en los datos; [I] inferencia; [H] hipótesis de palabra clave sin dato de volumen.

## Resumen
Lo básico está bien: una canónica, un `title`, una `meta description` y un `h1` por página; `robots.txt` abierto con sitemap; sitemap con las 20 URL de producto; `lang="es-CL"`; precio, moneda CLP y disponibilidad del `Product` coinciden con la página y con `catalogo.json` (26.990 / 29.990 / 27.990; ofertas x2 coherentes). Los problemas reales son: una contradicción de texto en Pelo Cero (legal), títulos y metas demasiado largos o pobres, datos estructurados incompletos para ser elegibles a enriquecidos, la imagen principal con carga diferida, y cero enlaces internos entre kits.

## Hallazgos priorizados

### P0 (antes de pautar)
1. **Pelo Cero: "a vapor" contradice la FAQ "no es vapor caliente"** [V].
   - Aparece en `title`, `meta description`, `og:*`, JSON-LD `Product`, `<p class="sub">`, "1 cepillo a vapor 3 en 1", alt de la foto principal, handle de la URL (`...cepillo-vapor-mascotas`) y `titulo_seo`/`meta_descripcion`/`subtitular` de `fichas.json`. Un lector (y Google, en un resultado enriquecido) entiende vapor caliente.
   - Corrección exacta: reemplazar "cepillo a vapor" por "cepillo con bruma" (o "cepillo con niebla de agua", ya usado en la FAQ). Textos propuestos en la sección de títulos y metas. Alt: "Cepillo con bruma soltando el pelo muerto de un perro en el living".
   - Pregunta frecuente: título "¿Sale vapor caliente?"; respuesta sugerida: "No. Es una bruma fina de agua a temperatura ambiente, no vapor caliente." Verificar con el proveedor que la bruma es a temperatura ambiente antes de dejar la frase (si el cepillo calienta el agua, la FAQ entera es falsa). Marcado "por verificar" en Dropi.
   - Beneficio "Atrapa el pelo muerto": "La niebla suave ayuda a que el pelo suelto se pegue a las cerdas..." es una promesa de eficacia. Suavizar: "Pensado para que el pelo suelto quede en las cerdas de silicona en vez de volar por la casa."
   - Handle: cambiar a `kit-pelo-cero-cepillo-bruma-mascotas` mientras la URL aún no está indexada ni usada en anuncios. Si ya hay enlaces vivos, dejar el handle y cambiar solo los textos (GitHub Pages no permite redirección 301; una redirección con `meta refresh` es pobre).
2. **Dominio canónico sin confirmar** [I]. Todas las canónicas, `og:image`, JSON-LD y sitemap usan `https://pablom1309.github.io/Tienda-shopify-/` (el correo del dueño es `pablom12389`, el repo se llama `tienda-shopify-` en minúsculas). Confirmar con el dueño la URL pública real; si se compra dominio propio o se pasa a Shopify, todas las canónicas y el sitemap cambian y hay que registrarlo en Search Console. Hasta entonces, no enviar el sitemap a Search Console.
3. **Imagen principal con `loading="lazy"`** [V]. En las 3 fichas la foto de producto (la imagen LCP, arriba del pliegue) lleva `loading="lazy"`. Corrección: en la primera imagen de la galería usar `loading="eager" fetchpriority="high"` y mantener `lazy` en el resto.

### P1 (esta semana)
4. **Títulos largos** [V]. Pelo Cero 76 caracteres, Gato 82, Baño 87; Google corta cerca de 60. Quedan cortados sin el nombre de marca. Propuestas más abajo (55 a 60).
5. **Metas descriptivas cortas y sin gancho** [V]. 100 a 125 caracteres, sin condición de compra. Propuestas de 130 a 150 caracteres con "pagas al recibir" (un solo lugar de la SERP; en la página sigue el principio de un mensaje, un lugar).
6. **`Product` incompleto** [V]. Hoy: `name`, `description`, `brand`, `sku`, `image` (una), `offers` con `price`, `priceCurrency`, `availability`, `itemCondition`, `hasMerchantReturnPolicy` y `shippingDetails` solo con destino. Faltan para ser elegibles a enriquecidos de comercio:
   - `offers.url` (la canónica) y `offers.priceValidUntil` (fecha real de revisión de precio, p. ej. fin del mes).
   - `shippingDetails.shippingRate` (`MonetaryAmount`; si el despacho es gratis, `value: 0, currency: CLP`; si no se ha definido, no inventarlo: confirmar con operaciones) y `deliveryTime` (handling 0-1 días, tránsito 2-4 días hábiles RM / 3-7 regiones, tomado de la página).
   - `hasMerchantReturnPolicy`: agregar `returnFees` y `returnMethod` solo si `cambios.html` los define (no inventar).
   - `image` como arreglo con la foto principal y la de contenido (existen `kit-pelo-cero-contenido`; Baño y Gato no tienen foto de contenido).
   - Sin `aggregateRating` ni `review`: correcto, no hay reseñas reales.
   - `og:type` pasar a `product`; agregar `og:url`, `twitter:title`, `twitter:description`, `og:image:width/height`.
7. **Cero enlaces internos entre fichas** [V]. Las fichas solo enlazan a `index.html#kits`, páginas legales y WhatsApp. Un visitante de Gato Sin Pelusas no ve Pelo Cero ni Baño. Agregar bloque "Otros kits" (2 a 3 enlaces con texto descriptivo, no "ver más") y, cuando exista, enlace a la guía correspondiente. Texto ancla sugerido:
   - Baño y Secado: "Kit Pelo Cero para el pelo suelto" y "Kit Verano Fresco".
   - Gato Sin Pelusas: "Kit Aseo de Gato" y "Kit Pelo Cero".
   - Pelo Cero: "Kit Gato Sin Pelusas (cepillo para gatos)" y "Kit Baño y Secado".
8. **Canibalización Pelo Cero / Gato Sin Pelusas** [I]. Ambos incluyen cepillo + removedor de pelo y la FAQ de Pelo Cero dice "perros y gatos". Dejar claro quién es quién: Pelo Cero = perros (título y `h1`), Gato Sin Pelusas = gatos. Cambiar la FAQ a "¿Sirve para gatos?" solo si el proveedor lo confirma; si no, quitar "y gatos" de esa pregunta y enlazar al kit de gatos.

### P2 (próximas dos semanas)
9. **`h1` sin palabra clave** [V]. Los tres `h1` son frases de beneficio (buenas para conversión). Mantenerlos; la palabra clave va en `title`, meta y subtítulo. Un solo `h1` por página: correcto.
10. **Alt de imágenes** [V]. Pelo Cero: correcto salvo "a vapor". Gato: correcto. Baño: "Toalla de microfibra para perros" no describe el kit; propuesta "Toalla de microfibra, cepillo de silicona y guante de baño para perros". Foto de contenido de Pelo Cero: "Todo lo que trae el Kit Pelo Cero" aceptable; mejor "Cepillo con bruma, removedor y cable USB del Kit Pelo Cero".
11. **`srcset` con un solo ancho (900w)** [V]. En móvil se descarga la imagen de 900 px. Generar 450w y 900w. Impacto bajo, esfuerzo bajo.
12. **Breadcrumb**: el HTML enlaza "Kits" a `index.html#kits` y el JSON-LD `BreadcrumbList` omite el segundo nivel real; el último elemento no lleva `item` (válido). Sin acción urgente.
13. **Sitemap** [V]: sin `lastmod`; no incluye páginas legales (aceptable). Agregar `lastmod` real por URL cuando el generador conozca la fecha de cambio. `robots.txt` correcto; no bloquea rastreadores de IA.
14. **No hay `404.html`** [V]. GitHub Pages sirve el suyo; agregar uno con enlaces a los kits.
15. **Medidas y materiales "por confirmar con proveedor"** en los 3 kits [V] (tarea I3 de legal). Es hueco de contenido que también perjudica la FAQ y el SEO de especificaciones; pendiente de operaciones/Dropi. No inventar.
16. **Fuentes de Google render-blocking** [I]: `display=swap` ya está. Auto-hospedar las dos fuentes mejoraría LCP; esfuerzo medio, impacto bajo.

## Títulos y metas propuestos por kit
Largo en caracteres entre paréntesis (el sitio añade " | Kuchiwau").

### Kit Baño y Secado
- Title (60): `Kit de baño para perros: toalla, cepillo y guante | Kuchiwau`
- Meta (~137): `Toalla de microfibra, cepillo de silicona y guante de baño para el día de baño de tu perro. No incluye shampoo. Pagas al recibir.`
- Palabra clave principal: "kit de baño para perros" [H: sin dato de volumen en `estacionalidad-trends.md`; validar en Search Console y Google Trends]. Secundarias [H]: "toalla de microfibra para perros", "guante de baño para perros".
- Alt imagen principal: `Toalla de microfibra, cepillo de silicona y guante de baño para perros`

### Kit Gato Sin Pelusas
- Title (56): `Cepillo para gatos autolimpiante + removedor | Kuchiwau`
- Meta (~135): `Cepillo autolimpiante para gatos, removedor de pelos reutilizable para sillón y ropa, y varita con plumas para jugar. Pagas al recibir.`
- Palabra clave principal: "cepillo para gatos" [V: `investigacion/estacionalidad-trends.md`, pico en octubre (índice 1,52), búsqueda +27 %; volumen absoluto bajo en Chile]. Secundaria: "pelo de gato en el sillón" [H].

### Kit Pelo Cero (texto corregido, sin "vapor")
- Title (55): `Kit Pelo Cero: cepillo con bruma + removedor | Kuchiwau`
- Meta (~140): `Cepillo con bruma de agua 3 en 1 y removedor reutilizable para el pelo suelto de tu perro, en el sillón y la ropa. Pagas al recibir.`
- Subtitular (ficha): `Cepillo con bruma 3 en 1 + removedor reutilizable. Pensado para perros que sueltan pelo: uno para tu regalón y otro para la casa.`
- Lista "Qué incluye": `1 cepillo con bruma 3 en 1`
- Palabra clave principal: "pelo de perro" [V: serie estable todo el año, índice 0,8 a 1,2, única sin ceros, +14 %; `estacionalidad-trends.md`] y "cepillo para perros" [V: pico nov 1,14, jul 1,13; −10 % en 5 años]. Secundaria: "quitar pelo de perro del sillón" [H].

Todos los datos de volumen en Chile son bajos; Trends sirve para el cuándo, no el cuánto (nota de `estacionalidad-trends.md`). Estas páginas se descubren más por Instagram y TikTok que por Google; el SEO aquí es base de marca, no canal principal de la primera semana.

## Cambios por área (resumen)
- Diseño (generador): puntos 2 (cuando haya dominio), 3, 6, 7, 10, 11, 13, 14 y título/meta/alt de las tres fichas.
- Copy de fichas (`datos/fichas.json`, no editado por SEO): Pelo Cero según P0-1 y FAQ del punto 8. Un solo dueño de los cambios de texto.
- Operaciones: `shippingRate` real, medidas y materiales, confirmación de la bruma con el proveedor.
- Dueño: dominio público definitivo.
