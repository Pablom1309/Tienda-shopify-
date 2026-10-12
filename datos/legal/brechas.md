# Brechas Ley 19.496 / 21.398: cambios, contacto, despacho, fichas de los 3 kits de partida

Autor: legal-cumplimiento. Fecha: 2026-10-05. Revisado: `sitio/cambios.html`, `contacto.html`, `despacho.html`, `privacidad.html`, fichas de Kit Baño y Secado ($29.990), Kit Pelo Cero ($26.990), Kit Gato Sin Pelusas ($27.990), `datos/fichas.json`, `datos/tienda.json`, `sitio/pedido.js`.

Leyenda: [V] fuente; [I] inferencia mía; [POR COMPLETAR] solo el dueño. No soy abogado: lo marcado "validar" va a un profesional.

Fuentes base:
- Información del proveedor y contratos a distancia (art. 12 A y 3 bis, Ley 19.496) [V]: https://www.sernac.cl/portal/609/w3-propertyvalue-58906.html ; texto: https://www.bcn.cl/leychile/navegar?idNorma=61438
- Retracto 10 días desde la recepción; el proveedor debe informarlo de forma inequívoca, accesible y previa a contratar y pagar [V, resumen de búsqueda]: https://www.sernac.cl/604/w3-propertyvalue-20982.html . Reglamento de exclusiones del retracto vigente desde 28-feb-2025 [V, secundaria: https://www.carey.cl/api/archivo/publican-reglamento-que-establece-exclusiones-al-derecho-de-retracto?lang=es].
- Garantía legal de 6 meses (Ley 21.398) [V, secundaria]: https://www.bcn.cl/leychile/navegar?idNorma=1170464
- Quién paga el flete de la devolución por retracto: NO pude confirmarlo en fuente. [I] No cobrarlo al cliente hasta validar con SERNAC o abogado.

---

## CRÍTICO (bloquea publicar anuncios o recibir pedidos)

### C1. Falta la identidad del proveedor (art. 12 A)
Dónde: `contacto.html` solo tiene WhatsApp; pie de página dice "© Kuchiwau"; `datos/tienda.json` tiene `razon_social`, `rut`, `direccion_comercial` y `correo` en null.
Exigencia [V]: nombre o razón social, RUT, domicilio completo, teléfono y correo, de forma inequívoca y de fácil acceso.
Texto de reemplazo para `contacto.html` (h1 "Contacto"):

