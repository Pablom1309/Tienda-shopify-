# Benchmark visual y UX — tiendas de mascotas (2026-10-05)

Método: lectura de la portada de cada sitio (WebFetch, una sola página, sin sesión ni rodeos). [V] = leído en la página; [I] = inferencia mía. Solo portada: fichas, carrito y móvil real NO fueron inspeccionados (la herramienta entrega texto, no capturas), por eso lo de móvil es [I].

## Resumen de lectura
| Tienda | URL | Fecha | Estado |
|---|---|---|---|
| Wild One | https://wildone.com | 2026-10-05 | leído (portada) |
| Fable Pets | https://fablepets.com | 2026-10-05 | leído (portada) |
| Petco CL | https://www.petco.cl | 2026-10-05 | leído (portada) |
| TusMascotas | https://www.tusmascotas.cl | 2026-10-05 | leído (portada) |
| Chewy | https://www.chewy.com | 2026-10-05 | no verificado (HTTP 429; no se insistió) |
| BarkBox | https://www.barkbox.com | 2026-10-05 | no verificado (HTTP 403 anti-bot; no se rodeó) |

## Wild One (DTC global)
- [V] Portada: un banner grande con un producto en uso (perro con correa) y un titular corto con 2 botones (comprar / ver colecciones); hay imagen alternativa para móvil.
- [V] Tarjetas: foto + nombre + precio + muestras de color + insignia ("Best Seller", "Kit & Save", "New!") + una línea de beneficio.
- [V] Menú: Perro, Gato, Nuevo, Nosotros; desplegables con paneles destacados. Banner de envío gratis sobre un monto. Sans moderna, alto contraste, paleta por colores de producto.
- Adoptar: (1) hero con producto en uso y 1 titular + 2 botones; (2) insignias sobrias por tarjeta ("Kit completo", "Incluye X piezas") — sin "Best Seller" inventado; (3) una línea de beneficio bajo el nombre.
- Evitar: secciones de testimonios/"Fan Favorites" y barra de oferta; Kuchiwau no tiene reseñas verificadas.

## Fable Pets (DTC global)
- [V] Portada: banner de promoción con código arriba, dos rutas ("Shop all" / "Save on sets" = sets), tarjetas con estrellas y colores, pie con Productos / Soporte / Empresa (FAQ, devoluciones).
- [V] Nombres de producto con identidad propia; discurso de "marca premium que calza con el hogar" [I: foto de ambiente doméstico, estética de objeto de diseño].
- Adoptar: (1) ruta explícita "Kits" frente a "Todo"; (2) pie ordenado en 3 columnas con FAQ y devoluciones visibles; (3) tono de objeto de diseño: fotos en ambiente de hogar, mucho aire.
- Evitar: estrellas/conteo de reseñas y códigos de descuento tipo urgencia, y referidos "Give $25 Get $25" por ahora.

## Petco CL (Chile)
- [V] Portada: carrusel de promociones; menú profundo por mascota (Perro, Gato, otros) y marcas A-Z; banner superior "Envío gratis desde $12.600 en Santiago" (nota: antes se registró $29.990 en el benchmark de precios; reconciliar — no verificado cuál rige); WhatsApp "Escríbenos por WhatsApp", correo y teléfono en cabecera; cuenta, pedidos, suscripción Easy Buy.
- Adoptar: (1) condición de envío en una franja fija sobre la cabecera; (2) WhatsApp + correo + teléfono visibles sin buscar; (3) etiquetas claras por categoría de mascota.
- Evitar: carrusel con rotación automática y menú gigante; para 3 kits agregan ruido.

## TusMascotas (Chile)
- [V] Portada: banners de campaña (Cyber), mosaicos grandes de categoría, tarjetas con precio tachado y % de descuento, botón "agregar al carrito", vista rápida; widget flotante de WhatsApp "¿Necesitas ayuda?"; tiendas físicas con horario; enlace "Cambios y Devoluciones"; texto negro sobre blanco, acento turquesa, insignias rojas de descuento.
- Adoptar: (1) botón flotante de WhatsApp en esquina; (2) enlace de cambios y devoluciones en cabecera/pie; (3) mosaicos grandes de categoría (para Kuchiwau: por problema — "Pelo", "Baño", "Calor").
- Evitar: precio tachado y porcentaje de descuento (prohibido en Kuchiwau por regla de "sin precios de referencia"), insignias rojas.

## Chewy y BarkBox
- no verificado. Chewy respondió 429 y BarkBox 403 (bloqueo anti-bot). No se usó nada de memoria como si fuera lectura. Reintentar otro día solo si el dueño lo pide; no hay que rodear el bloqueo.

## Brechas de Kuchiwau frente al benchmark [I, falta revisar sitio/ con capturas]
- Ningún competidor chileno leído muestra "pago al recibir": es el diferenciador y debe verse en portada y en el botón.
- Los DTC globales venden con foto de producto en uso y ambiente de hogar; los chilenos con banner de oferta. Kuchiwau puede ocupar el centro: calmo, crema/azul tinta, foto real.
- Los chilenos exponen contacto y política de cambios en cabecera; Kuchiwau tiene datos legales en null (correo, RUT, dirección), lo que resta confianza.

## Propuestas para diseño (sitio estático, paleta Kuchiwau: tinta #24316B, mandarina #FF8A4C, crema #FFF8F0, Nunito)
- [diseno] Franja fija superior de una línea: "Pagas al recibir · Despacho RM 2 a 4 días hábiles · Regiones 3 a 7" (datos de datos/tienda.json), sin cuenta regresiva ni oferta.
- [diseno] Portada: un hero con el Kit Baño y Secado en uso (foto real), 1 titular + 2 botones ("Ver el kit" mandarina / "Escribir por WhatsApp" contorno), fondo crema; sin carrusel.
- [diseno] Mosaicos grandes por problema ("Menos pelo", "Baño y secado", "Calor y frescura") en lugar de menú profundo; cada uno enlaza al kit.
- [diseno] Tarjeta de producto: foto, nombre, una línea de beneficio, insignia "Kit completo · N piezas" y precio único en CLP; sin tachados, sin estrellas, sin "últimas unidades".
- [diseno] Botón flotante de WhatsApp (esquina inferior derecha, móvil y escritorio) con texto "¿Dudas? Escríbenos"; evita tapar el botón de compra en móvil (barra de compra pegajosa con margen).
- [diseno] Ficha: un solo bloque de confianza (pago al recibir, garantía legal 6 meses, retracto 10 días) y lista "qué incluye"; medidas "por confirmar" donde falten.
- [diseno] Pie en 3 columnas (Tienda / Ayuda: despacho, cambios y devoluciones, contacto / Legal) con enlaces siempre visibles; mostrar correo y datos legales solo cuando el dueño los complete (hoy null; no inventar).
- [diseno] Tipografía y ritmo: Nunito con titulares grandes (peso 800), cuerpo 16-18 px, mucho espacio vertical, contraste AA ya verificado; un solo color de acento (mandarina) reservado para acciones.
