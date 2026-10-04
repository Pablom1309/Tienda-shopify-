# Bitácora del orquestador

Cada ciclo agrega una entrada al final: fecha, nodos ejecutados, decisiones del portón, pendientes humanos.

## Ciclo 1 — 2026-10-04

- **Nodos ejecutados:** investigador-mercado → cazador-productos → economia → puntaje → validador (reintento 1) → cazador-productos → economia → puntaje → validador → creador-tienda ‖ estratega-ads → construir-sitio → auditor.
- **Portón, iteración 0:** 11 candidatos, 0 aprobados. Causa común: ROAS de equilibrio > 4 a precio unitario; el flete fijo ($3.500-$4.500) se come tickets de $13.000-$23.000.
- **Corrección (arista de reintento):** se modeló la oferta de 2 unidades (30 % de los pedidos) y se propusieron kits. Pasan **Kit Pelo Cero** (puntaje 4,17; ROAS eq. 3,73; CPA eq. $6.908) y **Kit Verano Fresco** (4,01; 3,74; $8.514).
- **Descartados:** lifting de pestañas y masajeador cervical (política/regulación), localizador, ventilador, aspiradora, luces solares, removedor suelto.
- **Sitio:** generado en `sitio/` con formulario contra entrega por WhatsApp; CSV para Shopify en `shopify/productos.csv` (en borrador).
- **Publicado:** https://pablom1309.github.io/Tienda-shopify-/ (GitHub Pages, despliegue automático desde la rama).
- **Pendiente humano (bloquea ventas):** cuenta Dropi CL validada, costos reales de los 4 componentes y que un mismo proveedor despache cada kit, WhatsApp de atención, datos legales de contacto.

## Turno 2026-10-04 03:00 UTC — mercado objetivo
- Tarea: mercado de mascotas Chile → `investigacion/mercado-mascotas-chile.md` (CNC/INE, Kantar, censo UC, CCS; con URL).
- Hallazgos: 70 % de hogares con perro o gato; gasto $60.100/mes; accesorios sube a 7,8 % del gasto; ecommerce mascotas US$650-670 M en 2026; conversión de referencia 1,72 %.
- Decisión: no pautar en CyberMonday (5-7 oct) ni Black Friday (27-30 nov); separar anuncios familias con perro vs dueños de gato.
- Nueva tarea: estacionalidad con Google Trends CL. Sin bloqueos del guardián.

## Turno 2026-10-04 03:55 UTC — competencia con precios
- Tarea: precios de Falabella y Paris para los 4 componentes y la fuente de gatos → `investigacion/competencia-precios.md` (+ datos crudos en `investigacion/datos-competencia/`); evidencia actualizada en `datos/candidatos.json`.
- Hallazgo: cepillo a vapor mediana $7.445 (Falabella), con reseñas desde $4.990; manta refrescante mediana ~$14.500; Kit Pelo Cero cobra +55 % sobre la suma de piezas, Kit Verano +41 %.
- Decisión: no se toca el catálogo; nueva tarea para que el validador revalúe el precio de Kit Pelo Cero.
- Bloqueo: Mercado Libre CL (anti-bots y API 403) → anotado en Bloqueadas.

## Turno 2026-10-04 04:55 UTC — cliente ideal y objeciones
- Tarea: reseñas públicas de 9 productos en Falabella (45 reseñas, ~25 con texto) → `investigacion/cliente-objeciones.md` (+ `datos-competencia/resenas_falabella.json`).
- Hallazgos: quejas por tamaño vs foto, vapor que "casi no se nota", falta de instructivo de carga, deshilachado; fuente de gatos: filtros/hongos y bomba. Lenguaje: "regalón/a", "pelo muerto".
- Dos públicos: familia con perro (principal) y dueño/a de gato en hogar pequeño.
- Nuevas tareas: FAQ/copy desde objeciones y plantilla de confirmación por WhatsApp. Mercado Libre sigue bloqueado.

## Turno 2026-10-04 05:55 UTC — referentes mundiales
- Tarea: Chewy (Autoship 83,3 % de ventas FY2025), Wild One/Fable (kits con 15-20 % de descuento), Baymard (abandono: costos extra 39 %, envío lento 21 %), Hormozi (ecuación de valor), Meta Andromeda (diversidad creativa) y operadores COD → `investigacion/playbook-referentes.md`.
- Decisión: creativos pasan de "10 ganchos" a 4-5 conceptos distintos por kit.
- Nuevas tareas P3: oferta por kit, plazo y cambios junto al botón, página de gracias con upsell, consentimiento WhatsApp (Ley 21.719).