> **Datos del proveedor**
> - Nombre o razón social: [POR COMPLETAR: razón social o nombre del titular]
> - RUT: [POR COMPLETAR: RUT]
> - Domicilio: [POR COMPLETAR: dirección comercial, comuna, región]
> - Correo: [POR COMPLETAR: correo]
> - WhatsApp: +56 9 7981 4797
> - Horario de atención: [POR COMPLETAR: días y horas]
>
> **Reclamos.** Escríbenos a [POR COMPLETAR: correo] o por WhatsApp con tu número de pedido. Respondemos en un máximo de 2 días hábiles. Si no quedas conforme, puedes recurrir al SERNAC (https://www.sernac.cl) o al Juzgado de Policía Local de tu comuna. [I: canales habituales; validar]

Texto de reemplazo para el pie (`legal-pie`):
> © Kuchiwau · [POR COMPLETAR: razón social], RUT [POR COMPLETAR: RUT] · [POR COMPLETAR: comuna, Chile] · Precios en pesos chilenos, IVA incluido.

Mientras estos campos sean null, `diseno` debe mostrar el aviso interno ya previsto en `tienda.json` y NO publicar la tienda (portón humano "cuentas"). Nunca completar con datos supuestos.

### C2. `privacidad.html` insuficiente
Dónde: 2 párrafos; cita la Ley 19.628 y la 21.719 sin identificar al responsable, bases, destinatarios (WhatsApp/Meta, Dropi, transportadora), plazo, canal ni derechos completos; no menciona el almacenamiento local del formulario ni Google Fonts.
Reemplazo: texto completo en `datos/legal/privacidad.md` (sección "TEXTO PARA PUBLICAR"). Además, el pedido envía nombre, teléfono y dirección a WhatsApp (Meta) y a Dropi; eso debe estar declarado, y ahora lo está.

### C3. Costo total y costo de despacho no declarados (art. 12 A / 3 bis)
Dónde: fichas y `despacho.html` informan plazos pero NO dicen si el despacho tiene costo. El formulario muestra "Total a pagar al recibir" = precio del kit.
Exigencia [V]: informar el costo total de la compra y el tiempo estimado de entrega. [I] Si la transportadora cobra flete al recibir, el cliente se llevaría una sorpresa y el aviso sería engañoso.
Acción dueño/operaciones: confirmar en Dropi si el flete va incluido en el precio. Texto según el caso:
- Opción A (flete incluido): en `despacho.html` y cada ficha, bajo el precio: "Despacho incluido en el precio. Sin cargos adicionales al recibir."
- Opción B (flete aparte): mostrar el monto por zona en la ficha y sumarlo al "Total a pagar al recibir": "Despacho: [POR COMPLETAR: $ por zona]. Total a pagar al recibir: precio + despacho."
No publicar hasta decidir A o B. No inventar el valor.

---

## IMPORTANTE (corregir antes de pautar)

### I1. `cambios.html`: retracto con condiciones que la ley puede no permitir
Texto actual: "con el producto sin uso y en su empaque (Ley 19.496)". [I] Exigir "sin uso" puede ser más restrictivo que la ley (el consumidor puede probar el producto lo razonable para decidir); validar con SERNAC o abogado. Además faltan: forma de ejercerlo, plazo y forma de devolución del dinero, quién paga el flete, y el artículo.
Texto de reemplazo completo para `cambios.html`:

> # Cambios, retracto y garantía
>
> ## Derecho a retracto (10 días)
> Puedes arrepentirte de tu compra, sin dar explicaciones, dentro de 10 días corridos desde que recibes el producto (Ley 19.496, art. 3 bis letra b). [I: confirmar "corridos"; el texto legal habla de "10 días" y SERNAC los cuenta desde la recepción]
> Para ejercerlo escríbenos por WhatsApp o a [POR COMPLETAR: correo] con tu número de pedido. Te indicaremos cómo devolver el producto. Devuélvelo en buen estado, con sus accesorios y su empaque original en lo posible.
> Si ya pagaste, te devolvemos el dinero por el mismo medio o por transferencia, a más tardar [POR COMPLETAR: plazo de reembolso; la ley fija un máximo, validar con SERNAC o abogado]. Costo del envío de devolución: [POR COMPLETAR: quién lo asume; validar].
> Este derecho no aplica a los productos que la ley excluye expresamente; ninguno de los productos de esta tienda está excluido hoy. [I: validar contra el reglamento de exclusiones vigente desde 28-feb-2025, sobre todo en productos de contacto con el cuerpo o higiene]
>
> ## Garantía legal (6 meses)
> Si el producto llega con una falla o defecto, o no corresponde a lo que ofrecimos, tienes 6 meses desde que lo recibiste para pedir, a tu elección, la reparación gratuita, el cambio por otro igual o la devolución del dinero (Ley 19.496, arts. 19 a 21, modificada por la Ley 21.398). [I: arts. a validar en bcn.cl]
> La garantía no cubre daños por mal uso, golpes o desgaste normal. [I]
> Los gastos de envío del cambio o reparación por falla los asumimos nosotros. [I: validar; confirmar con SERNAC]
>
> ## Cómo solicitarlo
> Escríbenos por WhatsApp (+56 9 7981 4797) o a [POR COMPLETAR: correo] con tu número de pedido, tu nombre y una foto del producto. Te respondemos en un máximo de 2 días hábiles y te confirmamos por escrito la solución.

### I2. Falta la confirmación escrita del contrato (art. 12 A) y el flujo es por WhatsApp
Dónde: no existe plantilla que incluya los datos del proveedor, producto, total, plazo, retracto y garantía. Sin confirmación escrita, el retracto se extiende a 90 días [V, SERNAC].
Tarea a `operaciones`: revisar `datos/plantillas_whatsapp.md` para que el mensaje de confirmación incluya:
> "Confirmamos tu pedido [N°]: [producto] x [cant.]. Total a pagar al recibir: [monto]. Entrega estimada: [plazo]. Tienes 10 días para retractarte desde que lo recibes y 6 meses de garantía legal: https://…/cambios.html. Proveedor: [razón social], RUT [RUT], [correo]."

### I3. Fichas con especificaciones esenciales pendientes
Dónde: las 3 fichas dicen "Las medidas exactas las publicamos apenas recibamos la ficha del proveedor" (`especificaciones_pendientes` en `fichas.json`). [I] La LPC exige información veraz y oportuna sobre las características esenciales del producto (art. 3 letra b) [V, general]; comprar sin saber tamaño, materiales o batería es una brecha, y genera devoluciones.
Acción: no pautar el kit hasta completar medidas y materiales con ficha real de Dropi o una unidad de prueba. Si se publica antes, usar el texto ya existente con un compromiso medible: "Escríbenos por WhatsApp y te confirmamos la medida antes de despachar; si no te sirve, puedes retractarte."

### I4. Kit Pelo Cero: "cepillo a vapor" vs. "no es vapor caliente"
Dónde: título y FAQ ("Es una niebla de agua a temperatura ambiente, no vapor caliente"). [I] Riesgo de publicidad engañosa (art. 28 y 33 Ley 19.496) si el producto real no coincide con el nombre o la FAQ. Propuesta para `contenido`: cambiar el nombre comercial a "cepillo con niebla de agua" hasta ver la unidad real, y verificar en la ficha del proveedor qué hace la función. También "Recargable por USB" implica batería de litio: [I] preguntar al proveedor por certificación eléctrica/SEC antes de vender [no verificado en fuente; consultar https://www.sec.cl].

### I5. Evento de compra del píxel se dispara al enviar el WhatsApp
Dónde: `pedido.js` línea 154 `fbq('track','Purchase')`. [I] En contra entrega, eso registra "compra" antes de la confirmación y de la entrega; distorsiona datos y, si hay píxel activo, envía información a Meta sin aviso. Propuesta a `diseno` y `ads`: cambiar a evento "Lead" o "InitiateCheckout" hasta confirmar la entrega, y cargar el píxel solo con aviso y opción de rechazo (privacidad variante B). El texto de plan_ads ya exige "evento de compra que se dispara una sola vez": coordinar con `ads`.

### I6. Casilla de consentimiento sin enlace a privacidad
Dónde: ficha, "Quiero recibir por WhatsApp recordatorios y novedades…". Está bien separada y sin marcar [V en el código]. Falta enlazar la política (ver texto en `datos/legal/privacidad.md`, "Textos auxiliares", punto 1).

---

## MEJORA

### M1. `despacho.html`: aclarar qué pasa si el cliente no recibe
Texto: "Si no estás en el domicilio, la transportadora intentará la entrega [POR COMPLETAR: n° de intentos según Dropi] y nos avisará. Si no hay entrega, no se cobra nada y el pedido se cancela. Sin pago previo, no hay nada que devolver." [I: validar con la política de Dropi/transportadora]. Y reemplazar "El plazo corre desde la confirmación del pedido" por "El plazo corre desde que confirmamos tu pedido por WhatsApp (normalmente el mismo día hábil)" [POR COMPLETAR: confirmar tiempo real].

### M2. Plazos de las fichas deben coincidir con Dropi
`tienda.json` dice RM 2 a 4 días y regiones 3 a 7 "hasta confirmarlos con Dropi". No usar "garantizado" ni fechas cerradas hasta confirmar. La fecha calculada en `pedido.js` ("Llegada estimada: entre el X y el Y") es aceptable si dice "estimada".

### M3. Términos y condiciones breves (opcional, `diseno` crea `terminos.html`)
Contenido mínimo propuesto: quién vende (datos del proveedor), cómo se forma el contrato (al confirmar por WhatsApp), precios con IVA en CLP, pago contra entrega, plazos, retracto y garantía (enlace a cambios), privacidad (enlace), canal de reclamos y SERNAC, ley aplicable chilena. Lo redacto si el dueño lo aprueba.

### M4. Marca y ficha de datos de seguridad
Antes de pautar con "Kuchiwau": búsqueda en INAPI clase 35 (ver `investigacion/lanzamiento-legal.md`, punto 6). Pendiente del dueño.

---

## Verificado OK (sin brecha)
- Precios con IVA incluido y en pesos chilenos [V en sitio].
- Garantía legal 6 meses indicada en la barra superior y coherente con la Ley 21.398 [V, secundaria].
- Retracto de 10 días visible desde cada formulario, antes de pedir [V en sitio].
- "Lleva 2 y ahorra $X": es aritmética real (2 x precio - precio del pack), no un precio de referencia inventado. Baño y Secado: 59.980 - 52.990 = 6.990; Pelo Cero y Gato Sin Pelusas: ahorro $5.990 [V en sitio; revisar que se mantenga si cambia el precio].
- Sin reseñas inventadas ni escasez ("Reseñas reales, pronto") [V en sitio].
- Sin afirmaciones de salud en los 3 kits (revisar la frase "Ayuda a repartir el shampoo", es funcional, no de salud).
- Consentimiento de marketing separado y sin marcar por defecto [V en código].
