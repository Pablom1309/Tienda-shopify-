import { icon } from '../icons.js';
import { rose } from '../charts.js';
import { dayAndMonth, esc, greeting, today, weekdayLong } from '../util.js';
import { habitDone, habitScheduled, sortTasks, weekOverview } from '../logic.js';
import { state } from '../store.js';
import { view } from '../ui.js';
import { quickBar, taskRow, upcomingWeek } from '../modules/tasks.js';
import { habitTodayRow } from '../modules/habits.js';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function summaryLine(open, habitsLeft) {
  const name = state.profile.name ? `, ${state.profile.name}` : '';
  const bits = [];
  if (open) bits.push(`${open} ${open === 1 ? 'tarea' : 'tareas'}`);
  if (habitsLeft) bits.push(`${habitsLeft} ${habitsLeft === 1 ? 'hábito' : 'hábitos'}`);
  if (!bits.length) return `${greeting()}${name}. Hoy no queda nada pendiente.`;
  return `${greeting()}${name}. Te ${open + habitsLeft === 1 ? 'queda' : 'quedan'} ${bits.join(' y ')} para hoy.`;
}

export function renderToday() {
  const now = today();
  const overview = weekOverview(state, now);

  const open = state.tasks.filter((t) => t.status !== 'done' && t.due && t.due <= now).sort(sortTasks);
  const doneToday = state.tasks.filter((t) => t.status === 'done' && t.doneAt && new Date(t.doneAt).toDateString() === new Date().toDateString());
  const habits = state.habits.filter((h) => habitScheduled(h, now));
  const habitsLeft = habits.filter((h) => !habitDone(h, now)).length;
  const upcoming = upcomingWeek();

  const animate = !view.roseShown;
  view.roseShown = true;

  const legend = overview.spaces
    .map(
      (it) => `<a class="legend-row" href="#e-${it.space.id}" data-color="${it.space.color}">
        <span class="tile">${icon(it.space.icon, 18)}</span>
        <span class="name">${esc(it.space.name)}</span>
        <span class="frac num">${it.pct === null ? 'Nada planificado' : `${it.done} de ${it.planned}`}</span>
        <span class="pct num ${it.pct === null ? 'none' : ''}">${it.pct === null ? '–' : `${Math.round(it.pct * 100)}%`}</span>
      </a>`,
    )
    .join('');

  return `
    ${state.profile.sample ? `<div class="notice"><span>Estás viendo datos de ejemplo para conocer la app.</span><button class="link" data-action="start-fresh">Empezar con mis datos</button></div>` : ''}
    <header class="today-head">
      <p class="over">${cap(weekdayLong(now))}</p>
      <h1 class="display">${dayAndMonth(now)}</h1>
      <p class="lead">${esc(summaryLine(open.length, habitsLeft))}</p>
    </header>

    <section class="section">
      <div class="section-head"><h2 class="h2">Rumbo de la semana</h2><span class="aside">Lo cumplido sobre lo planificado, de lunes a domingo</span></div>
      <div class="week">
        ${rose(overview, { animate })}
        <div class="legend">${legend}<a class="legend-more link" href="#resumen">Ver el resumen completo</a></div>
      </div>
    </section>

    <div class="cols">
      <section class="section">
        <div class="section-head"><h2 class="h2">Para hoy</h2>${doneToday.length ? `<span class="aside num">${doneToday.length} ${doneToday.length === 1 ? 'hecha' : 'hechas'} hoy</span>` : ''}</div>
        ${quickBar({ id: 'quick-title', dueToday: true, placeholder: 'Añadir tarea para hoy' })}
        ${
          open.length || doneToday.length
            ? `<ul class="list">${open.map((t) => taskRow(t, { showSpace: true })).join('')}${doneToday.map((t) => taskRow(t, { showSpace: true })).join('')}</ul>`
            : '<p class="muted">Nada con fecha para hoy. Lo que añadas arriba queda para hoy.</p>'
        }
        ${upcoming ? `<div class="section-head" style="margin-top:20px"><h2 class="h2">Próximos 7 días</h2></div><div>${upcoming}</div>` : ''}
      </section>

      <section class="section">
        <div class="section-head"><h2 class="h2">Hábitos de hoy</h2>${habits.length ? `<span class="aside num">${habits.length - habitsLeft} de ${habits.length}</span>` : ''}</div>
        ${habits.length ? `<ul class="list">${habits.map(habitTodayRow).join('')}</ul>` : '<p class="muted">Hoy no toca ningún hábito. Puedes crear uno dentro de un espacio.</p>'}
      </section>
    </div>`;
}
