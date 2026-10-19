# Videos largos de YouTube — estilo y flujo

Los videos educativos largos (8 a 13 min, 16:9) se editan solos a partir del
video con los cortes finales: se transcribe la voz, se escribe un **plan**
(qué aparece y cuándo, anclado a las palabras que se dicen), se revisa y se
graba. Nada de línea de tiempo a mano.

```
largo.html            vista previa: el video corre y encima se ven las capas (doble clic)
largo.jsx             el motor: cámara, escenas, textos, stickers, CTA, sonidos
largo-plantillas.jsx  LARGOS.X: escenas armadas con datos (Fila, Palabra, Vs, ...)
largos/stickers.js    los emojis que usan los planes (generado)
largos/<id>/
  media/fuente.mp4    el video con los cortes finales (no va a git)
  transcripcion.*     .json/.js/.txt con el tiempo de cada palabra (generado)
  plan.jsx            el plan de edición de ese video
herramientas/
  transcribir.py      voz -> palabras con tiempo (parakeet + whisper, sin internet)
  stickers.js         arma largos/stickers.js con los emojis usados
  revisar-largo.js    revisa el plan antes de grabar
  grabar-largo.js     graba el MP4 final + subtítulos .srt
  tramos.py           solo para reeditar un video que ya traía edición
  audio.py            mezcla voz + efectos (+ música opcional)
```

## Flujo semanal

1. Grabar y cortar (los cortes son del autor). Exportar 1080p o 4K, 30 fps.
   Encuadre con aire arriba y a los costados: los zooms recortan sin perder la
   cara. **Sin textos ni música quemados**: eso lo pone el sistema. Los clips
   propios (gimnasio, b-roll) van dentro del corte; las capturas de estudios y
   fotos van como archivos sueltos en `media/` y se ponen con `p.imagen`.
2. Copiar el video a `largos/<id>/media/fuente.mp4`.
3. `python3 herramientas/transcribir.py largos/<id>/media/fuente.mp4 --out largos/<id>/transcripcion.json`
   (la primera vez baja los modelos, ver la cabecera del script). Revisar el
   `.txt`: si un nombre propio quedó mal, corregir el `.json` y correr otra vez
   con `--solo-js`.
4. Escribir `largos/<id>/plan.jsx` (ver abajo). Agregar
   `<script src="largos/<id>/transcripcion.js">` y `<script src="largos/<id>/plan.js">`
   en `largo.html`.
5. `node compilar.js && node herramientas/stickers.js && node herramientas/revisar-largo.js <id>`
6. Mirar `largo.html#<id>` (el video manda el tiempo; la barra marca en
   amarillo las escenas y en rojo los capítulos). Fotos sueltas para revisar:
   `node herramientas/grabar-largo.js <id> --cuadros 12.5,40,61`
7. `node herramientas/grabar-largo.js <id>` → `videos/<id>.mp4` + `videos/<id>.srt`
   (subir el .srt a YouTube como subtítulos). Con `--musica` agrega música
   original debajo de la voz (baja sola cuando se habla); `--musica-wav tema.wav`
   usa otra.

## El estilo

**Identidad:** la paleta de la marca (tinta `#14110F`, amarillo `#FFD400`,
rojo `#E03A2F`, verde `#16A06A`, gris `#C9C3B8`, blanco) para todo lo que
dibuja el sistema; el color extra lo ponen los stickers. El presentador es la
estrella: **la cámara tiene que ocupar más de la mitad del video** (en
creatina y masa muscular estuvo 57-65 % del tiempo; en disciplina, 48 %).

**Textos clave** (sobre la cámara, abajo): Barlow Condensed 900 itálica en
mayúsculas, contorno de tinta grueso y sombra dura. Pocas palabras (1 a 5),
las que se están diciendo. Aparecen **palabra por palabra al ritmo de la voz**
(`estilo: 'palabras'`) o de un golpe. Color por significado:
- amarillo: la idea clave · blanco: neutro · verde: lo correcto, el progreso ·
  rojo: el error, lo que daña
- `caja` (amarilla con borde): la frase que hay que llevarse
- `rotulo` (etiqueta negra): datos, nombres, listas cortas sobre clips

**Stickers:** Fluent Emoji de Microsoft (licencia MIT) troquelados: borde
blanco, contorno de tinta y sombra. Entran con rebote, flotan y se balancean.
Al costado de la cara (`pos: [1500, 360]` o `[420, 360]`), nunca encima.
Buscar nombres: `node herramientas/stickers.js buscar brain`.

