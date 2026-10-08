/* GENERADO por compilar.js desde elevacion-piernas.jsx — no editar a mano. */
/* ============================================================
   ELEVACION DE PIERNAS — reel vertical 1080x1920 (~56 s con el cierre)
   Fuente tecnica: libro de biomecanica, pag. 173. Boca arriba, manos
   bajo los gluteos, piernas extendidas y juntas hasta 90 grados y
   bajada lenta. Flexion de cadera: iliopsoas y recto femoral
   (primarios), sartorio y tensor de la fascia lata (sinergistas), el
   abdomen estabiliza la pelvis y la zona lumbar contra el piso.
   Errores: arquear la zona lumbar y doblar las rodillas.

   Cada escena sigue la regla de f(fraccion): si cambias una duracion
   (en ESCENAS o en la lista de la pagina) la coreografia se estira o
   se encoge sola, para calzar con la locucion grabada.
   La pagina, las transiciones, el sello y el cierre de marca los pone
   reel.jsx; aca solo van las escenas.
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
  var sale = A.sale,
    junta = A.junta,
    reps = A.reps,
    Pos = A.Pos,
    Rot = A.Rot;
  var Camara = A.Camara;

  /* =========================================================
     FIGURA acostada (B.Perfil + B.posePerfil.acostado)
     ========================================================= */

  var PISO = 1300,
    CADX = 640; // en el viewBox de B.Perfil
  var SUELO = 1150; // y del piso en el lienzo (escenas de una figura)
  // figura entera: de la punta del pie (x ~ 8) a la coronilla (x ~ 985), fuera de los botones de la derecha
  var FIG = {
    x: -8,
    y: SUELO - PISO * 0.8,
    s: 0.8
  };
  var MAT = [36, 1286]; // colchoneta fija (x del viewBox), no sigue a los pies

  function enLienzo(base, p) {
    return [base.x + p[0] * base.s, base.y + p[1] * base.s];
  }

  // pose acostada; manos 0 = mano al costado de la cadera, 1 = metida bajo el gluteo
  function pose(o) {
    var p = B.posePerfil.acostado({
      x: CADX,
      piso: PISO,
      piernas: o.piernas || 0,
      rodilla: o.rodilla || 0,
      arco: o.arco || 0
    });
    var k = Easing.easeInOutCubic(clamp(o.manos == null ? 1 : o.manos, 0, 1));
    var cx = p.cadera[0];
    // la mano viaja "hacia adentro" (en este dibujo lo que esta mas cerca de la
    // camara queda mas abajo): del costado, delante del piso, a debajo del gluteo
    p.mano = U.lerpP([cx + 96, PISO + 40], [cx - 8, PISO - 2], k);
    p.codo = U.lerpP([cx + 236, PISO + 52], [cx + 168, PISO + 66], k);
    return p;
  }

  // la misma pose sin el brazo cercano (se lo lleva lejos, a la derecha del hombro)
  function sinBrazo(po) {
    return Object.assign({}, po, {
      codo: U.suma(po.hombro, [180, -30]),
      mano: U.suma(po.hombro, [360, -30])
    });
  }

  // iliopsoas propio: huso que sale de las vertebras lumbares, pasa por delante
  // de la cadera (el pliegue entre panza y muslo) y entra en la raiz del muslo.
  // Sigue a la flexion de cadera sin el zigzag de la banda de B.Perfil.
  function catmull(pts, n) {
    var out = [];
    var P = [pts[0]].concat(pts, [pts[pts.length - 1]]);
    var tramos = pts.length - 1;
    for (var i = 0; i <= n; i++) {
      var x = i / n * tramos;
      var k = Math.min(tramos - 1, Math.floor(x)),
        u = x - k;
      var p0 = P[k],
        p1 = P[k + 1],
        p2 = P[k + 2],
        p3 = P[k + 3];
      var u2 = u * u,
        u3 = u2 * u;
      out.push([0, 1].map(function (j) {
        return 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * u + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * u2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * u3);
      }));
    }
    return out;
  }
  function psoasForma(g) {
    var T = g.torso,
      nP = g.ejes.pelvis.n,
      m = g.ejes.muslo;
    var pliegue = U.suma(g.cadera, U.por(U.unidad(U.suma(nP, m.n)), 44));
    var eje = catmull([T(0.52, -0.42 * g.anchoEspalda(0.52)), T(0.24, 2), pliegue, m.en(0.32, 0)], 28);
    var izq = [],
      der = [];
    eje.forEach(function (q, i) {
      var a = eje[Math.max(0, i - 1)],
        b = eje[Math.min(eje.length - 1, i + 1)];
      var tg = U.unidad(U.resta(b, a)),
        n = [-tg[1], tg[0]];
      var s = i / (eje.length - 1);
      var w = 7 + 25 * Math.pow(Math.sin(Math.PI * s), 0.8);
      izq.push(U.suma(q, U.por(n, w)));
      der.push(U.suma(q, U.por(n, -w)));
    });
    var contorno = izq.concat(der.reverse());
    return {
      d: 'M ' + contorno.map(U.pt).join(' L ') + ' Z',
      fibra: 'M ' + eje.slice(5, 24).map(U.pt).join(' L ')
    };
  }
  function Musculos(props) {
    var g = props.g,
      v = props.psoas || 0;
    if (v < 0.01) return null;
    var ps = psoasForma(g);
    return /*#__PURE__*/React.createElement("g", {
      opacity: v,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: ps.d,
      fill: props.color || C.YEL,
      stroke: C.INK,
      strokeWidth: 13
    }), /*#__PURE__*/React.createElement("path", {
      d: ps.fibra,
      fill: "none",
      stroke: C.GRY,
      strokeWidth: 11
    }));
  }
  function Acostado(props) {
    var id = U.useIdLocal('elev');
    var b = props.base || FIG;
    var po = pose(props);
    var oCad = [po.cadera[0] * b.s, (PISO - 120) * b.s];
    // a la izquierda del codo, el cuerpo vuelve a dibujarse encima del brazo: asi el
    // antebrazo pasa por debajo de la cadera y la mano queda bajo el gluteo
    var corte = po.codo[0] - 30;
    // el iliopsoas lo dibuja esta escena (ver Musculos); el resto, B.Perfil
    var musc = Object.assign({}, props.musc || {}, {
      psoas: 0
    });
    var gris = props.muscGris;
    var rojo = props.muscRojo;
    var vPsoas = (props.musc || {}).psoas;
    return /*#__PURE__*/React.createElement(Pos, {
      x: b.x,
      y: b.y,
      e: props.e,
      dx: props.dx,
      dy: props.dy,
      origen: oCad[0].toFixed(0) + 'px ' + oCad[1].toFixed(0) + 'px'
    }, /*#__PURE__*/React.createElement(B.Perfil, {
      s: b.s,
      pose: po,
      musc: musc,
      muscGris: gris,
      muscRojo: rojo,
      fondo: function (g) {
        return /*#__PURE__*/React.createElement(B.ColchonetaG, {
          x0: MAT[0],
          x1: MAT[1],
          y: g.piso
        });
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("mask", {
        id: id,
        maskUnits: "userSpaceOnUse",
        x: -800,
        y: -800,
        width: 3200,
        height: 3200
      }, /*#__PURE__*/React.createElement("rect", {
        x: -800,
        y: -800,
        width: corte + 800,
        height: 3200,
        fill: "#ffffff"
      }))), /*#__PURE__*/React.createElement("g", {
        mask: 'url(#' + id + ')'
      }, /*#__PURE__*/React.createElement(B.Perfil, {
        s: 1,
        pose: sinBrazo(po),
        musc: musc,
        muscGris: gris,
        muscRojo: rojo
      })), /*#__PURE__*/React.createElement(Musculos, {
        g: g,
        psoas: vPsoas
      }), props.children ? props.children(g) : null);
    }));
  }

  // geometria de la misma pose, sin dibujar (para ubicar X, visto, camara)
  function geo(o) {
    return B.geoPerfil({
      pose: pose(o)
    });
  }

  // recorrido del tobillo al subir las piernas (en el viewBox)
  function trayectoria(desde, hasta) {
    var pts = [];
    for (var i = 0; i <= 24; i++) {
      pts.push(geo({
        piernas: U.lerp(desde, hasta, i / 24)
      }).tobillo);
    }
    return pts;
  }

  // angulo en pantalla del muslo (180 = hacia los pies, 270 = vertical arriba)
  function angMuslo(g) {
    var d = U.resta(g.rodilla, g.cadera);
    var a = Math.atan2(d[1], d[0]) * 180 / Math.PI;
    return a < 0 ? a + 360 : a;
  }

  // arco que acompana al muslo: solo se dibuja cuando ya recorrio unos grados en
  // el sentido pedido (dir +1 sube, -1 baja) y entra con fundido, sin saltos
  function arcoMuslo(g, a0, dir, color, opacity) {
    var a1 = angMuslo(g);
    var barrido = (a1 - a0) * dir;
    if (barrido < 6) return null;
    var o = clamp((barrido - 6) / 14, 0, 1) * (opacity == null ? 1 : opacity);
    return /*#__PURE__*/React.createElement(B.Arco, {
      c: g.cadera,
      r: 250,
      a0: a0,
      a1: a1,
      color: color,
      sw: 18,
      cabeza: 38,
      opacity: o
    });
  }

  // contorno de la espalda baja (de la cadera hacia el pecho), para resaltarlo
  function contornoLumbar(g, t0, t1) {
    var pts = [];
    for (var i = 0; i <= 10; i++) {
      var t = U.lerp(t0, t1, i / 10);
      pts.push(g.torso(t, -g.anchoEspalda(t)));
    }
    return pts;
  }

  // la espalda baja apoyada: el contorno se pinta de verde
  function lumbarPegada(g, p, opacity) {
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: contornoLumbar(g, 0.19, 0.62),
      p: p,
      color: C.GRN,
      sw: 22,
      hueco: 0.01,
      opacity: opacity
    });
  }

  // flechas que aprietan la pelvis y la zona lumbar contra el piso
  function aprieta(g, p, color) {
    return [0.2, 0.44].map(function (q, i) {
      var w = g.anchoFrente(q);
      return /*#__PURE__*/React.createElement(B.FlechaS, {
        key: 'ap' + i,
        a: g.torso(q, w + 170),
        b: g.torso(q, w + 36),
        p: p,
        color: color || C.GRN
      });
    });
  }

  // guia recta paralela a la pierna, del lado de adelante (pierna estirada)
  function guiaPierna(g, p, color, sep) {
    var uP = U.unidad(U.resta(g.tobillo, g.cadera));
    var nP = [uP[1], -uP[0]];
    var d = -(sep || 118);
    var a = U.suma(g.cadera, U.por(nP, d));
    var b = U.suma(g.tobillo, U.por(nP, d));
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [U.suma(a, U.por(uP, 110)), U.suma(b, U.por(uP, -10))],
      p: p,
      color: color,
      sw: 18,
      hueco: 0.01
    });
  }

  // escuadra de 90 grados entre la pierna y el piso (detras del muslo)
  function Escuadra(props) {
    var g = props.g,
      l = props.l || 100;
    var x = g.cadera[0] - 124,
      y = g.piso - 8;
    var p = props.p == null ? 1 : props.p;
    var d = 'M ' + (x - l) + ' ' + y + ' L ' + (x - l) + ' ' + (y - l) + ' L ' + x + ' ' + (y - l);
    var largo = 2 * l;
    return /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: C.GRN,
      strokeWidth: 18,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: largo,
      strokeDashoffset: largo * (1 - p),
      opacity: props.opacity
    });
  }

  // detalle "palmas hacia abajo": la mano vista desde arriba (se ven las unas),
  // dentro de una lupa amarilla como el anillo que marca la mano bajo el gluteo
  function LupaMano(props) {
    var s = props.s || 1;
    var id = U.useIdLocal('lupa');
    // dedos apuntando a la izquierda: [y, x de la punta], del menique al indice
    var dedos = [[106, 66], [134, 44], [162, 36], [190, 50]];
    var formas = ['M 228 118 L 330 112 L 330 192 L 228 186 Z', U.capsula([206, 192], [148, 236], 18, 15), 'M 162 92 L 202 92 Q 236 92 236 126 L 236 174 Q 236 208 202 208 L 162 208 Q 128 208 128 174 L 128 126 Q 128 92 162 92 Z'].concat(dedos.map(function (q) {
      return U.capsula([150, q[0]], [q[1] + 13.5, q[0]], 13.5, 13.5);
    }));
    var cortes = [[120, 86], [148, 64], [176, 68]]; // lineas entre dedos: [y, hasta x]
    return /*#__PURE__*/React.createElement("svg", {
      width: 300 * s,
      height: 300 * s,
      viewBox: "0 0 300 300",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: id
    }, /*#__PURE__*/React.createElement("circle", {
      cx: 150,
      cy: 150,
      r: 134
    }))), /*#__PURE__*/React.createElement("circle", {
      cx: 150,
      cy: 150,
      r: 140,
      fill: "#ffffff"
    }), /*#__PURE__*/React.createElement("g", {
      clipPath: 'url(#' + id + ')'
    }, /*#__PURE__*/React.createElement("g", {
      fill: C.INK,
      stroke: C.INK,
      strokeWidth: 22,
      strokeLinejoin: "round"
    }, formas.map(function (d, i) {
      return /*#__PURE__*/React.createElement("path", {
        key: 't' + i,
        d: d
      });
    })), /*#__PURE__*/React.createElement("g", {
      fill: "#ffffff"
    }, formas.map(function (d, i) {
      return /*#__PURE__*/React.createElement("path", {
        key: 'r' + i,
        d: d
      });
    })), /*#__PURE__*/React.createElement("g", {
      stroke: C.INK,
      strokeWidth: 9,
      strokeLinecap: "round"
    }, cortes.map(function (q, i) {
      return /*#__PURE__*/React.createElement("line", {
        key: 'c' + i,
        x1: 124,
        y1: q[0],
        x2: q[1],
        y2: q[0]
      });
    })), dedos.map(function (q, i) {
      return /*#__PURE__*/React.createElement("rect", {
        key: 'u' + i,
        x: q[1] + 5,
        y: q[0] - 8,
        width: 20,
        height: 16,
        rx: 6,
        fill: C.GRY
      });
    }), /*#__PURE__*/React.createElement("rect", {
      x: 146,
      y: 226,
      width: 20,
      height: 16,
      rx: 6,
      fill: C.GRY,
      transform: "rotate(-37 156 234)"
    })), /*#__PURE__*/React.createElement("circle", {
      cx: 150,
      cy: 150,
      r: 140,
      fill: "none",
      stroke: C.YEL,
      strokeWidth: 16
    }));
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: se pinta el abdomen, duda (X), y se enciende el iliopsoas */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = animate({
      from: 0,
      to: 1,
      start: f(0.02),
      end: f(0.26),
      ease: Easing.easeInOutSine
    })(T);
    var piernas = 90 * sube - 34 * reps(T, f(0.3), f(0.98), 2);
    var abd = animate({
      from: 0,
      to: 1,
      start: f(0.24),
      end: f(0.34)
    })(T);
    var cambio = animate({
      from: 0,
      to: 1,
      start: f(0.62),
      end: f(0.7)
    })(T);
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.66),
      end: f(0.76)
    })(T);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.64),
      end: f(0.74)
    })(T);
    var tiron = M.draw(T, f(0.74), 0.4);
    var g = geo({});
    var cad = enLienzo(FIG, g.cadera);
    var panza = enLienzo(FIG, g.torso(0.36, g.anchoFrente(0.36)));
    var foco = U.lerpP(cad, panza, 0.5);
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.18),
      end: f(0.34),
      ease: Easing.easeInOutCubic
    })(T);
    var zoom = 1 + 0.28 * acerca + 0.03 * t;
    var mira = U.lerpP(foco, [520, 1000], acerca);
    var fig = M.pop(T, at - 0.6, 0.5);
    var titulo = M.pop(T, f(0.03), 0.45);
    var tacha = junta(M.pop(T, f(0.42), 0.4), sale(T, f(0.62)));
    var duda = M.pop(T, f(0.4), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: foco,
      mira: mira
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      piernas: piernas,
      musc: {
        abd: abd * (1 - cambio),
        psoas: luz,
        recto: luz
      },
      muscGris: {
        abd: cambio
      }
    }, function (gg) {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
        c: U.suma(gg.cadera, [10, -10]),
        r: 170,
        p: anillo,
        color: C.YEL,
        sw: 18
      }), /*#__PURE__*/React.createElement(B.Arco, {
        c: gg.cadera,
        r: 260,
        a0: 186,
        a1: angMuslo(gg) - 6,
        p: tiron,
        color: C.YEL,
        sw: 18,
        cabeza: 40
      }));
    }), /*#__PURE__*/React.createElement(Pos, {
      x: panza[0] - 62,
      y: panza[1] - 250,
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.55
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ELEVACI\xD3N DE PIERNAS",
      s: 1.25,
      y: 270,
      e: titulo
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "\xBFSOLO ABDOMEN?",
      y: 1270,
      e: duda,
      fase: 0.4
    }));
  }

  /* 2 — posicion: boca arriba, las manos se meten bajo los gluteos */
  function EscPosicion(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var manos = animate({
      from: 0,
      to: 1,
      start: f(0.36),
      end: f(0.62),
      ease: Easing.linear
    })(T);
    var flecha = M.draw(T, f(0.3), 0.45);
    var oFlecha = sale(T, f(0.66)).opacity;
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.6),
      end: f(0.7)
    })(T);
    var g = geo({
      manos: 1
    });
    var glu = enLienzo(FIG, U.suma(g.gluteo, [30, 0]));
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.12),
      end: f(0.34),
      ease: Easing.easeInOutCubic
    })(T);
    var zoom = 1 + 0.75 * acerca + 0.03 * t;
    var mira = U.lerpP(glu, [500, 980], acerca);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rotulo = M.pop(T, f(0.32), 0.45);
    var lupa = M.pop(T, f(0.62), 0.45);
    var hilo = M.draw(T, f(0.6), 0.3);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: glu,
      mira: mira
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      manos: manos
    }, function (gg) {
      var cx = gg.cadera[0];
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [cx + 170, PISO + 150],
        b: [cx + 10, PISO + 96],
        p: flecha,
        opacity: oFlecha,
        color: C.YEL,
        sw: 14,
        cabeza: 30
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: [cx - 6, PISO - 6],
        r: 92,
        p: anillo,
        color: C.YEL,
        sw: 14
      }));
    })), /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [[466, 1124], [444, 1196]],
      p: hilo,
      color: C.YEL,
      sw: 14
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 290,
      y: 1196,
      e: lupa,
      dy: M.life(T, 3, 4)
    }, /*#__PURE__*/React.createElement(LupaMano, {
      s: 0.98
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "MANOS BAJO GL\xDATEOS",
      y: 560,
      e: rotulo
    }));
  }

  /* 3 — subida: piernas estiradas y juntas de 0 a 90 grados */
  function EscSubida(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var u = animate({
      from: 0,
      to: 1,
      start: f(0.26),
      end: f(0.82),
      ease: Easing.easeInOutSine
    })(T);
    var piernas = 90 * u;
    var guia = M.draw(T, f(0.06), 0.45);
    var oGuia = 1 - animate({
      from: 0,
      to: 1,
      start: f(0.84),
      end: f(0.92)
    })(T);
    var escuadra = M.draw(T, f(0.84), 0.35);
    var vertical = M.draw(T, f(0.86), 0.4);
    var tray = trayectoria(0, 90);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.06), 0.45);
    var r2 = M.pop(T, f(0.82), 0.45);
    var visto = M.pop(T, f(0.88), 0.45);
    var g = geo({});
    var cad = enLienzo(FIG, g.cadera);
    var zoom = 1 + 0.12 * u + 0.02 * t;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: [cad[0], SUELO],
      mira: [cad[0] + 20 * u, SUELO]
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      piernas: piernas
    }, function (gg) {
      var xv = gg.cadera[0] - 124;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: tray,
        p: u,
        color: C.YEL,
        sw: 17
      }), /*#__PURE__*/React.createElement("g", {
        opacity: oGuia
      }, guiaPierna(gg, guia, C.YEL)), arcoMuslo(gg, 181, 1, C.YEL, oGuia), /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [[xv, gg.piso - 20], [xv, gg.tobillo[1] - 40]],
        p: vertical,
        color: C.GRN,
        sw: 15
      }), /*#__PURE__*/React.createElement(Escuadra, {
        g: gg,
        p: escuadra
      }));
    }), /*#__PURE__*/React.createElement(Pos, {
      x: 760,
      y: 560,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.88), 0.4)
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PIERNAS ESTIRADAS",
      y: 270,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "HASTA 90\xB0",
      y: 1270,
      e: r2,
      s: 1.25,
      fase: 0.4
    }));
  }

  /* 4 — quien trabaja: zoom a la cadera, flexion; se encienden de a uno */
  function EscMusculos(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var piernas = 36 + 46 * reps(T, f(0.02), f(0.98), 2.5);
    var arco = M.draw(T, f(0.06), 0.5);
    var psoas = animate({
      from: 0,
      to: 1,
      start: f(0.36),
      end: f(0.44)
    })(T);
    var recto = animate({
      from: 0,
      to: 1,
      start: f(0.54),
      end: f(0.62)
    })(T);
    var sart = animate({
      from: 0,
      to: 1,
      start: f(0.7),
      end: f(0.78)
    })(T);
    var tfl = animate({
      from: 0,
      to: 1,
      start: f(0.82),
      end: f(0.9)
    })(T);
    var g = geo({});
    var cad = enLienzo(FIG, g.cadera);
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0),
      end: f(0.16),
      ease: Easing.easeInOutCubic
    })(T);
    var zoom = 1 + 0.28 * acerca + 0.03 * t;
    var mira = U.lerpP(cad, [440, 1050], acerca);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.36), 0.45);
    var r2 = M.pop(T, f(0.54), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: cad,
      mira: mira
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      piernas: piernas,
      musc: {
        psoas: psoas,
        recto: recto
      },
      muscGris: {
        sart: sart,
        tfl: tfl
      }
    }, function (gg) {
      var a = angMuslo(gg);
      return /*#__PURE__*/React.createElement(B.Arco, {
        c: gg.cadera,
        r: 250,
        a0: 184,
        a1: a - 4,
        p: arco,
        color: C.GRN,
        sw: 18,
        cabeza: 40
      });
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ILIOPSOAS",
      y: 250,
      e: r1,
      s: 1.25
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RECTO FEMORAL",
      y: 1290,
      e: r2,
      s: 1.15,
      fase: 0.4
    }));
  }

  /* 5 — abdomen: estabiliza; la pelvis y la lumbar quedan pegadas al piso */
  function EscAbdomen(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var piernas = 35 + 40 * reps(T, f(0.02), f(0.98), 1.5);
    var gris = animate({
      from: 0,
      to: 1,
      start: f(0.08),
      end: f(0.18)
    })(T);
    var empuja = M.draw(T, f(0.42), 0.4);
    var linea = M.draw(T, f(0.56), 0.5);
    var g = geo({});
    var foco = enLienzo(FIG, g.torso(0.3, 0));
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.45);
    var r2 = M.pop(T, f(0.6), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.18 + 0.03 * t,
      foco: foco,
      mira: [585, 1010]
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      piernas: piernas,
      muscGris: {
        abd: gris,
        obl: gris
      }
    }, function (gg) {
      return /*#__PURE__*/React.createElement("g", null, lumbarPegada(gg, linea), aprieta(gg, empuja));
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ABDOMEN ESTABILIZA",
      y: 270,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "LUMBAR AL PISO",
      y: 1290,
      e: r2,
      fase: 0.4
    }));
  }

  /* 6 — bajada: lenta, 3-2-1, la lumbar sigue pegada */
  function EscBajada(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var u = clamp((T - f(0.08)) / (f(0.9) - f(0.08)), 0, 1);
    var piernas = 90 * (1 - Easing.easeInOutSine(u));
    var n = u < 1 / 3 ? 3 : u < 2 / 3 ? 2 : 1;
    var anillo = u >= 1 ? 0 : 1 - u * 3 % 1;
    var tray = trayectoria(0, 90);
    var linea = M.draw(T, f(0.04), 0.4);
    var g = geo({});
    var cad = enLienzo(FIG, g.cadera);
    var zoom = 1.12 - 0.12 * Easing.easeInOutSine(u) + 0.02 * t;
    var fig = M.pop(T, at - 0.6, 0.5);
    var cuenta = M.pop(T, f(0.04), 0.45);
    var rotulo = M.pop(T, f(0.12), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: [cad[0], SUELO],
      mira: [cad[0] + 20 * (1 - u), SUELO]
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      piernas: piernas
    }, function (gg) {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: tray,
        color: C.GRY,
        sw: 15
      }), lumbarPegada(gg, linea), arcoMuslo(gg, 268, -1, C.GRN));
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 740,
      y: 500,
      e: cuenta,
      dy: M.life(T, 3, 5)
    }, /*#__PURE__*/React.createElement(B.Cuenta, {
      s: 0.95,
      n: n,
      p: anillo
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "BAJA LENTO",
      y: 270,
      e: rotulo,
      s: 1.25
    }));
  }

  /* comparacion arriba (mal) / abajo (bien): dos figuras, una encima de otra */
  var CMP = {
    s: 0.76,
    x: 6,
    pisoArriba: 800,
    pisoAbajo: 1340
  };
  function baseCmp(piso) {
    return {
      x: CMP.x,
      y: piso - PISO * CMP.s,
      s: CMP.s
    };
  }
  var JUICIO = [800, -330]; // X y visto: x en el lienzo, y relativa al piso de cada figura

  /* 7 — error 1: lumbar arqueada (hueco rojo) vs lumbar pegada */
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var piernas = 10 + 26 * reps(T, f(0.02), f(0.98), 1.5);
    var arco = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.2),
      ease: Easing.easeInOutCubic
    })(T);
    var falla = arco > 0.5 ? M.vibra(T, 44, 3) : 0;
    var hueco = M.draw(T, f(0.16), 0.35);
    var linea = M.draw(T, f(0.46), 0.45);
    var empuja = M.draw(T, f(0.52), 0.35);
    var bA = baseCmp(CMP.pisoArriba),
      bB = baseCmp(CMP.pisoAbajo);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.38), 0.45);
    var tacha = M.pop(T, f(0.18), 0.4);
    var visto = M.pop(T, f(0.58), 0.45);
    var r1 = M.pop(T, f(0.06), 0.45);
    var r2 = M.pop(T, f(0.44), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Acostado, {
      base: bA,
      e: arriba,
      dx: falla,
      dy: M.life(T, 3.6, 4),
      piernas: piernas,
      arco: arco,
      muscRojo: {
        erec: arco
      }
    }, function (gg) {
      if (!gg.hueco || gg.hueco.alto < 12) return null;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: contornoLumbar(gg, 0.06, 0.62),
        p: hueco,
        color: C.RED,
        sw: 20,
        hueco: 0.01
      }), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: U.suma(gg.hueco.abajo, [0, 4]),
        b: U.suma(gg.hueco.arriba, [0, 14]),
        p: hueco,
        color: C.RED,
        sw: 14,
        cabeza: 30
      }));
    }), /*#__PURE__*/React.createElement(Acostado, {
      base: bB,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5),
      piernas: piernas
    }, function (gg) {
      return /*#__PURE__*/React.createElement("g", null, lumbarPegada(gg, linea), aprieta(gg, empuja));
    }), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: CMP.pisoArriba + JUICIO[1],
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: CMP.pisoAbajo + JUICIO[1],
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.58), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "LUMBAR ARQUEADA",
      y: 240,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "LUMBAR PEGADA",
      y: 1440,
      e: r2,
      fase: 0.4
    }));
  }

  /* 8 — error 2: rodillas dobladas vs piernas estiradas */
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var piernas = 25 + 25 * reps(T, f(0.02), f(0.98), 1.5);
    var dobla = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.2),
      ease: Easing.easeInOutCubic
    })(T);
    var falla = dobla > 0.5 ? M.vibra(T, 44, 2) : 0;
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.16),
      end: f(0.26)
    })(T);
    var linea = M.draw(T, f(0.42), 0.45);
    var bA = baseCmp(CMP.pisoArriba),
      bB = baseCmp(CMP.pisoAbajo);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var tacha = M.pop(T, f(0.16), 0.4);
    var visto = M.pop(T, f(0.55), 0.45);
    var r1 = M.pop(T, f(0.05), 0.45);
    var r2 = M.pop(T, f(0.4), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Acostado, {
      base: bA,
      e: arriba,
      dx: falla,
      dy: M.life(T, 3.6, 4),
      piernas: piernas,
      rodilla: dobla
    }, function (gg) {
      return /*#__PURE__*/React.createElement(B.Anillo, {
        c: gg.rodilla,
        r: 96,
        p: anillo,
        color: C.RED,
        sw: 18
      });
    }), /*#__PURE__*/React.createElement(Acostado, {
      base: bB,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5),
      piernas: piernas
    }, function (gg) {
      return guiaPierna(gg, linea, C.GRN, 104);
    }), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: CMP.pisoArriba + JUICIO[1],
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: CMP.pisoAbajo + JUICIO[1],
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.55), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RODILLAS DOBLADAS",
      y: 240,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PIERNAS ESTIRADAS",
      y: 1440,
      e: r2,
      fase: 0.4
    }));
  }

  /* 9 — cierre: una repeticion limpia, todo encendido, visto grande */
  function EscCierre(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var u = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.46),
      ease: Easing.easeInOutSine
    })(T);
    var piernas = 90 * u;
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.4),
      end: f(0.5)
    })(T);
    var g = geo({});
    var cad = enLienzo(FIG, g.cadera);
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
      zoom: 1 + 0.1 * u + 0.03 * t,
      foco: [cad[0], SUELO],
      mira: [cad[0] + 20 * u, SUELO]
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      piernas: piernas,
      musc: {
        psoas: luz,
        recto: luz
      },
      muscGris: {
        abd: luz,
        obl: luz
      }
    }, function (gg) {
      return lumbarPegada(gg, luz);
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 720,
      y: 520,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.85,
      p: M.draw(T, f(0.5), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ELEVACI\xD3N DE PIERNAS",
      s: 1.25,
      y: 270,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1290,
      e: r2,
      fase: 0.4
    }));
  }

  /* =========================================================
     GUION — duracion y locucion de cada escena
     (~2,7 palabras por segundo). Total: 53 s + 3 s del cierre de marca
     que agrega reel.jsx = 56 s.
     ========================================================= */

  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 6.5,
    C: EscGancho,
    vo: '¿Haces elevaciones de piernas para el abdomen bajo? Mira qué músculos hacen realmente el trabajo.'
  }, {
    nombre: 'Posición',
    dur: 6,
    C: EscPosicion,
    vo: 'Acuéstate boca arriba y pon las manos debajo de los glúteos, con las palmas hacia abajo.'
  }, {
    nombre: 'Subida',
    dur: 6,
    C: EscSubida,
    vo: 'Con las piernas extendidas y juntas, súbelas lentamente hasta que queden perpendiculares al suelo.'
  }, {
    nombre: 'Quién trabaja',
    dur: 10,
    C: EscMusculos,
    vo: 'El movimiento es flexión de cadera: tiran de las piernas el iliopsoas y el recto femoral, con ayuda del sartorio y el tensor de la fascia lata.'
  }, {
    nombre: 'Abdomen',
    dur: 6,
    C: EscAbdomen,
    vo: 'El abdomen trabaja para mantener la pelvis y la zona lumbar pegadas al suelo.'
  }, {
    nombre: 'Bajada',
    dur: 5.5,
    C: EscBajada,
    vo: 'Baja las piernas lentamente, sin dejar que la espalda se despegue del suelo.'
  }, {
    nombre: 'Error 1',
    dur: 5.5,
    C: EscError1,
    vo: 'Error uno: arquear la zona lumbar. Mantén la espalda baja presionada contra el suelo.'
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    C: EscError2,
    vo: 'Error dos: doblar las rodillas. Mantenlas lo más estiradas posible.'
  }, {
    nombre: 'Cierre',
    dur: 3,
    C: EscCierre,
    vo: 'Así se hace una elevación de piernas.'
  }];
  global.REELS.registrar({
    id: 'elevacion-piernas',
    titulo: 'Elevación de piernas',
    escenas: ESCENAS
  });
})(window);
