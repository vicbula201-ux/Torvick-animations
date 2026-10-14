/* ============================================================
   ENCOGIMIENTO DE HOMBROS — reel corto (~30 s con el cierre de marca)
   Fuente: libro de biomecanica, pag. 74. De pie, una mancuerna en cada
   mano y los brazos estirados; subir los hombros hacia las orejas,
   sostener y bajar controlado. Trapecio superior (principal) y elevador
   de la escapula. Errores: girar los hombros en circulo y doblar los codos.
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

  var ELEV = 50;   // cuanto suben los hombros (unidades del viewBox de B.Frente)

  /* ---------------- pose ---------------- */

  // sube 0..1 hombros abajo -> pegados a las orejas
  // o.codo 0..1 codos doblados (error); o.giro [dx, dy] desvio del hombro (circulos)
  function encoge(sube, o) {
    o = o || {};
    var p = B.poseFrente.depie({});
    var g = B.geoFrente({ pose: p });
    var codo = o.codo || 0, giro = o.giro || [0, 0];
    ['izq', 'der'].forEach(function (k, i) {
      var l = i ? 1 : -1, q = p[k], S = g[k].hombro;
      var d = [l * giro[0] - l * 6 * sube, -ELEV * sube + giro[1]];
      var E = U.suma(q.codo, d);
      q.hombro = U.suma(S, d);
      q.codo = E;
      // codo doblado: el antebrazo viene hacia la camara, la mano sube y se agranda
      q.mano = codo > 0 ? U.suma(E, [l * (18 + 30 * codo), 192 * (1 - 0.62 * codo)]) : U.suma(q.mano, d);
      q.kMano = 1 + 0.18 * codo;
    });
    return p;
  }

  function Persona(props) {
    var pose = encoge(props.sube, { codo: props.codo, giro: props.giro });
    return (
      <B.Frente s={props.s} pose={pose} musc={props.musc} muscGris={props.muscGris} muscRojo={props.muscRojo}
        sinPiso={props.sinPiso}
        agarre={function (g) {
          return (
            <g>
              {['izq', 'der'].map(function (k) {
                return <B.MancuernaG key={k} c={g[k].mano} ang={90} giro={0.55} k={0.8 * g[k].kMano} />;
              })}
            </g>
          );
        }}
        children={function (g) { return props.extra ? props.extra(g) : null; }} />
    );
  }

  // repeticion: sube en el 30 %, sostiene el 20 % y baja lento en el 50 %
  function rep(T, a, b, n, rapido) {
    if (T <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a)) * n;
    if (u >= n) return 0;
    var k = u - Math.floor(u);
    if (rapido) return k < 0.5 ? Easing.easeInOutSine(k / 0.5) : 1 - Easing.easeInOutSine((k - 0.5) / 0.5);
    if (k < 0.3) return Easing.easeInOutSine(k / 0.3);
    if (k < 0.5) return 1;
    return 1 - Easing.easeInOutSine((k - 0.5) / 0.5);
  }

  // hombros en circulo: desvio [dx, dy] para una fase en vueltas
  function circulo(fase) {
    var a = fase * 2 * Math.PI;
    return [16 * Math.cos(a), -ELEV * 0.5 - ELEV * 0.5 * Math.sin(a)];
  }

  /* ---------------- encuadre ---------------- */

  var FIG = { x: -12, y: 80, s: 0.92 };
  function enLienzo(p, base) { base = base || FIG; return [base.x + p[0] * base.s, base.y + p[1] * base.s]; }

  // flechas verticales sobre los hombros: hacia las orejas
  function flechasArriba(g, color, p) {
    return (
      <g>
        {['izq', 'der'].map(function (k) {
          var S = g[k].hombro, x = S[0] - g[k].lado * 46;
          return <B.FlechaS key={k} a={[x, S[1] - 40]} b={[x, S[1] - 170]} color={color} p={p} />;
        })}
      </g>
    );
  }

  // brazo recto: puntos del hombro a la mano
  function brazosRectos(g, color, p) {
    return (
      <g>
        {['izq', 'der'].map(function (k) {
          return <B.Puntos key={k} pts={[g[k].hombro, g[k].mano]} color={color} sw={16} p={p} />;
        })}
      </g>
    );
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: hombros en circulo y codos doblados; salen las X */
  function EscGancho(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var fase = (T - at) / 0.9;
    var codo = 0.5 + 0.5 * Math.sin(fase * 2 * Math.PI);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rot = M.pop(T, f(0.02), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.06 * t} foco={enLienzo([600, 760])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dx={M.vibra(T, 30, 3)} dy={M.life(T, 3.6, 4)}>
            <Persona s={FIG.s} sube={0} giro={circulo(fase)} codo={codo} muscRojo={{ bic: codo, trap: 0.6 }} />
          </Pos>
        </Camara>
        <Mal T={T} cuando={f(0.2)} x={830} y={470} s={0.6} />
        <Mal T={T} cuando={f(0.42)} x={110} y={860} s={0.5} />
        <Rot T={T} text="ENCOGIMIENTO DE HOMBROS" s={1.05} y={250} e={rot} />
      </div>
    );
  }

  /* 2 — posicion: de pie, mancuernas al costado, brazos estirados */
  function EscPosicion(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var brazo = M.draw(T, f(0.1), dur * 0.18);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.46), 0.4);
    var aro = animate({ from: 0, to: 1, start: f(0.5), end: f(0.62) })(T);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={enLienzo([600, 760])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Persona s={FIG.s} sube={0}
              extra={function (g) {
                return (
                  <g>
                    {brazosRectos(g, C.GRN, brazo)}
                    {['izq', 'der'].map(function (k) {
                      return <B.Anillo key={k} c={g[k].mano} r={96} color={C.YEL} p={aro} />;
                    })}
                  </g>
                );
              }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.3)} x={840} y={640} />
        <Rot T={T} text="BRAZOS ESTIRADOS" y={250} e={r1} />
        <Rot T={T} text="MANCUERNAS AL COSTADO" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 3 — ejecucion: hombros a las orejas, sostener, bajar lento */
  function EscEjecucion(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var sube = rep(T, f(0.04), f(0.98), 2);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.52), 0.4);
    var guia = M.draw(T, f(0.12), dur * 0.16);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.35 + 0.05 * t} foco={enLienzo([600, 640])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Persona s={FIG.s} sube={sube} musc={{ trap: 0.25 + 0.75 * sube }}
              extra={function (g) {
                var yTope = g.izq.hombro[1] - ELEV * (1 - sube) - 46;
                return (
                  <g>
                    <B.Puntos pts={[[330, yTope], [870, yTope]]} color={C.YEL} sw={14} p={guia} />
                    {flechasArriba(g, sube > 0.97 ? C.GRN : C.YEL, clamp(0.35 + sube, 0, 1))}
                  </g>
                );
              }} />
          </Pos>
        </Camara>
        <Rot T={T} text="HOMBROS A LAS OREJAS" y={250} e={r1} />
        <Rot T={T} text="BAJA LENTO" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 4 — musculos: trapecio superior (principal); elevador de la escapula.
     De espaldas, que es donde se ve el trapecio entero */
  var ESP = { x: 185, y: 350, s: 0.65 };
  function EscMusculos(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var trap = animate({ from: 0, to: 1, start: f(0.06), end: f(0.22) })(T);
    var elev = M.draw(T, f(0.52), dur * 0.14);
    var enc = 0.5 + M.life(T, 2.2, 0.5);
    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.5), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.5 + 0.06 * t} foco={[540, 420]}>
          <Pos x={ESP.x} y={ESP.y} e={fig} dy={M.life(T, 3.6, 5)}>
            <B.Espalda s={ESP.s} cuerpoEntero codo={0} enc={enc} muscAmarillo={{ tra: trap }}
              children={function (g) {
                // elevador de la escapula: de las cervicales al angulo superior de la escapula
                return (
                  <g>
                    {[g.izq, g.der].map(function (q, i) {
                      var cuello = [g.cabeza[0] + (i ? 38 : -38), g.cabeza[1] + 70];
                      if (elev < 0.02) return null;
                      var d = 'M ' + cuello.join(' ') + ' L ' + U.lerpP(cuello, q.angSup, elev).join(' ');
                      return (
                        <g key={i}>
                          <path d={d} stroke={C.INK} strokeWidth={34} strokeLinecap="round" fill="none" />
                          <path d={d} stroke={C.GRY} strokeWidth={14} strokeLinecap="round" fill="none" />
                        </g>
                      );
                    })}
                  </g>
                );
              }} />
          </Pos>
        </Camara>
        <Rot T={T} text="TRAPECIO SUPERIOR" y={250} e={r1} />
        <Rot T={T} text="+ ELEVADOR ESCÁPULA" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  // comparacion arriba (mal) / abajo (bien): torso y brazos, de la cabeza a las mancuernas
  var CMP = { s: 0.8, desdeY: 330, w: 1080, h: 600, yArriba: 300, yAbajo: 915 };
  function Mitad(props) {
    var s = CMP.s;
    return (
      <Pos x={0} y={0} e={props.e} dx={props.dx} dy={props.dy}>
        <Recorte x={0} y={props.y} w={CMP.w} h={CMP.h} desde={CMP.desdeY * s}>
          <div style={{ position: 'absolute', left: 540 - 600 * s, top: 0 }}>{props.children}</div>
        </Recorte>
      </Pos>
    );
  }

  /* 5 — error 1: girar los hombros en circulo */
  function EscError1(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var fase = (T - at) / 1.3;
    var sube = rep(T, f(0), f(1), 2);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4), r2 = M.pop(T, f(0.36), 0.4);
    var giro = (fase % 1) * 330;
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad y={CMP.yArriba} e={arriba} dx={M.vibra(T, 30, 2)} dy={M.life(T, 3.6, 4)}>
          <Persona s={CMP.s} sube={0} giro={circulo(fase)} muscRojo={{ trap: 0.7 }} sinPiso
            extra={function (g) {
              return (
                <g>
                  {['izq', 'der'].map(function (k) {
                    var l = g[k].lado;
                    return <B.Arco key={k} c={g[k].hombro} r={120} a0={-90 - l * 20} a1={-90 - l * 20 + l * giro}
                      color={C.RED} sw={16} />;
                  })}
                </g>
              );
            }} />
        </Mitad>
        <Mitad y={CMP.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <Persona s={CMP.s} sube={sube} musc={{ trap: 0.3 + 0.7 * sube }} sinPiso
            extra={function (g) { return flechasArriba(g, C.GRN, 1); }} />
        </Mitad>
        <Mal T={T} cuando={f(0.14)} x={880} y={CMP.yArriba + 40} s={0.5} />
        <Bien T={T} cuando={f(0.56)} x={880} y={CMP.yAbajo + 40} />
        <Rot T={T} text="HOMBROS EN CÍRCULO" y={230} s={1} e={r1} />
        <Rot T={T} text="SOLO ARRIBA Y ABAJO" y={1530} s={1} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 6 — error 2: doblar los codos */
  function EscError2(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var sube = rep(T, f(0), f(1), 2);
    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.3), 0.45);
    var r1 = M.pop(T, f(0.04), 0.4), r2 = M.pop(T, f(0.36), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad y={CMP.yArriba} e={arriba} dx={M.vibra(T, 30, 2)} dy={M.life(T, 3.6, 4)}>
          <Persona s={CMP.s} sube={sube * 0.5} codo={sube} muscRojo={{ bic: sube }} sinPiso
            extra={function (g) {
              return (
                <g>
                  {['izq', 'der'].map(function (k) {
                    return <B.Anillo key={k} c={g[k].codo} r={52} color={C.RED} p={clamp(sube * 1.6, 0, 1)} />;
                  })}
                </g>
              );
            }} />
        </Mitad>
        <Mitad y={CMP.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <Persona s={CMP.s} sube={sube} musc={{ trap: 0.3 + 0.7 * sube }} sinPiso
            extra={function (g) { return brazosRectos(g, C.GRN, 1); }} />
        </Mitad>
        <Mal T={T} cuando={f(0.14)} x={880} y={CMP.yArriba + 40} s={0.5} />
        <Bien T={T} cuando={f(0.56)} x={880} y={CMP.yAbajo + 40} />
        <Rot T={T} text="CODOS DOBLADOS" y={230} s={1} e={r1} />
        <Rot T={T} text="BRAZOS ESTIRADOS" y={1530} s={1} e={r2} fase={0.4} />
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
        <Camara zoom={1 + 0.04 * t} foco={enLienzo([600, 760])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Persona s={FIG.s} sube={sube} musc={{ trap: 1 }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.3)} x={860} y={600} s={0.85} />
        <Rot T={T} text="ENCOGIMIENTO DE HOMBROS" s={1.05} y={250} e={r1} />
        <Rot T={T} text="TÉCNICA > PESO" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, C: EscGancho,
      vo: 'Estás haciendo mal tus encogimientos de hombros.' },
    { nombre: 'Posición', dur: 4.5, C: EscPosicion,
      vo: 'De pie, una mancuerna en cada mano y los brazos estirados a los costados.' },
    { nombre: 'Ejecución', dur: 5, C: EscEjecucion,
      vo: 'Sube los hombros hacia las orejas, aguanta un segundo arriba y baja lento.' },
    { nombre: 'Músculos', dur: 4, C: EscMusculos,
      vo: 'Trabaja el trapecio superior, con ayuda del elevador de la escápula.' },
    { nombre: 'Error 1', dur: 4, C: EscError1,
      vo: 'Error uno: girar los hombros en círculos. Solo sube y baja.' },
    { nombre: 'Error 2', dur: 4.5, C: EscError2,
      vo: 'Error dos: doblar los codos. Los brazos solo sostienen el peso.' },
    { nombre: 'Cierre', dur: 2.5, C: EscCierre,
      vo: 'Así se hace. Técnica antes que peso.' }
  ];

  global.REELS.registrar({ id: 'encogimientos', titulo: 'Encogimiento de hombros', escenas: ESCENAS });
})(window);
