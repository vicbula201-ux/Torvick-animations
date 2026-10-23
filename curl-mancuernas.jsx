/* ============================================================
   CURL DE BICEPS CON MANCUERNAS — reel corto, ESTILO 2 (~32 s con el cierre)
   Fuente: libro de biomecanica, pag. 98. De pie, una mancuerna en cada
   mano con agarre neutro y los brazos extendidos; flexionar el codo de un
   brazo girando la muneca (supinacion) para terminar con la palma hacia
   arriba, torso inmovil; bajar controlado volviendo al agarre neutro y
   alternar. Biceps braquial (principal); braquial y braquiorradial.
   Errores: mover el cuerpo (impulso) y rotacion anticipada (girar antes
   de flexionar el codo).

   Estilo 2 (vivo.jsx): camara viva con tomas encadenadas, Tor que
   parpadea, brillo en el musculo, chispa arriba, lineas de velocidad,
   rotulos que entran deslizando y transicion de zoom entre escenas.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, V = global.V;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var A = global.REELS.ayudas;
  var Pos = A.Pos, Recorte = A.Recorte, Mal = A.Mal, Bien = A.Bien;

  /* ---------------- ritmo de una repeticion ---------------- */

  // flexion 0..1 dentro de una repeticion (k = fraccion del ciclo):
  // sube en el 40 %, aguanta el 10 % y baja lento en el 50 %
  function flexDe(k) {
    if (k <= 0 || k >= 1) return 0;
    if (k < 0.4) return Easing.easeInOutSine(k / 0.4);
    if (k < 0.5) return 1;
    return 1 - Easing.easeInOutSine((k - 0.5) / 0.5);
  }
  // supinacion: bien = acompana la flexion; anticipada = gira entera antes de doblar
  function giroDe(k, anticipado) {
    if (anticipado) {
      if (k <= 0 || k >= 1) return 0;
      if (k < 0.16) return Easing.easeInOutSine(k / 0.16);
      if (k < 0.6) return 1;
      return 1 - Easing.easeInOutSine((k - 0.6) / 0.4);
    }
    return Easing.easeInOutSine(clamp(flexDe(k) * 1.25, 0, 1));
  }
  // con giro anticipado el codo empieza tarde
  function flexAnticipada(k) { return k < 0.16 ? 0 : flexDe((k - 0.16) / 0.84); }

  function ciclo(T, a, b) { return b > a ? (T - a) / (b - a) : 0; }

  /* ---------------- de frente ---------------- */

  // th: flexion 0..1 por lado; gi: supinacion 0..1 por lado
  function poseFrente(th, gi) {
    var p = B.poseFrente.depie({});
    var g = B.geoFrente({ pose: p });
    ['izq', 'der'].forEach(function (k, i) {
      var l = i ? 1 : -1, q = p[k], S = g[k].hombro;
      var a = 145 * th[i] * Math.PI / 180;
      var E = U.suma(S, [l * 30, 196]);
      q.codo = E;
      q.mano = U.suma(E, [l * (22 - 12 * Math.sin(a)), 196 * Math.cos(a)]);
      q.kMano = 1 + 0.24 * Math.sin(a);
    });
    p.giro = gi;
    return p;
  }

  function Frente(props) {
    var th = props.th || [0, 0], gi = props.gi || [0, 0];
    var pose = poseFrente(th, gi);
    return (
      <B.Frente s={props.s} pose={pose} sinPiso boca={props.boca} parpadeo={V.parpadeo(props.T, props.fase || 0)}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () { return <V.Sombra c={[600, 1505]} rx={300} />; }}
        agarre={function (g) {
          return (
            <g>
              {['izq', 'der'].map(function (k, i) {
                // neutro: el eje apunta a la camara (se ve de tres cuartos para que se lea); supinada: de costado
                return <B.MancuernaG key={k} c={g[k].mano} ang={0} giro={0.72 * (1 - gi[i])} k={0.74 * g[k].kMano} />;
              })}
            </g>
          );
        }}
        children={function (g) { return props.extra ? props.extra(g) : null; }} />
    );
  }

  /* ---------------- de perfil (para el balanceo) ---------------- */

  var BASE = B.posePerfil.depie({ x: 700, piso: 1300 });
  function curlPerfil(sube, lean) {
    lean = lean || 0;
    var cadera = [700 - 1.6 * lean, 730 + 0.8 * lean];
    var cuello = U.suma(cadera, U.polar(-90.85 + lean, 404));
    var pose = Object.assign({}, BASE, { cadera: cadera, cuello: cuello, cabeza: -0.6 * lean });
    var g = B.geoPerfil({ pose: pose });
    var codo = U.suma(g.hombro, U.polar(92 + lean + 8 * sube, 232));
    pose.codo = codo;
    pose.mano = U.suma(codo, U.polar(92 + lean + 145 * Easing.easeInOutSine(sube), 214));
    pose.rodilla = B.ik(cadera, BASE.tobillo, 272, 268, -1);
    pose.rodilla2 = B.ik(U.suma(cadera, [14, -4]), BASE.tobillo2, 272, 268, -1);
    return pose;
  }

  function Perfil(props) {
    var pose = curlPerfil(props.sube, props.lean);
    return (
      <B.Perfil s={props.s} pose={pose} parpadeo={V.parpadeo(props.T, props.fase || 0)}
        musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () { return <V.Sombra c={[680, 1302]} rx={230} />; }}
        agarre={function (g) { return <B.MancuernaG c={g.mano} ang={0} giro={props.giro || 0} k={0.74} />; }}
        children={function (g) { return props.extra ? props.extra(g) : null; }} />
    );
  }

  /* ---------------- encuadre ---------------- */

  var FIGF = { x: -12, y: 80, s: 0.92 };     // de frente, cuerpo entero
  var FIG = { x: -95, y: 269, s: 0.95 };     // de perfil, cuerpo entero
  function en(p, base) { return [base.x + p[0] * base.s, base.y + p[1] * base.s]; }

  // punto del biceps de un lado (para el brillo), en coordenadas del viewBox
  function biceps(g, k) { return U.lerpP(g[k].hombro, g[k].codo, 0.6); }

  // flecha curva que muestra el giro de la muneca alrededor de la mano
  function giroMuneca(g, k, v, color) {
    if (v < 0.03) return null;
    var c = g[k].mano, l = g[k].lado;
    var a0 = l < 0 ? 200 : -20, a1 = a0 + l * -200 * v;
    return <B.Arco c={c} r={92 * g[k].kMano} a0={a0} a1={a1} color={color} sw={14} cabeza={28} />;
  }

  // lineas de velocidad de la mancuerna: velocidad medida entre dos instantes
  function estela(manoAhora, manoAntes) {
    var d = U.resta(manoAhora, manoAntes), v = clamp(U.largo(d) / 22, 0, 1);
    return <V.Lineas c={manoAhora} dir={d} v={v} largo={110} />;
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: curl con impulso, rapido y torcido; salen las X */
  function EscGancho(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var k = (ciclo(T, f(0), f(1)) * 2) % 1;
    var sube = Math.sin(k * Math.PI);
    var fig = M.pop(T, at - 0.6, 0.5);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} golpes={[0.2, 0.42]}
          tomas={[[0, { zoom: 1.35, foco: en([700, 620], FIG), mira: [540, 900] }], [1, { zoom: 1.05, foco: en([700, 700], FIG), mira: [540, 960] }]]}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Perfil T={T} s={FIG.s} sube={sube} lean={22 * sube} giro={clamp(sube * 1.6, 0, 1)} muscRojo={{ erec: sube, bic: 0.6 }}
              extra={function (g) {
                return (
                  <g>
                    <V.Gotas T={T} c={g.centroCabeza} v={1} />
                    <V.Lineas c={g.cuello} dir={[1, -0.2]} v={sube} largo={120} />
                  </g>
                );
              }} />
          </Pos>
        </V.Camara>
        <Mal T={T} cuando={f(0.2)} x={800} y={500} s={0.6} />
        <Mal T={T} cuando={f(0.42)} x={110} y={1120} s={0.5} />
        <V.Rot T={T} text="CURL CON MANCUERNAS" s={1} y={270} cuando={f(0.02)} />
      </div>
    );
  }

  /* 2 — posicion: agarre neutro, brazos estirados */
  function EscPosicion(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var fig = M.pop(T, at - 0.6, 0.5);
    var aro = animate({ from: 0, to: 1, start: f(0.12), end: f(0.24) })(T);
    var linea = M.draw(T, f(0.56), dur * 0.16);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur}
          tomas={[[0, { zoom: 1, foco: en([600, 820], FIGF) }], [0.3, { zoom: 2, foco: en([800, 980], FIGF), mira: [540, 1000] }],
            [0.55, { zoom: 2, foco: en([800, 980], FIGF), mira: [540, 1000] }], [0.85, { zoom: 1.08, foco: en([600, 820], FIGF) }]]}>
          <Pos x={FIGF.x} y={FIGF.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Frente T={T} s={FIGF.s}
              extra={function (g) {
                return (
                  <g>
                    {['izq', 'der'].map(function (k) {
                      var q = g[k];
                      return (
                        <g key={k}>
                          <B.Anillo c={q.mano} r={74} color={C.YEL} p={aro} />
                          <B.Puntos pts={[q.hombro, q.codo, q.mano]} color={C.GRN} sw={16} p={linea} />
                        </g>
                      );
                    })}
                  </g>
                );
              }} />
          </Pos>
        </V.Camara>
        <Bien T={T} cuando={f(0.74)} x={850} y={700} />
        <V.Rot T={T} text="AGARRE NEUTRO" y={270} cuando={f(0.1)} />
        <V.Rot T={T} text="BRAZOS ESTIRADOS" y={1490} cuando={f(0.56)} fase={0.4} />
      </div>
    );
  }

  /* 3 — ejecucion: sube girando la muneca, baja lento y alterna */
  function EscEjecucion(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var fig = M.pop(T, at - 0.6, 0.5);
    // brazo izquierdo de la imagen primero, despues el derecho
    var kI = ciclo(T, f(0.04), f(0.5)), kD = ciclo(T, f(0.5), f(0.96));
    var th = [flexDe(kI), flexDe(kD)], gi = [giroDe(kI), giroDe(kD)];
    var kIa = ciclo(T - 0.04, f(0.04), f(0.5)), kDa = ciclo(T - 0.04, f(0.5), f(0.96));
    var antes = poseFrente([flexDe(kIa), flexDe(kDa)], [0, 0]);
    var topeI = f(0.04) + 0.4 * (f(0.5) - f(0.04)), topeD = f(0.5) + 0.4 * (f(0.96) - f(0.5));
    var gAntes = B.geoFrente({ pose: antes });
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur}
          tomas={[[0, { zoom: 1.05, foco: en([600, 760], FIGF) }],
            [0.14, { zoom: 1.6, foco: en([400, 760], FIGF), mira: [520, 900] }], [0.42, { zoom: 1.6, foco: en([400, 760], FIGF), mira: [520, 900] }],
            [0.58, { zoom: 1.6, foco: en([800, 760], FIGF), mira: [560, 900] }], [0.88, { zoom: 1.6, foco: en([800, 760], FIGF), mira: [560, 900] }],
            [1, { zoom: 1.2, foco: en([600, 760], FIGF) }]]}>
          <Pos x={FIGF.x} y={FIGF.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Frente T={T} s={FIGF.s} th={th} gi={gi} musc={{ bic: [0.25 + 0.75 * th[0], 0.25 + 0.75 * th[1]] }}
              boca={th[0] > 0.9 || th[1] > 0.9 ? 'sonrisa' : null}
              extra={function (g) {
                return (
                  <g>
                    {estela(g.izq.mano, gAntes.izq.mano)}
                    {estela(g.der.mano, gAntes.der.mano)}
                    {giroMuneca(g, 'izq', gi[0] * (th[0] < 0.98 ? 1 : 0), C.YEL)}
                    {giroMuneca(g, 'der', gi[1] * (th[1] < 0.98 ? 1 : 0), C.YEL)}
                    <V.Chispa T={T} c={g.izq.mano} cuando={topeI} r={95} />
                    <V.Chispa T={T} c={g.der.mano} cuando={topeD} r={95} />
                  </g>
                );
              }} />
          </Pos>
        </V.Camara>
        <V.Rot T={T} text="SUBE Y GIRA" s={1.2} y={270} cuando={f(0.08)} />
        <V.Rot T={T} text="BAJA Y ALTERNA" y={1490} cuando={f(0.5)} fase={0.4} />
      </div>
    );
  }

  /* 4 — musculos: biceps braquial; braquial y braquiorradial */
  function EscMusculos(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var fig = M.pop(T, at - 0.6, 0.5);
    var bic = animate({ from: 0, to: 1, start: f(0.06), end: f(0.2) })(T);
    var ante = animate({ from: 0, to: 1, start: f(0.52), end: f(0.64) })(T);
    var per = 2.2, kI = ((T - at) / per) % 1, kD = ((T - at) / per + 0.5) % 1;
    var th = [0.15 + 0.85 * flexDe(kI), 0.15 + 0.85 * flexDe(kD)], gi = [giroDe(kI), giroDe(kD)];
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur}
          tomas={[[0, { zoom: 1.5, foco: en([600, 700], FIGF), mira: [540, 900] }], [1, { zoom: 1.75, foco: en([600, 680], FIGF), mira: [540, 900] }]]}>
          <Pos x={FIGF.x} y={FIGF.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Frente T={T} s={FIGF.s} th={th} gi={gi} boca="sonrisa" musc={{ bic: bic }} muscGris={{ ante: ante }}
              extra={function (g) {
                return (
                  <g>
                    <V.Brillo T={T} c={biceps(g, 'izq')} r={70} v={bic * Math.sin(Math.PI * th[0])} />
                    <V.Brillo T={T} c={biceps(g, 'der')} r={70} v={bic * Math.sin(Math.PI * th[1])} />
                  </g>
                );
              }} />
          </Pos>
        </V.Camara>
        <V.Rot T={T} text="BÍCEPS" s={1.3} y={270} cuando={f(0.06)} />
        <V.Rot T={T} text="+ BRAQUIAL Y BRAQUIORRADIAL" s={0.9} y={1490} cuando={f(0.5)} fase={0.4} />
      </div>
    );
  }

  /* comparaciones: dos franjas apiladas (mal arriba, bien abajo) */
  function Mitad(props) {
    var c = props.cmp, s = c.s;
    return (
      <Pos x={0} y={0} e={props.e} dx={props.dx} dy={props.dy} origen={'540px ' + (props.y + c.h / 2) + 'px'}>
        <Recorte x={0} y={props.y} w={1080} h={c.h} desde={c.desdeY * s}>
          <div style={{ position: 'absolute', left: 540 - c.centroX * s, top: 0 }}>{props.children}</div>
        </Recorte>
      </Pos>
    );
  }
  var CMP = { s: 0.74, desdeY: 110, h: 600, centroX: 660, yArriba: 300, yAbajo: 915 };      // de perfil
  var CMPF = { s: 0.76, desdeY: 320, h: 600, centroX: 600, yArriba: 290, yAbajo: 905 };     // de frente

  /* 5 — error 1: balancear el cuerpo */
  function EscError1(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var k = (ciclo(T, f(0), f(1)) * 2) % 1;
    var sube = flexDe(k);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var tronco = function (color) {
      return function (g) {
        var d = U.unidad(U.resta(g.cuello, g.cadera));
        return <B.Puntos pts={[U.suma(g.cadera, U.por(d, -60)), U.suma(g.cuello, U.por(d, 120))]} color={color} sw={16} />;
      };
    };
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} golpes={[0.14]}
          tomas={[[0, { zoom: 1 }], [1, { zoom: 1.04 }]]}>
          <Mitad cmp={CMP} y={CMP.yArriba} e={arriba} dx={M.vibra(T, 30, 2)} dy={M.life(T, 3.6, 4)}>
            <Perfil T={T} s={CMP.s} sube={sube} lean={22 * sube} giro={sube} muscRojo={{ erec: sube }}
              extra={function (g) {
                return <g>{tronco(C.RED)(g)}<V.Lineas c={g.cuello} dir={[1, -0.2]} v={sube} largo={130} /></g>;
              }} />
          </Mitad>
          <Mitad cmp={CMP} y={CMP.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
            <Perfil T={T} s={CMP.s} sube={sube} giro={sube} fase={1.1} musc={{ bic: sube }} extra={tronco(C.GRN)} />
          </Mitad>
        </V.Camara>
        <Mal T={T} cuando={f(0.14)} x={870} y={CMP.yArriba + 40} s={0.5} />
        <Bien T={T} cuando={f(0.56)} x={870} y={CMP.yAbajo + 40} />
        <V.Rot T={T} text="BALANCEO" s={1} y={250} cuando={f(0.04)} />
        <V.Rot T={T} text="TRONCO QUIETO" s={1} y={1530} cuando={f(0.36)} fase={0.4} />
      </div>
    );
  }

  /* 6 — error 2: rotacion anticipada (girar antes de doblar el codo) */
  function EscError2(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var k = (ciclo(T, f(0), f(1)) * 2) % 1;
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var thM = flexAnticipada(k), giM = giroDe(k, true);
    var thB = flexDe(k), giB = giroDe(k);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} golpes={[0.14]} tomas={[[0, { zoom: 1 }], [1, { zoom: 1.04 }]]}>
          <Mitad cmp={CMPF} y={CMPF.yArriba} e={arriba} dy={M.life(T, 3.6, 4)}>
            <Frente T={T} s={CMPF.s} th={[0, thM]} gi={[0, giM]} muscRojo={{ ante: [0, giM * (1 - thM)] }}
              extra={function (g) { return giroMuneca(g, 'der', giM * (thM < 0.2 ? 1 : 0), C.RED); }} />
          </Mitad>
          <Mitad cmp={CMPF} y={CMPF.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
            <Frente T={T} s={CMPF.s} th={[0, thB]} gi={[0, giB]} fase={1.3} musc={{ bic: [0, thB] }}
              extra={function (g) { return giroMuneca(g, 'der', giB * (thB < 0.98 ? 1 : 0), C.GRN); }} />
          </Mitad>
        </V.Camara>
        <Mal T={T} cuando={f(0.14)} x={870} y={CMPF.yArriba + 40} s={0.5} />
        <Bien T={T} cuando={f(0.56)} x={870} y={CMPF.yAbajo + 40} />
        <V.Rot T={T} text="GIRO ANTICIPADO" s={1} y={250} cuando={f(0.04)} />
        <V.Rot T={T} text="GIRA MIENTRAS SUBES" s={1} y={1530} cuando={f(0.36)} fase={0.4} />
      </div>
    );
  }

  /* 7 — cierre */
  function EscCierre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var fig = M.pop(T, at - 0.6, 0.5);
    var k = ciclo(T, f(0), f(0.9));
    var th = [flexDe(k), flexDe(k)], gi = [giroDe(k), giroDe(k)];
    var tope = f(0) + 0.4 * (f(0.9) - f(0));
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} pulsos={[0.36]}
          tomas={[[0, { zoom: 1.15, foco: en([600, 760], FIGF) }], [1, { zoom: 1.02, foco: en([600, 800], FIGF) }]]}>
          <Pos x={FIGF.x} y={FIGF.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Frente T={T} s={FIGF.s} th={th} gi={gi} boca="sonrisa" musc={{ bic: 1 }}
              extra={function (g) {
                return (
                  <g>
                    <V.Brillo T={T} c={biceps(g, 'izq')} r={70} v={Math.sin(Math.PI * th[0])} />
                    <V.Brillo T={T} c={biceps(g, 'der')} r={70} v={Math.sin(Math.PI * th[1])} />
                    <V.Chispa T={T} c={g.izq.mano} cuando={tope} r={80} />
                    <V.Chispa T={T} c={g.der.mano} cuando={tope} r={80} />
                  </g>
                );
              }} />
          </Pos>
        </V.Camara>
        <Bien T={T} cuando={f(0.34)} x={850} y={640} s={0.85} />
        <V.Rot T={T} text="CURL CON MANCUERNAS" s={1} y={270} cuando={f(0.06)} />
        <V.Rot T={T} text="TÉCNICA > PESO" y={1490} cuando={f(0.4)} fase={0.4} />
      </div>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, C: EscGancho,
      vo: 'Estás haciendo mal tu curl de bíceps.' },
    { nombre: 'Posición', dur: 4.5, C: EscPosicion,
      vo: 'De pie, una mancuerna en cada mano, palmas hacia el cuerpo y brazos estirados.' },
    { nombre: 'Ejecución', dur: 6, C: EscEjecucion,
      vo: 'Sube doblando el codo y gira la muñeca hasta que la palma mire arriba. Baja lento y alterna.' },
    { nombre: 'Músculos', dur: 4.5, C: EscMusculos,
      vo: 'Trabaja el bíceps; te ayudan el braquial y el braquiorradial.' },
    { nombre: 'Error 1', dur: 4.5, C: EscError1,
      vo: 'Error uno: balancear el cuerpo para subir. El tronco no se mueve.' },
    { nombre: 'Error 2', dur: 4.5, C: EscError2,
      vo: 'Error dos: girar la muñeca antes de doblar el codo. Gira mientras subes.' },
    { nombre: 'Cierre', dur: 2.5, C: EscCierre,
      vo: 'Así se hace. Técnica antes que peso.' }
  ];

  global.REELS.registrar({ id: 'curl-mancuernas', titulo: 'Curl con mancuernas (estilo 2)', estilo: 2, escenas: ESCENAS });
})(window);
