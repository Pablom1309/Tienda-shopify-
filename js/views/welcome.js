import { icon } from '../icons.js';
import { esc } from '../util.js';
import { replaceState, state, update } from '../store.js';
import { sampleState, spaceFromTemplate, TEMPLATES } from '../seed.js';
import { go, on } from '../ui.js';

export const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="9" fill="var(--tinta)"/><path d="M16 4.5 19.2 12.8 27.5 16 19.2 19.2 16 27.5 12.8 19.2 4.5 16 12.8 12.8Z" fill="var(--carta)"/><path d="M16 4.5 19.2 12.8 16 16ZM27.5 16 19.2 19.2 16 16ZM16 27.5 12.8 19.2 16 16ZM4.5 16 12.8 12.8 16 16Z" fill="var(--magenta)"/></svg>`;

export function renderWelcome() {
  return `<div class="welcome"><div class="welcome-in">
    <div class="brand">${LOGO}<span>Rumbo</span></div>
    <header class="today-head">
      <h1 class="display">Todo lo que llevas, en un solo lugar.</h1>
      <p class="lead">Organiza tu negocio, tu casa y tu entrenamiento por espacios. Cada uno con sus tareas, hábitos, finanzas, sesiones, notas y metas.</p>
    </header>
    <form class="form" data-welcome>
      <label class="field" style="max-width:22rem"><span>Tu nombre</span>
        <input type="text" name="name" id="w-name" placeholder="Opcional" maxlength="30" autocomplete="given-name"></label>
      <fieldset class="field"><legend>Qué quieres gestionar</legend>
        <div class="toggles">${TEMPLATES.map(
          (t, i) => `<label class="toggle tpl" data-color="${t.color}"><input type="checkbox" name="tpl" value="${t.key}" ${i < 3 ? 'checked' : ''}>${icon(t.icon)}<span><b>${esc(t.name)}</b><small>${esc(t.hint)}</small></span></label>`,
        ).join('')}</div>
        <span class="hint">Después puedes crear más, renombrarlos y elegir qué lleva cada uno.</span>
      </fieldset>
      <div class="actions">
        <button class="btn">Empezar</button>
        <button type="button" class="link" data-action="welcome-sample">Explorar con datos de ejemplo</button>
      </div>
    </form>
    <p class="muted small">Tus datos se guardan solo en este dispositivo. No hay cuentas ni servidores.</p>
  </div></div>`;
}

document.addEventListener('submit', (e) => {
  const form = e.target.closest?.('[data-welcome]');
  if (!form) return;
  e.preventDefault();
  const keys = [...form.querySelectorAll('input[name="tpl"]:checked')].map((i) => i.value);
  update((s) => {
    s.profile.name = form.elements.name.value.trim();
    s.profile.onboarded = true;
    s.profile.sample = false;
    s.spaces = keys.map(spaceFromTemplate);
  });
  go(state.spaces.length ? '#hoy' : '#espacios');
});

on({
  'welcome-sample': () => {
    const next = sampleState(state.profile.currency);
    next.profile.theme = state.profile.theme;
    replaceState(next);
    go('#hoy');
  },
});
