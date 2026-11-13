/* GENERADO por compilar.js desde press-militar.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   PRESS MILITAR CON MANCUERNAS — reel corto, ESTILO 2 (~33 s con la accion y el cierre)
   Fuente: libro, pag. 87. Sentado (o de pie) con la columna recta, una
   mancuerna en cada mano a la altura de los hombros; empujar hasta estirar
   los brazos sobre la cabeza y bajar controlado. Deltoides anterior y
   lateral (principales); supraespinoso, pectoral (porcion clavicular),
   serrato y triceps. Errores del libro: hombros que se encogen o se van
   adelante (columna fuera de neutro) y no estirar los brazos arriba.
   De frente se ven los dos: el trapecio en rojo cuando se encogen.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    V = global.V,
    TOR = global.TOR,
    MU = global.MU;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };
  var L1 = 198,
    L2 = 193;

  /* ---------------- sentado en el banco, de frente ---------------- */

  var BASE = MU.poseSentado({
    baja: 250
  });
  var G0 = B.geoFrente({
    pose: BASE
  });
  var CAD = BASE.centro;

  // k 0 mancuernas a la altura de los hombros .. 1 brazos estirados sobre la cabeza;
  // encoge 0..1 sube los hombros hacia las orejas (el error)
  function press(k, encoge) {
    var p = MU.poseSentado({
      baja: 250
    });
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    ['izq', 'der'].forEach(function (lado, i) {
      var l = i ? 1 : -1;
      var S = U.suma(G0[lado].hombro, [0, -58 * (encoge || 0)]);
      var abajo = U.suma(S, [l * 152, -34]),
        arriba = U.suma(S, [-l * 26, -372]);
      var mano = U.lerpP(abajo, arriba, e);
      p[lado].hombro = S;
      p[lado].mano = mano;
      p[lado].codo = B.ik(S, mano, L1, L2, i ? -1 : 1);
    });
    return p;
  }
  function banco() {
    var x = CAD[0],
      y = CAD[1];
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (x - 230) + ' ' + (y + 90) + ' L ' + (x - 250) + ' 1500 M ' + (x + 230) + ' ' + (y + 90) + ' L ' + (x + 250) + ' 1500',
      stroke: C.INK,
      strokeWidth: 26,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (x - 300) + ' 1500 L ' + (x - 200) + ' 1500 M ' + (x + 200) + ' 1500 L ' + (x + 300) + ' 1500',
      stroke: C.INK,
      strokeWidth: 22,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: x - 160,
      y: y - 640,
      width: 320,
      height: 680,
      rx: 46,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: x - 300,
      y: y + 24,
      width: 600,
      height: 74,
      rx: 26,
      fill: C.GRY
    }, LN)));
  }
  function Press(props) {
    var pose = press(props.k, props.encoge);
    return /*#__PURE__*/React.createElement(TOR.Tor, {
      s: props.s,
      pose: pose,
      sinPiso: true,
      parpadeo: V.parpadeo(props.T, props.fase || 0),
      boca: props.boca || true,
      gesto: props.gesto,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Sombra, {
          c: [600, 1502],
          rx: 330
        }), banco());
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.izq.mano,
          ang: 0,
          giro: 0,
          k: 0.8
        }), /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.der.mano,
          ang: 0,
          giro: 0,
          k: 0.8
        }));
      },
      extra: props.extra
    });
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: 30,
    y: -30,
    s: 0.85
  };
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var GEN = {
    zoom: 1,
    foco: en([600, 1000]),
    mira: [540, 900]
  };
  var HOMBROS = U.lerpP(G0.izq.hombro, G0.der.hombro, 0.5);
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.14);
  }
  function delt(g, lado) {
    return U.suma(g[lado].hombro, [g[lado].lado * 30, 20]);
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tu press militar.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.4,
        foco: en([600, 760]),
        mira: [540, 900]
      }], [1, {
        zoom: 1.04,
        foco: en([600, 980]),
        mira: [540, 900]
      }]],
      figura: function (T, f, t, s) {
        var k = 0.55 * reps(T, f(0), f(1), 3, 0.35);
        return /*#__PURE__*/React.createElement(Press, {
          T: T,
          s: s,
          k: k,
          encoge: 1,
          boca: "dientes",
          gesto: {
            cejas: 'enojo'
          },
          muscRojo: {
            trap: 1,
            delt: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Gotas, {
              T: T,
              c: g.cabeza,
              v: 1
            });
          }
        });
      },
      mal: [{
        x: 80,
        y: 430,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 850,
        y: 1150,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'PRESS MILITAR',
        s: 1.3,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5,
    vo: 'Siéntate con la espalda recta y apoyada, y una mancuerna en cada mano a la altura de los hombros.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.18, {
        zoom: 1.4,
        foco: en([600, 920]),
        mira: [540, 960]
      }], [0.44, {
        zoom: 1.4,
        foco: en([600, 920]),
        mira: [540, 960]
      }], [0.6, {
        zoom: 1.3,
        foco: en([600, 860]),
        mira: [540, 900]
      }], [0.86, {
        zoom: 1.3,
        foco: en([600, 860]),
        mira: [540, 900]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var esp = M.draw(T, f(0.14), 0.5);
        var mc = animate({
          from: 0,
          to: 1,
          start: f(0.58),
          end: f(0.68)
        })(T);
        return /*#__PURE__*/React.createElement(Press, {
          T: T,
          s: s,
          k: 0,
          boca: "sonrisa",
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, esp > 0.02 ? /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [[600, CAD[1] - 20], [600, g.cuello[1] - 30]],
              color: C.GRN,
              sw: 14,
              p: esp
            }) : null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.izq.mano,
              r: 100,
              color: C.YEL,
              p: mc
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.der.mano,
              r: 100,
              color: C.YEL,
              p: mc
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.32
      }, {
        x: 860,
        y: 560,
        cuando: 0.76
      }],
      r1: {
        text: 'ESPALDA APOYADA',
        cuando: 0.12
      },
      r2: {
        text: 'A LA ALTURA DEL HOMBRO',
        s: 1.0,
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 5.5,
    vo: 'Empuja hasta estirar los brazos sobre la cabeza y baja controlado hasta los hombros.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.27, 0.73],
      tomas: [[0, GEN], [0.3, {
        zoom: 1.12,
        foco: en([600, 900]),
        mira: [540, 900]
      }], [0.8, {
        zoom: 1.12,
        foco: en([600, 900]),
        mira: [540, 900]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(V.Estela, {
          T: T,
          n: 3,
          paso: 0.06,
          dibujar: function (Tx, fantasma) {
            var k = reps(Tx, f(0.04), f(0.96), 2);
            return /*#__PURE__*/React.createElement(Press, {
              T: Tx,
              s: s,
              k: k,
              boca: "sonrisa",
              musc: {
                delt: 0.3 + 0.7 * k
              },
              extra: fantasma ? null : function (g) {
                return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: U.lerpP(g.izq.mano, g.der.mano, 0.5),
                  cuando: f(0.22),
                  r: 110
                }), /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: U.lerpP(g.izq.mano, g.der.mano, 0.5),
                  cuando: f(0.68),
                  r: 110
                }));
              }
            });
          }
        });
      },
      encima: function (T, f) {
        var A = global.REELS.ayudas;
        var u = clamp((T - f(0.04)) / (f(0.96) - f(0.04)), 0, 1) * 2;
        return /*#__PURE__*/React.createElement(A.Pos, {
          x: 40,
          y: 1150,
          e: M.pop(T, f(0.06), 0.42),
          dy: M.life(T, 3, 5)
        }, /*#__PURE__*/React.createElement(B.Cuenta, {
          s: 0.8,
          n: Math.min(2, Math.floor(u + 0.02)),
          p: u >= 2 ? 1 : u % 1
        }));
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.5
      }],
      r1: {
        text: 'BRAZOS ESTIRADOS',
        s: 1.15,
        cuando: 0.08
      },
      r2: {
        text: 'BAJA CONTROLADO',
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabaja el deltoides anterior y lateral; ayudan el pecho, el serrato y el tríceps.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.7,
        foco: en([600, 900]),
        mira: [540, 980]
      }], [0.6, {
        zoom: 1.75,
        foco: en([600, 900]),
        mira: [540, 980]
      }], [1, {
        zoom: 1.25,
        foco: en([600, 920]),
        mira: [540, 940]
      }]],
      figura: function (T, f, t, s) {
        var m = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.18)
        })(T);
        var sec = animate({
          from: 0,
          to: 1,
          start: f(0.56),
          end: f(0.68)
        })(T);
        return /*#__PURE__*/React.createElement(Press, {
          T: T,
          s: s,
          k: 0.75,
          boca: "sonrisa",
          musc: {
            delt: m
          },
          muscGris: {
            pec: sec,
            serr: sec
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: delt(g, 'izq'),
              r: 90,
              v: m
            }), /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: delt(g, 'der'),
              r: 90,
              v: m
            }));
          }
        });
      },
      r1: {
        text: 'DELTOIDES',
        s: 1.3,
        cuando: 0.04
      },
      r2: {
        text: '+ PECHO Y TRÍCEPS',
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: encoger los hombros hacia las orejas. Bájalos y empuja.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.5,
        foco: en([600, 860]),
        mira: [540, 960]
      }], [1, {
        zoom: 1.4,
        foco: en([600, 880]),
        mira: [540, 960]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var k = reps(T, f(0), f(1), 2, 0.4);
        return /*#__PURE__*/React.createElement(Press, {
          T: T,
          s: s,
          k: k,
          encoge: (1 - bien) * (0.4 + 0.6 * k),
          boca: bien < 0.5 ? 'dientes' : 'sonrisa',
          gesto: bien < 0.5 ? {
            cejas: 'enojo'
          } : null,
          muscRojo: bien < 0.5 ? {
            trap: 1
          } : null,
          musc: bien >= 0.5 ? {
            delt: 1
          } : null,
          extra: function (g) {
            var c = U.suma(U.lerpP(g.izq.hombro, g.der.hombro, 0.5), [0, -40]);
            return bien < 0.5 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.suma(g.izq.hombro, [30, -40]),
              r: 64,
              color: C.RED,
              p: 1
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.suma(g.der.hombro, [-30, -40]),
              r: 64,
              color: C.RED,
              p: 1
            })) : /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [U.suma(g.izq.hombro, [0, -10]), U.suma(g.der.hombro, [0, -10])],
              color: C.GRN,
              sw: 14,
              p: 1
            });
          }
        });
      },
      mal: [{
        x: 820,
        y: 470,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 820,
        y: 470,
        cuando: 0.6
      }],
      r1: {
        text: 'HOMBROS ENCOGIDOS',
        cuando: 0.04
      },
      r2: {
        text: 'HOMBROS ABAJO',
        s: 1.2,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'Error dos: quedarte a medias. Estira los brazos arriba en cada repetición.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.2,
        foco: en([600, 820]),
        mira: [540, 900]
      }], [1, {
        zoom: 1.15,
        foco: en([600, 840]),
        mira: [540, 900]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var k = reps(T, f(0), f(1), bien < 0.5 ? 3 : 2, 0.4);
        var tope = U.lerp(0.5, 1, bien);
        return /*#__PURE__*/React.createElement(Press, {
          T: T,
          s: s,
          k: k * tope,
          boca: bien < 0.5 ? true : 'sonrisa',
          muscRojo: bien < 0.5 ? {
            delt: 1
          } : null,
          musc: bien >= 0.5 ? {
            delt: 1
          } : null,
          extra: function (g) {
            var arriba = press(1, 0);
            var y = Math.min(arriba.izq.mano[1], arriba.der.mano[1]) - 70;
            return /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [[300, y], [900, y]],
              color: bien < 0.5 ? C.RED : C.GRN,
              sw: 14,
              p: 1
            });
          }
        });
      },
      mal: [{
        x: 820,
        y: 640,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 820,
        y: 640,
        cuando: 0.62
      }],
      r1: {
        text: 'MEDIA REPETICIÓN',
        cuando: 0.04
      },
      r2: {
        text: 'ESTIRA ARRIBA',
        s: 1.2,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace: hombros abajo y el recorrido completo.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.4],
      tomas: [[0, {
        zoom: 1.15,
        foco: en([600, 920]),
        mira: [540, 920]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var k = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.4),
          ease: Easing.easeInOutSine
        })(T);
        return /*#__PURE__*/React.createElement(Press, {
          T: T,
          s: s,
          k: k,
          boca: "sonrisa",
          musc: {
            delt: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: U.lerpP(g.izq.mano, g.der.mano, 0.5),
              cuando: f(0.4),
              r: 120
            });
          }
        });
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.42,
        s: 0.85
      }],
      r1: {
        text: 'PRESS MILITAR',
        s: 1.3,
        cuando: 0.06
      },
      r2: {
        text: 'RECORRIDO COMPLETO',
        cuando: 0.46
      }
    })
  }];
  global.REELS.registrar({
    id: 'press-militar',
    titulo: 'Press militar con mancuernas (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿LO HACÍAS BIEN?',
      vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de gym y guárdalo.'
    }
  });
})(window);
