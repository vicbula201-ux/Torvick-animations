/* ============================================================
   ESCENAS CON TOR EN 3D (window.E3): el armador comun de los reels 3D.
   E3.escena({...}) arma una escena del reel con TOR3D: camara que gira con
   deriva de camara en mano, el golpe de las X, la figura que entra con pop,
   y encima los rotulos nuevos (E3.Rot), las X, los vistos, flechas y efectos.

     E3.escena({
       tomas: [[0, { az, el, dist, y }], [1, {...}]],   // camara (fracciones)
       vista: function (T, f, t) { return { figuras | pose, musc, cara, pesas, objetos, fantasmas, vibra }; },
       lienzo: function (T, f, t, pr, info) { return <g>...</g>; },   // SVG sobre la figura
       encima: function (T, f, t, pr, info) { ... },                   // fuera del SVG (B.Cuenta)
       mal: [{ x, y, cuando, hasta }], bien: [...],
       r1: { text: 'REMA AL *ABDOMEN*', cuando, tono }, r2: {...}
     })
   pr(que, i) proyecta un punto (articulacion, 'm:pecho', [x,y,z]) de la figura i.

   E3.Rot: rotulo negro con punta, texto en Barlow 800, sombra dura de color
   (amarillo; 'rojo' para el error, 'verde' para la correccion) y la palabra
   entre asteriscos en amarillo. Entra abriendose de izquierda a derecha.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, V = global.V, B = global.B, TOR3D = global.TOR3D;
  var Easing = global.Easing, clamp = global.clamp;
  var A = global.REELS.ayudas;
  var C = global.P.C;
  var TONO = { amarillo: C.YEL, rojo: C.RED, verde: C.GRN, gris: C.GRY };

  /* ---------------- rotulo pulido ---------------- */
  var CTX = null;
  function medir(txt, px) {
    if (!CTX) CTX = document.createElement('canvas').getContext('2d');
    CTX.font = '800 ' + px + 'px "Barlow Semi Condensed", sans-serif';
    return CTX.measureText(txt).width;
  }
  function trozos(text) {
    return String(text).toUpperCase().split('*').map(function (t, i) { return { t: t, clave: i % 2 === 1 }; }).filter(function (q) { return q.t; });
  }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h).toString(36); }
  function Rot(props) {
    var T = props.T, s = props.s || 1, px = 62 * s, esp = 1.2 * s;
    var H = 94 * s, pad = 32 * s, punta = 38 * s, sh = 10 * s, r = 14 * s;
    var tz = trozos(props.text);
    var tw = 0; tz.forEach(function (q) { q.w = medir(q.t, px) + esp * q.t.length; tw += q.w; });
    var W = tw + pad * 2 + punta;
    var x = props.x == null ? (1080 - W) / 2 : props.x;
    var u = T - props.cuando;
    if (u < 0) return null;
    var kF = Easing.easeOutExpo(clamp(u / 0.45, 0, 1));
    var kT = Easing.easeOutCubic(clamp((u - 0.12) / 0.34, 0, 1));
    var kS = Easing.easeOutBack(clamp((u - 0.18) / 0.42, 0, 1));
    var w = Math.max(r * 2, (W - punta) * kF), pk = punta * kF;
    var forma = function (dx, dy) {
      return 'M ' + (dx + r) + ' ' + dy + ' L ' + (dx + w) + ' ' + dy + ' L ' + (dx + w + pk) + ' ' + (dy + H / 2) + ' L ' + (dx + w) + ' ' + (dy + H) +
        ' L ' + (dx + r) + ' ' + (dy + H) + ' Q ' + dx + ' ' + (dy + H) + ' ' + dx + ' ' + (dy + H - r) + ' L ' + dx + ' ' + (dy + r) + ' Q ' + dx + ' ' + dy + ' ' + (dx + r) + ' ' + dy + ' Z';
    };
    var id = 'r3' + hash(props.text + '|' + props.y);
    var dy = M.life(T, 3.4, 5, props.fase || 0);
    var acento = TONO[props.tono] || C.YEL;
    var xs = pad;
    return (
      <div style={{ position: 'absolute', left: x, top: props.y, transform: 'translateY(' + dy.toFixed(1) + 'px)' }}>
        <svg width={W + sh + 4} height={H + sh + 4} style={{ display: 'block', overflow: 'visible' }}>
          <defs><clipPath id={id}><path d={forma(0, 0)} /></clipPath></defs>
          <path d={forma(sh * kS, sh * kS)} fill={acento} opacity={clamp(kS * 1.4, 0, 1)} />
          <path d={forma(0, 0)} fill={C.INK} />
          <g clipPath={'url(#' + id + ')'}>
            <text y={H / 2 + px * 0.36 + (1 - kT) * 40} fontFamily="'Barlow Semi Condensed', sans-serif" fontWeight={800}
              fontSize={px} letterSpacing={esp} opacity={kT}>
              {tz.map(function (q, i) {
                var el = <tspan key={i} x={xs} fill={q.clave ? C.YEL : '#ffffff'}>{q.t}</tspan>;
                xs += q.w; return el;
              })}
            </text>
          </g>
        </svg>
      </div>
    );
  }

  /* ---------------- ayudas ---------------- */
  // repeticion: va rapido, aguanta y vuelve lento
  function rep(T, a, b, n, va, aguanta) { return V.ida(V.fase(T, a, b, n), va == null ? 0.36 : va, aguanta == null ? 0.14 : aguanta); }
  // la camara: tomas + deriva de camara en mano
  function camara(tomas, t, T, acerca) {
    var c = Object.assign({}, TOR3D.tomaEn(tomas, t));
    c.az = (c.az || 0) + Math.sin(T * 0.7) * 1.4;
    c.el = (c.el || 0) + Math.sin(T * 0.9 + 1) * 0.7;
    c.dist = (c.dist || 7) * (acerca || 1) * (1 + Math.sin(T * 0.5 + 2) * 0.008);
    return c;
  }
  // flecha en el lienzo entre dos puntos de pantalla, dibujada de a poco
  function Flecha(props) {
    var a = props.a, b = props.b, p = clamp(props.p, 0, 1);
    if (p < 0.01) return null;
    var x = a[0] + (b[0] - a[0]) * p, y = a[1] + (b[1] - a[1]) * p;
    var ang = Math.atan2(y - a[1], x - a[0]), L = 34;
    var punta = 'M ' + (x - L * Math.cos(ang - 0.5)).toFixed(1) + ' ' + (y - L * Math.sin(ang - 0.5)).toFixed(1) + ' L ' + x.toFixed(1) + ' ' + y.toFixed(1) +
      ' L ' + (x - L * Math.cos(ang + 0.5)).toFixed(1) + ' ' + (y - L * Math.sin(ang + 0.5)).toFixed(1);
    var col = props.color || C.GRN;
    var linea = props.curva ? 'M ' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' Q ' + props.curva[0] + ' ' + props.curva[1] + ' ' + x.toFixed(1) + ' ' + y.toFixed(1)
      : 'M ' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L ' + x.toFixed(1) + ' ' + y.toFixed(1);
    return (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={props.opacity}>
        <path d={linea} stroke={C.INK} strokeWidth={26} />
        <path d={punta} stroke={C.INK} strokeWidth={26} />
        <path d={linea} stroke={col} strokeWidth={13} />
        <path d={punta} stroke={col} strokeWidth={13} />
      </g>
    );
  }
  // guia punteada entre dos puntos (la espalda recta, la trayectoria)
  function Guia(props) {
    var a = props.a, b = props.b, p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.01) return null;
    return <path d={'M ' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L ' + (a[0] + (b[0] - a[0]) * p).toFixed(1) + ' ' + (a[1] + (b[1] - a[1]) * p).toFixed(1)}
      stroke={props.color || C.YEL} strokeWidth={props.w || 16} strokeDasharray="34 22" strokeLinecap="round" fill="none" opacity={Math.min(1, p * 2)} />;
  }
  // el musculo que trabaja: resplandor (y destellos) sobre los puntos dados
  function brilla(T, pr, puntos, v, destellos, r) {
    if (v < 0.02) return null;
    var cs = puntos.map(function (q) { return pr(q); });
    var m = [0, 0]; cs.forEach(function (c) { m[0] += c[0] / cs.length; m[1] += c[1] / cs.length; });
    return (
      <g>
        {cs.map(function (c, i) { return <V.Halo key={i} T={T} c={c} r={r || 80} v={v} opacidad={0.5} />; })}
        {destellos ? <V.Destellos T={T} c={m} r={(r || 80) * 2.1} v={v} n={6} /> : null}
      </g>
    );
  }
  function contador(T, a, b, n, x, y) {
    var u = clamp((T - a) / (b - a), 0, 1) * n, hechas = Math.min(n, Math.floor(u + 0.62));
    var e = M.pop(T, a - 0.1, 0.4);
    return (
      <A.Pos x={x == null ? 60 : x} y={y == null ? 1080 : y} e={e} dy={M.life(T, 3, 4)}>
        <B.Cuenta n={hechas} p={u / n} s={0.62} />
      </A.Pos>
    );
  }
  function suma(a, b, k) { return a.clone().add(b.clone().multiplyScalar(k)); }
  function lerp3(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function medio(a, b) { return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; }
  function arr(p) { return [p.x, p.y, p.z]; }

  /* ---------------- piezas 2D encima (iconos de los videos con Tor, como en PL) ---------------- */
  function valor(v, T, f) { return typeof v === 'function' ? v(T, f) : v; }
  function Pieza(props) {
    var o = props.o, T = props.T, f = props.f, at = props.at;
    var e = o.cuando == null ? M.pop(T, at - 0.6, 0.5) : M.pop(T, f(o.cuando), 0.42);
    if (o.hasta != null) e = A.junta(e, A.sale(T, f(o.hasta)));
    var Cmp = o.C;
    var p = Object.assign({ s: o.s == null ? 1 : o.s }, valor(o.p, T, f) || {});
    var cuerpo = <Cmp {...p} />;
    if (o.plato) {
      var N = global.N, lado = 420 * o.plato;
      cuerpo = (
        <div style={{ position: 'relative', width: lado, height: lado }}>
          <N.Plato s={o.plato} />
          <div style={{ position: 'absolute', left: (lado - 240 * p.s) / 2, top: (lado - 240 * p.s) / 2 }}>{cuerpo}</div>
        </div>
      );
    }
    return (
      <A.Pos x={valor(o.x, T, f)} y={valor(o.y, T, f)} e={e} dx={o.vibra ? M.vibra(T, 30, 3) : 0}
        dy={o.quieto ? 0 : M.life(T, 3, 6, o.fase != null ? o.fase : props.i * 0.13)}>
        {cuerpo}
      </A.Pos>
    );
  }

  /* ---------------- armador de escenas ---------------- */
  function armarVista(o, T, f, t) {
    var info = o.vista(T, f, t) || {};
    var figs = info.figuras || [{ quien: info.quien || 'tor', pose: info.pose, musc: info.musc, cara: info.cara, ropa: info.ropa, pesas: info.pesas, fantasmas: info.fantasmas }];
    var legado = info.pose && (info.pose.bisagra != null || info.pose.remo != null);
    figs.forEach(function (fg, i) {
      if (fg.pose && fg.pose.respira == null) fg.pose.respira = Math.sin(T * 2.3 + i);
      fg.cara = Object.assign({ parpadeo: V.parpadeo(T, i * 0.9) }, fg.cara || {});
      fg.T = T;
    });
    var vt = legado ? { pose: info.pose, musc: info.musc, cara: figs[0].cara, fantasmas: info.fantasmas, objetos: info.objetos, T: T }
      : { figuras: figs, objetos: info.objetos, T: T };
    return { info: info, vt: vt };
  }
  // la zona donde tiene que quedar el avatar entero: debajo del rotulo de arriba y encima del de abajo
  function zonaDe(o) {
    if (o.zona) return o.zona;
    return [44, 250, 1036, 1600];
  }
  // el rectangulo que ocupa un rotulo (mismas medidas que Rot); i 0 arriba, 1 abajo
  function rectRot(r, i) {
    var s = r.s || 1, px = 62 * s, tw = 0;
    trozos(r.text).forEach(function (q) { tw += medir(q.t, px) + 1.2 * s * q.t.length; });
    var W = tw + 70 * s + 38 * s, H = 94 * s;
    var x = r.x == null ? (1080 - W) / 2 : r.x, y = r.y != null ? r.y : (i ? 1470 : 262);
    return [x - 10, y - 10, x + W + 18, y + H + 20];
  }
  // tamano (a escala 1) de las piezas 2D que no miden 240 x 240
  var TAM = null;
  function tamPieza(Cmp) {
    if (!TAM) {
      var P2 = global.P || {}, MU = global.MU || {}, B = global.B || {}, N = global.N || {};
      TAM = [[P2.Medidor, 300, 108], [MU.Despertador, 240, 260], [B.Cuenta, 220, 220], [N.Dial, 300, 220], [P2.Pesa, 420, 160],
        [P2.Parlante, 220, 230], [P2.Nube, 620, 460], [P2.Corazon, 110, 100], [MU.Mesita, 220, 240]].filter(function (q) { return q[0]; });
    }
    for (var i = 0; i < TAM.length; i++) if (TAM[i][0] === Cmp) return [TAM[i][1], TAM[i][2]];
    return [240, 240];
  }
  // donde quedan las piezas fijas de la escena (sin el aire de cada icono); libre: true = puede ir encima del avatar
  function rectsPiezas(o) {
    return (o.piezas || []).map(function (pz) {
      if (pz.libre || typeof pz.x !== 'number' || typeof pz.y !== 'number') return null;
      var s = pz.s == null ? 1 : pz.s, t = tamPieza(pz.C);
      var w = pz.plato ? 420 * pz.plato : t[0] * s, h = pz.plato ? 420 * pz.plato : t[1] * s, m = 0.1;
      return [pz.x + w * m, pz.y + h * m, pz.x + w * (1 - m), pz.y + h * (1 - m)];
    }).filter(Boolean);
  }
  // el rectangulo libre de la zona (sin piezas) donde el avatar (ancho/alto = asp) entra mas grande
  function zonaLibre(zona, rects, asp) {
    rects = rects.filter(function (r) { return r[0] < zona[2] && r[2] > zona[0] && r[1] < zona[3] && r[3] > zona[1]; });
    if (!rects.length) return zona;
    var aire = 18, xs = [zona[0], zona[2]], ys = [zona[1], zona[3]];
    rects.forEach(function (r) { xs.push(r[0] - aire, r[2] + aire); ys.push(r[1] - aire, r[3] + aire); });
    xs = xs.filter(function (x) { return x >= zona[0] && x <= zona[2]; });
    ys = ys.filter(function (y) { return y >= zona[1] && y <= zona[3]; });
    var mejor = zona, alto = -1;
    xs.forEach(function (a) { xs.forEach(function (b) { if (b < a + 80) return;
      ys.forEach(function (c) { ys.forEach(function (d) { if (d < c + 120) return;
        for (var k = 0; k < rects.length; k++) { var r = rects[k]; if (r[0] < b && r[2] > a && r[1] < d && r[3] > c) return; }
        var h = Math.min((b - a) / asp, d - c);
        if (h > alto + 0.5) { alto = h; mejor = [a, c, b, d]; }
      }); });
    }); });
    return mejor;
  }
  // el ajuste de camara de toda la escena: se mide en 25 momentos (el avatar entero adentro en
  // todos) y se suaviza, asi la camara no respira con cada repeticion
  function ajusteEscena(o, at, dur, cache) {
    var key = at.toFixed(3) + '|' + dur.toFixed(3);
    if (cache[key]) return cache[key];
    var N = 24, zona = zonaDe(o), crudo = [], muestras = [];
    var f = function (x) { return at + dur * x; };
    var caja = null;
    for (var i = 0; i <= N; i++) {
      var ts = i / N, Ts = at + dur * ts;
      var a = armarVista(o, Ts, f, ts);
      var c0 = camara(o.tomas, ts, Ts, o.acerca);
      var P = TOR3D.puntosVista(a.vt);
      muestras.push({ a: a, c0: c0, P: P });
      if (P.length) {
        var bb = TOR3D.cajaEnPantalla(P, c0);
        caja = caja ? { x0: Math.min(caja.x0, bb.x0), y0: Math.min(caja.y0, bb.y0), x1: Math.max(caja.x1, bb.x1), y1: Math.max(caja.y1, bb.y1) } : bb;
      }
    }
    // las piezas 2D fijas no van encima del avatar: se le deja la parte libre de la zona
    // o.ocupa: otros rectangulos de pantalla que dibuja la escena (un termometro, una grilla) [x0, y0, x1, y1]
    var rots = o.zona ? [] : [o.r1, o.r2].map(function (r, i) { return r ? rectRot(r, i) : null; }).filter(Boolean);
    if (caja) zona = zonaLibre(zona, rectsPiezas(o).concat(o.ocupa || [], rots), Math.max(0.15, (caja.x1 - caja.x0) / Math.max(1, caja.y1 - caja.y0)));
    muestras.forEach(function (q) {
      // sin puntos (el avatar no esta o se va del cuadro a proposito): se completa con los vecinos
      if (!q.P.length) { crudo.push(null); return; }
      var c1 = TOR3D.encuadrar(q.a.vt, zona, q.c0, q.P), c0 = q.c0;
      crudo.push({ m: c1.dist / c0.dist, dx: (c1.dx || 0) - (c0.dx || 0), dy: (c1.y == null ? 0.95 : c1.y) - (c0.y == null ? 0.95 : c0.y), dz: (c1.dz == null ? -0.05 : c1.dz) - (c0.dz == null ? -0.05 : c0.dz) });
    });
    var primero = null;
    crudo.forEach(function (q) { if (q && !primero) primero = q; });
    if (!primero) primero = { m: 1, dx: 0, dy: 0, dz: 0 };
    var ultimo = null;
    crudo = crudo.map(function (q) { if (q) { ultimo = q; return q; } return Object.assign({}, ultimo || primero); });
    // el mayor alejamiento de los vecinos (anticipa) y un promedio (suaviza)
    var dil = crudo.map(function (q, i) {
      var r = { m: q.m, dx: q.dx, dy: q.dy, dz: q.dz };
      for (var k = -2; k <= 2; k++) { var w = crudo[i + k]; if (w && w.m > r.m) { r.m = w.m; } }
      return r;
    });
    var suave = dil.map(function (q, i) {
      var acc = { m: 0, dx: 0, dy: 0, dz: 0 }, n = 0;
      for (var k = -2; k <= 2; k++) { var w = dil[i + k]; if (!w) continue; acc.m += w.m; acc.dx += w.dx; acc.dy += w.dy; acc.dz += w.dz; n++; }
      return { m: Math.max(q.m, acc.m / n), dx: acc.dx / n, dy: acc.dy / n, dz: acc.dz / n };
    });
    cache[key] = suave;
    return suave;
  }
  function aplicarAjuste(c, aj, t) {
    var N = aj.length - 1, x = clamp(t, 0, 1) * N, i = Math.min(N - 1, Math.floor(x)), u = x - i;
    var a = aj[i], b = aj[i + 1] || a, k = 0.5 - 0.5 * Math.cos(Math.PI * u);
    var r = Object.assign({}, c);
    r.dist = (c.dist || 7) * (a.m + (b.m - a.m) * k);
    r.dx = (c.dx || 0) + a.dx + (b.dx - a.dx) * k;
    r.y = (c.y == null ? 0.95 : c.y) + a.dy + (b.dy - a.dy) * k;
    r.dz = (c.dz == null ? -0.05 : c.dz) + a.dz + (b.dz - a.dz) * k;
    return r;
  }
  // las X y los vistos no tapan al avatar: si caen encima, se corren al costado libre
  function correrMarca(m, caja, ancho) {
    if (!caja) return m;
    var w = ancho, x = m.x, y = m.y;
    var choca = x < caja.x1 + 12 && x + w > caja.x0 - 12 && y < caja.y1 && y + w > caja.y0;
    if (!choca) return m;
    var izq = caja.x0 - 24 - w, der = caja.x1 + 24;
    if (izq >= 16 && (der + w > 1064 || Math.abs(izq - x) < Math.abs(der - x))) x = izq;
    else if (der + w <= 1064) x = der;
    else y = caja.y0 - w - 20 > 380 ? caja.y0 - w - 20 : Math.min(1450 - w, caja.y1 + 20);
    return Object.assign({}, m, { x: x, y: y });
  }

  function escena(o) {
    var cache = {};
    return function Escena(props) {
      var T = props.T, at = props.at, dur = props.dur;
      var f = function (v) { return at + dur * v; };
      var t = clamp((T - at) / dur, 0, 1);
      var a0 = armarVista(o, T, f, t), info = a0.info, vt = a0.vt;
      vt.camara = camara(o.tomas, t, T, o.acerca);
      var caja = null;
      if (o.encuadre !== false) {
        vt.camara = aplicarAjuste(vt.camara, ajusteEscena(o, at, dur, cache), t);
        var P = TOR3D.puntosVista(vt);
        if (P.length) caja = TOR3D.cajaEnPantalla(P, vt.camara);
      }
      var golpe = 0;
      (o.mal || []).map(function (m) { return m.cuando; }).concat(o.golpes || []).forEach(function (c) { var u = (T - f(c)) / 0.35; if (u > 0 && u < 1) golpe += (1 - u) * Math.sin(u * 40) * 10; });
      // el temblor va en la camara 3D (mover la imagen la volvia borrosa)
      var sacude = (info.vibra ? M.vibra(T, 30, 4) : 0) + golpe;
      if (sacude) vt.camara = Object.assign({}, vt.camara, { az: (vt.camara.az || 0) + sacude * 0.016 });
      var pr = function (q, i) { return TOR3D.proyectar(vt, q, i); };
      var e = M.pop(T, at - 0.6, 0.5);
      var mal = (o.mal || []).map(function (m) { return correrMarca(m, caja, 240 * (m.s || 0.5)); });
      var bien = (o.bien || []).map(function (b) { return correrMarca(b, caja, 240 * (b.s || 0.55)); });
      var rot = function (r, i) {
        if (!r) return null;
        return <Rot key={'r' + i} T={T} text={r.text} y={r.y != null ? r.y : (i ? 1470 : 262)} x={r.x} s={r.s || 1} fase={i * 0.4}
          tono={r.tono} cuando={r.cuando == null ? at - 0.6 : f(r.cuando)} />;
      };
      return (
        <div style={{ position: 'absolute', inset: 0 }}>
          <A.Pos x={0} y={0} e={e} origen="50% 55%">
            <div style={{ position: 'relative', width: 1080, height: 1920 }}><TOR3D.Lienzo vista={vt} /></div>
          </A.Pos>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {o.lienzo ? o.lienzo(T, f, t, pr, info) : null}
          </svg>
          {(o.piezas || []).map(function (pz, i) { return <Pieza key={'p' + i} o={pz} T={T} f={f} at={at} i={i} />; })}
          {o.encima ? o.encima(T, f, t, pr, info) : null}
          {mal.map(function (m, i) {
            return <A.Mal key={'m' + i} T={T} cuando={f(m.cuando)} hasta={m.hasta == null ? null : f(m.hasta)} x={m.x} y={m.y} s={m.s || 0.5} />;
          })}
          {bien.map(function (b, i) {
            return <A.Bien key={'b' + i} T={T} cuando={f(b.cuando)} hasta={b.hasta == null ? null : f(b.hasta)} x={b.x} y={b.y} s={b.s || 0.55} fase={i * 0.4} />;
          })}
          {rot(o.r1, 0)}
          {rot(o.r2, 1)}
        </div>
      );
    };
  }

  /* ---------------- poses que se repiten ---------------- */
  // de pie sacando biceps: flex 0 brazos abajo .. 1 doble biceps
  function poseFlex(flex, extra) {
    var e = clamp(flex, 0, 1);
    var p = Object.assign({ cadera: [0, 1.0, 0], pieI: [-0.2, 0.115, 0.02], pieD: [0.2, 0.115, 0.02], cabeza: [4 * e, 0, 0] }, extra || {});
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D';
      p['mano' + L] = lerp3([s * 0.34, 0.83, 0.08], [s * 0.7, 1.95, 0.1], e);
      p['codo' + L] = lerp3([0.35, 0.2, -1], [0.5, -1, 0.05], e);
    });
    return p;
  }

  // la novia de pie con las manos en la cadera; abre 0..1 las manos un poco
  function poseNovia(extra) {
    return Object.assign({
      cadera: [0, 1.0, 0], tronco: [0, 0, 2], cabeza: [3, 0, -4],
      pieI: [-0.17, 0.115, 0.02], pieD: [0.11, 0.115, 0.1],
      manoI: [-0.33, 1.06, -0.02], manoD: [0.33, 1.06, -0.02], codoI: [1, -0.1, -0.4], codoD: [1, -0.1, -0.4]
    }, extra || {});
  }

  /* ---------------- formato top 3 ---------------- */
  function cuenta(n, x, y, cuando) {
    return function (T, f) {
      return (
        <A.Pos x={x} y={y} e={M.pop(T, cuando == null ? f(0) - 0.6 : f(cuando), 0.5)} dy={M.life(T, 3, 5)}>
          <B.Cuenta s={0.9} n={n} p={1} />
        </A.Pos>
      );
    };
  }
  // gancho: Tor (o la novia) saca biceps con el musculo encendido, "TOP 3 <MUSCULO>" y el 3
  // o: { musculo, musc, brillo: ['m:pecho:0', ...], quien, tomas, s1, figura(T, f, fl) -> figura }
  function gancho(o) {
    return escena({
      tomas: o.tomas || [[0, { az: 16, el: 6, dist: 4.4, y: 1.4 }], [1, { az: 6, el: 4, dist: 6.4, y: 1.1 }]],
      vista: function (T, f) {
        var fl = Easing.easeOutBack(clamp((T - f(0.04)) / (f(0.3) - f(0.04)), 0, 1));
        var fig = o.figura ? o.figura(T, f, fl) : { quien: o.quien || 'tor', pose: poseFlex(fl * (o.flex == null ? 1 : o.flex)), cara: { boca: 'sonrisa' } };
        fig.musc = Object.assign({ brillo: 0.3 }, o.musc);
        return { figuras: [fig] };
      },
      lienzo: function (T, f, t, pr) { return brilla(T, pr, o.brillo, 1, true, o.r || 95); },
      encima: cuenta(3, 40, 1060, 0.3),
      zona: o.zona || [200, 378, 880, 1452],
      r1: { text: 'TOP 3 *' + o.musculo + '*', s: o.s1 || 1.1, cuando: 0.02 },
      r2: { text: 'SEGÚN LA *CIENCIA*', cuando: 0.4 }
    });
  }
  // un ejercicio: una repeticion (k 0 estirado .. 1 contraido) con brillo al estirar y chispa al contraer
  // o: { n, r1, r2, s1, s2, tomas, reps, va, brillo: [...], r, vista(T, f, k, kEn) -> { figuras, objetos } }
  function ejercicio(o) {
    var rp = function (Tx, f) { return V.ida(V.fase(Tx, f(0.05), f(0.95), o.reps || 1), o.va || 0.45, 0.12); };
    return escena({
      tomas: o.tomas, acerca: o.acerca,
      vista: function (T, f) {
        var k = rp(T, f);
        var r = o.vista(T, f, k, function (dt) { return rp(T - dt, f); });
        r.k = k; return r;
      },
      lienzo: function (T, f, t, pr, info) {
        return (
          <g>
            {brilla(T, pr, o.brillo, 1 - 0.7 * info.k, false, o.r || 85)}
            {o.brillo.map(function (q, i) { return <V.Chispa key={i} T={T} c={pr(q)} cuando={f(0.5)} r={o.r || 85} />; })}
            {o.lienzo ? o.lienzo(T, f, t, pr, info) : null}
          </g>
        );
      },
      encima: cuenta(o.n, 40, 380),
      zona: o.zona || [200, 378, 1036, 1452],
      r1: { text: o.r1, s: o.s1 || 1.05, cuando: null },
      r2: { text: o.r2, s: o.s2 || 1, cuando: 0.2 }
    });
  }
  // fantasmas de una figura: la misma pose unos instantes antes, si se mueve
  function fantasmas(poseDe, kEn, k) {
    var r = [];
    if (!kEn) return r;
    [0.04, 0.08, 0.12].forEach(function (dt) { var k2 = kEn(dt); if (Math.abs(k2 - k) > 0.04) r.push(poseDe(k2)); });
    return r;
  }

  global.PIEZAS3D = global.PIEZAS3D || {};
  global.E3 = {
    escena: escena, Rot: Rot, rep: rep, camara: camara, Flecha: Flecha, Guia: Guia, brilla: brilla, contador: contador,
    suma: suma, arr: arr, lerp3: lerp3, medio: medio,
    poseFlex: poseFlex, poseNovia: poseNovia, cuenta: cuenta, gancho: gancho, ejercicio: ejercicio, fantasmas: fantasmas
  };
})(window);
