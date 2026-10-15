/* GENERADO por compilar.js desde carbohidratos.jsx — no editar a mano. */
/* ============================================================
   CARBOHIDRATOS — reel corto de nutricion con Tor (~34 s con el cierre)
   Fuente: libro, seccion de nutricion. Funcion: principal fuente de
   energia; al entrenar se convierten en glucosa, que usan los musculos.
   Fuentes: cereales integrales, frutas, verduras, legumbres y tuberculos.
   Recomendacion para quien entrena con pesas: 4 a 7 g por kg al dia,
   segun la intensidad y la duracion del entrenamiento.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    N = global.N,
    PL = global.PL;
  var animate = global.animate,
    Easing = global.Easing;
  var C = P.C;
  var FIG = PL.FIG;
  var ZONA = [7 * Math.PI / 180, 42 * Math.PI / 180]; // la franja verde del dial

  // cuatro comidas sobre un plato centrado en (540, 1131)
  var EN_PLATO = [['pan', -92, -88], ['arroz', 92, -88], ['banana', -92, 92], ['papa', 92, 92]];
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás comiendo pocos carbohidratos.',
    C: PL.escena({
      tor: {
        boca: 'triste',
        vibra: true,
        y: FIG.y - 30
      },
      piezas: [{
        C: P.Medidor,
        p: function (T) {
          return {
            p: 0.14,
            shake: M.vibra(T, 30, 3)
          };
        },
        s: 1.05,
        x: 382,
        y: 1360,
        cuando: 0.08
      }],
      mal: [{
        x: 740,
        y: 1330,
        cuando: 0.22,
        s: 0.6
      }, {
        x: 70,
        y: 700,
        cuando: 0.42,
        s: 0.5
      }],
      r1: {
        text: 'CARBOHIDRATOS',
        s: 1.2,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Energía',
    dur: 4.5,
    vo: 'Son la principal fuente de energía de tu cuerpo.',
    C: PL.escena({
      piezas: [{
        C: N.COMIDA.pan,
        s: 1.1,
        x: 40,
        y: 380
      }, {
        C: N.COMIDA.arroz,
        s: 1.1,
        x: 408,
        y: 380,
        cuando: 0.06
      }, {
        C: N.COMIDA.banana,
        s: 1.1,
        x: 776,
        y: 380,
        cuando: 0.12
      }, {
        C: P.Medidor,
        s: 2,
        x: 240,
        y: 1000,
        cuando: 0.3,
        p: function (T, f) {
          return {
            p: animate({
              from: 0.1,
              to: 1,
              start: f(0.36),
              end: f(0.72),
              ease: Easing.easeInOutCubic
            })(T)
          };
        }
      }],
      lienzo: function (T, f) {
        return /*#__PURE__*/React.createElement(B.FlechaS, {
          a: [540, 680],
          b: [540, 940],
          color: C.YEL,
          sw: 22,
          p: M.draw(T, f(0.22), 0.4)
        });
      },
      bien: [{
        x: 860,
        y: 1250,
        cuando: 0.74
      }],
      r1: {
        text: 'ENERGÍA PRINCIPAL',
        cuando: 0.08
      }
    })
  }, {
    nombre: 'Glucosa',
    dur: 5.5,
    vo: 'Al entrenar, se convierten en glucosa: el combustible de tus músculos.',
    C: PL.escena({
      camara: {
        zoom: 1.5,
        foco: [72 + 600 * 0.78, 166 + 600 * 0.78],
        mira: [540, 900]
      },
      tor: {
        flex: function (T, f) {
          return 0.86 + 0.14 * Easing.easeOutBack(animate({
            from: 0,
            to: 1,
            start: f(0.55),
            end: f(0.75)
          })(T));
        },
        musc: function (T, f) {
          return {
            bic: animate({
              from: 0,
              to: 1,
              start: f(0.4),
              end: f(0.62)
            })(T)
          };
        },
        boca: function (T, f) {
          return T > f(0.55) ? 'sonrisa' : null;
        },
        extra: function (g, T, f) {
          return PL.alBiceps(g, animate({
            from: 0,
            to: 1,
            start: f(0.12),
            end: f(0.5)
          })(T), 'hex');
        }
      },
      bien: [{
        x: 850,
        y: 430,
        cuando: 0.72
      }],
      r1: {
        text: 'GLUCOSA',
        s: 1.3,
        cuando: 0.08
      },
      r2: {
        text: 'COMBUSTIBLE DEL MÚSCULO',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Fuentes',
    dur: 5,
    vo: 'Están en cereales integrales, frutas, verduras, legumbres y tubérculos.',
    C: PL.escena({
      piezas: PL.grilla([['pan', 0.12], ['arroz', 0.22], ['banana', 0.38], ['brocoli', 0.52], ['legumbres', 0.66], ['papa', 0.8]], {
        y0: 520,
        paso: 330
      }),
      r1: {
        text: 'FUENTES DE CARBOHIDRATOS',
        s: 1
      }
    })
  }, {
    nombre: 'Cuánta',
    dur: 6,
    vo: 'Si entrenas con pesas: de 4 a 7 gramos por kilo al día, según tu entrenamiento.',
    C: PL.escena({
      tor: {
        balanza: true,
        x: FIG.x - 170,
        y: FIG.y + 40
      },
      piezas: [{
        C: N.Dial,
        s: 1.15,
        x: 640,
        y: 560,
        cuando: 0.1,
        p: function (T, f) {
          return {
            zona: ZONA,
            p: animate({
              from: 0,
              to: 0.68,
              start: f(0.2),
              end: f(0.55),
              ease: Easing.easeOutElastic
            })(T) + M.life(T, 1.6, 0.012)
          };
        }
      }],
      bien: [{
        x: 830,
        y: 860,
        cuando: 0.58
      }],
      r1: {
        text: '4 A 7 G POR KILO',
        s: 1.2,
        cuando: 0.12
      },
      r2: {
        text: 'SEGÚN TU ENTRENAMIENTO',
        cuando: 0.62
      }
    })
  }, {
    nombre: 'Ejemplo',
    dur: 5.5,
    vo: 'Si pesas 70 kilos, son entre 280 y 490 gramos al día.',
    C: PL.escena({
      tor: {
        s: 0.42,
        x: 128,
        y: 196,
        balanza: true
      },
      piezas: [{
        C: B.Cuenta,
        s: 1.05,
        x: 640,
        y: 470,
        cuando: 0.1,
        p: function (T, f) {
          var k = Easing.easeOutCubic(animate({
            from: 0,
            to: 1,
            start: f(0.12),
            end: f(0.36)
          })(T));
          return {
            n: Math.round(70 * k),
            p: k
          };
        }
      }, {
        C: N.Plato,
        s: 1.1,
        x: 309,
        y: 900,
        cuando: 0.4,
        fase: 0.5
      }].concat(EN_PLATO.map(function (c, i) {
        return {
          C: N.COMIDA[c[0]],
          s: 0.62,
          x: 540 + c[1] - 74,
          y: 1131 + c[2] - 74,
          cuando: 0.5 + i * 0.07,
          fase: 0.5
        };
      })),
      bien: [{
        x: 830,
        y: 980,
        cuando: 0.82
      }],
      r1: {
        text: 'SI PESAS 70 KG',
        cuando: 0.06
      },
      r2: {
        text: '280 A 490 G AL DÍA',
        y: 1420,
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 2.5,
    vo: 'Carbohidratos: tu gasolina para entrenar.',
    C: PL.escena({
      tor: {
        flex: function (T, f) {
          return 0.55 + 0.45 * Easing.easeOutBack(animate({
            from: 0,
            to: 1,
            start: f(0.04),
            end: f(0.3)
          })(T));
        },
        boca: 'sonrisa',
        musc: {
          bic: 1
        }
      },
      bien: [{
        x: 800,
        y: 820,
        cuando: 0.32,
        s: 0.85
      }],
      r1: {
        text: 'TU GASOLINA',
        cuando: 0.1
      },
      r2: {
        text: 'PARA ENTRENAR',
        cuando: 0.4
      }
    })
  }];
  global.REELS.registrar({
    id: 'carbohidratos',
    titulo: 'Carbohidratos (nutrición)',
    escenas: ESCENAS
  });
})(window);
