# P5 · Reviews: el estilo de edición de las referencias

P5 son cuatro tipos de video: **reviews, entrevistas, retos y divagaciones**.
Este archivo es el de reviews. **Estado: lote 2 de 3 (10 de 14 videos).** Los 4
que faltan van a confirmar o corregir lo que sigue; lo marcado como
«propuesta» es lo que todavía falta decidir.

Cómo se midió: cortes con `ffmpeg` (cambio de escena > 0,25, y > 0,08 para los
jump cuts), un cuadro por segundo revisado a ojo, subtítulos leídos con OCR,
volumen con `ebur128` y espectrogramas del audio. No hay transcripción: el
servidor no puede bajar los modelos de voz, así que el texto sale de los
subtítulos quemados en el video.

## Los 10 videos

| # | Post de IG | De qué trata | Subtipo | Duración | Plano típico | Subtítulos | Cierre |
|---|---|---|---|---|---|---|---|
| 1 | `DchRoTVxejZ` | Cinco lugares para comer fit en Barranquilla («parte uno») | lugar | 74 s | 1,3 s | A | corta a mitad de frase (loop) |
| 2 | `DcUgTN6gDbv` | Comida «deliciosa y sin culpa» en Medellín | lugar | 52 s | 0,9 s | ninguno, solo el título | selfie en el espejo, sin CTA |
| 3 | `DbOSjkttXLO` | ¿Hamburguesa y platanitos saludables? Con sensor de glucosa | lugar + experimento | 67 s | 1,3 s | B | frase propia: «no tienes que escoger entre rico o sano» |
| 4 | `DaQAdx5MmRk` | «El McDonald's versión fitness» de Barcelona | lugar | 38 s | 0,8 s | C | pregunta: «¿ya sabes con quién vas a venir? ⬇️» |
| 5 | `DZJGFuhRPwV` | ¿Dónde almorzar saludable? Bowls en Santiago | lugar | 53 s | 0,9 s | D | «Guarda este dato para no perderlo» |
| 6 | `DOrl41gjmjT` | Alpinito extra proteico (receta) | receta | 51 s | 1,2 s | A | la prueba: «es una locura» |
| 7 | `DXmb9VWjnov` | El pedido de McDonald's para perder grasa (un nutricionista) | pedido inteligente | 49 s | 1,6 s | E | «si quieres aprender a comer gustitos de vez en cuando…» |
| 8 | `DSKz9ICAMCR` | ISO100: «la mejor proteína del mundo» | producto | 49 s | 2,8 s | A, arriba | «si ya la conocías déjanos en comentarios y seguinos» |
| 9 | `DVcMzIfD4Zf` | Las 3 mejores creatinas por menos de $100.000 (2026) | ranking | 59 s | 1,7 s | F | código de descuento + «escríbeme» + «sígueme» |
| 10 | `DZ0E_K3RZyI` | Calificando las proteínas más famosas (4 marcas) | comparativa con notas | 86 s | 3,0 s | G | «Comenta "Suplementos"» |

Todos están en vertical, 720×1280 a 25-30 fps, y a −14 LUFS (lo que pide
Instagram). Duran entre 38 y 86 s; la mediana es 52 s, más que los reels
animados de 30-35 s. **Una review no se sostiene por ser corta, sino porque
algo cambia cada segundo:** un corte, un subtítulo, una nota o un precio.

## Seis subtipos

El lote 1 eran todos lugares; el lote 2 abrió el abanico. El esqueleto es el
mismo (gancho → qué es → lo concreto → veredicto → CTA), pero cada subtipo tiene
su recurso propio:

