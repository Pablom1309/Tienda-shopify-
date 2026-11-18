# Rumbo

App para gestionar lo que lleves: tu negocio, tu casa, tu entrenamiento, tus estudios.
Funciona en computador y teléfono, se instala como app y abre sin conexión.

Todo se organiza en **espacios**. Cada espacio activa las secciones que necesita:

| Sección | Qué hace |
|---|---|
| Tareas | Fecha, hora y prioridad; se repiten (cada día, de lunes a viernes, cada semana, cada mes); pasos con su propia casilla; vista de lista o tablero |
| Hábitos | Días de la semana, rachas y mejor racha; hábitos con cantidad (8 vasos de agua: cada toque suma uno); historial de 12 semanas que se puede corregir |
| Finanzas | Ingresos y gastos, balance comparado con el mes anterior, presupuesto por categoría con aviso al pasarte, movimientos fijos que se anotan solos cada mes, exportar a CSV |
| Entrenamiento | Sesiones con ejercicios, series y peso; rutinas para empezar desde la última vez; temporizador de descanso; progreso de cada ejercicio; récords |
| Notas | Apuntes por espacio, con notas fijadas |
| Metas | Número, unidad y fecha; te dice si vas al día y cuánto te falta por semana; sumar avance en vez de recalcular |

Además:

- **Hoy**: lo pendiente, los hábitos del día, los próximos 7 días y el avance de la semana por espacio.
- **Resumen**: tareas hechas por semana, constancia en hábitos, ingresos y gastos, entrenamientos y metas en curso.
- **Captura en una frase**: en "Añadir tarea" escribe `pagar la luz mañana 18:00 !alta #vida` y se separan solos la fecha, la hora, la prioridad y el espacio.
- Calendario mensual, buscador (`Ctrl K` / `⌘K`), atajos (`N` añadir; `H`, `C`, `R`, `E` para ir a cada pantalla).
- Deshacer al completar o borrar, botón atrás del teléfono que cierra la hoja abierta, deslizar hacia abajo para cerrarla.
- Tema claro y oscuro, instalable, funciona sin conexión, copia de seguridad en JSON.

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
js/logic.js, util.js    Cálculos (rachas, totales, ritmo de metas) y fechas; sin interfaz
js/quick.js             Lectura de fechas y prioridades escritas en la tarea
js/modules/             Una sección por archivo: tareas, hábitos, finanzas…
js/views/               Pantallas: Hoy, Calendario, Resumen, Espacios, Ajustes, bienvenida
tests/                  Pruebas de los cálculos y de la captura en una frase
```

## Pruebas

```bash
npm test
```

## Créditos

Tipografías [Bricolage Grotesque](https://github.com/ateliertriay/bricolage) e
[Instrument Sans](https://github.com/Instrument/instrument-sans) (SIL Open Font License).
Iconos de [Lucide](https://lucide.dev) (licencia ISC).
