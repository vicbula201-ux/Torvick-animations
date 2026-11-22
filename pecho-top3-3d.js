/* GENERADO por compilar.js desde pecho-top3-3d.jsx — no editar a mano. */
/* ============================================================
   TOP 3 PECHO SEGUN LA CIENCIA — TOR EN 3D (mismo guion que pecho-top3.jsx)
   1. Press de banca con mancuernas (recorrido completo: Pallares y cols., 2021).
   2. Press inclinado a ~30° (pecho alto: Rodriguez-Ridao y cols., 2020).
   3. Fondos en paralelas con el tronco adelante.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var E3 = global.E3;
  var Easing = global.Easing,
    clamp = global.clamp;
  var PECHO = ['m:pecho:0', 'm:pecho:1'];
  function lado(p, s, mano, codo) {
    var L = s < 0 ? 'I' : 'D';
    p['mano' + L] = mano;
    p['codo' + L] = codo;
  }

  /* 1. banca plana con mancuernas: k 0 abajo (pecho estirado) .. 1 arriba */
  function banca(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var p = {
      cadera: [0, 0.64, 0.38],
      tronco: [-90, 0, 0],
      pieI: [-0.32, 0.115, 0.86],
      pieD: [0.32, 0.115, 0.86]
    };
    [-1, 1].forEach(function (s) {
      lado(p, s, E3.lerp3([s * 0.52, 0.8, -0.16], [s * 0.24, 1.44, -0.18], e), [0.7, 0, -1]);
    });
    return p;
  }
  /* 2. inclinado a 30° */
  function inclinado(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var p = {
      cadera: [0, 0.64, 0.09],
      tronco: [-60, 0, 0],
      pieI: [-0.32, 0.115, 0.78],
      pieD: [0.32, 0.115, 0.78],
      cabeza: [-6, 0, 0]
    };
    [-1, 1].forEach(function (s) {
      lado(p, s, E3.lerp3([s * 0.52, 1.06, -0.36], [s * 0.24, 1.66, -0.12], e), [0.7, 0, -1]);
    });
    return p;
  }
  /* 3. fondos: las manos en las barras; k 0 abajo (tronco adelante) .. 1 arriba */
  function fondos(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var a = (30 - 22 * e) * Math.PI / 180;
    var sc = E3.lerp3([0, 1.64, 0.12], [0, 2.02, 0.02], e);
    var cad = [0, sc[1] - Math.cos(a) * 0.565, sc[2] - Math.sin(a) * 0.565];
    var p = {
      cadera: cad,
      tronco: [a * 180 / Math.PI, 0, 0],
      cabeza: [-10, 0, 0],
      pieI: [-0.1, cad[1] - 0.62, cad[2] - 0.42],
      pieD: [0.1, cad[1] - 0.66, cad[2] - 0.36],
      pies: [60, 60]
    };
    [-1, 1].forEach(function (s) {
      lado(p, s, [s * 0.3, 1.28, 0.04], [0.15, 0, -1]);
    });
    return p;
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Los 3 mejores ejercicios de pecho según la ciencia.',
    C: E3.gancho({
      musculo: 'PECHO',
      musc: {
        pecho: true,
        deltoides: 'claro'
      },
      brillo: PECHO,
      flex: 0.75
    })
  }, {
    nombre: '1. Press de banca',
    dur: 2.2,
    vo: 'Uno: press de banca con mancuernas, bajando bien.',
    C: E3.ejercicio({
      n: 1,
      r1: 'PRESS DE *BANCA*',
      r2: 'BAJA HASTA *ESTIRAR*',
      brillo: PECHO,
      tomas: [[0, {
        az: 58,
        el: 18,
        dist: 6.0,
        y: 0.75,
        dz: 0.05
      }], [1, {
        az: 40,
        el: 22,
        dist: 4.6,
        y: 0.8,
        dz: -0.1
      }]],
      vista: function (T, f, k, kEn) {
        return {
          figuras: [{
            quien: 'tor',
            pose: banca(k),
            pesas: 'prono',
            fantasmas: E3.fantasmas(banca, kEn, k),
            musc: {
              pecho: true,
              deltoides: 'gris',
              triceps: 'gris',
              brillo: 0.3 * k
            },
            cara: {
              boca: k > 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: [{
            tipo: 'banco',
            p: [0, 0, 0],
            largo: 1.25,
            alto: 0.45
          }]
        };
      }
    })
  }, {
    nombre: '2. Press inclinado',
    dur: 2.2,
    vo: 'Dos: press inclinado, para la parte alta del pecho.',
    C: E3.ejercicio({
      n: 2,
      r1: 'PRESS *INCLINADO*',
      r2: 'PECHO *ALTO*',
      brillo: PECHO,
      tomas: [[0, {
        az: 62,
        el: 12,
        dist: 6.2,
        y: 0.95,
        dz: -0.05
      }], [1, {
        az: 44,
        el: 14,
        dist: 4.8,
        y: 1.05,
        dz: -0.15
      }]],
      vista: function (T, f, k, kEn) {
        return {
          figuras: [{
            quien: 'tor',
            pose: inclinado(k),
            pesas: 'prono',
            fantasmas: E3.fantasmas(inclinado, kEn, k),
            musc: {
              pecho: true,
              deltoides: 'claro',
              triceps: 'gris',
              brillo: 0.3 * k
            },
            cara: {
              boca: k > 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: [{
            tipo: 'banco',
            p: [0, 0, 0.2],
            largo: 0.45,
            alto: 0.45,
            respaldo: {
              ang: 30,
              largo: 1.15
            }
          }]
        };
      }
    })
  }, {
    nombre: '3. Fondos',
    dur: 2.2,
    vo: 'Tres: fondos en paralelas, con el pecho adelante.',
    C: E3.ejercicio({
      n: 3,
      r1: '*FONDOS*',
      r2: 'PECHO *ADELANTE*',
      brillo: PECHO,
      tomas: [[0, {
        az: 48,
        el: 4,
        dist: 7.8,
        y: 1.45,
        dz: 0
      }], [1, {
        az: 34,
        el: 2,
        dist: 6.4,
        y: 1.62,
        dz: 0
      }]],
      vista: function (T, f, k) {
        return {
          figuras: [{
            quien: 'tor',
            pose: fondos(k),
            musc: {
              pecho: true,
              triceps: 'gris',
              deltoides: 'claro',
              brillo: 0.3 * k
            },
            cara: {
              boca: k > 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: [{
            tipo: 'paralelas',
            p: [0, 0, 0],
            alto: 1.22,
            sep: 0.6
          }]
        };
      }
    })
  }];
  global.REELS.registrar({
    id: 'pecho-top3-3d',
    titulo: 'Top 3 pecho (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.3,
      vo: '¿Estás de acuerdo? Coméntalo, compártelo y guárdalo.'
    }
  });
})(window);
