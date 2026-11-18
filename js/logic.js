// Cálculos sobre los datos (rachas, totales, avance). Puros y probados en tests/.

import { addDays, addMonths, diffDays, startOfWeek, uid, weekDays, weekdayIndex, ym, ymd } from './util.js';

// ---------- Tareas ----------

export const isOverdue = (t, today) => t.status !== 'done' && t.due && t.due < today;

export function sortTasks(a, b) {
  if ((a.due || '9999') !== (b.due || '9999')) return (a.due || '9999') < (b.due || '9999') ? -1 : 1;
  if ((a.time || '99') !== (b.time || '99')) return (a.time || '99') < (b.time || '99') ? -1 : 1;
  if (a.priority !== b.priority) return b.priority - a.priority;
  return a.createdAt - b.createdAt;
}

// Agrupa las tareas en los bloques que muestra la lista.
export function groupTasks(tasks, today) {
  const g = { overdue: [], today: [], upcoming: [], someday: [], done: [] };
  for (const t of tasks) {
    if (t.status === 'done') g.done.push(t);
    else if (!t.due) g.someday.push(t);
    else if (t.due < today) g.overdue.push(t);
    else if (t.due === today) g.today.push(t);
    else g.upcoming.push(t);
  }
  for (const k of ['overdue', 'today', 'upcoming', 'someday']) g[k].sort(sortTasks);
  g.done.sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
  return g;
}

// Próxima fecha de una tarea que se repite: la siguiente a su fecha que caiga después de hoy.
export function nextRepeatDate(due, repeat, today) {
  const step = (d) => {
    if (repeat === 'daily') return addDays(d, 1);
    if (repeat === 'weekly') return addDays(d, 7);
    if (repeat === 'weekdays') {
      let n = addDays(d, 1);
      while (weekdayIndex(n) > 4) n = addDays(n, 1);
      return n;
    }
    if (repeat === 'monthly') return sameDayNextMonth(d, Number(due.slice(8, 10)));
    return null;
  };
  let next = step(due);
  if (!next) return null;
  while (next <= today) next = step(next);
  return next;
}

// Mismo día del mes siguiente; si no existe (31 en un mes de 30), el último día.
function sameDayNextMonth(d, wantedDay) {
  const m = addMonths(ym(d), 1);
  const last = new Date(Number(m.slice(0, 4)), Number(m.slice(5, 7)), 0).getDate();
  return `${m}-${String(Math.min(wantedDay, last)).padStart(2, '0')}`;
}

export const stepsDone = (t) => (t.subtasks || []).filter((x) => x.done).length;

// Tareas hechas por semana, las últimas n semanas terminando en la de `today`.
export function tasksDonePerWeek(tasks, today, n = 8) {
  const thisWeek = startOfWeek(today);
  const weeks = Array.from({ length: n }, (_, i) => ({ start: addDays(thisWeek, (i - n + 1) * 7), done: 0 }));
  for (const t of tasks) {
    if (t.status !== 'done' || !t.doneAt) continue;
    const idx = n - 1 + Math.floor(diffDays(startOfWeek(localDay(t.doneAt)), thisWeek) / 7);
    if (idx >= 0 && idx < n) weeks[idx].done++;
  }
  return weeks;
}

// ---------- Hábitos ----------

export const habitScheduled = (h, day) => h.days.includes(weekdayIndex(day));

// Cuánto se registró ese día. Los datos antiguos guardaban `true`: equivale a la meta completa.
export function habitCount(h, day) {
  const v = h.log[day];
  if (v === true) return h.target || 1;
  return Number(v) || 0;
}

export const habitDone = (h, day) => habitCount(h, day) >= (h.target || 1);

// Días seguidos cumplidos, contando solo los días programados.
// Si hoy toca y todavía no está cumplido, la racha de ayer sigue viva.
export function habitStreak(h, today) {
  let streak = 0;
  let day = today;
  if (habitScheduled(h, day) && !habitDone(h, day)) day = addDays(day, -1);
  for (let i = 0; i < 3660; i++) {
    if (day < h.startDate) break;
    if (habitScheduled(h, day)) {
      if (!habitDone(h, day)) break;
      streak++;
    }
    day = addDays(day, -1);
  }
  return streak;
}

// La racha más larga desde que empezó el hábito.
export function bestStreak(h, today) {
  let best = 0;
  let run = 0;
  for (let day = h.startDate; day <= today; day = addDays(day, 1)) {
    if (!habitScheduled(h, day)) continue;
    if (habitDone(h, day)) best = Math.max(best, ++run);
    else if (day !== today) run = 0;
  }
  return best;
}

