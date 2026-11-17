import { icon } from '../icons.js';
import { addDays, esc, today, weekDays, WEEKDAYS_LETTER, WEEKDAYS_SHORT } from '../util.js';
import { habitRange, habitScheduled, habitStreak } from '../logic.js';
import { add, bySpace, find, getSpace, patch, remove, spacesWith, toggleHabit } from '../store.js';
import { closeSheet, emptyState, field, on, openSheet, removeWithUndo, spaceSelect, toast } from '../ui.js';

export function streakBadge(h, now = today()) {
  const n = habitStreak(h, now);
  if (!n) return '<span class="streak zero">Sin racha</span>';
  return `<span class="streak" title="Racha actual">${icon('flame', 15)}<span class="num">${n}</span> ${n === 1 ? 'día' : 'días'}</span>`;
}

// Fila compacta para la pantalla Hoy.
export function habitTodayRow(h) {
  const now = today();
  const s = getSpace(h.spaceId);
  const done = !!h.log[now];
  return `<li class="habit-today ${done ? 'is-done' : ''}" data-color="${s?.color || 'marino'}">
    <button class="check" data-action="habit-toggle" data-id="${h.id}" data-day="${now}" aria-pressed="${done}" aria-label="${done ? 'Desmarcar' : 'Marcar'} ${esc(h.name)} de hoy"><i>${icon('check', 14)}</i></button>
    <button class="row-body" data-action="habit-open" data-id="${h.id}">
      <span class="row-title">${esc(h.name)}</span>
      <span class="row-meta"><span><i class="sq"></i>${esc(s?.name || '')}</span></span>
    </button>
    <span class="row-end">${streakBadge(h, now)}</span>
  </li>`;
}

function habitRow(h, days, now) {
  const month = habitRange(h, addDays(now, -29), now);
  const pct = month.planned ? Math.round((month.done / month.planned) * 100) : 0;
  return `<li class="habit">
    <button class="row-body" data-action="habit-open" data-id="${h.id}">
      <span class="row-title">${esc(h.name)}</span>
      <span class="row-meta">${streakBadge(h, now)}<span><span class="num">${pct}%</span> en 30 días</span></span>
    </button>
    <div class="strip" role="group" aria-label="Semana de ${esc(h.name)}">${days
      .map((day, i) => {
        const cls = `${day === now ? 'is-today' : ''} ${day > now ? 'future' : ''}`;
        if (!habitScheduled(h, day)) return `<span class="day off ${cls}">${WEEKDAYS_LETTER[i]}<i></i></span>`;
        const on = !!h.log[day];
        return `<button class="day ${cls}" data-action="habit-toggle" data-id="${h.id}" data-day="${day}" aria-pressed="${on}" ${day > now ? 'disabled' : ''} aria-label="${WEEKDAYS_SHORT[i]}: ${on ? 'cumplido' : 'sin cumplir'}">${WEEKDAYS_LETTER[i]}<i>${icon('check', 16)}</i></button>`;
      })
      .join('')}</div>
  </li>`;
}

export function renderHabits(space) {
  const habits = bySpace('habits', space.id);
  const now = today();
  const days = weekDays(now);
  const todays = habits.filter((h) => habitScheduled(h, now));
  const doneToday = todays.filter((h) => h.log[now]).length;
  return `<div class="toolbar">
      <p class="muted">${todays.length ? `<span class="num">${doneToday} de ${todays.length}</span> cumplidos hoy` : 'Hoy no toca ninguno'}</p>
      <button class="btn" data-action="habit-new" data-space="${space.id}">${icon('plus', 18)}<span>Añadir hábito</span></button>
    </div>
    ${
      habits.length
        ? `<ul class="list" data-color="${space.color}">${habits.map((h) => habitRow(h, days, now)).join('')}</ul>`
        : emptyState({ ico: 'flame', text: 'Un hábito es algo que repites ciertos días. Márcalo cada vez que lo cumplas y la racha crece.', action: 'habit-new', label: 'Añadir hábito', attrs: `data-space="${space.id}"` })
    }`;
}

export function openHabitSheet({ id, spaceId } = {}) {
  const h = id ? find('habits', id) : null;
  if (!spacesWith('habits').length) return toast('Activa Hábitos en algún espacio para añadir uno.');
  const v = h || { name: '', days: [0, 1, 2, 3, 4, 5, 6], spaceId };
  openSheet({
    title: h ? 'Editar hábito' : 'Nuevo hábito',
    submitLabel: h ? 'Guardar' : 'Añadir hábito',
    body: `
      ${field({ label: 'Hábito', name: 'name', value: v.name, placeholder: 'Ej.: leer 20 minutos', attrs: 'autofocus required maxlength="120" autocomplete="off"' })}
      ${spaceSelect('habits', v.spaceId)}
      <fieldset class="field"><legend>Qué días toca</legend>
        <div class="dows">${WEEKDAYS_LETTER.map((l, i) => `<label><input type="checkbox" name="d${i}" ${v.days.includes(i) ? 'checked' : ''} aria-label="${WEEKDAYS_SHORT[i]}"><span>${l}</span></label>`).join('')}</div>
      </fieldset>`,
    onSubmit(d) {
      const name = d.name.trim();
      if (!name) return { name: 'Ponle un nombre al hábito.' };
      const days = [0, 1, 2, 3, 4, 5, 6].filter((i) => d[`d${i}`]);
      if (!days.length) return { d0: 'Elige al menos un día.' };
      if (h) {
        patch('habits', h.id, { name, days, spaceId: d.spaceId });
        toast('Hábito guardado');
      } else {
        add('habits', { name, days, spaceId: d.spaceId, log: {}, startDate: today(), createdAt: Date.now() });
        toast('Hábito añadido');
      }
    },
    onDelete: h ? () => removeWithUndo('Hábito eliminado', () => remove('habits', h.id)) : null,
  });
}

on({
  'habit-toggle': (el) => toggleHabit(el.dataset.id, el.dataset.day),
  'habit-open': (el) => openHabitSheet({ id: el.dataset.id }),
  'habit-new': (el) => {
    closeSheet();
    openHabitSheet({ spaceId: el.dataset.space });
  },
});
