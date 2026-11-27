/* ============================================================
   EXTENSION DE TRICEPS EN POLEA ALTA — TOR EN 3D (el guion como lo grabo Victor)
   De pie frente a la polea alta, la barra recta en las manos y los codos pegados
   al cuerpo; extender moviendo solo los antebrazos. Triceps (principal), con
   ayuda del anconeo, y el abdomen estabiliza. Errores: los codos que se van
   lejos del cuerpo y subir de golpe.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, V = global.V, B = global.B, E3 = global.E3;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;

  var TRI = ['m:triceps:0', 'm:triceps:1'];
  /* k 0 antebrazos arriba (codos en 90) .. 1 brazos estirados; afuera 0..1 los codos se van lejos del cuerpo */
  function pose(k, afuera) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)), a = afuera || 0;
    var p = { cadera: [0, 0.99, 0], tronco: [10 + 8 * a, 0, 0], cabeza: [-6, 0, 0], pieI: [-0.18, 0.115, 0.03], pieD: [0.18, 0.115, 0.03] };
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D';
      var arriba = E3.lerp3([s * 0.16, 1.42, 0.48], [s * 0.3, 1.62, 0.6], a);
      var abajo = E3.lerp3([s * 0.18, 0.8, 0.31], [s * 0.26, 0.86, 0.5], a);
      p['mano' + L] = E3.lerp3(arriba, abajo, e);
      p['codo' + L] = E3.lerp3([0.2, 0, -1], [0.9, 0.2, 0.4], a);
    });
    return p;
  }
  function mitad(p) { return [(p.manoI[0] + p.manoD[0]) / 2, (p.manoI[1] + p.manoD[1]) / 2, (p.manoI[2] + p.manoD[2]) / 2]; }
  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.14); }
  // la figura con la polea; fantasmas = la pose de unos instantes antes
  function cuadro(k, afuera, extra, kEn) {
    var fan = [];
    if (kEn) [0.04, 0.08, 0.12].forEach(function (dt) { var k2 = kEn(dt); if (Math.abs(k2 - k) > 0.04) fan.push(pose(k2, afuera)); });
    var p = pose(k, afuera);
    return { figuras: [Object.assign({ quien: 'tor', pose: p, fantasmas: fan }, extra || {})],
      objetos: [{ tipo: 'polea', p: [0, 0, 0.8], giro: 180, alto: 2.2, fin: mitad(p), agarre: 'barra', eje: [1, 0, 0] }] };
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: 'Estás haciendo mal tu extensión de tríceps en polea alta.',
      C: E3.escena({
        tomas: [[0, { az: 52, el: 8, dist: 4.8, y: 1.3 }], [1, { az: 40, el: 6, dist: 6.0, y: 1.2 }]],
        vista: function (T, f) {
          var k = reps(T, f(0), f(1), 3, 0.3);
          var r = cuadro(k, 0.9, { musc: { triceps: 'rojo', deltoides: 'rojo' }, cara: { boca: 'dientes', cejas: 'enojo' } });
          r.vibra = true; return r;
        },
        lienzo: function (T, f, t, pr) { return <V.Gotas T={T} c={pr('cabeza')} v={1} />; },
        mal: [{ x: 80, y: 430, cuando: 0.2, s: 0.6 }, { x: 850, y: 1150, cuando: 0.44, s: 0.5 }],
        r1: { text: 'EXTENSIÓN DE *TRÍCEPS*', s: 1.05, cuando: 0.02, tono: 'rojo' }
      }) },

    { nombre: 'Posición', dur: 5, vo: 'Ponte de pie frente a la polea alta, la barra recta en las manos y los codos pegados al cuerpo.',
      C: E3.escena({
        tomas: [[0, { az: 20, el: 6, dist: 6.6, y: 1.25 }], [0.5, { az: 34, el: 6, dist: 6.2, y: 1.25 }], [0.56, { az: 72, el: 6, dist: 4.6, y: 1.25 }], [1, { az: 80, el: 6, dist: 4.8, y: 1.25 }]],
        vista: function () { return cuadro(0, 0, { cara: { boca: 'sonrisa' } }); },
        lienzo: function (T, f, t, pr) {
          var bar = clamp((T - f(0.14)) / (f(0.3) - f(0.14)), 0, 1);
          var cod = clamp((T - f(0.62)) / (f(0.74) - f(0.62)), 0, 1);
          return (
            <g>
              {t < 0.53 ? <B.Anillo c={E3.medio(pr('manoI'), pr('manoD'))} r={110} color={C.YEL} p={bar} /> : null}
              {t > 0.55 ? <g><B.Anillo c={pr('codoI')} r={70} color={C.GRN} p={cod} /><B.Anillo c={pr('codoD')} r={70} color={C.GRN} p={cod} /></g> : null}
            </g>
          );
        },
        bien: [{ x: 860, y: 560, cuando: 0.32 }, { x: 860, y: 520, cuando: 0.78 }],
        r1: { text: 'BARRA *RECTA*', cuando: 0.1 },
        r2: { text: 'CODOS *PEGADOS*', s: 1.05, cuando: 0.6 }
      }) },

    { nombre: 'Ejecución', dur: 5, vo: 'Extiende los brazos hacia abajo moviendo solo los antebrazos. Los codos no se mueven.',
      C: E3.escena({
        tomas: [[0, { az: 70, el: 6, dist: 6.2, y: 1.2 }], [1, { az: 46, el: 8, dist: 5.8, y: 1.2 }]],
        vista: function (T, f) {
          var kEn = function (dt) { return reps(T - dt, f(0.04), f(0.96), 2); };
          var k = kEn(0);
          return cuadro(k, 0, { musc: { triceps: true, brillo: 0.35 * k }, cara: { boca: k > 0.5 ? 'dientes' : 'sonrisa' } }, kEn);
        },
        lienzo: function (T, f, t, pr) {
          var c = E3.medio(pr('manoI'), pr('manoD'));
          return (
            <g>
              <B.Puntos pts={[pr('codoI'), pr('codoD')]} color={C.GRN} sw={14} p={1} />
              <V.Chispa T={T} c={c} cuando={f(0.22)} r={100} /><V.Chispa T={T} c={c} cuando={f(0.68)} r={100} />
            </g>
          );
        },
        encima: function (T, f) { return E3.contador(T, f(0.04), f(0.96), 2, 40, 1150); }, zona: [200, 378, 1036, 1452],
        bien: [{ x: 860, y: 560, cuando: 0.5 }],
        r1: { text: 'SOLO LOS *ANTEBRAZOS*', cuando: 0.08 },
        r2: { text: 'CODOS *QUIETOS*', cuando: 0.52 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'El músculo principal involucrado es el tríceps, con ayuda del ancóneo y el abdomen.',
      C: E3.escena({
        tomas: [[0, { az: 150, el: 10, dist: 3.6, y: 1.35 }], [0.6, { az: 135, el: 10, dist: 3.5, y: 1.35 }], [1, { az: 110, el: 7, dist: 5.2, y: 1.2 }]],
        vista: function (T, f) {
          var m = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = T > f(0.56);
          return cuadro(0.85, 0, { musc: { triceps: m > 0.3 ? true : null, abdomen: sec ? 'gris' : null, brillo: 0.35 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
          return <g>{E3.brilla(T, pr, TRI, m, true, 80)}</g>;
        },
        r1: { text: 'TRÍCEPS', s: 1.2, cuando: 0.04 },
        r2: { text: '+ ANCÓNEO Y *ABDOMEN*', cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'No muevas los codos lejos de tu cuerpo. Siempre manténlos pegados.',
      C: E3.escena({
        tomas: [[0, { az: 76, el: 6, dist: 5.0, y: 1.25 }], [1, { az: 66, el: 6, dist: 5.2, y: 1.25 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var k = reps(T, f(0), f(1), 2, 0.4);
          var mal = bien < 0.5;
          return cuadro(k, (1 - bien) * (0.4 + 0.6 * (1 - k)), {
            musc: mal ? { triceps: 'rojo', deltoides: 'rojo' } : { triceps: true },
            cara: mal ? { boca: 'dientes', cejas: 'enojo' } : { boca: 'sonrisa' }
          });
        },
        lienzo: function (T, f, t, pr) {
          var mal = t < 0.5;
          var a = pr('codoI'), b = pr('codoD');
          return mal
            ? <g><B.Anillo c={a} r={64} color={C.RED} p={1} /><B.Anillo c={b} r={64} color={C.RED} p={1} /></g>
            : <B.Puntos pts={[a, b]} color={C.GRN} sw={14} p={1} />;
        },
        mal: [{ x: 820, y: 470, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 820, y: 470, cuando: 0.6 }],
        r1: { text: 'CODOS *AFUERA*', cuando: 0.04, tono: 'rojo' },
        r2: { text: 'CODOS *PEGADOS*', s: 1.1, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'No subas de golpe. Siempre vuelve lento y con control.',
      C: E3.escena({
        tomas: [[0, { az: 40, el: 6, dist: 5.8, y: 1.22 }], [1, { az: 56, el: 7, dist: 5.6, y: 1.22 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var mal = bien < 0.5;
          // mal: baja y SUBE de golpe (vuelta rapida); bien: va rapido y vuelve lento
          var kEn = function (dt) { var Tx = T - dt; return mal ? V.ida(V.fase(Tx, f(0), f(0.46), 3), 0.5, 0.0) : reps(Tx, f(0.5), f(1), 2, 0.3); };
          var k = kEn(0);
          return cuadro(k, 0, { musc: mal ? { triceps: 'rojo' } : { triceps: true }, cara: { boca: mal ? 'dientes' : 'sonrisa', cejas: mal ? 'enojo' : null } }, kEn);
        },
        lienzo: function (T, f, t, pr) {
          return t < 0.5 ? <V.Lineas T={T} c={E3.medio(pr('manoI'), pr('manoD'))} dir={[0, -1]} v={1} /> : null;
        },
        mal: [{ x: 820, y: 640, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 820, y: 640, cuando: 0.62 }],
        r1: { text: 'SUBIR DE *GOLPE*', cuando: 0.04, tono: 'rojo' },
        r2: { text: 'VUELVE *LENTO*', s: 1.1, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace la extensión de tríceps en polea alta.',
      C: E3.escena({
        tomas: [[0, { az: 30, el: 6, dist: 6.0, y: 1.2 }], [1, { az: 80, el: 8, dist: 6.2, y: 1.2 }]],
        vista: function (T, f) {
          var k = animate({ from: 0, to: 1, start: f(0.04), end: f(0.4), ease: Easing.easeInOutSine })(T);
          return cuadro(k, 0, { musc: { triceps: true, brillo: 0.3 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) { return <V.Chispa T={T} c={E3.medio(pr('manoI'), pr('manoD'))} cuando={f(0.4)} r={110} />; },
        bien: [{ x: 860, y: 560, cuando: 0.42, s: 0.85 }],
        r1: { text: 'EXTENSIÓN EN *POLEA*', s: 1.05, cuando: 0.06 },
        r2: { text: 'CODOS *QUIETOS*', cuando: 0.46, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'triceps-polea-3d', escenario: 'gym', titulo: 'Extensión de tríceps en polea (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LO HACÍAS BIEN?', vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de entreno y guárdalo.' }
  });
})(window);
