import { icon } from '../icons.js';
import { esc } from '../util.js';
import { canPersist, CURRENCIES, exportJSON, importJSON, replaceState, resetAll, state, update } from '../store.js';
import { sampleState } from '../seed.js';
import { closeSheet, confirmDialog, go, on, openExportSheet, openSheet, rerender, textarea, toast } from '../ui.js';

export function applyTheme() {
  const t = state.profile.theme;
  const root = document.documentElement;
  if (t === 'light' || t === 'dark') root.dataset.theme = t;
  else if (!window.RUMBO_EMBED) delete root.dataset.theme; // incrustada, el tema lo pone quien la aloja
}

// El navegador avisa cuando la app se puede instalar; se guarda para ofrecer el botón.
let installPrompt = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;
    rerender();
  });
  window.addEventListener('appinstalled', () => {
    installPrompt = null;
    rerender();
  });
}

const CURRENCY_NAMES = { CLP: 'Peso chileno', USD: 'Dólar', EUR: 'Euro', MXN: 'Peso mexicano', COP: 'Peso colombiano', ARS: 'Peso argentino', PEN: 'Sol peruano' };

export function renderSettings() {
  const p = state.profile;
  const count = state.tasks.length + state.habits.length + state.tx.length + state.workouts.length + state.notes.length + state.goals.length;
  const theme = (value, label, ico) => `<button data-action="set-theme" data-theme="${value}" aria-pressed="${p.theme === value}">${icon(ico, 16)}${label}</button>`;
  return `
    <header class="page-head"><h1 class="h1">Ajustes</h1></header>
    <div class="settings">
      ${canPersist() ? '' : '<div class="notice" style="margin-bottom:20px"><span>Este navegador no deja guardar datos, así que lo que anotes se pierde al cerrar. Suele pasar en ventanas privadas.</span></div>'}
      <section class="section">
        <h2 class="h2">Preferencias</h2>
        <div class="list">
          <div class="set-row">
            <div><label class="h3" for="set-name">Tu nombre</label><p>Aparece en el saludo de la pantalla Hoy.</p></div>
            <div class="ctl"><input class="input" id="set-name" data-setting="name" value="${esc(p.name)}" placeholder="Cómo te llamas" maxlength="30" autocomplete="given-name" style="width:13rem"></div>
          </div>
          <div class="set-row">
            <div><span class="h3">Apariencia</span><p>Automático sigue el tema de tu dispositivo.</p></div>
            <div class="seg" role="group" aria-label="Apariencia">${theme('system', 'Automático', 'monitor')}${theme('light', 'Claro', 'sun')}${theme('dark', 'Oscuro', 'moon')}</div>
          </div>
          <div class="set-row">
            <div><label class="h3" for="set-currency">Moneda</label><p>Se usa en finanzas. Cambiarla no convierte los montos.</p></div>
            <div class="ctl"><select class="input" id="set-currency" data-setting="currency" style="width:13rem">${CURRENCIES.map((c) => `<option value="${c}" ${c === p.currency ? 'selected' : ''}>${CURRENCY_NAMES[c]} (${c})</option>`).join('')}</select></div>
          </div>
        </div>
      </section>

      <section class="section" style="margin-top:36px">
        <h2 class="h2">Tus datos</h2>
        <p class="muted">Todo se guarda solo en este dispositivo. Para pasarlo a otro, o para tener un respaldo, exporta una copia e impórtala allá.</p>
        <div class="list">
          <div class="set-row">
            <div><span class="h3">Copia de seguridad</span><p><span class="num">${state.spaces.length}</span> espacios y <span class="num">${count}</span> registros.</p></div>
            <div class="ctl">
              <button class="btn line" data-action="data-export">${icon('download', 18)}<span>Exportar</span></button>
              <button class="btn line" data-action="data-import">${icon('upload', 18)}<span>Importar</span></button>
            </div>
          </div>
          <div class="set-row">
            <div><span class="h3">Datos de ejemplo</span><p>Reemplaza lo que hay por un ejemplo completo para explorar la app.</p></div>
            <div class="ctl"><button class="btn line" data-action="data-sample">Cargar ejemplo</button></div>
          </div>
          <div class="set-row">
            <div><span class="h3">Borrar todo</span><p>Elimina todos los espacios y registros de este dispositivo.</p></div>
            <div class="ctl"><button class="btn danger" data-action="data-reset">${icon('trash-2', 18)}<span>Borrar todo</span></button></div>
          </div>
        </div>
      </section>

      <section class="section" style="margin-top:36px">
        <h2 class="h2">Instalar en tu dispositivo</h2>
        ${
          installPrompt
            ? `<div class="set-row"><div><span class="h3">Rumbo como app</span><p>Queda con su icono, abre a pantalla completa y funciona sin conexión.</p></div><div class="ctl"><button class="btn" data-action="app-install">${icon('download', 18)}<span>Instalar Rumbo</span></button></div></div>`
            : '<p class="muted">Rumbo funciona como app y sin conexión. En el teléfono, abre el menú del navegador y elige "Añadir a pantalla de inicio" o "Instalar app". En el computador, usa el icono de instalar que aparece en la barra de direcciones.</p>'
        }
      </section>

      <section class="section keys" style="margin-top:36px">
        <h2 class="h2">Atajos de teclado</h2>
        <dl class="keys-list">
          <div><dt><kbd>N</kbd></dt><dd>Añadir algo</dd></div>
          <div><dt><kbd>Ctrl</kbd> <kbd>K</kbd></dt><dd>Buscar</dd></div>
          <div><dt><kbd>H</kbd></dt><dd>Ir a Hoy</dd></div>
          <div><dt><kbd>C</kbd></dt><dd>Ir al Calendario</dd></div>
          <div><dt><kbd>R</kbd></dt><dd>Ir al Resumen</dd></div>
          <div><dt><kbd>E</kbd></dt><dd>Ir a Espacios</dd></div>
          <div><dt><kbd>Esc</kbd></dt><dd>Cerrar lo que esté abierto</dd></div>
        </dl>
      </section>

      <section class="section" style="margin-top:36px">
        <h2 class="h2">Escribir tareas más rápido</h2>
        <p class="muted">En los campos de "Añadir tarea" puedes escribir todo en una frase y Rumbo lo separa solo.</p>
        <dl class="keys-list wide">
          <div><dt>mañana, el viernes, 15/12, en 3 días</dt><dd>Fecha</dd></div>
          <div><dt>18:00, 6pm, a las 9</dt><dd>Hora</dd></div>
          <div><dt>! o !!</dt><dd>Prioridad media o alta</dd></div>
          <div><dt>cada día, cada lunes, cada mes</dt><dd>Se repite</dd></div>
          <div><dt>#nombre</dt><dd>Espacio donde va</dd></div>
        </dl>
      </section>
    </div>`;
}

