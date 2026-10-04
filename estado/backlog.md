# Backlog del turno autónomo

Cada sesión del turno toma la **primera tarea `[ ]`** (o dos si son cortas), la marca `[x]` con fecha y archivo de salida al terminar, y puede **agregar tareas nuevas** al final de la sección que corresponda si su trabajo las descubre.
Tareas que requieren al dueño van en "Bloqueadas (portón humano)": nunca se ejecutan, se saltan.

## Prioridad 1 — Conocer el mercado y el negocio
- [x] (2026-10-04) → `investigacion/mercado-mascotas-chile.md` · **Mercado objetivo Chile (mascotas):** tamaño del mercado, % de hogares con perros/gatos, gasto promedio, crecimiento, canales de compra online, estacionalidad, regiones. Fuentes con URL. → `investigacion/mercado-mascotas-chile.md`
- [x] (2026-10-04) → `investigacion/competencia-precios.md` · **Competencia real con precios:** leer Mercado Libre Chile, Falabella, Paris y tiendas de mascotas online (Petco, SuperZoo, Club de Perros y Gatos u otras) para los componentes de nuestros kits: precio mínimo/mediano/máximo, envío, reseñas, cómo se presentan. Actualizar `evidencia` en `datos/candidatos.json` sin inventar. → `investigacion/competencia-precios.md`
- [ ] **Cliente ideal (buyer persona) y objeciones:** a partir de reseñas y preguntas públicas de compradores en Mercado Libre/Falabella: dolores, palabras que usan, objeciones, motivos de devolución. → `investigacion/cliente-objeciones.md`
- [ ] **Referentes mundiales:** cómo venden online los mejores (marcas DTC de mascotas como Chewy, BarkBox, Wild One, Fable; operadores de contra entrega LATAM; guías de conversión de Baymard Institute; marcos de oferta tipo "Grand Slam Offer"; estrategia creativa en Meta). Extraer solo lo aplicable a nuestra tienda, con fuente, y convertirlo en tareas concretas al final de este backlog. → `investigacion/playbook-referentes.md`
- [ ] **Estacionalidad con Google Trends CL:** descargar curvas semanales 5 años de "cepillo para perros", "cama refrescante perro", "fuente de agua gatos" y confirmar las ventanas del calendario. → `investigacion/estacionalidad-trends.md`

## Prioridad 2 — Más productos rentables
- [ ] **Ciclo 2 de productos:** 8–10 candidatos nuevos del nicho (con Google Trends Chile, más vendidos de Mercado Libre, tendencias de TikTok), correr `economia.py` y `puntaje.py`, y pasar por el validador. Mantener máximo 2 activos; los demás que pasen el portón quedan `en_observacion` con su ficha lista para reemplazo.
- [ ] **Segundo producto con recompra:** evaluar a fondo fuente de agua para gatos + filtros de repuesto (modelo de suscripción/recompra), con economía de vida del cliente (LTV) y no solo del primer pedido.
- [ ] **Análisis financiero:** presupuesto de test, punto de equilibrio, flujo de caja a 30/60/90 días con supuestos explícitos y sensibilidad a la tasa de entrega y al CPA. → `investigacion/plan-financiero.md`
- [ ] **Revalidar precio de Kit Pelo Cero (validador):** con la competencia leída (cepillo a vapor mediana $7.445 en Falabella), evaluar bajar a $22.990-$24.990 o sumar una tercera pieza barata; recalcular economía. Requiere costo real para decidir el precio final.

## Prioridad 3 — Tienda que convierte y genera confianza
- [ ] **Auditoría de conversión** de `sitio/` contra las guías de Baymard (página de producto, formulario, confianza, móvil), con lista priorizada de cambios; implementar los de bajo riesgo en `herramientas/construir_sitio.py` y la plantilla. Verificar en Chromium (móvil y escritorio) antes del commit.
- [ ] **Página "Nosotros" honesta** (quiénes somos, cómo elegimos los kits, cómo funciona el servicio) sin inventar historia, cifras ni testimonios.
- [ ] **Guía de tallas** para la alfombra (qué talla según peso/tamaño del perro) y especificaciones claras; marcar como "por confirmar con proveedor" lo no verificado.
- [ ] **SEO de contenido:** 2 guías útiles en `sitio/guias/` (por ejemplo "Cómo reducir el pelo de tu mascota en casa" y "Verano con tu perro: guía práctica para Chile"), sin afirmaciones de salud, con enlaces internos a los kits y datos estructurados de artículo.
- [ ] **Rendimiento:** medir peso total por página y tiempos con Chromium; bajar lo que sobre (fuentes, imágenes, CSS no usado).

## Prioridad 4 — Adquisición
- [ ] **Calendario de contenido orgánico de 30 días** (Reels/TikTok) con guiones, ganchos y textos, alineado con `datos/plan_ads.json`. → `datos/contenido_organico.md`
- [ ] **Creativos para anuncios:** 10 variaciones de gancho por kit (texto en pantalla, primera línea del texto), cumpliendo políticas de Meta. Actualizar `datos/plan_ads.json`.
- [ ] **Plan de lanzamiento consolidado para el dueño:** checklist día a día de los primeros 14 días, con lo que hace él y lo que hace el sistema. → `investigacion/plan-lanzamiento.md`

## Cierre de cada turno
- [ ] (recurrente) Actualizar `estado/informe-manana.md` con lo hecho en la noche, hallazgos clave y decisiones que necesitan al dueño, en ≤ 25 líneas.

## Bloqueadas (portón humano) — no ejecutar
- Número de WhatsApp y datos legales en `datos/tienda.json`.
- Costos reales y proveedor en Dropi (requiere la cuenta del dueño).
- Aprobación de presupuesto de anuncios y creación de campañas.
- Plan pagado de Shopify e importación del CSV.
- Fotos reales del producto (requiere muestra física).
- Precios de Mercado Libre Chile: la búsqueda pide verificación anti-bots y la API exige credenciales (revisar a mano o con la cuenta del dueño).
