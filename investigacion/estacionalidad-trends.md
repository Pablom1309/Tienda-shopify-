# Estacionalidad con Google Trends Chile (turno 2026-10-04)

Fuente: Google Trends, geo = CL, descarga directa el 2026-10-04. Datos crudos: `investigacion/datos-competencia/trends_mensual_10a.json` (oct-2016 a sep-2026, mensual) y `trends_semanal_5a.json` (semanal, 5 años).
Cómo leerlo: el **índice mensual** = promedio de ese mes en 10 años ÷ promedio general (1,0 = mes normal; 3,0 = el triple). Cada término está escalado por separado (0-100), así que **no compara volumen entre términos**; la comparación directa quedó pendiente porque Google respondió 429 (límite de solicitudes).
Leyenda: **[V]** cálculo sobre los datos descargados · **[I]** inferencia.

## Resultados (serie mensual 10 años)
| Término | Meses en 0 | Picos (índice) | Valles | Tendencia 2025-26 vs 2024-25 |
|---|---|---|---|---|
| manta refrescante | 73 % | **dic 4,9 · ene 3,3 · nov 1,8** | abr-sep ≈ 0 | +8 % |
| piscina para perros | 72 % | **dic 4,4 · ene 3,4 · nov 2,2** | abr-sep ≈ 0 | +30 % |
| pelo de perro | 0 % | ene 1,18 · sep 1,15 · dic 1,15 | abr 0,79 · may 0,80 | +14 % (+62 % vs 2017-18) |
| cepillo para perros | 27 % | nov 1,14 · jul 1,13 · sep 1,11 | jun 0,82 · mar 0,84 | −10 % (fuerte alza desde 2017) |
| cepillo gato | 44 % | **oct 1,52** · ene 1,31 · ago 1,25 | may 0,62 · mar 0,63 | +27 % |
| fuente para gatos | 37 % | ene 1,38 · dic 1,14 | abr 0,82 | +9 % |

[V] En la serie semanal de 5 años, la mayoría de los términos tiene 82-100 % de semanas en 0: **el volumen de búsqueda en Chile es bajo** para estos términos exactos. "pelo de perro" es el único sin ceros.

## Lectura para el calendario
1. **[V] Verano es real y concentrado:** manta refrescante y piscina para perros multiplican su búsqueda ×4-5 en diciembre y ×3 en enero; parten en noviembre y mueren en marzo. **Confirma** lanzar Kit Verano Fresco desde mediados de noviembre y apagarlo en febrero. [I] La ventana útil es de ~10 semanas (mediados de nov a fines de ene).
2. **[V] Pelo/cepillado es parejo todo el año** (índices 0,8-1,2), con leves alzas en sep-ene (primavera-verano) y en jul. **[I] La "muda de primavera" existe pero es suave:** Kit Pelo Cero es producto de todo el año, no de temporada; el empuje de oct-nov es un plus, no la razón de ser.
3. **[V] Cepillo para gatos tiene su pico en octubre (1,52)** y búsqueda en alza (+27 %). [I] Refuerza un ángulo específico para dueños de gatos en Kit Pelo Cero ahora.
4. **[V] Fuente para gatos es estable** (sin estacionalidad marcada, leve alza en ene). [I] Bueno para un 2.º producto de recompra: demanda pareja todo el año.
5. **[I] Búsqueda baja ≠ demanda baja:** estos productos se descubren en Instagram/TikTok más que en Google. Trends sirve para el **cuándo**, no para el **cuánto**.

## Implicancias
- Calendario confirmado: Kit Pelo Cero ya (oct-nov, ángulo gatos incluido); Kit Verano Fresco del 16-nov al 31-ene.
- SEO: la guía "Verano con tu perro" debe publicarse antes de mediados de noviembre para alcanzar a indexarse antes del pico de diciembre.
- Pendiente: comparar volumen entre términos en una sola consulta cuando Google levante el límite (429).
