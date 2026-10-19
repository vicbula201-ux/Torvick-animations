/* GENERADO por compilar.js desde largos/disciplina/plan.jsx — no editar a mano. */
/* ============================================================
   DISCIPLINA — reedicion completa con el estilo nuevo de los videos largos

   Fuente: el video ya publicado (largos/disciplina/media/fuente.mp4). Como trae
   la edicion vieja encima, el plan:
     - tapa CADA inserto viejo (las animaciones de palitos) con una escena nueva
       que cubre de a - H a b + H (los cortes de la edicion vieja estan en
       fuente-tramos.json, los saco con herramientas/tramos.py);
     - conserva los clips de archivo que funcionan (p.mantener) y les pone textos;
     - esconde las placas de texto viejas sobre la camara con un primer plano
       (tapar) que las deja fuera de cuadro, y encima va el texto nuevo.
   Con el video crudo (sin edicion) nada de esto hace falta: solo el plan.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var L = global.LARGOS,
    E = L.E,
    X = L.X,
    p = L.plan;
  var t = L.buscador('disciplina');
  var H = 0.21; // media ventana de transicion: la escena cubre de a - H a b + H

  // escena que cubre el inserto viejo [a, b]
  function esc(a, b, C, props, o) {
    return p.escena(a - H, b + H, C, props, Object.assign({
      entra: 'barrido',
      sale: 'corte'
    }, o || {}));
  }
  // primer plano que deja fuera de cuadro las placas viejas de abajo
  function tapar(a, b, o) {
    return p.camara(a - 0.2, b + 0.2, Object.assign({
      zoom: 1.38,
      foco: [0.47, 0.36]
    }, o || {}));
  }
  // texto clave que aparece cuando se dice la frase
  function dice(frase, desde, dur, o, txt) {
    var a = t(frase, desde);
    return p.texto(a - 0.05, a + (dur || 1.8), txt || frase, Object.assign({
      estilo: 'palabras'
    }, o || {}));
  }
  function st(frase, desde, dur, n, o) {
    var a = t(frase, desde);
    return p.sticker(a - 0.1, a + (dur || 2), n, o);
  }

  /* =========================================================
     ESCENAS PROPIAS DE ESTE VIDEO
     ========================================================= */

  // "ignorar lo que quieres hoy para conseguir lo que quieres manana"
  function EscDefinicion(props) {
    var T = props.T;
    var cIgn = t('ignorar', 4),
      cHoy = t('hoy', 6),
      cPara = t('para poder', 7),
      cCon = t('conseguir', 7);
    var cMan = t('mañana', 9);
    return /*#__PURE__*/React.createElement(E.Papel, null, /*#__PURE__*/React.createElement(E.Resalta, {
      T: T,
      x: 960,
      y: 130,
      c: t('disciplina es', 4) - 0.1
    }, "LA DISCIPLINA ES\u2026"), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "mobile-phone",
      x: 400,
      y: 470,
      tam: 250,
      c: cIgn,
      rot: -8
    }), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "doughnut",
      x: 600,
      y: 560,
      tam: 200,
      c: cIgn + 0.25,
      rot: 10
    }), /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 500,
      y: 800,
      c: t('quieres', 5),
      dir: "ninguna"
    }, "Lo que quieres hoy"), /*#__PURE__*/React.createElement(E.Tacha, {
      T: T,
      x: 700,
      y: 330,
      c: cHoy
    }), /*#__PURE__*/React.createElement(E.Flecha, {
      T: T,
      de: [790, 520],
      a: [1150, 520],
      c: cPara,
      curva: -70
    }), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "trophy",
      x: 1450,
      y: 480,
      tam: 320,
      c: cCon
    }), /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 1450,
      y: 800,
      c: t('quieres', 8),
      dir: "ninguna"
    }, "Lo que quieres ma\xF1ana"), /*#__PURE__*/React.createElement(E.Check, {
      T: T,
      x: 1650,
      y: 320,
      c: cMan
    }));
  }

  // contra la corriente: flechas grises que van a la izquierda y la persona que nada a la derecha
  function EscCorriente(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var flechas = [];
    for (var r = 0; r < 4; r++) {
      for (var k = 0; k < 9; k++) {
        var x = ((k * 260 - (T - at) * 520 * (r % 2 ? 1.15 : 1)) % 2340 + 2340) % 2340 - 210;
        flechas.push(/*#__PURE__*/React.createElement("svg", {
          key: r + '-' + k,
          width: "160",
          height: "60",
          style: {
            position: 'absolute',
            left: x,
            top: 160 + r * 230,
            opacity: 0.55
          }
        }, /*#__PURE__*/React.createElement("path", {
          d: "M 150 30 L 20 30 M 52 6 L 18 30 L 52 54",
          fill: "none",
          stroke: "#C9C3B8",
          strokeWidth: "14",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        })));
      }
    }
    return /*#__PURE__*/React.createElement(E.Papel, null, flechas, /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "person-swimming",
      x: 900 + 60 * Math.sin((T - at) * 2),
      y: 540,
      tam: 330,
      c: f(0.02)
    }), /*#__PURE__*/React.createElement(E.Caja, {
      T: T,
      x: 960,
      y: 900,
      c: t('contra', 115)
    }, "CONTRA LA CORRIENTE"), /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 1500,
      y: 300,
      c: t('entorno', 119),
      dir: "izq"
    }, "Tu entorno te condiciona"));
  }

  // la evolucion: antes costaba sobrevivir; hoy no
  function EscEvolucion(props) {
    var T = props.T;
    var cA = props.at + 0.1,
      cI = t('supervivencia', 150),
      cE = t('esfuerzo que', 150),
      cP = t('cosas del pasado', 150);
    return /*#__PURE__*/React.createElement(E.Papel, null, /*#__PURE__*/React.createElement(E.Resalta, {
      T: T,
      x: 960,
      y: 110,
      c: cA,
      tam: 0.85
    }, "LA EVOLUCI\xD3N"), /*#__PURE__*/React.createElement(E.Flecha, {
      T: T,
      de: [200, 880],
      a: [1720, 880],
      c: cA,
      grosor: 16,
      dur: 1.2
    }), /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 250,
      y: 960,
      c: cA + 0.2,
      dir: "ninguna"
    }, "Antes"), /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 1660,
      y: 960,
      c: t('evolucionado', 148),
      dir: "ninguna"
    }, "Hoy"), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "bow-and-arrow",
      x: 330,
      y: 420,
      tam: 240,
      c: cI,
      rot: -10
    }), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "fire",
      x: 560,
      y: 520,
      tam: 200,
      c: cI + 0.3
    }), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "bison",
      x: 330,
      y: 680,
      tam: 190,
      c: cI + 0.5
    }), /*#__PURE__*/React.createElement(E.Tx, {
      T: T,
      x: 500,
      y: 250,
      c: cI,
      tam: 0.8
    }, "SUPERVIVENCIA"), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "person-climbing",
      x: 800,
      y: 560,
      tam: 230,
      c: cE
    }), /*#__PURE__*/React.createElement(E.Caja, {
      T: T,
      x: 620,
      y: 760,
      c: cP,
      fondo: "gris",
      tam: 0.75
    }, "COSAS DEL PASADO"), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "couch-and-lamp",
      x: 1350,
      y: 500,
      tam: 260,
      c: cP + 0.35
    }), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "mobile-phone",
      x: 1600,
      y: 420,
      tam: 190,
      c: cP + 0.55,
      rot: 10
    }), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "hamburger",
      x: 1580,
      y: 650,
      tam: 170,
      c: cP + 0.7
    }));
  }

  // la motivacion sube y baja: no sirve de apoyo
  function EscMotivacion(props) {
    var T = props.T;
    var c0 = props.at + 0.1,
      cv = t('así como viene', 208),
      cs = t('se va', 209);
    return /*#__PURE__*/React.createElement(X.Grafico, {
      T: T,
      at: props.at,
      dur: props.dur,
      c: c0,
      titulo: "LA MOTIVACI\xD3N",
      ejeX: "tiempo",
      ejeY: "ganas",
      curvas: [{
        puntos: [[0, 0.1], [0.12, 0.85], [0.24, 0.2], [0.36, 0.95], [0.5, 0.15], [0.62, 0.7], [0.74, 0.05], [1, 0.03]],
        color: 'amarillo',
        c: c0 + 0.1,
        dur: 2.6
      }],
      rotulos: [{
        x: 0.36,
        y: 1.08,
        txt: 'Viene',
        c: cv
      }, {
        x: 0.86,
        y: 0.22,
        txt: 'Y se va',
        c: cs,
        fondo: '#E03A2F'
      }],
      stickers: [{
        n: 'roller-coaster',
        x: 1650,
        y: 330,
        c: c0 + 0.2,
        tam: 230
      }]
    });
  }

  // placer inmediato: sube rapido y a la larga se hunde
  function EscPlacer(props) {
    var T = props.T;
    var c0 = props.at + 0.1,
      cl = t('a la larga', 228);
    return /*#__PURE__*/React.createElement(X.Grafico, {
      T: T,
      at: props.at,
      dur: props.dur,
      c: c0,
      titulo: "UNA VIDA DE PLACERES INMEDIATOS",
      ejeX: "tiempo",
      curvas: [{
        puntos: [[0, 0.3], [0.08, 0.95], [0.2, 0.7], [0.45, 0.4], [0.75, 0.18], [1, 0.04]],
        color: 'rojo',
        c: c0 + 0.2,
        dur: 3
      }],
      rotulos: [{
        x: 0.12,
        y: 1.1,
        txt: 'Placer ya',
        c: c0 + 0.4
      }, {
        x: 0.8,
        y: 0.32,
        txt: 'A la larga',
        c: cl,
        fondo: '#E03A2F'
      }],
      stickers: [{
        n: 'doughnut',
        px: 0.08,
        py: 0.8,
        c: c0 + 0.5,
        tam: 150
      }, {
        n: 'mobile-phone',
        px: 0.2,
        py: 0.9,
        c: c0 + 0.8,
        tam: 140
      }, {
        n: 'skull',
        px: 0.97,
        py: 0.3,
        c: cl + 0.4,
        tam: 170
      }]
    });
  }

  // primero lo dificil y despues la gloria
  function EscGloria(props) {
    var T = props.T;
    var c0 = Math.min(t('primero lo difícil', 236) - 0.3, props.at + 0.1),
      cg = t('gloria', 239);
    return /*#__PURE__*/React.createElement(X.Grafico, {
      T: T,
      at: props.at,
      dur: props.dur,
      c: c0,
      titulo: "PRIMERO LO DIF\xCDCIL",
      ejeX: "tiempo",
      curvas: [{
        puntos: [[0, 0.1], [0.3, 0.05], [0.55, 0.25], [0.8, 0.7], [1, 0.98]],
        color: 'verde',
        c: c0 + 0.2,
        dur: 2.6
      }],
      rotulos: [{
        x: 0.22,
        y: 0.3,
        txt: 'Trabajo duro',
        c: t('trabajo', 237)
      }, {
        x: 0.82,
        y: 1.12,
        txt: 'La gloria',
        c: cg,
        fondo: '#16A06A'
      }],
      stickers: [{
        n: 'person-lifting-weights',
        px: 0.15,
        py: 0.55,
        c: c0 + 0.4,
        tam: 170
      }, {
        n: 'trophy',
        px: 1.0,
        py: 0.86,
        c: cg,
        tam: 200
      }]
    });
  }

  // la energia del dia baja: lo pesado va primero, lo facil al final
  function EscEnergia(props) {
    var T = props.T,
      at = props.at;
    var fase2 = props.fase === 2;
    var c0 = fase2 ? at - 10 : at + 0.05;
    return /*#__PURE__*/React.createElement(X.Grafico, {
      T: T,
      at: props.at,
      dur: props.dur,
      c: c0,
      titulo: "TU ENERG\xCDA DURANTE EL D\xCDA",
      ejeX: "d\xEDa",
      curvas: [{
        puntos: [[0, 0.95], [0.25, 0.85], [0.5, 0.62], [0.75, 0.38], [1, 0.12]],
        color: 'amarillo',
        c: c0 + 0.1,
        dur: 1.4
      }],
      rotulos: [{
        x: 0.25,
        y: 0.98,
        txt: 'Lo difícil',
        c: fase2 ? c0 : props.cDificil,
        fondo: '#E03A2F'
      }].concat(fase2 ? [{
        x: 0.86,
        y: 0.4,
        txt: 'Lo fácil',
        c: props.cFacil,
        fondo: '#16A06A'
      }] : []),
      stickers: [{
        n: 'fire',
        px: 0.12,
        py: 0.98,
        c: fase2 ? c0 : props.cDificil,
        tam: 170
      }, {
        n: 'sunrise',
        x: 330,
        y: 960,
        c: c0 + 0.3,
        tam: 130
      }].concat(fase2 ? [{
        n: 'feather',
        px: 0.9,
        py: 0.26,
        c: props.cFacil,
        tam: 160
      }, {
        n: 'night-with-stars',
        x: 1590,
        y: 960,
        c: props.cFacil + 0.2,
        tam: 130
      }] : [])
    });
  }

  // no existe la perfeccion: una semana con dias si y dias no
  function EscSemana(props) {
    var T = props.T;
    var dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    var bien = [1, 1, 0, 1, 1, 0, 1];
    var c0 = t('puede que hayan días', 470) - 0.2;
    var cs = t('un día sí', 480),
      cn = t('un día no', 481);
    return /*#__PURE__*/React.createElement(E.Papel, null, /*#__PURE__*/React.createElement(E.Resalta, {
      T: T,
      x: 960,
      y: 130,
      c: c0
    }, "D\xCDAS PERFECTOS: NO EXISTEN"), dias.map(function (d, i) {
      var x = 960 + (i - 3) * 230,
        c = c0 + 0.35 + 0.18 * i;
      var marca = bien[i] ? i < 4 ? cs : cs + 0.4 : i < 4 ? cn - 0.5 : cn;
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, /*#__PURE__*/React.createElement(E.Tarjeta, {
        T: T,
        x: x,
        y: 470,
        w: 190,
        h: 210,
        c: c,
        quieto: true
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "'Archivo Black', sans-serif",
          fontSize: 92,
          color: '#14110F',
          textAlign: 'center',
          lineHeight: '190px'
        }
      }, d)), bien[i] ? /*#__PURE__*/React.createElement(E.Check, {
        T: T,
        x: x,
        y: 660,
        c: marca,
        tam: 110,
        mudo: i !== 0
      }) : /*#__PURE__*/React.createElement(E.Tacha, {
        T: T,
        x: x,
        y: 660,
        c: marca,
        tam: 110,
        mudo: i !== 2
      }));
    }), /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 760,
      y: 860,
      c: t('está bien', 476),
      tam: 1.2,
      dir: "ninguna"
    }, "Y eso est\xE1 bien"), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "ok-hand",
      x: 1180,
      y: 850,
      tam: 190,
      c: t('no pasa nada', 477)
    }), /*#__PURE__*/React.createElement(E.Caja, {
      T: T,
      x: 960,
      y: 985,
      c: t('esfuerces', 484),
      tam: 0.72
    }, "LO IMPORTANTE: QUE TE ESFUERCES"));
  }

  // ¿se acerca o se aleja de mis objetivos?
  function EscPregunta(props) {
    var T = props.T;
    var ca = t('se acerca', 524),
      cl = t('se aleja', 525);
    return /*#__PURE__*/React.createElement(E.Papel, null, /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "bullseye",
      x: 960,
      y: 500,
      tam: 330,
      c: ca - 0.5
    }), /*#__PURE__*/React.createElement(E.Flecha, {
      T: T,
      de: [260, 500],
      a: [740, 500],
      c: ca,
      color: "verde",
      grosor: 20
    }), /*#__PURE__*/React.createElement(E.Flecha, {
      T: T,
      de: [1180, 500],
      a: [1660, 380],
      c: cl,
      color: "rojo",
      grosor: 20,
      curva: -40
    }), /*#__PURE__*/React.createElement(E.Tx, {
      T: T,
      x: 480,
      y: 330,
      c: ca,
      color: "verde",
      tam: 1.1
    }, "\xBFME ACERCA"), /*#__PURE__*/React.createElement(E.Tx, {
      T: T,
      x: 1460,
      y: 680,
      c: cl,
      color: "rojo",
      tam: 1.1
    }, "O ME ALEJA?"), /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 960,
      y: 860,
      c: t('objetivos', 526),
      tam: 1.1,
      dir: "ninguna"
    }, "De mis objetivos"));
  }

  // 634 suscriptores y la meta de 700
  function EscMeta(props) {
    var T = props.T;
    var c6 = t('634', 596),
      c7 = t('700', 601);
    return /*#__PURE__*/React.createElement(E.Papel, null, /*#__PURE__*/React.createElement(E.Num, {
      T: T,
      x: 620,
      y: 420,
      c: c6 - 0.2,
      desde: 500,
      hasta: 634,
      dur: 0.9,
      tam: 1.6,
      color: "negro"
    }), /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 620,
      y: 590,
      c: c6 + 0.2,
      tam: 1.1,
      dir: "ninguna"
    }, "Suscriptores hoy"), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "bullseye",
      x: 1450,
      y: 400,
      tam: 260,
      c: c7 - 0.3
    }), /*#__PURE__*/React.createElement(E.Num, {
      T: T,
      x: 1450,
      y: 630,
      c: c7,
      desde: 634,
      hasta: 700,
      dur: 0.8,
      tam: 1.1,
      color: "amarillo"
    }), /*#__PURE__*/React.createElement(E.Barra, {
      T: T,
      x: 960,
      y: 860,
      w: 1300,
      h: 80,
      c: c7 - 0.1,
      desde: 634 / 700,
      hasta: 1,
      dur: 1.2,
      color: "verde"
    }), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "party-popper",
      x: 1700,
      y: 820,
      tam: 170,
      c: c7 + 1.4
    }));
  }

  // la calidad sube video a video
  function EscBarras(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var altos = [0.25, 0.4, 0.55, 0.72, 0.95];
    return /*#__PURE__*/React.createElement(E.Papel, null, /*#__PURE__*/React.createElement(E.Resalta, {
      T: T,
      x: 960,
      y: 120,
      c: f(0.02)
    }, "VIDEO A VIDEO"), altos.map(function (h, i) {
      var c = f(0.08 + 0.12 * i);
      var k = global.Easing.easeOutBack(global.clamp((T - c) / 0.45, 0, 1));
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: 'absolute',
          left: 480 + i * 210,
          bottom: 150,
          width: 150,
          height: (620 * h * k).toFixed(1) + 'px',
          background: i === 4 ? '#FFD400' : '#C9C3B8',
          border: '10px solid #14110F',
          borderRadius: '18px 18px 0 0',
          boxShadow: '0 10px 0 #14110F'
        }
      });
    }), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "clapper-board",
      x: 1600,
      y: 300,
      tam: 200,
      c: f(0.6),
      rot: 12
    }), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: "chart-increasing",
      x: 330,
      y: 330,
      tam: 200,
      c: f(0.3),
      rot: -10
    }));
  }

  /* =========================================================
     PLAN
     ========================================================= */

  var plan = [/* ---------------- INTRO ---------------- */
  dice('una sola frase', 0, 1.9, {
    pos: 'abajo',
    marcadas: ['frase']
  }, 'en una sola frase'), st('definir', 0, 2.6, 'thinking-face', {
    pos: [1500, 330],
    tam: 240
  }), tapar(3.4, 4.6, {
    mov: 'golpe'
  }), p.texto(t('sería la siguiente', 2) - 0.05, 4.7, 'sería la siguiente…', {
    estilo: 'palabras',
    color: 'amarillo'
  }), esc(4.6, 11.4, EscDefinicion, {}), st('mueres', 11, 2.2, 'drooling-face', {
    pos: [1480, 380],
    tam: 260
  }), dice('te mueres hacer', 11, 2.4, {
    marcadas: ['mueres']
  }, 'lo que te mueres por hacer'), esc(14.9, 18.8, X.Balanza, {
    titulo: 'EN EL FONDO LO SABES',
    hacia: 'izq',
    cGira: t('problemas', 16),
    izq: {
      n: 'anxious-face-with-sweat',
      txt: 'Problemas',
      c: t('problemas', 16) - 0.2,
      tam: 240
    },
    der: {
      n: 'grinning-face',
      txt: 'Felicidad',
      c: t('traerá', 15),
      tam: 200
    }
  }, {
    entra: 'pop'
  }), tapar(22.8, 23.8), dice('simplista', 20, 1.8, {
    color: 'amarillo'
  }, 'un poco simplista'), p.sticker(t('simplista', 20) - 0.1, 24.0, 'pinching-hand', {
    pos: [1480, 360],
    tam: 230
  }), esc(23.7, 26.9, X.Palabra, {
    texto: 'MUCHÍSIMOS, PERO\nMUCHÍSIMOS MÁS CONCEPTOS',
    marcadas: ['conceptos'],
    tam: 0.95,
    stickers: [{
      n: 'books',
      x: 300,
      y: 260,
      c: 24.0
    }, {
      n: 'brain',
      x: 1640,
      y: 280,
      c: 24.6
    }, {
      n: 'puzzle-piece',
      x: 330,
      y: 840,
      c: 25.2,
      tam: 200
    }, {
      n: 'light-bulb',
      x: 1600,
      y: 830,
      c: 25.8,
      tam: 210
    }]
  }, {
    entra: 'empuje'
  }), tapar(31.0, 32.2), dice('quédate en este video', 29, 2.4, {
    color: 'amarillo',
    marcadas: ['video']
  }), st('quédate', 29, 2.6, 'eyes', {
    pos: [1500, 360],
    tam: 230
  }), p.lista(34.4 - H, 43.9 + H, {
    titulo: 'En este video',
    items: [{
      texto: 'Cómo funciona la disciplina',
      ico: 'gear',
      t: t('cómo funciona', 33)
    }, {
      texto: 'Características de los disciplinados',
      ico: 'person-superhero',
      t: t('características', 35)
    }, {
      texto: 'Por qué deberías ser disciplinado',
      ico: 'red-question-mark',
      t: t('por qué deberías', 37)
    }, {
      texto: 'Cómo serlo en tu vida diaria',
      ico: 'spiral-calendar',
      t: t('cómo ser disciplinado', 40),
      check: t('vida diaria', 42)
    }],
    entra: 'barrido',
    sale: 'corte'
  }), p.camara(t('acompáñanos', 43) - 0.05, 45.4, {
    zoom: 1.22,
    foco: [0.47, 0.42],
    mov: 'golpe'
  }), /* ---------------- CAPITULO 1 ---------------- */
  p.capitulo(45.4 - H, 47.9 + H, {
    n: 1,
    de: 3,
    titulo: '¿Por qué cuesta tanto ser disciplinado?',
    ico: 'tired-face',
    corto: 'Por qué cuesta tanto',
    entra: 'barrido',
    sale: 'corte'
  }), p.mantener(49.0, 53.4), dice('mejorar nuestras vidas', 49, 2.2, {
    color: 'amarillo',
    marcadas: ['mejorar']
  }), tapar(53.4, 55.8), dice('presente', 53, 2.6, {
    marcadas: ['futuro.']
  }, 'presente y futuro'), esc(56.7, 60.9, X.Multitud, {
    titulo: 'MUY, PERO MUY POCAS PERSONAS',
    cols: 8,
    filas: 3,
    destacados: [{
      i: 10,
      c: t('pocas personas', 57),
      n: 'person-superhero'
    }, {
      i: 21,
      c: t('conscientes', 58),
      n: 'person-superhero'
    }]
  }), dice('esfuerzos y sacrificios', 60, 2.4, {
    marcadas: ['sacrificios']
  }), st('sacrificios', 60, 2.4, 'sweat-droplets', {
    pos: [1500, 360],
    tam: 220
  }), esc(63.6, 67.3, X.Fila, {
    con: ['+', '='],
    items: [{
      n: 'person-lifting-weights',
      txt: 'Esfuerzo',
      c: 63.7
    }, {
      n: 'hourglass-not-done',
      txt: 'Sacrificio',
      c: 64.6
    }, {
      n: 'bullseye',
      txt: 'Objetivos',
      c: t('objetivos', 64)
    }]
  }, {
    entra: 'pop'
  }), esc(68.4, 73.6, X.Palabra, {
    texto: 'PAGAR ESE PRECIO',
    marcadas: ['precio'],
    tam: 1.15,
    stickers: [{
      n: 'person-shrugging',
      x: 1500,
      y: 790,
      c: t('poca gente', 68),
      tam: 260
    }, {
      n: 'money-with-wings',
      x: 420,
      y: 300,
      c: t('pagar', 69)
    }],
    rotulo: {
      txt: 'Muy poca gente está dispuesta',
      c: t('dispuesta', 69),
      y: 860,
      x: 720
    }
  }, {
    entra: 'empuje'
  }), p.escena(73.6 + H, 77.8 + H, X.Fila, {
    con: '→',
    items: [{
      n: 'person-running',
      txt: 'Vas por tu meta',
      c: 73.7
    }, {
      n: 'brick',
      txt: 'Dificultad',
      c: t('dificultad', 74)
    }, {
      n: 'white-flag',
      txt: 'Abandonan',
      c: t('abandonan', 76),
      tacha: t('abandonan', 76) + 0.2
    }]
  }, {
    entra: 'corte',
    sale: 'corte'
  }), p.escena(77.8 + H, 81.5 + H, X.Fila, {
    con: ['→', '='],
    items: [{
      n: 'index-pointing-at-the-viewer',
      txt: 'Tú',
      c: t('tú que estás', 77)
    }, {
      n: 'television',
      txt: 'Viendo este video',
      c: t('viendo este video', 78)
    }, {
      n: 'flexed-biceps',
      txt: 'Ya entrenas disciplina',
      c: t('entrenando', 80)
    }]
  }, {
    entra: 'corte'
  }), dice('extremadamente difícil', 82, 2, {
    color: 'rojo'
  }), esc(84.7, 87.8, X.Fila, {
    con: '→',
    items: [{
      n: 'brain',
      txt: 'Tu cerebro',
      c: t('obligas', 84)
    }, {
      n: 'laptop',
      txt: 'Videos como estos',
      c: t('videos como estos', 85)
    }]
  }, {
    entra: 'pop'
  }), p.mantener(90.0, 91.6), dice('placeres inmediatos', 89, 2, {
    color: 'amarillo'
  }), p.camara(91.6, 94.6, {
    mov: 'empuje',
    zoom: 1.04
  }), esc(94.6, 97.5, X.Palabra, {
    texto: 'ESFUERZO MENTAL DURO',
    marcadas: ['duro'],
    tam: 1.15,
    stickers: [{
      n: 'brain',
      x: 520,
      y: 300,
      c: 94.8,
      tam: 230
    }, {
      n: 'person-lifting-weights',
      x: 1420,
      y: 800,
      c: 95.6,
      tam: 230
    }]
  }, {
    entra: 'empuje'
  }), st('pendejadas', 98, 2.4, 'clown-face', {
    pos: [1500, 360],
    tam: 250
  }), dice('pendejadas', 98, 1.8, {
    color: 'rojo'
  }, 'pendejadas'), p.mantener(102.5, 106.1), p.rotulo(t('6x7', 101) - 0.05, 106.1, '6-7', {
    pos: [380, 160],
    tam: 1.3
  }), p.rotulo(t('aura farming', 102) - 0.05, 106.1, 'Aura farming', {
    pos: [1480, 160],
    tam: 1.3
  }), p.rotulo(t('novelas', 103) - 0.05, 106.1, 'Novelas de frutas con IA', {
    pos: 'abajo',
    tam: 1.3
  }), tapar(106.6, 109.0), dice('estupides', 106, 2, {
    color: 'rojo'
  }, 'estupideces'), st('estupides', 106, 2.4, 'face-with-rolling-eyes', {
    pos: [1500, 360],
    tam: 240
  }), esc(111.7, 115.6, X.Fila, {
    con: ['=', '+'],
    items: [{
      n: 'brain',
      txt: 'Tu cerebro',
      c: t('cerebro', 111)
    }, {
      n: 'smiling-face-with-heart-eyes',
      txt: 'Placer',
      c: t('placer', 112)
    }, {
      n: 'couch-and-lamp',
      txt: 'Confort',
      c: t('confort', 113)
    }]
  }, {
    entra: 'barrido'
  }), st('pensar', 115, 2.4, 'thinking-face', {
    pos: [1500, 360],
    tam: 230
  }), esc(119.4, 124.1, EscCorriente, {}, {
    entra: 'empuje',
    sale: 'corte'
  }), p.escena(124.1 + H, 137.6 + H, X.Alrededor, {
    centro: {
      n: 'person-standing',
      txt: 'TU ENTORNO',
      c: 124.4
    },
    cy: 470,
    rx: 660,
    ry: 300,
    items: [{
      n: 'people-hugging',
      txt: 'Amigos',
      c: t('amigos', 123)
    }, {
      n: 'house-with-garden',
      txt: 'Familia',
      c: t('familiares', 124)
    }, {
      n: 'folded-hands',
      txt: 'Creencias',
      c: t('creencias', 125)
    }, {
      n: 'baby',
      txt: 'Crianza',
      c: t('crianza', 126)
    }, {
      n: 'mobile-phone',
      txt: 'Redes sociales',
      c: t('redes sociales', 127)
    }, {
      n: 'hamburger',
      txt: 'Comida',
      c: t('comida', 128)
    }],
    extra: function (T) {
      return /*#__PURE__*/React.createElement(E.Caja, {
        T: T,
        x: 960,
        y: 985,
        c: t('no es tu culpa', 134),
        tam: 0.75,
        fondo: "blanco"
      }, "QUIZ\xC1S NO ES TU CULPA");
    }
  }, {
    entra: 'corte'
  }), p.mantener(139.5, 141.7), tapar(141.8, 143.4), dice('más o menos disciplinado', 141, 2, {
    marcadas: ['disciplinado.']
  }), p.mantener(145.0, 146.1), p.texto(t('nivel biológico', 144) - 0.05, 146.3, 'a nivel biológico', {
    color: 'amarillo',
    pos: 'abajo'
  }), esc(148.2, 158.9, EscEvolucion, {}, {
    entra: 'barrido'
  }), dice('no necesitas esforzarte', 158, 2.2, {
    marcadas: ['esforzarte']
  }), st('esforzarte', 158, 2.6, 'sloth', {
    pos: [1500, 360],
    tam: 260
  }), st('tortura', 162, 2.2, 'tired-face', {
    pos: [420, 360],
    tam: 230
  }), p.mantener(167.1, 170.0), p.rotulo(t('comida', 165) - 0.05, 170.0, 'Comida', {
    pos: [420, 180],
    tam: 1.3
  }), p.rotulo(t('refugio', 167) - 0.05, 170.0, 'Refugio', {
    pos: [960, 180],
    tam: 1.3
  }), p.rotulo(t('hogar', 168) - 0.05, 170.0, 'Hogar', {
    pos: [1500, 180],
    tam: 1.3
  }), p.mantener(172.0, 176.0), dice('alguien disciplinado', 172, 2.4, {
    color: 'amarillo'
  }), esc(176.0, 178.9, X.Multitud, {
    titulo: 'BASTANTE COMPLICADO',
    cols: 9,
    filas: 3,
    dx: 180,
    stickers: [{
      n: 'magnifying-glass-tilted-left',
      x: 1500,
      y: 560,
      c: 176.4,
      tam: 280
    }]
  }, {
    entra: 'pop'
  }), tapar(181.4, 182.6), dice('no existen', 180, 2.2, {
    color: 'amarillo'
  }, 'no quiere decir que no existan'), st('tú que estás', 182, 2.4, 'index-pointing-at-the-viewer', {
    pos: [1500, 380],
    tam: 250
  }), esc(184.3, 187.6, X.Fila, {
    con: '→',
    curva: -50,
    items: [{
      n: 'person-standing',
      txt: 'Tú',
      c: 184.5
    }, {
      n: 'person-superhero',
      txt: 'Una persona disciplinada',
      c: t('convertir', 185)
    }]
  }, {
    entra: 'barrido',
    sale: 'corte'
  }), /* ---------------- CAPITULO 2 ---------------- */
  p.capitulo(187.6 + H, 190.8 + H, {
    n: 2,
    de: 3,
    titulo: 'Características de una persona disciplinada',
    ico: 'person-superhero',
    corto: 'Características',
    entra: 'corte',
    sale: 'corte'
  }), dice('más diferencia', 190, 2.2, {
    color: 'amarillo'
  }, 'lo que más los diferencia'), esc(195.8, 200.6, X.Fila, {
    titulo: 'NO LES IMPORTA',
    con: '=',
    items: [{
      n: 'battery',
      txt: 'Motivados',
      c: t('estar o no', 197)
    }, {
      n: 'low-battery',
      txt: 'Sin motivación',
      c: t('no estar motivadas', 198) + 0.2
    }],
    abajo: {
      txt: 'IGUAL LO HACEN',
      c: t('motivadas', 199) + 0.3
    }
  }, {
    entra: 'barrido'
  }), tapar(204.2, 206.0), dice('progresar y mejorar', 203, 2.2, {
    color: 'verde'
  }), st('progresar', 203, 2.6, 'chart-increasing', {
    pos: [1500, 360],
    tam: 230
  }), esc(206.0, 211.3 - H, EscMotivacion, {}, {
    entra: 'barrido',
    sale: 'corte'
  }), p.cita(211.3, 217.3 + H, {
    texto: 'No actúes por emoción, actúa por deber.',
    autor: 'Marco Aurelio',
    ico: 'classical-building',
    marcadas: ['deber.'],
    entra: 'corte',
    sale: 'corte'
  }), esc(219.9, 224.0, X.Fila, {
    con: '→',
    cCon: [t('dependen', 221)],
    items: [{
      n: 'person-standing',
      txt: 'Tus acciones de hoy',
      c: t('acciones', 221)
    }, {
      n: 'person-superhero',
      txt: 'Tu yo del futuro',
      c: t('futuro yo', 219)
    }]
  }, {
    entra: 'pop'
  }), esc(225.5, 230.5, EscPlacer, {}, {
    entra: 'empuje'
  }), tapar(231.4, 233.0), dice('totalmente miserable', 230, 2, {
    color: 'rojo'
  }, 'vida miserable'), st('miserable', 230, 2.4, 'skull', {
    pos: [1500, 360],
    tam: 250
  }), tapar(236.2, 237.2, {
    mov: 'golpe'
  }), p.texto(t('todo lo contrario', 234) - 0.05, 237.4, 'todo lo contrario', {
    estilo: 'palabras',
    color: 'amarillo'
  }), p.escena(237.2 - H, t('mohamed', 241) - 0.15, EscGloria, {}, {
    entra: 'barrido',
    sale: 'empuje'
  }), p.cita(t('mohamed', 241) - 0.15, 254.2 + H, {
    texto: 'Odiaba cada segundo de mis entrenamientos, pero me repetía: no renuncies, sufre ahora y vive el resto de tu vida como un campeón.',
    autor: 'Muhammad Ali',
    ico: 'boxing-glove',
    marcadas: ['renuncies,', 'campeón.'],
    entra: 'empuje',
    sale: 'corte'
  }), st('redundancia', 255, 2.4, 'grinning-squinting-face', {
    pos: [1500, 360],
    tam: 240
  }), p.camara(t('sería', 257) - 0.1, 259.8, {
    zoom: 1.2,
    foco: [0.47, 0.4],
    mov: 'golpe'
  }), esc(259.8, 263.5, X.Palabra, {
    fondo: 'negro',
    texto: 'RESPETO\nPOR TI MISMO',
    marcadas: ['respeto'],
    tam: 1.3,
    stickers: [{
      n: 'crown',
      x: 1560,
      y: 280,
      c: 260.4,
      rot: 12
    }]
  }, {
    entra: 'barrido'
  }), esc(266.1, 271.0, X.Fila, {
    con: '+',
    items: [{
      n: 'person-standing',
      txt: 'Tú',
      c: 266.3
    }, {
      n: 'gear',
      txt: 'Motor interno',
      c: t('interno', 266)
    }],
    abajo: {
      txt: 'NO ERES COMO LOS DEMÁS',
      c: t('no eres como', 267)
    }
  }, {
    entra: 'pop'
  }), p.mantener(271.0, 275.7), dice('grupo exclusivo', 271, 2.4, {
    color: 'amarillo'
  }), st('exclusivo', 271, 2.6, 'crown', {
    pos: [1500, 330],
    tam: 230
  }), esc(277.7, 282.1, X.Fila, {
    titulo: 'CONGRUENCIA',
    con: '=',
    items: [{
      n: 'thought-balloon',
      txt: 'Pensamientos',
      c: t('pensamientos', 277)
    }, {
      n: 'flexed-biceps',
      txt: 'Acciones',
      c: t('acciones', 278)
    }]
  }, {
    entra: 'barrido'
  }), tapar(282.2, 283.4), dice('dichos objetivos', 281, 1.8, {
    color: 'amarillo'
  }), st('objetivos', 281, 2, 'bullseye', {
    pos: [1500, 360],
    tam: 220
  }), esc(284.9, 289.0, X.Palabra, {
    texto: 'DEPENDE DE LO QUE\nHACES EL DÍA DE HOY',
    marcadas: ['hoy.'],
    tam: 1.05,
    stickers: [{
      n: 'person-superhero',
      x: 300,
      y: 260,
      c: 285.0,
      tam: 220
    }, {
      n: 'spiral-calendar',
      x: 1640,
      y: 820,
      c: 287.6,
      tam: 220
    }]
  }, {
    entra: 'empuje'
  }), p.rotulo(289.1, 291.3, 'Otra característica', {
    pos: [960, 160]
  }), p.mantener(291.3, 296.7), dice('orden excesivo', 291, 2.4, {
    color: 'amarillo'
  }), dice('milimétricamente', 296, 2.2, {}, 'milimétricamente medido'), st('milimétricamente', 296, 2.6, 'straight-ruler', {
    pos: [1500, 380],
    tam: 240
  }), p.mantener(300.7, 302.4), dice('obsesivas', 300, 1.8, {
    color: 'rojo'
  }), p.camara(302.4, 306.1, {
    mov: 'empuje',
    zoom: 1.04
  }), esc(306.1, 311.1, X.Multitud, {
    titulo: 'UNA PERSONA DE LA MEDIA',
    cols: 8,
    filas: 3,
    destacados: [{
      i: 12,
      c: t('dejar de ser', 306) + 0.3,
      n: 'person-superhero'
    }]
  }, {
    entra: 'barrido'
  }), tapar(313.6, 314.4), dice('no hacen', 311, 1.6, {
    color: 'rojo'
  }, 'no hacen'), esc(317.4, 321.5, X.Fila, {
    titulo: 'ROMPE LAS BARRERAS',
    con: '+',
    items: [{
      n: 'brick',
      txt: 'Físicas',
      c: t('físicas', 317)
    }, {
      n: 'brain',
      txt: 'Mentales',
      c: t('mentales', 318)
    }],
    extra: function (T) {
      return /*#__PURE__*/React.createElement(E.St, {
        T: T,
        n: "collision",
        x: 960,
        y: 500,
        tam: 300,
        c: t('mentales', 318) + 0.5
      });
    }
  }, {
    entra: 'pop'
  }), p.mantener(323.6, 326.5), dice('por qué te esfuerzas', 323, 2.4, {
    color: 'amarillo'
  }), st('por qué se esfuerzan', 327, 2.6, 'face-with-raised-eyebrow', {
    pos: [1500, 360],
    tam: 250
  }), dice('por qué se esfuerzan tanto', 327, 2.4, {}, '¿por qué se esfuerzan tanto?'), p.mantener(332.4, 336.5), dice('disfrutar la vida', 332, 2.2, {
    color: 'amarillo'
  }), esc(336.5, 341.0, X.Palabra, {
    texto: 'ESFORZARSE\nESFORZARSE\nESFORZARSE',
    tam: 0.95,
    stickers: [{
      n: 'face-exhaling',
      x: 1550,
      y: 300,
      c: 337.2,
      tam: 250
    }],
    rotulo: {
      txt: '¿Amargarse tanto la vida?',
      c: t('amargarse', 336),
      x: 960,
      y: 960
    }
  }, {
    entra: 'barrido',
    sale: 'corte'
  }), dice('la vida es una', 340, 1.8, {}, 'la vida es una'), esc(344.7, 349.7, X.Camino, {
    facil: {
      n: 'couch-and-lamp',
      txt: 'Camino fácil',
      c: t('camino fácil', 345),
      tacha: t('no van', 348)
    },
    dificil: {
      n: 'trophy',
      txt: 'Camino difícil',
      c: t('simplemente no van', 347)
    }
  }, {
    entra: 'barrido'
  }), dice('por qué no lo hacen', 350, 2, {}, '¿por qué no lo hacen?'), st('por qué no lo hacen', 350, 2.2, 'thinking-face', {
    pos: [1500, 360],
    tam: 230
  }), tapar(353.8, 355.0, {
    mov: 'golpe'
  }), dice('sencilla razón', 352, 1.8, {
    color: 'amarillo'
  }, 'una sencilla razón'), esc(357.5, 359.4, X.Palabra, {
    texto: 'EN MILÉSIMAS\nDE SEGUNDO',
    marcadas: ['milésimas'],
    tam: 1.2,
    stickers: [{
      n: 'stopwatch',
      x: 1600,
      y: 300,
      c: 357.6,
      tam: 230
    }]
  }, {
    entra: 'pop'
  }), esc(361.7, 369.6, X.Fila, {
    con: '+',
    items: [{
      n: 'memo',
      txt: 'Planes',
      c: t('planes', 359) + 0.05,
      tacha: t('echan a perder', 364)
    }, {
      n: 'bullseye',
      txt: 'Objetivos',
      c: t('objetivos', 360) + 0.05,
      tacha: t('echan a perder', 364) + 0.25
    }],
    abajo: {
      txt: 'POSTERGAN A ESA PERSONA',
      c: t('postergan', 365)
    }
  }, {
    entra: 'barrido'
  }), p.camara(t('muy bien', 371) - 0.1, t.fin('qué hago', 376) + 0.4, {
    zoom: 1.14,
    foco: [0.47, 0.42],
    bn: true,
    mov: 'golpe'
  }), st('bonitas palabras', 372, 2.8, 'face-with-rolling-eyes', {
    pos: [1500, 360],
    tam: 250
  }), dice('muy bonitas palabras', 372, 2.4, {}, 'muy bonitas palabras…'), dice('qué hago', 376, 2.2, {
    color: 'amarillo'
  }, '¿qué hago?'), st('qué hago', 376, 2.4, 'person-shrugging', {
    pos: [430, 380],
    tam: 250
  }), /* ---------------- CAPITULO 3 ---------------- */
  p.capitulo(379.8 - H, 382.3 + H, {
    n: 3,
    de: 3,
    titulo: '¿Cómo ser una persona disciplinada?',
    ico: 'toolbox',
    corto: 'Cómo ser disciplinado',
    entra: 'barrido',
    sale: 'corte'
  }), dice('como un músculo', 383, 2, {
    color: 'amarillo'
  }), st('músculo', 383, 2.4, 'flexed-biceps', {
    pos: [1500, 360],
    tam: 250
  }), esc(385.3, 388.6, X.Palabra, {
    texto: 'ENTRENARLO\nTODOS LOS DÍAS',
    marcadas: ['días.'],
    tam: 1.15,
    stickers: [{
      n: 'person-lifting-weights',
      x: 330,
      y: 300,
      c: 385.5,
      tam: 230
    }, {
      n: 'calendar',
      x: 1600,
      y: 800,
      c: t('todos los días', 386),
      tam: 220
    }]
  }, {
    entra: 'pop'
  }), esc(391.4, 394.0, X.Numero, {
    hasta: 3,
    durCuenta: 0.5,
    txt: 'Recomendaciones prácticas',
    c: t('tres', 391) - 0.1,
    stickers: [{
      n: 'toolbox',
      x: 1500,
      y: 420,
      rot: 10
    }]
  }, {
    entra: 'empuje'
  }), tapar(395.6, 396.2), dice('ahora mismo', 395, 1.6, {
    color: 'amarillo'
  }), esc(400.9, 405.6, X.Alrededor, {
    centro: {
      n: 'person-standing',
      txt: 'TODAS LAS ÁREAS',
      c: 401.0
    },
    cy: 470,
    rx: 660,
    ry: 300,
    items: [{
      n: 'briefcase',
      txt: 'Trabajo',
      c: 401.3
    }, {
      n: 'flexed-biceps',
      txt: 'Salud',
      c: 401.6
    }, {
      n: 'money-bag',
      txt: 'Dinero',
      c: 401.9
    }, {
      n: 'people-hugging',
      txt: 'Relaciones',
      c: 402.2
    }, {
      n: 'bed',
      txt: 'Descanso',
      c: 402.5
    }, {
      n: 'books',
      txt: 'Estudio',
      c: 402.8
    }],
    extra: function (T) {
      return /*#__PURE__*/React.createElement(E.Caja, {
        T: T,
        x: 960,
        y: 985,
        c: t('controladas', 403),
        tam: 0.7
      }, "CONTROLADAS Y ORDENADAS");
    }
  }, {
    entra: 'barrido'
  }), tapar(408.0, 409.4), dice('lograr el objetivo', 407, 1.8, {
    color: 'amarillo'
  }), st('objetivo', 407, 2.2, 'bullseye', {
    pos: [1500, 360],
    tam: 230
  }), st('progreso', 411, 2.6, 'chart-increasing', {
    pos: [1500, 360],
    tam: 230
  }), esc(414.7, 415.6 - H + 0.05, X.Paso, {
    n: 1,
    titulo: 'LAS LISTAS',
    ico: 'memo',
    c: t('las listas', 414) - 0.1
  }, {
    entra: 'barrido',
    sale: 'corte'
  }), p.mantener(415.6, 420.8), dice('empiezas el día', 415, 2.4, {
    color: 'amarillo'
  }, 'desde que empiezas el día'), esc(420.8, 424.2, X.Lista, {
    titulo: 'MI DÍA',
    c: 420.7,
    x: 960,
    items: [{
      txt: 'Lo más importante',
      n: 'fire',
      c: t('más importante', 421)
    }, {
      txt: 'Importante',
      n: 'star',
      c: t('más importante', 421) + 0.5
    }, {
      txt: 'Lo menos importante',
      n: 'feather',
      c: t('menos importante', 422)
    }]
  }, {
    entra: 'pop'
  }), dice('más fricción', 424, 1.8, {
    color: 'rojo'
  }), esc(426.4, 429.2, EscEnergia, {
    fase: 1,
    cDificil: t('hazlo al principio', 427)
  }, {
    entra: 'barrido'
  }), esc(431.8, 434.2, EscEnergia, {
    fase: 2,
    cFacil: t('más fácil', 431)
  }, {
    entra: 'pop'
  }), p.mantener(435.6, 438.1), dice('tiempo límite', 435, 2, {
    color: 'amarillo'
  }), esc(439.8, 449.3, X.Fila, {
    con: '→',
    items: [{
      n: 'sloth',
      txt: 'No te relajas',
      c: t('no te relajes', 439),
      tacha: t('no te relajes', 439) + 0.4
    }, {
      n: 'handshake',
      txt: 'Te comprometes',
      c: t('comprometas', 443)
    }, {
      n: 'alarm-clock',
      txt: 'En un tiempo fijo',
      c: t('tiempo determinado', 446)
    }]
  }, {
    entra: 'barrido'
  }), p.mantener(453.6, 455.7), dice('una a una', 453, 2.2, {
    color: 'verde'
  }, 'tachando una a una'), st('satisfactorio', 456, 2.6, 'relieved-face', {
    pos: [1500, 360],
    tam: 240
  }), dice('satisfactorio', 456, 2, {
    color: 'verde'
  }), esc(460.4, 465.2, X.Lista, {
    titulo: 'HOY',
    c: 460.3,
    items: [{
      txt: 'Entrenar',
      n: 'person-lifting-weights',
      c: 460.4,
      check: 460.9
    }, {
      txt: 'Trabajo pesado',
      n: 'briefcase',
      c: 460.6,
      check: t('progreso', 461)
    }, {
      txt: 'Leer 20 minutos',
      n: 'books',
      c: 460.8,
      check: t('estoy haciendo', 463)
    }, {
      txt: 'Dormir temprano',
      n: 'bed',
      c: 461.0,
      check: 464.6
    }],
    stickers: [{
      n: 'chart-increasing',
      x: 1600,
      y: 300,
      c: t('progreso', 461) + 0.3
    }]
  }, {
    entra: 'empuje'
  }), tapar(468.2, 469.0, {
    mov: 'golpe'
  }), dice('muy importante', 466, 1.8, {
    color: 'rojo'
  }), st('recuerda', 465, 3, 'warning', {
    pos: [1500, 360],
    tam: 230
  }), esc(469.0, 474.2, X.Palabra, {
    texto: 'NO EXISTE LA\nPERFECCIÓN',
    marcadas: ['perfección'],
    tam: 1.3,
    tachar: {
      c: t('perfección', 468) + 0.6,
      y: 655,
      w: 980
    }
  }, {
    entra: 'barrido',
    sale: 'corte'
  }), p.escena(474.2 + H, 486.0 + H, EscSemana, {}, {
    entra: 'corte',
    sale: 'corte'
  }), p.mantener(488.1, 490.1), p.mantener(494.3, 495.3), dice('respeto propio', 493, 2.2, {
    color: 'amarillo'
  }), dice('no te des tan duro', 495, 2.2, {}, 'no te des tan duro'), st('tan duro', 495, 2.6, 'hugging-face', {
    pos: [1500, 360],
    tam: 240
  }), p.mantener(497.9, 502.5), esc(t('número 2', 501) - 0.05 + H, 507.2, X.Paso, {
    n: 2,
    titulo: 'ELIMINA LO QUE NO SUMA',
    ico: 'wastebasket',
    c: t('número 2', 501) + 0.1,
    cTitulo: t('elimina', 503)
  }, {
    entra: 'barrido'
  }), tapar(508.4, 509.6), dice('ni aporte nada', 507, 2, {
    color: 'rojo'
  }, 'ni aporta nada'), esc(511.5, 516.5, X.Palabra, {
    texto: 'NO SOLAMENTE HACER\nTAMBIÉN DEJAR DE HACER',
    marcadas: ['dejar'],
    tam: 0.95,
    stickers: [{
      n: 'raised-hand',
      x: 1640,
      y: 830,
      c: t('dejar de hacer', 514),
      tam: 230
    }]
  }, {
    entra: 'pop'
  }), p.mantener(516.5, 521.2), dice('vale la pena', 520, 2, {
    color: 'amarillo'
  }, '¿vale la pena?'), tapar(523.2, 524.4), dice('la siguiente pregunta', 521, 2, {}, 'hazte esta pregunta'), esc(525.4, 528.9, EscPregunta, {}, {
    entra: 'barrido'
  }), dice('una sola pregunta', 528, 1.8, {
    color: 'amarillo'
  }), st('una sola pregunta', 528, 2.4, 'index-pointing-up', {
    pos: [1500, 360],
    tam: 240
  }), esc(531.5, 536.9, X.Palabra, {
    texto: 'SEAS BRUTALMENTE\nHONESTO',
    marcadas: ['honesto'],
    tam: 1.3,
    rotulo: {
      txt: 'Una sola pregunta para reflexionar',
      c: 531.4,
      y: 180
    },
    stickers: [{
      n: 'thinking-face',
      x: 330,
      y: 820,
      c: t('reflexiones', 532),
      tam: 230
    }, {
      n: 'mirror',
      x: 1600,
      y: 820,
      c: t('brutalmente', 533),
      tam: 240
    }]
  }, {
    entra: 'empuje'
  }), dice('elimines todo aquello', 537, 2.4, {
    color: 'rojo'
  }, 'elimina lo que no sirve'), st('elimines', 537, 2.6, 'wastebasket', {
    pos: [1500, 360],
    tam: 240
  }), p.mantener(540.4, 550.0), p.caja(t('deja de seguir a gente', 539) - 0.05, t('deja de seguir haciendo', 542) - 0.1, 'deja de seguir a quien no aporta', {
    pos: 'abajo',
    tam: 0.8,
    fondo: 'blanco'
  }), p.caja(t('deja de seguir haciendo', 542) - 0.05, t('deja de comer', 545) - 0.1, 'deja de hacer lo que no aporta', {
    pos: 'abajo',
    tam: 0.8,
    fondo: 'blanco'
  }), p.caja(t('deja de comer', 545) - 0.05, 550.0, 'deja de comer lo que te hace daño', {
    pos: 'abajo',
    tam: 0.8,
    fondo: 'blanco'
  }), p.sticker(t('deja de seguir a gente', 539), 550.0, 'no-entry', {
    pos: [1640, 260],
    tam: 200
  }), st('la clave', 550, 2.4, 'key', {
    pos: [1500, 360],
    tam: 230
  }), tapar(555.2, 556.4), dice('primero tienes que dejar de hacer', 553, 2.6, {
    color: 'amarillo',
    marcadas: ['dejar']
  }, 'primero deja de hacer'), esc(556.5, 561.0, X.Balanza, {
    titulo: 'IGUAL O MÁS IMPORTANTE',
    hacia: 'izq',
    cGira: t('más importante', 558),
    izq: {
      n: 'raised-hand',
      txt: 'Dejar de hacer',
      c: 556.6,
      tam: 210
    },
    der: {
      n: 'person-running',
      txt: 'Hacer',
      c: 557.0,
      tam: 210
    }
  }, {
    entra: 'barrido'
  }), tapar(561.0, 564.8), dice('calidad sobre cantidad', 560, 2.8, {
    color: 'amarillo',
    marcadas: ['calidad']
  }), esc(565.3, 568.7, X.Fila, {
    con: '>',
    items: [{
      n: 'gem-stone',
      txt: 'Calidad',
      c: 565.4,
      tam: 330
    }, {
      n: 'rock',
      txt: 'Cantidad',
      c: 565.8,
      tam: 200
    }],
    abajo: {
      txt: 'SIEMPRE',
      c: t('siempre', 566)
    }
  }, {
    entra: 'pop'
  }), p.escena(568.7 + H, 572.3 + H, X.Palabra, {
    fondo: 'amarillo',
    texto: 'LA RECOMENDACIÓN\nNÚMERO 3',
    tam: 1.1,
    stickers: [{
      n: 'thinking-face',
      x: 1620,
      y: 820,
      c: t('creo', 569),
      tam: 230
    }]
  }, {
    entra: 'corte',
    sale: 'corte'
  }), st('amerita', 572, 2.6, 'hourglass-not-done', {
    pos: [1500, 360],
    tam: 230
  }), p.camara(t('espera', 573) - 0.05, 575.4, {
    zoom: 1.32,
    foco: [0.47, 0.37],
    mov: 'golpe',
    bn: true
  }), p.texto(t('espera', 573) - 0.02, 575.2, '¡espera!', {
    color: 'rojo',
    tam: 1.3
  }), tapar(576.4, 578.8), dice('un mensaje muy importante', 576, 2.4, {
    color: 'amarillo',
    marcadas: ['importante']
  }), st('mensaje', 576, 2.6, 'love-letter', {
    pos: [1500, 360],
    tam: 230
  }), esc(580.1, 583.1, X.Fila, {
    fondo: 'amarillo',
    items: [{
      n: 'thumbs-up',
      txt: 'Like',
      c: t('like', 580)
    }, {
      n: 'bell',
      txt: 'Suscríbete',
      c: t('suscribirte', 580)
    }, {
      n: 'link',
      txt: 'Compártelo',
      c: t('compartir', 581)
    }]
  }, {
    entra: 'barrido'
  }), st('edición', 586, 2.4, 'clapper-board', {
    pos: [1500, 360],
    tam: 220
  }), st('animaciones', 587, 2.4, 'artist-palette', {
    pos: [420, 360],
    tam: 220
  }), p.mantener(592.7, 593.6), esc(593.6, 595.2, X.Fila, {
    items: [{
      n: 'video-camera',
      txt: 'Lo grabo',
      c: 593.5
    }, {
      n: 'scissors',
      txt: 'Lo edito',
      c: 593.8
    }, {
      n: 'memo',
      txt: 'Lo escribo',
      c: 594.1
    }]
  }, {
    entra: 'corte'
  }), esc(597.2, 603.6, EscMeta, {}, {
    entra: 'barrido'
  }), tapar(605.8, 609.2), p.suscribete(604.2, 609.2), esc(609.2, 612.5, X.Fila, {
    con: '→',
    items: [{
      n: 'busts-in-silhouette',
      txt: 'Tu apoyo',
      c: 609.3
    }, {
      n: 'chart-increasing',
      txt: 'Más calidad',
      c: t('calidad', 609)
    }]
  }, {
    entra: 'pop'
  }), tapar(613.6, 614.8), dice('continuamos con el video', 612, 2, {
    color: 'amarillo'
  }, 'continuemos'), esc(614.7, 619.7, X.Paso, {
    n: 3,
    titulo: 'PROPÓSITO',
    ico: 'bullseye',
    c: t('propósito', 614) - 0.1,
    sub: {
      txt: 'Claro y bien definido',
      c: t('claro y bien definido', 616)
    }
  }, {
    entra: 'barrido'
  }), dice('por qué haces lo que haces', 619, 2.4, {}, '¿por qué haces lo que haces?'), st('por qué haces', 619, 2.6, 'red-question-mark', {
    pos: [1500, 360],
    tam: 230
  }), esc(622.0, 625.4, X.Fila, {
    con: '→',
    items: [{
      n: 'speech-balloon',
      txt: 'Cualquier excusa',
      c: t('excusa', 622)
    }, {
      n: 'white-flag',
      txt: 'Te rindes',
      c: t('rendirte', 623)
    }],
    extra: function (T) {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(E.Burbuja, {
        T: T,
        x: 560,
        y: 180,
        c: t('excusa', 622) + 0.3,
        tam: 0.8,
        mudo: true
      }, "MA\xD1ANA EMPIEZO"), /*#__PURE__*/React.createElement(E.Burbuja, {
        T: T,
        x: 760,
        y: 860,
        c: t('excusa', 622) + 0.7,
        tam: 0.8,
        mudo: true
      }, "HOY NO TENGO GANAS"));
    }
  }, {
    entra: 'pop'
  }), dice('bien sólido', 626, 2, {
    color: 'amarillo'
  }, 'bien definido y sólido'), st('sólido', 626, 2.4, 'bullseye', {
    pos: [1500, 360],
    tam: 230
  }), esc(628.8, 631.1, X.Fila, {
    items: [{
      n: 'doughnut',
      c: 628.9,
      tacha: t('placer', 629)
    }, {
      n: 'mobile-phone',
      c: 629.1,
      tacha: t('placer', 629) + 0.2
    }, {
      n: 'couch-and-lamp',
      c: 629.3,
      tacha: t('placer', 629) + 0.4
    }],
    abajo: {
      txt: 'YA NO TE ARRASTRA EL PLACER',
      c: t('llevar', 629)
    }
  }, {
    entra: 'empuje'
  }), p.mantener(633.3, 637.0), dice('te conviertes en esa persona', 633, 2.6, {
    color: 'amarillo'
  }), st('adversidades', 637, 2.6, 'cloud-with-lightning-and-rain', {
    pos: [1500, 360],
    tam: 240
  }), dice('a pesar de todas las adversidades', 637, 2.4, {}, 'a pesar de todo'), esc(640.6, 644.6, X.Fila, {
    con: '+',
    items: [{
      n: 'busts-in-silhouette',
      txt: 'Tu alrededor',
      c: t('gente a tu alrededor', 640)
    }, {
      n: 'house-with-garden',
      txt: 'Tu familia',
      c: t('familia', 642)
    }],
    extra: function (T) {
      return /*#__PURE__*/React.createElement(E.Burbuja, {
        T: T,
        x: 1500,
        y: 190,
        c: t('no', 643),
        tam: 0.8,
        tipo: "pienso",
        mudo: true
      }, "\xBFY TODO ESO PARA QU\xC9?");
    }
  }, {
    entra: 'barrido'
  }), dice('no entienda', 644, 2.4, {}, 'aunque no lo entiendan'), p.mantener(650.9, 653.6), dice('valió la pena', 651, 2.2, {
    color: 'verde'
  }), esc(654.7, 660.9 - H, X.Fila, {
    con: '=',
    items: [{
      n: 'person-lifting-weights',
      txt: 'Sacrificios',
      c: t('sacrificios', 654)
    }, {
      n: 'red-heart',
      txt: 'Amor propio',
      c: t('amor propio', 657)
    }],
    abajo: {
      txt: 'RESPETO POR TI MISMO',
      c: t('respeto', 658)
    }
  }, {
    entra: 'barrido',
    sale: 'corte'
  }), p.cita(660.9, 670.5 + H, {
    texto: 'Dicen que ver para creer, pero es al revés: tienes que creer para poder ver.',
    autor: 'Ilia Topuria',
    ico: 'crown',
    marcadas: ['creer', 'ver.'],
    entra: 'corte',
    sale: 'corte'
  }), dice('gracias a la disciplina', 672, 2.4, {
    color: 'amarillo'
  }), esc(675.8, 679.7, X.Fila, {
    fondo: 'amarillo',
    items: [{
      n: 'bell',
      txt: 'Suscríbete',
      c: t('suscríbete', 675)
    }, {
      n: 'thumbs-up',
      txt: 'Dale like',
      c: t('like', 676)
    }, {
      n: 'link',
      txt: 'Compártelo',
      c: t('compártelo', 677)
    }]
  }, {
    entra: 'barrido'
  }), p.suscribete(680.6, 686.6), esc(687.8, 691.1, EscBarras, {}, {
    entra: 'pop'
  }), tapar(692.8, 696.0), dice('muchas gracias', 690, 2, {
    color: 'amarillo'
  }, '¡muchas gracias!'), st('próximo video', 694, 2.4, 'waving-hand', {
    pos: [1500, 360],
    tam: 250
  }), p.cierre(696.9 - H, 706.8)];
  L.registrar({
    id: 'disciplina',
    titulo: 'Disciplina',
    video: 'largos/disciplina/media/fuente.mp4',
    plan: plan
  });
})(window);
