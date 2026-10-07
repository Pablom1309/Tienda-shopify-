# Área: Meta Ads

Agente: `estratega-ads`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
- (sesión competencia 2026-10-05) [ads] Ángulo "pagas al recibir" y "kit completo en un pedido" (un envío, una entrega); sin cifras de ahorro ni precios de referencia.
- (sesión legal 2026-10-05) ads: no pautar hasta resolver C1, C2, C3 y I5; el evento de compra no debe dispararse al abrir WhatsApp.
- (sesión direccion 2026-10-05) [ads] Revisar la coherencia entre ganchos y fichas: que el titular de cada ficha de los 3 kits responda al gancho de sus conceptos (`datos/conceptos_ads.md`). Sin presupuesto ni campañas.
- (competencia 2026-10-05) [ads] Ángulo "pagas al recibir" y "kit completo en un pedido" (un envío, una entrega); sin cifras de ahorro ni precios de referencia.
- (legal 2026-10-05) ads: no pautar hasta resolver C1, C2, C3 y I5; el evento de compra no debe dispararse al abrir WhatsApp.
- Producir los conceptos de `datos/conceptos_ads.md` como reels orgánicos cuando el dueño tenga la unidad real (validan ganchos gratis).
- Otros kits prioritarios (verano, enriquecimiento, paseo): 4-5 conceptos cada uno, solo con proveedor verificado.

## Hecho
- 2026-10-05: `datos/conceptos_ads.md` con 5 conceptos Gato Sin Pelusas (G1-G5), 5 Pelo Cero (P1-P5) y 2 Baño y Secado (B1-B2); cada uno con 2-3 ganchos, guion corto y tomas reales para el dueño, más lista maestra de tomas. Sin presupuesto ni campañas.
- 2026-10-05: `datos/plan_ads.json` solo parte creativa: añadidos `conceptos_creativos` y `pauta_bloqueada` en los 3 kits. Pelo Cero bloqueado hasta confirmar SEC (I4) y descrito como "niebla de agua", no vapor caliente.

## Revisión 2026-10-05: fichas como aterrizaje
- Hecho: revisadas las fichas de Gato, Pelo Cero y Baño. Conceptos ajustados en `datos/conceptos_ads.md` (G1-B, G3-A, G4-A, B1-A; "niebla" pasa a "bruma" para igualar la página). Detalle en la sección "Revisión de aterrizaje" de ese archivo.
- Pendiente: `datos/plan_ads.json` aún usa "niebla"; alinear en el próximo ciclo del nodo (hoy no era mi archivo). Pelo Cero sigue bloqueado hasta I4/SEC y verificación.

## Propuestas para otras áreas
- [diseno] (2026-10-05, ficha como aterrizaje de anuncio) Primer pantallazo móvil: subir titular, precio y botón sobre el pliegue (foto más baja, 4:5 a 1:1 o 4:3) para que el mensaje del anuncio se lea sin desplazarse.
- [diseno] Reemplazar la foto fija por un video corto en bucle o GIF de la unidad real en uso (el mismo plano del anuncio); mientras no exista, mantener "Imagen referencial" visible.
- [diseno] Mover "Pagas al recibir" a la línea clave junto al plazo de entrega (bajo el precio) y quitar la repetición de "kit completo/un solo pedido": dejar la etiqueta "Kit completo · 3 piezas" y eliminar el H2 y la fila de tabla redundantes del primer tramo.
- [diseno] Cambiar el slug de Pelo Cero (hoy contiene "vapor") a uno con "bruma", con redirección 301, antes de usar la ficha como destino.
- [diseno] Añadir en las fichas de Gato y Pelo Cero una franja corta "Sin repuestos adhesivos" con comparación sobria (sin precios) y una línea de regalo en Gato, para respaldar G4 y G5; sin testimonios ni escasez.
- [diseno] Hacer que el botón de la barra inferior y "Pedir este kit" lleven al formulario con ancla visible y que el evento al enviar sea Lead/InitiateCheckout, no Purchase (I5).
- [legal] Revisar los conceptos de `datos/conceptos_ads.md` (P5 "niebla de agua, no vapor caliente"; "no incluye shampoo") antes de producir.
- [operaciones] Pedir por Dropi una unidad de prueba de cada kit (Gato, Pelo Cero, Baño) y preguntar al proveedor de Pelo Cero por certificación SEC y qué hace la niebla.
- [diseno] Cambiar el evento Purchase a Lead/InitiateCheckout en `pedido.js` (I5); declarar el costo de despacho (C3) en ficha y despacho.
- [contenido] Mientras no se confirme la función, renombrar Pelo Cero a "cepillo con niebla de agua" en la ficha (legal I4).
- [marca] Revisar que cajas y piezas se vean con la marca Kuchiwau en las tomas (G4, P5).

## Pendientes del dueño
- Grabar las tomas reales de la lista maestra de `datos/conceptos_ads.md` cuando llegue la unidad de cada kit.
- Completar datos del proveedor (C1), decidir despacho A o B (C3), SEC de Pelo Cero, verificación Dropi y aprobar cualquier gasto.
