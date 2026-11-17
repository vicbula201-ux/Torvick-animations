/* escenas.js — las 13 escenas del video. Los TEXTOS viven aquí; las DURACIONES en tiempos.js.
   Dentro de cada escena, a = inicio y b = fin (en segundos absolutos); todo se agenda como a + x.
   Lienzo: 1080 x 1920. Zona segura: el contenido termina antes de y = 1340 para que el
   subtítulo (abajo) y la interfaz de Shorts/TikTok/Reels no tapen nada. */
(function () {
  'use strict';
  const { W, H, TL, T, lienzo, cue, nodo, caja, estilo, icono, rel, svgCapa, svgPath,
    escena, pop, deslizar, cambiar, vivo, temblar, titular, contador, tipear, confeti, toque,
    circuloAMano, trazo, escribir, enrollar, moverDamero, subtitulo, ocultarSubtitulos } = MV;
  const SAL = TIEMPOS.salida;

  // ------------------------------------------------------------------ utilidades de maqueta
  function centrarX(el, cx) { el.style.left = (cx - el.offsetWidth / 2) + 'px'; return el; }
  function texto(padre, r, html, css) { return estilo(caja(padre, null, r, html), css || {}); }
  const F = {
    t40: { font: "800 40px/1.1 Inter", color: 'var(--ink)', whiteSpace: 'nowrap' },
    t34: { font: "800 34px/1.15 Inter", color: 'var(--ink)', whiteSpace: 'nowrap' },
    d28: { font: "600 28px/1.25 Inter", color: 'var(--ink2)' },
    m24: { font: "600 24px/1.25 Inter", color: 'var(--muted)' },
    cab: { font: "800 23px/1 Inter", color: 'var(--muted)', letterSpacing: '.08em' },
  };
  function icoCirculo(padre, r, nombre, fondo, color, tam) {
    const c = caja(padre, 'circulo-ico', r, icono(nombre, tam || Math.round(r.w * 0.52), 2.3));
    return estilo(c, { background: fondo, color });
  }
  // texto que cambia con un "flip" vertical detrás de una máscara
  function mascara(padre, r, viejo, nuevo, css) {
    const c = estilo(caja(padre, null, r), { overflow: 'hidden' });
    const v = estilo(caja(c, null, { x: 0, y: 0, w: r.w, h: r.h }, viejo), css);
    const n = estilo(caja(c, null, { x: 0, y: 0, w: r.w, h: r.h }, nuevo), css);
    gsap.set(n, { yPercent: 110 });
    return { c, v, n };
  }
  function voltear(m, t) {
    TL.to(m.v, { yPercent: -110, duration: 0.32, ease: 'power3.in' }, t);
    TL.fromTo(m.n, { yPercent: 110 }, { yPercent: 0, duration: 0.45, ease: 'back.out(1.6)', immediateRender: false }, t + 0.18);
  }
  const ENTRA_TARJETA = { desde: { autoAlpha: 0, scale: 0.9, y: 50 } };

  // fondo claro con damero que se desplaza lento
  moverDamero(document.getElementById('damero'));

  // ------------------------------------------------------------------ escenario oscuro (portada y cierre)
  function escenarioOscuro(P) {
    moverDamero(caja(P, 'damero-oscuro', { x: 0, y: 0, w: W, h: H }), 10);
    const HZ = 1340;
    const rec = caja(P, 'sol-recorte', { x: 0, y: 0, w: W, h: HZ });
    const sol = caja(rec, 'sol', { x: 240, y: HZ - 400, w: 600, h: 600 });
    const rayas = caja(sol, 'sol-rayas', { x: 0, y: 0, w: 600, h: 600 });
    MV.updaters.push((t) => { rayas.style.backgroundPosition = `0px ${((t * 20) % 46).toFixed(2)}px`; });
    const svg = svgCapa(P);
    for (let i = -6; i <= 6; i++) svgPath(svg, `M${540 + i * 60} ${HZ} L${540 + i * 300} ${H}`, { stroke: '#FD0894', 'stroke-width': 3, opacity: 0.5 });
    const horiz = [];
    for (let k = 0; k < 9; k++) horiz.push(svgPath(svg, '', { stroke: '#FD0894', 'stroke-width': 3, opacity: 0.5 }));
    MV.updaters.push((t) => {
      const ph = (t * 0.6) % 1;
      horiz.forEach((p, k) => {
        const y = HZ + 9 * Math.pow(k + ph, 2.1);
        p.setAttribute('d', y < H ? `M0 ${y.toFixed(1)} L${W} ${y.toFixed(1)}` : '');
      });
    });
    svgPath(svg, `M0 ${HZ} L${W} ${HZ}`, { stroke: '#02F8F7', 'stroke-width': 6 });
    return { HZ };
  }

  // ================================================================== 1. PORTADA (el primer cuadro es la miniatura)
  function portada() {
    const b = T.fin.portada;
    const P = caja(lienzo, 'panel-oscuro', { x: 0, y: 0, w: W, h: H });
    P.style.zIndex = 35;
    escenarioOscuro(P);
    const logo = caja(P, 'logo-anillo', { x: 540 - 78, y: 92, w: 156, h: 156 }, '<img src="img/logo-avatar.png" alt="">');
    const pill = caja(P, 'chip', { y: 282 }, 'TODO SOBRE GTA 6');
    estilo(pill, { background: 'rgba(2,248,247,.12)', color: '#02F8F7', border: '2px solid rgba(2,248,247,.55)', letterSpacing: '.16em', font: "800 24px/1 Inter", height: '50px' });
    centrarX(pill, 540);
    titular(P, '¿A qué hora|sale *GTA 6*|en tu país?', null, { y: 360, tam: 124, color: '#fff' });
    const st = caja(P, 'sticker', { y: 778 }, icono('calendar', 44, 2.6) + 'JUEVES 19 NOV');
    centrarX(st, 540);
    gsap.set(st, { rotation: -5 });
    const fl = crearFlamenco(P, { x: 385, y: 896, w: 310, h: 465 }).poseSaludo();
    // vivo desde el cuadro 0
    fl.respirar(0, b).parpadear(0.7).parpadear(3.3);
    TL.to(fl.p.alaD, { rotation: -100, duration: 0.24, ease: 'sine.inOut', yoyo: true, repeat: 7 }, 0.3);
    vivo(st, 0.15, b, { rotation: -1.5, scale: 1.05 }, 1.4);
    vivo(logo, 0, b, { scale: 1.05 }, 1.8);
    enrollar(P, b - 0.65, 0.95, 'sube');
    subtitulo('Horarios para <b>España y Latinoamérica</b>', 0, b + 0.3);
  }

  // ================================================================== 2. CONTEXTO
  function relojSVG() {
    let ticks = '';
    for (let i = 0; i < 12; i++) {
      const g = i * 30 * Math.PI / 180, r1 = i % 3 ? 100 : 90, r2 = 108;
      ticks += `<line x1="${(130 + Math.sin(g) * r1).toFixed(1)}" y1="${(130 - Math.cos(g) * r1).toFixed(1)}" x2="${(130 + Math.sin(g) * r2).toFixed(1)}" y2="${(130 - Math.cos(g) * r2).toFixed(1)}" stroke="#190028" stroke-width="${i % 3 ? 5 : 8}" stroke-linecap="round"/>`;
    }
    return `<svg viewBox="0 0 260 260" width="260" height="260" style="position:absolute;left:43px;top:26px;overflow:visible">
      <circle cx="130" cy="130" r="120" fill="#fff" stroke="#190028" stroke-width="10"/>${ticks}
      <line class="r-h" x1="130" y1="130" x2="130" y2="76" stroke="#190028" stroke-width="13" stroke-linecap="round"/>
      <line class="r-m" x1="130" y1="130" x2="130" y2="46" stroke="#190028" stroke-width="9" stroke-linecap="round"/>
      <line class="r-s" x1="130" y1="150" x2="130" y2="34" stroke="#FD0894" stroke-width="5" stroke-linecap="round"/>
      <circle cx="130" cy="130" r="11" fill="#FD0894" stroke="#190028" stroke-width="5"/></svg>`;
  }

  function contexto() {
    const { S, a, b } = escena('contexto');
    titular(S, 'Sale el *jueves 19*', a + 0.45, { y: 236 });

    // calendario de noviembre 2026 (el 1 cae domingo)
    const cal = caja(S, 'tarjeta', { x: 60, y: 400, w: 580, h: 640 });
    const cab = texto(cal, { x: 36, y: 34 }, icono('calendar', 40, 2.4) + '<span>Noviembre 2026</span>',
      { display: 'flex', alignItems: 'center', gap: '14px', font: "800 36px/1 Inter", color: 'var(--ink)' });
    cab.querySelector('.ico').style.color = 'var(--mag)';
    const gx = 30, gy = 110, cw = (580 - 60) / 7, ch = 74;
    ['L', 'M', 'X', 'J', 'V', 'S', 'D'].forEach((d, i) => texto(cal, { x: gx + i * cw, y: gy, w: cw, h: 40 }, d,
      { textAlign: 'center', font: "800 24px/40px Inter", color: 'var(--muted)' }));
    let d19;
    for (let dia = 1; dia <= 30; dia++) {
      const idx = dia + 5, col = idx % 7, fila = Math.floor(idx / 7);
      const e = texto(cal, { x: gx + col * cw, y: gy + 52 + fila * ch, w: cw, h: ch }, String(dia), {
        textAlign: 'center', font: `${dia === 19 ? 800 : 600} 32px/${ch}px Inter`,
        color: dia === 19 ? 'var(--mag)' : (col >= 5 ? 'var(--muted)' : 'var(--ink2)'),
      });
      if (dia === 19) d19 = e;
    }
    const f19 = estilo(caja(cal, null, { x: d19.offsetLeft + cw / 2 - 36, y: d19.offsetTop + ch / 2 - 36, w: 72, h: 72 }),
      { borderRadius: '50%', background: 'var(--mag-soft)' });
    cal.insertBefore(f19, d19);

    // reloj: gira hasta las 12 y aparece 00:00
    const rl = caja(S, 'tarjeta', { x: 670, y: 400, w: 350, h: 470 });
    rl.innerHTML = relojSVG();
    const rh = rl.querySelector('.r-h'), rm = rl.querySelector('.r-m'), rs = rl.querySelector('.r-s');
    gsap.set([rh, rm, rs], { svgOrigin: '130 130' });
    gsap.set(rh, { rotation: 270 });
    MV.updaters.push((t) => {
      const s = Math.floor(t), k = Math.min(1, (t - s) / 0.14);
      gsap.set(rs, { rotation: (s + 1 - Math.pow(1 - k, 3)) * 6 });
    });
    const dig = texto(rl, { x: 0, y: 300, w: 346 }, '00:00',
      { textAlign: 'center', font: "800 84px/1 'Inter Display'", letterSpacing: '-0.03em', color: 'var(--ink)' });
    const hl = centrarX(caja(rl, 'chip cian', { y: 398 }, icono('map-pin', 26, 2.6) + 'hora local'), 173);

    const fila = estilo(caja(S, null, { x: 60, y: 1080 }), { display: 'flex', gap: '18px' });
    const p1 = nodo('div', 'pill', fila, icono('gamepad-2', 40, 2.3) + 'PS5');
    const p2 = nodo('div', 'pill', fila, icono('gamepad-2', 40, 2.3) + 'Xbox Series X|S');
    const fl = crearFlamenco(S, { x: 700, y: 900, w: 300, h: 450 });

    pop(cal, a + 0.15, ENTRA_TARJETA);
    pop(rl, a + 0.35, ENTRA_TARJETA);
    pop([p1, p2], a + 0.7, { stagger: 0.14 });
    deslizar(fl.el, a + 0.9, { dx: 260 });
    fl.respirar(a + 0.9, b).saludar(a + 1.45, 2).parpadeos(a + 3.2, b);
    pop(f19, a + 2.0, { desde: { autoAlpha: 0, scale: 0.2, y: 0 }, sonido: false });
    circuloAMano(cal, { x: f19.offsetLeft, y: f19.offsetTop, w: 72, h: 72 }, a + 2.1, { pad: 14, dur: 0.75 });
    vivo(cal, a + 1.0, b, { y: -8 }, 3.4);
    vivo(rl, a + 1.2, b, { y: -8 }, 3.0);
    TL.to(rh, { rotation: 360, duration: 1.3, ease: 'power3.inOut' }, a + 4.1);
    TL.to(rm, { rotation: 1080, duration: 1.3, ease: 'power3.inOut' }, a + 4.1);
    cue(a + 4.1, 'giro', 0.55, { dur: 1.3 });
    pop(dig, a + 5.4, { sonido: 'ding', gan: 0.7, desde: { autoAlpha: 0, scale: 0.5, y: 0 } });
    pop(hl, a + 5.6, { sonido: false });
    fl.asentir(a + 5.7);
    subtitulo('GTA 6 llega el <b>jueves 19 de noviembre</b> a PS5 y Xbox Series X|S.', a + 0.3, a + 4.1);
    subtitulo('Y se desbloquea a medianoche… <b>en la hora de tu país</b>.', a + 4.1, b - 0.25);
  }

  // ================================================================== rastreador de pasos (escenas 3 a 7)
  let pasos;
  function crearPasos() {
    const a = T.inicio.ola, b = T.fin.mexico;
    const C = caja(document.getElementById('escenas'), 'capa pasos', { x: 0, y: 0, w: W, h: H });
    const xs = [180, 420, 660, 900], y = 200;
    const pista = caja(C, 'pasos-pista', { x: xs[0], y: y - 4, w: xs[3] - xs[0] });
    const rell = caja(pista, 'pasos-relleno', { x: 0, y: 0, w: xs[3] - xs[0] });
    gsap.set(rell, { scaleX: 0 });
    const etiquetas = ['Nueva Zelanda', 'España', 'Sudamérica', 'México'];
    const nodos = xs.map((x, i) => {
      const n = caja(C, 'paso-n', { x: x - 34, y: y - 34 });
      const num = nodo('div', 'num', n, String(i + 1));
      const ok = nodo('div', 'ok', n, icono('check', 38, 3.4));
      gsap.set(ok, { autoAlpha: 0 });
      const et = caja(C, 'paso-et', { x: x - 110, y: y + 48 }, etiquetas[i]);
      return { n, num, ok, et };
    });
    gsap.set(C, { autoAlpha: 0 });
    TL.set(C, { autoAlpha: 1 }, a);
    pop(pista, a + 0.1, { desde: { autoAlpha: 0, scaleX: 0, y: 0, scale: 1 }, hasta: { autoAlpha: 1, scaleX: 1 }, ease: 'power3.out', sonido: false });
    gsap.set(pista, { transformOrigin: '0 50%' });
    pop(nodos.map((n) => n.n), a + 0.2, { stagger: 0.08, gan: 0.35, desde: { autoAlpha: 0, scale: 0.3, y: 0 } });
    pop(nodos.map((n) => n.et), a + 0.3, { stagger: 0.08, sonido: false, desde: { autoAlpha: 0, y: 14, scale: 1 } });
    TL.to(C, { autoAlpha: 0, y: -60, duration: SAL, ease: 'power2.in' }, b - SAL);
    pasos = {
      xs, y, capa: C,
      activar(i, t) {
        TL.to(nodos[i].n, { backgroundColor: '#FD0894', borderColor: '#FD0894', color: '#ffffff', scale: 1.14, duration: 0.35, ease: 'back.out(2)' }, t);
        TL.to(nodos[i].et, { color: '#190028', duration: 0.3 }, t);
        cue(t, 'pop', 0.35);
      },
      completar(i, t) {
        TL.to(nodos[i].n, { backgroundColor: '#12B76A', borderColor: '#12B76A', color: '#ffffff', scale: 1, duration: 0.3 }, t);
        cambiar(nodos[i].num, nodos[i].ok, t, { sonido: 'ding', gan: 0.3 });
        TL.to(nodos[i].et, { color: '#067647', duration: 0.3 }, t);
        if (i < 3) TL.to(rell, { scaleX: (i + 1) / 3, duration: 0.6, ease: 'power2.inOut' }, t + 0.1);
      },
    };
  }

  // ================================================================== 3. LA OLA
  function ola() {
    const { S, a, b } = escena('ola');
    crearPasos();
    titular(S, 'Una *ola* de|medianoches', a + 0.35, { y: 330 });

    const regla = caja(S, 'tarjeta', { x: 60, y: 560, w: 960, h: 170 });
    icoCirculo(regla, { x: 36, y: 37, w: 96, h: 96 }, 'badge-check', 'var(--cyan-soft)', 'var(--cyan-ink)', 54);
    texto(regla, { x: 160, y: 38 }, 'REGLA OFICIAL DE ROCKSTAR', F.cab);
    texto(regla, { x: 160, y: 74, w: 760 }, '00:00 hora local, en todas las regiones', { font: "800 38px/1.2 Inter", color: 'var(--ink)' });

    const card = caja(S, 'tarjeta', { x: 60, y: 770, w: 960, h: 540 });
    texto(card, { x: 40, y: 38 }, icono('moon', 38, 2.4) + '<span>La medianoche avanza</span>',
      { display: 'flex', alignItems: 'center', gap: '14px', font: "800 34px/1 Inter", color: 'var(--ink)' });
    const X = [130, 363, 597, 830], Y = 312;
    const pista = estilo(caja(card, null, { x: X[0], y: Y - 7, w: X[3] - X[0], h: 14 }), { borderRadius: '7px', background: 'var(--soft)' });
    const rell = estilo(caja(pista, null, { x: 0, y: 0, w: X[3] - X[0], h: 14 }), { borderRadius: '7px', background: 'var(--mag)', transformOrigin: '0 50%' });
    gsap.set(rell, { scaleX: 0 });
    const nombres = ['Nueva<br>Zelanda', 'España', 'Sudamérica', 'México y<br>Centroamérica'];
    const nodos = [], candados = [], checks = [], etiq = [];
    X.forEach((x, i) => {
      const n = estilo(caja(card, 'circulo-ico', { x: x - 48, y: Y - 48, w: 96, h: 96 }), { background: '#fff', border: '4px solid var(--line)', color: 'var(--muted)' });
      const c1 = estilo(caja(n, null, { x: 0, y: 0, w: 88, h: 88 }, icono('lock', 40, 2.4)), { display: 'flex', alignItems: 'center', justifyContent: 'center' });
      const c2 = estilo(caja(n, null, { x: 0, y: 0, w: 88, h: 88 }, icono('check', 46, 3.2)), { display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' });
      gsap.set(c2, { autoAlpha: 0 });
      nodos.push(n); candados.push(c1); checks.push(c2);
      etiq.push(texto(card, { x: x - 120, y: Y + 66, w: 240 }, nombres[i], { textAlign: 'center', font: "800 28px/1.15 Inter", color: 'var(--ink)' }));
    });
    const saltos = ['+12 h', '+4 h', '+3 h'].map((s, i) => centrarX(caja(card, 'chip mag', { y: Y - 104 }, s), (X[i] + X[i + 1]) / 2));
    const marca = estilo(caja(card, null, { x: X[0] - 80, y: 98, w: 160, h: 62 }, icono('moon', 30, 2.6) + '00:00'), {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', borderRadius: '31px',
      background: 'var(--night)', color: '#fff', font: "800 30px/1 Inter",
    });

    pop(regla, a + 0.6, ENTRA_TARJETA);
    pop(card, a + 1.0, ENTRA_TARJETA);
    pop(nodos, a + 1.3, { stagger: 0.1, gan: 0.35, desde: { autoAlpha: 0, scale: 0.3, y: 0 } });
    pop(etiq, a + 1.4, { stagger: 0.1, sonido: false, desde: { autoAlpha: 0, y: 16, scale: 1 } });
    pop(saltos, a + 1.8, { stagger: 0.12, gan: 0.3 });
    pop(marca, a + 2.15, { desde: { autoAlpha: 0, scale: 0.4, y: 20 } });
    let t = a + 2.45;
    for (let i = 0; i < 4; i++) {
      if (i > 0) {
        TL.to(marca, { x: X[i] - X[0], duration: 0.62, ease: 'power2.inOut' }, t);
        TL.to(rell, { scaleX: (X[i] - X[0]) / (X[3] - X[0]), duration: 0.62, ease: 'power2.inOut' }, t);
        cue(t, 'whoosh', 0.22);
        t += 0.62;
      }
      TL.to(nodos[i], { backgroundColor: '#12B76A', borderColor: '#12B76A', duration: 0.2 }, t);
      cambiar(candados[i], checks[i], t, { sonido: 'ding', gan: 0.45 });
      t += 0.38;
    }
    vivo(marca, t, b, { scale: 1.06 }, 1.0);
    subtitulo('Rockstar lo lanza a las <b>00:00 de cada región</b>: no sale a la vez en todo el mundo.', a + 0.3, a + 3.4);
    subtitulo('Empieza en <b>Nueva Zelanda</b> y termina en <b>México y Centroamérica</b>.', a + 3.4, b - 0.25);
  }

  // ================================================================== 4. PASO 1: NUEVA ZELANDA
  function nz() {
    const { S, a, b } = escena('nz');
    pasos.activar(0, a + 0.15);
    titular(S, 'Primero:|*Nueva Zelanda*', a + 0.3, { y: 330 });
    const card = caja(S, 'tarjeta', { x: 60, y: 560, w: 960, h: 760 });
    const cab = texto(card, { x: 40, y: 40 }, icono('globe', 40, 2.3) + '<span>Reloj mundial</span>',
      { display: 'flex', alignItems: 'center', gap: '14px', font: "800 36px/1 Inter", color: 'var(--ink)' });
    cab.querySelector('.ico').style.color = 'var(--mag)';
    const datos = [
      ['Auckland', 'Nueva Zelanda · miércoles 18', 'Nueva Zelanda · jueves 19', '23:59', '00:00'],
      ['Madrid', 'España · miércoles 18', null, '11:59', '12:00'],
      ['Buenos Aires', 'Argentina · miércoles 18', null, '07:59', '08:00'],
      ['Ciudad de México', 'México · miércoles 18', null, '04:59', '05:00'],
    ];
    const HORA = { font: "800 70px/78px 'Inter Display'", letterSpacing: '-0.03em', textAlign: 'right', color: 'var(--ink)' };
    const PAIS = { font: "600 26px/34px Inter", color: 'var(--muted)', whiteSpace: 'nowrap' };
    const filas = datos.map((d, i) => {
      const f = caja(card, null, { x: 0, y: 116 + i * 156, w: 956, h: 156 });
      const fondo = estilo(caja(f, null, { x: 18, y: 10, w: 920, h: 136 }), { borderRadius: '30px', background: 'var(--green-soft)' });
      gsap.set(fondo, { autoAlpha: 0 });
      if (i) caja(f, 'divisor', { y: 0 });
      texto(f, { x: 44, y: 34 }, d[0], { font: "800 38px/1 Inter", color: 'var(--ink)', whiteSpace: 'nowrap' });
      const pais = mascara(f, { x: 44, y: 84, w: 380, h: 34 }, d[1], d[2] || d[1], PAIS);
      const hora = mascara(f, { x: 420, y: 38, w: 240, h: 80 }, d[3], d[4], HORA);
      const esp = caja(f, 'chip gris', { x: 690, y: 50 }, icono('lock', 26, 2.6) + 'EN ESPERA');
      const ok = caja(f, 'chip verde', { x: 690, y: 50 }, icono('check', 28, 3) + 'DISPONIBLE');
      estilo(esp, { font: "800 24px/1 Inter" }); estilo(ok, { font: "800 24px/1 Inter" });
      gsap.set(ok, { autoAlpha: 0 });
      return { f, fondo, pais, hora, esp, ok };
    });
    pop(card, a + 0.5, ENTRA_TARJETA);
    deslizar(filas.map((f) => f.f), a + 0.75, { dx: -70, stagger: 0.12, gan: 0.2 });
    const tf = a + 2.0;
    filas.forEach((f) => voltear(f.hora, tf));
    voltear(filas[0].pais, tf);
    cue(tf, 'tic', 0.7);
    TL.to(filas[0].fondo, { autoAlpha: 1, duration: 0.3 }, tf + 0.1);
    cambiar(filas[0].esp, filas[0].ok, tf + 0.15, { sonido: 'exito', gan: 0.6 });
    confeti(card, 810, 116 + 78, tf + 0.25, { n: 28, fuerza: 820 });
    vivo(filas[0].ok, tf + 0.8, b, { scale: 1.07 }, 0.9);
    [1, 2, 3].forEach((i) => { temblar(filas[i].esp, tf + 1.2 + i * 0.08, 6, 0.4, null); temblar(filas[i].esp, tf + 2.9 + i * 0.08, 5, 0.35, null); });
    subtitulo('En Nueva Zelanda ya es <b>jueves 19</b>… y en España todavía es mediodía del miércoles.', a + 0.3, b - 0.25);
  }

  // ================================================================== 5. PASO 2: ESPAÑA (pizarra)
  const LAPIZ = `<svg viewBox="0 0 44 190" width="44" height="190" style="display:block;overflow:visible">
    <rect x="6" y="2" width="32" height="30" rx="9" fill="#FD0894" stroke="#190028" stroke-width="4"/>
    <rect x="5" y="28" width="34" height="16" fill="#C9C1D3" stroke="#190028" stroke-width="4"/>
    <rect x="6" y="44" width="32" height="106" fill="#FEA632" stroke="#190028" stroke-width="4"/>
    <path d="M16 44 L16 150" stroke="#190028" stroke-width="3" opacity=".25"/>
    <path d="M6 150 L38 150 L22 188 Z" fill="#FFE2B8" stroke="#190028" stroke-width="4" stroke-linejoin="round"/>
    <path d="M17 176 L27 176 L22 188 Z" fill="#190028"/></svg>`;

  function espana() {
    const { S, a, b } = escena('espana');
    pasos.completar(0, a + 0.15);
    pasos.activar(1, a + 0.35);
    titular(S, 'Luego: *España*', a + 0.3, { y: 330 });
    const pz = caja(S, 'tarjeta', { x: 60, y: 468, w: 960, h: 856 });
    estilo(pz, { border: '16px solid #E4DCEC' });
    estilo(caja(pz, null, { x: 300, y: 790, w: 330, h: 18 }), { borderRadius: '9px', background: '#D8CFE2' });
    estilo(caja(pz, null, { x: 330, y: 770, w: 130, h: 22 }), { borderRadius: '8px', background: 'var(--mag)', border: '3px solid var(--ink)' });
    const MANO = { font: "700 78px/1.15 Caveat", color: 'var(--ink)', whiteSpace: 'nowrap', padding: '4px 16px' };
    const lineas = [
      ['En España: <span style="color:var(--mag)">00:00</span> del jueves', 56],
      ['Argentina: 20:00 miérc.', 270],
      ['Colombia: 18:00 miérc.', 420],
      ['México: <span class="h17">17:00</span> miérc.', 570],
    ].map(([html, y]) => texto(pz, { x: 40, y }, html, MANO));
    const svg = svgCapa(pz);
    const lap = caja(pz, null, { x: 0, y: 0, w: 0, h: 0 });
    lap.style.zIndex = 5;
    const lapIn = caja(lap, null, { x: -22, y: -188, w: 44, h: 190 }, LAPIZ);
    gsap.set(lapIn, { rotation: 28, transformOrigin: '22px 188px' });
    const L0 = lineas[0];
    gsap.set(lap, { x: L0.offsetLeft + 14, y: L0.offsetTop + L0.offsetHeight * 0.74 });

    pop(pz, a + 0.5, ENTRA_TARJETA);
    pop(lapIn, a + 0.8, { desde: { autoAlpha: 0, scale: 0.4, y: 0 }, hasta: { autoAlpha: 1, scale: 1, y: 0 }, gan: 0.4 });
    vivo(lapIn, a + 1.4, b, { rotation: 22 }, 0.3);
    escribir(lineas[0], lap, a + 1.0, 1.3);
    const yU = L0.offsetTop + L0.offsetHeight + 16;
    trazo(svg, `M60 ${yU} C 260 ${yU - 10}, 560 ${yU + 10}, 860 ${yU - 4}`, a + 2.35, { color: '#190028', grosor: 6, dur: 0.35, sonido: 'lapiz' });
    escribir(lineas[1], lap, a + 2.95, 1.1);
    escribir(lineas[2], lap, a + 4.15, 1.1);
    escribir(lineas[3], lap, a + 5.35, 0.95);
    const s17 = lineas[3].querySelector('.h17');
    circuloAMano(pz, rel(s17, pz), a + 6.4, { pad: 16, dur: 0.7, grosor: 9 });
    TL.to(lap, { x: 800, y: 760, duration: 0.5, ease: 'power2.inOut' }, a + 6.45);
    subtitulo('Cuando en España dan las <b>00:00</b>… en México todavía son las <b>5 de la tarde del miércoles</b>.', a + 0.3, b - 0.25);
  }

  // ================================================================== 6. PASO 3: SUDAMÉRICA (notificaciones)
  function sudamerica() {
    const { S, a, b } = escena('sudamerica');
    pasos.completar(1, a + 0.15);
    pasos.activar(2, a + 0.35);
    titular(S, 'Después:|*Sudamérica*', a + 0.3, { y: 330 });
    const cand = caja(S, null, { x: 540 - 32, y: 540, w: 64, h: 64 });
    const c1 = estilo(caja(cand, null, { x: 0, y: 0, w: 64, h: 64 }, icono('lock', 52, 2.4)), { display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink)' });
    const c2 = estilo(caja(cand, null, { x: 0, y: 0, w: 64, h: 64 }, icono('lock-open', 52, 2.4)), { display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' });
    gsap.set(c2, { autoAlpha: 0 });
    const hora = texto(S, { x: 0, y: 604, w: W }, '00:00', { textAlign: 'center', font: "800 150px/1 'Inter Display'", letterSpacing: '-0.04em', color: 'var(--ink)' });
    const fecha = texto(S, { x: 0, y: 764, w: W }, 'jueves 19 de noviembre', { textAlign: 'center', font: "600 34px/1 Inter", color: 'var(--muted)' });
    const datos = [
      ['Argentina · Chile · Uruguay · Paraguay', 'Primero', 'verde'],
      ['Bolivia', '+1 h', 'mag'],
      ['Colombia · Perú · Ecuador · Panamá', '+2 h', 'mag'],
    ];
    const notifs = datos.map((d, i) => {
      const n = estilo(caja(S, 'tarjeta', { x: 60, y: 830 + i * 168, w: 960, h: 150 }), { borderRadius: '36px' });
      const ic = estilo(icoCirculo(n, { x: 30, y: 31, w: 84, h: 84 }, 'gamepad-2', 'var(--mag)', '#fff', 46), { borderRadius: '24px' });
      texto(n, { x: 140, y: 30 }, '<span style="color:var(--mag)">00:00</span> · Ya disponible', F.t34);
      texto(n, { x: 140, y: 82, w: 640 }, d[0], { font: "600 28px/1.2 Inter", color: 'var(--ink2)', whiteSpace: 'nowrap' });
      const ch = caja(n, 'chip ' + d[2], { y: 47 });
      ch.innerHTML = d[1];
      ch.style.right = '30px';
      return { n, ic };
    });
    pop(cand, a + 0.4, { desde: { autoAlpha: 0, scale: 0.4, y: 0 }, sonido: false });
    pop([hora, fecha], a + 0.5, { stagger: 0.1, desde: { autoAlpha: 0, scale: 0.9, y: 30 }, sonido: false });
    cambiar(c1, c2, a + 1.0, { sonido: 'clic', gan: 0.7 });
    vivo(hora, a + 1.2, b, { scale: 1.03 }, 2.2);
    notifs.forEach((q, i) => {
      const t = a + 1.45 + i * 1.5;
      pop(q.n, t, { desde: { autoAlpha: 0, y: -60, scale: 0.94 }, ease: 'back.out(1.4)', sonido: 'notif', gan: 0.7 });
      vivo(q.ic, t + 0.7, b, { scale: 1.08 }, 1.2);
    });
    subtitulo('Y va bajando hora a hora: en cada país, <b>a las 00:00 de su reloj</b>.', a + 0.3, b - 0.25);
  }

  // ================================================================== 7. PASO 4: MÉXICO Y CENTROAMÉRICA
  function mexico() {
    const { S, a, b } = escena('mexico');
    pasos.completar(2, a + 0.15);
    pasos.activar(3, a + 0.35);
    titular(S, 'Al final: *México*|y *Centroamérica*', a + 0.3, { y: 330 });
    const card = caja(S, 'tarjeta', { x: 60, y: 560, w: 960, h: 360 });
    texto(card, { x: 40, y: 36 }, 'Diferencia con Nueva Zelanda', { font: "700 30px/1 Inter", color: 'var(--muted)' });
    const num = texto(card, { x: 34, y: 76 }, '<span class="n">0</span><span style="font-size:110px"> h</span>',
      { font: "800 170px/1 'Inter Display'", letterSpacing: '-0.04em', color: 'var(--mag)', whiteSpace: 'nowrap' });
    const barra = estilo(caja(card, null, { x: 40, y: 268, w: 876, h: 26 }), { borderRadius: '13px', background: 'var(--soft)' });
    const rl = estilo(caja(barra, null, { x: 0, y: 0, w: 876, h: 26 }), { borderRadius: '13px', background: 'var(--mag)', transformOrigin: '0 50%' });
    gsap.set(rl, { scaleX: 0 });
    texto(card, { x: 40, y: 310 }, 'Nueva Zelanda', F.m24);
    texto(card, { x: 700, y: 310, w: 216 }, 'México', Object.assign({ textAlign: 'right' }, F.m24));
    const cont = estilo(caja(S, null, { x: 60, y: 962, w: 640 }), { display: 'flex', flexWrap: 'wrap', gap: '16px' });
    const pills = ['México', 'Guatemala', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica'].map((p) => nodo('div', 'pill', cont, p));
    const fl = crearFlamenco(S, { x: 725, y: 922, w: 290, h: 435 });

    pop(card, a + 0.5, ENTRA_TARJETA);
    contador(num.querySelector('.n'), 0, 19, a + 0.9, 1.5);
    TL.to(rl, { scaleX: 1, duration: 1.5, ease: 'power2.out' }, a + 0.9);
    cue(a + 0.9, 'subida', 0.6, { dur: 1.5 });
    pop(pills, a + 2.0, { stagger: 0.09, gan: 0.3 });
    deslizar(fl.el, a + 2.2, { dx: 240 });
    fl.respirar(a + 2.2, b).asentir(a + 2.9).parpadeos(a + 2.6, b);
    pasos.completar(3, a + 4.0);
    confeti(pasos.capa, pasos.xs[3], pasos.y, a + 4.05, { n: 30, fuerza: 760, gan: 0.5 });
    fl.celebrar(a + 4.05, 1.3);
    cue(a + 4.05, 'exito', 0.7);
    subtitulo('México y Centroamérica son los últimos: <b>19 horas después</b> de Nueva Zelanda.', a + 0.3, b - 0.25);
  }

  // ================================================================== 8. TABLA PARA GUARDAR
  function tabla() {
    const { S, a, b } = escena('tabla');
    titular(S, 'Tu hora: *00:00*|del jueves 19', a + 0.3, { y: 232 });
    const card = caja(S, 'tarjeta', { x: 50, y: 500, w: 980, h: 840 });
    texto(card, { x: 40, y: 40 }, 'PAÍS O REGIÓN', F.cab);
    texto(card, { x: 560, y: 40 }, 'JUEGAS', F.cab);
    texto(card, { x: 790, y: 40 }, 'EN ESPAÑA', F.cab);
    const suave = (s) => `<span style="color:var(--muted);font-weight:600">${s}</span>`;
    const datos = [
      ['España ' + suave('(península)'), '—'],
      ['Argentina · Chile · Uruguay · Paraguay', '04:00'],
      ['Bolivia', '05:00'],
      ['Colombia · Perú · Ecuador · Panamá', '06:00'],
      ['EE. UU. ' + suave('(hora del Este)*'), '06:00'],
      ['México y Centroamérica', '07:00'],
    ];
    const filas = [], verdes = [];
    datos.forEach((d, i) => {
      const f = caja(card, null, { x: 0, y: 84 + i * 102, w: 976, h: 102 });
      caja(f, 'divisor', { y: 0 });
      texto(f, { x: 40, y: 0, w: 500, h: 102 }, `<span>${d[0]}</span>`, { display: 'flex', alignItems: 'center', font: "700 31px/1.18 Inter", color: 'var(--ink)' });
      const v = estilo(caja(f, 'chip verde', { x: 560, y: 23 }, '00:00 jue'), { height: '56px', font: "800 29px/1 Inter" });
      texto(f, { x: 790, y: 0, w: 150, h: 102 }, d[1], { display: 'flex', alignItems: 'center', font: "700 32px/1 Inter", color: 'var(--ink2)' });
      filas.push(f); verdes.push(v);
    });
    texto(card, { x: 40, y: 84 + 6 * 102 + 16, w: 900 },
      '* En la costa oeste de EE. UU.: 21:00 del miércoles 18. ¿Tu país no está? Sale a las 00:00 de la región de tu tienda.',
      { font: "600 27px/1.3 Inter", color: 'var(--muted)' });
    const flash = estilo(caja(card, null, { x: -2, y: -2, w: 980, h: 840 }), { borderRadius: '40px', background: '#fff' });
    gsap.set(flash, { autoAlpha: 0 });
    const st = caja(S, 'sticker', { x: 716, y: 432 }, icono('camera', 42, 2.6) + 'CAPTURA');

    pop(card, a + 0.5, ENTRA_TARJETA);
    deslizar(filas, a + 0.8, { dx: -60, stagger: 0.2, gan: 0.18 });
    verdes.forEach((v, i) => pop(v, a + 1.05 + i * 0.2, { desde: { autoAlpha: 0, scale: 0.4, y: 0 }, gan: 0.3 }));
    pop(st, a + 2.6, { desde: { autoAlpha: 0, scale: 0.3, rotation: -24, y: 0 }, hasta: { autoAlpha: 1, scale: 1, rotation: -5, y: 0 }, ease: 'back.out(2.2)' });
    vivo(st, a + 3.3, b, { rotation: -2, scale: 1.05 }, 1.3);
    TL.fromTo(flash, { autoAlpha: 0 }, { autoAlpha: 0.9, duration: 0.08, ease: 'none', yoyo: true, repeat: 1, immediateRender: false }, a + 3.4);
    cue(a + 3.4, 'obturador', 0.8);
    subtitulo('Haz captura: en todos estos países se juega a las <b>00:00 del jueves 19</b>.', a + 0.3, b - 0.25);
  }

  // ================================================================== 9. OJO: EE. UU. Y REGIÓN DE LA CUENTA (chat)
  function ojo() {
    const { S, a, b } = escena('ojo');
    titular(S, 'Ojo con *esto*', a + 0.3, { y: 236 });
    const us = caja(S, 'tarjeta', { x: 60, y: 372, w: 960, h: 330 });
    icoCirculo(us, { x: 36, y: 30, w: 76, h: 76 }, 'map-pin', 'var(--mag-soft)', 'var(--mag)', 40);
    texto(us, { x: 132, y: 48 }, '¿Estás en EE. UU.?', F.t40);
    const r1 = caja(us, null, { x: 0, y: 124, w: 956, h: 60 });
    texto(r1, { x: 40, y: 12 }, 'Hora del Este', { font: "600 32px/1 Inter", color: 'var(--ink2)' });
    texto(r1, { x: 400, y: 10, w: 516 }, '00:00 · jueves 19', { textAlign: 'right', font: "800 34px/1 Inter", color: 'var(--ink)' });
    caja(us, 'divisor', { y: 192 });
    const r2 = caja(us, null, { x: 0, y: 200, w: 956, h: 60 });
    texto(r2, { x: 40, y: 12 }, 'Costa del Pacífico', { font: "600 32px/1 Inter", color: 'var(--ink2)' });
    const pac = texto(r2, { x: 400, y: 6, w: 516 }, icono('moon', 34, 2.6) + '<span>21:00 · miércoles 18</span>',
      { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', font: "800 34px/1 Inter", color: 'var(--mag)' });
    texto(us, { x: 40, y: 276 }, 'Según la PlayStation Store. Rockstar no lo detalló.', F.m24);

    // chat
    const chat = estilo(caja(S, 'tarjeta', { x: 60, y: 740, w: 960, h: 590 }), { overflow: 'hidden' });
    estilo(caja(chat, null, { x: 26, y: 18, w: 60, h: 60 }, '<img src="img/logo-avatar.png" alt="" style="width:60px;height:60px;border-radius:50%;display:block">'), {});
    texto(chat, { x: 102, y: 20 }, 'Modo Vice', { font: "800 30px/1 Inter", color: 'var(--ink)' });
    texto(chat, { x: 102, y: 56 }, 'en línea', { font: "600 22px/1 Inter", color: 'var(--green)' });
    estilo(caja(chat, null, { x: 0, y: 96, w: 956, h: 2 }), { background: 'var(--line)' });
    const area = estilo(caja(chat, null, { x: 0, y: 98, w: 956, h: 376 }), { overflow: 'hidden', background: '#FBF8FD' });
    const msgs = estilo(caja(area, null, { x: 0, y: 0, w: 956 }), { display: 'flex', flexDirection: 'column', gap: '18px', padding: '24px 28px' });
    const BURB = { maxWidth: '640px', padding: '18px 26px', font: "600 28px/1.3 Inter" };
    const mk = (html, tipo) => {
      const e = estilo(nodo('div', null, msgs, html), BURB);
      if (tipo === 'yo') estilo(e, { alignSelf: 'flex-end', background: 'var(--mag)', color: '#fff', borderRadius: '30px 30px 8px 30px', transformOrigin: '100% 100%' });
      else estilo(e, { alignSelf: 'flex-start', background: tipo === 'cian' ? 'var(--cyan-soft)' : '#fff', color: 'var(--ink)', border: '2px solid var(--line)', borderRadius: '30px 30px 30px 8px', transformOrigin: '0% 100%' });
      return e;
    };
    const MSG1 = 'Vivo en México, pero mi cuenta es de España. ¿Cuándo juego?';
    const m1 = mk(MSG1, 'yo');
    const m2 = mk('Con tu cuenta de España: a las <b style="color:var(--mag)">17:00 del miércoles</b>, hora de México.', 'bot');
    const m3 = mk('La hora la marca <b>la región de tu cuenta</b>, no dónde vives.', 'cian');
    const rm2 = rel(m2, msgs);
    const dots = estilo(caja(msgs, null, { x: rm2.x, y: rm2.y, w: 120, h: 64 }), {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: '#fff',
      border: '2px solid var(--line)', borderRadius: '30px 30px 30px 8px',
    });
    const puntos = [0, 1, 2].map(() => estilo(nodo('div', null, dots), { width: '13px', height: '13px', borderRadius: '50%', background: 'var(--muted)' }));
    const input = estilo(caja(chat, null, { x: 26, y: 488, w: 796, h: 84 }), { borderRadius: '42px', background: 'var(--soft)' });
    const ph = texto(input, { x: 30, y: 0, w: 740, h: 84 }, 'Escribe un mensaje…', { display: 'flex', alignItems: 'center', font: "600 27px/1.2 Inter", color: 'var(--muted)' });
    const escrito = texto(input, { x: 30, y: 0, w: 740, h: 84 }, '', { display: 'flex', alignItems: 'center', font: "600 27px/1.2 Inter", color: 'var(--ink)' });
    const enviar = estilo(icoCirculo(chat, { x: 842, y: 488, w: 84, h: 84 }, 'send', 'var(--mag)', '#fff', 38), {});

    pop(us, a + 0.5, ENTRA_TARJETA);
    pop([r1, r2], a + 0.8, { stagger: 0.22, desde: { autoAlpha: 0, y: 20, scale: 1 }, gan: 0.3 });
    vivo(pac, a + 1.6, b, { scale: 1.05 }, 1.2);
    pop(chat, a + 1.6, ENTRA_TARJETA);
    const ti = a + 2.2;
    TL.set(ph, { autoAlpha: 0 }, ti);
    const tp = tipear(escrito, MSG1, ti, 28);
    TL.to(enviar, { scale: 0.86, duration: 0.08, yoyo: true, repeat: 1 }, tp.fin + 0.12);
    toque(chat, 884, 530, tp.fin + 0.15, { sonido: 'clic' });
    TL.set(tp.p, { n: 0 }, tp.fin + 0.2);
    TL.set(ph, { autoAlpha: 1 }, tp.fin + 0.2);
    const scrollA = (m, t) => {
      const r = rel(m, msgs);
      TL.to(msgs, { y: Math.min(0, 376 - (r.y + r.h) - 24), duration: 0.4, ease: 'power3.out' }, t);
    };
    const t1 = tp.fin + 0.25;
    scrollA(m1, t1);
    pop(m1, t1, { desde: { autoAlpha: 0, scale: 0.6, y: 20 }, sonido: 'enviar', gan: 0.7 });
    scrollA(m2, t1 + 0.5);
    pop(dots, t1 + 0.5, { desde: { autoAlpha: 0, scale: 0.6, y: 10 }, sonido: false });
    puntos.forEach((p, i) => vivo(p, t1 + 0.55 + i * 0.12, t1 + 1.3, { y: -8 }, 0.36));
    TL.to(dots, { autoAlpha: 0, duration: 0.08 }, t1 + 1.25);
    pop(m2, t1 + 1.3, { desde: { autoAlpha: 0, scale: 0.6, y: 20 }, sonido: 'notif', gan: 0.6 });
    scrollA(m3, t1 + 2.3);
    pop(m3, t1 + 2.3, { desde: { autoAlpha: 0, scale: 0.6, y: 20 }, gan: 0.5 });
    subtitulo('En EE. UU. sale a las 00:00 del Este: en el Pacífico, <b>a las 9 de la noche del miércoles</b>.', a + 0.3, a + 3.3);
    subtitulo('Si tu cuenta es de otro país, el juego se libera <b>con el horario de ese país</b>.', a + 3.3, b - 0.25);
  }

  // ================================================================== 10. PRECARGA
  function precarga() {
    const { S, a, b } = escena('precarga');
    titular(S, 'La *precarga*|ya está abierta', a + 0.3, { y: 232 });
    function tarjeta(y, ico, fondo, color, tit, desc) {
      const c = caja(S, 'tarjeta', { x: 60, y, w: 960, h: 270 });
      const ic = icoCirculo(c, { x: 36, y: 36, w: 96, h: 96 }, ico, fondo, color, 50);
      texto(c, { x: 156, y: 44 }, tit, F.t40);
      texto(c, { x: 156, y: 96, w: 760 }, desc, F.d28);
      const pista = estilo(caja(c, null, { x: 36, y: 192, w: 700, h: 28 }), { borderRadius: '14px', background: 'var(--soft)' });
      const rl = estilo(caja(pista, null, { x: 0, y: 0, w: 700, h: 28 }), { borderRadius: '14px', background: 'var(--mag)', transformOrigin: '0 50%' });
      gsap.set(rl, { scaleX: 0 });
      const val = texto(c, { x: 750, y: 186, w: 170 }, '0%', { textAlign: 'right', font: "800 36px/1 Inter", color: 'var(--ink)' });
      return { c, ic, pista, rl, val };
    }
    const A = tarjeta(450, 'hard-drive', 'var(--soft)', 'var(--muted)', 'Sin precarga', 'A las 00:00 todavía te falta bajarlo todo.');
    const B = tarjeta(756, 'download', 'var(--cyan-soft)', 'var(--cyan-ink)', 'Con precarga', 'Si lo compraste en digital, ya está en tu consola.');
    const xA = estilo(icoCirculo(A.c, { x: 36, y: 36, w: 96, h: 96 }, 'circle-x', 'var(--red-soft)', 'var(--red)', 54), {});
    gsap.set(xA, { autoAlpha: 0 });
    const badA = caja(A.c, 'chip rojo', { y: 44 }, icono('triangle-alert', 26, 2.6) + 'Toca esperar');
    badA.style.right = '36px';
    const okB = icoCirculo(B.c, { x: 36, y: 36, w: 96, h: 96 }, 'check', 'var(--green-soft)', 'var(--green)', 54);
    gsap.set(okB, { autoAlpha: 0 });
    const badB = caja(B.c, 'chip verde', { y: 44 }, icono('check', 26, 3) + 'Listo a las 00:00');
    badB.style.right = '36px';
    const fila = estilo(caja(S, null, { x: 60, y: 1066 }), { display: 'flex', gap: '18px' });
    const p1 = nodo('div', 'pill', fila, icono('calendar', 38, 2.3) + 'Desde el 10 nov');
    const p2 = nodo('div', 'pill', fila, icono('hard-drive', 38, 2.3) + 'Hasta 212 GB');
    const fl = crearFlamenco(S, { x: 790, y: 1030, w: 213, h: 320 });

    pop(A.c, a + 0.55, ENTRA_TARJETA);
    pop(B.c, a + 0.8, ENTRA_TARJETA);
    // error: tiembla en rojo
    const te = a + 1.6;
    temblar(A.c, te, 18, 0.6, 'error');
    TL.to(A.c, { borderColor: '#F04438', duration: 0.2 }, te);
    TL.to(A.pista, { backgroundColor: '#FEE4E2', duration: 0.2 }, te);
    TL.to(A.val, { color: '#F04438', duration: 0.2 }, te);
    cambiar(A.ic, xA, te + 0.05, { sonido: false });
    pop(badA, te + 0.25, { desde: { autoAlpha: 0, scale: 0.4, y: 0 }, sonido: false });
    // acierto: barra que crece, verde y confeti
    const td = a + 2.5;
    TL.to(B.rl, { scaleX: 1, duration: 1.8, ease: 'power1.inOut' }, td);
    contador(B.val, 0, 100, td, 1.8, (v) => Math.round(v) + '%', 'power1.inOut');
    cue(td, 'descarga', 0.5, { dur: 1.8 });
    const tok = td + 1.85;
    TL.to(B.rl, { backgroundColor: '#12B76A', duration: 0.25 }, tok);
    TL.to(B.c, { borderColor: '#12B76A', duration: 0.25 }, tok);
    cambiar(B.ic, okB, tok, { sonido: 'exito', gan: 0.7 });
    pop(badB, tok + 0.15, { desde: { autoAlpha: 0, scale: 0.4, y: 0 }, sonido: false });
    confeti(B.c, 780, 70, tok + 0.1, { n: 30, fuerza: 820 });
    pop([p1, p2], tok + 0.4, { stagger: 0.15, gan: 0.3 });
    deslizar(fl.el, tok + 0.55, { dx: 200 });
    fl.respirar(tok + 0.55, b).asentir(tok + 1.1).parpadeos(tok + 0.8, b);
    subtitulo('Si lo compraste en digital, ya puedes precargarlo: <b>ocupa hasta 212 GB</b>.', a + 0.3, b - 0.25);
  }

  // ================================================================== 11. LA IDEA GRANDE (hub)
  function hub() {
    const { S, a, b } = escena('hub');
    titular(S, 'Todo en *una* idea', a + 0.3, { y: 236 });
    const C0 = { x: 540, y: 870 };
    const svg = svgCapa(S);
    const halo = estilo(caja(S, null, { x: C0.x - 250, y: C0.y - 250, w: 500, h: 500 }), { borderRadius: '50%', background: 'var(--mag-soft)' });
    const fl = crearFlamenco(S, { x: 390, y: 640, w: 300, h: 450 });
    const datos = [
      { x: 222, y: 548, ic: 'clock', t: '00:00<br>hora local' },
      { x: 858, y: 548, ic: 'calendar', t: 'Jueves<br>19 NOV' },
      { x: 222, y: 1106, ic: 'download', t: 'Precarga<br>lista' },
      { x: 858, y: 1106, ic: 'globe', t: 'Región de<br>tu cuenta' },
      { x: 540, y: 1270, ic: 'gamepad-2', t: 'PS5 · Xbox Series X|S', ancho: 540 },
    ];
    const nodos = datos.map((d) => {
      if (d.ancho) {
        const n = estilo(caja(S, 'tarjeta', { x: d.x - d.ancho / 2, y: d.y - 54, w: d.ancho, h: 108 }, icono(d.ic, 46, 2.3) + `<span>${d.t}</span>`),
          { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', borderRadius: '54px', font: "800 35px/1 Inter", color: 'var(--ink)' });
        n.querySelector('.ico').style.color = 'var(--mag)';
        return n;
      }
      const n = estilo(caja(S, 'tarjeta', { x: d.x - 152, y: d.y - 98, w: 304, h: 196 }), { borderRadius: '36px' });
      icoCirculo(n, { x: 116, y: 18, w: 68, h: 68 }, d.ic, 'var(--mag-soft)', 'var(--mag)', 38);
      texto(n, { x: 0, y: 100, w: 300 }, d.t, { textAlign: 'center', font: "800 34px/1.12 Inter", color: 'var(--ink)' });
      return n;
    });
    pop(halo, a + 0.35, { desde: { autoAlpha: 0, scale: 0.3, y: 0 }, sonido: false });
    vivo(halo, a + 1.0, b, { scale: 1.06 }, 1.6);
    pop(fl.el, a + 0.45, { desde: { autoAlpha: 0, scale: 0.5, y: 40 } });
    fl.respirar(a + 0.5, b).parpadeos(a + 0.8, a + 3.3);
    datos.forEach((d, i) => {
      const t = a + 1.0 + i * 0.42;
      trazo(svg, `M${C0.x} ${C0.y} L${d.x} ${d.y}`, t, { color: '#FD0894', grosor: 6, dur: 0.35, opacidad: 0.55 });
      pop(nodos[i], t + 0.28, { gan: 0.5 });
      vivo(nodos[i], t + 0.9, b, { y: -7 }, 2.4 + i * 0.2);
    });
    fl.celebrar(a + 3.35, 1.5);
    confeti(S, C0.x, 760, a + 3.4, { n: 42 });
    cue(a + 3.4, 'exito', 0.7);
    subtitulo('Jueves 19, <b>a la medianoche de tu país</b>, con la precarga lista.', a + 0.3, b - 0.25);
  }

  // ================================================================== 12. FUENTES
  function fuentes() {
    const { S, a, b } = escena('fuentes');
    titular(S, '¿De dónde|sale *esto*?', a + 0.3, { y: 232 });
    const card = caja(S, 'tarjeta', { x: 60, y: 470, w: 960, h: 500 });
    const datos = [
      ['shield-check', 'var(--green-soft)', 'var(--green)', 'Rockstar Games · soporte oficial', '00:00 hora local en todas las regiones'],
      ['shield-check', 'var(--green-soft)', 'var(--green)', 'PlayStation Store', 'Horarios publicados para cada región'],
      ['info', 'var(--cyan-soft)', 'var(--cyan-ink)', 'Consultado el 17 nov 2026', 'Pueden cambiar: revisa siempre tu tienda'],
    ];
    const filas = datos.map((d, i) => {
      const f = caja(card, null, { x: 0, y: 20 + i * 155, w: 956, h: 155 });
      if (i) caja(f, 'divisor', { y: 0 });
      const ic = icoCirculo(f, { x: 36, y: 40, w: 76, h: 76 }, d[0], d[1], d[2], 42);
      texto(f, { x: 136, y: 40 }, d[3], F.t34);
      texto(f, { x: 136, y: 88, w: 780 }, d[4], F.d28);
      return { f, ic };
    });
    const nota = caja(S, 'pill', { x: 60, y: 1010 }, icono('info', 32, 2.3) + 'Canal de fans · sin afiliación con Rockstar Games');
    estilo(nota, { font: "600 27px/1 Inter", color: 'var(--muted)', height: '72px' });
    const fl = crearFlamenco(S, { x: 800, y: 1048, w: 196, h: 294 });
    pop(card, a + 0.45, ENTRA_TARJETA);
    filas.forEach((q, i) => {
      deslizar(q.f, a + 0.7 + i * 0.3, { dx: -50, gan: 0.15 });
      pop(q.ic, a + 0.85 + i * 0.3, { desde: { autoAlpha: 0, scale: 0.3, y: 0 }, sonido: 'ding', gan: 0.25 });
    });
    pop(nota, a + 1.9, { gan: 0.3 });
    deslizar(fl.el, a + 1.7, { dx: 180 });
    fl.respirar(a + 1.7, b).asentir(a + 2.5).parpadear(a + 3.4);
    subtitulo('Datos de Rockstar y de la PlayStation Store. <b>Pueden cambiar: revisa tu tienda.</b>', a + 0.3, b - 0.25);
  }

  // ================================================================== 13. LLAMADO A LA ACCIÓN + CIERRE
  function cta() {
    const { S, a, b } = escena('cta', { salida: false });
    titular(S, '¿Estás *listo*?', a + 0.3, { y: 236, tam: 112 });
    const fl = crearFlamenco(S, { x: 330, y: 404, w: 420, h: 630 });
    const btn = estilo(caja(S, null, { x: 190, y: 1078, w: 700, h: 132 }), {
      borderRadius: '66px', background: 'var(--mag)', border: '4px solid var(--mag)',
      boxShadow: '0 26px 50px -20px rgba(253,8,148,.65)',
    });
    const CEN = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '18px', font: "800 54px/1 Inter" };
    const bA = texto(btn, { x: 0, y: 0, w: 692, h: 124 }, icono('bell', 50, 2.5) + 'Suscríbete', Object.assign({ color: '#fff' }, CEN));
    const bB = texto(btn, { x: 0, y: 0, w: 692, h: 124 }, icono('check', 54, 3) + 'Suscrito', Object.assign({ color: 'var(--ink)' }, CEN));
    gsap.set(bB, { autoAlpha: 0 });
    const camp = estilo(caja(S, null, { x: 230, y: 1236, w: 620, h: 96 }), {
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', borderRadius: '48px',
      background: 'var(--cyan-soft)', border: '3px solid var(--ink)', font: "800 36px/1 Inter", color: 'var(--ink)',
    });
    const icoC = nodo('span', null, camp, icono('bell-ring', 44, 2.5));
    estilo(icoC, { display: 'flex' });
    nodo('span', null, camp, 'Activa el modo Vice');
    const dedo = caja(S, 'dedo', { x: 0, y: 0, w: 76, h: 76 });
    gsap.set(dedo, { autoAlpha: 0, x: 900, y: 1560 });

    pop(fl.el, a + 0.2, { desde: { autoAlpha: 0, scale: 0.6, y: 60 } });
    fl.respirar(a + 0.4, b).saludar(a + 0.7, 2).parpadeos(a + 2.4, a + 6.8);
    pop(btn, a + 0.9, { desde: { autoAlpha: 0, scale: 0.6, y: 30 } });
    vivo(btn, a + 1.5, a + 2.0, { scale: 1.04 }, 0.5);
    TL.fromTo(dedo, { autoAlpha: 0, x: 900, y: 1560 }, { autoAlpha: 1, x: 540 - 38, y: 1144 - 38, duration: 0.55, ease: 'power3.out', immediateRender: false }, a + 1.45);
    TL.to(dedo, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 }, a + 2.02);
    toque(S, 540, 1144, a + 2.1);
    TL.to(btn, { backgroundColor: '#ffffff', borderColor: '#190028', boxShadow: '0 26px 50px -24px rgba(25,0,40,.35)', duration: 0.25 }, a + 2.15);
    cambiar(bA, bB, a + 2.15, { sonido: 'exito', gan: 0.7 });
    confeti(S, 540, 1100, a + 2.2, { n: 36 });
    fl.celebrar(a + 2.25, 1.3);
    pop(camp, a + 2.7, { desde: { autoAlpha: 0, scale: 0.6, y: 20 } });
    TL.to(dedo, { x: 540 - 38, y: 1284 - 38, duration: 0.45, ease: 'power2.inOut' }, a + 2.95);
    TL.to(dedo, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 }, a + 3.42);
    toque(S, 540, 1284, a + 3.5);
    TL.to(camp, { backgroundColor: '#02F8F7', duration: 0.25 }, a + 3.5);
    gsap.set(icoC, { transformOrigin: '50% 12%' });
    TL.to(icoC, { keyframes: { rotation: [0, -24, 20, -16, 12, -6, 0] }, duration: 0.9, ease: 'none' }, a + 3.5);
    cue(a + 3.5, 'campana', 0.8);
    TL.to(dedo, { autoAlpha: 0, x: 920, y: 1620, duration: 0.5, ease: 'power2.in' }, a + 3.95);
    fl.asentir(a + 4.0);
    fl.saludar(a + 5.0, 3);
    vivo(camp, a + 4.4, a + 6.9, { scale: 1.04 }, 1.0);
    subtitulo('¿Listo para Leonida? <b>Suscríbete y activa el modo Vice</b> para no perderte nada de GTA 6.', a + 0.3, a + 3.9);
    subtitulo('Y cuéntame en comentarios: <b>¿desde qué país lo vas a jugar?</b>', a + 3.9, a + 6.75);
    ocultarSubtitulos(a + 6.75);
    TL.to('#marca', { autoAlpha: 0, y: -30, duration: 0.3, ease: 'power2.in' }, a + 6.6);

    // cierre: panel oscuro que se desenrolla, con la marca y el flamenco despidiéndose
    const tc = a + 6.9;
    const P = caja(lienzo, 'panel-oscuro', { x: 0, y: 0, w: W, h: H });
    P.style.zIndex = 80;
    escenarioOscuro(P);
    const logo = caja(P, 'logo-anillo', { x: 540 - 110, y: 200, w: 220, h: 220 }, '<img src="img/logo-avatar.png" alt="">');
    const handle = texto(P, { x: 0, y: 470, w: W }, '@Modovicecity6', { textAlign: 'center', font: "800 58px/1 Inter", color: '#fff', letterSpacing: '-0.01em' });
    const pill = caja(P, 'pill', { y: 568 }, icono('bell-ring', 40, 2.5) + 'Suscríbete y activa el modo Vice');
    estilo(pill, { background: 'var(--cyan)', border: '3px solid var(--cyan)', boxShadow: 'none', font: "800 36px/1 Inter", height: '88px' });
    centrarX(pill, 540);
    const fl2 = crearFlamenco(P, { x: 385, y: 896, w: 310, h: 465 });
    enrollar(P, tc, 0.9, 'baja');
    pop([logo, handle, pill], tc + 0.55, { stagger: 0.12, gan: 0.45 });
    fl2.respirar(tc, b).saludar(tc + 0.45, 2).parpadear(tc + 0.3);
    cue(tc, 'm_cierre', 1);
  }

  // ------------------------------------------------------------------ montaje
  MV.arrancar(() => {
    gsap.set('#marca', { autoAlpha: 0 });
    portada(); contexto(); ola(); nz(); espana(); sudamerica(); mexico();
    tabla(); ojo(); precarga(); hub(); fuentes(); cta();
    pop('#marca', T.inicio.contexto + 0.35, {
      desde: { autoAlpha: 0, x: -40, scale: 0.9, y: 0 }, hasta: { autoAlpha: 1, x: 0, scale: 1, y: 0 },
      ease: 'power3.out', sonido: false,
    });
    cue(T.inicio.contexto, 'm_groove', 1);
  });
})();
