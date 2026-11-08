# P5 · Reviews: el estilo de edición de las referencias

P5 son cuatro tipos de video: **reviews, entrevistas, retos y divagaciones**.
Este archivo es el de reviews. **Estado: completo, 14 videos en 3 lotes.** Lo
marcado como «propuesta» es lo que todavía falta que decidas.

Cómo se midió: cortes con `ffmpeg` (cambio de escena > 0,25, y > 0,08 para los
jump cuts y los acercamientos), un cuadro por segundo revisado a ojo,
subtítulos leídos con OCR, volumen con `ebur128` y espectrogramas del audio. No
hay transcripción: el servidor no puede bajar los modelos de voz, así que el
texto sale de los subtítulos quemados en el video.

## Los 14 videos

| # | Post de IG | De qué trata | Subtipo | Duración | Plano típico | Subtítulos | Cierre |
|---|---|---|---|---|---|---|---|
| 1 | `DchRoTVxejZ` | Cinco lugares para comer fit en Barranquilla («parte uno») | lugar | 74 s | 1,3 s | una capa | corta a mitad de frase (loop) |
| 2 | `DcUgTN6gDbv` | Comida «deliciosa y sin culpa» en Medellín | lugar | 52 s | 0,9 s | ninguno, solo el título | selfie en el espejo, sin CTA |
| 3 | `DbOSjkttXLO` | ¿Hamburguesa y platanitos saludables? Con sensor de glucosa | lugar + experimento | 67 s | 1,3 s | una capa | frase propia: «no tienes que escoger entre rico o sano» |
| 4 | `DaQAdx5MmRk` | «El McDonald's versión fitness» de Barcelona | lugar | 38 s | 0,8 s | frase entera | pregunta: «¿ya sabes con quién vas a venir? ⬇️» |
| 5 | `DZJGFuhRPwV` | ¿Dónde almorzar saludable? Bowls en Santiago | lugar | 53 s | 0,9 s | frase entera | «Guarda este dato para no perderlo» |
| 6 | `DOrl41gjmjT` | Alpinito extra proteico | receta | 51 s | 1,2 s | una capa | la prueba: «es una locura» |
| 7 | `DXmb9VWjnov` | El pedido de McDonald's para perder grasa (un nutricionista) | pedido inteligente | 49 s | 1,6 s | dos capas | «si quieres aprender a comer gustitos de vez en cuando…» |
| 8 | `DSKz9ICAMCR` | ISO100: «la mejor proteína del mundo» | producto | 49 s | 2,8 s | una capa, arriba | «si ya la conocías déjanos en comentarios y seguinos» |
| 9 | `DVcMzIfD4Zf` | Las 3 mejores creatinas por menos de $100.000 (2026) | ranking | 59 s | 1,7 s | dos capas | código de descuento + «escríbeme» + «sígueme» |
| 10 | `DZ0E_K3RZyI` | Calificando las proteínas más famosas (4 marcas) | comparativa con notas | 86 s | 3,0 s | frase entera | «Comenta "Suplementos"» |
| 11 | `C6rrO4xOJ84` | «Creatina como nunca te la han explicado» (un médico) | explicador | 48 s | 0,4 s | frase entera | «con este video ya conoces a la creatina», con el envase |
| 12 | `DVEME6GFRLj` | Los 5 mejores péptidos | explicador (lista) | 38 s | 0,7 s | dos capas | «Comenta…» con la caja que escribe «Péptidos»: te manda más información por mensaje |
| 13 | `DcextFrNcrc` | Péptidos «directo y sin tecnicismo» (un médico) | postura | 117 s | 1,4 s | dos capas | «yo diría que…» (su conclusión) |
| 14 | `DbbFHjQBXeZ` | «¿Por qué te aplicarías algo que no está aprobado?» (péptidos) | postura | 96 s | 1,0 s | dos capas | la pregunta abierta y «ahí te lo dejo» |

Todos son verticales a 25-30 fps (el 11 en 1080×1920; el resto en 720×1280).
Duran entre 38 y 117 s, con una mediana de 52 s: más que los reels animados de
30-35 s. **Una review no se sostiene por ser corta, sino porque algo cambia
cada segundo:** un corte, un acercamiento, un subtítulo, una nota o un precio.

