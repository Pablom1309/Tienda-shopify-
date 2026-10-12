# Guía: verificar calidad y despacho en Dropi antes de vender (2026-10-04)

**Estado:** ningún kit está verificado. Los 19 se eligieron con datos de mercado (precios en Falabella/Paris, reseñas de productos similares, estacionalidad y economía estimada), no con datos de proveedores de Dropi. Revisarlo requiere la cuenta del dueño.

Planilla a completar: `datos/verificacion_dropi.csv` (una fila por kit). Cuando se anotan `costo_real_total` y `flete_real`, `economia.py` los usa automáticamente en vez de los estimados, y `verificar.py` avisa qué kits no se pueden pautar.

## Criterios mínimos para que un kit se pueda anunciar
| # | Criterio | Mínimo | Por qué |
|---|---|---|---|
| 1 | Tipo de proveedor | **Verificado (✓) o Premium (corona)** | Dropi visita bodegas y valida stock y productos de los verificados; los Premium tienen mejor cumplimiento histórico. [Andrey Business](https://www.andreybusiness.com/espana/blog/proveedores-verificados-dropi-por-que-elegirlos-2026) |
| 2 | Mismo proveedor para todas las piezas | **Sí** | Si no, son 2 despachos y el kit no cierra (flete doble). |
| 3 | Stock | Suficiente para ≥ 30 pedidos | Evita quiebres al empezar los anuncios. |
| 4 | Calificación y reseñas del proveedor en Dropi | Las mejores disponibles; descartar reclamos por demoras o productos distintos a la foto | Dropi muestra calificaciones y métricas de desempeño por proveedor. [Andrey Business](https://www.andreybusiness.com/colombia/blog/guia-proveedores-dropshipping-colombia-2026) |
| 5 | Muestra física | **Pedir 1 unidad** y calificar **≥ 4/5** | Única forma real de ver calidad; además permite fotos reales y medidas exactas (lo que más piden los compradores). |
| 6 | Costo real y flete | Anotarlos; el kit debe seguir pasando el portón con costos reales | Hoy todos los costos son estimados. |
| 7 | Devoluciones | Apuntar a 10-15 %; sobre 20 % revisar proveedor/proceso | Referencia de operadores COD. [Andrey Business](https://www.andreybusiness.com/argentina/blog/que-de-devoluciones-es-sano-en-una-tienda-de-dropshipping-contra-entrega) |
| 8 | Transportadora y zonas | Preferir Chilexpress/Starken en zonas urbanas; evitar zonas con baja efectividad (p. ej. Iquique, Punta Arenas) al partir | Reportes de operadores en Chile. [Andrey Business](https://www.andreybusiness.com/chile/blog/ciudades-que-no-despachar-con-dropi-evita-devoluciones) |

(Las fuentes son de un operador/formador de dropshipping, no de Dropi oficial: confirmar dentro de la plataforma.)

## Orden sugerido
1. Empezar por los 2 kits del primer test (Gato Sin Pelusas y Pelo Cero) y Baño y Secado (el destacado en la portada).
2. Pedir muestras de esos 3; con las muestras, sacar fotos reales y medidas.
3. Completar el resto de la planilla de a poco; los kits que no pasen se pasan a observación o se descartan (el validador lo hace en el siguiente ciclo).

## Cómo ayudo yo
Si me envías capturas de las fichas de proveedor en Dropi (nombre, sello, calificación, stock, costo, flete), completo la planilla, recalculo la economía y te digo cuáles quedan aprobados.
