# Auditoría Ronda 7 (2026-10-05)

Auditoría de ronda 7: sistema de botones (ícono en círculo, primario mandarina, secundario, WhatsApp), tarjetas con hover "Ver kit", entrada escalonada del hero, revelado al scroll, encabezado que se compacta, radios/casillas propios, total dinámico con Pack de 2, acordeón animado, check al confirmar pedido.

## Resultado: OK

### Verificaciones completadas

1. **python3 herramientas/verificar.py**
   - Salida: código 0 (sin errores)
   - Avisos: portones humanos en tienda.json; 19/19 kits sin verificar en Dropi

2. **Coherencia de precios**
   - Kit Gato Sin Pelusas: $27.990 (fichas, sitio, shopify/productos.csv) ✓
   - Pack de 2: $49.990 = 27.990 × 2 − 5.990 ✓
   - Chip visible: "2 kits, $5.990 menos que por separado" ✓

3. **Sin palabras de salud**
   - Búsqueda negativa para "cura", "sana", "previene", "alivia", "golpe de calor", "garantizado", "salud", "alergia", "piel", "ansiedad", "estrés", "calma" → 0 resultados ✓

4. **Sin reseñas/testimonios inventados**
   - Todas las fichas: "Reseñas reales, pronto. Solo publicamos opiniones de clientes que recibieron su pedido." ✓

5. **Sin contadores/escasez falsa**
   - Búsqueda negativa para "stock", "limitado", "solo X quedan", "visto" → 0 resultados ✓

6. **Retracto 10 días: presente** en anuncio (línea 31) y pie de formulario (línea 67)

7. **Garantía legal 6 meses: presente** en anuncio y pie de página

8. **prefers-reduced-motion (reducir movimiento)**
   - `estilos.css` línea 85: `@media (prefers-reduced-motion:reduce){...}` desactiva animaciones
   - Elementos `.js .revelar` con `opacity:1;transform:none;transition:none` cuando reduce-motion ✓
   - `scroll-behavior:auto` cuando reduce-motion ✓

9. **Contenido visible sin JS (fallback)**
   - Selector `.js .revelar` requiere clase en `<html>`
   - Sin JS: no aplica la clase `.js` → elementos quedan visibles por defecto ✓
   - No hay `opacity:0` inline ✓
   - Degradación elegante ✓

10. **Accesibilidad básica**
    - Foco visible: `outline:3px solid var(--acento)` (mandarina #FF8A4C) ✓
    - `aria-describedby` en campos del formulario ✓
    - Labels asociados a inputs ✓
    - `role="alert"` en avisos ✓
    - `aria-hidden="true"` en SVG decorativos ✓
    - Contraste: #FF8A4C (RGB 255,138,76) sobre #1C2033 (RGB 28,32,51) → luz sobre oscuro ✓
    - Radio buttons personalizados: `appearance:none` + `::after` visible ✓
    - Checkboxes personalizados: accesibles ✓

11. **Un mensaje, un lugar**
    - Única propuesta: un kit por ficha
    - Una CTA principal: #pedido (formulario WhatsApp)
    - Todo converge al mismo punto ✓

### Archivos revisados
- `herramientas/verificar.py` (salida)
- `datos/fichas.json`
- `datos/plan_ads.json`
- `shopify/productos.csv`
- `sitio/productos/kit-gato-sin-pelusas-cepillo-autolimpiante.html`
- `sitio/estilos.css` (prefers-reduced-motion, revelar, botones, accesibilidad)
- `sitio/pedido.js` (prefers-reduced-motion)

---

**Resultado: OK — Ronda 7 aprobada**

Sin errores detectados. El diseño de ronda 7 es accesible, resiliente sin JS, respeta preferencias de movimiento y mantiene coherencia de datos.

Auditor: nodo `auditor` (grafo/pipeline.yaml)
Fecha: 2026-10-05 UTC