## Siete subtipos

El esqueleto es siempre el mismo (gancho → qué es → lo concreto → veredicto →
CTA), pero cada subtipo tiene su recurso propio:

| Subtipo | Videos | El gancho | El recurso que lo sostiene | El veredicto |
|---|---|---|---|---|
| **Lugar** | 1-5 | «Lugares para comer fit en…», «¿Hamburguesa saludable?» | desfile de platos en planos de 1 s; el pin con la dirección | precio + para quién y cuándo |
| **Receta** | 6 | **el resultado primero**: los dos tuppers en la mano + el nombre gigante | la tarjeta de macros al segundo 4; los pasos en primeros planos | la prueba en cámara («es una locura») |
| **Pedido inteligente** | 7 | «Este es el pedido que debes hacer si estás buscando perder grasa» | **cambia las cosas en la bandeja** mientras lo dice; las calorías antes y después (1.360 → 637) | «puedes comer lo que te gusta en déficit calórico» |
| **Producto** | 8 | un superlativo: «la mejor proteína del mundo» | **el producto es el protagonista**: tu cara solo 4 s, después todo es el envase (empujes lentos, la etiqueta, el scoop, el sello de certificación) | por qué «es considerada la mejor» |
| **Ranking** | 9 | «Las mejores creatinas por menos de $100.000» + el año | **cuenta atrás 3 → 2 → 1** con tarjetas 1-2-3 en la mesa que se van llenando; el precio de cada una en grande | el #1 con corona + el código de descuento |
| **Comparativa con notas** | 10 | «Calificando las proteínas más famosas» | **las notas se acumulan** en pastillas («Calidad: 10/10», «Precio: 7/10») y se reinician con cada marca | **una ganadora por necesidad**: «si buscas un perfil limpio, gana…; si buscas economía, gana…» |
| **Explicador o postura** | 11-14 | «Creatina como nunca te la han explicado», «Péptidos, directo y sin tecnicismo», una pregunta incómoda | **una sola cámara con acercamientos en cada frase**; la idea clave en grande; imágenes de apoyo (envases, el cuerpo, el laboratorio) | **una postura clara**: «no son seguros», «no te daña los riñones», «ahí te lo dejo» |

El último lote es otro tipo de review: lo que se reseña no es un local ni un
envase, sino **el suplemento o la moda en sí** (la creatina, los péptidos), y
el veredicto es una opinión con fundamento. Es el subtipo más cercano a lo que
ya haces: tienes el largo de creatina y el reel de péptidos de Tor.

Tres recursos de estructura que hacen que la gente se quede hasta el final:

- **La cuenta atrás** (9): el #1 se guarda para el final.
- **Las notas que se acumulan** (10): hay que llegar al final para saber cuál
  gana, y el veredicto por necesidad le sirve a todos y no pelea con ninguna
  marca.
- **Las preguntas que ordenan el video** (13): «¿CÓMO usarlos? ¿CUÁL usar? ¿QUÉ
  cantidad? ¿CUÁNTO tiempo?» salen en grande, una por una, y cada una abre un
  bloque.

## La fórmula: lo que se repite

1. **El primer cuadro ya muestra lo que se reseña,** en su mejor momento: la
   comida, el resultado de la receta, el envase en la mano, los productos en la
   mesa o el presentador con el objeto (el scoop de creatina, la jeringa). Nunca un logo ni una fachada.
2. **Un título de 2 a 7 palabras en los primeros 2-7 s** que promete algo
   concreto. Los ganchos que aparecen:
   - **la lista útil:** «Lugares para comer fit en Barranquilla», «Las mejores
     creatinas por menos de $100.000», «los 5 mejores péptidos»;
   - **la pregunta polémica:** «Hamburguesa & Platanitos ¿Saludables?», «¿por qué
     te aplicarías algo que no está aprobado?»;
   - **la promesa con un objetivo:** «el pedido que debes hacer si estás
     buscando perder grasa»;
   - **la explicación prometida:** «como nunca te la han explicado», «directo y
     sin tecnicismo»;
   - **el superlativo:** «la mejor proteína del mundo»;
   - **la comparación con una marca conocida:** «el McDonald's versión fitness»;
   - **el formato de serie:** «Calificando proteínas», «parte uno».
