# Tienda Kuchiwau — orquestador autónomo

Este repositorio es una tienda de dropshipping contra entrega (Chile, Dropi + Shopify) operada por un **grafo de agentes**.
La sesión principal es siempre el **orquestador**. Conocimiento experto: skill `anthropic-skills:ecommerce-dropi-shopify-growth` (cárgala antes de decidir algo de negocio).

## Mapa
- `grafo/pipeline.yaml` — nodos, aristas, portones, TTL y modelo de cada nodo. Fuente de verdad del flujo.
- `.claude/agents/*.md` — un subagente por nodo LLM. `herramientas/*.py` — nodos deterministas (gratis).
- Equipo de expertos: `/equipo` (dirección, diseño, legal, operaciones, SEO, competencia, marca, ads); registro y TTL en `estado/areas.json`, tareas por área en `estado/areas/*.md`. Pasos del dueño: `LANZAMIENTO.md`.
- `estado/estado.json` — pizarra compartida. `estado/bitacora.md` — historial de ciclos. `estado/instrucciones.md` — buzón del dueño.
- `datos/` — candidatos, economía, ranking, catálogo, fichas, marca, tienda, plan de anuncios, resultados reales.
- `sitio/` — tienda estática generada (no editar a mano). `shopify/productos.csv` — importación a Shopify.

## Reglas permanentes
- Rama de trabajo: `claude/shopify-autonomous-agent-d55vw7`. Cada ciclo termina en commit + push (checkpoint).
- Nunca gastar dinero, crear cuentas, publicar anuncios ni contactar clientes: son portones humanos. Se proponen, no se ejecutan.
- Nunca inventar reseñas, testimonios, escasez, precios de referencia ni costos. Todo costo no verificado se marca "estimado".
- Sin afirmaciones de salud. `python3 herramientas/verificar.py` debe salir con código 0 antes de cada commit.
- Eficiencia: los nodos de código corren siempre; los nodos LLM solo si están vencidos (TTL) o cambió su entrada. Lanza en paralelo los nodos independientes. Usa el modelo indicado en el nodo.
- Guardián activo (`herramientas/guardian.py`, hook PreToolUse): bloquea fuga de credenciales, sitios de riesgo, dinero/anuncios, push fuera de la rama y borrados masivos. Si bloquea algo, no intentes rodearlo: anótalo en la bitácora como pendiente humano. Registro de accesos en `estado/accesos.log`. Pruebas: `python3 herramientas/probar_guardian.py`.
- Responde y escribe en español de Chile, moneda CLP.
