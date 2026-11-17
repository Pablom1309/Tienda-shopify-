import { icon } from '../icons.js';
import { esc, relDate, today } from '../util.js';
import { groupTasks, isOverdue, sortTasks } from '../logic.js';
import { add, bySpace, find, getSpace, patch, remove, setTaskStatus, spacesWith, state } from '../store.js';
import { closeSheet, emptyState, field, on, openSheet, removeWithUndo, segmented, spaceSelect, textarea, toast, view } from '../ui.js';

const PRIORITY = ['Normal', 'Media', 'Alta'];
const STATUS = { todo: 'Por hacer', doing: 'En curso', done: 'Hecha' };

function meta(t, showSpace) {
  const now = today();
  const parts = [];
  if (t.due) {
    const late = isOverdue(t, now);
    parts.push(`<span class="${late ? 'late' : ''}">${icon('calendar-days', 14)}${esc(relDate(t.due, now))}${t.time ? `, ${esc(t.time)}` : ''}</span>`);
  }
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
  return `<li class="row ${done ? 'is-done' : ''}" data-color="${s?.color || 'marino'}">
    <button class="check ${pr}" data-action="task-toggle" data-id="${t.id}" aria-pressed="${done}" aria-label="${done ? 'Marcar como pendiente' : 'Marcar como hecha'}: ${esc(t.title)}"><i>${icon('check', 14)}</i></button>
    <button class="row-body" data-action="task-open" data-id="${t.id}">
      <span class="row-title">${esc(t.title)}</span>${meta(t, showSpace)}
    </button>
  </li>`;
}

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
    html += emptyState({
      ico: 'list-checks',
      text: tasks.length ? 'No queda nada pendiente en este espacio.' : 'Aquí van los pendientes de este espacio. Añade el primero y ponle fecha si la tiene.',
      action: 'task-new',
      label: 'Añadir tarea',
      attrs: `data-space="${space.id}"`,
    });
  }
  html += group('Atrasadas', g.overdue, 'late') + group('Hoy', g.today) + group('Próximas', g.upcoming) + group('Sin fecha', g.someday);
  if (g.done.length) {
    html += `<button class="group-title" data-action="tasks-done-toggle" aria-expanded="${view.showDone}">${icon('chevron-right', 16)}Hechas <span class="n num">${g.done.length}</span></button>`;
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
          .map(
            (t) => `<button class="card ${st === 'done' ? 'is-done' : ''}" draggable="true" data-action="task-open" data-id="${t.id}">
              <span class="row-title">${esc(t.title)}</span>${meta({ ...t, status: st === 'doing' ? 'todo' : t.status }, false)}
            </button>`,
          )
          .join('')}
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
    <div>${isBoard ? boardView(space, tasks) : listView(space, tasks)}</div>`;
}

// ---------- Formulario ----------

export function openTaskSheet({ id, spaceId, due } = {}) {
  const t = id ? find('tasks', id) : null;
  if (!spacesWith('tasks').length) return toast('Activa Tareas en algún espacio para añadir una.');
  const v = t || { title: '', notes: '', status: 'todo', priority: 0, due: due ?? null, time: null, spaceId };
  openSheet({
    title: t ? 'Editar tarea' : 'Nueva tarea',
    submitLabel: t ? 'Guardar' : 'Añadir tarea',
    body: `
      ${field({ label: 'Qué hay que hacer', name: 'title', value: v.title, placeholder: 'Ej.: enviar la cotización', attrs: 'autofocus required maxlength="200" autocomplete="off"' })}
      ${spaceSelect('tasks', v.spaceId)}
      <div class="form-row">
        ${field({ label: 'Fecha', name: 'due', type: 'date', value: v.due || '' })}
        ${field({ label: 'Hora', name: 'time', type: 'time', value: v.time || '' })}
      </div>
      ${segmented({ label: 'Prioridad', name: 'priority', value: v.priority, options: PRIORITY.map((label, value) => ({ value, label })) })}
      ${t ? segmented({ label: 'Estado', name: 'status', value: v.status, options: Object.entries(STATUS).map(([value, label]) => ({ value, label })) }) : ''}
      ${textarea({ label: 'Notas', name: 'notes', value: v.notes, placeholder: 'Detalles, enlaces, lo que haga falta', rows: 3 })}`,
    onSubmit(d) {
      const title = d.title.trim();
      if (!title) return { title: 'Escribe qué hay que hacer.' };
      const data = { title, notes: d.notes.trim(), spaceId: d.spaceId, due: d.due || null, time: d.due && d.time ? d.time : null, priority: Number(d.priority) };
      if (t) {
        const status = d.status || t.status;
        patch('tasks', t.id, { ...data, status, doneAt: status === 'done' ? t.doneAt || Date.now() : null });
        toast('Tarea guardada');
      } else {
        add('tasks', { ...data, status: 'todo', doneAt: null, createdAt: Date.now() });
        toast('Tarea añadida');
      }
    },
    onDelete: t ? () => removeWithUndo('Tarea eliminada', () => remove('tasks', t.id)) : null,
  });
}

on({
  'task-toggle': (el) => {
    const t = find('tasks', el.dataset.id);
    if (t) setTaskStatus(t.id, t.status === 'done' ? 'todo' : 'done');
  },
  'task-open': (el) => openTaskSheet({ id: el.dataset.id }),
  'task-new': (el) => {
    closeSheet();
    openTaskSheet({ spaceId: el.dataset.space, due: el.dataset.due || null });
  },
  'tasks-view': (el) => {
    view.tasksView = el.dataset.view;
    document.dispatchEvent(new Event('rumbo:render'));
  },
  'tasks-done-toggle': () => {
    view.showDone = !view.showDone;
    document.dispatchEvent(new Event('rumbo:render'));
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
