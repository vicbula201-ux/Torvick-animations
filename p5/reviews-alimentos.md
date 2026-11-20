# P5 · Reviews de alimentos (y después productos)

La serie de reviews de Torvick: un alimento por video, con su aporte nutricional,
contado a cámara con tomas de apoyo, letras y animaciones. Empieza con alimentos
(el aguacate es el primero) y después sigue con productos de otros negocios,
productos «fit», suplementos y mini vlogs, con el mismo armazón.

**Estado:** formato listo, piezas nuevas en el motor, el plan del aguacate armado
sobre el guion y probado con una voz sintética. Falta el material (lo grabas tú).

**Lo que decidió el autor (noviembre de 2026):** las dos comparaciones que no
estaban en el guion se quedan; el sello va tal cual («VEREDICTO · TORVICK» y
«nutrición · versatilidad · sabor»); el cierre **lo dice él a cámara** («¿Quieres
ver más videos similares? Sígueme para más contenido.») y, mientras lo dice,
aparecen @eltorvick, YouTube, Instagram y TikTok; la plantilla del borrador
(fondo oscuro, letras en amarillo, blanco y negro) le gusta.

**Después del borrador 2:** la barra de pasos de arriba no le gustó (fuera); las
tarjetas «aparecen y se van muy rápido, no se alcanzan a leer» (ahora cada una se
queda 2 s después de su último dato); y todo junto se veía «muy saturado» (ahora
entra una cosa a la vez y el plan tiene menos piezas). Los subtítulos y las
animaciones, bien. Ver «El ritmo» en `estilo.md`.

**Referencias de estilo:** las 14 reviews de `reviews.md`, las capturas del
creador del laboratorio que te gustaron (el nombre de cada producto aparece
encima del producto; el estudio flotando con la frase resaltada) y los videos de
Eddie Kang y MyEdSpace, sobre todo la animación «Your Child's Learning Journey»
(ver «Lo que se toma de Eddie Kang y MyEdSpace», abajo).

## El formato (el mismo en cada alimento)

**Gancho → calorías y macros → lo interesante → micronutrientes → beneficios →
cómo comerlo → veredicto → pregunta → cierre.** De 45 a 60 s con el cierre.
Repetir el orden es lo que vuelve reconocible la serie.

| Tramo | Toma | Qué sale encima | Sonido |
|---|---|---|---|
| Gancho | tú con el alimento en la mano, a cámara | la pregunta **gigante detrás de ti** («¿SALUDABLE?»); **el nombre encima del alimento**, pegado a él aunque lo muevas; golpe de zoom; «Mal alimento» tachado | golpe, pop, error |
| Calorías y macros | tomas de apoyo del alimento (desenfocadas detrás) | **la tabla nutricional**: llega con las filas apagadas y cada fila se enciende, cuenta su número y se resalta en amarillo **cuando la nombras** | whoosh, pop + subida por fila |
| Lo interesante | primer plano del alimento | una **comparación en barras** cuando hay un «similar a…» | subida, ding |
| Micronutrientes | tú señalando hacia un lado | la segunda tabla entra **como carrusel**, del lado al que señalas | whoosh, pop por fila |
| Beneficios | el alimento en el plato | una pastilla por idea, una tras otra en el mismo lugar («Más saciedad», «Mejor absorción de vitaminas») | click |
| Cómo comerlo | el alimento con lo que lo acompañas | «¿CÓMO COMERLO?»; **rótulos encima de cada cosa** que se ve (arepa, huevos); lo que no se ve lo dicen los subtítulos | whoosh, pop |
| Veredicto | tú probándolo, a cámara | **el sello Torvick** (ver abajo) | whoosh, golpe, campana, ding por palabra |
| Advertencia | tú | «Las porciones importan» con el ícono de aviso | click |
| Pregunta | tú | «¿Con qué lo acompañas?» grande y la caja de comentario | whoosh, clicks |
| Cierre | tú a cámara: «¿Quieres ver más videos similares? Sígueme para más contenido.» | **mientras preguntas**, arriba se arma la pastilla de **@eltorvick** y entran **YouTube, Instagram y TikTok**, uno por uno; en «sígueme», **SÍGUEME** gigante y «para más contenido». Tú sigues a la vista (la cámara se acerca despacio) | pop por red, golpe |

