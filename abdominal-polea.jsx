/* ============================================================
   ABDOMINAL EN POLEA (de pie) — reel corto, ESTILO 2 (~38 s con la accion y el cierre)
   Fuente: libro, pag. 176. De pie, de espaldas a la polea alta, la cuerda
   tomada a los lados de la cabeza; inclinarse un poco desde la cadera y
   flexionar el tronco llevando los codos hacia las rodillas; volver
   controlado. Recto abdominal (principal); oblicuos y flexores de la cadera
   ayudan; el transverso estabiliza. Errores del libro: mover las caderas
   (tirar con el cuerpo en vez de doblar la columna) y no mantener una
   contraccion firme (rebotar sin apretar).
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

  /* ---------------- de perfil (mira a la izquierda), la polea atras ---------------- */

  var PISO = 1300;
  var POLEA = [1090, 92];
  var BASE = B.posePerfil.depie({ x: 720, piso: PISO });
  var CAD = U.suma(BASE.cadera, [22, 16]);     // la cadera un poco atras, rodillas apenas flexionadas

  function rodillaAdelante(cad, tob) {
    var r1 = B.ik(cad, tob, 272, 268, 1), r2 = B.ik(cad, tob, 272, 268, -1);
    return r1[0] < r2[0] ? r1 : r2;
  }

  // k 0 arriba .. 1 abajo (codos a las rodillas); cad 0..1 el error: en vez de
  // doblar la columna, la cadera se va atras y el tronco baja recto
  function crunch(k, cad) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)), c = clamp(cad || 0, 0, 1);
    var cadera = U.suma(CAD, [120 * c * e, 70 * c * e]);
    var curva = 0.95 * e * (1 - c);
    var ang = -100 - 50 * e;
    var cuello = U.suma(cadera, U.polar(ang, 404 * (1 - 0.1 * curva)));
    var pose = Object.assign({}, BASE, { cadera: cadera, cuello: cuello, curva: curva, cabeza: -6 - 14 * e * (1 - c), piso: PISO });
    pose.rodilla = rodillaAdelante(cadera, BASE.tobillo);
    pose.rodilla2 = rodillaAdelante(U.suma(cadera, [14, -6]), BASE.tobillo2);
    // las manos a los lados de la cabeza, los codos hacia adelante
    var g = B.geoPerfil({ pose: Object.assign({}, pose, { codo: cadera, mano: cadera }) });
    var mano = U.suma(U.lerpP(g.centroCabeza, g.menton, 0.55), U.polar(ang - 90, 18));
    var frente = U.polar(ang - 90, 1);
    var c1 = B.ik(g.hombro, mano, 232, 214, 1), c2 = B.ik(g.hombro, mano, 232, 214, -1);
    var d1 = (c1[0] - g.hombro[0]) * frente[0] + (c1[1] - g.hombro[1]) * frente[1];
    var d2 = (c2[0] - g.hombro[0]) * frente[0] + (c2[1] - g.hombro[1]) * frente[1];
    pose.codo = d1 > d2 ? c1 : c2;
    pose.mano = mano;
    pose.codo2 = U.suma(pose.codo, [14, -8]); pose.mano2 = U.suma(mano, [14, -8]);
    return pose;
  }

  function Maquina(props) {
    var nudo = props.nudo, sube = props.sube || 0;
    return (
      <g>
        <B.PisoG y={PISO + 4} x0={300} x1={1340} />
        <V.Sombra c={[700, PISO + 2]} rx={230} />
        {/* columna, viga y polea (atras de Tor) */}
        <rect x={1238} y={20} width={62} height={PISO - 20} rx={16} fill={BLANCO} {...LN} />
        <rect x={1010} y={14} width={300} height={48} rx={16} fill={BLANCO} {...LN} />
        {[0, 1, 2, 3, 4, 5].map(function (i) {
          var dy = i >= 4 ? -90 * sube : 0;
          return <rect key={i} x={1182} y={PISO - 56 - i * 44 + dy} width={174} height={38} rx={8}
            fill={i >= 4 ? C.YEL : C.GRY} stroke={C.INK} strokeWidth={11} />;
        })}
        <path d={'M 1269 62 L 1269 ' + (PISO - 56 - 5 * 44 - 90 * sube)} fill="none" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
        {/* cable de la polea al nudo de la cuerda */}
        <path d={'M ' + U.pt(U.suma(POLEA, [-22, 22])) + ' L ' + U.pt(nudo)} fill="none" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
        <circle cx={POLEA[0]} cy={POLEA[1]} r={34} fill={BLANCO} stroke={C.INK} strokeWidth={13} />
        <circle cx={POLEA[0]} cy={POLEA[1]} r={7} fill={C.INK} />
      </g>
    );
  }

  // la cuerda: del nudo (atras de la cabeza) a la mano
  function Cuerda(props) {
    var d = 'M ' + U.pt(props.nudo) + ' L ' + U.pt(props.mano);
    return (
      <g>
        <path d={d} fill="none" stroke={C.INK} strokeWidth={26} strokeLinecap="round" />
        <path d={d} fill="none" stroke={C.GRY} strokeWidth={10} strokeLinecap="round" />
        <circle cx={props.nudo[0]} cy={props.nudo[1]} r={16} fill={C.GRY} stroke={C.INK} strokeWidth={9} />
      </g>
    );
  }

  function nudoDe(g) {
    var dir = U.resta(POLEA, g.mano), L = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
    return U.suma(g.mano, [dir[0] / L * 120, dir[1] / L * 120]);
  }

  function Abdominal(props) {
    var pose = crunch(props.k, props.cad);
    var T = props.T;
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(T, props.fase || 0)}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function (g) {
          var nudo = nudoDe(g);
          return <g><Maquina nudo={nudo} sube={props.k} /><Cuerda nudo={nudo} mano={U.suma(g.mano, [14, -8])} /></g>;
        }}
        children={function (g) {
          return (
            <g>
              <Cuerda nudo={nudoDe(g)} mano={g.mano} />
              {props.extra ? props.extra(g) : null}
            </g>
          );
        }} />
    );
  }

  function panza(g) { return g.torso(0.36, g.anchoFrente(0.36) + 10); }
  // linea de la espalda: de la cadera a la nuca (se ve si se dobla o queda recta)
  function espalda(g, color) { return <B.Puntos pts={[g.cadera, g.torso(0.5, -g.anchoEspalda(0.5) - 30), g.nuca]} color={color} sw={15} />; }

  /* ---------------- encuadre ---------------- */

  var FIG = { x: -150, y: 300, s: 0.84 };
  function en(p) { return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s]; }
  var GEN = { zoom: 1, foco: en([800, 760]), mira: [540, 900] };

  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.16); }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tu abdominal en polea.',
      C: V.escena({
        fig: FIG, vibra: true,
        tomas: [[0, { zoom: 1.15, foco: en([700, 760]), mira: [540, 1000] }], [1, { zoom: 1.0, foco: en([780, 760]), mira: [540, 920] }]],
        figura: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 2, 0.35);
          return <Abdominal T={T} s={s} k={k} cad={1} muscRojo={{ abd: 1 }}
            extra={function (g) { return <g>{espalda(g, C.RED)}<V.Gotas T={T} c={g.centroCabeza} v={1} /></g>; }} />;
        },
        mal: [{ x: 830, y: 480, cuando: 0.2, s: 0.6 }, { x: 120, y: 520, cuando: 0.44, s: 0.5 }],
        r1: { text: 'ABDOMINAL EN POLEA', s: 1.15, cuando: 0.02 }
      }) },

    { nombre: 'Posición', dur: 5, vo: 'De espaldas a la polea alta, toma la cuerda a los lados de la cabeza e inclínate un poco desde la cadera.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, GEN], [0.16, { zoom: 1.4, foco: en([700, 560]), mira: [540, 1000] }], [0.46, { zoom: 1.4, foco: en([700, 560]), mira: [540, 1000] }],
          [0.62, { zoom: 1.2, foco: en([760, 860]), mira: [540, 1000] }], [0.86, { zoom: 1.2, foco: en([760, 860]), mira: [540, 1000] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var cuerda = animate({ from: 0, to: 1, start: f(0.14), end: f(0.26) })(T);
          var cad = animate({ from: 0, to: 1, start: f(0.58), end: f(0.7) })(T);
          return <Abdominal T={T} s={s} k={0}
            extra={function (g) {
              return (
                <g>
                  <B.Anillo c={g.mano} r={80} color={C.YEL} p={cuerda} />
                  <B.Anillo c={g.cadera} r={90} color={C.YEL} p={cad} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 830, y: 480, cuando: 0.32, s: 0.8 }, { x: 830, y: 480, cuando: 0.76, s: 0.8 }],
        r1: { text: 'ESPALDA A LA POLEA', s: 1.15, cuando: 0.1 },
        r2: { text: 'MANOS A LA CABEZA', s: 1.15, cuando: 0.56 }
      }) },

    { nombre: 'Ejecución', dur: 6, vo: 'Flexiona el tronco y lleva los codos hacia las rodillas. Vuelve lento, sin soltar la tensión.',
      C: V.escena({
        fig: FIG, pulsos: [0.25, 0.71],
        tomas: [[0, GEN], [0.3, { zoom: 1.12, foco: en([760, 800]), mira: [540, 940] }], [0.8, { zoom: 1.12, foco: en([760, 800]), mira: [540, 940] }], [1, GEN]],
        figura: function (T, f, t, s) {
          return (
            <V.Estela T={T} n={3} paso={0.07} dibujar={function (Tx, fantasma) {
              var k = reps(Tx, f(0.04), f(0.96), 2);
              return <Abdominal T={Tx} s={s} k={k} musc={{ abd: 0.3 + 0.7 * k }}
                extra={fantasma ? null : function (g) {
                  var camino = [0, 0.2, 0.4, 0.6, 0.8, 1].map(function (q) { return U.suma(crunch(q).codo, [-30, 0]); });
                  return (
                    <g>
                      <B.Puntos pts={camino} color={C.YEL} sw={12} p={1} />
                      <V.Chispa T={T} c={panza(g)} cuando={f(0.2)} r={100} />
                      <V.Chispa T={T} c={panza(g)} cuando={f(0.66)} r={100} />
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
        bien: [{ x: 830, y: 480, cuando: 0.5, s: 0.8 }],
        r1: { text: 'CODOS A LAS RODILLAS', s: 1.1, cuando: 0.08 },
        r2: { text: 'VUELVE LENTO', s: 1.2, cuando: 0.52 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'Trabaja el recto abdominal. Ayudan los oblicuos y los flexores de la cadera.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.3, foco: en([680, 760]), mira: [540, 1040] }], [0.6, { zoom: 1.34, foco: en([680, 780]), mira: [540, 1050] }], [1, { zoom: 1.1, foco: en([760, 780]), mira: [540, 940] }]],
        figura: function (T, f, t, s) {
          var m = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = animate({ from: 0, to: 1, start: f(0.56), end: f(0.68) })(T);
          return <Abdominal T={T} s={s} k={0.7} musc={{ abd: m }} muscGris={{ obl: sec, psoas: sec }}
            extra={function (g) { return <V.Brillo T={T} c={panza(g)} r={100} v={m} />; }} />;
        },
        r1: { text: 'RECTO ABDOMINAL', s: 1.2, cuando: 0.04 },
        r2: { text: '+ OBLICUOS', s: 1.2, cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: mover la cadera. La cadera queda quieta; lo que se dobla es la columna.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.12, foco: en([760, 800]), mira: [540, 960] }], [1, { zoom: 1.08, foco: en([760, 800]), mira: [540, 940] }]],
        figura: function (T, f, t, s) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var k = reps(T, f(0), f(1), 2, 0.42);
          return <Abdominal T={T} s={s} k={k} cad={1 - bien}
            muscRojo={bien < 0.5 ? { glu: 0.6 } : null} musc={bien >= 0.5 ? { abd: 1 } : null}
            extra={function (g) {
              var col = bien < 0.5 ? C.RED : C.GRN;
              return (
                <g>
                  {espalda(g, col)}
                  {bien < 0.5
                    ? <B.FlechaS a={U.suma(g.cadera, [30, -10])} b={U.suma(g.cadera, [150, 40])} color={C.RED} sw={14} />
                    : <B.Anillo c={g.cadera} r={80} color={C.GRN} p={1} />}
                </g>
              );
            }} />;
        },
        mal: [{ x: 830, y: 480, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 830, y: 480, cuando: 0.6 }],
        r1: { text: 'CADERA ATRÁS', s: 1.2, cuando: 0.04 },
        r2: { text: 'CADERA QUIETA', s: 1.2, cuando: 0.52 }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: rebotar sin apretar. Contrae fuerte abajo y aguanta un segundo.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.2, foco: en([700, 780]), mira: [540, 980] }], [1, { zoom: 1.15, foco: en([720, 780]), mira: [540, 960] }]],
        figura: function (T, f, t, s) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          // mal: rebotes cortos y rapidos a media altura; bien: baja del todo y aguanta
          var rebote = 0.35 + 0.25 * Math.sin(T * 13);
          var aguanta = animate({ from: 0, to: 1, start: f(0.56), end: f(0.7), ease: Easing.easeInOutSine })(T);
          var k = bien < 1 ? U.lerp(rebote, 0.35, bien) : U.lerp(0.35, 1, aguanta);
          return <Abdominal T={T} s={s} k={k}
            muscRojo={bien < 0.5 ? { abd: 0.5 } : null} musc={bien >= 0.5 ? { abd: 0.4 + 0.6 * aguanta } : null}
            extra={function (g) {
              return bien < 0.5
                ? <V.Lineas T={T} c={U.suma(g.centroCabeza, [30, -30])} dir={[-0.4, 1]} v={1} />
                : <g><V.Brillo T={T} c={panza(g)} r={100} v={aguanta} /><V.Chispa T={T} c={panza(g)} cuando={f(0.7)} r={100} /></g>;
            }} />;
        },
        mal: [{ x: 830, y: 480, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 830, y: 480, cuando: 0.72 }],
        r1: { text: 'REBOTAR SIN APRETAR', s: 1.1, cuando: 0.04 },
        r2: { text: 'APRIETA Y AGUANTA', s: 1.15, cuando: 0.52 }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace: cadera quieta y el abdomen bien apretado.',
      C: V.escena({
        fig: FIG, pulsos: [0.42],
        tomas: [[0, { zoom: 1.15, foco: en([740, 800]), mira: [540, 960] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var k = animate({ from: 0, to: 1, start: f(0.04), end: f(0.42), ease: Easing.easeInOutSine })(T);
          return <Abdominal T={T} s={s} k={k} musc={{ abd: 1 }}
            extra={function (g) { return <V.Chispa T={T} c={panza(g)} cuando={f(0.42)} r={110} />; }} />;
        },
        bien: [{ x: 830, y: 480, cuando: 0.44, s: 0.85 }],
        r1: { text: 'ABDOMINAL EN POLEA', s: 1.15, cuando: 0.06 },
        r2: { text: 'CADERA QUIETA', s: 1.2, cuando: 0.46 }
      }) }
  ];

  // la figura y su maquina, para otros reels (los top 3)
  global.PIEZAS = global.PIEZAS || {};
  global.PIEZAS.abdominalPolea = { pose: crunch, Figura: Abdominal };

  global.REELS.registrar({
    id: 'abdominal-polea', titulo: 'Abdominal en polea (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LO HACÍAS BIEN?', vo: '¿Lo hacías bien? Coméntalo, compártelo con tu compañero de gym y guárdalo.' }
  });
})(window);
