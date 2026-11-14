/* ============================================================
   LOS 3 MEJORES EJERCICIOS DE CUADRICEPS SEGUN LA CIENCIA — con la novia de Tor
   reel de ~16 s, ESTILO 2 (formato de biceps-top3)
   1. Sentadilla en maquina (Smith o hack): bien abajo; la sentadilla profunda
      hace crecer el cuadriceps (vastos) (Kubo y cols., 2019).
   2. Extension de piernas: la sentadilla casi no hace crecer el recto femoral
      (Kubo y cols., 2019); la extension si (Ema y cols., 2013, Eur J Appl Physiol).
   3. Prensa: mucho peso con la espalda apoyada, sin despegar la cadera.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, V = global.V, TOP3 = global.TOP3, PIEZAS = global.PIEZAS;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var Ella = TOP3.Ella;
  var PISO = 1300;

  function poseDePie() {
    var pose = B.posePerfil.depie({ x: 700, piso: PISO });
    var g = B.geoPerfil({ pose: pose });
    pose.codo = U.suma(g.hombro, U.polar(62, 220));
    pose.mano = U.suma(g.cadera, [-6, -70]);
    return pose;
  }

  /* ---------------- las tres figuras (poses y maquinas de sus reels) ---------------- */

  function Smith(T, s, k, extra) {
    var pose = PIEZAS.smith.pose(1 - k), b = pose._barra;
    return (
      <Ella T={T} s={s} pose={pose} glu={0.4} musc={{ cuad: 0.4 + 0.6 * k }}
        fondo={function () { return <PIEZAS.smith.Maquina barra={b} />; }}
        extra={function (g) { return <g><circle cx={b[0]} cy={b[1]} r={24} fill={C.GRY} stroke={C.INK} strokeWidth={11} />{extra ? extra(g) : null}</g>; }} />
    );
  }
  function Extension(T, s, k, extra) {
    var ang = U.lerp(92, 172, Easing.easeInOutSine(clamp(k, 0, 1)));
    var pose = PIEZAS.sillaExtensora.pose(ang);
    return (
      <Ella T={T} s={s} pose={pose} glu={0.2} musc={{ cuad: 0.4 + 0.6 * k, recto: 0.4 + 0.6 * k }}
        fondo={function () { return <g><B.PisoG y={PISO + 4} x0={300} x1={1160} /><V.Sombra c={[720, PISO + 2]} rx={340} /><PIEZAS.sillaExtensora.Maquina ang={ang} /></g>; }}
        extra={function (g) { return <g><PIEZAS.sillaExtensora.Rodillo ang={ang} />{extra ? extra(g) : null}</g>; }} />
    );
  }
  function Prensa(T, s, k, extra) {
    var pose = PIEZAS.prensa.pose(k);
    return (
      <Ella T={T} s={s} pose={pose} glu={0.3} musc={{ cuad: 0.4 + 0.6 * k }}
        fondo={function () { return <PIEZAS.prensa.Maquina plato={pose._plato} />; }}
        extra={extra} />
    );
  }

  function cuadriceps(g) { return TOP3.adelante(g.cadera, g.rodilla, 0.5, 40); }

  var GL = { x: 60, y: 290, s: 0.8 };
  function enGL(p) { return [GL.x + p[0] * GL.s, GL.y + p[1] * GL.s]; }
  var FIG_S = { x: -20, y: 250, s: 0.8 }, FIG_E = { x: 30, y: 260, s: 0.86 }, FIG_P = { x: -130, y: 250, s: 0.8 };

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.6, vo: 'Los 3 mejores ejercicios de cuádriceps según la ciencia.',
      C: TOP3.gancho({
        musculo: 'CUÁDRICEPS', fig: GL, s1: 1.2,
        tomas: [[0, { zoom: 1.3, foco: enGL([680, 900]), mira: [540, 1150] }], [1, { zoom: 1.04, foco: enGL([720, 760]), mira: [540, 1000] }]],
        figura: function (T, f, t, s) {
          return <Ella T={T} s={s} pose={poseDePie()} glu={0.2} musc={{ cuad: 1, recto: 1 }}
            fondo={function () { return <g><B.PisoG y={PISO + 4} x0={300} x1={1100} /><V.Sombra c={[700, PISO + 2]} rx={240} /></g>; }}
            extra={function (g) { return <g><V.Brillo T={T} c={cuadriceps(g)} r={110} v={1} /><V.Chispa T={T} c={cuadriceps(g)} cuando={f(0.3)} r={150} /></g>; }} />;
        }
      }) },
    { nombre: '1. Sentadilla en máquina', dur: 2.2, vo: 'Uno: sentadilla en máquina, bajando bien.',
      C: TOP3.ejercicio({
        n: 1, fig: FIG_S, centro: [740, 760], foco: [700, 960], zoom: 1.15, r1: 'SENTADILLA EN MÁQUINA', r2: 'BIEN ABAJO', s1: 1.0,
        musculo: cuadriceps, dibujo: Smith
      }) },
    { nombre: '2. Extensión de piernas', dur: 2.2, vo: 'Dos: extensión de piernas, la que trabaja el recto femoral.',
      C: TOP3.ejercicio({
        n: 2, fig: FIG_E, centro: [700, 840], foco: [620, 860], zoom: 1.15, r1: 'EXTENSIÓN DE PIERNAS', r2: 'RECTO FEMORAL', s1: 1.02,
        musculo: cuadriceps, dibujo: Extension
      }) },
    { nombre: '3. Prensa', dur: 2.2, vo: 'Tres: prensa, sin despegar la cadera.',
      C: TOP3.ejercicio({
        n: 3, fig: FIG_P, centro: [800, 900], foco: [700, 860], zoom: 1.15, r1: 'PRENSA', r2: 'CADERA PEGADA',
        musculo: cuadriceps, dibujo: Prensa
      }) }
  ];

  global.REELS.registrar({
    id: 'cuadriceps-top3', titulo: 'Top 3 cuádriceps (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 3.6, pregunta: '¿CUÁL PROBARÁS?', vo: '¿Cuál vas a probar? Coméntalo, compártelo con una amiga y guárdalo.' }
  });
})(window);
