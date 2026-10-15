/* ============================================================
   GRASAS — reel corto de nutricion con Tor (~34 s con el cierre)
   Fuente: libro, seccion de nutricion. Funcion: hormonas, absorcion de
   vitaminas liposolubles (A, D, E, K), energia a largo plazo, proteger
   organos y mantener la temperatura. Fuentes: aguacate, aceite de oliva,
   frutos secos, semillas, pescados grasos y lacteos enteros.
   Recomendacion: 20 a 35 % de las calorias del dia, priorizando las
   insaturadas y evitando el exceso de trans y saturadas.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, PL = global.PL;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;

  var FIG = PL.FIG;

  // anillo de las calorias del dia: la parte de las grasas (20 a 35 %)
  function anillo(T, f) {
    var c = [540, 930], r = 250;
    var p = animate({ from: 0, to: 0.35, start: f(0.16), end: f(0.5), ease: Easing.easeInOutCubic })(T);
    var punto = function (frac, rr) { var a = (-90 + 360 * frac) * Math.PI / 180; return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]; };
    var arco = function (a0, a1) {
      var p0 = punto(a0, r), p1 = punto(a1, r);
      return 'M ' + U.pt(p0) + ' A ' + r + ' ' + r + ' 0 ' + (a1 - a0 > 0.5 ? 1 : 0) + ' 1 ' + U.pt(p1);
    };
    var aro = M.draw(T, f(0) - 0.6, 0.5);
    var marca = function (frac, k) {
      var a = punto(frac, r - 66), b = punto(frac, r + 66);
      return p >= frac - 0.005 ? <path key={k} d={'M ' + U.pt(a) + ' L ' + U.pt(b)} stroke={C.INK} strokeWidth={14} strokeLinecap="round" /> : null;
    };
    return (
      <g>
        <circle cx={c[0]} cy={c[1]} r={r} fill="none" stroke={C.GRY} strokeWidth={96} opacity={aro} />
        <circle cx={c[0]} cy={c[1]} r={r + 50} fill="none" stroke={C.INK} strokeWidth={12} opacity={aro} />
        <circle cx={c[0]} cy={c[1]} r={r - 50} fill="none" stroke={C.INK} strokeWidth={12} opacity={aro} />
        {p > 0.01 ? <path d={arco(0, Math.min(p, 0.2))} fill="none" stroke={C.YEL} strokeWidth={96} /> : null}
        {p > 0.2 ? <path d={arco(0.2, p)} fill="none" stroke={C.GRN} strokeWidth={96} /> : null}
        {marca(0.2, 'a')}
        {marca(0.35, 'b')}
      </g>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás evitando las grasas.',
      C: PL.escena({
        tor: { boca: 'triste', vibra: true, x: FIG.x - 170, y: FIG.y - 30 },
        piezas: [
          { C: N.COMIDA.aguacate, s: 1, x: 760, y: 540, cuando: 0.06 },
          { C: N.COMIDA.aceite, s: 1, x: 760, y: 880, cuando: 0.14 }
        ],
        mal: [{ x: 810, y: 470, cuando: 0.22, s: 0.6 }, { x: 810, y: 820, cuando: 0.42, s: 0.6 }],
        r1: { text: 'GRASAS', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Función', dur: 5, vo: 'Las grasas te ayudan a producir hormonas y a absorber las vitaminas A, D, E y K.',
      C: PL.escena({
        piezas: [
          { C: N.COMIDA.aceite, s: 1.5, x: 360, y: 370 },
          { C: N.ICONOS.hormona, s: 1.5, x: 20, y: 900, cuando: 0.22 },
          { C: N.ICONOS.capsula, s: 0.95, x: 560, y: 890, cuando: 0.55 },
          { C: N.ICONOS.capsula, s: 0.95, x: 800, y: 890, cuando: 0.6, p: { color: C.GRN } },
          { C: N.ICONOS.capsula, s: 0.95, x: 560, y: 1120, cuando: 0.65, p: { color: C.GRY } },
          { C: N.ICONOS.capsula, s: 0.95, x: 800, y: 1120, cuando: 0.7 }
        ],
        lienzo: function (T, f) {
          return (
            <g>
              <B.FlechaS a={[450, 740]} b={[230, 920]} color={C.YEL} sw={20} p={M.draw(T, f(0.12), 0.4)} />
              <B.FlechaS a={[630, 740]} b={[800, 900]} color={C.YEL} sw={20} p={M.draw(T, f(0.46), 0.4)} />
            </g>
          );
        },
        r1: { text: 'HORMONAS', s: 1.2, cuando: 0.2 },
        r2: { text: 'VITAMINAS A, D, E, K', cuando: 0.55 }
      }) },

    { nombre: 'Más', dur: 5, vo: 'Te dan energía de larga duración, protegen tus órganos y mantienen tu temperatura.',
      C: PL.escena({
        piezas: [
          { C: P.Medidor, s: 2, x: 240, y: 430, p: function (T, f) { return { p: animate({ from: 0.3, to: 1, start: f(0.06), end: f(0.3) })(T) }; } },
          { C: N.ICONOS.escudo, s: 1.5, x: 60, y: 820, cuando: 0.42 },
          { C: P.Corazon, s: 1.9, x: 136, y: 912, cuando: 0.46, quieto: true,
            p: function (T) { return { beat: 1 + 0.06 * Math.max(0, Math.sin(T * Math.PI * 2 / 0.9)) }; } },
          { C: N.ICONOS.termometro, s: 1.5, x: 640, y: 820, cuando: 0.68 }
        ],
        r1: { text: 'ENERGÍA DURADERA', cuando: 0.08 },
        r2: { text: 'PROTEGEN Y ABRIGAN', cuando: 0.5 }
      }) },

    { nombre: 'Fuentes', dur: 6, vo: 'Las encuentras en aguacate, aceite de oliva, frutos secos, semillas, pescados grasos y lácteos enteros.',
      C: PL.escena({
        piezas: PL.grilla([['aguacate', 0.14], ['aceite', 0.26], ['frutosSecos', 0.42], ['semillas', 0.54],
          ['pescado', 0.66], ['leche', 0.82]], { y0: 520, paso: 330 }),
        r1: { text: 'FUENTES DE GRASA' }
      }) },

    { nombre: 'Cuánta', dur: 5.5, vo: 'Deben ser entre el 20 y el 35 % de tus calorías del día.',
      C: PL.escena({
        lienzo: anillo,
        piezas: [{ C: N.COMIDA.aguacate, s: 0.9, x: 432, y: 822, cuando: 0.08 }],
        bien: [{ x: 850, y: 600, cuando: 0.56 }],
        r1: { text: '20 A 35 %', s: 1.35, cuando: 0.16 },
        r2: { text: 'DE TUS CALORÍAS', cuando: 0.5 }
      }) },

    { nombre: 'Cuáles', dur: 5, vo: 'Prioriza las insaturadas y evita el exceso de trans y saturadas.',
      C: PL.escena({
        piezas: [
          { C: N.COMIDA.fritas, s: 1, plato: 0.75, x: 150, y: 370, vibra: true },
          { C: N.COMIDA.hamburguesa, s: 1, plato: 0.75, x: 540, y: 370, vibra: true },
          { C: N.COMIDA.aguacate, s: 0.9, plato: 0.68, x: 40, y: 900, cuando: 0.3 },
          { C: N.COMIDA.aceite, s: 0.9, plato: 0.68, x: 397, y: 900, cuando: 0.36 },
          { C: N.COMIDA.pescado, s: 0.9, plato: 0.68, x: 754, y: 900, cuando: 0.42 }
        ],
        mal: [{ x: 880, y: 320, cuando: 0.14, s: 0.5 }],
        bien: [{ x: 880, y: 1240, cuando: 0.6 }],
        r1: { text: 'EXCESO DE TRANS', y: 230, s: 1, cuando: 0.04 },
        r2: { text: 'PRIORIZA INSATURADAS', y: 1500, s: 1, cuando: 0.36 }
      }) },

    { nombre: 'Cierre', dur: 2.5, vo: 'Grasas buenas, sin miedo.',
      C: PL.escena({
        tor: {
          flex: function (T, f) { return 0.55 + 0.45 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T)); },
          boca: 'sonrisa', musc: { bic: 1 }
        },
        bien: [{ x: 800, y: 820, cuando: 0.32, s: 0.85 }],
        r1: { text: 'GRASAS BUENAS', cuando: 0.1 },
        r2: { text: 'SIN MIEDO', cuando: 0.4 }
      }) }
  ];

  global.REELS.registrar({ id: 'grasas', titulo: 'Grasas (nutrición)', escenas: ESCENAS });
})(window);
