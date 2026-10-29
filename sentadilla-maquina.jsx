/* ============================================================
   SENTADILLA EN MAQUINA (Smith) — reel corto, ESTILO 2 (~34 s con el cierre)
   Fuente: libro, pag. 135. La barra a la altura adecuada, apoyada en los
   hombros; pies al ancho de los hombros y en linea con la barra. Bajar
   como sentandose en una silla, con el pecho arriba, y subir empujando con
   los talones. Cuadriceps y gluteo mayor (principales); isquiotibiales,
   gemelos y aductores; abdomen y erectores estabilizan.
   Errores del libro: arquear la espalda, los pies demasiado adelante y el
   valgo (se usan los dos que se leen de perfil).
   Mejoras de esta tanda: estela de movimiento (V.Estela), contador de
   repeticiones, la silla punteada detras de la cadera y los errores con una
   sola figura grande que pasa de mal a bien.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, V = global.V;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };

  /* ---------------- de perfil en la maquina Smith (mira a la izquierda) ---------------- */

  var PISO = 1300;
  var BX = 760;                         // la barra sube y baja por esta vertical (los rieles)
  var BASE = B.posePerfil.depie({ x: 700, piso: PISO });
  var ARRIBA_BARRA = [40, -38];         // la barra apoyada sobre los hombros (detras del cuello)

  // p 0 de pie .. 1 abajo (muslos paralelos); pies 0 bajo la barra .. 1 muy adelante;
  // arco 0..1 arquea la espalda (el error)
  function smith(p, pies, arco) {
    pies = pies || 0; arco = arco || 0;
    var e = Easing.easeInOutSine(clamp(p, 0, 1));
    var A = [770 - 170 * pies, PISO - 32];
    var fi = U.lerp(4, 30, e) * (1 - 0.7 * pies);
    var K = U.suma(A, U.polar(-90 - fi, 268));
    var H = U.suma(K, U.polar(U.lerp(-88, -4, e), 272));
    // el tronco se inclina lo justo para que la barra quede en su vertical
    var sl = clamp((H[0] + ARRIBA_BARRA[0] - BX) / 330, -0.5, 0.85), pose, g;
    for (var i = 0; i < 3; i++) {
      var lean = Math.asin(sl) * 180 / Math.PI;
      pose = Object.assign({}, BASE, {
        cadera: H, cuello: U.suma(H, U.polar(-90 - lean + 10 * arco, 404)),
        curva: -0.65 * arco, cabeza: U.lerp(0, -12, e) + 8 * arco
      });
      g = B.geoPerfil({ pose: Object.assign({}, pose, { codo: H, mano: H }) });
      sl = clamp(sl + (g.hombro[0] + ARRIBA_BARRA[0] - BX) / 330, -0.5, 0.85);
    }
    var barra = [BX, g.hombro[1] + ARRIBA_BARRA[1]];
    // el agarre es mas ancho que los hombros: de perfil el brazo se ve corto, con el codo hacia abajo
    var mano = U.suma(barra, [-14, 10]);
    pose.codo = U.suma(g.hombro, U.polar(70, 150));
    pose.mano = mano;
    pose.codo2 = U.suma(pose.codo, [12, -8]); pose.mano2 = U.suma(mano, [10, -6]);
    pose.tobillo = A; pose.punta = U.suma(A, [-112, 32]); pose.rodilla = K;
    var A2 = U.suma(A, [26, 0]);
    pose.tobillo2 = A2; pose.punta2 = U.suma(A2, [-112, 32]);
    pose.rodilla2 = B.ik(U.suma(H, [14, -4]), A2, 272, 268, -1);
    pose._barra = barra;
    return pose;
  }

  function Maquina(props) {
    var b = props.barra;
    var ganchos = [];
    for (var y = 220; y < PISO - 100; y += 130) {
      ganchos.push(<path key={y} d={'M 500 ' + y + ' L 530 ' + (y - 14) + ' M 1060 ' + y + ' L 1030 ' + (y - 14)} stroke={C.INK} strokeWidth={10} strokeLinecap="round" />);
    }
    return (
      <g>
        <B.PisoG y={PISO + 4} x0={380} x1={1160} />
        <V.Sombra c={[720, PISO + 2]} rx={260} />
        {/* parantes, travesano y el riel por donde corre la barra */}
        <rect x={450} y={40} width={50} height={PISO - 40} rx={12} fill={BLANCO} {...LN} />
        <rect x={1060} y={40} width={50} height={PISO - 40} rx={12} fill={BLANCO} {...LN} />
        <rect x={430} y={20} width={700} height={50} rx={14} fill={BLANCO} {...LN} />
        {ganchos}
        <path d={'M ' + BX + ' 70 L ' + BX + ' ' + PISO} stroke={C.INK} strokeWidth={12} />
        <path d={'M ' + BX + ' 70 L ' + BX + ' ' + PISO} stroke={C.GRY} strokeWidth={4} />
        {/* disco del lado de atras */}
        <circle cx={b[0]} cy={b[1]} r={118} fill={props.disco || C.GRY} stroke={C.INK} strokeWidth={14} />
        <circle cx={b[0]} cy={b[1]} r={70} fill="none" stroke={C.INK} strokeWidth={8} opacity={0.5} />
      </g>
    );
  }

  function Smith(props) {
    var pose = smith(props.p || 0, props.pies, props.arco);
    var b = pose._barra;
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, props.fase || 0)}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () { return <g>{props.silla ? props.silla : null}<Maquina barra={b} disco={props.disco} /></g>; }}
        children={function (g) {
          return (
            <g>
              <circle cx={b[0]} cy={b[1]} r={24} fill={C.GRY} stroke={C.INK} strokeWidth={11} />
              {props.extra ? props.extra(g, b) : null}
            </g>
          );
        }} />
    );
  }

  // la silla punteada donde "se sienta" (la cadera abajo)
  function Silla(props) {
    var H = smith(1).cadera, e = props.e;
    if (e < 0.02) return null;
    var y = H[1] + 72, x0 = H[0] - 90, x1 = H[0] + 150;
    return (
      <g opacity={e} fill="none" stroke={C.GRY} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="22 20">
        <path d={'M ' + x0 + ' ' + y + ' L ' + x1 + ' ' + y + ' L ' + x1 + ' ' + (y - 330)} />
        <path d={'M ' + (x0 + 20) + ' ' + y + ' L ' + (x0 + 20) + ' ' + PISO + ' M ' + (x1 - 10) + ' ' + y + ' L ' + (x1 - 10) + ' ' + PISO} />
      </g>
    );
  }

  function vertical(b, color, hasta) {
    return <B.Puntos pts={[[b[0], b[1] + 40], [b[0], hasta || PISO - 6]]} color={color} sw={13} p={1} />;
  }
  function cuad(g) { return U.lerpP(g.cadera, g.rodilla, 0.55); }

  /* ---------------- encuadre ---------------- */

  var FIG = { x: -129, y: 314, s: 0.88 };
  function en(p) { return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s]; }
  var GEN = { zoom: 1, foco: en([760, 670]), mira: [540, 900] };

  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.42 : va, 0.12); }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tu sentadilla en máquina.',
      C: V.escena({
        fig: FIG, vibra: true,
        tomas: [[0, { zoom: 1.3, foco: en([740, 760]), mira: [540, 940] }], [1, { zoom: 1.04, foco: en([760, 700]), mira: [540, 900] }]],
        figura: function (T, f, t, s) {
          var k = 0.3 + 0.6 * reps(T, f(0), f(1), 2, 0.4);
          return <Smith T={T} s={s} p={k} pies={1} arco={1} muscRojo={{ erec: 1 }}
            extra={function (g) { return <V.Gotas T={T} c={g.centroCabeza} v={1} />; }} />;
        },
        mal: [{ x: 120, y: 500, cuando: 0.2, s: 0.6 }, { x: 830, y: 1150, cuando: 0.44, s: 0.5 }],
        r1: { text: 'SENTADILLA EN MÁQUINA', s: 1.1, cuando: 0.02 }
      }) },

    { nombre: 'Posición', dur: 5.5, vo: 'Barra apoyada en los hombros y pies al ancho de los hombros, en línea con la barra.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, GEN], [0.16, { zoom: 2, foco: en([760, 300]), mira: [540, 1000] }],
          [0.44, { zoom: 2, foco: en([760, 300]), mira: [540, 1000] }], [0.6, { zoom: 1.6, foco: en([700, 1100]), mira: [540, 1100] }],
          [0.86, { zoom: 1.6, foco: en([700, 1100]), mira: [540, 1100] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var hom = animate({ from: 0, to: 1, start: f(0.14), end: f(0.26) })(T);
          var pie = M.draw(T, f(0.58), 0.5);
          return <Smith T={T} s={s} p={0}
            extra={function (g, b) {
              return (
                <g>
                  <B.Anillo c={b} r={74} color={C.YEL} p={hom} />
                  {pie > 0.02 ? <B.Puntos pts={[[b[0], b[1] + 40], [b[0], PISO - 6]]} color={C.GRN} sw={13} p={pie} /> : null}
                  <B.Anillo c={U.lerpP(g.tobillo, g.punta, 0.45)} r={74} color={C.YEL} p={animate({ from: 0, to: 1, start: f(0.66), end: f(0.76) })(T)} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 600, cuando: 0.3 }, { x: 860, y: 600, cuando: 0.78 }],
        r1: { text: 'BARRA EN LOS HOMBROS', cuando: 0.12 },
        r2: { text: 'PIES BAJO LA BARRA', cuando: 0.6 }
      }) },

    { nombre: 'Ejecución', dur: 6, vo: 'Baja como si te sentaras en una silla, con el pecho arriba, y sube empujando con los talones.',
      C: V.escena({
        fig: FIG, pulsos: [0.52, 0.95],
        tomas: [[0, GEN], [0.3, { zoom: 1.25, foco: en([800, 820]), mira: [540, 960] }], [0.8, { zoom: 1.25, foco: en([800, 820]), mira: [540, 960] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var silla = animate({ from: 0, to: 1, start: f(0.08), end: f(0.18) })(T);
          return (
            <V.Estela T={T} n={3} paso={0.07} dibujar={function (Tx, fantasma) {
              var k = reps(Tx, f(0.04), f(0.96), 2);
              return <Smith T={Tx} s={s} p={k} musc={{ cuad: 0.3 + 0.7 * k, glu: 0.3 + 0.7 * k }}
                silla={fantasma ? null : <Silla e={silla} />}
                extra={fantasma ? null : function (g, b) {
                  return (
                    <g>
                      {k > 0.9 ? <B.Puntos pts={[g.cadera, U.suma(g.cuello, [0, -30])]} color={C.GRN} sw={13} p={1} /> : null}
                      <V.Chispa T={T} c={[b[0], b[1] - 40]} cuando={f(0.52)} r={90} />
                      <V.Chispa T={T} c={[b[0], b[1] - 40]} cuando={f(0.95)} r={90} />
                    </g>
                  );
                }} />;
            }} />
          );
        },
        encima: function (T, f) {
          var A = global.REELS.ayudas;
          var u = clamp((T - f(0.04)) / (f(0.96) - f(0.04)), 0, 1) * 2;
          return (
            <A.Pos x={40} y={1150} e={M.pop(T, f(0.06), 0.42)} dy={M.life(T, 3, 5)}>
              <B.Cuenta s={0.8} n={Math.min(2, Math.floor(u + 0.02))} p={u >= 2 ? 1 : u % 1} />
            </A.Pos>
          );
        },
        bien: [{ x: 860, y: 600, cuando: 0.5 }],
        r1: { text: 'COMO EN UNA SILLA', cuando: 0.08 },
        r2: { text: 'SUBE CON LOS TALONES', cuando: 0.52 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'Trabajan los cuádriceps y el glúteo mayor, con ayuda de isquios y aductores.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.8, foco: en([820, 980]), mira: [540, 1000] }], [0.6, { zoom: 1.9, foco: en([820, 980]), mira: [540, 1000] }], [1, { zoom: 1.3, foco: en([800, 860]), mira: [540, 960] }]],
        figura: function (T, f, t, s) {
          var m = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = animate({ from: 0, to: 1, start: f(0.56), end: f(0.68) })(T);
          return <Smith T={T} s={s} p={0.85} musc={{ cuad: m, glu: m }} muscGris={{ isq: sec }}
            extra={function (g) { return <g><V.Brillo T={T} c={cuad(g)} r={90} v={m} /><V.Brillo T={T} c={U.suma(g.cadera, [40, 30])} r={70} v={m} /></g>; }} />;
        },
        r1: { text: 'CUÁDRICEPS Y GLÚTEO', cuando: 0.04 },
        r2: { text: '+ ISQUIOS Y ADUCTORES', cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: arquear la espalda. Abdomen apretado y la columna neutra.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.4, foco: en([840, 700]), mira: [540, 940] }], [0.5, { zoom: 1.45, foco: en([840, 700]), mira: [540, 940] }], [1, { zoom: 1.3, foco: en([820, 740]), mira: [540, 940] }]],
        figura: function (T, f, t, s) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var k = 0.25 + 0.5 * reps(T, f(0), f(1), 2, 0.4);
          return <Smith T={T} s={s} p={k} arco={1 - bien} muscRojo={bien < 0.5 ? { erec: 1 } : null} musc={bien >= 0.5 ? { abd: 1 } : null}
            extra={function (g) {
              return bien < 0.5
                ? <B.Arco c={U.lerpP(g.cadera, g.cuello, 0.35)} r={120} a0={-30} a1={60} color={C.RED} sw={14} p={1} />
                : <B.Puntos pts={[g.cadera, U.suma(g.cuello, [0, -30])]} color={C.GRN} sw={13} p={1} />;
            }} />;
        },
        mal: [{ x: 120, y: 520, cuando: 0.12, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 120, y: 520, cuando: 0.58 }],
        r1: { text: 'ESPALDA ARQUEADA', cuando: 0.04 },
        r2: { text: 'COLUMNA NEUTRA', cuando: 0.52 }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: los pies muy adelante. Tienen que quedar debajo de la barra.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.12, foco: en([700, 800]), mira: [540, 920] }], [1, { zoom: 1.08, foco: en([720, 780]), mira: [540, 920] }]],
        figura: function (T, f, t, s) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.58), ease: Easing.easeInOutCubic })(T);
          var k = 0.2 + 0.6 * reps(T, f(0), f(1), 2, 0.4);
          return <Smith T={T} s={s} p={k} pies={1 - bien} musc={{ cuad: 1, glu: 1 }}
            extra={function (g, b) {
              var pie = U.lerpP(g.tobillo, g.punta, 0.45);
              return bien < 0.5
                ? <g>{vertical(b, C.RED)}<B.Anillo c={pie} r={70} color={C.RED} p={1} /></g>
                : <g>{vertical(b, C.GRN)}<B.Anillo c={pie} r={70} color={C.GRN} p={1} /></g>;
            }} />;
        },
        mal: [{ x: 120, y: 520, cuando: 0.12, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 120, y: 520, cuando: 0.6 }],
        r1: { text: 'PIES MUY ADELANTE', cuando: 0.04 },
        r2: { text: 'PIES BAJO LA BARRA', cuando: 0.54 }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace. Pecho arriba y los pies bajo la barra.',
      C: V.escena({
        fig: FIG, pulsos: [0.4],
        tomas: [[0, { zoom: 1.2, foco: en([780, 760]), mira: [540, 920] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var k = 1 - animate({ from: 0, to: 1, start: f(0.04), end: f(0.4), ease: Easing.easeInOutSine })(T);
          return <Smith T={T} s={s} p={0.9 * k} musc={{ cuad: 1, glu: 1 }}
            extra={function (g, b) { return <V.Chispa T={T} c={[b[0], b[1] - 40]} cuando={f(0.4)} r={100} />; }} />;
        },
        bien: [{ x: 860, y: 600, cuando: 0.42, s: 0.85 }],
        r1: { text: 'SENTADILLA EN MÁQUINA', s: 1.1, cuando: 0.06 },
        r2: { text: 'PECHO ARRIBA', cuando: 0.46 }
      }) }
  ];

  global.REELS.registrar({ id: 'sentadilla-maquina', titulo: 'Sentadilla en máquina (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