3. **Los criterios, dichos al principio** (9 y 10): «monohidrato, alta
   calidad, buen precio». El que mira sabe qué se va a juzgar.
4. **Un dato concreto en cada bloque:** precio («$74.900»), gramos («25 g de
   proteína», «5 g diarios como mínimo»), calorías («1.360 → 637»), glucosa
   («94 → 122 mg/dL»), una nota («10/10»). En los 14 hay al menos uno.
5. **Credibilidad a la vista:** el uniforme médico (7, 11 y 13: tres de los
   catorce son profesionales de la salud y lo muestran), el sensor de glucosa
   (3), el sello «Informed Choice» en primer plano (8), el registro sanitario
   (9), los ratones de laboratorio cuando se habla de estudios (13).
6. **Los mitos, uno por uno, al final** (11): «no te engorda, no te hincha, no
   te tumba el pelo, no te daña los riñones ni el hígado». Una objeción resuelta
   aparece en casi todos: «ya no me puedes decir que comer saludable es caro»,
   «nunca puedes comer comida rápida».
7. **El veredicto dice para quién es**, no solo si es bueno: «después de
   entrenar», «si eres intolerante a la lactosa», «si buscas economía». En las
   posturas, dice a quién escuchar: «tu médico; no tu amigo, tu vecino, tu
   entrenador ni el vendedor» (13, con la lista que se arma palabra por palabra).
8. **El cierre, en una línea:** comentar una palabra para recibir algo (10 y
   12), escribir por mensaje o seguir (9), comentar si ya lo conocías (8),
   guardar (5), etiquetar (4), una frase propia (3, 11 y 13), una pregunta
   abierta (14) o la última mordida (6). El 4 y el 9 suman un descuento.

**La personalidad también se edita.** El «papi» vuelve en los videos 1 y 6
(«papi patrocíname», pidiéndole el patrocinio a la marca en cámara, con humor).
El 9 cierra con su lema: «sin nada de cuentos». El 3 lo plantea como
experimento. El 1 anuncia una serie («parte uno»). El 14 conserva sus pausas
(8 % de silencio, el doble que el resto) y termina con un primer plano en
selfie: suena a conversación, no a anuncio.

## Ritmo de corte

| | Planos | Mediana | p90 | Más largo | Cambios cada 10 s |
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
| 11 · Creatina | 88 | 0,42 s | 1,1 s | 2,5 s | 18,1 |
| 12 · 5 péptidos | 26 | 0,73 s | 3,0 s | 8,2 s | 6,6 |
| 13 · Péptidos (médico) | 65 | 1,40 s | 3,3 s | 7,4 s | 5,4 |
| 14 · Péptidos (opinión) | 34 | 1,02 s | 9,7 s | 11,8 s | 3,4 |

(Contando los jump cuts y los acercamientos de golpe, que en los explicadores
son la mayoría de los cambios. En el 8 la cámara siempre se mueve, con empujes
lentos, así que hay más cambios de los que se cuentan.)

Tres formas de montar:

- **Montaje (2, 4 y 5, los lugares):** un corte cada 0,8-1 s, casi como un
  metrónomo, y nunca más de 2 s en el mismo plano. La voz sigue de corrido por
  encima.
- **Presentador con objetos (1, 3, 6, 7, 9 y 10):** la cara se sostiene de 1,5
  a 3 s de mediana y hasta 10-15 s, con jump cuts para quitar las pausas, zooms
  de golpe en la palabra fuerte y planos de detalle del producto cada vez que se
  nombra. Lo que mantiene el ritmo es el texto: **algo nuevo en pantalla cada
  ~1 s** (subtítulo, nota, precio, título).
