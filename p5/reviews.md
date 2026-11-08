# P5 · Reviews: el estilo de edición de las referencias

P5 son cuatro tipos de video: **reviews, entrevistas, retos y divagaciones**.
Este archivo es el de reviews. **Estado: lote 1 de 3 (5 de 14 videos).** Los 9
que faltan van a confirmar o corregir lo que sigue; lo marcado como
«propuesta» es lo que todavía falta decidir.

Cómo se midió: cortes con `ffmpeg` (cambio de escena > 0,25, y > 0,08 para los
jump cuts), un cuadro por segundo revisado a ojo, subtítulos leídos con OCR a
4 cuadros por segundo, volumen con `ebur128` y espectrogramas del audio. No hay
transcripción: el servidor no puede bajar los modelos de voz, así que el texto
sale de los subtítulos quemados en el video.

## Los 5 videos

| # | Post de IG | De qué trata | Duración | Planos | Plano típico | Voz | Subtítulos | Cierre |
|---|---|---|---|---|---|---|---|---|
| 1 | `DchRoTVxejZ` | Cinco lugares para comer fit en Barranquilla («parte uno») | 74 s | 30 | 1,4 s | a cámara (selfie) y en off, sin pausas | MAYÚSCULAS, 2-3 palabras, la palabra que se dice en amarillo | corta a mitad de frase (loop) |
| 2 | `DcUgTN6gDbv` | Comida «deliciosa y sin culpa» en un restaurante de Medellín | 52 s | 56 | 0,9 s | en off | ninguno: solo el título, 7 s | selfie en el espejo, sin CTA |
| 3 | `DbOSjkttXLO` | ¿Hamburguesa y platanitos saludables? Lo prueba con un sensor de glucosa | 67 s | 15 + jump cuts | 3,6 s | a cámara, sin música | MAYÚSCULAS condensadas, la palabra activa en caja negra | frase propia: «no tienes que escoger entre rico o sano» |
| 4 | `DaQAdx5MmRk` | «El McDonald's versión fitness» que abrió en Barcelona | 38 s | 43 | 0,8 s | ninguna: el video exportado no tiene audio | la frase entera en minúscula, un trozo en amarillo + emoji | pregunta: «¿ya sabes con quién vas a venir? ⬇️» |
| 5 | `DZJGFuhRPwV` | ¿Dónde almorzar saludable? Un local de bowls en Santiago | 53 s | 53 | 0,9 s | a cámara y en off | minúscula, se arma palabra por palabra | «Guarda este dato para no perderlo» |

Todos son **reseñas de lugares de comida saludable**, en vertical 720×1280 a
25-30 fps y con el volumen en −14 LUFS (lo que pide Instagram). Duran entre 38
y 74 s (mediana: 53 s), más que los reels animados de 30-35 s: aguantan porque
cada segundo hay un plano nuevo y apetitoso.

## La fórmula: lo que se repite

1. **El primer cuadro es la comida en su mejor momento, o tu cara con el plato
   en la mano.** Nunca un logo ni una fachada. Los videos 2, 4 y 5 abren con la
   mesa llena o con la salsa cayendo; el 1 y el 3, con la cara y el plato.
2. **Un título de 4 a 7 palabras arriba durante los primeros 2 a 7 s.** Dice
   qué y dónde, y junta «fit/saludable» con una promesa de placer. Hay tres
   ganchos:
   - **la lista útil:** «Lugares para comer fit en Barranquilla», «Comida
     deliciosa y sin culpa en Medellín», «¿Dónde almorzar saludable?»;
   - **la pregunta polémica:** «Hamburguesa & Platanitos ¿Saludables?»;
   - **la comparación con una marca conocida:** «el McDonald's versión
     fitness».
3. **La ubicación antes del segundo 5:** la fachada o el letrero y un pin con la
   dirección (el 5 suma la estación de metro). En el 1 la dirección solo se
   dice («82 con 53»).
4. **Cómo funciona el lugar, si tiene un sistema:** la máquina, la carta, «eliges
   la base, la proteína, 4 greens, un topping y dos salsas» mientras se ve cómo
   arman el plato.
5. **El desfile de platos.** Cada plato es una mini secuencia de 2 a 4 planos de
   ~1 s: detalle → acción (la salsa que cae, el corte, el queso que estira, la
   cuchara que entra) → mordida → cara de placer (ojos cerrados, «mmm»). La
   salsa que cae aparece en 3 de los 5 videos: es **la toma insignia**.
6. **Un dato concreto que se queda:** el precio («$7.490», «desde 10 euritos»),
   el descuento, la glucosa (94 → 122 → 85 mg/dL), los ingredientes («5
   ingredientes reales», «fermentado 48 horas»).
7. **Una objeción resuelta:** «ya no me puedes decir que comer saludable es
   caro», «la comida sana siempre se ve así… ¿me va a tocar comer sano?»,
   «comida real que tu cuerpo sabe procesar».
8. **Para quién y cuándo:** «después de entrenar o esos días que quieres algo
   rico pero nutritivo».
