# P5 · Reviews de alimentos (y después productos)

La serie de reviews de Torvick: un alimento por video, con su aporte nutricional,
contado a cámara con tomas de apoyo, letras y animaciones. Empieza con alimentos
(el aguacate es el primero) y después sigue con productos de otros negocios,
productos «fit», suplementos y mini vlogs, con el mismo armazón.

**Estado:** formato listo, piezas nuevas en el motor, el plan del aguacate armado
sobre el guion y probado con una voz sintética. Falta el material (lo grabas tú).

**Referencias de estilo:** las 14 reviews de `reviews.md`, las capturas del
creador del laboratorio que te gustaron (el nombre de cada producto aparece
encima del producto; el estudio flotando con la frase resaltada) y, cuando
lleguen, los videos de Eddie Kang (MyEdSpace) y tu animación «Your Child's
Learning Journey» (la base de estilo para la tabla nutricional).

## El formato (el mismo en cada alimento)

**Gancho → calorías y macros → lo interesante → micronutrientes → beneficios →
cómo comerlo → veredicto → pregunta → cierre.** De 45 a 60 s con el cierre.
Repetir el orden es lo que vuelve reconocible la serie.

| Tramo | Toma | Qué sale encima | Sonido |
|---|---|---|---|
| Gancho | tú con el alimento en la mano, a cámara | la pregunta **gigante detrás de ti** («¿SALUDABLE?»); **el nombre encima del alimento**, pegado a él aunque lo muevas; golpe de zoom; «Mal alimento» tachado | golpe, pop, error |
| Calorías y macros | tomas de apoyo del alimento (desenfocadas detrás) | **la tabla nutricional**: llega con las filas apagadas y cada fila se enciende, cuenta su número y se resalta en amarillo **cuando la nombras** | whoosh, pop + subida por fila |
| Lo interesante | primer plano del alimento | el rótulo sobre el alimento; una **comparación en barras** cuando hay un «similar a…» | golpe, subida, ding |
| Micronutrientes | tú señalando hacia un lado | la segunda tabla entra **como carrusel**, del lado al que señalas | whoosh, pop por fila |
| Beneficios | el alimento en el plato | pastillas que arman la idea («Fibra + Grasas = Más saciedad») | click, ding |
| Cómo comerlo | el alimento con lo que lo acompañas | «¿CÓMO COMERLO?»; **rótulos encima de cada cosa** que se ve (arepa, huevos); pastillas para lo que no se ve (atún, ensalada) | whoosh, pop |
| Veredicto | tú probándolo, a cámara | **el sello Torvick** (ver abajo) | whoosh, golpe, campana, ding por palabra |
| Advertencia | tú | «Las porciones importan» con el ícono de aviso | click |
| Pregunta | tú | «¿Con qué lo acompañas?» grande y la caja de comentario | whoosh, clicks |
| Cierre | la última toma, oscurecida | «¿quieres ver más videos así?», SÍGUEME, YouTube · Instagram · TikTok, @eltorvick | golpe, pop × 3 |

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
| Cierre grande | `firma: { estilo: 'grande' }` en el registro | ver la tabla de arriba |

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

## El primer video: el aguacate

**El plan ya está armado** en `cambios/aguacate/plan.jsx`, pieza por pieza sobre
tu guion. Cuando llegue el material, solo falta cortar, seguir los objetos y
ajustar posiciones a lo que se ve.

**Prueba con voz sintética** (`videos/aguacate-borrador-voz-sintetica.mp4`, fuera de git):
el guion leído en voz sintética, transcrito con la misma herramienta que tus
tomas, con el plan encima y un fondo que dice qué toma va en cada parte. Dura
59,9 s con el cierre; leyendo un poco más rápido que la voz sintética, queda en
menos de un minuto. Todas las frases del plan se encontraron después de corregir
dos palabras que la transcripción oyó mal («atuno» por «atún o», «vitamina C» por
«vitaminas E»): con tu voz se revisa igual.

| Segundo (aprox.) | Toma | Lo que dices | Lo que sale |
|---|---|---|---|
| 0-8 | 1 · tú con el aguacate | «¿Qué tan saludable es realmente el aguacate? Tiene más calorías que muchas frutas, pero…» | ¿SALUDABLE? detrás de ti · rótulo «Aguacate» · calorías de otras frutas · «Mal alimento» tachado |
| 8-17 | 2 · entero → partido | «Por cada 100 gramos… 160 calorías, 15 gramos de grasas…» | tabla de macros |
| 17-24 | 3 · primer plano | «Y aquí viene lo interesante… aceite de oliva» | golpe · rótulo · barras aguacate contra aceite de oliva |
| 24-29 | 1 · tú señalando | «También aporta potasio, magnesio, folato…» | tabla de micronutrientes (carrusel) |
| 29-37 | 3 · en el plato | «Su combinación de fibra y grasas…» | Fibra + Grasas = Más saciedad · Absorbes mejor las vitaminas |
| 37-42 | 4 · arepa con huevos | «¿Y cómo comerlo? Con arepa, huevos, atún…» | ¿CÓMO COMERLO? · rótulos Arepa y Huevos · pastillas Atún y Ensalada |
| 42-53 | 5 · tú probándolo | «¿Mi veredicto? ¡9 de 10!… las porciones importan» | sello 9/10 · Nutritivo · Versátil · Delicioso · aviso de porciones |
| 53-57 | 5 | «Y tú, ¿con qué acompañas el aguacate?…» | la pregunta con la caja de comentario |
| 57-60 | 5, oscurecida | (opcional: «¿quieres ver más videos así? sígueme») | el cierre grande |

**Los datos** (USDA FoodData Central, aguacate crudo, todas las variedades, por
100 g): 160 kcal · grasas 14,7 g · carbohidratos 8,5 g (incluyen la fibra) ·
fibra 6,7 g · proteína 2 g · potasio 485 mg · magnesio 29 mg · folato 81 µg ·
vitamina E 2,1 mg · vitamina K 21 µg.

**Dos propuestas que no están en tu guion** (los datos son de la misma fuente;
se quitan si no te gustan):

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
- Al final, si quieres, «¿quieres ver más videos así? Sígueme»: el cierre lo
  muestra igual.

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
