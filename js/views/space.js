import { icon } from '../icons.js';
import { esc, today } from '../util.js';
import { spaceWeek } from '../logic.js';
import { add, bySpace, COLORS, getSpace, MODULES, moveSpace, patch, removeSpace, state } from '../store.js';
import { MODULE_INFO, SPACE_ICONS, TEMPLATES } from '../seed.js';
import { closeSheet, confirmDialog, field, go, on, openSheet, rememberView, rerender, toast, view } from '../ui.js';
import { renderTasks } from '../modules/tasks.js';
import { renderHabits } from '../modules/habits.js';
import { renderFinance } from '../modules/finance.js';
import { renderTraining } from '../modules/training.js';
import { renderNotes } from '../modules/notes.js';
import { renderGoals } from '../modules/goals.js';

const RENDER = { tasks: renderTasks, habits: renderHabits, finance: renderFinance, training: renderTraining, notes: renderNotes, goals: renderGoals };

export function renderSpace(id) {
  const space = getSpace(id);
  if (!space) {
    return `<div class="empty">${icon('compass', 28)}<p>Ese espacio ya no existe.</p><a class="btn" href="#espacios">Ver mis espacios</a></div>`;
  }
  const mods = space.modules.filter((m) => MODULES.includes(m)); // en el orden propio del espacio
  const active = mods.includes(view.tab[id]) ? view.tab[id] : mods[0];

  return `
    <header class="space-head" data-color="${space.color}">
      <span class="tile lg">${icon(space.icon, 26)}</span>
      <h1 class="h1">${esc(space.name)}</h1>
      <button class="icon-btn" data-action="space-edit" data-id="${space.id}" aria-label="Editar espacio">${icon('pencil')}</button>
    </header>
    ${
      mods.length
        ? `<nav class="tabs" role="tablist" data-color="${space.color}">${mods
            .map((m) => `<a href="#e-${space.id}" role="tab" data-action="space-tab" data-id="${space.id}" data-tab="${m}" aria-selected="${m === active}">${icon(MODULE_INFO[m].icon, 17)}${MODULE_INFO[m].label}</a>`)
            .join('')}</nav>
          ${RENDER[active](space)}`
        : `<div class="empty">${icon('layout-grid', 28)}<p>Este espacio no tiene nada activado. Elige qué quieres llevar aquí.</p><button class="btn" data-action="space-edit" data-id="${space.id}">Elegir secciones</button></div>`
    }`;
}

function spaceSummary(s) {
  const bits = [];
  const open = bySpace('tasks', s.id).filter((t) => t.status !== 'done').length;
  if (s.modules.includes('tasks')) bits.push(`${open} ${open === 1 ? 'tarea abierta' : 'tareas abiertas'}`);
  if (s.modules.includes('habits')) {
    const n = bySpace('habits', s.id).length;
    bits.push(`${n} ${n === 1 ? 'hábito' : 'hábitos'}`);
  }
  if (s.modules.includes('training') && bits.length < 2) {
    const n = bySpace('workouts', s.id).length;
    bits.push(`${n} ${n === 1 ? 'sesión' : 'sesiones'}`);
  }
  if (s.modules.includes('goals') && bits.length < 2) {
    const n = bySpace('goals', s.id).length;
    bits.push(`${n} ${n === 1 ? 'meta' : 'metas'}`);
  }
  return bits.join(', ') || 'Sin secciones activas';
}

export function renderSpaces() {
  const now = today();
  const sorting = view.sortSpaces && state.spaces.length > 1;
  return `
    <header class="page-head">
      <h1 class="h1">Espacios</h1>
      <div class="tools">
        ${state.spaces.length > 1 ? `<button class="btn soft" data-action="spaces-sort" aria-pressed="${sorting}">${sorting ? 'Listo' : 'Ordenar'}</button>` : ''}
        <button class="btn" data-action="space-new">${icon('plus', 18)}<span>Nuevo espacio</span></button>
      </div>
    </header>
    ${
      state.spaces.length
        ? `<div class="space-list ${sorting ? 'sorting' : ''}">${state.spaces
            .map((s, i) => {
              const w = spaceWeek(state, s.id, now);
              const body = `<span class="tile">${icon(s.icon, 20)}</span>
                <span><span class="name">${esc(s.name)}</span><br><span class="sub">${esc(spaceSummary(s))}</span></span>`;
              if (sorting) {
                return `<div class="space-row" data-color="${s.color}">${body}
                  <span class="move">
                    <button class="icon-btn flip" data-action="space-move" data-id="${s.id}" data-step="-1" aria-label="Subir ${esc(s.name)}" ${i === 0 ? 'disabled' : ''}>${icon('chevron-down', 20)}</button>
                    <button class="icon-btn" data-action="space-move" data-id="${s.id}" data-step="1" aria-label="Bajar ${esc(s.name)}" ${i === state.spaces.length - 1 ? 'disabled' : ''}>${icon('chevron-down', 20)}</button>
                  </span></div>`;
              }
              return `<a class="space-row" href="#e-${s.id}" data-color="${s.color}">${body}
                <span class="chip num">${w.pct === null ? 'Sin plan' : `${Math.round(w.pct * 100)}% semana`}</span>
              </a>`;
            })
            .join('')}</div>`
        : `<div class="empty">${icon('layout-grid', 28)}<p>Un espacio es un área que quieres gestionar: tu negocio, tu casa, tu entrenamiento. Crea el primero.</p><button class="btn" data-action="space-new">${icon('plus', 18)}<span>Nuevo espacio</span></button></div>`
    }`;
}

