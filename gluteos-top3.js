/* GENERADO por compilar.js desde gluteos-top3.jsx — no editar a mano. */
/* ============================================================
   LOS 3 MEJORES EJERCICIOS DE GLUTEOS SEGUN LA CIENCIA — con la novia de Tor
   reel de ~16 s, ESTILO 2 (formato de biceps-top3)
   1. Hip thrust: el que mas activa el gluteo; crece parecido a la sentadilla
      (Plotkin y cols., 2023).
   2. Sentadilla profunda: bajar completo hace crecer mas el gluteo que la
      media sentadilla (Kubo y cols., 2019, Eur J Appl Physiol).
   3. Sentadilla bulgara: el gluteo trabaja estirado; con el torso un poco
      adelante, mas gluteo.
   (gluteos.jsx es el video largo con estos temas; este es el top 3 corto.)
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
  var Ella = TOP3.Ella;
  var PISO = 1300;

  // de pie, la mano en la cadera (para el gancho)
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

  /* ---------------- 2. sentadilla profunda con barra ---------------- */

  var A = [700, PISO - 32],
    ARRIBA_BARRA = [40, -38];
  function sentadilla(k) {
    var d = Easing.easeInOutSine(1 - clamp(k, 0, 1)); // k 0 abajo (profunda) .. 1 de pie
    var K = U.suma(A, U.polar(-90 - U.lerp(4, 34, d), 268));
    var H = U.suma(K, U.polar(U.lerp(-88, 16, d), 272));
    // el tronco se inclina lo justo para que la barra quede sobre la mitad del pie
    var objetivo = A[0] - 20,
      sl = clamp((H[0] + ARRIBA_BARRA[0] - objetivo) / 330, -0.5, 0.9),
      pose,
      g;
    for (var i = 0; i < 4; i++) {
      var lean = Math.asin(sl) * 180 / Math.PI;
      pose = {
        cadera: H,
        cuello: U.suma(H, U.polar(-90 - lean, 404)),
        curva: 0,
        cabeza: U.lerp(0, -16, d),
        piso: PISO
      };
      g = B.geoPerfil({
        pose: Object.assign({}, pose, {
          codo: H,
          mano: H,
          rodilla: K,
          tobillo: A,
          punta: A
        })
      });
      sl = clamp(sl + (g.hombro[0] + ARRIBA_BARRA[0] - objetivo) / 330, -0.5, 0.9);
    }
    var barra = U.suma(g.hombro, ARRIBA_BARRA);
    pose.codo = U.suma(g.hombro, U.polar(70, 150));
    pose.mano = U.suma(barra, [-14, 10]);
    pose.codo2 = U.suma(pose.codo, [12, -8]);
    pose.mano2 = U.suma(pose.mano, [10, -6]);
    pose.rodilla = K;
    pose.tobillo = A;
    pose.punta = U.suma(A, [-112, 32]);
    var A2 = U.suma(A, [26, 0]);
    pose.tobillo2 = A2;
    pose.punta2 = U.suma(A2, [-112, 32]);
    var r1 = B.ik(U.suma(H, [14, -4]), A2, 272, 268, 1),
      r2 = B.ik(U.suma(H, [14, -4]), A2, 272, 268, -1);
    pose.rodilla2 = r1[0] < r2[0] ? r1 : r2;
    pose._barra = barra;
    return pose;
  }
  function Sentadilla(T, s, k, extra) {
    var pose = sentadilla(k),
      b = pose._barra;
    return /*#__PURE__*/React.createElement(Ella, {
      T: T,
      s: s,
      pose: pose,
      glu: 0.4 + 0.6 * (1 - k),
      musc: {
        cuad: 0.4
      },
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 260,
          x1: 1180
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [700, PISO + 2],
          rx: 260
        }), /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "lado",
          c: U.suma(b, [16, -8]),
          k: 0.85
        }), /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "lado",
          c: b,
          k: 0.85
        }));
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: b[0],
          cy: b[1],
          r: 20,
          fill: C.GRY,
          stroke: C.INK,
          strokeWidth: 11
        }), extra ? extra(g) : null);
      }
    });
  }
  function gluteo(g) {
    return U.suma(g.gluteo, [10, 30]);
  }
  var GL = {
    x: 60,
    y: 290,
    s: 0.8
  };
  function enGL(p) {
    return [GL.x + p[0] * GL.s, GL.y + p[1] * GL.s];
  }
  var FIG_H = {
      x: -150,
      y: 120,
      s: 0.88
    },
    FIG_S = {
      x: 40,
      y: 230,
      s: 0.8
    },
    FIG_B = {
      x: -60,
      y: 200,
      s: 0.75
    };
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Los 3 mejores ejercicios de glúteos según la ciencia.',
    C: TOP3.gancho({
      musculo: 'GLÚTEOS',
      fig: GL,
      tomas: [[0, {
        zoom: 1.3,
        foco: enGL([780, 820]),
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
          glu: 1,
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
              c: gluteo(g),
              r: 110,
              v: 1
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: U.suma(g.gluteo, [30, 20]),
              cuando: f(0.3),
              r: 150
            }));
          }
        });
      }
    })
  }, {
    nombre: '1. Hip thrust',
    dur: 2.2,
    vo: 'Uno: hip thrust, apretando arriba.',
    C: TOP3.ejercicio({
      n: 1,
      fig: FIG_H,
      centro: [790, 1080],
      foco: [700, 1020],
      zoom: 1.2,
      r1: 'HIP THRUST',
      r2: 'APRIETA ARRIBA',
      musculo: gluteo,
      dibujo: function (T, s, k, extra) {
        return PIEZAS.gluteos.hipThrust(T, s, k, extra);
      }
    })
  }, {
    nombre: '2. Sentadilla profunda',
    dur: 2.2,
    vo: 'Dos: sentadilla profunda, más glúteo que la corta.',
    C: TOP3.ejercicio({
      n: 2,
      fig: FIG_S,
      centro: [700, 820],
      foco: [760, 960],
      zoom: 1.18,
      r1: 'SENTADILLA PROFUNDA',
      r2: 'BAJA COMPLETO',
      s1: 1.02,
      musculo: gluteo,
      dibujo: Sentadilla
    })
  }, {
    nombre: '3. Búlgara',
    dur: 2.2,
    vo: 'Tres: sentadilla búlgara, con el torso adelante.',
    C: TOP3.ejercicio({
      n: 3,
      fig: FIG_B,
      centro: [800, 800],
      foco: [800, 960],
      zoom: 1.18,
      r1: 'SENTADILLA BÚLGARA',
      r2: 'TORSO ADELANTE',
      s1: 1.02,
      musculo: gluteo,
      dibujo: function (T, s, k, extra) {
        return PIEZAS.gluteos.bulgaraDibujo(T, s, 1 - k, extra);
      }
    })
  }];
  global.REELS.registrar({
    id: 'gluteos-top3',
    titulo: 'Top 3 glúteos (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.6,
      pregunta: '¿CUÁL PROBARÁS?',
      vo: '¿Cuál vas a probar? Coméntalo, compártelo con una amiga y guárdalo.'
    }
  });
})(window);
