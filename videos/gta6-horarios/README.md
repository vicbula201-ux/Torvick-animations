# GTA 6 · ¿a qué hora sale en tu país? — Modo Vice

Video explainer vertical (1080×1920, 60 fps, 92,5 s) para Shorts / TikTok / Reels.
Página HTML + GSAP con **una sola línea de tiempo maestra en pausa**, renderizada cuadro
por cuadro con Playwright y ffmpeg. Audio sintetizado con numpy.

Este proyecto es independiente del generador de pizarra de la raíz del repo: tiene su propia
paleta (la de la marca Modo Vice) y usa GSAP a propósito.

## Ver y editar

- **Vista previa:** doble clic en `index.html`. Aparece una barra abajo con reproducir y
  línea de tiempo (sin audio). Las fuentes, GSAP y los íconos están en la carpeta: no hace
  falta internet.
- **Textos:** viven en `escenas.js`, dentro de cada escena (`titular(...)`, `subtitulo(...)`,
  tarjetas). En los titulares, `*palabra*` la resalta en magenta y `|` corta la línea.
- **Tiempos:** la duración de cada escena está en `tiempos.js`, en un solo objeto. Si cambias
  un número, las escenas siguientes se corren solas. Dentro de cada escena, los tiempos son
  relativos a su inicio (`a + 0.6`).
- **Mascota:** `personaje.js` (flamenco con gafas). Acciones: `parpadear`, `saludar`,
  `asentir`, `celebrar`, `feliz`, `respirar`.

## Render

```bash
./construir.sh
```

Hace todo: render en 4 procesos → `salida/video-sin-audio.mp4`, audio → `salida/audio.wav`
(-16 LUFS), MP4 final → `salida/gta6-a-que-hora-sale-modo-vice.mp4`, miniatura →
`salida/miniatura.png` (el primer cuadro) y una verificación con ffprobe y ebur128.

Para revisar antes del render completo:

```bash
node render.js --fotos 0,12,24.5
```

```bash
node render.js --hoja 1.0
```

La primera saca capturas PNG en `salida/fotos/`; la segunda, un cuadro por segundo en `salida/hojas/`.

Requisitos: Node con `playwright` (Chromium), Python 3 con `numpy`, `ffmpeg` y `ffprobe`.

## Cómo está hecho

| Archivo | Qué hace |
|---|---|
| `index.html` | lienzo de 1080×1920 y carga de scripts |
| `estilos.css` | solo apariencia (nada de `@keyframes` ni `transition`) |
| `tiempos.js` | duración de cada escena |
| `motor-video.js` | línea de tiempo, utilidades de movimiento, subtítulos y API de render |
| `personaje.js` | la mascota en SVG |
| `escenas.js` | las 13 escenas |
| `render.js` | Playwright → JPEG 93 → ffmpeg (libx264 -crf 16, yuv420p, 60 fps), 4 procesos + concat |
| `audio.py` | música I–V–vi–IV (marimba, pad, bajo, batería) + efectos según `window.__cues` |

La página expone `window.__seek(t)` (llama a `TL.seek(t, false)`), `window.__duration`,
`window.__ready` y `window.__cues`. Todo es determinista: nada de `setTimeout`, ni animaciones
CSS, ni `Math.random` (el confeti usa azar con semilla). Un cuadro sale idéntico tanto si
se llega a él saltando directo como reproduciendo en orden. Eso permite repartir el
render en procesos paralelos.

Las fuentes se cargan con `document.fonts.load` **antes** de construir las escenas y medir
textos. Las apariciones usan `gsap.set` + `fromTo(..., { immediateRender: false })`, nunca
`from()` tardíos.

## Datos usados (consultados el 17 nov 2026)

- Regla de Rockstar (soporte oficial): sale a las 00:00 hora local del jueves 19 de noviembre
  en todas las regiones, PS5 y Xbox Series X|S.
- Tandas por región según los listados de la PlayStation Store: Nueva Zelanda 11:00 UTC del
  18 → España 23:00 UTC → Argentina, Chile, Uruguay y Paraguay 03:00 UTC → Bolivia 04:00 →
  Colombia, Perú, Ecuador, Panamá y EE. UU. (Este) 05:00 → México y Centroamérica 06:00.
- Precarga abierta desde el 10 de noviembre (compra digital), hasta 212 GB.

Licencias de terceros: Inter y Caveat (SIL OFL, en `fuentes/`), Lucide (ISC,
`LICENCIA-Lucide-ISC.txt`), GSAP 3.12.5 (licencia estándar de GreenSock, en la cabecera de
`vendor/gsap.min.js`).