// Cumplimiento entre dos fechas (inclusive): { done, planned }.
export function habitRange(h, from, to) {
  let done = 0;
  let planned = 0;
  const start = from < h.startDate ? h.startDate : from;
  for (let day = start; day <= to; day = addDays(day, 1)) {
    if (!habitScheduled(h, day)) continue;
    planned++;
    if (habitDone(h, day)) done++;
  }
  return { done, planned };
}

// Parte de los hábitos programados que se cumplió un día (null si no tocaba ninguno).
export function habitDayRate(habits, day) {
  let planned = 0;
  let done = 0;
  for (const h of habits) {
    if (day < h.startDate || !habitScheduled(h, day)) continue;
    planned++;
    if (habitDone(h, day)) done++;
  }
  return planned ? done / planned : null;
}

// ---------- Finanzas ----------

export function monthTotals(tx, month) {
  let income = 0;
  let expense = 0;
  for (const t of tx) {
    if (ym(t.date) !== month) continue;
    if (t.type === 'in') income += t.amount;
    else expense += t.amount;
  }
  return { income, expense, balance: income - expense };
}

export function categoryTotals(tx, month, type = 'out') {
  const map = new Map();
  for (const t of tx) {
    if (ym(t.date) !== month || t.type !== type) continue;
    const key = t.category || 'Sin categoría';
    map.set(key, (map.get(key) || 0) + t.amount);
  }
  return [...map.entries()].map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
}

// Los últimos n meses terminando en `month`, del más antiguo al más reciente.
export function lastMonths(tx, month, n = 6) {
  return Array.from({ length: n }, (_, i) => {
    const m = addMonths(month, i - n + 1);
    return { month: m, ...monthTotals(tx, m) };
  });
}

// Movimientos fijos: cada uno marcado "cada mes" genera el del mes siguiente cuando llega su día.
// La marca viaja al movimiento nuevo, así la cadena sigue. Devuelve cuántos creó.
export function materializeRecurring(state, today) {
  let created = 0;
  for (let guard = 0; guard < 600; guard++) {
    const src = state.tx.find((t) => t.repeat === 'monthly' && sameDayNextMonth(t.date, t.repeatDay || Number(t.date.slice(8, 10))) <= today);
    if (!src) break;
    const day = src.repeatDay || Number(src.date.slice(8, 10));
    state.tx.push({ ...src, id: uid(), date: sameDayNextMonth(src.date, day), repeat: 'monthly', repeatDay: day });
    src.repeat = null;
    created++;
  }
  return created;
}

// Gasto del mes por categoría junto a su presupuesto, si lo tiene.
export function budgetRows(tx, budgets, month) {
  const spent = new Map(categoryTotals(tx, month, 'out').map((c) => [c.category, c.total]));
  const rows = [];
  for (const b of budgets) {
    rows.push({ category: b.category, spent: spent.get(b.category) || 0, budget: b.amount });
    spent.delete(b.category);
  }
  for (const [category, total] of spent) rows.push({ category, spent: total, budget: null });
  return rows.sort((a, b) => b.spent - a.spent || (b.budget || 0) - (a.budget || 0));
}

// ---------- Entrenamiento ----------

export function workoutVolume(w) {
  let v = 0;
  for (const ex of w.exercises) for (const s of ex.sets) v += (Number(s.reps) || 0) * (Number(s.weight) || 0);
  return v;
}

export const workoutSets = (w) => w.exercises.reduce((n, ex) => n + ex.sets.length, 0);

// Sesiones y volumen por semana, las últimas n semanas terminando en la de `today`.
export function weeklyTraining(workouts, today, n = 8) {
  const thisWeek = startOfWeek(today);
  const weeks = Array.from({ length: n }, (_, i) => ({ start: addDays(thisWeek, (i - n + 1) * 7), sessions: 0, volume: 0, minutes: 0 }));
  for (const w of workouts) {
    const idx = n - 1 + Math.floor(diffDays(startOfWeek(w.date), thisWeek) / 7);
    if (idx < 0 || idx >= n) continue;
    weeks[idx].sessions++;
    weeks[idx].volume += workoutVolume(w);
    weeks[idx].minutes += Number(w.duration) || 0;
  }
  return weeks;
}

