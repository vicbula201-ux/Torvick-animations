# Nota de entrega — "¿A qué hora sale GTA 6 en tu país?"

**Archivos:** `salida/gta6-a-que-hora-sale-modo-vice.mp4` (vertical 1080×1920, 60 fps,
92,5 s, -16 LUFS) y `salida/miniatura.png` (el primer cuadro: título + marca).

## Lo que decidí porque no contestaste las preguntas

1. **Formato vertical 1080×1920** para Shorts, TikTok y Reels. Todo lo importante queda por
   encima de y = 1600 y lejos del borde derecho, así la interfaz de las apps no tapa nada.
2. **Estilo claro con tu marca:** fondo lila con damero, tarjetas blancas, magenta `#FD0894`,
   cian `#02F8F7` y naranja `#FEA632`, texto morado `#190028`. La portada y el cierre son
   paneles oscuros estilo synthwave (sol con rayas y rejilla), como tu banner.
3. **Mascota propia:** un flamenco con gafas de sol en la frente, por Leonida y Florida.
   Parpadea, saluda, asiente y celebra.
4. **Logo:** recorté el avatar de tu captura de pantalla (200 px). Se ve bien a ese tamaño,
   pero si me pasas el PNG original queda más nítido.
5. **Nombre en pantalla:** MODO VICE + @Modovicecity6 (no "Vice city").
6. **EE. UU. incluido** con la nota "según la PlayStation Store; Rockstar no lo detalló".
   Para los países sin dato verificado puse una línea genérica: "¿Tu país no está? Sale a las
   00:00 de la región de tu tienda".
7. **Nada oficial de Rockstar:** ni logo de GTA VI ni arte del juego. "GTA 6" va escrito con
   la tipografía del video. Al final aparece "Canal de fans · sin afiliación con Rockstar Games".
8. **Sin voz en off:** se entiende sin sonido gracias a los subtítulos grandes. La música
   y los efectos son sintetizados, así que no hay licencias que pagar ni reclamos de copyright.

## Lo que tienes que confirmar antes de publicar

- **Horario de la costa oeste de EE. UU. (21:00 del miércoles):** sale del listado de la
  PlayStation Store y Rockstar no lo confirmó. Si prefieres no arriesgar, se quita esa fila y
  la nota de la tabla.
- **"La hora la marca la región de tu cuenta":** lo reportan varios medios con base en
  la PS Store (el truco de la cuenta de Nueva Zelanda). En Xbox podría comportarse distinto.
- **Tabla:** el orden y las horas UTC vienen de los listados de la PS Store recogidos por
  medios (Vice, GamerFuzion, MP1st, allthings.how). Una fuente dice que Xbox usa las mismas
  tandas, pero no está confirmado. Rockstar solo dice "medianoche local en todas las regiones".
- **Precarga desde el 10 de noviembre y hasta 212 GB:** viene del Newswire y del soporte de
  Rockstar. No pude abrir esas páginas desde aquí (la red de la sesión las bloquea) y lo tomé
  de medios que las citan.
- **Fecha:** el video dice "jueves 19". Publícalo como tarde el 18. El 19 ya queda viejo.

## Versión corta y textos para publicar

También hay una versión de 30 s (`salida/gta6-a-que-hora-sale-modo-vice-corto.mp4`):
portada → jueves 19 a las 00:00 → la ola de medianoches → la tabla → suscribirse.
El título, la descripción, los hashtags y las etiquetas están en `PUBLICACION.md`.

## Para cambiar algo

Los textos están en `escenas.js` y las duraciones en `tiempos.js`. Para volver a generar todo
se corre `./construir.sh` (o `./construir.sh corto`). Más detalle en `README.md`.
