# Lanzamiento de Kuchiwau en Instagram y Meta (Chile)

Fecha: 2026-10-04. Marca: Kuchiwau, kits de cuidado para perros y gatos, pago contra entrega. Sitio: https://pablom1309.github.io/Tienda-shopify-/ . WhatsApp: +56979814797.

Leyenda: [V] dato tomado de la fuente citada. [I] inferencia o recomendación mía, no verificada. Las páginas oficiales de Meta se leyeron solo a través de resúmenes de búsqueda; los pasos de menú cambian seguido, así que confirma cada pantalla al hacerlo.

Reglas que se cumplen en todo el documento (de CLAUDE.md y marca.json): sin reseñas ni testimonios inventados, sin escasez falsa, sin seguidores falsos, sin afirmaciones de salud, sin mayúsculas gritonas. Todo paso que cree cuentas, gaste dinero o publique es una acción humana del dueño; aquí solo se propone.

## 0. Hallazgos que cambian el plan

1. **Instagram Shopping y las tiendas de Meta no están disponibles en Chile.** [V] Meta discontinuó Shops en Argentina, Colombia y Chile desde el 10-ago-2023; el etiquetado de productos en publicaciones también quedó fuera. Fuentes: https://ayuda.tiendanube.com/facebook-e-instagram-shopping/acerca-de-la-desactivacion-de-meta-shops y https://techcrunch.com/2023/04/27/instagram-facebook-force-checkout-experience-shops-soon/amp/ . Son fuentes secundarias de 2023; no encontré una página oficial de Meta que lo confirme para 2026. Conclusión [I]: la venta se hace por enlace en bio, WhatsApp y anuncios, no por etiquetas de producto (ver paso 3).
2. **Discrepancia de paleta en el repositorio.** `datos/marca.json` define azul tinta #24316B, mandarina #FF8A4C y crema #FFF8F0 (decisión del 2026-10-04). `marca/README.md` aún dice verde #1F5F5B, ámbar #F2A541 y crema #FBF8F3. [I] Usar marca.json como vigente y actualizar el README o los SVG antes de exportar la foto de perfil. No leí `marca/isotipo.svg`: confirma sus colores.
3. **Los costos de casi todos los kits están "estimados" en catalogo.json** (solo Kit Pelo Cero tiene ficha completa y aun así falta confirmar el costo real en Dropi). [I] No publicar ni pautar un kit hasta que el dueño confirme costo real, peso y proveedor único en app.dropi.cl, y haya probado una unidad. La frase "kit probado" de la promesa de marca solo se puede usar después de probarlo.
4. **Los kits de verano y Navidad entran desde mediados de noviembre** (catalogo.json: ventana desde ~15-nov). Hoy es 4-oct: el arranque usa kits de todo el año y de primavera.

## 1. Crear la cuenta de Instagram

**Paso 1.1 Usuario.** Orden de preferencia: `@kuchiwau`, luego `@kuchiwau.cl`, luego `@kuchiwau_chile`. [I] Solo se sabe si están libres intentando crearlas; no puedo verificarlo desde aquí. Usar el mismo usuario en Facebook, TikTok y WhatsApp. Antes de invertir en la marca, el dueño debe avanzar con el registro INAPI y los dominios kuchiwau.cl, kuchiguau.cl y cuchiguau.cl (pendiente según marca.json). Conviene reservar los tres usuarios variantes solo si el dueño lo decide; es gratis pero es crear cuentas (portón humano).

**Paso 1.2 Crear con correo propio de la marca** (ver paso 5), no con el correo personal. Se crea como cuenta personal y luego se cambia a profesional.

