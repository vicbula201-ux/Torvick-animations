/* GENERADO por compilar.js desde sentadilla-sumo.jsx — no editar a mano. */
/* ============================================================
   SENTADILLA SUMO CON MANCUERNA — reel vertical 1080x1920
   (~52 s con el cierre de marca)
   Fuente tecnica: libro de biomecanica, pag. 137. Pies mas anchos que
   los hombros con las puntas afuera, mancuerna con las dos manos cerca
   del cuerpo, rodillas en la direccion de los pies, empujar con los
   talones. Primarios: cuadriceps y gluteo mayor. Sinergistas: aductores,
   isquiotibiales y gemelos. Errores: curvar la espalda y el valgo.

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
  var ANCHO = global.REELS.ANCHO;
  var GRAD = Math.PI / 180;
  var FR = {
    x: 24,
    y: 90,
    s: 0.86
  }; // persona de frente, grande (piso en y 1380)
  var PF = {
    x: -29,
    y: 234,
    s: 0.92
  }; // persona de perfil, grande (piso en y 1430)
  var PIES = 300; // medio ancho entre tobillos: bien abiertos
  function enLienzo(base, p) {
    return [base.x + p[0] * base.s, base.y + p[1] * base.s];
  }

  /* ---------------- poses ---------------- */

  function sumo(prof, valgo) {
    return B.poseFrente.sumo({
      prof: prof,
      valgo: valgo || 0,
      pies: PIES
    });
  }
  function perfil(prof, curva) {
    return B.posePerfil.sentadilla({
      prof: prof,
      curva: curva || 0,
      pesa: true
    });
  }

  // de pie en sumo, de perfil, con los brazos rectos adelantados 'ang' grados
  // (0 = colgando pegados al cuerpo); la mancuerna sigue a las manos
  function perfilBrazos(ang) {
    var pose = perfil(0, 0);
    var med = B.PERFIL.medidas;
    var codo = U.suma(pose.hombro, U.polar(92 + ang, med.brazo));
    var mano = U.suma(codo, U.polar(92 + ang, med.ante));
    var codo2 = U.suma(codo, [12, -8]),
      mano2 = U.suma(mano, [6, -4]);
    var agarre = U.lerpP(mano, mano2, 0.5);
    var lg = pose.mancuerna.largo;
    return Object.assign({}, pose, {
      codo: codo,
      mano: mano,
      codo2: codo2,
      mano2: mano2,
      mancuerna: Object.assign({}, pose.mancuerna, {
        agarre: agarre,
        arriba: U.suma(agarre, [0, -6]),
        abajo: U.suma(agarre, [0, lg])
      })
    });
  }

  /* ---------------- piezas chicas ---------------- */

  function Mancuerna(props) {
    var m = props.g.mancuerna;
    if (!m) return null;
    var e = props.e || {
      opacity: 1,
      scale: 1
    };
    var c = U.lerpP(m.arriba, m.abajo, 0.5);
    var sc = e.scale == null ? 1 : e.scale;
    var dy = props.dy || 0;
    return /*#__PURE__*/React.createElement("g", {
      opacity: e.opacity,
      transform: 'translate(' + c[0] + ' ' + (c[1] + dy) + ') scale(' + sc.toFixed(4) + ') translate(' + -c[0] + ' ' + -c[1] + ')'
    }, /*#__PURE__*/React.createElement(B.MancuernaG, {
      a: m.arriba,
      b: m.abajo
    }));
  }
  function conMancuerna(g) {
    return /*#__PURE__*/React.createElement(Mancuerna, {
      g: g
    });
  }

  // trazo continuo que se dibuja de a poco (p 0..1)
  function Linea(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.02) return null;
    var pts = props.pts,
      tramos = [],
      total = 0;
    for (var i = 1; i < pts.length; i++) {
      var l = U.largo(U.resta(pts[i], pts[i - 1]));
      tramos.push(l);
      total += l;
    }
    var resto = total * p,
      vis = [pts[0]];
    for (var j = 1; j < pts.length && resto > 0; j++) {
      if (tramos[j - 1] <= resto) {
        vis.push(pts[j]);
        resto -= tramos[j - 1];
      } else {
        vis.push(U.lerpP(pts[j - 1], pts[j], resto / tramos[j - 1]));
        resto = 0;
      }
    }
    return /*#__PURE__*/React.createElement("path", {
      d: 'M ' + vis.map(U.pt).join(' L '),
      fill: "none",
      stroke: props.color,
      strokeWidth: props.sw || 18,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: props.opacity
    });
  }
  function angulo(a, b) {
    var d = U.resta(b, a);
    return Math.atan2(d[1], d[0]) / GRAD;
  }

  // arco del lado del angulo interno de una articulacion, de B hacia A (la punta
  // queda del lado de A); se apaga solo cuando la articulacion ya esta casi recta
  function arcoJunta(c, haciaA, haciaB, r, color, o) {
    var aA = angulo(c, haciaA),
      aB = angulo(c, haciaB);
    var d = aA - aB;
    while (d > 180) d -= 360;
    while (d < -180) d += 360;
    var abs = Math.abs(d),
      sg = d >= 0 ? 1 : -1;
    var vis = clamp((168 - abs) / 28, 0, 1) * o;
    if (vis < 0.02 || abs < 36) return null;
    return /*#__PURE__*/React.createElement(B.Arco, {
      c: c,
      r: r,
      a0: aB + sg * 12,
      a1: aB + d - sg * 12,
      color: color,
      sw: 19,
      cabeza: 42,
      opacity: vis
    });
  }

  // flechas horizontales junto a cada rodilla: 'adentro' (empujan hacia el centro) o 'afuera'
  function flechasRodilla(g, hacia, color, p, opacity, lejos, cerca) {
    lejos = lejos || 230;
    cerca = cerca || 90;
    return [g.izq, g.der].map(function (q, i) {
      var R = q.rodilla,
        l = q.lado;
      var aLejos = U.suma(R, [l * lejos, -4]),
        aCerca = U.suma(R, [l * cerca, -4]);
      var a = hacia === 'adentro' ? aLejos : aCerca;
      var b = hacia === 'adentro' ? aCerca : aLejos;
      return /*#__PURE__*/React.createElement(B.FlechaS, {
        key: 'fr' + i,
        a: a,
        b: b,
        p: p,
        opacity: opacity,
        color: color,
        sw: 22,
        cabeza: 46
      });
    });
  }

  // anillos en las rodillas: k 0 = colorA, 1 = verde (uno se achica y el otro crece, sin mezclarse)
  function anillosRodilla(g, p, k, colorA) {
    if (p < 0.02) return null;
    return [g.izq, g.der].map(function (q, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: 'ar' + i
      }, /*#__PURE__*/React.createElement(B.Anillo, {
        c: q.rodilla,
        r: 76,
        p: p * clamp(1 - 2 * k, 0, 1),
        color: colorA || C.RED,
        sw: 17
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: q.rodilla,
        r: 76,
        p: p * clamp(2 * k - 1, 0, 1),
        color: C.GRN,
        sw: 17
      }));
    });
  }

  // guia vertical de puntos que sube desde el medio de cada pie y pasa por la rodilla
  function guiasPie(g, p, color, opacity) {
    return [g.izq, g.der].map(function (q, i) {
      var x = q.medioPie[0];
      return /*#__PURE__*/React.createElement(B.Puntos, {
        key: 'gp' + i,
        pts: [[x, g.piso - 4], [x, q.rodilla[1] - 150]],
        p: p,
        color: color,
        sw: 19,
        opacity: opacity
      });
    });
  }

  // ventana horizontal que muestra solo una franja de una pieza (comparaciones):
  // el punto 'centro' del viewBox queda en el medio de la franja
  function Ventana(props) {
    var s = props.s,
      c = props.centro,
      h = props.h;
    return /*#__PURE__*/React.createElement(Pos, {
      x: 0,
      y: 0,
      e: props.e,
      dx: props.dx,
      dy: props.dy,
      origen: ANCHO / 2 + 'px ' + (props.y + h / 2) + 'px'
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: props.y,
        width: ANCHO,
        height: h,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: ANCHO / 2 - c[0] * s,
        top: h / 2 - c[1] * s
      }
    }, props.children)));
  }

  // franjas de las escenas partidas (arriba / abajo) y donde caen la X y el visto
  var FRANJA = {
    arriba: 330,
    abajo: 930,
    h: 530
  };
  var JUICIO = [790, 150];

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: baja con las rodillas adentro (X), las saca y se enciende */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var prof = animate({
      from: 0,
      to: 1,
      start: f(0.03),
      end: f(0.3),
      ease: Easing.easeInOutSine
    })(T);
    var corrige = animate({
      from: 0,
      to: 1,
      start: f(0.52),
      end: f(0.66),
      ease: Easing.easeInOutCubic
    })(T);
    var valgo = 1 - corrige;
    var falla = valgo * prof > 0.55 ? M.vibra(T, 44, 3) : 0;
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.64),
      end: f(0.74)
    })(T);
    var anillos = animate({
      from: 0,
      to: 1,
      start: f(0.24),
      end: f(0.32)
    })(T);
    var pRojas = M.draw(T, f(0.28), 0.3);
    var oRojas = sale(T, f(0.5)).opacity;
    var pVerdes = M.draw(T, f(0.62), 0.3);

    // se acerca para el error y se aleja justo cuando las rodillas salen
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.2),
      end: f(0.36),
      ease: Easing.easeInOutCubic
    })(T) - animate({
      from: 0,
      to: 1,
      start: f(0.48),
      end: f(0.62),
      ease: Easing.easeInOutCubic
    })(T);
    var zoom = 1 + 0.16 * acerca + 0.03 * t;
    var fig = M.pop(T, at - 0.6, 0.5);
    var titulo = M.pop(T, f(0.02), 0.45);
    var pregunta = M.pop(T, f(0.2), 0.45);
    var tacha = junta(M.pop(T, f(0.36), 0.4), sale(T, f(0.54)));
    var visto = M.pop(T, f(0.74), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: enLienzo(FR, [600, 1230])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FR.x,
      y: FR.y,
      e: fig,
      dx: falla,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Frente, {
      s: FR.s,
      pose: sumo(prof, valgo),
      musc: {
        cuad: luz
      },
      agarre: conMancuerna
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, anillosRodilla(g, anillos, corrige), flechasRodilla(g, 'adentro', C.RED, pRojas, oRojas, 205, 90), flechasRodilla(g, 'afuera', C.GRN, pVerdes, 1, 185, 86));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 800,
      y: 480,
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.62
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 800,
      y: 480,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.7,
      p: M.draw(T, f(0.74), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "SENTADILLA SUMO",
      s: 1.4,
      y: 250,
      e: titulo
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "\xBFRODILLAS ADENTRO?",
      y: 1430,
      e: pregunta,
      fase: 0.4
    }));
  }

  /* 2 — postura: los pies se abren mas alla de los hombros y las puntas giran afuera */
  function EscPostura(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var abre = animate({
      from: 0,
      to: 1,
      start: f(0.12),
      end: f(0.4),
      ease: Easing.easeInOutCubic
    })(T);
    var gira = animate({
      from: 0,
      to: 1,
      start: f(0.6),
      end: f(0.84),
      ease: Easing.easeInOutCubic
    })(T);
    var guias = M.draw(T, f(0.02), 0.45);
    var flechas = junta(M.pop(T, f(0.1), 0.3), sale(T, f(0.5))).opacity;
    var arcos = M.pop(T, f(0.56), 0.3).opacity;

    // al girar las puntas, la camara baja a los pies
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.46),
      end: f(0.6),
      ease: Easing.easeInOutCubic
    })(T);
    var foco = enLienzo(FR, [600, 1380]);
    var zoom = 1 + 0.24 * acerca + 0.02 * t;
    var mira = U.lerpP(foco, [540, 1190], acerca);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = junta(M.pop(T, f(0.18), 0.45), sale(T, f(0.47)));
    var r2 = M.pop(T, f(0.62), 0.45);
    var pose = B.poseFrente.depie({
      pies: U.lerp(96, PIES, abre),
      pieAng: U.lerp(6, 35, gira)
    });
    var hombros = B.geoFrente({
      pose: B.poseFrente.depie({})
    });
    var fin = B.geoFrente({
      pose: B.poseFrente.depie({
        pies: PIES,
        pieAng: 6
      })
    });
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
      x: FR.x,
      y: FR.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Frente, {
      s: FR.s,
      pose: pose
    }, function (g) {
      var piso = g.piso;
      return /*#__PURE__*/React.createElement("g", null, [g.izq, g.der].map(function (q, i) {
        var l = q.lado;
        var xg = hombros[i === 0 ? 'izq' : 'der'].hombro[0] + l * 30;
        var xFin = fin[i === 0 ? 'izq' : 'der'].tobillo[0];
        var a0 = l < 0 ? 98 : 82,
          a1 = l < 0 ? 150 : 30;
        return /*#__PURE__*/React.createElement("g", {
          key: i
        }, /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [[xg, q.hombro[1] - 30], [xg, piso + 6]],
          p: guias,
          color: C.YEL,
          sw: 19
        }), abre > 0.03 ? /*#__PURE__*/React.createElement(B.FlechaS, {
          a: [xg, piso + 70],
          b: [xFin + l * 40, piso + 70],
          p: abre,
          opacity: flechas,
          color: C.GRN,
          sw: 22,
          cabeza: 46
        }) : null, arcos > 0.02 ? /*#__PURE__*/React.createElement("g", {
          opacity: arcos
        }, /*#__PURE__*/React.createElement(B.Arco, {
          c: [q.tobillo[0], piso - 30],
          r: 150,
          a0: a0,
          a1: a1,
          p: Math.max(0.05, gira),
          color: C.GRN,
          sw: 20,
          cabeza: 44
        })) : null);
      }));
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PIES ANCHOS",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PUNTAS AFUERA",
      y: 1430,
      e: r2,
      fase: 0.4
    }));
  }

  /* 3 — mancuerna: con las dos manos, y pegada al cuerpo (de perfil se ve la distancia) */
  function EscMancuerna(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var ANG = 22;
    var vuelve = animate({
      from: 0,
      to: 1,
      start: f(0.38),
      end: f(0.6),
      ease: Easing.easeInOutCubic
    })(T);
    var pose = perfilBrazos(ANG * (1 - vuelve));
    var lejos = perfilBrazos(ANG).mancuerna;
    var manc = M.pop(T, f(0.03), 0.42);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.1),
      end: f(0.18)
    })(T) * sale(T, f(0.36)).opacity;
    var flecha = M.draw(T, f(0.36), 0.3);
    var oFlecha = sale(T, f(0.78)).opacity;
    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.62), 0.45);
    var rotulo = M.pop(T, f(0.42), 0.45);
    var foco = enLienzo(PF, [640, 900]);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.06 + 0.03 * t,
      foco: foco,
      mira: [640, 1170]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: PF.x,
      y: PF.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Perfil, {
      s: PF.s,
      pose: pose,
      agarre: function (g) {
        return /*#__PURE__*/React.createElement(Mancuerna, {
          g: g,
          e: manc
        });
      }
    }, function (g) {
      var y = lejos.abajo[1] + 10;
      var cerca = g.mancuerna.abajo[0];
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
        c: U.lerpP(g.mano, g.mano2, 0.5),
        r: 72,
        p: anillo,
        color: C.YEL,
        sw: 17
      }), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [lejos.abajo[0] - 170, y - 60],
        b: [cerca - 92, y - 60],
        p: flecha,
        opacity: oFlecha,
        color: C.GRN,
        sw: 22,
        cabeza: 46
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 250,
      y: 900,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.66,
      p: M.draw(T, f(0.62), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CERCA DEL CUERPO",
      y: 250,
      e: rotulo
    }));
  }

  /* 4 — bajada: lenta (3-2-1); cada rodilla viaja hasta quedar sobre su pie */
  function EscBajada(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var u = clamp((T - f(0.06)) / (f(0.62) - f(0.06)), 0, 1);
    var prof = Easing.easeInOutSine(u);
    var n = u < 1 / 3 ? 3 : u < 2 / 3 ? 2 : 1;
    var anilloC = u >= 1 ? 0 : 1 - u * 3 % 1;
    var guia = M.draw(T, f(0.08), 0.45);
    var anillos = animate({
      from: 0,
      to: 1,
      start: f(0.14),
      end: f(0.22)
    })(T);
    var ok = clamp((prof - 0.8) / 0.16, 0, 1); // la rodilla ya esta sobre el pie

    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.08),
      end: f(0.62),
      ease: Easing.easeInOutSine
    })(T);
    var zoom = 1 + 0.16 * acerca + 0.02 * t;
    var fig = M.pop(T, at - 0.6, 0.5);
    var cuenta = junta(M.pop(T, f(0.03), 0.45), sale(T, f(0.68)));
    var rotulo = M.pop(T, f(0.26), 0.45);
    var visto = M.pop(T, f(0.7), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: enLienzo(FR, [600, 1280])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FR.x,
      y: FR.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Frente, {
      s: FR.s,
      pose: sumo(prof, 0),
      agarre: conMancuerna
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, ok < 0.98 ? guiasPie(g, guia, C.YEL, 1 - ok) : null, ok > 0.02 ? guiasPie(g, guia, C.GRN, ok) : null, anillosRodilla(g, anillos, ok, C.YEL));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 70,
      y: 380,
      e: cuenta,
      dy: M.life(T, 3, 5)
    }, /*#__PURE__*/React.createElement(B.Cuenta, {
      s: 0.85,
      n: n,
      p: anilloC
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 800,
      y: 470,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.66,
      p: M.draw(T, f(0.7), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RODILLA HACIA LA PUNTA",
      s: 1,
      y: 250,
      e: rotulo
    }));
  }

  /* 5 — subida: empuja el piso con los talones; cadera y rodilla se abren */
  function EscSubida(props) {
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
      start: f(0.3),
      end: f(0.8),
      ease: Easing.easeInOutSine
    })(T);
    var pose = perfil(1 - sube, 0);
    var talon = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.12)
    })(T);
    var empuje = M.draw(T, f(0.08), 0.35);
    var latido = Math.abs(M.life(T, 0.8, 16)) * (1 - animate({
      from: 0,
      to: 1,
      start: f(0.78),
      end: f(0.88)
    })(T));
    var arcos = animate({
      from: 0,
      to: 1,
      start: f(0.3),
      end: f(0.38)
    })(T);
    var final = animate({
      from: 0,
      to: 1,
      start: f(0.8),
      end: f(0.9)
    })(T);
    var recta = M.draw(T, f(0.8), 0.4);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rotulo = M.pop(T, f(0.1), 0.45);
    var visto = M.pop(T, f(0.86), 0.45);
    // abajo la camara mira los pies; al subir se abre, con el piso siempre en el mismo lugar
    var foco = enLienzo(PF, [640, 1300]);
    var zoom = U.lerp(1.3, 1, Easing.easeOutQuad(sube)) + 0.02 * t;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: zoom,
      foco: foco,
      mira: [560, 1440]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: PF.x,
      y: PF.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Perfil, {
      s: PF.s,
      pose: pose,
      agarre: conMancuerna
    }, function (g) {
      var x = g.talon[0] + 74;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
        c: [g.talon[0] + 14, g.piso - 24],
        r: 46,
        p: talon,
        color: C.YEL,
        sw: 16
      }), /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [x, g.piso - 290 - latido],
        b: [x, g.piso - 8],
        p: empuje,
        color: C.GRN,
        sw: 24,
        cabeza: 50
      }), arcoJunta(g.rodilla, g.cadera, g.tobillo, 100, C.GRN, arcos), arcoJunta(g.cadera, g.cuello, g.rodilla, 150, C.GRN, arcos), recta > 0.02 ? /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [U.suma(g.cadera, [0, -120]), [g.cadera[0], g.piso - 40]],
        p: recta,
        color: C.GRN,
        sw: 17,
        opacity: final
      }) : null, /*#__PURE__*/React.createElement(B.Anillo, {
        c: g.cadera,
        r: 58,
        p: final,
        color: C.GRN,
        sw: 16
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: g.rodilla,
        r: 58,
        p: final,
        color: C.GRN,
        sw: 16
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 220,
      y: 700,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.62,
      p: M.draw(T, f(0.86), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "EMPUJA CON LOS TALONES",
      s: 1,
      y: 250,
      e: rotulo
    }));
  }

  /* 6 y 7 — musculos: de frente (arriba) se ven los muslos por delante y por
     dentro; de perfil (abajo), el gluteo, la parte de atras del muslo y la pantorrilla */
  var MUS_FR = {
    s: 0.85,
    centro: [600, 1210]
  };
  var MUS_PF = {
    s: 0.88,
    centro: [700, 1022]
  }; // del gluteo al piso, en media sentadilla

  // flecha gris que senala un musculo secundario desde afuera (de 'lejos' a 'cerca')
  function senala(key, lejos, cerca, o) {
    if (o < 0.02) return null;
    return /*#__PURE__*/React.createElement(B.FlechaS, {
      key: key,
      a: lejos,
      b: cerca,
      p: o,
      opacity: o,
      color: C.GRY,
      sw: 20,
      cabeza: 44
    });
  }
  function Musculos(props) {
    var T = props.T;
    var aduct = props.aduct || 0,
      isq = props.isq || 0,
      gem = props.gem || 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Ventana, {
      y: FRANJA.arriba,
      h: FRANJA.h,
      s: MUS_FR.s,
      centro: MUS_FR.centro,
      e: props.eArriba,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Frente, {
      s: MUS_FR.s,
      pose: sumo(0.72 + M.life(T, 2.6, 0.06), 0),
      short: 0,
      musc: {
        cuad: props.cuad
      },
      muscGris: {
        aduct: aduct
      },
      agarre: conMancuerna
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, [g.izq, g.der].map(function (q, i) {
        var x = U.lerp(q.cadera[0], q.rodilla[0], 0.42);
        return senala('ad' + i, [x, g.piso - 70], [x, q.rodilla[1] + 30], aduct);
      }));
    })), /*#__PURE__*/React.createElement(Ventana, {
      y: FRANJA.abajo,
      h: FRANJA.h,
      s: MUS_PF.s,
      centro: MUS_PF.centro,
      e: props.eAbajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(B.Perfil, {
      s: MUS_PF.s,
      pose: perfil(0.45 + M.life(T, 2.6, 0.04), 0),
      musc: {
        glu: props.glu,
        cuad: props.cuad
      },
      muscGris: {
        isq: isq,
        gem: gem
      },
      fondo: function (g) {
        return /*#__PURE__*/React.createElement(B.PisoG, {
          y: g.piso,
          x0: 380,
          x1: 1020
        });
      },
      agarre: conMancuerna
    }, function (g) {
      var m = g.ejes.muslo,
        p = g.ejes.pierna;
      var q1 = m.en(0.62, -m.r(0.62)),
        q2 = p.en(0.32, -p.r(0.32) - 18);
      return /*#__PURE__*/React.createElement("g", null, senala('isq', U.suma(q1, [240, 0]), U.suma(q1, [50, 0]), isq), senala('gem', U.suma(q2, [240, 0]), U.suma(q2, [50, 0]), gem));
    })));
  }
  function EscMusculosA(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var cuad = animate({
      from: 0,
      to: 1,
      start: f(0.2),
      end: f(0.3)
    })(T);
    var glu = animate({
      from: 0,
      to: 1,
      start: f(0.56),
      end: f(0.66)
    })(T);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.06), 0.45);
    var r1 = M.pop(T, f(0.22), 0.45);
    var r2 = M.pop(T, f(0.58), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Musculos, {
      T: T,
      eArriba: arriba,
      eAbajo: abajo,
      cuad: cuad,
      glu: glu
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CU\xC1DRICEPS",
      y: 238,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "GL\xDATEO MAYOR",
      y: 1478,
      e: r2,
      fase: 0.4
    }));
  }
  function EscMusculosB(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var aduct = animate({
      from: 0,
      to: 1,
      start: f(0.18),
      end: f(0.3)
    })(T);
    var isq = animate({
      from: 0,
      to: 1,
      start: f(0.48),
      end: f(0.6)
    })(T);
    var gem = animate({
      from: 0,
      to: 1,
      start: f(0.7),
      end: f(0.82)
    })(T);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.18), 0.45);
    var r2 = M.pop(T, f(0.5), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Musculos, {
      T: T,
      eArriba: arriba,
      eAbajo: abajo,
      cuad: 1,
      glu: 1,
      aduct: aduct,
      isq: isq,
      gem: gem
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ADUCTORES",
      y: 238,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ISQUIOS Y GEMELOS",
      s: 1,
      y: 1478,
      e: r2,
      fase: 0.4
    }));
  }

  /* 8 — error 1: espalda curva vs columna neutra (de perfil, del pecho para arriba) */
  var ERR_PF = {
    s: 0.84
  };
  // centro de la ventana: sigue al torso (de la coronilla a la cadera), asi la
  // espalda queda entera y centrada en toda la bajada
  function centroTorso(prof, curva) {
    var g = B.geoPerfil({
      pose: perfil(prof, curva)
    });
    return [(g.coronilla[0] + g.gluteo[0]) / 2 + 10, (g.coronilla[1] + g.cadera[1] + 40) / 2];
  }
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var prof = 0.5 + 0.5 * reps(T, f(0.02), f(0.98), 2);
    var falla = prof > 0.7 ? M.vibra(T, 44, 3) : 0;
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.4), 0.45);
    var tacha = M.pop(T, f(0.16), 0.4);
    var visto = M.pop(T, f(0.58), 0.45);
    var r1 = M.pop(T, f(0.06), 0.45);
    var r2 = M.pop(T, f(0.46), 0.45);
    var pRoja = M.draw(T, f(0.1), 0.35);
    var pVerde = M.draw(T, f(0.48), 0.35);
    var espalda = function (g, extra) {
      var pts = [];
      for (var i = 0; i <= 12; i++) {
        var tt = U.lerp(0.1, 0.98, i / 12);
        pts.push(g.torso(tt, -(g.anchoEspalda(tt) + extra)));
      }
      return pts;
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Ventana, {
      y: FRANJA.arriba,
      h: FRANJA.h,
      s: ERR_PF.s,
      centro: centroTorso(prof, 1),
      e: arriba,
      dx: falla,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Perfil, {
      s: ERR_PF.s,
      pose: perfil(prof, 1),
      muscRojo: {
        erec: 1
      },
      agarre: conMancuerna
    }, function (g) {
      return /*#__PURE__*/React.createElement(Linea, {
        pts: espalda(g, 44),
        p: pRoja,
        color: C.RED,
        sw: 24
      });
    })), /*#__PURE__*/React.createElement(Ventana, {
      y: FRANJA.abajo,
      h: FRANJA.h,
      s: ERR_PF.s,
      centro: centroTorso(prof, 0),
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(B.Perfil, {
      s: ERR_PF.s,
      pose: perfil(prof, 0),
      agarre: conMancuerna
    }, function (g) {
      var e = espalda(g, 44);
      return /*#__PURE__*/React.createElement(Linea, {
        pts: [e[0], e[e.length - 1]],
        p: pVerde,
        color: C.GRN,
        sw: 24
      });
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: FRANJA.arriba + JUICIO[1],
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: FRANJA.abajo + JUICIO[1],
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.64,
      p: M.draw(T, f(0.58), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ESPALDA CURVA",
      y: 238,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "COLUMNA NEUTRA",
      y: 1478,
      e: r2,
      fase: 0.4
    }));
  }

  /* 9 — error 2: rodillas adentro (valgo) vs rodillas afuera, sobre el pie */
  var ERR_FR = {
    s: 0.78,
    centro: [600, 1190]
  };
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var prof = 0.55 + 0.45 * reps(T, f(0.02), f(0.98), 2);
    var falla = prof > 0.75 ? M.vibra(T, 44, 3) : 0;
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.38), 0.45);
    var tacha = M.pop(T, f(0.14), 0.4);
    var visto = M.pop(T, f(0.6), 0.45);
    var r1 = M.pop(T, f(0.04), 0.45);
    var r2 = M.pop(T, f(0.44), 0.45);
    var pRojas = M.draw(T, f(0.08), 0.3);
    var pGuiaR = M.draw(T, f(0.1), 0.4);
    var pVerdes = M.draw(T, f(0.5), 0.3);
    var pGuiaV = M.draw(T, f(0.46), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Ventana, {
      y: FRANJA.arriba,
      h: FRANJA.h,
      s: ERR_FR.s,
      centro: ERR_FR.centro,
      e: arriba,
      dx: falla,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(B.Frente, {
      s: ERR_FR.s,
      pose: sumo(prof, 1),
      agarre: conMancuerna
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, guiasPie(g, pGuiaR, C.RED), flechasRodilla(g, 'adentro', C.RED, pRojas, 1, 250, 96));
    })), /*#__PURE__*/React.createElement(Ventana, {
      y: FRANJA.abajo,
      h: FRANJA.h,
      s: ERR_FR.s,
      centro: ERR_FR.centro,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(B.Frente, {
      s: ERR_FR.s,
      pose: sumo(prof, 0),
      agarre: conMancuerna
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, guiasPie(g, pGuiaV, C.GRN), flechasRodilla(g, 'afuera', C.GRN, pVerdes, 1, 215, 96));
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: FRANJA.arriba + 40,
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: FRANJA.abajo + 40,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.64,
      p: M.draw(T, f(0.6), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RODILLAS ADENTRO",
      y: 238,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "RODILLAS AFUERA",
      y: 1478,
      e: r2,
      fase: 0.4
    }));
  }

  /* 10 — cierre: una repeticion limpia, todo se enciende, visto grande */
  function EscCierre(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var prof = reps(T, f(0.02), f(0.86), 1);
    var luz = animate({
      from: 0,
      to: 1,
      start: f(0.3),
      end: f(0.42)
    })(T);
    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.46), 0.5);
    var r1 = M.pop(T, f(0.38), 0.45);
    var r2 = M.pop(T, f(0.56), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.05 * t,
      foco: [540, 960]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FR.x,
      y: FR.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(B.Frente, {
      s: FR.s,
      pose: sumo(prof, 0),
      musc: {
        cuad: luz
      },
      muscGris: {
        aduct: luz
      },
      agarre: conMancuerna
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 790,
      y: 480,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.85,
      p: M.draw(T, f(0.46), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "SENTADILLA SUMO",
      s: 1.4,
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1430,
      e: r2,
      fase: 0.4
    }));
  }

  /* =========================================================
     GUION — duracion y locucion de cada escena
     Las duraciones salen de leer cada linea a ritmo normal
     (~2,7 palabras por segundo). Total: 49 s + 3 s del cierre de marca
     que agrega reel.jsx = 52 s.
     ========================================================= */

  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 6.5,
    C: EscGancho,
    vo: '¿Haces sentadilla sumo? Si tus rodillas se van hacia adentro, estás perdiendo lo mejor del ejercicio.'
  }, {
    nombre: 'Postura',
    dur: 5,
    C: EscPostura,
    vo: 'Abre los pies más que los hombros, con las puntas hacia afuera.'
  }, {
    nombre: 'Mancuerna',
    dur: 4,
    C: EscMancuerna,
    vo: 'Sostén una mancuerna con las dos manos, cerca del cuerpo.'
  }, {
    nombre: 'Bajada',
    dur: 5.5,
    C: EscBajada,
    vo: 'Baja con control, con las rodillas siempre en la misma dirección que los pies.'
  }, {
    nombre: 'Subida',
    dur: 6,
    C: EscSubida,
    vo: 'Para subir, empuja el piso con los talones: se extienden la cadera y las rodillas.'
  }, {
    nombre: 'Músculos',
    dur: 4,
    C: EscMusculosA,
    vo: 'Trabajan sobre todo los cuádriceps y el glúteo mayor…'
  }, {
    nombre: 'Sinergistas',
    dur: 4,
    C: EscMusculosB,
    vo: '…con ayuda de los aductores, los isquiotibiales y los gemelos.'
  }, {
    nombre: 'Error 1',
    dur: 5,
    C: EscError1,
    vo: 'Error número uno: curvar la espalda. Mantén la columna neutra todo el tiempo.'
  }, {
    nombre: 'Error 2',
    dur: 6,
    C: EscError2,
    vo: 'Error número dos: rodillas hacia adentro. Llévalas hacia afuera, siguiendo la punta de los pies.'
  }, {
    nombre: 'Cierre',
    dur: 3,
    C: EscCierre,
    vo: 'Así se hace una sentadilla sumo.'
  }];
  global.REELS.registrar({
    id: 'sentadilla-sumo',
    titulo: 'Sentadilla sumo',
    escenas: ESCENAS
  });
})(window);
