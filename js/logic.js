// Cálculos sobre los datos (rachas, totales, avance). Puros y probados en tests/.

import { addDays, addMonths, diffDays, startOfWeek, weekDays, weekdayIndex, ym } from './util.js';

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

// ---------- Hábitos ----------

export const habitScheduled = (h, day) => h.days.includes(weekdayIndex(day));

// Días seguidos cumplidos, contando solo los días programados.
// Si hoy toca y todavía no está marcado, la racha de ayer sigue viva.
export function habitStreak(h, today) {
  let streak = 0;
  let day = today;
  if (habitScheduled(h, day) && !h.log[day]) day = addDays(day, -1);
  for (let i = 0; i < 3660; i++) {
    if (day < h.startDate) break;
    if (habitScheduled(h, day)) {
      if (!h.log[day]) break;
      streak++;
    }
    day = addDays(day, -1);
  }
  return streak;
}

// Cumplimiento entre dos fechas (inclusive): { done, planned }.
export function habitRange(h, from, to) {
  let done = 0;
  let planned = 0;
  const start = from < h.startDate ? h.startDate : from;
  for (let day = start; day <= to; day = addDays(day, 1)) {
    if (!habitScheduled(h, day)) continue;
    planned++;
    if (h.log[day]) done++;
  }
  return { done, planned };
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

// ---------- Metas ----------

export const goalPct = (g) => (g.target > 0 ? Math.min(1, Math.max(0, g.current / g.target)) : 0);

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
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
