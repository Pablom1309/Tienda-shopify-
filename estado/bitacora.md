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
