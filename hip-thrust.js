/* GENERADO por compilar.js desde hip-thrust.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   HIP THRUST CON BARRA — reel corto, ESTILO 2 (~34 s con el cierre)
   Fuente: libro, pag. 158. La espalda apoyada en un banco, la barra sobre
   la cadera y los pies plantados al ancho de los hombros; empujar con los
   talones y subir la cadera hasta que hombros, cadera y rodillas queden en
   linea (el cuerpo paralelo al piso). Gluteo mayor (principal);
   isquiotibiales, cuadriceps y aductor mayor. Errores del libro: rodillas
   que se caen hacia adentro, la cabeza y el cuello fuera de linea, y poca
   amplitud (la cadera tiene que bajar hasta casi tocar el piso). El video
   usa los dos que se ven de perfil: cabeza y amplitud.
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

  /* ---------------- de perfil: boca arriba, la cabeza sobre el banco (a la derecha) ---------------- */

  var PISO = 1300;
  var BORDE = [905, 1004]; // borde del banco: ahi apoyan las escapulas
  var TOB = [395, PISO - 32],
    PUNTA = U.suma(TOB, [-112, 32]);
  var GROSOR = 75; // de la columna a la espalda

  function prod(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }

  // sube 0 abajo (cadera casi en el piso) .. 1 arriba (cuerpo paralelo al piso);
  // cab: grados de la cabeza (+ hacia atras, el error)
  function thrust(sube, cab) {
    var th = U.lerp(-46, 0, Easing.easeInOutSine(clamp(sube, 0, 1))) * Math.PI / 180;
    var d = [Math.cos(th), Math.sin(th)]; // de la cadera al cuello
    var atras = [-Math.sin(th), Math.cos(th)]; // hacia la espalda
    var apoyo = U.suma(BORDE, U.por(atras, -GROSOR));
    var cadera = U.suma(apoyo, U.por(d, -250));
    var cuello = U.suma(cadera, U.por(d, 404));
    var pose = {
      cadera: cadera,
      cuello: cuello,
      curva: 0,
      cabeza: cab == null ? -8 : cab,
      piso: PISO
    };
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: cadera,
        mano: cadera,
        rodilla: cadera,
        tobillo: TOB,
        punta: PUNTA
      })
    });
    // la barra sobre la cadera; las manos la sostienen
    var barra = U.suma(U.suma(cadera, U.por(atras, -96)), U.por(d, 8));
    var mano = U.suma(barra, U.por(d, 26));
    var c1 = B.ik(g.hombro, mano, 232, 214, 1),
      c2 = B.ik(g.hombro, mano, 232, 214, -1);
    pose.codo = prod(c1, atras) > prod(c2, atras) ? c1 : c2;
    pose.mano = mano;
    pose.codo2 = U.suma(pose.codo, [10, -10]);
    pose.mano2 = U.suma(mano, [12, -8]);
    var r1 = B.ik(cadera, TOB, 272, 268, 1),
      r2 = B.ik(cadera, TOB, 272, 268, -1);
    pose.rodilla = r1[1] < r2[1] ? r1 : r2;
    pose.tobillo = TOB;
    pose.punta = PUNTA;
    pose.rodilla2 = U.suma(pose.rodilla, [16, -12]);
    pose.tobillo2 = U.suma(TOB, [18, -4]);
    pose.punta2 = U.suma(PUNTA, [18, -4]);
    pose._barra = barra;
    return pose;
  }
  function Banco() {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", _extends({
      x: 926,
      y: 1050,
      width: 330,
      height: PISO - 1050,
      rx: 14,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: 'M 960 1110 L 1222 1110',
      stroke: C.GRY,
      strokeWidth: 11,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: BORDE[0],
      y: BORDE[1],
      width: 370,
      height: 50,
      rx: 22,
      fill: C.GRY
    }, LN)));
  }
  function Perfil(props) {
    var pose = thrust(props.sube == null ? 1 : props.sube, props.cab);
    var barra = pose._barra;
    var disco = props.disco || C.GRY;
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
          x0: 200,
          x1: 1320
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [600, PISO + 2],
          rx: 360
        }), /*#__PURE__*/React.createElement(Banco, null), /*#__PURE__*/React.createElement("circle", {
          cx: barra[0],
          cy: barra[1],
          r: 150,
          fill: disco,
          stroke: C.INK,
          strokeWidth: 14
        }), /*#__PURE__*/React.createElement("circle", {
          cx: barra[0],
          cy: barra[1],
          r: 92,
          fill: "none",
          stroke: C.INK,
          strokeWidth: 8,
          opacity: 0.5
        }));
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: barra[0],
          cy: barra[1],
          r: 24,
          fill: C.GRY,
          stroke: C.INK,
          strokeWidth: 11
        }), props.extra ? props.extra(g) : null);
      }
    });
  }

  // linea hombro - cadera - rodilla
  function linea(g, color, p) {
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [g.hombro, g.cadera, g.rodilla],
      color: color,
      sw: 15,
      p: p == null ? 1 : p
    });
  }
  function gluteo(g) {
    return U.suma(g.cadera, [-6, 50]);
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: -201,
    y: -50,
    s: 0.95
  };
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var GEN = {
    zoom: 1.02,
    foco: en([780, 1000]),
    mira: [540, 900]
  };
  var CMP = {
    s: 0.86,
    desdeY: 640,
    h: 580,
    centroX: 780,
    yArriba: 310,
    yAbajo: 940
  };
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.38 : va, 0.16);
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tu hip thrust.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.22,
        foco: en([780, 980]),
        mira: [540, 960]
      }], [1, {
        zoom: 1.06,
        foco: en([780, 990]),
        mira: [540, 920]
      }]],
      figura: function (T, f, t, s) {
        var k = 0.45 + 0.55 * reps(T, f(0), f(1), 3, 0.45);
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          sube: k,
          cab: 34,
          muscRojo: {
            glu: 1
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
        x: 160,
        y: 560,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 820,
        y: 1220,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'HIP THRUST',
        s: 1.3,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5.5,
    vo: 'Espalda apoyada en el banco, la barra sobre la cadera y los pies firmes en el piso.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.14, {
        zoom: 2,
        foco: en([960, 980]),
        mira: [540, 980]
      }], [0.34, {
        zoom: 2,
        foco: en([960, 980]),
        mira: [540, 980]
      }], [0.46, {
        zoom: 2,
        foco: en([660, 880]),
        mira: [540, 980]
      }], [0.64, {
        zoom: 2,
        foco: en([660, 880]),
        mira: [540, 980]
      }], [0.76, {
        zoom: 1.9,
        foco: en([400, 1220]),
        mira: [540, 1000]
      }], [0.9, {
        zoom: 1.9,
        foco: en([400, 1220]),
        mira: [540, 1000]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var esp = animate({
          from: 0,
          to: 1,
          start: f(0.12),
          end: f(0.22)
        })(T);
        var bar = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.54)
        })(T);
        var pie = animate({
          from: 0,
          to: 1,
          start: f(0.74),
          end: f(0.84)
        })(T);
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          sube: 1,
          extra: function (g) {
            var b = thrust(1)._barra;
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: [BORDE[0] + 150, BORDE[1] - 14],
              r: 80,
              color: C.YEL,
              p: esp
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: b,
              r: 90,
              color: C.YEL,
              p: bar
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.lerpP(g.tobillo, g.punta, 0.5),
              r: 80,
              color: C.YEL,
              p: pie
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 640,
        cuando: 0.26
      }, {
        x: 860,
        y: 640,
        cuando: 0.58
      }],
      r1: {
        text: 'ESPALDA EN EL BANCO',
        cuando: 0.1
      },
      r2: {
        text: 'BARRA SOBRE LA CADERA',
        cuando: 0.44
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 5.5,
    vo: 'Empuja con los talones y sube la cadera hasta que hombros, cadera y rodillas queden en línea.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.3, 0.76],
      tomas: [[0, GEN], [0.35, {
        zoom: 1.35,
        foco: en([700, 960]),
        mira: [540, 960]
      }], [0.8, {
        zoom: 1.35,
        foco: en([700, 960]),
        mira: [540, 960]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var k = 1 - reps(T, f(0.02), f(0.98), 2, 0.4);
        var subiendo = reps(T + 0.06, f(0.02), f(0.98), 2, 0.4) < reps(T, f(0.02), f(0.98), 2, 0.4);
        var arriba = k > 0.97;
        var talon = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.14)
        })(T);
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          sube: k,
          musc: {
            glu: 0.3 + 0.7 * k
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.suma(g.tobillo, [16, 14]),
              r: 56,
              color: C.YEL,
              p: talon
            }), arriba ? linea(g, C.GRN) : null, /*#__PURE__*/React.createElement(V.Lineas, {
              c: g.cadera,
              dir: [0, subiendo ? -1 : 1],
              v: arriba ? 0 : 0.7,
              largo: 120
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: gluteo(g),
              cuando: f(0.3),
              r: 90
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: gluteo(g),
              cuando: f(0.76),
              r: 90
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 620,
        cuando: 0.62
      }],
      r1: {
        text: 'EMPUJA CON LOS TALONES',
        cuando: 0.06
      },
      r2: {
        text: 'TODO EN LÍNEA',
        s: 1.2,
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabaja el glúteo mayor, con ayuda de los isquiotibiales y los cuádriceps.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.9,
        foco: en([660, 960]),
        mira: [540, 1000]
      }], [0.6, {
        zoom: 2,
        foco: en([640, 960]),
        mira: [540, 1000]
      }], [1, {
        zoom: 1.4,
        foco: en([660, 980]),
        mira: [540, 960]
      }]],
      figura: function (T, f, t, s) {
        var gl = animate({
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
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          sube: 1,
          musc: {
            glu: gl
          },
          muscGris: {
            isq: sec,
            cuad: sec
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: gluteo(g),
              r: 90,
              v: gl
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
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: echar la cabeza hacia atrás. Mira al frente, con el mentón adentro.',
    C: V.escena({
      comparar: {
        cmp: CMP,
        mal: function (T, f, t, s) {
          return /*#__PURE__*/React.createElement(Perfil, {
            T: T,
            s: s,
            sube: 1,
            cab: 55 + 6 * Math.sin(T * 4),
            extra: function (g) {
              return /*#__PURE__*/React.createElement(B.Anillo, {
                c: g.centroCabeza,
                r: 110,
                color: C.RED,
                p: 1
              });
            }
          });
        },
        bien: function (T, f, t, s) {
          return /*#__PURE__*/React.createElement(Perfil, {
            T: T,
            s: s,
            sube: 1,
            cab: -30,
            fase: 1.2,
            musc: {
              glu: 1
            },
            extra: function (g) {
              return /*#__PURE__*/React.createElement(B.Puntos, {
                pts: [g.cadera, g.hombro, g.centroCabeza],
                color: C.GRN,
                sw: 15,
                p: 1
              });
            }
          });
        }
      },
      r1: {
        text: 'CABEZA HACIA ATRÁS',
        cuando: 0.04
      },
      r2: {
        text: 'MIRA AL FRENTE',
        cuando: 0.36
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'Error dos: quedarte a medias. Baja hasta que la cadera casi toque el piso.',
    C: V.escena({
      comparar: {
        cmp: CMP,
        mal: function (T, f, t, s) {
          var k = 1 - 0.32 * reps(T, f(0), f(1), 4, 0.45);
          return /*#__PURE__*/React.createElement(Perfil, {
            T: T,
            s: s,
            sube: k,
            muscRojo: {
              glu: 1
            },
            extra: function (g) {
              return /*#__PURE__*/React.createElement(B.Puntos, {
                pts: [[g.cadera[0], thrust(1).cadera[1]], [g.cadera[0], thrust(0.68).cadera[1] + 60]],
                color: C.RED,
                sw: 14,
                p: 1
              });
            }
          });
        },
        bien: function (T, f, t, s) {
          var k = 1 - reps(T, f(0), f(1), 2, 0.45);
          return /*#__PURE__*/React.createElement(Perfil, {
            T: T,
            s: s,
            sube: k,
            fase: 0.8,
            musc: {
              glu: 1
            },
            extra: function (g) {
              return /*#__PURE__*/React.createElement(B.Puntos, {
                pts: [[g.cadera[0], thrust(1).cadera[1]], [g.cadera[0], PISO - 20]],
                color: C.GRN,
                sw: 14,
                p: 1
              });
            }
          });
        }
      },
      r1: {
        text: 'MEDIA REPETICIÓN',
        cuando: 0.04
      },
      r2: {
        text: 'RECORRIDO COMPLETO',
        cuando: 0.36
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace. Aprieta el glúteo arriba en cada repetición.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.4],
      tomas: [[0, {
        zoom: 1.3,
        foco: en([720, 980]),
        mira: [540, 940]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var k = animate({
          from: 0.2,
          to: 1,
          start: f(0.04),
          end: f(0.4),
          ease: Easing.easeInOutSine
        })(T);
        return /*#__PURE__*/React.createElement(Perfil, {
          T: T,
          s: s,
          sube: k,
          cab: -14,
          musc: {
            glu: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, k > 0.97 ? linea(g, C.GRN) : null, /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: gluteo(g),
              cuando: f(0.4),
              r: 100
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 620,
        cuando: 0.42,
        s: 0.85
      }],
      r1: {
        text: 'HIP THRUST',
        s: 1.3,
        cuando: 0.06
      },
      r2: {
        text: 'APRIETA ARRIBA',
        cuando: 0.46
      }
    })
  }];
  global.REELS.registrar({
    id: 'hip-thrust',
    titulo: 'Hip thrust (estilo 2)',
    estilo: 2,
    escenas: ESCENAS
  });
})(window);
