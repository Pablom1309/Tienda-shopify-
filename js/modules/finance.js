import { icon } from '../icons.js';
import { inOutChart } from '../charts.js';
import { addMonths, esc, money, monthName, parseAmount, relDate, today, ym } from '../util.js';
import { categoryTotals, lastMonths, monthTotals } from '../logic.js';
import { add, bySpace, find, patch, remove, spacesWith, state } from '../store.js';
import { closeSheet, currency, emptyState, field, on, openSheet, removeWithUndo, segmented, spaceSelect, toast, view } from '../ui.js';

const SUGGESTED = {
  in: ['Ventas', 'Sueldo', 'Honorarios', 'Otros ingresos'],
  out: ['Supermercado', 'Arriendo', 'Cuentas', 'Transporte', 'Publicidad', 'Proveedor', 'Envíos', 'Herramientas', 'Salud', 'Salidas'],
};

export function renderFinance(space) {
  const cur = currency();
  const all = bySpace('tx', space.id);
  const month = view.finMonth || ym(today());
  const totals = monthTotals(all, month);
  const cats = categoryTotals(all, month, 'out');
  const maxCat = cats[0]?.total || 1;
  const list = all.filter((t) => ym(t.date) === month).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const isNow = month === ym(today());

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
      <div class="figure"><dt>Ingresos</dt><dd>${money(totals.income, cur)}</dd></div>
      <div class="figure"><dt>Gastos</dt><dd>${money(totals.expense, cur)}</dd></div>
      <div class="figure"><dt>Balance</dt><dd class="${totals.balance < 0 ? 'neg' : 'pos'}">${money(totals.balance, cur)}</dd></div>
    </dl>
    <div class="split" data-color="${space.color}">
      <section class="section">
        <div class="section-head"><h2 class="h2">Últimos 6 meses</h2>
          <div class="key"><span><i class="k-in"></i>Ingresos</span><span><i class="k-out"></i>Gastos</span></div>
        </div>
        ${inOutChart(lastMonths(all, month, 6))}
      </section>
      <section class="section">
        <h2 class="h2">En qué se fue</h2>
        ${
          cats.length
            ? `<ul class="list num">${cats
                .slice(0, 7)
                .map((c) => `<li class="cat"><b>${esc(c.category)}</b><span>${money(c.total, cur)}</span><div class="bar"><i style="width:${Math.max(2, (c.total / maxCat) * 100)}%"></i></div></li>`)
                .join('')}</ul>`
            : '<p class="muted">Sin gastos este mes.</p>'
        }
      </section>
    </div>
    <section class="section">
      <h2 class="h2">Movimientos</h2>
      ${
        list.length
          ? `<ul class="list">${list
              .map(
                (t) => `<li class="row">
                  <button class="row-body" data-action="tx-open" data-id="${t.id}">
                    <span class="row-title">${esc(t.category || 'Sin categoría')}</span>
                    <span class="row-meta"><span>${esc(relDate(t.date))}</span>${t.note ? `<span>${esc(t.note)}</span>` : ''}</span>
                  </button>
                  <span class="row-end amount num ${t.type === 'in' ? 'pos' : ''}">${t.type === 'in' ? '+' : '−'}${money(t.amount, cur)}</span>
                </li>`,
              )
              .join('')}</ul>`
          : `<p class="muted">No hay movimientos en ${monthName(month)}.</p>`
      }
    </section>`;
}

export function openTxSheet({ id, spaceId } = {}) {
  const t = id ? find('tx', id) : null;
  if (!spacesWith('finance').length) return toast('Activa Finanzas en algún espacio para anotar movimientos.');
  const v = t || { type: 'out', amount: '', category: '', note: '', date: today(), spaceId };
  const used = [...new Set(state.tx.map((x) => x.category).filter(Boolean))];
  const options = [...new Set([...used, ...SUGGESTED.out, ...SUGGESTED.in])];
  openSheet({
    title: t ? 'Editar movimiento' : 'Nuevo movimiento',
    submitLabel: t ? 'Guardar' : 'Añadir movimiento',
    body: `
      ${segmented({ label: 'Tipo', name: 'type', value: v.type, options: [{ value: 'out', label: 'Gasto' }, { value: 'in', label: 'Ingreso' }] })}
      <div class="form-row">
        ${field({ label: `Monto (${currency()})`, name: 'amount', value: v.amount, placeholder: '0', attrs: 'inputmode="decimal" autofocus required autocomplete="off"' })}
        ${field({ label: 'Fecha', name: 'date', type: 'date', value: v.date, attrs: 'required' })}
      </div>
      ${field({ label: 'Categoría', name: 'category', value: v.category, placeholder: 'Ej.: Supermercado', attrs: 'list="cats" maxlength="40" autocomplete="off"' })}
      <datalist id="cats">${options.map((c) => `<option value="${esc(c)}">`).join('')}</datalist>
      ${spaceSelect('finance', v.spaceId)}
      ${field({ label: 'Nota', name: 'note', value: v.note, placeholder: 'Opcional', attrs: 'maxlength="120" autocomplete="off"' })}`,
    onSubmit(d) {
      const amount = parseAmount(d.amount);
      if (!(amount > 0)) return { amount: 'Escribe un monto mayor que cero.' };
      if (!d.date) return { date: 'Elige la fecha.' };
      const data = { type: d.type === 'in' ? 'in' : 'out', amount, category: d.category.trim(), note: d.note.trim(), date: d.date, spaceId: d.spaceId };
      if (t) patch('tx', t.id, data);
      else add('tx', data);
      view.finMonth = ym(d.date) > ym(today()) ? view.finMonth : ym(d.date);
      toast(t ? 'Movimiento guardado' : 'Movimiento añadido');
    },
    onDelete: t ? () => removeWithUndo('Movimiento eliminado', () => remove('tx', t.id)) : null,
  });
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
    document.dispatchEvent(new Event('rumbo:render'));
  },
});
