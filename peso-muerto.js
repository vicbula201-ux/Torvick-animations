/* GENERADO por compilar.js desde peso-muerto.jsx — no editar a mano. */
/* ============================================================
   PESO MUERTO — reel corto, ESTILO 2 (~33 s con la accion y el cierre)
   Fuente: libro, pag. 144. De pie, pies alineados con los hombros, frente a
   la barra en el suelo; flexionar rodillas y cadera y agarrar la barra
   (prono o mixto); subir extendiendo cadera y rodillas con la columna
   neutra, y volver flexionando. Gluteo mayor (agonista); isquiotibiales,
   cuadriceps, aductor mayor y gemelos; los erectores de la espalda
   estabilizan. Errores del libro: espalda curvada y agarre incorrecto
   (agarre flojo, munecas dobladas).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    V = global.V;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var U = B.util;
  var C = P.C;

  /* ---------------- de perfil (mira a la izquierda), la barra en el piso ---------------- */

  var PISO = 1300;
  var R = 150; // radio del disco: la barra queda a R del piso
  var TOB = [660, PISO - 32];
  var BASE = B.posePerfil.depie({
    x: 700,
    piso: PISO
  });
  function rodillaAdelante(cad, tob) {
    var r1 = B.ik(cad, tob, 272, 268, 1),
      r2 = B.ik(cad, tob, 272, 268, -1);
    return r1[0] < r2[0] ? r1 : r2;
  }
  // arma la pose con la cadera, el angulo del tronco y la curva; los brazos cuelgan rectos
  function armar(cadera, ang, curva, cab) {
    var pose = Object.assign({}, BASE, {
      cadera: cadera,
      cuello: U.suma(cadera, U.polar(ang, 404)),
      curva: curva || 0,
      cabeza: cab || 0,
      piso: PISO
    });
    pose.tobillo = TOB;
    pose.punta = U.suma(TOB, [-112, 32]);
    pose.tobillo2 = U.suma(TOB, [16, -6]);
    pose.punta2 = U.suma(pose.punta, [16, -6]);
    pose.rodilla = rodillaAdelante(cadera, TOB);
    pose.rodilla2 = U.suma(pose.rodilla, [14, -8]);
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: cadera,
        mano: cadera
      })
    });
    pose.codo = U.suma(g.hombro, [0, 232]);
    pose.mano = U.suma(g.hombro, [0, 442]);
    pose.codo2 = U.suma(pose.codo, [14, -8]);
    pose.mano2 = U.suma(pose.mano, [14, -8]);
    return pose;
  }
  // la cadera de abajo, a la altura justa para que las manos lleguen a la barra en el piso
  var CAD0 = function () {
    var c = [840, 900];
    for (var i = 0; i < 3; i++) {
      var p = armar(c, -138, 0, -10);
      c = [c[0], c[1] + (PISO - R - 6 - p.mano[1])];
    }
    return c;
  }();
  var CAD1 = [700, BASE.cadera[1]];

  // k 0 abajo (barra en el piso) .. 1 de pie; curva 0..1 la espalda redondeada (el error)
  function muerto(k, curva) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var cad = U.lerpP(CAD0, CAD1, e);
    var ang = U.lerp(-138, -92, Math.pow(e, 0.85));
    var c = curva || 0;
    return armar(cad, ang - 6 * c, 0.85 * c, U.lerp(-10, 0, e) - 22 * c);
  }
  function Muerto(props) {
    var pose = muerto(props.k, props.curva);
    var flojo = props.flojo || 0;
    var T = props.T;
    var barra = function (g) {
      return U.suma(g.mano, [M.vibra(T, 30, 7 * flojo), 6 + 26 * flojo]);
    };
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(T, props.fase || 0),
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function (g) {
        var b = barra(g);
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 260,
          x1: 1240
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [700, PISO + 2],
          rx: 340
        }), /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "lado",
          c: U.suma(b, [16, -8]),
          k: R / 100
        }));
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "lado",
          c: barra(g),
          k: R / 100
        }), props.extra ? props.extra(g) : null);
      }
    });
  }

  // linea de la espalda: de la cadera a la nuca
  function espalda(g, color) {
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [g.cadera, U.lerpP(g.cadera, g.nuca, 0.5), g.nuca],
      color: color,
      sw: 15
    });
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: -55,
    y: 270,
    s: 0.85
  };
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var GEN = {
    zoom: 1,
    foco: en([690, 820]),
    mira: [540, 1000]
  };
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.42 : va, 0.14);
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tu peso muerto.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.12,
        foco: en([700, 860]),
        mira: [540, 1060]
      }], [1, {
        zoom: 1.0,
        foco: en([690, 820]),
        mira: [540, 1020]
      }]],
      figura: function (T, f, t, s) {
        var k = 0.7 * reps(T, f(0), f(1), 2, 0.4);
        return /*#__PURE__*/React.createElement(Muerto, {
          T: T,
          s: s,
          k: k,
          curva: 1,
          muscRojo: {
            erec: 1,
            dor: 0.6
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, espalda(g, C.RED), /*#__PURE__*/React.createElement(V.Gotas, {
              T: T,
              c: g.centroCabeza,
              v: 1
            }));
          }
        });
      },
      mal: [{
        x: 820,
        y: 460,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 110,
        y: 470,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'PESO MUERTO',
        s: 1.3,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5.5,
    vo: 'Pies al ancho de los hombros, la barra pegada a las espinillas, y agárrala con la espalda neutra.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.16, {
        zoom: 1.35,
        foco: en([620, 1150]),
        mira: [540, 1110]
      }], [0.44, {
        zoom: 1.35,
        foco: en([620, 1150]),
        mira: [540, 1110]
      }], [0.6, {
        zoom: 1.4,
        foco: en([700, 800]),
        mira: [540, 1020]
      }], [0.86, {
        zoom: 1.4,
        foco: en([700, 800]),
        mira: [540, 1020]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var esp = M.draw(T, f(0.58), 0.5);
        var pie = animate({
          from: 0,
          to: 1,
          start: f(0.14),
          end: f(0.26)
        })(T);
        return /*#__PURE__*/React.createElement(Muerto, {
          T: T,
          s: s,
          k: 0,
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.lerpP(g.rodilla, g.tobillo, 0.6),
              r: 120,
              color: C.YEL,
              p: pie
            }), esp > 0.02 ? /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [g.cadera, U.lerpP(g.cadera, g.nuca, 0.5), g.nuca],
              color: C.GRN,
              sw: 15,
              p: esp
            }) : null);
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
        cuando: 0.78
      }],
      r1: {
        text: 'BARRA PEGADA',
        s: 1.2,
        cuando: 0.12
      },
      r2: {
        text: 'ESPALDA NEUTRA',
        s: 1.2,
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 6,
    vo: 'Empuja el piso y extiende la cadera y las rodillas a la vez, con la barra cerca del cuerpo. Baja igual.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.27, 0.73],
      tomas: [[0, GEN], [0.3, {
        zoom: 1.06,
        foco: en([690, 820]),
        mira: [540, 1030]
      }], [0.8, {
        zoom: 1.06,
        foco: en([690, 820]),
        mira: [540, 1030]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(V.Estela, {
          T: T,
          n: 3,
          paso: 0.07,
          dibujar: function (Tx, fantasma) {
            var k = reps(Tx, f(0.04), f(0.96), 2);
            return /*#__PURE__*/React.createElement(Muerto, {
              T: Tx,
              s: s,
              k: k,
              musc: {
                glu: 0.3 + 0.7 * k,
                isq: 0.2 + 0.4 * k
              },
              extra: fantasma ? null : function (g) {
                var ab = muerto(0).mano,
                  ar = muerto(1).mano;
                return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
                  pts: [U.suma(ab, [0, 6]), U.suma(ar, [0, 6])],
                  color: C.YEL,
                  sw: 12,
                  p: 1
                }), /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: U.suma(g.cadera, [40, 0]),
                  cuando: f(0.22),
                  r: 100
                }), /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: U.suma(g.cadera, [40, 0]),
                  cuando: f(0.68),
                  r: 100
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
        text: 'CADERA Y RODILLAS',
        s: 1.15,
        cuando: 0.08
      },
      r2: {
        text: 'BARRA CERCA',
        s: 1.2,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabaja el glúteo mayor, con ayuda de isquios y cuádriceps; la espalda estabiliza.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.24,
        foco: en([760, 860]),
        mira: [540, 1080]
      }], [0.6, {
        zoom: 1.3,
        foco: en([760, 880]),
        mira: [540, 1090]
      }], [1, {
        zoom: 1.1,
        foco: en([700, 820]),
        mira: [540, 1020]
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
        return /*#__PURE__*/React.createElement(Muerto, {
          T: T,
          s: s,
          k: 0.45,
          musc: {
            glu: m
          },
          muscGris: {
            isq: sec,
            cuad: sec,
            erec: sec
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: U.suma(g.cadera, [50, 20]),
              r: 100,
              v: m
            });
          }
        });
      },
      r1: {
        text: 'GLÚTEO MAYOR',
        s: 1.25,
        cuando: 0.04
      },
      r2: {
        text: '+ ISQUIOS Y CUÁDRICEPS',
        s: 1.0,
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: curvar la espalda. Mantén la columna neutra todo el recorrido.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.3,
        foco: en([720, 820]),
        mira: [540, 1030]
      }], [1, {
        zoom: 1.25,
        foco: en([720, 840]),
        mira: [540, 1030]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var k = 0.75 * reps(T, f(0), f(1), 2, 0.45);
        return /*#__PURE__*/React.createElement(Muerto, {
          T: T,
          s: s,
          k: k,
          curva: 1 - bien,
          muscRojo: bien < 0.5 ? {
            erec: 1
          } : null,
          musc: bien >= 0.5 ? {
            glu: 1
          } : null,
          extra: function (g) {
            return espalda(g, bien < 0.5 ? C.RED : C.GRN);
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
        text: 'ESPALDA CURVADA',
        cuando: 0.04
      },
      r2: {
        text: 'COLUMNA NEUTRA',
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'Error dos: agarrar la barra floja. Aprieta fuerte, con las muñecas alineadas.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.5,
        foco: en([620, 1060]),
        mira: [540, 1130]
      }], [1, {
        zoom: 1.42,
        foco: en([620, 1060]),
        mira: [540, 1130]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        return /*#__PURE__*/React.createElement(Muerto, {
          T: T,
          s: s,
          k: 0.05 + 0.1 * Math.sin(T * 2),
          flojo: 1 - bien,
          muscRojo: bien < 0.5 ? {
            ante: 1
          } : null,
          musc: bien >= 0.5 ? {
            ante: 1
          } : null,
          extra: function (g) {
            return /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.suma(g.mano, [0, 10]),
              r: 90,
              color: bien < 0.5 ? C.RED : C.GRN,
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
        cuando: 0.6
      }],
      r1: {
        text: 'AGARRE FLOJO',
        s: 1.2,
        cuando: 0.04
      },
      r2: {
        text: 'APRIETA FUERTE',
        s: 1.2,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace: espalda neutra y la barra cerca.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.42],
      tomas: [[0, {
        zoom: 1.1,
        foco: en([700, 840]),
        mira: [540, 1040]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var k = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.42),
          ease: Easing.easeInOutSine
        })(T);
        return /*#__PURE__*/React.createElement(Muerto, {
          T: T,
          s: s,
          k: k,
          musc: {
            glu: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: U.suma(g.cadera, [40, 0]),
              cuando: f(0.42),
              r: 110
            });
          }
        });
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.44,
        s: 0.85
      }],
      r1: {
        text: 'PESO MUERTO',
        s: 1.3,
        cuando: 0.06
      },
      r2: {
        text: 'ESPALDA NEUTRA',
        s: 1.2,
        cuando: 0.46
      }
    })
  }];
  global.REELS.registrar({
    id: 'peso-muerto',
    titulo: 'Peso muerto (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿LO HACÍAS BIEN?',
      vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de gym y guárdalo.'
    }
  });
})(window);
