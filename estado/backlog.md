# Backlog del turno autónomo

Cada sesión del turno toma la **primera tarea `[ ]`** (o dos si son cortas), la marca `[x]` con fecha y archivo de salida al terminar, y puede **agregar tareas nuevas** al final de la sección que corresponda si su trabajo las descubre.
Tareas que requieren al dueño van en "Bloqueadas (portón humano)": nunca se ejecutan, se saltan.

## Prioridad 0 — Lanzamiento (pasos del dueño en `LANZAMIENTO.md`)
- [x] (2026-10-04) → `marca/redes/` · **Kit de perfil para redes:** exportar el isotipo a PNG 1080x1080 (foto de perfil, se ve bien en círculo a 110 px) y 5 portadas de destacados (Kits, Cómo comprar, Envíos, Cambios, Preguntas) en la paleta de marca. → `marca/redes/`
- [ ] **Grilla inicial de Instagram (9 piezas 1080x1350):** usar fotos existentes de `herramientas/plantilla/img/` + textos de `investigacion/lanzamiento-instagram-meta.md`; pie de foto listo para copiar en `marca/redes/grilla.md`. Sin reseñas, escasez ni afirmaciones de salud.
- [ ] **Política de privacidad para la Ley 21.719 (vigente 1-dic-2026):** revisar `privacidad.html` contra el contenido sugerido en `investigacion/lanzamiento-legal.md`; datos del dueño como pendientes.
- [x] (2026-10-04) → `datos/plantillas_whatsapp.md` · **Plantillas WhatsApp Business:** pasar las 4 plantillas de `investigacion/lanzamiento-instagram-meta.md` a `datos/plantillas_whatsapp.md` junto con la confirmación de pedido (cierra la tarea de P3).

## Prioridad 1 — Conocer el mercado y el negocio
- [x] (2026-10-04) → `investigacion/mercado-mascotas-chile.md` · **Mercado objetivo Chile (mascotas):** tamaño del mercado, % de hogares con perros/gatos, gasto promedio, crecimiento, canales de compra online, estacionalidad, regiones. Fuentes con URL. → `investigacion/mercado-mascotas-chile.md`
- [x] (2026-10-04) → `investigacion/competencia-precios.md` · **Competencia real con precios:** leer Mercado Libre Chile, Falabella, Paris y tiendas de mascotas online (Petco, SuperZoo, Club de Perros y Gatos u otras) para los componentes de nuestros kits: precio mínimo/mediano/máximo, envío, reseñas, cómo se presentan. Actualizar `evidencia` en `datos/candidatos.json` sin inventar. → `investigacion/competencia-precios.md`
- [x] (2026-10-04) → `investigacion/cliente-objeciones.md` · **Cliente ideal (buyer persona) y objeciones:** a partir de reseñas y preguntas públicas de compradores en Mercado Libre/Falabella: dolores, palabras que usan, objeciones, motivos de devolución. → `investigacion/cliente-objeciones.md`
- [x] (2026-10-04) → `investigacion/playbook-referentes.md` · **Referentes mundiales:** cómo venden online los mejores (marcas DTC de mascotas como Chewy, BarkBox, Wild One, Fable; operadores de contra entrega LATAM; guías de conversión de Baymard Institute; marcos de oferta tipo "Grand Slam Offer"; estrategia creativa en Meta). Extraer solo lo aplicable a nuestra tienda, con fuente, y convertirlo en tareas concretas al final de este backlog. → `investigacion/playbook-referentes.md`
- [x] (2026-10-04) → `investigacion/estacionalidad-trends.md` · **Estacionalidad con Google Trends CL:** descargar curvas semanales 5 años de "cepillo para perros", "cama refrescante perro", "fuente de agua gatos" y confirmar las ventanas del calendario. → `investigacion/estacionalidad-trends.md`

## Prioridad 2 — Más productos rentables
- [x] (2026-10-04) → `datos/catalogo.json` · **Ciclo 2 de productos:** 8–10 candidatos nuevos del nicho (con Google Trends Chile, más vendidos de Mercado Libre, tendencias de TikTok), correr `economia.py` y `puntaje.py`, y pasar por el validador. Mantener máximo 2 activos; los demás que pasen el portón quedan `en_observacion` con su ficha lista para reemplazo.
- [x] (2026-10-04) → `investigacion/recompra-fuente-gatos.md` + `herramientas/ltv.py` · **Segundo producto con recompra:** evaluar a fondo fuente de agua para gatos + filtros de repuesto (modelo de suscripción/recompra), con economía de vida del cliente (LTV) y no solo del primer pedido.
- [x] (2026-10-04) → `investigacion/plan-financiero.md` + `herramientas/finanzas.py` · **Análisis financiero:** presupuesto de test, punto de equilibrio, flujo de caja a 30/60/90 días con supuestos explícitos y sensibilidad a la tasa de entrega y al CPA. → `investigacion/plan-financiero.md`
- [ ] **Revalidar precio de Kit Pelo Cero (validador) — avance 2026-10-04: se mantiene $26.990; bajar a $24.990 solo si Dropi confirma cepillo+removedor ≤ $8.000; alternativa: Kit Gato Sin Pelusas en observación como reemplazo:** con la competencia leída (cepillo a vapor mediana $7.445 en Falabella), evaluar bajar a $22.990-$24.990 o sumar una tercera pieza barata; recalcular economía. Requiere costo real para decidir el precio final.

