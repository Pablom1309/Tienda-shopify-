import { icon } from '../icons.js';
import { barChart } from '../charts.js';
import { esc, monthShort, num, relDate, today } from '../util.js';
import { records, weeklyTraining, workoutSets, workoutVolume } from '../logic.js';
import { add, bySpace, find, patch, remove, spacesWith, state } from '../store.js';
import { closeSheet, emptyState, field, on, openSheet, removeWithUndo, spaceSelect, textarea, toast } from '../ui.js';

const summary = (w) => {
  const parts = [];
  if (w.exercises.length) parts.push(`${w.exercises.length} ${w.exercises.length === 1 ? 'ejercicio' : 'ejercicios'}`);
  const sets = workoutSets(w);
  if (sets) parts.push(`${sets} series`);
  if (w.duration) parts.push(`${w.duration} min`);
  const vol = workoutVolume(w);
  if (vol) parts.push(`${num(vol)} kg`);
  return parts;
};

export function renderTraining(space) {
  const all = bySpace('workouts', space.id).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const now = today();
  const head = `<div class="toolbar">
      <span></span>
      <button class="btn" data-action="workout-new" data-space="${space.id}">${icon('plus', 18)}<span>Registrar entrenamiento</span></button>
    </div>`;

  if (!all.length) {
    return head + emptyState({ ico: 'dumbbell', text: 'Registra cada sesión con sus ejercicios, series y peso. Verás tu volumen por semana y tus mejores marcas.', action: 'workout-new', label: 'Registrar entrenamiento', attrs: `data-space="${space.id}"` });
  }

  const weeks = weeklyTraining(all, now, 8);
  const cur = weeks.at(-1);
  const rec = records(all);
  const useVolume = weeks.some((w) => w.volume > 0);

  return `${head}
    <dl class="figures num">
      <div class="figure"><dt>Sesiones esta semana</dt><dd>${cur.sessions}</dd></div>
      <div class="figure"><dt>Tiempo</dt><dd>${cur.minutes} <small>min</small></dd></div>
      <div class="figure"><dt>Volumen</dt><dd>${num(cur.volume)} <small>kg</small></dd></div>
    </dl>
    <div class="split" data-color="${space.color}">
      <section class="section">
        <div class="section-head"><h2 class="h2">${useVolume ? 'Volumen por semana' : 'Sesiones por semana'}</h2><span class="aside">${useVolume ? 'kg levantados, últimas 8 semanas' : 'últimas 8 semanas'}</span></div>
        ${barChart(
          weeks.map((w) => ({
            label: `${Number(w.start.slice(8, 10))} ${monthShort(w.start)}`,
            value: useVolume ? w.volume : w.sessions,
            title: `Semana del ${Number(w.start.slice(8, 10))} ${monthShort(w.start)}: ${w.sessions} sesiones, ${num(w.volume)} kg`,
          })),
          useVolume ? 'Volumen levantado por semana' : 'Sesiones por semana',
        )}
      </section>
      <section class="section">
        <h2 class="h2">Mejores marcas</h2>
        ${
          rec.length
            ? `<ul class="list">${rec
                .slice(0, 6)
                .map((r) => `<li class="row"><div class="row-body"><span class="row-title">${esc(r.name)}</span><span class="row-meta"><span>${esc(relDate(r.date, now))}</span></span></div><span class="row-end amount num">${num(r.weight)} kg × ${r.reps}</span></li>`)
                .join('')}</ul>`
            : '<p class="muted">Aparecen cuando registras series con peso.</p>'
        }
      </section>
    </div>
    <section class="section">
      <h2 class="h2">Sesiones</h2>
      <ul class="list">${all
        .slice(0, 40)
        .map(
          (w) => `<li class="row">
            <button class="row-body" data-action="workout-open" data-id="${w.id}">
              <span class="row-title">${esc(w.name || 'Entrenamiento')}</span>
              <span class="row-meta"><span>${esc(relDate(w.date, now))}</span>${summary(w).map((p) => `<span class="num">${p}</span>`).join('')}</span>
            </button>
            <span class="row-end"><button class="btn soft sm" data-action="workout-repeat" data-id="${w.id}">${icon('repeat', 15)}<span>Repetir</span></button></span>
          </li>`,
        )
        .join('')}</ul>
    </section>`;
}

// ---------- Editor de sesión ----------

const setRow = (s = {}, i = 0) => `<div class="set">
    <span class="n num">${i + 1}</span>
    <input class="input num" data-f="reps" inputmode="numeric" placeholder="0" value="${esc(s.reps ?? '')}" aria-label="Repeticiones de la serie ${i + 1}">
    <input class="input num" data-f="weight" inputmode="decimal" placeholder="0" value="${esc(s.weight ?? '')}" aria-label="Peso en kilos de la serie ${i + 1}">
    <button type="button" class="icon-btn" data-ex="del-set" aria-label="Quitar serie">${icon('x', 18)}</button>
  </div>`;

const exBlock = (ex = { name: '', sets: [{}] }) => `<div class="ex">
    <div class="ex-head">
      <input class="input" data-f="name" list="ex-names" placeholder="Ejercicio, ej.: sentadilla" value="${esc(ex.name)}" aria-label="Nombre del ejercicio" autocomplete="off">
      <button type="button" class="icon-btn" data-ex="del-ex" aria-label="Quitar ejercicio">${icon('trash-2', 18)}</button>
    </div>
    <div class="set set-labels"><span></span><span>Repeticiones</span><span>Peso (kg)</span><span></span></div>
    <div class="sets">${(ex.sets.length ? ex.sets : [{}]).map(setRow).join('')}</div>
    <button type="button" class="btn soft sm" data-ex="add-set">${icon('plus', 15)}<span>Añadir serie</span></button>
  </div>`;

