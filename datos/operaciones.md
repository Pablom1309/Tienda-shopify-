# Operaciones y CX — Kuchiwau (contra entrega, Chile, Dropi + Shopify)

Versión 2026-10-05. Kits de partida: Baño y Secado, Gato Sin Pelusas, Pelo Cero. Textos de WhatsApp: `datos/plantillas_whatsapp.md` (atajos /confirmar, /despachado, /hoy, /reprogramar, /envio, /recibido). WhatsApp de la tienda: +56 9 7981 4797.
Quien ejecuta los pasos que contactan clientes, mueven dinero o usan la cuenta Dropi es el dueño (portón humano). Este documento es el procedimiento; el agente no envía mensajes.
Toda tasa o plazo marcado "estimado" sale de `datos/supuestos.json` o de operadores y se reemplaza con datos reales del tablero.

## 0. Reglas duras
1. **No se despacha ni se carga como confirmado ningún pedido sin confirmación explícita del cliente** (respuesta SÍ por WhatsApp o confirmación por llamada anotada). Silencio no es confirmación.
2. No se pauta ni se vende un kit sin fila verificada en `datos/verificacion_dropi.csv` (proveedor verificado/Premium, un solo proveedor para todas las piezas, stock para al menos 30 pedidos, muestra con 4/5 o más, costo y flete reales).
3. Un pedido duplicado, con datos incoherentes (comuna que no calza con la dirección, teléfono inválido, nombre falso) o de comuna sin cobertura no se despacha: se contacta o se cancela.
4. Mensajes de confirmación y entrega son parte de la venta; mensajes promocionales solo con consentimiento marcado en el formulario (Ley 21.719).
5. Sin urgencia falsa, sin afirmaciones de salud, sin pedir ni ofrecer algo a cambio de reseñas.
6. Zonas con baja efectividad reportada (p. ej. Iquique, Punta Arenas): no pautar al partir; si piden pedido, confirmar plazo y riesgo antes de aceptar.

## 1. Flujo diario paso a paso (pedido a liquidación)
Horas de referencia; el dueño las ajusta. Meta de respuesta en horario: ver sección 7.

| Paso | Cuándo | Qué se hace | Registro |
|---|---|---|---|
| 1. Entra el pedido | Continuo | Pedido llega por el formulario COD / Shopify. Etiqueta "Nuevo pedido" en WhatsApp Business o fila en planilla. | Fila en hoja diaria con hora de entrada |
| 2. Revisión rápida | Al entrar | Duplicado, teléfono, comuna con cobertura, producto verificado, total correcto (IVA incluido). | Marca OK / dudoso |
| 3. Primer contacto | Meta: dentro de 30 min en horario (estimado) | Enviar /confirmar. Etiqueta "Por confirmar". | Hora del primer mensaje |
| 4. Reintentos | Hasta 3 intentos en 24 h | Intento 1: WhatsApp. Intento 2: llamada, a las 2 a 3 h. Intento 3: WhatsApp de cierre, al día hábil siguiente en la mañana. Sin respuesta tras el 3.º: cancelar y etiquetar "Falso/sin respuesta". | Hora y canal de cada intento |
| 5. Confirmación | Al recibir SÍ | Pasar la checklist de la sección 2. Etiqueta "Confirmado". | Hora de confirmación |
| 6. Carga en Dropi | Mismo día, antes del corte de la transportadora (confirmar hora en la cuenta) | Sección 3. | N.º de orden Dropi |
| 7. Despacho | Según proveedor (Dropi promete 24 a 72 h, por verificar) | Cuando haya guía: enviar /despachado con transportadora y código. Etiqueta "Despachado". Guardar captura de la guía. | N.º de guía |
| 8. Seguimiento | Cada mañana | Revisar estado de todos los despachados; abrir novedades (sección 5). El día de entrega enviar /hoy. | Estado diario |
| 9. Entrega | Día de entrega | Etiqueta "Entregado". A los 2 a 3 días, /recibido (sin promociones). | Fecha de entrega |
| 10. Liquidación | Tras entrega | Revisar que el abono llegue a la billetera Dropi; conciliar (sección 8). | Monto abonado |
| 11. Cierre de día | 1 vez al día | Verificar que todo pedido del día anterior en Shopify exista en Dropi (o en planilla del plan B). Actualizar la hoja diaria. | Hoja diaria |

