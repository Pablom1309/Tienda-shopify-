import { icon } from '../icons.js';
import { addDays, dayAndMonth, esc, startOfWeek, today, weekDays, WEEKDAYS_LETTER, WEEKDAYS_SHORT } from '../util.js';
import { bestStreak, habitCount, habitDone, habitRange, habitScheduled, habitStreak } from '../logic.js';
import { add, bumpHabit, bySpace, find, getSpace, patch, remove, spacesWith } from '../store.js';
import { closeSheet, emptyState, field, on, openSheet, spaceSelect, tick, toast, withUndo } from '../ui.js';

const days = (n) => `${n} ${n === 1 ? 'día' : 'días'}`;

export function streakBadge(h, now = today()) {
  const n = habitStreak(h, now);
  if (!n) return '<span class="streak zero">Sin racha</span>';
  return `<span class="streak" title="Racha actual">${icon('flame', 15)}<span class="num">${n}</span> ${n === 1 ? 'día' : 'días'}</span>`;
}

const targetText = (h) => `${h.target} ${h.unit || 'veces'} al día`;

// Fila compacta para la pantalla Hoy.
export function habitTodayRow(h) {
  const now = today();
  const s = getSpace(h.spaceId);
  const done = habitDone(h, now);
  const count = habitCount(h, now);
  const counted = h.target > 1;
  return `<li class="habit-today ${done ? 'is-done' : ''}" data-color="${s?.color || 'marino'}">
    <button class="check ${counted && count && !done ? 'part' : ''}" data-action="habit-toggle" data-id="${h.id}" data-day="${now}" aria-pressed="${done}" aria-label="${counted ? `Sumar uno a ${esc(h.name)}: llevas ${count} de ${h.target}` : `${done ? 'Desmarcar' : 'Marcar'} ${esc(h.name)} de hoy`}"><i>${counted && !done && count ? `<b class="num">${count}</b>` : icon('check', 14)}</i></button>
    <button class="row-body" data-action="habit-open" data-id="${h.id}">
      <span class="row-title">${esc(h.name)}</span>
      <span class="row-meta">${counted ? `<span class="num">${count} de ${h.target} ${esc(h.unit)}</span>` : ''}<span><i class="sq"></i>${esc(s?.name || '')}</span></span>
    </button>
    <span class="row-end">${streakBadge(h, now)}</span>
  </li>`;
}

function dayButton(h, day, i, now) {
  const cls = `${day === now ? 'is-today' : ''} ${day > now ? 'future' : ''}`;
  if (!habitScheduled(h, day)) return `<span class="day off ${cls}">${WEEKDAYS_LETTER[i]}<i></i></span>`;
  const done = habitDone(h, day);
  const count = habitCount(h, day);
  const partial = h.target > 1 && count > 0 && !done;
  const state = h.target > 1 ? `${count} de ${h.target}` : done ? 'cumplido' : 'sin cumplir';
  return `<button class="day ${cls} ${partial ? 'part' : ''}" data-action="habit-toggle" data-id="${h.id}" data-day="${day}" aria-pressed="${done}" ${day > now ? 'disabled' : ''} aria-label="${WEEKDAYS_SHORT[i]}: ${state}">${WEEKDAYS_LETTER[i]}<i>${partial ? `<b class="num">${count}</b>` : icon('check', 16)}</i></button>`;
}

function habitRow(h, week, now) {
  const month = habitRange(h, addDays(now, -29), now);
  const pct = month.planned ? Math.round((month.done / month.planned) * 100) : 0;
  return `<li class="habit">
    <button class="row-body" data-action="habit-open" data-id="${h.id}">
      <span class="row-title">${esc(h.name)}</span>
      <span class="row-meta">${streakBadge(h, now)}<span><span class="num">${pct}%</span> en 30 días</span>${h.target > 1 ? `<span class="num">${esc(targetText(h))}</span>` : ''}</span>
    </button>
    <div class="strip" role="group" aria-label="Semana de ${esc(h.name)}">${week.map((day, i) => dayButton(h, day, i, now)).join('')}</div>
  </li>`;
}

export function renderHabits(space) {
  const habits = bySpace('habits', space.id);
  const now = today();
  const week = weekDays(now);
  const todays = habits.filter((h) => habitScheduled(h, now));
  const doneToday = todays.filter((h) => habitDone(h, now)).length;
  return `<div class="toolbar">
      <p class="muted">${todays.length ? `<span class="num">${doneToday} de ${todays.length}</span> cumplidos hoy` : 'Hoy no toca ninguno'}</p>
      <button class="btn" data-action="habit-new" data-space="${space.id}">${icon('plus', 18)}<span>Añadir hábito</span></button>
    </div>
    ${
      habits.length
        ? `<ul class="list" data-color="${space.color}">${habits.map((h) => habitRow(h, week, now)).join('')}</ul>
           <p class="muted small">Toca un día para marcarlo. Abre un hábito para ver y corregir su historial.</p>`
        : emptyState({ ico: 'flame', text: 'Un hábito es algo que repites ciertos días. Márcalo cada vez que lo cumplas y la racha crece.', action: 'habit-new', label: 'Añadir hábito', attrs: `data-space="${space.id}"` })
    }`;
}

// ---------- Historial (12 semanas) ----------

const WEEKS = 12;

