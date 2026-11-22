/* GENERADO por compilar.js desde ex-3d.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   EX — TOR EN 3D (mismo guion que ex.jsx)
   "No llores mas por tu ex": Tor en el sofa llorando con el helado; el
   despecho sube el cortisol; el chiste del mejor pre-entreno; todos se
   vuelven adictos al gimnasio; usarlo a favor; y el cierre: ve la foto,
   apaga el celular y se va a entrenar.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    N = global.N,
    V = global.V,
    E3 = global.E3,
    TOR3D = global.TOR3D;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var A = global.REELS.ayudas;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };
  function aArr(q) {
    return [q.x, q.y, q.z];
  }
  function icono(Cmp, c, k, ang, props) {
    return /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + (ang || 0).toFixed(1) + ') scale(' + k + ') translate(-120 -120)'
    }, /*#__PURE__*/React.createElement(Cmp, _extends({
      s: 1
    }, props || {})));
  }
  // lagrimas de caricatura: dos chorros que salen de los ojos hacia los costados (c = la cabeza en pantalla)
  function lagrimas(c, T, v, k) {
    if (v < 0.02) return null;
    var gotas = [],
      e = k || 1;
    [-1, 1].forEach(function (l) {
      for (var i = 0; i < 5; i++) {
        var u = (T * 1.5 + i / 5 + (l > 0 ? 0.1 : 0)) % 1;
        var x = c[0] + l * (30 + 210 * u) * e,
          y = c[1] - 4 - 110 * u * e + 470 * u * u * e;
        var a = Math.atan2(940 * u - 110, l * 210) * 180 / Math.PI - 90;
        gotas.push(/*#__PURE__*/React.createElement("g", {
          key: l + '-' + i,
          transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + a.toFixed(1) + ') scale(' + ((0.8 - 0.25 * u) * e).toFixed(2) + ')',
          opacity: v * (1 - u * u * u)
        }, /*#__PURE__*/React.createElement("path", {
          d: "M 0 -26 C 12 -8 16 4 16 10 C 16 20 8 26 0 26 C -8 26 -16 20 -16 10 C -16 4 -12 -8 0 -26 Z",
          fill: BLANCO,
          stroke: C.INK,
          strokeWidth: 8,
          strokeLinejoin: "round"
        })));
      }
    });
    return /*#__PURE__*/React.createElement("g", null, gotas);
  }
  function bollito(x, y, k, giro) {
    return /*#__PURE__*/React.createElement("g", {
      key: x + '-' + y,
      transform: 'translate(' + x + ' ' + y + ') rotate(' + (giro || 0) + ') scale(' + k + ')'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M -34 6 Q -40 -22 -14 -28 Q 4 -44 24 -26 Q 44 -14 34 10 Q 30 32 4 30 Q -22 36 -34 6 Z",
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 10,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M -14 -6 Q -2 2 8 -10 M -4 14 Q 8 8 18 16",
      fill: "none",
      stroke: C.GRY,
      strokeWidth: 7,
      strokeLinecap: "round"
    }));
  }
  function barraCortisol(T, f) {
    var e = M.pop(T, f(0.08), 0.42);
    if (e.opacity < 0.02) return null;
    var p = animate({
      from: 0.2,
      to: 0.95,
      start: f(0.14),
      end: f(0.5),
      ease: Easing.easeInOutCubic
    })(T);
    var alto = 420 * p;
    return /*#__PURE__*/React.createElement("g", {
      opacity: e.opacity,
      transform: 'translate(150 ' + (760 + M.life(T, 3, 5)).toFixed(1) + ') scale(' + e.scale.toFixed(3) + ')'
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: -50,
      y: -230,
      width: 100,
      height: 460,
      rx: 34,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("rect", {
      x: -30,
      y: 210 - alto,
      width: 60,
      height: alto,
      rx: 22,
      fill: C.RED
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M 110 ' + (120 - 240 * p).toFixed(1) + ' l 0 -110 m -44 44 l 44 -46 l 44 46',
      fill: "none",
      stroke: C.RED,
      strokeWidth: 22,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }
  function semanaGym(T, f) {
    var dias = [];
    for (var i = 0; i < 7; i++) {
      var e = i === 0 ? M.pop(T, f(0) - 0.6, 0.5) : M.pop(T, f(0.04 + i * 0.05), 0.4);
      if (e.opacity < 0.02) continue;
      var x = 96 + i % 4 * 228 + (i > 3 ? 114 : 0),
        y = i > 3 ? 660 : 450;
      var hecho = clamp((T - f(0.34 + i * 0.06)) / 0.25, 0, 1);
      dias.push(/*#__PURE__*/React.createElement("g", {
        key: i,
        opacity: e.opacity,
        transform: 'translate(' + (x + 100) + ' ' + (y + 90 + M.life(T, 3, 5, i * 0.2)).toFixed(1) + ') scale(' + e.scale.toFixed(3) + ')'
      }, /*#__PURE__*/React.createElement("rect", _extends({
        x: -94,
        y: -86,
        width: 188,
        height: 172,
        rx: 28,
        fill: hecho > 0 ? C.YEL : BLANCO
      }, LN, {
        strokeWidth: 13
      })), /*#__PURE__*/React.createElement("g", {
        transform: "translate(-76 -30) scale(0.36)"
      }, /*#__PURE__*/React.createElement(P.Pesa, {
        s: 1
      })), hecho > 0 ? /*#__PURE__*/React.createElement("g", {
        transform: 'translate(62 56) scale(' + Easing.easeOutBack(hecho).toFixed(3) + ')'
      }, /*#__PURE__*/React.createElement("circle", {
        cx: 0,
        cy: 0,
        r: 32,
        fill: C.GRN,
        stroke: C.INK,
        strokeWidth: 9
      }), /*#__PURE__*/React.createElement("path", {
        d: "M -14 1 L -3 12 L 15 -10",
        fill: "none",
        stroke: BLANCO,
        strokeWidth: 10,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      })) : null));
    }
    return /*#__PURE__*/React.createElement("g", null, dias);
  }
  function vapor(c, T, v) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Humo, {
      T: T * 2.4,
      c: [c[0] - 70, c[1] - 6],
      v: v,
      alto: 200,
      viento: -150
    }), /*#__PURE__*/React.createElement(V.Humo, {
      T: T * 2.4 + 1,
      c: [c[0] + 70, c[1] - 6],
      v: v,
      alto: 200,
      viento: 150
    }));
  }

  /* ---------------- poses ---------------- */
  var SOFA = {
    tipo: 'sofa',
    p: [0, 0, -0.12]
  };
  function sentado(extra) {
    return Object.assign({
      cadera: [0, 0.63, -0.02],
      tronco: [-10, 0, 0],
      cabeza: [4, 0, 0],
      pieI: [-0.22, 0.115, 0.52],
      pieD: [0.22, 0.115, 0.52]
    }, extra || {});
  }
  function depie(extra) {
    return Object.assign({
      cadera: [0, 1.0, 0],
      pieI: [-0.2, 0.115, 0.03],
      pieD: [0.2, 0.115, 0.03]
    }, extra || {});
  }
  function mezcla(a, b, k) {
    var r = {};
    Object.keys(b).forEach(function (q) {
      var x = a[q],
        y = b[q];
      if (Array.isArray(y) && Array.isArray(x)) r[q] = y.map(function (v, i) {
        return (x[i] || 0) + (v - (x[i] || 0)) * k;
      });else r[q] = k < 0.5 && x != null ? x : y;
    });
    return r;
  }
  // gancho: la cuchara va a la boca
  function poseHelado(T) {
    var k = Math.pow(Math.max(0, Math.sin(T * 2.6)), 2);
    var p = sentado({
      tronco: [-10, 0, 4 * Math.sin(T * 2.4)],
      cabeza: [6 - 10 * k, 0, 4 * Math.sin(T * 2.4)],
      manoI: [-0.16, 0.86, 0.38],
      codoI: [1, -0.3, 0],
      manoD: E3.lerp3([0.16, 0.9, 0.4], [0.06, 1.38, 0.24], k),
      codoD: [1, -1, 0]
    });
    p._k = k;
    return p;
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 3,
    vo: 'No llores más por tu ex.',
    C: E3.escena({
      tomas: [[0, {
        az: 18,
        el: 8,
        dist: 3.6,
        y: 1.35
      }], [1, {
        az: 10,
        el: 8,
        dist: 6.4,
        y: 1.0
      }]],
      vista: function (T) {
        var p = poseHelado(T),
          J = TOR3D.esqueleto(p);
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            cara: {
              ojos: 'llanto',
              boca: p._k > 0.75 ? 'o' : 'abierta',
              cejas: 'triste'
            }
          }],
          objetos: [SOFA, {
            tipo: 'manta',
            p: [0, 0.73, 0.28],
            ancho: 0.78,
            largo: 0.5,
            inclina: -6,
            alto: 0.5
          }, {
            tipo: 'helado',
            p: aArr(J.manoI.clone().add(TOR3D.v(0.05, 0.06, 0.02))),
            s: 1.2
          }, {
            tipo: 'celular',
            p: [-0.6, 0.56, 0.12],
            inclina: -84,
            giro: 20
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
        A.sonido('llanto', f(0.1));
        return /*#__PURE__*/React.createElement("g", null, lagrimas(pr('cabeza'), T, 1), bollito(140, 1420, 1, 20), bollito(290, 1470, 0.8, -30), bollito(910, 1440, 0.9, 60), bollito(780, 1480, 0.7, 10));
      },
      piezas: [{
        C: N.ICONOS.panuelos,
        s: 0.8,
        x: 800,
        y: 1080,
        cuando: 0.1
      }, {
        C: N.ICONOS.corazonRoto,
        s: 0.6,
        x: 60,
        y: 1040,
        cuando: 0.16,
        p: {
          k: 1
        }
      }],
      mal: [{
        x: 70,
        y: 430,
        cuando: 0.22,
        s: 0.6
      }, {
        x: 860,
        y: 560,
        cuando: 0.46,
        s: 0.5
      }],
      r1: {
        text: 'TU *EX*',
        s: 1.25,
        cuando: 0.02,
        tono: 'rojo'
      },
      r2: {
        text: '¡BUAAA!',
        s: 1.15,
        cuando: 0.3
      }
    })
  }, {
    nombre: 'Cortisol',
    dur: 5,
    vo: 'El despecho te sube el cortisol, duermes peor y comes peor: así se pierde músculo.',
    C: E3.escena({
      tomas: [[0, {
        az: -12,
        el: 6,
        dist: 7.0,
        y: 1.2,
        dx: -0.25
      }], [1, {
        az: -4,
        el: 6,
        dist: 7.4,
        y: 1.15,
        dx: -0.25
      }]],
      vista: function (T, f) {
        var g = animate({
          from: 0,
          to: 1,
          start: f(0.5),
          end: f(0.8)
        })(T);
        var fl = 1 - 0.55 * animate({
          from: 0,
          to: 1,
          start: f(0.5),
          end: f(0.85),
          ease: Easing.easeInOutCubic
        })(T);
        return {
          figuras: [{
            quien: 'tor',
            pose: E3.poseFlex(fl),
            musc: {
              biceps: g > 0.5 ? 'gris' : true,
              brillo: 0.2 * (1 - g)
            },
            cara: {
              boca: 'triste',
              cejas: 'triste'
            }
          }],
          gota: g
        };
      },
      lienzo: function (T, f, t, pr, info) {
        return /*#__PURE__*/React.createElement("g", null, barraCortisol(T, f), /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: pr('cabeza'),
          v: clamp(info.gota * 3, 0, 1)
        }));
      },
      piezas: [{
        C: N.ICONOS.luna,
        s: 0.8,
        x: 850,
        y: 400,
        cuando: 0.26
      }, {
        C: N.ICONOS.helado,
        s: 0.8,
        x: 850,
        y: 640,
        cuando: 0.4
      }],
      mal: [{
        x: 880,
        y: 430,
        cuando: 0.32,
        s: 0.5
      }, {
        x: 880,
        y: 670,
        cuando: 0.46,
        s: 0.5
      }],
      r1: {
        text: 'SUBE EL *CORTISOL*',
        s: 1.05,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'BAJA EL *MÚSCULO*',
        s: 1.05,
        cuando: 0.56,
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'Pre-entreno',
    dur: 5,
    vo: 'Aunque dicen que acordarte de tu ex es el mejor pre-entreno que existe.',
    C: E3.escena({
      tomas: [[0, {
        az: 20,
        el: 6,
        dist: 3.6,
        y: 1.55
      }], [0.3, {
        az: 14,
        el: 6,
        dist: 3.8,
        y: 1.55
      }], [0.5, {
        az: 10,
        el: 4,
        dist: 7.2,
        y: 1.3
      }], [1, {
        az: 22,
        el: 4,
        dist: 6.8,
        y: 1.3
      }]],
      vista: function (T, f) {
        var rabia = animate({
          from: 0,
          to: 1,
          start: f(0.2),
          end: f(0.34)
        })(T);
        if (T < f(0.34)) {
          var p = depie({
              manoD: [0.08, 1.42, 0.36],
              codoD: [0.6, -1, 0],
              cabeza: [-8, 0, 0]
            }),
            J = TOR3D.esqueleto(p);
          return {
            figuras: [{
              quien: 'tor',
              pose: p,
              cara: T < f(0.22) ? {
                ojos: 'grandes',
                boca: 'ondulada',
                cejas: 'triste'
              } : {
                boca: 'dientes',
                cejas: 'enojo',
                color: {
                  c: 'rojo',
                  v: 0.6 * rabia
                }
              }
            }],
            objetos: [{
              tipo: 'celular',
              p: aArr(J.manoD.clone().add(TOR3D.v(-0.02, 0.09, 0.02))),
              inclina: 10,
              giro: 180
            }],
            rabia: rabia
          };
        }
        var k = V.ida(V.fase(T, f(0.4), f(0.96), 3), 0.35, 0.15),
          y = 1.36 + 0.7 * k;
        var q = depie({
          manoI: [-0.44, y, 0.14],
          manoD: [0.44, y, 0.14],
          codoI: [1, -0.6, -0.2],
          codoD: [1, -0.6, -0.2]
        });
        return {
          figuras: [{
            quien: 'tor',
            pose: q,
            musc: {
              deltoides: true,
              biceps: true,
              pecho: 'claro',
              brillo: 0.3 * k
            },
            cara: {
              boca: 'dientes',
              cejas: 'enojo',
              color: {
                c: 'rojo',
                v: 0.6
              }
            }
          }],
          objetos: [{
            tipo: 'barra',
            c: [0, y + 0.02, 0.14],
            eje: [1, 0, 0]
          }],
          rabia: 1,
          k: k
        };
      },
      lienzo: function (T, f, t, pr, info) {
        var h = pr('cabeza');
        return /*#__PURE__*/React.createElement("g", null, vapor(h, T, info.rabia), info.k != null ? E3.brilla(T, pr, ['m:deltoides:0', 'm:deltoides:1'], info.k, false, 70) : null);
      },
      piezas: [{
        C: N.ICONOS.fuego,
        s: 0.9,
        x: 40,
        y: 1090,
        cuando: 0.36,
        fase: 0.1
      }, {
        C: N.ICONOS.fuego,
        s: 0.7,
        x: 850,
        y: 1170,
        cuando: 0.44,
        fase: 0.5
      }, {
        C: N.ICONOS.bote,
        s: 0.85,
        x: 60,
        y: 400,
        cuando: 0.5,
        p: {
          color: C.RED
        }
      }],
      r1: {
        text: 'EL MEJOR *PRE-ENTRENO*',
        s: 0.95,
        cuando: 0.16
      },
      r2: {
        text: '¡GRACIAS, *EX*!',
        s: 1.15,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Adictos al gym',
    dur: 4.6,
    vo: 'Por algo, después de una ruptura, todos se vuelven adictos al gimnasio.',
    C: E3.escena({
      tomas: [[0, {
        az: 14,
        el: 6,
        dist: 8.6,
        y: 2.05
      }], [1, {
        az: 26,
        el: 6,
        dist: 8.2,
        y: 2.1
      }]],
      vista: function (T, f) {
        var k = V.ida(V.fase(T, f(0.36), f(0.98), 3), 0.4, 0.2),
          entra = T > f(0.3);
        return {
          figuras: [{
            quien: 'tor',
            oculto: !entra,
            pose: E3.poseFlex(0.4 + 0.6 * k),
            musc: {
              biceps: true,
              brillo: 0.3 * k
            },
            cara: {
              boca: 'dientes',
              cejas: 'enojo'
            }
          }],
          k: k
        };
      },
      lienzo: function (T, f, t, pr, info) {
        return /*#__PURE__*/React.createElement("g", null, semanaGym(T, f), T > f(0.3) ? E3.brilla(T, pr, ['m:biceps:0', 'm:biceps:1'], info.k, false, 60) : null);
      },
      r1: {
        text: 'MODO *RUPTURA*',
        s: 1.15,
        cuando: 0.02
      },
      r2: {
        text: 'GYM LOS *7 DÍAS*',
        s: 1.05,
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Úsalo a tu favor',
    dur: 4.8,
    vo: 'Úsalo a tu favor: entrena con todo, pero descansa, come bien y duerme.',
    C: E3.escena({
      tomas: [[0, {
        az: -16,
        el: 6,
        dist: 6.6,
        y: 1.25
      }], [1, {
        az: 10,
        el: 6,
        dist: 7.0,
        y: 1.2
      }]],
      vista: function (T, f) {
        var fl = 0.3 + 0.7 * Easing.easeOutBack(animate({
          from: 0,
          to: 1,
          start: f(0.06),
          end: f(0.3)
        })(T));
        return {
          figuras: [{
            quien: 'tor',
            pose: E3.poseFlex(fl),
            musc: {
              biceps: true,
              brillo: 0.3
            },
            cara: {
              boca: 'sonrisa'
            }
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
        return /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('cabeza'),
          cuando: f(0.3),
          r: 190
        });
      },
      piezas: [{
        C: P.Pesa,
        s: 0.5,
        x: 30,
        y: 430,
        cuando: 0.2
      }, {
        C: N.ICONOS.luna,
        s: 0.85,
        x: 836,
        y: 400,
        cuando: 0.42
      }, {
        C: N.COMIDA.pollo,
        s: 0.7,
        plato: 0.62,
        x: 20,
        y: 1130,
        cuando: 0.56
      }, {
        C: N.ICONOS.calendario,
        s: 0.9,
        x: 830,
        y: 1150,
        cuando: 0.68
      }],
      bien: [{
        x: 850,
        y: 760,
        cuando: 0.78,
        s: 0.7
      }],
      r1: {
        text: 'ÚSALO A TU *FAVOR*',
        s: 1.05,
        cuando: 0.04
      },
      r2: {
        text: 'ENTRENA, COME Y *DUERME*',
        s: 0.95,
        cuando: 0.5,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'A entrenar',
    dur: 5.2,
    vo: 'Y cuando veas su foto... apaga el celular, y a entrenar.',
    C: E3.escena({
      tomas: [[0, {
        az: 16,
        el: 8,
        dist: 4.0,
        y: 1.3
      }], [0.34, {
        az: 18,
        el: 8,
        dist: 4.2,
        y: 1.3
      }], [0.6, {
        az: 8,
        el: 6,
        dist: 7.4,
        y: 1.1,
        dx: 0.5
      }], [1, {
        az: 12,
        el: 6,
        dist: 7.8,
        y: 1.1,
        dx: 0.7
      }]],
      vista: function (T, f) {
        var apaga = T >= f(0.3);
        var tira = clamp((T - f(0.36)) / (f(0.48) - f(0.36)), 0, 1);
        var para = animate({
          from: 0,
          to: 1,
          start: f(0.46),
          end: f(0.56),
          ease: Easing.easeOutBack
        })(T);
        var sale = Easing.easeInCubic(clamp((T - f(0.62)) / (f(0.84) - f(0.62)), 0, 1));
        A.sonido('pop', f(0.3));
        A.sonido('whoosh', f(0.62));
        var s0 = sentado({
          manoI: [-0.1, 1.15, 0.34],
          manoD: [0.1, 1.15, 0.34],
          codoI: [1, -1, 0],
          codoD: [1, -1, 0],
          cabeza: [-14, 0, 0]
        });
        var dx = 2.6 * sale,
          paso = sale > 0 ? Math.sin(T * 14) : 0;
        var s1 = depie({
          cadera: [dx, 1.0 + 0.02 * Math.abs(paso), 0.25],
          tronco: [4, 70 * clamp(sale * 4, 0, 1), 0],
          pieI: [dx - 0.12 + 0.18 * paso * (sale > 0 ? 1 : 0), 0.115, 0.28],
          pieD: [dx + 0.12 - 0.18 * paso * (sale > 0 ? 1 : 0), 0.115, 0.22],
          manoD: [dx + 0.36, 0.84, 0.3],
          codoD: [0.35, 0.2, -1]
        });
        var p = para > 0.02 ? mezcla(s0, s1, clamp(para, 0, 1)) : s0;
        var J = TOR3D.esqueleto(p);
        var c0 = J.manoI.clone().add(J.manoD).multiplyScalar(0.5).add(TOR3D.v(0, 0.1, 0.04));
        var c1 = TOR3D.v(-0.55, 0.58, 0.1),
          cc = c0.clone().lerp(c1, tira);
        cc.y += 0.5 * Math.sin(Math.PI * tira);
        var triste = !apaga;
        var obj = [SOFA, {
          tipo: 'helado',
          p: [0.5, 0.6, 0.05],
          s: 1.1
        }, {
          tipo: 'celular',
          p: aArr(tira < 1 ? cc : c1),
          inclina: tira < 1 ? 10 - 94 * tira : -84,
          giro: 180 - 160 * tira,
          prendido: !apaga
        }];
        if (para > 0.6) obj.push({
          tipo: 'mancuerna',
          p: aArr(J.manoD),
          eje: [0, 0, 1]
        });
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            musc: {
              biceps: para > 0.5 ? true : null
            },
            cara: triste ? {
              ojos: 'grandes',
              boca: 'ondulada',
              cejas: 'triste'
            } : {
              boca: para > 0.5 ? 'sonrisa' : 'recta',
              cejas: para > 0.3 ? 'enojo' : null
            }
          }],
          objetos: obj,
          triste: triste,
          sale: sale
        };
      },
      lienzo: function (T, f, t, pr, info) {
        var h = pr('cabeza');
        return /*#__PURE__*/React.createElement("g", null, info.triste ? lagrimas(h, T * 0.5, 0.5, 0.8) : null, info.sale > 0.02 ? /*#__PURE__*/React.createElement(V.Lineas, {
          c: [h[0] - 160, h[1] + 200],
          dir: [1, 0],
          v: 1,
          largo: 200
        }) : null, /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: [h[0], h[1] + 200],
          cuando: f(0.3),
          r: 150
        }), bollito(150, 1420, 1, 20), bollito(300, 1466, 0.8, -30), bollito(900, 1440, 0.9, 60));
      },
      bien: [{
        x: 800,
        y: 520,
        cuando: 0.86,
        s: 0.9
      }],
      r1: {
        text: '¿SU *FOTO*?',
        s: 1.2,
        cuando: null
      },
      r2: {
        text: '¡A *ENTRENAR*!',
        s: 1.15,
        cuando: 0.56,
        tono: 'verde'
      }
    })
  }];
  global.REELS.registrar({
    id: 'ex-3d',
    titulo: 'No llores más por tu ex (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿CONOCES A UN DESPECHADO?',
      vo: 'Mándaselo a ese amigo despechado, y guarda este video.'
    }
  });
})(window);
