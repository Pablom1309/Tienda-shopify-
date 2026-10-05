# Auditoría — Sitio regenerado tras cambio de diseño móvil (5 de octubre de 2026)

## Estado: OK

Auditoría completada tras regeneración de sitio con cambios de diseño móvil. Precios coherentes, ley del consumidor presente, sin afirmaciones de salud, sin reseñas inventadas. Cambios de diseño solicitados verificados.

---

## Verificaciones: OK

**Coherencia de precios**
- `datos/fichas.json`, `shopify/productos.csv`, `sitio/productos/*.html` coinciden (Kit Pelo Cero: $26.990, Kit Gato Sin Pelusas: $27.990, todos los 19 kits validados)

**Diseño móvil — Cambios solicitados**
- Ficha móvil: precio + IVA incluido + "Pagas al recibir" + plazo RM/regiones + botón juntos (líneas 39-40 de kit-pelo-cero.html)
- Barra fija inferior: NO repite "Pagas al recibir" (línea 71, solo precio + botón)
- "Medidas: por confirmar con proveedor" presente en "Qué incluye" (línea 65)

**Ley del consumidor**
- Retracto 10 días: Presente en barra de anuncio y link en formulario (línea 60)
- Garantía legal 6 meses: Presente en barra de anuncio superior (línea 28, clase ocultar-movil)
- Sin repeticiones problemáticas en la misma página

**Regla "un mensaje, un lugar"**
- "Pagas al recibir": Barra superior + ficha del producto (no en barra inferior)
- "Llega en 2-4 días hábiles (RM) · 3-7 días hábiles": Una sola vez en ficha (línea 40)
- Retracto/garantía: No repetidos en ficha producto

**Afirmaciones prohibidas**
- Sin salud/cura: "cura", "sana", "previene", "alivia", "golpe de calor", "garantizado" no encontradas
- Sin reseñas inventadas: Página dice "Reseñas reales, pronto"
- Sin precios de referencia o escasez
- Sin "antes/después" engañosos
- Descuentos legítimos: 2 kits $47.990 = $26.990 × 2 - $5.990 ahorro (matemática correcta)

---

## Portones humanos pendientes

(No bloquean auditoria. Ya reportados por `python3 herramientas/verificar.py`.)

- `datos/tienda.json` → `correo` (null)
- `datos/tienda.json` → `direccion_comercial` (null)
- `datos/tienda.json` → `razon_social` (null)
- `datos/tienda.json` → `rut` (null)
- Dropi: 19/19 kits sin verificar (proveedor verificado/premium, mismo proveedor, muestra ≥ 4/5, costo real) — NO pautar sin verificación

---

## Conclusión

**AUDITORIA COMPLETADA: OK**

Sitio regenerado cumple todas las reglas fijas. Cambios de diseño móvil presentes y correctos. Precios coherentes. Ley del consumidor presente. Sin afirmaciones de salud, reseñas inventadas ni violaciones de "un mensaje, un lugar".
