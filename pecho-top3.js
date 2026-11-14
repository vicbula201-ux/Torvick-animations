/* GENERADO por compilar.js desde pecho-top3.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   LOS 3 MEJORES EJERCICIOS DE PECHO SEGUN LA CIENCIA — reel de ~16 s, ESTILO 2
   (formato de biceps-top3: gancho + 3 ejercicios + accion + cierre)
   1. Press de banca con mancuernas: rango completo, el pecho estirado abajo
      (recorrido completo: Pallares y cols., 2021).
   2. Press inclinado: con el banco a unos 30° la porcion clavicular (pecho
      alto) trabaja mas (Rodriguez-Ridao y cols., 2020, IJERPH).
   3. Fondos en paralelas con el tronco adelante: el pecho bajo, estirado.
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
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };
  var PISO = 1300;
  function rodillaArriba(cad, tob) {
    var r1 = B.ik(cad, tob, 272, 268, 1),
      r2 = B.ik(cad, tob, 272, 268, -1);
    return r1[1] < r2[1] ? r1 : r2;
  }

  /* ---------------- 1. press de banca con mancuernas (banco plano) ---------------- */

  function plano(k) {
    return B.posePerfil.banco({
      x: 560,
      piso: PISO,
      p: k
    });
  }

  // 2. press inclinado: la misma pose del banco, girada 30° desde la cadera, con los pies en el piso
  var INCL = 30;
  function inclinado(k) {
    var base = plano(k);
    var cad = base.cadera;
    var pose = B.posePerfil.girar(base, cad, -INCL);
    pose.tobillo = [cad[0] - 250, PISO - 32];
    pose.punta = U.suma(pose.tobillo, [-112, 32]);
    pose.rodilla = rodillaArriba(cad, pose.tobillo);
    pose.tobillo2 = U.suma(pose.tobillo, [34, -2]);
    pose.punta2 = U.suma(pose.punta, [34, -2]);
    pose.rodilla2 = rodillaArriba(cad, pose.tobillo2);
    pose.piso = PISO;
    return pose;
  }
  function Banco(props) {
    var pose = props.pose;
    if (props.tipo === 'plano') {
      var b = pose.banco;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
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
    }
    // inclinado: el asiento bajo la cadera y el respaldo a lo largo de la espalda
    var cad = pose.cadera,
      d = U.polar(-INCL, 1),
      atras = [-d[1], d[0]];
    var a = U.suma(U.suma(cad, U.por(atras, 112)), U.por(d, -40)),
      bb = U.suma(a, U.por(d, 560));
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + U.pt(U.suma(a, [0, 40])) + ' L ' + (a[0] + 40) + ' ' + PISO + ' M ' + U.pt(U.lerpP(a, bb, 0.6)) + ' L ' + (U.lerpP(a, bb, 0.6)[0] + 40) + ' ' + PISO,
      fill: "none"
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(a) + ' L ' + U.pt(bb),
      stroke: C.INK,
      strokeWidth: 80,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(a) + ' L ' + U.pt(bb),
      stroke: C.GRY,
      strokeWidth: 52,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(U.suma(cad, [-200, 110])) + ' L ' + U.pt(U.suma(a, [0, 10])),
      stroke: C.INK,
      strokeWidth: 80,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(U.suma(cad, [-200, 110])) + ' L ' + U.pt(U.suma(a, [0, 10])),
      stroke: C.GRY,
      strokeWidth: 52,
      strokeLinecap: "round"
    }));
  }
  function Press(props) {
    var pose = props.tipo === 'plano' ? plano(props.k) : inclinado(props.k);
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
        }), /*#__PURE__*/React.createElement(Banco, {
          tipo: props.tipo,
          pose: pose
        }));
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.mano,
          ang: 0,
          giro: 1,
          k: 0.75
        });
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }
  function pectoral(g) {
    return g.torso(0.8, g.anchoFrente(0.8) + 6);
  }
  var FIG_B = {
      x: -70,
      y: 280,
      s: 0.86
    },
    FIG_I = {
      x: -40,
      y: 260,
      s: 0.84
    },
    FIG_F = {
      x: 30,
      y: 230,
      s: 0.84
    };
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Los 3 mejores ejercicios de pecho según la ciencia.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.3,
        foco: [540, 700]
      }], [1, {
        zoom: 1.04,
        foco: [540, 900]
      }]],
      pulsos: [0.3],
      tor: {
        boca: 'sonrisa',
        musc: {
          pec: 1
        },
        y: PL.FIG.y + 40,
        flex: function (T, f) {
          return 0.2 + 0.5 * Easing.easeOutBack(animate({
            from: 0,
            to: 1,
            start: f(0.04),
            end: f(0.3)
          })(T));
        },
        extra: function (g, T) {
          return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
            T: T,
            c: U.suma(g.pecho, [-80, 30]),
            r: 100,
            v: 1
          }), /*#__PURE__*/React.createElement(V.Brillo, {
            T: T,
            c: U.suma(g.pecho, [80, 30]),
            r: 100,
            v: 1
          }));
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
        text: 'TOP 3 PECHO',
        s: 1.3,
        cuando: 0.02
      },
      r2: {
        text: 'SEGÚN LA CIENCIA',
        cuando: 0.4
      }
    })
  }, {
    nombre: '1. Press de banca',
    dur: 2.2,
    vo: 'Uno: press de banca con mancuernas, bajando bien.',
    C: TOP3.ejercicio({
      n: 1,
      fig: FIG_B,
      centro: [720, 900],
      foco: [820, 860],
      zoom: 1.25,
      r1: 'PRESS DE BANCA',
      r2: 'BAJA HASTA ESTIRAR',
      musculo: pectoral,
      dibujo: function (T, s, k, extra) {
        return /*#__PURE__*/React.createElement(Press, {
          T: T,
          s: s,
          tipo: "plano",
          k: k,
          musc: {
            pec: 0.4 + 0.6 * k
          },
          muscGris: {
            delt: 0.5,
            tri: 0.5
          },
          extra: extra
        });
      }
    })
  }, {
    nombre: '2. Press inclinado',
    dur: 2.2,
    vo: 'Dos: press inclinado, para la parte alta del pecho.',
    C: TOP3.ejercicio({
      n: 2,
      fig: FIG_I,
      centro: [720, 860],
      foco: [800, 760],
      zoom: 1.22,
      r1: 'PRESS INCLINADO',
      r2: 'PECHO ALTO',
      musculo: pectoral,
      dibujo: function (T, s, k, extra) {
        return /*#__PURE__*/React.createElement(Press, {
          T: T,
          s: s,
          tipo: "inclinado",
          k: k,
          musc: {
            pec: 0.4 + 0.6 * k,
            delt: 0.4
          },
          muscGris: {
            tri: 0.5
          },
          extra: extra
        });
      }
    })
  }, {
    nombre: '3. Fondos',
    dur: 2.2,
    vo: 'Tres: fondos en paralelas, con el pecho adelante.',
    C: TOP3.ejercicio({
      n: 3,
      fig: FIG_F,
      centro: [620, 820],
      foco: [600, 640],
      zoom: 1.2,
      r1: 'FONDOS',
      r2: 'PECHO ADELANTE',
      musculo: pectoral,
      dibujo: function (T, s, k, extra) {
        return /*#__PURE__*/React.createElement(PIEZAS.fondos.Figura, {
          s: s,
          baja: 1 - k,
          incl: 26,
          musc: {
            pec: 0.4 + 0.6 * k
          },
          muscGris: {
            tri: 0.6,
            delt: 0.4
          },
          extra: extra
        });
      }
    })
  }];
  global.REELS.registrar({
    id: 'pecho-top3',
    titulo: 'Top 3 pecho (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.3,
      vo: '¿Estás de acuerdo? Coméntalo, compártelo y guárdalo.'
    }
  });
})(window);
