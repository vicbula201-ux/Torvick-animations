/* ============================================================
   LARGO — window.LARGOS: la edicion de los videos largos de YouTube (16:9)

   El video con los cortes finales es la base y encima se apilan capas que se
   calculan desde un unico T = segundo del video (la voz manda el tiempo):

     camara   el video con encuadres (plano, primer plano, golpe de zoom,
              empuje lento), blanco y negro y desenfoque
     escenas  explicaciones a pantalla completa (papel, negro, pizarra) que
              entran y salen con el barrido amarillo, la firma del estilo
     encima   textos clave, stickers, etiquetas, cajas, CTA de suscripcion

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
  var useRef = React.useRef;
  var M = global.M;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;

  var ANCHO = 1920, ALTO = 1080;
  var INK = '#14110F', YEL = '#FFD400', RED = '#E03A2F', GRN = '#16A06A', GRY = '#C9C3B8';
  var BLANCO = '#FFFFFF', PAPEL = '#FFFFFF';
  var COLOR = { amarillo: YEL, blanco: BLANCO, rojo: RED, verde: GRN, gris: GRY, negro: INK };
  var F_TITULO = "'Barlow Condensed', 'Barlow Semi Condensed', sans-serif";
  var F_ROTULO = "'Barlow Semi Condensed', sans-serif";
  var F_NUM = "'Archivo Black', sans-serif";
  var BARRIDO = 0.42;             // segundos que tarda el barrido amarillo en cruzar
  var BANDA = 230, INCLINA = 120; // ancho de la banda y media inclinacion (px)

  function col(c, def) { return COLOR[c] || c || def; }

  // pseudoazar estable: el mismo texto da siempre el mismo giro
  function hash(s) {
    var h = 2166136261;
    s = String(s);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0) / 4294967295;
  }

  function norm(p) {
    return String(p).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]/g, '');
  }

  /* =========================================================
     MOVIMIENTO: entradas y salidas del estilo
     ========================================================= */

  // entrada con golpe: aparece chica, se pasa de tamano y asienta
  function golpe(T, c, dur) {
    if (dur == null) dur = 0.34;
    var p = clamp((T - c) / dur, 0, 1);
    return {
      opacity: clamp((T - c) / 0.07, 0, 1),
      scale: 0.25 + 0.75 * Easing.easeOutBack(p),
      giro: 1 - Easing.easeOutCubic(p)
    };
  }

  // salida: se achica y se apaga (nada se va de golpe)
  function fuera(T, s, dur) {
    if (s == null) return { opacity: 1, scale: 1 };
    if (dur == null) dur = 0.16;
    var k = 1 - clamp((T - s) / dur, 0, 1);
    return { opacity: k, scale: 0.6 + 0.4 * k };
  }

  // cae desde arriba y rebota
  function cae(T, c, dur) {
    if (dur == null) dur = 0.5;
    var p = clamp((T - c) / dur, 0, 1);
    var y = -520 * (1 - Easing.easeOutBack(p));
    return { opacity: clamp((T - c) / 0.06, 0, 1), scale: 1, dy: y, giro: 1 - p };
  }

  // entra desde un costado (desde < 0: izquierda)
  function desliza(T, c, desde, dur) {
    if (dur == null) dur = 0.4;
    var p = clamp((T - c) / dur, 0, 1);
    return { opacity: clamp((T - c) / 0.08, 0, 1), scale: 1, dx: desde * (1 - Easing.easeOutBack(p)), giro: 0 };
  }

  function junta(a, b) {
    return { opacity: a.opacity * b.opacity, scale: a.scale * b.scale, dx: a.dx || 0, dy: a.dy || 0, giro: a.giro || 0 };
  }

  // caja absoluta posicionada por su centro
  function Centro(props) {
    var e = props.e || { opacity: 1, scale: 1 };
    var dx = (props.dx || 0) + (e.dx || 0), dy = (props.dy || 0) + (e.dy || 0);
    var rot = (props.rot || 0) + (e.giro || 0) * (props.giroEntrada == null ? -9 : props.giroEntrada);
    var sc = (e.scale == null ? 1 : e.scale) * (props.esc || 1);
    if (e.opacity <= 0.001) return null;
    var ancla = props.ancla === 'izq' ? 'translate(0,-50%)' : 'translate(-50%,-50%)';
    return (
      <div style={{
        position: 'absolute', left: props.x, top: props.y, opacity: e.opacity,
        transform: ancla + ' translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) rotate(' +
          rot.toFixed(2) + 'deg) scale(' + sc.toFixed(4) + ')',
        transformOrigin: props.ancla === 'izq' ? '0 50%' : '50% 50%', zIndex: props.z || 'auto'
      }}>{props.children}</div>
    );
  }

  /* =========================================================
     SONIDOS: cada beat marca sus efectos; la pista la arma
     herramientas/audio.py (pop, whoosh, ding, error, boom, click,
     tecla, campana, subida)
     ========================================================= */

  var CUES = {};
  function sonido(tipo, t, g) {
    if (t == null || !(t >= 0)) return;
    var k = tipo + '@' + t.toFixed(3);
    if (!CUES[k]) CUES[k] = { tipo: tipo, t: Math.round(t * 1000) / 1000, g: g == null ? 1 : g };
  }
  function listaCues() {
    return Object.keys(CUES).map(function (k) { return CUES[k]; }).sort(function (a, b) { return a.t - b.t; });
  }

  /* =========================================================
     STICKERS: Fluent Emoji (Microsoft, MIT) troquelados — borde blanco,
     contorno de tinta y sombra dura. Los cuerpos SVG estan en
     largos/stickers.js (lo genera herramientas/stickers.js).
     ========================================================= */

  var uid = 0;
  function Sticker(props) {
    var ref = useRef(null);
    if (ref.current == null) ref.current = 'stk' + (uid++);
    var tam = props.tam || 240;
    var cuerpo = (global.STICKERS || {})[props.n];
    if (!cuerpo) {
      if (global.console && !Sticker.avisados[props.n]) { Sticker.avisados[props.n] = 1; console.warn('falta el sticker', props.n); }
      cuerpo = '<circle cx="16" cy="16" r="14" fill="#C9C3B8"/><text x="16" y="22" font-size="16" text-anchor="middle" fill="#14110F">?</text>';
    }
    var id = ref.current;
    var borde = props.borde === false ? null : (
      '<filter id="' + id + '" x="-30%" y="-30%" width="160%" height="160%">' +
      '<feMorphology in="SourceAlpha" operator="dilate" radius="1.5" result="d1"/>' +
      '<feFlood flood-color="#ffffff"/><feComposite in2="d1" operator="in" result="bl"/>' +
      '<feMorphology in="SourceAlpha" operator="dilate" radius="2.0" result="d2"/>' +
      '<feFlood flood-color="' + INK + '"/><feComposite in2="d2" operator="in" result="ng"/>' +
      '<feOffset in="ng" dx="0" dy="1.1" result="sb"/>' +
      '<feMerge><feMergeNode in="sb"/><feMergeNode in="ng"/><feMergeNode in="bl"/><feMergeNode in="SourceGraphic"/></feMerge>' +
      '</filter>');
    var html = (borde ? '<defs>' + borde + '</defs><g filter="url(#' + id + ')">' : '<g>') + cuerpo + '</g>';
    return (
      <svg width={tam} height={tam} viewBox="-3 -3 38 38"
        style={{ display: 'block', overflow: 'visible' }}
        dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
  Sticker.avisados = {};

  /* =========================================================
     TEXTOS
     ========================================================= */

  // texto con contorno grueso y sombra dura (el texto clave del estilo)
  function estiloTitulo(fs, color, trazo) {
    var c = col(color, BLANCO);
    var conTrazo = trazo !== false && c !== INK;
    return {
      fontFamily: F_TITULO, fontWeight: 900, fontStyle: 'italic', fontSize: fs, lineHeight: 0.98,
      color: c, letterSpacing: '0.01em', whiteSpace: 'nowrap', textAlign: 'center',
      WebkitTextStroke: conTrazo ? (fs * 0.16).toFixed(1) + 'px ' + INK : undefined,
      paintOrder: 'stroke fill',
      filter: conTrazo ? 'drop-shadow(0 ' + (fs * 0.075).toFixed(1) + 'px 0 ' + INK + ')' : undefined
    };
  }

  // rotulo negro con flechita, como el de las escenas de pizarra
  function Rotulo(props) {
    var fs = 44 * (props.tam || 1);
    var dir = props.dir || 'izq';
    var flecha = dir === 'izq' ? '◀ ' : '';
    var flechaDer = dir === 'der' ? ' ▶' : '';
    return (
      <div style={{
        fontFamily: F_ROTULO, fontWeight: 700, fontSize: fs, color: BLANCO, background: props.fondo || INK,
        padding: (fs * 0.18) + 'px ' + (fs * 0.5) + 'px ' + (fs * 0.24) + 'px', borderRadius: fs * 0.28,
        letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap', lineHeight: 1.05
      }}>{flecha}{props.children}{flechaDer}</div>
    );
  }

  // caja amarilla con borde de tinta: la idea que hay que llevarse
  function CajaTexto(props) {
    var fs = 96 * (props.tam || 1);
    var fondo = col(props.fondo, YEL);
    return (
      <div style={{
        fontFamily: F_TITULO, fontWeight: 900, fontStyle: 'italic', fontSize: fs, lineHeight: 1,
        color: col(props.color, INK), background: fondo, border: (fs * 0.09) + 'px solid ' + INK,
        borderRadius: fs * 0.22, padding: (fs * 0.04) + 'px ' + (fs * 0.28) + 'px ' + (fs * 0.1) + 'px',
        boxShadow: '0 ' + (fs * 0.1) + 'px 0 ' + INK, whiteSpace: 'nowrap', textAlign: 'center'
      }}>{props.children}</div>
    );
  }

  // posiciones con nombre (centro del bloque) pensadas para no tapar la cara
  var POS = {
    abajo: [960, 905], arriba: [960, 150], centro: [960, 540],
    izq: [430, 470], der: [1490, 470], arribaizq: [420, 200], arribader: [1500, 200],
    abajoizq: [520, 900], abajoder: [1400, 900]
  };
  function posicion(p) {
    if (Array.isArray(p)) return p;
    return POS[p] || POS.abajo;
  }

  // un texto clave sobre la camara. estilo: golpe (todo junto) | palabras (al ritmo
  // de la voz) | caja (amarilla) | rotulo (etiqueta negra)
  function TextoClave(props) {
    var T = props.T, b = props.b;
    if (T < b.ini - 0.02 || T > b.fin + 0.2) return null;
    var tam = b.tam || 1;
    var xy = posicion(b.pos);
    var rot = b.rot != null ? b.rot : (hash(b.txt) - 0.5) * 6;
    var vida = M.life(T, 3.2, 4 * tam, hash(b.txt));
    var sale = fuera(T, b.fin);
    var txt = String(b.txt);
    var estilo = b.estilo || 'golpe';

    if (estilo === 'caja' || estilo === 'rotulo') {
      var e = junta(golpe(T, b.ini), sale);
      return (
        <Centro x={xy[0]} y={xy[1]} e={e} rot={rot} dy={vida}>
          {estilo === 'caja'
            ? <CajaTexto tam={tam} fondo={b.fondo} color={b.color}>{txt.toUpperCase()}</CajaTexto>
            : <Rotulo tam={tam} dir={b.dir}>{txt}</Rotulo>}
        </Centro>
      );
    }

    var fs = 116 * tam;
    var base = col(b.color, BLANCO);
    var acento = col(b.acento, base === YEL ? BLANCO : YEL);
    var marcadas = (b.marcadas || []).map(norm);
    var lineas = txt.toUpperCase().split('\n');
    var k = 0;
    var filas = lineas.map(function (ln, li) {
      var pals = ln.split(' ').filter(Boolean);
      return (
        <div key={li} style={{ display: 'flex', justifyContent: 'center', gap: fs * 0.22 }}>
          {pals.map(function (p, pi) {
            var i = k++;
            var c = estilo === 'palabras' && b.tiempos ? b.tiempos[i] : b.ini;
            var e = golpe(T, c, 0.28);
            if (e.opacity <= 0) return <span key={pi} style={{ opacity: 0 }}>{p}</span>;
            var color = marcadas.indexOf(norm(p)) >= 0 ? acento : base;
            return (
              <span key={pi} style={Object.assign(estiloTitulo(fs, color), {
                display: 'inline-block', opacity: e.opacity,
                transform: 'scale(' + e.scale.toFixed(4) + ') rotate(' + (e.giro * -6).toFixed(2) + 'deg)'
              })}>{p}</span>
            );
          })}
        </div>
      );
    });
    return (
      <Centro x={xy[0]} y={xy[1]} e={sale} rot={rot} dy={vida} giroEntrada={0}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: fs * 0.02 }}>{filas}</div>
      </Centro>
    );
  }

  function StickerBeat(props) {
    var T = props.T, b = props.b;
    if (T < b.ini - 0.02 || T > b.fin + 0.2) return null;
    var xy = posicion(b.pos || 'der');
    var entra = b.entra === 'cae' ? cae(T, b.ini) : b.entra === 'lado'
      ? desliza(T, b.ini, xy[0] < ANCHO / 2 ? -700 : 700) : golpe(T, b.ini, 0.4);
    var e = junta(entra, fuera(T, b.fin, 0.18));
    var fase = hash(b.n + b.ini);
    var rot = (b.rot != null ? b.rot : (fase - 0.5) * 16) + M.life(T, 3.6, 2.5, fase);
    return (
      <Centro x={xy[0]} y={xy[1]} e={e} rot={rot} dy={M.life(T, 2.6, 7, fase)} giroEntrada={-14}>
        <Sticker n={b.n} tam={b.tam || 260} />
      </Centro>
    );
  }

  // imagen propia (captura de un estudio, foto): tarjeta con borde de tinta que entra
  // con golpe y flota; 'completa' llena la pantalla con un acercamiento lento.
  // resaltar: [{ x, y, w, h, c }] en fraccion de la imagen, se pinta de amarillo en c
  function ImagenBeat(props) {
    var T = props.T, b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.25) return null;
    if (b.estilo === 'completa') {
      var k = clamp((T - b.ini) / Math.max(0.1, b.fin - b.ini), 0, 1);
      var op = Math.min(clamp((T - b.ini) / 0.15, 0, 1), clamp((b.fin + 0.15 - T) / 0.15, 0, 1));
      return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity: op, background: INK }}>
          <img src={b.src} alt="" style={{ width: ANCHO, height: ALTO, objectFit: b.ajuste || 'cover',
            transform: 'scale(' + (1.02 + 0.06 * k).toFixed(4) + ')' }} />
        </div>
      );
    }
    var xy = posicion(b.pos || 'centro');
    var e = junta(golpe(T, b.ini, 0.4), fuera(T, b.fin, 0.2));
    var w = b.ancho || 900;
    var rot = b.rot != null ? b.rot : (hash(b.src) - 0.5) * 5;
    return (
      <Centro x={xy[0]} y={xy[1]} e={e} rot={rot} dy={M.life(T, 4, 4, hash(b.src))}>
        <div style={{ background: BLANCO, border: '10px solid ' + INK, borderRadius: 26, boxShadow: '0 12px 0 ' + INK,
          padding: b.estilo === 'polaroid' ? '22px 22px 18px' : 14, width: w }}>
          <div style={{ position: 'relative' }}>
            <img src={b.src} alt="" style={{ display: 'block', width: '100%', borderRadius: 12 }} />
            {(b.resaltar || []).map(function (r, i) {
              var p = M.draw(T, r.c, 0.45);
              if (p <= 0) return null;
              return <div key={i} style={{ position: 'absolute', left: (r.x * 100) + '%', top: (r.y * 100) + '%',
                width: (r.w * 100 * p) + '%', height: (r.h * 100) + '%', background: YEL, mixBlendMode: 'multiply', borderRadius: 4 }} />;
            })}
          </div>
          {b.pie ? <div style={{ fontFamily: F_TITULO, fontWeight: 900, fontStyle: 'italic', fontSize: 52, color: INK,
            textAlign: 'center', marginTop: 12, lineHeight: 1 }}>{b.pie}</div> : null}
        </div>
      </Centro>
    );
  }

  /* =========================================================
     CAMARA: encuadre del video segun los beats 'camara'
     zoom 1 = el plano tal cual; foco = punto del cuadro (0..1) que queda al centro
     mov: corte | suave | empuje | golpe
     ========================================================= */

  function estadoCamara(T, def) {
    var base = def.encuadre || {};
    var z0 = base.zoom || 1, f0 = base.foco || [0.5, 0.5];
    var st = { zoom: z0, fx: f0[0], fy: f0[1], bn: 0, desenfoque: 0, oscuro: 0, dx: 0, dy: 0 };
    var cams = def.camaras;
    for (var i = 0; i < cams.length; i++) {
      var c = cams[i];
      if (T < c.ini || T >= c.fin) continue;
      var z = c.zoom == null ? z0 : c.zoom;
      var f = c.foco || f0;
      var k = 1;
      if (c.mov === 'suave') {
        k = Math.min(Easing.easeInOutCubic(clamp((T - c.ini) / 0.5, 0, 1)),
          Easing.easeInOutCubic(clamp((c.fin - T) / 0.5, 0, 1)));
      } else if (c.mov === 'golpe') {
        k = Easing.easeOutCubic(clamp((T - c.ini) / 0.14, 0, 1));
      }
      if (c.mov === 'empuje') {
        var u = clamp((T - c.ini) / Math.max(0.1, c.fin - c.ini), 0, 1);
        z = z * (1 + (c.cuanto == null ? 0.09 : c.cuanto) * Easing.easeInOutSine(u));
      }
      st.zoom = z0 + (z - z0) * k;
      st.fx = f0[0] + (f[0] - f0[0]) * k;
      st.fy = f0[1] + (f[1] - f0[1]) * k;
      st.bn = c.bn ? k : 0;
      st.desenfoque = (c.desenfoque || 0) * k;
      st.oscuro = (c.oscuro || 0) * k;
      if (c.mov === 'golpe' && c.temblor !== false) {
        var d = Math.exp(-(T - c.ini) / 0.12) * 14;
        st.dx = Math.sin(T * 91) * d;
        st.dy = Math.cos(T * 73) * d;
      }
    }
    // sacudidas sueltas (impactos)
    def.sacudidas.forEach(function (s) {
      if (T < s.t || T > s.t + 0.5) return;
      var d = Math.exp(-(T - s.t) / 0.1) * (s.fuerza || 16);
      st.dx += Math.sin(T * 97) * d;
      st.dy += Math.cos(T * 79) * d;
    });
    return st;
  }

  function transformeCamara(st) {
    var z = Math.max(1, st.zoom);
    var cx = clamp(st.fx, 0.5 / z, 1 - 0.5 / z);
    var cy = clamp(st.fy, 0.5 / z, 1 - 0.5 / z);
    var tx = ANCHO / 2 - cx * ANCHO * z + st.dx;
    var ty = ALTO / 2 - cy * ALTO * z + st.dy;
    return 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + z.toFixed(4) + ')';
  }

  function Camara(props) {
    var st = estadoCamara(props.T, props.def);
    var filtros = [];
    if (st.bn > 0) filtros.push('grayscale(' + st.bn.toFixed(2) + ') contrast(' + (1 + 0.15 * st.bn).toFixed(2) + ')');
    if (st.desenfoque > 0) filtros.push('blur(' + st.desenfoque.toFixed(1) + 'px)');
    if (st.oscuro > 0) filtros.push('brightness(' + (1 - st.oscuro).toFixed(2) + ')');
    var estiloMedio = { position: 'absolute', left: 0, top: 0, width: ANCHO, height: ALTO, objectFit: 'cover', display: 'block' };
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: INK }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, width: ANCHO, height: ALTO, transformOrigin: '0 0',
          transform: transformeCamara(st), filter: filtros.length ? filtros.join(' ') : undefined
        }}>
          {props.render
            ? <img ref={props.medioRef} style={estiloMedio} alt="" />
            : <video ref={props.medioRef} src={props.def.video} style={estiloMedio} playsInline preload="auto" />}
        </div>
      </div>
    );
  }

  /* =========================================================
     BARRIDO AMARILLO: la transicion de la casa
     La banda cruza de izquierda a derecha; lo nuevo queda detras (a la izquierda).
     ========================================================= */

  function bordeBarrido(p) {
    return -BANDA - INCLINA + (ANCHO + BANDA + 2 * INCLINA) * Easing.easeInOutCubic(clamp(p, 0, 1));
  }

  function Banda(props) {
    var xa = props.xa, s = INCLINA, bw = BANDA;
    var pts = (xa + s) + ',0 ' + (xa + bw + s) + ',0 ' + (xa + bw - s) + ',' + ALTO + ' ' + (xa - s) + ',' + ALTO;
    var negra = (xa + bw + s) + ',0 ' + (xa + bw + s + 34) + ',0 ' + (xa + bw - s + 34) + ',' + ALTO + ' ' + (xa + bw - s) + ',' + ALTO;
    return (
      <svg width={ANCHO} height={ALTO} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        <polygon points={negra} fill={INK} />
        <polygon points={pts} fill={YEL} stroke={INK} strokeWidth={12} strokeLinejoin="round" />
      </svg>
    );
  }

  // recorte del lado ya revelado (izquierda del borde) o del lado que queda (derecha)
  function recorte(xa, lado) {
    var s = INCLINA;
    if (lado === 'izq') {
      return 'polygon(0px 0px, ' + (xa + s).toFixed(1) + 'px 0px, ' + (xa - s).toFixed(1) + 'px ' + ALTO + 'px, 0px ' + ALTO + 'px)';
    }
    var xb = xa + BANDA;
    return 'polygon(' + (xb + s).toFixed(1) + 'px 0px, ' + ANCHO + 'px 0px, ' + ANCHO + 'px ' + ALTO + 'px, ' + (xb - s).toFixed(1) + 'px ' + ALTO + 'px)';
  }

  // ventana de cada transicion (segundos antes y despues del borde)
  var VENTANA = { barrido: BARRIDO / 2, pop: 0.2, empuje: 0.2, fundido: 0.14, corte: 0 };

  // escenas a pantalla completa con su entrada y salida:
  // barrido (banda amarilla) | empuje (entra de costado) | pop | fundido | corte
  function CapaEscenas(props) {
    var T = props.T, def = props.def;
    var capas = [], bandas = [];
    def.pantallas.forEach(function (b, i) {
      var entra = b.entra || 'barrido', sale = b.sale || 'barrido';
      var he = VENTANA[entra] || 0, hs = VENTANA[sale] || 0;
      var desde = entra === 'pop' ? b.ini : b.ini - he;
      var hasta = sale === 'pop' ? b.fin : b.fin + hs;
      if (T < desde || T >= hasta) return;
      var estilo = { position: 'absolute', left: 0, top: 0, width: ANCHO, height: ALTO, overflow: 'hidden' };
      var u;
      if (entra !== 'corte' && T < b.ini + he) {
        u = clamp((T - (b.ini - he)) / (2 * he), 0, 1);
        if (entra === 'barrido') {
          var xa = bordeBarrido(u);
          estilo.clipPath = recorte(xa, 'izq');
          bandas.push(<Banda key={'e' + i} xa={xa} />);
        } else if (entra === 'empuje') {
          estilo.transform = 'translateX(' + (ANCHO * (1 - Easing.easeInOutCubic(u))).toFixed(1) + 'px)';
        } else if (entra === 'pop') {
          var k = Easing.easeOutCubic(clamp((T - b.ini) / he, 0, 1));
          estilo.opacity = k;
          estilo.transform = 'scale(' + (0.86 + 0.14 * k).toFixed(4) + ')';
        } else if (entra === 'fundido') {
          estilo.opacity = u;
        }
      } else if (sale !== 'corte' && T >= b.fin - hs) {
        u = clamp((T - (b.fin - hs)) / (2 * hs), 0, 1);
        if (sale === 'barrido') {
          var xs = bordeBarrido(u);
          estilo.clipPath = recorte(xs, 'der');
          bandas.push(<Banda key={'s' + i} xa={xs} />);
        } else if (sale === 'empuje') {
          estilo.transform = 'translateX(' + (-ANCHO * Easing.easeInOutCubic(u)).toFixed(1) + 'px)';
        } else if (sale === 'pop') {
          var q = clamp((T - (b.fin - hs)) / hs, 0, 1);
          estilo.opacity = 1 - q;
          estilo.transform = 'scale(' + (1 + 0.06 * q).toFixed(4) + ')';
        } else if (sale === 'fundido') {
          estilo.opacity = 1 - u;
        }
      }
      var C = b.C;
      capas.push(
        <div key={i} style={estilo}>
          <C T={T} at={b.ini} dur={b.fin - b.ini} {...(b.props || {})} />
        </div>
      );
    });
    return <React.Fragment>{capas}{bandas}</React.Fragment>;
  }

  /* =========================================================
     KIT DE ESCENAS (LARGOS.E) — piezas posicionadas por su centro en
     el lienzo de 1920x1080. c = cuando entra, s = cuando sale (opcional).
     Todas entran con golpe/pop y respiran con M.life.
     ========================================================= */

  function Papel(props) {
    var fondo = props.fondo || 'papel';
    var bg = fondo === 'negro' ? INK : fondo === 'amarillo' ? YEL : fondo === 'pizarra' ? '#21372F' : PAPEL;
    var puntos = fondo === 'papel' || fondo === 'amarillo';
    return (
      <div style={{ position: 'absolute', inset: 0, background: bg, overflow: 'hidden' }}>
        {puntos ? (
          <svg width={ANCHO} height={ALTO} style={{ position: 'absolute', left: 0, top: 0 }}>
            <defs>
              <pattern id="puntos" width="48" height="48" patternUnits="userSpaceOnUse">
                <circle cx="24" cy="24" r="2.4" fill={INK} opacity={fondo === 'amarillo' ? 0.1 : 0.07} />
              </pattern>
            </defs>
            <rect width={ANCHO} height={ALTO} fill="url(#puntos)" />
          </svg>
        ) : null}
        {fondo === 'pizarra' ? (
          <div style={{ position: 'absolute', inset: 0, border: '34px solid #8A5A32', boxShadow: 'inset 0 0 0 8px ' + INK }} />
        ) : null}
        {props.children}
      </div>
    );
  }

  function EntradaSalida(T, c, s, tipo, x) {
    var e = tipo === 'cae' ? cae(T, c) : tipo === 'lado' ? desliza(T, c, x < ANCHO / 2 ? -600 : 600) : golpe(T, c, 0.38);
    return junta(e, fuera(T, s));
  }

  function St(props) {
    var T = props.T;
    if (!props.mudo) sonido('pop', props.c, 0.7);
    var fase = hash(props.n + props.x + props.y);
    var e = EntradaSalida(T, props.c, props.s, props.entra, props.x);
    var rot = (props.rot || 0) + (props.quieto ? 0 : M.life(T, 3.8, 2.2, fase));
    return (
      <Centro x={props.x} y={props.y} e={e} rot={rot} dy={props.quieto ? 0 : M.life(T, 2.8, 6, fase)} giroEntrada={-14}>
        <Sticker n={props.n} tam={props.tam || 240} borde={props.borde} />
      </Centro>
    );
  }

  // texto en escena. color negro = tinta sin contorno; otros colores llevan contorno y sombra
  function Tx(props) {
    var T = props.T;
    var fs = 96 * (props.tam || 1);
    var e = EntradaSalida(T, props.c, props.s, props.entra, props.x);
    var estilo = estiloTitulo(fs, props.color || 'negro', props.trazo);
    if (props.ancho) { estilo.whiteSpace = 'normal'; estilo.width = props.ancho; }
    if (props.normal) estilo.fontStyle = 'normal';
    if (props.alinear) estilo.textAlign = props.alinear;
    var vida = props.quieto ? 0 : M.life(T, 3.4, 3, hash(String(props.children)));
    var rot = props.rot || 0;
    return (
      <Centro x={props.x} y={props.y} e={e} rot={rot} dy={vida} ancla={props.ancla}>
        <div style={estilo}>{props.children}</div>
      </Centro>
    );
  }

  function Rot(props) {
    var T = props.T;
    var e = EntradaSalida(T, props.c, props.s, props.entra || 'pop', props.x);
    return (
      <Centro x={props.x} y={props.y} e={e} rot={props.rot || 0} dy={M.life(T, 3.6, 3, hash(String(props.children)))}>
        <Rotulo tam={props.tam} dir={props.dir} fondo={props.fondo}>{props.children}</Rotulo>
      </Centro>
    );
  }

  function Caja(props) {
    var T = props.T;
    var e = EntradaSalida(T, props.c, props.s, props.entra, props.x);
    if (!props.mudo) sonido('pop', props.c, 0.8);
    return (
      <Centro x={props.x} y={props.y} e={e} rot={props.rot == null ? -2.5 : props.rot} dy={M.life(T, 3.2, 4, 0.3)}>
        <CajaTexto tam={props.tam} fondo={props.fondo} color={props.color}>{props.children}</CajaTexto>
      </Centro>
    );
  }

  // texto con trazo de resaltador detras (se pinta de izquierda a derecha)
  function Resalta(props) {
    var T = props.T;
    var fs = 92 * (props.tam || 1);
    var e = EntradaSalida(T, props.c, props.s, 'pop', props.x);
    var p = M.draw(T, props.c + 0.12, 0.45);
    var color = col(props.color, YEL);
    return (
      <Centro x={props.x} y={props.y} e={e} rot={props.rot || -1.5} dy={M.life(T, 3.4, 3, 0.7)}>
        <div style={{ position: 'relative', padding: '0 ' + (fs * 0.18) + 'px' }}>
          <div style={{
            position: 'absolute', left: 0, top: '48%', height: '44%', width: (p * 100).toFixed(1) + '%',
            background: color, borderRadius: fs * 0.12, transform: 'rotate(-1.2deg)'
          }} />
          <div style={Object.assign(estiloTitulo(fs, 'negro'), { position: 'relative' })}>{props.children}</div>
        </div>
      </Centro>
    );
  }

  // flecha que se dibuja sola; curva > 0 la arquea
  function Flecha(props) {
    var T = props.T;
    var a = props.de, b = props.a, k = props.curva || 0;
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.sqrt(dx * dx + dy * dy) || 1;
    var cx = mx - dy / L * k, cy = my + dx / L * k;
    var largo = 0, px = a[0], py = a[1];
    for (var i = 1; i <= 24; i++) {
      var u = i / 24;
      var qx = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * cx + u * u * b[0];
      var qy = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * cy + u * u * b[1];
      largo += Math.sqrt((qx - px) * (qx - px) + (qy - py) * (qy - py)); px = qx; py = qy;
    }
    var p = M.draw(T, props.c, props.dur || 0.42);
    var sale = fuera(T, props.s);
    if (p <= 0 || sale.opacity <= 0) return null;
    var ang = Math.atan2(b[1] - cy, b[0] - cx);
    var g = props.grosor || 14, cabeza = g * 2.6;
    var color = col(props.color, INK);
    var p1 = [b[0] - cabeza * Math.cos(ang - 0.5), b[1] - cabeza * Math.sin(ang - 0.5)];
    var p2 = [b[0] - cabeza * Math.cos(ang + 0.5), b[1] - cabeza * Math.sin(ang + 0.5)];
    var pc = clamp((p - 0.85) / 0.15, 0, 1);
    return (
      <svg width={ANCHO} height={ALTO} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: sale.opacity }}>
        <path d={'M ' + a[0] + ' ' + a[1] + ' Q ' + cx + ' ' + cy + ' ' + b[0] + ' ' + b[1]}
          fill="none" stroke={color} strokeWidth={g} strokeLinecap="round"
          strokeDasharray={largo} strokeDashoffset={largo * (1 - p)} />
        {pc > 0 ? (
          <path d={'M ' + p1[0] + ' ' + p1[1] + ' L ' + b[0] + ' ' + b[1] + ' L ' + p2[0] + ' ' + p2[1]}
            fill="none" stroke={color} strokeWidth={g} strokeLinecap="round" strokeLinejoin="round" opacity={pc} />
        ) : null}
      </svg>
    );
  }

  function Signo(props) {
    var T = props.T;
    var e = EntradaSalida(T, props.c, props.s, 'pop', props.x);
    var fs = 150 * (props.tam || 1);
    return (
      <Centro x={props.x} y={props.y} e={e} dy={M.life(T, 3, 4, 0.2)}>
        <div style={{
          fontFamily: F_NUM, fontSize: fs, color: col(props.color, INK), lineHeight: 1,
          WebkitTextStroke: props.color && props.color !== 'negro' ? (fs * 0.07) + 'px ' + INK : undefined,
          paintOrder: 'stroke fill'
        }}>{props.t}</div>
      </Centro>
    );
  }

  // visto verde en circulo: suena "ding"
  function Check(props) {
    var T = props.T, tam = props.tam || 140;
    if (!props.mudo) sonido('ding', props.c);
    var e = junta(golpe(T, props.c, 0.4), fuera(T, props.s));
    var p = M.draw(T, props.c + 0.08, 0.35);
    return (
      <Centro x={props.x} y={props.y} e={e} dy={M.life(T, 2.8, 5, 0.4)}>
        <svg width={tam} height={tam} viewBox="0 0 120 120" style={{ display: 'block', overflow: 'visible' }}>
          <circle cx="60" cy="64" r="50" fill={INK} />
          <circle cx="60" cy="58" r="50" fill={GRN} stroke={INK} strokeWidth="9" />
          <path d="M 36 60 L 54 78 L 86 40" fill="none" stroke={BLANCO} strokeWidth="14" strokeLinecap="round"
            strokeLinejoin="round" strokeDasharray="90" strokeDashoffset={90 * (1 - p)} />
        </svg>
      </Centro>
    );
  }

  // X roja que vibra: suena "error"
  function Tacha(props) {
    var T = props.T, tam = props.tam || 140;
    if (!props.mudo) sonido('error', props.c);
    var e = junta(golpe(T, props.c, 0.4), fuera(T, props.s));
    return (
      <Centro x={props.x} y={props.y} e={e} dx={M.vibra(T, 44, 3)}>
        <svg width={tam} height={tam} viewBox="0 0 120 120" style={{ display: 'block', overflow: 'visible' }}>
          <circle cx="60" cy="64" r="50" fill={INK} />
          <circle cx="60" cy="58" r="50" fill={RED} stroke={INK} strokeWidth="9" />
          <path d="M 40 38 L 80 78 M 80 38 L 40 78" fill="none" stroke={BLANCO} strokeWidth="14" strokeLinecap="round" />
        </svg>
      </Centro>
    );
  }

  // tachon rojo encima de algo (una linea que se dibuja)
  function Tachon(props) {
    var T = props.T;
    if (!props.mudo) sonido('error', props.c, 0.8);
    var p = M.draw(T, props.c, 0.25);
    var w = props.w || 400;
    if (p <= 0) return null;
    return (
      <div style={{
        position: 'absolute', left: props.x - w / 2, top: props.y - 9, width: w * p, height: 18,
        background: RED, borderRadius: 9, transform: 'rotate(' + (props.rot == null ? -6 : props.rot) + 'deg)',
        transformOrigin: '0 50%', boxShadow: '0 4px 0 ' + INK
      }} />
    );
  }

  // barra que se llena: desde/hasta 0..1
  function Barra(props) {
    var T = props.T;
    var w = props.w || 620, h = props.h || 64;
    var e = junta(golpe(T, props.c, 0.38), fuera(T, props.s));
    var lleno = (props.desde || 0) + ((props.hasta == null ? 1 : props.hasta) - (props.desde || 0)) *
      Easing.easeInOutCubic(clamp((T - props.c - 0.25) / (props.dur || 1), 0, 1));
    var color = col(props.color, GRN);
    return (
      <Centro x={props.x} y={props.y} e={e} dy={M.life(T, 3, 3, 0.1)}>
        <div style={{ width: w, height: h, borderRadius: h / 2, background: BLANCO, border: '9px solid ' + INK,
          boxShadow: '0 8px 0 ' + INK, overflow: 'hidden', position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (lleno * 100).toFixed(2) + '%', background: color }} />
        </div>
      </Centro>
    );
  }

  // numero que cuenta desde/hasta
  function Num(props) {
    var T = props.T;
    var e = junta(golpe(T, props.c, 0.38), fuera(T, props.s));
    var v = (props.desde || 0) + ((props.hasta || 0) - (props.desde || 0)) *
      Easing.easeOutCubic(clamp((T - props.c) / (props.dur || 1), 0, 1));
    var fs = 150 * (props.tam || 1);
    var c = col(props.color, INK);
    return (
      <Centro x={props.x} y={props.y} e={e} dy={M.life(T, 3, 3, 0.6)}>
        <div style={{ fontFamily: F_NUM, fontSize: fs, color: c, lineHeight: 1, whiteSpace: 'nowrap',
          WebkitTextStroke: c !== INK ? (fs * 0.06) + 'px ' + INK : undefined, paintOrder: 'stroke fill' }}>
          {(props.prefijo || '') + Math.round(v).toLocaleString('es') + (props.sufijo || '')}
        </div>
      </Centro>
    );
  }

  // grafico: ejes + curvas que se dibujan. puntos en 0..1 (x derecha, y arriba)
  function Grafico(props) {
    var T = props.T;
    var x0 = props.x, y0 = props.y, w = props.w || 900, h = props.h || 520;
    var e = junta(golpe(T, props.c, 0.35), fuera(T, props.s));
    if (e.opacity <= 0) return null;
    var ejes = M.draw(T, props.c, 0.4);
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, opacity: e.opacity }}>
        <svg width={ANCHO} height={ALTO} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d={'M ' + x0 + ' ' + (y0 - h) + ' L ' + x0 + ' ' + y0 + ' L ' + (x0 + w) + ' ' + y0}
            fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={w + h} strokeDashoffset={(w + h) * (1 - ejes)} />
          {(props.curvas || []).map(function (cv, i) {
            var pts = cv.puntos.map(function (q) { return [x0 + q[0] * w, y0 - q[1] * h]; });
            var d = pts.map(function (q, j) { return (j ? 'L ' : 'M ') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ');
            var L = 0;
            for (var j = 1; j < pts.length; j++) L += Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]);
            var p = M.draw(T, cv.c, cv.dur || 1.2);
            return (
              <path key={i} d={d} fill="none" stroke={col(cv.color, YEL)} strokeWidth={cv.grosor || 16}
                strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
            );
          })}
        </svg>
      </div>
    );
  }

  // burbuja de dialogo o de pensamiento con texto
  function Burbuja(props) {
    var T = props.T;
    var e = EntradaSalida(T, props.c, props.s, 'pop', props.x);
    if (!props.mudo) sonido('pop', props.c, 0.6);
    var fs = 60 * (props.tam || 1);
    var piensa = props.tipo === 'pienso';
    return (
      <Centro x={props.x} y={props.y} e={e} rot={props.rot || 0} dy={M.life(T, 3, 5, 0.9)}>
        <div style={{ position: 'relative' }}>
          <div style={{
            background: BLANCO, border: '9px solid ' + INK, borderRadius: piensa ? 999 : 36,
            padding: (fs * 0.4) + 'px ' + (fs * (piensa ? 0.9 : 0.6)) + 'px', boxShadow: '0 9px 0 ' + INK,
            fontFamily: F_TITULO, fontWeight: 900, fontStyle: 'italic', fontSize: fs, color: INK,
            whiteSpace: 'nowrap', lineHeight: 1, textAlign: 'center'
          }}>{props.children}</div>
          {piensa ? (
            <React.Fragment>
              <div style={{ position: 'absolute', left: props.cola === 'der' ? '78%' : '18%', bottom: -46, width: 36, height: 36,
                borderRadius: 99, background: BLANCO, border: '8px solid ' + INK }} />
              <div style={{ position: 'absolute', left: props.cola === 'der' ? '86%' : '10%', bottom: -82, width: 22, height: 22,
                borderRadius: 99, background: BLANCO, border: '7px solid ' + INK }} />
            </React.Fragment>
          ) : (
            <svg width="70" height="60" style={{ position: 'absolute', left: props.cola === 'der' ? '72%' : '14%', bottom: -50, overflow: 'visible' }}>
              <path d="M 0 0 L 30 52 L 56 0" fill={BLANCO} stroke={INK} strokeWidth="9" strokeLinejoin="round" />
              <rect x="4" y="-12" width="48" height="14" fill={BLANCO} />
            </svg>
          )}
        </div>
      </Centro>
    );
  }

  // tarjeta blanca con borde de tinta (agrupa piezas)
  function Tarjeta(props) {
    var T = props.T;
    var e = EntradaSalida(T, props.c, props.s, props.entra, props.x);
    return (
      <Centro x={props.x} y={props.y} e={e} rot={props.rot || 0} dy={props.quieto ? 0 : M.life(T, 4, 3, 0.2)}>
        <div style={{
          width: props.w, height: props.h, background: col(props.fondo, BLANCO), border: '10px solid ' + INK,
          borderRadius: 34, boxShadow: '0 12px 0 ' + INK, position: 'relative', overflow: 'hidden'
        }}>{props.children}</div>
      </Centro>
    );
  }

  /* =========================================================
     PANTALLAS ARMADAS (beats que ya traen su escena)
     ========================================================= */

  // capitulo: fondo negro, numero en caja amarilla y la pregunta golpeando palabra por palabra
  function EscCapitulo(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var n = String(props.n).padStart(2, '0');
    sonido('golpe', f(0.08), 0.9);
    var pals = String(props.titulo).toUpperCase().split(' ');
    var lineas = [], act = [];
    pals.forEach(function (p) {
      if (act.length && (act.join(' ') + ' ' + p).length > 18) { lineas.push(act); act = []; }
      act.push(p);
    });
    if (act.length) lineas.push(act);
    var masLarga = Math.max.apply(null, lineas.map(function (l) { return l.join(' ').length; }));
    var fsT = Math.min(128, 1160 / (masLarga * 0.5));
    var k = 0, total = pals.length;
    return (
      <Papel fondo="negro">
        <Centro x={360} y={540} e={golpe(T, f(0.08), 0.4)} rot={-4} dy={M.life(T, 3, 5)}>
          <div style={{
            fontFamily: F_NUM, fontSize: 250, lineHeight: 1, color: INK, background: YEL,
            padding: '30px 46px 26px', borderRadius: 40, border: '12px solid ' + BLANCO
          }}>{n}</div>
        </Centro>
        <div style={{ position: 'absolute', left: 680, top: 540, transform: 'translateY(-50%)', width: 1160 }}>
          {(function () {
            var e1 = golpe(T, f(0.12), 0.3);
            return (
              <div style={{ display: 'inline-block', marginBottom: 26, opacity: e1.opacity,
                transform: 'scale(' + e1.scale.toFixed(4) + ')', transformOrigin: '0 50%' }}>
                <Rotulo tam={0.95} fondo={RED} dir="ninguna">{'Capítulo ' + Number(props.n) + (props.de ? ' de ' + props.de : '')}</Rotulo>
              </div>
            );
          })()}
          {lineas.map(function (ln, li) {
            return (
              <div key={li} style={{ display: 'flex', gap: 30, marginTop: li ? 6 : 0 }}>
                {ln.map(function (p, pi) {
                  var i = k++;
                  var e = golpe(T, f(0.16 + 0.32 * i / Math.max(1, total)), 0.26);
                  return (
                    <span key={pi} style={Object.assign(estiloTitulo(fsT, i === total - 1 || props.marcar === p ? 'amarillo' : 'blanco', false), {
                      display: 'inline-block', opacity: e.opacity, textAlign: 'left',
                      transform: 'scale(' + e.scale.toFixed(4) + ')', transformOrigin: '0 60%'
                    })}>{p}</span>
                  );
                })}
              </div>
            );
          })}
        </div>
        {props.ico ? <St T={T} n={props.ico} x={1700} y={830} tam={260} c={f(0.5)} rot={10} /> : null}
      </Papel>
    );
  }

  // cita: comillas amarillas, la frase aparece al ritmo de la voz y el autor en rotulo
  function EscCita(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var pals = String(props.texto).split(' ');
    var tiempos = props.tiempos;
    var fs = props.tam ? 104 * props.tam : (pals.length > 16 ? 84 : pals.length > 9 ? 100 : 118);
    return (
      <Papel fondo={props.fondo || 'papel'}>
        <Centro x={220} y={250} e={golpe(T, f(0.02), 0.4)} rot={-8} dy={M.life(T, 3, 6)}>
          <div style={{ fontFamily: F_NUM, fontSize: 330, lineHeight: 1, color: YEL, WebkitTextStroke: '14px ' + INK, paintOrder: 'stroke fill' }}>“</div>
        </Centro>
        <div style={{
          position: 'absolute', left: 390, top: 230, width: 1300, display: 'flex', flexWrap: 'wrap',
          columnGap: fs * 0.26, rowGap: fs * 0.08, alignContent: 'flex-start'
        }}>
          {pals.map(function (p, i) {
            var c = tiempos ? tiempos[i] : f(0.06 + 0.5 * i / pals.length);
            var e = golpe(T, c, 0.26);
            var resaltada = (props.marcadas || []).map(norm).indexOf(norm(p)) >= 0;
            return (
              <span key={i} style={Object.assign(estiloTitulo(fs, resaltada ? 'amarillo' : 'negro', resaltada ? true : false), {
                display: 'inline-block', opacity: e.opacity, transform: 'scale(' + e.scale.toFixed(4) + ')',
                transformOrigin: '50% 70%', textAlign: 'left'
              })}>{p}</span>
            );
          })}
        </div>
        <Centro x={1240} y={880} e={golpe(T, at + 0.3, 0.4)} rot={-2} dy={M.life(T, 3.4, 4, 0.5)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <div style={{ width: 70, height: 10, background: INK, borderRadius: 5 }} />
            <Rotulo tam={1.25} dir="ninguna">{props.autor}</Rotulo>
          </div>
        </Centro>
        {props.ico ? <St T={T} n={props.ico} x={1660} y={760} tam={280} c={at + 0.45} rot={8} /> : null}
      </Papel>
    );
  }

  // lista de pasos/puntos que se van marcando
  function EscLista(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var items = props.items || [];
    var alto = Math.min(190, 760 / Math.max(1, items.length));
    var y0 = 540 - (items.length - 1) * alto / 2 + (props.titulo ? 60 : 0);
    // la letra se achica si el texto mas largo no entra en ~1150 px
    var largo = Math.max.apply(null, items.map(function (it) { return String(it.texto).length; }).concat([1]));
    var tamTx = Math.min(alto / 150, 1150 / (largo * 0.43 * 96));
    return (
      <Papel fondo={props.fondo || 'papel'}>
        {props.titulo ? <Resalta T={T} x={960} y={140} c={f(0.03)} tam={1}>{String(props.titulo).toUpperCase()}</Resalta> : null}
        {items.map(function (it, i) {
          var c = it.t != null ? it.t : f(0.1 + 0.6 * i / items.length);
          var y = y0 + i * alto;
          var activo = props.activo == null || props.activo === i;
          return (
            <React.Fragment key={i}>
              {it.ico ? <St T={T} n={it.ico} x={400} y={y} tam={alto * 0.9} c={c} /> : null}
              <Tx T={T} x={it.ico ? 520 : 400} y={y} c={c + 0.06} tam={tamTx} color={activo ? 'negro' : 'gris'}
                alinear="left" entra="lado" ancla="izq">{it.texto}</Tx>
              {it.check ? <Check T={T} x={1600} y={y} c={it.check} tam={alto * 0.7} /> : null}
            </React.Fragment>
          );
        })}
      </Papel>
    );
  }

  // pantalla final: espacio para los elementos de YouTube + marca y redes
  function EscCierre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var MARCA = global.MARCA;
    var hueco = function (x, c, txt) {
      var e = golpe(T, c, 0.4);
      return (
        <Centro x={x} y={600} e={e} dy={M.life(T, 4, 4, x / 1000)}>
          <div style={{ width: 620, height: 349, borderRadius: 28, border: '10px dashed ' + INK, background: 'rgba(20,17,15,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rotulo tam={0.9} dir="ninguna">{txt}</Rotulo>
          </div>
        </Centro>
      );
    };
    sonido('marca', f(0.02));
    return (
      <Papel>
        {MARCA ? (
          <Centro x={960} y={170} e={golpe(T, f(0.02), 0.45)} dy={M.life(T, 4, 4)}>
            <MARCA.Nombre s={0.62} p={M.draw(T, f(0.06), 0.5)} />
          </Centro>
        ) : null}
        {hueco(560, f(0.08), 'MIRA ESTE VIDEO')}
        {hueco(1360, f(0.14), 'Y ESTE TAMBIÉN')}
        <Centro x={960} y={940} e={golpe(T, f(0.2), 0.4)} dy={M.life(T, 3.6, 4, 0.3)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            {MARCA ? ['youtube', 'instagram', 'tiktok'].map(function (r) { return <MARCA.Red key={r} red={r} s={0.42} />; }) : null}
            <div style={estiloTitulo(84, 'negro')}>@eltorvick</div>
          </div>
        </Centro>
      </Papel>
    );
  }

  /* =========================================================
     ENCIMA: CTA de suscripcion, meta de suscriptores, rotulo de capitulo
     ========================================================= */

  function Suscribete(props) {
    var T = props.T, b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.3) return null;
    var dur = b.fin - b.ini;
    var f = function (v) { return b.ini + dur * v; };
    var clic = f(0.42);
    var hecho = T >= clic;
    var e = junta(desliza(T, b.ini, -900, 0.45), fuera(T, b.fin, 0.25));
    var cursorP = Easing.easeInOutCubic(clamp((T - f(0.12)) / (clic - f(0.12)), 0, 1));
    var hundido = T >= clic && T < clic + 0.12 ? 0.92 : 1;
    var campana = hecho ? Math.sin((T - clic) * 30) * 18 * Math.exp(-(T - clic) * 2.2) : 0;
    var xy = posicion(b.pos || [700, 905]);
    return (
      <Centro x={xy[0]} y={xy[1]} e={e} dy={M.life(T, 3.4, 3)} giroEntrada={0}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, background: BLANCO, border: '9px solid ' + INK,
          borderRadius: 999, padding: '14px 18px 14px 14px', boxShadow: '0 10px 0 ' + INK, position: 'relative' }}>
          <div style={{ width: 96, height: 96, borderRadius: 99, background: YEL, border: '7px solid ' + INK,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F_NUM, fontSize: 46, color: INK }}>T</div>
          <div style={{ fontFamily: F_TITULO, fontWeight: 900, fontStyle: 'italic', fontSize: 58, color: INK, lineHeight: 1 }}>TORVICK</div>
          <div style={{ transform: 'scale(' + hundido + ')', background: hecho ? GRY : RED, color: hecho ? INK : BLANCO,
            fontFamily: F_ROTULO, fontWeight: 700, fontSize: 46, letterSpacing: '0.05em', padding: '14px 34px',
            borderRadius: 999, border: '6px solid ' + INK }}>{hecho ? 'SUSCRITO' : 'SUSCRIBIRSE'}</div>
          <div style={{ width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: 'rotate(' + campana.toFixed(1) + 'deg)', transformOrigin: '50% 10%' }}>
            <Sticker n="bell" tam={74} borde={false} />
          </div>
          <div style={{ width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sticker n="thumbs-up" tam={74} borde={false} />
          </div>
          <div style={{ position: 'absolute', left: 300 + 260 * cursorP, top: 140 - 70 * cursorP, transform: 'scale(' + hundido + ')' }}>
            <svg width="70" height="86" viewBox="0 0 70 86" style={{ overflow: 'visible' }}>
              <path d="M 6 4 L 6 66 L 22 52 L 34 80 L 46 74 L 34 48 L 56 48 Z" fill={BLANCO} stroke={INK} strokeWidth="7" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Centro>
    );
  }

  // meta de suscriptores: numero que sube y barra que se llena
  function Meta(props) {
    var T = props.T, b = props.b;
    if (T < b.ini - 0.05 || T > b.fin + 0.3) return null;
    var dur = b.fin - b.ini;
    var f = function (v) { return b.ini + dur * v; };
    var e = junta(golpe(T, b.ini, 0.4), fuera(T, b.fin, 0.2));
    var p = Easing.easeInOutCubic(clamp((T - f(0.2)) / (dur * 0.5), 0, 1));
    var v = Math.round(b.desde + (b.hasta - b.desde) * p);
    var xy = posicion(b.pos || [1430, 360]);
    return (
      <Centro x={xy[0]} y={xy[1]} e={e} rot={2} dy={M.life(T, 3.2, 4)}>
        <div style={{ background: BLANCO, border: '10px solid ' + INK, borderRadius: 34, boxShadow: '0 12px 0 ' + INK,
          padding: '26px 40px 34px', width: 620 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: F_NUM, fontSize: 104, color: INK, lineHeight: 1 }}>{v}</span>
            <span style={{ fontFamily: F_NUM, fontSize: 60, color: GRY, lineHeight: 1 }}>{b.hasta}</span>
          </div>
          <div style={{ fontFamily: F_ROTULO, fontWeight: 700, fontSize: 34, letterSpacing: '0.1em', color: INK, margin: '4px 0 16px' }}>
            SUSCRIPTORES · META
          </div>
          <div style={{ height: 46, borderRadius: 30, border: '8px solid ' + INK, overflow: 'hidden', background: BLANCO }}>
            <div style={{ height: '100%', width: (100 * (0.05 + 0.95 * p)).toFixed(1) + '%', background: GRN }} />
          </div>
        </div>
      </Centro>
    );
  }

  // rotulo chico de capitulo arriba a la izquierda, despues de cada tarjeta de capitulo
  function RotuloCapitulo(props) {
    var T = props.T, def = props.def;
    var out = null;
    def.capitulos.forEach(function (c) {
      var a = c.fin, b = c.fin + 4.2;
      if (T < a - 0.05 || T > b + 0.3) return;
      var e = junta(desliza(T, a, -500, 0.45), fuera(T, b, 0.25));
      out = (
        <Centro x={60} y={70} e={e} giroEntrada={0}>
          <div style={{ transform: 'translateX(50%)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontFamily: F_NUM, fontSize: 40, background: YEL, color: INK, padding: '6px 16px', borderRadius: 14,
              border: '6px solid ' + INK }}>{String(c.n).padStart(2, '0')}</div>
            <Rotulo tam={0.8} dir="ninguna">{c.corto || c.titulo}</Rotulo>
          </div>
        </Centro>
      );
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
    return <div style={{ position: 'absolute', inset: 0, background: BLANCO, opacity: a * 0.85 }} />;
  }

  /* =========================================================
     PLAN: constructores de beats (LARGOS.plan)
     ========================================================= */

  var plan = {
    // texto clave sobre la camara: estilo golpe | palabras | caja | rotulo
    texto: function (ini, fin, txt, o) { return Object.assign({ tipo: 'texto', ini: ini, fin: fin, txt: txt }, o || {}); },
    caja: function (ini, fin, txt, o) { return Object.assign({ tipo: 'texto', estilo: 'caja', ini: ini, fin: fin, txt: txt }, o || {}); },
    rotulo: function (ini, fin, txt, o) { return Object.assign({ tipo: 'texto', estilo: 'rotulo', ini: ini, fin: fin, txt: txt }, o || {}); },
    sticker: function (ini, fin, n, o) { return Object.assign({ tipo: 'sticker', ini: ini, fin: fin, n: n }, o || {}); },
    // imagen propia: largos/<id>/media/... (estilo tarjeta | polaroid | completa; pie; resaltar)
    imagen: function (ini, fin, src, o) { return Object.assign({ tipo: 'imagen', ini: ini, fin: fin, src: src }, o || {}); },
    camara: function (ini, fin, o) { return Object.assign({ tipo: 'camara', ini: ini, fin: fin, mov: 'corte' }, o || {}); },
    escena: function (ini, fin, C, props, o) { return Object.assign({ tipo: 'pantalla', ini: ini, fin: fin, C: C, props: props || {} }, o || {}); },
    capitulo: function (ini, fin, o) { return Object.assign({ tipo: 'pantalla', capitulo: true, ini: ini, fin: fin, C: EscCapitulo, props: o }, { entra: o.entra, sale: o.sale }); },
    cita: function (ini, fin, o) { return { tipo: 'pantalla', cita: true, ini: ini, fin: fin, C: EscCita, props: o, entra: o.entra, sale: o.sale }; },
    lista: function (ini, fin, o) { return { tipo: 'pantalla', ini: ini, fin: fin, C: EscLista, props: o, entra: o.entra, sale: o.sale }; },
    cierre: function (ini, fin, o) { return { tipo: 'pantalla', ini: ini, fin: fin, C: EscCierre, props: o || {}, entra: 'barrido', sale: 'corte' }; },
    suscribete: function (ini, fin, o) { return Object.assign({ tipo: 'suscribete', ini: ini, fin: fin }, o || {}); },
    meta: function (ini, fin, o) { return Object.assign({ tipo: 'meta', ini: ini, fin: fin }, o || {}); },
    sonido: function (t, tipo, g) { return { tipo: 'sonido', ini: t, fin: t, sfx: tipo, g: g }; },
    flash: function (t) { return { tipo: 'flash', ini: t, fin: t + 0.25 }; },
    sacudida: function (t, fuerza) { return { tipo: 'sacudida', ini: t, fin: t + 0.5, fuerza: fuerza }; },
    // tramo donde se deja el video tal cual (p. ej. un clip de archivo que ya funciona)
    mantener: function (ini, fin) { return { tipo: 'mantener', ini: ini, fin: fin }; }
  };

  /* =========================================================
     TRANSCRIPCION: buscar el segundo en que se dice una frase
     ========================================================= */

  function transcripcion(id) {
    return (global.TRANSCRIPCIONES || {})[id] || { dur: 0, palabras: [], frases: [] };
  }

  // devuelve una funcion t(frase, desde) -> segundo de inicio de la frase (y t.fin -> fin)
  function buscador(id) {
    var tr = transcripcion(id);
    var ws = tr.palabras.map(function (w) { return norm(w.p); });
    function hallar(frase, desde) {
      var q = String(frase).split(/\s+/).map(norm).filter(Boolean);
      desde = desde || 0;
      for (var i = 0; i < ws.length; i++) {
        if (tr.palabras[i].ini < desde - 0.01) continue;
        var ok = true;
        for (var j = 0; j < q.length; j++) { if (ws[i + j] !== q[j]) { ok = false; break; } }
        if (ok) return [i, i + q.length - 1];
      }
      if (global.console) console.warn('no encuentro en la transcripcion:', frase, 'desde', desde);
      return null;
    }
    var t = function (frase, desde) { var r = hallar(frase, desde); return r ? tr.palabras[r[0]].ini : (desde || 0); };
    t.fin = function (frase, desde) { var r = hallar(frase, desde); return r ? tr.palabras[r[1]].fin : (desde || 0); };
    t.palabras = tr.palabras;
    return t;
  }

  // tiempos de cada palabra de un texto, buscados en la voz entre ini y fin
  function tiemposDe(id, txt, ini, fin) {
    var tr = transcripcion(id);
    var pals = String(txt).replace(/\n/g, ' ').split(' ').filter(Boolean);
    var out = [], j = 0;
    var cand = tr.palabras.filter(function (w) { return w.ini >= ini - 0.35 && w.ini <= fin; });
    pals.forEach(function (p, i) {
      var q = norm(p), hall = null;
      for (var k = j; k < cand.length; k++) { if (norm(cand[k].p) === q) { hall = cand[k]; j = k + 1; break; } }
      out.push(hall ? Math.max(ini, hall.ini) : null);
    });
    // las que no se encontraron se reparten entre sus vecinas
    for (var i = 0; i < out.length; i++) {
      if (out[i] != null) continue;
      var a = i > 0 ? out[i - 1] : ini;
      var b = null;
      for (var k = i + 1; k < out.length; k++) if (out[k] != null) { b = out[k]; break; }
      if (b == null) b = Math.min(fin, a + 0.3 * (out.length - i));
      out[i] = a + (b - a) / 2;
    }
    return out;
  }

  /* =========================================================
     REGISTRO y preparacion del plan
     ========================================================= */

  var REGISTRO = [];

  function preparar(def) {
    var d = Object.assign({ encuadre: { zoom: 1, foco: [0.5, 0.5] } }, def);
    var beats = (def.plan || []).filter(Boolean);
    d.camaras = beats.filter(function (b) { return b.tipo === 'camara'; });
    d.pantallas = beats.filter(function (b) { return b.tipo === 'pantalla'; });
    d.encima = beats.filter(function (b) { return ['texto', 'sticker', 'suscribete', 'meta', 'imagen'].indexOf(b.tipo) >= 0; });
    d.sacudidas = beats.filter(function (b) { return b.tipo === 'sacudida'; }).map(function (b) { return { t: b.ini, fuerza: b.fuerza }; });
    d.flashes = beats.filter(function (b) { return b.tipo === 'flash'; }).map(function (b) { return { t: b.ini }; });
    d.mantener = beats.filter(function (b) { return b.tipo === 'mantener'; });
    d.capitulos = d.pantallas.filter(function (b) { return b.capitulo; }).map(function (b) {
      return { n: b.props.n, titulo: b.props.titulo, corto: b.props.corto, ini: b.ini, fin: b.fin };
    });
    // un texto o sticker de camara se va antes de que entre la escena siguiente
    // (si empieza dentro de una escena, es a proposito y se respeta)
    d.encima.forEach(function (b) {
      if (b.sobreEscena) return;
      d.pantallas.forEach(function (pn) {
        var vent = (VENTANA[pn.entra || 'barrido'] || 0);
        var corte = pn.ini - vent;
        if (corte > b.ini && corte < b.fin) b.fin = corte;
      });
    });
    // dos textos (o dos stickers) en el mismo lugar no se pisan: el anterior se va
    // justo antes de que entre el siguiente
    var ultimo = {};
    d.encima.slice().sort(function (x, y) { return x.ini - y.ini; }).forEach(function (b) {
      if (b.tipo !== 'texto' && b.tipo !== 'sticker') return;
      var k = b.tipo + ':' + posicion(b.pos || (b.tipo === 'sticker' ? 'der' : 'abajo')).join(',');
      var prev = ultimo[k];
      if (prev && b.ini < prev.fin + 0.1) prev.fin = Math.max(prev.ini, b.ini - 0.14);
      ultimo[k] = b;
    });
    // lo que queda con menos de 0.4 s a la vista no llega a leerse: se saca
    d.encima = d.encima.filter(function (b) { return b.fin - b.ini >= 0.4; });
    d.encima.forEach(function (b) {
      if (b.tipo === 'texto' && b.estilo === 'palabras') b.tiempos = tiemposDe(d.id, b.txt, b.ini, b.fin);
    });
    d.pantallas.forEach(function (b) {
      if (b.props && b.props.texto && !b.props.tiempos && b.props.voz !== false) {
        b.props.tiempos = tiemposDe(d.id, b.props.texto, b.ini - 0.3, b.fin);
      }
    });
    d.dur = def.dur || transcripcion(d.id).dur || 60;

    // efectos fijos de cada beat (los de las escenas se marcan al dibujarlas)
    var h = BARRIDO / 2;
    d.cuesFijos = [];
    var cue = function (tipo, t, g) { d.cuesFijos.push({ tipo: tipo, t: Math.round(t * 1000) / 1000, g: g == null ? 1 : g }); };
    beats.forEach(function (b) {
      if (b.sfx === false) return;
      if ((b.tipo === 'texto' || b.tipo === 'sticker' || b.tipo === 'imagen') && d.encima.indexOf(b) < 0) return;
      if (b.tipo === 'texto') cue('pop', b.tiempos ? b.tiempos[0] : b.ini, b.estilo === 'caja' ? 0.9 : 0.6);
      else if (b.tipo === 'sticker') cue('pop', b.ini, 0.7);
      else if (b.tipo === 'imagen') cue(b.estilo === 'completa' ? 'whoosh' : 'pop', b.ini, 0.7);
      else if (b.tipo === 'pantalla') {
        var en = b.entra || 'barrido', sa = b.sale || 'barrido';
        if (en === 'barrido') cue('whoosh', b.ini - h, 0.9);
        else if (en === 'empuje') cue('whoosh', b.ini - 0.2, 0.6);
        else if (en === 'pop') cue('pop', b.ini, 0.6);
        if (sa === 'barrido') cue('whoosh', b.fin - h, 0.7);
        else if (sa === 'empuje') cue('whoosh', b.fin - 0.2, 0.5);
      } else if (b.tipo === 'camara' && b.mov === 'golpe') cue('golpe', b.ini, 0.8);
      else if (b.tipo === 'suscribete') { cue('whoosh', b.ini, 0.6); cue('click', b.ini + (b.fin - b.ini) * 0.42, 1); cue('campana', b.ini + (b.fin - b.ini) * 0.45, 0.8); }
      else if (b.tipo === 'meta') cue('subida', b.ini + (b.fin - b.ini) * 0.2, 0.7);
      else if (b.tipo === 'sonido') cue(b.sfx, b.ini, b.g);
      else if (b.tipo === 'flash') cue('whoosh', b.ini - 0.1, 0.7);
    });
    return d;
  }

  function registrar(def) { REGISTRO.push(def); }
  function buscar(id) {
    for (var i = 0; i < REGISTRO.length; i++) if (REGISTRO[i].id === id) return REGISTRO[i];
    return REGISTRO[0];
  }

  /* =========================================================
     LIENZO: todas las capas para un T
     ========================================================= */

  function Lienzo(props) {
    var T = props.T, def = props.def;
    var encima = def.encima.map(function (b, i) {
      if (b.tipo === 'texto') return <TextoClave key={i} T={T} b={b} />;
      if (b.tipo === 'sticker') return <StickerBeat key={i} T={T} b={b} />;
      if (b.tipo === 'suscribete') return <Suscribete key={i} T={T} b={b} />;
      if (b.tipo === 'meta') return <Meta key={i} T={T} b={b} />;
      if (b.tipo === 'imagen') return <ImagenBeat key={i} T={T} b={b} />;
      return null;
    });
    return (
      <div style={{ position: 'absolute', left: 0, top: 0, width: ANCHO, height: ALTO, overflow: 'hidden', background: INK }}>
        <Camara T={T} def={def} render={props.render} medioRef={props.medioRef} />
        <CapaEscenas T={T} def={def} />
        {encima}
        <RotuloCapitulo T={T} def={def} />
        <Flashes T={T} def={def} />
      </div>
    );
  }

  /* =========================================================
     PAGINA: vista previa con el video como reloj, o modo render
     ========================================================= */

  function fmt(s) {
    var m = Math.floor(s / 60), r = s - 60 * m;
    return m + ':' + (r < 10 ? '0' : '') + r.toFixed(1);
  }

  function useEscala(ref) {
    var _e = useState(0.5);
    var esc = _e[0], setEsc = _e[1];
    useEffect(function () {
      var el = ref.current;
      if (!el) return;
      var medir = function () { if (el.clientWidth > 0) setEsc(el.clientWidth / ANCHO); };
      medir();
      var ro = new ResizeObserver(medir);
      ro.observe(el);
      return function () { ro.disconnect(); };
    }, []);
    return esc;
  }

  function Vista(props) {
    var def = props.def, render = props.render;
    var _t = useState(0);
    var T = _t[0], setT = _t[1];
    var _p = useState(false);
    var playing = _p[0], setPlaying = _p[1];
    var medioRef = useRef(null);
    var marcoRef = useRef(null);
    var escala = useEscala(marcoRef);

    // modo render: el grabador manda el segundo y el cuadro de camara
    useEffect(function () {
      if (!render) return;
      global.LARGO = {
        total: def.dur,
        video: def.video,
        seek: function (t) { setT(t); },
        cuadro: function (url) {
          var img = medioRef.current;
          if (!img) return Promise.resolve();
          img.src = url;
          return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
        },
        // precarga las imagenes propias para que ningun cuadro salga sin ellas
        precargar: function () {
          return Promise.all(def.encima.filter(function (b) { return b.tipo === 'imagen'; }).map(function (b) {
            var im = new Image();
            im.src = b.src;
            return im.decode ? im.decode().catch(function () { console.warn('no carga la imagen', b.src); }) : Promise.resolve();
          }));
        },
        // dibuja cada pantalla una vez para que marquen sus efectos
        recolectar: function () {
          var ts = [];
          def.pantallas.forEach(function (b) { for (var k = 0; k <= 4; k++) ts.push(b.ini + (b.fin - b.ini) * k / 4); });
          var i = 0;
          return new Promise(function (res) {
            var paso = function () {
              if (i >= ts.length) { setT(0); res(true); return; }
              setT(ts[i++]);
              requestAnimationFrame(function () { requestAnimationFrame(paso); });
            };
            paso();
          });
        },
        cues: function () { return def.cuesFijos.concat(listaCues()).sort(function (a, b) { return a.t - b.t; }); },
        tramos: function () {
          return {
            pantallas: def.pantallas.map(function (b) { return [b.ini, b.fin, b.entra || 'barrido', b.sale || 'barrido']; }),
            mantener: def.mantener.map(function (b) { return [b.ini, b.fin]; }),
            camaras: def.camaras.map(function (b) { return [b.ini, b.fin, b.zoom || 1]; })
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
      return function () { cancelAnimationFrame(raf); };
    }, [render]);

    var lienzo = <Lienzo T={T} def={def} render={render} medioRef={medioRef} />;
    if (render) return <div style={{ width: ANCHO, height: ALTO, position: 'relative', overflow: 'hidden' }}>{lienzo}</div>;

    var tr = transcripcion(def.id);
    var frase = null;
    tr.frases.forEach(function (fr) { if (T >= fr.ini - 0.05 && T <= fr.fin + 0.3) frase = fr; });
    var alternar = function () {
      var v = medioRef.current;
      if (!v) return;
      if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
    };
    var ir = function (t) { var v = medioRef.current; if (v) v.currentTime = clamp(t, 0, def.dur); setT(t); };
    var marcas = def.pantallas.map(function (b, i) {
      return <div key={i} title={b.capitulo ? 'capítulo' : 'escena'} className={'marca' + (b.capitulo ? ' cap' : '')}
        style={{ left: (100 * b.ini / def.dur) + '%', width: Math.max(0.15, 100 * (b.fin - b.ini) / def.dur) + '%' }} />;
    });
    return (
      <div className="largo-mesa">
        <div ref={marcoRef} className="largo-marco" style={{ position: 'relative', aspectRatio: '16 / 9', width: '100%', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: ANCHO, height: ALTO, transformOrigin: '0 0', transform: 'scale(' + escala + ')' }}>
            {lienzo}
          </div>
        </div>
        <div className="largo-controles">
          <button className="largo-play" onClick={alternar}>{playing ? '❚❚' : '▶'}</button>
          <div className="largo-linea" onClick={function (ev) {
            var r = ev.currentTarget.getBoundingClientRect();
            ir(def.dur * (ev.clientX - r.left) / r.width);
          }}>
            {marcas}
            <div className="cursor" style={{ left: (100 * T / def.dur) + '%' }} />
          </div>
          <span className="largo-tiempo">{fmt(T)} / {fmt(def.dur)}</span>
        </div>
        <div className="largo-dice">{frase ? frase.texto : '—'}</div>
      </div>
    );
  }

  function leerHash() {
    var h = String(global.location.hash || '').replace(/^#/, '');
    var partes = h.split('/');
    return { id: partes[0] || (REGISTRO[0] && REGISTRO[0].id), render: partes[1] === 'render' };
  }

  var preparados = {};
  function App() {
    var _h = useState(leerHash);
    var ruta = _h[0], setRuta = _h[1];
    useEffect(function () {
      var cambio = function () { setRuta(leerHash()); };
      global.addEventListener('hashchange', cambio);
      return function () { global.removeEventListener('hashchange', cambio); };
    }, []);
    var crudo = buscar(ruta.id);
    if (!crudo) return <p style={{ padding: 24 }}>No hay videos largos registrados.</p>;
    var def = preparados[crudo.id] || (preparados[crudo.id] = preparar(crudo));
    if (ruta.render) return <Vista key={def.id + ':r'} def={def} render />;
    return (
      <div className="largo">
        <header className="largo-cabecera">
          <div className="marca">{def.titulo}</div>
          <nav className="videos">
            {REGISTRO.map(function (d) {
              return <a key={d.id} href={'#' + d.id} className={d.id === def.id ? 'actual' : ''}>{d.titulo}</a>;
            })}
          </nav>
          <div className="sub">video largo 1920×1080 · el video manda el tiempo · amarillo = escenas</div>
        </header>
        <Vista key={def.id} def={def} />
      </div>
    );
  }

  function montar() {
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  }

  global.LARGOS = {
    ANCHO: ANCHO, ALTO: ALTO, BARRIDO: BARRIDO, COLOR: COLOR,
    registrar: registrar, buscar: buscar, montar: montar, lista: function () { return REGISTRO.slice(); },
    plan: plan, buscador: buscador, sonido: sonido, Sticker: Sticker,
    E: {
      Papel: Papel, St: St, Tx: Tx, Rot: Rot, Caja: Caja, Resalta: Resalta, Flecha: Flecha, Signo: Signo,
      Check: Check, Tacha: Tacha, Tachon: Tachon, Barra: Barra, Num: Num, Grafico: Grafico, Burbuja: Burbuja,
      Tarjeta: Tarjeta, Centro: Centro, Rotulo: Rotulo, CajaTexto: CajaTexto,
      golpe: golpe, fuera: fuera, cae: cae, desliza: desliza, junta: junta, estiloTitulo: estiloTitulo
    }
  };
})(window);