## Turno 2026-10-04 06:55 UTC — estacionalidad Google Trends
- Tarea: 10 años mensuales + 5 años semanales de Google Trends CL (7+6 términos) → `investigacion/estacionalidad-trends.md`.
- Hallazgos: verano concentrado (manta refrescante dic ×4,9, ene ×3,3); pelo/cepillado parejo todo el año; cepillo gato pico en oct; fuente para gatos estable.
- Decisión: Kit Verano del 16-nov al 31-ene; guía SEO de verano antes del 15-nov (agregado al calendario).
- Bloqueo menor: Google Trends devolvió 429 en la comparación de volumen entre términos; queda pendiente.

## Ciclo 2 — 2026-10-04 — validador (portón de productos)
- **Entrada:** 7 kits nuevos pasan el portón duro (gato sin pelusas 4,13; enriquecimiento perro 4,04; piscina 3,92; paseo limpio 3,85; baño y secado 3,83; gato hidratación 3,62; gato juego 3,51). Sin resultados reales (`estado/decisiones.md` no existe).
- **Activos sin cambio (2/2):** Kit Pelo Cero (principal) y Kit Verano Fresco (temporada 16-nov a 31-ene). No se reemplaza Pelo Cero: todos los costos son estimados y es el único con ficha, sitio y CSV listos.
- **Precio Pelo Cero:** se mantiene $26.990. Bajar a $24.990 solo si Dropi confirma cepillo + removedor ≤ $8.000 (con el supuesto de $9.700 el ROAS eq. mezcla sube a ~4,1 y no pasa). Alternativa: 3.ª pieza barata sin bajar precio.
- **En observación (con condiciones y criterios):** 1) kit-gato-sin-pelusas = reemplazo preferente de Pelo Cero (prima +8 % vs +55 %, ROAS eq. 3,26), no en paralelo; 2) kit-enriquecimiento-perro = principal post-verano, sin lenguaje de ansiedad; 3) piscina = solo sustituto de Kit Verano (canibaliza, voluminosa); 4-7) paseo limpio, baño y secado, gato hidratación (ROAS 3,91, frágil), gato juego (voluminoso).
- **Descartados:** fuente-agua-gatos (reemplazada por kit con filtros), kit-bienvenida-cachorro (puntaje 3,36).
- **Pendiente humano:** costos reales y flete en Dropi CL de Pelo Cero y del kit de gatos para decidir precio o reemplazo.

## Turno 2026-10-04 07:55 UTC — ciclo 2 de productos (orquestador)
- Nodos: cazador-productos (sonnet) → economia → puntaje → validador (opus). 8 nuevos, 7 pasan el filtro determinista; medianas de Falabella medidas por el orquestador (el cazador no tiene Bash).
- Portón: activos sin cambio; 7 en observación con prioridad (Kit Gato Sin Pelusas primero); 2 descartados.

## Turno 2026-10-04 08:55 UTC — segundo producto con recompra
- Tarea: LTV de kit hidratación gatos + filtros → `investigacion/recompra-fuente-gatos.md`; nodo determinista nuevo `ltv` (`herramientas/ltv.py`, `datos/ltv.json`, bloque `recompra` en supuestos).
- Resultado: G por recompra $5.209; LTV base $12.260 (+13 %); ROAS eq. 3,91 → 3,47.
- Decisión: sigue en observación; requisito: filtros compatibles del mismo proveedor en Dropi + WhatsApp con consentimiento.

## Turno 2026-10-04 09:55 UTC — plan financiero
- Tarea: equilibrio, sensibilidad (entrega × CPA × comisión/devolución) y caja diaria a 90 días → `investigacion/plan-financiero.md`; nodo determinista nuevo `finanzas` (`herramientas/finanzas.py`, `datos/finanzas.json`, bloque `finanzas` en supuestos).
- Resultado: capital de trabajo necesario $270.000-$400.000; pérdida máxima si nada funciona ~$180.000; CPA de equilibrio Pelo Cero $8.925 ($7.262 con comisión + devolución).
- Se omitió "Revalidar precio Pelo Cero": depende de costo real (portón humano).

## Turno 2026-10-04 10:55 UTC — auditoría de conversión
- Tarea: auditoría vs Baymard y objeciones → `investigacion/auditoria-conversion.md`.
- Implementado (plantilla + construir_sitio.py): plazo junto al precio, retracto/privacidad enlazados, consentimiento WhatsApp opcional (cierra 2 tareas P3).
- Chromium 390/1366 px: sin scroll horizontal; solo error de Google Fonts por certificado del proxy del entorno.
- Nueva tarea: corregir evento del píxel (Purchase → Lead).

## 2026-10-04 ~11:30 UTC — instrucción directa del dueño: más productos en la tienda
- Límite de activos 2 → 6 (`max_activos` en supuestos; verificar.py y validador.md lo leen).
- Activados desde observación: kit-gato-sin-pelusas, kit-enriquecimiento-perro, kit-paseo-hogar-limpio, kit-bano-secado-perro (piscina no: canibaliza Kit Verano). Fichas por creador-tienda; sitio con 6 kits.
- Costos siguen estimados: verificar todos en Dropi antes de pautar.

