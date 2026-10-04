# Kimo — tienda autónoma de dropshipping (Chile)

Tienda de kits de cuidado para mascotas con pago contra entrega, operada por un **grafo de agentes** que investiga el mercado, busca productos, los valida con números, genera la tienda y el plan de anuncios, y se ejecuta solo todos los días.

## Cómo funciona

```
investigador-mercado ─► cazador-productos ─► economia* ─► puntaje* ─► validador (portón)
        ▲                       ▲                                       │
        │                       └──── 0 aprobados (máx. 2 reintentos) ──┤
        │                                                               ▼ ≥1 aprobado
analista-resultados ◄── datos/resultados/*.csv              creador-tienda
 (solo con ventas reales)                                  ┌──────┴───────┐
                                                construir-sitio*    estratega-ads
                                                           └──────┬───────┘
                                                               auditor ─► commit + push
* = nodo de código (gratis, determinista)
```

- **Pizarra compartida:** `estado/estado.json`. **Historial:** `estado/bitacora.md`.
- **Ejecución incremental:** cada nodo tiene TTL; si nada venció, el ciclo solo verifica (barato).
- **Modelos por nivel:** haiku para auditar, sonnet para investigar y escribir, opus solo para el portón.
- **Portones humanos:** cuentas, dinero y publicación. El sistema prepara todo y espera tu aprobación.

## Estado actual (ciclo 1)

| Producto | Precio | Oferta 2 | CPA equilibrio | ROAS equilibrio | Estado |
|---|---|---|---|---|---|
| Kit Pelo Cero (cepillo a vapor + removedor) | $26.990 | $47.990 | $6.908 | 3,73 | aprobado para test |
| Kit Verano Fresco (alfombra refrigerante + botella) | $32.990 | $57.990 | $8.514 | 3,74 | aprobado, lanzar 16-nov |

Supuestos: confirmación 85 %, entrega 70 %, 30 % de pedidos con oferta de 2. **Costos estimados: verificar en Dropi CL.**

## Lo que necesita el dueño (una sola vez)

1. **Dropi Chile:** crear cuenta, validar identidad y banco; anotar en `estado/instrucciones.md` el costo real de cada componente y si un mismo proveedor despacha el kit completo.
2. **WhatsApp Business** y datos legales: completar `datos/tienda.json` (whatsapp, correo, dirección, razón social, RUT).
3. **Publicar el sitio gratis:** GitHub → Settings → Pages → Source: *GitHub Actions*. Luego poner la URL en `datos/tienda.json → url_sitio`.
4. **Gasto en anuncios:** revisar `datos/plan_ads.json` y aprobar escribiéndolo en el buzón.
5. Cuando haya ventas, subir un CSV a `datos/resultados/` con el formato de `PLANTILLA.csv`.

## Comandos

```bash
python3 herramientas/economia.py        # unidad económica por producto
python3 herramientas/puntaje.py         # ranking + portón duro
python3 herramientas/construir_sitio.py # genera sitio/ y shopify/productos.csv
python3 herramientas/verificar.py       # controles de calidad y políticas
```

En Claude Code: `/ciclo` ejecuta un ciclo completo del orquestador.
