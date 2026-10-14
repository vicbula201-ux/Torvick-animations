/* GENERADO por compilar.js desde fondos-banco.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   FONDOS EN BANCO — reel corto (~31 s con el cierre de marca)
   Fuente: libro de biomecanica, pag. 124. Manos en el banco detras,
   codos cerca del cuerpo, piernas extendidas y caderas elevadas; bajar
   doblando los codos hasta ~90 grados y empujar. Triceps (principal);
   pectoral mayor, deltoides anterior y serrato. Errores: codos demasiado
   separados (tension en el hombro) e hiperextension de hombros (bajar
   de mas).
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

  /* ---------------- de perfil (mira a la izquierda; el banco queda atras) ---------------- */

  var MANO = [950, 1010]; // borde del banco
  var BANCO = {
    x0: 930,
    x1: 1380,
    y: 1010,
    piso: 1300
  };
  var TOBILLO = [470, 1268];

  // baja 0 brazos estirados -> 1 codos a 90 grados; mas de 1 = hiperextension
  function enBanco(baja) {
    var d = 140 * baja;
    var cuello = [905 - 18 * baja, 500 + d];
    var cadera = [860 - 10 * baja, 902 + d];
    var pose = {
      cadera: cadera,
      cuello: cuello,
      curva: 0,
      cabeza: 2,
      piso: 1300
    };
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        mano: MANO,
        codo: [950, 800]
      })
    });
    var codo = B.ik(g.hombro, MANO, 232, 214, 1);
    pose.codo = codo;
    pose.mano = MANO;
    pose.tobillo = TOBILLO;
    pose.punta = U.suma(TOBILLO, [-46, -104]);
    pose.rodilla = B.ik(cadera, TOBILLO, 272, 268, -1);
    pose.tobillo2 = U.suma(TOBILLO, [30, -2]);
    pose.punta2 = U.suma(pose.punta, [30, -2]);
    pose.rodilla2 = B.ik(U.suma(cadera, [16, -6]), pose.tobillo2, 272, 268, -1);
    return pose;
  }
  function Perfil(props) {
    var pose = enBanco(props.baja);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.BancoG, {
          vista: "lado",
          x0: BANCO.x0,
          x1: BANCO.x1,
          y: BANCO.y,
          piso: BANCO.piso
        }), /*#__PURE__*/React.createElement(B.PisoG, {
          y: 1300,
          x0: 200,
          x1: 1400
        }));
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }

  /* ---------------- de frente (para los codos), solo el torso ---------------- */

  // abre 0 codos atras, pegados al cuerpo -> 1 codos abiertos a los costados
  function enBancoFrente(baja, abre) {
    var p = B.poseFrente.depie({});
    var bajar = 120 * baja;
    p.centro = U.suma(p.centro, [0, bajar]);
    p.cuello = U.suma(p.cuello, [0, bajar]);
    var g = B.geoFrente({
      pose: p
    });
    var manoY = 960;
    ['izq', 'der'].forEach(function (k, i) {
      var l = i ? 1 : -1,
        q = p[k],
        S = g[k].hombro;
      var H = [600 + l * 196, manoY];
      // el codo va atras (casi tapado) o se abre al costado; al bajar se dobla mas
      var afuera = 8 + (40 + 150 * baja) * abre + 26 * baja * (1 - abre);
      var E = [S[0] + l * afuera, S[1] + 150 + 30 * (1 - baja)];
      q.codo = E;
      q.mano = H;
      q.kCodo = 1 - 0.12 * (1 - abre) * baja;
    });
    return p;
  }
  function BancoFrente() {
    var ln = {
      stroke: C.INK,
      strokeWidth: 15,
      strokeLinejoin: 'round',
      strokeLinecap: 'round'
    };
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 330 1040 L 330 1300 M 870 1040 L 870 1300",
      fill: "none"
    }, ln, {
      strokeWidth: 30
    })), /*#__PURE__*/React.createElement("path", {
      d: "M 330 1040 L 330 1300 M 870 1040 L 870 1300",
      fill: "none",
      stroke: BLANCO,
      strokeWidth: 8
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 250,
      y: 976,
      width: 700,
      height: 66,
      rx: 18,
      fill: BLANCO
    }, ln)), /*#__PURE__*/React.createElement("path", {
      d: "M 280 1010 L 920 1010",
      stroke: C.GRY,
      strokeWidth: 10,
      strokeLinecap: "round"
    }));
  }
  function Frente(props) {
    var pose = enBancoFrente(props.baja, props.abre);
    return /*#__PURE__*/React.createElement(B.Frente, {
      s: props.s,
      pose: pose,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      sinPiso: true,
      fondo: function () {
        return /*#__PURE__*/React.createElement(BancoFrente, null);
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }

  /* ---------------- encuadre y ritmo ---------------- */

  var FIG = {
    x: -138,
    y: 240,
    s: 0.86
  };
  function enLienzo(p, base) {
    base = base || FIG;
    return [base.x + p[0] * base.s, base.y + p[1] * base.s];
  }

  // repeticion: baja en el 60 % del ciclo (lento) y sube en el 40 %
  function rep(T, a, b, n, rapido) {
    if (T <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a)) * n;
    if (u >= n) return 0;
    var k = u - Math.floor(u);
    var corte = rapido ? 0.5 : 0.6;
    return k < corte ? Easing.easeInOutSine(k / corte) : 1 - Easing.easeInOutSine((k - corte) / (1 - corte));
  }

  // angulo del codo como arco entre el brazo y el antebrazo
  function arcoCodo(g, color) {
    var aB = Math.atan2(g.hombro[1] - g.codo[1], g.hombro[0] - g.codo[0]) * 180 / Math.PI;
    var aA = Math.atan2(g.mano[1] - g.codo[1], g.mano[0] - g.codo[0]) * 180 / Math.PI;
    while (aA < aB) aA += 360;
    if (aA - aB > 180) aA -= 360;
    return Math.abs(aA - aB) > 10 ? /*#__PURE__*/React.createElement(B.Arco, {
      c: g.codo,
      r: 96,
      a0: aB,
      a1: aA,
      color: color,
      sw: 14,
      cabeza: 1
    }) : null;
  }

  // angulo del hombro: del tronco al brazo (lo que se hiperextiende)
  function arcoHombro(g, color) {
    var aT = Math.atan2(g.cadera[1] - g.hombro[1], g.cadera[0] - g.hombro[0]) * 180 / Math.PI;
    var aB = Math.atan2(g.codo[1] - g.hombro[1], g.codo[0] - g.hombro[0]) * 180 / Math.PI;
    return /*#__PURE__*/React.createElement(B.Arco, {
      c: g.hombro,
      r: 120,
      a0: aT,
      a1: aB,
      color: color,
      sw: 16,
      cabeza: 30
    });
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: baja de mas y rapido; salen las X */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var baja = 1.55 * rep(T, f(0), f(1), 2, true);
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
      dx: M.vibra(T, 30, 3),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      baja: baja,
      muscRojo: {
        delto: clamp(baja - 0.4, 0, 1)
      }
    }))), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.2),
      x: 150,
      y: 640,
      s: 0.6
    }), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.42),
      x: 840,
      y: 560,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "FONDOS EN BANCO",
      s: 1.15,
      y: 250,
      e: rot
    }));
  }

  /* 2 — posicion: manos en el banco detras, piernas estiradas, caderas arriba */
  function EscPosicion(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var aro = animate({
      from: 0,
      to: 1,
      start: f(0.08),
      end: f(0.2)
    })(T);
    var pierna = M.draw(T, f(0.44), dur * 0.16);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.46), 0.4);
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
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      baja: 0,
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
          c: g.mano,
          r: 56,
          color: C.YEL,
          p: aro
        }), /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [U.suma(g.cadera, [0, -10]), g.rodilla, g.tobillo],
          color: C.GRN,
          sw: 16,
          p: pierna
        }), pierna > 0.6 ? /*#__PURE__*/React.createElement(B.FlechaS, {
          a: [g.cadera[0] - 10, g.cadera[1] + 250],
          b: [g.cadera[0] - 10, g.cadera[1] + 110],
          color: C.YEL,
          sw: 16,
          p: (pierna - 0.6) / 0.4
        }) : null);
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.28),
      x: 150,
      y: 640
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "MANOS EN EL BANCO",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CADERAS ARRIBA",
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }

  /* 3 — bajada: codos a 90 grados y empujar */
  function EscBajada(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var baja = rep(T, f(0.02), f(0.98), 2);
    var fondo = baja > 0.93;
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
      foco: enLienzo([880, 760])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      baja: baja,
      musc: {
        tri: 0.3 + 0.7 * baja
      },
      extra: function (g) {
        return baja > 0.2 ? /*#__PURE__*/React.createElement("g", null, arcoCodo(g, fondo ? C.GRN : C.YEL), /*#__PURE__*/React.createElement(B.Anillo, {
          c: g.codo,
          r: 44,
          color: fondo ? C.GRN : C.YEL
        })) : null;
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS A 90\xB0",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "EMPUJA ARRIBA",
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }

  /* 4 — musculos: triceps; pectoral, deltoides anterior y serrato */
  function EscMusculos(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var tri = animate({
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
    var baja = 0.6 + M.life(T, 2.4, 0.35);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.52), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.45 + 0.05 * t,
      foco: enLienzo([900, 760]),
      mira: [540, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      baja: baja,
      musc: {
        tri: tri
      },
      muscGris: {
        pec: sec,
        delt: sec
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "TR\xCDCEPS",
      s: 1.2,
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "+ PECHO Y DELTOIDES",
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }

  // comparacion de frente arriba (mal) / abajo (bien): de la cabeza a la cadera
  var CMPF = {
    s: 0.62,
    desdeY: 300,
    w: 1080,
    h: 560,
    yArriba: 310,
    yAbajo: 930
  };
  function MitadF(props) {
    var s = CMPF.s;
    return /*#__PURE__*/React.createElement(Pos, {
      x: 0,
      y: 0,
      e: props.e,
      dx: props.dx,
      dy: props.dy,
      origen: '540px ' + (props.y + CMPF.h / 2) + 'px'
    }, /*#__PURE__*/React.createElement(Recorte, {
      x: 0,
      y: props.y,
      w: CMPF.w,
      h: CMPF.h,
      desde: CMPF.desdeY * s
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 540 - 600 * s,
        top: 0
      }
    }, props.children)));
  }

  /* 5 — error 1: codos demasiado abiertos */
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var baja = rep(T, f(0), f(1), 2);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4),
      r2 = M.pop(T, f(0.36), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(MitadF, {
      y: CMPF.yArriba,
      e: arriba,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Frente, {
      s: CMPF.s,
      baja: baja,
      abre: 1,
      muscRojo: {
        delt: 0.4 + 0.6 * baja
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, ['izq', 'der'].map(function (k) {
          return /*#__PURE__*/React.createElement(B.Anillo, {
            key: k,
            c: g[k].codo,
            r: 50,
            color: C.RED
          });
        }));
      }
    })), /*#__PURE__*/React.createElement(MitadF, {
      y: CMPF.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Frente, {
      s: CMPF.s,
      baja: baja,
      abre: 0,
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, ['izq', 'der'].map(function (k) {
          var q = g[k];
          return /*#__PURE__*/React.createElement(B.FlechaS, {
            key: k,
            a: [q.codo[0] + q.lado * 120, q.codo[1]],
            b: [q.codo[0] + q.lado * 40, q.codo[1]],
            color: C.GRN,
            sw: 16
          });
        }));
      }
    })), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.14),
      x: 880,
      y: CMPF.yArriba + 40,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.56),
      x: 880,
      y: CMPF.yAbajo + 40
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS ABIERTOS",
      y: 230,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS CERCA",
      y: 1530,
      s: 1,
      e: r2,
      fase: 0.4
    }));
  }

  // comparacion de perfil: el torso, los brazos y el banco
  var CMP = {
    s: 0.6,
    desdeY: 290,
    w: 1080,
    h: 560,
    yArriba: 310,
    yAbajo: 930,
    centroX: 880
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

  /* 6 — error 2: hiperextension de hombros (bajar de mas) */
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var ciclo = rep(T, f(0), f(1), 2);
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
      dx: ciclo > 0.8 ? M.vibra(T, 30, 2) : 0,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: CMP.s,
      baja: 1.7 * ciclo,
      muscRojo: {
        delto: ciclo
      },
      extra: function (g) {
        return ciclo > 0.3 ? arcoHombro(g, C.RED) : null;
      }
    })), /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: CMP.s,
      baja: ciclo,
      musc: {
        tri: ciclo
      },
      extra: function (g) {
        return ciclo > 0.3 ? arcoCodo(g, C.GRN) : null;
      }
    })), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.14),
      x: 880,
      y: CMP.yArriba + 40,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.56),
      x: 880,
      y: CMP.yAbajo + 40
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "DEMASIADO ABAJO",
      y: 230,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "HASTA 90\xB0",
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
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      baja: baja,
      musc: {
        tri: 1
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.3),
      x: 150,
      y: 640,
      s: 0.85
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "FONDOS EN BANCO",
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
    vo: 'Estás haciendo mal tus fondos en banco.'
  }, {
    nombre: 'Posición',
    dur: 5,
    C: EscPosicion,
    vo: 'Manos en el banco detrás de ti, piernas estiradas y las caderas elevadas.'
  }, {
    nombre: 'Bajada',
    dur: 5,
    C: EscBajada,
    vo: 'Baja lento doblando los codos hasta unos noventa grados y empuja para subir.'
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    C: EscMusculos,
    vo: 'Trabaja el tríceps; ayudan el pectoral, el deltoides anterior y el serrato.'
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    C: EscError1,
    vo: 'Error uno: abrir los codos. Mantenlos cerca del cuerpo para cuidar el hombro.'
  }, {
    nombre: 'Error 2',
    dur: 4,
    C: EscError2,
    vo: 'Error dos: bajar de más. Pasar de noventa grados estresa el hombro.'
  }, {
    nombre: 'Cierre',
    dur: 2.5,
    C: EscCierre,
    vo: 'Así se hace. Técnica antes que peso.'
  }];
  global.REELS.registrar({
    id: 'fondos-banco',
    titulo: 'Fondos en banco',
    escenas: ESCENAS
  });
})(window);
