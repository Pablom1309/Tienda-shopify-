// Piezas de interfaz compartidas: acciones, hojas, confirmaciones, avisos y campos de formulario.

import { icon } from './icons.js';
import { esc } from './util.js';
import { loadPrefs, restore, savePrefs, snapshot, spacesWith, state } from './store.js';

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

export const rerender = () => document.dispatchEvent(new Event('rumbo:render'));

// Vibración corta al marcar algo, donde el dispositivo la tenga.
export const tick = () => {
  try {
    navigator.vibrate?.(8);
  } catch {
    /* sin vibración */
  }
};

// ---------- Estado de vista (no se guarda con los datos) ----------

const prefs = loadPrefs();

export const view = {
  tab: prefs.tab || {}, // sección activa por espacio
  tasksView: prefs.tasksView === 'board' ? 'board' : 'list',
  showDone: false,
  expanded: new Set(), // tareas con los pasos desplegados
  finMonth: null,
  finCat: null,
  calMonth: null,
  calDay: null,
  roseShown: false,
  sortSpaces: false,
};

// Recuerda entre visitas en qué sección y en qué vista estabas.
export function rememberView() {
  savePrefs({ tab: view.tab, tasksView: view.tasksView });
}

// ---------- Capas (hojas y diálogos) y el botón atrás ----------
// Cada diálogo abierto añade un paso al historial, así "atrás" en el teléfono lo cierra
// en vez de sacarte de la pantalla. Incrustada en otra página no se toca el historial.

const useHistory = () => !window.RUMBO_EMBED;
let expectPops = 0;
let pendingHash = null;
let currentHash = typeof location !== 'undefined' ? location.hash : '';
let hashAtClose = null;

function show(d) {
  if (!d.open) d.showModal();
  if (useHistory() && !d._hist) {
    try {
      history.pushState({ rumboOverlay: true }, '');
      d._hist = true;
    } catch {
      /* historial no disponible */
    }
  }
}

function onOverlayClosed(d) {
  if (d.open) return; // se volvió a abrir enseguida: conserva su paso en el historial
  if (d._hist) {
    d._hist = false;
    // Solo se retrocede si seguimos en el paso que añadió la capa. Si la persona ya fue a otra
    // pantalla, retroceder la sacaría de ahí; el paso queda atrás y no molesta.
    if (history.state?.rumboOverlay) {
      expectPops++;
      hashAtClose = location.hash;
      history.back();
    } else {
      flushNav();
    }
  } else {
    flushNav();
  }
}

function flushNav() {
  if (pendingHash === null || expectPops > 0 || document.querySelector('dialog[open]')) return;
  const hash = pendingHash;
  pendingHash = null;
  location.hash = hash;
}

// Navega a otra pantalla. Si hay una capa cerrándose, espera a que el historial quede limpio.
export function go(hash) {
  pendingHash = hash;
  setTimeout(flushNav, 0);
}

function initHistory() {
  window.addEventListener('hashchange', () => (currentHash = location.hash));
  // popstate llega antes que hashchange: aquí currentHash aún tiene la pantalla de antes del retroceso.
  window.addEventListener('popstate', () => {
    if (expectPops > 0) {
      expectPops--;
      // Si mientras se cerraba la capa la persona tocó otra pantalla, el retroceso la habría
      // devuelto a la anterior: se vuelve a la que eligió.
      if (currentHash !== hashAtClose) location.replace(currentHash || '#');
      hashAtClose = null;
      flushNav();
      return;
    }
    // Atrás pulsado por la persona: cierra la capa de más arriba.
    const open = [...document.querySelectorAll('dialog[open]')].pop();
    if (open) {
      open._hist = false;
      open.close();
    }
  });
}

// ---------- Hoja (formulario en diálogo) ----------

const sheetEl = () => document.getElementById('sheet');
let sheetCfg = null;
let sheetDirty = false;

