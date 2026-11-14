# Mapa de locales de sushi — comuna de Santiago (Ocean Broker)

## Para qué
Herramienta de prospección para vender salmón de Ocean Broker a los locales de
sushi de la comuna de Santiago. Se usa en terreno desde el celular y en el
computador; lo que se anota en uno aparece en el otro.

## Objetivos
- Ver en un mapa todos los locales de sushi de la comuna, con su información.
- Marcar cada local como visitado.
- Guardar notas e información comercial por local.
- Mismos datos en celular y computador.

## Fuera de alcance
- Integrarlo dentro del sitio de Ocean Broker (su código no está en este
  repositorio). Queda como página aparte que se puede enlazar.
- Cuentas por usuario, historial de cambios, rutas optimizadas.

## Qué no debe pasar
- Perder notas ya guardadas (por ejemplo al actualizar la lista de locales).
- Que cualquiera con el enlace pueda leer o editar las notas.

## Alternativas consideradas
1. **Página única + funciones de Vercel + base Postgres de Vercel (elegida).**
   Sin paso de compilación, pocas piezas, y cada local es una fila, así que
   guardar desde el celular y el computador a la vez no se pisa.
2. Aplicación Next.js. Lo mismo pero con mucha más maquinaria para una sola
   pantalla.
3. Guardar todo como un único archivo (Vercel Blob/KV). Más simple, pero dos
   dispositivos guardando a la vez se sobrescriben.

Vercel como plataforma lo decidió Pablo; el resto son decisiones mías.

## Diseño
**Pantalla.** Mapa a pantalla completa (Leaflet + OpenStreetMap) con el borde
de la comuna dibujado. Pines por estado: pendiente, visitado, cliente,
descartado. Arriba: buscador, filtro por estado y contador ("12 de 140
visitados"). Lista de locales alternable con el mapa en celular y al costado
en computador. Botón "Mi ubicación".

**Ficha del local** (al tocar un pin): nombre, dirección, teléfono, web,
horario cuando existan; botón "Cómo llegar" (abre Google Maps); y los campos
propios:
- estado y fecha de visita
- persona de contacto y su teléfono
- proveedor actual de salmón, consumo aproximado (kg/semana), precio que paga
- notas libres

**Locales.** Se obtienen de OpenStreetMap (restaurantes con cocina
sushi/japonesa/nikkei o "sushi" en el nombre, dentro del límite comunal).
Botón "Actualizar locales" que vuelve a consultar y agrega los nuevos sin
tocar notas. Botón "Agregar local" para los que falten (se ubica tocando el
mapa). OpenStreetMap no tiene todos los locales que muestra Google Maps.

**Datos.** Tabla `locales` en Postgres: datos del local + campos propios +
fecha de modificación. Funciones en `/api`: listar, guardar un local, agregar,
importar desde OpenStreetMap, exportar a CSV.

**Acceso.** Una sola clave compartida (variable `APP_PASSWORD` en Vercel); se
pide una vez por dispositivo.

**Publicación (la hace Pablo, 3 pasos en Vercel):** importar este repositorio,
crear la base de datos en la pestaña Storage, definir la clave. Se entregan
las instrucciones paso a paso.

## Queda a criterio de quien construye
Estilo visual, estructura de archivos, forma exacta de la consulta a
OpenStreetMap y las pruebas.
