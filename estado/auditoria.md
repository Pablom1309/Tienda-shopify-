# Auditoría del 4 de octubre de 2026

## Resumen
Auditoría completada. **6 kits verificados**. Precios coherentes, sin afirmaciones de salud, sin testimonios inventados, garantías legales presentes. Portones humanos pendientes en datos/tienda.json.

## Problemas identificados

### Gravedad ALTA
1. **Datos faltantes (portón humano)** | `datos/tienda.json` | Líneas 3-8
   - 5 campos críticos null: whatsapp, correo, direccion_comercial, razon_social, rut
   - El sitio muestra avisos y no permite envío sin estos datos
   - Requiere intervención humana para completar

### Gravedad MEDIA
2. **Ángulos de publicidad con descripciones de mascota como persona** | `datos/plan_ads.json` | Líneas 76, 94, 127, 134, 159
   - Ángulos como "regalo para quien vive con un perro/gato" describen personas por tenencia de mascota
   - No son preguntas de atributo personal ("¿tu perro sufre...?"), sino descripciones
   - Textos de anuncios y página no tienen afirmaciones de salud
   - Riesgo: Meta podría interpretar "pet ownership" como atributo personal derivado (revisar en biblioteca de anuncios antes de pautar)

### Gravedad BAJA
3. **Especificaciones técnicas pendientes** | `datos/fichas.json` | Líneas 40, 115, 180, 249, 318, 388
   - 6 kits listados con "especificaciones_pendientes": medidas, materiales, capacidades
   - Se indica claramente en las FAQs que se publicarán "apenas recibamos la ficha del proveedor"
   - Sitio no promete medidas exactas, solo confirma que se publicarán
   - No es incumplimiento de la ley del consumidor, es portón esperado

## Verificaciones completadas: OK

✓ **Precios coherentes**: 6 kits coinciden en catalogo.json, fichas.json, sitio/index.html y shopify/productos.csv
✓ **Sin afirmaciones de salud/cura**: No encontradas palabras como "cura", "sana", "previene", "alivia", "golpe de calor"
✓ **Sin testimonios inventados**: Reseñas muestran "Reseñas reales, pronto" sin opiniones falsas
✓ **Sin contadores inventados**: Sin menciones de "stock", "disponibles", "quedan", "limitado"
✓ **Sin precios de referencia inventados**: No hay "precio normal" o "precio sugerido"
✓ **Retracto 10 días**: Presente en index.html, FAQs de fichas.json y sitio/productos/
✓ **Garantía legal 6 meses**: Presente en index.html, FAQs de fichas.json y sitio/productos/
✓ **Sin nombre "Huella Sur"**: Todas las referencias muestran "Kimo"
✓ **Ángulos de publicidad**: "regalo para quien vive con mascota" = descripción de persona, no pregunta de atributo personal

## Próximos pasos sugeridos (no incluidos en esta auditoría)
- Dueño: Completar datos/tienda.json (whatsapp, correo, dirección, razón social, RUT)
- Orquestador: Revisar ángulos en biblioteca de anuncios Meta antes de pautar
- Proveedor: Enviar fichas técnicas de los 6 kits para completar especificaciones
