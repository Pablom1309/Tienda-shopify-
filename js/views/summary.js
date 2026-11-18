// Resumen: cómo va todo, sumando los espacios.

import { icon } from '../icons.js';
import { barChart, heatGrid, inOutChart } from '../charts.js';
import { addDays, dayAndMonth, esc, money, monthShort, startOfWeek, today, ym } from '../util.js';
import { goalPace, goalPct, habitDayRate, habitRange, lastMonths, monthTotals, tasksDonePerWeek, weeklyTraining } from '../logic.js';
import { getSpace, state } from '../store.js';
import { currency } from '../ui.js';

const WEEKS = 12;
const shortDay = (d) => `${Number(d.slice(8, 10))} ${monthShort(d)}`;

export function renderSummary() {
  const now = today();
  const cur = currency();
  const hasTasks = state.tasks.length > 0;
  const hasHabits = state.habits.length > 0;
  const hasTx = state.tx.length > 0;
  const hasWorkouts = state.workouts.length > 0;
  const openGoals = state.goals.filter((g) => goalPct(g) < 1);

  if (!hasTasks && !hasHabits && !hasTx && !hasWorkouts && !state.goals.length) {
    return `<header class="page-head"><h1 class="h1">Resumen</h1></header>
      <div class="empty">${icon('trending-up', 28)}<p>Aquí verás cómo vas con todo: tareas hechas por semana, constancia en tus hábitos, balance y entrenamientos. Empieza anotando algo en un espacio.</p><a class="btn" href="#espacios">Ir a mis espacios</a></div>`;
  }

  const figures = [];
  const taskWeeks = tasksDonePerWeek(state.tasks, now, 8);
  if (hasTasks) {
    const late = state.tasks.filter((t) => t.status !== 'done' && t.due && t.due < now).length;
    figures.push(`<div class="figure"><dt>Tareas hechas esta semana</dt><dd>${taskWeeks.at(-1).done}</dd>${late ? `<small class="neg">${late} ${late === 1 ? 'atrasada' : 'atrasadas'}</small>` : '<small>Ninguna atrasada</small>'}</div>`);
  }
  if (hasHabits) {
    let done = 0;
    let planned = 0;
    for (const h of state.habits) {
      const r = habitRange(h, addDays(now, -29), now);
      done += r.done;
      planned += r.planned;
    }
    figures.push(`<div class="figure"><dt>Hábitos cumplidos</dt><dd>${planned ? Math.round((done / planned) * 100) : 0}%</dd><small>Últimos 30 días</small></div>`);
  }
  if (hasTx) {
    const t = monthTotals(state.tx, ym(now));
    figures.push(`<div class="figure"><dt>Balance del mes</dt><dd class="${t.balance < 0 ? 'neg' : 'pos'}">${money(t.balance, cur)}</dd><small>Todos los espacios</small></div>`);
  }
  if (hasWorkouts) {
    const n = state.workouts.filter((w) => ym(w.date) === ym(now)).length;
    figures.push(`<div class="figure"><dt>Entrenamientos del mes</dt><dd>${n}</dd><small>${weeklyTraining(state.workouts, now, 1)[0].sessions} esta semana</small></div>`);
  }

  // Calor de hábitos: una celda por día, 12 semanas.
  let heat = '';
  if (hasHabits) {
    const first = addDays(startOfWeek(now), -(WEEKS - 1) * 7);
    const cells = [];
    for (let i = 0; i < WEEKS * 7; i++) {
      const day = addDays(first, i);
      const rate = day > now ? null : habitDayRate(state.habits, day);
      const level = rate === null ? null : rate === 0 ? 0 : rate < 0.5 ? 1 : rate < 0.75 ? 2 : rate < 1 ? 3 : 4;
      cells.push({ level, title: rate === null ? dayAndMonth(day) : `${dayAndMonth(day)}: ${Math.round(rate * 100)}% cumplido` });
    }
    heat = `<section class="section">
      <div class="section-head"><h2 class="h2">Constancia en hábitos</h2><span class="aside">Últimas ${WEEKS} semanas, cada cuadro es un día</span></div>
      <div class="heat-wrap">${heatGrid(cells, WEEKS)}</div>
      <div class="key"><span>Menos</span><span class="heat-key"><i class="h-0"></i><i class="h-1"></i><i class="h-2"></i><i class="h-3"></i><i class="h-4"></i></span><span>Más</span></div>
    </section>`;
  }

  return `
    <header class="page-head"><h1 class="h1">Resumen</h1></header>
    <dl class="figures num">${figures.join('')}</dl>
    <div class="cols even">
      ${
        hasTasks
          ? `<section class="section" data-color="marino">
              <div class="section-head"><h2 class="h2">Tareas hechas por semana</h2><span class="aside">Últimas 8 semanas</span></div>
              ${barChart(taskWeeks.map((w) => ({ label: shortDay(w.start), value: w.done, title: `Semana del ${shortDay(w.start)}: ${w.done} hechas` })), 'Tareas hechas por semana')}
            </section>`
          : ''
      }
      ${heat}
      ${
        hasTx
          ? `<section class="section">
              <div class="section-head"><h2 class="h2">Ingresos y gastos</h2><div class="key"><span><i class="k-in"></i>Ingresos</span><span><i class="k-out"></i>Gastos</span></div></div>
              ${inOutChart(lastMonths(state.tx, ym(now), 6))}
            </section>`
          : ''
      }
      ${
        hasWorkouts
          ? `<section class="section" data-color="baliza">
              <div class="section-head"><h2 class="h2">Entrenamientos por semana</h2><span class="aside">Últimas 8 semanas</span></div>
              ${barChart(weeklyTraining(state.workouts, now, 8).map((w) => ({ label: shortDay(w.start), value: w.sessions, title: `Semana del ${shortDay(w.start)}: ${w.sessions} sesiones` })), 'Entrenamientos por semana')}
            </section>`
          : ''
      }
    </div>
    ${
      openGoals.length
        ? `<section class="section">
            <div class="section-head"><h2 class="h2">Metas en curso</h2></div>
            <ul class="list">${openGoals
              .sort((a, b) => (a.due || '9999') < (b.due || '9999') ? -1 : 1)
              .slice(0, 8)
              .map((g) => {
                const s = getSpace(g.spaceId);
                const p = goalPace(g, now);
                const label = { ontrack: 'Al día', behind: 'Atrasada', late: 'Vencida' }[p.status];
                const tone = { ontrack: 'boya', behind: 'faro', late: 'baliza' }[p.status];
                return `<li class="goal" data-color="${s?.color || 'marino'}">
                  <div class="goal-top"><a class="row-body" href="#e-${g.spaceId}" data-action="goto-goals" data-id="${g.spaceId}"><span class="row-title">${esc(g.name)}</span><span class="row-meta"><span><i class="sq"></i>${esc(s?.name || '')}</span></span></a>
                  ${label ? `<span class="chip" style="--c:var(--${tone})">${label}</span>` : ''}<span class="pct-sm num">${Math.round(goalPct(g) * 100)}%</span></div>
                  <div class="progress"><i style="width:${goalPct(g) * 100}%"></i></div>
                </li>`;
              })
              .join('')}</ul>
          </section>`
        : ''
    }`;
}
