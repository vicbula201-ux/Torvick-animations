/* GENERADO por compilar.js desde nutricion.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   NUTRICION — window.N: piezas para los videos de nutricion, en el
   estilo de P (trazo INK grueso, relleno blanco o de la paleta,
   puntas redondas, viewBox fijo y prop s de escala).

   Comida (viewBox 240x240, centrada en 120,120):
     N.Pollo N.Pescado N.Huevo N.Leche N.Legumbres N.FrutosSecos N.Semillas
     N.COMIDA = { pollo, pescado, huevo, leche, legumbres, frutosSecos, semillas }
   N.Plato    plato visto de arriba (viewBox 420x420); children van encima
   N.Bola     aminoacido: una bolita de color (r, color) para armar cadenas
   N.Balanza  balanza de baño vista de frente; va debajo de los pies de Tor
              (en fondo(g) de TOR.Tor, con { y: g.piso, x: g.centro[0] })
   N.Dial     el reloj de la balanza, grande, con la aguja en p 0..1
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var P = global.P;
  var clamp = global.clamp;
  var C = P.C;
  var BLANCO = '#ffffff';
  var T0 = {
    stroke: C.INK,
    strokeWidth: 13,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  function Svg(props) {
    var s = props.s == null ? 1 : props.s,
      w = props.w || 240,
      h = props.h || 240;
    return /*#__PURE__*/React.createElement("svg", {
      width: w * s,
      height: h * s,
      viewBox: '0 0 ' + w + ' ' + h,
      style: Object.assign({
        display: 'block',
        overflow: 'visible'
      }, props.style || {})
    }, props.children);
  }

  /* ---------------- comida ---------------- */

  // muslo de pollo: carne dorada + hueso con sus dos nudos
  function Pollo(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 138 102 L 192 48",
      stroke: C.INK,
      strokeWidth: 40,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 138 102 L 192 48",
      stroke: BLANCO,
      strokeWidth: 16,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", _extends({
      cx: 186,
      cy: 36,
      r: 17,
      fill: BLANCO
    }, T0)), /*#__PURE__*/React.createElement("circle", _extends({
      cx: 204,
      cy: 54,
      r: 17,
      fill: BLANCO
    }, T0)), /*#__PURE__*/React.createElement("path", {
      d: "M 192 48 L 178 62",
      stroke: BLANCO,
      strokeWidth: 16,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 150 92 C 168 120 160 172 118 196 C 76 218 32 196 30 152 C 28 110 70 72 112 70 C 128 70 140 78 150 92 Z",
      fill: C.YEL
    }, T0)), /*#__PURE__*/React.createElement("path", {
      d: "M 62 140 Q 70 116 92 104",
      fill: "none",
      stroke: BLANCO,
      strokeWidth: 11,
      strokeLinecap: "round"
    }));
  }

  // pescado mirando a la izquierda
  function Pescado(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 168 120 L 214 82 Q 204 120 214 158 Z",
      fill: C.GRY
    }, T0)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 82 90 Q 104 44 148 90 Z",
      fill: C.GRY
    }, T0, {
      strokeWidth: 11
    })), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 24 120 C 56 70 128 62 176 120 C 128 178 56 170 24 120 Z",
      fill: BLANCO
    }, T0)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 96 92 Q 86 120 96 148",
      fill: "none"
    }, T0, {
      strokeWidth: 11
    })), /*#__PURE__*/React.createElement("circle", {
      cx: 58,
      cy: 112,
      r: 8,
      fill: C.INK
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 132 108 L 146 120 L 132 132",
      fill: "none",
      stroke: C.GRY,
      strokeWidth: 10,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }

  // huevo frito
  function Huevo(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 120 28 C 160 26 196 52 200 88 C 214 116 210 160 178 184 C 150 208 108 214 76 196 C 40 180 24 140 34 108 C 40 70 76 30 120 28 Z",
      fill: BLANCO
    }, T0)), /*#__PURE__*/React.createElement("circle", _extends({
      cx: 124,
      cy: 114,
      r: 42,
      fill: C.YEL
    }, T0)), /*#__PURE__*/React.createElement("path", {
      d: "M 104 100 Q 110 88 124 86",
      fill: "none",
      stroke: BLANCO,
      strokeWidth: 10,
      strokeLinecap: "round"
    }));
  }

  // caja de leche: frente blanco, costado gris, techo a dos aguas
  function Leche(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 150 92 L 186 72 L 186 196 L 150 214 Z",
      fill: C.GRY
    }, T0)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 150 92 L 128 54 L 164 34 L 186 72 Z",
      fill: C.GRY
    }, T0)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 66 92 L 108 54 L 150 92 L 150 214 L 66 214 Z",
      fill: BLANCO
    }, T0)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 108 54 L 128 54",
      fill: "none"
    }, T0)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 102 30 L 112 54",
      fill: "none"
    }, T0, {
      strokeWidth: 11
    })), /*#__PURE__*/React.createElement("rect", _extends({
      x: 80,
      y: 128,
      width: 56,
      height: 44,
      rx: 10,
      fill: C.YEL
    }, T0, {
      strokeWidth: 11
    })));
  }

  // vaina de arvejas abierta
  function Legumbres(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 28 148 C 60 80 150 46 214 70 C 196 140 110 196 28 148 Z",
      fill: C.GRN
    }, T0)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 52 140 C 90 104 150 86 192 84 C 170 126 110 160 52 140 Z",
      fill: BLANCO
    }, T0, {
      strokeWidth: 10
    })), /*#__PURE__*/React.createElement("circle", _extends({
      cx: 86,
      cy: 126,
      r: 17,
      fill: C.GRN
    }, T0, {
      strokeWidth: 10
    })), /*#__PURE__*/React.createElement("circle", _extends({
      cx: 122,
      cy: 114,
      r: 18,
      fill: C.GRN
    }, T0, {
      strokeWidth: 10
    })), /*#__PURE__*/React.createElement("circle", _extends({
      cx: 158,
      cy: 102,
      r: 16,
      fill: C.GRN
    }, T0, {
      strokeWidth: 10
    })), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 214 70 Q 226 56 220 40",
      fill: "none"
    }, T0)));
  }

  // dos almendras
  function Almendra(props) {
    return /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + props.x + ' ' + props.y + ') rotate(' + props.rot + ')'
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 0 -62 C 34 -30 42 18 24 44 C 12 60 -12 60 -24 44 C -42 18 -34 -30 0 -62 Z",
      fill: C.GRY
    }, T0)), /*#__PURE__*/React.createElement("path", {
      d: "M -8 -30 Q -16 0 -8 30 M 10 -20 Q 16 6 8 32",
      fill: "none",
      stroke: BLANCO,
      strokeWidth: 8,
      strokeLinecap: "round"
    }));
  }
  function FrutosSecos(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s
    }, /*#__PURE__*/React.createElement(Almendra, {
      x: 88,
      y: 128,
      rot: -24
    }), /*#__PURE__*/React.createElement(Almendra, {
      x: 156,
      y: 116,
      rot: 26
    }));
  }

  // pipas de girasol: negras con rayas blancas
  function Pipa(props) {
    return /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + props.x + ' ' + props.y + ') rotate(' + props.rot + ')'
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 0 -40 C 22 -18 24 18 12 32 C 6 40 -6 40 -12 32 C -24 18 -22 -18 0 -40 Z",
      fill: C.INK
    }, T0, {
      strokeWidth: 8
    })), /*#__PURE__*/React.createElement("path", {
      d: "M -7 -16 L -7 22 M 7 -16 L 7 22",
      stroke: BLANCO,
      strokeWidth: 6,
      strokeLinecap: "round"
    }));
  }
  function Semillas(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s
    }, /*#__PURE__*/React.createElement(Pipa, {
      x: 76,
      y: 134,
      rot: -30
    }), /*#__PURE__*/React.createElement(Pipa, {
      x: 122,
      y: 108,
      rot: 8
    }), /*#__PURE__*/React.createElement(Pipa, {
      x: 166,
      y: 140,
      rot: 40
    }), /*#__PURE__*/React.createElement(Pipa, {
      x: 118,
      y: 170,
      rot: -80
    }));
  }
  var COMIDA = {
    pollo: Pollo,
    pescado: Pescado,
    huevo: Huevo,
    leche: Leche,
    legumbres: Legumbres,
    frutosSecos: FrutosSecos,
    semillas: Semillas
  };

  /* ---------------- plato, aminoacidos, balanza ---------------- */

  function Plato(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s,
      w: 420,
      h: 420
    }, /*#__PURE__*/React.createElement("circle", _extends({
      cx: 210,
      cy: 210,
      r: 196,
      fill: BLANCO
    }, T0, {
      strokeWidth: 15
    })), /*#__PURE__*/React.createElement("circle", {
      cx: 210,
      cy: 210,
      r: 142,
      fill: "none",
      stroke: C.GRY,
      strokeWidth: 12
    }));
  }
  function Bola(props) {
    var r = props.r || 34;
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s,
      w: 2 * r + 20,
      h: 2 * r + 20
    }, /*#__PURE__*/React.createElement("circle", _extends({
      cx: r + 10,
      cy: r + 10,
      r: r,
      fill: props.color || C.YEL
    }, T0)), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (r + 10 - r * 0.5) + ' ' + (r + 10 - r * 0.1) + ' Q ' + (r + 10 - r * 0.45) + ' ' + (r + 10 - r * 0.5) + ' ' + (r + 10 - r * 0.05) + ' ' + (r + 10 - r * 0.55),
      fill: "none",
      stroke: BLANCO,
      strokeWidth: 8,
      strokeLinecap: "round"
    }));
  }

  // balanza de baño de frente: tapa (y .. y+26) y frente (hasta y+70), ancha 560
  function Balanza(props) {
    var x = props.x == null ? 600 : props.x,
      y = props.y;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", _extends({
      x: x - 280,
      y: y + 18,
      width: 560,
      height: 58,
      rx: 24,
      fill: BLANCO
    }, T0, {
      strokeWidth: 15
    })), /*#__PURE__*/React.createElement("rect", _extends({
      x: x - 296,
      y: y - 6,
      width: 592,
      height: 30,
      rx: 14,
      fill: C.GRY
    }, T0, {
      strokeWidth: 15
    })), /*#__PURE__*/React.createElement("rect", _extends({
      x: x - 54,
      y: y + 32,
      width: 108,
      height: 30,
      rx: 10,
      fill: C.YEL
    }, T0, {
      strokeWidth: 11
    })));
  }

  // dial de la balanza: semicirculo con marcas, la aguja barre de -70 a +70 grados
  function Dial(props) {
    var p = clamp(props.p == null ? 0 : props.p, 0, 1);
    var a = (-70 + 140 * p) * Math.PI / 180;
    var marcas = [];
    for (var i = 0; i <= 8; i++) {
      var b = (-70 + 140 * i / 8) * Math.PI / 180,
        l = i % 2 ? 18 : 30;
      marcas.push(/*#__PURE__*/React.createElement("path", {
        key: i,
        d: 'M ' + (150 + 112 * Math.sin(b)) + ' ' + (170 - 112 * Math.cos(b)) + ' L ' + (150 + (112 - l) * Math.sin(b)) + ' ' + (170 - (112 - l) * Math.cos(b)),
        stroke: C.INK,
        strokeWidth: 9,
        strokeLinecap: "round"
      }));
    }
    return /*#__PURE__*/React.createElement(Svg, {
      s: props.s,
      w: 300,
      h: 220
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: 12,
      y: 12,
      width: 276,
      height: 196,
      rx: 40,
      fill: BLANCO
    }, T0, {
      strokeWidth: 15
    })), /*#__PURE__*/React.createElement("path", {
      d: "M 38 170 A 112 112 0 0 1 262 170",
      fill: "none",
      stroke: C.GRY,
      strokeWidth: 12
    }), props.zona ? /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (150 + 112 * Math.sin(props.zona[0])) + ' ' + (170 - 112 * Math.cos(props.zona[0])) + ' A 112 112 0 0 1 ' + (150 + 112 * Math.sin(props.zona[1])) + ' ' + (170 - 112 * Math.cos(props.zona[1])),
      fill: "none",
      stroke: C.GRN,
      strokeWidth: 22,
      strokeLinecap: "round"
    }) : null, marcas, /*#__PURE__*/React.createElement("path", {
      d: 'M 150 170 L ' + (150 + 96 * Math.sin(a)) + ' ' + (170 - 96 * Math.cos(a)),
      stroke: C.INK,
      strokeWidth: 12,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 150,
      cy: 170,
      r: 16,
      fill: C.INK
    }));
  }
  global.N = {
    Pollo: Pollo,
    Pescado: Pescado,
    Huevo: Huevo,
    Leche: Leche,
    Legumbres: Legumbres,
    FrutosSecos: FrutosSecos,
    Semillas: Semillas,
    COMIDA: COMIDA,
    Plato: Plato,
    Bola: Bola,
    Balanza: Balanza,
    Dial: Dial
  };
})(window);
