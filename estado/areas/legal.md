# Área: Legal y cumplimiento

Agente: `legal-cumplimiento`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
- (diseno 2026-10-05) Legal: confirmar que la línea "Pagas al recibir" más el retracto del formulario cubren lo exigible.
- (operaciones 2026-10-05) Legal: revisar plazos de retracto/garantía y el texto de `sitio/cambios.html` contra el flujo de devoluciones; confirmar si los mensajes de confirmación califican como parte de la venta.
- (dirección 2026-10-05) Revisar `cambios.html`, la página de contacto y las fichas de los 3 kits de partida contra la Ley 19.496: garantía legal de 6 meses, retracto de 10 días, precio final, costo y plazo de despacho, datos del proveedor. Entregar una lista de brechas con el texto propuesto. HECHO (ver Hecho).
- (dirección 2026-10-05) Reescribir `privacidad.html` según la Ley 21.719, dejando como campos marcados razón social, RUT, dirección y correo del dueño. HECHO (texto propuesto).
- Pendiente de legal: pasar el texto a un abogado antes del 1-dic-2026; contrastar números de artículo de la Ley 21.719 en bcn.cl (403 al abrir); redactar `terminos.html` si el dueño lo aprueba; revisar de nuevo vacíos para pequeñas empresas en nov-2026.

## Hecho
- 2026-10-05: `datos/legal/privacidad.md`: texto completo de la política de privacidad (responsable, datos, finalidades con base de licitud, destinatarios, conservación, cookies variante A/B, derechos con plazo de 30 días, seguridad). Campos [POR COMPLETAR] para razón social, RUT, domicilio, correo.
- 2026-10-05: `datos/legal/brechas.md`: 3 críticas, 6 importantes, 4 mejoras, con texto de reemplazo para contacto, pie, cambios, despacho y casilla de consentimiento. Revisados los 3 kits de partida (Baño y Secado, Pelo Cero, Gato Sin Pelusas).
- Críticas: C1 faltan datos del proveedor (art. 12 A), C2 privacidad insuficiente, C3 costo de despacho/total no declarado.

## Propuestas para otras áreas
- diseno (cuando existan los datos del dueño): integrar el texto de `datos/legal/privacidad.md` en `privacidad.html`; reemplazar `contacto.html` y el pie con los textos de C1; reemplazar `cambios.html` con el texto de I1; añadir el enlace "Cómo usamos tus datos" en la casilla de consentimiento y el aviso de una línea bajo el botón de WhatsApp (textos auxiliares en privacidad.md). Mientras razón social, RUT, domicilio y correo sean null, mostrar aviso interno y no publicar.
- diseno: cambiar `pedido.js` línea 154 de `Purchase` a `Lead` o `InitiateCheckout`; cargar el píxel solo con aviso y opción de rechazar (coordinar con ads).
- contenido: Pelo Cero, revisar "a vapor" frente a la FAQ "no es vapor caliente" (I4); completar medidas y materiales de los 3 kits (I3).
- operaciones: confirmar con Dropi si el flete va incluido (C3, opción A o B) y el plazo real; añadir a la plantilla de confirmación por WhatsApp los datos del proveedor, retracto y garantía (I2); definir intentos de entrega y reembolso (M1).
- ads: no pautar hasta resolver C1, C2, C3 y I5; el evento de compra no debe dispararse al abrir WhatsApp.

## Pendientes del dueño
- Entregar: razón social o nombre del titular, RUT, domicilio comercial, correo y horario de atención (se cargan en `datos/tienda.json`, portón "cuentas"). No los completo yo.
- Decidir: flete incluido o aparte (C3); plazo de reembolso y quién paga la devolución del retracto (validar con SERNAC o abogado); si activa píxel/CAPI de Meta (privacidad variante B).
- Confirmar nombre y sede de Dropi y de la transportadora para la política de privacidad.
- Preguntar al proveedor por certificación eléctrica/SEC del cepillo recargable (Pelo Cero).
- Revisión por un abogado de privacidad y cambios antes del 1-dic-2026.
- Registrar marca en INAPI (clase 35) y consultar patente municipal (ver `investigacion/lanzamiento-legal.md`).
