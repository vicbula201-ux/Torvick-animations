/* ============================================================
   ¿CALISTENIA O GIMNASIO? — reel con Tor, ESTILO 2 (~34 s con la accion y el cierre)
   Pedido del autor: los dos en paralelo (pantalla dividida) comparando el
   cuerpo que desarrolla cada uno, la fuerza, los costos, la variedad de
   ejercicios y la flexibilidad. Lo que dice la evidencia, sin exagerar:
   - los dos construyen musculo si se entrena cerca del fallo (flexiones y
     press de banca dan ganancias parecidas); en el gimnasio es mas facil
     sumar carga, sobre todo en piernas;
   - fuerza maxima: gana el gimnasio; fuerza relativa (mover tu cuerpo): la
     calistenia;
   - costo: la calistenia es casi gratis (un parque y una barra);
   - variedad: el gimnasio, con maquinas y pesos para aislar cada musculo;
   - movilidad y control del cuerpo: suele ganar la calistenia (con rango
     completo las pesas tambien mejoran la flexibilidad);
   - veredicto: el mejor es el que vas a hacer constante, o combinar los dos.
   A la izquierda calistenia (short negro, la barra), a la derecha gimnasio
   (short amarillo, la mancuerna). El visto va para quien gana cada tema.
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
  var LN = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };

  var ROPA_CAL = { short: C.INK };
  var ROPA_GYM = { short: C.YEL };
  var IZQ = 270, DER = 810;
  var L1 = 198, L2 = 193;          // brazo y antebrazo de B.Frente

  /* ---------------- poses ---------------- */

  function hombros() { return B.geoFrente({ pose: TOR.pose({ flex: 0 }) }); }
  var G0 = hombros();
  function brazos(p, mi, md) {
    p.izq.mano = mi; p.der.mano = md;
    p.izq.codo = B.ik(G0.izq.hombro, mi, L1, L2, 1);
    p.der.codo = B.ik(G0.der.hombro, md, L1, L2, -1);
    return p;
  }
  // dominada: k 0 colgado, 1 arriba. Las manos quedan fijas en la barra: Tor sube
  // SUBE unidades y la barra baja lo mismo en sus coordenadas
  var SUBE = 250, Y_BARRA = 236;
  function poseDominada(k) {
    var d = SUBE * k;
    var p = brazos(TOR.pose({ flex: 0 }), [372, Y_BARRA + d], [828, Y_BARRA + d]);
    // las piernas un poco juntas y adelante, colgando
    p.izq.tobillo = [560, 1460]; p.der.tobillo = [640, 1460];
    p.izq.rodilla = [540, 1200]; p.der.rodilla = [660, 1200];
    return p;
  }
  function barraParque(k) {
    var d = SUBE * k;
    var y = Y_BARRA + d;
    return (
      <g>
        <path d={'M 150 ' + (y - 20) + ' L 150 ' + (1560 + d) + ' M 1050 ' + (y - 20) + ' L 1050 ' + (1560 + d)} stroke={C.INK} strokeWidth={30} strokeLinecap="round" />
        <path d={'M 150 ' + (y - 20) + ' L 150 ' + (1560 + d) + ' M 1050 ' + (y - 20) + ' L 1050 ' + (1560 + d)} stroke={C.GRY} strokeWidth={12} strokeLinecap="round" />
        <path d={'M 130 ' + y + ' L 1070 ' + y} stroke={C.INK} strokeWidth={30} strokeLinecap="round" />
        <path d={'M 130 ' + y + ' L 1070 ' + y} stroke={BLANCO} strokeWidth={12} strokeLinecap="round" />
      </g>
    );
  }
  // press con barra: k 0 en los hombros, 1 arriba
  function posePress(k) {
    var y = U.lerp(560, 250, k);
    return brazos(TOR.pose({ flex: 0 }), [372, y], [828, y]);
  }
  function barraArriba(g, k) {
    var c = U.lerpP(g.izq.mano, g.der.mano, 0.5);
    return <B.BarraLibreG vista="frente" c={c} k={0.82} r={150} />;
  }
  // curl con mancuernas de frente
  function poseCurl(k) {
    var p = TOR.pose({ flex: 0 });
    p.izq.codo = [404, 900]; p.izq.mano = [U.lerp(400, 430, k), U.lerp(1150, 700, k)];
    p.der.codo = [796, 900]; p.der.mano = [U.lerp(800, 770, k), U.lerp(1150, 700, k)];
    return p;
  }
  function mancuernas(g) {
    return <g><B.MancuernaG c={g.izq.mano} ang={0} giro={0} k={0.7} /><B.MancuernaG c={g.der.mano} ang={0} giro={0} k={0.7} /></g>;
  }
  // apertura de piernas (k 0 parado, 1 abierto), brazos arriba en V
  function poseApertura(k, pies) {
    var p = B.poseFrente.depie({ pies: U.lerp(96, pies, k) });
    var g = B.geoFrente({ pose: p });
    ['izq', 'der'].forEach(function (lado, i) {
      var l = i ? 1 : -1, S = g[lado].hombro;
      p[lado].codo = U.lerpP(p[lado].codo, U.suma(S, [l * 110, -170]), k);
      p[lado].mano = U.lerpP(p[lado].mano, U.suma(S, [l * 230, -330]), k);
      p[lado].pieAng = U.lerp(12, 70, k);
    });
    return p;
  }

  /* ---------------- iconos ---------------- */

  function IcoBarra(props) {
    var s = props.s || 1;
    return (
      <svg width={240 * s} height={240 * s} viewBox="0 0 240 240" style={{ display: 'block', overflow: 'visible' }}>
        <path d="M 40 50 L 40 220 M 200 50 L 200 220 M 20 220 L 60 220 M 180 220 L 220 220" stroke={C.INK} strokeWidth={16} strokeLinecap="round" />
        <path d="M 26 54 L 214 54" stroke={C.INK} strokeWidth={20} strokeLinecap="round" />
        <path d="M 26 54 L 214 54" stroke={C.YEL} strokeWidth={6} strokeLinecap="round" />
      </svg>
    );
  }
  function IcoAnillas(props) {
    var s = props.s || 1;
    return (
      <svg width={240 * s} height={240 * s} viewBox="0 0 240 240" style={{ display: 'block', overflow: 'visible' }}>
        <path d="M 20 24 L 220 24" stroke={C.INK} strokeWidth={16} strokeLinecap="round" />
        <path d="M 70 24 L 70 128 M 170 24 L 170 128" stroke={C.GRY} strokeWidth={14} strokeLinecap="round" />
        <circle cx={70} cy={168} r={40} fill="none" stroke={C.INK} strokeWidth={16} />
        <circle cx={170} cy={168} r={40} fill="none" stroke={C.INK} strokeWidth={16} />
      </svg>
    );
  }
  function IcoBarraDiscos(props) {
    var s = props.s || 1;
    return (
      <svg width={300 * s} height={200 * s} viewBox="0 0 300 200" style={{ display: 'block', overflow: 'visible' }}>
        <path d="M 14 100 L 286 100" stroke={C.INK} strokeWidth={16} strokeLinecap="round" />
        {[46, 76, 224, 254].map(function (x, i) {
          var h = i === 1 || i === 2 ? 130 : 160;
          return <rect key={x} x={x - 13} y={100 - h / 2} width={26} height={h} rx={8} fill={C.GRY} stroke={C.INK} strokeWidth={11} />;
        })}
      </svg>
    );
  }
  function IcoPesaRusa(props) {
    var s = props.s || 1;
    return (
      <svg width={220 * s} height={240 * s} viewBox="0 0 220 240" style={{ display: 'block', overflow: 'visible' }}>
        <path d="M 66 108 C 50 30 170 30 154 108" fill="none" stroke={C.INK} strokeWidth={22} strokeLinecap="round" />
        <path d="M 30 160 C 30 106 70 92 110 92 C 150 92 190 106 190 160 C 190 204 160 226 110 226 C 60 226 30 204 30 160 Z" fill={C.GRY} {...LN} />
        <path d="M 70 150 Q 80 126 104 120" fill="none" stroke={BLANCO} strokeWidth={10} strokeLinecap="round" />
      </svg>
    );
  }

  /* ---------------- el duelo ---------------- */

  function duelo(o) {
    var g = o.grande;
    var base = g ? { s: 0.5, y: 600 } : { s: 0.44, y: 780 };
    var cal = Object.assign({ x: IZQ - 600 * base.s, y: base.y, s: base.s, ropa: ROPA_CAL, boca: 'sonrisa' }, o.cal || {});
    var gym = Object.assign({ x: DER - 600 * base.s, y: base.y, s: base.s, ropa: ROPA_GYM, boca: 'sonrisa' }, o.gym || {});
    var val = function (v, T, f) { return typeof v === 'function' ? v(T, f) : v; };
    var cabeza = function (to, T, f) { return [val(to.x, T, f) + 600 * to.s, val(to.y, T, f) + 410 * to.s]; };
    return PL.escena2({
      tomas: o.tomas || [[0, { zoom: 1.05, foco: [540, 900] }], [1, { zoom: 1.0, foco: [540, 940] }]],
      pulsos: o.pulsos,
      tor: [cal, gym],
      piezas: o.piezas,
      lienzo: function (T, f) {
        var hc = cabeza(cal, T, f), hg = cabeza(gym, T, f);
        var eb = M.pop(T, f(0) - 0.6, 0.5);
        return (
          <g>
            {o.sinVersus ? null : PL.versus(T, f, { yVs: g ? 1260 : 1150 })}
            {o.sinVersus ? null : (
              <g>
                <g opacity={eb.opacity} transform={'translate(' + (hc[0] - 250).toFixed(1) + ' ' + (hc[1] - 150 + M.life(T, 3, 5)).toFixed(1) + ') scale(' + (0.42 * eb.scale).toFixed(3) + ')'}>
                  <IcoBarra s={1} />
                </g>
                <g opacity={eb.opacity} transform={'translate(' + (hg[0] + 96).toFixed(1) + ' ' + (hg[1] - 120 + M.life(T, 3, 5, 0.5)).toFixed(1) + ') scale(' + (0.26 * eb.scale).toFixed(3) + ')'}>
                  <P.Pesa s={1} />
                </g>
              </g>
            )}
            {o.lienzo ? o.lienzo(T, f) : null}
          </g>
        );
      },
      mal: o.mal, bien: o.bien, r1: o.r1, r2: o.r2
    });
  }
  function repe(T, f, n, va, aguanta) { return V.ida(V.fase(T, f(0.05), f(0.97), n), va || 0.4, aguanta || 0.15); }

  // la dominada como opciones de Tor (y animada, pose y la barra en el fondo)
  function dominando(s, y, n) {
    return {
      y: function (T, f) { return y - SUBE * s * repe(T, f, n); },
      pose: function (T, f) { return poseDominada(repe(T, f, n)); },
      fondo: function (g, T, f) { return barraParque(repe(T, f, n)); }
    };
  }

  /* ---------------- escenas ---------------- */

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: '¿Calistenia o gimnasio? Esto es lo que gana cada uno.',
      C: duelo({
        grande: true,
        tomas: [[0, { zoom: 1.22, foco: [540, 900] }], [1, { zoom: 1.0, foco: [540, 960] }]],
        cal: Object.assign({ musc: { bic: 1, serr: 0.6 } }, dominando(0.5, 640, 2)),
        gym: { musc: { bic: 1 }, pose: function (T, f) { return poseCurl(repe(T, f, 2)); }, extra: function (g) { return mancuernas(g); } },
        r1: { text: 'CALISTENIA', x: 40, y: 420, s: 1.05, cuando: 0.04 },
        r2: { text: 'GIMNASIO', x: 590, y: 420, s: 1.05, cuando: 0.16 }
      }) },

    { nombre: 'Cuerpo', dur: 4.6, vo: 'Los dos construyen músculo; en el gimnasio es más fácil sumar peso, sobre todo en piernas.',
      C: duelo({
        grande: true,
        cal: { musc: { pec: 1, delt: 1, bic: 1, abd: 1, serr: 0.8 } },
        gym: { s: 0.53, x: DER - 600 * 0.53, y: 570, musc: { pec: 1, delt: 1, bic: 1, abd: 1,
          cuad: function (T, f) { return animate({ from: 0, to: 1, start: f(0.42), end: f(0.56) })(T); } },
          extra: function (g, T, f) {
            var v = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56) })(T);
            return <g><V.Brillo T={T} c={g.izq.rodilla} r={90} v={v} /><V.Brillo T={T} c={g.der.rodilla} r={90} v={v} /></g>;
          } },
        bien: [{ x: 360, y: 560, cuando: 0.3, s: 0.5 }, { x: 900, y: 560, cuando: 0.62, s: 0.6 }],
        r1: { text: 'MÚSCULO', s: 1.3, cuando: 0.02 },
        r2: { text: 'PIERNAS: GIMNASIO', cuando: 0.56 }
      }) },

    { nombre: 'Fuerza', dur: 4.6, vo: 'El gimnasio te da más fuerza máxima; la calistenia, más fuerza relativa: mover tu cuerpo.',
      C: duelo({
        grande: true,
        pulsos: [0.3, 0.75],
        cal: Object.assign({ musc: { bic: 1, serr: 0.6 } }, dominando(0.5, 640, 3)),
        gym: { musc: { delt: 1, trap: 0.6 },
          pose: function (T, f) { return posePress(repe(T, f, 2, 0.35, 0.2)); },
          extra: function (g, T, f) { return barraArriba(g); } },
        bien: [{ x: 370, y: 520, cuando: 0.62, s: 0.5 }, { x: 910, y: 520, cuando: 0.32, s: 0.5 }],
        r1: { text: 'FUERZA', s: 1.3, cuando: 0.02 },
        r2: { text: 'RELATIVA VS MÁXIMA', cuando: 0.3 }
      }) },

    { nombre: 'Costo', dur: 4.8, vo: 'La calistenia es casi gratis: un parque y una barra. El gimnasio se paga cada mes.',
      C: duelo({
        piezas: [
          { C: IcoBarra, s: 1.1, x: IZQ - 260, y: 420, cuando: 0.06 },
          { C: B.Cuenta, s: 1.0, x: IZQ + 20, y: 430, cuando: 0.14, p: { n: 0, p: 0 } },
          { C: N.ICONOS.calendario, s: 1.0, x: DER - 250, y: 420, cuando: 0.3 },
          { C: N.ICONOS.billete, s: 0.85, x: DER + 10, y: function (T, f) { return 430 - 60 * Math.max(0, Math.sin((T - f(0.4)) * 5)); }, cuando: 0.4 },
          { C: N.ICONOS.billete, s: 0.85, x: DER + 30, y: 560, cuando: 0.5 }
        ],
        bien: [{ x: 380, y: 660, cuando: 0.3, s: 0.55 }],
        r1: { text: 'COSTO', s: 1.3, cuando: 0.02 },
        r2: { text: 'GRATIS VS CADA MES', cuando: 0.4 }
      }) },

    { nombre: 'Variedad', dur: 3.8, vo: 'En variedad gana el gimnasio: máquinas y pesos para trabajar cada músculo.',
      C: duelo({
        piezas: [
          { C: IcoBarra, s: 0.9, x: 40, y: 430, cuando: 0.06 },
          { C: IcoAnillas, s: 0.9, x: 270, y: 430, cuando: 0.12 },
          { C: P.Pesa, s: 0.55, x: 570, y: 400, cuando: 0.26 },
          { C: IcoBarraDiscos, s: 0.8, x: 800, y: 380, cuando: 0.32 },
          { C: IcoPesaRusa, s: 0.75, x: 600, y: 540, cuando: 0.38 },
          { C: B.Banco, s: 0.28, x: 790, y: 560, cuando: 0.44, p: { sinPiso: true } }
        ],
        bien: [{ x: 900, y: 640, cuando: 0.56, s: 0.6 }],
        r1: { text: 'VARIEDAD', s: 1.3, cuando: 0.02 },
        r2: { text: 'MÁS OPCIONES EN EL GYM', cuando: 0.5 }
      }) },

    { nombre: 'Flexibilidad', dur: 3.8, vo: 'En movilidad y control del cuerpo suele ganar la calistenia.',
      C: duelo({
        cal: { musc: { aduct: 1 },
          pose: function (T, f) { return poseApertura(animate({ from: 0, to: 1, start: f(0.08), end: f(0.4), ease: Easing.easeInOutCubic })(T), 470); } },
        gym: { boca: true,
          pose: function (T, f) { return poseApertura(animate({ from: 0, to: 1, start: f(0.12), end: f(0.4), ease: Easing.easeInOutCubic })(T), 250); } },
        piezas: [
          { C: P.Medidor, s: 0.8, x: IZQ - 150, y: 420, cuando: 0.2, p: function (T, f) { return { p: animate({ from: 0.2, to: 0.95, start: f(0.25), end: f(0.55) })(T) }; } },
          { C: P.Medidor, s: 0.8, x: DER - 150, y: 420, cuando: 0.26, p: function (T, f) { return { p: animate({ from: 0.2, to: 0.5, start: f(0.3), end: f(0.55) })(T) }; } }
        ],
        bien: [{ x: 380, y: 560, cuando: 0.6, s: 0.55 }],
        r1: { text: 'FLEXIBILIDAD', s: 1.25, cuando: 0.02 },
        r2: { text: 'MOVILIDAD Y CONTROL', cuando: 0.5 }
      }) },

    { nombre: 'Veredicto', dur: 4.2, vo: '¿El mejor? El que vas a hacer constante. Y si puedes, combina los dos.',
      C: (function () {
        var junta = function (T, f) { return animate({ from: 0, to: 1, start: f(0.36), end: f(0.56), ease: Easing.easeInOutCubic })(T); };
        var flex = function (T, f) { return animate({ from: 0, to: 1, start: f(0.5), end: f(0.66), ease: Easing.easeOutBack })(T); };
        return duelo({
          grande: true,
          sinVersus: true,
          pulsos: [0.6],
          cal: { x: function (T, f) { return IZQ - 300 + 80 * junta(T, f); }, flex: flex, musc: { bic: 1 } },
          gym: { x: function (T, f) { return DER - 300 - 80 * junta(T, f); }, flex: flex, musc: { bic: 1 } },
          lienzo: function (T, f) {
            // la linea del medio se borra y los dos se juntan
            var d = 1 - animate({ from: 0, to: 1, start: f(0.1), end: f(0.34) })(T);
            var e = M.pop(T, f(0) - 0.6, 0.5);
            var sale = 1 - animate({ from: 0, to: 1, start: f(0.08), end: f(0.2) })(T);
            return (
              <g>
                <path d="M 540 360 L 540 1460" stroke={C.INK} strokeWidth={8} strokeLinecap="round" strokeDasharray={1100} strokeDashoffset={1100 * (1 - d)} />
                {sale > 0.02 ? (
                  <g opacity={e.opacity * sale} transform={'translate(540 1260) scale(' + (e.scale * sale).toFixed(3) + ')'}>
                    <circle cx={0} cy={0} r={66} fill={C.YEL} stroke={C.INK} strokeWidth={13} />
                    <text x={0} y={21} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={58} fill={C.INK}>VS</text>
                  </g>
                ) : null}
                <V.Confeti T={T} desde={f(0.62)} />
                <V.Chispa T={T} c={[540, 760]} cuando={f(0.62)} r={220} />
              </g>
            );
          },
          r1: { text: 'EL QUE HAGAS CONSTANTE', s: 1.0, cuando: 0.1 },
          r2: { text: 'O COMBINA LOS DOS', s: 1.1, cuando: 0.6 }
        });
      })() }
  ];

  global.REELS.registrar({
    id: 'calistenia-gym', titulo: '¿Calistenia o gimnasio? (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿CUÁL PREFIERES?', vo: '¿Cuál prefieres tú? Coméntalo, compártelo con un amigo y guárdalo.' }
  });
})(window);