// Mejor marca por ejercicio: el mayor peso y, a igual peso, más repeticiones.
export function records(workouts) {
  const best = new Map();
  for (const w of workouts) {
    for (const ex of w.exercises) {
      const key = ex.name.trim().toLowerCase();
      if (!key) continue;
      for (const s of ex.sets) {
        const weight = Number(s.weight) || 0;
        const reps = Number(s.reps) || 0;
        if (!weight || !reps) continue;
        const cur = best.get(key);
        if (!cur || weight > cur.weight || (weight === cur.weight && reps > cur.reps)) {
          best.set(key, { name: ex.name.trim(), weight, reps, date: w.date });
        }
      }
    }
  }
  return [...best.values()].sort((a, b) => b.weight - a.weight);
}

// Historia de un ejercicio: por sesión, el mayor peso y sus series. De la más antigua a la más reciente.
export function exerciseHistory(workouts, name) {
  const key = name.trim().toLowerCase();
  const out = [];
  for (const w of workouts) {
    const sets = w.exercises.filter((e) => e.name.trim().toLowerCase() === key).flatMap((e) => e.sets);
    if (!sets.length) continue;
    out.push({
      date: w.date,
      top: Math.max(...sets.map((s) => Number(s.weight) || 0)),
      volume: sets.reduce((n, s) => n + (Number(s.reps) || 0) * (Number(s.weight) || 0), 0),
      sets,
    });
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : 1));
}

// Última sesión de cada nombre, de la más reciente a la más antigua: sirven como rutinas.
export function routines(workouts) {
  const latest = new Map();
  for (const w of workouts) {
    const key = (w.name || '').trim().toLowerCase();
    if (!key || !w.exercises.length) continue;
    const cur = latest.get(key);
    if (!cur || w.date > cur.date) latest.set(key, w);
  }
  return [...latest.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

// ---------- Metas ----------

export const goalPct = (g) => (g.target > 0 ? Math.min(1, Math.max(0, g.current / g.target)) : 0);

// Ritmo de una meta con fecha: compara lo que llevas con lo que tocaría llevar hoy
// si avanzaras parejo desde el inicio. `perWeek` es lo que falta repartido en las semanas que quedan.
export function goalPace(g, today) {
  if (g.current >= g.target) return { status: 'done' };
  if (!g.due) return { status: 'open' };
  const start = g.startDate || today;
  const total = Math.max(1, diffDays(g.due, start));
  const left = diffDays(g.due, today);
  if (left < 0) return { status: 'late' };
  const elapsed = Math.min(total, Math.max(0, diffDays(today, start)));
  const expected = g.target * (elapsed / total);
  const perWeek = (g.target - g.current) / Math.max(1, left / 7);
  return { status: g.current >= expected * 0.95 ? 'ontrack' : 'behind', expected, perWeek, left };
}

// ---------- Avance semanal por espacio (lo que dibuja la rosa) ----------

// Cuenta lo planificado y lo cumplido en la semana en curso:
// tareas con fecha en la semana (o completadas en ella), hábitos programados hasta hoy
// y entrenamientos registrados (cada uno suma como cumplido).
export function spaceWeek(state, spaceId, today) {
  const days = weekDays(today);
  const from = days[0];
  const to = days[6];
  let planned = 0;
  let done = 0;

  for (const t of state.tasks) {
    if (t.spaceId !== spaceId) continue;
    const doneDay = t.doneAt ? localDay(t.doneAt) : null;
    const dueInWeek = t.due && t.due >= from && t.due <= to;
    const doneInWeek = t.status === 'done' && doneDay && doneDay >= from && doneDay <= to;
    const overdueOpen = t.status !== 'done' && t.due && t.due < from;
    if (dueInWeek || doneInWeek || overdueOpen) {
      planned++;
      if (t.status === 'done') done++;
    }
  }

  for (const h of state.habits) {
    if (h.spaceId !== spaceId) continue;
    const r = habitRange(h, from, today);
    planned += r.planned;
    done += r.done;
  }

  for (const w of state.workouts) {
    if (w.spaceId !== spaceId) continue;
    if (w.date >= from && w.date <= to) {
      planned++;
      done++;
    }
  }

  return { planned, done, pct: planned ? done / planned : null };
}

export function weekOverview(state, today) {
  const spaces = state.spaces.map((s) => ({ space: s, ...spaceWeek(state, s.id, today) }));
  const planned = spaces.reduce((n, s) => n + s.planned, 0);
  const done = spaces.reduce((n, s) => n + s.done, 0);
  return { spaces, planned, done, pct: planned ? done / planned : null };
}

function localDay(ts) {
  return ymd(new Date(ts));
}