function openExport() {
  openExportSheet({
    title: 'Exportar copia',
    intro: 'Descarga el archivo o copia el texto y guárdalo donde quieras. Contiene todos tus espacios y registros.',
    filename: `rumbo-${new Date().toISOString().slice(0, 10)}.json`,
    text: exportJSON(),
    mime: 'application/json',
  });
}

function openImport() {
  openSheet({
    title: 'Importar copia',
    submitLabel: 'Importar y reemplazar',
    body: `
      <p class="muted">Elige el archivo .json que exportaste, o pega su contenido. Reemplaza todo lo que hay ahora en este dispositivo.</p>
      <label class="field"><span>Archivo</span><input type="file" id="import-file" accept=".json,application/json" class="input" style="padding:10px"></label>
      ${textarea({ label: 'O pega el contenido', name: 'json', value: '', placeholder: '{ "app": "rumbo", … }', rows: 6 })}`,
    onOpen(d) {
      d.querySelector('#import-file').onchange = async (e) => {
        const file = e.target.files[0];
        if (file) d.querySelector('textarea').value = await file.text();
      };
    },
    onSubmit(d) {
      if (!d.json.trim()) return { json: 'Elige un archivo o pega el contenido de la copia.' };
      try {
        importJSON(d.json);
      } catch (err) {
        return { json: err.message };
      }
      applyTheme();
      toast('Copia importada');
    },
  });
}

on({
  'set-theme': (el) => {
    update((s) => (s.profile.theme = el.dataset.theme));
    applyTheme();
  },
  'app-install': async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice.catch(() => {});
    installPrompt = null;
    rerender();
  },
  'data-export': openExport,
  'data-import': openImport,
  'data-sample': async () => {
    const hasData = state.spaces.length > 0 && !state.profile.sample;
    if (hasData) {
      const ok = await confirmDialog({ title: 'Cargar datos de ejemplo', text: 'Reemplaza todos tus espacios y registros por el ejemplo. Exporta una copia antes si quieres conservarlos.', action: 'Reemplazar por el ejemplo' });
      if (!ok) return;
    }
    const keep = { name: state.profile.name, theme: state.profile.theme };
    const next = sampleState(state.profile.currency);
    Object.assign(next.profile, keep);
    replaceState(next);
    toast('Ejemplo cargado');
    go('#hoy');
  },
  'data-reset': async () => {
    const ok = await confirmDialog({ title: 'Borrar todo', text: 'Se eliminan todos los espacios y registros de este dispositivo. No se puede deshacer.', action: 'Borrar todo' });
    if (!ok) return;
    closeSheet();
    resetAll();
    applyTheme();
    go('');
  },
  'start-fresh': async () => {
    const ok = await confirmDialog({ title: 'Empezar con mis datos', text: 'Se quitan los datos de ejemplo y eliges tus propios espacios.', action: 'Empezar', danger: false });
    if (!ok) return;
    const theme = state.profile.theme;
    resetAll();
    update((s) => (s.profile.theme = theme));
    go('');
  },
});

// Nombre y moneda se guardan al cambiar el campo.
document.addEventListener('change', (e) => {
  const el = e.target.closest?.('[data-setting]');
  if (!el) return;
  update((s) => (s.profile[el.dataset.setting] = el.value.trim()));
  toast('Guardado');
});