| Subtipo | Videos | El gancho | El recurso que lo sostiene | El veredicto |
|---|---|---|---|---|
| **Lugar** | 1-5 | «Lugares para comer fit en…», «¿Hamburguesa saludable?» | desfile de platos en planos de 1 s; el pin con la dirección | precio + para quién y cuándo |
| **Receta** | 6 | **el resultado primero**: los dos tuppers en la mano + el nombre gigante | la tarjeta de macros al segundo 4; los pasos en primeros planos | la prueba en cámara («es una locura») |
| **Pedido inteligente** | 7 | «Este es el pedido que debes hacer si estás buscando perder grasa» | **cambia las cosas en la bandeja** mientras lo dice; las calorías antes y después (1.360 → 637) | «puedes comer lo que te gusta en déficit calórico» |
| **Producto** | 8 | un superlativo: «la mejor proteína del mundo» | **el producto es el protagonista**: tu cara solo 4 s, después todo es el envase (empujes lentos, la etiqueta, el scoop, el sello de certificación) | por qué «es considerada la mejor» |
| **Ranking** | 9 | «Las mejores creatinas por menos de $100.000» + el año | **cuenta atrás 3 → 2 → 1** con tarjetas 1-2-3 en la mesa que se van llenando; el precio de cada una en grande | el #1 con corona + el código de descuento |
| **Comparativa con notas** | 10 | «Calificando las proteínas más famosas» | **las notas se acumulan** en pastillas («Calidad: 10/10», «Endulzante: 6.5/10», «Precio: 7/10») y se reinician con cada marca | **una ganadora por necesidad**: «si buscas un perfil limpio, gana Sascha; si buscas economía, gana Power; si eres intolerante a la lactosa…» |

Dos recursos de estructura que hacen que la gente se quede hasta el final:

- **La cuenta atrás** (9): el #1 se guarda para el final.
- **Las notas que se acumulan** (10): hay que llegar al final para saber cuál
  gana, y el veredicto por necesidad le sirve a todos y no pelea con ninguna
  marca.

## La fórmula: lo que se repite

1. **El primer cuadro ya muestra lo que se reseña,** en su mejor momento: la
   comida, el resultado de la receta, el envase en la mano o los productos
   ordenados en la mesa. Nunca un logo ni una fachada.
2. **Un título de 3 a 7 palabras en los primeros 2-7 s** que promete algo
   concreto. Los ganchos que aparecen:
   - **la lista útil:** «Lugares para comer fit en Barranquilla», «Las mejores
     creatinas por menos de $100.000»;
   - **la pregunta polémica:** «Hamburguesa & Platanitos ¿Saludables?»;
   - **la promesa con un objetivo:** «el pedido que debes hacer si estás
     buscando perder grasa»;
   - **el superlativo:** «la mejor proteína del mundo»;
   - **la comparación con una marca conocida:** «el McDonald's versión fitness»;
   - **el formato de serie:** «Calificando proteínas», «parte uno».
3. **Los criterios, dichos al principio** (9 y 10): «monohidrato, alta
   calidad, buen precio». El que mira sabe qué se va a juzgar.
4. **Un dato concreto en cada bloque:** precio («$74.900», «desde 10 euritos»),
   gramos («25 g de proteína», «48,2 g»), calorías («1.360 → 637»), glucosa
   («94 → 122 mg/dL»), una nota («10/10»). En los 10 videos hay al menos uno.
5. **Credibilidad a la vista:** el nutricionista con el uniforme y su logo (7),
   el sensor de glucosa (3), el sello «Informed Choice» en primer plano (8), el
   registro sanitario y «100 % originales» (9).
6. **Una objeción resuelta:** «ya no me puedes decir que comer saludable es
   caro», «nunca puedes comer comida rápida», «la comida sana siempre se ve así».
7. **El veredicto dice para quién es**, no solo si es bueno: «después de
   entrenar», «si eres intolerante a la lactosa», «si buscas economía».
8. **El cierre, en una línea:** comentar una palabra (10), escribir por
   mensaje o seguir (9), comentar si ya lo conocías (8), guardar (5), etiquetar
   (4), una frase propia (3) o la última mordida (6). El 4 y el 9 suman un
   descuento (de la marca o con un código).

