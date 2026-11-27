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
  var XT = -0.7,
    XP = 0.7; // Tor a la izquierda, Passa a la derecha (separados: los brazos no se cruzan)
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
    nombre: 'Alto rendimiento',
    habla: 'passa',
    dur: 5.5,
    vo: 'Mira, ¿acaso eres atleta de alto rendimiento? Los BCAA le sirven más a atletas con un gasto calórico enorme, no a alguien que solo va a un gimnasio normal.'
  }, {
    nombre: 'La leucina',
    habla: 'tor',
    dur: 3.6,
    vo: 'Tampoco tanto: la leucina sí activa la síntesis de músculo.'
  }, {
    nombre: 'En la comida',
    habla: 'passa',
    dur: 8,
    vo: 'Sí, pero ya viene en la carne, el huevo y cualquier proteína. Ahora, si eres deportista de alto rendimiento o haces deportes exigentes como el ciclismo o el running, pueden ser una buena opción para ayudar a proteger tu masa muscular.'
  }, {
    nombre: 'El estudio',
    habla: 'tor',
    dur: 5.0,
    vo: 'En eso tiene razón: si ya comes suficiente proteína, los BCAA no te hacen crecer más.'
  }, {
    nombre: 'Placebo',
    habla: 'passa',
    dur: 4.5,
    vo: '¿Ves? Si ya comes bien, más no es mejor. Lo que sientes puede ser más placebo que otra cosa.'
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
    for (var i = 0; i < ESCENAS.length; i++) if (ESCENAS[i].habla === quien && b.entre(T, [i, 0], [i, 1])) return b.k(T, [i, 0.03], [i, 0.28], Easing.easeInOutSine) * (1 - b.k(T, [i, 0.8], [i, 1], Easing.easeInOutSine));
    return 0;
  }
  // el marcador de la discusion: los puntos que se va llevando cada uno
  var PUNTOS = [[[4, 0.55], 'tor'], [[6, 0.3], 'passa'], [[9, 0.55], 'passa']];
  function Marcador(props) {
    var T = props.T,
      b = props.b;
    var e = M.pop(T, b.f(3, 0.02), 0.45),
      sl = A.sale(T, b.f(11, 0.22));
    var op = e.opacity * sl.opacity;
    if (op < 0.01) return null;
    var cuenta = {
        tor: 0,
        passa: 0
      },
      golpe = {
        tor: 0,
        passa: 0
      };
    PUNTOS.forEach(function (q) {
      var t0 = b.de(q[0]);
      A.sonido('pop', t0);
      if (T >= t0) {
        cuenta[q[1]]++;
        golpe[q[1]] = Math.max(golpe[q[1]], 1 - clamp((T - t0) / 0.45, 0, 1));
      }
    });
    var dy = M.life(T, 3.2, 4, 0.3);
    var dig = function (n, x, g, col) {
      var sc = 1 + 0.45 * Math.sin(Math.PI * g) * (g > 0 ? 1 : 0);
      return /*#__PURE__*/React.createElement("g", {
        transform: 'translate(' + x + ' 52) scale(' + sc.toFixed(3) + ')'
      }, /*#__PURE__*/React.createElement("text", {
        x: 0,
        y: 20,
        textAnchor: "middle",
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 56,
        fill: g > 0.05 ? col : '#ffffff'
      }, n));
    };
    return /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("g", {
      opacity: op,
      transform: 'translate(' + (600 + (1 - e.scale) * 60) + ' ' + (128 + dy) + ') scale(' + e.scale.toFixed(3) + ')'
    }, /*#__PURE__*/React.createElement("rect", {
      x: 8,
      y: 8,
      width: 440,
      height: 100,
      rx: 50,
      fill: C.YEL,
      stroke: C.INK,
      strokeWidth: 5
    }), /*#__PURE__*/React.createElement("rect", {
      x: 0,
      y: 0,
      width: 440,
      height: 100,
      rx: 50,
      fill: C.INK
    }), /*#__PURE__*/React.createElement("text", {
      x: 34,
      y: 64,
      fontFamily: "'Barlow Semi Condensed', sans-serif",
      fontWeight: 800,
      fontSize: 40,
      fill: C.YEL,
      letterSpacing: 2
    }, "TOR"), dig(cuenta.tor, 152, golpe.tor, C.YEL), /*#__PURE__*/React.createElement("text", {
      x: 204,
      y: 66,
      textAnchor: "middle",
      fontFamily: "'Archivo Black', sans-serif",
      fontSize: 44,
      fill: C.GRY
    }, ":"), dig(cuenta.passa, 256, golpe.passa, C.GRN), /*#__PURE__*/React.createElement("text", {
      x: 410,
      y: 64,
      textAnchor: "end",
      fontFamily: "'Barlow Semi Condensed', sans-serif",
      fontWeight: 800,
      fontSize: 40,
      fill: C.GRN,
      letterSpacing: 2
    }, "PASSA")));
  }
  // un signo de historieta encima de la cabeza ("!" de Tor enojado, "¿?" de Passa ofendido)
  function Signo(props) {
    var T = props.T,
      e = M.pop(T, props.cuando, 0.35);
    if (props.hasta != null) e = A.junta(e, A.sale(T, props.hasta));
    if (e.opacity < 0.01) return null;
    var c = props.c,
      v = M.vibra(T, 30, 3);
    return /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("g", {
      opacity: e.opacity,
      transform: 'translate(' + (c[0] + 80 + v).toFixed(1) + ' ' + (c[1] - 160).toFixed(1) + ') scale(' + (1.3 * e.scale).toFixed(3) + ')'
    }, /*#__PURE__*/React.createElement("circle", {
      cx: 0,
      cy: 0,
      r: 52,
      fill: "#ffffff",
      stroke: C.INK,
      strokeWidth: 8
    }), /*#__PURE__*/React.createElement("path", {
      d: "M -18 44 L -34 72 L 2 50 Z",
      fill: "#ffffff",
      stroke: C.INK,
      strokeWidth: 8,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("text", {
      x: 0,
      y: 22,
      textAnchor: "middle",
      fontFamily: "'Archivo Black', sans-serif",
      fontSize: props.texto.length > 1 ? 48 : 62,
      fill: props.color || C.RED
    }, props.texto)));
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
      rendimiento: 'amarillo',
      leucina: 'amarillo',
      ciclismo: 'verde',
      running: 'verde',
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
          lado: -1
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
      // ¡CALLATE! (la interrupcion) y los signos de cada uno
      r.push(/*#__PURE__*/React.createElement(PS.Grande, {
        key: "ca",
        T: T,
        cuando: b.f(1, 0.03),
        hasta: b.f(1, 0.3),
        text: "\xA1C\xC1LLATE!",
        color: "rojo",
        x: 540 + M.vibra(T, 30, 6),
        y: 600,
        px: 150
      }));
      if (b.entre(T, [2, 0.0], [3, 0.1])) r.push(/*#__PURE__*/React.createElement(Signo, {
        key: "s1",
        T: T,
        cuando: b.f(2, 0.05),
        hasta: b.f(2, 0.95),
        c: pr('cabeza', 0),
        texto: "!"
      }));
      if (b.entre(T, [10, 0.0], [11, 0.1])) r.push(/*#__PURE__*/React.createElement(Signo, {
        key: "s2",
        T: T,
        cuando: b.f(10, 0.05),
        hasta: b.f(10, 0.95),
        c: pr('cabeza', 1),
        texto: "\xBF?",
        color: C.INK
      }));
      r.push(/*#__PURE__*/React.createElement(Marcador, {
        key: "mc",
        T: T,
        b: b
      }));
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
      // alto rendimiento: a quien le sirven mas los BCAA
      r.push(/*#__PURE__*/React.createElement(PS.Tarjeta, {
        key: "ar",
        T: T,
        cuando: b.f(3, 0.12),
        hasta: b.f(4, 0.02),
        y: 290,
        w: 760,
        h: 250
      }, /*#__PURE__*/React.createElement(PS.Etiqueta, {
        x: 30,
        y: 58,
        text: "ATLETA DE ALTO RENDIMIENTO",
        fondo: C.YEL,
        color: C.INK
      }), /*#__PURE__*/React.createElement("text", {
        x: 30,
        y: 136,
        fontFamily: "'Barlow Semi Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 46,
        fill: C.INK
      }, "GASTO CAL\xD3RICO ENORME"), /*#__PURE__*/React.createElement("text", {
        x: 30,
        y: 210,
        fontFamily: "'Barlow Semi Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 46,
        fill: C.RED
      }, "GIMNASIO NORMAL: NO TANTO")));
      if (b.entre(T, [3, 0.3], [4, 0.05])) r.push(/*#__PURE__*/React.createElement(A.Bien, {
        key: "arb",
        T: T,
        cuando: b.f(3, 0.34),
        hasta: b.f(4, 0.02),
        x: 830,
        y: 300,
        s: 0.5
      }));
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
      [['carne', 0.06], ['huevo', 0.14], ['pollo', 0.22]].forEach(function (q, i) {
        r.push(/*#__PURE__*/React.createElement(Icono, {
          key: 'co' + i,
          T: T,
          comp: N.COMIDA[q[0]],
          cuando: b.f(5, q[1]),
          hasta: b.f(5, 0.4),
          x: 140 + 280 * i,
          y: 330,
          s: 0.85,
          fase: i * 0.5
        }));
      });
      // deportistas de alto rendimiento y de resistencia: ahi si pueden ayudar
      r.push(/*#__PURE__*/React.createElement(PS.Tarjeta, {
        key: "ci",
        T: T,
        cuando: b.f(5, 0.44),
        hasta: b.f(6, 0.02),
        y: 290,
        w: 760,
        h: 250
      }, /*#__PURE__*/React.createElement(PS.Etiqueta, {
        x: 30,
        y: 58,
        text: "CICLISMO",
        fondo: C.GRN,
        color: "#ffffff"
      }), /*#__PURE__*/React.createElement(PS.Etiqueta, {
        x: 300,
        y: 58,
        text: "RUNNING",
        fondo: C.GRN,
        color: "#ffffff"
      }), /*#__PURE__*/React.createElement("text", {
        x: 30,
        y: 136,
        fontFamily: "'Barlow Semi Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 46,
        fill: C.INK
      }, "DEPORTES MUY EXIGENTES"), /*#__PURE__*/React.createElement("text", {
        x: 30,
        y: 210,
        fontFamily: "'Barlow Semi Condensed', sans-serif",
        fontWeight: 800,
        fontSize: 46,
        fill: C.GRN
      }, "AYUDAN A CUIDAR EL M\xDASCULO")));
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
      vo: 'Compártelo con tu compañero de entreno, y síguenos a los dos.'
    },
    // colaboracion: Passa tambien en la escena de accion (en 2D) y sus redes en el cierre
    colabora: {
      titulo: ['PASSA', 'TRAINER'],
      arroba: '@passa_trainer',
      redes: ['instagram', 'tiktok']
    },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
