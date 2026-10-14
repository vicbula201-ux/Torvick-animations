/* GENERADO por compilar.js desde curl-barra.jsx — no editar a mano. */
/* ============================================================
   CURL DE BICEPS CON BARRA — reel corto (~31 s con el cierre de marca)
   Fuente: libro de biomecanica, pag. 96. De pie, agarre supino un poco
   mas ancho que los hombros, brazos extendidos y la barra contra los
   muslos; flexionar los codos con el tronco inmovil y bajar controlado.
   Biceps braquial (principal); braquial y braquiorradial.
   Error del libro: balancear el cuerpo. Segundo error: dejar caer la
   barra (el libro pide bajarla de manera controlada).
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
  var Pos = A.Pos,
    Rot = A.Rot,
    Camara = A.Camara,
    Recorte = A.Recorte,
    Mal = A.Mal,
    Bien = A.Bien;

  /* ---------------- pose de perfil ---------------- */

  var BASE = B.posePerfil.depie({
    x: 700,
    piso: 1300
  });

  // sube 0 brazos estirados -> 1 barra a la altura de los hombros
  // lean grados que el tronco se echa atras (0 = quieto; el error llega a ~18)
  function curl(sube, lean) {
    lean = lean || 0;
    var cadera = [700 - 1.6 * lean, 730 + 0.8 * lean];
    var cuello = U.suma(cadera, U.polar(-90.85 + lean, 404));
    var pose = Object.assign({}, BASE, {
      cadera: cadera,
      cuello: cuello,
      cabeza: -0.6 * lean
    });
    var g = B.geoPerfil({
      pose: pose
    });
    var codo = U.suma(g.hombro, U.polar(92 + lean + 8 * sube, 232));
    var mano = U.suma(codo, U.polar(92 + lean + 145 * Easing.easeInOutSine(sube), 214));
    pose.codo = codo;
    pose.mano = mano;
    pose.rodilla = B.ik(cadera, BASE.tobillo, 272, 268, -1);
    pose.rodilla2 = B.ik(U.suma(cadera, [14, -4]), BASE.tobillo2, 272, 268, -1);
    return pose;
  }
  function Perfil(props) {
    var pose = curl(props.sube, props.lean);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, props.extra ? props.extra(g) : null, /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "lado",
          c: g.mano,
          k: 0.95
        }));
      }
    });
  }

  /* ---------------- pose de frente ---------------- */

  function curlFrente(sube) {
    var p = B.poseFrente.depie({});
    var g = B.geoFrente({
      pose: p
    });
    var th = 145 * Easing.easeInOutSine(sube) * Math.PI / 180;
    ['izq', 'der'].forEach(function (k, i) {
      var l = i ? 1 : -1,
        q = p[k],
        S = g[k].hombro;
      var E = U.suma(S, [l * 30, 196]);
      q.codo = E;
      q.mano = U.suma(E, [l * (24 - 10 * Math.sin(th)), 196 * Math.cos(th)]);
      q.kMano = 1 + 0.22 * Math.sin(th);
    });
    return p;
  }
  function Frente(props) {
    var pose = curlFrente(props.sube);
    return /*#__PURE__*/React.createElement(B.Frente, {
      s: props.s,
      pose: pose,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      sinPiso: props.sinPiso,
      agarre: function (g) {
        var c = U.lerpP(g.izq.mano, g.der.mano, 0.5);
        return /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "frente",
          c: c,
          k: g.izq.kMano,
          ancho: 330,
          largo: 480,
          r: 92
        });
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }

  /* ---------------- encuadre y ritmo ---------------- */

  var FIG = {
    x: -95,
    y: 269,
    s: 0.95
  };
  var FIGF = {
    x: -12,
    y: 80,
    s: 0.92
  };
  function enLienzo(p, base) {
    base = base || FIG;
    return [base.x + p[0] * base.s, base.y + p[1] * base.s];
  }

  // repeticion: sube en el 40 %, baja en el 60 % (lento); suelta: cae en un 12 %
  function rep(T, a, b, n, modo) {
    if (T <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a)) * n;
    if (u >= n) return 0;
    var k = u - Math.floor(u);
    if (modo === 'suelta') {
      if (k < 0.45) return Easing.easeInOutSine(k / 0.45);
      if (k < 0.55) return 1;
      if (k < 0.62) return 1 - Easing.easeInQuad((k - 0.55) / 0.07);
      return 0;
    }
    if (modo === 'rapido') return k < 0.5 ? Easing.easeInOutSine(k / 0.5) : 1 - Easing.easeInOutSine((k - 0.5) / 0.5);
    return k < 0.4 ? Easing.easeInOutSine(k / 0.4) : 1 - Easing.easeInOutSine((k - 0.4) / 0.6);
  }

  // linea del tronco (cadera -> por encima del cuello)
  function lineaTronco(g, color, p) {
    var d = U.unidad(U.resta(g.cuello, g.cadera));
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [U.suma(g.cadera, U.por(d, -60)), U.suma(g.cuello, U.por(d, 120))],
      color: color,
      sw: 16,
      p: p == null ? 1 : p
    });
  }

  // trayectoria de la barra: el arco que hace la mano alrededor del codo
  function trayectoria(g, color, p) {
    var pts = [];
    for (var i = 0; i <= 16; i++) pts.push(U.suma(g.codo, U.polar(96 + 145 * i / 16, 214)));
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: pts,
      color: color,
      sw: 16,
      p: p == null ? 1 : p
    });
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: curl balanceandose; salen las X */
  function EscGancho(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = rep(T, f(0), f(1), 2, 'rapido');
    var fig = M.pop(T, at - 0.6, 0.5);
    var rot = M.pop(T, f(0.02), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.06 * t,
      foco: enLienzo([700, 700])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dx: M.vibra(T, 30, 3),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      sube: sube,
      lean: 20 * sube,
      muscRojo: {
        erec: sube
      }
    }))), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.2),
      x: 790,
      y: 470,
      s: 0.6
    }), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.42),
      x: 120,
      y: 1120,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CURL CON BARRA",
      s: 1.15,
      y: 250,
      e: rot
    }));
  }

  /* 2 — posicion: de frente, agarre supino un poco mas ancho que los hombros */
  function EscPosicion(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var guia = M.draw(T, f(0.42), dur * 0.16);
    var aro = animate({
      from: 0,
      to: 1,
      start: f(0.1),
      end: f(0.22)
    })(T);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.46), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.05 + 0.04 * t,
      foco: enLienzo([600, 820], FIGF)
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIGF.x,
      y: FIGF.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Frente, {
      s: FIGF.s,
      sube: 0,
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, ['izq', 'der'].map(function (k) {
          var q = g[k];
          return /*#__PURE__*/React.createElement("g", {
            key: k
          }, /*#__PURE__*/React.createElement(B.Anillo, {
            c: q.mano,
            r: 58,
            color: C.YEL,
            p: aro
          }), /*#__PURE__*/React.createElement(B.Puntos, {
            pts: [[q.hombro[0], q.hombro[1] - 40], [q.hombro[0], q.mano[1] + 90]],
            color: C.YEL,
            sw: 14,
            p: guia
          }));
        }));
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.3),
      x: 850,
      y: 760
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "PALMAS ARRIBA",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "UN POCO M\xC1S ANCHO",
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }

  /* 3 — subida: codos quietos, tronco inmovil */
  function EscSubida(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = rep(T, f(0.03), f(0.99), 2);
    var fig = M.pop(T, at - 0.6, 0.5);
    var lin = M.draw(T, f(0.5), dur * 0.16);
    var tray = M.draw(T, f(0.08), dur * 0.2);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.5), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.12 + 0.05 * t,
      foco: enLienzo([690, 640])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      sube: sube,
      musc: {
        bic: 0.3 + 0.7 * sube
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, lin > 0.02 ? lineaTronco(g, C.GRN, lin) : null, trayectoria(g, C.YEL, tray), /*#__PURE__*/React.createElement(B.Anillo, {
          c: g.codo,
          r: 44,
          color: C.YEL
        }));
      }
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CODOS QUIETOS",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "TRONCO INM\xD3VIL",
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }

  /* 4 — musculos: de frente, biceps braquial; braquial y braquiorradial */
  function EscMusculos(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var bic = animate({
      from: 0,
      to: 1,
      start: f(0.06),
      end: f(0.2)
    })(T);
    var ante = animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.62)
    })(T);
    var sube = 0.55 + M.life(T, 2.4, 0.4);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4),
      r2 = M.pop(T, f(0.52), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1.6 + 0.06 * t,
      foco: enLienzo([600, 720], FIGF),
      mira: [540, 880]
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIGF.x,
      y: FIGF.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Frente, {
      s: FIGF.s,
      sube: sube,
      musc: {
        bic: bic
      },
      muscGris: {
        ante: ante
      },
      sinPiso: true
    }))), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "B\xCDCEPS BRAQUIAL",
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "+ BRAQUIAL Y BRAQUIORRADIAL",
      s: 0.9,
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }

  // comparacion de perfil arriba (mal) / abajo (bien): de la cabeza a las rodillas
  var CMP = {
    s: 0.74,
    desdeY: 110,
    w: 1080,
    h: 600,
    yArriba: 300,
    yAbajo: 915,
    centroX: 660
  };
  function Mitad(props) {
    var s = CMP.s;
    return /*#__PURE__*/React.createElement(Pos, {
      x: 0,
      y: 0,
      e: props.e,
      dx: props.dx,
      dy: props.dy,
      origen: '540px ' + (props.y + CMP.h / 2) + 'px'
    }, /*#__PURE__*/React.createElement(Recorte, {
      x: 0,
      y: props.y,
      w: CMP.w,
      h: CMP.h,
      desde: CMP.desdeY * s
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 540 - CMP.centroX * s,
        top: 0
      }
    }, props.children)));
  }

  /* 5 — error 1: balancear el cuerpo */
  function EscError1(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var sube = rep(T, f(0), f(1), 2);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4),
      r2 = M.pop(T, f(0.36), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yArriba,
      e: arriba,
      dx: M.vibra(T, 30, 2),
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: CMP.s,
      sube: sube,
      lean: 20 * sube,
      muscRojo: {
        erec: sube
      },
      extra: function (g) {
        return lineaTronco(g, C.RED);
      }
    })), /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: CMP.s,
      sube: sube,
      musc: {
        bic: sube
      },
      extra: function (g) {
        return lineaTronco(g, C.GRN);
      }
    })), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.14),
      x: 870,
      y: CMP.yArriba + 40,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.56),
      x: 870,
      y: CMP.yAbajo + 40
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "BALANCEO",
      y: 230,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "TRONCO QUIETO",
      y: 1530,
      s: 1,
      e: r2,
      fase: 0.4
    }));
  }

  /* 6 — error 2: dejar caer la barra */
  function EscError2(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var cae = rep(T, f(0), f(1), 2, 'suelta');
    var lento = rep(T, f(0), f(1), 2);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4),
      r2 = M.pop(T, f(0.36), 0.4);
    // la caida: una flecha roja mientras la barra baja de golpe
    var u = (T - at) / dur * 2 % 1;
    var golpe = u > 0.54 && u < 0.7;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yArriba,
      e: arriba,
      dx: golpe ? M.vibra(T, 40, 4) : 0,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: CMP.s,
      sube: cae,
      muscRojo: {
        bic: golpe ? 1 : 0
      },
      extra: function (g) {
        return golpe ? /*#__PURE__*/React.createElement(B.FlechaS, {
          a: U.suma(g.codo, [-190, -80]),
          b: U.suma(g.codo, [-190, 200]),
          color: C.RED,
          sw: 18
        }) : null;
      }
    })), /*#__PURE__*/React.createElement(Mitad, {
      y: CMP.yAbajo,
      e: abajo,
      dy: M.life(T, 3.6, 4, 0.5)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: CMP.s,
      sube: lento,
      musc: {
        bic: 0.4 + 0.6 * lento
      },
      extra: function (g) {
        return trayectoria(g, C.GRN);
      }
    })), /*#__PURE__*/React.createElement(Mal, {
      T: T,
      cuando: f(0.14),
      x: 870,
      y: CMP.yArriba + 40,
      s: 0.5
    }), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.56),
      x: 870,
      y: CMP.yAbajo + 40
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "LA DEJA CAER",
      y: 230,
      s: 1,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "BAJA CONTROLADO",
      y: 1530,
      s: 1,
      e: r2,
      fase: 0.4
    }));
  }

  /* 7 — cierre */
  function EscCierre(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = rep(T, f(0), f(1), 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.4),
      r2 = M.pop(T, f(0.4), 0.4);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(Camara, {
      zoom: 1 + 0.04 * t,
      foco: enLienzo([700, 700])
    }, /*#__PURE__*/React.createElement(Pos, {
      x: FIG.x,
      y: FIG.y,
      e: fig,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(Perfil, {
      s: FIG.s,
      sube: sube,
      musc: {
        bic: 1
      }
    }))), /*#__PURE__*/React.createElement(Bien, {
      T: T,
      cuando: f(0.3),
      x: 830,
      y: 560,
      s: 0.85
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "CURL CON BARRA",
      s: 1.15,
      y: 250,
      e: r1
    }), /*#__PURE__*/React.createElement(Rot, {
      T: T,
      text: "T\xC9CNICA > PESO",
      y: 1490,
      e: r2,
      fase: 0.4
    }));
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    C: EscGancho,
    vo: 'Estás haciendo mal tu curl de bíceps.'
  }, {
    nombre: 'Posición',
    dur: 5,
    C: EscPosicion,
    vo: 'Agarra la barra con las palmas hacia arriba, un poco más ancho que los hombros.'
  }, {
    nombre: 'Subida',
    dur: 5,
    C: EscSubida,
    vo: 'Flexiona los codos y sube la barra hacia los hombros, con el tronco inmóvil.'
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    C: EscMusculos,
    vo: 'Trabaja el bíceps braquial, con ayuda del braquial y el braquiorradial.'
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    C: EscError1,
    vo: 'Error uno: balancear el cuerpo para subir la barra. El tronco no se mueve.'
  }, {
    nombre: 'Error 2',
    dur: 4,
    C: EscError2,
    vo: 'Error dos: dejarla caer. Bájala lento, controlando.'
  }, {
    nombre: 'Cierre',
    dur: 2.5,
    C: EscCierre,
    vo: 'Así se hace. Técnica antes que peso.'
  }];
  global.REELS.registrar({
    id: 'curl-barra',
    titulo: 'Curl de bíceps con barra',
    escenas: ESCENAS
  });
})(window);
