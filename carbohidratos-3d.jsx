/* ============================================================
   CARBOHIDRATOS — TOR EN 3D, EN EL GIMNASIO (el guion como lo grabo Victor)
   Son la fuente principal de energia; al entrenar se convierten en glucosa, el
   combustible del musculo. Fuentes: cereales integrales, frutas, verduras,
   legumbres y tuberculos. Con pesas: 4 a 7 g por kilo al dia segun el nivel de
   entrenamiento (70 kg: 280 a 490 g al dia).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, E3 = global.E3;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = P.C;

  var ZONA = [7 * Math.PI / 180, 42 * Math.PI / 180];   // la franja verde del dial
  function plato(nombre, x, y, cuando, s) { return { C: N.COMIDA[nombre], s: s || 0.72, plato: 0.6, x: x, y: y, cuando: cuando }; }
  function grilla(lista) {
    return lista.map(function (q, i) {
      var fila = Math.floor(i / 2), sola = i === lista.length - 1 && i % 2 === 0;
      return plato(q[0], sola ? 615 : (i % 2 ? 790 : 500), 360 + fila * 262, q[1]);
    });
  }
  // hexagonos de glucosa que vuelan hasta los biceps
  function glucosa(T, f, destinos, a, b) {
    var out = [];
    destinos.forEach(function (d, j) {
      for (var i = 0; i < 4; i++) {
        var u = ((T - f(a)) / 0.9 + i / 4) % 1;
        if (T < f(a) || T > f(b)) continue;
        var ang = (j ? -30 : 210) + i * 28, R = 360 * (1 - Easing.easeInCubic(u));
        var x = d[0] + Math.cos(ang * Math.PI / 180) * R, y = d[1] + Math.sin(ang * Math.PI / 180) * R, r = 26;
        var pts = [0, 1, 2, 3, 4, 5].map(function (k) { var q = (60 * k + 30) * Math.PI / 180; return (x + r * Math.cos(q)).toFixed(1) + ',' + (y + r * Math.sin(q)).toFixed(1); }).join(' ');
        out.push(<polygon key={j + '-' + i} points={pts} fill={C.YEL} stroke={C.INK} strokeWidth={8} strokeLinejoin="round" opacity={1 - u * u} />);
      }
    });
    return <g>{out}</g>;
  }
  // cuatro comidas sobre un plato centrado en (770, 1060)
  var EN_PLATO = [['pan', -80, -76], ['arroz', 80, -76], ['banana', -80, 80], ['papa', 80, 80]];

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: '¿Para qué sirven realmente los carbohidratos?',
      C: E3.charla({
        gesto: 'duda', lado: 'izq', cara: { boca: 'o', cejas: 'alzadas' },
        piezas: [{ C: N.COMIDA.pan, s: 0.9, x: 600, y: 470, cuando: 0.08 }, { C: N.COMIDA.arroz, s: 0.9, x: 800, y: 700, cuando: 0.18 }, { C: N.COMIDA.banana, s: 0.9, x: 600, y: 930, cuando: 0.28 }],
        r1: { text: '*CARBOHIDRATOS*', s: 1.1, cuando: 0.02 },
        r2: { text: '¿PARA QUÉ SIRVEN?', cuando: 0.3 }
      }) },

    { nombre: 'Energía', dur: 4.5, vo: 'Los carbohidratos son la fuente principal de energía de tu cuerpo.',
      C: E3.charla({
        gesto: 'senala', lado: 'izq',
        piezas: [
          { C: N.COMIDA.pan, s: 0.8, x: 560, y: 400 }, { C: N.COMIDA.banana, s: 0.8, x: 800, y: 400, cuando: 0.08 },
          { C: P.Medidor, s: 1.25, x: 560, y: 880, cuando: 0.2, p: function (T, f) { return { p: animate({ from: 0.1, to: 1, start: f(0.3), end: f(0.7), ease: Easing.easeOutCubic })(T) }; } }
        ],
        r1: { text: 'FUENTE DE *ENERGÍA*', cuando: 0.06 },
        r2: { text: 'LA *PRINCIPAL*', cuando: 0.5 }
      }) },

    { nombre: 'Glucosa', dur: 5, vo: 'Al entrenar se convierten en glucosa y es el combustible de tus músculos.',
      C: E3.charla({
        gesto: 'flex', flex: function (T, f) { return 0.6 + 0.4 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T)); },
        musc: function (T, f) { return T > f(0.4) ? { biceps: true, brillo: 0.35 } : null; },
        tomas: [[0, { az: 14, el: 6, dist: 4.4, y: 1.4 }], [1, { az: 4, el: 4, dist: 5.4, y: 1.3 }]],
        lienzo: function (T, f, t, pr) {
          return <g>{glucosa(T, f, [pr('m:biceps:0'), pr('m:biceps:1')], 0.1, 0.62)}{E3.brilla(T, pr, ['m:biceps:0', 'm:biceps:1'], clamp((T - f(0.4)) / (f(0.55) - f(0.4)), 0, 1), true, 80)}</g>;
        },
        bien: [{ x: 850, y: 430, cuando: 0.7 }],
        r1: { text: '*GLUCOSA*', s: 1.15, cuando: 0.06 },
        r2: { text: 'COMBUSTIBLE DEL *MÚSCULO*', cuando: 0.5 }
      }) },

    { nombre: 'Fuentes', dur: 6, vo: 'Se pueden encontrar en cereales integrales, frutas, verduras, legumbres y tubérculos.',
      C: E3.charla({
        gesto: 'senala', zona: [20, 400, 470, 1480],
        piezas: grilla([['pan', 0.1], ['arroz', 0.2], ['banana', 0.36], ['brocoli', 0.5], ['legumbres', 0.64], ['papa', 0.8]]),
        r1: { text: 'FUENTES DE *CARBOS*', cuando: 0.02 }
      }) },

    { nombre: 'Cuánta', dur: 6, vo: 'Si entrenas con pesas, consume de 4 a 7 gramos por kilo al día, según tu nivel de entrenamiento.',
      C: E3.charla({
        gesto: 'senala', lado: 'izq',
        piezas: [{ C: N.Dial, s: 1.05, x: 600, y: 640, cuando: 0.1,
          p: function (T, f) { return { zona: ZONA, p: animate({ from: 0, to: 0.68, start: f(0.2), end: f(0.55), ease: Easing.easeOutElastic })(T) + M.life(T, 1.6, 0.012) }; } }],
        bien: [{ x: 860, y: 980, cuando: 0.58, s: 0.5 }],
        r1: { text: '*4 A 7 G* POR KILO', s: 1.1, cuando: 0.12 },
        r2: { text: 'SEGÚN TU *NIVEL*', cuando: 0.62 }
      }) },

    { nombre: 'Ejemplo', dur: 6, vo: 'Por ejemplo, si pesas 70 kilos, consume entre 280 y 490 gramos de carbohidratos al día.',
      C: E3.charla({
        gesto: 'explica', lado: 'izq',
        piezas: [
          { C: B.Cuenta, s: 0.9, x: 670, y: 400, cuando: 0.1,
            p: function (T, f) { var k = Easing.easeOutCubic(animate({ from: 0, to: 1, start: f(0.12), end: f(0.36) })(T)); return { n: Math.round(70 * k), p: k }; } },
          { C: N.Plato, s: 0.9, x: 581, y: 871, cuando: 0.4, fase: 0.5 }
        ].concat(EN_PLATO.map(function (c, i) {
          return { C: N.COMIDA[c[0]], s: 0.5, x: 770 + c[1] - 60, y: 1060 + c[2] - 60, cuando: 0.5 + i * 0.07, fase: 0.5 };
        })),
        bien: [{ x: 900, y: 760, cuando: 0.82, s: 0.5 }],
        r1: { text: 'SI PESAS *70 KG*', cuando: 0.06 },
        r2: { text: '*280 A 490 G* AL DÍA', cuando: 0.5 }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Los carbohidratos son tu gasolina para entrenar.',
      C: E3.charla({
        gesto: 'flex', flex: function (T, f) { return 0.55 + 0.45 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T)); },
        musc: { biceps: true, brillo: 0.3 },
        bien: [{ x: 860, y: 520, cuando: 0.42, s: 0.75 }],
        r1: { text: 'TU *GASOLINA*', s: 1.1, cuando: 0.1 },
        r2: { text: 'PARA *ENTRENAR*', cuando: 0.4, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'carbohidratos-3d', escenario: 'gym', titulo: 'Carbohidratos (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LO SABÍAS?', vo: '¿Lo sabías? Coméntalo, compártelo y guárdalo.' }
  });
})(window);
