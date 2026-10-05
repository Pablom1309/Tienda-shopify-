# Área: Legal y cumplimiento

Agente: `legal-cumplimiento`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
- (ads 2026-10-05) [legal] Revisar los conceptos de `datos/conceptos_ads.md` (P5 "niebla de agua, no vapor caliente"; "no incluye shampoo") antes de producir.
- (competencia 2026-10-05) [legal] Completar razón social, RUT, dirección y correo (hoy null) y redactar garantía de 6 meses y retracto visibles; los competidores publican política de envío y de cambios completas (TusMascotas 30 días voluntarios).
- (diseno 2026-10-05) Legal: confirmar que la línea "Pagas al recibir" más el retracto del formulario cubren lo exigible.
- (operaciones 2026-10-05) Legal: revisar plazos de retracto/garantía y el texto de `sitio/cambios.html` contra el flujo de devoluciones; confirmar si los mensajes de confirmación califican como parte de la venta.
- (dirección 2026-10-05) Revisar `cambios.html`, la página de contacto y las fichas de los 3 kits de partida contra la Ley 19.496: garantía legal de 6 meses, retracto de 10 días, precio final, costo y plazo de despacho, datos del proveedor. Entregar una lista de brechas con el texto propuesto. HECHO (ver Hecho).
- (dirección 2026-10-05) Reescribir `privacidad.html` según la Ley 21.719, dejando como campos marcados razón social, RUT, dirección y correo del dueño. HECHO (texto propuesto).
- Pendiente de legal: pasar el texto a un abogado antes del 1-dic-2026; contrastar números de artículo de la Ley 21.719 en bcn.cl (403 al abrir); redactar `terminos.html` si el dueño lo aprueba; revisar de nuevo vacíos para pequeñas empresas en nov-2026.

## Hecho
- 2026-10-05: `datos/legal/privacidad.md`: texto completo de la política de privacidad (responsable, datos, finalidades con base de licitud, destinatarios, conservación, cookies variante A/B, derechos con plazo de 30 días, seguridad). Campos [POR COMPLETAR] para razón social, RUT, domicilio, correo.
- 2026-10-05: `datos/legal/brechas.md`: 3 críticas, 6 importantes, 4 mejoras, con texto de reemplazo para contacto, pie, cambios, despacho y casilla de consentimiento. Revisados los 3 kits de partida (Baño y Secado, Pelo Cero, Gato Sin Pelusas).
- Críticas: C1 faltan datos del proveedor (art. 12 A), C2 privacidad insuficiente, C3 costo de despacho/total no declarado.

## Revisión rediseño 2026-10-05 (sesión de equipo, diseño primero)
Alcance: portada, cambios, despacho, contacto, ficha Pelo Cero y Gato, `conceptos_ads.md`. [V] = visto en el sitio; [I] = inferencia mía, validar con abogado/SERNAC.

### 1. ¿"Pagas al recibir" + retracto del formulario cubren lo exigible? NO del todo
- Cubierto [V]: precio con IVA y en CLP; "Total a pagar al recibir" en el formulario; enlace "10 días de retracto" y "Cómo usamos tus datos" junto al botón; garantía legal 6 meses en la barra; plazos por zona en despacho; sin reseñas ni escasez inventadas.
- Faltante, CRÍTICO: (a) identidad del proveedor: contacto y pie solo muestran "Kuchiwau" y un teléfono (art. 12 A, Ley 19.496) [I]; (b) costo de despacho: la barra dice "Despacho a todo Chile" sin decir si es gratis o con costo, y el total no lo suma (C3). Una promesa ambigua de despacho puede inducir a error [I].
- Faltante, IMPORTANTE: el retracto de `cambios.html` dice "producto sin uso" (puede ser más restrictivo que la ley, I1); no dice cómo se devuelve el dinero ni plazo; no existe confirmación escrita del contrato (sin ella el retracto se extiende, ver I2).
- NUEVO, IMPORTANTE: las fichas publican el texto "Por confirmar con proveedor" dentro de la FAQ (Pelo Cero: "¿Sale vapor caliente? No. Es una bruma... Por confirmar con proveedor.") y la portada afirma "la descripción, lo que incluye y el precio son exactos" mientras las medidas están pendientes. [I] Contradicción: o se confirma o no se afirma exactitud.
- NUEVO, IMPORTANTE (Pelo Cero): la URL `kit-pelo-cero-cepillo-vapor-mascotas.html` y el JSON-LD usan "vapor"; la FAQ lo niega. Hasta ver la unidad, el nombre visible y el slug deben decir lo mismo que la unidad hace (publicidad engañosa, art. 28 y 33 Ley 19.496) [I]. Cambiar slug solo con redirección (decide diseño).
- Privacidad (Ley 21.719, vigente 1-dic-2026 [V, ver Hecho]): el enlace "Cómo usamos tus datos" existe, pero `privacidad.html` sigue con el texto corto; reemplazo ya redactado en `datos/legal/privacidad.md` (falta razón social/RUT/correo del dueño). Google Fonts carga desde terceros: declarar en privacidad o autoalojar las fuentes (propuesta a diseño).

