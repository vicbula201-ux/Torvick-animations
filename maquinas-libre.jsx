/* ============================================================
   ¿MAQUINAS O PESO LIBRE? — formato de concepto en un solo plano (PS)
   Tor pregunta, chasquea los dedos y le cae del cielo un segundo Tor (cuarta
   pared); uno hace sentadilla con barra libre y el otro en la Smith. Para
   crecer, lo mismo; la fuerza se gana en lo que entrenas; elige el que te deje
   progresar sin dolor.
   Evidencia: Haugen ME, Varvik FT, Larsen S, y col. Effect of free-weight vs.
   machine-based strength training on maximal strength, hypertrophy and jump
   performance: a systematic review and meta-analysis. BMC Sports Sci Med
   Rehabil. 2023;15:103. Hipertrofia parecida; la fuerza mejora mas en el
   modo en que se entrena (especificidad).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var V = global.V, E3 = global.E3, PS = global.PS, TOR3D = global.TOR3D, A = global.REELS.ayudas;
  var Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;

  var ZONA_TARJETA = [70, 660, 1010, 1330];
  var PA = [-0.62, 0.3], PB = [0.62, -0.55];   // Tor con barra libre (adelante) y Tor en la Smith (atras)

  // sentadilla: k 0 abajo .. 1 arriba (la barra apoyada en la espalda)
  function sentadilla(k, x, z) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var p = { cadera: E3.lerp3([x, 0.52, z - 0.26], [x, 0.99, z - 0.06], e), tronco: [30 - 22 * e, 0, 0], cabeza: [18 - 14 * e, 0, 0],
      pieI: [x - 0.24, 0.115, z + 0.12], pieD: [x + 0.24, 0.115, z + 0.12], rodillaI: [0.4, 0, 1], rodillaD: [0.4, 0, 1] };
    var J = TOR3D.esqueleto(p);
    var c = J.cuello.clone().sub(J.fr.clone().multiplyScalar(0.17)).sub(J.d.clone().multiplyScalar(0.06));
    [-1, 1].forEach(function (s) { p[s < 0 ? 'manoI' : 'manoD'] = [x + s * 0.48, c.y, c.z]; p[s < 0 ? 'codoI' : 'codoD'] = [0.4, -1, -0.6]; });
    p._barra = [c.x, c.y, c.z];
    return p;
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3.6, vo: '¿Máquinas o peso libre? ¿Con cuál creces más?' },
    { nombre: 'Debate', dur: 5.0, vo: 'Unos dicen que las máquinas son para principiantes. Otros, que el peso libre es peligroso.' },
    { nombre: 'Estudio', dur: 4.2, vo: 'Un análisis de 2023 comparó a quienes entrenaban con máquinas y con peso libre.' },
    { nombre: 'Resultado', dur: 2.6, vo: 'Para crecer, dieron lo mismo.' },
    { nombre: 'La fuerza', dur: 5.4, vo: 'Pero la fuerza se gana en lo que entrenas: si entrenas en máquina, eres más fuerte en la máquina.' },
    { nombre: 'El consejo', dur: 3.2, vo: 'Así que elige el que te deje progresar sin dolor.' },
    { nombre: 'Debate final', dur: 4.2, vo: '¿Equipo máquinas o equipo peso libre? Te leo en los comentarios.' }
  ];

  PS.video({
    id: 'maquinas-libre', titulo: '¿Máquinas o peso libre? (plano secuencia)',
    escenas: ESCENAS,
    claves: { maquinas: 'amarillo', maquina: 'amarillo', libre: 'verde', mismo: 'amarillo', fuerza: 'amarillo', dolor: 'rojo', peligroso: 'rojo' },
    camara: [
      [[0, 0], { az: 18, el: 4, dist: 3.9, y: 1.5, dx: PA[0], dz: PA[1] }],
      [[0, 0.95], { az: 8, el: 4, dist: 4.1, y: 1.46, dx: PA[0], dz: PA[1] }],
      [[1, 0.9], { az: 20, el: 8, dist: 6.0, y: 1.0, dx: -0.2, dz: 0 }],
      [[2, 0.5], { az: 26, el: 8, dist: 7.0, y: 1.05, dx: 0, dz: -0.1 }],
      [[3, 0.9], { az: 40, el: 10, dist: 7.0, y: 1.0, dx: 0, dz: -0.1 }],
      [[4, 0.9], { az: 12, el: 10, dist: 7.0, y: 1.05, dx: 0, dz: -0.1 }],
      [[5, 0.9], { az: -12, el: 8, dist: 6.6, y: 1.05, dx: 0, dz: -0.1 }],
      [[6, 1], { az: 4, el: 4, dist: 6.0, y: 1.1, dx: 0, dz: -0.1 }]
    ],
    libre: [[[0, 0], [0, 0.85]]],
    golpes: [[2, 0.3], [6, 0.72]],
    zona: function (T, b) {
      if (b.entre(T, [2, 0.36], [3, 0.0]) || b.entre(T, [3, 0.05], [4, 0.05]) || b.entre(T, [6, 0.25], [6, 1.01])) return ZONA_TARJETA;
      return T < b.f(2, 0.1) ? [70, 400, 1010, 1330] : [70, 330, 1010, 1330];
    },
    vista: function (T, b, cam, ex) {
      var abre = ex ? ex.abre : 0, figs = [], objetos = [];
      var cae = b.k(T, [2, 0.12], [2, 0.3]);                // el segundo Tor cae del cielo
      var reps = function (a, c, n) { var u = b.k(T, a, c) * n; return u >= n ? 1 : 1 - PS.rep(u); };
      // ---- Tor A (barra libre)
      var a = PS.depie(T, { x: PA[0], z: PA[1] }), caraA = PS.boca(abre), musA = null, miraA = 0.9, barraA = null;
      if (T < b.f(2, 0)) {
        var g1 = b.k(T, [1, 0.05], [1, 0.2]) * (1 - b.k(T, [1, 0.42], [1, 0.52])), g2 = b.k(T, [1, 0.52], [1, 0.66]) * (1 - b.k(T, [1, 0.9], [2, 0]));
        if (g1 > 0) { a.manoI = E3.lerp3(a.manoI, [PA[0] - 0.6, 1.3, PA[1] + 0.1], g1); a.codoI = [0.5, -0.4, -0.5]; }
        if (g2 > 0) { a.manoD = E3.lerp3(a.manoD, [PA[0] + 0.6, 1.3, PA[1] + 0.1], g2); a.codoD = [0.5, -0.4, -0.5]; }
        if (T < b.f(1, 0)) caraA.cejas = 'alzadas';
      } else if (T < b.f(2, 0.36)) {
        // chasquea los dedos y mira arriba
        var ch = b.k(T, [2, 0.0], [2, 0.12]);
        a.manoD = E3.lerp3(a.manoD, [PA[0] + 0.25, 1.55, PA[1] + 0.25], ch); a.codoD = [0.5, -0.6, -0.4];
        a.cabeza = [18 * cae, -20 * cae, 0]; miraA = 0;
      } else if (T < b.f(2, 0.42)) {
        // se prepara para recibir la barra
        var rc = b.k(T, [2, 0.36], [2, 0.42]);
        a = PS.depie(T, { x: PA[0], z: PA[1] });
        var sp = sentadilla(1, PA[0], PA[1]);
        a.manoI = E3.lerp3(a.manoI, sp.manoI, rc); a.manoD = E3.lerp3(a.manoD, sp.manoD, rc); a.codoI = sp.codoI; a.codoD = sp.codoD;
        a.cabeza = [10, 0, 0]; miraA = 0;
      } else {
        var kA = T < b.f(5, 0.1) ? reps([2, 0.44], [5, 0.0], 6) : 1;
        a = sentadilla(kA, PA[0], PA[1]); barraA = a._barra;
        musA = T >= b.f(3, 0) && T < b.f(5, 0) ? { cuadriceps: true, gluteos: true, brillo: 0.3 * (1 - kA) } : null;
        caraA = kA < 0.5 ? { boca: 'dientes' } : PS.boca(abre); miraA = 0.4;
        if (T >= b.f(6, 0)) { caraA = PS.boca(abre); caraA.cejas = 'alzadas'; miraA = 1; }   // se queda con la barra en la espalda, mirando a la camara
      }
      PS.mirarCamara(a, cam, miraA);
      figs.push({ quien: 'tor', pose: a, musc: musA, cara: caraA, ropa: { short: 'negro' } });
      // la barra: en el piso; con el chasquido vuela a la espalda de Tor A
      var piso = [PA[0] - 1.35, 0.225, PA[1] - 0.2], espalda = sentadilla(1, PA[0], PA[1])._barra;
      var vuela = b.k(T, [2, 0.28], [2, 0.42], Easing.easeInOutCubic);
      if (barraA) objetos.push({ tipo: 'barra', id: 'libre', c: barraA, eje: [1, 0, 0] });
      else if (vuela > 0 && T < b.f(6, 0)) {
        var pos = E3.lerp3(piso, espalda, vuela); pos[1] += 0.7 * Math.sin(Math.PI * vuela);
        var ej = E3.lerp3([0, 0, 1], [1, 0, 0], vuela);
        objetos.push({ tipo: 'barra', id: 'libre', c: pos, eje: ej });
      } else objetos.push({ tipo: 'barra', id: 'libre', c: piso, eje: [0, 0, 1] });
      // ---- Tor B (Smith): cae del cielo, aterriza y entrena en la maquina
      var barraB = 1.5;
      if (T >= b.f(2, 0.12)) {
        var bp, caraB = { boca: 'sonrisa' }, musB = null, miraB = 0.6;
        if (T < b.f(2, 0.5)) {
          bp = PS.depie(T, { x: PB[0], z: PB[1] });
          var hcae = 3.2 * (1 - Easing.easeInQuad(cae)), aplasta = b.k(T, [2, 0.3], [2, 0.36]) * (1 - b.k(T, [2, 0.36], [2, 0.5]));
          bp.cadera[1] += hcae - 0.18 * aplasta; bp.pieI[1] += hcae; bp.pieD[1] += hcae; bp.rodillaI = [0.3, 0, 1]; bp.rodillaD = [0.3, 0, 1];
          bp.manoI = [PB[0] - 0.55, 1.6 + hcae, PB[1]]; bp.manoD = [PB[0] + 0.55, 1.6 + hcae, PB[1]];
          caraB = cae < 1 ? { ojos: 'grandes', boca: 'o' } : { boca: 'sonrisa' };
        } else {
          var kB = T < b.f(5, 0.1) ? reps([2, 0.45], [5, 0.0], 6) : 1;
          bp = sentadilla(kB, PB[0], PB[1]); barraB = bp._barra[1];
          musB = T >= b.f(3, 0) && T < b.f(5, 0) ? { cuadriceps: true, gluteos: true, brillo: 0.3 * (1 - kB) } : null;
          caraB = kB < 0.5 ? { boca: 'dientes' } : { boca: 'sonrisa' };
          if (T >= b.f(6, 0)) {
            bp = PS.depie(T + 1.3, { x: PB[0], z: PB[1] }); barraB = 1.5;
            PS.senalar(bp, cam, b.k(T, [6, 0.5], [6, 0.68]) * (1 - b.k(T, [6, 0.84], [6, 0.98])), -1); miraB = 1; caraB.cejas = 'alzadas';
          }
        }
        PS.mirarCamara(bp, cam, miraB);
        figs.push({ quien: 'tor', pose: bp, musc: musB, cara: caraB, ropa: { short: 'amarillo' } });
      }
      objetos.push({ tipo: 'smith', p: [PB[0], 0, PB[1] - 0.24], barra: barraB });
      return { figuras: figs, objetos: objetos, encuadreExtra: [[PB[0] - 0.82, 2.35, PB[1] - 0.24, 0.05], [PB[0] + 0.82, 2.35, PB[1] - 0.24, 0.05]] };
    },
    lienzo: function (T, b, pr) {
      var r = [];
      if (b.entre(T, [2, 0.28], [2, 0.7])) r.push(<V.Polvo key="pv" T={T} c={pr([PB[0], 0.05, PB[1]])} cuando={b.f(2, 0.3)} n={24} fuerza={1.2} dura={1.1} />);
      if (b.entre(T, [3, 0.05], [4, 0])) [0, 1].forEach(function (i) {
        r.push(<g key={'br' + i}>{E3.brilla(T, function (q) { return pr(q, i); }, ['m:cuadriceps:0', 'm:cuadriceps:1'], b.k(T, [3, 0.05], [3, 0.3]), i === 0, 50)}</g>);
      });
      return <g>{r}</g>;
    },
    encima: function (T, b, pr) {
      var r = [];
      var tit = 1 - b.k(T, [1, 0.85], [2, 0.08]);
      if (tit > 0.01) r.push(<div key="tit" style={{ position: 'absolute', inset: 0, opacity: tit }}><E3.Rot T={T} text="¿MÁQUINAS O *PESO LIBRE*?" y={262} s={1.05} cuando={b.f(0, 0.04)} /></div>);
      r.push(<PS.Estudio key="es" T={T} cuando={b.f(2, 0.42)} hasta={b.f(3, 0.02)} autor="Haugen y col., 2023" detalle="Metaanálisis · máquinas vs. peso libre" />);
      r.push(<PS.Barras key="b1" T={T} cuando={b.f(3, 0.06)} hasta={b.f(4, 0.04)} titulo="MÚSCULO"
        items={[{ label: 'LIBRE', v: 0.8, color: 'verde', valor: '' }, { label: 'MÁQUINA', v: 0.8, color: 'amarillo', valor: '' }]} />);
      // la fuerza es especifica: una etiqueta sobre cada uno
      if (b.entre(T, [4, 0.1], [5, 0.1])) {
        [[0, 'MÁS FUERTE CON BARRA', 'verde'], [1, 'MÁS FUERTE EN MÁQUINA', 'amarillo']].forEach(function (q, i) {
          var c = pr('cabeza', q[0]), e = Easing.easeOutBack(clamp((T - b.f(4, 0.12 + 0.3 * i)) / 0.4, 0, 1));
          if (e <= 0) return;
          r.push(
            <svg key={'f' + i} width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <g transform={'translate(' + c[0].toFixed(1) + ' ' + (c[1] - 120 - 10 * Math.sin(T * 3 + i)).toFixed(1) + ') scale(' + e.toFixed(3) + ')'}>
                <rect x={-170} y={-40} width={340} height={64} rx={32} fill={q[2] === 'verde' ? C.GRN : C.YEL} stroke={C.INK} strokeWidth={6} />
                <text x={0} y={6} textAnchor="middle" dominantBaseline="middle" fontFamily="'Barlow Semi Condensed', sans-serif" fontWeight={800} fontSize={32}
                  fill={q[2] === 'verde' ? '#ffffff' : C.INK}>{q[1]}</text>
              </g>
            </svg>
          );
        });
      }
      if (b.entre(T, [5, 0.3], [6, 0.05])) r.push(<A.Bien key="ok" T={T} cuando={b.f(5, 0.35)} hasta={b.f(6, 0.02)} x={810} y={430} s={0.6} />);
      r.push(<PS.Encuesta key="en" T={T} cuando={b.f(6, 0.3)} pregunta="¿TÚ DE QUÉ EQUIPO ERES?" a={{ text: 'MÁQUINAS', color: 'amarillo' }} b={{ text: 'PESO LIBRE', color: 'verde' }} />);
      return <div style={{ position: 'absolute', inset: 0 }}>{r}</div>;
    },
    sobre: function (T, b, pr) {
      A.sonido('golpe', b.f(2, 0.3));   // el aterrizaje
      if (!b.entre(T, [6, 0.6], [7, 0])) return null;
      var c = pr('manoI', 1);
      return <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}><PS.Toque T={T} cuando={b.f(6, 0.7)} x={c[0]} y={c[1]} /></svg>;
    },
    accion: { dur: 4.2, pregunta: '¿MÁQUINAS O PESO LIBRE?', vo: 'Compártelo con tu compañero de entreno y guárdalo para tu próximo entreno.' },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
