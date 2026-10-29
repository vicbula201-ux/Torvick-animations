/* GENERADO por compilar.js desde marihuana.jsx — no editar a mano. */
/* ============================================================
   MARIHUANA — reel corto con Tor, ESTILO 2 (~40 s con el cierre)
   "Deja de fumar marihuana" (pedido del autor):
   - gancho: Tor con los ojos rojos y un bareto, con las X de error;
   - razones (lo que dicen los CDC y el NIDA, sin exagerar): el humo irrita
     los bronquios (tos, flema, peor respiracion); afecta la memoria, la
     atencion y el tiempo de reaccion; cerca de 3 de cada 10 personas que la
     consumen tienen un trastorno por consumo; en jovenes y con mucho THC
     sube el riesgo de ansiedad y de psicosis;
   - hay quien usa marihuana medicinal (dolor, relajarse): con receta y
     control medico, no es lo mismo que fumar por diversion;
   - antes de las redes, la parodia de campana "di no": a Tor le ofrecen un
     bareto, cruza los brazos, lo manda de un manotazo al tacho y festeja.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    P = global.P,
    B = global.B,
    N = global.N,
    PL = global.PL,
    V = global.V,
    TOR = global.TOR;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var A = global.REELS.ayudas;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var FIG = PL.FIG;

  /* ---------------- Tor fumando ---------------- */

  function poseFuma() {
    var p = TOR.pose({
      flex: 0
    });
    var g = B.geoFrente({
      pose: p
    });
    p.der.codo = U.suma(g.der.hombro, [96, 190]);
    p.der.mano = U.suma(g.cabeza, [118, 66]);
    return p;
  }
  // el bareto en la boca, sostenido por la mano; devuelve la brasa (para el humo)
  var BOCA = [30, 52]; // desde el centro de la cabeza
  function baretoEn(c, ang, k) {
    var r = ang * Math.PI / 180;
    var brasa = U.suma(c, [Math.cos(r) * 174 * k, Math.sin(r) * 174 * k - 4 * k]);
    return {
      brasa: brasa,
      el: /*#__PURE__*/React.createElement("g", {
        transform: 'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + ang + ') scale(' + k + ') translate(-30 -134)'
      }, /*#__PURE__*/React.createElement(N.ICONOS.bareto, {
        s: 1
      }))
    };
  }
  function fumando(g, T) {
    var b = baretoEn(U.suma(g.cabeza, BOCA), -14, 1.05);
    return /*#__PURE__*/React.createElement("g", null, b.el, /*#__PURE__*/React.createElement(V.Humo, {
      T: T,
      c: b.brasa,
      v: 1,
      alto: 300,
      viento: 30
    }));
  }
  // tos: bocanadas que salen de la boca
  function tos(g, T) {
    return /*#__PURE__*/React.createElement(V.Humo, {
      T: T * 2.2,
      c: U.suma(g.cabeza, [0, 60]),
      v: 0.9,
      alto: 150,
      viento: -60
    });
  }

  // diez personas: tres se vuelven rojas
  var GENTE = [];
  for (var i = 0; i < 10; i++) GENTE.push([66 + i % 5 * 192, i < 5 ? 470 : 760]);
  var ROJAS = {
    1: 0.4,
    8: 0.5,
    4: 0.6
  };

  // garabato de ansiedad dentro de la nube
  function Garabato() {
    var pts = [];
    for (var k = 0; k <= 40; k++) {
      var a = k * 0.62;
      pts.push((150 + Math.cos(a) * (60 + 26 * Math.sin(k * 1.7)) + k * 2).toFixed(1) + ' ' + (100 + Math.sin(a) * (44 + 14 * Math.cos(k * 1.3))).toFixed(1));
    }
    return /*#__PURE__*/React.createElement("svg", {
      width: 300 * 0.6,
      height: 200 * 0.6,
      viewBox: "0 0 300 200",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + pts.join(' L '),
      fill: "none",
      stroke: C.INK,
      strokeWidth: 10,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
  }

  /* ---------------- la parodia: "¡di no!" ---------------- */

  var PT = {
    x: 120,
    y: 380,
    s: 0.7
  }; // Tor en la parodia
  function enTor(p) {
    return [PT.x + p[0] * PT.s, PT.y + p[1] * PT.s];
  }

  // brazos cruzados en X delante del pecho, o el manotazo hacia la derecha
  function poseNo(cruza, manotazo) {
    var p = TOR.pose({
      flex: 0
    });
    var base = TOR.pose({
      flex: 0
    });
    var X = {
      izq: {
        codo: [450, 800],
        mano: [770, 600]
      },
      der: {
        codo: [750, 800],
        mano: [430, 600]
      }
    };
    ['izq', 'der'].forEach(function (k) {
      p[k].codo = U.lerpP(base[k].codo, X[k].codo, cruza);
      p[k].mano = U.lerpP(base[k].mano, X[k].mano, cruza);
    });
    if (manotazo > 0) {
      p.der.codo = U.lerpP(p.der.codo, [900, 700], manotazo);
      p.der.mano = U.lerpP(p.der.mano, [1080, 620], manotazo);
    }
    return p;
  }
  function Tacho(props) {
    var e = props.e,
      tapa = props.tapa || 0;
    if (e.opacity < 0.02) return null;
    return /*#__PURE__*/React.createElement("g", {
      opacity: e.opacity,
      transform: 'translate(180 1300) scale(' + e.scale.toFixed(3) + ') translate(-180 -1300)'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 80 1210 L 280 1210 L 262 1430 L 98 1430 Z",
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 14,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 135 1240 L 140 1400 M 180 1240 L 180 1400 M 225 1240 L 220 1400",
      stroke: C.GRY,
      strokeWidth: 10,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("g", {
      transform: 'rotate(' + (-28 * tapa).toFixed(1) + ' 80 1200)'
    }, /*#__PURE__*/React.createElement("rect", {
      x: 66,
      y: 1186,
      width: 228,
      height: 30,
      rx: 12,
      fill: C.GRY,
      stroke: C.INK,
      strokeWidth: 13
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 160 1186 Q 180 1160 200 1186",
      fill: "none",
      stroke: C.INK,
      strokeWidth: 12,
      strokeLinecap: "round"
    })));
  }
  function EscParodia(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    // la mano que ofrece entra por la derecha y despues se va
    var entra = Easing.easeOutCubic(clamp((T - f(0.02)) / (f(0.2) - f(0.02)), 0, 1));
    var sale = Easing.easeInCubic(clamp((T - f(0.42)) / (f(0.56) - f(0.42)), 0, 1));
    var mano = [U.lerp(1240, 840, entra) + 420 * sale, 900 + 60 * sale];
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
    var pose = festeja > 0.01 ? TOR.pose({
      flex: festeja
    }) : poseNo(cruza, manotazo);
    // el bareto: en la mano que ofrece, despues vuela al tacho girando
    var vuela = clamp((T - f(0.41)) / (f(0.6) - f(0.41)), 0, 1);
    var tacho = [180, 1250];
    var bar, ang;
    // ofrecido con el filtro hacia Tor: la brasa queda del lado de la mano
    if (vuela <= 0) {
      bar = U.suma(mano, [-170, -16]);
      ang = 0;
    } else {
      var k = Easing.easeInQuad(vuela);
      bar = [U.lerp(mano[0] - 170, tacho[0], k), U.lerp(mano[1] - 16, tacho[1], k) - 420 * Math.sin(Math.PI * vuela)];
      ang = 720 * vuela;
    }
    var dentro = vuela >= 1;
    var b = baretoEn(bar, ang, 0.85);
    A.sonido('whoosh', f(0.4));
    A.sonido('golpe', f(0.6));
    var tapa = clamp(1 - Math.abs((T - f(0.6)) / 0.18), 0, 1);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement(V.Camara, {
      T: T,
      at: at,
      dur: dur,
      tomas: [[0, {
        zoom: 1.08,
        foco: [640, 900]
      }], [0.4, {
        zoom: 1.02,
        foco: [560, 900]
      }], [1, {
        zoom: 1.05,
        foco: [540, 900]
      }]],
      golpes: [0.4],
      pulsos: [0.28, 0.6]
    }, /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: 540,
      cy: PT.y + 1505 * PT.s,
      rx: 260,
      ry: 30,
      fill: C.GRY
    })), /*#__PURE__*/React.createElement(A.Pos, {
      x: PT.x,
      y: PT.y,
      e: M.pop(T, at - 0.6, 0.5),
      dx: cruza > 0.5 && manotazo < 0.1 ? M.vibra(T, 30, 2) : 0,
      dy: M.life(T, 3.6, 4)
    }, /*#__PURE__*/React.createElement(TOR.Tor, {
      s: PT.s,
      pose: pose,
      flex: festeja,
      boca: festeja > 0.3 ? 'sonrisa' : cruza > 0.3 ? 'triste' : true,
      sinPiso: true,
      parpadeo: V.parpadeo(T)
    })), /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, sale < 1 ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: 'M 1260 1000 L ' + U.pt(mano),
      stroke: C.INK,
      strokeWidth: 84,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M 1260 1000 L ' + U.pt(mano),
      stroke: BLANCO,
      strokeWidth: 56,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: mano[0],
      cy: mano[1],
      r: 46,
      fill: BLANCO,
      stroke: C.INK,
      strokeWidth: 14
    })) : null, !dentro ? /*#__PURE__*/React.createElement("g", null, b.el, vuela <= 0 ? /*#__PURE__*/React.createElement(V.Humo, {
      T: T,
      c: b.brasa,
      v: 1,
      alto: 200
    }) : null) : null, cruza > 0.5 && manotazo < 0.1 ? /*#__PURE__*/React.createElement(V.Lineas, {
      c: enTor([600, 700]),
      dir: [0, -1],
      v: 0.8,
      largo: 110
    }) : null, /*#__PURE__*/React.createElement(V.Chispa, {
      T: T,
      c: U.suma(mano, [-120, -20]),
      cuando: f(0.4),
      r: 110
    }), /*#__PURE__*/React.createElement(Tacho, {
      e: M.pop(T, f(0.3), 0.42),
      tapa: tapa
    }), function () {
      var e = M.pop(T, f(0.66), 0.42);
      if (e.opacity < 0.02) return null;
      return /*#__PURE__*/React.createElement("g", {
        opacity: e.opacity,
        transform: 'translate(180 1300) scale(' + e.scale.toFixed(3) + ') translate(-180 -1300)'
      }, /*#__PURE__*/React.createElement("circle", {
        cx: 180,
        cy: 1300,
        r: 150,
        fill: "none",
        stroke: C.RED,
        strokeWidth: 26
      }), /*#__PURE__*/React.createElement("path", {
        d: "M 74 1194 L 286 1406",
        stroke: C.RED,
        strokeWidth: 26,
        strokeLinecap: "round"
      }));
    }(), /*#__PURE__*/React.createElement(V.Chispa, {
      T: T,
      c: enTor([600, 330]),
      cuando: f(0.74),
      r: 160
    }))), /*#__PURE__*/React.createElement(A.Bien, {
      T: T,
      cuando: f(0.72),
      x: 860,
      y: 560,
      s: 0.85
    }), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "\xA1NO, NO Y NO!",
      y: 290,
      s: 1.3,
      cuando: f(0.28)
    }), /*#__PURE__*/React.createElement(V.Rot, {
      T: T,
      text: "DI NO AL BARETO",
      y: 1490,
      s: 1.1,
      cuando: f(0.66)
    }));
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 2.5,
    vo: 'Deja de fumar marihuana.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.35,
        foco: [580, 560]
      }], [1, {
        zoom: 1.04,
        foco: [540, 860]
      }]],
      tor: {
        x: FIG.x,
        y: FIG.y + 50,
        ojos: 'rojos',
        boca: true,
        vibra: true,
        pose: poseFuma(),
        extra: function (g, T) {
          return fumando(g, T);
        }
      },
      mal: [{
        x: 100,
        y: 430,
        cuando: 0.2,
        s: 0.6
      }, {
        x: 830,
        y: 1150,
        cuando: 0.44,
        s: 0.5
      }],
      r1: {
        text: 'MARIHUANA',
        s: 1.3,
        cuando: 0.02
      }
    })
  }, {
    nombre: 'Pulmones',
    dur: 5,
    vo: 'Primero, el humo irrita tus bronquios: más tos, más flema y peor respiración al entrenar.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.06,
        foco: [540, 640]
      }], [0.6, {
        zoom: 1.0,
        foco: [540, 900]
      }], [1, {
        zoom: 1.04,
        foco: [540, 980]
      }]],
      piezas: [{
        C: N.ICONOS.pulmones,
        s: 2.5,
        x: 240,
        y: 360,
        p: function (T, f) {
          return {
            humo: animate({
              from: 0,
              to: 1,
              start: f(0.12),
              end: f(0.5)
            })(T)
          };
        }
      }, {
        C: TOR.Tor,
        s: 0.36,
        x: 20,
        y: 1000,
        cuando: 0.5,
        p: function (T, f) {
          return {
            boca: 'triste',
            ojos: 'rojos',
            sinPiso: true,
            parpadeo: 0,
            extra: function (g) {
              return tos(g, T);
            }
          };
        }
      }],
      lienzo: function (T, f) {
        return /*#__PURE__*/React.createElement(V.Humo, {
          T: T,
          c: [540, 470],
          v: animate({
            from: 0,
            to: 1,
            start: f(0.06),
            end: f(0.2)
          })(T),
          alto: 180
        });
      },
      mal: [{
        x: 820,
        y: 1110,
        cuando: 0.58,
        s: 0.55
      }],
      r1: {
        text: 'IRRITA TUS PULMONES',
        cuando: 0.06
      },
      r2: {
        text: 'RESPIRAS PEOR',
        s: 1.2,
        cuando: 0.56
      }
    })
  }, {
    nombre: 'Cerebro',
    dur: 4.5,
    vo: 'Afecta tu memoria y tu concentración, y te vuelve más lento para reaccionar.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.04,
        foco: [540, 660]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      piezas: [{
        C: P.Cerebro,
        s: 0.92,
        x: 255,
        y: 360,
        p: function (T, f) {
          return {
            T: T,
            on: animate({
              from: 1,
              to: 0.15,
              start: f(0.16),
              end: f(0.55)
            })(T)
          };
        }
      }, {
        C: P.Reloj,
        s: 1.1,
        x: 700,
        y: 1000,
        cuando: 0.5,
        p: {
          speed: 0.25
        }
      }, {
        C: TOR.Tor,
        s: 0.36,
        x: 30,
        y: 960,
        cuando: 0.42,
        p: function (T) {
          return {
            boca: true,
            ojos: 'rojos',
            sinPiso: true,
            parpadeo: 0
          };
        }
      }],
      mal: [{
        x: 820,
        y: 420,
        cuando: 0.4,
        s: 0.55
      }],
      r1: {
        text: 'MEMORIA Y FOCO',
        s: 1.2,
        cuando: 0.06
      },
      r2: {
        text: 'REACCIONAS MÁS LENTO',
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Engancha',
    dur: 5.5,
    vo: 'Y engancha: cerca de 3 de cada 10 personas que la consumen desarrollan un trastorno por su uso.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.04,
        foco: [540, 640]
      }], [1, {
        zoom: 1.02,
        foco: [540, 820]
      }]],
      piezas: GENTE.map(function (c, i) {
        var r = ROJAS[i];
        return {
          C: N.ICONOS.persona,
          s: 0.75,
          x: c[0],
          y: c[1],
          cuando: i ? 0.03 + i * 0.025 : null,
          fase: i * 0.1,
          p: r == null ? null : function (T, f) {
            return {
              color: T >= f(r) ? C.RED : BLANCO
            };
          },
          vibra: false
        };
      }),
      lienzo: function (T, f) {
        return /*#__PURE__*/React.createElement("g", null, Object.keys(ROJAS).map(function (k) {
          var c = GENTE[k];
          return /*#__PURE__*/React.createElement(V.Brillo, {
            key: k,
            T: T,
            c: [c[0] + 90, c[1] + 90],
            r: 90,
            color: C.RED,
            v: animate({
              from: 0,
              to: 0.8,
              start: f(ROJAS[k]),
              end: f(ROJAS[k] + 0.06)
            })(T)
          });
        }));
      },
      r1: {
        text: '3 DE CADA 10',
        s: 1.3,
        cuando: 0.06
      },
      r2: {
        text: 'TRASTORNO POR CONSUMO',
        cuando: 0.6
      }
    })
  }, {
    nombre: 'Mente',
    dur: 5,
    vo: 'En jóvenes y con mucho THC, sube el riesgo de ansiedad y de psicosis.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.06,
        foco: [540, 700]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      tor: {
        s: 0.6,
        x: 180,
        y: 640,
        boca: 'triste',
        extra: function (g, T, f) {
          return /*#__PURE__*/React.createElement(V.Gotas, {
            T: T,
            c: g.cabeza,
            v: animate({
              from: 0,
              to: 1,
              start: f(0.3),
              end: f(0.4)
            })(T)
          });
        }
      },
      piezas: [{
        C: P.Nube,
        s: 0.6,
        x: 354,
        y: 380,
        cuando: 0.14,
        p: {
          children: /*#__PURE__*/React.createElement(Garabato, null)
        }
      }, {
        C: P.Medidor,
        s: 0.95,
        x: 30,
        y: 440,
        cuando: 0.3,
        p: function (T, f) {
          return {
            p: animate({
              from: 0.95,
              to: 0.12,
              start: f(0.34),
              end: f(0.7)
            })(T)
          };
        }
      }],
      mal: [{
        x: 840,
        y: 470,
        cuando: 0.56,
        s: 0.55
      }],
      r1: {
        text: 'MÁS ANSIEDAD',
        s: 1.2,
        cuando: 0.06
      },
      r2: {
        text: 'RIESGO DE PSICOSIS',
        cuando: 0.52
      }
    })
  }, {
    nombre: 'Medicinal',
    dur: 5.5,
    vo: 'Hay quien usa marihuana medicinal para el dolor o para relajarse, pero con receta y control médico.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.04,
        foco: [540, 700]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      tor: {
        s: 0.6,
        x: 200,
        y: 640,
        boca: 'sonrisa'
      },
      piezas: [{
        C: N.ICONOS.receta,
        s: 1.05,
        x: 40,
        y: 380,
        cuando: 0.42
      }, {
        C: N.ICONOS.estetoscopio,
        s: 1.05,
        x: 790,
        y: 400,
        cuando: 0.56
      }, {
        C: N.ICONOS.capsula,
        s: 0.7,
        x: 70,
        y: 1080,
        cuando: 0.62,
        p: {
          color: C.GRN
        }
      }],
      bien: [{
        x: 860,
        y: 1160,
        cuando: 0.72,
        s: 0.7
      }],
      r1: {
        text: 'USO MEDICINAL',
        s: 1.2,
        cuando: 0.06
      },
      r2: {
        text: 'CON RECETA MÉDICA',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Sin humo',
    dur: 4,
    vo: 'Tu cuerpo rinde más sin humo: entrena, duerme y respira tranquilo.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.1,
        foco: [540, 760]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      pulsos: [0.3],
      tor: {
        s: 0.66,
        x: 144,
        y: 330,
        boca: 'sonrisa',
        flex: function (T, f) {
          return 0.3 + 0.7 * Easing.easeOutBack(animate({
            from: 0,
            to: 1,
            start: f(0.08),
            end: f(0.3)
          })(T));
        },
        extra: function (g, T, f) {
          return /*#__PURE__*/React.createElement(V.Chispa, {
            T: T,
            c: g.cabeza,
            cuando: f(0.3),
            r: 200
          });
        }
      },
      piezas: [{
        C: P.Pesa,
        s: 0.45,
        x: 20,
        y: 1150,
        cuando: 0.36
      }, {
        C: N.ICONOS.luna,
        s: 0.8,
        x: 836,
        y: 400,
        cuando: 0.46
      }, {
        C: N.ICONOS.pulmones,
        s: 0.8,
        x: 30,
        y: 400,
        cuando: 0.56,
        p: {
          humo: 0
        }
      }],
      bien: [{
        x: 860,
        y: 1150,
        cuando: 0.66,
        s: 0.7
      }],
      r1: {
        text: 'RINDE SIN HUMO',
        s: 1.2,
        cuando: 0.06
      }
    })
  }, {
    nombre: 'Di no',
    dur: 5,
    vo: 'Y si alguien te ofrece... ¡no, no y no! Di no a la marihuana.',
    C: EscParodia
  }];
  global.REELS.registrar({
    id: 'marihuana',
    titulo: 'Deja de fumar marihuana (estilo 2)',
    estilo: 2,
    escenas: ESCENAS
  });
})(window);