**Escenas a pantalla completa** (papel blanco con puntitos, negro o amarillo):
se arman por partes mientras se habla, como una pizarra. Íconos grandes +
rótulos + flechas que se dibujan + signos `= + → >`. Una idea por escena,
2 a 8 segundos.

**Transiciones:** la firma es el **barrido amarillo** (banda inclinada que
cruza de izquierda a derecha, con su "whoosh" que también cruza). Se alterna
con `empuje` (entra de costado), `pop` y `corte` para no cansar. Volver a la
cámara casi siempre es `corte`.

**Cámara:** primer plano (zoom 1.25-1.4) en los énfasis, `golpe` (zoom
rápido con temblor) en los remates, `empuje` (acercamiento lento) en lo
emotivo, blanco y negro para la ironía. En el video crudo hay que dejar aire
para que el zoom no corte la cabeza.

**Estructura visual de cada video:**
- gancho (0-15 s) con la pregunta o el problema en pantalla
- "En este video": lista de lo que se va a ver (máximo 3-4 puntos)
- tarjeta de capítulo (fondo negro, número en caja amarilla) y rótulo de
  capítulo arriba a la izquierda durante 4 s
- citas en tarjeta (comillas amarillas, la frase aparece al ritmo de la voz)
- pasos numerados en tarjeta amarilla (`X.Paso`)
- CTA de suscripción (botón que se clickea solo) y meta de suscriptores
- pantalla final de 10-20 s con huecos para los elementos de YouTube

**Sonido:** pop (stickers y textos), whoosh (transiciones), ding (vistos y
listas), error (X roja), golpe (zooms y capítulos), click + campana (suscribirse).
Todo sintetizado por `audio.py`, sin derechos de terceros. Los efectos quedan
5-10 dB por debajo de la voz; la voz se normaliza a ~-19 dBFS.

## Cómo escribir el plan (receta)

1. Leer `transcripcion.txt` entero y marcar: gancho, capítulos (preguntas),
   analogías, números, citas, chistes, pedidos de suscripción.
2. Capítulos → `p.capitulo`; lo que se promete al inicio → `p.lista`.
3. Cada explicación que se entiende mejor dibujada (una relación, un antes y
   después, una lista, una curva) → una escena de 2 a 8 s anclada a las
   palabras con `t()`. Que cada pieza entre cuando se la nombra.
4. Sobre la cámara: un texto clave cada 5-8 s de cámara (la palabra que se
   está diciendo), un sticker cada 8-12 s, un cambio de encuadre (primer
   plano, golpe, empuje) cada 10-15 s, un interruptor (blanco y negro, chiste)
   cada 45-60 s.
5. Densidad de referencia para 10 min de video crudo: 25-40 escenas, la cámara
   en pantalla más del 55 % del tiempo.
6. Revisar con `revisar-largo.js` y con fotos sueltas en los momentos clave.

## El plan

```jsx
(function (global) {
  var L = global.LARGOS, E = L.E, X = L.X, p = L.plan;
  var t = L.buscador('concentracion');      // t('frase', desde) -> segundo en que se dice

  L.registrar({
    id: 'concentracion', titulo: 'Concentración',
    video: 'largos/concentracion/media/fuente.mp4',
    plan: [
      p.texto(t('celular'), t('celular') + 2, 'el celular', { estilo: 'palabras', color: 'rojo' }),
      p.sticker(t('celular') - 0.1, t('celular') + 2.2, 'mobile-phone', { pos: [1500, 360] }),
      p.camara(t('muy importante') - 0.1, t('muy importante') + 1.6, { zoom: 1.3, foco: [0.5, 0.38], mov: 'golpe' }),
      p.escena(30.2, 36.5, X.Fila, { con: '→', items: [
        { n: 'mobile-phone', txt: 'Notificación', c: t('notificación') },
        { n: 'brain', txt: 'Te distraes', c: t('distraes') }] }),
      p.capitulo(40, 43, { n: 1, de: 3, titulo: '¿Por qué no te puedes concentrar?', ico: 'brain', corto: 'Por qué' }),
      p.cita(a, b, { texto: '…', autor: '…', ico: 'books' }),
      p.lista(a, b, { titulo: 'En este video', items: [{ texto: '…', ico: '…', t: t('…') }] }),
      p.suscribete(a, b), p.meta(a, b, { desde: 700, hasta: 800 }),
      p.cierre(fin - 12, fin)
    ]
  });
})(window);
```

