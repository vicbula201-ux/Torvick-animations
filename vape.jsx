/* ============================================================
   VAPE — reel con Tor, ESTILO 2 (~36 s con la accion y el cierre)
   "No fumes más vape" (pedido del autor; la formula del de la marihuana).
   - gancho: Tor echa una nube enorme que lo tapa entero; solo se le ven los
     ojos y la mano que abanica; tose;
   - lo que dicen los CDC y la OMS, sin exagerar: el aerosol NO es vapor de
     agua (lleva nicotina, particulas ultrafinas y metales como niquel,
     estano y plomo que llegan al fondo del pulmon); la nicotina engancha y
     un vape desechable puede traer la de varias cajetillas; se asocia con
     mas tos, pulso acelerado y menos capacidad al entrenar;
   - "¿es peor que el cigarro?": la evidencia dice que probablemente es menos
     toxico que fumar, asi que el video NO afirma que sea peor; si dice lo
     que es cierto: engancha igual o mas y ninguno de los dos es sano;
   - cierre: el vape, al tacho.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, PL = global.PL, V = global.V, TOR = global.TOR, MU = global.MU;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var A = global.REELS.ayudas;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };
  var FIG = PL.FIG;
  var G0 = B.geoFrente({ pose: TOR.pose({ flex: 0 }) });
  var L1 = 198, L2 = 193;

  function pulso(T, cuando, d) { var u = (T - cuando) / d; return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0; }
  function azar(i, k) { var v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); }
  function icono(Cmp, c, k, ang, props) {
    return (
      <g transform={'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + (ang || 0).toFixed(1) + ') scale(' + k + ') translate(-120 -120)'}>
        <Cmp s={1} {...(props || {})} />
      </g>
    );
  }

  // nube de vape: bolas blancas que salen de c y crecen. Primero van todos los
  // contornos y despues todos los rellenos: asi queda una sola silueta
  function nube(c, T, v, op) {
    op = op || {};
    if (v < 0.02) return null;
    var n = op.n || 10, R = op.r || 150, ancho = op.ancho || 250, alto = op.alto || 210;
    var bolas = [[c[0], c[1] - 30 * v, R * 0.95 * v]];
    for (var i = 0; i < n; i++) {
      var a = i / n * 2 * Math.PI + 0.5 * Math.sin(T * 0.9 + i);
      var d = (0.45 + 0.55 * azar(i, 1)) * v;
      bolas.push([c[0] + Math.cos(a) * ancho * d + 14 * Math.sin(T * 1.3 + i * 2),
        c[1] + Math.sin(a) * alto * d - 40 * v + 10 * Math.cos(T * 1.1 + i),
        R * (0.5 + 0.45 * azar(i, 2)) * (0.3 + 0.7 * v)]);
    }
    return (
      <g opacity={op.opacity == null ? 1 : op.opacity}>
        {bolas.map(function (b, i) { return <circle key={'t' + i} cx={b[0].toFixed(1)} cy={b[1].toFixed(1)} r={b[2].toFixed(1)} fill={BLANCO} stroke={C.INK} strokeWidth={15} />; })}
        {bolas.map(function (b, i) { return <circle key={'r' + i} cx={b[0].toFixed(1)} cy={b[1].toFixed(1)} r={Math.max(0, b[2] - 7).toFixed(1)} fill={BLANCO} />; })}
        {bolas.map(function (b, i) {
          if (i % 2 || b[2] < 50) return null;
          var r = b[2] * 0.62;
          return <path key={'a' + i} d={'M ' + (b[0] - r).toFixed(1) + ' ' + (b[1] + 8).toFixed(1) + ' A ' + r.toFixed(1) + ' ' + r.toFixed(1) + ' 0 0 0 ' + (b[0] - r * 0.3).toFixed(1) + ' ' + (b[1] + r * 0.95).toFixed(1)}
            fill="none" stroke={C.GRY} strokeWidth={9} strokeLinecap="round" />;
        })}
      </g>
    );
  }
  function vapeEn(c, ang, k, color) {
    // el vape con la boquilla en c
    return (
      <g transform={'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + k + ') translate(-120 -24)'}>
        <N.ICONOS.vape s={1} color={color} />
      </g>
    );
  }

  /* ---------------- gancho: la nube que lo tapa ---------------- */

  var TG = { x: FIG.x, y: FIG.y + 50, s: FIG.s };
  function enTG(p) { return [TG.x + p[0] * TG.s, TG.y + p[1] * TG.s]; }
  function poseVapea() {
    var p = TOR.pose({ flex: 0 });
    p.der.codo = U.suma(G0.der.hombro, [96, 190]);
    p.der.mano = U.suma(G0.cabeza, [120, 150]);
    return p;
  }
  var TOSES = [0.56, 0.8];

  /* ---------------- cierre: el vape, al tacho ---------------- */

  var PT = { x: 230, y: 380, s: 0.7 };
  function enPT(p) { return [PT.x + p[0] * PT.s, PT.y + p[1] * PT.s]; }
  function EscTacho(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var arma = animate({ from: 0, to: 1, start: f(0.16), end: f(0.3), ease: Easing.easeInOutCubic })(T);
    var lanza = clamp((T - f(0.3)) / (f(0.52) - f(0.3)), 0, 1);
    var vuelve = animate({ from: 0, to: 1, start: f(0.5), end: f(0.6) })(T);
    var festeja = animate({ from: 0, to: 1, start: f(0.62), end: f(0.76), ease: Easing.easeOutBack })(T);
    A.sonido('whoosh', f(0.3));
    A.sonido('golpe', f(0.52));
    var tapa = clamp(1 - Math.abs((T - f(0.52)) / 0.2), 0, 1);
    var TACHO = [176, 1150];                          // la boca del tacho
    var pose;
    if (festeja > 0.01) pose = TOR.pose({ flex: festeja });
    else {
      pose = TOR.pose({ flex: 0 });
      var a = U.lerpP([960, 600], [1010, 470], arma);            // toma impulso
      var b = [470, 640];                                          // suelta hacia el tacho
      var m = lanza > 0 ? U.lerpP(a, b, Easing.easeOutCubic(clamp(lanza * 3, 0, 1))) : a;
      m = U.lerpP(m, TOR.pose({ flex: 0 }).der.mano, vuelve);
      pose.der.mano = m;
      pose.der.codo = B.ik(G0.der.hombro, m, L1, L2, -1);
    }
    var manoC = enPT(pose.der.mano);
    var vx = manoC[0], vy = manoC[1] - 60, ang = 18 - 30 * arma;
    if (lanza > 0) {
      var k = Easing.easeInQuad(lanza);
      var desde = enPT([470, 640]);
      vx = U.lerp(desde[0], TACHO[0], k); vy = U.lerp(desde[1] - 60, TACHO[1], k) - 300 * Math.sin(Math.PI * lanza);
      ang = -30 - 620 * lanza;
    }
    var e2 = M.pop(T, f(0.66), 0.42);
    var limpio = M.pop(T, f(0.7), 0.42);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} tomas={[[0, { zoom: 1.05, foco: [560, 840] }], [0.3, { zoom: 1.03, foco: [560, 880] }], [0.56, { zoom: 1.0, foco: [520, 920] }], [1, { zoom: 1.04, foco: [540, 900] }]]}
          golpes={[0.52]} pulsos={[0.3, 0.66]}>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <ellipse cx={PT.x + 600 * PT.s} cy={PT.y + 1505 * PT.s} rx={250} ry={30} fill={C.GRY} />
            <g transform="translate(44 1100)"><MU.Tacho s={1.1} tapa={tapa} /></g>
          </svg>
          <A.Pos x={PT.x} y={PT.y} e={M.pop(T, at - 0.6, 0.5)} dy={M.life(T, 3.6, 4)}>
            <TOR.Tor s={PT.s} pose={pose} flex={festeja} sinPiso parpadeo={V.parpadeo(T)} musc={{ bic: festeja }}
              boca={festeja > 0.3 ? 'sonrisa' : true} gesto={festeja > 0.3 ? null : { cejas: 'enojo' }} />
          </A.Pos>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {lanza < 1 ? vapeEn([vx, vy], ang, 0.8) : null}
            {lanza > 0.05 && lanza < 1 ? <V.Lineas c={[vx, vy]} dir={[-1, 0.4]} v={1} largo={120} /> : null}
            <V.Chispa T={T} c={[TACHO[0], TACHO[1] - 20]} cuando={f(0.52)} r={150} />
            {e2.opacity > 0.02 ? (
              <g opacity={e2.opacity} transform={'translate(176 1280) scale(' + e2.scale.toFixed(3) + ') translate(-176 -1280)'}>
                <circle cx={176} cy={1280} r={160} fill="none" stroke={C.RED} strokeWidth={26} />
                <path d="M 63 1167 L 289 1393" stroke={C.RED} strokeWidth={26} strokeLinecap="round" />
              </g>
            ) : null}
            {limpio.opacity > 0.02 ? (
              <g opacity={limpio.opacity} transform={'translate(190 620) scale(' + limpio.scale.toFixed(3) + ')'}>
                <g transform={'translate(-150 ' + (-150 + M.life(T, 3, 6)).toFixed(1) + ') scale(1.25)'}><N.ICONOS.pulmones s={1} /></g>
              </g>
            ) : null}
            <V.Brillo T={T} c={[190, 640]} r={150} color={C.GRN} v={clamp((T - f(0.74)) / 0.3, 0, 1)} />
            <V.Chispa T={T} c={enPT([600, 330])} cuando={f(0.76)} r={160} />
          </svg>
        </V.Camara>
        <A.Bien T={T} cuando={f(0.78)} x={860} y={600} s={0.85} />
        <V.Rot T={T} text="EL VAPE, A LA BASURA" y={290} s={1.05} cuando={at - 0.6} />
        <V.Rot T={T} text="RESPIRA LIBRE" y={1490} s={1.2} cuando={f(0.64)} fase={0.4} />
      </div>
    );
  }

  /* ---------------- escenas ---------------- */

  // particulas del aerosol que bajan a los pulmones
  function particulas(T, f, desde, v) {
    var ps = [];
    for (var i = 0; i < 16; i++) {
      var u = ((T * 0.5 + i / 16) % 1);
      var l = i % 2 ? 1 : -1;
      var x = desde[0] + l * (20 + 190 * azar(i, 3)) * Math.min(1, u * 2.2) + 10 * Math.sin(T * 3 + i);
      var y = desde[1] + 40 + 420 * u;
      var r = 7 + 6 * azar(i, 4);
      ps.push(i % 3 === 0
        ? <rect key={i} x={(x - r).toFixed(1)} y={(y - r).toFixed(1)} width={2 * r} height={2 * r} rx={3} fill={C.GRY} stroke={C.INK} strokeWidth={5} opacity={(v * (1 - u * u)).toFixed(2)} transform={'rotate(' + (T * 90 + i * 40).toFixed(0) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'} />
        : <circle key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} r={r} fill={i % 3 === 1 ? C.INK : C.RED} opacity={(v * (1 - u * u)).toFixed(2)} />);
    }
    return <g>{ps}</g>;
  }

  var PAQUETES = [[600, 400], [810, 380], [620, 620], [820, 600]];

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: 'No fumes más vape.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.38, foco: [580, 580] }], [1, { zoom: 1.03, foco: [540, 860] }]],
        golpes: TOSES,
        tor: { x: TG.x, s: TG.s, ojos: 'grandes', pose: poseVapea(),
          y: function (T, f) { return TG.y - 16 * Math.max(pulso(T, f(TOSES[0]), 0.22), pulso(T, f(TOSES[1]), 0.22)); },
          boca: function (T, f) { return T < f(0.1) ? 'o' : 'abierta'; },
          gesto: function (T) { return { pupila: 5, mirada: [8 * Math.sin(T * 5), 3], cejas: 'alzadas', boca: 0.8 }; },
          agarre: function (g) { return vapeEn([g.der.mano[0] - 40, g.der.mano[1] - 96], 24, 0.8); } },
        lienzo: function (T, f) {
          A.sonido('tos', f(TOSES[0]));
          A.sonido('tos', f(TOSES[1]));
          var v = animate({ from: 0, to: 1, start: f(0.1), end: f(0.5), ease: Easing.easeOutCubic })(T);
          var cab = enTG([600, 410]);
          var ojosV = clamp((v - 0.55) / 0.2, 0, 1);
          var mx = 9 * Math.sin(T * 5), abanica = 60 * Math.sin(T * 13);
          return (
            <g>
              {nube([cab[0], cab[1] + 70], T, v, { n: 12, r: 190, ancho: 330, alto: 300 })}
              {ojosV > 0 ? (
                <g opacity={ojosV}>
                  {[-22, 22].map(function (dx) {
                    return (
                      <g key={dx}>
                        <circle cx={cab[0] + dx * 1.05} cy={cab[1] - 2} r={17} fill={BLANCO} stroke={C.INK} strokeWidth={6} />
                        <circle cx={cab[0] + dx * 1.05 + mx} cy={cab[1]} r={5} fill={C.INK} />
                      </g>
                    );
                  })}
                  <circle cx={cab[0] - 250 + abanica} cy={cab[1] + 40 - 0.3 * abanica} r={38} fill={BLANCO} stroke={C.INK} strokeWidth={13} />
                  <V.Lineas c={[cab[0] - 250 + abanica, cab[1] + 40]} dir={[abanica > 0 ? 1 : -1, -0.3]} v={0.7} largo={70} />
                </g>
              ) : null}
            </g>
          );
        },
        mal: [{ x: 70, y: 1010, cuando: 0.24, s: 0.6 }, { x: 850, y: 1120, cuando: 0.46, s: 0.5 }],
        r1: { text: 'VAPE', s: 1.4, cuando: 0.02 },
        r2: { text: '¡COF, COF!', s: 1.25, cuando: 0.56 }
      }) },

    { nombre: 'No es vapor de agua', dur: 5.6, vo: 'No es vapor de agua: lleva nicotina, metales y partículas que llegan al fondo de tus pulmones.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 680] }], [0.6, { zoom: 1.0, foco: [540, 900] }], [1, { zoom: 1.04, foco: [540, 940] }]],
        piezas: [
          { C: N.ICONOS.pulmones, s: 2.2, x: 276, y: 540, p: function (T, f) { return { humo: animate({ from: 0, to: 1, start: f(0.2), end: f(0.7) })(T) }; } },
          { C: N.ICONOS.vape, s: 0.9, x: 432, y: 356, cuando: 0.04, quieto: true },
          { C: N.ICONOS.gota, s: 0.95, x: 60, y: 1080, cuando: 0.08 },
          { C: TOR.Tor, s: 0.36, x: 620, y: 890, cuando: 0.56,
            p: function (T, f) { return { boca: 'abierta', ojos: 'grandes', sinPiso: true, parpadeo: 0, gesto: { cejas: 'triste', pupila: 5, boca: 0.9 } }; } }
        ],
        lienzo: function (T, f) {
          return <g>{particulas(T, f, [540, 540], animate({ from: 0, to: 1, start: f(0.12), end: f(0.24) })(T))}</g>;
        },
        mal: [{ x: 96, y: 1104, cuando: 0.3, s: 0.72 }],
        r1: { text: 'NO ES VAPOR DE AGUA', s: 1.05, cuando: 0.04 },
        r2: { text: 'NICOTINA Y METALES', s: 1.15, cuando: 0.5 }
      }) },

    { nombre: 'Engancha', dur: 5, vo: 'Y engancha: un solo vape puede traer la nicotina de varias cajetillas de cigarros.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 700] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.36, 0.46, 0.56, 0.66],
        tor: { s: 0.44, x: 276, y: 800, ojos: 'espiral', boca: 'o', vibra: true, cuando: 0.5,
          pose: (function () { var p = TOR.pose({ flex: 0 }); p.der.codo = U.suma(G0.der.hombro, [96, 190]); p.der.mano = U.suma(G0.cabeza, [120, 150]); return p; })(),
          gesto: function (T) { return { giroOjos: T * 280 }; },
          agarre: function (g) { return vapeEn([g.der.mano[0] - 40, g.der.mano[1] - 96], 24, 0.8); } },
        piezas: [{ C: N.ICONOS.vape, s: 1.7, x: 40, y: 380 }].concat(PAQUETES.map(function (q, i) {
          return { C: N.ICONOS.cajetilla, s: 0.82, x: q[0], y: q[1], cuando: 0.36 + i * 0.1, fase: i * 0.2 };
        })),
        lienzo: function (T, f) {
          var e = M.pop(T, f(0.28), 0.4);
          return e.opacity > 0.02 ? (
            <g opacity={e.opacity} transform={'translate(500 600) scale(' + e.scale.toFixed(3) + ')'}>
              <path d="M -40 -20 L 40 -20 M -40 20 L 40 20" stroke={C.INK} strokeWidth={20} strokeLinecap="round" />
            </g>
          ) : null;
        },
        r1: { text: 'LA NICOTINA ENGANCHA', s: 1.05, cuando: 0.04 },
        r2: { text: '1 VAPE = VARIAS CAJETILLAS', s: 0.95, cuando: 0.5 }
      }) },

    { nombre: 'Tu cuerpo', dur: 4.6, vo: 'Resultado: más tos, el pulso acelerado y menos aire cuando entrenas.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.08, foco: [540, 760] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        golpes: [0.2, 0.5],
        tor: { s: 0.6, x: 180, y: 540, ojos: 'llanto',
          y: function (T, f) { return 540 - 16 * Math.max(pulso(T, f(0.2), 0.22), pulso(T, f(0.5), 0.22)); },
          boca: function (T, f) { return Math.max(pulso(T, f(0.2), 0.3), pulso(T, f(0.5), 0.3)) > 0.05 ? 'abierta' : 'ondulada'; },
          gesto: { cejas: 'triste' },
          extra: function (g, T, f) {
            A.sonido('tos', f(0.2));
            A.sonido('tos', f(0.5));
            var v = Math.max(pulso(T, f(0.2), 0.6), pulso(T, f(0.5), 0.6));
            return <g>{nube([g.cabeza[0] + 150, g.cabeza[1] + 90], T, v, { n: 6, r: 70, ancho: 110, alto: 80 })}<V.Gotas T={T} c={g.cabeza} v={1} /></g>;
          } },
        piezas: [
          { C: P.Corazon, s: 2.0, x: 50, y: 400, cuando: 0.1, p: function (T) { return { beat: 1 + 0.16 * Math.abs(Math.sin(T * 13)) }; } },
          { C: N.ICONOS.pulmones, s: 0.95, x: 800, y: 390, cuando: 0.3, p: { humo: 1 } },
          { C: P.Medidor, s: 0.8, x: 744, y: 650, cuando: 0.4, p: function (T, f) { return { p: animate({ from: 0.9, to: 0.22, start: f(0.46), end: f(0.82) })(T) }; } }
        ],
        lienzo: function (T, f) {
          // el pulso: un electro que se dibuja debajo del corazon
          var p = M.draw(T, f(0.14), 0.7), L = 520;
          return <path d="M 30 650 L 80 650 L 104 600 L 132 700 L 160 620 L 184 650 L 234 650 L 258 590 L 286 706 L 312 650 L 340 650" fill="none" stroke={C.RED} strokeWidth={12}
            strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />;
        },
        mal: [{ x: 850, y: 900, cuando: 0.62, s: 0.55 }],
        r1: { text: 'MÁS TOS Y MÁS PULSO', s: 1.05, cuando: 0.04 },
        r2: { text: 'MENOS AIRE AL ENTRENAR', s: 1.0, cuando: 0.5 }
      }) },

    { nombre: '¿Mejor que el cigarro?', dur: 5.6, vo: '¿Mejor que el cigarro? Quizá menos tóxico, pero engancha igual o más. Ninguno te conviene.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.05, foco: [540, 760] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        tor: { s: 0.46, x: 264, y: 790, boca: 'ondulada', gesto: { cejas: 'alzadas' },
          pose: (function () { var p = TOR.pose({ flex: 0 }); p.izq.codo = [330, 810]; p.izq.mano = [236, 660]; p.der.codo = [870, 810]; p.der.mano = [964, 660]; return p; })() },
        piezas: [
          { C: N.ICONOS.cajetilla, s: 1.4, x: 100, y: 450 },
          { C: N.ICONOS.vape, s: 1.4, x: 640, y: 450 }
        ],
        lienzo: function (T, f) {
          return (
            <g>
              {PL.versus(T, f, { y0: 400, y1: 820, yVs: 620 })}
              <V.Humo T={T} c={[268, 510]} v={1} alto={150} viento={-30} />
              {nube([850, 500], T, 0.8 + 0.2 * Math.sin(T * 2), { n: 6, r: 44, ancho: 80, alto: 40 })}
            </g>
          );
        },
        mal: [{ x: 196, y: 560, cuando: 0.56, s: 0.75 }, { x: 736, y: 560, cuando: 0.68, s: 0.75 }],
        r1: { text: '¿MEJOR QUE EL CIGARRO?', s: 1.0, cuando: 0.02 },
        r2: { text: 'NINGUNO ES SANO', s: 1.2, cuando: 0.66 }
      }) },

    { nombre: 'Al tacho', dur: 5, vo: 'Así que ya sabes: el vape, a la basura. Tus pulmones te lo van a agradecer.', C: EscTacho }
  ];

  global.REELS.registrar({
    id: 'vape', titulo: 'No fumes más vape (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿QUIÉN NO SUELTA EL VAPE?', vo: 'Mándaselo al amigo que no suelta el vape, y guarda este video.' }
  });
})(window);
