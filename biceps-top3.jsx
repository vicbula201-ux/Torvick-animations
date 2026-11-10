/* ============================================================
   LOS 3 MEJORES EJERCICIOS DE BICEPS SEGUN LA CIENCIA — reel de ~15 s, ESTILO 2
   Lo que dice la evidencia: el biceps crece mas cuando se lo entrena estirado
   (Pedrosa 2022, curl predicador con parciales en estiramiento; el curl
   inclinado y el de polea por detras ponen la cabeza larga en estiramiento).
   Los tres: curl inclinado con mancuernas, curl predicador y curl en polea
   por detras (bayesian). Antes del cierre, la escena de accion (comenta,
   comparte, guarda) que pidio el autor.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, V = global.V, PL = global.PL, TOR = global.TOR;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };

  var PISO = 1300;
  var BASE = B.posePerfil.depie({ x: 700, piso: PISO });

  /* ---------------- tres poses de perfil (mira a la izquierda) ---------------- */

  // sentado: cadera en el banco, las piernas adelante con los pies en el piso
  function piernasSentado(pose, cadera) {
    pose.rodilla = U.suma(cadera, [-270, 4]);
    pose.tobillo = U.suma(pose.rodilla, [-12, 264]);
    pose.punta = U.suma(pose.tobillo, [-112, 32]);
    pose.rodilla2 = U.suma(pose.rodilla, [16, -10]);
    pose.tobillo2 = U.suma(pose.tobillo, [18, -4]);
    pose.punta2 = U.suma(pose.punta, [18, -4]);
  }

  // 1. curl inclinado: respaldo a 45°, el brazo cuelga detras del tronco (biceps estirado)
  function inclinado(e) {
    var cadera = [760, 1010];
    var pose = Object.assign({}, BASE, { cadera: cadera, cuello: U.suma(cadera, U.polar(-52, 404)), curva: 0, cabeza: 30 });
    var g = B.geoPerfil({ pose: Object.assign({}, pose, { codo: cadera, mano: cadera }) });
    pose.codo = U.suma(g.hombro, U.polar(90, 232));
    pose.mano = U.suma(pose.codo, U.polar(90 + 150 * e, 214));
    pose.codo2 = U.suma(pose.codo, [14, -8]); pose.mano2 = U.suma(pose.mano, [14, -8]);
    piernasSentado(pose, cadera);
    return pose;
  }
  // 2. curl predicador: el brazo apoyado en el atril a 45°; el antebrazo sube
  function predicador(e) {
    var cadera = [800, 1020];
    var pose = Object.assign({}, BASE, { cadera: cadera, cuello: U.suma(cadera, U.polar(-100, 404)), curva: 0.1, cabeza: -6 });
    var g = B.geoPerfil({ pose: Object.assign({}, pose, { codo: cadera, mano: cadera }) });
    pose.codo = U.suma(g.hombro, U.polar(128, 232));
    pose.mano = U.suma(pose.codo, U.polar(128 + 138 * e, 214));
    pose.codo2 = U.suma(pose.codo, [12, -10]); pose.mano2 = U.suma(pose.mano, [12, -10]);
    piernasSentado(pose, cadera);
    return pose;
  }
  // 3. curl en polea por detras: de espaldas a la polea baja, el brazo atras del cuerpo
  function bayesian(e) {
    var cadera = [700, 730];
    var pose = Object.assign({}, BASE, { cadera: cadera, cuello: U.suma(cadera, U.polar(-96, 404)), cabeza: 4 });
    var g = B.geoPerfil({ pose: Object.assign({}, pose, { codo: cadera, mano: cadera }) });
    pose.codo = U.suma(g.hombro, U.polar(68, 232));
    pose.mano = U.suma(pose.codo, U.polar(68 + 148 * e, 214));
    pose.codo2 = U.suma(g.hombro, U.polar(94, 232)); pose.mano2 = U.suma(pose.codo2, U.polar(96, 214));
    pose.tobillo = [600, PISO - 32]; pose.punta = U.suma(pose.tobillo, [-112, 32]);
    pose.tobillo2 = [800, PISO - 32]; pose.punta2 = U.suma(pose.tobillo2, [-112, 32]);
    pose.rodilla = B.ik(cadera, pose.tobillo, 272, 268, -1);
    pose.rodilla2 = B.ik(U.suma(cadera, [14, -4]), pose.tobillo2, 272, 268, -1);
    return pose;
  }

  function biceps(g) { return U.suma(U.lerpP(g.hombro, g.codo, 0.55), [-24, 0]); }

  // el atril del predicador: una tabla acolchada bajo el brazo, del sobaco al codo
  function atril(g) {
    var d = U.unidad(U.resta(g.codo, g.hombro)), nd = [d[1], -d[0]];
    var s0 = U.suma(U.suma(g.hombro, U.por(d, 70)), U.por(nd, 44));
    var s1 = U.suma(U.suma(g.codo, U.por(d, 40)), U.por(nd, 44));
    return [s0, s1, U.suma(s1, U.por(nd, 66)), U.suma(s0, U.por(nd, 66))];
  }
  function Atril(props) {
    var q = atril(props.g);
    return <path d={'M ' + q.map(U.pt).join(' L ') + ' Z'} fill={C.GRY} {...LN} />;
  }

  function Banco(props) {
    // inclinado: respaldo a lo largo de la espalda; predicador: asiento + atril
    if (props.tipo === 'inclinado') {
      var a = U.suma([760, 1010], [70, 40]), b = U.suma(a, U.polar(-52, 520));
      return (
        <g>
          <path d={'M ' + U.pt(a) + ' L ' + U.pt(b)} stroke={C.INK} strokeWidth={80} strokeLinecap="round" />
          <path d={'M ' + U.pt(a) + ' L ' + U.pt(b)} stroke={C.GRY} strokeWidth={52} strokeLinecap="round" />
          <rect x={600} y={1040} width={300} height={48} rx={20} fill={C.GRY} {...LN} />
          <path d={'M 700 1088 L 680 ' + PISO + ' M 860 1088 L 900 ' + PISO + ' M ' + U.pt(U.suma(a, U.polar(-52, 300))) + ' L 980 ' + PISO} fill="none" {...LN} />
        </g>
      );
    }
    if (props.tipo === 'predicador') {
      // la pata del atril (detras de las piernas); el acolchado va en agarre
      var at = atril(props.g);
      var pie = U.lerpP(at[2], at[3], 0.5);
      return (
        <g>
          <path d={'M ' + U.pt(pie) + ' L ' + pie[0].toFixed(1) + ' ' + PISO + ' M ' + (pie[0] - 70).toFixed(1) + ' ' + PISO + ' L ' + (pie[0] + 70).toFixed(1) + ' ' + PISO} fill="none" {...LN} />
          <rect x={660} y={1050} width={280} height={48} rx={20} fill={C.GRY} {...LN} />
          <path d={'M 800 1098 L 800 ' + PISO} fill="none" {...LN} />
        </g>
      );
    }
    return null;
  }

  function Figura(props) {
    var e = Easing.easeInOutSine(clamp(props.e || 0, 0, 1));
    var pose = props.tipo === 'inclinado' ? inclinado(e) : props.tipo === 'predicador' ? predicador(e) : bayesian(e);
    var POLEA = [1110, 1220];
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, props.fase || 0)} musc={props.musc}
        fondo={function (g) {
          return (
            <g>
              <B.PisoG y={PISO + 4} x0={240} x1={1240} />
              <V.Sombra c={[720, PISO + 2]} rx={300} />
              <Banco tipo={props.tipo} g={g} />
              {props.tipo === 'bayesian' ? (
                <g>
                  <rect x={1120} y={160} width={60} height={PISO - 160} rx={16} fill={BLANCO} {...LN} />
                  <path d={'M ' + U.pt(U.suma(POLEA, [-8, -20])) + ' L ' + U.pt(g.mano)} stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
                  <circle cx={POLEA[0]} cy={POLEA[1]} r={28} fill={BLANCO} stroke={C.INK} strokeWidth={12} />
                </g>
              ) : null}
            </g>
          );
        }}
        agarre={function (g) {
          return props.tipo === 'inclinado' ? <B.MancuernaG c={g.mano} ang={0} giro={0} k={0.7} />
            : props.tipo === 'predicador' ? <Atril g={g} /> : null;
        }}
        children={function (g) {
          return (
            <g>
              {props.tipo !== 'inclinado' ? <circle cx={g.mano[0]} cy={g.mano[1]} r={22} fill={C.GRY} stroke={C.INK} strokeWidth={11} /> : null}
              {props.extra ? props.extra(g) : null}
            </g>
          );
        }} />
    );
  }

  var FIG = { x: -20, y: 250, s: 0.8 };
  function en(p) { return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s]; }

  // una escena por ejercicio: el numero, una repeticion y el brillo al estirar
  function escEjercicio(n, tipo, r1, r2, foco) {
    return V.escena({
      fig: FIG, pulsos: [0.55],
      tomas: [[0, { zoom: 1.12, foco: en(foco), mira: [540, 980] }], [1, { zoom: 1.3, foco: en(foco), mira: [540, 980] }]],
      figura: function (T, f, t, s) {
        var k = V.ida(V.fase(T, f(0.05), f(0.95), 1), 0.45, 0.12);
        return (
          <V.Estela T={T} n={3} paso={0.05} dibujar={function (Tx, fantasma) {
            var kx = V.ida(V.fase(Tx, f(0.05), f(0.95), 1), 0.45, 0.12);
            return <Figura T={Tx} s={s} tipo={tipo} e={kx} musc={{ bic: 0.4 + 0.6 * kx }}
              extra={fantasma ? null : function (g) {
                return <g><V.Brillo T={T} c={biceps(g)} r={70} v={1 - k} /><V.Chispa T={T} c={g.mano} cuando={f(0.5)} r={70} /></g>;
              }} />;
          }} />
        );
      },
      encima: function (T, f) {
        var A = global.REELS.ayudas;
        return (
          <A.Pos x={40} y={380} e={M.pop(T, f(0) - 0.6, 0.5)} dy={M.life(T, 3, 5)}>
            <B.Cuenta s={0.9} n={n} p={1} />
          </A.Pos>
        );
      },
      r1: { text: r1, s: 1.15, cuando: null },
      r2: { text: r2, cuando: 0.2 }
    });
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.6, vo: 'Los 3 mejores ejercicios de bíceps según la ciencia.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.25, foco: [540, 720] }], [1, { zoom: 1.04, foco: [540, 900] }]],
        pulsos: [0.3],
        tor: { boca: 'sonrisa', musc: { bic: 1 }, y: PL.FIG.y + 40,
          flex: function (T, f) { return 0.3 + 0.7 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T)); },
          extra: function (g, T, f) {
            return <g><V.Brillo T={T} c={g.izq.codo} r={90} v={1} /><V.Brillo T={T} c={g.der.codo} r={90} v={1} /></g>;
          } },
        piezas: [{ C: B.Cuenta, s: 1.1, x: 40, y: 1060, cuando: 0.3, p: { n: 3, p: 1 } }],
        r1: { text: 'TOP 3 BÍCEPS', s: 1.3, cuando: 0.02 },
        r2: { text: 'SEGÚN LA CIENCIA', cuando: 0.4 }
      }) },
    { nombre: '1. Curl inclinado', dur: 2, vo: 'Uno: curl inclinado, con el bíceps estirado.',
      C: escEjercicio(1, 'inclinado', 'CURL INCLINADO', 'BÍCEPS ESTIRADO', [700, 760]) },
    { nombre: '2. Curl predicador', dur: 2, vo: 'Dos: curl predicador, bien abajo.',
      C: escEjercicio(2, 'predicador', 'CURL PREDICADOR', 'BAJA HASTA ABAJO', [640, 820]) },
    { nombre: '3. Curl en polea', dur: 2, vo: 'Tres: curl en polea por detrás del cuerpo.',
      C: escEjercicio(3, 'bayesian', 'CURL EN POLEA', 'BRAZO ATRÁS', [760, 700]) }
  ];

  global.REELS.registrar({
    id: 'biceps-top3', titulo: 'Top 3 bíceps (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 3.3, vo: '¿Estás de acuerdo? Coméntalo, compártelo y guárdalo.' }
  });
})(window);
