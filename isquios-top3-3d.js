/* GENERADO por compilar.js desde isquios-top3-3d.jsx — no editar a mano. */
/* ============================================================
   TOP 3 ISQUIOTIBIALES SEGUN LA CIENCIA — LA NOVIA DE TOR EN 3D (mismo guion que isquios-top3.jsx)
   1. Curl femoral sentado: con la cadera flexionada crece mas que acostado (Maeo y cols., 2021).
   2. Peso muerto rumano: la cadera atras, el isquio estirado con carga.
   3. Curl nordico: la bajada lenta alarga los fasciculos (Petersen y cols., 2011; Bourne y cols., 2017).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var E3 = global.E3,
    TOR3D = global.TOR3D;
  var Easing = global.Easing,
    clamp = global.clamp;
  var ISQ = ['m:isquios:0', 'm:isquios:1'];
  var RAD = Math.PI / 180;
  function aArr(q) {
    return [q.x, q.y, q.z];
  }

  /* 1. curl femoral sentado: k 0 piernas estiradas .. 1 rodillas dobladas */
  function curl(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var t = (0 + 105 * e) * RAD; // el angulo de la pierna de abajo respecto de la horizontal, hacia abajo
    var p = {
      cadera: [0, 0.62, -0.05],
      tronco: [-8, 0, 0],
      cabeza: [-4, 0, 0],
      rodillaI: [0.1, 0.6, 1],
      rodillaD: [0.1, 0.6, 1],
      manoI: [-0.34, 0.62, 0.12],
      manoD: [0.34, 0.62, 0.12],
      pies: [-10 + 80 * e, -10 + 80 * e]
    };
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D',
        rod = [s * 0.13, 0.6, 0.4];
      p['pie' + L] = [s * 0.13, rod[1] - 0.43 * Math.sin(t), rod[2] + 0.43 * Math.cos(t)];
    });
    return p;
  }
  function curlObjetos(p) {
    var J = TOR3D.esqueleto(p, 'novia');
    var sh = J.tobilloD.clone().sub(J.rodillaD).normalize();
    var atras = TOR3D.v(0, -sh.z, sh.y); // la cara de atras de la pierna
    var rod = J.tobilloD.clone().add(atras.multiplyScalar(0.1)).setX(0);
    return [{
      tipo: 'banco',
      p: [0, 0, 0.02],
      largo: 0.56,
      alto: 0.5,
      ancho: 0.5,
      respaldo: {
        ang: 98,
        largo: 0.95,
        ancho: 0.5
      }
    }, {
      tipo: 'rodillo',
      id: 'muslo',
      c: [0, J.rodillaD.y + 0.14, J.rodillaD.z - 0.08],
      ancho: 0.5
    }, {
      tipo: 'rodillo',
      id: 'pierna',
      c: aArr(rod),
      pivote: [0, J.rodillaD.y, J.rodillaD.z],
      ancho: 0.5
    }];
  }
  /* 2. peso muerto rumano: k 0 abajo (isquio estirado) .. 1 de pie */
  function rumano(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    return {
      cadera: E3.lerp3([0, 0.93, -0.26], [0, 1.0, 0], e),
      tronco: [78 - 74 * e, 0, 0],
      cabeza: [30 * (1 - e), 0, 0],
      pieI: [-0.15, 0.115, 0.02],
      pieD: [0.15, 0.115, 0.02]
    };
  }
  function barraRumano(p) {
    var J = TOR3D.esqueleto(p, 'novia');
    return aArr(J.manoI.clone().add(J.manoD).multiplyScalar(0.5));
  }
  /* 3. curl nordico: de rodillas con los tobillos sujetos; k 0 inclinada adelante .. 1 erguida */
  function nordico(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)),
      th = (58 - 58 * e) * RAD;
    var hy = 0.08 + 0.43 * Math.cos(th),
      hz = 0.03 + 0.43 * Math.sin(th);
    var d = [0, Math.cos(th), Math.sin(th)];
    var polo = [0.1, -Math.cos(th) + 0.3 * Math.sin(th), Math.sin(th) + 0.3 * Math.cos(th)];
    var p = {
      cadera: [0, hy + d[1] * 0.04, hz + d[2] * 0.04],
      tronco: [th / RAD, 0, 0],
      cabeza: [10 * (1 - e), 0, 0],
      pieI: [-0.15, 0.1, -0.4],
      pieD: [0.15, 0.1, -0.4],
      pies: [160, 160],
      rodillaI: polo,
      rodillaD: polo,
      codoI: [0.4, -0.6, -0.6],
      codoD: [0.4, -0.6, -0.6]
    };
    var J = TOR3D.esqueleto(p, 'novia');
    [-1, 1].forEach(function (s) {
      var m = J.hombroD.clone().add(J.hombroI).multiplyScalar(0.5).add(J.fr.clone().multiplyScalar(0.32)).sub(J.d.clone().multiplyScalar(0.25));
      p[s < 0 ? 'manoI' : 'manoD'] = [s * 0.24, m.y, m.z];
    });
    return p;
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Los 3 mejores ejercicios de isquiotibiales según la ciencia.',
    C: E3.gancho({
      musculo: 'ISQUIOS',
      musc: {
        isquios: true,
        gluteos: 'claro'
      },
      brillo: ISQ,
      r: 80,
      tomas: [[0, {
        az: 196,
        el: 2,
        dist: 4.6,
        y: 0.9
      }], [1, {
        az: 156,
        el: 4,
        dist: 6.0,
        y: 1.0
      }]],
      figura: function () {
        return {
          quien: 'novia',
          pose: E3.poseNovia(),
          cara: {
            boca: 'sonrisa'
          }
        };
      }
    })
  }, {
    nombre: '1. Curl femoral sentado',
    dur: 2.2,
    vo: 'Uno: curl femoral sentado, crece más que acostado.',
    C: E3.ejercicio({
      n: 1,
      r1: 'CURL FEMORAL *SENTADO*',
      r2: 'MÁS QUE *ACOSTADO*',
      brillo: ISQ,
      r: 75,
      s1: 0.95,
      tomas: [[0, {
        az: 82,
        el: 8,
        dist: 6.0,
        y: 0.8,
        dz: 0.15
      }], [1, {
        az: 64,
        el: 6,
        dist: 5.0,
        y: 0.75,
        dz: 0.2
      }]],
      vista: function (T, f, k) {
        var p = curl(k);
        return {
          figuras: [{
            quien: 'novia',
            pose: p,
            musc: {
              isquios: true,
              gemelos: 'gris',
              brillo: 0.35 * k
            },
            cara: {
              boca: k > 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: curlObjetos(p)
        };
      }
    })
  }, {
    nombre: '2. Peso muerto rumano',
    dur: 2.2,
    vo: 'Dos: peso muerto rumano, llevando la cadera atrás.',
    C: E3.ejercicio({
      n: 2,
      r1: 'PESO MUERTO *RUMANO*',
      r2: 'CADERA *ATRÁS*',
      brillo: ISQ,
      r: 75,
      s1: 0.98,
      va: 0.4,
      tomas: [[0, {
        az: 92,
        el: 6,
        dist: 6.6,
        y: 0.95,
        dz: 0
      }], [1, {
        az: 120,
        el: 6,
        dist: 5.6,
        y: 0.85,
        dz: -0.1
      }]],
      vista: function (T, f, k) {
        var p = rumano(k);
        return {
          figuras: [{
            quien: 'novia',
            pose: p,
            musc: {
              isquios: true,
              gluteos: 'claro',
              brillo: 0.35 * (1 - k)
            },
            cara: {
              boca: 'sonrisa'
            }
          }],
          objetos: [{
            tipo: 'barra',
            c: barraRumano(p),
            eje: [1, 0, 0]
          }]
        };
      }
    })
  }, {
    nombre: '3. Curl nórdico',
    dur: 2.2,
    vo: 'Tres: curl nórdico, bajando lento.',
    C: E3.ejercicio({
      n: 3,
      r1: 'CURL *NÓRDICO*',
      r2: 'BAJA *LENTO*',
      brillo: ISQ,
      r: 75,
      va: 0.3,
      tomas: [[0, {
        az: 84,
        el: 8,
        dist: 6.2,
        y: 0.55,
        dz: 0.15
      }], [1, {
        az: 120,
        el: 8,
        dist: 5.2,
        y: 0.5,
        dz: 0.05
      }]],
      vista: function (T, f, k) {
        return {
          figuras: [{
            quien: 'novia',
            pose: nordico(k),
            musc: {
              isquios: true,
              gluteos: 'claro',
              brillo: 0.35 * (1 - k)
            },
            cara: {
              boca: k < 0.5 ? 'dientes' : 'sonrisa'
            }
          }],
          objetos: [{
            tipo: 'colchoneta',
            p: [0, 0, -0.1],
            ancho: 0.8,
            largo: 1.1
          }, {
            tipo: 'rodillo',
            id: 'tobillos',
            c: [0, 0.22, -0.42],
            pivote: [0, 0.04, -0.6],
            ancho: 0.5
          }]
        };
      }
    })
  }];
  global.REELS.registrar({
    id: 'isquios-top3-3d',
    titulo: 'Top 3 isquios (novia 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.6,
      pregunta: '¿CUÁL PROBARÁS?',
      vo: '¿Cuál vas a probar? Coméntalo, compártelo con una amiga y guárdalo.'
    }
  });
})(window);
