/* GENERADO por compilar.js desde flexion-pecho.jsx — no editar a mano. */
/* ============================================================
   FLEXION DE PECHO — reel corto, ESTILO 2 (~38 s con la accion y el cierre)
   (la version del estilo 1 es flexiones.jsx)
   Fuente: libro, pag. 48. Plancha con las manos un poco mas anchas que los
   hombros y el cuerpo recto de la cabeza a los talones; bajar hasta que el
   pecho casi toque el suelo y empujar. Pectoral mayor (principal);
   deltoides anterior, serrato, coracobraquial y triceps ayudan. Errores del
   libro: movimiento parcial y desalineacion del cuerpo (cadera hundida o
   elevada).
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

  /* ---------------- pose de plancha (la misma geometria de flexiones.jsx) ---------------- */

  var PISO = 1000;
  var PIE = [1180, PISO]; // la punta del pie queda fija en el piso

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
  function altoHombro(alfa) {
    var g = B.geoPerfil({
      pose: girada(alfa)
    });
    return PISO - g.hombro[1];
  }
  var cache = {};
  function alfaPara(alto) {
    var k = Math.round(alto);
    if (cache[k] != null) return cache[k];
    var lo = 0,
      hi = 45;
    for (var i = 0; i < 24; i++) {
      var mid = (lo + hi) / 2;
      if (altoHombro(mid) < alto) lo = mid;else hi = mid;
    }
    cache[k] = (lo + hi) / 2;
    return cache[k];
  }

  // baja 0 arriba (brazos casi rectos) .. 1 pecho casi en el piso;
  // cadera: + se hunde (error), - se eleva (error)
  function plancha(baja, cadera) {
    cadera = cadera || 0;
    var alto = U.lerp(462, 150, Easing.easeInOutSine(clamp(baja, 0, 1)));
    var pose = girada(alfaPara(alto));
    var g = B.geoPerfil({
      pose: pose
    });
    var hombro = g.hombro;
    var mano = [hombro[0] - 14, PISO - 36];
    pose.hombro = hombro;
    pose.mano = mano;
    pose.codo = B.ik(hombro, mano, 232, 214, 1);
    pose.hombro2 = U.suma(hombro, [10, -12]);
    pose.mano2 = U.suma(mano, [22, 0]);
    pose.codo2 = B.ik(pose.hombro2, pose.mano2, 232, 214, 1);
    if (cadera) {
      pose.cadera = U.suma(pose.cadera, [0, 70 * cadera]);
      pose.curva = cadera > 0 ? -0.55 * cadera : 0.35 * -cadera;
    }
    pose.piso = PISO;
    pose.cabeza = -6;
    return pose;
  }
  function Plancha(props) {
    var pose = plancha(props.baja, props.cadera);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, props.fase || 0),
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 140,
          x1: 1340
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [760, PISO + 2],
          rx: 460
        }));
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }

  // baja lento (55 %) y sube (45 %)
  function rep(T, a, b, n, desde, hasta) {
    if (desde == null) desde = 0;
    if (hasta == null) hasta = 1;
    if (T <= a) return desde;
    var u = Math.min(1, (T - a) / (b - a)) * n;
    if (u >= n) return desde;
    var k = u - Math.floor(u);
    var v = k < 0.55 ? Easing.easeInOutSine(k / 0.55) : 1 - Easing.easeInOutSine((k - 0.55) / 0.45);
    return U.lerp(desde, hasta, v);
  }

  // linea del cuerpo: de los talones a la cabeza
  function lineaCuerpo(g, color) {
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [g.tobillo, g.cadera, g.cuello, g.centroCabeza],
      color: color,
      sw: 16
    });
  }
  function pecho(g) {
    return g.torso(0.78, g.anchoFrente(0.78));
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: 83,
    y: 330,
    s: 0.72
  };
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var GEN = {
    zoom: 1,
    foco: en([635, 820]),
    mira: [540, 1060]
  };
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tus flexiones de pecho.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.15,
        foco: en([600, 820]),
        mira: [540, 1100]
      }], [1, {
        zoom: 1.02,
        foco: en([635, 820]),
        mira: [540, 1060]
      }]],
      figura: function (T, f, t, s) {
        var baja = rep(T, f(0), f(1), 2, 0, 0.45);
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          baja: baja,
          cadera: 1,
          muscRojo: {
            pec: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, lineaCuerpo(g, C.RED), /*#__PURE__*/React.createElement(V.Gotas, {
              T: T,
              c: g.centroCabeza,
              v: 1
            }));
          }
        });
      },
      mal: [{
        x: 820,
        y: 640,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 300,
        y: 1290,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'FLEXIÓN DE PECHO',
        s: 1.2,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5,
    vo: 'Manos un poco más anchas que los hombros y el cuerpo recto, de la cabeza a los talones.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.16, {
        zoom: 1.5,
        foco: en([480, 880]),
        mira: [540, 1120]
      }], [0.44, {
        zoom: 1.5,
        foco: en([480, 880]),
        mira: [540, 1120]
      }], [0.6, {
        zoom: 1.1,
        foco: en([640, 800]),
        mira: [540, 1060]
      }], [0.86, {
        zoom: 1.1,
        foco: en([640, 800]),
        mira: [540, 1060]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var manos = animate({
          from: 0,
          to: 1,
          start: f(0.14),
          end: f(0.26)
        })(T);
        var linea = M.draw(T, f(0.58), 0.5);
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          baja: 0,
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.lerpP(g.hombro, g.mano, 0.5),
              r: 150,
              color: C.YEL,
              p: manos
            }), linea > 0.02 ? /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [g.tobillo, g.cadera, g.cuello, g.centroCabeza],
              color: C.GRN,
              sw: 16,
              p: linea
            }) : null);
          }
        });
      },
      bien: [{
        x: 840,
        y: 640,
        cuando: 0.32
      }, {
        x: 840,
        y: 640,
        cuando: 0.76
      }],
      r1: {
        text: 'MANOS MÁS ANCHAS',
        s: 1.2,
        cuando: 0.1
      },
      r2: {
        text: 'CUERPO RECTO',
        s: 1.2,
        y: 1380,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 6,
    vo: 'Baja hasta que el pecho casi toque el piso y empuja fuerte hacia arriba.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.3, 0.76],
      tomas: [[0, GEN], [0.3, {
        zoom: 1.1,
        foco: en([640, 820]),
        mira: [540, 1060]
      }], [0.8, {
        zoom: 1.1,
        foco: en([640, 820]),
        mira: [540, 1060]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(V.Estela, {
          T: T,
          n: 3,
          paso: 0.07,
          dibujar: function (Tx, fantasma) {
            var baja = rep(Tx, f(0.04), f(0.96), 2);
            return /*#__PURE__*/React.createElement(Plancha, {
              T: Tx,
              s: s,
              baja: baja,
              musc: {
                pec: 0.3 + 0.7 * baja
              },
              extra: fantasma ? null : function (g) {
                var ar = pecho(B.geoPerfil({
                    pose: plancha(0)
                  })),
                  ab = pecho(B.geoPerfil({
                    pose: plancha(1)
                  }));
                return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
                  pts: [U.suma(ar, [-40, 0]), U.suma(ab, [-40, 0])],
                  color: C.YEL,
                  sw: 12,
                  p: 1
                }), /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: U.suma(g.hombro, [0, -60]),
                  cuando: f(0.3),
                  r: 100
                }), /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: U.suma(g.hombro, [0, -60]),
                  cuando: f(0.76),
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
          y: 1200,
          e: M.pop(T, f(0.06), 0.42),
          dy: M.life(T, 3, 5)
        }, /*#__PURE__*/React.createElement(B.Cuenta, {
          s: 0.8,
          n: Math.min(2, Math.floor(u + 0.02)),
          p: u >= 2 ? 1 : u % 1
        }));
      },
      bien: [{
        x: 840,
        y: 640,
        cuando: 0.5
      }],
      r1: {
        text: 'PECHO AL PISO',
        s: 1.2,
        cuando: 0.08
      },
      r2: {
        text: 'EMPUJA FUERTE',
        s: 1.2,
        y: 1380,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabaja el pectoral mayor; ayudan el hombro de adelante y el tríceps.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.4,
        foco: en([520, 800]),
        mira: [540, 1100]
      }], [0.6, {
        zoom: 1.44,
        foco: en([520, 820]),
        mira: [540, 1100]
      }], [1, {
        zoom: 1.08,
        foco: en([640, 820]),
        mira: [540, 1060]
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
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          baja: 0.55,
          musc: {
            pec: m
          },
          muscGris: {
            delt: sec,
            tri: sec
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: pecho(g),
              r: 100,
              v: m
            });
          }
        });
      },
      r1: {
        text: 'PECTORAL MAYOR',
        s: 1.2,
        cuando: 0.04
      },
      r2: {
        text: '+ HOMBRO Y TRÍCEPS',
        s: 1.05,
        y: 1380,
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: bajar a medias. Baja hasta que el pecho casi toque el piso.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.12,
        foco: en([600, 860]),
        mira: [540, 1100]
      }], [1, {
        zoom: 1.1,
        foco: en([600, 860]),
        mira: [540, 1100]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var baja = bien < 0.5 ? rep(T, f(0), f(0.44), 2, 0, 0.38) : rep(T, f(0.5), f(1), 1, 0, 1);
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          baja: baja,
          muscRojo: bien < 0.5 ? {
            pec: 0.5
          } : null,
          musc: bien >= 0.5 ? {
            pec: 0.4 + 0.6 * baja
          } : null,
          extra: function (g) {
            var p = pecho(g),
              piso = [p[0], PISO - 4];
            return bien < 0.5 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [p, piso],
              color: C.RED,
              sw: 14,
              p: 1
            }), /*#__PURE__*/React.createElement(B.FlechaS, {
              a: U.suma(p, [-60, 0]),
              b: U.suma(piso, [-60, -20]),
              color: C.RED,
              sw: 12
            })) : /*#__PURE__*/React.createElement(B.Anillo, {
              c: piso,
              r: 70,
              color: C.GRN,
              p: baja
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
        cuando: 0.66
      }],
      r1: {
        text: 'MEDIA FLEXIÓN',
        s: 1.2,
        cuando: 0.04
      },
      r2: {
        text: 'RECORRIDO COMPLETO',
        s: 1.1,
        y: 1380,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'Error dos: hundir o subir la cadera. Aprieta el abdomen y mantén el cuerpo en línea.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.06,
        foco: en([640, 820]),
        mira: [540, 1060]
      }], [1, {
        zoom: 1.03,
        foco: en([640, 820]),
        mira: [540, 1060]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        // la cadera se hunde y despues sube de mas; con el visto queda en linea
        var cad = Math.sin((T - f(0)) / (f(0.44) - f(0)) * Math.PI * 2) * (1 - bien);
        var baja = 0.2 + 0.1 * Math.sin(T * 2.4);
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          baja: baja,
          cadera: cad,
          muscRojo: bien < 0.5 ? {
            abd: 0.6
          } : null,
          musc: bien >= 0.5 ? {
            abd: 1
          } : null,
          extra: function (g) {
            return lineaCuerpo(g, bien < 0.5 ? C.RED : C.GRN);
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
        text: 'CADERA FUERA DE LÍNEA',
        s: 1.05,
        cuando: 0.04
      },
      r2: {
        text: 'CUERPO EN LÍNEA',
        s: 1.2,
        y: 1380,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace: cuerpo recto y recorrido completo.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.5],
      tomas: [[0, {
        zoom: 1.1,
        foco: en([640, 820]),
        mira: [540, 1060]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var baja = rep(T, f(0.04), f(0.9), 1);
        return /*#__PURE__*/React.createElement(Plancha, {
          T: T,
          s: s,
          baja: baja,
          musc: {
            pec: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, lineaCuerpo(g, C.GRN), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: U.suma(g.hombro, [0, -60]),
              cuando: f(0.5),
              r: 110
            }));
          }
        });
      },
      bien: [{
        x: 840,
        y: 640,
        cuando: 0.5,
        s: 0.85
      }],
      r1: {
        text: 'FLEXIÓN DE PECHO',
        s: 1.2,
        cuando: 0.06
      },
      r2: {
        text: 'CUERPO RECTO',
        s: 1.2,
        y: 1380,
        cuando: 0.46
      }
    })
  }];
  global.REELS.registrar({
    id: 'flexion-pecho',
    titulo: 'Flexión de pecho (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿LO HACÍAS BIEN?',
      vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de gym y guárdalo.'
    }
  });
})(window);
