/* ============================================================
   PANTORRILLA DE PIE — reel corto (~31 s con el cierre de marca)
   Fuente: libro de biomecanica, pag. 164. De pie, las puntas sobre un
   escalon (mas amplitud) y pesas en las manos si se usan; subir los
   talones hasta quedar en puntas, contraer y bajar lento. Gastrocnemio
   (principal); soleo, peroneos y flexores. Errores: hacerlo muy rapido y
   no usar la amplitud completa (arriba del todo y estirar abajo).
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

  /* ---------------- pose: de perfil sobre el escalon ---------------- */

  var BASE = B.posePerfil.depie({ x: 700, piso: 1300 });
  var ESCALON = { x0: 360, x1: 690, y: 1300, alto: 70 };   // y = cara de arriba (donde pisan las puntas)
  var PIE = 116.5;

  // sube -1 talones abajo (estirado) .. 0 pie plano .. 1 en puntas
  function talones(sube) {
    var ang = -16 - 46 * Math.max(sube, 0) + 24 * Math.max(-sube, 0);
    var tob = U.suma(BASE.punta, U.polar(ang, PIE));
    var d = U.resta(tob, BASE.tobillo);
    var pose = B.posePerfil.mover(BASE, d);
    pose.piso = 1300;
    pose.punta = BASE.punta;
    pose.punta2 = BASE.punta2;
    pose.tobillo = tob;
    pose.tobillo2 = U.suma(BASE.punta2, U.polar(ang, PIE));
    return pose;
  }

  function Escalon() {
    var ln = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };
    return (
      <g>
        <B.PisoG y={ESCALON.y + ESCALON.alto} x0={180} x1={1220} />
        <rect x={ESCALON.x0} y={ESCALON.y} width={ESCALON.x1 - ESCALON.x0} height={ESCALON.alto} rx={12} fill={BLANCO} {...ln} />
        <path d={'M ' + (ESCALON.x0 + 24) + ' ' + (ESCALON.y + 22) + ' L ' + (ESCALON.x1 - 24) + ' ' + (ESCALON.y + 22)}
          stroke={C.GRY} strokeWidth={10} strokeLinecap="round" />
      </g>
    );
  }

  function Persona(props) {
    var pose = talones(props.sube);
    return (
      <B.Perfil s={props.s} pose={pose} musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        fondo={function () { return <Escalon />; }}
        children={function (g) { return props.extra ? props.extra(g) : null; }} />
    );
  }

  /* ---------------- encuadre y ritmo ---------------- */

  var FIG = { x: -20, y: 290, s: 0.8 };
  var FIGG = { x: -90, y: 256, s: 0.9 };   // cuerpo entero mas grande (gancho y cierre)
  function enLienzo(p, base) { base = base || FIG; return [base.x + p[0] * base.s, base.y + p[1] * base.s]; }

  // repeticion completa: de estirado (-1) a puntas (1): sube 35 %, aguanta 15 %, baja 50 %
  function rep(T, a, b, n, modo) {
    if (T <= a) return -1;
    var u = Math.min(1, (T - a) / (b - a)) * n;
    if (u >= n) return -1;
    var k = u - Math.floor(u);
    if (modo === 'rapido') return -0.1 + 0.7 * Math.sin(k * Math.PI);          // rebotes cortos
    if (modo === 'medias') return k < 0.5 ? 0.5 * Easing.easeInOutSine(k / 0.5) : 0.5 - 0.5 * Easing.easeInOutSine((k - 0.5) / 0.5);
    if (k < 0.35) return -1 + 2 * Easing.easeInOutSine(k / 0.35);
    if (k < 0.5) return 1;
    return 1 - 2 * Easing.easeInOutSine((k - 0.5) / 0.5);
  }

  // marcas del recorrido del talon (tope de arriba y de abajo)
  function topes(g, color, p) {
    var arriba = talones(1).tobillo, abajo = talones(-1).tobillo;
    var x0 = g.tobillo[0] - 30, x1 = g.tobillo[0] + 130;
    return (
      <g>
        <B.Puntos pts={[[x0, arriba[1] + 34], [x1, arriba[1] + 34]]} color={color} sw={14} p={p} />
        <B.Puntos pts={[[x0, abajo[1] + 34], [x1, abajo[1] + 34]]} color={color} sw={14} p={p} />
      </g>
    );
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: rebotes cortos y rapidos; salen las X */
  function EscGancho(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = rep(T, f(0), f(1), 5, 'rapido');
    var fig = M.pop(T, at - 0.6, 0.5);
    var rot = M.pop(T, f(0.02), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.05 * t} foco={enLienzo([660, 1100], FIGG)}>
          <Pos x={FIGG.x} y={FIGG.y} e={fig} dx={M.vibra(T, 30, 3)} dy={M.life(T, 3.6, 4)}>
            <Persona s={FIGG.s} sube={sube} muscRojo={{ gem: 0.8 }} />
          </Pos>
        </Camara>
        <Mal T={T} cuando={f(0.2)} x={790} y={1100} s={0.6} />
        <Mal T={T} cuando={f(0.42)} x={150} y={620} s={0.5} />
        <Rot T={T} text="PANTORRILLA DE PIE" s={1.1} y={250} e={rot} />
      </div>
    );
  }

  /* 2 — posicion: puntas en el escalon, talones en el aire */
  function EscPosicion(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var aro1 = animate({ from: 0, to: 1, start: f(0.1), end: f(0.22) })(T);
    var aro2 = animate({ from: 0, to: 1, start: f(0.5), end: f(0.62) })(T);
    var zoom = animate({ from: 1, to: 1.6, start: f(0.04), end: f(0.3), ease: Easing.easeInOutCubic })(T);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.48), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={zoom + 0.04 * t} foco={enLienzo([660, 1180])} mira={[540, 1234 - 134 * (zoom - 1) / 0.6]}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Persona s={FIG.s} sube={0}
              extra={function (g) {
                return (
                  <g>
                    <B.Anillo c={U.lerpP(g.punta, g.tobillo, 0.25)} r={52} color={C.YEL} p={aro1} />
                    <B.Anillo c={g.talon} r={52} color={C.YEL} p={aro2} />
                    {aro2 > 0.5 ? <B.FlechaS a={[g.talon[0] + 10, g.talon[1] + 20]} b={[g.talon[0] + 10, g.talon[1] + 110]}
                      color={C.YEL} sw={14} p={(aro2 - 0.5) / 0.5} /> : null}
                  </g>
                );
              }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.7)} x={830} y={760} />
        <Rot T={T} text="PUNTAS EN EL ESCALÓN" y={250} e={r1} />
        <Rot T={T} text="TALONES AL AIRE" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 3 — ejecucion: subir en puntas, contraer, bajar lento hasta estirar */
  function EscEjecucion(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = rep(T, f(0.02), f(0.98), 2);
    var fig = M.pop(T, at - 0.6, 0.5);
    var tope = M.draw(T, f(0.1), dur * 0.16);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.5), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.7 + 0.05 * t} foco={enLienzo([660, 1120])} mira={[540, 950]}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Persona s={FIG.s} sube={sube} musc={{ gem: 0.3 + 0.35 * (sube + 1) }}
              extra={function (g) {
                var arriba = sube > 0.96, abajo = sube < -0.96;
                return (
                  <g>
                    {topes(g, C.YEL, tope)}
                    <B.Anillo c={g.talon} r={40} color={arriba || abajo ? C.GRN : C.YEL} />
                  </g>
                );
              }} />
          </Pos>
        </Camara>
        <Rot T={T} text="SUBE EN PUNTAS" y={250} e={r1} />
        <Rot T={T} text="BAJA HASTA ESTIRAR" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 4 — musculos: gemelo (principal); soleo y peroneos */
  function EscMusculos(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var gem = animate({ from: 0, to: 1, start: f(0.06), end: f(0.2) })(T);
    var sube = 0.2 + M.life(T, 2.4, 0.75);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.5), 0.4);
    var aro = animate({ from: 0, to: 1, start: f(0.52), end: f(0.64) })(T);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={2 + 0.06 * t} foco={enLienzo([700, 1100])} mira={[540, 1000]}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Persona s={FIG.s} sube={sube} musc={{ gem: gem }}
              extra={function (g) {
                // soleo: debajo del gemelo, por encima del tobillo
                var c = U.lerpP(g.rodilla, g.tobillo, 0.68);
                return <B.Anillo c={U.suma(c, [22, 0])} r={46} color={C.GRY} p={aro} />;
              }} />
          </Pos>
        </Camara>
        <Rot T={T} text="GEMELO" s={1.2} y={250} e={r1} />
        <Rot T={T} text="+ SÓLEO Y PERONEOS" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  // comparacion: de la rodilla al piso, grande
  var CMP = { s: 1.0, desdeY: 860, w: 1080, h: 560, yArriba: 310, yAbajo: 930, centroX: 660 };
  function Mitad(props) {
    var s = CMP.s;
    return (
      <Pos x={0} y={0} e={props.e} dx={props.dx} dy={props.dy} origen={'540px ' + (props.y + CMP.h / 2) + 'px'}>
        <Recorte x={0} y={props.y} w={CMP.w} h={CMP.h} desde={CMP.desdeY * s}>
          <div style={{ position: 'absolute', left: 540 - CMP.centroX * s, top: 0 }}>{props.children}</div>
        </Recorte>
      </Pos>
    );
  }

  /* 5 — error 1: muy rapido */
  function EscError1(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var rapido = rep(T, f(0), f(1), 6, 'rapido');
    var lento = rep(T, f(0), f(1), 1);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4), r2 = M.pop(T, f(0.36), 0.4);
    var cuenta = (T - f(0.3)) / (f(1) - f(0.3));
    var n = cuenta < 1 / 3 ? 3 : cuenta < 2 / 3 ? 2 : 1;
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad y={CMP.yArriba} e={arriba} dx={M.vibra(T, 30, 3)} dy={M.life(T, 3.6, 4)}>
          <Persona s={CMP.s} sube={rapido} muscRojo={{ gem: 0.7 }} />
        </Mitad>
        <Mitad y={CMP.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <Persona s={CMP.s} sube={lento} musc={{ gem: 0.35 * (lento + 1) }} />
        </Mitad>
        <Pos x={70} y={CMP.yAbajo + 300} e={abajo} dy={M.life(T, 3, 5)}>
          <B.Cuenta s={0.7} n={n} p={1 - ((clamp(cuenta, 0, 0.999) * 3) % 1)} />
        </Pos>
        <Mal T={T} cuando={f(0.12)} x={880} y={CMP.yArriba + 40} s={0.5} />
        <Bien T={T} cuando={f(0.6)} x={880} y={CMP.yAbajo + 40} />
        <Rot T={T} text="RÁPIDO Y CON REBOTE" y={230} s={1} e={r1} />
        <Rot T={T} text="LENTO Y CONTROLADO" y={1530} s={1} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 6 — error 2: quedarse a medias */
  function EscError2(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var medias = rep(T, f(0), f(1), 2, 'medias');
    var completo = rep(T, f(0), f(1), 2);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4), r2 = M.pop(T, f(0.36), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad y={CMP.yArriba} e={arriba} dy={M.life(T, 3.6, 4)}>
          <Persona s={CMP.s} sube={medias} muscRojo={{ gem: 0.5 }}
            extra={function (g) { return topes(g, C.RED, 1); }} />
        </Mitad>
        <Mitad y={CMP.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <Persona s={CMP.s} sube={completo} musc={{ gem: 0.35 * (completo + 1) }}
            extra={function (g) { return topes(g, C.GRN, 1); }} />
        </Mitad>
        <Mal T={T} cuando={f(0.14)} x={880} y={CMP.yArriba + 40} s={0.5} />
        <Bien T={T} cuando={f(0.56)} x={880} y={CMP.yAbajo + 40} />
        <Rot T={T} text="A MEDIAS" y={230} s={1} e={r1} />
        <Rot T={T} text="RECORRIDO COMPLETO" y={1530} s={1} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 7 — cierre */
  function EscCierre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = rep(T, f(0), f(1), 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.4), r2 = M.pop(T, f(0.4), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={enLienzo([660, 1100], FIGG)}>
          <Pos x={FIGG.x} y={FIGG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Persona s={FIGG.s} sube={sube} musc={{ gem: 1 }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.3)} x={820} y={620} s={0.85} />
        <Rot T={T} text="PANTORRILLA DE PIE" s={1.1} y={250} e={r1} />
        <Rot T={T} text="TÉCNICA > PESO" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, C: EscGancho,
      vo: 'Estás haciendo mal tus elevaciones de pantorrilla.' },
    { nombre: 'Posición', dur: 5, C: EscPosicion,
      vo: 'Las puntas de los pies sobre un escalón y los talones en el aire.' },
    { nombre: 'Ejecución', dur: 5.5, C: EscEjecucion,
      vo: 'Sube los talones hasta quedar en puntas, aguanta arriba y baja lento hasta estirar.' },
    { nombre: 'Músculos', dur: 4, C: EscMusculos,
      vo: 'Trabaja el gemelo, con ayuda del sóleo y los peroneos.' },
    { nombre: 'Error 1', dur: 4, C: EscError1,
      vo: 'Error uno: hacerlo rápido. Aquí manda el control, no el rebote.' },
    { nombre: 'Error 2', dur: 4.5, C: EscError2,
      vo: 'Error dos: quedarte a medias. Sube del todo y baja hasta estirar el músculo.' },
    { nombre: 'Cierre', dur: 2.5, C: EscCierre,
      vo: 'Así se hace. Técnica antes que peso.' }
  ];

  global.REELS.registrar({ id: 'pantorrilla', titulo: 'Pantorrilla de pie', escenas: ESCENAS });
})(window);