**La personalidad también se edita.** El «papi» vuelve en los videos 1 y 6
(«papi patrocíname», pidiéndole el patrocinio a la marca en cámara, con humor).
El 9 cierra con su lema: «sin nada de cuentos». El 3 lo plantea como
experimento. El 1 anuncia una serie («parte uno»).

## Ritmo de corte

| | Planos | Mediana | p90 | Más largo | Cortes cada 10 s |
|---|---|---|---|---|---|
| 1 · Barranquilla | 39 | 1,30 s | 4,6 s | 8,6 s | 5,1 |
| 2 · Medellín | 56 | 0,93 s | 1,1 s | 1,8 s | 10,6 |
| 3 · Glucosa | 26 | 1,34 s | 5,6 s | 13,6 s | 3,7 |
| 4 · Barcelona | 44 | 0,83 s | 1,5 s | 2,0 s | 11,2 |
| 5 · Santiago | 60 | 0,85 s | 1,3 s | 1,8 s | 11,1 |
| 6 · Receta | 35 | 1,20 s | 3,1 s | 5,5 s | 6,6 |
| 7 · McDonald's | 24 | 1,57 s | 4,0 s | 6,6 s | 4,7 |
| 8 · ISO100 | 14 | 2,78 s | 6,9 s | 8,7 s | 2,6 |
| 9 · Creatinas | 27 | 1,73 s | 3,5 s | 10,9 s | 4,4 |
| 10 · Notas | 25 | 3,00 s | 6,8 s | 9,7 s | 2,8 |

(Planos contando los jump cuts. En el 8 la cámara siempre se mueve, con empujes
lentos, así que hay más cambios de los que se cuentan.)

Dos formas de montar:

- **Montaje (2, 4 y 5, los lugares):** un corte cada 0,8-1 s, casi como un
  metrónomo, y nunca más de 2 s en el mismo plano. La voz sigue de corrido por
  encima.
- **Presentador con objetos (1, 3, 6, 7, 9 y 10):** la cara se sostiene de 1,5
  a 3 s de mediana y hasta 10-15 s, con jump cuts para quitar las pausas, zooms
  de golpe en la palabra fuerte y planos de detalle del producto cada vez que se
  nombra. Lo que mantiene el ritmo es el texto: **algo nuevo en pantalla cada
  ~1 s** (subtítulo, nota, precio, título).

**Dónde cae el corte:** en 5 de los 9 videos con audio (5, 6, 7, 8 y 10),
del 42 al 69 % de los cortes cae a menos de 80 ms de un golpe del audio, casi
siempre el arranque de una palabra (por azar serían del 29 al 44 %). **Se corta
al empezar una palabra, no a mitad de una.**

**Propuesta para ti:** en los lugares y las recetas, un plano de ~1 s con tu
cara en 1 de cada 3 o 4. En los productos, rankings y comparativas, tu cara
hasta 3 s con jump cuts y un primer plano del producto cada vez que lo nombres.
En los dos casos, algo nuevo en pantalla cada segundo.

## Voz y sonido

- **Voz sin huecos:** en 8 de los 9 con audio el silencio es menos del 4 % del
  video.
  Se cortan todas las respiraciones y los titubeos, a ~3 palabras por segundo.
- **Siempre suena algo debajo** (música baja o el ambiente): entre palabra y
  palabra el sonido no baja más de unos 25 dB por debajo de la voz. Solo el 3 tiene
  silencios de verdad.
- **El silencio como recurso (3):** en «2 horas después» quedan 2,6 s de
  silencio con un tic-tac de reloj sobre negro.
- **Micrófono de solapa** a la vista en el 6, el 7 y el 9: la voz limpia
  importa más que la imagen.
- **El 4 llegó sin audio:** la música se puso dentro de Instagram (la
  biblioteca con derechos) y se pierde al descargarlo. Si usas música de la app,
  ponla al publicar, no en la edición.
- **Exportar a −14 LUFS**, como todos.

## Texto en pantalla

### Siete formas de subtitular

