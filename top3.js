/* GENERADO por compilar.js desde top3.jsx — no editar a mano. */
/* ============================================================
   TOP 3 — el formato de "los 3 mejores ejercicios de X según la ciencia"
   (como biceps-top3.jsx): un gancho con el musculo resaltado y el 3, y una
   escena corta por ejercicio con su numero, una repeticion con estela, el
   brillo en el musculo cuando esta estirado y la chispa al contraer.
   Lo usan espalda-top3, pecho-top3, triceps-top3, abdominales-top3 (con Tor)
   y gluteos-top3, isquios-top3, cuadriceps-top3 (con la novia de Tor).
   Las figuras con maquina salen de PIEZAS (las exportan los reels de cada
   ejercicio); las nuevas viven en el archivo de cada video.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    B = global.B,
    V = global.V,
    NOVIA = global.NOVIA;
  var U = B.util;

  /* ---------------- la novia de Tor de perfil: B.Perfil + sus capas ---------------- */

  function Ella(props) {
    var T = props.T,
      op = {
        glu: props.glu || 0
      };
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: props.pose,
      parpadeo: V.parpadeo(T, props.fase || 0),
      musc: Object.assign({
        glu: props.glu || 0
      }, props.musc || {}),
      muscGris: props.muscGris,
      fondo: function (g) {
        return /*#__PURE__*/React.createElement("g", null, props.fondo ? props.fondo(g) : null, NOVIA.perfil(g, T, op).fondo);
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement("g", null, NOVIA.perfil(g, T, op).agarre, props.agarre ? props.agarre(g) : null);
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, NOVIA.perfil(g, T, op).encima, props.extra ? props.extra(g) : null);
      }
    });
  }

  // puntos para el brillo: en la mitad de un segmento, corrido hacia la espalda o el frente
  // (de perfil la figura mira a la izquierda: la espalda queda a la derecha del eje)
  function atras(a, b, t, d) {
    var u = U.unidad(U.resta(b, a)),
      m = U.lerpP(a, b, t);
    return U.suma(m, U.por([u[1], -u[0]], d));
  }
  function adelante(a, b, t, d) {
    return atras(a, b, t, -d);
  }
  function cuenta(n, x, y, cuando) {
    return function (T, f) {
      var A = global.REELS.ayudas;
      return /*#__PURE__*/React.createElement(A.Pos, {
        x: x,
        y: y,
        e: M.pop(T, cuando == null ? f(0) - 0.6 : f(cuando), 0.5),
        dy: M.life(T, 3, 5)
      }, /*#__PURE__*/React.createElement(B.Cuenta, {
        s: 0.9,
        n: n,
        p: 1
      }));
    };
  }

  /* ---------------- la escena de un ejercicio ----------------
     o.n           el numero (1, 2, 3)
     o.fig         {x, y, s} donde va el viewBox de la figura en el lienzo
     o.centro      el centro de la figura (coordenadas del viewBox): plano general
     o.foco        el musculo (primer plano); o.zoom cuanto se acerca
     o.dibujo      (T, s, k, extra) => la figura; k 0 = estirado (el inicio) .. 1 = contraido
     o.musculo     (g) => donde brilla
     o.r1, o.r2    el nombre del ejercicio y la clave */
  function ejercicio(o) {
    var fig = o.fig;
    var en = function (p) {
      return [fig.x + p[0] * fig.s, fig.y + p[1] * fig.s];
    };
    var rep = function (Tx, f) {
      return V.ida(V.fase(Tx, f(0.05), f(0.95), o.reps || 1), o.va || 0.45, 0.12);
    };
    return V.escena({
      fig: fig,
      pulsos: [0.5],
      tomas: [[0, {
        zoom: o.zoom0 || 1.04,
        foco: en(o.centro),
        mira: o.mira || [540, 980]
      }], [1, {
        zoom: o.zoom || 1.22,
        foco: en(o.foco || o.centro),
        mira: o.mira || [540, 980]
      }]],
      figura: function (T, f, t, s) {
        var k = rep(T, f);
        return /*#__PURE__*/React.createElement(V.Estela, {
          T: T,
          n: 3,
          paso: 0.05,
          dibujar: function (Tx, fantasma) {
            return o.dibujo(Tx, s, rep(Tx, f), fantasma ? null : function (g) {
              var c = o.musculo(g);
              return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
                T: T,
                c: c,
                r: o.r || 80,
                v: 1 - k
              }), /*#__PURE__*/React.createElement(V.Chispa, {
                T: T,
                c: c,
                cuando: f(0.5),
                r: o.r || 80
              }));
            });
          }
        });
      },
      encima: cuenta(o.n, 40, 380),
      r1: {
        text: o.r1,
        s: o.s1 || 1.12,
        cuando: null
      },
      r2: {
        text: o.r2,
        s: o.s2,
        cuando: 0.2
      }
    });
  }

  /* ---------------- el gancho: el musculo que se enciende y el 3 ----------------
     o.fig, o.figura(T, f, t, s), o.tomas, o.musculo ("BÍCEPS", "ESPALDA"...) */
  function gancho(o) {
    return V.escena({
      fig: o.fig,
      pulsos: [0.3],
      tomas: o.tomas,
      figura: o.figura,
      encima: cuenta(3, 40, 1060, 0.3),
      r1: {
        text: 'TOP 3 ' + o.musculo,
        s: o.s1 || 1.3,
        cuando: 0.02
      },
      r2: {
        text: 'SEGÚN LA CIENCIA',
        cuando: 0.4
      }
    });
  }
  global.TOP3 = {
    Ella: Ella,
    ejercicio: ejercicio,
    gancho: gancho,
    atras: atras,
    adelante: adelante
  };
})(window);