## 2026-10-04 ~11:45 UTC — pedido del dueño: logo y foto repetida
- Logo nuevo (isotipo de huella con estrella de la Cruz del Sur + nombre en minúsculas convertido a trazos) en `marca/`; integrado en cabecera, pie y favicon.
- Kit Pelo Cero tenía una foto de gato cepillado, igual que Kit Gato Sin Pelusas: se cambió a perro con cepillo a vapor y se reposicionó el kit para perros (rol, subtítulo, título SEO y texto alternativo de la imagen).

## 2026-10-04 ~12:00 UTC — pedido del dueño: nombre nuevo
- La marca pasa de "Huella Sur" a **Kimo** (elegido por el dueño entre 4 opciones con .cl libre en nic.cl). Cambiado en marca.json, fichas, plantilla, CLAUDE.md, README, SKU (KM-) y logo (`marca/`).
- Pendiente humano: registrar kimo.cl y buscar "Kimo" en INAPI antes de invertir.

## 2026-10-04 ~12:30 UTC — pedido del dueño: paleta nueva y fotos completas
- Paleta "tinta y mandarina" (`investigacion/paleta-colores.md`, contrastes WCAG AA): marca.json, CSS y logo actualizados.
- Fotos: las tarjetas recortaban a 4:3 y cortaban las piezas; ahora tarjetas y ficha en 4:5 con la foto completa. Foto de contenido (catálogo, todas las piezas) en "Qué incluye" para Pelo Cero y Verano; Canva sin créditos y el dueño detuvo su uso para los demás.

## Ciclo 3 — 2026-10-04 (ciclo diario)
- Nodos: economia, ltv, finanzas, puntaje (código) → estratega-ads (sonnet) → auditor (haiku) → construir-sitio. Resto vigente (TTL 7 días, corrieron hoy).
- estratega-ads: plan_ads.json con 6 kits y orden de lanzamiento (máx. 2 en pauta): Gato Sin Pelusas + Pelo Cero primero ($178.000 de test), Baño y Secado 26-oct, Verano 16-nov, Enriquecimiento 1-dic, Paseo en enero. requiere_aprobacion: true.
- auditor (`estado/auditoria.md`): sin problemas en precios, salud, testimonios ni restos de "Huella Sur"; alta = datos legales/WhatsApp pendientes (portón humano); media = ángulos "regalo para quien vive con un perro/gato" a revisar en Biblioteca de anuncios antes de pautar.
- Configuración: Canva permitido sin prompt en `.claude/settings.json` (pedido del dueño).

## 2026-10-04 ~13:00 UTC — dueño entregó WhatsApp
- `datos/tienda.json` → whatsapp 56979814797. Formulario probado en Chromium: abre wa.me con el pedido completo. La tienda ya puede recibir pedidos por WhatsApp.
- Siguen pendientes: correo, dirección comercial, razón social y RUT.

## 2026-10-04 ~14:00 UTC — nombre definitivo: Kuchiwau
- Kimo descartado: KIMO registrado en INAPI por Puratos S.A. (clases 1 y 30), detectado por el dueño. Lección: verificar INAPI (lo hace el dueño; INAPI no es accesible desde el entorno) antes de proponer nombres.
- Nuevo nombre **Kuchiwau** (idea del dueño; "cuchi cuchi" + "wau"). Dueño verificó en INAPI que no hay marcas "Kuchi"; kuchiwau.cl libre. Cambiado en marca, fichas, plan de anuncios, plantilla, logo (estrella como punto de la i), SKU KW-.
- 2026-10-04 ~14:15 UTC: por pedido del dueño, Kit Baño y Secado primero en la portada (`orden_vitrina` en datos/tienda.json).
- 2026-10-04 ~14:30 UTC: pedido del dueño, quitar mensajes repetidos. Regla 'un mensaje, un lugar': barra superior = resumen de confianza; 'Cómo funciona' = pago contra entrega; 'Compra sin riesgo' = retracto y garantía; FAQ = plazos. Eliminados: sellos del hero, franja de sellos (portada y kit), pilar 'Compra sin riesgo', sello del pie, sellos bajo la foto del kit, filas repetidas de la tabla y FAQs '¿Cómo pago?'/'¿Y si no me sirve?'.

