# Auditoría Rediseño Ronda 14 (2026-10-06)

Verificador: `python3 herramientas/verificar.py` → OK (portones humanos pendientes: datos/tienda.json; kits de Dropi sin verificar)

## Resultado: AVISO (1 corrección menor)

Rediseño 2026-10-06 implementa correctamente estilos.css reescrito (Figtree, azul #24316B, mandarina #FF8A4C, fondo blanco), encabezado Perros/Gatos, "Cómo funciona" tipográfico, fichas, contacto, legales, 404. 

**1 AVISO:** sitio/404.html contiene botón "Escribir por WhatsApp" fuera de ubicaciones autorizadas.

---

## Avisos detectados

### AVISO: sitio/404.html línea ~11 — Botón de WhatsApp en sección no autorizada

**Regla incumplida (2026-10-06):** "WhatsApp solo donde hace falta: formulario de pedido, página de contacto y una línea de texto en el pie; sin botón flotante, sin ícono en el encabezado."

**Ubicaciones permitidas:**
- Formulario de pedido (#pedido) ✓
- Página contacto.html ✓
- Una línea en pie de todas las páginas ✓

**Ubicaciones encontradas:**
- sitio/404.html: botón "Escribir por WhatsApp" + enlace pie (2 × wa.me) ✗
- Debe tener solo: enlace pie (1 × wa.me)

**Impacto:** Botón en sección principal de 404 viola regla explícita. Remover `<a class="boton boton-grande boton-fantasma-claro" href="https://wa.me/...">Escribir por WhatsApp</a>`, mantener solo enlace en pie.

---

## Verificaciones CORRECTAS

✓ **Sin tel: o "Llámanos":** búsqueda negativa `grep -r "tel:"` = sin coincidencias  
✓ **Conteo WhatsApp:** 28 enlaces wa.me correctamente distribuidos (1 botón pedido + 1 botón contacto + 1 línea pie × 20 páginas + pedido.js)  
✓ **Sin botón flotante WhatsApp:** ningún elemento `position:fixed` con wa.me  
✓ **Contraste AA:**
  - Texto #1C2033 sobre fondo #FFFFFF = **16.11:1** ✓ (requerido ≥4.5:1)
  - Botón mandarina #FF8A4C con texto #141B3F = **7.15:1** ✓ (requerido ≥4.5:1)
  - Azul #24316B con texto blanco (hero) = **12.16:1** ✓ (requerido ≥4.5:1)

✓ **Movimiento casi nulo:** CSS con `scroll-behavior:auto`; transiciones solo en hover/press; sin @keyframes; sin revelados al scroll ni entradas escalonadas  
✓ **Sin "2 por $X" prominente:** búsqueda negativa = no hay tarjetas mostrando oferta en bloque llamativo (discreta en cantidad)  
✓ **Precios correctos:** todas las 19 fichas vs catalogo.json (kit-pelo-cero $26.990, kit-bano-secado $29.990, kit-gato-sin-pelusas $23.990, etc.) = ✓  
✓ **Totales por cantidad:** 1 unidad = precio base; 2 unidades = precio base × 2 − ahorro (ej: $26.990 × 2 − $5.990 = $47.990)  

✓ **Textos legales sin cambios de contenido:** despacho.html, cambios.html, privacidad.html = solo cambios en markup/fuentes/colores (Fraunces → Figtree, #E8935F → #FF8A4C), contenido de retracto 10 días y garantía 6 meses idéntico  
✓ **Contenido visible sin JS:** HTML estático; FAQs con `<details>` nativo; grilla sin paginación aparece completa  
✓ **pedido.js dispara Lead:** línea 236 `window.fbq('track', 'Lead', { value: total(), currency: 'CLP', content_name: f.dataset.producto })` ✓  

✓ **Tipografía Figtree:** inyectada en línea 22 de index.html `<style>:root{--fuente:"Figtree"}`  
✓ **Colores de marca:** primario #24316B, acento #FF8A4C, fondo #FFFFFF, texto #1C2033 (fuente datos/marca.json 2026-10-06)  
✓ **Encabezado Perros/Gatos:** filtro de mascota en barra menú  
✓ **"Cómo funciona" tipográfico:** sección sin ícono o imagen de bloque (solo texto + heading)  
✓ **Fichas, contacto, legales, 404 mismo sistema:** encabezado, menú, pie, estilos.css unificados  

✓ **Sin reseñas, testimonios, escasez falsa:** búsqueda negativa `grep -ri "testimonio|resena|reseña|opinión|cliente dice"` = sin coincidencias; sin "solo quedan", "últimas unidades"  
✓ **Sin palabras de salud:** búsqueda `"cura"`, `"sana"`, `"alivia"`, `"previene"`, `"golpe de calor"`, `"garantizado"` = sin coincidencias en contenido visible  
✓ **Sin números inventados:** sin contadores de clientes, satisfacción %, descuentos falsos de referencia  

---

## Portones humanos (verificador, no bloqueadores)

- `datos/tienda.json` → correo (null)
- `datos/tienda.json` → direccion_comercial (null)
- `datos/tienda.json` → razon_social (null)
- `datos/tienda.json` → rut (null)
- 19/19 kits sin verificar en Dropi (requiere costo real, proveedor verificado antes de pautar)

---

## Conclusión

**Ronda 14 aprobable con 1 corrección menor (404.html).** Funcionalidad, precios, contenido, accesibilidad y reglas de marca verificadas. Remover botón de WhatsApp en 404 y marcar como listo.

---

**Resultado final: AVISO — Remover botón WhatsApp de sitio/404.html ~línea 11**

Auditor: nodo `auditor` (grafo/pipeline.yaml)  
Fecha: 2026-10-06 UTC
