/* ============================================================
   FONDOS EN PARALELAS — TOR EN 3D, EN EL PARQUE (el guion como lo grabo Victor)
   Sujeto con los brazos estirados y el cuerpo suspendido, el torso un poco
   adelante; bajar flexionando los codos hasta ~90 grados y empujar. Pectoral
   mayor (principal), con ayuda del deltoides anterior y el triceps. Errores:
   echarse hacia atras y bajar rapido / balancearse.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, V = global.V, B = global.B, E3 = global.E3;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;

  var PECHO = ['m:pecho:0', 'm:pecho:1'];
  var PARALELAS = { tipo: 'paralelas', p: [0, 0, 0], alto: 1.22, sep: 0.6 };
  /* k 0 abajo (codos en 90) .. 1 arriba (brazos estirados); atras 0..1 el torso se echa hacia atras;
     balanceo -1..1 las piernas se van adelante y atras */
  function pose(k, atras, balanceo) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)), b = atras || 0, w = balanceo || 0;
    var ang = (30 - 22 * e) * (1 - b) + (-14 + 4 * e) * b;
    var a = ang * Math.PI / 180;
    var sc = E3.lerp3([0, 1.64, 0.12 - 0.16 * b], [0, 2.02, 0.02 - 0.06 * b], e);
    var cad = [0, sc[1] - Math.cos(a) * 0.565, sc[2] - Math.sin(a) * 0.565];
    var pz = -0.42 + 0.5 * b + 0.3 * w;
    var p = { cadera: cad, tronco: [ang, 0, 0], cabeza: [-10 + 14 * b, 0, 0],
      pieI: [-0.1, cad[1] - 0.62, cad[2] + pz], pieD: [0.1, cad[1] - 0.66, cad[2] + pz + 0.06], pies: [60, 60] };
    [-1, 1].forEach(function (s) { var L = s < 0 ? 'I' : 'D'; p['mano' + L] = [s * 0.3, 1.28, 0.04]; p['codo' + L] = [0.15, 0, -1]; });
    return p;
  }
  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.38 : va, 0.14); }
  function cuadro(k, atras, balanceo, extra, kEn) {
    var fan = [];
    if (kEn) [0.04, 0.08, 0.12].forEach(function (dt) { var k2 = kEn(dt); if (Math.abs(k2 - k) > 0.04) fan.push(pose(k2, atras, balanceo)); });
    return { figuras: [Object.assign({ quien: 'tor', pose: pose(k, atras, balanceo), fantasmas: fan }, extra || {})], objetos: [PARALELAS] };
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: 'Estás haciendo mal tus fondos en paralelas.',
      C: E3.escena({
        tomas: [[0, { az: 56, el: 6, dist: 5.6, y: 1.55 }], [1, { az: 44, el: 4, dist: 7.0, y: 1.45 }]],
        vista: function (T, f) {
          var k = reps(T, f(0), f(1), 3, 0.3);
          var r = cuadro(k, 0.9, Math.sin(T * 7), { musc: { pecho: 'rojo', deltoides: 'rojo' }, cara: { boca: 'dientes', cejas: 'enojo' } });
          r.vibra = true; return r;
        },
        lienzo: function (T, f, t, pr) { return <V.Gotas T={T} c={pr('cabeza')} v={1} />; },
        mal: [{ x: 80, y: 430, cuando: 0.2, s: 0.6 }, { x: 850, y: 1150, cuando: 0.44, s: 0.5 }],
        r1: { text: 'FONDOS EN *PARALELAS*', s: 1.05, cuando: 0.02, tono: 'rojo' }
      }) },

    { nombre: 'Posición', dur: 5, vo: 'Sujétate con los brazos estirados y el cuerpo suspendido, inclinando un poco el torso hacia adelante.',
      C: E3.escena({
        tomas: [[0, { az: 24, el: 6, dist: 7.0, y: 1.5 }], [0.5, { az: 40, el: 6, dist: 6.6, y: 1.5 }], [0.56, { az: 84, el: 6, dist: 5.6, y: 1.55 }], [1, { az: 92, el: 6, dist: 5.8, y: 1.55 }]],
        vista: function (T, f) {
          var inc = animate({ from: 1, to: 0.62, start: f(0.56), end: f(0.8), ease: Easing.easeInOutSine })(T);
          return cuadro(inc, 0, 0, { cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var br = clamp((T - f(0.12)) / (f(0.3) - f(0.12)), 0, 1);
          var tor = clamp((T - f(0.62)) / (f(0.8) - f(0.62)), 0, 1);
          return (
            <g>
              {t < 0.53 ? <g><B.Anillo c={pr('manoI')} r={70} color={C.YEL} p={br} /><B.Anillo c={pr('manoD')} r={70} color={C.YEL} p={br} /></g> : null}
              {t > 0.55 ? <E3.Flecha a={pr([0, 1.95, -0.1])} b={pr([0, 1.85, 0.32])} p={tor} /> : null}
            </g>
          );
        },
        bien: [{ x: 860, y: 560, cuando: 0.32 }, { x: 860, y: 520, cuando: 0.8 }],
        r1: { text: 'BRAZOS *ESTIRADOS*', cuando: 0.1 },
        r2: { text: 'TORSO *ADELANTE*', s: 1.05, cuando: 0.6 }
      }) },

    { nombre: 'Bajada', dur: 5, vo: 'Baja flexionando los codos hasta unos 90 grados, empujando para volver hacia arriba.',
      C: E3.escena({
        tomas: [[0, { az: 70, el: 6, dist: 7.0, y: 1.5 }], [1, { az: 50, el: 6, dist: 6.6, y: 1.5 }]],
        vista: function (T, f) {
          // empieza arriba: baja lento y empuja
          var kEn = function (dt) { return 1 - reps(T - dt, f(0.04), f(0.96), 2, 0.55); };
          var k = kEn(0);
          return cuadro(k, 0, 0, { musc: { pecho: true, triceps: 'gris', brillo: 0.35 * (1 - k) }, cara: { boca: k < 0.5 ? 'dientes' : 'sonrisa' } }, kEn);
        },
        lienzo: function (T, f, t, pr, info) {
          var abajo = info.figuras && info.figuras[0] && info.figuras[0].pose.cadera[1] < 0.95;
          return <g>{abajo ? <B.Arco c={pr('codoD')} r={56} a0={0} a1={90} color={C.YEL} p={1} /> : null}<V.Chispa T={T} c={pr('m:pecho:0')} cuando={f(0.3)} r={90} /><V.Chispa T={T} c={pr('m:pecho:1')} cuando={f(0.76)} r={90} /></g>;
        },
        encima: function (T, f) { return E3.contador(T, f(0.04), f(0.96), 2, 40, 1150); }, zona: [200, 378, 1036, 1452],
        bien: [{ x: 860, y: 560, cuando: 0.5 }],
        r1: { text: 'CODOS A *90°*', cuando: 0.08 },
        r2: { text: 'EMPUJA *ARRIBA*', cuando: 0.52 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'El músculo principal involucrado es el pectoral mayor, con ayuda de los deltoides anterior y el tríceps.',
      C: E3.escena({
        tomas: [[0, { az: 30, el: 8, dist: 4.0, y: 1.75 }], [0.6, { az: 42, el: 8, dist: 3.9, y: 1.75 }], [1, { az: 60, el: 6, dist: 6.0, y: 1.55 }]],
        vista: function (T, f) {
          var m = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = T > f(0.56);
          return cuadro(0.4, 0, 0, { musc: { pecho: m > 0.3 ? true : null, deltoides: sec ? 'gris' : null, triceps: sec ? 'gris' : null, brillo: 0.35 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
          return <g>{E3.brilla(T, pr, PECHO, m, true, 90)}</g>;
        },
        r1: { text: 'PECTORAL *MAYOR*', s: 1.1, cuando: 0.04 },
        r2: { text: '+ HOMBRO Y *TRÍCEPS*', cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'No te eches demasiado hacia atrás durante el movimiento. Trata de mantenerte neutro durante el recorrido.',
      C: E3.escena({
        tomas: [[0, { az: 88, el: 6, dist: 6.4, y: 1.5 }], [1, { az: 80, el: 6, dist: 6.6, y: 1.5 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var k = 1 - reps(T, f(0), f(1), 2, 0.5);
          var mal = bien < 0.5;
          return cuadro(k, 1 - bien, 0, {
            musc: mal ? { deltoides: 'rojo' } : { pecho: true },
            cara: mal ? { boca: 'dientes', cejas: 'enojo' } : { boca: 'sonrisa' }
          });
        },
        lienzo: function (T, f, t, pr) {
          var mal = t < 0.5;
          return mal ? <B.Anillo c={pr('hombroD')} r={70} color={C.RED} p={1} />
            : <E3.Guia a={pr('cuello')} b={pr('cadera')} color={C.GRN} p={1} />;
        },
        mal: [{ x: 820, y: 470, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 820, y: 470, cuando: 0.6 }],
        r1: { text: 'HACIA *ATRÁS*', cuando: 0.04, tono: 'rojo' },
        r2: { text: 'TORSO *NEUTRO*', s: 1.1, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Trata de no balancearte ni bajar rápido. Siempre mantén el control en cada repetición.',
      C: E3.escena({
        tomas: [[0, { az: 64, el: 6, dist: 6.8, y: 1.5 }], [1, { az: 74, el: 6, dist: 6.8, y: 1.5 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var mal = bien < 0.5;
          var kEn = function (dt) { var Tx = T - dt; return mal ? 1 - V.ida(V.fase(Tx, f(0), f(0.46), 3), 0.25, 0) : 1 - reps(Tx, f(0.5), f(1), 2, 0.55); };
          var k = kEn(0);
          return cuadro(k, 0, mal ? Math.sin(T * 9) : 0, { musc: mal ? { pecho: 'rojo' } : { pecho: true }, cara: { boca: mal ? 'dientes' : 'sonrisa', cejas: mal ? 'enojo' : null } }, kEn);
        },
        lienzo: function (T, f, t, pr) {
          return t < 0.5 ? <V.Lineas T={T} c={pr('cadera')} dir={[0, 1]} v={1} /> : null;
        },
        mal: [{ x: 820, y: 640, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 820, y: 640, cuando: 0.62 }],
        r1: { text: 'RÁPIDO Y *BALANCEO*', cuando: 0.04, tono: 'rojo' },
        r2: { text: '*CONTROL* SIEMPRE', s: 1.1, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hacen los fondos en paralelas.',
      C: E3.escena({
        tomas: [[0, { az: 20, el: 6, dist: 6.8, y: 1.5 }], [1, { az: 70, el: 8, dist: 7.0, y: 1.5 }]],
        vista: function (T, f) {
          var k = animate({ from: 0.2, to: 1, start: f(0.04), end: f(0.4), ease: Easing.easeInOutSine })(T);
          return cuadro(k, 0, 0, { musc: { pecho: true, brillo: 0.3 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) { return <V.Chispa T={T} c={pr('m:pecho:0')} cuando={f(0.4)} r={110} />; },
        bien: [{ x: 860, y: 560, cuando: 0.42, s: 0.85 }],
        r1: { text: 'FONDOS EN *PARALELAS*', s: 1.05, cuando: 0.06 },
        r2: { text: 'PECHO *ADELANTE*', cuando: 0.46, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'fondos-3d', escenario: 'parque', titulo: 'Fondos en paralelas (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LO HACÍAS BIEN?', vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de entreno y guárdalo.' }
  });
})(window);
