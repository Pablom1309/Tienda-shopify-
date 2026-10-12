# Área: Dirección

Agente: `director-estrategia`. Lo actualiza el propio agente en cada ronda.

## Objetivo de la semana (5 al 11 de octubre de 2026), actualizado el 2026-10-05 a las 17:35 UTC
**Al domingo 11 de octubre, las fichas de los 3 kits de partida y las 4 páginas de confianza (despacho, cambios, contacto y privacidad) quedan terminadas en móvil con los textos de legal integrados. Así, las 3 brechas críticas (C1 a C3) se cierran solo con cargar los datos del dueño y su decisión sobre el envío. Se verifica en 390 px y `verificar.py` debe dar 0.**

Etapa: validación, antes del lanzamiento (0 ventas, 0 pauta). Del 5 al 7 de octubre es CyberMonday y no se pauta. Prioridad vigente del dueño: **diseño de la web primero**. Las demás áreas trabajan para alimentar a diseño.

### Revisión de avance, 2026-10-06 21:50 UTC (meta: primer pedido posible el 11-oct)
- **Diseño:** el rediseño (ronda 14, Figtree, azul #24316B, fondo sin crema, según PRODUCT.md/DESIGN.md) y el pulido de la ronda 15 están hechos. Las fichas y páginas de confianza están terminadas en lo que depende del equipo. Lo que falta depende del dueño (textos legales con datos y bloque de despacho A/B).
- **Brechas C1 a C3:** siguen abiertas solo por datos del dueño (razón social, RUT, domicilio, correo) y la decisión de envío. Sin eso no hay primer pedido publicable el 11-oct, aunque el sitio esté listo.
- **Foco de esta ronda (decidido):**
  - **Diseño:** accesibilidad táctil de la ficha. Los enlaces "10 días de retracto" y "Cómo usamos tus datos" pasan a 44 px de zona táctil y las casillas amplían su zona de label. Además se revisa que se cumpla la regla del dueño del 06-oct: sin `tel:` ni "Llámanos" y WhatsApp solo en el formulario, en contacto y en una línea del pie. Una sola mejora por ronda, verificada en 390 px. Nada cosmético.
  - **SEO:** auditar el HTML ya regenerado tras el rediseño en los 3 kits (title ≤ 60, meta ≤ 155 con "Pagas al recibir", canónica, `Product` coherente con el precio visible y sin `shippingRate`) y la portada (un solo h1). Las correcciones van como propuestas al generador para diseño, sin tocar el sitio. La guía de verano sigue con la fecha del 26-oct.

## Prioridades (en orden)
1. **Diseño: tienda profesional donde se convierte.** Fichas de Baño y Secado, Gato Sin Pelusas y Pelo Cero, más las páginas de confianza. Cada mensaje va en un solo lugar y las piezas que no tienen dato muestran "por confirmar con proveedor". Lo cosmético (animaciones, transiciones) va después de esto.
2. **Legal y operaciones entregan a diseño el contenido que falta.** Legal aporta los textos finales de C1, C3 e I1 y operaciones las medidas y materiales "por confirmar", porque una ficha bonita sin datos obligatorios no se puede publicar.
3. **Dejar lista la decisión de envío al cliente** (abajo) para que diseño la muestre apenas el dueño elija y la brecha C3 se cierre.

## Decisiones tomadas
- **El orden de áreas pasa a ser diseño, legal, operaciones, SEO, marca, dirección, competencia y ads.** Por qué: el dueño fijó "diseño primero". Legal y operaciones van detrás porque aportan contenido obligatorio a las fichas, SEO y marca aportan títulos, microcopys e íconos, y competencia y ads ya entregaron lo suyo y no tienen nada urgente hasta que exista la verificación de Dropi.
- **Diseño no rehace la marca ni la paleta.** Mejora sobre Fraunces y Nunito con tinta, mandarina y crema. Por qué: la base ya obtuvo 31 de 40 en la revisión heurística, así que el siguiente salto está en el contenido y en la confianza, no en un rediseño.
- **Diseño deja preparado el lugar del despacho con las dos variantes (A incluido, B aparte), controladas por un dato, y no publica ninguna mientras el dueño no decida.** Por qué: así la decisión del dueño se aplica en minutos y no se inventa un costo.
- **Se mantienen los 3 kits de partida y los precios actuales** hasta tener costos reales de Dropi. Pelo Cero sigue en $26.990.
- **Ads sigue sin presupuesto ni campañas.** Pelo Cero sigue bloqueado hasta confirmar la certificación SEC y la bruma fría.

## Política de envío al cliente: propuesta (la decisión es del dueño)
Datos de `datos/economia.json` y `datos/supuestos.json`. Todos los costos son **estimados**, no están verificados en Dropi. El flete implícito en la economía es de unos **$3.800 por paquete (estimado)** en los 3 kits. Se pudo reconstruir con G = c·e·(P − Cp) − c·F − 150, con c = 0,85 y e base = 0,70.

| Kit | Precio | Flete ÷ precio | G base con envío incluido (A) | G base cobrando $3.800 aparte (B) |
|---|---|---|---|---|
| Baño y Secado | $29.990 | 12,7 % | $9.407 | ≈ $11.668 |
| Gato Sin Pelusas | $27.990 | 13,6 % | $8.217 | ≈ $10.478 |
| Pelo Cero | $26.990 | 14,1 % | $6.908 | ≈ $9.169 |

- **Con B se ganan unos $2.261 por pedido generado (0,595 × 3.800), o cerca de $1.900 si se descuenta el IVA.** El costo es que el total que se paga en la puerta sube a $30.790–$33.790, por encima del umbral de envío gratis de Petco ($29.990). En contra entrega eso arriesga confirmación y entrega. No hay datos propios para medir ese efecto.
- **Sensibilidad:** cada $1.000 de flete real por sobre lo estimado le quita a G unos $850 por pedido generado (c × 1.000). Pelo Cero es el más expuesto.
- **Recomendación de dirección: opción A, "Despacho incluido en el precio, sin cargos al recibir",** con dos condiciones. (1) El flete real en Dropi debe ser ≤ $4.500 (es el umbral que ya usa el catálogo). (2) Las comunas sin cobertura se excluyen en el formulario en vez de cobrarse aparte. Si el flete real supera $4.500 en alguna zona, se usa B solo para esa zona y el monto se declara en la ficha. Razones: la economía actual ya absorbe el flete, el total a pagar queda simple (un número, sin sorpresas en la puerta, que es la causa de C3) y se compite con Petco sin bajar el precio. La oferta de 2 kits reparte el flete, que es fijo por paquete.

- **2026-10-06: Se mantiene la regla "sin teléfono, WhatsApp limitado" por encima de las propuestas antiguas de contacto (tarjeta "Llámanos", botón flotante).** Por qué: es una decisión vigente del dueño y lo de antes queda descartado.

## Conflictos resueltos entre áreas
- **Diseño ya ejecuta propuestas de SEO, marca y legal, y cada área sigue anotando su versión:** las tareas duplicadas se dan por cerradas cuando diseño las marca como HECHO (por ejemplo, el evento Lead en vez de Purchase y el alt de Baño y Secado). Cada área revisa en `diseno.md` antes de volver a proponer.
- **Títulos y metadescripciones SEO de las fichas:** el dueño del dato es `datos/fichas.json`. Marca aplica los textos de `datos/seo/auditoria.md`, el generador los toma y diseño no los escribe a mano en el HTML.
- **Píxel con aviso de cookies (legal) frente a medición (ads):** no se carga el píxel hasta que el dueño decida si lo activa. Diseño prepara el aviso con la opción de rechazar.
- **Grilla de 9 en `LANZAMIENTO.md` 5.6:** ya está corregida (calendario orgánico). Queda cerrado.
- **Costo de Shopify:** `LANZAMIENTO.md` ya anota que se usan US$25 y que US$39 en finanzas es un supuesto conservador. Se mantiene así hasta que el dueño contrate.

## Riesgos
- **Todos los textos legales dependen de los datos del dueño** (razón social, RUT, domicilio, correo). Sin ellos, ni la mejor ficha se puede publicar.
- **Costos y flete sin verificar:** si el flete real es de $5.000, G base de Pelo Cero baja de $6.908 a unos $5.890 (estimado).
- **Pulido sin fin:** diseño corre cada 2 horas y puede caer en lo cosmético. La regla es una mejora coherente por ronda y siempre primero lo que cierra C1 a C3 o la ficha de los 3 kits.
- **Fotos referenciales:** sin muestra física no hay fotos reales ni medidas, y eso limita la confianza y el diseño de la galería.
- **Ley 21.719 desde el 1 de diciembre** y **capital de trabajo** ($300.000 a $400.000 estimados) siguen vigentes como requisitos antes de pautar.

## Próximas tareas
- (sesión competencia 2026-10-05) [direccion] Mantener Baño y Secado primero (menor prima, +5 % sobre piezas sueltas); no tocar precio de Pelo Cero hasta tener costo Dropi.
- (sesión competencia 2026-10-05) [direccion] Decidir y fijar el costo de envío al cliente (hoy no declarado; Petco: gratis desde $29.990, $2.500 en RM bajo ese monto). Opción a evaluar con G real: envío incluido en el precio del kit.
- (sesión competencia 2026-10-05) [direccion] Reconciliar umbral de envío gratis de Petco ($12.600 en Santiago según portada vs $29.990 en datos/competencia.md): no verificado cuál rige.
- (sesión operaciones 2026-10-05) Dirección: Dropi/Dropify y la verificación de los 3 kits de partida (muestra, stock, costo real) son requisito antes de pautar.
- Cuando el dueño decida el envío (A o B), fijarlo en `datos/tienda.json` a través del orquestador y avisar a diseño y legal.
- Cuando el dueño cargue los costos de Dropi, recalcular G de los 3 kits y elegir los 2 del primer test con G real.
- Próxima ronda: revisar si diseño integró los textos de legal (detrás del aviso interno) y si operaciones entregó la tabla de medidas.

## Hecho
- 2026-10-05: primera ronda. Fijé el objetivo de la semana, las 3 prioridades, los kits de partida y el orden de áreas en `estado/areas.json`.
- 2026-10-05 17:35 UTC (sesión del equipo pedida por el dueño): objetivo semanal reorientado a "diseño primero", nuevo orden de áreas y propuesta de política de envío con su efecto en el margen (decisión del dueño). Cerré la propuesta de competencia sobre el envío y la de mantener Baño y Secado primero.

## Propuestas para otras áreas
- [diseno] Preparar el bloque de despacho de la ficha y de `despacho.html` con las variantes A ("Despacho incluido en el precio. Sin cargos adicionales al recibir.") y B (monto por zona sumado al "Total a pagar al recibir"), elegidas por un dato en `datos/tienda.json`. Mientras ese dato sea null no se muestra ninguna y queda el aviso interno. Va en un solo lugar, bajo el precio.
- [diseno] Integrar en las plantillas los textos de `datos/legal/` (C1 en contacto y pie, I1 en cambios, privacidad y el enlace "Cómo usamos tus datos" en la casilla) detrás del aviso interno mientras los datos del dueño sean null. Después, `404.html` con enlaces a los kits.
- [legal] Entregar a diseño la versión final y breve de C3 (A y B) y de I1, lista para pegar, y confirmar que "Pagas al recibir" junto al retracto del formulario cubre lo exigible.
- [operaciones] Dejar en `datos/` una tabla de medidas y materiales por pieza de los 3 kits ("por confirmar con proveedor" donde falte) y agregar a `datos/verificacion_dropi.csv` las columnas de flete por zona y comunas sin cobertura, para que el dueño las complete.
- [seo] Revisar el HTML regenerado de los 3 kits (título, meta, canónica, `Product` coherente con el precio visible y el despacho) apenas diseño integre los cambios. Sumar a "Qué incluye" las palabras de pieza suelta.
- [marca] Aplicar en `datos/fichas.json` los textos SEO de Pelo Cero (bruma, solo perros) y entregar a diseño el set de íconos (trazo de 2 px, tinta con estrella mandarina) y las ilustraciones para los 9 kits sin foto.
- [competencia] Hacer un benchmark de diseño de 3 fichas de tiendas chilenas de mascotas o DTC (cómo muestran despacho, cambios, contacto y confianza), con URL y fecha, para diseño. Lo que no se pueda leer queda como "no verificado".
- [ads] Revisar la coherencia entre ganchos y fichas: que el titular de cada ficha de los 3 kits responda al gancho de sus conceptos (`datos/conceptos_ads.md`). Sin presupuesto ni campañas.

## Pendientes del dueño
- **Decidir la política de envío al cliente.** Dirección recomienda A (incluido) si el flete real en Dropi es ≤ $4.500, y B solo por zona si lo supera. Esto cierra C3.
- Entregar razón social, RUT, domicilio comercial, correo y horario (`datos/tienda.json`).
- Cuenta Dropi Chile validada y `datos/verificacion_dropi.csv` de los 3 kits de partida: costo, flete real por zona, comisión, flete de devolución, días de pago, un solo paquete por kit.
- Certificación SEC y bruma fría del cepillo de Pelo Cero.
- Fase 0 de `LANZAMIENTO.md` (INAPI, kuchiwau.cl, correo, @kuchiwau) e inicio de actividades en el SII. Confirmar el dominio definitivo.
- Muestras físicas y fotos o videos reales de los 3 kits.
- Reservar capital de trabajo antes de aprobar cualquier pauta ($300.000 a $400.000, estimado).
