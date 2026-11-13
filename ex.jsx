/* ============================================================
   EX — reel con Tor, ESTILO 2 (~36 s con la accion y el cierre)
   "No llores más por tu ex" (pedido del autor; es de "mándaselo a tu amigo
   despechado"): tema tabu + Tor en un estado ridiculo + cierre de parodia.
   - gancho: Tor en el sofa, llorando a mares con la manta y el pote de helado;
   - el despecho (estres) sube el cortisol y empeora el sueno y la comida:
     asi es mas facil perder musculo;
   - el chiste del gym: acordarte de tu ex es el mejor pre-entreno; por algo
     despues de una ruptura todos se vuelven adictos al gimnasio;
   - el consejo: usarlo a favor (entrenar), pero descansando, comiendo y
     durmiendo bien;
   - cierre: ve la foto de su ex, apaga el celular y se va a entrenar; queda
     el sofa vacio con el helado.
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
  var L1 = 198, L2 = 193;
  var BAJA = 250;                                  // lo que baja la cadera al sentarse (MU.poseSentado)

  function icono(Cmp, c, k, ang, props) {
    // un icono de N (240x240) centrado en c, dentro de un SVG
    return (
      <g transform={'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + (ang || 0).toFixed(1) + ') scale(' + k + ') translate(-120 -120)'}>
        <Cmp s={1} {...(props || {})} />
      </g>
    );
  }
  // lagrimas de caricatura: dos chorros que salen de los ojos hacia los costados
  function lagrimas(g, T, v) {
    if (v < 0.02) return null;
    var gotas = [];
    [-1, 1].forEach(function (l) {
      for (var i = 0; i < 5; i++) {
        var u = ((T * 1.5 + i / 5 + (l > 0 ? 0.1 : 0)) % 1);
        var x = g.cabeza[0] + l * (34 + 210 * u), y = g.cabeza[1] - 4 - 110 * u + 470 * u * u;
        var a = Math.atan2(940 * u - 110, l * 210) * 180 / Math.PI - 90;
        gotas.push(
          <g key={l + '-' + i} transform={'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + a.toFixed(1) + ') scale(' + (0.8 - 0.25 * u).toFixed(2) + ')'} opacity={v * (1 - u * u * u)}>
            <path d="M 0 -26 C 12 -8 16 4 16 10 C 16 20 8 26 0 26 C -8 26 -16 20 -16 10 C -16 4 -12 -8 0 -26 Z" fill={BLANCO} stroke={C.INK} strokeWidth={8} strokeLinejoin="round" />
          </g>
        );
      }
    });
    return <g>{gotas}</g>;
  }
  // panuelo usado (un bollito) en el piso
  function bollito(x, y, k, giro) {
    return (
      <g key={x + '-' + y} transform={'translate(' + x + ' ' + y + ') rotate(' + (giro || 0) + ') scale(' + k + ')'}>
        <path d="M -34 6 Q -40 -22 -14 -28 Q 4 -44 24 -26 Q 44 -14 34 10 Q 30 32 4 30 Q -22 36 -34 6 Z" fill={BLANCO} stroke={C.INK} strokeWidth={10} strokeLinejoin="round" />
        <path d="M -14 -6 Q -2 2 8 -10 M -4 14 Q 8 8 18 16" fill="none" stroke={C.GRY} strokeWidth={7} strokeLinecap="round" />
      </g>
    );
  }
  // celular chico: roto 0..1 muestra el corazon roto; apagado lo deja gris
  function celular(c, ang, k, op) {
    op = op || {};
    return (
      <g transform={'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + (ang || 0).toFixed(1) + ') scale(' + k + ')'}>
        <rect x={-82} y={-140} width={164} height={280} rx={28} fill={BLANCO} {...LN} />
        <rect x={-62} y={-112} width={124} height={204} rx={10} fill={op.apagado ? C.GRY : BLANCO} stroke={C.INK} strokeWidth={9} />
        {op.apagado ? null : op.foto ? (
          <g>
            <circle cx={0} cy={-46} r={30} fill={C.YEL} stroke={C.INK} strokeWidth={9} />
            <path d="M -48 70 Q -48 2 0 -2 Q 48 2 48 70 Z" fill={C.YEL} stroke={C.INK} strokeWidth={9} strokeLinejoin="round" />
          </g>
        ) : (
          <g transform="translate(-54 -66) scale(0.45)"><N.ICONOS.corazonRoto s={1} k={op.roto == null ? 1 : op.roto} /></g>
        )}
        <circle cx={0} cy={116} r={11} fill={BLANCO} stroke={C.INK} strokeWidth={7} />
      </g>
    );
  }

  /* ---------------- gancho: en el sofa, a moco tendido ---------------- */

  var TS = { x: 72, y: 190, s: 0.78 };
  function poseHelado(T) {
    var p = MU.poseSentado({ baja: BAJA });
    var k = Math.pow(Math.max(0, Math.sin(T * 2.6)), 2);            // la cuchara va a la boca
    p.izq.codo = [398, 1090]; p.izq.mano = [470, 1160];
    p.der.mano = U.lerpP([640, 1110], [650, 800], k);
    p.der.codo = B.ik([772, 626 + BAJA], p.der.mano, L1, L2, 1);
    p._k = k;
    return p;
  }

  /* ---------------- cortisol: la barra que sube ---------------- */

  function barraCortisol(T, f) {
    var e = M.pop(T, f(0.08), 0.42);
    if (e.opacity < 0.02) return null;
    var p = animate({ from: 0.2, to: 0.95, start: f(0.14), end: f(0.5), ease: Easing.easeInOutCubic })(T);
    var alto = 420 * p;
    return (
      <g opacity={e.opacity} transform={'translate(150 ' + (760 + M.life(T, 3, 5)).toFixed(1) + ') scale(' + e.scale.toFixed(3) + ')'}>
        <rect x={-50} y={-230} width={100} height={460} rx={34} fill={BLANCO} {...LN} />
        <rect x={-30} y={210 - alto} width={60} height={alto} rx={22} fill={C.RED} />
        <path d={'M 110 ' + (120 - 240 * p).toFixed(1) + ' l 0 -110 m -44 44 l 44 -46 l 44 46'} fill="none" stroke={C.RED} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }

  /* ---------------- pre-entreno: la rabia mueve la barra ---------------- */

  var G0 = B.geoFrente({ pose: TOR.pose({ flex: 0 }) });
  function posePress(k) {
    var p = TOR.pose({ flex: 0 }), y = U.lerp(560, 250, k);
    p.izq.mano = [372, y]; p.der.mano = [828, y];
    p.izq.codo = B.ik(G0.izq.hombro, p.izq.mano, L1, L2, 1);
    p.der.codo = B.ik(G0.der.hombro, p.der.mano, L1, L2, -1);
    return p;
  }
  function poseMiraCelular() {
    var p = TOR.pose({ flex: 0 });
    p.der.codo = [812, 850]; p.der.mano = [716, 704];
    return p;
  }
  function vapor(g, T, v) {
    // el humo que sale por las orejas
    return (
      <g>
        <V.Humo T={T * 2.4} c={[g.cabeza[0] - 96, g.cabeza[1] - 6]} v={v} alto={200} viento={-150} />
        <V.Humo T={T * 2.4 + 1} c={[g.cabeza[0] + 96, g.cabeza[1] - 6]} v={v} alto={200} viento={150} />
      </g>
    );
  }

  /* ---------------- semana entera en el gym ---------------- */

  function semanaGym(T, f) {
    var dias = [];
    for (var i = 0; i < 7; i++) {
      var e = i === 0 ? M.pop(T, f(0) - 0.6, 0.5) : M.pop(T, f(0.04 + i * 0.05), 0.4);
      if (e.opacity < 0.02) continue;
      var x = 96 + (i % 4) * 228 + (i > 3 ? 114 : 0), y = i > 3 ? 660 : 450;
      var hecho = clamp((T - f(0.34 + i * 0.06)) / 0.25, 0, 1);
      dias.push(
        <g key={i} opacity={e.opacity} transform={'translate(' + (x + 100) + ' ' + (y + 90 + M.life(T, 3, 5, i * 0.2)).toFixed(1) + ') scale(' + e.scale.toFixed(3) + ')'}>
          <rect x={-94} y={-86} width={188} height={172} rx={28} fill={hecho > 0 ? C.YEL : BLANCO} {...LN} strokeWidth={13} />
          <g transform="translate(-76 -30) scale(0.36)"><P.Pesa s={1} /></g>
          {hecho > 0 ? (
            <g transform={'translate(62 56) scale(' + Easing.easeOutBack(hecho).toFixed(3) + ')'}>
              <circle cx={0} cy={0} r={32} fill={C.GRN} stroke={C.INK} strokeWidth={9} />
              <path d="M -14 1 L -3 12 L 15 -10" fill="none" stroke={BLANCO} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          ) : null}
        </g>
      );
    }
    return <g>{dias}</g>;
  }

  /* ---------------- cierre: apaga el celular y se va a entrenar ---------------- */

  var TF = { x: 72, y: 190, s: 0.78 };
  function EscCierre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var apaga = T >= f(0.3);                                   // aprieta el boton
    var tira = clamp((T - f(0.36)) / (f(0.48) - f(0.36)), 0, 1);       // tira el celular al sofa
    var para = animate({ from: 0, to: 1, start: f(0.46), end: f(0.56), ease: Easing.easeOutBack })(T);   // se levanta
    var sale = Easing.easeInCubic(clamp((T - f(0.62)) / (f(0.84) - f(0.62)), 0, 1));                 // se va
    A.sonido('pop', f(0.3));
    A.sonido('whoosh', f(0.62));
    var sentado = MU.poseSentado({ baja: BAJA });
    sentado.izq.codo = [446, 920 + BAJA]; sentado.izq.mano = [530, 800 + BAJA];
    sentado.der.codo = [754, 920 + BAJA]; sentado.der.mano = [670, 800 + BAJA];
    var parado = TOR.pose({ flex: 0 });
    parado.der.codo = [800, 830]; parado.der.mano = [790, 1010];
    var pose = para > 0.02 ? B.poseFrente.mezclar(sentado, parado, clamp(para, 0, 1)) : sentado;
    var triste = !apaga;
    var paso = sale > 0 ? 18 * Math.abs(Math.sin(T * 16)) : 0;
    var enSofa = function (p) { return [TF.x + p[0] * TF.s, TF.y + p[1] * TF.s]; };
    // el celular: en las manos; despues vuela al almohadon de la izquierda
    var cel0 = [600, 730 + BAJA], cel1 = [330, 1150];
    var cc = [U.lerp(cel0[0], cel1[0], tira), U.lerp(cel0[1], cel1[1], tira) - 260 * Math.sin(Math.PI * tira)];
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} tomas={[[0, { zoom: 1.36, foco: [540, 900] }], [0.34, { zoom: 1.3, foco: [540, 900] }], [0.6, { zoom: 1.02, foco: [540, 900] }], [1, { zoom: 1.06, foco: [540, 900] }]]}
          pulsos={[0.3, 0.56]}>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <g transform={'translate(' + TF.x + ' ' + TF.y + ') scale(' + TF.s + ')'}>
              {MU.sofa()}
              {icono(N.ICONOS.panuelos, [930, 1100], 0.9, 6)}
              {icono(N.ICONOS.helado, [720, 1030 + 6 * Math.sin(T * 2)], 0.9, -8)}
              {tira >= 1 ? celular(cel1, -24, 0.8, { apagado: true }) : null}
            </g>
            {bollito(150, 1420, 1, 20)}{bollito(300, 1466, 0.8, -30)}{bollito(900, 1440, 0.9, 60)}
          </svg>
          {sale < 1 ? (
            <A.Pos x={TF.x + 1100 * sale} y={TF.y - paso} e={M.pop(T, at - 0.6, 0.5)} dy={M.life(T, 3.6, 4)}>
              <TOR.Tor s={TF.s} pose={pose} sinPiso parpadeo={triste ? 0 : V.parpadeo(T)}
                ojos={triste ? 'grandes' : undefined} boca={triste ? 'ondulada' : para > 0.5 ? 'sonrisa' : true}
                gesto={triste ? { cejas: 'triste', mirada: [0, 9], pupila: 8 } : { cejas: para > 0.3 ? 'enojo' : null }}
                musc={{ bic: para }}
                agarre={function (g) {
                  return (
                    <g>
                      {tira < 1 ? celular(tira > 0 ? cc : cel0, -24 * tira + 300 * tira * (1 - tira), 0.8, { foto: !apaga, apagado: apaga }) : null}
                      {para > 0.6 ? <B.MancuernaG c={g.der.mano} ang={0} giro={0} k={0.7} /> : null}
                    </g>
                  );
                }}
                extra={function (g) {
                  return (
                    <g>
                      {triste ? lagrimas(g, T * 0.5, 0.5) : null}
                      {sale > 0.02 ? <V.Lineas c={[g.centro[0] - 120, g.centro[1] - 200]} dir={[1, 0]} v={1} largo={200} /> : null}
                    </g>
                  );
                }} />
            </A.Pos>
          ) : null}
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <V.Chispa T={T} c={enSofa([600, 700 + BAJA])} cuando={f(0.3)} r={150} />
          </svg>
        </V.Camara>
        <A.Bien T={T} cuando={f(0.86)} x={800} y={520} s={0.9} />
        <V.Rot T={T} text="¿SU FOTO?" y={280} s={1.3} cuando={at - 0.6} />
        <V.Rot T={T} text="¡A ENTRENAR!" y={1490} s={1.25} cuando={f(0.56)} fase={0.4} />
      </div>
    );
  }

  /* ---------------- escenas ---------------- */

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: 'No llores más por tu ex.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.42, foco: [540, 760] }], [1, { zoom: 1.02, foco: [540, 900] }]],
        tor: { x: TS.x, y: TS.y, s: TS.s, ojos: 'llanto',
          pose: function (T) { return poseHelado(T); },
          boca: function (T) { return poseHelado(T)._k > 0.75 ? 'llena' : 'abierta'; },
          gesto: function (T) { return { cejas: 'triste', boca: 1.15 + 0.2 * Math.sin(T * 9), giro: 4 * Math.sin(T * 2.4) }; },
          fondo: function () {
            return <g>{MU.sofa()}{icono(N.ICONOS.panuelos, [900, 1090], 0.95, 6)}{celular([300, 1130], -22, 0.8, { roto: 1 })}</g>;
          },
          agarre: function (g, T) {
            var cuchara = g.der.mano;
            return (
              <g>
                {MU.mantaSofa()}
                {icono(N.ICONOS.helado, [g.izq.mano[0] + 56, g.izq.mano[1] - 70], 1.0, -6)}
                <path d={'M ' + U.pt(cuchara) + ' l -34 -86'} stroke={C.INK} strokeWidth={22} strokeLinecap="round" />
                <path d={'M ' + U.pt(cuchara) + ' l -34 -86'} stroke={C.GRY} strokeWidth={8} strokeLinecap="round" />
                <ellipse cx={cuchara[0] - 40} cy={cuchara[1] - 104} rx={24} ry={30} fill={BLANCO} stroke={C.INK} strokeWidth={10} transform={'rotate(-22 ' + (cuchara[0] - 40) + ' ' + (cuchara[1] - 104) + ')'} />
              </g>
            );
          },
          extra: function (g, T, f) {
            A.sonido('llanto', f(0.1));
            return lagrimas(g, T, 1);
          } },
        lienzo: function () { return <g>{bollito(140, 1420, 1, 20)}{bollito(290, 1470, 0.8, -30)}{bollito(910, 1440, 0.9, 60)}{bollito(780, 1480, 0.7, 10)}</g>; },
        mal: [{ x: 70, y: 430, cuando: 0.22, s: 0.6 }, { x: 860, y: 560, cuando: 0.46, s: 0.5 }],
        r1: { text: 'TU EX', s: 1.35, cuando: 0.02 },
        r2: { text: '¡BUAAA!', s: 1.25, cuando: 0.3 }
      }) },

    { nombre: 'Cortisol', dur: 5, vo: 'El despecho te sube el cortisol, duermes peor y comes peor: así se pierde músculo.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.06, foco: [540, 760] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        tor: { s: 0.6, x: 240, y: 540,
          boca: 'triste', gesto: { cejas: 'triste' },
          musc: function (T, f) { return { bic: 1 - animate({ from: 0, to: 1, start: f(0.5), end: f(0.8) })(T) }; },
          muscGris: function (T, f) { return { bic: animate({ from: 0, to: 1, start: f(0.5), end: f(0.8) })(T) }; },
          flex: function (T, f) { return 1 - 0.55 * animate({ from: 0, to: 1, start: f(0.5), end: f(0.85), ease: Easing.easeInOutCubic })(T); },
          extra: function (g, T, f) { return <V.Gotas T={T} c={g.cabeza} v={animate({ from: 0, to: 1, start: f(0.5), end: f(0.6) })(T)} />; } },
        piezas: [
          { C: N.ICONOS.luna, s: 0.8, x: 850, y: 400, cuando: 0.26 },
          { C: N.ICONOS.helado, s: 0.8, x: 850, y: 640, cuando: 0.4 }
        ],
        lienzo: function (T, f) { return barraCortisol(T, f); },
        mal: [{ x: 880, y: 430, cuando: 0.32, s: 0.5 }, { x: 880, y: 670, cuando: 0.46, s: 0.5 }],
        r1: { text: 'SUBE EL CORTISOL', s: 1.15, cuando: 0.04 },
        r2: { text: 'BAJA EL MÚSCULO', s: 1.15, cuando: 0.56 }
      }) },

    { nombre: 'Pre-entreno', dur: 5, vo: 'Aunque dicen que acordarte de tu ex es el mejor pre-entreno que existe.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.3, foco: [600, 700] }], [0.3, { zoom: 1.24, foco: [600, 700] }], [0.5, { zoom: 1.0, foco: [540, 880] }], [1, { zoom: 1.05, foco: [540, 860] }]],
        pulsos: [0.3, 0.52, 0.7, 0.88],
        tor: { s: 0.62, x: 168, y: 500,
          pose: function (T, f) { return T < f(0.34) ? poseMiraCelular() : posePress(V.ida(V.fase(T, f(0.4), f(0.96), 3), 0.35, 0.15)); },
          ojos: function (T, f) { return T < f(0.22) ? 'grandes' : undefined; },
          boca: function (T, f) { return T < f(0.22) ? 'ondulada' : 'dientes'; },
          gesto: function (T, f) {
            var r = animate({ from: 0, to: 1, start: f(0.2), end: f(0.34) })(T);
            return T < f(0.22) ? { cejas: 'triste', mirada: [10, 8] } : { cejas: 'enojo', cara: { color: C.RED, v: 0.75 * r } };
          },
          musc: function (T, f) { return T < f(0.34) ? null : { delt: 1, bic: 1, pec: 0.6 }; },
          agarre: function (g, T, f) { return T < f(0.34) ? celular([g.der.mano[0] - 20, g.der.mano[1] - 70], 8, 0.62, { foto: true }) : null; },
          extra: function (g, T, f) {
            var r = animate({ from: 0, to: 1, start: f(0.22), end: f(0.34) })(T);
            var k = T < f(0.34) ? 0 : V.ida(V.fase(T, f(0.4), f(0.96), 3), 0.35, 0.15);
            return (
              <g>
                {vapor(g, T, r)}
                {T >= f(0.34) ? <B.BarraLibreG vista="frente" c={U.lerpP(g.izq.mano, g.der.mano, 0.5)} k={0.86} r={170} /> : null}
                {T >= f(0.34) ? <g><V.Brillo T={T} c={g.izq.codo} r={80} v={k} /><V.Brillo T={T} c={g.der.codo} r={80} v={k} /></g> : null}
              </g>
            );
          } },
        piezas: [
          { C: N.ICONOS.fuego, s: 0.9, x: 40, y: 1090, cuando: 0.36, fase: 0.1 },
          { C: N.ICONOS.fuego, s: 0.7, x: 850, y: 1170, cuando: 0.44, fase: 0.5 },
          { C: N.ICONOS.bote, s: 0.85, x: 60, y: 400, cuando: 0.5, p: { color: C.RED } }
        ],
        r1: { text: 'EL MEJOR PRE-ENTRENO', s: 1.0, cuando: 0.16 },
        r2: { text: '¡GRACIAS, EX!', s: 1.25, cuando: 0.56 }
      }) },

    { nombre: 'Adictos al gym', dur: 4.6, vo: 'Por algo, después de una ruptura, todos se vuelven adictos al gimnasio.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.05, foco: [540, 700] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.76],
        tor: { s: 0.44, x: 276, y: 800, cuando: 0.3, boca: 'dientes', gesto: { cejas: 'enojo' }, musc: { bic: 1 },
          flex: function (T, f) { return 0.4 + 0.6 * V.ida(V.fase(T, f(0.36), f(0.98), 3), 0.4, 0.2); },
          extra: function (g, T, f) {
            var k = V.ida(V.fase(T, f(0.36), f(0.98), 3), 0.4, 0.2);
            return <g><V.Brillo T={T} c={g.izq.codo} r={90} v={k} /><V.Brillo T={T} c={g.der.codo} r={90} v={k} /></g>;
          } },
        lienzo: function (T, f) { return semanaGym(T, f); },
        r1: { text: 'MODO RUPTURA', s: 1.25, cuando: 0.02 },
        r2: { text: 'GYM LOS 7 DÍAS', s: 1.15, cuando: 0.6 }
      }) },

    { nombre: 'Úsalo a tu favor', dur: 4.8, vo: 'Úsalo a tu favor: entrena con todo, pero descansa, come bien y duerme.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.08, foco: [540, 800] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.3],
        tor: { s: 0.62, x: 168, y: 470, boca: 'sonrisa', musc: { bic: 1 },
          flex: function (T, f) { return 0.3 + 0.7 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.06), end: f(0.3) })(T)); },
          extra: function (g, T, f) { return <V.Chispa T={T} c={g.cabeza} cuando={f(0.3)} r={190} />; } },
        piezas: [
          { C: P.Pesa, s: 0.5, x: 30, y: 430, cuando: 0.2 },
          { C: N.ICONOS.luna, s: 0.85, x: 836, y: 400, cuando: 0.42 },
          { C: N.COMIDA.pollo, s: 0.7, plato: 0.62, x: 20, y: 1130, cuando: 0.56 },
          { C: N.ICONOS.calendario, s: 0.9, x: 830, y: 1150, cuando: 0.68 }
        ],
        bien: [{ x: 850, y: 760, cuando: 0.78, s: 0.7 }],
        r1: { text: 'ÚSALO A TU FAVOR', s: 1.15, cuando: 0.04 },
        r2: { text: 'ENTRENA, COME Y DUERME', s: 1.0, cuando: 0.5 }
      }) },

    { nombre: 'A entrenar', dur: 5.2, vo: 'Y cuando veas su foto... apaga el celular, y a entrenar.', C: EscCierre }
  ];

  global.REELS.registrar({
    id: 'ex', titulo: 'No llores más por tu ex (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿CONOCES A UN DESPECHADO?', vo: 'Mándaselo a ese amigo despechado, y guarda este video.' }
  });
})(window);
