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
cuerpo.jsx        window.B: espalda, estación de polea, overlays SVG
perfil.jsx        B.Perfil: figura de perfil articulada + poses
frente.jsx        B.Frente: figura de frente + poses
equipo.jsx        mancuerna, banco, barra, barra libre con discos, colchoneta, sombra
tor.jsx           window.TOR: Tor, el avatar de la marca (pose de doble bíceps)
novia.jsx         window.NOVIA: la novia de Tor (de frente, y capas para B.Perfil)
muebles.jsx       window.MU: escenografía (farol, cama, sofá, tele, tacho, despertador)
nutricion.jsx     window.N: comida, plato, balanza y dial (videos de nutrición)
marca.jsx         window.MARCA: firma de Torvick (nombre, redes, sello, cierre)
reel.jsx          window.REELS: armazón común de los reels verticales
plantillas.jsx    window.PL: escenas armadas con datos para los videos con Tor
vivo.jsx          window.V: el estilo 2 (cámara viva, parpadeo, efectos, rótulos)
marca/torvick.jpg la foto de Torvick para el cierre del estilo 2
reels.html        abre los reels: lienzo 9:16 + guion + selector de video
face-pull.jsx, sentadilla-sumo.jsx, elevacion-piernas.jsx,
press-banca.jsx, dominadas.jsx   un archivo por video (solo escenas)
silla-extensora.jsx, fondos.jsx, flexiones.jsx, remo-t.jsx,
encogimientos.jsx, jalon.jsx, curl-barra.jsx, fondos-banco.jsx,
pantorrilla.jsx                  reels cortos de ejercicios (formato actual, ~30 s)
proteinas.jsx, hierro.jsx, grasas.jsx, carbohidratos.jsx,
minerales.jsx, objetivos.jsx     reels cortos con Tor (nutrición y temas de entreno)
curl-mancuernas.jsx              primer reel del ESTILO 2 (el formato de ahora en adelante)
triceps-polea.jsx, bulgara.jsx,
abduccion.jsx, plancha.jsx,
hip-thrust.jsx, remo-bajo.jsx,
elevacion-lateral.jsx,
triceps-frances.jsx,
sentadilla-maquina.jsx,
prensa-piernas.jsx, abdominal.jsx,
press-militar.jsx, peso-muerto.jsx,
zancada.jsx, abdominal-polea.jsx,
flexion-pecho.jsx                reels de ejercicios en estilo 2 (con V.escena)
peptidos.jsx, cristiano.jsx,
kane.jsx, lebron.jsx,
marihuana.jsx, creatina.jsx,
porno.jsx                        reels con Tor en estilo 2 (con PL.escena2)
biceps-top3.jsx                  top 3 de bíceps (perfil, estilo 2, ~15 s + acción)
novato-avanzado.jsx,
calistenia-gym.jsx               pantalla dividida: los dos Tors en paralelo
gluteos.jsx                      con la novia de Tor (público femenino)
cerveza.jsx, ex.jsx, gta6.jsx,
vape.jsx, chatarra.jsx           la fórmula del de la marihuana: tema tabú + Tor en un
                                 estado ridículo + cierre de parodia (para compartir)
identidad.jsx/.html  foto de perfil y portadas de destacadas (PNG en identidad/)
tienda/           landing de Entrena con Tor para vender los productos digitales
                  (HTML estático; links de pago y redes en ENLACES, al final del index.html)
ebooks/           los e-books en A4 (HTML -> PDF): ebook.css, 7-errores.html (guía gratis),
                  img/ (láminas de los reels); los pagos van en ebooks/privado/ (fuera de git)
face-pull.html    redirige a reels.html#face-pull
largo.html        videos largos de YouTube (16:9): el video con cortes + capas encima
largo.jsx         window.LARGOS: cámara, texto detrás de la persona, escenas, textos, tarjetas, CTA, sonidos
largo-iconos.jsx  LARGOS.I: íconos de línea de los largos (prueba-largos.html los muestra)
largo-plantillas.jsx  LARGOS.X: escenas armadas con datos para los largos
largos/<id>/      un video largo: plan.jsx + transcripcion.* (+ media/, fuera de git)
largos/perfil.jpg     foto de perfil del botón de suscripción
LARGOS.md         guía de estilo y flujo de los videos largos
compilar.js       regenera los .js desde los .jsx
prueba-piezas.html  verificación: motor + las 21 piezas + las piezas de B
herramientas/     grabar.js (exporta MP4 con música y efectos; --voz dobla), locutor.py
                  (la voz de Torvick: perfil y líneas), audio.py
                  (sintetiza la música y los efectos), imagenes.js (exporta
                  los PNG de identidad.html) y las de los largos: transcribir.py,
                  recortar.py, revisar-largo.js, grabar-largo.js, tramos.py;
                  no son parte de la app
