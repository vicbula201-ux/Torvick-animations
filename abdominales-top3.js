/* GENERADO por compilar.js desde abdominales-top3.jsx — no editar a mano. */
/* ============================================================
   LOS 3 MEJORES EJERCICIOS DE ABDOMINALES SEGUN LA CIENCIA — reel de ~16 s, ESTILO 2
   (formato de biceps-top3: gancho + 3 ejercicios + accion + cierre)
   1. Abdominal en polea: el abdomen es un musculo como cualquier otro; con
      la polea se le puede subir el peso (sobrecarga progresiva, ACSM 2009).
   2. Elevacion de piernas colgado y 3. rueda abdominal: de los ejercicios
      con mas activacion del recto abdominal y los oblicuos (Escamilla y
      cols., 2006, Phys Ther); la rueda lo trabaja estirado.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    V = global.V,
    PL = global.PL,
    TOP3 = global.TOP3,
    PIEZAS = global.PIEZAS;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var PISO = 1300;

  /* ---------------- 2. elevacion de piernas colgado ---------------- */

  var BARRA = [640, 200],
    PISO_D = 1620;
  function colgado(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var pose = B.posePerfil.colgado({
      barra: BARRA,
      sube: 0
    });
    var cad = pose.cadera;
    // el muslo sube adelante hasta pasar la horizontal; la pierna casi estirada; la pelvis se enrolla
    var th = U.lerp(94, 192, e),
      sh = th - 34 * e;
    pose.rodilla = U.suma(cad, U.polar(th, 272));
    pose.tobillo = U.suma(pose.rodilla, U.polar(sh, 268));
    pose.punta = U.suma(pose.tobillo, U.polar(sh + 95, 112));
    pose.rodilla2 = U.suma(pose.rodilla, [16, -10]);
    pose.tobillo2 = U.suma(pose.tobillo, [16, -10]);
    pose.punta2 = U.suma(pose.punta, [16, -10]);
    pose.curva = 0.35 * e;
    return pose;
  }
  function Colgado(props) {
    var pose = colgado(props.k);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, 0.3),
      musc: props.musc,
      muscGris: props.muscGris,
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: 'M ' + BARRA[0] + ' ' + BARRA[1] + ' L 1150 ' + BARRA[1] + ' L 1150 ' + PISO_D,
          fill: "none",
          stroke: C.INK,
          strokeWidth: 30,
          strokeLinejoin: "round"
        }), /*#__PURE__*/React.createElement("path", {
          d: 'M ' + BARRA[0] + ' ' + BARRA[1] + ' L 1150 ' + BARRA[1] + ' L 1150 ' + PISO_D,
          fill: "none",
          stroke: BLANCO,
          strokeWidth: 8,
          strokeLinejoin: "round"
        }), /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO_D + 4,
          x0: 200,
          x1: 1260
        }));
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: BARRA[0],
          cy: BARRA[1],
          r: 24,
          fill: C.GRY,
          stroke: C.INK,
          strokeWidth: 11
        }), props.extra ? props.extra(g) : null);
      }
    });
  }

  /* ---------------- 3. rueda abdominal, de rodillas ---------------- */

  var RODILLA = [1050, PISO - 34],
    RUEDA_Y = PISO - 58;
  function rueda(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    // k 0: estirado (la rueda lejos, el cuerpo casi horizontal) .. 1: la cadera atras, la espalda redonda
    var cad = U.suma(RODILLA, U.polar(U.lerp(-150, -102, e), 272));
    var curva = U.lerp(-0.05, 0.7, e);
    var ang = U.lerp(-172, -150, e);
    var pose = {
      cadera: cad,
      cuello: U.suma(cad, U.polar(ang, 404 * (1 - 0.08 * Math.max(0, curva)))),
      curva: curva,
      cabeza: U.lerp(-6, -24, e),
      piso: PISO
    };
    pose.rodilla = RODILLA;
    pose.tobillo = U.suma(RODILLA, [262, 6]);
    pose.punta = U.suma(pose.tobillo, U.polar(84, 70));
    pose.rodilla2 = U.suma(RODILLA, [18, -8]);
    pose.tobillo2 = U.suma(pose.tobillo, [18, -8]);
    pose.punta2 = U.suma(pose.punta, [18, -8]);
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: cad,
        mano: cad
      })
    });
    var dy = RUEDA_Y - g.hombro[1],
      L = 432;
    var mano = dy < L ? [g.hombro[0] - Math.sqrt(L * L - dy * dy), RUEDA_Y] : [g.hombro[0] - 30, g.hombro[1] + L];
    var c1 = B.ik(g.hombro, mano, 232, 214, 1),
      c2 = B.ik(g.hombro, mano, 232, 214, -1);
    pose.codo = c1[1] > c2[1] ? c1 : c2;
    pose.mano = mano;
    pose.codo2 = U.suma(pose.codo, [14, -8]);
    pose.mano2 = U.suma(mano, [14, -8]);
    return pose;
  }
  function Rueda(props) {
    var pose = rueda(props.k);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, 0.7),
      musc: props.musc,
      muscGris: props.muscGris,
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: -120,
          x1: 1360
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [700, PISO + 2],
          rx: 560
        }));
      },
      children: function (g) {
        var r = [g.mano[0], RUEDA_Y];
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: r[0],
          cy: r[1],
          r: 54,
          fill: C.GRY,
          stroke: C.INK,
          strokeWidth: 13
        }), /*#__PURE__*/React.createElement("circle", {
          cx: r[0],
          cy: r[1],
          r: 14,
          fill: C.INK
        }), props.extra ? props.extra(g) : null);
      }
    });
  }
  function abdomen(g) {
    return g.torso(0.36, g.anchoFrente(0.36) + 10);
  }
  var FIG_A = {
      x: -150,
      y: 300,
      s: 0.84
    },
    FIG_C = {
      x: -30,
      y: 250,
      s: 0.8
    },
    FIG_R = {
      x: 40,
      y: 180,
      s: 0.78
    };
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Los 3 mejores ejercicios de abdominales según la ciencia.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.35,
        foco: [540, 900]
      }], [1, {
        zoom: 1.04,
        foco: [540, 900]
      }]],
      pulsos: [0.3],
      tor: {
        boca: 'sonrisa',
        musc: {
          abd: 1,
          obl: 0.5
        },
        y: PL.FIG.y + 40,
        flex: function (T, f) {
          return 0.6 * Easing.easeOutBack(animate({
            from: 0,
            to: 1,
            start: f(0.04),
            end: f(0.3)
          })(T));
        },
        extra: function (g, T) {
          return /*#__PURE__*/React.createElement(V.Brillo, {
            T: T,
            c: U.suma(g.ombligo, [0, -50]),
            r: 130,
            v: 1
          });
        }
      },
      piezas: [{
        C: B.Cuenta,
        s: 1.1,
        x: 130,
        y: 1080,
        cuando: 0.3,
        p: {
          n: 3,
          p: 1
        }
      }],
      r1: {
        text: 'TOP 3 ABDOMINALES',
        s: 1.2,
        cuando: 0.02
      },
      r2: {
        text: 'SEGÚN LA CIENCIA',
        cuando: 0.4
      }
    })
  }, {
    nombre: '1. Abdominal en polea',
    dur: 2.2,
    vo: 'Uno: abdominal en polea, porque le puedes subir el peso.',
    C: TOP3.ejercicio({
      n: 1,
      fig: FIG_A,
      centro: [780, 760],
      foco: [700, 760],
      zoom: 1.15,
      r1: 'ABDOMINAL EN POLEA',
      r2: 'CON PESO',
      s1: 1.05,
      musculo: abdomen,
      dibujo: function (T, s, k, extra) {
        return /*#__PURE__*/React.createElement(PIEZAS.abdominalPolea.Figura, {
          T: T,
          s: s,
          k: k,
          musc: {
            abd: 0.4 + 0.6 * k
          },
          extra: extra
        });
      }
    })
  }, {
    nombre: '2. Elevación de piernas',
    dur: 2.2,
    vo: 'Dos: elevación de piernas colgado, sin balancearte.',
    C: TOP3.ejercicio({
      n: 2,
      fig: FIG_C,
      centro: [640, 860],
      foco: [600, 900],
      zoom: 1.12,
      mira: [540, 1000],
      r1: 'ELEVACIÓN DE PIERNAS',
      r2: 'SIN BALANCEO',
      s1: 1.02,
      musculo: abdomen,
      dibujo: function (T, s, k, extra) {
        return /*#__PURE__*/React.createElement(Colgado, {
          T: T,
          s: s,
          k: k,
          musc: {
            abd: 0.4 + 0.6 * k
          },
          muscGris: {
            psoas: 0.6,
            dor: 0.3
          },
          extra: extra
        });
      }
    })
  }, {
    nombre: '3. Rueda abdominal',
    dur: 2.2,
    vo: 'Tres: rueda abdominal, con el abdomen estirado.',
    C: TOP3.ejercicio({
      n: 3,
      fig: FIG_R,
      centro: [640, 1060],
      foco: [700, 1040],
      zoom: 1.1,
      mira: [540, 1040],
      r1: 'RUEDA ABDOMINAL',
      r2: 'ABDOMEN ESTIRADO',
      musculo: abdomen,
      dibujo: function (T, s, k, extra) {
        return /*#__PURE__*/React.createElement(Rueda, {
          T: T,
          s: s,
          k: k,
          musc: {
            abd: 0.4 + 0.6 * k
          },
          muscGris: {
            dor: 0.4,
            tri: 0.3
          },
          extra: extra
        });
      }
    })
  }];
  global.REELS.registrar({
    id: 'abdominales-top3',
    titulo: 'Top 3 abdominales (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.3,
      vo: '¿Estás de acuerdo? Coméntalo, compártelo y guárdalo.'
    }
  });
})(window);
