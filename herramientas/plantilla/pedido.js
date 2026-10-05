// Kuchiwau: interacciones de la tienda (sin dependencias).
(function () {
  document.documentElement.classList.add('js');

  // Revelado suave al hacer scroll; si el usuario pidió menos movimiento, se muestra todo de inmediato.
  var reveladores = document.querySelectorAll('.revelar');
  var menosMovimiento = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || menosMovimiento) {
    reveladores.forEach(function (el) { el.classList.add('visible'); });
  } else {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        setTimeout(function () { en.target.classList.add('visible'); }, Math.min(i, 4) * 50);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -60px 0px' });
    reveladores.forEach(function (el) { io.observe(el); });
  }

  // Catálogo: filtro por mascota + paginación (8 kits por página). Sin JS se ven todos.
  var grilla = document.getElementById('grilla');
  var paginas = document.getElementById('paginas');
  if (grilla && paginas) {
    var POR_PAGINA = 8, filtro = 'todos', pagina = 1;
    var tarjetas = Array.prototype.slice.call(grilla.querySelectorAll('.tarjeta'));
    var visibles = function () {
      return tarjetas.filter(function (t) { var m = t.dataset.mascota; return filtro === 'todos' || m === filtro || m === 'ambos'; });
    };
    var boton = function (txt, n, etiqueta, actual, desactivado) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pagina' + (actual ? ' activa' : ''); b.textContent = txt;
      b.setAttribute('aria-label', etiqueta); if (actual) b.setAttribute('aria-current', 'page');
      b.disabled = !!desactivado;
      b.addEventListener('click', function () { pagina = n; pintarCatalogo(true); });
      return b;
    };
    var pintarCatalogo = function (desplazar) {
      var lista = visibles(), total = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
      if (pagina > total) pagina = total;
      tarjetas.forEach(function (t) { t.hidden = true; });
      lista.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA).forEach(function (t) { t.hidden = false; t.classList.add('visible'); });
      var vacio = document.getElementById('vacio'), conteo = document.getElementById('conteo');
      if (vacio) vacio.hidden = lista.length > 0;
      if (conteo) conteo.textContent = lista.length ? 'Mostrando ' + lista.length + (lista.length === 1 ? ' kit' : ' kits') : 'No hay kits para este filtro';
      paginas.innerHTML = '';
      paginas.hidden = total < 2;
      if (total > 1) {
        paginas.appendChild(boton('‹', pagina - 1, 'Página anterior', false, pagina === 1));
        for (var i = 1; i <= total; i++) paginas.appendChild(boton(String(i), i, 'Página ' + i, i === pagina, false));
        paginas.appendChild(boton('›', pagina + 1, 'Página siguiente', false, pagina === total));
      }
      if (desplazar) document.getElementById('kits').scrollIntoView({ behavior: menosMovimiento ? 'auto' : 'smooth', block: 'start' });
    };
    var filtros = document.querySelectorAll('.filtro');
    var elegir = function (valor) {
      filtro = valor; pagina = 1;
      filtros.forEach(function (x) { var on = x.dataset.filtro === valor; x.classList.toggle('activo', on); x.setAttribute('aria-pressed', on); });
      pintarCatalogo(false);
    };
    filtros.forEach(function (b) { b.addEventListener('click', function () { elegir(b.dataset.filtro); }); });
    var todos = document.querySelector('[data-filtro-todos]');
    if (todos) todos.addEventListener('click', function () { elegir('todos'); });
    pintarCatalogo(false);
  }

  // Galería de la ficha: miniaturas (solo existen si hay fotos extra reales). Cambia la foto principal sin recargar.
  var minis = document.querySelectorAll('.miniaturas .mini');
  if (minis.length) {
    var principal = document.querySelector('.foto-producto picture');
    minis.forEach(function (m) {
      m.addEventListener('click', function () {
        var origen = m.querySelector('picture');
        if (!principal || !origen) return;
        var img = principal.querySelector('img'), nueva = origen.querySelector('img');
        var fuente = principal.querySelector('source'), fuenteNueva = origen.querySelector('source');
        img.src = nueva.src; img.removeAttribute('srcset');
        if (fuente) { if (fuenteNueva) { fuente.srcset = fuenteNueva.srcset; } }
        minis.forEach(function (x) { var on = x === m; x.classList.toggle('activa', on); x.setAttribute('aria-pressed', on); });
      });
    });
  }

  var f = document.getElementById('pedido');
  if (!f) return;
  var clp = function (n) { return '$' + Number(n).toLocaleString('es-CL'); };

  // Barra de compra fija (móvil): aparece cuando el formulario sale de la pantalla.
  var barra = document.getElementById('barra-compra');
  if (barra && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var fuera = !en[0].isIntersecting && en[0].boundingClientRect.top < 0;
      barra.classList.toggle('visible', fuera);
    }).observe(f);
  }

  var total = function () {
    var r = f.querySelector('input[name=cantidad]:checked');
    var c = f.querySelector('input[name=complemento]');
    return Number(r ? r.dataset.precio : 0) + (c && c.checked ? Number(c.value) : 0);
  };

  // Fecha estimada de entrega según la región (días hábiles, desde mañana).
  var PLAZOS = { rm: [2, 4], regiones: [3, 7] };
  var sumarHabiles = function (desde, n) {
    var d = new Date(desde);
    while (n > 0) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0 && d.getDay() !== 6) n--; }
    return d;
  };
  var fmt = function (d) { return d.toLocaleDateString('es-CL', { weekday: 'short', day: 'numeric', month: 'short' }); };
  var entrega = document.getElementById('entrega');
  var pintarEntrega = function () {
    var sel = f.querySelector('select[name=region]');
    var op = sel && sel.selectedOptions[0];
    var zona = op && op.dataset.zona;
    if (!entrega || !zona) { if (entrega) entrega.hidden = true; return; }
    var txt = entrega.querySelector('span');
    if (zona === 'extrema') {
      txt.textContent = 'Para tu región coordinamos el plazo por WhatsApp.';
    } else {
      var p = PLAZOS[zona], hoy = new Date();
      txt.textContent = 'Llegada estimada: entre el ' + fmt(sumarHabiles(hoy, p[0])) + ' y el ' + fmt(sumarHabiles(hoy, p[1])) + '.';
    }
    entrega.hidden = false;
  };

  // Borrador local: si el cliente sale y vuelve, no pierde lo escrito.
  var CLAVE = 'kw-borrador-' + (f.dataset.id || 'pedido');
  var campos = ['nombre', 'telefono', 'region', 'comuna', 'direccion', 'referencia'];
  try {
    var guardado = JSON.parse(localStorage.getItem(CLAVE) || '{}');
    campos.forEach(function (k) { if (guardado[k] && f.elements[k]) f.elements[k].value = guardado[k]; });
  } catch (e) { /* almacenamiento no disponible: el formulario funciona igual */ }
  var guardar = function () {
    try {
      var d = {};
      campos.forEach(function (k) { if (f.elements[k]) d[k] = f.elements[k].value; });
      localStorage.setItem(CLAVE, JSON.stringify(d));
    } catch (e) { /* sin almacenamiento */ }
  };

  var pintar = function () { document.getElementById('total').textContent = clp(total()); pintarEntrega(); };
  f.addEventListener('change', function () { pintar(); guardar(); });
  // Validación por campo con mensaje que dice qué corregir (Baymard / clarify: error junto al campo, sin culpar).
  var digitos = function (t) { return (t || '').replace(/\D/g, ''); };
  var REGLAS = {
    nombre: function (v) { return v.trim().split(/\s+/).filter(function (p) { return p.length > 1; }).length >= 2 ? '' : 'Escribe tu nombre y apellido.'; },
    telefono: function (v) {
      var d = digitos(v);
      if (d.length === 11 && d.indexOf('56') === 0) d = d.slice(2);
      return d.length === 9 ? '' : 'Escribe tu celular de 9 dígitos, por ejemplo 9 1234 5678.';
    },
    region: function (v) { return v ? '' : 'Elige tu región.'; },
    comuna: function (v) { return v.trim().length >= 3 ? '' : 'Escribe tu comuna.'; },
    direccion: function (v) { return /\d/.test(v) && v.trim().length >= 5 ? '' : 'Escribe tu calle y número, por ejemplo Av. Irarrázaval 1234.'; }
  };
  var revisar = function (el) {
    var regla = REGLAS[el.name];
    if (!regla) return true;
    var msg = regla(el.value), c = el.closest('.campo'), t = c && c.querySelector('.error-txt');
    if (c) c.classList.toggle('error', !!msg);
    if (t && msg) t.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };
  f.addEventListener('input', function (ev) {
    guardar();
    var c = ev.target.closest('.campo');
    if (c && c.classList.contains('error')) revisar(ev.target);
  });
  // Al salir de un campo con algo escrito se avisa en el momento, no solo al enviar.
  f.addEventListener('focusout', function (ev) { if (ev.target.value && REGLAS[ev.target.name]) revisar(ev.target); });
  pintar();

  var aviso = document.getElementById('form-aviso'), ok = document.getElementById('pedido-ok');
  var boton = f.querySelector('button[type=submit]'), botonTxt = boton.querySelector('.boton-txt');
  var mostrarAviso = function (txt) { aviso.textContent = txt; aviso.hidden = !txt; };

  // Número de pedido corto (DDMM-XXXX, sin letras ambiguas) para que cliente y tienda hablen de lo mismo.
  var numeroPedido = function () {
    var h = new Date(), a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789', r = '';
    for (var i = 0; i < 4; i++) r += a.charAt(Math.floor(Math.random() * a.length));
    return 'KW-' + ('0' + h.getDate()).slice(-2) + ('0' + (h.getMonth() + 1)).slice(-2) + '-' + r;
  };

  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (boton.disabled) return;
    mostrarAviso('');
    var malos = [];
    f.querySelectorAll('[required]').forEach(function (el) { if (!revisar(el)) malos.push(el); });
    if (malos.length) {
      mostrarAviso(malos.length === 1 ? 'Falta corregir 1 campo.' : 'Faltan corregir ' + malos.length + ' campos.');
      malos[0].focus();
      return;
    }
    if (!f.dataset.wa) { mostrarAviso('Todavía no podemos recibir pedidos aquí. Vuelve en unos días.'); return; }
    var d = new FormData(f);
    var c = f.querySelector('input[name=complemento]');
    if (!f.dataset.pedido) f.dataset.pedido = numeroPedido();
    var num = f.dataset.pedido;
    var ref = (d.get('referencia') || '').toString().trim();
    var lineas = [
      'Hola, quiero hacer este pedido (pago contra entrega):',
      '• Pedido: ' + num,
      '• Producto: ' + f.dataset.producto,
      '• Cantidad: ' + d.get('cantidad') + (d.get('talla') ? ' · Talla ' + d.get('talla') : ''),
      c && c.checked ? '• Agregar: ' + c.dataset.nombre : null,
      '• Total: ' + clp(total()),
      '• Nombre: ' + d.get('nombre').toString().trim(),
      '• Teléfono: ' + d.get('telefono').toString().trim(),
      '• Dirección: ' + d.get('direccion').toString().trim() + ', ' + d.get('comuna').toString().trim() + ', ' + d.get('region'),
      ref ? '• Referencia: ' + ref : null,
      '• Acepto recordatorios y novedades por WhatsApp: ' + (d.get('consentimiento') ? 'Sí' : 'No')
    ].filter(Boolean);
    var url = 'https://wa.me/' + f.dataset.wa + '?text=' + encodeURIComponent(lineas.join('\n'));
    // Abrir WhatsApp es una intención de compra (Lead), no una compra. 'Purchase' solo debe
    // dispararse cuando exista confirmación real del pedido (entrega o pago confirmado).
    if (window.fbq) { window.fbq('track', 'Lead', { value: total(), currency: 'CLP', content_name: f.dataset.producto }); }
    // Estado de envío: el botón avisa que está trabajando y se vuelve a habilitar por si WhatsApp no abre.
    boton.disabled = true; boton.setAttribute('aria-busy', 'true'); botonTxt.textContent = 'Abriendo WhatsApp…';
    document.getElementById('ok-num').textContent = num;
    document.getElementById('ok-enlace').href = url;
    ok.hidden = false;
    var w = window.open(url, '_blank');
    if (!w) window.location.href = url;
    setTimeout(function () { boton.disabled = false; boton.removeAttribute('aria-busy'); botonTxt.textContent = 'Confirmar por WhatsApp'; }, 4000);
  });
})();
