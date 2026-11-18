// Captura rápida: entiende fecha, hora, prioridad, repetición y espacio escritos en la misma frase.
// "Llamar a Ana mañana 18:00 !alta #vida" → título "Llamar a Ana", mañana, 18:00, prioridad alta, espacio Vida.

import { addDays, addMonths, weekdayIndex, ym } from './util.js';

const fold = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const WEEKDAYS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WD = WEEKDAYS.join('|');
const MO = MONTHS.join('|');
const pad = (n) => String(n).padStart(2, '0');

function nextWeekday(today, index) {
  const diff = (index - weekdayIndex(today) + 7) % 7 || 7;
  return addDays(today, diff);
}

function validDate(y, m, d) {
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d ? `${y}-${pad(m)}-${pad(d)}` : null;
}

// Día y mes sin año: el próximo que venga.
function upcoming(today, m, d) {
  const y = Number(today.slice(0, 4));
  const thisYear = validDate(y, m, d);
  if (thisYear && thisYear >= today) return thisYear;
  return validDate(y + 1, m, d) || thisYear;
}

export function parseQuick(input, { today, spaces = [] }) {
  const original = String(input ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
  const out = { title: original, due: null, time: null, priority: 0, spaceId: null, repeat: null };
  if (!original) return out;

  // Dos textos alineados carácter a carácter: el original y uno sin tildes ni mayúsculas para buscar.
  let text = ` ${original} `;
  let low = '';
  for (const ch of text.split('')) low += (fold(ch) || ch)[0];

  // Busca un patrón y, si `use` lo acepta, lo quita de ambos textos.
  const take = (re, use) => {
    const m = re.exec(low);
    if (!m) return false;
    if (use(m) === false) return false;
    const start = m.index + 1; // conserva el espacio inicial
    const end = m.index + m[0].length;
    text = text.slice(0, start) + text.slice(end);
    low = low.slice(0, start) + low.slice(end);
    return true;
  };

  // Espacio: #nombre (basta con el comienzo de cualquier palabra del nombre).
  take(/ #([a-z0-9_-]+)(?= )/, (m) => {
    const hit = spaces.find((s) => fold(s.name).split(/\s+/).some((w) => w.startsWith(m[1]))) || spaces.find((s) => fold(s.name).replace(/\s+/g, '').includes(m[1]));
    if (!hit) return false;
    out.spaceId = hit.id;
  });

  // Prioridad.
  if (!take(/ (!!|!alta|!urgente)(?= )/, () => void (out.priority = 2))) take(/ (!media|!)(?= )/, () => void (out.priority = 1));

  // Repetición.
  take(/ (de lunes a viernes|cada dia habil|dias habiles)(?= )/, () => void (out.repeat = 'weekdays')) ||
    take(/ (todos los dias|cada dia|a diario|diario|diariamente)(?= )/, () => void (out.repeat = 'daily')) ||
    take(new RegExp(` (?:cada|todos los) (${WD})(?= )`), (m) => {
      out.repeat = 'weekly';
      const idx = WEEKDAYS.indexOf(m[1]);
      out.due = weekdayIndex(today) === idx ? today : nextWeekday(today, idx);
    }) ||
    take(/ (cada semana|todas las semanas|semanal|semanalmente)(?= )/, () => void (out.repeat = 'weekly')) ||
    take(/ (cada mes|todos los meses|mensual|mensualmente)(?= )/, () => void (out.repeat = 'monthly'));

  // Hora: 18:30, 18h, 18h30, 6pm, a las 6, a las 6:30 pm.
  const setTime = (h, min, ampm, bare) => {
    let hour = Number(h);
    const minute = Number(min || 0);
    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;
    // "a las 3" sin más casi siempre es de la tarde.
    if (!ampm && bare && hour >= 1 && hour <= 6) hour += 12;
    if (hour > 23 || minute > 59) return false;
    out.time = `${pad(hour)}:${pad(minute)}`;
  };
  take(/ (?:a las? )?(\d{1,2}):(\d{2}) ?(am|pm)?(?= )/, (m) => setTime(m[1], m[2], m[3], false)) ||
    take(/ (?:a las? )?(\d{1,2}) ?h(?:rs|s)?(\d{2})?(?= )/, (m) => setTime(m[1], m[2], null, false)) ||
    take(/ (?:a las? )?(\d{1,2}) ?(am|pm)(?= )/, (m) => setTime(m[1], 0, m[2], false)) ||
    take(/ a las? (\d{1,2})(?= )/, (m) => setTime(m[1], 0, null, true));

  // Fecha (si "cada lunes" ya la fijó, no se busca otra).
  if (!out.due) {
    take(/ (?:para |el )?pasado manana(?= )/, () => void (out.due = addDays(today, 2))) ||
      take(/ (?:para )?hoy(?= )/, () => void (out.due = today)) ||
      // "por la mañana" es un momento del día, no una fecha.
      take(/ (la |esta |de |en la )?(?:para )?manana(?= )/, (m) => (m[1] ? false : void (out.due = addDays(today, 1)))) ||
      take(/ (?:para )?(?:la )?(?:proxima semana|semana que viene)(?= )/, () => void (out.due = nextWeekday(today, 0))) ||
      take(/ (?:para )?(?:el )?(?:proximo mes|mes que viene)(?= )/, () => void (out.due = `${addMonths(ym(today), 1)}-01`)) ||
      take(/ en (\d{1,3}) (dias?|semanas?|mes(?:es)?)(?= )/, (m) => {
        const n = Number(m[1]);
        if (m[2].startsWith('dia')) out.due = addDays(today, n);
        else if (m[2].startsWith('semana')) out.due = addDays(today, n * 7);
        else {
          const target = addMonths(ym(today), n);
          const day = Number(today.slice(8, 10));
          out.due = validDate(Number(target.slice(0, 4)), Number(target.slice(5, 7)), day) || `${target}-28`;
        }
      }) ||
      take(new RegExp(` (?:para )?(?:el |este |esta )?(?:proximo )?(${WD})(?: que viene)?(?= )`), (m) => void (out.due = nextWeekday(today, WEEKDAYS.indexOf(m[1])))) ||
      take(new RegExp(` (?:para )?(?:el )?(\\d{1,2}) de (${MO})(?: (?:de |del )?(\\d{4}))?(?= )`), (m) => {
        const month = MONTHS.indexOf(m[2]) + 1;
        const date = m[3] ? validDate(Number(m[3]), month, Number(m[1])) : upcoming(today, month, Number(m[1]));
        if (!date) return false;
        out.due = date;
      }) ||
      take(/ (?:para )?(?:el )?(\d{1,2})[/-](\d{1,2})(?:[/-](\d{2,4}))?(?= )/, (m) => {
        let date;
        if (m[3]) date = validDate(Number(m[3].length === 2 ? `20${m[3]}` : m[3]), Number(m[2]), Number(m[1]));
        else date = upcoming(today, Number(m[2]), Number(m[1]));
        if (!date) return false;
        out.due = date;
      });
  }

  if ((out.time || out.repeat) && !out.due) out.due = today;

  const title = text
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/( (para|el|la|a las?|a|de|en))+$/i, '')
    .replace(/[\s,;:-]+$/, '')
    .trim();

  // Si al quitar todo no queda título, lo escrito era el título.
  if (!title) return { title: original, due: null, time: null, priority: 0, spaceId: null, repeat: null };
  out.title = title.charAt(0).toUpperCase() + title.slice(1);
  return out;
}