// ---------- Crear y editar ----------

export function openSpaceSheet(id) {
  const s = id ? getSpace(id) : null;
  const v = s || { name: '', color: COLORS[state.spaces.length % COLORS.length], icon: 'compass', modules: ['tasks', 'notes', 'goals'] };
  openSheet({
    title: s ? 'Editar espacio' : 'Nuevo espacio',
    submitLabel: s ? 'Guardar' : 'Crear espacio',
    deleteLabel: 'Eliminar espacio',
    body: `
      ${
        s
          ? ''
          : `<fieldset class="field"><legend>Partir de una plantilla</legend>
              <div class="seg" style="flex-wrap:wrap">${TEMPLATES.map((t) => `<button type="button" data-tpl="${t.key}">${t.name}</button>`).join('')}</div>
            </fieldset>`
      }
      ${field({ label: 'Nombre', name: 'name', value: v.name, placeholder: 'Ej.: mi tienda, casa, maratón', attrs: 'autofocus required maxlength="40" autocomplete="off"' })}
      <fieldset class="field"><legend>Color</legend>
        <div class="swatches">${COLORS.map((c) => `<label data-color="${c}"><input type="radio" name="color" value="${c}" ${c === v.color ? 'checked' : ''} aria-label="${c}"><i></i></label>`).join('')}</div>
      </fieldset>
      <fieldset class="field"><legend>Icono</legend>
        <div class="swatches icons">${SPACE_ICONS.map((n) => `<label><input type="radio" name="icon" value="${n}" ${n === v.icon ? 'checked' : ''} aria-label="${n}"><span>${icon(n, 20)}</span></label>`).join('')}</div>
      </fieldset>
      <fieldset class="field"><legend>Qué quieres llevar aquí</legend>
        <div class="toggles">${MODULES.map((m) => `<label class="toggle"><input type="checkbox" name="m-${m}" ${v.modules.includes(m) ? 'checked' : ''}>${icon(MODULE_INFO[m].icon)}<span><b>${MODULE_INFO[m].label}</b><small>${MODULE_INFO[m].hint}</small></span></label>`).join('')}</div>
      </fieldset>`,
    onOpen(d) {
      d.querySelector('.sheet-body').addEventListener('click', (e) => {
        const b = e.target.closest('[data-tpl]');
        if (!b) return;
        const t = TEMPLATES.find((x) => x.key === b.dataset.tpl);
        const form = d.querySelector('form');
        if (!form.elements.name.value.trim() || TEMPLATES.some((x) => x.name === form.elements.name.value)) form.elements.name.value = t.name;
        form.elements.color.value = t.color;
        form.elements.icon.value = t.icon;
        for (const m of MODULES) form.elements[`m-${m}`].checked = t.modules.includes(m);
        v.modules = [...t.modules];
      });
    },
    onSubmit(d) {
      const name = d.name.trim();
      if (!name) return { name: 'Ponle un nombre al espacio.' };
      // Se respeta el orden que ya tenía el espacio; las secciones nuevas van al final.
      const picked = MODULES.filter((m) => d[`m-${m}`]);
      const modules = [...v.modules.filter((m) => picked.includes(m)), ...picked.filter((m) => !v.modules.includes(m))];
      if (!modules.length) return { 'm-tasks': 'Activa al menos una sección.' };
      const data = { name, color: d.color, icon: d.icon || 'compass', modules };
      if (s) {
        patch('spaces', s.id, data);
        toast('Espacio guardado');
      } else {
        const created = add('spaces', { ...data, createdAt: Date.now() });
        toast('Espacio creado');
        go(`#e-${created.id}`);
      }
    },
    onDelete: s
      ? async () => {
          const ok = await confirmDialog({
            title: `Eliminar ${s.name}`,
            text: 'Se borran también sus tareas, hábitos, movimientos, entrenamientos, notas y metas. No se puede deshacer.',
            action: 'Eliminar espacio',
          });
          if (!ok) return;
          removeSpace(s.id);
          toast('Espacio eliminado');
          go('#espacios');
        }
      : null,
  });
}

on({
  'space-new': () => {
    closeSheet();
    openSpaceSheet();
  },
  'space-edit': (el) => openSpaceSheet(el.dataset.id),
  'space-tab': (el, e) => {
    e.preventDefault();
    view.tab[el.dataset.id] = el.dataset.tab;
    view.finCat = null;
    rememberView();
    rerender();
  },
  'spaces-sort': () => {
    view.sortSpaces = !view.sortSpaces;
    rerender();
  },
  'space-move': (el) => moveSpace(el.dataset.id, Number(el.dataset.step)),
  // Desde el Resumen: abre el espacio directamente en Metas.
  'goto-goals': (el) => {
    view.tab[el.dataset.id] = 'goals';
  },
});