function readExercises(root) {
  return [...root.querySelectorAll('.ex')]
    .map((ex) => ({
      name: ex.querySelector('[data-f="name"]').value.trim(),
      sets: [...ex.querySelectorAll('.sets .set')]
        .map((s) => ({
          reps: Number(s.querySelector('[data-f="reps"]').value.replace(',', '.')) || 0,
          weight: Number(s.querySelector('[data-f="weight"]').value.replace(',', '.')) || 0,
        }))
        .filter((s) => s.reps > 0 || s.weight > 0),
    }))
    .filter((ex) => ex.name);
}

function renumber(sets) {
  [...sets.children].forEach((row, i) => (row.querySelector('.n').textContent = i + 1));
}

export function openWorkoutSheet({ id, spaceId, copyFrom } = {}) {
  const w = id ? find('workouts', id) : null;
  if (!spacesWith('training').length) return toast('Activa Entrenamiento en algún espacio para registrar sesiones.');
  const src = copyFrom ? find('workouts', copyFrom) : null;
  const v = w || (src ? { ...src, date: today(), notes: '' } : { name: '', date: today(), duration: '', notes: '', exercises: [], spaceId });
  const names = [...new Set(state.workouts.flatMap((x) => x.exercises.map((e) => e.name.trim())).filter(Boolean))];

  openSheet({
    title: w ? 'Editar entrenamiento' : 'Registrar entrenamiento',
    submitLabel: w ? 'Guardar' : 'Registrar',
    body: `
      ${field({ label: 'Nombre de la sesión', name: 'name', value: v.name, placeholder: 'Ej.: pierna, correr, yoga', attrs: `${w || src ? '' : 'autofocus'} maxlength="80" autocomplete="off"` })}
      <div class="form-row">
        ${field({ label: 'Fecha', name: 'date', type: 'date', value: v.date, attrs: 'required' })}
        ${field({ label: 'Duración (min)', name: 'duration', value: v.duration || '', placeholder: '60', attrs: 'inputmode="numeric" autocomplete="off"' })}
      </div>
      ${spaceSelect('training', v.spaceId)}
      <fieldset class="field"><legend>Ejercicios</legend>
        <div id="ex-list" class="form" style="gap:10px">${v.exercises.map(exBlock).join('')}</div>
        <button type="button" class="btn line" data-ex="add-ex">${icon('plus', 18)}<span>Añadir ejercicio</span></button>
        <datalist id="ex-names">${names.map((n) => `<option value="${esc(n)}">`).join('')}</datalist>
      </fieldset>
      ${textarea({ label: 'Notas', name: 'notes', value: v.notes, placeholder: 'Cómo te sentiste, qué ajustar', rows: 2 })}`,
    onOpen(d) {
      const list = d.querySelector('#ex-list');
      d.querySelector('.sheet-body').onclick = (e) => {
        const b = e.target.closest('[data-ex]');
        if (!b) return;
        const ex = b.closest('.ex');
        if (b.dataset.ex === 'add-ex') {
          list.insertAdjacentHTML('beforeend', exBlock());
          list.lastElementChild.querySelector('[data-f="name"]').focus();
        } else if (b.dataset.ex === 'del-ex') {
          ex.remove();
        } else if (b.dataset.ex === 'add-set') {
          const sets = ex.querySelector('.sets');
          const last = sets.lastElementChild;
          // La serie nueva parte con los valores de la anterior: es lo habitual al entrenar.
          const prev = last ? { reps: last.querySelector('[data-f="reps"]').value, weight: last.querySelector('[data-f="weight"]').value } : {};
          sets.insertAdjacentHTML('beforeend', setRow(prev, sets.children.length));
          sets.lastElementChild.querySelector('[data-f="reps"]').focus();
        } else if (b.dataset.ex === 'del-set') {
          const sets = b.closest('.sets');
          b.closest('.set').remove();
          renumber(sets);
        }
      };
    },
    onSubmit(d, form) {
      if (!d.date) return { date: 'Elige la fecha.' };
      const exercises = readExercises(form);
      const name = d.name.trim() || (exercises[0]?.name ?? '');
      if (!name) return { name: 'Ponle un nombre o añade al menos un ejercicio.' };
      const data = { name, date: d.date, duration: Math.round(Number(d.duration.replace(',', '.'))) || 0, notes: d.notes.trim(), exercises, spaceId: d.spaceId };
      if (w) patch('workouts', w.id, data);
      else add('workouts', data);
      toast(w ? 'Entrenamiento guardado' : 'Entrenamiento registrado');
    },
    onDelete: w ? () => removeWithUndo('Entrenamiento eliminado', () => remove('workouts', w.id)) : null,
  });
}

on({
  'workout-new': (el) => {
    closeSheet();
    openWorkoutSheet({ spaceId: el.dataset.space });
  },
  'workout-open': (el) => openWorkoutSheet({ id: el.dataset.id }),
  'workout-repeat': (el) => openWorkoutSheet({ copyFrom: el.dataset.id }),
});
