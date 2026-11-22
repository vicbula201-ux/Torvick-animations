/* GENERADO por compilar.js desde remo-mancuernas-3d.jsx — no editar a mano. */
/* ============================================================
   REMO CON MANCUERNAS (bilateral, inclinado, agarre neutro) — TOR EN 3D
   Primer reel con TOR3D (tor3d.jsx): el mismo Tor con volumen, contorno
   negro y sombreado de dos tonos; la camara gira alrededor de el.
   Encima van los rotulos, las X, los vistos, el contador, el sello y el
   cierre de siempre (estilo 2).
   Ficha del libro (p. 62): torso inclinado con la columna neutra y las
   rodillas un poco flexionadas; tirar hacia el abdomen con los codos cerca;
   bajar controlado. Errores: curvar la columna, no mover las escapulas.
   Musculos: dorsal ancho (principal), romboides y trapecio medio.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    V = global.V,
    B = global.B,
    TOR3D = global.TOR3D,
    E3 = global.E3;
  var Easing = global.Easing,
    clamp = global.clamp;
  var A = global.REELS.ayudas;
  var C = global.P.C;

  /* ---------------- ayudas ---------------- */
  // repeticion: tira rapido, aguanta arriba y baja lento
  function rep(T, a, b, n) {
    return V.ida(V.fase(T, a, b, n), 0.36, 0.14);
  }
  // la camara: tomas + deriva de camara en mano
  function camara(tomas, t, T) {
    var c = Object.assign({}, TOR3D.tomaEn(tomas, t));
    c.az = (c.az || 0) + Math.sin(T * 0.7) * 1.4;
    c.el = (c.el || 0) + Math.sin(T * 0.9 + 1) * 0.7;
    c.dist = (c.dist || 7) * 0.92 * (1 + Math.sin(T * 0.5 + 2) * 0.008); // Tor es esbelto: la camara se acerca un poco
    return c;
  }
  // desenfoque: las mancuernas de unos instantes antes, si se mueven rapido
  function fantasmas(pose, remoEn, T) {
    var r = [];
    [0.035, 0.07, 0.105].forEach(function (dt) {
      var k = remoEn(T - dt);
      if (Math.abs(k - pose.remo) > 0.05) r.push(Object.assign({}, pose, {
        remo: k
      }));
    });
    return r;
  }
  function suma(a, b, k) {
    return a.clone().add(b.clone().multiplyScalar(k));
  }
  function arr(p) {
    return [p.x, p.y, p.z];
  }
  // flecha en el lienzo entre dos puntos de pantalla, dibujada de a poco
  function Flecha(props) {
    var a = props.a,
      b = props.b,
      p = clamp(props.p, 0, 1);
    if (p < 0.01) return null;
    var x = a[0] + (b[0] - a[0]) * p,
      y = a[1] + (b[1] - a[1]) * p;
    var ang = Math.atan2(y - a[1], x - a[0]),
      L = 34;
    var punta = 'M ' + (x - L * Math.cos(ang - 0.5)).toFixed(1) + ' ' + (y - L * Math.sin(ang - 0.5)).toFixed(1) + ' L ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' L ' + (x - L * Math.cos(ang + 0.5)).toFixed(1) + ' ' + (y - L * Math.sin(ang + 0.5)).toFixed(1);
    var col = props.color || C.GRN;
    return /*#__PURE__*/React.createElement("g", {
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L ' + x.toFixed(1) + ' ' + y.toFixed(1),
      stroke: C.INK,
      strokeWidth: 26
    }), /*#__PURE__*/React.createElement("path", {
      d: punta,
      stroke: C.INK,
      strokeWidth: 26
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L ' + x.toFixed(1) + ' ' + y.toFixed(1),
      stroke: col,
      strokeWidth: 13
    }), /*#__PURE__*/React.createElement("path", {
      d: punta,
      stroke: col,
      strokeWidth: 13
    }));
  }

  /* ---------------- armador de escenas en 3D ---------------- */
  // o: { tomas, pose(T, f, t) -> { pose, musc, remoEn, vibra }, lienzo(T, f, t, pr, J, info),
  //      encima(T, f, t, pr, J, info), mal, bien, r1, r2 }
  function escena3d(o) {
    // el mismo armador comun (E3.escena): encuadre automatico, temblor en la camara y rotulos pulidos
    return E3.escena({
      tomas: o.tomas,
      acerca: 0.92,
      mal: o.mal,
      bien: o.bien,
      golpes: o.golpes,
      zona: o.zona,
      encuadre: o.encuadre,
      r1: o.r1,
      r2: o.r2,
      vista: function (T, f, t) {
        return o.pose(T, f, t);
      },
      lienzo: o.lienzo ? function (T, f, t, pr, info) {
        return o.lienzo(T, f, t, pr, TOR3D.esqueleto(info.pose), info);
      } : null,
      encima: o.encima ? function (T, f, t, pr, info) {
        return o.encima(T, f, t, pr, TOR3D.esqueleto(info.pose), info);
      } : null
    });
  }
  // el musculo que trabaja: resplandor y destellos sobre los dos dorsales
  function brillaDorsal(T, pr, v, destellos) {
    var a = pr('dorsalI'),
      b = pr('dorsalD'),
      m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Halo, {
      T: T,
      c: a,
      r: 80,
      v: v,
      opacidad: 0.5
    }), /*#__PURE__*/React.createElement(V.Halo, {
      T: T,
      c: b,
      r: 80,
      v: v,
      opacidad: 0.5
    }), destellos ? /*#__PURE__*/React.createElement(V.Destellos, {
      T: T,
      c: m,
      r: 170,
      v: v,
      n: 6
    }) : null);
  }
  function contador(T, a, b, n) {
    var u = clamp((T - a) / (b - a), 0, 1) * n,
      hechas = Math.min(n, Math.floor(u + 0.62));
    var e = M.pop(T, a - 0.1, 0.4);
    return /*#__PURE__*/React.createElement(A.Pos, {
      x: 60,
      y: 1080,
      e: e,
      dy: M.life(T, 3, 4)
    }, /*#__PURE__*/React.createElement(B.Cuenta, {
      n: hechas,
      p: u / n,
      s: 0.62
    }));
  }

  /* ---------------- escenas ---------------- */
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 3.2,
    vo: 'Estás haciendo mal tu remo con mancuernas.',
    C: escena3d({
      tomas: [[0, {
        az: 32,
        el: 8,
        dist: 7.8,
        y: 0.86
      }], [1, {
        az: 52,
        el: 10,
        dist: 6.6,
        y: 0.86
      }]],
      pose: function (T, f) {
        var remoEn = function (x) {
          return V.ida(V.fase(x, f(0.02), f(1), 2), 0.28, 0.04);
        };
        var k = remoEn(T);
        return {
          pose: {
            bisagra: 1,
            remo: k,
            balanceo: k
          },
          musc: {
            rojo: 1
          },
          remoEn: remoEn,
          vibra: true
        };
      },
      mal: [{
        x: 760,
        y: 560,
        cuando: 0.2
      }, {
        x: 150,
        y: 1180,
        cuando: 0.55
      }],
      r1: {
        text: 'REMO CON *MANCUERNAS*',
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'Posición',
    dur: 4.8,
    vo: 'Lleva la cadera atrás, dobla un poco las rodillas y mantén la espalda recta.',
    C: escena3d({
      tomas: [[0, {
        az: 92,
        el: 4,
        dist: 7.6,
        y: 0.92
      }], [1, {
        az: 80,
        el: 6,
        dist: 6.9,
        y: 0.88
      }]],
      pose: function (T, f) {
        var b = Easing.easeInOutCubic(clamp((T - f(0.06)) / (f(0.46) - f(0.06)), 0, 1));
        return {
          pose: {
            bisagra: b,
            remo: 0
          },
          musc: {}
        };
      },
      lienzo: function (T, f, t, pr, J) {
        // guia amarilla sobre la espalda y flecha verde: la cadera va atras
        var atras = J.fr.clone().multiplyScalar(-1);
        var g1 = pr(arr(suma(suma(J.cadera, atras, 0.42), J.d, -0.02))),
          g2 = pr(arr(suma(suma(J.cuello, atras, 0.34), J.d, 0.12)));
        var pg = M.draw(T, f(0.5), 0.5);
        var c0 = pr(arr(suma(J.cadera, J.fr, -0.45))),
          c1 = pr(arr(suma(J.cadera, J.fr, -0.95)));
        var cad = pr(arr(J.cadera));
        return /*#__PURE__*/React.createElement("g", null, pg > 0 ? /*#__PURE__*/React.createElement("path", {
          d: 'M ' + g1[0].toFixed(1) + ' ' + g1[1].toFixed(1) + ' L ' + g2[0].toFixed(1) + ' ' + g2[1].toFixed(1),
          stroke: C.YEL,
          strokeWidth: 16,
          strokeDasharray: "34 22",
          strokeLinecap: "round",
          opacity: Math.min(1, pg * 2)
        }) : null, /*#__PURE__*/React.createElement(Flecha, {
          a: [cad[0] + Math.sign(c1[0] - c0[0]) * 150, cad[1] + 10],
          b: [cad[0] + Math.sign(c1[0] - c0[0]) * 330, cad[1] + 10],
          p: M.draw(T, f(0.12), 0.45)
        }));
      },
      bien: [{
        x: 790,
        y: 640,
        cuando: 0.7
      }],
      r1: {
        text: 'CADERA *ATRÁS*'
      },
      r2: {
        text: 'ESPALDA *RECTA*',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Ejecución',
    dur: 6,
    vo: 'Palmas enfrentadas: lleva las mancuernas al abdomen, con los codos cerca del cuerpo.',
    C: escena3d({
      tomas: [[0, {
        az: 38,
        el: 10,
        dist: 7.4,
        y: 0.86
      }], [0.46, {
        az: 74,
        el: 10,
        dist: 6.8,
        y: 0.86
      }], [0.461, {
        az: 104,
        el: 12,
        dist: 6.3,
        y: 0.82,
        dz: 0.2
      }], [1, {
        az: 116,
        el: 15,
        dist: 5.9,
        y: 0.82,
        dz: 0.2
      }]],
      pose: function (T, f) {
        var remoEn = function (x) {
          return rep(x, f(0.06), f(0.97), 2);
        };
        var k = remoEn(T);
        return {
          pose: {
            bisagra: 1,
            remo: k
          },
          musc: {
            brillo: 0.3 * k
          },
          remoEn: remoEn,
          k: k
        };
      },
      lienzo: function (T, f, t, pr, J, info) {
        return info.k > 0.9 ? /*#__PURE__*/React.createElement(V.Destellos, {
          T: T,
          c: pr('manoD'),
          r: 110,
          v: (info.k - 0.9) * 10,
          n: 5
        }) : null;
      },
      encima: function (T, f) {
        return contador(T, f(0.06), f(0.97), 2);
      },
      zona: [200, 378, 1036, 1452],
      r1: {
        text: 'REMA AL *ABDOMEN*'
      },
      r2: {
        text: 'CODOS *CERCA*',
        cuando: 0.46
      }
    })
  }, {
    nombre: 'Bajada',
    dur: 4.4,
    vo: 'Baja despacio hasta estirar los brazos y deja que las escápulas se separen.',
    C: escena3d({
      tomas: [[0, {
        az: -70,
        el: 5,
        dist: 7.2,
        y: 0.84
      }], [1, {
        az: -56,
        el: 7,
        dist: 6.5,
        y: 0.82
      }]],
      pose: function (T, f) {
        var remoEn = function (x) {
          return 1 - Easing.easeInOutSine(clamp((x - f(0.14)) / (f(0.86) - f(0.14)), 0, 1));
        };
        var k = remoEn(T);
        return {
          pose: {
            bisagra: 1,
            remo: k
          },
          musc: {
            brillo: 0.2 * k
          },
          remoEn: remoEn
        };
      },
      lienzo: function (T, f, t, pr) {
        var J1 = TOR3D.esqueleto({
            bisagra: 1,
            remo: 1
          }),
          J0 = TOR3D.esqueleto({
            bisagra: 1,
            remo: 0
          });
        // la flecha va por delante de la mano mas cercana, del abdomen al piso
        var mano = function (J) {
          var i = pr(arr(J.manoI)),
            d = pr(arr(J.manoD));
          return i[0] > d[0] ? i : d;
        };
        var a = mano(J1),
          b = mano(J0),
          x = Math.min(930, Math.max(a[0], b[0]) + 105);
        return /*#__PURE__*/React.createElement(Flecha, {
          a: [x, a[1] - 10],
          b: [x, b[1] + 20],
          p: clamp((T - f(0.14)) / (f(0.86) - f(0.14)), 0, 1)
        });
      },
      bien: [{
        x: 800,
        y: 660,
        cuando: 0.86
      }],
      r1: {
        text: 'BAJA CON *CONTROL*'
      },
      r2: {
        text: 'BRAZOS *ESTIRADOS*',
        cuando: 0.55
      }
    })
  }, {
    nombre: 'Músculos',
    dur: 4.4,
    vo: 'El dorsal ancho lidera el tirón; también trabajan los romboides y el trapecio.',
    C: escena3d({
      tomas: [[0, {
        az: 150,
        el: 28,
        dist: 6.6,
        y: 0.96
      }], [1, {
        az: 205,
        el: 32,
        dist: 5.2,
        y: 1.0
      }]],
      pose: function (T, f) {
        var remoEn = function (x) {
          return rep(x, f(0.04), f(0.98), 2);
        };
        var k = remoEn(T);
        return {
          pose: {
            bisagra: 1,
            remo: k
          },
          musc: {
            brillo: 0.25 + 0.35 * k,
            romboides: 1
          },
          remoEn: remoEn,
          k: k
        };
      },
      lienzo: function (T, f, t, pr, J, info) {
        return brillaDorsal(T, pr, 0.5 + 0.5 * info.k, true);
      },
      r1: {
        text: 'DORSAL *ANCHO*'
      },
      r2: {
        text: 'ROMBOIDES Y *TRAPECIO*',
        cuando: 0.45
      }
    })
  }, {
    nombre: 'Error',
    dur: 5.6,
    vo: 'Si levantas el torso para subir las mancuernas, baja el peso y mantén el tronco firme.',
    C: escena3d({
      tomas: [[0, {
        az: 76,
        el: 6,
        dist: 7.8,
        y: 0.92
      }], [0.48, {
        az: 70,
        el: 6,
        dist: 7.5,
        y: 0.92
      }], [0.481, {
        az: 112,
        el: 9,
        dist: 7.3,
        y: 0.9
      }], [1, {
        az: 100,
        el: 9,
        dist: 6.9,
        y: 0.9
      }]],
      pose: function (T, f, t) {
        if (t < 0.48) {
          var remoMal = function (x) {
            return V.ida(V.fase(x, f(0.02), f(0.48), 2), 0.28, 0.04);
          };
          var k = remoMal(T);
          return {
            pose: {
              bisagra: 1,
              remo: k,
              balanceo: k
            },
            musc: {
              rojo: 1
            },
            remoEn: remoMal,
            vibra: true
          };
        }
        var remoEn = function (x) {
          return rep(x, f(0.5), f(0.99), 1);
        };
        var k2 = remoEn(T);
        return {
          pose: {
            bisagra: 1,
            remo: k2
          },
          musc: {
            brillo: 0.3 * k2
          },
          remoEn: remoEn
        };
      },
      mal: [{
        x: 770,
        y: 600,
        cuando: 0.12,
        hasta: 0.47
      }],
      bien: [{
        x: 790,
        y: 620,
        cuando: 0.66
      }],
      r1: {
        text: 'SIN *BALANCEO*',
        tono: 'rojo'
      },
      r2: {
        text: 'TORSO *FIRME*',
        tono: 'verde',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Cierre',
    dur: 4.2,
    vo: 'Sube sin impulso, baja con control: técnica antes que peso.',
    C: escena3d({
      // la vuelta completa alrededor de Tor
      tomas: [[0, {
        az: 20,
        el: 10,
        dist: 7.8,
        y: 0.88
      }], [1, {
        az: 380,
        el: 12,
        dist: 7.2,
        y: 0.88
      }]],
      pose: function (T, f) {
        var remoEn = function (x) {
          return rep(x, f(0.04), f(0.96), 2);
        };
        var k = remoEn(T);
        return {
          pose: {
            bisagra: 1,
            remo: k
          },
          musc: {
            brillo: 0.3 * k
          },
          remoEn: remoEn
        };
      },
      bien: [{
        x: 800,
        y: 600,
        cuando: 0.78
      }],
      r1: {
        text: 'TÉCNICA ANTES QUE *PESO*'
      }
    })
  }];
  global.REELS.registrar({
    id: 'remo-mancuernas-3d',
    titulo: 'Remo con mancuernas (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 3.6,
      pregunta: '¿LO HACÍAS BIEN?',
      vo: '¿Lo hacías bien? Coméntalo, compártelo y guárdalo.'
    }
  });
})(window);
