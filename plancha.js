/* GENERADO por compilar.js desde plancha.jsx — no editar a mano. */
/* ============================================================
   PLANCHA — reel corto, ESTILO 2 (~32 s con el cierre)
   Fuente: libro, pag. 181. Boca abajo, apoyado en los antebrazos con los
   codos debajo de los hombros y los pies juntos en puntas; levantar el
   cuerpo en una linea recta de la cabeza a los talones, con el abdomen
   contraido todo el tiempo. Recto del abdomen, oblicuos y transverso.
   Errores: desalinear el cuerpo (cadera caida o muy alta) y perder la
   tension del abdomen.
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
  var PISO = 1000;
  var PIE = [1180, PISO];

  /* ---------------- pose: la figura de pie girada sobre la punta del pie ---------------- */

  var depie = B.posePerfil.depie({
    x: 700,
    piso: 1300,
    brazo: 0
  });
  var puntaDepie = depie.punta;
  function girada(alfa) {
    var p = B.posePerfil.girar(depie, puntaDepie, -(90 - alfa));
    return B.posePerfil.mover(p, U.resta(PIE, puntaDepie));
  }
  var cache = {};
  function alfaPara(alto) {
    var k = Math.round(alto);
    if (cache[k] != null) return cache[k];
    var lo = 0,
      hi = 45;
    for (var i = 0; i < 24; i++) {
      var mid = (lo + hi) / 2;
      var g = B.geoPerfil({
        pose: girada(mid)
      });
      if (PISO - g.hombro[1] < alto) lo = mid;else hi = mid;
    }
    cache[k] = (lo + hi) / 2;
    return cache[k];
  }

  // sube 0 acostado .. 1 en plancha (hombro sobre el codo); cadera + se cae, - se eleva
  function plancha(sube, cadera) {
    cadera = cadera || 0;
    var alto = U.lerp(118, 262, Easing.easeInOutSine(clamp(sube, 0, 1)));
    var pose = girada(alfaPara(alto));
    var g = B.geoPerfil({
      pose: pose
    });
    var hombro = g.hombro;
    var dy = alto - 30;
    var codo = [hombro[0] + Math.sqrt(Math.max(0, 232 * 232 - dy * dy)), PISO - 30];
    pose.hombro = hombro;
    pose.codo = codo;
    pose.mano = U.suma(codo, [-206, -4]);
    pose.hombro2 = U.suma(hombro, [10, -12]);
    pose.codo2 = U.suma(codo, [16, 0]);
    pose.mano2 = U.suma(pose.mano, [16, 0]);
    if (cadera) {
      pose.cadera = U.suma(pose.cadera, [0, 70 * cadera]);
      pose.curva = cadera > 0 ? -0.55 * cadera : 0.35 * -cadera;
    }
    pose.piso = PISO;
    pose.cabeza = -6;
    return pose;
  }
  function Plancha(props) {
    var pose = plancha(props.sube == null ? 1 : props.sube, props.cadera);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, props.fase || 0),
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function () {
        return /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 60,
          x1: 1340
        });
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }

  // linea del cuerpo: de la cabeza a los talones
  function linea(g, color, p) {
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [g.centroCabeza, g.hombro, g.cadera, g.tobillo],
      color: color,
      sw: 16,
      p: p == null ? 1 : p
    });
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: 77,
    y: 250,
    s: 0.74
  };
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var CMP = {
    s: 0.8,
    desdeY: 540,
    h: 400,
    centroX: 625,
    yArriba: 400,
    yAbajo: 1000
  };

  // la cadera que sube y baja (error 1) y la que se va cayendo (error 2)
  function caderaMal(T, f) {
    return 0.95 * Math.sin((T - f(0)) * Math.PI * 2 / 1.6);
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tu plancha.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.35,
        foco: en([600, 820]),
        mira: [540, 960]
      }], [1, {
        zoom: 1.08,
        foco: en([625, 820]),
        mira: [540, 960]
      }]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          cadera: 1,
          muscRojo: {
            erec: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Gotas, {
              T: T,
              c: g.centroCabeza,
              v: 1
            });
          }
        });
      },
      mal: [{
        x: 780,
        y: 620,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 140,
        y: 1220,
        cuando: 0.42,
        s: 0.5
      }],
      r1: {
        text: 'PLANCHA',
        s: 1.3,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5.5,
    vo: 'Apóyate en los antebrazos, con los codos justo debajo de los hombros y los pies juntos.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.05,
        foco: en([625, 820])
      }], [0.18, {
        zoom: 1.9,
        foco: en([330, 850]),
        mira: [540, 960]
      }], [0.45, {
        zoom: 1.9,
        foco: en([330, 850]),
        mira: [540, 960]
      }], [0.62, {
        zoom: 2,
        foco: en([1080, 940]),
        mira: [540, 960]
      }], [0.85, {
        zoom: 2,
        foco: en([1080, 940]),
        mira: [540, 960]
      }], [1, {
        zoom: 1.05,
        foco: en([625, 820])
      }]],
      figura: function (T, f, t, s) {
        var aro = animate({
          from: 0,
          to: 1,
          start: f(0.16),
          end: f(0.28)
        })(T);
        var guia = M.draw(T, f(0.24), 0.5);
        var pies = animate({
          from: 0,
          to: 1,
          start: f(0.6),
          end: f(0.72)
        })(T);
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [U.suma(g.hombro, [0, -60]), g.codo],
              color: C.GRN,
              sw: 14,
              p: guia
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.codo,
              r: 50,
              color: C.YEL,
              p: aro
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.punta,
              r: 56,
              color: C.YEL,
              p: pies
            }));
          }
        });
      },
      bien: [{
        x: 840,
        y: 640,
        cuando: 0.34
      }, {
        x: 840,
        y: 640,
        cuando: 0.74
      }],
      r1: {
        text: 'CODOS BAJO HOMBROS',
        cuando: 0.12
      },
      r2: {
        text: 'PIES JUNTOS',
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Línea',
    dur: 5,
    vo: 'Levanta el cuerpo y forma una línea recta de la cabeza a los talones.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.2,
        foco: en([625, 880])
      }], [0.4, {
        zoom: 1.05,
        foco: en([625, 820])
      }], [1, {
        zoom: 1.1,
        foco: en([625, 820])
      }]],
      figura: function (T, f, t, s) {
        var sube = animate({
          from: 0,
          to: 1,
          start: f(0.06),
          end: f(0.36),
          ease: Easing.easeInOutCubic
        })(T);
        var lin = M.draw(T, f(0.44), 0.6);
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          sube: sube,
          musc: {
            abd: sube
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, lin > 0.02 ? linea(g, C.GRN, lin) : null, /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.cadera,
              cuando: f(0.36),
              r: 90
            }));
          }
        });
      },
      bien: [{
        x: 840,
        y: 640,
        cuando: 0.68
      }],
      r1: {
        text: 'LÍNEA RECTA',
        s: 1.2,
        cuando: 0.1
      },
      r2: {
        text: 'DE CABEZA A TALONES',
        cuando: 0.48
      }
    })
  }, {
    nombre: 'Core',
    dur: 4.5,
    vo: 'Aprieta el abdomen y aguanta: trabajan el recto, los oblicuos y el transverso.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.5,
        foco: en([520, 800]),
        mira: [540, 900]
      }], [1, {
        zoom: 1.7,
        foco: en([520, 800]),
        mira: [540, 900]
      }]],
      figura: function (T, f, t, s) {
        var abd = animate({
          from: 0,
          to: 1,
          start: f(0.06),
          end: f(0.2)
        })(T);
        var obl = animate({
          from: 0,
          to: 1,
          start: f(0.5),
          end: f(0.62)
        })(T);
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          musc: {
            abd: abd,
            obl: obl
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: U.lerpP(g.cadera, g.hombro, 0.4),
              r: 80,
              v: abd
            });
          }
        });
      },
      encima: function (T, f) {
        var A = global.REELS.ayudas;
        var k = clamp((T - f(0.2)) / (f(0.95) - f(0.2)), 0, 0.999);
        return /*#__PURE__*/React.createElement(A.Pos, {
          x: 780,
          y: 1180,
          e: M.pop(T, f(0.18), 0.42),
          dy: M.life(T, 3, 5)
        }, /*#__PURE__*/React.createElement(B.Cuenta, {
          s: 0.95,
          n: 3 - Math.floor(k * 3),
          p: 1 - k * 3 % 1
        }));
      },
      r1: {
        text: 'APRIETA EL ABDOMEN',
        cuando: 0.06
      },
      r2: {
        text: '+ OBLICUOS Y TRANSVERSO',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: dejar caer la cadera o subirla. Hombros, cadera y tobillos alineados.',
    C: V.escena({
      comparar: {
        cmp: CMP,
        mal: function (T, f, t, s) {
          var c = caderaMal(T, f);
          return /*#__PURE__*/React.createElement(Plancha, {
            T: T,
            s: s,
            cadera: c,
            muscRojo: {
              erec: Math.max(0, c)
            },
            extra: function (g) {
              return linea(g, C.RED);
            }
          });
        },
        bien: function (T, f, t, s) {
          return /*#__PURE__*/React.createElement(Plancha, {
            T: T,
            s: s,
            fase: 1.2,
            musc: {
              abd: 1
            },
            extra: function (g) {
              return linea(g, C.GRN);
            }
          });
        }
      },
      r1: {
        text: 'CADERA FUERA DE LÍNEA',
        cuando: 0.04
      },
      r2: {
        text: 'TODO ALINEADO',
        cuando: 0.36
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4,
    vo: 'Error dos: soltar el abdomen. Mantén la tensión todo el tiempo.',
    C: V.escena({
      comparar: {
        cmp: CMP,
        mal: function (T, f, t, s) {
          var cae = 0.15 + 0.6 * t;
          return /*#__PURE__*/React.createElement(Plancha, {
            T: T,
            s: s,
            cadera: cae,
            muscGris: {
              abd: 1
            },
            extra: function (g) {
              return /*#__PURE__*/React.createElement(V.Gotas, {
                T: T,
                c: g.centroCabeza,
                v: 1
              });
            }
          });
        },
        bien: function (T, f, t, s) {
          return /*#__PURE__*/React.createElement(Plancha, {
            T: T,
            s: s,
            fase: 0.8,
            musc: {
              abd: 1,
              obl: 1
            },
            extra: function (g) {
              return /*#__PURE__*/React.createElement(V.Brillo, {
                T: T,
                c: U.lerpP(g.cadera, g.hombro, 0.4),
                r: 70,
                v: 1
              });
            }
          });
        }
      },
      r1: {
        text: 'ABDOMEN SUELTO',
        cuando: 0.04
      },
      r2: {
        text: 'SIEMPRE EN TENSIÓN',
        cuando: 0.36
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 2.5,
    vo: 'Así se hace. Calidad antes que tiempo.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.3],
      tomas: [[0, {
        zoom: 1.2,
        foco: en([625, 820])
      }], [1, {
        zoom: 1.05,
        foco: en([625, 820])
      }]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          musc: {
            abd: 1,
            obl: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, linea(g, C.GRN), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.cadera,
              cuando: f(0.3),
              r: 90
            }));
          }
        });
      },
      bien: [{
        x: 840,
        y: 620,
        cuando: 0.3,
        s: 0.85
      }],
      r1: {
        text: 'PLANCHA',
        s: 1.3,
        cuando: 0.06
      },
      r2: {
        text: 'CALIDAD > TIEMPO',
        cuando: 0.4
      }
    })
  }];
  global.REELS.registrar({
    id: 'plancha',
    titulo: 'Plancha (estilo 2)',
    estilo: 2,
    escenas: ESCENAS
  });
})(window);
