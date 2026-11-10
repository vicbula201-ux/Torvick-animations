/* ============================================================
   CREATINA — reel con Tor, ESTILO 2 (~43 s con la accion y el cierre)
   "No tomes más creatina sin ver este video" (pedido del autor): beneficios,
   mitos, como tomarla y cada cuanto. Lo que dice la evidencia (posicion de la
   ISSN, Kreider 2017 y Antonio 2021):
   - es el suplemento mas estudiado; no es un esteroide: el cuerpo la fabrica
     y esta en la carne y el pescado;
   - recarga la energia rapida del musculo: mas fuerza, mas repeticiones y,
     con el entrenamiento, mas masa muscular;
   - mito: dana los rinones -> en personas sanas no se vio dano (con una
     enfermedad renal, primero el medico);
   - mito: se cae el pelo -> sale de un solo estudio de 2009 que ni midio el
     pelo; no se repitio;
   - mito: hincha -> sube algo de peso por agua DENTRO del musculo, no grasa;
   - como: 3 a 5 g de monohidrato al dia, a cualquier hora, todos los dias
     (tambien los de descanso), sin carga obligatoria y sin ciclos.
   Antes del cierre, la escena de accion (comenta, comparte, guarda).
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
  var FIG = PL.FIG;

  /* ---------------- Tor con la cucharita en la boca ---------------- */

  function poseCuchara() {
    var p = TOR.pose({ flex: 0 });
    var g = B.geoFrente({ pose: p });
    p.der.codo = U.suma(g.der.hombro, [96, 190]);
    p.der.mano = U.suma(g.cabeza, [150, 70]);
    return p;
  }
  // la cucharita: el mango en la mano y la copa en la boca
  function cucharaEn(c, ang, k, lleno) {
    return (
      <g transform={'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + k + ') translate(-224 -98)'}>
        <N.ICONOS.cuchara s={1} lleno={lleno} />
      </g>
    );
  }

  // la X que tacha el rotulo del mito (va encima de los rotulos)
  function tachaMito(cuando) {
    return function (T, f) { return <A.Mal T={T} cuando={f(cuando)} x={540 - 104} y={270 - 104} s={0.9} />; };
  }

  /* ---------------- el mito del pelo: pelos que caen y vuelven ---------------- */

  var CAB = { x: 300, y: 430, s: 2 };
  var PELOS = [[64, 112, -40], [84, 76, -25], [112, 58, 10], [142, 60, 30], [168, 78, -15], [186, 104, 35], [100, 92, 20], [150, 86, -30]];
  function pelos(T, f) {
    var vuelve = Easing.easeInOutCubic(clamp((T - f(0.5)) / (f(0.62) - f(0.5)), 0, 1));
    if (vuelve >= 1) return null;
    return (
      <g>
        {PELOS.map(function (q, i) {
          var u = Easing.easeInQuad(clamp((T - f(0.1 + i * 0.02)) / (f(0.4) - f(0.1)), 0, 1)) * (1 - vuelve);
          if (u <= 0.01) return null;
          var x = CAB.x + q[0] * CAB.s + q[2] * 2.4 * u + 14 * Math.sin(T * 5 + i) * u;
          var y = CAB.y + q[1] * CAB.s + 600 * u;
          return (
            <path key={i} d="M 0 -30 Q 14 -15 0 0 Q -14 15 0 30" fill="none" stroke={C.INK} strokeWidth={8} strokeLinecap="round"
              transform={'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (q[2] * 4 * u).toFixed(1) + ')'} />
          );
        })}
      </g>
    );
  }

  /* ---------------- como: la cucharita va del bote al vaso ---------------- */

  function servir(T, f) {
    var va = Easing.easeInOutCubic(clamp((T - f(0.12)) / (f(0.36) - f(0.12)), 0, 1));
    var a = [210, 520], b = [790, 650];
    var c = [U.lerp(a[0], b[0], va), U.lerp(a[1], b[1], va) - 220 * Math.sin(Math.PI * va)];
    var inclina = animate({ from: 0, to: 100, start: f(0.38), end: f(0.46), ease: Easing.easeOutBack })(T) *
      (1 - animate({ from: 0, to: 1, start: f(0.62), end: f(0.7) })(T));
    var lleno = 1 - clamp((T - f(0.44)) / (f(0.6) - f(0.44)), 0, 1);
    var e = M.pop(T, f(0.08), 0.4);
    var polvo = [];
    for (var i = 0; i < 12; i++) {
      var u = (T - f(0.44 + i * 0.013)) / 0.42;
      if (u <= 0 || u >= 1) continue;
      var x = b[0] + 40 + 16 * Math.sin(i * 2.3) + 10 * u * Math.cos(i);
      var y = b[1] + 40 + 260 * u * u;
      polvo.push(<circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={9 - 3 * u} fill={BLANCO} stroke={C.INK} strokeWidth={5} opacity={1 - u * 0.6} />);
    }
    return (
      <g opacity={e.opacity}>
        {polvo}
        <g transform={'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + inclina.toFixed(1) + ') scale(' + (1.15 * e.scale).toFixed(3) + ') translate(-96 -150)'}>
          <N.ICONOS.cuchara s={1} lleno={lleno} />
        </g>
      </g>
    );
  }

  /* ---------------- cada cuanto: la semana entera, con y sin entreno ---------------- */

  var DIAS = [];
  [[95, 4], [210, 3]].forEach(function (fila, r) {
    for (var k = 0; k < fila[1]; k++) DIAS.push([fila[0] + k * 230, 400 + r * 240]);
  });
  var DESCANSO = { 2: true, 4: true, 6: true };
  function semana(T, f) {
    return (
      <g>
        {DIAS.map(function (d, i) {
          // el primer dia ya esta en pantalla al empezar (regla del primer fotograma)
          var e = i === 0 ? M.pop(T, f(0) - 0.6, 0.5) : M.pop(T, f(0.03 + i * 0.03), 0.4);
          if (e.opacity < 0.02) return null;
          var marca = clamp((T - f(0.28 + i * 0.05)) / 0.25, 0, 1);
          var cx = d[0] + 100, cy = d[1] + 100;
          return (
            <g key={i} opacity={e.opacity} transform={'translate(' + cx + ' ' + (cy + M.life(T, 3, 5, i * 0.2)).toFixed(1) + ') scale(' + e.scale.toFixed(3) + ')'}>
              <rect x={-96} y={-96} width={192} height={192} rx={30} fill={marca > 0 ? C.YEL : BLANCO} stroke={C.INK} strokeWidth={13} />
              <g transform={DESCANSO[i] ? 'translate(-62 -62) scale(0.52)' : 'translate(-84 -32) scale(0.4)'}>
                {DESCANSO[i] ? <N.ICONOS.luna s={1} /> : <P.Pesa s={1} />}
              </g>
              {marca > 0 ? (
                <g transform={'translate(64 64) scale(' + Easing.easeOutBack(marca).toFixed(3) + ')'}>
                  <circle cx={0} cy={0} r={34} fill={C.GRN} stroke={C.INK} strokeWidth={9} />
                  <path d="M -15 1 L -3 13 L 16 -11" fill="none" stroke={BLANCO} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              ) : null}
            </g>
          );
        })}
      </g>
    );
  }

  /* ---------------- escenas ---------------- */

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.8, vo: 'No tomes más creatina sin ver este video.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.35, foco: [600, 560] }], [1, { zoom: 1.04, foco: [540, 860] }]],
        tor: { x: FIG.x, y: FIG.y + 50, boca: true, vibra: true, pose: poseCuchara(),
          extra: function (g, T, f) { return cucharaEn(g.der.mano, -8, 1.1, 1); } },
        piezas: [{ C: N.ICONOS.bote, s: 1.25, x: 30, y: 1080, cuando: 0.12 }],
        mal: [{ x: 90, y: 430, cuando: 0.22, s: 0.6 }, { x: 830, y: 1150, cuando: 0.46, s: 0.5 }],
        r1: { text: 'CREATINA', s: 1.3, cuando: 0.02 },
        r2: { text: '¡ESPERA!', s: 1.2, cuando: 0.5 }
      }) },

    { nombre: 'Qué es', dur: 5, vo: 'Es el suplemento más estudiado. No es un esteroide: está en la carne y el pescado.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.08, foco: [540, 660] }], [0.45, { zoom: 1.0, foco: [540, 900] }], [1, { zoom: 1.04, foco: [540, 960] }]],
        pulsos: [0.1],
        piezas: [
          { C: N.ICONOS.receta, s: 0.9, x: 40, y: 400, cuando: 0.08 },
          { C: N.ICONOS.receta, s: 0.9, x: 824, y: 400, cuando: 0.13 },
          { C: N.ICONOS.bote, s: 1.9, x: 312, y: 360 },
          { C: N.ICONOS.jeringa, s: 1.1, x: 40, y: 960, cuando: 0.36 },
          { C: N.COMIDA.carne, s: 0.8, plato: 0.6, x: 360, y: 990, cuando: 0.6 },
          { C: N.COMIDA.pescado, s: 0.8, plato: 0.6, x: 650, y: 990, cuando: 0.68 }
        ],
        lienzo: function (T, f) {
          return <V.Brillo T={T} c={[540, 600]} r={260} v={animate({ from: 0, to: 0.8, start: f(0.04), end: f(0.12) })(T) * (1 - animate({ from: 0, to: 1, start: f(0.3), end: f(0.4) })(T))} />;
        },
        mal: [{ x: 70, y: 990, cuando: 0.44, s: 0.85 }],
        bien: [{ x: 560, y: 1250, cuando: 0.76, s: 0.6 }],
        r1: { text: 'EL MÁS ESTUDIADO', s: 1.15, cuando: 0.02 },
        r2: { text: 'NO ES UN ESTEROIDE', y: 1490, cuando: 0.42 }
      }) },

    { nombre: 'Beneficios', dur: 4.5, vo: 'Te da más fuerza, más repeticiones y, con el entreno, más músculo.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.12, foco: [540, 700] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.36, 0.64, 0.92],
        tor: { s: 0.62, x: 168, y: 470, boca: 'sonrisa', musc: { bic: 1 },
          flex: function (T, f) { return 0.25 + 0.75 * V.ida(V.fase(T, f(0.08), f(0.98), 3), 0.4, 0.2); },
          extra: function (g, T, f) {
            var k = V.ida(V.fase(T, f(0.08), f(0.98), 3), 0.4, 0.2);
            return <g><V.Brillo T={T} c={g.izq.codo} r={80} v={k} /><V.Brillo T={T} c={g.der.codo} r={80} v={k} /></g>;
          } },
        piezas: [
          { C: N.ICONOS.bateria, s: 1.0, x: 20, y: 420, cuando: 0.06,
            p: function (T, f) { return { p: animate({ from: 0.18, to: 1, start: f(0.12), end: f(0.4), ease: Easing.easeInOutCubic })(T) }; } },
          { C: B.Cuenta, s: 0.95, x: 820, y: 430, cuando: 0.14,
            p: function (T, f) {
              var n = Math.round(animate({ from: 6, to: 10, start: f(0.2), end: f(0.85) })(T));
              return { n: n, p: n / 10 };
            } }
        ],
        lienzo: function (T, f) { return <V.Chispa T={T} c={[940, 550]} cuando={f(0.85)} r={140} />; },
        bien: [{ x: 830, y: 1120, cuando: 0.74, s: 0.62 }],
        r1: { text: 'MÁS FUERZA Y REPES', s: 1.1, cuando: 0.04 },
        r2: { text: 'MÁS MÚSCULO', s: 1.2, cuando: 0.58 }
      }) },

    { nombre: 'Mito: riñones', dur: 4.6, vo: 'Mito uno: daña los riñones. En personas sanas, los estudios no muestran daño.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 640] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.5],
        piezas: [
          { C: N.ICONOS.rinones, s: 2.2, x: 276, y: 420,
            vibra: false,
            p: function (T, f) { return { color: T < f(0.5) ? C.RED : BLANCO }; } },
          { C: TOR.Tor, s: 0.36, x: 30, y: 980, cuando: 0.56,
            p: function (T, f) { return { boca: 'sonrisa', sinPiso: true, parpadeo: 0, flex: animate({ from: 0, to: 1, start: f(0.6), end: f(0.72), ease: Easing.easeOutBack })(T), musc: { bic: 1 } }; } }
        ],
        lienzo: function (T, f) {
          return <V.Brillo T={T} c={[540, 680]} r={240} color={C.GRN} v={animate({ from: 0, to: 0.9, start: f(0.5), end: f(0.6) })(T)} />;
        },
        bien: [{ x: 790, y: 1060, cuando: 0.62, s: 0.75 }],
        encima: tachaMito(0.3),
        r1: { text: 'MITO: DAÑA LOS RIÑONES', s: 1.0, cuando: 0.02 },
        r2: { text: 'FALSO EN PERSONAS SANAS', y: 1490, cuando: 0.5 }
      }) },

    { nombre: 'Mito: pelo', dur: 4.2, vo: 'Mito dos: hace que se caiga el pelo. No hay pruebas de eso.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.08, foco: [540, 640] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        piezas: [
          { C: N.ICONOS.cabeza, s: CAB.s, x: CAB.x, y: CAB.y }
        ],
        lienzo: function (T, f) {
          return (
            <g>
              {pelos(T, f)}
              <V.Brillo T={T} c={[CAB.x + 240, CAB.y + 200]} r={230} color={C.GRN} v={animate({ from: 0, to: 0.9, start: f(0.56), end: f(0.66) })(T)} />
            </g>
          );
        },
        bien: [{ x: 790, y: 1060, cuando: 0.64, s: 0.75 }],
        encima: tachaMito(0.32),
        r1: { text: 'MITO: SE CAE EL PELO', s: 1.05, cuando: 0.02 },
        r2: { text: 'NO HAY PRUEBAS', s: 1.15, y: 1490, cuando: 0.5 }
      }) },

    { nombre: 'Mito: hincha', dur: 5, vo: 'Mito tres: te hincha. Sube un kilo de agua dentro del músculo, no es grasa.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 760] }], [0.5, { zoom: 1.12, foco: [540, 640] }], [1, { zoom: 1.04, foco: [540, 820] }]],
        tor: { balanza: true, boca: 'sonrisa', musc: { bic: 1 }, flex: 0.85,
          extra: function (g, T, f) {
            return (
              <g>
                {PL.alBiceps(g, animate({ from: 0, to: 1, start: f(0.38), end: f(0.74) })(T), 'gota')}
                <V.Brillo T={T} c={g.izq.codo} r={90} v={animate({ from: 0, to: 1, start: f(0.6), end: f(0.7) })(T)} />
                <V.Brillo T={T} c={g.der.codo} r={90} v={animate({ from: 0, to: 1, start: f(0.6), end: f(0.7) })(T)} />
              </g>
            );
          } },
        piezas: [
          { C: N.Dial, s: 0.8, x: 30, y: 1110, cuando: 0.4,
            p: function (T, f) { return { p: animate({ from: 0.42, to: 0.56, start: f(0.5), end: f(0.72), ease: Easing.easeOutBack })(T) }; } }
        ],
        bien: [{ x: 790, y: 1170, cuando: 0.76, s: 0.62 }],
        encima: tachaMito(0.3),
        r1: { text: 'MITO: TE HINCHA', s: 1.15, cuando: 0.02 },
        r2: { text: 'AGUA EN EL MÚSCULO', y: 1490, cuando: 0.5 }
      }) },

    { nombre: 'Cómo', dur: 5, vo: 'Toma de 3 a 5 gramos de monohidrato al día, a la hora que quieras.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [460, 760] }], [0.5, { zoom: 1.1, foco: [760, 820] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.46],
        piezas: [
          { C: N.ICONOS.bote, s: 1.4, x: 40, y: 560 },
          { C: N.ICONOS.vaso, s: 1.5, x: 640, y: 760, cuando: 0.06, p: { p: 0.6 } },
          { C: P.Reloj, s: 0.9, x: 60, y: 1080, cuando: 0.64, p: function (T) { return { T: T, speed: 3 }; } }
        ],
        lienzo: function (T, f) { return servir(T, f); },
        bien: [{ x: 320, y: 1120, cuando: 0.74, s: 0.62 }],
        r1: { text: '3 A 5 G DE MONOHIDRATO', s: 1.0, cuando: 0.04 },
        r2: { text: 'A CUALQUIER HORA', y: 1490, cuando: 0.62 }
      }) },

    { nombre: 'Cada cuánto', dur: 4.3, vo: 'Todos los días, también si no entrenas. Sin carga y sin ciclos.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.05, foco: [540, 640] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.62],
        tor: { s: 0.38, x: 312, y: 960, cuando: 0.5, boca: 'sonrisa', musc: { bic: 1 },
          flex: function (T, f) { return animate({ from: 0, to: 1, start: f(0.62), end: f(0.76), ease: Easing.easeOutBack })(T); } },
        lienzo: function (T, f) { return semana(T, f); },
        r1: { text: 'TODOS LOS DÍAS', s: 1.2, cuando: 0.02 },
        r2: { text: 'SIN CARGA NI CICLOS', y: 905, cuando: 0.6 }
      }) }
  ];

  global.REELS.registrar({
    id: 'creatina', titulo: 'Creatina: mitos y cómo tomarla (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿YA LA TOMAS?', vo: '¿Ya la tomas? Coméntalo, compártelo con un amigo y guárdalo.' }
  });
})(window);
