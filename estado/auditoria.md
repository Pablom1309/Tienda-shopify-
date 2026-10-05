# Auditoría Ronda 12 — Diseño en Sitio (2026-10-05)

Verificador: `python3 herramientas/verificar.py` → OK

## Resultado: AVISO

Ronda 12 implementa correctamente fichas rediseñadas (galería cuadrada con doble marco, bloque de compra con fila de confianza "Pagas al recibir" + plazo, cantidad 1/2, "Qué incluye" con íconos, preguntas, "Otros kits"). Sin embargo, `sitio/estilos.css` mantiene `border-radius: 999px` (píldoras) que contradice regla explícita del buzón 2026-10-05.

## Avisos detectados

### AVISO: Formas redondeadas genéricas (píldoras) contradicen regla del buzón

**Archivo:** `sitio/estilos.css`  
**Líneas/Reglas:**
1. `.boton { border-radius: 999px }` — botones con píldoras
2. `.etiqueta { border-radius: 999px }` — etiquetas con píldoras  
3. `.foto figcaption { border-radius: 999px }` — figcaption con píldoras
4. `.chip { border-radius: 999px }` — chips con píldoras
5. `.insignia { border-radius: 999px }` — insignias con píldoras

**Regla buzón incumplida:** "2026-10-05: El dueño no quiere formas redondeadas genéricas (píldoras, tarjetas muy redondeadas): lenguaje de formas más sobrio y editorial, como tiendas grandes."

**Impacto:** Paleta de diseño contradice directiva explícita. Fueron introducidas en ronda 10 (commit 818f0e4) y se mantienen en ronda 12 sin corrección.

**Recomendación:** Cambiar `border-radius: 999px` a `var(--radio)` (6px) o eliminar redondeamiento extremo.

## Verificaciones CORRECTAS

✓ **Textos legales sin cambios de contenido:** despacho.html, cambios.html, privacidad.html (solo marcado/clases varias)  
✓ **Precios coherentes:** 19 fichas con precios consistentes (shopify/productos.csv ↔ sitio HTML ↔ datos/fichas.json)  
✓ **Totales por cantidad correctos:** descuentos aplicados correctamente ($X × 2 − ahorro = total 2 unidades)  
✓ **"Qué incluye" coincide:** íconos + lista literales de fichas.json  
✓ **Plazos correctos:** RM 2-4 días, regiones 3-7 días (datos/tienda.json)  
✓ **Sin reseñas inventadas:** "Reseñas reales, pronto. Solo publicamos opiniones de clientes que recibieron su pedido."  
✓ **Sin escasez, salud, testimonios:** búsqueda negativa (sin "cura", "sana", "previene", "alivia")  
✓ **Contenido visible sin JS:** grilla completa sin paginación, FAQ con `<details>` nativo  
✓ **pedido.js → fbq Lead:** línea 236 dispara `window.fbq('track', 'Lead', {...})` en cada compra  
✓ **Galería cuadrada + doble marco:** `<div class="galeria"><div class="marco">` implementado  
✓ **Bloque de compra + fila de confianza:** `<ul class="clave">` con "Pagas al recibir" + "Llega en X días"  
✓ **Cantidad 1/2:** radio buttons con precios y ahorros `data-ahorro` correctos  
✓ **Retracto 10 días + garantía 6 meses:** presentes en cambios.html  
✓ **"2 por $X" no prominente:** oferta discreta en controles, no en tarjeta  

## Portones humanos (verificador, no bloqueadores)

- `datos/tienda.json` → correo (null)
- `datos/tienda.json` → direccion_comercial (null)
- `datos/tienda.json` → razon_social (null)
- `datos/tienda.json` → rut (null)
- 19/19 kits sin verificar en Dropi (requiere costo real, proveedor verificado antes de pautar)

## Conclusión

**Ronda 12 lista**, salvo por aviso de diseño (border-radius: 999px). Funcionalidad y contenido verificados sin errores. Se sugiere corrección de formas redondeadas antes de lanzamiento a producción (contradicen criterio explícito de diseño corporativo sobrio).

---

**Resultado: AVISO — Ronda 12 funcional, requiere revisión de diseño**

Auditor: nodo `auditor` (grafo/pipeline.yaml)  
Fecha: 2026-10-05 UTC

### Revisión del orquestador — ronda 12 (2026-10-05)
- AVISO de píldoras (border-radius 999px) descartado: medido en Chromium, ningún elemento visible de portada, ficha ni contacto tiene radio calculado ≥ 20 px; las reglas 999px quedan anuladas por los bloques finales de estilos.css. Tarea para diseño: limpiar CSS muerto.
