/* ============================================================
   NOVATO VS AVANZADO — reel con Tor, ESTILO 2 (~41 s con la accion y el cierre)
   Pedido del autor: las dos personas SIEMPRE en paralelo (pantalla dividida),
   comparando planificacion, comida, calorias, descanso, suplementos, leer
   evidencia, biomecanica y entrenar con el peso adecuado.
   A la izquierda el novato (camiseta gris, el brote), a la derecha el
   avanzado (musculosa amarilla, la corona). Al novato le toca la X y al
   avanzado el visto en cada tema.
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

  var ROPA_NOV = { camiseta: C.GRY, cuello: C.INK, short: BLANCO };
  var ROPA_AVA = { camiseta: C.YEL, cuello: C.INK, mangas: false, short: C.INK };
  var IZQ = 270, DER = 810;        // centro de cada mitad

  function valor(v, T, f) { return typeof v === 'function' ? v(T, f) : v; }

  /* ---------------- poses ---------------- */

  // rascandose la cabeza (no sabe que hacer)
  function poseDuda() {
    var p = TOR.pose({ flex: 0 });
    p.der.codo = [890, 500]; p.der.mano = [706, 320];
    return p;
  }
  // curl de frente: k 0 brazo abajo, 1 la mano arriba frente al hombro
  function poseCurl(k, ki) {
    var p = TOR.pose({ flex: 0 });
    ki = ki == null ? k : ki;
    p.izq.codo = [404, 900]; p.izq.mano = [U.lerp(400, 430, ki), U.lerp(1150, 700, ki)];
    p.der.codo = [796, 900]; p.der.mano = [U.lerp(800, 770, k), U.lerp(1150, 700, k)];
    return p;
  }
  // sosteniendo una barra frente al pecho
  function poseBarra() {
    var p = TOR.pose({ flex: 0 });
    p.izq.codo = [380, 910]; p.izq.mano = [440, 770];
    p.der.codo = [820, 910]; p.der.mano = [760, 770];
    return p;
  }

  /* ---------------- piezas sueltas ---------------- */

  function Garabato(props) {
    var pts = [];
    for (var k = 0; k <= 40; k++) {
      var a = k * 0.62;
      pts.push((150 + Math.cos(a) * (60 + 26 * Math.sin(k * 1.7)) + k * 2).toFixed(1) + ' ' + (100 + Math.sin(a) * (44 + 14 * Math.cos(k * 1.3))).toFixed(1));
    }
    return (
      <svg width={300 * 0.55} height={200 * 0.55} viewBox="0 0 300 200" style={{ display: 'block', overflow: 'visible' }}>
        <path d={'M ' + pts.join(' L ')} fill="none" stroke={C.INK} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // la barra sobrecargada que se dobla (en coordenadas de Tor, centrada en c)
  function barraDoblada(c, b) {
    var L = 490;
    var y = function (x) { return c[1] + 60 * b * Math.pow(x / L, 2); };
    var disco = function (x, alto) {
      return <rect key={x} x={c[0] + x - 30} y={y(x) - alto / 2} width={60} height={alto} rx={14} fill={C.GRY} stroke={C.INK} strokeWidth={13} />;
    };
    return (
      <g>
        <path d={'M ' + (c[0] - L) + ' ' + y(-L).toFixed(1) + ' Q ' + c[0] + ' ' + (c[1] - 60 * b).toFixed(1) + ' ' + (c[0] + L) + ' ' + y(L).toFixed(1)}
          fill="none" stroke={C.INK} strokeWidth={28} strokeLinecap="round" />
        {[-440, -380, -320, 320, 380, 440].map(function (x) { return disco(x, Math.abs(x) === 320 ? 240 : 280); })}
      </g>
    );
  }
  function mancuernas(g) {
    return (
      <g>
        <B.MancuernaG c={g.izq.mano} ang={0} giro={0} k={0.7} />
        <B.MancuernaG c={g.der.mano} ang={0} giro={0} k={0.7} />
      </g>
    );
  }

  /* ---------------- el duelo: la plantilla de cada escena ---------------- */

  // o = { nov, ava (opciones de Tor que pisan las de base), piezas, lienzo, mal,
  //       bien, r1, r2, tomas, pulsos, grande (Tors mas grandes, sin piezas arriba) }
  function duelo(o) {
    var g = o.grande;
    var base = g ? { s: 0.5, y: 600 } : { s: 0.44, y: 780 };
    var nov = Object.assign({ x: IZQ - 600 * base.s, y: base.y, s: base.s, ropa: ROPA_NOV, boca: true }, o.nov || {});
    var ava = Object.assign({ x: DER - 600 * base.s, y: base.y, s: base.s, ropa: ROPA_AVA, boca: 'sonrisa' }, o.ava || {});
    var cabeza = function (to) { return [to.x + 600 * to.s, to.y + 410 * to.s]; };
    return PL.escena2({
      tomas: o.tomas || [[0, { zoom: 1.05, foco: [540, 900] }], [1, { zoom: 1.0, foco: [540, 940] }]],
      pulsos: o.pulsos,
      tor: [nov, ava],
      piezas: o.piezas,
      lienzo: function (T, f) {
        var hn = cabeza(nov), ha = cabeza(ava);
        var eb = M.pop(T, f(0) - 0.6, 0.5);
        return (
          <g>
            {PL.versus(T, f, { yVs: g ? 1260 : 1150 })}
            <g opacity={eb.opacity} transform={'translate(' + (hn[0] - 250).toFixed(1) + ' ' + (hn[1] - 150 + M.life(T, 3, 5)).toFixed(1) + ') scale(' + (0.42 * eb.scale).toFixed(3) + ')'}>
              <N.ICONOS.brote s={1} />
            </g>
            <g opacity={eb.opacity} transform={'translate(' + (ha[0] + 150).toFixed(1) + ' ' + (ha[1] - 150 + M.life(T, 3, 5, 0.5)).toFixed(1) + ') scale(' + (0.42 * eb.scale).toFixed(3) + ')'}>
              <N.ICONOS.corona s={1} />
            </g>
            {o.lienzo ? o.lienzo(T, f) : null}
          </g>
        );
      },
      mal: o.mal, bien: o.bien, r1: o.r1, r2: o.r2
    });
  }

  /* ---------------- escenas ---------------- */

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3.2, vo: 'Novato contra avanzado. ¿Cuál de los dos eres tú?',
      C: duelo({
        grande: true,
        tomas: [[0, { zoom: 1.2, foco: [540, 1000] }], [1, { zoom: 1.0, foco: [540, 960] }]],
        pulsos: [0.3],
        nov: { boca: 'triste', pose: poseDuda() },
        ava: { musc: { bic: 1 },
          flex: function (T, f) { return 0.2 + 0.8 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.06), end: f(0.3) })(T)); },
          extra: function (g, T) { return <g><V.Brillo T={T} c={g.izq.codo} r={90} v={1} /><V.Brillo T={T} c={g.der.codo} r={90} v={1} /></g>; } },
        r1: { text: 'NOVATO', x: 60, y: 420, s: 1.15, cuando: 0.04 },
        r2: { text: 'AVANZADO', x: 560, y: 420, s: 1.15, cuando: 0.16 }
      }) },

    { nombre: 'Planificación', dur: 3.6, vo: 'El novato improvisa cada día; el avanzado sigue un plan.',
      C: duelo({
        nov: { pose: poseDuda(), boca: 'triste' },
        piezas: [
          { C: P.Nube, s: 0.6, x: IZQ - 186, y: 400, cuando: 0.08, p: { children: <Garabato /> } },
          { C: N.ICONOS.calendario, s: 1.45, x: DER - 174, y: 390, cuando: 0.16 }
        ],
        mal: [{ x: 360, y: 640, cuando: 0.3, s: 0.5 }],
        bien: [{ x: 900, y: 640, cuando: 0.5, s: 0.55 }],
        r1: { text: 'PLANIFICACIÓN', s: 1.2, cuando: 0.02 }
      }) },

    { nombre: 'Comida', dur: 3.6, vo: 'Uno come lo que haya; el otro come con propósito.',
      C: duelo({
        piezas: [
          { C: N.COMIDA.hamburguesa, s: 0.95, plato: 0.95, x: IZQ - 200, y: 380, cuando: 0.08 },
          { C: N.COMIDA.fritas, s: 0.6, x: IZQ + 40, y: 560, cuando: 0.14 },
          { C: N.COMIDA.pollo, s: 0.7, plato: 0.95, x: DER - 200, y: 380, cuando: 0.16, fase: 0.3 },
          { C: N.COMIDA.arroz, s: 0.5, x: DER - 150, y: 560, cuando: 0.22, fase: 0.3 },
          { C: N.COMIDA.brocoli, s: 0.5, x: DER + 20, y: 560, cuando: 0.28, fase: 0.3 }
        ],
        mal: [{ x: 380, y: 400, cuando: 0.32, s: 0.5 }],
        bien: [{ x: 910, y: 400, cuando: 0.52, s: 0.55 }],
        r1: { text: 'COMIDA', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Calorías', dur: 3.6, vo: 'El novato no sabe cuánto come; el avanzado cuenta sus calorías.',
      C: duelo({
        nov: { boca: 'triste' },
        piezas: [
          { C: N.Dial, s: 1.05, x: IZQ - 158, y: 420, cuando: 0.06, vibra: true,
            p: function (T) { return { p: 0.5 + 0.42 * Math.sin(T * 6.3) * Math.cos(T * 2.1) }; } },
          { C: N.Dial, s: 1.05, x: DER - 158, y: 420, cuando: 0.14,
            p: function (T, f) { return { p: animate({ from: 0.1, to: 0.55, start: f(0.2), end: f(0.45), ease: Easing.easeOutBack })(T), zona: [-0.1, 0.42] }; } }
        ],
        mal: [{ x: 380, y: 640, cuando: 0.3, s: 0.5 }],
        bien: [{ x: 910, y: 640, cuando: 0.5, s: 0.55 }],
        r1: { text: 'CALORÍAS', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Descanso', dur: 3.6, vo: 'Duerme cinco horas contra ocho: el músculo crece al descansar.',
      C: duelo({
        nov: { boca: 'triste', extra: function (g, T, f) { return <V.Gotas T={T} c={g.cabeza} v={1} />; } },
        piezas: [
          { C: B.Cuenta, s: 1.0, x: IZQ - 250, y: 420, cuando: 0.06, p: { n: 5, p: 5 / 8 } },
          { C: N.ICONOS.bateria, s: 0.85, x: IZQ + 10, y: 420, cuando: 0.12, p: function (T, f) { return { p: animate({ from: 0.6, to: 0.15, start: f(0.2), end: f(0.5) })(T) }; } },
          { C: B.Cuenta, s: 1.0, x: DER - 250, y: 420, cuando: 0.18, p: { n: 8, p: 1 } },
          { C: N.ICONOS.bateria, s: 0.85, x: DER + 10, y: 420, cuando: 0.24, p: function (T, f) { return { p: animate({ from: 0.4, to: 1, start: f(0.3), end: f(0.6) })(T) }; } }
        ],
        mal: [{ x: 360, y: 660, cuando: 0.34, s: 0.5 }],
        bien: [{ x: 900, y: 660, cuando: 0.56, s: 0.55 }],
        r1: { text: 'DESCANSO', s: 1.3, cuando: 0.02 },
        r2: { text: '5 HORAS VS 8 HORAS', cuando: 0.4 }
      }) },

    { nombre: 'Suplementos', dur: 3.6, vo: 'El novato compra de todo; el avanzado, solo lo que funciona.',
      C: duelo({
        piezas: [
          { C: N.ICONOS.bote, s: 0.7, x: 20, y: 380, cuando: 0.04, p: { color: C.RED } },
          { C: N.ICONOS.bote, s: 0.7, x: 180, y: 360, cuando: 0.08, p: { color: C.GRN } },
          { C: N.ICONOS.bote, s: 0.7, x: 340, y: 390, cuando: 0.12, p: { color: C.GRY } },
          { C: N.ICONOS.capsula, s: 0.55, x: 40, y: 560, cuando: 0.16, p: { color: C.YEL } },
          { C: N.ICONOS.vial, s: 0.6, x: 180, y: 560, cuando: 0.2, p: { color: C.RED } },
          { C: N.ICONOS.capsula, s: 0.55, x: 330, y: 570, cuando: 0.24, p: { color: C.GRN } },
          { C: N.ICONOS.bote, s: 0.95, x: DER - 250, y: 400, cuando: 0.3 },
          { C: N.ICONOS.bote, s: 0.95, x: DER + 20, y: 400, cuando: 0.36, p: { color: C.GRY } }
        ],
        mal: [{ x: 380, y: 700, cuando: 0.32, s: 0.5 }],
        bien: [{ x: 900, y: 660, cuando: 0.56, s: 0.55 }],
        r1: { text: 'SUPLEMENTOS', s: 1.25, cuando: 0.02 },
        r2: { text: 'CREATINA Y PROTEÍNA', cuando: 0.5 }
      }) },

    { nombre: 'Evidencia', dur: 4, vo: 'Uno cree los mitos de internet; el otro lee la evidencia científica.',
      C: duelo({
        nov: { boca: true },
        piezas: [
          { C: P.Parlante, s: 1.2, x: IZQ - 132, y: 400, cuando: 0.06, p: function (T) { return { wob: 8 * Math.sin(T * 9) }; } },
          { C: N.ICONOS.receta, s: 1.05, x: DER - 230, y: 400, cuando: 0.14 },
          { C: N.ICONOS.barras, s: 0.9, x: DER + 10, y: 440, cuando: 0.2,
            p: function (T, f) { return { p: animate({ from: 0, to: 1, start: f(0.24), end: f(0.5) })(T) }; } }
        ],
        mal: [{ x: 370, y: 640, cuando: 0.3, s: 0.5 }],
        bien: [{ x: 900, y: 660, cuando: 0.52, s: 0.55 }],
        r1: { text: 'EVIDENCIA CIENTÍFICA', s: 1.05, cuando: 0.02 }
      }) },

    { nombre: 'Biomecánica', dur: 3.8, vo: 'El avanzado entiende la técnica y sabe qué músculo trabaja.',
      C: duelo({
        grande: true,
        nov: { boca: 'triste', vibra: true, muscRojo: { trap: 1 },
          pose: function (T, f) { var k = V.ida(V.fase(T, f(0.05), f(0.95), 3), 0.25, 0.05); return poseCurl(k, 0.9 * k); },
          extra: function (g) { return mancuernas(g); } },
        ava: { musc: { bic: 1 },
          pose: function (T, f) { var k = V.ida(V.fase(T, f(0.05), f(0.95), 2), 0.4, 0.15); return poseCurl(k); },
          extra: function (g, T, f) {
            var k = V.ida(V.fase(T, f(0.05), f(0.95), 2), 0.4, 0.15);
            return <g>{mancuernas(g)}<V.Brillo T={T} c={U.lerpP(g.izq.hombro, g.izq.codo, 0.55)} r={70} v={k} /><V.Brillo T={T} c={U.lerpP(g.der.hombro, g.der.codo, 0.55)} r={70} v={k} /></g>;
          } },
        mal: [{ x: 380, y: 560, cuando: 0.3, s: 0.5 }],
        bien: [{ x: 910, y: 560, cuando: 0.5, s: 0.55 }],
        r1: { text: 'BIOMECÁNICA', s: 1.25, cuando: 0.02 },
        r2: { text: 'TÉCNICA VS IMPULSO', cuando: 0.42 }
      }) },

    { nombre: 'Peso', dur: 3.8, vo: 'Y entrena con el peso adecuado: sin ego y sin miedo.',
      C: duelo({
        grande: true,
        nov: { boca: 'triste', vibra: true, pose: poseBarra(),
          extra: function (g, T, f) {
            var b = 0.6 + 0.4 * Math.sin(T * 9);
            return <g>{barraDoblada(U.lerpP(g.izq.mano, g.der.mano, 0.5), b)}<V.Gotas T={T} c={g.cabeza} v={1} /></g>;
          } },
        ava: { musc: { bic: 1 },
          pose: function (T, f) { return poseCurl(V.ida(V.fase(T, f(0.05), f(0.95), 2), 0.4, 0.15)); },
          extra: function (g) { return mancuernas(g); } },
        mal: [{ x: 380, y: 560, cuando: 0.28, s: 0.5 }],
        bien: [{ x: 910, y: 560, cuando: 0.5, s: 0.55 }],
        r1: { text: 'PESO ADECUADO', s: 1.2, cuando: 0.02 },
        r2: { text: 'SIN EGO, SIN MIEDO', cuando: 0.42 }
      }) }
  ];

  global.REELS.registrar({
    id: 'novato-avanzado', titulo: 'Novato vs avanzado (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿CUÁL ERES TÚ?', vo: '¿Cuál eres tú? Coméntalo, compártelo con un amigo y guárdalo.' }
  });
})(window);
