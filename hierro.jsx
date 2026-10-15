/* ============================================================
   HIERRO — reel corto de nutricion con Tor (~34 s con el cierre)
   Fuente: libro, seccion de nutricion. Funcion: transporte de oxigeno en
   la sangre (hemoglobina) y en el musculo (mioglobina); energia y
   defensas. Fuentes: carnes rojas, aves, pescados, legumbres, espinaca,
   tofu y alimentos fortificados.
   ============================================================ */
(function (global) {
  'use strict';

  var M = global.M, P = global.P, N = global.N, PL = global.PL;
  var animate = global.animate, Easing = global.Easing;
  var React = global.React;

  var FIG = PL.FIG;

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás ignorando el hierro.',
      C: PL.escena({
        tor: { boca: 'triste', vibra: true, y: FIG.y - 30 },
        piezas: [{ C: P.Medidor, p: function (T) { return { p: 0.14, shake: M.vibra(T, 30, 3) }; }, s: 1.05, x: 382, y: 1360, cuando: 0.08 }],
        mal: [{ x: 740, y: 1330, cuando: 0.22, s: 0.6 }, { x: 70, y: 700, cuando: 0.42, s: 0.5 }],
        r1: { text: 'HIERRO', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Sangre', dur: 5.5, vo: 'El hierro forma la hemoglobina, que lleva el oxígeno por tu sangre.',
      C: PL.escena({
        piezas: [{ C: P.Corazon, s: 2.6, x: 397, y: 380, quieto: true,
          p: function (T) { return { beat: 1 + 0.08 * Math.max(0, Math.sin(T * Math.PI * 2 / 0.9)) }; } }],
        lienzo: function (T, f) { return PL.sangre(T, f, { y: 1030, alto: 400, n: 4, o2: 3 }); },
        r1: { text: 'HEMOGLOBINA', s: 1.2, cuando: 0.08 },
        r2: { text: 'OXÍGENO EN LA SANGRE', cuando: 0.5 }
      }) },

    { nombre: 'Músculo', dur: 5, vo: 'Y la mioglobina, que lleva el oxígeno dentro de tus músculos.',
      C: PL.escena({
        camara: { zoom: 1.5, foco: [72 + 600 * 0.78, 166 + 600 * 0.78], mira: [540, 900] },
        tor: {
          flex: function (T, f) { return 0.86 + 0.14 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.55), end: f(0.75) })(T)); },
          musc: function (T, f) { return { bic: animate({ from: 0, to: 1, start: f(0.4), end: f(0.62) })(T) }; },
          boca: function (T, f) { return T > f(0.55) ? 'sonrisa' : null; },
          extra: function (g, T, f) { return PL.alBiceps(g, animate({ from: 0, to: 1, start: f(0.12), end: f(0.5) })(T), 'bola'); }
        },
        bien: [{ x: 850, y: 430, cuando: 0.7 }],
        r1: { text: 'MIOGLOBINA', s: 1.2, cuando: 0.08 },
        r2: { text: 'OXÍGENO EN EL MÚSCULO', cuando: 0.5 }
      }) },

    { nombre: 'Energía', dur: 4.5, vo: 'También te ayuda a producir energía y a tus defensas.',
      C: PL.escena({
        piezas: [
          { C: P.Bombillo, s: 1.6, x: 380, y: 360, p: function (T, f) { return { on: animate({ from: 0, to: 1, start: f(0.18), end: f(0.34) })(T) }; } },
          { C: N.ICONOS.escudo, s: 1.6, x: 348, y: 900, cuando: 0.5 }
        ],
        r1: { text: 'ENERGÍA', s: 1.2, cuando: 0.1 },
        r2: { text: 'DEFENSAS', s: 1.2, cuando: 0.5 }
      }) },

    { nombre: 'Fuentes', dur: 6, vo: 'Está en carnes rojas, aves, pescados, legumbres, espinaca, tofu y alimentos fortificados.',
      C: PL.escena({
        piezas: PL.grilla([['carne', 0.12], ['pollo', 0.25], ['pescado', 0.35], ['legumbres', 0.46],
          ['espinaca', 0.58], ['tofu', 0.68], ['cereal', 0.8]]),
        r1: { text: 'FUENTES DE HIERRO' }
      }) },

    { nombre: 'Sin hierro', dur: 4.5, vo: 'Con poco hierro, tus músculos reciben menos oxígeno.',
      C: PL.escena({
        tor: [
          { s: 0.38, x: 180, y: 196, boca: 'triste', vibra: true },
          { s: 0.38, x: 180, y: 816, flex: 1, boca: 'sonrisa', musc: { bic: 1 }, cuando: 0.3 }
        ],
        piezas: [
          { C: P.Medidor, s: 0.9, x: 640, y: 470, p: function (T) { return { p: 0.15, shake: M.vibra(T, 30, 3) }; } },
          { C: P.Medidor, s: 0.9, x: 640, y: 1090, cuando: 0.32, p: function (T, f) { return { p: animate({ from: 0.2, to: 1, start: f(0.34), end: f(0.6) })(T) }; } }
        ],
        mal: [{ x: 880, y: 300, cuando: 0.14, s: 0.5 }],
        bien: [{ x: 880, y: 920, cuando: 0.6 }],
        r1: { text: 'POCO HIERRO', y: 230, s: 1, cuando: 0.04 },
        r2: { text: 'HIERRO SUFICIENTE', y: 1500, s: 1, cuando: 0.36 }
      }) },

    { nombre: 'Cierre', dur: 2.5, vo: 'Hierro en tu plato, todos los días.',
      C: PL.escena({
        tor: {
          flex: function (T, f) { return 0.55 + 0.45 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T)); },
          boca: 'sonrisa', musc: { bic: 1 }
        },
        bien: [{ x: 800, y: 820, cuando: 0.32, s: 0.85 }],
        r1: { text: 'HIERRO EN TU PLATO', cuando: 0.1 },
        r2: { text: 'TODOS LOS DÍAS', cuando: 0.4 }
      }) }
  ];

  global.REELS.registrar({ id: 'hierro', titulo: 'Hierro (nutrición)', escenas: ESCENAS });
})(window);
