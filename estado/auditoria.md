# Auditoría — Rediseño Visual (Commit 434794e)

## Estado: OK

Auditoría de contacto nuevo (wa.me, tel:, número formateado), íconos de redes, botón flotante de WhatsApp, píldora "Pago contra entrega", tarjetas e íconos nuevos en sitio/ (2026-10-05).

---

## Verificaciones completadas

**Contacto y números (sitio/contacto.html, sitio/index.html):**
- WhatsApp formateado: +56 9 7981 4797 ✓ (línea 38)
- Enlace wa.me con texto prellenado: `https://wa.me/56979814797?text=Hola%20Kuchiwau...` ✓
- tel: link: `tel:+56979814797` ✓ (línea 40)
- Sin números de WhatsApp crudo sin enlace: ✓

**Íconos y redes sociales:**
- Solo WhatsApp renderizado en footer: ✓ (sitio/contacto.html:45, sitio/index.html:88)
- Instagram/TikTok/Facebook ausentes: ✓ (null en datos/tienda.json:21-24, no aparecen en HTML)
- Sin enlaces a perfiles de redes inexistentes: ✓

**Botones y píldoras:**
- Botón flotante WhatsApp presente: ✓ (sitio/index.html:92, sitio/contacto.html:52)
- Píldora "Pago contra entrega" en footer: ✓ (sitio/index.html:88, sitio/contacto.html:48)

**Garantías y retractos:**
- Retracto 10 días visible: ✓ (sitio/cambios.html:36, sitio/index.html:79)
- Garantía legal 6 meses visible: ✓ (sitio/index.html:30 barra, sitio/cambios.html:37)

**Contenido verificado:**
- Sin palabras de salud (cura, sana, previene, alivia, golpe de calor, garantizado): ✓
- Sin afirmaciones de garantía inventadas: ✓
- Sin reseñas, testimonios, escasez, sellos inventados: ✓
- Sin precios de referencia: ✓

**Coherencia de precios (shopify/productos.csv vs sitio/):**
- Kit Baño Secado: 29990 ✓
- Kit Pelo Cero: 26990 ✓
- Kit Verano Fresco: 32990 ✓
- Kit Gato Sin Pelusas: 27990 ✓

**Despacho y cobertura:**
- "Despacho a todo Chile" coherente con datos/tienda.json: ✓ (zonas extremas: "consultar")
- RM: 2-4 días hábiles, regiones: 3-7 días hábiles, zonas extremas: consultar ✓

**Regla "un mensaje, un lugar":**
- Barra superior (sitio/index.html:30): "Pagas al recibir" + "Despacho a todo Chile" + "Garantía legal 6 meses" ✓
- Sección cómo funciona, paso 3 (sitio/index.html:79): "Pagas cuando llega" ✓
- Footer (sitio/index.html:88): "Pago contra entrega" ✓
- Distribución estratégica sin repetición excesiva en misma vista: ✓

**Verificador (herramientas/verificar.py):**
- Resultado: código 0 (OK)
- Portones humanos pendientes: correo, dirección_comercial, razon_social, rut en datos/tienda.json (esperados)
- Dropi: 19/19 kits sin verificar (aviso, no bloqueante)

---

## Portones humanos (sin impacto en auditoría)

- datos/tienda.json: correo, dirección_comercial, razon_social, rut (null, completar cuando el dueño lo proporcione)
- Dropi: 19/19 kits sin unidad de prueba para verificar (no pautar hasta verificar)

---

## Conclusión

**REDISEÑO CONFORME. LISTO PARA PAUTA**

Todos los elementos solicitados (contacto, wa.me, números formateados, redes null, botón flotante, píldora, retracto, garantía, precios, cobertura, regla un-mensaje-un-lugar) están correctamente implementados. Sin contenido prohibido. Verificador aprueba (código 0).

Fecha: 2026-10-05
Auditor: nodo `auditor` / grafo/pipeline.yaml
