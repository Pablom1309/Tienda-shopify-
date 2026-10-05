# Auditoría — Ronda 2026-10-05 (datos/conceptos_ads.md, plan_ads.json, seo/auditoria.md)

## Estado: 2 ERRORES CRÍTICOS (bloquean pauta Pelo Cero)

Auditoría de nuevos archivos de esta ronda. Verificador: PASO (código 0). Conceptos_ads.md y plan_ads.json correctamente redactados. **Errores en datos/fichas.json contradicen políticas Meta.**

---

## Verificaciones

**Verificador (herramientas/verificar.py):** OK (código 0).
Avisos no bloqueantes:
- datos/tienda.json: 5 campos null (portones humanos)
- 19/19 kits Dropi sin verificar

**Política Meta (datos/conceptos_ads.md, datos/plan_ads.json):** OK ✓
- Sin atributos personales ("¿tu perro sufre...?") ✓
- Sin afirmaciones de salud (ansiedad, calma, piel, alergias) ✓
- Sin antes/después corporales ✓
- Sin testimonios, escasez, precios de referencia inventados ✓
- Pelo Cero: especifica "niebla de agua, nunca vapor caliente" (plan_ads.json:72) ✓
- Baño y Secado: "no incluye shampoo" claramente dicho (conceptos_ads.md:13) ✓
- Gato Sin Pelusas: sin promesas de "calma" ni "relax" (conceptos_ads.md:39) ✓
- Precios coherentes en anuncios (Gato $27.990/1, $49.990/2; Pelo Cero $26.990/1, $47.990/2; Baño $29.990/1, $52.990/2) ✓

**SEO (datos/seo/auditoria.md):** Reporte correcto, identifica problemas.

---

## ERRORES ENCONTRADOS (bloquean pauta)

### ERROR 1: datos/fichas.json — Pelo Cero "a vapor" contradice FAQ

**Archivos afectados:** datos/fichas.json (kit-pelo-cero, líneas 7-52)

**Textos inconsistentes (5 lugares):**
- Línea 7 (titulo_seo): "cepillo a vapor para perros"
- Línea 8 (meta_descripcion): "Cepillo a vapor 3 en 1 para el pelo suelto"
- Línea 10 (subtitular): "Cepillo a vapor 3 en 1 + removedor reutilizable"
- Línea 36 (incluye): "1 cepillo a vapor 3 en 1"
- Línea 52 (alt_imagenes[0]): "Cepillo a vapor soltando el pelo muerto"

**Contradicción:**
- Línea 47-48 (FAQ): "¿El vapor es caliente? No. Es una niebla de agua a temperatura ambiente, no vapor caliente."

**Conflicto con plan:**
- conceptos_ads.md línea 84: "Niebla de agua, no vapor caliente"
- plan_ads.json línea 72: "En anuncios decir 'cepillo con niebla de agua', nunca 'vapor caliente'"

**Problema:** Palabra "a vapor" en título, meta, subtítulo e imágenes crea ambigüedad (usuario lee "vapor"). FAQ aclara "no es vapor caliente" pero los textos principales dicen "a vapor". Esto viola Meta: "Sin promesas contradictorias"; Google interpreta "a vapor" = vapor caliente en SERP.

**Impacto:** Descubierta por auditor SEO (datos/seo/auditoria.md P0-1).

**Acción requerida:** Reemplazar "a vapor" por "con bruma" o "con niebla de agua" (fichas.json líneas 7, 8, 10, 36, 52).

---

### ERROR 2: datos/fichas.json — Pelo Cero FAQ contradice alcance (perros vs perros+gatos)

**Archivos afectados:** datos/fichas.json (kit-pelo-cero, líneas 43-45)

**Texto en fichas.json:**
- Línea 43-45 (FAQ): "¿Sirve para perros y gatos? Sí, para pelo corto y largo."

**Conflicto con plan:**
- conceptos_ads.md línea 57: "Nombre en el anuncio: 'Kit Pelo Cero: cepillo con niebla de agua + removedor'. Aplica a **perros**."
- plan_ads.json línea 71: `"publico_mascota": "perros"` (no "perros y gatos")
- datos/seo/auditoria.md línea 35-36: "Cambiar la FAQ a '¿Sirve para gatos?' solo si el proveedor lo confirma; si no, quitar 'y gatos'."

**Problema:** Ficha promete funcionalidad para gatos pero anuncios y plan especifican solo perros. Usuario compra esperando servir para gato; proveedor aún no lo confirma.

**Impacto:** Violación de "mensaje = página" (conceptos_ads.md línea 16, plan_ads.json línea 6). Meta prohíbe inconsistencia entre anuncio y landing page.

**Acción requerida:** Confirmar con proveedor si Pelo Cero sirve para gatos. Si NO: cambiar línea 43 de fichas.json a "¿Sirve para gatos?" con respuesta "No. Este kit está pensado solo para perros. Para gatos, revisa el Kit Gato Sin Pelusas."

---

## Sitio (sitio/) — Sin cambios en esta ronda

No auditadas modificaciones a sitio/ porque no hubo cambios.

---

## Portones humanos pendientes

(No bloquean auditoria pero prohíben pauta):
- datos/tienda.json: correo, direccion_comercial, razon_social, rut (null)
- Dropi: 19/19 kits sin verificar — NO pautar sin verificación Dropi + unidad de prueba

---

## Conclusión

**AUDITORIA COMPLETADA: 2 ERRORES, PAUTA BLOQUEADA PARA PELO CERO**

### Changelist
1. **ERROR 1 (fichas.json:7-52):** Reemplazar "a vapor" por "con bruma" en título, meta, subtítulo, incluye, alt. Severidad: crítica (contradice FAQ + plan).
2. **ERROR 2 (fichas.json:43-45):** Confirmar proveedor: ¿Pelo Cero sirve para gatos? Si NO, cambiar FAQ. Severidad: crítica (promesa falsa).

### Archivos limpios esta ronda
- datos/conceptos_ads.md: OK (instrucciones bien redactadas)
- datos/plan_ads.json: OK (políticas Meta implementadas)
- datos/seo/auditoria.md: OK (reporte diagnóstico)

No se puede pautar Pelo Cero ni derivados hasta que se resuelvan ERROR 1 y ERROR 2. Gato Sin Pelusas, Baño y Secado, Verano Fresco: sin bloques de contenido (pauta pendiente de portones humanos: C1-C3, I4-I5, Dropi).
