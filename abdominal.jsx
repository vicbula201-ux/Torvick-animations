/* ============================================================
   ABDOMINAL (crunch) — reel corto, ESTILO 2 (~33 s con el cierre)
   Fuente: libro, pag. 169. Boca arriba, rodillas dobladas y pies apoyados;
   las manos apenas detras de la cabeza, sin tirar de ella (o los brazos
   cruzados sobre el pecho). Contraer el abdomen y levantar los hombros y
   la parte alta de la espalda del suelo, con la barbilla un poco separada
   del pecho; bajar lento sin soltar el abdomen. Recto abdominal
   (principal); oblicuos y flexores de cadera; el transverso estabiliza.
   Error del libro: tirar de la cabeza con las manos (carga el cuello). El
   segundo sale de la ejecucion: dejarse caer de golpe.
   Es el primer reel hecho para el doblaje automatico (herramientas/locutor.py):
   las duraciones de las escenas salen de la voz generada.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, V = global.V;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;

  /* ---------------- de perfil, boca arriba (la cabeza a la derecha) ---------------- */

  var PISO = 1300, CADX = 560;

  // sube 0 acostado .. 1 hombros arriba; tira 0..1 las manos tiran de la cabeza (el error)
  function crunch(sube, tira) {
    tira = tira || 0;
    var e = Easing.easeInOutSine(clamp(sube, 0, 1));
    var p = B.posePerfil.acostado({ x: CADX, piso: PISO, piernas: 48, rodilla: 1 });
    var ang = 34 * e;
    var d = U.polar(-ang, 1);                        // de la cadera a la cabeza
    var frente = [d[1], -d[0]];                      // el pecho mira para arriba
    p.cuello = U.suma(p.cadera, U.por(d, 404));
    p.curva = 0.15 + 0.45 * e;
    p.cabeza = -8 - 10 * e - 34 * tira;
    p.pegado = { y: PISO, lumbar: 1, alto: 1 - e };
    p.cabezaEncima = true;    // la cabeza va delante del brazo (las manos detras de la nuca)
    delete p.hombro; delete p.hombro2;
    var g = B.geoPerfil({ pose: Object.assign({}, p, { codo: p.cadera, mano: p.cadera, codo2: p.cadera, mano2: p.cadera }) });
    var c = g.centroCabeza;
    // las manos detras de la cabeza; los codos abiertos (de perfil, hacia el techo)
    // o, cuando tira, cerrados hacia las rodillas
    p.mano = U.suma(U.suma(c, U.por(frente, -40 + 10 * tira)), U.por(d, -10 + 30 * tira));
    p.codo = U.suma(p.mano, U.suma(U.por(frente, 120 - 30 * tira), U.por(d, -90 - 130 * tira)));
    p.mano2 = U.suma(p.mano, [12, -6]);
    p.codo2 = U.suma(p.codo, [14, -8]);
    // los pies apoyados en el suelo y las rodillas arriba
    var A = [CADX - 330, PISO - 34];
    var r1 = B.ik(p.cadera, A, 272, 268, 1), r2 = B.ik(p.cadera, A, 272, 268, -1);
    p.rodilla = r1[1] < r2[1] ? r1 : r2;
    p.tobillo = A; p.punta = U.suma(A, [-112, 30]);
    p.rodilla2 = U.suma(p.rodilla, [24, -18]); p.tobillo2 = U.suma(A, [24, -6]); p.punta2 = U.suma(p.punta, [24, -6]);
    return p;
  }

  function Abd(props) {
    var pose = crunch(props.sube || 0, props.tira);
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, props.fase || 0)}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () {
          return (
            <g>
              <B.PisoG y={PISO + 26} x0={60} x1={1300} />
              <V.Sombra c={[640, PISO + 24]} rx={520} />
              <B.ColchonetaG x0={110} x1={1220} y={PISO + 4} />
            </g>
          );
        }}
        children={function (g) { return props.extra ? props.extra(g) : null; }} />
    );
  }

  function cuello(g) { return U.lerpP(g.cuello, g.centroCabeza, 0.35); }
  function panza(g) { return U.lerpP(g.cadera, g.cuello, 0.42); }

  /* ---------------- encuadre ---------------- */

  var FIG = { x: 20, y: 90, s: 0.8 };
  function en(p) { return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s]; }
  var GEN = { zoom: 1.02, foco: en([650, 1090]), mira: [540, 960] };

  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.42 : va, 0.14); }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tus abdominales.',
      C: V.escena({
        fig: FIG, vibra: true,
        tomas: [[0, { zoom: 1.3, foco: en([760, 1080]), mira: [540, 960] }], [1, { zoom: 1.06, foco: en([650, 1090]), mira: [540, 960] }]],
        figura: function (T, f, t, s) {
          var k = reps(T, f(0), f(1), 3, 0.3);
          return <Abd T={T} s={s} sube={0.2 + 0.8 * k} tira={1} muscRojo={{ abd: 0 }}
            extra={function (g) {
              return <g><B.Anillo c={cuello(g)} r={70} color={C.RED} p={1} /><V.Gotas T={T} c={g.centroCabeza} v={1} /></g>;
            }} />;
        },
        mal: [{ x: 120, y: 560, cuando: 0.2, s: 0.6 }, { x: 830, y: 560, cuando: 0.44, s: 0.5 }],
        r1: { text: 'ABDOMINALES', s: 1.3, cuando: 0.02 }
      }) },

    { nombre: 'Posición', dur: 5.5, vo: 'Acuéstate boca arriba, con las rodillas dobladas y los pies en el suelo. Las manos detrás de la cabeza, sin tirar.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, GEN], [0.14, { zoom: 1.8, foco: en([360, 1080]), mira: [540, 980] }],
          [0.44, { zoom: 1.8, foco: en([360, 1080]), mira: [540, 980] }], [0.6, { zoom: 1.9, foco: en([960, 1180]), mira: [540, 980] }],
          [0.86, { zoom: 1.9, foco: en([960, 1180]), mira: [540, 980] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var rod = animate({ from: 0, to: 1, start: f(0.14), end: f(0.26) })(T);
          var man = animate({ from: 0, to: 1, start: f(0.6), end: f(0.72) })(T);
          return <Abd T={T} s={s} sube={0}
            extra={function (g) {
              return (
                <g>
                  <B.Anillo c={g.rodilla} r={70} color={C.YEL} p={rod} />
                  <B.Anillo c={U.lerpP(g.tobillo, g.punta, 0.5)} r={70} color={C.YEL} p={rod} />
                  <B.Anillo c={g.mano} r={70} color={C.YEL} p={man} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 600, cuando: 0.32 }, { x: 860, y: 600, cuando: 0.76 }],
        r1: { text: 'RODILLAS DOBLADAS', cuando: 0.12 },
        r2: { text: 'MANOS EN LA NUCA', cuando: 0.6 }
      }) },

    { nombre: 'Ejecución', dur: 5.5, vo: 'Contrae el abdomen y levanta los hombros del suelo, con la barbilla un poco separada del pecho.',
      C: V.escena({
        fig: FIG, pulsos: [0.28, 0.73],
        tomas: [[0, GEN], [0.3, { zoom: 1.35, foco: en([820, 1020]), mira: [540, 960] }], [0.8, { zoom: 1.35, foco: en([820, 1020]), mira: [540, 960] }], [1, GEN]],
        figura: function (T, f, t, s) {
          return (
            <V.Estela T={T} n={3} paso={0.07} dibujar={function (Tx, fantasma) {
              var k = reps(Tx, f(0.04), f(0.96), 2);
              return <Abd T={Tx} s={s} sube={k} musc={{ abd: 0.3 + 0.7 * k }}
                extra={fantasma ? null : function (g) {
                  return (
                    <g>
                      {k > 0.85 ? <B.Puntos pts={[U.suma(g.centroCabeza, [-30, 70]), U.lerpP(g.cuello, g.cadera, 0.18)]} color={C.GRN} sw={12} p={1} /> : null}
                      <V.Chispa T={T} c={panza(g)} cuando={f(0.28)} r={90} />
                      <V.Chispa T={T} c={panza(g)} cuando={f(0.73)} r={90} />
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
        bien: [{ x: 860, y: 600, cuando: 0.6 }],
        r1: { text: 'SUBE LOS HOMBROS', cuando: 0.06 },
        r2: { text: 'BARBILLA SEPARADA', cuando: 0.5 }
      }) },

    { nombre: 'Músculos', dur: 4.5, vo: 'Trabaja el recto abdominal, con ayuda de los oblicuos.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.8, foco: en([760, 1060]), mira: [540, 980] }], [0.6, { zoom: 1.9, foco: en([760, 1060]), mira: [540, 980] }], [1, { zoom: 1.3, foco: en([720, 1060]), mira: [540, 960] }]],
        figura: function (T, f, t, s) {
          var m = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = animate({ from: 0, to: 1, start: f(0.56), end: f(0.68) })(T);
          return <Abd T={T} s={s} sube={0.8} musc={{ abd: m }} muscGris={{ obl: sec }}
            extra={function (g) { return <V.Brillo T={T} c={panza(g)} r={90} v={m} />; }} />;
        },
        r1: { text: 'RECTO ABDOMINAL', cuando: 0.04 },
        r2: { text: '+ OBLICUOS', s: 1.2, cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: tirar de la cabeza con las manos. Eso le carga el trabajo a tu cuello.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.5, foco: en([860, 1020]), mira: [540, 960] }], [1, { zoom: 1.4, foco: en([840, 1030]), mira: [540, 960] }]],
        figura: function (T, f, t, s) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          var k = 0.2 + 0.7 * reps(T, f(0), f(1), 2, 0.4);
          return <Abd T={T} s={s} sube={k} tira={1 - bien} musc={bien >= 0.5 ? { abd: 1 } : null}
            extra={function (g) {
              return bien < 0.5
                ? <B.Anillo c={cuello(g)} r={70} color={C.RED} p={1} />
                : <B.Anillo c={g.mano} r={60} color={C.GRN} p={1} />;
            }} />;
        },
        mal: [{ x: 120, y: 560, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 120, y: 560, cuando: 0.6 }],
        r1: { text: 'TIRAR DE LA CABEZA', cuando: 0.04 },
        r2: { text: 'LAS MANOS SOLO APOYAN', cuando: 0.52 }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: dejarte caer de golpe. Baja lento, sin soltar el abdomen.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.3, foco: en([780, 1040]), mira: [540, 960] }], [1, { zoom: 1.25, foco: en([760, 1040]), mira: [540, 960] }]],
        figura: function (T, f, t, s) {
          var bien = animate({ from: 0, to: 1, start: f(0.44), end: f(0.56), ease: Easing.easeInOutCubic })(T);
          // mal: sube y cae de golpe; bien: sube y baja lento
          var k = bien < 0.5 ? reps(T, f(0), f(0.44), 2, 0.75) : reps(T, f(0.5), f(1), 1, 0.3);
          var ant = bien < 0.5 ? reps(T - 0.05, f(0), f(0.44), 2, 0.75) : reps(T - 0.05, f(0.5), f(1), 1, 0.3);
          return <Abd T={T} s={s} sube={k} muscRojo={bien < 0.5 ? { abd: 1 } : null} musc={bien >= 0.5 ? { abd: 1 } : null}
            extra={function (g) {
              return bien < 0.5
                ? <V.Lineas c={g.centroCabeza} dir={[0, k < ant ? 1 : -1]} v={Math.abs(k - ant) * 7} largo={130} />
                : <B.Arco c={g.cadera} r={420} a0={-36} a1={-4} color={C.GRN} sw={14} p={1} />;
            }} />;
        },
        mal: [{ x: 120, y: 560, cuando: 0.14, s: 0.55, hasta: 0.46 }],
        bien: [{ x: 120, y: 560, cuando: 0.62 }],
        r1: { text: 'CAER DE GOLPE', s: 1.2, cuando: 0.04 },
        r2: { text: 'BAJA LENTO', s: 1.2, cuando: 0.52 }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hacen los abdominales.',
      C: V.escena({
        fig: FIG, pulsos: [0.4],
        tomas: [[0, { zoom: 1.2, foco: en([760, 1040]), mira: [540, 960] }], [1, GEN]],
        figura: function (T, f, t, s) {
          var k = animate({ from: 0, to: 1, start: f(0.04), end: f(0.4), ease: Easing.easeInOutSine })(T);
          return <Abd T={T} s={s} sube={0.9 * k} musc={{ abd: 1 }}
            extra={function (g) { return <V.Chispa T={T} c={panza(g)} cuando={f(0.4)} r={100} />; }} />;
        },
        bien: [{ x: 860, y: 600, cuando: 0.42, s: 0.85 }],
        r1: { text: 'ABDOMINALES', s: 1.3, cuando: 0.06 },
        r2: { text: 'ABDOMEN FIRME', cuando: 0.46 }
      }) }
  ];

  global.REELS.registrar({ id: 'abdominal', titulo: 'Abdominal (estilo 2)', estilo: 2, escenas: ESCENAS,
    cierreVo: '¿Quieres ver más videos como este? Sígueme para más contenido.' });
})(window);
