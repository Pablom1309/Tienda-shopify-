# Mapa de sushi · comuna de Santiago (Ocean Broker)

Mapa de prospección para vender salmón a los locales de sushi de la comuna de
Santiago. Muestra cada local con su información, permite marcarlo como
visitado y guardar notas de venta. Funciona en celular y computador con los
mismos datos.

## Publicarlo en Vercel

1. **Importar el proyecto.** En [vercel.com/new](https://vercel.com/new) elige
   este repositorio y pulsa *Deploy*. No hay que cambiar ninguna opción.
2. **Crear la base de datos.** En el proyecto, pestaña **Storage** →
   *Create Database* → **Neon (Postgres)** → plan gratuito → *Connect* al
   proyecto. Esto agrega sola la variable `DATABASE_URL`.
3. **Definir la clave de acceso.** *Settings* → *Environment Variables* →
   agrega `APP_PASSWORD` con la clave que quieras usar.
4. **Volver a publicar.** Pestaña *Deployments* → menú `⋯` del último →
   *Redeploy*, para que tome la base de datos y la clave.

Al entrar por primera vez con la clave, el sitio carga solo los locales.

## Uso

- **Pines por color:** naranjo pendiente, azul visitado, verde cliente, gris
  descartado.
- **Ficha del local:** toca un pin o un nombre de la lista. Elige el estado,
  completa contacto, proveedor actual, consumo, precio y notas, y pulsa
  *Guardar*.
- **＋ Agregar local:** para los que no aparezcan. Toca el botón y luego el
  punto del mapa donde está el local.
- **◎ Mi ubicación:** centra el mapa donde estás.
- **Menú ⋯:** *Actualizar locales* (vuelve a consultar OpenStreetMap y agrega
  los nuevos sin tocar tus notas), *Exportar a Excel (CSV)* y *Cerrar sesión*.

Los locales vienen de OpenStreetMap, que no tiene todos los que muestra Google
Maps; los que falten se agregan a mano.

## Probarlo en un computador

```
npm install
DATABASE_URL=postgres://usuario:clave@localhost:5432/sushi APP_PASSWORD=prueba npm run dev
npm test
```

## Estructura

- `public/` — la página (mapa con Leaflet).
- `api/` — funciones de Vercel: `locales` (leer, guardar, agregar, eliminar),
  `importar` (OpenStreetMap) y `comuna` (límite comunal).
- `lib/` — base de datos, clave de acceso y consulta a OpenStreetMap.
- `data/` — límite de la comuna y copia de respaldo de los locales.
