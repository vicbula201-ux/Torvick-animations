# P4 · Cambio Físico — estilo y flujo de los videos verticales

La serie del cambio físico de Torvick: honesta, transparente, desde el
aprendizaje y sin ego. Videos verticales (9:16) para Instagram, TikTok y
YouTube Shorts: "Día 12 de cambio físico: hoy hago el mercado de la semana",
"Día 13: hoy no tengo ganas de levantarme", "Día 20: me dieron ganas de probar
los péptidos". Tú hablas a cámara; la edición pone encima los subtítulos, las
palabras gigantes, los números, las listas, los emojis y la firma.

```
cambio.html           vista previa: el video corre y encima se ven las capas (doble clic)
cambio.jsx            el motor: subtítulos, cámara, texto detrás de la persona, tarjetas, firma
cambio/emoji/         211 emojis 3D (Fluent Emoji de Microsoft, licencia MIT)
cambios/lista.js      los videos para los botones de cambio.html
cambios/<id>/
  media/fuente.mp4    tu video ya cortado (no va a git)
  media/recorte/      máscaras de la persona para lo que va detrás (generadas, no van a git)
  transcripcion.*     el tiempo de cada palabra (herramientas/transcribir.py)
  plan.jsx            qué aparece y cuándo, anclado a lo que dices
herramientas/
  transcribir.py      voz -> palabras con tiempo (los mismos modelos que los largos)
  recortar.py         separa a la persona del fondo (para los textos detrás)
  grabar-cambio.js    graba el MP4 final (1080x1920 o 2160x3840) + .srt
  audio.py            mezcla tu voz con los efectos
```

## Lo que hacen los 5 videos de referencia

Los cinco son de creadores que dicen editar con IA a partir de un prompt (y
tres lo dicen en el propio video: Claude, Cardboard, Claude + Remotion/HyperFrames).
Medidos cuadro a cuadro y con la transcripción de cada uno:

| | De qué va | Lo que lo hace reconocible |
|---|---|---|
| 1 · "Todo este video lo editó Claude" (83 s) | miniserie de edición, rosa y bordó | palabra gigante **detrás** de ella ("CLAUDE", "YO"), "5 HORAS" enorme, subtítulos de 2-3 palabras con la que suena en una **cajita de color**, lista con vistos que se arma mientras habla, **capítulos** con el video metido en un marco sobre fondo de color con lunares ("PARTE 02", "01 mis clips"), antes/ahora lado a lado, cierre "comenta WAITLIST" |
| 2 · Insolvencia (37 s) | despacho de abogados, estudio gris | sobrio: subtítulos finos, la frase fuerte en mayúsculas grandes, palabras en **rojo**, lista con viñetas, **blanco y negro y oscuro** para lo grave, cortes con cambio de encuadre |
| 3 · "Cosas estúpidas para crecer en redes" (45 s) | tips numerados, luz cálida | título fijo arriba (cursiva + mayúsculas con borde), **#1 … #5**, subtítulo de una sola palabra, pastillas con vistas ("308 mil"), miniaturas de sus videos, logos |
| 4 · "Cómo editar con IA" (55 s) | tutorial, serie "episodio 7" | serifa condensada verde lima, **PASO 1 / PASO 2**, tarjetas de interfaz flotando, checklist "dale contexto", número que cambia (4.999 → 5.000), **"antes: 4-5 horas" tachado**, reloj, caja de comentario que se escribe sola ("CARDBOARD") |
| 5 · "Editado por IA" (35 s) | **"día 302 de 365 cambiando mi vida"** | letra de palo muy negra, palabra clave en azul, **números gigantes detrás de la cabeza** (1, 2, 3, 365), tarjetas blancas con ícono que crecen ("sí quedó bien" con visto verde), barra de progreso, ventana de código que se escribe, onda de audio |

**Lo que tienen los cinco (la gramática del formato):**

- **Cero silencios.** La pausa más larga entre palabras es de 0,2 a 0,6 s; la
  voz arranca en el segundo 0 y termina en el último. Hablan a **200-270
  palabras por minuto** (tus largos van a 178-188).
- **Subtítulos siempre**, de 1 a 3 palabras, una sola línea, a la altura del
  pecho (no abajo: ahí los tapa la app).
- **Algo cambia cada 1 a 3,5 s** (el del tutorial, cada 1 s; los demás, cada
  2-3 s): un corte con otro encuadre, una palabra grande, una tarjeta, un
  número, un emoji.
