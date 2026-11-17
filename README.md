# Rumbo

App para gestionar lo que lleves: tu negocio, tu casa, tu entrenamiento, tus estudios.
Funciona en computador y teléfono, se instala como app y abre sin conexión.

Todo se organiza en **espacios**. Cada espacio activa las secciones que necesita:

| Sección | Qué hace |
|---|---|
| Tareas | Pendientes con fecha, hora y prioridad, en lista o tablero (por hacer, en curso, hecha) |
| Hábitos | Rutinas por día de la semana, con racha y cumplimiento de 30 días |
| Finanzas | Ingresos y gastos, balance del mes, gráfico de 6 meses y gasto por categoría |
| Entrenamiento | Sesiones con ejercicios, series, repeticiones y peso; volumen semanal y mejores marcas |
| Notas | Apuntes por espacio, con notas fijadas |
| Metas | Objetivos con número, unidad y fecha límite |

Además: pantalla **Hoy** con el avance de la semana por espacio, **Calendario** mensual,
buscador (`Ctrl K` o `⌘K`), alta rápida (tecla `N`), tema claro y oscuro, y copia de seguridad en JSON.

## Probarla en tu computador

Necesita un servidor web local (los módulos de JavaScript no cargan con doble clic):

```bash
npm start          # o: python3 -m http.server 5173
```

Abre <http://localhost:5173>. No hay dependencias que instalar ni paso de compilación.

## Publicarla (gratis, con GitHub Pages)

1. Fusiona esta rama en `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**, rama `main`, carpeta `/ (root)`.
3. En un par de minutos queda en `https://<tu-usuario>.github.io/<repositorio>/`.

Sirve igual en Netlify, Vercel o Cloudflare Pages: es un sitio estático, se sube la carpeta tal cual.

## Instalarla como app

Con la app publicada en una dirección `https://`:

- **Android (Chrome):** menú ⋮ → *Instalar app* o *Añadir a pantalla de inicio*.
- **iPhone (Safari):** botón Compartir → *Añadir a pantalla de inicio*.
- **Computador (Chrome, Edge):** icono de instalar en la barra de direcciones.

## Dónde se guardan los datos

En el propio dispositivo (`localStorage` del navegador). No hay cuentas ni servidor.
Eso significa que **cada dispositivo tiene sus propios datos**: para pasarlos de uno a otro,
o para respaldarlos, usa *Ajustes → Exportar* e *Importar*. Si borras los datos del navegador, se pierden.

## Estructura

```
index.html              Armazón de la página
manifest.webmanifest    Datos para instalarla como app
sw.js                   Funcionamiento sin conexión (sube VERSION al publicar cambios)
css/app.css             Sistema visual completo (colores, tipografía, componentes)
js/app.js               Navegación, buscador y alta rápida
js/store.js             Estado y guardado
js/logic.js, util.js    Cálculos (rachas, totales, avance) y fechas; sin interfaz
js/modules/             Una sección por archivo: tareas, hábitos, finanzas…
js/views/               Pantallas: Hoy, Calendario, Espacios, Ajustes, bienvenida
tests/                  Pruebas de los cálculos
```

## Pruebas

```bash
npm test
```

## Créditos

Tipografías [Bricolage Grotesque](https://github.com/ateliertriay/bricolage) e
[Instrument Sans](https://github.com/Instrument/instrument-sans) (SIL Open Font License).
Iconos de [Lucide](https://lucide.dev) (licencia ISC).
