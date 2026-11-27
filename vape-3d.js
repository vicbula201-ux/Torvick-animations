/* GENERADO por compilar.js desde vape-3d.jsx — no editar a mano. */
/* ============================================================
   VAPE — TOR EN 3D (mismo guion que vape.jsx; misma evidencia, sin exagerar:
   probablemente es menos toxico que fumar, pero engancha igual o mas y
   ninguno es sano). Tor tapado por la nube, el aerosol no es vapor de agua,
   la nicotina engancha, mas tos y pulso, ¿mejor que el cigarro?, y al tacho.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    N = global.N,
    PL = global.PL,
    V = global.V,
    E3 = global.E3,
    TOR3D = global.TOR3D;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var A = global.REELS.ayudas;
  var C = P.C;
  var BLANCO = '#ffffff';
  function pulso(T, cuando, d) {
    var u = (T - cuando) / d;
    return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
  }
  function azar(i, k) {
    var v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v);
  }
  function aArr(q) {
    return [q.x, q.y, q.z];
  }
  // nube de vape: bolas blancas que salen de c y crecen (una sola silueta)
  function nube(c, T, v, op) {
    op = op || {};
    if (v < 0.02) return null;
    var n = op.n || 10,
      R = op.r || 150,
      ancho = op.ancho || 250,
      alto = op.alto || 210;
    var bolas = [[c[0], c[1] - 30 * v, R * 0.95 * v]];
    for (var i = 0; i < n; i++) {
      var a = i / n * 2 * Math.PI + 0.5 * Math.sin(T * 0.9 + i);
      var d = (0.45 + 0.55 * azar(i, 1)) * v;
      bolas.push([c[0] + Math.cos(a) * ancho * d + 14 * Math.sin(T * 1.3 + i * 2), c[1] + Math.sin(a) * alto * d - 40 * v + 10 * Math.cos(T * 1.1 + i), R * (0.5 + 0.45 * azar(i, 2)) * (0.3 + 0.7 * v)]);
    }
    return /*#__PURE__*/React.createElement("g", {
      opacity: op.opacity == null ? 1 : op.opacity
    }, bolas.map(function (b, i) {
      return /*#__PURE__*/React.createElement("circle", {
        key: 't' + i,
        cx: b[0].toFixed(1),
        cy: b[1].toFixed(1),
        r: b[2].toFixed(1),
        fill: BLANCO,
        stroke: C.INK,
        strokeWidth: 15
      });
    }), bolas.map(function (b, i) {
      return /*#__PURE__*/React.createElement("circle", {
        key: 'r' + i,
        cx: b[0].toFixed(1),
        cy: b[1].toFixed(1),
        r: Math.max(0, b[2] - 7).toFixed(1),
        fill: BLANCO
      });
    }), bolas.map(function (b, i) {
      if (i % 2 || b[2] < 50) return null;
      var r = b[2] * 0.62;
      return /*#__PURE__*/React.createElement("path", {
        key: 'a' + i,
        d: 'M ' + (b[0] - r).toFixed(1) + ' ' + (b[1] + 8).toFixed(1) + ' A ' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 0 ' + (b[0] - r * 0.3).toFixed(1) + ' ' + (b[1] + r * 0.95).toFixed(1),
        fill: "none",
        stroke: C.GRY,
        strokeWidth: 9,
        strokeLinecap: "round"
      });
    }));
  }
  function particulas(T, desde, v) {
    var ps = [];
    for (var i = 0; i < 16; i++) {
      var u = (T * 0.5 + i / 16) % 1,
        l = i % 2 ? 1 : -1;
      var x = desde[0] + l * (20 + 190 * azar(i, 3)) * Math.min(1, u * 2.2) + 10 * Math.sin(T * 3 + i),
        y = desde[1] + 40 + 420 * u;
      var r = 7 + 6 * azar(i, 4);
      ps.push(i % 3 === 0 ? /*#__PURE__*/React.createElement("rect", {
        key: i,
        x: (x - r).toFixed(1),
        y: (y - r).toFixed(1),
        width: 2 * r,
        height: 2 * r,
        rx: 3,
        fill: C.GRY,
        stroke: C.INK,
        strokeWidth: 5,
        opacity: (v * (1 - u * u)).toFixed(2),
        transform: 'rotate(' + (T * 90 + i * 40).toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'
      }) : /*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: x.toFixed(1),
        cy: y.toFixed(1),
        r: r,
        fill: i % 3 === 1 ? C.INK : C.RED,
        opacity: (v * (1 - u * u)).toFixed(2)
      }));
    }
    return /*#__PURE__*/React.createElement("g", null, ps);
  }

  /* ---------------- poses ---------------- */
  function depie(extra) {
    return Object.assign({
      cadera: [0, 1.0, 0],
      pieI: [-0.2, 0.115, 0.03],
      pieD: [0.2, 0.115, 0.03]
    }, extra || {});
  }
  // la mano con el vape en la boca
  function vapea(extra) {
    return depie(Object.assign({
      manoD: [0.1, 1.62, 0.26],
      codoD: [0.8, -1, 0]
    }, extra || {}));
  }
  function vapeEnMano(p) {
    var J = TOR3D.esqueleto(p);
    return {
      tipo: 'vape',
      p: aArr(J.manoD.clone().add(TOR3D.v(-0.04, 0.05, 0.05))),
      inclina: 70,
      giro: -40,
      s: 1.6
    };
  }
  function hombrosArriba() {
    return depie({
      manoI: [-0.56, 1.22, 0.22],
      manoD: [0.56, 1.22, 0.22],
      codoI: [1, -1, 0],
      codoD: [1, -1, 0],
      hombros: {
        sube: 0.7
      },
      cabeza: [0, 0, 10]
    });
  }
  var TOSES = [0.56, 0.8];
  var PAQUETES = [[600, 400], [810, 380], [620, 620], [820, 600]];
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 3,
    vo: 'Deja de fumar vape de una puta vez.',
    C: E3.escena({
      tomas: [[0, {
        az: 20,
        el: 6,
        dist: 3.4,
        y: 1.6
      }], [1, {
        az: 12,
        el: 5,
        dist: 6.6,
        y: 1.2
      }]],
      golpes: TOSES,
      vista: function (T, f) {
        var tos = Math.max(pulso(T, f(TOSES[0]), 0.22), pulso(T, f(TOSES[1]), 0.22));
        var p = vapea({
          cadera: [0, 1.0 + 0.03 * tos, 0],
          tronco: [6 * tos, 0, 0],
          manoI: [-0.3 + 0.1 * Math.sin(T * 13), 1.5, 0.35],
          codoI: [1, -1, 0]
        });
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            cara: {
              ojos: 'grandes',
              boca: T < f(0.1) ? 'o' : 'abierta',
              cejas: 'alzadas'
            }
          }],
          objetos: [vapeEnMano(p)]
        };
      },
      lienzo: function (T, f, t, pr) {
        A.sonido('tos', f(TOSES[0]));
        A.sonido('tos', f(TOSES[1]));
        var v = animate({
          from: 0,
          to: 1,
          start: f(0.1),
          end: f(0.5),
          ease: Easing.easeOutCubic
        })(T);
        var cab = pr('cabeza');
        var sc = clamp(Math.abs(pr([0, 2.06, 0])[1] - pr([0, 0, 0])[1]) / 1170, 0.6, 1.8);
        return nube([cab[0], cab[1] + 70 * sc], T, v, {
          n: 12,
          r: 190 * sc,
          ancho: 330 * sc,
          alto: 300 * sc
        });
      },
      mal: [{
        x: 70,
        y: 1010,
        cuando: 0.24,
        s: 0.6
      }, {
        x: 850,
        y: 1120,
        cuando: 0.46,
        s: 0.5
      }],
      r1: {
        text: '*VAPE*',
        s: 1.3,
        cuando: 0.02,
        tono: 'rojo'
      },
      r2: {
        text: '¡COF, COF!',
        s: 1.15,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'No es vapor de agua',
    dur: 5.6,
    vo: 'Entiende que el vape no es vapor de agua con sabor. Lleva nicotina, metales y partículas que llegan al fondo de tus pulmones.',
    C: E3.escena({
      tomas: [[0, {
        az: -10,
        el: 4,
        dist: 10.0,
        y: 2.5,
        dx: -1.0
      }], [1, {
        az: -4,
        el: 4,
        dist: 10.2,
        y: 2.45,
        dx: -1.0
      }]],
      vista: function (T, f) {
        var entra = T > f(0.56);
        return {
          figuras: [{
            quien: 'tor',
            oculto: !entra,
            pose: depie({
              hombros: {
                sube: 0.3
              }
            }),
            cara: {
              ojos: 'grandes',
              boca: 'abierta',
              cejas: 'triste'
            }
          }]
        };
      },
      lienzo: function (T, f) {
        return particulas(T, [540, 540], animate({
          from: 0,
          to: 1,
          start: f(0.12),
          end: f(0.24)
        })(T));
      },
      piezas: [{
        C: N.ICONOS.pulmones,
        s: 2.2,
        x: 276,
        y: 540,
        p: function (T, f) {
          return {
            humo: animate({
              from: 0,
              to: 1,
              start: f(0.2),
              end: f(0.7)
            })(T)
          };
        }
      }, {
        C: N.ICONOS.vape,
        s: 0.9,
        x: 432,
        y: 356,
        cuando: 0.04,
        quieto: true
      }, {
        C: N.ICONOS.gota,
        s: 0.95,
        x: 60,
        y: 1080,
        cuando: 0.08
      }],
      mal: [{
        x: 96,
        y: 1104,
        cuando: 0.3,
        s: 0.72
      }],
      r1: {
        text: 'NO ES VAPOR DE *AGUA*',
        s: 0.98,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: '*NICOTINA* Y METALES',
        s: 1.05,
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Engancha',
    dur: 5,
    vo: 'El vape puede ser más adictivo que el cigarro. Un solo vape puede traer la nicotina de varias cajetillas de cigarro.',
    C: E3.escena({
      tomas: [[0, {
        az: 14,
        el: 4,
        dist: 9.4,
        y: 2.2,
        dx: 0.85
      }], [1, {
        az: 24,
        el: 4,
        dist: 9.0,
        y: 2.2,
        dx: 0.85
      }]],
      vista: function (T, f) {
        var p = vapea();
        return {
          figuras: [{
            quien: 'tor',
            oculto: T < f(0.5),
            pose: p,
            cara: {
              ojos: 'espiral',
              boca: 'o'
            }
          }],
          objetos: T < f(0.5) ? [] : [vapeEnMano(p)],
          vibra: true
        };
      },
      piezas: [{
        C: N.ICONOS.vape,
        s: 1.7,
        x: 40,
        y: 380
      }].concat(PAQUETES.map(function (q, i) {
        return {
          C: N.ICONOS.cajetilla,
          s: 0.82,
          x: q[0],
          y: q[1],
          cuando: 0.36 + i * 0.1,
          fase: i * 0.2
        };
      })),
      lienzo: function (T, f) {
        var e = M.pop(T, f(0.28), 0.4);
        return e.opacity > 0.02 ? /*#__PURE__*/React.createElement("g", {
          opacity: e.opacity,
          transform: 'translate(500 600) scale(' + e.scale.toFixed(3) + ')'
        }, /*#__PURE__*/React.createElement("path", {
          d: "M -40 -20 L 40 -20 M -40 20 L 40 20",
          stroke: C.INK,
          strokeWidth: 20,
          strokeLinecap: "round"
        })) : null;
      },
      r1: {
        text: 'LA NICOTINA *ENGANCHA*',
        s: 0.98,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: '1 VAPE = *VARIAS CAJETILLAS*',
        s: 0.88,
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Tu cuerpo',
    dur: 4.6,
    vo: '¿Cuál es el resultado? Más tos, más pulso acelerado y menos aire cuando entrenas.',
    C: E3.escena({
      tomas: [[0, {
        az: -16,
        el: 6,
        dist: 8.6,
        y: 1.6,
        dx: 0
      }], [1, {
        az: -6,
        el: 6,
        dist: 8.8,
        y: 1.6,
        dx: 0
      }]],
      golpes: [0.2, 0.5],
      vista: function (T, f) {
        var tos = Math.max(pulso(T, f(0.2), 0.22), pulso(T, f(0.5), 0.22));
        A.sonido('tos', f(0.2));
        A.sonido('tos', f(0.5));
        var p = depie({
          cadera: [0, 1.0 + 0.03 * tos, 0],
          tronco: [10 * tos, 0, 0],
          manoD: [0.12, 1.5, 0.3],
          codoD: [0.8, -1, 0]
        });
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            cara: {
              ojos: 'llanto',
              boca: tos > 0.05 ? 'abierta' : 'ondulada',
              cejas: 'triste'
            }
          }],
          tos: Math.max(pulso(T, f(0.2), 0.6), pulso(T, f(0.5), 0.6))
        };
      },
      lienzo: function (T, f, t, pr, info) {
        var h = pr('cabeza'),
          p = M.draw(T, f(0.14), 0.7),
          L = 520;
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: "M 30 650 L 80 650 L 104 600 L 132 700 L 160 620 L 184 650 L 234 650 L 258 590 L 286 706 L 312 650 L 340 650",
          fill: "none",
          stroke: C.RED,
          strokeWidth: 12,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: L,
          strokeDashoffset: L * (1 - p)
        }), nube([h[0] + 130, h[1] + 80], T, info.tos, {
          n: 6,
          r: 70,
          ancho: 110,
          alto: 80
        }), /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: h,
          v: 1
        }));
      },
      piezas: [{
        C: P.Corazon,
        s: 2.0,
        x: 50,
        y: 400,
        cuando: 0.1,
        p: function (T) {
          return {
            beat: 1 + 0.16 * Math.abs(Math.sin(T * 13))
          };
        }
      }, {
        C: N.ICONOS.pulmones,
        s: 0.95,
        x: 800,
        y: 390,
        cuando: 0.3,
        p: {
          humo: 1
        }
      }, {
        C: P.Medidor,
        s: 0.8,
        x: 744,
        y: 650,
        cuando: 0.4,
        p: function (T, f) {
          return {
            p: animate({
              from: 0.9,
              to: 0.22,
              start: f(0.46),
              end: f(0.82)
            })(T)
          };
        }
      }],
      mal: [{
        x: 850,
        y: 900,
        cuando: 0.62,
        s: 0.55
      }],
      r1: {
        text: 'MÁS TOS Y MÁS *PULSO*',
        s: 0.98,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'MENOS AIRE AL *ENTRENAR*',
        s: 0.95,
        cuando: 0.5
      }
    })
  }, {
    nombre: '¿Mejor que el cigarro?',
    dur: 5.6,
    vo: '¿El vape es mejor que el cigarro? Quizás sea menos tóxico que el cigarro, pero engancha igual o peor que el cigarro. Simplemente ninguna de las dos te conviene.',
    C: E3.escena({
      tomas: [[0, {
        az: 6,
        el: 4,
        dist: 8.8,
        y: 2.05
      }], [1, {
        az: 16,
        el: 4,
        dist: 8.6,
        y: 2.05
      }]],
      vista: function () {
        return {
          figuras: [{
            quien: 'tor',
            pose: hombrosArriba(),
            cara: {
              boca: 'ondulada',
              cejas: 'alzadas'
            }
          }]
        };
      },
      piezas: [{
        C: N.ICONOS.cajetilla,
        s: 1.4,
        x: 100,
        y: 450
      }, {
        C: N.ICONOS.vape,
        s: 1.4,
        x: 640,
        y: 450
      }],
      lienzo: function (T, f) {
        return /*#__PURE__*/React.createElement("g", null, PL.versus(T, f, {
          y0: 400,
          y1: 820,
          yVs: 620
        }), /*#__PURE__*/React.createElement(V.Humo, {
          T: T,
          c: [268, 510],
          v: 1,
          alto: 150,
          viento: -30
        }), nube([850, 500], T, 0.8 + 0.2 * Math.sin(T * 2), {
          n: 6,
          r: 44,
          ancho: 80,
          alto: 40
        }));
      },
      mal: [{
        x: 196,
        y: 560,
        cuando: 0.56,
        s: 0.75
      }, {
        x: 736,
        y: 560,
        cuando: 0.68,
        s: 0.75
      }],
      r1: {
        text: '¿MEJOR QUE EL *CIGARRO*?',
        s: 0.95,
        cuando: 0.02
      },
      r2: {
        text: 'NINGUNO ES *SANO*',
        s: 1.1,
        cuando: 0.66,
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'Al tacho',
    dur: 5,
    vo: 'Así que ya sabes, deja el vape y tíralo a la basura, tus pulmones te lo van a agradecer.',
    C: E3.escena({
      tomas: [[0, {
        az: -18,
        el: 8,
        dist: 7.2,
        y: 1.2,
        dx: -0.3
      }], [0.56, {
        az: -12,
        el: 8,
        dist: 7.4,
        y: 1.15,
        dx: -0.35
      }], [1, {
        az: -4,
        el: 6,
        dist: 7.6,
        y: 1.15,
        dx: -0.35
      }]],
      golpes: [0.52],
      vista: function (T, f) {
        var arma = animate({
          from: 0,
          to: 1,
          start: f(0.16),
          end: f(0.3),
          ease: Easing.easeInOutCubic
        })(T);
        var lanza = clamp((T - f(0.3)) / (f(0.52) - f(0.3)), 0, 1);
        var vuelve = animate({
          from: 0,
          to: 1,
          start: f(0.5),
          end: f(0.6)
        })(T);
        var festeja = animate({
          from: 0,
          to: 1,
          start: f(0.62),
          end: f(0.76),
          ease: Easing.easeOutBack
        })(T);
        A.sonido('whoosh', f(0.3));
        A.sonido('golpe', f(0.52));
        var tapa = clamp(1 - Math.abs((T - f(0.52)) / 0.25), 0, 1);
        var TACHO = [-1.05, 0, 0.15];
        var p;
        if (festeja > 0.01) p = E3.poseFlex(festeja);else {
          var a = E3.lerp3([0.5, 1.4, 0.15], [0.62, 1.72, -0.15], arma),
            b = [-0.15, 1.35, 0.45];
          var m = lanza > 0 ? E3.lerp3(a, b, Easing.easeOutCubic(clamp(lanza * 3, 0, 1))) : a;
          m = E3.lerp3(m, [0.34, 0.83, 0.08], vuelve);
          p = depie({
            manoD: m,
            codoD: [0.8, -1, -0.2],
            tronco: [0, -10 * arma + 18 * clamp(lanza * 3, 0, 1) * (1 - vuelve), 0]
          });
        }
        var obj = [{
          tipo: 'tacho',
          p: TACHO,
          abre: tapa
        }];
        if (lanza < 1 && festeja < 0.01) {
          if (lanza > 0) {
            var k = Easing.easeInQuad(lanza),
              d0 = [-0.15, 1.4, 0.45],
              d1 = [TACHO[0], 0.75, TACHO[2]];
            var q = E3.lerp3(d0, d1, k);
            q[1] += 0.7 * Math.sin(Math.PI * lanza);
            obj.push({
              tipo: 'vape',
              p: q,
              inclina: 70 + 620 * lanza,
              giro: -40,
              s: 1.6
            });
          } else obj.push(vapeEnMano(p));
        }
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            musc: {
              biceps: festeja > 0.3 ? true : null,
              brillo: 0.3
            },
            cara: {
              boca: festeja > 0.3 ? 'sonrisa' : 'recta',
              cejas: festeja > 0.3 ? null : 'enojo'
            }
          }],
          objetos: obj
        };
      },
      lienzo: function (T, f, t, pr) {
        var tc = pr([-1.05, 0.7, 0.15]);
        var e2 = M.pop(T, f(0.66), 0.42),
          limpio = M.pop(T, f(0.7), 0.42);
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: tc,
          cuando: f(0.52),
          r: 150
        }), limpio.opacity > 0.02 ? /*#__PURE__*/React.createElement("g", {
          opacity: limpio.opacity,
          transform: 'translate(190 620) scale(' + limpio.scale.toFixed(3) + ')'
        }, /*#__PURE__*/React.createElement("g", {
          transform: 'translate(-150 ' + (-150 + M.life(T, 3, 6)).toFixed(1) + ') scale(1.25)'
        }, /*#__PURE__*/React.createElement(N.ICONOS.pulmones, {
          s: 1
        }))) : null, /*#__PURE__*/React.createElement(V.Brillo, {
          T: T,
          c: [190, 640],
          r: 150,
          color: C.GRN,
          v: clamp((T - f(0.74)) / 0.3, 0, 1)
        }), /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('cabeza'),
          cuando: f(0.76),
          r: 160
        }));
      },
      bien: [{
        x: 860,
        y: 600,
        cuando: 0.78,
        s: 0.85
      }],
      r1: {
        text: 'EL VAPE, A LA *BASURA*',
        s: 1.0,
        cuando: null
      },
      r2: {
        text: 'RESPIRA *LIBRE*',
        s: 1.1,
        cuando: 0.64,
        tono: 'verde'
      }
    })
  }];
  global.REELS.registrar({
    id: 'vape-3d',
    escenario: 'calle',
    titulo: 'No fumes más vape (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿QUIÉN NO SUELTA EL VAPE?',
      vo: 'Guarda este video y mándaselo a aquel amigo que sabe que no suelta el vape y no ha podido dejar el vicio.'
    }
  });
})(window);
