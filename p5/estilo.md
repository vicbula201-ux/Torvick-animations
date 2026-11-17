# P5 · Guía de edición

**Esta es la guía que se sigue cuando el autor manda un video del P5.** Es el
común denominador de los 25 videos de referencia, reducido a lo que importa:
**cómo se ve y cómo suena la edición** (subtítulos, letras grandes, animaciones,
efectos de sonido, zooms, desenfoques). El guion y las tomas los decide el autor;
el análisis completo de cada categoría está en `reviews.md`, `entrevistas.md`,
`retos.md` y `divagaciones.md`.

**Cómo llega un video:** el autor graba y manda las tomas **sin música**, con una
línea que diga la categoría («review», «entrevista», «reto» o «divagando») y, si
quiere, qué resaltar. Pueden llegar **en bruto**: el corte lo arma
`herramientas/montar.py`, con las **tomas de apoyo** encima de la voz y el HDR del
iPhone pasado a color normal (ver `CAMBIO.md`, «¿Y si mando el video sin cortar?»).
Se edita con el motor del P4 (`cambio.html`, `cambio.jsx`,
`herramientas/grabar-cambio.js`): transcripción → corte → plan → exportación en
1080×1920. Las reviews de alimentos tienen su guía completa en
`reviews-alimentos.md`.

## La base: va en todas las categorías

### Subtítulos (siempre)

- **De 1 a 3 palabras**, en minúscula, blancas con sombra negra dura (Inter
  Tight 800). Sin cortar «de | la» al final de una línea.
- **La palabra que suena, en la caja amarilla** (`#FFD400`) con letra negra.
  Los números y las palabras marcadas, en amarillo.
- A la altura del pecho (y 1230 en 1920), entre los botones de la app y la cara.
- Cambian al ritmo de la voz: **algo nuevo en pantalla cada segundo**.

### La palabra grande (la segunda capa)

Cuando se dice algo que hay que recordar, sale **además del subtítulo**, en
grande, y se va cuando termina la idea (1-3 s):

| Qué se dice | Qué sale | Pieza del P4 | Sonido |
|---|---|---|---|
| un número (precio, gramos, kilos, años, repeticiones) | el número gigante, contando hasta el valor | `numero` | golpe |
| la idea clave («NO SON SEGUROS», «SIEMPRE PESADO») | línea chica + línea grande en amarillo | `titulo` | whoosh |
| el remate o el tema («AGUACATE», «PÉPTIDOS») | la palabra gigante **detrás de la persona** | `detras` | golpe |
| algo que está mal / bien | la X roja / el visto verde, o la tarjeta con su ícono | `tarjeta`, `etiqueta` | error / ding |
| una lista (ingredientes, beneficios) | pastillas que aparecen al nombrar cada una | `lista` | pop |
| una cosa que se ve (el aguacate, el envase) | **su nombre encima de la cosa**, pegado a ella aunque se mueva | `rotulo` (+ `herramientas/seguir.py`) | pop |
| una cosa que no se ve | una pastilla con su nombre (y visto, X o aviso) | `etiqueta` con `icono` | click |

### La cámara

- **Golpe de zoom** en la palabra fuerte (acerca 1,2× de golpe y vuelve).
- **Cambio de encuadre en cada corte** (plano medio ↔ primer plano) para que el
  salto no se note. Con una sola toma larga, **un acercamiento por frase**.
- **Empuje lento** en lo emotivo o en el producto quieto.
- **Desenfoque del fondo** cuando sale algo grande encima (el número, el puesto,
  la palabra sola).
- **Blanco y negro y oscuro** para lo duro o lo honesto.
- **Destello o barrido** solo para pasar de un bloque a otro; lo demás, corte
  seco.

### Sonido

- **Sin música** (pedido del autor). La voz a −14 LUFS y los efectos debajo.
- **Cada cosa que entra suena:** pop (tarjetas, emojis, ítems), golpe (números,
  palabras detrás, zoom), whoosh (títulos, cambios de bloque), ding (vistos),
  error (X, tachado), click (etiquetas, la caja de comentario), campana (el
  momento ganador).