- **Una sola cámara (11, 13 y 14):** el mismo plano todo el video, y el ritmo lo
  hacen **los acercamientos**: en cada frase el encuadre salta entre plano medio
  y primer plano (en el 11, cada 0,4 s; en el 13, cada 1,4 s). Dos barridos con
  desenfoque de movimiento (11) marcan el paso de un bloque al siguiente. Las
  imágenes de apoyo cortan la cara solo un momento: el collage de marcas de
  creatina (11), los ratones de laboratorio (13), capturas de videos de otros
  sobre el tema (14).

**Dónde cae el corte:** en 8 de los 13 videos con audio (5, 6, 7, 8, 10, 12, 13
y 14), del 42 al 69 % de los cortes cae a menos de 80 ms de un golpe del audio,
casi siempre el arranque de una palabra (por azar serían del 29 al 44 %). **Se
corta al empezar una palabra, no a mitad de una.**

**Propuesta para ti:** en los lugares y las recetas, un plano de ~1 s con tu
cara en 1 de cada 3 o 4. En los productos, rankings y comparativas, tu cara
hasta 3 s con jump cuts y un primer plano del producto cada vez que lo nombres.
En los explicadores, una sola cámara en 4K con un acercamiento en cada frase
(el 4K deja recortar sin perder calidad). En todos, algo nuevo en pantalla cada
segundo.

## Voz y sonido

- **Voz sin huecos:** en 11 de los 13 con audio el silencio es un 4 % del
  video o menos. Se cortan las respiraciones y los titubeos, a ~3 palabras por
  segundo. Las excepciones son a propósito: el 3 (el «2 horas después» en
  silencio) y el 14 (una charla que guarda sus pausas).
- **Siempre suena algo debajo** (música baja o el ambiente). En el 11 y el 12
  la música va **constante** bajo la voz: entre palabra y palabra el sonido apenas baja 3-6 dB. Solo el 3 tiene
  silencios de verdad.
- **El silencio como recurso (3):** en «2 horas después» quedan 2,6 s de
  silencio con un tic-tac de reloj sobre negro.
- **Micrófono inalámbrico** a la vista en el 6, 7, 9, 11 y 12, y en el 13 en
  la mano, montado sobre una jeringa como si fuera un micrófono de mano (el
  objeto del tema, convertido en utilería). La voz limpia importa más que la
  imagen.
- **El 4 llegó sin audio:** la música se puso dentro de Instagram (la
  biblioteca con derechos) y se pierde al descargarlo. Si usas música de la app,
  ponla al publicar, no en la edición.
- **Exportar a −14 LUFS**, como 12 de los 13 con audio, que están entre −14 y
  −15 (el 11 quedó en −20, más bajo que el resto del feed).

## Texto en pantalla

### Tres familias de subtítulos

| Familia | Videos | Cómo se ve | Énfasis |
|---|---|---|---|
| **Una capa: 2-3 palabras, la que suena resaltada** | 1, 3, 6, 8 | MAYÚSCULAS gruesas, blancas con contorno o sombra, abajo (75-78 %) o arriba (8) | la palabra que suena en amarillo (1, 6, 8) o en una caja negra (3) |
| **Dos capas: la frase chica + la palabra clave grande** | 7, 9, 12, 13, 14 | la frase en minúscula blanca chica; la idea que hay que recordar, el doble de grande y en color | verde menta (7), titulares en MAYÚSCULAS condensadas (9: «MONOHIDRATO», «ALTA CALIDAD»), negrita cursiva (12: «Péptidos», «los 5 mejores»), **amarillo** (13: «NO SON SEGUROS», «NADIE lo niega», «MASA MUSCULAR»), rosa para la pregunta clave (14) |
| **La frase entera** | 4, 5, 10, 11 | minúscula, de 1 a 3 líneas, a la altura del pecho | un trozo en amarillo + emoji (4), palabras sueltas gigantes (5), ninguno (10 y 11) |

El 2 no lleva subtítulos, solo el título.

**Las dos capas son lo más repetido** (5 de 14) y la de una capa le sigue (4 de
14). Las dos separan **lo que se dice** de **lo que hay que recordar**.

