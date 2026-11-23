/* GENERADO por compilar.js desde calistenia-gym-3d.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   ¿CALISTENIA O GIMNASIO? — TOR EN 3D (mismo guion que calistenia-gym.jsx)
   Los dos Tors en paralelo: a la izquierda calistenia (short negro, la barra
   del parque), a la derecha gimnasio (short amarillo, mancuernas y barra).
   Lo que dice la evidencia, sin exagerar: los dos construyen musculo; en el
   gimnasio es mas facil sumar carga (sobre todo piernas); fuerza maxima:
   gimnasio; fuerza relativa: calistenia; costo: calistenia casi gratis;
   variedad: gimnasio; movilidad y control: suele ganar la calistenia;
   veredicto: el que vas a hacer constante, o combinar los dos. La escena de
   flexibilidad del 2D no va: Victor no la grabo.
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
    E3 = global.E3;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };
  var ROPA_CAL = {
    short: 'negro'
  };
  var ROPA_GYM = {
    short: 'amarillo'
  };
  var IZQ = 270,
    DER = 810;
  var BARRA_Y = 2.3;

  /* ---------------- poses (x = donde esta parado) ---------------- */
  function depie(x, extra) {
    return Object.assign({
      cadera: [x, 1.0, 0],
      pieI: [x - 0.2, 0.115, 0.03],
      pieD: [x + 0.2, 0.115, 0.03]
    }, extra || {});
  }
  function flex(x, k) {
    var p = E3.poseFlex(k);
    p.cadera = [x, 1.0, 0];
    p.pieI = [x - 0.2, 0.115, 0.02];
    p.pieD = [x + 0.2, 0.115, 0.02];
    p.manoI = [p.manoI[0] + x, p.manoI[1], p.manoI[2]];
    p.manoD = [p.manoD[0] + x, p.manoD[1], p.manoD[2]];
    return p;
  }
  // dominada: k 0 colgado .. 1 la barbilla sobre la barra; las manos fijas en la barra
  function dominada(x, k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)),
      cy = 0.98 + 0.5 * e;
    return {
      cadera: [x, cy, 0],
      tronco: [-4, 0, 0],
      cabeza: [8, 0, 0],
      manoI: [x - 0.34, BARRA_Y, 0.02],
      manoD: [x + 0.34, BARRA_Y, 0.02],
      codoI: [1, -0.6, -0.2],
      codoD: [1, -0.6, -0.2],
      pieI: [x - 0.1, cy - 0.8, -0.14],
      pieD: [x + 0.1, cy - 0.8, -0.14],
      rodillaI: [0.05, 0, 1],
      rodillaD: [0.05, 0, 1],
      pies: [40, 40],
      _libre: true
    };
  }
  // curl con mancuernas: k 0 abajo .. 1 la mano frente al hombro
  function curl(x, k) {
    return depie(x, {
      manoI: E3.lerp3([x - 0.34, 0.83, 0.12], [x - 0.3, 1.42, 0.24], k),
      manoD: E3.lerp3([x + 0.34, 0.83, 0.12], [x + 0.3, 1.42, 0.24], k),
      codoI: [0.2, -0.3, -1],
      codoD: [0.2, -0.3, -1]
    });
  }
  // press con barra: k 0 en los hombros .. 1 arriba
  function press(x, k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    return depie(x, {
      manoI: E3.lerp3([x - 0.36, 1.55, 0.14], [x - 0.3, 2.22, 0.04], e),
      manoD: E3.lerp3([x + 0.36, 1.55, 0.14], [x + 0.3, 2.22, 0.04], e),
      codoI: [1, -0.6, -0.2],
      codoD: [1, -0.6, -0.2]
    });
  }
  // apertura de piernas (k 0 parado .. 1 abierto) con los brazos arriba en V
  function apertura(x, k, ancho) {
    var e = Easing.easeInOutCubic(clamp(k, 0, 1)),
      w = 0.2 + (ancho - 0.2) * e;
    var h = 0.115 + Math.sqrt(Math.max(0.05, 0.86 * 0.86 - (w - 0.135) * (w - 0.135))) + 0.02;
    return {
      cadera: [x, Math.min(1.0, h), 0],
      pieI: [x - w, 0.115, 0.03],
      pieD: [x + w, 0.115, 0.03],
      rodillaI: [0.4, 0, 1],
      rodillaD: [0.4, 0, 1],
      manoI: E3.lerp3([x - 0.34, 0.83, 0.08], [x - 0.6, 2.05, 0.05], e),
      manoD: E3.lerp3([x + 0.34, 0.83, 0.08], [x + 0.6, 2.05, 0.05], e),
      codoI: [0.5, -1, 0.05],
      codoD: [0.5, -1, 0.05]
    };
  }
  function repe(T, f, n, va, aguanta) {
    return V.ida(V.fase(T, f(0.05), f(0.97), n), va || 0.4, aguanta || 0.15);
  }
  function ezEnManos(p) {
    var J = global.TOR3D.esqueleto(p),
      c = J.manoI.clone().add(J.manoD).multiplyScalar(0.5);
    return {
      tipo: 'ez',
      c: [c.x, c.y, c.z],
      eje: [1, 0, 0]
    };
  }

  /* ---------------- iconos ---------------- */
  function IcoBarra(props) {
    var s = props.s || 1;
    return /*#__PURE__*/React.createElement("svg", {
      width: 240 * s,
      height: 240 * s,
      viewBox: "0 0 240 240",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 40 50 L 40 220 M 200 50 L 200 220 M 20 220 L 60 220 M 180 220 L 220 220",
      stroke: C.INK,
      strokeWidth: 16,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 26 54 L 214 54",
      stroke: C.INK,
      strokeWidth: 20,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 26 54 L 214 54",
      stroke: C.YEL,
      strokeWidth: 6,
      strokeLinecap: "round"
    }));
  }
  function IcoAnillas(props) {
    var s = props.s || 1;
    return /*#__PURE__*/React.createElement("svg", {
      width: 240 * s,
      height: 240 * s,
      viewBox: "0 0 240 240",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 20 24 L 220 24",
      stroke: C.INK,
      strokeWidth: 16,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 70 24 L 70 128 M 170 24 L 170 128",
      stroke: C.GRY,
      strokeWidth: 14,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 70,
      cy: 168,
      r: 40,
      fill: "none",
      stroke: C.INK,
      strokeWidth: 16
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 170,
      cy: 168,
      r: 40,
      fill: "none",
      stroke: C.INK,
      strokeWidth: 16
    }));
  }
  function IcoBarraDiscos(props) {
    var s = props.s || 1;
    return /*#__PURE__*/React.createElement("svg", {
      width: 300 * s,
      height: 200 * s,
      viewBox: "0 0 300 200",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 14 100 L 286 100",
      stroke: C.INK,
      strokeWidth: 16,
      strokeLinecap: "round"
    }), [46, 76, 224, 254].map(function (x, i) {
      var h = i === 1 || i === 2 ? 130 : 160;
      return /*#__PURE__*/React.createElement("rect", {
        key: x,
        x: x - 13,
        y: 100 - h / 2,
        width: 26,
        height: h,
        rx: 8,
        fill: C.GRY,
        stroke: C.INK,
        strokeWidth: 11
      });
    }));
  }
  function IcoPesaRusa(props) {
    var s = props.s || 1;
    return /*#__PURE__*/React.createElement("svg", {
      width: 220 * s,
      height: 240 * s,
      viewBox: "0 0 220 240",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 66 108 C 50 30 170 30 154 108",
      fill: "none",
      stroke: C.INK,
      strokeWidth: 22,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 30 160 C 30 106 70 92 110 92 C 150 92 190 106 190 160 C 190 204 160 226 110 226 C 60 226 30 204 30 160 Z",
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: "M 70 150 Q 80 126 104 120",
      fill: "none",
      stroke: BLANCO,
      strokeWidth: 10,
      strokeLinecap: "round"
    }));
  }

  /* ---------------- el duelo ---------------- */
  // o = { cal(T, f, x) -> figura, gym(T, f, x) -> figura, objetos(T, f, X), piezas, lienzo, mal, bien, r1, r2, grande, sinVersus }
  function duelo(o) {
    var g = o.grande,
      X = g ? 0.66 : 0.77;
    var cam = g ? {
      dist: 9.4,
      y: 1.15
    } : {
      dist: 10.4,
      y: 1.4
    };
    return E3.escena({
      tomas: [[0, {
        az: 4,
        el: 3,
        dist: cam.dist * 0.94,
        y: cam.y + 0.05
      }], [1, {
        az: -3,
        el: 3,
        dist: cam.dist,
        y: cam.y
      }]],
      vista: function (T, f) {
        var cal = Object.assign({
          quien: 'tor',
          ropa: ROPA_CAL,
          pose: depie(-X),
          cara: {
            boca: 'sonrisa'
          }
        }, o.cal ? o.cal(T, f, -X) : {});
        var gym = Object.assign({
          quien: 'tor',
          ropa: ROPA_GYM,
          pose: depie(X),
          cara: {
            boca: 'sonrisa'
          }
        }, o.gym ? o.gym(T, f, X) : {});
        return {
          figuras: [cal, gym],
          objetos: o.objetos ? o.objetos(T, f, X) : []
        };
      },
      lienzo: function (T, f, t, pr, info) {
        var hc = pr('cabeza', 0),
          hg = pr('cabeza', 1);
        var eb = M.pop(T, f(0) - 0.6, 0.5);
        return /*#__PURE__*/React.createElement("g", null, o.sinVersus ? null : PL.versus(T, f, {
          yVs: g ? 1260 : 1150
        }), o.sinVersus ? null : /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
          opacity: eb.opacity,
          transform: 'translate(' + (hc[0] - 230).toFixed(1) + ' ' + (hc[1] - 150 + M.life(T, 3, 5)).toFixed(1) + ') scale(' + (0.42 * eb.scale).toFixed(3) + ')'
        }, /*#__PURE__*/React.createElement(IcoBarra, {
          s: 1
        })), /*#__PURE__*/React.createElement("g", {
          opacity: eb.opacity,
          transform: 'translate(' + (hg[0] + 100).toFixed(1) + ' ' + (hg[1] - 120 + M.life(T, 3, 5, 0.5)).toFixed(1) + ') scale(' + (0.26 * eb.scale).toFixed(3) + ')'
        }, /*#__PURE__*/React.createElement(P.Pesa, {
          s: 1
        }))), o.lienzo ? o.lienzo(T, f, t, pr, info) : null);
      },
      piezas: o.piezas,
      mal: o.mal,
      bien: o.bien,
      r1: o.r1,
      r2: o.r2
    });
  }
  function barraParque(X) {
    return {
      tipo: 'barraFija',
      p: [-X, 0, 0.02],
      alto: BARRA_Y
    };
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 3,
    vo: '¿Calistenia o gimnasio? ¿Cuál de los dos es mejor?',
    C: duelo({
      grande: true,
      cal: function (T, f, x) {
        return {
          pose: dominada(x, repe(T, f, 2)),
          musc: {
            dorsal: true,
            biceps: true
          }
        };
      },
      gym: function (T, f, x) {
        return {
          pose: curl(x, repe(T, f, 2)),
          pesas: 'neutro',
          musc: {
            biceps: true
          }
        };
      },
      objetos: function (T, f, X) {
        return [barraParque(X)];
      },
      r1: {
        text: '*CALISTENIA*',
        x: 40,
        y: 420,
        s: 1.0,
        cuando: 0.04
      },
      r2: {
        text: '*GIMNASIO*',
        x: 600,
        y: 420,
        s: 1.0,
        cuando: 0.16
      }
    })
  }, {
    nombre: 'Cuerpo',
    dur: 4.6,
    vo: 'En ambos se construye músculo; sin embargo, en el gimnasio es más fácil sumar peso, sobre todo en las piernas.',
    C: duelo({
      grande: true,
      cal: function (T, f, x) {
        return {
          pose: flex(x, 1),
          musc: {
            pecho: true,
            deltoides: true,
            biceps: true,
            abdomen: true
          }
        };
      },
      gym: function (T, f, x) {
        var pi = T > f(0.42);
        return {
          pose: flex(x, 1),
          musc: {
            pecho: true,
            deltoides: true,
            biceps: true,
            abdomen: true,
            cuadriceps: pi ? true : null,
            brillo: pi ? 0.3 : 0
          }
        };
      },
      lienzo: function (T, f, t, pr) {
        var v = clamp((T - f(0.44)) / (f(0.56) - f(0.44)), 0, 1);
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Halo, {
          T: T,
          c: pr('rodillaI', 1),
          r: 80,
          v: v
        }), /*#__PURE__*/React.createElement(V.Halo, {
          T: T,
          c: pr('rodillaD', 1),
          r: 80,
          v: v
        }));
      },
      bien: [{
        x: 360,
        y: 560,
        cuando: 0.3,
        s: 0.5
      }, {
        x: 900,
        y: 560,
        cuando: 0.62,
        s: 0.6
      }],
      r1: {
        text: '*MÚSCULO*',
        s: 1.3,
        cuando: 0.02
      },
      r2: {
        text: 'PIERNAS: *GIMNASIO*',
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Fuerza',
    dur: 4.6,
    vo: 'El gimnasio te da más fuerza máxima; la calistenia, más fuerza relativa: mover con facilidad tu cuerpo.',
    C: duelo({
      grande: true,
      cal: function (T, f, x) {
        return {
          pose: dominada(x, repe(T, f, 3)),
          musc: {
            dorsal: true,
            biceps: true
          }
        };
      },
      gym: function (T, f, x) {
        return {
          pose: press(x, repe(T, f, 2, 0.35, 0.2)),
          musc: {
            deltoides: true,
            triceps: true
          }
        };
      },
      objetos: function (T, f, X) {
        return [barraParque(X), ezEnManos(press(X, repe(T, f, 2, 0.35, 0.2)))];
      },
      bien: [{
        x: 370,
        y: 520,
        cuando: 0.62,
        s: 0.5
      }, {
        x: 910,
        y: 520,
        cuando: 0.32,
        s: 0.5
      }],
      r1: {
        text: '*FUERZA*',
        s: 1.3,
        cuando: 0.02
      },
      r2: {
        text: 'RELATIVA VS *MÁXIMA*',
        cuando: 0.3
      }
    })
  }, {
    nombre: 'Costo',
    dur: 4.8,
    vo: 'La calistenia es gratis: solo necesitas un parque y una barra. En el gimnasio tienes que pagar cada mes.',
    C: duelo({
      gym: function (T, f, x) {
        return {
          cara: {
            boca: 'recta',
            cejas: 'triste'
          }
        };
      },
      piezas: [{
        C: IcoBarra,
        s: 0.9,
        x: IZQ - 240,
        y: 420,
        cuando: 0.06
      }, {
        C: B.Cuenta,
        s: 0.85,
        x: IZQ + 20,
        y: 430,
        cuando: 0.14,
        p: {
          n: 0,
          p: 0
        }
      }, {
        C: N.ICONOS.calendario,
        s: 0.85,
        x: DER - 240,
        y: 420,
        cuando: 0.3
      }, {
        C: N.ICONOS.billete,
        s: 0.75,
        x: DER + 20,
        y: function (T, f) {
          return 430 - 60 * Math.max(0, Math.sin((T - f(0.4)) * 5));
        },
        cuando: 0.4
      }],
      bien: [{
        x: 380,
        y: 680,
        cuando: 0.3,
        s: 0.55
      }],
      r1: {
        text: '*COSTO*',
        s: 1.3,
        cuando: 0.02
      },
      r2: {
        text: 'GRATIS VS *CADA MES*',
        cuando: 0.4
      }
    })
  }, {
    nombre: 'Variedad',
    dur: 3.8,
    vo: 'En variedad de ejercicios gana el gimnasio: máquinas y pesas para trabajar cada músculo.',
    C: duelo({
      piezas: [{
        C: IcoBarra,
        s: 0.75,
        x: 50,
        y: 420,
        cuando: 0.06
      }, {
        C: IcoAnillas,
        s: 0.75,
        x: 260,
        y: 420,
        cuando: 0.12
      }, {
        C: P.Pesa,
        s: 0.45,
        x: 570,
        y: 410,
        cuando: 0.26
      }, {
        C: IcoBarraDiscos,
        s: 0.62,
        x: 820,
        y: 400,
        cuando: 0.32
      }, {
        C: IcoPesaRusa,
        s: 0.62,
        x: 600,
        y: 520,
        cuando: 0.38
      }],
      bien: [{
        x: 900,
        y: 660,
        cuando: 0.56,
        s: 0.6
      }],
      r1: {
        text: '*VARIEDAD*',
        s: 1.3,
        cuando: 0.02
      },
      r2: {
        text: 'MÁS OPCIONES EN EL *GYM*',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Veredicto',
    dur: 4.2,
    vo: 'Entonces, ¿cuál es mejor? Aquel en el que vayas a ser disciplinado y constante. Y si puedes, combina los dos.',
    C: function () {
      var junta = function (T, f) {
        return animate({
          from: 0,
          to: 1,
          start: f(0.36),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
      };
      var fl = function (T, f) {
        return animate({
          from: 0,
          to: 1,
          start: f(0.5),
          end: f(0.66),
          ease: Easing.easeOutBack
        })(T);
      };
      return duelo({
        grande: true,
        sinVersus: true,
        cal: function (T, f, x) {
          return {
            pose: flex(x + 0.1 * junta(T, f), fl(T, f)),
            musc: {
              biceps: true
            }
          };
        },
        gym: function (T, f, x) {
          return {
            pose: flex(x - 0.1 * junta(T, f), fl(T, f)),
            musc: {
              biceps: true
            }
          };
        },
        lienzo: function (T, f) {
          var d = 1 - animate({
            from: 0,
            to: 1,
            start: f(0.1),
            end: f(0.34)
          })(T);
          return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
            d: "M 540 360 L 540 1460",
            stroke: C.INK,
            strokeWidth: 8,
            strokeLinecap: "round",
            strokeDasharray: 1100,
            strokeDashoffset: 1100 * (1 - d)
          }), /*#__PURE__*/React.createElement(V.Confeti, {
            T: T,
            desde: f(0.62)
          }), /*#__PURE__*/React.createElement(V.Chispa, {
            T: T,
            c: [540, 760],
            cuando: f(0.62),
            r: 220
          }));
        },
        r1: {
          text: 'EL QUE HAGAS *CONSTANTE*',
          s: 1.0,
          cuando: 0.1
        },
        r2: {
          text: 'O COMBINA *LOS DOS*',
          s: 1.1,
          cuando: 0.6,
          tono: 'verde'
        }
      });
    }()
  }];
  global.REELS.registrar({
    id: 'calistenia-gym-3d',
    titulo: '¿Calistenia o gimnasio? (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿CUÁL PREFIERES?',
      vo: '¿Cuál prefieres tú? Comenta tu opinión y compártelo con un amigo.'
    }
  });
})(window);
