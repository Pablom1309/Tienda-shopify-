# Design — Kuchiwau (rediseño 2026-10-06, ronda 14)

Mundo visual: **tienda grande chilena, alegre y moderna**. Una tienda de retail clara (referencia Falabella / Paris): blanco y gris azulado muy claro, el azul de marca #24316B como color que firma la página (barra, hero, botones secundarios, precio, pie) y un solo acento mandarina para la acción de compra. El producto manda: grilla densa, imagen cuadrada grande, precio protagonista, acción visible. Reemplaza por completo el mundo anterior (crema, serif Fraunces, mandarina apagada).

## Color (OKLCH aproximado, hex de uso)
| Rol | Hex | Uso |
|---|---|---|
| Lienzo | `#FFFFFF` | fondo base, tarjetas, formulario |
| Superficie | `#F3F5F9` | sección de kits, bandejas de imagen, campos |
| Azul de marca | `#24316B` | precio, enlaces, bordes activos, hero, barra superior, botón secundario |
| Azul profundo | `#141B3F` | pie, texto sobre mandarina |
| Mandarina | `#FF8A4C` | botón de compra (hero, ficha, barra fija); iconos sobre azul. Nunca en texto sobre blanco |
| Mandarina suave | `#FFF1E7` | banda "cómo funciona" |
| Tinta | `#1C2033` | texto principal |
| Apagado | `#4F566B` | texto secundario (AA sobre blanco y superficie) |
| Línea | `#DDE2EC` | filetes y bordes de 1 px |
| Error | `#B3261E` | validación |

Estrategia: azul comprometido en 3–4 regiones grandes (barra, hero, CTA final, pie); mandarina rara y siempre con texto azul profundo (contraste ≈ 6,5:1). Sin degradados, sin sombras de color, sin resplandores.

## Tipografía
Una sola familia: **Figtree** (Google Fonts, 400/500/600/700/800). Sans geométrica-humanista, terminaciones redondeadas que acompañan la palabra del logo, cifras claras con `tabular-nums` para precios y legible a 14 px en móvil. Elegida sobre Outfit (cifras más anchas, peor en cuerpo), Manrope (más fría, parece fintech) y Plus Jakarta (marcada como sobreusada por el detector). Cargada con `display=swap`; respaldo `system-ui`.

Escala por roles (fija, retail; no fluida salvo h1/h2):
- Hero h1: clamp(2rem, 5vw, 3.5rem), 800, interlínea 1.05, tracking -0.02em.
- h2 de sección: clamp(1.5rem, 3vw, 2rem), 800, 1.15.
- h3 / nombre de producto: 1rem (1.0625 en escritorio), 600, 1.3.
- Precio de tarjeta: 1.375rem, 800, azul. Precio de ficha: 2.25rem, 800.
- Cuerpo 1rem/1.6 (medida ≤ 68ch); secundario 0.875rem; mínimo funcional 0.75rem (12 px) solo para "Foto referencial" y notas.

## Espaciado y forma
Escala 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80. Secciones 48 px (móvil) / 80 px (escritorio) de aire vertical. Contenedor 1200 px, gutter 16/24 px. Radios: 4 px en botones, campos y tarjetas; 0 en bandas y hero. Sin píldoras. Tarjetas con borde de 1 px y sin sombra; elevación solo en la barra fija (sombra suave con desplazamiento).

## Componentes
- **Barra de anuncio**: azul, 13 px, mensaje de pago al recibir / despacho / garantía (una vez).
- **Encabezado**: logo, navegación directa (Kits · Perros · Gatos · Cómo funciona · Preguntas · Contacto), botón "Ver kits" mandarina. En móvil la navegación pasa a una franja desplazable bajo el logo.
- **Hero**: panel azul con titular blanco a la izquierda + imagen de ambiente a pleno borde a la derecha (móvil: imagen arriba, panel debajo). Botón mandarina + enlace secundario.
- **Accesos Perros / Gatos**: dos fotos con rótulo inferior (nombre, cantidad de kits, flecha).
- **Tarjeta de producto**: imagen cuadrada sobre superficie, "Foto referencial" 12 px abajo a la izquierda, nombre (2 líneas máx.), una línea de beneficio, **precio protagonista**, botón "Ver kit" (borde azul 1,5 px; relleno azul en hover/foco).
- **Botón primario**: mandarina, texto azul profundo 700, 4 px, mínimo 48 px de alto. Secundario: contorno azul. Sobre azul: contorno blanco.
- **Campos**: 48 px, borde 1 px, foco = contorno azul 2 px (sin halo de color).
- **Cantidad**: dos cuadrados 56×48, activo relleno azul.
- **Cómo funciona**: tres pasos tipográficos con numeral grande y filete azul superior; sin tarjetas ni iconos.
- **Preguntas**: lista con filetes y signo +/− dibujado en CSS.
- **Pie**: azul profundo, enlaces claros, una línea de WhatsApp.

## Estados
Hover solo en puntero fino y de 150 ms (color/relleno); presión `scale(.98)`; foco visible 2–3 px azul con desplazamiento; deshabilitado 45 % de opacidad; error con borde y texto rojo; cargando: texto "Abriendo WhatsApp…" ya manejado por `pedido.js`. Movimiento casi nulo: sin revelados, sin entradas escalonadas; acordeón y barra de compra fija con ease-out exponencial; `prefers-reduced-motion` lo anula.

## Prohibido (dueño)
Rótulos sobre títulos, tarjetas iguales de icono + título + texto, píldoras, "2 por $X" llamativo, teléfono, WhatsApp repetido, colores saturados tipo presentación, degradados, brillos.
