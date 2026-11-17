import { icon } from '../icons.js';
import { diffDays, esc, num, parseAmount, relDate, today } from '../util.js';
import { goalPct } from '../logic.js';
import { add, bySpace, find, patch, remove, spacesWith } from '../store.js';
import { closeSheet, emptyState, field, on, openSheet, removeWithUndo, spaceSelect, toast } from '../ui.js';

function dueText(g, now) {
  if (!g.due) return '';
  const left = diffDays(g.due, now);
  if (goalPct(g) >= 1) return 'Cumplida';
  if (left < 0) return `Venció ${relDate(g.due, now).toLowerCase()}`;
  if (left === 0) return 'Vence hoy';
  return `Quedan ${left} ${left === 1 ? 'día' : 'días'}`;
}

export function renderGoals(space) {
  const goals = bySpace('goals', space.id).sort((a, b) => (a.due || '9999') < (b.due || '9999') ? -1 : 1);
  const now = today();
  return `<div class="toolbar">
      <span></span>
      <button class="btn" data-action="goal-new" data-space="${space.id}">${icon('plus', 18)}<span>Añadir meta</span></button>
    </div>
    ${
      goals.length
        ? `<ul class="list" data-color="${space.color}">${goals
            .map((g) => {
              const pct = goalPct(g);
              return `<li class="goal">
                <div class="goal-top">
                  <button class="row-body" data-action="goal-open" data-id="${g.id}"><span class="row-title">${esc(g.name)}</span></button>
                  <button class="btn soft sm" data-action="goal-progress" data-id="${g.id}">Actualizar avance</button>
                </div>
                <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct * 100)}" aria-label="Avance de ${esc(g.name)}"><i style="width:${pct * 100}%"></i></div>
                <div class="goal-nums num"><span><b>${num(g.current)}</b> de ${num(g.target)} ${esc(g.unit)}</span><span>${Math.round(pct * 100)}%${g.due ? `, ${esc(dueText(g, now).toLowerCase())}` : ''}</span></div>
              </li>`;
            })
            .join('')}</ul>`
        : emptyState({ ico: 'target', text: 'Una meta tiene un número al que quieres llegar y, si quieres, una fecha. Actualiza el avance cuando cambie.', action: 'goal-new', label: 'Añadir meta', attrs: `data-space="${space.id}"` })
    }`;
}

export function openGoalSheet({ id, spaceId } = {}) {
  const g = id ? find('goals', id) : null;
  if (!spacesWith('goals').length) return toast('Activa Metas en algún espacio para añadir una.');
  const v = g || { name: '', unit: '', target: '', current: 0, due: null, spaceId };
  openSheet({
    title: g ? 'Editar meta' : 'Nueva meta',
    submitLabel: g ? 'Guardar' : 'Añadir meta',
    body: `
      ${field({ label: 'Meta', name: 'name', value: v.name, placeholder: 'Ej.: correr 10 km', attrs: 'autofocus required maxlength="120" autocomplete="off"' })}
      <div class="form-row">
        ${field({ label: 'Llevo', name: 'current', value: v.current, attrs: 'inputmode="decimal" autocomplete="off"' })}
        ${field({ label: 'Quiero llegar a', name: 'target', value: v.target, placeholder: '10', attrs: 'inputmode="decimal" required autocomplete="off"' })}
        ${field({ label: 'Unidad', name: 'unit', value: v.unit, placeholder: 'km, libros, kg', attrs: 'maxlength="20" autocomplete="off"' })}
      </div>
      ${field({ label: 'Fecha límite', name: 'due', type: 'date', value: v.due || '', hint: 'Opcional' })}
      ${spaceSelect('goals', v.spaceId)}`,
    onSubmit(d) {
      const name = d.name.trim();
      if (!name) return { name: 'Ponle un nombre a la meta.' };
      const target = parseAmount(d.target);
      if (!(target > 0)) return { target: 'Escribe un número mayor que cero.' };
      const current = parseAmount(d.current);
      const data = { name, unit: d.unit.trim(), target, current: Number.isNaN(current) ? 0 : Math.max(0, current), due: d.due || null, spaceId: d.spaceId };
      if (g) patch('goals', g.id, data);
      else add('goals', { ...data, createdAt: Date.now() });
      toast(g ? 'Meta guardada' : 'Meta añadida');
    },
    onDelete: g ? () => removeWithUndo('Meta eliminada', () => remove('goals', g.id)) : null,
  });
}

function openProgressSheet(id) {
  const g = find('goals', id);
  if (!g) return;
  openSheet({
    title: g.name,
    submitLabel: 'Guardar avance',
    body: field({ label: `Cuánto llevas, de ${num(g.target)} ${g.unit}`, name: 'current', value: g.current, attrs: 'inputmode="decimal" autofocus required autocomplete="off"' }),
    onOpen: (d) => d.querySelector('input')?.select(),
    onSubmit(d) {
      const current = parseAmount(d.current);
      if (Number.isNaN(current) || current < 0) return { current: 'Escribe un número, cero o mayor.' };
      patch('goals', g.id, { current });
      toast(current >= g.target ? 'Meta cumplida' : 'Avance guardado');
    },
  });
}

on({
  'goal-new': (el) => {
    closeSheet();
    openGoalSheet({ spaceId: el.dataset.space });
  },
  'goal-open': (el) => openGoalSheet({ id: el.dataset.id }),
  'goal-progress': (el) => openProgressSheet(el.dataset.id),
});
