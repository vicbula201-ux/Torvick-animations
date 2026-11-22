/* ============================================================
   ABDUCCION DE CADERA EN MAQUINA — TOR EN 3D (mismo guion que abduccion.jsx)
   Sentado con la espalda bien apoyada en el respaldo y las almohadillas por
   fuera de los muslos; separar las piernas empujando hacia afuera y volver
   lento. Gluteo medio (principal); piriforme y tensor de la fascia lata.
   Errores: hacerlo rapido y sin control, e inclinar el torso adelante.
   La accion y el cierre dicen lo que graba Victor: "¿Quieres ver mas
   videos similares?" y "Sigueme para mas contenido".
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, V = global.V, B = global.B, E3 = global.E3, TOR3D = global.TOR3D;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;

  /* ---------------- sentado en la maquina ---------------- */
  var ALTO = 0.5, CAD = [0, 0.62, -0.06];
  // a 0 piernas juntas .. 1 abiertas; inclina = grados del torso hacia adelante (el error)
  function pose(a, inclina) {
    var e = Easing.easeInOutSine(clamp(a, 0, 1)), inc = inclina || 0;
    var p = { cadera: CAD, tronco: [-12 + inc, 0, 0], cabeza: [4 - 0.3 * inc, 0, 0], pies: [8, 8] };
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D';
      var kx = s * (0.135 + 0.26 * e);
      var kz = CAD[2] + Math.sqrt(Math.max(0.01, 0.43 * 0.43 - (kx - s * 0.135) * (kx - s * 0.135))) - 0.02;
      p['pie' + L] = [kx * 0.92, 0.16, kz + 0.07];
      p['rodilla' + L] = [0.9 * e + 0.05, 0.7, 1];
      p['mano' + L] = [s * 0.34, ALTO + 0.14 + 0.002 * inc, -0.02 + 0.011 * inc];
      p['codo' + L] = [1, -0.6, -0.6];
    });
    return p;
  }
  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.12); }
  function cuadro(a, inclina, extra) {
    var p = pose(a, inclina), J = TOR3D.esqueleto(p);
    var arr = function (q) { return [q.x, q.y, q.z]; };
    return {
      figuras: [Object.assign({ quien: 'tor', pose: p }, extra || {})],
      objetos: [{ tipo: 'abductora', p: [0, 0, 0], alto: ALTO, respaldo: 12, rodillas: [arr(J.rodillaI), arr(J.rodillaD)], pies: [arr(J.tobilloI), arr(J.tobilloD)] }]
    };
  }
  // el gluteo medio y el tensor: a los costados de la cadera
  function costados(pr) { return [pr([-0.27, 0.72, -0.1]), pr([0.27, 0.72, -0.1])]; }
  function velocidad(pr, a, ant) {
    var kI = pr('rodillaI'), kD = pr('rodillaD'), abre = a > ant, v = Math.min(1, Math.abs(a - ant) * 6);
    return (
      <g>
        <V.Lineas c={[kI[0] - 130, kI[1]]} dir={[abre ? -1 : 1, 0]} v={v} largo={110} />
        <V.Lineas c={[kD[0] + 130, kD[1]]} dir={[abre ? 1 : -1, 0]} v={v} largo={110} />
      </g>
    );
  }
  function haciaAfuera(pr, color, p) {
    var kI = pr('rodillaI'), kD = pr('rodillaD');
    return (
      <g>
        <E3.Flecha a={[kI[0] - 60, kI[1] - 70]} b={[kI[0] - 190, kI[1] - 70]} color={color} p={p} />
        <E3.Flecha a={[kD[0] + 60, kD[1] - 70]} b={[kD[0] + 190, kD[1] - 70]} color={color} p={p} />
      </g>
    );
  }
  var FRENTE = { az: 8, el: 10, dist: 5.2, y: 0.78 };
  var COSTADO = { az: 70, el: 8, dist: 5.4, y: 0.82, dz: -0.1 };

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tu abducción de cadera.',
      C: E3.escena({
        tomas: [[0, { az: 18, el: 12, dist: 4.0, y: 0.72 }], [1, FRENTE]],
        vista: function (T, f) {
          var a = Math.abs(Math.sin(T * 7));
          var r = cuadro(a, 8, { musc: { gluteos: 'rojo' }, cara: { boca: 'dientes', cejas: 'enojo' } });
          r.vibra = true; r.a = a; r.ant = Math.abs(Math.sin((T - 0.05) * 7)); return r;
        },
        lienzo: function (T, f, t, pr, info) { return <g>{velocidad(pr, info.a, info.ant)}<V.Gotas T={T} c={pr('cabeza')} v={1} /></g>; },
        mal: [{ x: 830, y: 430, cuando: 0.2, s: 0.6 }, { x: 110, y: 1250, cuando: 0.44, s: 0.5 }],
        r1: { text: 'ABDUCCIÓN DE *CADERA*', s: 1.05, cuando: 0.02, tono: 'rojo' }
      }) },

    { nombre: 'Posición', dur: 5, vo: 'Siéntate con la espalda bien apoyada y las almohadillas por fuera de los muslos.',
      C: E3.escena({
        tomas: [[0, COSTADO], [0.16, { az: 84, el: 6, dist: 4.4, y: 0.95, dz: -0.15 }], [0.48, { az: 80, el: 6, dist: 4.4, y: 0.95, dz: -0.15 }],
          [0.58, { az: 26, el: 26, dist: 3.8, y: 0.62, dz: 0.2 }], [0.88, { az: 16, el: 28, dist: 3.8, y: 0.62, dz: 0.2 }], [1, FRENTE]],
        vista: function () { return cuadro(0, 0, { cara: { boca: 'sonrisa' } }); },
        lienzo: function (T, f, t, pr) {
          var esp = clamp((T - f(0.14)) / (f(0.4) - f(0.14)), 0, 1);
          var pad = clamp((T - f(0.6)) / (f(0.72) - f(0.6)), 0, 1);
          var a = pr([0, 0.66, -0.3]), b = pr([0, 1.4, -0.46]);
          return (
            <g>
              {t < 0.52 ? <E3.Guia a={a} b={b} p={esp} color={C.GRN} /> : null}
              {t > 0.54 ? <g><B.Anillo c={pr([-0.33, 0.6, 0.3])} r={80} color={C.YEL} p={pad} /><B.Anillo c={pr([0.33, 0.6, 0.3])} r={80} color={C.YEL} p={pad} /></g> : null}
            </g>
          );
        },
        bien: [{ x: 860, y: 560, cuando: 0.34 }, { x: 860, y: 560, cuando: 0.76 }],
        r1: { text: 'ESPALDA *APOYADA*', cuando: 0.12 },
        r2: { text: 'ALMOHADILLAS *AFUERA*', cuando: 0.6 }
      }) },

    { nombre: 'Ejecución', dur: 5.5, vo: 'Separa las piernas empujando hacia afuera y luego vuelve lento a la posición inicial.',
      C: E3.escena({
        tomas: [[0, FRENTE], [0.3, { az: 2, el: 22, dist: 4.4, y: 0.7, dz: 0.1 }], [0.8, { az: -6, el: 22, dist: 4.4, y: 0.7, dz: 0.1 }], [1, FRENTE]],
        golpes: [],
        vista: function (T, f) {
          var a = reps(T, f(0.04), f(0.94), 2), ant = reps(T - 0.08, f(0.04), f(0.94), 2);
          var r = cuadro(a, 0, { musc: { gluteos: true, brillo: 0.35 * a }, cara: { boca: 'sonrisa' } });
          r.a = a; r.ant = ant; return r;
        },
        lienzo: function (T, f, t, pr, info) {
          var abre = info.a > info.ant;
          var k = costados(pr);
          return (
            <g>
              {haciaAfuera(pr, C.GRN, abre ? clamp(3 * (info.a - 0.1), 0, 1) : 0)}
              <V.Chispa T={T} c={k[0]} cuando={f(0.25)} r={60} /><V.Chispa T={T} c={k[1]} cuando={f(0.25)} r={60} />
              <V.Chispa T={T} c={k[0]} cuando={f(0.7)} r={60} /><V.Chispa T={T} c={k[1]} cuando={f(0.7)} r={60} />
            </g>
          );
        },
        encima: function (T, f) { return E3.contador(T, f(0.04), f(0.94), 2, 40, 1150); }, zona: [200, 378, 1036, 1452],
        bien: [{ x: 860, y: 560, cuando: 0.6 }],
        r1: { text: 'EMPUJA HACIA *AFUERA*', cuando: 0.06 },
        r2: { text: 'VUELVE *LENTO*', s: 1.1, cuando: 0.5 }
      }) },

    { nombre: 'Músculos', dur: 5, vo: 'Trabaja el glúteo medio, con ayuda del piriforme y el tensor de la fascia lata.',
      C: E3.escena({
        tomas: [[0, { az: 128, el: 14, dist: 3.6, y: 0.86, dz: -0.1 }], [0.6, { az: 140, el: 14, dist: 3.6, y: 0.86, dz: -0.1 }], [1, { az: 100, el: 12, dist: 4.6, y: 0.86, dz: -0.1 }]],
        vista: function (T, f) {
          var gm = T > f(0.04), sec = T > f(0.56);
          return cuadro(0.7, 0, { musc: { gluteos: gm ? true : null, cuadriceps: sec ? 'gris' : null, brillo: 0.35 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
          var k = costados(pr);
          return <g><V.Halo T={T} c={k[1]} r={95} v={m} /><V.Destellos T={T} c={k[1]} r={120} v={m} /></g>;
        },
        r1: { text: 'GLÚTEO *MEDIO*', s: 1.2, cuando: 0.04 },
        r2: { text: '+ PIRIFORME Y *TENSOR*', cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: hacerlo rápido y sin control. Las almohadillas vuelven lento.',
      C: E3.escena({
        tomas: [[0, { az: 10, el: 14, dist: 5.0, y: 0.76 }], [1, { az: -4, el: 14, dist: 5.2, y: 0.76 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var mal = bien < 0.5;
          var rap = function (t0) { return Math.abs(Math.sin((t0 - f(0)) * 7)); };
          var a = mal ? rap(T) : reps(T, f(0.5), f(1), 1, 0.4), ant = mal ? rap(T - 0.05) : reps(T - 0.08, f(0.5), f(1), 1, 0.4);
          var r = cuadro(a, 0, { musc: mal ? { gluteos: 'rojo' } : { gluteos: true, brillo: 0.3 }, cara: mal ? { boca: 'dientes', cejas: 'enojo' } : { boca: 'sonrisa' } });
          r.vibra = mal; r.a = a; r.ant = ant; r.mal = mal; return r;
        },
        lienzo: function (T, f, t, pr, info) { return info.mal ? velocidad(pr, info.a, info.ant) : haciaAfuera(pr, C.GRN, 1); },
        mal: [{ x: 830, y: 450, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 830, y: 450, cuando: 0.62 }],
        r1: { text: 'RÁPIDO Y SIN *CONTROL*', cuando: 0.04, tono: 'rojo' },
        r2: { text: 'LENTO Y *CONTROLADO*', cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: inclinar el torso hacia adelante. Espalda y cadera pegadas al respaldo.',
      C: E3.escena({
        tomas: [[0, { az: 78, el: 8, dist: 5.2, y: 0.86, dz: -0.1 }], [1, { az: 66, el: 8, dist: 5.4, y: 0.86, dz: -0.1 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var mal = bien < 0.5;
          var inc = (1 - bien) * (30 + 4 * Math.sin(T * 5));
          var a = reps(T, f(0), f(1), 2, 0.45);
          return cuadro(a, inc, { musc: mal ? { lumbar: 'rojo' } : { gluteos: true, brillo: 0.3 }, cara: mal ? { boca: 'dientes', cejas: 'enojo' } : { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          return t < 0.5 ? null : <E3.Guia a={pr([0, 0.66, -0.3])} b={pr([0, 1.4, -0.46])} p={1} color={C.GRN} />;
        },
        mal: [{ x: 830, y: 450, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 830, y: 450, cuando: 0.62 }],
        r1: { text: 'TORSO HACIA *ADELANTE*', cuando: 0.04, tono: 'rojo' },
        r2: { text: 'ESPALDA EN EL *RESPALDO*', s: 0.95, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace. Lento y con la espalda apoyada.',
      C: E3.escena({
        tomas: [[0, { az: 40, el: 12, dist: 5.0, y: 0.8 }], [1, { az: -10, el: 10, dist: 5.4, y: 0.78 }]],
        golpes: [0.4],
        vista: function (T, f) {
          var a = animate({ from: 0, to: 1, start: f(0.06), end: f(0.4), ease: Easing.easeInOutSine })(T);
          return cuadro(a, 0, { musc: { gluteos: true, brillo: 0.3 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var k = costados(pr);
          return <g><V.Chispa T={T} c={k[0]} cuando={f(0.4)} r={70} /><V.Chispa T={T} c={k[1]} cuando={f(0.4)} r={70} /></g>;
        },
        bien: [{ x: 850, y: 560, cuando: 0.42, s: 0.85 }],
        r1: { text: 'ABDUCCIÓN DE CADERA', s: 1.0, cuando: 0.06 },
        r2: { text: 'LENTO Y *APOYADO*', cuando: 0.46, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'abduccion-3d', titulo: 'Abducción de cadera (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 3.2, pregunta: '¿QUIERES VER MÁS?', vo: '¿Quieres ver más videos similares?' },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
