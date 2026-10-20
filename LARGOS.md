# Videos largos de YouTube — estilo y flujo

Los videos educativos largos (10 a 13 min, 16:9) se editan solos a partir del
video con los cortes finales: se transcribe la voz, se escribe un **plan**
(qué aparece y cuándo, anclado a las palabras que se dicen), se revisa y se
graba. Nada de línea de tiempo a mano.

```
largo.html            vista previa: el video corre y encima se ven las capas (doble clic)
largo.jsx             el motor: cámara, texto detrás de la persona, escenas, textos, tarjetas, CTA, sonidos
largo-iconos.jsx      LARGOS.I: los íconos de línea (diana, pesa, cerebro, batería…)
largo-plantillas.jsx  LARGOS.X: escenas armadas con datos (Frase, Barras, Comparar, Camino…)
prueba-largos.html    todos los íconos y las poses del monigote (doble clic)
largos/perfil.jpg     la foto de perfil del botón de suscripción
largos/<id>/
  media/fuente.mp4    el video con los cortes finales (no va a git)
  media/recorte/      máscaras de la persona para los textos detrás (generadas, no van a git)
  transcripcion.*     .json/.js/.txt con el tiempo de cada palabra (generado)
  plan.jsx            el plan de edición de ese video
herramientas/
  transcribir.py      voz -> palabras con tiempo (parakeet + whisper, sin internet)
  recortar.py         separa a la persona del fondo (Robust Video Matting) para p.detras
  revisar-largo.js    revisa el plan antes de grabar
  grabar-largo.js     graba el MP4 final (1080p o 4K) + subtítulos .srt
  tramos.py           solo para reeditar un video que ya traía edición
  audio.py            mezcla voz + efectos (+ música opcional)
```

## Flujo semanal

1. **Grabar y cortar** (los cortes son del autor). Exportar el **master** en
   4K, 30 fps, sin textos ni música quemados. Encuadre con aire a los
   costados: los titulares van al lado de la cara. Los clips propios
   (gimnasio, b-roll) van dentro del corte; capturas de estudios y fotos, como
   archivos sueltos en `media/` (se ponen con `p.imagen` o `p.paper`).
