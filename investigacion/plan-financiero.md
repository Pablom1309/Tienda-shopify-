# Plan financiero del test (turno 2026-10-04)

Todo es **estimado**: costos de producto, flete, comisión y devoluciones no están verificados en Dropi. Cálculo reproducible: `python3 herramientas/finanzas.py` (nodo nuevo; supuestos en `datos/supuestos.json` → `finanzas`; salida `datos/finanzas.json`). Nada de esto autoriza gasto: el portón "gasto" es del dueño.

## 1. Supuestos
| Supuesto | Valor | Fuente / estado |
|---|---|---|
| Confirmación / entrega base | 85 % / 70 % (60-80 %) | `supuestos.json`, operadores COD; por calibrar |
| Mezcla oferta 2 unidades | 30 % de los pedidos | Supuesto |
| Comisión Dropi | 0 % (alternativa 3,5 %) | Operador reporta 2-5 % ([Andrey Business](https://www.andreybusiness.com/chile/blog/comisiones-dropi-cuanto-cobra-por-cada-pedido)); sin verificar |
| Flete de devolución | $0 (alternativa = flete de ida) | Sin verificar |
| Desfase de cobro | 14 días | Entrega 3-5 d + liquidación a billetera 2-7 d hábiles + retiro 2-5 d hábiles ([Andrey Business](https://www.andreybusiness.com/blog/dropi-wallet-retiros-sacar-dinero-2026)); sin verificar |
| Costos fijos | $37.000/mes | Shopify Basic US$39/mes ([Website Builder Expert](https://www.websitebuilderexpert.com/ecommerce-website-builders/shopify-pricing/)) a ~$950/US$ estimado. Hoy la tienda corre gratis en GitHub Pages |
| Test | Pelo Cero $78.000 (4 días) desde el día 1; Verano $90.000 desde el día 32 (~16-nov) | `datos/plan_ads.json` |
| Escala si pasa | $15.000/día por kit | Supuesto prudente |

## 2. Equilibrio por pedido (caso base, entrega 70 %)
| Kit | Ganancia por pedido generado antes de anuncios (G) | = CPA máximo para no perder | Con comisión 3,5 % + flete de devolución |
|---|---|---|---|
| Kit Pelo Cero | $8.925 | $8.925 | **$7.262** |
| Kit Verano Fresco | $10.835 | $10.835 | **$9.022** |

Un test de $78.000 alcanza para ~9 pedidos a CPA de equilibrio: suficiente para aplicar la regla de matar, no para juzgar la tasa de entrega real.

## 3. Sensibilidad: resultado por cada $100.000 en anuncios (Kit Pelo Cero)
| Entrega \ CPA real | $5.000 | $7.000 | $9.000 | $11.000 |
|---|---|---|---|---|
| 60 % | +$43.336 | +$2.383 | −$20.369 | −$34.847 |
| **70 %** | **+$78.492** | **+$27.494** | −$838 | −$18.867 |
| 80 % | +$113.648 | +$52.606 | +$18.693 | −$2.887 |
| 70 % con comisión + devolución | +$45.247 | +$3.748 | −$19.307 | −$33.979 |

Kit Verano Fresco (70 %): +$116.691 / +$54.779 / +$20.384 / −$1.504 para CPA $5.000 / $7.000 / $9.000 / $11.000.
**[I] Lo que más mueve el resultado es el CPA; luego la entrega.** Cada 10 puntos de entrega valen ~$35.000 por cada $100.000 invertidos. La comisión y el flete de devolución, si existen, se comen ~$30.000 de cada $100.000: verificarlos es prioridad.

## 4. Caja a 30/60/90 días (ambos kits, reglas de matar aplicadas)
| CPA real | Caja día 30 | Día 60 | Día 90 | **Caja mínima (capital que hay que tener)** | Gasto en anuncios | Pedidos |
|---|---|---|---|---|---|---|
| $5.000 | −$50.791 | +$346.685 | +$1.188.009 | **−$271.840** | $2.283.000 | 457 |
| $7.000 | −$180.565 | −$168.653 | +$164.578 | **−$400.845** | $2.283.000 | 326 |
| $9.000 | −$37.653 | −$236.175 | −$181.447 | **−$318.653** | $993.000 | 110 |
| $11.000 | −$51.716 | −$90.070 | −$127.070 | **−$179.944** | $168.000 | 15 |

Lectura:
1. **Capital de trabajo necesario: ~$300.000-$400.000** aunque el negocio funcione, porque el anuncio se paga hoy y el cobro llega ~14 días después.
2. **Pérdida máxima si nada funciona (CPA $11.000): ~$180.000** (tests de ambos kits + 3 meses de Shopify). Es el "costo de aprender".
3. **Zona gris (CPA $9.000):** Pelo Cero se apaga, Verano sigue con margen chico y al día 90 aún no recupera la caja; conviene decidir con datos de entrega reales, no solo CPA.
4. Con CPA $7.000 se recupera la inversión recién entre el día 60 y el 90.

## 5. Recomendaciones al dueño
- Reservar **$400.000** antes de partir (o partir solo con Pelo Cero: tope de pérdida ≈ $78.000 + fijos).
- Verificar en Dropi, antes de gastar: comisión, flete de devolución y días de liquidación (cambian el equilibrio ~$1.700 por pedido).
- No pagar Shopify hasta tener costos reales: la tienda actual en GitHub Pages sirve para el test si el formulario de pedido está operativo con WhatsApp.
- Revisar el resultado cada 3 días con las reglas de `datos/plan_ads.json`; recalibrar `supuestos.json` con la entrega real al día 14.
