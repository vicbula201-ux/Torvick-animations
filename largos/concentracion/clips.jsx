/* ============================================================
   largos/concentracion/clips.jsx — los shorts del video de concentración

   Cada short trae el guion entero (lo que dicen los subtítulos, con su
   tramo, y lo que se ve) y los subtítulos del cierre palabra por palabra,
   medidos cuadro a cuadro en el original. `desde` es el primer cuadro
   del cierre: de ahí en adelante herramientas/cierre-clip.js pone el
   cierre nuevo (con YouTube, Instagram, TikTok y @eltorvick).
   Los archivos originales no van a git: se pasan con --video.
   ============================================================ */
(function (global) {
  'use strict';
  var reg = global.CLIPS.registrar;
  var TARJETA = '¿NO TE|PUEDES|CONCENTRAR?';
  var PANT_CIERRE = '@eltorvick con YouTube, Instagram y TikTok; tarjeta "VIDEO COMPLETO · ¿NO TE PUEDES CONCENTRAR?" (la miniatura); botón "MIRA EL VIDEO COMPLETO"';

  reg({
    id: 'concentracion-1',
    titulo: 'Short 1 · 5 a 50 minutos',
    video: 'Short 1 - 5 a 50 minutos.mp4',
    desde: 26.2, fin: 31.2,
    tituloTarjeta: TARJETA,
    subs: [
      { fin: 27.567, palabras: [[26.367, 'EN'], [26.6, 'MI'], [26.8, 'CANAL'], [27.133, 'EXPLICO']] },
      { fin: 28.567, palabras: [[27.6, 'CÓMO'], [27.867, 'RECUPERAR'], [28.4, 'TU']] },
      { fin: 29.3, palabras: [[28.6, 'ATENCIÓN.']] },
      { fin: 30.133, palabras: [[29.333, 'MIRA'], [29.6, 'EL'], [29.8, 'VIDEO']] },
      { fin: 31.3, palabras: [[30.167, 'COMPLETO.']] }
    ],
    guion: [
      { ini: 0.2, fin: 7.8, texto: 'Lo que dijiste que iba a ser un descanso de 5 minutos de TikTok… se convirtió en 50 minutos.',
        pantalla: '"SOLO 5 MINUTOS…"; el chico con el celular y un reloj de 5 MIN; el reloj crece: 11 MIN, 49 MIN, 50 MIN en rojo, con globos 99+, 50+, 200+, 90+' },
      { ini: 8.0, fin: 11.8, texto: 'Las distracciones son tan peligrosas que ni cuenta te das.',
        pantalla: 'el celular lleno de notificaciones (campanas, 99+, 200+, 90+, 50+) y la cara mareada' },
      { ini: 12.0, fin: 15.2, texto: 'Y cuando te das cuenta… ya es demasiado tarde.',
        pantalla: 'el chico con el celular, el reloj en 50 MIN, un "!" y el fondo que se pone rojo' },
      { ini: 15.4, fin: 19.4, texto: 'Tu concentración bajó y tienes que volver a empezar de cero.',
        pantalla: '"CONCENTRACIÓN": la barra cae de 92 % a 8 % y vuelve a cargar (34 %); el chico en el escritorio' },
      { ini: 19.6, fin: 23.2, texto: 'Es como encender y apagar un carro a cada rato.',
        pantalla: 'el carro con "OFF" y "ON"' },
      { ini: 23.4, fin: 26.2, texto: 'Eso no es eficiente ni sostenible, ¿verdad?',
        pantalla: 'X roja sobre el carro, "NI EFICIENTE" y "NI SOSTENIBLE"' },
      { ini: 26.4, fin: 29.3, texto: 'En mi canal explico cómo recuperar tu atención.', pantalla: PANT_CIERRE },
      { ini: 29.3, fin: 31.2, texto: 'Mira el video completo.', pantalla: 'el cursor aprieta el botón' }
    ]
  });

  reg({
    id: 'concentracion-3',
    titulo: 'Short 3 · Diseña tu entorno',
    video: 'Short 3 - Diseña tu entorno.mp4',
    desde: 26.2, fin: 31.2,
    tituloTarjeta: TARJETA,
    subs: [
      { fin: 27.267, palabras: [[26.367, 'SI'], [26.567, 'QUIERES'], [27.033, 'MÁS']] },
      { fin: 28.0, palabras: [[27.3, 'CONSEJOS,']] },
      { fin: 28.867, palabras: [[28.033, 'MIRA'], [28.333, 'EL'], [28.533, 'VIDEO']] },
      { fin: 29.9, palabras: [[28.9, 'COMPLETO'], [29.367, 'SOBRE'], [29.733, 'LA']] },
      { fin: 31.3, palabras: [[29.933, 'CONCENTRACIÓN.']] }
    ],
    guion: [
      { ini: 0.2, fin: 4.4, texto: 'Si quieres concentrarte más, empieza por cambiar el lugar donde trabajas.',
        pantalla: '"ANTES": el chico en el escritorio con el celular, la tele con fútbol y los íconos de like, mensaje, mail y %' },
      { ini: 4.6, fin: 8.0, texto: 'Tu cerebro va a evitar a toda costa lo difícil.',
        pantalla: 'el cerebro entre "DIFÍCIL" (un bloque de piedra) y "FÁCIL" (el celular)' },
      { ini: 8.2, fin: 10.8, texto: 'Así que oblígalo: diseña tu entorno.',
        pantalla: '"DISEÑA TU ENTORNO" con la lista: Teléfono lejos, Sin notificaciones, Mesa despejada' },
      { ini: 11.0, fin: 13.8, texto: 'Deja el teléfono en otra habitación.',
        pantalla: 'casillas TELÉFONO · NOTIFICACIONES · MESA; el teléfono sale por la puerta y se tilda TELÉFONO' },
      { ini: 14.0, fin: 16.4, texto: 'Desactiva las notificaciones.',
        pantalla: 'el celular en Ajustes › Notificaciones: el interruptor se apaga, la campana se tacha y se tilda NOTIFICACIONES' },
      { ini: 16.6, fin: 19.4, texto: 'Despeja tu mesa: nada que te distraiga.',
        pantalla: 'la tele se apaga, la taza se va y se tilda MESA' },
      { ini: 19.6, fin: 22.8, texto: 'Toda tu energía, en un solo lugar a la vez.',
        pantalla: '"DESPUÉS": el chico trabajando y la flecha que da en la diana' },
      { ini: 23.0, fin: 26.2, texto: 'Haz todo lo necesario para trabajar concentrado.',
        pantalla: 'pantalla partida "DISTRACCIÓN | ENFOQUE"' },
      { ini: 26.4, fin: 28.0, texto: 'Si quieres más consejos,', pantalla: PANT_CIERRE },
      { ini: 28.0, fin: 31.2, texto: 'mira el video completo sobre la concentración.', pantalla: 'el cursor aprieta el botón' }
    ]
  });

  reg({
    id: 'concentracion-4',
    titulo: 'Short 4 · La regla de 25 minutos',
    video: 'Short 4 - La regla de 25 minutos.mp4',
    desde: 25.4, fin: 30.4,
    tituloTarjeta: TARJETA,
    subs: [
      { fin: 26.3, palabras: [[25.567, '¿QUIERES'], [26.1, 'MÁS']] },
      { fin: 27.1, palabras: [[26.3, 'TÉCNICAS?']] },
      { fin: 28.0, palabras: [[27.1, 'MIRA'], [27.4, 'EL'], [27.633, 'VIDEO']] },
      { fin: 29.067, palabras: [[28.0, 'COMPLETO'], [28.5, 'SOBRE'], [28.9, 'LA']] },
      { fin: 30.5, palabras: [[29.1, 'CONCENTRACIÓN.']] }
    ],
    guion: [
      { ini: 0.3, fin: 1.3, texto: 'Trabaja inteligente.',
        pantalla: 'el chico trabajando tranquilo con el bombillo encendido' },
      { ini: 1.3, fin: 3.4, texto: 'No trabajes duro como estúpido.',
        pantalla: 'la pila de papeles crece y le cae una X roja' },
      { ini: 3.6, fin: 6.6, texto: 'Se llama técnica Pomodoro, y es muy simple.',
        pantalla: '"TÉCNICA POMODORO", el tomate y "MUY SIMPLE"' },
      { ini: 6.9, fin: 10.8, texto: 'Uno: trabaja 25 minutos en una sola tarea, sin distracciones.',
        pantalla: '"1 · TRABAJA": el reloj va de 0 a 25 MIN' },
      { ini: 11.1, fin: 14.6, texto: 'Dos: descansa 5 minutos. Camina, respira, estírate.',
        pantalla: '"2 · DESCANSA": 5 minutos en verde en el reloj y los íconos CAMINA, RESPIRA, ESTÍRATE' },
      { ini: 14.9, fin: 16.8, texto: 'Tres: repite.',
        pantalla: '"3 · REPITE": el tomate con flechas en círculo y los tomatitos que se suman' },
      { ini: 17.0, fin: 22.4, texto: 'Es como un carro en un viaje largo: tarde o temprano tiene que echar gasolina.',
        pantalla: 'el carro, el medidor de GASOLINA (E–F) que baja, el surtidor y "¡LLENO!"' },
      { ini: 22.6, fin: 25.3, texto: 'Ajústalo a tu ritmo, pero sé consecuente.',
        pantalla: 'la tarjeta TRABAJO 42 → 45 MIN / DESCANSO 6 → 10 MIN y "SÉ CONSECUENTE" con un visto' },
      { ini: 25.6, fin: 27.0, texto: '¿Quieres más técnicas?', pantalla: PANT_CIERRE },
      { ini: 27.1, fin: 30.4, texto: 'Mira el video completo sobre la concentración.', pantalla: 'el cursor aprieta el botón' }
    ]
  });
})(window);
