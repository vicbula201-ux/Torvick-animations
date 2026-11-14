/* GENERADO por compilar.js desde gluteos.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   ¿QUIERES TENER UN CULO GRANDE? — reel con la novia de Tor, ESTILO 2
   (~37 s con la accion y el cierre). Pedido del autor: presentar a la novia
   de Tor (para el publico femenino) y explicar los 3 mejores ejercicios de
   gluteo segun la ciencia y que hacer para que crezca.
   Los tres: hip thrust (el que mas activa el gluteo; Plotkin 2023 vio que
   crece parecido a la sentadilla profunda), sentadilla bulgara (el gluteo
   trabaja estirado; con el torso un poco adelante, mas gluteo) y peso
   muerto rumano (la cadera atras, gluteo e isquios estirados con carga).
   Para que crezca: sobrecarga progresiva, 10 a 20 series por semana,
   proteina suficiente, dormir bien y paciencia (meses).
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
    TOR = global.TOR,
    NOVIA = global.NOVIA;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var A = global.REELS.ayudas;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = {
    stroke: C.INK,
    strokeWidth: 15,
    strokeLinejoin: 'round',
    strokeLinecap: 'round'
  };
  var PISO = 1300;
  function prod(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function rodillaAdelante(cad, tob) {
    var r1 = B.ik(cad, tob, 272, 268, 1),
      r2 = B.ik(cad, tob, 272, 268, -1);
    return r1[0] < r2[0] ? r1 : r2;
  }
  function brazosColgando(pose, ang) {
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: pose.cadera,
        mano: pose.cadera
      })
    });
    pose.codo = U.suma(g.hombro, U.polar(ang, 232));
    pose.mano = U.suma(pose.codo, U.polar(ang - 2, 214));
    pose.codo2 = U.suma(pose.codo, [14, -8]);
    pose.mano2 = U.suma(pose.mano, [14, -8]);
    return pose;
  }

  /* ---------------- ella, de perfil (B.Perfil + las capas de NOVIA) ---------------- */

  function Ella(props) {
    var T = props.T,
      op = {
        glu: props.glu || 0
      };
    return /*#__PURE__*/React.createElement(B.Perfil, {
      s: props.s,
      pose: props.pose,
      parpadeo: V.parpadeo(T, props.fase || 0),
      musc: Object.assign({
        glu: props.glu || 0
      }, props.musc || {}),
      fondo: function (g) {
        return /*#__PURE__*/React.createElement("g", null, props.fondo ? props.fondo(g) : null, NOVIA.perfil(g, T, op).fondo);
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement("g", null, NOVIA.perfil(g, T, op).agarre, props.agarre ? props.agarre(g) : null);
      },
      children: function (g) {
        return /*#__PURE__*/React.createElement("g", null, NOVIA.perfil(g, T, op).encima, props.extra ? props.extra(g) : null);
      }
    });
  }

  // de pie, la mano en la cadera
  function poseDePie() {
    var pose = B.posePerfil.depie({
      x: 700,
      piso: PISO
    });
    var g = B.geoPerfil({
      pose: pose
    });
    pose.codo = U.suma(g.hombro, U.polar(62, 220));
    pose.mano = U.suma(g.cadera, [-6, -70]);
    return pose;
  }

  /* ---------------- 1. hip thrust (como hip-thrust.jsx) ---------------- */

  var BORDE = [905, 1004],
    TOB_H = [395, PISO - 32],
    PUNTA_H = U.suma(TOB_H, [-112, 32]),
    GROSOR = 75;
  function thrust(sube) {
    var th = U.lerp(-46, 0, Easing.easeInOutSine(clamp(sube, 0, 1))) * Math.PI / 180;
    var d = [Math.cos(th), Math.sin(th)],
      atras = [-Math.sin(th), Math.cos(th)];
    var apoyo = U.suma(BORDE, U.por(atras, -GROSOR));
    var cadera = U.suma(apoyo, U.por(d, -250));
    var cuello = U.suma(cadera, U.por(d, 404));
    var pose = {
      cadera: cadera,
      cuello: cuello,
      curva: 0,
      cabeza: -8,
      piso: PISO
    };
    var g = B.geoPerfil({
      pose: Object.assign({}, pose, {
        codo: cadera,
        mano: cadera,
        rodilla: cadera,
        tobillo: TOB_H,
        punta: PUNTA_H
      })
    });
    var barra = U.suma(U.suma(cadera, U.por(atras, -96)), U.por(d, 8));
    var mano = U.suma(barra, U.por(d, 26));
    var c1 = B.ik(g.hombro, mano, 232, 214, 1),
      c2 = B.ik(g.hombro, mano, 232, 214, -1);
    pose.codo = prod(c1, atras) > prod(c2, atras) ? c1 : c2;
    pose.mano = mano;
    pose.codo2 = U.suma(pose.codo, [10, -10]);
    pose.mano2 = U.suma(mano, [12, -8]);
    var r1 = B.ik(cadera, TOB_H, 272, 268, 1),
      r2 = B.ik(cadera, TOB_H, 272, 268, -1);
    pose.rodilla = r1[1] < r2[1] ? r1 : r2;
    pose.tobillo = TOB_H;
    pose.punta = PUNTA_H;
    pose.rodilla2 = U.suma(pose.rodilla, [16, -12]);
    pose.tobillo2 = U.suma(TOB_H, [18, -4]);
    pose.punta2 = U.suma(PUNTA_H, [18, -4]);
    pose._barra = barra;
    return pose;
  }
  function BancoHip() {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", _extends({
      x: 926,
      y: 1050,
      width: 330,
      height: PISO - 1050,
      rx: 14,
      fill: BLANCO
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: "M 960 1110 L 1222 1110",
      stroke: C.GRY,
      strokeWidth: 11,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", _extends({
      x: BORDE[0],
      y: BORDE[1],
      width: 370,
      height: 50,
      rx: 22,
      fill: C.GRY
    }, LN)));
  }

  /* ---------------- 2. sentadilla bulgara ---------------- */

  var TOB_B = [430, PISO - 32],
    PIE_ATRAS = [1040, 952];
  function bulgara(k) {
    var cadera = U.lerpP([690, 800], [770, 1000], Easing.easeInOutSine(clamp(k, 0, 1)));
    var pose = {
      cadera: cadera,
      cuello: U.suma(cadera, U.polar(-110, 404)),
      curva: 0.05,
      cabeza: -10,
      piso: PISO
    };
    pose.tobillo = TOB_B;
    pose.punta = U.suma(TOB_B, [-112, 32]);
    pose.rodilla = rodillaAdelante(cadera, TOB_B);
    pose.tobillo2 = PIE_ATRAS;
    pose.punta2 = U.suma(PIE_ATRAS, [104, 12]);
    var a = B.ik(cadera, PIE_ATRAS, 272, 268, 1),
      b = B.ik(cadera, PIE_ATRAS, 272, 268, -1);
    pose.rodilla2 = a[1] > b[1] ? a : b;
    return brazosColgando(pose, 96);
  }
  function BancoAtras() {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", _extends({
      x: 1000,
      y: 986,
      width: 300,
      height: 56,
      rx: 22,
      fill: C.GRY
    }, LN)), /*#__PURE__*/React.createElement("path", {
      d: 'M 1040 1042 L 1040 ' + PISO + ' M 1260 1042 L 1260 ' + PISO,
      stroke: C.INK,
      strokeWidth: 18,
      strokeLinecap: "round"
    }));
  }

  /* ---------------- 3. peso muerto rumano ---------------- */

  var TOB_R = [610, PISO - 32];
  function rumano(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var cadera = U.lerpP([650, 736], [790, 790], e);
    var pose = {
      cadera: cadera,
      cuello: U.suma(cadera, U.polar(U.lerp(-93, -164, e), 404)),
      curva: 0,
      cabeza: U.lerp(0, -20, e),
      piso: PISO
    };
    pose.tobillo = TOB_R;
    pose.punta = U.suma(TOB_R, [-112, 32]);
    pose.rodilla = rodillaAdelante(cadera, TOB_R);
    pose.tobillo2 = U.suma(TOB_R, [16, -6]);
    pose.punta2 = U.suma(pose.punta, [16, -6]);
    pose.rodilla2 = U.suma(pose.rodilla, [14, -8]);
    return brazosColgando(pose, 90);
  }

  /* ---------------- encuadre de los ejercicios ---------------- */

  // un encuadre por ejercicio (la bulgara y el rumano son mas altos que el hip thrust)
  var FIG_H = {
      x: -150,
      y: 120,
      s: 0.88
    },
    FIG_B = {
      x: -60,
      y: 200,
      s: 0.75
    },
    FIG_R = {
      x: 80,
      y: 250,
      s: 0.75
    };
  function reps(T, f, n) {
    return V.ida(V.fase(T, f(0.05), f(0.97), n), 0.38, 0.16);
  }

  // centro: el medio de la figura (plano general); foco: el gluteo (primer plano)
  function escEjercicio(n, dibujo, FIG, centro, foco, r1, r2, zoom) {
    var en = function (p) {
      return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s];
    };
    return V.escena({
      fig: FIG,
      pulsos: [0.5],
      tomas: [[0, {
        zoom: 1.0,
        foco: en(centro),
        mira: [540, 930]
      }], [0.3, {
        zoom: 1.02,
        foco: en(centro),
        mira: [540, 930]
      }], [0.55, {
        zoom: zoom || 1.25,
        foco: en(foco),
        mira: [540, 1040]
      }], [1, {
        zoom: 1.04,
        foco: en(centro),
        mira: [540, 930]
      }]],
      figura: function (T, f, t, s) {
        var k = reps(T, f, 2);
        return /*#__PURE__*/React.createElement(V.Estela, {
          T: T,
          n: 3,
          paso: 0.05,
          dibujar: function (Tx, fantasma) {
            var kx = reps(Tx, f, 2);
            return dibujo(Tx, s, kx, fantasma ? null : function (g) {
              return /*#__PURE__*/React.createElement(V.Brillo, {
                T: T,
                c: U.suma(g.gluteo, [10, 30]),
                r: 90,
                v: k
              });
            });
          }
        });
      },
      encima: function (T, f) {
        return /*#__PURE__*/React.createElement(A.Pos, {
          x: 40,
          y: 380,
          e: M.pop(T, f(0) - 0.6, 0.5),
          dy: M.life(T, 3, 5)
        }, /*#__PURE__*/React.createElement(B.Cuenta, {
          s: 0.9,
          n: n,
          p: 1
        }));
      },
      r1: {
        text: r1,
        s: 1.1,
        cuando: null
      },
      r2: {
        text: r2,
        cuando: 0.3
      }
    });
  }
  function hipThrust(T, s, k, extra) {
    var pose = thrust(0.15 + 0.85 * k);
    var barra = pose._barra;
    return /*#__PURE__*/React.createElement(Ella, {
      T: T,
      s: s,
      pose: pose,
      glu: 0.5 + 0.5 * k,
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 200,
          x1: 1320
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [600, PISO + 2],
          rx: 360
        }), /*#__PURE__*/React.createElement(BancoHip, null), /*#__PURE__*/React.createElement("circle", {
          cx: barra[0],
          cy: barra[1],
          r: 130,
          fill: C.GRY,
          stroke: C.INK,
          strokeWidth: 14
        }));
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
          cx: barra[0],
          cy: barra[1],
          r: 24,
          fill: C.GRY,
          stroke: C.INK,
          strokeWidth: 11
        }), extra ? extra(g) : null);
      }
    });
  }
  function bulgaraDibujo(T, s, k, extra) {
    return /*#__PURE__*/React.createElement(Ella, {
      T: T,
      s: s,
      pose: bulgara(k),
      glu: 0.5 + 0.5 * k,
      musc: {
        cuad: 0.4
      },
      fondo: function () {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 200,
          x1: 1320
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [640, PISO + 2],
          rx: 320
        }), /*#__PURE__*/React.createElement(BancoAtras, null));
      },
      agarre: function (g) {
        return /*#__PURE__*/React.createElement(B.MancuernaG, {
          c: g.mano,
          ang: 90,
          giro: 0,
          k: 0.7
        });
      },
      extra: extra
    });
  }
  function rumanoDibujo(T, s, k, extra) {
    var pose = rumano(k);
    return /*#__PURE__*/React.createElement(Ella, {
      T: T,
      s: s,
      pose: pose,
      glu: 0.5 + 0.5 * k,
      musc: {
        isq: 0.6 * k
      },
      fondo: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
          y: PISO + 4,
          x0: 200,
          x1: 1320
        }), /*#__PURE__*/React.createElement(V.Sombra, {
          c: [640, PISO + 2],
          rx: 300
        }), /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "lado",
          c: U.suma(g.mano, [14, -8]),
          k: 1.15
        }));
      },
      extra: function (g) {
        return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.BarraLibreG, {
          vista: "lado",
          c: g.mano,
          k: 1.15
        }), extra ? extra(g) : null);
      }
    });
  }

  /* ---------------- escenas ---------------- */

  var GL = {
    x: 40,
    y: 120,
    s: 0.9
  }; // ella de pie en el gancho
  function enGL(p) {
    return [GL.x + p[0] * GL.s, GL.y + p[1] * GL.s];
  }
  var ESCENAS = [{
    nombre: 'Gancho',
    dur: 3,
    vo: '¿Quieres tener un culo grande? Mira este video.',
    C: V.escena({
      fig: GL,
      pulsos: [0.3],
      tomas: [[0, {
        zoom: 1.9,
        foco: enGL([780, 800]),
        mira: [540, 900]
      }], [0.55, {
        zoom: 1.2,
        foco: enGL([720, 760]),
        mira: [540, 960]
      }], [1, {
        zoom: 1.04,
        foco: enGL([700, 760]),
        mira: [540, 960]
      }]],
      figura: function (T, f, t, s) {
        return /*#__PURE__*/React.createElement(Ella, {
          T: T,
          s: s,
          pose: poseDePie(),
          glu: 1,
          fondo: function () {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(B.PisoG, {
              y: PISO + 4,
              x0: 300,
              x1: 1100
            }), /*#__PURE__*/React.createElement(V.Sombra, {
              c: [700, PISO + 2],
              rx: 240
            }));
          },
          extra: function (g) {
            return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(V.Brillo, {
              T: T,
              c: U.suma(g.gluteo, [10, 30]),
              r: 110,
              v: 1
            }), /*#__PURE__*/React.createElement(V.Chispa, {
              T: T,
              c: U.suma(g.gluteo, [30, 20]),
              cuando: f(0.3),
              r: 150
            }));
          }
        });
      },
      r1: {
        text: 'GLÚTEOS GRANDES',
        s: 1.2,
        cuando: 0.04
      },
      r2: {
        text: 'SEGÚN LA CIENCIA',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'La novia de Tor',
    dur: 4,
    vo: 'Ella es la novia de Tor. Estos son los 3 mejores ejercicios.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.08,
        foco: [440, 860]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      pulsos: [0.36],
      tor: {
        s: 0.5,
        x: 520,
        y: 600,
        cuando: 0.2,
        boca: 'sonrisa',
        musc: {
          bic: 1
        },
        flex: function (T, f) {
          return animate({
            from: 0,
            to: 1,
            start: f(0.3),
            end: f(0.46),
            ease: Easing.easeOutBack
          })(T);
        }
      },
      piezas: [{
        C: NOVIA.Novia,
        s: 0.5,
        x: -40,
        y: 600,
        p: function (T, f) {
          return {
            pose: 'saludo',
            k: animate({
              from: 0,
              to: 1,
              start: f(0.04),
              end: f(0.2),
              ease: Easing.easeOutBack
            })(T),
            parpadeo: V.parpadeo(T, 0.6)
          };
        }
      }, {
        C: P.Corazon,
        s: 1.3,
        x: 470,
        y: 560,
        cuando: 0.4,
        p: function (T) {
          return {
            beat: 1 + 0.1 * Math.max(0, Math.sin(T * 7))
          };
        }
      }, {
        C: B.Cuenta,
        s: 1.0,
        x: 430,
        y: 1160,
        cuando: 0.6,
        p: {
          n: 3,
          p: 1
        }
      }],
      r1: {
        text: 'LA NOVIA DE TOR',
        s: 1.15,
        cuando: 0.04
      },
      r2: {
        text: 'TOP 3 PARA GLÚTEOS',
        cuando: 0.56
      }
    })
  }, {
    nombre: '1. Hip thrust',
    dur: 3.6,
    vo: 'Uno: hip thrust. Sube la cadera y aprieta arriba.',
    C: escEjercicio(1, hipThrust, FIG_H, [790, 1080], [700, 1020], 'HIP THRUST', 'APRIETA ARRIBA')
  }, {
    nombre: '2. Búlgara',
    dur: 3.6,
    vo: 'Dos: sentadilla búlgara, con el torso un poco adelante.',
    C: escEjercicio(2, bulgaraDibujo, FIG_B, [800, 800], [800, 960], 'SENTADILLA BÚLGARA', 'TORSO ADELANTE', 1.2)
  }, {
    nombre: '3. Peso muerto rumano',
    dur: 3.6,
    vo: 'Tres: peso muerto rumano, llevando la cadera atrás.',
    C: escEjercicio(3, rumanoDibujo, FIG_R, [600, 760], [680, 800], 'PESO MUERTO RUMANO', 'CADERA ATRÁS', 1.15)
  }, {
    nombre: 'Progresión',
    dur: 5,
    vo: 'Para que crezca, sube el peso poco a poco: de 10 a 20 series por semana.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.05,
        foco: [540, 860]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      pulsos: [0.5],
      piezas: [{
        C: NOVIA.Novia,
        s: 0.56,
        x: -70,
        y: 560,
        p: function (T, f) {
          return {
            pose: 'flex',
            k: animate({
              from: 0,
              to: 1,
              start: f(0.04),
              end: f(0.2),
              ease: Easing.easeOutBack
            })(T),
            parpadeo: V.parpadeo(T, 0.2)
          };
        }
      }, {
        C: N.ICONOS.barras,
        s: 1.25,
        x: 640,
        y: 400,
        cuando: 0.1,
        p: function (T, f) {
          return {
            p: animate({
              from: 0,
              to: 1,
              start: f(0.14),
              end: f(0.45)
            })(T)
          };
        }
      }, {
        C: B.Cuenta,
        s: 1.05,
        x: 690,
        y: 900,
        cuando: 0.46,
        p: function (T, f) {
          var n = Math.round(animate({
            from: 10,
            to: 20,
            start: f(0.5),
            end: f(0.8)
          })(T));
          return {
            n: n,
            p: n / 20
          };
        }
      }],
      lienzo: function (T, f) {
        return /*#__PURE__*/React.createElement(V.Chispa, {
          T: T,
          c: [810, 1020],
          cuando: f(0.8),
          r: 150
        });
      },
      r1: {
        text: 'MÁS PESO CON EL TIEMPO',
        s: 1.0,
        cuando: 0.04
      },
      r2: {
        text: '10 A 20 SERIES A LA SEMANA',
        cuando: 0.5
      }
    })
  }, {
    nombre: 'Hábitos',
    dur: 4.5,
    vo: 'Come suficiente proteína, duerme bien y ten paciencia: el cambio se ve en meses.',
    C: PL.escena2({
      tomas: [[0, {
        zoom: 1.05,
        foco: [540, 860]
      }], [1, {
        zoom: 1.0,
        foco: [540, 900]
      }]],
      piezas: [{
        C: NOVIA.Novia,
        s: 0.56,
        x: -70,
        y: 560,
        p: function (T) {
          return {
            pose: 'cadera',
            parpadeo: V.parpadeo(T, 0.9)
          };
        }
      }, {
        C: N.COMIDA.pollo,
        s: 0.75,
        plato: 0.8,
        x: 700,
        y: 380,
        cuando: 0.08
      }, {
        C: N.ICONOS.luna,
        s: 0.95,
        x: 740,
        y: 760,
        cuando: 0.3
      }, {
        C: N.ICONOS.calendario,
        s: 0.95,
        x: 740,
        y: 1040,
        cuando: 0.52
      }],
      bien: [{
        x: 900,
        y: 1240,
        cuando: 0.7,
        s: 0.55
      }],
      r1: {
        text: 'PROTEÍNA Y DESCANSO',
        s: 1.05,
        cuando: 0.04
      },
      r2: {
        text: 'PACIENCIA: MESES',
        cuando: 0.56
      }
    })
  }];

  // la figura y su maquina, para otros reels (los top 3)
  global.PIEZAS = global.PIEZAS || {};
  global.PIEZAS.gluteos = {
    Ella: Ella,
    thrust: thrust,
    BancoHip: BancoHip,
    bulgara: bulgara,
    BancoAtras: BancoAtras,
    rumano: rumano,
    hipThrust: hipThrust,
    bulgaraDibujo: bulgaraDibujo
  };
  global.REELS.registrar({
    id: 'gluteos',
    titulo: '¿Quieres un culo grande? (estilo 2)',
    estilo: 2,
    escenas: ESCENAS,
    accion: {
      dur: 4.4,
      pregunta: '¿CUÁL PROBARÁS?',
      vo: '¿Cuál vas a probar primero? Coméntalo, compártelo con una amiga y guárdalo.'
    }
  });
})(window);