**Paso 1.3 Tipo de cuenta: Empresa (Business).** [V] Meta indica que Empresa es para comercios, marcas y proveedores de servicios, y Creador para figuras públicas, artistas e influencers. Fuente: https://help.instagram.com/502981923235522 . [I] Kuchiwau vende productos: elegir Empresa. Ruta [V]: Configuración y actividad > Para profesionales > Tipo de cuenta y herramientas > Cambiar a cuenta profesional > Empresa. Si la cuenta era privada, al pasar a profesional queda pública [V, misma fuente]. Se puede cambiar de tipo después.

**Paso 1.4 Categoría.** [I] "Tienda de mascotas" o "Tienda de artículos para mascotas" (los nombres exactos los ofrece la lista de Instagram; elegir el más cercano). Evitar categorías de salud o veterinaria.

**Paso 1.5 Foto de perfil.** [V] Instagram guarda la foto a 320x320 px, relación 1:1, y se muestra recortada en círculo (https://expertphotography.com/instagram-profile-picture-size-guide ). [I] Exportar `marca/isotipo.svg` a PNG de 1080x1080 (nítido en pantallas retina; Instagram lo reduce) con el isotipo centrado y margen de seguridad de al menos 15 % por el recorte circular. Fondo crema #FFF8F0 o azul tinta #24316B; probar ambos en miniatura de 110 px.

**Paso 1.6 Nombre buscable.** Campo "Nombre" (distinto del usuario): `Kuchiwau | Kits para mascotas`. [V] La búsqueda de Instagram considera usuario, nombre, bio y contenido de las publicaciones (resumen de guías, sin fuente oficial). [I] Alternativa si se quiere sumar ciudad: `Kuchiwau | Kits perros y gatos`.

**Paso 1.7 Bio (máximo 150 caracteres [V], contando espacios y emojis).** Tres versiones, con conteo aproximado; pegar en Instagram y revisar que no pase el límite:

- Versión A (promesa): `Kits de cuidado para perros y gatos 🐾 Menos pelo en casa, más frescura para tu mascota. Pagas al recibir. Envíos a Chile 👇` (aprox. 122 caracteres)
- Versión B (compra sin riesgo): `Kits para perros y gatos en Chile 🐶🐱 Pago contra entrega · Garantía legal 6 meses · Retracto 10 días. Pedidos por WhatsApp 👇` (aprox. 125 caracteres)
- Versión C (soluciones completas): `Un kit, el problema resuelto: pelo, paseo, juego y baño para perros y gatos. Pagas cuando llega. Chile 🇨🇱 Pide aquí 👇` (aprox. 118 caracteres)

[I] Recomendación: partir con B (resume los tres pilares de marca.json: compra sin riesgo). Las cifras de garantía y retracto vienen de marca.json y de la skill (Ley 19.496); confirmar con SERNAC antes de publicarlas. No prometer plazos de entrega en la bio.

**Paso 1.8 Enlace en bio.** Un solo enlace al sitio: https://pablom1309.github.io/Tienda-shopify-/ . [I] Instagram permite más de un enlace en el perfil; si se agrega, el segundo sería `https://wa.me/56979814797` (formato de enlace directo de WhatsApp, sin signo + ni espacios). Cuando exista kuchiwau.cl, reemplazar el enlace y rehacer la verificación de dominio (paso 2.6). Recomendado: agregar `?utm_source=instagram&utm_medium=bio` al enlace para medirlo en Shopify.

**Paso 1.9 Botones de contacto.** [V] Meta permite editar la información comercial (correo, teléfono, dirección, botones) en Editar perfil > Opciones de contacto: https://help.instagram.com/529483457260403 . [I] Cargar correo de la marca y el teléfono +56979814797; si aparece la opción de botón de acción o de WhatsApp, activarla. La disponibilidad del botón de WhatsApp en Chile no la pude verificar. Alternativa segura: el mensaje directo de Instagram con enlace a WhatsApp en la bio y destacados. Dirección: dejarla vacía si no hay local público.

**Paso 1.10 Destacados.** Cinco, con portada propia (isotipo sobre color de la paleta, un color por destacado, sin texto largo):

| Destacado | Contenido | Nota |
|---|---|---|
| Kits | Una historia por kit activo: qué incluye, precio, para quién | Precio final con IVA, sin precios tachados ni de referencia |
| Cómo comprar | 1) Eliges el kit 2) Pides por la tienda o WhatsApp 3) Confirmamos contigo 4) Pagas al recibir | Explicar la confirmación por WhatsApp o llamada |
| Envíos | Plazos reales por zona, transportadora, comunas con cobertura | Solo plazos verificados en Dropi; si no se sabe, decirlo |
| Cambios | Garantía legal 6 meses, retracto 10 días, cómo pedirlo | Ley 19.496 (skill); revisar redacción con SERNAC |
| Preguntas | Pago contra entrega, qué pasa si no estoy, tamaños, contacto | Respuestas honestas, sin promesas de salud |

