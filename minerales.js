/* GENERADO por compilar.js desde minerales.jsx — no editar a mano. */
/* ============================================================
   MINERALES — reel corto de nutricion con Tor (~32 s con el cierre)
   Fuente: libro, seccion de nutricion. Funcion: contraccion muscular,
   equilibrio de liquidos y produccion de energia. Ejemplos: calcio
   (huesos y contraccion), hierro (oxigeno en la sangre) y magnesio
   (energia y funcionamiento muscular). Fuentes: carnes, pescados,
   frutas, verduras, lacteos y cereales.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    N = global.N,
    PL = global.PL;
  var animate = global.animate,
    Easing = global.Easing;
  var FIG = PL.FIG;
  function flexEntre(a, b) {
    return function (T, f) {
      return 0.15 + 0.85 * Easing.easeOutBack(animate({
        from: 0,
        to: 1,
        start: f(a),
        end: f(b)
      })(T));
    };
  }
  function bicEntre(a, b) {
    return function (T, f) {
      return {
        bic: animate({
          from: 0,
          to: 1,
          start: f(a),
          end: f(b)
        })(T)
      };
    };
  }
  function late(T) {
    return {
      beat: 1 + 0.08 * Math.max(0, Math.sin(T * Math.PI * 2 / 0.9))
    };
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Estás olvidando los minerales.',
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
        text: 'MINERALES',
        s: 1.3,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Para qué',
    dur: 5.5,
    vo: 'Tu cuerpo los necesita para contraer el músculo, equilibrar líquidos y producir energía.',
    C: PL.escena({
      tor: {
        s: 0.5,
        x: 240,
        y: 230,
        flex: flexEntre(0.18, 0.34),
        musc: bicEntre(0.2, 0.34),
        boca: 'sonrisa'
      },
      piezas: [{
        C: N.ICONOS.gota,
        s: 1.25,
        x: 110,
        y: 1030,
        cuando: 0.45
      }, {
        C: P.Bombillo,
        s: 1.3,
        x: 650,
        y: 1000,
        cuando: 0.62,
        p: function (T, f) {
          return {
            on: animate({
              from: 0,
              to: 1,
              start: f(0.66),
              end: f(0.8)
            })(T)
          };
        }
      }],
      r1: {
        text: 'CONTRAER EL MÚSCULO',
        cuando: 0.14
      },
      r2: {
        text: 'LÍQUIDOS Y ENERGÍA',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Calcio',
    dur: 4.5,
    vo: 'El calcio es clave para tus huesos y para contraer el músculo.',
    C: PL.escena({
      tor: {
        s: 0.32,
        x: 348,
        y: 856,
        cuando: 0.48,
        flex: flexEntre(0.55, 0.7),
        musc: bicEntre(0.58, 0.7),
        boca: 'sonrisa'
      },
      piezas: [{
        C: N.ICONOS.hueso,
        s: 1.7,
        x: 40,
        y: 400
      }, {
        C: N.COMIDA.leche,
        s: 1.5,
        x: 620,
        y: 420,
        cuando: 0.12
      }],
      r1: {
        text: 'CALCIO',
        s: 1.3,
        cuando: 0.04
      },
      r2: {
        text: 'HUESOS Y MÚSCULO',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Hierro',
    dur: 4,
    vo: 'El hierro lleva el oxígeno por tu sangre.',
    C: PL.escena({
      piezas: [{
        C: P.Corazon,
        s: 2.6,
        x: 397,
        y: 380,
        quieto: true,
        p: late
      }],
      lienzo: function (T, f) {
        return PL.sangre(T, f, {
          y: 1030,
          alto: 400,
          n: 4,
          o2: 3
        });
      },
      r1: {
        text: 'HIERRO',
        s: 1.3,
        cuando: 0.06
      },
      r2: {
        text: 'OXÍGENO EN LA SANGRE',
        cuando: 0.45
      }
    })
  }, {
    nombre: 'Magnesio',
    dur: 4.5,
    vo: 'El magnesio te da energía y ayuda a que tu músculo funcione bien.',
    C: PL.escena({
      tor: {
        s: 0.6,
        x: 180,
        y: 404,
        flex: flexEntre(0.5, 0.66),
        musc: bicEntre(0.52, 0.66),
        boca: 'sonrisa'
      },
      piezas: [{
        C: P.Bombillo,
        s: 0.9,
        x: 450,
        y: 370,
        cuando: 0.12,
        p: function (T, f) {
          return {
            on: animate({
              from: 0,
              to: 1,
              start: f(0.18),
              end: f(0.32)
            })(T)
          };
        }
      }],
      r1: {
        text: 'MAGNESIO',
        s: 1.3,
        cuando: 0.04
      },
      r2: {
        text: 'ENERGÍA Y MÚSCULO',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Fuentes',
    dur: 5.5,
    vo: 'Los encuentras en carnes, pescados, frutas, verduras, lácteos y cereales.',
    C: PL.escena({
      piezas: PL.grilla([['carne', 0.14], ['pescado', 0.27], ['manzana', 0.4], ['brocoli', 0.53], ['leche', 0.67], ['pan', 0.81]], {
        y0: 520,
        paso: 330
      }),
      r1: {
        text: 'FUENTES DE MINERALES'
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 2.5,
    vo: 'Come variado y los cubres todos.',
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
        text: 'COME VARIADO',
        cuando: 0.1
      },
      r2: {
        text: 'Y LOS CUBRES TODOS',
        cuando: 0.4
      }
    })
  }];
  global.REELS.registrar({
    id: 'minerales',
    titulo: 'Minerales (nutrición)',
    escenas: ESCENAS
  });
})(window);
