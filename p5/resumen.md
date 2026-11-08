# P5 · Resumen: los cuatro tipos juntos

El P5 son los videos verticales del autor que no son ni animación (P3) ni el
cambio físico (P4): **reviews, entrevistas, retos y divagaciones.** Se estudiaron
25 videos de referencia; el detalle de cada tipo está en su archivo:

| Tipo | Archivo | Videos | Duración (mediana) | Lo que retiene |
|---|---|---|---|---|
| Reviews | `reviews.md` | 14 | 52 s | algo nuevo en pantalla cada segundo; el dato concreto |
| Entrevistas | `entrevistas.md` | 5 | 98 s | la curiosidad por la próxima respuesta |
| Retos | `retos.md` | 2 (+ el de agarre de las entrevistas) | 56 s | ¿lo logra?, ¿quién gana?; el número a la vista |
| Divagaciones | `divagaciones.md` | 4 | 44 s | una imagen que se recuerda y la persona que habla |

## Lo que comparten los cuatro

1. **El primer segundo ya muestra de qué se trata:** la comida, el envase, el
   micrófono delante de alguien, la barra, la tesis dicha. Nunca un saludo ni un
   logo.
2. **Subtítulos casi siempre** (24 de 25), de 1 a 3 palabras, con **la palabra
   que importa en otro tamaño o color**. En los cuatro tipos aparece la misma
   idea: una capa para lo que se dice, otra para lo que hay que recordar.
3. **−14 LUFS** (23 de los 24 con audio) y **sin silencios**, salvo los que son
   a propósito (el chiste de una entrevista, el «2 horas después»). Las
   referencias llevan música suave debajo; los videos del autor, no.
4. **Un número o un dato concreto** en reviews, entrevistas y retos; una imagen
   concreta en las divagaciones.
5. **Un cierre de una línea** que pide algo: comentar una palabra, guardar,
   seguir, etiquetar, o que le da algo a otro (el @ del entrevistado, el premio).
6. **El patrocinio entra en el contenido, no aparte:** el premio del reto, el
   gimnasio de la entrevista, el código de descuento de la review (6 de 25).

## Las decisiones

**La guía que se aplica a cada video está en `estilo.md`.** Lo que interesa de
las referencias es el estilo de edición (subtítulos, letras grandes,
animaciones, efectos, zooms), no el guion ni la música.

1. **Sin música** (decisión del autor). Solo la voz y los efectos.
2. **Subtítulos:** los del P4 (1-3 palabras en minúscula, la que suena en la caja
   amarilla) más la palabra clave o el número en grande. Valor por defecto.
3. **Emojis:** los 3D de `cambio/emoji/`, uno a la vez y pocos. Valor por defecto.
4. **Memes:** no; en su lugar, **reacciones de Tor** (ver `entrevistas.md`).
   Valor por defecto.

## Lo que hay que sumarle al motor del P4

No hace falta un motor nuevo: `cambio.jsx` ya hace subtítulos, títulos, números,
tarjetas, listas, etiquetas, el contador de repeticiones, la caja de
comentario, la cámara, los sonidos y la firma. Lo que piden las referencias,
ordenado por cuántos tipos lo usan:

| Pieza | Para qué | Reviews | Entrevistas | Retos | Divagaciones |
|---|---|---|---|---|---|
| **Inserto a pantalla completa** (y en la mitad de arriba) | una escena animada con Tor o un video de archivo, y volver a la cámara | sí | sí | sí | sí |
| **Banco de animaciones de Tor** | reacciones, analogías, la explicación científica | sí | sí | sí | sí |
| **Acercamientos automáticos** en cada frase | el ritmo con una sola cámara | sí | — | — | sí |
| **Tarjeta final del largo** (la de `clip-cierre.jsx`) | «Comenta X y te mando el video completo» | sí | sí | — | sí |
| **Subtítulos de dos voces** y traducidos | quién pregunta y quién responde; el que habla otro idioma | — | sí | sí | — |
| **Tabla de récords** | el reto como serie | — | sí | sí | — |
| **Contador con saltos** y **confeti** | las repeticiones recortadas; el momento cumbre | — | — | sí | — |
| **Notas que se acumulan** | la comparativa con puntaje | sí | — | — | — |
| **Pin, precio a máquina, gráfico de un dato, placa de tiempo** | el lugar, el precio, la glucosa, «2 horas después» | sí | — | — | — |
| **Tarjeta de la pregunta del seguidor** | «me preguntaron…» | — | — | — | sí |

**Propuesta de orden:** primero el **inserto** y las **primeras 5-6 animaciones
de Tor**, porque los cuatro tipos los usan y son lo que te diferencia de todas las
referencias. Lo demás, cuando llegue el primer video de cada tipo.

## Cómo se trabaja un video del P5

El mismo flujo del P4 (`CAMBIO.md`): grabas, cortas en Premiere, me mandas el
corte; se transcribe, se arma el plan con las piezas de arriba y se exporta en
1080×1920 a −14 LUFS con la firma de Torvick al final. Cada tipo tiene su
plantilla y su lista de tomas en su archivo.
