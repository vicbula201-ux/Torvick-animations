/* GENERADO por compilar.js desde muebles.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   MUEBLES — window.MU: escenografia reutilizable para los videos con Tor
   (la calle de noche, el cuarto, la sala). Todo con la paleta de cinco y el
   trazo INK, como las piezas de P.

   En coordenadas de Tor (viewBox 1200x1600; van en fondo(g) / extra(g) / agarre(g)):
     MU.cama()        cabecera y almohada (detras de Tor)
     MU.manta()       la manta que lo tapa de la cintura para abajo (encima)
     MU.sofa()        respaldo, apoyabrazos y asiento (detras de Tor sentado)
     MU.mantaSofa()   manta sobre las piernas (encima)
     MU.poseSentado({ baja, rodillas, pies })   pose de frente sentado en el sofa
     MU.balde(c, nivel)   balde gris con el borde en c (lo que se sostiene; nivel 0..1 lo llena)
   Piezas sueltas (svg con s, para PL piezas o dentro de un <g transform>):
     MU.Farol ({ s, luz })          farol de calle con su cono de luz (1300 de alto, el poste en x 260)
     MU.Tacho ({ s, tapa })         tacho de basura; tapa 0..1 la levanta
     MU.Tele ({ s, children })      televisor con pie; children = SVG de la pantalla (632x372)
     MU.Despertador ({ s, T, gira, suena })   marca las 3 (hora: otra hora); suena lo sacude
     MU.Mesita ({ s })              mesa de luz
     MU.Ventana ({ s, T })          ventana de noche con la luna
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var P = global.P,
    B = global.B,
    N = global.N,
    TOR = global.TOR;
  var clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };
  function Svg(props) {
    var s = props.s == null ? 1 : props.s;
    return /*#__PURE__*/React.createElement("svg", {
      width: props.w * s,
      height: props.h * s,
      viewBox: '0 0 ' + props.w + ' ' + props.h,
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, props.children);
  }

  /* ---------------- en coordenadas de Tor ---------------- */

  function cama() {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", _extends({
      x: 120,
      y: 560,
      width: 960,
      height: 940,
      rx: 50,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("rect", {
      x: 180,
      y: 620,
      width: 840,
      height: 300,
      rx: 30,
      fill: C.GRY,
      stroke: "none"
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 300,
      y: 600,
      width: 600,
      height: 190,
      rx: 70,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: "M 380 660 Q 600 700 820 660",
      fill: "none",
      stroke: C.GRY,
      strokeWidth: 12,
      strokeLinecap: "round"
    }));
  }
  function manta() {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 90 1520 L 90 1050 Q 90 970 180 970 L 1020 970 Q 1110 970 1110 1050 L 1110 1520 Z",
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: "M 90 1080 L 1110 1080",
      stroke: C.GRY,
      strokeWidth: 16
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 300 1180 Q 340 1300 320 1440 M 600 1160 Q 640 1300 610 1450 M 880 1180 Q 920 1300 900 1440",
      fill: "none",
      stroke: C.GRY,
      strokeWidth: 11,
      strokeLinecap: "round"
    }));
  }

  // sofa de frente: Tor se sienta con MU.poseSentado (la cadera baja ~250)
  function sofa() {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: "M 150 1440 L 150 1500 M 1050 1440 L 1050 1500",
      stroke: C.INK,
      strokeWidth: 26,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 150,
      y: 770,
      width: 900,
      height: 560,
      rx: 80,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: "M 600 800 L 600 1180",
      stroke: C.INK,
      strokeWidth: 10,
      strokeLinecap: "round",
      opacity: 0.5
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 110,
      y: 1290,
      width: 980,
      height: 160,
      rx: 40,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 210,
      y: 1180,
      width: 780,
      height: 150,
      rx: 50,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 50,
      y: 1010,
      width: 200,
      height: 440,
      rx: 70,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 950,
      y: 1010,
      width: 200,
      height: 440,
      rx: 70,
      fill: C.GRY
    }, LN)));
  }
  function mantaSofa() {
    // manta amarilla sobre las piernas: arriba se le marcan las dos rodillas
    var d = 'M 262 1214 Q 300 1118 428 1132 Q 520 1140 600 1176 Q 680 1140 772 1132 Q 900 1118 938 1214 ' + 'L 962 1430 Q 890 1470 808 1440 Q 700 1480 600 1444 Q 500 1480 392 1440 Q 310 1470 238 1430 Z';
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
      d: d,
      fill: C.YEL
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: "M 250 1330 Q 600 1290 950 1330",
      fill: "none",
      stroke: BLANCO,
      strokeWidth: 26,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 430 1210 Q 452 1320 436 1420 M 600 1200 Q 624 1320 606 1424 M 770 1210 Q 790 1320 772 1420",
      fill: "none",
      stroke: C.INK,
      strokeWidth: 9,
      strokeLinecap: "round",
      opacity: 0.35
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: d,
      fill: "none"
    }, LN)));
  }
  function poseSentado(op) {
    op = op || {};
    var baja = op.baja == null ? 250 : op.baja;
    var p = TOR.pose({
      flex: 0
    });
    p.centro = U.suma(p.centro, [0, baja]);
    p.cuello = U.suma(p.cuello, [0, baja]);
    ['izq', 'der'].forEach(function (k, i) {
      var l = i ? 1 : -1,
        q = p[k];
      q.codo = U.suma(q.codo, [0, baja]);
      q.mano = U.suma(q.mano, [0, baja]);
      q.rodilla = [600 + l * (op.rodillas == null ? 150 : op.rodillas), p.centro[1] + 60];
      q.tobillo = [600 + l * (op.pies == null ? 170 : op.pies), q.tobillo[1]];
      q.pieAng = 18;
    });
    return p;
  }
  // balde con el centro del borde en c
  function balde(c, nivel) {
    var x = c[0],
      y = c[1],
      k = clamp(nivel || 0, 0, 1);
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + (x - 150) + ' ' + y + ' L ' + (x - 112) + ' ' + (y + 214) + ' Q ' + x + ' ' + (y + 246) + ' ' + (x + 112) + ' ' + (y + 214) + ' L ' + (x + 150) + ' ' + y + ' Z',
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("ellipse", _extends({
      cx: x,
      cy: y,
      rx: 150,
      ry: 30,
      fill: BLANCO
    }, LN)), k > 0.02 ? /*#__PURE__*/React.createElement("ellipse", {
      cx: x,
      cy: y + 2,
      rx: 132 * (0.5 + 0.5 * k),
      ry: 21 * (0.5 + 0.5 * k),
      fill: C.YEL,
      stroke: C.INK,
      strokeWidth: 8
    }) : null, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (x - 96) + ' ' + (y + 96) + ' Q ' + x + ' ' + (y + 122) + ' ' + (x + 96) + ' ' + (y + 96),
      fill: "none",
      stroke: C.INK,
      strokeWidth: 9,
      strokeLinecap: "round",
      opacity: 0.45
    }));
  }

  /* ---------------- piezas sueltas ---------------- */

  function Farol(props) {
    var luz = props.luz == null ? 1 : clamp(props.luz, 0, 1);
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s,
      w: 360,
      h: 1300
    }, luz > 0.02 ? /*#__PURE__*/React.createElement("path", {
      d: "M 76 156 L 184 156 L 348 1290 L -160 1290 Z",
      fill: C.YEL,
      opacity: 0.2 * luz
    }) : null, /*#__PURE__*/React.createElement("rect", _extends({
      x: 228,
      y: 1226,
      width: 64,
      height: 66,
      rx: 12,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: "M 260 1230 L 260 190 Q 260 96 176 96 L 150 96",
      fill: "none",
      stroke: C.INK,
      strokeWidth: 34,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 260 1230 L 260 190 Q 260 96 176 96 L 150 96",
      fill: "none",
      stroke: C.GRY,
      strokeWidth: 12,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 88 96 L 172 96 L 196 150 L 64 150 Z",
      fill: C.INK,
      stroke: C.INK,
      strokeWidth: 12,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("ellipse", _extends({
      cx: 130,
      cy: 154,
      rx: 56,
      ry: 18,
      fill: luz > 0.02 ? C.YEL : BLANCO
    }, LN, {
      strokeWidth: 11
    })));
  }
  function Tacho(props) {
    var tapa = props.tapa || 0;
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s,
      w: 240,
      h: 300
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 20 70 L 220 70 L 202 284 L 38 284 Z",
      fill: BLANCO
    }, LN, {
      strokeWidth: 14
    })), /*#__PURE__*/React.createElement("path", {
      d: "M 75 100 L 80 254 M 120 100 L 120 254 M 165 100 L 160 254",
      stroke: C.GRY,
      strokeWidth: 10,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("g", {
      transform: 'rotate(' + (-30 * tapa).toFixed(1) + ' 20 60)'
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: 6,
      y: 46,
      width: 228,
      height: 30,
      rx: 12,
      fill: C.GRY
    }, LN, {
      strokeWidth: 13
    })), /*#__PURE__*/React.createElement("path", {
      d: "M 100 46 Q 120 20 140 46",
      fill: "none",
      stroke: C.INK,
      strokeWidth: 12,
      strokeLinecap: "round"
    })));
  }
  function Tele(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s,
      w: 700,
      h: 540
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 290 430 L 270 512 L 430 512 L 410 430 Z",
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: "M 200 520 L 500 520",
      stroke: C.INK,
      strokeWidth: 22,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 10,
      y: 10,
      width: 680,
      height: 424,
      rx: 30,
      fill: C.INK
    }, LN)), /*#__PURE__*/React.createElement("rect", {
      x: 34,
      y: 34,
      width: 632,
      height: 372,
      rx: 10,
      fill: BLANCO
    }), /*#__PURE__*/React.createElement("svg", {
      x: 34,
      y: 34,
      width: 632,
      height: 372,
      viewBox: "0 0 632 372"
    }, props.children), /*#__PURE__*/React.createElement("rect", {
      x: 34,
      y: 34,
      width: 632,
      height: 372,
      rx: 10,
      fill: "none",
      stroke: C.INK,
      strokeWidth: 8
    }));
  }

  // despertador: hora (1..12, por defecto 3); gira (horas por segundo) hace correr las agujas
  function Despertador(props) {
    var T = props.T || 0,
      gira = props.gira || 0;
    var h0 = props.hora == null ? 3 : props.hora;
    var hora = h0 * 30 + gira * 30 * T,
      minuto = gira * 360 * T,
      seg = T * 360;
    var tiembla = props.suena ? 5 * Math.sin(T * 70) : 0;
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s,
      w: 240,
      h: 260
    }, /*#__PURE__*/React.createElement("g", {
      transform: 'rotate(' + tiembla.toFixed(1) + ' 120 150)'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 66 226 L 44 252 M 174 226 L 196 252",
      stroke: C.INK,
      strokeWidth: 14,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 30 70 A 44 44 0 0 1 92 24 Z",
      fill: C.GRY
    }, LN, {
      strokeWidth: 12
    })), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 210 70 A 44 44 0 0 0 148 24 Z",
      fill: C.GRY
    }, LN, {
      strokeWidth: 12
    })), /*#__PURE__*/React.createElement("circle", _extends({
      cx: 120,
      cy: 140,
      r: 98,
      fill: BLANCO
    }, LN)), [0, 90, 180, 270].map(function (a) {
      return /*#__PURE__*/React.createElement("path", {
        key: a,
        d: "M 120 58 L 120 74",
        stroke: C.INK,
        strokeWidth: 10,
        strokeLinecap: "round",
        transform: 'rotate(' + a + ' 120 140)'
      });
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 120 140 L 120 88",
      stroke: C.INK,
      strokeWidth: 14,
      strokeLinecap: "round",
      transform: 'rotate(' + hora.toFixed(1) + ' 120 140)'
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 120 140 L 120 66",
      stroke: C.INK,
      strokeWidth: 10,
      strokeLinecap: "round",
      transform: 'rotate(' + minuto.toFixed(1) + ' 120 140)'
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 120 150 L 120 62",
      stroke: C.RED,
      strokeWidth: 6,
      strokeLinecap: "round",
      transform: 'rotate(' + seg.toFixed(1) + ' 120 140)'
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 120,
      cy: 140,
      r: 10,
      fill: C.INK
    })));
  }
  function Mesita(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s,
      w: 220,
      h: 240
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: 10,
      y: 10,
      width: 200,
      height: 190,
      rx: 14,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: "M 10 104 L 210 104",
      stroke: C.INK,
      strokeWidth: 12
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 90 58 L 130 58 M 90 152 L 130 152",
      stroke: C.INK,
      strokeWidth: 12,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 34 200 L 34 232 M 186 200 L 186 232",
      stroke: C.INK,
      strokeWidth: 14,
      strokeLinecap: "round"
    }));
  }
  function Ventana(props) {
    var T = props.T || 0;
    var tw = 0.75 + 0.25 * Math.sin(T * 4);
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s,
      w: 260,
      h: 260
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: 10,
      y: 10,
      width: 240,
      height: 240,
      rx: 16,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("g", {
      transform: "translate(40 40) scale(0.62)"
    }, /*#__PURE__*/React.createElement(N.ICONOS.luna, {
      s: 1
    })), /*#__PURE__*/React.createElement("path", {
      d: 'M 196 70 l 0 ' + -22 * tw + ' M 196 70 l 0 ' + 22 * tw + ' M 196 70 l ' + -22 * tw + ' 0 M 196 70 l ' + 22 * tw + ' 0',
      stroke: C.YEL,
      strokeWidth: 10,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 80,
      cy: 200,
      r: 9 * tw,
      fill: C.YEL
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 130 10 L 130 250 M 10 130 L 250 130",
      stroke: C.INK,
      strokeWidth: 12
    }));
  }
  global.MU = {
    cama: cama,
    manta: manta,
    sofa: sofa,
    mantaSofa: mantaSofa,
    poseSentado: poseSentado,
    balde: balde,
    Farol: Farol,
    Tacho: Tacho,
    Tele: Tele,
    Despertador: Despertador,
    Mesita: Mesita,
    Ventana: Ventana
  };
})(window);
