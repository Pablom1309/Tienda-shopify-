# Auditoría de sitio — Ronda 15 (2026-10-07)

## Estado: OK

Auditoría post-regeneración tras cambios del generador (omisión de FAQ con "por confirmar con proveedor", actualización de mensaje de medidas).

---

## Verificaciones completadas

### 1. Precios coherentes ✓
- Todos los 19 kits verificados: sitio/productos/*.html (JSON-LD) ↔ shopify/productos.csv
- Coincidencia 100%: kit-bano-secado $29.990, kit-pelo-cero $26.990, kit-verano-fresco $32.990, etc.

### 2. Sin salud/cura ✓
- Búsqueda exhaustiva: "cura", "sana", "previene", "alivia", "golpe de calor", "garantizado"
- Resultado: 0 violaciones

### 3. Sin reseñas/testimonios/escasez ✓
- Búsqueda: "testimonio", "reseña", "opinión", "quedan", "últimas", "agotado"
- Resultado: 0 violaciones (las 5 coincidencias eran "Preguntas frecuentes" y "@type": "Question" en schema)

### 4. Sin precios de referencia ✓
- Búsqueda: "antes de", "precio original", "rebaja"
- Resultado: 0 violaciones

### 5. Retracto 10 días + Garantía legal 6 meses ✓
- Presente en JSON-LD MerchantReturnPolicy (merchantReturnDays: 10)
- Presente en anuncio de encabezado y cambios.html
- Presente en garantias-form (enlaces verificados)

### 6. Sin tel:/Llámanos ✓
- Búsqueda exhaustiva: "tel:", "Llámanos", "llamar"
- Resultado: 0 violaciones
- Solo WhatsApp: wa.me links y campo de teléfono WhatsApp

### 7. FAQ handling (nuevo) ✓
**Regla aplicada correctamente:**
- **Omitidas**: kit-pelo-cero (todas las FAQ contenían "por confirmar con proveedor")
- **Incluidas**: 18 productos con FAQPage JSON-LD (solo FAQ sin "por confirmar" o con respuestas válidas)
- Verificación: 1 sin FAQPage (Pelo Cero), 18 con FAQPage

### 8. Medidas: WhatsApp confirmation (nuevo) ✓
- Reemplazo verificado: "medidas exactas" → "Las medidas del kit te las confirmamos por WhatsApp antes de despachar"
- Presente en: 19 productos (nota-chica o FAQ de tamaño)
- Ejemplo kit-pelo-cero línea 71: "Medidas y materiales: te los confirmamos por WhatsApp antes de despachar."

### 9. JSON-LD válido ✓
- Organization schema: presente
- Product schema: presente (todas las 19 fichas)
- Offer schema: presente con priceCurrency, price, availability, MerchantReturnPolicy
- BreadcrumbList schema: presente (todas las fichas)
- FAQPage schema: presente en 18 fichas (omitida Pelo Cero, como esperado)
- Estructura válida JSON: verificada

---

## Portones humanos pendientes (datos/tienda.json = null)

- correo
- direccion_comercial
- razon_social
- rut

---

## Avisos calidad Dropi

- **19/19 kits sin verificar en Dropi** (proveedor verificado/premium, mismo proveedor, muestra ≥ 4/5, costo real)
- **NO PAUTAR** hasta verificación de costo real y detalles de producto con proveedor

---

## Conclusión

**Sitio regenerado aprobado.** Cambios del generador (FAQ omisiones, actualización de mensaje de medidas) implementados correctamente. Todas las reglas fijas verificadas y cumplidas. Listo para ciclo siguiente.

---

**Resultado final: OK — Sin correcciones requeridas**

Auditor: nodo `auditor` (grafo/pipeline.yaml)  
Fecha: 2026-10-07 UTC  
Verificador: `python3 herramientas/verificar.py` → OK (portones humanos pendientes; kits sin verificar en Dropi)
