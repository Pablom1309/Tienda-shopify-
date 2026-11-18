import { icon } from '../icons.js';
import { barChart, lineChart } from '../charts.js';
import { esc, monthShort, num, relDate, today } from '../util.js';
import { exerciseHistory, records, routines, weeklyTraining, workoutSets, workoutVolume } from '../logic.js';
import { add, bySpace, find, getSpace, patch, remove, spacesWith, state } from '../store.js';
import { closeSheet, emptyState, field, on, openSheet, spaceSelect, textarea, toast, withUndo } from '../ui.js';

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

const shortDay = (d) => `${Number(d.slice(8, 10))} ${monthShort(d)}`;

export function renderTraining(space) {
  const all = bySpace('workouts', space.id).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const now = today();
  const head = `<div class="toolbar">
      <span></span>
      <button class="btn" data-action="workout-new" data-space="${space.id}">${icon('plus', 18)}<span>Registrar entrenamiento</span></button>
    </div>`;

  if (!all.length) {
    return head + emptyState({ ico: 'dumbbell', text: 'Registra cada sesión con sus ejercicios, series y peso. Verás tu volumen por semana, tus mejores marcas y cómo progresa cada ejercicio.', action: 'workout-new', label: 'Registrar entrenamiento', attrs: `data-space="${space.id}"` });
  }

  const weeks = weeklyTraining(all, now, 8);
  const cur = weeks.at(-1);
  const rec = records(all);
  const useVolume = weeks.some((w) => w.volume > 0);
  const saved = routines(all).slice(0, 6);

  return `${head}
    ${
      saved.length
        ? `<section class="section">
            <div class="section-head"><h2 class="h2">Empezar una sesión</h2><span class="aside">Parte de la última vez, con sus ejercicios y pesos</span></div>
            <div class="routine-row" data-color="${space.color}">${saved
              .map((w) => `<button class="routine" data-action="workout-repeat" data-id="${w.id}"><b>${esc(w.name)}</b><small>${w.exercises.length} ${w.exercises.length === 1 ? 'ejercicio' : 'ejercicios'}, ${esc(relDate(w.date, now).toLowerCase())}</small></button>`)
              .join('')}</div>
          </section>`
        : ''
    }
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
            label: shortDay(w.start),
            value: useVolume ? w.volume : w.sessions,
            title: `Semana del ${shortDay(w.start)}: ${w.sessions} sesiones, ${num(w.volume)} kg`,
          })),
          useVolume ? 'Volumen levantado por semana' : 'Sesiones por semana',
        )}
      </section>
      <section class="section">
        <div class="section-head"><h2 class="h2">Mejores marcas</h2><span class="aside">Toca una para ver su progreso</span></div>
        ${
          rec.length
            ? `<ul class="list">${rec
                .slice(0, 6)
                .map((r) => `<li class="row"><button class="row-body" data-action="exercise-open" data-space="${space.id}" data-name="${esc(r.name)}"><span class="row-title">${esc(r.name)}</span><span class="row-meta"><span>${esc(relDate(r.date, now))}</span></span></button><span class="row-end amount num">${num(r.weight)} kg × ${r.reps}</span></li>`)
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

// ---------- Progreso de un ejercicio ----------

function openExerciseSheet(spaceId, name) {
  const space = getSpace(spaceId);
  const hist = exerciseHistory(bySpace('workouts', spaceId), name);
  if (!hist.length) return;
  const first = hist[0];
  const last = hist.at(-1);
  const gain = last.top - first.top;
  openSheet({
    title: name,
    wide: true,
    body: `<div data-color="${space?.color || 'marino'}" class="form">
      <dl class="figures small-figures num">
        <div class="figure"><dt>Última vez</dt><dd>${num(last.top)} <small>kg</small></dd></div>
        <div class="figure"><dt>Desde que empezaste</dt><dd class="${gain > 0 ? 'pos' : ''}">${gain > 0 ? '+' : ''}${num(gain)} <small>kg</small></dd></div>
        <div class="figure"><dt>Sesiones</dt><dd>${hist.length}</dd></div>
      </dl>
      ${lineChart(hist.slice(-16).map((h) => ({ label: shortDay(h.date), value: h.top, title: `${shortDay(h.date)}: ${num(h.top)} kg` })), `Peso máximo por sesión de ${name}`)}
      <p class="hint">El peso más alto de cada sesión.</p>
      <ul class="list">${[...hist]
        .reverse()
        .slice(0, 12)
        .map((h) => `<li class="row"><div class="row-body"><span class="row-title">${esc(relDate(h.date))}</span><span class="row-meta num"><span>${h.sets.map((s) => `${s.reps} × ${num(Number(s.weight) || 0)} kg`).join(', ')}</span></span></div></li>`)
        .join('')}</ul>
    </div>`,
  });
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

// Temporizador de descanso entre series. Vive mientras la hoja está abierta.
let restTimer = null;

function stopRest() {
  clearInterval(restTimer);
  restTimer = null;
}

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
    navigator.vibrate?.([120, 80, 120]);
  } catch {
    /* sin sonido */
  }
}

function startRest(box, seconds) {
  stopRest();
  const end = Date.now() + seconds * 1000;
  const paint = () => {
    const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    box.innerHTML = left
      ? `<span class="rest-clock num" role="timer">${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}</span><span class="muted">de descanso</span><button type="button" class="btn soft sm" data-rest="0">Parar</button>`
      : `<span class="rest-clock done">Listo</span><span class="muted">A la siguiente serie</span>`;
    if (!left) {
      stopRest();
      beep();
    }
  };
  paint();
  restTimer = setInterval(paint, 250);
}

const restButtons = () => `<span class="muted">Descanso</span>${[60, 90, 120, 180].map((s) => `<button type="button" class="btn soft sm num" data-rest="${s}">${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}</button>`).join('')}`;

export function openWorkoutSheet({ id, spaceId, copyFrom } = {}) {
  const w = id ? find('workouts', id) : null;
  if (!spacesWith('training').length) return toast('Activa Entrenamiento en algún espacio para registrar sesiones.');
  const src = copyFrom ? find('workouts', copyFrom) : null;
  const v = w || (src ? { ...src, date: today(), notes: '' } : { name: '', date: today(), duration: '', notes: '', exercises: [], spaceId });
  const names = [...new Set(state.workouts.flatMap((x) => x.exercises.map((e) => e.name.trim())).filter(Boolean))];

  openSheet({
    title: w ? 'Editar entrenamiento' : src ? `Sesión de ${src.name}` : 'Registrar entrenamiento',
    submitLabel: w ? 'Guardar' : 'Registrar',
    wide: true,
    body: `
      ${field({ label: 'Nombre de la sesión', name: 'name', value: v.name, placeholder: 'Ej.: pierna, correr, yoga', attrs: `${w || src ? '' : 'autofocus'} maxlength="80" autocomplete="off"` })}
      <div class="form-row">
        ${field({ label: 'Fecha', name: 'date', type: 'date', value: v.date, attrs: 'required' })}
        ${field({ label: 'Duración (min)', name: 'duration', value: v.duration || '', placeholder: '60', attrs: 'inputmode="numeric" autocomplete="off"' })}
      </div>
      ${spaceSelect('training', v.spaceId)}
      <fieldset class="field"><legend>Ejercicios</legend>
        <div class="rest" id="rest">${restButtons()}</div>
        <div id="ex-list" class="form" style="gap:10px">${v.exercises.map(exBlock).join('')}</div>
        <button type="button" class="btn line" data-ex="add-ex">${icon('plus', 18)}<span>Añadir ejercicio</span></button>
        <datalist id="ex-names">${names.map((n) => `<option value="${esc(n)}">`).join('')}</datalist>
      </fieldset>
      ${textarea({ label: 'Notas', name: 'notes', value: v.notes, placeholder: 'Cómo te sentiste, qué ajustar', rows: 2 })}`,
    onOpen(d) {
      const list = d.querySelector('#ex-list');
      const rest = d.querySelector('#rest');
      d.querySelector('.sheet-body').onclick = (e) => {
        const r = e.target.closest('[data-rest]');
        if (r) {
          const seconds = Number(r.dataset.rest);
          if (seconds) startRest(rest, seconds);
          else {
            stopRest();
            rest.innerHTML = restButtons();
          }
          return;
        }
        if (e.target.closest('.rest-clock.done')) return void (rest.innerHTML = restButtons());
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
    onClose: stopRest,
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
    onDelete: w ? () => withUndo('Entrenamiento eliminado', () => remove('workouts', w.id)) : null,
  });
}

on({
  'workout-new': (el) => {
    closeSheet();
    openWorkoutSheet({ spaceId: el.dataset.space });
  },
  'workout-open': (el) => openWorkoutSheet({ id: el.dataset.id }),
  'workout-repeat': (el) => openWorkoutSheet({ copyFrom: el.dataset.id }),
  'exercise-open': (el) => openExerciseSheet(el.dataset.space, el.dataset.name),
});
