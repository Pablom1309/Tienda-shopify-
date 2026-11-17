import test from 'node:test';
import assert from 'node:assert/strict';

import { addDays, addMonths, money, monthGrid, parseAmount, relDate, startOfWeek, weekdayIndex } from '../js/util.js';
import {
  categoryTotals,
  groupTasks,
  habitRange,
  habitStreak,
  lastMonths,
  monthTotals,
  records,
  spaceWeek,
  weeklyTraining,
  workoutVolume,
} from '../js/logic.js';

// 2026-11-17 es martes.
const TODAY = '2026-11-17';
const EVERY_DAY = [0, 1, 2, 3, 4, 5, 6];

test('fechas: la semana empieza en lunes', () => {
  assert.equal(weekdayIndex(TODAY), 1);
  assert.equal(startOfWeek(TODAY), '2026-11-16');
  assert.equal(startOfWeek('2026-11-22'), '2026-11-16'); // domingo
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
  assert.equal(addMonths('2026-11', 2), '2027-01');
  assert.equal(addMonths('2026-01', -1), '2025-12');
});

test('fechas: la grilla del mes cubre semanas completas', () => {
  const grid = monthGrid('2026-11');
  assert.equal(grid[0][0], '2026-10-26');
  assert.equal(grid.at(-1)[6], '2026-12-06');
  assert.ok(grid.every((w) => w.length === 7));
});

test('fechas: texto relativo', () => {
  assert.equal(relDate(TODAY, TODAY), 'Hoy');
  assert.equal(relDate('2026-11-18', TODAY), 'Mañana');
  assert.equal(relDate('2026-11-16', TODAY), 'Ayer');
  assert.equal(relDate('2026-11-20', TODAY), 'vie 20 nov');
  assert.equal(relDate('2027-01-05', TODAY), '5 ene 2027');
});

test('montos: entiende puntos y comas en español', () => {
  assert.equal(parseAmount('12.500'), 12500);
  assert.equal(parseAmount('1.234,56'), 1234.56);
  assert.equal(parseAmount('12,5'), 12.5);
  assert.equal(parseAmount('12.5'), 12.5);
  assert.equal(parseAmount('$ 45.990'), 45990);
  assert.equal(parseAmount('1,780.50'), 1780.5);
  assert.equal(parseAmount('1.250.000'), 1250000);
  assert.equal(parseAmount('12,500'), 12500);
  assert.equal(parseAmount('0,75'), 0.75);
  assert.equal(parseAmount('97.5'), 97.5);
  assert.ok(Number.isNaN(parseAmount('')));
});

test('montos: cada moneda con su formato', () => {
  const clean = (x) => x.replace(/\s/g, ' ');
  assert.equal(clean(money(1780000, 'CLP')), '$1.780.000');
  assert.equal(clean(money(1780.5, 'USD')), '$1,780.50');
  assert.equal(clean(money(1780.5, 'EUR')), '1.780,50 €');
});

test('tareas: se agrupan por atrasadas, hoy, próximas, sin fecha y hechas', () => {
  const t = (id, extra) => ({ id, status: 'todo', priority: 0, createdAt: 1, due: null, ...extra });
  const g = groupTasks(
    [
      t('a', { due: '2026-11-10' }),
      t('b', { due: TODAY, priority: 0 }),
      t('c', { due: TODAY, priority: 2 }),
      t('d', { due: '2026-11-30' }),
      t('e'),
      t('f', { status: 'done', due: '2026-11-01', doneAt: 5 }),
    ],
    TODAY,
  );
  assert.deepEqual(g.overdue.map((x) => x.id), ['a']);
  assert.deepEqual(g.today.map((x) => x.id), ['c', 'b']); // prioridad alta primero
  assert.deepEqual(g.upcoming.map((x) => x.id), ['d']);
  assert.deepEqual(g.someday.map((x) => x.id), ['e']);
  assert.deepEqual(g.done.map((x) => x.id), ['f']);
});

test('hábitos: la racha no se rompe si hoy aún no está marcado', () => {
  const h = { days: EVERY_DAY, startDate: '2026-11-01', log: { '2026-11-14': true, '2026-11-15': true, '2026-11-16': true } };
  assert.equal(habitStreak(h, TODAY), 3);
  h.log[TODAY] = true;
  assert.equal(habitStreak(h, TODAY), 4);
});

