/* GENERADO por compilar.js desde remo-serrucho-3d.jsx — no editar a mano. */
/* ============================================================
   REMO SERRUCHO — TOR EN 3D (mismo guion que remo-serrucho.jsx)
   Rodilla y mano izquierdas en el banco, el pie derecho en el piso y la
   mancuerna en la mano derecha; espalda neutra y abdomen firme. Tirar con el
   codo pegado hasta la cadera y bajar lento hasta estirar la espalda (los
   omoplatos se separan abajo y se juntan arriba). Dorsal ancho (principal);
   romboides, biceps y el hombro de atras ayudan. Errores: curvar la espalda y
   dejar quietos los omoplatos. Estilo fluido: tira rapido, aguanta y baja lento,
   con un corte a primer plano en la ejecucion.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var V = global.V,
    B = global.B,
    E3 = global.E3,
    TOR3D = global.TOR3D;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var C = global.P.C;

  /* ---------------- la pose: k 0 el brazo colgando (dorsal estirado) .. 1 la mancuerna en la cadera ---------------- */
  // cu: la espalda redonda (error 1); esc: 1 los omoplatos se mueven, 0 quietos (error 2)
  var BANCO = {
    tipo: 'banco',
    p: [-0.2, 0, 0],
    largo: 1.45,
    alto: 0.5
  };
  function base(k, cu, esc) {
    var e = clamp(k, 0, 1),
      es = esc == null ? 1 : esc;
    return {
      cadera: [0, 0.97, -0.12],
      tronco: [72 + 14 * cu, -5 * e * es, 0],
      cabeza: [10 - 32 * cu, 0, 0],
      hombros: {
        sube: 0.35 * cu,
        junta: es * (-0.8 + 1.8 * e)
      },
      pieI: [-0.15, 0.58, -0.58],
      rodillaI: [0, 0.3, 1],
      pieD: [0.34, 0.115, -0.02],
      rodillaD: [0.25, 1, 0.3],
      manoI: [-0.24, 0.59, 0.5],
      codoI: [0.3, -0.5, -1],
      codoD: [0.25, -0.3, -1]
    };
  }
  function pose(k, cu, esc) {
    var p = base(k, cu, esc);
    p.manoD = [0.32, 0.5, 0.45];
    var J = TOR3D.esqueleto(p),
      e = Easing.easeInOutSine(clamp(k, 0, 1));
    var S = J.hombroD,
      H = J.cadera;
    var abajo = [S.x + 0.02, Math.max(0.36, S.y - 0.7), S.z + 0.04]; // la mancuerna nunca toca el piso
    var arriba = H.clone().add(J.X.clone().multiplyScalar(0.3)).add(J.d.clone().multiplyScalar(0.16));
    p.manoD = E3.lerp3(abajo, [arriba.x, arriba.y + 0.06, arriba.z], e);
    return p;
  }
  function cuadro(k, cu, esc, extra) {
    return {
      figuras: [Object.assign({
        quien: 'tor',
        pose: pose(k, cu, esc),
        pesas: {
          I: null,
          D: [0, 0.12, 1]
        }
      }, extra || {})],
      objetos: [BANCO]
    };
  }
  // estilo fluido: tira rapido (38 %), aguanta y baja lento
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.38 : va, 0.14);
  }
  // la espalda: recta (verde) o un arco (rojo) de la cadera al cuello, por encima de la espalda
  function espalda(pr, J, color, bulto) {
    var a = J.cadera,
      b = J.cuello,
      d = b.clone().sub(a),
      th = Math.atan2(d.z, d.y);
    var n = TOR3D.v(0, Math.sin(th), -Math.cos(th)),
      pts = [];
    for (var i = 0; i <= 8; i++) {
      var u = i / 8,
        q = a.clone().add(d.clone().multiplyScalar(u)).add(n.clone().multiplyScalar(0.22 + bulto * Math.sin(Math.PI * u)));
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
    az: 62,
    el: 12,
    dist: 5.6,
    y: 0.8
  };
  var DORSAL = ['dorsalD'];
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Estás haciendo mal tu remo serrucho.',
    C: E3.escena({
      tomas: [[0, {
        az: 48,
        el: 10,
        dist: 4.4,
        y: 0.8
      }], [1, {
        az: 66,
        el: 12,
        dist: 5.6,
        y: 0.8
      }]],
      vista: function (T, f) {
        var k = reps(T, f(0), f(1), 2, 0.3);
        var r = cuadro(k, 1, 0, {
          musc: {
            lumbar: 'rojo',
            dorsal: 'rojo'
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
        return /*#__PURE__*/React.createElement("g", null, espalda(pr, TOR3D.esqueleto(pose(info.k, 1, 0)), C.RED, 0.16), /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: pr('cabeza'),
          v: 1
        }));
      },
      mal: [{
        x: 80,
        y: 470,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 860,
        y: 1120,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'REMO *SERRUCHO*',
        s: 1.3,
        cuando: 0.02,
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5,
    vo: 'Pon tu rodilla y mano del mismo lado en el banco, el otro pie en el piso y la espalda neutra.',
    C: E3.escena({
      tomas: [[0, {
        az: -58,
        el: 20,
        dist: 5.4,
        y: 0.75
      }], [0.46, {
        az: -48,
        el: 22,
        dist: 5.2,
        y: 0.75
      }], [0.461, {
        az: 58,
        el: 10,
        dist: 5.2,
        y: 0.8
      }], [0.7, {
        az: 76,
        el: 8,
        dist: 5.2,
        y: 0.85
      }], [1, {
        az: 88,
        el: 8,
        dist: 5.2,
        y: 0.85
      }]],
      vista: function () {
        return cuadro(0, 0, 1, {
          cara: {
            boca: 'recta'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var a = function (c) {
          return clamp((T - f(c)) / 0.35, 0, 1);
        };
        var J = TOR3D.esqueleto(pose(0, 0, 1));
        return /*#__PURE__*/React.createElement("g", null, t < 0.46 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('rodillaI'),
          r: 70,
          color: C.YEL,
          p: a(0.08)
        }), /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('manoI'),
          r: 64,
          color: C.YEL,
          p: a(0.22)
        })) : null, t > 0.46 && t < 0.72 ? /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('tobilloD'),
          r: 70,
          color: C.YEL,
          p: a(0.5)
        }) : null, t > 0.72 ? espalda(pr, J, C.GRN, 0) : null);
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.34
      }, {
        x: 860,
        y: 560,
        cuando: 0.84
      }],
      r1: {
        text: 'APOYO *EN EL BANCO*',
        s: 1.1,
        cuando: 0.06
      },
      r2: {
        text: 'ESPALDA *NEUTRA*',
        s: 1.15,
        cuando: 0.74
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 6,
    vo: 'Tira de la mancuerna hacia la cadera con el codo pegado, y baja lento hasta estirar la espalda.',
    C: E3.escena({
      tomas: [[0, LADO], [0.44, {
        az: 74,
        el: 12,
        dist: 5.2,
        y: 0.8
      }], [0.441, {
        az: 128,
        el: 32,
        dist: 5,
        y: 0.85
      }], [0.8, {
        az: 138,
        el: 34,
        dist: 5,
        y: 0.85
      }], [1, {
        az: 96,
        el: 16,
        dist: 5.2,
        y: 0.8
      }]],
      vista: function (T, f) {
        var k = reps(T, f(0.04), f(0.96), 2);
        var r = cuadro(k, 0, 1, {
          musc: {
            dorsal: true,
            brillo: 0.4 * k
          },
          cara: {
            boca: k > 0.6 ? 'dientes' : 'recta'
          }
        });
        r.k = k;
        return r;
      },
      lienzo: function (T, f, t, pr, info) {
        var a = pr(pose(0, 0, 1).manoD),
          b = pr(pose(1, 0, 1).manoD);
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(E3.Guia, {
          a: a,
          b: b,
          p: 1,
          w: 12
        }), E3.brilla(T, pr, DORSAL, clamp(info.k * 1.4 - 0.4, 0, 1), true, 85), /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('codoD'),
          cuando: f(0.04 + 0.92 * 0.19),
          r: 100
        }), /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('codoD'),
          cuando: f(0.04 + 0.92 * 0.69),
          r: 100
        }));
      },
      encima: function (T, f) {
        return E3.contador(T, f(0.04), f(0.96), 2, 40, 1150);
      },
      zona: [200, 378, 1036, 1452],
      r1: {
        text: 'CODO *A LA CADERA*',
        cuando: 0.06
      },
      r2: {
        text: 'BAJA *LENTO*',
        s: 1.15,
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'El músculo principal involucrado es el dorsal ancho, con ayuda de los romboides, el bíceps y el hombro de atrás.',
    C: E3.escena({
      tomas: [[0, {
        az: 128,
        el: 38,
        dist: 4.2,
        y: 0.9
      }], [0.6, {
        az: 142,
        el: 40,
        dist: 4.2,
        y: 0.9
      }], [1, {
        az: 112,
        el: 26,
        dist: 5.2,
        y: 0.85
      }]],
      vista: function (T, f) {
        var sec = T > f(0.54),
          k = 0.85 + 0.1 * Math.sin(T * 2.4);
        return cuadro(k, 0, 1, {
          musc: {
            dorsal: T > f(0.04) ? true : null,
            romboides: sec ? 'claro' : null,
            biceps: sec ? 'gris' : null,
            deltoides: sec ? 'gris' : null,
            brillo: 0.35
          },
          cara: {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
        return E3.brilla(T, pr, DORSAL, m, true, 95);
      },
      r1: {
        text: 'DORSAL *ANCHO*',
        s: 1.2,
        cuando: 0.04
      },
      r2: {
        text: '+ ROMBOIDES Y *BÍCEPS*',
        s: 1.0,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'No curves tu espalda. Siempre mantenla neutra durante todo el recorrido.',
    C: E3.escena({
      tomas: [[0, {
        az: 86,
        el: 10,
        dist: 5.2,
        y: 0.8
      }], [1, {
        az: 78,
        el: 10,
        dist: 5.4,
        y: 0.8
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
        var r = cuadro(k, cu, 1, {
          musc: bien < 0.5 ? {
            lumbar: 'rojo'
          } : {
            dorsal: true,
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
        return espalda(pr, TOR3D.esqueleto(pose(info.k, info.cu, 1)), info.cu > 0.5 ? C.RED : C.GRN, 0.16 * info.cu);
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
        text: 'ESPALDA *NEUTRA*',
        s: 1.1,
        cuando: 0.52,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'No dejes quietos los omóplatos, estíralos hacia abajo y luego júntalos arriba.',
    C: E3.escena({
      tomas: [[0, {
        az: 150,
        el: 44,
        dist: 3.6,
        y: 0.95
      }], [1, {
        az: 162,
        el: 46,
        dist: 3.6,
        y: 0.95
      }]],
      vista: function (T, f) {
        var bien = T > f(0.5);
        var k = bien ? reps(T, f(0.52), f(1), 1, 0.38) : 0.25 + 0.35 * reps(T, f(0), f(0.48), 2, 0.4);
        var r = cuadro(k, 0, bien ? 1 : 0, {
          musc: bien ? {
            romboides: true,
            dorsal: 'claro',
            brillo: 0.3 * k
          } : {
            romboides: 'rojo'
          },
          cara: bien ? {
            boca: 'sonrisa'
          } : {
            boca: 'recta',
            cejas: 'triste'
          }
        });
        return r;
      },
      lienzo: function (T, f, t, pr) {
        var col = t < 0.5 ? C.RED : C.GRN;
        return /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('romboides'),
          r: 90,
          color: col,
          p: 1
        });
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
        cuando: 0.66
      }],
      r1: {
        text: 'OMÓPLATOS *QUIETOS*',
        s: 1.05,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'ESTIRA Y *JUNTA*',
        s: 1.15,
        cuando: 0.52,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace el remo con mancuerna.',
    C: E3.escena({
      tomas: [[0, {
        az: 40,
        el: 12,
        dist: 5.4,
        y: 0.8
      }], [1, {
        az: 100,
        el: 14,
        dist: 5.6,
        y: 0.8
      }]],
      golpes: [0.4],
      vista: function (T, f) {
        var k = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.4),
          ease: Easing.easeOutCubic
        })(T);
        return cuadro(k, 0, 1, {
          musc: {
            dorsal: true,
            brillo: 0.35
          },
          cara: {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        return /*#__PURE__*/React.createElement("g", null, E3.brilla(T, pr, DORSAL, 1, true, 90), /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('codoD'),
          cuando: f(0.4),
          r: 120
        }));
      },
      bien: [{
        x: 850,
        y: 560,
        cuando: 0.44,
        s: 0.85
      }],
      r1: {
        text: 'REMO SERRUCHO',
        s: 1.2,
        cuando: 0.06
      },
      r2: {
        text: 'CODO A LA *CADERA*',
        s: 1.1,
        cuando: 0.46,
        tono: 'verde'
      }
    })
  }];
  global.REELS.registrar({
    id: 'remo-serrucho-3d',
    titulo: 'Remo serrucho (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿LO HACÍAS BIEN?',
      vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de entreno y guárdalo.'
    }
  });
})(window);
