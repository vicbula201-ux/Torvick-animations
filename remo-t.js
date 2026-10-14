/* GENERADO por compilar.js desde remo-t.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   REMO EN BARRA T — reel corto (~31 s con el cierre de marca)
   Fuente: libro de biomecanica, pag. 63. Mango triangular, torso inclinado,
   rodillas un poco flexionadas, tirar hacia el abdomen con los codos cerca
   del cuerpo y volver controlando con estiramiento completo. Errores:
   curvar la columna y no mover las escapulas.
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
  var PISO = 1300;
  var PIVOTE = [1330, PISO - 14]; // la barra gira en el anclaje del piso, detras de la persona

  /* ---------------- pose inclinada con la barra ---------------- */

  var TOB = [700, 1236];
  // tira: 0 brazos estirados (estiramiento) .. 1 mango en el abdomen
  function inclinado(tira, curva) {
    curva = curva || 0;
    var cadera = [880, 760];
    var cuello = U.suma(cadera, U.polar(-138 + curva * 10, 404));
    var g0 = B.geoPerfil({
      pose: {
        cadera: cadera,
        cuello: cuello,
        curva: curva
      }
    });
    var hombro = g0.hombro;
    // la barra gira: el mango sigue un arco alrededor del pivote
    var R = 900;
    var angAbajo = Math.atan2(hombro[1] + 470 - PIVOTE[1], hombro[0] + 30 - PIVOTE[0]) * 180 / Math.PI;
    var angArriba = angAbajo + 13;
    var ang = U.lerp(angAbajo, angArriba, tira);
    var enBarra = U.suma(PIVOTE, U.polar(ang, R));
    var mano = U.suma(enBarra, [0, 64]);
    var codo = B.ik(hombro, mano, 232, 214, 1);
    var rodilla = B.ik(cadera, TOB, 272, 268, -1);
    return {
      pose: {
        cadera: cadera,
        cuello: cuello,
        curva: curva,
        cabeza: -22 + curva * 30,
        hombro: hombro,
        codo: codo,
        mano: mano,
        hombro2: U.suma(hombro, [12, -10]),
        codo2: U.suma(codo, [12, -10]),
        mano2: U.suma(mano, [10, -6]),
        rodilla: rodilla,
        tobillo: TOB,
        punta: U.suma(TOB, [-116, 6]),
        rodilla2: U.suma(rodilla, [40, -4]),
        tobillo2: U.suma(TOB, [60, 0]),
        punta2: U.suma(TOB, [-56, 6]),
        piso: PISO
      },
      ang: ang,
      enBarra: enBarra,
      R: R
    };
  }

  // barra con discos en la punta y el mango triangular colgando
  function Barra(props) {
    var b = props.b;
    var u = U.unidad(U.resta(b.enBarra, PIVOTE));
    var n = [-u[1], u[0]];
    var punta = U.suma(b.enBarra, U.por(u, 90));
    var ln = {
      stroke: C.INK,
      strokeLinejoin: 'round',
      strokeLinecap: 'round'
    };
    var disco = function (c, alto, grueso, k) {
      var a = U.suma(c, U.por(n, alto)),
        bb = U.suma(c, U.por(n, -alto));
      return /*#__PURE__*/React.createElement("path", _extends({
        key: k,
        d: 'M ' + U.pt(a) + ' L ' + U.pt(bb)
      }, ln, {
        stroke: C.INK,
        strokeWidth: grueso
      }));
    };
    var disco2 = function (c, alto, grueso, k) {
      var a = U.suma(c, U.por(n, alto - 7)),
        bb = U.suma(c, U.por(n, -alto + 7));
      return /*#__PURE__*/React.createElement("path", _extends({
        key: k,
        d: 'M ' + U.pt(a) + ' L ' + U.pt(bb)
      }, ln, {
        stroke: C.GRY,
        strokeWidth: grueso - 22
      }));
    };
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", _extends({
      x: PIVOTE[0] - 60,
      y: PISO - 30,
      width: 120,
      height: 34,
      rx: 10,
      fill: BLANCO
    }, ln, {
      strokeWidth: 13
    })), /*#__PURE__*/React.createElement("circle", _extends({
      cx: PIVOTE[0],
      cy: PIVOTE[1],
      r: 22,
      fill: BLANCO
    }, ln, {
      strokeWidth: 12
    })), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + U.pt(PIVOTE) + ' L ' + U.pt(U.suma(punta, U.por(u, 60)))
    }, ln, {
      strokeWidth: 30
    })), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + U.pt(PIVOTE) + ' L ' + U.pt(U.suma(punta, U.por(u, 60)))
    }, ln, {
      stroke: BLANCO,
      strokeWidth: 8
    })), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + U.pt(U.suma(b.enBarra, U.por(u, -36))) + ' L ' + U.pt(U.suma(b.enBarra, [0, 64])) + ' L ' + U.pt(U.suma(b.enBarra, U.por(u, 36))) + ' Z',
      fill: "none"
    }, ln, {
      strokeWidth: 14
    })), disco(U.suma(punta, U.por(u, 6)), 150, 52, 'a'), disco2(U.suma(punta, U.por(u, 6)), 150, 52, 'a2'), disco(U.suma(punta, U.por(u, 44)), 120, 40, 'b'), disco2(U.suma(punta, U.por(u, 44)), 120, 40, 'b2'));
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: -260,
    y: 60,
    s: 1.02
  };
  function enLienzo(p, base) {
    base = base || FIG;
    return [base.x + p[0] * base.s, base.y + p[1] * base.s];
  }
  function Remo(props) {
    var b = inclinado(props.tira, props.curva);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: b.pose,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function () {
        return /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 200,
          x1: 1400
        });
      },
      medio: function () {
        return /*#__PURE__*/React.createElement(Barra, {
          b: b
        });
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }

  // tira rapido (40 %) y vuelve controlando (60 %)
  function rep(T, a, b, n) {
    if (T <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a)) * n;
    if (u >= n) return 0;
    var k = u - Math.floor(u);
    return k < 0.4 ? Easing.easeInOutSine(k / 0.4) : 1 - Easing.easeInOutSine((k - 0.4) / 0.6);
  }
  function lineaEspalda(g, color) {
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: g.espaldaPts.slice(1, 11),
      color: color,
      sw: 16
    });
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: espalda curva y tiron con impulso; salen las X */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var tira = rep(T, f(0), f(1), 2);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rot = M.pop(T, f(0.02), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.06 * t,
      foco: enLienzo([800, 760])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dx: M.vibra(T, 30, 2),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Remo, {
      s: FIG.s,
      tira: tira,
      curva: 1,
      muscRojo: {
        erec: 1
      },
      extra: function (g) {
        return lineaEspalda(g, C.RED);
      }
    }))), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.2),
      x: 700,
      y: 560,
      s: 0.6
    }), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.42),
      x: 110,
      y: 1180,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "REMO EN BARRA T",
      s: 1.2,
      y: 260,
      e: rot
    }));
  }

  /* 2 — posicion: torso inclinado con espalda neutra, rodillas flexionadas */
  function EscPosicion(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var esp = M.draw(T, f(0.08), dur * 0.2);
    var rod = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.6)
    })(T);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.4),
      r2 = M.pop(T, f(0.5), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: enLienzo([800, 760])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Remo, {
      s: FIG.s,
      tira: 0,
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, esp > 0.02 ? /*#__PURE__*/React.createElement(B.Puntos, {
          pts: g.espaldaPts.slice(1, 11),
          p: esp,
          color: C.GRN,
          sw: 16
        }) : null, /*#__PURE__*/React.createElement(B.Anillo, {
          c: g.rodilla,
          r: 56,
          p: rod,
          color: C.YEL
        }), /*#__PURE__*/React.createElement(B.Anillo, {
          c: g.talon,
          r: 50,
          p: rod,
          color: C.YEL
        }));
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.32),
      x: 760,
      y: 420
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.72),
      x: 820,
      y: 1120,
      fase: 0.4
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ESPALDA NEUTRA",
      y: 260,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RODILLAS FLEXIONADAS",
      y: 1480,
      e: r2,
      fase: 0.4
    }));
  }

  /* 3 — tiron al abdomen con los codos pegados, vuelta controlada */
  function EscTiron(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var tira = rep(T, f(0.02), f(0.98), 2);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.5), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.12 + 0.05 * t,
      foco: enLienzo([760, 800]),
      mira: [560, 960]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Remo, {
      s: FIG.s,
      tira: tira,
      musc: {
        dor: 0.3 + 0.7 * tira
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
          c: g.codo,
          r: 48,
          color: C.YEL
        }), /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [g.codo, g.panza],
          color: tira > 0.85 ? C.GRN : C.YEL,
          sw: 14
        }));
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "AL ABDOMEN",
      y: 260,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS PEGADOS",
      y: 1480,
      e: r2,
      fase: 0.4
    }));
  }

  /* 4 — musculos: dorsal ancho (principal); romboides, trapecio, deltoides post. */
  var ESP = {
    x: 185,
    y: 350,
    s: 0.65
  };
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
      start: f(0.42),
      end: f(0.56)
    })(T);
    var ret = 0.5 + M.life(T, 2.2, 0.5);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.44), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.05 * t,
      foco: [540, 760]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: ESP.x,
      y: ESP.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: ESP.s,
      cuerpoEntero: true,
      codo: 0,
      ret: ret,
      musc: {
        dor: dor,
        rom: sec * 0.6,
        tra: sec * 0.6,
        dp: sec * 0.6,
        rM: sec * 0.6
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "DORSAL ANCHO",
      y: 260,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "+ ROMBOIDES Y TRAPECIO",
      y: 1480,
      s: 1,
      e: r2,
      fase: 0.4
    }));
  }

  // comparacion de perfil: franja del tronco
  var CMP = {
    s: 0.7,
    desdeY: 330,
    w: 1080,
    h: 560,
    yArriba: 330,
    yAbajo: 950,
    centroX: 760
  };
  function Mitad(props) {
    var s = CMP.s;
    return /*#__PURE__*/React.createElement(Pos, {
      x: 0,
      y: 0,
      e: props.e,
      dx: props.dx,
      dy: props.dy
    }, /*#__PURE__*/React.createElement(Recorte, {
      x: 0,
      y: props.y,
      w: CMP.w,
      h: CMP.h,
      desde: CMP.desdeY * s
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 520 - CMP.centroX * s,
        top: 0
      }
    }, props.children)));
  }

  /* 5 — error 1: curvar la espalda */
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var tira = rep(T, f(0), f(1), 2);
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
    }, /*#__PURE__*/React.createElement(Remo, {
      s: CMP.s,
      tira: tira,
      curva: 1,
      muscRojo: {
        erec: 1
      },
      extra: function (g) {
        return lineaEspalda(g, C.RED);
      }
    })), /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Remo, {
      s: CMP.s,
      tira: tira,
      musc: {
        dor: tira
      },
      extra: function (g) {
        return lineaEspalda(g, C.GRN);
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
      text: "ESPALDA CURVA",
      y: 230,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ESPALDA NEUTRA",
      y: 1530,
      s: 1,
      e: r2,
      fase: 0.4
    }));
  }

  /* 6 — error 2: escapulas quietas vs. juntar y separar */
  var CMPE = {
    s: 0.82,
    desde: 60,
    alto: 640,
    x: 89,
    yArriba: 300,
    yAbajo: 910
  };
  function MitadEsp(props) {
    var s = CMPE.s;
    return /*#__PURE__*/React.createElement(Pos, {
      x: 0,
      y: 0,
      e: props.e,
      dx: props.dx,
      dy: props.dy
    }, /*#__PURE__*/React.createElement(Recorte, {
      x: CMPE.x,
      y: props.y,
      w: 1100 * s,
      h: CMPE.alto * s,
      desde: CMPE.desde * s
    }, props.children));
  }
  function flechasEscapula(g, junta, color) {
    var L = g.izq.espinaMed,
      R = g.der.espinaMed;
    var y = (L[1] + R[1]) / 2 + 60;
    var d = junta ? 1 : -1;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.FlechaS, {
      a: [L[0] - 150 * (junta ? 1 : 0.2), y],
      b: [L[0] - 150 * (junta ? 0.2 : 1), y],
      color: color
    }), /*#__PURE__*/React.createElement(B.FlechaS, {
      a: [R[0] + 150 * (junta ? 1 : 0.2), y],
      b: [R[0] + 150 * (junta ? 0.2 : 1), y],
      color: color
    }));
  }
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var tira = rep(T, f(0), f(1), 2);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4),
      r2 = M.pop(T, f(0.36), 0.4);
    var u = (T - f(0)) / (f(1) - f(0)) * 2;
    var juntando = u - Math.floor(u) < 0.4;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(MitadEsp, {
      y: CMPE.yArriba,
      e: arriba,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: CMPE.s,
      codo: 0,
      ret: 0.2,
      muscRojo: {
        rom: 1
      },
      musc: {
        rom: 0.0
      },
      muscGris: {}
    })), /*#__PURE__*/React.createElement(MitadEsp, {
      y: CMPE.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: CMPE.s,
      codo: 0,
      ret: tira,
      musc: {
        rom: tira,
        dor: tira * 0.6
      }
    }, function (g) {
      return flechasEscapula(g, juntando, C.GRN);
    })), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.14),
      x: 860,
      y: CMPE.yArriba + 20,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.56),
      x: 860,
      y: CMPE.yAbajo + 20
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ESC\xC1PULAS QUIETAS",
      y: 230,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "JUNTA Y SEPARA",
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
    var tira = rep(T, f(0), f(1), 1);
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
      foco: enLienzo([800, 760])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Remo, {
      s: FIG.s,
      tira: tira,
      musc: {
        dor: 1
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.3),
      x: 780,
      y: 440,
      s: 0.85
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "REMO EN BARRA T",
      s: 1.2,
      y: 260,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1480,
      e: r2,
      fase: 0.4
    }));
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    C: EscGancho,
    vo: 'Estás haciendo mal el remo en T.'
  }, {
    nombre: 'Posición',
    dur: 5,
    C: EscPosicion,
    vo: 'Inclina el torso con la espalda neutra, rodillas un poco flexionadas y pies bien apoyados.'
  }, {
    nombre: 'Tirón',
    dur: 5,
    C: EscTiron,
    vo: 'Tira del mango hacia el abdomen con los codos pegados al cuerpo y vuelve controlando.'
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    C: EscMusculos,
    vo: 'Trabaja el dorsal ancho, con ayuda de romboides, trapecio y deltoides posterior.'
  }, {
    nombre: 'Error 1',
    dur: 4,
    C: EscError1,
    vo: 'Error uno: curvar la espalda. Mantenla neutra todo el tiempo.'
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    C: EscError2,
    vo: 'Error dos: no mover las escápulas. Júntalas al tirar y sepáralas al bajar.'
  }, {
    nombre: 'Cierre',
    dur: 2.5,
    C: EscCierre,
    vo: 'Así se hace. Técnica antes que peso.'
  }];
  global.REELS.registrar({
    id: 'remo-t',
    titulo: 'Remo en barra T',
    escenas: ESCENAS
  });
})(window);
