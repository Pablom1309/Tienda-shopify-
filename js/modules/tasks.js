import { icon } from '../icons.js';
import { addDays, esc, relDate, startOfWeek, today, weekdayLong } from '../util.js';
import { groupTasks, isOverdue, sortTasks, stepsDone } from '../logic.js';
import { parseQuick } from '../quick.js';
import { add, bySpace, find, getSpace, patch, remove, restore, setTaskStatus, snapshot, spacesWith, state, toggleStep, update } from '../store.js';
import { closeSheet, emptyState, field, on, openSheet, rememberView, rerender, segmented, select, spaceSelect, textarea, tick, toast, view, withUndo } from '../ui.js';

const PRIORITY = ['Normal', 'Media', 'Alta'];
const STATUS = { todo: 'Por hacer', doing: 'En curso', done: 'Hecha' };
export const REPEAT = { daily: 'Cada día', weekdays: 'De lunes a viernes', weekly: 'Cada semana', monthly: 'Cada mes' };

function meta(t, showSpace) {
  const now = today();
  const parts = [];
  if (t.due) {
    const late = isOverdue(t, now);
    parts.push(`<span class="${late ? 'late' : ''}">${icon('calendar-days', 14)}${esc(relDate(t.due, now))}${t.time ? `, ${esc(t.time)}` : ''}</span>`);
  }
  if (t.repeat) parts.push(`<span>${icon('repeat', 14)}${REPEAT[t.repeat]}</span>`);
  if (t.status === 'doing') parts.push('<span class="chip">En curso</span>');
  if (t.priority > 0 && t.status !== 'done') parts.push(`<span style="color:var(--${t.priority === 2 ? 'baliza' : 'faro'})">${icon('flag', 14)}${PRIORITY[t.priority]}</span>`);
  if (showSpace) {
    const s = getSpace(t.spaceId);
    if (s) parts.push(`<span data-color="${s.color}"><i class="sq"></i>${esc(s.name)}</span>`);
  }
  return parts.length ? `<span class="row-meta">${parts.join('')}</span>` : '';
}

export function taskRow(t, { showSpace = false } = {}) {
  const s = getSpace(t.spaceId);
  const done = t.status === 'done';
  const pr = !done && t.priority === 2 ? 'hi' : !done && t.priority === 1 ? 'mid' : '';
  const steps = t.subtasks || [];
  const open = view.expanded.has(t.id);
  return `<li class="row ${done ? 'is-done' : ''}" data-color="${s?.color || 'marino'}">
    <button class="check ${pr}" data-action="task-toggle" data-id="${t.id}" aria-pressed="${done}" aria-label="${done ? 'Marcar como pendiente' : 'Marcar como hecha'}: ${esc(t.title)}"><i>${icon('check', 14)}</i></button>
    <button class="row-body" data-action="task-open" data-id="${t.id}">
      <span class="row-title">${esc(t.title)}</span>${meta(t, showSpace)}
    </button>
    ${
      steps.length
        ? `<span class="row-end"><button class="chip steps-chip" data-action="task-steps" data-id="${t.id}" aria-expanded="${open}" aria-label="Pasos: ${stepsDone(t)} de ${steps.length}">${icon('list-checks', 14)}<span class="num">${stepsDone(t)}/${steps.length}</span>${icon('chevron-down', 14)}</button></span>`
        : ''
    }
    ${
      steps.length && open
        ? `<ul class="steps">${steps
            .map((x) => `<li><button class="step ${x.done ? 'is-done' : ''}" data-action="step-toggle" data-task="${t.id}" data-step="${x.id}" aria-pressed="${x.done}"><i>${icon('check', 12)}</i><span>${esc(x.title)}</span></button></li>`)
            .join('')}</ul>`
        : ''
    }
  </li>`;
}

// ---------- Captura rápida ----------

function describe(p) {
  const now = today();
  const chips = [];
  if (p.due) chips.push([`calendar-days`, relDate(p.due, now)]);
  if (p.time) chips.push(['clock', p.time]);
  if (p.repeat) chips.push(['repeat', REPEAT[p.repeat]]);
  if (p.priority) chips.push(['flag', `Prioridad ${PRIORITY[p.priority].toLowerCase()}`]);
  if (p.spaceId) chips.push(['layout-grid', getSpace(p.spaceId)?.name || '']);
  return chips;
}

