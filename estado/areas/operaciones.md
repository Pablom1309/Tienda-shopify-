# Área: Operaciones y experiencia del cliente

Agente: `operaciones-cx`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
- Cuando exista la cuenta Dropi: confirmar con soporte comisión, flete de devolución, cobertura por comuna, cobro de retiro y plazo de reclamo; actualizar `datos/operaciones.md` y `datos/supuestos.json`.
- Probar la integración Dropify con un pedido de prueba; mientras tanto rige el plan B manual.
- Con los primeros pedidos reales, reemplazar los valores "estimado" por tasas medidas.

## Hecho
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
