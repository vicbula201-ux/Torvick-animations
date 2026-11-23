/* ============================================================
   CURL DE BICEPS CON MANCUERNAS — TOR EN 3D (mismo guion que curl-mancuernas.jsx)
   De pie, una mancuerna en cada mano con agarre neutro y los brazos
   estirados; subir doblando el codo y girando la muneca (supinacion) hasta
   que la palma mire arriba, bajar lento y alternar. Biceps (principal);
   braquial y braquiorradial. Errores: balancear el cuerpo y girar la muneca
   antes de doblar el codo. Cada mancuerna gira por su cuenta (pesas {I, D}).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, V = global.V, B = global.B, E3 = global.E3;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;

  /* ---------------- una repeticion: sube 40 %, aguanta 10 %, baja lento ---------------- */
  function flexDe(k) {
    if (k <= 0 || k >= 1) return 0;
    if (k < 0.4) return Easing.easeInOutSine(k / 0.4);
    if (k < 0.5) return 1;
    return 1 - Easing.easeInOutSine((k - 0.5) / 0.5);
  }
  // supinacion: bien acompana la flexion; anticipada gira entera antes de doblar
  function giroDe(k, anticipado) {
    if (anticipado) {
      if (k <= 0 || k >= 1) return 0;
      if (k < 0.16) return Easing.easeInOutSine(k / 0.16);
      if (k < 0.6) return 1;
      return 1 - Easing.easeInOutSine((k - 0.6) / 0.4);
    }
    return Easing.easeInOutSine(clamp(flexDe(k) * 1.25, 0, 1));
  }
  function flexAnticipada(k) { return k < 0.16 ? 0 : flexDe((k - 0.16) / 0.84); }
  function cicloEn(T, a, b, n, fase) { var u = (T - a) / (b - a) * n + (fase || 0); return u < 0 ? 0 : u - Math.floor(u); }

  /* ---------------- la pose: de pie, de frente ---------------- */
  // th: flexion por lado [izq, der]; bal: balanceo del tronco (el error)
  function pose(th, bal) {
    var b = bal || 0;
    var p = { cadera: [0, 1.0 - 0.03 * b, 0.02 * b], tronco: [-14 * b, 0, 0], cabeza: [4 * b, 0, 0], hombros: { sube: 0.4 * b },
      pieI: [-0.2, 0.115, 0.03], pieD: [0.2, 0.115, 0.03], rodillaI: [0.1, 0, 1], rodillaD: [0.1, 0, 1] };
    [-1, 1].forEach(function (s, i) {
      var k = Easing.easeInOutSine(clamp(th[i], 0, 1));
      p[s < 0 ? 'manoI' : 'manoD'] = E3.lerp3([s * 0.36, 0.83 + 0.05 * b, 0.1 + 0.08 * b], [s * 0.42, 1.4, 0.3], k);
      p[s < 0 ? 'codoI' : 'codoD'] = [0.25, -0.3, -1];
    });
    return p;
  }
  // el eje de cada mancuerna: neutro (adelante) .. supinado (de costado)
  function eje(g) { var a = clamp(g, 0, 1) * Math.PI / 2; return [Math.sin(a), 0, Math.cos(a)]; }
  function cuadro(th, gi, bal, extra) {
    return { figuras: [Object.assign({ quien: 'tor', pose: pose(th, bal), pesas: { I: eje(gi[0]), D: eje(gi[1]) } }, extra || {})] };
  }
  // alternado: el brazo derecho empieza y el izquierdo va medio ciclo despues
  function alternado(T, a, b, n, anticipado) {
    var kD = cicloEn(T, a, b, n, 0), kI = cicloEn(T, a, b, n, 0.5);
    var th = [anticipado ? flexAnticipada(kI) : flexDe(kI), anticipado ? flexAnticipada(kD) : flexDe(kD)];
    var gi = [giroDe(kI, anticipado), giroDe(kD, anticipado)];
    return { th: th, gi: gi };
  }
  function antebrazo(pr, L) { var a = pr('codo' + L), b = pr('mano' + L); return [a[0] + (b[0] - a[0]) * 0.45, a[1] + (b[1] - a[1]) * 0.45]; }
  var GEN = { az: 16, el: 6, dist: 5.6, y: 1.12 };

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tu curl de bíceps con mancuerna.',
      C: E3.escena({
        tomas: [[0, { az: 30, el: 8, dist: 4.0, y: 1.3 }], [1, { az: 18, el: 6, dist: 5.6, y: 1.12 }]],
        vista: function (T, f) {
          var k = 0.5 - 0.5 * Math.cos((T - f(0)) * 7);
          var r = cuadro([k, k], [1, 1], k, { musc: { biceps: 'rojo', lumbar: 'rojo' }, cara: { boca: 'dientes', cejas: 'enojo' } });
          r.vibra = true; return r;
        },
        lienzo: function (T, f, t, pr) { return <V.Gotas T={T} c={pr('cabeza')} v={1} />; },
        mal: [{ x: 70, y: 470, cuando: 0.2, s: 0.6 }, { x: 860, y: 1120, cuando: 0.44, s: 0.5 }],
        r1: { text: 'CURL DE *BÍCEPS*', s: 1.2, cuando: 0.02, tono: 'rojo' }
      }) },

    { nombre: 'Posición', dur: 4.5, vo: 'Ponte de pie con una mancuerna en cada mano, las palmas mirando hacia el cuerpo y los brazos estirados.',
      C: E3.escena({
        tomas: [[0, GEN], [0.42, { az: 22, el: 4, dist: 5.2, y: 1.05 }], [0.5, { az: 40, el: 10, dist: 3.0, y: 0.9, dx: 0.25 }], [0.86, { az: 46, el: 10, dist: 3.0, y: 0.9, dx: 0.25 }], [1, GEN]],
        vista: function () { return cuadro([0, 0], [0, 0], 0, { cara: { boca: 'sonrisa' } }); },
        lienzo: function (T, f, t, pr) {
          var guia = clamp((T - f(0.12)) / (f(0.36) - f(0.12)), 0, 1);
          var aro = clamp((T - f(0.54)) / (f(0.66) - f(0.54)), 0, 1);
          return (
            <g>
              {t < 0.46 ? <g><E3.Guia a={pr('hombroI')} b={pr('manoI')} p={guia} color={C.GRN} /><E3.Guia a={pr('hombroD')} b={pr('manoD')} p={guia} color={C.GRN} /></g> : null}
              {t > 0.48 ? <g><B.Anillo c={pr('manoI')} r={82} color={C.YEL} p={aro} /><B.Anillo c={pr('manoD')} r={82} color={C.YEL} p={aro} /></g> : null}
            </g>
          );
        },
        bien: [{ x: 860, y: 560, cuando: 0.34 }, { x: 860, y: 560, cuando: 0.74 }],
        r1: { text: 'BRAZOS *ESTIRADOS*', cuando: 0.08 },
        r2: { text: 'PALMAS AL *CUERPO*', cuando: 0.56 }
      }) },

    { nombre: 'Ejecución', dur: 6, vo: 'Sube doblando el codo y gira la muñeca hasta que la palma mire hacia arriba. Baja lento con control y ve alternando.',
      C: E3.escena({
        tomas: [[0, GEN], [0.3, { az: 30, el: 6, dist: 4.4, y: 1.2 }], [0.7, { az: 6, el: 6, dist: 4.6, y: 1.2 }], [1, GEN]],
        vista: function (T, f) {
          var a = alternado(T, f(0.03), f(0.97), 2);
          return cuadro(a.th, a.gi, 0, { musc: { biceps: true, brillo: 0.35 * Math.max(a.th[0], a.th[1]) }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          return (
            <g>
              <V.Chispa T={T} c={pr('manoD')} cuando={f(0.03 + 0.94 * 0.2)} r={90} />
              <V.Chispa T={T} c={pr('manoI')} cuando={f(0.03 + 0.94 * 0.45)} r={90} />
              <V.Chispa T={T} c={pr('manoD')} cuando={f(0.03 + 0.94 * 0.7)} r={90} />
              <V.Chispa T={T} c={pr('manoI')} cuando={f(0.03 + 0.94 * 0.95)} r={90} />
            </g>
          );
        },
        encima: function (T, f) { return E3.contador(T, f(0.03), f(0.97), 4, 40, 1150); }, zona: [200, 378, 1036, 1452],
        bien: [{ x: 860, y: 560, cuando: 0.52 }],
        r1: { text: 'SUBE Y *GIRA*', s: 1.15, cuando: 0.06 },
        r2: { text: 'BAJA *LENTO*', s: 1.1, cuando: 0.52 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'El músculo principal es el bíceps, con ayuda del braquial y el braquiorradial.',
      C: E3.escena({
        tomas: [[0, { az: 34, el: 8, dist: 3.2, y: 1.3, dx: 0.2 }], [0.6, { az: 44, el: 8, dist: 3.1, y: 1.3, dx: 0.2 }], [1, { az: 22, el: 6, dist: 5.0, y: 1.15 }]],
        vista: function (T, f) {
          var m = T > f(0.04);
          return cuadro([0.85, 0.85], [1, 1], 0, { musc: { biceps: m ? true : null, brillo: 0.35 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
          var s = clamp((T - f(0.56)) / (f(0.68) - f(0.56)), 0, 1);
          return (
            <g>
              {E3.brilla(T, pr, ['m:biceps:0', 'm:biceps:1'], m, true, 85)}
              <V.Halo T={T} c={antebrazo(pr, 'I')} r={70} v={s} color={C.GRY} />
              <V.Halo T={T} c={antebrazo(pr, 'D')} r={70} v={s} color={C.GRY} />
            </g>
          );
        },
        r1: { text: '*BÍCEPS*', s: 1.3, cuando: 0.04 },
        r2: { text: '+ BRAQUIAL Y *BRAQUIORRADIAL*', s: 0.86, cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'No balancees el cuerpo para subir las mancuernas. Mantén siempre el tronco quieto.',
      C: E3.escena({
        tomas: [[0, { az: 72, el: 6, dist: 5.4, y: 1.12 }], [1, { az: 62, el: 6, dist: 5.6, y: 1.12 }]],
        vista: function (T, f) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var mal = bien < 0.5;
          var k = mal ? 0.5 - 0.5 * Math.cos((T - f(0)) * 6.5) : 0;
          var a = alternado(T, f(0.5), f(1), 1);
          var th = mal ? [k, k] : a.th, gi = mal ? [k, k] : a.gi;
          return cuadro(th, gi, mal ? k * (1 - bien) : 0, { musc: mal ? { lumbar: 'rojo', biceps: 'gris' } : { biceps: true, brillo: 0.3 },
            cara: mal ? { boca: 'dientes', cejas: 'enojo' } : { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          return t < 0.5 ? <V.Lineas c={[pr('cuello')[0] + 140, pr('cuello')[1]]} dir={[1, 0]} v={1} largo={150} />
            : <E3.Guia a={pr('cadera')} b={pr('cuello')} p={1} color={C.GRN} />;
        },
        mal: [{ x: 840, y: 480, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 840, y: 480, cuando: 0.62 }],
        r1: { text: 'SIN *BALANCEO*', s: 1.15, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'TRONCO *QUIETO*', s: 1.15, cuando: 0.52, tono: 'verde' }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'No gires la muñeca antes de doblar el codo. Siempre gira mientras subes.',
      C: E3.escena({
        tomas: [[0, { az: 26, el: 8, dist: 3.4, y: 1.2, dx: 0.25 }], [1, { az: 36, el: 8, dist: 3.4, y: 1.2, dx: 0.25 }]],
        vista: function (T, f) {
          var bien = T > f(0.5);
          var kD = bien ? cicloEn(T, f(0.52), f(1), 1) : cicloEn(T, f(0.02), f(0.48), 1);
          var th = [0, bien ? flexDe(kD) : flexAnticipada(kD)], gi = [0, giroDe(kD, !bien)];
          return cuadro(th, gi, 0, { musc: bien ? { biceps: true, brillo: 0.3 } : { biceps: 'rojo' }, cara: bien ? { boca: 'sonrisa' } : { boca: 'recta', cejas: 'enojo' } });
        },
        lienzo: function (T, f, t, pr) {
          return <B.Anillo c={pr('manoD')} r={78} color={t < 0.5 ? C.RED : C.GRN} p={1} />;
        },
        mal: [{ x: 840, y: 480, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 840, y: 480, cuando: 0.66 }],
        r1: { text: 'GIRO *ANTICIPADO*', s: 1.1, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'GIRA *AL SUBIR*', s: 1.15, cuando: 0.54, tono: 'verde' }
      }) },

    { nombre: 'Cierre', dur: 2.5, vo: 'Así se hace el curl de bíceps con mancuerna.',
      C: E3.escena({
        tomas: [[0, { az: 40, el: 8, dist: 5.2, y: 1.15 }], [1, { az: -8, el: 6, dist: 5.6, y: 1.12 }]],
        golpes: [0.36],
        vista: function (T, f) {
          var k = animate({ from: 0, to: 1, start: f(0.04), end: f(0.36), ease: Easing.easeInOutSine })(T);
          return cuadro([k, k], [k, k], 0, { musc: { biceps: true, brillo: 0.35 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) { return <g><V.Chispa T={T} c={pr('manoI')} cuando={f(0.36)} r={100} /><V.Chispa T={T} c={pr('manoD')} cuando={f(0.36)} r={100} /></g>; },
        bien: [{ x: 850, y: 560, cuando: 0.4, s: 0.85 }],
        r1: { text: 'CURL CON MANCUERNAS', s: 1.0, cuando: 0.06 },
        r2: { text: 'TÉCNICA > *PESO*', s: 1.15, cuando: 0.46, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'curl-mancuernas-3d', titulo: 'Curl de bíceps con mancuernas (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 3.2, pregunta: '¿QUIERES VER MÁS?', vo: '¿Quieres ver más videos similares?' },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
