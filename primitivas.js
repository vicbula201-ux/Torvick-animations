/* GENERADO por compilar.js desde primitivas.jsx — no editar a mano. */
/* ============================================================
   PRIMITIVAS
   parte 1 -> window.M  helpers de movimiento (el ADN del estilo)
   parte 2 -> window.P  piezas SVG dibujadas a mano en codigo
   ============================================================ */
(function (global) {
  'use strict';

  var Easing = global.Easing;
  var animate = global.animate;
  var clamp = global.clamp;
  var TAU = Math.PI * 2;

  /* =========================================================
     PARTE 1 — M: helpers de movimiento
     Dos reglas de oro:
       nada aparece de golpe  (pop / slide)
       nada se queda inmovil  (life)
     ========================================================= */

  var M = {
    // Entrada con rebote: opacidad rapida + escala elastica.
    pop: function (T, cuando, dur) {
      if (dur == null) dur = 0.42;
      var opacity = animate({
        from: 0,
        to: 1,
        start: cuando,
        end: cuando + 0.1,
        ease: Easing.linear
      })(T);
      var scale = animate({
        from: 0.55,
        to: 1,
        start: cuando,
        end: cuando + dur,
        ease: Easing.easeOutBack
      })(T);
      return {
        opacity: opacity,
        scale: scale
      };
    },
    // Entrada deslizada desde un borde. desdeX negativo -> entra por la izquierda.
    slide: function (T, cuando, desdeX, dur) {
      if (dur == null) dur = 0.4;
      if (desdeX == null) desdeX = -220;
      var opacity = animate({
        from: 0,
        to: 1,
        start: cuando,
        end: cuando + 0.1,
        ease: Easing.linear
      })(T);
      var x = animate({
        from: desdeX,
        to: 0,
        start: cuando,
        end: cuando + dur,
        ease: Easing.easeOutBack
      })(T);
      return {
        opacity: opacity,
        x: x
      };
    },
    // 0..1 para strokeDashoffset: lineas que se dibujan solas.
    draw: function (T, cuando, dur) {
      if (dur == null) dur = 0.5;
      return animate({
        from: 0,
        to: 1,
        start: cuando,
        end: cuando + dur,
        ease: Easing.easeOutQuart
      })(T);
    },
    // Oscilacion continua e infinita: flotacion, latido, balanceo.
    life: function (T, periodo, amplitud, fase) {
      if (periodo == null) periodo = 3.2;
      if (amplitud == null) amplitud = 8;
      if (fase == null) fase = 0;
      return Math.sin((T / periodo + fase) * TAU) * amplitud;
    },
    // Temblor rapido: lo que falla, lo roto, lo sobrecargado.
    vibra: function (T, hz, amp) {
      if (hz == null) hz = 44;
      if (amp == null) amp = 4;
      return Math.sin(T * hz) * amp;
    }
  };

  /* =========================================================
     PARTE 2 — P: piezas
     ========================================================= */

  var INK = '#14110F';
  var YEL = '#FFD400';
  var RED = '#E03A2F';
  var GRN = '#16A06A';
  var GRY = '#C9C3B8';
  var BLANCO = '#ffffff';
  var C = {
    INK: INK,
    YEL: YEL,
    RED: RED,
    GRN: GRN,
    GRY: GRY
  };

  // Envoltorio comun: viewBox fijo, escala por prop s, trazo que no se corta.
  function Svg(props) {
    var s = props.s == null ? 1 : props.s;
    return /*#__PURE__*/React.createElement("svg", {
      width: props.w * s,
      height: props.h * s,
      viewBox: '0 0 ' + props.w + ' ' + props.h,
      style: Object.assign({
        display: 'block',
        overflow: 'visible'
      }, props.style || {})
    }, props.children);
  }

  // Grupo con el estilo obligatorio: negro grueso, relleno blanco, puntas redondas.
  function T0(props) {
    return /*#__PURE__*/React.createElement("g", {
      fill: props.fill === undefined ? BLANCO : props.fill,
      stroke: props.stroke || INK,
      strokeWidth: props.sw == null ? 14 : props.sw,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      transform: props.transform,
      opacity: props.opacity
    }, props.children);
  }

  /* ---------------- Cerebro ---------------- */

  var CEREBRO_CONTORNO = 'M 92 302 C 60 252, 72 190, 122 162 C 132 112, 192 86, 242 108 ' + 'C 282 70, 352 70, 388 108 C 442 86, 502 112, 514 162 ' + 'C 562 192, 572 252, 540 302 C 572 352, 556 420, 500 446 ' + 'C 490 500, 430 532, 380 514 C 342 548, 272 548, 236 514 ' + 'C 182 532, 126 500, 118 446 C 62 420, 58 352, 92 302 Z';
  var CEREBRO_SURCO = 'M 314 92 C 292 172, 332 220, 306 300 C 282 380, 326 440, 308 534';
  var CEREBRO_PLIEGUES = ['M 150 200 C 188 172, 226 186, 236 224', 'M 128 300 C 172 286, 206 306, 208 344', 'M 152 412 C 190 392, 226 408, 232 440', 'M 250 262 C 268 300, 254 336, 224 350', 'M 372 174 C 410 152, 452 168, 458 206', 'M 402 296 C 444 280, 480 300, 480 338', 'M 356 396 C 396 378, 434 394, 438 428', 'M 470 232 C 490 268, 480 302, 452 316'];
  var CEREBRO_NODOS = [[150, 250], [215, 205], [260, 292], [190, 352], [152, 430], [242, 420], [300, 152], [305, 362], [300, 480], [370, 216], [430, 162], [455, 266], [390, 322], [470, 376], [420, 456], [350, 420], [508, 302]];
  var CEREBRO_ARISTAS = [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 2], [1, 6], [6, 9], [9, 10], [10, 11], [11, 12], [12, 9], [12, 7], [7, 2], [7, 15], [15, 8], [8, 5], [15, 13], [13, 11], [13, 14], [14, 15], [11, 16], [16, 10]];
  function Cerebro(props) {
    var s = props.s == null ? 1 : props.s;
    var on = clamp(props.on == null ? 0 : props.on, 0, 1);
    var T = props.T == null ? 0 : props.T;
    var shortcut = !!props.shortcut;
    var n = CEREBRO_ARISTAS.length;
    var encendidas = on * n;
    var pulso = 0.5 + 0.5 * Math.sin(T * 2.6);
    var nodosVivos = {};
    var aristas = CEREBRO_ARISTAS.map(function (e, i) {
      var viva = i < encendidas;
      var grado = clamp(encendidas - i, 0, 1);
      var a = CEREBRO_NODOS[e[0]],
        b = CEREBRO_NODOS[e[1]];
      if (viva) {
        nodosVivos[e[0]] = true;
        nodosVivos[e[1]] = true;
      }
      var brillo = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(T * 2.6 + i * 0.7));
      return /*#__PURE__*/React.createElement("line", {
        key: 'e' + i,
        x1: a[0],
        y1: a[1],
        x2: b[0],
        y2: b[1],
        stroke: viva ? GRN : GRY,
        strokeWidth: viva ? 11 + 2 * brillo : 8,
        strokeLinecap: "round",
        opacity: viva ? 0.5 + 0.5 * grado * brillo : 0.5
      });
    });
    var nodosRojos = shortcut ? {
      6: true,
      8: true
    } : {};
    var nodos = CEREBRO_NODOS.map(function (p, i) {
      var rojo = nodosRojos[i];
      var vivo = nodosVivos[i];
      var r = (rojo ? 18 : vivo ? 17 : 13) + (vivo && !rojo ? pulso * 2 : 0);
      return /*#__PURE__*/React.createElement("circle", {
        key: 'n' + i,
        cx: p[0],
        cy: p[1],
        r: r,
        fill: rojo ? RED : vivo ? GRN : GRY,
        stroke: INK,
        strokeWidth: rojo || vivo ? 8 : 0,
        opacity: rojo || vivo ? 1 : 0.6
      });
    });
    var atajo = shortcut ? /*#__PURE__*/React.createElement("path", {
      d: "M 300 152 C 236 244, 248 396, 300 480",
      fill: "none",
      stroke: RED,
      strokeWidth: 26,
      strokeLinecap: "round",
      opacity: 0.82 + 0.18 * pulso
    }) : null;
    var W = 620,
      H = 600;
    var espejo = props.mirror ? 'translate(' + W + ',0) scale(-1,1)' : undefined;
    return /*#__PURE__*/React.createElement(Svg, {
      w: W,
      h: H,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("g", {
      transform: espejo
    }, /*#__PURE__*/React.createElement("path", {
      d: CEREBRO_CONTORNO,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 17,
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: CEREBRO_SURCO,
      fill: "none",
      stroke: GRY,
      strokeWidth: 13,
      strokeLinecap: "round"
    }), CEREBRO_PLIEGUES.map(function (d, i) {
      return /*#__PURE__*/React.createElement("path", {
        key: 'p' + i,
        d: d,
        fill: "none",
        stroke: GRY,
        strokeWidth: 12,
        strokeLinecap: "round"
      });
    }), aristas, atajo, nodos));
  }

  /* ---------------- Figura ---------------- */

  function Figura(props) {
    var s = props.s == null ? 1 : props.s;
    var slump = clamp(props.slump == null ? 0 : props.slump, 0, 1);
    var arriba = props.posture === 'up' || props.posture === 'arriba';

    // la cadera queda fija: al hundirse, la cabeza baja y la espalda se curva
    var cadera = 246;
    var cabezaY = 56 + 46 * slump;
    var cabezaX = 115 + 30 * slump;
    var hombroY = cabezaY + 52;
    var hombroX = 115 + 20 * slump;
    var curva = 115 + 34 * slump;
    var brazoFinX = arriba ? 42 : 56 + 22 * slump;
    var brazoFinY = arriba ? 58 : 200 + 34 * slump;
    var ctrlY = arriba ? hombroY - 46 : hombroY + 40 + 16 * slump;
    var ctrlX = arriba ? 66 : 44 + 26 * slump;
    return /*#__PURE__*/React.createElement(Svg, {
      w: 230,
      h: 380,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement(T0, {
      sw: 15,
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + hombroX + ' ' + (cabezaY + 44) + ' Q ' + curva + ' ' + (cabezaY + 44 + cadera) / 2 + ' 115 ' + cadera
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + hombroX + ' ' + hombroY + ' Q ' + ctrlX + ' ' + ctrlY + ' ' + brazoFinX + ' ' + brazoFinY
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + hombroX + ' ' + hombroY + ' Q ' + (230 - ctrlX) + ' ' + ctrlY + ' ' + (230 - brazoFinX) + ' ' + brazoFinY
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 115 246 L 62 350"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 115 246 L 168 350"
    })), /*#__PURE__*/React.createElement("circle", {
      cx: cabezaX,
      cy: cabezaY,
      r: 43,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    }));
  }

  /* ---------------- Escritorio ---------------- */

  function Escritorio(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      w: 560,
      h: 150,
      s: props.s == null ? 1 : props.s,
      style: props.style
    }, /*#__PURE__*/React.createElement(T0, {
      sw: 15
    }, /*#__PURE__*/React.createElement("rect", {
      x: 12,
      y: 12,
      width: 536,
      height: 46,
      rx: 12
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 78 58 L 78 138",
      fill: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 482 58 L 482 138",
      fill: "none"
    })));
  }

  /* ---------------- Corazon ---------------- */

  function Corazon(props) {
    var s = props.s == null ? 1 : props.s;
    var beat = props.beat == null ? 1 : props.beat;
    return /*#__PURE__*/React.createElement(Svg, {
      w: 110,
      h: 100,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("g", {
      transform: 'translate(55,52) scale(' + beat + ') translate(-55,-52)'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 55 92 C 12 62, 4 34, 22 18 C 38 4, 55 14, 55 28 C 55 14, 72 4, 88 18 C 106 34, 98 62, 55 92 Z",
      fill: props.color || RED,
      stroke: INK,
      strokeWidth: 13,
      strokeLinejoin: "round",
      strokeLinecap: "round"
    })));
  }

  /* ---------------- Pesa ---------------- */

  function Pesa(props) {
    var s = props.s == null ? 1 : props.s;
    var tilt = props.tilt == null ? 0 : props.tilt;
    return /*#__PURE__*/React.createElement(Svg, {
      w: 420,
      h: 160,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("g", {
      transform: 'rotate(' + tilt + ' 210 80)'
    }, /*#__PURE__*/React.createElement(T0, {
      sw: 14
    }, /*#__PURE__*/React.createElement("rect", {
      x: 26,
      y: 64,
      width: 368,
      height: 32,
      rx: 14
    }), /*#__PURE__*/React.createElement("rect", {
      x: 102,
      y: 26,
      width: 44,
      height: 108,
      rx: 12
    }), /*#__PURE__*/React.createElement("rect", {
      x: 274,
      y: 26,
      width: 44,
      height: 108,
      rx: 12
    }), /*#__PURE__*/React.createElement("rect", {
      x: 44,
      y: 44,
      width: 40,
      height: 72,
      rx: 12
    }), /*#__PURE__*/React.createElement("rect", {
      x: 336,
      y: 44,
      width: 40,
      height: 72,
      rx: 12
    }))));
  }

  /* ---------------- Basurita ---------------- */

  function Basurita(props) {
    var s = props.s == null ? 1 : props.s;
    var kind = props.kind || 'scroll';
    var dentro = null;
    if (kind === 'scroll') {
      dentro = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
        x: 36,
        y: 24,
        width: 48,
        height: 72,
        rx: 8,
        fill: BLANCO,
        stroke: INK,
        strokeWidth: 12,
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("g", {
        stroke: INK,
        strokeWidth: 10,
        strokeLinecap: "round",
        fill: "none"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M 48 44 L 72 44"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M 48 60 L 72 60"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M 48 76 L 64 76"
      })));
    } else if (kind === 'like') {
      dentro = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
        cx: 60,
        cy: 60,
        r: 33,
        fill: RED,
        stroke: INK,
        strokeWidth: 12
      }), /*#__PURE__*/React.createElement("path", {
        d: "M 60 78 C 42 66, 39 52, 47 45 C 54 39, 60 44, 60 50 C 60 44, 66 39, 73 45 C 81 52, 78 66, 60 78 Z",
        fill: BLANCO,
        stroke: "none"
      }));
    } else if (kind === 'bell') {
      dentro = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
        x: 28,
        y: 28,
        width: 64,
        height: 64,
        rx: 10,
        fill: YEL,
        stroke: INK,
        strokeWidth: 12,
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("text", {
        x: 60,
        y: 80,
        textAnchor: "middle",
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 50,
        fill: INK
      }, "!"));
    } else {
      dentro = /*#__PURE__*/React.createElement("text", {
        x: 60,
        y: 80,
        textAnchor: "middle",
        fontFamily: "'Courier Prime', monospace",
        fontSize: 54,
        fontWeight: "700",
        fill: INK
      }, '>>');
    }
    return /*#__PURE__*/React.createElement(Svg, {
      w: 120,
      h: 120,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("rect", {
      x: 9,
      y: 9,
      width: 102,
      height: 102,
      rx: 16,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14,
      strokeLinejoin: "round"
    }), dentro);
  }

  /* ---------------- Rotulo (el unico texto del lienzo) ---------------- */

  function Rotulo(props) {
    var s = props.s == null ? 1 : props.s;
    var txt = String(props.text == null ? '' : props.text).toUpperCase();
    var dir = props.dir === 'left' ? 'left' : 'right';
    var anchoTexto = Math.max(120, txt.length * 30);
    var punta = 46;
    var W = anchoTexto + 64 + punta;
    var H = 96;
    var barraX = dir === 'right' ? 0 : punta;
    var barraW = W - punta;
    var flecha = dir === 'right' ? W - punta + ',' + (H / 2 - 34) + ' ' + W + ',' + H / 2 + ' ' + (W - punta) + ',' + (H / 2 + 34) : punta + ',' + (H / 2 - 34) + ' 0,' + H / 2 + ' ' + punta + ',' + (H / 2 + 34);
    return /*#__PURE__*/React.createElement(Svg, {
      w: W,
      h: H,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("rect", {
      x: barraX,
      y: 14,
      width: barraW,
      height: 68,
      rx: 9,
      fill: INK
    }), /*#__PURE__*/React.createElement("polygon", {
      points: flecha,
      fill: INK
    }), /*#__PURE__*/React.createElement("text", {
      x: barraX + barraW / 2,
      y: 64,
      textAnchor: "middle",
      fontFamily: "'Barlow Semi Condensed', sans-serif",
      fontSize: 54,
      fontWeight: 700,
      letterSpacing: 1.5,
      fill: BLANCO
    }, txt));
  }

  /* ---------------- Nube de pensamiento ---------------- */

  var NUBE_CONTORNO = 'M 168 292 C 88 296, 58 236, 110 198 C 88 148, 142 100, 196 116 ' + 'C 212 58, 302 44, 342 90 C 392 54, 472 76, 482 132 ' + 'C 548 142, 562 212, 510 242 C 548 292, 496 342, 436 326 ' + 'C 404 376, 320 382, 286 342 C 232 366, 172 344, 168 292 Z';
  function Nube(props) {
    var s = props.s == null ? 1 : props.s;
    var W = 620,
      H = 460;
    return /*#__PURE__*/React.createElement("div", {
      style: Object.assign({
        position: 'relative',
        width: W * s,
        height: H * s
      }, props.style || {})
    }, /*#__PURE__*/React.createElement(Svg, {
      w: W,
      h: H,
      s: s
    }, /*#__PURE__*/React.createElement("path", {
      d: NUBE_CONTORNO,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 17,
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 126,
      cy: 382,
      r: 30,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 68,
      cy: 432,
      r: 19,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 12
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: W * s,
        height: 300 * s,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, props.children));
  }

  /* ---------------- Parlante ---------------- */

  function Parlante(props) {
    var s = props.s == null ? 1 : props.s;
    var wob = props.wob == null ? 0 : props.wob;
    return /*#__PURE__*/React.createElement(Svg, {
      w: 220,
      h: 230,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("g", {
      transform: 'rotate(' + wob + ' 92 200)'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 26 176 L 158 176 L 142 224 L 42 224 Z",
      fill: GRY,
      stroke: INK,
      strokeWidth: 14,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 34 176 C 40 128, 66 108, 92 108 C 118 108, 144 128, 150 176 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 92,
      cy: 62,
      r: 40,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 166 42 C 188 62, 188 94, 166 114",
      fill: "none",
      stroke: INK,
      strokeWidth: 13,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 190 22 C 222 54, 222 102, 190 134",
      fill: "none",
      stroke: GRY,
      strokeWidth: 13,
      strokeLinecap: "round"
    })));
  }

  /* ---------------- Tacha ---------------- */

  function Tacha(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      w: 230,
      h: 230,
      s: props.s == null ? 1 : props.s,
      style: props.style
    }, /*#__PURE__*/React.createElement("g", {
      stroke: RED,
      strokeWidth: 18,
      strokeLinecap: "round",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 40 40 L 190 190"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 190 40 L 40 190"
    })));
  }

  /* ---------------- Visto ---------------- */

  var VISTO_LARGO = 252;
  function Visto(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    return /*#__PURE__*/React.createElement(Svg, {
      w: 220,
      h: 200,
      s: props.s == null ? 1 : props.s,
      style: props.style
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 28 108 L 86 166 L 192 34",
      fill: "none",
      stroke: GRN,
      strokeWidth: 24,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: VISTO_LARGO,
      strokeDashoffset: VISTO_LARGO * (1 - p)
    }));
  }

  /* ---------------- Telefono ---------------- */

  function Telefono(props) {
    var s = props.s == null ? 1 : props.s;
    var W = 340,
      H = 600;
    var sx = 34,
      sy = 76,
      sw = 272,
      sh = 428;
    return /*#__PURE__*/React.createElement("div", {
      style: Object.assign({
        position: 'relative',
        width: W * s,
        height: H * s
      }, props.style || {})
    }, /*#__PURE__*/React.createElement(Svg, {
      w: W,
      h: H,
      s: s
    }, /*#__PURE__*/React.createElement("rect", {
      x: 10,
      y: 10,
      width: 320,
      height: 580,
      rx: 46,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 17,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: sx,
      y: sy,
      width: sw,
      height: sh,
      rx: 10,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 11,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 134 44 L 206 44",
      stroke: INK,
      strokeWidth: 13,
      strokeLinecap: "round",
      fill: "none"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 170,
      cy: 548,
      r: 23,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 12
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: sx * s,
        top: sy * s,
        width: sw * s,
        height: sh * s,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, props.children));
  }

  /* ---------------- Caballo ---------------- */

  function Caballo(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      w: 220,
      h: 210,
      s: props.s == null ? 1 : props.s,
      style: props.style
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 36 202 C 40 158, 48 122, 74 100 C 96 88, 118 88, 136 98 C 168 110, 196 130, 206 154 C 212 170, 198 181, 180 176 C 158 183, 128 185, 102 178 C 76 194, 54 204, 36 202 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14,
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 66 96 L 56 30 L 94 78 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 13,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 102 84 L 116 22 L 132 100 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 13,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 80 108 C 62 138, 54 172, 50 198",
      fill: "none",
      stroke: INK,
      strokeWidth: 12,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 108 108 C 92 134, 84 164, 82 190",
      fill: "none",
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 152,
      cy: 126,
      r: 9,
      fill: INK
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 192,
      cy: 160,
      r: 7,
      fill: INK
    }));
  }

  /* ---------------- Gallina ---------------- */

  function Gallina(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      w: 210,
      h: 200,
      s: props.s == null ? 1 : props.s,
      style: props.style
    }, /*#__PURE__*/React.createElement("g", {
      stroke: INK,
      strokeWidth: 12,
      strokeLinecap: "round",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 96 158 L 96 188 M 82 188 L 110 188"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 136 158 L 136 188 M 122 188 L 150 188"
    })), /*#__PURE__*/React.createElement("path", {
      d: "M 176 118 C 200 96, 202 66, 186 52 C 190 82, 176 96, 158 104 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 13,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 112,
      cy: 122,
      rx: 68,
      ry: 52,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 100 112 C 128 100, 152 112, 154 134 C 132 146, 106 138, 100 112 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 12,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 40 48 C 44 30, 56 30, 58 44 C 64 26, 78 28, 78 46 Z",
      fill: RED,
      stroke: INK,
      strokeWidth: 11,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 60,
      cy: 76,
      r: 31,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 30 68 L 4 82 L 30 92 Z",
      fill: YEL,
      stroke: INK,
      strokeWidth: 11,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 54,
      cy: 68,
      r: 7,
      fill: INK
    }));
  }

  /* ---------------- Risa ---------------- */

  function Risa(props) {
    return /*#__PURE__*/React.createElement(Svg, {
      w: 210,
      h: 210,
      s: props.s == null ? 1 : props.s,
      style: props.style
    }, /*#__PURE__*/React.createElement("circle", {
      cx: 105,
      cy: 105,
      r: 88,
      fill: YEL,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("g", {
      stroke: INK,
      strokeWidth: 13,
      strokeLinecap: "round",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 52 80 C 62 58, 84 58, 94 80"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 116 80 C 126 58, 148 58, 158 80"
    })), /*#__PURE__*/React.createElement("path", {
      d: "M 50 118 C 72 176, 138 176, 160 118 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 13,
      strokeLinejoin: "round"
    }));
  }

  /* ---------------- Flecha ---------------- */

  function Flecha(props) {
    var s = props.s == null ? 1 : props.s;
    var color = props.color || INK;
    var dir = props.dir || 'right';
    var rot = dir === 'left' ? 180 : dir === 'down' ? 90 : 0;
    return /*#__PURE__*/React.createElement(Svg, {
      w: 260,
      h: 90,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("g", {
      transform: 'rotate(' + rot + ' 130 45)'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 16 45 L 196 45",
      fill: "none",
      stroke: color,
      strokeWidth: 18,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: "188,12 250,45 188,78",
      fill: color,
      stroke: color,
      strokeWidth: 10,
      strokeLinejoin: "round"
    })));
  }

  /* ---------------- Medidor ---------------- */

  function Medidor(props) {
    var s = props.s == null ? 1 : props.s;
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    var shake = props.shake == null ? 0 : props.shake;
    var beat = props.beat == null ? 1 : props.beat;
    var color = p > 0.55 ? GRN : p > 0.25 ? YEL : RED;
    var x0 = 30,
      ancho = 34,
      hueco = 7,
      n = 6;
    var lleno = p * n;
    var segs = [];
    for (var i = 0; i < n; i++) {
      var frac = clamp(lleno - i, 0, 1);
      if (frac <= 0.02) continue;
      segs.push(/*#__PURE__*/React.createElement("rect", {
        key: 's' + i,
        x: x0 + i * (ancho + hueco),
        y: 28,
        width: ancho * frac,
        height: 52,
        rx: 5,
        fill: color,
        stroke: "none"
      }));
    }
    return /*#__PURE__*/React.createElement(Svg, {
      w: 300,
      h: 108,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + shake + ',0) translate(150,54) scale(' + beat + ') translate(-150,-54)'
    }, /*#__PURE__*/React.createElement("rect", {
      x: 10,
      y: 10,
      width: 258,
      height: 88,
      rx: 14,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: 272,
      y: 36,
      width: 20,
      height: 36,
      rx: 7,
      fill: INK
    }), segs));
  }

  /* ---------------- Meta ---------------- */

  function Meta(props) {
    var s = props.s == null ? 1 : props.s;
    var float = props.float == null ? 0 : props.float;
    var dim = !!props.dim;
    var trazo = dim ? GRY : INK;
    var centro = dim ? GRY : YEL;
    return /*#__PURE__*/React.createElement(Svg, {
      w: 300,
      h: 300,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("g", {
      transform: 'translate(0,' + float + ')',
      opacity: dim ? 0.75 : 1
    }, /*#__PURE__*/React.createElement("circle", {
      cx: 150,
      cy: 150,
      r: 134,
      fill: BLANCO,
      stroke: trazo,
      strokeWidth: 16
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 150,
      cy: 150,
      r: 92,
      fill: BLANCO,
      stroke: trazo,
      strokeWidth: 16
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 150,
      cy: 150,
      r: 50,
      fill: centro,
      stroke: trazo,
      strokeWidth: 16
    })));
  }

  /* ---------------- Reloj ---------------- */

  function Reloj(props) {
    var s = props.s == null ? 1 : props.s;
    var T = props.T == null ? 0 : props.T;
    var speed = props.speed == null ? 1 : props.speed;
    var hora = T * 60 * speed;
    var seg = T * 300 * speed;
    return /*#__PURE__*/React.createElement(Svg, {
      w: 240,
      h: 240,
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("circle", {
      cx: 120,
      cy: 120,
      r: 104,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("g", {
      stroke: INK,
      strokeWidth: 13,
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 120 32 L 120 54"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 208 120 L 186 120"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 120 208 L 120 186"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 32 120 L 54 120"
    })), /*#__PURE__*/React.createElement("g", {
      transform: 'rotate(' + hora + ' 120 120)'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 120 120 L 120 62",
      stroke: INK,
      strokeWidth: 15,
      strokeLinecap: "round",
      fill: "none"
    })), /*#__PURE__*/React.createElement("g", {
      transform: 'rotate(' + seg + ' 120 120)'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 120 120 L 120 44",
      stroke: RED,
      strokeWidth: 9,
      strokeLinecap: "round",
      fill: "none"
    })), /*#__PURE__*/React.createElement("circle", {
      cx: 120,
      cy: 120,
      r: 11,
      fill: INK
    }));
  }

  /* ---------------- Bombillo ---------------- */

  function Bombillo(props) {
    var s = props.s == null ? 1 : props.s;
    var on = clamp(props.on == null ? 0 : props.on, 0, 1);
    var rayos = [];
    if (on > 0.02) {
      for (var i = 0; i < 6; i++) {
        var a = (-150 + i * 60) * Math.PI / 180;
        var cx = 100,
          cy = 98;
        rayos.push(/*#__PURE__*/React.createElement("path", {
          key: 'r' + i,
          d: 'M ' + (cx + Math.cos(a) * 88) + ' ' + (cy + Math.sin(a) * 88) + ' L ' + (cx + Math.cos(a) * 122) + ' ' + (cy + Math.sin(a) * 122),
          stroke: YEL,
          strokeWidth: 14,
          strokeLinecap: "round",
          fill: "none",
          opacity: on
        }));
      }
    }
    return /*#__PURE__*/React.createElement(Svg, {
      w: 200,
      h: 260,
      s: s,
      style: props.style
    }, rayos, /*#__PURE__*/React.createElement("circle", {
      cx: 100,
      cy: 98,
      r: 68,
      fill: on > 0.5 ? YEL : BLANCO,
      stroke: INK,
      strokeWidth: 15,
      opacity: 1
    }), on > 0.02 && on <= 0.5 ? /*#__PURE__*/React.createElement("circle", {
      cx: 100,
      cy: 98,
      r: 68,
      fill: YEL,
      stroke: "none",
      opacity: on * 1.6
    }) : null, /*#__PURE__*/React.createElement("path", {
      d: "M 76 160 L 124 160",
      stroke: INK,
      strokeWidth: 13,
      strokeLinecap: "round",
      fill: "none"
    }), /*#__PURE__*/React.createElement("rect", {
      x: 68,
      y: 168,
      width: 64,
      height: 48,
      rx: 8,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 68 190 L 132 190",
      stroke: INK,
      strokeWidth: 10,
      fill: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 84 216 L 116 216 L 108 240 L 92 240 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 12,
      strokeLinejoin: "round"
    }));
  }

  /* ---------------- Trazo (linea que avanza sobre todo el lienzo) ---------------- */

  function Trazo(props) {
    var p = clamp(props.p == null ? 0 : props.p, 0, 1);
    if (p < 0.045) return null; // sin punto huerfano al abrir ni al cerrar
    var x0 = props.x0 == null ? 200 : props.x0;
    var x1 = props.x1 == null ? 1700 : props.x1;
    var y = props.y == null ? 540 : props.y;
    var shake = props.shake == null ? 0 : props.shake;
    var color = props.color || INK;
    var xp = x0 + (x1 - x0) * p;
    var signo = x1 >= x0 ? 1 : -1;
    var punta = 46 * signo;
    return /*#__PURE__*/React.createElement("svg", {
      width: 1920,
      height: 1080,
      viewBox: "0 0 1920 1080",
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("g", {
      transform: 'translate(0,' + shake + ')'
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + x0 + ' ' + y + ' L ' + (xp - punta * 0.7) + ' ' + y,
      stroke: color,
      strokeWidth: 18,
      strokeLinecap: "round",
      fill: "none"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: xp - punta + ',' + (y - 30) + ' ' + xp + ',' + y + ' ' + (xp - punta) + ',' + (y + 30),
      fill: color,
      stroke: color,
      strokeWidth: 10,
      strokeLinejoin: "round"
    })));
  }

  /* ---------------- export ---------------- */

  var P = {
    C: C,
    Cerebro: Cerebro,
    Figura: Figura,
    Escritorio: Escritorio,
    Corazon: Corazon,
    Pesa: Pesa,
    Basurita: Basurita,
    Rotulo: Rotulo,
    Nube: Nube,
    Parlante: Parlante,
    Tacha: Tacha,
    Visto: Visto,
    Telefono: Telefono,
    Caballo: Caballo,
    Gallina: Gallina,
    Risa: Risa,
    Flecha: Flecha,
    Medidor: Medidor,
    Meta: Meta,
    Reloj: Reloj,
    Bombillo: Bombillo,
    Trazo: Trazo
  };
  global.M = M;
  global.P = P;
})(window);