// Campo para añadir tareas escribiendo. `dueToday`: sin fecha escrita, queda para hoy.
export function quickBar({ id, spaceId = null, dueToday = false, placeholder = 'Añadir tarea' }) {
  const spaces = spacesWith('tasks');
  if (!spaces.length) return '';
  const picker =
    !spaceId && spaces.length > 1
      ? `<select name="spaceId" id="${id}-space" aria-label="Espacio">${spaces.map((s) => `<option value="${s.id}" ${view.quickSpace === s.id ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select>`
      : `<input type="hidden" name="spaceId" value="${spaceId || spaces[0].id}">`;
  return `<div class="quick-wrap">
    <form class="quick" data-quick ${dueToday ? 'data-today="1"' : ''}>
      <input name="title" id="${id}" placeholder="${esc(placeholder)}" aria-label="${esc(placeholder)}" aria-describedby="${id}-hint" autocomplete="off" maxlength="200" enterkeyhint="done">
      ${picker}
      <button class="icon-btn" aria-label="Añadir tarea">${icon('plus', 18)}</button>
    </form>
    <p class="quick-hint" id="${id}-hint" data-quick-preview>Escribe también cuándo: <span>pagar la luz mañana 18:00 !alta</span></p>
  </div>`;
}

const HINT = 'Escribe también cuándo: <span>pagar la luz mañana 18:00 !alta</span>';

document.addEventListener('input', (e) => {
  const form = e.target.closest?.('[data-quick]');
  if (!form || e.target.name !== 'title') return;
  const out = form.parentElement.querySelector('[data-quick-preview]');
  const p = parseQuick(e.target.value, { today: today(), spaces: spacesWith('tasks') });
  const chips = describe(p);
  out.innerHTML = chips.length ? chips.map(([ico, label]) => `<span class="chip">${icon(ico, 13)}${esc(label)}</span>`).join('') : HINT;
  out.classList.toggle('has-chips', chips.length > 0);
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest?.('[data-quick]');
  if (!form) return;
  e.preventDefault();
  const input = form.elements.title;
  if (!input.value.trim()) return input.focus();
  const now = today();
  const p = parseQuick(input.value, { today: now, spaces: spacesWith('tasks') });
  const spaceId = p.spaceId || form.elements.spaceId.value;
  const due = p.due || (form.dataset.today ? now : null);
  if (form.elements.spaceId.tagName === 'SELECT') view.quickSpace = form.elements.spaceId.value;
  view.refocus = input.id;
  add('tasks', { title: p.title, notes: '', spaceId, status: 'todo', priority: p.priority, due, time: p.time, repeat: p.repeat, subtasks: [], doneAt: null, createdAt: Date.now() });
  const where = p.spaceId && p.spaceId !== form.elements.spaceId.value ? ` en ${getSpace(p.spaceId).name}` : '';
  toast(due ? `Añadida para ${relDate(due, now).toLowerCase()}${p.time ? `, ${p.time}` : ''}${where}` : `Tarea añadida${where}`);
});

// ---------- Listas ----------

function group(title, items, cls = '') {
  if (!items.length) return '';
  return `<h3 class="group-title ${cls}">${title} <span class="n num">${items.length}</span></h3>
    <ul class="list">${items.map((t) => taskRow(t)).join('')}</ul>`;
}

function listView(space, tasks) {
  const g = groupTasks(tasks, today());
  const open = g.overdue.length + g.today.length + g.upcoming.length + g.someday.length;
  let html = '';
  if (!open) {
    html += `<div class="empty">${icon('list-checks', 28)}<p>${tasks.length ? 'No queda nada pendiente en este espacio.' : 'Aquí van los pendientes de este espacio. Escribe el primero arriba; si pones la fecha en la misma frase, se entiende sola.'}</p></div>`;
  }
  html += group('Atrasadas', g.overdue, 'late') + group('Hoy', g.today) + group('Próximas', g.upcoming) + group('Sin fecha', g.someday);
  if (g.done.length) {
    html += `<div class="group-bar">
      <button class="group-title" data-action="tasks-done-toggle" aria-expanded="${view.showDone}">${icon('chevron-right', 16)}Hechas <span class="n num">${g.done.length}</span></button>
      ${view.showDone ? `<button class="btn soft sm" data-action="tasks-clear-done" data-space="${space.id}">${icon('trash-2', 15)}<span>Borrar hechas</span></button>` : ''}
    </div>`;
    if (view.showDone) html += `<ul class="list">${g.done.slice(0, 50).map((t) => taskRow(t)).join('')}</ul>`;
  }
  return html;
}

function boardView(space, tasks) {
  const cols = ['todo', 'doing', 'done'];
  return `<div class="board" data-color="${space.color}">${cols
    .map((st) => {
      const items = tasks.filter((t) => t.status === st);
      if (st === 'done') items.sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));
      else items.sort(sortTasks);
      return `<section class="col" data-status="${st}">
        <header class="col-head"><span>${STATUS[st]}</span><span class="num">${items.length}</span></header>
        ${items
          .slice(0, st === 'done' ? 20 : 200)
          .map((t) => {
            const steps = t.subtasks || [];
            return `<button class="card ${st === 'done' ? 'is-done' : ''}" draggable="true" data-action="task-open" data-id="${t.id}">
              <span class="row-title">${esc(t.title)}</span>${meta({ ...t, status: st === 'doing' ? 'todo' : t.status }, false)}
              ${steps.length ? `<span class="row-meta"><span>${icon('list-checks', 14)}<span class="num">${stepsDone(t)}/${steps.length}</span> pasos</span></span>` : ''}
            </button>`;
          })
          .join('')}
        ${st === 'todo' ? `<button class="col-add" data-action="task-new" data-space="${space.id}">${icon('plus', 16)}Añadir</button>` : ''}
      </section>`;
    })
    .join('')}</div>`;
}

export function renderTasks(space) {
  const tasks = bySpace('tasks', space.id);
  const isBoard = view.tasksView === 'board';
  return `<div class="toolbar">
      <div class="seg" role="group" aria-label="Vista">
        <button data-action="tasks-view" data-view="list" aria-pressed="${!isBoard}">${icon('list', 16)}Lista</button>
        <button data-action="tasks-view" data-view="board" aria-pressed="${isBoard}">${icon('kanban', 16)}Tablero</button>
      </div>
      <button class="btn" data-action="task-new" data-space="${space.id}">${icon('plus', 18)}<span>Añadir tarea</span></button>
    </div>
    ${quickBar({ id: `quick-${space.id}`, spaceId: space.id, placeholder: `Añadir tarea a ${space.name}` })}
    <div>${isBoard ? boardView(space, tasks) : listView(space, tasks)}</div>`;
}

// Tareas de los próximos 7 días (sin contar hoy), agrupadas por día. Para la pantalla Hoy.
export function upcomingWeek() {
  const now = today();
  const end = addDays(now, 7);
  const tasks = state.tasks.filter((t) => t.status !== 'done' && t.due && t.due > now && t.due <= end).sort(sortTasks);
  if (!tasks.length) return '';
  const days = [...new Set(tasks.map((t) => t.due))];
  return days
    .map((day) => {
      const label = relDate(day, now) === 'Mañana' ? 'Mañana' : weekdayLong(day);
      return `<h3 class="group-title" style="text-transform:capitalize">${label} <span class="n num">${Number(day.slice(8, 10))}</span></h3>
        <ul class="list">${tasks.filter((t) => t.due === day).map((t) => taskRow(t, { showSpace: true })).join('')}</ul>`;
    })
    .join('');
}

// ---------- Formulario ----------

const stepRow = (x = { id: '', title: '', done: false }) => `<div class="step-edit" data-step="${esc(x.id)}">
    <label class="step-tick"><input type="checkbox" ${x.done ? 'checked' : ''} aria-label="Paso hecho"><i>${icon('check', 12)}</i></label>
    <input class="input" value="${esc(x.title)}" maxlength="160" aria-label="Paso" autocomplete="off">
    <button type="button" class="icon-btn" data-step-del aria-label="Quitar paso">${icon('x', 18)}</button>
  </div>`;

export function openTaskSheet({ id, spaceId, due } = {}) {
  const t = id ? find('tasks', id) : null;
  if (!spacesWith('tasks').length) return toast('Activa Tareas en algún espacio para añadir una.');
  const now = today();
  const v = t || { title: '', notes: '', status: 'todo', priority: 0, due: due ?? null, time: null, repeat: null, subtasks: [], spaceId };
  const nextMonday = addDays(startOfWeek(now), 7);
  const dateChip = (label, value) => `<button type="button" data-date="${value}">${label}</button>`;

  openSheet({
    title: t ? 'Editar tarea' : 'Nueva tarea',
    submitLabel: t ? 'Guardar' : 'Añadir tarea',
    body: `
      ${field({ label: 'Qué hay que hacer', name: 'title', value: v.title, placeholder: 'Ej.: enviar la cotización', attrs: `${t ? '' : 'autofocus'} required maxlength="200" autocomplete="off"` })}
      ${spaceSelect('tasks', v.spaceId)}
      <fieldset class="field"><legend>Cuándo</legend>
        <div class="seg chips-row" id="date-chips">${dateChip('Hoy', now)}${dateChip('Mañana', addDays(now, 1))}${dateChip('El lunes', nextMonday)}${dateChip('En una semana', addDays(now, 7))}${dateChip('Sin fecha', '')}</div>
        <div class="form-row">
          <input type="date" name="due" id="f-due" value="${v.due || ''}" aria-label="Fecha">
          <input type="time" name="time" id="f-time" value="${v.time || ''}" aria-label="Hora">
        </div>
      </fieldset>
      <div class="form-row">
        ${select({ label: 'Se repite', name: 'repeat', value: v.repeat || '', options: [{ value: '', label: 'No se repite' }, ...Object.entries(REPEAT).map(([value, label]) => ({ value, label }))] })}
        ${select({ label: 'Prioridad', name: 'priority', value: v.priority, options: PRIORITY.map((label, value) => ({ value, label })) })}
      </div>
      ${t ? segmented({ label: 'Estado', name: 'status', value: v.status, options: Object.entries(STATUS).map(([value, label]) => ({ value, label })) }) : ''}
      <fieldset class="field"><legend>Pasos</legend>
        <div id="steps">${v.subtasks.map(stepRow).join('')}</div>
        <input class="input" id="step-new" placeholder="Añadir un paso y pulsar Enter" maxlength="160" autocomplete="off" enterkeyhint="enter" aria-label="Añadir un paso">
      </fieldset>
      ${textarea({ label: 'Notas', name: 'notes', value: v.notes, placeholder: 'Detalles, enlaces, lo que haga falta', rows: 3 })}`,
    onOpen(d) {
      const form = d.querySelector('form');
      const steps = d.querySelector('#steps');
      const stepNew = d.querySelector('#step-new');
      const markChip = () => d.querySelectorAll('#date-chips button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.date === form.elements.due.value)));
      markChip();
      form.elements.due.addEventListener('input', markChip);
      d.querySelector('#date-chips').onclick = (e) => {
        const b = e.target.closest('[data-date]');
        if (!b) return;
        form.elements.due.value = b.dataset.date;
        if (!b.dataset.date) {
          form.elements.time.value = '';
          form.elements.repeat.value = '';
        }
        markChip();
      };
      // Una tarea que se repite necesita una fecha de partida.
      form.elements.repeat.onchange = () => {
        if (form.elements.repeat.value && !form.elements.due.value) {
          form.elements.due.value = now;
          markChip();
        }
      };
      const addStep = () => {
        const title = stepNew.value.trim();
        if (!title) return;
        steps.insertAdjacentHTML('beforeend', stepRow({ id: '', title, done: false }));
        stepNew.value = '';
      };
      stepNew.onkeydown = (e) => {
        if (e.key !== 'Enter') return;
        e.preventDefault(); // Enter añade el paso, no envía el formulario
        addStep();
      };
      stepNew.onblur = addStep;
      steps.onclick = (e) => e.target.closest('[data-step-del]')?.closest('.step-edit').remove();
    },
    onSubmit(d, form) {
      const title = d.title.trim();
      if (!title) return { title: 'Escribe qué hay que hacer.' };
      const pending = form.querySelector('#step-new').value.trim();
      const subtasks = [...form.querySelectorAll('.step-edit')]
        .map((row) => ({ id: row.dataset.step || Math.random().toString(36).slice(2, 10), title: row.querySelector('.input').value.trim(), done: row.querySelector('input[type="checkbox"]').checked }))
        .filter((x) => x.title);
      if (pending) subtasks.push({ id: Math.random().toString(36).slice(2, 10), title: pending, done: false });
      const dueDate = d.due || (d.repeat || d.time ? now : null);
      const data = { title, notes: d.notes.trim(), spaceId: d.spaceId, due: dueDate, time: dueDate && d.time ? d.time : null, priority: Number(d.priority), repeat: d.repeat || null, subtasks };
      if (t) {
        const status = d.status || t.status;
        patch('tasks', t.id, data);
        if (status !== t.status) setTaskStatus(t.id, status);
        toast('Tarea guardada');
      } else {
        add('tasks', { ...data, status: 'todo', doneAt: null, createdAt: Date.now() });
        toast('Tarea añadida');
      }
    },
    onDelete: t ? () => withUndo('Tarea eliminada', () => remove('tasks', t.id)) : null,
  });
}

on({
  'task-toggle': (el) => {
    const t = find('tasks', el.dataset.id);
    if (!t) return;
    tick();
    if (t.status === 'done') return void setTaskStatus(t.id, 'todo');
    const before = snapshot();
    const next = setTaskStatus(t.id, 'done');
    toast(next ? `Hecha. La próxima es ${relDate(next).toLowerCase()}` : 'Tarea hecha', { undo: () => restore(before) });
  },
  'task-open': (el) => openTaskSheet({ id: el.dataset.id }),
  'task-new': (el) => {
    closeSheet();
    openTaskSheet({ spaceId: el.dataset.space, due: el.dataset.due || null });
  },
  'task-steps': (el) => {
    const id = el.dataset.id;
    if (view.expanded.has(id)) view.expanded.delete(id);
    else view.expanded.add(id);
    rerender();
  },
  'step-toggle': (el) => {
    tick();
    toggleStep(el.dataset.task, el.dataset.step);
  },
  'tasks-view': (el) => {
    view.tasksView = el.dataset.view;
    rememberView();
    rerender();
  },
  'tasks-done-toggle': () => {
    view.showDone = !view.showDone;
    rerender();
  },
  'tasks-clear-done': (el) => {
    const n = state.tasks.filter((t) => t.spaceId === el.dataset.space && t.status === 'done').length;
    withUndo(`${n} ${n === 1 ? 'tarea borrada' : 'tareas borradas'}`, () =>
      update((s) => {
        s.tasks = s.tasks.filter((t) => !(t.spaceId === el.dataset.space && t.status === 'done'));
      }),
    );
  },
});

// Arrastrar tarjetas entre columnas del tablero (escritorio).
let dragId = null;
document.addEventListener('dragstart', (e) => {
  const card = e.target.closest?.('.card[data-id]');
  if (!card) return;
  dragId = card.dataset.id;
  card.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', dragId);
});
document.addEventListener('dragend', () => {
  dragId = null;
  document.querySelectorAll('.dragging, .col.over').forEach((el) => el.classList.remove('dragging', 'over'));
});
document.addEventListener('dragover', (e) => {
  const col = e.target.closest?.('.col[data-status]');
  if (!col || !dragId) return;
  e.preventDefault();
  document.querySelectorAll('.col.over').forEach((el) => el !== col && el.classList.remove('over'));
  col.classList.add('over');
});
document.addEventListener('drop', (e) => {
  const col = e.target.closest?.('.col[data-status]');
  if (!col || !dragId) return;
  e.preventDefault();
  const t = state.tasks.find((x) => x.id === dragId);
  if (t && t.status !== col.dataset.status) setTaskStatus(t.id, col.dataset.status);
});
