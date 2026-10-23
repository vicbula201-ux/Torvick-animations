/* GENERADO por compilar.js desde vivo.jsx — no editar a mano. */
/* ============================================================
   VIVO — window.V: el "estilo 2" de los reels. La misma pizarra (blanco,
   trazo INK grueso, paleta de cinco, Tor), con mas vida:
     - camara que nunca se queda quieta: tomas que se encadenan con
       suavidad (sin cortes), deriva de camara en mano, golpe de zoom y
       temblor en los momentos fuertes
     - Tor parpadea y respira
     - efectos: brillo que late en el musculo, gotas de sudor, lineas de
       velocidad, chispa al llegar arriba, sombra en el piso
     - rotulos que entran deslizando con rebote
   Todo sale de T: nada de CSS animations. Los tiempos de las tomas son
   fracciones de la escena, como el resto (regla de f(fraccion)).

   V.Camara({ T, at, dur, tomas, golpes, pulsos, children })
     tomas   [[fraccion, { zoom, foco: [x, y], mira: [x, y] }], ...]  se interpolan
             con easeInOutCubic; mira (donde queda el foco en pantalla) por defecto 540, 960
     golpes  [fraccion, ...]  temblor corto (cuando sale una X)
     pulsos  [fraccion, ...]  golpe de zoom (+5 %) que vuelve solo
   V.parpadeo(T, fase) -> 0..1      V.respira(T) -> -1..1
   V.Rot({ T, text, y, cuando, s, fase })   rotulo que entra deslizando
   SVG (dentro de un cuerpo o de un <svg> del lienzo):
   V.Brillo({ T, c, r, v, color })   aros que salen del musculo y se apagan
   V.Gotas({ T, c, v, lado })        gotas de sudor saltando de la cabeza
   V.Lineas({ c, dir, v, largo })    lineas de velocidad detras de algo que se mueve
   V.Chispa({ T, c, cuando, r })     estallido amarillo corto
   V.Sombra({ c, rx })               sombra gris en el piso
   V.escena({ fig, figura, comparar, tomas, lienzo, mal, bien, r1, r2 })   escena armada
   V.Mitad({ cmp, y, e })   franja de comparacion      V.fase / V.ida   ritmo de repeticiones
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P;
  var Easing = global.Easing,
    clamp = global.clamp;
  var C = P.C;
  var BLANCO = '#ffffff';
  var ANCHO = 1080,
    ALTO = 1920;
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* ---------------- camara ---------------- */

  function tomaEn(tomas, u) {
    if (!tomas || !tomas.length) return {
      zoom: 1,
      foco: [540, 960],
      mira: [540, 960]
    };
    var norm = function (k) {
      return {
        zoom: k.zoom == null ? 1 : k.zoom,
        foco: k.foco || [540, 960],
        mira: k.mira || k.foco || [540, 960]
      };
    };
    if (u <= tomas[0][0]) return norm(tomas[0][1]);
    for (var i = 1; i < tomas.length; i++) {
      if (u <= tomas[i][0]) {
        var a = norm(tomas[i - 1][1]),
          b = norm(tomas[i][1]);
        var k = Easing.easeInOutCubic((u - tomas[i - 1][0]) / Math.max(0.0001, tomas[i][0] - tomas[i - 1][0]));
        return {
          zoom: lerp(a.zoom, b.zoom, k),
          foco: [lerp(a.foco[0], b.foco[0], k), lerp(a.foco[1], b.foco[1], k)],
          mira: [lerp(a.mira[0], b.mira[0], k), lerp(a.mira[1], b.mira[1], k)]
        };
      }
    }
    return norm(tomas[tomas.length - 1][1]);
  }
  function Camara(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var u = clamp((T - at) / dur, 0, 1);
    var k = tomaEn(props.tomas, u);
    var z = k.zoom;
    // golpe de zoom: sube rapido y vuelve con rebote
    (props.pulsos || []).forEach(function (p) {
      var d = T - (at + dur * p);
      if (d > 0 && d < 0.45) z *= 1 + 0.05 * Math.sin(Math.PI * Math.min(1, d / 0.45)) * (1 - d / 0.9);
    });
    // camara en mano: deriva lenta, nunca quieta
    var dx = 5 * Math.sin(T * 0.9) + 3 * Math.sin(T * 2.3 + 1.7);
    var dy = 4 * Math.sin(T * 1.25 + 0.6) + 2 * Math.sin(T * 2.9);
    var rot = 0.35 * Math.sin(T * 0.7 + 0.3);
    // temblor cuando sale una X
    (props.golpes || []).forEach(function (p) {
      var d = T - (at + dur * p);
      if (d > 0 && d < 0.3) {
        var a = 12 * (1 - d / 0.3);
        dx += a * Math.sin(d * 95);
        dy += a * 0.7 * Math.cos(d * 80);
        rot += 0.8 * (1 - d / 0.3) * Math.sin(d * 70);
      }
    });
    var tx = k.mira[0] - z * k.foco[0] + dx,
      ty = k.mira[1] - z * k.foco[1] + dy;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        transformOrigin: '0 0',
        transform: 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + z.toFixed(4) + ')' + ' rotate(' + rot.toFixed(3) + 'deg)'
      }
    }, props.children);
  }

  /* ---------------- vida de Tor ---------------- */

  // parpadeo cada ~3,3 s (con un doble parpadeo de vez en cuando)
  function parpadeo(T, fase) {
    var per = 3.3,
      k = ((T + (fase || 0)) % per + per) % per;
    var uno = function (t0) {
      var d = (k - t0) / 0.16;
      return d > 0 && d < 1 ? 1 - Math.abs(d * 2 - 1) : 0;
    };
    var doble = Math.floor((T + (fase || 0)) / per) % 3 === 2;
    return Math.max(uno(0), doble ? uno(0.24) : 0);
  }
  function respira(T) {
    return Math.sin(T * Math.PI * 2 / 3.6);
  }

  /* ---------------- rotulo que entra deslizando ---------------- */

  function Rot(props) {
    var T = props.T,
      s = props.s || 1.1;
    var w = (Math.max(120, String(props.text).length * 30) + 110) * s;
    var x = props.x == null ? (ANCHO - w) / 2 : props.x;
    var k = clamp((T - props.cuando) / 0.5, 0, 1);
    var e = Easing.easeOutBack(k);
    var dy = M.life(T, 3.4, 5, props.fase || 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: x,
        top: props.y,
        opacity: clamp(k * 2.5, 0, 1),
        transformOrigin: '0% 50%',
        transform: 'translate(' + (-150 * (1 - e)).toFixed(1) + 'px,' + dy.toFixed(1) + 'px) rotate(' + (-5 * (1 - e)).toFixed(2) + 'deg) scale(' + (0.9 + 0.1 * e).toFixed(3) + ')'
      }
    }, /*#__PURE__*/React.createElement(P.Rotulo, {
      text: props.text,
      dir: props.dir || 'right',
      s: s
    }));
  }

  /* ---------------- efectos (SVG) ---------------- */

  // aros que nacen del musculo y se apagan: el musculo "brilla" sin degradados
  function Brillo(props) {
    var T = props.T,
      v = clamp(props.v == null ? 1 : props.v, 0, 1);
    if (v < 0.02) return null;
    var r = props.r || 70,
      color = props.color || C.YEL,
      c = props.c;
    var aros = [];
    for (var i = 0; i < 2; i++) {
      var u = (T / 1.1 + i * 0.5) % 1;
      aros.push(/*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: c[0],
        cy: c[1],
        r: r * (0.8 + 0.9 * u),
        fill: "none",
        stroke: color,
        strokeWidth: 14 * (1 - u) + 4,
        opacity: v * (1 - u)
      }));
    }
    return /*#__PURE__*/React.createElement("g", null, aros);
  }

  // gotas de sudor: salen de la cabeza hacia los costados, en arco, y caen
  function Gotas(props) {
    var T = props.T,
      v = clamp(props.v == null ? 1 : props.v, 0, 1),
      c = props.c;
    if (v < 0.02) return null;
    var gotas = [];
    [[-1, 0], [1, 0.45], [-1, 0.9], [1, 1.3]].forEach(function (g, i) {
      var u = (T + g[1]) % 1.6 / 0.7;
      if (u > 1) return;
      var x = c[0] + g[0] * (60 + 140 * u),
        y = c[1] - 70 - 120 * u + 260 * u * u;
      var a = Math.atan2(260 * 2 * u - 120, g[0] * 140) * 180 / Math.PI - 90;
      gotas.push(/*#__PURE__*/React.createElement("g", {
        key: i,
        transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + a.toFixed(1) + ')',
        opacity: v * (1 - u * u)
      }, /*#__PURE__*/React.createElement("path", {
        d: "M 0 -26 C 12 -8 16 4 16 10 C 16 20 8 26 0 26 C -8 26 -16 20 -16 10 C -16 4 -12 -8 0 -26 Z",
        fill: BLANCO,
        stroke: C.INK,
        strokeWidth: 8,
        strokeLinejoin: "round"
      })));
    });
    return /*#__PURE__*/React.createElement("g", null, gotas);
  }

  // lineas de velocidad: tres trazos detras del punto c, en contra de dir
  function Lineas(props) {
    var v = clamp(props.v || 0, 0, 1);
    if (v < 0.05) return null;
    var d = props.dir,
      L = Math.hypot(d[0], d[1]) || 1;
    var u = [d[0] / L, d[1] / L],
      n = [-u[1], u[0]];
    var largo = (props.largo || 120) * v,
      c = props.c;
    return /*#__PURE__*/React.createElement("g", {
      opacity: Math.min(1, v * 1.5)
    }, [-1, 0, 1].map(function (k) {
      var o = [c[0] - u[0] * (50 + 20 * Math.abs(k)) + n[0] * k * 34, c[1] - u[1] * (50 + 20 * Math.abs(k)) + n[1] * k * 34];
      var e = [o[0] - u[0] * largo * (k ? 0.7 : 1), o[1] - u[1] * largo * (k ? 0.7 : 1)];
      return /*#__PURE__*/React.createElement("path", {
        key: k,
        d: 'M ' + o[0].toFixed(1) + ' ' + o[1].toFixed(1) + ' L ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1),
        stroke: C.INK,
        strokeWidth: 9,
        strokeLinecap: "round"
      });
    }));
  }

  // estallido amarillo: ocho rayos que salen y se apagan en 0,4 s
  function Chispa(props) {
    var d = props.T - props.cuando;
    if (d < 0 || d > 0.4) return null;
    var u = d / 0.4,
      r = props.r || 70,
      c = props.c;
    var rayos = [];
    for (var i = 0; i < 8; i++) {
      var a = i * Math.PI / 4 + 0.2;
      var r0 = r * (0.6 + 0.6 * u),
        r1 = r0 + 40 * (1 - u) + 10;
      rayos.push(/*#__PURE__*/React.createElement("path", {
        key: i,
        d: 'M ' + (c[0] + Math.cos(a) * r0).toFixed(1) + ' ' + (c[1] + Math.sin(a) * r0).toFixed(1) + ' L ' + (c[0] + Math.cos(a) * r1).toFixed(1) + ' ' + (c[1] + Math.sin(a) * r1).toFixed(1),
        stroke: C.YEL,
        strokeWidth: 14,
        strokeLinecap: "round",
        opacity: 1 - u
      }));
    }
    return /*#__PURE__*/React.createElement("g", null, rayos);
  }
  function Sombra(props) {
    var c = props.c,
      rx = props.rx || 260;
    return /*#__PURE__*/React.createElement("ellipse", {
      cx: c[0],
      cy: c[1],
      rx: rx,
      ry: rx * 0.12,
      fill: C.GRY
    });
  }

  /* ---------------- escenas armadas (estilo 2) ---------------- */

  // franja de una comparacion (mal arriba / bien abajo): recorta la figura y entra desde su centro
  function Mitad(props) {
    var A = global.REELS.ayudas;
    var c = props.cmp,
      s = c.s;
    return /*#__PURE__*/React.createElement(A.Pos, {
      x: 0,
      y: 0,
      e: props.e,
      dx: props.dx,
      dy: props.dy,
      origen: '540px ' + (props.y + c.h / 2) + 'px'
    }, /*#__PURE__*/React.createElement(A.Recorte, {
      x: 0,
      y: props.y,
      w: ANCHO,
      h: c.h,
      desde: c.desdeY * s
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 540 - c.centroX * s,
        top: 0
      }
    }, props.children)));
  }

  // V.escena({ ... }) -> componente de escena ({ T, at, dur }):
  //   fig      { x, y, s } donde va la figura (cuerpo entero)
  //   figura   (T, f, t, s) => elemento (B.Perfil, B.Frente...); es el elemento principal
  //   vibra    true: la figura tiembla (errores)
  //   comparar { cmp: { s, desdeY, h, centroX, yArriba, yAbajo }, mal: (T, f, t, s) => elem,
  //              bien: (T, f, t, s) => elem, vibraMal }  dos franjas apiladas
  //   tomas / golpes / pulsos   como V.Camara (las X suman su golpe solas)
  //   lienzo   (T, f, t) => SVG en coordenadas del lienzo, dentro de la camara
  //   encima   (T, f, t) => elementos HTML fuera de la camara (cuentas, piezas fijas)
  //   mal / bien  [{ x, y, cuando, s, hasta }]   (en una comparacion hay valores por defecto;
  //               hasta: fraccion en la que se retira)
  //   r1 / r2     { text, y, cuando, s }
  function escena(o) {
    return function Escena(props) {
      var A = global.REELS.ayudas;
      var T = props.T,
        at = props.at,
        dur = props.dur;
      var f = function (v) {
        return at + dur * v;
      };
      var t = clamp((T - at) / dur, 0, 1);
      var cmp = o.comparar ? o.comparar.cmp : null;
      var mal = o.mal || (cmp ? [{
        x: 870,
        y: cmp.yArriba + 40,
        cuando: 0.14,
        s: 0.5
      }] : []);
      var bien = o.bien || (cmp ? [{
        x: 870,
        y: cmp.yAbajo + 40,
        cuando: 0.56
      }] : []);
      var golpes = (o.golpes || []).concat(mal.map(function (m) {
        return m.cuando;
      }));
      var hijos = [];
      if (o.figura) {
        var fig = o.fig;
        hijos.push(/*#__PURE__*/React.createElement(A.Pos, {
          key: "fig",
          x: fig.x,
          y: fig.y,
          e: M.pop(T, at - 0.6, 0.5),
          dx: o.vibra ? M.vibra(T, 30, 3) : 0,
          dy: M.life(T, 3.6, 4)
        }, o.figura(T, f, t, fig.s)));
      }
      if (cmp) {
        hijos.push(/*#__PURE__*/React.createElement(Mitad, {
          key: "m",
          cmp: cmp,
          y: cmp.yArriba,
          e: M.pop(T, at - 0.6, 0.5),
          dx: o.comparar.vibraMal === false ? 0 : M.vibra(T, 30, 2),
          dy: M.life(T, 3.6, 4)
        }, o.comparar.mal(T, f, t, cmp.s)));
        hijos.push(/*#__PURE__*/React.createElement(Mitad, {
          key: "b",
          cmp: cmp,
          y: cmp.yAbajo,
          e: M.pop(T, f(0.3), 0.45),
          dy: M.life(T, 3.6, 4, 0.5)
        }, o.comparar.bien(T, f, t, cmp.s)));
      }
      if (o.lienzo) {
        hijos.push(/*#__PURE__*/React.createElement("svg", {
          key: "l",
          width: ANCHO,
          height: ALTO,
          style: {
            position: 'absolute',
            left: 0,
            top: 0,
            overflow: 'visible'
          }
        }, o.lienzo(T, f, t)));
      }
      var rot = function (r, i) {
        if (!r) return null;
        var y = r.y != null ? r.y : i ? cmp ? 1530 : 1490 : cmp ? 250 : 270;
        return /*#__PURE__*/React.createElement(Rot, {
          key: 'r' + i,
          T: T,
          text: r.text,
          y: y,
          s: r.s || (cmp ? 1 : 1.1),
          fase: i * 0.4,
          cuando: r.cuando == null ? at - 0.6 : f(r.cuando)
        });
      };
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0
        }
      }, /*#__PURE__*/React.createElement(Camara, {
        T: T,
        at: at,
        dur: dur,
        tomas: o.tomas || [[0, {
          zoom: 1
        }], [1, {
          zoom: 1.05
        }]],
        golpes: golpes,
        pulsos: o.pulsos
      }, hijos), o.encima ? o.encima(T, f, t) : null, mal.map(function (m, i) {
        return /*#__PURE__*/React.createElement(A.Mal, {
          key: 'm' + i,
          T: T,
          cuando: f(m.cuando),
          hasta: m.hasta == null ? null : f(m.hasta),
          x: m.x,
          y: m.y,
          s: m.s
        });
      }), bien.map(function (b, i) {
        return /*#__PURE__*/React.createElement(A.Bien, {
          key: 'b' + i,
          T: T,
          cuando: f(b.cuando),
          hasta: b.hasta == null ? null : f(b.hasta),
          x: b.x,
          y: b.y,
          s: b.s,
          fase: i * 0.4
        });
      }), rot(o.r1, 0), rot(o.r2, 1));
    };
  }

  // repeticion: fraccion del ciclo k (0..1) dentro de [a, b] con n repeticiones
  function fase(T, a, b, n) {
    if (T <= a || b <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a)) * (n || 1);
    return u >= (n || 1) ? 0 : u - Math.floor(u);
  }
  // perfil de una repeticion: va en el % ida, aguanta, vuelve lento (0 -> 1 -> 0)
  function ida(k, va, aguanta) {
    va = va == null ? 0.4 : va;
    aguanta = aguanta == null ? 0.1 : aguanta;
    if (k <= 0 || k >= 1) return 0;
    if (k < va) return Easing.easeInOutSine(k / va);
    if (k < va + aguanta) return 1;
    return 1 - Easing.easeInOutSine((k - va - aguanta) / (1 - va - aguanta));
  }
  global.V = {
    Camara: Camara,
    tomaEn: tomaEn,
    parpadeo: parpadeo,
    respira: respira,
    Rot: Rot,
    Brillo: Brillo,
    Gotas: Gotas,
    Lineas: Lineas,
    Chispa: Chispa,
    Sombra: Sombra,
    Mitad: Mitad,
    escena: escena,
    fase: fase,
    ida: ida
  };
})(window);
