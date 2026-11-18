// Armazón: navegación, pintado de pantallas, buscador y menú de alta rápida.

import { icon } from './icons.js';
import { esc } from './util.js';
import { replaceState, runRecurring, spacesWith, state, subscribe } from './store.js';
import { MODULE_INFO, sampleState } from './seed.js';
import { bindActions, closeSheet, go, initSheet, on, openSheet, showDialog, view } from './ui.js';
import { openTaskSheet } from './modules/tasks.js';
import { openHabitSheet } from './modules/habits.js';
import { openTxSheet } from './modules/finance.js';
import { openWorkoutSheet } from './modules/training.js';
import { openNoteSheet } from './modules/notes.js';
import { openGoalSheet } from './modules/goals.js';
import { renderToday } from './views/today.js';
import { renderCalendar } from './views/calendar.js';
import { openSpaceSheet, renderSpace, renderSpaces } from './views/space.js';
import { applyTheme, renderSettings } from './views/settings.js';
import { renderSummary } from './views/summary.js';
import { LOGO, renderWelcome } from './views/welcome.js';

const root = document.getElementById('app');

// ---------- Rutas ----------
// Solo nombres simples en el hash: #hoy, #calendario, #espacios, #ajustes y #e-<id>.

function route() {
  const h = location.hash.replace(/^#/, '');
  if (h.startsWith('e-')) return { name: 'space', id: h.slice(2) };
  if (['calendario', 'espacios', 'ajustes', 'resumen'].includes(h)) return { name: h };
  return { name: 'hoy' };
}

function renderView(r) {
  if (r.name === 'space') return renderSpace(r.id);
  if (r.name === 'calendario') return renderCalendar();
  if (r.name === 'espacios') return renderSpaces();
  if (r.name === 'ajustes') return renderSettings();
  if (r.name === 'resumen') return renderSummary();
  return renderToday();
}

// ---------- Armazón ----------

const isMac = /Mac|iPhone|iPad/.test(navigator.platform || '');

function sidebar(r) {
  const link = (hash, ico, label, current) => `<a class="side-link" href="#${hash}" ${current ? 'aria-current="page"' : ''}>${icon(ico, 19)}<span class="label">${label}</span></a>`;
  return `<aside class="side">
    <a class="brand" href="#hoy" aria-label="Rumbo, ir a Hoy">${LOGO}<span>Rumbo</span></a>
    <nav aria-label="Principal">
      ${link('hoy', 'sun', 'Hoy', r.name === 'hoy')}
      ${link('calendario', 'calendar-days', 'Calendario', r.name === 'calendario')}
      ${link('resumen', 'trending-up', 'Resumen', r.name === 'resumen')}
      <button class="side-link" data-action="search-open">${icon('search', 19)}<span class="label">Buscar</span><kbd>${isMac ? '⌘K' : 'Ctrl K'}</kbd></button>
    </nav>
    <nav class="side-spaces" aria-label="Espacios">
      <a class="side-label" href="#espacios">Espacios</a>
      ${state.spaces
        .map((s) => {
          const open = state.tasks.filter((t) => t.spaceId === s.id && t.status !== 'done').length;
          return `<a class="side-link" href="#e-${s.id}" data-color="${s.color}" ${r.name === 'space' && r.id === s.id ? 'aria-current="page"' : ''}><i class="dot"></i><span class="label">${esc(s.name)}</span>${open ? `<span class="count num">${open}</span>` : ''}</a>`;
        })
        .join('')}
      <button class="side-link" data-action="space-new">${icon('plus', 19)}<span class="label">Nuevo espacio</span></button>
    </nav>
    <nav aria-label="Otros">
      <button class="btn block" data-action="quick-add" style="margin-bottom:10px">${icon('plus', 18)}<span>Añadir</span></button>
      ${link('ajustes', 'settings', 'Ajustes', r.name === 'ajustes')}
    </nav>
  </aside>`;
}

function tabbar(r) {
  const tab = (hash, ico, label, current) => `<a class="tab" href="#${hash}" ${current ? 'aria-current="page"' : ''}>${icon(ico, 22)}<span>${label}</span></a>`;
  return `<nav class="tabbar" aria-label="Principal">
    ${tab('hoy', 'sun', 'Hoy', r.name === 'hoy')}
    ${tab('calendario', 'calendar-days', 'Calendario', r.name === 'calendario')}
    <button class="tab-add" data-action="quick-add" aria-label="Añadir"><span>${icon('plus', 24)}</span></button>
    ${tab('espacios', 'layout-grid', 'Espacios', r.name === 'espacios' || r.name === 'space')}
    ${tab('ajustes', 'settings', 'Ajustes', r.name === 'ajustes')}
  </nav>`;
}

let lastRoute = '';

function render() {
  if (!state.profile.onboarded) {
    root.innerHTML = renderWelcome();
    lastRoute = '';
    return;
  }
  const r = route();
  const key = `${r.name}:${r.id || ''}`;
  const main = root.querySelector('.main');
  const keepScroll = main && key === lastRoute ? main.scrollTop : 0;
  // Si el foco está en un campo de la página (por ejemplo el nombre en Ajustes), se conserva.
  const active = document.activeElement;
  const refocus = view.refocus || (active && root.contains(active) && active.id ? active.id : null);
  view.refocus = null;

  root.innerHTML = `<div class="app">${sidebar(r)}<main class="main" id="main"><div class="page">${renderView(r)}</div></main>${tabbar(r)}</div>`;
  root.querySelector('.main').scrollTop = keepScroll;
  if (refocus) document.getElementById(refocus)?.focus({ preventScroll: true });
  lastRoute = key;

  const titles = { hoy: 'Hoy', calendario: 'Calendario', espacios: 'Espacios', ajustes: 'Ajustes', resumen: 'Resumen' };
  const name = r.name === 'space' ? state.spaces.find((s) => s.id === r.id)?.name : titles[r.name];
  document.title = name ? `${name} – Rumbo` : 'Rumbo';
}

// ---------- Alta rápida ----------

const ADDERS = {
  tasks: { label: 'Tarea', hint: 'Un pendiente, con fecha si la tiene', open: openTaskSheet },
  habits: { label: 'Hábito', hint: 'Algo que repites ciertos días', open: openHabitSheet },
  finance: { label: 'Movimiento', hint: 'Un ingreso o un gasto', open: openTxSheet },
  training: { label: 'Entrenamiento', hint: 'Una sesión con sus ejercicios', open: openWorkoutSheet },
  notes: { label: 'Nota', hint: 'Una idea o un apunte', open: openNoteSheet },
  goals: { label: 'Meta', hint: 'Un número al que quieres llegar', open: openGoalSheet },
};

function openQuickAdd() {
  const r = route();
  const current = r.name === 'space' ? state.spaces.find((s) => s.id === r.id) : null;
  const mods = Object.keys(ADDERS).filter((m) => (current ? current.modules.includes(m) : spacesWith(m).length));
  openSheet({
    title: current ? `Añadir a ${current.name}` : 'Añadir',
    body: `<div class="menu-list">
      ${mods
        .map((m) => `<button type="button" class="menu-item" data-action="quick-pick" data-mod="${m}" data-space="${current?.id || ''}"><span class="tile" data-color="${current?.color || 'pizarra'}">${icon(MODULE_INFO[m].icon, 20)}</span><span><b>${ADDERS[m].label}</b><small>${ADDERS[m].hint}</small></span></button>`)
        .join('')}
      <button type="button" class="menu-item" data-action="space-new"><span class="tile" data-color="pizarra">${icon('layout-grid', 20)}</span><span><b>Espacio</b><small>Un área nueva para gestionar</small></span></button>
    </div>`,
  });
}

// ---------- Buscador ----------

function searchResults(q) {
  const norm = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const needle = norm(q.trim());
  const spaceOf = (id) => state.spaces.find((s) => s.id === id);
  const hit = (action, attrs, ico, color, title, sub) =>
    `<button class="hit" data-action="${action}" ${attrs}><span class="tile" data-color="${color || 'pizarra'}">${icon(ico, 16)}</span><span class="t">${esc(title)}</span><span class="s">${esc(sub || '')}</span></button>`;

  if (!needle) {
    return `<h3 class="group-title">Ir a</h3>
      ${hit('search-go', 'data-hash="hoy"', 'sun', '', 'Hoy')}
      ${hit('search-go', 'data-hash="calendario"', 'calendar-days', '', 'Calendario')}
      ${hit('search-go', 'data-hash="resumen"', 'trending-up', '', 'Resumen')}
      ${state.spaces.map((s) => hit('search-go', `data-hash="e-${s.id}"`, s.icon, s.color, s.name, 'Espacio')).join('')}
      ${hit('search-go', 'data-hash="ajustes"', 'settings', '', 'Ajustes')}`;
  }

  const groups = [
    ['Espacios', state.spaces.filter((s) => norm(s.name).includes(needle)).map((s) => hit('search-go', `data-hash="e-${s.id}"`, s.icon, s.color, s.name, 'Espacio'))],
    ['Tareas', state.tasks.filter((t) => norm(`${t.title} ${t.notes}`).includes(needle)).map((t) => hit('task-open', `data-id="${t.id}"`, 'list-checks', spaceOf(t.spaceId)?.color, t.title, spaceOf(t.spaceId)?.name))],
    ['Notas', state.notes.filter((n) => norm(`${n.title} ${n.body}`).includes(needle)).map((n) => hit('note-open', `data-id="${n.id}"`, 'sticky-note', spaceOf(n.spaceId)?.color, n.title || 'Sin título', spaceOf(n.spaceId)?.name))],
    ['Hábitos', state.habits.filter((h) => norm(h.name).includes(needle)).map((h) => hit('habit-open', `data-id="${h.id}"`, 'flame', spaceOf(h.spaceId)?.color, h.name, spaceOf(h.spaceId)?.name))],
    ['Metas', state.goals.filter((g) => norm(g.name).includes(needle)).map((g) => hit('goal-open', `data-id="${g.id}"`, 'target', spaceOf(g.spaceId)?.color, g.name, spaceOf(g.spaceId)?.name))],
    ['Entrenamientos', state.workouts.filter((w) => norm(`${w.name} ${w.exercises.map((e) => e.name).join(' ')}`).includes(needle)).map((w) => hit('workout-open', `data-id="${w.id}"`, 'dumbbell', spaceOf(w.spaceId)?.color, w.name || 'Entrenamiento', w.date))],
  ].filter(([, hits]) => hits.length);

  if (!groups.length) return `<p class="muted" style="padding:20px 8px">Nada coincide con "${esc(q.trim())}". Prueba con otra palabra.</p>`;
  return groups.map(([title, hits]) => `<h3 class="group-title">${title}</h3>${hits.slice(0, 6).join('')}`).join('');
}

function openSearch() {
  if (!state.profile.onboarded) return;
  const d = document.getElementById('search');
  d.innerHTML = `<label class="search-in">${icon('search')}<input id="search-q" type="search" placeholder="Buscar tareas, notas, espacios" aria-label="Buscar" autocomplete="off"><button type="button" class="icon-btn" data-action="search-close" aria-label="Cerrar">${icon('x')}</button></label><div class="search-out" id="search-out">${searchResults('')}</div>`;
  showDialog(d);
  const input = d.querySelector('input');
  input.focus();
  input.oninput = () => (d.querySelector('#search-out').innerHTML = searchResults(input.value));
  input.onkeydown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      d.querySelector('.hit')?.focus();
    } else if (e.key === 'Enter') {
      // Sin esto, el mismo Enter llega al formulario que se abre y lo envía.
      e.preventDefault();
      d.querySelector('.hit')?.click();
    }
  };
}