2. **Mandar un liviano para planificar**: el mismo corte comprimido (720p o
   1080p, ~30 MB) más el guion con notas si hay algo puntual ("en
   'pestañas' va la captura del estudio"). Con eso se transcribe y se escribe
   el plan: los tiempos son los mismos que en el master porque el corte es
   el mismo.
3. `python3 herramientas/transcribir.py largos/<id>/media/fuente.mp4 --out largos/<id>/transcripcion.json`
4. Escribir `largos/<id>/plan.jsx` (receta abajo) y sumar sus dos `<script>`
   en `largo.html`.
5. `node compilar.js && node herramientas/revisar-largo.js <id>`
6. Mirar `largo.html#<id>` o fotos sueltas:
   `node herramientas/grabar-largo.js <id> --cuadros 12.5,40,61`
7. **Exportar en 4K con el master**:
   `node herramientas/grabar-largo.js <id> --fuente ruta/al/master.mp4 --4k`
   → `videos/<id>.mp4` (3840×2160) + `videos/<id>.srt`. Los gráficos se
   dibujan al doble de resolución y la cámara sale del master sin pasar por el
   comprimido. Los tramos con la cámara limpia pasan directo, sin navegador.

### Entregas en 4K (el video pesado)

El adjunto de Claude Code obliga a comprimir, y eso es lo que borroneaba el
video de disciplina (llegó en 1280×720). Dos caminos:

- **Liviano + render en tu PC (recomendado).** Mandas el liviano para
  planificar; cuando el plan está, en tu computadora corres el paso 7 con el
  master. Una sola instalación: Node, ffmpeg, Python 3 con `numpy` y
  `onnxruntime`, y `npm i -g playwright && npx playwright install chromium`.
  Un video de 12 min en 4K tarda del orden de 1 a 3 h según la máquina.
- **Subir el master a Google Drive** y pasar el enlace. Hace falta que el
  entorno de Claude pueda entrar a Drive: en la configuración del entorno,
  *Network access* → agregar `drive.google.com` y
  `drive.usercontent.google.com` a *Allowed domains*. Ahí se baja el master y
  el render 4K sale de acá.

## El estilo

**La base son las animaciones originales de disciplina**: fondo claro, línea
de tinta pareja y redondeada, monigotes de palitos, dianas, barras amarillas
y grises, etiquetas negras con flechita, números de capítulo "01 | PREGUNTA",
HOY en rojo → MAÑANA en verde. Encima, lo que hace que se vea profesional
(lo que hacen Borja, Jeff Nippard, Adrián Sáenz y Adrià Solà):

- **Tipografía**: Inter Tight 900/800 con el espaciado cerrado (números y
  titulares enormes, como Borja), IBM Plex Mono para rótulos chicos
  ("CAPÍTULO 1 DE 3", "cada punto = 1 persona"). Nada de contornos gruesos ni
  sombras duras.
- **Resaltado**: la palabra clave va en **caja amarilla que se estira de
  izquierda a derecha** y el texto pasa a tinta.
- **Movimiento**: todo entra con *ease-out* exponencial (acelera y frena en
  seco), subiendo desde una línea de corte (máscara) y enfocándose desde un
  desenfoque. Las palabras entran **al ritmo de la voz**. Las líneas se
  dibujan solas. Los números cuentan. Sale rápido hacia arriba.
- **Profundidad**: sombras suaves y largas en tarjetas, fondo de papel con
  viñeta suave, empuje lento de toda la escena (nada queda quieto, sin
  rebotes de caricatura).
- **Sin emojis ni stickers.** El color sale de la paleta.

**Paleta**: tinta `#14110F`, amarillo `#FFD400` (lo clave), blanco/papel;
rojo `#E03A2F` (error, lo que daña) y verde `#16A06A` (lo correcto, el
progreso) solo de apoyo; gris `#C9C3B8` para lo secundario.

**Sobre la cámara** (el presentador es la estrella: más de la mitad del
video), de más a menos frecuente:
- `texto` (estilo `linea`): la frase clave abajo, palabra por palabra al
  ritmo de la voz, con velo oscuro suave detrás. Una cada 10-20 s de cámara.
- `titular`: texto grande al costado de la cara (Sáenz), con línea chica
  debajo y barra opcional. Para las ideas fuertes, 1 cada ~1 min.
- `detras`: **la palabra gigante detrás de la persona** (Nippard). La firma;
  4-6 por video, en los remates.
- `caja` (tinta sobre amarillo), `etiqueta` (la negra con flechita, para
  nombres y datos sobre clips), `tarjeta` (blanca flotante con título,
  número, lista o barra), `dato` (caja oscura con números grandes), `paper`
  (recorte de un estudio con la frase resaltada), `imagen`.
- Cámara: primer plano corto (`golpe`) en los remates, `empuje` lento en lo
  emotivo, blanco y negro para la ironía.

**Escenas a pantalla completa**: una idea por escena, 2 a 8 s, armada mientras
se habla (cada pieza entra cuando se la nombra). Rótulo amarillo arriba a la
izquierda (`encabezado`) cuando hace falta contexto.

**Transiciones**: `latigo` (paneo rápido con desenfoque: la de todos los
días), `barrido` (panel amarillo con filo de tinta: para abrir capítulos y
escenas importantes), `zoom` (la cámara se acerca y la escena llega desde
grande), `fundido`, `pop`, `corte`. Y la **escena dividida**
(`{ camara: 'der' }`): la cámara se achica a una tarjeta al costado y la
explicación queda al lado, sin perder la cara.

**Sonido**: whoosh (transiciones, tarjetas, titulares), pop suave (frases),
click (etiquetas), ding (vistos), error (X), golpe (capítulos, texto detrás),
click + campana (suscribirse). Sintetizado por `audio.py`; los efectos quedan
por debajo de la voz (~-19 dBFS).

## Cómo escribir el plan (receta)

1. Leer `transcripcion.txt` entero y marcar: gancho, capítulos (preguntas),
   analogías, números, citas, remates, pedidos de suscripción.
2. Capítulos → `p.capitulo`; lo que se promete al inicio → escena
   `X.Opciones` (se enciende cada punto cuando se nombra).
3. Cada explicación que se entiende mejor dibujada → una escena anclada a las
   palabras con `t()`.
4. Sobre la cámara: frases clave, 1 titular por minuto, 4-6 textos detrás,
   un cambio de encuadre cada 10-15 s.
5. Densidad de referencia para 10 min: 25-40 escenas y la cámara en pantalla
   más del 55 % del tiempo.
6. `revisar-largo.js` + fotos sueltas en los momentos clave.

## El plan

```jsx
(function (global) {
  var L = global.LARGOS, E = L.E, X = L.X, p = L.plan;
  var t = L.buscador('concentracion');      // t('frase', desde) -> segundo en que se dice

  L.registrar({
    id: 'concentracion', titulo: 'Concentración',
    video: 'largos/concentracion/media/fuente.mp4',
    plan: [
      p.texto(t('el celular') - 0.05, t('el celular') + 2, 'el celular te distrae', { marcadas: ['celular'] }),
      p.titular(t('pestañas') - 0.1, t('pestañas') + 3, '47 pestañas\nabiertas', { marcadas: ['pestañas'], sub: 'así está tu cerebro' }),
      p.detras(t('foco') - 0.05, t('foco') + 2, 'FOCO', { color: 'amarillo' }),
      p.camara(t('muy importante') - 0.1, t('muy importante') + 1.6, { zoom: 1.25, foco: [0.5, 0.4], mov: 'golpe' }),
      p.escena(30.2, 36.5, X.Fila, { con: '→', items: [
        { n: 'celular', txt: 'Notificación', c: t('notificación') },
        { n: 'cerebro', txt: 'Te distraes', c: t('distraes') }] }),
      p.paper(a, b, { fuente: 'Ward et al. · 2017', texto: '…', resaltar: '…' }),
      p.capitulo(40, 43, { n: 1, de: 3, titulo: '¿Por qué no te puedes concentrar?', corto: 'Por qué' }),
      p.cita(a, b, { texto: '…', autor: '…', rol: '…' }),
      p.escena(a, b, X.Barras, { encabezado: '…', barras: [{ v: 47, txt: '…' }, { v: 12, txt: '…', color: 'amarillo' }] }, { camara: 'der' }),
      p.suscribete(a, b),
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
| `texto(ini, fin, txt, o)` | frase clave abajo al ritmo de la voz. `o`: `marcadas` (palabras en caja amarilla; `'qué'` con tilde no marca `'que'`; `'palabra:verde'` cambia el color de la caja), `pos`, `tam`, `color`, `voz: false` (entra toda junta, sin esperar a la voz) |
| `titular(ini, fin, txt, o)` | texto grande al costado. `lado` izq/der, `sub` (+ `cSub`: cuándo entra), `barra` (0..1), `marcadas`, `tam` |
| `caja` · `etiqueta` | tinta sobre amarillo · la negra con flechita (`dir`, `pos`) |
| `detras(ini, fin, txt, o)` | palabra gigante detrás de la persona. `color`, `x`, `y`, `tam`. La cabeza tapa ~300 px: mejor palabras largas y grandes, o dos palabras con espacios de más para que la cabeza caiga en el hueco (`'¿POR   QUÉ?'`) |
| `tarjeta(ini, fin, o)` | tarjeta blanca flotante: `lado`, `etiqueta`, `titulo`, `valor` + `unidad`, `texto`, `items: [{ texto, bien, mal }]`, `barra` |
| `dato(ini, fin, o)` | caja oscura: `filas: [{ etiqueta, valor, unidad, color }]`, `lado` |
| `paper(ini, fin, o)` | recorte de un estudio: `fuente`, `texto`, `resaltar` (palabras), `pos` |
| `imagen(ini, fin, src, o)` | imagen propia: `estilo` tarjeta/completa, `ancho`, `pos`, `pie`, `resaltar: [{ x, y, w, h, c }]` |
| `camara(ini, fin, o)` | `zoom`, `foco` [x, y] 0..1, `mov` corte/suave/golpe/empuje, `bn`, `desenfoque`, `oscuro` |
| `escena(ini, fin, C, props, o)` | pantalla completa; `o.entra`/`o.sale`: latigo, barrido, zoom, fundido, pop, corte; `o.camara: 'der'/'izq'` la vuelve dividida |
| `capitulo(ini, fin, o)` | `n`, `de`, `titulo`, `corto` (rótulo de arriba), `marcadas` |
| `cita(ini, fin, o)` | `texto`, `autor`, `rol`, `marcadas`, `previa: true` (la frase entera ya está en tenue y cada palabra se entinta con la voz: no queda vacía mientras la voz presenta al autor) |
| `lista(ini, fin, o)` | `titulo`, `items: [{ texto, ico, t, check, tacha }]` |
| `suscribete(ini, fin)` · `meta(ini, fin, { desde, hasta })` · `cierre(ini, fin)` | CTA con la foto de perfil, meta de suscriptores, pantalla final |
| `sonido(t, tipo)` · `flash(t)` · `sacudida(t)` | sueltos |
| `mantener(ini, fin)` | solo al reeditar: tramo del video viejo que se deja |

Reglas automáticas (no hace falta cuidarlas a mano):
- lo de encima de la cámara termina de salir antes de que arranque la
  transición de una escena (salvo `sobreEscena: true`); si le quedan menos
  de 0,4 s, no sale y `revisar-largo.js` avisa ("texto muy corto");
- el rótulo chico de capítulo se retira antes de la escena siguiente;
- dos cosas en la misma zona no se pisan: la anterior se va justo antes;
- las plantillas muestran su primera pieza apenas terminan de entrar (una
  escena nunca entra vacía);
- `grabar-largo.js` calcula solo las máscaras que piden los `detras`.

### Escenas armadas (`LARGOS.X`)

`Frase`, `Numero`, `Barras`, `Comparar`, `Fila`, `Balanza`, `Camino`,
`Progreso`, `Capas`, `Bateria`, `Pensamiento`, `Alrededor`, `Grafico`,
`Puntos`, `Opciones`, `Icono`, `Paso`, `Multitud`, `Tareas`, `Calendario`.
Las props están en la cabecera de `largo-plantillas.jsx`. Todas aceptan
`encabezado` y funcionan como escena dividida.

### Kit para escenas propias (`LARGOS.E`)

`Escena` (fondo + empuje), `Fondo`, `Pos`, `Palabras` (tipografía cinética),
`Titulo`, `Texto`, `Rot`/`Etiqueta`, `Ico`/`Icono` (íconos de línea que se
dibujan solos), `Monigote`/`Figura` (poses: depie, brazos, señala, empuja,
triste, sentado, piensa, carga, caído, camina, corre; `{ de, a, k }` mezcla
dos), `Flecha`, `Linea`, `Check`, `Tacha`, `Tachon`, `Barra`, `Num`,
`Tarjeta`, `Barras`, `Grafico`, `Puntos`, `Burbuja`, `Opciones`. Reciben `T`,
`c` (cuándo entra) y `s` (cuándo sale, opcional). Ejemplos de escenas propias:
`largos/disciplina/plan.jsx`.

## Reeditar un video que ya tiene edición

Fue el caso de disciplina (solo estaba el video publicado, en 720p). `tramos.py`
marca en qué tramos se ve la cámara y en cuáles había un inserto; el plan tapa
cada inserto con una escena nueva y `revisar-largo.js` avisa si quedó alguno a
la vista (y si una escena dividida mostraría uno en su tarjeta). Las placas de
texto viejas sobre la cámara se esconden con un primer plano corto (zoom 1,4
con el foco arriba: con 1,3 asomaban; si la placa está más alta, 1,5-1,55). Un
tramo de cámara de menos de ~1 s entre dos escenas se tapa encadenándolas con
`corte` (si no, la cámara parpadea entre dos látigos). La música
y los efectos viejos quedan en el audio. Con el video crudo nada de esto hace
falta.
