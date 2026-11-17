// Estado de la app. Todo vive en este dispositivo (localStorage), sin cuentas ni servidor.

import { today, uid } from './util.js';

const KEY = 'rumbo:v1';
const COLLECTIONS = ['spaces', 'tasks', 'habits', 'tx', 'workouts', 'notes', 'goals'];

export const MODULES = ['tasks', 'habits', 'finance', 'training', 'notes', 'goals'];
export const COLORS = ['magenta', 'marino', 'boya', 'faro', 'baliza', 'turquesa', 'violeta', 'pizarra'];
export const CURRENCIES = ['CLP', 'USD', 'EUR', 'MXN', 'COP', 'ARS', 'PEN'];

function guessCurrency() {
  const lang = (typeof navigator !== 'undefined' && navigator.language) || '';
  const region = lang.split('-')[1];
  return { CL: 'CLP', MX: 'MXN', CO: 'COP', AR: 'ARS', PE: 'PEN', ES: 'EUR', US: 'USD' }[region] || 'USD';
}

export function emptyState() {
  return {
    v: 1,
    profile: { name: '', currency: guessCurrency(), theme: 'system', onboarded: false, sample: false },
    spaces: [],
    tasks: [],
    habits: [],
    tx: [],
    workouts: [],
    notes: [],
    goals: [],
  };
}

// Deja cualquier dato leído (guardado o importado) en una forma segura de usar.
// Lanza un error si no parece una copia de Rumbo.
export function normalize(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.spaces)) {
    throw new Error('El archivo no es una copia de seguridad de Rumbo.');
  }
  const base = emptyState();
  const out = { ...base, profile: { ...base.profile, ...(data.profile || {}) } };
  for (const c of COLLECTIONS) out[c] = Array.isArray(data[c]) ? data[c].filter((x) => x && typeof x === 'object' && x.id) : [];

  const ids = new Set(out.spaces.map((s) => s.id));
  out.spaces = out.spaces.map((s) => ({
    ...s,
    name: String(s.name || 'Espacio'),
    color: COLORS.includes(s.color) ? s.color : 'marino',
    icon: String(s.icon || 'compass'),
    modules: Array.isArray(s.modules) ? s.modules.filter((m) => MODULES.includes(m)) : [...MODULES],
  }));
  for (const c of COLLECTIONS.slice(1)) out[c] = out[c].filter((x) => ids.has(x.spaceId));

  out.tasks = out.tasks.map((t) => ({ notes: '', priority: 0, due: null, time: null, doneAt: null, createdAt: 0, ...t, status: ['todo', 'doing', 'done'].includes(t.status) ? t.status : 'todo' }));
  out.habits = out.habits.map((h) => ({ startDate: today(), ...h, days: Array.isArray(h.days) && h.days.length ? h.days : [0, 1, 2, 3, 4, 5, 6], log: h.log && typeof h.log === 'object' ? h.log : {} }));
  out.tx = out.tx.map((t) => ({ category: '', note: '', ...t, type: t.type === 'in' ? 'in' : 'out', amount: Math.abs(Number(t.amount)) || 0 }));
  out.workouts = out.workouts.map((w) => ({ notes: '', duration: 0, ...w, exercises: Array.isArray(w.exercises) ? w.exercises.map((e) => ({ name: String(e.name || ''), sets: Array.isArray(e.sets) ? e.sets : [] })) : [] }));
  out.notes = out.notes.map((n) => ({ title: '', body: '', pinned: false, updatedAt: 0, ...n }));
  out.goals = out.goals.map((g) => ({ unit: '', due: null, ...g, target: Number(g.target) || 0, current: Number(g.current) || 0 }));
  return out;
}

// ---------- Persistencia ----------

let memory = null; // respaldo si el navegador bloquea localStorage
let storageOk = true;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? normalize(JSON.parse(raw)) : null;
  } catch {
    return memory;
  }
}

function write(s) {
  memory = s;
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    storageOk = true;
  } catch {
    storageOk = false;
  }
}

export const canPersist = () => storageOk;

export let state = read() || emptyState();

const listeners = new Set();
export const subscribe = (fn) => (listeners.add(fn), () => listeners.delete(fn));

let saveTimer = null;
let dirty = false;

function flush() {
  clearTimeout(saveTimer);
  if (!dirty) return;
  dirty = false;
  write(state);
}

function commit() {
  dirty = true;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 120);
  for (const fn of listeners) fn(state);
}

if (typeof window !== 'undefined') {
  // Guarda de inmediato si la pestaña se cierra antes de que venza el temporizador.
  // Solo si hay cambios sin guardar: así una pestaña vieja no pisa lo que guardó otra.
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => document.hidden && flush());
  // Si la app está abierta en dos pestañas, esta toma lo que guardó la otra.
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY || dirty) return;
    state = read() || emptyState();
    for (const fn of listeners) fn(state);
  });
}

// Cambia el estado: update((s) => { s.tasks.push(...) })
export function update(fn) {
  fn(state);
  commit();
}

export const snapshot = () => JSON.stringify(state);
export function restore(json) {
  state = normalize(JSON.parse(json));
  commit();
}

export function replaceState(next) {
  state = normalize(next);
  commit();
}

export function resetAll() {
  state = emptyState();
  commit();
}

export const exportJSON = () => JSON.stringify({ app: 'rumbo', exportedAt: new Date().toISOString(), ...state }, null, 2);

export function importJSON(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('No se pudo leer el archivo. Tiene que ser el .json que exporta Rumbo.');
  }
  const next = normalize(data);
  next.profile.onboarded = true;
  state = next;
  commit();
}

// ---------- Atajos de lectura y escritura ----------

export const getSpace = (id) => state.spaces.find((s) => s.id === id);
export const spacesWith = (mod) => state.spaces.filter((s) => s.modules.includes(mod));
export const bySpace = (collection, spaceId) => state[collection].filter((x) => x.spaceId === spaceId);
export const find = (collection, id) => state[collection].find((x) => x.id === id);

export function add(collection, item) {
  const full = { id: uid(), ...item };
  update((s) => s[collection].push(full));
  return full;
}

export function patch(collection, id, changes) {
  update((s) => {
    const item = s[collection].find((x) => x.id === id);
    if (item) Object.assign(item, changes);
  });
}

export function remove(collection, id) {
  update((s) => {
    s[collection] = s[collection].filter((x) => x.id !== id);
  });
}

export function removeSpace(id) {
  update((s) => {
    for (const c of COLLECTIONS.slice(1)) s[c] = s[c].filter((x) => x.spaceId !== id);
    s.spaces = s.spaces.filter((x) => x.id !== id);
  });
}

export function setTaskStatus(id, status) {
  patch('tasks', id, { status, doneAt: status === 'done' ? Date.now() : null });
}

export function toggleHabit(id, day) {
  update((s) => {
    const h = s.habits.find((x) => x.id === id);
    if (!h) return;
    if (h.log[day]) delete h.log[day];
    else h.log[day] = true;
  });
}