**El ritmo** (`lectura: 2` en el plan): además de los subtítulos, una pieza a la
vez; cada tarjeta se queda 2 s después de su último dato (lo chico, 1,5 s) y lo
que viene espera a que se vaya. Unas 15 piezas en el minuto, no más. Los golpes de
zoom, solo en el gancho y en el veredicto.

Todo el video lleva los **subtítulos** de 1 a 3 palabras con la que suena en la
caja amarilla, **sin música** y **sin emojis** (al autor no le convencieron en la
divagación): donde iba un emoji van los rótulos y las pastillas.

**Muestrario:** `videos/muestrario-piezas-reviews.mp4` (fuera de git) muestra cada pieza
sobre material del autor, con sus sonidos; el plan está en `cambios/_muestrario/`.

## Las piezas (motor del P4, `cambio.jsx`)

| Pieza | En el plan | Cómo se ve |
|---|---|---|
| Rótulo sobre el objeto | `p.rotulo(ini, fin, 'Aguacate', { sigue: 'aguacate-mano' })` o `{ en: [x, y] }` | texto blanco grueso sin caja, sombra suave, las letras entran una tras otra; va dentro de la cámara (sigue al zoom) y, con `sigue`, al objeto que se mueve (`herramientas/seguir.py`); si el objeto sale de cuadro, el rótulo se va solo |
| Tabla | `p.tabla(ini, fin, { titulo, sub, pie, filas: [{ nombre, valor, unidad, busca, sub, grande }], entra: 'derecha', sale: 'izquierda' })` | tarjeta blanca tipo etiqueta nutricional: rayas negras gruesas que se dibujan, filas apagadas que se encienden cuando se dice `busca`, número que cuenta, resaltado amarillo en la que suena; la cámara se desenfoca y se oscurece detrás |
| Barras | `p.barras(ini, fin, { titulo, filas: [{ nombre, partes: [71, 13, 16] }], leyenda, remate })` | barras apiladas que crecen tramo a tramo con el % contando; `remate` («¡Casi iguales!») con visto; `compacta` para la versión chica de arriba; `unidad: ' kcal'` |
| Sello del veredicto | `p.veredicto(ini, fin, { nota: 9, palabras: [...], criterio, encoger, esquina })` | cae como un sello (golpe y sacudida), el anillo y la nota cuentan hasta el valor, el texto «VEREDICTO · TORVICK» gira; las palabras salen con visto cuando se dicen; con `encoger` se va a una esquina y se queda |
| Pastilla con ícono | `p.etiqueta(ini, fin, 'Las porciones importan', { icono: 'aviso', minus: true, letra: 'texto' })` | `icono`: `aviso`, `check`, `equis` |
| Pregunta | `p.cta(ini, fin, '¿Con qué\nlo acompañas?', { pregunta: true, texto: 'te leo en los comentarios' })` | la pregunta en grande y la caja de comentario (con `respuesta`, se escribe sola) |
| Cierre dicho | `firma: { estilo: 'grande', ini: t('quieres ver'), sigueme: t('sígueme'), texto: 'para más contenido' }` en el registro | ver la tabla de arriba; los subtítulos se van en «sígueme» (desde ahí lo que dices ya está escrito en grande). Sin `sigueme`, el cierre grande callado: la última toma oscurecida con «¿quieres ver más videos así?» |

Los tiempos salen de la voz: `t('por cada')`, `t.fin('proteína')`, y
`t.alguna(['nueve', '9'])` cuando la transcripción puede escribir un número con
cifras.

## El sello del veredicto (la insignia de la serie)

- **Nota de 1 a 10** (admite decimales: 8,5). Cae en el centro con un golpe,
  cuenta la nota, salen las tres palabras del veredicto con su visto, y se encoge
  a una esquina mientras sigues hablando.
