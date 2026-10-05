# Área: Dirección

Agente: `director-estrategia`. Lo actualiza el propio agente en cada ronda.

## Objetivo de la semana (5 al 11 de octubre de 2026)
**Al domingo 11 de octubre, la tienda queda lista para recibir su primer pedido contra entrega, salvo los portones del dueño: 0 brechas legales abiertas en privacidad, cambios y contacto (los datos del dueño quedan como campos marcados), el proceso de pedido documentado de punta a punta y los 3 kits de partida con ficha y verificación Dropi listas para completar.**

Etapa: validación, antes del lanzamiento (0 ventas, 0 pauta). Del 5 al 7 de octubre es CyberMonday: no se pauta (decisión vigente).

## Prioridades (en orden)
1. **Confianza y cumplimiento (legal):** privacidad conforme a la Ley 21.719 (vigente desde el 1 de diciembre), y en cambios, contacto y fichas la información obligatoria de la Ley 19.496. Sin esto no se puede vender ni pautar (Meta y Merchant Center también revisan estas páginas).
2. **Operación COD de punta a punta (operaciones):** pedido, confirmación por WhatsApp, despacho, novedad y devolución, con el tablero mínimo. En contra entrega, la tasa de entrega pesa más que el CPA: según `datos/finanzas.json`, en Pelo Cero G va de $8.925 (base) a $5.281 (pesimista, con comisión y flete de devolución).
3. **Tienda profesional en lo que convierte (diseño):** ficha de producto y formulario en móvil para los 3 kits de partida; la vitrina no debe parecer inacabada.

## Decisiones tomadas
- **Los 3 kits de partida son Kit Baño y Secado, Kit Gato Sin Pelusas y Kit Pelo Cero.** Por qué: el dueño fijó Baño y Secado como primero en la vitrina; Gato Sin Pelusas y Pelo Cero son los dos del plan de test de `datos/plan_ads.json` (Gato Sin Pelusas tiene la mejor economía del catálogo). Concentrar el trabajo de ficha, verificación y creativos en 3 kits, y no en 19, es lo que acerca la primera venta.
- **El orden de las áreas es legal, operaciones, diseño, competencia, ads, SEO y marca.** Por qué: primero va lo obligatorio y lo que protege la entrega, y después lo cosmético o de largo plazo. SEO tiene plazo el 15 de noviembre y marca no tiene urgencia mientras no haya cuentas creadas.
- **Ads trabaja solo en conceptos y guiones, sin presupuesto ni campañas.** Por qué: ningún kit se pauta sin verificación en Dropi (decisión del dueño), y la pauta es un portón humano.
- **Diseño no rediseña la marca ni la portada completa esta semana.** Por qué: lo prioritario es la ficha y el formulario de los 3 kits de partida; el resto es cosmético en esta etapa.
- **No se tocan los precios hasta tener costos reales de Dropi.** Por qué: no se inventan costos. Pelo Cero se mantiene en $26.990 hasta que el dueño confirme el costo (regla del backlog: baja a $24.990 solo si cepillo más removedor cuestan ≤ $8.000).

## Conflictos resueltos entre áreas
- **Vitrina (dueño: Baño y Secado primero) frente al plan de ads (Gato Sin Pelusas y Pelo Cero primero):** no se contradicen. La vitrina sigue la decisión del dueño y el test de anuncios parte con los kits que cierren mejor con el costo real de Dropi. Si Baño y Secado se verifica primero, entra al test.
- **Paso 5.6 de `LANZAMIENTO.md` (publicar la grilla de 9) frente a la decisión del dueño de no hacer la grilla:** manda el dueño. El orquestador debe corregir 5.6 en la próxima pasada de `LANZAMIENTO.md`; marca la reemplaza con 3 a 6 publicaciones reales del calendario orgánico.
- **Mensajes de confianza repetidos (diseño y legal quieren mostrar envío, pago al recibir y retracto):** se aplica "un mensaje, un lugar" (decisión del dueño). Legal define el texto y diseño decide un único lugar por mensaje.
- **Costo fijo de Shopify inconsistente:** `datos/finanzas.json` usa US$39/mes y `LANZAMIENTO.md` dice US$25/mes (US$19 anual). Se marca para conciliar en el próximo ciclo financiero con el precio vigente en shopify.com/cl, sin elegir una cifra a ciegas.

