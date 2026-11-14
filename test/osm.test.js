const test = require('node:test');
const assert = require('node:assert');
const { dentroDeComuna, aLocal, aLocales, consulta } = require('../lib/osm');

const nodo = (tags, lat = -33.4489, lon = -70.6693, id = 1) => ({ type: 'node', id, lat, lon, tags });

test('distingue puntos dentro y fuera de la comuna', () => {
  assert.equal(dentroDeComuna(-33.4489, -70.6693), true); // centro de Santiago
  assert.equal(dentroDeComuna(-33.4170, -70.6060), false); // Providencia
  assert.equal(dentroDeComuna(-33.5000, -70.6600), false); // San Miguel
});

test('convierte un restaurante de sushi con sus datos', () => {
  const l = aLocal(nodo({ name: 'Sushi Prueba', cuisine: 'sushi', 'addr:street': 'Vergara', 'addr:housenumber': '624', phone: '+56 2 1234' }));
  assert.deepEqual(l, {
    osm_id: 'node/1', nombre: 'Sushi Prueba', direccion: 'Vergara 624', telefono: '+56 2 1234',
    web: null, horario: null, cocina: 'sushi', lat: -33.4489, lon: -70.6693,
  });
});

test('acepta por nombre aunque no tenga cocina, y usa el centro en edificios', () => {
  const l = aLocal({ type: 'way', id: 7, center: { lat: -33.4489, lon: -70.6693 }, tags: { name: 'Nikkei House' } });
  assert.equal(l.osm_id, 'way/7');
});

test('descarta lo que no es sushi, lo que está fuera y lo que no tiene posición', () => {
  assert.equal(aLocal(nodo({ name: 'Pizzería Roma', cuisine: 'pizza' })), null);
  assert.equal(aLocal(nodo({ name: 'Sushi Lejos', cuisine: 'sushi' }, -33.417, -70.606)), null);
  assert.equal(aLocal({ type: 'way', id: 2, tags: { cuisine: 'sushi' } }), null);
});

test('no repite locales y nombra los que no tienen nombre', () => {
  const ls = aLocales([nodo({ cuisine: 'japanese' }), nodo({ cuisine: 'japanese' })]);
  assert.equal(ls.length, 1);
  assert.equal(ls[0].nombre, 'Local sin nombre');
});

test('la consulta se limita a la zona de la comuna', () => {
  assert.match(consulta(), /\[bbox:-33\.4\d+,-70\.6\d+,-33\.4\d+,-70\.6\d+\]/);
});