- **La línea de criterio** debajo dice qué se valora, para que quede claro que es
  tu valoración y no una nota científica. Para alimentos: «nutrición ·
  versatilidad · sabor». Para productos y negocios (propuesta): «nutrición ·
  sabor · precio».
- Siempre igual en todos los videos: es lo que la gente va a reconocer.
- Aprobado por el autor tal como está.

## Lo que se toma de Eddie Kang y MyEdSpace

Las referencias que mandó el autor junto con sus respuestas (no van al
repositorio). La que más le gusta es la animación **«Your Child's Learning
Journey»** de MyEdSpace: fondo lavanda con cuadritos, una tarjeta blanca por idea
que se arma por dentro, azul, lima y azul marino. En Torvick se lleva a
**amarillo, blanco y negro** (lo confirmó el autor).

| En la referencia | En Torvick |
|---|---|
| la barra de pasos arriba (1 Prepare · 2 Learn live · 3 Practice · 4 Check & improve) que avanza con el video | se probó en el borrador 2 (Calorías · Grasas · Beneficios · Cómo comerlo · Veredicto) y **no le gustó al autor**: no se usa |
| una tarjeta por idea que se arma por dentro: filas que se encienden, vistos uno por uno, números que cuentan, un resaltado que barre la fila | la tabla y las barras (ya lo hacían) |
| título arriba con la palabra clave en color; debajo, la frase con lo importante resaltado | los subtítulos con la caja amarilla + la palabra grande |
| el escudo «30 DAYS · MONEY-BACK GUARANTEE» con su cinta | el sello del veredicto |
| el cierre: la pregunta con la palabra en color, la pastilla con el enlace y el personaje que saluda | el cierre dicho: tú preguntas, salen las redes y @eltorvick |
| Eddie Kang: acercamientos entre plano medio y primer plano en cada corte | los golpes de zoom y los encuadres por frase |

**Para más adelante** (cuando un video lo pida): el diagrama «ecosistema» (el
personaje al centro y los íconos que aparecen alrededor, en círculo) para los
beneficios de un suplemento o lo que ofrece un negocio; las **tres tarjetitas de
datos** que saltan una tras otra («21,000+ · 95% · 4.8») para los productos
(precio, proteína, nota); el **confeti** cuando algo sale bien; los **globos de
chat** que se escriben solos; y, de Eddie Kang, **una pieza pegada a la persona**
(la corona sobre la cabeza cuando dice «el campeón»), que se puede hacer siguiendo
la cara con `seguir.py`. Sus subtítulos (caja de color, frase entera en dos
líneas) no se toman: los del P4 ya son la marca.

## El primer video: el aguacate

**Editado (noviembre de 2026)** con las tomas del autor desde su Drive: «Video
aguacate» (5:31 de tomas a cámara en la cocina, 4K a 60 fps, varias tomas por
frase), «Parte final aguacate» (el veredicto probándolo) y cuatro tomas de apoyo
(el aguacate entero en el plato, el partido de cerca y las dos mitades en la mano en
el balcón). El corte (`cambios/aguacate/corte.json`) se queda con la mejor toma de
cada frase (completa, sin trabarse, la más cercana al guion y mirando a cámara):
el gancho con el aguacate en la mano, las calorías y los macros en dos frases (la
segunda desde «15 gramos», sobre las tomas de apoyo), «lo interesante» con el
aguacate partido en la mano, los beneficios hasta «…de otros alimentos» (sobre las
tomas de apoyo), «¿Y cómo comerlo?» sin «te estarás preguntando», el bocado de la
toma del veredicto mientras dice «…o incluso en una ensalada», el veredicto
«honesto» de la parte final, «las porciones importan» (cortado ahí: lo que seguía
no se entendía), la pregunta y el «sígueme» inclinado hacia la cámara, con su
último gesto quieto 1,6 s para la firma. Dura 65,7 s.

