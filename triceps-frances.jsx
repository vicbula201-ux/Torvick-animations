/* ============================================================
   TRICEPS FRANCES EN POLEA — reel corto, ESTILO 2 (~34 s con el cierre)
   Fuente: libro, pag. 118. De pie, de espaldas a la polea baja, el agarre
   con las dos manos y los codos altos y flexionados; los pies paralelos o
   un pie adelante para estabilidad; extender los codos hacia arriba y
   volver. Triceps braquial (principal), anconeo; el abdomen, el pectoral
   y el dorsal estabilizan. Errores: mover el hombro (tiene que quedar
   inmovil) y la carga excesiva (compensaciones que lesionan).
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

  /* ---------------- de perfil, de espaldas a la polea (mira a la izquierda) ---------------- */

  var PISO = 1300;
  var POLEA = [948, 1222];
  var BASE = B.posePerfil.depie({ x: 700, piso: PISO });
  var TOB = [590, PISO - 32], TOB2 = [800, PISO - 32];       // un pie adelante, el otro atras

  // ext 0 codos flexionados (manos detras de la cabeza) .. 1 brazos extendidos arriba;
  // lean grados (+ atras: arquear la espalda); mov 0..1 el brazo se va adelante (el error)
  function frances(ext, lean, mov) {
    lean = lean == null ? -5 : lean;
    var cadera = [700 - 1.6 * lean, 730 + 0.8 * lean];
    var cuello = U.suma(cadera, U.polar(-90.85 + lean, 404));
    var pose = Object.assign({}, BASE, { cadera: cadera, cuello: cuello, curva: lean > 0 ? -0.04 * lean : 0, cabeza: -0.5 * lean,
      cabezaEncima: true });   // con los brazos arriba la cabeza va delante del brazo
    var g = B.geoPerfil({ pose: Object.assign({}, pose, { codo: cadera, mano: cadera }) });
    var brazo = -97 + lean - 36 * (mov || 0);
    pose.codo = U.suma(g.hombro, U.polar(brazo, 232));
    var e = Easing.easeInOutSine(clamp(ext, 0, 1));
    pose.mano = U.suma(pose.codo, U.polar(U.lerp(80, brazo, e), 214));
    pose.codo2 = U.suma(pose.codo, [14, 4]); pose.mano2 = U.suma(pose.mano, [16, 4]);
    pose.tobillo = TOB; pose.punta = U.suma(TOB, [-112, 32]);
    pose.tobillo2 = TOB2; pose.punta2 = U.suma(TOB2, [-112, 32]);
    pose.rodilla = B.ik(cadera, TOB, 272, 268, -1);
    pose.rodilla2 = B.ik(U.suma(cadera, [14, -4]), TOB2, 272, 268, -1);
    return pose;
  }

  function Maquina(props) {
    var sube = props.sube || 0, pesada = props.pesada;
    return (
      <g>
        <B.PisoG y={PISO + 4} x0={380} x1={1260} />
        <V.Sombra c={[700, PISO + 2]} rx={240} />
        <rect x={960} y={120} width={56} height={PISO - 120} rx={16} fill={BLANCO} {...LN} />
        {[0, 1, 2, 3, 4, 5].map(function (i) {
          var dy = i >= 4 ? -64 * sube : 0;
          return <rect key={i} x={1020} y={PISO - 56 - i * 44 + dy} width={150} height={38} rx={8}
            fill={i >= 4 ? (pesada ? C.RED : C.YEL) : C.GRY} stroke={C.INK} strokeWidth={11} />;
        })}
        <path d={'M 1095 ' + (PISO - 56 - 5 * 44 - 64 * sube) + ' L 1095 140 L 988 140'} fill="none" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
        <circle cx={POLEA[0]} cy={POLEA[1]} r={28} fill={BLANCO} stroke={C.INK} strokeWidth={12} />
      </g>
    );
  }

  function Perfil(props) {
    var ext = props.ext == null ? 0 : props.ext;
    var pose = frances(ext, props.lean, props.mov);
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, props.fase || 0)}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function (g) {
          return (
            <g>
              <Maquina sube={ext} pesada={props.pesada} />
              {/* cable de la polea baja a las manos, por detras del cuerpo */}
              <path d={'M ' + U.pt(U.suma(POLEA, [-6, -24])) + ' L ' + U.pt(g.mano)} stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
            </g>
          );
        }}
        children={function (g) {
          // la cuerda: dos puntas con su tope
          var d = U.unidad(U.resta(g.mano, g.codo));
          var a = U.suma(g.mano, U.por(d, 34)), b = U.suma(g.mano, U.por([-d[1], d[0]], 30));
          return (
            <g>
              <path d={'M ' + U.pt(g.mano) + ' L ' + U.pt(a) + ' M ' + U.pt(g.mano) + ' L ' + U.pt(b)} stroke={C.INK} strokeWidth={12} strokeLinecap="round" />
              <circle cx={a[0]} cy={a[1]} r={11} fill={C.INK} />
              <circle cx={b[0]} cy={b[1]} r={11} fill={C.INK} />
              {props.extra ? props.extra(g) : null}
            </g>
          );
        }} />
    );
  }

  function triceps(g) { return U.suma(U.lerpP(g.hombro, g.codo, 0.6), [74, 0]); }

  /* ---------------- encuadre ---------------- */

  var FIG = { x: -132, y: 389, s: 0.82 };
  function en(p) { return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s]; }
  var GEN = { zoom: 1, foco: en([820, 620]), mira: [540, 900] };
  var CMP = { s: 0.66, desdeY: -90, h: 580, centroX: 800, yArriba: 310, yAbajo: 940 };

  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.14); }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: 'Estás haciendo mal tu tríceps francés en polea.',
      C: V.escena({
        fig: FIG, vibra: true,
        tomas: [[0, { zoom: 1.35, foco: en([720, 300]), mira: [540, 860] }], [1, { zoom: 1.06, foco: en([800, 560]), mira: [540, 900] }]],
        figura: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 2, 0.35);
          return <Perfil T={T} s={s} ext={k} mov={k} lean={4 + 14 * k} pesada muscRojo={{ tri: 1, erec: k }}
            extra={function (g) { return <V.Gotas T={T} c={g.centroCabeza} v={1} />; }} />;
        },
        mal: [{ x: 150, y: 520, cuando: 0.2, s: 0.6 }, { x: 150, y: 1150, cuando: 0.44, s: 0.5 }],
        r1: { text: 'TRÍCEPS FRANCÉS', s: 1.2, cuando: 0.02 }
      }) },

    { nombre: 'Posición', dur: 5.5, vo: 'De espaldas a la polea baja, agarra con las dos manos y deja los codos altos y flexionados.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, GEN], [0.16, { zoom: 1.9, foco: en([960, 1180]), mira: [540, 1000] }],
          [0.4, { zoom: 1.9, foco: en([960, 1180]), mira: [540, 1000] }], [0.58, { zoom: 1.8, foco: en([700, 220]), mira: [540, 960] }],
          [0.86, { zoom: 1.8, foco: en([700, 220]), mira: [540, 960] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var pol = animate({ from: 0, to: 1, start: f(0.14), end: f(0.26) })(T);
          var codo = animate({ from: 0, to: 1, start: f(0.58), end: f(0.7) })(T);
          return <Perfil T={T} s={s} ext={0}
            extra={function (g) {
              return (
                <g>
                  <B.Anillo c={POLEA} r={70} color={C.YEL} p={pol} />
                  <B.Puntos pts={[g.hombro, U.suma(g.codo, U.por(U.unidad(U.resta(g.codo, g.hombro)), 70))]} color={C.GRN} sw={14} p={codo} />
                  <B.Anillo c={g.codo} r={56} color={C.YEL} p={codo} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 620, cuando: 0.3 }, { x: 860, y: 620, cuando: 0.74 }],
        r1: { text: 'ESPALDA A LA POLEA', cuando: 0.12 },
        r2: { text: 'CODOS ALTOS', s: 1.2, cuando: 0.58 }
      }) },

    { nombre: 'Ejecución', dur: 5.5, vo: 'Con un pie adelante para estabilidad, extiende los codos hacia arriba y vuelve lento.',
      C: V.escena({
        fig: FIG, pulsos: [0.47, 0.83],
        tomas: [[0, { zoom: 1.5, foco: en([640, 1160]), mira: [540, 1100] }], [0.24, GEN], [0.5, { zoom: 1.3, foco: en([720, 300]), mira: [540, 760] }],
          [0.9, { zoom: 1.3, foco: en([720, 300]), mira: [540, 760] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var pie = animate({ from: 0, to: 1, start: f(0.02), end: f(0.12) })(T) - animate({ from: 0, to: 1, start: f(0.24), end: f(0.3) })(T);
          var k = reps(T, f(0.26), f(1), 2, 0.3);
          var guia = M.draw(T, f(0.26), 0.5);
          return <Perfil T={T} s={s} ext={k} musc={{ tri: 0.3 + 0.7 * k }}
            extra={function (g) {
              return (
                <g>
                  <B.Anillo c={U.lerpP(g.tobillo, g.punta, 0.5)} r={80} color={C.YEL} p={pie} />
                  <B.Arco c={g.codo} r={270} a0={70} a1={-100} color={C.YEL} sw={14} p={guia * (1 - k)} />
                  <B.Anillo c={g.codo} r={46} color={C.GRN} p={guia} />
                  <V.Chispa T={T} c={g.mano} cuando={f(0.47)} r={80} />
                  <V.Chispa T={T} c={g.mano} cuando={f(0.83)} r={80} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 1060, cuando: 0.66, s: 0.6 }],
        r1: { text: 'UN PIE ADELANTE', cuando: 0.04 },
        r2: { text: 'EXTIENDE ARRIBA', cuando: 0.46 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'Trabaja el tríceps, con ayuda del ancóneo; el abdomen y el pecho te estabilizan.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.9, foco: en([700, 260]), mira: [540, 900] }], [0.6, { zoom: 2, foco: en([700, 250]), mira: [540, 900] }], [1, { zoom: 1.3, foco: en([740, 420]), mira: [540, 860] }]],
        figura: function (T, f, t, s) {
          var k = 0.5 + 0.5 * reps(T, f(0.1), f(1), 2, 0.4);
          var tri = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = animate({ from: 0, to: 1, start: f(0.56), end: f(0.68) })(T);
          return <Perfil T={T} s={s} ext={k} musc={{ tri: tri }} muscGris={{ abd: sec, pec: sec, ante: sec }}
            extra={function (g) { return <V.Brillo T={T} c={triceps(g)} r={80} v={tri} />; }} />;
        },
        r1: { text: 'TRÍCEPS', s: 1.3, cuando: 0.04 },
        r2: { text: '+ ANCÓNEO', s: 1.2, cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: mover el hombro. Los brazos quedan quietos; solo se mueven los codos.',
      C: V.escena({
        comparar: {
          cmp: CMP,
          mal: function (T, f, t, s) {
            var k = reps(T, f(0), f(1), 2, 0.35);
            return <Perfil T={T} s={s} ext={k} mov={1 - k} muscRojo={{ tri: 1 }}
              extra={function (g) { return <B.Anillo c={g.hombro} r={60} color={C.RED} p={1} />; }} />;
          },
          bien: function (T, f, t, s) {
            var k = reps(T, f(0), f(1), 2, 0.35);
            return <Perfil T={T} s={s} ext={k} fase={1.2} musc={{ tri: 1 }}
              extra={function (g) { return <g><B.Puntos pts={[g.hombro, g.codo]} color={C.GRN} sw={14} p={1} /><B.Anillo c={g.codo} r={46} color={C.GRN} p={1} /></g>; }} />;
          }
        },
        r1: { text: 'HOMBRO QUE SE MUEVE', cuando: 0.04 },
        r2: { text: 'BRAZOS QUIETOS', cuando: 0.36 }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: demasiada carga. Arqueas la espalda y te puedes lastimar.',
      C: V.escena({
        comparar: {
          cmp: CMP,
          mal: function (T, f, t, s) {
            var k = 0.6 * reps(T, f(0), f(1), 2, 0.35);
            return <Perfil T={T} s={s} ext={k} lean={10 + 14 * k} mov={0.4} pesada muscRojo={{ erec: 1, tri: 1 }}
              extra={function (g) { return <V.Gotas T={T} c={g.centroCabeza} v={1} />; }} />;
          },
          bien: function (T, f, t, s) {
            var k = reps(T, f(0), f(1), 2, 0.35);
            return <Perfil T={T} s={s} ext={k} fase={0.8} musc={{ tri: 1 }}
              extra={function (g) { return <B.Puntos pts={[g.cadera, U.suma(g.cuello, U.por(U.unidad(U.resta(g.cuello, g.cadera)), 40))]} color={C.GRN} sw={14} p={1} />; }} />;
          }
        },
        r1: { text: 'DEMASIADA CARGA', cuando: 0.04 },
        r2: { text: 'CARGA QUE CONTROLES', cuando: 0.36 }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace. Codos altos y quietos.',
      C: V.escena({
        fig: FIG, pulsos: [0.4],
        tomas: [[0, { zoom: 1.2, foco: en([740, 360]), mira: [540, 820] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var k = animate({ from: 0, to: 1, start: f(0.04), end: f(0.4), ease: Easing.easeInOutSine })(T);
          return <Perfil T={T} s={s} ext={k} musc={{ tri: 1 }}
            extra={function (g) { return <g><B.Anillo c={g.codo} r={46} color={C.GRN} p={1} /><V.Chispa T={T} c={g.mano} cuando={f(0.4)} r={90} /></g>; }} />;
        },
        bien: [{ x: 860, y: 640, cuando: 0.42, s: 0.85 }],
        r1: { text: 'TRÍCEPS FRANCÉS', s: 1.2, cuando: 0.06 },
        r2: { text: 'CODOS QUIETOS', cuando: 0.46 }
      }) }
  ];

  global.REELS.registrar({ id: 'triceps-frances', titulo: 'Tríceps francés en polea (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
