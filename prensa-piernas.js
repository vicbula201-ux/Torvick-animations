/* GENERADO por compilar.js desde prensa-piernas.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   PRENSA DE PIERNAS A 45° — reel corto, ESTILO 2 (~34 s con el cierre)
   Fuente: libro, pag. 149. Espalda y gluteos apoyados en el banco, los pies
   en la plataforma al ancho de los hombros y las piernas un poco
   flexionadas (sin bloquear); bajar la plataforma doblando las rodillas
   hasta unos 90°, con control, sin dejarla caer, y empujar hacia arriba.
   Cuadriceps y gluteo mayor (principales); isquiotibiales, gemelos y
   aductor mayor. Errores: bloquear las rodillas y despegar la espalda o
   los gluteos del banco.
   Igual que la sentadilla en maquina: estela de movimiento, contador de
   repeticiones y errores con una figura grande que pasa de mal a bien.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    V = global.V;
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

  /* ---------------- de perfil, recostado (mira arriba a la izquierda) ---------------- */

  var PISO = 1300;
  var CADERA = [860, 1060];
  var TRONCO = -45; // el respaldo, inclinado
  var D = U.polar(TRONCO, 1); // de la cadera al cuello
  var ESPALDA = [-D[1], D[0]]; // hacia el respaldo (abajo a la derecha)
  var RIEL = U.polar(-135, 1); // la plataforma corre a 45°
  var ARRIBA = [-RIEL[1], RIEL[0]]; // a lo largo de la plataforma, hacia arriba
  var TOB0 = U.suma(CADERA, U.polar(-118, 382)); // tobillo abajo: rodilla a 90°
  var RECORRIDO = 150;
  function prod(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }

  // p 0 abajo (rodillas a 90°) .. 1 arriba; bloqueo 0..1 lleva la rodilla a fondo (el error);
  // despega 0..1 la cadera se levanta del asiento y la espalda se redondea (el error)
  function prensa(p, bloqueo, despega) {
    bloqueo = bloqueo || 0;
    despega = despega || 0;
    var e = Easing.easeInOutSine(clamp(p, 0, 1));
    var cadera = U.suma(CADERA, U.suma(U.por(RIEL, 46 * despega), U.por(ESPALDA, -40 * despega)));
    var cuello = U.suma(CADERA, U.por(D, 404));
    var tob = U.suma(TOB0, U.por(RIEL, RECORRIDO * e + 40 * bloqueo - 60 * despega));
    var r1 = B.ik(cadera, tob, 272, 268, 1),
      r2 = B.ik(cadera, tob, 272, 268, -1);
    // la rodilla dobla hacia el pecho
    var rod = prod(U.resta(r1, cadera), D) > prod(U.resta(r2, cadera), D) ? r1 : r2;
    if (bloqueo > 0) {
      // bloqueada: la rodilla pasa un poco de la linea (hiperextension)
      var lin = U.lerpP(cadera, tob, 272 / 540);
      var afuera = U.unidad(U.resta(lin, rod));
      rod = U.lerpP(rod, U.suma(lin, U.por(afuera, 12)), bloqueo);
    }
    var pose = {
      cadera: cadera,
      cuello: U.suma(cuello, U.por(ESPALDA, -30 * despega)),
      curva: 0.5 * despega,
      cabeza: 26 - 14 * despega,
      piso: PISO,
      rodilla: rod,
      tobillo: tob,
      punta: U.suma(U.suma(tob, U.por(ARRIBA, 118)), U.por(RIEL, 34)),
      rodilla2: U.suma(rod, [14, -10]),
      tobillo2: U.suma(tob, [14, -10]),
      punta2: U.suma(U.suma(U.suma(tob, [14, -10]), U.por(ARRIBA, 118)), U.por(RIEL, 34))
    };
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: cadera,
        mano: cadera
      })
    });
    var mano = U.suma(CADERA, [-30, 74]);
    var c1 = B.ik(g.hombro, mano, 232, 214, 1),
      c2 = B.ik(g.hombro, mano, 232, 214, -1);
    pose.codo = c1[1] > c2[1] ? c1 : c2;
    pose.mano = mano;
    pose.codo2 = U.suma(pose.codo, [12, -8]);
    pose.mano2 = U.suma(mano, [12, -6]);
    pose._plato = U.suma(tob, U.por(RIEL, 52));
    return pose;
  }
  function Maquina(props) {
    var pl = props.plato;
    var q = function (o, a, b) {
      return U.suma(U.suma(o, U.por(ARRIBA, a)), U.por(RIEL, b));
    };
    // la plataforma (perpendicular al riel) y el carro con los discos detras
    var plat = [q(pl, -150, 0), q(pl, 190, 0), q(pl, 190, 40), q(pl, -150, 40)];
    var carro = [q(pl, -150, 40), q(pl, 120, 40), q(pl, 120, 120), q(pl, -150, 120)];
    var disco = q(pl, -30, 190);
    var rielA = U.suma(TOB0, U.suma(U.por(ARRIBA, -210), U.por(RIEL, -200))),
      rielB = U.suma(rielA, U.por(RIEL, 680));
    var respaldoA = U.suma(CADERA, U.por(ESPALDA, 92)),
      respaldoB = U.suma(respaldoA, U.por(D, 560));
    var asientoA = U.suma(CADERA, U.suma(U.por(ESPALDA, 70), U.por(D, -40)));
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
      y: PISO + 4,
      x0: 180,
      x1: 1340
    }), /*#__PURE__*/React.createElement(V.Sombra, {
      c: [820, PISO + 2],
      rx: 420
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + U.pt([rielA[0], PISO - 30]) + ' L ' + U.pt(rielA) + ' M ' + U.pt([rielB[0] + 40, PISO - 30]) + ' L ' + U.pt(U.suma(rielB, U.por(RIEL, -60))) + ' M 1040 ' + PISO + ' L ' + U.pt(asientoA) + ' M ' + (rielB[0] - 20) + ' ' + (PISO - 30) + ' L 1240 ' + (PISO - 30),
      fill: "none"
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(rielA) + ' L ' + U.pt(rielB),
      stroke: C.INK,
      strokeWidth: 34,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(rielA) + ' L ' + U.pt(rielB),
      stroke: C.GRY,
      strokeWidth: 14,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + carro.map(U.pt).join(' L ') + ' Z',
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("circle", {
      cx: disco[0],
      cy: disco[1],
      r: 120,
      fill: props.pesada ? C.RED : C.GRY,
      stroke: C.INK,
      strokeWidth: 14
    }), /*#__PURE__*/React.createElement("circle", {
      cx: disco[0],
      cy: disco[1],
      r: 30,
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 10
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + plat.map(U.pt).join(' L ') + ' Z',
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(respaldoA) + ' L ' + U.pt(respaldoB),
      stroke: C.INK,
      strokeWidth: 84,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(respaldoA) + ' L ' + U.pt(respaldoB),
      stroke: C.GRY,
      strokeWidth: 56,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(asientoA) + ' L ' + U.pt(U.suma(asientoA, [-230, 40])),
      stroke: C.INK,
      strokeWidth: 84,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + U.pt(asientoA) + ' L ' + U.pt(U.suma(asientoA, [-230, 40])),
      stroke: C.GRY,
      strokeWidth: 56,
      strokeLinecap: "round"
    }));
  }
  function Prensa(props) {
    var pose = prensa(props.p || 0, props.bloqueo, props.despega);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, props.fase || 0),
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function () {
        return /*#__PURE__*/React.createElement(Maquina, {
          plato: pose._plato,
          pesada: props.pesada
        });
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }

  // angulo de la rodilla: arco entre el muslo y la pierna
  function anguloRodilla(g, color) {
    var a0 = Math.atan2(g.cadera[1] - g.rodilla[1], g.cadera[0] - g.rodilla[0]) * 180 / Math.PI;
    var a1 = Math.atan2(g.tobillo[1] - g.rodilla[1], g.tobillo[0] - g.rodilla[0]) * 180 / Math.PI;
    if (a1 - a0 > 180) a1 -= 360;
    if (a0 - a1 > 180) a1 += 360;
    return /*#__PURE__*/React.createElement(B.Arco, {
      c: g.rodilla,
      r: 110,
      a0: a0,
      a1: a1,
      color: color,
      sw: 14,
      cabeza: 1,
      p: 1
    });
  }
  function cuad(g) {
    return U.lerpP(g.cadera, g.rodilla, 0.5);
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: -148,
    y: 157,
    s: 0.9
  };
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var GEN = {
    zoom: 1,
    foco: en([765, 825]),
    mira: [540, 900]
  };
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.42 : va, 0.12);
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tu prensa de piernas.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.25,
        foco: en([780, 840]),
        mira: [540, 940]
      }], [1, {
        zoom: 1.03,
        foco: en([765, 825]),
        mira: [540, 900]
      }]],
      figura: function (T, f, t, s) {
        var k = reps(T, f(0), f(1), 2, 0.3);
        return /*#__PURE__*/React.createElement(Prensa, {
          T: T,
          s: s,
          p: 1 - k,
          bloqueo: 1 - k,
          despega: k,
          pesada: true,
          muscRojo: {
            erec: k,
            cuad: 1 - k
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Gotas, {
              T: T,
              c: g.centroCabeza,
              v: 1
            });
          }
        });
      },
      mal: [{
        x: 820,
        y: 460,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 120,
        y: 1200,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'PRENSA DE PIERNAS',
        s: 1.15,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5.5,
    vo: 'Espalda y glúteos bien apoyados, los pies en la plataforma al ancho de los hombros y las piernas un poco flexionadas.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.16, {
        zoom: 1.7,
        foco: en([980, 940]),
        mira: [540, 1000]
      }], [0.44, {
        zoom: 1.7,
        foco: en([980, 940]),
        mira: [540, 1000]
      }], [0.6, {
        zoom: 1.8,
        foco: en([600, 640]),
        mira: [540, 960]
      }], [0.86, {
        zoom: 1.8,
        foco: en([600, 640]),
        mira: [540, 960]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var esp = M.draw(T, f(0.14), 0.5);
        var pie = animate({
          from: 0,
          to: 1,
          start: f(0.58),
          end: f(0.7)
        })(T);
        return /*#__PURE__*/React.createElement(Prensa, {
          T: T,
          s: s,
          p: 0.85,
          extra: function (g) {
            var a = U.suma(CADERA, U.por(ESPALDA, 60));
            return /*#__PURE__*/React.createElement("g", null, esp > 0.02 ? /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [a, U.suma(a, U.por(D, 420))],
              color: C.GRN,
              sw: 14,
              p: esp
            }) : null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.suma(g.cadera, U.por(ESPALDA, 40)),
              r: 80,
              color: C.YEL,
              p: animate({
                from: 0,
                to: 1,
                start: f(0.2),
                end: f(0.3)
              })(T)
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.lerpP(g.tobillo, g.punta, 0.5),
              r: 86,
              color: C.YEL,
              p: pie
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.32
      }, {
        x: 860,
        y: 560,
        cuando: 0.76
      }],
      r1: {
        text: 'ESPALDA APOYADA',
        cuando: 0.12
      },
      r2: {
        text: 'PIES AL ANCHO',
        s: 1.2,
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 6,
    vo: 'Baja la plataforma hasta que las rodillas lleguen a unos 90 grados, sin dejarla caer, y empuja de vuelta.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.52, 0.95],
      tomas: [[0, GEN], [0.3, {
        zoom: 1.2,
        foco: en([780, 800]),
        mira: [540, 900]
      }], [0.8, {
        zoom: 1.2,
        foco: en([780, 800]),
        mira: [540, 900]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(V.Estela, {
          T: T,
          n: 3,
          paso: 0.07,
          dibujar: function (Tx, fantasma) {
            var k = 1 - reps(Tx, f(0.04), f(0.96), 2);
            return /*#__PURE__*/React.createElement(Prensa, {
              T: Tx,
              s: s,
              p: 0.9 * k,
              musc: {
                cuad: 0.3 + 0.7 * (1 - k),
                glu: 0.3 + 0.7 * (1 - k)
              },
              extra: fantasma ? null : function (g) {
                return /*#__PURE__*/React.createElement("g", null, k < 0.08 ? anguloRodilla(g, C.YEL) : null, /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: g.rodilla,
                  cuando: f(0.27),
                  r: 90
                }), /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: g.rodilla,
                  cuando: f(0.73),
                  r: 90
                }));
              }
            });
          }
        });
      },
      encima: function (T, f) {
        var A = global.REELS.ayudas;
        var u = clamp((T - f(0.04)) / (f(0.96) - f(0.04)), 0, 1) * 2;
        return /*#__PURE__*/React.createElement(A.Pos, {
          x: 40,
          y: 1150,
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
        y: 560,
        cuando: 0.5
      }],
      r1: {
        text: 'RODILLAS A 90°',
        s: 1.2,
        cuando: 0.08
      },
      r2: {
        text: 'SIN DEJARLA CAER',
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabajan el cuádriceps y el glúteo mayor, con ayuda de los isquios y los gemelos.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.7,
        foco: en([880, 900]),
        mira: [540, 1000]
      }], [0.6, {
        zoom: 1.8,
        foco: en([880, 900]),
        mira: [540, 1000]
      }], [1, {
        zoom: 1.25,
        foco: en([800, 860]),
        mira: [540, 940]
      }]],
      figura: function (T, f, t, s) {
        var m = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.18)
        })(T);
        var sec = animate({
          from: 0,
          to: 1,
          start: f(0.56),
          end: f(0.68)
        })(T);
        return /*#__PURE__*/React.createElement(Prensa, {
          T: T,
          s: s,
          p: 0.2,
          musc: {
            cuad: m,
            glu: m
          },
          muscGris: {
            isq: sec,
            gem: sec
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: cuad(g),
              r: 90,
              v: m
            }), /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: U.suma(g.cadera, U.por(ESPALDA, 50)),
              r: 70,
              v: m
            }));
          }
        });
      },
      r1: {
        text: 'CUÁDRICEPS Y GLÚTEO',
        cuando: 0.04
      },
      r2: {
        text: '+ ISQUIOS Y GEMELOS',
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: bloquear las rodillas arriba. Deja siempre una pequeña flexión.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.35,
        foco: en([760, 760]),
        mira: [540, 940]
      }], [1, {
        zoom: 1.3,
        foco: en([760, 780]),
        mira: [540, 940]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var k = reps(T, f(0), f(1), 2, 0.5);
        var golpe = bien < 0.5 && k > 0.9 ? M.vibra(T, 40, 1) : 0;
        return /*#__PURE__*/React.createElement(Prensa, {
          T: T,
          s: s,
          p: 0.6 + 0.4 * k,
          bloqueo: (1 - bien) * Math.max(0, (k - 0.6) / 0.4),
          muscRojo: bien < 0.5 ? {
            cuad: 1
          } : null,
          musc: bien >= 0.5 ? {
            cuad: 1
          } : null,
          extra: function (g) {
            return bien < 0.5 ? /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.suma(g.rodilla, [golpe * 4, 0]),
              r: 70,
              color: C.RED,
              p: 1
            }) : anguloRodilla(g, C.GRN);
          }
        });
      },
      mal: [{
        x: 820,
        y: 480,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 820,
        y: 480,
        cuando: 0.6
      }],
      r1: {
        text: 'RODILLAS BLOQUEADAS',
        cuando: 0.04
      },
      r2: {
        text: 'UN POCO FLEXIONADAS',
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'Error dos: despegar la espalda o los glúteos del asiento. Tu zona lumbar lo paga.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.4,
        foco: en([900, 960]),
        mira: [540, 980]
      }], [1, {
        zoom: 1.3,
        foco: en([880, 940]),
        mira: [540, 980]
      }]],
      figura: function (T, f, t, s) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var k = reps(T, f(0), f(1), 2, 0.45);
        return /*#__PURE__*/React.createElement(Prensa, {
          T: T,
          s: s,
          p: 0.8 * (1 - k),
          despega: (1 - bien) * k,
          muscRojo: bien < 0.5 ? {
            erec: 1
          } : null,
          musc: bien >= 0.5 ? {
            glu: 1
          } : null,
          extra: function (g) {
            var a = U.suma(CADERA, U.por(ESPALDA, 60));
            return bien < 0.5 ? /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.suma(g.cadera, U.por(ESPALDA, 50)),
              r: 84,
              color: C.RED,
              p: 1
            }) : /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [a, U.suma(a, U.por(D, 420))],
              color: C.GRN,
              sw: 14,
              p: 1
            });
          }
        });
      },
      mal: [{
        x: 120,
        y: 520,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 120,
        y: 520,
        cuando: 0.6
      }],
      r1: {
        text: 'GLÚTEOS DESPEGADOS',
        cuando: 0.04
      },
      r2: {
        text: 'PEGADO AL ASIENTO',
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace. Controla la bajada y no bloquees.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.4],
      tomas: [[0, {
        zoom: 1.15,
        foco: en([780, 840]),
        mira: [540, 920]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var k = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.4),
          ease: Easing.easeInOutSine
        })(T);
        return /*#__PURE__*/React.createElement(Prensa, {
          T: T,
          s: s,
          p: 0.9 * k,
          musc: {
            cuad: 1,
            glu: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.rodilla,
              cuando: f(0.4),
              r: 100
            });
          }
        });
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.42,
        s: 0.85
      }],
      r1: {
        text: 'PRENSA DE PIERNAS',
        s: 1.15,
        cuando: 0.06
      },
      r2: {
        text: 'BAJA CONTROLADO',
        cuando: 0.46
      }
    })
  }];
  global.REELS.registrar({
    id: 'prensa-piernas',
    titulo: 'Prensa de piernas (estilo 2)',
    estilo: 2,
    escenas: ESCENAS
  });
})(window);
