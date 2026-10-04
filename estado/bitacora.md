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
