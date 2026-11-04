# De tu voz al video terminado

Antes: grababas la voz, ajustabas a mano la duración de cada escena hasta que coincidiera,
volvías a exportar y juntabas voz y video en Premiere.

Ahora: grabas la voz de un reel en una sola toma y una herramienta hace el resto. Encuentra
dónde empieza cada línea, ajusta cada escena a lo que dura tu línea y te entrega el MP4 con tu
voz, las X y los vistos ya mezclados, listo para revisar y publicar.

Tu voz no se toca: no se acelera, no se corta por dentro y no lleva efectos. Solo se nivela el
volumen.

## 1. Grabar la voz (lo único que haces tú)

1. Abre `reels.html` y elige el reel. A la derecha ves el guion: lo lees línea por línea.
2. Graba **una toma por reel**, con **todas las líneas en orden**, incluido tu cierre
   («sígueme en Torvick y entrena con Tor…»).
3. Deja **medio segundo de silencio entre línea y línea**. Ese silencio es lo que la
   herramienta usa para saber dónde cambia la escena.
4. Si te equivocas, **vuelve a grabar la toma completa** (son 30-40 segundos). Si repites
   una línea dentro de la misma toma, los cortes se corren.
5. Ponle al archivo **el nombre del reel**: `plancha.m4a`, `hip-thrust.mp3`… La lista de
   nombres está en `trabajo/tablero.md`. Las mayúsculas, las tildes y los espacios no
   importan («Hip Thrust.m4a» sirve).

Sirve cualquier formato del teléfono o del computador (m4a, mp3, wav…). Graba cerca del
micrófono y en un lugar silencioso.

## 2. Convertir las voces en videos (dos caminos)

**A. Me mandas las grabaciones en el chat.** Yo corro la herramienta y te devuelvo los MP4
y el informe. No tienes que instalar nada.

**B. En tu computador.** Pon las grabaciones en una carpeta `voces/` dentro de la carpeta del
proyecto y corre:

```
node herramientas/lote.js voces
```

Para un solo reel:

```
node herramientas/grabar.js plancha --voz voces/plancha.m4a
```

Se instala una sola vez: Node, ffmpeg, Python 3 con numpy, y
`npm i -g playwright && npx playwright install chromium`. En el servidor de Claude, un reel
de 30-40 s tarda 2-4 minutos y mientras tanto no tienes que hacer nada.

Los videos quedan en `videos/`:

- `<reel>-con-voz.mp4`: el video terminado.
- `<reel>-voz.txt`: el informe. Dice qué tramo de tu voz cayó en cada escena y si hay algo
  para revisar.
- `<reel>-guion.txt`: el guion con los tiempos nuevos.

La carpeta `voces/` no se sube a GitHub: tu voz queda solo en tu computador.

## 3. Revisar antes de publicar

- Si el informe dice **«Sin avisos»**, ve el video una vez de corrido y publícalo.
- Si dice **«REVISAR»** o tiene **avisos**, mira las escenas que nombra. Casi siempre es
  una línea saltada, una repetida o una pausa muy corta. Lo más rápido es volver a grabar
  esa toma.
- Si la grabación no tiene pausas suficientes, la herramienta se detiene antes de crear el
  video y te dice que la grabes de nuevo.

## 4. Medir (para saber si de verdad ahorra tiempo)

Anota en `trabajo/tablero.md`, por lote:

| Paso | Minutos |
|---|---|
| Grabar las voces | |
| Correr la herramienta (tiempo de espera, no de trabajo) | |
| Revisar y corregir | |
| Publicar | |

Compáralo con lo que te tomaba antes ajustar las duraciones a mano y montar en Premiere.

## Lo que todavía no está probado

- Con **tu voz real**: hasta ahora se probó con voces sintéticas en los guiones de los 36
  reels. En esas pruebas ninguna escena quedó corrida y el peor desfase en un borde fue de
  0,15 s.
- En **tu computador**: no sé si tienes instalados Node, ffmpeg y Playwright. Si no, usa el
  camino A.
