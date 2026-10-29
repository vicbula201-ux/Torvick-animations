/* ============================================================
   LEBRON — reel corto con Tor, ESTILO 2 (~40 s con el cierre)
   "¿Por que LeBron James no se retira?" (pedido del autor: parecido al de
   Cristiano; hoy esta en los Philadelphia 76ers, tiene 41 y cumple 42 en
   diciembre). Las razones:
   1) su cuerpo: sueno, recuperacion y comida; se habla de mas de un millon
      de dolares al ano invertidos en eso (asi lo conto su socio; es una
      cifra de prensa, por eso "se habla");
   2) la historia: es el maximo anotador de la NBA y esta en su temporada 24,
      mas que nadie;
   3) ama competir: ya cumplio el sueno de jugar con su hijo Bronny (Lakers,
      2024, el primer padre e hijo juntos en la NBA);
   4) su legado: cuatro anillos, una marca enorme, y todavia quiere mas.
   Tor va con una musculosa blanca de basquet (sin numero: no sabemos cual
   usa en Filadelfia) y, con Bronny, con la amarilla de los Lakers (23 y 9).
   Antes del cierre, la tiza al aire (su ritual antes de cada partido) y la
   tribuna que ruge (efecto "publico", sintetizado en audio.py).
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

  var SIXERS = { camiseta: BLANCO, cuello: C.RED, short: C.INK, mangas: false };
  var LAKERS = function (n) { return { camiseta: C.YEL, cuello: C.INK, short: C.YEL, numero: n, colorNumero: C.INK, mangas: false }; };
  var FIG = PL.FIG;

  function cuenta(n, a, b) {
    return function (T, f) {
      var k = Easing.easeOutCubic(animate({ from: 0, to: 1, start: f(a), end: f(b == null ? a + 0.16 : b) })(T));
      return { n: Math.round(n * k), p: k };
    };
  }

  // poses de Tor (coordenadas de B.Frente: cabeza en 600, 410; piso 1500)
  function poseDribla() {
    var p = TOR.pose({ flex: 0 });
    p.der.codo = [810, 860];
    p.der.mano = [900, 1040];
    return p;
  }
  function poseTiro() {
    var p = TOR.pose({ flex: 0 });
    p.izq.codo = [440, 430]; p.izq.mano = [560, 250];
    p.der.codo = [760, 430]; p.der.mano = [650, 240];
    return p;
  }
  // tiza: las manos juntas frente al pecho (frota) o arriba en V (la tira)
  function poseTiza(arriba) {
    var p = TOR.pose({ flex: 0 });
    var junta = { izq: { codo: [420, 840], mano: [585, 760] }, der: { codo: [780, 840], mano: [615, 760] } };
    var v = { izq: { codo: [380, 470], mano: [300, 230] }, der: { codo: [820, 470], mano: [900, 230] } };
    ['izq', 'der'].forEach(function (k) {
      p[k].codo = U.lerpP(junta[k].codo, v[k].codo, arriba);
      p[k].mano = U.lerpP(junta[k].mano, v[k].mano, arriba);
    });
    return p;
  }

  // la pelota que pica entre la mano y el piso (canvas)
  function pique(mano, piso, k, periodo) {
    var r = 94 * k, tam = 240 * k;
    return {
      x: mano[0] - tam / 2,
      y: function (T) { return U.lerp(mano[1] + r, piso - r, Math.abs(Math.sin(Math.PI * T / periodo))) - tam / 2; },
      p: function (T) { return { giro: (T * 300) % 360 }; }
    };
  }

  // tiros al aro: la pelota sale de las manos y entra
  function tiros(T, f, desde, aro, salidas) {
    return (
      <g>
        {salidas.map(function (c, i) {
          var u = (T - f(c)) / 0.6;
          if (u <= 0 || u > 1.3) return null;
          var k = clamp(u, 0, 1);
          var x = U.lerp(desde[0], aro[0], k), y = U.lerp(desde[1], aro[1], k) - 380 * Math.sin(Math.PI * k);
          if (u > 1) y += 160 * (u - 1) / 0.3;
          var op = u > 1.15 ? clamp((1.3 - u) / 0.15, 0, 1) : 1;
          var s = U.lerp(0.55, 0.42, k);
          return (
            <g key={i} opacity={op} transform={'translate(' + (x - 120 * s).toFixed(1) + ' ' + (y - 120 * s).toFixed(1) + ')'}>
              <N.ICONOS.basket s={s} giro={u * 400} />
            </g>
          );
        })}
        {salidas.map(function (c, i) { return <V.Chispa key={'c' + i} T={T} c={aro} cuando={f(c) + 0.6} r={80} />; })}
      </g>
    );
  }

  /* ---------------- la tiza al aire ---------------- */

  var TZ = { x: 120, y: 380, s: 0.7 };
  function enTz(p) { return [TZ.x + p[0] * TZ.s, TZ.y + p[1] * TZ.s]; }

  function EscTiza(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var frota = T < f(0.3) ? Math.sin(T * 26) * 8 : 0;
    var arriba = animate({ from: 0, to: 1, start: f(0.3), end: f(0.42), ease: Easing.easeOutBack })(T);
    var pose = poseTiza(arriba);
    if (arriba < 0.05) {
      pose.izq.mano = U.suma(pose.izq.mano, [frota, 0]);
      pose.der.mano = U.suma(pose.der.mano, [-frota, 0]);
    }
    A.sonido('publico', f(0.36));
    var rugido = animate({ from: 0, to: 1, start: f(0.38), end: f(0.5) })(T);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} tomas={[[0, { zoom: 1.2, foco: [540, 960] }], [0.38, { zoom: 1.04, foco: [540, 900] }], [1, { zoom: 1.1, foco: [540, 860] }]]}
          golpes={[0.4]} pulsos={[0.4]}>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <ellipse cx={540} cy={TZ.y + 1505 * TZ.s} rx={260} ry={30} fill={C.GRY} />
            <V.Polvo T={T} c={enTz([600, 760])} cuando={f(0.04)} n={10} fuerza={160} dura={0.9} />
            <V.Polvo T={T} c={enTz([600, 760])} cuando={f(0.16)} n={10} fuerza={160} dura={0.9} />
          </svg>
          <A.Pos x={TZ.x} y={TZ.y} e={M.pop(T, at - 0.6, 0.5)} dy={M.life(T, 3.6, 4)}>
            <TOR.Tor s={TZ.s} pose={pose} ropa={SIXERS} boca={arriba > 0.5 ? 'sonrisa' : true} sinPiso parpadeo={V.parpadeo(T)} />
          </A.Pos>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <V.Polvo T={T} c={enTz([600, 200])} cuando={f(0.38)} n={60} fuerza={680} dura={1.6} />
            <V.Ondas T={T} c={enTz([600, 620])} r={330} v={rugido} />
            <V.Chispa T={T} c={enTz([600, 230])} cuando={f(0.4)} r={240} />
          </svg>
        </V.Camara>
        <V.Rot T={T} text="¡SIGUE EL REY!" y={300} s={1.5} cuando={f(0.42)} />
      </div>
    );
  }

  var TOR_L = function (o) { return Object.assign({ ropa: SIXERS, boca: 'sonrisa' }, o); };
  var GANCHO = { x: 72, y: 216, s: 0.78 };
  var manoG = [GANCHO.x + 900 * GANCHO.s, GANCHO.y + 1040 * GANCHO.s], pisoG = GANCHO.y + 1500 * GANCHO.s;
  var TIRO = { x: -40, y: 640, s: 0.55 };
  var desdeTiro = [TIRO.x + 605 * TIRO.s, TIRO.y + 200 * TIRO.s];
  var ARO = { x: 690, y: 380, s: 1.4 };
  var aroC = [ARO.x + 120 * ARO.s, ARO.y + 138 * ARO.s];

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: '¿Por qué LeBron James, con 41 años, sigue sin retirarse?',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.2, foco: [560, 760] }], [1, { zoom: 1.02, foco: [540, 900] }]],
        tor: TOR_L({ x: GANCHO.x, y: GANCHO.y, s: GANCHO.s, pose: poseDribla() }),
        piezas: [
          Object.assign({ C: N.ICONOS.basket, s: 0.74 }, pique(manoG, pisoG, 0.74, 0.5)),
          { C: B.Cuenta, s: 1, x: 120, y: 470, cuando: 0.14, p: cuenta(41, 0.15) }
        ],
        r1: { text: 'LEBRON JAMES', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Cuerpo', dur: 7, vo: 'Primero, su cuerpo: sueño, recuperación y buena comida. Se habla de más de un millón de dólares al año invertidos en eso.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 640] }], [0.55, { zoom: 1.0, foco: [540, 900] }], [1, { zoom: 1.06, foco: [540, 1000] }]],
        pulsos: [0.66],
        tor: TOR_L({ s: 0.55, x: 210, y: 560,
          flex: function (T, f) { return 0.1 + 0.9 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.62), end: f(0.74) })(T)); } }),
        piezas: [
          { C: N.ICONOS.luna, s: 0.9, x: 40, y: 380, cuando: 0.08 },
          { C: N.ICONOS.termometro, s: 0.9, x: 420, y: 330, cuando: 0.2 },
          { C: N.COMIDA.pollo, s: 0.62, plato: 0.62, x: 790, y: 360, cuando: 0.32, fase: 0.4 },
          { C: N.ICONOS.billete, s: 1.0, x: 30, y: 1040, cuando: 0.6 }
        ],
        lienzo: function (T, f) {
          return <V.Confeti T={T} desde={f(0.62)} n={24} v={1 - animate({ from: 0, to: 1, start: f(0.9), end: f(1) })(T)} />;
        },
        r1: { text: 'SUEÑO Y RECUPERACIÓN', cuando: 0.06 },
        r2: { text: '+1 MILLÓN AL AÑO', cuando: 0.6 }
      }) },

    { nombre: 'Récords', dur: 6.5, vo: 'Segundo, la historia: ya es el máximo anotador de la NBA, y va por su temporada 24. Nadie jugó tantas.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 700] }], [0.55, { zoom: 1.0, foco: [540, 900] }], [1, { zoom: 1.05, foco: [580, 980] }]],
        pulsos: [0.62],
        tor: TOR_L({ x: TIRO.x, y: TIRO.y, s: TIRO.s, pose: poseTiro() }),
        piezas: [
          { C: N.ICONOS.aro, s: ARO.s, x: ARO.x, y: ARO.y },
          { C: N.ICONOS.corona, s: 0.7, x: TIRO.x + 600 * TIRO.s - 84, y: TIRO.y + 326 * TIRO.s - 190, cuando: 0.2 },
          { C: B.Cuenta, s: 1.05, x: 690, y: 960, cuando: 0.58, p: cuenta(24, 0.58) }
        ],
        lienzo: function (T, f) {
          return <g>{tiros(T, f, desdeTiro, aroC, [0.04, 0.22, 0.4])}</g>;
        },
        r1: { text: 'MÁXIMO ANOTADOR', cuando: 0.08 },
        r2: { text: '24 TEMPORADAS', s: 1.2, cuando: 0.58 }
      }) },

    { nombre: 'Bronny', dur: 6, vo: 'Tercero, ama competir: ya cumplió el sueño de jugar con su hijo Bronny, y sigue disfrutando cada partido.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 760] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        tor: [
          { s: 0.58, x: -60, y: 560, boca: 'sonrisa', ropa: LAKERS('23'),
            flex: function (T, f) { return 0.2 + 0.8 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.6), end: f(0.72) })(T)); } },
          { s: 0.48, x: 480, y: 710, boca: 'sonrisa', ropa: LAKERS('9'), cuando: 0.22,
            flex: function (T, f) { return 0.2 + 0.8 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.64), end: f(0.76) })(T)); } }
        ],
        piezas: [
          { C: P.Corazon, s: 2, x: 430, y: 380, cuando: 0.3, p: function (T) { return { beat: 1 + 0.1 * Math.max(0, Math.sin(T * Math.PI * 2 / 0.75)) }; } }
        ],
        lienzo: function (T, f) {
          return <V.Confeti T={T} desde={f(0.62)} n={30} />;
        },
        r1: { text: 'JUGÓ CON SU HIJO', cuando: 0.2 },
        r2: { text: 'AMA COMPETIR', s: 1.2, cuando: 0.6 }
      }) },

    { nombre: 'Legado', dur: 6, vo: 'Y cuarto, su legado: cuatro anillos, una marca enorme, y en Filadelfia todavía quiere más.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 600] }], [0.5, { zoom: 1.0, foco: [540, 900] }], [1, { zoom: 1.05, foco: [540, 960] }]],
        pulsos: [0.66],
        tor: TOR_L({ s: 0.55, x: 210, y: 690,
          flex: function (T, f) { return 0.15 + 0.85 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.62), end: f(0.74) })(T)); },
          extra: function (g, T, f) { return <V.Chispa T={T} c={g.cabeza} cuando={f(0.66)} r={200} />; } }),
        piezas: [
          { C: N.ICONOS.anillo, s: 0.72, x: 30, y: 380, cuando: 0.08 },
          { C: N.ICONOS.anillo, s: 0.72, x: 290, y: 380, cuando: 0.14 },
          { C: N.ICONOS.anillo, s: 0.72, x: 550, y: 380, cuando: 0.2 },
          { C: N.ICONOS.anillo, s: 0.72, x: 810, y: 380, cuando: 0.26 },
          { C: N.ICONOS.billete, s: 0.8, x: 20, y: 840, cuando: 0.4 },
          { C: N.ICONOS.mundo, s: 0.8, x: 860, y: 840, cuando: 0.46 }
        ],
        r1: { text: '4 ANILLOS', s: 1.3, cuando: 0.06 },
        r2: { text: 'QUIERE MÁS', s: 1.2, cuando: 0.62 }
      }) },

    { nombre: 'Cierre', dur: 4.5, vo: 'Mientras su cuerpo responda, el Rey no piensa parar. ¿Tú qué opinas?',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.12, foco: [540, 760] }], [1, { zoom: 1.0, foco: [540, 960] }]],
        pulsos: [0.3],
        tor: TOR_L({ x: FIG.x, y: FIG.y + 120, s: 0.74,
          flex: function (T, f) { return 0.4 + 0.6 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.08), end: f(0.3) })(T)); } }),
        piezas: [
          { C: N.ICONOS.corona, s: 0.8, x: FIG.x + 600 * 0.74 - 96 + 18, y: FIG.y + 120 + 326 * 0.74 - 210, cuando: 0.2 }
        ],
        lienzo: function (T, f) {
          var c = [FIG.x + 600 * 0.74 + 18, FIG.y + 120 + 326 * 0.74 - 114];
          return <g><V.Brillo T={T} c={c} r={110} v={animate({ from: 0, to: 1, start: f(0.24), end: f(0.34) })(T)} /><V.Chispa T={T} c={c} cuando={f(0.3)} r={150} /></g>;
        },
        r1: { text: 'EL REY SIGUE', s: 1.3, cuando: 0.08 },
        r2: { text: 'MIENTRAS RINDA', s: 1.2, cuando: 0.5 }
      }) },

    { nombre: 'La tiza', dur: 3.5, vo: '¡Vamos! (la tiza al aire; el público ruge solo)', C: EscTiza }
  ];

  global.REELS.registrar({ id: 'lebron', titulo: 'LeBron no se retira (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