- Sin silencios: los cortes de Premiere ya quitan las pausas; si queda alguna, se
  avisa.

### El movimiento

Todo entra animado (0,1-0,3 s: lo grande llega desenfocado y un poco más
grande; las tarjetas, con un rebote corto), sale en 0,2 s y deriva mientras está
en pantalla. Nada aparece de golpe ni se queda quieto.

### El ritmo: una cosa a la vez y tiempo para leer

Lo pidió el autor después del segundo borrador del aguacate: las tarjetas
«aparecen y se van muy rápido, no se alcanzan a leer» y todo junto se veía «muy
saturado». Estímulo sí, pero balanceado:

- **Una cosa a la vez.** Además de los subtítulos, una sola pieza en pantalla;
  la siguiente entra cuando la anterior ya se fue (nunca se montan al salir).
  Con una tarjeta grande en pantalla no entra nada más.
- **Tiempo para leer.** Una tarjeta con datos se queda **2 s después de su
  último dato**; una pastilla, un título o un nombre, 1,5 s. Si la voz ya sigue,
  la pieza siguiente espera.
- **Menos piezas.** De referencia, una pieza cada 3-4 s (en 60 s, unas 15). Un
  dato que la voz ya dice claro no necesita pastilla; tampoco hace falta poner el
  nombre de la misma cosa dos veces. Los golpes de zoom, en el gancho y en el
  momento fuerte (el veredicto), no en cada frase.
- **Un respiro en el corte.** Después de una tarjeta densa (la tabla), dejar
  ~1 s de la toma de apoyo sin voz antes de la frase siguiente, así la voz no se
  adelanta a lo que se lee.

En el plan es `lectura: 2` en el registro: el motor aplica las dos primeras reglas
solo (`CAMBIO.md`) y `grabar-cambio.js <id> --plan` muestra el horario que
quedó.

### El cierre

La última línea pide **una sola cosa** (comenta una palabra, guarda, sígueme) y la
pantalla la muestra con la caja de comentario (`cta`). Después, **la firma de
Torvick**, siempre. Si el autor la dice a cámara («sígueme para más contenido»),
la firma entra **mientras habla**: las redes y @eltorvick arriba, SÍGUEME abajo,
él a la vista (`firma` con `sigueme`).

### Zonas libres

Nada importante arriba de y 230, debajo de y 1560 ni a la derecha de x 900
entre y 1000 y 1560: ahí van el texto y los botones de Instagram y TikTok.

## Lo que suma cada categoría

### Review (un producto, una comida, un lugar, un suplemento)

| Momento | Qué se ve encima | Sonido |
|---|---|---|
| Primer segundo | **la pregunta del tema** gigante detrás de ti («¿SALUDABLE?»), 2-3 s | golpe |
| Cuando lo nombras | **su nombre encima del producto** (`rotulo`), pegado a él aunque lo muevas | pop |
| Los datos (calorías, macros) | **la tabla nutricional**: cada fila se enciende y cuenta cuando la nombras (`tabla`) | pop + subida |
| Una comparación («similar a…») | **barras** que crecen y un remate («¡Casi iguales!») (`barras`) | subida, ding |
| El mito | «Mal alimento» tachado; la verdad, con el **visto** | error / ding |
| Comparando productos | **notas que se acumulan** («Calidad 9/10», «Precio 7/10») | pop |
| El veredicto | **el sello Torvick** con la nota, que se encoge a una esquina (`veredicto`) | golpe, campana |
| Cierre | la pregunta con la caja de comentario (`cta` con `pregunta`) y el cierre dicho: tú preguntas «¿quieres ver más videos similares?» y salen las redes y @eltorvick; en «sígueme», SÍGUEME gigante | click, pop, golpe |

Cuando la cámara muestra el producto: empuje lento o cámara lenta (tomas de apoyo
a 60 fps). Detrás de las tarjetas grandes, la toma se desenfoca y se oscurece
sola. El detalle (formato, tomas, el plan del aguacate) está en
`reviews-alimentos.md`.

### Entrevista (le preguntas algo a alguien)

