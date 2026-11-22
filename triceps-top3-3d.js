/* GENERADO por compilar.js desde triceps-top3-3d.jsx — no editar a mano. */
/* ============================================================
   TOP 3 TRICEPS SEGUN LA CIENCIA — TOR EN 3D (mismo guion que triceps-top3.jsx)
   1. Extension sobre la cabeza (polea baja, de espaldas): con el brazo arriba
      la cabeza larga trabaja estirada (Maeo y cols., 2023).
   2. Press frances acostado con barra EZ: codos quietos.
   3. Extension en polea alta con barra: estirando bien abajo.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var E3 = global.E3;
  var Easing = global.Easing,
    clamp = global.clamp;
  var TRI = ['m:triceps:0', 'm:triceps:1'];
  function lado(p, s, mano, codo) {
    var L = s < 0 ? 'I' : 'D';
    p['mano' + L] = mano;
    p['codo' + L] = codo;
  }
  function mitad(p) {
    return [(p.manoI[0] + p.manoD[0]) / 2, (p.manoI[1] + p.manoD[1]) / 2, (p.manoI[2] + p.manoD[2]) / 2];
  }

  /* 1. sobre la cabeza: k 0 manos detras de la cabeza (estirado) .. 1 brazos arriba */
  function sobre(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var p = {
      cadera: [0, 1.0, 0],
      tronco: [8, 0, 0],
      cabeza: [4, 0, 0],
      pieI: [-0.17, 0.115, -0.2],
      pieD: [0.17, 0.115, 0.24]
    };
    [-1, 1].forEach(function (s) {
      var codo = [s * 0.24, 1.96, 0.2];
      lado(p, s, E3.lerp3([s * 0.2, 1.74, -0.14], [s * 0.18, 2.32, 0.22], e), [0, 1, 0.5]);
    });
    return p;
  }
  function poleaSobre(k) {
    var p = sobre(k),
      m = mitad(p);
    return {
      tipo: 'polea',
      p: [0, 0, -0.78],
      alto: 0.32,
      fin: [m[0], m[1] - 0.12, m[2] - 0.1],
      manos: [p.manoI, p.manoD]
    };
  }
  /* 2. press frances acostado: k 0 la barra detras de la frente .. 1 brazos arriba */
  function frances(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var p = {
      cadera: [0, 0.64, 0.38],
      tronco: [-90, 0, 0],
      pieI: [-0.32, 0.115, 0.86],
      pieD: [0.32, 0.115, 0.86]
    };
    [-1, 1].forEach(function (s) {
      var codo = [s * 0.17, 1.07, -0.26];
      lado(p, s, E3.lerp3([s * 0.15, 0.96, -0.62], [s * 0.15, 1.45, -0.3], e), [0, 0.6, 1]);
    });
    return p;
  }
  /* 3. extension en polea alta: k 0 antebrazos arriba .. 1 brazos estirados */
  function empuje(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var p = {
      cadera: [0, 0.99, 0],
      tronco: [10, 0, 0],
      cabeza: [-6, 0, 0],
      pieI: [-0.18, 0.115, 0.03],
      pieD: [0.18, 0.115, 0.03]
    };
    [-1, 1].forEach(function (s) {
      lado(p, s, E3.lerp3([s * 0.16, 1.42, 0.48], [s * 0.18, 0.8, 0.31], e), [0.2, 0, -1]);
    });
    return p;
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Los 3 mejores ejercicios de tríceps según la ciencia.',
    C: E3.gancho({
      musculo: 'TRÍCEPS',
      musc: {
        triceps: true
      },
      brillo: TRI,
      r: 80,
      tomas: [[0, {
        az: 200,
        el: -4,
        dist: 4.4,
        y: 1.5
      }], [1, {
        az: 166,
        el: -6,
        dist: 6.2,
        y: 1.25
      }]]
    })
  }, {
    nombre: '1. Sobre la cabeza',
    dur: 2.2,
    vo: 'Uno: extensión sobre la cabeza, la que más lo hace crecer.',
    C: E3.ejercicio({
      n: 1,
      r1: 'SOBRE LA *CABEZA*',
      r2: 'TRÍCEPS *ESTIRADO*',
      brillo: TRI,
      r: 75,
      tomas: [[0, {
        az: 70,
        el: 4,
        dist: 6.8,
        y: 1.3,
        dz: -0.1
      }], [1, {
        az: 58,
        el: 2,
        dist: 5.4,
        y: 1.5,
        dz: 0
      }]],
      vista: function (T, f, k) {
        return {
          figuras: [{
            quien: 'tor',
            pose: sobre(k),
            musc: {
              triceps: true,
              brillo: 0.3 * k
            },
            cara: {
              boca: k > 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: [poleaSobre(k)]
        };
      }
    })
  }, {
    nombre: '2. Press francés',
    dur: 2.2,
    vo: 'Dos: press francés, con los codos quietos.',
    C: E3.ejercicio({
      n: 2,
      r1: 'PRESS *FRANCÉS*',
      r2: 'CODOS *QUIETOS*',
      brillo: TRI,
      r: 75,
      tomas: [[0, {
        az: 64,
        el: 16,
        dist: 6.0,
        y: 0.8,
        dz: 0
      }], [1, {
        az: 48,
        el: 18,
        dist: 4.6,
        y: 0.95,
        dz: -0.2
      }]],
      vista: function (T, f, k) {
        var p = frances(k),
          m = mitad(p);
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            musc: {
              triceps: true,
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
          }, {
            tipo: 'ez',
            c: m,
            eje: [1, 0, 0]
          }]
        };
      }
    })
  }, {
    nombre: '3. Extensión en polea',
    dur: 2.2,
    vo: 'Tres: extensión en polea, estirando bien abajo.',
    C: E3.ejercicio({
      n: 3,
      r1: 'EXTENSIÓN EN *POLEA*',
      r2: 'ESTIRA *ABAJO*',
      brillo: TRI,
      r: 75,
      s1: 1.0,
      tomas: [[0, {
        az: 64,
        el: 6,
        dist: 6.6,
        y: 1.2,
        dz: 0.2
      }], [1, {
        az: 48,
        el: 4,
        dist: 5.2,
        y: 1.25,
        dz: 0.2
      }]],
      vista: function (T, f, k) {
        var p = empuje(k),
          m = mitad(p);
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            musc: {
              triceps: true,
              brillo: 0.3 * k
            },
            cara: {
              boca: k > 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: [{
            tipo: 'polea',
            p: [0, 0, 0.8],
            giro: 180,
            alto: 2.2,
            fin: m,
            agarre: 'barra',
            eje: [1, 0, 0]
          }]
        };
      }
    })
  }];
  global.REELS.registrar({
    id: 'triceps-top3-3d',
    titulo: 'Top 3 tríceps (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.3,
      vo: '¿Estás de acuerdo? Coméntalo, compártelo y guárdalo.'
    }
  });
})(window);
