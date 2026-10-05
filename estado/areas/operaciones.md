# Área: Operaciones y experiencia del cliente

Agente: `operaciones-cx`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
- (seo 2026-10-05) [operaciones] Confirmar con el proveedor que la bruma es a temperatura ambiente; tarifa real de despacho para `shippingRate`; medidas y materiales de los 3 kits.
- (ads 2026-10-05) [operaciones] Pedir por Dropi una unidad de prueba de cada kit (Gato, Pelo Cero, Baño) y preguntar al proveedor de Pelo Cero por certificación SEC y qué hace la niebla.
- (competencia 2026-10-05) [operaciones] Confirmar con Dropi que cada kit sale en un solo paquete y el costo real de flete, para poder fijar el envío incluido o gratis sobre cierto monto.
- (diseno 2026-10-05) Operaciones/Dropi: medidas y materiales reales de las piezas de los 3 kits de partida, para reemplazar "por confirmar con proveedor".
- (legal 2026-10-05) operaciones: confirmar con Dropi si el flete va incluido (C3, opción A o B) y el plazo real; añadir a la plantilla de confirmación por WhatsApp los datos del proveedor, retracto y garantía (I2); definir intentos de entrega y reembolso (M1).
- Cuando exista la cuenta Dropi: confirmar con soporte comisión, flete de devolución, cobertura por comuna, cobro de retiro y plazo de reclamo; actualizar `datos/operaciones.md` y `datos/supuestos.json`.
- Probar la integración Dropify con un pedido de prueba; mientras tanto rige el plan B manual.
- Con los primeros pedidos reales, reemplazar los valores "estimado" por tasas medidas.

## Propuestas a diseño (formulario de pedido contra entrega, 2026-10-05)
Base: `herramientas/plantilla/pedido.js` y el formulario en `sitio/productos/*.html` (solo lectura).
- [diseno] Comuna como lista desplegable dependiente de la región (no texto libre): evita comunas mal escritas y permite marcar comunas sin cobertura. La lista de cobertura sale de Dropi (por confirmar; ver `datos/preguntas_dropi.md`).
- [diseno] Separar la dirección en: calle, número, depto/casa (opcional) y "Referencia para el repartidor" (obligatoria, ej: "portón negro, frente a la plaza"). Hoy es un solo campo que acepta "Av. Chile" sin número.
- [diseno] Validar que la dirección tenga al menos un dígito (número de casa) o una casilla "sin número"; mensaje claro si falta.
- [diseno] Teléfono: prefijo +56 9 fijo visible y 8 dígitos; normalizar al enviar (quitar espacios, +56). Rechazar números que no empiecen con 9 en celulares. Es el dato clave para confirmar y para el píxel.
- [diseno] Paso de revisión antes de abrir WhatsApp: tarjeta "Revisa tu pedido" con kit, total a pagar al recibir, dirección, comuna y plazo estimado, y botones "Corregir" / "Confirmar y enviar por WhatsApp".
- [diseno] Texto fijo cerca del botón: "Pagas al recibir. Te escribiremos por WhatsApp para confirmar; no despachamos sin tu confirmación. Ten el monto listo y alguien que reciba." Esto filtra curiosos y reduce rechazos.
- [diseno] Casilla obligatoria, no promocional: "Alguien mayor de edad recibirá el pedido y pagará $X al recibir" (distinta del consentimiento de marketing, que sigue opcional y sin marcar).
- [diseno] Campo opcional "Horario o persona que recibe" (ej: "tarde, recibe mi madre") para reducir cliente ausente.
- [diseno] En el mensaje de WhatsApp, agregar hora de pedido, referencia y número de pedido corto (ej: KW-0412) para detectar duplicados y que /confirmar lo cite. Dejar el mensaje con orden de campos igual a la checklist de confirmación (`datos/operaciones.md`, sección 2).
- [diseno] Regiones extremas y zonas con baja efectividad: mostrar aviso "coordinamos plazo y costo por WhatsApp antes de despachar" (ya existe para zona extrema; extenderlo a las zonas que defina el dueño tras ver datos).
- [diseno] Bloqueo suave de repetidos: si el borrador local indica un pedido ya enviado hace menos de 24 h con el mismo teléfono, mostrar "Ya recibimos tu pedido, te escribimos por WhatsApp" en vez de permitir otro envío.
- [diseno] Avisar al terminar: pantalla o texto "Abre WhatsApp y toca Enviar. Tu pedido no queda registrado hasta que envíes el mensaje" (el pedido solo existe si el cliente envía el mensaje).
- [diseno] No agregar más campos obligatorios que estos; cada campo extra baja la conversión.
- [diseno] Medidas, materiales y plazos de la ficha: mantener "por confirmar con proveedor" hasta tener respuesta (`datos/preguntas_dropi.md`); no cambiar el texto "bruma" por "vapor caliente" hasta confirmar temperatura.

## Hecho
- 2026-10-05: `datos/preguntas_dropi.md` escrito (paquete A soporte Dropi, B proveedor por kit, C específicas por kit incl. bruma a temperatura ambiente, certificación SEC, unidad de prueba; D checklist de cierre). Propuestas de formulario a diseño (arriba) y nota en `datos/operaciones.md` 9b.
- 2026-10-05: `datos/operaciones.md` escrito (flujo diario pedido a liquidación, checklist de confirmación, reintentos, carga Dropi y plan B manual, despacho, novedades el mismo día, cambios/garantía/devoluciones con evidencia, tiempos objetivo, retiro de saldo, KPIs, regla de no despachar sin confirmar).
- 2026-10-05: plantilla `datos/resultados/plantilla_tablero_semanal.csv.ejemplo` (solo encabezados; extensión .ejemplo para que `resultados.py`, que lee `*.csv`, no la tome como datos).

## Propuestas para otras áreas
- Analista-resultados: el tablero semanal tiene columnas distintas de `PLANTILLA.csv` (región, transportadora, novedades, saldo). Decidir si `resultados.py` se amplía para leerlo o si se usa solo `PLANTILLA.csv` por día.
- Legal: revisar plazos de retracto/garantía y el texto de `sitio/cambios.html` contra el flujo de devoluciones; confirmar si los mensajes de confirmación califican como parte de la venta.
- Dirección: Dropi/Dropify y la verificación de los 3 kits de partida (muestra, stock, costo real) son requisito antes de pautar.

## Pendientes del dueño
- Crear y validar cuenta Dropi (identidad y banco) antes del primer despacho.
- Ejecutar el contacto con clientes por WhatsApp, la carga en Dropi y el retiro de saldo (portones humanos).
- Emitir boletas electrónicas (SII) y definir el horario de atención para la meta de respuesta.