| | Videos | Cómo se ve | Palabras | Dónde | Énfasis |
|---|---|---|---|---|---|
| **A** | 1, 6, 8 | MAYÚSCULAS, sans gruesa, blanco con contorno o sombra | 2-3 por pantalla, ~0,75 s | abajo (75-78 %); en el 8, arriba (20 %) | la palabra que suena, en amarillo |
| B | 3 | MAYÚSCULAS condensadas, chicas | 2-4 | 78 % | la palabra que suena, en una caja negra |
| C | 4 | la frase entera en minúscula, de 1 a 3 líneas | 6-19, ~1,5 s | 75 % | un trozo en amarillo + un emoji al final |
| D | 5 | minúscula blanca con sombra, que crece palabra por palabra | hasta 3 líneas | 70-75 % | palabras sueltas gigantes y animadas |
| **E** | 7 | dos tamaños: minúscula blanca chica + **la palabra clave grande en verde menta** | 2-4 | a la altura del pecho | la clave en otro color y el doble de grande |
| **F** | 9 | dos capas: el subtítulo en minúscula muy chica arriba + **titulares en MAYÚSCULAS condensadas** («MONOHIDRATO», «ALTA CALIDAD», «BUEN PRECIO») | 1-2 en el titular | arriba, sobre la cabeza | el titular es la idea, no la frase |
| G | 10 | minúscula blanca simple, sin contorno | 2-4 | se mueve: sobre la cabeza o a la altura del torso | ninguno |

**La A es la más repetida** (3 de 10, y la B es la misma idea con una caja) y la
**E y la F** hacen lo mismo en dos capas: la frase chica y la palabra que
importa, grande. Todas separan **lo que se dice** de **lo que hay que
recordar**.

**Propuesta para ti (se confirma con el lote 2):** la mecánica de la A, que es
la que ya tiene el P4 en `cambio.jsx`: 1-3 palabras en minúscula en Inter
Tight 800, la que suena en una caja amarilla (`#FFD400`) con letra negra.
Encima, como en la E y la F, **la palabra clave o el número en grande** con
`titulo` o `numero` del P4 cuando se dice algo que hay que recordar (el precio,
los gramos, «monohidrato»). Usar los mismos subtítulos que en el P4 hace que
todos tus videos a cámara se reconozcan como tuyos.

### Lo demás que va encima

- **El título del gancho:** caja negra de Instagram (1), blanco con sombra (2),
  en el pecho con la pregunta en amarillo (3) o **detrás de la persona** (6:
  «ALPINITO» gigante detrás de la cabeza, con «EXTRA» en amarillo y
  «PROTEÍCO» en blanco cursiva). Se va a los 2-7 s.
- **Tarjeta de macros** (6): caja negra con viñetas blancas («Calorías: 275
  kcal · Proteína: 48,2 g · Grasa: 1 g · Carbohidratos: 17,4 g»), justo después
  del gancho y antes de la receta.
- **Notas que se acumulan** (10): pastillas blancas con letra negra, una por
  criterio, que aparecen cuando se dice la nota y se borran al pasar a la
  siguiente marca.
- **El puesto del ranking** (9): «3er LUGAR», «2do LUGAR» con el fondo
  desenfocado; el «#1» con una corona; el año («2026») arriba a la derecha.
- **Precios** en grande, dorados con sombra (9) o a máquina de escribir (4 y 5).
- **Números que cambian** (3 y 7): la glucosa que sube y baja con la voz; las
  calorías del pedido (1.360) y las del pedido nuevo (637).
- **Pin con la dirección** (4 y 5): el nombre en amarillo y la dirección en
  blanco debajo.
- **Rótulos de ingredientes** junto al plato en primer plano (3): «Aceite de
  oliva, agua y sal de Himalaya», «48 hrs de fermentación».
- **Datos encima de la imagen** (3): el gráfico del sensor de glucosa, con una
  nota escrita a mano al costado («Muy normal.»).
- **Placa de tiempo** (3): barrido → negro → «2 / HORAS DESPUÉS» con las letras
  que se separan → destello. Unos 2,6 s, con tic-tac.
