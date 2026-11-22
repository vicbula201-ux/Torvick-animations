/* GENERADO por compilar.js desde chatarra-3d.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   COMIDA CHATARRA — TOR EN 3D (mismo guion que chatarra.jsx)
   Las 2 AM vistas desde adentro de la nevera; los ultraprocesados hacen comer
   ~500 kcal mas por dia (Hall 2019); de madrugada no es hambre, es sueno
   (Spiegel 2004, Greer 2013); la regla 80/20; moverse ayuda pero no borra
   todo (hamburguesa con papas ~ mas de una hora corriendo); y a dormir.
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
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };
  function pulso(T, cuando, d) {
    var u = (T - cuando) / d;
    return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
  }
  function azar(i, k) {
    var v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
    return v - Math.floor(v);
  }
  function icono(Cmp, c, k, ang, props) {
    return /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + (ang || 0).toFixed(1) + ') scale(' + k + ') translate(-120 -120)'
    }, /*#__PURE__*/React.createElement(Cmp, _extends({
      s: 1
    }, props || {})));
  }
  function migas(c, T, v, sc) {
    var ms = [],
      k = sc || 1;
    for (var i = 0; i < 9; i++) {
      var x = c[0] + (azar(i, 1) - 0.5) * 110 * k,
        y = c[1] + (44 + azar(i, 2) * 44) * k;
      ms.push(/*#__PURE__*/React.createElement("rect", {
        key: 'p' + i,
        x: x - 5,
        y: y - 5,
        width: 10,
        height: 10,
        rx: 3,
        fill: i % 2 ? C.YEL : C.GRY,
        stroke: C.INK,
        strokeWidth: 4,
        transform: 'rotate(' + i * 37 + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'
      }));
    }
    for (var j = 0; j < 8; j++) {
      var u = (T * 0.8 + j / 8) % 1;
      var cx = c[0] + ((azar(j, 3) - 0.5) * 220 + 20 * Math.sin(u * 6 + j)) * k,
        cy = c[1] + (80 + 520 * u * u) * k;
      ms.push(/*#__PURE__*/React.createElement("rect", {
        key: 'c' + j,
        x: cx - 6,
        y: cy - 6,
        width: 12,
        height: 12,
        rx: 3,
        fill: j % 2 ? C.YEL : C.GRY,
        stroke: C.INK,
        strokeWidth: 4,
        opacity: (v * (1 - u)).toFixed(2),
        transform: 'rotate(' + (T * 200 + j * 50).toFixed(0) + ' ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')'
      }));
    }
    return /*#__PURE__*/React.createElement("g", null, ms);
  }
  function estante(y) {
    return /*#__PURE__*/React.createElement("rect", _extends({
      x: 56,
      y: y,
      width: 968,
      height: 30,
      rx: 10,
      fill: BLANCO
    }, LN, {
      strokeWidth: 12
    }));
  }
  function interiorNevera(T) {
    var mece = function (i) {
      return 2.5 * Math.sin(T * 2 + i * 1.7);
    };
    return /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: -60,
      y: 384,
      width: 116,
      height: 1270,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: 1024,
      y: 384,
      width: 116,
      height: 1270,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("rect", _extends({
      x: -60,
      y: 372,
      width: 1200,
      height: 46,
      rx: 12,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("ellipse", _extends({
      cx: 540,
      cy: 430,
      rx: 74,
      ry: 18,
      fill: C.YEL
    }, LN, {
      strokeWidth: 11
    })), icono(N.COMIDA.gaseosa, [170, 1098], 0.78, mece(0)), icono(N.COMIDA.leche, [900, 1092], 0.8, mece(1)), icono(N.COMIDA.huevo, [740, 1128], 0.5, mece(2)), estante(1190), icono(N.COMIDA.pizza, [170, 1326], 0.7, -8 + mece(3)), icono(N.ICONOS.lata, [360, 1322], 0.68, mece(4)), icono(N.COMIDA.dona, [550, 1332], 0.62, mece(5)), icono(N.COMIDA.fritas, [730, 1324], 0.68, mece(6)), icono(N.COMIDA.hamburguesa, [910, 1332], 0.66, mece(7)), estante(1408));
  }
  var DESFILE = [N.COMIDA.pizza, N.COMIDA.dona, N.COMIDA.fritas, N.COMIDA.hamburguesa, N.COMIDA.gaseosa];
  function desfile(boca, T, v) {
    var out = [];
    for (var i = 0; i < 5; i++) {
      var u = (T * 0.55 + i / 5) % 1;
      var x = 1560 + (boca[0] - 1560) * Easing.easeInQuad(u),
        y = 360 + 90 * i + (boca[1] - 360 - 90 * i) * u - 260 * Math.sin(Math.PI * u);
      out.push(/*#__PURE__*/React.createElement("g", {
        key: i,
        opacity: v * Math.min(1, (1 - u) * 5)
      }, icono(DESFILE[i], [x, y], 1.0 - 0.6 * u, 300 * u)));
    }
    return /*#__PURE__*/React.createElement("g", null, out);
  }
  function antojos(c0, T, v) {
    var c = [c0[0], c0[1] - 230],
      out = [];
    [N.COMIDA.pizza, N.COMIDA.dona, N.COMIDA.hamburguesa].forEach(function (Cmp, i) {
      var a = T * 2.2 + i * 2 * Math.PI / 3,
        atras = Math.sin(a) < 0;
      out.push(/*#__PURE__*/React.createElement("g", {
        key: i,
        opacity: v * (atras ? 0.55 : 1)
      }, icono(Cmp, [c[0] + 250 * Math.cos(a), c[1] + 70 * Math.sin(a)], atras ? 0.62 : 0.8, 0)));
    });
    return /*#__PURE__*/React.createElement("g", null, out);
  }
  function barra8020(T, f) {
    var e = M.pop(T, f(0) - 0.6, 0.5);
    var a = animate({
      from: 0,
      to: 1,
      start: f(0.08),
      end: f(0.36),
      ease: Easing.easeOutCubic
    })(T);
    var b = animate({
      from: 0,
      to: 1,
      start: f(0.44),
      end: f(0.58),
      ease: Easing.easeOutCubic
    })(T);
    return /*#__PURE__*/React.createElement("g", {
      opacity: e.opacity,
      transform: 'translate(0 ' + M.life(T, 3.2, 4).toFixed(1) + ')'
    }, /*#__PURE__*/React.createElement("rect", _extends({
      x: 90,
      y: 640,
      width: 900,
      height: 90,
      rx: 30,
      fill: BLANCO
    }, LN)), a > 0.01 ? /*#__PURE__*/React.createElement("rect", {
      x: 98,
      y: 648,
      width: (712 * a).toFixed(1),
      height: 74,
      rx: 22,
      fill: C.GRN
    }) : null, b > 0.01 ? /*#__PURE__*/React.createElement("rect", {
      x: 818,
      y: 648,
      width: (164 * b).toFixed(1),
      height: 74,
      rx: 22,
      fill: C.YEL
    }) : null, /*#__PURE__*/React.createElement("path", {
      d: "M 814 640 L 814 730",
      stroke: C.INK,
      strokeWidth: 10
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: 90,
      y: 640,
      width: 900,
      height: 90,
      rx: 30,
      fill: "none"
    }, LN)));
  }

  /* ---------------- poses ---------------- */
  function depie(extra) {
    return Object.assign({
      cadera: [0, 1.0, 0],
      pieI: [-0.2, 0.115, 0.03],
      pieD: [0.2, 0.115, 0.03]
    }, extra || {});
  }
  function atracon(T) {
    var a = Math.pow(Math.max(0, Math.sin(T * 3.1)), 2),
      b = Math.pow(Math.max(0, Math.sin(T * 3.1 + Math.PI)), 2);
    return depie({
      tronco: [4, 0, 2 * Math.sin(T * 12)],
      manoI: E3.lerp3([-0.28, 1.18, 0.34], [-0.06, 1.52, 0.26], a),
      manoD: E3.lerp3([0.28, 1.18, 0.34], [0.06, 1.52, 0.26], b),
      codoI: [0.8, -1, 0],
      codoD: [0.8, -1, 0]
    });
  }
  // corriendo en el lugar (de perfil): w la fase
  function corre(T) {
    var w = T * 11,
      cad = [0, 0.98 + 0.03 * Math.abs(Math.sin(w)), 0];
    var p = {
      cadera: cad,
      tronco: [10, 0, 0],
      cabeza: [-6, 0, 0]
    };
    [-1, 1].forEach(function (s, i) {
      var L = s < 0 ? 'I' : 'D',
        fase = i ? Math.PI : 0;
      var sn = Math.sin(w + fase),
        cs = Math.cos(w + fase);
      p['pie' + L] = [s * 0.13, 0.115 + 0.3 * Math.max(0, cs), 0.36 * sn];
      p['rodilla' + L] = [0.1, 0, 1];
      var br = -Math.sin(w + fase);
      p['mano' + L] = [s * 0.36, 1.18 + 0.12 * Math.max(0, br), 0.3 * br + 0.05];
      p['codo' + L] = [0.2, -0.3, -1];
    });
    return p;
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 3,
    vo: 'No comas comida chatarra.',
    C: E3.escena({
      tomas: [[0, {
        az: 6,
        el: 2,
        dist: 3.8,
        y: 1.78
      }], [1, {
        az: 4,
        el: 2,
        dist: 5.8,
        y: 1.45
      }]],
      vista: function (T, f) {
        var pillado = T > f(0.55);
        return {
          figuras: [{
            quien: 'tor',
            pose: atracon(T),
            cara: {
              ojos: 'grandes',
              boca: Math.sin(T * 9) > 0 ? 'o' : 'abierta',
              cejas: 'alzadas',
              color: {
                c: 'amarillo',
                v: 0.32 + 0.06 * Math.sin(T * 7)
              }
            }
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
        A.sonido('crunch', f(0.2));
        A.sonido('crunch', f(0.62));
        var h = pr('cabeza'),
          mi = pr('manoI'),
          md = pr('manoD');
        var sc = clamp(Math.abs(pr([0, 2.06, 0])[1] - pr([0, 0, 0])[1]) / 1300, 0.6, 1.8);
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
          T: T,
          c: h,
          r: 150 * sc,
          v: 0.7
        }), icono(N.COMIDA.hamburguesa, [mi[0] - 10, mi[1] - 40 * sc], 0.8 * sc, -12), icono(N.COMIDA.pizza, [md[0] + 14, md[1] - 40 * sc], 0.8 * sc, 160), migas(h, T, 1, sc));
      },
      encima: function (T) {
        return interiorNevera(T);
      },
      piezas: [{
        C: MU.Despertador,
        s: 0.75,
        x: 70,
        y: 450,
        p: function (T) {
          return {
            T: T,
            hora: 2
          };
        }
      }],
      mal: [{
        x: 110,
        y: 720,
        cuando: 0.24,
        s: 0.6
      }, {
        x: 830,
        y: 730,
        cuando: 0.46,
        s: 0.5
      }],
      r1: {
        text: 'COMIDA *CHATARRA*',
        s: 1.05,
        cuando: 0.02,
        tono: 'rojo'
      },
      r2: {
        text: 'SON LAS *2 AM*',
        s: 1.1,
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Comes de más',
    dur: 5.6,
    vo: 'Muchas calorías y poca saciedad: los ultraprocesados te hacen comer unas 500 calorías de más al día.',
    C: E3.escena({
      tomas: [[0, {
        az: 18,
        el: 4,
        dist: 7.0,
        y: 1.25,
        dx: -0.3
      }], [1, {
        az: 8,
        el: 4,
        dist: 7.4,
        y: 1.2,
        dx: -0.3
      }]],
      vista: function (T, f) {
        var pz = animate({
          from: 0,
          to: 1,
          start: f(0.1),
          end: f(0.85)
        })(T);
        return {
          figuras: [{
            quien: 'tor',
            pose: depie({
              panza: pz,
              cabeza: [0, 14, 0]
            }),
            cara: {
              ojos: 'grandes',
              boca: Math.sin(T * 13) > 0 ? 'abierta' : 'o'
            }
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
        A.sonido('crunch', f(0.16));
        A.sonido('crunch', f(0.5));
        var h = pr('cabeza');
        return /*#__PURE__*/React.createElement("g", null, desfile([h[0] + 20, h[1] + 40], T, 1), migas(h, T, 1, 0.8));
      },
      piezas: [{
        C: P.Medidor,
        s: 0.9,
        x: 50,
        y: 410,
        vibra: true,
        p: function (T) {
          return {
            p: 0.2 + 0.05 * Math.sin(T * 5)
          };
        }
      }, {
        C: N.ICONOS.fuego,
        s: 0.8,
        x: 60,
        y: 1120,
        cuando: 0.4,
        fase: 0.3
      }],
      mal: [{
        x: 110,
        y: 660,
        cuando: 0.3,
        s: 0.55
      }],
      r1: {
        text: 'COMES SIN *LLENARTE*',
        s: 1.0,
        cuando: 0.04,
        tono: 'rojo'
      },
      r2: {
        text: '*+500* CALORÍAS AL DÍA',
        s: 1.0,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Es sueño',
    dur: 5.6,
    vo: 'Y a las 2 de la mañana no es hambre: es sueño. Dormir poco dispara los antojos.',
    C: E3.escena({
      tomas: [[0, {
        az: 12,
        el: 4,
        dist: 7.0,
        y: 1.45
      }], [1, {
        az: 22,
        el: 4,
        dist: 7.6,
        y: 1.45
      }]],
      vista: function (T, f) {
        var bost = Math.max(pulso(T, f(0.1), 1.4), pulso(T, f(0.62), 1.4));
        return {
          figuras: [{
            quien: 'tor',
            pose: depie({
              manoI: E3.lerp3([-0.34, 0.83, 0.08], [-0.04, 1.5, 0.28], bost),
              codoI: [0.8, -1, 0],
              cabeza: [10 * bost, 0, 0]
            }),
            cara: {
              ojos: 'rojos',
              boca: bost > 0.2 ? 'abierta' : 'o'
            }
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
        return antojos(pr('cabeza'), T, animate({
          from: 0,
          to: 1,
          start: f(0.36),
          end: f(0.5)
        })(T));
      },
      piezas: [{
        C: MU.Despertador,
        s: 0.85,
        x: 40,
        y: 1080,
        p: function (T) {
          return {
            T: T,
            hora: 2
          };
        }
      }, {
        C: N.ICONOS.bateria,
        s: 0.95,
        x: 830,
        y: 1080,
        cuando: 0.2,
        p: {
          p: 0.1
        }
      }, {
        C: N.ICONOS.luna,
        s: 0.7,
        x: 60,
        y: 400,
        cuando: 0.1
      }],
      r1: {
        text: 'NO ES HAMBRE: ES *SUEÑO*',
        s: 0.95,
        cuando: 0.04
      },
      r2: {
        text: 'DORMIR POCO = *MÁS ANTOJOS*',
        s: 0.88,
        cuando: 0.54,
        tono: 'rojo'
      }
    })
  }, {
    nombre: 'Regla 80/20',
    dur: 5.6,
    vo: '¿Prohibirla? No. La regla es 80/20: casi todo comida real, y un gusto de vez en cuando.',
    C: E3.escena({
      tomas: [[0, {
        az: 10,
        el: 4,
        dist: 9.4,
        y: 2.3
      }], [1, {
        az: 20,
        el: 4,
        dist: 9.0,
        y: 2.3
      }]],
      vista: function (T, f) {
        var k = animate({
          from: 0,
          to: 1,
          start: f(0.56),
          end: f(0.7),
          ease: Easing.easeOutBack
        })(T);
        var p = E3.poseFlex(k, {});
        p.manoD = [0.42, 1.6, 0.25];
        p.codoD = [0.8, -1, 0];
        return {
          figuras: [{
            quien: 'tor',
            oculto: T < f(0.5),
            pose: p,
            musc: {
              biceps: true
            },
            cara: {
              boca: 'sonrisa'
            }
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
        var m = pr('manoD');
        return /*#__PURE__*/React.createElement("g", null, barra8020(T, f), T > f(0.5) ? icono(N.COMIDA.pizza, [m[0] + 10, m[1] - 50], 0.7, 160) : null);
      },
      piezas: [{
        C: N.COMIDA.pollo,
        s: 0.85,
        x: 100,
        y: 410
      }, {
        C: N.COMIDA.arroz,
        s: 0.85,
        x: 330,
        y: 410,
        cuando: 0.12
      }, {
        C: N.COMIDA.brocoli,
        s: 0.85,
        x: 560,
        y: 410,
        cuando: 0.2
      }, {
        C: N.COMIDA.pizza,
        s: 0.7,
        x: 818,
        y: 430,
        cuando: 0.46
      }, {
        C: B.Cuenta,
        s: 0.9,
        x: 350,
        y: 760,
        cuando: 0.36,
        p: {
          n: 80,
          p: 0.8
        }
      }, {
        C: B.Cuenta,
        s: 0.9,
        x: 800,
        y: 760,
        cuando: 0.58,
        p: {
          n: 20,
          p: 0.2
        }
      }],
      bien: [{
        x: 60,
        y: 1120,
        cuando: 0.74,
        s: 0.75
      }],
      r1: {
        text: 'LA REGLA *80/20*',
        s: 1.15,
        cuando: 0.02
      },
      r2: {
        text: 'UN GUSTO DE *VEZ EN CUANDO*',
        s: 0.88,
        cuando: 0.6,
        tono: 'verde'
      }
    })
  }, {
    nombre: 'Muévete',
    dur: 5,
    vo: 'Y muévete, pero ojo: una hamburguesa con papas equivale a más de una hora corriendo.',
    C: E3.escena({
      tomas: [[0, {
        az: 90,
        el: 4,
        dist: 7.4,
        y: 1.5
      }], [1, {
        az: 84,
        el: 4,
        dist: 7.8,
        y: 1.55
      }]],
      vista: function (T, f) {
        return {
          figuras: [{
            quien: 'tor',
            oculto: T < f(0.2),
            pose: corre(T),
            musc: {
              cuadriceps: true,
              gemelos: 'claro'
            },
            cara: {
              boca: 'abierta',
              cejas: 'triste'
            }
          }]
        };
      },
      lienzo: function (T, f, t, pr) {
        var minutos = Math.round(animate({
          from: 1,
          to: 75,
          start: f(0.3),
          end: f(0.86)
        })(T));
        var piso = pr([0, 0, 0])[1];
        var mas = M.pop(T, f(0.1), 0.4),
          igual = M.pop(T, f(0.26), 0.4);
        var rayas = [];
        for (var i = 0; i < 6; i++) {
          var x = (i * 220 + T * 620) % 1320 - 120;
          rayas.push(/*#__PURE__*/React.createElement("path", {
            key: i,
            d: 'M ' + x.toFixed(1) + ' ' + (piso + 26) + ' l 90 0',
            stroke: C.GRY,
            strokeWidth: 12,
            strokeLinecap: "round"
          }));
        }
        var h = pr('cabeza'),
          c = pr('cadera');
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
          d: 'M 20 ' + (piso + 4) + ' L 1060 ' + (piso + 4),
          stroke: C.GRY,
          strokeWidth: 12,
          strokeLinecap: "round"
        }), rayas, /*#__PURE__*/React.createElement("g", {
          opacity: mas.opacity,
          transform: 'translate(376 500) scale(' + mas.scale.toFixed(3) + ')'
        }, /*#__PURE__*/React.createElement("path", {
          d: "M -34 0 L 34 0 M 0 -34 L 0 34",
          stroke: C.INK,
          strokeWidth: 18,
          strokeLinecap: "round"
        })), /*#__PURE__*/React.createElement("g", {
          opacity: igual.opacity,
          transform: 'translate(700 500) scale(' + igual.scale.toFixed(3) + ')'
        }, /*#__PURE__*/React.createElement("path", {
          d: "M -34 -18 L 34 -18 M -34 18 L 34 18",
          stroke: C.INK,
          strokeWidth: 18,
          strokeLinecap: "round"
        })), T > f(0.2) ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Gotas, {
          T: T,
          c: h,
          v: 1
        }), /*#__PURE__*/React.createElement(V.Lineas, {
          c: [c[0] + 160, c[1] - 200],
          dir: [-1, 0],
          v: 1,
          largo: 170
        })) : null, /*#__PURE__*/React.createElement("g", {
          transform: 'translate(776 ' + (392 + M.life(T, 3, 6, 0.8)).toFixed(1) + ')',
          opacity: M.pop(T, f(0.3), 0.42).opacity
        }, /*#__PURE__*/React.createElement(B.Cuenta, {
          s: 1.05,
          n: minutos,
          p: minutos / 75
        })));
      },
      piezas: [{
        C: N.COMIDA.hamburguesa,
        s: 1.0,
        x: 96,
        y: 380
      }, {
        C: N.COMIDA.fritas,
        s: 0.95,
        x: 420,
        y: 388,
        cuando: 0.14
      }],
      r1: {
        text: 'MUÉVETE, PERO *OJO*',
        s: 1.05,
        cuando: null
      },
      r2: {
        text: 'MÁS DE *1 HORA* CORRIENDO',
        s: 0.92,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'A dormir',
    dur: 5,
    vo: 'Disfrútala de vez en cuando... pero no a las 2 de la mañana. ¡A dormir!',
    C: E3.escena({
      tomas: [[0, {
        az: 14,
        el: 6,
        dist: 7.6,
        y: 1.2,
        dx: 0.35
      }], [0.4, {
        az: 8,
        el: 6,
        dist: 7.8,
        y: 1.2,
        dx: 0.2
      }], [1, {
        az: 4,
        el: 6,
        dist: 8.2,
        y: 1.2,
        dx: -0.2
      }]],
      golpes: [0.34],
      vista: function (T, f) {
        var empuja = animate({
          from: 0,
          to: 1,
          start: f(0.18),
          end: f(0.32),
          ease: Easing.easeInCubic
        })(T) * (1 - animate({
          from: 0,
          to: 1,
          start: f(0.36),
          end: f(0.46)
        })(T));
        var abre = 1 - animate({
          from: 0,
          to: 1,
          start: f(0.24),
          end: f(0.34),
          ease: Easing.easeInCubic
        })(T);
        var bost = pulso(T, f(0.44), 0.22 * (f(1) - f(0)));
        var sale = Easing.easeInCubic(clamp((T - f(0.7)) / (f(0.92) - f(0.7)), 0, 1));
        A.sonido('golpe', f(0.34));
        A.sonido('whoosh', f(0.7));
        var dx = -2.6 * sale,
          paso = sale > 0 ? Math.sin(T * 14) : 0;
        var p = depie({
          cadera: [dx, 1.0 + 0.02 * Math.abs(paso), 0],
          tronco: [3, -70 * clamp(sale * 4, 0, 1), 0],
          pieI: [dx - 0.2 + 0.16 * paso, 0.115, 0.03],
          pieD: [dx + 0.2 - 0.16 * paso, 0.115, 0.03],
          manoD: E3.lerp3([0.34, 0.83, 0.08], [0.78, 1.25, 0.25], empuja),
          codoD: [0.8, -0.6, 0],
          manoI: E3.lerp3([-0.34, 0.83, 0.08], [-0.04, 1.5, 0.28], bost),
          codoI: [0.8, -1, 0],
          cabeza: [12 * bost, 0, 0]
        });
        return {
          figuras: [{
            quien: 'tor',
            pose: p,
            cara: bost > 0.05 ? {
              ojos: 'cerrados',
              boca: 'abierta'
            } : T < f(0.34) ? {
              ojos: 'grandes',
              boca: 'ondulada',
              cejas: 'triste'
            } : {
              ojos: 'rojos',
              boca: 'sonrisa'
            }
          }],
          objetos: [{
            tipo: 'nevera',
            p: [1.0, 0, -0.35],
            abre: 1.9 * abre
          }],
          sale: sale
        };
      },
      lienzo: function (T, f, t, pr, info) {
        var h = pr('cabeza'),
          zetas = [];
        for (var i = 0; i < 3; i++) {
          var u = (T * 0.6 + i / 3) % 1,
            zx = h[0] + 90 + 90 * u,
            zy = h[1] - 40 - 170 * u,
            k = 0.7 + 0.9 * u;
          zetas.push(/*#__PURE__*/React.createElement("path", {
            key: i,
            d: 'M ' + zx.toFixed(1) + ' ' + zy.toFixed(1) + ' l ' + (34 * k).toFixed(1) + ' 0 l ' + (-34 * k).toFixed(1) + ' ' + (34 * k).toFixed(1) + ' l ' + (34 * k).toFixed(1) + ' 0',
            fill: "none",
            stroke: C.INK,
            strokeWidth: 10,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            opacity: (1 - u) * (T > f(0.44) ? 1 : 0)
          }));
        }
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: pr([0.95, 1.2, 0.1]),
          cuando: f(0.34),
          r: 150
        }), zetas);
      },
      piezas: [{
        C: MU.Despertador,
        s: 0.8,
        x: 60,
        y: 380,
        p: function (T) {
          return {
            T: T,
            hora: 2
          };
        }
      }],
      bien: [{
        x: 430,
        y: 760,
        cuando: 0.8,
        s: 0.9
      }],
      r1: {
        text: '¿ANTOJO A LAS *2 AM*?',
        s: 1.0,
        cuando: null
      },
      r2: {
        text: '¡A *DORMIR*!',
        s: 1.2,
        cuando: 0.5,
        tono: 'verde'
      }
    })
  }];
  global.REELS.registrar({
    id: 'chatarra-3d',
    titulo: 'No comas comida chatarra (Tor 3D)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.2,
      pregunta: '¿QUIÉN ASALTA LA NEVERA?',
      vo: 'Mándaselo al que dice que está a dieta, y guarda este video.'
    }
  });
})(window);
