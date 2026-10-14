/* ============================================================
   PROTEINAS — reel corto de nutricion (~34 s con el cierre de marca)
   Fuente: libro, seccion de nutricion. Funcion (aminoacidos: los
   ladrillos del musculo; reparacion y crecimiento despues de entrenar),
   fuentes (carnes, pescados, huevos, lacteos, legumbres, frutos secos,
   semillas) y recomendacion (1,6 a 2,2 g por kg de peso al dia).
   El protagonista es Tor (TOR.Tor), el avatar de la marca.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, TOR = global.TOR;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var A = global.REELS.ayudas;
  var Pos = A.Pos, Rot = A.Rot, Camara = A.Camara, Mal = A.Mal, Bien = A.Bien;
  var BLANCO = '#ffffff';

  /* ---------------- encuadre ---------------- */

  var FIG = { x: 72, y: 166, s: 0.78 };
  function enLienzo(p, base) { base = base || FIG; return [base.x + p[0] * base.s, base.y + p[1] * base.s]; }
  var PISO = 1430;   // Tor parado sobre la balanza

  function Lienzo(props) {
    return (
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
        {props.children}
      </svg>
    );
  }

  function balanza(g) { return <N.Balanza x={g.centro[0]} y={g.piso} />; }

  // grietas rojas sobre el biceps (lo que el entrenamiento rompe)
  function grietas(g, v) {
    if (v < 0.02) return null;
    return (
      <g opacity={v}>
        {['izq', 'der'].map(function (k) {
          var q = g[k], S = q.hombro, E = q.codo;
          var d = U.unidad(U.resta(E, S)), n = U.por([d[1], -d[0]], q.lado);
          var en = function (u, w) { return U.suma(U.suma(S, U.por(d, u * U.largo(U.resta(E, S)))), U.por(n, w)); };
          var z = [en(0.6, 46), en(0.66, 24), en(0.72, 50), en(0.78, 22), en(0.84, 44)];
          return <path key={k} d={'M ' + z.map(U.pt).join(' L ')} fill="none" stroke={C.RED} strokeWidth={12}
            strokeLinecap="round" strokeLinejoin="round" />;
        })}
      </g>
    );
  }

  var COLORES = [C.YEL, C.GRN, C.GRY, BLANCO];

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: Tor quiere biceps pero le falta proteina; salen las X */
  function EscGancho(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var med = M.pop(T, f(0.08), 0.42);
    var rot = M.pop(T, f(0.02), 0.4);
    var flex = 0.72 + M.life(T, 0.5, 0.05);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.05 * t} foco={[540, 900]}>
          <Pos x={FIG.x} y={FIG.y - 30} e={fig} dx={M.vibra(T, 30, 3)} dy={M.life(T, 3.6, 4)}>
            <TOR.Tor s={FIG.s} flex={flex} boca="triste" sinPiso muscRojo={{ bic: 1 }} />
          </Pos>
          <Pos x={382} y={1360} e={med} dy={M.life(T, 2.8, 6)}>
            <P.Medidor s={1.05} p={0.14} shake={M.vibra(T, 30, 3)} />
          </Pos>
        </Camara>
        <Mal T={T} cuando={f(0.22)} x={740} y={1330} s={0.6} />
        <Mal T={T} cuando={f(0.42)} x={70} y={800} s={0.5} />
        <Rot T={T} text="PROTEÍNA" s={1.2} y={250} e={rot} />
      </div>
    );
  }

  /* 2 — que es: cadena de aminoacidos -> ladrillos del musculo */
  var CADENA = [[150, 660], [276, 600], [402, 660], [528, 600], [654, 660], [780, 600], [906, 660]];
  var MURO = [];
  [0, 1, 2].forEach(function (fila) {
    var n = fila % 2 ? 4 : 3, x0 = fila % 2 ? 180 : 270;
    for (var i = 0; i < n; i++) MURO.push({ x: x0 + i * 196, y: 1290 - fila * 100 });
  });

  function EscQueEs(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var r1 = M.pop(T, f(0.04), 0.4), r2 = M.pop(T, f(0.5), 0.4);
    var flecha = M.draw(T, f(0.4), dur * 0.12);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Lienzo>
          {CADENA.slice(1).map(function (c, i) {
            var a = CADENA[i];
            var p = M.draw(T, f(0.06 + i * 0.045), 0.25);
            return p > 0.02 ? <path key={i} d={'M ' + a[0] + ' ' + a[1] + ' L ' + U.pt(U.lerpP(a, c, p))}
              stroke={C.INK} strokeWidth={16} strokeLinecap="round" /> : null;
          })}
          <B.FlechaS a={[540, 770]} b={[540, 990]} color={C.YEL} p={flecha} sw={20} />
        </Lienzo>
        {CADENA.map(function (c, i) {
          var e = i === 0 ? M.pop(T, at - 0.6, 0.5) : M.pop(T, f(0.04 + i * 0.045), 0.4);
          return (
            <Pos key={i} x={c[0] - 56} y={c[1] - 56} e={e} dy={M.life(T, 2.6, 6, i * 0.13)}>
              <N.Bola r={46} color={COLORES[i % 4]} />
            </Pos>
          );
        })}
        {MURO.map(function (m, j) {
          var cae = animate({ from: -160, to: 0, start: f(0.44 + j * 0.035), end: f(0.44 + j * 0.035) + 0.3, ease: Easing.easeOutBack })(T);
          var e = M.pop(T, f(0.44 + j * 0.035), 0.3);
          return (
            <Pos key={j} x={m.x - 92} y={m.y - 44} e={e} dy={cae + M.life(T, 3.2, 3, j * 0.1)}>
              <svg width={184} height={88} style={{ display: 'block', overflow: 'visible' }}>
                <rect x={6} y={6} width={172} height={76} rx={14} fill={C.YEL} stroke={C.INK} strokeWidth={13} />
                <path d="M 30 30 L 70 30" stroke={BLANCO} strokeWidth={9} strokeLinecap="round" />
              </svg>
            </Pos>
          );
        })}
        <Rot T={T} text="AMINOÁCIDOS" y={260} e={r1} />
        <Rot T={T} text="LADRILLOS DEL MÚSCULO" y={1440} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 3 — para que: repara el musculo despues de entrenar y lo hace crecer */
  function EscParaQue(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var rojo = 1 - animate({ from: 0, to: 1, start: f(0.38), end: f(0.6) })(T);
    var am = animate({ from: 0, to: 1, start: f(0.5), end: f(0.68) })(T);
    var flex = 0.84 + 0.16 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.6), end: f(0.78) })(T));
    var vuelo = animate({ from: 0, to: 1, start: f(0.26), end: f(0.56), ease: Easing.easeInOutCubic })(T);
    var r1 = M.pop(T, f(0.08), 0.4), r2 = M.pop(T, f(0.62), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.5 + 0.06 * t} foco={enLienzo([600, 600])} mira={[540, 900]}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <TOR.Tor s={FIG.s} flex={flex} sinPiso boca={am > 0.5 ? 'sonrisa' : null}
              muscRojo={rojo > 0.02 ? { bic: rojo } : null} musc={{ bic: am }}
              extra={function (g) {
                // aminoacidos que llegan al biceps desde afuera
                var bolas = [];
                ['izq', 'der'].forEach(function (k, i) {
                  var q = g[k], dest = U.lerpP(q.hombro, q.codo, 0.72);
                  [[-160, -260], [-260, -60], [-120, 200]].forEach(function (o, j) {
                    var desde = U.suma(dest, [q.lado * Math.abs(o[0]) * 1.2, o[1]]);
                    var p = clamp(vuelo * 1.3 - j * 0.15, 0, 1);
                    if (p <= 0 || p >= 1) return;
                    var c = U.lerpP(desde, dest, Easing.easeInCubic(p));
                    bolas.push(<circle key={k + j} cx={c[0]} cy={c[1]} r={36 * (1 - 0.4 * p)} fill={COLORES[(i + j) % 3]}
                      stroke={C.INK} strokeWidth={10} />);
                  });
                });
                return <g>{grietas(g, rojo)}{bolas}</g>;
              }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.72)} x={850} y={430} />
        <Rot T={T} text="REPARA" y={260} e={r1} />
        <Rot T={T} text="Y CRECE" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 4 — fuentes: aparece cada comida cuando la nombra la voz */
  var FUENTES = [
    ['pollo', 230, 600, 0.15], ['pescado', 540, 600, 0.27], ['huevo', 850, 600, 0.38],
    ['leche', 385, 900, 0.49], ['legumbres', 695, 900, 0.6],
    ['frutosSecos', 385, 1200, 0.72], ['semillas', 695, 1200, 0.84]
  ];
  function EscFuentes(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var r1 = M.pop(T, at - 0.6, 0.5);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        {FUENTES.map(function (c, i) {
          var Comida = N.COMIDA[c[0]];
          var e = M.pop(T, f(c[3] - 0.03), 0.42);
          return (
            <Pos key={c[0]} x={c[1] - 126} y={c[2] - 126} e={e} dy={M.life(T, 3, 6, i * 0.14)}>
              <div style={{ position: 'relative', width: 252, height: 252 }}>
                <N.Plato s={0.6} />
                <div style={{ position: 'absolute', left: 126 - 96, top: 126 - 96 }}>
                  <Comida s={0.8} />
                </div>
              </div>
            </Pos>
          );
        })}
        <Rot T={T} text="FUENTES DE PROTEÍNA" y={260} e={r1} />
      </div>
    );
  }

  /* 5 — cuanta: Tor en la balanza; el medidor entra en la zona de 1,6 a 2,2 g/kg */
  var ZONA = [7 * Math.PI / 180, 42 * Math.PI / 180];   // p 0.55 .. 0.8 del dial
  function EscCuanta(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var dial = M.pop(T, f(0.1), 0.45);
    var aguja = animate({ from: 0, to: 0.68, start: f(0.2), end: f(0.55), ease: Easing.easeOutElastic })(T)
      + M.life(T, 1.6, 0.012);
    var r1 = M.pop(T, f(0.12), 0.4), r2 = M.pop(T, f(0.5), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={[540, 960]}>
          <Pos x={FIG.x - 170} y={FIG.y + 40} e={fig} dy={M.life(T, 3.6, 4)}>
            <TOR.Tor s={FIG.s} piso={PISO} sinPiso fondo={balanza} />
          </Pos>
          <Pos x={640} y={560} e={dial} dy={M.life(T, 2.8, 6)}>
            <N.Dial s={1.15} p={aguja} zona={ZONA} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.58)} x={830} y={860} />
        <Rot T={T} text="1,6 A 2,2 G" s={1.25} y={260} e={r1} />
        <Rot T={T} text="POR KILO, AL DÍA" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 6 — ejemplo: 70 kg -> 112 a 154 g al dia */
  var CHICO = { x: 128, y: 196, s: 0.42 };
  var EN_PLATO = [['pollo', -110, -100], ['huevo', 110, -100], ['pescado', -110, 100], ['legumbres', 110, 100]];
  function EscEjemplo(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var fig = M.pop(T, at - 0.6, 0.5);
    var cuenta = M.pop(T, f(0.1), 0.42);
    var kilos = Math.round(70 * Easing.easeOutCubic(animate({ from: 0, to: 1, start: f(0.12), end: f(0.36) })(T)));
    var plato = M.pop(T, f(0.4), 0.45);
    var r1 = M.pop(T, f(0.06), 0.4), r2 = M.pop(T, f(0.5), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Pos x={CHICO.x} y={CHICO.y} e={fig} dy={M.life(T, 3.6, 4)}>
          <TOR.Tor s={CHICO.s} piso={PISO} sinPiso fondo={balanza} />
        </Pos>
        <Pos x={640} y={470} e={cuenta} dy={M.life(T, 3, 5)}>
          <B.Cuenta s={1.05} n={kilos} p={kilos / 70} />
        </Pos>
        <Pos x={309} y={900} e={plato} dy={M.life(T, 3.4, 5, 0.3)}>
          <div style={{ position: 'relative', width: 462, height: 462 }}>
            <N.Plato s={1.1} />
            {EN_PLATO.map(function (c, i) {
              var Comida = N.COMIDA[c[0]];
              var e = M.pop(T, f(0.5 + i * 0.07), 0.4);
              return (
                <Pos key={c[0]} x={231 + c[1] - 84} y={231 + c[2] - 84} e={e}>
                  <Comida s={0.7} />
                </Pos>
              );
            })}
          </div>
        </Pos>
        <Bien T={T} cuando={f(0.82)} x={830} y={980} />
        <Rot T={T} text="SI PESAS 70 KG" y={250} e={r1} />
        <Rot T={T} text="112 A 154 G AL DÍA" y={1420} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 7 — cierre: Tor saca biceps */
  function EscCierre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var fig = M.pop(T, at - 0.6, 0.5);
    var flex = 0.55 + 0.45 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.04), end: f(0.3) })(T));
    var r1 = M.pop(T, f(0.1), 0.4), r2 = M.pop(T, f(0.4), 0.4);
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={enLienzo([600, 760])}>
          <Pos x={FIG.x} y={FIG.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <TOR.Tor s={FIG.s} flex={flex} boca="sonrisa" sinPiso musc={{ bic: 1 }} />
          </Pos>
        </Camara>
        <Bien T={T} cuando={f(0.32)} x={800} y={820} s={0.85} />
        <Rot T={T} text="PROTEÍNA SUFICIENTE" y={250} e={r1} />
        <Rot T={T} text="TODOS LOS DÍAS" y={1490} e={r2} fase={0.4} />
      </div>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.5, C: EscGancho,
      vo: 'Estás comiendo poca proteína.' },
    { nombre: 'Qué es', dur: 4.5, C: EscQueEs,
      vo: 'La proteína está hecha de aminoácidos: los ladrillos de tu músculo.' },
    { nombre: 'Para qué', dur: 5, C: EscParaQue,
      vo: 'Después de entrenar, tu cuerpo la usa para reparar el músculo y hacerlo crecer.' },
    { nombre: 'Fuentes', dur: 5.5, C: EscFuentes,
      vo: 'Está en carnes, pescados, huevos, lácteos, legumbres, frutos secos y semillas.' },
    { nombre: 'Cuánta', dur: 6, C: EscCuanta,
      vo: 'Para ganar músculo: de 1,6 a 2,2 gramos por kilo de peso al día.' },
    { nombre: 'Ejemplo', dur: 5.5, C: EscEjemplo,
      vo: 'Si pesas 70 kilos, son entre 112 y 154 gramos al día.' },
    { nombre: 'Cierre', dur: 2.5, C: EscCierre,
      vo: 'Proteína suficiente, todos los días.' }
  ];

  global.REELS.registrar({ id: 'proteinas', titulo: 'Proteínas (nutrición)', escenas: ESCENAS });
})(window);
