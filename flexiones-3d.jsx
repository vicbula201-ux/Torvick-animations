/* ============================================================
   FLEXIONES DE PECHO — TOR EN 3D (mismo guion que flexion-pecho.jsx)
   Plancha con las manos un poco mas anchas que los hombros y el cuerpo
   recto de la cabeza a los talones; bajar hasta que el pecho casi toque el
   piso y empujar. Pectoral mayor (principal); ayudan el deltoides anterior y
   el triceps. Errores: media flexion y la cadera fuera de linea.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, V = global.V, B = global.B, E3 = global.E3, TOR3D = global.TOR3D;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;

  /* ---------------- la plancha ---------------- */
  var ZA = -0.95, YA = 0.21, LH = 0.9, LS = 1.465;
  function cuerpo(baja) {
    var hS = 0.82 + (0.34 - 0.82) * baja;
    var b = Math.asin(clamp((hS - YA) / LS, 0.05, 0.9));
    return { b: b, u: [0, Math.sin(b), Math.cos(b)], n: [0, Math.cos(b), -Math.sin(b)] };
  }
  var MANOS_Z = ZA + Math.cos(cuerpo(0.45).b) * LS + 0.03;
  // baja 0 (arriba) .. 1 (pecho al piso); cad: + la cadera sube, - se hunde
  function pose(baja, cad) {
    var c = cuerpo(baja), u = c.u, n = c.n, k = (cad || 0) * 0.14;
    var cuello = [0, YA + u[1] * (LH + 0.665), ZA + u[2] * (LH + 0.665)];
    var cadera = [0, YA + u[1] * LH + n[1] * k, ZA + u[2] * LH + n[2] * k];
    var dy = cuello[1] - cadera[1], dz = cuello[2] - cadera[2];
    var inclina = Math.atan2(dz, dy) * 180 / Math.PI;
    return {
      cadera: cadera, tronco: [inclina, 0, 0], cabeza: [22 + 10 * baja, 0, 0],
      pieI: [-0.15, YA, ZA], pieD: [0.15, YA, ZA], pies: [72, 72],
      manoI: [-0.43, 0.075, MANOS_Z], manoD: [0.43, 0.075, MANOS_Z],
      codoI: [0.7, -0.7, -0.9], codoD: [0.7, -0.7, -0.9]
    };
  }
  function rep(T, a, b, n, va, tope) { return (tope == null ? 1 : tope) * V.ida(V.fase(T, a, b, n), va == null ? 0.5 : va, 0.1); }
  var COLCH = { tipo: 'colchoneta', p: [0, 0, -0.15], ancho: 1.1, largo: 2.4 };
  function cuadro(baja, cad, extra, bajaEn) {
    return { figuras: [Object.assign({ quien: 'tor', pose: pose(baja, cad) }, extra || {})], objetos: [COLCH] };
  }
  // la linea del cuerpo: talon, cadera, cuello y cabeza
  function lineaCuerpo(pr, color, p) {
    var pts = [pr([0, YA + 0.06, ZA - 0.04]), pr('cadera'), pr('cuello'), pr('cabeza')];
    return <B.Puntos pts={pts} color={color} sw={16} p={p == null ? 1 : p} />;
  }
  function pecho(baja) { var J = TOR3D.esqueleto(pose(baja, 0)); return [0, J.cuello.y - 0.32, J.cuello.z - 0.12]; }
  var LADO = { az: 56, el: 16, dist: 7.0, y: 0.42, dz: -0.12 };

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tus flexiones de pecho.',
      C: E3.escena({
        tomas: [[0, { az: 38, el: 12, dist: 5.6, y: 0.45, dz: 0 }], [1, { az: 54, el: 14, dist: 6.8, y: 0.42, dz: -0.1 }]],
        vista: function (T, f) {
          var baja = rep(T, f(0), f(1), 2, 0, 0.45);
          var r = cuadro(baja, -1, { musc: { pecho: 'rojo', abdomen: 'rojo' }, cara: { boca: 'dientes', cejas: 'enojo' } });
          r.vibra = true; return r;
        },
        lienzo: function (T, f, t, pr) { return <g>{lineaCuerpo(pr, C.RED)}<V.Gotas T={T} c={pr('cabeza')} v={1} /></g>; },
        mal: [{ x: 820, y: 640, cuando: 0.2, s: 0.6 }, { x: 140, y: 1290, cuando: 0.44, s: 0.5 }],
        r1: { text: 'FLEXIÓN DE *PECHO*', s: 1.1, cuando: 0.02, tono: 'rojo' }
      }) },

    { nombre: 'Posición', dur: 5, vo: 'Manos un poco más anchas que los hombros y el cuerpo recto, de la cabeza a los talones.',
      C: E3.escena({
        tomas: [[0, { az: 14, el: 26, dist: 5.4, y: 0.35, dz: 0.15 }], [0.48, { az: 24, el: 26, dist: 5.2, y: 0.35, dz: 0.15 }],
          [0.52, LADO], [1, { az: 66, el: 14, dist: 7.2, y: 0.42, dz: -0.12 }]],
        vista: function () { return cuadro(0, 0, { cara: { boca: 'sonrisa' } }); },
        lienzo: function (T, f, t, pr) {
          var manos = clamp((T - f(0.12)) / (f(0.26) - f(0.12)), 0, 1);
          var linea = clamp((T - f(0.58)) / (f(0.74) - f(0.58)), 0, 1);
          return t < 0.5
            ? <g><B.Anillo c={pr('manoI')} r={90} color={C.YEL} p={manos} /><B.Anillo c={pr('manoD')} r={90} color={C.YEL} p={manos} />
              <E3.Flecha a={pr([-0.3, 0.075, MANOS_Z + 0.25])} b={pr([-0.5, 0.075, MANOS_Z + 0.25])} p={manos} />
              <E3.Flecha a={pr([0.3, 0.075, MANOS_Z + 0.25])} b={pr([0.5, 0.075, MANOS_Z + 0.25])} p={manos} /></g>
            : lineaCuerpo(pr, C.GRN, linea);
        },
        bien: [{ x: 840, y: 640, cuando: 0.32 }, { x: 840, y: 640, cuando: 0.78 }],
        r1: { text: 'MANOS MÁS *ANCHAS*', cuando: 0.1 },
        r2: { text: 'CUERPO *RECTO*', s: 1.1, y: 1380, cuando: 0.56 }
      }) },

    { nombre: 'Ejecución', dur: 6, vo: 'Baja hasta que el pecho casi toque el piso y empuja fuerte hacia arriba.',
      C: E3.escena({
        tomas: [[0, LADO], [0.48, { az: 64, el: 14, dist: 6.8, y: 0.42, dz: -0.1 }], [0.481, { az: 30, el: 8, dist: 5.2, y: 0.4, dz: 0.1 }], [1, { az: 22, el: 8, dist: 5.4, y: 0.4, dz: 0.1 }]],
        vista: function (T, f) {
          var baja = rep(T, f(0.04), f(0.96), 2);
          return cuadro(baja, 0, { musc: { pecho: true, brillo: 0.4 * baja }, cara: { boca: baja > 0.6 ? 'dientes' : 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var ar = pr(pecho(0)), ab = pr(pecho(1));
          return (
            <g>
              <B.Puntos pts={[[ar[0] - 70, ar[1]], [ab[0] - 70, ab[1]]]} color={C.YEL} sw={12} p={1} />
              <V.Chispa T={T} c={[pr('hombroD')[0], pr('hombroD')[1] - 70]} cuando={f(0.3)} r={100} />
              <V.Chispa T={T} c={[pr('hombroD')[0], pr('hombroD')[1] - 70]} cuando={f(0.76)} r={100} />
            </g>
          );
        },
        encima: function (T, f) { return E3.contador(T, f(0.04), f(0.96), 2, 40, 1200); }, zona: [200, 378, 1036, 1452],
        bien: [{ x: 840, y: 640, cuando: 0.5 }],
        r1: { text: 'PECHO AL *PISO*', s: 1.1, cuando: 0.08 },
        r2: { text: 'EMPUJA *FUERTE*', s: 1.1, y: 1380, cuando: 0.52 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'Trabaja el pectoral mayor; ayudan el hombro de adelante y el tríceps.',
      C: E3.escena({
        tomas: [[0, { az: 20, el: 0, dist: 4.2, y: 0.4, dz: 0.25 }], [0.6, { az: 30, el: 0, dist: 4.1, y: 0.4, dz: 0.25 }], [1, { az: 48, el: 10, dist: 6.2, y: 0.42, dz: 0 }]],
        vista: function (T, f) {
          var m = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = T > f(0.56);
          return cuadro(0.55, 0, { musc: { pecho: m > 0.3 ? true : null, deltoides: sec ? 'gris' : null, triceps: sec ? 'gris' : null, brillo: 0.35 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
          return E3.brilla(T, pr, ['m:pecho:0', 'm:pecho:1'], m, true, 85);
        },
        r1: { text: 'PECTORAL *MAYOR*', s: 1.1, cuando: 0.04 },
        r2: { text: '+ HOMBRO Y *TRÍCEPS*', y: 1380, cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: bajar a medias. Baja hasta que el pecho casi toque el piso.',
      C: E3.escena({
        tomas: [[0, { az: 70, el: 10, dist: 7.0, y: 0.42, dz: -0.05 }], [1, { az: 62, el: 12, dist: 6.8, y: 0.42, dz: -0.05 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var baja = bien < 0.5 ? rep(T, f(0), f(0.44), 2, 0, 0.38) : rep(T, f(0.5), f(1), 1, 0, 1);
          return cuadro(baja, 0, { musc: bien < 0.5 ? { pecho: 'rojo' } : { pecho: true, brillo: 0.3 * baja }, cara: { boca: bien < 0.5 ? 'recta' : 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var p = pr(pecho(0.38)), piso = pr([0, 0.02, pecho(0.38)[2]]);
          var baja = rep(T, f(0.5), f(1), 1, 0, 1);
          return t < 0.5
            ? <g><B.Puntos pts={[[p[0] - 90, p[1]], [piso[0] - 90, piso[1]]]} color={C.RED} sw={14} p={1} /></g>
            : <B.Anillo c={piso} r={70} color={C.GRN} p={baja} />;
        },
        mal: [{ x: 820, y: 640, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 820, y: 640, cuando: 0.66 }],
        r1: { text: 'MEDIA *FLEXIÓN*', s: 1.1, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'RECORRIDO *COMPLETO*', y: 1380, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: hundir o subir la cadera. Aprieta el abdomen y mantén el cuerpo en línea.',
      C: E3.escena({
        tomas: [[0, { az: 84, el: 8, dist: 8.0, y: 0.5, dz: -0.15 }], [1, { az: 90, el: 8, dist: 8.0, y: 0.5, dz: -0.15 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var cad = Math.sin((T - f(0)) / (f(0.44) - f(0)) * Math.PI * 2) * (1 - bien) * 1.3;
          var baja = 0.2 + 0.1 * Math.sin(T * 2.4);
          return cuadro(baja, cad, { musc: bien < 0.5 ? { abdomen: 'rojo', lumbar: 'rojo' } : { abdomen: true }, cara: { boca: bien < 0.5 ? 'dientes' : 'sonrisa', cejas: bien < 0.5 ? 'triste' : null } });
        },
        lienzo: function (T, f, t, pr) { return lineaCuerpo(pr, t < 0.5 ? C.RED : C.GRN); },
        mal: [{ x: 820, y: 640, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 820, y: 640, cuando: 0.6 }],
        r1: { text: 'CADERA FUERA DE *LÍNEA*', s: 0.95, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'CUERPO EN *LÍNEA*', s: 1.1, y: 1380, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace: cuerpo recto y recorrido completo.',
      C: E3.escena({
        tomas: [[0, { az: 124, el: 16, dist: 8.2, y: 0.45, dz: -0.2 }], [1, { az: 40, el: 12, dist: 6.6, y: 0.42, dz: 0 }]],
        vista: function (T, f) {
          var baja = rep(T, f(0.04), f(0.9), 1);
          return cuadro(baja, 0, { musc: { pecho: true, brillo: 0.3 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var h = pr('hombroD');
          return <g>{lineaCuerpo(pr, C.GRN)}<V.Chispa T={T} c={[h[0], h[1] - 70]} cuando={f(0.5)} r={110} /></g>;
        },
        bien: [{ x: 840, y: 640, cuando: 0.5, s: 0.85 }],
        r1: { text: 'FLEXIÓN DE PECHO', s: 1.1, cuando: 0.06 },
        r2: { text: 'CUERPO *RECTO*', s: 1.1, y: 1380, cuando: 0.46, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'flexiones-3d', titulo: 'Flexiones de pecho (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LO HACÍAS BIEN?', vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de gym y guárdalo.' }
  });
})(window);
