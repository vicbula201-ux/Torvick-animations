/* ============================================================
   FONDOS EN PARALELAS — reel corto (~30 s con el cierre de marca)
   Fuente: libro de biomecanica, pag. 46. Brazos extendidos y cuerpo
   suspendido, inclinado un poco adelante; bajar hasta codos ~90 grados
   y empujar. Errores: echarse atras (menos pecho, mas estres en el
   hombro) y moverse rapido o balancearse.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var A = global.REELS.ayudas;
  var Pos = A.Pos, Rot = A.Rot, Camara = A.Camara, Recorte = A.Recorte, Mal = A.Mal, Bien = A.Bien;
  var BLANCO = '#ffffff';

  var MANO = [600, 760];      // mano sobre la barra cercana
  var PISO = 1350;

  /* ---------------- pose en las paralelas ---------------- */

  // baja: 0 arriba (brazos estirados) .. 1 abajo (codo a ~90 grados)
  // incl: inclinacion del tronco hacia adelante en grados (25 = correcto, -8 = echado atras)
  // gira: balanceo de todo el cuerpo alrededor de las manos (grados)
  function enParalelas(baja, incl, gira) {
    if (incl == null) incl = 24;
    var arriba = U.suma(MANO, U.polar(-90 + incl * 0.25, 438));
    var abajo = U.suma(MANO, U.polar(-90 - 12 - incl * 0.5, 314));
    var hombro = U.lerpP(arriba, abajo, Easing.easeInOutSine(baja));
    var dirTronco = -90 - incl;
    var cuello = U.suma(hombro, U.polar(dirTronco, 60));
    var cadera = U.suma(cuello, U.polar(dirTronco + 180, 404));
    var rodilla = U.suma(cadera, U.polar(96 - incl * 0.4, 272));
    var tobillo = U.suma(rodilla, U.polar(22, 262));
    var punta = U.suma(tobillo, U.polar(60, 110));
    var codo = B.ik(hombro, MANO, 232, 214, 1);
    var pose = {
      cadera: cadera, cuello: cuello, hombro: hombro, curva: 0, cabeza: 6,
      codo: codo, mano: MANO,
      hombro2: U.suma(hombro, [14, -10]), codo2: U.suma(codo, [14, -10]), mano2: U.suma(MANO, [14, -10]),
      rodilla: rodilla, tobillo: tobillo, punta: punta,
      rodilla2: U.suma(rodilla, [30, -6]), tobillo2: U.suma(tobillo, [-40, 20]), punta2: U.suma(punta, [-44, 10]),
      piso: PISO
    };
    if (gira) pose = B.posePerfil.girar(pose, MANO, gira);
    return pose;
  }

  // la estacion de paralelas de costado: la barra cercana corre de frente a atras
  function Paralelas() {
    var ln = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };
    var y = MANO[1] + 30;
    return (
      <g>
        <path d={'M 300 ' + y + ' L 300 ' + (PISO - 20) + ' M 960 ' + y + ' L 960 ' + (PISO - 20)}
          fill="none" {...ln} strokeWidth={34} />
        <path d={'M 300 ' + y + ' L 300 ' + (PISO - 20) + ' M 960 ' + y + ' L 960 ' + (PISO - 20)}
          fill="none" stroke={BLANCO} strokeWidth={8} />
        <rect x={210} y={PISO - 26} width={840} height={30} rx={12} fill={BLANCO} {...ln} />
        <path d={'M 300 ' + y + ' L 960 ' + y} {...ln} strokeWidth={40} />
        <path d={'M 300 ' + y + ' L 960 ' + y} stroke={C.GRY} strokeWidth={12} strokeLinecap="round" />
      </g>
    );
  }

  /* ---------------- encuadre ---------------- */

  var FIG = { x: -120, y: 120, s: 1.12 };
  function enLienzo(p, base) { base = base || FIG; return [base.x + p[0] * base.s, base.y + p[1] * base.s]; }

  function Fondo(props) {
    var pose = enParalelas(props.baja, props.incl, props.gira);
    return (
      <B.Perfil s={props.s} pose={pose} musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () { return <Paralelas />; }}
        children={function (g) { return props.extra ? props.extra(g) : null; }} />
    );
  }

  // repeticion: baja en el 60 % del ciclo (lento) y sube en el 40 %
  function rep(T, a, b, n, rapido) {
    if (T <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a)) * n;
    if (u >= n) return 0;
    var k = u - Math.floor(u);
    var corte = rapido ? 0.5 : 0.6;
    return k < corte ? Easing.easeInOutSine(k / corte) : 1 - Easing.easeInOutSine((k - corte) / (1 - corte));
  }

  // linea del tronco: de la cadera al cuello
  function lineaTronco(g, color, p) {
    return <B.Puntos pts={[U.suma(g.cadera, U.polar(Math.atan2(g.cadera[1] - g.cuello[1], g.cadera[0] - g.cuello[0]) * 180 / Math.PI, 90)), U.suma(g.cuello, U.polar(Math.atan2(g.cuello[1] - g.cadera[1], g.cuello[0] - g.cadera[0]) * 180 / Math.PI, 120))]}
      color={color} sw={16} p={p == null ? 1 : p} />;
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: fondos echado atras y rapido; salen las X */
  function EscGancho(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var baja = rep(T, f(0), f(1), 2, true);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rot = M.pop(T, f(0.02), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.06 * t} foco={enLienzo([620, 520])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dx={M.vibra(T, 30, 3)} dy={M.life(T, 3.6, 4)}>
            <Fondo s={FIG.s} baja={baja} incl={-8} gira={M.life(T, 0.9, 6)} muscRojo={{ delto: baja }} />
          </Pos>
        </Camara>
        <Mal T={T} cuando={f(0.2)} x={720} y={420} s={0.6} />
        <Mal T={T} cuando={f(0.42)} x={150} y={980} s={0.5} />
        <Rot T={T} text="FONDOS EN PARALELAS" s={1.1} y={250} e={rot} />
      </div>
    );
  }

  /* 2 — posicion: brazos estirados, cuerpo suspendido, inclinado adelante */
  function EscPosicion(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var incl = animate({ from: 2, to: 24, start: f(0.35), end: f(0.62), ease: Easing.easeInOutCubic })(T);
    var brazo = M.draw(T, f(0.06), dur * 0.18);
    var lin = M.draw(T, f(0.4), dur * 0.2);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.42), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={enLienzo([620, 520])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Fondo s={FIG.s} baja={0} incl={incl}
              extra={function (g) {
                return (
                  <g>
                    <B.Puntos pts={[g.hombro, g.mano]} color={C.GRN} sw={16} p={brazo} />
                    {lin > 0.02 ? lineaTronco(g, C.YEL, lin) : null}
                    {lin > 0.6 ? <B.Arco c={g.cadera} r={170} a0={-90} a1={-90 - incl + 4} color={C.YEL} sw={16}
                      opacity={clamp((lin - 0.6) / 0.3, 0, 1)} /> : null}
                  </g>
                );
              }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.3)} x={160} y={560} />
        <Bien T={T} cuando={f(0.74)} x={160} y={980} fase={0.4} />
        <Rot T={T} text="BRAZOS ESTIRADOS" y={250} e={r1} />
        <Rot T={T} text="UN POCO ADELANTE" y={1480} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 3 — bajar hasta codos a 90 y empujar */
  function EscBajada(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var baja = rep(T, f(0.02), f(0.98), 2);
    var fondo = baja > 0.93;
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.5), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.05 + 0.05 * t} foco={enLienzo([620, 560])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Fondo s={FIG.s} baja={baja} musc={{ pec: 0.3 + 0.7 * baja }}
              extra={function (g) {
                var aBrazo = Math.atan2(g.hombro[1] - g.codo[1], g.hombro[0] - g.codo[0]) * 180 / Math.PI;
                var aAnte = Math.atan2(g.mano[1] - g.codo[1], g.mano[0] - g.codo[0]) * 180 / Math.PI;
                if (aBrazo < aAnte) aBrazo += 360;
                return baja > 0.25 ? (
                  <g>
                    <B.Arco c={g.codo} r={110} a0={aAnte} a1={aBrazo} color={fondo ? C.GRN : C.YEL} sw={16}
                      cabeza={1} />
                    <B.Anillo c={g.codo} r={44} color={fondo ? C.GRN : C.YEL} />
                  </g>
                ) : null;
              }} />
          </Pos>
        </Camara>
        <Rot T={T} text="CODOS A 90°" y={250} e={r1} />
        <Rot T={T} text="EMPUJA ARRIBA" y={1480} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 4 — musculos: pectoral mayor; deltoides anterior y triceps ayudan */
  function EscMusculos(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var pec = animate({ from: 0, to: 1, start: f(0.06), end: f(0.2) })(T);
    var del = animate({ from: 0, to: 1, start: f(0.5), end: f(0.6) })(T);
    var tri = animate({ from: 0, to: 1, start: f(0.68), end: f(0.78) })(T);
    var baja = 0.75 + M.life(T, 2.4, 0.2);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.52), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.18 + 0.05 * t} foco={enLienzo([560, 600])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Fondo s={FIG.s} baja={baja} musc={{ pec: pec }} muscGris={{ delt: del, tri: tri }} />
          </Pos>
        </Camara>
        <Rot T={T} text="PECTORAL MAYOR" y={250} e={r1} />
        <Rot T={T} text="+ DELTOIDES Y TRÍCEPS" y={1480} e={r2} fase={0.4} />
      </div>
    );
  }

  // comparacion arriba (mal) / abajo (bien)
  // ventana sobre el torso, los brazos y la barra; centrada en x 640 del viewBox
  var CMP = { s: 0.74, desdeY: 150, centroX: 640, w: 1080, h: 590, yArriba: 320, yAbajo: 950 };
  function Mitad(props) {
    var s = CMP.s;
    return (
      <Pos x={0} y={0} e={props.e} dx={props.dx} dy={props.dy}>
        <Recorte x={0} y={props.y} w={CMP.w} h={CMP.h} desde={CMP.desdeY * s}>
          <div style={{ position: 'absolute', left: 540 - CMP.centroX * s, top: 0 }}>{props.children}</div>
        </Recorte>
      </Pos>
    );
  }

  /* 5 — error 1: echarse atras */
  function EscError1(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var baja = rep(T, f(0), f(1), 2);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4), r2 = M.pop(T, f(0.36), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad y={CMP.yArriba} e={arriba} dy={M.life(T, 3.6, 4)}>
          <Fondo s={CMP.s} baja={baja} incl={-10} muscRojo={{ delto: 0.4 + 0.6 * baja }}
            extra={function (g) { return lineaTronco(g, C.RED); }} />
        </Mitad>
        <Mitad y={CMP.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <Fondo s={CMP.s} baja={baja} musc={{ pec: 0.4 + 0.6 * baja }}
            extra={function (g) { return lineaTronco(g, C.GRN); }} />
        </Mitad>
        <Mal T={T} cuando={f(0.14)} x={860} y={CMP.yArriba + 40} s={0.5} />
        <Bien T={T} cuando={f(0.56)} x={860} y={CMP.yAbajo + 40} />
        <Rot T={T} text="ECHADO ATRÁS" y={230} s={1} e={r1} />
        <Rot T={T} text="UN POCO ADELANTE" y={1540} s={1} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 6 — error 2: rapido y balanceandose */
  function EscError2(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var rapido = rep(T, f(0), f(1), 4, true);
    var lento = rep(T, f(0), f(1), 1);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4), r2 = M.pop(T, f(0.36), 0.4);
    var cuenta = (T - f(0.3)) / (f(1) - f(0.3));
    var n = cuenta < 1 / 3 ? 3 : cuenta < 2 / 3 ? 2 : 1;
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad y={CMP.yArriba} e={arriba} dx={M.vibra(T, 30, 3)} dy={M.life(T, 3.6, 4)}>
          <Fondo s={CMP.s} baja={rapido} gira={M.life(T, 0.7, 10)} />
        </Mitad>
        <Mitad y={CMP.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <Fondo s={CMP.s} baja={lento} musc={{ pec: lento }} />
        </Mitad>
        <Pos x={60} y={CMP.yAbajo + 360} e={abajo} dy={M.life(T, 3, 5)}>
          <B.Cuenta s={0.7} n={n} p={1 - ((clamp(cuenta, 0, 0.999) * 3) % 1)} />
        </Pos>
        <Mal T={T} cuando={f(0.12)} x={860} y={CMP.yArriba + 40} s={0.5} />
        <Bien T={T} cuando={f(0.6)} x={860} y={CMP.yAbajo + 40} />
        <Rot T={T} text="RÁPIDO Y BALANCEO" y={230} s={1} e={r1} />
        <Rot T={T} text="CONTROLADO" y={1540} s={1} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 7 — cierre */
  function EscCierre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var baja = rep(T, f(0), f(1), 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.4), r2 = M.pop(T, f(0.4), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={enLienzo([620, 560])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Fondo s={FIG.s} baja={baja} musc={{ pec: 1 }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.3)} x={140} y={560} s={0.85} />
        <Rot T={T} text="FONDOS EN PARALELAS" s={1.1} y={250} e={r1} />
        <Rot T={T} text="TÉCNICA > PESO" y={1480} e={r2} fase={0.4} />
      </div>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, C: EscGancho,
      vo: 'Estás haciendo mal tus fondos en paralelas.' },
    { nombre: 'Posición', dur: 5, C: EscPosicion,
      vo: 'Sujétate con los brazos estirados y el cuerpo suspendido, inclinado un poco hacia adelante.' },
    { nombre: 'Bajada', dur: 4.5, C: EscBajada,
      vo: 'Baja flexionando los codos hasta unos noventa grados y empuja para volver arriba.' },
    { nombre: 'Músculos', dur: 5, C: EscMusculos,
      vo: 'El pectoral mayor hace el trabajo, con ayuda del deltoides anterior y el tríceps.' },
    { nombre: 'Error 1', dur: 4, C: EscError1,
      vo: 'Error uno: echarte hacia atrás. Pierdes pecho y cargas los hombros.' },
    { nombre: 'Error 2', dur: 3.5, C: EscError2,
      vo: 'Error dos: bajar rápido o balancearte. Controla cada repetición.' },
    { nombre: 'Cierre', dur: 2.5, C: EscCierre,
      vo: 'Así se hace. Técnica antes que peso.' }
  ];

  global.REELS.registrar({ id: 'fondos', titulo: 'Fondos en paralelas', escenas: ESCENAS });
})(window);
