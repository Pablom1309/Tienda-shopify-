import { icon } from '../icons.js';
import { CURRENCIES } from '../store.js';
import { diffDays, esc, money, num, parseAmount, relDate, today } from '../util.js';

// Si la unidad de la meta es una moneda, la cifra se escribe como dinero: $504.000 y no 504.000 CLP.
const amount = (g, n) => (CURRENCIES.includes(g.unit) ? money(n, g.unit) : `${num(n)}${g.unit ? ` ${esc(g.unit)}` : ''}`);
import { goalPace, goalPct } from '../logic.js';
import { add, bySpace, find, patch, remove, spacesWith, update } from '../store.js';
import { closeSheet, emptyState, field, on, openSheet, segmented, spaceSelect, toast, withUndo } from '../ui.js';

// Estado de la meta en palabras: cumplida, al día, atrasada, vencida.
function paceChip(g, now) {
  const p = goalPace(g, now);
  if (p.status === 'done') return `<span class="chip" style="--c:var(--boya)">${icon('check', 13)}Cumplida</span>`;
  if (p.status === 'late') return `<span class="chip" style="--c:var(--baliza)">Venció ${esc(relDate(g.due, now).toLowerCase())}</span>`;
  if (p.status === 'ontrack') return `<span class="chip" style="--c:var(--boya)">Al día</span>`;
  if (p.status === 'behind') return `<span class="chip" style="--c:var(--faro)">Atrasada</span>`;
  return '';
}

function paceNote(g, now) {
  const p = goalPace(g, now);
  if (p.status !== 'ontrack' && p.status !== 'behind') return '';
  const left = diffDays(g.due, now);
  const when = left === 0 ? 'vence hoy' : `quedan ${left} ${left === 1 ? 'día' : 'días'}`;
  if (left < 7) return `Faltan ${amount(g, g.target - g.current)}, ${when}`;
  return `Para llegar: ${amount(g, p.perWeek)} por semana, ${when}`;
}

// Línea mínima con la historia del avance.
function spark(g) {
  const pts = g.history || [];
  if (pts.length < 2) return '';
  const max = Math.max(g.target, ...pts.map((p) => p.value)) || 1;
  const W = 96, H = 26;
  const coords = pts.map((p, i) => `${((W * i) / (pts.length - 1)).toFixed(1)},${(H - 2 - (H - 4) * (p.value / max)).toFixed(1)}`);
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true"><polyline points="${coords.join(' ')}"/></svg>`;
}

export function renderGoals(space) {
  const now = today();
  const goals = bySpace('goals', space.id).sort((a, b) => Number(goalPct(a) >= 1) - Number(goalPct(b) >= 1) || ((a.due || '9999') < (b.due || '9999') ? -1 : 1));
  return `<div class="toolbar">
      <span></span>
      <button class="btn" data-action="goal-new" data-space="${space.id}">${icon('plus', 18)}<span>Añadir meta</span></button>
    </div>
    ${
      goals.length
        ? `<ul class="list" data-color="${space.color}">${goals
            .map((g) => {
              const pct = goalPct(g);
              const note = paceNote(g, now);
              return `<li class="goal">
                <div class="goal-top">
                  <button class="row-body" data-action="goal-open" data-id="${g.id}"><span class="row-title">${esc(g.name)}</span><span class="row-meta">${paceChip(g, now)}${note ? `<span>${note}</span>` : ''}</span></button>
                  ${spark(g)}
                  <button class="btn soft sm" data-action="goal-progress" data-id="${g.id}">${icon('plus', 15)}<span>Avance</span></button>
                </div>
                <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct * 100)}" aria-label="Avance de ${esc(g.name)}"><i style="width:${pct * 100}%"></i></div>
                <div class="goal-nums num"><span><b>${CURRENCIES.includes(g.unit) ? money(g.current, g.unit) : num(g.current)}</b> de ${amount(g, g.target)}</span><span>${Math.round(pct * 100)}%</span></div>
              </li>`;
            })
            .join('')}</ul>`
        : emptyState({ ico: 'target', text: 'Una meta tiene un número al que quieres llegar y, si quieres, una fecha. Con fecha, verás si vas al día o te estás atrasando.', action: 'goal-new', label: 'Añadir meta', attrs: `data-space="${space.id}"` })
    }`;
}

