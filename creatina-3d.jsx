/* ============================================================
   CREATINA — TOR EN 3D (mismo guion que creatina.jsx)
   Lo que dice la evidencia (ISSN, Kreider 2017 y Antonio 2021): es el
   suplemento mas estudiado y no es un esteroide (esta en la carne y el
   pescado); mas fuerza, mas repeticiones y, con el entreno, mas musculo;
   mito rinones: en personas sanas no se vio dano; mito pelo: sale de un solo
   estudio de 2009 que ni midio el pelo; mito hincha: agua dentro del musculo,
   no grasa; 3 a 5 g de monohidrato al dia, a cualquier hora, todos los dias,
   sin carga obligatoria y sin ciclos.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, V = global.V, E3 = global.E3;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var A = global.REELS.ayudas;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';

  function depie(extra) { return Object.assign({ cadera: [0, 1.0, 0], pieI: [-0.2, 0.115, 0.03], pieD: [0.2, 0.115, 0.03] }, extra || {}); }
  function flex(k) { return E3.poseFlex(k); }
  function tor(pose, extra, oculto) { return { figuras: [Object.assign({ quien: 'tor', pose: pose, oculto: !!oculto }, extra || {})] }; }
  function escala(pr) { return clamp(Math.abs(pr([0, 2.06, 0])[1] - pr([0, 0, 0])[1]) / 1500, 0.3, 1.6); }
  var GEN = { az: 12, el: 4, dist: 6.4, y: 1.1 };

  // la cucharita: el mango en la mano y la copa en la boca
  function cucharaEn(c, ang, k, lleno) {
    return (
      <g transform={'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + k.toFixed(3) + ') translate(-224 -98)'}>
        <N.ICONOS.cuchara s={1} lleno={lleno} />
      </g>
    );
  }
  // la X que tacha el rotulo del mito (va encima de los rotulos)
  function tachaMito(cuando) {
    return function (T, f) { return <A.Mal T={T} cuando={f(cuando)} x={540 - 104} y={270 - 104} s={0.9} />; };
  }
  // el mito del pelo: pelos que caen y vuelven
  var CAB = { x: 300, y: 400, s: 1.8 };
  var PELOS = [[64, 112, -40], [84, 76, -25], [112, 58, 10], [142, 60, 30], [168, 78, -15], [186, 104, 35], [100, 92, 20], [150, 86, -30]];
  function pelos(T, f) {
    var vuelve = Easing.easeInOutCubic(clamp((T - f(0.5)) / (f(0.62) - f(0.5)), 0, 1));
    if (vuelve >= 1) return null;
    return (
      <g>
        {PELOS.map(function (q, i) {
          var u = Easing.easeInQuad(clamp((T - f(0.1 + i * 0.02)) / (f(0.4) - f(0.1)), 0, 1)) * (1 - vuelve);
          if (u <= 0.01) return null;
          var x = CAB.x + q[0] * CAB.s + q[2] * 2.4 * u + 14 * Math.sin(T * 5 + i) * u, y = CAB.y + q[1] * CAB.s + 520 * u;
          return <path key={i} d="M 0 -30 Q 14 -15 0 0 Q -14 15 0 30" fill="none" stroke={C.INK} strokeWidth={8} strokeLinecap="round"
            transform={'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (q[2] * 4 * u).toFixed(1) + ')'} />;
        })}
      </g>
    );
  }
  // gotas de agua que entran al biceps (el mito de la hinchazon)
  function gotas(T, f, c, v) {
    var out = [];
    for (var i = 0; i < 5; i++) {
      var u = ((T - f(0.38)) * 0.9 + i / 5) % 1;
      if (T < f(0.38) || v < 0.02) continue;
      var x = c[0] + 14 * Math.sin(i * 2.1), y = c[1] - 260 * (1 - u);
      out.push(<path key={i} d={'M ' + x.toFixed(1) + ' ' + (y - 24).toFixed(1) + ' Q ' + (x + 16).toFixed(1) + ' ' + y.toFixed(1) + ' ' + x.toFixed(1) + ' ' + (y + 12).toFixed(1) + ' Q ' + (x - 16).toFixed(1) + ' ' + y.toFixed(1) + ' ' + x.toFixed(1) + ' ' + (y - 24).toFixed(1) + ' Z'}
        fill={BLANCO} stroke={C.INK} strokeWidth={7} opacity={(1 - u * u) * v} />);
    }
    return <g>{out}</g>;
  }
  // como: la cucharita va del bote al vaso
  function servir(T, f) {
    var va = Easing.easeInOutCubic(clamp((T - f(0.12)) / (f(0.36) - f(0.12)), 0, 1));
    var a = [210, 520], b = [790, 650];
    var c = [U.lerp(a[0], b[0], va), U.lerp(a[1], b[1], va) - 200 * Math.sin(Math.PI * va)];
    var inclina = animate({ from: 0, to: 100, start: f(0.38), end: f(0.46), ease: Easing.easeOutBack })(T) * (1 - animate({ from: 0, to: 1, start: f(0.62), end: f(0.7) })(T));
    var lleno = 1 - clamp((T - f(0.44)) / (f(0.6) - f(0.44)), 0, 1);
    var e = M.pop(T, f(0.08), 0.4), polvo = [];
    for (var i = 0; i < 12; i++) {
      var u = (T - f(0.44 + i * 0.013)) / 0.42;
      if (u <= 0 || u >= 1) continue;
      polvo.push(<circle key={i} cx={(b[0] + 40 + 16 * Math.sin(i * 2.3) + 10 * u * Math.cos(i)).toFixed(1)} cy={(b[1] + 40 + 260 * u * u).toFixed(1)} r={9 - 3 * u} fill={BLANCO} stroke={C.INK} strokeWidth={5} opacity={1 - u * 0.6} />);
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
  // cada cuanto: la semana entera, con y sin entreno
  var DIAS = [];
  [[95, 4], [210, 3]].forEach(function (fila, r) { for (var k = 0; k < fila[1]; k++) DIAS.push([fila[0] + k * 230, 400 + r * 240]); });
  var DESCANSO = { 2: true, 4: true, 6: true };
  function semana(T, f) {
    return (
      <g>
        {DIAS.map(function (d, i) {
          var e = i === 0 ? M.pop(T, f(0) - 0.6, 0.5) : M.pop(T, f(0.03 + i * 0.03), 0.4);
          if (e.opacity < 0.02) return null;
          var marca = clamp((T - f(0.28 + i * 0.05)) / 0.25, 0, 1);
          return (
            <g key={i} opacity={e.opacity} transform={'translate(' + (d[0] + 100) + ' ' + (d[1] + 100 + M.life(T, 3, 5, i * 0.2)).toFixed(1) + ') scale(' + e.scale.toFixed(3) + ')'}>
              <rect x={-96} y={-96} width={192} height={192} rx={30} fill={marca > 0 ? C.YEL : BLANCO} stroke={C.INK} strokeWidth={13} />
              <g transform={DESCANSO[i] ? 'translate(-62 -62) scale(0.52)' : 'translate(-84 -32) scale(0.4)'}>{DESCANSO[i] ? <N.ICONOS.luna s={1} /> : <P.Pesa s={1} />}</g>
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

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.8, vo: 'No tomes más creatina sin ver este video.',
      C: E3.escena({
        tomas: [[0, { az: 20, el: 6, dist: 3.6, y: 1.45 }], [1, { az: 12, el: 5, dist: 5.8, y: 1.15 }]],
        vista: function (T, f) {
          var r = tor(depie({ manoD: [0.1, 1.62, 0.3], codoD: [0.9, -1, 0], manoI: [-0.36, 0.85, 0.1] }), { cara: { ojos: 'grandes', boca: 'llena' } });
          r.vibra = true; return r;
        },
        lienzo: function (T, f, t, pr) { var sc = escala(pr); return cucharaEn(pr('manoD'), -10, 0.75 * sc, 1); },
        piezas: [{ C: N.ICONOS.bote, s: 1.1, x: 40, y: 1120, cuando: 0.12 }],
        mal: [{ x: 90, y: 430, cuando: 0.22, s: 0.6 }, { x: 840, y: 1150, cuando: 0.46, s: 0.5 }],
        r1: { text: '*CREATINA*', s: 1.3, cuando: 0.02, tono: 'rojo' },
        r2: { text: '¡ESPERA!', s: 1.2, cuando: 0.5 }
      }) },

    { nombre: 'Qué es', dur: 5, vo: 'Es el suplemento más estudiado del mundo. No es un esteroide: está en la carne y el pescado.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 20, el: 4, dist: 6.4, y: 1.1 }]],
        vista: function (T, f) { return tor(depie({ manoD: [0.45, 1.6, 0.3], codoD: [1, -1, 0] }), { cara: { boca: 'sonrisa' } }); },
        piezas: [
          { C: N.ICONOS.bote, s: 1.25, x: 690, y: 390 },
          { C: N.ICONOS.jeringa, s: 0.9, x: 740, y: 740, cuando: 0.36 },
          { C: N.COMIDA.carne, s: 0.62, plato: 0.5, x: 560, y: 1130, cuando: 0.6 },
          { C: N.COMIDA.pescado, s: 0.62, plato: 0.5, x: 800, y: 1130, cuando: 0.68 }
        ],
        lienzo: function (T, f) { return <V.Halo T={T} c={[840, 540]} r={170} v={animate({ from: 0, to: 0.8, start: f(0.04), end: f(0.12) })(T) * (1 - animate({ from: 0, to: 1, start: f(0.3), end: f(0.4) })(T))} />; },
        mal: [{ x: 760, y: 760, cuando: 0.44, s: 0.85 }],
        bien: [{ x: 880, y: 1000, cuando: 0.76, s: 0.6 }],
        r1: { text: 'EL MÁS *ESTUDIADO*', s: 1.15, cuando: 0.02 },
        r2: { text: 'NO ES UN *ESTEROIDE*', cuando: 0.42 }
      }) },

    { nombre: 'Beneficios', dur: 4.5, vo: 'Te da más fuerza, más repeticiones y, con el entrenamiento, tu músculo va a crecer.',
      C: E3.escena({
        tomas: [[0, { az: 18, el: 6, dist: 5.2, y: 1.25 }], [1, GEN]],
        vista: function (T, f) {
          var k = 0.25 + 0.75 * V.ida(V.fase(T, f(0.08), f(0.98), 3), 0.4, 0.2);
          var r = tor(flex(k), { musc: { biceps: true, pecho: T > f(0.58) ? true : null, brillo: 0.35 * k }, cara: { boca: 'sonrisa' } });
          r.k = k; return r;
        },
        lienzo: function (T, f, t, pr, info) { return E3.brilla(T, pr, ['m:biceps:0', 'm:biceps:1'], info.k, false, 70); },
        piezas: [
          { C: N.ICONOS.bateria, s: 0.85, x: 40, y: 420, cuando: 0.06,
            p: function (T, f) { return { p: animate({ from: 0.18, to: 1, start: f(0.12), end: f(0.4), ease: Easing.easeInOutCubic })(T) }; } },
          { C: B.Cuenta, s: 0.8, x: 840, y: 420, cuando: 0.14,
            p: function (T, f) { var n = Math.round(animate({ from: 6, to: 10, start: f(0.2), end: f(0.85) })(T)); return { n: n, p: n / 10 }; } }
        ],
        bien: [{ x: 850, y: 1120, cuando: 0.74, s: 0.62 }],
        r1: { text: 'MÁS FUERZA Y *REPES*', s: 1.1, cuando: 0.04 },
        r2: { text: 'MÁS *MÚSCULO*', s: 1.2, cuando: 0.58, tono: 'verde' }
      }) },

    { nombre: 'Mito: riñones', dur: 4.6, vo: 'La creatina no daña los riñones: en personas sanas, los estudios no muestran daño.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 4, el: 4, dist: 6.4, y: 1.1 }]],
        vista: function (T, f) {
          var k = Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.6), end: f(0.72) })(T));
          return tor(flex(k), { musc: { biceps: true }, cara: { boca: 'sonrisa' } }, T < f(0.54));
        },
        piezas: [{ C: N.ICONOS.rinones, s: 1.8, x: 324, y: 420, p: function (T, f) { return { color: T < f(0.5) ? C.RED : BLANCO }; } }],
        lienzo: function (T, f) { return <V.Halo T={T} c={[540, 636]} r={200} color={C.GRN} v={animate({ from: 0, to: 0.9, start: f(0.5), end: f(0.6) })(T)} />; },
        bien: [{ x: 860, y: 1060, cuando: 0.62, s: 0.75 }],
        encima: tachaMito(0.3),
        r1: { text: 'MITO: DAÑA LOS *RIÑONES*', s: 1.0, cuando: 0.02 },
        r2: { text: 'FALSO EN PERSONAS *SANAS*', s: 0.95, cuando: 0.5, tono: 'verde' }
      }) },

    { nombre: 'Mito: pelo', dur: 4.2, vo: 'La creatina no hace que se te caiga el pelo. No existen pruebas de eso.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 16, el: 4, dist: 6.4, y: 1.1 }]],
        vista: function (T, f) {
          var k = Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.6), end: f(0.72) })(T));
          return tor(flex(k), { musc: { biceps: true }, cara: { boca: 'sonrisa' } }, T < f(0.54));
        },
        piezas: [{ C: N.ICONOS.cabeza, s: CAB.s, x: CAB.x, y: CAB.y }],
        lienzo: function (T, f) { return <g>{pelos(T, f)}<V.Halo T={T} c={[CAB.x + 216, CAB.y + 180]} r={200} color={C.GRN} v={animate({ from: 0, to: 0.9, start: f(0.56), end: f(0.66) })(T)} /></g>; },
        bien: [{ x: 860, y: 1060, cuando: 0.64, s: 0.75 }],
        encima: tachaMito(0.32),
        r1: { text: 'MITO: SE CAE EL *PELO*', s: 1.05, cuando: 0.02 },
        r2: { text: 'NO HAY *PRUEBAS*', s: 1.15, cuando: 0.5, tono: 'verde' }
      }) },

    { nombre: 'Mito: hincha', dur: 5, vo: 'Es falso que te hincha. Puede subir un kilo de agua dentro del músculo, pero no es grasa.',
      C: E3.escena({
        tomas: [[0, GEN], [0.5, { az: 20, el: 6, dist: 4.6, y: 1.3 }], [1, GEN]],
        vista: function (T, f) {
          var v = animate({ from: 0, to: 1, start: f(0.6), end: f(0.7) })(T);
          return tor(flex(0.85), { musc: { biceps: true, brillo: 0.35 * v }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f, t, pr) {
          var v = animate({ from: 0, to: 1, start: f(0.36), end: f(0.44) })(T) * (1 - animate({ from: 0, to: 1, start: f(0.8), end: f(0.9) })(T));
          var bI = pr('m:biceps:0'), bD = pr('m:biceps:1'), h = animate({ from: 0, to: 1, start: f(0.6), end: f(0.7) })(T);
          return <g>{gotas(T, f, bI, v)}{gotas(T, f, bD, v)}<V.Halo T={T} c={bI} r={80} v={h} /><V.Halo T={T} c={bD} r={80} v={h} /></g>;
        },
        piezas: [{ C: N.Dial, s: 0.75, x: 40, y: 1180, cuando: 0.4, p: function (T, f) { return { p: animate({ from: 0.42, to: 0.56, start: f(0.5), end: f(0.72), ease: Easing.easeOutBack })(T) }; } }],
        bien: [{ x: 860, y: 1170, cuando: 0.76, s: 0.62 }],
        encima: tachaMito(0.3),
        r1: { text: 'MITO: TE *HINCHA*', s: 1.15, cuando: 0.02 },
        r2: { text: 'AGUA EN EL *MÚSCULO*', cuando: 0.5, tono: 'verde' }
      }) },

    { nombre: 'Cómo', dur: 5, vo: 'Toma de 3 a 5 gramos de monohidrato al día, según tu actividad física.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 20, el: 4, dist: 6.4, y: 1.1 }]],
        vista: function (T, f) {
          var bebe = animate({ from: 0, to: 1, start: f(0.66), end: f(0.8), ease: Easing.easeInOutCubic })(T);
          return tor(depie({ manoD: E3.lerp3([0.34, 0.85, 0.1], [0.12, 1.6, 0.32], bebe), codoD: [0.9, -1, 0] }), { cara: { boca: bebe > 0.6 ? 'o' : 'sonrisa' } });
        },
        piezas: [
          { C: N.ICONOS.bote, s: 1.1, x: 50, y: 520 },
          { C: N.ICONOS.vaso, s: 1.1, x: 700, y: 650, cuando: 0.06, p: { p: 0.6 } },
        ],
        lienzo: function (T, f) { return servir(T, f); },
        ocupa: [[180, 380, 900, 760]],
        bien: [{ x: 860, y: 1120, cuando: 0.74, s: 0.62 }],
        r1: { text: '3 A 5 G DE *MONOHIDRATO*', s: 1.0, cuando: 0.04 },
        r2: { text: 'SEGÚN TU *ACTIVIDAD*', cuando: 0.62 }
      }) },

    { nombre: 'Cada cuánto', dur: 4.3, vo: 'Asegúrate de tomarla todos los días, entrenes o no.',
      C: E3.escena({
        tomas: [[0, GEN], [1, { az: 4, el: 4, dist: 6.4, y: 1.1 }]],
        vista: function (T, f) {
          var k = Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.62), end: f(0.76) })(T));
          return tor(flex(k), { musc: { biceps: true }, cara: { boca: 'sonrisa' } });
        },
        lienzo: function (T, f) { return semana(T, f); },
        ocupa: [[95, 400, 1015, 880]],
        r1: { text: 'TODOS LOS *DÍAS*', s: 1.2, cuando: 0.02 },
        r2: { text: 'ENTRENES *O NO*', y: 905, cuando: 0.6 }
      }) }
  ];

  global.REELS.registrar({
    id: 'creatina-3d', titulo: 'Creatina: mitos y cómo tomarla (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿YA LA TOMABAS?', vo: '¿Ya tomabas creatina antes? Comenta tu experiencia, guarda este video y compártelo con un amigo.' }
  });
})(window);
