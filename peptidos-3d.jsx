/* ============================================================
   PEPTIDOS — TOR EN 3D (mismo guion que peptidos.jsx)
   Que son (cadenas cortas de aminoacidos que mandan senales); GLP-1 para
   perder grasa (quitan el hambre; en ensayos ~15 % semaglutida, ~23 %
   tirzepatida, hasta ~28 % retatrutida) con el riesgo de que ~40 % de lo
   perdido sea masa magra sin fuerza ni proteina; BPC-157 (lesiones) y
   Epitalon (envejecimiento): casi solo estudios en animales; veredicto: que
   unos funcionen no hace magicos a todos, y siempre con supervision medica.
   Lo comprobado: entrenar, dormir y comer bien.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, V = global.V, E3 = global.E3;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;

  function depie(extra) { return Object.assign({ cadera: [0, 1.0, 0], pieI: [-0.2, 0.115, 0.03], pieD: [0.2, 0.115, 0.03] }, extra || {}); }
  function flex(k) { return E3.poseFlex(k); }
  function cuenta(n, a) {
    return function (T, f) {
      var k = Easing.easeOutCubic(animate({ from: 0, to: 1, start: f(a), end: f(a + 0.14) })(T));
      return { n: Math.round(n * k), p: k };
    };
  }
  function tor(pose, extra) { return { figuras: [Object.assign({ quien: 'tor', pose: pose }, extra || {})] }; }
  var GEN = { az: 12, el: 4, dist: 6.4, y: 1.1 };

  // cadena corta: 5 aminoacidos y las senales que bajan hacia Tor
  var CADENA = [[230, 560], [385, 505], [540, 560], [695, 505], [850, 560]];
  var COLORES = [C.YEL, C.GRN, C.GRY, '#ffffff', C.YEL];
  function cadena(T, f, hacia) {
    var lineas = CADENA.slice(1).map(function (c, i) {
      var a = CADENA[i], p = M.draw(T, f(0.02 + i * 0.05), 0.3);
      return p > 0.02 ? <path key={i} d={'M ' + a[0] + ' ' + a[1] + ' L ' + U.pt(U.lerpP(a, c, p))} stroke={C.INK} strokeWidth={16} strokeLinecap="round" /> : null;
    });
    var ondas = [], desde = f(0.36);
    if (T > desde) {
      for (var i = 0; i < 3; i++) {
        var u = (((T - desde) / 1.1) + i / 3) % 1, r = 70 + (hacia[1] - 620) * u;
        var c0 = [540, 620], a0 = 55 * Math.PI / 180, a1 = 125 * Math.PI / 180;
        ondas.push(<path key={'o' + i} d={'M ' + (c0[0] + r * Math.cos(a0)).toFixed(1) + ' ' + (c0[1] + r * Math.sin(a0)).toFixed(1) +
          ' A ' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 1 ' + (c0[0] + r * Math.cos(a1)).toFixed(1) + ' ' + (c0[1] + r * Math.sin(a1)).toFixed(1)}
          fill="none" stroke={C.YEL} strokeWidth={16} strokeLinecap="round" opacity={(1 - u) * clamp((T - desde) / 0.3, 0, 1)} />);
      }
    }
    return <g>{lineas}{ondas}</g>;
  }
  // anillo: hasta el 40 % de lo perdido puede ser musculo
  var AN = { c: [740, 700], r: 170 };
  function anillo40(T, f) {
    var c = AN.c, r = AN.r;
    var p = animate({ from: 0, to: 0.4, start: f(0.12), end: f(0.36), ease: Easing.easeInOutCubic })(T);
    var punto = function (fr, rr) { var a = (-90 + 360 * fr) * Math.PI / 180; return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]; };
    var aro = M.draw(T, f(0) - 0.6, 0.5);
    return (
      <g>
        <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={C.YEL} strokeWidth={70} opacity={aro} />
        <circle cx={c[0]} cy={c[1]} r={r + 36} fill="none" stroke={C.INK} strokeWidth={11} opacity={aro} />
        <circle cx={c[0]} cy={c[1]} r={r - 36} fill="none" stroke={C.INK} strokeWidth={11} opacity={aro} />
        {p > 0.01 ? <path d={'M ' + U.pt(punto(0, r)) + ' A ' + r + ' ' + r + ' 0 0 1 ' + U.pt(punto(p, r))} fill="none" stroke={C.RED} strokeWidth={70} /> : null}
        {p > 0.39 ? <path d={'M ' + U.pt(punto(0.4, r - 46)) + ' L ' + U.pt(punto(0.4, r + 46))} stroke={C.INK} strokeWidth={13} strokeLinecap="round" /> : null}
      </g>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás creyendo que los péptidos son magia.',
      C: E3.escena({
        tomas: [[0, { az: 22, el: 6, dist: 4.4, y: 1.35 }], [1, GEN]],
        vista: function (T, f) { return tor(flex(0.35 + 0.1 * Math.sin(T * 3)), { musc: { biceps: true, brillo: 0.3 }, cara: { ojos: 'corazon', boca: 'sonrisa' } }); },
        piezas: [{ C: N.ICONOS.vial, s: 1.2, x: 760, y: 420, cuando: 0.04 }],
        lienzo: function (T, f, t, pr) { return <g><V.Destellos T={T} c={pr('cabeza')} r={190} v={1} n={7} /><V.Halo T={T} c={[904, 560]} r={120} v={clamp((T - f(0.04)) / 0.3, 0, 1)} /></g>; },
        mal: [{ x: 70, y: 460, cuando: 0.22, s: 0.6 }, { x: 860, y: 1120, cuando: 0.42, s: 0.5 }],
        r1: { text: '¿PÉPTIDOS *MÁGICOS*?', s: 1.1, cuando: 0.02, tono: 'rojo' }
      }) },

    { nombre: 'Qué son', dur: 5.5, vo: 'Son cadenas cortas de aminoácidos, parecidas a las proteínas, que le mandan señales a tu cuerpo.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 4, el: 4, dist: 6.6, y: 1.1 }]],
        vista: function (T, f) {
          var k = Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.6), end: f(0.76) })(T));
          return tor(flex(0.2 + 0.8 * k), { musc: { biceps: k > 0.3 ? true : null, brillo: 0.3 * k }, cara: { boca: 'sonrisa' } });
        },
        piezas: CADENA.map(function (c, i) {
          return { C: N.Bola, p: { r: 44, color: COLORES[i] }, x: c[0] - 54, y: c[1] - 54, cuando: i ? 0.02 + i * 0.05 : null, fase: i * 0.13 };
        }),
        lienzo: function (T, f, t, pr) { return cadena(T, f, pr('cabeza')); },
        r1: { text: 'CADENAS *CORTAS*', s: 1.15, cuando: 0.06 },
        r2: { text: 'SEÑALES AL *CUERPO*', cuando: 0.5 }
      }) },

    { nombre: 'Grasa', dur: 6.5, vo: 'Los de pérdida de grasa, como el Ozempic, quitan el hambre. En estudios, las personas bajaron entre el 15 y el 28 % de su peso.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 20, el: 4, dist: 6.4, y: 1.1 }]],
        vista: function (T, f) {
          var baja = animate({ from: 0, to: 1, start: f(0.22), end: f(0.5), ease: Easing.easeInOutCubic })(T);
          return tor(depie({ panza: 0.85 * (1 - baja), manoD: [0.3, 1.0, 0.25], codoD: [1, -1, 0] }), { cara: baja < 0.5 ? { boca: 'recta' } : { boca: 'sonrisa' } });
        },
        piezas: [
          { C: N.ICONOS.jeringa, s: 0.95, x: 50, y: 400 },
          { C: N.Plato, s: 0.7, x: 746, y: 390, cuando: 0.06, fase: 0.4 },
          { C: N.COMIDA.pollo, fase: 0.4, cuando: 0.08, libre: true,
            p: function (T, f) { return { s: animate({ from: 0.95, to: 0.4, start: f(0.22), end: f(0.42), ease: Easing.easeInOutCubic })(T) }; },
            x: function (T, f) { return 893 - 120 * animate({ from: 0.95, to: 0.4, start: f(0.22), end: f(0.42), ease: Easing.easeInOutCubic })(T); },
            y: function (T, f) { return 537 - 120 * animate({ from: 0.95, to: 0.4, start: f(0.22), end: f(0.42), ease: Easing.easeInOutCubic })(T); } },
          { C: B.Cuenta, s: 0.75, x: 150, y: 1210, cuando: 0.46, p: cuenta(15, 0.47) },
          { C: B.Cuenta, s: 0.75, x: 457, y: 1210, cuando: 0.56, p: cuenta(23, 0.57) },
          { C: B.Cuenta, s: 0.75, x: 764, y: 1210, cuando: 0.66, p: cuenta(28, 0.67) }
        ],
        r1: { text: 'MENOS *HAMBRE*', s: 1.2, cuando: 0.14 },
        r2: { text: '15 A 28 % *MENOS PESO*', cuando: 0.5 }
      }) },

    { nombre: 'Músculo', dur: 5.5, vo: 'Pero hasta un 40 % de lo que pierdes puede ser músculo, si no entrenas fuerza ni comes proteína.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 18, el: 4, dist: 6.2, y: 1.1 }]],
        vista: function (T, f) {
          var bien = T > f(0.58);
          var k = Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.6), end: f(0.74) })(T));
          return tor(bien ? flex(k) : depie({ hombros: { sube: 0.2 } }), { musc: bien ? { biceps: true, pecho: true, brillo: 0.3 } : { biceps: 'gris', pecho: 'gris' }, cara: bien ? { boca: 'sonrisa' } : { boca: 'ondulada', cejas: 'triste' } });
        },
        lienzo: anillo40,
        ocupa: [[AN.c[0] - AN.r - 42, AN.c[1] - AN.r - 42, AN.c[0] + AN.r + 42, AN.c[1] + AN.r + 42]],
        piezas: [
          { C: P.Pesa, s: 0.5, x: 560, y: 1110, cuando: 0.6 },
          { C: N.COMIDA.pollo, s: 0.7, x: 800, y: 1060, cuando: 0.68 }
        ],
        mal: [{ x: 880, y: 420, cuando: 0.34, s: 0.5 }],
        bien: [{ x: 880, y: 1260, cuando: 0.78 }],
        r1: { text: 'HASTA 40 % ES *MÚSCULO*', s: 1.0, cuando: 0.14, tono: 'rojo' },
        r2: { text: 'ENTRENA Y COME *PROTEÍNA*', s: 0.95, cuando: 0.56, tono: 'verde' }
      }) },

    { nombre: 'Otros', dur: 5.5, vo: 'Hay otros, como el BPC-157 para las lesiones y el Epitalon para la vejez. Sin embargo, solo hay estudios en animales.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 24, el: 4, dist: 6.6, y: 1.1 }]],
        vista: function (T, f) { return tor(depie({ manoD: [0.12, 2.0, 0.02], codoD: [1, -0.2, 0.3], cabeza: [0, 0, -10] }), { cara: { ojos: 'grandes', boca: 'o', cejas: 'alzadas' } }); },
        piezas: [
          { C: N.ICONOS.vial, s: 0.85, x: 60, y: 410, p: { color: C.GRN } },
          { C: N.ICONOS.vial, s: 0.85, x: 290, y: 410, cuando: 0.16, p: { color: C.GRY } },
          { C: N.ICONOS.adn, s: 0.7, x: 560, y: 420, cuando: 0.22 },
          { C: N.ICONOS.raton, s: 1.4, x: 70, y: 990, cuando: 0.5 }
        ],
        lienzo: function (T, f) {
          return (
            <g>
              <B.FlechaS a={[160, 650]} b={[200, 960]} color={C.YEL} sw={18} p={M.draw(T, f(0.42), 0.35)} />
              <B.FlechaS a={[390, 650]} b={[320, 960]} color={C.YEL} sw={18} p={M.draw(T, f(0.46), 0.35)} />
            </g>
          );
        },
        ocupa: [[120, 640, 440, 980]],
        r1: { text: 'BPC-157 Y *EPITALON*', s: 1.05, cuando: 0.04 },
        r2: { text: 'SOLO EN *ANIMALES*', cuando: 0.55 }
      }) },

    { nombre: 'Veredicto', dur: 4.5, vo: 'Los péptidos por sí solos no son magia. Que unos funcionen y otros no, no los hace mágicos. Y siempre, con supervisión médica.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 6, el: 4, dist: 6.4, y: 1.1 }]],
        vista: function (T, f) {
          var ok = T > f(0.55);
          return tor(ok ? depie({ manoD: [0.45, 1.6, 0.3], codoD: [1, -1, 0] }) : depie(), { cara: ok ? { boca: 'sonrisa' } : { boca: 'recta', cejas: 'alzadas' } });
        },
        piezas: [
          { C: N.ICONOS.vial, s: 0.75, x: 70, y: 420, p: { color: C.GRN } },
          { C: N.ICONOS.vial, s: 0.75, x: 310, y: 420, cuando: 0.06, p: { color: C.GRY } },
          { C: N.ICONOS.vial, s: 0.75, x: 550, y: 420, cuando: 0.1, p: { color: C.GRY } },
          { C: N.ICONOS.vial, s: 0.75, x: 790, y: 420, cuando: 0.14, p: { color: C.GRY } },
          { C: N.ICONOS.estetoscopio, s: 1.2, x: 700, y: 1000, cuando: 0.52 }
        ],
        bien: [{ x: 110, y: 380, cuando: 0.2, s: 0.5 }, { x: 860, y: 900, cuando: 0.72 }],
        r1: { text: 'NO TODO ES *MAGIA*', cuando: 0.06 },
        r2: { text: 'CON TU *MÉDICO*', s: 1.2, cuando: 0.55, tono: 'verde' }
      }) },

    { nombre: 'Cierre', dur: 4, vo: 'Lo comprobado sigue siendo entrenar bien, dormir bien y comer bien.',
      C: E3.escena({
        tomas: [[0, { az: 30, el: 6, dist: 5.4, y: 1.2 }], [1, { az: -10, el: 4, dist: 6.2, y: 1.1 }]],
        golpes: [0.3],
        vista: function (T, f) {
          var k = 0.55 + 0.45 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.28) })(T));
          return tor(flex(k), { musc: { biceps: true, brillo: 0.35 }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) { return E3.brilla(T, pr, ['m:biceps:0', 'm:biceps:1'], 1, true, 70); },
        piezas: [
          { C: P.Pesa, s: 0.55, x: 50, y: 1240, cuando: 0.3 },
          { C: N.ICONOS.luna, s: 0.8, x: 444, y: 1200, cuando: 0.42 },
          { C: N.COMIDA.manzana, s: 0.8, x: 800, y: 1200, cuando: 0.55 }
        ],
        bien: [{ x: 860, y: 560, cuando: 0.66, s: 0.85 }],
        r1: { text: 'ENTRENA Y *DUERME*', cuando: 0.1 },
        r2: { text: 'Y COME *BIEN*', s: 1.2, cuando: 0.5, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'peptidos-3d', titulo: 'Péptidos (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 3.2, pregunta: '¿QUIERES VER MÁS?', vo: '¿Quieres ver más videos similares?' },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
