/* ============================================================
   PEPTIDOS — reel corto con Tor, ESTILO 2 (~38 s con el cierre)
   Fuente: apuntes del autor. Que son (cadenas cortas de aminoacidos que
   mandan senales); GLP-1 para perder grasa (quitan el hambre; en ensayos,
   ~15 % semaglutida, ~23 % tirzepatida, hasta ~28 % retatrutida) con el
   riesgo de que ~40 % de lo perdido sea masa magra sin fuerza ni proteina;
   BPC-157 (lesiones) y Epitalon (envejecimiento): casi solo estudios en
   animales; veredicto: que unos funcionen no hace magicos a todos, y
   siempre con supervision medica. Lo comprobado: entrenar, dormir, comer bien.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, PL = global.PL, V = global.V;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;

  var FIG = PL.FIG;

  function late(T) { return { beat: 1 + 0.08 * Math.max(0, Math.sin(T * Math.PI * 2 / 0.9)) }; }
  function cuenta(n, a) {
    return function (T, f) {
      var k = Easing.easeOutCubic(animate({ from: 0, to: 1, start: f(a), end: f(a + 0.14) })(T));
      return { n: Math.round(n * k), p: k };
    };
  }

  // cadena corta: 5 aminoacidos
  var CADENA = [[230, 600], [385, 545], [540, 600], [695, 545], [850, 600]];
  var COLORES = [C.YEL, C.GRN, C.GRY, '#ffffff', C.YEL];

  // ondas de senal que bajan desde la cadena hacia Tor
  function senales(T, f) {
    var desde = f(0.36);
    if (T < desde) return null;
    var ondas = [];
    for (var i = 0; i < 3; i++) {
      var u = (((T - desde) / 1.1) + i / 3) % 1;
      var r = 90 + 330 * u;
      var a0 = 55 * Math.PI / 180, a1 = 125 * Math.PI / 180;
      var c = [540, 640];
      ondas.push(<path key={i} d={'M ' + (c[0] + r * Math.cos(a0)).toFixed(1) + ' ' + (c[1] + r * Math.sin(a0)).toFixed(1) +
        ' A ' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + (c[0] + r * Math.cos(a1)).toFixed(1) + ' ' + (c[1] + r * Math.sin(a1)).toFixed(1)}
        fill="none" stroke={C.YEL} strokeWidth={16} strokeLinecap="round" opacity={(1 - u) * clamp((T - desde) / 0.3, 0, 1)} />);
    }
    return <g>{ondas}</g>;
  }

  function cadena(T, f) {
    return (
      <g>
        {CADENA.slice(1).map(function (c, i) {
          var a = CADENA[i], p = M.draw(T, f(0.02 + i * 0.05), 0.3);
          return p > 0.02 ? <path key={i} d={'M ' + a[0] + ' ' + a[1] + ' L ' + U.pt(U.lerpP(a, c, p))}
            stroke={C.INK} strokeWidth={16} strokeLinecap="round" /> : null;
        })}
        {senales(T, f)}
      </g>
    );
  }

  // anillo: hasta el 40 % de lo perdido puede ser musculo
  function anillo40(T, f) {
    var c = [540, 780], r = 230;
    var p = animate({ from: 0, to: 0.4, start: f(0.12), end: f(0.36), ease: Easing.easeInOutCubic })(T);
    var punto = function (fr, rr) { var a = (-90 + 360 * fr) * Math.PI / 180; return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]; };
    var aro = M.draw(T, f(0) - 0.6, 0.5);
    return (
      <g>
        <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={C.YEL} strokeWidth={92} opacity={aro} />
        <circle cx={c[0]} cy={c[1]} r={r + 48} fill="none" stroke={C.INK} strokeWidth={12} opacity={aro} />
        <circle cx={c[0]} cy={c[1]} r={r - 48} fill="none" stroke={C.INK} strokeWidth={12} opacity={aro} />
        {p > 0.01 ? <path d={'M ' + U.pt(punto(0, r)) + ' A ' + r + ' ' + r + ' 0 0 1 ' + U.pt(punto(p, r))}
          fill="none" stroke={C.RED} strokeWidth={92} /> : null}
        {p > 0.39 ? <path d={'M ' + U.pt(punto(0.4, r - 60)) + ' L ' + U.pt(punto(0.4, r + 60))} stroke={C.INK} strokeWidth={14} strokeLinecap="round" /> : null}
      </g>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás creyendo que los péptidos son magia.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.15, foco: [700, 820] }], [1, { zoom: 1, foco: [540, 960] }]],
        tor: { x: FIG.x - 190, y: FIG.y + 40, boca: 'sonrisa', flex: 0.35 },
        piezas: [{ C: N.ICONOS.vial, s: 1.4, x: 650, y: 610, cuando: 0.04 }],
        lienzo: function (T, f) { return <V.Brillo T={T} c={[818, 800]} r={150} v={clamp((T - f(0.04)) / 0.3, 0, 1)} />; },
        mal: [{ x: 860, y: 520, cuando: 0.22, s: 0.6 }, { x: 860, y: 1060, cuando: 0.42, s: 0.5 }],
        r1: { text: 'PÉPTIDOS', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Qué son', dur: 5.5, vo: 'Son cadenas cortas de aminoácidos, parecidas a las proteínas, que le mandan señales a tu cuerpo.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.1, foco: [540, 600] }], [0.4, { zoom: 1, foco: [540, 900] }], [1, { zoom: 1.04, foco: [540, 960] }]],
        piezas: CADENA.map(function (c, i) {
          return { C: N.Bola, p: { r: 44, color: COLORES[i] }, x: c[0] - 54, y: c[1] - 54, cuando: i ? 0.02 + i * 0.05 : null, fase: i * 0.13 };
        }),
        lienzo: cadena,
        tor: { s: 0.42, x: 288, y: 823, cuando: 0.3, boca: 'sonrisa',
          flex: function (T, f) { return 0.3 + 0.7 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.6), end: f(0.76) })(T)); },
          musc: function (T, f) { return { bic: animate({ from: 0, to: 1, start: f(0.62), end: f(0.76) })(T) }; } },
        r1: { text: 'CADENAS CORTAS', cuando: 0.06 },
        r2: { text: 'SEÑALES AL CUERPO', cuando: 0.5 }
      }) },

    { nombre: 'Grasa', dur: 6.5, vo: 'Los de pérdida de grasa, como el Ozempic, quitan el hambre: en estudios bajaron entre 15 y 28 % del peso.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.08, foco: [540, 620] }], [0.4, { zoom: 1.08, foco: [540, 620] }], [0.6, { zoom: 1, foco: [540, 960] }], [1, { zoom: 1.03 }]],
        piezas: [
          { C: N.ICONOS.jeringa, s: 1.2, x: 40, y: 430 },
          { C: N.Plato, s: 0.95, x: 450, y: 400, cuando: 0.06, fase: 0.4 },
          { C: N.COMIDA.pollo, fase: 0.4, cuando: 0.08,
            p: function (T, f) { return { s: animate({ from: 1.25, to: 0.55, start: f(0.22), end: f(0.42), ease: Easing.easeInOutCubic })(T) }; },
            x: function (T, f) { return 650 - 120 * animate({ from: 1.25, to: 0.55, start: f(0.22), end: f(0.42), ease: Easing.easeInOutCubic })(T); },
            y: function (T, f) { return 600 - 120 * animate({ from: 1.25, to: 0.55, start: f(0.22), end: f(0.42), ease: Easing.easeInOutCubic })(T); } },
          { C: B.Cuenta, s: 1, x: 110, y: 1010, cuando: 0.46, p: cuenta(15, 0.47) },
          { C: B.Cuenta, s: 1, x: 430, y: 1010, cuando: 0.56, p: cuenta(23, 0.57) },
          { C: B.Cuenta, s: 1, x: 750, y: 1010, cuando: 0.66, p: cuenta(28, 0.67) }
        ],
        r1: { text: 'MENOS HAMBRE', s: 1.2, cuando: 0.14 },
        r2: { text: '15 A 28 % MENOS PESO', cuando: 0.5 }
      }) },

    { nombre: 'Músculo', dur: 5.5, vo: 'Pero hasta un 40 % de lo que pierdes puede ser músculo, si no entrenas fuerza ni comes proteína.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 780] }], [0.55, { zoom: 1, foco: [540, 960] }], [1, { zoom: 1.03 }]],
        lienzo: anillo40,
        piezas: [
          { C: P.Pesa, s: 0.7, x: 120, y: 1170, cuando: 0.6 },
          { C: N.COMIDA.pollo, s: 0.9, x: 640, y: 1110, cuando: 0.68 }
        ],
        mal: [{ x: 860, y: 520, cuando: 0.34, s: 0.55 }],
        bien: [{ x: 860, y: 1300, cuando: 0.78 }],
        r1: { text: 'HASTA 40 % ES MÚSCULO', cuando: 0.14 },
        r2: { text: 'ENTRENA Y COME PROTEÍNA', cuando: 0.56 }
      }) },

    { nombre: 'Otros', dur: 5.5, vo: 'El BPC-157 para lesiones y el Epitalon para envejecer: casi solo hay estudios en animales.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.05, foco: [540, 600] }], [0.5, { zoom: 1.08, foco: [540, 1050] }], [1, { zoom: 1.02 }]],
        piezas: [
          { C: N.ICONOS.vial, s: 1.15, x: 90, y: 410, p: { color: C.GRN } },
          { C: N.ICONOS.vial, s: 1.15, x: 714, y: 410, cuando: 0.16, p: { color: C.GRY } },
          { C: N.ICONOS.adn, s: 0.8, x: 444, y: 430, cuando: 0.22 },
          { C: N.ICONOS.raton, s: 1.9, x: 312, y: 870, cuando: 0.5 }
        ],
        lienzo: function (T, f) {
          return (
            <g>
              <B.FlechaS a={[230, 720]} b={[420, 930]} color={C.YEL} sw={18} p={M.draw(T, f(0.42), 0.35)} />
              <B.FlechaS a={[850, 720]} b={[660, 930]} color={C.YEL} sw={18} p={M.draw(T, f(0.46), 0.35)} />
            </g>
          );
        },
        r1: { text: 'BPC-157 Y EPITALON', cuando: 0.04 },
        r2: { text: 'SOLO EN ANIMALES', cuando: 0.55 }
      }) },

    { nombre: 'Veredicto', dur: 4.5, vo: 'Que unos funcionen no los hace mágicos a todos. Y siempre, con supervisión médica.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 600] }], [0.5, { zoom: 1, foco: [540, 960] }], [1, { zoom: 1.04 }]],
        piezas: [
          { C: N.ICONOS.vial, s: 0.85, x: 50, y: 440, p: { color: C.GRN } },
          { C: N.ICONOS.vial, s: 0.85, x: 290, y: 440, cuando: 0.06, p: { color: C.GRY } },
          { C: N.ICONOS.vial, s: 0.85, x: 530, y: 440, cuando: 0.1, p: { color: C.GRY } },
          { C: N.ICONOS.vial, s: 0.85, x: 770, y: 440, cuando: 0.14, p: { color: C.GRY } },
          { C: N.ICONOS.estetoscopio, s: 1.7, x: 336, y: 860, cuando: 0.52 }
        ],
        bien: [{ x: 100, y: 330, cuando: 0.2, s: 0.5 }, { x: 850, y: 1000, cuando: 0.72 }],
        r1: { text: 'NO TODO ES MAGIA', cuando: 0.06 },
        r2: { text: 'CON TU MÉDICO', s: 1.2, cuando: 0.55 }
      }) },

    { nombre: 'Cierre', dur: 4, vo: 'Lo comprobado sigue siendo entrenar, dormir y comer bien.',
      C: PL.escena2({
        pulsos: [0.3],
        tor: {
          s: 0.6, x: 180, y: 220,
          flex: function (T, f) { return 0.55 + 0.45 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.28) })(T)); },
          boca: 'sonrisa', musc: { bic: 1 }
        },
        piezas: [
          { C: P.Pesa, s: 0.62, x: 50, y: 1210, cuando: 0.3 },
          { C: N.ICONOS.luna, s: 0.9, x: 432, y: 1150, cuando: 0.42 },
          { C: N.COMIDA.manzana, s: 0.9, x: 780, y: 1150, cuando: 0.55 }
        ],
        bien: [{ x: 860, y: 560, cuando: 0.66, s: 0.85 }],
        r1: { text: 'ENTRENA Y DUERME', cuando: 0.1 },
        r2: { text: 'Y COME BIEN', s: 1.2, cuando: 0.5 }
      }) }
  ];

  global.REELS.registrar({ id: 'peptidos', titulo: 'Péptidos (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