## 2. Checklist de confirmación (todo marcado antes de cargar)
- [ ] Cliente respondió SÍ (o confirmó por llamada; anotar fecha y hora).
- [ ] Nombre de quien recibe.
- [ ] Dirección con calle, número, depto/casa, referencia y comuna; la comuna tiene cobertura.
- [ ] Teléfono de contacto que funciona (WhatsApp o llamada probada).
- [ ] Kit y cantidad correctos; total a pagar al recibir dicho en CLP, IVA incluido.
- [ ] Plazo informado: RM 2 a 4 días hábiles, regiones 3 a 7 desde el despacho (`datos/tienda.json`, por confirmar con Dropi).
- [ ] Alguien recibirá y tendrá el dinero listo (efectivo/medio que acepte el repartidor; confirmar en Dropi).
- [ ] Pedido no duplicado.
- [ ] Oferta de segunda unidad hecha una sola vez, sin presionar (opcional).
Si falta un ítem: no pasa a "Confirmado".

## 3. Carga en Dropi y plan B manual
**Camino A (integración Dropify)**: solo si la integración está probada con un pedido de prueba real. Aun así, el pedido queda pendiente de confirmación en Dropi: se confirma en Dropi únicamente tras el SÍ del cliente. Rutina de cierre (paso 11) detecta pedidos que no pasaron.
**Camino B (manual), por defecto hasta verificar que la integración funciona en Chile**:
1. Con la sesión del dueño en `app.dropi.cl`, crear la orden manual: producto/kit del proveedor verificado, cantidad, datos del cliente de la checklist, tipo de pago contra entrega con el total a recaudar, transportadora (la que Dropi ofrezca para la comuna; preferir Chilexpress/Starken en zona urbana).
2. Comprobar que la ganancia estimada de la orden sea mayor que cero (si Dropi marca error de "monto a ganar", revisar precio/flete antes de insistir).
3. Anotar en la hoja diaria: n.º de pedido Shopify, n.º de orden Dropi, kit, comuna, total, hora de carga.
4. Etiquetar el pedido en Shopify (o en planilla) como "Enviado a Dropi" para no duplicar.
5. Pedido que falla en cargar: no reintentar sin revisar si ya existe en Dropi; avisar al dueño con captura del error.
Pendiente del dueño: validar identidad y cuenta bancaria en Dropi antes del primer despacho.

## 4. Despacho
- Solo órdenes con guía generada y captura guardada.
- Aviso /despachado el mismo día que sale la guía.
- Reglas de caso: cliente pide cambiar dirección tras despachar: avisar a Dropi/transportadora de inmediato y registrar; cliente cancela tras despacho: tratarlo como rechazo posible (sección 6).

## 5. Novedades: el mismo día
1. Cada mañana revisar el panel de novedades en Dropi y el seguimiento de la transportadora.
2. Novedad detectada: contactar al cliente el mismo día (WhatsApp /reprogramar; si no responde, llamada). Corregir dato (dirección, teléfono, referencia) y registrar la solución en la novedad en Dropi.
3. Motivos habituales: dirección errada, cliente ausente, rechazo, cobertura. Para cada uno anotar el motivo en la hoja.
4. Máximo 3 intentos de entrega o contacto; tras el tercero fallido se acepta la devolución.
5. Etiqueta "Novedad" hasta resolverse; meta: 100 % de novedades contactadas el mismo día en que aparecen (objetivo propio).
6. Revisar semanalmente qué comuna/transportadora acumula novedades y pasar el dato al dueño para excluirla de la pauta.

## 6. Cambios, garantía y devoluciones (con evidencia)
Marco legal (Ley 19.496, por confirmar con asesor): retracto de 10 días desde la recepción en compra a distancia; garantía legal de 6 meses con elección entre cambio, reparación o devolución del dinero. Texto público: `sitio/cambios.html`. Responde el vendedor (Kuchiwau), no Dropi.
**Cambio o garantía (cliente escribe)**
1. Pedir por WhatsApp foto del producto y del empaque, n.º de pedido y qué ocurrió (descripción del defecto o error; no hablar de efectos en salud).
2. Registrar el caso con fecha, fotos y decisión. Responder el mismo día hábil.
3. Si procede: gestionar con el proveedor vía soporte Dropi (n.º de orden, fotos). El costo del flete de cambio/devolución es por verificar en Dropi; no prometerlo al cliente hasta saberlo.
4. Retracto: aceptar dentro de 10 días; el producto debe volver sin uso; coordinar solo con aprobación del dueño.
**Devolución logística (rechazo, no entrega)**
1. Guardar por pedido: captura de la confirmación del cliente, guía, trazabilidad de la transportadora y registro de intentos y novedades.
2. Si la transportadora devolvió sin registrar novedad, ignoró la solución dada o declaró un intento que el cliente niega: abrir reclamo en soporte Dropi con n.º de guía, causal y capturas (plazo reportado ~30 días, por verificar).
3. Anotar motivo de cada devolución; recibido en bodega: verificar que Dropi refleje el ajuste en el saldo.
4. Devoluciones sobre 20 % en un kit: revisar proveedor, promesa del anuncio y región (referencia de operadores, no oficial).