- **Lo grande va detrás de la persona** (la cabeza tapa parte de la palabra):
  es lo que hace que se vea "editado por un profesional".
- **Lo que se nombra, aparece**: listas que se arman ítem por ítem, números
  que cuentan, la tarjeta cuando se dice la palabra.
- **Capítulos o pasos numerados** con un cambio de fondo (marco sobre color).
- **Paleta cerrada de 2-3 colores** por creador y un cierre que pide comentar.

## El estilo de P4

**La base es el video 5** (el formato "día N de 365" es literalmente el de la
serie) con **la mecánica del video 1** (subtítulos con cajita, listas que se
arman, capítulos en un marco, antes/ahora), en **blanco, amarillo y negro**.
Del 2 se toma el blanco y negro para los momentos honestos ("hoy no tengo
ganas") y del 4 el tachado de lo que había antes. No se toman las cursivas ni
las serifas del 3 y el 4: son de estética lifestyle y no van con un
profesional del deporte ni con la marca.

**Paleta** (la de la marca): negro `#14110F`, amarillo `#FFD400`, blanco. Rojo
`#E03A2F` y verde `#16A06A` solo con significado: la X y el tachado, el visto.

**Tipografía:**

| Familia | Uso |
|---|---|
| Inter Tight 800 | subtítulos (en minúscula, como se habla), tarjetas, textos medianos |
| Archivo Black | lo gigante: DÍA 12, palabras detrás, números, títulos de capítulo, pastillas |
| Permanent Marker | notas a mano ("lo que aprendí", "¿esto qué significa?", "comenta") |
| IBM Plex Mono | etiquetas chicas de datos (PESO HOY, PROTEÍNA) |

**Los elementos** (todos en `cambio.jsx`; entre paréntesis, el beat del plan):

- **Subtítulos** (solos): blanco con sombra negra dura; **la palabra que suena
  en caja amarilla con letra negra**; los números y las palabras marcadas en
  amarillo. 1 a 3 palabras, sin cortar "de | la" al final.
- **Apertura de la serie** (`dia`): pastilla amarilla "DÍA", el número
  gigante **detrás de tu cabeza** y la pastilla negra "DE CAMBIO FÍSICO"
  debajo. Primer segundo y medio de cada video.
- **Sello de la serie** (solo, con `serie`): "DÍA 12 · CAMBIO FÍSICO" chico
  arriba a la izquierda; se esconde cuando algo ocupa la parte de arriba.
- **Palabra gigante detrás** (`detras`): los remates ("SIN GANAS", "PÉPTIDOS").
  Blanca por defecto; negra o amarilla si el fondo es claro.
- **Título** (`titulo`): línea chica + línea grande amarilla, cada una cuando
  la dices.
- **Número** (`numero`): cuenta hasta el valor (84,2 KG, 2.500 KCAL, 5 HORAS)
  y puede mostrar lo de antes tachado en rojo.
- **Tarjeta** (`tarjeta`): blanca con emoji o con visto/X, la palabra clave
  con resaltador amarillo.
- **Lista** (`lista`): pastillas blancas con visto que aparecen cuando nombras
  cada cosa (el mercado, lo que comí, la rutina); `mal: true` la tacha.
- **Emoji 3D** (`emoji`): entra con rebote y flota. **En P4 sí van emojis**
  (pedido del autor), pero solo los 3D de `cambio/emoji/` (nada de emojis del
  sistema, que se ven "chafa"), uno a la vez y cuando se nombra la cosa.
- **Foto** (`imagen`): tu foto como polaroid (la etiqueta del producto, la
  báscula, el ticket del mercado).
- **Progreso** (`progreso`): barra en tarjeta (DÍA 12 DE 90, PROTEÍNA 120/180 G).
- **Capítulo** (`capitulo`): la cámara se mete en un marco sobre amarillo con
  lunares, el título arriba y el "#1" pegado en la esquina. Para los bloques
  del video ("#1 LA COMPRA") y para **"LO QUE APRENDÍ"**.
- **Antes / ahora** (`comparar`): dos fotos tuyas lado a lado sobre amarillo.
- **Etiqueta** (`etiqueta`): pastilla o nota a mano, con tachado opcional.
- **Comentar** (`cta`): "comenta" + la palabra grande + la caja de texto que
  se escribe sola.
- **Cámara** (`camara`): golpe de zoom en los remates, empuje lento en lo
  emotivo, blanco y negro y oscuro para lo honesto/duro, cambio de encuadre en
  los cortes para que no salte.
- **Firma** (sola, en todos los videos): los últimos 2,8 s, YouTube ·
  Instagram · TikTok · @eltorvick y "SÍGUEME PARA EL DÍA 13".

**Movimiento:** entradas de 0,1 a 0,3 s (lo gigante llega desenfocado y un poco
grande; las tarjetas y los emojis crecen con un rebote corto), salidas de
0,2 s, y todo lo que queda en pantalla deriva un poco. Nada aparece de golpe.

**Sonido:** pop (tarjetas, emojis, ítems), ding (vistos), error (X, tachado),
golpe (palabras detrás, números, golpe de zoom), whoosh (títulos, capítulos),
clic (etiquetas, la caja de comentario). Debajo de la voz. Sin música por
defecto (como el estilo 2 de los reels); `--musica` la agrega.

**Fondo claro** (pared blanca): las palabras detrás y los títulos en negro
(`color: 'negro'`, `colorArriba: 'negro'`), los subtítulos con barra
(`subs.fondo: true`). Si el video trae fotos propias montadas encima (las
radiografías del video de la escoliosis), se dejan y `subs.y` puede ser una
función del segundo para que los subtítulos las esquiven.

**Zonas que tapan las apps** (`cambio.html` las muestra con "zonas que tapan
las apps"): arriba hasta y 230, abajo desde y 1560, y a la derecha de x 900
entre y 1000 y 1560. Los subtítulos van en y 1230.

## La fórmula de un episodio (30-60 s)

| Tramo | Qué va | En pantalla |
|---|---|---|
| 0-2 s | "Día 12 de cambio físico" + la situación del día en una frase | `dia` + título o palabra detrás |
| 2-6 s | por qué importa / qué siento (honesto) | B/N si es un día duro, emoji de la emoción |
| 6-40 s | lo que hago: el mercado, el entreno, la comida, la decisión | listas que se arman, números, fotos, capítulos "#1" |
| último tercio | **lo que aprendí hoy** (la gracia de la serie) | capítulo "LO QUE APRENDÍ" + tarjeta o palabra detrás |
| últimos 3 s | "mañana te cuento…" / pregunta para comentar | `cta` y la firma con el día siguiente |

Una idea por video. Si un día hay dos cosas, son dos días.

## El flujo

1. **Grabar** vertical (9:16), 1080x1920 o 4K, 30 fps. Encuadre: tú al
   centro con **aire arriba de la cabeza** (ahí van el DÍA y las palabras
   gigantes) y el pecho a la vista (ahí van los subtítulos). Micrófono que no
   tape la boca. Si el fondo es blanco, avisa (las palabras grandes van en negro).
2. **Cortar en Premiere, apretado**: sin pausas de más de ~0,3 s, sin tomas
   repetidas ni arranques en falso. Sin textos, sin música, sin efectos.
   Exportar el corte (H.264). Si el archivo es pesado, manda uno liviano
   (1080p, ~30 MB) para planificar y el master queda para exportar (como en
   los largos).
3. **Mandarlo** en el chat con lo que quieras puntual ("en 'pollo' pon la
   foto del mercado", "aquí blanco y negro"). Fotos sueltas aparte.
4. Lo que hago yo: `transcribir.py` → `cambios/<id>/plan.jsx` → fotos de
   control → `grabar-cambio.js` → te devuelvo el MP4 (+ .srt).
5. **Ajustes** por chat ("la tarjeta de la proteína más tarde", "sin el
   emoji del fuego").

**¿Y si mando el video sin cortar?** Se puede: con la transcripción (el tiempo
de cada palabra) se encuentran los silencios, las tomas repetidas y los
arranques en falso y se cortan solos. Para los primeros videos conviene que
cortes tú: el corte es lo que decide qué historia cuentas, y así medimos cuánto
tiempo ahorra la edición. Cuando el estilo esté afinado, probamos el corte
automático con un video.

## Comandos

```
python3 herramientas/transcribir.py cambios/<id>/media/fuente.mp4 --out cambios/<id>/transcripcion.json
node compilar.js
node herramientas/grabar-cambio.js <id> --cuadros 1,5.5,12      # fotos de control
node herramientas/grabar-cambio.js <id>                          # videos/<id>.mp4 + .srt
node herramientas/grabar-cambio.js <id> --fuente master.mp4 --4k # el master en 2160x3840
```

Abrir `cambio.html#<id>` muestra el video con las capas (y el plan a la
derecha: clic en un beat para saltar). Para que aparezca en los botones de
arriba, sumarlo a `cambios/lista.js`. Lo que va detrás de la persona solo se
ve detrás cuando ya existen las máscaras (las calcula `grabar-cambio.js` la
primera vez); antes, en la vista previa, se ve por encima.

Las pruebas con videos ajenos (por ejemplo, los de referencia) van en una
carpeta que empiece con guion bajo, `cambios/_prueba/`: git la ignora entera.

## Reeditar un video viejo (con textos y memes quemados)

Si el video ya trae su edición quemada (subtítulos, contadores, memes, barras
de suscripción) y no está el crudo, no se puede borrar: se **tapa con piezas
nuevas en el mismo lugar y en el mismo segundo**. Fue el caso del reto de
dominadas en el parque (noviembre de 2026). Con el crudo nada de esto hace falta
y la calidad es otra: pídelo siempre primero.

1. **Subtítulos y contador viejos, automático:**
   `python3 herramientas/viejos.py video.mp4 --banda 0.52-0.57 --contador 0.25,0.02,0.75,0.2 --out viejos.json`
   (la franja y la caja salen de una foto con grilla). `tapar` va en
   `subs: { fondo: true, y: <centro de la franja>, tapar }`; los tiempos del
   contador, en `p.contador`.
2. **Memes y barras, a ojo:** fotos a 10 cuadros por segundo alrededor de cada
   uno (cuándo entra y cuándo sale) y una foto con grilla para la caja. Cada
   uno se tapa con `p.tarjeta({ tapa, vertical: true, emoji, titulo })`,
   `p.suscribete({ tapa })` o un emoji grande + `p.parche`. Lo que tapa entra
   casi entero desde el primer cuadro y lleva debajo un parche borroso solo.
3. **La transcripción**: los subtítulos viejos dicen lo que de verdad se
   dijo; corregir en el `.json` lo que el modelo oyó mal y rehacer el `.js`
   con `transcribir.py --solo-js`.
4. **Nada de zoom ni de marco de capítulo** mientras haya algo viejo a la vista
   (lo viejo se movería y las piezas no): el capítulo va en un hueco limpio y
   el énfasis, con sacudida o con piezas.
5. El audio viejo trae música y efectos: los efectos nuevos van más bajos
   (`grabar-cambio.js <id> --nivel-efectos -12`).
6. Revisar la franja de subtítulos y la entrada y salida de cada tapa cuadro a
   cuadro antes de entregar.

## El plan

```jsx
(function (global) {
  var C = global.CAMBIOS, p = C.plan;
  var t = C.buscador('dia-12');               // t('frase', desde) -> segundo en que se dice

  C.registrar({
    id: 'dia-12', titulo: 'Día 12 · el mercado', video: 'cambios/dia-12/media/fuente.mp4',
    serie: { dia: 12, nombre: 'cambio físico' },               // sello + "SÍGUEME PARA EL DÍA 13"
    subs: { y: 1230, marcadas: ['proteína', 'pollo'],          // amarillas en los subtítulos
            corregir: { cloud: 'Claude' } },                   // palabras que la transcripción escribe mal
    encuadre: { zoom: 1, foco: [0.5, 0.4] },
    plan: [
      p.dia(0, t('hoy') - 0.1, { n: 12 }),
      p.titulo(t('mercado') - 0.1, t.fin('semana') + 0.4, 'EL MERCADO', { arriba: 'hoy toca' }),
      p.lista(t('pollo') - 0.2, t.fin('avena') + 1, { titulo: 'mi compra', items: [
        { texto: 'pollo', emoji: 'pollo' }, { texto: 'huevos', emoji: 'huevo' }, { texto: 'avena', emoji: 'avena' }] }),
      p.numero(t('gasté'), t.fin('pesos') + 0.5, { valor: 186000, desde: 0, unidad: 'COP', etiqueta: 'gasté' }),
      p.emoji(t('antojo'), t.fin('antojo') + 1.2, 'dona', { pos: 'der' }),
      p.etiqueta(t('dona'), t.fin('dona') + 1.4, 'DONAS', { estilo: 'blanco', tachado: true }),
      p.camara(t('no tengo ganas'), t.fin('ganas') + 1, { bn: true, oscuro: 0.3, mov: 'empuje' }),
      p.detras(t('aprendí') - 0.05, t.fin('aprendí') + 1.6, 'LISTA\nPRIMERO'),
      p.capitulo(t('lo que aprendí'), t.fin('hambre') + 0.3, { titulo: 'lo que aprendí', sub: 'nunca vayas con hambre' }),
      p.tarjeta(t('proteína'), t.fin('proteína') + 1.5, { emoji: 'biceps', texto: '180 g de proteína', marcadas: ['proteína'] }),
      p.cta(t('comenta'), t.fin('comenta') + 1.6, 'MERCADO')
    ]
  });
})(window);
```

| beat | qué hace |
|---|---|
| `dia(ini, fin, o)` | apertura: `n`, `arriba` ('DÍA'), `abajo` ('de cambio físico'), `y`, `tam`, `color` |
| `detras(ini, fin, txt, o)` | gigante detrás de la persona (`'\n'` = dos líneas): `color`, `y`, `tam`, `arriba`, `abajo` |
| `titulo(ini, fin, txt, o)` | `arriba` (línea chica), `color`, `colorArriba` (`'negro'` sobre pared clara), `pos`, `detras: true`, `mano: true` (la chica a mano) |
| `numero(ini, fin, o)` | `valor`, `desde` (cuenta), `dec`, `unidad`, `etiqueta`, `antes` (tachado), `signo`, `pos`, `detras` |
| `tarjeta(ini, fin, o)` | `texto`, `emoji` o `icono: 'check'/'equis'` o `logo: 'youtube'`, `titulo` (Archivo Black), `grande` (número enorme), `sub`, `etiqueta`, `marcadas`, `pos`; `vertical`, `ancho`, `alto`, `estilo: 'negro'`; `tapa: [x0, y0, x1, y1]` (se para encima de eso) |
| `lista(ini, fin, o)` | `titulo`, `items: ['pollo', { texto, emoji, mal, t, busca }]` (cada uno cuando se dice), `pos` |
| `emoji(ini, fin, nombre, o)` | `'pollo'` o `'🍗'`; `pos`, `tam`, `rot`. Lista: `CAMBIOS.EMOJI` |
| `imagen(ini, fin, src, o)` | foto polaroid: `pos`, `ancho`, `alto`, `rot`, `pie` |
| `etiqueta(ini, fin, txt, o)` | `estilo` amarillo/negro/blanco/rojo/verde/mano, `tachado`, `emoji`, `pos`, `rot` |
| `progreso(ini, fin, o)` | `etiqueta`, `valor`, `max`, `desde`, `unidad`, `pos` |
| `capitulo(ini, fin, o)` | marco sobre amarillo: `n`, `titulo`, `sub`, `oscuro` (fondo negro) |
| `comparar(ini, fin, o)` | `antes`, `ahora` (fotos), `etiquetas`, `titulo` |
| `cta(ini, fin, palabra, o)` | "comenta" + la palabra + la caja que se escribe: `texto`, `y` |
| `contador(ini, fin, o)` | placa amarilla de repeticiones: `tiempos` (segundo de cada rep), `nombre`, `pos`, `final` + `cFinal` |
| `suscribete(ini, fin, o)` | tu foto + TORVICK + el botón que el cursor aprieta (SUSCRITO) y la campana: `clic`, `pos`, `tapa` |
| `parche(ini, fin, r)` | borronea el rectángulo `r` del video (reedición: lo viejo que asoma) |
| `camara(ini, fin, o)` | `zoom`, `foco` [x, y], `mov` golpe/suave/empuje/corte, `bn`, `oscuro`, `desenfoque` |
| `sonido(t, tipo)` · `flash(t)` · `sacudida(t)` | sueltos |

`subs`: `y` (alto de la línea; si el encuadre deja el pecho más arriba o más
abajo), `tam`, `palabras` (máximo por bloque, 3), `caracteres` (18),
`marcadas`, `numeros: false` (que los números no vayan en amarillo),
`corregir` y `ocultar: [[ini, fin]]` (tramos sin subtítulos). Para la
reedición: `fondo: true` (cada bloque en una barra negra), `altoBarra` y
`tapar: [[ini, fin, x0, x1]]` (los subtítulos viejos: la barra se ensancha
hasta taparlos y nunca queda uno viejo a la vista sin uno nuevo encima).

`pos`: `arriba`, `arriba-izq`, `arriba-der`, `izq`, `der`, `centro`, `abajo`,
`abajo-izq`, o `[x, y]`. Lo que va en la misma zona no se pisa (el anterior se
va antes) y nada de arriba se cruza con la firma.