## 2. Página de Facebook, Meta Business y WhatsApp Business

**Paso 2.1 Página de Facebook.** Crear la Página "Kuchiwau" (no un perfil) desde la cuenta personal del dueño, categoría igual a la de Instagram, misma foto de perfil, portada con el logo horizontal, botón de acción "Enviar mensaje de WhatsApp" o "Comprar ahora" con el enlace del sitio (según opciones disponibles). Completar descripción, correo y teléfono.

**Paso 2.2 Portfolio comercial (antes Business Manager).** [V] El portfolio comercial agrupa Páginas, cuentas de Instagram, cuentas publicitarias, catálogos, píxel y activos de WhatsApp, y es necesario para verificar dominio y usar la plataforma de WhatsApp (resumen de https://help.chatdaddy.tech/article/how-to-create-a-meta-business-portfolio y https://docs.360dialog.com/docs/resources/meta-business-manager ; fuentes de terceros). Crearlo en business.facebook.com con el correo de la marca, nombre "Kuchiwau". Usar nombre legal real al pedir verificación.

**Paso 2.3 Vincular Instagram.** [V] Para anunciar en Instagram hay que conectar la cuenta profesional al portfolio. Pasos oficiales para conectar Instagram con una Página: https://help.instagram.com/570895513091465 . [I] Hacerlo desde Instagram (Editar perfil > Página) o desde Configuración del negocio > Cuentas > Cuentas de Instagram, y asignar al dueño control total.

**Paso 2.4 WhatsApp Business (app).** [V] La app de WhatsApp Business ofrece catálogo, mensaje de saludo, mensaje de ausencia y respuestas rápidas (https://www.zoko.io/post/whatsapp-auto-reply y https://whatsappbusiness.com/ ). [V] Si se abre WhatsApp Business con un número que ya tiene WhatsApp personal, la app ofrece migrar la cuenta y restaurar la copia de seguridad (https://aunoa.ai/en/blog/how-to-migrate-your-personal-whatsapp-to-business-without-losing-anything/ ). [I] Decisión del dueño: usar +56979814797 solo para el negocio; si lo usa también de forma personal, migrar o comprar otro número, porque el número del negocio será visible. No usar la API (de pago por mensaje según skill) hasta tener volumen.

Configuración mínima:
- Perfil: nombre "Kuchiwau", categoría, descripción, horario, correo, sitio web.
- Catálogo: [I] cargar los kits aprobados con foto real, nombre, precio final y enlace a la ficha de la tienda. La disponibilidad del catálogo en Chile la confirma la propia app; el catálogo de WhatsApp es distinto de Instagram Shopping.
- Etiquetas: Nuevo pedido, Por confirmar, Confirmado, Despachado, Entregado, Novedad.
- Vincular la cuenta de WhatsApp Business a la Página o a Instagram (Configuración > Herramientas para la empresa > Cuentas vinculadas [I]).

**Paso 2.5 Plantillas de mensajes (editar datos entre corchetes).**

1. **Saludo automático** (nueva conversación o tras 14 días de inactividad [V, según zoko.io]):
   `Hola, gracias por escribir a Kuchiwau 🐾 Somos una tienda de kits de cuidado para perros y gatos. Cuéntanos qué kit te interesa o qué necesitas resolver (pelo, paseo, juego, baño) y te ayudamos. Pagas al recibir.`
2. **Ausencia** (fuera de horario):
   `Hola, ya cerramos por hoy. Te respondemos [lunes a viernes de 10:00 a 19:00 / ajustar horario real]. Mientras, puedes ver los kits en https://pablom1309.github.io/Tienda-shopify-/ . Gracias por tu paciencia.`
3. **Respuesta rápida: confirmación de pedido** (atajo `/confirmar`):
   `Hola [nombre], recibimos tu pedido del [kit]. Para despacharlo confirma por favor: 1) nombre completo, 2) dirección con referencias y comuna, 3) teléfono, 4) total a pagar al recibir: $[precio]. Quien reciba debe tener el pago en la mano. ¿Está todo correcto?`
4. **Respuesta rápida: envío y cambios** (atajo `/envio`):
   `El plazo estimado a [comuna] es de [X a Y días hábiles según Dropi]. Pagas al recibir. Tienes garantía legal de 6 meses y 10 días de retracto desde que recibes el producto. Si tienes un problema, escríbenos aquí con una foto y lo vemos contigo.`

[I] No usar urgencia falsa ("quedan 3") ni mensajes promocionales masivos sin consentimiento expreso (Ley 21.719 según skill). Si Kuchiwau más adelante usa la API, la confirmación se clasifica como mensaje de utilidad, no de marketing.

**Paso 2.6 Verificación de dominio.** [V] Se hace en Configuración del negocio > Seguridad de la marca > Dominios, con una de tres opciones: etiqueta meta en el `<head>` de la página de inicio, archivo HTML en la raíz o registro DNS TXT (https://developers.facebook.com/docs/sharing/domain-verification/verifying-your-domain ). [I] Problema: el sitio actual está en un subdominio de github.io (`pablom1309.github.io`), que no es un dominio propio; Meta pide verificar un dominio del que se tenga control (raíz). Por eso, esperar a registrar kuchiwau.cl en nic.cl (portón humano) y verificarlo con registro TXT. Mientras tanto, la etiqueta meta en el sitio estático podría servir solo si Meta la acepta para ese subdominio; no está comprobado. Si la tienda pasa a Shopify, la verificación se hace igual contra el dominio de Shopify.

**Paso 2.7 Verificación del negocio (opcional por ahora).** [V según fuente de terceros] Verificar el negocio sube el límite de mensajes iniciados por la empresa de la API de WhatsApp de 200 a 2.000 (https://helpcenter.saysimple.com/whatsapp-management/how-do-i-verify-my-business-in-the-meta-business-suite ). [I] No hace falta en el arranque; requiere documentos legales (SII, escritura), así que depende de que el dueño formalice la sociedad.

**Paso 2.8 Cuenta publicitaria y método de pago (sin gastar).** [V] Se agrega en Administrador de anuncios > Facturación > Configuración de pagos > Agregar método de pago; se aceptan tarjetas de crédito o débito, PayPal y métodos locales según el país (https://help.instagram.com/1522953744580283 ). [V] La moneda y el país de la cuenta publicitaria no se pueden editar después: habría que crear otra (resumen de https://help.easyadsapp.com/hc/easyads/articles/how-to-update-add-a-payment-method-to-an-ad-account ). [I] Elegir moneda CLP y zona horaria de Chile al crearla. Dejar el método de pago puesto no gasta nada: solo se cobra cuando hay una campaña activa. Fijar un límite de gasto de la cuenta (opción de Facturación) por seguridad. Esto último y la tarjeta son portón humano: el agente no ingresa datos de pago ni lanza campañas.

**Paso 2.9 Píxel y API de conversiones.** [I] Según la skill: crear el conjunto de datos (píxel) en el portfolio, instalar el píxel y la API de conversiones juntos con deduplicación por `event_id`, y revisar en "Probar eventos" que el evento de compra salga una sola vez con valor y moneda. El sitio actual es estático en GitHub Pages: el píxel solo funciona si se inserta el código en las páginas y hay consentimiento de cookies donde corresponda; la API de conversiones requiere servidor o Shopify. Por eso el píxel real conviene al pasar a Shopify (Canales de venta > Facebook & Instagram > Uso compartido de datos, nivel Máximo). Hasta entonces no hay anuncios que optimizar a compras.

## 3. Instagram Shopping y catálogo

- **No aplica en Chile.** [V] Meta discontinuó Shops (tienda, etiquetas de productos y pago) en Chile desde el 10-ago-2023; en Latinoamérica solo continuó México (fuentes del hallazgo 1). Las condiciones generales de elegibilidad de Instagram Shopping (negocio con sitio propio, catálogo, productos permitidos) no se pueden cumplir en Chile hoy.
- Qué hacer [I]: no perder tiempo configurando etiquetas de producto. Verificar en 6 meses si Meta lo reactiva en Chile (la elegibilidad se revisa en Administrador de comercio dentro del portfolio; si el país no aparece, no está disponible).
- Sí sirve un catálogo de Meta para anuncios de catálogo y carruseles dinámicos, y el catálogo de WhatsApp Business. Ambos son opcionales. Para el catálogo de Meta: feed desde Shopify o carga manual, con los mismos precios y nombres que la tienda (incoherencias traen rechazos).
- Alternativas de venta con intención: enlace en bio, mensaje directo, WhatsApp, anuncios de clic a WhatsApp ("embudo alternativo" de la skill, útil cuando la entrega del formulario es baja).

## 4. Contenido de arranque

### Formatos [V]
- Reels: 1080x1920 px, 9:16 (https://argil.ai/blog/instagram-reel-size-e350f ).
- Carrusel y foto: 4:5 retrato, 1080x1350 px; todas las láminas del mismo tamaño (https://socialbu.com/blog/?p=26562 ).
- Cuadrícula del perfil: [V según guías de tamaño] desde fines de 2025 la vista previa es 3:4 y los Reels se recortan al centro; [I] mantener texto y producto en el centro del encuadre, y la portada del Reel con 1080x1440 de margen seguro.
- Todo material debe ser propio: fotos y videos reales de las unidades de prueba, sin imágenes de otras tiendas ni de marcas ajenas. Si aún no hay unidad probada, la grilla inicial usa solo piezas de marca (publicaciones 1 a 3).

### Horarios [V]
Sprout Social (2026, casi 2.000 millones de interacciones, hora local de la audiencia): lunes 14-16 h, martes 13-19 h, miércoles 12-21 h, jueves 12-14 h; los fines de semana rinden menos (https://sproutsocial.com/best-times-to-post/instagram-media ). Es un dato global, no de Chile. [I] Programar Reels y carruseles martes a jueves entre 12:30 y 14:00 y entre 19:00 y 21:00 hora de Chile, y medir con Insights durante 4 semanas para reemplazar este supuesto por los datos propios.

### Hashtags
[V según guías secundarias] En diciembre de 2025 Instagram limitó a 5 los hashtags por publicación y Mosseri recomienda pocos y específicos (https://metricool.com/instagram-reels-guide/ ; fuente de terceros, confirmar al publicar). [I] Usar 3 a 5 por pieza: 1 de marca + 2 a 3 de nicho local + 1 amplio. Banco para rotar: #Kuchiwau (marca), #MascotasChile, #PerrosDeChile, #GatosDeChile, #DueñosDeMascotas, #PerroEnDepartamento, #GatoEnDepartamento, #SantiagoMascotas, #AccesoriosParaMascotas. No he medido el volumen de ninguno; revisar cuáles tienen publicaciones recientes antes de usarlos.

### Las primeras 9 publicaciones (grilla 3x3)
Se publican de la 9 a la 1 para que la 1 quede arriba a la izquierda; [I] publicar las 9 en 3 a 5 días antes de promocionar el perfil. Cada pieza lleva el pie de foto con una sola llamada a la acción (enlace en bio o WhatsApp) y sin afirmaciones de salud. Kits con costo aún estimado solo se muestran cuando el dueño los confirme (marcados con *).

| # | Formato | Tema | Contenido |
|---|---|---|---|
| 1 | Carrusel 4:5 (5 láminas) | Presentación de marca | "Un kit, el problema resuelto". Láminas: qué es Kuchiwau, los 3 pilares (soluciones completas, compra sin riesgo, honestidad), cómo se compra, contacto. Colores de marca.json |
| 2 | Reel 9:16 (15 s) | Cómo comprar | Pantalla de la tienda > pedido > confirmación por WhatsApp > pagas al recibir. Texto en pantalla |
| 3 | Imagen 4:5 | Promesa | "Menos pelo en tu casa y más frescura para tu mascota, con pago al recibir." Tipografía Nunito |
| 4 | Reel 9:16 | Kit Pelo Cero (perro) | Demostración del cepillo y el removedor sobre un sillón con pelo real |
| 5 | Reel 9:16 | Kit Gato sin Pelusas* | Cepillo autolimpiante y varita en un sofá |
| 6 | Carrusel 4:5 | Qué incluye cada kit | Foto de todas las piezas, precio final con IVA, "pagas al recibir" |
| 7 | Reel 9:16 | Kit Paseo Hogar Limpio* | Bolsas, dispensador y paseo; "lo que necesitas para el paseo en un solo pedido" |
| 8 | Imagen 4:5 | Garantía y cambios | Garantía legal de 6 meses y retracto de 10 días, explicado simple |
| 9 | Reel 9:16 | Detrás de escena | Dueño abriendo el paquete de la unidad de prueba y mostrando lo que llega, con defectos si los hay |

Regla [I]: si un kit falla la prueba de la unidad, no se publica; la honestidad es un pilar de marca.

### Plan de 14 días de historias y Reels
Ritmo [I]: 1 Reel o carrusel en feed día por medio, y 3 a 5 historias diarias. Cada Reel dura 15 a 30 s con el gancho en los primeros 3 segundos ([V] los primeros segundos concentran la mayor caída de audiencia, según https://metricool.com/instagram-reels-guide/ ). Cierre de cada guion: "Pide el tuyo desde el link en bio. Pagas al recibir." Sin mayúsculas sostenidas. Los dos kits de temporada (Verano Fresco, Navidad) esperan al 16-nov; mientras, solo avanzar si el dueño los confirma.

| Día | Pieza | Kit o tema | Gancho (0 a 3 s) | Guion corto |
|---|---|---|---|---|
| 1 | Historia + Reel | Presentación | "Pelo en el sillón, otra vez." | Mostrar el problema, presentar Kuchiwau y los kits |
| 2 | Historias | Cómo comprar | "¿Cómo se compra sin pagar antes?" | 4 pasos del destacado Cómo comprar |
| 3 | Reel | Pelo Cero | "Este sillón estaba cubierto de pelo." | Cepillar a la mascota, sacar el pelo del sillón con el removedor, mostrar el kit y el precio |
| 4 | Historias | Pelo Cero | "Pregúntanos lo que quieras del kit" | Caja de preguntas; responder en vivo con el producto |
| 5 | Reel | Gato sin Pelusas* | "Un gato, un sofá y mucho pelo." | Cepillo autolimpiante y varita; mostrar el antes y el después del sofá (real) |
| 6 | Historias | Plazos reales | "¿Cuánto demora a tu comuna?" | Explicar los plazos reales según Dropi; si no se sabe, decirlo |
| 7 | Carrusel | Qué incluye | "Lo que trae cada kit, sin letra chica." | Foto pieza por pieza, precio final, garantía |
| 8 | Reel | Paseo Hogar Limpio* | "El paseo, resuelto en un solo pedido." | Dispensador, bolsas y la correa; escenas de paseo reales |
| 9 | Historias | Primavera | "Se viene el calor, ¿y tu mascota?" | Contar lo que viene: alfombras y piscina desde noviembre; sin promesas de salud ni de "bajar la temperatura" |
| 10 | Reel | Enriquecimiento* | "El juego de olfato para días en casa." | Alfombra olfativa y silicona con premios caseros del dueño (no vender comida); solo "juego y entretención" |
| 11 | Historias | Votación | "¿Perro o gato? ¿Qué kit quieres ver?" | Encuesta; usar el resultado para el siguiente Reel |
| 12 | Reel | Rascador de pared* | "Departamento chico, gato grande." | Instalar el rascador en una pared o esquina (probado antes); mostrar la marca que deja o no deja |
| 13 | Historias | Baño en casa* | "Baño en casa, sin pelear." | Cepillo de silicona y guante; sin afirmaciones sobre piel o pelaje |
| 14 | Carrusel + historias | Resumen y balance | "Esto fue lo que aprendimos en 14 días." | Mostrar los kits y abrir mensajes directos para pedidos |

(* = solo si el dueño confirmó costo y probó la unidad.)

Reglas de contenido [I]: nunca mostrar mascotas con signos de molestia; nunca decir "aprobado por veterinarios", "evita", "previene", "calma", "ansiedad" ni "mejora la salud"; para el puntero láser de gatos, no mostrar el haz sobre un animal y no pautarlo hasta revisar la política de Meta (nota de catalogo.json). Si el kit no tiene fotos reales, no inventar demostraciones.

## 5. Seguridad de la cuenta

1. **Correo de la marca.** [I] Crear un correo exclusivo (ej. `hola@kuchiwau.cl` cuando exista el dominio; mientras, una cuenta nueva de correo con clave única). No usar el correo personal. Anotar la recuperación en un gestor de claves.
2. **Autenticación en dos pasos.** [V] Ruta: Centro de cuentas > Contraseña y seguridad > Autenticación en dos pasos, con app de autenticación, SMS o WhatsApp (resumen de https://arynews.tv/two-factor-authentication-on-instagram-how-to-enable-it/ ). [I] Preferir app de autenticación sobre SMS. Activarla también en Facebook, en el portfolio comercial y en el correo. Guardar los códigos de respaldo fuera del teléfono.
3. **Roles.** [I] El dueño es único administrador del portfolio; cualquier agencia o ayudante entra con acceso parcial y se revoca al terminar. Nunca compartir la clave.
4. **No comprar seguidores, likes ni comentarios.** [V] Instagram prohíbe comprar o vender aspectos de una cuenta y recopilar seguidores o likes de forma artificial; usa aprendizaje automático para detectar cuentas que lo hacen (https://influencermarketinghub.com/why-you-should-not-buy-instagram-followers/ ). [I] Además, falsean las métricas y dañan el rendimiento de los anuncios. Tampoco usar grupos de "follow for follow" ni bots.
5. **Phishing.** [I] Meta nunca pide la clave por mensaje; desconfiar de "tu cuenta será eliminada" y de insignias de verificación ofrecidas por DM. Entrar siempre desde la app oficial.
6. **Respaldo.** [I] Descargar sus datos (Centro de cuentas > Tu información y permisos) cada trimestre; guardar los archivos originales de logo y fotos fuera de Instagram.
7. **Registro.** Anotar en `estado/bitacora.md` qué cuentas se crearon y cuándo, sin claves ni códigos.

## 6. Métricas semanales

Revisar cada lunes, en los Insights de Instagram y en el portfolio, y contrastar con Shopify o Dropi. Metas numéricas: no hay datos fiables de Chile, así que primero registrar 4 semanas y fijar metas propias [I].

| Métrica | Dónde | Para qué |
|---|---|---|
| Alcance y cuentas alcanzadas, seguidores vs no seguidores | Insights de Instagram | Si el contenido sale de la comunidad |
| Retención a 3 s y tiempo de visualización de Reels | Insights | [V] El tiempo de visualización es la señal más fuerte de Reels (https://metricool.com/instagram-reels-guide/ ); decide qué ganchos repetir |
| Compartidos por mensaje y guardados | Insights | [V según la misma fuente] Los compartidos por DM impulsan el alcance nuevo |
| Visitas al perfil y toques en el enlace de bio | Insights | Intención de compra |
| Mensajes nuevos de WhatsApp y de Instagram, tiempo de primera respuesta | WhatsApp Business > Estadísticas; Instagram | Calidad de atención |
| Conversaciones que llegan a pedido | Registro propio | Embudo real |
| Visitas a la tienda por origen (UTM instagram) y pedidos | Shopify o Google Analytics | Atribución propia |
| Pedidos generados, confirmados, despachados, entregados, devueltos | Dropi | La entrega manda en contra entrega (skill) |
| Comentarios negativos y reportes | Instagram | Alertas antes de que afecten la cuenta |
| Seguidores netos | Insights | Solo como referencia; no es objetivo |
| Cuando haya anuncios: gasto, CPA, ROAS frente al CPA de equilibrio de catalogo.json | Administrador de anuncios | Decidir matar o escalar |

Decisión semanal [I]: repetir el gancho y formato del Reel con más retención, matar el peor, y cambiar una variable por vez.

## Pendientes humanos
1. Crear las cuentas (Instagram, Facebook, portfolio, WhatsApp Business) y probar usuarios.
2. Registrar kuchiwau.cl y avanzar el trámite INAPI.
3. Confirmar costos reales, probar unidades y decidir qué kits se publican primero.
4. Método de pago de anuncios y límite de gasto (no gastar hasta el píxel y la entrega verificados).
5. Alinear los colores del README con marca.json.

## Fuentes
- https://help.instagram.com/502981923235522
- https://help.instagram.com/570895513091465
- https://help.instagram.com/529483457260403
- https://help.instagram.com/1522953744580283
- https://developers.facebook.com/docs/sharing/domain-verification/verifying-your-domain
- https://whatsappbusiness.com/
- https://www.zoko.io/post/whatsapp-auto-reply
- https://aunoa.ai/en/blog/how-to-migrate-your-personal-whatsapp-to-business-without-losing-anything/
- https://ayuda.tiendanube.com/facebook-e-instagram-shopping/acerca-de-la-desactivacion-de-meta-shops
- https://techcrunch.com/2023/04/27/instagram-facebook-force-checkout-experience-shops-soon/amp/
- https://sproutsocial.com/best-times-to-post/instagram-media
- https://metricool.com/instagram-reels-guide/
- https://argil.ai/blog/instagram-reel-size-e350f
- https://socialbu.com/blog/?p=26562
- https://expertphotography.com/instagram-profile-picture-size-guide
- https://help.chatdaddy.tech/article/how-to-create-a-meta-business-portfolio
- https://docs.360dialog.com/docs/resources/meta-business-manager
- https://helpcenter.saysimple.com/whatsapp-management/how-do-i-verify-my-business-in-the-meta-business-suite
- https://help.easyadsapp.com/hc/easyads/articles/how-to-update-add-a-payment-method-to-an-ad-account
- https://arynews.tv/two-factor-authentication-on-instagram-how-to-enable-it/
- https://influencermarketinghub.com/why-you-should-not-buy-instagram-followers/