## 7. Tiempos objetivo (propios; ajustar con datos reales)
| Hito | Objetivo |
|---|---|
| Primera respuesta a un mensaje del cliente | 15 min en horario de atención (estimado); fuera de horario, mensaje de ausencia y respuesta a primera hora |
| Primer contacto de confirmación | 30 min en horario |
| Confirmar o cancelar un pedido | 24 h desde la entrada, máx. 3 intentos |
| Cargar pedido confirmado en Dropi | Mismo día |
| Aviso de despacho | Mismo día que sale la guía |
| Novedad contactada | Mismo día |
| Respuesta a reclamo o garantía | Mismo día hábil; solución propuesta en 48 h |
| Retiro de saldo | Rutina semanal (sección 8) |
Plazos de entrega al cliente: RM 2 a 4 y regiones 3 a 7 días hábiles (`datos/tienda.json`; por confirmar con Dropi).

## 8. Liquidación y retiro de saldo
1. Cada lunes: lista de entregados de la semana anterior vs abonos en la billetera Dropi (entrega, abono esperado en ~24 h según el sitio de Dropi; el desfase real se estima en 14 días entre pedido y cobro, `datos/supuestos.json`, por verificar).
2. Diferencias (abono faltante, descuento por devolución, cobro inesperado): captura y reclamo a soporte con n.º de guía.
3. Retirar el saldo disponible con frecuencia semanal; no acumular. El dueño ejecuta el retiro (comisión o mínimo de retiro: por verificar en la cuenta).
4. Registrar en el tablero: saldo liquidado y saldo retirado.
5. Boleta electrónica al cliente por el total cobrado (SII, la emite el dueño). Facturas de Dropi (comisión/servicios) y del proveedor: archivar para el contador (`investigacion/dropi-facturacion.md`).
6. Preguntas pendientes a soporte Dropi: comisión por pedido, flete de devolución, periodicidad de factura, costo de retiro.

## 9. Tablero y KPIs
Plantilla: `datos/resultados/plantilla_tablero_semanal.csv.ejemplo` (la extensión .ejemplo evita que `herramientas/resultados.py` la lea como datos reales; para uso real, copiar a `datos/resultados/AAAA-MM-DD.csv` con el formato de `PLANTILLA.csv` — ver nota abajo). Una fila por semana, kit y región; sin datos inventados.
| KPI | Fórmula | Referencia (no promesa) |
|---|---|---|
| Tasa de confirmación | confirmados ÷ generados | supuesto del modelo 85 % (estimado); operadores 80 a 95 % |
| Entrega efectiva | entregados ÷ despachados | escenarios del modelo 60 / 70 / 80 % (estimados); operadores 70 a 85 % con confirmación |
| Devolución | devueltos ÷ despachados | apuntar a 10 a 15 %; revisar sobre 20 % (operadores) |
| Novedad | en_novedad ÷ despachados | operadores 10 a 30 % |
| Cancelados o falsos | cancelados_o_falsos ÷ generados | medir desde la semana 1 |
| Tiempo de respuesta | mediana de horas a la primera respuesta | objetivo propio, sección 7 |
| Cobro | ingreso_cobrado, saldo liquidado, saldo retirado | conciliar semanal |
Lectura: cortar por kit, región y transportadora; región con entrega muy baja se excluye de la pauta. Con datos reales, recalcular G de la economía (`datos/supuestos.json`).
Nota técnica: el tablero semanal tiene columnas distintas de `PLANTILLA.csv` (que analiza `resultados.py`). Si el analista debe leer este tablero, propongo ajuste de columnas (ver estado/areas/operaciones.md).

## 10. Rutina por día (resumen para el dueño)
- Mañana: novedades y seguimiento; responder mensajes pendientes; cargar confirmados.
- Durante el día: /confirmar a pedidos nuevos, reintentos, avisos de despacho.
- Cierre: cuadrar Shopify vs Dropi; hoja diaria.
- Lunes: conciliar liquidación, retirar saldo, llenar tablero.
