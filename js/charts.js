// Gráficos en SVG: la rosa de la semana y barras simples.

import { esc, monthShort, num } from './util.js';

const polar = (cx, cy, r, deg) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
};
const pt = (p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

// Rosa de los vientos: cada espacio es un rumbo y el largo de su punta es el avance de la semana.
export function rose(overview, { animate = false } = {}) {
  const C = 160;
  const HUB = 34;
  const R = 124;
  const items = overview.spaces;
  const n = Math.max(items.length, 1);
  const half = Math.min(24, 150 / n);
  const radius = (pct) => HUB + (R - HUB) * pct;

  let ticks = '';
  for (let d = 0; d < 360; d += 10) {
    const major = d % 90 === 0;
    const mid = d % 30 === 0;
    ticks += `<line class="tick ${major ? 'major' : ''}" x1="${pt(polar(C, C, R + 5, d)).replace(',', '" y1="')}" x2="${pt(polar(C, C, R + (major ? 15 : mid ? 11 : 8), d)).replace(',', '" y2="')}"/>`;
  }

  const rings = [0.25, 0.5, 0.75].map((p) => `<circle class="ring faint" cx="${C}" cy="${C}" r="${radius(p).toFixed(1)}"/>`).join('');

  const petals = items
    .map((it, i) => {
      const deg = (360 / n) * i;
      const end = polar(C, C, R, deg);
      let shape = '';
      if (it.pct !== null) {
        const r = radius(Math.max(it.pct, 0.04));
        const tip = polar(C, C, r, deg);
        const shoulder = HUB + (r - HUB) * 0.3 + 6;
        const left = polar(C, C, shoulder, deg - half);
        const right = polar(C, C, shoulder, deg + half);
        shape = `<g class="petal" style="animation-delay:${i * 70}ms">
          <polygon class="petal-a" points="${C},${C} ${pt(left)} ${pt(tip)}"/>
          <polygon class="petal-b" points="${C},${C} ${pt(right)} ${pt(tip)}"/>
        </g>`;
      }
      return `<g data-color="${it.space.color}">
        <line class="spoke" x1="${C}" y1="${C}" x2="${end[0].toFixed(1)}" y2="${end[1].toFixed(1)}"/>
        ${shape}
        <circle class="end" cx="${end[0].toFixed(1)}" cy="${end[1].toFixed(1)}" r="4.5"/>
      </g>`;
    })
    .join('');

  const total = overview.pct === null ? '–' : `${Math.round(overview.pct * 100)}%`;
  const label = overview.pct === null ? 'Sin nada planificado esta semana' : `Avance de la semana: ${total}`;

  return `<svg class="rose ${animate ? 'grow' : ''}" viewBox="0 0 320 320" role="img" aria-label="${esc(label)}">
    ${ticks}
    <circle class="ring" cx="${C}" cy="${C}" r="${R}"/>
    ${rings}
    ${petals}
    <circle class="hub" cx="${C}" cy="${C}" r="${HUB}"/>
    <text class="hub-n" x="${C}" y="${C + 4}">${total}</text>
    <text class="hub-l" x="${C}" y="${C + 17}">semana</text>
  </svg>`;
}

const niceMax = (v) => {
  if (v <= 0) return 1;
  const pow = 10 ** Math.floor(Math.log10(v));
  const f = v / pow;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * pow;
};

const compact = (v) => (v >= 1e6 ? `${num(v / 1e6)} M` : v >= 1e4 ? `${num(v / 1e3)} mil` : num(v));

function frame(max, W, H, L, B, T) {
  let out = '';
  for (const f of [0, 0.5, 1]) {
    const y = T + (H - T - B) * (1 - f);
    out += `<line class="${f === 0 ? 'axis' : 'grid'}" x1="${L}" x2="${W}" y1="${y}" y2="${y}"/>
      <text x="${L - 8}" y="${y + 4}" text-anchor="end">${compact(max * f)}</text>`;
  }
  return out;
}

// Ingresos y gastos por mes.
export function inOutChart(months) {
  const W = 600, H = 210, L = 54, B = 26, T = 10;
  const max = niceMax(Math.max(...months.map((m) => Math.max(m.income, m.expense))));
  const band = (W - L) / months.length;
  const bw = Math.min(26, band * 0.3);
  const y = (v) => T + (H - T - B) * (1 - v / max);
  const bars = months
    .map((m, i) => {
      const cx = L + band * i + band / 2;
      const base = H - B;
      return `<rect class="in" x="${cx - bw - 2}" y="${y(m.income)}" width="${bw}" height="${Math.max(0, base - y(m.income))}" rx="3"><title>Ingresos de ${monthShort(m.month)}: ${num(m.income)}</title></rect>
        <rect class="out" x="${cx + 2}" y="${y(m.expense)}" width="${bw}" height="${Math.max(0, base - y(m.expense))}" rx="3"><title>Gastos de ${monthShort(m.month)}: ${num(m.expense)}</title></rect>
        <text x="${cx}" y="${H - 8}" text-anchor="middle">${monthShort(m.month)}</text>`;
    })
    .join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Ingresos y gastos de los últimos ${months.length} meses">${frame(max, W, H, L, B, T)}${bars}</svg>`;
}

// Barras simples: [{ label, value, title }]. La última va resaltada.
export function barChart(items, ariaLabel) {
  const W = 600, H = 190, L = 54, B = 26, T = 10;
  const max = niceMax(Math.max(...items.map((d) => d.value)));
  const band = (W - L) / items.length;
  const bw = Math.min(40, band * 0.56);
  const y = (v) => T + (H - T - B) * (1 - v / max);
  const bars = items
    .map((d, i) => {
      const cx = L + band * i + band / 2;
      return `<rect class="bar ${i === items.length - 1 ? '' : 'dim'}" x="${cx - bw / 2}" y="${y(d.value)}" width="${bw}" height="${Math.max(0, H - B - y(d.value))}" rx="4"><title>${esc(d.title)}</title></rect>
        <text x="${cx}" y="${H - 8}" text-anchor="middle">${esc(d.label)}</text>`;
    })
    .join('');
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(ariaLabel)}">${frame(max, W, H, L, B, T)}${bars}</svg>`;
}