9. **El cierre, en una línea:** guardar (5), comentar o etiquetar (4), una frase
   de marca (3) o un corte que vuelve al principio (1). El 2 no tiene.

**La personalidad también se edita.** En el 1, la muletilla «papi» vuelve una y
otra vez («hey papi top», «o sea papi»): es su firma. En el 3, el tono es de experimento
(«vamos a hacer una prueba que me han pedido un montón»). El 1 dice «parte uno»
en el segundo 4: anuncia una serie.

## Ritmo de corte

| | Planos | Mediana | p10 | p90 | Más largo |
|---|---|---|---|---|---|
| 1 · Barranquilla | 30 | 1,38 s | 0,69 s | 4,97 s | 8,6 s |
| 2 · Medellín | 56 | 0,92 s | 0,70 s | 1,10 s | 1,8 s |
| 3 · Glucosa | 15 | 3,56 s | 0,15 s | 9,42 s | 13,6 s |
| 4 · Barcelona | 43 | 0,83 s | 0,47 s | 1,47 s | 2,0 s |
| 5 · Santiago | 53 | 0,93 s | 0,63 s | 1,51 s | 1,8 s |

Dos formas de montar:

- **Montaje (2, 4 y 5):** un corte cada 0,8-1 s, casi como un metrónomo, y nunca
  más de 2 s en el mismo plano. La voz sigue de corrido por encima. En el 5, el
  60 % de los cortes cae a menos de 80 ms de un golpe del audio, casi siempre el
  arranque de una palabra (por azar sería el 40 %): **se corta al empezar una
  palabra, no a mitad de una**. En los otros, los cortes no siguen el audio.
- **Presentador (1 y 3):** la cara se sostiene más (hasta 5 s en el 1; 13,6 s
  en la presentación del 3), con jump cuts para quitar las pausas y un zoom de
  golpe en la palabra fuerte (el 1 se acerca en «acá en Barranquilla»).

**Propuesta para ti:** montaje de ~1 s, con tu cara en 1 de cada 3 o 4 planos, y
el plano de presentación (si lo hay) de 4 a 6 s como máximo, con jump cuts.

## Voz y sonido

- **Voz sin huecos:** en 1, 2 y 5 hay menos de un 3 % de silencio. Se cortan
  todas las respiraciones y titubeos, y siempre suena algo debajo (música o el
  ambiente del local). El ritmo es de ~3 palabras por segundo.
- **El silencio como recurso (3):** no hay música. En «2 horas después» quedan
  2,6 s de silencio con un tic-tac de reloj (un golpe cada 0,4 s) sobre negro.
- **El 4 no tiene audio** porque la música se puso dentro de Instagram (la
  biblioteca con derechos) y se pierde al descargarlo. Si usas música de la
  biblioteca de Instagram o TikTok, ponla en la app al publicar, no en la
  edición.
- **Exportar a −14 LUFS**, como los cinco.

## Texto en pantalla

### Cuatro formas de subtitular

| | Cómo se ve | Palabras | Dónde | Énfasis |
|---|---|---|---|---|
| A (1) | MAYÚSCULAS, sans redonda muy gruesa, blanco con contorno negro | 2-3 por pantalla, ~0,75 s | 78 % de la altura, centrado | la palabra que se dice, en amarillo (karaoke) |
| B (3) | MAYÚSCULAS condensadas, chicas | 2-4 | 78 % | la palabra que se dice, en una caja negra |
| C (4) | la frase entera en minúscula, de 1 a 3 líneas | 6-19, ~1,5 s | 75 % | un trozo en amarillo + un emoji al final (🔥 ✅ ❌ 😅 👀 ⬇️) |
| D (5) | minúscula blanca con sombra, que crece palabra por palabra | hasta 3 líneas | 70-75 % | palabras sueltas gigantes y animadas («MUCHÍSIMAS» con brillo, «$7.490» a máquina de escribir) |

En los cuatro, los subtítulos están en pantalla más del 85 % del tiempo y van
entre el 70 y el 78 % de la altura: por encima de los botones y el texto de la
app, y por debajo de la cara.

**Propuesta para ti:** la mecánica de la A (2-3 palabras, la que suena
resaltada en amarillo), que es la misma que ya tiene el P4 en `cambio.jsx`:
minúscula en Inter Tight 800 y la palabra que suena en una caja amarilla
(`#FFD400`) con letra negra. Usar los mismos subtítulos hace que todos tus
videos a cámara se reconozcan como tuyos, y ya están hechos. Para los números
(precio, gramos de proteína) conviene sumar las palabras gigantes de la D, que
el P4 también tiene.

### Lo demás que va encima

- **Título arriba:** caja negra nativa de Instagram (1), blanco con sombra (2) o
  en el pecho del presentador, en condensada blanca con la pregunta en amarillo
  (3). Se va a los 2-7 s.
- **Pin con la dirección:** el nombre del lugar en amarillo y la dirección en
  blanco debajo (4 y 5).
- **Precio o descuento** en grande, entrando a máquina de escribir (4 y 5).
- **Patrocinador** (4): el nombre entra cerrando el espaciado entre letras,
  entre dos líneas, con las condiciones del descuento debajo.
