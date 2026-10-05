# Auditoría Ronda 10 (2026-10-05)

Auditoría de ronda 10: diseño sitio/ con color de marca azul #24316B protagonista (hero, botones, títulos), #141B3F en barra superior y pie, mandarina apagada #E8935F/#A8481A en detalles; tarjetas nuevas con doble marco, categoría, nombre, línea de beneficio de fichas.json, "N piezas", precio y botón "Ver kit"; sección "Elige por mascota" con tiles Perros/Gatos ("11 kits"/"9 kits").

## Resultado: ERROR

Auditoría requiere corrección antes de publicación. Se encontraron 2 errores críticos.

## Errores detectados

### 1. Líneas de beneficio no coinciden literalmente con fichas.json
**Archivo:** sitio/index.html, líneas 44-80  
**Severidad:** CRÍTICA  
**Requisito:** "la línea de beneficio de cada tarjeta existe literalmente en fichas.json (no inventada)"

**Discrepancias encontradas:**

| Kit | HTML | fichas.json |
|-----|------|-------------|
| Kit Baño y Secado | "Sin shampoo, para que uses el que ya tienes" | "Toalla de microfibra" |
| Kit Pelo Cero | "Atrapa el pelo muerto" | "Atrapa el pelo muerto" ✓ |
| Kit Verano Fresco | "Fresca sin enchufe" | "Fresca sin enchufe" ✓ |
| Kit Gato Sin Pelusas | "Cepillar, limpiar la casa y jugar en un solo kit" | "Saca el pelo muerto" |
| Kit Perro Entretenido | "Dos formas de entretener a tu regalón en casa" | "Busca sus premios" |
| Kit Paseo Limpio | "Todo lo del paseo en un solo kit" | "Patas limpias en la puerta" |
| Kit Caja Regalo Navidad | "Cuatro cosas para que tu perro también abra su regalo" | "Regalo en un solo paquete" |
| Kit Paseo Nocturno | "Para que lo ubiques mejor cuando oscurece" | "Más visible de noche" |
| Kit Gato Vertical | "Pensado para departamentos chicos" | "Va en la pared" |
| Kit Gato Mirador | "Se pega al vidrio" | "Se pega al vidrio" ✓ |
| Kit Juego Interactivo | "Juego activo en el patio o el parque" | "Pelota dispensadora" |
| Kit Arenero Ordenado | "Lo básico para mantener ordenado el rincón de tu gato" | "Alfombra atrapa arena" |
| Kit Cachorro en Casa | "Dos tapetes lavables" | "Dos tapetes lavables" ✓ |
| Piscina Plegable | "La llenas, la usan y la guardas doblada" | "120x30 cm" |
| Kit Navidad Gato | "Un regalo para que tu regalón también tenga su noche" | "Gorro y bufanda" |
| Kit Gato Persecución | "Para jugar juntos en el living" | "Puntero recargable" |
| Kit Aseo Gato | "Tres accesorios para la rutina de tu regalón" | "Cortaúñas con protector" |
| Kit Paseo Gato | "Para paseos cortos y supervisados" | "Arnés ajustable" |
| Kit Identificación | "Para perros y gatos" | "Placa grabada" |

**Resultado:** 4 de 19 coincidencias exactas (21% cumplimiento).

### 2. Color de barra superior y pie incorrecto
**Archivo:** sitio/estilos.css, línea 206 (.pie) y línea 31 (.anuncio)  
**Severidad:** CRÍTICA  
**Requisito:** #141B3F en barra superior y pie  
**Actual:** var(--texto) = #1C2033

**Detalle:**
```css
.anuncio { background: var(--texto); /* #1C2033, no #141B3F */ }
.pie { background: var(--texto); /* #1C2033, no #141B3F */ }
```

Impacto: Paleta de marca no implementada correctamente; colores no coinciden con especificación de ronda 10.

## Verificaciones CORRECTAS

1. **Conteos por mascota**: 11 kits perros (10 + 1 ambos) ✓, 9 kits gatos (8 + 1 ambos) ✓
2. **Sin palabras de salud/cura**: búsqueda negativa sin hallazgos (false positive en @context schema ignorado) ✓
3. **Retracto y Garantía presentes**: "10 días de retracto" + "Garantía legal 6 meses" en anuncio y nota cambios ✓
4. **Sin "2 por $X"** en tarjetas ✓
5. **Contenido visible sin JS**: todas 19 tarjetas en HTML, no hidden por defecto ✓
6. **Contraste AA**:
   - Texto blanco sobre azul #24316B: 12.16:1 ✓
   - Texto negro sobre mandarina #E8935F: 7.27:1 ✓
   - Texto principal sobre fondo: 14.43:1 ✓
7. **pedido.js dispara Lead**: window.fbq('track', 'Lead', {...}) al abrir WhatsApp ✓
8. **Precios coherentes** en index.html, fichas y shopify/productos.csv ✓
9. **Tarjetas con doble marco, categoría, nombre, "N piezas", precio, botón** ✓
10. **Sección "Elige por mascota"** con tiles Perros/Gatos ✓

## Avisos (Portones humanos, no bloqueadores)

- **tienda.json**: campos null: correo, direccion_comercial, razon_social, rut
- **Dropi**: 19/19 kits sin verificar (requiere staff Dropi antes de pautar)

## Conclusión

**NO APROBAR ronda 10** para producción. Dos errores críticos deben ser corregidos:

1. Actualizar líneas de beneficio en sitio/index.html para coincidir literalmente con primer beneficio en fichas.json
2. Cambiar colores de .anuncio y .pie de var(--texto) (#1C2033) a #141B3F

Una vez corregidos, re-ejecutar auditoría.

---

**Resultado: ERROR — Ronda 10 rechazada**

Auditor: nodo `auditor` (grafo/pipeline.yaml)  
Fecha: 2026-10-05 UTC

### Revisión del orquestador — ronda 10 (2026-10-05)
- ERROR 1 descartado: las 19 líneas de beneficio de las tarjetas existen literalmente en datos/fichas.json (verificado por script; el auditor comparó solo un campo).
- ERROR 2 descartado: `.anuncio` y `.pie` usan `var(--tinta-prof)` = #141B3F en el bloque "Ronda 10" (estilos.css l. 844 y 981), que reemplaza las reglas anteriores.
- Resultado: ronda 10 aprobada.
