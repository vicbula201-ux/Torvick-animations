/* GENERADO por compilar.js desde tor-passa.jsx — no editar a mano. */
/* ============================================================
   TOR x PASSA — colaboracion con Passa Trainer (Edgar Martinez, @passa_trainer)
   Plano secuencia (PS) con dos personajes y dos voces: Tor empieza a explicar
   los BCAA, Passa cae de un salto, lo interrumpe con su saludo ("¿Que la
   Kentucky, mi gente? Aqui les saluda el Passa") y discuten: Passa dice que es
   botar la plata, Tor matiza (la leucina), Passa: ya vienen en la comida; Tor
   le da la razon con el estudio; Passa: mejor creatina. Cierra con el debate:
   ¿quien gano, Tor o el Passa?
   Basado en el clip del podcast "Aprendiendo a ser humano" (Victor y Edgar).
   Evidencia: Plotkin DL, Delcastillo K, Van Every DW, Tipton KD, Aragon AA,
   Schoenfeld BJ. Isolated leucine and branched-chain amino acid supplementation
   for enhancing muscular strength and hypertrophy: a narrative review. Int J
   Sport Nutr Exerc Metab. 2021;31(3):292-301 (con suficiente proteina en la
   dieta, los BCAA no suman musculo ni fuerza). Wolfe RR. Branched-chain amino
   acids and muscle protein synthesis in humans: myth or reality? J Int Soc
   Sports Nutr. 2017;14:30. Creatina: Kreider RB y col., ISSN, 2017.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    V = global.V,
    E3 = global.E3,
    PS = global.PS,
    N = global.N,
    P = global.P,
    A = global.REELS.ayudas;
  var Easing = global.Easing,
    clamp = global.clamp;
  var C = P.C;
  var XT = -0.45,
    XP = 0.45; // Tor a la izquierda, Passa a la derecha
  var ZONA_TARJETA = [70, 640, 1010, 1330];
  var ESCENAS = [{
    nombre: 'Tor empieza',
    habla: 'tor',
    dur: 3.6,
    vo: '¿Los BCAA te ayudan a ganar músculo? Hoy te voy a explicar...'
  }, {
    nombre: 'Passa interrumpe',
    habla: 'passa',
    dur: 5.0,
    vo: '¡Cállate, Tor, que aquí hablo yo! ¿Qué la Kentucky, mi gente? Aquí les saluda el Passa.'
  }, {
    nombre: 'Tor se queja',
    habla: 'tor',
    dur: 1.8,
    vo: 'Oye, este es mi video...'
  }, {
    nombre: 'Botar la plata',
    habla: 'passa',
    dur: 3.6,
    vo: 'Mira, comprar BCAA es botar la plata. Eso es pura moda.'
  }, {
    nombre: 'La leucina',
    habla: 'tor',
    dur: 3.6,
    vo: 'Tampoco tanto: la leucina sí activa la síntesis de músculo.'
  }, {
    nombre: 'En la comida',
    habla: 'passa',
    dur: 3.8,
    vo: 'Sí, pero ya viene en la carne, el huevo y cualquier proteína.'
  }, {
    nombre: 'El estudio',
    habla: 'tor',
    dur: 5.0,
    vo: 'En eso tiene razón: si ya comes suficiente proteína, los BCAA no te hacen crecer más.'
  }, {
    nombre: 'Placebo',
    habla: 'passa',
    dur: 3.8,
    vo: '¿Ves? Más tampoco es mejor. Lo que sientes es puro efecto placebo.'
  }, {
    nombre: 'Creatina',
    habla: 'passa',
    dur: 4.0,
    vo: 'Mejor gástate esas ochenta lucas en creatina. ¡Pare de contar historias!'
  }, {
    nombre: 'Por una vez',
    habla: 'tor',
    dur: 2.2,
    vo: 'Por una vez, el Passa tiene razón.'
  }, {
    nombre: '¿Cómo que por una vez?',
    habla: 'passa',
    dur: 1.8,
    vo: '¿Cómo que por una vez?'
  }, {
    nombre: 'Debate final',
    habla: 'tor',
    dur: 4.0,
    vo: '¿Quién ganó, Tor o el Passa? Te leemos en los comentarios.'
  }];
  // escena en la que habla cada uno (para los gestos)
  function habla(b, T, quien) {
    for (var i = 0; i < ESCENAS.length; i++) if (ESCENAS[i].habla === quien && b.entre(T, [i, 0], [i, 1])) return b.k(T, [i, 0.02], [i, 0.18]) * (1 - b.k(T, [i, 0.85], [i, 1]));
    return 0;
  }
  // un icono 2D (de N) que entra con rebote y se va
  function Icono(props) {
    var T = props.T,
      e = M.pop(T, props.cuando, 0.42);
    if (props.hasta != null) e = A.junta(e, A.sale(T, props.hasta));
    if (e.opacity < 0.01) return null;
    var Comp = props.comp;
    return /*#__PURE__*/React.createElement(A.Pos, {
      x: props.x,
      y: props.y,
      e: e,
      dy: M.life(T, 2.8, 8, props.fase || 0)
    }, /*#__PURE__*/React.createElement(Comp, {
      s: props.s || 0.8,
      color: props.color
    }), props.texto ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -60,
        top: (props.s || 0.8) * 240 * 0.98,
        width: (props.s || 0.8) * 240 + 120,
        textAlign: 'center',
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 44,
        color: '#ffffff',
        WebkitTextStroke: '10px ' + C.INK,
        paintOrder: 'stroke fill'
      }
    }, props.texto) : null);
  }
  PS.video({
    id: 'tor-passa',
    titulo: 'Tor x Passa: ¿los BCAA sirven? (colaboración)',
    escenas: ESCENAS,
    hablantes: {
      tor: {
        nombre: 'TOR',
        color: 'amarillo'
      },
      passa: {
        nombre: 'PASSA',
        color: 'verde'
      }
    },
    claves: {
      bcaa: 'rojo',
      plata: 'rojo',
      moda: 'rojo',
      leucina: 'amarillo',
      creatina: 'verde',
      placebo: 'rojo',
      razon: 'verde'
    },
    camara: [[[0, 0], {
      az: 6,
      el: 4,
      dist: 3.4,
      y: 1.45,
      dx: 0
    }], [[0, 0.9], {
      az: 0,
      el: 4,
      dist: 3.6,
      y: 1.42,
      dx: 0
    }], [[1, 0.25], {
      az: 6,
      el: 6,
      dist: 5.6,
      y: 1.05,
      dx: 0.1
    }], [[1, 0.9], {
      az: -8,
      el: 6,
      dist: 5.2,
      y: 1.08,
      dx: 0.25
    }], [[2, 0.9], {
      az: 10,
      el: 6,
      dist: 5.4,
      y: 1.05,
      dx: -0.2
    }], [[3, 0.9], {
      az: -12,
      el: 6,
      dist: 5.6,
      y: 1.05,
      dx: 0.2
    }], [[4, 0.9], {
      az: 14,
      el: 8,
      dist: 5.6,
      y: 1.05,
      dx: -0.2
    }], [[5, 0.9], {
      az: -14,
      el: 6,
      dist: 5.8,
      y: 1.05,
      dx: 0.15
    }], [[6, 0.9], {
      az: 10,
      el: 8,
      dist: 6.0,
      y: 1.05,
      dx: 0
    }], [[8, 0.9], {
      az: -16,
      el: 6,
      dist: 5.6,
      y: 1.05,
      dx: 0.2
    }], [[10, 0.9], {
      az: 8,
      el: 6,
      dist: 5.4,
      y: 1.08,
      dx: 0
    }], [[11, 1], {
      az: 0,
      el: 4,
      dist: 5.0,
      y: 1.12,
      dx: 0
    }]],
    libre: [[[0, 0], [0, 0.85]]],
    golpes: [[1, 0.12], [11, 0.72]],
    zona: function (T, b) {
      // desde que empiezan a discutir, arriba queda lugar para las tarjetas y los iconos
      return T < b.f(3, 0) ? [70, 420, 1010, 1330] : ZONA_TARJETA;
    },
    vista: function (T, b, cam, ex) {
      var abreT = ex && ex.abreDe ? ex.abreDe('tor') : 0,
        abreP = ex && ex.abreDe ? ex.abreDe('passa') : 0;
      var figs = [];
      // ---- Tor: empieza solo en el medio; Passa lo empuja a la izquierda
      var empuje = b.k(T, [1, 0.08], [1, 0.24], Easing.easeOutCubic);
      var xt = XT * empuje;
      var t = PS.depie(T, {
          x: xt,
          gesto: habla(b, T, 'tor'),
          lado: 1
        }),
        caraT = PS.boca(abreT),
        musT = null,
        miraT = 0.9;
      if (T < b.f(1, 0)) caraT.cejas = 'alzadas';else if (T < b.f(2, 0)) {
        // lo empujan: trastabilla y mira a Passa con la boca abierta
        t.tronco = [4, 0, -10 * Math.sin(Math.PI * empuje)];
        caraT = {
          ojos: 'grandes',
          boca: abreT > 0.07 ? 'habla' : 'o',
          abre: abreT,
          cerrada: 'o'
        };
        miraT = 0.2;
        t.cabeza = [0, 35, 0];
      } else if (T < b.f(3, 0)) {
        // "este es mi video": brazos cruzados, enojado
        t.manoI = [xt + 0.16, 1.2, 0.28];
        t.manoD = [xt - 0.16, 1.16, 0.3];
        t.codoI = [0.6, -0.4, -0.2];
        t.codoD = [0.6, -0.4, -0.2];
        caraT.cejas = 'enojo';
        miraT = 0.6;
      } else if (T < b.f(4, 0)) {
        t.cabeza = [0, 30, 0];
        miraT = 0;
        caraT = {
          boca: 'recta',
          cejas: 'enojo'
        };
      } else if (T < b.f(5, 0)) {
        // la leucina: saca biceps
        var fl = b.k(T, [4, 0.1], [4, 0.4], Easing.easeOutBack);
        var pf = E3.poseFlex(fl, {
          cadera: [xt, 1.0, 0],
          pieI: [xt - 0.2, 0.115, 0.02],
          pieD: [xt + 0.2, 0.115, 0.02]
        });
        t = pf;
        musT = {
          biceps: true,
          brillo: 0.4 * fl
        };
        miraT = 0.9;
      } else if (b.entre(T, [9, 0], [10, 0])) {
        // "por una vez": se encoge de hombros
        var sh = b.k(T, [9, 0.05], [9, 0.3], Easing.easeOutBack);
        t.hombros = {
          sube: 0.7 * sh
        };
        t.manoI = E3.lerp3(t.manoI, [xt - 0.45, 1.15, 0.25], sh);
        t.manoD = E3.lerp3(t.manoD, [xt + 0.45, 1.15, 0.25], sh);
        t.codoI = [1, -0.5, -0.2];
        t.codoD = [1, -0.5, -0.2];
      } else if (T >= b.f(11, 0)) {
        PS.senalar(t, cam, b.k(T, [11, 0.05], [11, 0.25]) * (1 - b.k(T, [11, 0.5], [11, 0.65])), 1);
        caraT.cejas = 'alzadas';
        miraT = 1;
      } else if (habla(b, T, 'passa') > 0) {
        t.cabeza = [0, 28, 0];
        miraT = 0.15;
      }
      PS.mirarCamara(t, cam, miraT);
      figs.push({
        quien: 'tor',
        pose: t,
        musc: musT,
        cara: caraT
      });
      // ---- Passa: cae de un salto desde la derecha y se planta
      if (T >= b.f(1, 0) - 0.05) {
        var sal = b.k(T, [1, 0], [1, 0.12]),
          aterriza = b.k(T, [1, 0.12], [1, 0.2]) * (1 - b.k(T, [1, 0.2], [1, 0.3]));
        var xp = XP + 2.4 * (1 - Easing.easeOutQuad(sal)),
          hp = sal < 1 ? 1.1 * Math.sin(Math.PI * sal) : 0;
        var p = PS.depie(T + 1.7, {
            x: xp,
            gesto: habla(b, T, 'passa'),
            lado: 1
          }),
          caraP = PS.boca(abreP, 'recta'),
          miraP = 0.9;
        p.cadera[1] += hp - 0.16 * aterriza;
        p.pieI[1] += hp;
        p.pieD[1] += hp;
        p.rodillaI = [0.3, 0, 1];
        p.rodillaD = [0.3, 0, 1];
        caraP.cejas = 'enojo';
        if (sal < 1) {
          p.manoI = [xp - 0.5, 1.7 + hp, 0.1];
          p.manoD = [xp + 0.5, 1.7 + hp, 0.1];
        }
        if (b.entre(T, [1, 0.42], [2, 0])) {
          // el saludo: la mano arriba, saludando
          var sa = b.k(T, [1, 0.42], [1, 0.52]) * (1 - b.k(T, [1, 0.9], [2, 0]));
          p.manoD = E3.lerp3(p.manoD, [xp + 0.42, 1.85, 0.25 + 0.06 * Math.sin(T * 12)], sa);
          p.codoD = [0.6, -0.6, -0.2];
          caraP.cejas = 'alzadas';
        }
        if (b.entre(T, [3, 0], [4, 0]) || b.entre(T, [7, 0], [8, 0])) {
          // se rie de Tor y lo senala
          var se = b.k(T, b.entre(T, [3, 0], [4, 0]) ? [3, 0.5] : [7, 0.05], b.entre(T, [3, 0], [4, 0]) ? [3, 0.65] : [7, 0.2]);
          p.manoI = E3.lerp3(p.manoI, [xp - 0.55, 1.4, 0.3], se);
          p.codoI = [0.4, -0.8, -0.2];
          if (b.entre(T, [7, 0.4], [8, 0])) caraP = {
            boca: abreP > 0.07 ? 'habla' : 'dientes',
            abre: abreP,
            cerrada: 'dientes',
            cejas: 'alzadas'
          };
        }
        if (b.entre(T, [10, 0], [11, 0])) {
          // "¿como que por una vez?": manos en la cintura, ofendido, mirando a Tor
          p.manoI = [xp - 0.3, 1.06, -0.02];
          p.manoD = [xp + 0.3, 1.06, -0.02];
          p.codoI = [1, -0.1, -0.4];
          p.codoD = [1, -0.1, -0.4];
          p.cabeza = [0, -30, 0];
          caraP.cejas = 'enojo';
          miraP = 0.2;
        }
        if (T >= b.f(11, 0)) {
          PS.senalar(p, cam, b.k(T, [11, 0.5], [11, 0.68]) * (1 - b.k(T, [11, 0.84], [11, 0.98])), -1);
          caraP.cejas = 'alzadas';
          miraP = 1;
        } else if (habla(b, T, 'tor') > 0 && !b.entre(T, [4, 0], [5, 0])) {
          p.cabeza = [0, -28, 0];
          miraP = 0.15;
        }
        PS.mirarCamara(p, cam, miraP);
        figs.push({
          quien: 'passa',
          pose: p,
          cara: caraP
        });
      }
      return {
        figuras: figs,
        objetos: []
      };
    },
    lienzo: function (T, b, pr) {
      var r = [];
      if (b.entre(T, [1, 0.08], [1, 0.6])) r.push(/*#__PURE__*/React.createElement(V.Polvo, {
        key: "pv",
        T: T,
        c: pr([XP, 0.05, 0], 1),
        cuando: b.f(1, 0.12),
        n: 26,
        fuerza: 1.3,
        dura: 1.1
      }));
      if (b.entre(T, [4, 0.1], [5, 0])) r.push(/*#__PURE__*/React.createElement("g", {
        key: "br"
      }, E3.brilla(T, pr, ['m:biceps:1'], b.k(T, [4, 0.1], [4, 0.35]), true, 60)));
      return /*#__PURE__*/React.createElement("g", null, r);
    },
    encima: function (T, b, pr) {
      var r = [];
      // titulo de la colaboracion
      var tit = b.k(T, [1, 0.15], [1, 0.25]) * (1 - b.k(T, [2, 0.85], [3, 0.05]));
      if (tit > 0.01) r.push(/*#__PURE__*/React.createElement("div", {
        key: "tit",
        style: {
          position: 'absolute',
          inset: 0,
          opacity: tit
        }
      }, /*#__PURE__*/React.createElement(E3.Rot, {
        T: T,
        text: "TOR *\xD7* PASSA",
        y: 262,
        s: 1.2,
        cuando: b.f(1, 0.15)
      })));
      // el bote de BCAA (el tema)
      r.push(/*#__PURE__*/React.createElement(Icono, {
        key: "bc",
        T: T,
        comp: N.ICONOS.bote,
        color: C.RED,
        texto: "BCAA",
        cuando: b.f(0, 0.12),
        hasta: b.f(1, 0.1),
        x: 720,
        y: 380,
        s: 0.95
      }));
      // botar la plata: los billetes vuelan al tacho
      if (b.entre(T, [3, 0], [4, 0.1])) {
        var TachoAbierto = function (pp) {
          return /*#__PURE__*/React.createElement(global.MU.Tacho, {
            s: pp.s,
            tapa: 1
          });
        };
        r.push(/*#__PURE__*/React.createElement(Icono, {
          key: "ta",
          T: T,
          comp: TachoAbierto,
          cuando: b.f(3, 0.12),
          hasta: b.f(4, 0.02),
          x: 740,
          y: 300,
          s: 0.95
        }));
        [0, 1, 2].forEach(function (i) {
          var u = clamp((T - b.f(3, 0.2 + 0.1 * i)) / 0.6, 0, 1);
          if (u <= 0 || u >= 1) return;
          var x = 240 + (820 - 240) * u,
            y = 560 - 300 * Math.sin(Math.PI * u) - 60 * u;
          r.push(/*#__PURE__*/React.createElement(A.Pos, {
            key: 'bi' + i,
            x: x - 110,
            y: y - 80,
            e: {
              opacity: 1 - u * 0.2,
              scale: 1 - 0.45 * u
            }
          }, /*#__PURE__*/React.createElement(N.ICONOS.billete, {
            s: 0.9
          })));
        });
      }
      // la leucina
      r.push(/*#__PURE__*/React.createElement(PS.Tarjeta, {
        key: "le",
        T: T,
        cuando: b.f(4, 0.15),
        hasta: b.f(5, 0.0),
        y: 300,
        w: 640,
        h: 170
      }, /*#__PURE__*/React.createElement(PS.Etiqueta, {
        x: 30,
        y: 58,
        text: "LEUCINA",
        fondo: C.YEL,
        color: C.INK
      }), /*#__PURE__*/React.createElement("text", {
        x: 30,
        y: 140,
        fontFamily: "'Barlow Semi Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 50,
        fill: C.INK
      }, "ACTIVA LA S\xCDNTESIS")));
      // ya viene en la comida
      [['carne', 0.12], ['huevo', 0.3], ['pollo', 0.48]].forEach(function (q, i) {
        r.push(/*#__PURE__*/React.createElement(Icono, {
          key: 'co' + i,
          T: T,
          comp: N.COMIDA[q[0]],
          cuando: b.f(5, q[1]),
          hasta: b.f(6, 0.02),
          x: 140 + 280 * i,
          y: 330,
          s: 0.85,
          fase: i * 0.5
        }));
      });
      r.push(/*#__PURE__*/React.createElement(PS.Estudio, {
        key: "es",
        T: T,
        cuando: b.f(6, 0.12),
        hasta: b.f(7, 0.02),
        autor: "Plotkin y col., 2021",
        detalle: "Revisi\xF3n \xB7 BCAA y leucina"
      }));
      // placebo y creatina
      r.push(/*#__PURE__*/React.createElement(Icono, {
        key: "pl",
        T: T,
        comp: N.ICONOS.capsula,
        color: C.GRY,
        texto: "PLACEBO",
        cuando: b.f(7, 0.45),
        hasta: b.f(8, 0.05),
        x: 420,
        y: 300,
        s: 0.9
      }));
      r.push(/*#__PURE__*/React.createElement(Icono, {
        key: "cr",
        T: T,
        comp: N.ICONOS.bote,
        color: C.GRN,
        texto: "CREATINA",
        cuando: b.f(8, 0.2),
        hasta: b.f(9, 0.05),
        x: 420,
        y: 290,
        s: 1.0
      }));
      if (b.entre(T, [8, 0.5], [9, 0.1])) r.push(/*#__PURE__*/React.createElement(A.Bien, {
        key: "ok",
        T: T,
        cuando: b.f(8, 0.55),
        hasta: b.f(9, 0.05),
        x: 700,
        y: 330,
        s: 0.6
      }));
      // el debate y las dos cuentas
      r.push(/*#__PURE__*/React.createElement(PS.Encuesta, {
        key: "en",
        T: T,
        cuando: b.f(11, 0.3),
        pregunta: "\xBFQUI\xC9N GAN\xD3?",
        a: {
          text: 'TOR',
          color: 'amarillo'
        },
        b: {
          text: 'PASSA',
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
      var r = [];
      // la presentacion de Passa (abajo, como en la tele)
      var e = M.pop(T, b.f(1, 0.5), 0.45),
        sl = A.sale(T, b.f(2, 0.6));
      var op = e.opacity * sl.opacity;
      if (op > 0.01) r.push(/*#__PURE__*/React.createElement("svg", {
        key: "np",
        width: 1080,
        height: 1920,
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          overflow: 'visible'
        }
      }, /*#__PURE__*/React.createElement("g", {
        opacity: op,
        transform: 'translate(' + (60 + (1 - e.opacity) * -80) + ' 1170)'
      }, /*#__PURE__*/React.createElement("rect", {
        x: 10,
        y: 10,
        width: 520,
        height: 120,
        rx: 18,
        fill: C.GRN,
        stroke: C.INK,
        strokeWidth: 6
      }), /*#__PURE__*/React.createElement("rect", {
        x: 0,
        y: 0,
        width: 520,
        height: 120,
        rx: 18,
        fill: C.INK
      }), /*#__PURE__*/React.createElement("text", {
        x: 28,
        y: 58,
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 46,
        fill: "#ffffff"
      }, "PASSA TRAINER"), /*#__PURE__*/React.createElement("text", {
        x: 28,
        y: 98,
        fontFamily: "'Barlow Semi Condensed', sans-serif",
        fontWeight: 700,
        fontSize: 32,
        fill: C.YEL
      }, "@passa_trainer \xB7 entrenador personal"))));
      if (b.entre(T, [11, 0.6], [12, 0])) {
        var c = pr('manoI', 1);
        r.push(/*#__PURE__*/React.createElement("svg", {
          key: "tq",
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
          cuando: b.f(11, 0.7),
          x: c[0],
          y: c[1]
        })));
      }
      A.sonido('golpe', b.f(1, 0.12)); // el aterrizaje de Passa
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0
        }
      }, r);
    },
    accion: {
      dur: 4.6,
      pregunta: '¿TOR O PASSA?',
      vo: 'Compártelo con el que todavía compra BCAA, y síguenos a los dos.'
    },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