// Guarda el avance y lo anota en la historia (un punto por día).
function setProgress(id, value) {
  update((s) => {
    const g = s.goals.find((x) => x.id === id);
    if (!g) return;
    const now = today();
    if (!g.history.length && g.current !== value) g.history.push({ date: g.startDate || now, value: g.current });
    g.current = value;
    const last = g.history.at(-1);
    if (last && last.date === now) last.value = value;
    else g.history.push({ date: now, value });
    if (g.history.length > 120) g.history = g.history.slice(-120);
  });
}

export function openGoalSheet({ id, spaceId } = {}) {
  const g = id ? find('goals', id) : null;
  if (!spacesWith('goals').length) return toast('Activa Metas en algún espacio para añadir una.');
  const v = g || { name: '', unit: '', target: '', current: 0, due: null, spaceId };
  openSheet({
    title: g ? 'Editar meta' : 'Nueva meta',
    submitLabel: g ? 'Guardar' : 'Añadir meta',
    body: `
      ${field({ label: 'Meta', name: 'name', value: v.name, placeholder: 'Ej.: correr 10 km', attrs: `${g ? '' : 'autofocus'} required maxlength="120" autocomplete="off"` })}
      <div class="form-row">
        ${field({ label: 'Llevo', name: 'current', value: v.current, attrs: 'inputmode="decimal" autocomplete="off"' })}
        ${field({ label: 'Quiero llegar a', name: 'target', value: v.target, placeholder: '10', attrs: 'inputmode="decimal" required autocomplete="off"' })}
        ${field({ label: 'Unidad', name: 'unit', value: v.unit, placeholder: 'km, libros, kg', attrs: 'maxlength="20" autocomplete="off"' })}
      </div>
      ${field({ label: 'Fecha límite', name: 'due', type: 'date', value: v.due || '', hint: 'Opcional. Con fecha, la meta te dice si vas al día.' })}
      ${spaceSelect('goals', v.spaceId)}`,
    onSubmit(d) {
      const name = d.name.trim();
      if (!name) return { name: 'Ponle un nombre a la meta.' };
      const target = parseAmount(d.target);
      if (!(target > 0)) return { target: 'Escribe un número mayor que cero.' };
      const parsed = parseAmount(d.current);
      const current = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
      const data = { name, unit: d.unit.trim(), target, due: d.due || null, spaceId: d.spaceId };
      if (g) {
        patch('goals', g.id, data);
        if (current !== g.current) setProgress(g.id, current);
      } else {
        add('goals', { ...data, current, startDate: today(), history: [], createdAt: Date.now() });
      }
      toast(g ? 'Meta guardada' : 'Meta añadida');
    },
    onDelete: g ? () => withUndo('Meta eliminada', () => remove('goals', g.id)) : null,
  });
}

function openProgressSheet(id) {
  const g = find('goals', id);
  if (!g) return;
  openSheet({
    title: g.name,
    submitLabel: 'Guardar avance',
    body: `
      <p class="muted num">Llevas <b>${amount(g, g.current)}</b> de ${amount(g, g.target)}.</p>
      ${segmented({ label: 'Qué quieres anotar', name: 'mode', value: 'add', options: [{ value: 'add', label: 'Sumar a lo que llevo' }, { value: 'set', label: 'Poner el total' }] })}
      ${field({ label: `Cantidad${g.unit ? ` (${g.unit})` : ''}`, name: 'amount', value: '', placeholder: '0', attrs: 'inputmode="decimal" autofocus required autocomplete="off"' })}`,
    onSubmit(d) {
      const amount = parseAmount(d.amount);
      if (Number.isNaN(amount) || amount < 0) return { amount: 'Escribe un número, cero o mayor.' };
      const value = d.mode === 'set' ? amount : g.current + amount;
      setProgress(g.id, Math.round(value * 100) / 100);
      toast(value >= g.target ? 'Meta cumplida' : 'Avance guardado');
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
