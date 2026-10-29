/* ============================================================
   KANE — reel corto con Tor, ESTILO 2 (~45 s con el cierre)
   "¿Por que Harry Kane gano el Balon de Oro?" (apuntes del autor, con las
   cifras de Opta, UEFA y la federacion inglesa que el cita):
   - el reglamento ordena tres criterios (rendimiento individual; colectivo
     y titulos; clase y juego limpio) y no tiene una formula que convierta
     goles y copas en un ganador;
   - goles: Kane 61 con el Bayern, Mbappe 42 con el Madrid; con Inglaterra,
     Kane llego a 73 en 65 partidos;
   - titulos: Bundesliga, Copa y Supercopa; Mbappe, sin grandes titulos;
   - pero en los grandes torneos Mbappe rindio mas: 15 goles en Champions
     contra 14, y 10 en el Mundial contra 6 (Inglaterra tercera);
   - Yamal: 24 goles y 17 asistencias, Liga y Mundial; segun France
     Football, el apoyo a Espana pudo repartirse entre Yamal y Rodri (es una
     lectura de la votacion, no un dato de cada voto);
   - tesis: Kane no fue mejor en todo, pero tuvo la temporada mas completa.
   - cierre con su frase ("trabaja duro en silencio..."): el la explico como
     su manera de trabajar; no se presenta como indirecta.
   Tor es Kane con la camiseta de Inglaterra (blanca, el 9, la cruz). Los
   rivales van como camisetas: Madrid y Francia (Mbappe, 10), Barcelona (10)
   y Espana (Yamal 19, Rodri 16).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, PL = global.PL, V = global.V, TOR = global.TOR;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var A = global.REELS.ayudas;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';

  var INGLATERRA = { camiseta: BLANCO, cuello: C.INK, short: C.INK, numero: '9', colorNumero: C.INK, escudo: 'cruz' };
  // camisetas (N.ICONOS.camiseta)
  var K = {
    bayern: { color: C.RED, cuello: BLANCO, numero: '9' },
    inglaterra: { color: BLANCO, cuello: C.INK, numero: '9', colorNumero: C.INK },
    madrid: { color: BLANCO, cuello: C.INK, numero: '10', colorNumero: C.INK },
    francia: { color: C.INK, cuello: C.RED, numero: '10' },
    barca: { color: C.RED, rayas: C.INK, cuello: C.YEL, numero: '10', colorNumero: C.YEL },
    yamal: { color: C.RED, cuello: C.YEL, numero: '19', colorNumero: C.YEL },
    rodri: { color: C.RED, cuello: C.YEL, numero: '16', colorNumero: C.YEL }
  };
  function camiseta(k, x, y, s, cuando, extra) {
    return Object.assign({ C: N.ICONOS.camiseta, p: K[k], x: x, y: y, s: s, cuando: cuando }, extra || {});
  }

  function cuenta(n, a, b) {
    return function (T, f) {
      var k = Easing.easeOutCubic(animate({ from: 0, to: 1, start: f(a), end: f(b == null ? a + 0.16 : b) })(T));
      return { n: Math.round(n * k), p: k };
    };
  }

  // Tor (Kane) en sus coordenadas: centro de la cabeza (600, 410), piso 1500
  function cabezaDe(t) { return [t.x + 600 * t.s, t.y + 410 * t.s]; }

  // el gesto de silencio: el puno bajo el menton y el indice sobre los labios
  function poseSilencio() {
    var p = TOR.pose({ flex: 0 });
    var g = B.geoFrente({ pose: p });
    p.izq.codo = U.suma(g.izq.hombro, [-24, 196]);
    p.izq.mano = U.suma(g.cabeza, [-4, 104]);
    return p;
  }
  function dedo(g) {
    var m = g.izq.mano;
    var d = 'M ' + U.pt(U.suma(m, [6, -30])) + ' L ' + U.pt(U.suma(m, [6, -98]));
    return (
      <g>
        <path d={d} stroke={C.INK} strokeWidth={36} strokeLinecap="round" />
        <path d={d} stroke={BLANCO} strokeWidth={20} strokeLinecap="round" />
      </g>
    );
  }

  /* ---------------- dibujos del lienzo ---------------- */

  function mas(c, s) {
    var r = 26 * (s || 1);
    return <path d={'M ' + (c[0] - r) + ' ' + c[1] + ' L ' + (c[0] + r) + ' ' + c[1] + ' M ' + c[0] + ' ' + (c[1] - r) + ' L ' + c[0] + ' ' + (c[1] + r)}
      stroke={C.INK} strokeWidth={14} strokeLinecap="round" />;
  }
  function igual(c, s) {
    var r = 26 * (s || 1);
    return <path d={'M ' + (c[0] - r) + ' ' + (c[1] - 12) + ' L ' + (c[0] + r) + ' ' + (c[1] - 12) + ' M ' + (c[0] - r) + ' ' + (c[1] + 12) + ' L ' + (c[0] + r) + ' ' + (c[1] + 12)}
      stroke={C.INK} strokeWidth={14} strokeLinecap="round" />;
  }

  // barras de goles: base en y 1150; 73 goles = 560 px
  var BASE = 1150, POR_GOL = 560 / 73;
  function barra(x, alto, color, e) {
    if (alto < 2) return null;
    return (
      <g opacity={e}>
        <rect x={x} y={BASE - alto} width={200} height={alto} rx={16} fill={color} stroke={C.INK} strokeWidth={13} />
      </g>
    );
  }
  function alturaKane(T, f) {
    var a = animate({ from: 0, to: 61, start: f(0.06), end: f(0.3), ease: Easing.easeOutCubic })(T);
    return a + animate({ from: 0, to: 12, start: f(0.66), end: f(0.8), ease: Easing.easeOutCubic })(T);
  }
  function alturaMbappe(T, f) { return animate({ from: 0, to: 42, start: f(0.3), end: f(0.5), ease: Easing.easeOutCubic })(T); }

  // estante de trofeos y la silueta punteada del trofeo que falta
  function estante(x0, x1, y, e) {
    return <rect x={x0} y={y} width={x1 - x0} height={26} rx={12} fill={C.GRY} stroke={C.INK} strokeWidth={12} opacity={e} />;
  }
  function trofeoFaltante(c, e) {
    var q = function (dx, dy) { return (c[0] + dx) + ' ' + (c[1] + dy); };
    return (
      <path d={'M ' + q(-60, -90) + ' L ' + q(60, -90) + ' L ' + q(56, -40) + ' C ' + q(52, 6) + ' ' + q(30, 20) + ' ' + q(0, 20) +
        ' C ' + q(-30, 20) + ' ' + q(-52, 6) + ' ' + q(-56, -40) + ' Z M ' + q(-14, 20) + ' L ' + q(-18, 50) + ' L ' + q(18, 50) + ' L ' + q(14, 20) +
        ' M ' + q(-46, 56) + ' L ' + q(46, 56) + ' L ' + q(46, 84) + ' L ' + q(-46, 84) + ' Z'}
        fill="none" stroke={C.GRY} strokeWidth={10} strokeDasharray="18 16" strokeLinejoin="round" opacity={e} />
    );
  }

  // votos: bolitas amarillas que caen y se reparten entre dos camisetas
  function votos(T, f, desde, n, a, b) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var t0 = f(desde) + i * 0.22;
      var u = (T - t0) / 0.55;
      if (u <= 0) continue;
      var k = Easing.easeInOutCubic(clamp(u, 0, 1));
      var dest = i % 2 ? b : a;
      var x = U.lerp(540, dest[0] + ((i * 37) % 60) - 30, k);
      var y = U.lerp(860, dest[1], k) - 120 * Math.sin(Math.PI * k);
      var op = u > 1 ? clamp(1 - (u - 1) * 2, 0, 1) : 1;
      out.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={16} fill={C.YEL} stroke={C.INK} strokeWidth={6} opacity={op} />);
    }
    return <g>{out}</g>;
  }

  var TOR_K = function (o) { return Object.assign({ ropa: INGLATERRA, boca: 'sonrisa' }, o); };
  var BOTA = { x: 120, y: 390, s: 0.7 };          // Tor grande en el gancho
  var FINAL = { x: 260, y: 560, s: 0.6 };        // Tor con el balon de oro en alto

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3.5, vo: '¿Por qué Kane ganó el Balón de Oro y no Mbappé o Yamal?',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.2, foco: [540, 640] }], [1, { zoom: 1.02, foco: [540, 900] }]],
        pulsos: [0.34],
        tor: TOR_K({ x: BOTA.x, y: BOTA.y, s: BOTA.s,
          flex: function (T, f) { return 0.2 + 0.8 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.16), end: f(0.34) })(T)); } }),
        piezas: [
          { C: N.ICONOS.balonOro, s: 0.95, x: 426, y: 352, cuando: 0.28 },
          camiseta('francia', 30, 1110, 0.8, 0.52),
          camiseta('yamal', 800, 1110, 0.8, 0.6, { fase: 0.6 })
        ],
        lienzo: function (T, f) {
          return (
            <g>
              <V.Brillo T={T} c={[540, 466]} r={130} v={animate({ from: 0, to: 1, start: f(0.3), end: f(0.4) })(T)} />
              <V.Chispa T={T} c={[540, 466]} cuando={f(0.34)} r={150} />
            </g>
          );
        },
        r1: { text: 'BALÓN DE ORO', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Reglas', dur: 5, vo: 'El jurado mira tres cosas: rendimiento individual, títulos y juego limpio. No hay una fórmula matemática.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 700] }], [0.6, { zoom: 1.0, foco: [540, 900] }], [1, { zoom: 1.05, foco: [540, 1000] }]],
        golpes: [0.76],
        tor: TOR_K({ x: 560, y: 360, s: 0.5 }),
        piezas: [
          { C: B.Cuenta, s: 0.9, x: 40, y: 380, p: { n: 1, p: 1 } },
          { C: N.ICONOS.persona, s: 0.9, x: 256, y: 366, p: { color: C.YEL } },
          { C: B.Cuenta, s: 0.9, x: 40, y: 640, cuando: 0.2, p: { n: 2, p: 1 } },
          { C: N.ICONOS.copa, s: 0.9, x: 256, y: 626, cuando: 0.22 },
          { C: B.Cuenta, s: 0.9, x: 40, y: 900, cuando: 0.38, p: { n: 3, p: 1 } },
          { C: N.ICONOS.escudo, s: 0.9, x: 256, y: 886, cuando: 0.4 },
          { C: N.ICONOS.balon, s: 0.62, x: 60, y: 1180, cuando: 0.6 },
          { C: N.ICONOS.copa, s: 0.62, x: 340, y: 1180, cuando: 0.64 },
          { C: N.ICONOS.balonOro, s: 0.7, x: 640, y: 1168, cuando: 0.68 }
        ],
        lienzo: function (T, f) {
          var e1 = M.pop(T, f(0.62), 0.4), e2 = M.pop(T, f(0.66), 0.4);
          return <g><g opacity={e1.opacity}>{mas([280, 1254], e1.scale)}</g><g opacity={e2.opacity}>{igual([570, 1254], e2.scale)}</g></g>;
        },
        mal: [{ x: 470, y: 1170, cuando: 0.74, s: 0.8 }],
        r1: { text: 'TRES CRITERIOS', cuando: 0.04 },
        r2: { text: 'SIN FÓRMULA', s: 1.2, cuando: 0.74 }
      }) },

    { nombre: 'Goles', dur: 6, vo: 'Kane hizo 61 goles con el Bayern; Mbappé, 42 con el Madrid. Y sumando Inglaterra, Kane llegó a 73.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 960] }], [0.6, { zoom: 1.0, foco: [540, 900] }], [1, { zoom: 1.08, foco: [460, 820] }]],
        pulsos: [0.8],
        piezas: [
          camiseta('bayern', 248, 1170, 0.85),
          camiseta('madrid', 628, 1170, 0.85, 0.28, { fase: 0.5 }),
          { C: B.Cuenta, s: 0.8, x: 262, cuando: 0.1,
            y: function (T, f) { return BASE - alturaKane(T, f) * POR_GOL - 196; },
            p: function (T, f) {
              var k = Easing.easeOutCubic(animate({ from: 0, to: 1, start: f(0.06), end: f(0.3) })(T));
              var x = animate({ from: 0, to: 1, start: f(0.66), end: f(0.8) })(T);
              return { n: Math.round(61 * k + 12 * x), p: k };
            } },
          { C: B.Cuenta, s: 0.8, x: 642, cuando: 0.32, fase: 0.5,
            y: function (T, f) { return BASE - alturaMbappe(T, f) * POR_GOL - 196; }, p: cuenta(42, 0.3, 0.5) }
        ],
        lienzo: function (T, f) {
          var k = alturaKane(T, f), m = alturaMbappe(T, f);
          var ext = Math.max(0, k - 61);
          return (
            <g>
              <path d={'M 160 ' + BASE + ' L 920 ' + BASE} stroke={C.INK} strokeWidth={14} strokeLinecap="round" />
              {barra(250, Math.min(k, 61) * POR_GOL, C.YEL, 1)}
              {ext > 0.3 ? <rect x={250} y={BASE - k * POR_GOL} width={200} height={ext * POR_GOL + 14} rx={16} fill={C.GRN} stroke={C.INK} strokeWidth={13} /> : null}
              {barra(630, m * POR_GOL, C.GRY, 1)}
              <V.Chispa T={T} c={[350, BASE - 73 * POR_GOL]} cuando={f(0.8)} r={120} />
            </g>
          );
        },
        r1: { text: '61 CONTRA 42', s: 1.25, cuando: 0.06 },
        r2: { text: '73 EN 65 PARTIDOS', cuando: 0.66 }
      }) },

    { nombre: 'Títulos', dur: 4, vo: 'Y ganó Bundesliga, Copa y Supercopa. Mbappé no ganó ningún título grande.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 780] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        piezas: [
          camiseta('bayern', 120, 380, 1.15),
          camiseta('madrid', 680, 380, 1.15, null, { fase: 0.5 }),
          { C: N.ICONOS.copa, s: 0.78, x: 10, y: 780, cuando: 0.08 },
          { C: N.ICONOS.copa, s: 0.78, x: 176, y: 780, cuando: 0.16 },
          { C: N.ICONOS.copa, s: 0.78, x: 342, y: 780, cuando: 0.24 }
        ],
        lienzo: function (T, f) {
          var e = M.pop(T, f(0.04), 0.4).opacity, e2 = M.pop(T, f(0.5), 0.4).opacity;
          return (
            <g>
              {estante(20, 530, 968, e)}
              {estante(610, 1040, 968, e2)}
              {trofeoFaltante([826, 880], e2)}
              <V.Brillo T={T} c={[275, 880]} r={190} v={animate({ from: 0, to: 0.8, start: f(0.28), end: f(0.38) })(T)} />
            </g>
          );
        },
        bien: [{ x: 200, y: 1070, cuando: 0.32, s: 0.8 }],
        mal: [{ x: 750, y: 1070, cuando: 0.62, s: 0.7 }],
        r1: { text: '3 TÍTULOS', s: 1.3, cuando: 0.04 },
        r2: { text: 'MBAPPÉ, SIN TÍTULOS', cuando: 0.55 }
      }) },

    { nombre: 'Torneos', dur: 6.5, vo: 'Pero en los grandes torneos Mbappé brilló más: 15 goles en Champions contra 14, y 10 en el Mundial contra 6.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.08, foco: [540, 560] }], [0.5, { zoom: 1.0, foco: [540, 900] }], [1, { zoom: 1.08, foco: [540, 1060] }]],
        piezas: [
          camiseta('bayern', 40, 480, 0.72),
          { C: B.Cuenta, s: 0.85, x: 230, y: 470, cuando: 0.1, p: cuenta(14, 0.1) },
          { C: N.ICONOS.balon, s: 0.62, x: 466, y: 498, cuando: 0.04, fase: 0.3 },
          { C: B.Cuenta, s: 0.85, x: 664, y: 470, cuando: 0.18, p: cuenta(15, 0.18) },
          camiseta('madrid', 860, 480, 0.72, 0.14, { fase: 0.6 }),
          camiseta('inglaterra', 40, 960, 0.72, 0.5),
          { C: B.Cuenta, s: 0.85, x: 230, y: 950, cuando: 0.56, p: cuenta(6, 0.56) },
          { C: N.ICONOS.copa, s: 0.62, x: 466, y: 978, cuando: 0.5, fase: 0.3 },
          { C: B.Cuenta, s: 0.85, x: 664, y: 950, cuando: 0.64, p: cuenta(10, 0.64) },
          camiseta('francia', 860, 960, 0.72, 0.6, { fase: 0.6 })
        ],
        lienzo: function (T, f) {
          return (
            <g>
              <path d="M 120 842 L 960 842" stroke={C.GRY} strokeWidth={10} strokeDasharray="4 24" strokeLinecap="round"
                opacity={M.pop(T, f(0.46), 0.4).opacity} />
              <V.Brillo T={T} c={[757, 563]} r={110} v={animate({ from: 0, to: 1, start: f(0.3), end: f(0.38) })(T)} />
              <V.Brillo T={T} c={[757, 1043]} r={110} v={animate({ from: 0, to: 1, start: f(0.78), end: f(0.86) })(T)} />
            </g>
          );
        },
        r1: { text: 'CHAMPIONS: 14 VS 15', cuando: 0.06 },
        r2: { text: 'MUNDIAL: 6 VS 10', cuando: 0.52 }
      }) },

    { nombre: 'Yamal', dur: 7, vo: 'Yamal también tenía argumentos: 24 goles, 17 asistencias, la Liga y el Mundial. Y el apoyo a España pudo repartirse con Rodri.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 600] }], [0.5, { zoom: 1.0, foco: [540, 900] }], [1, { zoom: 1.06, foco: [540, 1080] }]],
        piezas: [
          camiseta('barca', 60, 400, 0.95),
          { C: B.Cuenta, s: 0.85, x: 340, y: 410, cuando: 0.1, p: cuenta(24, 0.1) },
          { C: B.Cuenta, s: 0.85, x: 600, y: 410, cuando: 0.2, p: cuenta(17, 0.2) },
          { C: N.ICONOS.copa, s: 0.5, x: 410, y: 640, cuando: 0.32 },
          { C: N.ICONOS.copa, s: 0.5, x: 560, y: 640, cuando: 0.38 },
          camiseta('yamal', 180, 1000, 0.85, 0.56),
          camiseta('rodri', 660, 1000, 0.85, 0.62, { fase: 0.5 })
        ],
        lienzo: function (T, f) {
          return (
            <g>
              <V.Confeti T={T} desde={f(0.36)} n={18} v={1 - animate({ from: 0, to: 1, start: f(0.5), end: f(0.6) })(T)} />
              {votos(T, f, 0.66, 9, [282, 1070], [762, 1070])}
            </g>
          );
        },
        r1: { text: '24 GOLES, 17 ASISTENCIAS', cuando: 0.06 },
        r2: { text: 'VOTOS REPARTIDOS', cuando: 0.62 }
      }) },

    { nombre: 'Veredicto', dur: 4.5, vo: 'Kane no fue mejor en todo, pero sí tuvo la temporada más completa.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.08, foco: [620, 760] }], [1, { zoom: 1.0, foco: [560, 900] }]],
        pulsos: [0.3],
        tor: TOR_K({ x: FINAL.x, y: FINAL.y, s: FINAL.s, flex: 1 }),
        piezas: [
          { C: N.ICONOS.balonOro, s: 0.85, x: FINAL.x + 600 * FINAL.s - 102, y: FINAL.y + 326 * FINAL.s - 250, cuando: 0.16 },
          { C: N.ICONOS.balon, s: 0.55, x: 70, y: 660, cuando: 0.4 },
          { C: N.ICONOS.copa, s: 0.55, x: 70, y: 880, cuando: 0.48 },
          { C: N.ICONOS.mundo, s: 0.55, x: 70, y: 1100, cuando: 0.56 }
        ],
        lienzo: function (T, f) {
          var c = [FINAL.x + 600 * FINAL.s, FINAL.y + 326 * FINAL.s - 148];
          return (
            <g>
              <V.Confeti T={T} desde={f(0.22)} />
              <V.Brillo T={T} c={c} r={120} v={animate({ from: 0, to: 1, start: f(0.2), end: f(0.3) })(T)} />
              <V.Chispa T={T} c={c} cuando={f(0.3)} r={140} />
            </g>
          );
        },
        bien: [{ x: 860, y: 1180, cuando: 0.66, s: 0.7 }],
        r1: { text: 'LA MÁS COMPLETA', cuando: 0.06 },
        r2: { text: 'GOLES + TÍTULOS', s: 1.2, cuando: 0.5 }
      }) },

    { nombre: 'Su frase', dur: 4.5, vo: 'Como él publicó: trabaja duro en silencio y deja que el éxito sea tu ruido.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.25, foco: [460, 700] }], [0.45, { zoom: 1.2, foco: [460, 700] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.5],
        tor: TOR_K({ x: 50, y: 360, s: 0.66, boca: function (T, f) { return T < f(0.48) ? true : 'sonrisa'; },
          flex: function (T, f) { return T < f(0.48) ? 0 : 1; },
          pose: function (T, f) { return T < f(0.48) ? poseSilencio() : TOR.pose({ flex: 1 }); },
          extra: function (g, T, f) { return T < f(0.48) ? dedo(g) : null; } }),
        piezas: [{ C: N.ICONOS.balonOro, s: 0.9, x: 760, y: 820, cuando: 0.48 }],
        lienzo: function (T, f) {
          A.sonido('campana', f(0.5));
          var v = animate({ from: 0, to: 1, start: f(0.5), end: f(0.58) })(T);
          return (
            <g>
              <V.Ondas T={T} c={[868, 920]} r={130} v={v} />
              <V.Brillo T={T} c={[868, 920]} r={110} v={v} />
              <V.Confeti T={T} desde={f(0.52)} n={30} />
            </g>
          );
        },
        r1: { text: 'TRABAJA EN SILENCIO', cuando: 0.06 },
        r2: { text: 'QUE EL ÉXITO SUENE', cuando: 0.5 }
      }) }
  ];

  global.REELS.registrar({ id: 'kane', titulo: 'Kane y el Balón de Oro (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
