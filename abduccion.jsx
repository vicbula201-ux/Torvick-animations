/* ============================================================
   ABDUCCION DE CADERA EN MAQUINA — reel corto, ESTILO 2 (~34 s con el cierre)
   Fuente: libro, pag. 156. Sentado en la maquina con la espalda bien
   apoyada en el respaldo y las almohadillas contra la parte externa de
   los muslos; separar las piernas empujando hacia afuera y volver lento.
   Gluteo medio (principal); piriforme, obturador interno y tensor de la
   fascia lata. Errores: movimiento rapido y descontrolado, y mover el
   torso (inclinarse adelante, flexion lumbar).
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

  /* ---------------- de frente: sentado, las piernas se abren ---------------- */

  var X = 600, CAD_Y = 1000;
  var FBASE = B.poseFrente.depie({ x: X, piso: 1500 });

  // a 0 piernas juntas .. 1 abiertas
  function frente(a) {
    var e = Easing.easeInOutSine(clamp(a, 0, 1));
    var p = JSON.parse(JSON.stringify(FBASE));
    delete p.piso;
    p.centro = [X, CAD_Y];
    p.cuello = [X, CAD_Y - 344];
    [['izq', -1], ['der', 1]].forEach(function (k) {
      var q = p[k[0]], l = k[1];
      // manos en las manijas, al costado del asiento
      q.codo = [X + l * 248, 850];
      q.mano = [X + l * 270, 1020];
      // el muslo viene hacia la camara (corto) y la pierna cuelga
      q.rodilla = [X + l * (98 + 150 * e), CAD_Y + 86 - 10 * e];
      q.tobillo = U.suma(q.rodilla, [l * (8 + 26 * e), 236]);
      q.pieAng = 14 + 10 * e;
    });
    p.giro = [0, 0];
    return p;
  }

  function MaquinaFrente(props) {
    return (
      <g>
        {/* postes, respaldo y asiento */}
        <path d={'M ' + (X - 330) + ' 540 L ' + (X - 330) + ' 1400 M ' + (X + 330) + ' 540 L ' + (X + 330) + ' 1400 M ' +
          (X - 360) + ' 1400 L ' + (X + 360) + ' 1400'} fill="none" {...LN} />
        <rect x={X - 230} y={470} width={460} height={560} rx={40} fill={C.GRY} {...LN} />
        <rect x={X - 250} y={1000} width={500} height={60} rx={24} fill={C.GRY} {...LN} />
        {/* apoyapies */}
        <path d={'M ' + (X - 300) + ' 1356 L ' + (X + 300) + ' 1356'} fill="none" stroke={C.INK} strokeWidth={22} strokeLinecap="round" />
        {/* manijas */}
        <path d={'M ' + (X - 330) + ' 1010 L ' + (X - 250) + ' 1030 M ' + (X + 330) + ' 1010 L ' + (X + 250) + ' 1030'} fill="none" {...LN} />
      </g>
    );
  }

  // almohadilla por fuera de cada rodilla
  function Almohadillas(props) {
    var g = props.g;
    return (
      <g>
        {[['izq', -1], ['der', 1]].map(function (k) {
          var r = g[k[0]].rodilla, l = k[1];
          var cx = r[0] + l * 84;
          return (
            <g key={k[0]}>
              <path d={'M ' + U.pt([cx, r[1] + 70]) + ' L ' + U.pt([cx + l * 6, 1330])} fill="none" stroke={C.INK} strokeWidth={13} strokeLinecap="round" />
              <rect x={cx - 34} y={r[1] - 96} width={68} height={176} rx={30} fill={C.GRY} stroke={C.INK} strokeWidth={13} />
            </g>
          );
        })}
      </g>
    );
  }

  function Frente(props) {
    var pose = frente(props.a || 0);
    return (
      <B.Frente s={props.s} pose={pose} sinPiso parpadeo={V.parpadeo(props.T, props.fase || 0)} boca={props.boca}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () { return <g><V.Sombra c={[X, 1404]} rx={360} /><MaquinaFrente /></g>; }}
        children={function (g) {
          return <g><Almohadillas g={g} />{props.extra ? props.extra(g) : null}</g>;
        }} />
    );
  }

  /* ---------------- de perfil: la espalda contra el respaldo ---------------- */

  var PISO = 1300;
  var CADERA = [760, 960];
  var BASE = B.posePerfil.depie({ x: 700, piso: PISO });
  var RESP = 14;                       // el respaldo va inclinado hacia atras

  // lean grados hacia adelante (el error); curva la espalda se redondea
  function perfil(lean) {
    lean = lean || 0;
    var cuello = U.suma(CADERA, U.polar(-90 + RESP - lean, 400));
    var pose = Object.assign({}, BASE, { cadera: CADERA, cuello: cuello, curva: 0.5 * clamp(lean / 24, 0, 1), cabeza: -RESP + 0.6 * lean });
    var g = B.geoPerfil({ pose: pose });
    pose.codo = U.suma(g.hombro, U.polar(100 - RESP + lean, 230));
    pose.mano = U.suma(pose.codo, U.polar(176, 150));
    pose.rodilla = [470, 972];
    pose.tobillo = [452, 1238];
    pose.punta = U.suma(pose.tobillo, [-112, 32]);
    pose.rodilla2 = U.suma(pose.rodilla, [16, -8]);
    pose.tobillo2 = U.suma(pose.tobillo, [16, -6]);
    pose.punta2 = U.suma(pose.punta, [16, -6]);
    return pose;
  }

  function MaquinaPerfil() {
    var base = U.suma(CADERA, [76, 40]);
    var tope = U.suma(base, U.polar(-90 + RESP, 560));
    var n = U.unidad(U.resta(tope, base)), w = [-n[1] * 34, n[0] * 34];
    var resp = [U.suma(base, w), U.suma(tope, w), U.resta(tope, w), U.resta(base, w)];
    return (
      <g>
        <B.PisoG y={PISO + 4} x0={260} x1={1180} />
        <V.Sombra c={[700, PISO + 2]} rx={320} />
        {/* estructura y pila de placas atras */}
        <path d={'M 980 340 L 980 ' + PISO + ' M 900 1080 L 980 1080 M 700 1060 L 700 ' + PISO + ' M 420 1268 L 700 1268'} fill="none" {...LN} />
        {[0, 1, 2, 3].map(function (i) {
          return <rect key={i} x={1010} y={PISO - 52 - i * 42} width={130} height={36} rx={8} fill={C.GRY} stroke={C.INK} strokeWidth={11} />;
        })}
        <path d={'M 1075 ' + (PISO - 52 - 3 * 42) + ' L 1075 360 L 980 360'} fill="none" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
        {/* asiento y respaldo */}
        <rect x={500} y={990} width={380} height={58} rx={24} fill={C.GRY} {...LN} />
        <path d={'M ' + resp.map(U.pt).join(' L ') + ' Z'} fill={C.GRY} {...LN} />
      </g>
    );
  }

  // gluteo medio: abanico al costado de la cadera, de la cresta iliaca al trocanter
  function GluteoMedio(props) {
    var c = props.g.cadera, v = props.v;
    if (v < 0.02) return null;
    var q = function (dx, dy) { return U.pt(U.suma(c, [dx, dy])); };
    var d = 'M ' + q(-46, -96) + ' Q ' + q(16, -150) + ' ' + q(86, -102) + ' Q ' + q(74, -40) + ' ' + q(26, 4) +
      ' Q ' + q(0, 14) + ' ' + q(-14, -8) + ' Q ' + q(-34, -48) + ' ' + q(-46, -96) + ' Z';
    return (
      <g opacity={Math.min(1, 1.6 * v)}>
        <path d={d} fill={props.color || C.YEL} opacity={v} />
        <path d={'M ' + q(0, -110) + ' L ' + q(10, -20) + ' M ' + q(44, -112) + ' L ' + q(20, -14)} fill="none"
          stroke={C.INK} strokeWidth={8} strokeLinecap="round" opacity={0.5} />
        <path d={d} fill="none" stroke={C.INK} strokeWidth={11} strokeLinejoin="round" />
      </g>
    );
  }

  function Perfil(props) {
    var pose = perfil(props.lean);
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, props.fase || 0)}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () { return <MaquinaPerfil />; }}
        children={function (g) {
          var cAl = U.lerpP(g.cadera, g.rodilla, 0.74);
          return (
            <g>
              {/* almohadilla contra el muslo de este lado */}
              <rect x={cAl[0] - 70} y={cAl[1] - 58} width={140} height={110} rx={34} fill={C.GRY} stroke={C.INK} strokeWidth={13} />
              <GluteoMedio g={g} v={props.gmed || 0} color={props.gmedColor} />
              {props.extra ? props.extra(g) : null}
            </g>
          );
        }} />
    );
  }

  /* ---------------- encuadre ---------------- */

  var FIGF = { x: 30, y: 118, s: 0.85 };
  function enF(p) { return [FIGF.x + p[0] * FIGF.s, FIGF.y + p[1] * FIGF.s]; }
  var FIG = { x: -48, y: 248, s: 0.8 };
  function en(p) { return [FIG.x + p[0] * FIG.s, FIG.y + p[1] * FIG.s]; }
  var CMPF = { s: 0.8, desdeY: 600, h: 580, centroX: 600, yArriba: 310, yAbajo: 940 };
  var CMPP = { s: 0.8, desdeY: 340, h: 580, centroX: 660, yArriba: 310, yAbajo: 940 };

  function reps(T, a, b, n, va) { return V.ida(V.fase(T, a, b, n), va == null ? 0.4 : va, 0.12); }
  // flechas hacia afuera en las rodillas
  function afuera(g, color, p) {
    return (
      <g>
        {[['izq', -1], ['der', 1]].map(function (k) {
          var r = g[k[0]].rodilla, l = k[1];
          var a = U.suma(r, [l * 60, -150]);
          return <B.FlechaS key={k[0]} a={a} b={U.suma(a, [l * 120, 0])} color={color} sw={16} p={p} />;
        })}
      </g>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, vo: 'Estás haciendo mal tu abducción de cadera.',
      C: V.escena({
        fig: FIGF, vibra: true,
        tomas: [[0, { zoom: 1.3, foco: enF([600, 1000]), mira: [540, 1000] }], [1, { zoom: 1.08, foco: enF([600, 920]), mira: [540, 940] }]],
        figura: function (T, f, t, s) {
          var a = Math.abs(Math.sin(T * 7));
          var ant = Math.abs(Math.sin((T - 0.05) * 7));
          return <Frente T={T} s={s} a={a} boca="triste" muscRojo={{ tfl: 1 }}
            extra={function (g) {
              return (
                <g>
                  <V.Lineas c={U.suma(g.izq.rodilla, [-130, 0])} dir={[a > ant ? -1 : 1, 0]} v={Math.abs(a - ant) * 5} largo={110} />
                  <V.Lineas c={U.suma(g.der.rodilla, [130, 0])} dir={[a > ant ? 1 : -1, 0]} v={Math.abs(a - ant) * 5} largo={110} />
                  <V.Gotas T={T} c={g.cabeza} v={1} />
                </g>
              );
            }} />;
        },
        mal: [{ x: 830, y: 430, cuando: 0.2, s: 0.6 }, { x: 110, y: 1330, cuando: 0.44, s: 0.5 }],
        r1: { text: 'ABDUCCIÓN DE CADERA', s: 1.1, cuando: 0.02 }
      }) },

    { nombre: 'Posición', dur: 5, vo: 'Siéntate con la espalda bien apoyada y las almohadillas por fuera de los muslos.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.04, foco: en([660, 820]), mira: [540, 920] }], [0.2, { zoom: 1.7, foco: en([800, 700]), mira: [540, 1000] }],
          [0.45, { zoom: 1.7, foco: en([800, 700]), mira: [540, 1000] }], [0.62, { zoom: 1.9, foco: en([560, 960]), mira: [540, 1000] }],
          [0.86, { zoom: 1.9, foco: en([560, 960]), mira: [540, 1000] }], [1, { zoom: 1.04, foco: en([660, 820]), mira: [540, 920] }]],
        figura: function (T, f, t, s) {
          var espalda = M.draw(T, f(0.16), 0.6);
          var pad = animate({ from: 0, to: 1, start: f(0.6), end: f(0.72) })(T);
          return <Perfil T={T} s={s}
            extra={function (g) {
              var cAl = U.lerpP(g.cadera, g.rodilla, 0.74);
              var base = U.suma(g.cadera, [44, 10]);
              return (
                <g>
                  <B.Puntos pts={[base, U.suma(base, U.polar(-90 + RESP, 460))]} color={C.GRN} sw={14} p={espalda} />
                  <B.Anillo c={cAl} r={96} color={C.YEL} p={pad} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 560, cuando: 0.34 }, { x: 860, y: 560, cuando: 0.76 }],
        r1: { text: 'ESPALDA APOYADA', cuando: 0.12 },
        r2: { text: 'ALMOHADILLAS AFUERA', cuando: 0.6 }
      }) },

    { nombre: 'Ejecución', dur: 5.5, vo: 'Separa las piernas empujando hacia afuera y luego vuelve lento a la posición inicial.',
      C: V.escena({
        fig: FIGF, pulsos: [0.22, 0.67],
        tomas: [[0, { zoom: 1.08, foco: enF([600, 920]), mira: [540, 940] }], [0.3, { zoom: 1.3, foco: enF([600, 1040]), mira: [540, 1040] }],
          [0.8, { zoom: 1.3, foco: enF([600, 1040]), mira: [540, 1040] }], [1, { zoom: 1.08, foco: enF([600, 920]), mira: [540, 940] }]],
        figura: function (T, f, t, s) {
          var a = reps(T, f(0.04), f(0.94), 2);
          var ant = reps(T - 0.08, f(0.04), f(0.94), 2);
          var abre = a > ant;
          return <Frente T={T} s={s} a={a} musc={{ tfl: 0.3 + 0.7 * a }}
            extra={function (g) {
              return (
                <g>
                  {afuera(g, C.GRN, abre ? clamp(3 * (a - 0.1), 0, 1) : 0)}
                  <V.Chispa T={T} c={U.suma(g.izq.rodilla, [-90, 0])} cuando={f(0.22)} r={60} />
                  <V.Chispa T={T} c={U.suma(g.der.rodilla, [90, 0])} cuando={f(0.22)} r={60} />
                  <V.Chispa T={T} c={U.suma(g.izq.rodilla, [-90, 0])} cuando={f(0.67)} r={60} />
                  <V.Chispa T={T} c={U.suma(g.der.rodilla, [90, 0])} cuando={f(0.67)} r={60} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 560, cuando: 0.6 }],
        r1: { text: 'EMPUJA HACIA AFUERA', cuando: 0.06 },
        r2: { text: 'VUELVE LENTO', cuando: 0.5 }
      }) },

    { nombre: 'Músculos', dur: 5, vo: 'Trabaja el glúteo medio, con ayuda del piriforme y el tensor de la fascia lata.',
      C: V.escena({
        fig: FIG,
        tomas: [[0, { zoom: 1.45, foco: en([760, 880]), mira: [540, 1000] }], [0.6, { zoom: 1.5, foco: en([760, 880]), mira: [540, 1010] }],
          [1, { zoom: 1.25, foco: en([720, 840]), mira: [540, 960] }]],
        figura: function (T, f, t, s) {
          var gm = animate({ from: 0, to: 1, start: f(0.04), end: f(0.18) })(T);
          var sec = animate({ from: 0, to: 1, start: f(0.56), end: f(0.68) })(T);
          return <Perfil T={T} s={s} gmed={gm} muscGris={{ tfl: sec }}
            extra={function (g) { return <V.Brillo T={T} c={U.suma(g.cadera, [24, -60])} r={80} v={gm} />; }} />;
        },
        r1: { text: 'GLÚTEO MEDIO', s: 1.25, cuando: 0.04 },
        r2: { text: '+ PIRIFORME Y TENSOR', cuando: 0.54 }
      }) },

    { nombre: 'Error 1', dur: 4.5, vo: 'Error uno: hacerlo rápido y sin control. Las almohadillas vuelven lento.',
      C: V.escena({
        comparar: {
          cmp: CMPF,
          mal: function (T, f, t, s) {
            var a = Math.abs(Math.sin((T - f(0)) * 7));
            var ant = Math.abs(Math.sin((T - f(0) - 0.05) * 7));
            return <Frente T={T} s={s} a={a} muscRojo={{ tfl: 1 }}
              extra={function (g) {
                return (
                  <g>
                    <V.Lineas c={U.suma(g.izq.rodilla, [-130, 0])} dir={[a > ant ? -1 : 1, 0]} v={Math.abs(a - ant) * 5} largo={110} />
                    <V.Lineas c={U.suma(g.der.rodilla, [130, 0])} dir={[a > ant ? 1 : -1, 0]} v={Math.abs(a - ant) * 5} largo={110} />
                  </g>
                );
              }} />;
          },
          bien: function (T, f, t, s) {
            var a = reps(T, f(0.3), f(1), 1, 0.4);
            return <Frente T={T} s={s} a={a} fase={1.2} musc={{ tfl: 1 }}
              extra={function (g) { return afuera(g, C.GRN, 1); }} />;
          }
        },
        r1: { text: 'RÁPIDO Y SIN CONTROL', cuando: 0.04 },
        r2: { text: 'LENTO Y CONTROLADO', cuando: 0.36 }
      }) },

    { nombre: 'Error 2', dur: 4.5, vo: 'Error dos: inclinar el torso hacia adelante. Espalda y cadera pegadas al respaldo.',
      C: V.escena({
        comparar: {
          cmp: CMPP,
          mal: function (T, f, t, s) {
            var lean = 26 + 4 * Math.sin(T * 5);
            return <Perfil T={T} s={s} lean={lean} muscRojo={{ erec: 1 }} />;
          },
          bien: function (T, f, t, s) {
            return <Perfil T={T} s={s} fase={1.1} gmed={1}
              extra={function (g) {
                var base = U.suma(g.cadera, [44, 10]);
                return <B.Puntos pts={[base, U.suma(base, U.polar(-90 + RESP, 460))]} color={C.GRN} sw={14} p={1} />;
              }} />;
          }
        },
        r1: { text: 'TORSO HACIA ADELANTE', cuando: 0.04 },
        r2: { text: 'ESPALDA EN EL RESPALDO', cuando: 0.36 }
      }) },

    { nombre: 'Cierre', dur: 3, vo: 'Así se hace. Lento y con la espalda apoyada.',
      C: V.escena({
        fig: FIGF, pulsos: [0.4],
        tomas: [[0, { zoom: 1.3, foco: enF([600, 1000]), mira: [540, 1000] }], [1, { zoom: 1.08, foco: enF([600, 920]), mira: [540, 940] }]],
        figura: function (T, f, t, s) {
          var a = animate({ from: 0, to: 1, start: f(0.06), end: f(0.4), ease: Easing.easeInOutSine })(T);
          return <Frente T={T} s={s} a={a} musc={{ tfl: 1 }} boca="sonrisa"
            extra={function (g) {
              return (
                <g>
                  <V.Chispa T={T} c={U.suma(g.izq.rodilla, [-90, 0])} cuando={f(0.4)} r={70} />
                  <V.Chispa T={T} c={U.suma(g.der.rodilla, [90, 0])} cuando={f(0.4)} r={70} />
                </g>
              );
            }} />;
        },
        bien: [{ x: 860, y: 560, cuando: 0.4, s: 0.85 }],
        r1: { text: 'ABDUCCIÓN DE CADERA', s: 1.1, cuando: 0.06 },
        r2: { text: 'LENTO Y APOYADO', cuando: 0.46 }
      }) }
  ];

  global.REELS.registrar({ id: 'abduccion', titulo: 'Abducción de cadera (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