```

**Los .jsx son la fuente; los .js son generados.** `index.html` carga
`primitivas.js` y `app.js`, no los `.jsx` (y `reels.html` carga además
las piezas de `B`, `marca.js`, `reel.js` y un `.js` por video). Si editás
un `.jsx`, corré:

```
node compilar.js                 # todos
node compilar.js dominadas.jsx   # uno solo
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

Todos viven en `reels.html` (doble clic, como `index.html`); arriba hay un
botón por video. A la izquierda corre el reel; a la derecha está el guion:
la línea de la escena actual en grande (para leerla mientras se graba la
voz), la lista de escenas (clic para saltar) y la duración de cada una,
editable. Las duraciones se guardan en el navegador, por video;
"Restablecer tiempos" vuelve a las del archivo.

**Un video = un archivo** que define sus escenas y se registra:

```js
global.REELS.registrar({ id: 'dominadas', titulo: 'Dominadas', escenas: ESCENAS })
// ESCENAS = [{ nombre, dur, C: EscX, vo: 'línea de locución' }, ...]
```

Las ayudas para escribir escenas están en `REELS.ayudas` (`Pos`, `Rot`,
`Camara`, `Recorte`, `sale`, `junta`, `reps`, `Mal`, `Bien`, `sonido`).
`face-pull.jsx` es la implementación de referencia del armazón;
`fondos.jsx` lo es del formato corto. Para sumar un video: crear `nuevo.jsx`,
agregarlo a `FUENTES` en `compilar.js` y un `<script src="nuevo.js">` en
`reels.html`.

**La firma de Torvick va en TODOS los videos, siempre** (pedido del autor):
`reel.jsx` la agrega sola, no hay que hacer nada en cada video y no se
puede apagar. Son dos cosas:

- el **sello** de la esquina superior izquierda (nombre + YouTube,
  Instagram y TikTok) durante todo el video, que se retira al llegar al
  cierre;
- la **escena de cierre** de 3 s: "TORVICK" con resaltador, los tres
  logos animados, `@eltorvick` y "SÍGUEME PARA MÁS".

Los logos están dibujados con la paleta de cinco (YouTube rojo, Instagram
amarillo, TikTok negro con eco rojo). El nombre, la arroba y el número de
`B.Cuenta` son el único texto del lienzo además de `P.Rotulo`.

**Estilo 2 (de ahora en adelante, `estilo: 2` en `REELS.registrar`):** la
misma esencia (lienzo blanco, trazo INK, paleta de cinco, Tor, rótulos, X y
vistos) con más fluidez, inspirada en los reels que el autor tomó de
referencia. Lo que cambia, todo desde `vivo.jsx` y `reel.jsx`:

- **Sin música.** Solo suenan las X (error) y los vistos ("tin"); tampoco
  hay whoosh entre escenas. `grabar.js` ya exporta así (`--con-musica`
  deja además la versión vieja).
- **60 cuadros por segundo** al exportar (`REEL.fps`).
- **Cámara viva** (`V.Camara`): cada escena encadena tomas (plano general
  → primer plano del músculo o del agarre → general) sin cortes, con
  deriva de cámara en mano, temblor cuando sale una X (`golpes`) y golpe
  de zoom en los momentos fuertes (`pulsos`). Los tiempos son fracciones.
- **Tor vivo:** parpadea (`parpadeo` en `B.Frente`, `B.Perfil` y `TOR.Tor`,
  con `V.parpadeo(T)`), sombra en el piso (`V.Sombra`).
- **Efectos:** `V.Brillo` (aros que salen del músculo que trabaja),
  `V.Chispa` (estallido amarillo al llegar arriba), `V.Lineas` (líneas de
  velocidad detrás de lo que se mueve), `V.Gotas` (sudor en los errores).