- **Rótulos de ingredientes** junto al plato en primer plano (3): «Aceite de
  oliva, agua y sal de Himalaya», «48 hrs de fermentación», «Masa madre alta
  proporción», «Non GMO». Se escriben con un trazo.
- **Datos encima de la imagen** (3): el gráfico del sensor de glucosa, con el
  número que cambia al ritmo de la voz (94 → 121 → 122 → 117 → 108 → 103 → 94 →
  85), y una nota escrita a mano al costado («Muy normal.»).
- **Placa de tiempo** (3): barrido en X → negro → «2 / HORAS DESPUÉS» con
  aberración cromática y las letras que se separan → destello → vuelve la
  imagen. Unos 2,6 s, con el tic-tac.

## Las tomas que hay que grabar

Por cada lugar:

1. **La fachada con el letrero** (2-3 s); mejor si se te ve entrando.
2. **El interior**, 1 o 2 planos.
3. **La carta, la máquina o la vitrina**, con el precio legible.
4. **Por cada plato:** la mesa entera desde arriba · el detalle a 20 cm · la
   acción (salsa, corte, cuchara, queso que estira) · tú mordiendo · tu reacción
   (sostenla un segundo sin hablar).
5. **Tú a cámara:** el gancho (graba 2 versiones), el dato, el veredicto y el
   cierre.
6. **Extras:** cómo arman el plato en la cocina, la salida o el espejo.

Graba en vertical y en 4K si puedes, para tener margen para los zooms. Dos de
los cinco usan micrófono de solapa.

## Cómo se adapta a Torvick (propuesta)

- **Tu ángulo es la ciencia y el deporte.** El de la glucosa (3) es el más tuyo:
  una review con una medición. Ideas: proteína por plato (con la balanza),
  precio por gramo de proteína, calorías contra lo que promete la carta,
  glucosa.
- **El dato puede ser una animación del sistema:** `B.Cuenta` para los gramos,
  `Mal`/`Bien` para el mito y la verdad, Tor señalando el número. Es lo que te
  separa de las referencias.
- **La paleta de cinco también aquí:** el amarillo para la palabra que suena y
  lo deseable, el rojo para lo que se descarta y el verde para lo correcto.
  Donde las referencias ponen ✅ o ❌, van la X y el visto del sistema. **Emojis:**
  las referencias 4 y 5 los usan; en los largos se veían «chafa» y en el P4 solo
  van los 3D de `cambio/emoji/`. Para P5 propongo lo mismo que en el P4 (falta
  que lo decidas).
- **«Acompáñame»** es tu entrada en los largos; puede ser tu «papi» en las
  reviews.
- **La firma de Torvick va en todos los videos** (el sello en la esquina y el
  cierre de 3,5 s). Ninguna referencia tiene cierre de marca, así que la línea
  de cierre (guardar o comentar) va justo antes, para que no se pierda.

### Plantilla de una review de 45 s (propuesta)

| Tramo | Segundos | Qué se ve | Qué se dice o se lee |
|---|---|---|---|
| Gancho | 0-2 | la acción más rica (salsa, queso) o tu cara con el plato | título arriba: «¿<plato> saludable?» o «Dónde comer fit en <ciudad>» |
| Ubicación | 2-5 | la fachada + el pin | el nombre en amarillo + la dirección |
| Cómo funciona | 5-12 | la carta, la máquina, el armado | 3 frases cortas |
| Platos | 12-32 | 2 o 3 platos × 3-4 planos de 1 s | qué tiene; una palabra en grande |
| El dato | 32-38 | el número grande o la medición | precio, proteína, glucosa |
| Veredicto | 38-43 | tú a cámara | para quién y cuándo |
| Cierre | 43-45 | tú señalando a cámara | «Guárdalo para…» o una pregunta |
| Firma | +3,5 | `MARCA.EscMarca2` | — |

## Siguiente

- **Lote 2 (9 reviews más):** confirmar o corregir la fórmula, el ritmo y la
  forma de subtitular.
- **Después, entrevistas, retos y divagaciones**, cada uno en su archivo de esta
  carpeta.
- **La herramienta (propuesta, para cuando estén los cuatro tipos):** no hace
  falta un motor nuevo. El del P4 (`cambio.html`, `cambio.jsx`,
  `herramientas/grabar-cambio.js`) ya hace casi todo lo que piden las reviews:
  tu video en 1080×1920, subtítulos con la palabra que suena en amarillo,
  palabras y números gigantes, títulos, tarjetas, listas que se arman al
  nombrarlas, X y vistos, golpes de cámara, sonidos, la firma, los silencios
  encontrados en la transcripción y la exportación a −14 LUFS. A las reviews
  les faltarían: el **pin con la dirección**, el **precio a máquina de
  escribir**, los **rótulos de ingredientes** junto al plato, el **gráfico de un
  dato que cambia con la voz** (glucosa, proteína) y la **placa de tiempo**
  («2 horas después»). Se sumarían a ese motor, con las piezas compartidas entre
  P4 y P5.
