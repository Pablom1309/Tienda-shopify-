import { icon } from '../icons.js';
import { inOutChart } from '../charts.js';
import { addMonths, esc, money, monthName, monthShort, parseAmount, relDate, today, ym } from '../util.js';
import { budgetRows, lastMonths, monthTotals } from '../logic.js';
import { add, bySpace, find, getSpace, patch, remove, spacesWith, state, update } from '../store.js';
import { closeSheet, currency, emptyState, field, on, openExportSheet, openSheet, rerender, segmented, spaceSelect, toast, view, withUndo } from '../ui.js';

const SUGGESTED = {
  in: ['Ventas', 'Sueldo', 'Honorarios', 'Otros ingresos'],
  out: ['Supermercado', 'Arriendo', 'Cuentas', 'Transporte', 'Publicidad', 'Proveedor', 'Envíos', 'Herramientas', 'Salud', 'Salidas'],
};

// "12% más que en octubre" (o menos). Sin mes anterior con datos, nada.
function versus(nowValue, prevValue, prevMonth) {
  if (!prevValue) return '';
  const change = Math.round(((nowValue - prevValue) / prevValue) * 100);
  if (!change) return `<small>Igual que en ${monthShort(prevMonth)}</small>`;
  return `<small>${Math.abs(change)}% ${change > 0 ? 'más' : 'menos'} que en ${monthShort(prevMonth)}</small>`;
}

function budgetList(rows, cur) {
  const maxSpent = Math.max(1, ...rows.map((r) => r.spent));
  return `<ul class="list num">${rows
    .slice(0, 10)
    .map((r) => {
      const over = r.budget !== null && r.spent > r.budget;
      const width = r.budget ? Math.min(100, (r.spent / r.budget) * 100) : (r.spent / maxSpent) * 100;
      const active = view.finCat === r.category;
      return `<li><button class="cat ${over ? 'over' : ''}" data-action="fin-cat" data-cat="${esc(r.category)}" aria-pressed="${active}">
        <b>${esc(r.category)}</b>
        <span>${money(r.spent, cur)}${r.budget !== null ? ` <span class="muted">de ${money(r.budget, cur)}</span>` : ''}</span>
        <span class="bar"><i style="width:${Math.max(r.spent ? 2 : 0, width)}%"></i></span>
        ${over ? `<span class="cat-note">Te pasaste por ${money(r.spent - r.budget, cur)}</span>` : r.budget !== null ? `<span class="cat-note ok">Quedan ${money(r.budget - r.spent, cur)}</span>` : ''}
      </button></li>`;
    })
    .join('')}</ul>`;
}

export function renderFinance(space) {
  const cur = currency();
  const all = bySpace('tx', space.id);
  const budgets = bySpace('budgets', space.id);
  const month = view.finMonth || ym(today());
  const prev = addMonths(month, -1);
  const totals = monthTotals(all, month);
  const before = monthTotals(all, prev);
  const rows = budgetRows(all, budgets, month);
  const isNow = month === ym(today());
  const cat = view.finCat && rows.some((r) => r.category === view.finCat) ? view.finCat : null;
  const list = all
    .filter((t) => ym(t.date) === month && (!cat || (t.type === 'out' && (t.category || 'Sin categoría') === cat)))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const head = `<div class="toolbar">
      <div class="month-nav">
        <button class="icon-btn" data-action="fin-month" data-step="-1" aria-label="Mes anterior">${icon('chevron-left')}</button>
        <strong>${monthName(month)}</strong>
        <button class="icon-btn" data-action="fin-month" data-step="1" aria-label="Mes siguiente" ${isNow ? 'disabled style="opacity:.3"' : ''}>${icon('chevron-right')}</button>
      </div>
      <button class="btn" data-action="tx-new" data-space="${space.id}">${icon('plus', 18)}<span>Añadir movimiento</span></button>
    </div>`;

  if (!all.length) {
    return head + emptyState({ ico: 'wallet', text: 'Anota cada ingreso y cada gasto. Con eso verás el balance del mes y en qué se va el dinero.', action: 'tx-new', label: 'Añadir movimiento', attrs: `data-space="${space.id}"` });
  }

  return `${head}
    <dl class="figures num">
      <div class="figure"><dt>Ingresos</dt><dd>${money(totals.income, cur)}</dd>${versus(totals.income, before.income, prev)}</div>
      <div class="figure"><dt>Gastos</dt><dd>${money(totals.expense, cur)}</dd>${versus(totals.expense, before.expense, prev)}</div>
      <div class="figure"><dt>Balance</dt><dd class="${totals.balance < 0 ? 'neg' : 'pos'}">${money(totals.balance, cur)}</dd>${totals.income ? `<small>${totals.balance >= 0 ? `Te queda el ${Math.round((totals.balance / totals.income) * 100)}% de lo que entró` : 'Gastaste más de lo que entró'}</small>` : ''}</div>
    </dl>
    <div class="split" data-color="${space.color}">
      <section class="section">
        <div class="section-head"><h2 class="h2">Últimos 6 meses</h2>
          <div class="key"><span><i class="k-in"></i>Ingresos</span><span><i class="k-out"></i>Gastos</span></div>
        </div>
        ${inOutChart(lastMonths(all, month, 6))}
      </section>
      <section class="section">
        <div class="section-head"><h2 class="h2">Gastos por categoría</h2>
          <button class="btn soft sm" data-action="budget-edit" data-space="${space.id}">${icon('target', 15)}<span>Presupuestos</span></button>
        </div>
        ${rows.length ? budgetList(rows, cur) : '<p class="muted">Sin gastos este mes.</p>'}
        ${rows.length && !budgets.length ? '<p class="muted small">Pon un tope mensual a una categoría y verás cuánto te queda.</p>' : ''}
      </section>
    </div>
    <section class="section">
      <div class="section-head">
        <h2 class="h2">Movimientos${cat ? ` de ${esc(cat)}` : ''}</h2>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          ${cat ? `<button class="btn soft sm" data-action="fin-cat" data-cat="">${icon('x', 15)}<span>Ver todos</span></button>` : ''}
          <button class="btn soft sm" data-action="fin-csv" data-space="${space.id}">${icon('download', 15)}<span>Exportar</span></button>
        </div>
      </div>
      ${
        list.length
          ? `<ul class="list">${list
              .map(
                (t) => `<li class="row">
                  <button class="row-body" data-action="tx-open" data-id="${t.id}">
                    <span class="row-title">${esc(t.category || 'Sin categoría')}</span>
                    <span class="row-meta"><span>${esc(relDate(t.date))}</span>${t.repeat ? `<span>${icon('repeat', 14)}Cada mes</span>` : ''}${t.note ? `<span>${esc(t.note)}</span>` : ''}</span>
                  </button>
                  <span class="row-end amount num ${t.type === 'in' ? 'pos' : ''}">${t.type === 'in' ? '+' : '−'}${money(t.amount, cur)}</span>
                </li>`,
              )
              .join('')}</ul>`
          : `<p class="muted">No hay movimientos en ${monthName(month)}.</p>`
      }
    </section>`;
}

