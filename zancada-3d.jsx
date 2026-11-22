/* ============================================================
   ZANCADA CON MANCUERNAS — TOR EN 3D (mismo guion que zancada.jsx)
   De pie, una mancuerna en cada mano; paso adelante y bajar hasta que el
   muslo de adelante quede paralelo al piso; empujar y volver. Cuadriceps y
   gluteo (principales); isquios y gemelos ayudan. Errores: perder el
   equilibrio (de costado) y la rodilla que se va hacia adentro (de frente).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, V = global.V, B = global.B, E3 = global.E3;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;

  /* ---------------- la pose ---------------- */
  // paso 0..1 el pie derecho sale adelante; baja 0..1 la cadera baja; alza levanta el pie en el paso;
  // tambalea (grados) el tronco se va de lado; valgo 0..1 la rodilla de adelante se va adentro
  function pose(o) {
    var paso = o.paso || 0, baja = o.baja || 0, alza = o.alza || 0, tb = o.tambalea || 0, valgo = o.valgo || 0;
    return {
      cadera: [tb * 0.004, 1.0 - 0.015 * paso - 0.4 * baja, 0.3 * paso + 0.15 * baja],
      tronco: [3 + 4 * baja, 0, tb], cabeza: [-4 * baja, 0, -tb * 0.6],
      pieD: [0.15 + 0.04 * valgo, 0.115 + 0.1 * alza, 0.9 * paso],
      pieI: [-0.15, 0.115 + 0.12 * baja, -0.02],
      pies: [48 * baja, -12 * alza],
      rodillaD: [0.15 - 1.4 * valgo, 0, 1], rodillaI: [0.1, -0.2, 1]
    };
  }
  // una repeticion: paso (con el pie en el aire), baja, aguanta, sube y vuelve
  function fases(u) {
    var paso = Easing.easeInOutSine(clamp(u / 0.22, 0, 1)) - Easing.easeInOutSine(clamp((u - 0.8) / 0.2, 0, 1));
    var alza = Math.sin(Math.PI * clamp(u / 0.22, 0, 1)) + Math.sin(Math.PI * clamp((u - 0.8) / 0.2, 0, 1));
    var baja = Easing.easeInOutSine(clamp((u - 0.24) / 0.22, 0, 1)) - Easing.easeInOutSine(clamp((u - 0.56) / 0.22, 0, 1));
    return { paso: paso, baja: baja, alza: alza };
  }
  function rep(T, a, b, n) { return fases(V.fase(T, a, b, n)); }
  function cuadro(o, extra) {
    return { figuras: [Object.assign({ quien: 'tor', pose: pose(o), pesas: 'neutro' }, extra || {})] };
  }
  var LADO = { az: 90, el: 6, dist: 6.6, y: 0.95, dz: 0.35 };

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tu zancada.',
      C: E3.escena({
        tomas: [[0, { az: 64, el: 8, dist: 5.0, y: 1.0, dz: 0.4 }], [1, { az: 80, el: 6, dist: 6.4, y: 0.92, dz: 0.4 }]],
        vista: function (T) {
          var r = cuadro({ paso: 1, baja: 0.7 + 0.2 * Math.sin(T * 5), tambalea: 16 * Math.sin(T * 6.5) },
            { musc: { cuadriceps: 'rojo' }, cara: { boca: 'dientes', cejas: 'triste' } });
          r.vibra = true; return r;
        },
        lienzo: function (T, f, t, pr) { return <V.Gotas T={T} c={pr('cabeza')} v={1} />; },
        mal: [{ x: 820, y: 460, cuando: 0.2, s: 0.6 }, { x: 110, y: 470, cuando: 0.44, s: 0.5 }],
        r1: { text: '*ZANCADA*', s: 1.25, cuando: 0.02, tono: 'rojo' }
      }) },

    { nombre: 'Posición', dur: 5, vo: 'De pie, con los pies al ancho de los hombros y una mancuerna en cada mano, al lado del cuerpo.',
      C: E3.escena({
        tomas: [[0, { az: 18, el: 12, dist: 6.6, y: 0.95, dz: 0 }], [0.5, { az: 28, el: 12, dist: 6.4, y: 0.95, dz: 0 }], [0.56, { az: 34, el: 6, dist: 5.6, y: 1.05, dz: 0 }], [1, { az: 44, el: 6, dist: 5.9, y: 1.05, dz: 0 }]],
        vista: function () { return cuadro({}, { cara: { boca: 'sonrisa' } }); },
        lienzo: function (T, f, t, pr) {
          var pie = clamp((T - f(0.14)) / (f(0.28) - f(0.14)), 0, 1);
          var mc = clamp((T - f(0.6)) / (f(0.72) - f(0.6)), 0, 1);
          return t < 0.53
            ? <g><B.Anillo c={pr([-0.15, 0.06, 0.06])} r={80} color={C.YEL} p={pie} /><B.Anillo c={pr([0.15, 0.06, 0.06])} r={80} color={C.YEL} p={pie} />
              <B.Puntos pts={[pr('hombroI'), pr([-0.15, 0.08, 0.06])]} color={C.YEL} sw={10} p={pie} /><B.Puntos pts={[pr('hombroD'), pr([0.15, 0.08, 0.06])]} color={C.YEL} sw={10} p={pie} /></g>
            : <g><B.Anillo c={pr('manoI')} r={95} color={C.YEL} p={mc} /><B.Anillo c={pr('manoD')} r={95} color={C.YEL} p={mc} /></g>;
        },
        bien: [{ x: 860, y: 560, cuando: 0.32 }, { x: 860, y: 560, cuando: 0.78 }],
        r1: { text: 'PIES AL *ANCHO*', s: 1.1, cuando: 0.12 },
        r2: { text: 'MANCUERNAS AL *COSTADO*', s: 0.92, cuando: 0.6 }
      }) },

    { nombre: 'Ejecución', dur: 6, vo: 'Da un paso adelante y baja hasta que el muslo quede paralelo al piso; empuja y vuelve.',
      C: E3.escena({
        tomas: [[0, LADO], [0.5, { az: 72, el: 8, dist: 6.4, y: 0.92, dz: 0.35 }], [0.501, { az: 52, el: 10, dist: 5.6, y: 0.85, dz: 0.4 }], [1, { az: 40, el: 10, dist: 5.8, y: 0.88, dz: 0.4 }]],
        vista: function (T, f) {
          var q = rep(T, f(0.02), f(0.98), 2);
          return cuadro(q, { musc: { cuadriceps: true, gluteos: true, brillo: 0.35 * q.baja }, cara: { boca: q.baja > 0.8 ? 'dientes' : 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var q = rep(T, f(0.02), f(0.98), 2);
          return (
            <g>
              {q.baja > 0.92 ? <B.Puntos pts={[pr('caderaJD'), pr('rodillaD')]} color={C.GRN} sw={14} p={1} /> : null}
              <V.Chispa T={T} c={pr('rodillaD')} cuando={f(0.26)} r={90} />
              <V.Chispa T={T} c={pr('rodillaD')} cuando={f(0.74)} r={90} />
            </g>
          );
        },
        encima: function (T, f) { return E3.contador(T, f(0.02), f(0.98), 2, 40, 1150); },
        bien: [{ x: 860, y: 560, cuando: 0.5 }],
        r1: { text: 'PASO *ADELANTE*', s: 1.1, cuando: 0.06 },
        r2: { text: 'MUSLO *PARALELO*', s: 1.1, cuando: 0.3 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'Trabajan el cuádriceps y el glúteo, con ayuda de los isquios y los gemelos.',
      C: E3.escena({
        tomas: [[0, { az: 62, el: 8, dist: 4.8, y: 0.72, dz: 0.45 }], [0.6, { az: 76, el: 8, dist: 4.8, y: 0.72, dz: 0.45 }], [1, { az: 128, el: 10, dist: 6.0, y: 0.8, dz: 0.35 }]],
        vista: function (T, f) {
          var m = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = T > f(0.56);
          return cuadro({ paso: 1, baja: 0.92 + 0.08 * Math.sin(T * 2) },
            { musc: { cuadriceps: m > 0.3 ? true : null, gluteos: m > 0.3 ? true : null, isquios: sec ? 'gris' : null, gemelos: sec ? 'gris' : null, brillo: 0.35 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
          return E3.brilla(T, pr, ['m:cuadriceps:1', 'm:gluteos:1'], m, true, 85);
        },
        r1: { text: 'CUÁDRICEPS Y *GLÚTEO*', s: 1.0, cuando: 0.04 },
        r2: { text: '+ ISQUIOS Y *GEMELOS*', cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: perder el equilibrio. Tronco firme y la mirada al frente.',
      C: E3.escena({
        tomas: [[0, { az: 30, el: 6, dist: 6.2, y: 0.95, dz: 0.4 }], [1, { az: 40, el: 6, dist: 6.2, y: 0.95, dz: 0.4 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var tb = (1 - bien) * 18 * Math.sin(T * 6.5);
          return cuadro({ paso: 1, baja: 0.6 + 0.35 * Math.sin(T * 2.4), tambalea: tb },
            { musc: bien < 0.5 ? { abdomen: 'rojo', oblicuos: 'rojo' } : { abdomen: true, cuadriceps: true }, cara: bien < 0.5 ? { boca: 'ondulada', cejas: 'triste' } : { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) { return <B.Puntos pts={[pr('cadera'), pr('cuello'), pr('cabeza')]} color={t < 0.5 ? C.RED : C.GRN} sw={14} p={1} />; },
        mal: [{ x: 820, y: 470, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 820, y: 470, cuando: 0.6 }],
        r1: { text: 'SIN *EQUILIBRIO*', s: 1.1, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'TRONCO *FIRME*', s: 1.1, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: dejar que la rodilla se vaya hacia adentro. Que apunte hacia tu pie.',
      C: E3.escena({
        tomas: [[0, { az: 6, el: 4, dist: 5.4, y: 0.72, dz: 0.5 }], [1, { az: 12, el: 4, dist: 5.4, y: 0.72, dz: 0.5 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var d = 0.82 + 0.18 * Math.sin(T * 2.6);
          return cuadro({ paso: 1, baja: d, valgo: (1 - bien) * d },
            { musc: bien < 0.5 ? { cuadriceps: 'rojo' } : { cuadriceps: true }, cara: { boca: bien < 0.5 ? 'dientes' : 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var r = pr('rodillaD'), pie = pr([0.15, 0.06, 0.98]);
          return t < 0.5
            ? <g><B.Anillo c={r} r={70} color={C.RED} p={1} /><E3.Flecha a={[r[0] + 150, r[1]]} b={[r[0] + 50, r[1]]} p={1} color={C.RED} /></g>
            : <B.Puntos pts={[[r[0], r[1] - 70], pie]} color={C.GRN} sw={14} p={1} />;
        },
        mal: [{ x: 820, y: 640, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 820, y: 640, cuando: 0.6 }],
        r1: { text: 'RODILLA *ADENTRO*', s: 1.05, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'RODILLA HACIA EL *PIE*', cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace: paso firme y el muslo paralelo.',
      C: E3.escena({
        tomas: [[0, { az: 140, el: 8, dist: 6.2, y: 0.9, dz: 0.35 }], [1, { az: 50, el: 8, dist: 6.4, y: 0.92, dz: 0.35 }]],
        vista: function (T, f) {
          var k = animate({ from: 0, to: 1, start: f(0.04), end: f(0.42), ease: Easing.easeInOutSine })(T);
          return cuadro({ paso: Math.min(1, k * 2), baja: Math.max(0, k * 2 - 1), alza: Math.sin(Math.PI * Math.min(1, k * 2)) },
            { musc: { cuadriceps: true, gluteos: true, brillo: 0.3 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) { return <V.Chispa T={T} c={pr('rodillaD')} cuando={f(0.42)} r={100} />; },
        bien: [{ x: 860, y: 560, cuando: 0.44, s: 0.85 }],
        r1: { text: 'ZANCADA', s: 1.25, cuando: 0.06 },
        r2: { text: 'PASO *FIRME*', s: 1.1, cuando: 0.46, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'zancada-3d', titulo: 'Zancada con mancuernas (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LO HACÍAS BIEN?', vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de gym y guárdalo.' }
  });
})(window);
