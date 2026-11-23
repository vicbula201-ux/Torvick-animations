/* GENERADO por compilar.js desde peso-muerto-3d.jsx — no editar a mano. */
/* ============================================================
   PESO MUERTO — TOR EN 3D (mismo guion que peso-muerto.jsx)
   Pies al ancho de la cadera, la barra pegada a las espinillas y la espalda
   neutra; empujar el piso extendiendo cadera y rodillas a la vez, con la
   barra cerca del cuerpo, y bajar igual. Gluteo mayor (principal); isquios y
   cuadriceps; la espalda estabiliza. Errores: curvar la espalda y agarrar la
   barra floja. La barra sigue a las manos.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    V = global.V,
    B = global.B,
    E3 = global.E3,
    TOR3D = global.TOR3D;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var C = global.P.C;

  /* ---------------- la pose: k 0 abajo (la barra en el piso) .. 1 de pie ---------------- */
  // curva: la espalda redonda (el error): mas inclinado y la cabeza colgando
  function pose(k, curva) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)),
      cu = curva || 0;
    var inc = 50 * (1 - e) + 22 * cu * (1 - 0.5 * e);
    return {
      cadera: E3.lerp3([0, 0.7, -0.25], [0, 1.0, 0], e),
      tronco: [inc, 0, 0],
      cabeza: [-inc * 0.35 + 12 - 30 * cu, 0, 0],
      hombros: {
        sube: 0.3 * cu
      },
      pieI: [-0.15, 0.115, 0.03],
      pieD: [0.15, 0.115, 0.03],
      rodillaI: [0.15, 0, 1],
      rodillaD: [0.15, 0, 1],
      manoI: E3.lerp3([-0.25, 0.225, 0.16], [-0.25, 0.79, 0.15], e),
      manoD: E3.lerp3([0.25, 0.225, 0.16], [0.25, 0.79, 0.15], e),
      codoI: [0.6, -0.4, -1],
      codoD: [0.6, -0.4, -1]
    };
  }
  function cuadro(k, curva, extra) {
    var p = pose(k, curva),
      J = TOR3D.esqueleto(p);
    var c = J.manoI.clone().add(J.manoD).multiplyScalar(0.5);
    c.y = Math.max(0.226, c.y);
    return {
      figuras: [Object.assign({
        quien: 'tor',
        pose: p
      }, extra || {})],
      objetos: [{
        tipo: 'barra',
        c: [c.x, c.y, c.z],
        eje: [1, 0, 0]
      }]
    };
  }
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.42 : va, 0.14);
  }
  // la espalda: recta (verde) o un arco (rojo) de la cadera al cuello
  function espalda(pr, J, color, bulto) {
    var a = J.cadera,
      b = J.cuello,
      d = b.clone().sub(a),
      th = Math.atan2(d.z, d.y);
    var n = TOR3D.v(0, Math.sin(th), -Math.cos(th));
    var pts = [];
    for (var i = 0; i <= 8; i++) {
      var u = i / 8,
        q = a.clone().add(d.clone().multiplyScalar(u)).add(n.clone().multiplyScalar(0.2 + bulto * Math.sin(Math.PI * u)));
      pts.push(pr([q.x, q.y, q.z]));
    }
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: pts,
      color: color,
      sw: 16,
      p: 1
    });
  }
  var LADO = {
    az: 70,
    el: 8,
    dist: 5.6,
    y: 0.95
  };
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tu peso muerto.',
    C: E3.escena({
      tomas: [[0, {
        az: 52,
        el: 8,
        dist: 4.4,
        y: 0.95
      }], [1, {
        az: 68,
        el: 8,
        dist: 5.6,
        y: 0.95
      }]],
      vista: function (T, f) {
        var k = reps(T, f(0), f(1), 2, 0.35);
        var r = cuadro(k, 1, {
          musc: {
            lumbar: 'rojo'
          },
          cara: {
            boca: 'dientes',
            cejas: 'enojo'
          }
        });
        r.vibra = true;
        r.k = k;
        return r;
      },
      lienzo: function (T, f, t, pr, info) {
        return /*#__PURE__*/React.createElement("g", null, espalda(pr, TOR3D.esqueleto(pose(info.k, 1)), C.RED, 0.16), /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: pr('cabeza'),
          v: 1
        }));
      },
      mal: [{
        x: 80,
        y: 450,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 860,
        y: 1120,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'PESO *MUERTO*',
        s: 1.3,
        cuando: 0.02,
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5.5,
    vo: 'Pon tus pies a la anchura de tus hombros, con la barra pegada a las espinillas y la espalda en posición neutra.',
    C: E3.escena({
      tomas: [[0, {
        az: 20,
        el: 10,
        dist: 5.4,
        y: 0.8
      }], [0.3, {
        az: 24,
        el: 12,
        dist: 4.6,
        y: 0.6
      }], [0.36, {
        az: 82,
        el: 6,
        dist: 3.6,
        y: 0.45,
        dz: 0.1
      }], [0.62, {
        az: 86,
        el: 6,
        dist: 3.6,
        y: 0.45,
        dz: 0.1
      }], [0.7, LADO], [1, {
        az: 76,
        el: 8,
        dist: 5.4,
        y: 0.95
      }]],
      vista: function () {
        return cuadro(0, 0, {
          cara: {
            boca: 'recta'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var pies = clamp((T - f(0.06)) / (f(0.18) - f(0.06)), 0, 1);
        var barra = clamp((T - f(0.4)) / (f(0.5) - f(0.4)), 0, 1);
        var J = TOR3D.esqueleto(pose(0, 0));
        return /*#__PURE__*/React.createElement("g", null, t < 0.33 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('tobilloI'),
          r: 70,
          color: C.YEL,
          p: pies
        }), /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('tobilloD'),
          r: 70,
          color: C.YEL,
          p: pies
        })) : null, t > 0.35 && t < 0.66 ? /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr([0.15, 0.24, 0.13]),
          r: 80,
          color: C.YEL,
          p: barra
        }) : null, t > 0.68 ? espalda(pr, J, C.GRN, 0) : null);
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.5
      }, {
        x: 860,
        y: 560,
        cuando: 0.82
      }],
      r1: {
        text: 'BARRA *PEGADA*',
        s: 1.15,
        cuando: 0.1
      },
      r2: {
        text: 'ESPALDA *NEUTRA*',
        s: 1.15,
        cuando: 0.66
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 6,
    vo: 'Empuja desde el piso y extiende la cadera y las rodillas a la vez, con la barra cerca del cuerpo, bajando lento con control.',
    C: E3.escena({
      tomas: [[0, LADO], [0.5, {
        az: 58,
        el: 8,
        dist: 5.4,
        y: 0.95
      }], [1, {
        az: 40,
        el: 8,
        dist: 5.8,
        y: 0.95
      }]],
      vista: function (T, f) {
        var k = reps(T, f(0.04), f(0.96), 2);
        var r = cuadro(k, 0, {
          musc: {
            gluteos: true,
            brillo: 0.35 * k
          },
          cara: {
            boca: k > 0.6 ? 'sonrisa' : 'recta'
          }
        });
        r.k = k;
        return r;
      },
      lienzo: function (T, f, t, pr) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('cadera'),
          cuando: f(0.04 + 0.92 * 0.2),
          r: 110
        }), /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('cadera'),
          cuando: f(0.04 + 0.92 * 0.7),
          r: 110
        }));
      },
      encima: function (T, f) {
        return E3.contador(T, f(0.04), f(0.96), 2, 40, 1150);
      },
      zona: [200, 378, 1036, 1452],
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.5
      }],
      r1: {
        text: 'CADERA Y *RODILLAS*',
        cuando: 0.06
      },
      r2: {
        text: 'BARRA *CERCA*',
        s: 1.15,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'El músculo principal es el glúteo mayor, con ayuda de los isquiotibiales y los cuádriceps.',
    C: E3.escena({
      tomas: [[0, {
        az: 150,
        el: 10,
        dist: 4.0,
        y: 1.0
      }], [0.6, {
        az: 162,
        el: 10,
        dist: 4.0,
        y: 1.0
      }], [1, {
        az: 120,
        el: 8,
        dist: 5.2,
        y: 0.95
      }]],
      vista: function (T, f) {
        var sec = T > f(0.56);
        return cuadro(0.8, 0, {
          musc: {
            gluteos: T > f(0.04) ? true : null,
            isquios: sec ? 'gris' : null,
            cuadriceps: sec ? 'gris' : null,
            lumbar: sec ? 'claro' : null,
            brillo: 0.35
          },
          cara: {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
        return E3.brilla(T, pr, ['m:gluteos:0', 'm:gluteos:1'], m, true, 90);
      },
      r1: {
        text: 'GLÚTEO *MAYOR*',
        s: 1.2,
        cuando: 0.04
      },
      r2: {
        text: '+ ISQUIOS Y *CUÁDRICEPS*',
        s: 1.0,
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'No curves la espalda durante el movimiento. Siempre mantén tu columna neutra.',
    C: E3.escena({
      tomas: [[0, {
        az: 84,
        el: 8,
        dist: 5.2,
        y: 0.95
      }], [1, {
        az: 76,
        el: 8,
        dist: 5.4,
        y: 0.95
      }]],
      vista: function (T, f) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var k = reps(T, f(0), f(1), 2, 0.4),
          cu = 1 - bien;
        var r = cuadro(k, cu, {
          musc: bien < 0.5 ? {
            lumbar: 'rojo'
          } : {
            gluteos: true,
            brillo: 0.3
          },
          cara: bien < 0.5 ? {
            boca: 'dientes',
            cejas: 'enojo'
          } : {
            boca: 'sonrisa'
          }
        });
        r.k = k;
        r.cu = cu;
        return r;
      },
      lienzo: function (T, f, t, pr, info) {
        return espalda(pr, TOR3D.esqueleto(pose(info.k, info.cu)), info.cu > 0.5 ? C.RED : C.GRN, 0.16 * info.cu);
      },
      mal: [{
        x: 840,
        y: 480,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 840,
        y: 480,
        cuando: 0.62
      }],
      r1: {
        text: 'ESPALDA *CURVADA*',
        s: 1.1,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'COLUMNA *NEUTRA*',
        s: 1.1,
        cuando: 0.52,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'No agarres la barra flojo: apriétala fuerte, con las muñecas alineadas.',
    C: E3.escena({
      tomas: [[0, {
        az: 30,
        el: 14,
        dist: 3.0,
        y: 0.7,
        dz: 0.1
      }], [1, {
        az: 40,
        el: 14,
        dist: 3.0,
        y: 0.75,
        dz: 0.1
      }]],
      vista: function (T, f) {
        var bien = T > f(0.5);
        var k = bien ? reps(T, f(0.52), f(1), 1, 0.4) : 0.15 + 0.05 * Math.sin(T * 20);
        var r = cuadro(k, 0, {
          musc: bien ? {
            gluteos: true
          } : {},
          cara: bien ? {
            boca: 'sonrisa'
          } : {
            boca: 'recta',
            cejas: 'triste'
          }
        });
        r.vibra = !bien;
        return r;
      },
      lienzo: function (T, f, t, pr) {
        var col = t < 0.5 ? C.RED : C.GRN;
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('manoI'),
          r: 64,
          color: col,
          p: 1
        }), /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('manoD'),
          r: 64,
          color: col,
          p: 1
        }));
      },
      mal: [{
        x: 840,
        y: 480,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 840,
        y: 480,
        cuando: 0.64
      }],
      r1: {
        text: 'AGARRE *FLOJO*',
        s: 1.15,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'APRIETA *FUERTE*',
        s: 1.15,
        cuando: 0.52,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace el peso muerto: la espalda neutra y la barra cerca.',
    C: E3.escena({
      tomas: [[0, {
        az: 40,
        el: 8,
        dist: 5.4,
        y: 0.95
      }], [1, {
        az: 96,
        el: 8,
        dist: 5.6,
        y: 0.95
      }]],
      golpes: [0.4],
      vista: function (T, f) {
        var k = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.4),
          ease: Easing.easeInOutSine
        })(T);
        return cuadro(k, 0, {
          musc: {
            gluteos: true,
            brillo: 0.3
          },
          cara: {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        return /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('cadera'),
          cuando: f(0.4),
          r: 120
        });
      },
      bien: [{
        x: 850,
        y: 560,
        cuando: 0.44,
        s: 0.85
      }],
      r1: {
        text: 'PESO MUERTO',
        s: 1.2,
        cuando: 0.06
      },
      r2: {
        text: 'ESPALDA *NEUTRA*',
        s: 1.15,
        cuando: 0.46,
        tono: 'verde'
      }
    })
  }];
  global.REELS.registrar({
    id: 'peso-muerto-3d',
    titulo: 'Peso muerto (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿LO HACÍAS BIEN?',
      vo: '¿Hacías bien el peso muerto? Guarda el video y compártelo con un amigo.'
    }
  });
})(window);