// ---------- Movimiento ----------

export function openTxSheet({ id, spaceId } = {}) {
  const t = id ? find('tx', id) : null;
  if (!spacesWith('finance').length) return toast('Activa Finanzas en algún espacio para anotar movimientos.');
  const v = t || { type: 'out', amount: '', category: '', note: '', date: today(), repeat: null, spaceId };
  const used = [...new Set(state.tx.map((x) => x.category).filter(Boolean))];
  const options = [...new Set([...used, ...SUGGESTED.out, ...SUGGESTED.in])];
  // Las categorías más usadas, a un toque.
  const counts = new Map();
  for (const x of state.tx) if (x.category) counts.set(`${x.type}|${x.category}`, (counts.get(`${x.type}|${x.category}`) || 0) + 1);
  const top = (type) => {
    const mine = [...counts.entries()].filter(([k]) => k.startsWith(`${type}|`)).sort((a, b) => b[1] - a[1]).map(([k]) => k.slice(type.length + 1));
    return [...new Set([...mine, ...SUGGESTED[type]])].slice(0, 6);
  };

  openSheet({
    title: t ? 'Editar movimiento' : 'Nuevo movimiento',
    submitLabel: t ? 'Guardar' : 'Añadir movimiento',
    body: `
      ${segmented({ label: 'Tipo', name: 'type', value: v.type, options: [{ value: 'out', label: 'Gasto' }, { value: 'in', label: 'Ingreso' }] })}
      <div class="form-row">
        ${field({ label: `Monto (${currency()})`, name: 'amount', value: v.amount, placeholder: '0', attrs: `inputmode="decimal" ${t ? '' : 'autofocus'} required autocomplete="off"` })}
        ${field({ label: 'Fecha', name: 'date', type: 'date', value: v.date, attrs: 'required' })}
      </div>
      <fieldset class="field"><legend>Categoría</legend>
        <div class="seg chips-row" id="cat-chips"></div>
        <input type="text" name="category" id="f-category" value="${esc(v.category)}" placeholder="Ej.: Supermercado" list="cats" maxlength="40" autocomplete="off" aria-label="Categoría">
      </fieldset>
      <datalist id="cats">${options.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
      ${spaceSelect('finance', v.spaceId)}
      ${field({ label: 'Nota', name: 'note', value: v.note, placeholder: 'Opcional', attrs: 'maxlength="120" autocomplete="off"' })}
      <label class="toggle"><input type="checkbox" name="repeat" ${v.repeat ? 'checked' : ''}>${icon('repeat')}<span><b>Se repite cada mes</b><small>Se anota solo el mismo día de cada mes</small></span></label>`,
    onOpen(d) {
      const form = d.querySelector('form');
      const chips = d.querySelector('#cat-chips');
      const paint = () => {
        const type = form.elements.type.value;
        chips.innerHTML = top(type).map((c) => `<button type="button" data-cat="${esc(c)}" aria-pressed="${c === form.elements.category.value}">${esc(c)}</button>`).join('');
      };
      paint();
      form.addEventListener('change', (e) => e.target.name === 'type' && paint());
      form.elements.category.addEventListener('input', paint);
      chips.onclick = (e) => {
        const b = e.target.closest('[data-cat]');
        if (!b) return;
        form.elements.category.value = b.dataset.cat;
        paint();
      };
    },
    onSubmit(d) {
      const amount = parseAmount(d.amount);
      if (!(amount > 0)) return { amount: 'Escribe un monto mayor que cero.' };
      if (!d.date) return { date: 'Elige la fecha.' };
      const data = { type: d.type === 'in' ? 'in' : 'out', amount, category: d.category.trim(), note: d.note.trim(), date: d.date, spaceId: d.spaceId, repeat: d.repeat ? 'monthly' : null, repeatDay: d.repeat ? Number(d.date.slice(8, 10)) : null };
      if (t) patch('tx', t.id, data);
      else add('tx', data);
      if (ym(d.date) <= ym(today())) view.finMonth = ym(d.date);
      toast(t ? 'Movimiento guardado' : 'Movimiento añadido');
    },
    onDelete: t ? () => withUndo('Movimiento eliminado', () => remove('tx', t.id)) : null,
  });
}