- **Rótulos** con `V.Rot`: entran deslizando con rebote.
- **Transición** de zoom entre escenas (la que sale crece y se funde, la
  que entra llega desde un poco más cerca), en vez del empuje lateral.
- **Sello de dos filas** (`MARCA.Esquina2`): TORVICK con YouTube,
  Instagram y TikTok, y ENTRENA CON TOR con Instagram y TikTok.
- **Cierre de 3,5 s** (`MARCA.EscMarca2`): Torvick con su foto
  (`marca/torvick.jpg`), las tres redes y @eltorvick; abajo Tor sacando
  bíceps con "ENTRENA / CON TOR" (misma tipografía, sin arroba) e
  Instagram y TikTok; "SÍGUEME PARA MÁS". Los videos con Tor se suben al
  YouTube de Torvick y al Instagram/TikTok de Entrena con Tor.

`curl-mancuernas.jsx` es la referencia del estilo 2. Los videos anteriores
siguen con el estilo 1 (no llevan `estilo`).

Para no escribir la cámara y los efectos a mano en cada escena hay dos
armadores del estilo 2 (los tiempos siguen siendo fracciones):

- **`V.escena({...})`** (ejercicios; `plancha.jsx` es el más simple):
  `fig` `{x, y, s}` y `figura(T, f, t, s)` con el cuerpo (elemento
  principal: entra con pop en `at - 0.6` y respira solo; `vibra` lo hace
  temblar), o `comparar: { cmp, mal, bien }` para las dos franjas mal/bien
  apiladas; `tomas`, `golpes` y `pulsos` como `V.Camara` (cada X suma su
  golpe); `lienzo` (SVG dentro de la cámara), `encima` (elementos fuera de
  la cámara, como `B.Cuenta`), `mal` / `bien` `[{x, y, cuando, s, hasta}]`
  y `r1` / `r2` (rótulos `V.Rot`, con `y` opcional). `V.fase` y `V.ida`
  arman las repeticiones (va, aguanta, vuelve lento).
- **`PL.escena2({...})`** (videos con Tor): lo mismo que `PL.escena` pero
  con cámara viva, Tor que parpadea y rótulos `V.Rot`.

Las tomas se escriben con un `en([x, y])` que pasa coordenadas del cuerpo
a coordenadas del lienzo (`foco`) y un `mira` que dice dónde queda ese
punto en pantalla; en los primeros planos bajá `mira` para que la cabeza
no quede debajo del rótulo de arriba. En `B.Frente`, `sinZapato` en un lado
termina la pierna en el tobillo (el pie de atrás de la búlgara, apoyado en
el banco y fuera de vista). En `B.Perfil`, `cabezaEncima: true` en la pose
dibuja la cabeza delante de los brazos (brazos arriba, como en el tríceps
francés). `flexion-pecho.jsx` es la versión en estilo 2 de
`flexiones.jsx`; `zancada.jsx` pasa a una vista de frente para mostrar la
rodilla que se va hacia adentro (valgo).

**Escena de acción (comenta, comparte, guarda):** con `accion` en
`REELS.registrar` (`true` o `{ dur, pregunta, vo }`) `reel.jsx` suma, justo
antes del cierre, `MARCA.EscAccion`: arriba la pregunta (`pregunta`, por
defecto "¿ESTÁS DE ACUERDO?"), Tor sacando bíceps y abajo tres botones
(comentar, compartir, guardar) que una mano toca en orden; cada toque suena
(`pop`, y el guardar con el "tin"), al compartir sale un avión de papel que
vuela hasta un amigo (se pinta de amarillo con su visto) y al guardar el
marcador se llena. Va en todos los videos nuevos (pedido del autor).

**Pantalla dividida (comparaciones):** `novato-avanzado.jsx` y
`calistenia-gym.jsx` arman cada escena con un `duelo({...})` local sobre
`PL.escena2`: dos Tors (`tor` acepta una lista), uno por mitad (centros x 270
y 810), con ropa distinta (`ropa`) y un ícono propio sobre la cabeza, la
línea del medio y el VS de `PL.versus(T, f, op)` (en `lienzo`), las piezas de
cada lado arriba y el visto para quien gana el tema. Los rótulos pueden ir a
un costado (`r1.x`).

