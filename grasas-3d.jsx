/* ============================================================
   GRASAS — TOR EN 3D, EN EL SUPERMERCADO (el guion como lo grabo Victor)
   Para que sirven: producir hormonas y absorber las vitaminas A, D, E y K;
   energia de larga duracion, proteger los organos y mantener la temperatura.
   Fuentes: aguacate, aceite de oliva, frutos secos, semillas, pescados grasos
   y lacteos enteros. Entre el 20 y el 35 % de las calorias del dia, priorizando
   las insaturadas y evitando el exceso de trans y saturadas.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, E3 = global.E3;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;

  function plato(nombre, x, y, cuando, s, extra) { return Object.assign({ C: N.COMIDA[nombre], s: s || 0.72, plato: 0.6, x: x, y: y, cuando: cuando }, extra || {}); }
  function grilla(lista) {
    return lista.map(function (q, i) {
      var fila = Math.floor(i / 2), sola = i === lista.length - 1 && i % 2 === 0;
      return plato(q[0], sola ? 615 : (i % 2 ? 790 : 500), 360 + fila * 262, q[1]);
    });
  }
  // el anillo de las calorias del dia: la parte de las grasas (20 a 35 %)
  function anillo(T, f) {
    var c = [770, 900], r = 200;
    var p = animate({ from: 0, to: 0.35, start: f(0.16), end: f(0.5), ease: Easing.easeInOutCubic })(T);
    var punto = function (frac, rr) { var a = (-90 + 360 * frac) * Math.PI / 180; return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]; };
    var arco = function (a0, a1) {
      var p0 = punto(a0, r), p1 = punto(a1, r);
      return 'M ' + U.pt(p0) + ' A ' + r + ' ' + r + ' 0 ' + (a1 - a0 > 0.5 ? 1 : 0) + ' 1 ' + U.pt(p1);
    };
    var aro = M.draw(T, f(0) - 0.6, 0.5), dy = M.life(T, 3, 6);
    var marca = function (frac, k) {
      var a = punto(frac, r - 56), b = punto(frac, r + 56);
      return p >= frac - 0.005 ? <path key={k} d={'M ' + U.pt(a) + ' L ' + U.pt(b)} stroke={C.INK} strokeWidth={13} strokeLinecap="round" /> : null;
    };
    return (
      <g transform={'translate(0 ' + dy.toFixed(1) + ')'}>
        <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={'#ffffff'} strokeWidth={84} opacity={aro} />
        <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={C.GRY} strokeWidth={84} opacity={aro * 0.6} />
        <circle cx={c[0]} cy={c[1]} r={r + 44} fill="none" stroke={C.INK} strokeWidth={11} opacity={aro} />
        <circle cx={c[0]} cy={c[1]} r={r - 44} fill="none" stroke={C.INK} strokeWidth={11} opacity={aro} />
        {p > 0.01 ? <path d={arco(0, Math.min(p, 0.2))} fill="none" stroke={C.YEL} strokeWidth={84} /> : null}
        {p > 0.2 ? <path d={arco(0.2, p)} fill="none" stroke={C.GRN} strokeWidth={84} /> : null}
        {marca(0.2, 'a')}
        {marca(0.35, 'b')}
      </g>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: '¿Para qué sirven realmente las grasas?',
      C: E3.charla({
        gesto: 'duda', lado: 'izq', cara: { boca: 'o', cejas: 'alzadas' },
        piezas: [{ C: N.COMIDA.aguacate, s: 1.05, x: 640, y: 470, cuando: 0.1 }, { C: N.COMIDA.aceite, s: 1.05, x: 680, y: 840, cuando: 0.3 }],
        r1: { text: '¿PARA QUÉ SIRVEN LAS *GRASAS*?', s: 0.88, cuando: 0.02 }
      }) },

    { nombre: 'Función', dur: 5.5, vo: 'Las grasas te ayudan a producir hormonas y a absorber las vitaminas A, D, E y K.',
      C: E3.charla({
        gesto: 'senala', lado: 'izq',
        piezas: [
          { C: N.ICONOS.hormona, s: 1.2, x: 620, y: 400, cuando: 0.12 },
          { C: N.ICONOS.capsula, s: 0.8, x: 560, y: 860, cuando: 0.5 },
          { C: N.ICONOS.capsula, s: 0.8, x: 790, y: 860, cuando: 0.56, p: { color: C.GRN } },
          { C: N.ICONOS.capsula, s: 0.8, x: 560, y: 1080, cuando: 0.62, p: { color: C.GRY } },
          { C: N.ICONOS.capsula, s: 0.8, x: 790, y: 1080, cuando: 0.68 }
        ],
        r1: { text: '*HORMONAS*', s: 1.15, cuando: 0.1 },
        r2: { text: 'VITAMINAS *A, D, E Y K*', cuando: 0.5 }
      }) },

    { nombre: 'Más', dur: 6, vo: 'Te dan energía de larga duración, protegen tus órganos y mantienen tu temperatura corporal en óptimas condiciones.',
      C: E3.charla({
        gesto: 'explica', lado: 'izq',
        piezas: [
          { C: P.Medidor, s: 1.2, x: 580, y: 420, p: function (T, f) { return { p: animate({ from: 0.3, to: 1, start: f(0.06), end: f(0.3) })(T) }; } },
          { C: N.ICONOS.escudo, s: 1.1, x: 560, y: 760, cuando: 0.4 },
          { C: N.ICONOS.termometro, s: 1.1, x: 790, y: 1020, cuando: 0.66 }
        ],
        r1: { text: 'ENERGÍA *DURADERA*', cuando: 0.06 },
        r2: { text: 'ÓRGANOS Y *TEMPERATURA*', cuando: 0.5 }
      }) },

    { nombre: 'Fuentes', dur: 6, vo: 'Puedes encontrar las grasas en aguacate, aceite de oliva, frutos secos, semillas, pescados grasos y lácteos enteros.',
      C: E3.charla({
        gesto: 'senala', zona: [20, 400, 470, 1480],
        piezas: grilla([['aguacate', 0.12], ['aceite', 0.24], ['frutosSecos', 0.4], ['semillas', 0.52], ['pescado', 0.64], ['leche', 0.8]]),
        r1: { text: 'FUENTES DE *GRASA*', cuando: 0.02 }
      }) },

    { nombre: 'Cuánta', dur: 5.5, vo: 'Tus grasas deben representar entre el 20 y el 35 % de tus calorías por día.',
      C: E3.charla({
        gesto: 'senala', lado: 'izq', ocupa: [[540, 650, 1040, 1150]],
        lienzo: anillo,
        piezas: [{ C: N.COMIDA.aguacate, s: 0.62, x: 696, y: 826, cuando: 0.08, libre: true }],
        bien: [{ x: 880, y: 1180, cuando: 0.56, s: 0.5 }],
        r1: { text: '*20 A 35 %*', s: 1.3, cuando: 0.16 },
        r2: { text: 'DE TUS *CALORÍAS*', cuando: 0.5 }
      }) },

    { nombre: 'Cuáles', dur: 6, vo: 'Prioriza el consumo de grasas insaturadas y evita el exceso de grasas trans y saturadas.',
      C: E3.charla({
        gesto: 'explica', zona: [20, 400, 430, 1480],
        piezas: [
          plato('aguacate', 470, 380, null), plato('aceite', 780, 380, 0.06), plato('pescado', 625, 640, 0.12),
          plato('fritas', 470, 1000, 0.42, 0.72, { vibra: true }), plato('hamburguesa', 780, 1000, 0.48, 0.72, { vibra: true })
        ],
        bien: [{ x: 900, y: 660, cuando: 0.3, s: 0.5 }],
        mal: [{ x: 900, y: 1250, cuando: 0.62, s: 0.5 }],
        r1: { text: 'PRIORIZA *INSATURADAS*', cuando: 0.04, tono: 'verde' },
        r2: { text: 'EXCESO DE *TRANS*', cuando: 0.5, tono: 'rojo' }
      }) },

    { nombre: 'Cierre', dur: 3.5, vo: 'Siempre prioriza el consumo de grasas buenas, sin ningún miedo.',
      C: E3.charla({
        gesto: 'flex', lado: 'izq', flex: function (T, f) { return 0.55 + 0.45 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T)); },
        musc: { biceps: true, brillo: 0.3 },
        piezas: [{ C: N.COMIDA.aguacate, s: 1.1, x: 640, y: 560, cuando: 0.2 }],
        bien: [{ x: 860, y: 440, cuando: 0.5, s: 0.7 }],
        r1: { text: 'GRASAS *BUENAS*', s: 1.1, cuando: 0.1 },
        r2: { text: 'SIN *MIEDO*', s: 1.1, cuando: 0.4, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'grasas-3d', escenario: 'super', titulo: 'Grasas (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LO SABÍAS?', vo: '¿Lo sabías? Coméntalo, compártelo y guárdalo.' }
  });
})(window);
