/* GENERADO por compilar.js desde elevacion-piernas.jsx — no editar a mano. */
/* ============================================================
   ELEVACION DE PIERNAS — reel vertical 1080x1920 (~60 s con el cierre)
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
  var FIG = {
    x: 52,
    y: 210,
    s: 0.8
  }; // figura entera (piso en y 1250 del lienzo)

  function enLienzo(base, p) {
    return [base.x + p[0] * base.s, base.y + p[1] * base.s];
  }

  // pose acostada con las manos bajo los gluteos (manos 0 = al costado de la cintura)
  function pose(o) {
    var p = B.posePerfil.acostado({
      x: CADX,
      piso: PISO,
      piernas: o.piernas || 0,
      rodilla: o.rodilla || 0,
      arco: o.arco || 0
    });
    var g0 = B.geoPerfil({
      pose: p
    });
    var k = o.manos == null ? 1 : clamp(o.manos, 0, 1);
    var costado = [g0.cadera[0] + 150, PISO + 26];
    var bajo = [g0.gluteo[0] + 4, PISO - 16];
    var e = Easing.easeInOutCubic(k);
    p.mano = U.lerpP(costado, bajo, e);
    p.codo = [U.lerp(p.mano[0], p.hombro[0], 0.5) + 14 - 20 * (1 - e), PISO + 32];
    return p;
  }

  // el short de B.Perfil (mismos puntos), para volver a dibujarlo encima de la mano
  var SHORT = [[76, 64], [40, 66], [-58, 66], [-86, 24], [-86, -40], [-68, -84], [-6, -94], [76, -66]];
  function manga(cad, rod, frac, ra, rb) {
    var u = U.unidad(U.resta(rod, cad));
    var n = [-u[1], u[0]];
    var ruedo = U.lerpP(cad, rod, frac);
    var arriba = U.suma(cad, U.por(u, -12));
    return 'M ' + [U.suma(arriba, U.por(n, ra)), U.suma(ruedo, U.por(n, rb)), U.suma(ruedo, U.por(n, -rb)), U.suma(arriba, U.por(n, -ra))].map(U.pt).join(' L ') + ' Z';
  }

  // la mano se mete bajo el gluteo: el short se vuelve a trazar solo alrededor de la mano
  function bajoGluteo(g, id) {
    var short = U.blando(SHORT.map(function (q) {
      return g.pelvis(q[0], q[1]);
    }), 0.32);
    var m1 = manga(g.cadera, g.rodilla, 0.62, 66, 58),
      m2 = manga(g.cadera, g.rodilla2, 0.62, 66, 58);
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: id
    }, /*#__PURE__*/React.createElement("circle", {
      cx: g.mano[0] - 6,
      cy: g.mano[1] - 10,
      r: 50
    }))), /*#__PURE__*/React.createElement("g", {
      clipPath: 'url(#' + id + ')'
    }, /*#__PURE__*/React.createElement("g", {
      fill: C.GRY,
      stroke: C.INK,
      strokeWidth: 28,
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: short
    }), /*#__PURE__*/React.createElement("path", {
      d: m2
    }), /*#__PURE__*/React.createElement("path", {
      d: m1
    })), /*#__PURE__*/React.createElement("g", {
      fill: C.GRY,
      stroke: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: short
    }), /*#__PURE__*/React.createElement("path", {
      d: m2
    }), /*#__PURE__*/React.createElement("path", {
      d: m1
    }))));
  }
  function Acostado(props) {
    var id = U.useIdLocal('elev');
    var b = props.base || FIG;
    var po = pose(props);
    var oCad = [po.cadera[0] * b.s, (PISO - 120) * b.s];
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
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function (g) {
        return /*#__PURE__*/React.createElement(B.ColchonetaG, {
          x0: g.punta[0] - 70,
          x1: g.coronilla[0] + 60,
          y: g.piso
        });
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, bajoGluteo(g, id), props.children ? props.children(g) : null);
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

  // escuadra de 90 grados entre la pierna y el piso (detras del muslo)
  function Escuadra(props) {
    var g = props.g,
      l = props.l || 86;
    var x = g.cadera[0] - 104,
      y = g.piso - 4;
    var p = props.p == null ? 1 : props.p;
    var d = 'M ' + (x - l) + ' ' + y + ' L ' + (x - l) + ' ' + (y - l) + ' L ' + x + ' ' + (y - l);
    var largo = 2 * l;
    return /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: C.GRN,
      strokeWidth: 16,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: largo,
      strokeDashoffset: largo * (1 - p),
      opacity: props.opacity
    });
  }

  // linea verde de la zona lumbar apoyada en el piso
  function lineaLumbar(g, p, color) {
    var a = g.torso(0.16, 0)[0],
      b = g.torso(0.6, 0)[0];
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [[a, g.piso + 2], [b, g.piso + 2]],
      p: p,
      color: color || C.GRN,
      sw: 18,
      hueco: 0.01
    });
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: se pinta el abdomen, duda, y se enciende el iliopsoas */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var piernas = 90 * reps(T, f(0.0), f(0.96), 1.5);
    var abd = animate({
      from: 0,
      to: 1,
      start: f(0.28),
      end: f(0.38)
    })(T);
    var cambio = animate({
      from: 0,
      to: 1,
      start: f(0.64),
      end: f(0.72)
    })(T);
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.68),
      end: f(0.76)
    })(T);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.7),
      end: f(0.8)
    })(T);
    var g = geo({
      piernas: piernas
    });
    var cad = enLienzo(FIG, g.cadera);
    var panza = enLienzo(FIG, g.torso(0.4, g.anchoFrente(0.4)));
    var zoom = 1 + 0.3 * animate({
      from: 0,
      to: 1,
      start: f(0.66),
      end: f(0.82),
      ease: Easing.easeInOutCubic
    })(T) + 0.04 * t;
    var fig = M.pop(T, at - 0.6, 0.5);
    var titulo = M.pop(T, f(0.03), 0.45);
    var tacha = junta(M.pop(T, f(0.48), 0.4), sale(T, f(0.66)));
    var duda = M.pop(T, f(0.5), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: cad
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
      return /*#__PURE__*/React.createElement(B.Anillo, {
        c: gg.cadera,
        r: 150,
        p: anillo,
        color: C.YEL,
        sw: 16
      });
    })), /*#__PURE__*/React.createElement(Pos, {
      x: panza[0] - 69,
      y: panza[1] - 230,
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ELEVACI\xD3N DE PIERNAS",
      s: 1.25,
      y: 290,
      e: titulo
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "\xBFSOLO ABDOMEN?",
      y: 1420,
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
      start: f(0.3),
      end: f(0.6),
      ease: Easing.linear
    })(T);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.58),
      end: f(0.68)
    })(T);
    var flecha = M.draw(T, f(0.22), 0.5);
    var oFlecha = sale(T, f(0.62)).opacity;
    var g = geo({
      manos: 1
    });
    var cad = enLienzo(FIG, g.cadera);
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.1),
      end: f(0.34),
      ease: Easing.easeInOutCubic
    })(T);
    var zoom = 1 + 0.55 * acerca + 0.03 * t;
    var mira = U.lerpP(cad, [540, 1000], acerca);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rotulo = M.pop(T, f(0.5), 0.45);
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
      manos: manos
    }, function (gg) {
      var y = gg.piso + 80;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [gg.cadera[0] + 200, y],
        b: [gg.cadera[0] + 10, y],
        p: flecha,
        opacity: oFlecha,
        color: C.YEL
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: U.suma(gg.gluteo, [4, -6]),
        r: 80,
        p: anillo,
        color: C.YEL,
        sw: 16
      }));
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "MANOS BAJO GL\xDATEOS",
      y: 300,
      e: rotulo
    }));
  }

  /* 3 — subida: piernas estiradas de 0 a 90 grados */
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
      start: f(0.3),
      end: f(0.84),
      ease: Easing.easeInOutSine
    })(T);
    var piernas = 90 * u;
    var guia = M.draw(T, f(0.06), 0.5);
    var escuadra = M.draw(T, f(0.86), 0.35);
    var tray = trayectoria(0, 90);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.45);
    var r2 = M.pop(T, f(0.8), 0.45);
    var visto = M.pop(T, f(0.88), 0.45);
    var g = geo({
      piernas: 90
    });
    var vPos = enLienzo(FIG, [g.cadera[0] - 420, g.piso - 330]);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [540, 1000]
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      piernas: piernas
    }, function (gg) {
      var a = angMuslo(gg);
      // guia recta sobre la pierna: muestra que va estirada
      var uP = U.unidad(U.resta(gg.tobillo, gg.cadera));
      var nP = [uP[1], -uP[0]];
      var g0 = U.suma(gg.cadera, U.por(nP, -120));
      var g1 = U.suma(gg.tobillo, U.por(nP, -120));
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: tray,
        p: u,
        color: C.YEL,
        sw: 17
      }), /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [U.suma(g0, U.por(uP, 120)), U.suma(g1, U.por(uP, 60))],
        p: guia,
        color: C.YEL,
        sw: 15
      }), u > 0.04 ? /*#__PURE__*/React.createElement(B.Arco, {
        c: gg.cadera,
        r: 250,
        a0: 181,
        a1: a,
        color: C.YEL,
        sw: 18,
        cabeza: 38
      }) : null, /*#__PURE__*/React.createElement(Escuadra, {
        g: gg,
        p: escuadra
      }));
    })), /*#__PURE__*/React.createElement(Pos, {
      x: vPos[0] - 66,
      y: vPos[1] - 60,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.88), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PIERNAS ESTIRADAS",
      y: 300,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "HASTA 90\xB0",
      y: 1420,
      e: r2,
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
    var piernas = 25 + 55 * reps(T, f(0.04), f(0.98), 2);
    var arco = M.draw(T, f(0.1), 0.5);
    var psoas = animate({
      from: 0,
      to: 1,
      start: f(0.38),
      end: f(0.46)
    })(T);
    var recto = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.58)
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
      start: f(0.8),
      end: f(0.88)
    })(T);
    var g = geo({
      piernas: 50
    });
    var cad = enLienzo(FIG, g.cadera);
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0),
      end: f(0.2),
      ease: Easing.easeInOutCubic
    })(T);
    var zoom = 1 + 1.0 * acerca + 0.04 * t;
    var mira = U.lerpP(cad, [560, 1040], acerca);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.38), 0.45);
    var r2 = M.pop(T, f(0.5), 0.45);
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
        r: 230,
        a0: 182,
        a1: a,
        p: arco,
        color: C.GRN,
        sw: 18,
        cabeza: 38
      });
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ILIOPSOAS",
      y: 300,
      e: r1,
      s: 1.2
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RECTO FEMORAL",
      y: 1440,
      e: r2,
      fase: 0.4
    }));
  }

  /* 5 — abdomen: estabiliza; la lumbar queda pegada al piso */
  function EscAbdomen(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var piernas = 15 + 60 * reps(T, f(0.02), f(0.98), 1.5);
    var gris = animate({
      from: 0,
      to: 1,
      start: f(0.08),
      end: f(0.18)
    })(T);
    var linea = M.draw(T, f(0.55), 0.5);
    var empuja = M.draw(T, f(0.6), 0.4);
    var g = geo({
      piernas: 40
    });
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
      zoom: 1.35 + 0.04 * t,
      foco: foco,
      mira: [600, 1000]
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      piernas: piernas,
      muscGris: {
        abd: gris,
        obl: gris
      }
    }, function (gg) {
      var xs = [0.26, 0.44];
      return /*#__PURE__*/React.createElement("g", null, lineaLumbar(gg, linea), xs.map(function (q, i) {
        var p0 = gg.torso(q, gg.anchoFrente(q) + 150);
        var p1 = gg.torso(q, gg.anchoFrente(q) + 30);
        return /*#__PURE__*/React.createElement(B.FlechaS, {
          key: i,
          a: p0,
          b: p1,
          p: empuja,
          color: C.GRN
        });
      }));
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ABDOMEN ESTABILIZA",
      y: 300,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "LUMBAR AL PISO",
      y: 1420,
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
    var u = clamp((T - f(0.08)) / (f(0.88) - f(0.08)), 0, 1);
    var piernas = 90 * (1 - Easing.easeInOutSine(u));
    var n = u < 1 / 3 ? 3 : u < 2 / 3 ? 2 : 1;
    var anillo = u >= 1 ? 0 : 1 - u * 3 % 1;
    var tray = trayectoria(0, 90);
    var fig = M.pop(T, at - 0.6, 0.5);
    var cuenta = M.pop(T, f(0.04), 0.45);
    var rotulo = M.pop(T, f(0.2), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [540, 1000]
    }, /*#__PURE__*/React.createElement(Acostado, {
      e: fig,
      dy: M.life(T, 3.6, 4),
      piernas: piernas
    }, function (gg) {
      var a = angMuslo(gg);
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: tray,
        color: C.GRY,
        sw: 15
      }), lineaLumbar(gg, 1), u > 0.04 ? /*#__PURE__*/React.createElement(B.Arco, {
        c: gg.cadera,
        r: 250,
        a0: 269,
        a1: a,
        color: C.GRN,
        sw: 18,
        cabeza: 38
      }) : null);
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 760,
      y: 560,
      e: cuenta,
      dy: M.life(T, 3, 5)
    }, /*#__PURE__*/React.createElement(B.Cuenta, {
      s: 0.95,
      n: n,
      p: anillo
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "BAJA LENTO",
      y: 300,
      e: rotulo,
      s: 1.2
    }));
  }

  /* comparacion arriba (mal) / abajo (bien): dos figuras mas chicas */
  var CMP = {
    s: 0.72,
    x: 82,
    pisoArriba: 830,
    pisoAbajo: 1370
  };
  function baseCmp(piso) {
    return {
      x: CMP.x,
      y: piso - PISO * CMP.s,
      s: CMP.s
    };
  }

  /* 7 — error 1: lumbar arqueada (hueco rojo) vs lumbar pegada */
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var piernas = 15 + 30 * reps(T, f(0.02), f(0.98), 1.5);
    var arco = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.2),
      ease: Easing.easeInOutCubic
    })(T);
    var falla = arco > 0.5 ? M.vibra(T, 44, 3) : 0;
    var hueco = M.draw(T, f(0.14), 0.35);
    var linea = M.draw(T, f(0.5), 0.45);
    var bA = baseCmp(CMP.pisoArriba),
      bB = baseCmp(CMP.pisoAbajo);
    var gA = geo({
      piernas: 30,
      arco: 1
    });
    var jA = enLienzo(bA, [gA.cuello[0] - 40, gA.piso - 330]);
    var jB = enLienzo(bB, [gA.cuello[0] - 40, gA.piso - 330]);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.4), 0.45);
    var tacha = M.pop(T, f(0.18), 0.4);
    var visto = M.pop(T, f(0.6), 0.45);
    var r1 = M.pop(T, f(0.06), 0.45);
    var r2 = M.pop(T, f(0.46), 0.45);
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
      return gg.hueco && gg.hueco.alto > 12 ? /*#__PURE__*/React.createElement(B.FlechaS, {
        a: U.suma(gg.hueco.abajo, [0, 6]),
        b: gg.hueco.arriba,
        p: hueco,
        color: C.RED,
        sw: 14,
        cabeza: 30
      }) : null;
    }), /*#__PURE__*/React.createElement(Acostado, {
      base: bB,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5),
      piernas: piernas
    }, function (gg) {
      return lineaLumbar(gg, linea);
    }), /*#__PURE__*/React.createElement(Pos, {
      x: jA[0] - 69,
      y: jA[1] - 69,
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Pos, {
      x: jB[0] - 66,
      y: jB[1] - 60,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.6), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "LUMBAR ARQUEADA",
      y: 250,
      e: r1,
      s: 1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "LUMBAR PEGADA",
      y: 1450,
      e: r2,
      s: 1,
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
    var piernas = 30 + 30 * reps(T, f(0.02), f(0.98), 1.5);
    var dobla = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.2),
      ease: Easing.easeInOutCubic
    })(T);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.16),
      end: f(0.26)
    })(T);
    var linea = M.draw(T, f(0.42), 0.45);
    var bA = baseCmp(CMP.pisoArriba),
      bB = baseCmp(CMP.pisoAbajo);
    var gA = geo({
      piernas: 30
    });
    var jA = enLienzo(bA, [gA.cuello[0] - 40, gA.piso - 330]);
    var jB = enLienzo(bB, [gA.cuello[0] - 40, gA.piso - 330]);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var tacha = M.pop(T, f(0.14), 0.4);
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
      dx: M.vibra(T, 44, 2),
      dy: M.life(T, 3.6, 4),
      piernas: piernas,
      rodilla: dobla
    }, function (gg) {
      return /*#__PURE__*/React.createElement(B.Anillo, {
        c: gg.rodilla,
        r: 90,
        p: anillo,
        color: C.RED,
        sw: 16
      });
    }), /*#__PURE__*/React.createElement(Acostado, {
      base: bB,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5),
      piernas: piernas
    }, function (gg) {
      var uP = U.unidad(U.resta(gg.tobillo, gg.cadera));
      var nP = [uP[1], -uP[0]];
      var a = U.suma(gg.cadera, U.por(nP, -100));
      var b = U.suma(gg.tobillo, U.por(nP, -100));
      return /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [U.suma(a, U.por(uP, 90)), U.suma(b, U.por(uP, 40))],
        p: linea,
        color: C.GRN,
        sw: 18,
        hueco: 0.01
      });
    }), /*#__PURE__*/React.createElement(Pos, {
      x: jA[0] - 69,
      y: jA[1] - 69,
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Pos, {
      x: jB[0] - 66,
      y: jB[1] - 60,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.55), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RODILLAS DOBLADAS",
      y: 250,
      e: r1,
      s: 1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PIERNAS ESTIRADAS",
      y: 1450,
      e: r2,
      s: 1,
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
    var piernas = 90 * animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.46),
      ease: Easing.easeInOutSine
    })(T);
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
      foco: [540, 1000]
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
      return lineaLumbar(gg, luz);
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 700,
      y: 560,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.85,
      p: M.draw(T, f(0.5), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ELEVACI\xD3N DE PIERNAS",
      s: 1.25,
      y: 290,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1420,
      e: r2,
      fase: 0.4
    }));
  }

  /* =========================================================
     GUION — duracion y locucion de cada escena
     (~2,7 palabras por segundo). Total: 52 s + 3 s del cierre de marca.
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
    dur: 9.5,
    C: EscMusculos,
    vo: 'El movimiento es flexión de cadera: tiran de las piernas el iliopsoas y el recto femoral, con ayuda del sartorio y el tensor de la fascia lata.'
  }, {
    nombre: 'Abdomen',
    dur: 6,
    C: EscAbdomen,
    vo: 'El abdomen trabaja para mantener la pelvis y la zona lumbar pegadas al suelo.'
  }, {
    nombre: 'Bajada',
    dur: 5,
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