## Riesgos
- **Todo depende de los costos reales de Dropi:** costos, comisión, flete de devolución y días de pago no están verificados, y G puede caer cerca de un 40 % en el escenario pesimista. Mitigación: la hoja de verificación queda lista para que el dueño solo la complete.
- **La integración Dropi y Shopify en Chile no está confirmada** (Dropify no menciona Chile). Si falla, los pedidos se pasan a mano. Operaciones debe dejar diseñado ese plan B.
- **9 de 19 kits tienen imagen provisional:** una vitrina con "Foto real muy pronto" baja la confianza. Mitigación: priorizar visualmente los kits con foto y los 3 de partida.
- **Ley 21.719 desde el 1 de diciembre:** el consentimiento para WhatsApp y la política de privacidad tienen que estar listos antes.
- **Capital de trabajo:** el plan financiero estima un mínimo de caja de entre -$180.000 y -$400.000 según el CPA. No se aprueba pauta sin esa reserva.
- **Dependencia del dueño:** casi toda la ruta crítica (SII, dominio, Dropi, Shopify) es un portón humano. Si el dueño no avanza, el sistema solo puede preparar.

## Próximas tareas
- En la próxima ronda, revisar si legal y operaciones cerraron sus entregables y reordenar.
- Cuando el dueño cargue los costos de Dropi, decidir los 2 kits del primer test con G real.

## Hecho
- 2026-10-05: primera ronda. Fijé el objetivo de la semana, las 3 prioridades, los kits de partida y el orden de áreas en `estado/areas.json`.

## Propuestas para otras áreas
- [legal] Reescribir `privacidad.html` según la Ley 21.719 (finalidades, base de licitud, derechos de acceso, rectificación, eliminación y portabilidad, canal para ejercerlos, consentimiento separado para marketing), dejando como campos marcados razón social, RUT, dirección y correo del dueño.
- [legal] Revisar `cambios.html`, la página de contacto y las fichas de los 3 kits de partida contra la Ley 19.496: garantía legal de 6 meses, retracto de 10 días, precio final, costo y plazo de despacho, datos del proveedor. Entregar una lista de brechas con el texto propuesto.
- [operaciones] Escribir `datos/operaciones.md` con el flujo COD diario: pedido, confirmación por WhatsApp (usar `datos/plantillas_whatsapp.md`), carga en Dropi (plan B manual si no hay integración en Chile), despacho, novedades el mismo día, devoluciones con evidencia y rutina de retiro de saldo.
- [operaciones] Definir el tablero semanal mínimo (generados, confirmados, despachados, entregados y devueltos, por kit y región) en `datos/resultados/` y la regla para no despachar pedidos sin confirmar.
- [diseno] Ficha y formulario en móvil de Kit Baño y Secado, Gato Sin Pelusas y Pelo Cero: precio, "pagas al recibir", plazo y botón visibles sin desplazarse, bloque "Qué incluye" con medidas "por confirmar con proveedor" y cada mensaje de confianza en un solo lugar.
- [diseno] Vitrina: ordenar primero los kits con foto (Baño y Secado al inicio) para que las imágenes provisionales no queden arriba.
- [competencia] Comparar precio, envío, confianza y oferta de los 3 kits de partida frente a Petco CL, TusMascotas y tiendas Shopify chilenas, con URL y fecha. Sin inventar precios; lo que no se pueda leer queda como "no verificado".
- [ads] Preparar 4 o 5 conceptos realmente distintos (ángulo, persona y formato) para Gato Sin Pelusas y Pelo Cero, más 2 para Baño y Secado, con ganchos y texto conformes a las políticas de Meta. Sin presupuesto ni campañas; anotar qué tomas reales necesita el dueño.
- [seo] Auditoría SEO técnica breve (títulos, meta, canónicas, sitemap, datos estructurados `Product` coherentes con la página) enfocada en los 3 kits de partida; la guía "Verano con tu perro" puede esperar a la semana siguiente (plazo 15 de noviembre).
- [marca] Calendario orgánico de 30 días centrado en los 3 kits de partida, que reemplace la grilla de 9 (descartada por el dueño); listo para cuando existan las cuentas, sin publicar nada.

## Pendientes del dueño
- Fase 0 de `LANZAMIENTO.md`: búsqueda de Kuchiwau en INAPI, registro de kuchiwau.cl, correo de la marca y reserva de @kuchiwau.
- Inicio de actividades en el SII y envío de razón social, RUT, dirección comercial y correo (los exige la Ley del Consumidor en la tienda).
- Cuenta Dropi Chile validada y `datos/verificacion_dropi.csv` completo, empezando por Baño y Secado, Gato Sin Pelusas y Pelo Cero: costo, flete, comisión, flete de devolución, días de pago y mismo proveedor por kit.
- Preguntar a Dropi Chile qué app de integración con Shopify usar.
- Muestras físicas y fotos o videos reales de los 3 kits de partida.
- Reservar capital de trabajo antes de aprobar cualquier pauta (el plan financiero estima entre $300.000 y $400.000).