export function openSheet(cfg) {
  const d = sheetEl();
  sheetCfg = cfg;
  sheetDirty = false;
  d.classList.toggle('wide', !!cfg.wide);
  d.style.transform = '';
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
  show(d);
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
  initHistory();
  const d = sheetEl();

  d.addEventListener('click', (e) => {
    if (e.target === d) {
      // Tocar fuera cierra, salvo que ya hayas escrito algo: así no se pierde por un toque accidental.
      if (!sheetDirty) return closeSheet();
      const foot = d.querySelector('.sheet-foot');
      foot?.classList.remove('nudge');
      void foot?.offsetWidth;
      foot?.classList.add('nudge');
      return;
    }
    if (e.target.closest('[data-sheet-close]')) return closeSheet();
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
    sheetDirty = true;
    const wrap = e.target.closest('.field.invalid');
    if (wrap) {
      wrap.classList.remove('invalid');
      wrap.querySelector('.err')?.remove();
    }
  });

  // El evento llega con retraso: si ya se abrió otra hoja, su configuración no se toca.
  let closing = null;
  const origClose = d.close.bind(d);
  d.close = (...args) => {
    closing = sheetCfg; // la hoja que se cierra, por si otra se abre antes de que llegue el evento
    origClose(...args);
  };
  d.addEventListener('cancel', () => (closing = sheetCfg));
  d.addEventListener('close', () => {
    closing?.onClose?.();
    closing = null;
    onOverlayClosed(d);
    if (d.open) return;
    sheetCfg = null;
    d.replaceChildren(); // sin campos ocultos que retengan el foco
  });

  for (const id of ['search', 'confirm']) {
    const other = document.getElementById(id);
    other.addEventListener('close', () => onOverlayClosed(other));
  }

  initSwipeToClose(d);
}

// En teléfono, la hoja se cierra arrastrando su cabecera hacia abajo.
function initSwipeToClose(d) {
  let startY = null;
  let dy = 0;
  d.addEventListener('pointerdown', (e) => {
    if (!e.target.closest('.sheet-head') || e.target.closest('button') || !matchMedia('(max-width: 620px)').matches) return;
    startY = e.clientY;
    dy = 0;
    d.style.transition = 'none';
  });
  d.addEventListener('pointermove', (e) => {
    if (startY === null) return;
    dy = Math.max(0, e.clientY - startY);
    d.style.transform = `translateY(${dy}px)`;
  });
  const end = () => {
    if (startY === null) return;
    startY = null;
    d.style.transition = 'transform 0.22s cubic-bezier(0.22, 0.8, 0.24, 1)';
    if (dy > 110 && !sheetDirty) {
      d.style.transform = 'translateY(100%)';
      setTimeout(() => {
        closeSheet();
        d.style.transform = '';
        d.style.transition = '';
      }, 180);
    } else {
      d.style.transform = '';
    }
  };
  d.addEventListener('pointerup', end);
  d.addEventListener('pointercancel', end);
}

// Abre un diálogo registrándolo en el historial (lo usa el buscador).
export const showDialog = show;

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
    show(d);
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

// Ejecuta un cambio y ofrece deshacerlo.
export function withUndo(message, fn) {
  const before = snapshot();
  fn();
  toast(message, { undo: () => restore(before) });
}
export const removeWithUndo = withUndo;

// ---------- Exportar un texto (archivo o portapapeles) ----------

export function openExportSheet({ title, intro, filename, text, mime }) {
  openSheet({
    title,
    body: `
      <p class="muted">${esc(intro)}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a class="btn" id="export-file" download="${esc(filename)}">${icon('download', 18)}<span>Descargar archivo</span></a>
        <button type="button" class="btn line" id="export-copy">${icon('copy', 18)}<span>Copiar texto</span></button>
      </div>
      ${textarea({ label: 'Contenido', name: 'json', value: text, rows: 8 })}`,
    onOpen(d) {
      const ta = d.querySelector('textarea');
      ta.readOnly = true;
      ta.style.fontSize = '0.75rem';
      const link = d.querySelector('#export-file');
      try {
        // En la vista previa incrustada las descargas están bloqueadas: queda solo "Copiar texto".
        if (window.RUMBO_EMBED) throw new Error('sin descargas');
        link.href = URL.createObjectURL(new Blob([text], { type: mime }));
      } catch {
        link.hidden = true;
      }
      d.querySelector('#export-copy').onclick = async () => {
        try {
          await navigator.clipboard.writeText(text);
          toast('Copiado al portapapeles');
        } catch {
          ta.focus();
          ta.select();
          toast('Selecciona y copia el texto');
        }
      };
    },
  });
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