**Propuesta para ti (confirmada con los 14):** juntar las dos primeras, que es
justo lo que ya hace el P4 en `cambio.jsx`. La capa de abajo son los
subtítulos de siempre: 1-3 palabras en minúscula en Inter Tight 800, con la
que suena en una caja amarilla (`#FFD400`) y letra negra. La capa de arriba,
**la palabra clave o el número en grande** con `titulo` o `numero` cuando se
dice algo que hay que recordar: el precio, los gramos, «NO SON SEGUROS». Es la
receta del 13, el más cercano a tu canal, con tus colores. Usar los mismos
subtítulos que en el P4 hace que todos tus videos a cámara se reconozcan como
tuyos.

### Lo demás que va encima

- **El título del gancho:** caja negra de Instagram (1), blanco con sombra (2),
  en el pecho con la pregunta en amarillo (3), **detrás de la persona** (6:
  «ALPINITO» gigante detrás de la cabeza) o una **pastilla amarilla con letra
  negra** y una pastilla blanca debajo (11: «CREATINA / como nunca te la han
  explicado»). Se va a los 2-7 s.
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
- **La lista que se arma** (13): «amigo / vecino / entrenador / vendedor», una
  palabra debajo de otra a medida que las dice. Y una nota chica con la letra
  pequeña: «Tampoco están aprobados (NAD, IPA, BPC, GHK, IGF)».
- **Imágenes de apoyo a pantalla completa:** el collage de marcas (11); en el
  12, una imagen por cada péptido (el frasco con su nombre) y el cuerpo por
  dentro (el folículo, el músculo que brilla, la grasa que se quema, el cerebro
  con sus conexiones), en un 3D brillante que parece generado con IA; los ratones de laboratorio (13);
  capturas de videos de otros creadores superpuestas y transparentes (14:
  «esto es lo que ves en TikTok»).
- **La palabra fuerte, sola y enorme** (14): «ilícita» en blanco gigante con el
  fondo desenfocado.
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
- **El CTA de comentar una palabra** (10 y 12): «Comenta "Suplementos"» grande
  sobre el pecho (10); en el 12, una caja de comentario donde se escribe
  «Péptidos» con el botón de enviar, mientras promete mandar más información. Es lo que activa la respuesta automática
  por mensaje.
- **Transiciones:** casi todo es corte seco o acercamiento. Los únicos adornos
  son los destellos de luz (9), los barridos con desenfoque (3 y 11) y el zoom
  de golpe en la palabra fuerte (1, 7, 9).

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

**Explicador o postura:** una sola toma, sentado o de pie, en 4K, encuadre de
la cintura para arriba con aire sobre la cabeza (para poder acercar) · el
objeto en la mano durante todo el video (el scoop, el envase; en el 13, el
micrófono montado sobre una jeringa) · una
toma aparte del envase o del objeto en primer plano para el gancho y el cierre.
Las imágenes de apoyo salen de la edición.

Graba en vertical y en 4K si puedes, para tener margen para los zooms.

## Cómo se adapta a Torvick (propuesta)

- **Los suplementos son tu terreno.** Ya hiciste el largo de creatina y el reel
  de péptidos de Tor, y 7 de las 14 referencias son de suplementos. Tres
  formatos tuyos:
  - un **explicador** como el 11 («Creatina, lo que dice la ciencia») sacado del
    guion del largo: los beneficios en ráfaga, cómo se toma y los mitos;
  - una **postura** como el 13 sobre una moda («¿Péptidos? Esto no te lo
    dicen»), con la idea clave en grande y tu conclusión;
  - un **ranking** o una **comparativa con notas** de creatinas o proteínas, con
    criterios de ciencia: tipo (monohidrato), dosis por porción, certificación
    de terceros, precio por porción y, en proteínas, el precio por gramo de
    proteína.
