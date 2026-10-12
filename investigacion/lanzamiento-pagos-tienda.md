# Lanzamiento de Kuchiwau en Shopify: pagos, COD, Dropi, dominio, boleta y medición

Fecha de la investigación: 2026-10-04. Moneda: CLP (USD donde la fuente lo da en USD).
Leyenda: [V] dato leído en la fuente citada; [I] inferencia mía; [?] no verificado, confirmar dentro de la cuenta o con el proveedor.
Nota de método: se usó WebSearch y WebFetch. Varias páginas oficiales devolvieron 403/404 (mercadopago.cl/ayuda y developers, flow.cl/tarifas.html, apps de Releasit/EasySell por URL directa); esos datos se tomaron del resumen de búsqueda de la propia página, y se marca cuando es así.
Alerta de datos viejos: los buscadores y blogs (tooltester, impulsaecommerce) citan Basic a US$39 y Grow a US$105. La página oficial de Chile muestra otros valores (paso 1). Usar siempre la oficial.

## Paso 1. Shopify en Chile: planes, prueba y pasarelas

Planes y precios (página oficial Chile, https://www.shopify.com/cl/precios):
| Plan | Mensual | Anual (por mes) | Comisión por pasarela externa |
|---|---|---|---|
| Basic | US$25 | US$19 | 2 % |
| Grow | US$65 | US$49 | 1 % |
| Advanced | US$399 | US$299 | 0,6 % |
| Plus | desde US$2.300 | n/a | 0,2 % |

- [V] Oferta de entrada: "Prueba 3 días gratis, luego US$1/mes durante 3 meses". Fuente: https://www.shopify.com/cl/precios
- [V] Todos los planes incluyen Sidekick, productos ilimitados y soporte 24/7 en español (misma fuente). Basic sin cuentas de empleado.
- [V] Shopify Payments no está disponible en Chile: Chile no figura en la lista de países; si el país no está, hay que usar un proveedor de pago de terceros. Fuente: https://help.shopify.com/es/manual/payments/shopify-payments/supported-countries
- [V] La comisión de transacción de terceros aplica a todas las transacciones por pasarelas externas. Fuente: https://help.shopify.com/en/manual/payments/third-party-providers
- [?] Si el método manual "Pago contra entrega" paga o no esa comisión sin Shopify Payments: la ayuda solo dice que con Shopify Payments activo los pagos manuales y PayPal quedan excluidos. En Chile no hay Shopify Payments, así que confirmar con soporte de Shopify antes de asumir 0 %. [I] Si aplicara, serían 2 % sobre cada pedido COD en Basic.
- [V] Pasarelas que operan hoy en tiendas Shopify de Chile según apps/medios: Webpay (app de Transbank, https://apps.shopify.com/webpay), Mercado Pago (https://www.mercadopago.cl/developers/es/docs/shopify/integration-configuration/checkout-pro), Flow (https://chocale.cl/2023/07/flow-pasarela-pagos-shopify-e-commerce-chile/), Khipu vía CartDNA (https://cartdna.com/es-mx/shopify-payment-methods/khipu), Pago Fácil y PayU (mismo artículo de chocale).
- [I] Costo real de cobrar con tarjeta = comisión de la pasarela + 2 % de Shopify (Basic). Con plan anual (US$19) o Grow la comisión de Shopify baja, pero Grow solo se justifica con volumen alto.

## Paso 2. Pasarelas en Chile: comparativa

| Pasarela | Comisión [V] salvo nota | Abono | Requisitos | Fuente |
|---|---|---|---|---|
| Flow | Tarjetas débito/crédito/prepago y billeteras: 2,89 % + IVA (abono 3.er día hábil) o 3,19 % + IVA (día hábil siguiente). Transferencia: 0,99 % + IVA + $100 + IVA (3.er día hábil). Cuotas sin interés extra: 2-3 cuotas 1,99 %; 4-6 cuotas 3,49 %; 7-12 cuotas 6,99 % (+ IVA). Reembolso $202 + IVA. Sin costo de inscripción ni mantención. Tarifa comercial sobre $50 millones/mes. | 1 o 3 días hábiles | [?] No hallé requisitos de inscripción (persona natural vs empresa) en fuentes accesibles; confirmar en flow.cl | https://web.flow.cl/es-cl/tarifas/ |
| Mercado Pago (online) | 3,19 % + IVA con dinero al instante; 2,89 % + IVA con espera de 10 días; tarifa de nuevo vendedor 2,59 % + IVA y 2,29 % + IVA respectivamente (resumen de búsqueda de la página de ayuda). Cuotas sin interés extra (3 cuotas 1,99 %, 9 cuotas 4,99 %, 12 cuotas 6,99 %). | Instante o 10 días | [?] Cuenta Mercado Pago; requisitos de identidad no verificados | https://www.mercadopago.cl/ayuda/26244 y https://www.mercadopago.cl/developers/es/docs/shopify/integration-configuration/checkout-pro |
| Webpay (Transbank) | App oficial gratuita publicada el 06-10-2025, pero solo comercios en fase piloto de Transbank pueden activarla. Comisión no publicada en la app. | [?] | [?] Contrato con Transbank; solo piloto | https://apps.shopify.com/webpay |
| Khipu (transferencia) | Disponible vía app de CartDNA; sin reembolso recurrente ni one-click. Comisión no hallada. [V] Flow ofrece transferencia Khipu/Etpay a 0,99 % + $100. | [?] | [?] | https://cartdna.com/es-mx/shopify-payment-methods/khipu |
| Getnet / otras | No investigado a fondo; sin dato verificado de integración Shopify. | | | |
| Cifras de blogs (solo orientativas) | Pago Fácil 0,6 % débito / 1,6 % crédito; Webpay típico 2,95-3,5 % + IVA crédito y 1,29-1,8 % débito. | | | https://www.guiadesoftware.com/blog/mejor-pasarela-pago-chile (no oficial, verificar) |

- [I] Para partir sin trámite con Transbank, Flow o Mercado Pago son las opciones realistas: ambos cobran alrededor de 2,9-3,2 % + IVA. Con IVA, 2,89 % + 19 % = 3,44 % efectivo (cálculo mío).
- [I] Persona natural vs empresa: Dropi y el SII exigen formalización para venta habitual (inicio de actividades). Esto condiciona la emisión de boleta y probablemente la cuenta de pasarela; confirmar con cada una.

## Paso 3. Pago contra entrega en Shopify

- [V] Configuración nativa: Ajustes > Pagos > Métodos de pago manuales > Agregar método de pago manual > Pago contra entrega; se pueden agregar instrucciones, que el cliente ve al confirmar. Fuente (guía en español, no oficial de Shopify): https://encolombia.com/economia/empresas/transporte-mercancias-emprendimiento/pago-contraentrega-en-tu-tienda-online/ [I] confirmar el nombre exacto del menú en tu admin.
- Apps de formulario COD (precios en US$, tomados de las fichas de apps.shopify.com vía búsqueda):
  - Releasit COD Form & Upsells: gratis hasta 60 pedidos/mes; Premium US$11,49/mes (hasta 420 pedidos); Enterprise US$29,99 (hasta 10.000); Unlimited US$69,99. Incluye validación de dirección, recuperación de carrito, píxeles y Google Sheets. https://apps.shopify.com/releasit-cod-order-form
  - EasySell COD Form: gratis hasta 60 pedidos/mes; Pro US$9,95 (440 pedidos); Advanced US$24,95 (10.000); Unlimited US$59,95. SMS/WhatsApp se cobran aparte. https://apps.shopify.com/easy-order-form
- [I] Con menos de 60 pedidos al mes, costo de formulario = US$0.
- [I] Dropify (paso 4) trae un checkout COD de un paso, así que quizá no se necesite app de formulario adicional; evaluar cuál convierte mejor.

## Paso 4. Conectar Shopify con Dropi Chile

- [V] App "Dropify" (gratis; sincroniza pedidos y productos con Dropi; checkout de un paso COD; calificación 3,5/5 con 53 reseñas, 26 % de una estrella). https://apps.shopify.com/dropify-5
- [V] Alerta en comunidad Shopify: usuarios chilenos reportaron "no existe la app de Dropify azul en este momento" y otros que las ventas no se reflejan en Dropi. https://community.shopify.com/t/necesito-enlazar-shopify-con-dropi-chile-pero-no-existe-la-app-de-dropify-azul-en-estos-momento/366243 y https://community.shopify.com/t/las-ventas-de-shopify-no-se-reflejan-en-dropi/293481
- [V] Un resumen indicó que "Dropify PRO" es para Colombia y España y no para Chile; la ficha de Dropify no menciona Chile explícitamente. [?] Antes de migrar, pedir a soporte Dropi Chile confirmación de qué app Shopify usar en Chile. Tutorial de terceros (afiliado): https://www.andreybusiness.com/chile/blog/conectar-dropi-con-shopify-2026-tutorial-completo-con-dropify
- Pasos (de la skill del proyecto y tutoriales; nombres de menú pueden variar): Dropi > Mis Integraciones > Agregar (tipo Shopify) y copiar token; instalar Dropify; pegar token y mismo nombre de tienda; permitir dominio .myshopify.com; vincular productos por ID/SKU; hacer pedido de prueba y verlo en Dropi como pendiente.
- Requisitos de cuenta Dropi: registro gratuito; validación de identidad con foto frontal y foto del documento de identidad, necesaria para retirar de la billetera [V] https://dropi.co/dropshippers/validacion-de-cuenta/ y https://dropi.cl/registrate/
- Cobro del saldo: Dropi indica pago en cuenta bancaria registrada o billetera Dropi 24 horas después de confirmada la entrega; puede haber montos mínimo/máximo de retiro [V] (https://www.dropi.cl/dropshippers/, términos https://dropi.cl/wp-content/uploads/2026/02/V2.0-DEFINITIVO-CONTRATO-DE-TERMINOS-Y-CONDICIONES-DROPSHIPPERS-NOV-2025-1.pdf). Un blog afiliado dice 2 a 7 días hábiles tras la entrega y comisión de 2-5 % [V de blog, no oficial] https://www.andreybusiness.com/blog/dropi-chile-plataforma-dropshipping-operador-2026. [?] Comisión de Dropi Chile: ver tarifario dentro de la cuenta.
- [I] El sitio estático actual (WhatsApp) puede seguir vendiendo mientras se prueba la integración.

## Paso 5. Dominio kuchiwau.cl y correo

- [V] Para un dominio en NIC Chile: crear registro A apuntando a 23.227.38.65 y CNAME de "www" a shops.myshopify.com; luego en Shopify Ajustes > Dominios > Conectar dominio existente; puede tardar hasta 48 h; borrar otros registros A. NIC Chile solo registra, por lo que si no ofrece edición de DNS conviene delegar los DNS a un servicio externo (por ejemplo Cloudflare, [I]). Fuente: https://community.shopify.com/t/dominio-nic-chile-no-lo-puedo-conectar-a-shopify/144004 (comunidad) y https://community.shopify.com/t/configurar-nic-con-shopyfy/193096. [?] Confirmar IP vigente en Ajustes > Dominios de tu admin.
- [I] Como hoy kuchiwau.cl (si ya existe) apunta a GitHub Pages, cambiar DNS corta el sitio actual: migrar solo cuando la tienda Shopify esté lista.
- Correo con dominio:
  - Zoho Mail plan gratuito: hasta 5 usuarios, 1 dominio, 5 GB por usuario, solo acceso web (sin IMAP/POP); disponible solo en algunos centros de datos [V] https://www.zoho.com/mail/custom-domain-email.html y https://www.zoho.com/mail/zohomail-pricing.html. [?] Confirmar disponibilidad en la región de Chile.
  - Google Workspace Business Starter en Chile: CLP 7.700 por usuario/mes plan flexible; CLP 6.500 con plan anual [V, resumen de búsqueda de https://workspace.google.com/pricing.html?hl=es-419; verificar IVA incluido o no].
- [?] Precio de registro/renovación de .cl en NIC Chile: no verificado.

## Paso 6. Boleta electrónica integrada

- Haulmer OpenFactura (app Shopify): gratis la app; emisión automática de boleta y conversión a factura; calificación 2,4/5 con 8 reseñas (una reportó soporte que culpó a la configuración de Shopify). [V] https://apps.shopify.com/openfactura-chile. [?] Costo por documento/plan de Haulmer: consultar https://www.openfactura.cl.
- e-Boletas (conecta directo al SII): gratis 100 documentos de prueba; Básico US$12,99/mes (300 documentos); Pro US$24,99 (1.000); Retail US$39,99 [V vía búsqueda] https://apps.shopify.com/e-boleta
- Bsale (Chile): plan gratis con boletas y notas de crédito, hasta 25 pedidos/mes y 50 productos; Básico US$20/mes sin límites; Estándar US$40 (agrega facturas); Avanzado US$60 [V vía búsqueda; monedas por confirmar] https://apps.shopify.com/bsale ; precios Bsale https://www.bsale.cl/sheet/nuevos-precios
- LibreDTE: no se hallaron datos de integración Shopify ni precio verificados [?].
- [I] Requiere inicio de actividades en el SII y, según el proveedor, certificado/folios. Para COD, la boleta se emite al confirmar la entrega o el despacho; definir con el contador el momento.
- [I] Opción más barata para partir: Bsale gratis (hasta 25 pedidos/mes) u OpenFactura, según su tarifa de documentos.

## Paso 7. Píxel de Meta, CAPI y Google Analytics

- [V] Instalar el canal "Facebook & Instagram" (app oficial de Meta en Shopify). Ruta: Canales de venta > Facebook & Instagram > Configuración > Uso compartido de datos. Niveles: Estándar (solo píxel), Mejorado (píxel + API de conversiones) y Máximo (agrega nombre, ubicación, correo y teléfono). https://help.shopify.com/en/manual/promoting-marketing/analyze-marketing/meta-data-sharing y https://help.shopify.com/en/manual/promoting-marketing/analyze-marketing/meta-pixel
- [I] Elegir Máximo. Con formulario COD o Dropify, revisar en "Probar eventos" de Meta que Purchase no se duplique (la app de formulario tiene su propio píxel). El canal oficial es gratuito [?] confirmar en la ficha.
- Google Analytics 4: [?] no verificado con fuente en esta ronda; [I] se conecta con el canal gratuito "Google & YouTube" de Shopify y es gratis.

## Paso 8. Recomendación: secuencia mínima, COD primero

Secuencia [I]:
1. Cuenta Dropi Chile validada (foto y documento) y cuenta bancaria vinculada; consultar tarifario interno y confirmar app Shopify oficial para Chile. Costo: US$0.
2. Shopify Basic (prueba 3 días, luego US$1/mes por 3 meses); tema gratuito, páginas legales (despacho, cambios, retracto, contacto), método manual "Pago contra entrega" y/o formulario COD gratis (Releasit/EasySell hasta 60 pedidos/mes) o el de Dropify.
3. Conectar Dropify, hacer 2-3 pedidos de prueba y ver que lleguen a Dropi.
4. Instalar canal Facebook & Instagram en nivel Máximo y probar eventos.
5. Boleta: Bsale gratis u OpenFactura, previo inicio de actividades.
6. Dominio: conectar kuchiwau.cl solo al final, cuando la tienda esté lista; correo en Zoho gratis.
7. Segunda fase (tarjeta): agregar Flow (2,89 % + IVA, abono a 3 días, más transferencia 0,99 % + $100) o Mercado Pago; sumar comisión de Shopify (2 % en Basic). Webpay solo si Transbank te acepta en piloto.

Costo mensual estimado (US$; tipo de cambio no verificado, no convertí):
- Fase COD, primeros 3 meses: Shopify US$1/mes + apps US$0 + correo US$0 = ~US$1/mes más dominio [?].
- Fase COD desde el mes 4: Shopify Basic US$25/mes (US$19 pagando anual) + apps gratis = ~US$19-25/mes. Si el volumen supera 60 pedidos/mes: sumar US$9,95-11,49 de formulario.
- Boleta: US$0 (Bsale gratis, hasta 25 pedidos/mes) a US$12,99-20/mes.
- Con tarjeta: sin costo fijo adicional, pero ~3,4 % efectivo (Flow 2,89 % + IVA) + 2 % Shopify = ~5,4 % por venta con tarjeta [I, cálculo mío].
- Variable en COD: comisión Dropi [?] y 2 % Shopify si aplica al método manual [?].
- Total fijo orientativo en régimen: ~US$25-50/mes según formulario y boleta, más Google Workspace CLP 6.500-7.700/usuario si se prefiere a Zoho.

## Pendientes humanos (no ejecutados)
Crear cuentas (Shopify, Dropi, pasarela, Zoho), contratar apps, cambiar DNS y gasto de anuncios requieren tu aprobación; este documento solo propone.
