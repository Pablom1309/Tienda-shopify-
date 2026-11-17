import { icon } from '../icons.js';
import { esc, relDate, ymd } from '../util.js';
import { add, bySpace, find, patch, remove, spacesWith } from '../store.js';
import { closeSheet, emptyState, field, on, openSheet, removeWithUndo, spaceSelect, textarea, toast } from '../ui.js';

export function renderNotes(space) {
  const notes = bySpace('notes', space.id).sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
  return `<div class="toolbar">
      <span></span>
      <button class="btn" data-action="note-new" data-space="${space.id}">${icon('plus', 18)}<span>Añadir nota</span></button>
    </div>
    ${
      notes.length
        ? `<div class="notes">${notes
            .map(
              (n) => `<button class="note ${n.pinned ? 'pinned' : ''}" data-action="note-open" data-id="${n.id}">
                <h3>${esc(n.title || 'Sin título')}</h3>
                <p>${esc(n.body)}</p>
                <footer><span>${esc(relDate(ymd(new Date(n.updatedAt))))}</span>${n.pinned ? `<span title="Fijada">${icon('pin', 14)}</span>` : ''}</footer>
              </button>`,
            )
            .join('')}</div>`
        : emptyState({ ico: 'sticky-note', text: 'Guarda aquí ideas, listas y apuntes de este espacio. Las fijadas quedan siempre arriba.', action: 'note-new', label: 'Añadir nota', attrs: `data-space="${space.id}"` })
    }`;
}

export function openNoteSheet({ id, spaceId } = {}) {
  const n = id ? find('notes', id) : null;
  if (!spacesWith('notes').length) return toast('Activa Notas en algún espacio para escribir una.');
  const v = n || { title: '', body: '', pinned: false, spaceId };
  openSheet({
    title: n ? 'Editar nota' : 'Nueva nota',
    submitLabel: n ? 'Guardar' : 'Añadir nota',
    body: `
      ${field({ label: 'Título', name: 'title', value: v.title, placeholder: 'Ej.: ideas para el lanzamiento', attrs: `${n ? '' : 'autofocus'} maxlength="120" autocomplete="off"` })}
      ${textarea({ label: 'Texto', name: 'body', value: v.body, placeholder: 'Escribe lo que quieras recordar', rows: 9 })}
      ${spaceSelect('notes', v.spaceId)}
      <label class="toggle"><input type="checkbox" name="pinned" ${v.pinned ? 'checked' : ''}>${icon('pin')}<span><b>Fijar arriba</b><small>Queda primera en la lista</small></span></label>`,
    onSubmit(d) {
      const title = d.title.trim();
      const body = d.body.trim();
      if (!title && !body) return { title: 'Escribe un título o algo de texto.' };
      const data = { title: title || body.split('\n')[0].slice(0, 60), body, pinned: !!d.pinned, spaceId: d.spaceId, updatedAt: Date.now() };
      if (n) patch('notes', n.id, data);
      else add('notes', data);
      toast(n ? 'Nota guardada' : 'Nota añadida');
    },
    onDelete: n ? () => removeWithUndo('Nota eliminada', () => remove('notes', n.id)) : null,
  });
}

on({
  'note-new': (el) => {
    closeSheet();
    openNoteSheet({ spaceId: el.dataset.space });
  },
  'note-open': (el) => openNoteSheet({ id: el.dataset.id }),
});
