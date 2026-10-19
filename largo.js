/* GENERADO por compilar.js desde largo.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   LARGO — window.LARGOS: la edicion de los videos largos de YouTube (16:9)

   El video con los cortes finales es la base y encima se apilan capas que se
   calculan desde un unico T = segundo del video (la voz manda el tiempo):

     camara   el video con encuadres (plano, primer plano, golpe de zoom,
              empuje lento), blanco y negro, y metida en una tarjeta al costado
     detras   textos gigantes DETRAS de la persona (mascara de recortar.py)
     escenas  explicaciones a pantalla completa (papel claro o tinta) con
              entradas de latigo, barrido, zoom o fundido
     encima   titulares al costado, frases clave, etiquetas, tarjetas, datos,
              recortes de estudios, CTA de suscripcion

   El lenguaje: el de las animaciones originales de disciplina (linea negra fina
   sobre fondo claro, monigotes, dianas, barras amarillas, etiquetas negras con
   flechita) llevado a nivel profesional: tipografia Inter Tight, entradas con
   mascara y desenfoque, sombras suaves, empuje lento. Nada de emojis.

   Cada video es largos/<id>/plan.jsx: arma una lista de "beats" con
   LARGOS.plan.* y llama a LARGOS.registrar({ id, titulo, video, plan }).
   Pagina: largo.html#<id> (vista previa con el video) · #<id>/render (grabar).
   El estilo y las reglas estan en LARGOS.md.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useLayoutEffect = React.useLayoutEffect;
  var useRef = React.useRef;
  var M = global.M;
  var Easing = global.Easing,
    clamp = global.clamp;
  var ANCHO = 1920,
    ALTO = 1080,
    FPS = 30;
  var INK = '#14110F',
    YEL = '#FFD400',
    RED = '#E03A2F',
    GRN = '#16A06A',
    GRY = '#C9C3B8';
  var BLANCO = '#FFFFFF';
  // neutros del papel (tintes de la paleta, no colores nuevos)
  var PAPEL = '#F4F3F0',
    PAPEL_BORDE = '#E3E0DA',
    TENUE = 'rgba(20,17,15,0.38)',
    LINEA_SUAVE = 'rgba(20,17,15,0.12)';
  var COLOR = {
    amarillo: YEL,
    blanco: BLANCO,
    rojo: RED,
    verde: GRN,
    gris: GRY,
    negro: INK,
    tinta: INK,
    tenue: TENUE
  };
  var F = "'Inter Tight', 'Inter', 'Helvetica Neue', Arial, sans-serif";
  var F_MONO = "'IBM Plex Mono', 'Courier Prime', monospace";
  var SOMBRA = '0 2px 4px rgba(20,17,15,0.10), 0 22px 80px rgba(20,17,15,0.22)';
  var SOMBRA_CHICA = '0 1px 3px rgba(20,17,15,0.10), 0 12px 36px rgba(20,17,15,0.16)';
  // texto blanco sobre la camara: sombra suave y ancha, sin contorno
  var SOMBRA_TX = '0 2px 4px rgba(0,0,0,0.30), 0 8px 40px rgba(0,0,0,0.45)';
  function col(c, def) {
    return COLOR[c] || c || def;
  }

  // pseudoazar estable: el mismo texto da siempre la misma fase
  function hash(s) {
    var h = 2166136261;
    s = String(s);
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) / 4294967295;
  }
  function norm(p) {
    return String(p).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ%]/g, '');
  }

  /* =========================================================
     MOVIMIENTO
     Entradas: suben, se enfocan y aparecen con ease-out exponencial (el
     "acelerar y frenar en seco" de After Effects). Salidas: rapidas, hacia
     arriba con desenfoque. Lo que queda en pantalla deriva muy despacio.
     ========================================================= */

  // sobreimpulso leve (~4 %): solo para circulos y signos, nunca rebote de caricatura
  function suave(u) {
    var k = 0.9;
    u = u - 1;
    return u * u * ((k + 1) * u + k) + 1;
  }

  // 0..1 con ease-out exponencial
  function prog(T, c, dur, ease) {
    return (ease || Easing.easeOutExpo)(clamp((T - c) / (dur || 0.6), 0, 1));
  }

  // entrada estandar. o: { dur, dy, dx, desde (escala que le falta), blur }
  function entra(T, c, o) {
    o = o || {};
    var dur = o.dur || 0.5;
    var p = prog(T, c, dur, o.ease);
    return {
      p: p,
      opacity: T >= c ? clamp(0.25 + (T - c) / (dur * 0.4), 0, 1) : 0,
      x: (o.dx || 0) * (1 - p),
      y: (o.dy == null ? 36 : o.dy) * (1 - p),
      escala: 1 - (o.desde == null ? 0.05 : o.desde) * (1 - p),
      blur: (o.blur == null ? 12 : o.blur) * (1 - p),
      giro: (o.giro || 0) * (1 - p)
    };
  }

  // salida estandar (s = cuando empieza a irse)
  function sale(T, s, dur) {
    if (s == null) return {
      p: 0,
      opacity: 1,
      x: 0,
      y: 0,
      escala: 1,
      blur: 0,
      giro: 0
    };
    var p = Easing.easeInCubic(clamp((T - s) / (dur || 0.26), 0, 1));
    return {
      p: p,
      opacity: 1 - p,
      x: 0,
      y: -22 * p,
      escala: 1 - 0.03 * p,
      blur: 10 * p,
      giro: 0
    };
  }
  function junta(a, b) {
    return {
      p: a.p,
      opacity: a.opacity * b.opacity,
      x: a.x + b.x,
      y: a.y + b.y,
      escala: a.escala * b.escala,
      blur: a.blur + b.blur,
      giro: (a.giro || 0) + (b.giro || 0)
    };
  }

  // deriva lenta: lo que queda en pantalla nunca esta quieto del todo
  function deriva(T, fase, amp) {
    return M.life(T, 5.2, amp == null ? 3 : amp, fase || 0);
  }

  // caja absoluta posicionada por un punto de anclaje (centro | izq | der)
  function Pos(props) {
    var e = props.e || {
      opacity: 1,
      x: 0,
      y: 0,
      escala: 1,
      blur: 0
    };
    if (e.opacity <= 0.002) return null;
    var dx = (props.dx || 0) + (e.x || 0),
      dy = (props.dy || 0) + (e.y || 0);
    var sc = (e.escala == null ? 1 : e.escala) * (props.esc || 1);
    var rot = (props.rot || 0) + (e.giro || 0);
    var ancla = props.ancla === 'izq' ? 'translate(0,-50%)' : props.ancla === 'der' ? 'translate(-100%,-50%)' : props.ancla === 'arriba' ? 'translate(-50%,0)' : 'translate(-50%,-50%)';
    var origen = props.ancla === 'izq' ? '0 50%' : props.ancla === 'der' ? '100% 50%' : '50% 50%';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: props.x,
        top: props.y,
        opacity: e.opacity,
        transform: ancla + ' translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px) rotate(' + rot.toFixed(3) + 'deg) scale(' + sc.toFixed(4) + ')',
        transformOrigin: origen,
        filter: e.blur > 0.15 ? 'blur(' + e.blur.toFixed(2) + 'px)' : undefined,
        zIndex: props.z || 'auto',
        width: props.w,
        pointerEvents: 'none'
      }
    }, props.children);
  }

  /* =========================================================
     SONIDOS: cada beat marca sus efectos; la pista la arma
     herramientas/audio.py (pop, whoosh, ding, error, golpe, click,
     campana, subida, marca)
     ========================================================= */

  var CUES = {};
  function sonido(tipo, t, g) {
    if (t == null || !(t >= 0)) return;
    var k = tipo + '@' + t.toFixed(3);
    if (!CUES[k]) CUES[k] = {
      tipo: tipo,
      t: Math.round(t * 1000) / 1000,
      g: g == null ? 1 : g
    };
  }
  function listaCues() {
    return Object.keys(CUES).map(function (k) {
      return CUES[k];
    }).sort(function (a, b) {
      return a.t - b.t;
    });
  }

  /* =========================================================
     TIPOGRAFIA CINETICA
     Cada palabra sube desde detras de una mascara (su propia linea de corte),
     se enfoca y aparece. Las palabras marcadas llevan caja amarilla que se
     estira de izquierda a derecha y el texto pasa a tinta (el resaltado de
     Borja). tiempos: el segundo de cada palabra (de la voz) o c + escalonado.
     ========================================================= */

  function Palabras(props) {
    var T = props.T;
    var fs = props.fs || 96;
    var color = col(props.color, INK);
    var acento = props.acento || 'caja'; // caja | color | ninguno
    var colorAcento = col(props.colorAcento, YEL);
    // 'palabra' o 'palabra:color' (verde, rojo…): el color de la caja de esa palabra
    var marcadas = [],
      colorDe = {};
    (props.marcadas || []).forEach(function (m) {
      var partes = String(m).split(':');
      var k = norm(partes[0]);
      marcadas.push(k);
      if (partes[1]) colorDe[k] = col(partes[1]);
    });
    var marcarTodo = props.marcarTodo;
    var esc = props.escalonado == null ? 0.06 : props.escalonado;
    var lineas = String(props.txt).split('\n');
    var k = 0;
    var salida = props.s;
    var mayus = props.mayus;
    var filas = lineas.map(function (ln, li) {
      var pals = ln.split(' ').filter(Boolean);
      return /*#__PURE__*/React.createElement("div", {
        key: li,
        style: {
          display: 'flex',
          flexWrap: props.ancho ? 'wrap' : 'nowrap',
          justifyContent: props.alinear === 'izq' ? 'flex-start' : props.alinear === 'der' ? 'flex-end' : 'center',
          columnGap: fs * 0.24,
          rowGap: fs * 0.04,
          marginTop: li ? fs * (props.interlinea == null ? 0.02 : props.interlinea) : 0
        }
      }, pals.map(function (pal, pi) {
        var i = k++;
        var c = props.tiempos && props.tiempos[i] != null ? props.tiempos[i] : (props.c || 0) + i * esc;
        var dur = props.dur || 0.45;
        var p = prog(T, c, dur);
        var op = T >= c ? clamp(0.3 + (T - c) / (dur * 0.35), 0, 1) : 0;
        var fuera = salida == null ? 0 : Easing.easeInCubic(clamp((T - salida - (props.salidaEsc || 0) * i) / 0.24, 0, 1));
        var marcada = marcarTodo || marcadas.indexOf(norm(pal)) >= 0;
        var pb = marcada ? prog(T, c + 0.08, 0.45, Easing.easeOutQuart) : 0;
        var cajaPal = colorDe[norm(pal)] || colorAcento;
        var tintaCaja = cajaPal === YEL || cajaPal === BLANCO ? INK : BLANCO;
        var colorPal = marcada && acento === 'caja' ? pb > 0.35 ? tintaCaja : color : marcada && acento === 'color' ? cajaPal : color;
        var texto = mayus ? pal.toUpperCase() : pal;
        return /*#__PURE__*/React.createElement("span", {
          key: pi,
          style: {
            position: 'relative',
            display: 'inline-block',
            opacity: 1 - fuera,
            transform: 'translateY(' + (-fs * 0.25 * fuera).toFixed(1) + 'px)'
          }
        }, marcada && acento === 'caja' ? /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'absolute',
            left: -fs * 0.12,
            right: -fs * 0.12,
            top: fs * 0.06,
            bottom: fs * 0.02,
            background: cajaPal,
            borderRadius: fs * 0.1,
            transformOrigin: '0 50%',
            transform: 'scaleX(' + pb.toFixed(4) + ')',
            boxShadow: props.sombra ? '0 6px 24px rgba(0,0,0,0.25)' : undefined
          }
        }) : null, /*#__PURE__*/React.createElement("span", {
          style: {
            display: 'inline-block',
            overflow: 'hidden',
            verticalAlign: 'top',
            padding: fs * 0.04 + 'px ' + fs * 0.06 + 'px ' + fs * 0.12 + 'px',
            margin: -fs * 0.04 + 'px ' + -fs * 0.06 + 'px ' + -fs * 0.12 + 'px'
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            display: 'inline-block',
            position: 'relative',
            opacity: op,
            transform: 'translateY(' + ((1 - p) * 92).toFixed(2) + '%)',
            filter: p < 0.98 ? 'blur(' + ((1 - p) * fs * 0.06).toFixed(2) + 'px)' : undefined,
            fontFamily: F,
            fontWeight: props.peso || 800,
            fontSize: fs,
            lineHeight: 1.04,
            color: colorPal,
            letterSpacing: props.tracking || '-0.025em',
            fontStyle: props.italica ? 'italic' : 'normal',
            textShadow: props.sombra && !(marcada && acento === 'caja') ? SOMBRA_TX : undefined,
            whiteSpace: 'nowrap'
          }
        }, texto)));
      }));
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: props.ancho,
        alignItems: props.alinear === 'izq' ? 'flex-start' : props.alinear === 'der' ? 'flex-end' : 'center'
      }
    }, filas);
  }

  // etiqueta negra con flechita (la de las animaciones originales, en limpio)
  function Etiqueta(props) {
    var fs = 34 * (props.tam || 1);
    var dir = props.dir || 'izq';
    var fondo = col(props.fondo, INK);
    var tx = fondo === YEL || fondo === BLANCO ? INK : BLANCO;
    var tri = fs * 0.62;
    var flecha = function (lado) {
      return /*#__PURE__*/React.createElement("svg", {
        width: tri * 0.9,
        height: tri * 1.2,
        viewBox: "0 0 9 12",
        style: {
          display: 'block',
          flex: 'none',
          transform: lado === 'izq' ? 'none' : 'scaleX(-1)',
          margin: lado === 'izq' ? '0 -1px 0 0' : '0 0 0 -1px'
        }
      }, /*#__PURE__*/React.createElement("path", {
        d: "M 9 0 L 9 12 L 0 6 Z",
        fill: fondo
      }));
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center'
      }
    }, dir === 'izq' ? flecha('izq') : null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 700,
        fontSize: fs,
        color: tx,
        background: fondo,
        lineHeight: 1,
        padding: fs * 0.36 + 'px ' + fs * 0.6 + 'px ' + fs * 0.38 + 'px',
        borderRadius: fs * 0.16,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        boxShadow: props.sombra ? SOMBRA_CHICA : undefined
      }
    }, props.children), dir === 'der' ? flecha('der') : null);
  }

  /* =========================================================
     ICONOS DE LINEA (LARGOS.I, en largo-iconos.jsx)
     Cada icono es una lista de trazos en un lienzo de 200x200:
       { d: 'M...' } path · { c: [cx, cy, r] } circulo · { r: [x, y, w, h, rx] } rect
       f: relleno  b blanco · a acento · t tinta · r rojo · v verde · g gris · n nada (por defecto)
       w: multiplica el grosor · s: 0 sin trazo
     Se dibujan solos (cada trazo en orden) y el relleno aparece despues.
     ========================================================= */

  var RELLENO = {
    b: BLANCO,
    t: INK,
    r: RED,
    v: GRN,
    g: GRY,
    n: 'none'
  };
  function Trazos(props) {
    var lista = props.lista || [];
    var p = props.p == null ? 1 : props.p;
    var n = lista.length || 1;
    var grosor = props.grosor || 7;
    var acento = col(props.acento, YEL);
    var tinta = col(props.tinta, INK);
    return lista.map(function (s, i) {
      var pi = clamp((p - 0.45 * i / n) / 0.55, 0, 1);
      if (pi <= 0) return null;
      var f = s.f || 'n';
      var relleno = f === 'a' ? acento : f === 't' ? tinta : RELLENO[f] || 'none';
      var pr = clamp((pi - 0.55) / 0.45, 0, 1);
      var comun = {
        key: i,
        fill: relleno,
        fillOpacity: relleno === 'none' ? undefined : pr,
        stroke: s.s === 0 ? 'none' : s.k ? col(s.k, tinta) : tinta,
        strokeWidth: grosor * (s.w || 1),
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        pathLength: 1,
        strokeDasharray: pi < 1 ? '1 1' : undefined,
        strokeDashoffset: pi < 1 ? 1 - pi : undefined
      };
      if (s.c) return /*#__PURE__*/React.createElement("circle", _extends({
        cx: s.c[0],
        cy: s.c[1],
        r: s.c[2]
      }, comun));
      if (s.r) return /*#__PURE__*/React.createElement("rect", _extends({
        x: s.r[0],
        y: s.r[1],
        width: s.r[2],
        height: s.r[3],
        rx: s.r[4] || 0
      }, comun));
      return /*#__PURE__*/React.createElement("path", _extends({
        d: s.d
      }, comun));
    });
  }

  // icono suelto: n = nombre en LARGOS.I. p (0..1) o c (cuando se dibuja)
  function Ico(props) {
    var lista = global.LARGOS && global.LARGOS.I && global.LARGOS.I[props.n] || null;
    if (!lista) {
      if (global.console && !Ico.avisados[props.n]) {
        Ico.avisados[props.n] = 1;
        console.warn('falta el icono', props.n);
      }
      lista = [{
        c: [100, 100, 70],
        f: 'b'
      }, {
        d: 'M 80 80 Q 100 56 120 80 Q 120 98 100 104 L 100 118'
      }, {
        c: [100, 140, 3],
        f: 't'
      }];
    }
    var tam = props.tam || 200;
    var p = props.p != null ? props.p : prog(props.T, props.c, props.dur || 0.9, Easing.easeInOutCubic);
    return /*#__PURE__*/React.createElement("svg", {
      width: tam,
      height: tam,
      viewBox: "0 0 200 200",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement(Trazos, {
      lista: lista,
      p: p,
      grosor: props.grosor || 7,
      acento: props.acento,
      tinta: props.tinta
    }));
  }
  Ico.avisados = {};

  /* =========================================================
     MONIGOTE: la figura de palitos de las animaciones originales.
     Pose = articulaciones en un cuadro de 200 x 300 (pies en y = 290).
     ========================================================= */

  var POSES = {
    depie: {
      cab: [100, 52],
      cue: [100, 84],
      cad: [100, 178],
      ci: [78, 128],
      mi: [70, 172],
      cd: [122, 128],
      md: [130, 172],
      ri: [88, 232],
      pi: [82, 288],
      rd: [112, 232],
      pd: [118, 288]
    },
    brazos: {
      cab: [100, 52],
      cue: [100, 84],
      cad: [100, 178],
      ci: [62, 62],
      mi: [46, 22],
      cd: [138, 62],
      md: [154, 22],
      ri: [86, 232],
      pi: [76, 288],
      rd: [114, 232],
      pd: [124, 288]
    },
    senala: {
      cab: [100, 52],
      cue: [100, 84],
      cad: [100, 178],
      ci: [80, 128],
      mi: [72, 172],
      cd: [138, 96],
      md: [182, 80],
      ri: [88, 232],
      pi: [82, 288],
      rd: [112, 232],
      pd: [118, 288]
    },
    empuja: {
      cab: [128, 70],
      cue: [118, 98],
      cad: [88, 184],
      ci: [146, 118],
      mi: [174, 114],
      cd: [150, 128],
      md: [178, 126],
      ri: [78, 236],
      pi: [50, 288],
      rd: [112, 232],
      pd: [128, 288]
    },
    triste: {
      cab: [104, 66],
      cue: [100, 94],
      cad: [100, 184],
      ci: [86, 138],
      mi: [84, 180],
      cd: [114, 138],
      md: [116, 180],
      ri: [92, 236],
      pi: [88, 288],
      rd: [108, 236],
      pd: [112, 288]
    },
    sentado: {
      cab: [98, 92],
      cue: [96, 124],
      cad: [92, 208],
      ci: [112, 168],
      mi: [152, 172],
      cd: [118, 164],
      md: [158, 168],
      ri: [152, 208],
      pi: [154, 288],
      rd: [146, 212],
      pd: [146, 288]
    },
    piensa: {
      cab: [100, 52],
      cue: [100, 84],
      cad: [100, 178],
      ci: [78, 128],
      mi: [70, 172],
      cd: [128, 122],
      md: [112, 76],
      ri: [88, 232],
      pi: [82, 288],
      rd: [112, 232],
      pd: [118, 288]
    },
    carga: {
      cab: [100, 60],
      cue: [100, 92],
      cad: [100, 184],
      ci: [70, 66],
      mi: [70, 30],
      cd: [130, 66],
      md: [130, 30],
      ri: [80, 236],
      pi: [72, 288],
      rd: [120, 236],
      pd: [128, 288]
    },
    caido: {
      cab: [40, 262],
      cue: [64, 270],
      cad: [138, 276],
      ci: [70, 236],
      mi: [60, 206],
      cd: [92, 248],
      md: [112, 226],
      ri: [166, 250],
      pi: [196, 268],
      rd: [172, 280],
      pd: [204, 286]
    }
  };
  function lerp(a, b, k) {
    return a + (b - a) * k;
  }
  function mezclaPose(a, b, k) {
    var out = {};
    Object.keys(a).forEach(function (j) {
      out[j] = [lerp(a[j][0], b[j][0], k), lerp(a[j][1], b[j][1], k)];
    });
    return out;
  }
  // ciclo de caminar o correr (fase en vueltas)
  function poseCamina(fase, corre) {
    var s = Math.sin(fase * Math.PI * 2),
      c = Math.cos(fase * Math.PI * 2);
    var a = corre ? 1.6 : 1;
    var lean = corre ? 10 : 2;
    var pI = Math.max(0, c),
      pD = Math.max(0, -c); // la pierna que va por el aire dobla la rodilla
    return {
      cab: [100 + lean * 1.4, 54 - Math.abs(s) * 4 * a],
      cue: [100 + lean, 86 - Math.abs(s) * 3 * a],
      cad: [100, 178 - Math.abs(s) * 3 * a],
      ci: [100 - 12 - 20 * s * a, 128],
      mi: [100 - 18 - 34 * s * a, corre ? 150 : 170],
      cd: [100 + 12 + 20 * s * a, 128],
      md: [100 + 18 + 34 * s * a, corre ? 150 : 170],
      ri: [100 + 22 * s * a + 16 * pI + (corre ? 10 : 0), 232 - pI * 10 * a],
      pi: [100 + 36 * s * a - 4 * pI, 288 - pI * 24 * a],
      rd: [100 - 22 * s * a + 16 * pD + (corre ? 10 : 0), 232 - pD * 10 * a],
      pd: [100 - 36 * s * a - 4 * pD, 288 - pD * 24 * a]
    };
  }

  // pose: nombre | objeto de articulaciones | { de, a, k }. camina/corre: fase
  function Monigote(props) {
    var tam = props.tam || 300; // alto en px
    var g = props.grosor || 7.5;
    var pose = props.pose || 'depie';
    var resolver = function (q) {
      if (q === 'camina' || q === 'corre') return poseCamina(props.fase || 0, q === 'corre');
      if (typeof q === 'string') return POSES[q] || POSES.depie;
      return q;
    };
    var J = pose && pose.de ? mezclaPose(resolver(pose.de), resolver(pose.a), clamp(pose.k, 0, 1)) : resolver(pose);
    var p = props.p == null ? 1 : props.p;
    var tinta = col(props.color, INK);
    var seg = function (pts) {
      return 'M ' + pts.map(function (q) {
        return q[0].toFixed(1) + ' ' + q[1].toFixed(1);
      }).join(' L ');
    };
    var trazos = [seg([J.cue, J.cad]), seg([J.cue, J.ci, J.mi]), seg([J.cue, J.cd, J.md]), seg([J.cad, J.ri, J.pi]), seg([J.cad, J.rd, J.pd])];
    var dibujo = function (d, i) {
      var pi = clamp((p - 0.12 - 0.1 * i) / 0.5, 0, 1);
      if (pi <= 0) return null;
      return /*#__PURE__*/React.createElement("path", {
        key: i,
        d: d,
        fill: "none",
        stroke: tinta,
        strokeWidth: g,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        pathLength: 1,
        strokeDasharray: pi < 1 ? '1 1' : undefined,
        strokeDashoffset: pi < 1 ? 1 - pi : undefined
      });
    };
    var pc = clamp(p / 0.25, 0, 1);
    return /*#__PURE__*/React.createElement("svg", {
      width: tam * 2 / 3,
      height: tam,
      viewBox: "0 0 200 300",
      style: {
        display: 'block',
        overflow: 'visible',
        transform: props.espejo ? 'scaleX(-1)' : undefined
      }
    }, trazos.map(dibujo), pc > 0 ? /*#__PURE__*/React.createElement("circle", {
      cx: J.cab[0],
      cy: J.cab[1],
      r: 24,
      fill: col(props.cabeza, BLANCO),
      stroke: tinta,
      strokeWidth: g,
      pathLength: 1,
      strokeDasharray: pc < 1 ? '1 1' : undefined,
      strokeDashoffset: pc < 1 ? 1 - pc : undefined
    }) : null, props.children ? props.children(J) : null);
  }

  /* =========================================================
     CAMARA: encuadre del video segun los beats 'camara' y las escenas
     divididas (la camara se mete en una tarjeta al costado).
     zoom 1 = el plano tal cual; foco = punto del cuadro (0..1) que queda al centro
     mov: corte | suave | empuje | golpe
     ========================================================= */

  var TARJETA = {
    der: {
      x: 1130,
      y: 110,
      w: 690,
      h: 860
    },
    izq: {
      x: 100,
      y: 110,
      w: 690,
      h: 860
    },
    derchica: {
      x: 1290,
      y: 300,
      w: 520,
      h: 640
    }
  };
  var T_TARJETA = 0.34; // media duracion del paso pantalla completa <-> tarjeta

  function estadoCamara(T, def) {
    var base = def.encuadre || {};
    var z0 = base.zoom || 1,
      f0 = base.foco || [0.5, 0.5];
    var st = {
      zoom: z0,
      fx: f0[0],
      fy: f0[1],
      bn: 0,
      desenfoque: 0,
      oscuro: 0,
      dx: 0,
      dy: 0,
      tarjeta: 0,
      rect: null
    };
    var cams = def.camaras;
    for (var i = 0; i < cams.length; i++) {
      var c = cams[i];
      if (T < c.ini || T >= c.fin) continue;
      var z = c.zoom == null ? z0 : c.zoom;
      var f = c.foco || f0;
      var k = 1;
      if (c.mov === 'suave') {
        k = Math.min(Easing.easeInOutCubic(clamp((T - c.ini) / 0.6, 0, 1)), Easing.easeInOutCubic(clamp((c.fin - T) / 0.6, 0, 1)));
      } else if (c.mov === 'golpe') {
        k = Easing.easeOutExpo(clamp((T - c.ini) / 0.22, 0, 1));
      }
      if (c.mov === 'empuje') {
        var u = clamp((T - c.ini) / Math.max(0.1, c.fin - c.ini), 0, 1);
        z = z * (1 + (c.cuanto == null ? 0.07 : c.cuanto) * Easing.easeInOutSine(u));
      }
      st.zoom = z0 + (z - z0) * k;
      st.fx = f0[0] + (f[0] - f0[0]) * k;
      st.fy = f0[1] + (f[1] - f0[1]) * k;
      st.bn = c.bn ? k : 0;
      st.desenfoque = (c.desenfoque || 0) * k;
      st.oscuro = (c.oscuro || 0) * k;
    }
    def.sacudidas.forEach(function (s) {
      if (T < s.t || T > s.t + 0.5) return;
      var d = Math.exp(-(T - s.t) / 0.1) * (s.fuerza || 12);
      st.dx += Math.sin(T * 97) * d;
      st.dy += Math.cos(T * 79) * d;
    });
    // escenas divididas: la camara se achica a su tarjeta
    def.pantallas.forEach(function (b) {
      if (!b.camara) return;
      if (T < b.ini - T_TARJETA || T > b.fin + T_TARJETA) return;
      var k = Math.min(Easing.easeInOutCubic(clamp((T - (b.ini - T_TARJETA)) / (2 * T_TARJETA), 0, 1)), Easing.easeInOutCubic(clamp((b.fin + T_TARJETA - T) / (2 * T_TARJETA), 0, 1)));
      if (k <= 0) return;
      st.tarjeta = k;
      st.rect = typeof b.camara === 'object' ? b.camara : TARJETA[b.camara] || TARJETA.der;
      st.focoTarjeta = b.focoCamara || [0.5, 0.42];
    });
    return st;
  }

  // la camara no se ve tocada: el cuadro pasa tal cual
  function camaraLimpia(st, ext) {
    return Math.abs(st.zoom - 1) < 1e-4 && st.bn === 0 && st.desenfoque === 0 && st.oscuro === 0 && Math.abs(st.dx) < 0.05 && Math.abs(st.dy) < 0.05 && st.tarjeta === 0 && (!ext || Math.abs(ext.dx) < 0.05 && ext.blur < 0.05 && Math.abs(ext.escala - 1) < 1e-4 && ext.opacidad >= 1);
  }

  // rectangulo de pantalla y transformacion del cuadro dentro de el
  function geometriaCamara(st, ext) {
    var full = {
      x: 0,
      y: 0,
      w: ANCHO,
      h: ALTO
    };
    var k = st.tarjeta || 0;
    var R = full;
    if (k > 0 && st.rect) {
      R = {
        x: lerp(0, st.rect.x, k),
        y: lerp(0, st.rect.y, k),
        w: lerp(ANCHO, st.rect.w, k),
        h: lerp(ALTO, st.rect.h, k)
      };
    }
    var z = Math.max(1, st.zoom);
    // escala que cubre el rectangulo, con el zoom encima
    var cubre = Math.max(R.w / ANCHO, R.h / ALTO);
    var s = cubre * lerp(z, 1.0, k) * (ext ? ext.escala : 1);
    var fx = k > 0 ? lerp(st.fx, st.focoTarjeta[0], k) : st.fx;
    var fy = k > 0 ? lerp(st.fy, st.focoTarjeta[1], k) : st.fy;
    var vw = ANCHO * s,
      vh = ALTO * s;
    var tx = R.w / 2 - fx * vw,
      ty = R.h / 2 - fy * vh;
    tx = clamp(tx, R.w - vw, 0);
    ty = clamp(ty, R.h - vh, 0);
    tx += st.dx + (ext ? ext.dx : 0);
    ty += st.dy;
    return {
      R: R,
      k: k,
      s: s,
      tx: tx,
      ty: ty
    };
  }
  function filtrosCamara(st, ext) {
    var filtros = [];
    if (st.bn > 0) filtros.push('grayscale(' + st.bn.toFixed(2) + ') contrast(' + (1 + 0.12 * st.bn).toFixed(2) + ')');
    var bl = st.desenfoque + (ext ? ext.blur : 0);
    if (bl > 0.1) filtros.push('blur(' + bl.toFixed(1) + 'px)');
    if (st.oscuro > 0) filtros.push('brightness(' + (1 - st.oscuro).toFixed(2) + ')');
    return filtros.length ? filtros.join(' ') : undefined;
  }
  function MarcoCamara(props) {
    var g = props.g;
    var radio = 40 * g.k;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: g.R.x,
        top: g.R.y,
        width: g.R.w,
        height: g.R.h,
        overflow: 'hidden',
        borderRadius: radio,
        boxShadow: g.k > 0 && props.sombra ? SOMBRA : undefined,
        opacity: props.opacidad == null ? 1 : props.opacidad
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        transformOrigin: '0 0',
        transform: 'translate(' + g.tx.toFixed(2) + 'px,' + g.ty.toFixed(2) + 'px) scale(' + g.s.toFixed(5) + ')',
        filter: props.filtro
      }
    }, props.children));
  }
  function Camara(props) {
    var st = props.st,
      ext = props.ext;
    var g = geometriaCamara(st, ext);
    var estiloMedio = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: ANCHO,
      height: ALTO,
      objectFit: 'cover',
      display: 'block'
    };
    return /*#__PURE__*/React.createElement(MarcoCamara, {
      g: g,
      filtro: filtrosCamara(st, ext),
      sombra: true,
      opacidad: ext ? ext.opacidad : 1
    }, props.render ? /*#__PURE__*/React.createElement("img", {
      ref: props.medioRef,
      style: estiloMedio,
      alt: ""
    }) : /*#__PURE__*/React.createElement("video", {
      ref: props.medioRef,
      src: props.def.video,
      style: estiloMedio,
      playsInline: true,
      preload: "auto"
    }));
  }

  /* =========================================================
     DETRAS: la persona recortada encima de los textos gigantes.
     Las mascaras (PNG en grises, una por cuadro) las calcula
     herramientas/recortar.py en largos/<id>/media/recorte/.
     ========================================================= */

  var PENDIENTES = []; // dibujos asincronos que el grabador espera antes de la foto
  var cacheMascaras = {};
  var ordenCache = [];
  function mascara(url) {
    if (cacheMascaras[url]) return cacheMascaras[url];
    var im = new Image();
    var prom = new Promise(function (res) {
      im.onload = function () {
        res(im);
      };
      im.onerror = function () {
        res(null);
      };
    });
    im.src = url;
    cacheMascaras[url] = prom;
    ordenCache.push(url);
    if (ordenCache.length > 120) delete cacheMascaras[ordenCache.shift()];
    return prom;
  }
  // filtro SVG que pasa la luminancia de la mascara a transparencia (con file:// el
  // canvas no deja leer pixeles, asi que la conversion la hace el filtro)
  function FiltroMascara() {
    return /*#__PURE__*/React.createElement("svg", {
      width: "0",
      height: "0",
      style: {
        position: 'absolute'
      }
    }, /*#__PURE__*/React.createElement("filter", {
      id: "luz-a-alfa",
      colorInterpolationFilters: "sRGB"
    }, /*#__PURE__*/React.createElement("feColorMatrix", {
      type: "luminanceToAlpha"
    })));
  }
  function Frente(props) {
    var ref = useRef(null);
    var T = props.T,
      def = props.def;
    var idx = Math.round(T * FPS);
    var url = 'largos/' + def.id + '/media/recorte/' + String(idx).padStart(6, '0') + '.png';
    var dpr = global.devicePixelRatio || 1;
    useLayoutEffect(function () {
      var cv = ref.current;
      var fuente = props.medioRef.current;
      if (!cv || !fuente) return;
      var hecho = mascara(url).then(function (m) {
        var ctx = cv.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'none';
        ctx.clearRect(0, 0, cv.width, cv.height);
        if (!m) return;
        try {
          ctx.filter = 'url(#luz-a-alfa)';
          ctx.drawImage(m, 0, 0, cv.width, cv.height);
          ctx.filter = 'none';
          ctx.globalCompositeOperation = 'source-in';
          ctx.drawImage(fuente, 0, 0, cv.width, cv.height);
        } catch (e) {/* video sin cuadro todavia */}
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'none';
      });
      // nunca colgar al grabador: a los 4 s sigue sin la mascara
      PENDIENTES.push(Promise.race([hecho, new Promise(function (r) {
        setTimeout(r, 4000);
      })]));
    });
    var g = geometriaCamara(props.st, props.ext);
    return /*#__PURE__*/React.createElement(MarcoCamara, {
      g: g,
      filtro: filtrosCamara(props.st, props.ext)
    }, /*#__PURE__*/React.createElement(FiltroMascara, null), /*#__PURE__*/React.createElement("canvas", {
      ref: ref,
      width: Math.round(ANCHO * dpr),
      height: Math.round(ALTO * dpr),
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO
      }
    }));
  }

  // texto gigante detras de la persona: las letras suben desde una linea de corte
  function DetrasBeat(props) {
    var T = props.T,
      b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.45) return null;
    var txt = String(b.txt);
    var lineas = txt.split('\n');
    var largo = Math.max.apply(null, lineas.map(function (l) {
      return l.length;
    }));
    var fs = b.tam || Math.min(330, 1780 / (largo * 0.6), 820 / lineas.length);
    var color = col(b.color, BLANCO);
    var y = b.y == null ? 340 : b.y;
    var x = b.x == null ? 960 : b.x;
    var dur = b.fin - b.ini;
    var empuje = 1 + 0.035 * Easing.easeInOutSine(clamp((T - b.ini) / Math.max(0.5, dur), 0, 1));
    var k = 0;
    var total = txt.replace(/\s/g, '').length;
    var esc = Math.min(0.045, 0.5 / Math.max(1, total));
    var fuera = Easing.easeInCubic(clamp((T - b.fin) / 0.4, 0, 1));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%,-50%) scale(' + empuje.toFixed(4) + ')',
        opacity: 1 - fuera,
        filter: fuera > 0 ? 'blur(' + (fuera * 14).toFixed(1) + 'px)' : undefined
      }
    }, lineas.map(function (ln, li) {
      return /*#__PURE__*/React.createElement("div", {
        key: li,
        style: {
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: fs * 0.02 + 'px ' + fs * 0.05 + 'px ' + fs * 0.12 + 'px',
          margin: -fs * 0.02 + 'px 0 ' + -fs * 0.16 + 'px',
          lineHeight: 1
        }
      }, ln.split('').map(function (ch, ci) {
        var i = ch === ' ' ? k : k++;
        var p = prog(T, b.ini + i * esc, 0.7, Easing.easeOutExpo);
        return /*#__PURE__*/React.createElement("span", {
          key: ci,
          style: {
            display: 'inline-block',
            fontFamily: F,
            fontWeight: 900,
            fontSize: fs,
            color: color,
            letterSpacing: '-0.04em',
            transform: 'translateY(' + ((1 - p) * 105).toFixed(2) + '%)',
            whiteSpace: 'pre',
            textShadow: b.sombra === false ? undefined : '0 10px 60px rgba(0,0,0,0.25)'
          }
        }, ch);
      }));
    }));
  }

  /* =========================================================
     TRANSICIONES camara <-> escena
       latigo   paneo rapido con desenfoque (la camara se va y la escena entra)
       barrido  panel amarillo con filo de tinta que cruza en diagonal
       zoom     la camara se acerca y se desenfoca; la escena llega desde grande
       fundido · pop · corte
     ========================================================= */

  var VENTANA = {
    latigo: 0.2,
    barrido: 0.26,
    zoom: 0.22,
    fundido: 0.16,
    pop: 0.2,
    corte: 0
  };
  var BANDA = 300,
    INCLINA = 140,
    FILO = 44;
  function bordeBarrido(p) {
    return -BANDA - FILO - INCLINA + (ANCHO + BANDA + FILO + 2 * INCLINA) * Easing.easeInOutQuart(clamp(p, 0, 1));
  }
  function Banda(props) {
    var xa = props.xa,
      s = INCLINA,
      bw = BANDA;
    var poli = function (x0, x1) {
      return x0 + s + ',0 ' + (x1 + s) + ',0 ' + (x1 - s) + ',' + ALTO + ' ' + (x0 - s) + ',' + ALTO;
    };
    return /*#__PURE__*/React.createElement("svg", {
      width: ANCHO,
      height: ALTO,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("polygon", {
      points: poli(xa, xa + bw),
      fill: YEL
    }), /*#__PURE__*/React.createElement("polygon", {
      points: poli(xa + bw, xa + bw + FILO),
      fill: INK
    }));
  }
  function recorte(xa, lado) {
    var s = INCLINA;
    if (lado === 'izq') {
      return 'polygon(0px 0px, ' + (xa + s).toFixed(1) + 'px 0px, ' + (xa - s).toFixed(1) + 'px ' + ALTO + 'px, 0px ' + ALTO + 'px)';
    }
    var xb = xa + BANDA + FILO;
    return 'polygon(' + (xb + s).toFixed(1) + 'px 0px, ' + ANCHO + 'px 0px, ' + ANCHO + 'px ' + ALTO + 'px, ' + (xb - s).toFixed(1) + 'px ' + ALTO + 'px)';
  }

  // estado de la transicion de una escena en T: { fase: 'entra'|'sale'|'dentro', u, tipo }
  function faseEscena(b, T) {
    var entraT = b.entra || 'latigo',
      saleT = b.sale || 'latigo';
    var he = VENTANA[entraT] || 0,
      hs = VENTANA[saleT] || 0;
    if (b.camara) {
      he = 0;
      hs = 0;
      entraT = 'dividida';
      saleT = 'dividida';
    }
    var desde = entraT === 'pop' ? b.ini : b.ini - he;
    var hasta = saleT === 'pop' ? b.fin : b.fin + hs;
    if (T < desde || T >= hasta) return null;
    if (entraT !== 'corte' && he > 0 && T < b.ini + he) return {
      fase: 'entra',
      u: clamp((T - (b.ini - he)) / (2 * he), 0, 1),
      tipo: entraT,
      h: he
    };
    if (saleT !== 'corte' && hs > 0 && T >= b.fin - hs) return {
      fase: 'sale',
      u: clamp((T - (b.fin - hs)) / (2 * hs), 0, 1),
      tipo: saleT,
      h: hs
    };
    return {
      fase: 'dentro',
      u: 0,
      tipo: null
    };
  }

  // lo que la transicion le hace a la camara (latigo y zoom la mueven)
  function extCamara(T, def) {
    var ext = {
      dx: 0,
      blur: 0,
      escala: 1,
      opacidad: 1
    };
    def.pantallas.forEach(function (b) {
      var fz = faseEscena(b, T);
      if (!fz || fz.fase === 'dentro') return;
      var u = fz.u;
      // la camara se ve en la mitad de la transicion que da hacia ella
      if (fz.tipo === 'latigo') {
        var e = Easing.easeInOutCubic(u);
        if (fz.fase === 'entra') {
          ext.dx += -ANCHO * 0.45 * e;
          ext.blur += 36 * Math.sin(Math.PI * Math.min(1, u * 1.2));
        } else {
          ext.dx += ANCHO * 0.45 * (1 - e);
          ext.blur += 36 * Math.sin(Math.PI * Math.max(0, u * 1.2 - 0.2));
        }
      } else if (fz.tipo === 'zoom') {
        var z = fz.fase === 'entra' ? Easing.easeInCubic(u) : 1 - Easing.easeOutCubic(u);
        ext.escala *= 1 + 0.18 * z;
        ext.blur += 18 * z;
      }
    });
    return ext;
  }
  function Fondo(props) {
    var tipo = props.tipo || 'claro';
    if (tipo === 'oscuro') {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 42%, #2A2522 0%, ' + INK + ' 70%)'
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: ANCHO,
        height: ALTO,
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          opacity: 0.5
        }
      }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
        id: "grilla-osc",
        width: "80",
        height: "80",
        patternUnits: "userSpaceOnUse"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M 80 0 L 0 0 0 80",
        fill: "none",
        stroke: "rgba(255,255,255,0.06)",
        strokeWidth: "1.5"
      }))), /*#__PURE__*/React.createElement("rect", {
        width: ANCHO,
        height: ALTO,
        fill: "url(#grilla-osc)"
      })));
    }
    if (tipo === 'amarillo') {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 50% 45%, #FFDD33 0%, ' + YEL + ' 75%)'
        }
      });
    }
    if (tipo === 'blanco') return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: BLANCO
      }
    });
    // claro: papel con vineta suave (el gris claro de Borja, mas calido)
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 78% 74% at 50% 46%, #FFFFFF 0%, ' + PAPEL + ' 50%, #DAD6CF 100%)'
      }
    }, props.puntos === false ? null : /*#__PURE__*/React.createElement("svg", {
      width: ANCHO,
      height: ALTO,
      style: {
        position: 'absolute',
        left: 0,
        top: 0
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
      id: "puntos-claro",
      width: "44",
      height: "44",
      patternUnits: "userSpaceOnUse"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "22",
      cy: "22",
      r: "1.6",
      fill: "rgba(20,17,15,0.09)"
    }))), /*#__PURE__*/React.createElement("rect", {
      width: ANCHO,
      height: ALTO,
      fill: "url(#puntos-claro)"
    })));
  }

  // escenas a pantalla completa con su entrada y salida
  function CapaEscenas(props) {
    var T = props.T,
      def = props.def;
    var capas = [],
      bandas = [];
    def.pantallas.forEach(function (b, i) {
      if (props.divididas !== !!b.camara) return;
      var fz = faseEscena(b, T);
      if (!fz) return;
      var estilo = {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        overflow: 'hidden'
      };
      var u = fz.u;
      if (fz.fase === 'entra') {
        if (fz.tipo === 'barrido') {
          var xa = bordeBarrido(u);
          estilo.clipPath = recorte(xa, 'izq');
          bandas.push(/*#__PURE__*/React.createElement(Banda, {
            key: 'e' + i,
            xa: xa
          }));
        } else if (fz.tipo === 'latigo') {
          var e = Easing.easeInOutCubic(u);
          estilo.transform = 'translateX(' + (ANCHO * 0.55 * (1 - e)).toFixed(1) + 'px)';
          var bl = 36 * Math.sin(Math.PI * Math.max(0, u * 1.2 - 0.2));
          if (bl > 0.2) estilo.filter = 'blur(' + bl.toFixed(1) + 'px)';
          estilo.opacity = clamp(u * 2.2, 0, 1);
        } else if (fz.tipo === 'zoom') {
          var kz = Easing.easeOutCubic(clamp((u - 0.3) / 0.7, 0, 1));
          estilo.opacity = kz;
          estilo.transform = 'scale(' + (1.14 - 0.14 * kz).toFixed(4) + ')';
          if (kz < 0.98) estilo.filter = 'blur(' + (16 * (1 - kz)).toFixed(1) + 'px)';
        } else if (fz.tipo === 'pop') {
          var kp = Easing.easeOutCubic(clamp((T - b.ini) / fz.h, 0, 1));
          estilo.opacity = kp;
          estilo.transform = 'scale(' + (0.92 + 0.08 * kp).toFixed(4) + ')';
        } else if (fz.tipo === 'fundido') {
          estilo.opacity = u;
        }
      } else if (fz.fase === 'sale') {
        if (fz.tipo === 'barrido') {
          var xs = bordeBarrido(u);
          estilo.clipPath = recorte(xs, 'der');
          bandas.push(/*#__PURE__*/React.createElement(Banda, {
            key: 's' + i,
            xa: xs
          }));
        } else if (fz.tipo === 'latigo') {
          var es = Easing.easeInOutCubic(u);
          estilo.transform = 'translateX(' + (-ANCHO * 0.55 * es).toFixed(1) + 'px)';
          var bs = 36 * Math.sin(Math.PI * Math.min(1, u * 1.2));
          if (bs > 0.2) estilo.filter = 'blur(' + bs.toFixed(1) + 'px)';
          estilo.opacity = clamp((1 - u) * 2.2, 0, 1);
        } else if (fz.tipo === 'zoom') {
          var ks = Easing.easeInCubic(clamp(u / 0.7, 0, 1));
          estilo.opacity = 1 - ks;
          estilo.transform = 'scale(' + (1 - 0.06 * ks).toFixed(4) + ')';
          if (ks > 0.02) estilo.filter = 'blur(' + (12 * ks).toFixed(1) + 'px)';
        } else if (fz.tipo === 'pop') {
          var q = clamp((T - (b.fin - fz.h)) / fz.h, 0, 1);
          estilo.opacity = 1 - q;
          estilo.transform = 'scale(' + (1 + 0.05 * q).toFixed(4) + ')';
        } else if (fz.tipo === 'fundido') {
          estilo.opacity = 1 - u;
        }
      }
      var C = b.C;
      var extra = b.camara ? {
        dividida: true,
        lado: typeof b.camara === 'string' && b.camara.indexOf('izq') === 0 ? 'izq' : 'der'
      } : {};
      capas.push(/*#__PURE__*/React.createElement("div", {
        key: i,
        style: estilo
      }, /*#__PURE__*/React.createElement(C, _extends({
        T: T,
        at: b.ini,
        dur: b.fin - b.ini
      }, b.props || {}, extra))));
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, capas, bandas);
  }

  // fondo de las escenas divididas: va DEBAJO de la camara (que se achica a su tarjeta)
  function FondoDivididas(props) {
    var T = props.T,
      def = props.def;
    var out = null;
    def.pantallas.forEach(function (b, i) {
      if (!b.camara) return;
      if (T < b.ini - T_TARJETA || T > b.fin + T_TARJETA) return;
      out = /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: 'absolute',
          inset: 0
        }
      }, /*#__PURE__*/React.createElement(Fondo, {
        tipo: b.fondo || 'claro'
      }));
    });
    return out;
  }

  /* =========================================================
     KIT DE ESCENAS (LARGOS.E)
     ========================================================= */

  // marco de una escena: fondo + contenido con empuje lento (nada queda quieto)
  function Escena(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur || 1;
    var u = clamp((T - at) / Math.max(0.5, dur), 0, 1);
    var empuje = 1 + (props.empuje == null ? 0.035 : props.empuje) * Easing.easeInOutSine(u);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden'
      }
    }, props.dividida ? null : /*#__PURE__*/React.createElement(Fondo, {
      tipo: props.fondo,
      puntos: props.puntos
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        transform: 'scale(' + empuje.toFixed(4) + ')',
        transformOrigin: props.origen || '50% 50%'
      }
    }, props.children));
  }

  // titulo o frase en escena (palabras con mascara; marcadas en caja amarilla)
  function Titulo(props) {
    var T = props.T;
    var e = junta({
      p: 1,
      opacity: 1,
      x: 0,
      y: 0,
      escala: 1,
      blur: 0
    }, sale(T, props.s));
    var vida = props.quieto ? 0 : deriva(T, hash(props.children), 2);
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: e,
      dy: vida,
      ancla: props.ancla
    }, /*#__PURE__*/React.createElement(Palabras, {
      T: T,
      txt: props.children,
      c: props.c,
      tiempos: props.tiempos,
      fs: 96 * (props.tam || 1),
      color: props.color || 'negro',
      marcadas: props.marcadas,
      marcarTodo: props.marcarTodo,
      acento: props.acento,
      colorAcento: props.colorAcento,
      peso: props.peso || 900,
      alinear: props.alinear || (props.ancla === 'izq' ? 'izq' : props.ancla === 'der' ? 'der' : 'centro'),
      escalonado: props.escalonado,
      ancho: props.ancho,
      mayus: props.mayus,
      sombra: props.sombra,
      italica: props.italica,
      tracking: props.tracking
    }));
  }

  // texto chico de apoyo (mono o sans), entra con el estandar
  function Texto(props) {
    var T = props.T;
    var e = junta(entra(T, props.c, {
      dy: 20,
      blur: 8
    }), sale(T, props.s));
    var fs = 40 * (props.tam || 1);
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: e,
      dy: props.quieto ? 0 : deriva(T, hash(props.children) + 0.3, 1.6),
      ancla: props.ancla
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: props.mono ? F_MONO : F,
        fontWeight: props.peso || (props.mono ? 500 : 700),
        fontSize: fs,
        color: col(props.color, INK),
        letterSpacing: props.mono ? '0.08em' : '-0.01em',
        whiteSpace: props.ancho ? 'normal' : 'nowrap',
        textTransform: props.mayus ? 'uppercase' : 'none',
        lineHeight: 1.15,
        width: props.ancho,
        textAlign: props.alinear || (props.ancla === 'izq' ? 'left' : props.ancla === 'der' ? 'right' : 'center')
      }
    }, props.children));
  }

  // etiqueta negra con flechita: se despliega desde la flecha
  function Rot(props) {
    var T = props.T;
    var dir = props.dir || 'izq';
    var e = junta(entra(T, props.c, {
      dy: 0,
      dx: dir === 'izq' ? 40 : dir === 'der' ? -40 : 0,
      blur: 6,
      dur: 0.5
    }), sale(T, props.s));
    if (!props.mudo) sonido('click', props.c, 0.35);
    var p = prog(T, props.c, 0.55, Easing.easeOutQuart);
    var clip = dir === 'der' ? 'inset(0 0 0 ' + ((1 - p) * 100).toFixed(1) + '%)' : 'inset(0 ' + ((1 - p) * 100).toFixed(1) + '% 0 0)';
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: e,
      dy: deriva(T, hash(props.children) + 0.6, 1.5),
      ancla: props.ancla
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        clipPath: clip
      }
    }, /*#__PURE__*/React.createElement(Etiqueta, {
      tam: props.tam,
      dir: dir,
      fondo: props.fondo,
      sombra: props.sombra
    }, props.children)));
  }

  // icono de linea posicionado
  function Icono(props) {
    var T = props.T;
    var e = junta(entra(T, props.c, {
      dy: 24,
      blur: 6,
      desde: 0.12,
      dur: 0.7
    }), sale(T, props.s));
    if (props.sonido) sonido(props.sonido, props.c, 0.5);
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: e,
      rot: props.rot,
      dy: props.quieto ? 0 : deriva(T, hash(props.n + props.x), 3)
    }, /*#__PURE__*/React.createElement(Ico, {
      n: props.n,
      T: T,
      c: props.c,
      tam: props.tam || 220,
      acento: props.acento,
      grosor: props.grosor,
      dur: props.dur
    }));
  }

  // monigote posicionado (x, y = pies). pose puede cambiar en el tiempo desde afuera
  function Figura(props) {
    var T = props.T;
    var e = junta(entra(T, props.c, {
      dy: 0,
      blur: 0,
      desde: 0,
      dur: 0.4
    }), sale(T, props.s));
    var tam = props.tam || 300;
    var p = prog(T, props.c, 0.9, Easing.easeInOutCubic);
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y - tam / 2,
      e: e
    }, /*#__PURE__*/React.createElement(Monigote, {
      tam: tam,
      pose: props.pose,
      fase: props.fase,
      p: p,
      espejo: props.espejo,
      color: props.color,
      cabeza: props.cabeza,
      grosor: props.grosor
    }, props.children));
  }

  // flecha que se dibuja sola; curva > 0 la arquea
  function Flecha(props) {
    var T = props.T;
    var a = props.de,
      b = props.a,
      k = props.curva || 0;
    var mx = (a[0] + b[0]) / 2,
      my = (a[1] + b[1]) / 2;
    var dx = b[0] - a[0],
      dy = b[1] - a[1],
      L = Math.sqrt(dx * dx + dy * dy) || 1;
    var cx = mx - dy / L * k,
      cy = my + dx / L * k;
    var p = prog(T, props.c, props.dur || 0.6, Easing.easeInOutCubic);
    var e = sale(T, props.s);
    if (p <= 0 || e.opacity <= 0) return null;
    var ang = Math.atan2(b[1] - cy, b[0] - cx);
    var g = props.grosor || 8,
      cabeza = g * 3.2;
    var color = col(props.color, INK);
    var p1 = [b[0] - cabeza * Math.cos(ang - 0.55), b[1] - cabeza * Math.sin(ang - 0.55)];
    var p2 = [b[0] - cabeza * Math.cos(ang + 0.55), b[1] - cabeza * Math.sin(ang + 0.55)];
    var pc = clamp((p - 0.82) / 0.18, 0, 1);
    return /*#__PURE__*/React.createElement("svg", {
      width: ANCHO,
      height: ALTO,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible',
        opacity: e.opacity
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + a[0] + ' ' + a[1] + ' Q ' + cx + ' ' + cy + ' ' + b[0] + ' ' + b[1],
      fill: "none",
      stroke: color,
      strokeWidth: g,
      strokeLinecap: "round",
      pathLength: 1,
      strokeDasharray: props.punteada ? '0.012 0.024' : '1 1',
      strokeDashoffset: props.punteada ? 0 : 1 - p,
      style: props.punteada ? {
        clipPath: 'inset(0 ' + (1 - p) * 100 + '% 0 0)'
      } : undefined
    }), pc > 0 ? /*#__PURE__*/React.createElement("path", {
      d: 'M ' + p1[0] + ' ' + p1[1] + ' L ' + b[0] + ' ' + b[1] + ' L ' + p2[0] + ' ' + p2[1],
      fill: "none",
      stroke: color,
      strokeWidth: g,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: pc
    }) : null);
  }

  // linea recta que se dibuja (separadores, ejes, guias)
  function Linea(props) {
    var T = props.T;
    var p = prog(T, props.c, props.dur || 0.6, Easing.easeInOutCubic);
    var e = sale(T, props.s);
    if (p <= 0 || e.opacity <= 0) return null;
    var a = props.de,
      b = props.a;
    return /*#__PURE__*/React.createElement("svg", {
      width: ANCHO,
      height: ALTO,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible',
        opacity: e.opacity
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + a[0] + ' ' + a[1] + ' L ' + b[0] + ' ' + b[1],
      stroke: col(props.color, INK),
      strokeWidth: props.grosor || 6,
      strokeLinecap: "round",
      pathLength: 1,
      strokeDasharray: props.punteada ? '0.01 0.02' : '1 1',
      strokeDashoffset: props.punteada ? 0 : 1 - p,
      fill: "none"
    }));
  }

  // visto verde / X roja: circulo que se dibuja y el signo adentro. suenan ding / error
  function Signo(props, bien) {
    var T = props.T,
      tam = props.tam || 130;
    if (!props.mudo) sonido(bien ? 'ding' : 'error', props.c, bien ? 0.7 : 0.6);
    var e = junta(entra(T, props.c, {
      dy: 0,
      desde: 0.3,
      blur: 6,
      dur: 0.4,
      ease: suave
    }), sale(T, props.s));
    var p = prog(T, props.c + 0.05, 0.45, Easing.easeInOutCubic);
    var color = bien ? GRN : RED;
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: e,
      dx: bien ? 0 : M.vibra(T, 30, clamp(1 - (T - props.c) / 0.5, 0, 1) * 4)
    }, /*#__PURE__*/React.createElement("svg", {
      width: tam,
      height: tam,
      viewBox: "0 0 120 120",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "60",
      cy: "60",
      r: "54",
      fill: color
    }), /*#__PURE__*/React.createElement("path", {
      d: bien ? 'M 34 62 L 52 80 L 88 42' : 'M 40 40 L 80 80 M 80 40 L 40 80',
      fill: "none",
      stroke: BLANCO,
      strokeWidth: "13",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      pathLength: 1,
      strokeDasharray: "1 1",
      strokeDashoffset: 1 - p
    })));
  }
  function Check(props) {
    return Signo(props, true);
  }
  function Tacha(props) {
    return Signo(props, false);
  }

  // tachon rojo que se dibuja encima de algo
  function Tachon(props) {
    var T = props.T;
    if (!props.mudo) sonido('error', props.c, 0.5);
    var p = prog(T, props.c, 0.32, Easing.easeOutQuart);
    var w = props.w || 400;
    if (p <= 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: props.x - w / 2,
        top: props.y - 7,
        width: w * p,
        height: 14,
        background: RED,
        borderRadius: 7,
        transform: 'rotate(' + (props.rot == null ? -4 : props.rot) + 'deg)',
        transformOrigin: '0 50%'
      }
    });
  }

  // barra horizontal que se llena (progreso, bateria, nivel)
  function Barra(props) {
    var T = props.T;
    var w = props.w || 620,
      h = props.h || 36;
    var e = junta(entra(T, props.c, {
      dy: 16,
      blur: 6
    }), sale(T, props.s));
    var lleno = (props.desde || 0) + ((props.hasta == null ? 1 : props.hasta) - (props.desde || 0)) * Easing.easeInOutCubic(clamp((T - props.c - 0.2) / (props.dur || 1), 0, 1));
    var color = col(props.color, YEL);
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: e,
      ancla: props.ancla,
      dy: deriva(T, 0.2, 1.5)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: w
      }
    }, props.etiqueta ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 700,
        fontSize: h * 0.9,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: col(props.colorTexto, INK),
        marginBottom: h * 0.4
      }
    }, props.etiqueta) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        height: h,
        borderRadius: h / 2,
        background: props.oscuro ? 'rgba(255,255,255,0.18)' : 'rgba(20,17,15,0.10)',
        overflow: 'hidden',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: (lleno * 100).toFixed(2) + '%',
        background: color,
        borderRadius: h / 2
      }
    }))));
  }
  function formato(v, dec) {
    var s = dec ? v.toFixed(dec) : String(Math.round(v));
    var partes = s.split('.');
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return partes.join(',');
  }

  // numero que cuenta (ease-out exponencial)
  function Num(props) {
    var T = props.T;
    var e = junta(entra(T, props.c, {
      dy: 30,
      blur: 10
    }), sale(T, props.s));
    var v = (props.desde || 0) + ((props.hasta || 0) - (props.desde || 0)) * prog(T, props.c, props.dur || 1.2, Easing.easeOutExpo);
    var fs = 160 * (props.tam || 1);
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: e,
      ancla: props.ancla,
      dy: deriva(T, 0.6, 2)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 900,
        fontSize: fs,
        color: col(props.color, INK),
        lineHeight: 0.9,
        letterSpacing: '-0.045em',
        whiteSpace: 'nowrap',
        fontVariantNumeric: 'tabular-nums'
      }
    }, (props.prefijo || '') + formato(v, props.decimales) + (props.sufijo || '')));
  }

  // tarjeta blanca con sombra suave (agrupa piezas). entra con un leve giro 3D
  function Tarjeta(props) {
    var T = props.T;
    var e = junta(entra(T, props.c, {
      dy: 50,
      blur: 10,
      desde: 0.06,
      dur: 0.75
    }), sale(T, props.s));
    var p = e.p;
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: e,
      rot: props.rot || 0,
      dy: props.quieto ? 0 : deriva(T, hash(props.x + ':' + props.y), 3),
      ancla: props.ancla
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        perspective: 1600
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: props.w,
        height: props.h,
        background: col(props.fondo, BLANCO),
        borderRadius: props.radio || 30,
        boxShadow: SOMBRA,
        position: 'relative',
        overflow: 'hidden',
        padding: props.relleno,
        transform: 'rotateX(' + (10 * (1 - p)).toFixed(2) + 'deg) rotateY(' + ((props.giroY == null ? -8 : props.giroY) * (1 - p)).toFixed(2) + 'deg)'
      }
    }, props.children)));
  }

  // grafico de barras verticales (Borja): barras anchas, numero grande arriba, rotulo abajo
  // barras: [{ v, txt, color, valor (texto del numero), c }]
  function Barras(props) {
    var T = props.T;
    var barras = props.barras || [];
    var x0 = props.x,
      base = props.y,
      h = props.h || 560,
      ancho = props.ancho || 230,
      sep = props.sep || 90;
    var max = props.max || Math.max.apply(null, barras.map(function (b) {
      return b.v;
    }).concat([1]));
    var total = barras.length * ancho + (barras.length - 1) * sep;
    var e = sale(T, props.s);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: e.opacity
      }
    }, /*#__PURE__*/React.createElement(Linea, {
      T: T,
      de: [x0 - total / 2 - 40, base],
      a: [x0 + total / 2 + 40, base],
      c: props.c,
      grosor: 5,
      color: TENUE
    }), barras.map(function (b, i) {
      var c = b.c != null ? b.c : props.c + 0.15 + i * (props.escalonado == null ? 0.18 : props.escalonado);
      var p = prog(T, c, 0.9, Easing.easeOutExpo);
      var hb = h * b.v / max * p;
      var cx = x0 - total / 2 + ancho / 2 + i * (ancho + sep);
      var color = col(b.color, i === barras.length - 1 ? YEL : INK);
      var txtNum = b.valor != null ? b.valor : formato(b.v * p);
      var en = entra(T, c + 0.25, {
        dy: 20,
        blur: 8
      });
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: cx - ancho / 2,
          top: base - hb,
          width: ancho,
          height: hb,
          background: color,
          borderRadius: '10px 10px 0 0'
        }
      }), /*#__PURE__*/React.createElement(Pos, {
        x: cx,
        y: base - hb - 20,
        e: en,
        ancla: "abajo"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          transform: 'translateY(-50%)',
          fontFamily: F,
          fontWeight: 900,
          fontSize: props.fsNum || 76,
          color: INK,
          letterSpacing: '-0.04em',
          whiteSpace: 'nowrap',
          lineHeight: 1
        }
      }, txtNum)), /*#__PURE__*/React.createElement(Pos, {
        x: cx,
        y: base + 46,
        e: entra(T, c + 0.1, {
          dy: -10,
          blur: 6
        })
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F,
          fontWeight: 700,
          fontSize: props.fsTxt || 38,
          color: INK,
          whiteSpace: 'nowrap',
          textAlign: 'center'
        }
      }, b.txt)));
    }));
  }

  // grafico de lineas: ejes + curvas que se dibujan. puntos en 0..1 (x derecha, y arriba)
  function Grafico(props) {
    var T = props.T;
    var x0 = props.x,
      y0 = props.y,
      w = props.w || 1100,
      h = props.h || 560;
    var e = sale(T, props.s);
    if (T < props.c) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: e.opacity
      }
    }, /*#__PURE__*/React.createElement(Linea, {
      T: T,
      de: [x0, y0],
      a: [x0 + w, y0],
      c: props.c,
      grosor: 5
    }), /*#__PURE__*/React.createElement(Linea, {
      T: T,
      de: [x0, y0],
      a: [x0, y0 - h],
      c: props.c,
      grosor: 5
    }), props.ejeX ? /*#__PURE__*/React.createElement(Texto, {
      T: T,
      x: x0 + w,
      y: y0 + 40,
      c: props.c + 0.2,
      mono: true,
      mayus: true,
      tam: 0.7,
      color: TENUE,
      ancla: "der"
    }, props.ejeX) : null, props.ejeY ? /*#__PURE__*/React.createElement(Texto, {
      T: T,
      x: x0 + 16,
      y: y0 - h - 10,
      c: props.c + 0.2,
      mono: true,
      mayus: true,
      tam: 0.7,
      color: TENUE,
      ancla: "izq"
    }, props.ejeY) : null, /*#__PURE__*/React.createElement("svg", {
      width: ANCHO,
      height: ALTO,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, (props.curvas || []).map(function (cv, i) {
      var pts = cv.puntos.map(function (q) {
        return [x0 + q[0] * w, y0 - q[1] * h];
      });
      var d = 'M ' + pts[0][0] + ' ' + pts[0][1];
      for (var j = 1; j < pts.length; j++) {
        var a = pts[j - 1],
          b = pts[j];
        var mx = (a[0] + b[0]) / 2;
        d += ' C ' + mx + ' ' + a[1] + ', ' + mx + ' ' + b[1] + ', ' + b[0] + ' ' + b[1];
      }
      var p = prog(T, cv.c, cv.dur || 1.4, Easing.easeInOutCubic);
      return /*#__PURE__*/React.createElement("path", {
        key: i,
        d: d,
        fill: "none",
        stroke: col(cv.color, YEL),
        strokeWidth: cv.grosor || 12,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        pathLength: 1,
        strokeDasharray: "1 1",
        strokeDashoffset: 1 - p
      });
    })));
  }

  // grilla de puntos (cada punto = algo): se encienden en orden. n, encendidos, color
  function Puntos(props) {
    var T = props.T;
    var n = props.n || 50,
      cols = props.cols || 10,
      paso = props.paso || 56,
      r = props.r || 20;
    var filas = Math.ceil(n / cols);
    var x0 = props.x - (cols - 1) * paso / 2,
      y0 = props.y - (filas - 1) * paso / 2;
    var out = [];
    var e = sale(T, props.s);
    for (var i = 0; i < n; i++) {
      var c = props.c + (props.dur || 1) * i / n;
      var p = prog(T, c, 0.4, suave);
      if (p <= 0) continue;
      var enc = props.encendidos != null && i < props.encendidos && T >= (props.cEnciende || c);
      out.push(/*#__PURE__*/React.createElement("circle", {
        key: i,
        cx: x0 + i % cols * paso,
        cy: y0 + Math.floor(i / cols) * paso,
        r: r * p,
        fill: enc ? col(props.color, YEL) : props.oscuro ? 'rgba(255,255,255,0.85)' : INK
      }));
    }
    return /*#__PURE__*/React.createElement("svg", {
      width: ANCHO,
      height: ALTO,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        opacity: e.opacity
      }
    }, out);
  }

  // burbuja de dialogo / pensamiento limpia (blanca con sombra)
  function Burbuja(props) {
    var T = props.T;
    var e = junta(entra(T, props.c, {
      dy: 20,
      desde: 0.12,
      blur: 8,
      dur: 0.45,
      ease: suave
    }), sale(T, props.s));
    if (!props.mudo) sonido('pop', props.c, 0.35);
    var fs = 52 * (props.tam || 1);
    var cola = props.cola || 'izq';
    return /*#__PURE__*/React.createElement(Pos, {
      x: props.x,
      y: props.y,
      e: e,
      dy: deriva(T, 0.9, 2.5)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: col(props.fondo, BLANCO),
        borderRadius: fs * 0.6,
        padding: fs * 0.42 + 'px ' + fs * 0.62 + 'px',
        boxShadow: SOMBRA_CHICA,
        fontFamily: F,
        fontWeight: 800,
        fontSize: fs,
        color: col(props.color, INK),
        whiteSpace: 'nowrap',
        lineHeight: 1,
        letterSpacing: '-0.02em'
      }
    }, props.children), /*#__PURE__*/React.createElement("svg", {
      width: "60",
      height: "40",
      viewBox: "0 0 60 40",
      style: {
        position: 'absolute',
        bottom: -30,
        left: cola === 'der' ? undefined : '18%',
        right: cola === 'der' ? '18%' : undefined,
        transform: cola === 'der' ? 'scaleX(-1)' : undefined
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 0 0 L 52 0 L 8 36 Z",
      fill: col(props.fondo, BLANCO)
    }))));
  }

  // opciones en grilla (Saenz): la activa en tinta con su linea, las demas atenuadas
  // activo: indice | lista | 'ultimo' (el ultimo que ya aparecio). etiquetasDesde: los
  // rotulos "Punto n" y sus lineas grises estan desde ese segundo; el texto llega en su c
  function Opciones(props) {
    var T = props.T;
    var items = props.items || [];
    var cols = props.cols || Math.min(3, items.length);
    var w = props.w || 1600,
      altoFila = props.altoFila || 230;
    var x0 = props.x - w / 2,
      y0 = props.y;
    var anchoCol = w / cols;
    var ultimo = -1;
    items.forEach(function (it, i) {
      var c = it.c != null ? it.c : props.c + i * 0.1;
      if (T >= c) ultimo = i;
    });
    return /*#__PURE__*/React.createElement(React.Fragment, null, items.map(function (it, i) {
      var cx = x0 + i % cols * anchoCol + 30,
        cy = y0 + Math.floor(i / cols) * altoFila;
      var c = it.c != null ? it.c : props.c + i * 0.1;
      var activo = props.activo == null ? true : props.activo === 'ultimo' ? i === ultimo : props.activo === i || props.activo && props.activo.indexOf && props.activo.indexOf(i) >= 0;
      var cBase = props.etiquetasDesde != null ? Math.min(c, props.etiquetasDesde) : c;
      var enB = entra(T, cBase, {
        dy: 30,
        blur: 8
      });
      var enT = entra(T, c, {
        dy: 40,
        blur: 10
      });
      var dicho = T >= c;
      var pl = prog(T, (props.cActivo || c) + 0.15, 0.6, Easing.easeInOutCubic);
      var colorTx = activo ? INK : 'rgba(20,17,15,0.32)';
      return /*#__PURE__*/React.createElement(Pos, {
        key: i,
        x: cx,
        y: cy,
        e: enB,
        ancla: "izq"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: anchoCol - 70
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F_MONO,
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: activo ? INK : TENUE,
          textTransform: 'uppercase',
          marginBottom: 10
        }
      }, it.etiqueta || (props.prefijo || '') + (i + 1)), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F,
          fontWeight: 800,
          fontSize: props.fs || 58,
          lineHeight: 1.02,
          letterSpacing: '-0.03em',
          color: colorTx,
          opacity: enT.opacity,
          transform: 'translateY(' + enT.y.toFixed(1) + 'px)',
          filter: enT.blur > 0.2 ? 'blur(' + enT.blur.toFixed(1) + 'px)' : undefined,
          minHeight: (props.fs || 58) * 2.1
        }
      }, it.texto), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 18,
          height: 7,
          borderRadius: 4,
          background: LINEA_SUAVE,
          position: 'relative',
          overflow: 'hidden'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: (dicho ? 100 * pl : 0) + '%',
          background: activo ? YEL : 'rgba(20,17,15,0.3)'
        }
      }))));
    }));
  }

  /* =========================================================
     SOBRE LA CAMARA (beats encima)
     ========================================================= */

  // posiciones con nombre pensadas para no tapar la cara (presentador al centro)
  var POS = {
    abajo: [960, 930],
    arriba: [960, 140],
    centro: [960, 540],
    izq: [120, 500],
    der: [1800, 500],
    arribaizq: [120, 200],
    arribader: [1800, 200],
    abajoizq: [120, 900],
    abajoder: [1800, 900]
  };
  function posicion(p, def) {
    if (Array.isArray(p)) return p;
    return POS[p] || POS[def] || POS.abajo;
  }
  function anclaDe(pos) {
    if (pos === 'izq' || pos === 'arribaizq' || pos === 'abajoizq') return 'izq';
    if (pos === 'der' || pos === 'arribader' || pos === 'abajoder') return 'der';
    return 'centro';
  }

  // velo oscuro suave del lado del texto: el blanco se lee sobre cualquier fondo
  function Velo(props) {
    var k = props.k;
    if (k <= 0.002) return null;
    var g = props.lado === 'abajo' ? 'linear-gradient(0deg, rgba(12,10,9,0.58) 0%, rgba(12,10,9,0.30) 17%, rgba(12,10,9,0) 36%)' : props.lado === 'der' ? 'linear-gradient(270deg, rgba(12,10,9,0.62) 0%, rgba(12,10,9,0.34) 30%, rgba(12,10,9,0) 58%)' : 'linear-gradient(90deg, rgba(12,10,9,0.62) 0%, rgba(12,10,9,0.34) 30%, rgba(12,10,9,0) 58%)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: g,
        opacity: k
      }
    });
  }
  function kVelo(T, b) {
    return Math.min(clamp((T - b.ini + 0.1) / 0.35, 0, 1), 1 - clamp((T - b.fin) / 0.3, 0, 1));
  }

  // texto sobre la camara. estilo:
  //   linea    frase clave abajo, palabra por palabra al ritmo de la voz (por defecto)
  //   titular  texto grande al costado de la cara (Saenz), con sub y barra opcionales
  //   caja     tinta sobre caja amarilla: la idea que hay que llevarse
  //   etiqueta la etiqueta negra con flechita
  function TextoClave(props) {
    var T = props.T,
      b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.4) return null;
    var estilo = b.estilo || 'linea';
    var tam = b.tam || 1;
    var vida = deriva(T, hash(b.txt), 2);
    if (estilo === 'etiqueta') {
      var xyE = posicion(b.pos, 'arribaizq');
      return /*#__PURE__*/React.createElement(Rot, {
        T: T,
        x: xyE[0],
        y: xyE[1],
        c: b.ini,
        s: b.fin,
        tam: tam * 1.2,
        dir: b.dir || 'izq',
        fondo: b.fondo,
        ancla: b.ancla || anclaDe(b.pos || 'arribaizq'),
        sombra: true,
        mudo: true
      }, b.txt);
    }
    if (estilo === 'caja') {
      var xyC = posicion(b.pos, 'abajo');
      var pc = prog(T, b.ini, 0.5, Easing.easeOutQuart);
      var eC = junta(entra(T, b.ini, {
        dy: 24,
        blur: 8,
        desde: 0.04
      }), sale(T, b.fin));
      var fsC = 92 * tam;
      return /*#__PURE__*/React.createElement(Pos, {
        x: xyC[0],
        y: xyC[1],
        e: eC,
        dy: vida,
        rot: b.rot || 0,
        ancla: b.ancla || anclaDe(b.pos || 'abajo')
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          padding: fsC * 0.16 + 'px ' + fsC * 0.34 + 'px ' + fsC * 0.2 + 'px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          background: col(b.fondo, YEL),
          borderRadius: fsC * 0.14,
          transformOrigin: '0 50%',
          transform: 'scaleX(' + pc.toFixed(4) + ')',
          boxShadow: '0 16px 40px rgba(0,0,0,0.28)'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement(Palabras, {
        T: T,
        txt: b.txt,
        c: b.ini + 0.12,
        escalonado: 0.05,
        fs: fsC,
        color: b.color || 'negro',
        peso: 900,
        mayus: b.mayus,
        acento: "ninguno"
      }))));
    }
    if (estilo === 'titular') {
      var lado = b.lado || (b.pos === 'der' ? 'der' : 'izq');
      var xyT = posicion(b.pos || lado, lado);
      var fsT = 136 * tam;
      var eT = sale(T, b.fin);
      return /*#__PURE__*/React.createElement(React.Fragment, null, b.velo === false ? null : /*#__PURE__*/React.createElement(Velo, {
        lado: lado,
        k: kVelo(T, b)
      }), /*#__PURE__*/React.createElement(Pos, {
        x: xyT[0],
        y: xyT[1],
        e: eT,
        dy: vida,
        ancla: lado
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: lado === 'der' ? 'flex-end' : 'flex-start'
        }
      }, /*#__PURE__*/React.createElement(Palabras, {
        T: T,
        txt: b.txt,
        tiempos: b.tiempos,
        c: b.ini,
        escalonado: 0.08,
        fs: fsT,
        color: b.color || 'blanco',
        marcadas: b.marcadas,
        acento: b.acento || 'caja',
        peso: 900,
        alinear: lado,
        sombra: true,
        mayus: b.mayus,
        interlinea: -0.02
      }), b.sub ? /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: fsT * 0.12
        }
      }, /*#__PURE__*/React.createElement(Palabras, {
        T: T,
        txt: b.sub,
        c: b.cSub || b.ini + 0.35,
        escalonado: 0.05,
        fs: fsT * 0.36,
        color: "blanco",
        peso: 600,
        alinear: lado,
        sombra: true,
        tracking: "0.06em",
        mayus: true
      })) : null, b.barra != null ? /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: fsT * 0.2,
          width: fsT * 4.2,
          height: fsT * 0.13,
          borderRadius: fsT,
          background: 'rgba(255,255,255,0.25)',
          overflow: 'hidden',
          boxShadow: '0 6px 24px rgba(0,0,0,0.25)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: '100%',
          borderRadius: fsT,
          background: col(b.colorBarra, YEL),
          width: (100 * b.barra * prog(T, b.ini + 0.45, 1.1, Easing.easeInOutCubic)).toFixed(1) + '%'
        }
      })) : null)));
    }
    // linea: frase clave abajo, palabra por palabra
    var xy = posicion(b.pos, 'abajo');
    var fs = 76 * tam;
    var e = sale(T, b.fin);
    var abajo = !b.pos || b.pos === 'abajo' || Array.isArray(b.pos) && b.pos[1] > 760;
    return /*#__PURE__*/React.createElement(React.Fragment, null, abajo && b.velo !== false ? /*#__PURE__*/React.createElement(Velo, {
      lado: "abajo",
      k: kVelo(T, b)
    }) : null, /*#__PURE__*/React.createElement(Pos, {
      x: xy[0],
      y: xy[1],
      e: e,
      dy: vida,
      ancla: b.ancla || anclaDe(b.pos || 'abajo')
    }, /*#__PURE__*/React.createElement(Palabras, {
      T: T,
      txt: b.txt,
      tiempos: b.tiempos,
      c: b.ini,
      escalonado: 0.07,
      fs: fs,
      color: b.color || 'blanco',
      marcadas: b.marcadas,
      acento: b.acento || 'caja',
      peso: 800,
      sombra: true,
      mayus: b.mayus,
      alinear: anclaDe(b.pos || 'abajo') === 'izq' ? 'izq' : anclaDe(b.pos || 'abajo') === 'der' ? 'der' : 'centro'
    })));
  }

  // tarjeta flotante sobre la camara: titulo, texto, lista o numero
  function TarjetaBeat(props) {
    var T = props.T,
      b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.4) return null;
    var lado = b.lado || 'izq';
    var xy = posicion(b.pos || lado, lado);
    var w = b.ancho || 640;
    var dur = b.fin - b.ini;
    var f = function (v) {
      return b.ini + dur * v;
    };
    var items = b.items || [];
    return /*#__PURE__*/React.createElement(Tarjeta, {
      T: T,
      x: xy[0],
      y: xy[1],
      c: b.ini,
      s: b.fin,
      w: w,
      ancla: lado,
      giroY: lado === 'izq' ? 10 : -10,
      relleno: "44px 48px 46px"
    }, b.etiqueta ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_MONO,
        fontWeight: 500,
        fontSize: 24,
        letterSpacing: '0.12em',
        color: TENUE,
        textTransform: 'uppercase',
        marginBottom: 14
      }
    }, b.etiqueta) : null, b.titulo ? /*#__PURE__*/React.createElement(Palabras, {
      T: T,
      txt: b.titulo,
      c: b.ini + 0.2,
      fs: b.fsTitulo || 64,
      peso: 900,
      alinear: "izq",
      marcadas: b.marcadas,
      escalonado: 0.05
    }) : null, b.valor != null ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 900,
        fontSize: b.fsValor || 150,
        letterSpacing: '-0.05em',
        lineHeight: 0.95,
        color: col(b.colorValor, INK),
        marginTop: 8,
        opacity: clamp((T - b.ini - 0.25) / 0.3, 0, 1)
      }
    }, typeof b.valor === 'number' ? formato(b.valor * prog(T, b.ini + 0.25, 1.2), b.decimales) : b.valor, b.unidad ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: (b.fsValor || 150) * 0.38,
        letterSpacing: '-0.02em',
        marginLeft: 10
      }
    }, b.unidad) : null) : null, b.texto ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 600,
        fontSize: 38,
        lineHeight: 1.22,
        color: 'rgba(20,17,15,0.75)',
        marginTop: 14,
        opacity: clamp((T - b.ini - 0.35) / 0.3, 0, 1)
      }
    }, b.texto) : null, items.map(function (it, i) {
      var c = it.t != null ? it.t : f(0.15 + 0.5 * i / Math.max(1, items.length));
      var en = entra(T, c, {
        dy: 16,
        blur: 6,
        dx: -14
      });
      var marca = it.mal ? RED : it.bien ? GRN : YEL;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          marginTop: i ? 18 : 26,
          opacity: en.opacity,
          transform: 'translate(' + en.x + 'px,' + en.y + 'px)',
          filter: en.blur > 0.2 ? 'blur(' + en.blur.toFixed(1) + 'px)' : undefined
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 22,
          height: 22,
          borderRadius: 11,
          background: marca,
          flex: 'none'
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F,
          fontWeight: 700,
          fontSize: 42,
          letterSpacing: '-0.02em',
          color: INK,
          lineHeight: 1.1
        }
      }, it.texto));
    }), b.barra != null ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 26,
        height: 22,
        borderRadius: 11,
        background: 'rgba(20,17,15,0.1)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        borderRadius: 11,
        background: col(b.colorBarra, YEL),
        width: (100 * b.barra * prog(T, b.ini + 0.4, 1.1, Easing.easeInOutCubic)).toFixed(1) + '%'
      }
    })) : null);
  }

  // caja de dato (Nippard): panel oscuro translucido, rotulo mono y numero grande
  // filas: [{ etiqueta, valor, color }]
  function DatoBeat(props) {
    var T = props.T,
      b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.4) return null;
    var lado = b.lado || 'izq';
    var xy = posicion(b.pos || (lado === 'izq' ? 'abajoizq' : 'abajoder'), lado);
    var e = junta(entra(T, b.ini, {
      dy: 0,
      dx: lado === 'izq' ? -60 : 60,
      blur: 10
    }), sale(T, b.fin));
    var filas = b.filas || [{
      etiqueta: b.etiqueta,
      valor: b.valor,
      color: b.color
    }];
    return /*#__PURE__*/React.createElement(Pos, {
      x: xy[0],
      y: xy[1] - 60 * filas.length,
      e: e,
      ancla: lado,
      dy: deriva(T, 0.4, 1.5)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'rgba(20,17,15,0.80)',
        borderRadius: 18,
        overflow: 'hidden',
        minWidth: 520,
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        border: '2px solid rgba(255,255,255,0.10)'
      }
    }, filas.map(function (fl, i) {
      var c = b.ini + 0.15 + i * 0.35;
      var p = prog(T, c, 1.1, Easing.easeOutExpo);
      var v = typeof fl.valor === 'number' ? formato(fl.valor * p, fl.decimales) : fl.valor;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          padding: '22px 34px 24px',
          borderTop: i ? '2px solid rgba(255,255,255,0.10)' : 'none',
          opacity: clamp((T - c) / 0.25, 0, 1)
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F_MONO,
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: '0.14em',
          color: 'rgba(255,255,255,0.6)',
          textTransform: 'uppercase'
        }
      }, fl.etiqueta), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          marginTop: 6
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: F,
          fontWeight: 900,
          fontSize: 96,
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          color: col(fl.color, i === filas.length - 1 ? YEL : BLANCO),
          fontVariantNumeric: 'tabular-nums'
        }
      }, v), fl.unidad ? /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: F,
          fontWeight: 700,
          fontSize: 40,
          color: 'rgba(255,255,255,0.8)'
        }
      }, fl.unidad) : null));
    })));
  }

  // recorte de un estudio: papel con borde rasgado y la frase resaltada en amarillo
  function papelRasgado(w, h, sem) {
    var pts = [],
      n = 26,
      i,
      a = sem;
    var r = function () {
      a = (a * 9301 + 49297) % 233280;
      return a / 233280;
    };
    pts.push('0,' + (6 + r() * 8).toFixed(1));
    for (i = 1; i <= n; i++) pts.push((w * i / n).toFixed(1) + ',' + (r() * 14).toFixed(1));
    for (i = n; i >= 0; i--) pts.push((w * i / n).toFixed(1) + ',' + (h - r() * 14).toFixed(1));
    return 'polygon(' + pts.map(function (q) {
      var s = q.split(',');
      return s[0] + 'px ' + s[1] + 'px';
    }).join(',') + ')';
  }
  function PaperBeat(props) {
    var T = props.T,
      b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.4) return null;
    var xy = posicion(b.pos || 'izq', 'izq');
    var w = b.ancho || 820;
    var lado = anclaDe(b.pos || 'izq');
    var e = junta(entra(T, b.ini, {
      dy: 60,
      blur: 10,
      giro: lado === 'izq' ? -6 : 6,
      dur: 0.8
    }), sale(T, b.fin));
    var pals = String(b.texto).split(' ');
    var marcadas = (b.resaltar || '').split(' ').map(norm).filter(Boolean);
    var cR = b.cResalta || b.ini + 0.6;
    var orden = 0;
    return /*#__PURE__*/React.createElement(Pos, {
      x: xy[0],
      y: xy[1],
      e: e,
      rot: b.rot == null ? lado === 'izq' ? -2 : 2 : b.rot,
      dy: deriva(T, 0.3, 2.5),
      ancla: lado
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        filter: 'drop-shadow(0 26px 40px rgba(0,0,0,0.35))'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        background: '#FBFAF7',
        clipPath: papelRasgado(w, b.alto || 360, Math.round(hash(b.texto) * 1000)),
        padding: '40px 46px',
        height: b.alto || 360,
        boxSizing: 'border-box'
      }
    }, b.fuente ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_MONO,
        fontSize: 20,
        color: 'rgba(20,17,15,0.55)',
        marginBottom: 14,
        letterSpacing: '0.04em'
      }
    }, b.fuente) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: b.fs || 38,
        lineHeight: 1.35,
        color: INK
      }
    }, pals.map(function (p, i) {
      var marcada = marcadas.indexOf(norm(p)) >= 0;
      var k = marcada ? orden++ : 0;
      var pr = marcada ? prog(T, cR + k * 0.05, 0.3, Easing.easeOutQuad) : 0;
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'relative',
          display: 'inline-block'
        }
      }, marcada ? /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: -4,
          right: -4,
          top: '6%',
          bottom: '0%',
          background: YEL,
          transformOrigin: '0 50%',
          transform: 'scaleX(' + pr.toFixed(3) + ')',
          zIndex: 0
        }
      }) : null, /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'relative'
        }
      }, p)), ' ');
    })))));
  }

  // imagen propia (captura, foto): tarjeta con sombra suave; 'completa' llena la pantalla
  function ImagenBeat(props) {
    var T = props.T,
      b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.4) return null;
    if (b.estilo === 'completa') {
      var k = clamp((T - b.ini) / Math.max(0.1, b.fin - b.ini), 0, 1);
      var op = Math.min(clamp((T - b.ini) / 0.2, 0, 1), clamp((b.fin + 0.2 - T) / 0.2, 0, 1));
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          opacity: op,
          background: INK
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: b.src,
        alt: "",
        style: {
          width: ANCHO,
          height: ALTO,
          objectFit: b.ajuste || 'cover',
          transform: 'scale(' + (1.02 + 0.06 * k).toFixed(4) + ')'
        }
      }));
    }
    var xy = posicion(b.pos || 'izq', 'izq');
    var lado = anclaDe(b.pos || 'izq');
    var w = b.ancho || 760;
    return /*#__PURE__*/React.createElement(Tarjeta, {
      T: T,
      x: xy[0],
      y: xy[1],
      c: b.ini,
      s: b.fin,
      w: w,
      ancla: lado,
      rot: b.rot == null ? (hash(b.src) - 0.5) * 4 : b.rot,
      relleno: 14,
      radio: 24,
      giroY: lado === 'izq' ? 12 : -12
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: b.src,
      alt: "",
      style: {
        display: 'block',
        width: '100%',
        borderRadius: 14
      }
    }), (b.resaltar || []).map(function (r, i) {
      var p = prog(T, r.c, 0.4, Easing.easeOutQuad);
      if (p <= 0) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: 'absolute',
          left: r.x * 100 + '%',
          top: r.y * 100 + '%',
          width: r.w * 100 * p + '%',
          height: r.h * 100 + '%',
          background: YEL,
          mixBlendMode: 'multiply'
        }
      });
    })), b.pie ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 800,
        fontSize: 40,
        color: INK,
        padding: '16px 10px 6px',
        letterSpacing: '-0.02em'
      }
    }, b.pie) : null);
  }

  /* =========================================================
     PANTALLAS ARMADAS
     ========================================================= */

  // capitulo: el "01 | PREGUNTA" de disciplina, en limpio
  function EscCapitulo(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var n = String(props.n).padStart(2, '0');
    sonido('golpe', at + 0.05, 0.5);
    var titulo = String(props.titulo);
    var largo = titulo.length;
    var fsT = largo > 46 ? 82 : largo > 30 ? 96 : 112;
    var pN = prog(T, at, 0.8);
    var pL = prog(T, at + 0.15, 0.7, Easing.easeInOutCubic);
    return /*#__PURE__*/React.createElement(Escena, {
      T: T,
      at: at,
      dur: dur,
      fondo: props.fondo || 'claro',
      empuje: 0.04
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 150,
        top: 540,
        transform: 'translateY(-50%)',
        overflow: 'hidden',
        padding: '0 20px 24px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 900,
        fontSize: 340,
        lineHeight: 0.86,
        letterSpacing: '-0.06em',
        color: INK,
        transform: 'translateY(' + ((1 - pN) * 100).toFixed(1) + '%)'
      }
    }, n), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 26,
        background: YEL,
        marginTop: 10,
        borderRadius: 4,
        transformOrigin: '0 50%',
        transform: 'scaleX(' + prog(T, at + 0.35, 0.6, Easing.easeOutQuart).toFixed(4) + ')'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 640,
        top: 540 - 220 * pL,
        width: 7,
        height: 440 * pL,
        background: INK,
        borderRadius: 4
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 720,
        top: 540,
        transform: 'translateY(-50%)',
        width: 1080
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_MONO,
        fontWeight: 500,
        fontSize: 30,
        letterSpacing: '0.16em',
        color: TENUE,
        marginBottom: 22,
        opacity: clamp((T - at - 0.2) / 0.3, 0, 1)
      }
    }, 'CAPÍTULO ' + Number(props.n) + (props.de ? ' DE ' + props.de : '')), /*#__PURE__*/React.createElement(Palabras, {
      T: T,
      txt: titulo.toUpperCase(),
      c: at + 0.25,
      escalonado: Math.min(0.08, 0.9 / titulo.split(' ').length),
      fs: fsT,
      peso: 900,
      alinear: "izq",
      ancho: 1080,
      marcadas: props.marcadas || [titulo.split(' ').slice(-1)[0]],
      tracking: "-0.03em"
    })));
  }

  // cita: comillas amarillas grandes, la frase al ritmo de la voz y el autor
  function EscCita(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var pals = String(props.texto).split(' ');
    var fs = props.tam ? 86 * props.tam : pals.length > 18 ? 70 : pals.length > 10 ? 82 : 96;
    var pq = prog(T, at, 0.8);
    var izq = props.dividida ? 140 : 360,
      ancho = props.dividida ? 900 : 1240;
    return /*#__PURE__*/React.createElement(Escena, {
      T: T,
      at: at,
      dur: dur,
      fondo: props.fondo || 'claro',
      dividida: props.dividida
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: izq,
        top: 0,
        height: 1080,
        width: ancho,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -250,
        top: -170,
        fontFamily: F,
        fontWeight: 900,
        fontSize: 420,
        lineHeight: 1,
        color: YEL,
        transform: 'translateY(' + ((1 - pq) * 60).toFixed(1) + 'px)',
        opacity: pq
      }
    }, "\u201C"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Palabras, {
      T: T,
      txt: props.texto,
      tiempos: props.tiempos,
      c: at + 0.15,
      escalonado: 0.08,
      fs: fs,
      peso: 800,
      alinear: "izq",
      ancho: ancho,
      marcadas: props.marcadas,
      italica: props.italica !== false
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 22,
        marginTop: 56,
        opacity: clamp((T - at - 0.4) / 0.4, 0, 1),
        transform: 'translateX(' + ((1 - prog(T, at + 0.4, 0.7)) * -40).toFixed(1) + 'px)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70,
        height: 7,
        background: INK,
        borderRadius: 4
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 900,
        fontSize: 52,
        letterSpacing: '-0.02em',
        color: INK
      }
    }, props.autor), props.rol ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_MONO,
        fontSize: 26,
        letterSpacing: '0.1em',
        color: TENUE,
        textTransform: 'uppercase'
      }
    }, props.rol) : null)));
  }

  // lista de puntos: numero mono + texto; los que ya pasaron quedan en tinta
  function EscLista(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var f = function (v) {
      return at + dur * v;
    };
    var items = props.items || [];
    var izq = props.dividida ? 130 : 330;
    var alto = Math.min(170, 700 / Math.max(1, items.length));
    var y0 = 560 - (items.length - 1) * alto / 2 + (props.titulo ? 50 : 0);
    var largo = Math.max.apply(null, items.map(function (it) {
      return String(it.texto).length;
    }).concat([1]));
    var fs = Math.min(alto * 0.5, (props.dividida ? 820 : 1180) / (largo * 0.5));
    return /*#__PURE__*/React.createElement(Escena, {
      T: T,
      at: at,
      dur: dur,
      fondo: props.fondo || 'claro',
      dividida: props.dividida
    }, props.titulo ? /*#__PURE__*/React.createElement(Titulo, {
      T: T,
      x: izq,
      y: 150,
      c: at + 0.05,
      ancla: "izq",
      tam: 0.8,
      marcadas: props.marcadas
    }, String(props.titulo)) : null, items.map(function (it, i) {
      var c = it.t != null ? it.t : f(0.08 + 0.6 * i / items.length);
      var y = y0 + i * alto;
      var en = entra(T, c, {
        dy: 0,
        dx: -50,
        blur: 10
      });
      var activo = props.activo == null || props.activo === i;
      return /*#__PURE__*/React.createElement(Pos, {
        key: i,
        x: izq,
        y: y,
        e: en,
        ancla: "izq"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 34
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F_MONO,
          fontWeight: 600,
          fontSize: fs * 0.55,
          color: activo ? INK : TENUE,
          width: fs * 1.2,
          letterSpacing: '0.04em'
        }
      }, String(i + 1).padStart(2, '0')), it.ico ? /*#__PURE__*/React.createElement(Ico, {
        n: it.ico,
        T: T,
        c: c,
        tam: fs * 1.4
      }) : null, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F,
          fontWeight: 800,
          fontSize: fs,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          color: activo ? INK : 'rgba(20,17,15,0.28)',
          whiteSpace: 'nowrap'
        }
      }, it.texto), it.tacha ? /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: -6,
          top: '52%',
          height: fs * 0.12,
          borderRadius: 6,
          background: RED,
          width: 104 * prog(T, it.tacha, 0.35, Easing.easeOutQuart) + '%'
        }
      }) : null), it.check ? /*#__PURE__*/React.createElement("div", {
        style: {
          marginLeft: 10
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: fs * 0.9,
        height: fs * 0.9,
        viewBox: "0 0 120 120"
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "60",
        cy: "60",
        r: "54",
        fill: GRN,
        opacity: clamp((T - it.check) / 0.2, 0, 1)
      }), /*#__PURE__*/React.createElement("path", {
        d: "M 34 62 L 52 80 L 88 42",
        fill: "none",
        stroke: BLANCO,
        strokeWidth: "13",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        pathLength: 1,
        strokeDasharray: "1 1",
        strokeDashoffset: 1 - prog(T, it.check + 0.05, 0.4, Easing.easeInOutCubic)
      }))) : null));
    }));
  }

  // pantalla final: los dos huecos de YouTube + marca y redes
  function EscCierre(props) {
    var T = props.T,
      at = props.at,
      dur = props.dur;
    var MARCA = global.MARCA;
    var hueco = function (x, c, txt) {
      return /*#__PURE__*/React.createElement(Tarjeta, {
        T: T,
        x: x,
        y: 600,
        c: c,
        w: 620,
        h: 349,
        radio: 26,
        quieto: true
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(20,17,15,0.05)'
        }
      }, /*#__PURE__*/React.createElement(Etiqueta, {
        tam: 0.9,
        dir: "ninguna"
      }, txt)));
    };
    sonido('marca', at + 0.05);
    return /*#__PURE__*/React.createElement(Escena, {
      T: T,
      at: at,
      dur: dur,
      fondo: "claro",
      empuje: 0.02
    }, MARCA ? /*#__PURE__*/React.createElement(Pos, {
      x: 960,
      y: 190,
      e: entra(T, at + 0.05, {
        dy: 30
      })
    }, /*#__PURE__*/React.createElement(MARCA.Nombre, {
      s: 0.6,
      p: prog(T, at + 0.2, 0.6, Easing.easeInOutCubic)
    })) : null, hueco(560, at + 0.25, 'MIRA ESTE VIDEO'), hueco(1360, at + 0.4, 'Y ESTE TAMBIÉN'), /*#__PURE__*/React.createElement(Pos, {
      x: 960,
      y: 930,
      e: entra(T, at + 0.55, {
        dy: 24
      })
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 24
      }
    }, MARCA ? ['youtube', 'instagram', 'tiktok'].map(function (r) {
      return /*#__PURE__*/React.createElement(MARCA.Red, {
        key: r,
        red: r,
        s: 0.36
      });
    }) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 900,
        fontSize: 64,
        letterSpacing: '-0.03em',
        color: INK,
        marginLeft: 8
      }
    }, "@eltorvick"))));
  }

  /* =========================================================
     ENCIMA: CTA de suscripcion (con la foto de perfil), meta,
     rotulo de capitulo
     ========================================================= */

  function Campana(props) {
    return /*#__PURE__*/React.createElement("svg", {
      width: props.tam,
      height: props.tam,
      viewBox: "0 0 100 100",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 50 14 C 30 14 24 30 24 46 L 24 62 L 15 74 L 85 74 L 76 62 L 76 46 C 76 30 70 14 50 14 Z",
      fill: YEL,
      stroke: INK,
      strokeWidth: "7",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 40 82 Q 50 92 60 82",
      fill: "none",
      stroke: INK,
      strokeWidth: "7",
      strokeLinecap: "round"
    }));
  }
  function Pulgar(props) {
    return /*#__PURE__*/React.createElement("svg", {
      width: props.tam,
      height: props.tam,
      viewBox: "0 0 100 100",
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 14 46 L 30 46 L 30 86 L 14 86 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: "7",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 30 48 L 46 18 C 54 16 58 22 56 32 L 52 44 L 80 44 C 88 44 90 52 86 58 L 78 82 C 76 86 72 86 68 86 L 30 86 Z",
      fill: YEL,
      stroke: INK,
      strokeWidth: "7",
      strokeLinejoin: "round"
    }));
  }
  function Suscribete(props) {
    var T = props.T,
      b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.4) return null;
    var dur = b.fin - b.ini;
    var f = function (v) {
      return b.ini + dur * v;
    };
    var clic = f(0.42);
    var hecho = T >= clic;
    var e = junta(entra(T, b.ini, {
      dy: 60,
      blur: 12,
      dur: 0.7
    }), sale(T, b.fin, 0.3));
    var cursorP = Easing.easeInOutCubic(clamp((T - f(0.12)) / (clic - f(0.12)), 0, 1));
    var hundido = T >= clic && T < clic + 0.12 ? 0.93 : 1;
    var campana = hecho ? Math.sin((T - clic - 0.1) * 28) * 16 * Math.exp(-Math.max(0, T - clic - 0.1) * 2.4) * (T > clic + 0.1 ? 1 : 0) : 0;
    var xy = posicion(b.pos || [960, 920]);
    var foto = b.foto || PERFIL;
    return /*#__PURE__*/React.createElement(Pos, {
      x: xy[0],
      y: xy[1],
      e: e,
      dy: deriva(T, 0.1, 2)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        background: BLANCO,
        borderRadius: 999,
        padding: '14px 26px 14px 14px',
        boxShadow: SOMBRA,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 96,
        height: 96,
        borderRadius: 99,
        overflow: 'hidden',
        flex: 'none',
        boxShadow: '0 0 0 5px ' + YEL
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: foto,
      alt: "",
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F,
        fontWeight: 900,
        fontSize: 50,
        color: INK,
        lineHeight: 1,
        letterSpacing: '-0.03em'
      }
    }, "Torvick"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_MONO,
        fontWeight: 500,
        fontSize: 22,
        color: TENUE,
        letterSpacing: '0.06em',
        marginTop: 6
      }
    }, "@eltorvick")), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'scale(' + hundido + ')',
        background: hecho ? '#E7E5E0' : RED,
        color: hecho ? INK : BLANCO,
        fontFamily: F,
        fontWeight: 800,
        fontSize: 38,
        letterSpacing: '0.02em',
        padding: '20px 40px',
        borderRadius: 999,
        marginLeft: 16
      }
    }, hecho ? 'Suscrito' : 'Suscribirse'), /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'rotate(' + campana.toFixed(1) + 'deg)',
        transformOrigin: '50% 12%'
      }
    }, /*#__PURE__*/React.createElement(Campana, {
      tam: 64
    })), /*#__PURE__*/React.createElement(Pulgar, {
      tam: 64
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 300 + 270 * cursorP,
        top: 150 - 80 * cursorP,
        transform: 'scale(' + hundido + ')',
        filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.3))'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "56",
      height: "70",
      viewBox: "0 0 70 86",
      style: {
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 6 4 L 6 66 L 22 52 L 34 80 L 46 74 L 34 48 L 56 48 Z",
      fill: BLANCO,
      stroke: INK,
      strokeWidth: "6",
      strokeLinejoin: "round"
    })))));
  }

  // meta de suscriptores: numero que sube y barra que se llena
  function Meta(props) {
    var T = props.T,
      b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.4) return null;
    var dur = b.fin - b.ini;
    var p = Easing.easeInOutCubic(clamp((T - b.ini - dur * 0.2) / (dur * 0.5), 0, 1));
    var v = Math.round(b.desde + (b.hasta - b.desde) * p);
    var xy = posicion(b.pos || [1800, 330]);
    return /*#__PURE__*/React.createElement(Tarjeta, {
      T: T,
      x: xy[0],
      y: xy[1],
      c: b.ini,
      s: b.fin,
      w: 600,
      ancla: "der",
      relleno: "34px 42px 40px",
      giroY: -10
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_MONO,
        fontSize: 24,
        fontWeight: 500,
        letterSpacing: '0.14em',
        color: TENUE
      }
    }, "SUSCRIPTORES \xB7 META"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F,
        fontWeight: 900,
        fontSize: 120,
        color: INK,
        lineHeight: 1,
        letterSpacing: '-0.05em',
        fontVariantNumeric: 'tabular-nums'
      }
    }, formato(v)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F,
        fontWeight: 800,
        fontSize: 52,
        color: TENUE,
        lineHeight: 1
      }
    }, "/ ", formato(b.hasta))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 22,
        borderRadius: 11,
        overflow: 'hidden',
        background: 'rgba(20,17,15,0.1)',
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        width: (100 * (0.04 + 0.96 * p * (b.lleno == null ? 1 : b.lleno))).toFixed(1) + '%',
        background: YEL,
        borderRadius: 11
      }
    })));
  }

  // rotulo chico de capitulo arriba a la izquierda, despues de cada tarjeta de capitulo
  function RotuloCapitulo(props) {
    var T = props.T,
      def = props.def;
    var out = null;
    def.capitulos.forEach(function (c) {
      var a = c.fin + 0.1,
        b = c.fin + 4.4;
      if (T < a - 0.05 || T > b + 0.4) return;
      var e = junta(entra(T, a, {
        dy: 0,
        dx: -40,
        blur: 8
      }), sale(T, b));
      out = /*#__PURE__*/React.createElement(Pos, {
        x: 70,
        y: 80,
        e: e,
        ancla: "izq"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F_MONO,
          fontWeight: 600,
          fontSize: 30,
          background: YEL,
          color: INK,
          padding: '12px 18px'
        }
      }, String(c.n).padStart(2, '0')), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: F,
          fontWeight: 800,
          fontSize: 30,
          background: 'rgba(20,17,15,0.85)',
          color: BLANCO,
          padding: '12px 22px',
          letterSpacing: '0.02em',
          whiteSpace: 'nowrap'
        }
      }, c.corto || c.titulo)));
    });
    return out;
  }
  function Flashes(props) {
    var T = props.T;
    var a = 0;
    props.def.flashes.forEach(function (fl) {
      if (T >= fl.t && T < fl.t + 0.25) a = Math.max(a, 1 - (T - fl.t) / 0.25);
    });
    if (a <= 0) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: BLANCO,
        opacity: a * 0.7
      }
    });
  }

  /* =========================================================
     PLAN: constructores de beats (LARGOS.plan)
     ========================================================= */

  var plan = {
    // texto sobre la camara: estilo linea | titular | caja | etiqueta
    texto: function (ini, fin, txt, o) {
      return Object.assign({
        tipo: 'texto',
        ini: ini,
        fin: fin,
        txt: txt
      }, o || {});
    },
    titular: function (ini, fin, txt, o) {
      return Object.assign({
        tipo: 'texto',
        estilo: 'titular',
        ini: ini,
        fin: fin,
        txt: txt
      }, o || {});
    },
    caja: function (ini, fin, txt, o) {
      return Object.assign({
        tipo: 'texto',
        estilo: 'caja',
        ini: ini,
        fin: fin,
        txt: txt
      }, o || {});
    },
    etiqueta: function (ini, fin, txt, o) {
      return Object.assign({
        tipo: 'texto',
        estilo: 'etiqueta',
        ini: ini,
        fin: fin,
        txt: txt
      }, o || {});
    },
    // texto gigante detras de la persona
    detras: function (ini, fin, txt, o) {
      return Object.assign({
        tipo: 'detras',
        ini: ini,
        fin: fin,
        txt: txt
      }, o || {});
    },
    // tarjeta flotante: { lado, etiqueta, titulo, valor, unidad, texto, items, barra }
    tarjeta: function (ini, fin, o) {
      return Object.assign({
        tipo: 'tarjeta',
        ini: ini,
        fin: fin
      }, o || {});
    },
    // caja de dato oscura: { filas: [{ etiqueta, valor, unidad, color }] } o { etiqueta, valor }
    dato: function (ini, fin, o) {
      return Object.assign({
        tipo: 'dato',
        ini: ini,
        fin: fin
      }, o || {});
    },
    // recorte de estudio: { fuente, texto, resaltar: 'palabras a resaltar', pos }
    paper: function (ini, fin, o) {
      return Object.assign({
        tipo: 'paper',
        ini: ini,
        fin: fin
      }, o || {});
    },
    // imagen propia: largos/<id>/media/... (estilo tarjeta | completa; pie; resaltar)
    imagen: function (ini, fin, src, o) {
      return Object.assign({
        tipo: 'imagen',
        ini: ini,
        fin: fin,
        src: src
      }, o || {});
    },
    camara: function (ini, fin, o) {
      return Object.assign({
        tipo: 'camara',
        ini: ini,
        fin: fin,
        mov: 'corte'
      }, o || {});
    },
    // escena a pantalla completa; o.camara = 'der' | 'izq' la vuelve dividida (camara en tarjeta)
    escena: function (ini, fin, C, props, o) {
      return Object.assign({
        tipo: 'pantalla',
        ini: ini,
        fin: fin,
        C: C,
        props: props || {}
      }, o || {});
    },
    capitulo: function (ini, fin, o) {
      return {
        tipo: 'pantalla',
        capitulo: true,
        ini: ini,
        fin: fin,
        C: EscCapitulo,
        props: o,
        entra: o.entra || 'barrido',
        sale: o.sale
      };
    },
    cita: function (ini, fin, o) {
      return {
        tipo: 'pantalla',
        cita: true,
        ini: ini,
        fin: fin,
        C: EscCita,
        props: o,
        entra: o.entra,
        sale: o.sale,
        camara: o.camara
      };
    },
    lista: function (ini, fin, o) {
      return {
        tipo: 'pantalla',
        ini: ini,
        fin: fin,
        C: EscLista,
        props: o,
        entra: o.entra,
        sale: o.sale,
        camara: o.camara
      };
    },
    cierre: function (ini, fin, o) {
      return {
        tipo: 'pantalla',
        ini: ini,
        fin: fin,
        C: EscCierre,
        props: o || {},
        entra: 'barrido',
        sale: 'corte'
      };
    },
    suscribete: function (ini, fin, o) {
      return Object.assign({
        tipo: 'suscribete',
        ini: ini,
        fin: fin
      }, o || {});
    },
    meta: function (ini, fin, o) {
      return Object.assign({
        tipo: 'meta',
        ini: ini,
        fin: fin
      }, o || {});
    },
    sonido: function (t, tipo, g) {
      return {
        tipo: 'sonido',
        ini: t,
        fin: t,
        sfx: tipo,
        g: g
      };
    },
    flash: function (t) {
      return {
        tipo: 'flash',
        ini: t,
        fin: t + 0.25
      };
    },
    sacudida: function (t, fuerza) {
      return {
        tipo: 'sacudida',
        ini: t,
        fin: t + 0.5,
        fuerza: fuerza
      };
    },
    // tramo donde se deja el video tal cual (p. ej. un clip de archivo que ya funciona)
    mantener: function (ini, fin) {
      return {
        tipo: 'mantener',
        ini: ini,
        fin: fin
      };
    }
  };

  /* =========================================================
     TRANSCRIPCION: buscar el segundo en que se dice una frase
     ========================================================= */

  function transcripcion(id) {
    return (global.TRANSCRIPCIONES || {})[id] || {
      dur: 0,
      palabras: [],
      frases: []
    };
  }

  // devuelve una funcion t(frase, desde) -> segundo de inicio de la frase (y t.fin -> fin)
  function buscador(id) {
    var tr = transcripcion(id);
    var ws = tr.palabras.map(function (w) {
      return norm(w.p);
    });
    function hallar(frase, desde) {
      var q = String(frase).split(/\s+/).map(norm).filter(Boolean);
      desde = desde || 0;
      for (var i = 0; i < ws.length; i++) {
        if (tr.palabras[i].ini < desde - 0.01) continue;
        var ok = true;
        for (var j = 0; j < q.length; j++) {
          if (ws[i + j] !== q[j]) {
            ok = false;
            break;
          }
        }
        if (ok) return [i, i + q.length - 1];
      }
      if (global.console) console.warn('no encuentro en la transcripcion:', frase, 'desde', desde);
      return null;
    }
    var t = function (frase, desde) {
      var r = hallar(frase, desde);
      return r ? tr.palabras[r[0]].ini : desde || 0;
    };
    t.fin = function (frase, desde) {
      var r = hallar(frase, desde);
      return r ? tr.palabras[r[1]].fin : desde || 0;
    };
    t.palabras = tr.palabras;
    return t;
  }

  // tiempos de cada palabra de un texto, buscados en la voz entre ini y fin
  function tiemposDe(id, txt, ini, fin) {
    var tr = transcripcion(id);
    var pals = String(txt).replace(/\n/g, ' ').split(' ').filter(Boolean);
    var out = [],
      j = 0;
    var cand = tr.palabras.filter(function (w) {
      return w.ini >= ini - 0.35 && w.ini <= fin;
    });
    pals.forEach(function (p) {
      var q = norm(p),
        hall = null;
      for (var k = j; k < cand.length; k++) {
        if (norm(cand[k].p) === q) {
          hall = cand[k];
          j = k + 1;
          break;
        }
      }
      out.push(hall ? Math.max(ini, hall.ini) : null);
    });
    for (var i = 0; i < out.length; i++) {
      if (out[i] != null) continue;
      var a = i > 0 ? out[i - 1] : ini;
      var b = null;
      for (var k = i + 1; k < out.length; k++) if (out[k] != null) {
        b = out[k];
        break;
      }
      if (b == null) b = Math.min(fin, a + 0.3 * (out.length - i));
      out[i] = a + (b - a) / 2;
    }
    return out;
  }

  /* =========================================================
     REGISTRO y preparacion del plan
     ========================================================= */

  var REGISTRO = [];
  var ENCIMA = ['texto', 'tarjeta', 'dato', 'paper', 'imagen', 'suscribete', 'meta'];
  function zonaDe(b) {
    if (b.tipo === 'texto') return 'texto:' + (b.estilo || 'linea') + ':' + posicion(b.pos || (b.estilo === 'titular' ? b.lado || 'izq' : 'abajo')).join(',');
    if (b.tipo === 'tarjeta' || b.tipo === 'imagen' || b.tipo === 'paper' || b.tipo === 'dato') return 'lado:' + (b.lado || anclaDe(b.pos || 'izq'));
    return null;
  }
  function preparar(def) {
    var d = Object.assign({
      encuadre: {
        zoom: 1,
        foco: [0.5, 0.5]
      }
    }, def);
    var beats = (def.plan || []).filter(Boolean);
    d.camaras = beats.filter(function (b) {
      return b.tipo === 'camara';
    });
    d.pantallas = beats.filter(function (b) {
      return b.tipo === 'pantalla';
    });
    d.encima = beats.filter(function (b) {
      return ENCIMA.indexOf(b.tipo) >= 0;
    });
    d.detras = beats.filter(function (b) {
      return b.tipo === 'detras';
    });
    d.sacudidas = beats.filter(function (b) {
      return b.tipo === 'sacudida';
    }).map(function (b) {
      return {
        t: b.ini,
        fuerza: b.fuerza
      };
    });
    d.flashes = beats.filter(function (b) {
      return b.tipo === 'flash';
    }).map(function (b) {
      return {
        t: b.ini
      };
    });
    d.mantener = beats.filter(function (b) {
      return b.tipo === 'mantener';
    });
    d.capitulos = d.pantallas.filter(function (b) {
      return b.capitulo;
    }).map(function (b) {
      return {
        n: b.props.n,
        titulo: b.props.titulo,
        corto: b.props.corto,
        ini: b.ini,
        fin: b.fin
      };
    });
    // lo de encima de la camara se va antes de que entre una escena a pantalla completa
    // (si empieza dentro de una escena, es a proposito y se respeta)
    // y si empieza cuando la escena ya tapa la camara, no sale (avisa: es un tiempo mal puesto)
    d.encima.concat(d.detras).forEach(function (b) {
      if (b.sobreEscena) return;
      d.pantallas.forEach(function (pn) {
        if (pn.camara) return;
        var vent = VENTANA[pn.entra || 'latigo'] || 0;
        var corte = pn.ini - vent;
        if (corte > b.ini && corte < b.fin) b.fin = corte;else if (b.ini >= corte && b.ini < pn.fin) {
          if (global.console) console.warn('texto dentro de una escena (no sale):', b.txt || b.tipo, b.ini.toFixed(2));
          b.fin = b.ini;
        }
      });
    });
    // dos cosas en la misma zona no se pisan: la anterior se va justo antes
    var ultimo = {};
    d.encima.slice().sort(function (x, y) {
      return x.ini - y.ini;
    }).forEach(function (b) {
      var k = zonaDe(b);
      if (!k) return;
      var prev = ultimo[k];
      if (prev && b.ini < prev.fin + 0.1) prev.fin = Math.max(prev.ini, b.ini - 0.18);
      ultimo[k] = b;
    });
    // lo que queda menos de 0.4 s a la vista no llega a leerse: se saca
    d.encima = d.encima.filter(function (b) {
      return b.fin - b.ini >= 0.4;
    });
    d.detras = d.detras.filter(function (b) {
      return b.fin - b.ini >= 0.4;
    });
    d.encima.forEach(function (b) {
      if (b.tipo === 'texto' && (b.estilo || 'linea') !== 'caja' && b.estilo !== 'etiqueta' && b.voz !== false) {
        b.tiempos = tiemposDe(d.id, b.txt, b.ini, b.fin);
      }
    });
    d.pantallas.forEach(function (b) {
      if (b.props && b.props.texto && !b.props.tiempos && b.props.voz !== false) {
        b.props.tiempos = tiemposDe(d.id, b.props.texto, b.ini - 0.3, b.fin);
      }
    });
    d.dur = def.dur || transcripcion(d.id).dur || 60;

    // efectos fijos de cada beat (los de las escenas se marcan al dibujarlas)
    d.cuesFijos = [];
    var cue = function (tipo, t, g) {
      d.cuesFijos.push({
        tipo: tipo,
        t: Math.round(t * 1000) / 1000,
        g: g == null ? 1 : g
      });
    };
    beats.forEach(function (b) {
      if (b.sfx === false) return;
      if (ENCIMA.indexOf(b.tipo) >= 0 && d.encima.indexOf(b) < 0) return;
      if (b.tipo === 'texto') {
        var es = b.estilo || 'linea';
        if (es === 'titular') cue('whoosh', b.ini - 0.05, 0.35);else if (es === 'caja') cue('pop', b.ini, 0.55);else if (es === 'etiqueta') cue('click', b.ini, 0.45);else cue('pop', b.tiempos ? b.tiempos[0] : b.ini, 0.3);
      } else if (b.tipo === 'detras') cue('golpe', b.ini, 0.45);else if (b.tipo === 'tarjeta' || b.tipo === 'imagen' || b.tipo === 'paper') cue('whoosh', b.ini - 0.05, 0.4);else if (b.tipo === 'dato') {
        cue('whoosh', b.ini - 0.05, 0.35);
        cue('subida', b.ini + 0.15, 0.35);
      } else if (b.tipo === 'pantalla') {
        if (b.camara) {
          cue('whoosh', b.ini - T_TARJETA, 0.5);
          cue('whoosh', b.fin - 0.1, 0.35);
          return;
        }
        var en = b.entra || 'latigo',
          sa = b.sale || 'latigo';
        if (en === 'barrido') cue('whoosh', b.ini - VENTANA.barrido, 0.8);else if (en === 'latigo') cue('whoosh', b.ini - VENTANA.latigo, 0.7);else if (en === 'zoom') cue('whoosh', b.ini - VENTANA.zoom, 0.5);else if (en === 'pop') cue('pop', b.ini, 0.5);
        if (sa === 'barrido') cue('whoosh', b.fin - VENTANA.barrido, 0.6);else if (sa === 'latigo') cue('whoosh', b.fin - VENTANA.latigo, 0.55);else if (sa === 'zoom') cue('whoosh', b.fin - VENTANA.zoom, 0.4);
      } else if (b.tipo === 'camara' && b.mov === 'golpe') cue('golpe', b.ini, 0.5);else if (b.tipo === 'suscribete') {
        cue('whoosh', b.ini, 0.5);
        cue('click', b.ini + (b.fin - b.ini) * 0.42, 1);
        cue('campana', b.ini + (b.fin - b.ini) * 0.46, 0.7);
      } else if (b.tipo === 'meta') cue('subida', b.ini + (b.fin - b.ini) * 0.2, 0.6);else if (b.tipo === 'sonido') cue(b.sfx, b.ini, b.g);else if (b.tipo === 'flash') cue('whoosh', b.ini - 0.1, 0.6);
    });
    return d;
  }
  function registrar(def) {
    REGISTRO.push(def);
  }
  function buscar(id) {
    for (var i = 0; i < REGISTRO.length; i++) if (REGISTRO[i].id === id) return REGISTRO[i];
    return REGISTRO[0];
  }

  // algo se dibuja encima de la camara en T (si no, el cuadro puede pasar directo)
  function ocupado(T, def) {
    var i;
    for (i = 0; i < def.pantallas.length; i++) {
      var b = def.pantallas[i];
      var h = b.camara ? T_TARJETA : Math.max(VENTANA[b.entra || 'latigo'] || 0, VENTANA[b.sale || 'latigo'] || 0);
      if (T >= b.ini - h - 0.04 && T <= b.fin + h + 0.04) return true;
    }
    var lista = def.encima.concat(def.detras);
    for (i = 0; i < lista.length; i++) if (T >= lista[i].ini - 0.06 && T <= lista[i].fin + 0.45) return true;
    for (i = 0; i < def.flashes.length; i++) if (T >= def.flashes[i].t - 0.02 && T <= def.flashes[i].t + 0.27) return true;
    for (i = 0; i < def.capitulos.length; i++) if (T >= def.capitulos[i].fin && T <= def.capitulos[i].fin + 4.9) return true;
    return !camaraLimpia(estadoCamara(T, def), extCamara(T, def));
  }

  /* =========================================================
     LIENZO: todas las capas para un T
     ========================================================= */

  function Lienzo(props) {
    var T = props.T,
      def = props.def;
    var st = estadoCamara(T, def);
    var ext = extCamara(T, def);
    var detras = def.detras.filter(function (b) {
      return T >= b.ini - 0.05 && T <= b.fin + 0.45;
    });
    var encima = def.encima.map(function (b, i) {
      if (b.tipo === 'texto') return /*#__PURE__*/React.createElement(TextoClave, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'tarjeta') return /*#__PURE__*/React.createElement(TarjetaBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'dato') return /*#__PURE__*/React.createElement(DatoBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'paper') return /*#__PURE__*/React.createElement(PaperBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'suscribete') return /*#__PURE__*/React.createElement(Suscribete, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'meta') return /*#__PURE__*/React.createElement(Meta, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'imagen') return /*#__PURE__*/React.createElement(ImagenBeat, {
        key: i,
        T: T,
        b: b
      });
      return null;
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        overflow: 'hidden',
        background: INK
      }
    }, /*#__PURE__*/React.createElement(FondoDivididas, {
      T: T,
      def: def
    }), /*#__PURE__*/React.createElement(Camara, {
      T: T,
      def: def,
      st: st,
      ext: ext,
      render: props.render,
      medioRef: props.medioRef
    }), detras.length ? /*#__PURE__*/React.createElement(React.Fragment, null, detras.map(function (b, i) {
      return /*#__PURE__*/React.createElement(DetrasBeat, {
        key: i,
        T: T,
        b: b
      });
    }), /*#__PURE__*/React.createElement(Frente, {
      T: T,
      def: def,
      st: st,
      ext: ext,
      medioRef: props.medioRef
    })) : null, /*#__PURE__*/React.createElement(CapaEscenas, {
      T: T,
      def: def,
      divididas: true
    }), /*#__PURE__*/React.createElement(CapaEscenas, {
      T: T,
      def: def,
      divididas: false
    }), encima, /*#__PURE__*/React.createElement(RotuloCapitulo, {
      T: T,
      def: def
    }), /*#__PURE__*/React.createElement(Flashes, {
      T: T,
      def: def
    }));
  }

  /* =========================================================
     PAGINA: vista previa con el video como reloj, o modo render
     ========================================================= */

  function fmt(s) {
    var m = Math.floor(s / 60),
      r = s - 60 * m;
    return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1);
  }
  function useEscala(ref) {
    var _e = useState(0.5);
    var esc = _e[0],
      setEsc = _e[1];
    useEffect(function () {
      var el = ref.current;
      if (!el) return;
      var medir = function () {
        if (el.clientWidth > 0) setEsc(el.clientWidth / ANCHO);
      };
      medir();
      var ro = new ResizeObserver(medir);
      ro.observe(el);
      return function () {
        ro.disconnect();
      };
    }, []);
    return esc;
  }
  function cuadroListo() {
    return new Promise(function (r) {
      requestAnimationFrame(function () {
        r();
      });
    });
  }
  function Vista(props) {
    var def = props.def,
      render = props.render;
    var _t = useState(0);
    var T = _t[0],
      setT = _t[1];
    var _p = useState(false);
    var playing = _p[0],
      setPlaying = _p[1];
    var medioRef = useRef(null);
    var marcoRef = useRef(null);
    var escala = useEscala(marcoRef);

    // modo render: el grabador manda el segundo y el cuadro de camara
    useEffect(function () {
      if (!render) return;
      global.LARGO = {
        total: def.dur,
        video: def.video,
        // mueve T y espera a que todo este dibujado (imagenes, mascaras)
        seek: function (t) {
          PENDIENTES.length = 0;
          setT(t);
          return cuadroListo().then(function () {
            var imgs = Array.prototype.slice.call(document.images).filter(function (im) {
              return im.src && !im.complete;
            });
            return Promise.all(imgs.map(function (im) {
              return im.decode ? im.decode().catch(function () {}) : null;
            }));
          }).then(function () {
            return Promise.all(PENDIENTES.slice());
          }).then(cuadroListo).then(cuadroListo);
        },
        cuadro: function (url) {
          var img = medioRef.current;
          if (!img) return Promise.resolve();
          img.src = url;
          return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
        },
        // precarga las imagenes propias y la foto de perfil
        precargar: function () {
          var srcs = [PERFIL];
          def.encima.forEach(function (b) {
            if (b.src) srcs.push(b.src);
            if (b.foto) srcs.push(b.foto);
          });
          def.pantallas.forEach(function (b) {
            if (b.props && b.props.src) srcs.push(b.props.src);
          });
          return Promise.all(srcs.map(function (s) {
            var im = new Image();
            im.src = s;
            return im.decode ? im.decode().catch(function () {
              console.warn('no carga la imagen', s);
            }) : Promise.resolve();
          }));
        },
        // dibuja cada pantalla una vez para que marquen sus efectos
        recolectar: function () {
          var ts = [];
          def.pantallas.forEach(function (b) {
            for (var k = 0; k <= 4; k++) ts.push(b.ini + (b.fin - b.ini) * k / 4);
          });
          var i = 0;
          return new Promise(function (res) {
            var paso = function () {
              if (i >= ts.length) {
                setT(0);
                res(true);
                return;
              }
              setT(ts[i++]);
              requestAnimationFrame(function () {
                requestAnimationFrame(paso);
              });
            };
            paso();
          });
        },
        cues: function () {
          return def.cuesFijos.concat(listaCues()).sort(function (a, b) {
            return a.t - b.t;
          });
        },
        // '1' si el cuadro i (desde a, a fps) lleva algo encima de la camara
        ocupados: function (a, n, fps) {
          var s = '';
          for (var i = 0; i < n; i++) s += ocupado(a + i / fps, def) ? '1' : '0';
          return s;
        },
        tramos: function () {
          return {
            pantallas: def.pantallas.map(function (b) {
              return [b.ini, b.fin, b.entra || 'latigo', b.sale || 'latigo', b.camara ? 'dividida' : ''];
            }),
            mantener: def.mantener.map(function (b) {
              return [b.ini, b.fin];
            }),
            camaras: def.camaras.map(function (b) {
              return [b.ini, b.fin, b.zoom || 1];
            }),
            recorte: def.detras.map(function (b) {
              return [Math.max(0, b.ini - 0.1), b.fin + 0.5];
            })
          };
        }
      };
    }, [render, def]);

    // vista previa: el video es el reloj
    useEffect(function () {
      if (render) return;
      var raf = 0;
      var paso = function () {
        var v = medioRef.current;
        if (v && !isNaN(v.currentTime)) setT(v.currentTime);
        raf = requestAnimationFrame(paso);
      };
      raf = requestAnimationFrame(paso);
      return function () {
        cancelAnimationFrame(raf);
      };
    }, [render]);
    var lienzo = /*#__PURE__*/React.createElement(Lienzo, {
      T: T,
      def: def,
      render: render,
      medioRef: medioRef
    });
    if (render) return /*#__PURE__*/React.createElement("div", {
      style: {
        width: ANCHO,
        height: ALTO,
        position: 'relative',
        overflow: 'hidden'
      }
    }, lienzo);
    var tr = transcripcion(def.id);
    var frase = null;
    tr.frases.forEach(function (fr) {
      if (T >= fr.ini - 0.05 && T <= fr.fin + 0.3) frase = fr;
    });
    var alternar = function () {
      var v = medioRef.current;
      if (!v) return;
      if (v.paused) {
        v.play();
        setPlaying(true);
      } else {
        v.pause();
        setPlaying(false);
      }
    };
    var ir = function (t) {
      var v = medioRef.current;
      if (v) v.currentTime = clamp(t, 0, def.dur);
      setT(t);
    };
    var marcas = def.pantallas.map(function (b, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        title: b.capitulo ? 'capítulo' : 'escena',
        className: 'marca' + (b.capitulo ? ' cap' : ''),
        style: {
          left: 100 * b.ini / def.dur + '%',
          width: Math.max(0.15, 100 * (b.fin - b.ini) / def.dur) + '%'
        }
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "largo-mesa"
    }, /*#__PURE__*/React.createElement("div", {
      ref: marcoRef,
      className: "largo-marco",
      style: {
        position: 'relative',
        aspectRatio: '16 / 9',
        width: '100%',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        transformOrigin: '0 0',
        transform: 'scale(' + escala + ')'
      }
    }, lienzo)), /*#__PURE__*/React.createElement("div", {
      className: "largo-controles"
    }, /*#__PURE__*/React.createElement("button", {
      className: "largo-play",
      onClick: alternar
    }, playing ? '❚❚' : '▶'), /*#__PURE__*/React.createElement("div", {
      className: "largo-linea",
      onClick: function (ev) {
        var r = ev.currentTarget.getBoundingClientRect();
        ir(def.dur * (ev.clientX - r.left) / r.width);
      }
    }, marcas, /*#__PURE__*/React.createElement("div", {
      className: "cursor",
      style: {
        left: 100 * T / def.dur + '%'
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "largo-tiempo"
    }, fmt(T), " / ", fmt(def.dur))), /*#__PURE__*/React.createElement("div", {
      className: "largo-dice"
    }, frase ? frase.texto : '—'));
  }
  function leerHash() {
    var h = String(global.location.hash || '').replace(/^#/, '');
    var partes = h.split('/');
    return {
      id: partes[0] || REGISTRO[0] && REGISTRO[0].id,
      render: partes[1] === 'render'
    };
  }
  var preparados = {};
  function App() {
    var _h = useState(leerHash);
    var ruta = _h[0],
      setRuta = _h[1];
    useEffect(function () {
      var cambio = function () {
        setRuta(leerHash());
      };
      global.addEventListener('hashchange', cambio);
      return function () {
        global.removeEventListener('hashchange', cambio);
      };
    }, []);
    var crudo = buscar(ruta.id);
    if (!crudo) return /*#__PURE__*/React.createElement("p", {
      style: {
        padding: 24
      }
    }, "No hay videos largos registrados.");
    var def = preparados[crudo.id] || (preparados[crudo.id] = preparar(crudo));
    if (ruta.render) return /*#__PURE__*/React.createElement(Vista, {
      key: def.id + ':r',
      def: def,
      render: true
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "largo"
    }, /*#__PURE__*/React.createElement("header", {
      className: "largo-cabecera"
    }, /*#__PURE__*/React.createElement("div", {
      className: "marca"
    }, def.titulo), /*#__PURE__*/React.createElement("nav", {
      className: "videos"
    }, REGISTRO.map(function (d) {
      return /*#__PURE__*/React.createElement("a", {
        key: d.id,
        href: '#' + d.id,
        className: d.id === def.id ? 'actual' : ''
      }, d.titulo);
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, "video largo 1920\xD71080 (exporta en 4K) \xB7 el video manda el tiempo \xB7 amarillo = escenas")), /*#__PURE__*/React.createElement(Vista, {
      key: def.id,
      def: def
    }));
  }
  function montar() {
    ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
  }
  var PERFIL = 'largos/perfil.jpg';
  global.LARGOS = Object.assign(global.LARGOS || {}, {
    ANCHO: ANCHO,
    ALTO: ALTO,
    COLOR: COLOR,
    F: F,
    F_MONO: F_MONO,
    SOMBRA: SOMBRA,
    SOMBRA_CHICA: SOMBRA_CHICA,
    TENUE: TENUE,
    registrar: registrar,
    buscar: buscar,
    montar: montar,
    lista: function () {
      return REGISTRO.slice();
    },
    plan: plan,
    buscador: buscador,
    sonido: sonido,
    POSES: POSES,
    mov: {
      prog: prog,
      entra: entra,
      sale: sale,
      junta: junta,
      deriva: deriva,
      hash: hash,
      norm: norm,
      formato: formato,
      suave: suave
    },
    E: {
      Escena: Escena,
      Fondo: Fondo,
      Pos: Pos,
      Palabras: Palabras,
      Titulo: Titulo,
      Texto: Texto,
      Rot: Rot,
      Etiqueta: Etiqueta,
      Ico: Ico,
      Icono: Icono,
      Trazos: Trazos,
      Monigote: Monigote,
      Figura: Figura,
      Flecha: Flecha,
      Linea: Linea,
      Check: Check,
      Tacha: Tacha,
      Tachon: Tachon,
      Barra: Barra,
      Num: Num,
      Tarjeta: Tarjeta,
      Barras: Barras,
      Grafico: Grafico,
      Puntos: Puntos,
      Burbuja: Burbuja,
      Opciones: Opciones
    }
  });
})(window);