// ---------- Presupuestos ----------

function openBudgetSheet(spaceId) {
  const space = getSpace(spaceId);
  if (!space) return;
  const cur = currency();
  const budgets = bySpace('budgets', spaceId);
  const month = ym(today());
  const spent = budgetRows(bySpace('tx', spaceId), [], month);
  const used = [...new Set(bySpace('tx', spaceId).filter((t) => t.type === 'out' && t.category).map((t) => t.category))];
  const names = [...new Set([...budgets.map((b) => b.category), ...used])];
  const row = (category, amount, fixed) => `<div class="budget-row">
      ${fixed ? `<span class="budget-name">${esc(category)}<small class="num">${money(spent.find((r) => r.category === category)?.spent || 0, cur)} este mes</small></span><input type="hidden" data-b="category" value="${esc(category)}">` : `<input class="input" data-b="category" placeholder="Categoría nueva" maxlength="40" autocomplete="off" aria-label="Categoría nueva">`}
      <input class="input num" data-b="amount" inputmode="decimal" placeholder="Sin tope" value="${amount ? esc(String(amount)) : ''}" aria-label="Tope mensual de ${esc(category || 'la categoría nueva')}" autocomplete="off">
    </div>`;

  openSheet({
    title: `Presupuestos de ${space.name}`,
    submitLabel: 'Guardar presupuestos',
    body: `
      <p class="muted">El tope de gasto de cada categoría para un mes (${cur}). Deja en blanco las que no quieras controlar.</p>
      <div id="budgets" class="form" style="gap:10px">
        ${names.map((c) => row(c, budgets.find((b) => b.category === c)?.amount, true)).join('')}
        ${row('', '', false)}
      </div>`,
    onSubmit(_, form) {
      const next = [];
      for (const r of form.querySelectorAll('.budget-row')) {
        const category = r.querySelector('[data-b="category"]').value.trim();
        const raw = r.querySelector('[data-b="amount"]').value;
        if (!category || !raw.trim()) continue;
        const amount = parseAmount(raw);
        if (!(amount > 0)) continue;
        next.push({ id: Math.random().toString(36).slice(2, 10) + Date.now().toString(36), spaceId, category, amount });
      }
      update((s) => {
        s.budgets = [...s.budgets.filter((b) => b.spaceId !== spaceId), ...next];
      });
      toast('Presupuestos guardados');
    },
  });
}

// ---------- Exportar ----------

function csv(spaceId) {
  const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = bySpace('tx', spaceId)
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .map((t) => [t.date, t.type === 'in' ? 'Ingreso' : 'Gasto', t.category, String(t.amount).replace('.', ','), t.note].map(cell).join(';'));
  return ['Fecha;Tipo;Categoría;Monto;Nota', ...rows].join('\r\n');
}

on({
  'tx-new': (el) => {
    closeSheet();
    openTxSheet({ spaceId: el.dataset.space });
  },
  'tx-open': (el) => openTxSheet({ id: el.dataset.id }),
  'fin-month': (el) => {
    const next = addMonths(view.finMonth || ym(today()), Number(el.dataset.step));
    if (next > ym(today())) return;
    view.finMonth = next;
    rerender();
  },
  'fin-cat': (el) => {
    view.finCat = view.finCat === el.dataset.cat ? null : el.dataset.cat || null;
    rerender();
  },
  'budget-edit': (el) => openBudgetSheet(el.dataset.space),
  'fin-csv': (el) => {
    const space = getSpace(el.dataset.space);
    openExportSheet({
      title: 'Exportar movimientos',
      intro: `Todos los movimientos de ${space.name} en formato CSV, listos para abrir en Excel o Google Sheets.`,
      filename: `rumbo-movimientos-${today()}.csv`,
      text: csv(space.id),
      mime: 'text/csv;charset=utf-8',
    });
  },
});
