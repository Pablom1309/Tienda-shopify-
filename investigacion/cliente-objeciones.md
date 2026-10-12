# Cliente ideal y objeciones (turno 2026-10-04)

Leyenda: **[V]** dato leído en la fuente · **[I]** inferencia nuestra.
Fuente principal: reseñas públicas (schema.org `review`) de los 9 productos con más reseñas en Falabella para nuestros componentes, leídas el 2026-10-04. Datos crudos: `investigacion/datos-competencia/resenas_falabella.json`.
**Limitaciones:** Falabella publica solo 5 reseñas por producto en la página (45 en total, ~25 con texto); algunas reseñas pertenecen a otro producto del mismo vendedor (una cadena de auto, una carpa) y se descartaron. Mercado Libre (preguntas y reseñas) sigue bloqueado por anti-bots. Muestra chica: los hallazgos son indicios, no estadística.

## 1. Lo que dicen los compradores (citas textuales)

**Cepillo a vapor** ([Falabella 4,2★/22](https://www.falabella.com/falabella-cl/product/137881216/x), [4,5★/12](https://www.falabella.com/falabella-cl/product/129649246/x))
- [V] "mi gata tiene mucho pelo y al utilizar el cepillo le quité bastante pelo muerto… con otro cepillo era imposible retirarlo por completo. Además es fácil de utilizar" (5★)
- [V] "El tamaño es un poco más pequeño que la foto, y el vapor casi no se nota. Principalmente falta un instructivo para saber cuándo está completa la carga con luz roja y verde" (3★)
- [V] "Excelente para nuestros regalones" (5★)

**Manta refrescante** ([XL 4,4★/22](https://www.falabella.com/falabella-cl/product/135909133/x), [45x60 4,9★/12](https://www.falabella.com/falabella-cl/product/125367562/x), [50x65 4,5★/11](https://www.falabella.com/falabella-cl/product/113349767/x))
- [V] "Calidad y tamaño ideal para perrito tamaño mediano. Le gusta mucho, se mantiene fresca" (5★)
- [V] "El tamaño es perfecto para mi regalona, no la ha usado aún" (5★)
- [V] "lo único malo es que se deshilacha en las orillas" (4★)

**Removedor / peine** ([4,7★/21](https://www.falabella.com/falabella-cl/product/110158489/x), [4,3★/11](https://www.falabella.com/falabella-cl/product/148744838/x))
- [V] "nada de invasivo para las mascotas… es como estar peinando al perro y va sacando todo lo malo del pelaje" (5★) · "Mango ergonómico y resistente" · "fácil de usar"

**Fuente de agua para gatos** ([4,1★/65](https://www.falabella.com/falabella-cl/product/113674114/x), [4,3★/32](https://www.falabella.com/falabella-cl/product/125983353/x))
- [V] "falla la bomba o se llena de residuos y ya no querían agua de su fuente… hay que renovarla" (5★ pese a la queja)
- [V] "Dice cambiar el filtro en un mes, ahora entiendo que es porque le salen hongos" (2★)
- [V] "piezas embutidas no atornilladas, no tiene una ventanita para ver el nivel de agua" (2★)
- [V] "no mete tanta bulla" (4★) · "mis gatos ya se acostumbraron a tomar de la fuente"

## 2. Palabras que usan (para textos y anuncios)
[V] "regalón / regalona", "mis perritos", "pelo muerto", "mucho pelo", "fácil de usar", "tamaño mediano", "se mantiene fresca", "le encantó", "bulla", "tal cual la foto".
[I] Hablan del animal como familia ("mi regalona") y miden el éxito por la reacción de la mascota ("le gusta", "le encantó"), no por especificaciones.

## 3. Objeciones y motivos de insatisfacción
| # | Objeción / queja | Evidencia | Cómo la respondemos (sin inventar) |
|---|---|---|---|
| 1 | **"¿Es igual a la foto? ¿De qué tamaño es?"** | [V] "más pequeño que la foto"; "es igual a la foto" se destaca como elogio | Medidas reales en cm junto a objeto de referencia (mano), foto real cuando haya muestra |
| 2 | **"El vapor casi no se nota"** | [V] reseña 3★ | No prometer "vapor potente": decir que es una bruma fina que humedece el pelo para que no vuele |
| 3 | **"No sé cómo cargarlo / cuánto dura"** | [V] "falta un instructivo… luz roja y verde" | Mini-guía de uso y carga en la ficha y en el WhatsApp de confirmación (tiempos "por confirmar con proveedor") |
| 4 | **"¿Qué talla le sirve a mi perro?"** | [V] compradores comentan si el tamaño fue el correcto; ningún competidor da guía | Guía de tallas (ya en backlog P3) |
| 5 | **"¿Dura? ¿se rompe/deshilacha?"** | [V] "se deshilacha en las orillas"; "piezas embutidas" | No mordedores; cuidados de limpieza; política de cambio clara |
| 6 | **Mantención y costo oculto** (fuente: filtros, bomba, hongos) | [V] 3 reseñas | Si se vende la fuente: incluir filtros y explicar el cambio; nunca prometer salud |
| 7 | **Desconfianza en tiendas desconocidas / pago** | [V, fuente operador, no estudio] Chile tiene alta desconfianza en tiendas online no conocidas y el pago contra entrega da seguridad; si el cliente no recuerda qué compró o cuándo llega, no recibe. [Andrey Business](https://www.andreybusiness.com/chile/blog/pago-contra-entrega-como-explicarlo-a-tus-clientes), [scripts de confirmación](https://www.andreybusiness.com/chile/herramientas/scripts-whatsapp-confirmacion-chile) | Pago al recibir destacado; confirmación por WhatsApp con producto, precio total y fecha; datos de contacto reales (portón humano) |
| 8 | **"Lo encuentro más barato en Falabella"** | [V] ver `competencia-precios.md` | Vender el kit/solución + guía + contra entrega; no mostrar precio de referencia |

## 4. Buyer persona (dos públicos)
**A. "Familia con perro peludo" (principal para Kit Pelo Cero y Kit Verano)**
- [V] Hogares de 5+ personas, jefe de hogar < 49 años, con niños (perfil comprador de alimento de perro, Kantar; ver `mercado-mascotas-chile.md`). 84 % urbano.
- [I] Dolor: pelo en sillón, ropa y auto en primavera; calor del perro en departamento en verano. Compra desde el celular, en la noche, vía Instagram/Facebook. Sensible a precio pero paga por "me resuelve el problema hoy y pago al recibir".

**B. "Dueña/o de gato en hogar pequeño" (fuente de agua, cepillo para gatos)**
- [V] Hogares de 1-2 personas, sin niños, mayoritariamente 50+ (Kantar). Varias reseñas del cepillo a vapor son de dueños de gatos.
- [I] Valora silencio, limpieza, facilidad; necesita instrucciones claras; más propenso a recompra (filtros).

## 5. Acciones concretas (nuevas tareas en el backlog)
1. Agregar a las FAQ de las fichas: "¿Qué tamaño tiene?" (cm), "¿Cómo se carga y cuánto dura la batería?" (por confirmar con proveedor), "¿Qué talla elijo?" (enlace a guía). → nodo creador-tienda.
2. Ajustar el copy del cepillo: describir el vapor como bruma fina; no sobreprometer. → creador-tienda + auditor.
3. Plantilla de WhatsApp de confirmación (producto, foto, total a pagar, fecha estimada) para usar cuando el dueño tenga número. → borrador, sin enviar.
4. Usar "regalón/regalona" y la reacción de la mascota como gancho en anuncios. → estratega-ads.