**La novia de Tor** (`novia.jsx`, para el público femenino): de frente,
`<NOVIA.Novia s pose k parpadeo boca />` (pelo negro largo, top amarillo,
calzas grises; poses `'abajo'`, `'cadera'`, `'saludo'`, `'flex'`); de perfil,
`NOVIA.perfil(g, T, { glu })` devuelve las capas `fondo` (cola de caballo que
cuelga con la gravedad), `agarre` (top deportivo y glúteo más redondo, en
amarillo con `glu`) y `encima` (pelo y pestañas) para sumar a un `B.Perfil`
(ver `Ella` en `gluteos.jsx`). Siempre deportiva y con buen gusto.

**Temas sensibles:** en `porno.jsx` el gancho no muestra nada sexual (ni
erección ni movimientos): TikTok e Instagram bajan o castigan los videos que
muestran o sugieren estimulación sexual aunque sean animados. Se cuenta con
Tor de noche en la cama, el dorso del celular y un globo "18+".

**La fórmula que más se comparte** (pedido del autor, por cómo funcionó el
de la marihuana): un tema tabú o un vicio, Tor en un estado ridículo y fácil
de reconocer, las razones con evidencia y un cierre de parodia; se manda con
un "jajaja, este eres tú". `cerveza.jsx` (borracho en el farol, el vómito en
el balde, "¿la última?" "¡no, gracias!"), `ex.jsx` (llorando en el sofá con
helado; apaga el celular y se va a entrenar), `gta6.jsx` (viciado; "Lucía no
es real", misiones del día), `vape.jsx` (la nube que lo tapa; al tacho) y
`chatarra.jsx` (las 2 AM visto desde adentro de la nevera). Reglas:

- El gancho dice la frase del autor ("Deja de tomar cerveza") y la escena de
  acción pregunta a quién mandárselo (`accion.pregunta`).
- **No exagerar la evidencia**: en `vape.jsx` no se dice que sea peor que el
  cigarro (probablemente es menos tóxico que fumar); sí que engancha igual o
  más y que ninguno es sano. Las cifras llevan su estudio en la cabecera.
- **Nada explícito** (ni sexual ni asqueroso de más): el vómito es un chorro
  amarillo de caricatura y el chiste de "Lucía" y "el club" es un personaje
  que camina y un cartel de neón.
- **Juegos y marcas:** se nombran (GTA 6) pero no se copia su logo, su arte
  ni sus personajes; lo que se ve en la tele es un dibujo genérico propio.

**Caras de Tor** (`B.Frente`, `TOR.Tor` y el `tor` de `PL`): `ojos`
`'borracho'` (cada ojo para un lado), `'espiral'` (hipnotizado), `'corazon'`,
`'grandes'`, `'llanto'` (> <), `'x'` y `'rojos'`; `boca` `'abierta'`, `'o'`,
`'ondulada'` (mareo), `'llena'` (cachetes inflados) y `'dientes'`; `gesto`
`{ cejas: 'enojo' | 'triste' | 'alzadas', cara: { color, v } (verde de
náuseas, rojo de rabia, amarillo de la luz de una pantalla), mejillas,
nariz: 'roja', mirada, giroOjos, latido, giro, boca, pupila }`; y `panza`
0..1 (la barriga que crece). En `PL`, `giro` inclina a todo Tor desde los
pies (el tambaleo del borracho) y `detras(T, f)` dibuja detrás de él.

**Escenografía** (`muebles.jsx`, `window.MU`): en coordenadas de Tor
`MU.cama()`, `MU.manta()`, `MU.sofa()`, `MU.mantaSofa()`, `MU.balde(c,
nivel)` y la pose `MU.poseSentado()` (de frente, sentado: la cadera baja 250);
piezas sueltas `MU.Farol`, `MU.Tacho`, `MU.Tele` (con `children` para la
pantalla), `MU.Despertador` (`hora`, `gira`, `suena`), `MU.Mesita` y
`MU.Ventana`. Sonidos nuevos de `audio.py` (sintetizados): `hipo`, `eructo`,
`vomito`, `llanto`, `sirena`, `crunch` y `tos`.

**Tor disfrazado:** `ropa` en `B.Frente`, `TOR.Tor` y el `tor` de `PL`
(`{ camiseta, cuello, short, numero, colorNumero, escudo, mangas }`) le pone
una camiseta de color con cuello y puños, el número en el pecho (blanco o
`colorNumero`), el short de color, el escudo `'cruz'` (Inglaterra) y, con
`mangas: false`, una musculosa de básquet; siempre con la paleta de cinco.
`ojos: 'rojos'` le pone los ojos rojos y entrecerrados (marihuana).
`cristiano.jsx` lo viste con la de Portugal y termina con el festejo
"¡siuuu!"; `kane.jsx` con la de Inglaterra (y los rivales van como
camisetas, `N.ICONOS.camiseta`, con `rayas` para el Barcelona); `lebron.jsx`
con una musculosa blanca y, con Bronny, la amarilla de los Lakers, y cierra
con la tiza al aire y la tribuna. Los sonidos especiales son tipos de
`herramientas/audio.py`, sintetizados (sin grabaciones ajenas): `siu`
(Cristiano) y `publico` (la tribuna); `grabar.js` deja sonar, además de las
X y los vistos, los efectos que una escena marca a propósito con
`sonido()` (`siu`, `publico`, `golpe`, `whoosh`, `campana`, `pop`).

Íconos para los videos con Tor en `N.ICONOS`: fútbol (`balon` con `giro`,
`arco`, `copa`, `mundo`, `balonOro`, `camiseta`), básquet (`basket` con
`giro`, `aro`, `corona`, `anillo`, `billete`), salud (`bareto` con
`encendido`, `pulmones` con `humo`, `persona` con `color`, `receta`) y
suplementos (`bote` con `color` en la etiqueta, `cuchara` con `lleno`,
`rinones` con `color`, `bateria` con `p`, `vaso` con `p`, `cabeza` con pelo,
`brote`) y vicios (`jarra` con `p`, `lata`, `vape`, `cajetilla`, `helado`,
`control`, `panuelos`, `corazonRoto` con `k`, `estrella` con `on`, `fuego`;
en `N.COMIDA`, `pizza`, `gaseosa` y `dona`). `PL.escena2` acepta además `encima(T, f)` (encima de los rótulos:
la X que tacha el rótulo de un mito), `fondo(g, T, f)` en cada Tor (detrás
de él, como la cabecera de una cama), `x`/`y` animados y `PL.alBiceps(g, p,
'gota')` (agua que entra al músculo).
Efectos de `V` para darles más vida: `V.Estela` (la figura con su estela de
movimiento: en las ejecuciones de los ejercicios), `V.Humo`, `V.Polvo` (la
tiza), `V.Confeti` (festejos) y `V.Ondas` (ruido, la tribuna). En los
ejercicios nuevos (`sentadilla-maquina.jsx`, `prensa-piernas.jsx`) los
errores van con una sola figura grande que pasa de mal a bien (X que se
retira con `hasta`, luego el visto) y la ejecución lleva un contador de
repeticiones (`B.Cuenta` en `encima`).

**Doblaje automático (la voz de Torvick):** `herramientas/locutor.py` y
`grabar.js --voz`. Una vez, `python3 herramientas/locutor.py preparar
<videos terminados con su voz>` separa la voz de la música (UVR) y guarda en
`~/.torvick/voz/` (fuera de git: es la voz del autor) las fuentes y el
perfil (espectro medio, tono, palabras por segundo). Después,
`node herramientas/grabar.js <id> --voz [--musica tema.wav]` dice cada `vo`
con esa voz, **alarga cada escena a lo que dura su línea** (como todo va con
`f(fracción)`, la coreografía se estira sola), graba y deja `<id>-voz.mp4`
con voz + música (baja sola cuando se habla) + X y vistos. El cierre dice
`cierreVo` del `registrar` (el llamado a seguir, por defecto el de la marca).
El render acepta duraciones en el hash: `reels.html#<id>/render/2.6,5.1,...`.
Motor local: Supertonic 3 (MIT) con la voz masculina más parecida (sid 9),
al ritmo del perfil y ecualizado con el espectro de la voz real; **no es un
clon** (parecido 0,74 contra 0,94 de la voz real consigo misma, WeSpeaker).
Para el timbre real hace falta un conversor de voz (kNN-VC) o un servicio
de clonación; ver la conversación del abdominal. `abdominal.jsx` es el
primer reel armado para esto.

**Formato corto:** 30 a 35 s *con* el cierre
de 3 s; la retención de Shorts/Reels está en 20-25 s, así que nada
redundante. Siete escenas de 2,5 a 5,5 s: Gancho, Posición, Ejecución,
Músculos, Error 1, Error 2, Cierre. Los cinco primeros videos (face pull a
dominadas) son más largos, del formato anterior (hasta 60 s).

- **Gancho:** la voz dice "Estás haciendo mal tu/tus <ejercicio>". En
  pantalla **no** va ese texto: solo el ejercicio mal hecho (vibrando,
  músculo en rojo), dos `Mal` (X rojas, cada una con su sonido de error)
  y el rótulo con el nombre del ejercicio.
- **`Mal`** (X que vibra) y **`Bien`** (visto que se dibuja) registran
  solos su sonido: "error" y "tin". Usarlos siempre en vez de
  `P.Tacha`/`P.Visto` sueltos, así el video exportado suena sincronizado.
  `sonido(tipo, segundo)` marca otro efecto a mano.
- Cada escena tiene su `vo` (la línea de locución). Se escribe para leerse
  a ~3 palabras por segundo dentro de la duración de la escena.

Entre escena y escena `reel.jsx` hace un empuje corto (0,36 s) que suena
como un "whoosh"; no hace falta hacer transiciones a mano.

**Zonas que tapan las apps:** el sello ocupa arriba a la izquierda
(y 140-215), así que los rótulos van de y 230 para abajo. Abajo de y 1560
y el borde derecho entre y 1000-1700 los tapan el texto y los botones de
Instagram/TikTok: ahí no va nada importante.

**Calzar el video con la voz grabada:** cambiá la duración de cada escena
hasta que coincida con lo que dura esa frase en tu grabación. Como todas
las escenas usan `f(fracción)`, la coreografía se estira sola. Para que
el cambio quede fijo, pasá los números a `ESCENAS` en el `.jsx` del video.

**Exportar:** `reels.html#<id>/render` muestra solo el lienzo a 1080x1920,
sin controles, y deja `window.REEL` (`seek`, `setPlaying`, `total`,
`cues`, `guion`) para grabar cuadro por cuadro con un navegador
automatizado. Eso hace la herramienta de escritorio:

```
node herramientas/grabar.js <id> [carpeta]   # por defecto ./videos (ignorada por git)
```

Deja `<id>.mp4` (video + los sonidos de las X y los vistos, sin música,
listo para ponerle la voz), `<id>-guion.txt` (cada línea de voz con su
tramo de tiempo) y `<id>-cues.json`. Con `--con-musica` deja además
`<id>-con-musica.mp4` con la música original sintetizada por
`herramientas/audio.py` (sin derechos de terceros). Necesita Node, Playwright, ffmpeg y
python3 con numpy. Sin eso, grabá la pantalla con el reel en reproducción.

**Videos de nutrición:** mismo formato corto, misma música y sonidos, y
el protagonista es **Tor**, el avatar de la marca (`TOR.Tor`: la figura
de frente de `B.Frente` con `flex` 0..1 para la pose de doble bíceps y
`boca` `'sonrisa'`/`'triste'`). Las piezas de comida están en `window.N`.
El gancho sigue la misma idea que en ejercicios —señalar el error del que
mira— adaptada: "Estás comiendo poca proteína." (en pantalla, Tor triste,
un medidor en rojo y las X). Escenas de `proteinas.jsx`: Gancho, Qué es,
Para qué, Fuentes, Cuánta, Ejemplo (con números concretos), Cierre. Los
números del libro van en rótulos (`1,6 A 2,2 G`) o en `B.Cuenta`.

Los videos con Tor nuevos se escriben con **`PL.escena({...})`**
(`plantillas.jsx`): cada escena es un objeto con `tor` (uno o varios),
`piezas` (cualquier pieza de `P`, `N` o `B` con su posición y su
`cuando`), `lienzo` (flechas y líneas), `mal`, `bien`, `r1` y `r2`; los
tiempos son fracciones y la plantilla aplica pop, respiración y sonidos.
`PL.grilla` arma la escena de fuentes (comida en platos, cada una cuando
la voz la nombra). `hierro.jsx` es la referencia. Ganchos usados, todos
"error del que mira": "Estás ignorando el hierro", "Estás evitando las
grasas", "Estás comiendo pocos carbohidratos", "Estás olvidando los
minerales", "Estás entrenando sin un objetivo claro".

**Identidad:** `identidad.html` (doble clic) muestra la foto de perfil de
Tor (amarilla y negra) y las portadas de historias destacadas (entreno,
nutrición, descanso, suplementos). `node herramientas/imagenes.js` las
exporta a `identidad/` en 1080x1080 (perfil y destacadas cuadradas) y
1080x1920 (destacadas para subir como historia).

Código de color en estos videos (misma paleta de cinco):
`YEL` músculo principal, trayectoria, guía · `GRY` músculo secundario,
cable flojo, short · `RED` error (y el trapecio cuando se encogen los
hombros) · `GRN` lo correcto: visto, flechas de corrección.

Las piezas de `window.B` son reutilizables para cualquier ejercicio:

```js
// cuerpo.jsx
B.Espalda   // posterior: codo, rot, enc, ret, piernas | brazos:'arriba' + sube (dominadas,
            // manos fijas con anclaManos) | cuerpoEntero, rodillas | musc{dp,inf,rm,tra,rom,dor,rM,trapRojo}
B.Estacion  // lateral con polea: p, rot, paso, tension, poleaY, carga, cable, suelta
B.Cuenta    // anillo que se vacía con un número adentro (n, p)
B.FlechaS B.Arco B.Puntos B.Anillo   // overlays SVG que van dentro de children
// perfil.jsx
B.Perfil    // perfil articulado (mira a la izquierda); pose = puntos explícitos
B.posePerfil.depie / sentadilla / acostado / banco / colgado / mezclar / mover / girar
// frente.jsx
B.Frente    // de frente o cenital (acostado visto de arriba)
B.poseFrente.depie / sumo / bancaArriba / mezclar
// equipo.jsx: cada uno suelto o en versión G para dibujar dentro de un cuerpo
B.Mancuerna B.Banco B.Barra B.Colchoneta  (+ MancuernaG, BancoG, BarraG, ColchonetaG, SombraG, PisoG)
B.BarraLibreG   // barra olímpica con discos: vista 'lado' (el disco, en la mano) o 'frente'
B.geoEspalda B.geoEstacion B.geoPerfil B.geoFrente   // las mismas coordenadas, sin dibujar
```

Los cuerpos reciben `fondo`, `children` (y `agarre`/`medio` los nuevos) como
función `(g) => <g>…</g>`: `g` trae las articulaciones en coordenadas del
viewBox, así las flechas, guías y mancuernas siguen al cuerpo. Músculos:
`musc` amarillo (principal), `muscGris` gris (secundario), `muscRojo` rojo
(error) en `B.Perfil` y `B.Frente`.

## Landing de la tienda — `tienda/`

`tienda/index.html` es una página estática (sin React ni compilación) para el
link de la bio. En la portada Tor saluda (cuadros `tor-saludo-a/b/c`), pregunta
el objetivo y el nivel, recomienda una guía y hace un **tour** de 4 pasos por
esa tarjeta hasta el botón de compra (`PRODUCTOS` en el script; el botón
"¿Te ayudo?" lo vuelve a llamar). Después: un teléfono con 3 reels
(`tienda/video/`, 540x960 sin audio), antes/después (`comp-sin`/`comp-con`),
el pack con los libros en un carrusel que se arrastra (cada uno con su valor),
las guías con portadas dibujadas en CSS, **referidos** (cada quien crea su
link `?ref=código`; el código viaja al checkout de Hotmart como `sck` y el
cupón de 25 % se manda a mano), el regalo a cambio del correo, la
**calculadora** (calorías, proteína, carbohidratos y grasa según peso y
objetivo, y un plato con porciones de las comidas que elige), quién está
detrás, la garantía, preguntas y cierre. La palabra "gym" no se usa (pedido
del autor): se dice ejercicio o entrenar. Misma identidad que los videos (blanco, trazo INK, paleta de cinco,
Archivo Black + Barlow Semi Condensed, rótulos negros con punta, sombras
duras). Los dibujos de `tienda/img/` son SVG exportados de `TOR.Tor`,
`NOVIA.Novia` y las piezas de `N`/`P`: si cambia Tor, hay que volver a
exportarlos. Los cobros van por Hotmart: cada botón toma su link de
`ENLACES.checkout`; sin link, lleva a la sección de guías. No poner
testimonios ni cifras de ventas inventadas.

## E-books — `ebooks/`

Cada e-book es un HTML con una `<section class="pagina">` por hoja A4 y el
estilo común de `ebooks/ebook.css` (misma identidad: blanco, trazo INK, paleta
de cinco, rótulos con punta, cajas con sombra dura, "Tor dice", cajas de
estudio). `node herramientas/ebook.js <archivo.html> [--hojas carpeta]` lo
pasa a PDF en `ebooks/pdf/` (fuera de git) y avisa si algo toca el pie.
Las figuras de los ejercicios son **láminas** sacadas de los reels con
`node herramientas/laminas.js ebooks/img id:Escena:fracción[:nombre]` (solo el
cuerpo y su máquina, sin rótulos; usar fracciones 0,3 a 0,85, no el final de la
escena). Los dibujos de Tor salen de `tienda/img/` y de `ebooks/img/eb-*.svg`.
**El repositorio es público:** los e-books pagos (`rutina-principiantes.html`)
viven en `ebooks/privado/`, que no va a git; la guía gratis sí.
Cada dato lleva su estudio en la hoja y la lista completa al final.

## Videos largos de YouTube — `largo.html`

Los videos educativos de 10 a 13 minutos (masa muscular, creatina,
disciplina, concentración…). El autor manda el video **con sus cortes
finales**; el sistema pone encima textos, escenas, tarjetas y zooms
sincronizados con la voz. Todo está en **`LARGOS.md`**: el estilo, el flujo
semanal (liviano para planificar, master 4K para exportar) y la referencia
del plan. Lo esencial:

- La voz manda el tiempo: `T` es el segundo del video, no una duración de
  autor. Los tiempos del plan se sacan de la transcripción con
  `t = LARGOS.buscador(id)` → `t('frase', desde)`. Dentro de una escena sigue
  valiendo `f(fracción)` o los tiempos de `t()`; nunca segundos inventados.
- Flujo: `herramientas/transcribir.py` → `largos/<id>/plan.jsx` →
  `node compilar.js && node herramientas/revisar-largo.js <id>` →
  `largo.html#<id>` → `node herramientas/grabar-largo.js <id> [--fuente master.mp4 --4k]`
  (MP4 + .srt en `videos/`).
- El estilo parte de las animaciones **originales** de disciplina (línea de
  tinta, monigotes, dianas, barras, etiquetas negras con flechita) llevadas a
  nivel profesional: Inter Tight 900/800 + IBM Plex Mono, palabra clave en
  caja amarilla, entradas con máscara y desenfoque (ease-out exponencial),
  sombras suaves, empuje lento. **Sin emojis ni stickers** (pedido del autor:
  se veían "chafa"); el lienzo usa la paleta de cinco + blanco/papel.
- Sobre la cámara: frases clave al ritmo de la voz, titulares al costado de la
  cara, palabras gigantes **detrás de la persona** (`p.detras`, máscaras de
  `herramientas/recortar.py`), tarjetas, datos, recortes de estudios. Escenas
  con transición `latigo`, `barrido` o `zoom`, o divididas (la cámara en una
  tarjeta al costado).
- Las 2 reglas de oro valen igual: todo entra animado y todo deriva.
- La cámara tiene que estar en pantalla más de la mitad del tiempo: las
  escenas explican, pero el que conecta es el presentador.
- `largos/<id>/media/` no va a git (videos pesados y máscaras); sí van el plan
  y la transcripción. Los `.js` de `largos/` también se generan con `compilar.js`.
- `largos/disciplina/` es la reedición del video ya publicado (sin crudo):
  recrea cada animación vieja, tapa los insertos (`fuente-tramos.json`,
  `p.mantener`) y esconde las placas viejas con primeros planos. Para videos
  nuevos no hace falta.

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