Todos los tiempos son segundos del video y conviene sacarlos de la voz con
`t('frase', desde)`: si la frase se repite, `desde` dice a partir de qué
segundo buscar. `t.fin('frase')` da el final de la frase.

### Beats (`LARGOS.plan`)

| beat | qué hace |
|---|---|
| `texto(ini, fin, txt, o)` | texto clave. `o`: `estilo` golpe/palabras/caja/rotulo, `color`, `marcadas` (palabras en color de acento), `pos` (abajo, arriba, izq, der, [x, y]), `tam`, `rot` |
| `caja` / `rotulo` | atajos de `texto` con ese estilo |
| `sticker(ini, fin, nombre, o)` | `pos`, `tam` (px), `rot`, `entra` pop/cae/lado |
| `imagen(ini, fin, src, o)` | imagen propia (`largos/<id>/media/…`): captura de un estudio, una foto. `estilo` tarjeta/polaroid/completa, `ancho`, `pos`, `pie`, `resaltar: [{ x, y, w, h, c }]` (resaltador amarillo en fracciones de la imagen) |
| `camara(ini, fin, o)` | `zoom`, `foco` [x, y] 0..1, `mov` corte/suave/golpe/empuje, `bn`, `desenfoque`, `oscuro` |
| `escena(ini, fin, C, props, o)` | escena a pantalla completa; `o.entra`/`o.sale`: barrido, empuje, pop, fundido, corte |
| `capitulo(ini, fin, o)` | `n`, `de`, `titulo`, `ico`, `corto` (rótulo de arriba) |
| `cita(ini, fin, o)` | `texto`, `autor`, `ico`, `marcadas` |
| `lista(ini, fin, o)` | `titulo`, `items: [{ texto, ico, t, check }]` |
| `suscribete(ini, fin)` · `meta(ini, fin, { desde, hasta })` · `cierre(ini, fin)` | CTA, meta de suscriptores, pantalla final |
| `sonido(t, tipo)` · `flash(t)` · `sacudida(t)` | sueltos |
| `mantener(ini, fin)` | solo al reeditar: tramo del video viejo que se deja |

Reglas automáticas (no hace falta cuidarlas a mano):
- un texto o sticker de cámara se retira solo antes de que entre la escena
  siguiente (salvo `sobreEscena: true`); si le quedan menos de 0,4 s, no sale;
- dos textos (o dos stickers) en la misma posición no se pisan: el anterior se
  va justo antes de que entre el siguiente;
- las plantillas muestran su primera pieza apenas terminan de entrar, aunque la
  voz la nombre un poco después (una escena nunca entra vacía).

### Escenas armadas (`LARGOS.X`)

`Fila` (stickers en fila con conectores), `Palabra` (frase grande palabra por
palabra), `Vs` (dos mitades), `Alrededor` (centro + causas), `Lista`
(pendientes que se tachan), `Balanza`, `Camino` (fácil/difícil), `Grafico`
(curvas que se dibujan), `Numero` (cuenta), `Multitud` (personas grises con
una destacada), `Paso` (recomendación numerada). Las props están documentadas
en `largo-plantillas.jsx`.

### Kit para escenas propias (`LARGOS.E`)

Piezas posicionadas por su centro en el lienzo de 1920×1080: `Papel` (fondo),
`St` (sticker), `Tx` (texto), `Rot` (rótulo), `Caja`, `Resalta` (resaltador),
`Flecha` (se dibuja), `Signo`, `Check`, `Tacha`, `Tachon`, `Barra`, `Num`,
`Grafico`, `Burbuja`, `Tarjeta`. Todas reciben `T`, `c` (cuándo entra) y `s`
(cuándo sale, opcional). Dentro de una escena se respeta la regla de
`f(fracción)` del resto del repo, o se anclan los tiempos a la voz con `t()`.

## Reeditar un video que ya tiene edición

Fue el caso de disciplina (solo estaba el video publicado). `tramos.py` marca
en qué tramos se ve la cámara y en cuáles había un inserto; el plan tapa cada
inserto con una escena nueva y `revisar-largo.js` avisa si quedó alguno a la
vista. Las placas de texto viejas sobre la cámara se esconden con un primer
plano que las deja fuera de cuadro. La música y los efectos viejos quedan en
el audio. Con el video crudo nada de esto hace falta.
