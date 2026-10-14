/* GENERADO por compilar.js desde flexiones.jsx — no editar a mano. */
/* ============================================================
   FLEXIONES — reel corto (~31 s con el cierre de marca)
   Fuente: libro de biomecanica, pag. 48. Plancha con manos un poco mas
   anchas que los hombros, cuerpo recto de la cabeza a los talones, bajar
   hasta que el pecho casi toque el suelo y empujar. Errores: recorrido
   parcial y cadera que se hunde o se eleva.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var A = global.REELS.ayudas;
  var Pos = A.Pos,
    Rot = A.Rot,
    Camara = A.Camara,
    Recorte = A.Recorte,
    Mal = A.Mal,
    Bien = A.Bien;
  var PISO = 1000;
  var PIE = [1180, PISO]; // la punta del pie queda fija en el piso

  /* ---------------- pose de plancha ---------------- */

  // la figura de pie se gira alrededor de la punta del pie hasta que el hombro
  // queda a la altura pedida; baja 0 = arriba (brazos casi rectos), 1 = pecho casi en el piso
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

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: 20,
    y: 300,
    s: 0.82
  };
  function enLienzo(p, base) {
    base = base || FIG;
    return [base.x + p[0] * base.s, base.y + p[1] * base.s];
  }
  function Plancha(props) {
    var pose = plancha(props.baja, props.cadera);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
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

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: cadera hundida y a medias; salen las X */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var baja = rep(T, f(0), f(1), 2, 0, 0.45);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rot = M.pop(T, f(0.02), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.06 * t,
      foco: enLienzo([800, 800])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dx: M.vibra(T, 30, 2),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Plancha, {
      s: FIG.s,
      baja: baja,
      cadera: 1,
      muscRojo: {
        erec: 1
      }
    }))), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.2),
      x: 560,
      y: 1120,
      s: 0.6
    }), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.42),
      x: 170,
      y: 640,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "FLEXIONES",
      s: 1.3,
      y: 300,
      e: rot
    }));
  }

  /* 2 — posicion: cuerpo recto y manos bajo los hombros, un poco anchas */
  function EscPosicion(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var cadera = animate({
      from: 0.8,
      to: 0,
      start: f(0.06),
      end: f(0.3),
      ease: Easing.easeInOutCubic
    })(T);
    var lin = M.draw(T, f(0.3), dur * 0.18);
    var mano = M.draw(T, f(0.6), dur * 0.15);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.3), 0.4),
      r2 = M.pop(T, f(0.6), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: enLienzo([800, 800])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Plancha, {
      s: FIG.s,
      baja: 0,
      cadera: cadera,
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, lin > 0.02 ? /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [g.tobillo, g.cadera, g.cuello, g.centroCabeza],
          p: lin,
          color: C.GRN,
          sw: 16
        }) : null, /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [g.hombro, [g.hombro[0], PISO - 4]],
          p: mano,
          color: C.YEL,
          sw: 16
        }));
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.46),
      x: 820,
      y: 560
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.78),
      x: 160,
      y: 1180,
      fase: 0.4
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CUERPO RECTO",
      y: 300,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "MANOS ALGO ANCHAS",
      y: 1360,
      e: r2,
      fase: 0.4
    }));
  }

  /* 3 — bajar hasta casi tocar y empujar */
  function EscBajada(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var baja = rep(T, f(0.02), f(0.98), 2);
    var abajo = baja > 0.92;
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.5), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.05 + 0.05 * t,
      foco: enLienzo([620, 880])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Plancha, {
      s: FIG.s,
      baja: baja,
      musc: {
        pec: 0.3 + 0.7 * baja
      },
      extra: function (g) {
        var pecho = g.frentePecho;
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [pecho, [pecho[0], PISO - 4]],
          color: abajo ? C.GRN : C.YEL,
          sw: 14
        }), /*#__PURE__*/React.createElement(B.Anillo, {
          c: [pecho[0], PISO - 4],
          r: 30,
          color: abajo ? C.GRN : C.YEL,
          p: baja
        }));
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PECHO CASI AL SUELO",
      y: 300,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "EMPUJA HASTA ARRIBA",
      y: 1360,
      e: r2,
      fase: 0.4
    }));
  }

  /* 4 — musculos */
  function EscMusculos(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var pec = animate({
      from: 0,
      to: 1,
      start: f(0.06),
      end: f(0.2)
    })(T);
    var tri = animate({
      from: 0,
      to: 1,
      start: f(0.42),
      end: f(0.52)
    })(T);
    var del = animate({
      from: 0,
      to: 1,
      start: f(0.58),
      end: f(0.68)
    })(T);
    var core = animate({
      from: 0,
      to: 1,
      start: f(0.76),
      end: f(0.86)
    })(T);
    var baja = 0.6 + M.life(T, 2.4, 0.2);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.44), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.25 + 0.05 * t,
      foco: enLienzo([640, 860]),
      mira: [600, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Plancha, {
      s: FIG.s,
      baja: baja,
      musc: {
        pec: pec
      },
      muscGris: {
        tri: tri,
        delt: del,
        abd: core
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PECTORAL MAYOR",
      y: 300,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "+ TR\xCDCEPS Y DELTOIDES",
      y: 1360,
      e: r2,
      fase: 0.4
    }));
  }

  // comparacion arriba (mal) / abajo (bien): franja horizontal del cuerpo
  var CMP = {
    s: 0.78,
    desdeY: 380,
    w: 1080,
    h: 520,
    yArriba: 360,
    yAbajo: 960,
    x0: 30
  };
  function Mitad(props) {
    var s = CMP.s;
    return /*#__PURE__*/React.createElement(Pos, {
      x: 0,
      y: 0,
      e: props.e,
      dx: props.dx,
      dy: props.dy,
      origen: '540px ' + (props.y + CMP.h / 2) + 'px'
    }, /*#__PURE__*/React.createElement(Recorte, {
      x: 0,
      y: props.y,
      w: CMP.w,
      h: CMP.h,
      desde: CMP.desdeY * s
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: CMP.x0,
        top: 0
      }
    }, props.children)));
  }

  /* 5 — error 1: a medias */
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var corto = rep(T, f(0), f(1), 3, 0, 0.4);
    var largo = rep(T, f(0), f(1), 1.5);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4),
      r2 = M.pop(T, f(0.36), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yArriba,
      e: arriba,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Plancha, {
      s: CMP.s,
      baja: corto
    })), /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Plancha, {
      s: CMP.s,
      baja: largo,
      musc: {
        pec: largo
      }
    })), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.14),
      x: 860,
      y: CMP.yArriba + 20,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.56),
      x: 860,
      y: CMP.yAbajo + 20
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "A MEDIAS",
      y: 240,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RECORRIDO COMPLETO",
      y: 1500,
      s: 1,
      e: r2,
      fase: 0.4
    }));
  }

  /* 6 — error 2: cadera hundida o elevada */
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var baja = rep(T, f(0), f(1), 1.5);
    var cad = T < f(0.5) ? 1 : -1; // primero se hunde, despues se eleva
    var cambio = animate({
      from: 1,
      to: -1,
      start: f(0.45),
      end: f(0.55),
      ease: Easing.easeInOutCubic
    })(T);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4),
      r2 = M.pop(T, f(0.36), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yArriba,
      e: arriba,
      dx: M.vibra(T, 30, 2),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Plancha, {
      s: CMP.s,
      baja: baja,
      cadera: cambio,
      muscRojo: {
        erec: cad > 0 ? 1 : 0
      },
      extra: function (g) {
        return lineaCuerpo(g, C.RED);
      }
    })), /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Plancha, {
      s: CMP.s,
      baja: baja,
      muscGris: {
        abd: 1
      },
      extra: function (g) {
        return lineaCuerpo(g, C.GRN);
      }
    })), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.14),
      x: 860,
      y: CMP.yArriba + 20,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.62),
      x: 860,
      y: CMP.yAbajo + 20
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CADERA FUERA DE L\xCDNEA",
      y: 240,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CUERPO EN L\xCDNEA",
      y: 1500,
      s: 1,
      e: r2,
      fase: 0.4
    }));
  }

  /* 7 — cierre */
  function EscCierre(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var baja = rep(T, f(0), f(1), 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.4),
      r2 = M.pop(T, f(0.4), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: enLienzo([800, 800])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Plancha, {
      s: FIG.s,
      baja: baja,
      musc: {
        pec: 1
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.3),
      x: 800,
      y: 540,
      s: 0.85
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "FLEXIONES",
      s: 1.3,
      y: 300,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1360,
      e: r2,
      fase: 0.4
    }));
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    C: EscGancho,
    vo: 'Estás haciendo mal tus flexiones.'
  }, {
    nombre: 'Posición',
    dur: 5.5,
    C: EscPosicion,
    vo: 'Manos un poco más anchas que los hombros y el cuerpo recto, de la cabeza a los talones.'
  }, {
    nombre: 'Bajada',
    dur: 5,
    C: EscBajada,
    vo: 'Baja hasta que el pecho casi toque el suelo y empuja hasta estirar los brazos.'
  }, {
    nombre: 'Músculos',
    dur: 5,
    C: EscMusculos,
    vo: 'Trabaja el pectoral mayor, con ayuda del tríceps, el deltoides anterior y el serrato.'
  }, {
    nombre: 'Error 1',
    dur: 3.5,
    C: EscError1,
    vo: 'Error uno: quedarte a medias. Baja y sube completo.'
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    C: EscError2,
    vo: 'Error dos: dejar caer o subir la cadera. Eso carga tu zona lumbar.'
  }, {
    nombre: 'Cierre',
    dur: 2.5,
    C: EscCierre,
    vo: 'Así se hace. Técnica antes que peso.'
  }];
  global.REELS.registrar({
    id: 'flexiones',
    titulo: 'Flexiones',
    escenas: ESCENAS
  });
})(window);
