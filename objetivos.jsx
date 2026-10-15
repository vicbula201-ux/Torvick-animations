/* ============================================================
   OBJETIVOS — reel corto con Tor (~34 s con el cierre)
   Fuente: libro, "Establecimiento de objetivos": metas especificas y
   medibles (perder 5 kg, correr 10 km en una hora, +20 % de fuerza),
   plazos realistas (desafiantes pero factibles) y acordes a las
   prioridades y motivaciones de cada uno; ayudan a mantener la
   motivacion, medir el progreso y ajustar el programa.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, PL = global.PL;
  var animate = global.animate, Easing = global.Easing;
  var C = P.C;

  var FIG = PL.FIG;

  function cuenta(n, a) {
    return function (T, f) {
      var k = Easing.easeOutCubic(animate({ from: 0, to: 1, start: f(a), end: f(a + 0.16) })(T));
      return { n: Math.round(n * k), p: k };
    };
  }
  function late(T) { return { beat: 1 + 0.08 * Math.max(0, Math.sin(T * Math.PI * 2 / 0.9)) }; }

  // escalera de cuatro escalones con la meta arriba
  function escalera(T, f) {
    var e = M.pop(T, f(0) - 0.6, 0.5);
    var d = 'M 120 1400 L 120 1300 L 300 1300 L 300 1200 L 480 1200 L 480 1100 L 660 1100 L 660 1000 L 900 1000 L 900 1400 Z';
    var sube = M.draw(T, f(0.5), 0.6);
    return (
      <g opacity={e.opacity}>
        <path d={d} fill="#ffffff" stroke={C.INK} strokeWidth={15} strokeLinejoin="round" />
        <path d="M 140 1360 L 160 1360 M 320 1260 L 340 1260 M 500 1160 L 520 1160 M 680 1060 L 700 1060" stroke={C.GRY} strokeWidth={10} strokeLinecap="round" />
        <B.FlechaS a={[200, 1250]} b={[640, 940]} color={C.GRN} sw={18} p={sube} />
      </g>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás entrenando sin un objetivo claro.',
      C: PL.escena({
        tor: { boca: 'triste', vibra: true, x: FIG.x - 190, y: FIG.y + 40 },
        piezas: [{ C: P.Meta, s: 1.1, x: 640, y: 520, cuando: 0.04, p: { dim: true } }],
        lienzo: function (T, f) {
          return (
            <g>
              <B.FlechaS a={[580, 620]} b={[1010, 400]} color={C.RED} sw={16} p={M.draw(T, f(0.08), 0.3)} />
              <B.FlechaS a={[580, 1260]} b={[900, 1160]} color={C.RED} sw={16} p={M.draw(T, f(0.3), 0.3)} />
            </g>
          );
        },
        mal: [{ x: 860, y: 900, cuando: 0.22, s: 0.6 }, { x: 70, y: 600, cuando: 0.42, s: 0.5 }],
        r1: { text: 'OBJETIVOS', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Medible', dur: 5, vo: 'Tu meta tiene que ser específica y medible: con un número.',
      C: PL.escena({
        piezas: [{ C: P.Meta, s: 2, x: 240, y: 480 }],
        lienzo: function (T, f) {
          return <B.FlechaS a={[130, 1380]} b={[528, 795]} color={C.GRN} sw={22} p={M.draw(T, f(0.28), 0.35)} />;
        },
        bien: [{ x: 860, y: 520, cuando: 0.42 }],
        r1: { text: 'ESPECÍFICA', s: 1.2, cuando: 0.06 },
        r2: { text: 'Y MEDIBLE', s: 1.2, cuando: 0.5 }
      }) },

    { nombre: 'Ejemplos', dur: 6, vo: 'Por ejemplo: perder 5 kilos, correr 10 kilómetros en una hora o subir tu fuerza un 20 %.',
      C: PL.escena({
        piezas: [
          { C: N.Dial, s: 0.95, x: 150, y: 420, cuando: 0.14, p: function (T, f) { return { p: animate({ from: 0.7, to: 0.45, start: f(0.18), end: f(0.34) })(T) }; } },
          { C: B.Cuenta, s: 1.1, x: 640, y: 400, cuando: 0.16, p: cuenta(5, 0.18) },
          { C: N.ICONOS.zapatilla, s: 1, x: 90, y: 760, cuando: 0.38 },
          { C: P.Reloj, s: 0.8, x: 360, y: 800, cuando: 0.44, p: function (T) { return { T: T, speed: 0.2 }; } },
          { C: B.Cuenta, s: 1.1, x: 640, y: 760, cuando: 0.4, p: cuenta(10, 0.42) },
          { C: P.Pesa, s: 0.7, x: 120, y: 1190, cuando: 0.7 },
          { C: B.Cuenta, s: 1.1, x: 640, y: 1120, cuando: 0.72, p: cuenta(20, 0.74) }
        ],
        lienzo: function (T, f) {
          return <B.FlechaS a={[520, 1310]} b={[520, 1170]} color={C.GRN} sw={18} p={M.draw(T, f(0.76), 0.3)} />;
        },
        r1: { text: 'METAS CON NÚMERO', cuando: 0.04 }
      }) },

    { nombre: 'Plazo', dur: 5, vo: 'Ponle un plazo realista: que te exija, pero que puedas cumplir.',
      C: PL.escena({
        piezas: [
          { C: N.ICONOS.calendario, s: 1.2, x: 110, y: 420, cuando: 0.06 },
          { C: P.Reloj, s: 1.2, x: 640, y: 440, cuando: 0.14, p: function (T) { return { T: T, speed: 0.3 }; } },
          { C: P.Meta, s: 0.55, x: 700, y: 830, cuando: 0.45 }
        ],
        lienzo: escalera,
        r1: { text: 'PLAZO REALISTA', cuando: 0.06 },
        r2: { text: 'EXIGENTE PERO POSIBLE', cuando: 0.5 }
      }) },

    { nombre: 'Tuyo', dur: 5, vo: 'Y que vaya con lo que a ti te importa y te motiva.',
      C: PL.escena({
        tor: { boca: 'sonrisa', y: FIG.y + 80 },
        piezas: [
          { C: P.Meta, s: 0.6, x: 90, y: 430, cuando: 0.18 },
          { C: P.Corazon, s: 1.6, x: 790, y: 440, cuando: 0.5, quieto: true, p: late }
        ],
        r1: { text: 'TUS PRIORIDADES', cuando: 0.1 },
        r2: { text: 'LO QUE TE MOTIVA', cuando: 0.5 }
      }) },

    { nombre: 'Para qué', dur: 4.5, vo: 'Así te mantienes motivado, mides tu progreso y ajustas el plan.',
      C: PL.escena({
        piezas: [{ C: N.ICONOS.barras, s: 2.8, x: 204, y: 480,
          p: function (T, f) { return { p: animate({ from: 0.25, to: 1, start: f(0.2), end: f(0.66) })(T) }; } }],
        bien: [{ x: 860, y: 560, cuando: 0.7 }],
        r1: { text: 'MOTIVACIÓN', s: 1.2, cuando: 0.06 },
        r2: { text: 'MIDE Y AJUSTA', s: 1.2, cuando: 0.45 }
      }) },

    { nombre: 'Cierre', dur: 2.5, vo: 'Define tu meta hoy.',
      C: PL.escena({
        tor: {
          flex: function (T, f) { return 0.55 + 0.45 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T)); },
          boca: 'sonrisa', musc: { bic: 1 }
        },
        bien: [{ x: 800, y: 820, cuando: 0.32, s: 0.85 }],
        r1: { text: 'DEFINE TU META', cuando: 0.1 },
        r2: { text: 'EMPIEZA HOY', cuando: 0.4 }
      }) }
  ];

  global.REELS.registrar({ id: 'objetivos', titulo: 'Objetivos (entrenamiento)', escenas: ESCENAS });
})(window);
