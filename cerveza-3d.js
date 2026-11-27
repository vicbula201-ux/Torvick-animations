/* GENERADO por compilar.js desde cerveza-3d.jsx — no editar a mano. */
/* ============================================================
   CERVEZA — TOR EN 3D (mismo guion que cerveza.jsx)
   "Deja de tomar cerveza": Tor borracho en el farol con la jarra y el hipo;
   beber fuerte frena la sintesis de proteina (Parr 2014: 24 % menos);
   duermes peor; calorias vacias (6 cervezas ~ 900 kcal); si te pasas, el
   balde; y la parodia: "¿la ultima?" "¡no, gracias!".
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    N = global.N,
    V = global.V,
    MU = global.MU,
    E3 = global.E3,
    TOR3D = global.TOR3D;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var A = global.REELS.ayudas;
  var C = P.C;
  var BLANCO = '#ffffff';
  function pulso(T, cuando, d) {
    var u = (T - cuando) / d;
    return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
  }
  function aArr(q) {
    return [q.x, q.y, q.z];
  }
  function salpica(c, T, fase) {
    var gotas = [];
    for (var i = 0; i < 4; i++) {
      var u = (T * 0.9 + i * 0.27 + (fase || 0)) % 1;
      var x = c[0] - 30 - 90 * u * (0.6 + 0.3 * i),
        y = c[1] - 60 - 150 * u + 330 * u * u;
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
  function burbujas(c, T, cuando) {
    var u = (T - cuando) / 0.7;
    if (u <= 0 || u >= 1) return null;
    return /*#__PURE__*/React.createElement("g", {
      opacity: 1 - u * u
    }, [0, 1, 2].map(function (i) {
      return /*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: c[0] + 50 + 34 * i + 30 * u,
        cy: c[1] + 10 - 46 * i - 130 * u,
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
  // particulas que vuelan a unos puntos de pantalla (los biceps)
  function alPunto(cs, p) {
    var r = [];
    cs.forEach(function (dest, k) {
      var lado = k ? 1 : -1;
      [[1.2, -260], [1.5, -40], [1.1, 220]].forEach(function (o, j) {
        var u = clamp(p * 1.3 - j * 0.15, 0, 1);
        if (u <= 0 || u >= 1) return;
        var desde = [dest[0] + lado * 200 * o[0], dest[1] + o[1]];
        var e = Easing.easeInCubic(u),
          c = [desde[0] + (dest[0] - desde[0]) * e, desde[1] + (dest[1] - desde[1]) * e];
        r.push(/*#__PURE__*/React.createElement("circle", {
          key: k + '-' + j,
          cx: c[0],
          cy: c[1],
          r: 30 * (1 - 0.4 * u),
          fill: C.YEL,
          stroke: C.INK,
          strokeWidth: 9
        }));
      });
    });
    return /*#__PURE__*/React.createElement("g", null, r);
  }

  /* ---------------- poses ---------------- */
  function depie(extra) {
    return Object.assign({
      cadera: [0, 1.0, 0],
      pieI: [-0.2, 0.115, 0.03],
      pieD: [0.2, 0.115, 0.03]
    }, extra || {});
  }
  var CARA_BORRACHO = function (T, boca) {
    return {
      ojos: 'borracho',
      nariz: 'roja',
      mejillas: true,
      boca: boca || 'ondulada'
    };
  };

  // gancho: colgado del farol, tambaleandose
  var HIPOS = [0.3, 0.68];
  function hipo(T, f) {
    return Math.max(pulso(T, f(HIPOS[0]), 0.2), pulso(T, f(HIPOS[1]), 0.2));
  }
  function poseFarol(T, h) {
    var ladea = -(6 + 3 * Math.sin(T * 2.2) + Math.sin(T * 5.1));
    return depie({
      cadera: [0.06, 1.0 + 0.03 * h, 0],
      tronco: [3, -12, ladea],
      cabeza: [-6, 12 * Math.sin(T * 1.6), 10 * Math.sin(T * 1.3)],
      pieI: [-0.2, 0.115, 0.06],
      pieD: [0.16, 0.115, -0.02],
      manoD: [0.5, 1.52, -0.04],
      codoD: [1, -0.3, 0],
      manoI: [-0.3, 1.2 + 0.04 * Math.sin(T * 2.2 + 1), 0.3],
      codoI: [0.5, -1, 0]
    });
  }
  // la ultima: cruza los brazos, manotazo, festeja
  function poseNo(cruza, manotazo, festeja) {
    if (festeja > 0.01) return E3.poseFlex(festeja, {
      tronco: [0, 0, 0]
    });
    var p = depie({
      cabeza: [0, -8 * cruza, 0]
    });
    var base = {
        I: [-0.34, 0.83, 0.08],
        D: [0.34, 0.83, 0.08]
      },
      X = {
        I: [0.2, 1.44, 0.34],
        D: [-0.2, 1.4, 0.4]
      };
    ['I', 'D'].forEach(function (L) {
      p['mano' + L] = E3.lerp3(base[L], X[L], cruza);
      p['codo' + L] = [0.5, -1, 0.3];
    });
    if (manotazo > 0) {
      p.manoD = E3.lerp3(p.manoD, [0.95, 1.38, 0.45], manotazo);
      p.codoD = [0.4, -1, 0.5];
    }
    return p;
  }

  /* ---------------- escenas ---------------- */
  var JARRAS = [];
  for (var i = 0; i < 6; i++) JARRAS.push([50 + i % 3 * 190, i < 3 ? 360 : 560]);
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.8,
    vo: 'No tomes más cerveza.',
    C: E3.escena({
      tomas: [[0, {
        az: 22,
        el: 10,
        dist: 3.8,
        y: 1.6,
        dx: 0.1
      }], [1, {
        az: 14,
        el: 5,
        dist: 6.6,
        y: 1.3,
        dx: 0.15
      }]],
      vista: function (T, f) {
        var h = hipo(T, f),
          p = poseFarol(T, h),
          J = TOR3D.esqueleto(p);
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            cara: CARA_BORRACHO(T, h > 0.05 ? 'o' : 'ondulada')
          }],
          objetos: [{
            tipo: 'farol',
            p: [0.62, 0, -0.06]
          }, {
            tipo: 'jarra',
            p: aArr(J.manoI.clone().add(TOR3D.v(0.02, 0.06, 0.05))),
            giro: -70,
            ladea: -14 + 9 * Math.sin(T * 2.2)
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
        A.sonido('hipo', f(HIPOS[0]));
        A.sonido('hipo', f(HIPOS[1]));
        var h = pr('cabeza'),
          m = pr('manoI');
        return /*#__PURE__*/React.createElement("g", null, estrellas(T, [[150, 500, 1], [990, 700, 0.8], [960, 960, 0.7], [90, 1100, 0.7]]), salpica(m, T, 0), burbujas(h, T, f(HIPOS[0])), burbujas(h, T, f(HIPOS[1])));
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
        text: '*CERVEZA*',
        s: 1.2,
        cuando: 0.02,
        tono: 'rojo'
      },
      r2: {
        text: '¡HIP!',
        s: 1.15,
        cuando: 0.3
      }
    })
  }, {
    nombre: 'Músculo',
    dur: 5.2,
    vo: 'Beber fuerte después de entrenar frena la construcción muscular, un 24 % menos según un estudio.',
    C: E3.escena({
      escenario: 'gym',
      tomas: [[0, {
        az: 12,
        el: 6,
        dist: 6.4,
        y: 1.25
      }], [0.5, {
        az: 24,
        el: 6,
        dist: 5.8,
        y: 1.32
      }], [1, {
        az: 8,
        el: 4,
        dist: 6.8,
        y: 1.15
      }]],
      vista: function (T, f) {
        var gris = animate({
          from: 0,
          to: 1,
          start: f(0.46),
          end: f(0.62)
        })(T);
        var fl = 1 - 0.4 * animate({
          from: 0,
          to: 1,
          start: f(0.5),
          end: f(0.78),
          ease: Easing.easeInOutCubic
        })(T);
        return {
          figuras: [{
            quien: 'tor',
            pose: E3.poseFlex(fl),
            musc: {
              biceps: gris > 0.5 ? 'gris' : true,
              brillo: 0.3 * (1 - gris)
            },
            cara: {
              boca: T < f(0.46) ? 'sonrisa' : 'triste',
              cejas: T < f(0.46) ? null : 'triste'
            }
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
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
        var cs = [pr('m:biceps:0'), pr('m:biceps:1')];
        return /*#__PURE__*/React.createElement("g", null, p > 0.01 && p < 0.99 ? alPunto(cs, p) : null, E3.brilla(T, pr, ['m:biceps:0', 'm:biceps:1'], v, false, 80));
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
        text: 'FRENA TU *MÚSCULO*',
        s: 1.05,
        cuando: 0.04
      },
      r2: {
        text: '*24 %* MENOS SÍNTESIS',
        s: 1.0,
        cuando: 0.58,
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'Sueño',
    dur: 4.8,
    vo: 'La cerveza te duerme rápido y arruina la calidad de tu sueño. Amaneciendo cansado y sin estar recuperado totalmente.',
    C: E3.escena({
      escenario: {
        'tipo': 'casa',
        'noche': true
      },
      tomas: [[0, {
        az: 12,
        el: 14,
        dist: 6.6,
        y: 1.05,
        dz: -0.35
      }], [1, {
        az: 24,
        el: 16,
        dist: 6.0,
        y: 1.05,
        dz: -0.4
      }]],
      vista: function (T, f) {
        A.sonido('campana', f(0.74));
        return {
          figuras: [{
            quien: 'tor',
            pose: {
              cadera: [0, 0.74, -0.45],
              tronco: [-36, 0, 4 * Math.sin(T * 1.5)],
              cabeza: [6, 8 * Math.sin(T * 1.3), 0],
              pieI: [-0.16, 0.7, 0.62],
              pieD: [0.16, 0.7, 0.62],
              rodillaI: [0.1, 0, 1],
              rodillaD: [0.1, 0, 1],
              manoI: [-0.36, 0.86, 0.18],
              manoD: [0.36, 0.86, 0.18],
              codoI: [1, 0, 0],
              codoD: [1, 0, 0]
            },
            cara: {
              ojos: 'espiral',
              boca: 'ondulada',
              mejillas: true
            }
          }],
          objetos: [{
            tipo: 'cama',
            p: [0, 0, 0.15],
            manta: 0.62,
            mantaY: 0.78
          }]
        };
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
        text: 'DUERMES, PERO *MAL*',
        s: 1.0,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: 'AMANECES SIN *RECUPERAR*',
        s: 0.92,
        cuando: 0.58
      }
    })
  }, {
    nombre: 'Calorías',
    dur: 4.8,
    vo: 'Las cervezas te aportan solo calorías vacías. Seis cervezas suman unas 900 calorías vacías. Lo equivalente a una hamburguesa con papas.',
    C: E3.escena({
      tomas: [[0, {
        az: 16,
        el: 6,
        dist: 8.2,
        y: 1.55,
        dx: 0
      }], [1, {
        az: 26,
        el: 6,
        dist: 7.8,
        y: 1.5,
        dx: 0
      }]],
      vista: function (T, f) {
        var pz = animate({
          from: 0,
          to: 1,
          start: f(0.08),
          end: f(0.56)
        })(T) + 0.06 * pulso(T, f(0.84), 0.4);
        var p = depie({
          cadera: [0, 1.0, 0],
          tronco: [-4, 0, 3 * Math.sin(T * 1.7)],
          cabeza: [0, 10 * Math.sin(T * 1.2), 0],
          panza: pz
        });
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            cara: CARA_BORRACHO(T, pulso(T, f(0.84), 0.5) > 0.05 ? 'abierta' : 'ondulada')
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
        A.sonido('eructo', f(0.84));
        var u = (T - f(0.84)) / 0.9,
          h = pr('cabeza');
        var e = M.pop(T, f(0.52), 0.4);
        return /*#__PURE__*/React.createElement("g", null, u > 0 && u < 1 ? /*#__PURE__*/React.createElement(V.Humo, {
          T: T * 2,
          c: [h[0] + 30, h[1] + 30],
          v: 1 - u,
          alto: 170,
          viento: 90
        }) : null, e.opacity > 0.02 ? /*#__PURE__*/React.createElement("g", {
          opacity: e.opacity,
          transform: 'translate(690 560) scale(' + e.scale.toFixed(3) + ')'
        }, /*#__PURE__*/React.createElement("path", {
          d: "M -36 -18 L 36 -18 M -36 18 L 36 18",
          stroke: C.INK,
          strokeWidth: 18,
          strokeLinecap: "round"
        })) : null);
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
      r1: {
        text: 'CALORÍAS *VACÍAS*',
        s: 1.1,
        cuando: 0.04
      },
      r2: {
        text: '6 CERVEZAS = *900 KCAL*',
        s: 0.95,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Si te pasas',
    dur: 3.6,
    vo: '¿Y qué pasa si te pasas de cervezas? Pues ya sabes cómo va a terminar la noche. Muy mal, vomitando.',
    C: E3.escena({
      tomas: [[0, {
        az: 30,
        el: 10,
        dist: 3.8,
        y: 1.3
      }], [0.4, {
        az: 40,
        el: 10,
        dist: 4.6,
        y: 1.15
      }], [1, {
        az: 46,
        el: 8,
        dist: 5.8,
        y: 1.05
      }]],
      golpes: [0.44, 0.7],
      vista: function (T, f) {
        var verde = animate({
          from: 0,
          to: 1,
          start: f(0.04),
          end: f(0.32)
        })(T);
        var u = 0;
        [0.44, 0.7].forEach(function (c) {
          var d = (T - f(c)) / (0.2 * (f(1) - f(0)));
          if (d > 0 && d < 1) u = d;
        });
        var conArcada = verde > 0.6 && u === 0 && T < f(0.44);
        var baja = u > 0 ? Math.sin(Math.PI * Math.min(1, u * 1.6)) : 0;
        var p = depie({
          tronco: [26 + 14 * baja, 0, 0],
          cabeza: [-6 - 8 * baja, 0, 0],
          cadera: [0, 0.98, -0.06],
          manoI: [-0.24, 0.9, 0.34],
          manoD: [0.24, 0.9, 0.34],
          codoI: [1, -0.3, 0],
          codoD: [1, -0.3, 0]
        });
        var nivel = clamp((T - f(0.44)) / (f(0.9) - f(0.44)), 0, 1);
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            cara: {
              ojos: u > 0 ? 'llanto' : conArcada ? 'grandes' : 'borracho',
              boca: u > 0 ? 'abierta' : conArcada ? 'o' : 'ondulada',
              cejas: 'triste',
              color: {
                c: 'verde',
                v: 0.55 * verde
              },
              mejillas: verde < 0.5
            }
          }],
          objetos: [{
            tipo: 'balde',
            p: [0, 0.68, 0.4],
            nivel: nivel
          }],
          vibra: verde > 0.3 && u === 0,
          u: u,
          verde: verde
        };
      },
      lienzo: function (T, f, t, pr, info) {
        A.sonido('vomito', f(0.44));
        A.sonido('vomito', f(0.7));
        var u = info.u,
          h = pr('cabeza');
        var b = pr([0, 1.02, 0.4]);
        var boca = [h[0] + 14, h[1] + 36];
        var y0 = u > 0.72 ? boca[1] + (b[1] - boca[1]) * (u - 0.72) / 0.28 : boca[1];
        var y1 = u > 0 ? boca[1] + (b[1] + 4 - boca[1]) * clamp(u / 0.22, 0, 1) : boca[1];
        var x0 = boca[0],
          x1 = boca[0] + (b[0] - boca[0]) * clamp(u / 0.22, 0, 1);
        var mece = 10 * Math.sin(T * 40);
        var d = 'M ' + x0 + ' ' + y0.toFixed(1) + ' Q ' + ((x0 + x1) / 2 + mece).toFixed(1) + ' ' + ((y0 + y1) / 2).toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1);
        var gotas = [];
        if (u > 0.2) {
          for (var i = 0; i < 6; i++) {
            var w = (u * 2.2 + i * 0.17) % 1,
              l = i % 2 ? 1 : -1;
            gotas.push(/*#__PURE__*/React.createElement("circle", {
              key: i,
              cx: b[0] + l * (60 + 150 * w),
              cy: b[1] - 20 - 170 * w + 300 * w * w,
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
          strokeWidth: 46,
          strokeLinecap: "round"
        }), /*#__PURE__*/React.createElement("path", {
          d: d,
          fill: "none",
          stroke: C.YEL,
          strokeWidth: 30,
          strokeLinecap: "round"
        })) : null, gotas, /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: h,
          v: info.verde
        }));
      },
      r1: {
        text: '¿UNA *MÁS*?',
        s: 1.2,
        cuando: null,
        tono: 'rojo'
      },
      r2: {
        text: 'MALA *IDEA*',
        s: 1.1,
        cuando: 0.5,
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'La última',
    dur: 5,
    vo: 'Y cuando tus amigos te ofrezcan la última cerveza, di no gracias. Tu cuerpo te lo va a agradecer.',
    C: E3.escena({
      tomas: [[0, {
        az: -14,
        el: 6,
        dist: 6.4,
        y: 1.25,
        dx: 0.25
      }], [0.4, {
        az: -6,
        el: 6,
        dist: 6.6,
        y: 1.25,
        dx: 0.2
      }], [1, {
        az: -10,
        el: 5,
        dist: 6.2,
        y: 1.2,
        dx: 0.05
      }]],
      golpes: [0.41],
      vista: function (T, f) {
        var entra = Easing.easeOutCubic(clamp((T - f(0.02)) / (f(0.2) - f(0.02)), 0, 1));
        var sale = Easing.easeInCubic(clamp((T - f(0.44)) / (f(0.58) - f(0.44)), 0, 1));
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
        var mano = [1.7 - 1.0 * entra + 1.2 * sale, 1.32 - 0.1 * sale, 0.42];
        var vuela = clamp((T - f(0.41)) / (f(0.6) - f(0.41)), 0, 1);
        var jp = [mano[0] - 0.02, mano[1] + 0.08, mano[2]],
          ladea = -6 + 4 * Math.sin(T * 5);
        if (vuela > 0) {
          jp = [mano[0] + 2.2 * Easing.easeOutQuad(vuela), mano[1] + 0.08 + 1.0 * Math.sin(Math.PI * vuela * 0.85), mano[2]];
          ladea = -520 * vuela;
        }
        var serio = cruza > 0.3 && festeja < 0.3;
        var obj = [];
        if (sale < 1) obj.push({
          tipo: 'brazo',
          a: [mano[0] + 1.4, mano[1] - 0.25, mano[2] - 0.1],
          b: mano
        });
        if (vuela < 1) obj.push({
          tipo: 'jarra',
          p: jp,
          giro: -90,
          ladea: ladea
        });
        A.sonido('whoosh', f(0.39));
        A.sonido('golpe', f(0.41));
        return {
          figuras: [{
            quien: 'tor',
            pose: poseNo(cruza, manotazo, festeja),
            musc: {
              biceps: festeja > 0.3 ? true : null,
              brillo: 0.3
            },
            cara: {
              boca: festeja > 0.3 ? 'sonrisa' : serio ? 'triste' : 'sonrisa',
              cejas: serio ? 'enojo' : null
            }
          }],
          objetos: obj,
          vibra: serio && manotazo < 0.1,
          vuela: vuela,
          mano: mano,
          jp: jp
        };
      },
      lienzo: function (T, f, t, pr, info) {
        var e2 = M.pop(T, f(0.66), 0.42);
        var j = pr(info.jp),
          m = pr(info.mano);
        return /*#__PURE__*/React.createElement("g", null, info.vuela > 0 && info.vuela < 1 ? salpica([j[0] - 40, j[1] + 60], T * 3, 0) : null, /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: [m[0] - 120, m[1] - 30],
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
          c: pr('cabeza'),
          cuando: f(0.74),
          r: 160
        }));
      },
      bien: [{
        x: 860,
        y: 560,
        cuando: 0.72,
        s: 0.85
      }],
      r1: {
        text: '¿LA *ÚLTIMA*?',
        s: 1.2,
        cuando: null
      },
      r2: {
        text: '¡NO, *GRACIAS*!',
        s: 1.1,
        cuando: 0.3,
        tono: 'verde'
      }
    })
  }];
  global.REELS.registrar({
    id: 'cerveza-3d',
    escenario: {
      'tipo': 'calle',
      'noche': true
    },
    titulo: 'Deja de tomar cerveza (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿A QUIÉN SE LO MANDAS?',
      vo: 'Mándaselo a aquel amigo borracho que siempre dice una más y nos vamos.'
    }
  });
})(window);
