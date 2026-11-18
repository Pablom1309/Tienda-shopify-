// Plantillas de espacios y datos de ejemplo.

import { addDays, addMonths, startOfWeek, today, uid, weekdayIndex, ym } from './util.js';
import { emptyState } from './store.js';

export const MODULE_INFO = {
  tasks: { label: 'Tareas', icon: 'list-checks', hint: 'Pendientes con fecha y prioridad' },
  habits: { label: 'Hábitos', icon: 'flame', hint: 'Rutinas diarias y rachas' },
  finance: { label: 'Finanzas', icon: 'wallet', hint: 'Ingresos, gastos y balance' },
  training: { label: 'Entrenamiento', icon: 'dumbbell', hint: 'Sesiones, series y récords' },
  notes: { label: 'Notas', icon: 'sticky-note', hint: 'Ideas y apuntes' },
  goals: { label: 'Metas', icon: 'target', hint: 'Objetivos medibles con fecha' },
};

export const TEMPLATES = [
  { key: 'empresa', name: 'Empresa', icon: 'briefcase', color: 'marino', modules: ['tasks', 'finance', 'goals', 'notes'], hint: 'Pendientes, caja y objetivos del negocio' },
  { key: 'vida', name: 'Vida personal', icon: 'heart', color: 'magenta', modules: ['tasks', 'habits', 'finance', 'notes', 'goals'], hint: 'Casa, hábitos y gastos del mes' },
  { key: 'entreno', name: 'Entrenamiento', icon: 'dumbbell', color: 'baliza', modules: ['training', 'habits', 'goals'], hint: 'Sesiones, marcas y constancia' },
  { key: 'estudios', name: 'Estudios', icon: 'graduation-cap', color: 'violeta', modules: ['tasks', 'habits', 'notes', 'goals'], hint: 'Entregas, apuntes y rutina de estudio' },
  { key: 'proyecto', name: 'Proyecto', icon: 'rocket', color: 'turquesa', modules: ['tasks', 'notes', 'goals'], hint: 'Un trabajo con principio y fin' },
];

export const SPACE_ICONS = ['briefcase', 'heart', 'dumbbell', 'graduation-cap', 'rocket', 'house', 'shopping-bag', 'users', 'wallet', 'book-open', 'leaf', 'star', 'plane', 'palette', 'music', 'camera', 'code', 'utensils', 'trophy', 'compass'];

export function spaceFromTemplate(key) {
  const t = TEMPLATES.find((x) => x.key === key);
  return { id: uid(), name: t.name, icon: t.icon, color: t.color, modules: [...t.modules], createdAt: Date.now() };
}

// ---------- Datos de ejemplo ----------
// Se generan relativos a hoy para que la app siempre abra "viva".

