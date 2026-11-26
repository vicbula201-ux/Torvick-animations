/* ============================================================
   PLANO SECUENCIA CON TOR 3D (window.PS): el formato de los videos de
   concepto (pedido del autor, con referencias de reels virales): todo en un
   solo plano, sin cortes ni transiciones entre escenas, Tor en su gimnasio
   (TOR3D con escenario 'gym'), que habla con la voz (la boca se abre con el
   volumen), mira a la camara y la toca (cuarta pared), subtitulos palabra
   por palabra al ritmo de la voz y tarjetas de datos (el estudio, barras,
   la encuesta del debate). El gancho es una pregunta.

     PS.video({
       id, titulo, escenas: [{ nombre, vo, dur }],
       camara: [[[escena, fraccion], { az, el, dist, y, dx, dz }], ...],   // UN recorrido para todo el video
       vista: function (T, b, cam) { return { figuras, objetos }; },       // b: la linea de tiempo (abajo)
       lienzo: function (T, b, pr, info) { ... },   // SVG sobre la escena 3D (aros, flechas, brillos)
       encima: function (T, b, pr, info) { ... },   // tarjetas (PS.Estudio, PS.Barras, PS.Encuesta), debajo de los subtitulos
       zona: function (T, b) { return [x0, y0, x1, y1]; },   // donde tiene que entrar Tor entero (por defecto ZONA)
       libre: [[[j, x], [j, x]], ...],               // tramos sin encuadre automatico (primer plano a proposito)
       claves: { 'pesadas': 'rojo', 'livianas': 'verde' },   // palabras de color en los subtitulos
       golpes: [[j, x], ...],                        // sacudones de camara (un toque, un golpe)
       accion, cierreVo
     })

   Los tiempos siguen la regla de f(fraccion): se escriben como [escena, fraccion] y se pasan a segundos
   con b.f(j, x), asi el video se estira solo con las duraciones de la voz. La voz (la clonada o la tuya)
   la prepara herramientas/voz.py y deja window.VOCES[id] = { durs, palabras: [[t0, t1, texto, linea]], env }
   en voces/<id>.js: las duraciones de cada escena, cada palabra con su tiempo (para los subtitulos) y el
   volumen a 60 cuadros por segundo (para la boca). Sin VOCES el video anda igual, con las duraciones del
   archivo, sin subtitulos y con la boca quieta.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, V = global.V, B = global.B, E3 = global.E3, TOR3D = global.TOR3D;
  var Easing = global.Easing, clamp = global.clamp;
  var A = global.REELS.ayudas;
  var C = global.P.C;
  var COLOR = { amarillo: C.YEL, rojo: C.RED, verde: C.GRN, gris: C.GRY, blanco: '#ffffff', negro: C.INK };
  var ZONA = [70, 300, 1010, 1330];
  var FUENTE = "'Barlow Semi Condensed', sans-serif";

  /* ---------------- la linea de tiempo: [escena, fraccion] -> segundos ---------------- */
  function linea(limites, durs) {
    var n = durs.length;
    var f = function (j, x) { var i = clamp(j, 0, n - 1); return limites[i] + durs[i] * (x == null ? 0 : x); };
    var de = function (q) { return Array.isArray(q) ? f(q[0], q[1]) : q; };
    return {
      f: f, de: de, total: limites[n - 1] + durs[n - 1], limites: limites, durs: durs,
      // avance 0..1 entre dos marcas [j, x]
      k: function (T, a, c, ease) { var t0 = de(a), t1 = de(c); var u = clamp((T - t0) / Math.max(1e-3, t1 - t0), 0, 1); return ease ? ease(u) : u; },
      entre: function (T, a, c) { return T >= de(a) && T < de(c); },
      en: function (T, j) { return clamp((T - limites[j]) / durs[j], 0, 1); }
    };
  }

  /* ---------------- la voz: volumen (boca) y palabras (subtitulos) ---------------- */
  var ENV_CACHE = {};
  function envolvente(voz, quien) {
    var env = voz && (quien && voz.envs && voz.envs[quien] != null ? voz.envs[quien] : voz.env);
    if (!env) return null;
    var k = env.length + ':' + env.slice(0, 32) + ':' + env.slice(-16);
    if (ENV_CACHE[k]) return ENV_CACHE[k];
    var bin = global.atob(env), a = new Float32Array(bin.length);
    for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i) / 255;
    ENV_CACHE[k] = a;
    return a;
  }
  // volumen de la voz en T (0..1), suavizado para que la boca no tiemble; quien: la voz de ese personaje
  // (en los videos con dos voces, cada boca se mueve solo con la suya)
  function volumen(voz, T, quien) {
    var a = envolvente(voz, quien); if (!a) return 0;
    var fps = voz.fps || 60, x = T * fps, i = Math.floor(x), u = x - i;
    var g = function (k) { return a[clamp(k, 0, a.length - 1)] || 0; };
    return clamp((g(i - 1) * 0.2 + g(i) * (1 - u) * 0.6 + g(i + 1) * u * 0.6 + g(i + 2) * 0.2), 0, 1);
  }
  function hablando(voz, T) { return volumen(voz, T) > 0.08; }

  /* ---------------- subtitulos palabra por palabra ---------------- */
  var CTX = null;
  function medir(txt, px) {
    if (!CTX) CTX = document.createElement('canvas').getContext('2d');
    CTX.font = '800 ' + px + 'px ' + FUENTE;
    return CTX.measureText(txt).width;
  }
  function norm(w) { return String(w).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9%]/g, ''); }
  var TROZOS = {};
  // agrupa las palabras en trozos cortos (hasta 4 palabras o ~18 letras; corta en los signos)
  function trozos(voz) {
    var key = voz.palabras.length + ':' + (voz.palabras[0] || [0])[0];
    if (TROZOS[key]) return TROZOS[key];
    var res = [], cur = null;
    voz.palabras.forEach(function (p, i) {
      var txt = p[2], letras = cur ? cur.ws.reduce(function (s, w) { return s + w[2].length + 1; }, 0) : 0;
      var cambiaLinea = cur && cur.linea !== p[3];
      if (!cur || cambiaLinea || cur.ws.length >= 4 || letras + txt.length > 18 || cur.corta || p[0] - cur.ws[cur.ws.length - 1][1] > 0.45) {
        cur = { ws: [], linea: p[3] }; res.push(cur);
      }
      cur.ws.push(p);
      cur.corta = /[.?!,;:]$/.test(txt) && cur.ws.length >= 2 || /[.?!]$/.test(txt);
    });
    res.forEach(function (q, i) {
      q.t0 = q.ws[0][0];
      var fin = q.ws[q.ws.length - 1][1] + 0.35;
      q.t1 = res[i + 1] ? Math.min(res[i + 1].ws[0][0], Math.max(fin, res[i + 1].ws[0][0] - 0.05)) : fin;
    });
    TROZOS[key] = res;
    return res;
  }
  function Subtitulos(props) {
    var T = props.T, voz = props.voz;
    if (!voz || !voz.palabras || !voz.palabras.length) return null;
    var lista = trozos(voz), q = null;
    for (var i = 0; i < lista.length; i++) if (T >= lista[i].t0 - 0.04 && T < lista[i].t1) { q = lista[i]; break; }
    if (!q) return null;
    var px = 80, esp = 22, claves = props.claves || {};
    // con dos voces: la palabra que suena toma el color del que habla y arriba va su nombre
    var hablante = props.hablantes && q.ws[0][4] ? props.hablantes[q.ws[0][4]] : null;
    var acento = hablante ? COLOR[hablante.color] || C.YEL : C.YEL;
    var ws = q.ws.map(function (w) { var t = String(w[2]).toUpperCase(); return { w: w, t: t, ancho: medir(t, px) * 1.08 + 16 }; });   // con el trazo y la palabra activa mas grande
    // en una o dos filas
    var total = ws.reduce(function (s, w) { return s + w.ancho + esp; }, -esp), filas = [ws];
    if (total > 900 && ws.length > 1) {
      var mejor = 1, dif = 1e9;
      for (var c = 1; c < ws.length; c++) {
        var a = ws.slice(0, c).reduce(function (s, w) { return s + w.ancho + esp; }, 0), b2 = total - a;
        if (Math.abs(a - b2) < dif) { dif = Math.abs(a - b2); mejor = c; }
      }
      filas = [ws.slice(0, mejor), ws.slice(mejor)];
    }
    var y0 = props.y || 1440, alto = px * 1.06;
    var activa = null; q.ws.forEach(function (w) { if (T >= w[0] - 0.02) activa = w; });
    var dy = M.life(T, 3.2, 4);
    return (
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <g transform={'translate(0 ' + dy.toFixed(1) + ')'}>
          {hablante ? (function () {
            var nw = medir(hablante.nombre, 34) + 40, ny = y0 - (filas.length - 1) * alto - px - 26;
            var e2 = Easing.easeOutBack(clamp((T - q.t0 + 0.04) / 0.25, 0, 1));
            return (
              <g transform={'translate(540 ' + ny.toFixed(1) + ') scale(' + e2.toFixed(3) + ')'}>
                <rect x={-nw / 2} y={-30} width={nw} height={46} rx={23} fill={acento} stroke={C.INK} strokeWidth={5} />
                <text x={0} y={4} textAnchor="middle" fontFamily={FUENTE} fontWeight={800} fontSize={34} letterSpacing={2}
                  fill={hablante.color === 'amarillo' ? C.INK : '#ffffff'}>{hablante.nombre}</text>
              </g>
            );
          })() : null}
          {filas.map(function (fila, fi) {
            var ancho = fila.reduce(function (s, w) { return s + w.ancho + esp; }, -esp), x = 540 - ancho / 2;
            var y = y0 + (fi - (filas.length - 1)) * alto;
            return fila.map(function (w, wi) {
              var u = T - w.w[0];
              var x0 = x; x += w.ancho + esp;
              if (u < -0.02) return null;
              var e = Easing.easeOutBack(clamp((u + 0.02) / 0.2, 0, 1));
              var esActiva = activa === w.w, clave = claves[norm(w.t)];
              var relleno = esActiva ? (clave ? COLOR[clave] : acento) : (clave ? COLOR[clave] : '#ffffff');
              var sc = (0.6 + 0.4 * e) * (esActiva ? 1.08 : 1), cx = x0 + w.ancho / 2;
              return (
                <g key={fi + '-' + wi} transform={'translate(' + cx.toFixed(1) + ' ' + (y + (1 - e) * 18).toFixed(1) + ') scale(' + sc.toFixed(3) + ')'} opacity={clamp(e * 1.5, 0, 1)}>
                  <text x={5} y={6} textAnchor="middle" fontFamily={FUENTE} fontWeight={800} fontSize={px} fill={C.INK}
                    stroke={C.INK} strokeWidth={16} strokeLinejoin="round">{w.t}</text>
                  <text x={0} y={0} textAnchor="middle" fontFamily={FUENTE} fontWeight={800} fontSize={px} fill={relleno}
                    stroke={C.INK} strokeWidth={14} strokeLinejoin="round" style={{ paintOrder: 'stroke' }}>{w.t}</text>
                </g>
              );
            });
          })}
        </g>
      </svg>
    );
  }

  /* ---------------- tarjetas de datos ---------------- */
  // entrada (sube con rebote) y salida; e = { op, dy, sc }
  function entrada(T, cuando, hasta) {
    var e = Easing.easeOutBack(clamp((T - cuando) / 0.5, 0, 1));
    var s = hasta == null ? 0 : Easing.easeInCubic(clamp((T - hasta) / 0.35, 0, 1));
    return { op: clamp(e * 1.6, 0, 1) * (1 - s), dy: (1 - e) * 90 + s * -60, sc: 0.86 + 0.14 * e, visible: T >= cuando && (hasta == null || T < hasta + 0.36) };
  }
  function Tarjeta(props) {
    var e = entrada(props.T, props.cuando, props.hasta);
    if (!e.visible) return null;
    var w = props.w, h = props.h, x = props.x == null ? (1080 - w) / 2 : props.x, y = props.y;
    var dy = e.dy + M.life(props.T, 3.6, 5, props.fase || 0);
    return (
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <g opacity={e.op} transform={'translate(' + (x + w / 2) + ' ' + (y + h / 2 + dy) + ') scale(' + e.sc.toFixed(3) + ') translate(' + (-w / 2) + ' ' + (-h / 2) + ')'}>
          <rect x={12} y={12} width={w} height={h} rx={26} fill={COLOR[props.sombra] || C.YEL} stroke={C.INK} strokeWidth={6} />
          <rect x={0} y={0} width={w} height={h} rx={26} fill="#ffffff" stroke={C.INK} strokeWidth={7} />
          {props.children}
        </g>
      </svg>
    );
  }
  function Etiqueta(props) {
    var px = props.px || 30, w = medir(props.text, px) * 1.04 + 36;
    return (
      <g transform={'translate(' + props.x + ' ' + props.y + ')'}>
        <rect x={0} y={-px * 0.95} width={w} height={px * 1.5} rx={px * 0.75} fill={props.fondo || C.INK} />
        <text x={18} y={px * 0.16} fontFamily={FUENTE} fontWeight={800} fontSize={px} fill={props.color || '#ffffff'} letterSpacing={2}>{props.text}</text>
      </g>
    );
  }
  // el estudio que respalda el dato: "ESTUDIO" + autores, año y lo que encontro
  function Estudio(props) {
    var w = props.w || 760, h = props.h || 250;
    return (
      <Tarjeta T={props.T} cuando={props.cuando} hasta={props.hasta} x={props.x} y={props.y == null ? 270 : props.y} w={w} h={h} sombra={props.sombra || 'amarillo'}>
        <Etiqueta x={30} y={58} text={props.etiqueta || 'ESTUDIO'} />
        <text x={30} y={140} fontFamily={FUENTE} fontWeight={800} fontSize={62} fill={C.INK}>{props.autor}</text>
        <text x={30} y={204} fontFamily={FUENTE} fontWeight={600} fontSize={38} fill="#5a534b">{props.detalle}</text>
      </Tarjeta>
    );
  }
  // barras que se llenan: items [{ label, v (0..1), color, valor: '+8 %' }]
  function Barras(props) {
    var items = props.items, w = props.w || 820, fila = 104, h = 110 + items.length * fila;
    var k = Easing.easeOutCubic(clamp((props.T - props.cuando - 0.25) / 0.9, 0, 1));
    return (
      <Tarjeta T={props.T} cuando={props.cuando} hasta={props.hasta} x={props.x} y={props.y == null ? 270 : props.y} w={w} h={h} sombra={props.sombra}>
        <Etiqueta x={30} y={58} text={props.titulo} />
        {items.map(function (it, i) {
          var y = 110 + i * fila, ancho = w - 270 - (it.valor ? medir(it.valor, 40) + 30 : 0), bw = ancho * clamp(it.v, 0, 1) * k;
          return (
            <g key={i}>
              <text x={30} y={y + 52} fontFamily={FUENTE} fontWeight={800} fontSize={40} fill={C.INK}>{it.label}</text>
              <rect x={230} y={y + 14} width={ancho} height={50} rx={25} fill="#EFEBE4" stroke={C.INK} strokeWidth={4} />
              {bw > 2 ? <rect x={230} y={y + 14} width={Math.max(50, bw)} height={50} rx={25} fill={COLOR[it.color] || C.YEL} stroke={C.INK} strokeWidth={4} /> : null}
              <text x={w - 30} y={y + 52} textAnchor="end" fontFamily={FUENTE} fontWeight={800} fontSize={40} fill={C.INK} opacity={k}>{it.valor}</text>
            </g>
          );
        })}
      </Tarjeta>
    );
  }
  // la encuesta del debate: dos opciones y "COMENTA"
  function Encuesta(props) {
    var w = props.w || 820, h = 300, T = props.T;
    var pulso = 1 + 0.04 * Math.sin(T * 6);
    return (
      <Tarjeta T={T} cuando={props.cuando} hasta={props.hasta} x={props.x} y={props.y == null ? 270 : props.y} w={w} h={h} sombra="amarillo">
        <text x={w / 2} y={78} textAnchor="middle" fontFamily={FUENTE} fontWeight={800} fontSize={46} fill={C.INK}>{props.pregunta}</text>
        {[props.a, props.b].map(function (op, i) {
          var x = 40 + i * (w / 2 - 20), bw = w / 2 - 60;
          return (
            <g key={i} transform={'translate(' + (x + bw / 2) + ' 170) scale(' + (i === 0 ? pulso : 2 - pulso).toFixed(3) + ') translate(' + (-bw / 2) + ' -50)'}>
              <rect x={0} y={0} width={bw} height={100} rx={50} fill={COLOR[op.color] || C.YEL} stroke={C.INK} strokeWidth={6} />
              <text x={bw / 2} y={68} textAnchor="middle" fontFamily={FUENTE} fontWeight={800} fontSize={50} fill={op.color === 'amarillo' || !op.color ? C.INK : '#ffffff'}>{op.text}</text>
            </g>
          );
        })}
        <text x={w / 2} y={274} textAnchor="middle" fontFamily={FUENTE} fontWeight={800} fontSize={34} fill="#5a534b" letterSpacing={3}>COMÉNTALO ABAJO</text>
      </Tarjeta>
    );
  }
  // un numero grande que cuenta (40 % -> el texto que se pasa)
  function Grande(props) {
    var e = entrada(props.T, props.cuando, props.hasta);
    if (!e.visible) return null;
    var dy = e.dy + M.life(props.T, 3, 6);
    return (
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <g opacity={e.op} transform={'translate(' + (props.x || 540) + ' ' + ((props.y || 520) + dy) + ') scale(' + e.sc.toFixed(3) + ')'}>
          <text x={8} y={8} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={props.px || 170} fill={C.INK}>{props.text}</text>
          <text x={0} y={0} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={props.px || 170} fill={COLOR[props.color] || C.YEL}
            stroke={C.INK} strokeWidth={10} style={{ paintOrder: 'stroke' }}>{props.text}</text>
        </g>
      </svg>
    );
  }

  /* ---------------- cuarta pared: Tor toca la pantalla ---------------- */
  function Toque(props) {
    var T = props.T, u = T - props.cuando;
    A.sonido('pop', props.cuando);
    if (u < 0 || u > 1.6) return null;
    var x = props.x, y = props.y, op = 1 - clamp((u - 1.1) / 0.5, 0, 1);
    var anillos = [0, 0.12, 0.24].map(function (d, i) {
      var k = clamp((u - d) / 0.6, 0, 1), r = 20 + 150 * Easing.easeOutCubic(k);
      return k > 0 && k < 1 ? <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={i === 1 ? C.YEL : '#ffffff'} strokeWidth={10 * (1 - k) + 2} opacity={1 - k} /> : null;
    });
    // la "grieta" del vidrio: rayitas que salen del dedo
    var g = Easing.easeOutExpo(clamp(u / 0.18, 0, 1));
    var rayas = [12, 70, 140, 200, 255, 320].map(function (a, i) {
      var r = (60 + (i % 3) * 30) * g, ar = a * Math.PI / 180;
      var mx = x + Math.cos(ar) * r * 0.5 + Math.sin(ar) * 10, my = y + Math.sin(ar) * r * 0.5 - Math.cos(ar) * 10;
      return <path key={i} d={'M ' + x + ' ' + y + ' L ' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' L ' + (x + Math.cos(ar) * r).toFixed(1) + ' ' + (y + Math.sin(ar) * r).toFixed(1)}
        stroke="#ffffff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.9} />;
    });
    return <g opacity={op}>{rayas}{anillos}</g>;
  }

  /* ---------------- Tor vivo: de pie, respirando, cambiando el peso, hablando con las manos ---------------- */
  // la pose de pie con vida; gesto 0..1 sube una mano al hablar; extra pisa lo que haga falta
  function depie(T, o) {
    o = o || {};
    var w = Math.sin(T * 0.8), g = clamp(o.gesto || 0, 0, 1), gl = o.lado || 1;
    var p = {
      cadera: [0.025 * w + (o.x || 0), 1.0 - 0.006 * Math.abs(w), o.z || 0], tronco: [1.5 + 1.2 * Math.sin(T * 1.1), (o.gira || 0) + 2 * Math.sin(T * 0.5), -1.6 * w],
      cabeza: [3 * Math.sin(T * 0.9 + 1), 0, 1.8 * w], pieI: [-0.19 + (o.x || 0), 0.115, 0.02 + (o.z || 0)], pieD: [0.19 + (o.x || 0), 0.115, 0.02 + (o.z || 0)]
    };
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D', sw = 0.02 * Math.sin(T * 0.8 + s);
      p['mano' + L] = [s * 0.33 + (o.x || 0), 0.86 + sw, 0.06 + (o.z || 0)]; p['codo' + L] = [0.35, 0.2, -1];
      if (s === gl && g > 0) {
        // la mano que acompana lo que dice: sube al frente, palma arriba
        var k = Easing.easeInOutSine(g);
        p['mano' + L] = E3.lerp3(p['mano' + L], [s * 0.3 + (o.x || 0), 1.18 + 0.05 * Math.sin(T * 3.2), 0.38 + (o.z || 0)], k);
        p['codo' + L] = E3.lerp3([0.35, 0.2, -1], [0.6, -0.6, -0.3], k);
      }
    });
    return p;
  }
  // gira la cabeza para que mire a la camara (k 0..1); devuelve la pose cambiada
  function mirarCamara(p, cam, k) {
    if (!k) return p;
    var giro = (p.tronco || [0, 0, 0])[1] || 0;
    var yaw = clamp(((cam.az || 0) - giro + 540) % 360 - 180, -65, 65);
    var hy = 1.75, dist = cam.dist || 5, ch = (cam.y == null ? 0.95 : cam.y) + dist * Math.sin((cam.el || 0) * Math.PI / 180);
    var pitch = clamp(Math.atan2(ch - hy, dist) * 180 / Math.PI, -25, 30);
    var c = p.cabeza || [0, 0, 0];
    p.cabeza = [c[0] + (pitch - c[0]) * k, c[1] + (yaw - c[1]) * k, c[2] * (1 - k)];
    return p;
  }
  // senala a la camara con una mano (k 0..1): el brazo estirado hacia el que mira
  function senalar(p, cam, k, lado) {
    if (!k) return p;
    var s = lado || 1, L = s < 0 ? 'I' : 'D';
    var az = (cam.az || 0) * Math.PI / 180, x0 = (p.cadera || [0, 1, 0])[0];
    var objetivo = [x0 + s * 0.16 + Math.sin(az) * 0.62, 1.45, Math.cos(az) * 0.62];
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    p['mano' + L] = E3.lerp3(p['mano' + L] || [s * 0.33, 0.86, 0.06], objetivo, e);
    p['codo' + L] = E3.lerp3(p['codo' + L] || [0.35, 0.2, -1], [0.3, -1, 0], e);
    return p;
  }

  // un ciclo de repeticion (u en repeticiones): sube 40 %, aguanta un poco, baja lento
  function rep(u) { u = u - Math.floor(u); if (u < 0.4) return Easing.easeInOutSine(u / 0.4); if (u < 0.5) return 1; return 1 - Easing.easeInOutSine((u - 0.5) / 0.5); }
  // curl con las dos manos (k 0 abajo .. 1 arriba); temblor sube y baja las manos (el esfuerzo)
  function curl(p, k, x, temblor, solo) {
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D';
      if (solo && solo !== L) return;
      var m = E3.lerp3([(x || 0) + s * 0.36, 0.84, 0.1], [(x || 0) + s * 0.42, 1.38, 0.3], Easing.easeInOutSine(clamp(k, 0, 1)));
      if (temblor) m[1] += temblor;
      p['mano' + L] = m; p['codo' + L] = [0.25, -0.3, -1];
    });
    return p;
  }
  // el eje de la mancuerna en el curl: neutro abajo, la palma arriba al subir
  function ejeCurl(k) { var a = clamp(k, 0, 1) * Math.PI / 2; return [Math.sin(a), 0, Math.cos(a)]; }
  // la boca: habla con la voz (abre) o queda en otra forma
  function boca(abre, otra) { return abre != null ? { boca: 'habla', abre: abre, cerrada: otra || 'sonrisa' } : { boca: otra || 'sonrisa' }; }

  /* ---------------- el medidor de repeticiones en reserva ---------------- */
  function Reserva(props) {
    var T = props.T, n = props.n, e = entrada(T, props.cuando, props.hasta);
    if (!e.visible) return null;
    var x = props.x, y = props.y + e.dy + M.life(T, 3, 4);
    var celdas = [0, 1, 2, 3].map(function (i) {
      var llena = n > i + 0.01, col = i === 0 ? C.RED : i === 3 ? C.GRN : C.YEL;
      return <rect key={i} x={-46} y={-40 - i * 46} width={92} height={38} rx={10} fill={llena ? col : '#3A362F'} stroke={C.INK} strokeWidth={5} />;
    });
    var num = Math.max(0, Math.ceil(n - 0.01));
    return (
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
        <g opacity={e.op} transform={'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + e.sc.toFixed(3) + ')'}>
          <rect x={-70} y={-250} width={140} height={300} rx={26} fill="#ffffff" stroke={C.INK} strokeWidth={7} />
          <g transform="translate(0 30)">{celdas}</g>
          <text x={0} y={-198} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={44} fill={num === 0 ? C.RED : C.INK}>{num}</text>
          <text x={0} y={98} textAnchor="middle" fontFamily={FUENTE} fontWeight={800} fontSize={30} fill="#ffffff" stroke={C.INK} strokeWidth={8} style={{ paintOrder: 'stroke' }} letterSpacing={2}>EN RESERVA</text>
        </g>
      </svg>
    );
  }
  // rebobinar (cuarta pared): lineas de video viejo y el simbolo de retroceso
  function Rebobina(props) {
    var T = props.T, a = props.desde, c = props.hasta;
    if (T < a || T > c) return null;
    var k = Math.min(clamp((T - a) / 0.15, 0, 1), clamp((c - T) / 0.15, 0, 1));
    var lineas = [];
    for (var i = 0; i < 14; i++) {
      var y = ((i * 151 + T * 2400) % 1920);
      lineas.push(<rect key={i} x={0} y={y} width={1080} height={6 + (i % 3) * 5} fill="#ffffff" opacity={0.18 + 0.1 * (i % 2)} />);
    }
    var pul = 0.85 + 0.15 * Math.sin(T * 18);
    return (
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
        <g opacity={k}>
          {lineas}
          <g transform={'translate(860 330) scale(' + pul.toFixed(3) + ')'}>
            <path d="M -70 0 L 0 -46 L 0 46 Z M 0 0 L 70 -46 L 70 46 Z" fill="#ffffff" stroke={C.INK} strokeWidth={8} strokeLinejoin="round" />
          </g>
          <text x={790} y={440} textAnchor="middle" fontFamily={FUENTE} fontWeight={800} fontSize={40} fill="#ffffff" stroke={C.INK} strokeWidth={9} style={{ paintOrder: 'stroke' }} letterSpacing={3}>REBOBINANDO</text>
        </g>
      </svg>
    );
  }

  /* ---------------- camara: un solo recorrido para todo el video ---------------- */
  // la camara pasa por las llaves con una curva continua (Hermite con las pendientes de las vecinas):
  // no frena en cada llave, solo al principio y al final (pedido del autor: "mas fluida")
  function camaraEn(keys, T, b) {
    var ks = keys.map(function (q) { return [b.de(q[0]), q[1]]; });
    var base, CAMPOS = ['az', 'el', 'dist', 'y', 'dx', 'dz', 'fov'];
    var val = function (i, n) {
      var q = ks[clamp(i, 0, ks.length - 1)][1];
      if (q[n] != null) return q[n];
      for (var j = 1; j < ks.length; j++) {
        var a2 = ks[clamp(i - j, 0, ks.length - 1)][1][n], b2 = ks[clamp(i + j, 0, ks.length - 1)][1][n];
        if (a2 != null) return a2; if (b2 != null) return b2;
      }
      return null;
    };
    var tiempo = function (i) { return ks[clamp(i, 0, ks.length - 1)][0]; };
    if (T <= ks[0][0]) base = ks[0][1];
    else if (T >= ks[ks.length - 1][0]) base = ks[ks.length - 1][1];
    else {
      for (var i = 0; i < ks.length - 1; i++) {
        if (T >= ks[i][0] && T <= ks[i + 1][0]) {
          var t0 = tiempo(i), t1 = tiempo(i + 1), h = Math.max(1e-3, t1 - t0), u = (T - t0) / h;
          var u2 = u * u, u3 = u2 * u;
          var h00 = 2 * u3 - 3 * u2 + 1, h10 = u3 - 2 * u2 + u, h01 = -2 * u3 + 3 * u2, h11 = u3 - u2;
          base = {};
          CAMPOS.forEach(function (n) {
            var v0 = val(i, n), v1 = val(i + 1, n);
            if (v0 == null && v1 == null) return;
            if (v0 == null) v0 = v1; if (v1 == null) v1 = v0;
            // pendientes: la de las vecinas (0 en la primera y la ultima llave)
            var m0 = i === 0 ? 0 : (v1 - val(i - 1, n)) / Math.max(1e-3, t1 - tiempo(i - 1));
            var m1 = i + 1 === ks.length - 1 ? 0 : (val(i + 2, n) - v0) / Math.max(1e-3, tiempo(i + 2) - t0);
            base[n] = h00 * v0 + h10 * h * m0 + h01 * v1 + h11 * h * m1;
          });
          break;
        }
      }
    }
    // camara en mano: una deriva lenta que nunca para
    var r = Object.assign({}, base);
    r.az = (r.az || 0) + 1.4 * Math.sin(T * 0.62) + 0.5 * Math.sin(T * 1.7 + 1);
    r.el = (r.el || 0) + 0.8 * Math.sin(T * 0.83 + 2);
    r.dist = (r.dist || 5.5) * (1 + 0.012 * Math.sin(T * 0.5 + 0.4));
    return r;
  }

  /* ---------------- poses suaves: lo que cambia de golpe entre escenas se funde en ~0,25 s ----------------
     se promedia la pose de este momento con la de unos instantes antes (pesos que bajan); solo los
     puntos y angulos de la pose, no la cara ni las mancuernas */
  var CAMPOS_POSE = ['cadera', 'tronco', 'cabeza', 'manoI', 'manoD', 'pieI', 'pieD', 'codoI', 'codoD', 'rodillaI', 'rodillaD', 'pies'];
  var ATRAS = [[0.04, 0.85], [0.08, 0.7], [0.12, 0.55], [0.17, 0.38], [0.22, 0.22]];
  function vistaSuave(def, T, b, cam, ex) {
    var base = def.vista(T, b, cam, ex) || {};
    if (def.suave === false || !base.figuras) return base;
    var acc = base.figuras.map(function (f) { return { w: 1, f: f, suma: {} }; });
    acc.forEach(function (a) {
      if (!a.f || !a.f.pose) return;
      CAMPOS_POSE.forEach(function (n) { var v = a.f.pose[n]; if (Array.isArray(v)) a.suma[n] = v.slice(); });
      if (a.f.pose.hombros) a.suma.hombros = [a.f.pose.hombros.sube || 0, a.f.pose.hombros.junta || 0];
    });
    ATRAS.forEach(function (q) {
      var Tq = T - q[0]; if (Tq < 0) return;
      var o = def.vista(Tq, b, cam, ex) || {};
      (o.figuras || []).forEach(function (f, i) {
        var a = acc[i]; if (!a || !a.f || !a.f.pose || !f || !f.pose || f.quien !== a.f.quien) return;
        var usa = false;
        Object.keys(a.suma).forEach(function (n) {
          var v = n === 'hombros' ? (f.pose.hombros ? [f.pose.hombros.sube || 0, f.pose.hombros.junta || 0] : [0, 0]) : f.pose[n];
          if (!Array.isArray(v) || v.length !== a.suma[n].length) return;
          for (var k = 0; k < v.length; k++) a.suma[n][k] += v[k] * q[1];
          usa = true;
        });
        if (usa) a.w += q[1];
      });
    });
    acc.forEach(function (a) {
      if (!a.f || !a.f.pose || a.w <= 1) return;
      var p = Object.assign({}, a.f.pose);
      Object.keys(a.suma).forEach(function (n) {
        var v = a.suma[n].map(function (x) { return x / a.w; });
        if (n === 'hombros') p.hombros = Object.assign({}, a.f.pose.hombros || {}, { sube: v[0], junta: v[1] });
        else p[n] = v;
      });
      a.f.pose = p;
    });
    return base;
  }

  /* ---------------- encuadre de todo el video (sin saltos entre escenas) ---------------- */
  function ajusteGlobal(def, b, cache) {
    var key = b.limites.join(',') + '|' + b.durs.join(',');
    if (cache.key === key) return cache.aj;
    var paso = 0.2, N = Math.ceil(b.total / paso), crudo = [];
    for (var i = 0; i <= N; i++) {
      var T = Math.min(b.total - 1e-3, i * paso), cam = camaraEn(def.camara, T, b);
      var info = vistaSuave(def, T, b, cam) || {}, vt = { figuras: info.figuras, objetos: info.objetos, encuadreExtra: info.encuadreExtra, camara: cam, T: T };
      var P = TOR3D.puntosVista(vt), zona = def.zona ? def.zona(T, b) : ZONA;
      if (!P.length) { crudo.push(null); continue; }
      var c1 = TOR3D.encuadrar(vt, zona, cam, P);
      var w = 1 - libreEn(def, T, b);
      crudo.push({ m: 1 + (c1.dist / cam.dist - 1) * w, dx: ((c1.dx || 0) - (cam.dx || 0)) * w, dy: ((c1.y == null ? 0.95 : c1.y) - (cam.y == null ? 0.95 : cam.y)) * w,
        dz: ((c1.dz == null ? -0.05 : c1.dz) - (cam.dz == null ? -0.05 : cam.dz)) * w });
    }
    var ult = { m: 1, dx: 0, dy: 0, dz: 0 };
    crudo = crudo.map(function (q) { if (q) { ult = q; return q; } return Object.assign({}, ult); });
    var dil = crudo.map(function (q, i) { var r = Object.assign({}, q); for (var k = -3; k <= 3; k++) { var w = crudo[i + k]; if (w && w.m > r.m) r.m = w.m; } return r; });
    var aj = dil.map(function (q, i) {
      var acc = { m: 0, dx: 0, dy: 0, dz: 0 }, n = 0;
      for (var k = -4; k <= 4; k++) { var w = dil[i + k]; if (!w) continue; acc.m += w.m; acc.dx += w.dx; acc.dy += w.dy; acc.dz += w.dz; n++; }
      return { m: Math.max(q.m, acc.m / n), dx: acc.dx / n, dy: acc.dy / n, dz: acc.dz / n };
    });
    cache.key = key; cache.aj = aj; cache.paso = paso;
    return aj;
  }
  function libreEn(def, T, b) {
    var v = 0;
    (def.libre || []).forEach(function (tr) {
      var a = b.de(tr[0]), c = b.de(tr[1]), r = 0.45;
      var k = Math.min(clamp((T - (a - r)) / r, 0, 1), clamp(((c + r) - T) / r, 0, 1));
      v = Math.max(v, Easing.easeInOutSine(k));
    });
    return v;
  }
  function aplicar(cam, aj, paso, T) {
    var x = T / paso, i = Math.min(aj.length - 2, Math.max(0, Math.floor(x))), u = clamp(x - i, 0, 1);
    var a = aj[i], c = aj[i + 1] || a, k = 0.5 - 0.5 * Math.cos(Math.PI * u);
    var r = Object.assign({}, cam);
    r.dist = cam.dist * (a.m + (c.m - a.m) * k);
    r.dx = (cam.dx || 0) + a.dx + (c.dx - a.dx) * k;
    r.y = (cam.y == null ? 0.95 : cam.y) + a.dy + (c.dy - a.dy) * k;
    r.dz = (cam.dz == null ? -0.05 : cam.dz) + a.dz + (c.dz - a.dz) * k;
    return r;
  }

  /* ---------------- el video ---------------- */
  function video(def) {
    var cache = {};
    var voz = function () { return (global.VOCES || {})[def.voz || def.id] || null; };
    function Plano(props) {
      var T = props.T, b = linea(props.limites, props.durs), vz = voz();
      var cam0 = camaraEn(def.camara, T, b);
      // sacudones (un toque en la pantalla, un golpe)
      var golpe = 0;
      (def.golpes || []).forEach(function (g) { var u = (T - b.de(g)) / 0.4; if (u > 0 && u < 1) golpe += (1 - u) * Math.sin(u * 38) * 1.4; });
      var cam = aplicar(cam0, ajusteGlobal(def, b, cache), cache.paso, T);
      cam.az += golpe; cam.el += golpe * 0.5;
      var info = vistaSuave(def, T, b, cam0, { voz: vz, abre: volumen(vz, T), abreDe: function (q) { return volumen(vz, T, q); } }) || {};
      var vt = { figuras: info.figuras, objetos: info.objetos, escenario: info.escenario || 'gym', camara: cam, T: T };
      var pr = function (q, i) { return TOR3D.proyectar(vt, q, i); };
      var e = M.pop(T, -0.6, 0.5);
      return (
        <div style={{ position: 'absolute', inset: 0, background: '#1B1714' }}>
          <A.Pos x={0} y={0} e={e} origen="50% 55%">
            <div style={{ position: 'relative', width: 1080, height: 1920 }}><TOR3D.Lienzo vista={vt} /></div>
          </A.Pos>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {/* viñeta: los bordes un poco mas oscuros, Tor en la luz */}
            <defs>
              <radialGradient id="ps-vineta" cx="50%" cy="48%" r="75%">
                <stop offset="55%" stopColor="#14110F" stopOpacity="0" />
                <stop offset="100%" stopColor="#14110F" stopOpacity="0.55" />
              </radialGradient>
            </defs>
            <rect x={0} y={0} width={1080} height={1920} fill="url(#ps-vineta)" />
            {def.lienzo ? def.lienzo(T, b, pr, info) : null}
          </svg>
          {def.encima ? def.encima(T, b, pr, info) : null}
          <Subtitulos T={T} voz={vz} claves={def.claves} y={def.ySub} hablantes={def.hablantes} />
          {def.sobre ? def.sobre(T, b, pr, info) : null}
        </div>
      );
    }
    // las duraciones de la voz (si ya esta preparada) mandan sobre las del archivo
    var vz0 = voz(), escenas = def.escenas.map(function (e, i) {
      var d = vz0 && vz0.durs && vz0.durs.length >= def.escenas.length ? vz0.durs[i] : e.dur;
      return { nombre: e.nombre, vo: e.vo, habla: e.habla, dur: d, C: Plano, continua: true };
    });
    var accion = def.accion;
    if (accion && vz0 && vz0.durs && vz0.durs.length > def.escenas.length) accion = Object.assign({}, accion, { dur: vz0.durs[def.escenas.length] });
    global.REELS.registrar({ id: def.id, titulo: def.titulo, estilo: 2, escenas: escenas, accion: accion, cierreVo: def.cierreVo, colabora: def.colabora });
  }

  global.PS = {
    video: video, linea: linea, volumen: volumen, hablando: hablando, Subtitulos: Subtitulos,
    Tarjeta: Tarjeta, Etiqueta: Etiqueta, Estudio: Estudio, Barras: Barras, Encuesta: Encuesta, Grande: Grande, Toque: Toque,
    depie: depie, mirarCamara: mirarCamara, senalar: senalar, camaraEn: camaraEn, ZONA: ZONA,
    rep: rep, curl: curl, ejeCurl: ejeCurl, boca: boca, Reserva: Reserva, Rebobina: Rebobina
  };
})(window);
