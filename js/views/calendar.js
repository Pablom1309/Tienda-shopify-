import { icon } from '../icons.js';
import { addMonths, dayAndMonth, esc, monthGrid, monthName, today, WEEKDAYS_SHORT, weekdayLong, ym } from '../util.js';
import { sortTasks } from '../logic.js';
import { getSpace, spacesWith, state } from '../store.js';
import { on, view } from '../ui.js';
import { taskRow } from '../modules/tasks.js';

// Tareas con fecha y entrenamientos, agrupados por día.
function itemsByDay() {
  const map = new Map();
  const push = (day, item) => (map.get(day) || map.set(day, []).get(day)).push(item);
  for (const t of state.tasks) if (t.due) push(t.due, { kind: 'task', t, color: getSpace(t.spaceId)?.color, title: t.title, done: t.status === 'done' });
  for (const w of state.workouts) push(w.date, { kind: 'workout', w, color: getSpace(w.spaceId)?.color, title: w.name || 'Entrenamiento', done: false });
  return map;
}

export function renderCalendar() {
  const now = today();
  const month = view.calMonth || ym(now);
  const selected = view.calDay || now;
  const map = itemsByDay();
  const weeks = monthGrid(month);

  const cells = weeks
    .flat()
    .map((day) => {
      const items = map.get(day) || [];
      const cls = `${ym(day) !== month ? 'out' : ''} ${day === now ? 'is-today' : ''}`;
      const shown = items.slice(0, 3);
      return `<button class="cal-cell ${cls}" data-action="cal-day" data-day="${day}" aria-pressed="${day === selected}" aria-label="${dayAndMonth(day)}${items.length ? `, ${items.length} ${items.length === 1 ? 'elemento' : 'elementos'}` : ''}">
        <span class="d num">${Number(day.slice(8, 10))}</span>
        ${shown.map((it) => `<span class="cal-item ${it.done ? 'done' : ''}" data-color="${it.color}"><i></i><span>${esc(it.title)}</span></span>`).join('')}
        ${items.length > 3 ? `<span class="cal-more">${items.length - 3} más</span>` : ''}
        <span class="cal-dots">${items.slice(0, 4).map((it) => `<i data-color="${it.color}"></i>`).join('')}</span>
      </button>`;
    })
    .join('');

  const dayItems = map.get(selected) || [];
  const tasks = dayItems.filter((i) => i.kind === 'task').map((i) => i.t).sort((a, b) => (a.status === 'done') - (b.status === 'done') || sortTasks(a, b));
  const workouts = dayItems.filter((i) => i.kind === 'workout').map((i) => i.w);
  const canAdd = spacesWith('tasks').length > 0;
  const title = selected === now ? 'Hoy' : `${weekdayLong(selected)} ${Number(selected.slice(8, 10))}`;

  return `
    <header class="page-head">
      <h1 class="h1" style="text-transform:capitalize">${monthName(month)}</h1>
      <div class="tools">
        <button class="btn soft sm" data-action="cal-today">Hoy</button>
        <button class="icon-btn" data-action="cal-month" data-step="-1" aria-label="Mes anterior">${icon('chevron-left')}</button>
        <button class="icon-btn" data-action="cal-month" data-step="1" aria-label="Mes siguiente">${icon('chevron-right')}</button>
      </div>
    </header>
    <div class="cal-wrap">
      <div>
        <div class="cal-dows" aria-hidden="true">${WEEKDAYS_SHORT.map((d) => `<span class="cal-dow">${d}</span>`).join('')}</div>
        <div class="cal">${cells}</div>
      </div>
      <section class="section day-panel">
        <div class="section-head"><h2 class="h2" style="text-transform:capitalize">${title}</h2><span class="aside">${dayAndMonth(selected)}</span></div>
        ${
          tasks.length || workouts.length
            ? `<ul class="list">
                ${tasks.map((t) => taskRow(t, { showSpace: true })).join('')}
                ${workouts
                  .map((w) => {
                    const s = getSpace(w.spaceId);
                    return `<li class="row" data-color="${s?.color}">
                      <span class="check" aria-hidden="true" style="color:var(--c)">${icon('dumbbell', 20)}</span>
                      <button class="row-body" data-action="workout-open" data-id="${w.id}">
                        <span class="row-title">${esc(w.name || 'Entrenamiento')}</span>
                        <span class="row-meta"><span><i class="sq"></i>${esc(s?.name || '')}</span>${w.duration ? `<span class="num">${w.duration} min</span>` : ''}</span>
                      </button>
                    </li>`;
                  })
                  .join('')}
              </ul>`
            : '<p class="muted">No hay nada este día.</p>'
        }
        ${canAdd ? `<div><button class="btn line" data-action="task-new" data-due="${selected}">${icon('plus', 18)}<span>Añadir tarea este día</span></button></div>` : ''}
      </section>
    </div>`;
}

const rerender = () => document.dispatchEvent(new Event('rumbo:render'));

on({
  'cal-day': (el) => {
    view.calDay = el.dataset.day;
    if (ym(el.dataset.day) !== (view.calMonth || ym(today()))) view.calMonth = ym(el.dataset.day);
    rerender();
  },
  'cal-month': (el) => {
    view.calMonth = addMonths(view.calMonth || ym(today()), Number(el.dataset.step));
    rerender();
  },
  'cal-today': () => {
    view.calMonth = ym(today());
    view.calDay = today();
    rerender();
  },
});
