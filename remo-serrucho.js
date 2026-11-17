/* GENERADO por compilar.js desde remo-serrucho.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   REMO SERRUCHO (remo con mancuerna a una mano) — reel corto, ESTILO 2 FLUIDO
   (~38 s con la accion y el cierre). Es la primera prueba del estilo fluido
   que pidio el autor a partir de su video de referencia: camara mas
   cinematografica (empujes largos y suaves, cortes a primer plano), el
   musculo que se enciende con un halo que late y destellos, desenfoque de
   movimiento en la mancuerna, sombra suave y el banco con volumen.
   Fuente: libro, pag. 64. Rodilla y mano del mismo lado en el banco, el otro
   pie en el piso y la mancuerna en la otra mano; columna neutra y abdomen
   contraido. Tirar hacia arriba con el codo cerca del cuerpo hasta el lado
   del torso y volver controlado, estirando la espalda. Dorsal ancho
   (primario); romboides, braquial, trapecio, redondo mayor y deltoides
   posterior (sinergistas); manguito rotador, erectores y abdominales
   (estabilizadores). Errores del libro: curvar la columna y no mover las
   escapulas (el movimiento escapular debe ser completo).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    V = global.V,
    TOP3 = global.TOP3;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };

  /* ---------------- de perfil (mira a la izquierda), apoyado en el banco ---------------- */

  var PISO = 1300;
  var BANCO = {
    x0: 330,
    x1: 1210,
    y: 1000,
    alto: 46,
    fondo: [34, -26]
  }; // el banco con volumen
  var CAD = [870, 740];
  function lejos(cad, tob, mayorY) {
    var r1 = B.ik(cad, tob, 272, 268, 1),
      r2 = B.ik(cad, tob, 272, 268, -1);
    return r1[1] > r2[1] === mayorY ? r1 : r2;
  }

  // k 0 brazo colgando (dorsal estirado) .. 1 mancuerna a la cadera.
  // o.curva 0..1 la espalda redonda (error 1); o.esc 1 los omoplatos se mueven, 0 quietos (error 2);
  // o.tuerce 0..1 el tronco gira y sube para ayudarse (trampa del gancho)
  function remo(k, o) {
    o = o || {};
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var curva = o.curva || 0,
      esc = o.esc == null ? 1 : o.esc,
      tuerce = o.tuerce || 0;
    // con el tiron el tronco sube apenas (y mucho si hace trampa)
    var cad = U.suma(CAD, [0, -6 * e - 30 * tuerce * e]);
    var ang = -157 + 3 * e + 16 * tuerce * e - 6 * curva;
    var pose = {
      cadera: cad,
      cuello: U.suma(cad, U.polar(ang, 404 * (1 - 0.06 * curva))),
      curva: 0.8 * curva,
      cabeza: U.lerp(10, 4, e) - 26 * curva,
      piso: PISO
    };
    // la pierna de apoyo (la lejana): la rodilla en el banco y la canilla a lo largo
    var cad2 = U.suma(cad, [14, -6]);
    pose.tobillo2 = [1150, BANCO.y - 40];
    pose.punta2 = U.suma(pose.tobillo2, U.polar(64, 92));
    pose.rodilla2 = lejos(cad2, pose.tobillo2, true);
    // la pierna cercana: de pie al costado del banco
    pose.tobillo = [930, PISO - 32];
    pose.punta = U.suma(pose.tobillo, [-112, 32]);
    var r1 = B.ik(cad, pose.tobillo, 272, 268, 1),
      r2 = B.ik(cad, pose.tobillo, 272, 268, -1);
    pose.rodilla = r1[0] < r2[0] ? r1 : r2;
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: cad,
        mano: cad
      })
    });
    // el brazo de apoyo (lejano): la mano en el banco, debajo del hombro
    pose.hombro2 = U.suma(g.hombro, [16, -12]);
    pose.mano2 = [g.hombro[0] - 4, BANCO.y - 34];
    var a1 = B.ik(pose.hombro2, pose.mano2, 232, 214, 1),
      a2 = B.ik(pose.hombro2, pose.mano2, 232, 214, -1);
    pose.codo2 = a1[0] > a2[0] ? a1 : a2;
    // el brazo que rema: el omoplato baja (estira) abajo y se junta (aprieta) arriba
    var hom = U.suma(g.hombro, U.por(U.lerpP([-10, 30], [24, -16], e), esc));
    pose.hombro = hom;
    var a = U.lerp(93, -36, e);
    pose.codo = U.suma(hom, U.polar(a, 232));
    pose.mano = U.suma(pose.codo, U.polar(U.lerp(92, 84, e), 214));
    return pose;
  }
  function Banco() {
    var b = BANCO,
      d = b.fondo;
    var top = [[b.x0, b.y], [b.x1, b.y], [b.x1 + d[0], b.y + d[1]], [b.x0 + d[0], b.y + d[1]]];
    var pata = function (x, key) {
      return /*#__PURE__*/React.createElement("g", {
        key: key
      }, /*#__PURE__*/React.createElement("rect", _extends({
        x: x,
        y: b.y + b.alto - 6,
        width: 44,
        height: PISO - b.y - b.alto + 6,
        fill: C.GRY
      }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
        x: x - 30,
        y: PISO - 22,
        width: 104,
        height: 24,
        rx: 8,
        fill: C.GRY
      }, LN)));
    };
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + (b.x0 + 120 + d[0]) + ' ' + (b.y + b.alto) + ' L ' + (b.x0 + 120 + d[0]) + ' ' + (PISO - 30 + d[1]) + ' M ' + (b.x1 - 120 + d[0]) + ' ' + (b.y + b.alto) + ' L ' + (b.x1 - 120 + d[0]) + ' ' + (PISO - 30 + d[1]),
      fill: "none"
    }, LN)), pata(b.x0 + 100, 'a'), pata(b.x1 - 140, 'b'), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + top.map(U.pt).join(' L ') + ' Z',
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: b.x0,
      y: b.y,
      width: b.x1 - b.x0,
      height: b.alto,
      rx: 12,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (b.x0 + 30) + ' ' + (b.y + 23) + ' L ' + (b.x1 - 30) + ' ' + (b.y + 23),
      stroke: C.GRY,
      strokeWidth: 8,
      strokeLinecap: "round"
    }));
  }
  function dorsal(g) {
    return TOP3.atras(g.hombro, g.cadera, 0.36, 14);
  }
  function espalda(g, color) {
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [g.cadera, g.torso(0.5, -g.anchoEspalda(0.5) - 34), g.nuca],
      color: color,
      sw: 15
    });
  }

  // la figura: o lleva curva/esc/tuerce; kAntes(dt) da la k de unos instantes antes (para el desenfoque)
  function Remo(props) {
    var o = {
      curva: props.curva,
      esc: props.esc,
      tuerce: props.tuerce
    };
    var pose = remo(props.k, o);
    var T = props.T;
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(T, 0.3),
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 160,
          x1: 1360
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          suave: true,
          c: [760, PISO + 4],
          rx: 520
        }), /*#__PURE__*/React.createElement(Banco, null), props.halo ? /*#__PURE__*/React.createElement(V.Halo, {
          T: T,
          c: dorsal(g),
          r: 150,
          v: props.halo
        }) : null);
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, props.kAntes ? /*#__PURE__*/React.createElement(V.Movido, {
          n: 3,
          paso: 0.035,
          blur: 8,
          dibujar: function (dt) {
            var m = remo(props.kAntes(dt), o).mano;
            return /*#__PURE__*/React.createElement(B.MancuernaG, {
              c: m,
              ang: 0,
              giro: 0.35,
              k: 0.85
            });
          }
        }) : null, /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.mano,
          ang: 0,
          giro: 0.35,
          k: 0.85
        }), props.halo ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Halo, {
          T: T,
          c: dorsal(g),
          r: 90,
          v: props.halo * 0.45
        }), /*#__PURE__*/React.createElement(V.Destellos, {
          T: T,
          c: dorsal(g),
          r: 150,
          v: props.halo
        })) : null, props.extra ? props.extra(g) : null);
      }
    });
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: -130,
    y: 230,
    s: 0.88
  };
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var GEN = {
    zoom: 1,
    foco: en([770, 880]),
    mira: [540, 1020]
  };
  var ESPALDA = {
    zoom: 1.45,
    foco: en([700, 720]),
    mira: [540, 1040]
  };

  // repeticion: tira en el 38 % (rapido y con decision), aguanta arriba, baja lento
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.38 : va, 0.14);
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.6,
    vo: 'Estás haciendo mal tu remo con mancuerna.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.35,
        foco: en([720, 720]),
        mira: [540, 1040]
      }], [1, {
        zoom: 1.02,
        foco: en([770, 860]),
        mira: [540, 1020]
      }]],
      figura: function (T, f, t, s) {
        var k = reps(T, f(0), f(1), 2, 0.3);
        return /*#__PURE__*/React.createElement(Remo, {
          T: T,
          s: s,
          k: k,
          curva: 1,
          tuerce: 1,
          muscRojo: {
            erec: 1,
            dor: 0.6
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, espalda(g, C.RED), /*#__PURE__*/React.createElement(V.Gotas, {
              T: T,
              c: g.centroCabeza,
              v: 1
            }));
          }
        });
      },
      mal: [{
        x: 840,
        y: 470,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 140,
        y: 1180,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'REMO SERRUCHO',
        s: 1.25,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5,
    vo: 'Rodilla y mano del mismo lado en el banco, el otro pie en el piso y la espalda neutra.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.14, {
        zoom: 1.35,
        foco: en([860, 980]),
        mira: [540, 1060]
      }], [0.44, {
        zoom: 1.42,
        foco: en([800, 960]),
        mira: [540, 1060]
      }], [0.441, {
        zoom: 1.3,
        foco: en([640, 680]),
        mira: [540, 1020]
      }], [0.86, {
        zoom: 1.2,
        foco: en([680, 700]),
        mira: [540, 1020]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var apoyo = animate({
          from: 0,
          to: 1,
          start: f(0.12),
          end: f(0.24)
        })(T);
        var esp = M.draw(T, f(0.5), 0.5);
        return /*#__PURE__*/React.createElement(Remo, {
          T: T,
          s: s,
          k: 0,
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.rodilla2,
              r: 70,
              color: C.YEL,
              p: apoyo
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.suma(g.mano2, [0, -10]),
              r: 70,
              color: C.YEL,
              p: apoyo
            }), esp > 0.02 ? /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [g.cadera, g.torso(0.5, -g.anchoEspalda(0.5) - 34), g.nuca],
              color: C.GRN,
              sw: 15,
              p: esp
            }) : null);
          }
        });
      },
      bien: [{
        x: 860,
        y: 520,
        cuando: 0.3
      }, {
        x: 860,
        y: 520,
        cuando: 0.74
      }],
      r1: {
        text: 'APOYO EN EL BANCO',
        s: 1.15,
        cuando: 0.1
      },
      r2: {
        text: 'ESPALDA NEUTRA',
        s: 1.2,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 6,
    vo: 'Tira de la mancuerna hacia la cadera con el codo pegado, y baja lento hasta estirar la espalda.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.21, 0.67],
      tomas: [[0, GEN], [0.3, ESPALDA], [0.5, {
        zoom: 1.5,
        foco: en([720, 720]),
        mira: [540, 1040]
      }], [0.501, {
        zoom: 1.15,
        foco: en([780, 860]),
        mira: [540, 1020]
      }], [1, {
        zoom: 1.04,
        foco: en([770, 860]),
        mira: [540, 1020]
      }]],
      figura: function (T, f, t, s) {
        var kDe = function (Tx) {
          return reps(Tx, f(0.04), f(0.96), 2);
        };
        var k = kDe(T);
        return /*#__PURE__*/React.createElement(Remo, {
          T: T,
          s: s,
          k: k,
          halo: 0.25 + 0.75 * k,
          musc: {
            dor: 0.3 + 0.7 * k
          },
          muscGris: {
            bic: 0.3 + 0.3 * k
          },
          kAntes: function (dt) {
            return kDe(T - dt);
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: dorsal(g),
              cuando: f(0.2),
              r: 110
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: dorsal(g),
              cuando: f(0.66),
              r: 110
            }));
          }
        });
      },
      encima: function (T, f) {
        var A = global.REELS.ayudas;
        var u = clamp((T - f(0.04)) / (f(0.96) - f(0.04)), 0, 1) * 2;
        return /*#__PURE__*/React.createElement(A.Pos, {
          x: 40,
          y: 400,
          e: M.pop(T, f(0.06), 0.42),
          dy: M.life(T, 3, 5)
        }, /*#__PURE__*/React.createElement(B.Cuenta, {
          s: 0.8,
          n: Math.min(2, Math.floor(u + 0.02)),
          p: u >= 2 ? 1 : u % 1
        }));
      },
      bien: [{
        x: 860,
        y: 520,
        cuando: 0.5
      }],
      r1: {
        text: 'CODO A LA CADERA',
        s: 1.15,
        cuando: 0.08
      },
      r2: {
        text: 'BAJA LENTO',
        s: 1.25,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabaja el dorsal ancho; ayudan los romboides, el bíceps y el hombro de atrás.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.2,
        foco: en([720, 760]),
        mira: [540, 1040]
      }], [0.55, {
        zoom: 1.5,
        foco: en([700, 700]),
        mira: [540, 1060]
      }], [0.551, {
        zoom: 1.12,
        foco: en([760, 820]),
        mira: [540, 1020]
      }], [1, {
        zoom: 1.06,
        foco: en([770, 860]),
        mira: [540, 1020]
      }]],
      figura: function (T, f, t, s) {
        var m = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.2)
        })(T);
        var sec = animate({
          from: 0,
          to: 1,
          start: f(0.56),
          end: f(0.68)
        })(T);
        var k = 0.75 + 0.2 * Math.sin(T * 2.2);
        return /*#__PURE__*/React.createElement(Remo, {
          T: T,
          s: s,
          k: k,
          halo: m,
          musc: {
            dor: m
          },
          muscGris: {
            bic: sec,
            delto: sec,
            erec: 0.4 * sec
          }
        });
      },
      r1: {
        text: 'DORSAL ANCHO',
        s: 1.3,
        cuando: 0.04
      },
      r2: {
        text: '+ ROMBOIDES Y BÍCEPS',
        s: 1.05,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: curvar la espalda. Mantenla neutra todo el ejercicio.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.3,
        foco: en([700, 700]),
        mira: [540, 1030]
      }], [0.46, {
        zoom: 1.36,
        foco: en([700, 710]),
        mira: [540, 1030]
      }], [0.461, {
        zoom: 1.12,
        foco: en([760, 820]),
        mira: [540, 1020]
      }], [1, {
        zoom: 1.08,
        foco: en([760, 840]),
        mira: [540, 1020]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var kDe = function (Tx) {
          return reps(Tx, f(0), f(1), 2, 0.4);
        };
        var k = kDe(T);
        return /*#__PURE__*/React.createElement(Remo, {
          T: T,
          s: s,
          k: k,
          curva: 1 - bien,
          kAntes: function (dt) {
            return kDe(T - dt);
          },
          halo: bien >= 0.5 ? 0.3 + 0.7 * k : 0,
          muscRojo: bien < 0.5 ? {
            erec: 1
          } : null,
          musc: bien >= 0.5 ? {
            dor: 0.4 + 0.6 * k
          } : null,
          extra: function (g) {
            return espalda(g, bien < 0.5 ? C.RED : C.GRN);
          }
        });
      },
      mal: [{
        x: 840,
        y: 520,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 840,
        y: 520,
        cuando: 0.6
      }],
      r1: {
        text: 'ESPALDA CURVADA',
        s: 1.15,
        cuando: 0.04
      },
      r2: {
        text: 'ESPALDA NEUTRA',
        s: 1.2,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'Error dos: dejar quietos los omóplatos. Estira abajo y júntalos arriba.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.4,
        foco: en([690, 700]),
        mira: [540, 1040]
      }], [1, {
        zoom: 1.48,
        foco: en([690, 700]),
        mira: [540, 1040]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        // mal: medio recorrido y el hombro clavado; bien: todo el recorrido, el omoplato baja y se junta
        var kDe = function (Tx) {
          var r = reps(Tx, f(0), f(1), 2, 0.4);
          return bien < 0.5 ? 0.3 + 0.5 * r : r;
        };
        var k = kDe(T);
        return /*#__PURE__*/React.createElement(Remo, {
          T: T,
          s: s,
          k: k,
          esc: bien,
          kAntes: function (dt) {
            return kDe(T - dt);
          },
          halo: bien >= 0.5 ? 0.3 + 0.7 * k : 0,
          muscRojo: bien < 0.5 ? {
            dor: 0.6
          } : null,
          musc: bien >= 0.5 ? {
            dor: 0.4 + 0.6 * k,
            delto: 0.5
          } : null,
          extra: function (g) {
            if (bien < 0.5) return /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.hombro,
              r: 70,
              color: C.RED,
              p: 1
            });
            var arriba = remo(1).hombro,
              abajo = remo(0).hombro;
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.FlechaS, {
              a: U.suma(abajo, [-30, 60]),
              b: U.suma(arriba, [40, -50]),
              color: C.GRN,
              sw: 14
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.hombro,
              r: 66,
              color: C.GRN,
              p: 1
            }));
          }
        });
      },
      mal: [{
        x: 840,
        y: 520,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 840,
        y: 520,
        cuando: 0.6
      }],
      r1: {
        text: 'OMÓPLATOS QUIETOS',
        s: 1.15,
        cuando: 0.04
      },
      r2: {
        text: 'ESTIRA Y APRIETA',
        s: 1.2,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace: espalda neutra y el codo hacia la cadera.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.42],
      tomas: [[0, {
        zoom: 1.3,
        foco: en([720, 740]),
        mira: [540, 1040]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var kDe = function (Tx) {
          return animate({
            from: 0,
            to: 1,
            start: f(0.04),
            end: f(0.4),
            ease: Easing.easeInOutSine
          })(Tx);
        };
        var k = kDe(T);
        return /*#__PURE__*/React.createElement(Remo, {
          T: T,
          s: s,
          k: k,
          halo: 0.3 + 0.7 * k,
          musc: {
            dor: 1
          },
          kAntes: function (dt) {
            return kDe(T - dt);
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: dorsal(g),
              cuando: f(0.42),
              r: 120
            });
          }
        });
      },
      bien: [{
        x: 860,
        y: 520,
        cuando: 0.44,
        s: 0.85
      }],
      r1: {
        text: 'REMO SERRUCHO',
        s: 1.25,
        cuando: 0.06
      },
      r2: {
        text: 'CODO A LA CADERA',
        s: 1.15,
        cuando: 0.46
      }
    })
  }];
  global.REELS.registrar({
    id: 'remo-serrucho',
    titulo: 'Remo serrucho (estilo fluido)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿LO HACÍAS BIEN?',
      vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de entreno y guárdalo.'
    }
  });
})(window);
