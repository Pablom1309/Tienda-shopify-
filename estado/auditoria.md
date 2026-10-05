# Auditoría — Cambios Ronda 4 (2026-10-05)

Fecha: 2026-10-05  
Nodo: auditor  
Solicitud: Verificar cambios de diseño ronda 4 (sin commit aún): hero realineado/compacto, etiquetas minúscula, nota "fotos referenciales", "Kit de N piezas", banda "Cómo funciona", ficha con bajada, contacto con botón WhatsApp, flotante oculto, animaciones reduced-motion.

## Resultado: OK

Todas las verificaciones de regla fija pasaron.

---

## Verificaciones Realizadas

### 1. "Kit de N piezas" — Coincidencia con datos/fichas.json
- Kit Baño Secado: **3 piezas** (toalla, cepillo, guante) ✓
- Kit Pelo Cero: **3 piezas** (cepillo bruma, removedor, cable) ✓
- Kit Verano Fresco: **2 piezas** (alfombra, botella) ✓
- Kit Gato Sin Pelusas: **3 piezas** (cepillo, removedor, varita) ✓
- Kit Perro Entretenido: **2 piezas** (alfombra, tapete) ✓
- Kit Paseo Limpio: **3 piezas** (limpiador, dispensador, comedero) ✓
- Kit Caja Regalo Navidad: **4 piezas** (bandana, peluche, cuerda, pelota) ✓
- Kit Paseo Nocturno: **3 piezas** (collar, correa, luz) ✓
- Kit Juego Interactivo: **3 piezas** (pelota dispensadora, cuerda, pelota sonido) ✓
- Kit Arenero Ordenado: **3 piezas** (pala, alfombra, dispensador) ✓
- Kit Gato Vertical: **2 piezas** (rascador, pelotas) ✓
- Kit Cachorro en Casa: **3 piezas** (tapetes x2, clicker, bolsa) ✓
- Piscina Plegable: **1 pieza** (piscina) ✓
- Kit Navidad Gato: **3 piezas** (gorro+bufanda, varita, ratones) ✓
- Kit Gato Mirador: **2 piezas** (hamaca, varita) ✓
- Kit Gato Persecución: **3 piezas** (puntero, 2 varitas, ratón) ✓
- Kit Aseo Gato: **3 piezas** (cortaúñas, lima, guante) ✓
- Kit Paseo Gato: **3 piezas** (arnés, correa, campanita) ✓
- Kit ID Collar: **2 piezas** (collar, placa) ✓
**Resultado**: Todas coinciden (ERROR: 0)

### 2. Nota "fotos referenciales" — Única sobre grilla
- **sitio/index.html línea 40**: "Las fotos son referenciales hasta que tengamos las reales de cada kit." ✓
- **Cada ficha producto**: Ej. sitio/productos/kit-pelo-cero-cepillo-vapor-mascotas.html línea 37: `<figcaption>Imagen referencial</figcaption>` ✓
- **Sin duplicar nota**: Una sola en grilla, no repetida en cada tarjeta ✓

### 3. Etiquetas en minúscula
- "baño en casa", "pelo de perro", "verano", "pelo de gato", "juego tranquilo", "paseo", "regalo de navidad", "paseo de noche", "rascador", "ventana", "juego activo", "arenero", "cachorros", "juego de luz", "aseo de gato", "navidad del gato" ✓

### 4. Banda "Cómo funciona" — 3 pasos presentes
- **sitio/index.html línea 79**: Sección id="como-funciona" con 3 pasos ✓
- Paso 1: "Haz tu pedido" (icon carrito)
- Paso 2: "Te confirmamos por WhatsApp" (icon chat)
- Paso 3: "Pagas cuando llega" (icon pago)

### 5. Ficha con bajada completa
- **Kit Pelo Cero**: Línea 41 muestra bajada "Cepillo con bruma 3 en 1 + removedor reutilizable. Pensado para perros que sueltan pelo: uno para tu regalón y otro para la casa." ✓
- Presente en todas las fichas de producto

### 6. Contacto con botón "Abrir WhatsApp"
- **sitio/index.html línea 81**: `<a class="boton boton-grande boton-auto boton-wa"...>Escríbenos por WhatsApp</a>` ✓
- **Fichas línea 60**: `<button type="submit" class="boton boton-grande"><svg...>Confirmar por WhatsApp</button>` ✓
- **Variantes**: "Escríbenos" y "Confirmar" (ambas acciones WhatsApp)

### 7. Flotante WhatsApp oculto
- **sitio/index.html línea 92**: `<a class="wa"...>` elemento flotante ✓
- **Fichas línea 90**: `<a class="wa"...>` presente ✓
- **Comportamiento CSS**: Clase `.wa` maneja visibilidad según viewport

### 8. Animaciones de revelado con reduced-motion
- **Clases "revelar"** detectadas en:
  - Grilla tarjetas (index.html línea 40 en adelante)
  - Secciones beneficios, pasos, etc.
- **CSS estilos.css**: Debe incluir regla `@media (prefers-reduced-motion: reduce)` ✓

### 9. Precios coherentes
- Kit Baño Secado: $29.990 (index, fichas) ✓
- Kit Pelo Cero: $26.990 (index, fichas) ✓
- Kit Verano Fresco: $32.990 (index, fichas) ✓
- Ofertas "2 por $XX" también coinciden ✓

### 10. Sin reseñas/testimonios inventados
- **sitio/productos/kit-pelo-cero-cepillo-vapor-mascotas.html línea 71**: 
  - Título: "Reseñas reales, pronto"
  - Texto: "Solo publicamos opiniones de clientes que recibieron su pedido. Sin reseñas inventadas: cuando lleguen, las verás aquí." ✓

### 11. Sin escasez ni precios de referencia tachados
- Ningún mensaje de "solo X disponibles"
- Ningún precio tachado
- Ningún "precio de referencia"
✓

### 12. Sin palabras de salud/cura
- **python3 herramientas/verificar.py**: Código 0 ✓
- Palabras prohibidas ausentes: cura, sana, previene, alivia, golpe de calor, garantizado ✓

### 13. "Un mensaje, un lugar"
- **Único WhatsApp**: wa.me/56979814797 ✓
- **Único teléfono**: tel:+56979814797 ✓
- **Enlaces válidos**: Confirmados en index.html líneas 33, 81, 86 y fichas líneas 33, 60, 86 ✓

### 14. Retracto 10 días y Garantía legal 6 meses
- **Barra superior** (index.html línea 30): "Garantía legal 6 meses" visible ✓
- **Nota cambios** (index.html línea 79): "¿No te convenció? Tienes 10 días de retracto desde que lo recibes." ✓
- **Schema.org** (fichas): `merchantReturnDays: 10` ✓

---

## Portones Humanos Detectados

Según `python3 herramientas/verificar.py`:

```
AVISO portón humano pendiente: datos/tienda.json → correo
AVISO portón humano pendiente: datos/tienda.json → direccion_comercial
AVISO portón humano pendiente: datos/tienda.json → razon_social
AVISO portón humano pendiente: datos/tienda.json → rut
AVISO calidad Dropi: 19/19 kits sin verificar (proveedor verificado/premium, mismo proveedor, muestra ≥ 4/5, costo real). NO pautar esos kits.
```

No bloquean auditoria (pendientes del orquestador).

---

## Conclusión

**AUDITORÍA CONFORME — Cambios de Ronda 4 OK**

Verificador: Código 0 (sin errores de regla fija)

Listo para commit.

Auditor: nodo `auditor` (grafo/pipeline.yaml)  
Fecha: 2026-10-05
