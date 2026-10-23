/* ============================================================
   CRISTIANO — reel corto con Tor, ESTILO 2 (~40 s con el cierre)
   "¿Por que Cristiano Ronaldo no se retira aun?" (apuntes del autor):
   1) cuidado fisico de elite: nutricion y descanso para recuperarse,
      fuerza explosiva cuidando las articulaciones; su rendimiento no cae;
   2) la meta de los 1.000 goles oficiales, el primero de la historia;
   3) ama el futbol y la adrenalina; siente que aporta, de titular o desde
      el banco; 4) su legado: pilar del futbol en Arabia Saudita y marca
      mundial. Tor va con la camiseta de Portugal (roja, cuello y short
      verdes, el 7) y antes del cierre festeja con el "¡siuuu!" (salto,
      giro en el aire y aterriza con los brazos abiertos hacia abajo; el
      sonido lo sintetiza herramientas/audio.py, tipo "siu").
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, PL = global.PL, V = global.V, TOR = global.TOR;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var A = global.REELS.ayudas;
  var U = B.util;
  var C = P.C;

  var PORTUGAL = { camiseta: C.RED, cuello: C.GRN, short: C.GRN, numero: '7' };
  var FIG = PL.FIG;

  function cuenta(n, a) {
    return function (T, f) {
      var k = Easing.easeOutCubic(animate({ from: 0, to: 1, start: f(a), end: f(a + 0.16) })(T));
      return { n: Math.round(n * k), p: k };
    };
  }
  function late(T) { return { beat: 1 + 0.1 * Math.max(0, Math.sin(T * Math.PI * 2 / 0.75)) }; }

  // pose de Tor: brazos abiertos hacia abajo (a grados desde la vertical), piernas abiertas,
  // agacha 0..1 flexiona las rodillas (antes del salto y al caer)
  function poseSiu(a, pies, agacha) {
    var p = B.poseFrente.depie({ pies: pies });
    var dy = 120 * (agacha || 0);
    p.centro = [p.centro[0], p.centro[1] + dy];
    p.cuello = [p.cuello[0], p.cuello[1] + dy];
    var g = B.geoFrente({ pose: p });
    ['izq', 'der'].forEach(function (k, i) {
      var l = i ? 1 : -1, S = g[k].hombro, r = a * Math.PI / 180;
      var E = [S[0] + l * Math.sin(r) * 200, S[1] + Math.cos(r) * 200];
      p[k].codo = E;
      p[k].mano = [E[0] + l * Math.sin(r) * 196, E[1] + Math.cos(r) * 196];
      p[k].rodilla = [p[k].rodilla[0] + l * 60 * (agacha || 0), p[k].rodilla[1] + 30 * (agacha || 0)];
    });
    return p;
  }

  // balon que rebota (en una pieza): y y giro dependen de T
  function rebote(x0, y0, alto, periodo) {
    return {
      y: function (T) { return y0 - alto * Math.abs(Math.sin(Math.PI * T / periodo)); },
      p: function (T) { return { giro: (T * 220) % 360 }; }
    };
  }

  // tiros al arco: cada balon sale de los pies de Tor y entra en la red
  function tiros(T, f, salidas) {
    var desde = [430, 1430], arco = [540, 640];
    return (
      <g>
        {salidas.map(function (c, i) {
          var u = (T - f(c)) / 0.5;
          if (u <= 0 || u > 1.6) return null;
          var k = Easing.easeOutCubic(clamp(u, 0, 1));
          var x = U.lerp(desde[0], arco[0] + (i - 1) * 110, k);
          var y = U.lerp(desde[1], arco[1] + 40 * Math.sin(i * 2), k) - 260 * Math.sin(Math.PI * k);
          var s = U.lerp(0.62, 0.36, k);
          var op = u > 1.2 ? clamp((1.6 - u) / 0.4, 0, 1) : 1;
          return (
            <g key={i} opacity={op} transform={'translate(' + (x - 120 * s).toFixed(1) + ' ' + (y - 120 * s).toFixed(1) + ')'}>
              <N.ICONOS.balon s={s} giro={u * 500} />
            </g>
          );
        })}
        {salidas.map(function (c, i) {
          return <V.Chispa key={'c' + i} T={T} c={[540 + (i - 1) * 110, 640]} cuando={f(c) + 0.5} r={70} />;
        })}
      </g>
    );
  }

  // barra de progreso hacia la meta de los 1.000
  function progreso(T, f) {
    var e = M.pop(T, f(0.3), 0.42);
    var p = animate({ from: 0, to: 0.96, start: f(0.34), end: f(0.66), ease: Easing.easeInOutCubic })(T);
    var x0 = 140, x1 = 880, y = 1000;
    return (
      <g opacity={e.opacity} transform={'translate(540 ' + y + ') scale(' + e.scale.toFixed(3) + ') translate(-540 ' + (-y) + ')'}>
        <rect x={x0} y={y - 30} width={x1 - x0} height={60} rx={30} fill="#ffffff" stroke={C.INK} strokeWidth={14} />
        {p > 0.02 ? <rect x={x0 + 10} y={y - 20} width={(x1 - x0 - 20) * p} height={40} rx={20} fill={C.YEL} /> : null}
        <path d={'M ' + (x1 + 40) + ' ' + (y + 40) + ' L ' + (x1 + 40) + ' ' + (y - 150)} stroke={C.INK} strokeWidth={14} strokeLinecap="round" />
        <path d={'M ' + (x1 + 46) + ' ' + (y - 146) + ' L ' + (x1 + 150) + ' ' + (y - 116) + ' L ' + (x1 + 46) + ' ' + (y - 84) + ' Z'}
          fill={C.GRN} stroke={C.INK} strokeWidth={11} strokeLinejoin="round" />
      </g>
    );
  }

  /* ---------------- el siuuu: salto, giro en el aire y caida con los brazos abiertos ---------------- */

  var SIU = { x: 120, y: 330, s: 0.7 };

  function EscSiu(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    // tiempos: se agacha, salta girando, cae y se queda en la pose
    var ag = animate({ from: 0, to: 1, start: f(0.02), end: f(0.16), ease: Easing.easeOutCubic })(T);
    var u = clamp((T - f(0.16)) / (f(0.48) - f(0.16)), 0, 1);
    var enAire = u > 0 && u < 1;
    var cae = clamp((T - f(0.48)) / (f(0.56) - f(0.48)), 0, 1);
    var sube = Math.sin(Math.PI * u);
    var giro = enAire ? Math.max(0.14, Math.abs(Math.cos(2 * Math.PI * u))) : 1;
    var agacha = u === 0 ? ag : (u < 1 ? 0 : 0.7 * (1 - cae) * Math.sin(Math.PI * Math.min(1, cae * 1.6)) + 0.12);
    var brazos = u < 1 ? U.lerp(12, 24, ag) - 8 * sube : U.lerp(24, 42, Easing.easeOutBack(cae));
    var pies = u < 1 ? 96 : U.lerp(96, 168, Easing.easeOutCubic(cae));
    var pose = poseSiu(brazos, pies, agacha);
    sonidoSiu(f(0.42));
    var w = 1200 * SIU.s, h = 1600 * SIU.s;
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} tomas={[[0, { zoom: 1.08, foco: [540, 1000] }], [0.5, { zoom: 1.0, foco: [540, 960] }], [1, { zoom: 1.12, foco: [540, 900] }]]}
          golpes={[0.5]} pulsos={[0.5]}>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <ellipse cx={540} cy={SIU.y + 1505 * SIU.s} rx={260 * (1 - 0.45 * sube)} ry={30 * (1 - 0.45 * sube)} fill={C.GRY} />
            {enAire ? <V.Lineas c={[540, SIU.y + 1520 * SIU.s - 340 * sube]} dir={[0, -1]} v={sube} largo={160} /> : null}
          </svg>
          <A.Pos x={SIU.x} y={SIU.y} e={M.pop(T, at - 0.6, 0.5)} dy={M.life(T, 3.6, 4)}>
            <div style={{
              transformOrigin: (w / 2) + 'px ' + (h * 0.94) + 'px',
              transform: 'translate(0px,' + (-340 * sube).toFixed(1) + 'px) scale(' + giro.toFixed(3) + ',1)'
            }}>
              <TOR.Tor s={SIU.s} pose={pose} ropa={PORTUGAL} boca="sonrisa" sinPiso parpadeo={V.parpadeo(T)} />
            </div>
          </A.Pos>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <V.Chispa T={T} c={[540, SIU.y + 700 * SIU.s]} cuando={f(0.5)} r={260} />
            <V.Brillo T={T} c={[540, SIU.y + 700 * SIU.s]} r={300} v={animate({ from: 0, to: 1, start: f(0.5), end: f(0.6) })(T)} />
          </svg>
        </V.Camara>
        <V.Rot T={T} text="¡SIUUU!" y={300} s={1.7} cuando={f(0.5)} />
      </div>
    );
  }
  function sonidoSiu(t) { A.sonido('siu', t); }

  var TOR_POR = function (o) { return Object.assign({ ropa: PORTUGAL }, o); };

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: '¿Por qué Cristiano Ronaldo, con 41 años, no se retira?',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.18, foco: [540, 760] }], [1, { zoom: 1.02, foco: [540, 900] }]],
        pulsos: [0.45],
        tor: TOR_POR({ x: FIG.x - 90, y: FIG.y + 60, boca: 'sonrisa',
          flex: function (T, f) { return 0.2 + 0.8 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.3), end: f(0.48) })(T)); } }),
        piezas: [
          Object.assign({ C: N.ICONOS.balon, s: 0.8, x: 760, cuando: 0.08 }, rebote(760, 1240, 160, 0.6)),
          { C: B.Cuenta, s: 0.95, x: 740, y: 760, cuando: 0.14, p: cuenta(41, 0.15) }
        ],
        r1: { text: 'CRISTIANO RONALDO', s: 1.15, cuando: 0.02 }
      }) },

    { nombre: 'Cuerpo', dur: 7.5, vo: 'Primero, su cuerpo. Come y duerme para recuperarse rápido, y entrena fuerza explosiva cuidando las articulaciones. Por eso su rendimiento no se cae.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.05, foco: [540, 700] }], [0.4, { zoom: 1.05, foco: [540, 1000] }], [0.75, { zoom: 1.1, foco: [540, 900] }], [1, { zoom: 1.02, foco: [540, 960] }]],
        pulsos: [0.78],
        tor: TOR_POR({ s: 0.62, x: 168, y: 470, boca: 'sonrisa',
          flex: function (T, f) { return 0.15 + 0.85 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.74), end: f(0.86) })(T)); },
          extra: function (g, T, f) { return <V.Chispa T={T} c={g.cabeza} cuando={f(0.8)} r={190} />; } }),
        piezas: [
          { C: N.COMIDA.pollo, s: 0.62, plato: 0.62, x: 30, y: 380, cuando: 0.1, fase: 0.3 },
          { C: N.ICONOS.luna, s: 0.95, x: 820, y: 390, cuando: 0.2 },
          { C: P.Pesa, s: 0.6, x: 10, y: 1010, cuando: 0.36 },
          { C: N.ICONOS.escudo, s: 0.95, x: 820, y: 960, cuando: 0.5, p: { color: C.GRN } }
        ],
        bien: [{ x: 850, y: 1300, cuando: 0.82, s: 0.7 }],
        r1: { text: 'COME Y DESCANSA', cuando: 0.1 },
        r2: { text: 'FUERZA SIN IMPACTO', cuando: 0.42 }
      }) },

    { nombre: '1.000 goles', dur: 6.5, vo: 'Segundo, una meta: ser el primero en la historia con mil goles oficiales. Y la ve a su alcance.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 760] }], [0.5, { zoom: 1.0, foco: [540, 960] }], [1, { zoom: 1.04, foco: [540, 900] }]],
        pulsos: [0.66],
        piezas: [
          { C: N.ICONOS.arco, s: 2.2, x: 276, y: 380 },
          { C: TOR.Tor, s: 0.34, x: 336, y: 1010, cuando: 0.04, p: function (T, f) {
            return { ropa: PORTUGAL, boca: 'sonrisa', parpadeo: V.parpadeo(T, 0.7), sinPiso: true,
              flex: 0.1 + 0.9 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.66), end: f(0.78) })(T)) };
          } }
        ],
        lienzo: function (T, f) {
          return <g>{tiros(T, f, [0.08, 0.2, 0.32])}{progreso(T, f)}</g>;
        },
        bien: [{ x: 860, y: 1180, cuando: 0.7, s: 0.7 }],
        r1: { text: '1.000 GOLES', s: 1.35, cuando: 0.08 },
        r2: { text: 'EL PRIMERO DE LA HISTORIA', cuando: 0.42 }
      }) },

    { nombre: 'Ama el fútbol', dur: 6, vo: 'Tercero, ama el fútbol y la adrenalina. Siente que todavía aporta, de titular o desde el banco.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.08, foco: [540, 760] }], [0.55, { zoom: 1.0, foco: [540, 960] }], [1, { zoom: 1.05, foco: [540, 900] }]],
        tor: TOR_POR({ s: 0.6, x: 180, y: 470, boca: 'sonrisa', flex: 0.25 }),
        piezas: [
          Object.assign({ C: N.ICONOS.balon, s: 0.62, x: 465 }, rebote(465, 520, 150, 0.7)),
          { C: P.Corazon, s: 2.1, x: 790, y: 420, cuando: 0.1, p: late },
          { C: B.Banco, s: 0.4, x: -20, y: 1120, cuando: 0.6 }
        ],
        bien: [{ x: 120, y: 1000, cuando: 0.66, s: 0.7 }],
        r1: { text: 'AMA EL FÚTBOL', s: 1.2, cuando: 0.06 },
        r2: { text: 'TITULAR O SUPLENTE', cuando: 0.56 }
      }) },

    { nombre: 'Legado', dur: 6, vo: 'Y cuarto, su legado: es el pilar del fútbol en Arabia Saudita y una marca mundial.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 700] }], [0.5, { zoom: 1.0, foco: [540, 960] }], [1, { zoom: 1.05, foco: [540, 900] }]],
        pulsos: [0.6],
        tor: TOR_POR({ s: 0.55, x: 210, y: 560, boca: 'sonrisa',
          flex: function (T, f) { return 0.3 + 0.7 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.56), end: f(0.68) })(T)); } }),
        piezas: [
          { C: N.ICONOS.copa, s: 1.15, x: 30, y: 380, cuando: 0.08 },
          { C: N.ICONOS.mundo, s: 1.15, x: 774, y: 380, cuando: 0.56 }
        ],
        lienzo: function (T, f) {
          return (
            <g>
              <V.Brillo T={T} c={[168, 520]} r={150} v={animate({ from: 0, to: 1, start: f(0.1), end: f(0.2) })(T)} />
              <V.Brillo T={T} c={[912, 518]} r={150} v={animate({ from: 0, to: 1, start: f(0.58), end: f(0.68) })(T)} />
            </g>
          );
        },
        r1: { text: 'SU LEGADO', s: 1.3, cuando: 0.06 },
        r2: { text: 'MARCA MUNDIAL', s: 1.2, cuando: 0.56 }
      }) },

    { nombre: 'Cierre', dur: 4.5, vo: 'Mientras se sienta útil y competitivo, no piensa parar. ¿Tú qué opinas?',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.12, foco: [540, 760] }], [1, { zoom: 1.0, foco: [540, 960] }]],
        pulsos: [0.3],
        tor: TOR_POR({ x: FIG.x, y: FIG.y + 40, boca: 'sonrisa',
          flex: function (T, f) { return 0.4 + 0.6 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.08), end: f(0.3) })(T)); },
          extra: function (g, T, f) { return <V.Chispa T={T} c={g.cabeza} cuando={f(0.3)} r={220} />; } }),
        piezas: [Object.assign({ C: N.ICONOS.balon, s: 0.7, x: 800, cuando: 0.2 }, rebote(800, 1150, 140, 0.6))],
        r1: { text: 'NO PIENSA PARAR', cuando: 0.08 },
        r2: { text: 'MIENTRAS RINDA', s: 1.2, cuando: 0.5 }
      }) },

    { nombre: 'Siuuu', dur: 3, vo: '¡Siuuu! (el festejo suena solo; puedes gritarlo tú también)', C: EscSiu }
  ];

  global.REELS.registrar({ id: 'cristiano', titulo: 'Cristiano no se retira (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
