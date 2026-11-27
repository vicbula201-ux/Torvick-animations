/* GENERADO por compilar.js desde abdominales-top3-3d.jsx — no editar a mano. */
/* ============================================================
   TOP 3 ABDOMINALES SEGUN LA CIENCIA — TOR EN 3D (mismo guion que abdominales-top3.jsx)
   1. Abdominal en polea: se le puede subir el peso (sobrecarga progresiva, ACSM 2009).
   2. Elevacion de piernas colgado y 3. rueda abdominal: de los de mas
      activacion del recto y los oblicuos (Escamilla y cols., 2006).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var E3 = global.E3,
    PZ = global.PIEZAS3D;
  var Easing = global.Easing,
    clamp = global.clamp;
  var ABD = ['m:abdomen'];
  var RAD = Math.PI / 180;

  /* 2. colgado de la barra: k 0 piernas abajo .. 1 piernas al frente (90°) */
  function colgado(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var cad = [0, 1.315 + 0.04 * e, 0.0];
    var a = 88 * e * RAD;
    var p = {
      cadera: cad,
      tronco: [-12 * e, 0, 0],
      cabeza: [6 * e, 0, 0],
      pies: [70 - 100 * e, 70 - 100 * e],
      manoI: [-0.3, 2.64, 0.0],
      manoD: [0.3, 2.64, 0.0],
      codoI: [1, 0, 0],
      codoD: [1, 0, 0]
    };
    [-1, 1].forEach(function (s) {
      var hy = cad[1] - 0.04,
        L = s < 0 ? 'I' : 'D';
      p['pie' + L] = [s * 0.13, hy - 0.86 * Math.cos(a), cad[2] + 0.86 * Math.sin(a)];
    });
    return p;
  }
  /* 3. rueda abdominal, de rodillas: k 0 estirado (la rueda lejos) .. 1 la cadera atras */
  function rueda(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var a = (45 - 45 * e) * RAD,
      pit = (84 - 22 * e) * RAD;
    var d = [0, Math.cos(pit), Math.sin(pit)];
    var hy = 0.075 + 0.43 * Math.cos(a),
      hz = 0.05 + 0.43 * Math.sin(a);
    var zW = 1.55 - 0.83 * e;
    var polo = [0.1, -Math.cos(pit) + 0.3 * Math.sin(pit), Math.sin(pit) + 0.3 * Math.cos(pit)];
    return {
      cadera: [0, hy + d[1] * 0.04, hz + d[2] * 0.04],
      tronco: [pit / RAD, 0, 0],
      cabeza: [14, 0, 0],
      pieI: [-0.155, 0.1, -0.36],
      pieD: [0.155, 0.1, -0.36],
      pies: [160, 160],
      rodillaI: polo,
      rodillaD: polo,
      manoI: [-0.12, 0.15, zW],
      manoD: [0.12, 0.15, zW],
      codoI: [0.3, -0.4, -1],
      codoD: [0.3, -0.4, -1],
      zW: zW
    };
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Top 3 ejercicios de abdominales según la ciencia.',
    C: E3.gancho({
      musculo: 'ABDOMINALES',
      s1: 1.0,
      musc: {
        abdomen: true,
        oblicuos: 'claro'
      },
      brillo: ABD,
      r: 120,
      flex: 0.6
    })
  }, {
    nombre: '1. Abdominal en polea',
    dur: 2.2,
    vo: 'Uno, abdominal en polea.',
    C: E3.ejercicio({
      n: 1,
      r1: 'ABDOMINAL EN *POLEA*',
      r2: 'CON *PESO*',
      brillo: ABD,
      r: 100,
      s1: 1.0,
      tomas: [[0, {
        az: 60,
        el: 6,
        dist: 6.8,
        y: 1.15,
        dz: -0.15
      }], [1, {
        az: 42,
        el: 4,
        dist: 5.4,
        y: 1.1,
        dz: 0
      }]],
      vista: function (T, f, k) {
        return {
          figuras: [{
            quien: 'tor',
            pose: PZ.abdominalPolea.pose(k, 0),
            musc: {
              abdomen: true,
              oblicuos: 'claro',
              brillo: 0.3 * k
            },
            cara: {
              boca: k > 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: [PZ.abdominalPolea.polea(k, 0)]
        };
      }
    })
  }, {
    nombre: '2. Elevación de piernas',
    dur: 2.2,
    vo: 'Dos. Elevación de piernas colgado de la barra.',
    C: E3.ejercicio({
      n: 2,
      r1: 'ELEVACIÓN DE *PIERNAS*',
      r2: 'SIN *BALANCEO*',
      brillo: ABD,
      r: 100,
      s1: 0.95,
      tomas: [[0, {
        az: 72,
        el: 2,
        dist: 8.2,
        y: 1.5,
        dz: 0.1
      }], [1, {
        az: 56,
        el: 0,
        dist: 7.2,
        y: 1.45,
        dz: 0.2
      }]],
      vista: function (T, f, k) {
        return {
          figuras: [{
            quien: 'tor',
            pose: colgado(k),
            musc: {
              abdomen: true,
              oblicuos: 'claro',
              brillo: 0.3 * k
            },
            cara: {
              boca: k > 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: [{
            tipo: 'barraFija',
            p: [0, 0, 0],
            alto: 2.62
          }]
        };
      }
    })
  }, {
    nombre: '3. Rueda abdominal',
    dur: 2.2,
    vo: 'Tres. Rueda abdominal.',
    C: E3.ejercicio({
      n: 3,
      r1: 'RUEDA *ABDOMINAL*',
      r2: 'ABDOMEN *ESTIRADO*',
      brillo: ABD,
      r: 100,
      tomas: [[0, {
        az: 74,
        el: 12,
        dist: 7.0,
        y: 0.5,
        dz: 0.55
      }], [1, {
        az: 52,
        el: 8,
        dist: 5.6,
        y: 0.45,
        dz: 0.6
      }]],
      vista: function (T, f, k) {
        var p = rueda(k);
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            musc: {
              abdomen: true,
              oblicuos: 'claro',
              brillo: 0.3 * (1 - k)
            },
            cara: {
              boca: k < 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: [{
            tipo: 'rueda',
            p: [0, 0.11, p.zW]
          }, {
            tipo: 'colchoneta',
            p: [0, 0, -0.12],
            ancho: 0.8,
            largo: 0.9
          }]
        };
      }
    })
  }];
  global.REELS.registrar({
    id: 'abdominales-top3-3d',
    titulo: 'Top 3 abdominales (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.3,
      vo: '¿Estás de acuerdo con este top? Deja tu opinión en los comentarios, guarda el video y compártelo con un amigo.'
    }
  });
})(window);
