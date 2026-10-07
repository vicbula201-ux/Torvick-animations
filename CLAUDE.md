# Generador de escenas animadas — estilo pizarra

App web de archivos sueltos que genera escenas animadas para video a partir
de una frase de guion. Sin bundler, sin npm, sin TypeScript; solo React UMD
y Babel standalone desde CDN.

**Cómo se abre.** Doble clic en `index.html`. Nada más. Hace falta internet
la primera vez, para que bajen React y Babel del CDN.

```
index.html        estructura, fuentes, React UMD, Babel standalone
motor.js          reloj de autor, Easing, animate, interpolate, clamp,
                  useComposition, Shot, Stage
primitivas.jsx    window.M (helpers de movimiento) + window.P (piezas SVG)
app.jsx           UI, llamada al modelo, transpilación, montaje, ajuste
cuerpo.jsx        window.B: cuerpo y máquina para videos de ejercicios
face-pull.jsx     el reel vertical del Face Pull (escenas + guion)
face-pull.html    abre el reel: lienzo 9:16 + guion para grabar la voz
compilar.js       regenera los .js desde los .jsx
prueba-piezas.html  verificación: motor + las 21 piezas + las piezas de B
```

**Los .jsx son la fuente; los .js son generados.** `index.html` carga
`primitivas.js` y `app.js`, no los `.jsx` (y `face-pull.html` carga además
`cuerpo.js` y `face-pull.js`). Si editás un `.jsx`, corré:

```
node compilar.js
```

y commiteá el `.jsx` y su `.js` juntos. **No edites los `.js` a mano**: llevan
una cabecera que lo dice y el próximo `node compilar.js` los pisa.

El rodeo existe por un límite del navegador, no por gusto: un
`<script type="text/babel" src="algo.jsx">` se pide por XHR, y todos los
navegadores bloquean esa petición cuando la página se abrió con `file://`.
Un `<script src="algo.js">` normal sí carga. Por eso tampoco hay que
ponerle `crossorigin` a los tags de React: ese atributo vuelve la petición
CORS y la rompe bajo `file://`.

Babel igual se carga en runtime, porque transpila la escena que devuelve
el modelo en cada generación.

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
un `aspect-ratio` igual al del lienzo (16/9 por defecto). Si se le saca el
`position: relative`, el contenido en `position: absolute` escapa y se
monta sobre la UI, dejando los botones sin poder clickear.

`Stage` acepta `ancho` y `alto` (1920x1080 si no se pasan; 1080x1920 para
video vertical) y `debajo`, una función `({ T, total, seek, playing,
setPlaying }) => elemento` que se dibuja debajo de los controles, fuera del
lienzo. El reel la usa para el guion y para exponer `window.REEL`.

---

## NO HACER

- No usar CSS `@keyframes`, `animation:` ni `transition:` para la animación
  de la escena. Todo se calcula desde `T`.
- No usar librerías de animación: ni GSAP, ni Framer Motion, ni Lottie,
  ni anime.js.
- No inventar colores fuera de la paleta de cinco.
- No poner la frase del guion como texto en pantalla.
- No apilar los elementos verticalmente en las escenas del generador: ese
  formato es 16:9 horizontal (sujeto a la izquierda x 100-620, transición
  al centro x 800-1200, resultado a la derecha x 1300-1800). Los reels de
  ejercicios son la excepción: van en 1080x1920 y ahí la comparación
  mal/bien se apila arriba/abajo.
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

## Videos de ejercicios — reels verticales

`face-pull.html` es el primero. Se abre con doble clic como `index.html`.
A la izquierda corre el reel; a la derecha está el guion: la línea de la
escena actual en grande (para leerla mientras se graba la voz), la lista
de escenas (clic para saltar) y la duración de cada una, editable. Las
duraciones se guardan en el navegador; "Restablecer tiempos" vuelve a las
de `ESCENAS`.

**Calzar el video con la voz grabada:** cambiá la duración de cada escena
hasta que coincida con lo que dura esa frase en tu grabación. Como todas
las escenas usan `f(fracción)`, la coreografía se estira sola. Para que
el cambio quede fijo, pasá los números a `ESCENAS` en `face-pull.jsx`.

**Exportar:** `face-pull.html#render` muestra solo el lienzo a 1080x1920,
sin controles, y deja `window.REEL` (`seek`, `setPlaying`, `total`) para
grabar cuadro por cuadro con un navegador automatizado. Sin eso, grabá
la pantalla con el reel en reproducción.

Código de color en estos videos (misma paleta de cinco):
`YEL` músculo principal, trayectoria, guía · `GRY` músculo secundario,
cable flojo, short · `RED` error (y el trapecio cuando se encogen los
hombros) · `GRN` lo correcto: visto, flechas de corrección.

`cuerpo.jsx` (`window.B`) es reutilizable para otros ejercicios:

```js
B.Espalda   // vista posterior: codo, rot, enc, ret, musc{dp,inf,rm,tra,rom,trapRojo}, piernas
B.Estacion  // vista lateral con polea: p, rot, paso, tension, poleaY, carga, cable, suelta
B.Cuenta    // anillo que se vacía con un número adentro (n, p)
B.FlechaS B.Arco B.Puntos B.Anillo   // overlays SVG que van dentro de children
B.geoEspalda(props) B.geoEstacion(props)  // las mismas coordenadas, sin dibujar
```

`B.Espalda` y `B.Estacion` reciben `children` como función `(g) => <g>…</g>`:
`g` trae las articulaciones (`g.izq.E`, `g.der.H`, `g.Sj`, `g.rueda`…) en
coordenadas del viewBox, así las flechas y guías siguen al brazo.

## Verificación

`prueba-piezas.html` renderiza el motor (un cuadrado que cruza el lienzo en
loop) y las 21 piezas en cuadrícula, cada una con su nombre. Revisar a ojo:
ningún trazo cortado en el borde de su `viewBox`, ninguna forma cerrada con
interior transparente, el caballo se lee como caballo y la gallina como
gallina, `P.Cerebro` con `on` en 0, 0.5 y 1 da tres estados distintos, y
`P.Medidor` cambia de color solo al variar `p`. Abajo están las piezas de
`B`: la espalda en sus estados (codos, rotación, hombros encogidos,
músculos), la estación lateral (cuerda suelta, cable flojo, tenso, tirón
completo) y la cuenta.