test('hábitos: la racha se corta con un día programado sin cumplir', () => {
  const h = { days: EVERY_DAY, startDate: '2026-11-01', log: { '2026-11-13': true, '2026-11-15': true, '2026-11-16': true } };
  assert.equal(habitStreak(h, TODAY), 2);
});

test('hábitos: los días no programados no cortan la racha', () => {
  // Solo lunes, miércoles y viernes.
  const h = { days: [0, 2, 4], startDate: '2026-11-01', log: { '2026-11-11': true, '2026-11-13': true, '2026-11-16': true } };
  assert.equal(habitStreak(h, TODAY), 3);
});

test('hábitos: cumplimiento de un rango respeta la fecha de inicio', () => {
  const h = { days: EVERY_DAY, startDate: '2026-11-16', log: { '2026-11-16': true } };
  assert.deepEqual(habitRange(h, '2026-11-10', TODAY), { done: 1, planned: 2 });
});

test('finanzas: totales del mes y por categoría', () => {
  const tx = [
    { type: 'in', amount: 1000, category: 'Ventas', date: '2026-11-02' },
    { type: 'out', amount: 300, category: 'Publicidad', date: '2026-11-05' },
    { type: 'out', amount: 150, category: 'Publicidad', date: '2026-11-09' },
    { type: 'out', amount: 200, category: '', date: '2026-11-10' },
    { type: 'out', amount: 999, category: 'Publicidad', date: '2026-10-30' },
  ];
  assert.deepEqual(monthTotals(tx, '2026-11'), { income: 1000, expense: 650, balance: 350 });
  assert.deepEqual(categoryTotals(tx, '2026-11'), [
    { category: 'Publicidad', total: 450 },
    { category: 'Sin categoría', total: 200 },
  ]);
  const months = lastMonths(tx, '2026-11', 3);
  assert.deepEqual(months.map((m) => m.month), ['2026-09', '2026-10', '2026-11']);
  assert.equal(months[1].expense, 999);
});

test('entrenamiento: volumen, semanas y récords', () => {
  const w1 = { date: '2026-11-16', duration: 60, exercises: [{ name: 'Sentadilla', sets: [{ reps: 5, weight: 100 }, { reps: 5, weight: 100 }] }] };
  const w2 = { date: '2026-11-09', duration: 45, exercises: [{ name: 'sentadilla ', sets: [{ reps: 3, weight: 110 }] }, { name: 'Dominadas', sets: [{ reps: 8, weight: 0 }] }] };
  assert.equal(workoutVolume(w1), 1000);
  const weeks = weeklyTraining([w1, w2], TODAY, 4);
  assert.equal(weeks.length, 4);
  assert.deepEqual(weeks.map((w) => w.sessions), [0, 0, 1, 1]);
  assert.equal(weeks[3].volume, 1000);
  assert.equal(weeks[3].minutes, 60);
  const rec = records([w1, w2]);
  assert.equal(rec.length, 1); // las dominadas sin peso no cuentan como marca
  assert.deepEqual({ weight: rec[0].weight, reps: rec[0].reps, date: rec[0].date }, { weight: 110, reps: 3, date: '2026-11-09' });
});

test('avance semanal: mezcla tareas, hábitos y entrenamientos del espacio', () => {
  const doneAt = new Date(2026, 10, 16, 12).getTime();
  const state = {
    tasks: [
      { spaceId: 's', status: 'done', due: '2026-11-16', doneAt },
      { spaceId: 's', status: 'todo', due: '2026-11-19' },
      { spaceId: 's', status: 'todo', due: '2026-11-02' }, // atrasada: sigue pendiente esta semana
      { spaceId: 's', status: 'todo', due: null }, // sin fecha: no cuenta
      { spaceId: 'otro', status: 'done', due: '2026-11-16', doneAt },
    ],
    habits: [{ spaceId: 's', days: EVERY_DAY, startDate: '2026-11-01', log: { '2026-11-16': true } }],
    workouts: [{ spaceId: 's', date: '2026-11-17', exercises: [] }],
  };
  // tareas 1/3, hábito 1/2 (lunes y martes), entrenamiento 1/1
  assert.deepEqual(spaceWeek(state, 's', TODAY), { planned: 6, done: 3, pct: 0.5 });
  assert.equal(spaceWeek(state, 'vacio', TODAY).pct, null);
});
