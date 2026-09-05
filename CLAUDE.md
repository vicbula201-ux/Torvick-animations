# Generador de escenas animadas — estilo pizarra

App web de archivos sueltos. Sin build, sin bundler, sin dependencias más
allá de React UMD y Babel standalone desde CDN.

**Cómo se abre.** Hay que servir la carpeta; el doble clic no alcanza:

```
npx --yes http-server -p 8080     # o:  python3 -m http.server 8080
```

y entrar a `http://localhost:8080`. No es una decisión de diseño sino un
límite del navegador: `primitivas.jsx` y `app.jsx` se cargan con
`type="text/babel"`, y Babel los pide por XHR, petición que todos los
navegadores bloquean cuando la página se abrió con `file://`. `index.html`
detecta ese caso y muestra las instrucciones en pantalla en vez de quedarse
en negro. La única forma de que el doble clic funcionara sería meter todo el
JSX dentro de `index.html`, lo que rompe la separación en cuatro archivos.

```
index.html        estructura, fuentes, React UMD, Babel standalone
motor.js          reloj de autor, Easing, animate, interpolate, clamp,
                  useComposition, Shot, Stage
primitivas.jsx    window.M (helpers de movimiento) + window.P (piezas SVG)
app.jsx           UI, llamada al modelo, transpilación, montaje, ajuste
prueba-piezas.html  página de verificación: motor + las 21 piezas en cuadrícula
```

---

## Paleta cerrada — cinco colores, ninguno más

```js
P.C.INK = '#14110F'  // negro del trazo, todo contorno
P.C.YEL = '#FFD400'  // énfasis, resaltado, lo deseable
P.C.RED = '#E03A2F'  // error, mito, fallo, lo que se descarta
P.C.GRN = '#16A06A'  // solución, progreso, red encendida
P.C.GRY = '#C9C3B8'  // apagado, inactivo, secundario
```

El lienzo siempre es blanco `#ffffff`. La UI de la app es oscura
(`#171614` fondo, `#201F1C` paneles, `#3A362F` bordes) y no comparte
paleta con el lienzo.

## Tipografía

| Familia | Uso |
|---|---|
| Archivo Black | números y glifos de impacto dentro de las piezas |
| Barlow Semi Condensed (500/600/700) | rótulos y toda la UI |
| Courier Prime | código y detalles monoespaciados |

---

## Los cinco helpers de `M`

```js
M.pop(T, cuando, dur = 0.42)          // -> { opacity, scale }  entrada con rebote
M.slide(T, cuando, desdeX, dur = 0.4) // -> { opacity, x }      entra desde un borde
M.draw(T, cuando, dur = 0.5)          // -> 0..1  para strokeDashoffset
M.life(T, periodo = 3.2, amp = 8, fase = 0) // -> oscilación continua e infinita
M.vibra(T, hz = 44, amp = 4)          // -> temblor: lo que falla, lo roto
```

Las firmas son contrato: el prompt de sistema las referencia por nombre.

## Las piezas de `P`

`Cerebro` `Figura` `Escritorio` `Corazon` `Pesa` `Basurita` `Rotulo` `Nube`
`Parlante` `Tacha` `Visto` `Telefono` `Caballo` `Gallina` `Risa` `Flecha`
`Medidor` `Meta` `Reloj` `Bombillo` `Trazo`

Estilo obligatorio de cada pieza: trazo `#14110F` de 11 a 19 px, relleno
`#ffffff` en las formas cerradas (nunca transparente), `strokeLinecap` y
`strokeLinejoin` en `round`, prop `s` de escala con `viewBox` fijo, y
`style={{ display:'block', overflow:'visible' }}`.

`P.Rotulo` es el único texto permitido en el lienzo: 2 a 4 palabras,
máximo dos por escena. Nunca poner la frase del guion en pantalla.

## Utilidades del motor

