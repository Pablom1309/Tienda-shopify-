# Segundo producto con recompra: fuente de agua para gatos + filtros (turno 2026-10-04)

Leyenda: **[V]** dato de fuente · **[I]** inferencia · todo costo es **estimado** hasta verificarlo en Dropi.
Cálculo reproducible: `python3 herramientas/ltv.py` (nodo nuevo del grafo, lee `datos/supuestos.json` → bloque `recompra`, escribe `datos/ltv.json`).

## Datos de partida
- [V] Cambio de filtro recomendado por fabricantes: cada 2-4 semanas; 5 filtros alcanzan para 3-5 meses. [ManoMano (ficha de fabricante)](https://www.manomano.es/p/fuente-de-agua-para-gatos-y-perros-sstrwgood-de-2-litros-con-5-filtros-reemplazables-dispensador-de-agua-silencioso-para-gatos-color-gris-209836762)
- [V] Falabella CL (2026-10-04): filtros de fuente mediana $12.245 (52 avisos, $3.990-$34.990); pack 12 filtros $6.980; fuente 2,4 L + filtro $19.490 (32 reseñas). Ver `competencia-precios.md`.
- [V] Reseñas: compradores reconocen que hay que cambiar filtros y limpiar la bomba ("le salen hongos", "se llena de residuos"). Ver `cliente-objeciones.md`.
- [V] Benchmarks de recompra en insumos para mascotas: ~31,5 % de reorden ([Alexander Jarvis](https://www.alexanderjarvis.com/what-is-reorder-rate-in-ecommerce/)); 25-35 % en tiendas Shopify del rubro, 60-75 % en marcas con suscripción ([GrowthSuite](https://www.growthsuite.net/blog/repeat-purchase-rates-by-product-category-where-retention-efforts-pay-off-most)); ~50 % de las recompras ocurre en 30 días y 76 % en 90. Fuentes de blogs de la industria, no estudios auditados.
- [V] Chewy: 83,3 % de sus ventas vienen de clientes con suscripción (ver `playbook-referentes.md`).

## Supuestos del modelo (estimados)
| Parámetro | Valor | Por qué |
|---|---|---|
| Primer pedido | Kit hidratación (fuente + 6 filtros) $34.990; G mezcla base $10.865 | `economia.json` |
| Pedido de recompra | Pack 6 filtros $12.990; costo $2.500; flete $3.800 | Bajo la mediana de Falabella; costo y flete estimados |
| Confirmación / entrega en recompra | 95 % / 90 % | Cliente que ya recibió y pagó una vez (inferencia) |
| Costo de adquirir la recompra | $0 en anuncios + $150 de mensajería | Recordatorio por WhatsApp **con consentimiento expreso** (Ley 21.719) |
| Recompra a 6 meses (pesimista/base/optimista) | 15 % ×1 · 30 % ×1,5 · 45 % ×2 pedidos | Benchmarks anteriores |

## Resultado (`datos/ltv.json`)
- Ganancia por pedido de recompra: **$5.209** (rentable aun con flete, porque no paga anuncio).
- Por cada pedido generado del kit (solo 59,5 % termina en cliente entregado):

| Escenario | Ganancia extra por recompra | LTV por pedido generado | ROAS de equilibrio con LTV |
|---|---|---|---|
| Pesimista | +$465 | $11.330 | 3,75 |
| **Base** | **+$1.395** | **$12.260** | **3,47** |
| Optimista | +$2.789 | $13.654 | 3,11 |

(Sin recompra: G $10.865, ROAS de equilibrio 3,91.)

## Conclusiones
1. **[I] La recompra ayuda pero no transforma:** a 6 meses suma ~13 % al valor del cliente en el caso base y baja el ROAS de equilibrio de 3,91 a 3,47. Pasa de "al borde" a "holgado", pero no supera a Kit Gato Sin Pelusas (3,26) ni justifica reemplazar un activo hoy.
2. **[I] La palanca grande no es la recompra a 6 meses sino el horizonte:** si el cliente se queda 12+ meses (filtros cada 1-2 meses), el valor crece; requiere un sistema de recordatorios que hoy no existe (WhatsApp del dueño + consentimiento).
3. **[I] Riesgo de política 1:** nunca hablar de riñones, salud urinaria ni "hidratación para prevenir". Hablar de agua en movimiento, filtros y limpieza.
4. **Decisión:** se mantiene en observación (prioridad 6). Se reactiva si (a) Dropi confirma fuente + 6 filtros ≤ $13.500 y filtros sueltos ≤ $2.500, y (b) el dueño activa WhatsApp con consentimiento. Mientras tanto, la casilla de consentimiento (tarea P3) se agrega igual: sirve para todos los productos.
5. **Ofrecer filtros extra como complemento de un clic** en el primer pedido adelanta parte de la recompra sin depender de recordatorios (tarea "página de gracias con upsell").

## Pendiente
- Costos reales en Dropi de fuente y filtros compatibles del **mismo** proveedor (si los filtros no son compatibles, no hay recompra).
- Recalibrar `recompra` en `supuestos.json` con datos reales (analista-resultados).
