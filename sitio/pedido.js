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
        setTimeout(function () { en.target.classList.add('visible'); }, i * 60);
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
    filtros.forEach(function (b) {
      b.addEventListener('click', function () {
        filtro = b.dataset.filtro; pagina = 1;
        filtros.forEach(function (x) { var on = x === b; x.classList.toggle('activo', on); x.setAttribute('aria-pressed', on); });
        pintarCatalogo(false);
      });
    });
    pintarCatalogo(false);
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
  var campos = ['nombre', 'telefono', 'region', 'comuna', 'direccion'];
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
  f.addEventListener('input', function (ev) {
    guardar();
    var c = ev.target.closest('.campo');
    if (c && c.classList.contains('error') && ev.target.checkValidity()) c.classList.remove('error');
  });
  pintar();

  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    // Marca los campos incompletos sin perder lo escrito.
    var primero = null;
    f.querySelectorAll('[required]').forEach(function (el) {
      var ok = el.checkValidity();
      if (el.closest('.campo')) el.closest('.campo').classList.toggle('error', !ok);
      if (!ok && !primero) primero = el;
    });
    if (primero) { primero.focus(); return; }
    var d = new FormData(f);
    var c = f.querySelector('input[name=complemento]');
    var lineas = [
      'Hola, quiero hacer este pedido (pago contra entrega):',
      '• Producto: ' + f.dataset.producto,
      '• Cantidad: ' + d.get('cantidad') + (d.get('talla') ? ' · Talla ' + d.get('talla') : ''),
      c && c.checked ? '• Agregar: ' + c.dataset.nombre : null,
      '• Total: ' + clp(total()),
      '• Nombre: ' + d.get('nombre'),
      '• Teléfono: ' + d.get('telefono'),
      '• Dirección: ' + d.get('direccion') + ', ' + d.get('comuna') + ', ' + d.get('region'),
      '• Acepto recordatorios y novedades por WhatsApp: ' + (d.get('consentimiento') ? 'Sí' : 'No')
    ].filter(Boolean);
    if (!f.dataset.wa) { alert('La tienda aún no tiene WhatsApp configurado. Vuelve pronto.'); return; }
    if (window.fbq) { window.fbq('track', 'Purchase', { value: total(), currency: 'CLP' }); }
    window.location.href = 'https://wa.me/' + f.dataset.wa + '?text=' + encodeURIComponent(lineas.join('\n'));
  });
})();
