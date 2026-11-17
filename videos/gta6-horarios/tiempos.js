/* tiempos.js — TODOS los tiempos del video en un solo objeto.
   Hay dos versiones; se elige con ?v=corto en la URL (por defecto, la completa).
   Cada escena dura lo que dice acá. Si cambias un número, las escenas
   siguientes se corren solas (los inicios se calculan sumando).
   Dentro de cada escena, los tiempos son relativos a su inicio (a + 0.6, etc.). */
window.TIEMPOS = {
  fps: 60,
  salida: 0.45,          // segundos que dura la salida (fade hacia arriba) de cada escena
  versiones: {
    // 92,5 s — explicación completa
    completo: [
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
    // 30 s — versión corta para Shorts / TikTok / Reels
    corto: [
      ['portada',      3.0],
      ['contexto',     6.0],
      ['ola',          6.0],
      ['tabla',        8.0],
      ['cta',          7.0],
    ],
  },
};
(function () {
  const v = new URLSearchParams(location.search).get('v');
  TIEMPOS.version = v && TIEMPOS.versiones[v] ? v : 'completo';
  TIEMPOS.escenas = TIEMPOS.versiones[TIEMPOS.version];
})();