**Lo que no se grabó:** la frase de los micronutrientes (en la toma hay 23 s de
silencio donde iba). La tabla de micronutrientes no va; si la quieres, se graba
esa frase sola y se mete entre las grasas y los beneficios. Tampoco hay toma de la
arepa con huevos: en su lugar, la lista «¿Cómo comerlo?» con cada opción cuando
la dices.

En este video los subtítulos van más abajo (y 1440): el aguacate en la mano queda
a la altura del pecho.

**Prueba con voz sintética** (`videos/aguacate-borrador-3.mp4`, fuera de git; el 3 ya con
el ritmo nuevo):
el guion leído en voz sintética, transcrito con la misma herramienta que tus
tomas, con el plan encima y un fondo que dice qué toma va en cada parte. Con la
línea del cierre, la voz dura 61 s (62,7 con el segundo y medio en que te quedas
mirando a cámara); las pausas entre frases las quita el corte, así que a tu ritmo
debería quedar cerca del minuto. Todas las frases del plan se encontraron después
de corregir las palabras que la transcripción oyó mal («vitamina C» por
«vitaminas E»; en la primera prueba, «atuno» por «atún o»; en la segunda,
«verdito» por «veredicto»): con tu voz se revisa igual.

| Segundo (aprox.) | Toma | Lo que dices | Lo que sale |
|---|---|---|---|
| 0-8 | 1 · tú con el aguacate | «¿Qué tan saludable es realmente el aguacate? Tiene más calorías que muchas frutas, pero…» | ¿SALUDABLE? detrás de ti · rótulo «Aguacate» · calorías de otras frutas · «Mal alimento» tachado |
| 8-17 | 2 · entero → partido | «Por cada 100 gramos… 160 calorías, 15 gramos de grasas…» | tabla de macros (entra cuando se lee el tachado y se queda 2 s después de la proteína) |
| 17-24 | 3 · primer plano | «Y aquí viene lo interesante… aceite de oliva» | barras aguacate contra aceite de oliva, «¡Casi iguales!» |
| 24-30 | 1 · tú señalando | «También aporta potasio, magnesio, folato…» | tabla de micronutrientes (carrusel: las barras salen por un lado y la tabla entra por el otro) |
| 30-37 | 3 · en el plato | «Su combinación de fibra y grasas…» | Más saciedad · después, Mejor absorción de vitaminas |
| 37-42 | 4 · arepa con huevos | «¿Y cómo comerlo? Con arepa, huevos, atún…» | ¿CÓMO COMERLO? · rótulos Arepa y Huevos |
| 42-52 | 5 · tú probándolo | «¿Mi veredicto? ¡9 de 10!… las porciones importan» | sello 9/10 · Nutritivo · Versátil · Delicioso (2 s para leerlo, después a la esquina) · aviso de porciones |
| 52-57 | 5 | «Y tú, ¿con qué acompañas el aguacate?…» | la pregunta con la caja de comentario |
| 57-63 | 5 | «¿Quieres ver más videos similares? Sígueme para más contenido.» | arriba @eltorvick con YouTube, Instagram y TikTok; SÍGUEME y «para más contenido» |

**Los datos** (USDA FoodData Central, aguacate crudo, todas las variedades, por
100 g): 160 kcal · grasas 14,7 g · carbohidratos 8,5 g (incluyen la fibra) ·
fibra 6,7 g · proteína 2 g · potasio 485 mg · magnesio 29 mg · folato 81 µg ·
vitamina E 2,1 mg · vitamina K 21 µg.

**Dos comparaciones que no estaban en tu guion** (los datos son de la misma
fuente; el autor las aprobó):

- en «más calorías que muchas frutas», las calorías por 100 g: manzana 52,
  banano 89, aguacate 160;
- en «similares a las del aceite de oliva», cómo se reparten sus grasas: el
  aguacate 71 % monoinsaturadas, 13 % poliinsaturadas, 16 % saturadas; el aceite de
  oliva 75 %, 11 % y 14 % (% de sus ácidos grasos).

## Cómo grabar (el aguacate y los que siguen)

**Tú a cámara (toma 1 y toma 5):**