### 2. `conceptos_ads.md` frente a publicidad engañosa y Meta
- P5 "Niebla de agua, no vapor caliente": aceptable como texto SOLO si la unidad real lo confirma (el propio concepto lo condiciona). Riesgo: afirmar una característica técnica no verificada = publicidad engañosa (art. 28 y 33 Ley 19.496) y "afirmaciones engañosas" en las normas de Meta [I; fuente a contrastar: transparency.fb.com/policies/ad-standards]. Sugerencia: no usar la negación como gancho ("no vapor caliente" plantea el vapor); preferir "Cepillo con niebla fina de agua" y mostrar el plano real. La toma "mano bajo la niebla para mostrar que no quema" implica una afirmación de seguridad: grabarla solo si es cierto y sin decir "seguro para tu mascota".
- Pelo Cero P1-P5: "perro real siendo cepillado" y "mascotas nerviosas" evitan salud; OK. No decir que el perro "se acostumbra" ni "disfruta" (comportamiento): quitar de la FAQ de la ficha la frase "En mascotas nerviosas, empieza sin bruma para que se acostumbren" [I: atribuye estado emocional a la mascota; reemplazo en sección 3].
- "No incluye shampoo" (B1, B2): correcto y recomendable, es una exclusión veraz. Debe estar también en la ficha del kit, junto a "Qué incluye" (propuesta abajo), para que anuncio y página prometan lo mismo.
- Meta, atributos personales: los ganchos "Ropa oscura + gato" y "Departamento chico" no afirman rasgos del usuario [I]; revisar que ningún texto diga "tú que tienes...". "Pagas al recibir" una vez por anuncio: OK mientras C3 no se resuelva no decir "despacho gratis".
- Estado: pauta sigue BLOQUEADA hasta C1, C2, C3, I5 y verificación SEC/niebla (Pelo Cero).

## Propuestas para otras áreas
Publicables YA (no requieren datos del dueño):
- [diseno] `index.html`, párrafo bajo "Elige el que necesita tu casa" (hoy "Las fotos son referenciales hasta que tengamos las reales de cada kit."): mantener y reemplazar en el JSON-LD FAQ "¿Las fotos son del producto real?" la respuesta por: "Algunas imágenes son referenciales y lo indicamos en cada una. Las medidas y materiales de cada kit los confirmamos antes de despachar; escríbenos por WhatsApp si quieres saberlos antes de pedir." (quita la afirmación "son exactos").
- [diseno] Fichas (las 3 de partida y las con "Foto real muy pronto"): eliminar del texto visible y del JSON-LD la frase "Por confirmar con proveedor" y "la confirmamos con el proveedor antes del lanzamiento". Reemplazo para cada dato pendiente: "Te confirmamos este dato por WhatsApp antes de despachar."
- [diseno] Ficha Pelo Cero, FAQ "¿Sale vapor caliente?": renombrar pregunta "¿Cómo funciona la función de agua?" y respuesta: "El cepillo trae una función de niebla de agua. Te confirmamos por WhatsApp los detalles de uso antes de despachar." (no negar ni afirmar temperatura hasta ver la unidad). Quitar "En mascotas nerviosas, empieza sin bruma para que se acostumbren"; usar: "Si es la primera vez, prueba primero sin agua."
- [diseno] Ficha Pelo Cero, nombre visible: "Kit Pelo Cero: cepillo con niebla de agua + removedor" en `<h1>`, título, tarjeta y JSON-LD (el slug se cambia solo con redirección; si no, dejarlo).
- [diseno] Ficha Baño y Secado, bajo "Qué incluye": "No incluye shampoo. Usas el que ya tienes."
- [diseno] Barra superior (`anuncio`), reemplazar "Despacho a todo Chile" por "Despachos a todo Chile, plazos por zona" (no promete costo) y mantener "Garantía legal 6 meses".
- [diseno] `despacho.html`, tras el segundo párrafo, añadir: "Si no estás en el domicilio, la transportadora coordina contigo un nuevo intento. Si finalmente no hay entrega, no se cobra nada: pagas solo al recibir." (el nº de intentos queda pendiente de Dropi; no se escribe). Cambiar "El plazo corre desde la confirmación del pedido" por "El plazo corre desde que confirmamos tu pedido por WhatsApp."
- [diseno] `cambios.html`, reemplazar el primer párrafo de retracto por: "Puedes arrepentirte de tu compra dentro de 10 días desde que recibes el producto (Ley 19.496, art. 3 bis). Escríbenos por WhatsApp con tu número de pedido y te indicamos cómo devolverlo." (quita "sin uso"; el reembolso y el flete quedan pendientes del dueño). Garantía: "Si el producto llega con una falla o no corresponde a lo que ofrecimos, tienes 6 meses desde que lo recibes para elegir entre reparación, cambio o devolución del dinero (Ley 19.496, modificada por la Ley 21.398)."
- [diseno] `contacto.html`: bloque "Reclamos": "Si no quedas conforme con la respuesta, puedes acudir al SERNAC (www.sernac.cl) o al Juzgado de Policía Local de tu comuna." Ubicar bajo "Ayuda rápida". (sin datos del dueño; el bloque de datos del proveedor sigue esperando.)
- [diseno] Pie, `legal-pie`: no cambiar hasta tener razón social y RUT; dejar el espacio reservado en el diseño (una línea).
- [diseno] Fuentes: autoalojar Fraunces y Nunito o declarar Google Fonts en privacidad (la IP del visitante llega a un tercero) [I].
- [diseno] Mantener "pronto" en reseñas; no activar ni simular valoraciones.
- [contenido] Retirar de portada/fichas cualquier "exactos"; mantener lo marcado como pendiente sin cifras inventadas.

Siguen esperando datos del dueño (ver Pendientes): bloque Datos del proveedor en contacto, pie, texto de despacho incluido/aparte, reembolso y flete de retracto, correo para reclamos.

Anteriores:
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
