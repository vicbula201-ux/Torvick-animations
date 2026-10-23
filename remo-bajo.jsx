/* ============================================================
   REMO BAJO CON TRIANGULO — reel corto, ESTILO 2 (~34 s con el cierre)
   Fuente: libro, pag. 67. Sentado en la maquina de remo bajo, piernas un
   poco flexionadas y pies apoyados, el mango triangular con las palmas
   enfrentadas; tirar hacia el abdomen con los codos cerca del cuerpo y
   volver controlado, estirando la espalda. Dorsal ancho (principal);
   romboides, braquial, deltoides posterior, trapecio y redondo mayor.
   Errores: no mover las escapulas y balancear el cuerpo.
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

  /* ---------------- de perfil, sentado frente a la polea (mira a la izquierda) ---------------- */

  var PISO = 1300;
  var CADERA = [830, 1000];
  var BASE = B.posePerfil.depie({ x: 700, piso: PISO });
  var TOB = [470, 1000], PUNTA = [430, 900];          // el pie contra la plataforma, la punta arriba
  var POLEA = [330, 1010];

  function prod(a, b) { return a[0] * b[0] + a[1] * b[1]; }

  // p 0 brazos estirados .. 1 mango en el abdomen; lean grados (+ atras);
  // esc -1 escapulas abiertas (hombro adelante) .. 1 juntas (hombro atras)
  function remo(p, lean, esc) {
    lean = lean == null ? U.lerp(-7, 3, p) : lean;
    esc = esc || 0;
    var cuello = U.suma(CADERA, U.polar(-90 + lean, 404));
    var pose = Object.assign({}, BASE, { cadera: CADERA, cuello: cuello, curva: 0, cabeza: -0.6 * lean });
    var g = B.geoPerfil({ pose: Object.assign({}, pose, { codo: CADERA, mano: CADERA }) });
    var hombro = U.suma(g.hombro, [20 * esc, -4 * Math.abs(esc)]);
    pose.hombro = hombro;
    pose.hombro2 = U.suma(hombro, [12, -10]);
    var e = Easing.easeInOutSine(clamp(p, 0, 1));
    var lejos = [hombro[0] - 400, hombro[1] + 96];
    var pecho = [CADERA[0] - 64, CADERA[1] - 150];
    var mano = U.lerpP(lejos, pecho, e);
    var c1 = B.ik(hombro, mano, 232, 214, 1), c2 = B.ik(hombro, mano, 232, 214, -1);
    pose.codo = c1[1] > c2[1] ? c1 : c2;
    pose.mano = mano;
    pose.codo2 = U.suma(pose.codo, [12, -8]); pose.mano2 = U.suma(mano, [10, -6]);
    var r1 = B.ik(CADERA, TOB, 272, 268, 1), r2 = B.ik(CADERA, TOB, 272, 268, -1);
    pose.rodilla = r1[1] < r2[1] ? r1 : r2;
    pose.tobillo = TOB; pose.punta = PUNTA;
    pose.rodilla2 = U.suma(pose.rodilla, [14, -10]); pose.tobillo2 = U.suma(TOB, [14, -6]); pose.punta2 = U.suma(PUNTA, [14, -6]);
    return pose;
  }

  function Maquina(props) {
    var sube = props.sube || 0, pesada = props.pesada;
    return (
      <g>
        <B.PisoG y={PISO + 4} x0={80} x1={1260} />
        <V.Sombra c={[760, PISO + 2]} rx={380} />
        {/* columna con la pila de placas */}
        <rect x={150} y={240} width={70} height={PISO - 240} rx={16} fill={BLANCO} {...LN} />
        {[0, 1, 2, 3, 4, 5].map(function (i) {
          var dy = i >= 4 ? -60 * sube : 0;
          return <rect key={i} x={106} y={PISO - 56 - i * 44 + dy} width={158} height={38} rx={8}
            fill={i >= 4 ? (pesada ? C.RED : C.YEL) : C.GRY} stroke={C.INK} strokeWidth={11} />;
        })}
        {/* base, plataforma de los pies y polea baja */}
        <path d={'M 220 1250 L 1220 1250'} fill="none" {...LN} />
        <path d={'M 400 1250 L 480 860'} fill="none" stroke={C.INK} strokeWidth={34} strokeLinecap="round" />
        <path d={'M 400 1250 L 480 860'} fill="none" stroke={C.GRY} strokeWidth={14} strokeLinecap="round" />
        <circle cx={POLEA[0]} cy={POLEA[1]} r={28} fill={BLANCO} stroke={C.INK} strokeWidth={12} />
        {/* asiento largo */}
        <rect x={600} y={1036} width={620} height={46} rx={20} fill={C.GRY} {...LN} />
        <path d={'M 700 1082 L 700 1250 M 1120 1082 L 1120 1250'} fill="none" {...LN} />
      </g>
    );
  }

  function Perfil(props) {
    var p = props.p == null ? 0 : props.p;
    var pose = remo(p, props.lean, props.esc);
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, props.fase || 0)}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () { return <Maquina sube={p} pesada={props.pesada} />; }}
        medio={function (g) {
          // el cable sale de la polea y llega al mango, entre las piernas
          var punta = U.suma(g.mano, [-58, 6]);
          return <path d={'M ' + U.pt(U.suma(POLEA, [8, -24])) + ' L ' + U.pt(punta)} stroke={C.INK} strokeWidth={9} strokeLinecap="round" />;
        }}
        children={function (g) {
          var m = g.mano;
          return (
            <g>
              {/* mango triangular de costado */}
              <path d={'M ' + U.pt(U.suma(m, [-8, -26])) + ' L ' + U.pt(U.suma(m, [-58, 6])) + ' L ' + U.pt(U.suma(m, [-8, 30])) + ' Z'}
                fill={C.GRY} stroke={C.INK} strokeWidth={10} strokeLinejoin="round" />
              {props.extra ? props.extra(g) : null}
            </g>
          );
        }} />
    );
  }

  function escapula(g) { return U.suma(g.hombro, [56, 40]); }
  function dorsal(g) { return U.lerpP(g.hombro, g.cadera, 0.45); }

  /* ---------------- encuadre ---------------- */

  var FIG = { x: -60, y: 140, s: 0.92 };
  function en(p) { return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s]; }
  var GEN = { zoom: 1.02, foco: en([660, 840]), mira: [540, 900] };
  var CMP = { s: 0.76, desdeY: 360, h: 580, centroX: 660, yArriba: 310, yAbajo: 940 };

  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.14); }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tu remo bajo.',
      C: V.escena({
        fig: FIG, vibra: true,
        tomas: [[0, { zoom: 1.3, foco: en([720, 760]), mira: [540, 960] }], [1, { zoom: 1.06, foco: en([660, 840]), mira: [540, 920] }]],
        figura: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 2, 0.35);
          return <Perfil T={T} s={s} p={k} lean={-24 + 50 * k} muscRojo={{ erec: 1 }}
            extra={function (g) { return <V.Gotas T={T} c={g.centroCabeza} v={1} />; }} />;
        },
        mal: [{ x: 860, y: 520, cuando: 0.2, s: 0.6 }, { x: 860, y: 1180, cuando: 0.44, s: 0.5 }],
        r1: { text: 'REMO BAJO', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Posición', dur: 5.5, vo: 'Siéntate con las rodillas un poco flexionadas, los pies apoyados y agarra el triángulo con las palmas enfrentadas.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, GEN], [0.16, { zoom: 1.9, foco: en([520, 1000]), mira: [540, 960] }],
          [0.44, { zoom: 1.9, foco: en([520, 1000]), mira: [540, 960] }], [0.6, { zoom: 2, foco: en([440, 800]), mira: [540, 1100] }],
          [0.86, { zoom: 2, foco: en([440, 800]), mira: [540, 1100] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var rod = animate({ from: 0, to: 1, start: f(0.14), end: f(0.26) })(T);
          var man = animate({ from: 0, to: 1, start: f(0.6), end: f(0.72) })(T);
          return <Perfil T={T} s={s} p={0}
            extra={function (g) {
              return (
                <g>
                  <B.Anillo c={g.rodilla} r={70} color={C.YEL} p={rod} />
                  <B.Anillo c={U.lerpP(g.tobillo, g.punta, 0.5)} r={70} color={C.YEL} p={rod} />
                  <B.Anillo c={U.suma(g.mano, [-24, 0])} r={76} color={C.YEL} p={man} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 640, cuando: 0.32 }, { x: 860, y: 640, cuando: 0.76 }],
        r1: { text: 'RODILLAS FLEXIONADAS', cuando: 0.12 },
        r2: { text: 'PALMAS ENFRENTADAS', cuando: 0.6 }
      }) },

    { nombre: 'Ejecución', dur: 5.5, vo: 'Tira del mango hacia el abdomen con los codos cerca del cuerpo, y vuelve controlado estirando la espalda.',
      C: V.escena({
        fig: FIG, pulsos: [0.28, 0.74],
        tomas: [[0, GEN], [0.3, { zoom: 1.3, foco: en([720, 820]), mira: [540, 940] }], [0.8, { zoom: 1.3, foco: en([720, 820]), mira: [540, 940] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var k = reps(T, f(0.02), f(0.98), 2);
          var ant = reps(T - 0.06, f(0.02), f(0.98), 2);
          return <Perfil T={T} s={s} p={k} esc={-1 + 2 * k} musc={{ dor: 0.3 + 0.7 * k }}
            extra={function (g) {
              return (
                <g>
                  <V.Lineas c={U.suma(g.mano, [-40, 0])} dir={[k >= ant ? 1 : -1, 0]} v={Math.abs(k - ant) * 8} largo={120} />
                  {k > 0.9 ? <B.Puntos pts={[g.hombro, g.codo]} color={C.GRN} sw={14} p={1} /> : null}
                  <V.Chispa T={T} c={g.codo} cuando={f(0.28)} r={80} />
                  <V.Chispa T={T} c={g.codo} cuando={f(0.74)} r={80} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 600, cuando: 0.6 }],
        r1: { text: 'AL ABDOMEN', s: 1.25, cuando: 0.06 },
        r2: { text: 'CODOS PEGADOS', cuando: 0.5 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'Trabaja el dorsal ancho, con ayuda de los romboides, el trapecio y el deltoides posterior.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.8, foco: en([840, 760]), mira: [540, 1060] }], [0.6, { zoom: 1.85, foco: en([840, 760]), mira: [540, 1070] }], [1, { zoom: 1.4, foco: en([780, 800]), mira: [540, 980] }]],
        figura: function (T, f, t, s) {
          var dor = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = animate({ from: 0, to: 1, start: f(0.56), end: f(0.68) })(T);
          return <Perfil T={T} s={s} p={1} esc={1} musc={{ dor: dor }} muscGris={{ delto: sec, bic: sec }}
            extra={function (g) { return <V.Brillo T={T} c={dorsal(g)} r={90} v={dor} />; }} />;
        },
        r1: { text: 'DORSAL ANCHO', s: 1.25, cuando: 0.04 },
        r2: { text: '+ ROMBOIDES Y TRAPECIO', cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: no mover las escápulas. Júntalas al tirar y ábrelas al volver.',
      C: V.escena({
        comparar: {
          cmp: CMP,
          mal: function (T, f, t, s) {
            var k = reps(T, f(0), f(1), 2);
            return <Perfil T={T} s={s} p={k} esc={0}
              extra={function (g) { return <B.Anillo c={escapula(g)} r={64} color={C.RED} p={1} />; }} />;
          },
          bien: function (T, f, t, s) {
            var k = reps(T, f(0), f(1), 2);
            return <Perfil T={T} s={s} p={k} esc={-1 + 2 * k} fase={1.2} musc={{ dor: 1 }}
              extra={function (g) {
                var a = U.suma(g.hombro, [-30, -80]);
                return <B.FlechaS a={a} b={U.suma(a, [k > 0.5 ? 110 : -110, 0])} color={C.GRN} sw={15} p={1} />;
              }} />;
          }
        },
        r1: { text: 'ESCÁPULAS QUIETAS', cuando: 0.04 },
        r2: { text: 'JÚNTALAS Y ÁBRELAS', cuando: 0.36 }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: balancear el cuerpo. El torso se queda firme; solo se mueven los brazos.',
      C: V.escena({
        comparar: {
          cmp: CMP,
          mal: function (T, f, t, s) {
            var k = reps(T, f(0), f(1), 2, 0.35);
            return <Perfil T={T} s={s} p={k} lean={-26 + 52 * k} muscRojo={{ erec: 1 }} />;
          },
          bien: function (T, f, t, s) {
            var k = reps(T, f(0), f(1), 2, 0.35);
            return <Perfil T={T} s={s} p={k} lean={0} esc={-1 + 2 * k} fase={0.8} musc={{ dor: 1 }}
              extra={function (g) { return <B.Puntos pts={[g.cadera, U.suma(g.cuello, [0, -40])]} color={C.GRN} sw={14} p={1} />; }} />;
          }
        },
        r1: { text: 'BALANCEO DEL TORSO', cuando: 0.04 },
        r2: { text: 'TORSO FIRME', s: 1.2, cuando: 0.36 }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace. Pecho arriba y codos atrás.',
      C: V.escena({
        fig: FIG, pulsos: [0.4],
        tomas: [[0, { zoom: 1.25, foco: en([720, 820]), mira: [540, 940] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var k = animate({ from: 0, to: 1, start: f(0.04), end: f(0.4), ease: Easing.easeInOutSine })(T);
          return <Perfil T={T} s={s} p={k} esc={-1 + 2 * k} musc={{ dor: 1 }}
            extra={function (g) { return <V.Chispa T={T} c={dorsal(g)} cuando={f(0.4)} r={100} />; }} />;
        },
        bien: [{ x: 860, y: 600, cuando: 0.42, s: 0.85 }],
        r1: { text: 'REMO BAJO', s: 1.3, cuando: 0.06 },
        r2: { text: 'PECHO ARRIBA', cuando: 0.46 }
      }) }
  ];

  global.REELS.registrar({ id: 'remo-bajo', titulo: 'Remo bajo con triángulo (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
