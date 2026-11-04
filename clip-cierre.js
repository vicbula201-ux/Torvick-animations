/* GENERADO por compilar.js desde clip-cierre.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   clip-cierre.jsx — window.CLIPS: el cierre de los shorts que salen
   de los videos largos (clips.html)

   Los shorts de los largos vienen hechos en otro estilo (ilustracion
   plana: azul marino, naranja, rojo y amarillo; subtitulos palabra por
   palabra). Este archivo rearma su ultima escena —"mira el video
   completo"— igual que la original y le suma la firma: YouTube,
   Instagram y TikTok con @eltorvick. La miniatura de la tarjeta se
   cambia sin tocar nada mas (herramientas/cierre-clip.js --miniatura).

   Un short = un registro (en largos/<id>/clips.jsx):

     CLIPS.registrar({
       id, titulo, video,          // video: nombre del archivo original
       desde, fin,                 // segundo en que empieza el cierre y fin del short
       subs: [{ fin, palabras: [[segundo, 'PALABRA'], ...] }, ...],  // los del cierre
       guion: [{ ini, fin, texto, pantalla }]                        // todo el short
     })

   T es el segundo del short original (como en los largos): el cierre
   va de `desde` a `fin`. Todo se calcula desde T.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var useState = React.useState;
  var useEffect = React.useEffect;

  // colores medidos en los shorts originales (no es la paleta de cinco del pizarron)
  var C = {
    NAVY: '#1A294B',
    RED: '#E6433B',
    YEL: '#FED200',
    CIRC: '#EDF5FE',
    TINTA: '#111011',
    PISTA: '#5E6C83',
    BLANCO: '#FFFFFF'
  };
  var MONT = "'Montserrat', system-ui, sans-serif";

  /* ---------- curvas ---------- */

  function k01(T, a, dur) {
    return clamp((T - a) / dur, 0, 1);
  }
  function back(p, s) {
    // easeOutBack con rebote regulable
    s = s == null ? 1.70158 : s;
    var q = p - 1;
    return 1 + (s + 1) * q * q * q + s * q * q;
  }
  function pop(T, a, dur, s) {
    var p = k01(T, a, dur);
    return p <= 0 ? 0 : back(p, s);
  }
  function bump(T, a, b) {
    // 0 -> 1 -> 0 entre a y b
    if (T <= a || T >= b) return 0;
    return Math.sin(Math.PI * (T - a) / (b - a));
  }
  function escalar(cx, cy, s, rot) {
    return 'translate(' + cx + ' ' + cy + ') rotate(' + (rot || 0) + ') scale(' + s + ') translate(' + -cx + ' ' + -cy + ')';
  }

  /* ---------- medir texto (para los subtitulos) ---------- */

  var lienzoMedir = null,
    cacheMedir = {};
  function ancho(texto, peso, tam, familia) {
    var listo = global.document && document.fonts && document.fonts.status === 'loaded';
    var clave = peso + '|' + tam + '|' + familia + '|' + texto;
    if (listo && cacheMedir[clave] != null) return cacheMedir[clave];
    if (!lienzoMedir) lienzoMedir = document.createElement('canvas').getContext('2d');
    lienzoMedir.font = peso + ' ' + tam + 'px ' + familia;
    var w = lienzoMedir.measureText(texto).width;
    if (listo) cacheMedir[clave] = w;
    return w;
  }

  /* ---------- los tres logos (glifos simples, en un disco blanco) ---------- */

  function LogoYouTube() {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: -27,
      y: -19,
      width: 54,
      height: 38,
      rx: 11,
      fill: C.RED
    }), /*#__PURE__*/React.createElement("path", {
      d: "M-7 -10 L11 0 L-7 10 Z",
      fill: C.BLANCO,
      stroke: C.BLANCO,
      strokeWidth: 2,
      strokeLinejoin: "round"
    }));
  }
  function LogoInstagram() {
    return /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: "url(#clipIG)",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: -23,
      y: -23,
      width: 46,
      height: 46,
      rx: 14,
      strokeWidth: 6
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 0,
      cy: 0,
      r: 10.5,
      strokeWidth: 6
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 12.5,
      cy: -12.5,
      r: 2.6,
      fill: "#D62976",
      stroke: "none"
    }));
  }
  function LogoTikTok() {
    var nota = function (dx, dy, color) {
      return /*#__PURE__*/React.createElement("g", {
        transform: 'translate(' + dx + ' ' + dy + ')',
        fill: "none",
        stroke: color,
        strokeWidth: 7.5,
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M3 -22 V9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 -22 C5 -13 11 -9 18 -9"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: -6,
        cy: 10,
        r: 8.5
      }));
    };
    return /*#__PURE__*/React.createElement("g", null, nota(-2.5, -2, '#25F4EE'), nota(2.5, 2, '#FE2C55'), nota(0, 0, C.TINTA));
  }
  var REDES = [LogoYouTube, LogoInstagram, LogoTikTok];

  /* ---------- la pastilla de redes: [YT][IG][TT] @eltorvick ---------- */

  function Redes(props) {
    var T = props.t; // segundos desde que empieza el cierre
    var cx = 540,
      cy = 333,
      alto = 116;
    var tamTxt = 54,
      r = 40,
      gap = 14,
      pad = 22,
      sep = 24;
    var tw = ancho('@eltorvick', 800, tamTxt, MONT);
    var W = pad + 3 * 2 * r + 2 * gap + sep + tw + 38;
    var x0 = cx - W / 2;
    var s = pop(T, 0.02, 0.2);
    if (s <= 0) return null;
    var txtE = k01(T, 0.3, 0.3);
    var ola = function (i) {
      // dos "saltitos" en ola para llamar la atencion
      return 1 + 0.16 * bump(T, 1.15 + i * 0.1, 1.45 + i * 0.1) + 0.14 * bump(T, 3.35 + i * 0.1, 3.65 + i * 0.1);
    };
    return /*#__PURE__*/React.createElement("g", {
      transform: escalar(cx, cy, s)
    }, /*#__PURE__*/React.createElement("rect", {
      x: x0,
      y: cy - alto / 2,
      width: W,
      height: alto,
      rx: alto / 2,
      fill: C.NAVY
    }), REDES.map(function (Logo, i) {
      var x = x0 + pad + r + i * (2 * r + gap);
      var si = pop(T, 0.17 + i * 0.07, 0.24) * ola(i);
      var dy = Math.sin(2 * Math.PI * (T / 1.8 + i * 0.22)) * 2.5;
      if (si <= 0) return null;
      return /*#__PURE__*/React.createElement("g", {
        key: i,
        transform: 'translate(' + x + ' ' + (cy + dy) + ') scale(' + si + ')'
      }, /*#__PURE__*/React.createElement("circle", {
        r: r,
        fill: C.BLANCO
      }), /*#__PURE__*/React.createElement(Logo, null));
    }), /*#__PURE__*/React.createElement("text", {
      x: x0 + pad + 3 * 2 * r + 2 * gap + sep - (1 - Easing.easeOutCubic(txtE)) * 30,
      y: cy + tamTxt * 0.36,
      fontFamily: MONT,
      fontWeight: 800,
      fontSize: tamTxt,
      fill: C.BLANCO,
      opacity: txtE
    }, "@eltorvick"));
  }

  /* ---------- la tarjeta del video completo ---------- */

  function Tarjeta(props) {
    var T = props.t,
      mini = props.miniatura,
      def = props.def;
    var cx = 541,
      cy = 763;
    var s = pop(T, 0.12, 0.36, 2.2);
    if (s <= 0) return null;
    var rot = -10 * (1 - Easing.easeOutCubic(k01(T, 0.12, 0.42)));
    var img = CAJA_IMG; // sin la barra de abajo (y 941-950)
    var rojo = T > 0.62 ? clamp(17 + 194 * (T - 0.62), 0, img.w) : 0; // la barra se llena en ~4,2 s
    var barra = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: img.x,
      y: 941,
      width: img.w,
      height: 9,
      fill: C.PISTA
    }), rojo > 0 ? /*#__PURE__*/React.createElement("rect", {
      x: img.x,
      y: 941,
      width: rojo,
      height: 9,
      fill: C.RED
    }) : null);
    var cuadro;
    if (mini && mini.recorte) {
      // recorte de la tarjeta original (ya trae la insignia VIDEO COMPLETO)
      cuadro = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
        x: img.x,
        y: img.y,
        width: img.w,
        height: img.h,
        fill: C.NAVY
      }), /*#__PURE__*/React.createElement("image", {
        href: mini.src,
        x: img.x,
        y: img.y,
        width: img.w,
        height: img.h,
        preserveAspectRatio: "none"
      }), barra);
    } else {
      var tit = (def.tituloTarjeta || '').split('|');
      cuadro = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
        x: img.x,
        y: img.y,
        width: img.w,
        height: img.h,
        fill: C.NAVY
      }), mini ? /*#__PURE__*/React.createElement("image", {
        href: mini.src,
        x: img.x,
        y: img.y,
        width: img.w,
        height: img.h + 10,
        preserveAspectRatio: "xMidYMid slice"
      }) : tit.map(function (l, i) {
        return /*#__PURE__*/React.createElement("text", {
          key: i,
          x: 540,
          y: img.y + 200 + i * 72,
          textAnchor: "middle",
          fontFamily: MONT,
          fontWeight: 900,
          fontSize: 62,
          fill: i === tit.length - 1 ? C.YEL : C.BLANCO
        }, l);
      }), barra, /*#__PURE__*/React.createElement("rect", {
        x: 146,
        y: 510,
        width: 296,
        height: 56,
        rx: 12,
        fill: C.RED
      }), /*#__PURE__*/React.createElement("text", {
        x: 294,
        y: 549,
        textAnchor: "middle",
        fontFamily: MONT,
        fontWeight: 800,
        fontSize: 30,
        fill: C.BLANCO
      }, "VIDEO COMPLETO"));
    }
    return /*#__PURE__*/React.createElement("g", {
      transform: escalar(cx, cy, s, rot)
    }, /*#__PURE__*/React.createElement("rect", {
      x: 105,
      y: 465,
      width: 888,
      height: 612,
      rx: 30,
      fill: C.NAVY
    }), /*#__PURE__*/React.createElement("rect", {
      x: 101,
      y: 461,
      width: 880,
      height: 604,
      rx: 26,
      fill: C.BLANCO,
      stroke: C.NAVY,
      strokeWidth: 8
    }), /*#__PURE__*/React.createElement("g", {
      clipPath: "url(#clipImg)"
    }, cuadro), /*#__PURE__*/React.createElement("text", {
      x: 131,
      y: 1023,
      fontFamily: MONT,
      fontWeight: 700,
      fontSize: 40,
      fill: C.NAVY
    }, "Video completo \xB7 @eltorvick"));
  }

  /* ---------- el boton y el cursor que lo aprieta ---------- */

  var CLIC = 2.6; // segundo (desde el cierre) del "clic" del audio original

  // medido cuadro a cuadro en el original: entra pasandose a 1,10, el clic lo aprieta a 0,93
  // y despues late (±3 %, cada 0,93 s) hasta el final
  function escalaBoton(T) {
    if (T < 0.6) return 0;
    if (T < 0.87) return 1.1 * Easing.easeOutQuad((T - 0.6) / 0.27);
    if (T < 1.03) return 1.1 - 0.1 * Easing.easeInOutSine((T - 0.87) / 0.16);
    if (T < CLIC - 0.03) return 1;
    if (T < CLIC + 0.13) return 0.933;
    return 1.007 + 0.031 * Math.cos(2 * Math.PI * (T - (CLIC + 0.17)) / 0.93);
  }
  function Boton(props) {
    var T = props.t;
    var s = escalaBoton(T);
    if (s <= 0) return null;
    var texto = 'MIRA EL VIDEO COMPLETO',
      tam = 53;
    var tw = ancho(texto, 800, tam, MONT);
    var esc = tw > 0 ? 671 / tw : 1; // el texto del original mide 671 px
    return /*#__PURE__*/React.createElement("g", {
      transform: escalar(540, 1171, s)
    }, /*#__PURE__*/React.createElement("rect", {
      x: 117,
      y: 1112,
      width: 862,
      height: 134,
      rx: 67,
      fill: C.NAVY
    }), /*#__PURE__*/React.createElement("rect", {
      x: 113,
      y: 1108,
      width: 854,
      height: 126,
      rx: 63,
      fill: C.RED,
      stroke: C.NAVY,
      strokeWidth: 8
    }), /*#__PURE__*/React.createElement("path", {
      d: "M160 1152 L192 1171 L160 1190 Z",
      fill: C.BLANCO,
      stroke: C.BLANCO,
      strokeWidth: 4,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("text", {
      x: 230,
      y: 1190,
      fontFamily: MONT,
      fontWeight: 800,
      fontSize: tam * esc,
      fill: C.BLANCO
    }, texto));
  }
  function Cursor(props) {
    var T = props.t;
    var a = 1.93,
      b = 2.5;
    if (T < a) return null;
    var p = Easing.easeOutQuad(k01(T, a, b - a));
    var x = 1075 + (700 - 1075) * p + Math.sin(T * 2.1) * 2 * k01(T, b, 0.4);
    var y = 1585 + (1176 - 1585) * p + Math.cos(T * 1.7) * 2 * k01(T, b, 0.4);
    var s = 1 - 0.12 * bump(T, CLIC - 0.08, CLIC + 0.14);
    var anillo = k01(T, CLIC, 0.5);
    return /*#__PURE__*/React.createElement("g", null, anillo > 0 && anillo < 1 ? /*#__PURE__*/React.createElement("circle", {
      cx: 700,
      cy: 1176,
      r: 16 + 58 * Easing.easeOutCubic(anillo),
      fill: "none",
      stroke: C.RED,
      strokeWidth: 6,
      opacity: 0.75 * (1 - anillo)
    }) : null, /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + x + ' ' + y + ') scale(' + s + ')'
    }, /*#__PURE__*/React.createElement("path", {
      d: "M0 0 L0 80 L19 62 L33 94 L48 87 L34 56 L60 56 Z",
      fill: C.BLANCO,
      stroke: C.NAVY,
      strokeWidth: 7,
      strokeLinejoin: "round"
    })));
  }

  /* ---------- subtitulos palabra por palabra (como los del short) ---------- */

  // ANTES: los tiempos de las palabras son el primer cuadro en que se ven grandes; el pop arranca un poco antes
  var ANTES = 0.04;
  var SUB = {
    tam: 82,
    y: 1428,
    fila: 96,
    max: 1000,
    hueco: 0.42,
    peso: 900,
    familia: MONT,
    borde: 18
  };
  function armarFilas(palabras) {
    var filas = [],
      act = [],
      w = 0,
      hueco = SUB.hueco * SUB.tam;
    palabras.forEach(function (p) {
      var pw = ancho(p[1], SUB.peso, SUB.tam, SUB.familia);
      var nuevo = act.length ? w + hueco + pw : pw;
      if (act.length && nuevo > SUB.max) {
        filas.push({
          ps: act,
          w: w
        });
        act = [];
        nuevo = pw;
      }
      act.push({
        t: p[0],
        txt: p[1],
        w: pw
      });
      w = nuevo;
    });
    if (act.length) filas.push({
      ps: act,
      w: w
    });
    return filas;
  }
  function Subtitulos(props) {
    var Tabs = props.T,
      def = props.def;
    var linea = null;
    (def.subs || []).forEach(function (l) {
      if (l.palabras.length && Tabs >= l.palabras[0][0] && Tabs < l.fin) linea = l;
    });
    if (!linea) return null;
    var filas = armarFilas(linea.palabras);
    var vistas = linea.palabras.filter(function (p) {
      return p[0] - ANTES <= Tabs;
    }).length;
    var n = 0,
      out = [],
      hueco = SUB.hueco * SUB.tam;
    filas.forEach(function (f, fi) {
      var x = 540 - f.w / 2,
        y = SUB.y + fi * SUB.fila;
      f.ps.forEach(function (p) {
        n += 1;
        if (p.t - ANTES <= Tabs) {
          var actual = n === vistas;
          var s = 0.55 + 0.45 * back(k01(Tabs, p.t - ANTES, 0.15), 2.4);
          // la palabra que suena: amarilla, un poco mas grande e inclinada (las largas no pasan de 900 px)
          if (actual) s *= Math.min(1.06, 900 / p.w);
          var cxp = x + p.w / 2,
            cyp = y - SUB.tam * 0.35;
          var base = {
            x: cxp,
            y: y,
            textAnchor: 'middle',
            fontFamily: SUB.familia,
            fontWeight: SUB.peso,
            fontSize: SUB.tam,
            strokeWidth: SUB.borde,
            strokeLinejoin: 'round',
            paintOrder: 'stroke'
          };
          out.push(/*#__PURE__*/React.createElement("g", {
            key: n,
            transform: escalar(cxp, cyp, s, actual ? -1.6 : 0)
          }, /*#__PURE__*/React.createElement("text", _extends({}, base, {
            transform: "translate(3 5)",
            fill: C.TINTA,
            stroke: C.TINTA
          }), p.txt), /*#__PURE__*/React.createElement("text", _extends({}, base, {
            fill: actual ? C.YEL : C.BLANCO,
            stroke: C.TINTA
          }), p.txt)));
        }
        x += p.w + hueco;
      });
    });
    return /*#__PURE__*/React.createElement("g", null, out);
  }

  /* ---------- el cierre completo ---------- */

  // las medidas de arriba son las del ultimo segundo del original (t = 4,7); antes la escena
  // es un poco mas chica: crece 0,49 % por segundo desde el centro (540, 905)
  var ZOOM = {
    cx: 540,
    cy: 905,
    vel: 0.0049,
    ref: 4.7
  };
  function zoomEscena(t) {
    return 1 + ZOOM.vel * (t - ZOOM.ref);
  }
  var CAJA_IMG = {
    x: 131,
    y: 492,
    w: 818,
    h: 448
  };
  function Cierre(props) {
    var def = props.def,
      T = props.T; // T: segundo del short original
    var t = T - def.desde;
    var mini = props.miniatura || null;
    return /*#__PURE__*/React.createElement("svg", {
      width: 1080,
      height: 1920,
      viewBox: "0 0 1080 1920",
      style: {
        display: 'block',
        background: C.BLANCO
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: "clipImg"
    }, /*#__PURE__*/React.createElement("rect", {
      x: 131,
      y: 492,
      width: 818,
      height: 458,
      rx: 20
    })), /*#__PURE__*/React.createElement("linearGradient", {
      id: "clipIG",
      x1: "0",
      y1: "1",
      x2: "1",
      y2: "0"
    }, /*#__PURE__*/React.createElement("stop", {
      offset: "0",
      stopColor: "#FEDA75"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.35",
      stopColor: "#FA7E1E"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "0.6",
      stopColor: "#D62976"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#4F5BD5"
    }))), /*#__PURE__*/React.createElement("rect", {
      width: 1080,
      height: 1920,
      fill: C.BLANCO
    }), /*#__PURE__*/React.createElement("g", {
      transform: escalar(ZOOM.cx, ZOOM.cy, zoomEscena(t))
    }, t >= 0 ? /*#__PURE__*/React.createElement("circle", {
      cx: 540,
      cy: 811,
      r: 480,
      fill: C.CIRC
    }) : null, /*#__PURE__*/React.createElement(Tarjeta, {
      t: t,
      def: def,
      miniatura: mini
    }), /*#__PURE__*/React.createElement(Boton, {
      t: t
    }), /*#__PURE__*/React.createElement(Redes, {
      t: t
    })), /*#__PURE__*/React.createElement(Subtitulos, {
      T: T,
      def: def
    }), /*#__PURE__*/React.createElement(Cursor, {
      t: t
    }));
  }

  /* ---------- registro ---------- */

  var REGISTRO = [];
  function registrar(def) {
    for (var i = 0; i < REGISTRO.length; i++) if (REGISTRO[i].id === def.id) {
      REGISTRO[i] = def;
      return def;
    }
    REGISTRO.push(def);
    return def;
  }
  global.CLIPS = {
    registrar: registrar,
    lista: function () {
      return REGISTRO.slice();
    },
    buscar: function (id) {
      return REGISTRO.filter(function (d) {
        return d.id === id;
      })[0] || null;
    },
    Cierre: Cierre,
    C: C,
    // para que herramientas/cierre-clip.js recorte la imagen de la tarjeta original donde esta
    cajaImagen: function (t) {
      var z = zoomEscena(t);
      return {
        x: ZOOM.cx + (CAJA_IMG.x - ZOOM.cx) * z,
        y: ZOOM.cy + (CAJA_IMG.y - ZOOM.cy) * z,
        w: CAJA_IMG.w * z,
        h: CAJA_IMG.h * z,
        wBase: CAJA_IMG.w,
        hBase: CAJA_IMG.h
      };
    }
  };

  /* ---------- la pagina (clips.html) ---------- */

  // #id            vista previa del cierre + el guion del short
  // #id/render     solo el lienzo 1080x1920, con window.CLIP para grabar cuadro por cuadro
  function ruta() {
    var h = (global.location.hash || '').replace(/^#/, '').split('/');
    var lista = global.CLIPS.lista();
    var id = h[0] || lista[0] && lista[0].id;
    return {
      id: id,
      render: h[1] === 'render'
    };
  }
  function miniaturaDe(def) {
    if (global.CLIP_MINIATURA) return global.CLIP_MINIATURA; // la inyecta herramientas/cierre-clip.js
    return def && def.miniatura ? {
      src: def.miniatura,
      recorte: false
    } : null;
  }
  function Render(props) {
    var def = props.def;
    var st = useState(def.desde);
    var T = st[0],
      setT = st[1];
    useEffect(function () {
      global.CLIP = {
        id: def.id,
        desde: def.desde,
        fin: def.fin,
        seek: function (v) {
          setT(v);
        },
        listo: true
      };
    }, [def.id]);
    return /*#__PURE__*/React.createElement(Cierre, {
      def: def,
      T: T,
      miniatura: miniaturaDe(def)
    });
  }
  function fmt(s) {
    var m = Math.floor(s / 60);
    return m + ':' + ('0' + (s - 60 * m).toFixed(1)).slice(-4);
  }
  function Vista(props) {
    var def = props.def;
    var total = def.fin - def.desde;
    return /*#__PURE__*/React.createElement("div", {
      className: "cl-cuerpo"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cl-lienzo"
    }, /*#__PURE__*/React.createElement(Stage, {
      ancho: 1080,
      alto: 1920,
      total: total
    }, /*#__PURE__*/React.createElement(Compuesto, {
      def: def
    }))), /*#__PURE__*/React.createElement("div", {
      className: "cl-guion"
    }, /*#__PURE__*/React.createElement("h2", null, "Guion \u2014 ", def.titulo), /*#__PURE__*/React.createElement("p", {
      className: "cl-tenue"
    }, "La voz del short (lo que dicen los subt\xEDtulos) y lo que se ve. El cierre de la izquierda es el que pega ", /*#__PURE__*/React.createElement("code", null, "herramientas/cierre-clip.js"), " desde el segundo ", def.desde.toFixed(2), "."), /*#__PURE__*/React.createElement("ol", null, (def.guion || []).map(function (l, i) {
      return /*#__PURE__*/React.createElement("li", {
        key: i
      }, /*#__PURE__*/React.createElement("span", {
        className: "cl-t"
      }, fmt(l.ini), "\u2013", fmt(l.fin)), /*#__PURE__*/React.createElement("span", {
        className: "cl-voz"
      }, l.texto), l.pantalla ? /*#__PURE__*/React.createElement("span", {
        className: "cl-pant"
      }, "En pantalla: ", l.pantalla) : null);
    }))));
  }
  function Compuesto(props) {
    var comp = useComposition();
    return /*#__PURE__*/React.createElement(Cierre, {
      def: props.def,
      T: props.def.desde + comp.T,
      miniatura: miniaturaDe(props.def)
    });
  }
  function App() {
    var st = useState(ruta());
    var r = st[0],
      setR = st[1];
    useEffect(function () {
      var f = function () {
        setR(ruta());
      };
      global.addEventListener('hashchange', f);
      return function () {
        global.removeEventListener('hashchange', f);
      };
    }, []);
    var def = global.CLIPS.buscar(r.id);
    if (!def) return /*#__PURE__*/React.createElement("div", {
      className: "cl-pagina"
    }, "No hay clips registrados.");
    if (r.render) return /*#__PURE__*/React.createElement(Render, {
      key: def.id,
      def: def
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "cl-pagina"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cl-botones"
    }, global.CLIPS.lista().map(function (d) {
      return /*#__PURE__*/React.createElement("a", {
        key: d.id,
        href: '#' + d.id,
        className: d.id === def.id ? 'activo' : ''
      }, d.titulo);
    })), /*#__PURE__*/React.createElement(Vista, {
      key: def.id,
      def: def
    }));
  }
  global.CLIPS.montar = function (el) {
    ReactDOM.createRoot(el).render(/*#__PURE__*/React.createElement(App, null));
  };
})(window);
