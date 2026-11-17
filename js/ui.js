// Piezas de interfaz compartidas: acciones, hojas, confirmaciones, avisos y campos de formulario.

import { icon } from './icons.js';
import { esc } from './util.js';
import { restore, snapshot, spacesWith, state } from './store.js';

// ---------- Acciones ----------
// El HTML marca los elementos con data-action="nombre"; aquí se registra qué hace cada una.

const actions = {};
export const on = (map) => Object.assign(actions, map);

export function bindActions(root = document) {
  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (fn) fn(el, e);
  });
}

// ---------- Estado de vista (no se guarda con los datos) ----------

export const view = {
  tab: {}, // módulo activo por espacio
  tasksView: 'list',
  showDone: false,
  finMonth: null,
  calMonth: null,
  calDay: null,
  roseShown: false,
};

// ---------- Hoja (formulario en diálogo) ----------

const sheetEl = () => document.getElementById('sheet');
let sheetCfg = null;

export function openSheet(cfg) {
  const d = sheetEl();
  sheetCfg = cfg;
  d.innerHTML = `
    <form method="dialog" novalidate>
      <header class="sheet-head">
        <h2 class="h2">${esc(cfg.title)}</h2>
        <button type="button" class="icon-btn" data-sheet-close aria-label="Cerrar">${icon('x')}</button>
      </header>
      <div class="sheet-body"><div class="form">${cfg.body}</div></div>
      ${
        cfg.onSubmit || cfg.onDelete
          ? `<footer class="sheet-foot">
              ${cfg.onDelete ? `<button type="button" class="btn danger" data-sheet-delete>${icon('trash-2', 18)}<span>${esc(cfg.deleteLabel || 'Eliminar')}</span></button>` : ''}
              <div class="right">
                <button type="button" class="btn soft" data-sheet-close>Cancelar</button>
                ${cfg.onSubmit ? `<button type="submit" class="btn">${esc(cfg.submitLabel || 'Guardar')}</button>` : ''}
              </div>
            </footer>`
          : ''
      }
    </form>`;
  if (!d.open) d.showModal();
  cfg.onOpen?.(d);
  const first = d.querySelector('[autofocus]');
  if (first) first.focus();
}

export function closeSheet() {
  const d = sheetEl();
  if (d.open) d.close();
  sheetCfg = null;
}

export function fieldError(form, name, message) {
  const input = form.elements[name];
  const wrap = (input instanceof RadioNodeList ? input[0] : input)?.closest('.field');
  if (!wrap) return;
  wrap.classList.add('invalid');
  let err = wrap.querySelector('.err');
  if (!err) {
    err = document.createElement('span');
    err.className = 'err';
    wrap.append(err);
  }
  err.textContent = message;
}

export function initSheet() {
  const d = sheetEl();
  d.addEventListener('click', (e) => {
    if (e.target === d || e.target.closest('[data-sheet-close]')) return closeSheet();
    if (e.target.closest('[data-sheet-delete]')) {
      const cfg = sheetCfg;
      closeSheet();
      cfg?.onDelete?.();
    }
  });
  d.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!sheetCfg?.onSubmit) return;
    const form = e.target;
    form.querySelectorAll('.invalid').forEach((el) => el.classList.remove('invalid'));
    form.querySelectorAll('.err').forEach((el) => el.remove());
    const data = Object.fromEntries(new FormData(form));
    const errors = sheetCfg.onSubmit(data, form);
    if (errors && typeof errors === 'object') {
      const names = Object.keys(errors);
      for (const n of names) fieldError(form, n, errors[n]);
      const firstBad = form.elements[names[0]];
      (firstBad instanceof RadioNodeList ? firstBad[0] : firstBad)?.focus();
      return;
    }
    closeSheet();
  });
  d.addEventListener('input', (e) => {
    const wrap = e.target.closest('.field.invalid');
    if (wrap) {
      wrap.classList.remove('invalid');
      wrap.querySelector('.err')?.remove();
    }
  });
  // El evento llega con retraso: si ya se abrió otra hoja, su configuración no se toca.
  d.addEventListener('close', () => {
    if (d.open) return;
    sheetCfg = null;
    d.replaceChildren(); // sin campos ocultos que retengan el foco
  });
}

