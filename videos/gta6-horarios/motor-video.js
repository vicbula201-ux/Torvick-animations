/* motor-video.js
   Una sola línea de tiempo maestra (GSAP, en pausa). Cada escena agrega tweens en tiempos absolutos.
   API para el render:  window.__seek(t)  window.__duration  window.__ready  window.__cues
   Reglas: nada de animaciones CSS ni setTimeout; nada de Math.random (el azar es con semilla fija,
   así los 4 procesos de render dibujan exactamente lo mismo). */
(function () {
  'use strict';
  const W = 1080, H = 1920;
  const TL = gsap.timeline({ paused: true });
  const cues = [];
  const updaters = [];   // funciones puras de t que corren después de cada TL.seek (contadores, confeti, tipeo)
  const lienzo = document.getElementById('lienzo');
  const modoRender = /[?&]render/.test(location.search);

  // ---------- tiempos ----------
  const T = { inicio: {}, dur: {}, fin: {}, total: 0 };
  {
    let acc = 0;
    for (const [n, d] of TIEMPOS.escenas) { T.inicio[n] = acc; T.dur[n] = d; acc = +(acc + d).toFixed(4); T.fin[n] = acc; }
    T.total = acc;
  }

  // ---------- azar determinista ----------
  function semilla(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const azar = semilla(19112026);

  // ---------- sonido: la animación registra cada efecto en su tiempo exacto ----------
  function cue(t, tipo, gan = 1, extra) {
    cues.push(Object.assign({ t: Math.max(0, +t.toFixed(4)), tipo, gan: +gan.toFixed(3) }, extra || {}));
  }

  // ---------- DOM ----------
  function nodo(tag, clase, padre, html) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (html != null) e.innerHTML = html;
    if (padre) padre.appendChild(e);
    return e;
  }
  function caja(padre, clase, r = {}, html) {
    const e = nodo('div', clase, padre, html);
    e.style.position = 'absolute';
    for (const [k, p] of [['x', 'left'], ['y', 'top'], ['w', 'width'], ['h', 'height']]) {
      if (r[k] != null) e.style[p] = r[k] + 'px';
    }
    return e;
  }
  function estilo(e, css) { Object.assign(e.style, css); return e; }
  function icono(n, tam = 40, grosor = 2.2) {
    return `<svg class="ico" width="${tam}" height="${tam}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round">${ICONOS[n]}</svg>`;
  }
  // posición de un elemento respecto de un ancestro posicionado (ignora transforms: sirve en la vista previa escalada)
  function rel(el, anc) {
    let x = 0, y = 0, e = el;
    while (e && e !== anc) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }
  const SVGNS = 'http://www.w3.org/2000/svg';
  function svgCapa(padre) {
    const s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('class', 'trazo-svg');
    padre.appendChild(s);
    return s;
  }
  function svgPath(svg, d, attrs) {
    const p = document.createElementNS(SVGNS, 'path');
    p.setAttribute('d', d);
    for (const k in attrs) p.setAttribute(k, attrs[k]);
    svg.appendChild(p);
    return p;
  }

  // ---------- escenas ----------
  function escena(nombre, o = {}) {
    const a = T.inicio[nombre], b = T.fin[nombre];
    const S = nodo('div', 'escena', document.getElementById('escenas'));
    S.dataset.escena = nombre;
    gsap.set(S, { autoAlpha: 0 });
    TL.set(S, { autoAlpha: 1 }, a);
    if (o.salida !== false) {
      TL.to(S, { autoAlpha: 0, y: -70, duration: TIEMPOS.salida, ease: 'power2.in' }, b - TIEMPOS.salida);
      cue(b - TIEMPOS.salida, 'salida', 0.25);
    }
    return { S, a, b };
  }

  // ---------- movimiento ----------
  // Aparición con rebote. Estado inicial con gsap.set + fromTo(immediateRender:false): nunca from() tardío.
  function pop(obj, t, o = {}) {
    const arr = gsap.utils.toArray(obj);
    if (!arr.length) return t;
    const st = o.stagger || 0, dur = o.dur || 0.55;
    const desde = Object.assign({ autoAlpha: 0, scale: 0.6, y: 26 }, o.desde);
    const hasta = Object.assign({ autoAlpha: 1, scale: 1, y: 0 }, o.hasta);
    gsap.set(arr, desde);
    TL.fromTo(arr, desde, Object.assign({}, hasta, { duration: dur, ease: o.ease || 'back.out(1.7)', stagger: st, immediateRender: false }), t);
    if (o.sonido !== false) arr.forEach((_, i) => cue(t + i * st, o.sonido || 'pop', o.gan == null ? 0.6 : o.gan));
    return t + dur + (arr.length - 1) * st;
  }
  function deslizar(obj, t, o = {}) {
    const dx = o.dx == null ? 90 : o.dx, dy = o.dy || 0;
    return pop(obj, t, Object.assign({
      desde: { autoAlpha: 0, x: dx, y: dy, scale: 1 }, hasta: { autoAlpha: 1, x: 0, y: 0, scale: 1 },
      ease: 'power3.out', dur: 0.6, sonido: 'whoosh', gan: 0.3,
    }, o));
  }
  function salir(obj, t, dur = 0.35) {
    TL.to(obj, { autoAlpha: 0, y: -40, duration: dur, ease: 'power2.in' }, t);
  }
  // cambia un elemento por otro (candado -> check, etc.)
  function cambiar(sale, entra, t, o = {}) {
    TL.to(sale, { autoAlpha: 0, scale: 0.4, duration: 0.18, ease: 'power2.in' }, t);
    pop(entra, t + 0.12, Object.assign({ desde: { autoAlpha: 0, scale: 0.3, y: 0 }, hasta: { autoAlpha: 1, scale: 1, y: 0 }, ease: 'back.out(2.4)', dur: 0.45 }, o));
  }
  // vida continua: oscila props entre su valor actual y el pedido, de a..b
  function vivo(obj, a, b, props, periodo = 2.6, ease = 'sine.inOut') {
    const media = periodo / 2;
    const n = Math.max(1, Math.floor((b - a) / media));
    TL.to(obj, Object.assign({}, props, { duration: media, ease, yoyo: true, repeat: n - 1 }), a);
  }
  function temblar(obj, t, amp = 16, dur = 0.55, sonido = 'error') {
    TL.to(obj, { keyframes: { x: [0, -amp, amp, -amp * 0.8, amp * 0.8, -amp * 0.5, amp * 0.5, -amp * 0.2, 0] }, duration: dur, ease: 'none' }, t);
    if (sonido) cue(t, sonido, 0.8);
  }

  // titular: "Sale el *jueves 19*"  (* resalta, | parte la línea)
  function titular(padre, texto, t, o = {}) {
    const h = caja(padre, 'titular', { x: 60, y: o.y == null ? 240 : o.y, w: W - 120 });
    if (o.tam) h.style.fontSize = o.tam + 'px';
    if (o.color) h.style.color = o.color;
    const internos = [];
    texto.split('|').forEach((linea, li) => {
      if (li) nodo('br', null, h);
      // palabras = lo que va entre espacios; cada palabra puede mezclar partes resaltadas ("*listo*?")
      const palabras = [];
      let cur = [], hl = false;
      for (const c of linea) {
        if (c === '*') { hl = !hl; continue; }
        if (c === ' ') { if (cur.length) palabras.push(cur); cur = []; continue; }
        const ult = cur[cur.length - 1];
        if (ult && ult.hl === hl) ult.txt += c; else cur.push({ txt: c, hl });
      }
      if (cur.length) palabras.push(cur);
      palabras.forEach((partes) => {
        const m = nodo('span', 'm', h);
        const w = nodo('span', 'w', m);
        partes.forEach((p) => nodo('span', p.hl ? 'hl' : null, w).textContent = p.txt);
        internos.push(w);
        h.appendChild(document.createTextNode(' '));
      });
    });
    if (t != null) {
      gsap.set(internos, { yPercent: 118 });
      TL.fromTo(internos, { yPercent: 118 }, { yPercent: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07, immediateRender: false }, t);
      cue(t, 'whoosh', 0.4);
    }
    return h;
  }

  // contador que crece (texto calculado desde un proxy que mueve la línea de tiempo)
  function contador(el, desde, hasta, t, dur, fmt = (v) => String(Math.round(v)), ease = 'power2.out') {
    const p = { v: desde };
    el.textContent = fmt(desde);
    TL.to(p, { v: hasta, duration: dur, ease }, t);
    updaters.push(() => { const s = fmt(p.v); if (el.textContent !== s) el.textContent = s; });
  }
  // tipeo letra por letra; devuelve el proxy para poder vaciarlo después (TL.set(p,{n:0}))
  function tipear(el, texto, t, cps = 26) {
    const p = { n: 0 };
    const dur = texto.length / cps;
    TL.to(p, { n: texto.length, duration: dur, ease: 'none' }, t);
    updaters.push(() => { const s = texto.slice(0, Math.floor(p.n + 1e-6)); if (el.textContent !== s) el.textContent = s; });
    for (let i = 0; i < texto.length; i++) if (texto[i] !== ' ') cue(t + i / cps, 'tecla', 0.3 + 0.12 * azar());
    return { p, fin: t + dur };
  }

  // confeti con física simple, calculado desde t (determinista)
  function confeti(padre, cx, cy, t, o = {}) {
    const n = o.n || 34, D = o.dur || 1.5, g = o.g || 1900;
    const cols = ['#FD0894', '#02F8F7', '#FEA632', '#12B76A', '#FFD23F'];
    const piezas = [];
    for (let i = 0; i < n; i++) {
      const e = nodo('div', 'confeti', padre);
      const w = 12 + azar() * 10, h = azar() < 0.4 ? w : 18 + azar() * 12;
      estilo(e, {
        width: w + 'px', height: h + 'px', background: cols[i % cols.length],
        borderRadius: azar() < 0.4 ? '50%' : '4px',
        left: cx + 'px', top: cy + 'px', marginLeft: -w / 2 + 'px', marginTop: -h / 2 + 'px',
      });
      const ang = (-90 + (azar() * 2 - 1) * (o.abanico || 70)) * Math.PI / 180;
      const v = (o.fuerza || 950) * (0.5 + azar() * 0.65);
      piezas.push({ e, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, r0: azar() * 360, vr: (azar() * 2 - 1) * 720, f: azar() * 6 });
    }
    const p = { k: 0 };
    TL.to(p, { k: 1, duration: D, ease: 'none' }, t);
    updaters.push(() => {
      const vis = p.k > 0 && p.k < 1, s = p.k * D;
      for (const q of piezas) {
        if (!vis) { q.e.style.visibility = 'hidden'; continue; }
        const arrastre = 1 - Math.min(0.55, s * 0.42);
        const x = q.vx * s * arrastre + Math.sin(s * 9 + q.f) * 10;
        const y = q.vy * s + 0.5 * g * s * s;
        const op = s > D - 0.4 ? Math.max(0, (D - s) / 0.4) : 1;
        q.e.style.visibility = 'visible';
        q.e.style.opacity = op.toFixed(3);
        q.e.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(q.r0 + q.vr * s).toFixed(1)}deg) scaleY(${Math.cos(s * 8 + q.f).toFixed(2)})`;
      }
    });
    cue(t, 'confeti', o.gan == null ? 0.7 : o.gan);
  }

  // toque de dedo: onda que se expande
  function toque(padre, x, y, t, o = {}) {
    const r = caja(padre, 'onda', { x: x - 60, y: y - 60, w: 120, h: 120 });
    gsap.set(r, { autoAlpha: 0, scale: 0.2 });
    TL.fromTo(r, { autoAlpha: 0.6, scale: 0.2 }, { autoAlpha: 0, scale: o.escala || 2.4, duration: 0.65, ease: 'power2.out', immediateRender: false }, t);
    if (o.sonido !== false) cue(t, o.sonido || 'toque', 0.8);
  }

  // círculo dibujado a mano alrededor de un rectángulo (coordenadas del padre)
  function circuloAMano(padre, r, t, o = {}) {
    const svg = svgCapa(padre);
    const pad = o.pad == null ? 22 : o.pad;
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2, rx = r.w / 2 + pad, ry = r.h / 2 + pad * 0.75;
    const N = 90, vueltas = 1.14, a0 = -2.2, fase = azar() * 6;
    let d = '';
    for (let i = 0; i <= N; i++) {
      const k = i / N, ang = a0 + k * Math.PI * 2 * vueltas;
      const jit = 1 + 0.035 * Math.sin(3 * ang + fase) + 0.07 * k;
      const x = cx + Math.cos(ang) * rx * jit, y = cy + Math.sin(ang) * ry * jit;
      d += (i ? ' L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    }
    const p = svgPath(svg, d, { fill: 'none', stroke: o.color || '#FD0894', 'stroke-width': o.grosor || 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    const L = p.getTotalLength();
    gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
    TL.to(p, { strokeDashoffset: 0, duration: o.dur || 0.7, ease: 'power2.inOut' }, t);
    cue(t, 'marcador', 0.7, { dur: o.dur || 0.7 });
    return p;
  }
  // línea que se dibuja (para el hub y subrayados)
  function trazo(svg, d, t, o = {}) {
    const p = svgPath(svg, d, { fill: 'none', stroke: o.color || '#190028', 'stroke-width': o.grosor || 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: o.opacidad == null ? 1 : o.opacidad });
    const L = p.getTotalLength();
    gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
    TL.to(p, { strokeDashoffset: 0, duration: o.dur || 0.45, ease: o.ease || 'power2.inOut' }, t);
    if (o.sonido) cue(t, o.sonido, 0.5, { dur: o.dur || 0.45 });
    return p;
  }

  // escritura a mano: la línea se revela de izquierda a derecha y el lápiz la sigue
  function escribir(linea, lapiz, t, dur) {
    gsap.set(linea, { clipPath: 'inset(0% 100% 0% 0%)' });
    TL.to(linea, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur, ease: 'none' }, t);
    const x0 = linea.offsetLeft + 14, x1 = linea.offsetLeft + linea.offsetWidth - 14;
    const y = linea.offsetTop + linea.offsetHeight * 0.74;
    TL.to(lapiz, { x: x0, y, duration: 0.24, ease: 'power2.inOut' }, t - 0.26);
    TL.to(lapiz, { x: x1, duration: dur, ease: 'none' }, t);
    cue(t, 'lapiz', 0.6, { dur });
  }

  // panel de color que se enrolla. modo 'sube': el panel se recoge hacia arriba y descubre lo de abajo.
  // modo 'baja': el panel se desenrolla desde arriba y tapa todo.
  function enrollar(panel, t, dur, modo) {
    const rod = caja(lienzo, 'rodillo', { x: -20, y: 0, w: W + 40, h: 96 });
    rod.style.zIndex = 90;
    const ease = 'power2.inOut', arriba = -48, abajo = H - 48;
    gsap.set(rod, { autoAlpha: 0 });
    if (modo === 'sube') {
      TL.fromTo(panel, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: dur, ease, immediateRender: false }, t);
      TL.set(rod, { autoAlpha: 1 }, t);
      TL.fromTo(rod, { y: abajo, scaleY: 0.55 }, { y: arriba, scaleY: 1.2, duration: dur, ease, immediateRender: false }, t);
      TL.set([rod, panel], { autoAlpha: 0 }, t + dur);
    } else {
      gsap.set(panel, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' });
      TL.set(panel, { autoAlpha: 1 }, t);
      TL.fromTo(panel, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: dur, ease, immediateRender: false }, t);
      TL.set(rod, { autoAlpha: 1 }, t);
      TL.fromTo(rod, { y: arriba, scaleY: 1.2 }, { y: abajo, scaleY: 0.55, duration: dur, ease, immediateRender: false }, t);
      TL.set(rod, { autoAlpha: 0 }, t + dur);
    }
    cue(t, 'rollo', 0.8, { dur });
  }

  function moverDamero(el, vel = 13) {
    updaters.push((t) => {
      const d = (t * vel) % 480;
      el.style.backgroundPosition = `${(-d).toFixed(2)}px ${(-d).toFixed(2)}px`;
    });
  }

  // ---------- subtítulos (abajo, grandes, siempre legibles sin sonido) ----------
  const subs = [];
  let subOculto = null;
  function subtitulo(texto, t0, t1) { subs.push({ texto, t0, t1 }); }
  function ocultarSubtitulos(t) { subOculto = t; }
  function construirSubtitulos() {
    const card = document.getElementById('subtitulo');
    const pad = 30;
    gsap.set(card, { transformOrigin: '50% 100%' });
    subs.sort((a, b) => a.t0 - b.t0);
    subs.forEach((s, i) => {
      const e = nodo('div', 'sub', card, s.texto);
      const alto = e.offsetHeight + pad * 2;
      const ant = subs[i - 1], sig = subs[i + 1];
      const volvio = ant && s.t0 - ant.t1 > 0.15;   // la tarjeta estaba escondida: cambia de alto sin animar
      if (s.t0 <= 0) {
        gsap.set(card, { height: alto });
      } else {
        gsap.set(e, { autoAlpha: 0, y: 26 });
        if (volvio) TL.set(card, { height: alto }, s.t0 - 0.02);
        else TL.to(card, { height: alto, duration: 0.35, ease: 'power3.out' }, s.t0);
        TL.fromTo(e, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, s.t0 + 0.06);
      }
      TL.to(e, { autoAlpha: 0, y: -22, duration: 0.28, ease: 'power2.in' }, s.t1 - 0.28);
      // entre escenas la tarjeta no se queda vacía: se va con la escena y vuelve con el texto nuevo
      if (sig && sig.t0 - s.t1 > 0.15) {
        TL.to(card, { autoAlpha: 0, scale: 0.94, duration: 0.25, ease: 'power2.in' }, s.t1 - 0.25);
        TL.to(card, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }, sig.t0);
      }
    });
    if (subOculto != null) TL.to(card, { autoAlpha: 0, y: 40, duration: 0.35, ease: 'power2.in' }, subOculto);
  }

  // ---------- render ----------
  function seek(t) {
    TL.seek(t, false);
    for (const u of updaters) u(t);
  }

  async function esperarImagenes() {
    await Promise.all([...document.images].map((i) => (i.complete ? (i.decode ? i.decode().catch(() => {}) : 0) : new Promise((r) => { i.onload = i.onerror = r; }))));
  }

  async function arrancar(construir) {
    const fuentes = ['800 88px "Inter Display"', '900 88px "Inter Display"', 'italic 900 88px "Inter Display"',
      '500 40px Inter', '600 40px Inter', '700 40px Inter', '800 40px Inter', '700 72px Caveat'];
    await Promise.all(fuentes.map((f) => document.fonts.load(f)));
    await document.fonts.ready;
    await esperarImagenes();
    construir();
    construirSubtitulos();
    await esperarImagenes();
    TL.set({}, {}, T.total);
    window.__cues = cues.sort((a, b) => a.t - b.t);
    window.__duration = T.total;
    window.__tlDuration = TL.duration();
    window.__seek = seek;
    seek(0);
    window.__ready = true;
    if (!modoRender) vistaPrevia();
  }

  // ---------- vista previa con doble clic (sin audio) ----------
  function vistaPrevia() {
    document.body.classList.add('previa');
    const ctrl = document.getElementById('controles');
    const btn = ctrl.querySelector('button'), rango = ctrl.querySelector('input'), lbl = ctrl.querySelector('span');
    rango.max = T.total; rango.step = 1 / 60;
    function escalar() {
      const s = Math.min((innerHeight - 80) / H, (innerWidth - 24) / W);
      lienzo.style.transform = `scale(${s})`;
      lienzo.style.left = ((innerWidth - W * s) / 2) + 'px';
    }
    escalar(); addEventListener('resize', escalar);
    let play = false, base = 0, t0 = 0, actual = 0;
    const pintar = (t) => { actual = t; seek(t); rango.value = t; lbl.textContent = t.toFixed(2) + ' / ' + T.total.toFixed(2) + ' s'; };
    function tick(now) {
      if (!play) return;
      let t = base + (now - t0) / 1000;
      if (t >= T.total) { t = T.total; play = false; btn.textContent = '▶ Reproducir'; }
      pintar(t);
      if (play) requestAnimationFrame(tick);
    }
    btn.onclick = () => {
      play = !play; btn.textContent = play ? '❚❚ Pausa' : '▶ Reproducir';
      if (play) { base = actual >= T.total ? 0 : actual; t0 = performance.now(); requestAnimationFrame(tick); }
    };
    rango.oninput = () => { play = false; btn.textContent = '▶ Reproducir'; pintar(+rango.value); };
    pintar(0);
  }

  window.MV = {
    W, H, TL, T, lienzo, azar, cue, nodo, caja, estilo, icono, rel, svgCapa, svgPath,
    escena, pop, deslizar, salir, cambiar, vivo, temblar, titular, contador, tipear, confeti, toque,
    circuloAMano, trazo, escribir, enrollar, moverDamero, subtitulo, ocultarSubtitulos, updaters, arrancar,
  };
})();