- **Donde ellos ponen imágenes generadas, tú pones tus animaciones.** El 12
  ilustra cada idea con imágenes en 3D que parecen de IA (el músculo que brilla, la grasa que se
  quema). Tú tienes a Tor y el pizarrón: el músculo en amarillo de `B.Frente`,
  las X y los vistos, los `N.ICONOS`. Es lo que te distingue de todos los
  demás.
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
  lo deseable y los puestos; el rojo para lo que se descarta (y para «NO SON
  SEGUROS»); el verde para lo correcto. Donde las referencias ponen ✅ o ❌, van
  la X y el visto del sistema. **Emojis:** las referencias 4, 8 y 9 los usan
  (la corona del #1, el planeta de «del mundo»); en los largos se veían «chafa»
  y en el P4 solo van los 3D de `cambio/emoji/` (hay `trofeo` y `medalla`). Para
  P5 propongo lo mismo que en el P4 (falta que lo decidas).
- **Si muestras videos de otros** (como el 14), que sea poco tiempo, con el
  nombre de la cuenta a la vista y para comentarlos, no para reemplazar tu
  explicación.
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

### Plantilla: explicador de un suplemento, 50 s (propuesta)

| Tramo | Segundos | Qué se ve | Qué se dice o se lee |
|---|---|---|---|
| Gancho | 0-3 | tú con el envase y el scoop en la mano | título en pastilla amarilla: «CREATINA» + «lo que dice la ciencia» |
| Para qué sirve | 3-20 | una sola cámara, un acercamiento en cada beneficio; una animación de Tor o del músculo cada 2-3 beneficios | un beneficio por frase, la palabra clave en grande |
| Cómo se toma | 20-32 | tú a cámara, la mano marcando los números | «5 g», «todos los días», «sin carga ni pausa» en grande |
| Mitos | 32-44 | tú a cámara; X roja en cada mito | «no engorda», «no daña los riñones»… con su X |
| Cierre | 44-50 | tú con el envase | tu conclusión + «Comenta CREATINA y te mando el estudio» |
| Firma | + | el cierre de Torvick | — |

## La herramienta (propuesta)

No hace falta un motor nuevo. El del P4 (`cambio.html`, `cambio.jsx`,
`herramientas/grabar-cambio.js`) ya tiene casi todo lo que piden las reviews:

| Lo que piden las reviews | Ya en el P4 |
|---|---|
| subtítulos con la palabra que suena en amarillo | `subs` |
| título del gancho, también detrás de la persona | `titulo`, `detras` |
| la palabra clave en grande (la segunda capa) | `titulo`, `numero` |
| titulares de criterio y puesto («3er LUGAR») | `titulo` + `camara({ desenfoque })` |
| acercamientos en cada frase y barridos | `camara` (`zoom`, `mov`) |
| precios y números que cambian (1.360 → 637) | `numero` (`desde`, `antes` tachado) |
| tarjeta de macros y la lista que se arma | `lista` o `tarjeta` |
| rótulos de ingredientes | `etiqueta` |
| X y vistos | `tarjeta({ icono })`, `etiqueta({ tachado })` |
| trofeo o medalla del #1 | `emoji('trofeo')` |
| «Comenta "Suplementos"» con la caja que se escribe | `cta` |
| una foto encima (el collage, una captura) | `imagen` |
| destello, sonidos | `flash`, `sonido` |
| la firma y la exportación a −14 LUFS | ya está |

**Lo que faltaría** (para sumarlo al mismo motor, compartido entre P4 y P5):

1. **Inserto a pantalla completa:** cortar a una animación tuya (una escena de
   `reels.html`) o a un video de archivo y volver a la cámara. Es lo que más
   usan los explicadores y lo que te distingue.
2. **Acercamientos automáticos:** que el motor alterne el encuadre en cada
   frase de la transcripción, sin escribirlos uno por uno.
3. **Notas que se acumulan** por criterio y se reinician con cada producto.
4. **Pin con la dirección** y **precio a máquina de escribir**.
5. **Gráfico de un dato que cambia con la voz** (glucosa, calorías) y la
   **placa de tiempo** («2 horas después»).

## Siguiente

Las reviews están completas. Las entrevistas están en `entrevistas.md` y los
retos en `retos.md`; sigue **divagaciones**. Cuando estén los cuatro se decide qué piezas
se suman al motor del P4, porque algunas (los acercamientos automáticos, el
inserto) van a servir para todos.
