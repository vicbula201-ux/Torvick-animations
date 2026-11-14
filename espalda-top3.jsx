/* ============================================================
   LOS 3 MEJORES EJERCICIOS DE ESPALDA SEGUN LA CIENCIA — reel de ~16 s, ESTILO 2
   (formato de biceps-top3: gancho + 3 ejercicios + accion + cierre)
   Criterio: un tiron de arriba (dominadas), uno de adelante (remo en polea)
   y el dorsal trabajado estirado (pullover en polea). La evidencia general:
   entrenar el musculo en posiciones de estiramiento favorece la hipertrofia
   (Wolf y cols., 2023, Int J Strength Cond) y el rango completo da igual o
   mas musculo que el parcial (Pallares y cols., 2021).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, V = global.V, TOP3 = global.TOP3, PIEZAS = global.PIEZAS;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };
  var PISO = 1300;

  function rodillaAdelante(cad, tob) {
    var r1 = B.ik(cad, tob, 272, 268, 1), r2 = B.ik(cad, tob, 272, 268, -1);
    return r1[0] < r2[0] ? r1 : r2;
  }

  /* ---------------- 1. dominadas, de perfil ---------------- */

  var BARRA = [700, 200], PISO_D = 1600;
  function Dominada(props) {
    var pose = B.posePerfil.colgado({ barra: BARRA, sube: props.k });
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, 0.3)} musc={props.musc} muscGris={props.muscGris}
        fondo={function () {
          return (
            <g>
              <path d={'M ' + BARRA[0] + ' ' + BARRA[1] + ' L 1210 ' + BARRA[1] + ' L 1210 ' + PISO_D} fill="none" stroke={C.INK} strokeWidth={30} strokeLinejoin="round" />
              <path d={'M ' + BARRA[0] + ' ' + BARRA[1] + ' L 1210 ' + BARRA[1] + ' L 1210 ' + PISO_D} fill="none" stroke={BLANCO} strokeWidth={8} strokeLinejoin="round" />
              <B.PisoG y={PISO_D + 4} x0={360} x1={1300} />
            </g>
          );
        }}
        children={function (g) {
          return <g><circle cx={BARRA[0]} cy={BARRA[1]} r={24} fill={C.GRY} stroke={C.INK} strokeWidth={11} />{props.extra ? props.extra(g) : null}</g>;
        }} />
    );
  }

  /* ---------------- 3. pullover en polea, de pie frente a la polea alta ---------------- */

  var BASE = B.posePerfil.depie({ x: 760, piso: PISO });
  var POLEA = [230, 130];
  function pullover(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var cadera = [780, 760];
    var pose = Object.assign({}, BASE, { cadera: cadera, cuello: U.suma(cadera, U.polar(-112, 404)), curva: 0, cabeza: -14, piso: PISO });
    var g = B.geoPerfil({ pose: Object.assign({}, pose, { codo: cadera, mano: cadera }) });
    // los brazos casi rectos: de arriba adelante (dorsal estirado) a los muslos
    var a = U.lerp(214, 100, e);
    pose.codo = U.suma(g.hombro, U.polar(a, 232));
    pose.mano = U.suma(pose.codo, U.polar(a - 8, 214));
    pose.codo2 = U.suma(pose.codo, [14, -8]); pose.mano2 = U.suma(pose.mano, [14, -8]);
    pose.tobillo = [720, PISO - 32]; pose.punta = U.suma(pose.tobillo, [-112, 32]);
    pose.tobillo2 = [760, PISO - 32]; pose.punta2 = U.suma(pose.tobillo2, [-112, 32]);
    pose.rodilla = rodillaAdelante(cadera, pose.tobillo);
    pose.rodilla2 = rodillaAdelante(U.suma(cadera, [14, -6]), pose.tobillo2);
    return pose;
  }
  function Pullover(props) {
    var pose = pullover(props.k);
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, 0.6)} musc={props.musc} muscGris={props.muscGris}
        fondo={function (g) {
          return (
            <g>
              <B.PisoG y={PISO + 4} x0={80} x1={1140} />
              <V.Sombra c={[740, PISO + 2]} rx={220} />
              <rect x={150} y={60} width={60} height={PISO - 60} rx={16} fill={BLANCO} {...LN} />
              <rect x={130} y={50} width={160} height={46} rx={14} fill={BLANCO} {...LN} />
              {[0, 1, 2, 3, 4].map(function (i) {
                var dy = i >= 3 ? -70 * props.k : 0;
                return <rect key={i} x={96} y={PISO - 56 - i * 44 + dy} width={168} height={38} rx={8}
                  fill={i >= 3 ? C.YEL : C.GRY} stroke={C.INK} strokeWidth={11} />;
              })}
              <path d={'M ' + U.pt(U.suma(POLEA, [10, 26])) + ' L ' + U.pt(g.mano)} stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
              <circle cx={POLEA[0]} cy={POLEA[1]} r={30} fill={BLANCO} stroke={C.INK} strokeWidth={12} />
            </g>
          );
        }}
        children={function (g) {
          return <g><circle cx={g.mano[0]} cy={g.mano[1]} r={22} fill={C.GRY} stroke={C.INK} strokeWidth={11} />{props.extra ? props.extra(g) : null}</g>;
        }} />
    );
  }

  function dorsal(g) { return TOP3.atras(g.hombro, g.cadera, 0.38, 46); }

  /* ---------------- el gancho: de espaldas, colgado, con los dorsales encendidos ---------------- */

  var EW = 1100, AN = 120;
  function Espalda(props) {
    var s = props.s;
    return (
      <div style={{ position: 'relative', width: EW * s, height: 1000 * s }}>
        <svg width={EW * s} height={1000 * s} viewBox={'0 0 ' + EW + ' 1000'} style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}>
          <rect x={-160} y={AN - 20} width={EW + 320} height={40} rx={20} fill={BLANCO} stroke={C.INK} strokeWidth={15} />
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <B.Espalda s={s} brazos="arriba" cuerpoEntero rodillas={1} anclaManos={AN} sube={props.sube}
            musc={{ dor: 1, rM: 0.7, tra: 0.4 }} />
        </div>
      </div>
    );
  }
  var GE = { x: 540 - 550 * 0.8, y: 640 - AN * 0.8, s: 0.8 };
  function enGE(p) { return [GE.x + p[0] * GE.s, GE.y + p[1] * GE.s]; }

  var FIG_D = { x: -50, y: 300, s: 0.84 }, FIG_R = { x: -20, y: 250, s: 0.82 }, FIG_P = { x: 90, y: 280, s: 0.74 };

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.6, vo: 'Los 3 mejores ejercicios de espalda según la ciencia.',
      C: TOP3.gancho({
        musculo: 'ESPALDA', fig: GE,
        tomas: [[0, { zoom: 1.12, foco: enGE([550, 520]), mira: [540, 1090] }], [1, { zoom: 1.0, foco: enGE([550, 640]), mira: [540, 1020] }]],
        figura: function (T, f, t, s) {
          var sube = 0.2 + 0.8 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.34) })(T));
          return <Espalda s={s} sube={sube} />;
        }
      }) },
    { nombre: '1. Dominadas', dur: 2.2, vo: 'Uno: dominadas, bajando hasta estirar.',
      C: TOP3.ejercicio({
        n: 1, fig: FIG_D, centro: [700, 800], foco: [700, 640], zoom: 1.12, mira: [540, 1020], r1: 'DOMINADAS', r2: 'ESTIRA ABAJO',
        musculo: dorsal,
        dibujo: function (T, s, k, extra) { return <Dominada T={T} s={s} k={k} musc={{ dor: 0.4 + 0.6 * k }} muscGris={{ bic: 0.6 }} extra={extra} />; }
      }) },
    { nombre: '2. Remo en polea', dur: 2.2, vo: 'Dos: remo en polea, dejando ir los brazos adelante.',
      C: TOP3.ejercicio({
        n: 2, fig: FIG_R, centro: [700, 900], foco: [760, 860], zoom: 1.25, r1: 'REMO EN POLEA', r2: 'ESTIRA ADELANTE',
        musculo: dorsal,
        dibujo: function (T, s, k, extra) { return <PIEZAS.remoBajo.Figura T={T} s={s} p={k} musc={{ dor: 0.4 + 0.6 * k }} muscGris={{ delto: 0.6, bic: 0.4 }} extra={extra} />; }
      }) },
    { nombre: '3. Pullover en polea', dur: 2.2, vo: 'Tres: pullover en polea, con los brazos estirados.',
      C: TOP3.ejercicio({
        n: 3, fig: FIG_P, centro: [640, 760], foco: [700, 700], zoom: 1.08, r1: 'PULLOVER EN POLEA', r2: 'BRAZOS ESTIRADOS', s1: 1.05,
        musculo: dorsal,
        dibujo: function (T, s, k, extra) { return <Pullover T={T} s={s} k={k} musc={{ dor: 0.4 + 0.6 * k }} muscGris={{ tri: 0.5 }} extra={extra} />; }
      }) }
  ];

  global.REELS.registrar({
    id: 'espalda-top3', titulo: 'Top 3 espalda (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 3.3, vo: '¿Estás de acuerdo? Coméntalo, compártelo y guárdalo.' }
  });
})(window);