## Ciclo 3 — 2026-10-04 — validador (portón, crecimiento de catálogo a máx. 20)
- Aprobados nuevos (7): kit-caja-regalo-navidad (temporada 15-nov a ~15-dic), kit-paseo-nocturno-led, kit-juegos-interactivos-perro (juego activo, diferenciado del kit de enriquecimiento: olfato/lamer), kit-gato-arenero-limpio, kit-gato-rascador-pared, kit-cachorro-entrenamiento, piscina-plegable-perros-120 (16-nov a 28-feb; en tienda junto a Kit Verano, nunca en pauta simultánea). Total activos: 13/20.
- Campo `mascota` agregado a los 13 activos (10 perro, 3 gato): falta oferta para gatos.
- En observación: kit-gato-hidratacion-filtros (ROAS eq. 3,91 al borde), kit-gato-juego-rascado (duplica rascador de pared, peor economía y logística), kit-mordedores-cepillo-dedal (cepillo de dedal insinúa higiene bucal = salud; duplica cuerda con otros kits).
- Descartados (no pasan portón duro): kit-auto-viaje-perro, kit-comedero-elevado-ajustable, kit-descanso-cojin-lavable, kit-abrigo-invierno-perro (reevaluar en marzo), kit-orden-alimento.
- Pendiente: fichas de los 7 nuevos (creador-tienda); todos con costos estimados, verificar en Dropi antes de pautar. Próximo cazador: priorizar kits para gato o ambos.

## Ciclo 3 — 2026-10-04 (pedido del dueño: autónomo, límite 20)
- max_activos 20. cazador (sonnet): 12 candidatos; 7 pasan el filtro. validador (opus): aprueba 7 → 13 activos (10 perro, 3 gato); descarta 5; mordedores/dedal a observación (riesgo de salud bucal). creador-tienda: 7 fichas.
- Portada: filtro Todos/Perros/Gatos; etiquetas públicas cortas (`etiqueta` en catálogo) para no mostrar notas internas.
- Fotos Canva: 2 nuevas (Navidad, Paseo nocturno). Juegos y Arenero descartadas porque mostraban piezas no incluidas; Canva sin créditos para el resto → imagen provisional de marca "Foto real muy pronto".
- Próximo: buscar kits de gato/ambos para equilibrar (7 cupos libres).

## Ciclo 4 — 2026-10-04 — validador (portón, equilibrio gatos)
- Aprobados nuevos (6 de 7 cupos): kit-gato-navidad (temporada 15-nov a ~15-dic; no pautar junto a la caja de perro), kit-gato-ventana-mirador (condición: costo ≤ $11.000 y flete ≤ $4.200, ROAS eq. pesimista 4,11), kit-gato-laser-varitas (riesgo 2: clase del láser, despacho de batería y política de Meta antes de pautar), kit-gato-aseo-unas-pelo (eje uñas; no pautar con el ángulo de pelo de Sin Pelusas), kit-gato-arnes-paseo, kit-id-collar-placa (ambos; condición dura: grabado en Dropi o se descarta). Total activos: 19/20 (10 perro, 8 gato, 1 ambos).
- En observación: kit-gato-tunel-juego (duplica juego activo de gato; set equivalente a $8.990 en Paris; reemplazo del láser si este cae), kit-bandanas-fotos (superpone ángulo foto/regalo con los dos kits de Navidad; reevaluar en enero).
- Descartados (portón duro): kit-manta-viaje-premios (3,24), kit-gato-transporte-mochila (3,17).
- Cupo libre (1) reservado para kit-gato-hidratacion-filtros si el costo real en Dropi cierra. Pendiente: fichas de los 6 nuevos (creador-tienda); todos con costos estimados.

## Ciclo 4 — 2026-10-04 (orquestador)
- cazador (sonnet) 10 candidatos gato/ambos → 8 pasan → validador (opus) aprueba 6 → **19 activos** (10 perro, 8 gato, 1 ambos). creador-tienda: 6 fichas. Metas sin "Pagas al recibir/Despacho" repetidos.
- Fotos Canva: Ventana y Rascador; resto sin créditos → imagen provisional. Chromium: 19 páginas sin errores ni scroll horizontal; filtro OK.
- 2026-10-04 ~16:00 UTC: pedido del dueño, tarjetas más compactas. Grilla 2 columnas (celular) / 3 (tablet) / 4 (escritorio), foto cuadrada, solo etiqueta + nombre + precio (+ botón en pantallas ≥700 px). Sección de kits en celular: de ~9.000 px a ~3.500 px. Kits con foto primero (después de orden_vitrina).
- 2026-10-04 ~16:20 UTC: pedido del dueño, paginación del catálogo: 8 kits por página con ‹ 1 2 3 ›, compatible con el filtro Perros/Gatos (sin JS se ven todos). Probado en Chromium 390/1366.
- 2026-10-04 ~16:40 UTC: dueño pregunta por calidad en Dropi. Respuesta honesta: no verificado (requiere su cuenta). Creado control: `datos/verificacion_dropi.csv` (19 kits), `investigacion/guia-verificacion-dropi.md`, economia.py usa costos reales si existen, verificar.py avisa kits sin verificar ("NO pautar"), regla en validador.md.
