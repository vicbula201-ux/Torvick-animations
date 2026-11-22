/* GENERADO por compilar.js desde press-militar-3d.jsx — no editar a mano. */
/* ============================================================
   PRESS MILITAR CON MANCUERNAS — TOR EN 3D (mismo guion que press-militar.jsx)
   Sentado en el banco con respaldo, una mancuerna en cada mano a la altura
   de los hombros; empujar hasta estirar los brazos y bajar controlado.
   Deltoides (principal); ayudan pecho, serrato y triceps. Errores: encoger
   los hombros (trapecio en rojo) y quedarse a medias.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    V = global.V,
    B = global.B,
    E3 = global.E3;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var C = global.P.C;

  /* ---------------- la pose: sentado, de frente ---------------- */
  var CAD = [0, 0.56, -0.02];
  var BANCO = {
    tipo: 'banco',
    p: [0, 0, -0.12],
    largo: 0.5,
    alto: 0.45,
    ancho: 0.42,
    respaldo: {
      ang: 90,
      largo: 1.2,
      ancho: 0.5
    }
  };
  // k 0 mancuernas a la altura de los hombros .. 1 brazos estirados; encoge 0..1 sube los hombros
  function pose(k, encoge) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)),
      sube = encoge || 0;
    var p = {
      cadera: CAD,
      tronco: [-2, 0, 0],
      hombros: {
        sube: sube
      },
      pieI: [-0.27, 0.115, 0.5],
      pieD: [0.27, 0.115, 0.5],
      cabeza: [3, 0, 0]
    };
    [-1, 1].forEach(function (s) {
      var Sy = 1.125 + 0.06 * sube;
      var abajo = [s * 0.5, Sy + 0.04, 0.06],
        arriba = [s * 0.26, Sy + 0.78, 0.04];
      p[s < 0 ? 'manoI' : 'manoD'] = E3.lerp3(abajo, arriba, e);
      p[s < 0 ? 'codoI' : 'codoD'] = [1, -0.4, -0.25];
    });
    return p;
  }
  function reps(T, a, b, n, va) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.14);
  }
  // la figura con su banco; fantasmas = las mancuernas de unos instantes antes
  function cuadro(k, encoge, extra, kEn) {
    var fan = [];
    if (kEn) [0.04, 0.08, 0.12].forEach(function (dt) {
      var k2 = kEn(dt);
      if (Math.abs(k2 - k) > 0.04) fan.push(pose(k2, encoge));
    });
    return Object.assign({
      figuras: [Object.assign({
        quien: 'tor',
        pose: pose(k, encoge),
        pesas: 'prono',
        fantasmas: fan
      }, extra || {})],
      objetos: [BANCO]
    }, {});
  }
  var GEN = {
    az: 18,
    el: 6,
    dist: 6.6,
    y: 1.12
  };
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tu press militar.',
    C: E3.escena({
      tomas: [[0, {
        az: 34,
        el: 8,
        dist: 4.6,
        y: 1.38
      }], [1, {
        az: 20,
        el: 5,
        dist: 6.0,
        y: 1.16
      }]],
      vista: function (T, f) {
        var k = 0.55 * reps(T, f(0), f(1), 3, 0.35);
        var r = cuadro(k, 1, {
          musc: {
            trapecio: 'rojo',
            deltoides: 'rojo'
          },
          cara: {
            boca: 'dientes',
            cejas: 'enojo'
          }
        });
        r.vibra = true;
        return r;
      },
      lienzo: function (T, f, t, pr) {
        return /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: pr('cabeza'),
          v: 1
        });
      },
      mal: [{
        x: 80,
        y: 430,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 850,
        y: 1150,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'PRESS *MILITAR*',
        s: 1.15,
        cuando: 0.02,
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5,
    vo: 'Siéntate con la espalda recta y apoyada, y una mancuerna en cada mano a la altura de los hombros.',
    C: E3.escena({
      tomas: [[0, {
        az: 62,
        el: 6,
        dist: 6.4,
        y: 1.08
      }], [0.5, {
        az: 50,
        el: 6,
        dist: 6.0,
        y: 1.1
      }], [0.56, {
        az: 22,
        el: 8,
        dist: 4.8,
        y: 1.3
      }], [1, {
        az: 12,
        el: 8,
        dist: 5.2,
        y: 1.28
      }]],
      vista: function () {
        return cuadro(0, 0, {
          cara: {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var esp = clamp((T - f(0.12)) / (f(0.4) - f(0.12)), 0, 1);
        var mc = clamp((T - f(0.6)) / (f(0.72) - f(0.6)), 0, 1);
        var a = pr([0, 0.62, -0.26]),
          b = pr([0, 1.3, -0.26]);
        return /*#__PURE__*/React.createElement("g", null, t < 0.53 ? /*#__PURE__*/React.createElement(E3.Guia, {
          a: a,
          b: b,
          p: esp,
          color: C.GRN
        }) : null, t > 0.55 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('manoI'),
          r: 92,
          color: C.YEL,
          p: mc
        }), /*#__PURE__*/React.createElement(B.Anillo, {
          c: pr('manoD'),
          r: 92,
          color: C.YEL,
          p: mc
        })) : null);
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.32
      }, {
        x: 860,
        y: 520,
        cuando: 0.78
      }],
      r1: {
        text: 'ESPALDA *APOYADA*',
        cuando: 0.1
      },
      r2: {
        text: 'A LA ALTURA DEL *HOMBRO*',
        s: 0.92,
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 5.5,
    vo: 'Empuja hasta estirar los brazos sobre la cabeza y baja controlado hasta los hombros.',
    C: E3.escena({
      tomas: [[0, {
        az: 8,
        el: 6,
        dist: 6.4,
        y: 1.18
      }], [1, {
        az: 42,
        el: 9,
        dist: 6.0,
        y: 1.2
      }]],
      vista: function (T, f) {
        var kEn = function (dt) {
          return reps(T - dt, f(0.04), f(0.96), 2);
        };
        var k = kEn(0);
        return cuadro(k, 0, {
          musc: {
            deltoides: true,
            brillo: 0.35 * k
          },
          cara: {
            boca: 'sonrisa'
          }
        }, kEn);
      },
      lienzo: function (T, f, t, pr) {
        var c = E3.medio(pr('manoI'), pr('manoD'));
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: c,
          cuando: f(0.22),
          r: 110
        }), /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: c,
          cuando: f(0.68),
          r: 110
        }));
      },
      encima: function (T, f) {
        return E3.contador(T, f(0.04), f(0.96), 2, 40, 1150);
      },
      zona: [200, 378, 1036, 1452],
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.5
      }],
      r1: {
        text: 'BRAZOS *ESTIRADOS*',
        cuando: 0.08
      },
      r2: {
        text: 'BAJA *CONTROLADO*',
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.5,
    vo: 'Trabaja el deltoides anterior y lateral; ayudan el pecho, el serrato y el tríceps.',
    C: E3.escena({
      tomas: [[0, {
        az: 30,
        el: 10,
        dist: 3.4,
        y: 1.42
      }], [0.6, {
        az: 42,
        el: 10,
        dist: 3.3,
        y: 1.42
      }], [1, {
        az: 24,
        el: 7,
        dist: 5.4,
        y: 1.25
      }]],
      vista: function (T, f) {
        var m = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.18)
        })(T);
        var sec = T > f(0.56);
        return cuadro(0.75, 0, {
          musc: {
            deltoides: m > 0.3 ? true : null,
            pecho: sec ? 'gris' : null,
            triceps: sec ? 'gris' : null,
            brillo: 0.35
          },
          cara: {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var m = clamp((T - f(0.04)) / (f(0.18) - f(0.04)), 0, 1);
        return /*#__PURE__*/React.createElement("g", null, E3.brilla(T, pr, ['m:deltoides:0', 'm:deltoides:1'], m, true, 90));
      },
      r1: {
        text: 'DELTOIDES',
        s: 1.2,
        cuando: 0.04
      },
      r2: {
        text: '+ PECHO Y *TRÍCEPS*',
        cuando: 0.54
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'Error uno: encoger los hombros hacia las orejas. Bájalos y empuja.',
    C: E3.escena({
      tomas: [[0, {
        az: 16,
        el: 8,
        dist: 4.4,
        y: 1.38
      }], [1, {
        az: 26,
        el: 8,
        dist: 4.6,
        y: 1.36
      }]],
      vista: function (T, f) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var k = reps(T, f(0), f(1), 2, 0.4);
        var mal = bien < 0.5;
        return cuadro(k, (1 - bien) * (0.5 + 0.5 * k), {
          musc: mal ? {
            trapecio: 'rojo'
          } : {
            deltoides: true
          },
          cara: mal ? {
            boca: 'dientes',
            cejas: 'enojo'
          } : {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var mal = t < 0.5;
        var a = pr('hombroI'),
          b = pr('hombroD');
        return mal ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.Anillo, {
          c: [a[0] + 10, a[1] - 40],
          r: 64,
          color: C.RED,
          p: 1
        }), /*#__PURE__*/React.createElement(B.Anillo, {
          c: [b[0] - 10, b[1] - 40],
          r: 64,
          color: C.RED,
          p: 1
        })) : /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [[a[0], a[1] - 10], [b[0], b[1] - 10]],
          color: C.GRN,
          sw: 14,
          p: 1
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
        text: 'HOMBROS *ENCOGIDOS*',
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'HOMBROS *ABAJO*',
        s: 1.1,
        cuando: 0.52,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4.5,
    vo: 'Error dos: quedarte a medias. Estira los brazos arriba en cada repetición.',
    C: E3.escena({
      tomas: [[0, {
        az: -16,
        el: 6,
        dist: 6.2,
        y: 1.3
      }], [1, {
        az: -26,
        el: 7,
        dist: 6.0,
        y: 1.32
      }]],
      vista: function (T, f) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var k = reps(T, f(0), f(1), bien < 0.5 ? 3 : 2, 0.4);
        var tope = 0.5 + 0.5 * bien;
        var vt = cuadro(k * tope, 0, {
          musc: bien < 0.5 ? {
            deltoides: 'rojo'
          } : {
            deltoides: true
          },
          cara: {
            boca: bien < 0.5 ? 'recta' : 'sonrisa'
          }
        });
        var arriba = global.TOR3D.esqueleto(pose(1, 0));
        vt.encuadreExtra = [[-0.75, arriba.manoI.y + 0.2, 0, 0.1], [0.75, arriba.manoD.y + 0.2, 0, 0.1]];
        return vt;
      },
      lienzo: function (T, f, t, pr) {
        var arriba = global.TOR3D.esqueleto(pose(1, 0));
        var a = pr([-0.75, arriba.manoI.y + 0.2, 0]),
          b = pr([0.75, arriba.manoD.y + 0.2, 0]);
        return /*#__PURE__*/React.createElement(B.Puntos, {
          pts: [a, b],
          color: t < 0.5 ? C.RED : C.GRN,
          sw: 14,
          p: 1
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
        cuando: 0.62
      }],
      r1: {
        text: 'MEDIA *REPETICIÓN*',
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'ESTIRA *ARRIBA*',
        s: 1.1,
        cuando: 0.52,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 3,
    vo: 'Así se hace: hombros abajo y el recorrido completo.',
    C: E3.escena({
      tomas: [[0, {
        az: -30,
        el: 6,
        dist: 6.0,
        y: 1.2
      }], [1, {
        az: 40,
        el: 8,
        dist: 6.4,
        y: 1.15
      }]],
      vista: function (T, f) {
        var k = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.4),
          ease: Easing.easeInOutSine
        })(T);
        return cuadro(k, 0, {
          musc: {
            deltoides: true,
            brillo: 0.3
          },
          cara: {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        return /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: E3.medio(pr('manoI'), pr('manoD')),
          cuando: f(0.4),
          r: 120
        });
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.42,
        s: 0.85
      }],
      r1: {
        text: 'PRESS MILITAR',
        s: 1.15,
        cuando: 0.06
      },
      r2: {
        text: 'RECORRIDO *COMPLETO*',
        cuando: 0.46,
        tono: 'verde'
      }
    })
  }];
  global.REELS.registrar({
    id: 'press-militar-3d',
    titulo: 'Press militar con mancuernas (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿LO HACÍAS BIEN?',
      vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de gym y guárdalo.'
    }
  });
})(window);
