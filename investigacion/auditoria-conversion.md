# Auditoría de conversión de la tienda (turno 2026-10-04)

Referencia: motivos de abandono y pautas de Baymard (ver `playbook-referentes.md`), objeciones reales (`cliente-objeciones.md`). Revisado en Chromium a 390 px y 1366 px: sin scroll horizontal; único error de consola = Google Fonts bloqueado por el certificado del proxy del entorno (no ocurre en producción).

## Lo que ya está bien
- Formulario corto (5 campos + región), sin cuenta, con validación en línea y borrador guardado.
- Total a pagar visible y actualizado; oferta de 2 unidades con ahorro explícito; complemento opcional.
- Pago al recibir repetido en barra superior, sellos, formulario y barra fija móvil.
- Fecha estimada de entrega al elegir región; retracto y garantía legal explicados.
- Sin reseñas inventadas: bloque honesto "Reseñas reales, pronto". Imágenes marcadas como referenciales.
- Datos estructurados Product, Breadcrumb y FAQ.

## Cambios implementados en este turno (bajo riesgo)
1. **Plazo de entrega visible junto al precio** (antes solo aparecía al elegir región): "Llega en 2 a 4 días hábiles en la RM y 3 a 7 en regiones" (desde `datos/tienda.json`). Baymard: envío lento = 21 % de abandonos.
2. **Retracto y privacidad enlazados** junto al botón ("10 días de retracto" → `cambios.html`; "Datos protegidos" pasa a "Cómo usamos tus datos" → `privacidad.html`), en vez de afirmaciones sin respaldo.
3. **Consentimiento opcional y desmarcado** para recordatorios por WhatsApp (Ley 21.719, vigente 1-dic-2026); se incluye en el mensaje del pedido ("Sí/No").

## Pendiente, priorizado (no implementado)
| # | Cambio | Por qué | Bloqueo / responsable |
|---|---|---|---|
| 1 | Fotos reales con escala (mano, cm) y video corto de uso | Queja n.º 1 en reseñas: "más chico que la foto" | Muestra física (dueño) |
| 2 | Medidas exactas y tiempo de carga en "Qué incluye" | Objeciones de tamaño e instructivo | Ficha del proveedor en Dropi |
| 3 | FAQ de tamaño/carga/talla y copy de "bruma fina" | Objeciones reales | creador-tienda (tarea P3) |
| 4 | Evento del píxel: hoy se dispara `Purchase` al abrir WhatsApp, antes de confirmar | Infla conversiones y entrena mal a Meta; usar `Lead` al enviar y `Purchase` solo con pedido confirmado (CAPI) | estratega-ads + dueño (píxel aún no instalado) |
| 5 | Página de gracias con upsell de un clic | Ticket promedio | tarea P3 |
| 6 | Autohospedar las fuentes (Fraunces/Nunito) | Menos dependencias externas y mejor carga | tarea de rendimiento |
| 7 | WhatsApp y datos legales reales en pie y contacto | Confianza (19 % de abandonos por desconfianza) | Dueño (portón humano) |
