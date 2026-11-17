// Utilidades puras: fechas, formato y escape. Sin DOM, para poder probarlas con Node.

export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

// --- Fechas. Todo se guarda como 'YYYY-MM-DD' en hora local. ---

const pad = (n) => String(n).padStart(2, '0');

export const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const today = () => ymd(new Date());

export function parseYmd(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s, n) {
  const d = parseYmd(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
}

export const diffDays = (a, b) => Math.round((parseYmd(a) - parseYmd(b)) / 86400000);

// Índice de día con lunes = 0 … domingo = 6.
export const weekdayIndex = (s) => (parseYmd(s).getDay() + 6) % 7;

export const startOfWeek = (s) => addDays(s, -weekdayIndex(s));

export function weekDays(s) {
  const start = startOfWeek(s);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export const ym = (s) => s.slice(0, 7);

export function addMonths(ymStr, n) {
  const [y, m] = ymStr.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

// Matriz de semanas (lunes a domingo) que cubre el mes completo.
export function monthGrid(ymStr) {
  const first = `${ymStr}-01`;
  let cursor = startOfWeek(first);
  const weeks = [];
  do {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(week);
  } while (ym(cursor) === ymStr);
  return weeks;
}

export const WEEKDAYS_SHORT = ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'];
export const WEEKDAYS_LETTER = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const WEEKDAYS_LONG = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

export const monthName = (ymStr) => `${MONTHS[Number(ymStr.slice(5, 7)) - 1]} ${ymStr.slice(0, 4)}`;
export const monthShort = (ymStr) => MONTHS_SHORT[Number(ymStr.slice(5, 7)) - 1];
export const weekdayLong = (s) => WEEKDAYS_LONG[weekdayIndex(s)];

// "17 de noviembre"
export const dayAndMonth = (s) => `${Number(s.slice(8, 10))} de ${MONTHS[Number(s.slice(5, 7)) - 1]}`;

// Fecha corta relativa a hoy: "Hoy", "Mañana", "Ayer", "vie 20 nov", "20 nov 2027".
export function relDate(s, ref = today()) {
  const diff = diffDays(s, ref);
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff === -1) return 'Ayer';
  const base = `${Number(s.slice(8, 10))} ${MONTHS_SHORT[Number(s.slice(5, 7)) - 1]}`;
  if (s.slice(0, 4) !== ref.slice(0, 4)) return `${base} ${s.slice(0, 4)}`;
  return `${WEEKDAYS_SHORT[weekdayIndex(s)]} ${base}`;
}

// --- Números ---

const ZERO_DECIMAL = new Set(['CLP', 'COP', 'ARS', 'PYG', 'JPY']);
// Cada moneda se escribe como en su país: $1.780 en Chile, $1,780.00 en México, 1.780,00 € en España.
const MONEY_LOCALE = { CLP: 'es-CL', MXN: 'es-MX', COP: 'es-CO', ARS: 'es-AR', PEN: 'es-PE', EUR: 'es-ES', USD: 'es-US' };

export function money(n, currency = 'USD') {
  const digits = ZERO_DECIMAL.has(currency) ? 0 : 2;
  try {
    return new Intl.NumberFormat(MONEY_LOCALE[currency] || 'es', {
      style: 'currency',
      currency,
      currencyDisplay: 'narrowSymbol',
      useGrouping: 'always',
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(n);
  } catch {
    return `${currency} ${Number(n).toFixed(digits)}`;
  }
}

export const num = (n) => new Intl.NumberFormat('es', { maximumFractionDigits: 1, useGrouping: 'always' }).format(n);

// Lee montos como los escribe la gente: "12.500", "12,5", "1.234,56" o "1,234.56".
// Con punto y coma juntos, el último es el decimal. Con uno solo, tres dígitos detrás
// (o varios separadores) significan miles; cualquier otra cosa es decimal.
export function parseAmount(text) {
  let t = String(text ?? '').trim().replace(/[^\d.,-]/g, '');
  if (!t) return NaN;
  const lastDot = t.lastIndexOf('.');
  const lastComma = t.lastIndexOf(',');
  if (lastDot !== -1 && lastComma !== -1) {
    const dec = lastDot > lastComma ? '.' : ',';
    const thou = dec === '.' ? ',' : '.';
    t = t.split(thou).join('').replace(dec, '.');
  } else if (lastDot !== -1 || lastComma !== -1) {
    const sep = lastDot !== -1 ? '.' : ',';
    const parts = t.split(sep);
    const thousands = parts.length > 2 || (parts[1].length === 3 && parts[0].replace('-', '').length > 0);
    t = thousands ? parts.join('') : parts.join('.');
  }
  return Number(t);
}

export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function greeting(hour = new Date().getHours()) {
  if (hour < 6) return 'Buenas noches';
  if (hour < 13) return 'Buenos días';
  if (hour < 20) return 'Buenas tardes';
  return 'Buenas noches';
}
