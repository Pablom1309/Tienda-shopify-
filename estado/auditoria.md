# Auditoría Ronda 9 (2026-10-05)

Auditoría de ronda 9: diseño sobrio paleta A (fondo #F7F5F1, tinta #1A1A1A, acento #A4503A), hero tipográfico sin imagen destacada, fotos de tarjetas y fichas marcadas "Foto referencial", WhatsApp y Comprar en tinta/acento, og:image del hero quitado de portada.

## Resultado: OK

### Verificaciones completadas

1. **python3 herramientas/verificar.py**
   - Salida: código 0 (sin errores)
   - Avisos: portones humanos en tienda.json; 19/19 kits sin verificar en Dropi
   - Sin bloqueos del guardián ✓

2. **Cumplimiento regla buzón 2026-10-05**
   - Movimiento casi nulo: datos/fichas.json generado 2026-10-04, sitio/ actualizado 2026-10-05 18:27 ✓
   - Paleta A sobria: fondo #F7F5F1, tinta #1A1A1A, acento arcilla #A4503A (estilos.css línea 26) ✓
   - Sin imágenes IA destacadas: todas marcadas "Foto referencial" (sitio/productos/ y sitio/index.html línea 42, 77-78) ✓

3. **og:image (portada vs productos)**
   - sitio/index.html: NO tiene meta og:image (quitado intencional, ronda 9) ✓
   - sitio/productos/kit-pelo-cero-...: SÍ tienen og:image (línea 13) ✓
   - og:image en fichas: válido, apunta a img/kit-*.jpg existentes ✓

4. **Retracto y Garantía presentes**
   - Portada (index.html): anuncio barra con "Garantía legal 6 meses" ✓
   - cambios.html: "Derecho a retracto" (10 días) y "Garantía legal" (6 meses) presente (línea 36-38) ✓
   - Schema JSON en fichas: merchantReturnDays 10, garantía 6 meses (línea 27, sitio/productos/) ✓

5. **Contenido visible sin JS**
   - Tarjetas en grilla: sin hidden por defecto, .hidden solo con `[hidden]` attribute de JS ✓
   - Formulario: campos estáticos, inputs sin display:none ✓
   - Precios sin JS: $26.990 (línea 43 ficha) visible en plain text ✓

6. **Precios coherentes (ronda 8 base)**
   - Portada (index.html): kit-pelo-cero $26.990 (línea 43) ✓
   - Ficha (kit-pelo-cero-...): precio $26.990 (línea 43) ✓
   - shopify/productos.csv: kit-pelo-cero 26990 ✓
   - Cantidad 1: $26.990 (data-precio, línea 48) ✓
   - Cantidad 2: $47.990 (ahorro $5.990, línea 48) = 26.990 + (26.990−5.990) ✓
   - Total con complemento: $26.990 + $6.990 = $33.980 (pedido.js cálculo correcto) ✓

7. **pedido.js dispara Lead**
   - Línea 234: `if (window.fbq) { window.fbq('track', 'Lead', { value: total(), currency: 'CLP', content_name: f.dataset.producto }); }` ✓
   - Enviado al abrir WhatsApp (intención de compra, no Purchase) ✓

8. **Sin reseñas, escasez, salud, datos inventados**
   - Portada: sin reseñas/testimonios, "Reseñas reales, pronto" (sitio/productos/ línea 75) ✓
   - Fichas: sin "Escasez", "¡Últimas 2 unidades!", "Sold out" simulado ✓
   - Palabras de salud/cura: búsqueda negativa → sin coincidencias ✓
   - Contadores/visitas inventados: sin "visto X veces", "comprado Y hoy" ✓
   - Precios de referencia fake: sin "antes $X, ahora $Y" (solo "Ahorras $X" si elige cantidad 2) ✓
   - Especificaciones pendientes: marcadas explícitamente en fichas.json, no inventadas ✓

9. **Contraste y accesibilidad AA**
   - Texto principal (#1A1A1A) sobre fondo (#F7F5F1): contraste ~13:1 ✓ WCAG AAA
   - Botón acento (#A4503A) sobre fondo (#F7F5F1): contraste ~4.5:1 ✓ WCAG AA (borderline)
   - Botón "Comprar" en tinta (#1A1A1A): contraste ~13:1 ✓ WCAG AAA
   - Links: color var(--primario) con text-underline-offset 3px ✓

10. **Hero sin imagen destacada**
    - sitio/index.html: hero con background radial-gradient + var(--suave), sin `<img>` principal (estilos.css .hero) ✓
    - Tipografía: h1 "Menos pelo en tu casa. Más frescura para tu mascota." ✓

### Avisos (portones humanos, no bloqueos)

- tienda.json: correo, direccion_comercial, razon_social, rut pendientes (4 campos)
- Dropi: 19/19 kits sin verificar (requiere acción manual, no pautar hasta verificación)

### Conclusión

Ronda 9 cumple especificación: paleta A sobria, movimiento mínimo, og:image intencional quitado de portada, contenido accesible y coherente, sin falsos datos ni salud.

---

**Resultado: OK — Ronda 9 aprobada**

Sin errores detectados. El diseño de ronda 9 cumple todas las especificaciones de buzón 2026-10-05:
- Paleta A sobria (fondo #F7F5F1, tinta #1A1A1A, acento #A4503A)
- Movimiento casi nulo (cambios mínimos)
- Sin imágenes IA destacadas (todas marcadas "Foto referencial")
- og:image intencional quitado de portada
- Contenido íntegro sin inventos (precios, salud, reseñas)
- Retracto 10 días y garantía 6 meses visibles

Auditor: nodo `auditor` (grafo/pipeline.yaml)
Fecha: 2026-10-05 UTC
