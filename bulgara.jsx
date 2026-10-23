/* ============================================================
   SENTADILLA BULGARA — reel corto, ESTILO 2 (~34 s con el cierre)
   Fuente: libro, pag. 143. De espaldas a un banco, el empeine de un pie
   apoyado atras y el otro pie adelante; bajar hasta que la rodilla de
   atras casi toque el suelo, con el torso recto y la mirada al frente, y
   subir empujando con el talon de adelante. Cuadriceps y gluteo mayor.
   Errores: equilibrio inadecuado y valgo dinamico (la rodilla de adelante
   se va hacia adentro).
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

  /* ---------------- de perfil (mira a la izquierda, el banco atras) ---------------- */

  var PISO = 1300;
  var BASE = B.posePerfil.depie({ x: 700, piso: PISO });
  var TOB = [520, PISO - 32], PUNTA = [408, PISO];          // pie de adelante
  var TOB2 = [880, 1030], PUNTA2 = [994, 1058];              // empeine sobre el banco
  var ARRIBA = [690, 770], ABAJO = [705, 985];

  // k 0 arriba .. 1 abajo; lean grados (+ atras); brazos: los brazos se abren (error)
  function bulgara(k, lean, brazos) {
    lean = lean || 0; brazos = brazos || 0;
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var cadera = U.suma(U.lerpP(ARRIBA, ABAJO, e), [1.5 * lean, 0]);
    var cuello = U.suma(cadera, U.polar(-95 - 3 * e + lean, 404));
    var pose = Object.assign({}, BASE, { cadera: cadera, cuello: cuello, cabeza: -0.5 * lean });
    var g = B.geoPerfil({ pose: pose });
    pose.codo = U.suma(g.hombro, U.polar(93 + lean + brazos, 232));
    pose.mano = U.suma(pose.codo, U.polar(91 + lean + 1.4 * brazos, 214));
    pose.codo2 = U.suma(g.hombro2, U.polar(93 + lean - brazos, 232));
    pose.mano2 = U.suma(pose.codo2, U.polar(91 + lean - 1.4 * brazos, 214));
    pose.tobillo = TOB; pose.punta = PUNTA;
    pose.rodilla = B.ik(cadera, TOB, 272, 268, -1);
    pose.tobillo2 = TOB2; pose.punta2 = PUNTA2;
    pose.rodilla2 = B.ik(U.suma(cadera, [14, -4]), TOB2, 272, 268, -1);
    return pose;
  }

  function Banco() {
    return (
      <g>
        <path d={'M 900 1110 L 880 ' + PISO + ' M 1120 1110 L 1140 ' + PISO + ' M 890 1210 L 1130 1210'} fill="none" {...LN} />
        <rect x={830} y={1064} width={360} height={50} rx={20} fill={C.GRY} {...LN} />
      </g>
    );
  }

  function Perfil(props) {
    var pose = bulgara(props.k || 0, props.lean, props.brazos);
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, props.fase || 0)}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () {
          return <g><B.PisoG y={PISO + 4} x0={240} x1={1260} /><V.Sombra c={[520, PISO + 2]} rx={150} /><Banco /></g>;
        }}
        agarre={function (g) { return <B.MancuernaG c={g.mano} ang={0} giro={0} k={0.7} />; }}
        children={function (g) { return props.extra ? props.extra(g) : null; }} />
    );
  }

  /* ---------------- de frente (para la rodilla) ---------------- */

  var FR = { x: 600, piso: 1500 };
  var FBASE = B.poseFrente.depie({ x: FR.x, piso: FR.piso, pies: 100 });
  var TOBY = FR.piso - 32;

  // k 0 arriba .. 1 abajo; valgo 0..1 la rodilla de adelante (izq de la imagen) se va adentro
  function frente(k, valgo) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var p = JSON.parse(JSON.stringify(FBASE));
    var y = U.lerp(FBASE.centro[1] + 50, TOBY - 300, e), dy = y - FBASE.centro[1];
    p.centro = [FR.x, y];
    p.cuello = [FR.x, y - 360];
    ['izq', 'der'].forEach(function (lado) {
      p[lado].codo = U.suma(p[lado].codo, [0, dy]);
      p[lado].mano = U.suma(p[lado].mano, [0, dy]);
    });
    // adelante: el muslo viene hacia la camara (se acorta) y la pierna baja al pie
    var cad = [FR.x - 86, y], tob = [FR.x - 110, TOBY];
    var rod = U.lerpP(U.lerpP(cad, tob, 0.5), [cad[0] - 14, y + 150], e);
    p.izq.rodilla = U.suma(rod, [125 * (valgo || 0) * e, 6 * (valgo || 0) * e]);
    p.izq.tobillo = tob;
    // atras: la rodilla baja casi al piso; la pierna se va hacia el banco (no se ve el pie)
    var rod2 = [FR.x + 100 + 4 * e, U.lerp(y + 210, TOBY - 34, e)];
    p.der.rodilla = rod2;
    p.der.tobillo = U.suma(rod2, [4, -26]);
    p.der.sinZapato = true;
    p.giro = [0, 0];
    return p;
  }

  function Frente(props) {
    var pose = frente(props.k || 0, props.valgo);
    return (
      <B.Frente s={props.s} pose={pose} sinPiso parpadeo={V.parpadeo(props.T, props.fase || 0)} boca={props.boca}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () { return <g><B.PisoG y={FR.piso + 4} x0={260} x1={940} /><V.Sombra c={[FR.x, FR.piso + 4]} rx={260} /></g>; }}
        agarre={function (g) {
          return (
            <g>
              {['izq', 'der'].map(function (k) {
                return <B.MancuernaG key={k} c={g[k].mano} ang={0} giro={0.72} k={0.7} />;
              })}
            </g>
          );
        }}
        children={function (g) { return props.extra ? props.extra(g) : null; }} />
    );
  }

  // guia vertical del pie de adelante a la rodilla
  function guia(g, color, p) {
    var q = g.izq;
    return <B.Puntos pts={[[q.medioPie[0], FR.piso - 10], [q.medioPie[0], q.rodilla[1] - 90]]} color={color} sw={14} p={p == null ? 1 : p} />;
  }

  /* ---------------- encuadre ---------------- */

  var FIG = { x: -67, y: 314, s: 0.82 };
  function en(p) { return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s]; }
  var GEN = { zoom: 1.04, foco: en([740, 715]), mira: [540, 900] };
  var FIGF = { x: 60, y: 240, s: 0.8 };
  function enF(p) { return [FIGF.x + p[0] * FIGF.s, FIGF.y + p[1] * FIGF.s]; }
  var CMPF = { s: 0.95, desdeY: 890, h: 580, centroX: 600, yArriba: 310, yAbajo: 940 };

  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.42 : va, 0.14); }
  // balanceo: el torso y los brazos se van para los lados
  function tambaleo(T, v) { return v * (7 * Math.sin(T * 7.1) + 4 * Math.sin(T * 12.7 + 1)); }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tu sentadilla búlgara.',
      C: V.escena({
        fig: FIGF, vibra: true,
        tomas: [[0, { zoom: 1.6, foco: enF([600, 1120]), mira: [540, 1040] }], [1, { zoom: 1.4, foco: enF([600, 1080]), mira: [540, 1000] }]],
        figura: function (T, f, t, s) {
          return <Frente T={T} s={s} k={0.75 + 0.2 * Math.sin(T * 5)} valgo={1} boca="triste" muscRojo={{ cuad: [1, 0] }}
            extra={function (g) { return <g>{guia(g, C.RED)}<V.Gotas T={T} c={g.cabeza} v={1} /></g>; }} />;
        },
        mal: [{ x: 840, y: 420, cuando: 0.2, s: 0.6 }, { x: 90, y: 1330, cuando: 0.44, s: 0.5 }],
        r1: { text: 'SENTADILLA BÚLGARA', s: 1.15, cuando: 0.02 }
      }) },

    { nombre: 'Posición', dur: 5.5, vo: 'De espaldas a un banco, apoya el empeine de un pie atrás y el otro pie adelante.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, GEN], [0.18, { zoom: 2, foco: en([960, 1060]), mira: [540, 1000] }],
          [0.45, { zoom: 2, foco: en([960, 1060]), mira: [540, 1000] }], [0.62, { zoom: 2, foco: en([480, 1230]), mira: [540, 1000] }],
          [0.85, { zoom: 2, foco: en([480, 1230]), mira: [540, 1000] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var atras = animate({ from: 0, to: 1, start: f(0.16), end: f(0.28) })(T);
          var adel = animate({ from: 0, to: 1, start: f(0.6), end: f(0.72) })(T);
          return <Perfil T={T} s={s} k={0}
            extra={function (g) {
              return (
                <g>
                  <B.Anillo c={U.lerpP(g.tobillo2, g.punta2, 0.5)} r={80} color={C.YEL} p={atras} />
                  <B.Anillo c={U.lerpP(g.tobillo, g.punta, 0.5)} r={80} color={C.YEL} p={adel} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 700, cuando: 0.34 }, { x: 860, y: 700, cuando: 0.76 }],
        r1: { text: 'PIE ATRÁS EN EL BANCO', cuando: 0.12 },
        r2: { text: 'EL OTRO ADELANTE', cuando: 0.6 }
      }) },

    { nombre: 'Bajada', dur: 5.5, vo: 'Baja hasta que la rodilla de atrás casi toque el suelo, con el torso recto.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, GEN], [0.3, { zoom: 1.3, foco: en([740, 960]), mira: [540, 1000] }],
          [0.62, { zoom: 1.3, foco: en([740, 960]), mira: [540, 1000] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var k = animate({ from: 0, to: 1, start: f(0.04), end: f(0.36), ease: Easing.easeInOutSine })(T) -
            animate({ from: 0, to: 1, start: f(0.7), end: f(0.95), ease: Easing.easeInOutSine })(T);
          var marca = animate({ from: 0, to: 1, start: f(0.36), end: f(0.46) })(T);
          var torso = M.draw(T, f(0.62), 0.5);
          return <Perfil T={T} s={s} k={k} musc={{ cuad: k, glu: k }}
            extra={function (g) {
              return (
                <g>
                  <B.Anillo c={U.suma(g.rodilla2, [0, 30])} r={60} color={C.YEL} p={marca} />
                  <B.Puntos pts={[[g.rodilla2[0], g.rodilla2[1] + 40], [g.rodilla2[0], PISO - 4]]} color={C.YEL} sw={12} p={marca} />
                  {torso > 0.02 ? <B.Puntos pts={[g.cadera, g.cuello, U.suma(g.cuello, U.resta(g.cuello, g.cadera).map(function (v) { return v * 0.25; }))]} color={C.GRN} sw={14} p={torso} /> : null}
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 640, cuando: 0.72 }],
        r1: { text: 'RODILLA CASI AL SUELO', cuando: 0.1 },
        r2: { text: 'TORSO RECTO', cuando: 0.62 }
      }) },

    { nombre: 'Subida', dur: 5, vo: 'Sube empujando con el talón de adelante. Trabajan el cuádriceps y el glúteo.',
      C: V.escena({
        fig: FIG, pulsos: [0.34],
        tomas: [[0, { zoom: 1.3, foco: en([640, 1000]), mira: [540, 1040] }], [0.4, { zoom: 1.12, foco: en([700, 800]), mira: [540, 920] }],
          [1, { zoom: 1.3, foco: en([680, 880]), mira: [540, 1000] }]],
        figura: function (T, f, t, s) {
          var k = 1 - animate({ from: 0, to: 1, start: f(0.06), end: f(0.34), ease: Easing.easeInOutSine })(T);
          var talon = animate({ from: 0, to: 1, start: f(0.02), end: f(0.12) })(T);
          var mus = animate({ from: 0, to: 1, start: f(0.48), end: f(0.6) })(T);
          return <Perfil T={T} s={s} k={k} musc={{ cuad: Math.max(1 - k, mus), glu: Math.max(1 - k, mus) }} muscGris={{ isq: mus }}
            extra={function (g) {
              var cuad = U.lerpP(g.cadera, g.rodilla, 0.72);
              return (
                <g>
                  <B.Anillo c={U.suma(g.tobillo, [10, 10])} r={56} color={C.YEL} p={talon * (1 - mus)} />
                  <B.FlechaS a={U.suma(g.tobillo, [40, -40])} b={U.suma(g.tobillo, [40, -300])} color={C.GRN} sw={16} p={talon * (1 - mus)} />
                  <V.Brillo T={T} c={cuad} r={80} v={mus} />
                  <V.Chispa T={T} c={g.cadera} cuando={f(0.34)} r={90} />
                </g>
              );
            }} />;
        },
        r1: { text: 'EMPUJA CON EL TALÓN', cuando: 0.04 },
        r2: { text: 'CUÁDRICEPS Y GLÚTEO', cuando: 0.5 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: perder el equilibrio. Baja lento y mantén la postura firme.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, GEN], [0.5, { zoom: 1.1, foco: en([740, 715]), mira: [540, 900] }], [1, GEN]],
        golpes: [0.3],
        figura: function (T, f, t, s) {
          var firme = animate({ from: 0, to: 1, start: f(0.46), end: f(0.56) })(T);
          var w = tambaleo(T, 1 - firme);
          var k = 0.5 + 0.3 * Math.sin((T - f(0)) * 2.4);
          var lineaV = firme > 0.02;
          return <Perfil T={T} s={s} k={k} lean={w} brazos={(1 - firme) * (28 + 22 * Math.sin(T * 6.3))}
            muscRojo={firme < 0.5 ? { erec: 1 - 2 * firme } : null} musc={firme > 0.5 ? { cuad: firme, glu: firme } : null}
            extra={function (g) {
              return (
                <g>
                  {firme < 0.9 ? <V.Gotas T={T} c={g.centroCabeza} v={1 - firme} /> : null}
                  {lineaV ? <B.Puntos pts={[[g.cadera[0], PISO - 10], [g.cadera[0], g.coronilla[1] - 40]]} color={C.GRN} sw={14} p={firme} /> : null}
                </g>
              );
            }} />;
        },
        mal: [{ x: 860, y: 640, cuando: 0.12, s: 0.55, hasta: 0.5 }],
        bien: [{ x: 860, y: 640, cuando: 0.6 }],
        r1: { text: 'SIN EQUILIBRIO', s: 1.2, cuando: 0.04 },
        r2: { text: 'LENTO Y FIRME', cuando: 0.52 }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: dejar que la rodilla se vaya hacia adentro. Apúntala hacia el pie.',
      C: V.escena({
        comparar: {
          cmp: CMPF,
          mal: function (T, f, t, s) {
            var k = reps(T, f(0), f(1), 2, 0.4);
            return <Frente T={T} s={s} k={k} valgo={1} muscRojo={{ cuad: [k, 0] }}
              extra={function (g) { return guia(g, C.RED); }} />;
          },
          bien: function (T, f, t, s) {
            var k = reps(T, f(0), f(1), 2, 0.4);
            return <Frente T={T} s={s} k={k} fase={1.1} musc={{ cuad: [1, 0] }}
              extra={function (g) { return guia(g, C.GRN); }} />;
          }
        },
        r1: { text: 'RODILLA HACIA ADENTRO', cuando: 0.04 },
        r2: { text: 'RODILLA HACIA EL PIE', cuando: 0.36 }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace. Lento, firme y con la rodilla alineada.',
      C: V.escena({
        fig: FIG, pulsos: [0.4],
        tomas: [[0, { zoom: 1.25, foco: en([700, 900]), mira: [540, 940] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var k = 1 - animate({ from: 0, to: 1, start: f(0.06), end: f(0.4), ease: Easing.easeInOutSine })(T);
          return <Perfil T={T} s={s} k={k} musc={{ cuad: 1, glu: 1 }}
            extra={function (g) { return <V.Chispa T={T} c={g.cadera} cuando={f(0.4)} r={90} />; }} />;
        },
        bien: [{ x: 860, y: 640, cuando: 0.4, s: 0.85 }],
        r1: { text: 'SENTADILLA BÚLGARA', s: 1.15, cuando: 0.06 },
        r2: { text: 'LENTO Y FIRME', cuando: 0.46 }
      }) }
  ];

  global.REELS.registrar({ id: 'bulgara', titulo: 'Sentadilla búlgara (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
