/* ============================================================
   PORNOGRAFIA — reel con Tor, ESTILO 2 (~39 s con la accion y el cierre)
   "No veas más pornografía" (pedido del autor). El gancho NO muestra nada
   sexual (ni ereccion ni movimientos): TikTok e Instagram bajan o castigan
   cualquier video que muestre o sugiera estimulacion sexual, aunque sea
   animado. En su lugar: Tor a las 3 de la manana en la cama, pegado al
   celular (se ve el dorso y un globo 18+), ojos rojos, sudor y las X.
   Lo que dice la evidencia, sin exagerar:
   - puede volverse un habito compulsivo (la OMS lo reconoce en la CIE-11 como
     trastorno de conducta sexual compulsiva): el cerebro aprende a buscar el
     estimulo facil y cada vez pide mas;
   - se asocia con menos satisfaccion en pareja y, en algunos jovenes, con
     problemas de ereccion con la pareja;
   - de noche roba horas de sueno: sin sueno no hay recuperacion;
   - deja expectativas irreales: comparas cuerpos y baja la confianza;
   - que hacer: el celular fuera del cuarto de noche, cambiar el habito por
     otro (entrenar, caminar) y, si no puedes solo, pedir ayuda profesional.
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

  /* ---------------- el cuarto: cama, manta, ventana, mesita y despertador ---------------- */

  // Tor sentado en la cama con el celular en las dos manos, frente al pecho
  function poseCelular() {
    var p = TOR.pose({ flex: 0 });
    p.izq.codo = [446, 920]; p.izq.mano = [530, 800];
    p.der.codo = [754, 920]; p.der.mano = [670, 800];
    return p;
  }
  // cabecera y almohada (detras de Tor, en sus coordenadas)
  function cama() {
    return (
      <g>
        <rect x={120} y={560} width={960} height={940} rx={50} fill={BLANCO} {...LN} />
        <rect x={180} y={620} width={840} height={300} rx={30} fill={C.GRY} stroke="none" />
        <rect x={300} y={600} width={600} height={190} rx={70} fill={BLANCO} {...LN} />
        <path d="M 380 660 Q 600 700 820 660" fill="none" stroke={C.GRY} strokeWidth={12} strokeLinecap="round" />
      </g>
    );
  }
  // la manta tapa de la cintura para abajo
  function manta() {
    return (
      <g>
        <path d="M 90 1520 L 90 1050 Q 90 970 180 970 L 1020 970 Q 1110 970 1110 1050 L 1110 1520 Z" fill={BLANCO} {...LN} />
        <path d="M 90 1080 L 1110 1080" stroke={C.GRY} strokeWidth={16} />
        <path d="M 300 1180 Q 340 1300 320 1440 M 600 1160 Q 640 1300 610 1450 M 880 1180 Q 920 1300 900 1440" fill="none" stroke={C.GRY} strokeWidth={11} strokeLinecap="round" />
      </g>
    );
  }
  // el dorso del celular (la pantalla mira a Tor) y el globo 18+ que sale de el
  function celular(g, T, f, cuando) {
    var c = U.suma(U.lerpP(g.izq.mano, g.der.mano, 0.5), [0, -70]);
    var e = M.pop(T, f(cuando), 0.42);
    var dy = M.life(T, 2.6, 10);
    return (
      <g>
        <V.Brillo T={T} c={U.suma(c, [0, -160])} r={130} v={0.7} />
        <rect x={c[0] - 86} y={c[1] - 140} width={172} height={280} rx={30} fill={C.GRY} {...LN} />
        <circle cx={c[0] - 46} cy={c[1] - 100} r={16} fill={C.INK} />
        <circle cx={g.izq.mano[0]} cy={g.izq.mano[1]} r={44} fill={BLANCO} stroke={C.INK} strokeWidth={14} />
        <circle cx={g.der.mano[0]} cy={g.der.mano[1]} r={44} fill={BLANCO} stroke={C.INK} strokeWidth={14} />
        {e.opacity > 0.02 ? (
          <g opacity={e.opacity} transform={'translate(' + (c[0] + 190) + ' ' + (c[1] - 230 + dy).toFixed(1) + ') scale(' + e.scale.toFixed(3) + ')'}>
            <path d="M -40 70 L -90 120 L -16 86 Z" fill={C.RED} stroke={C.INK} strokeWidth={12} strokeLinejoin="round" />
            <circle cx={0} cy={0} r={100} fill={C.RED} stroke={C.INK} strokeWidth={14} />
            <text x={0} y={22} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={74} fill={BLANCO}>18+</text>
          </g>
        ) : null}
      </g>
    );
  }

  // ventana de noche: la luna y dos estrellas
  function Ventana(props) {
    var T = props.T || 0;
    var tw = 0.75 + 0.25 * Math.sin(T * 4);
    return (
      <svg width={260} height={260} viewBox="0 0 260 260" style={{ display: 'block', overflow: 'visible' }}>
        <rect x={10} y={10} width={240} height={240} rx={16} fill={BLANCO} {...LN} />
        <g transform="translate(40 40) scale(0.62)"><N.ICONOS.luna s={1} /></g>
        <path d={'M 196 70 l 0 ' + (-22 * tw) + ' M 196 70 l 0 ' + (22 * tw) + ' M 196 70 l ' + (-22 * tw) + ' 0 M 196 70 l ' + (22 * tw) + ' 0'} stroke={C.YEL} strokeWidth={10} strokeLinecap="round" />
        <circle cx={80} cy={200} r={9 * tw} fill={C.YEL} />
        <path d="M 130 10 L 130 250 M 10 130 L 250 130" stroke={C.INK} strokeWidth={12} />
      </svg>
    );
  }
  // despertador: marca las 3; gira (horas por segundo) hace correr las agujas
  function Despertador(props) {
    var T = props.T || 0, gira = props.gira || 0;
    var hora = 90 + gira * 30 * T, minuto = gira * 360 * T, seg = T * 360;
    return (
      <svg width={240} height={260} viewBox="0 0 240 260" style={{ display: 'block', overflow: 'visible' }}>
        <path d="M 66 226 L 44 252 M 174 226 L 196 252" stroke={C.INK} strokeWidth={14} strokeLinecap="round" />
        <path d="M 30 70 A 44 44 0 0 1 92 24 Z" fill={C.GRY} {...LN} strokeWidth={12} />
        <path d="M 210 70 A 44 44 0 0 0 148 24 Z" fill={C.GRY} {...LN} strokeWidth={12} />
        <circle cx={120} cy={140} r={98} fill={BLANCO} {...LN} />
        {[0, 90, 180, 270].map(function (a) {
          return <path key={a} d="M 120 58 L 120 74" stroke={C.INK} strokeWidth={10} strokeLinecap="round" transform={'rotate(' + a + ' 120 140)'} />;
        })}
        <path d="M 120 140 L 120 88" stroke={C.INK} strokeWidth={14} strokeLinecap="round" transform={'rotate(' + hora.toFixed(1) + ' 120 140)'} />
        <path d="M 120 140 L 120 66" stroke={C.INK} strokeWidth={10} strokeLinecap="round" transform={'rotate(' + minuto.toFixed(1) + ' 120 140)'} />
        <path d="M 120 150 L 120 62" stroke={C.RED} strokeWidth={6} strokeLinecap="round" transform={'rotate(' + seg.toFixed(1) + ' 120 140)'} />
        <circle cx={120} cy={140} r={10} fill={C.INK} />
      </svg>
    );
  }
  function Mesita(props) {
    return (
      <svg width={220} height={240} viewBox="0 0 220 240" style={{ display: 'block', overflow: 'visible' }}>
        <rect x={10} y={10} width={200} height={190} rx={14} fill={BLANCO} {...LN} />
        <path d="M 10 104 L 210 104" stroke={C.INK} strokeWidth={12} />
        <path d="M 90 58 L 130 58 M 90 152 L 130 152" stroke={C.INK} strokeWidth={12} strokeLinecap="round" />
        <path d="M 34 200 L 34 232 M 186 200 L 186 232" stroke={C.INK} strokeWidth={14} strokeLinecap="round" />
      </svg>
    );
  }

  var TC = { x: 120, y: 300, s: 0.7 };   // Tor en la cama

  // celular de frente (con la pantalla) para la escena del enganche
  function Pantallita(props) {
    return (
      <svg width={120} height={200} viewBox="0 0 120 200" style={{ display: 'block', overflow: 'visible' }}>
        <rect x={8} y={8} width={104} height={184} rx={18} fill={BLANCO} {...LN} strokeWidth={12} />
        <rect x={22} y={30} width={76} height={128} rx={6} fill={C.GRY} stroke={C.INK} strokeWidth={8} />
        <path d="M 50 74 L 50 114 L 80 94 Z" fill={BLANCO} stroke={C.INK} strokeWidth={7} strokeLinejoin="round" />
      </svg>
    );
  }
  // flecha en circulo que gira alrededor del cerebro (el circulo del habito)
  function lazo(T, f, c, r) {
    var p = M.draw(T, f(0.1), 0.6);
    var giro = T * 70;
    var largo = 2 * Math.PI * r * 0.8;
    return (
      <g transform={'rotate(' + giro.toFixed(1) + ' ' + c[0] + ' ' + c[1] + ')'}>
        <path d={'M ' + (c[0] + r) + ' ' + c[1] + ' A ' + r + ' ' + r + ' 0 1 1 ' + (c[0] + r * Math.cos(-0.5)).toFixed(1) + ' ' + (c[1] + r * Math.sin(-0.5)).toFixed(1)}
          fill="none" stroke={C.RED} strokeWidth={20} strokeLinecap="round" strokeDasharray={largo} strokeDashoffset={largo * (1 - p)} />
        {p > 0.95 ? (
          <path d={'M ' + (c[0] + r - 40) + ' ' + (c[1] - 10) + ' L ' + (c[0] + r) + ' ' + (c[1] + 34) + ' L ' + (c[0] + r + 40) + ' ' + (c[1] - 10)}
            fill="none" stroke={C.RED} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
        ) : null}
      </g>
    );
  }
  // el corazon que se raja entre los dos
  function Raja(props) {
    var k = clamp(props.k || 0, 0, 1);
    return (
      <svg width={300} height={280} viewBox="0 0 110 100" style={{ display: 'block', overflow: 'visible' }}>
        <path d="M 55 92 C 12 62, 4 34, 22 18 C 38 4, 55 14, 55 28 C 55 14, 72 4, 88 18 C 106 34, 98 62, 55 92 Z"
          fill={k > 0.5 ? C.GRY : C.RED} stroke={C.INK} strokeWidth={6} strokeLinejoin="round" />
        {k > 0 ? (
          <path d="M 55 28 L 48 44 L 60 56 L 50 70 L 56 90" fill="none" stroke={C.INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={90} strokeDashoffset={90 * (1 - k)} />
        ) : null}
      </svg>
    );
  }

  // el celular sale volando del cuarto y entra en el cajon
  function Cajon(props) {
    var tapa = props.tapa || 0;
    return (
      <svg width={280} height={250} viewBox="0 0 280 250" style={{ display: 'block', overflow: 'visible' }}>
        <rect x={20} y={70} width={240} height={160} rx={16} fill={BLANCO} {...LN} />
        <path d="M 110 150 L 170 150" stroke={C.INK} strokeWidth={14} strokeLinecap="round" />
        <g transform={'rotate(' + (-34 * tapa).toFixed(1) + ' 20 70)'}>
          <rect x={10} y={46} width={260} height={30} rx={10} fill={C.GRY} {...LN} strokeWidth={12} />
        </g>
      </svg>
    );
  }

  /* ---------------- escenas ---------------- */

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.8, vo: 'No veas más pornografía. Te explico por qué.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.4, foco: [540, 700] }], [1, { zoom: 1.02, foco: [540, 880] }]],
        tor: { x: TC.x, y: TC.y, s: TC.s, ojos: 'rojos', boca: true, pose: poseCelular(),
          fondo: function () { return cama(); },
          extra: function (g, T, f) {
            return (
              <g>
                {manta()}
                {celular(g, T, f, 0.12)}
                <V.Gotas T={T} c={g.cabeza} v={1} />
              </g>
            );
          } },
        piezas: [
          { C: Ventana, x: 790, y: 380, cuando: 0.06, p: function (T) { return { T: T }; } },
          { C: Mesita, x: 20, y: 1190, cuando: 0.1 },
          { C: Despertador, s: 1, x: 10, y: 940, cuando: 0.16, fase: 0.3, p: function (T) { return { T: T }; } }
        ],
        mal: [{ x: 90, y: 430, cuando: 0.24, s: 0.6 }, { x: 800, y: 700, cuando: 0.46, s: 0.5 }],
        r1: { text: 'PORNOGRAFÍA', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Engancha', dur: 5, vo: 'Engancha: tu cerebro se acostumbra al estímulo fácil y cada vez pide más.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.08, foco: [540, 700] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.5, 0.6, 0.7, 0.8],
        piezas: [
          { C: P.Cerebro, s: 0.82, x: 290, y: 416, p: function (T, f) { return { T: T, on: animate({ from: 0.3, to: 1, start: f(0.1), end: f(0.5) })(T) }; } }
        ].concat([0, 1, 2, 3, 4].map(function (i) {
          return { C: Pantallita, x: 70 + i * 180, y: 1090 - (i % 2) * 40, cuando: 0.42 + i * 0.1, fase: i * 0.2 };
        })),
        lienzo: function (T, f) {
          var tiros = [];
          for (var i = 0; i < 5; i++) {
            tiros.push(<V.Chispa key={i} T={T} c={[544, 662]} cuando={f(0.46 + i * 0.1)} r={150 + i * 30} />);
          }
          return <g>{lazo(T, f, [544, 662], 320)}{tiros}</g>;
        },
        r1: { text: 'ENGANCHA', s: 1.3, cuando: 0.02 },
        r2: { text: 'CADA VEZ PIDE MÁS', y: 1490, cuando: 0.5 }
      }) },

    { nombre: 'Pareja', dur: 5, vo: 'Se asocia con menos satisfacción en pareja y, en algunos jóvenes, con problemas de erección.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 760] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        piezas: [
          { C: N.ICONOS.persona, s: 1.5, x: function (T, f) { return 40 - 70 * animate({ from: 0, to: 1, start: f(0.36), end: f(0.6), ease: Easing.easeInOutCubic })(T); }, y: 560 },
          { C: N.ICONOS.persona, s: 1.5, x: function (T, f) { return 680 + 70 * animate({ from: 0, to: 1, start: f(0.36), end: f(0.6), ease: Easing.easeInOutCubic })(T); }, y: 560 },
          { C: Raja, x: 390, y: 520, p: function (T, f) { return { k: animate({ from: 0, to: 1, start: f(0.32), end: f(0.48) })(T) }; } },
          { C: P.Medidor, s: 0.95, x: 330, y: 1010, cuando: 0.5,
            p: function (T, f) { return { p: animate({ from: 0.9, to: 0.15, start: f(0.56), end: f(0.82) })(T) }; } }
        ],
        mal: [{ x: 440, y: 560, cuando: 0.4, s: 0.85 }],
        r1: { text: 'MENOS SATISFACCIÓN', s: 1.1, cuando: 0.04 },
        r2: { text: 'PROBLEMAS EN LA CAMA', y: 1490, cuando: 0.58 }
      }) },

    { nombre: 'Sueño', dur: 4.5, vo: 'Te roba horas de sueño, y sin sueño no hay recuperación ni músculo.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 820] }], [1, { zoom: 1.1, foco: [540, 760] }]],
        tor: { x: TC.x, y: TC.y, s: TC.s, ojos: 'rojos', boca: 'triste', pose: poseCelular(),
          fondo: function () { return cama(); },
          extra: function (g, T, f) { return <g>{manta()}{celular(g, T, f, 2)}</g>; } },
        piezas: [
          { C: Despertador, s: 1, x: 10, y: 940, p: function (T, f) { return { T: T, gira: T > f(0.1) ? 3 : 0 }; } },
          { C: Mesita, x: 20, y: 1190 },
          { C: N.ICONOS.bateria, s: 1.05, x: 800, y: 400, cuando: 0.2,
            p: function (T, f) { return { p: animate({ from: 1, to: 0.08, start: f(0.25), end: f(0.75) })(T) }; } }
        ],
        mal: [{ x: 820, y: 700, cuando: 0.72, s: 0.5 }],
        r1: { text: 'MENOS SUEÑO', s: 1.25, cuando: 0.04 },
        r2: { text: 'MENOS RECUPERACIÓN', y: 1490, cuando: 0.55 }
      }) },

    { nombre: 'Expectativas', dur: 4.5, vo: 'Y te deja expectativas irreales: comparas cuerpos y pierdes confianza.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 760] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        tor: { s: 0.56, x: 40, y: 700, boca: 'triste',
          extra: function (g, T, f) { return <V.Gotas T={T} c={g.cabeza} v={animate({ from: 0, to: 1, start: f(0.5), end: f(0.6) })(T)} />; } },
        piezas: [
          { C: P.Nube, s: 0.72, x: 420, y: 400, cuando: 0.12,
            p: function (T) {
              // el cuerpo "ideal" con el que se compara: un Tor chiquito sacando biceps
              return { children: (
                <div style={{ width: 170, height: 180, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 85 - 600 * 0.125, top: 4 }}>
                    <TOR.Tor s={0.125} flex={1} boca="sonrisa" sinPiso musc={{ bic: 1 }} parpadeo={V.parpadeo(T, 0.4)} />
                  </div>
                </div>
              ) };
            } },
          { C: P.Medidor, s: 0.9, x: 640, y: 1040, cuando: 0.4,
            p: function (T, f) { return { p: animate({ from: 0.9, to: 0.12, start: f(0.46), end: f(0.78) })(T) }; } }
        ],
        mal: [{ x: 830, y: 420, cuando: 0.36, s: 0.55 }],
        r1: { text: 'EXPECTATIVAS IRREALES', s: 1.0, cuando: 0.04 },
        r2: { text: 'MENOS CONFIANZA', y: 1490, cuando: 0.52 }
      }) },

    { nombre: 'Qué hacer', dur: 5, vo: 'De noche, el celular fuera del cuarto. Y cambia el hábito: entrena o sal a caminar.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 800] }], [0.5, { zoom: 1.1, foco: [700, 900] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.36, 0.7],
        tor: { s: 0.6, x: 20, y: 560, boca: 'sonrisa', musc: { bic: 1 },
          flex: function (T, f) { return animate({ from: 0, to: 1, start: f(0.6), end: f(0.74), ease: Easing.easeOutBack })(T); } },
        piezas: [
          { C: Cajon, x: 740, y: 1000, cuando: 0.06,
            p: function (T, f) { return { tapa: clamp(1 - Math.abs((T - f(0.34)) / 0.25), 0, 1) }; } },
          { C: P.Pesa, s: 0.6, x: 640, y: 560, cuando: 0.64 }
        ],
        lienzo: function (T, f) {
          var u = clamp((T - f(0.12)) / (f(0.34) - f(0.12)), 0, 1);
          if (u >= 1) return <V.Chispa T={T} c={[880, 1060]} cuando={f(0.34)} r={130} />;
          var k = Easing.easeInOutCubic(u);
          var x = U.lerp(520, 880, k), y = U.lerp(1150, 1060, k) - 420 * Math.sin(Math.PI * k);
          var e = M.pop(T, f(0.04), 0.4);
          return (
            <g opacity={e.opacity} transform={'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (540 * k).toFixed(1) + ') scale(' + (e.scale * (1 - 0.3 * k)).toFixed(3) + ') translate(-60 -100)'}>
              <Pantallita />
            </g>
          );
        },
        bien: [{ x: 820, y: 560, cuando: 0.74, s: 0.62 }],
        r1: { text: 'CELULAR FUERA DEL CUARTO', s: 0.95, cuando: 0.04 },
        r2: { text: 'CAMBIA EL HÁBITO', s: 1.15, y: 1490, cuando: 0.56 }
      }) },

    { nombre: 'Ayuda', dur: 4.6, vo: 'Y si no puedes dejarlo solo, pide ayuda a un profesional. No es vergüenza.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 820] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.5],
        tor: { s: 0.56, x: -10, y: 640, boca: 'sonrisa' },
        piezas: [
          { C: N.ICONOS.persona, s: 1.5, x: 690, y: 760, cuando: 0.14, p: { color: C.GRN } },
          { C: P.Corazon, s: 1.6, x: 460, y: 560, cuando: 0.42, p: function (T) { return { color: C.YEL, beat: 1 + 0.08 * Math.max(0, Math.sin(T * 7)) }; } }
        ],
        lienzo: function (T, f) { return <V.Brillo T={T} c={[548, 640]} r={130} v={animate({ from: 0, to: 0.9, start: f(0.44), end: f(0.54) })(T)} />; },
        bien: [{ x: 800, y: 480, cuando: 0.62, s: 0.62 }],
        r1: { text: 'PIDE AYUDA', s: 1.3, cuando: 0.04 },
        r2: { text: 'NO ES VERGÜENZA', s: 1.15, y: 1490, cuando: 0.52 }
      }) }
  ];

  global.REELS.registrar({
    id: 'porno', titulo: 'No veas más pornografía (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4, pregunta: '¿TE ANIMAS A DEJARLO?', vo: '¿Te animas a dejarlo? Coméntalo, compártelo y guárdalo.' }
  });
})(window);