```js
clamp(v, min, max)
interpolate([tA, tB], [vA, vB], ease)     // -> (T) => valor
animate({ from, to, start, end, ease })   // -> (T) => valor
```

`animate` devuelve `from` antes de `start` y `to` después de `end`.
Nunca extrapola.

Easing: `linear`, `easeInQuad`, `easeOutQuad`, `easeInOutQuad`,
`easeInCubic`, `easeOutCubic`, `easeInOutCubic`, `easeOutQuart`,
`easeInOutQuart`, `easeOutExpo`, `easeInOutSine`, `easeOutBack`,
`easeOutElastic`.

---

## Las dos reglas de oro

1. **Nada aparece de golpe.** Todo entra con `M.pop` (rebote) o
   `M.slide` (desde el borde).
2. **Nada se queda inmóvil.** Todo lo que permanece en pantalla respira
   con `M.life`.

## La regla de `f(fracción)`

Toda escena empieza así:

```js
function Escena({ T, at, dur }) {
  const f = (v) => at + dur * v;
  const t = clamp((T - at) / dur, 0, 1);
```

Todos los tiempos se escriben con `f(fracción)`, con la fracción entre 0 y 1.
Está prohibido escribir segundos sueltos (`0.5`, `2`, `at + 3`) dentro de
`animate()`, `M.pop()` o `M.slide()`.

```js
M.pop(T, f(0.1), 0.4)      // correcto
M.pop(T, at + 1.2, 0.4)    // prohibido
```

La única excepción es la regla del primer fotograma: el elemento principal
usa `M.pop(T, at - 0.6, 0.5)` para que ya esté en pantalla en `T = at`.

Si esto se rompe, la escena deja de reescalarse: al alargarla, la
coreografía se queda atascada en su duración original y el resto del tiempo
queda muerto. Por eso la regla aparece dos veces en el prompt de sistema,
una al inicio y otra al cierre como auto-revisión. **No suavizarla.**

## Confinamiento del lienzo

El contenedor del escenario (`.motor-marco`) lleva `position: relative` y
`aspect-ratio: 16/9`. Si se le saca el `position: relative`, el contenido
en `position: absolute` escapa y se monta sobre la UI, dejando los botones
sin poder clickear.

---

## NO HACER

- No usar CSS `@keyframes`, `animation:` ni `transition:` para la animación
  de la escena. Todo se calcula desde `T`.
- No usar librerías de animación: ni GSAP, ni Framer Motion, ni Lottie,
  ni anime.js.
- No inventar colores fuera de la paleta de cinco.
- No poner la frase del guion como texto en pantalla.
- No apilar los elementos verticalmente: el formato es 16:9 horizontal
  (sujeto a la izquierda x 100-620, transición al centro x 800-1200,
  resultado a la derecha x 1300-1800).
- No usar degradados, sombras internas, glassmorphism ni estética futurista.
- No usar emoji en el lienzo.
- No tapar piezas con rectángulos opacos para "recortarlas": eso borra el
  trazo de abajo.
- No agregar un bundler, ni TypeScript, ni un paso de compilación.

---

## Cómo se itera

El campo "¿Algo no te gustó?" manda una conversación de tres mensajes:
el pedido original como turno del usuario, **el código actual como turno
del asistente**, y el ajuste como último turno. Mandar el código como turno
del asistente es lo que hace que el modelo corrija en vez de rehacer.
No reemplazarlo por "acá está el código: ..." dentro del mensaje del usuario.

## Verificación

`prueba-piezas.html` renderiza el motor (un cuadrado que cruza el lienzo en
loop) y las 21 piezas en cuadrícula, cada una con su nombre. Revisar a ojo:
ningún trazo cortado en el borde de su `viewBox`, ninguna forma cerrada con
interior transparente, el caballo se lee como caballo y la gallina como
gallina, `P.Cerebro` con `on` en 0, 0.5 y 1 da tres estados distintos, y
`P.Medidor` cambia de color solo al variar `p`.
