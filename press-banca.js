/* GENERADO por compilar.js desde press-banca.jsx — no editar a mano. */
/* ============================================================
   PRESS DE BANCA CON MANCUERNAS — reel vertical 1080x1920
   (~57 s con el cierre de marca)
   Fuente tecnica: libro de biomecanica, pag. 31. Acostado en banco plano,
   una mancuerna en cada mano sobre el pecho con las palmas enfrentadas;
   bajar con control hasta el costado del pecho con los codos a ~45 grados
   del tronco; empujar hasta extender sin bloquear los codos.
   Concentrica: aduccion horizontal de hombros y extension de codos.
   Primario: pectoral mayor. Sinergistas: deltoides anterior, triceps,
   serrato anterior. Errores: recorrido parcial, perder el control,
   demasiado peso.

   Dos vistas:
   - PERFIL (B.Perfil + posePerfil.banco), ESPEJADO: la cabeza queda a la
     izquierda, asi la mancuerna, el codo y el pecho no caen en la franja
     derecha que tapan los botones de Instagram/TikTok.
   - CENITAL (B.Frente + poseFrente.bancaArriba): desde arriba, para el
     angulo de los codos. Las mancuernas van paralelas al torso (agarre
     neutro: palmas enfrentadas).

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
  var GRAD = Math.PI / 180;
  var MED = B.PERFIL.medidas,
    PW = B.PERFIL.W;
  var BLANCO = '#ffffff';
  var PF = {
    x: -224,
    y: 70,
    s: 1.1
  }; // perfil acostado grande (espejado; piso en y 1500)
  var CEN = {
    x: -60,
    y: 210,
    s: 1
  }; // vista cenital grande (cabeza en y 514)
  var JUICIO = [790, 390]; // X y visto junto a la cabeza (vista cenital)
  var K_PF = 0.85; // tamano de la mancuerna de perfil

  // punto del viewBox -> lienzo
  function enPF(base, v) {
    return [base.x + (PW - v[0]) * base.s, base.y + v[1] * base.s];
  }
  function enCen(base, v) {
    return [base.x + v[0] * base.s, base.y + v[1] * base.s];
  }
  function ang(a, b) {
    return Math.atan2(b[1] - a[1], b[0] - a[0]) / GRAD;
  }

  /* ---------------- poses ---------------- */

  // de perfil en el banco. Arriba el brazo queda apenas flexionado (sin
  // bloquear): la mano no llega al largo total y el codo cede hacia los pies.
  var ALCANCE = MED.brazo + MED.ante;
  function poseBanco(p) {
    var pose = B.posePerfil.banco({
      p: p
    });
    var d = U.resta(pose.mano, pose.hombro),
      l = U.largo(d);
    var tope = ALCANCE * 0.976; // ~25 grados de flexion: se lee de perfil
    if (l > tope) {
      var mano = U.suma(pose.hombro, U.por(U.unidad(d), tope));
      var c1 = B.ik(pose.hombro, mano, MED.brazo, MED.ante, 1);
      var c2 = B.ik(pose.hombro, mano, MED.brazo, MED.ante, -1);
      var codo = c1[0] < c2[0] ? c1 : c2;
      pose = Object.assign({}, pose, {
        codo: codo,
        mano: mano,
        codo2: U.suma(codo, [14, -10]),
        mano2: U.suma(mano, [14, -10])
      });
    }
    return pose;
  }
  function poseCen(p, abd) {
    return B.poseFrente.bancaArriba({
      p: p,
      abd: abd == null ? 45 : abd
    });
  }

  // recorrido de la mancuerna de perfil, de arriba (p 1) a abajo (p 0)
  var TRAY = function () {
    var pts = [];
    for (var i = 0; i <= 24; i++) pts.push(poseBanco(1 - i / 24).mano);
    return pts;
  }();
  var ABAJO = poseBanco(0),
    ARRIBA = poseBanco(1);
  var G90 = B.geoFrente({
    pose: poseCen(0, 90)
  }); // codos en cruz (el error)

  /* ---------------- piezas de la escena ---------------- */

  // perfil acostado en el banco, espejado (cabeza a la izquierda)
  function Acostado(props) {
    var pose = props.pose || poseBanco(props.p || 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'scaleX(-1)'
      }
    }, /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: g.piso + 4,
          x0: 110,
          x1: 1270
        }), /*#__PURE__*/React.createElement(B.BancoG, {
          x0: g.banco.x0,
          x1: g.banco.x1,
          y: g.banco.y,
          piso: g.piso
        }));
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.mano,
          ang: props.giroM || 0,
          k: props.k || K_PF,
          color: props.color
        });
      }
    }, props.children));
  }

  // serrato anterior: tres digitaciones en el costado, debajo del brazo
  // (el serr de B.Frente queda tapado por el brazo en la vista cenital)
  function Serrato(props) {
    var g = props.g,
      v = props.v;
    var out = [];
    [-1, 1].forEach(function (l) {
      // borde del torso medido: x -158 en y -196, -156 en -166, -150 en -136
      [[-196, 155], [-166, 153], [-136, 147]].forEach(function (q, j) {
        var y = q[0],
          x = q[1];
        var pts = [[l * x, y - 14], [l * (x - 2), y + 13], [l * (x - 46), y + 17], [l * (x - 58), y + 10]].map(g.local);
        var d = U.blando(pts, 0.42);
        out.push(/*#__PURE__*/React.createElement("g", {
          key: l + '_' + j
        }, /*#__PURE__*/React.createElement("path", {
          d: d,
          fill: BLANCO
        }), /*#__PURE__*/React.createElement("path", {
          d: d,
          fill: C.GRY,
          opacity: v
        }), /*#__PURE__*/React.createElement("path", {
          d: d,
          fill: "none",
          stroke: C.INK,
          strokeWidth: 11,
          strokeLinejoin: "round",
          opacity: Math.min(1, 2.2 * v)
        })));
      });
    });
    return /*#__PURE__*/React.createElement("g", null, out);
  }

  // triceps: banda gris en la cara de atras del brazo (perfil), entre la punta
  // del deltoides y el codo. El tri de B.Perfil queda casi todo bajo el deltoides.
  function Triceps(props) {
    var b = props.g.ejes.brazo,
      v = props.v;
    if (!v) return null;
    var lp = clamp(b.largo * 0.62, 58, 128) / b.largo;
    var s0 = lp - 0.06,
      s1 = 0.94,
      ext = [],
      int = [];
    for (var i = 0; i <= 6; i++) {
      var s = s0 + (s1 - s0) * i / 6,
        bulto = Math.sin(Math.PI * i / 6);
      ext.push(b.en(s, -(b.r(s) - 12)));
      int.push(b.en(s, -b.r(s) * (0.7 - 0.62 * bulto)));
    }
    var d = U.blando(ext.concat(int.reverse()), 0.35);
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: C.GRY,
      opacity: v
    }), /*#__PURE__*/React.createElement("path", {
      d: d,
      fill: "none",
      stroke: C.INK,
      strokeWidth: 11,
      strokeLinejoin: "round",
      opacity: Math.min(1, 2.2 * v)
    }));
  }

  // vista cenital con las mancuernas paralelas al torso
  function Cenital(props) {
    var pose = props.pose || poseCen(props.p || 0, props.abd);
    var kM = props.k || 0.85;
    return /*#__PURE__*/React.createElement(B.Frente, {
      s: props.s,
      pose: pose,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      agarre: function (g) {
        return /*#__PURE__*/React.createElement("g", null, props.detras ? props.detras(g) : null, [g.izq, g.der].map(function (q, i) {
          var giro = props.giroM ? props.giroM[i] : 0;
          return /*#__PURE__*/React.createElement(B.MancuernaG, {
            key: i,
            c: q.mano,
            ang: 90 + giro,
            k: q.kMano * kM,
            color: props.color
          });
        }));
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, props.serr ? /*#__PURE__*/React.createElement(Serrato, {
        g: g,
        v: props.serr
      }) : null, props.children ? props.children(g) : null);
    });
  }

  // arcos del angulo brazo-tronco en los dos hombros (vista cenital).
  // base: geometria de referencia (p 0) para que el arco no siga el escorzo del brazo al subir
  function ArcosCodo(props) {
    var g = props.base || props.g;
    if (props.opacity != null && props.opacity < 0.02) return null;
    return /*#__PURE__*/React.createElement("g", null, [g.izq, g.der].map(function (q, i) {
      return /*#__PURE__*/React.createElement(B.Arco, {
        key: i,
        c: q.arco.c,
        r: props.r || 170,
        a0: q.arco.a0,
        a1: q.arco.a1,
        p: props.p,
        color: props.color,
        sw: 18,
        cabeza: 32,
        opacity: props.opacity
      });
    }));
  }

  // llave vertical (rango de movimiento) con las puntas hacia +x
  function Llave(props) {
    var x = props.x,
      y0 = props.y0,
      y1 = props.y1,
      k = props.k || 36;
    var o = props.opacity == null ? 1 : props.opacity;
    if (o < 0.02) return null;
    return /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (x + k) + ' ' + y0 + ' L ' + x + ' ' + y0 + ' L ' + x + ' ' + y1 + ' L ' + (x + k) + ' ' + y1,
      fill: "none",
      stroke: props.color,
      strokeWidth: props.sw || 19,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: o
    });
  }

  // ventana que muestra solo una zona de una pieza; entra con pop desde su centro
  function Panel(props) {
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: props.e,
      dx: props.mx,
      dy: props.my
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: props.c.w,
        height: props.c.h,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -props.c.dx,
        top: -props.c.dy
      }
    }, props.children)));
  }
  // recortes en coordenadas del viewBox: [x0, x1] x [y0, y1]
  function cortePF(s, x0, x1, y0, y1) {
    return {
      s: s,
      dx: (PW - x1) * s,
      dy: y0 * s,
      w: (x1 - x0) * s,
      h: (y1 - y0) * s
    };
  }
  function corteCen(s, x0, x1, y0, y1) {
    return {
      s: s,
      dx: x0 * s,
      dy: y0 * s,
      w: (x1 - x0) * s,
      h: (y1 - y0) * s
    };
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: codos en cruz (hombros en rojo, X) -> a 45 grados, se enciende el pecho */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var cambio = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.64),
      ease: Easing.easeInOutCubic
    })(T);
    var malo = 1 - cambio;
    var abd = U.lerp(90, 45, cambio);
    var p = T < f(0.48) ? 0.55 * reps(T, f(0.04), f(0.46), 1) : animate({
      from: 0,
      to: 0.4,
      start: f(0.72),
      end: f(1),
      ease: Easing.easeInOutSine
    })(T);
    var falla = malo > 0.5 ? M.vibra(T, 44, 3) : 0;
    var brillo = animate({
      from: 0,
      to: 1,
      start: f(0.6),
      end: f(0.7)
    })(T);
    var verde = animate({
      from: 0,
      to: 1,
      start: f(0.6),
      end: f(0.68)
    })(T);
    var base = B.geoFrente({
      pose: poseCen(0, abd)
    });
    var fig = M.pop(T, at - 0.6, 0.5);
    var tacha = junta(M.pop(T, f(0.3), 0.4), sale(T, f(0.5)));
    var visto = M.pop(T, f(0.68), 0.45);
    var titulo = M.pop(T, f(0.03), 0.45);
    var pregunta = M.pop(T, f(0.42), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.05 * t,
      foco: [540, 860]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: CEN.x,
      y: CEN.y,
      e: fig,
      dx: falla,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(Cenital, {
      s: CEN.s,
      p: p,
      abd: abd,
      musc: {
        pec: brillo
      },
      muscRojo: {
        delt: malo
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(ArcosCodo, {
        g: g,
        base: base,
        color: C.RED,
        p: M.draw(T, f(0.1), 0.4),
        opacity: malo
      }), /*#__PURE__*/React.createElement(ArcosCodo, {
        g: g,
        base: base,
        color: C.GRN,
        opacity: verde
      }));
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
      p: M.draw(T, f(0.68), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PRESS DE BANCA",
      s: 1.5,
      y: 260,
      e: titulo
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "\xBFY TUS CODOS?",
      y: 1455,
      e: pregunta,
      fase: 0.4
    }));
  }

  /* 2 — posicion: banco plano, mancuernas sobre el pecho; detalle cenital de las palmas */
  var DET = corteCen(1, 250, 950, 205, 690); // detalle cenital: cabeza, pecho y brazos arriba
  function EscPosicion(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var achica = animate({
      from: 0,
      to: 1,
      start: f(0.6),
      end: f(0.72),
      ease: Easing.easeInOutCubic
    })(T);
    var esc = U.lerp(1, 0.6, achica);
    var sube = U.lerp(0, -300, achica);
    var banco = M.draw(T, f(0.04), 0.5);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.27),
      end: f(0.35)
    })(T);
    var plomada = M.draw(T, f(0.44), 0.4);
    var paralelas = M.draw(T, f(0.76), 0.4);
    var palmas = M.draw(T, f(0.84), 0.3);
    var fig = M.pop(T, at - 0.6, 0.5);
    var detalle = M.pop(T, f(0.66), 0.45);
    var r1 = M.pop(T, f(0.46), 0.45);
    var r2 = M.pop(T, f(0.74), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Pos, {
      x: PF.x,
      y: PF.y,
      e: fig,
      esc: esc,
      dy: sube + M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Acostado, {
      s: PF.s,
      p: 1
    }, function (g) {
      var b = g.banco;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [[b.x0 + 40, b.y + 31], [b.x1 - 40, b.y + 31]],
        p: banco,
        color: C.YEL,
        sw: 15
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: g.mano,
        r: 122,
        p: anillo,
        color: C.YEL,
        sw: 16
      }), /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [[g.mano[0], g.mano[1] + 96], [g.mano[0], g.frentePecho[1] - 6]],
        p: plomada,
        color: C.YEL,
        sw: 17
      }));
    })), /*#__PURE__*/React.createElement(Panel, {
      x: (1080 - DET.w) / 2,
      y: 955,
      c: DET,
      e: detalle,
      my: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Cenital, {
      s: DET.s,
      p: 1,
      detras: function (g) {
        return /*#__PURE__*/React.createElement("g", null, [g.izq, g.der].map(function (q, i) {
          return /*#__PURE__*/React.createElement(B.Puntos, {
            key: i,
            pts: [[q.mano[0], q.mano[1] - 250], [q.mano[0], q.mano[1] + 250]],
            p: paralelas,
            color: C.YEL,
            sw: 15
          });
        }));
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, [g.izq, g.der].map(function (q, i) {
        var x = q.mano[0],
          y = q.mano[1],
          adentro = -q.lado;
        return /*#__PURE__*/React.createElement(B.FlechaS, {
          key: i,
          a: [x + adentro * 52, y],
          b: [x + adentro * 128, y],
          p: palmas,
          color: C.GRN,
          sw: 15,
          cabeza: 30
        });
      }));
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "SOBRE EL PECHO",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PALMAS ENFRENTADAS",
      y: 1450,
      e: r2,
      fase: 0.4
    }));
  }

  /* 3 — bajada: lenta (3-2-1), trayectoria de puntos hasta el costado del pecho */
  function EscBajada(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var u = clamp((T - f(0.08)) / (f(0.74) - f(0.08)), 0, 1);
    var p = 1 - Easing.easeInOutSine(u);
    var n = u < 1 / 3 ? 3 : u < 2 / 3 ? 2 : 1;
    var anilloCuenta = u >= 1 ? 0 : 1 - u * 3 % 1;
    var llega = u >= 1;
    var meta = animate({
      from: 0,
      to: 1,
      start: f(0.02),
      end: f(0.12)
    })(T);
    var fig = M.pop(T, at - 0.6, 0.5);
    var cuenta = M.pop(T, f(0.04), 0.45);
    var visto = M.pop(T, f(0.78), 0.45);
    var rotulo = M.pop(T, f(0.56), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [480, 1000]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: PF.x,
      y: PF.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Acostado, {
      s: PF.s,
      p: p
    }, function () {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
        pts: TRAY,
        p: u,
        color: C.YEL,
        sw: 17
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: ABAJO.mano,
        r: 118,
        p: meta,
        color: llega ? C.GRN : C.YEL,
        sw: 16
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 790,
      y: 370,
      e: cuenta,
      dy: M.life(T, 3, 5)
    }, /*#__PURE__*/React.createElement(B.Cuenta, {
      s: 0.9,
      n: n,
      p: anilloCuenta
    })), /*#__PURE__*/React.createElement(Pos, {
      x: 610,
      y: 770,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.78), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "AL LADO DEL PECHO",
      y: 250,
      e: rotulo
    }));
  }

  /* 4 — codos: arco de 45 grados; el fantasma en cruz se descarta */
  function EscCodos(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var eje = M.draw(T, f(0.06), 0.4);
    var arco = M.draw(T, f(0.14), 0.5);
    var fantasma = junta(M.pop(T, f(0.56), 0.3), sale(T, f(0.86)));
    var trazo = M.draw(T, f(0.56), 0.35);
    var tachas = junta(M.pop(T, f(0.66), 0.4), sale(T, f(0.86)));
    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.9), 0.45);
    var r1 = M.pop(T, f(0.16), 0.45);
    var r2 = M.pop(T, f(0.62), 0.45);
    var lados = [G90.izq, G90.der];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.1 + 0.04 * t,
      foco: [540, 720]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: CEN.x,
      y: CEN.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(Cenital, {
      s: CEN.s,
      p: 0
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, [g.izq, g.der].map(function (q, i) {
        return /*#__PURE__*/React.createElement(B.Puntos, {
          key: 'e' + i,
          pts: q.ejeTorso,
          p: eje,
          color: C.GRY,
          sw: 15
        });
      }), /*#__PURE__*/React.createElement(ArcosCodo, {
        g: g,
        color: C.YEL,
        p: arco
      }), fantasma.opacity > 0.02 ? lados.map(function (q, i) {
        return /*#__PURE__*/React.createElement("g", {
          key: 'f' + i,
          opacity: fantasma.opacity
        }, /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [q.hombro, q.mano],
          p: trazo,
          color: C.RED,
          sw: 17
        }), /*#__PURE__*/React.createElement(B.Arco, {
          c: q.arco.c,
          r: 250,
          a0: q.arco.a0,
          a1: q.arco.a1,
          p: trazo,
          color: C.RED,
          sw: 16,
          cabeza: 30
        }));
      }) : null);
    })), lados.map(function (q, i) {
      var c = enCen(CEN, q.mano);
      return /*#__PURE__*/React.createElement(Pos, {
        key: i,
        x: c[0] - 46,
        y: c[1] - 46,
        e: tachas,
        dx: M.vibra(T, 44, 3)
      }, /*#__PURE__*/React.createElement(P.Tacha, {
        s: 0.4
      }));
    })), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: JUICIO[1],
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.7,
      p: M.draw(T, f(0.9), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS A 45\xB0",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "NO EN CRUZ",
      y: 1455,
      e: r2,
      fase: 0.4
    }));
  }

  /* 5 — subida: empuja hasta arriba; zoom al codo, que queda apenas flexionado */
  function EscSubida(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var p = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.48),
      ease: Easing.easeInOutSine
    })(T);
    var flecha = M.draw(T, f(0.04), 0.45);
    var acerca = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.66),
      ease: Easing.easeInOutCubic
    })(T);
    var foco = enPF(PF, ARRIBA.codo);
    var zoom = 1 + 0.38 * acerca + 0.03 * t;
    var mira = U.lerpP(foco, [560, 920], acerca);
    var anillo = animate({
      from: 0,
      to: 1,
      start: f(0.58),
      end: f(0.68)
    })(T);
    var guia = M.draw(T, f(0.62), 0.35);
    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.76), 0.45);
    var rotulo = M.pop(T, f(0.6), 0.45);
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
      x: PF.x,
      y: PF.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Acostado, {
      s: PF.s,
      p: p
    }, function (g) {
      var u = U.unidad(U.resta(g.codo, g.hombro));
      // recta del brazo "bloqueado" vs el antebrazo real: el arco verde marca la flexion
      var aRecta = ang(g.hombro, g.codo),
        aAnte = ang(g.codo, g.mano);
      if (aAnte - aRecta > 180) aAnte -= 360;
      if (aRecta - aAnte > 180) aAnte += 360;
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [645, 830],
        b: [645, 480],
        p: flecha,
        color: C.GRN,
        opacity: 1 - acerca
      }), /*#__PURE__*/React.createElement(B.Puntos, {
        pts: [g.codo, U.suma(g.codo, U.por(u, MED.ante * 0.72))],
        p: guia,
        color: C.GRY,
        sw: 14
      }), /*#__PURE__*/React.createElement(B.Arco, {
        c: g.codo,
        r: 118,
        a0: aRecta,
        a1: aAnte,
        p: guia,
        color: C.GRN,
        sw: 16,
        cabeza: 28
      }), /*#__PURE__*/React.createElement(B.Anillo, {
        c: g.codo,
        r: 64,
        p: anillo,
        color: C.GRN,
        sw: 14
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: 770,
      y: 640,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.6,
      p: M.draw(T, f(0.76), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "SIN BLOQUEAR",
      y: 250,
      e: rotulo
    }));
  }

  /* 6 — biomecanica: arriba (cenital) aduccion horizontal; abajo (perfil) extension de codo */
  var BIO_A = corteCen(0.95, 130, 1070, 200, 800);
  var BIO_B = cortePF(0.82, 560, 1210, 380, 1070);
  function EscBiomecanica(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var up1 = animate({
      from: 0,
      to: 1,
      start: f(0.06),
      end: f(0.4),
      ease: Easing.easeInOutSine
    })(T);
    var baja = animate({
      from: 0,
      to: 1,
      start: f(0.46),
      end: f(0.58),
      ease: Easing.easeInOutSine
    })(T);
    var up2 = animate({
      from: 0,
      to: 1,
      start: f(0.62),
      end: f(0.94),
      ease: Easing.easeInOutSine
    })(T);
    var p = up1 - baja + up2;
    var arcoH = baja < 1 ? up1 * (1 - baja) : up2;
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.44), 0.45);
    var r1 = M.pop(T, f(0.08), 0.45);
    var r2 = M.pop(T, f(0.52), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      x: (1080 - BIO_A.w) / 2,
      y: 320,
      c: BIO_A,
      e: arriba,
      my: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Cenital, {
      s: BIO_A.s,
      p: p
    }, function (g) {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Arco, {
        c: g.izq.hombro,
        r: 165,
        a0: 135,
        a1: 55,
        p: arcoH,
        color: C.GRN,
        sw: 18,
        cabeza: 34
      }), /*#__PURE__*/React.createElement(B.Arco, {
        c: g.der.hombro,
        r: 165,
        a0: 45,
        a1: 125,
        p: arcoH,
        color: C.GRN,
        sw: 18,
        cabeza: 34
      }));
    })), /*#__PURE__*/React.createElement(Panel, {
      x: (1080 - BIO_B.w) / 2,
      y: 900,
      c: BIO_B,
      e: abajo,
      my: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Acostado, {
      s: BIO_B.s,
      p: p
    }, function (g) {
      var a0 = ang(g.codo, g.hombro),
        a1 = ang(g.codo, g.mano);
      if (a1 > a0) a1 -= 360;
      return /*#__PURE__*/React.createElement(B.Arco, {
        c: g.codo,
        r: 92,
        a0: a0,
        a1: a1,
        color: C.GRN,
        sw: 16,
        cabeza: 30
      });
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "ADUCCI\xD3N HORIZONTAL",
      y: 235,
      e: r1,
      s: 1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "EXTENSI\xD3N DE CODO",
      y: 1462,
      e: r2,
      s: 1,
      fase: 0.4
    }));
  }

  /* 7 — musculos: arriba el pectoral (cenital); abajo el triceps (perfil) */
  var MUS_A = corteCen(0.95, 130, 1070, 200, 830);
  var MUS_B = cortePF(0.8, 600, 1210, 400, 1060);
  function EscMusculos(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var pec = animate({
      from: 0,
      to: 1,
      start: f(0.08),
      end: f(0.18)
    })(T);
    var delt = animate({
      from: 0,
      to: 1,
      start: f(0.42),
      end: f(0.5)
    })(T);
    var tri = animate({
      from: 0,
      to: 1,
      start: f(0.56),
      end: f(0.64)
    })(T);
    var serr = animate({
      from: 0,
      to: 1,
      start: f(0.72),
      end: f(0.8)
    })(T);
    var pA = 0.06 + M.life(T, 3.2, 0.06);
    var pB = 0.94 + M.life(T, 3.2, 0.05);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.12), 0.45);
    var r2 = M.pop(T, f(0.46), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Panel, {
      x: (1080 - MUS_A.w) / 2,
      y: 320,
      c: MUS_A,
      e: arriba,
      my: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Cenital, {
      s: MUS_A.s,
      p: pA,
      musc: {
        pec: pec
      },
      muscGris: {
        delt: delt
      },
      serr: serr
    })), /*#__PURE__*/React.createElement(Panel, {
      x: (1080 - MUS_B.w) / 2,
      y: 935,
      c: MUS_B,
      e: abajo,
      my: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Acostado, {
      s: MUS_B.s,
      p: pB,
      musc: {
        pec: pec
      },
      muscGris: {
        delt: delt
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement(Triceps, {
        g: g,
        v: tri
      });
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PECTORAL MAYOR",
      y: 235,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "+ DELTOIDES Y TR\xCDCEPS",
      y: 1462,
      e: r2,
      s: 1,
      fase: 0.4
    }));
  }

  /* 8 — error 1: repeticiones a medias: llave roja (lo que hace) vs gris (el recorrido completo) */
  var Y_MEDIA = poseBanco(0.45).mano[1]; // ~ la mitad del recorrido
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var p = 1 - 0.55 * reps(T, f(0.04), f(0.96), 2);
    var gris = M.draw(T, f(0.08), 0.3);
    var roja = M.draw(T, f(0.16), 0.3);
    var yA = ARRIBA.mano[1],
      yB = ABAJO.mano[1];
    var fig = M.pop(T, at - 0.6, 0.5);
    var tacha = M.pop(T, f(0.3), 0.4);
    var rotulo = M.pop(T, f(0.06), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: [480, 1000]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: PF.x,
      y: PF.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Acostado, {
      s: PF.s,
      p: p
    }, function () {
      return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Llave, {
        x: 560,
        y0: yA,
        y1: U.lerp(yA, yB, gris),
        color: C.GRY,
        opacity: clamp(gris * 5, 0, 1)
      }), /*#__PURE__*/React.createElement(Llave, {
        x: 620,
        y0: yA,
        y1: U.lerp(yA, Y_MEDIA, roja),
        color: C.RED,
        opacity: clamp(roja * 5, 0, 1)
      }));
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: JUICIO[1] + 40,
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "A MEDIAS",
      y: 250,
      e: rotulo
    }));
  }

  /* 9 — error 2: perder el control, las mancuernas tambalean */
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var izq = poseCen(0.32 + M.life(T, 0.9, 0.26), 58 + M.life(T, 0.7, 24, 0.2));
    var der = poseCen(0.32 + M.life(T, 0.9, 0.26, 0.37), 58 + M.life(T, 0.7, 24, 0.6));
    var pose = Object.assign({}, izq, {
      der: der.der
    });
    var giro = [M.life(T, 0.55, 28) + M.vibra(T, 30, 4), M.life(T, 0.65, 28, 0.3) + M.vibra(T, 30, 4)];
    var fig = M.pop(T, at - 0.6, 0.5);
    var tacha = M.pop(T, f(0.2), 0.4);
    var rotulo = M.pop(T, f(0.06), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.04 + 0.04 * t,
      foco: [540, 860]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: CEN.x,
      y: CEN.y,
      e: fig,
      dx: M.vibra(T, 44, 3),
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(Cenital, {
      s: CEN.s,
      pose: pose,
      color: C.RED,
      giroM: giro,
      muscRojo: {
        delt: 1
      }
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: JUICIO[1],
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "SIN CONTROL",
      y: 250,
      e: rotulo
    }));
  }

  /* 10 — error 3: demasiado peso, los brazos tiemblan y no suben */
  function EscError3(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var p = 0.22 + 0.12 * animate({
      from: 0,
      to: 1,
      start: f(0.1),
      end: f(0.6),
      ease: Easing.easeInOutSine
    })(T) + M.vibra(T, 30, 0.03);
    var peso = M.draw(T, f(0.16), 0.3);
    var fig = M.pop(T, at - 0.6, 0.5);
    var tacha = M.pop(T, f(0.3), 0.4);
    var rotulo = M.pop(T, f(0.06), 0.45);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.04 + 0.04 * t,
      foco: [480, 1000]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: PF.x,
      y: PF.y,
      e: fig,
      dx: M.vibra(T, 44, 3),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Acostado, {
      s: PF.s,
      p: p,
      k: 1.55,
      color: C.RED,
      muscRojo: {
        delto: 1
      }
    }, function (g) {
      return /*#__PURE__*/React.createElement(B.FlechaS, {
        a: [g.mano[0], g.mano[1] - 330],
        b: [g.mano[0], g.mano[1] - 170],
        p: peso,
        color: C.RED
      });
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0],
      y: JUICIO[1] + 60,
      e: tacha,
      dx: M.vibra(T, 44, 4)
    }, /*#__PURE__*/React.createElement(P.Tacha, {
      s: 0.6
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "DEMASIADO PESO",
      y: 250,
      e: rotulo
    }));
  }

  /* 11 — cierre: una repeticion limpia desde arriba, el pecho se enciende, visto */
  function EscCierre(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var p = animate({
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
      foco: [540, 860]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: CEN.x,
      y: CEN.y,
      e: fig,
      dy: M.life(T, 3.6, 5)
    }, /*#__PURE__*/React.createElement(Cenital, {
      s: CEN.s,
      p: p,
      musc: {
        pec: luz
      },
      muscGris: {
        delt: luz
      }
    }))), /*#__PURE__*/React.createElement(Pos, {
      x: JUICIO[0] - 20,
      y: JUICIO[1] - 10,
      e: visto,
      dy: M.life(T, 2.8, 6)
    }, /*#__PURE__*/React.createElement(P.Visto, {
      s: 0.85,
      p: M.draw(T, f(0.5), 0.4)
    })), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PRESS DE BANCA",
      s: 1.5,
      y: 260,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1455,
      e: r2,
      fase: 0.4
    }));
  }

  /* =========================================================
     GUION — duracion y locucion de cada escena
     Las duraciones salen de leer cada linea a ritmo normal
     (~2,7 palabras por segundo). Total: 53,5 s + 3 s del cierre de marca
     que agrega reel.jsx = 56,5 s.
     ========================================================= */

  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 6,
    C: EscGancho,
    vo: '¿Haces press de banca con mancuernas? Fíjate en tus codos: ahí está la diferencia.'
  }, {
    nombre: 'Posición',
    dur: 7,
    C: EscPosicion,
    vo: 'Acuéstate en un banco plano con una mancuerna en cada mano, sobre el pecho y con las palmas enfrentadas.'
  }, {
    nombre: 'Bajada',
    dur: 5,
    C: EscBajada,
    vo: 'Baja las mancuernas con control hasta que queden al lado del pecho.'
  }, {
    nombre: 'Codos',
    dur: 6.5,
    C: EscCodos,
    vo: 'Los codos van a unos cuarenta y cinco grados del tronco, no abiertos en cruz.'
  }, {
    nombre: 'Subida',
    dur: 4.5,
    C: EscSubida,
    vo: 'Empuja hasta estirar los brazos, pero sin bloquear los codos.'
  }, {
    nombre: 'Biomecánica',
    dur: 5,
    C: EscBiomecanica,
    vo: 'Al subir, el hombro hace aducción horizontal y el codo se extiende.'
  }, {
    nombre: 'Músculos',
    dur: 7.5,
    C: EscMusculos,
    vo: 'Trabaja sobre todo el pectoral mayor, con ayuda del deltoides anterior, el tríceps y el serrato anterior.'
  }, {
    nombre: 'Error 1',
    dur: 3,
    C: EscError1,
    vo: 'Evita hacerlo a medias,'
  }, {
    nombre: 'Error 2',
    dur: 3,
    C: EscError2,
    vo: 'perder el control de las mancuernas…'
  }, {
    nombre: 'Error 3',
    dur: 2.5,
    C: EscError3,
    vo: '…o usar demasiado peso.'
  }, {
    nombre: 'Cierre',
    dur: 3.5,
    C: EscCierre,
    vo: 'Así se hace un press de banca con mancuernas.'
  }];
  global.REELS.registrar({
    id: 'press-banca',
    titulo: 'Press de banca',
    escenas: ESCENAS
  });
})(window);
