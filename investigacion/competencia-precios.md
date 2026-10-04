# Competencia real con precios (turno 2026-10-04)

Leyenda: **[V]** dato leído en la fuente el 2026-10-04 · **[I]** inferencia nuestra.
Método: descarga directa de los resultados de búsqueda de Falabella (marketplace, datos `__NEXT_DATA__`) y Paris (datos estructurados schema.org). Precio = el menor precio mostrado por aviso (incluye ofertas). No incluye envío.
**Mercado Libre Chile no se pudo leer:** la página de búsqueda devuelve verificación anti-bots y la API pública responde 403 (requiere credenciales). No se intentó rodearlo. Tiendas especializadas (SuperZoo, Club de Perros y Gatos) no tienen buscador accesible por URL; Petco CL y TusMascotas sí responden, quedan para un próximo turno.

## Precios por componente (CLP)

| Componente | Fuente | Avisos | Mínimo | Mediana | Máximo | Notas |
|---|---|---|---|---|---|---|
| Cepillo a vapor | [Falabella](https://www.falabella.com/falabella-cl/search?Ntt=cepillo+vapor+mascotas) | 50 | 3.750 | 7.445 | 29.990 | Los más reseñados: $4.990-$5.490 (12 reseñas, 4,5-4,7★) |
| Cepillo a vapor | [Paris](https://www.paris.cl/search?q=cepillo%20vapor%20mascota) | 10 | 5.490 | 9.990 | 42.000 | "3 en 1 USB" a $5.490-$5.990 |
| Removedor de pelo | [Falabella](https://www.falabella.com/falabella-cl/search?Ntt=removedor+pelo+mascotas) | 46 | 3.190 | 9.990 | 24.000 | Mezcla guantes, peines y rodillos |
| Removedor de pelo | [Paris](https://www.paris.cl/search?q=removedor%20pelo%20mascota) | 9 | 3.790 | 6.990 | 20.990 | Rodillo reutilizable $4.990-$6.990 |
| Manta/alfombra refrescante | [Falabella](https://www.falabella.com/falabella-cl/search?Ntt=manta+refrescante+perro) | 49 | 4.990 | 14.839 | 62.990 | 45x60 Sodimac $10.690 (12 reseñas); 50x65 ~$9.990; XL 93x78 $62.990 |
| Manta/alfombra refrescante | [Paris](https://www.paris.cl/search?q=manta%20refrescante%20perro) | 30 | 7.992 | 14.340 | 27.990 | 40x50 $8.500-$12.790; 50x65 $11.990-$19.990 |
| Botella bebedero | [Falabella](https://www.falabella.com/falabella-cl/search?Ntt=botella+bebedero+perro) | 50 | 2.590 | 5.990 | 16.990 | |
| Botella bebedero | [Paris](https://www.paris.cl/search?q=botella%20agua%20perro) | 11 | 6.390 | 8.990 | 13.990 | |
| Fuente de agua gatos | [Falabella](https://www.falabella.com/falabella-cl/search?Ntt=fuente+agua+gatos) | 53 | 4.990 | 15.990 | 39.990 | 2,4 L + filtro $19.490 (32 reseñas, 4,3★); pack 12 filtros $6.980 |

## Cómo se presentan (observación)
- **[V]** Títulos largos con palabras clave ("Cepillo Vapor Automático Para Gatos Perro…"), vendedores marketplace pequeños (SpA importadoras), pocas reseñas (0-32 por aviso). Ninguna marca dominante en cepillo, removedor ni botella; en mantas aparece Sodimac.
- **[V]** Las mantas se venden por medida (40x50, 50x65, 90x50, XL); casi nadie explica qué medida corresponde a qué perro.
- **[I]** Ningún competidor vende el problema resuelto (kit "pelo" o "verano"); todos venden la pieza suelta.

## Comparación con nuestros kits
| Kit | Nuestro precio | Suma de piezas (medianas Falabella / Paris) | Suma de piezas más baratas bien reseñadas | Prima nuestra |
|---|---|---|---|---|
| Kit Pelo Cero (cepillo + removedor) | $26.990 | $17.435 / $16.980 | ~$10.000 | +55 % a +170 % |
| Kit Verano Fresco (alfombra + botella) | $32.990 | $20.829 / $23.330 | ~$16.700 | +41 % a +98 % |

## Conclusiones
1. **[V]** El cepillo a vapor es un commodity barato en Chile: mediana $7.445 en Falabella y hay avisos con reseñas a $4.990. Venderlo suelto a $19.990 no es creíble; dentro del kit, la prima es alta.
2. **[I]** Si el retail está en $3.750-$5.490, el costo mayorista real del cepillo probablemente es menor que nuestro supuesto de $6.500. Bueno para el margen, pero **no se cambia el costo hasta verlo en Dropi** (regla: costos no verificados quedan "estimados").
3. **[I]** Nuestra prima solo se sostiene con lo que el marketplace no da: pago contra entrega, kit que resuelve un problema, guía de uso/tallas, atención por WhatsApp. El cliente que compare pieza a pieza encontrará más barato: la landing no debe invitar a esa comparación ni mostrar "precios de referencia".
4. **[I]** Kit Verano tiene mejor posición relativa (prima menor) que Kit Pelo Cero.
5. **Recomendación al validador (no se cambia el catálogo en este turno):** reevaluar Kit Pelo Cero a $22.990-$24.990 una vez conocido el costo real, o sumar una tercera pieza de bajo costo (p. ej., peine/guante) para que la suma de piezas se acerque al precio. Ver tarea nueva en el backlog.
6. Oportunidad de contenido: **guía de tallas de alfombra** (nadie la ofrece) → ya está en el backlog (Prioridad 3).

## Pendiente
- Mercado Libre Chile: requiere navegador con sesión o la cuenta del dueño (anotado en Bloqueadas).
- Costos de envío de cada competidor (no vienen en los resultados de búsqueda).
- Petco CL y TusMascotas (tiendas especializadas).
