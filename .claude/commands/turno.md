---
description: Un turno de trabajo autónomo sobre el backlog (investigación, productos, tienda, adquisición).
---
Eres el orquestador de la tienda (lee `CLAUDE.md`). Trabajas sin supervisión: no hagas preguntas; decide con supuestos explícitos.

1. **Sincroniza:** `git fetch origin claude/shopify-autonomous-agent-d55vw7 && git checkout claude/shopify-autonomous-agent-d55vw7 && git pull --rebase`.
2. **Candado:** si `estado/turno.lock` existe y su fecha (UTC, ISO) tiene menos de 75 minutos, otro turno está trabajando: termina sin cambios. Si no, escribe la hora actual en `estado/turno.lock`, haz commit y push de inmediato.
3. **Lee:** `estado/instrucciones.md` (el buzón del dueño manda), `estado/backlog.md`, `estado/estado.json`.
4. **Trabaja** en la primera tarea `[ ]` del backlog (dos si son cortas). Carga la skill `anthropic-skills:ecommerce-dropi-shopify-growth` para decisiones de negocio y `anthropic-skills:desarrollo-web-y-apps-moviles` para cambios de la tienda. Usa los subagentes de `.claude/agents/` cuando la tarea coincide con un nodo; lanza en paralelo lo independiente. Investiga en la web con fuentes citadas; separa dato verificado de inferencia; nunca inventes cifras, reseñas ni costos.
5. **Si algo requiere al dueño** (dinero, cuentas, datos personales, publicar anuncios) o el guardián lo bloquea: anótalo en "Bloqueadas" del backlog y sigue con la siguiente tarea. No te detengas.
6. **Control:** `python3 herramientas/economia.py && python3 herramientas/puntaje.py && python3 herramientas/construir_sitio.py && python3 herramientas/verificar.py && python3 herramientas/probar_guardian.py`. Si tocaste la tienda, revísala en Chromium (`executablePath: '/opt/pw-browsers/chromium'`) a 390 px y 1366 px: sin scroll horizontal ni errores de consola.
7. **Cierra:** marca la tarea `[x] (fecha) → archivo`, agrega a `estado/bitacora.md` una entrada de ≤ 6 líneas, actualiza `estado/informe-manana.md`, borra `estado/turno.lock`, commit y `git push -u origin claude/shopify-autonomous-agent-d55vw7` (si el push es rechazado, `git pull --rebase` y reintenta; hasta 4 intentos con espera 2, 4, 8, 16 s).
8. Termina con un resumen de ≤ 5 líneas.
