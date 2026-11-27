/* GENERADO por compilar.js desde plancha-3d.jsx — no editar a mano. */
/* ============================================================
   PLANCHA — TOR EN 3D (mismo guion que plancha.jsx)
   Boca abajo, apoyado en los antebrazos con los codos debajo de los
   hombros y los pies juntos en puntas; levantar el cuerpo en una linea
   recta de la cabeza a los talones, con el abdomen contraido todo el
   tiempo. Recto del abdomen, oblicuos y transverso. Errores: la cadera
   fuera de linea (caida o muy alta) y soltar el abdomen.
   La accion y el cierre dicen lo que graba Victor: "¿Quieres ver mas
   videos similares?" y "Sigueme para mas contenido".
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    V = global.V,
    B = global.B,
    E3 = global.E3,
    TOR3D = global.TOR3D;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var C = global.P.C;

  /* ---------------- la plancha sobre los antebrazos ---------------- */
  // tobillos (en puntas) atras, hombros encima de los codos; la cabeza hacia +z
  var ZA = -0.98,
    YA = 0.17,
    YS = 0.5,
    LH = 0.9,
    LS = 1.465;
  var ZS = ZA + Math.sqrt(LS * LS - (YS - YA) * (YS - YA));
  var U = [0, (YS - YA) / LS, (ZS - ZA) / LS],
    NRM = [0, -U[2], U[1]]; // NRM: hacia el piso
  // sube 0 acostado (la cadera en el piso) .. 1 en plancha; cad + la cadera se cae, - se eleva
  function pose(sube, cad) {
    var e = Easing.easeInOutSine(clamp(sube == null ? 1 : sube, 0, 1));
    var k = 0.2 * (1 - e) + 0.15 * (cad || 0);
    var cadera = [0, YA + U[1] * LH + NRM[1] * k, ZA + U[2] * LH + NRM[2] * k];
    var cuello = [0, YA + U[1] * (LH + 0.665), ZA + U[2] * (LH + 0.665)];
    var inclina = Math.atan2(cuello[2] - cadera[2], cuello[1] - cadera[1]) * 180 / Math.PI;
    return {
      cadera: cadera,
      tronco: [inclina, 0, 0],
      cabeza: [16, 0, 0],
      pieI: [-0.09, YA, ZA],
      pieD: [0.09, YA, ZA],
      pies: [70, 70],
      rodillaI: [0.05, 0, 1],
      rodillaD: [0.05, 0, 1],
      manoI: [-0.12, 0.065, ZS + 0.37],
      manoD: [0.12, 0.065, ZS + 0.37],
      codoI: [0.25, -1, 1],
      codoD: [0.25, -1, 1],
      _libre: true
    };
  }
  var COLCH = {
    tipo: 'colchoneta',
    p: [0, 0, -0.25],
    ancho: 1.0,
    largo: 2.6
  };
  function cuadro(sube, cad, extra) {
    return {
      figuras: [Object.assign({
        quien: 'tor',
        pose: pose(sube, cad)
      }, extra || {})],
      objetos: [COLCH]
    };
  }
  // la linea del cuerpo: talon, cadera, cuello y cabeza
  function linea(pr, color, p) {
    var pts = [pr([0, YA + 0.05, ZA - 0.05]), pr('cadera'), pr('cuello'), pr('cabeza')];
    return /*#__PURE__*/React.createElement(B.Puntos, {
      pts: pts,
      color: color,
      sw: 16,
      p: p == null ? 1 : p
    });
  }
  function centroAbdomen(pr) {
    return pr('m:abdomen');
  }
  // la cadera que sube y baja (error 1)
  function caderaMal(T, f) {
    return 1.1 * Math.sin((T - f(0)) * Math.PI * 2 / 1.6);
  }
  var LADO = {
    az: 64,
    el: 12,
    dist: 6.4,
    y: 0.4,
    dz: -0.2
  };
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás haciendo mal tu plancha.',
    C: E3.escena({
      tomas: [[0, {
        az: 48,
        el: 10,
        dist: 5.0,
        y: 0.42,
        dz: -0.1
      }], [1, {
        az: 62,
        el: 12,
        dist: 6.2,
        y: 0.4,
        dz: -0.2
      }]],
      vista: function (T, f) {
        var r = cuadro(1, 1.15, {
          musc: {
            lumbar: 'rojo',
            abdomen: 'gris'
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
        return /*#__PURE__*/React.createElement("g", null, linea(pr, C.RED), /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: pr('cabeza'),
          v: 1
        }));
      },
      mal: [{
        x: 820,
        y: 560,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 120,
        y: 1180,
        cuando: 0.42,
        s: 0.5
      }],
      r1: {
        text: '*PLANCHA*',
        s: 1.3,
        cuando: 0.02,
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'Posición',
    dur: 5.5,
    vo: 'Apoya tus antebrazos en el suelo con los codos justo debajo de los hombros y tus pies manténlos juntos.',
    C: E3.escena({
      tomas: [[0, LADO], [0.16, {
        az: 80,
        el: 8,
        dist: 3.2,
        y: 0.32,
        dz: 0.35
      }], [0.46, {
        az: 84,
        el: 8,
        dist: 3.2,
        y: 0.32,
        dz: 0.35
      }], [0.6, {
        az: 120,
        el: 14,
        dist: 3.4,
        y: 0.28,
        dz: -0.8
      }], [0.86, {
        az: 128,
        el: 14,
        dist: 3.4,
        y: 0.28,
        dz: -0.8
      }], [1, LADO]],
      vista: function () {
        return cuadro(1, 0, {
          cara: {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var aro = clamp((T - f(0.16)) / (f(0.28) - f(0.16)), 0, 1);
        var guia = clamp((T - f(0.22)) / (f(0.4) - f(0.22)), 0, 1);
        var pies = clamp((T - f(0.6)) / (f(0.72) - f(0.6)), 0, 1);
        var h = pr('hombroD'),
          c = pr('codoD');
        return /*#__PURE__*/React.createElement("g", null, t < 0.55 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(E3.Guia, {
          a: [h[0], h[1] - 60],
          b: c,
          p: guia,
          color: C.GRN
        }), /*#__PURE__*/React.createElement(B.Anillo, {
          c: c,
          r: 54,
          color: C.YEL,
          p: aro
        })) : null, t > 0.56 ? /*#__PURE__*/React.createElement(B.Anillo, {
          c: E3.medio(pr('tobilloI'), pr('tobilloD')),
          r: 66,
          color: C.YEL,
          p: pies
        }) : null);
      },
      bien: [{
        x: 840,
        y: 560,
        cuando: 0.34
      }, {
        x: 840,
        y: 560,
        cuando: 0.74
      }],
      r1: {
        text: 'CODOS BAJO *HOMBROS*',
        cuando: 0.12
      },
      r2: {
        text: 'PIES *JUNTOS*',
        s: 1.1,
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Línea',
    dur: 5,
    vo: 'Levanta el cuerpo y forma una línea recta de la cabeza a los talones.',
    C: E3.escena({
      tomas: [[0, {
        az: 80,
        el: 10,
        dist: 5.6,
        y: 0.35,
        dz: -0.2
      }], [0.4, {
        az: 86,
        el: 8,
        dist: 6.2,
        y: 0.38,
        dz: -0.2
      }], [1, {
        az: 74,
        el: 10,
        dist: 6.4,
        y: 0.4,
        dz: -0.2
      }]],
      vista: function (T, f) {
        var sube = animate({
          from: 0,
          to: 1,
          start: f(0.06),
          end: f(0.36),
          ease: Easing.easeInOutCubic
        })(T);
        return cuadro(sube, 0, {
          musc: {
            abdomen: sube > 0.5 ? true : null,
            brillo: 0.3 * sube
          },
          cara: {
            boca: sube > 0.5 ? 'sonrisa' : 'recta'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var lin = clamp((T - f(0.44)) / (f(0.62) - f(0.44)), 0, 1);
        return /*#__PURE__*/React.createElement("g", null, lin > 0.02 ? linea(pr, C.GRN, lin) : null, /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('cadera'),
          cuando: f(0.36),
          r: 90
        }));
      },
      bien: [{
        x: 840,
        y: 620,
        cuando: 0.68
      }],
      r1: {
        text: 'LÍNEA *RECTA*',
        s: 1.2,
        cuando: 0.1
      },
      r2: {
        text: 'DE CABEZA A *TALONES*',
        cuando: 0.48
      }
    })
  }, {
    nombre: 'Core',
    dur: 4.5,
    vo: 'Aprieta el abdomen y aguanta todo lo que puedas. El músculo principal involucrado es el recto, con ayuda de los oblicuos y el transverso.',
    C: E3.escena({
      tomas: [[0, {
        az: 70,
        el: 3,
        dist: 3.4,
        y: 0.32,
        dz: -0.1
      }], [0.55, {
        az: 58,
        el: 3,
        dist: 3.4,
        y: 0.32,
        dz: -0.1
      }], [1, {
        az: 50,
        el: 6,
        dist: 4.4,
        y: 0.34,
        dz: -0.15
      }]],
      vista: function (T, f) {
        var abd = T > f(0.06),
          obl = T > f(0.5);
        return cuadro(1, 0, {
          musc: {
            abdomen: abd ? true : null,
            oblicuos: obl ? true : null,
            brillo: 0.35
          },
          cara: {
            boca: 'dientes'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var m = clamp((T - f(0.06)) / (f(0.2) - f(0.06)), 0, 1);
        return E3.brilla(T, pr, ['m:abdomen'], m, true, 95);
      },
      encima: function (T, f) {
        var A = global.REELS.ayudas;
        var k = clamp((T - f(0.2)) / (f(0.95) - f(0.2)), 0, 0.999);
        return /*#__PURE__*/React.createElement(A.Pos, {
          x: 441,
          y: 1150,
          e: M.pop(T, f(0.18), 0.42),
          dy: M.life(T, 3, 5)
        }, /*#__PURE__*/React.createElement(B.Cuenta, {
          s: 0.9,
          n: 3 - Math.floor(k * 3),
          p: 1 - k * 3 % 1
        }));
      },
      zona: [44, 378, 1036, 1120],
      r1: {
        text: 'APRIETA EL *ABDOMEN*',
        cuando: 0.06
      },
      r2: {
        text: '+ OBLICUOS Y *TRANSVERSO*',
        s: 0.95,
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Error 1',
    dur: 4.5,
    vo: 'No dejes caer tu cadera o la subas mucho. Siempre mantén tus hombros, cadera y tobillos alineados durante el ejercicio.',
    C: E3.escena({
      tomas: [[0, {
        az: 84,
        el: 8,
        dist: 6.0,
        y: 0.38,
        dz: -0.2
      }], [1, {
        az: 76,
        el: 10,
        dist: 6.2,
        y: 0.4,
        dz: -0.2
      }]],
      vista: function (T, f) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.44),
          end: f(0.56),
          ease: Easing.easeInOutCubic
        })(T);
        var cad = (1 - bien) * caderaMal(T, f);
        var mal = bien < 0.5;
        return cuadro(1, cad, {
          musc: mal ? {
            lumbar: cad > 0 ? 'rojo' : null,
            abdomen: 'gris'
          } : {
            abdomen: true,
            brillo: 0.25
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
        return linea(pr, t < 0.5 ? C.RED : C.GRN);
      },
      mal: [{
        x: 830,
        y: 560,
        cuando: 0.14,
        s: 0.55,
        hasta: 0.46
      }],
      bien: [{
        x: 830,
        y: 560,
        cuando: 0.62
      }],
      r1: {
        text: 'CADERA FUERA DE *LÍNEA*',
        s: 0.95,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'TODO *ALINEADO*',
        s: 1.1,
        cuando: 0.52,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'Error 2',
    dur: 4,
    vo: 'No dejes de apretar el abdomen. Siempre mantén la tensión todo el tiempo.',
    C: E3.escena({
      tomas: [[0, {
        az: 60,
        el: 4,
        dist: 5.0,
        y: 0.34,
        dz: -0.15
      }], [1, {
        az: 68,
        el: 8,
        dist: 5.4,
        y: 0.36,
        dz: -0.15
      }]],
      vista: function (T, f) {
        var bien = animate({
          from: 0,
          to: 1,
          start: f(0.46),
          end: f(0.58),
          ease: Easing.easeInOutCubic
        })(T);
        var cae = (0.15 + 0.85 * clamp((T - f(0)) / (f(0.44) - f(0)), 0, 1)) * (1 - bien);
        var mal = bien < 0.5;
        return cuadro(1, cae, {
          musc: mal ? {
            abdomen: 'gris'
          } : {
            abdomen: true,
            oblicuos: true,
            brillo: 0.35
          },
          cara: mal ? {
            ojos: 'grandes',
            boca: 'ondulada',
            cejas: 'triste'
          } : {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        var mal = t < 0.5;
        return mal ? /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: pr('cabeza'),
          v: 1
        }) : E3.brilla(T, pr, ['m:abdomen'], 1, true, 85);
      },
      mal: [{
        x: 830,
        y: 560,
        cuando: 0.16,
        s: 0.55,
        hasta: 0.48
      }],
      bien: [{
        x: 830,
        y: 560,
        cuando: 0.64
      }],
      r1: {
        text: 'ABDOMEN *SUELTO*',
        s: 1.1,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'SIEMPRE EN *TENSIÓN*',
        cuando: 0.52,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 2.5,
    vo: 'Así se hacen las planchas.',
    C: E3.escena({
      tomas: [[0, {
        az: 40,
        el: 14,
        dist: 5.6,
        y: 0.42,
        dz: -0.15
      }], [1, {
        az: 96,
        el: 10,
        dist: 6.2,
        y: 0.4,
        dz: -0.2
      }]],
      golpes: [0.3],
      vista: function () {
        return cuadro(1, 0, {
          musc: {
            abdomen: true,
            oblicuos: true,
            brillo: 0.3
          },
          cara: {
            boca: 'sonrisa'
          }
        });
      },
      lienzo: function (T, f, t, pr) {
        return /*#__PURE__*/React.createElement("g", null, linea(pr, C.GRN), /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr('cadera'),
          cuando: f(0.3),
          r: 100
        }));
      },
      bien: [{
        x: 840,
        y: 600,
        cuando: 0.3,
        s: 0.85
      }],
      r1: {
        text: 'PLANCHA',
        s: 1.3,
        cuando: 0.06
      },
      r2: {
        text: 'CALIDAD > *TIEMPO*',
        cuando: 0.4,
        tono: 'verde'
      }
    })
  }];
  global.REELS.registrar({
    id: 'plancha-3d',
    escenario: 'parque',
    titulo: 'Plancha (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.2,
      pregunta: '¿QUIERES VER MÁS?',
      vo: '¿Quieres ver más videos similares?'
    },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
