/* ============================================================
   HIERRO — TOR EN 3D, EN LA COCINA (el guion como lo grabo Victor)
   Para que sirve: forma la hemoglobina (lleva el oxigeno por la sangre) y la
   mioglobina (lo lleva dentro del musculo); ayuda a producir energia y a las
   defensas. Fuentes: carnes rojas, aves, pescados, legumbres, espinaca, tofu
   y alimentos fortificados. Con poco hierro, el musculo recibe menos oxigeno.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, N = global.N, V = global.V, PL = global.PL, E3 = global.E3;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = P.C;

  // comida en su plato (la pieza mide 252 px con plato 0.6)
  function plato(nombre, x, y, cuando, s) { return { C: N.COMIDA[nombre], s: s || 0.8, plato: 0.6, x: x, y: y, cuando: cuando }; }
  // la grilla de la derecha: dos columnas, la ultima sola al medio
  function grilla(lista) {
    return lista.map(function (q, i) {
      var fila = Math.floor(i / 2), sola = i === lista.length - 1 && i % 2 === 0;
      return plato(q[0], sola ? 615 : (i % 2 ? 790 : 500), 360 + fila * 262, q[1], 0.72);
    });
  }
  // globulos rojos que vuelan hasta el musculo (oxigeno)
  function alMusculo(T, f, destinos, a, b) {
    var out = [];
    destinos.forEach(function (d, j) {
      for (var i = 0; i < 4; i++) {
        var u = ((T - f(a)) / 0.9 + i / 4) % 1;
        if (T < f(a) || T > f(b)) continue;
        var ang = (j ? -30 : 210) + i * 28, R = 360 * (1 - Easing.easeInCubic(u));
        var x = d[0] + Math.cos(ang * Math.PI / 180) * R, y = d[1] + Math.sin(ang * Math.PI / 180) * R;
        out.push(<g key={j + '-' + i} opacity={1 - u * u}>
          <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={24} fill={C.RED} stroke={C.INK} strokeWidth={8} />
          <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={8} fill={'#ffffff'} />
        </g>);
      }
    });
    return <g>{out}</g>;
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: '¿Para qué sirve realmente el hierro?',
      C: E3.charla({
        gesto: 'duda', lado: 'izq', cara: { boca: 'o', cejas: 'alzadas' },
        piezas: [plato('carne', 640, 470, 0.1), plato('espinaca', 680, 820, 0.3)],
        r1: { text: '¿PARA QUÉ SIRVE EL *HIERRO*?', s: 0.92, cuando: 0.02 }
      }) },

    { nombre: 'Sangre', dur: 5.5, vo: 'El hierro forma la hemoglobina, aquel que lleva el oxígeno por tu sangre.',
      C: E3.charla({
        gesto: 'senala', lado: 'izq', zona: [30, 370, 520, 1080],
        piezas: [{ C: P.Corazon, s: 2.0, x: 640, y: 420, quieto: true,
          p: function (T) { return { beat: 1 + 0.08 * Math.max(0, Math.sin(T * Math.PI * 2 / 0.9)) }; } }],
        lienzo: function (T, f) { return PL.sangre(T, f, { y: 1250, alto: 240, n: 4, o2: 3, desde: 0.2 }); },
        r1: { text: '*HEMOGLOBINA*', s: 1.1, cuando: 0.06 },
        r2: { text: 'OXÍGENO EN LA *SANGRE*', cuando: 0.5 }
      }) },

    { nombre: 'Músculo', dur: 5, vo: 'El hierro también forma la mioglobina, aquel que lleva el oxígeno dentro de tus músculos.',
      C: E3.charla({
        gesto: 'flex', flex: function (T, f) { return 0.6 + 0.4 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T)); },
        musc: function (T, f) { return T > f(0.4) ? { biceps: true, brillo: 0.35 } : null; },
        tomas: [[0, { az: 14, el: 6, dist: 4.4, y: 1.4 }], [1, { az: 4, el: 4, dist: 5.4, y: 1.3 }]],
        lienzo: function (T, f, t, pr) {
          return <g>{alMusculo(T, f, [pr('m:biceps:0'), pr('m:biceps:1')], 0.1, 0.62)}{E3.brilla(T, pr, ['m:biceps:0', 'm:biceps:1'], clamp((T - f(0.4)) / (f(0.55) - f(0.4)), 0, 1), true, 80)}</g>;
        },
        bien: [{ x: 850, y: 430, cuando: 0.7 }],
        r1: { text: '*MIOGLOBINA*', s: 1.1, cuando: 0.06 },
        r2: { text: 'OXÍGENO EN EL *MÚSCULO*', cuando: 0.5 }
      }) },

    { nombre: 'Energía', dur: 4.5, vo: 'El hierro también te ayuda a producir energía y a mejorar tus defensas.',
      C: E3.charla({
        gesto: 'senala', lado: 'izq',
        piezas: [
          { C: P.Bombillo, s: 1.4, x: 620, y: 400, p: function (T, f) { return { on: animate({ from: 0, to: 1, start: f(0.16), end: f(0.32) })(T) }; } },
          { C: N.ICONOS.escudo, s: 1.4, x: 640, y: 900, cuando: 0.5 }
        ],
        r1: { text: '*ENERGÍA*', s: 1.15, cuando: 0.1 },
        r2: { text: 'Y *DEFENSAS*', s: 1.1, cuando: 0.5 }
      }) },

    { nombre: 'Fuentes', dur: 6, vo: 'Puedes encontrarlo en carnes rojas, aves, pescados, legumbres, espinaca, tofu y alimentos fortificados.',
      C: E3.charla({
        gesto: 'senala', zona: [20, 400, 470, 1480],
        piezas: grilla([['carne', 0.08], ['pollo', 0.2], ['pescado', 0.3], ['legumbres', 0.42], ['espinaca', 0.54], ['tofu', 0.64], ['cereal', 0.76]]),
        r1: { text: 'FUENTES DE *HIERRO*', cuando: 0.02 }
      }) },

    { nombre: 'Sin hierro', dur: 4.5, vo: 'Recuerda, con poco hierro, tus músculos reciben menos oxígeno.',
      C: E3.charla({
        gesto: 'cansado', lado: 'izq', vibra: true, cara: { boca: 'triste', cejas: 'triste' },
        musc: { biceps: 'rojo', pecho: 'rojo' },
        piezas: [{ C: P.Medidor, s: 1.05, x: 600, y: 760, p: function (T) { return { p: 0.14, shake: M.vibra(T, 30, 3) }; } }],
        lienzo: function (T, f, t, pr) { return <V.Gotas T={T} c={pr('cabeza')} v={1} />; },
        mal: [{ x: 820, y: 420, cuando: 0.2, s: 0.55 }],
        r1: { text: 'POCO *HIERRO*', s: 1.1, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'MENOS *OXÍGENO*', cuando: 0.5, tono: 'rojo' }
      }) },

    { nombre: 'Cierre', dur: 3.5, vo: 'Trata de incluir todos los días un poco de hierro en tus comidas.',
      C: E3.charla({
        gesto: 'flex', lado: 'izq', flex: function (T, f) { return 0.55 + 0.45 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T)); },
        musc: { biceps: true, brillo: 0.3 },
        piezas: [plato('carne', 600, 520, 0.2), plato('legumbres', 760, 860, 0.32), plato('espinaca', 560, 1080, 0.44)],
        bien: [{ x: 860, y: 400, cuando: 0.5, s: 0.7 }],
        r1: { text: 'HIERRO EN TU *PLATO*', cuando: 0.1 },
        r2: { text: 'TODOS LOS *DÍAS*', cuando: 0.4, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'hierro-3d', escenario: 'cocina', titulo: 'Hierro (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LO SABÍAS?', vo: '¿Lo sabías? Coméntalo, compártelo y guárdalo.' }
  });
})(window);
