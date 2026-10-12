---
description: Ejecuta un ciclo del grafo de agentes de la tienda (orquestador).
---
Eres el orquestador definido en `CLAUDE.md`. Ejecuta UN ciclo del grafo `grafo/pipeline.yaml`:

1. **Sincroniza.** `git fetch origin claude/shopify-autonomous-agent-d55vw7 && git checkout claude/shopify-autonomous-agent-d55vw7 && git pull`.
2. **Lee la pizarra.** `estado/estado.json`, `estado/instrucciones.md` (el buzón del dueño manda sobre todo lo demás; marca cada instrucción como `[hecho]` al cumplirla), `datos/tienda.json`, y si hay `datos/resultados/*.csv` distintos de PLANTILLA.
3. **Planifica.** Un nodo LLM corre si `hoy - ultima_ejecucion >= ttl_dias`, si cambió alguno de sus archivos de entrada desde su última ejecución, o si el buzón lo pide. `analista-resultados` corre solo si hay resultados nuevos. Escribe el plan en una línea antes de empezar.
4. **Ejecuta en orden topológico.** Nodos LLM con la herramienta Agent (`subagent_type` = nombre del nodo); nodos de código con Bash. Lanza en el mismo mensaje los nodos sin dependencia entre sí (p. ej. `creador-tienda`→{`construir-sitio`, `estratega-ads`}).
5. **Portón.** Tras `validador`: si `aprobados == 0` y `reintentos < 2`, vuelve a `cazador-productos` con los motivos de rechazo; si llega a 2, registra y termina.
6. **Control.** Corre `python3 herramientas/economia.py && python3 herramientas/puntaje.py && python3 herramientas/construir_sitio.py && python3 herramientas/verificar.py`. Si hay ERROR, delega una sola corrección al nodo responsable y vuelve a verificar; si persiste, revierte ese cambio y anótalo.
7. **Checkpoint.** Actualiza `ultima_ejecucion` de los nodos ejecutados, `ciclo.numero`, `ciclo.fecha`, `ciclo.proximo_foco`; agrega una entrada breve a `estado/bitacora.md` (nodos, decisiones, pendientes humanos). Commit con mensaje `ciclo N: <resumen>` y `git push -u origin claude/shopify-autonomous-agent-d55vw7` (reintenta hasta 4 veces con espera 2, 4, 8, 16 s si falla por red).
8. **Informe.** Termina con ≤ 8 líneas: qué cambió, qué decidió el portón y qué necesita del dueño (solo si es nuevo).

Si nada está vencido y no hay datos nuevos: ejecuta solo el paso 6, agrega una línea a la bitácora solo si algo cambió, y no hagas commit vacío.
