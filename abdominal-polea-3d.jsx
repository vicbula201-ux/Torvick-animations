/* ============================================================
   ABDOMINAL EN POLEA (de pie) — TOR EN 3D (mismo guion que abdominal-polea.jsx)
   De espaldas a la polea alta, la cuerda a los lados de la cabeza; flexionar
   el tronco llevando los codos hacia las rodillas y volver controlado.
   Recto abdominal (principal); ayudan oblicuos y flexores de la cadera.
   Errores: mover la cadera (tirar con el cuerpo) y rebotar sin apretar.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, V = global.V, B = global.B, E3 = global.E3, TOR3D = global.TOR3D;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;

  /* ---------------- la pose ---------------- */
  // k 0 erguido (inclinado apenas) .. 1 codos a las rodillas; cad 0..1 la cadera se va atras (el error)
  function base(k, cad) {
    cad = cad || 0;
    return {
      cadera: [0, 0.97 - 0.05 * cad - 0.02 * k, -0.2 * cad],
      tronco: [14 + 44 * k + 10 * cad, 0, 0], cabeza: [-8 - 26 * k, 0, 0],
      pieI: [-0.17, 0.115, 0.06], pieD: [0.17, 0.115, 0.06],
      hombros: { junta: -0.5 * k },
      codoI: [0.2, -0.6, 1], codoD: [0.2, -0.6, 1]
    };
  }
  function pose(k, cad) {
    var p = base(k, cad), J = TOR3D.esqueleto(p);
    [-1, 1].forEach(function (s) {
      var m = J.cabeza.clone().add(J.hX.clone().multiplyScalar(s * 0.17)).sub(J.hd.clone().multiplyScalar(0.04)).add(J.hf.clone().multiplyScalar(0.02));
      p[s < 0 ? 'manoI' : 'manoD'] = [m.x, m.y, m.z];
    });
    return p;
  }
  function polea(k, cad) {
    var J = TOR3D.esqueleto(pose(k, cad));
    var fin = J.manoI.clone().add(J.manoD).multiplyScalar(0.5).add(J.hd.clone().multiplyScalar(0.16)).sub(J.hf.clone().multiplyScalar(0.12));
    var a = J.manoI.clone().sub(J.hf.clone().multiplyScalar(0.04)), b = J.manoD.clone().sub(J.hf.clone().multiplyScalar(0.04));
    return { tipo: 'polea', p: [0, 0, -0.8], alto: 2.25, fin: [fin.x, fin.y, fin.z], manos: [[a.x, a.y, a.z], [b.x, b.y, b.z]] };
  }
  global.PIEZAS3D = global.PIEZAS3D || {};
  global.PIEZAS3D.abdominalPolea = { pose: pose, polea: polea };
  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.14); }
  function cuadro(k, cad, extra) {
    return { figuras: [Object.assign({ quien: 'tor', pose: pose(k, cad) }, extra || {})], objetos: [polea(k, cad)] };
  }
  function espalda(pr, color) { return <B.Puntos pts={[pr('cadera'), pr('cuello')]} color={color} sw={14} p={1} />; }
  var GEN = { az: 62, el: 6, dist: 7.0, y: 1.12, dz: -0.2 };

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tu abdominal en polea.',
      C: E3.escena({
        tomas: [[0, { az: 40, el: 8, dist: 5.2, y: 1.1, dz: 0 }], [1, { az: 58, el: 6, dist: 6.6, y: 1.1, dz: -0.15 }]],
        vista: function (T, f) {
          var k = reps(T, f(0), f(1), 2, 0.35);
          var r = cuadro(k, 1, { musc: { abdomen: 'rojo', gluteos: 'rojo' }, cara: { boca: 'dientes', cejas: 'enojo' } });
          r.vibra = true; return r;
        },
        lienzo: function (T, f, t, pr) { return <g>{espalda(pr, C.RED)}<V.Gotas T={T} c={pr('cabeza')} v={1} /></g>; },
        mal: [{ x: 830, y: 480, cuando: 0.2, s: 0.6 }, { x: 120, y: 520, cuando: 0.44, s: 0.5 }],
        r1: { text: 'ABDOMINAL EN *POLEA*', s: 1.05, cuando: 0.02, tono: 'rojo' }
      }) },

    { nombre: 'Posición', dur: 5, vo: 'De espaldas a la polea alta, toma la cuerda a los lados de la cabeza e inclínate un poco desde la cadera.',
      C: E3.escena({
        tomas: [[0, { az: 132, el: 10, dist: 7.0, y: 1.3, dz: -0.3 }], [0.48, { az: 116, el: 10, dist: 6.4, y: 1.35, dz: -0.3 }],
          [0.52, { az: 70, el: 6, dist: 5.6, y: 1.05, dz: 0 }], [1, { az: 80, el: 6, dist: 6.0, y: 1.05, dz: 0 }]],
        vista: function () { return cuadro(0, 0, { cara: { boca: 'sonrisa' } }); },
        lienzo: function (T, f, t, pr) {
          var cuerda = clamp((T - f(0.14)) / (f(0.26) - f(0.14)), 0, 1);
          var cad = clamp((T - f(0.58)) / (f(0.7) - f(0.58)), 0, 1);
          return t < 0.5
            ? <g><B.Anillo c={pr('manoI')} r={70} color={C.YEL} p={cuerda} /><B.Anillo c={pr('manoD')} r={70} color={C.YEL} p={cuerda} /></g>
            : <B.Anillo c={pr('cadera')} r={90} color={C.YEL} p={cad} />;
        },
        bien: [{ x: 830, y: 480, cuando: 0.32, s: 0.8 }, { x: 830, y: 480, cuando: 0.76, s: 0.8 }],
        r1: { text: 'ESPALDA A LA *POLEA*', s: 1.05, cuando: 0.1 },
        r2: { text: 'MANOS A LA *CABEZA*', s: 1.05, cuando: 0.56 }
      }) },

    { nombre: 'Ejecución', dur: 6, vo: 'Flexiona el tronco y lleva los codos hacia las rodillas. Vuelve lento, sin soltar la tensión.',
      C: E3.escena({
        tomas: [[0, GEN], [0.46, { az: 76, el: 6, dist: 6.6, y: 1.1, dz: -0.15 }], [0.461, { az: 28, el: 4, dist: 5.0, y: 1.0, dz: 0.1 }], [1, { az: 20, el: 4, dist: 5.2, y: 1.0, dz: 0.1 }]],
        vista: function (T, f) {
          var k = reps(T, f(0.04), f(0.96), 2);
          return cuadro(k, 0, { musc: { abdomen: true, brillo: 0.4 * k }, cara: { boca: k > 0.6 ? 'dientes' : 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var camino = [0, 0.25, 0.5, 0.75, 1].map(function (q) { var J = TOR3D.esqueleto(pose(q, 0)); return pr(J.codoD); });
          var p = pr('m:abdomen');
          return (
            <g>
              <B.Puntos pts={camino} color={C.YEL} sw={12} p={1} />
              <V.Chispa T={T} c={p} cuando={f(0.2)} r={100} />
              <V.Chispa T={T} c={p} cuando={f(0.66)} r={100} />
            </g>
          );
        },
        encima: function (T, f) { return E3.contador(T, f(0.04), f(0.96), 2, 40, 1150); },
        bien: [{ x: 830, y: 480, cuando: 0.5, s: 0.8 }],
        r1: { text: 'CODOS A LAS *RODILLAS*', s: 1.0, cuando: 0.08 },
        r2: { text: 'VUELVE *LENTO*', s: 1.1, cuando: 0.52 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'Trabaja el recto abdominal. Ayudan los oblicuos y los flexores de la cadera.',
      C: E3.escena({
        tomas: [[0, { az: 24, el: -2, dist: 4.8, y: 1.1, dz: 0.15 }], [0.6, { az: 36, el: -2, dist: 4.8, y: 1.1, dz: 0.15 }], [1, { az: 58, el: 4, dist: 6.2, y: 1.08, dz: 0 }]],
        vista: function (T, f) {
          var m = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = T > f(0.56);
          return cuadro(0.6, 0, { musc: { abdomen: m > 0.3 ? true : null, oblicuos: sec ? 'gris' : null, brillo: 0.35 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
          return E3.brilla(T, pr, ['m:abdomen'], m, true, 100);
        },
        r1: { text: 'RECTO *ABDOMINAL*', s: 1.1, cuando: 0.04 },
        r2: { text: '+ *OBLICUOS*', s: 1.1, cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: mover la cadera. La cadera queda quieta; lo que se dobla es la columna.',
      C: E3.escena({
        tomas: [[0, { az: 84, el: 6, dist: 6.8, y: 1.08, dz: -0.15 }], [1, { az: 90, el: 6, dist: 6.8, y: 1.08, dz: -0.15 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var k = reps(T, f(0), f(1), 2, 0.42);
          return cuadro(k, (1 - bien) * k, { musc: bien < 0.5 ? { gluteos: 'rojo' } : { abdomen: true }, cara: { boca: bien < 0.5 ? 'dientes' : 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var c = pr('cadera'), col = t < 0.5 ? C.RED : C.GRN;
          return (
            <g>
              {espalda(pr, col)}
              {t < 0.5 ? <E3.Flecha a={[c[0] + 20, c[1] + 20]} b={[c[0] + 160, c[1] + 40]} p={1} color={C.RED} /> : <B.Anillo c={c} r={80} color={C.GRN} p={1} />}
            </g>
          );
        },
        mal: [{ x: 830, y: 480, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 830, y: 480, cuando: 0.6 }],
        r1: { text: 'CADERA *ATRÁS*', s: 1.1, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'CADERA *QUIETA*', s: 1.1, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: rebotar sin apretar. Contrae fuerte abajo y aguanta un segundo.',
      C: E3.escena({
        tomas: [[0, { az: 48, el: 4, dist: 5.6, y: 1.05, dz: 0 }], [1, { az: 40, el: 4, dist: 5.4, y: 1.05, dz: 0 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var rebote = 0.35 + 0.25 * Math.sin(T * 13);
          var aguanta = animate({ from: 0, to: 1, start: f(0.56), end: f(0.7), ease: Easing.easeInOutSine })(T);
          var k = bien < 1 ? rebote + (0.35 - rebote) * bien : 0.35 + 0.65 * aguanta;
          return cuadro(k, 0, { musc: bien < 0.5 ? { abdomen: 'rojo' } : { abdomen: true, brillo: 0.5 * aguanta }, cara: { boca: bien < 0.5 ? 'recta' : 'dientes' } });
        },
        lienzo: function (T, f, t, pr) {
          var p = pr('m:abdomen'), h = pr('cabeza');
          var ag = clamp((T - f(0.56)) / (f(0.7) - f(0.56)), 0, 1);
          return t < 0.5
            ? <V.Lineas T={T} c={[h[0] + 30, h[1] - 30]} dir={[-0.4, 1]} v={1} />
            : <g>{E3.brilla(T, pr, ['m:abdomen'], ag, false, 100)}<V.Chispa T={T} c={p} cuando={f(0.7)} r={100} /></g>;
        },
        mal: [{ x: 830, y: 480, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 830, y: 480, cuando: 0.72 }],
        r1: { text: 'REBOTAR SIN *APRETAR*', s: 1.0, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'APRIETA Y *AGUANTA*', s: 1.05, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace: cadera quieta y el abdomen bien apretado.',
      C: E3.escena({
        tomas: [[0, { az: 110, el: 8, dist: 6.6, y: 1.15, dz: -0.2 }], [1, { az: 36, el: 6, dist: 6.2, y: 1.08, dz: 0 }]],
        vista: function (T, f) {
          var k = animate({ from: 0, to: 1, start: f(0.04), end: f(0.42), ease: Easing.easeInOutSine })(T);
          return cuadro(k, 0, { musc: { abdomen: true, brillo: 0.3 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) { return <V.Chispa T={T} c={pr('m:abdomen')} cuando={f(0.42)} r={110} />; },
        bien: [{ x: 830, y: 480, cuando: 0.44, s: 0.85 }],
        r1: { text: 'ABDOMINAL EN POLEA', s: 1.05, cuando: 0.06 },
        r2: { text: 'CADERA *QUIETA*', s: 1.1, cuando: 0.46, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'abdominal-polea-3d', titulo: 'Abdominal en polea (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LO HACÍAS BIEN?', vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de gym y guárdalo.' }
  });
})(window);
