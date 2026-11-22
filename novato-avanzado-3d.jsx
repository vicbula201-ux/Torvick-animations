/* ============================================================
   NOVATO VS AVANZADO — TOR EN 3D (mismo guion que novato-avanzado.jsx)
   Los dos Tors en paralelo, en la misma escena 3D: a la izquierda el novato
   (camiseta gris, short blanco, el brote), a la derecha el avanzado
   (musculosa amarilla, short negro, la corona). X para el novato y visto
   para el avanzado en cada tema.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, PL = global.PL, V = global.V, E3 = global.E3, TOR3D = global.TOR3D;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var C = P.C;

  var ROPA_NOV = { camiseta: 'gris', short: 'blanco' };
  var ROPA_AVA = { camiseta: 'amarillo', mangas: false, short: 'negro' };
  var IZQ = 270, DER = 810;

  /* ---------------- poses (x = donde esta parado) ---------------- */
  function depie(x, extra) { return Object.assign({ cadera: [x, 1.0, 0], pieI: [x - 0.2, 0.115, 0.03], pieD: [x + 0.2, 0.115, 0.03] }, extra || {}); }
  function flex(x, k) {
    var p = E3.poseFlex(k);
    p.cadera = [x, 1.0, 0]; p.pieI = [x - 0.2, 0.115, 0.02]; p.pieD = [x + 0.2, 0.115, 0.02];
    p.manoI = [p.manoI[0] + x, p.manoI[1], p.manoI[2]]; p.manoD = [p.manoD[0] + x, p.manoD[1], p.manoD[2]];
    return p;
  }
  // rascandose la cabeza
  function duda(x) { return depie(x, { manoD: [x + 0.12, 2.0, 0.02], codoD: [1, -0.2, 0.3], cabeza: [0, 0, -10] }); }
  // curl: k 0 abajo .. 1 la mano frente al hombro; balanceo (el impulso del novato)
  function curl(x, k, ki, balanceo) {
    ki = ki == null ? k : ki;
    var b = balanceo || 0;
    return depie(x, { tronco: [-12 * b * k, 0, 0], hombros: { sube: 0.6 * b * k },
      manoI: E3.lerp3([x - 0.34, 0.83, 0.12], [x - 0.3, 1.42, 0.24], ki), manoD: E3.lerp3([x + 0.34, 0.83, 0.12], [x + 0.3, 1.42, 0.24], k),
      codoI: [0.2, -0.3, -1], codoD: [0.2, -0.3, -1] });
  }
  function barra(x) { return depie(x, { manoI: [x - 0.3, 1.35, 0.3], manoD: [x + 0.3, 1.35, 0.3], codoI: [0.6, -1, 0], codoD: [0.6, -1, 0] }); }

  // la barra sobrecargada que se dobla (en pantalla, centrada en c; k = escala)
  function barraDoblada(c, b, k) {
    var L = 490 * k;
    var y = function (x) { return c[1] + 60 * k * b * Math.pow(x / L, 2); };
    var disco = function (x, alto) { return <rect key={x} x={c[0] + x - 30 * k} y={y(x) - alto * k / 2} width={60 * k} height={alto * k} rx={14 * k} fill={C.GRY} stroke={C.INK} strokeWidth={13 * k} />; };
    return (
      <g>
        <path d={'M ' + (c[0] - L) + ' ' + y(-L).toFixed(1) + ' Q ' + c[0] + ' ' + (c[1] - 60 * k * b).toFixed(1) + ' ' + (c[0] + L) + ' ' + y(L).toFixed(1)} fill="none" stroke={C.INK} strokeWidth={28 * k} strokeLinecap="round" />
        {[-440, -380, -320, 320, 380, 440].map(function (x) { return disco(x * k, Math.abs(x) === 320 ? 240 : 280); })}
      </g>
    );
  }
  function Garabato() {
    var pts = [];
    for (var k = 0; k <= 40; k++) { var a = k * 0.62; pts.push((150 + Math.cos(a) * (60 + 26 * Math.sin(k * 1.7)) + k * 2).toFixed(1) + ' ' + (100 + Math.sin(a) * (44 + 14 * Math.cos(k * 1.3))).toFixed(1)); }
    return (
      <svg width={300 * 0.55} height={200 * 0.55} viewBox="0 0 300 200" style={{ display: 'block', overflow: 'visible' }}>
        <path d={'M ' + pts.join(' L ')} fill="none" stroke={C.INK} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  /* ---------------- el duelo ---------------- */
  // o = { nov(T, f) -> figura, ava(T, f) -> figura, objetos(T, f), piezas, lienzo, mal, bien, r1, r2, grande }
  function duelo(o) {
    var g = o.grande, X = g ? 0.66 : 0.77;
    var cam = g ? { dist: 8.6, y: 0.94 } : { dist: 10, y: 1.34 };
    return E3.escena({
      tomas: [[0, { az: 4, el: 3, dist: cam.dist * 0.94, y: cam.y + 0.05 }], [1, { az: -3, el: 3, dist: cam.dist, y: cam.y }]],
      vista: function (T, f) {
        var nov = Object.assign({ quien: 'tor', ropa: ROPA_NOV, pose: depie(-X), cara: { boca: 'sonrisa' } }, o.nov ? o.nov(T, f, -X) : {});
        var ava = Object.assign({ quien: 'tor', ropa: ROPA_AVA, pose: depie(X), cara: { boca: 'sonrisa' } }, o.ava ? o.ava(T, f, X) : {});
        return { figuras: [nov, ava], objetos: o.objetos ? o.objetos(T, f, X) : [], vibraNov: nov.vibra };
      },
      lienzo: function (T, f, t, pr, info) {
        var hn = pr('cabeza', 0), ha = pr('cabeza', 1);
        var eb = M.pop(T, f(0) - 0.6, 0.5);
        return (
          <g>
            {PL.versus(T, f, { yVs: g ? 1260 : 1150 })}
            <g opacity={eb.opacity} transform={'translate(' + (hn[0] - 220).toFixed(1) + ' ' + (hn[1] - 150 + M.life(T, 3, 5)).toFixed(1) + ') scale(' + (0.42 * eb.scale).toFixed(3) + ')'}><N.ICONOS.brote s={1} /></g>
            <g opacity={eb.opacity} transform={'translate(' + (ha[0] + 120).toFixed(1) + ' ' + (ha[1] - 150 + M.life(T, 3, 5, 0.5)).toFixed(1) + ') scale(' + (0.42 * eb.scale).toFixed(3) + ')'}><N.ICONOS.corona s={1} /></g>
            {o.lienzo ? o.lienzo(T, f, t, pr, info) : null}
          </g>
        );
      },
      piezas: o.piezas, mal: o.mal, bien: o.bien, r1: o.r1, r2: o.r2
    });
  }
  function escalaFig(pr, i) { return Math.abs(pr([0, 2.06, 0])[1] - pr([0, 0, 0])[1]) / 1500; }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3.2, vo: 'Novato contra avanzado. ¿Cuál de los dos eres tú?',
      C: duelo({
        grande: true,
        nov: function (T, f, x) { return { pose: duda(x), cara: { boca: 'triste', cejas: 'triste' } }; },
        ava: function (T, f, x) {
          var k = 0.2 + 0.8 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.06), end: f(0.3) })(T));
          return { pose: flex(x, k), musc: { biceps: true, brillo: 0.3 } };
        },
        lienzo: function (T, f, t, pr) { return E3.brilla(T, function (q) { return pr(q, 1); }, ['m:biceps:0', 'm:biceps:1'], 1, false, 70); },
        r1: { text: '*NOVATO*', x: 60, y: 420, s: 1.05, cuando: 0.04, tono: 'gris' },
        r2: { text: '*AVANZADO*', x: 560, y: 420, s: 1.05, cuando: 0.16 }
      }) },

    { nombre: 'Planificación', dur: 3.6, vo: 'El novato improvisa cada día; el avanzado sigue un plan.',
      C: duelo({
        nov: function (T, f, x) { return { pose: duda(x), cara: { boca: 'triste' } }; },
        piezas: [
          { C: P.Nube, s: 0.6, x: IZQ - 186, y: 400, cuando: 0.08, p: { children: <Garabato /> } },
          { C: N.ICONOS.calendario, s: 1.45, x: DER - 174, y: 390, cuando: 0.16 }
        ],
        mal: [{ x: 360, y: 640, cuando: 0.3, s: 0.5 }],
        bien: [{ x: 900, y: 640, cuando: 0.5, s: 0.55 }],
        r1: { text: '*PLANIFICACIÓN*', s: 1.1, cuando: 0.02 }
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
        r1: { text: '*COMIDA*', s: 1.2, cuando: 0.02 }
      }) },

    { nombre: 'Calorías', dur: 3.6, vo: 'El novato no sabe cuánto come; el avanzado cuenta sus calorías.',
      C: duelo({
        nov: function () { return { cara: { boca: 'triste' } }; },
        piezas: [
          { C: N.Dial, s: 1.05, x: IZQ - 158, y: 420, cuando: 0.06, vibra: true, p: function (T) { return { p: 0.5 + 0.42 * Math.sin(T * 6.3) * Math.cos(T * 2.1) }; } },
          { C: N.Dial, s: 1.05, x: DER - 158, y: 420, cuando: 0.14, p: function (T, f) { return { p: animate({ from: 0.1, to: 0.55, start: f(0.2), end: f(0.45), ease: Easing.easeOutBack })(T), zona: [-0.1, 0.42] }; } }
        ],
        mal: [{ x: 380, y: 640, cuando: 0.3, s: 0.5 }],
        bien: [{ x: 910, y: 640, cuando: 0.5, s: 0.55 }],
        r1: { text: '*CALORÍAS*', s: 1.2, cuando: 0.02 }
      }) },

    { nombre: 'Descanso', dur: 3.6, vo: 'Duerme cinco horas contra ocho: el músculo crece al descansar.',
      C: duelo({
        nov: function () { return { cara: { boca: 'triste', ojos: 'rojos' } }; },
        lienzo: function (T, f, t, pr) { return <V.Gotas T={T} c={pr('cabeza', 0)} v={1} />; },
        piezas: [
          { C: B.Cuenta, s: 1.0, x: IZQ - 250, y: 420, cuando: 0.06, p: { n: 5, p: 5 / 8 } },
          { C: N.ICONOS.bateria, s: 0.85, x: IZQ + 10, y: 420, cuando: 0.12, p: function (T, f) { return { p: animate({ from: 0.6, to: 0.15, start: f(0.2), end: f(0.5) })(T) }; } },
          { C: B.Cuenta, s: 1.0, x: DER - 250, y: 420, cuando: 0.18, p: { n: 8, p: 1 } },
          { C: N.ICONOS.bateria, s: 0.85, x: DER + 10, y: 420, cuando: 0.24, p: function (T, f) { return { p: animate({ from: 0.4, to: 1, start: f(0.3), end: f(0.6) })(T) }; } }
        ],
        mal: [{ x: 360, y: 660, cuando: 0.34, s: 0.5 }],
        bien: [{ x: 900, y: 660, cuando: 0.56, s: 0.55 }],
        r1: { text: '*DESCANSO*', s: 1.2, cuando: 0.02 },
        r2: { text: '5 HORAS VS *8 HORAS*', cuando: 0.4 }
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
        r1: { text: '*SUPLEMENTOS*', s: 1.15, cuando: 0.02 },
        r2: { text: 'CREATINA Y *PROTEÍNA*', cuando: 0.5 }
      }) },

    { nombre: 'Evidencia', dur: 4, vo: 'Uno cree los mitos de internet; el otro lee la evidencia científica.',
      C: duelo({
        nov: function () { return { cara: { boca: 'abierta', ojos: 'grandes' } }; },
        piezas: [
          { C: P.Parlante, s: 1.2, x: IZQ - 132, y: 400, cuando: 0.06, p: function (T) { return { wob: 8 * Math.sin(T * 9) }; } },
          { C: N.ICONOS.receta, s: 1.05, x: DER - 230, y: 400, cuando: 0.14 },
          { C: N.ICONOS.barras, s: 0.9, x: DER + 10, y: 440, cuando: 0.2, p: function (T, f) { return { p: animate({ from: 0, to: 1, start: f(0.24), end: f(0.5) })(T) }; } }
        ],
        mal: [{ x: 370, y: 640, cuando: 0.3, s: 0.5 }],
        bien: [{ x: 900, y: 660, cuando: 0.52, s: 0.55 }],
        r1: { text: 'EVIDENCIA *CIENTÍFICA*', s: 1.0, cuando: 0.02 }
      }) },

    { nombre: 'Biomecánica', dur: 3.8, vo: 'El avanzado entiende la técnica y sabe qué músculo trabaja.',
      C: duelo({
        grande: true,
        nov: function (T, f, x) { var k = V.ida(V.fase(T, f(0.05), f(0.95), 3), 0.25, 0.05); return { pose: curl(x, k, 0.9 * k, 1), pesas: 'neutro', musc: { trapecio: 'rojo' }, cara: { boca: 'dientes', cejas: 'enojo' } }; },
        ava: function (T, f, x) { var k = V.ida(V.fase(T, f(0.05), f(0.95), 2), 0.4, 0.15); return { pose: curl(x, k), pesas: 'neutro', musc: { biceps: true, brillo: 0.35 * k } }; },
        mal: [{ x: 380, y: 560, cuando: 0.3, s: 0.5 }],
        bien: [{ x: 910, y: 560, cuando: 0.5, s: 0.55 }],
        r1: { text: '*BIOMECÁNICA*', s: 1.15, cuando: 0.02 },
        r2: { text: 'TÉCNICA VS *IMPULSO*', cuando: 0.42 }
      }) },

    { nombre: 'Peso', dur: 3.8, vo: 'Y entrena con el peso adecuado: sin ego y sin miedo.',
      C: duelo({
        grande: true,
        nov: function (T, f, x) { return { pose: barra(x), cara: { boca: 'dientes', cejas: 'triste' }, musc: { trapecio: 'rojo' } }; },
        ava: function (T, f, x) { return { pose: curl(x, V.ida(V.fase(T, f(0.05), f(0.95), 2), 0.4, 0.15)), pesas: 'neutro', musc: { biceps: true } }; },
        lienzo: function (T, f, t, pr) {
          var a = pr('manoI', 0), b = pr('manoD', 0), k = escalaFig(pr) * 0.98;
          return <g>{barraDoblada([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], 0.6 + 0.4 * Math.sin(T * 9), k)}<V.Gotas T={T} c={pr('cabeza', 0)} v={1} /></g>;
        },
        mal: [{ x: 380, y: 560, cuando: 0.28, s: 0.5 }],
        bien: [{ x: 910, y: 560, cuando: 0.5, s: 0.55 }],
        r1: { text: 'PESO *ADECUADO*', s: 1.1, cuando: 0.02 },
        r2: { text: 'SIN EGO, *SIN MIEDO*', cuando: 0.42 }
      }) }
  ];

  global.REELS.registrar({
    id: 'novato-avanzado-3d', titulo: 'Novato vs avanzado (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿CUÁL ERES TÚ?', vo: '¿Cuál eres tú? Coméntalo, compártelo con un amigo y guárdalo.' }
  });
})(window);