- **Patrocinio y descuento:** el nombre de la marca entra cerrando el
  espaciado entre letras (4), el logo de la tienda vuela sobre la imagen (9), el
  código en grande («CREA100», 9).
- **El CTA de comentar una palabra** (10): «Comenta "Suplementos"» grande sobre
  el pecho durante los últimos 4 s. Es lo que activa la respuesta automática
  por mensaje.
- **Transiciones:** casi todo es corte seco. Los únicos adornos son los
  destellos de luz (9), el barrido en X (3) y el zoom de golpe en la palabra
  fuerte (1, 7, 9).

## Las tomas que hay que grabar

**Lugar:** la fachada con el letrero (2-3 s) · el interior · la carta, la
máquina o la vitrina con el precio legible · por cada plato: la mesa desde
arriba, el detalle a 20 cm, la acción (salsa, corte, queso), tú mordiendo y tu
reacción (sostenla un segundo sin hablar) · tú a cámara: el gancho (2
versiones), el dato, el veredicto y el cierre.

**Receta:** primero el resultado terminado, en la mano, a cámara (será el
gancho) · cada ingrediente en la mano, con la marca a la vista · cada paso en
primer plano desde arriba (lo que cae, lo que se mezcla, la textura) · tú
probándolo al final.

**Producto, ranking o comparativa:** los productos ordenados en la mesa, a la
altura del pecho (el plano general vuelve una y otra vez) · tú a cámara con el
micrófono de solapa · cada producto en la mano, acercándolo a la cámara · los
detalles: la etiqueta nutricional, el sello de certificación, el scoop, el
polvo disolviéndose en el agua · empujes lentos sobre el envase quieto. Si es
un ranking, tarjetas con el 1, el 2 y el 3 en la mesa (en el 9 son de cartón
amarillo, el amarillo de tu marca).

**Pedido inteligente:** la bandeja con el pedido de siempre · tú pidiendo en el
mostrador o la máquina · el cambio hecho con las manos, plato por plato, en la
misma bandeja · la bandeja nueva · tú comiendo.

Graba en vertical y en 4K si puedes, para tener margen para los zooms.

## Cómo se adapta a Torvick (propuesta)

- **Los suplementos son tu terreno:** ya hiciste el largo de creatina. Un
  **ranking** o una **comparativa con notas** de creatinas, proteínas o
  pre-entrenos es el subtipo más tuyo, y los criterios pueden ser los de la
  ciencia: tipo (monohidrato), dosis por porción, certificación de terceros,
  precio por porción y, en proteínas, el precio por gramo de proteína.
- **El veredicto por necesidad** («si buscas economía, gana…») te deja
  recomendar sin pelearte con ninguna marca, y deja la puerta abierta a
  patrocinios.
- **El pedido inteligente** encaja con los videos de nutrición de Tor: el
  pedido de siempre con su X, el cambio, las calorías antes y después, el visto.
- **La receta proteica** con su tarjeta de macros es un formato fácil de
  repetir cada semana.
- **El experimento (3)** sigue siendo el que más se parece a tu canal: una
  review con una medición.
- **La paleta de cinco también aquí:** el amarillo para la palabra que suena,
  lo deseable y los puestos; el rojo para lo que se descarta; el verde para lo
  correcto. Donde las referencias ponen ✅ o ❌, van la X y el visto del
  sistema. **Emojis:** las referencias 4, 8 y 9 los usan (la corona del #1,
  el planeta de «del mundo»); en los largos se veían «chafa» y en el P4 solo van
  los 3D de `cambio/emoji/` (hay `trofeo` y `medalla`). Para P5 propongo lo mismo
  que en el P4 (falta que lo decidas).
- **«Acompáñame»** es tu entrada en los largos; en las reviews puede ser tu
  «papi» o tu «sin nada de cuentos».
- **La firma de Torvick va en todos los videos** (el sello en la esquina y el
  cierre). Ninguna referencia tiene cierre de marca, así que el CTA va justo
  antes, para que no se pierda.

