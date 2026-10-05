# Auditoría — Cambios de Diseño (Ronda 2026-10-05)

Fecha: 2026-10-05  
Nodo: auditor  
Solicitud: Verificar cambios de diseño en sitio/ (sin commit aún)

## Resultado: OK

Todas las verificaciones de regla fija pasaron. Listo para commit.

---

## Cambios Auditados

### 1. pedido.js: Lead vs Purchase
- **Línea 156**: Dispara evento `Lead` (no `Purchase`) al abrir WhatsApp ✓
- Comentario confirma: "Abrir WhatsApp es una intención de compra (Lead), no una compra. 'Purchase' solo debe dispararse cuando exista confirmación real del pedido (entrega o pago confirmado)."

### 2. srcset 450w/900w + archivos
- **Verificado**: Los archivos existen en sitio/img/:
  - kit-bano-secado-perro-450.webp, kit-bano-secado-perro.webp ✓
  - kit-pelo-cero-450.webp, kit-pelo-cero.webp ✓
  - kit-paseo-hogar-limpio-450.webp, kit-paseo-hogar-limpio.webp ✓
  - kit-gato-sin-pelusas-450.webp, kit-gato-sin-pelusas.webp ✓
  - kit-verano-fresco-450.webp, kit-verano-fresco.webp ✓
- **Referencia HTML** (línea 37 de kit-bano-secado-perro.html): srcset correctamente apuntado ✓

### 3. Alt nuevo de Baño y Secado
- **Nuevo alt** (línea 37 de kit-bano-secado-perro.html): "Toalla de microfibra, cepillo de silicona y guante de baño para perros" ✓

### 4. Sitemap con lastmod
- **Verificado**: sitio/sitemap.xml contiene `lastmod="2026-10-05"` en todos los URLs (20 productos + homepage) ✓

### 5. "Pagas al recibir" — Barra + Paso 3
- **Barra superior** (sitio/index.html línea 30, fichas línea 30): "Pagas al recibir" visible ✓
- **Portada paso 3** (sitio/index.html línea 79): "Pagas cuando llega · Recibes el kit en tu puerta y pagas al repartidor." ✓
- **Fichas formulario** (línea 59): "Total a pagar al recibir" ✓
- **Zona de compra clara**: La información de pago está disponible antes del CTA sin que solo barra superior la comunique ✓

### 6. Píldora "Pago contra entrega" quitada del pie
- **Búsqueda exhaustiva**: "Pago contra entrega" NO aparece en pie ni en ningún HTML (correcto) ✓
- **Única referencia en "Pagas al recibir"** en barra superior ✓

### 7. Botón flotante WhatsApp: solo ícono en escritorio
- **Elemento** (línea 90 de fichas): `<a class="wa"...>` contiene solo SVG + `<span class="wa-txt">WhatsApp</span>`
- **Comportamiento responsive**: Clase CSS `.wa` gestiona visibilidad en escritorio (solo ícono) ✓

### 8. Precios coherentes
- **Verificados sin inconsistencias**: 
  - Kit Baño Secado: $29.990 (catálogo, sitio, fichas) ✓
  - Kit Pelo Cero: $26.990 (plan_ads.json, sitio) ✓
  - Kit Verano Fresco: $32.990 (plan_ads.json, sitio) ✓

### 9. Sin reseñas/testimonios/escasez inventados
- **Sección Opiniones** (fichas): "Reseñas reales, pronto" + "Solo publicamos opiniones de clientes que recibieron su pedido. Sin reseñas inventadas: cuando lleguen, las verás aquí." ✓
- **Sin contadores/badges falsos**: ✓

### 10. Sin palabras de salud/cura
- **python3 herramientas/verificar.py**: Ejecutado exitosamente, código 0 ✓
- **Palabras prohibidas NO encontradas**: cura, sana, previene, alivia, golpe de calor, garantizado ✓

### 11. Retracto 10 días + Garantía legal 6 meses
- **Schema.org** (fichas): `merchantReturnDays: 10` ✓
- **Barra superior + footer**: "Garantía legal 6 meses" visible ✓

---

## Portones Humanos (Avisos, no bloquean)

- **datos/tienda.json**: correo, direccion_comercial, razon_social, rut aún null
- **Dropi**: 19/19 kits sin verificar (pendiente unidad de prueba real)

---

## Verificador Final

```
AVISO portón humano pendiente: datos/tienda.json → correo
AVISO portón humano pendiente: datos/tienda.json → direccion_comercial
AVISO portón humano pendiente: datos/tienda.json → razon_social
AVISO portón humano pendiente: datos/tienda.json → rut
AVISO calidad Dropi: 19/19 kits sin verificar (proveedor verificado/premium, mismo proveedor, muestra ≥ 4/5, costo real). NO pautar esos kits.
```

**Resultado**: Código 0 (OK) — Sin errores de regla fija.

---

## Conclusión

**AUDITORÍA CONFORME. Todos los cambios de diseño verificados correctamente.**

Archivos relevantes:
- `/home/user/tienda-shopify-/sitio/pedido.js` (línea 156: Lead event)
- `/home/user/tienda-shopify-/sitio/productos/kit-bano-secado-perro-toalla-microfibra-cepillo-guante.html` (srcset, alt, formulario)
- `/home/user/tienda-shopify-/sitio/index.html` (barra, paso 3, sitemap)
- `/home/user/tienda-shopify-/sitio/sitemap.xml` (lastmod)

Listo para commit.

Auditor: nodo `auditor` (grafo/pipeline.yaml)  
Fecha: 2026-10-05
