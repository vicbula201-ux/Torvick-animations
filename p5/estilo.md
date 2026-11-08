# P5 · Guía de edición

**Esta es la guía que se sigue cuando el autor manda un video del P5.** Es el
común denominador de los 25 videos de referencia, reducido a lo que importa:
**cómo se ve y cómo suena la edición** (subtítulos, letras grandes, animaciones,
efectos de sonido, zooms, desenfoques). El guion y las tomas los decide el autor;
el análisis completo de cada categoría está en `reviews.md`, `entrevistas.md`,
`retos.md` y `divagaciones.md`.

**Cómo llega un video:** el autor graba, corta en Premiere y manda el corte **sin
música**, con una línea que diga la categoría («review», «entrevista», «reto» o
«divagando») y, si quiere, qué resaltar. Se edita con el motor del P4
(`cambio.html`, `cambio.jsx`, `herramientas/grabar-cambio.js`): transcripción →
plan → exportación en 1080×1920. **Si llega sin cortar** (las tomas en bruto), el
corte lo arma `herramientas/montar.py` (ver `CAMBIO.md`, «¿Y si mando el video sin
cortar?»).

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
| una cosa concreta (el aguacate, el pollo) | su emoji 3D, uno a la vez | `emoji` | pop |

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

### El cierre

La última línea pide **una sola cosa** (comenta una palabra, guarda, sígueme) y la
pantalla la muestra con la caja de comentario (`cta`). Después, **la firma de
Torvick**, siempre.

### Zonas libres

Nada importante arriba de y 230, debajo de y 1560 ni a la derecha de x 900
entre y 1000 y 1560: ahí van el texto y los botones de Instagram y TikTok.

## Lo que suma cada categoría

### Review (un producto, una comida, un lugar, un suplemento)

| Momento | Qué se ve encima | Sonido |
|---|---|---|
| Primer segundo | **título del tema** en dos tamaños («¿AGUACATE / todos los días?»), 2-3 s | whoosh |
| Cuando lo nombras | el nombre del producto en grande, o **detrás de ti** | golpe |
| Cada dato | **el número en grande** (precio, gramos, calorías) | golpe |
| Propiedades o ingredientes | **la lista que se arma** o rótulos junto al producto en primer plano | pop |
| El mito | tarjeta con la **X**; la verdad, con el **visto** | error / ding |
| Comparando | **notas que se acumulan** («Calidad 9/10», «Precio 7/10») | pop |
| El veredicto | la frase en grande + golpe de zoom | golpe |
| Cierre | «Comenta X» con la caja que se escribe | click |

Cuando la cámara muestra el producto: empuje lento. Cuando lo nombras sin
mostrarlo: su emoji 3D o tu foto del producto (`imagen`).

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

## Ejemplo: una review del aguacate

Lo que pasaría en pantalla con un video de 40 s («el aguacate, sus propiedades»):

| Segundo | Dices | Encima | Sonido |
|---|---|---|---|
| 0-2 | «¿Comes aguacate todos los días?» | «AGUACATE» gigante **detrás de ti**, «¿todos los días?» en la línea chica | golpe |
| 2-5 | «Esto es lo que tiene» | la lista empieza a armarse | whoosh |
| 5-15 | «grasas buenas… fibra… potasio…» | una pastilla por cada una, con el emoji 3D del aguacate al lado | pop × 3 |
| 15-18 | «más potasio que un plátano» | «MÁS POTASIO QUE UN PLÁTANO» con el visto | ding |
| 18-24 | «uno mediano tiene unas 240 calorías» | **240 KCAL** contando, golpe de zoom | golpe |
| 24-30 | «¿engorda?» | tarjeta «engorda» con la X; «depende de cuánto» con el visto | error, ding |
| 30-36 | «medio al día está perfecto» | «½ AL DÍA» en grande, fondo desenfocado | golpe |
| 36-40 | «comenta AGUACATE y te mando…» | la caja de comentario escribiendo «AGUACATE» | click |
| + | — | la firma de Torvick | — |

Y los subtítulos de 1 a 3 palabras corriendo todo el tiempo debajo.

## Lo que todavía hay que construir

El motor del P4 hace casi todo lo de arriba. Lo que falta, por orden, está en
`resumen.md` (el inserto a pantalla completa para las escenas de Tor, las
reacciones de Tor, los subtítulos de dos voces, el confeti, la tarjeta del largo,
entre otros). Se construye cuando llegue el primer video que lo necesite.

## Valores por defecto (se cambian si el autor lo pide)

- **Sin música** (decisión del autor).
- **Subtítulos del P4**, con la palabra grande encima cuando hace falta.
- **Emojis 3D** de `cambio/emoji/`, uno a la vez y pocos; nunca los del sistema.
- **Sin memes** ni clips con derechos de terceros: en su lugar, reacciones de Tor.
