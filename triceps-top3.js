/* GENERADO por compilar.js desde triceps-top3.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   LOS 3 MEJORES EJERCICIOS DE TRICEPS SEGUN LA CIENCIA — reel de ~16 s, ESTILO 2
   (formato de biceps-top3: gancho + 3 ejercicios + accion + cierre)
   1. Extension sobre la cabeza: con el brazo arriba la cabeza larga trabaja
      estirada y el triceps crece bastante mas que con el brazo al costado
      (Maeo y cols., 2023, Eur J Sport Sci).
   2. Press frances acostado: el codo arriba, el triceps estirado al bajar.
   3. Extension en polea: el clasico, estirando del todo abajo.
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
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };
  var PISO = 1300;

  /* ---------------- 2. press frances acostado ---------------- */

  function frances(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var pose = B.posePerfil.banco({
      x: 560,
      piso: PISO,
      p: 1
    });
    var hom = pose.hombro;
    // el brazo quieto, apenas inclinado hacia la cabeza; el antebrazo baja detras de la frente
    pose.codo = U.suma(hom, U.polar(-78, 232));
    pose.mano = U.suma(pose.codo, U.polar(U.lerp(122, -78, e), 214));
    pose.codo2 = U.suma(pose.codo, [14, -10]);
    pose.mano2 = U.suma(pose.mano, [14, -10]);
    return pose;
  }
  function Frances(props) {
    var pose = frances(props.k);
    var b = pose.banco;
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, 0.4),
      musc: props.musc,
      muscGris: props.muscGris,
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 160,
          x1: 1300
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [760, PISO + 2],
          rx: 420
        }), /*#__PURE__*/React.createElement("path", _extends({
          d: 'M ' + (b.x0 + 60) + ' ' + (b.y + 40) + ' L ' + (b.x0 + 60) + ' ' + PISO + ' M ' + (b.x1 - 60) + ' ' + (b.y + 40) + ' L ' + (b.x1 - 60) + ' ' + PISO,
          fill: "none"
        }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
          x: b.x0,
          y: b.y,
          width: b.x1 - b.x0,
          height: 48,
          rx: 20,
          fill: C.GRY
        }, LN)));
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: g.mano[0],
          cy: g.mano[1],
          r: 24,
          fill: C.GRY,
          stroke: C.INK,
          strokeWidth: 11
        }), props.extra ? props.extra(g) : null);
      }
    });
  }

  /* ---------------- el gancho: de perfil, el brazo atras con el triceps encendido ---------------- */

  function Patada(props) {
    var pose = B.posePerfil.depie({
      x: 700,
      piso: PISO,
      brazo: props.brazo
    });
    var g0 = B.geoPerfil({
      pose: pose
    });
    pose.mano = U.suma(pose.codo, U.polar(90 + props.brazo + 4, 214));
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, 0.2),
      musc: {
        tri: 1
      },
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 360,
          x1: 1040
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [700, PISO + 2],
          rx: 220
        }));
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.mano,
          ang: 90,
          giro: 0,
          k: 0.7
        });
      },
      children: function (g) {
        var c = TOP3.atras(g.hombro, g.codo, 0.5, 34);
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
          T: props.T,
          c: c,
          r: 100,
          v: 1
        }), props.chispa);
      }
    });
  }
  var FIG_G = {
      x: -40,
      y: 210,
      s: 0.84
    },
    FIG_O = {
      x: -40,
      y: 260,
      s: 0.8
    },
    FIG_F = {
      x: -70,
      y: 300,
      s: 0.86
    },
    FIG_P = {
      x: 30,
      y: 270,
      s: 0.8
    };
  function enG(p) {
    return [FIG_G.x + p[0] * FIG_G.s, FIG_G.y + p[1] * FIG_G.s];
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Los 3 mejores ejercicios de tríceps según la ciencia.',
    C: TOP3.gancho({
      musculo: 'TRÍCEPS',
      fig: FIG_G,
      tomas: [[0, {
        zoom: 1.35,
        foco: enG([760, 560]),
        mira: [540, 980]
      }], [1, {
        zoom: 1.06,
        foco: enG([720, 760]),
        mira: [540, 980]
      }]],
      figura: function (T, f, t, s) {
        var b = -4 - 30 * Easing.easeOutBack(animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.3)
        })(T));
        return /*#__PURE__*/React.createElement(Patada, {
          T: T,
          s: s,
          brazo: b
        });
      }
    })
  }, {
    nombre: '1. Sobre la cabeza',
    dur: 2.2,
    vo: 'Uno: extensión sobre la cabeza, la que más lo hace crecer.',
    C: TOP3.ejercicio({
      n: 1,
      fig: FIG_O,
      centro: [760, 760],
      foco: [760, 660],
      zoom: 1.06,
      mira: [540, 1080],
      r1: 'SOBRE LA CABEZA',
      r2: 'TRÍCEPS ESTIRADO',
      musculo: function (g) {
        return TOP3.adelante(g.hombro, g.codo, 0.6, 40);
      },
      dibujo: function (T, s, k, extra) {
        return /*#__PURE__*/React.createElement(PIEZAS.tricepsFrances.Figura, {
          T: T,
          s: s,
          ext: k,
          musc: {
            tri: 0.4 + 0.6 * k
          },
          extra: extra
        });
      }
    })
  }, {
    nombre: '2. Press francés',
    dur: 2.2,
    vo: 'Dos: press francés, con los codos quietos.',
    C: TOP3.ejercicio({
      n: 2,
      fig: FIG_F,
      centro: [740, 860],
      foco: [860, 740],
      zoom: 1.25,
      r1: 'PRESS FRANCÉS',
      r2: 'CODOS QUIETOS',
      musculo: function (g) {
        return TOP3.atras(g.hombro, g.codo, 0.5, 36);
      },
      dibujo: function (T, s, k, extra) {
        return /*#__PURE__*/React.createElement(Frances, {
          T: T,
          s: s,
          k: k,
          musc: {
            tri: 0.4 + 0.6 * k
          },
          extra: extra
        });
      }
    })
  }, {
    nombre: '3. Extensión en polea',
    dur: 2.2,
    vo: 'Tres: extensión en polea, estirando bien abajo.',
    C: TOP3.ejercicio({
      n: 3,
      fig: FIG_P,
      centro: [600, 760],
      foco: [660, 640],
      zoom: 1.2,
      r1: 'EXTENSIÓN EN POLEA',
      r2: 'ESTIRA ABAJO',
      s1: 1.05,
      musculo: function (g) {
        return TOP3.atras(g.hombro, g.codo, 0.55, 32);
      },
      dibujo: function (T, s, k, extra) {
        return /*#__PURE__*/React.createElement(PIEZAS.tricepsPolea.Figura, {
          T: T,
          s: s,
          ext: k,
          musc: {
            tri: 0.4 + 0.6 * k
          },
          extra: extra
        });
      }
    })
  }];
  global.REELS.registrar({
    id: 'triceps-top3',
    titulo: 'Top 3 tríceps (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.3,
      vo: '¿Estás de acuerdo? Coméntalo, compártelo y guárdalo.'
    }
  });
})(window);
