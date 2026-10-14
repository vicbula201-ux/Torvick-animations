/* ============================================================
   SILLA EXTENSORA — reel corto (~31 s con el cierre de marca)
   Fuente: libro de biomecanica, pag. 151. Rodilla alineada con el eje
   de la maquina, rodillo sobre los tobillos, extender casi del todo sin
   bloquear, volver controlando. Errores: bloquear la rodilla y la
   rodilla fuera del eje.
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

  /* ---------------- pose sentado en la maquina ---------------- */

  // ang: direccion de la canilla (90 = colgando, 170 = casi estirada, 184 = bloqueada)
  // corre: cuanto queda la rodilla corrida del eje (0 = alineada)
  var EJE = [490, 840];
  function sentado(ang, corre) {
    corre = corre || 0;
    var rodilla = [EJE[0] + corre, EJE[1]];
    var cadera = [rodilla[0] + 272, rodilla[1] - 10];
    var cuello = U.suma(cadera, U.polar(-80, 404));
    var tobillo = U.suma(rodilla, U.polar(ang, 268));
    var punta = U.suma(tobillo, U.polar(ang + 95, 116));
    var hombro = U.suma(cuello, U.polar(100, 66));
    var mano = [cadera[0] - 20, cadera[1] + 40];
    var codo = B.ik(hombro, mano, 232, 214, 1);
    return {
      cadera: cadera, cuello: cuello, curva: 0, cabeza: -4,
      codo: codo, mano: mano,
      rodilla: rodilla, tobillo: tobillo, punta: punta,
      rodilla2: U.suma(rodilla, [26, -8]), tobillo2: U.suma(tobillo, [26, -8]), punta2: U.suma(punta, [26, -8]),
      piso: 1300
    };
  }

  // dondo va el rodillo: delante de la canilla, justo encima del tobillo
  function rodillo(ang, corre) {
    var p = sentado(ang, corre);
    return U.suma(U.suma(p.rodilla, U.polar(ang, 224)), U.polar(ang + 90, 70));
  }

  // la maquina: base, asiento, respaldo, eje, palanca y rodillo
  function Maquina(props) {
    var ang = props.ang, corre = props.corre || 0;
    var r = rodillo(ang, corre);
    // la palanca gira en el eje; si la rodilla no esta alineada, el rodillo resbala
    var angPalanca = Math.atan2(r[1] - EJE[1], r[0] - EJE[0]) * 180 / Math.PI;
    var finPalanca = U.suma(EJE, U.polar(angPalanca, U.largo(U.resta(r, EJE))));
    var ln = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };
    return (
      <g>
        <rect x={380} y={1270} width={700} height={34} rx={12} fill={BLANCO} {...ln} />
        <path d="M 760 1270 L 760 930 M 980 1270 L 980 820" fill="none" {...ln} strokeWidth={30} />
        <path d="M 760 1270 L 760 930 M 980 1270 L 980 820" fill="none" stroke={BLANCO} strokeWidth={6} />
        <path d="M 540 905 L 560 1270" fill="none" {...ln} strokeWidth={26} />
        {/* asiento y respaldo */}
        <rect x={520} y={872} width={420} height={56} rx={22} fill={C.GRY} {...ln} />
        <g transform="rotate(10 960 640)">
          <rect x={930} y={420} width={64} height={450} rx={26} fill={C.GRY} {...ln} />
        </g>
        {/* agarre al costado del asiento */}
        <rect x={706} y={890} width={34} height={70} rx={12} fill={BLANCO} {...ln} strokeWidth={11} />
        {/* palanca */}
        <path d={'M ' + U.pt(EJE) + ' L ' + U.pt(finPalanca)} {...ln} strokeWidth={34} />
        <path d={'M ' + U.pt(EJE) + ' L ' + U.pt(finPalanca)} stroke={BLANCO} strokeWidth={8} strokeLinecap="round" />
        <circle cx={EJE[0]} cy={EJE[1]} r={30} fill={BLANCO} {...ln} strokeWidth={13} />
        <circle cx={EJE[0]} cy={EJE[1]} r={8} fill={C.INK} />
      </g>
    );
  }

  function Rodillo(props) {
    var r = rodillo(props.ang, props.corre);
    return (
      <g>
        <circle cx={r[0]} cy={r[1]} r={44} fill={C.GRY} stroke={C.INK} strokeWidth={14} />
        <circle cx={r[0]} cy={r[1]} r={12} fill={C.INK} />
      </g>
    );
  }

  // tibial anterior (no viene en B.Perfil): banda delante de la canilla
  function Tibial(props) {
    if (!(props.v > 0.01)) return null;
    var e = props.g.ejes.pierna;
    var pts = [e.en(0.12, 10), e.en(0.5, 30), e.en(0.82, 12), e.en(0.82, -8), e.en(0.5, 4), e.en(0.12, -12)];
    return (
      <path d={U.blando(pts, 0.4)} fill={props.color || C.GRY} opacity={props.v}
        stroke={C.INK} strokeWidth={11} strokeLinejoin="round" />
    );
  }

  /* ---------------- encuadre ---------------- */

  var FIG = { x: -165, y: 118, s: 1.15 };
  function enLienzo(p, base) { base = base || FIG; return [base.x + p[0] * base.s, base.y + p[1] * base.s]; }

  // la figura con su maquina; extra = overlays (g) => SVG
  function Silla(props) {
    var ang = props.ang, corre = props.corre || 0;
    return (
      <B.Perfil s={props.s} pose={sentado(ang, corre)} musc={props.musc} muscGris={props.muscGris}
        muscRojo={props.muscRojo}
        fondo={function () { return <Maquina ang={ang} corre={corre} />; }}
        children={function (g) {
          return (
            <g>
              <Rodillo ang={ang} corre={corre} />
              <Tibial g={g} v={props.tibial || 0} />
              {props.extra ? props.extra(g) : null}
            </g>
          );
        }} />
    );
  }

  // repeticiones con vuelta lenta: sube en el 35 % del ciclo y baja en el 65 %
  function rep(T, a, b, n) {
    if (T <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a)) * n;
    var k = u - Math.floor(u);
    if (u >= n) return 0;
    return k < 0.35 ? Easing.easeInOutSine(k / 0.35) : 1 - Easing.easeInOutSine((k - 0.35) / 0.65);
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: extiende de golpe y bloquea; salen las X */
  function EscGancho(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var k = rep(T, f(0), f(1), 2);
    var ang = 90 + k * 96;           // llega a 186: rodilla trabada
    var traba = ang > 178;
    var fig = M.pop(T, at - 0.6, 0.5);
    var rot = M.pop(T, f(0.02), 0.4);
    var rodillaL = enLienzo(sentado(ang).rodilla);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.06 * t} foco={rodillaL}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dx={traba ? M.vibra(T, 44, 3) : 0} dy={M.life(T, 3.6, 4)}>
            <Silla s={FIG.s} ang={ang} muscRojo={{ cuad: traba ? 1 : 0 }}
              extra={function (g) {
                return traba ? <B.Anillo c={g.rodilla} r={70} color={C.RED} /> : null;
              }} />
          </Pos>
        </Camara>
        <Mal T={T} cuando={f(0.22)} x={300} y={840} s={0.6} />
        <Mal T={T} cuando={f(0.42)} x={90} y={1170} s={0.5} />
        <Rot T={T} text="SILLA EXTENSORA" s={1.2} y={260} e={rot} />
      </div>
    );
  }

  /* 2 — ajuste: rodilla en el eje y rodillo sobre los tobillos */
  function EscAjuste(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    // empieza corrido y se acomoda en el eje
    var corre = animate({ from: 70, to: 0, start: f(0.08), end: f(0.36), ease: Easing.easeOutBack })(T);
    var alineado = T >= f(0.36);
    var aEje = animate({ from: 0, to: 1, start: f(0.02), end: f(0.12) })(T);
    var aRod = animate({ from: 0, to: 1, start: f(0.55), end: f(0.65) })(T);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.4);
    var r2 = M.pop(T, f(0.56), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.05 + 0.04 * t} foco={enLienzo(EJE)}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Silla s={FIG.s} ang={92} corre={corre}
              extra={function (g) {
                var rr = rodillo(92, corre);
                return (
                  <g>
                    <B.Anillo c={EJE} r={62} p={aEje} color={alineado ? C.GRN : C.YEL} />
                    {!alineado ? <B.Puntos pts={[EJE, g.rodilla]} color={C.YEL} sw={14} /> : null}
                    <B.Anillo c={rr} r={74} p={aRod} color={C.YEL} />
                    <B.FlechaS a={U.suma(rr, [-170, 0])} b={U.suma(rr, [-86, 0])} p={aRod} color={C.YEL} />
                  </g>
                );
              }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.4)} x={230} y={880} />
        <Bien T={T} cuando={f(0.78)} x={90} y={1220} fase={0.4} />
        <Rot T={T} text="RODILLA EN EL EJE" y={260} e={r1} />
        <Rot T={T} text="RODILLO SOBRE TOBILLOS" y={1460} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 3 — ejecucion: casi estirar y bajar lento */
  function EscEjecucion(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var k = rep(T, f(0.04), f(0.98), 2);
    var ang = 92 + k * 76;               // hasta 168: casi estirada, sin trabar
    var bajando = T > f(0.04) && ((((T - f(0.04)) / (f(0.98) - f(0.04))) * 2) % 1) > 0.35;
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4);
    var r2 = M.pop(T, f(0.45), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.02 + 0.04 * t} foco={enLienzo(EJE)}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Silla s={FIG.s} ang={ang} musc={{ cuad: 0.35 + 0.65 * k }}
              extra={function (g) {
                return (
                  <g>
                    {ang > 100 ? <B.Arco c={g.rodilla} r={150} a0={92} a1={ang - 6}
                      color={bajando ? C.GRN : C.YEL} sw={18} /> : null}
                  </g>
                );
              }} />
          </Pos>
        </Camara>
        <Rot T={T} text="CASI ESTIRADAS" y={260} e={r1} />
        <Rot T={T} text="BAJA LENTO" y={1460} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 4 — musculos: cuadriceps (principal) y tibial anterior (ayuda) */
  function EscMusculos(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var cuad = animate({ from: 0, to: 1, start: f(0.08), end: f(0.22) })(T);
    var tib = animate({ from: 0, to: 1, start: f(0.42), end: f(0.55) })(T);
    var core = animate({ from: 0, to: 1, start: f(0.68), end: f(0.8) })(T);
    var ang = 160 + M.life(T, 2.4, 6);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.4);
    var r2 = M.pop(T, f(0.44), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.06 + 0.05 * t} foco={enLienzo([620, 820])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Silla s={FIG.s} ang={ang} musc={{ cuad: cuad }} muscGris={{ abd: core, erec: core }}
              tibial={tib} />
          </Pos>
        </Camara>
        <Rot T={T} text="CUÁDRICEPS: PRINCIPAL" y={260} e={r1} />
        <Rot T={T} text="TIBIAL ANTERIOR" y={1460} e={r2} fase={0.4} />
      </div>
    );
  }

  // comparacion arriba (mal) / abajo (bien): ventana sobre la rodilla y la canilla
  var CMP = { s: 0.85, desde: [60, 560], w: 1000, h: 560, yArriba: 330, yAbajo: 950, x: 40 };
  function Mitad(props) {
    var s = CMP.s;
    return (
      <Pos x={0} y={0} e={props.e} dx={props.dx} dy={props.dy} origen={'540px ' + (props.y + CMP.h / 2) + 'px'}>
        <Recorte x={CMP.x} y={props.y} w={CMP.w} h={CMP.h} desde={CMP.desde[1] * s}>
          <div style={{ position: 'absolute', left: -CMP.desde[0] * s, top: 0 }}>
            {props.children}
          </div>
        </Recorte>
      </Pos>
    );
  }

  /* 5 — error 1: bloquear la rodilla arriba */
  function EscError1(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var k = rep(T, f(0), f(1), 2);
    var malAng = 90 + 96 * k, bienAng = 92 + 76 * k;
    var traba = malAng > 178;
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4), r2 = M.pop(T, f(0.36), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad y={CMP.yArriba} e={arriba} dx={traba ? M.vibra(T, 44, 3) : 0} dy={M.life(T, 3.6, 4)}>
          <Silla s={CMP.s} ang={malAng} muscRojo={{ cuad: traba ? 1 : 0 }}
            extra={function (g) { return traba ? <B.Anillo c={g.rodilla} r={70} color={C.RED} /> : null; }} />
        </Mitad>
        <Mitad y={CMP.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <Silla s={CMP.s} ang={bienAng} musc={{ cuad: k }}
            extra={function (g) { return bienAng > 160 ? <B.Anillo c={g.rodilla} r={70} color={C.GRN} /> : null; }} />
        </Mitad>
        <Mal T={T} cuando={f(0.14)} x={860} y={CMP.yArriba + 20} s={0.5} />
        <Bien T={T} cuando={f(0.56)} x={860} y={CMP.yAbajo + 20} />
        <Rot T={T} text="RODILLA BLOQUEADA" y={230} s={1} e={r1} />
        <Rot T={T} text="CASI ESTIRADA" y={1540} s={1} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 6 — error 2: la rodilla fuera del eje de la maquina */
  function EscError2(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var k = rep(T, f(0), f(1), 2);
    var ang = 92 + 70 * k;
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4), r2 = M.pop(T, f(0.36), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad y={CMP.yArriba} e={arriba} dy={M.life(T, 3.6, 4)}>
          <Silla s={CMP.s} ang={ang} corre={-80}
            extra={function (g) {
              return (
                <g>
                  <B.Anillo c={EJE} r={52} color={C.RED} />
                  <B.Anillo c={g.rodilla} r={52} color={C.RED} />
                  <B.Puntos pts={[EJE, g.rodilla]} color={C.RED} sw={14} />
                </g>
              );
            }} />
        </Mitad>
        <Mitad y={CMP.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <Silla s={CMP.s} ang={ang}
            extra={function () { return <B.Anillo c={EJE} r={62} color={C.GRN} />; }} />
        </Mitad>
        <Mal T={T} cuando={f(0.14)} x={860} y={CMP.yArriba + 20} s={0.5} />
        <Bien T={T} cuando={f(0.56)} x={860} y={CMP.yAbajo + 20} />
        <Rot T={T} text="FUERA DEL EJE" y={230} s={1} e={r1} />
        <Rot T={T} text="RODILLA EN EL EJE" y={1540} s={1} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 7 — cierre: una repeticion limpia */
  function EscCierre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var k = rep(T, f(0), f(1), 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.1), 0.4), r2 = M.pop(T, f(0.4), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={enLienzo(EJE)}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Silla s={FIG.s} ang={92 + 76 * k} musc={{ cuad: 1 }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.3)} x={110} y={480} s={0.85} />
        <Rot T={T} text="SILLA EXTENSORA" s={1.2} y={260} e={r1} />
        <Rot T={T} text="TÉCNICA > PESO" y={1460} e={r2} fase={0.4} />
      </div>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, C: EscGancho,
      vo: 'Estás haciendo mal la silla extensora.' },
    { nombre: 'Ajuste', dur: 5.5, C: EscAjuste,
      vo: 'Ajusta la máquina: la rodilla alineada con el eje y el rodillo justo encima de los tobillos.' },
    { nombre: 'Ejecución', dur: 4.5, C: EscEjecucion,
      vo: 'Extiende las rodillas hasta casi estirarlas y vuelve lento, controlando la bajada.' },
    { nombre: 'Músculos', dur: 4.5, C: EscMusculos,
      vo: 'Trabaja el cuádriceps; el tibial anterior ayuda y el core te mantiene estable.' },
    { nombre: 'Error 1', dur: 4, C: EscError1,
      vo: 'Error uno: bloquear las rodillas arriba. Eso carga la rótula.' },
    { nombre: 'Error 2', dur: 4, C: EscError2,
      vo: 'Error dos: la rodilla fuera del eje de la máquina.' },
    { nombre: 'Cierre', dur: 2.5, C: EscCierre,
      vo: 'Así se hace. Técnica antes que peso.' }
  ];

  global.REELS.registrar({ id: 'silla-extensora', titulo: 'Silla extensora', escenas: ESCENAS });
})(window);