export function sampleState(currency) {
  const s = emptyState();
  const now = today();
  const mon = startOfWeek(now);
  const at = (day, hour = 10) => {
    const [y, m, d] = day.split('-').map(Number);
    return new Date(y, m - 1, d, hour).getTime();
  };
  // Montos en una escala razonable para la moneda elegida.
  const scale = { CLP: 1000, COP: 4000, ARS: 1000, MXN: 20, PEN: 4, USD: 1, EUR: 1 }[currency] ?? 1;
  const $ = (n) => Math.round(n * scale);

  s.profile = { ...s.profile, name: '', currency: currency || s.profile.currency, onboarded: true, sample: true };

  const tienda = { id: uid(), name: 'Tienda online', icon: 'shopping-bag', color: 'marino', modules: ['tasks', 'finance', 'goals', 'notes'], createdAt: 1 };
  const vida = { id: uid(), name: 'Vida personal', icon: 'heart', color: 'magenta', modules: ['tasks', 'habits', 'finance', 'notes', 'goals'], createdAt: 2 };
  const entreno = { id: uid(), name: 'Entrenamiento', icon: 'dumbbell', color: 'baliza', modules: ['training', 'habits', 'goals'], createdAt: 3 };
  const estudio = { id: uid(), name: 'Curso de inglés', icon: 'graduation-cap', color: 'violeta', modules: ['tasks', 'habits', 'notes', 'goals'], createdAt: 4 };
  s.spaces = [tienda, vida, entreno, estudio];

  const task = (space, title, due, extra = {}) => {
    const t = { id: uid(), spaceId: space.id, title, notes: '', status: 'todo', priority: 0, due, time: null, repeat: null, subtasks: [], doneAt: null, createdAt: Date.now() - s.tasks.length * 1000, ...extra };
    if (t.status === 'done') t.doneAt = at(t.due && t.due <= now ? t.due : now, 18);
    s.tasks.push(t);
  };

  task(tienda, 'Revisar pedidos pendientes de despacho', now, { priority: 2, time: '09:30', repeat: 'weekdays' });
  task(tienda, 'Responder novedades de envío', now, { status: 'doing' });
  task(tienda, 'Subir 3 creativos nuevos a la campaña', addDays(now, 1), {
    priority: 1,
    subtasks: [
      { id: uid(), title: 'Grabar el video de antes y después', done: true },
      { id: uid(), title: 'Escribir los textos', done: false },
      { id: uid(), title: 'Configurar el público de 25 a 34', done: false },
    ],
  });
  task(tienda, 'Negociar precio con el proveedor', addDays(now, 3));
  task(tienda, 'Actualizar fotos del producto estrella', addDays(now, -2), { priority: 1 });
  task(tienda, 'Cerrar caja de la semana pasada', mon, { status: 'done' });
  task(tienda, 'Configurar el correo de carrito abandonado', addDays(mon, 1) <= now ? addDays(mon, 1) : mon, { status: 'done' });
  task(tienda, 'Probar una segunda pasarela de pago', null);

  task(vida, 'Pagar la cuenta de la luz', now, { priority: 1, repeat: 'monthly' });
  task(vida, 'Llamar al dentista para pedir hora', addDays(now, 2));
  task(vida, 'Comprar regalo de cumpleaños de Sofi', addDays(now, 5), {
    priority: 1,
    subtasks: [
      { id: uid(), title: 'Preguntarle a su hermana qué le falta', done: false },
      { id: uid(), title: 'Comprar y envolver', done: false },
    ],
  });
  task(vida, 'Renovar el seguro del auto', addDays(now, 12));
  task(vida, 'Ordenar el escritorio', mon, { status: 'done' });

  task(estudio, 'Entregar ensayo de la unidad 4', addDays(now, 1), { priority: 2 });
  task(estudio, 'Repasar verbos irregulares', now);
  task(estudio, 'Agendar clase de conversación', addDays(now, 4));
  task(estudio, 'Terminar la unidad 3', addDays(mon, -3), { status: 'done' });

  // Hábitos: se marcan los últimos días con algún hueco para que las rachas sean creíbles.
  const habit = (space, name, days, misses, backDays = 40, extra = {}) => {
    const log = {};
    for (let i = 1; i <= backDays; i++) {
      const day = addDays(now, -i);
      if (days.includes(weekdayIndex(day)) && !misses.includes(i)) log[day] = true;
    }
    s.habits.push({ id: uid(), spaceId: space.id, name, days, log, target: 1, unit: '', startDate: addDays(now, -backDays), createdAt: Date.now(), ...extra });
  };
  const all = [0, 1, 2, 3, 4, 5, 6];
  habit(vida, 'Leer 20 minutos', all, [6, 13, 14, 27]);
  habit(vida, 'Dormir antes de las 23:30', [0, 1, 2, 3, 6], [2, 9, 10, 20]);
  habit(vida, 'Tomar agua', all, [4, 5, 18, 19, 30], 40, { target: 8, unit: 'vasos' });
  habit(entreno, 'Estirar 10 minutos', all, [3, 11, 12, 25, 26]);
  habit(entreno, 'Caminar 8.000 pasos', all, [8, 15, 16, 22, 29]);
  habit(estudio, 'Practicar 15 minutos en la app', all, [5, 17]);
  s.habits[0].log[now] = true;
  s.habits[2].log[now] = 5; // agua: 5 de 8 vasos
  s.habits[5].log[now] = true;

  // Finanzas: tres meses de movimientos.
  const tx = (space, type, amount, category, note, date, fixedDay = null) =>
    s.tx.push({ id: uid(), spaceId: space.id, type, amount: $(amount), category, note, date, repeat: fixedDay ? 'monthly' : null, repeatDay: fixedDay });
  const month = ym(now);
  const dayOfMonth = Number(now.slice(8, 10));
  for (let back = 0; back < 6; back++) {
    const m = addMonths(month, -back);
    const d = (n) => `${m}-${String(back === 0 ? Math.min(n, dayOfMonth) : n).padStart(2, '0')}`;
    const f = 1 - back * 0.09; // el negocio va creciendo mes a mes
    tx(tienda, 'in', 820 * f, 'Ventas', 'Pedidos primera quincena', d(8));
    tx(tienda, 'in', 960 * f, 'Ventas', 'Pedidos segunda quincena', d(22));
    tx(tienda, 'out', 310 * f, 'Publicidad', 'Campañas en redes', d(5));
    tx(tienda, 'out', 240 * f, 'Publicidad', 'Pruebas de creativos', d(19));
    tx(tienda, 'out', 520 * f, 'Proveedor', 'Costo de productos', d(12));
    tx(tienda, 'out', 140 * f, 'Envíos', 'Fletes y devoluciones', d(15));
    // Los fijos del mes en curso quedan marcados "cada mes": así se anotan solos el próximo.
    tx(tienda, 'out', 39, 'Herramientas', 'Plan de la tienda y apps', d(1), back === 0 ? 1 : null);

    tx(vida, 'in', 1500, 'Sueldo', '', d(1), back === 0 ? 1 : null);
    tx(vida, 'out', 480, 'Arriendo', '', d(3), back === 0 ? 3 : null);
    tx(vida, 'out', 260 + back * 12, 'Supermercado', '', d(6));
    tx(vida, 'out', 95, 'Cuentas', 'Luz, agua, internet', d(10));
    tx(vida, 'out', 70 + back * 9, 'Salidas', '', d(14));
    tx(vida, 'out', 45, 'Transporte', '', d(17));
  }

  // Entrenamiento: tres sesiones por semana con progresión.
  const plan = [
    { name: 'Pierna', day: 0, minutes: 65, ex: [['Sentadilla', 5, 5, 80], ['Peso muerto rumano', 4, 8, 70], ['Prensa', 3, 12, 140]] },
    { name: 'Empuje', day: 2, minutes: 55, ex: [['Press de banca', 5, 5, 60], ['Press militar', 4, 6, 40], ['Fondos', 3, 10, 0]] },
    { name: 'Tirón', day: 4, minutes: 60, ex: [['Peso muerto', 3, 5, 100], ['Dominadas', 4, 8, 0], ['Remo con barra', 4, 8, 55]] },
  ];
  for (let w = 7; w >= 0; w--) {
    for (const p of plan) {
      const date = addDays(mon, -w * 7 + p.day);
      if (date > now) continue;
      if ((w === 5 && p.day === 4) || (w === 2 && p.day === 2)) continue; // un par de faltas
      const bump = (7 - w) * 2.5;
      s.workouts.push({
        id: uid(),
        spaceId: entreno.id,
        name: p.name,
        date,
        duration: p.minutes + ((w * 7) % 9) - 4,
        notes: '',
        exercises: p.ex.map(([name, sets, reps, weight]) => ({
          name,
          sets: Array.from({ length: sets }, () => ({ reps, weight: weight ? weight + bump : 0 })),
        })),
      });
    }
  }

  const note = (space, title, body, pinned = false, ago = 1) => s.notes.push({ id: uid(), spaceId: space.id, title, body, pinned, updatedAt: at(addDays(now, -ago), 16) });
  note(tienda, 'Ideas de producto', 'Probar el organizador de cables en pack de 3.\nVer márgenes del masajeador con el proveedor nuevo.\nPedir muestras antes de escalar la campaña.', true, 1);
  note(tienda, 'Lo que funcionó en la campaña', 'El video corto con el antes y después rindió mejor que las fotos.\nEl público de 25 a 34 trae el pedido más alto.', false, 4);
  note(vida, 'Lista para el viaje', 'Pasaporte, cargador, adaptador, botiquín.\nReservar el traslado del aeropuerto.', true, 2);
  note(vida, 'Libros pendientes', 'Hábitos atómicos\nEl infinito en un junco\nSapiens', false, 9);
  note(estudio, 'Frases para la clase', 'I have been working on…\nIt depends on whether…\nAs far as I know…', false, 3);

  // Cada meta parte hace unas semanas, con algunos avances anotados por el camino.
  const goal = (space, name, unit, target, current, due, startedAgo = 45) => {
    const startDate = addDays(now, -startedAgo);
    const history = [0.15, 0.4, 0.62, 0.8, 1].map((f, i) => ({ date: addDays(startDate, Math.round((startedAgo * (i + 1)) / 5)), value: Math.round(current * f * 10) / 10 }));
    history.at(-1).date = now;
    s.goals.push({ id: uid(), spaceId: space.id, name, unit, target, current, due, startDate, history, createdAt: Date.now() });
  };
  goal(tienda, 'Ventas del mes', currency || 'USD', $(2500), $(1780), `${month}-28`);
  goal(tienda, 'Reseñas de clientes', 'reseñas', 50, 31, addDays(now, 40));
  goal(vida, 'Fondo de emergencia', currency || 'USD', $(3000), $(1150), addDays(now, 150));
  goal(vida, 'Libros leídos este año', 'libros', 12, 9, `${now.slice(0, 4)}-12-31`);
  goal(entreno, 'Sentadilla de 100 kg', 'kg', 100, 97.5, addDays(now, 30));
  goal(entreno, 'Correr 10 km sin parar', 'km', 10, 6.5, addDays(now, 60));
  goal(estudio, 'Unidades del curso', 'unidades', 12, 4, addDays(now, 90));

  const budget = (space, category, amount) => s.budgets.push({ id: uid(), spaceId: space.id, category, amount: $(amount) });
  budget(tienda, 'Publicidad', 600);
  budget(tienda, 'Envíos', 120);
  budget(vida, 'Supermercado', 300);
  budget(vida, 'Salidas', 80);

  return s;
}
