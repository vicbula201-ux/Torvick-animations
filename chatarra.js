/* GENERADO por compilar.js desde chatarra.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   COMIDA CHATARRA — reel con Tor, ESTILO 2 (~37 s con la accion y el cierre)
   "No comas comida chatarra" (pedido del autor; se comparte con "el que dice
   que esta a dieta"). El mensaje no es prohibirla: es moderacion + moverse.
   - gancho: son las 2 de la manana y la camara esta DENTRO de la nevera: Tor
     con los cachetes llenos, migas por todos lados y la cara iluminada;
   - los ultraprocesados hacen comer mas sin llenarte: en el estudio de Hall
     (2019) la gente comio unas 500 kcal mas por dia con esa dieta;
   - de madrugada no es hambre, es sueno: dormir poco aumenta el apetito y
     los antojos (Spiegel 2004, Greer 2013);
   - la regla practica 80/20: casi todo comida real y un gusto de vez en
     cuando (la restriccion flexible funciona mejor que la rigida);
   - moverse ayuda pero no "borra" todo: una hamburguesa con papas (~900 kcal)
     es mas de una hora corriendo;
   - cierre: cierra la nevera y se va a dormir.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    N = global.N,
    PL = global.PL,
    V = global.V,
    TOR = global.TOR,
    MU = global.MU;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var A = global.REELS.ayudas;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };
  var G0 = B.geoFrente({
    pose: TOR.pose({
      flex: 0
    })
  });
  var L1 = 198,
    L2 = 193;
  function pulso(T, cuando, d) {
    var u = (T - cuando) / d;
    return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
  }
  function azar(i, k) {
    var v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v);
  }
  function icono(Cmp, c, k, ang, props) {
    return /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + (ang || 0).toFixed(1) + ') scale(' + k + ') translate(-120 -120)'
    }, /*#__PURE__*/React.createElement(Cmp, _extends({
      s: 1
    }, props || {})));
  }
  // migas: pegadas alrededor de la boca y cayendo
  function migas(g, T, v) {
    var ms = [];
    for (var i = 0; i < 9; i++) {
      var x = g.cabeza[0] + (azar(i, 1) - 0.5) * 110,
        y = g.cabeza[1] + 44 + azar(i, 2) * 44;
      ms.push(/*#__PURE__*/React.createElement("rect", {
        key: 'p' + i,
        x: x - 5,
        y: y - 5,
        width: 10,
        height: 10,
        rx: 3,
        fill: i % 2 ? C.YEL : C.GRY,
        stroke: C.INK,
        strokeWidth: 4,
        transform: 'rotate(' + i * 37 + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'
      }));
    }
    for (var j = 0; j < 8; j++) {
      var u = (T * 0.8 + j / 8) % 1;
      var cx = g.cabeza[0] + (azar(j, 3) - 0.5) * 220 + 20 * Math.sin(u * 6 + j),
        cy = g.cabeza[1] + 80 + 520 * u * u;
      ms.push(/*#__PURE__*/React.createElement("rect", {
        key: 'c' + j,
        x: cx - 6,
        y: cy - 6,
        width: 12,
        height: 12,
        rx: 3,
        fill: j % 2 ? C.YEL : C.GRY,
        stroke: C.INK,
        strokeWidth: 4,
        opacity: (v * (1 - u)).toFixed(2),
        transform: 'rotate(' + (T * 200 + j * 50).toFixed(0) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')'
      }));
    }
    return /*#__PURE__*/React.createElement("g", null, ms);
  }

  /* ---------------- gancho: la camara dentro de la nevera ---------------- */

  var TN = {
    x: 24,
    y: 300,
    s: 0.86
  };
  function poseAtracon(T) {
    var p = TOR.pose({
      flex: 0
    });
    var a = Math.pow(Math.max(0, Math.sin(T * 3.1)), 2),
      b = Math.pow(Math.max(0, Math.sin(T * 3.1 + Math.PI)), 2);
    p.izq.mano = U.lerpP([400, 830], [520, 560], a);
    p.der.mano = U.lerpP([800, 830], [680, 560], b);
    p.izq.codo = B.ik(G0.izq.hombro, p.izq.mano, L1, L2, -1);
    p.der.codo = B.ik(G0.der.hombro, p.der.mano, L1, L2, 1);
    return p;
  }
  function estante(y) {
    return /*#__PURE__*/React.createElement("rect", _extends({
      x: 56,
      y: y,
      width: 968,
      height: 30,
      rx: 10,
      fill: BLANCO
    }, LN, {
      strokeWidth: 12
    }));
  }
  // el marco de la nevera y lo que hay en los estantes: va por delante de todo y fuera
  // de la camara (queda quieto mientras la camara se acerca a Tor: da profundidad)
  function interiorNevera(T) {
    var mece = function (i) {
      return 2.5 * Math.sin(T * 2 + i * 1.7);
    };
    return /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: -60,
      y: 384,
      width: 116,
      height: 1270,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 1024,
      y: 384,
      width: 116,
      height: 1270,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: -60,
      y: 372,
      width: 1200,
      height: 46,
      rx: 12,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("ellipse", _extends({
      cx: 540,
      cy: 430,
      rx: 74,
      ry: 18,
      fill: C.YEL
    }, LN, {
      strokeWidth: 11
    })), icono(N.COMIDA.gaseosa, [170, 1098], 0.78, mece(0)), icono(N.COMIDA.leche, [900, 1092], 0.8, mece(1)), icono(N.COMIDA.huevo, [740, 1128], 0.5, mece(2)), estante(1190), icono(N.COMIDA.pizza, [170, 1326], 0.7, -8 + mece(3)), icono(N.ICONOS.lata, [360, 1322], 0.68, mece(4)), icono(N.COMIDA.dona, [550, 1332], 0.62, mece(5)), icono(N.COMIDA.fritas, [730, 1324], 0.68, mece(6)), icono(N.COMIDA.hamburguesa, [910, 1332], 0.66, mece(7)), estante(1408));
  }

  /* ---------------- "muevete, pero ojo": corriendo de perfil ---------------- */

  var PISO_P = 1300;
  var BASEP = B.posePerfil.depie({
    x: 700,
    piso: PISO_P
  });
  function poseCorre(T) {
    var w = T * 11;
    var p = Object.assign({}, BASEP);
    var cad = [700, BASEP.cadera[1] - 26 + 14 * Math.abs(Math.sin(w))];
    p.cadera = cad;
    p.cuello = U.suma(cad, U.polar(-102, 404));
    p.cabeza = -8;
    var pie = function (fase) {
      var s = Math.sin(w + fase),
        c = Math.cos(w + fase);
      return [cad[0] + 10 + 210 * s, PISO_P - 40 - 170 * Math.max(0, c)];
    };
    p.tobillo = pie(0);
    p.punta = U.suma(p.tobillo, [-108, 40]);
    p.tobillo2 = pie(Math.PI);
    p.punta2 = U.suma(p.tobillo2, [-108, 40]);
    p.rodilla = B.ik(cad, p.tobillo, 272, 268, -1);
    p.rodilla2 = B.ik(cad, p.tobillo2, 272, 268, -1);
    var g = B.geoPerfil({
      pose: Object.assign({}, p, {
        codo: cad,
        mano: cad
      })
    });
    var a = 90 - 44 * Math.sin(w),
      a2 = 90 + 44 * Math.sin(w);
    p.codo = U.suma(g.hombro, U.polar(a, 232));
    p.mano = U.suma(p.codo, U.polar(a + 84, 214));
    p.codo2 = U.suma(g.hombro, U.polar(a2, 232));
    p.mano2 = U.suma(p.codo2, U.polar(a2 + 84, 214));
    return p;
  }
  var FR = {
    x: 90,
    y: 620,
    s: 0.64
  };
  function EscCorre(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var minutos = Math.round(animate({
      from: 1,
      to: 75,
      start: f(0.3),
      end: f(0.86)
    })(T));
    var piso = FR.y + PISO_P * FR.s;
    var mas = M.pop(T, f(0.1), 0.4),
      igual = M.pop(T, f(0.26), 0.4);
    var rayas = [];
    for (var i = 0; i < 6; i++) {
      var x = (i * 220 + T * 620) % 1320 - 120;
      rayas.push(/*#__PURE__*/React.createElement("path", {
        key: i,
        d: 'M ' + x.toFixed(1) + ' ' + (piso + 26) + ' l 90 0',
        stroke: C.GRY,
        strokeWidth: 12,
        strokeLinecap: "round"
      }));
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(V.Camara, {
      T: T,
      at: at,
      dur: dur,
      tomas: [[0, {
        zoom: 1.06,
        foco: [540, 760]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      pulsos: [0.86]
    }, /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M 20 ' + (piso + 4) + ' L 1060 ' + (piso + 4),
      stroke: C.GRY,
      strokeWidth: 12,
      strokeLinecap: "round"
    }), rayas, /*#__PURE__*/React.createElement(V.Sombra, {
      c: [FR.x + 700 * FR.s, piso + 4],
      rx: 200
    }), /*#__PURE__*/React.createElement("g", {
      opacity: mas.opacity,
      transform: 'translate(376 500) scale(' + mas.scale.toFixed(3) + ')'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M -34 0 L 34 0 M 0 -34 L 0 34",
      stroke: C.INK,
      strokeWidth: 18,
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("g", {
      opacity: igual.opacity,
      transform: 'translate(700 500) scale(' + igual.scale.toFixed(3) + ')'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M -34 -18 L 34 -18 M -34 18 L 34 18",
      stroke: C.INK,
      strokeWidth: 18,
      strokeLinecap: "round"
    }))), /*#__PURE__*/React.createElement(A.Pos, {
      x: 96,
      y: 380,
      e: M.pop(T, at - 0.6, 0.5),
      dy: M.life(T, 3, 6)
    }, /*#__PURE__*/React.createElement(N.COMIDA.hamburguesa, {
      s: 1.0
    })), /*#__PURE__*/React.createElement(A.Pos, {
      x: 420,
      y: 388,
      e: M.pop(T, f(0.14), 0.42),
      dy: M.life(T, 3, 6, 0.4)
    }, /*#__PURE__*/React.createElement(N.COMIDA.fritas, {
      s: 0.95
    })), /*#__PURE__*/React.createElement(A.Pos, {
      x: 776,
      y: 392,
      e: M.pop(T, f(0.3), 0.42),
      dy: M.life(T, 3, 6, 0.8)
    }, /*#__PURE__*/React.createElement(B.Cuenta, {
      s: 1.05,
      n: minutos,
      p: minutos / 75
    })), /*#__PURE__*/React.createElement(A.Pos, {
      x: FR.x,
      y: FR.y,
      e: M.pop(T, f(0.2), 0.45)
    }, /*#__PURE__*/React.createElement(B.Perfil, {
      s: FR.s,
      pose: poseCorre(T),
      parpadeo: V.parpadeo(T),
      musc: {
        cuad: 1,
        gem: 0.8
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: g.centroCabeza,
          v: 1
        }), /*#__PURE__*/React.createElement(V.Lineas, {
          c: [g.cadera[0] + 150, g.cadera[1] - 200],
          dir: [-1, 0],
          v: 1,
          largo: 170
        }));
      }
    }))), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "MU\xC9VETE, PERO OJO",
      y: 280,
      s: 1.15,
      cuando: at - 0.6
    }), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "M\xC1S DE 1 HORA CORRIENDO",
      y: 1490,
      s: 1.0,
      cuando: f(0.56),
      fase: 0.4
    }));
  }

  /* ---------------- cierre: cierra la nevera y a dormir ---------------- */

  function nevera(x, y, abre) {
    var W = 380,
      H = 900,
      a = clamp(abre, 0, 1);
    return /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + x + ' ' + y + ')'
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M 40 ' + H + ' L 40 ' + (H + 26) + ' M ' + (W - 40) + ' ' + H + ' L ' + (W - 40) + ' ' + (H + 26),
      stroke: C.INK,
      strokeWidth: 24,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 0,
      y: 0,
      width: W,
      height: H,
      rx: 34,
      fill: BLANCO
    }, LN)), a > 0.04 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: 24,
      y: 24,
      width: W - 48,
      height: H - 48,
      rx: 18,
      fill: C.YEL,
      opacity: 0.3
    }), icono(N.COMIDA.dona, [116, 170], 0.5), icono(N.COMIDA.gaseosa, [262, 160], 0.56), icono(N.COMIDA.pizza, [116, 400], 0.56), icono(N.ICONOS.lata, [262, 394], 0.52), icono(N.COMIDA.hamburguesa, [130, 628], 0.56), icono(N.COMIDA.fritas, [262, 624], 0.54), /*#__PURE__*/React.createElement("path", {
      d: 'M 24 246 L ' + (W - 24) + ' 246 M 24 476 L ' + (W - 24) + ' 476 M 24 704 L ' + (W - 24) + ' 704',
      stroke: C.INK,
      strokeWidth: 11,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: 24,
      y: 24,
      width: W - 48,
      height: H - 48,
      rx: 18,
      fill: "none",
      stroke: C.INK,
      strokeWidth: 9
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M 0 20 L ' + (-170 * a).toFixed(1) + ' ' + (20 + 60 * a).toFixed(1) + ' L ' + (-170 * a).toFixed(1) + ' ' + (H - 20 + 60 * a).toFixed(1) + ' L 0 ' + (H - 20) + ' Z',
      fill: C.GRY
    }, LN))) : /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: 'M 0 290 L ' + W + ' 290',
      stroke: C.INK,
      strokeWidth: 12
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 46 110 L 46 230 M 46 360 L 46 560",
      stroke: C.INK,
      strokeWidth: 20,
      strokeLinecap: "round"
    })));
  }
  var PC = {
    x: -10,
    y: 500,
    s: 0.64
  };
  function EscDormir(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var empuja = animate({
      from: 0,
      to: 1,
      start: f(0.18),
      end: f(0.32),
      ease: Easing.easeInCubic
    })(T) * (1 - animate({
      from: 0,
      to: 1,
      start: f(0.36),
      end: f(0.46)
    })(T));
    var abre = 1 - animate({
      from: 0,
      to: 1,
      start: f(0.24),
      end: f(0.34),
      ease: Easing.easeInCubic
    })(T);
    var bosteza = pulso(T, f(0.44), 0.22 * dur);
    var sale = Easing.easeInCubic(clamp((T - f(0.7)) / (f(0.92) - f(0.7)), 0, 1));
    A.sonido('golpe', f(0.34));
    A.sonido('whoosh', f(0.7));
    var pose = TOR.pose({
      flex: 0
    });
    var m = U.lerpP(pose.der.mano, [1000, 760], empuja);
    pose.der.mano = m;
    pose.der.codo = B.ik(G0.der.hombro, m, L1, L2, -1);
    if (bosteza > 0.05) {
      // se tapa el bostezo con la mano izquierda
      pose.izq.mano = U.lerpP(pose.izq.mano, [560, 500], bosteza);
      pose.izq.codo = B.ik(G0.izq.hombro, pose.izq.mano, L1, L2, -1);
    }
    var paso = sale > 0 ? 16 * Math.abs(Math.sin(T * 14)) : 0;
    var zetas = [];
    for (var i = 0; i < 3; i++) {
      var u = (T * 0.6 + i / 3) % 1;
      var zx = PC.x + 600 * PC.s + 90 + 90 * u - 1000 * sale,
        zy = PC.y + 330 * PC.s - 170 * u,
        k = 0.7 + 0.9 * u;
      zetas.push(/*#__PURE__*/React.createElement("path", {
        key: i,
        d: 'M ' + zx.toFixed(1) + ' ' + zy.toFixed(1) + ' l ' + (34 * k).toFixed(1) + ' 0 l ' + (-34 * k).toFixed(1) + ' ' + (34 * k).toFixed(1) + ' l ' + (34 * k).toFixed(1) + ' 0',
        fill: "none",
        stroke: C.INK,
        strokeWidth: 10,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        opacity: (1 - u) * (T > f(0.44) ? 1 : 0)
      }));
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(V.Camara, {
      T: T,
      at: at,
      dur: dur,
      tomas: [[0, {
        zoom: 1.06,
        foco: [600, 900]
      }], [0.4, {
        zoom: 1.0,
        foco: [560, 920]
      }], [1, {
        zoom: 1.04,
        foco: [540, 900]
      }]],
      golpes: [0.34]
    }, /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 20 1464 L 1060 1464",
      stroke: C.GRY,
      strokeWidth: 12,
      strokeLinecap: "round"
    }), nevera(650, 540, abre), /*#__PURE__*/React.createElement("g", {
      transform: "translate(60 380)"
    }, /*#__PURE__*/React.createElement(MU.Despertador, {
      s: 0.8,
      T: T,
      hora: 2
    })), /*#__PURE__*/React.createElement(V.Sombra, {
      c: [PC.x + 600 * PC.s - 1000 * sale, 1462],
      rx: 220
    })), sale < 1 ? /*#__PURE__*/React.createElement(A.Pos, {
      x: PC.x - 1000 * sale,
      y: PC.y - paso,
      e: M.pop(T, at - 0.6, 0.5),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(TOR.Tor, {
      s: PC.s,
      pose: pose,
      sinPiso: true,
      parpadeo: bosteza > 0.05 ? 1 : V.parpadeo(T),
      ojos: bosteza > 0.05 ? undefined : T < f(0.34) ? 'grandes' : 'rojos',
      boca: bosteza > 0.05 ? 'abierta' : T < f(0.34) ? 'ondulada' : true,
      gesto: {
        boca: 0.6 + 1.0 * bosteza,
        mirada: [10, 2],
        cejas: T < f(0.2) ? 'triste' : null
      }
    })) : null, /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement(V.Chispa, {
      T: T,
      c: [660, 980],
      cuando: f(0.34),
      r: 150
    }), zetas)), /*#__PURE__*/React.createElement(A.Bien, {
      T: T,
      cuando: f(0.8),
      x: 430,
      y: 760,
      s: 0.9
    }), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "\xBFANTOJO A LAS 2 AM?",
      y: 280,
      s: 1.1,
      cuando: at - 0.6
    }), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "\xA1A DORMIR!",
      y: 1490,
      s: 1.3,
      cuando: f(0.5),
      fase: 0.4
    }));
  }

  /* ---------------- escenas ---------------- */

  // comida que vuela a la boca, en bucle (coordenadas de Tor)
  var DESFILE = [N.COMIDA.pizza, N.COMIDA.dona, N.COMIDA.fritas, N.COMIDA.hamburguesa, N.COMIDA.gaseosa];
  function desfile(g, T, v) {
    var boca = [g.cabeza[0], g.cabeza[1] + 60],
      out = [];
    for (var i = 0; i < 5; i++) {
      var u = (T * 0.55 + i / 5) % 1;
      var x = U.lerp(1560, boca[0], Easing.easeInQuad(u)),
        y = U.lerp(360 + 90 * i, boca[1], u) - 260 * Math.sin(Math.PI * u);
      out.push(/*#__PURE__*/React.createElement("g", {
        key: i,
        opacity: v * Math.min(1, (1 - u) * 5)
      }, icono(DESFILE[i], [x, y], 1.0 - 0.6 * u, 300 * u)));
    }
    return /*#__PURE__*/React.createElement("g", null, out);
  }
  // antojos que dan vueltas sobre la cabeza
  function antojos(g, T, v) {
    var c = [g.cabeza[0], g.cabeza[1] - 230],
      out = [];
    [N.COMIDA.pizza, N.COMIDA.dona, N.COMIDA.hamburguesa].forEach(function (Cmp, i) {
      var a = T * 2.2 + i * 2 * Math.PI / 3;
      var atras = Math.sin(a) < 0;
      out.push(/*#__PURE__*/React.createElement("g", {
        key: i,
        opacity: v * (atras ? 0.55 : 1)
      }, icono(Cmp, [c[0] + 250 * Math.cos(a), c[1] + 70 * Math.sin(a)], atras ? 0.62 : 0.8, 0)));
    });
    return /*#__PURE__*/React.createElement("g", null, out);
  }
  // la barra 80/20
  function barra8020(T, f) {
    var e = M.pop(T, f(0) - 0.6, 0.5);
    var a = animate({
      from: 0,
      to: 1,
      start: f(0.08),
      end: f(0.36),
      ease: Easing.easeOutCubic
    })(T);
    var b = animate({
      from: 0,
      to: 1,
      start: f(0.44),
      end: f(0.58),
      ease: Easing.easeOutCubic
    })(T);
    return /*#__PURE__*/React.createElement("g", {
      opacity: e.opacity,
      transform: 'translate(0 ' + M.life(T, 3.2, 4).toFixed(1) + ')'
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: 90,
      y: 640,
      width: 900,
      height: 90,
      rx: 30,
      fill: BLANCO
    }, LN)), a > 0.01 ? /*#__PURE__*/React.createElement("rect", {
      x: 98,
      y: 648,
      width: (712 * a).toFixed(1),
      height: 74,
      rx: 22,
      fill: C.GRN
    }) : null, b > 0.01 ? /*#__PURE__*/React.createElement("rect", {
      x: 818,
      y: 648,
      width: (164 * b).toFixed(1),
      height: 74,
      rx: 22,
      fill: C.YEL
    }) : null, /*#__PURE__*/React.createElement("path", {
      d: "M 814 640 L 814 730",
      stroke: C.INK,
      strokeWidth: 10
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 90,
      y: 640,
      width: 900,
      height: 90,
      rx: 30,
      fill: "none"
    }, LN)));
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 3,
    vo: 'No comas comida chatarra.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.5,
        foco: [540, 670]
      }], [1, {
        zoom: 1.0,
        foco: [540, 940]
      }]],
      detras: function (T) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
          transform: "translate(76 450)"
        }, /*#__PURE__*/React.createElement(MU.Despertador, {
          s: 0.9,
          T: T,
          hora: 2
        })), /*#__PURE__*/React.createElement("g", {
          transform: "translate(790 460)"
        }, /*#__PURE__*/React.createElement(MU.Ventana, {
          s: 0.85,
          T: T
        })));
      },
      tor: {
        x: TN.x,
        y: TN.y,
        s: TN.s,
        ojos: 'grandes',
        boca: 'llena',
        pose: function (T) {
          return poseAtracon(T);
        },
        gesto: function (T, f) {
          var pillado = T > f(0.55);
          return {
            cejas: 'alzadas',
            pupila: pillado ? 4 : 6,
            mirada: pillado ? [0, 0] : [11 * Math.sin(T * 4), 2],
            giro: 3 * Math.sin(T * 12),
            cara: {
              color: C.YEL,
              v: 0.34 + 0.06 * Math.sin(T * 7)
            }
          };
        },
        agarre: function (g) {
          return /*#__PURE__*/React.createElement("g", null, icono(N.COMIDA.hamburguesa, [g.izq.mano[0] - 10, g.izq.mano[1] - 56], 0.9, -12), icono(N.COMIDA.pizza, [g.der.mano[0] + 14, g.der.mano[1] - 50], 0.9, 160));
        },
        extra: function (g, T, f) {
          A.sonido('crunch', f(0.2));
          A.sonido('crunch', f(0.62));
          return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
            T: T,
            c: g.cabeza,
            r: 150,
            v: 0.7
          }), migas(g, T, 1));
        }
      },
      encima: function (T) {
        return interiorNevera(T);
      },
      mal: [{
        x: 110,
        y: 720,
        cuando: 0.24,
        s: 0.6
      }, {
        x: 830,
        y: 730,
        cuando: 0.46,
        s: 0.5
      }],
      r1: {
        text: 'COMIDA CHATARRA',
        s: 1.15,
        cuando: 0.02
      },
      r2: {
        text: 'SON LAS 2 AM',
        s: 1.2,
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Comes de más',
    dur: 5.6,
    vo: 'Muchas calorías y poca saciedad: los ultraprocesados te hacen comer unas 500 calorías de más al día.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.1,
        foco: [560, 760]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      tor: {
        s: 0.58,
        x: 150,
        y: 560,
        ojos: 'grandes',
        boca: function (T) {
          return Math.sin(T * 13) > 0 ? 'abierta' : 'llena';
        },
        gesto: {
          mirada: [10, -2],
          pupila: 6
        },
        panza: function (T, f) {
          return animate({
            from: 0,
            to: 1,
            start: f(0.1),
            end: f(0.85)
          })(T);
        },
        extra: function (g, T, f) {
          A.sonido('crunch', f(0.16));
          A.sonido('crunch', f(0.5));
          return /*#__PURE__*/React.createElement("g", null, desfile(g, T, 1), migas(g, T, 1));
        }
      },
      piezas: [{
        C: P.Medidor,
        s: 0.9,
        x: 50,
        y: 410,
        vibra: true,
        p: function (T) {
          return {
            p: 0.2 + 0.05 * Math.sin(T * 5)
          };
        }
      }, {
        C: N.ICONOS.fuego,
        s: 0.8,
        x: 60,
        y: 1120,
        cuando: 0.4,
        fase: 0.3
      }],
      mal: [{
        x: 110,
        y: 660,
        cuando: 0.3,
        s: 0.55
      }],
      r1: {
        text: 'COMES SIN LLENARTE',
        s: 1.1,
        cuando: 0.04
      },
      r2: {
        text: '+500 CALORÍAS AL DÍA',
        s: 1.1,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Es sueño',
    dur: 5.6,
    vo: 'Y a las 2 de la mañana no es hambre: es sueño. Dormir poco dispara los antojos.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.12,
        foco: [540, 720]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      tor: {
        s: 0.6,
        x: 180,
        y: 620,
        ojos: 'rojos',
        boca: 'abierta',
        gesto: function (T, f) {
          return {
            boca: 0.5 + 1.1 * Math.max(pulso(T, f(0.1), 1.4), pulso(T, f(0.62), 1.4))
          };
        },
        extra: function (g, T, f) {
          return antojos(g, T, animate({
            from: 0,
            to: 1,
            start: f(0.36),
            end: f(0.5)
          })(T));
        }
      },
      piezas: [{
        C: MU.Despertador,
        s: 0.85,
        x: 40,
        y: 1080,
        p: function (T) {
          return {
            T: T,
            hora: 2
          };
        }
      }, {
        C: N.ICONOS.bateria,
        s: 0.95,
        x: 830,
        y: 1080,
        cuando: 0.2,
        p: {
          p: 0.1
        }
      }, {
        C: N.ICONOS.luna,
        s: 0.7,
        x: 60,
        y: 400,
        cuando: 0.1
      }],
      r1: {
        text: 'NO ES HAMBRE: ES SUEÑO',
        s: 1.0,
        cuando: 0.04
      },
      r2: {
        text: 'DORMIR POCO = MÁS ANTOJOS',
        s: 0.95,
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Regla 80/20',
    dur: 5.6,
    vo: '¿Prohibirla? No. La regla es 80/20: casi todo comida real, y un gusto de vez en cuando.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.05,
        foco: [540, 760]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      pulsos: [0.58],
      tor: {
        s: 0.44,
        x: 276,
        y: 870,
        cuando: 0.5,
        boca: 'sonrisa',
        musc: {
          bic: 1
        },
        pose: function (T, f) {
          var k = animate({
            from: 0,
            to: 1,
            start: f(0.56),
            end: f(0.7),
            ease: Easing.easeOutBack
          })(T);
          var p = TOR.pose({
            flex: k
          });
          p.der.codo = [830, 800];
          p.der.mano = [900, 640];
          return p;
        },
        agarre: function (g) {
          return icono(N.COMIDA.pizza, [g.der.mano[0] + 20, g.der.mano[1] - 70], 1.0, 160);
        }
      },
      piezas: [{
        C: N.COMIDA.pollo,
        s: 0.85,
        x: 100,
        y: 410
      }, {
        C: N.COMIDA.arroz,
        s: 0.85,
        x: 330,
        y: 410,
        cuando: 0.12
      }, {
        C: N.COMIDA.brocoli,
        s: 0.85,
        x: 560,
        y: 410,
        cuando: 0.2
      }, {
        C: N.COMIDA.pizza,
        s: 0.7,
        x: 818,
        y: 430,
        cuando: 0.46
      }, {
        C: B.Cuenta,
        s: 0.9,
        x: 350,
        y: 760,
        cuando: 0.36,
        p: {
          n: 80,
          p: 0.8
        }
      }, {
        C: B.Cuenta,
        s: 0.9,
        x: 800,
        y: 760,
        cuando: 0.58,
        p: {
          n: 20,
          p: 0.2
        }
      }],
      lienzo: function (T, f) {
        return barra8020(T, f);
      },
      bien: [{
        x: 60,
        y: 1120,
        cuando: 0.74,
        s: 0.75
      }],
      r1: {
        text: 'LA REGLA 80/20',
        s: 1.25,
        cuando: 0.02
      },
      r2: {
        text: 'UN GUSTO DE VEZ EN CUANDO',
        s: 0.95,
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Muévete',
    dur: 5,
    vo: 'Y muévete, pero ojo: una hamburguesa con papas equivale a más de una hora corriendo.',
    C: EscCorre
  }, {
    nombre: 'A dormir',
    dur: 5,
    vo: 'Disfrútala de vez en cuando... pero no a las 2 de la mañana. ¡A dormir!',
    C: EscDormir
  }];
  global.REELS.registrar({
    id: 'chatarra',
    titulo: 'No comas comida chatarra (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿QUIÉN ASALTA LA NEVERA?',
      vo: 'Mándaselo al que dice que está a dieta, y guarda este video.'
    }
  });
})(window);
