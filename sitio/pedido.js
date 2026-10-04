// Formulario contra entrega: calcula el total y abre WhatsApp con el pedido armado.
(function () {
  var f = document.getElementById('pedido');
  if (!f) return;
  var clp = function (n) { return '$' + n.toLocaleString('es-CL'); };
  var total = function () {
    var r = f.querySelector('input[name=cantidad]:checked');
    var c = f.querySelector('input[name=complemento]');
    return Number(r ? r.dataset.precio : 0) + (c && c.checked ? Number(c.value) : 0);
  };
  var pintar = function () { document.getElementById('total').textContent = clp(total()); };
  f.addEventListener('change', pintar);
  f.addEventListener('submit', function (ev) {
    ev.preventDefault();
    // Marca los campos incompletos sin perder lo escrito.
    var primero = null;
    f.querySelectorAll('[required]').forEach(function (el) {
      var ok = el.checkValidity();
      el.closest('.campo') && el.closest('.campo').classList.toggle('error', !ok);
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
      '• Dirección: ' + d.get('direccion') + ', ' + d.get('comuna') + ', ' + d.get('region')
    ].filter(Boolean);
    if (!f.dataset.wa) { alert('La tienda aún no tiene WhatsApp configurado. Vuelve pronto.'); return; }
    if (window.fbq) { window.fbq('track', 'Purchase', { value: total(), currency: 'CLP' }); }
    window.location.href = 'https://wa.me/' + f.dataset.wa + '?text=' + encodeURIComponent(lineas.join('\n'));
  });
})();
