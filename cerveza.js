/* GENERADO por compilar.js desde cerveza.jsx — no editar a mano. */
/* ============================================================
   CERVEZA — reel con Tor, ESTILO 2 (~33 s con la accion y el cierre)
   "Deja de tomar cerveza" (pedido del autor, en la linea del de la marihuana:
   tema tabu + Tor en un estado ridiculo + cierre de parodia).
   - gancho: Tor borracho de noche, colgado de un farol, con los ojos para
     cualquier lado, la jarra en la mano y el hipo;
   - musculo: beber fuerte despues de entrenar baja la sintesis de proteina
     muscular (Parr 2014: 24 % menos aun tomando proteina; fue una dosis alta);
   - sueno: te duerme rapido pero recorta el sueno REM y lo fragmenta en la
     segunda mitad de la noche: duermes peor y amaneces sin recuperar;
   - calorias vacias: una cerveza ronda las 150 kcal; seis son unas 900, lo
     que una hamburguesa con papas;
   - "si te pasas": la cara verde y el vomito en el balde (de caricatura);
   - antes de las redes, la parodia: le ofrecen "la ultima" y la rechaza.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    N = global.N,
    PL = global.PL,
    V = global.V,
    TOR = global.TOR,
    MU = global.MU;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var A = global.REELS.ayudas;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var L1 = 198,
    L2 = 193; // brazo y antebrazo de B.Frente
  var G0 = B.geoFrente({
    pose: TOR.pose({
      flex: 0
    })
  });
  function pulso(T, cuando, d) {
    var u = (T - cuando) / d;
    return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
  }
  function jarraEn(c, ang, k, p) {
    // la jarra agarrada del asa (el asa queda en c)
    return /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + k + ') translate(-204 -147)'
    }, /*#__PURE__*/React.createElement(N.ICONOS.jarra, {
      s: 1,
      p: p == null ? 0.8 : p
    }));
  }
  // gotas de cerveza que saltan de la jarra
  function salpica(c, T, fase) {
    var gotas = [];
    for (var i = 0; i < 4; i++) {
      var u = (T * 0.9 + i * 0.27 + (fase || 0)) % 1;
      var x = c[0] - 40 - 90 * u * (0.6 + 0.3 * i),
        y = c[1] - 130 - 150 * u + 330 * u * u;
      gotas.push(/*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: x.toFixed(1),
        cy: y.toFixed(1),
        r: (13 - 6 * u).toFixed(1),
        fill: C.YEL,
        stroke: C.INK,
        strokeWidth: 6,
        opacity: (1 - u * u).toFixed(2)
      }));
    }
    return /*#__PURE__*/React.createElement("g", null, gotas);
  }
  // burbujas del hipo: salen de la boca y revientan
  function burbujas(g, T, cuando) {
    var u = (T - cuando) / 0.7;
    if (u <= 0 || u >= 1) return null;
    return /*#__PURE__*/React.createElement("g", {
      opacity: 1 - u * u
    }, [0, 1, 2].map(function (i) {
      return /*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: g.cabeza[0] + 70 + 34 * i + 30 * u,
        cy: g.cabeza[1] + 40 - 46 * i - 130 * u,
        r: 12 + 7 * i,
        fill: BLANCO,
        stroke: C.INK,
        strokeWidth: 7
      });
    }));
  }
  function estrellas(T, lista) {
    return lista.map(function (q, i) {
      var k = (0.6 + 0.4 * Math.sin(T * 3 + i * 2.1)) * (q[2] || 1);
      return /*#__PURE__*/React.createElement("path", {
        key: i,
        d: 'M ' + q[0] + ' ' + (q[1] - 24 * k) + ' L ' + q[0] + ' ' + (q[1] + 24 * k) + ' M ' + (q[0] - 24 * k) + ' ' + q[1] + ' L ' + (q[0] + 24 * k) + ' ' + q[1],
        stroke: C.YEL,
        strokeWidth: 10,
        strokeLinecap: "round"
      });
    });
  }

  /* ---------------- gancho: borracho, colgado del farol ---------------- */

  var TB = {
    x: -34,
    y: 250,
    s: 0.74
  };
  var PIV = [600, 1472]; // el pie: Tor se tambalea alrededor (origen '50% 92%')
  var POSTE = 800; // x del poste en el lienzo
  var HIPOS = [0.3, 0.68];
  function giroDe(T) {
    return 8 + 3 * Math.sin(T * 2.2) + Math.sin(T * 5.1);
  }
  // punto del lienzo -> coordenadas de Tor inclinado giro grados
  function aLocal(p, tor, giro) {
    var q = [(p[0] - tor.x) / tor.s - PIV[0], (p[1] - tor.y) / tor.s - PIV[1]];
    var a = -giro * Math.PI / 180;
    return [PIV[0] + q[0] * Math.cos(a) - q[1] * Math.sin(a), PIV[1] + q[0] * Math.sin(a) + q[1] * Math.cos(a)];
  }
  function poseFarol(T) {
    var p = TOR.pose({
      flex: 0
    });
    var mano = aLocal([POSTE + 4, 700], TB, giroDe(T));
    p.der.mano = mano;
    p.der.codo = B.ik(G0.der.hombro, mano, L1, L2, -1);
    p.izq.codo = [312, 812];
    p.izq.mano = [262, 640 + 14 * Math.sin(T * 2.2 + 1)];
    return p;
  }
  function hipo(T, f) {
    return Math.max(pulso(T, f(HIPOS[0]), 0.2), pulso(T, f(HIPOS[1]), 0.2));
  }
  function miradaBorracho(T) {
    return [[9 * Math.sin(T * 1.3), 9 + 2 * Math.cos(T * 2)], [9 * Math.sin(T * 1.9 + 2), 5 + 4 * Math.cos(T * 1.1)]];
  }

  /* ---------------- "si te pasas": la cara verde y el balde ---------------- */

  var TV = {
    x: 120,
    y: 330,
    s: 0.7
  };
  function EscVomito(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var verde = animate({
      from: 0,
      to: 1,
      start: f(0.04),
      end: f(0.32)
    })(T);
    var ARC = [0.44, 0.7],
      LARGO = 0.2;
    var u = 0; // avance del chorro 0..1 (0 = no hay)
    ARC.forEach(function (c) {
      var d = (T - f(c)) / (LARGO * dur);
      if (d > 0 && d < 1) u = d;
    });
    var nivel = clamp((T - f(ARC[0])) / (f(0.9) - f(ARC[0])), 0, 1);
    A.sonido('vomito', f(ARC[0]));
    A.sonido('vomito', f(ARC[1]));
    var baja = u > 0 ? 46 * Math.sin(Math.PI * Math.min(1, u * 1.6)) : 0;
    var pose = TOR.pose({
      flex: 0
    });
    pose.izq.codo = [392, 860];
    pose.izq.mano = [470, 986];
    pose.der.codo = [808, 860];
    pose.der.mano = [730, 986];
    pose.cabeza = [600, 410 + baja];
    var BALDE = [600, 968];
    var conArcada = verde > 0.6 && u === 0 && T < f(ARC[0]);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(V.Camara, {
      T: T,
      at: at,
      dur: dur,
      tomas: [[0, {
        zoom: 1.3,
        foco: [540, 640]
      }], [0.4, {
        zoom: 1.12,
        foco: [540, 760]
      }], [1, {
        zoom: 1.02,
        foco: [540, 880]
      }]],
      golpes: ARC,
      pulsos: [0.3]
    }, /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement(V.Sombra, {
      c: [540, TV.y + 1502 * TV.s],
      rx: 250
    })), /*#__PURE__*/React.createElement(A.Pos, {
      x: TV.x,
      y: TV.y,
      e: M.pop(T, at - 0.6, 0.5),
      dx: verde > 0.3 && u === 0 ? M.vibra(T, 26, 3 * verde) : 0,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(TOR.Tor, {
      s: TV.s,
      pose: pose,
      sinPiso: true,
      ojos: u > 0 ? 'llanto' : conArcada ? 'grandes' : 'borracho',
      boca: u > 0 ? 'abierta' : conArcada ? 'llena' : 'ondulada',
      gesto: {
        cara: {
          color: C.GRN,
          v: verde
        },
        boca: 1.5,
        cejas: 'triste',
        mejillas: 1 - verde
      },
      agarre: function () {
        return MU.balde(BALDE, nivel);
      },
      extra: function (g) {
        var boca = [g.cabeza[0], g.cabeza[1] + 66];
        var y0 = u > 0.72 ? U.lerp(boca[1], BALDE[1], (u - 0.72) / 0.28) : boca[1];
        var y1 = u > 0 ? U.lerp(boca[1], BALDE[1] + 4, clamp(u / 0.22, 0, 1)) : boca[1];
        var mece = 10 * Math.sin(T * 40);
        var d = 'M ' + boca[0] + ' ' + y0.toFixed(1) + ' Q ' + (boca[0] + mece).toFixed(1) + ' ' + ((y0 + y1) / 2).toFixed(1) + ' ' + boca[0] + ' ' + y1.toFixed(1);
        var gotas = [];
        if (u > 0.2) {
          for (var i = 0; i < 6; i++) {
            var w = (u * 2.2 + i * 0.17) % 1,
              l = i % 2 ? 1 : -1;
            gotas.push(/*#__PURE__*/React.createElement("circle", {
              key: i,
              cx: BALDE[0] + l * (60 + 150 * w),
              cy: BALDE[1] - 20 - 170 * w + 300 * w * w,
              r: 12 - 5 * w,
              fill: C.YEL,
              stroke: C.INK,
              strokeWidth: 6,
              opacity: 1 - w
            }));
          }
        }
        return /*#__PURE__*/React.createElement("g", null, u > 0 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: d,
          fill: "none",
          stroke: C.INK,
          strokeWidth: 62,
          strokeLinecap: "round"
        }), /*#__PURE__*/React.createElement("path", {
          d: d,
          fill: "none",
          stroke: C.YEL,
          strokeWidth: 44,
          strokeLinecap: "round"
        })) : null, gotas, /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: g.cabeza,
          v: verde
        }));
      }
    }))), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "\xBFUNA M\xC1S?",
      y: 280,
      s: 1.3,
      cuando: at - 0.6
    }), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "MALA IDEA",
      y: 1490,
      s: 1.2,
      cuando: f(0.5),
      fase: 0.4
    }));
  }

  /* ---------------- la parodia: "¿la ultima?" "¡no, gracias!" ---------------- */

  var PT = {
    x: 120,
    y: 380,
    s: 0.7
  };
  function enTor(p) {
    return [PT.x + p[0] * PT.s, PT.y + p[1] * PT.s];
  }
  function poseNo(cruza, manotazo) {
    var p = TOR.pose({
      flex: 0
    });
    var base = TOR.pose({
      flex: 0
    });
    var X = {
      izq: {
        codo: [450, 800],
        mano: [770, 600]
      },
      der: {
        codo: [750, 800],
        mano: [430, 600]
      }
    };
    ['izq', 'der'].forEach(function (k) {
      p[k].codo = U.lerpP(base[k].codo, X[k].codo, cruza);
      p[k].mano = U.lerpP(base[k].mano, X[k].mano, cruza);
    });
    if (manotazo > 0) {
      p.der.codo = U.lerpP(p.der.codo, [900, 700], manotazo);
      p.der.mano = U.lerpP(p.der.mano, [1080, 620], manotazo);
    }
    return p;
  }
  function EscUltima(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var entra = Easing.easeOutCubic(clamp((T - f(0.02)) / (f(0.2) - f(0.02)), 0, 1));
    var sale = Easing.easeInCubic(clamp((T - f(0.44)) / (f(0.58) - f(0.44)), 0, 1));
    var mano = [U.lerp(1260, 880, entra) + 420 * sale, 900 + 50 * sale];
    var cruza = animate({
      from: 0,
      to: 1,
      start: f(0.2),
      end: f(0.3),
      ease: Easing.easeOutBack
    })(T) * (1 - animate({
      from: 0,
      to: 1,
      start: f(0.36),
      end: f(0.42)
    })(T));
    var manotazo = animate({
      from: 0,
      to: 1,
      start: f(0.36),
      end: f(0.42),
      ease: Easing.easeOutCubic
    })(T) * (1 - animate({
      from: 0,
      to: 1,
      start: f(0.5),
      end: f(0.6)
    })(T));
    var festeja = animate({
      from: 0,
      to: 1,
      start: f(0.62),
      end: f(0.74),
      ease: Easing.easeOutBack
    })(T);
    var pose = festeja > 0.01 ? TOR.pose({
      flex: festeja
    }) : poseNo(cruza, manotazo);
    // la jarra: en la mano que ofrece; con el manotazo sale volando, girando y salpicando
    var vuela = clamp((T - f(0.41)) / (f(0.6) - f(0.41)), 0, 1);
    var jx = mano[0] - 30,
      jy = mano[1] - 10,
      ang = -6 + 4 * Math.sin(T * 5);
    if (vuela > 0) {
      jx = U.lerp(mano[0] - 30, 1420, Easing.easeOutQuad(vuela));
      jy = mano[1] - 10 - 380 * Math.sin(Math.PI * vuela * 0.85);
      ang = 520 * vuela;
    }
    A.sonido('whoosh', f(0.39));
    A.sonido('golpe', f(0.41));
    var serio = cruza > 0.3 && festeja < 0.3;
    var e2 = M.pop(T, f(0.66), 0.42);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(V.Camara, {
      T: T,
      at: at,
      dur: dur,
      tomas: [[0, {
        zoom: 1.08,
        foco: [640, 900]
      }], [0.4, {
        zoom: 1.02,
        foco: [560, 900]
      }], [1, {
        zoom: 1.05,
        foco: [540, 900]
      }]],
      golpes: [0.41],
      pulsos: [0.28, 0.66]
    }, /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: 540,
      cy: PT.y + 1505 * PT.s,
      rx: 260,
      ry: 30,
      fill: C.GRY
    })), /*#__PURE__*/React.createElement(A.Pos, {
      x: PT.x,
      y: PT.y,
      e: M.pop(T, at - 0.6, 0.5),
      dx: serio && manotazo < 0.1 ? M.vibra(T, 30, 2) : 0,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(TOR.Tor, {
      s: PT.s,
      pose: pose,
      flex: festeja,
      sinPiso: true,
      parpadeo: V.parpadeo(T),
      musc: {
        bic: festeja
      },
      boca: festeja > 0.3 ? 'sonrisa' : serio ? 'triste' : true,
      gesto: serio ? {
        cejas: 'enojo'
      } : null
    })), /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, sale < 1 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: 'M 1280 1010 L ' + U.pt(mano),
      stroke: C.INK,
      strokeWidth: 84,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M 1280 1010 L ' + U.pt(mano),
      stroke: BLANCO,
      strokeWidth: 56,
      strokeLinecap: "round"
    })) : null, vuela < 1 ? jarraEn([jx, jy], ang, 1.15, 0.85) : null, sale < 1 ? /*#__PURE__*/React.createElement("circle", {
      cx: mano[0],
      cy: mano[1],
      r: 46,
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 14
    }) : null, vuela > 0 && vuela < 1 ? salpica([jx - 60, jy + 40], T * 3, 0) : null, serio && manotazo < 0.1 ? /*#__PURE__*/React.createElement(V.Lineas, {
      c: enTor([600, 700]),
      dir: [0, -1],
      v: 0.8,
      largo: 110
    }) : null, /*#__PURE__*/React.createElement(V.Chispa, {
      T: T,
      c: [mano[0] - 150, mano[1] - 30],
      cuando: f(0.41),
      r: 120
    }), e2.opacity > 0.02 ? /*#__PURE__*/React.createElement("g", {
      opacity: e2.opacity,
      transform: 'translate(190 1290) scale(' + e2.scale.toFixed(3) + ') translate(-190 -1290)'
    }, /*#__PURE__*/React.createElement("g", {
      transform: "translate(86 1180) scale(0.9)"
    }, /*#__PURE__*/React.createElement(N.ICONOS.jarra, {
      s: 1
    })), /*#__PURE__*/React.createElement("circle", {
      cx: 190,
      cy: 1290,
      r: 150,
      fill: "none",
      stroke: C.RED,
      strokeWidth: 26
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 84 1184 L 296 1396",
      stroke: C.RED,
      strokeWidth: 26,
      strokeLinecap: "round"
    })) : null, /*#__PURE__*/React.createElement(V.Chispa, {
      T: T,
      c: enTor([600, 330]),
      cuando: f(0.74),
      r: 160
    }))), /*#__PURE__*/React.createElement(A.Bien, {
      T: T,
      cuando: f(0.72),
      x: 860,
      y: 560,
      s: 0.85
    }), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "\xBFLA \xDALTIMA?",
      y: 290,
      s: 1.3,
      cuando: at - 0.6
    }), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "\xA1NO, GRACIAS!",
      y: 1490,
      s: 1.2,
      cuando: f(0.3),
      fase: 0.4
    }));
  }

  /* ---------------- escenas ---------------- */

  var JARRAS = [];
  for (var i = 0; i < 6; i++) JARRAS.push([50 + i % 3 * 190, i < 3 ? 360 : 560]);
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.8,
    vo: 'Deja de tomar cerveza.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.42,
        foco: [500, 600]
      }], [1, {
        zoom: 1.03,
        foco: [540, 880]
      }]],
      detras: function (T, f) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: "M 40 1368 L 1040 1368",
          stroke: C.GRY,
          strokeWidth: 12,
          strokeLinecap: "round"
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [450, 1368],
          rx: 240
        }), /*#__PURE__*/React.createElement("g", {
          transform: 'translate(' + (POSTE - 260 * 0.77) + ' ' + (1368 - 1292 * 0.77) + ')'
        }, /*#__PURE__*/React.createElement(MU.Farol, {
          s: 0.77
        })), estrellas(T, [[150, 500, 1], [990, 700, 0.8], [960, 960, 0.7], [90, 1100, 0.7]]));
      },
      tor: {
        x: TB.x,
        s: TB.s,
        ojos: 'borracho',
        y: function (T, f) {
          return TB.y - 24 * hipo(T, f);
        },
        giro: function (T) {
          return giroDe(T);
        },
        pose: function (T) {
          return poseFarol(T);
        },
        boca: function (T, f) {
          return hipo(T, f) > 0.05 ? 'o' : 'ondulada';
        },
        gesto: function (T) {
          return {
            mejillas: 1,
            nariz: 'roja',
            mirada: miradaBorracho(T),
            giro: 6 * Math.sin(T * 1.6)
          };
        },
        agarre: function (g, T) {
          return jarraEn(g.izq.mano, -16 + 9 * Math.sin(T * 2.2), 0.95, 0.7);
        },
        extra: function (g, T, f) {
          A.sonido('hipo', f(HIPOS[0]));
          A.sonido('hipo', f(HIPOS[1]));
          return /*#__PURE__*/React.createElement("g", null, salpica(g.izq.mano, T, 0), burbujas(g, T, f(HIPOS[0])), burbujas(g, T, f(HIPOS[1])));
        }
      },
      piezas: [{
        C: N.ICONOS.luna,
        s: 0.6,
        x: 890,
        y: 350,
        cuando: 0.1
      }],
      mal: [{
        x: 60,
        y: 900,
        cuando: 0.22,
        s: 0.6
      }, {
        x: 850,
        y: 1130,
        cuando: 0.46,
        s: 0.5
      }],
      r1: {
        text: 'CERVEZA',
        s: 1.3,
        cuando: 0.02
      },
      r2: {
        text: '¡HIP!',
        s: 1.25,
        cuando: 0.3
      }
    })
  }, {
    nombre: 'Músculo',
    dur: 5.2,
    vo: 'Beber fuerte después de entrenar frena la construcción de músculo: un 24 % menos en un estudio.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.1,
        foco: [540, 780]
      }], [0.5, {
        zoom: 1.16,
        foco: [540, 720]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      pulsos: [0.44],
      tor: {
        s: 0.62,
        x: 168,
        y: 520,
        boca: function (T, f) {
          return T < f(0.46) ? 'sonrisa' : 'triste';
        },
        musc: function (T, f) {
          return {
            bic: 1 - animate({
              from: 0,
              to: 1,
              start: f(0.46),
              end: f(0.62)
            })(T)
          };
        },
        muscGris: function (T, f) {
          return {
            bic: animate({
              from: 0,
              to: 1,
              start: f(0.46),
              end: f(0.62)
            })(T)
          };
        },
        flex: function (T, f) {
          return 1 - 0.4 * animate({
            from: 0,
            to: 1,
            start: f(0.5),
            end: f(0.78),
            ease: Easing.easeInOutCubic
          })(T);
        },
        extra: function (g, T, f) {
          // los aminoacidos entran al biceps... hasta que llega la cerveza y se van
          var antes = T < f(0.44);
          var p = antes ? ((T - f(0.02)) / (0.2 * (f(1) - f(0))) % 1 + 1) % 1 : 1 - animate({
            from: 0,
            to: 1,
            start: f(0.46),
            end: f(0.64)
          })(T);
          var v = 1 - animate({
            from: 0,
            to: 1,
            start: f(0.44),
            end: f(0.54)
          })(T);
          return /*#__PURE__*/React.createElement("g", null, p > 0.01 && p < 0.99 ? PL.alBiceps(g, p, 'bola') : null, /*#__PURE__*/React.createElement(V.Brillo, {
            T: T,
            c: g.izq.codo,
            r: 90,
            v: v
          }), /*#__PURE__*/React.createElement(V.Brillo, {
            T: T,
            c: g.der.codo,
            r: 90,
            v: v
          }));
        }
      },
      piezas: [{
        C: N.ICONOS.jarra,
        s: 1.1,
        x: 408,
        y: 392,
        cuando: 0.4
      }, {
        C: P.Medidor,
        s: 0.85,
        x: 96,
        y: 1150,
        cuando: 0.12,
        p: function (T, f) {
          return {
            p: animate({
              from: 0.95,
              to: 0.42,
              start: f(0.5),
              end: f(0.8)
            })(T)
          };
        }
      }],
      mal: [{
        x: 800,
        y: 640,
        cuando: 0.5,
        s: 0.6
      }],
      r1: {
        text: 'FRENA TU MÚSCULO',
        s: 1.15,
        cuando: 0.04
      },
      r2: {
        text: '24 % MENOS SÍNTESIS',
        s: 1.1,
        cuando: 0.58
      }
    })
  }, {
    nombre: 'Sueño',
    dur: 4.8,
    vo: 'Te duerme rápido, pero arruina la calidad de tu sueño: amaneces cansado y sin recuperar.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.04,
        foco: [540, 820]
      }], [1, {
        zoom: 1.1,
        foco: [540, 760]
      }]],
      tor: {
        x: 120,
        y: 300,
        s: 0.7,
        ojos: 'espiral',
        boca: 'ondulada',
        gesto: function (T) {
          return {
            giroOjos: T * 260,
            giro: 5 * Math.sin(T * 1.5),
            mejillas: 0.8
          };
        },
        fondo: function () {
          return MU.cama();
        },
        extra: function (g, T, f) {
          A.sonido('campana', f(0.74));
          return MU.manta();
        }
      },
      piezas: [{
        C: MU.Despertador,
        x: 10,
        y: 940,
        p: function (T, f) {
          return {
            T: T,
            hora: 3,
            gira: T > f(0.1) && T < f(0.72) ? 1.3 : 0,
            suena: T > f(0.74)
          };
        }
      }, {
        C: MU.Mesita,
        x: 20,
        y: 1190
      }, {
        C: N.ICONOS.luna,
        s: 0.85,
        x: 60,
        y: 390,
        cuando: 0.08
      }, {
        C: N.ICONOS.bateria,
        s: 1.05,
        x: 800,
        y: 400,
        cuando: 0.2,
        p: function (T, f) {
          return {
            p: animate({
              from: 0.08,
              to: 0.22,
              start: f(0.25),
              end: f(0.7)
            })(T)
          };
        }
      }],
      mal: [{
        x: 100,
        y: 430,
        cuando: 0.42,
        s: 0.6
      }, {
        x: 824,
        y: 700,
        cuando: 0.76,
        s: 0.5
      }],
      r1: {
        text: 'DUERMES, PERO MAL',
        s: 1.1,
        cuando: 0.04
      },
      r2: {
        text: 'AMANECES SIN RECUPERAR',
        s: 1.0,
        cuando: 0.58
      }
    })
  }, {
    nombre: 'Calorías',
    dur: 4.8,
    vo: 'Y son calorías vacías: seis cervezas suman unas 900, como una hamburguesa con papas.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.06,
        foco: [540, 700]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      pulsos: [0.56],
      tor: {
        s: 0.54,
        x: 216,
        y: 620,
        ojos: 'borracho',
        boca: function (T, f) {
          return pulso(T, f(0.84), 0.5) > 0.05 ? 'abierta' : 'ondulada';
        },
        gesto: function (T) {
          return {
            mejillas: 1,
            nariz: 'roja',
            mirada: miradaBorracho(T)
          };
        },
        panza: function (T, f) {
          return animate({
            from: 0,
            to: 1,
            start: f(0.08),
            end: f(0.56)
          })(T) + 0.06 * pulso(T, f(0.84), 0.4);
        },
        extra: function (g, T, f) {
          A.sonido('eructo', f(0.84));
          var u = (T - f(0.84)) / 0.9;
          return u > 0 && u < 1 ? /*#__PURE__*/React.createElement(V.Humo, {
            T: T * 2,
            c: [g.cabeza[0] + 30, g.cabeza[1] + 40],
            v: 1 - u,
            alto: 170,
            viento: 90
          }) : null;
        }
      },
      piezas: JARRAS.map(function (q, i) {
        return {
          C: N.ICONOS.jarra,
          s: 0.75,
          x: q[0],
          y: q[1],
          cuando: i ? 0.06 + i * 0.07 : null,
          fase: i * 0.15
        };
      }).concat([{
        C: N.COMIDA.hamburguesa,
        s: 0.95,
        x: 770,
        y: 370,
        cuando: 0.58
      }, {
        C: N.COMIDA.fritas,
        s: 0.85,
        x: 790,
        y: 590,
        cuando: 0.64
      }]),
      lienzo: function (T, f) {
        var e = M.pop(T, f(0.52), 0.4);
        return e.opacity > 0.02 ? /*#__PURE__*/React.createElement("g", {
          opacity: e.opacity,
          transform: 'translate(690 560) scale(' + e.scale.toFixed(3) + ')'
        }, /*#__PURE__*/React.createElement("path", {
          d: "M -36 -18 L 36 -18 M -36 18 L 36 18",
          stroke: C.INK,
          strokeWidth: 18,
          strokeLinecap: "round"
        })) : null;
      },
      r1: {
        text: 'CALORÍAS VACÍAS',
        s: 1.2,
        cuando: 0.04
      },
      r2: {
        text: '6 CERVEZAS = 900 KCAL',
        s: 1.0,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Si te pasas',
    dur: 3.6,
    vo: 'Y si te pasas... ya sabes cómo termina la noche.',
    C: EscVomito
  }, {
    nombre: 'La última',
    dur: 5,
    vo: 'Y cuando te ofrezcan «la última»... ¡no, gracias! Tu cuerpo te lo va a agradecer.',
    C: EscUltima
  }];
  global.REELS.registrar({
    id: 'cerveza',
    titulo: 'Deja de tomar cerveza (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿A QUIÉN SE LO MANDAS?',
      vo: 'Mándaselo al amigo que siempre dice «una y ya», y guarda este video.'
    }
  });
})(window);