const closeSearch = () => {
  const d = document.getElementById('search');
  if (d.open) d.close();
};

on({
  'quick-add': openQuickAdd,
  'quick-pick': (el) => {
    closeSheet();
    ADDERS[el.dataset.mod].open({ spaceId: el.dataset.space || undefined });
  },
  'search-open': openSearch,
  'search-close': closeSearch,
  'search-go': (el) => {
    closeSearch();
    go(`#${el.dataset.hash}`);
  },
});

// ---------- Arranque ----------

function boot() {
  // La vista previa incrustada abre con datos de ejemplo para que se vea en uso.
  if (window.RUMBO_DEMO && !state.profile.onboarded) replaceState(sampleState(state.profile.currency));

  runRecurring();
  applyTheme();
  initSheet();
  bindActions(document);
  subscribe(render);
  window.addEventListener('hashchange', () => {
    closeSearch();
    render();
    root.querySelector('.main')?.scrollTo(0, 0);
  });
  document.addEventListener('rumbo:render', render);

  const search = document.getElementById('search');
  search.addEventListener('click', (e) => {
    if (e.target === search) closeSearch();
    else if (e.target.closest('.hit') && !e.target.closest('[data-action="search-go"]')) closeSearch();
  });
  search.addEventListener('close', () => search.replaceChildren());
  search.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const hits = [...search.querySelectorAll('.hit')];
    const i = hits.indexOf(document.activeElement);
    if (i === -1) return;
    e.preventDefault();
    if (e.key === 'ArrowUp' && i === 0) search.querySelector('input').focus();
    else hits[e.key === 'ArrowDown' ? Math.min(i + 1, hits.length - 1) : i - 1]?.focus();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
      return;
    }
    const a = document.activeElement;
    // Un campo dentro de una hoja ya cerrada no cuenta como "escribiendo".
    const inField = a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && !a.closest('dialog:not([open])');
    const typing = inField || document.querySelector('dialog[open]');
    if (typing || e.metaKey || e.ctrlKey || e.altKey || !state.profile.onboarded) return;
    const key = e.key.toLowerCase();
    const jump = { h: '#hoy', c: '#calendario', r: '#resumen', e: '#espacios' }[key];
    if (key === 'n') {
      e.preventDefault();
      openQuickAdd();
    } else if (jump) {
      e.preventDefault();
      go(jump);
    }
  });

  // El día cambia aunque la app siga abierta: se repinta al volver a ella.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    runRecurring();
    if (!document.querySelector('dialog[open]')) render();
  });

  render();

  if ('serviceWorker' in navigator && !window.RUMBO_EMBED && /^https?:$/.test(location.protocol)) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

boot();
