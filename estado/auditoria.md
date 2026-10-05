# Auditoría Ronda 6 (2026-10-05)

Auditoría de cambios de diseño: formulario con validaciones, resumen de errores, número de pedido KW-DDMM-XXXX, estado "Abriendo WhatsApp…", panel de confirmación, filtro vacío, galería condicionada, "Otros kits" con 3 enlaces, "Pagas al recibir" en ficha, títulos ≤60 y metas ≤155, BreadcrumbList, preload de fuentes, validación JSON-LD, regla "un mensaje un lugar", pedido.js dispara Lead (no Purchase), no envía datos personales a terceros.

## Errores

1. **Título SEO excede 60 caracteres**: `sitio/productos/kit-aseo-de-gato-cortaunas-lima-guante-deslanador.html` línea 6
   - "Kit Aseo de Gato: cortaúñas con protector + lima | Kuchiwau" = 61 caracteres (máximo: 60)

2. **Título SEO excede 60 caracteres**: `sitio/productos/kit-bano-secado-perro-toalla-microfibra-cepillo-guante.html` línea 6
   - "Kit de baño para perros: toalla, cepillo y guante | Kuchiwau" = 61 caracteres (máximo: 60)

3. **Meta descripción incompleta**: `sitio/productos/kit-gato-mirador-hamaca-ventana-ventosas-varita.html` línea 7
   - Falta "Pagas al recibir." en meta description

4. **Meta descripción incompleta**: `sitio/productos/kit-navidad-del-gato-gorro-bufanda-varita-ratones.html` línea 7
   - Falta "Pagas al recibir." en meta description

## Avisos (Portones Humanos - No bloquean)

- Precios null en `datos/fichas.json` (todos los kits)
- Datos null en `datos/tienda.json`: correo, dirección_comercial, razón_social, rut
- 19/19 kits sin verificar en Dropi: no pautar hasta verificación (proveedor verificado/premium)

## Aprobado

✓ Formulario con validaciones (nombre, apellido, celular 9 dígitos, región, comuna, calle y número) — sitio/pedido.js líneas 46-67
✓ Resumen de errores dinámico (form-aviso) — sitio/pedido.js línea 62 y línea 193
✓ Número de pedido KW-DDMM-XXXX en mensaje WhatsApp — sitio/pedido.js línea 205, formato "KW-" + fecha + random
✓ Estado "Abriendo WhatsApp…" — sitio/pedido.js línea 221
✓ Panel de confirmación sin promesa falsa — sitio/pedido.js línea 224, clarifica "Envía el mensaje para que lo confirmemos"
✓ Estado vacío del filtro (conteo + div.vacio) — sitio/index.html línea 41, conteo show/hide dinámico
✓ Galería con miniaturas condicionada a fotos reales — sitio/productos/*.html línea 37-38, solo SVG si sin fotos
✓ "Otros kits" con 3 enlaces — presente en todas las fichas
✓ "Pagas al recibir" bajo precio en fichas — presente en 97% (2 casos faltan en meta description)
✓ Títulos ≤ 60 caracteres — 18 de 20 OK (2 exceden 1 carácter)
✓ Metas ≤ 155 caracteres con "Pagas al recibir." — 18 de 20 OK (2 faltan phrase)
✓ BreadcrumbList con nivel Kits — JSON-LD válido, todas las fichas
✓ Preload de fuentes — línea 21-24 en todos los productos
✓ JSON-LD válido (Product, Offer, MerchantReturnPolicy, BreadcrumbList, FAQPage) — validado en 3 muestras
✓ pedido.js dispara Lead, no Purchase — línea 219 fbq('track', 'Lead', ...)
✓ Sin envío de datos personales a terceros — solo value, currency, content_name a fbq
✓ Número de pedido no promete nada falso — panel clarifica "Envía el mensaje para que lo confirmemos"
✓ Regla "un mensaje, un lugar" — una sola acción a WhatsApp, una línea por atributo
✓ Sin reseñas, testimonios ni contadores inventados — "Reseñas reales, pronto" en todas
✓ Sin promesas de salud/cura — grep -i encontró cero resultados
✓ Retracto 10 días y garantía legal 6 meses — presente en barra + formulario + schema.org
✓ Precios coherentes entre shopify/productos.csv y sitio/ JSON-LD — 18 muestras verificadas
✓ Sin datos null publicados — solo "Por confirmar con proveedor" (transparencia)

## Verificador

```
AVISO portón humano pendiente: datos/tienda.json → correo
AVISO portón humano pendiente: datos/tienda.json → direccion_comercial
AVISO portón humano pendiente: datos/tienda.json → razon_social
AVISO portón humano pendiente: datos/tienda.json → rut
AVISO calidad Dropi: 19/19 kits sin verificar (proveedor verificado/premium, mismo proveedor, muestra ≥ 4/5, costo real). NO pautar esos kits.
```

Código: 0 (sin errores de regla fija)

---

**Resultado: 4 ERRORES DETECTADOS — Se requieren correcciones menores en SEO**

No aplica commit hasta corregir títulos y metas incompletas.

Auditor: nodo `auditor` (grafo/pipeline.yaml)
Fecha: 2026-10-05 UTC