- Vertical, en 4K y 30 fps si puedes (deja margen para los acercamientos). El HDR
  del iPhone puede ir prendido: el corte lo pasa a color normal solo
  (`montar.py`). Apagarlo igual es más simple.
- Plano medio (de la cintura para arriba) con **aire arriba de la cabeza**: ahí
  va lo gigante. El aguacate a la altura del pecho y **a un costado**, no delante de
  la cara (su rótulo va encima de él).
- Micrófono de solapa, o el teléfono cerca; la nevera y el extractor apagados.
- Di el guion de corrido. Si te equivocas, **repite la frase entera** y sigue: yo
  me quedo con la mejor toma de cada frase. No hace falta cortar en Premiere.
- En «tú señalando»: señala siempre hacia el mismo lado; la tabla sale de ese lado.
- Al final, a cámara: «¿Quieres ver más videos similares? Sígueme para más
  contenido.» y **quédate dos segundos mirando a cámara** (con una sonrisa) antes
  de cortar: en esos segundos se leen las redes y @eltorvick. En el corte, `cola`
  de `corte.json` los deja.

**Tomas de apoyo (2, 3 y 4):**

- **En vertical** (una toma horizontal recortada a vertical pierde mucha
  calidad) y a **60 fps** (para la cámara lenta). De 5 a 8 s cada una, quieta o con
  un movimiento lento.
- **Toma 2:** el aguacate entero sobre la mesa: una fija y una con movimiento
  lento.
- **Toma 3:** el aguacate partido, desde arriba, y un acercamiento a la pulpa.
  **Extra que vale oro:** el cuchillo abriéndolo (es «la salsa que cae» de las
  reviews de referencia: la toma más rica).
- **Toma 4:** la arepa con huevos, y tú poniendo el aguacate encima.
- **Toma 5** (a cámara): tú probándolo, con una reacción natural.
- Todo en una sola sesión y antes de cortarlo, para que no se oxide.

**Pausas:** después de la frase de los macros («…y dos gramos de proteína») y de
la del aceite de oliva, deja un segundo de silencio antes de seguir: en el corte
queda un respiro con la toma de apoyo para leer la tabla, y la voz no se adelanta
a lo que está en pantalla.

**Cómo me lo mandas:** las tomas en bruto, sin cortar, con el número de toma en
el nombre si puedes («toma3-cortado.mov»). Si pesan mucho, de a varias.

## Cómo se edita (el proceso, automatizado)

1. **Transcribir cada toma:** `python3 herramientas/transcribir.py cambios/aguacate/media/toma1.mov --out cambios/aguacate/media/t1/transcripcion.json`.
2. **El corte:** `cambios/aguacate/corte.json` con las frases buenas de cada toma
   y las tomas de apoyo, cada una ubicada por la frase que dices encima
   (`"frase": "por cada 100 gramos", "hasta": "proteína"`) →
   `python3 herramientas/montar.py cambios/aguacate/corte.json`. Iguala el volumen,
   quita las pausas, pasa el HDR a color normal y deja la transcripción del corte.
3. **Los objetos con rótulo:** `python3 herramientas/seguir.py cambios/aguacate/media/fuente.mp4 --id aguacate --nombre aguacate-mano --en 1.2 --caja x0,y0,x1,y1 --control hoja.png`
   (una caja alrededor del objeto en un cuadro donde se vea bien; la hoja de
   control muestra si lo siguió).
4. **El plan** ya está: se ajustan las posiciones a lo que se ve, fotos de
   control (`grabar-cambio.js aguacate --cuadros …`), y se exporta
   (`grabar-cambio.js aguacate`).

## Para los que siguen

El mismo plan sirve de molde: se copia `cambios/aguacate/` y se cambian **los
datos de la tabla** (de una fuente como USDA o de la etiqueta del producto), **los
rótulos**, **la nota y las palabras del veredicto** y **la pregunta**. Para un
negocio o un producto «fit», la tabla puede llevar el precio y la etiqueta del
producto, y la línea de criterio cambia a «nutrición · sabor · precio».
