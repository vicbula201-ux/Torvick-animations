/* GENERADO por compilar.js desde pesado-liviano.jsx — no editar a mano. */
/* ============================================================
   ¿PESADO O LIVIANO? — formato de concepto en un solo plano (PS)
   Gancho con pregunta, Tor que habla y se duplica, el experimento de los dos
   Tors (uno con pesas pesadas y pocas repeticiones, otro con livianas y muchas),
   el resultado y el debate en los comentarios.
   Evidencia: Schoenfeld BJ, Grgic J, Ogborn D, Krieger JW. Strength and
   hypertrophy adaptations between low- vs. high-load resistance training: a
   systematic review and meta-analysis. J Strength Cond Res. 2017;31(12):3508-23.
   Hipertrofia parecida con cargas bajas y altas cuando las series llegan al
   fallo; la fuerza maxima mejora mas con cargas altas.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    V = global.V,
    E3 = global.E3,
    PS = global.PS;
  var Easing = global.Easing,
    clamp = global.clamp;
  var C = global.P.C;
  var XA = -0.6,
    XB = 0.6; // Tor pesado (rojo) y Tor liviano (verde)
  var ZONA_TARJETA = [70, 660, 1010, 1330];

  // un ciclo de repeticion: sube 40 %, aguanta un poco, baja lento
  function rep(u) {
    u = u - Math.floor(u);
    if (u < 0.4) return Easing.easeInOutSine(u / 0.4);
    if (u < 0.5) return 1;
    return 1 - Easing.easeInOutSine((u - 0.5) / 0.5);
  }
  // los dos brazos en curl (k 0 abajo .. 1 arriba), sobre la pose de pie con vida
  function curl(p, k, x, temblor) {
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D',
        kk = Easing.easeInOutSine(clamp(k, 0, 1));
      var m = E3.lerp3([x + s * 0.36, 0.84, 0.1], [x + s * 0.42, 1.38, 0.3], kk);
      if (temblor) m[1] += temblor;
      p['mano' + L] = m;
      p['codo' + L] = [0.25, -0.3, -1];
    });
    return p;
  }
  function ejeCurl(k) {
    var a = clamp(k, 0, 1) * Math.PI / 2;
    return [Math.sin(a), 0, Math.cos(a)];
  }
  // pesando las dos mancuernas a la altura del pecho (os -1..1 cual sube)
  function pesando(p, x, os) {
    p.manoD = [x + 0.3, 1.08 - 0.1 * os, 0.42];
    p.manoI = [x - 0.3, 1.08 + 0.1 * os, 0.42];
    p.codoD = [0.4, -0.7, -0.5];
    p.codoI = [0.4, -0.7, -0.5];
    return p;
  }
  function boca(abre, otra) {
    return abre != null ? {
      boca: 'habla',
      abre: abre,
      cerrada: otra || 'sonrisa'
    } : {
      boca: otra || 'sonrisa'
    };
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 3.4,
    vo: '¿Pesas pesadas o livianas? ¿Con cuál creces más?'
  }, {
    nombre: 'Debate',
    dur: 4.6,
    vo: 'Unos dicen que solo creces con peso pesado. Otros, que con livianas y muchas repeticiones.'
  }, {
    nombre: 'Estudio',
    dur: 3.8,
    vo: 'Un análisis juntó los estudios que compararon las dos formas.'
  }, {
    nombre: 'Al fallo',
    dur: 3.4,
    vo: 'En esos estudios, todos entrenaban hasta el fallo.'
  }, {
    nombre: 'Resultado',
    dur: 3.6,
    vo: '¿El resultado? El músculo creció casi igual con las dos.'
  }, {
    nombre: 'Fuerza',
    dur: 2.8,
    vo: 'Pero con pesado ganaron más fuerza.'
  }, {
    nombre: 'La clave',
    dur: 4.2,
    vo: 'Así que la clave no es el peso: es llegar cerca del fallo en cada serie.'
  }, {
    nombre: 'Debate final',
    dur: 4.2,
    vo: '¿Y tú, eres de pesado o de liviano? Te leo en los comentarios.'
  }];
  PS.video({
    id: 'pesado-liviano',
    titulo: '¿Pesado o liviano? (plano secuencia)',
    escenas: ESCENAS,
    claves: {
      pesadas: 'rojo',
      pesado: 'rojo',
      peso: 'rojo',
      livianas: 'verde',
      liviano: 'verde',
      fallo: 'amarillo',
      igual: 'amarillo',
      fuerza: 'amarillo',
      clave: 'amarillo'
    },
    camara: [[[0, 0], {
      az: 8,
      el: 4,
      dist: 3.6,
      y: 1.5
    }], [[0, 0.9], {
      az: -6,
      el: 5,
      dist: 3.8,
      y: 1.46
    }], [[1, 0.7], {
      az: 18,
      el: 6,
      dist: 5.4,
      y: 1.0
    }], [[2, 0.3], {
      az: -10,
      el: 8,
      dist: 6.6,
      y: 0.95
    }], [[3, 0.9], {
      az: 22,
      el: 10,
      dist: 6.6,
      y: 0.95
    }], [[4, 0.8], {
      az: 34,
      el: 14,
      dist: 6.2,
      y: 1.0
    }], [[5, 0.9], {
      az: -28,
      el: 10,
      dist: 6.2,
      y: 1.0,
      dx: -0.25
    }], [[6, 0.8], {
      az: 0,
      el: 6,
      dist: 6.0,
      y: 1.0
    }], [[7, 0.6], {
      az: 4,
      el: 4,
      dist: 5.0,
      y: 1.12
    }], [[7, 1], {
      az: -2,
      el: 4,
      dist: 4.8,
      y: 1.15
    }]],
    libre: [[[0, 0], [0, 0.85]]],
    golpes: [[2, 0.1], [6, 0.42], [7, 0.72]],
    zona: function (T, b) {
      if (b.entre(T, [2, 0.1], [3, 0.3]) || b.entre(T, [4, 0.08], [6, 0.1]) || b.entre(T, [7, 0.25], [7, 1.01])) return ZONA_TARJETA;
      return T < b.f(2, 0.08) ? [70, 400, 1010, 1330] : PS.ZONA; // con el titulo arriba
    },
    vista: function (T, b, cam, ex) {
      var abre = ex ? ex.abre : 0;
      var split = b.k(T, [2, 0.06], [2, 0.36], Easing.easeInOutCubic); // Tor se duplica
      var dos = T >= b.f(2, 0.08);
      var figs = [];
      // ---- Tor A (el que habla; al duplicarse se queda con las pesadas)
      var xa = XA * split;
      var a = PS.depie(T, {
          x: xa
        }),
        caraA = boca(abre),
        musA = null,
        pesasA,
        tamA,
        colA;
      if (T < b.f(2, 0.08)) {
        // gancho y debate: pesa las dos (la pesada en la derecha, la liviana en la izquierda)
        var os = Math.sin(T * 2.2) * 0.6;
        if (b.entre(T, [1, 0.05], [1, 0.48])) os = -1 + 0.15 * Math.sin(T * 5); // levanta la pesada
        else if (b.entre(T, [1, 0.5], [1, 1])) os = 1 - 0.4 * Math.abs(Math.sin(T * 9)); // la liviana, rapido
        pesando(a, xa, os);
        pesasA = 'prono';
        tamA = {
          I: 0.72,
          D: 1.45
        };
        colA = {
          I: 'verde',
          D: 'rojo'
        };
        caraA.cejas = b.entre(T, [0, 0], [0, 1]) ? 'alzadas' : null;
      } else {
        pesasA = 'prono';
        tamA = {
          I: 1.3,
          D: 1.3
        };
        colA = {
          I: 'rojo',
          D: 'rojo'
        };
        if (b.entre(T, [3, 0], [4, 0])) {
          // al fallo: 6 repeticiones lentas (el contador llega a 8)
          var u = b.k(T, [3, 0.02], [3, 0.98]) * 6,
            k = u >= 6 ? 0 : rep(u),
            cansado = u / 6;
          curl(a, k, xa, cansado > 0.7 ? 0.012 * Math.sin(T * 60) : 0);
          pesasA = {
            I: ejeCurl(k),
            D: ejeCurl(k)
          };
          caraA = {
            boca: cansado > 0.5 ? 'dientes' : 'recta',
            cejas: cansado > 0.5 ? 'enojo' : null
          };
          musA = {
            biceps: true,
            brillo: 0.3 * k
          };
        } else if (b.entre(T, [4, 0], [5, 0])) {
          var fl = b.k(T, [4, 0.05], [4, 0.3], Easing.easeOutBack);
          a = E3.poseFlex(fl, {
            cadera: [xa, 1.0, 0],
            pieI: [xa - 0.2, 0.115, 0.02],
            pieD: [xa + 0.2, 0.115, 0.02]
          });
          pesasA = null;
          musA = {
            biceps: true,
            brillo: 0.4
          };
          caraA = boca(abre);
        } else if (b.entre(T, [5, 0], [6, 0])) {
          // fuerza: sube la pesada por encima de la cabeza
          var pr2 = b.k(T, [5, 0.05], [5, 0.4], Easing.easeOutBack);
          a.manoD = E3.lerp3([xa + 0.36, 0.86, 0.1], [xa + 0.3, 2.05, 0.05], pr2);
          a.codoD = [0.6, -0.3, -0.6];
          pesasA = {
            I: null,
            D: 'prono'
          };
          musA = {
            deltoides: true,
            triceps: true,
            brillo: 0.4 * pr2
          };
          caraA = {
            boca: 'dientes',
            cejas: 'alzadas'
          };
        } else if (b.entre(T, [6, 0], [7, 0])) {
          // chocan las manos en el medio
          var c5 = b.k(T, [6, 0.12], [6, 0.42], Easing.easeInOutCubic),
            sa = b.k(T, [6, 0.6], [6, 0.85], Easing.easeInOutSine);
          a.manoD = E3.lerp3(E3.lerp3([xa + 0.33, 0.86, 0.06], [-0.04, 1.75, 0.15], c5), [xa + 0.33, 0.86, 0.06], sa);
          a.codoD = [0.6, -0.6, -0.4];
          pesasA = null;
          caraA = boca(abre);
        } else {
          // el debate: senala a la camara
          pesasA = null;
          caraA = boca(abre, 'sonrisa');
          caraA.cejas = 'alzadas';
          PS.senalar(a, cam, b.k(T, [7, 0.05], [7, 0.25]) * (1 - b.k(T, [7, 0.55], [7, 0.75])), 1);
        }
      }
      var mira = T < b.f(2, 0.1) ? 1 : b.entre(T, [3, 0], [6, 0.5]) ? 0.2 : 0.9;
      PS.mirarCamara(a, cam, mira);
      figs.push({
        quien: 'tor',
        pose: a,
        pesas: pesasA,
        pesaTam: tamA,
        pesaColor: colA,
        musc: musA,
        cara: caraA,
        ropa: {
          short: 'rojo'
        }
      });
      // ---- Tor B (el clon, con las livianas)
      if (dos) {
        var bp = PS.depie(T + 1.3, {
            x: XB
          }),
          caraB = {
            boca: 'sonrisa'
          },
          musB = null,
          pesasB = 'prono';
        if (T < b.f(3, 0)) {
          var sorpresa = b.k(T, [2, 0.1], [2, 0.5]);
          caraB = {
            ojos: sorpresa < 0.9 ? 'grandes' : 'normal',
            boca: sorpresa < 0.9 ? 'o' : 'sonrisa'
          };
          PS.mirarCamara(bp, cam, 1 - sorpresa);
        } else if (b.entre(T, [3, 0], [4, 0])) {
          // al fallo: 12 repeticiones rapidas (el contador llega a 25)
          var u2 = b.k(T, [3, 0.02], [3, 0.98]) * 12,
            k2 = u2 >= 12 ? 0 : rep(u2),
            cans = u2 / 12;
          curl(bp, k2, XB, cans > 0.7 ? 0.012 * Math.sin(T * 55) : 0);
          pesasB = {
            I: ejeCurl(k2),
            D: ejeCurl(k2)
          };
          caraB = {
            boca: cans > 0.6 ? 'dientes' : 'recta',
            cejas: cans > 0.6 ? 'enojo' : null
          };
          musB = {
            biceps: true,
            brillo: 0.3 * k2
          };
        } else if (b.entre(T, [4, 0], [5, 0])) {
          var fl2 = b.k(T, [4, 0.1], [4, 0.35], Easing.easeOutBack);
          bp = E3.poseFlex(fl2, {
            cadera: [XB, 1.0, 0],
            pieI: [XB - 0.2, 0.115, 0.02],
            pieD: [XB + 0.2, 0.115, 0.02]
          });
          pesasB = null;
          musB = {
            biceps: true,
            brillo: 0.4
          };
          caraB = {
            boca: 'sonrisa'
          };
        } else if (b.entre(T, [5, 0], [6, 0])) {
          // se encoge de hombros
          var sh = b.k(T, [5, 0.1], [5, 0.35], Easing.easeOutBack);
          bp.hombros = {
            sube: 0.8 * sh
          };
          bp.manoI = E3.lerp3(bp.manoI, [XB - 0.45, 1.15, 0.25], sh);
          bp.manoD = E3.lerp3(bp.manoD, [XB + 0.45, 1.15, 0.25], sh);
          bp.codoI = [1, -0.5, -0.2];
          bp.codoD = [1, -0.5, -0.2];
          pesasB = null;
          caraB = {
            boca: 'recta',
            cejas: 'alzadas'
          };
        } else if (b.entre(T, [6, 0], [7, 0])) {
          var c6 = b.k(T, [6, 0.12], [6, 0.42], Easing.easeInOutCubic),
            sb = b.k(T, [6, 0.6], [6, 0.85], Easing.easeInOutSine);
          bp.manoI = E3.lerp3(E3.lerp3([XB - 0.33, 0.86, 0.06], [0.04, 1.75, 0.15], c6), [XB - 0.33, 0.86, 0.06], sb);
          bp.codoI = [0.6, -0.6, -0.4];
          pesasB = null;
          caraB = {
            boca: c6 > 0.5 && sb < 0.5 ? 'dientes' : 'sonrisa'
          };
        } else {
          // toca la pantalla al decir "comentarios"
          var to = b.k(T, [7, 0.5], [7, 0.68]) * (1 - b.k(T, [7, 0.82], [7, 0.97]));
          PS.senalar(bp, cam, to, -1);
          pesasB = null;
          caraB = {
            boca: 'sonrisa',
            cejas: 'alzadas'
          };
        }
        if (!b.entre(T, [3, 0], [4, 0]) && !(T < b.f(3, 0))) PS.mirarCamara(bp, cam, b.entre(T, [7, 0], [8, 0]) ? 1 : 0.3);
        figs.push({
          quien: 'tor',
          pose: bp,
          pesas: pesasB,
          pesaTam: {
            I: 0.72,
            D: 0.72
          },
          pesaColor: {
            I: 'verde',
            D: 'verde'
          },
          musc: musB,
          cara: caraB,
          ropa: {
            short: 'verde'
          }
        });
      }
      return {
        figuras: figs,
        objetos: []
      };
    },
    lienzo: function (T, b, pr) {
      var r = [];
      // el clon aparece en una nube de tiza
      if (T > b.f(2, 0.05) && T < b.f(2, 0.05) + 1.6) r.push(/*#__PURE__*/React.createElement(V.Polvo, {
        key: "pv",
        T: T,
        c: pr([XB, 1.0, 0]),
        cuando: b.f(2, 0.08),
        n: 26,
        fuerza: 1.3,
        dura: 1.2
      }));
      if (b.entre(T, [3, 0.55], [4, 0])) {
        r.push(/*#__PURE__*/React.createElement(V.Gotas, {
          key: "g1",
          T: T,
          c: pr('cabeza', 0),
          v: 1
        }));
        r.push(/*#__PURE__*/React.createElement(V.Gotas, {
          key: "g2",
          T: T,
          c: pr('cabeza', 1),
          v: 1
        }));
      }
      if (b.entre(T, [4, 0.05], [5, 0])) [0, 1].forEach(function (i) {
        r.push(/*#__PURE__*/React.createElement("g", {
          key: 'br' + i
        }, E3.brilla(T, function (q) {
          return pr(q, i);
        }, ['m:biceps:0', 'm:biceps:1'], b.k(T, [4, 0.05], [4, 0.3]), i === 0, 44)));
      });
      if (b.entre(T, [6, 0.3], [6, 0.9])) r.push(/*#__PURE__*/React.createElement(V.Chispa, {
        key: "ch",
        T: T,
        c: pr([0, 1.78, 0.15]),
        cuando: b.f(6, 0.42),
        r: 150
      }));
      return /*#__PURE__*/React.createElement("g", null, r);
    },
    encima: function (T, b, pr) {
      var r = [];
      // contadores de repeticiones sobre cada cabeza
      if (b.entre(T, [3, 0], [4, 0.3])) {
        [[0, 8, 6, 'rojo'], [1, 25, 12, 'verde']].forEach(function (q) {
          var u = b.k(T, [3, 0.02], [3, 0.98]) * q[2],
            n = Math.min(q[1], Math.round(Math.floor(u + 0.6) * q[1] / q[2]));
          var c = pr('cabeza', q[0]),
            e = Easing.easeOutBack(clamp((T - b.f(3, 0)) / 0.4, 0, 1));
          r.push(/*#__PURE__*/React.createElement("svg", {
            key: 'c' + q[0],
            width: 1080,
            height: 1920,
            style: {
              position: 'absolute',
              left: 0,
              top: 0,
              overflow: 'visible'
            }
          }, /*#__PURE__*/React.createElement("g", {
            transform: 'translate(' + c[0].toFixed(1) + ' ' + (c[1] - 150).toFixed(1) + ') scale(' + e.toFixed(3) + ')'
          }, /*#__PURE__*/React.createElement("rect", {
            x: -78,
            y: -58,
            width: 156,
            height: 104,
            rx: 26,
            fill: q[3] === 'rojo' ? C.RED : C.GRN,
            stroke: C.INK,
            strokeWidth: 6
          }), /*#__PURE__*/React.createElement("text", {
            x: 0,
            y: 28,
            textAnchor: "middle",
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: 64,
            fill: "#ffffff"
          }, n), /*#__PURE__*/React.createElement("text", {
            x: 0,
            y: -66,
            textAnchor: "middle",
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 30,
            fill: "#ffffff",
            letterSpacing: 3
          }, "REPS"))));
        });
      }
      // el tema, arriba, mientras dura la pregunta
      var tit = 1 - b.k(T, [1, 0.85], [2, 0.08]);
      if (tit > 0.01) r.push(/*#__PURE__*/React.createElement("div", {
        key: "tit",
        style: {
          position: 'absolute',
          inset: 0,
          opacity: tit
        }
      }, /*#__PURE__*/React.createElement(E3.Rot, {
        T: T,
        text: "PESADO *VS* LIVIANO",
        y: 262,
        s: 1.15,
        cuando: b.f(0, 0.04)
      })));
      r.push(/*#__PURE__*/React.createElement(PS.Estudio, {
        key: "es",
        T: T,
        cuando: b.f(2, 0.18),
        hasta: b.f(3, 0.15),
        autor: "Schoenfeld y col., 2017",
        detalle: "Metaan\xE1lisis \xB7 cargas altas vs. bajas"
      }));
      r.push(/*#__PURE__*/React.createElement(PS.Barras, {
        key: "b1",
        T: T,
        cuando: b.f(4, 0.12),
        hasta: b.f(5, 0.02),
        titulo: "M\xDASCULO",
        items: [{
          label: 'PESADO',
          v: 0.82,
          color: 'rojo',
          valor: ''
        }, {
          label: 'LIVIANO',
          v: 0.8,
          color: 'verde',
          valor: ''
        }]
      }));
      r.push(/*#__PURE__*/React.createElement(PS.Barras, {
        key: "b2",
        T: T,
        cuando: b.f(5, 0.08),
        hasta: b.f(6, 0.08),
        titulo: "FUERZA",
        sombra: "rojo",
        items: [{
          label: 'PESADO',
          v: 0.9,
          color: 'rojo',
          valor: ''
        }, {
          label: 'LIVIANO',
          v: 0.55,
          color: 'verde',
          valor: ''
        }]
      }));
      r.push(/*#__PURE__*/React.createElement(PS.Encuesta, {
        key: "en",
        T: T,
        cuando: b.f(7, 0.3),
        pregunta: "\xBFT\xDA DE CU\xC1L ERES?",
        a: {
          text: 'PESADO',
          color: 'rojo'
        },
        b: {
          text: 'LIVIANO',
          color: 'verde'
        }
      }));
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0
        }
      }, r);
    },
    sobre: function (T, b, pr) {
      // el toque en la pantalla (la cuarta pared)
      if (!b.entre(T, [7, 0.6], [8, 0])) return null;
      var c = pr('manoI', 1);
      return /*#__PURE__*/React.createElement("svg", {
        width: 1080,
        height: 1920,
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          overflow: 'visible'
        }
      }, /*#__PURE__*/React.createElement(PS.Toque, {
        T: T,
        cuando: b.f(7, 0.72),
        x: c[0],
        y: c[1]
      }));
    },
    accion: {
      dur: 4.2,
      pregunta: '¿PESADO O LIVIANO?',
      vo: 'Compártelo con tu compañero de entreno y guárdalo para tu próximo entreno.'
    },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
