# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Dueños de perros y gatos en Chile urbano, de 25 a 50 años, que viven en departamento o casa con muebles de tela y valoran su tiempo. Compran mayormente desde el celular, llegando desde anuncios de Meta o redes. Desconfían de pagar por adelantado a tiendas que no conocen.

## Product Purpose
Kuchiwau vende kits de cuidado para mascotas (pelo, baño, calor, paseo, juego) que resuelven un problema completo en un solo pedido, con pago contra entrega en todo Chile. Éxito: que el visitante entienda en segundos qué resuelve cada kit, confíe en pedirlo sin pagar antes y complete el formulario.

## Positioning
Kits armados que resuelven el problema de punta a punta (mascota + casa) en vez de piezas sueltas, con pago al recibir: los competidores chilenos revisados (Petco, TusMascotas) no ofrecen pago contra entrega.

## Operating Context
- El pedido se arma en el sitio y se confirma por WhatsApp antes de despachar; se paga al repartidor.
- Logística vía Dropi; plazos por zona en `datos/tienda.json`.
- El sitio es estático, generado por `herramientas/construir_sitio.py` desde `datos/`; se publica en GitHub Pages en cada push.

## Capabilities and Constraints
- 19 kits activos (máximo 20). Baño y Secado siempre primero en la vitrina.
- Cantidad 1 o 2 en la ficha; el descuento por 2 solo se muestra discreto en el total.
- Pendiente del dueño: razón social, RUT, domicilio y correo (null); decisión de despacho incluido o aparte; verificación Dropi de los kits.

## Brand Commitments
- Nombre: Kuchiwau. Logo con isotipo de huella; azul de marca #24316B y acento mandarina.
- Personalidad (dueño, 2026-10-06): **alegre y moderna**.
- Referencia binding (dueño, 2026-10-06): **retail grande chileno tipo Falabella / Paris** — familiar para el cliente, grilla de productos clara, precio protagonista, navegación directa.
- El dueño pidió cambiar el fondo crema y la tipografía Fraunces (marcadas como típicas de IA por el detector).
- Tono de textos: cercano, práctico, sobrio, en español de Chile; sin mayúsculas gritonas.
- Rechazado por el dueño: animaciones exageradas; colores saturados "de PowerPoint"; píldoras y redondeos genéricos; "2 por $X" llamativo; teléfono para llamar; WhatsApp repetido (solo formulario, contacto y una línea en el pie); rótulos sobre los títulos; tarjetas iguales de ícono+título+texto.
- Le gustó: imágenes cuadradas; el azul de marca como color característico; imágenes de ambiente profesionales.

## Evidence on Hand
- Fotos de producto: referenciales (generadas), marcadas "Foto referencial" hasta tener fotos reales (`datos/guia_fotos.md`).
- Imágenes de ambiente: `herramientas/plantilla/img/ambiente-*.jpg` (Canva, entregadas por el dueño).
- No hay reseñas, testimonios, cifras de ventas ni sellos: no se inventan.

## Product Principles
1. La confianza vende: pago al recibir, plazos reales y datos honestos visibles antes de pedir.
2. Cada kit se entiende en segundos: qué resuelve, qué trae, cuánto cuesta.
3. Nada inventado: sin reseñas, escasez, precios de referencia ni afirmaciones de salud.
4. Móvil primero: el cliente llega desde el celular.
5. Un mensaje, un lugar: no repetir envío, pago o contacto.

## Accessibility & Inclusion
Contraste AA mínimo, foco visible, textos funcionales ≥ 11 px, `prefers-reduced-motion` respetado, contenido visible sin JavaScript.
