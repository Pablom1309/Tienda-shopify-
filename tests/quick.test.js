import test from 'node:test';
import assert from 'node:assert/strict';

import { parseQuick } from '../js/quick.js';

// 2026-11-17 es martes.
const today = '2026-11-17';
const spaces = [
  { id: 'tienda', name: 'Tienda online' },
  { id: 'vida', name: 'Vida personal' },
  { id: 'gym', name: 'Entrenamiento' },
];
const q = (text) => parseQuick(text, { today, spaces });

test('captura: sin pistas, todo es título', () => {
  assert.deepEqual(q('Comprar pan'), { title: 'Comprar pan', due: null, time: null, priority: 0, spaceId: null, repeat: null });
});

test('captura: fecha, hora, prioridad y espacio en una frase', () => {
  assert.deepEqual(q('Llamar a Ana mañana 18:00 !alta #vida'), { title: 'Llamar a Ana', due: '2026-11-18', time: '18:00', priority: 2, spaceId: 'vida', repeat: null });
});

test('captura: palabras de fecha', () => {
  assert.equal(q('pagar luz hoy').due, today);
  assert.equal(q('pagar luz pasado mañana').due, '2026-11-19');
  assert.equal(q('reunión el viernes').due, '2026-11-20');
  assert.equal(q('reunión martes').due, '2026-11-24'); // hoy es martes: el siguiente
  assert.equal(q('entregar informe en 3 días').due, '2026-11-20');
  assert.equal(q('revisar en 2 semanas').due, '2026-12-01');
  assert.equal(q('planificar la próxima semana').due, '2026-11-23');
  assert.equal(q('dentista 15/12').due, '2026-12-15');
  assert.equal(q('dentista 5/1').due, '2027-01-05'); // ya pasó este año
  assert.equal(q('cumple de Sofi el 3 de diciembre').due, '2026-12-03');
  assert.equal(q('viaje 2 de marzo de 2027').due, '2027-03-02');
});

test('captura: el título queda limpio', () => {
  assert.equal(q('Comprar regalo para mañana').title, 'Comprar regalo');
  assert.equal(q('reunión con Luis el viernes a las 10').title, 'Reunión con Luis');
  assert.equal(q('cumple de Sofi el 3 de diciembre').title, 'Cumple de Sofi');
});

test('captura: "por la mañana" no es una fecha', () => {
  const r = q('correr por la mañana');
  assert.equal(r.due, null);
  assert.equal(r.title, 'Correr por la mañana');
});

test('captura: horas', () => {
  assert.equal(q('llamar 9:30').time, '09:30');
  assert.equal(q('llamar 6pm').time, '18:00');
  assert.equal(q('llamar a las 6:15 pm').time, '18:15');
  assert.equal(q('llamar a las 3').time, '15:00'); // de la tarde
  assert.equal(q('llamar a las 9').time, '09:00');
  assert.equal(q('llamar 18h').time, '18:00');
  assert.equal(q('llamar 9:30').due, today); // con hora y sin fecha, es hoy
  assert.equal(q('comprar 2.50 kg de harina').time, null);
});

test('captura: prioridad', () => {
  assert.equal(q('pagar arriendo !').priority, 1);
  assert.equal(q('pagar arriendo !!').priority, 2);
  assert.equal(q('¡Feliz día!').priority, 0);
});

test('captura: repetición', () => {
  assert.deepEqual([q('regar plantas cada semana').repeat, q('regar plantas cada semana').due], ['weekly', today]);
  assert.equal(q('tomar vitaminas todos los días').repeat, 'daily');
  assert.equal(q('revisar correo de lunes a viernes').repeat, 'weekdays');
  assert.equal(q('pagar internet cada mes').repeat, 'monthly');
  const lunes = q('sacar la basura cada lunes');
  assert.deepEqual([lunes.repeat, lunes.due, lunes.title], ['weekly', '2026-11-23', 'Sacar la basura']);
});

test('captura: el espacio se reconoce por el comienzo de una palabra', () => {
  assert.equal(q('subir creativos #tien').spaceId, 'tienda');
  assert.equal(q('pierna #entre').spaceId, 'gym');
  const none = q('mirar #ofertas');
  assert.equal(none.spaceId, null);
  assert.equal(none.title, 'Mirar #ofertas');
});

test('captura: si solo hay pistas, se toman como título', () => {
  assert.deepEqual(q('mañana'), { title: 'mañana', due: null, time: null, priority: 0, spaceId: null, repeat: null });
});
