/* GENERADO por compilar.js desde zancada.jsx — no editar a mano. */
/* ============================================================
   ZANCADA CON MANCUERNAS — reel corto, ESTILO 2 (~33 s con la accion y el cierre)
   Fuente: libro, pag. 141. De pie, pies al ancho de los hombros y una
   mancuerna en cada mano al costado; dar un paso adelante y flexionar las
   rodillas hasta que el muslo de adelante quede paralelo al piso y la
   rodilla de atras casi toque el suelo; empujar y volver. Cuadriceps y
   gluteo mayor (principales); isquios, gemelos y aductores; el tronco y el
   gluteo medio estabilizan. Errores del libro: perder el equilibrio y el
   valgo dinamico (la rodilla que se va hacia adentro). El primero se ve de
   perfil; el segundo, de frente.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    V = global.V,
    TOR = global.TOR;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var U = B.util;
  var C = P.C;

  /* ---------------- de perfil (mira a la izquierda) ---------------- */

  var PISO = 1300;
  var BASE = B.posePerfil.depie({
    x: 880,
    piso: PISO
  });
  function ik2(cad, tob, masAbajo) {
    var r1 = B.ik(cad, tob, 272, 268, 1),
      r2 = B.ik(cad, tob, 272, 268, -1);
    return masAbajo ? r1[1] > r2[1] ? r1 : r2 : r1[0] < r2[0] ? r1 : r2;
  }
  // paso 0..1 el pie de adelante sale; baja 0..1 la cadera baja; alza 0..1 levanta el pie (en el paso);
  // tambalea: angulo extra del tronco (el error del equilibrio)
  function zancada(paso, baja, alza, tambalea) {
    var s = Easing.easeInOutSine(clamp(paso, 0, 1)),
      d = Easing.easeInOutSine(clamp(baja, 0, 1));
    var cad = [U.lerp(880, 690, s), U.lerp(BASE.cadera[1], 990, d)];
    var pose = Object.assign({}, BASE, {
      cadera: cad,
      cuello: U.suma(cad, U.polar(-92 - 4 * d + (tambalea || 0), 404)),
      curva: 0,
      cabeza: -(tambalea || 0) * 0.5
    });
    pose.tobillo = [U.lerp(894, 470, s), PISO - 32 - 70 * (alza || 0)];
    pose.punta = U.suma(pose.tobillo, [-112, 32]);
    var t2 = [U.lerp(928, 980, s), U.lerp(PISO - 32, PISO - 86, d)];
    pose.tobillo2 = t2;
    pose.punta2 = d > 0.02 ? [t2[0] - 96, PISO - 2] : U.suma(t2, [-112, 32]);
    pose.rodilla = ik2(cad, pose.tobillo, false);
    pose.rodilla2 = ik2(cad, t2, true);
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: cad,
        mano: cad
      })
    });
    var a = 92 - 1.6 * (tambalea || 0);
    pose.codo = U.suma(g.hombro, U.polar(a, 232));
    pose.mano = U.suma(pose.codo, U.polar(a - 2, 214));
    pose.codo2 = U.suma(pose.codo, [14, -8]);
    pose.mano2 = U.suma(pose.mano, [14, -8]);
    return pose;
  }
  // una repeticion completa: u 0..1 (sale el pie, baja, sube, vuelve)
  function fases(u) {
    var paso = clamp(u / 0.22, 0, 1) * (1 - clamp((u - 0.78) / 0.22, 0, 1));
    var baja = Math.sin(Math.PI * clamp((u - 0.22) / 0.56, 0, 1));
    var alza = Math.sin(Math.PI * clamp(u / 0.22, 0, 1)) + Math.sin(Math.PI * clamp((u - 0.78) / 0.22, 0, 1));
    return {
      paso: paso,
      baja: baja,
      alza: alza
    };
  }
  function Zancada(props) {
    var pose = zancada(props.paso, props.baja, props.alza, props.tambalea);
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, props.fase || 0),
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 260,
          x1: 1240
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [U.lerp(880, 720, clamp(props.paso, 0, 1)), PISO + 2],
          rx: 320
        }), /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.mano2,
          ang: 90,
          giro: 0,
          k: 0.7
        }));
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.mano,
          ang: 90,
          giro: 0,
          k: 0.7
        });
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }
  function cuad(g) {
    return U.lerpP(g.cadera, g.rodilla, 0.5);
  }

  /* ---------------- de frente, abajo de la zancada (el valgo) ---------------- */

  var DEPIE_F = B.poseFrente.depie({
    pies: 120
  });
  function frente(baja, valgo) {
    var p = B.poseFrente.depie({
      pies: 120
    });
    var d = Easing.easeInOutSine(clamp(baja, 0, 1)),
      dy = 190 * d;
    p.centro = U.suma(p.centro, [0, dy]);
    p.cuello = U.suma(p.cuello, [0, dy]);
    ['izq', 'der'].forEach(function (k) {
      p[k].codo = U.suma(DEPIE_F[k].codo, [0, dy]);
      p[k].mano = U.suma(DEPIE_F[k].mano, [0, dy]);
    });
    // izq: la pierna de adelante (el muslo viene hacia la camara, se ve corto y la
    // canilla queda vertical sobre el pie); der: la de atras (la rodilla baja al piso)
    var ci = [600 - 86, p.centro[1]],
      cd = [600 + 86, p.centro[1]];
    var pieI = DEPIE_F.izq.tobillo,
      pieD = DEPIE_F.der.tobillo;
    var rodI = [pieI[0] + 4, pieI[1] - 236];
    p.izq.rodilla = U.suma(U.lerpP(U.lerpP(ci, pieI, 0.5), rodI, d), [88 * (valgo || 0), 0]);
    p.der.rodilla = U.lerpP(U.lerpP(cd, pieD, 0.5), [cd[0] + 12, pieD[1] - 84], d);
    p.der.tobillo = U.lerpP(pieD, U.suma(p.der.rodilla, [4, 34]), d);
    p.der.sinZapato = d > 0.5;
    return p;
  }
  function Frente(props) {
    var pose = frente(props.baja, props.valgo);
    return /*#__PURE__*/React.createElement(TOR.Tor, {
      s: props.s,
      pose: pose,
      sinPiso: true,
      parpadeo: V.parpadeo(props.T),
      boca: props.boca || true,
      gesto: props.gesto,
      musc: props.musc,
      muscRojo: props.muscRojo,
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: 1504,
          x0: 240,
          x1: 960
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [600, 1502],
          rx: 260
        }));
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.izq.mano,
          ang: 90,
          giro: 0,
          k: 0.7
        }), /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.der.mano,
          ang: 90,
          giro: 0,
          k: 0.7
        }));
      },
      extra: props.extra
    });
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: -46,
    y: 273,
    s: 0.82
  };
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var GEN = {
    zoom: 1,
    foco: en([720, 820]),
    mira: [540, 900]
  };
  var FF = {
    x: 72,
    y: 166,
    s: 0.78
  };
  function enF(p) {
    return [FF.x + p[0] * FF.s, FF.y + p[1] * FF.s];
  }
  function rep(T, a, b, n) {
    return fases(V.fase(T, a, b, n));
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tu zancada.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.25,
        foco: en([700, 860]),
        mira: [540, 960]
      }], [1, {
        zoom: 1.03,
        foco: en([700, 820]),
        mira: [540, 900]
      }]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(Zancada, {
          T: T,
          s: s,
          paso: 1,
          baja: 0.7 + 0.2 * Math.sin(T * 5),
          tambalea: 16 * Math.sin(T * 6.5),
          muscRojo: {
            cuad: 1
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
        x: 110,
        y: 470,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'ZANCADA',
        s: 1.35,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5,
    vo: 'De pie, con los pies al ancho de los hombros y una mancuerna en cada mano, al lado del cuerpo.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.16, {
        zoom: 1.15,
        foco: en([880, 1120]),
        mira: [540, 1160]
      }], [0.44, {
        zoom: 1.15,
        foco: en([880, 1120]),
        mira: [540, 1160]
      }], [0.6, {
        zoom: 1.12,
        foco: en([850, 980]),
        mira: [540, 1060]
      }], [0.86, {
        zoom: 1.12,
        foco: en([850, 980]),
        mira: [540, 1060]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var pie = animate({
          from: 0,
          to: 1,
          start: f(0.16),
          end: f(0.28)
        })(T);
        var mc = animate({
          from: 0,
          to: 1,
          start: f(0.6),
          end: f(0.7)
        })(T);
        return /*#__PURE__*/React.createElement(Zancada, {
          T: T,
          s: s,
          paso: 0,
          baja: 0,
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: U.lerpP(g.tobillo, g.punta, 0.5),
              r: 110,
              color: C.YEL,
              p: pie
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.mano,
              r: 110,
              color: C.YEL,
              p: mc
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
        text: 'PIES AL ANCHO',
        s: 1.2,
        cuando: 0.12
      },
      r2: {
        text: 'MANCUERNAS AL COSTADO',
        s: 1.0,
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 6,
    vo: 'Da un paso adelante y baja hasta que el muslo quede paralelo al piso; empuja y vuelve.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.27, 0.77],
      tomas: [[0, GEN], [0.3, {
        zoom: 1.1,
        foco: en([700, 880]),
        mira: [540, 920]
      }], [0.8, {
        zoom: 1.1,
        foco: en([700, 880]),
        mira: [540, 920]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(V.Estela, {
          T: T,
          n: 3,
          paso: 0.06,
          dibujar: function (Tx, fantasma) {
            var q = rep(Tx, f(0.02), f(0.98), 2);
            return /*#__PURE__*/React.createElement(Zancada, {
              T: Tx,
              s: s,
              paso: q.paso,
              baja: q.baja,
              alza: q.alza,
              musc: {
                cuad: 0.3 + 0.7 * q.baja,
                glu: 0.3 + 0.7 * q.baja
              },
              extra: fantasma ? null : function (g) {
                return /*#__PURE__*/React.createElement("g", null, q.baja > 0.92 ? /*#__PURE__*/React.createElement(B.Puntos, {
                  pts: [g.cadera, g.rodilla],
                  color: C.GRN,
                  sw: 14,
                  p: 1
                }) : null, /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: g.rodilla,
                  cuando: f(0.26),
                  r: 90
                }), /*#__PURE__*/React.createElement(V.Chispa, {
                  T: T,
                  c: g.rodilla,
                  cuando: f(0.74),
                  r: 90
                }));
              }
            });
          }
        });
      },
      encima: function (T, f) {
        var A = global.REELS.ayudas;
        var u = clamp((T - f(0.02)) / (f(0.98) - f(0.02)), 0, 1) * 2;
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
        text: 'PASO ADELANTE',
        s: 1.2,
        cuando: 0.06
      },
      r2: {
        text: 'MUSLO PARALELO',
        s: 1.2,
        cuando: 0.3
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabajan el cuádriceps y el glúteo, con ayuda de los isquios y los gemelos.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.4,
        foco: en([620, 1040]),
        mira: [540, 1040]
      }], [0.6, {
        zoom: 1.45,
        foco: en([620, 1060]),
        mira: [540, 1040]
      }], [1, {
        zoom: 1.15,
        foco: en([680, 960]),
        mira: [540, 960]
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
        return /*#__PURE__*/React.createElement(Zancada, {
          T: T,
          s: s,
          paso: 1,
          baja: 0.92 + 0.08 * Math.sin(T * 2),
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
              c: U.suma(g.cadera, [40, 30]),
              r: 70,
              v: m
            }));
          }
        });
      },
      r1: {
        text: 'CUÁDRICEPS Y GLÚTEO',
        s: 1.05,
        cuando: 0.04
      },
      r2: {
        text: '+ ISQUIOS Y GEMELOS',
        s: 1.05,
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: perder el equilibrio. Tronco firme y la mirada al frente.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.15,
        foco: en([700, 860]),
        mira: [540, 940]
      }], [1, {
        zoom: 1.1,
        foco: en([700, 860]),
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
        var tb = (1 - bien) * 18 * Math.sin(T * 6.5);
        return /*#__PURE__*/React.createElement(Zancada, {
          T: T,
          s: s,
          paso: 1,
          baja: 0.6 + 0.35 * Math.sin(T * 2.4),
          tambalea: tb,
          muscRojo: bien < 0.5 ? {
            abd: 1,
            erec: 1
          } : null,
          musc: bien >= 0.5 ? {
            abd: 1,
            cuad: 1
          } : null,
          extra: function (g) {
            return /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [g.cadera, g.cuello, g.centroCabeza],
              color: bien < 0.5 ? C.RED : C.GRN,
              sw: 14,
              p: 1
            });
          }
        });
      },
      mal: [{
        x: 820,
        y: 470,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 820,
        y: 470,
        cuando: 0.6
      }],
      r1: {
        text: 'SIN EQUILIBRIO',
        s: 1.2,
        cuando: 0.04
      },
      r2: {
        text: 'TRONCO FIRME',
        s: 1.2,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'Error dos: dejar que la rodilla se vaya hacia adentro. Que apunte hacia tu pie.',
    C: V.escena({
      fig: FF,
      tomas: [[0, {
        zoom: 1.35,
        foco: enF([600, 1180]),
        mira: [540, 1040]
      }], [1, {
        zoom: 1.3,
        foco: enF([600, 1160]),
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
        var d = 0.82 + 0.18 * Math.sin(T * 2.6);
        return /*#__PURE__*/React.createElement(Frente, {
          T: T,
          s: s,
          baja: d,
          valgo: (1 - bien) * d,
          muscRojo: bien < 0.5 ? {
            aduct: 1
          } : null,
          musc: bien >= 0.5 ? {
            cuad: 1
          } : null,
          extra: function (g) {
            var pie = [g.izq.tobillo[0] - 6, g.izq.tobillo[1] + 40];
            return bien < 0.5 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.izq.rodilla,
              r: 70,
              color: C.RED,
              p: 1
            }), /*#__PURE__*/React.createElement(B.FlechaS, {
              a: U.suma(g.izq.rodilla, [-110, 0]),
              b: U.suma(g.izq.rodilla, [-30, 0]),
              color: C.RED,
              sw: 14
            })) : /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [U.suma(g.izq.rodilla, [0, -60]), pie],
              color: C.GRN,
              sw: 14,
              p: 1
            });
          }
        });
      },
      mal: [{
        x: 820,
        y: 640,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 820,
        y: 640,
        cuando: 0.6
      }],
      r1: {
        text: 'RODILLA ADENTRO',
        s: 1.15,
        cuando: 0.04
      },
      r2: {
        text: 'RODILLA HACIA EL PIE',
        s: 1.05,
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace: paso firme y el muslo paralelo.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.42],
      tomas: [[0, {
        zoom: 1.12,
        foco: en([720, 860]),
        mira: [540, 920]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var k = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.42),
          ease: Easing.easeInOutSine
        })(T);
        return /*#__PURE__*/React.createElement(Zancada, {
          T: T,
          s: s,
          paso: Math.min(1, k * 2),
          baja: Math.max(0, k * 2 - 1),
          musc: {
            cuad: 1,
            glu: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.rodilla,
              cuando: f(0.42),
              r: 100
            });
          }
        });
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.44,
        s: 0.85
      }],
      r1: {
        text: 'ZANCADA',
        s: 1.35,
        cuando: 0.06
      },
      r2: {
        text: 'PASO FIRME',
        s: 1.2,
        cuando: 0.46
      }
    })
  }];
  global.REELS.registrar({
    id: 'zancada',
    titulo: 'Zancada con mancuernas (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿LO HACÍAS BIEN?',
      vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de gym y guárdalo.'
    }
  });
})(window);
