/* tiempos.js — TODOS los tiempos del video en un solo objeto.
   Cada escena dura lo que dice acá. Si cambias un número, las escenas
   siguientes se corren solas (los inicios se calculan sumando).
   Dentro de cada escena, los tiempos son relativos a su inicio (a + 0.6, etc.). */
window.TIEMPOS = {
  fps: 60,
  salida: 0.45,          // segundos que dura la salida (fade hacia arriba) de cada escena
  escenas: [
    // [nombre,      duración en s]
    ['portada',      5.0],  // gancho: título + marca (el primer cuadro es la miniatura)
    ['contexto',     8.0],  // jueves 19, PS5 y Xbox, medianoche local
    ['ola',          7.0],  // la regla: una ola de medianoches
    ['nz',           6.5],  // paso 1: Nueva Zelanda
    ['espana',       8.0],  // paso 2: España (pizarra)
    ['sudamerica',   8.0],  // paso 3: Sudamérica (notificaciones)
    ['mexico',       6.0],  // paso 4: México y Centroamérica (contador 19 h)
    ['tabla',        8.0],  // tabla para guardar
    ['ojo',          9.0],  // EE. UU. + región de la cuenta (chat)
    ['precarga',     7.0],  // sin precarga vs con precarga
    ['hub',          6.5],  // la idea grande
    ['fuentes',      4.5],  // de dónde salen los datos
    ['cta',          9.0],  // ¿estás listo? + suscribirse + cierre
  ],
};
