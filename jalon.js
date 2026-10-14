/* GENERADO por compilar.js desde jalon.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   JALON AL PECHO PRONADO — reel corto (~31 s con el cierre de marca)
   Fuente: libro de biomecanica, pag. 53. Sentado, muslos firmes bajo el
   soporte, agarre abierto (un poco mas ancho que los hombros); tirar de
   la barra hasta el pecho llevando los codos abajo y volver controlado.
   Dorsal ancho (principal); biceps, deltoides posterior, trapecio y
   redondo mayor. Errores: inclinarse demasiado atras (carga lumbar) y
   no mover las escapulas.
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
  var BLANCO = '#ffffff';
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };

  /* ---------------- de perfil: sentado en la maquina ---------------- */

  var CADERA = [760, 960];
  var CABLE_X = 730; // el cable baja vertical desde la polea
  var POLEA = [CABLE_X, 60];
  var PISO = 1270;

  // sube 0 brazos arriba -> 1 barra en el pecho; lean grados hacia atras (8 = normal)
  function sentado(sube, lean) {
    if (lean == null) lean = 8;
    var cuello = U.suma(CADERA, U.polar(-90 + lean, 404));
    var pose = {
      cadera: CADERA,
      cuello: cuello,
      curva: 0,
      cabeza: -4 - 0.3 * lean,
      piso: PISO,
      cabezaEncima: true
    };
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: [700, 700],
        mano: [700, 900]
      })
    });
    var S = g.hombro;
    var yArriba = S[1] - Math.sqrt(Math.max(0, 440 * 440 - Math.pow(S[0] - CABLE_X, 2)));
    var yAbajo = S[1] + 50;
    var mano = [CABLE_X, yArriba + (yAbajo - yArriba) * Easing.easeInOutSine(sube)];
    var d = U.largo(U.resta(mano, S)),
      dob = clamp(1 - d / 446, 0, 1);
    pose.mano = mano;
    pose.codo = U.suma(U.lerpP(S, mano, 0.5), [60 * dob, 30 * dob]);
    pose.rodilla = U.suma(CADERA, [-272, 10]);
    pose.tobillo = U.suma(pose.rodilla, [-18, 266]);
    pose.punta = U.suma(pose.tobillo, [-112, 32]);
    return pose;
  }
  function Maquina(props) {
    var mano = props.mano;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
      y: PISO,
      x0: 240,
      x1: 1300
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 1120,
      y: 20,
      width: 56,
      height: PISO - 20,
      rx: 14,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: CABLE_X - 40,
      y: 8,
      width: 480,
      height: 44,
      rx: 14,
      fill: BLANCO
    }, LN)), [0, 1, 2, 3, 4].map(function (i) {
      return /*#__PURE__*/React.createElement("rect", {
        key: i,
        x: 1060,
        y: PISO - 60 - i * 46,
        width: 176,
        height: 40,
        rx: 8,
        fill: C.GRY,
        stroke: C.INK,
        strokeWidth: 11
      });
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 620,
      y: 1000,
      width: 330,
      height: 52,
      rx: 20,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M 800 1052 L 800 ' + PISO + ' M 800 1150 L 1120 1150',
      fill: "none"
    }, LN)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 540 880 L 540 1150 L 800 1150",
      fill: "none"
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + CABLE_X + ' ' + mano[1] + ' L ' + CABLE_X + ' ' + (POLEA[1] + 20) + ' M ' + (CABLE_X + 30) + ' 70 L 1148 70 L 1148 ' + (PISO - 290),
      fill: "none",
      stroke: C.INK,
      strokeWidth: 9,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: POLEA[0] + 2,
      cy: POLEA[1] + 30,
      r: 34,
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 13
    }));
  }

  // el rodillo va encima de los muslos, cerca de las rodillas
  function Rodillo() {
    return /*#__PURE__*/React.createElement("rect", _extends({
      x: 490,
      y: 846,
      width: 104,
      height: 64,
      rx: 30,
      fill: C.GRY
    }, LN));
  }
  function Perfil(props) {
    var pose = sentado(props.sube, props.lean);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function (g) {
        return /*#__PURE__*/React.createElement(Maquina, {
          mano: g.mano
        });
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Rodillo, null), /*#__PURE__*/React.createElement("circle", {
          cx: g.mano[0],
          cy: g.mano[1],
          r: 22,
          fill: BLANCO,
          stroke: C.INK,
          strokeWidth: 11
        }), props.extra ? props.extra(g) : null);
      }
    });
  }

  /* ---------------- de espaldas: barra, cable y asiento ---------------- */

  var EW = 1100;
  function Espalda(props) {
    var s = props.s;
    var g = B.geoEspalda({
      brazos: 'arriba',
      sube: props.sube,
      depr: props.depr
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: EW * s,
        height: 1000 * s
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: EW * s,
      height: 1000 * s,
      viewBox: "0 0 1100 1000",
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M 550 ' + g.barraY + ' L 550 -420',
      stroke: C.INK,
      strokeWidth: 9,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 550,
      cy: -450,
      r: 40,
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 13
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 250,
      y: 1000,
      width: 600,
      height: 56,
      rx: 22,
      fill: C.GRY
    }, LN))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0
      }
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: s,
      brazos: "arriba",
      sube: props.sube,
      depr: props.depr,
      barra: {
        x0: 20,
        x1: 1080
      },
      musc: props.musc,
      muscGris: props.muscGris,
      muscAmarillo: props.muscAmarillo,
      muscRojo: props.muscRojo,
      children: function (gg) {
        return props.extra ? props.extra(gg) : null;
      }
    })));
  }

  /* ---------------- encuadre y ritmo ---------------- */

  var FIG = {
    x: -182,
    y: 270,
    s: 0.95
  };
  var ESP = {
    x: 128,
    y: 452,
    s: 0.75
  };
  function enLienzo(p, base) {
    base = base || FIG;
    return [base.x + p[0] * base.s, base.y + p[1] * base.s];
  }

  // repeticion: tira en el 40 %, vuelve controlado en el 60 %
  function rep(T, a, b, n, rapido) {
    if (T <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a)) * n;
    if (u >= n) return 0;
    var k = u - Math.floor(u);
    var corte = rapido ? 0.5 : 0.4;
    return k < corte ? Easing.easeInOutSine(k / corte) : 1 - Easing.easeInOutSine((k - corte) / (1 - corte));
  }
  function lineaTronco(g, color, p) {
    var d = U.unidad(U.resta(g.cuello, g.cadera));
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [U.suma(g.cadera, U.por(d, -40)), U.suma(g.cuello, U.por(d, 130))],
      color: color,
      sw: 16,
      p: p == null ? 1 : p
    });
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: se tira atras para bajar la barra; salen las X */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = rep(T, f(0), f(1), 2, true);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rot = M.pop(T, f(0.02), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.06 * t,
      foco: enLienzo([760, 600])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dx: M.vibra(T, 30, 3),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      sube: sube,
      lean: 8 + 32 * sube,
      muscRojo: {
        erec: sube
      }
    }))), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.2),
      x: 130,
      y: 560,
      s: 0.6
    }), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.42),
      x: 110,
      y: 820,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "JAL\xD3N AL PECHO",
      s: 1.15,
      y: 250,
      e: rot
    }));
  }

  /* 2 — posicion: muslos fijos bajo el soporte, agarre abierto */
  function EscPosicion(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var aro1 = animate({
      from: 0,
      to: 1,
      start: f(0.1),
      end: f(0.22)
    })(T);
    var aro2 = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.62)
    })(T);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.48), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: enLienzo([760, 600])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      sube: 0,
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
          c: [542, 878],
          r: 84,
          color: C.YEL,
          p: aro1
        }), /*#__PURE__*/React.createElement(B.Anillo, {
          c: g.mano,
          r: 60,
          color: C.YEL,
          p: aro2
        }));
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.26),
      x: 120,
      y: 1060
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.66),
      x: 120,
      y: 560,
      fase: 0.4
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "MUSLOS FIJOS",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "AGARRE ABIERTO",
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }

  /* 3 — tiron: de espaldas, codos abajo y barra al pecho */
  function EscTiron(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = rep(T, f(0.03), f(0.99), 2);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.5), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [540, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: ESP.x,
      y: ESP.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Espalda, {
      s: ESP.s,
      sube: sube,
      musc: {
        dor: 0.3 + 0.7 * sube
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, [g.izq, g.der].map(function (q, i) {
          return /*#__PURE__*/React.createElement(B.FlechaS, {
            key: i,
            a: U.suma(q.E, [0, -150]),
            b: U.suma(q.E, [0, -10]),
            color: sube > 0.95 ? C.GRN : C.YEL,
            sw: 18,
            p: clamp(0.3 + sube, 0, 1)
          });
        }));
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS ABAJO",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "BARRA AL PECHO",
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }

  /* 4 — musculos: dorsal ancho; biceps, redondo mayor, trapecio, deltoides post. */
  function EscMusculos(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var dor = animate({
      from: 0,
      to: 1,
      start: f(0.06),
      end: f(0.2)
    })(T);
    var sec = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.62)
    })(T);
    var sube = 0.75 + M.life(T, 2.4, 0.25);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.52), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.15 + 0.05 * t,
      foco: [540, 960]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: ESP.x,
      y: ESP.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Espalda, {
      s: ESP.s,
      sube: sube,
      musc: {
        dor: dor
      },
      muscGris: {
        rM: sec,
        tra: sec * 0.7,
        dp: sec
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "DORSAL ANCHO",
      s: 1.15,
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "+ B\xCDCEPS Y REDONDO MAYOR",
      s: 1,
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }

  // comparacion de perfil: el tronco, los brazos y la barra
  var CMP = {
    s: 0.7,
    desdeY: 150,
    w: 1080,
    h: 580,
    yArriba: 300,
    yAbajo: 920,
    centroX: 840
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
        left: 540 - CMP.centroX * s,
        top: 0
      }
    }, props.children)));
  }

  /* 5 — error 1: echarse atras */
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var sube = rep(T, f(0), f(1), 2);
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
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: CMP.s,
      sube: sube,
      lean: 8 + 32 * sube,
      muscRojo: {
        erec: sube
      },
      extra: function (g) {
        return lineaTronco(g, C.RED);
      }
    })), /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: CMP.s,
      sube: sube,
      musc: {
        dor: sube
      },
      extra: function (g) {
        return lineaTronco(g, C.GRN);
      }
    })), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.14),
      x: 110,
      y: CMP.yArriba + 40,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.56),
      x: 110,
      y: CMP.yAbajo + 40
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "MUY ATR\xC1S",
      y: 230,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "TRONCO ESTABLE",
      y: 1530,
      s: 1,
      e: r2,
      fase: 0.4
    }));
  }

  // comparacion de espaldas: la barra, los hombros y las escapulas
  var CMPE = {
    s: 0.62,
    desdeY: -60,
    w: 1080,
    h: 580,
    yArriba: 300,
    yAbajo: 920
  };
  function MitadE(props) {
    var s = CMPE.s;
    return /*#__PURE__*/React.createElement(Pos, {
      x: 0,
      y: 0,
      e: props.e,
      dx: props.dx,
      dy: props.dy,
      origen: '540px ' + (props.y + CMPE.h / 2) + 'px'
    }, /*#__PURE__*/React.createElement(Recorte, {
      x: 0,
      y: props.y,
      w: CMPE.w,
      h: CMPE.h,
      desde: CMPE.desdeY * s
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 540 - 550 * s,
        top: 0
      }
    }, props.children)));
  }

  /* 6 — error 2: escapulas quietas (hombros arriba) vs. bajarlas al tirar */
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var sube = rep(T, f(0), f(1), 2);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4),
      r2 = M.pop(T, f(0.36), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(MitadE, {
      y: CMPE.yArriba,
      e: arriba,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Espalda, {
      s: CMPE.s,
      sube: sube,
      depr: 0,
      muscRojo: {
        tra: 0.4 + 0.6 * sube
      }
    })), /*#__PURE__*/React.createElement(MitadE, {
      y: CMPE.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Espalda, {
      s: CMPE.s,
      sube: sube,
      musc: {
        dor: sube
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, [g.izq, g.der].map(function (q, i) {
          return /*#__PURE__*/React.createElement(B.FlechaS, {
            key: i,
            a: U.suma(q.angSup, [0, -70]),
            b: U.suma(q.angSup, [0, 60]),
            color: C.GRN,
            sw: 16,
            p: clamp(sube * 1.4, 0, 1)
          });
        }));
      }
    })), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.14),
      x: 880,
      y: CMPE.yArriba + 40,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.56),
      x: 880,
      y: CMPE.yAbajo + 40
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ESC\xC1PULAS QUIETAS",
      y: 230,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "BAJA LAS ESC\xC1PULAS",
      y: 1530,
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
    var sube = rep(T, f(0), f(1), 1);
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
      foco: [540, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: ESP.x,
      y: ESP.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Espalda, {
      s: ESP.s,
      sube: sube,
      musc: {
        dor: 1
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.3),
      x: 860,
      y: 1000,
      s: 0.85
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "JAL\xD3N AL PECHO",
      s: 1.15,
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    C: EscGancho,
    vo: 'Estás haciendo mal tu jalón al pecho.'
  }, {
    nombre: 'Posición',
    dur: 5,
    C: EscPosicion,
    vo: 'Muslos fijos bajo el soporte y agarre un poco más ancho que los hombros.'
  }, {
    nombre: 'Tirón',
    dur: 5,
    C: EscTiron,
    vo: 'Tira de la barra hasta el pecho llevando los codos hacia abajo, y vuelve controlando.'
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    C: EscMusculos,
    vo: 'Trabaja el dorsal ancho, con ayuda del bíceps, el redondo mayor y el trapecio.'
  }, {
    nombre: 'Error 1',
    dur: 4,
    C: EscError1,
    vo: 'Error uno: echarte muy atrás para tirar. Eso carga tu zona lumbar.'
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    C: EscError2,
    vo: 'Error dos: no mover las escápulas. Bájalas y júntalas al tirar.'
  }, {
    nombre: 'Cierre',
    dur: 2.5,
    C: EscCierre,
    vo: 'Así se hace. Técnica antes que peso.'
  }];
  global.REELS.registrar({
    id: 'jalon',
    titulo: 'Jalón al pecho',
    escenas: ESCENAS
  });
})(window);
