/* GENERADO por compilar.js desde dominadas.jsx — no editar a mano. */
/* ============================================================
   DOMINADAS — reel vertical 1080x1920 (~57,5 s con el cierre de marca)
   Fuente tecnica: libro de biomecanica, pag. 58. Agarre un poco mas
   ancho que los hombros, brazos extendidos y pies en el aire; tirar
   hasta que el pecho quede cerca de la barra llevando los codos hacia
   abajo; bajar con control hasta estirar del todo. Fase concentrica:
   aduccion de hombro, flexion de codo, rotacion descendente de la
   escapula. Dorsal ancho primario; biceps, deltoides posterior,
   trapecio y redondo mayor sinergistas. Errores: recorrido parcial y
   balanceo del cuerpo.

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
  var Camara = A.Camara,
    Recorte = A.Recorte;

  /* =========================================================
     LA FIGURA: B.Espalda colgada, con las manos fijas en la barra
     ========================================================= */

  var EW = 1100,
    EH = 1000; // viewBox de B.Espalda
  var AN = 120; // y del viewBox donde quedan las manos (siempre la misma)
  var PISO_V = AN + 1585 + 240; // piso de la estacion (los pies cuelgan 240 por encima)

  // ubicacion de la figura en el lienzo: s y la y de la barra en el lienzo
  function base(s, barY, cx) {
    if (cx == null) cx = 540;
    return {
      x: cx - 550 * s,
      y: barY - AN * s,
      s: s
    };
  }
  var GR = base(0.82, 610); // figura grande (escenas de una sola figura)
  var GT = base(0.82, 650); // igual, un poco mas abajo: deja lugar al titulo grande
  var AG = base(0.6, 400); // figura entera con el piso (escena del agarre)

  function enLienzo(b, p) {
    return [b.x + p[0] * b.s, b.y + p[1] * b.s];
  }
  var OPC = {
    brazos: 'arriba',
    cuerpoEntero: true,
    rodillas: 1
  };
  // geometria anclada (manos en AN) y geometria del cuerpo (sin anclar: el torso no se mueve)
  function geo(o) {
    return B.geoEspalda(Object.assign({}, OPC, {
      anclaManos: AN
    }, o));
  }
  function geoCuerpo(o) {
    return B.geoEspalda(Object.assign({}, OPC, o));
  }

  // barra sola (sin parantes), con las zonas de agarre grises, como B.BarraG
  function BarraSola(props) {
    var x0 = props.x0 == null ? -160 : props.x0,
      x1 = props.x1 == null ? EW + 160 : props.x1;
    var gr = 40,
      y = AN;
    var zonas = [250, 850].map(function (x) {
      return 'M ' + (x - 85) + ' ' + (y - gr / 2) + ' h 170 v ' + gr + ' h -170 Z';
    }).join(' ');
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: x0,
      y: y - gr / 2,
      width: x1 - x0,
      height: gr,
      rx: gr / 2,
      fill: "#ffffff"
    }), /*#__PURE__*/React.createElement("path", {
      d: zonas,
      fill: C.GRY
    }), /*#__PURE__*/React.createElement("path", {
      d: zonas,
      fill: "none",
      stroke: C.INK,
      strokeWidth: 11
    }), /*#__PURE__*/React.createElement("rect", {
      x: x0,
      y: y - gr / 2,
      width: x1 - x0,
      height: gr,
      rx: gr / 2,
      fill: "none",
      stroke: C.INK,
      strokeWidth: 15
    }));
  }

  // la espalda colgada + la barra detras (o la estacion entera con el piso)
  function Colgado(props) {
    var s = props.s;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: EW * s,
        height: EH * s
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: EW * s,
      height: EH * s,
      viewBox: '0 0 ' + EW + ' ' + EH,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        display: 'block',
        overflow: 'visible'
      }
    }, props.estacion ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
      y: PISO_V,
      x0: -400,
      x1: EW + 400
    }), /*#__PURE__*/React.createElement(B.BarraG, {
      vista: "frente",
      x: 550,
      y: AN,
      piso: PISO_V
    })) : /*#__PURE__*/React.createElement(BarraSola, {
      x0: props.x0,
      x1: props.x1
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0
      }
    }, /*#__PURE__*/React.createElement(B.Espalda, {
      s: s,
      brazos: "arriba",
      cuerpoEntero: true,
      rodillas: 1,
      anclaManos: AN,
      sube: props.sube,
      depr: props.depr,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo
    }, props.children)));
  }

  /* ---------------- overlays ---------------- */

  // flechas verdes que empujan los codos hacia abajo (siguen al codo)
  function flechasCodo(g, p, opacity) {
    return [g.izq, g.der].map(function (L, i) {
      return /*#__PURE__*/React.createElement(B.FlechaS, {
        key: 'fc' + i,
        a: U.suma(L.E, [0, 60]),
        b: U.suma(L.E, [0, 260]),
        p: p,
        opacity: opacity,
        color: C.GRN,
        sw: 24,
        cabeza: 50
      });
    });
  }

  // guia recta al costado de cada brazo (brazos estirados)
  function guiasBrazo(g, p, color, sep) {
    if (sep == null) sep = 78;
    return [[g.izq, 1], [g.der, -1]].map(function (par, i) {
      var L = par[0];
      var u = U.unidad(U.resta(L.H, L.J));
      var n = U.por([u[1], -u[0]], par[1]);
      return /*#__PURE__*/React.createElement(B.Puntos, {
        key: 'gb' + i,
        pts: [U.suma(L.J, U.por(n, sep)), U.suma(L.H, U.suma(U.por(n, sep), U.por(u, -40)))],
        p: p,
        color: color || C.GRN,
        sw: 22
      });
    });
  }
  function angulo(v) {
    return Math.atan2(v[1], v[0]) * 180 / Math.PI;
  }
  function mover(pts, dy) {
    return pts.map(function (p) {
      return [p[0], p[1] + dy];
    });
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: sube pensando solo en subir; despues los codos abajo y el dorsal se enciende */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var rep1 = T < f(0.48) ? reps(T, f(0.08), f(0.46), 1) : 0;
    var rep2 = animate({
      from: 0,
      to: 1,
      start: f(0.52),
      end: f(0.8),
      ease: Easing.easeInOutSine
    })(T);
    var sube = rep1 + rep2;
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.6),
      end: f(0.76)
    })(T);
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.8),
      ease: Easing.easeInOutCubic
    })(T);
    var zoom = 1 + 0.12 * acerca + 0.03 * t;
    var fig = M.pop(T, at - 0.6, 0.5);
    var titulo = M.pop(T, f(0.03), 0.45);
    var oArriba = junta(M.pop(T, f(0.16), 0.4), sale(T, f(0.46))).opacity;
    var pArriba = M.draw(T, f(0.16), 0.4);
    var pCodos = M.draw(T, f(0.56), 0.4);
    var rotulo = M.pop(T, f(0.64), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: enLienzo(GT, [550, 0])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: GT.x,
      y: GT.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(Colgado, {
      s: GT.s,
      sube: sube,
      musc: {
        dor: luz
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [990, g.cabeza[1] + 170],
        b: [990, g.cabeza[1] - 300],
        p: pArriba,
        opacity: oArriba,
        color: C.GRY,
        sw: 42,
        cabeza: 80
      }), flechasCodo(g, pCodos));
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "DOMINADAS",
      s: 1.3,
      y: 236,
      e: titulo
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS ABAJO",
      y: 1450,
      e: rotulo,
      fase: 0.4
    }));
  }

  /* 2 — agarre: un poco mas ancho que los hombros, brazos estirados, pies en el aire */
  function EscAgarre(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var estira = animate({
      from: 0,
      to: 1,
      start: f(0.42),
      end: f(0.54),
      ease: Easing.easeInOutCubic
    })(T);
    var sube = 0.14 * (1 - estira);
    var aleja = animate({
      from: 0,
      to: 1,
      start: f(0.6),
      end: f(0.76),
      ease: Easing.easeInOutCubic
    })(T);
    var foco = enLienzo(AG, [550, 330]);
    var zoom = U.lerp(1.5, 1, aleja) + 0.02 * t;
    var mira = U.lerpP([540, 665], foco, aleja);
    var pHombros = M.draw(T, f(0.08), 0.4);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.16),
      end: f(0.26)
    })(T);
    var pAncho = M.draw(T, f(0.22), 0.35);
    var pBrazos = M.draw(T, f(0.52), 0.4);
    var pPies = M.draw(T, f(0.76), 0.35);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = junta(M.pop(T, f(0.06), 0.45), sale(T, f(0.42)));
    var r2 = M.pop(T, f(0.47), 0.45);
    var visto = M.pop(T, f(0.84), 0.45);
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
      x: AG.x,
      y: AG.y,
      e: fig,
      dy: M.life(T, 3.6, 3)
    }, /*#__PURE__*/React.createElement(Colgado, {
      s: AG.s,
      sube: sube,
      estacion: true
    }, function (g) {
      var L = g.izq,
        R = g.der;
      var yA = AN + 120;
      var medio = (g.piso + PISO_V) / 2;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [[L.A[0], L.A[1] - 30], [L.A[0], AN + 46]],
        p: pHombros,
        color: C.GRY,
        sw: 28
      }), /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [[R.A[0], R.A[1] - 30], [R.A[0], AN + 46]],
        p: pHombros,
        color: C.GRY,
        sw: 28
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: L.H,
        r: 70,
        p: anillo,
        color: C.YEL,
        sw: 20
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: R.H,
        r: 70,
        p: anillo,
        color: C.YEL,
        sw: 20
      }), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [L.A[0] - 14, yA],
        b: [L.H[0] - 30, yA],
        p: pAncho,
        color: C.YEL,
        sw: 22,
        cabeza: 44
      }), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [R.A[0] + 14, yA],
        b: [R.H[0] + 30, yA],
        p: pAncho,
        color: C.YEL,
        sw: 22,
        cabeza: 44
      }), guiasBrazo(g, pBrazos), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [550, medio],
        b: [550, g.piso + 10],
        p: pPies,
        color: C.GRN,
        sw: 22,
        cabeza: 42
      }), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [550, medio],
        b: [550, PISO_V - 12],
        p: pPies,
        color: C.GRN,
        sw: 22,
        cabeza: 42
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 585,
      y: 1318,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.55,
      p: M.draw(T, f(0.84), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "AGARRE ANCHO",
      y: 236,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "BRAZOS ESTIRADOS",
      y: 236,
      e: r2
    }));
  }

  /* 3 — tiron: el pecho sube hasta la barra; despues, los codos hacia abajo */
  function EscTiron(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);

    // primera subida al ritmo de "...el pecho quede cerca de la barra";
    // la segunda, con los codos, cuando la voz dice "llevar los codos hacia abajo"
    var ida1 = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.48),
      ease: Easing.easeInOutSine
    })(T);
    var baja = animate({
      from: 0,
      to: 1,
      start: f(0.56),
      end: f(0.66),
      ease: Easing.easeInOutSine
    })(T);
    var ida2 = animate({
      from: 0,
      to: 1,
      start: f(0.68),
      end: f(0.94),
      ease: Easing.easeInOutSine
    })(T);
    var sube = ida1 - baja + ida2;
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.74),
      end: f(0.86)
    })(T);
    var pLinea = M.draw(T, f(0.06), 0.45);
    var pCodos = M.draw(T, f(0.66), 0.4);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.3), 0.45);
    var r2 = M.pop(T, f(0.68), 0.45);
    // el visto aparece cada vez que el pecho llega a la barra (y se va mientras baja)
    var segunda = T >= f(0.62);
    var visto = segunda ? M.pop(T, f(0.93), 0.4) : junta(M.pop(T, f(0.48), 0.45), sale(T, f(0.56)));
    var pVisto = segunda ? M.draw(T, f(0.93), 0.35) : M.draw(T, f(0.48), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [540, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: GR.x,
      y: GR.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Colgado, {
      s: GR.s,
      sube: sube,
      musc: {
        dor: luz
      }
    }, function (g) {
      var yPecho = g.izq.J[1] + 64;
      var llega = sube > 0.96;
      var falta = yPecho - (AN + 40); // distancia del pecho a la barra
      var oFalta = clamp((falta - 50) / 80, 0, 1) * pLinea;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [[-60, yPecho], [EW + 60, yPecho]],
        p: pLinea,
        color: llega ? C.GRN : C.YEL,
        sw: 20
      }), [40, EW - 40].map(function (x, i) {
        return /*#__PURE__*/React.createElement(B.FlechaS, {
          key: 'fp' + i,
          a: [x, yPecho - 14],
          b: [x, AN + 40],
          opacity: oFalta,
          color: C.YEL,
          sw: 22,
          cabeza: 46
        });
      }), flechasCodo(g, pCodos));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 850,
      y: 380,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.55,
      p: pVisto
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PECHO A LA BARRA",
      y: 236,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS HACIA ABAJO",
      y: 1450,
      e: r2,
      fase: 0.4
    }));
  }

  /* 4 — biomecanica: los dos brazos bajan por afuera (aduccion, plano frontal);
         despues zoom a las escapulas: el angulo inferior gira hacia la columna */
  var GEO0 = geoCuerpo({
    sube: 0
  });
  function angBrazo(L) {
    return (angulo(U.resta(L.E, L.J)) + 360) % 360;
  }
  var ANG0 = angBrazo(GEO0.izq); // ~247: el humero colgado apunta arriba y afuera

  // escapula como triangulo: angulo superior, angulo inferior y angulo lateral (glenoides)
  function triEscapula(L) {
    return [L.angSup, L.angInf, U.lerpP(L.espinaLat, L.bordeLat, 0.35)];
  }
  function espejo(pts) {
    return pts.map(function (p) {
      return [EW - p[0], p[1]];
    });
  }
  function rotar(p, c, grados) {
    var a = grados * Math.PI / 180,
      d = U.resta(p, c);
    return [c[0] + d[0] * Math.cos(a) - d[1] * Math.sin(a), c[1] + d[0] * Math.sin(a) + d[1] * Math.cos(a)];
  }
  function centro(pts) {
    var x = 0,
      y = 0;
    pts.forEach(function (p) {
      x += p[0];
      y += p[1];
    });
    return [x / pts.length, y / pts.length];
  }
  function EscBiomecanica(props) {
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
      start: f(0.04),
      end: f(0.46),
      ease: Easing.easeInOutSine
    })(T);
    var g = geo({
      sube: sube
    });

    // la camara sigue al cuerpo: primero los dos hombros, despues las escapulas
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.62),
      ease: Easing.easeInOutCubic
    })(T);
    var focoA = enLienzo(GR, [550, g.izq.J[1] + 40]);
    var focoB = enLienzo(GR, [550, g.izq.angSup[1] + 100]);
    var foco = U.lerpP(focoA, focoB, acerca);
    var zoom = U.lerp(1.3, 1.85, acerca) + 0.03 * t;
    var mira = [540, U.lerp(900, 950, acerca)];
    var oBrazos = junta(M.pop(T, f(0.06), 0.3), sale(T, f(0.5))).opacity;
    var gira = animate({
      from: 0,
      to: 1,
      start: f(0.62),
      end: f(0.84),
      ease: Easing.easeInOutCubic
    })(T);
    var oEsc = animate({
      from: 0,
      to: 1,
      start: f(0.55),
      end: f(0.62)
    })(T);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.12), 0.45);
    var r2 = M.pop(T, f(0.62), 0.45);
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
      x: GR.x,
      y: GR.y,
      e: fig,
      dy: M.life(T, 3.6, 3)
    }, /*#__PURE__*/React.createElement(Colgado, {
      s: GR.s,
      sube: sube
    }, function (g) {
      var L = g.izq;
      var a1 = angBrazo(L);
      var dir0 = U.polar(ANG0, 1);
      // escapula: de donde estaba colgado (fantasma gris) a donde esta ahora
      // (el giro real del rig es de ~17 grados; se exagera 10 mas para que se lea)
      var antes0 = mover(triEscapula(GEO0.izq), g.dy);
      var c0 = centro(antes0);
      var antes = antes0.map(function (p) {
        return rotar(p, c0, 10);
      });
      var ahora = triEscapula(L);
      var va = antes.map(function (p, i) {
        return U.lerpP(p, ahora[i], gira);
      });
      var c = centro(ahora);
      var rI = U.largo(U.resta(ahora[1], c)) + 34;
      var angI = angulo(U.resta(ahora[1], c));
      var lados = [[va, antes, 1], [espejo(va), espejo(antes), -1]];
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
        opacity: oBrazos
      }, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [L.J, U.suma(L.J, U.por(dir0, 215))],
        color: C.GRY,
        sw: 20
      }), /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [g.der.J, U.suma(g.der.J, U.por([-dir0[0], dir0[1]], 215))],
        color: C.GRY,
        sw: 20
      }), sube > 0.03 ? /*#__PURE__*/React.createElement(B.Arco, {
        c: L.J,
        r: 250,
        a0: ANG0,
        a1: a1,
        color: C.GRN,
        sw: 24,
        cabeza: 52
      }) : null, sube > 0.03 ? /*#__PURE__*/React.createElement(B.Arco, {
        c: g.der.J,
        r: 250,
        a0: 180 - ANG0,
        a1: 180 - a1,
        color: C.GRN,
        sw: 24,
        cabeza: 52
      }) : null), lados.map(function (par, i) {
        var cerrado = par[1].concat([par[1][0]]);
        var a0 = par[2] > 0 ? angI + 42 : 180 - angI - 42;
        var aF = par[2] > 0 ? angI + 4 : 180 - angI - 4;
        var cc = par[2] > 0 ? c : [EW - c[0], c[1]];
        return /*#__PURE__*/React.createElement("g", {
          key: 'esc' + i,
          opacity: oEsc
        }, /*#__PURE__*/React.createElement(B.Puntos, {
          pts: cerrado,
          color: C.GRY,
          sw: 18,
          hueco: 30
        }), /*#__PURE__*/React.createElement("path", {
          d: U.blando(par[0], 0.22),
          fill: C.YEL,
          stroke: C.INK,
          strokeWidth: 12,
          strokeLinejoin: "round"
        }), /*#__PURE__*/React.createElement(B.Arco, {
          c: cc,
          r: rI,
          a0: a0,
          a1: aF,
          p: gira,
          color: C.GRN,
          sw: 22,
          cabeza: 48
        }));
      }));
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ADUCCI\xD3N DEL HOMBRO",
      y: 236,
      e: r1,
      s: 1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ROTACI\xD3N DESCENDENTE",
      y: 1450,
      e: r2,
      s: 1,
      fase: 0.4
    }));
  }

  /* 5 — bajada: lenta, 3-2-1, hasta estirar los brazos; el dorsal se estira */
  function EscBajada(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var u = clamp((T - f(0.06)) / (f(0.7) - f(0.06)), 0, 1);
    var sube = 1 - Easing.easeInOutSine(u);
    var n = u < 1 / 3 ? 3 : u < 2 / 3 ? 2 : 1;
    var anillo = u >= 1 ? 0 : 1 - u * 3 % 1;
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.02),
      end: f(0.1)
    })(T); // el dorsal trabaja toda la bajada

    var pBrazos = M.draw(T, f(0.7), 0.4);
    var pEstira = M.draw(T, f(0.76), 0.4);
    var fig = M.pop(T, at - 0.6, 0.5);
    var cuenta = junta(M.pop(T, f(0.04), 0.45), sale(T, f(0.8)));
    var rotulo = M.pop(T, f(0.1), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [540, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: GR.x,
      y: GR.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Colgado, {
      s: GR.s,
      sube: sube,
      musc: {
        dor: luz
      }
    }, function (g) {
      var lados = [[g.izq, 1], [g.der, -1]];
      return /*#__PURE__*/React.createElement("g", null, guiasBrazo(g, pBrazos), lados.map(function (par, i) {
        var L = par[0];
        var abajo = [550 - par[1] * 150, g.cintura[1] - 90];
        var m = U.lerpP(abajo, L.X, 0.5);
        return /*#__PURE__*/React.createElement("g", {
          key: 'es' + i
        }, /*#__PURE__*/React.createElement(B.FlechaS, {
          a: m,
          b: U.lerpP(abajo, L.X, 0.08),
          p: pEstira,
          color: C.GRN,
          sw: 20,
          cabeza: 40
        }), /*#__PURE__*/React.createElement(B.FlechaS, {
          a: m,
          b: U.lerpP(abajo, L.X, 0.92),
          p: pEstira,
          color: C.GRN,
          sw: 20,
          cabeza: 40
        }));
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 40,
      y: 880,
      e: cuenta,
      dy: M.life(T, 3, 5)
    }, /*#__PURE__*/React.createElement(B.Cuenta, {
      s: 0.85,
      n: n,
      p: anillo
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "BAJA CON CONTROL",
      y: 236,
      e: rotulo
    }));
  }

  /* 6 — musculos: el dorsal en amarillo; los ayudantes en gris, al ritmo de la voz.
         Cada ayudante se marca con un anillo que late cuando se nombra. */
  function EscMusculos(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var dor = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.14)
    })(T);
    var rM = animate({
      from: 0,
      to: 1,
      start: f(0.48),
      end: f(0.56)
    })(T);
    var dp = animate({
      from: 0,
      to: 1,
      start: f(0.62),
      end: f(0.7)
    })(T);
    var tra = animate({
      from: 0,
      to: 1,
      start: f(0.76),
      end: f(0.84)
    })(T);
    var sube = 0.62 + M.life(T, 3, 0.05);
    // anillo que aparece cuando se nombra el musculo y se va solo
    function late(a) {
      return animate({
        from: 0,
        to: 1,
        start: f(a),
        end: f(a + 0.05),
        ease: Easing.easeOutBack
      })(T) * animate({
        from: 1,
        to: 0,
        start: f(a + 0.13),
        end: f(a + 0.19)
      })(T);
    }
    var lrM = late(0.48),
      lDp = late(0.62),
      lTra = late(0.76);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.45);
    var r2 = M.pop(T, f(0.33), 0.45); // el biceps no se ve de espaldas: lo nombra el rotulo

    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.45 + 0.05 * t,
      foco: enLienzo(GR, [550, 430]),
      mira: [540, 930]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: GR.x,
      y: GR.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Colgado, {
      s: GR.s,
      sube: sube,
      musc: {
        dor: dor,
        tra: tra
      },
      muscGris: {
        rM: rM,
        dp: dp
      }
    }, function (g) {
      var anillos = [];
      [g.izq, g.der].forEach(function (L, i) {
        anillos.push(/*#__PURE__*/React.createElement(B.Anillo, {
          key: 'r' + i,
          c: L.rMC,
          r: 70,
          p: lrM,
          color: C.INK,
          sw: 14
        }));
        anillos.push(/*#__PURE__*/React.createElement(B.Anillo, {
          key: 'p' + i,
          c: U.lerpP(L.A, L.E, 0.3),
          r: 88,
          p: lDp,
          color: C.INK,
          sw: 14
        }));
      });
      // el trapecio, entre las escapulas y por debajo de la cabeza (sin cruzarla)
      anillos.push(/*#__PURE__*/React.createElement(B.Anillo, {
        key: "t",
        c: [550, g.izq.angSup[1] + 58],
        r: 124,
        p: lTra,
        color: C.INK,
        sw: 14
      }));
      return /*#__PURE__*/React.createElement("g", null, anillos);
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "DORSAL ANCHO",
      y: 236,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "+ B\xCDCEPS Y TRAPECIO",
      y: 1450,
      e: r2,
      s: 1,
      fase: 0.4
    }));
  }

  /* =========================================================
     ERROR 1: comparacion arriba (mal) / abajo (bien), de espaldas,
     recortada de la barra a la cintura como en el Face Pull
     ========================================================= */

  // cada mitad tiene su ventana: la de arriba nunca sube la cabeza sobre la barra
  var CMP1 = {
    s: 0.75,
    alto: 693,
    cx: 520,
    arriba: {
      y: 345,
      desde: -60
    },
    abajo: {
      y: 935,
      desde: -200
    }
  };
  function cabezaY(sube) {
    return geo({
      sube: sube
    }).cabeza[1];
  }
  function yMitad(m, yv) {
    return m.y + (yv - m.desde) * CMP1.s;
  } // y del viewBox -> lienzo

  function MitadEsp(props) {
    var c = CMP1,
      m = props.m,
      h = c.alto * c.s;
    return /*#__PURE__*/React.createElement(Pos, {
      x: 0,
      y: m.y,
      e: props.e,
      dx: props.dx,
      dy: props.dy
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 1080,
        height: h
      }
    }, /*#__PURE__*/React.createElement(Recorte, {
      x: 0,
      y: 0,
      w: 1080,
      h: h,
      desde: m.desde * c.s
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: c.cx - 550 * c.s,
        top: 0
      }
    }, props.children))));
  }

  // cota vertical por donde pasa el centro de la cabeza (de sube a hasta sube b):
  // queda fija respecto de la barra y la cabeza la recorre
  function Cota(props) {
    var y0 = cabezaY(props.b) - 30,
      y1 = cabezaY(props.a) + 30;
    var x = 550,
      w = 46;
    var pTope = clamp((props.p - 0.75) / 0.25, 0, 1);
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [[x, y1], [x, y0]],
      p: props.p,
      color: props.color,
      sw: 24,
      hueco: 44
    }), /*#__PURE__*/React.createElement("g", {
      opacity: pTope,
      stroke: props.color,
      strokeWidth: 18,
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (x - w) + ' ' + y0 + ' L ' + (x + w) + ' ' + y0
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (x - w) + ' ' + y1 + ' L ' + (x + w) + ' ' + y1
    })));
  }

  /* 7 — error 1: repeticiones a medias vs recorrido completo */
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var mal = 0.3 + 0.4 * reps(T, f(0.02), f(0.98), 3.5);
    var bien = reps(T, f(0.42), f(0.98), 1.5);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.38), 0.45);
    var tacha = M.pop(T, f(0.16), 0.4);
    var visto = M.pop(T, f(0.66), 0.45);
    var r1 = M.pop(T, f(0.05), 0.45);
    var r2 = M.pop(T, f(0.44), 0.45);
    var pMal = M.draw(T, f(0.08), 0.35);
    var pBien = M.draw(T, f(0.48), 0.5);
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.6)
    })(T);
    var A1 = CMP1.arriba,
      B1 = CMP1.abajo;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(MitadEsp, {
      m: A1,
      e: arriba,
      dx: M.vibra(T, 44, 2),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Colgado, {
      s: CMP1.s,
      sube: mal,
      x0: 110,
      x1: 990
    }, function () {
      return /*#__PURE__*/React.createElement(Cota, {
        a: 0.3,
        b: 0.7,
        color: C.RED,
        p: pMal
      });
    })), /*#__PURE__*/React.createElement(MitadEsp, {
      m: B1,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Colgado, {
      s: CMP1.s,
      sube: bien,
      x0: 110,
      x1: 990,
      musc: {
        dor: luz
      }
    }, function () {
      return /*#__PURE__*/React.createElement(Cota, {
        a: 0,
        b: 1,
        color: C.GRN,
        p: pBien
      });
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 860,
      y: yMitad(A1, 280),
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 820,
      y: yMitad(B1, -170),
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.62,
      p: M.draw(T, f(0.66), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "A MEDIAS",
      y: 236,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RECORRIDO COMPLETO",
      y: 1468,
      e: r2,
      s: 1,
      fase: 0.4
    }));
  }

  /* =========================================================
     ERROR 2: de perfil, una sola figura grande. Primero se columpia
     (arco rojo + X); despues se calma y sube quieta (plomada + visto).
     La figura colgada de perfil es muy alta y finita: partida en dos
     mitades quedaba ilegible en el celular.
     ========================================================= */

  var BARRA_P = [700, 200]; // barra en el viewBox de B.Perfil
  var PF = {
    s: 0.8,
    barra: [540, 445]
  }; // donde cae esa barra en el lienzo
  var X_PLOMADA = 945; // linea vertical detras de la espalda

  function BarraPared() {
    return /*#__PURE__*/React.createElement(B.BarraG, {
      vista: "lado",
      x: BARRA_P[0],
      y: BARRA_P[1],
      brazo: 980,
      sinBase: true
    });
  }

  /* 8 — error 2: balancearse vs cuerpo quieto */
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);

    // 3 vaivenes por duracion de escena: se estira con la escena
    var ph = 2 * Math.PI * 3 * ((T - at) / dur);
    var calma = animate({
      from: 0,
      to: 1,
      start: f(0.44),
      end: f(0.58),
      ease: Easing.easeInOutSine
    })(T);
    var bal = 25 * Math.cos(ph) * (1 - calma);
    var subeMal = 0.42 * (0.5 + 0.5 * Math.cos(ph)) * (1 - calma);
    var subeBien = animate({
      from: 0,
      to: 1,
      start: f(0.6),
      end: f(0.9),
      ease: Easing.easeInOutSine
    })(T);
    var pose = B.posePerfil.colgado({
      barra: BARRA_P,
      sube: subeMal + subeBien,
      balanceo: bal,
      rodillas: 1
    });
    var luz = subeBien;
    var fig = M.pop(T, at - 0.6, 0.5);
    var oArco = junta(M.pop(T, f(0.06), 0.3), sale(T, f(0.46))).opacity;
    var pArco = M.draw(T, f(0.06), 0.4);
    var tacha = junta(M.pop(T, f(0.12), 0.4), sale(T, f(0.48)));
    var pPlomada = M.draw(T, f(0.56), 0.5);
    var visto = M.pop(T, f(0.8), 0.45);
    var r1 = junta(M.pop(T, f(0.03), 0.45), sale(T, f(0.5)));
    var r2 = M.pop(T, f(0.58), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.03 * t,
      foco: PF.barra
    }, /*#__PURE__*/React.createElement(Pos, {
      x: PF.barra[0] - BARRA_P[0] * PF.s,
      y: PF.barra[1] - BARRA_P[1] * PF.s,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Perfil, {
      s: PF.s,
      pose: pose,
      musc: {
        dor: luz
      },
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(BarraPared, null), /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [[X_PLOMADA, BARRA_P[1] - 60], [X_PLOMADA, BARRA_P[1] + 1300]],
          p: pPlomada,
          color: C.GRN,
          sw: 26
        }));
      }
    }, function () {
      return /*#__PURE__*/React.createElement("g", {
        opacity: oArco
      }, /*#__PURE__*/React.createElement(B.Arco, {
        c: BARRA_P,
        r: 1320,
        a0: 90,
        a1: 111,
        p: pArco,
        color: C.RED,
        sw: 28,
        cabeza: 66
      }), /*#__PURE__*/React.createElement(B.Arco, {
        c: BARRA_P,
        r: 1320,
        a0: 90,
        a1: 69,
        p: pArco,
        color: C.RED,
        sw: 28,
        cabeza: 66
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 820,
      y: 350,
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 820,
      y: 350,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.65,
      p: M.draw(T, f(0.8), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "BALANCEO",
      y: 236,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CUERPO QUIETO",
      y: 1462,
      e: r2,
      fase: 0.4
    }));
  }

  /* 9 — cierre: una dominada limpia, el dorsal encendido, visto grande */
  function EscCierre(props) {
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
      start: f(0.04),
      end: f(0.42),
      ease: Easing.easeInOutSine
    })(T);
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.36),
      end: f(0.48)
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
      foco: [540, 900]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: GT.x,
      y: GT.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(Colgado, {
      s: GT.s,
      sube: sube,
      musc: {
        dor: luz
      }
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 780,
      y: 760,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.85,
      p: M.draw(T, f(0.5), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "DOMINADAS",
      s: 1.3,
      y: 236,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1450,
      e: r2,
      fase: 0.4
    }));
  }

  /* =========================================================
     GUION — duracion y locucion de cada escena
     Las duraciones salen de leer cada linea a ritmo normal
     (~2,7 palabras por segundo). Total: 54,5 s + 3 s del cierre de marca
     que agrega reel.jsx = 57,5 s.
     ========================================================= */

  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 6.5,
    C: EscGancho,
    vo: '¿Haces dominadas? Si solo piensas en subir, te pierdes la clave: llevar los codos hacia abajo.'
  }, {
    nombre: 'Agarre',
    dur: 7.5,
    C: EscAgarre,
    vo: 'Agarra la barra un poco más ancho que los hombros, con los brazos totalmente extendidos y los pies sin tocar el suelo.'
  }, {
    nombre: 'Tirón',
    dur: 8,
    C: EscTiron,
    vo: 'Tira de tu cuerpo hacia arriba hasta que el pecho quede cerca de la barra, pensando en llevar los codos hacia abajo.'
  }, {
    nombre: 'Biomecánica',
    dur: 5.5,
    C: EscBiomecanica,
    vo: 'En la subida, el hombro hace aducción y la escápula rota hacia abajo.'
  }, {
    nombre: 'Bajada',
    dur: 6,
    C: EscBajada,
    vo: 'Baja con control hasta estirar por completo los brazos y sentir el estiramiento de la espalda.'
  }, {
    nombre: 'Músculos',
    dur: 7.5,
    C: EscMusculos,
    vo: 'El protagonista es el dorsal ancho, con ayuda del bíceps, el redondo mayor, el deltoides posterior y el trapecio.'
  }, {
    nombre: 'Error 1',
    dur: 5.5,
    C: EscError1,
    vo: 'Error uno: quedarte a medias. Sube hasta arriba y estira del todo al bajar.'
  }, {
    nombre: 'Error 2',
    dur: 5,
    C: EscError2,
    vo: 'Error dos: balancearte para ganar impulso. El cuerpo sube quieto, sin columpiarse.'
  }, {
    nombre: 'Cierre',
    dur: 3,
    C: EscCierre,
    vo: 'Así se hace una dominada.'
  }];
  global.REELS.registrar({
    id: 'dominadas',
    titulo: 'Dominadas',
    escenas: ESCENAS
  });
})(window);