| Momento | Qué se ve encima | Sonido |
|---|---|---|
| Primer segundo | **la pregunta arriba**, fija mientras dura | whoosh |
| Subtítulos | **dos voces:** tus preguntas en blanco y sin caja; las respuestas, con la caja amarilla | — |
| Una respuesta con número | el número en grande («7 AÑOS», «150.000») | golpe |
| Una respuesta fuerte | la frase entre asteriscos, arriba («\*UNA SOLA COMIDA AL DÍA\*») | golpe |
| Lo que hace | acotación chica («\*lo da todo\*») | pop |
| Cambio de pregunta o de persona | barrido con desenfoque | whoosh |
| Lo que dice la ciencia | tu tarjeta con X o visto (sin burlarte) | error / ding |
| Cierre | **el @ del entrevistado** en grande | pop |

Las reacciones y risas se dejan. En vez de memes: una **reacción de Tor** (cuando
el banco esté hecho; ver `resumen.md`).

### Reto (tú o alguien contra una prueba)

| Momento | Qué se ve encima | Sonido |
|---|---|---|
| Primer segundo | **el reto entero**: la condición y el premio («SI HACES 20 / DOMINADAS / te ganas…») | whoosh |
| Cada participante | **su etiqueta fija** (nombre o deporte) durante su turno | click |
| El peso o la meta | el número grande y brillante («50 KG») | golpe |
| El intento | **el contador de repeticiones** corriendo; los subtítulos siguen el relato («vamos, vamos») | — |
| La repetición que gana | golpe de zoom + **confeti** | campana |
| El premio | la marca o el premio en grande | golpe |
| Cierre | «¿Cuántas haces tú? Comenta» | click |

Si se recortan repeticiones, el contador salta con el número real (2 → 8 → 9).

### Divagando (hablas a cámara de un tema)

| Momento | Qué se ve encima | Sonido |
|---|---|---|
| Primer segundo | **la tesis o la pregunta** en grande; si es de un seguidor, su pregunta en una tarjeta | whoosh |
| Lo que todos creen | la creencia con su **X** | error |
| Tu postura | la frase clave en grande, en amarillo | golpe |
| Las palabras que importan | **dos tamaños**: el subtítulo y, encima, la palabra grande | — |
| Lo emotivo | empuje lento; blanco y negro si es duro | — |
| Lo que se puede mostrar | corte a la toma de apoyo (tú entrenando, en cámara lenta) | — |
| La analogía | **escena animada con Tor** a pantalla completa | pop / whoosh |
| Cierre | la tarjeta del largo: «Comenta X y te mando el video completo» | click |

Con una sola toma larga, el ritmo lo dan los acercamientos: uno por frase.

## Ejemplo: la review del aguacate

Está completa en `reviews-alimentos.md`: el formato, el mapa segundo a segundo, los
datos, cómo grabar y el plan ya armado (`cambios/aguacate/plan.jsx`).

## Lo que todavía hay que construir

El motor del P4 hace casi todo lo de arriba. Ya están (noviembre de 2026): las
tomas de apoyo y el corte desde las tomas en bruto (`montar.py`), los rótulos que
siguen a los objetos (`seguir.py`), la tabla, las barras, el sello del veredicto,
la pregunta, el cierre grande, el cierre dicho y el ritmo (`lectura`). Lo que falta, por orden, está en `resumen.md` (el
inserto a pantalla completa para las escenas de Tor, las reacciones de Tor, los
subtítulos de dos voces, el confeti, la tarjeta del largo, entre otros). Se
construye cuando llegue el primer video que lo necesite.

## Valores por defecto (se cambian si el autor lo pide)

- **Sin música** (decisión del autor).
- **Subtítulos del P4**, con la palabra grande encima cuando hace falta.
- **Sin emojis** (al autor no le convencieron en la divagación): en su lugar, el
  nombre encima de la cosa (`rotulo`) o una pastilla con ícono. Los 3D de
  `cambio/emoji/` quedan para el P4.
- **Sin memes** ni clips con derechos de terceros: en su lugar, reacciones de Tor.
