/* GENERADO por compilar.js desde identidad.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   IDENTIDAD — window.IDENTIDAD: imagenes fijas de la marca, en el mismo
   estilo pizarra que los reels (paleta de cinco, trazo INK grueso).

   <IDENTIDAD.Perfil variante="amarillo" | "negro" />   foto de perfil 1080x1080
       (Instagram y TikTok la recortan en circulo: todo va dentro del circulo)
   <IDENTIDAD.Destacada tipo alto />   portada de historia destacada
       tipo: 'entreno' (mancuerna) | 'nutricion' (manzana) | 'descanso' (luna)
             | 'suplementos' (shaker); alto 1920 (historia) o 1080 (cuadrada)
   <IDENTIDAD.Icono tipo s />   el icono suelto (viewBox 400x400)
   <IDENTIDAD.Maqueta />   vista previa de la cabecera del perfil (1080x760)

   identidad.html las muestra; herramientas/imagenes.js las exporta a PNG.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var P = global.P,
    TOR = global.TOR;
  var C = P.C;
  var BLANCO = '#ffffff';
  var TRAZO = {
    stroke: C.INK,
    strokeWidth: 22,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  /* ---------------- iconos (400x400) ---------------- */

  function Mancuerna() {
    return /*#__PURE__*/React.createElement("g", {
      transform: "rotate(-35 200 200)"
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: 86,
      y: 184,
      width: 228,
      height: 32,
      rx: 14,
      fill: BLANCO
    }, TRAZO)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 56,
      y: 142,
      width: 40,
      height: 116,
      rx: 14,
      fill: C.GRY
    }, TRAZO)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 304,
      y: 142,
      width: 40,
      height: 116,
      rx: 14,
      fill: C.GRY
    }, TRAZO)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 98,
      y: 118,
      width: 52,
      height: 164,
      rx: 16,
      fill: C.YEL
    }, TRAZO)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 250,
      y: 118,
      width: 52,
      height: 164,
      rx: 16,
      fill: C.YEL
    }, TRAZO)));
  }
  function Manzana() {
    var cuerpo = 'M 200 132 C 160 100 90 110 88 186 C 86 258 134 324 172 324 ' + 'C 186 324 192 314 200 314 C 208 314 214 324 228 324 C 266 324 314 258 312 186 ' + 'C 310 110 240 100 200 132 Z';
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
      d: cuerpo,
      fill: C.GRN
    }, TRAZO)), /*#__PURE__*/React.createElement("path", {
      d: "M 128 196 C 128 168 140 152 160 146",
      fill: "none",
      stroke: BLANCO,
      strokeWidth: 18,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 200 132 Q 194 104 210 76",
      fill: "none"
    }, TRAZO)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 214 104 C 232 68 276 62 296 74 C 280 106 240 116 214 104 Z",
      fill: C.YEL
    }, TRAZO)));
  }
  function Luna() {
    var z = function (x, y, s) {
      return 'M ' + x + ' ' + y + ' L ' + (x + s) + ' ' + y + ' L ' + x + ' ' + (y + s) + ' L ' + (x + s) + ' ' + (y + s);
    };
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 214 84 A 128 128 0 1 0 324 262 A 104 104 0 1 1 214 84 Z",
      fill: C.YEL
    }, TRAZO)), /*#__PURE__*/React.createElement("path", _extends({
      d: z(262, 128, 52),
      fill: "none"
    }, TRAZO, {
      strokeWidth: 18
    })), /*#__PURE__*/React.createElement("path", _extends({
      d: z(318, 72, 36),
      fill: "none"
    }, TRAZO, {
      strokeWidth: 16
    })));
  }
  function Shaker() {
    var izq = function (y) {
      return 132 + (y - 150) * 16 / 190;
    };
    var der = function (y) {
      return 268 - (y - 150) * 16 / 190;
    };
    var liquido = 'M ' + izq(236) + ' 236 L ' + der(236) + ' 236 L 252 326 Q 250 340 236 340 L 164 340 Q 150 340 148 326 Z';
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
      d: "M 132 150 L 268 150 L 252 326 Q 250 340 236 340 L 164 340 Q 150 340 148 326 Z",
      fill: BLANCO
    }, TRAZO)), /*#__PURE__*/React.createElement("path", {
      d: liquido,
      fill: C.YEL,
      stroke: "none"
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + (izq(236) + 10) + ' 236 L ' + (der(236) - 10) + ' 236'
    }, TRAZO, {
      strokeWidth: 14
    })), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 132 150 L 268 150 L 252 326 Q 250 340 236 340 L 164 340 Q 150 340 148 326 Z",
      fill: "none"
    }, TRAZO)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 226 176 L 250 176 M 230 204 L 248 204",
      fill: "none"
    }, TRAZO, {
      strokeWidth: 14
    })), /*#__PURE__*/React.createElement("rect", _extends({
      x: 118,
      y: 110,
      width: 164,
      height: 44,
      rx: 14,
      fill: C.GRY
    }, TRAZO)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 168,
      y: 68,
      width: 52,
      height: 46,
      rx: 12,
      fill: BLANCO
    }, TRAZO)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 220 82 Q 260 82 260 112",
      fill: "none"
    }, TRAZO, {
      strokeWidth: 16
    })));
  }
  var ICONOS = {
    entreno: Mancuerna,
    nutricion: Manzana,
    descanso: Luna,
    suplementos: Shaker
  };
  function Icono(props) {
    var Ic = ICONOS[props.tipo] || Mancuerna;
    var s = props.s == null ? 1 : props.s;
    return /*#__PURE__*/React.createElement("svg", {
      width: 400 * s,
      height: 400 * s,
      viewBox: "0 0 400 400",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement(Ic, null));
  }

  /* ---------------- portada de destacada ---------------- */

  function Destacada(props) {
    var alto = props.alto || 1920,
      cy = alto / 2;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 1080,
        height: alto,
        background: C.YEL,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: alto,
      style: {
        position: 'absolute',
        left: 0,
        top: 0
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: 540,
      cy: cy,
      r: 360,
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 26
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 540 - 310,
        top: cy - 310
      }
    }, /*#__PURE__*/React.createElement(Icono, {
      tipo: props.tipo,
      s: 1.55
    })));
  }

  /* ---------------- foto de perfil ---------------- */

  // Tor sacando biceps, de la cabeza a la cintura; el foco (600, 590) del
  // viewBox de B.Frente cae en (540, 560) del cuadro
  var RETRATO = {
    s: 1.06,
    foco: [600, 590],
    en: [540, 560]
  };
  function Perfil(props) {
    var negro = props.variante === 'negro';
    var R = RETRATO;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 1080,
        height: 1080,
        background: negro ? C.INK : C.YEL,
        overflow: 'hidden'
      }
    }, negro ? /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1080,
      style: {
        position: 'absolute',
        left: 0,
        top: 0
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: 540,
      cy: 560,
      r: 430,
      fill: C.YEL
    })) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: R.en[0] - R.foco[0] * R.s,
        top: R.en[1] - R.foco[1] * R.s
      }
    }, /*#__PURE__*/React.createElement(TOR.Tor, {
      s: R.s,
      flex: 1,
      boca: "sonrisa",
      sinPiso: true,
      musc: {
        bic: 1
      }
    })));
  }

  /* ---------------- maqueta de la cabecera ---------------- */

  function Circulo(props) {
    var d = props.d;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: d,
        height: d,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 0 0 ' + (props.borde || 4) + 'px #3A362F'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'scale(' + d / props.lado + ')',
        transformOrigin: '0 0',
        position: 'absolute',
        left: 0,
        top: props.top || 0
      }
    }, props.children));
  }
  function Maqueta() {
    var dest = [['entreno', 'Entreno'], ['nutricion', 'Nutrición'], ['descanso', 'Descanso'], ['suplementos', 'Suplementos']];
    var txt = {
      fontFamily: "'Barlow Semi Condensed', sans-serif",
      color: '#F2EFE9'
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1080,
        height: 760,
        background: '#171614',
        position: 'relative',
        padding: 56,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 56
      }
    }, /*#__PURE__*/React.createElement(Circulo, {
      d: 260,
      lado: 1080,
      borde: 6
    }, /*#__PURE__*/React.createElement(Perfil, {
      variante: "amarillo"
    })), /*#__PURE__*/React.createElement("div", {
      style: txt
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 58,
        fontWeight: 700
      }
    }, "eltorvick"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 34,
        fontWeight: 500,
        opacity: 0.75,
        marginTop: 10
      }
    }, "Entrenamiento y nutrici\xF3n, explicados"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 54,
        marginTop: 90,
        paddingLeft: 14
      }
    }, dest.map(function (d) {
      return /*#__PURE__*/React.createElement("div", {
        key: d[0],
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18
        }
      }, /*#__PURE__*/React.createElement(Circulo, {
        d: 180,
        lado: 1080
      }, /*#__PURE__*/React.createElement(Destacada, {
        tipo: d[0],
        alto: 1080
      })), /*#__PURE__*/React.createElement("div", {
        style: Object.assign({
          fontSize: 32,
          fontWeight: 600
        }, txt)
      }, d[1]));
    })));
  }
  global.IDENTIDAD = {
    Perfil: Perfil,
    Destacada: Destacada,
    Icono: Icono,
    Maqueta: Maqueta,
    ICONOS: Object.keys(ICONOS)
  };
})(window);
