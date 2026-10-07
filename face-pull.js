/* GENERADO por compilar.js desde face-pull.jsx — no editar a mano. */
/* ============================================================
   FACE PULL — reel vertical 1080x1920 (~58 s) para poner voz encima
   Fuente tecnica: libro de biomecanica, pag. 90. Polea a la altura
   del pecho, tension desde el inicio, hombros abajo, codos altos,
   rotacion externa al final, vuelta controlada.

   Cada escena sigue la regla de f(fraccion): si cambias una duracion
   (en ESCENAS o en la lista de la pagina) la coreografia se estira o
   se encoge sola, para calzar con la locucion grabada.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var M = global.M,
    P = global.P,
    B = global.B;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var ANCHO = 1080,
    ALTO = 1920;

  /* ---------------- ayudas ---------------- */

  // lo inverso de M.pop: nada se va de golpe
  function sale(T, cuando, dur) {
    if (dur == null) dur = 0.3;
    var k = animate({
      from: 1,
      to: 0,
      start: cuando,
      end: cuando + dur,
      ease: Easing.easeInCubic
    })(T);
    return {
      opacity: k,
      scale: 0.55 + 0.45 * k
    };
  }
  function junta(a, b) {
    return {
      opacity: a.opacity * b.opacity,
      scale: (a.scale == null ? 1 : a.scale) * (b.scale == null ? 1 : b.scale),
      x: a.x
    };
  }

  // repeticiones 0 -> 1 -> 0 entre a y b; n = 1.5 termina arriba
  function reps(T, a, b, n) {
    if (T <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a));
    return 0.5 - 0.5 * Math.cos(u * n * Math.PI * 2);
  }

  // caja absoluta: entra con pop o slide, respira y puede temblar
  function Pos(props) {
    var e = props.e || {
      opacity: 1,
      scale: 1
    };
    var sc = e.scale == null ? 1 : e.scale;
    var dx = (e.x || 0) + (props.dx || 0);
    var dy = props.dy || 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: props.x,
        top: props.y,
        opacity: e.opacity,
        transformOrigin: props.origen || '50% 50%',
        transform: 'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px) scale(' + sc.toFixed(4) + ')'
      }
    }, props.children);
  }
  function anchoRotulo(txt) {
    return Math.max(120, String(txt).length * 30) + 64 + 46;
  }

  // rotulo centrado en x salvo que se pida otra posicion
  function Rot(props) {
    var s = props.s || 1.1;
    var w = anchoRotulo(props.text) * s;
    var x = props.x == null ? (ANCHO - w) / 2 : props.x;
    return /*#__PURE__*/React.createElement(Pos, {
      x: x,
      y: props.y,
      e: props.e,
      dy: M.life(props.T, 3.4, 5, props.fase || 0)
    }, /*#__PURE__*/React.createElement(P.Rotulo, {
      text: props.text,
      dir: props.dir || 'right',
      s: s
    }));
  }

  // camara: escala alrededor de foco y lo deja en mira
  function Camara(props) {
    var z = props.zoom == null ? 1 : props.zoom;
    var f = props.foco || [ANCHO / 2, ALTO / 2];
    var m = props.mira || f;
    var tx = m[0] - z * f[0],
      ty = m[1] - z * f[1];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        transformOrigin: '0 0',
        transform: 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + z.toFixed(4) + ')'
      }
    }, props.children);
  }

  // ventana que muestra solo una franja de una pieza (para las comparaciones)
  function Recorte(props) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: props.x,
        top: props.y,
        width: props.w,
        height: props.h,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: -props.desde
      }
    }, props.children));
  }

  // donde caen las piezas grandes en el lienzo
  var ESP = {
    x: -10,
    y: 400,
    s: 1
  }; // espalda grande
  var EST = {
    x: -60,
    y: 340,
    s: 0.95
  }; // estacion lateral
  var JUICIO = [800, 930]; // donde caen la X y el visto junto a la espalda
  function enLienzo(base, p) {
    return [base.x + p[0] * base.s, base.y + p[1] * base.s];
  }

  // recorrido de la mano de perfil, para dibujar la trayectoria
  function trayectoria(rotK) {
    var pts = [];
    for (var i = 0; i <= 24; i++) {
      var q = i / 24;
      pts.push(B.geoEstacion({
        p: q,
        rot: rotK * q
      }).H);
    }
    return pts;
  }
  function flechasHombro(g, color, sube, p, opacity) {
    var lados = [g.izq.A, g.der.A];
    return lados.map(function (A, i) {
      var a = sube ? U.suma(A, [0, -34]) : U.suma(A, [0, -176]);
      var b = sube ? U.suma(A, [0, -160]) : U.suma(A, [0, -50]);
      return /*#__PURE__*/React.createElement(B.FlechaS, {
        key: 'fh' + i,
        a: a,
        b: b,
        p: p,
        opacity: opacity,
        color: color
      });
    });
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: lo hace mal, X roja; un cambio chico y se enciende */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var codo = T < f(0.42) ? reps(T, f(0.02), f(0.42), 1.5) : 1;
    var cambio = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.68),
      ease: Easing.easeInOutCubic
    })(T);
    var enc = codo * 0.9 * (1 - cambio);
    var brillo = animate({
      from: 0,
      to: 1,
      start: f(0.62),
      end: f(0.72)
    })(T);
    var falla = enc > 0.45 ? M.vibra(T, 44, 3) : 0;
    var zoom = 1 + 0.22 * animate({
      from: 0,
      to: 1,
      start: f(0.26),
      end: f(0.42),
      ease: Easing.easeInOutCubic
    })(T) - 0.22 * animate({
      from: 0,
      to: 1,
      start: f(0.52),
      end: f(0.66),
      ease: Easing.easeInOutCubic
    })(T) + 0.04 * t;
    var fig = M.pop(T, at - 0.6, 0.5);
    var tacha = junta(M.pop(T, f(0.4), 0.4), sale(T, f(0.55)));
    var visto = M.pop(T, f(0.7), 0.45);
    var titulo = M.pop(T, f(0.03), 0.45);
    var pregunta = M.pop(T, f(0.8), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: enLienzo(ESP, [352, 392])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: ESP.x,
      y: ESP.y,
      e: fig,
      dx: falla,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: ESP.s,
      piernas: true,
      codo: codo,
      rot: cambio,
      enc: enc,
      musc: {
        trapRojo: enc,
        dp: brillo,
        inf: brillo,
        rm: brillo
      }
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: JUICIO[1],
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: JUICIO[1],
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.7,
      p: M.draw(T, f(0.7), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "FACE PULL",
      s: 1.5,
      y: 290,
      e: titulo
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "\xBFLO HACES BIEN?",
      y: 1540,
      e: pregunta,
      fase: 0.4
    }));
  }

  /* 2 — polea: sube, baja y se queda a la altura del pecho */
  function EscPolea(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var poleaY = T < f(0.24) ? animate({
      from: 760,
      to: 230,
      start: f(0.02),
      end: f(0.24),
      ease: Easing.easeInOutCubic
    })(T) : animate({
      from: 230,
      to: B.PECHO_Y,
      start: f(0.24),
      end: f(0.5),
      ease: Easing.easeOutBack
    })(T);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.02),
      end: f(0.14)
    })(T);
    var linea = M.draw(T, f(0.5), 0.5);
    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.74), 0.45);
    var rotulo = M.pop(T, f(0.56), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [540, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: EST.x,
      y: EST.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Estacion, {
      s: EST.s,
      paso: 0,
      suelta: true,
      poleaY: poleaY,
      tension: 0
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
        c: g.rueda,
        r: 64,
        p: anillo,
        color: C.YEL
      }), /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [g.pecho, [g.rueda[0] + 46, B.PECHO_Y]],
        p: linea,
        color: C.YEL,
        sw: 17
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 330,
      y: 560,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.74), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ALTURA DEL PECHO",
      y: 250,
      e: rotulo,
      dir: "left"
    }));
  }

  /* 3 — tension: un paso atras y el cable pasa de flojo a tenso */
  function EscTension(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var paso = animate({
      from: 0,
      to: 1,
      start: f(0.12),
      end: f(0.56),
      ease: Easing.linear
    })(T);
    var tension = Math.pow(paso, 1.4);
    var tenso = T >= f(0.56);
    var tiron = tenso ? M.vibra(T, 44, 3) * (1 - clamp((T - f(0.56)) / (dur * 0.08), 0, 1)) : 0;
    var flecha = M.draw(T, f(0.08), 0.5);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rotulo = M.pop(T, f(0.6), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [540, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: EST.x,
      y: EST.y,
      e: fig,
      dy: M.life(T, 3.6, 4) + tiron
    }, /*#__PURE__*/React.createElement(B.Estacion, {
      s: EST.s,
      paso: paso,
      tension: tension,
      cable: tenso ? 'yel' : null,
      carga: 0.12 * tension
    }, function () {
      return /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [870, 1310],
        b: [1090, 1310],
        p: flecha,
        color: C.INK
      });
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "TENSI\xD3N DESDE EL INICIO",
      s: 1,
      y: 250,
      e: rotulo
    }));
  }

  /* 4 — hombros: arriba (mal, vibra) -> abajo y escapulas juntas */
  function EscHombros(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var baja = animate({
      from: 0,
      to: 1,
      start: f(0.36),
      end: f(0.56),
      ease: Easing.easeInOutCubic
    })(T);
    var enc = 1 - baja;
    var ret = animate({
      from: 0,
      to: 1,
      start: f(0.46),
      end: f(0.66),
      ease: Easing.easeInOutCubic
    })(T);
    var falla = enc > 0.5 ? M.vibra(T, 44, 3) : 0;
    var pRojas = M.draw(T, f(0.04), 0.3);
    var oRojas = sale(T, f(0.34)).opacity;
    var pVerdes = M.draw(T, f(0.42), 0.3);
    var pJuntas = M.draw(T, f(0.52), 0.3);
    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.72), 0.45);
    var rotulo = M.pop(T, f(0.6), 0.45);
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
      dx: falla,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: ESP.s,
      piernas: true,
      codo: 0,
      enc: enc,
      ret: ret,
      musc: {
        trapRojo: enc
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, flechasHombro(g, C.RED, true, pRojas, oRojas), flechasHombro(g, C.GRN, false, pVerdes), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [284, 520],
        b: [414, 520],
        p: pJuntas,
        color: C.GRN
      }), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [816, 520],
        b: [686, 520],
        p: pJuntas,
        color: C.GRN
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: JUICIO[1],
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.72), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "HOMBROS ABAJO",
      y: 300,
      e: rotulo
    }));
  }

  /* 5 — tiron: la mano viaja a la cara, el codo sube a la linea del hombro */
  function EscTiron(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var ida1 = animate({
      from: 0,
      to: 1,
      start: f(0.06),
      end: f(0.4),
      ease: Easing.easeInOutSine
    })(T);
    var vuelta = animate({
      from: 0,
      to: 1,
      start: f(0.56),
      end: f(0.74),
      ease: Easing.easeInOutSine
    })(T);
    var ida2 = animate({
      from: 0,
      to: 1,
      start: f(0.76),
      end: f(0.96),
      ease: Easing.easeInOutSine
    })(T);
    var p = ida1 - vuelta + ida2;
    var ROT = 0.55;
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0),
      end: f(0.22),
      ease: Easing.easeInOutCubic
    })(T);
    var zoom = 1 + 0.45 * acerca + 0.03 * t;
    var foco = [700, 700];
    var mira = U.lerpP(foco, [540, 900], acerca);
    var linea = M.draw(T, f(0.2), 0.45);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.12),
      end: f(0.2)
    })(T);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rotulo = M.pop(T, f(0.3), 0.45);
    var tray = trayectoria(ROT);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: foco,
      mira: mira
    }, /*#__PURE__*/React.createElement(Pos, {
      x: EST.x,
      y: EST.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Estacion, {
      s: EST.s,
      p: p,
      rot: ROT * p
    }, function (g) {
      var alto = p > 0.9;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: tray,
        p: ida1,
        color: C.YEL,
        sw: 17
      }), /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [[g.Sj[0] - 250, g.Sj[1]], [g.Sj[0] + 200, g.Sj[1]]],
        p: linea,
        color: alto ? C.GRN : C.GRY,
        sw: 15
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: g.E,
        r: 50,
        p: anillo,
        color: alto ? C.GRN : C.YEL
      }));
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS ALTOS",
      y: 250,
      e: rotulo
    }));
  }

  /* 6 — la parte importante: tirar derecho (mal) -> zoom -> rotacion externa */
  function EscRotacion(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var codo = animate({
      from: 0,
      to: 1,
      start: f(0.02),
      end: f(0.2),
      ease: Easing.easeInOutCubic
    })(T);
    var rot = animate({
      from: 0,
      to: 1,
      start: f(0.46),
      end: f(0.64),
      ease: Easing.easeInOutCubic
    })(T);
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.28),
      end: f(0.42),
      ease: Easing.easeInOutCubic
    })(T);
    var aleja = animate({
      from: 0,
      to: 1,
      start: f(0.7),
      end: f(0.8),
      ease: Easing.easeInOutCubic
    })(T);
    var k = acerca * (1 - aleja);
    var foco = enLienzo(ESP, [300, 320]);
    var zoom = 1 + 0.75 * k + 0.03 * t;
    var mira = U.lerpP(foco, [540, 900], k);
    var tacha = junta(M.pop(T, f(0.2), 0.4), sale(T, f(0.34)));
    var fantasma = junta(M.pop(T, f(0.42), 0.3), sale(T, f(0.72))).opacity;
    var lados = M.draw(T, f(0.76), 0.4);
    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.84), 0.45);
    var rotulo = M.pop(T, f(0.47), 0.45);

    // el antebrazo sin rotar, para dejarlo como fantasma
    var antes = B.geoEspalda({
      codo: 1,
      rot: 0
    });
    var angAhora = U.lerp(-10, -42, rot);
    var barrido = rot > 0.12; // el arco aparece recien cuando el antebrazo ya giro
    var oArco = clamp((rot - 0.12) / 0.15, 0, 1);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: foco,
      mira: mira
    }, /*#__PURE__*/React.createElement(Pos, {
      x: ESP.x,
      y: ESP.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: ESP.s,
      piernas: true,
      codo: codo,
      rot: rot,
      ret: codo
    }, function (g) {
      var L = g.izq,
        R = g.der;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [L.E, antes.izq.H],
        opacity: fantasma,
        color: C.GRY,
        sw: 18
      }), /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [R.E, antes.der.H],
        opacity: fantasma,
        color: C.GRY,
        sw: 18
      }), barrido ? /*#__PURE__*/React.createElement(B.Arco, {
        c: L.E,
        r: 270,
        a0: 6,
        a1: angAhora + 8,
        color: C.GRN,
        sw: 20,
        cabeza: 40,
        opacity: oArco
      }) : null, barrido ? /*#__PURE__*/React.createElement(B.Arco, {
        c: R.E,
        r: 270,
        a0: 174,
        a1: 172 - angAhora,
        color: C.GRN,
        sw: 20,
        cabeza: 40,
        opacity: oArco
      }) : null, /*#__PURE__*/React.createElement(B.FlechaS, {
        a: U.suma(L.H, [-30, -96]),
        b: U.suma(L.H, [-176, -96]),
        p: lados,
        color: C.GRN
      }), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: U.suma(R.H, [30, -96]),
        b: U.suma(R.H, [176, -96]),
        p: lados,
        color: C.GRN
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: JUICIO[1],
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.55
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: JUICIO[1],
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.84), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ROTACI\xD3N EXTERNA",
      y: 300,
      e: rotulo
    }));
  }

  /* 7 — musculos: se encienden de a uno, al ritmo de la voz */
  function EscMusculos(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var dp = animate({
      from: 0,
      to: 1,
      start: f(0.18),
      end: f(0.26)
    })(T);
    var inf = animate({
      from: 0,
      to: 1,
      start: f(0.36),
      end: f(0.44)
    })(T);
    var rm = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.58)
    })(T);
    var sec = animate({
      from: 0,
      to: 1,
      start: f(0.7),
      end: f(0.8)
    })(T);
    var ret = 0.75 + M.life(T, 2.6, 0.25);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.2), 0.45);
    var r2 = M.pop(T, f(0.46), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.08 * t,
      foco: [540, 980]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: ESP.x,
      y: ESP.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: ESP.s,
      piernas: true,
      codo: 1,
      rot: 1,
      ret: ret,
      musc: {
        dp: dp,
        inf: inf,
        rm: rm,
        tra: sec,
        rom: sec
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "DELTOIDES POSTERIOR",
      y: 300,
      e: r1,
      s: 1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "MANGUITO ROTADOR",
      y: 1530,
      e: r2,
      s: 1,
      fase: 0.4
    }));
  }

  /* 8 — vuelta: lenta, 3-2-1, la pila de discos baja suave */
  function EscVuelta(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var u = clamp((T - f(0.08)) / (f(0.86) - f(0.08)), 0, 1);
    var p = 1 - Easing.easeInOutSine(u);
    var n = u < 1 / 3 ? 3 : u < 2 / 3 ? 2 : 1;
    var anillo = u >= 1 ? 0 : 1 - u * 3 % 1;
    var baja = M.draw(T, f(0.12), 0.6);
    var fig = M.pop(T, at - 0.6, 0.5);
    var cuenta = M.pop(T, f(0.05), 0.45);
    var rotulo = M.pop(T, f(0.3), 0.45);
    var tray = trayectoria(1);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [540, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: EST.x,
      y: EST.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Estacion, {
      s: EST.s,
      p: p,
      rot: p
    }, function () {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: tray,
        color: C.GRY,
        sw: 15
      }), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [330, 860],
        b: [330, 1090],
        p: baja,
        color: C.GRN
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 340,
      y: 1060,
      e: cuenta,
      dy: M.life(T, 3, 5)
    }, /*#__PURE__*/React.createElement(B.Cuenta, {
      s: 0.95,
      n: n,
      p: anillo
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CONTROLA LA VUELTA",
      y: 250,
      e: rotulo
    }));
  }

  // comparacion arriba (mal) / abajo (bien): misma espalda, recortada
  var CMP = {
    s: 0.8,
    desde: 40,
    alto: 650,
    x: 100,
    yArriba: 350,
    yAbajo: 930
  };
  var JUICIO_CMP = [820, 330]; // X y visto, relativos a cada mitad

  function Mitad(props) {
    var s = CMP.s;
    return /*#__PURE__*/React.createElement(Pos, {
      x: 0,
      y: 0,
      e: props.e,
      dx: props.dx,
      dy: props.dy
    }, /*#__PURE__*/React.createElement(Recorte, {
      x: CMP.x,
      y: props.y,
      w: 1100 * s,
      h: CMP.alto * s,
      desde: CMP.desde * s
    }, props.children));
  }

  /* 9 — error 1: hombros que suben vs hombros abajo */
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var codo = reps(T, f(0.02), f(0.98), 2);
    var falla = codo > 0.5 ? M.vibra(T, 44, 3) : 0;
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.4), 0.45);
    var tacha = M.pop(T, f(0.16), 0.4);
    var visto = M.pop(T, f(0.58), 0.45);
    var r1 = M.pop(T, f(0.06), 0.45);
    var r2 = M.pop(T, f(0.46), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yArriba,
      e: arriba,
      dx: falla,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: CMP.s,
      codo: codo,
      rot: codo,
      enc: codo,
      musc: {
        trapRojo: codo
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, flechasHombro(g, C.RED, true, M.draw(T, f(0.1), 0.3)));
    })), /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: CMP.s,
      codo: codo,
      rot: codo,
      ret: codo
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, flechasHombro(g, C.GRN, false, M.draw(T, f(0.48), 0.3)));
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO_CMP[0],
      y: CMP.yArriba + JUICIO_CMP[1],
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.55
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO_CMP[0],
      y: CMP.yAbajo + JUICIO_CMP[1],
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.58), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "HOMBROS ARRIBA",
      y: 230,
      e: r1,
      s: 1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "HOMBROS ABAJO",
      y: 1470,
      e: r2,
      s: 1,
      fase: 0.4
    }));
  }

  /* 10 — error 2: terminar sin rotar vs rotacion externa */
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var rot = animate({
      from: 0,
      to: 1,
      start: f(0.22),
      end: f(0.52),
      ease: Easing.easeInOutCubic
    })(T);
    var angAhora = U.lerp(-10, -42, rot);
    var barrido = rot > 0.12; // el arco aparece recien cuando el antebrazo ya giro
    var oArco = clamp((rot - 0.12) / 0.15, 0, 1);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.12), 0.45);
    var tacha = M.pop(T, f(0.08), 0.4);
    var visto = M.pop(T, f(0.58), 0.45);
    var r1 = M.pop(T, f(0.04), 0.45);
    var r2 = M.pop(T, f(0.4), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yArriba,
      e: arriba,
      dx: M.vibra(T, 44, 2),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: CMP.s,
      codo: 1,
      rot: 0
    })), /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: CMP.s,
      codo: 1,
      rot: rot,
      ret: 1,
      musc: {
        dp: rot,
        inf: rot,
        rm: rot
      }
    }, function (g) {
      return barrido ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Arco, {
        c: g.izq.E,
        r: 270,
        a0: 6,
        a1: angAhora + 8,
        color: C.GRN,
        sw: 20,
        cabeza: 40,
        opacity: oArco
      }), /*#__PURE__*/React.createElement(B.Arco, {
        c: g.der.E,
        r: 270,
        a0: 174,
        a1: 172 - angAhora,
        color: C.GRN,
        sw: 20,
        cabeza: 40,
        opacity: oArco
      })) : null;
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO_CMP[0],
      y: CMP.yArriba + JUICIO_CMP[1],
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.55
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO_CMP[0],
      y: CMP.yAbajo + JUICIO_CMP[1],
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.58), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "SIN ROTACI\xD3N",
      y: 230,
      e: r1,
      s: 1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ROTACI\xD3N EXTERNA",
      y: 1470,
      e: r2,
      s: 1,
      fase: 0.4
    }));
  }

  /* 11 — cierre: una repeticion limpia, todo se enciende, visto grande */
  function EscCierre(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var codo = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.4),
      ease: Easing.easeInOutSine
    })(T);
    var rot = U.suave01((codo - 0.5) / 0.5);
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.4),
      end: f(0.5)
    })(T);
    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.5), 0.5);
    var r1 = M.pop(T, f(0.44), 0.45);
    var r2 = M.pop(T, f(0.6), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.05 * t,
      foco: [540, 980]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: ESP.x,
      y: ESP.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: ESP.s,
      piernas: true,
      codo: codo,
      rot: rot,
      ret: codo,
      musc: {
        dp: luz,
        inf: luz,
        rm: luz,
        tra: luz,
        rom: luz
      }
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 770,
      y: 900,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.85,
      p: M.draw(T, f(0.5), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "FACE PULL",
      s: 1.5,
      y: 290,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1540,
      e: r2,
      fase: 0.4
    }));
  }

  /* =========================================================
     GUION — duracion y locucion de cada escena
     Las duraciones salen de leer cada linea a ritmo normal
     (~2,7 palabras por segundo). Total: 58 s.
     ========================================================= */

  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 6.5,
    C: EscGancho,
    vo: '¿Haces Face Pull? Entonces presta atención a esto, porque un pequeño cambio en la técnica cambia completamente el ejercicio.'
  }, {
    nombre: 'Polea',
    dur: 4,
    C: EscPolea,
    vo: 'Primero, coloca la polea aproximadamente a la altura del pecho…'
  }, {
    nombre: 'Tensión',
    dur: 4,
    C: EscTension,
    vo: '…y aléjate lo suficiente para que el cable ya tenga tensión.'
  }, {
    nombre: 'Hombros',
    dur: 3.5,
    C: EscHombros,
    vo: 'Desde aquí, mantén los hombros retraídos y abajo.'
  }, {
    nombre: 'Tirón',
    dur: 6,
    C: EscTiron,
    vo: 'Ahora lleva la cuerda hacia tu rostro, manteniendo los codos altos y alineados con los hombros.'
  }, {
    nombre: 'Rotación externa',
    dur: 9,
    C: EscRotacion,
    vo: 'Pero aquí está la parte importante: al acercarte al rostro, no solamente tires hacia atrás. Rota externamente el hombro, llevando las manos hacia los lados.'
  }, {
    nombre: 'Músculos',
    dur: 8,
    C: EscMusculos,
    vo: 'En esta fase participan principalmente el deltoides posterior, infraespinoso y redondo menor, con ayuda del trapecio y los romboides.'
  }, {
    nombre: 'Vuelta',
    dur: 5.5,
    C: EscVuelta,
    vo: 'Después vuelve lentamente a la posición inicial. No dejes que el peso simplemente te arrastre.'
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    C: EscError1,
    vo: 'Y evita estos dos errores: levantar los hombros durante el movimiento…'
  }, {
    nombre: 'Error 2',
    dur: 3,
    C: EscError2,
    vo: '…y terminar el ejercicio sin rotación externa.'
  }, {
    nombre: 'Cierre',
    dur: 4,
    C: EscCierre,
    vo: 'Ese es un Face Pull bien ejecutado.'
  }];
  function Reel(props) {
    var T = global.useComposition().T;
    var acc = 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden'
      }
    }, props.escenas.map(function (e, i) {
      var at = acc;
      acc += e.dur;
      var Esc = e.C;
      return /*#__PURE__*/React.createElement(global.Shot, {
        key: i,
        from: at,
        to: acc
      }, /*#__PURE__*/React.createElement(Esc, {
        T: T,
        at: at,
        dur: e.dur
      }));
    }));
  }

  /* =========================================================
     PAGINA — lienzo vertical + guion para grabar la voz
     #render deja solo el lienzo a 1080x1920 (para exportar video)
     ========================================================= */

  var CLAVE = 'facepull.duraciones';
  function durDefecto() {
    return ESCENAS.map(function (e) {
      return e.dur;
    });
  }
  function cargarDur() {
    try {
      var v = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (Array.isArray(v) && v.length === ESCENAS.length && v.every(function (x) {
        return typeof x === 'number' && x > 0;
      })) return v;
    } catch (e) {/* sin almacenamiento: tiempos por defecto */}
    return durDefecto();
  }
  function fmt(v) {
    return (Math.round(v * 10) / 10).toFixed(1);
  }

  // campo de segundos: deja escribir libre y aplica solo valores validos
  function CampoSeg(props) {
    var _t = useState(String(props.valor));
    var txt = _t[0],
      setTxt = _t[1];
    var editando = React.useRef(false);
    useEffect(function () {
      if (!editando.current) setTxt(String(props.valor));
    }, [props.valor]);
    return /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "1",
      max: "30",
      step: "0.5",
      value: txt,
      onFocus: function () {
        editando.current = true;
      },
      onBlur: function () {
        editando.current = false;
        setTxt(String(props.valor));
      },
      onChange: function (ev) {
        setTxt(ev.target.value);
        var v = parseFloat(ev.target.value);
        if (v >= 1 && v <= 30) props.onValor(v);
      }
    });
  }
  function Guion(props) {
    var api = props.api;
    useEffect(function () {
      global.REEL = {
        seek: api.seek,
        setPlaying: api.setPlaying,
        total: api.total
      };
    });
    if (props.render) return null;
    var acc = 0,
      actual = -1;
    var filas = props.escenas.map(function (e, i) {
      var at = acc;
      acc += e.dur;
      var activa = api.T >= at && api.T < acc;
      if (activa) actual = i;
      return /*#__PURE__*/React.createElement("li", {
        key: i,
        className: activa ? 'activa' : '',
        onClick: function () {
          api.seek(at + 0.001);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "num"
      }, i + 1), /*#__PURE__*/React.createElement("div", {
        className: "texto"
      }, /*#__PURE__*/React.createElement("b", null, e.nombre), /*#__PURE__*/React.createElement("span", null, e.vo)), /*#__PURE__*/React.createElement("label", {
        className: "seg",
        onClick: function (ev) {
          ev.stopPropagation();
        }
      }, /*#__PURE__*/React.createElement(CampoSeg, {
        valor: e.dur,
        onValor: function (v) {
          var nuevo = props.durs.slice();
          nuevo[i] = v;
          props.setDurs(nuevo);
        }
      }), /*#__PURE__*/React.createElement("span", null, "s")));
    });
    var total = acc;
    return /*#__PURE__*/React.createElement("div", {
      className: "guion"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rotulo"
    }, "Ahora dice"), /*#__PURE__*/React.createElement("div", {
      className: "ahora"
    }, actual >= 0 ? props.escenas[actual].vo : '—'), /*#__PURE__*/React.createElement("div", {
      className: "total"
    }, "Total ", fmt(total), " s", total > 60 ? ' · pasa del minuto' : ''), /*#__PURE__*/React.createElement("ol", null, filas), /*#__PURE__*/React.createElement("button", {
      className: "plano",
      onClick: function () {
        props.setDurs(durDefecto());
      }
    }, "Restablecer tiempos"));
  }
  function App() {
    var modoRender = global.location.hash === '#render';
    var _d = useState(modoRender ? durDefecto : cargarDur);
    var durs = _d[0],
      setDurs = _d[1];
    useEffect(function () {
      if (modoRender) return;
      try {
        localStorage.setItem(CLAVE, JSON.stringify(durs));
      } catch (e) {/* nada */}
    }, [durs]);
    var escenas = ESCENAS.map(function (e, i) {
      return Object.assign({}, e, {
        dur: durs[i]
      });
    });
    var scenes = escenas.map(function (e) {
      return {
        name: e.nombre,
        dur: e.dur
      };
    });
    return /*#__PURE__*/React.createElement("div", {
      className: modoRender ? 'fp-render' : 'fp'
    }, modoRender ? null : /*#__PURE__*/React.createElement("header", {
      className: "fp-cabecera"
    }, /*#__PURE__*/React.createElement("div", {
      className: "marca"
    }, "Face Pull"), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, "reel vertical 1080\xD71920 \xB7 le\xE9 la l\xEDnea resaltada mientras corre")), /*#__PURE__*/React.createElement(global.Stage, {
      ancho: ANCHO,
      alto: ALTO,
      scenes: scenes,
      debajo: function (api) {
        return /*#__PURE__*/React.createElement(Guion, {
          api: api,
          escenas: escenas,
          durs: durs,
          setDurs: setDurs,
          render: modoRender
        });
      }
    }, /*#__PURE__*/React.createElement(Reel, {
      escenas: escenas
    })));
  }
  global.FACE_PULL = {
    ESCENAS: ESCENAS,
    Reel: Reel
  };
  ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(window);
