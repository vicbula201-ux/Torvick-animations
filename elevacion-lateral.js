/* GENERADO por compilar.js desde elevacion-lateral.jsx — no editar a mano. */
/* ============================================================
   ELEVACION LATERAL CON MANCUERNAS — reel corto, ESTILO 2 (~34 s con el cierre)
   Fuente: libro, pag. 80. De pie, pies al ancho de los hombros, una
   mancuerna en cada mano con las palmas hacia adentro; subir los brazos
   hacia los lados hasta la altura de los hombros, con los codos un poco
   flexionados y las palmas hacia abajo, y bajar controlado. Porcion
   lateral del deltoides (principal); supraespinoso, deltoides anterior y
   serrato. Errores: demasiado peso (no completas el recorrido y compensas)
   y subir por encima del hombro (tension innecesaria en la articulacion).
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

  /* ---------------- de frente ---------------- */

  // a: grados del brazo desde la vertical (12 abajo, 90 a la altura del hombro);
  // enc 0..1 encoge los hombros; rebote: px que baja el cuerpo (rodillas, impulso)
  function lateral(a, enc, rebote) {
    var p = B.poseFrente.depie({
      pies: 110
    });
    var dy = rebote || 0;
    if (dy) {
      p.centro = [p.centro[0], p.centro[1] + dy];
      p.cuello = [p.cuello[0], p.cuello[1] + dy];
      ['izq', 'der'].forEach(function (k, i) {
        p[k].rodilla = U.suma(p[k].rodilla, [(i ? 1 : -1) * 0.5 * dy, 0.5 * dy]);
      });
    }
    var g = B.geoFrente({
      pose: p
    });
    ['izq', 'der'].forEach(function (k, i) {
      var l = i ? 1 : -1;
      var S = U.suma(g[k].hombro, [0, -34 * (enc || 0)]);
      var ra = a * Math.PI / 180,
        rb = (a - 8) * Math.PI / 180;
      var E = U.suma(S, [l * Math.sin(ra) * 200, Math.cos(ra) * 200]);
      p[k].hombro = S;
      p[k].codo = E;
      p[k].mano = U.suma(E, [l * Math.sin(rb) * 190, Math.cos(rb) * 190]);
    });
    return p;
  }
  function Frente(props) {
    var pose = lateral(props.a == null ? 12 : props.a, props.enc, props.rebote);
    var pesada = props.pesada;
    return /*#__PURE__*/React.createElement(B.Frente, {
      s: props.s,
      pose: pose,
      parpadeo: V.parpadeo(props.T, props.fase || 0),
      boca: props.boca,
      musc: props.musc,
      muscGris: props.muscGris,
      muscRojo: props.muscRojo,
      fondo: function () {
        return /*#__PURE__*/React.createElement(V.Sombra, {
          c: [600, 1505],
          rx: 300
        });
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement("g", null, ['izq', 'der'].map(function (k) {
          return /*#__PURE__*/React.createElement(B.MancuernaG, {
            key: k,
            c: g[k].mano,
            ang: 0,
            giro: 0.72,
            k: pesada ? 0.98 : 0.74,
            color: pesada ? C.RED : null
          });
        }));
      },
      children: function (g) {
        return props.extra ? props.extra(g) : null;
      }
    });
  }

  // linea a la altura de los hombros
  function lineaHombros(g, color, p, dy) {
    var y = (g.izq.hombro[1] + g.der.hombro[1]) / 2 + (dy || 0);
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: [[g.izq.hombro[0] - 470, y], [g.der.hombro[0] + 470, y]],
      color: color,
      sw: 14,
      p: p == null ? 1 : p
    });
  }
  // camino de cada mano: un arco con centro en el hombro
  function arcos(g, color, p) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Arco, {
      c: g.der.hombro,
      r: 430,
      a0: 78,
      a1: 6,
      color: color,
      sw: 14,
      p: p
    }), /*#__PURE__*/React.createElement(B.Arco, {
      c: g.izq.hombro,
      r: 430,
      a0: 102,
      a1: 174,
      color: color,
      sw: 14,
      p: p
    }));
  }

  /* ---------------- encuadre ---------------- */

  var FIG = {
    x: 72,
    y: 167,
    s: 0.78
  };
  function en(p) {
    return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
  }
  var GEN = {
    zoom: 1.02,
    foco: en([600, 940]),
    mira: [540, 920]
  };
  var CMP = {
    s: 0.74,
    desdeY: 190,
    h: 580,
    centroX: 600,
    yArriba: 310,
    yAbajo: 940
  };
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.14);
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tus elevaciones laterales.',
    C: V.escena({
      fig: FIG,
      vibra: true,
      tomas: [[0, {
        zoom: 1.35,
        foco: en([600, 760]),
        mira: [540, 1000]
      }], [1, {
        zoom: 1.08,
        foco: en([600, 900]),
        mira: [540, 940]
      }]],
      figura: function (T, f, t, s) {
        var k = reps(T, f(0), f(1), 3, 0.3);
        return /*#__PURE__*/React.createElement(Frente, {
          T: T,
          s: s,
          a: 14 + 46 * k,
          enc: k,
          rebote: 50 * k,
          pesada: true,
          boca: "triste",
          muscRojo: {
            trap: 1
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement(V.Gotas, {
              T: T,
              c: g.cabeza,
              v: 1
            });
          }
        });
      },
      mal: [{
        x: 840,
        y: 420,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 110,
        y: 1250,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'ELEVACIÓN LATERAL',
        s: 1.15,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5,
    vo: 'De pie, con los pies al ancho de los hombros, una mancuerna en cada mano y las palmas hacia adentro.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, GEN], [0.16, {
        zoom: 1.7,
        foco: en([600, 1380]),
        mira: [540, 1000]
      }], [0.44, {
        zoom: 1.7,
        foco: en([600, 1380]),
        mira: [540, 1000]
      }], [0.6, {
        zoom: 1.9,
        foco: en([830, 1040]),
        mira: [540, 1000]
      }], [0.86, {
        zoom: 1.9,
        foco: en([830, 1040]),
        mira: [540, 1000]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var pies = animate({
          from: 0,
          to: 1,
          start: f(0.14),
          end: f(0.26)
        })(T);
        var manos = animate({
          from: 0,
          to: 1,
          start: f(0.6),
          end: f(0.72)
        })(T);
        return /*#__PURE__*/React.createElement(Frente, {
          T: T,
          s: s,
          a: 12,
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Puntos, {
              pts: [[g.izq.hombro[0], 1490], [g.der.hombro[0], 1490]],
              color: C.GRN,
              sw: 14,
              p: pies
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.izq.medioPie,
              r: 80,
              color: C.YEL,
              p: pies
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.der.medioPie,
              r: 80,
              color: C.YEL,
              p: pies
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.izq.mano,
              r: 84,
              color: C.YEL,
              p: manos
            }), /*#__PURE__*/React.createElement(B.Anillo, {
              c: g.der.mano,
              r: 84,
              color: C.YEL,
              p: manos
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 600,
        cuando: 0.32
      }, {
        x: 860,
        y: 600,
        cuando: 0.76
      }],
      r1: {
        text: 'PIES AL ANCHO',
        s: 1.2,
        cuando: 0.12
      },
      r2: {
        text: 'PALMAS HACIA ADENTRO',
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 5.5,
    vo: 'Sube los brazos hacia los lados hasta la altura de los hombros, con los codos un poco flexionados.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.27, 0.73],
      tomas: [[0, GEN], [0.3, {
        zoom: 1.04,
        foco: en([600, 800]),
        mira: [540, 900]
      }], [0.8, {
        zoom: 1.04,
        foco: en([600, 800]),
        mira: [540, 900]
      }], [1, GEN]],
      figura: function (T, f, t, s) {
        var k = reps(T, f(0.02), f(0.98), 2);
        var guia = M.draw(T, f(0.02), 0.6);
        return /*#__PURE__*/React.createElement(Frente, {
          T: T,
          s: s,
          a: 12 + 78 * k,
          musc: {
            delt: 0.3 + 0.7 * k
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, arcos(g, C.YEL, guia * (1 - k)), k > 0.92 ? lineaHombros(g, C.GRN) : null, /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.izq.mano,
              cuando: f(0.27),
              r: 80
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.der.mano,
              cuando: f(0.27),
              r: 80
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.izq.mano,
              cuando: f(0.73),
              r: 80
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.der.mano,
              cuando: f(0.73),
              r: 80
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 1180,
        cuando: 0.6,
        s: 0.6
      }],
      r1: {
        text: 'HASTA LOS HOMBROS',
        cuando: 0.06
      },
      r2: {
        text: 'CODOS SEMIFLEXIONADOS',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabaja el deltoides lateral, con ayuda del supraespinoso y el deltoides anterior.',
    C: V.escena({
      fig: FIG,
      tomas: [[0, {
        zoom: 1.7,
        foco: en([600, 640]),
        mira: [540, 900]
      }], [0.6, {
        zoom: 1.8,
        foco: en([600, 640]),
        mira: [540, 900]
      }], [1, {
        zoom: 1.3,
        foco: en([600, 720]),
        mira: [540, 900]
      }]],
      figura: function (T, f, t, s) {
        var d = animate({
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
        return /*#__PURE__*/React.createElement(Frente, {
          T: T,
          s: s,
          a: 88,
          musc: {
            delt: d
          },
          muscGris: {
            trap: sec,
            pec: 0.5 * sec
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: g.izq.hombro,
              r: 80,
              v: d
            }), /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: g.der.hombro,
              r: 80,
              v: d
            }));
          }
        });
      },
      r1: {
        text: 'DELTOIDES LATERAL',
        cuando: 0.04
      },
      r2: {
        text: '+ SUPRAESPINOSO',
        s: 1.2,
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: usar demasiado peso. Te balanceas, encoges los hombros y no completas el recorrido.',
    C: V.escena({
      comparar: {
        cmp: CMP,
        mal: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 3, 0.3);
          return /*#__PURE__*/React.createElement(Frente, {
            T: T,
            s: s,
            a: 14 + 44 * k,
            enc: k,
            rebote: 46 * k,
            pesada: true,
            muscRojo: {
              trap: 1
            }
          });
        },
        bien: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 2);
          return /*#__PURE__*/React.createElement(Frente, {
            T: T,
            s: s,
            a: 12 + 78 * k,
            fase: 1.2,
            musc: {
              delt: 1
            }
          });
        }
      },
      r1: {
        text: 'DEMASIADO PESO',
        cuando: 0.04
      },
      r2: {
        text: 'PESO QUE CONTROLES',
        cuando: 0.36
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'Error dos: subir por encima del hombro. No suma nada y carga la articulación.',
    C: V.escena({
      comparar: {
        cmp: CMP,
        mal: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 2);
          return /*#__PURE__*/React.createElement(Frente, {
            T: T,
            s: s,
            a: 12 + 118 * k,
            enc: 0.5 * k,
            muscRojo: {
              trap: k
            },
            extra: function (g) {
              return lineaHombros(g, C.RED, 1, 34 * 0.5 * k);
            }
          });
        },
        bien: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 2);
          return /*#__PURE__*/React.createElement(Frente, {
            T: T,
            s: s,
            a: 12 + 78 * k,
            fase: 0.8,
            musc: {
              delt: 1
            },
            extra: function (g) {
              return lineaHombros(g, C.GRN);
            }
          });
        }
      },
      mal: [{
        x: 890,
        y: 590,
        cuando: 0.14,
        s: 0.5
      }],
      r1: {
        text: 'POR ENCIMA DEL HOMBRO',
        cuando: 0.04
      },
      r2: {
        text: 'A LA ALTURA DEL HOMBRO',
        cuando: 0.36
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace. Peso justo y hasta los hombros.',
    C: V.escena({
      fig: FIG,
      pulsos: [0.4],
      tomas: [[0, {
        zoom: 1.12,
        foco: en([600, 800]),
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
        return /*#__PURE__*/React.createElement(Frente, {
          T: T,
          s: s,
          a: 12 + 78 * k,
          musc: {
            delt: 1
          },
          boca: "sonrisa",
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, k > 0.95 ? lineaHombros(g, C.GRN) : null, /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.izq.hombro,
              cuando: f(0.4),
              r: 90
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: g.der.hombro,
              cuando: f(0.4),
              r: 90
            }));
          }
        });
      },
      bien: [{
        x: 860,
        y: 1180,
        cuando: 0.42,
        s: 0.7
      }],
      r1: {
        text: 'ELEVACIÓN LATERAL',
        s: 1.15,
        cuando: 0.06
      },
      r2: {
        text: 'HASTA LOS HOMBROS',
        cuando: 0.46
      }
    })
  }];
  global.REELS.registrar({
    id: 'elevacion-lateral',
    titulo: 'Elevación lateral (estilo 2)',
    estilo: 2,
    escenas: ESCENAS
  });
})(window);
