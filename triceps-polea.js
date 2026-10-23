/* GENERADO por compilar.js desde triceps-polea.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   EXTENSION DE TRICEPS EN POLEA ALTA (barra recta) — reel corto, ESTILO 2
   (~34 s con el cierre)
   Fuente: libro, pag. 114. De pie frente a la polea alta, barra recta con
   las dos manos y los codos cerca del cuerpo; extender los brazos hacia
   abajo moviendo solo los antebrazos, con los codos fijos al costado, y
   volver lento. Triceps braquial (principal), anconeo; el abdomen y la
   espalda estabilizan. Error del libro: mover los codos lejos del cuerpo.
   El segundo error sale de la ejecucion: volver de golpe, sin control.
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
  var BLANCO = '#ffffff';
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };

  /* ---------------- de perfil, frente a la polea (mira a la izquierda) ---------------- */

  var PISO = 1300;
  var POLEA = [520, 92];
  var BASE = B.posePerfil.depie({
    x: 700,
    piso: PISO
  });

  // ext 0 antebrazo arriba (barra al pecho) .. 1 brazo extendido; lean + atras / - adelante;
  // codo: grados que el brazo se despega hacia adelante (el error)
  function empuje(ext, lean, codo) {
    lean = lean == null ? -5 : lean;
    codo = codo || 0;
    var cadera = [700 - 1.6 * lean, 730 + 0.8 * lean];
    var cuello = U.suma(cadera, U.polar(-90.85 + lean, 404));
    var pose = Object.assign({}, BASE, {
      cadera: cadera,
      cuello: cuello,
      cabeza: -0.6 * lean
    });
    var g = B.geoPerfil({
      pose: pose
    });
    var brazo = 90 + lean + codo;
    pose.codo = U.suma(g.hombro, U.polar(brazo, 232));
    pose.mano = U.suma(pose.codo, U.polar(brazo + 4 + 100 * (1 - Easing.easeInOutSine(clamp(ext, 0, 1))), 214));
    pose.rodilla = B.ik(cadera, BASE.tobillo, 272, 268, -1);
    pose.rodilla2 = B.ik(U.suma(cadera, [14, -4]), BASE.tobillo2, 272, 268, -1);
    return pose;
  }
  function Maquina(props) {
    var mano = props.mano,
      sube = props.sube || 0;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
      y: PISO + 4,
      x0: 160,
      x1: 980
    }), /*#__PURE__*/React.createElement(V.Sombra, {
      c: [690, PISO + 2],
      rx: 190
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 300,
      y: 20,
      width: 62,
      height: PISO - 20,
      rx: 16,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 290,
      y: 14,
      width: 290,
      height: 48,
      rx: 16,
      fill: BLANCO
    }, LN)), [0, 1, 2, 3, 4, 5].map(function (i) {
      var dy = i >= 4 ? -70 * sube : 0;
      return /*#__PURE__*/React.createElement("rect", {
        key: i,
        x: 244,
        y: PISO - 56 - i * 44 + dy,
        width: 174,
        height: 38,
        rx: 8,
        fill: i >= 4 ? C.YEL : C.GRY,
        stroke: C.INK,
        strokeWidth: 11
      });
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M 331 62 L 331 ' + (PISO - 56 - 5 * 44 - 70 * sube),
      fill: "none",
      stroke: C.INK,
      strokeWidth: 9,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(U.suma(POLEA, [-4, 26])) + ' L ' + U.pt(mano),
      fill: "none",
      stroke: C.INK,
      strokeWidth: 9,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: POLEA[0],
      cy: POLEA[1],
      r: 34,
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 13
    }), /*#__PURE__*/React.createElement("circle", {
      cx: POLEA[0],
      cy: POLEA[1],
      r: 7,
      fill: C.INK
    }));
  }
  function Perfil(props) {
    var ext = props.ext == null ? 0 : props.ext;
    var pose = empuje(ext, props.lean, props.codo);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, props.fase || 0),
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function (g) {
        return /*#__PURE__*/React.createElement(Maquina, {
          mano: g.mano,
          sube: ext
        });
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: g.mano[0] - 2,
          cy: g.mano[1] - 4,
          r: 19,
          fill: C.GRY,
          stroke: C.INK,
          strokeWidth: 10
        }), props.extra ? props.extra(g) : null);
      }
    });
  }
  function triceps(g) {
    return U.suma(U.lerpP(g.hombro, g.codo, 0.55), [26, 0]);
  }
  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: 116,
    y: 330,
    s: 0.8
  };
  var GEN = {
    zoom: 1.05,
    foco: [540, 856],
    mira: [540, 900]
  }; // plano general
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var CMP = {
    s: 0.74,
    desdeY: 90,
    h: 580,
    centroX: 600,
    yArriba: 310,
    yAbajo: 940
  };

  // repeticiones: va en el 40 %, aguanta abajo, vuelve lento
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.12);
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 3,
    vo: 'Estás haciendo mal tu extensión de tríceps.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.5,
        foco: en([620, 560]),
        mira: [540, 1040]
      }], [1, {
        zoom: 1.12,
        foco: en([560, 657]),
        mira: [540, 900]
      }]],
      figura: function (T, f, t, s) {
        var k = reps(T, f(0), f(1), 2, 0.3);
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          ext: k,
          lean: -5 - 14 * k,
          codo: 34 * (1 - k),
          muscRojo: {
            tri: 1
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
        x: 820,
        y: 560,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 140,
        y: 1000,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'TRÍCEPS EN POLEA',
        s: 1.2,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5.5,
    vo: 'De pie frente a la polea alta, la barra recta en las manos y los codos pegados al cuerpo.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.2, {
        zoom: 2.1,
        foco: en([520, 600]),
        mira: [540, 1080]
      }], [0.45, {
        zoom: 2.1,
        foco: en([520, 600]),
        mira: [540, 1080]
      }], [0.62, {
        zoom: 2.1,
        foco: en([690, 560]),
        mira: [540, 1080]
      }], [0.86, {
        zoom: 2.1,
        foco: en([690, 560]),
        mira: [540, 1080]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var barra = animate({
          from: 0,
          to: 1,
          start: f(0.18),
          end: f(0.3)
        })(T);
        var pegado = animate({
          from: 0,
          to: 1,
          start: f(0.6),
          end: f(0.72)
        })(T);
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          ext: 0,
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.mano,
              r: 56,
              color: C.YEL,
              p: barra
            }), /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [g.hombro, U.suma(g.codo, [0, 40])],
              color: C.GRN,
              sw: 14,
              p: pegado
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.codo,
              r: 50,
              color: C.YEL,
              p: pegado
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 640,
        cuando: 0.34
      }, {
        x: 860,
        y: 640,
        cuando: 0.76
      }],
      r1: {
        text: 'POLEA ALTA, BARRA RECTA',
        cuando: 0.12
      },
      r2: {
        text: 'CODOS PEGADOS',
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 5.5,
    vo: 'Extiende los brazos hacia abajo moviendo solo los antebrazos. Los codos no se mueven.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.3, {
        zoom: 1.45,
        foco: en([600, 680]),
        mira: [540, 1000]
      }], [0.8, {
        zoom: 1.45,
        foco: en([600, 680]),
        mira: [540, 1000]
      }], [1, GEN]],
      pulsos: [0.25, 0.71],
      figura: function (T, f, t, s) {
        var k = reps(T, f(0.05), f(0.95), 2);
        var ant = reps(T - 0.08, f(0.05), f(0.95), 2);
        var guia = M.draw(T, f(0.04), 0.6);
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          ext: k,
          musc: {
            tri: 0.4 + 0.6 * k
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Arco, {
              c: g.codo,
              r: 262,
              a0: 190,
              a1: 100,
              color: C.YEL,
              sw: 14,
              p: guia
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.codo,
              r: 44,
              color: C.GRN,
              p: 1
            }), /*#__PURE__*/React.createElement(V.Lineas, {
              c: g.mano,
              dir: [0, k > ant ? 1 : -1],
              v: Math.abs(k - ant) * 9,
              largo: 110
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.mano,
              cuando: f(0.25),
              r: 70
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.mano,
              cuando: f(0.71),
              r: 70
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 620,
        cuando: 0.6
      }],
      r1: {
        text: 'SOLO LOS ANTEBRAZOS',
        cuando: 0.08
      },
      r2: {
        text: 'CODOS FIJOS',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabaja el tríceps, con ayuda del ancóneo, y el abdomen te estabiliza.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 2.2,
        foco: en([690, 560]),
        mira: [540, 1060]
      }], [0.6, {
        zoom: 2.3,
        foco: en([690, 580]),
        mira: [540, 1060]
      }], [1, {
        zoom: 1.6,
        foco: en([660, 650]),
        mira: [540, 1000]
      }]],
      figura: function (T, f, t, s) {
        var k = reps(T, f(0.1), f(1), 2);
        var tri = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.18)
        })(T);
        var abd = animate({
          from: 0,
          to: 1,
          start: f(0.62),
          end: f(0.74)
        })(T);
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          ext: k,
          musc: {
            tri: tri,
            ante: 0
          },
          muscGris: {
            abd: abd,
            ante: abd
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: triceps(g),
              r: 70,
              v: tri
            });
          }
        });
      },
      r1: {
        text: 'TRÍCEPS',
        s: 1.3,
        cuando: 0.04
      },
      r2: {
        text: '+ ANCÓNEO Y ABDOMEN',
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: mover los codos lejos del cuerpo. Así el tríceps trabaja menos.',
    C: V.escena({
      comparar: {
        cmp: CMP,
        mal: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 3, 0.35);
          return /*#__PURE__*/React.createElement(Perfil, {
            T: T,
            s: s,
            ext: k,
            codo: 42 * (1 - k),
            muscRojo: {
              tri: 1
            },
            extra: function (g) {
              return /*#__PURE__*/React.createElement(B.Anillo, {
                c: g.codo,
                r: 48,
                color: C.RED,
                p: 1
              });
            }
          });
        },
        bien: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 3, 0.35);
          return /*#__PURE__*/React.createElement(Perfil, {
            T: T,
            s: s,
            ext: k,
            fase: 1.2,
            musc: {
              tri: 1
            },
            extra: function (g) {
              return /*#__PURE__*/React.createElement(B.Anillo, {
                c: g.codo,
                r: 48,
                color: C.GRN,
                p: 1
              });
            }
          });
        }
      },
      r1: {
        text: 'CODOS QUE SE MUEVEN',
        cuando: 0.04
      },
      r2: {
        text: 'CODOS QUIETOS',
        cuando: 0.36
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4,
    vo: 'Error dos: subir de golpe. Vuelve lento y con control.',
    C: V.escena({
      comparar: {
        cmp: CMP,
        mal: function (T, f, t, s) {
          // de golpe: baja y sube rapido, la pila rebota
          var k = reps(T, f(0), f(1), 4, 0.5);
          var ant = reps(T - 0.06, f(0), f(1), 4, 0.5);
          return /*#__PURE__*/React.createElement(Perfil, {
            T: T,
            s: s,
            ext: k,
            muscRojo: {
              tri: 1
            },
            extra: function (g) {
              return /*#__PURE__*/React.createElement(V.Lineas, {
                c: g.mano,
                dir: [0, k > ant ? 1 : -1],
                v: Math.abs(k - ant) * 6,
                largo: 120
              });
            }
          });
        },
        bien: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 2, 0.3);
          return /*#__PURE__*/React.createElement(Perfil, {
            T: T,
            s: s,
            ext: k,
            fase: 0.8,
            musc: {
              tri: 1
            },
            extra: function (g) {
              return /*#__PURE__*/React.createElement(B.Arco, {
                c: g.codo,
                r: 262,
                a0: 190,
                a1: 100,
                color: C.GRN,
                sw: 14,
                p: 1
              });
            }
          });
        }
      },
      r1: {
        text: 'SUBIR DE GOLPE',
        cuando: 0.04
      },
      r2: {
        text: 'VUELVE LENTO',
        cuando: 0.36
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace. Codos quietos y control en cada repetición.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.36],
      tomas: [[0, {
        zoom: 1.25,
        foco: en([600, 640]),
        mira: [540, 960]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var k = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.36),
          ease: Easing.easeInOutCubic
        })(T);
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          ext: k,
          musc: {
            tri: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.codo,
              r: 44,
              color: C.GRN,
              p: 1
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.mano,
              cuando: f(0.36),
              r: 80
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 620,
        cuando: 0.36,
        s: 0.85
      }],
      r1: {
        text: 'TRÍCEPS EN POLEA',
        s: 1.2,
        cuando: 0.06
      },
      r2: {
        text: 'CONTROL EN CADA REP',
        cuando: 0.44
      }
    })
  }];
  global.REELS.registrar({
    id: 'triceps-polea',
    titulo: 'Tríceps en polea (estilo 2)',
    estilo: 2,
    escenas: ESCENAS
  });
})(window);
