# Área: Diseño y conversión

Agente: `disenador-web`. Lo actualiza el propio agente en cada ronda.

## Próximas tareas
- (legal 2026-10-05) diseno: cambiar `pedido.js` línea 154 de `Purchase` a `Lead` o `InitiateCheckout`; cargar el píxel solo con aviso y opción de rechazar (coordinar con ads).
- (legal 2026-10-05) diseno (cuando existan los datos del dueño): integrar el texto de `datos/legal/privacidad.md` en `privacidad.html`; reemplazar `contacto.html` y el pie con los textos de C1; reemplazar `cambios.html` con el texto de I1; añadir el enlace "Cómo usamos tus datos" en la casilla de consentimiento y el aviso de una línea bajo el botón de WhatsApp (textos auxiliares en privacidad.md). Mientras razón social, RUT, domicilio y correo sean null, mostrar aviso interno y no publicar.
- Formulario móvil: probar envío real en iPhone/Android (teclado, autocompletar) y reducir campos si Baymard lo respalda.
- Ficha: galería con 2.ª foto (contenido del kit) cuando existan fotos reales; hoy solo hay una imagen referencial por kit.
- Revisar repetición de "Pagas al recibir" (barra superior, ficha, total del formulario): un solo lugar por página.
- Página Nosotros honesta (backlog P3).
- Página de gracias con complemento de un clic (backlog P3).
- Rendimiento: peso por página, fuentes autohospedadas (backlog P3).

## Hecho
- 2026-10-05 Ficha móvil (390 px): foto 4:3, migas ocultas, precio + IVA + "Pagas al recibir" + plazo RM/regiones + botón "Pedir este kit" sobre el pliegue (precio y=633, botón y=791 de 844; antes precio 933-967 y botón 1850+). Barra fija ya no repite "Pagas al recibir". "Qué incluye": cada pieza sin medida dice "Medidas: por confirmar con proveedor". Vitrina con Baño y Secado primero y kits con foto antes (ya estaba en `orden_vitrina`). Verificado en 390 y 1366 px, 3 kits, sin scroll horizontal ni errores de consola; verificar.py = 0.

## Propuestas para otras áreas
- Operaciones/Dropi: medidas y materiales reales de las piezas de los 3 kits de partida, para reemplazar "por confirmar con proveedor".
- Marca: fotos reales del kit y una segunda toma de contenido; hoy son referenciales.
- Legal: confirmar que la línea "Pagas al recibir" más el retracto del formulario cubren lo exigible.

## Pendientes del dueño
