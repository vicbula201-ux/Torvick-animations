/* GENERADO por compilar.js desde isquios-top3.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   LOS 3 MEJORES EJERCICIOS DE ISQUIOTIBIALES SEGUN LA CIENCIA — con la novia de Tor
   reel de ~16 s, ESTILO 2 (formato de biceps-top3)
   1. Curl femoral sentado: con la cadera flexionada el isquio trabaja mas
      estirado y crece mas que en el curl acostado (Maeo y cols., 2021, Med
      Sci Sports Exerc).
   2. Peso muerto rumano: la cadera atras, el isquio estirado con carga.
   3. Curl nordico: la bajada lenta alarga los fasciculos del isquio y
      previene lesiones (Petersen y cols., 2011; Bourne y cols., 2017).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    V = global.V,
    TOP3 = global.TOP3,
    PIEZAS = global.PIEZAS;
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
  var Ella = TOP3.Ella;
  var PISO = 1300;
  function poseDePie() {
    var pose = B.posePerfil.depie({
      x: 700,
      piso: PISO
    });
    var g = B.geoPerfil({
      pose: pose
    });
    pose.codo = U.suma(g.hombro, U.polar(62, 220));
    pose.mano = U.suma(g.cadera, [-6, -70]);
    return pose;
  }

  /* ---------------- 1. curl femoral sentado ---------------- */

  var RODILLA = [520, 900];
  function curlSentado(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var cad = U.suma(RODILLA, [272, -4]);
    var pose = {
      cadera: cad,
      cuello: U.suma(cad, U.polar(-97, 404)),
      curva: 0,
      cabeza: -4,
      piso: PISO
    };
    // la pierna: estirada adelante (isquio estirado) .. doblada bajo el asiento
    var a = U.lerp(178, 98, e);
    pose.rodilla = RODILLA;
    pose.tobillo = U.suma(RODILLA, U.polar(a, 268));
    pose.punta = U.suma(pose.tobillo, U.polar(a + 95, 112));
    pose.rodilla2 = U.suma(RODILLA, [24, -8]);
    pose.tobillo2 = U.suma(pose.tobillo, [24, -8]);
    pose.punta2 = U.suma(pose.punta, [24, -8]);
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: cad,
        mano: cad
      })
    });
    var mano = U.suma(cad, [-60, 54]);
    pose.codo = B.ik(g.hombro, mano, 232, 214, 1);
    pose.mano = mano;
    pose._a = a;
    return pose;
  }
  function MaquinaCurl(props) {
    var pose = props.pose,
      cad = pose.cadera,
      a = pose._a;
    var almohadilla = U.suma(U.suma(RODILLA, U.polar(a, 226)), U.polar(a - 90, 62));
    var muslo = U.suma(U.lerpP(cad, RODILLA, 0.72), [0, -88]);
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
      y: PISO + 4,
      x0: 200,
      x1: 1200
    }), /*#__PURE__*/React.createElement(V.Sombra, {
      c: [720, PISO + 2],
      rx: 320
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M 640 990 L 640 ' + PISO + ' M 940 990 L 940 ' + PISO + ' M 560 ' + (PISO - 10) + ' L 1020 ' + (PISO - 10),
      fill: "none"
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 560,
      y: cad[1] + 52,
      width: 460,
      height: 52,
      rx: 20,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(U.suma(cad, [96, 40])) + ' L ' + U.pt(U.suma(cad, [130, -420])),
      stroke: C.INK,
      strokeWidth: 74,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(U.suma(cad, [96, 40])) + ' L ' + U.pt(U.suma(cad, [130, -420])),
      stroke: C.GRY,
      strokeWidth: 46,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(RODILLA) + ' L ' + U.pt(almohadilla),
      stroke: C.INK,
      strokeWidth: 30,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(RODILLA) + ' L ' + U.pt(almohadilla),
      stroke: BLANCO,
      strokeWidth: 8,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: RODILLA[0],
      cy: RODILLA[1],
      r: 26,
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 12
    }), /*#__PURE__*/React.createElement("circle", {
      cx: almohadilla[0],
      cy: almohadilla[1],
      r: 42,
      fill: C.GRY,
      stroke: C.INK,
      strokeWidth: 13
    }), props.encima ? /*#__PURE__*/React.createElement("rect", _extends({
      x: muslo[0] - 90,
      y: muslo[1] - 26,
      width: 180,
      height: 52,
      rx: 22,
      fill: C.GRY
    }, LN)) : null);
  }
  function CurlSentado(T, s, k, extra) {
    var pose = curlSentado(k);
    return /*#__PURE__*/React.createElement(Ella, {
      T: T,
      s: s,
      pose: pose,
      glu: 0.3,
      musc: {
        isq: 0.4 + 0.6 * k
      },
      fondo: function () {
        return /*#__PURE__*/React.createElement(MaquinaCurl, {
          pose: pose
        });
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(MaquinaCurl, {
          pose: pose,
          encima: true
        }), extra ? extra(g) : null);
      }
    });
  }

  /* ---------------- 2. peso muerto rumano (la pose del video de gluteos) ---------------- */

  function Rumano(T, s, k, extra) {
    var pose = PIEZAS.gluteos.rumano(1 - k);
    return /*#__PURE__*/React.createElement(Ella, {
      T: T,
      s: s,
      pose: pose,
      glu: 0.4,
      musc: {
        isq: 0.4 + 0.6 * k
      },
      fondo: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 200,
          x1: 1320
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [640, PISO + 2],
          rx: 300
        }), /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "lado",
          c: U.suma(g.mano, [14, -8]),
          k: 1.15
        }));
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "lado",
          c: g.mano,
          k: 1.15
        }), extra ? extra(g) : null);
      }
    });
  }

  /* ---------------- 3. curl nordico ---------------- */

  var RODILLA_N = [1000, PISO - 40];
  function nordico(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var th = U.lerp(-150, -92, e); // k 0: abajo (el isquio estirado) .. 1: arriba
    var cad = U.suma(RODILLA_N, U.polar(th, 272));
    var pose = {
      cadera: cad,
      cuello: U.suma(cad, U.polar(th, 404)),
      curva: 0,
      cabeza: U.lerp(-24, 0, e),
      piso: PISO
    };
    pose.rodilla = RODILLA_N;
    pose.tobillo = U.suma(RODILLA_N, [262, 0]);
    pose.punta = U.suma(pose.tobillo, U.polar(80, 96));
    pose.rodilla2 = U.suma(RODILLA_N, [18, -8]);
    pose.tobillo2 = U.suma(pose.tobillo, [18, -8]);
    pose.punta2 = U.suma(pose.punta, [18, -8]);
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: cad,
        mano: cad
      })
    });
    // las manos listas delante del pecho
    var u = U.polar(th, 1),
      n = [u[1], -u[0]];
    var dirB = U.unidad(U.suma(U.por(u, -0.9), U.por(n, 0.45))),
      dirA = U.unidad(U.suma(U.por(n, 0.8), U.por(u, 0.6)));
    pose.codo = U.suma(g.hombro, U.por(dirB, 232));
    pose.mano = U.suma(pose.codo, U.por(dirA, 200));
    pose.codo2 = U.suma(pose.codo, [14, -8]);
    pose.mano2 = U.suma(pose.mano, [14, -8]);
    return pose;
  }
  function Nordico(T, s, k, extra) {
    var pose = nordico(k);
    var anc = U.suma(pose.tobillo, [6, -52]);
    return /*#__PURE__*/React.createElement(Ella, {
      T: T,
      s: s,
      pose: pose,
      glu: 0.3,
      musc: {
        isq: 0.4 + 0.6 * (1 - k)
      },
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: -60,
          x1: 1380
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [760, PISO + 2],
          rx: 480
        }), /*#__PURE__*/React.createElement("rect", _extends({
          x: RODILLA_N[0] - 120,
          y: PISO - 26,
          width: 460,
          height: 30,
          rx: 12,
          fill: C.GRY
        }, LN)), /*#__PURE__*/React.createElement("path", _extends({
          d: 'M ' + U.pt(anc) + ' L ' + (anc[0] + 70) + ' ' + PISO,
          fill: "none"
        }, LN)));
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: anc[0],
          cy: anc[1],
          r: 34,
          fill: C.GRY,
          stroke: C.INK,
          strokeWidth: 13
        }), extra ? extra(g) : null);
      }
    });
  }
  function isquio(g) {
    return TOP3.atras(g.cadera, g.rodilla, 0.5, 42);
  }
  var GL = {
    x: 60,
    y: 290,
    s: 0.8
  };
  function enGL(p) {
    return [GL.x + p[0] * GL.s, GL.y + p[1] * GL.s];
  }
  var FIG_C = {
      x: 0,
      y: 280,
      s: 0.84
    },
    FIG_R = {
      x: 80,
      y: 250,
      s: 0.75
    },
    FIG_N = {
      x: 20,
      y: 180,
      s: 0.8
    };
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Los 3 mejores ejercicios de isquiotibiales según la ciencia.',
    C: TOP3.gancho({
      musculo: 'ISQUIOS',
      fig: GL,
      tomas: [[0, {
        zoom: 1.3,
        foco: enGL([760, 900]),
        mira: [540, 1150]
      }], [1, {
        zoom: 1.04,
        foco: enGL([720, 760]),
        mira: [540, 1000]
      }]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(Ella, {
          T: T,
          s: s,
          pose: poseDePie(),
          glu: 0.3,
          musc: {
            isq: 1
          },
          fondo: function () {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
              y: PISO + 4,
              x0: 300,
              x1: 1100
            }), /*#__PURE__*/React.createElement(V.Sombra, {
              c: [700, PISO + 2],
              rx: 240
            }));
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: isquio(g),
              r: 110,
              v: 1
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: isquio(g),
              cuando: f(0.3),
              r: 150
            }));
          }
        });
      }
    })
  }, {
    nombre: '1. Curl femoral sentado',
    dur: 2.2,
    vo: 'Uno: curl femoral sentado, crece más que acostado.',
    C: TOP3.ejercicio({
      n: 1,
      fig: FIG_C,
      centro: [700, 860],
      foco: [660, 880],
      zoom: 1.15,
      r1: 'CURL FEMORAL SENTADO',
      r2: 'MÁS QUE ACOSTADO',
      s1: 1.0,
      musculo: isquio,
      dibujo: CurlSentado
    })
  }, {
    nombre: '2. Peso muerto rumano',
    dur: 2.2,
    vo: 'Dos: peso muerto rumano, llevando la cadera atrás.',
    C: TOP3.ejercicio({
      n: 2,
      fig: FIG_R,
      centro: [600, 760],
      foco: [700, 860],
      zoom: 1.15,
      r1: 'PESO MUERTO RUMANO',
      r2: 'CADERA ATRÁS',
      s1: 1.02,
      musculo: isquio,
      dibujo: Rumano
    })
  }, {
    nombre: '3. Curl nórdico',
    dur: 2.2,
    vo: 'Tres: curl nórdico, bajando lento.',
    C: TOP3.ejercicio({
      n: 3,
      fig: FIG_N,
      centro: [760, 1000],
      foco: [860, 1040],
      zoom: 1.15,
      mira: [540, 1020],
      r1: 'CURL NÓRDICO',
      r2: 'BAJA LENTO',
      musculo: isquio,
      dibujo: Nordico
    })
  }];
  global.REELS.registrar({
    id: 'isquios-top3',
    titulo: 'Top 3 isquiotibiales (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.6,
      pregunta: '¿CUÁL PROBARÁS?',
      vo: '¿Cuál vas a probar? Coméntalo, compártelo con una amiga y guárdalo.'
    }
  });
})(window);