function historyBlock(h) {
  const now = today();
  const first = addDays(startOfWeek(now), -(WEEKS - 1) * 7);
  const month = habitRange(h, addDays(now, -29), now);
  let cells = '';
  for (let row = 0; row < 7; row++) {
    cells += `<span class="heat-dow">${WEEKDAYS_LETTER[row]}</span>`;
    for (let w = 0; w < WEEKS; w++) {
      const day = addDays(first, w * 7 + row);
      if (day > now) cells += '<span class="heat future"></span>';
      else if (!habitScheduled(h, day)) cells += '<span class="heat off"></span>';
      else {
        const done = habitDone(h, day);
        const count = habitCount(h, day);
        const level = done ? 'full' : count > 0 ? 'part' : '';
        cells += `<button type="button" class="heat ${level} ${day === now ? 'is-today' : ''} ${day < h.startDate ? 'pre' : ''}" data-heat="${day}" aria-pressed="${done}" aria-label="${dayAndMonth(day)}: ${h.target > 1 ? `${count} de ${h.target}` : done ? 'cumplido' : 'sin cumplir'}"></button>`;
      }
    }
  }
  return `<dl class="figures small-figures num">
      <div class="figure"><dt>Racha actual</dt><dd>${days(habitStreak(h, now))}</dd></div>
      <div class="figure"><dt>Mejor racha</dt><dd>${days(bestStreak(h, now))}</dd></div>
      <div class="figure"><dt>Últimos 30 días</dt><dd>${month.planned ? Math.round((month.done / month.planned) * 100) : 0}%</dd></div>
    </dl>
    <div class="heatmap" style="--weeks:${WEEKS}">${cells}</div>
    <p class="hint">Las últimas ${WEEKS} semanas, la más reciente a la derecha. Toca un día para corregirlo.</p>`;
}

export function openHabitSheet({ id, spaceId } = {}) {
  const h = id ? find('habits', id) : null;
  if (!spacesWith('habits').length) return toast('Activa Hábitos en algún espacio para añadir uno.');
  const v = h || { name: '', days: [0, 1, 2, 3, 4, 5, 6], target: 1, unit: '', spaceId };
  const s = getSpace(v.spaceId);
  openSheet({
    title: h ? 'Editar hábito' : 'Nuevo hábito',
    submitLabel: h ? 'Guardar' : 'Añadir hábito',
    body: `
      ${field({ label: 'Hábito', name: 'name', value: v.name, placeholder: 'Ej.: leer 20 minutos', attrs: `${h ? '' : 'autofocus'} required maxlength="120" autocomplete="off"` })}
      ${spaceSelect('habits', v.spaceId)}
      <fieldset class="field"><legend>Qué días toca</legend>
        <div class="dows">${WEEKDAYS_LETTER.map((l, i) => `<label><input type="checkbox" name="d${i}" ${v.days.includes(i) ? 'checked' : ''} aria-label="${WEEKDAYS_SHORT[i]}"><span>${l}</span></label>`).join('')}</div>
      </fieldset>
      <div class="form-row">
        ${field({ label: 'Veces al día', name: 'target', value: v.target, attrs: 'inputmode="numeric" autocomplete="off"', hint: 'Con más de 1, cada toque suma uno' })}
        ${field({ label: 'Qué se cuenta', name: 'unit', value: v.unit, placeholder: 'vasos, páginas, minutos', attrs: 'maxlength="20" autocomplete="off"', hint: 'Opcional' })}
      </div>
      ${h ? `<fieldset class="field" data-color="${s?.color || 'marino'}"><legend>Historial</legend><div id="habit-history">${historyBlock(h)}</div></fieldset>` : ''}`,
    onOpen(d) {
      const box = d.querySelector('#habit-history');
      if (!box) return;
      box.onclick = (e) => {
        const cell = e.target.closest('[data-heat]');
        if (!cell) return;
        const cur = find('habits', h.id);
        if (cell.dataset.heat < cur.startDate) patch('habits', h.id, { startDate: cell.dataset.heat });
        bumpHabit(h.id, cell.dataset.heat);
        tick();
        box.innerHTML = historyBlock(find('habits', h.id));
        box.querySelector(`[data-heat="${cell.dataset.heat}"]`)?.focus();
      };
    },
    onSubmit(d) {
      const name = d.name.trim();
      if (!name) return { name: 'Ponle un nombre al hábito.' };
      const picked = [0, 1, 2, 3, 4, 5, 6].filter((i) => d[`d${i}`]);
      if (!picked.length) return { d0: 'Elige al menos un día.' };
      const target = Math.round(Number(String(d.target).replace(',', '.')));
      if (!(target >= 1 && target <= 999)) return { target: 'Escribe un número entre 1 y 999.' };
      const data = { name, days: picked, target, unit: d.unit.trim(), spaceId: d.spaceId };
      if (h) {
        patch('habits', h.id, data);
        toast('Hábito guardado');
      } else {
        add('habits', { ...data, log: {}, startDate: today(), createdAt: Date.now() });
        toast('Hábito añadido');
      }
    },
    onDelete: h ? () => withUndo('Hábito eliminado', () => remove('habits', h.id)) : null,
  });
}

on({
  'habit-toggle': (el) => {
    tick();
    bumpHabit(el.dataset.id, el.dataset.day);
  },
  'habit-open': (el) => openHabitSheet({ id: el.dataset.id }),
  'habit-new': (el) => {
    closeSheet();
    openHabitSheet({ spaceId: el.dataset.space });
  },
});
