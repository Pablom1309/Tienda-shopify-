---
description: Una ronda del equipo de expertos (dirección, diseño, legal, operaciones, SEO, competencia, marca, ads) en paralelo.
---
Eres el orquestador (lee `CLAUDE.md`). Trabajas sin supervisión: no hagas preguntas; decide con supuestos explícitos.

1. **Sincroniza:** `git fetch origin claude/shopify-autonomous-agent-d55vw7 && git checkout claude/shopify-autonomous-agent-d55vw7 && git pull --rebase` (si hay cambios sin commit en `estado/accesos.log`, haz commit antes).
2. **Candado:** si `estado/turno.lock` tiene menos de 75 minutos, otro turno trabaja: termina sin cambios. Si no, escribe la hora UTC ISO en `estado/turno.lock`, commit y push.
3. **Lee:** `estado/instrucciones.md` (el dueño manda; marca `[hecho]` lo cumplido), `estado/areas.json`, `estado/areas/direccion.md`.
4. **Elige:** un área está vencida si `ultima` es null o `ahora - ultima >= ttl_horas`. Si `direccion` está vencida, córrela primero y sola (fija prioridades). Luego toma hasta **3** áreas vencidas de menor `prioridad`. Escribe el plan en una línea.
5. **Ejecuta en paralelo** (un solo mensaje, una llamada Agent por área, `subagent_type` = `agente` del registro). Pásale a cada uno: su `foco`, su archivo `estado/areas/<area>.md`, las propuestas que otras áreas le dejaron y la regla de tocar solo sus archivos. Solo `disenador-web` modifica el generador del sitio.
6. **Integra:** copia las "Propuestas para otras áreas" nuevas a la sección "Próximas tareas" del área destino. Marca en `estado/backlog.md` las tareas que un área completó. Lo que requiera dinero, cuentas o datos personales va a "Bloqueadas" del backlog y a `LANZAMIENTO.md` si es un paso nuevo del dueño.
7. **Control:** `python3 herramientas/economia.py && python3 herramientas/puntaje.py && python3 herramientas/construir_sitio.py && python3 herramientas/verificar.py && python3 herramientas/probar_guardian.py`. Si `diseno`, `ads` o `seo` cambiaron algo, corre el agente `auditor`. Si hay ERROR, devuelve una corrección al área responsable; si persiste, revierte ese cambio y anótalo.
8. **Cierra:** actualiza `ultima` (UTC ISO) de las áreas ejecutadas en `estado/areas.json`; agrega a `estado/bitacora.md` ≤ 6 líneas; actualiza `estado/informe-manana.md` (arriba, ≤ 12 líneas, solo lo nuevo y lo que necesita el dueño); borra `estado/turno.lock`; commit `equipo: <áreas> — <resumen>` y `git push -u origin claude/shopify-autonomous-agent-d55vw7` (si es rechazado: `git pull --rebase` y reintenta hasta 4 veces con espera 2, 4, 8, 16 s).
9. Termina con ≤ 6 líneas.

Reglas duras (de `CLAUDE.md`): nunca gastar, crear cuentas, publicar anuncios ni contactar clientes; nunca inventar reseñas, testimonios, escasez, precios de referencia ni costos; sin afirmaciones de salud; `verificar.py` en 0 antes de cada commit; respetar al guardián.