## Prioridad 3 — Tienda que convierte y genera confianza
- [x] (2026-10-04) → `investigacion/auditoria-conversion.md` · **Auditoría de conversión** de `sitio/` contra las guías de Baymard (página de producto, formulario, confianza, móvil), con lista priorizada de cambios; implementar los de bajo riesgo en `herramientas/construir_sitio.py` y la plantilla. Verificar en Chromium (móvil y escritorio) antes del commit.
- [ ] **Página "Nosotros" honesta** (quiénes somos, cómo elegimos los kits, cómo funciona el servicio) sin inventar historia, cifras ni testimonios.
- [ ] **Guía de tallas** para la alfombra (qué talla según peso/tamaño del perro) y especificaciones claras; marcar como "por confirmar con proveedor" lo no verificado.
- [ ] **SEO de contenido (publicar "Verano con tu perro" antes del 15-nov, ver `investigacion/estacionalidad-trends.md`):** 2 guías útiles en `sitio/guias/` (por ejemplo "Cómo reducir el pelo de tu mascota en casa" y "Verano con tu perro: guía práctica para Chile"), sin afirmaciones de salud, con enlaces internos a los kits y datos estructurados de artículo.
- [ ] **FAQ y copy desde objeciones reales (creador-tienda):** agregar a las fichas "¿Qué tamaño tiene?" (cm), "¿Cómo se carga y cuánto dura?" (por confirmar con proveedor) y "¿Qué talla elijo?"; describir el vapor como bruma fina sin sobreprometer. Fuente: `investigacion/cliente-objeciones.md`.
- [x] (2026-10-04) → `datos/plantillas_whatsapp.md` · **Plantilla de confirmación por WhatsApp (borrador, no enviar):** producto, foto, total a pagar al recibir, fecha estimada y cómo reprogramar. → `datos/plantillas_whatsapp.md`
- [ ] **Oferta por kit con la ecuación de valor (Hormozi):** resultado, probabilidad (guía, cambio, pago al recibir), demora (plazo visible), esfuerzo; bonos de bajo costo (guía PDF). Sin escasez ni testimonios inventados. → `datos/ofertas.md`
- [x] (2026-10-04) → plazo junto al precio + enlaces a cambios/privacidad · **Plazo de entrega y resumen de cambios junto al botón de pedido** (Baymard: envío lento 21 % y devoluciones 15 % de abandonos); plazos "por confirmar con Dropi".
- [ ] **Página de gracias con upsell de un clic** del complemento (sacarlo del formulario previo si baja fricción).
- [x] (2026-10-04) → formulario de producto · **Consentimiento expreso para recordatorios por WhatsApp** (Ley 21.719, vigente 1-dic-2026): casilla opcional, desmarcada, en el formulario.
- [ ] **Rendimiento:** medir peso total por página y tiempos con Chromium; bajar lo que sobre (fuentes, imágenes, CSS no usado).
- [ ] **Evento del píxel:** cambiar `Purchase` al abrir WhatsApp por `Lead`, y `Purchase` solo con pedido confirmado (CAPI) cuando exista el píxel. Ver `investigacion/auditoria-conversion.md`.

## Prioridad 4 — Adquisición
- [ ] **Calendario de contenido orgánico de 30 días** (Reels/TikTok) con guiones, ganchos y textos, alineado con `datos/plan_ads.json`. → `datos/contenido_organico.md`
- [ ] **Creativos para anuncios:** 4-5 conceptos realmente distintos por kit (persona × ángulo × formato, ver `investigacion/playbook-referentes.md`), cada uno con 2-3 ganchos (texto en pantalla, primera línea del texto), cumpliendo políticas de Meta. Actualizar `datos/plan_ads.json`.
- [x] (2026-10-04) → `LANZAMIENTO.md` · **Plan de lanzamiento consolidado para el dueño:** checklist día a día de los primeros 14 días, con lo que hace él y lo que hace el sistema. → `investigacion/plan-lanzamiento.md`

## Cierre de cada turno
- [ ] (recurrente) Actualizar `estado/informe-manana.md` con lo hecho en la noche, hallazgos clave y decisiones que necesitan al dueño, en ≤ 25 líneas.

## Bloqueadas (portón humano) — no ejecutar
- Guía completa y ordenada de todo lo que hace el dueño (marca, SII, INAPI, dominio, Dropi, Shopify, pagos, Instagram, anuncios): `LANZAMIENTO.md`.
- Registrar kuchiwau.cl (y kuchiguau.cl, cuchiguau.cl para redirigir) y solicitar la marca "Kuchiwau" en INAPI (clases 35, 18, 21, 28). Kimo descartado: registrado por Puratos S.A.
- Datos legales en `datos/tienda.json` (correo, dirección, razón social, RUT). WhatsApp listo el 2026-10-04.
- Verificación de calidad en Dropi de los 19 kits: completar `datos/verificacion_dropi.csv` (proveedor verificado/premium, mismo proveedor, muestra ≥ 4/5, costo y flete reales). Guía: `investigacion/guia-verificacion-dropi.md`.
- Aprobación de presupuesto de anuncios y creación de campañas.
- Plan pagado de Shopify e importación del CSV.
- Fotos reales del producto (requiere muestra física).
- Verificar en Dropi comisión por pedido, flete de devolución y días de liquidación (mueven el CPA de equilibrio ~$1.700). Preguntas a soporte en `investigacion/dropi-facturacion.md` (quién factura flete/comisión/producto).
- Confirmar en Dropi fuente + filtros compatibles del mismo proveedor (sin eso no hay recompra).
- Precios de Mercado Libre Chile: la búsqueda pide verificación anti-bots y la API exige credenciales (revisar a mano o con la cuenta del dueño).
