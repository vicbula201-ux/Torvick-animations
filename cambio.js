/* GENERADO por compilar.js desde cambio.jsx — no editar a mano. */
/* ============================================================
   CAMBIO — window.CAMBIOS: videos verticales con la persona a camara
   (P4 · serie "Cambio Fisico"; sirve para cualquier video 9:16 hablado)

   El autor manda su video ya cortado (9:16) y encima se apilan capas que se
   calculan desde un unico T = segundo del video (la voz manda el tiempo):

     subtitulos   siempre: 1 a 3 palabras, la que suena en caja amarilla
     camara       el video con golpes de zoom, empuje, blanco y negro, y
                  metido en un marco sobre amarillo (capitulos)
     detras       palabras y numeros gigantes DETRAS de la persona
                  (mascara de herramientas/recortar.py), el "DIA 12" de la serie
     encima       titulos, numeros que cuentan, tarjetas, listas que se
                  arman mientras habla, emojis 3D, fotos, etiquetas, CTA
     firma        al final: YouTube · Instagram · TikTok · @eltorvick

   El estilo sale de los 5 reels de referencia (CAMBIO.md): blanco, amarillo y
   negro; Archivo Black para lo gigante, Inter Tight para subtitulos y
   tarjetas, Permanent Marker para las notas a mano. Las entradas son rapidas
   (0,1-0,3 s, con desenfoque o con rebote corto) y todo lo que queda en
   pantalla deriva.

   Un video = una carpeta cambios/<id>/ con plan.jsx (beats con CAMBIOS.plan)
   y transcripcion.* (herramientas/transcribir.py).
   Pagina: cambio.html#<id> (vista previa) · #<id>/render (grabar).
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
  var ANCHO = 1080,
    ALTO = 1920,
    FPS = 30;
  var NEGRO = '#14110F',
    AMARILLO = '#FFD400',
    BLANCO = '#FFFFFF';
  var ROJO = '#E03A2F',
    VERDE = '#16A06A',
    GRIS = '#C9C3B8';
  var COLOR = {
    amarillo: AMARILLO,
    blanco: BLANCO,
    negro: NEGRO,
    rojo: ROJO,
    verde: VERDE,
    gris: GRIS
  };
  var F = "'Inter Tight', 'Inter', 'Helvetica Neue', Arial, sans-serif";
  var F_IMPACTO = "'Archivo Black', 'Inter Tight', Arial, sans-serif";
  var F_MANO = "'Permanent Marker', 'Inter Tight', cursive";
  var F_MONO = "'IBM Plex Mono', 'Courier Prime', monospace";
  // texto blanco sobre la camara: sombra dura corta (pegatina) + una blanda
  var SOMBRA_TX = '0 3px 0 rgba(20,17,15,0.88), 0 6px 22px rgba(0,0,0,0.42)';
  var SOMBRA_GIGANTE = '0 8px 0 rgba(20,17,15,0.30), 0 18px 60px rgba(0,0,0,0.35)';
  var SOMBRA_TARJETA = '0 2px 4px rgba(20,17,15,0.16), 0 18px 48px rgba(20,17,15,0.34)';
  function col(c, def) {
    return COLOR[c] || c || def;
  }
  function lerp(a, b, k) {
    return a + (b - a) * k;
  }
  function k01(T, a, d) {
    return clamp((T - a) / (d || 0.0001), 0, 1);
  }
  // easeOutBack con sobreimpulso regulable (s = 1.7 es el clasico)
  function back(p, s) {
    s = s == null ? 1.5 : s;
    var u = p - 1;
    return u * u * ((s + 1) * u + s) + 1;
  }
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

  // ancho de un texto (las fuentes ya cargadas: si no, no se guarda en cache)
  var lienzoMedir = null,
    cacheMedir = {};
  function medir(texto, fuente, espaciado) {
    var listo = global.document && document.fonts && document.fonts.status === 'loaded';
    var clave = fuente + '|' + texto;
    if (listo && cacheMedir[clave] != null) return cacheMedir[clave];
    if (!lienzoMedir) lienzoMedir = document.createElement('canvas').getContext('2d');
    lienzoMedir.font = fuente;
    var w = lienzoMedir.measureText(texto).width + (espaciado || 0) * Math.max(0, String(texto).length - 1);
    if (listo) cacheMedir[clave] = w;
    return w;
  }
  // tamano de letra para que un texto entre en un ancho (con tope)
  function ajustar(texto, familia, peso, ancho, tope, esp) {
    var w100 = medir(texto, peso + ' 100px ' + familia, (esp || 0) * 100);
    return Math.min(tope, Math.floor(100 * ancho / Math.max(1, w100)));
  }

  /* =========================================================
     MOVIMIENTO: entradas cortas (como en las referencias: 0,1-0,3 s)
       pop      crece desde chico con un rebote corto (tarjetas, emojis)
       enfoque  llega desenfocado y un poco grande (palabras gigantes)
       sube     sube unos px y aparece (textos chicos)
     Salidas de 0,2 s. Lo que queda en pantalla deriva (M.life).
     ========================================================= */

  function entra(T, c, tipo, dur) {
    tipo = tipo || 'pop';
    if (tipo === 'pop') {
      dur = dur || 0.3;
      var p = k01(T, c, dur);
      return {
        p: p,
        op: clamp(p * 3.2, 0, 1),
        esc: p <= 0 ? 0.3 : 0.3 + 0.7 * back(p, 1.6),
        blur: 0,
        dy: 0
      };
    }
    if (tipo === 'enfoque') {
      dur = dur || 0.28;
      var q = Easing.easeOutExpo(k01(T, c, dur));
      return {
        p: q,
        op: clamp((T - c) / (dur * 0.45), 0, 1),
        esc: 1 + 0.16 * (1 - q),
        blur: 26 * (1 - q),
        dy: 0
      };
    }
    dur = dur || 0.24;
    var r = Easing.easeOutExpo(k01(T, c, dur));
    return {
      p: r,
      op: clamp((T - c) / (dur * 0.5), 0, 1),
      esc: 1,
      blur: 8 * (1 - r),
      dy: 26 * (1 - r)
    };
  }
  function sale(T, s, dur) {
    if (s == null) return {
      p: 0,
      op: 1,
      esc: 1,
      blur: 0,
      dy: 0
    };
    var p = Easing.easeInCubic(k01(T, s, dur || 0.2));
    return {
      p: p,
      op: 1 - p,
      esc: 1 - 0.07 * p,
      blur: 10 * p,
      dy: -10 * p
    };
  }
  function junta(a, b) {
    return {
      p: a.p,
      op: a.op * b.op,
      esc: a.esc * b.esc,
      blur: a.blur + b.blur,
      dy: a.dy + b.dy
    };
  }
  function deriva(T, fase, amp) {
    return M.life(T, 4.6, amp == null ? 4 : amp, fase || 0);
  }

  /* =========================================================
     POSICIONES (lienzo 1080x1920)
     Zonas que tapan las apps: arriba hasta y 230 (pestanas), abajo desde
     y 1560 (texto y musica), y a la derecha de x 900 entre y 1000 y 1700
     (botones). Los subtitulos van en y 1230 (el pecho): lo de "abajo" queda
     entre ellos y la zona tapada.
     ========================================================= */

  var POS = {
    'arriba': [540, 470, 'c'],
    'arriba-izq': [60, 470, 'i'],
    'arriba-der': [1020, 470, 'd'],
    'izq': [60, 820, 'i'],
    'der': [1020, 820, 'd'],
    'centro': [540, 860, 'c'],
    'abajo': [540, 1420, 'c'],
    'abajo-izq': [60, 1420, 'i']
  };
  // [x, y, ancla horizontal c|i|d, ancla vertical m (medio) | s (arriba: crece hacia abajo)]
  function posicion(pos, def) {
    if (Array.isArray(pos)) return [pos[0], pos[1], pos[2] || 'c', pos[3] || 'm'];
    if (pos && typeof pos === 'object') return [pos.x == null ? 540 : pos.x, pos.y == null ? 860 : pos.y, pos.ancla || 'c', pos.vertical || 'm'];
    return (POS[pos] || POS[def || 'abajo']).concat(['m']);
  }

  // caja absoluta anclada por un punto (centro | izq | der) con su entrada/salida
  function Caja(props) {
    var e = props.e || {
      op: 1,
      esc: 1,
      blur: 0,
      dy: 0
    };
    if (e.op <= 0.003) return null;
    var p = props.p;
    var vy = p[3] === 's' ? '0' : '-50%';
    var ancla = p[2] === 'i' ? 'translate(0,' + vy + ')' : p[2] === 'd' ? 'translate(-100%,' + vy + ')' : 'translate(-50%,' + vy + ')';
    var oy = p[3] === 's' ? '0%' : '50%';
    var origen = (p[2] === 'i' ? '0% ' : p[2] === 'd' ? '100% ' : '50% ') + oy;
    var dy = (e.dy || 0) + (props.dy || 0),
      dx = props.dx || 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: p[0],
        top: p[1],
        zIndex: props.z || 'auto',
        opacity: e.op,
        pointerEvents: 'none',
        transform: ancla + ' translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px) rotate(' + (props.rot || 0).toFixed(2) + 'deg) scale(' + (e.esc * (props.esc || 1)).toFixed(4) + ')',
        transformOrigin: origen,
        filter: e.blur > 0.2 ? 'blur(' + e.blur.toFixed(2) + 'px)' : undefined,
        width: props.w
      }
    }, props.children);
  }

  /* =========================================================
     SONIDOS: cada beat marca sus efectos (los mezcla herramientas/audio.py
     debajo de la voz). Tipos: pop, whoosh, click, ding, error, golpe,
     subida, campana, siu, publico.
     ========================================================= */

  /* =========================================================
     EMOJIS 3D (Fluent Emoji de Microsoft, licencia MIT: cambio/emoji/LICENSE).
     Por nombre en espanol ('pollo') o pegando el emoji ('🍗').
     ========================================================= */

  var EMOJI_LISTA = 'aceituna:🫒|adn:🧬|agenda:🗓️|agotado:😩|agua:💧|aguacate:🥑|aguanta:🥹|aliviado:😌|angel:😇|antojo:🤤|aplauso:👏|arepa:🫓|arroz:🍚|asombro:😲|audifonos:🎧|avena:🥣|baja:📉|balanza:⚖️|banano:🍌|barras:📊|batata:🍠|bateria:🔋|bateria-baja:🪫|biceps:💪|bici:🚴|bien:👍|billete:💵|bolsas:🛍️|bomba:💣|bombillo:💡|bostezo:🥱|brillo:✨|brocoli:🥦|brote:🌱|burrito:🌯|cafe:☕|calavera:💀|calendario:📅|calor:🥵|cama:🛏️|camara:📸|camaron:🍤|caminar:🚶|campana:🔔|candado:🔒|cansado:😫|carcajada:🤣|carne:🥩|carrito:🛒|carro:🚗|casa:🏠|celebra:🥳|celular:📱|cerebro:🧠|cerveza:🍺|check:✅|chocolate:🍫|choque:💥|cien:💯|coco:🥥|coctel:🍹|cohete:🚀|compu:💻|confeti:🎊|corazon:❤️|corazon-real:🫀|corazon-roto:💔|correr:🏃|cronometro:⏱️|cubiertos:🍴|cuidado:⚠️|curita:🩹|derretido:🫠|despertador:⏰|diablito:😈|diana:🎯|dinamita:🧨|dona:🍩|dormido:😴|dulce:🍬|enamorado:😍|enfermo:🤒|enojado:😠|ensalada:🥗|equis:❌|espejo:🪞|estetoscopio:🩺|estrella:⭐|exclamacion:❗|explota:🤯|facepalm:🤦|factura:🧾|feliz:😀|fiesta:🎉|fresa:🍓|frijoles:🫘|frio:🥶|fuego:🔥|furioso:😡|galleta:🍪|gaseosa:🥤|gracias:🙏|grito:😱|guino:😉|hamburguesa:🍔|helado:🍦|hola:👋|hueso:🦴|huevo:🥚|huevo-frito:🍳|jeringa:💉|leche:🥛|lechuga:🥬|lentes:😎|libreta:📝|limon:🍋|lista:📋|llave:🔑|llorando:😭|lluvia:🌧️|luna:🌙|lupa:🔍|maiz:🌽|mal:👎|mani:🥜|mantequilla:🧈|manzana:🍎|mareado:😵‍💫|medalla:🥇|megafono:📣|meta:🏁|microscopio:🔬|miedo:😨|miel:🍯|mono:🙈|montana:⛰️|mueca:😬|muleta:🩼|nadar:🏊|naranja:🍊|nauseas:🤢|nerd:🤓|neutral:😐|no-se:🤷|ojos:👀|ojos-arriba:🙄|ok:👌|pan:🍞|papa:🥔|papas-fritas:🍟|pasta:🍝|pastel:🍰|pastilla:💊|payaso:🤡|pensando:🤔|pepino:🥒|perro-caliente:🌭|pesas:🏋️|pescado:🐟|pie:🦶|pierna:🦵|pina:🍍|pizza:🍕|plata:💰|plato:🍽️|pollo:🍗|pregunta:❓|prohibido:🚫|pulmones:🫁|puno:👊|queso:🧀|rayo:⚡|regalo:🎁|regla:📏|reloj-arena:⏳|resoplido:😤|risa:😂|sal:🧂|saludo-militar:🫡|sandia:🍉|sandwich:🥪|sangre:🩸|semaforo:🚦|senala:👉|silencio:🤫|silla:🪑|sol:☀️|sonrisa:😊|sonrisa-lagrima:🥲|sonrojado:😳|sorpresa:😮|sube:📈|sudando:😅|sudor:💦|suplica:🥺|taco:🌮|te:🍵|termometro:🌡️|tocino:🥓|tomate:🍅|torta:🎂|triste:😢|trofeo:🏆|tubo:🧪|uvas:🍇|vino:🍷|vomito:🤮|wow-estrellas:🤩|zanahoria:🥕|zapatilla:👟|zzz:💤';
  var EMOJI = {},
    EMOJI_POR_CARACTER = {};
  EMOJI_LISTA.split('|').forEach(function (par) {
    var i = par.indexOf(':');
    var nom = par.slice(0, i),
      ch = par.slice(i + 1);
    EMOJI[nom] = ch;
    EMOJI_POR_CARACTER[ch.replace(/️/g, '')] = nom;
  });
  function rutaEmoji(n) {
    var nom = EMOJI[n] ? n : EMOJI_POR_CARACTER[String(n).replace(/️/g, '')];
    if (!nom) {
      if (global.console) console.warn('no tengo ese emoji:', n, '(lista: CAMBIOS.EMOJI)');
      return null;
    }
    return 'cambio/emoji/' + nom + '.webp';
  }
  function Emoji(props) {
    var src = rutaEmoji(props.n);
    var t = props.tam || 120;
    if (!src) return /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: t * 0.8,
        lineHeight: 1
      }
    }, props.n);
    return /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: "",
      width: t,
      height: t,
      draggable: false,
      style: Object.assign({
        display: 'block',
        width: t,
        height: t,
        objectFit: 'contain'
      }, props.estilo || {})
    });
  }

  /* =========================================================
     TRANSCRIPCION: el segundo en que se dice cada cosa
     ========================================================= */

  function transcripcion(id) {
    return (global.TRANSCRIPCIONES || {})[id] || {
      dur: 0,
      palabras: [],
      frases: []
    };
  }

  // t(frase, desde) -> segundo en que empieza la frase; t.fin(frase, desde) -> en que termina
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
    t.dur = tr.dur;
    return t;
  }

  // segundo en que se dice cada texto de una lista (en orden, entre ini y fin);
  // lo que no se encuentra se reparte entre los vecinos
  function tiemposDe(id, textos, ini, fin) {
    var tr = transcripcion(id);
    var cand = tr.palabras.filter(function (w) {
      return w.ini >= ini - 0.3 && w.ini <= fin;
    });
    var out = [],
      j = 0;
    textos.forEach(function (txt) {
      var q = String(txt).split(/\s+/).map(norm).filter(Boolean);
      var hall = null;
      for (var k = j; k < cand.length && q.length; k++) {
        // vale la primera palabra con contenido del texto (o su plural/singular)
        var a = norm(cand[k].p),
          b = q[0];
        if (a === b || a === b + 's' || a + 's' === b || a === b + 'es' || a + 'es' === b) {
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
      if (b == null) b = Math.min(fin - 0.3, a + 0.6 * (out.length - i));
      out[i] = i === 0 && a === ini ? ini : a + (b - a) / 2;
    }
    return out;
  }

  /* =========================================================
     SUBTITULOS: de 1 a 3 palabras, una sola linea, a la altura del pecho.
     El bloque entra entero; la palabra que suena va en caja amarilla con
     letra negra; los numeros y las marcadas quedan en amarillo.
     ========================================================= */

  var DEBILES = {};
  'de del la el los las lo un una unos unas y e o u a al en con por para que se me te mi tu su mis tus sus le les nos ni pero si sin'.split(' ').forEach(function (w) {
    DEBILES[w] = true;
  });
  function limpiar(p) {
    return String(p).replace(/[.,;:…"“”«»()]/g, '').trim();
  }
  function largoBloque(ws) {
    return ws.reduce(function (s, x) {
      return s + x.txt.length;
    }, 0) + Math.max(0, ws.length - 1);
  }
  function armarBloques(palabras, o) {
    var max = o.palabras || 3,
      maxCar = o.caracteres || 18;
    var bloques = [],
      act = [];
    var cerrar = function () {
      if (act.length) bloques.push(act);
      act = [];
    };
    var corregir = {};
    Object.keys(o.corregir || {}).forEach(function (k) {
      corregir[norm(k)] = o.corregir[k];
    });
    palabras.forEach(function (w) {
      var txt = limpiar(w.p);
      if (!txt) return;
      // palabras que la transcripcion escribe mal ('cloud' -> 'Claude'), conservando los signos
      var c = corregir[norm(txt)];
      if (c != null) txt = txt.replace(/[^¿¡?!]+/, c);
      var prev = act[act.length - 1];
      var largo = largoBloque(act) + txt.length + 1;
      if (act.length && (act.length >= max || largo > maxCar || prev && w.ini - prev.fin > 0.32)) cerrar();
      act.push({
        txt: txt,
        ini: w.ini,
        fin: w.fin,
        crudo: w.p
      });
      if (/[.;:?!…]$/.test(w.p) || /,$/.test(w.p) && act.length > 1) cerrar();
    });
    cerrar();
    // una palabra debil al final de un bloque pasa al siguiente si cabe ("pasarme | 5 horas")
    for (var b = 0; b < bloques.length - 1; b++) {
      var bl = bloques[b],
        sig = bloques[b + 1];
      var ult = bl[bl.length - 1];
      if (bl.length >= 2 && DEBILES[norm(ult.txt)] && !/[.,;:?!]$/.test(ult.crudo) && sig[0].ini - ult.fin < 0.3 && sig.length < max && largoBloque(sig) + ult.txt.length + 1 <= maxCar) {
        sig.unshift(bl.pop());
      }
    }
    // un bloque que quedo con una sola palabra debil se une al siguiente
    var out = [];
    for (var i = 0; i < bloques.length; i++) {
      var x = bloques[i];
      if (!x.length) continue;
      var y = bloques[i + 1];
      if (x.length === 1 && DEBILES[norm(x[0].txt)] && y && y[0].ini - x[0].fin < 0.3 && largoBloque(y) + x[0].txt.length + 1 <= maxCar + 4) {
        y.unshift(x[0]);
        continue;
      }
      out.push(x);
    }
    return out.map(function (ws, i) {
      var sig = out[i + 1];
      var fin = ws[ws.length - 1].fin;
      return {
        ws: ws,
        ini: ws[0].ini,
        fin: fin,
        hasta: sig ? Math.min(sig[0].ini, fin + 0.7) : fin + 0.7
      };
    });
  }

  // indice del bloque que se ve en T (-1: ninguno)
  function bloqueEn(bloques, T) {
    var lo = 0,
      hi = bloques.length - 1,
      r = -1;
    while (lo <= hi) {
      var mid = lo + hi >> 1;
      if (bloques[mid].ini - 0.05 <= T) {
        r = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    if (r < 0) return -1;
    return T < bloques[r].hasta ? r : -1;
  }
  function esMarcada(txt, def) {
    if (/\d/.test(txt)) return def.subs.numeros !== false;
    return !!def.marcadas[norm(txt)];
  }
  function Subtitulos(props) {
    var T = props.T,
      def = props.def,
      o = def.subs;
    if (o.ocultar && o.ocultar.some(function (r) {
      return T >= r[0] && T < r[1];
    })) return null;
    var ib = bloqueEn(def.bloques, T);
    if (ib < 0) return null;
    var bl = def.bloques[ib],
      prev = def.bloques[ib - 1];
    var e = Easing.easeOutCubic(k01(T, bl.ini - 0.05, 0.1));
    // pegado al bloque anterior: cambia en seco (como en las referencias), sin un cuadro vacio en el medio
    var seguido = !!prev && prev.hasta >= bl.ini - 0.08;
    var op = seguido ? 0.85 + 0.15 * e : e;
    var activo = -1;
    bl.ws.forEach(function (w, i) {
      if (T >= w.ini - 0.03) activo = i;
    });
    var fs = o.tam;
    var ancho = medir(bl.ws.map(function (w) {
      return w.txt;
    }).join(''), '800 ' + fs + 'px ' + F) + bl.ws.length * fs * 0.42;
    if (ancho > o.ancho) fs = Math.floor(fs * o.ancho / ancho);
    var y = typeof o.y === 'function' ? o.y(T) : o.y;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: y,
        width: ANCHO,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: 'translateY(-50%) translateY(' + ((1 - e) * (seguido ? 6 : 12)).toFixed(1) + 'px)',
        opacity: op,
        zIndex: 40,
        filter: e < 0.98 && !seguido ? 'blur(' + ((1 - e) * 5).toFixed(1) + 'px)' : undefined
      }
    }, bl.ws.map(function (w, i) {
      var act = i === activo;
      var pp = act ? k01(T, w.ini - 0.03, 0.11) : 0;
      return /*#__PURE__*/React.createElement("span", {
        key: i,
        style: {
          position: 'relative',
          display: 'inline-block',
          padding: '0.02em 0.14em 0.08em',
          margin: '0 0.06em',
          fontFamily: F,
          fontWeight: 800,
          fontSize: fs,
          lineHeight: 1.12
        }
      }, act ? /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: '0.06em',
          bottom: '0.02em',
          background: AMARILLO,
          borderRadius: '0.2em',
          boxShadow: '0 0.05em 0 rgba(20,17,15,0.9)',
          transform: 'scale(' + (0.8 + 0.2 * back(pp, 2)).toFixed(3) + ') rotate(' + (-1.2 + 2.4 * hash(w.txt + w.ini)).toFixed(2) + 'deg)',
          opacity: clamp(pp * 3, 0, 1)
        }
      }) : null, /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'relative',
          letterSpacing: '-0.025em',
          color: act ? NEGRO : esMarcada(w.txt, def) ? AMARILLO : BLANCO,
          textShadow: act ? 'none' : SOMBRA_TX,
          whiteSpace: 'pre'
        }
      }, w.txt));
    }));
  }

  /* =========================================================
     CAMARA: el video con encuadres, filtros y el marco de los capitulos
     ========================================================= */

  // encuadre en T: zoom y foco (0..1 del cuadro) + blanco y negro, oscuro, desenfoque
  function estadoCamara(T, def) {
    var en = def.encuadre;
    var z = en.zoom || 1,
      fx = en.foco[0],
      fy = en.foco[1];
    var bn = 0,
      oscuro = 0,
      desenf = 0;
    def.camaras.forEach(function (b) {
      if (T < b.ini - 0.001) return;
      var mov = b.mov || 'golpe';
      var pin;
      if (mov === 'corte') pin = 1;else if (mov === 'golpe') pin = back(k01(T, b.ini, 0.16), 1.2);else if (mov === 'empuje') pin = Easing.easeInOutSine(k01(T, b.ini, Math.max(0.6, b.fin - b.ini)));else pin = Easing.easeInOutCubic(k01(T, b.ini, 0.45));
      var salida = b.sale || (mov === 'golpe' || mov === 'corte' ? 'corte' : 'suave');
      var pout = salida === 'corte' ? T >= b.fin ? 1 : 0 : Easing.easeInOutCubic(k01(T, b.fin, 0.4));
      var k = pin * (1 - pout);
      if (k <= 0) return;
      var bz = b.zoom || (mov === 'empuje' ? 1.12 : 1.22),
        bf = b.foco || [fx, fy];
      z = lerp(z, bz, k);
      fx = lerp(fx, bf[0], k);
      fy = lerp(fy, bf[1], k);
      if (b.bn) bn = Math.max(bn, clamp(k, 0, 1));
      if (b.oscuro) oscuro = Math.max(oscuro, b.oscuro * clamp(k, 0, 1));
      if (b.desenfoque) desenf = Math.max(desenf, b.desenfoque * clamp(k, 0, 1));
    });
    return {
      z: Math.max(1, z),
      fx: fx,
      fy: fy,
      bn: bn,
      oscuro: oscuro,
      desenf: desenf
    };
  }

  // sacudidas y flashes
  function extras(T, def) {
    var dx = 0,
      dy = 0,
      flash = 0;
    def.sacudidas.forEach(function (s) {
      var u = (T - s.t) / 0.42;
      if (u < 0 || u > 1) return;
      var a = (s.fuerza || 14) * (1 - u) * (1 - u);
      dx += a * Math.sin(T * 91 + s.t * 7);
      dy += a * Math.cos(T * 73 + s.t * 3);
    });
    def.flashes.forEach(function (f) {
      var u = (T - f.t) / 0.28;
      if (u >= 0 && u <= 1) flash = Math.max(flash, 1 - u);
    });
    return {
      dx: dx,
      dy: dy,
      flash: flash
    };
  }

  // el marco de los capitulos: la camara se achica a una tarjeta sobre amarillo
  var MARCO = {
    w: 660,
    h: 1173,
    x: 210,
    y: 600,
    r: 46
  };
  var T_MARCO = 0.42;
  function kMarco(T, def) {
    var k = 0;
    def.capitulos.forEach(function (b) {
      var a = Easing.easeInOutCubic(k01(T, b.ini - T_MARCO * 0.5, T_MARCO));
      var s = Easing.easeInOutCubic(k01(T, b.fin - T_MARCO * 0.5, T_MARCO));
      k = Math.max(k, a * (1 - s));
    });
    return k;
  }
  function rectCamara(k) {
    return {
      x: lerp(0, MARCO.x, k),
      y: lerp(0, MARCO.y, k),
      w: lerp(ANCHO, MARCO.w, k),
      h: lerp(ALTO, MARCO.h, k),
      r: lerp(0, MARCO.r, k),
      k: k
    };
  }

  // recorte "cover": que parte de la fuente (sw x sh) cubre un destino (dw x dh)
  function cubrir(sw, sh, dw, dh) {
    if (!sw || !sh) return [0, 0, sw, sh];
    var rs = sw / sh,
      rd = dw / dh;
    if (rs > rd) {
      var w = sh * rd;
      return [(sw - w) / 2, 0, w, sh];
    }
    var h = sw / rd;
    return [0, (sh - h) / 2, sw, h];
  }
  function filtroCamara(st, atenuar) {
    var f = [];
    if (st.bn > 0.01) f.push('grayscale(' + st.bn.toFixed(3) + ')');
    var luz = (1 - st.oscuro) * (1 - 0.24 * (atenuar || 0));
    if (luz < 0.995) f.push('brightness(' + luz.toFixed(3) + ')');
    if (st.bn > 0.01) f.push('contrast(' + (1 + 0.12 * st.bn).toFixed(3) + ')');
    if (st.desenf > 0.1) f.push('blur(' + st.desenf.toFixed(2) + 'px)');
    return f.length ? f.join(' ') : undefined;
  }

  // caja de la camara (rect del marco) con el zoom y la sacudida adentro
  function MarcoCamara(props) {
    var R = props.R,
      st = props.st,
      ex = props.ex;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: R.x,
        top: R.y,
        width: R.w,
        height: R.h,
        overflow: 'hidden',
        borderRadius: R.r,
        zIndex: props.z || 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: R.w,
        height: R.h,
        transform: 'translate(' + ex.dx.toFixed(2) + 'px,' + ex.dy.toFixed(2) + 'px) scale(' + st.z.toFixed(4) + ')',
        transformOrigin: (st.fx * 100).toFixed(2) + '% ' + (st.fy * 100).toFixed(2) + '%',
        filter: props.filtro
      }
    }, props.children));
  }
  function Camara(props) {
    var def = props.def,
      R = props.R;
    var estilo = {
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    };
    return /*#__PURE__*/React.createElement(MarcoCamara, {
      R: R,
      st: props.st,
      ex: props.ex,
      filtro: filtroCamara(props.st, props.atenuar)
    }, props.render ? /*#__PURE__*/React.createElement("img", {
      ref: props.medioRef,
      alt: "",
      style: estilo
    }) : /*#__PURE__*/React.createElement("video", {
      ref: props.medioRef,
      src: def.video,
      style: estilo,
      playsInline: true,
      preload: "auto"
    }));
  }

  // borde blanco y sombra del marco (encima de todo lo de la camara)
  function BordeMarco(props) {
    var R = props.R;
    if (R.k <= 0.001) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: R.x - 12 * R.k,
        top: R.y - 12 * R.k,
        width: R.w + 24 * R.k,
        height: R.h + 24 * R.k,
        borderRadius: R.r + 12 * R.k,
        border: (12 * R.k).toFixed(1) + 'px solid ' + BLANCO,
        boxSizing: 'border-box',
        boxShadow: '0 30px 80px rgba(20,17,15,' + (0.35 * R.k).toFixed(3) + ')',
        pointerEvents: 'none',
        zIndex: 5
      }
    });
  }

  /* =========================================================
     DETRAS: la persona recortada encima de las palabras gigantes.
     Mascaras (PNG en grises, una por cuadro a 30 fps) de
     herramientas/recortar.py en cambios/<id>/media/recorte/.
     ========================================================= */

  var PENDIENTES = [];
  var cacheMascaras = {},
    ordenCache = [];
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
    if (ordenCache.length > 150) delete cacheMascaras[ordenCache.shift()];
    return prom;
  }
  function FiltroMascara() {
    return /*#__PURE__*/React.createElement("svg", {
      width: "0",
      height: "0",
      style: {
        position: 'absolute'
      }
    }, /*#__PURE__*/React.createElement("filter", {
      id: "cambio-luz-a-alfa",
      colorInterpolationFilters: "sRGB"
    }, /*#__PURE__*/React.createElement("feColorMatrix", {
      type: "luminanceToAlpha"
    })));
  }
  function Frente(props) {
    var ref = useRef(null);
    var T = props.T,
      def = props.def,
      R = props.R;
    var idx = Math.round(T * FPS);
    var url = 'cambios/' + def.id + '/media/recorte/' + String(idx).padStart(6, '0') + '.png';
    var dpr = global.devicePixelRatio || 1;
    var cw = Math.round(R.w * dpr),
      ch = Math.round(R.h * dpr);
    useLayoutEffect(function () {
      var cv = ref.current,
        fuente = props.medioRef.current;
      if (!cv || !fuente) return;
      var hecho = mascara(url).then(function (m) {
        var ctx = cv.getContext('2d');
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'none';
        ctx.clearRect(0, 0, cv.width, cv.height);
        var fw = fuente.videoWidth || fuente.naturalWidth,
          fh = fuente.videoHeight || fuente.naturalHeight;
        if (!m || !fw || !fh) return;
        try {
          var sm = cubrir(m.naturalWidth, m.naturalHeight, cv.width, cv.height);
          ctx.filter = 'url(#cambio-luz-a-alfa)';
          ctx.drawImage(m, sm[0], sm[1], sm[2], sm[3], 0, 0, cv.width, cv.height);
          ctx.filter = 'none';
          ctx.globalCompositeOperation = 'source-in';
          var sf = cubrir(fw, fh, cv.width, cv.height);
          ctx.drawImage(fuente, sf[0], sf[1], sf[2], sf[3], 0, 0, cv.width, cv.height);
        } catch (e) {
          // el cuadro todavia no esta: mejor sin recorte que con la silueta
          ctx.globalCompositeOperation = 'source-over';
          ctx.clearRect(0, 0, cv.width, cv.height);
        }
        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'none';
      });
      PENDIENTES.push(Promise.race([hecho, new Promise(function (r) {
        setTimeout(r, 4000);
      })]));
    });
    return /*#__PURE__*/React.createElement(MarcoCamara, {
      R: R,
      st: props.st,
      ex: props.ex,
      filtro: filtroCamara(props.st, 0),
      z: 12
    }, /*#__PURE__*/React.createElement(FiltroMascara, null), /*#__PURE__*/React.createElement("canvas", {
      ref: ref,
      width: cw,
      height: ch,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
      }
    }));
  }

  // vida de un beat: entrada, salida y si se dibuja
  function vivo(T, b, margen) {
    return T >= b.ini - 0.06 && T <= b.fin + (margen == null ? 0.3 : margen);
  }

  // linea de texto gigante (Archivo Black) que entra enfocandose
  function LineaGigante(props) {
    var fs = props.fs;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_IMPACTO,
        fontSize: fs,
        lineHeight: 0.86,
        letterSpacing: '-0.02em',
        color: props.color,
        whiteSpace: 'pre',
        textAlign: 'center',
        textShadow: props.sombra === false ? undefined : SOMBRA_GIGANTE
      }
    }, props.children);
  }

  // palabra (o dos lineas) gigante detras de la persona
  function DetrasBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.3)) return null;
    var lineas = String(b.txt).toUpperCase().split('\n');
    var fs = b.tam || Math.min(420, Math.min.apply(null, lineas.map(function (l) {
      return ajustar(l, F_IMPACTO, 400, 1000, 460, -0.02);
    })));
    var e = junta(entra(T, b.ini, 'enfoque', 0.3), sale(T, b.fin, 0.26));
    var empuje = 1 + 0.035 * k01(T, b.ini, Math.max(1, b.fin - b.ini));
    var cSub = b.cSub == null ? b.ini : b.cSub;
    var es = junta(entra(T, cSub, 'sube', 0.26), sale(T, b.fin, 0.2));
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Caja, {
      p: [b.x == null ? 540 : b.x, b.y == null ? 560 : b.y, 'c'],
      e: e,
      esc: empuje,
      z: 8
    }, lineas.map(function (l, i) {
      return /*#__PURE__*/React.createElement(LineaGigante, {
        key: i,
        fs: fs,
        color: col(b.color, BLANCO)
      }, l);
    })), b.arriba ? /*#__PURE__*/React.createElement(Caja, {
      p: [b.x == null ? 540 : b.x, (b.y == null ? 560 : b.y) - fs * lineas.length * 0.43 - 40, 'c'],
      e: es,
      z: 8
    }, /*#__PURE__*/React.createElement(TextoChico, {
      txt: b.arriba,
      marcadas: b.marcadas
    })) : null, b.abajo ? /*#__PURE__*/React.createElement(Caja, {
      p: [b.x == null ? 540 : b.x, (b.y == null ? 560 : b.y) + fs * lineas.length * 0.43 + 46, 'c'],
      e: es,
      z: 8
    }, /*#__PURE__*/React.createElement(TextoChico, {
      txt: b.abajo,
      marcadas: b.marcadas
    })) : null);
  }

  // texto mediano blanco con las marcadas en amarillo (sobre la camara)
  function TextoChico(props) {
    var marc = {};
    (props.marcadas || []).forEach(function (m) {
      marc[norm(m)] = true;
    });
    var fs = props.tam || 66;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: props.fuente || F,
        fontWeight: 800,
        fontSize: fs,
        letterSpacing: '-0.02em',
        lineHeight: 1.05,
        color: col(props.color, BLANCO),
        textShadow: SOMBRA_TX,
        whiteSpace: 'pre',
        textAlign: props.alinear || 'center'
      }
    }, String(props.txt).split(' ').map(function (w, i, arr) {
      var m = marc[norm(w)] || /\d/.test(w) && props.numeros !== false;
      return /*#__PURE__*/React.createElement("span", {
        key: i,
        style: {
          color: m ? AMARILLO : undefined
        }
      }, w + (i < arr.length - 1 ? ' ' : ''));
    }));
  }

  // la apertura de la serie: DIA (pastilla amarilla) + el numero gigante detras + lo de abajo
  function DiaBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.3)) return null;
    var y = b.y == null ? 540 : b.y;
    var txt = String(b.n);
    var fs = b.tam || Math.min(560, ajustar(txt, F_IMPACTO, 400, 940, 700, -0.02));
    var e = junta(entra(T, b.ini + 0.08, 'enfoque', 0.32), sale(T, b.fin, 0.26));
    var empuje = 1 + 0.04 * k01(T, b.ini, Math.max(1, b.fin - b.ini));
    var ep = junta(entra(T, b.ini, 'pop', 0.28), sale(T, b.fin, 0.2));
    var es = junta(entra(T, b.ini + 0.3, 'sube', 0.28), sale(T, b.fin, 0.2));
    var alto = fs * 0.72;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Caja, {
      p: [540, y, 'c'],
      e: e,
      esc: empuje,
      z: 8
    }, /*#__PURE__*/React.createElement(LineaGigante, {
      fs: fs,
      color: col(b.color, BLANCO)
    }, txt)), /*#__PURE__*/React.createElement(Caja, {
      p: [540, y - alto / 2 - 70, 'c'],
      e: ep,
      rot: -3,
      z: 30
    }, /*#__PURE__*/React.createElement(Pastilla, {
      txt: b.arriba || 'DÍA',
      estilo: "amarillo",
      tam: 64
    })), b.abajo !== false ? /*#__PURE__*/React.createElement(Caja, {
      p: [540, y + alto / 2 + 52, 'c'],
      e: es,
      rot: 2,
      z: 30
    }, /*#__PURE__*/React.createElement(Pastilla, {
      txt: b.abajo || 'de cambio físico',
      estilo: "negro",
      tam: b.tamAbajo || 46
    })) : null);
  }

  /* =========================================================
     ENCIMA
     ========================================================= */

  // pastilla: amarillo (tinta sobre amarillo), negro (amarillo sobre tinta), blanco
  function Pastilla(props) {
    var estilo = props.estilo || 'amarillo';
    var fondo = estilo === 'negro' ? NEGRO : estilo === 'blanco' ? BLANCO : estilo === 'rojo' ? ROJO : estilo === 'verde' ? VERDE : AMARILLO;
    var tinta = estilo === 'negro' ? AMARILLO : estilo === 'rojo' || estilo === 'verde' ? BLANCO : NEGRO;
    var fs = props.tam || 44;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: fs * 0.3,
        background: fondo,
        color: tinta,
        borderRadius: fs * 0.32,
        padding: fs * 0.16 + 'px ' + fs * 0.42 + 'px ' + fs * 0.2 + 'px',
        boxShadow: '0 ' + (fs * 0.09).toFixed(1) + 'px 0 rgba(20,17,15,0.85), 0 10px 30px rgba(0,0,0,0.25)',
        fontFamily: props.fuente || F_IMPACTO,
        fontSize: fs,
        lineHeight: 1,
        letterSpacing: '0.01em',
        whiteSpace: 'pre',
        textTransform: props.minus ? 'none' : 'uppercase'
      }
    }, props.emoji ? /*#__PURE__*/React.createElement(Emoji, {
      n: props.emoji,
      tam: fs * 1.25
    }) : null, /*#__PURE__*/React.createElement("span", null, props.txt));
  }

  // titulo arriba: linea chica + linea grande (Archivo Black). Las lineas entran cuando se dicen.
  function TituloBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.3)) return null;
    var p = posicion(b.pos || 'arriba');
    var lineas = String(b.txt).toUpperCase().split('\n');
    var fs = b.tam || Math.min(170, Math.min.apply(null, lineas.map(function (l) {
      return ajustar(l, F_IMPACTO, 400, 980, 180, -0.02);
    })));
    var t0 = b.tiempos ? b.tiempos : [b.ini, b.ini + 0.35];
    var cArr = b.arriba ? t0[0] : null;
    var cGr = b.arriba ? Math.max(t0[1] || b.ini, b.ini) : b.ini;
    var ea = junta(entra(T, cArr == null ? b.ini : cArr, 'sube', 0.24), sale(T, b.fin, 0.2));
    var eg = junta(entra(T, cGr, 'enfoque', 0.3), sale(T, b.fin, 0.22));
    var alto = fs * 0.86 * lineas.length;
    var dy = deriva(T, hash(b.txt) * 6, 3);
    return /*#__PURE__*/React.createElement(React.Fragment, null, b.arriba ? /*#__PURE__*/React.createElement(Caja, {
      p: [p[0], p[1] - alto / 2 - 44, p[2]],
      e: ea,
      z: b.detras ? 8 : 30,
      dy: dy
    }, /*#__PURE__*/React.createElement(TextoChico, {
      txt: b.arriba,
      tam: b.tamArriba || 62,
      fuente: b.mano ? F_MANO : F
    })) : null, /*#__PURE__*/React.createElement(Caja, {
      p: p,
      e: eg,
      z: b.detras ? 8 : 30,
      dy: dy
    }, lineas.map(function (l, i) {
      return /*#__PURE__*/React.createElement(LineaGigante, {
        key: i,
        fs: fs,
        color: col(b.color, AMARILLO)
      }, l);
    })));
  }
  function formato(v, dec, miles) {
    var s = Number(v).toFixed(dec || 0);
    var partes = s.split('.');
    if (miles !== false) partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return partes[0] + (partes[1] ? ',' + partes[1] : '');
  }

  // numero gigante que cuenta (5 HORAS, 84,2 KG, 2.500 KCAL), con lo de antes tachado
  function NumeroBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.3)) return null;
    var p = posicion(b.pos || 'arriba');
    var cuenta = b.desde == null ? 1 : Easing.easeOutExpo(k01(T, b.ini, b.cuenta || 0.9));
    var v = b.desde == null ? b.valor : lerp(b.desde, b.valor, cuenta);
    var txt = (b.signo && b.valor > 0 ? '+' : '') + formato(v, b.dec, b.miles);
    var fs = b.tam || Math.min(330, ajustar(formato(b.valor, b.dec, b.miles) + (b.unidad ? 'XX' : ''), F_IMPACTO, 400, 900, 340, -0.02));
    var e = junta(entra(T, b.ini, 'enfoque', 0.28), sale(T, b.fin, 0.22));
    var eu = junta(entra(T, b.ini + 0.12, 'sube', 0.24), sale(T, b.fin, 0.2));
    var color = col(b.color, AMARILLO);
    var dy = deriva(T, hash(txt) * 5, 3);
    var tach = b.antes != null ? Easing.easeInOutCubic(k01(T, b.ini + (b.cAntes || 0.5), 0.3)) : 0;
    return /*#__PURE__*/React.createElement(React.Fragment, null, b.etiqueta ? /*#__PURE__*/React.createElement(Caja, {
      p: [p[0], p[1] - fs * 0.5 - 50, p[2]],
      e: eu,
      dy: dy,
      z: b.detras ? 8 : 30
    }, /*#__PURE__*/React.createElement(TextoChico, {
      txt: b.etiqueta,
      tam: 56,
      fuente: b.mano ? F_MANO : F
    })) : null, /*#__PURE__*/React.createElement(Caja, {
      p: p,
      e: e,
      dy: dy,
      z: b.detras ? 8 : 30
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: fs * 0.06
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F_IMPACTO,
        fontSize: fs,
        lineHeight: 0.9,
        color: color,
        letterSpacing: '-0.03em',
        textShadow: SOMBRA_GIGANTE
      }
    }, txt), b.unidad ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F_IMPACTO,
        fontSize: fs * 0.36,
        lineHeight: 1,
        color: BLANCO,
        textShadow: SOMBRA_TX,
        opacity: eu.op
      }
    }, String(b.unidad).toUpperCase()) : null)), b.antes != null ? /*#__PURE__*/React.createElement(Caja, {
      p: [p[0], p[1] + fs * 0.5 + 54, p[2]],
      e: eu,
      dy: dy,
      z: 30
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'inline-block',
        padding: '0 10px'
      }
    }, /*#__PURE__*/React.createElement(TextoChico, {
      txt: (b.textoAntes || 'antes:') + ' ' + b.antes,
      tam: 58
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: '54%',
        height: 9,
        width: (100 * tach).toFixed(1) + '%',
        background: ROJO,
        borderRadius: 5,
        transform: 'rotate(-3deg)',
        boxShadow: '0 2px 0 rgba(20,17,15,0.7)'
      }
    }))) : null);
  }

  // circulo con check o con equis (se dibuja)
  function Signo(props) {
    var t = props.tam || 64,
      p = clamp(props.p == null ? 1 : props.p, 0, 1);
    var bien = props.bien !== false;
    var fondo = props.fondo || (bien ? VERDE : ROJO);
    var largo = 60;
    return /*#__PURE__*/React.createElement("svg", {
      width: t,
      height: t,
      viewBox: "0 0 100 100",
      style: {
        display: 'block',
        overflow: 'visible',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: 50,
      cy: 50,
      r: 46 * (0.6 + 0.4 * back(Math.min(1, p * 1.6), 2)),
      fill: fondo
    }), bien ? /*#__PURE__*/React.createElement("path", {
      d: "M 29 52 L 44 66 L 72 35",
      fill: "none",
      stroke: props.tinta || BLANCO,
      strokeWidth: 11,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: largo,
      strokeDashoffset: largo * (1 - clamp(p * 1.6 - 0.5, 0, 1))
    }) : /*#__PURE__*/React.createElement("g", {
      stroke: props.tinta || BLANCO,
      strokeWidth: 11,
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 33 33 L 67 67",
      strokeDasharray: 50,
      strokeDashoffset: 50 * (1 - clamp(p * 1.6 - 0.5, 0, 1))
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 67 33 L 33 67",
      strokeDasharray: 50,
      strokeDashoffset: 50 * (1 - clamp(p * 1.6 - 0.8, 0, 1))
    })));
  }

  // texto con resaltador amarillo detras de las marcadas (en tarjetas blancas)
  function TextoTinta(props) {
    var marc = {};
    (props.marcadas || []).forEach(function (m) {
      marc[norm(m)] = true;
    });
    var p = props.p == null ? 1 : props.p;
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F,
        fontWeight: 800,
        fontSize: props.tam || 50,
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        color: NEGRO
      }
    }, String(props.txt).split(' ').map(function (w, i, arr) {
      var m = marc[norm(w)];
      return /*#__PURE__*/React.createElement("span", {
        key: i,
        style: {
          position: 'relative',
          whiteSpace: 'pre'
        }
      }, m ? /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: '-0.08em',
          right: '-0.08em',
          top: '0.42em',
          bottom: '0.02em',
          background: AMARILLO,
          borderRadius: '0.12em',
          transformOrigin: '0 50%',
          transform: 'scaleX(' + clamp(p, 0, 1).toFixed(3) + ')'
        }
      }) : null, /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'relative'
        }
      }, w), i < arr.length - 1 ? ' ' : '');
    }));
  }

  // tarjeta blanca: emoji o signo + texto (+ linea chica)
  function TarjetaBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.25)) return null;
    var p = posicion(b.pos || 'abajo');
    var e = junta(entra(T, b.ini, 'pop', 0.3), sale(T, b.fin, 0.2));
    var pi = k01(T, b.ini + 0.12, 0.4);
    var dy = deriva(T, hash(b.texto) * 6, 4);
    var icono = b.icono === 'check' || b.icono === 'bien' ? /*#__PURE__*/React.createElement(Signo, {
      tam: 84,
      p: pi,
      bien: true
    }) : b.icono === 'equis' || b.icono === 'mal' ? /*#__PURE__*/React.createElement(Signo, {
      tam: 84,
      p: pi,
      bien: false
    }) : b.emoji ? /*#__PURE__*/React.createElement("div", {
      style: {
        transform: 'scale(' + (0.4 + 0.6 * back(k01(T, b.ini + 0.08, 0.3), 2)).toFixed(3) + ')'
      }
    }, /*#__PURE__*/React.createElement(Emoji, {
      n: b.emoji,
      tam: 96
    })) : null;
    return /*#__PURE__*/React.createElement(Caja, {
      p: p,
      e: e,
      dy: dy,
      rot: b.rot || 0,
      z: 30
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        background: BLANCO,
        borderRadius: 34,
        padding: icono ? '24px 40px 24px 26px' : '26px 40px',
        boxShadow: SOMBRA_TARJETA,
        maxWidth: b.ancho || 820,
        minWidth: b.minimo || 0
      }
    }, icono, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, b.etiqueta ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F_MONO,
        fontWeight: 600,
        fontSize: 26,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(20,17,15,0.55)'
      }
    }, b.etiqueta) : null, /*#__PURE__*/React.createElement(TextoTinta, {
      txt: b.texto,
      tam: b.tam || 52,
      marcadas: b.marcadas,
      p: k01(T, b.ini + 0.25, 0.35)
    }), b.sub ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F,
        fontWeight: 600,
        fontSize: 34,
        color: 'rgba(20,17,15,0.62)',
        lineHeight: 1.15
      }
    }, b.sub) : null)));
  }

  // lista que se arma mientras se nombra cada cosa (pastillas blancas con check)
  function ListaBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.3)) return null;
    var p = posicion(b.pos || 'arriba-izq');
    if (!b.pos || typeof b.pos === 'string') {
      p[3] = 's';
      p[1] -= 90;
    }
    var sal = sale(T, b.fin, 0.22);
    var fs = b.tam || 46;
    var izq = p[2] === 'i',
      der = p[2] === 'd';
    var items = b.items.map(function (it, i) {
      var c = b.tiempos[i];
      var e = junta(entra(T, c, 'pop', 0.28), sal);
      if (e.op <= 0.003) return null;
      var pi = k01(T, c + 0.1, 0.35);
      var dy = deriva(T, i * 1.7 + hash(it.texto), 3);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          opacity: e.op,
          transform: 'translateY(' + dy.toFixed(2) + 'px) scale(' + e.esc.toFixed(4) + ')',
          transformOrigin: izq ? '0 50%' : der ? '100% 50%' : '50% 50%'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 16,
          background: BLANCO,
          borderRadius: 999,
          padding: '10px 30px 12px 12px',
          boxShadow: SOMBRA_TARJETA
        }
      }, it.emoji ? /*#__PURE__*/React.createElement(Emoji, {
        n: it.emoji,
        tam: fs * 1.45
      }) : /*#__PURE__*/React.createElement(Signo, {
        tam: fs * 1.3,
        p: pi,
        bien: !it.mal,
        fondo: it.mal ? ROJO : NEGRO,
        tinta: it.mal ? BLANCO : AMARILLO
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'relative',
          fontFamily: F,
          fontWeight: 800,
          fontSize: fs,
          letterSpacing: '-0.02em',
          color: it.mal ? 'rgba(20,17,15,0.55)' : NEGRO,
          whiteSpace: 'pre'
        }
      }, it.texto, it.mal ? /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: -4,
          top: '52%',
          height: 6,
          width: (104 * clamp(pi * 1.4 - 0.3, 0, 1)).toFixed(1) + '%',
          background: ROJO,
          borderRadius: 3
        }
      }) : null)));
    });
    var et = b.titulo ? junta(entra(T, b.ini, 'sube', 0.24), sal) : null;
    return /*#__PURE__*/React.createElement(Caja, {
      p: p,
      z: 30
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: izq ? 'flex-start' : der ? 'flex-end' : 'center',
        gap: 14
      }
    }, b.titulo && et.op > 0.003 ? /*#__PURE__*/React.createElement("div", {
      style: {
        opacity: et.op,
        transform: 'translateY(' + et.dy.toFixed(1) + 'px)',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement(Pastilla, {
      txt: b.titulo,
      estilo: b.estilo || 'amarillo',
      tam: 40
    })) : null, items));
  }

  // emoji 3D suelto: entra con rebote y flota
  function EmojiBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.25)) return null;
    var p = posicion(b.pos || 'der');
    var e = junta(entra(T, b.ini, 'pop', 0.34), sale(T, b.fin, 0.2));
    var giro = (b.rot == null ? hash(b.n + b.ini) * 16 - 8 : b.rot) + (1 - k01(T, b.ini, 0.3)) * -22 + M.life(T, 3.1, 4, hash(b.n) * 6);
    var dy = M.life(T, 2.7, 10, hash(b.n + 'y') * 6);
    var t = b.tam || 230;
    return /*#__PURE__*/React.createElement(Caja, {
      p: p,
      e: e,
      dy: dy,
      rot: giro,
      z: b.detras ? 8 : 32
    }, /*#__PURE__*/React.createElement(Emoji, {
      n: b.n,
      tam: t,
      estilo: {
        filter: 'drop-shadow(0 ' + (t * 0.07).toFixed(1) + 'px ' + (t * 0.08).toFixed(1) + 'px rgba(0,0,0,0.38))'
      }
    }));
  }

  // foto propia como polaroid
  function ImagenBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.25)) return null;
    var p = posicion(b.pos || [540, 640]);
    var e = junta(entra(T, b.ini, 'pop', 0.34), sale(T, b.fin, 0.2));
    var w = b.ancho || 500,
      h = b.alto || Math.round(w * 1.1);
    var giro = (b.rot == null ? -4 : b.rot) + (1 - k01(T, b.ini, 0.32)) * 10;
    var dy = deriva(T, hash(b.src) * 6, 5);
    return /*#__PURE__*/React.createElement(Caja, {
      p: p,
      e: e,
      dy: dy,
      rot: giro,
      z: 30
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: BLANCO,
        padding: '16px 16px ' + (b.pie ? 18 : 16) + 'px',
        borderRadius: 18,
        boxShadow: SOMBRA_TARJETA
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        height: h,
        borderRadius: 8,
        overflow: 'hidden',
        background: GRIS
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: b.src,
      alt: "",
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        objectPosition: b.foco || '50% 50%'
      }
    })), b.pie ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_MANO,
        fontSize: 46,
        color: NEGRO,
        textAlign: 'center',
        paddingTop: 10,
        lineHeight: 1
      }
    }, b.pie) : null));
  }

  // etiqueta: pastilla, o nota a mano (estilo 'mano'); con tachado opcional
  function EtiquetaBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.25)) return null;
    var p = posicion(b.pos || 'arriba');
    var e = junta(entra(T, b.ini, b.estilo === 'mano' ? 'sube' : 'pop', 0.26), sale(T, b.fin, 0.2));
    var dy = deriva(T, hash(b.txt) * 6, 3);
    var tach = b.tachado ? Easing.easeInOutCubic(k01(T, b.cTachado == null ? b.ini + 0.45 : b.cTachado, 0.28)) : 0;
    var rot = b.rot == null ? b.estilo === 'mano' ? -4 : -2 : b.rot;
    var cuerpo = b.estilo === 'mano' ? /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_MANO,
        fontSize: b.tam || 64,
        color: col(b.color, BLANCO),
        textShadow: SOMBRA_TX,
        whiteSpace: 'pre',
        lineHeight: 1.05
      }
    }, b.txt) : /*#__PURE__*/React.createElement(Pastilla, {
      txt: b.txt,
      estilo: b.estilo || 'amarillo',
      tam: b.tam || 44,
      emoji: b.emoji,
      minus: b.minus
    });
    return /*#__PURE__*/React.createElement(Caja, {
      p: p,
      e: e,
      dy: dy,
      rot: rot,
      z: 34
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'inline-block'
      }
    }, cuerpo, b.tachado ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: -10,
        top: '50%',
        height: 10,
        width: 'calc(' + (100 * tach).toFixed(1) + '% + 20px)',
        background: ROJO,
        borderRadius: 5,
        transform: 'rotate(-4deg)',
        boxShadow: '0 2px 0 rgba(20,17,15,0.7)'
      }
    }) : null));
  }

  // barra de progreso en tarjeta (DIA 12 DE 90, PROTEINA 120/180 G)
  function ProgresoBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.25)) return null;
    var p = posicion(b.pos || 'abajo');
    var e = junta(entra(T, b.ini, 'pop', 0.3), sale(T, b.fin, 0.2));
    var k = Easing.easeOutExpo(k01(T, b.ini + 0.2, b.cuenta || 1.1));
    var max = b.max || 100;
    var v = lerp(b.desde || 0, b.valor, k);
    var frac = clamp(v / max, 0, 1);
    var dy = deriva(T, hash(b.etiqueta || 'p') * 6, 4);
    var w = b.ancho || 760;
    return /*#__PURE__*/React.createElement(Caja, {
      p: p,
      e: e,
      dy: dy,
      z: 30
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        background: BLANCO,
        borderRadius: 34,
        padding: '26px 34px 30px',
        boxShadow: SOMBRA_TARJETA,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F_MONO,
        fontWeight: 600,
        fontSize: 28,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(20,17,15,0.6)'
      }
    }, b.etiqueta), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F_IMPACTO,
        fontSize: 56,
        color: NEGRO,
        lineHeight: 1
      }
    }, formato(v, b.dec), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 30,
        color: 'rgba(20,17,15,0.5)'
      }
    }, ' / ' + formato(max, b.dec) + (b.unidad ? ' ' + b.unidad : '')))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 34,
        borderRadius: 17,
        background: '#EDEAE4',
        overflow: 'hidden',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: (100 * frac).toFixed(2) + '%',
        background: col(b.color, AMARILLO),
        borderRadius: 17,
        boxShadow: 'inset 0 -5px 0 rgba(20,17,15,0.12)'
      }
    }))));
  }

  // pedir un comentario: "comenta" + la palabra grande + la caja de texto que se escribe sola
  function CtaBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.3)) return null;
    var y = b.y == null ? 400 : b.y;
    var palabra = String(b.palabra).toUpperCase();
    var fs = Math.min(150, ajustar('“' + palabra + '”', F_IMPACTO, 400, 940, 150, -0.02));
    var e1 = junta(entra(T, b.ini, 'sube', 0.24), sale(T, b.fin, 0.2));
    var e2 = junta(entra(T, b.ini + 0.12, 'enfoque', 0.3), sale(T, b.fin, 0.22));
    var e3 = junta(entra(T, b.ini + 0.3, 'pop', 0.3), sale(T, b.fin, 0.2));
    var cEsc = b.ini + 0.6;
    var n = Math.floor(clamp((T - cEsc) / 0.09, 0, palabra.length));
    var cursor = Math.floor(T * 2.4) % 2 === 0;
    var dy = deriva(T, 2.2, 3);
    var enviado = T >= cEsc + palabra.length * 0.09 + 0.35;
    var pb = k01(T, cEsc + palabra.length * 0.09 + 0.35, 0.25);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Caja, {
      p: [540, y - fs * 0.5 - 40, 'c'],
      e: e1,
      dy: dy,
      z: 34
    }, /*#__PURE__*/React.createElement(TextoChico, {
      txt: b.texto || 'comenta',
      tam: 64,
      fuente: F_MANO
    })), /*#__PURE__*/React.createElement(Caja, {
      p: [540, y, 'c'],
      e: e2,
      dy: dy,
      z: 34
    }, /*#__PURE__*/React.createElement(LineaGigante, {
      fs: fs,
      color: AMARILLO
    }, '“' + palabra + '”')), /*#__PURE__*/React.createElement(Caja, {
      p: [540, y + fs * 0.5 + 90, 'c'],
      e: e3,
      dy: dy,
      z: 34
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 820,
        height: 112,
        background: BLANCO,
        borderRadius: 56,
        boxShadow: SOMBRA_TARJETA,
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px 0 22px',
        boxSizing: 'border-box',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70,
        height: 70,
        borderRadius: 35,
        background: AMARILLO,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontFamily: F,
        fontWeight: 800,
        fontSize: 46,
        color: NEGRO,
        letterSpacing: '0.01em',
        whiteSpace: 'pre'
      }
    }, palabra.slice(0, n), /*#__PURE__*/React.createElement("span", {
      style: {
        opacity: cursor && !enviado ? 1 : 0,
        color: NEGRO
      }
    }, "|")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 78,
        height: 78,
        borderRadius: 39,
        background: NEGRO,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'scale(' + (1 + 0.18 * Math.sin(Math.PI * pb)).toFixed(3) + ')'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: 40,
      height: 40,
      viewBox: "0 0 40 40"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 20 31 L 20 10 M 11 18 L 20 9 L 29 18",
      fill: "none",
      stroke: AMARILLO,
      strokeWidth: 5.5,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))))));
  }

  /* =========================================================
     CAPITULOS (marco) y COMPARAR (antes / ahora)
     ========================================================= */

  // fondo amarillo con puntos que derivan
  function FondoPuntos(props) {
    var T = props.T,
      op = props.op;
    if (op <= 0.001) return null;
    var paso = 46,
      mov = T * 14 % paso;
    var fondo = props.oscuro ? NEGRO : AMARILLO;
    var punto = props.oscuro ? 'rgba(255,212,0,0.22)' : 'rgba(20,17,15,0.16)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        background: fondo,
        opacity: op,
        overflow: 'hidden',
        zIndex: props.z || 0
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: ANCHO + paso,
      height: ALTO + paso,
      style: {
        position: 'absolute',
        left: -mov,
        top: -mov
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
      id: 'cambio-puntos-' + (props.oscuro ? 'n' : 'a'),
      width: paso,
      height: paso,
      patternUnits: "userSpaceOnUse"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: paso / 2,
      cy: paso / 2,
      r: 4.2,
      fill: punto
    }))), /*#__PURE__*/React.createElement("rect", {
      width: ANCHO + paso,
      height: ALTO + paso,
      fill: 'url(#cambio-puntos-' + (props.oscuro ? 'n' : 'a') + ')'
    })));
  }

  // titulo del capitulo arriba del marco (linea a mano + titulo grande) y el #n pegado en la esquina del marco
  function CapituloTitulo(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, T_MARCO)) return null;
    var sal = sale(T, b.fin - T_MARCO * 0.5, 0.2);
    var tinta = b.oscuro ? BLANCO : NEGRO;
    var lineas = String(b.titulo || '').toUpperCase().split('\n');
    var fsT = b.tamTitulo || Math.min(124, Math.min.apply(null, lineas.map(function (l) {
      return ajustar(l, F_IMPACTO, 400, 940, 130, -0.02);
    })));
    var e1 = junta(entra(T, b.ini + 0.18, 'pop', 0.3), sal);
    var e2 = junta(entra(T, b.ini - 0.02, 'enfoque', 0.3), sal);
    var e3 = junta(entra(T, b.ini + 0.1, 'sube', 0.26), sal);
    var dy = deriva(T, hash(b.titulo) * 4, 3);
    var altoT = fsT * 0.92 * lineas.length;
    var yT = MARCO.y - 44 - altoT / 2;
    return /*#__PURE__*/React.createElement(React.Fragment, null, b.sub ? /*#__PURE__*/React.createElement(Caja, {
      p: [540, yT - altoT / 2 - 46, 'c'],
      e: e3,
      dy: dy,
      rot: -2,
      z: 20
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_MANO,
        fontSize: 54,
        color: tinta,
        whiteSpace: 'pre',
        lineHeight: 1
      }
    }, b.sub)) : null, /*#__PURE__*/React.createElement(Caja, {
      p: [540, yT, 'c'],
      e: e2,
      dy: dy,
      z: 20
    }, lineas.map(function (l, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          fontFamily: F_IMPACTO,
          fontSize: fsT,
          lineHeight: 0.92,
          color: tinta,
          letterSpacing: '-0.02em',
          whiteSpace: 'pre',
          textAlign: 'center'
        }
      }, l);
    })), b.n != null ? /*#__PURE__*/React.createElement(Caja, {
      p: [MARCO.x + 30, MARCO.y + 6, 'c'],
      e: e1,
      rot: -8,
      z: 22
    }, /*#__PURE__*/React.createElement(Pastilla, {
      txt: '#' + b.n,
      estilo: b.oscuro ? 'amarillo' : 'negro',
      tam: 64
    })) : null);
  }

  // pantalla completa: dos fotos lado a lado (ANTES / AHORA) sobre amarillo
  function CompararBeat(props) {
    var T = props.T,
      b = props.b;
    if (!vivo(T, b, 0.3)) return null;
    var op = Easing.easeOutCubic(k01(T, b.ini - 0.15, 0.25)) * (1 - Easing.easeInCubic(k01(T, b.fin, 0.25)));
    var etq = b.etiquetas || ['ANTES', 'AHORA'];
    var fotos = [b.antes, b.ahora];
    var w = 452,
      h = 680;
    var flecha = Easing.easeInOutCubic(k01(T, b.ini + 0.45, 0.35));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        zIndex: 36,
        opacity: op
      }
    }, /*#__PURE__*/React.createElement(FondoPuntos, {
      T: T,
      op: 1,
      oscuro: b.oscuro
    }), b.titulo ? /*#__PURE__*/React.createElement(Caja, {
      p: [540, 420, 'c'],
      e: entra(T, b.ini, 'enfoque', 0.3),
      z: 2
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: F_IMPACTO,
        fontSize: b.tamTitulo || 110,
        lineHeight: 0.92,
        color: b.oscuro ? BLANCO : NEGRO,
        textAlign: 'center',
        whiteSpace: 'pre'
      }
    }, String(b.titulo).toUpperCase())) : null, fotos.map(function (src, i) {
      var c = b.ini + 0.1 + i * 0.22;
      var e = entra(T, c, 'pop', 0.34);
      var x = i === 0 ? 290 : 790,
        rot = i === 0 ? -3.5 : 3.5;
      var dy = deriva(T, i * 2.1, 5);
      return /*#__PURE__*/React.createElement(Caja, {
        key: i,
        p: [x, 1010, 'c'],
        e: e,
        dy: dy,
        rot: rot + (1 - k01(T, c, 0.3)) * (i ? 12 : -12),
        z: 3
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          background: BLANCO,
          padding: 14,
          borderRadius: 22,
          boxShadow: SOMBRA_TARJETA
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: w,
          height: h,
          borderRadius: 12,
          overflow: 'hidden',
          background: GRIS
        }
      }, src ? /*#__PURE__*/React.createElement("img", {
        src: src,
        alt: "",
        style: {
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }
      }) : null), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: '50%',
          top: -34,
          transform: 'translateX(-50%) rotate(' + -rot + 'deg)'
        }
      }, /*#__PURE__*/React.createElement(Pastilla, {
        txt: etq[i],
        estilo: i === 0 ? 'blanco' : 'negro',
        tam: 48
      }))));
    }), /*#__PURE__*/React.createElement("svg", {
      width: ANCHO,
      height: ALTO,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible',
        zIndex: 4
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 470 1430 C 520 1500, 580 1500, 628 1440",
      fill: "none",
      stroke: b.oscuro ? BLANCO : NEGRO,
      strokeWidth: 12,
      strokeLinecap: "round",
      strokeDasharray: 260,
      strokeDashoffset: 260 * (1 - flecha)
    }), flecha > 0.95 ? /*#__PURE__*/React.createElement("path", {
      d: "M 600 1430 L 630 1438 L 626 1468",
      fill: "none",
      stroke: b.oscuro ? BLANCO : NEGRO,
      strokeWidth: 12,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }) : null));
  }

  /* =========================================================
     SERIE y FIRMA
     ========================================================= */

  // sello chico de la serie arriba a la izquierda: DIA 12 · CAMBIO FISICO
  function Sello(props) {
    var T = props.T,
      def = props.def,
      s = def.serie;
    if (!s || s.sello === false) return null;
    var ini = s.selloDesde != null ? s.selloDesde : def.finApertura;
    var fin = def.iniFirma;
    if (T < ini - 0.05 || T > fin + 0.3) return null;
    var e = junta(entra(T, ini, 'sube', 0.3), sale(T, fin, 0.25));
    var tapa = 0;
    def.tapanSello.forEach(function (r) {
      tapa = Math.max(tapa, Math.min(k01(T, r[0] - 0.22, 0.2), 1 - k01(T, r[1] + 0.05, 0.25)));
    });
    e.op *= 1 - tapa;
    e.dy -= 14 * tapa;
    return /*#__PURE__*/React.createElement(Caja, {
      p: [56, 268, 'i'],
      e: e,
      z: 38
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        background: 'rgba(20,17,15,0.86)',
        borderRadius: 999,
        padding: '10px 26px 11px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: AMARILLO,
        color: NEGRO,
        fontFamily: F_IMPACTO,
        fontSize: 30,
        lineHeight: 1,
        borderRadius: 999,
        padding: '7px 16px 8px'
      }
    }, 'DÍA ' + s.dia), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F,
        fontWeight: 800,
        fontSize: 28,
        color: BLANCO,
        letterSpacing: '0.08em'
      }
    }, String(s.nombre || 'CAMBIO FÍSICO').toUpperCase())));
  }

  // logos limpios en discos blancos (como el cierre de los shorts)
  function Logo(props) {
    var r = props.r || 40;
    var red = props.red;
    return /*#__PURE__*/React.createElement("svg", {
      width: 2 * r,
      height: 2 * r,
      viewBox: "-50 -50 100 100",
      style: {
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: "cambio-ig",
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
      offset: "0.65",
      stopColor: "#D62976"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: "1",
      stopColor: "#962FBF"
    }))), /*#__PURE__*/React.createElement("circle", {
      r: 50,
      fill: BLANCO
    }), red === 'youtube' ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("rect", {
      x: -27,
      y: -19,
      width: 54,
      height: 38,
      rx: 11,
      fill: "#FF0000"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M-7 -10 L11 0 L-7 10 Z",
      fill: BLANCO,
      stroke: BLANCO,
      strokeWidth: 2,
      strokeLinejoin: "round"
    })) : red === 'instagram' ? /*#__PURE__*/React.createElement("g", {
      fill: "none",
      stroke: "url(#cambio-ig)",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: -23,
      y: -23,
      width: 46,
      height: 46,
      rx: 14,
      strokeWidth: 6
    }), /*#__PURE__*/React.createElement("circle", {
      r: 10.5,
      strokeWidth: 6
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 12.5,
      cy: -12.5,
      r: 2.6,
      fill: "#D62976",
      stroke: "none"
    })) : /*#__PURE__*/React.createElement("g", null, [[-2.5, -2, '#25F4EE'], [2.5, 2, '#FE2C55'], [0, 0, NEGRO]].map(function (n, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: i,
        transform: 'translate(' + n[0] + ' ' + n[1] + ')',
        fill: "none",
        stroke: n[2],
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
    })));
  }

  // al final de todos los videos: las redes con @eltorvick y el "sigueme"
  function Firma(props) {
    var T = props.T,
      def = props.def,
      f = def.firma;
    if (!f) return null;
    var ini = def.iniFirma;
    if (T < ini - 0.05) return null;
    var y = f.y == null ? 330 : f.y;
    var e = entra(T, ini, 'pop', 0.3);
    var e2 = entra(T, ini + 0.35, 'pop', 0.3);
    var dy = deriva(T, 1.3, 3);
    var redes = ['youtube', 'instagram', 'tiktok'];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Caja, {
      p: [540, y, 'c'],
      e: e,
      dy: dy,
      z: 45
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        background: NEGRO,
        borderRadius: 999,
        padding: '14px 36px 14px 16px',
        boxShadow: '0 12px 36px rgba(0,0,0,0.35)'
      }
    }, redes.map(function (r, i) {
      var si = back(k01(T, ini + 0.12 + i * 0.07, 0.26), 2) * (1 + 0.14 * Math.max(0, Math.sin(Math.PI * k01(T, ini + 1.1 + i * 0.1, 0.3))));
      return /*#__PURE__*/React.createElement("div", {
        key: r,
        style: {
          transform: 'scale(' + Math.max(0, si).toFixed(3) + ') translateY(' + M.life(T, 1.8, 2.5, i * 1.4).toFixed(2) + 'px)'
        }
      }, /*#__PURE__*/React.createElement(Logo, {
        red: r,
        r: 40
      }));
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: F,
        fontWeight: 800,
        fontSize: 52,
        color: BLANCO,
        marginLeft: 10,
        letterSpacing: '-0.01em'
      }
    }, "@eltorvick"))), /*#__PURE__*/React.createElement(Caja, {
      p: [540, y + 118, 'c'],
      e: e2,
      dy: dy,
      rot: -2,
      z: 45
    }, /*#__PURE__*/React.createElement(Pastilla, {
      txt: f.texto || 'SÍGUEME PARA MÁS',
      estilo: "amarillo",
      tam: 50
    })));
  }
  function Flash(props) {
    if (props.ex.flash <= 0.001) return null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        background: BLANCO,
        opacity: 0.85 * props.ex.flash,
        zIndex: 60
      }
    });
  }

  /* =========================================================
     EL PLAN: beats con tiempos de la voz (t('frase'))
     ========================================================= */

  var plan = {
    // apertura de la serie: DIA + el numero gigante detras de la persona
    dia: function (ini, fin, o) {
      return Object.assign({
        tipo: 'dia',
        ini: ini,
        fin: fin
      }, o || {});
    },
    // palabra gigante detras de la persona ('\n' para dos lineas); o: color, y, tam, arriba, abajo, marcadas
    detras: function (ini, fin, txt, o) {
      return Object.assign({
        tipo: 'detras',
        ini: ini,
        fin: fin,
        txt: txt
      }, o || {});
    },
    // titulo arriba: o.arriba (linea chica), color, pos, detras, mano
    titulo: function (ini, fin, txt, o) {
      return Object.assign({
        tipo: 'titulo',
        ini: ini,
        fin: fin,
        txt: txt
      }, o || {});
    },
    // numero que cuenta: { valor, desde, dec, unidad, etiqueta, antes, color, pos, detras, signo }
    numero: function (ini, fin, o) {
      return Object.assign({
        tipo: 'numero',
        ini: ini,
        fin: fin
      }, o || {});
    },
    // tarjeta blanca: { texto, emoji | icono: 'check'|'equis', sub, etiqueta, marcadas, pos }
    tarjeta: function (ini, fin, o) {
      return Object.assign({
        tipo: 'tarjeta',
        ini: ini,
        fin: fin
      }, o || {});
    },
    // lista que se arma: { titulo, items: ['pollo', { texto, emoji, mal, t }], pos }
    lista: function (ini, fin, o) {
      return Object.assign({
        tipo: 'lista',
        ini: ini,
        fin: fin
      }, o || {});
    },
    // emoji 3D: nombre ('pollo') o el emoji ('🍗'); o: pos, tam, rot
    emoji: function (ini, fin, n, o) {
      return Object.assign({
        tipo: 'emoji',
        ini: ini,
        fin: fin,
        n: n
      }, o || {});
    },
    imagen: function (ini, fin, src, o) {
      return Object.assign({
        tipo: 'imagen',
        ini: ini,
        fin: fin,
        src: src
      }, o || {});
    },
    // pastilla o nota a mano: o.estilo amarillo|negro|blanco|rojo|verde|mano, tachado, pos, rot, emoji
    etiqueta: function (ini, fin, txt, o) {
      return Object.assign({
        tipo: 'etiqueta',
        ini: ini,
        fin: fin,
        txt: txt
      }, o || {});
    },
    progreso: function (ini, fin, o) {
      return Object.assign({
        tipo: 'progreso',
        ini: ini,
        fin: fin
      }, o || {});
    },
    cta: function (ini, fin, palabra, o) {
      return Object.assign({
        tipo: 'cta',
        ini: ini,
        fin: fin,
        palabra: palabra
      }, o || {});
    },
    // la camara se mete en un marco sobre amarillo: { n, titulo, sub, oscuro }
    capitulo: function (ini, fin, o) {
      return Object.assign({
        tipo: 'capitulo',
        ini: ini,
        fin: fin
      }, o || {});
    },
    comparar: function (ini, fin, o) {
      return Object.assign({
        tipo: 'comparar',
        ini: ini,
        fin: fin
      }, o || {});
    },
    // encuadre: { zoom, foco: [x, y] 0..1, mov: golpe|suave|empuje|corte, bn, oscuro, desenfoque, sale }
    camara: function (ini, fin, o) {
      return Object.assign({
        tipo: 'camara',
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
        fin: t + 0.28
      };
    },
    sacudida: function (t, fuerza) {
      return {
        tipo: 'sacudida',
        ini: t,
        fin: t + 0.42,
        fuerza: fuerza
      };
    }
  };
  var DETRAS = ['detras', 'dia'];
  var ENCIMA = ['titulo', 'numero', 'tarjeta', 'lista', 'emoji', 'imagen', 'etiqueta', 'progreso', 'cta'];
  function zonaDe(b) {
    if (b.tipo === 'emoji' || b.tipo === 'etiqueta') return null;
    var p = posicion(b.pos || (b.tipo === 'titulo' || b.tipo === 'numero' || b.tipo === 'imagen' ? 'arriba' : b.tipo === 'lista' ? 'arriba-izq' : b.tipo === 'cta' ? 'arriba' : 'abajo'));
    return Math.round(p[0] / 120) + ':' + Math.round(p[1] / 200);
  }
  function preparar(crudo) {
    var tr = transcripcion(crudo.id);
    var d = Object.assign({}, crudo);
    d.encuadre = Object.assign({
      zoom: 1,
      foco: [0.5, 0.4]
    }, crudo.encuadre || {});
    d.subs = Object.assign({
      y: 1230,
      tam: 76,
      ancho: 980,
      palabras: 3,
      caracteres: 18
    }, crudo.subs || {});
    d.marcadas = {};
    (d.subs.marcadas || []).forEach(function (m) {
      d.marcadas[norm(m)] = true;
    });
    d.dur = crudo.dur || tr.dur || 30;
    d.bloques = armarBloques(tr.palabras, d.subs);
    var beats = (crudo.plan || []).filter(Boolean).map(function (b) {
      return Object.assign({}, b);
    });
    d.camaras = beats.filter(function (b) {
      return b.tipo === 'camara';
    });
    d.capitulos = beats.filter(function (b) {
      return b.tipo === 'capitulo';
    });
    d.comparar = beats.filter(function (b) {
      return b.tipo === 'comparar';
    });
    d.detras = beats.filter(function (b) {
      return DETRAS.indexOf(b.tipo) >= 0 || b.detras && ENCIMA.indexOf(b.tipo) >= 0;
    });
    d.encima = beats.filter(function (b) {
      return ENCIMA.indexOf(b.tipo) >= 0 && !b.detras;
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
    // tiempos de la voz: los items de las listas y las lineas de los titulos
    beats.forEach(function (b) {
      if (b.tipo === 'lista') {
        b.items = b.items.map(function (it) {
          return typeof it === 'string' ? {
            texto: it
          } : it;
        });
        var auto = tiemposDe(d.id, b.items.map(function (it) {
          return it.busca || it.texto;
        }), b.ini, b.fin);
        b.tiempos = b.items.map(function (it, i) {
          return it.t != null ? it.t : auto[i];
        });
      }
      if (b.tipo === 'titulo' && b.arriba && b.voz !== false && !b.tiempos) {
        var pal = String(b.txt).split(/\s+/)[0];
        b.tiempos = [b.ini, tiemposDe(d.id, [b.arriba.split(/\s+/)[0], pal], b.ini - 0.2, b.fin)[1]];
      }
    });
    // dos cosas en la misma zona no se pisan: la anterior se va antes
    var ultimo = {};
    d.encima.slice().sort(function (x, y) {
      return x.ini - y.ini;
    }).forEach(function (b) {
      var k = zonaDe(b);
      if (!k) return;
      var prev = ultimo[k];
      if (prev && b.ini < prev.fin + 0.1) prev.fin = Math.max(prev.ini + 0.3, b.ini - 0.16);
      ultimo[k] = b;
    });
    // lo de encima que empezo antes de un capitulo (o de un antes/ahora) termina de irse antes de la transicion
    d.capitulos.concat(d.comparar).forEach(function (c) {
      var corte = c.ini - (c.tipo === 'capitulo' ? T_MARCO * 0.5 : 0.15) - 0.24;
      d.encima.forEach(function (b) {
        if (b.ini < corte && b.fin > corte) b.fin = Math.max(b.ini + 0.3, corte);
      });
    });
    // la serie: el sello aparece cuando termina la apertura; la firma al final
    var dia = beats.filter(function (b) {
      return b.tipo === 'dia';
    })[0];
    d.finApertura = dia ? dia.fin + 0.2 : 0.4;
    d.firma = crudo.firma === false ? null : Object.assign({
      dur: 2.8
    }, crudo.firma || {});
    if (d.firma && crudo.serie && !d.firma.texto && crudo.serie.dia != null) d.firma.texto = 'SÍGUEME PARA EL DÍA ' + (Number(crudo.serie.dia) + 1);
    d.iniFirma = d.firma ? d.firma.ini != null ? d.firma.ini : Math.max(0, d.dur - d.firma.dur) : d.dur + 1;
    d.serie = crudo.serie || null;
    // lo que ocupa la parte de arriba esconde el sello de la serie mientras esta
    d.tapanSello = [];
    beats.forEach(function (b) {
      var arriba = b.tipo === 'dia' || b.tipo === 'detras' || b.tipo === 'capitulo' || b.tipo === 'comparar' || b.tipo === 'cta' || ENCIMA.indexOf(b.tipo) >= 0 && b.tipo !== 'emoji' && posicion(b.pos || (b.tipo === 'tarjeta' || b.tipo === 'progreso' ? 'abajo' : b.tipo === 'lista' ? 'arriba-izq' : 'arriba'))[1] < 760;
      if (arriba) d.tapanSello.push([b.ini - (b.tipo === 'capitulo' ? T_MARCO : 0), b.fin + (b.tipo === 'capitulo' ? T_MARCO * 0.5 : 0.2)]);
    });
    // nada de lo de arriba se cruza con la firma (la firma va en y 330-450)
    d.encima.concat(d.detras).forEach(function (b) {
      var y = b.tipo === 'dia' || b.tipo === 'detras' ? 0 : posicion(b.pos || (b.tipo === 'tarjeta' || b.tipo === 'progreso' ? 'abajo' : 'arriba'))[1];
      if (b.tipo === 'cta' && b.y != null) y = b.y;
      if (y < 900 && b.ini < d.iniFirma && b.fin > d.iniFirma - 0.1) b.fin = Math.max(b.ini + 0.3, d.iniFirma - 0.12);
    });

    // efectos
    d.cues = [];
    var cue = function (tipo, t, g) {
      if (t >= 0 && t < d.dur) d.cues.push({
        tipo: tipo,
        t: Math.round(t * 1000) / 1000,
        g: g == null ? 1 : g
      });
    };
    beats.forEach(function (b) {
      if (b.sfx === false) return;
      if (b.tipo === 'dia') {
        cue('whoosh', b.ini - 0.05, 0.4);
        cue('golpe', b.ini + 0.1, 0.5);
      } else if (b.tipo === 'detras') cue('golpe', b.ini, 0.45);else if (b.tipo === 'titulo') cue('whoosh', (b.tiempos ? b.tiempos[1] : b.ini) - 0.05, 0.35);else if (b.tipo === 'numero') {
        cue('golpe', b.ini, 0.4);
        if (b.desde != null) cue('subida', b.ini + 0.05, 0.3);
        if (b.antes != null) cue('error', b.ini + (b.cAntes || 0.5), 0.35);
      } else if (b.tipo === 'tarjeta') {
        cue('pop', b.ini, 0.5);
        if (b.icono === 'check' || b.icono === 'bien') cue('ding', b.ini + 0.18, 0.45);
        if (b.icono === 'equis' || b.icono === 'mal') cue('error', b.ini + 0.18, 0.4);
      } else if (b.tipo === 'lista') b.tiempos.forEach(function (t, i) {
        cue('pop', t, 0.4);
        cue(b.items[i].mal ? 'error' : 'ding', t + 0.12, 0.3);
      });else if (b.tipo === 'emoji') cue('pop', b.ini, 0.45);else if (b.tipo === 'imagen') cue('whoosh', b.ini - 0.05, 0.4);else if (b.tipo === 'etiqueta') {
        cue('click', b.ini, 0.45);
        if (b.tachado) cue('error', b.cTachado == null ? b.ini + 0.45 : b.cTachado, 0.35);
      } else if (b.tipo === 'progreso') {
        cue('pop', b.ini, 0.45);
        cue('subida', b.ini + 0.2, 0.3);
      } else if (b.tipo === 'cta') {
        cue('whoosh', b.ini, 0.4);
        for (var i = 0; i < String(b.palabra).length; i++) cue('click', b.ini + 0.6 + i * 0.09, 0.22);
        cue('pop', b.ini + 0.6 + String(b.palabra).length * 0.09 + 0.35, 0.4);
      } else if (b.tipo === 'capitulo') {
        cue('whoosh', b.ini - T_MARCO * 0.5, 0.6);
        cue('pop', b.ini + 0.1, 0.4);
        cue('whoosh', b.fin - T_MARCO * 0.5, 0.45);
      } else if (b.tipo === 'comparar') {
        cue('whoosh', b.ini - 0.15, 0.6);
        cue('pop', b.ini + 0.1, 0.4);
        cue('pop', b.ini + 0.32, 0.4);
      } else if (b.tipo === 'camara' && (b.mov || 'golpe') === 'golpe') cue('golpe', b.ini, 0.35);else if (b.tipo === 'sonido') cue(b.sfx, b.ini, b.g);else if (b.tipo === 'flash') cue('whoosh', b.ini - 0.1, 0.5);else if (b.tipo === 'sacudida') cue('golpe', b.ini, 0.5);
    });
    if (d.firma) {
      cue('whoosh', d.iniFirma - 0.05, 0.45);
      [0, 1, 2].forEach(function (i) {
        cue('pop', d.iniFirma + 0.12 + i * 0.07, 0.3);
      });
    }
    d.cues.sort(function (a, b) {
      return a.t - b.t;
    });
    return d;
  }
  var REGISTRO = [];
  function registrar(def) {
    REGISTRO.push(def);
  }
  function buscar(id) {
    for (var i = 0; i < REGISTRO.length; i++) if (REGISTRO[i].id === id) return REGISTRO[i];
    return REGISTRO[0];
  }

  /* =========================================================
     LIENZO: todas las capas para un T
     ========================================================= */

  function Lienzo(props) {
    var T = props.T,
      def = props.def;
    var st = estadoCamara(T, def);
    var ex = extras(T, def);
    var km = kMarco(T, def);
    var R = rectCamara(km);
    var detras = def.detras.filter(function (b) {
      return vivo(T, b, 0.35);
    });
    var atenuar = detras.reduce(function (m, b) {
      return Math.max(m, Math.min(k01(T, b.ini - 0.05, 0.3), 1 - k01(T, b.fin, 0.35)));
    }, 0);
    var dibujar = function (b, i) {
      if (b.tipo === 'detras') return /*#__PURE__*/React.createElement(DetrasBeat, {
        key: 'd' + i,
        T: T,
        b: b
      });
      if (b.tipo === 'dia') return /*#__PURE__*/React.createElement(DiaBeat, {
        key: 'd' + i,
        T: T,
        b: b
      });
      if (b.tipo === 'titulo') return /*#__PURE__*/React.createElement(TituloBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'numero') return /*#__PURE__*/React.createElement(NumeroBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'tarjeta') return /*#__PURE__*/React.createElement(TarjetaBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'lista') return /*#__PURE__*/React.createElement(ListaBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'emoji') return /*#__PURE__*/React.createElement(EmojiBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'imagen') return /*#__PURE__*/React.createElement(ImagenBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'etiqueta') return /*#__PURE__*/React.createElement(EtiquetaBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'progreso') return /*#__PURE__*/React.createElement(ProgresoBeat, {
        key: i,
        T: T,
        b: b
      });
      if (b.tipo === 'cta') return /*#__PURE__*/React.createElement(CtaBeat, {
        key: i,
        T: T,
        b: b
      });
      return null;
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        overflow: 'hidden',
        background: NEGRO
      }
    }, /*#__PURE__*/React.createElement(FondoPuntos, {
      T: T,
      op: km > 0.001 ? 1 : 0,
      oscuro: def.capitulos.some(function (b) {
        return b.oscuro && vivo(T, b, T_MARCO);
      })
    }), def.capitulos.map(function (b, i) {
      return /*#__PURE__*/React.createElement(CapituloTitulo, {
        key: 'c' + i,
        T: T,
        b: b
      });
    }), /*#__PURE__*/React.createElement(Camara, {
      T: T,
      def: def,
      R: R,
      st: st,
      ex: ex,
      atenuar: atenuar,
      render: props.render,
      medioRef: props.medioRef
    }), detras.length ? /*#__PURE__*/React.createElement(React.Fragment, null, detras.map(dibujar), /*#__PURE__*/React.createElement(Frente, {
      T: T,
      def: def,
      R: R,
      st: st,
      ex: ex,
      medioRef: props.medioRef
    })) : null, /*#__PURE__*/React.createElement(BordeMarco, {
      R: R
    }), def.encima.map(dibujar), def.comparar.map(function (b, i) {
      return /*#__PURE__*/React.createElement(CompararBeat, {
        key: 'k' + i,
        T: T,
        b: b
      });
    }), /*#__PURE__*/React.createElement(Sello, {
      T: T,
      def: def
    }), /*#__PURE__*/React.createElement(Firma, {
      T: T,
      def: def
    }), /*#__PURE__*/React.createElement(Subtitulos, {
      T: T,
      def: def
    }), /*#__PURE__*/React.createElement(Flash, {
      ex: ex
    }), props.zonas ? /*#__PURE__*/React.createElement(Zonas, null) : null);
  }

  // las zonas que tapan Instagram / TikTok / Shorts (solo en la vista previa)
  function Zonas() {
    var z = {
      position: 'absolute',
      background: 'rgba(224,58,47,0.28)',
      zIndex: 90,
      border: '2px dashed rgba(224,58,47,0.8)',
      boxSizing: 'border-box'
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: Object.assign({
        left: 0,
        top: 0,
        width: ANCHO,
        height: 230
      }, z)
    }), /*#__PURE__*/React.createElement("div", {
      style: Object.assign({
        left: 0,
        top: 1560,
        width: ANCHO,
        height: ALTO - 1560
      }, z)
    }), /*#__PURE__*/React.createElement("div", {
      style: Object.assign({
        left: 900,
        top: 1000,
        width: ANCHO - 900,
        height: 560
      }, z)
    }));
  }

  /* =========================================================
     PAGINA: vista previa (el video es el reloj) o modo render
     ========================================================= */

  function fmt(s) {
    var m = Math.floor(s / 60),
      r = s - 60 * m;
    return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1);
  }
  function useEscala(ref) {
    var _e = useState(0.3);
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
    var _n = useState(0);
    var setVuelta = _n[1];
    var _p = useState(false);
    var playing = _p[0],
      setPlaying = _p[1];
    var _z = useState(false);
    var zonas = _z[0],
      setZonas = _z[1];
    var medioRef = useRef(null);
    var marcoRef = useRef(null);
    var escala = useEscala(marcoRef);
    useEffect(function () {
      if (!render) return;
      global.CAMBIO = {
        total: def.dur,
        video: def.video,
        seek: function (t) {
          PENDIENTES.length = 0;
          setT(t);
          setVuelta(function (v) {
            return v + 1;
          });
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
        precargar: function () {
          var srcs = [];
          def.encima.concat(def.detras).forEach(function (b) {
            if (b.tipo === 'emoji') srcs.push(rutaEmoji(b.n));
            if (b.emoji) srcs.push(rutaEmoji(b.emoji));
            if (b.src) srcs.push(b.src);
            if (b.items) b.items.forEach(function (it) {
              if (it.emoji) srcs.push(rutaEmoji(it.emoji));
            });
          });
          def.comparar.forEach(function (b) {
            srcs.push(b.antes, b.ahora);
          });
          return Promise.all(srcs.filter(Boolean).map(function (s) {
            var im = new Image();
            im.src = s;
            return im.decode ? im.decode().catch(function () {
              console.warn('no carga la imagen', s);
            }) : Promise.resolve();
          }));
        },
        cues: function () {
          return def.cues.slice();
        },
        tramos: function () {
          return {
            recorte: def.detras.map(function (b) {
              return [Math.max(0, b.ini - 0.1), Math.min(def.dur, b.fin + 0.4)];
            })
          };
        },
        bloques: function () {
          return def.bloques.map(function (b) {
            return [b.ini, b.hasta, b.ws.map(function (w) {
              return w.txt;
            }).join(' ')];
          });
        }
      };
    }, [render, def]);
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
      medioRef: medioRef,
      zonas: zonas
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
    var marcas = def.encima.concat(def.detras, def.capitulos, def.comparar).map(function (b, i) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        title: b.tipo,
        className: 'marca' + (b.tipo === 'capitulo' || b.tipo === 'dia' ? ' cap' : ''),
        style: {
          left: 100 * b.ini / def.dur + '%',
          width: Math.max(0.3, 100 * (b.fin - b.ini) / def.dur) + '%'
        }
      });
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "cambio-mesa"
    }, /*#__PURE__*/React.createElement("div", {
      ref: marcoRef,
      className: "cambio-marco",
      style: {
        position: 'relative',
        aspectRatio: '9 / 16',
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
      className: "cambio-lado"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cambio-controles"
    }, /*#__PURE__*/React.createElement("button", {
      className: "cambio-play",
      onClick: alternar
    }, playing ? '❚❚' : '▶'), /*#__PURE__*/React.createElement("span", {
      className: "cambio-tiempo"
    }, fmt(T), " / ", fmt(def.dur)), /*#__PURE__*/React.createElement("label", {
      className: "cambio-zonas"
    }, /*#__PURE__*/React.createElement("input", {
      type: "checkbox",
      checked: zonas,
      onChange: function () {
        setZonas(!zonas);
      }
    }), " zonas que tapan las apps")), /*#__PURE__*/React.createElement("div", {
      className: "cambio-linea",
      onClick: function (ev) {
        var r = ev.currentTarget.getBoundingClientRect();
        ir(def.dur * (ev.clientX - r.left) / r.width);
      }
    }, marcas, /*#__PURE__*/React.createElement("div", {
      className: "cursor",
      style: {
        left: 100 * T / def.dur + '%'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "cambio-dice"
    }, frase ? frase.texto : '—'), /*#__PURE__*/React.createElement("ol", {
      className: "cambio-beats"
    }, def.encima.concat(def.detras, def.capitulos, def.comparar).slice().sort(function (a, b) {
      return a.ini - b.ini;
    }).map(function (b, i) {
      var on = T >= b.ini && T <= b.fin;
      return /*#__PURE__*/React.createElement("li", {
        key: i,
        className: on ? 'on' : '',
        onClick: function () {
          ir(Math.max(0, b.ini - 0.3));
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "t"
      }, fmt(b.ini)), " ", /*#__PURE__*/React.createElement("b", null, b.tipo), " ", b.txt || b.texto || b.titulo || b.n || b.palabra || (b.items ? b.items.map(function (x) {
        return x.texto;
      }).join(', ') : '') || (b.valor != null ? b.valor + ' ' + (b.unidad || '') : ''));
    }))));
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
    }, "No hay videos: falta cambios/", ruta.id || '<id>', "/plan.js (node compilar.js) o el #id en la direcci\xF3n.");
    var def = preparados[crudo.id] || (preparados[crudo.id] = preparar(crudo));
    if (ruta.render) return /*#__PURE__*/React.createElement(Vista, {
      key: def.id + ':r',
      def: def,
      render: true
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "cambio"
    }, /*#__PURE__*/React.createElement("header", {
      className: "cambio-cabecera"
    }, /*#__PURE__*/React.createElement("div", {
      className: "marca"
    }, def.titulo), /*#__PURE__*/React.createElement("nav", {
      className: "videos"
    }, (global.CAMBIOS_LISTA || REGISTRO).map(function (d) {
      return /*#__PURE__*/React.createElement("a", {
        key: d.id,
        href: '#' + d.id,
        className: d.id === def.id ? 'actual' : ''
      }, d.titulo || d.id);
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, "vertical 1080\xD71920 \xB7 el video manda el tiempo \xB7 amarillo = lo que entra encima, rojo = apertura y cap\xEDtulos")), /*#__PURE__*/React.createElement(Vista, {
      key: def.id,
      def: def
    }));
  }
  function montar() {
    ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
  }
  global.CAMBIOS = {
    ANCHO: ANCHO,
    ALTO: ALTO,
    FPS: FPS,
    COLOR: COLOR,
    F: F,
    F_IMPACTO: F_IMPACTO,
    F_MANO: F_MANO,
    POS: POS,
    EMOJI: EMOJI,
    rutaEmoji: rutaEmoji,
    registrar: registrar,
    buscar: buscar,
    montar: montar,
    lista: function () {
      return REGISTRO.slice();
    },
    plan: plan,
    buscador: buscador,
    preparar: preparar,
    armarBloques: armarBloques,
    E: {
      Caja: Caja,
      Emoji: Emoji,
      Pastilla: Pastilla,
      Signo: Signo,
      TextoChico: TextoChico,
      TextoTinta: TextoTinta,
      LineaGigante: LineaGigante,
      Logo: Logo
    },
    mov: {
      entra: entra,
      sale: sale,
      junta: junta,
      deriva: deriva,
      back: back,
      k01: k01,
      hash: hash,
      norm: norm
    }
  };
})(window);