// ---------- Confirmación ----------

export function confirmDialog({ title, text, action = 'Eliminar', danger = true }) {
  return new Promise((resolve) => {
    const d = document.getElementById('confirm');
    d.innerHTML = `
      <h2 class="h2">${esc(title)}</h2>
      <p>${esc(text)}</p>
      <div class="actions">
        <button class="btn soft" value="no">Cancelar</button>
        <button class="btn ${danger ? 'danger' : ''}" value="yes">${esc(action)}</button>
      </div>`;
    d.returnValue = 'no';
    d.onclick = (e) => {
      const b = e.target.closest('button');
      if (b) d.close(b.value);
      else if (e.target === d) d.close('no');
    };
    d.onclose = () => resolve(d.returnValue === 'yes');
    d.showModal();
  });
}

// ---------- Avisos ----------

export function toast(message, { undo } = {}) {
  const box = document.getElementById('toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<span>${esc(message)}</span>${undo ? '<button type="button">Deshacer</button>' : ''}`;
  const close = () => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 220);
  };
  if (undo) {
    el.querySelector('button').onclick = () => {
      undo();
      close();
    };
  }
  box.replaceChildren(el);
  setTimeout(close, undo ? 6000 : 2600);
}

// Ejecuta un borrado y ofrece deshacerlo.
export function removeWithUndo(message, fn) {
  const before = snapshot();
  fn();
  toast(message, { undo: () => restore(before) });
}

// ---------- Campos ----------

export function field({ label, name, value = '', type = 'text', placeholder = '', attrs = '', hint = '' }) {
  return `<label class="field"><span>${esc(label)}</span>
    <input type="${type}" name="${name}" id="f-${name}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${attrs}>
    ${hint ? `<span class="hint">${esc(hint)}</span>` : ''}</label>`;
}

export function textarea({ label, name, value = '', placeholder = '', rows = 4 }) {
  return `<label class="field"><span>${esc(label)}</span>
    <textarea name="${name}" id="f-${name}" rows="${rows}" placeholder="${esc(placeholder)}">${esc(value)}</textarea></label>`;
}

export function select({ label, name, value, options }) {
  return `<label class="field"><span>${esc(label)}</span>
    <select name="${name}" id="f-${name}">${options
      .map((o) => `<option value="${esc(o.value)}" ${String(o.value) === String(value) ? 'selected' : ''}>${esc(o.label)}</option>`)
      .join('')}</select></label>`;
}

export function segmented({ label, name, value, options }) {
  return `<fieldset class="field"><legend>${esc(label)}</legend>
    <div class="seg block">${options
      .map((o) => `<label><input type="radio" name="${name}" value="${esc(o.value)}" ${String(o.value) === String(value) ? 'checked' : ''}><span>${esc(o.label)}</span></label>`)
      .join('')}</div></fieldset>`;
}

// Selector de espacio, solo con los que tienen activo el módulo.
export function spaceSelect(mod, current) {
  const spaces = spacesWith(mod);
  // Si el registro está en un espacio que ya no tiene el módulo activo, se mantiene como opción.
  const own = current && state.spaces.find((x) => x.id === current);
  if (own && !spaces.includes(own)) spaces.push(own);
  if (spaces.length <= 1) return `<input type="hidden" name="spaceId" value="${esc(spaces[0]?.id || '')}">`;
  return select({ label: 'Espacio', name: 'spaceId', value: current || spaces[0].id, options: spaces.map((s) => ({ value: s.id, label: s.name })) });
}

export const currency = () => state.profile.currency;

export function emptyState({ ico, text, action, label, attrs = '' }) {
  return `<div class="empty">${icon(ico, 28)}<p>${esc(text)}</p>${
    action ? `<button class="btn" data-action="${action}" ${attrs}>${icon('plus', 18)}<span>${esc(label)}</span></button>` : ''
  }</div>`;
}
