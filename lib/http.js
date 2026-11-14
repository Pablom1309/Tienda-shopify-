const crypto = require('crypto');

function claveCorrecta(req) {
  const esperada = process.env.APP_PASSWORD;
  if (!esperada) {
    const e = new Error('Falta definir la clave: agrega la variable APP_PASSWORD en Vercel y vuelve a publicar.');
    e.status = 500;
    throw e;
  }
  const recibida = String(req.headers['x-clave'] || '');
  const a = crypto.createHash('sha256').update(recibida).digest();
  const b = crypto.createHash('sha256').update(esperada).digest();
  return crypto.timingSafeEqual(a, b);
}

async function leerCuerpo(req) {
  if (req.body !== undefined) return typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  let texto = '';
  for await (const parte of req) texto += parte;
  return texto ? JSON.parse(texto) : {};
}

function responder(res, estado, datos) {
  res.statusCode = estado;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(datos));
}

// Envuelve una función: exige la clave y convierte los errores en respuestas.
function conClave(fn) {
  return async (req, res) => {
    try {
      if (!claveCorrecta(req)) return responder(res, 401, { error: 'Clave incorrecta' });
      await fn(req, res);
    } catch (e) {
      const estado = e.status || 500;
      if (estado === 500) console.error(e);
      responder(res, estado, { error: e.status ? e.message : 'Error del servidor: ' + e.message });
    }
  };
}

function error(estado, mensaje) {
  const e = new Error(mensaje);
  e.status = estado;
  return e;
}

module.exports = { conClave, leerCuerpo, responder, error };
