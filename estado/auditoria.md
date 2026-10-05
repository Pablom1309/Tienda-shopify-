# Auditoría — Ronda 2026-10-05

## Estado: OK

Auditoría del sitio regenerado (sitio/) tras cambios de diseño (eager/og/JSON-LD/2kits). Verificador: PASO (código 0).

---

## Verificaciones completadas

**Verificador (herramientas/verificar.py):** OK (código 0).
- Portones humanos pendientes: correo, dirección_comercial, razon_social, rut en datos/tienda.json (esperados, no bloquean).
- Dropi: 19/19 kits sin verificar (esperado, aviso no bloqueante).

**Precios coherentes (catálogo → fichas → sitio → CSV):**
- Pelo Cero: 26990 ✓ (catalogo.json, HTML, JSON-LD, shopify/productos.csv)
- Gato Sin Pelusas: 27990 ✓
- Baño y Secado: 29990 ✓

**Cambios de diseño auditados:**
1. Imagen principal eager/fetchpriority: ✓ `loading="eager" decoding="async" fetchpriority="high"` presente
2. Meta og/twitter: ✓ Presentes con imagen, descripción, URL canónica
3. JSON-LD Product: ✓ Válido, con `offers.url`, `deliveryTime` (handling 0-1d, transit 2-7d), `image` en arreglo
4. Bloque "Otros kits": ✓ Exactamente 2 tarjetas por ficha
5. Corrección Pelo Cero: ✓ "cepillo con bruma" en título y subtítulo (sin "a vapor")

**Contenido:**
- Sin reseñas, testimonios, escasez, precios de referencia inventados: ✓
- Sin afirmaciones de salud (cura, sana, previene, alivia, golpe de calor): ✓
- Retracto 10 días y garantía legal 6 meses presentes: ✓
- Regla "un mensaje, un lugar": ✓ "Pagas al recibir" en anuncio y sección clave (lugares distintos), no repetido en tarjetas

**JSON-LD válido:**
- schema.org/Product: Cumple especificación ✓
- offers.url, deliveryTime, image arreglo: Presentes ✓

---

## Portones humanos (no bloquean auditoría)

- datos/tienda.json: 5 campos null (correo, dirección_comercial, razon_social, rut)
- Dropi: 19/19 kits sin verificar (pedir unidad de prueba antes de pautar)

---

## Conclusión

**SITIO CONFORME. LISTO PARA PAUTA** (pendientes portones de cuentas en tienda.json y verificación Dropi).

Fecha: 2026-10-05