### Plantilla: review de un lugar, 45 s (propuesta)

| Tramo | Segundos | Qué se ve | Qué se dice o se lee |
|---|---|---|---|
| Gancho | 0-2 | la acción más rica (salsa, queso) o tu cara con el plato | título arriba: «¿<plato> saludable?» o «Dónde comer fit en <ciudad>» |
| Ubicación | 2-5 | la fachada + el pin | el nombre en amarillo + la dirección |
| Cómo funciona | 5-12 | la carta, la máquina, el armado | 3 frases cortas |
| Platos | 12-32 | 2 o 3 platos × 3-4 planos de 1 s | qué tiene; una palabra en grande |
| El dato | 32-38 | el número grande o la medición | precio, proteína, glucosa |
| Veredicto | 38-43 | tú a cámara | para quién y cuándo |
| Cierre | 43-45 | tú señalando a cámara | «Guárdalo para…» o una pregunta |
| Firma | + | el cierre de Torvick | — |

### Plantilla: ranking de 3 suplementos, 55 s (propuesta)

| Tramo | Segundos | Qué se ve | Qué se dice o se lee |
|---|---|---|---|
| Gancho | 0-3 | tú con los 3 productos tapados o de espaldas, tarjetas 1-2-3 | «Las 3 mejores creatinas por menos de $X» + el año |
| Criterios | 3-9 | tú a cámara | 3 titulares, uno por criterio: «MONOHIDRATO», «CERTIFICADA», «PRECIO POR PORCIÓN» |
| 3.er lugar | 9-21 | el producto a la tarjeta 3 · la etiqueta · el sello | «3.er LUGAR» · el precio en grande · un dato · un «pero» |
| 2.º lugar | 21-33 | lo mismo con la tarjeta 2 | ídem |
| 1.er lugar | 33-46 | lo mismo con la tarjeta 1 + zoom de golpe | «#1» con el trofeo · el precio · por qué gana |
| Veredicto | 46-52 | los 3 en la mesa | «si buscas…, la 2; si buscas…, la 1» |
| CTA | 52-55 | tú a cámara | «Comenta CREATINA y te mando…» o «Sígueme» |
| Firma | + | el cierre de Torvick | — |

## La herramienta (propuesta, para cuando estén los cuatro tipos)

No hace falta un motor nuevo. El del P4 (`cambio.html`, `cambio.jsx`,
`herramientas/grabar-cambio.js`) ya tiene casi todo lo que piden las reviews:

| Lo que piden las reviews | Ya en el P4 |
|---|---|
| subtítulos con la palabra que suena en amarillo | `subs` |
| título del gancho, también detrás de la persona | `titulo`, `detras` |
| titulares de criterio y puesto («3er LUGAR») | `titulo` + `camara({ desenfoque })` |
| precios y números que cambian (1.360 → 637) | `numero` (`desde`, `antes` tachado) |
| tarjeta de macros | `lista` o `tarjeta` |
| rótulos de ingredientes | `etiqueta` |
| X y vistos | `tarjeta({ icono })`, `etiqueta({ tachado })` |
| trofeo o medalla del #1 | `emoji('trofeo')` |
| «Comenta "Suplementos"» | `cta` |
| zoom de golpe, destello, sonidos | `camara`, `flash`, `sonido` |
| la firma y la exportación a −14 LUFS | ya está |

**Lo que faltaría** (para sumarlo al mismo motor, compartido entre P4 y P5):
el **pin con la dirección**, el **precio a máquina de escribir**, las **notas
que se acumulan** por criterio y se reinician, el **gráfico de un dato que
cambia con la voz** (glucosa, calorías) y la **placa de tiempo** («2 horas
después»).

## Siguiente

- **Lote 3 (4 reviews más):** confirmar los subtipos, el ritmo y la forma de
  subtitular.
- **Después: entrevistas, retos y divagaciones**, cada uno en su archivo de
  esta carpeta.
