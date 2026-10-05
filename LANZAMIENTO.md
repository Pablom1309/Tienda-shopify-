# Kuchiwau — guía de lanzamiento paso a paso (dueño)

Actualizada 2026-10-04. Cada paso dice **qué**, **dónde**, **cuánto** y **cuánto demora**. Marca: ✅ hecho · ⬜ pendiente.
Detalle y fuentes: `investigacion/lanzamiento-legal.md`, `investigacion/lanzamiento-pagos-tienda.md`, `investigacion/lanzamiento-instagram-meta.md`.
UTM octubre 2026 = **$72.151** ([SII](https://www.sii.cl/valores_y_fechas/utm/utm2026.htm)). Todo lo que diga "confirmar" no está verificado en fuente oficial.

> Regla: yo (el orquestador) preparo textos, imágenes, planillas y configuraciones; **tú** creas cuentas, pagas y firmas. Nada se publica ni se paga sin ti.

---

## Fase 0 — Reservar el nombre (día 1, ~$10.000)
| # | Paso | Dónde | Costo | Plazo |
|---|---|---|---|---|
| 0.1 ⬜ | Buscar "Kuchiwau" (y parecidos: Kuchiguau, Cuchiwau) en marcas, clases 35, 18, 21, 28 | [INAPI búsqueda](https://www.inapi.cl/marcas) | $0 | 15 min |
| 0.2 ⬜ | Registrar **kuchiwau.cl** (con Clave Única o RUT) | [nic.cl](https://www.nic.cl) | $9.990/año exento (tarifa 2023, confirmar) | minutos |
| 0.3 ⬜ | Crear correo de la marca (p. ej. hola@kuchiwau.cl) | Zoho Mail gratis (5 usuarios) o Google Workspace ~$6.500/mes | $0 | 30 min |
| 0.4 ⬜ | Reservar **@kuchiwau** en Instagram y TikTok (alternativas: @kuchiwau.cl, @kuchiwau_chile) usando ese correo | apps | $0 | 10 min |

## Fase 1 — Formalizar el negocio (semana 1, $0)
Recomendación: **partir como persona natural con inicio de actividades** ($0, todo en línea) y pasar a **SpA** (también $0 en [Tu Empresa en un Día](https://www.registrodeempresasysociedades.cl)) cuando haya ventas sostenidas o quieras separar patrimonio y abrir cuenta empresa. Valídalo con un contador.

| # | Paso | Dónde | Costo |
|---|---|---|---|
| 1.1 ⬜ | **Inicio de actividades** en 1.ª categoría, giro **479100** (venta al por menor por internet; confirmar código en el formulario) | [sii.cl](https://www.sii.cl/preguntas_frecuentes/rut_inicio_actividades/001_105_3793.htm) con Clave Tributaria | $0 |
| 1.2 ⬜ | Elegir régimen **Pro Pyme** (para partir suele convenir el **transparente 14 D N°8**: el impuesto lo pagas en tu global complementario) | mismo trámite | $0 |
| 1.3 ⬜ | Habilitar **boleta electrónica gratuita** del SII (y factura, para recibir crédito de Dropi/proveedor) | [SII boleta](https://www.sii.cl/servicios_online/3532-3810.html) | $0 |
| 1.4 ⬜ | Consultar **patente municipal** en tu comuna (domicilio tributario). Mínimo 1 UTM/año = **$72.151** si la exigen; preguntar por microempresa familiar | municipalidad | 0–$72.151 |
| 1.5 ⬜ | Cuenta bancaria separada para el negocio (persona natural: cuenta vista/corriente a tu nombre; SpA: [BancoEstado Cuenta Pyme](https://empresas.bancoestado.cl/imagenes/_pequenas-empresas/productos/cuentas/cuenta-pyme.asp)) | banco | $0 apertura |
| 1.6 ⬜ | Declarar **F29 cada mes** (aunque sea sin movimiento) | sii.cl | $0 |
| 1.7 ⬜ | Enviarme: razón social (tu nombre si es persona natural), RUT, dirección comercial, correo → los pongo en la tienda (lo exige la Ley del Consumidor) | aquí | $0 |

## Fase 2 — Registrar la marca (semana 1–2)
| # | Paso | Costo |
|---|---|---|
| 2.1 ⬜ | Solicitud en línea en [INAPI](https://www.inapi.cl/preguntas-frecuentes/marcas), **clase 35** primero (venta en línea de productos para mascotas) | 1 UTM = $72.151 al presentar |
| 2.2 ⬜ | Esperar examen + 30 días hábiles de oposición | — |
| 2.3 ⬜ | Pagar registro (60 días hábiles de plazo) + publicación Diario Oficial | 2 UTM = $144.302 + publicación |
| 2.4 ⬜ | Después, con ventas: clases 18 (correas/arneses), 21 (cepillos, bebederos), 28 (juguetes) | 3 UTM c/u = $216.453 |
Vigencia 10 años; renovación 6 UTM.

## Fase 3 — Proveedores y calidad (semana 1–2, en paralelo)
| # | Paso | Dónde |
|---|---|---|
| 3.1 ⬜ | Crear cuenta **Dropi Chile** y validarla (documento + foto) | [dropi.co/cl](https://dropi.co/cl) |
| 3.2 ⬜ | Verificar proveedores de los 3 primeros kits con `investigacion/guia-verificacion-dropi.md` → mandarme capturas | Dropi |
| 3.3 ⬜ | Preguntar a soporte Dropi (lista en `investigacion/dropi-facturacion.md`): comisión, flete de devolución, quién factura el flete, retiro | Dropi |
| 3.4 ⬜ | Pedir **muestras** y calificarlas (≥ 4/5) | Dropi |
| 3.5 ⬜ | Fotos y videos reales con el celular (luz natural, escala con la mano) → me los mandas | tú |

## Fase 4 — Tienda y métodos de pago (semana 2–3)
**Camino recomendado:** contra entrega primero, tarjeta después.

| # | Paso | Dónde | Costo |
|---|---|---|---|
| 4.1 ⬜ | Abrir **Shopify Basic** (3 días gratis, luego US$1/mes x 3 meses) | [shopify.com/cl/precios](https://www.shopify.com/cl/precios) | luego US$25/mes (US$19 anual) |
| 4.2 ⬜ | Importar `shopify/productos.csv` (yo lo dejo al día) | Shopify → Productos → Importar | — |
| 4.3 ⬜ | Activar **pago contra entrega** (método manual) + formulario COD **Releasit** o **EasySell** (gratis hasta 60 pedidos/mes) | Shopify → Pagos; App Store | $0 al inicio |
| 4.4 ⬜ | Conectar **Dropi** (preguntar a Dropi Chile qué app usar; Dropify no menciona Chile) | Dropi / App Store | $0 |
| 4.5 ⬜ | Boleta automática: **e-Boletas** (gratis hasta 100 docs) o **Bsale** (gratis hasta 25 pedidos/mes) | App Store | $0 al inicio |
| 4.6 ⬜ | Apuntar **kuchiwau.cl** a Shopify: registro A → 23.227.38.65 y CNAME www → shops.myshopify.com (yo te guío; corta el sitio de GitHub Pages) | NIC Chile / DNS | $0 |
| 4.7 ⬜ | Más adelante, tarjeta/débito: **Flow** (2,89 % + IVA, abono día 3) o **Mercado Pago** (2,29–3,19 % + IVA). Shopify cobra además 2 % por pasarela externa (Shopify Payments no existe en Chile) | flow.cl / mercadopago.cl | ~5,4 % por venta con tarjeta |
| 4.8 ⬜ | Preguntar a soporte Shopify si el 2 % aplica al pago contra entrega manual | Shopify | — |

## Fase 5 — Instagram, Facebook y WhatsApp (semana 2)
Todo el texto listo en `investigacion/lanzamiento-instagram-meta.md` (bios, plantillas, plan de 14 días; la grilla de 9 quedó descartada).

| # | Paso |
|---|---|
| 5.1 ⬜ | Instagram → cuenta **Empresa**, categoría "Tienda de artículos para mascotas", nombre "Kuchiwau \| Kits para mascotas", foto = isotipo (`marca/isotipo.svg`), bio versión B, enlace a la tienda |
| 5.2 ⬜ | Seguridad: correo de la marca, **verificación en 2 pasos con app**, no comprar seguidores |
| 5.3 ⬜ | **WhatsApp Business** con +56979814797: perfil, catálogo, mensaje de bienvenida y ausencia, respuestas rápidas (plantillas en el archivo) |
| 5.4 ⬜ | Página de Facebook + **portfolio comercial** en Meta Business Suite; vincular Instagram y WhatsApp |
| 5.5 ⬜ | Verificar dominio kuchiwau.cl en Meta (requiere fase 0.2) |
| 5.6 ⬜ | Publicar las primeras piezas del calendario orgánico de 30 días (la grilla de 9 fue descartada por el dueño el 2026-10-05) antes de cualquier anuncio (Instagram Shopping no está disponible en Chile: se vende por enlace y WhatsApp) |

## Fase 6 — Lanzar anuncios (cuando 3.x y 4.x estén listos)
| # | Paso | Costo |
|---|---|---|
| 6.1 ⬜ | Conectar canal **Facebook & Instagram** en Shopify (píxel + API de conversiones, nivel "Máximo") | $0 |
| 6.2 ⬜ | Cuenta publicitaria en CLP, zona horaria Chile, **límite de gasto** de la cuenta | $0 |
| 6.3 ⬜ | Aprobar presupuesto de prueba: 2 kits verificados, plan en `datos/plan_ads.json` | ~$178.000 total |
| 6.4 ⬜ | Confirmar cada pedido por WhatsApp antes de despachar; revisar resultados semanalmente conmigo (`datos/resultados/`) | — |

---

## Costo de arranque (sin anuncios)
| Ítem | Monto |
|---|---|
| Dominio kuchiwau.cl | $9.990/año |
| Marca INAPI clase 35 | 3 UTM ≈ $216.453 + publicación |
| Patente (si la exigen) | ≥ $72.151/año |
| Shopify primeros 3 meses | ~US$3 en total; luego US$25/mes según shopify.com/cl/precios (por confirmar al contratar; `datos/finanzas.json` usa US$39 como supuesto conservador) |
| SII, boleta, cuenta Dropi, Instagram, WhatsApp, Zoho | $0 |
| **Total aproximado** | **~$230.000–$300.000** + anuncios |

## Orden sugerido de esta semana
1. INAPI búsqueda + dominio + correo + @kuchiwau (Fase 0, una tarde).
2. Inicio de actividades en el SII (Fase 1).
3. Cuenta Dropi y capturas de los 3 kits (Fase 3).
4. Instagram/WhatsApp Business con los textos listos (Fase 5).
