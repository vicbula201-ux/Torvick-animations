/* ============================================================
   SENTADILLA SUMO CON MANCUERNA — reel vertical 1080x1920
   (~52 s con el cierre de marca)
   Fuente tecnica: libro de biomecanica, pag. 137. Pies mas anchos que
   los hombros con las puntas afuera, mancuerna con las dos manos cerca
   del cuerpo, rodillas en la direccion de los pies, empujar con los
   talones. Primarios: cuadriceps y gluteo mayor. Sinergistas: aductores,
   isquiotibiales y gemelos. Errores: curvar la espalda y el valgo.

   Cada escena sigue la regla de f(fraccion): si cambias una duracion
   (en ESCENAS o en la lista de la pagina) la coreografia se estira o
   se encoge sola, para calzar con la locucion grabada.
   La pagina, las transiciones, el sello y el cierre de marca los pone
   reel.jsx; aca solo van las escenas.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var A = global.REELS.ayudas;
  var sale = A.sale, junta = A.junta, reps = A.reps, Pos = A.Pos, Rot = A.Rot;
  var Camara = A.Camara, Recorte = A.Recorte;
  var GRAD = Math.PI / 180;

  var FR = { x: 24, y: 140, s: 0.86 };     // persona de frente, grande (piso en y 1430)
  var PF = { x: -29, y: 234, s: 0.92 };    // persona de perfil, grande (piso en y 1430)
  var PIES = 300;                          // medio ancho entre tobillos: bien abiertos
  function enLienzo(base, p) { return [base.x + p[0] * base.s, base.y + p[1] * base.s]; }

  /* ---------------- poses ---------------- */

  function sumo(prof, valgo) {
    return B.poseFrente.sumo({ prof: prof, valgo: valgo || 0, pies: PIES });
  }

  function perfil(prof, curva) {
    return B.posePerfil.sentadilla({ prof: prof, curva: curva || 0, pesa: true });
  }

  // de pie en sumo, de perfil, con los brazos rectos adelantados 'ang' grados
  // (0 = colgando pegados al cuerpo); la mancuerna sigue a las manos
  function perfilBrazos(ang) {
    var pose = perfil(0, 0);
    var med = B.PERFIL.medidas;
    var codo = U.suma(pose.hombro, U.polar(92 + ang, med.brazo));
    var mano = U.suma(codo, U.polar(92 + ang, med.ante));
    var codo2 = U.suma(codo, [12, -8]), mano2 = U.suma(mano, [6, -4]);
    var agarre = U.lerpP(mano, mano2, 0.5);
    var lg = pose.mancuerna.largo;
    return Object.assign({}, pose, {
      codo: codo, mano: mano, codo2: codo2, mano2: mano2,
      mancuerna: Object.assign({}, pose.mancuerna, {
        agarre: agarre, arriba: U.suma(agarre, [0, -6]), abajo: U.suma(agarre, [0, lg])
      })
    });
  }

  /* ---------------- piezas chicas ---------------- */

  function Mancuerna(props) {
    var m = props.g.mancuerna;
    if (!m) return null;
    var e = props.e || { opacity: 1, scale: 1 };
    var c = U.lerpP(m.arriba, m.abajo, 0.5);
    var sc = e.scale == null ? 1 : e.scale;
    return (
      <g opacity={e.opacity}
        transform={'translate(' + c[0] + ' ' + c[1] + ') scale(' + sc.toFixed(4) + ') translate(' + (-c[0]) + ' ' + (-c[1]) + ')'}>
        <B.MancuernaG a={m.arriba} b={m.abajo} />
      </g>
    );
  }

  // trazo continuo que se dibuja de a poco (p 0..1)
  function Linea(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.02) return null;
    var pts = props.pts, tramos = [], total = 0;
    for (var i = 1; i < pts.length; i++) {
      var l = U.largo(U.resta(pts[i], pts[i - 1]));
      tramos.push(l); total += l;
    }
    var resto = total * p, vis = [pts[0]];
    for (var j = 1; j < pts.length && resto > 0; j++) {
      if (tramos[j - 1] <= resto) { vis.push(pts[j]); resto -= tramos[j - 1]; }
      else { vis.push(U.lerpP(pts[j - 1], pts[j], resto / tramos[j - 1])); resto = 0; }
    }
    return (
      <path d={'M ' + vis.map(U.pt).join(' L ')} fill="none" stroke={props.color}
        strokeWidth={props.sw || 18} strokeLinecap="round" strokeLinejoin="round" opacity={props.opacity} />
    );
  }

  function angulo(a, b) { var d = U.resta(b, a); return Math.atan2(d[1], d[0]) / GRAD; }

  // flechas horizontales junto a cada rodilla: 'adentro' (empujan hacia el centro) o 'afuera'
  function flechasRodilla(g, hacia, color, p, opacity) {
    return [g.izq, g.der].map(function (q, i) {
      var R = q.rodilla, l = q.lado;
      var lejos = U.suma(R, [l * 240, -6]), cerca = U.suma(R, [l * 86, -6]);
      var a = hacia === 'adentro' ? lejos : cerca;
      var b = hacia === 'adentro' ? cerca : lejos;
      return <B.FlechaS key={'fr' + i} a={a} b={b} p={p} opacity={opacity} color={color} sw={20} cabeza={42} />;
    });
  }

  // anillos en las rodillas: k 0 = rojo (mal), 1 = verde (bien)
  function anillosRodilla(g, p, k, colorMal) {
    if (p < 0.02) return null;
    return [g.izq, g.der].map(function (q, i) {
      return (
        <g key={'ar' + i}>
          <g opacity={1 - k}><B.Anillo c={q.rodilla} r={74} p={p} color={colorMal || C.RED} sw={16} /></g>
          <g opacity={k}><B.Anillo c={q.rodilla} r={74} p={p} color={C.GRN} sw={16} /></g>
        </g>
      );
    });
  }

  // guia de puntos de la rodilla a la punta de su pie
  function guiasPunta(g, p, color, opacity) {
    return [g.izq, g.der].map(function (q, i) {
      return <B.Puntos key={'gp' + i} pts={[q.rodilla, q.punta]} p={p} color={color} sw={17} opacity={opacity} />;
    });
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: baja con las rodillas adentro (X), las saca y se enciende */
  function EscGancho(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var prof = animate({ from: 0, to: 1, start: f(0.03), end: f(0.3), ease: Easing.easeInOutSine })(T);
    var corrige = animate({ from: 0, to: 1, start: f(0.52), end: f(0.66), ease: Easing.easeInOutCubic })(T);
    var valgo = 1 - corrige;
    var falla = valgo * prof > 0.55 ? M.vibra(T, 44, 3) : 0;
    var luz = animate({ from: 0, to: 1, start: f(0.64), end: f(0.74) })(T);
    var anillos = animate({ from: 0, to: 1, start: f(0.24), end: f(0.32) })(T);
    var pRojas = M.draw(T, f(0.28), 0.3);
    var oRojas = sale(T, f(0.5)).opacity;
    var pVerdes = M.draw(T, f(0.6), 0.3);

    var acerca = animate({ from: 0, to: 1, start: f(0.22), end: f(0.38), ease: Easing.easeInOutCubic })(T) -
      animate({ from: 0, to: 1, start: f(0.7), end: f(0.86), ease: Easing.easeInOutCubic })(T);
    var zoom = 1 + 0.16 * acerca + 0.03 * t;

    var fig = M.pop(T, at - 0.6, 0.5);
    var titulo = M.pop(T, f(0.02), 0.45);
    var pregunta = M.pop(T, f(0.2), 0.45);
    var tacha = junta(M.pop(T, f(0.36), 0.4), sale(T, f(0.54)));
    var visto = M.pop(T, f(0.74), 0.45);
    var pose = sumo(prof, valgo);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={zoom} foco={enLienzo(FR, [600, 1230])}>
          <Pos x={FR.x} y={FR.y} e={fig} dx={falla} dy={M.life(T, 3.6, 5)}>
            <B.Frente s={FR.s} pose={pose} musc={{ cuad: luz }}
              agarre={function (g) { return <Mancuerna g={g} />; }}>
              {function (g) {
                return (
                  <g>
                    {anillosRodilla(g, anillos, corrige)}
                    {flechasRodilla(g, 'adentro', C.RED, pRojas, oRojas)}
                    {flechasRodilla(g, 'afuera', C.GRN, pVerdes)}
                  </g>
                );
              }}
            </B.Frente>
          </Pos>
        </Camara>
        <Pos x={800} y={520} e={tacha} dx={M.vibra(T, 44, 4)}><P.Tacha s={0.62} /></Pos>
        <Pos x={800} y={520} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.7} p={M.draw(T, f(0.74), 0.4)} />
        </Pos>
        <Rot T={T} text="SENTADILLA SUMO" s={1.4} y={250} e={titulo} />
        <Rot T={T} text="¿RODILLAS ADENTRO?" y={1450} e={pregunta} fase={0.4} />
      </div>
    );
  }

  /* 2 — postura: los pies se abren mas alla de los hombros y las puntas giran afuera */
  function EscPostura(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var abre = animate({ from: 0, to: 1, start: f(0.14), end: f(0.42), ease: Easing.easeInOutCubic })(T);
    var gira = animate({ from: 0, to: 1, start: f(0.56), end: f(0.8), ease: Easing.easeInOutCubic })(T);
    var guias = M.draw(T, f(0.03), 0.4);
    var flechas = junta(M.pop(T, f(0.14), 0.3), sale(T, f(0.52))).opacity;
    var arcos = animate({ from: 0, to: 1, start: f(0.56), end: f(0.62) })(T);

    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.16), 0.45);
    var r2 = M.pop(T, f(0.56), 0.45);
    var pose = B.poseFrente.depie({ pies: U.lerp(96, PIES, abre), pieAng: U.lerp(8, 35, gira) });
    var w1 = A.anchoRotulo('PIES ANCHOS'), w2 = A.anchoRotulo('PUNTAS AFUERA');

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.03 * t} foco={[540, 1000]}>
          <Pos x={FR.x} y={FR.y} e={fig} dy={M.life(T, 3.6, 5)}>
            <B.Frente s={FR.s} pose={pose}>
              {function (g) {
                var piso = g.piso;
                return (
                  <g>
                    {[g.izq, g.der].map(function (q, i) {
                      var l = q.lado;
                      var x = q.hombro[0] + l * 52;
                      var a0 = l < 0 ? 96 : 84, a1 = l < 0 ? 152 : 28;
                      return (
                        <g key={i}>
                          <B.Puntos pts={[[x, q.hombro[1] - 40], [x, piso + 8]]} p={guias} color={C.GRY} sw={16} />
                          {abre > 0.04 ? (
                            <B.FlechaS a={[x, piso + 66]} b={[q.tobillo[0] + l * 96, piso + 66]}
                              opacity={flechas} color={C.GRN} sw={18} cabeza={38} />
                          ) : null}
                          <g opacity={arcos}>
                            <B.Arco c={[q.tobillo[0], piso - 24]} r={132} a0={a0} a1={a1} p={gira}
                              color={C.GRN} sw={18} cabeza={38} />
                          </g>
                        </g>
                      );
                    })}
                  </g>
                );
              }}
            </B.Frente>
          </Pos>
        </Camara>
        <Rot T={T} text="PIES ANCHOS" s={1} x={40} y={250} e={r1} />
        <Rot T={T} text="PUNTAS AFUERA" s={1} x={1040 - w2} y={250} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 3 — mancuerna: con las dos manos, y pegada al cuerpo (de perfil se ve la distancia) */
  function EscMancuerna(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var adelante = animate({ from: 0, to: 1, start: f(0.02), end: f(0.18), ease: Easing.easeInOutSine })(T) -
      animate({ from: 0, to: 1, start: f(0.5), end: f(0.68), ease: Easing.easeInOutCubic })(T);
    var pose = perfilBrazos(14 * adelante);
    var lejos = perfilBrazos(14).mancuerna;
    var manc = M.pop(T, f(0.1), 0.42);
    var anillo = animate({ from: 0, to: 1, start: f(0.26), end: f(0.34) })(T) * sale(T, f(0.5)).opacity;
    var flecha = M.draw(T, f(0.48), 0.32);

    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.72), 0.45);
    var rotulo = M.pop(T, f(0.5), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={[540, 1000]}>
          <Pos x={PF.x} y={PF.y} e={fig} dy={M.life(T, 3.6, 5)}>
            <B.Perfil s={PF.s} pose={pose}
              agarre={function (g) { return <Mancuerna g={g} e={manc} />; }}>
              {function (g) {
                var y = lejos.abajo[1] - 20;
                return (
                  <g>
                    <B.Anillo c={g.mano} r={70} p={anillo} color={C.YEL} />
                    <B.FlechaS a={[lejos.abajo[0] - 150, y]} b={[g.mancuerna.abajo[0] - 96, y]} p={flecha}
                      color={C.GRN} sw={20} cabeza={42} />
                  </g>
                );
              }}
            </B.Perfil>
          </Pos>
        </Camara>
        <Pos x={170} y={760} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.62} p={M.draw(T, f(0.72), 0.4)} />
        </Pos>
        <Rot T={T} text="CERCA DEL CUERPO" y={250} e={rotulo} />
      </div>
    );
  }

  /* 4 — bajada: lenta (3-2-1); cada rodilla sigue la punta de su pie */
  function EscBajada(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var u = clamp((T - f(0.06)) / (f(0.62) - f(0.06)), 0, 1);
    var prof = Easing.easeInOutSine(u);
    var n = u < 1 / 3 ? 3 : u < 2 / 3 ? 2 : 1;
    var anilloC = u >= 1 ? 0 : 1 - ((u * 3) % 1);
    var guia = M.draw(T, f(0.24), 0.45);
    var anillos = animate({ from: 0, to: 1, start: f(0.24), end: f(0.32) })(T);
    var ok = animate({ from: 0, to: 1, start: f(0.5), end: f(0.6) })(T);

    var fig = M.pop(T, at - 0.6, 0.5);
    var cuenta = junta(M.pop(T, f(0.03), 0.45), sale(T, f(0.68)));
    var rotulo = M.pop(T, f(0.28), 0.45);
    var visto = M.pop(T, f(0.72), 0.45);
    var pose = sumo(prof, 0);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.05 * t} foco={[540, 1150]}>
          <Pos x={FR.x} y={FR.y} e={fig} dy={M.life(T, 3.6, 5)}>
            <B.Frente s={FR.s} pose={pose} agarre={function (g) { return <Mancuerna g={g} />; }}>
              {function (g) {
                return (
                  <g>
                    {guiasPunta(g, guia, C.YEL, 1 - ok)}
                    {guiasPunta(g, guia, C.GRN, ok)}
                    {anillosRodilla(g, anillos, ok, C.YEL)}
                  </g>
                );
              }}
            </B.Frente>
          </Pos>
        </Camara>
        <Pos x={80} y={440} e={cuenta} dy={M.life(T, 3, 5)}>
          <B.Cuenta s={0.85} n={n} p={anilloC} />
        </Pos>
        <Pos x={800} y={560} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.62} p={M.draw(T, f(0.72), 0.4)} />
        </Pos>
        <Rot T={T} text="RODILLA HACIA LA PUNTA" s={1} y={250} e={rotulo} />
      </div>
    );
  }

  /* 5 — subida: empuja el piso con los talones; cadera y rodilla se abren */
  function EscSubida(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var sube = animate({ from: 0, to: 1, start: f(0.3), end: f(0.82), ease: Easing.easeInOutSine })(T);
    var pose = perfil(1 - sube, 0);
    var empuje = M.draw(T, f(0.06), 0.35);
    var latido = T < f(0.82) ? Math.abs(M.life(T, 0.8, 18)) : 0;
    var arcos = animate({ from: 0, to: 1, start: f(0.3), end: f(0.38) })(T);

    var fig = M.pop(T, at - 0.6, 0.5);
    var rotulo = M.pop(T, f(0.1), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={[540, 1100]}>
          <Pos x={PF.x} y={PF.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <B.Perfil s={PF.s} pose={pose} agarre={function (g) { return <Mancuerna g={g} />; }}>
              {function (g) {
                var aS = angulo(g.rodilla, g.tobillo), aT = angulo(g.rodilla, g.cadera);
                var aM = angulo(g.cadera, g.rodilla), aTr = angulo(g.cadera, g.cuello);
                if (aTr < aM) aTr += 360;
                var x = g.talon[0] + 44;
                return (
                  <g>
                    <B.FlechaS a={[x, g.piso - 330 - latido]} b={[x, g.piso - 22]} p={empuje}
                      color={C.GRN} sw={22} cabeza={46} />
                    <g opacity={arcos}>
                      <B.Arco c={g.rodilla} r={150} a0={aS - 4} a1={aT + 6} color={C.GRN} sw={18} cabeza={40} />
                      <B.Arco c={g.cadera} r={150} a0={aM + 6} a1={aTr - 6} color={C.GRN} sw={18} cabeza={40} />
                    </g>
                  </g>
                );
              }}
            </B.Perfil>
          </Pos>
        </Camara>
        <Rot T={T} text="EMPUJA CON LOS TALONES" s={1} y={250} e={rotulo} />
      </div>
    );
  }

  /* 6 — musculos principales: cuadriceps y gluteo mayor, de a uno */
  function EscMusculosA(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var prof = 0.62 + M.life(T, 2.6, 0.1);
    var cuad = animate({ from: 0, to: 1, start: f(0.3), end: f(0.4) })(T);
    var glu = animate({ from: 0, to: 1, start: f(0.58), end: f(0.68) })(T);

    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.32), 0.45);
    var r2 = M.pop(T, f(0.6), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.18 + 0.05 * t} foco={[560, 1060]} mira={[540, 960]}>
          <Pos x={PF.x} y={PF.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <B.Perfil s={PF.s} pose={perfil(prof, 0)} musc={{ cuad: cuad, glu: glu }}
              agarre={function (g) { return <Mancuerna g={g} />; }} />
          </Pos>
        </Camara>
        <Rot T={T} text="CUÁDRICEPS" y={260} e={r1} />
        <Rot T={T} text="GLÚTEO MAYOR" y={1450} e={r2} fase={0.4} />
      </div>
    );
  }

  // dos vistas apiladas (arriba / abajo), cada una recortada a una franja
  function Mitad(props) {
    var c = props.cfg;
    var w = c.w, h = c.alto * c.s;
    return (
      <Pos x={0} y={0} e={props.e} dx={props.dx} dy={props.dy}
        origen={(c.x + w / 2) + 'px ' + (props.y + h / 2) + 'px'}>
        <Recorte x={c.x} y={props.y} w={w} h={h} desde={c.desde * c.s}>
          <div style={{ position: 'absolute', left: c.ox, top: 0 }}>{props.children}</div>
        </Recorte>
      </Pos>
    );
  }

  /* 7 — sinergistas: aductores (de frente), isquios y gemelos (de perfil) */
  var SIN_FR = { s: 0.74, x: 0, w: 1080, ox: 96, desde: 800, alto: 730 };
  var SIN_PF = { s: 0.74, x: 0, w: 1080, ox: 20, desde: 640, alto: 700 };
  function EscMusculosB(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };

    var prof = 0.72 + M.life(T, 2.6, 0.08);
    var aduct = animate({ from: 0, to: 1, start: f(0.08), end: f(0.2) })(T);
    var isq = animate({ from: 0, to: 1, start: f(0.42), end: f(0.54) })(T);
    var gem = animate({ from: 0, to: 1, start: f(0.6), end: f(0.72) })(T);

    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.32), 0.45);
    var r1 = M.pop(T, f(0.08), 0.45);
    var r2 = M.pop(T, f(0.44), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad cfg={SIN_FR} y={300} e={arriba} dy={M.life(T, 3.6, 4)}>
          <B.Frente s={SIN_FR.s} pose={sumo(prof, 0)} short={0.2} musc={{ cuad: 1 }} muscGris={{ aduct: aduct }}
            agarre={function (g) { return <Mancuerna g={g} />; }} />
        </Mitad>
        <Mitad cfg={SIN_PF} y={880} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <B.Perfil s={SIN_PF.s} pose={perfil(0.62 + M.life(T, 2.6, 0.08), 0)}
            musc={{ cuad: 1, glu: 1 }} muscGris={{ isq: isq, gem: gem }}
            agarre={function (g) { return <Mancuerna g={g} />; }} />
        </Mitad>
        <Rot T={T} text="ADUCTORES" s={1} y={235} e={r1} />
        <Rot T={T} text="ISQUIOS Y GEMELOS" s={1} y={1440} e={r2} fase={0.4} />
      </div>
    );
  }

  /* comparaciones arriba (mal) / abajo (bien) */
  var CMP_PF = { s: 0.5, x: 0, w: 1080, ox: 40, desde: 230, alto: 1100 };
  var CMP_FR = { s: 0.56, x: 0, w: 1080, ox: 80, desde: 520, alto: 1000 };
  var Y_ARRIBA = 340, Y_ABAJO = 920;
  var JUICIO = [780, 200];   // X y visto, relativos a cada mitad

  /* 8 — error 1: espalda curva vs columna neutra */
  function EscError1(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };

    var prof = 0.3 + 0.7 * reps(T, f(0.02), f(0.98), 2);
    var falla = prof > 0.6 ? M.vibra(T, 44, 3) : 0;

    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.4), 0.45);
    var tacha = M.pop(T, f(0.16), 0.4);
    var visto = M.pop(T, f(0.58), 0.45);
    var r1 = M.pop(T, f(0.06), 0.45);
    var r2 = M.pop(T, f(0.46), 0.45);
    var pRoja = M.draw(T, f(0.1), 0.35);
    var pVerde = M.draw(T, f(0.48), 0.35);

    var espalda = function (g, extra) {
      var pts = [];
      for (var i = 0; i <= 12; i++) {
        var tt = U.lerp(0.12, 0.98, i / 12);
        pts.push(g.torso(tt, -(g.anchoEspalda(tt) + extra)));
      }
      return pts;
    };

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad cfg={CMP_PF} y={Y_ARRIBA} e={arriba} dx={falla} dy={M.life(T, 3.6, 4)}>
          <B.Perfil s={CMP_PF.s} pose={perfil(prof, 1)} muscRojo={{ erec: 1 }}
            agarre={function (g) { return <Mancuerna g={g} />; }}>
            {function (g) { return <Linea pts={espalda(g, 40)} p={pRoja} color={C.RED} sw={22} />; }}
          </B.Perfil>
        </Mitad>
        <Mitad cfg={CMP_PF} y={Y_ABAJO} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <B.Perfil s={CMP_PF.s} pose={perfil(prof, 0)}
            agarre={function (g) { return <Mancuerna g={g} />; }}>
            {function (g) {
              var e = espalda(g, 40);
              return <Linea pts={[e[0], e[e.length - 1]]} p={pVerde} color={C.GRN} sw={22} />;
            }}
          </B.Perfil>
        </Mitad>
        <Pos x={JUICIO[0]} y={Y_ARRIBA + JUICIO[1]} e={tacha} dx={M.vibra(T, 44, 4)}>
          <P.Tacha s={0.55} />
        </Pos>
        <Pos x={JUICIO[0]} y={Y_ABAJO + JUICIO[1]} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.6} p={M.draw(T, f(0.58), 0.4)} />
        </Pos>
        <Rot T={T} text="ESPALDA CURVA" s={1} y={235} e={r1} />
        <Rot T={T} text="COLUMNA NEUTRA" s={1} y={1460} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 9 — error 2: rodillas adentro (valgo) vs rodillas afuera, hacia la punta */
  function EscError2(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };

    var prof = 0.2 + 0.8 * reps(T, f(0.02), f(0.98), 2);
    var falla = prof > 0.6 ? M.vibra(T, 44, 3) : 0;

    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.38), 0.45);
    var tacha = M.pop(T, f(0.14), 0.4);
    var visto = M.pop(T, f(0.58), 0.45);
    var r1 = M.pop(T, f(0.04), 0.45);
    var r2 = M.pop(T, f(0.44), 0.45);
    var pRojas = M.draw(T, f(0.08), 0.3);
    var pVerdes = M.draw(T, f(0.46), 0.3);
    var pGuia = M.draw(T, f(0.56), 0.4);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad cfg={CMP_FR} y={Y_ARRIBA} e={arriba} dx={falla} dy={M.life(T, 3.6, 4)}>
          <B.Frente s={CMP_FR.s} pose={sumo(prof, 1)}
            agarre={function (g) { return <Mancuerna g={g} />; }}>
            {function (g) { return <g>{flechasRodilla(g, 'adentro', C.RED, pRojas)}</g>; }}
          </B.Frente>
        </Mitad>
        <Mitad cfg={CMP_FR} y={Y_ABAJO} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <B.Frente s={CMP_FR.s} pose={sumo(prof, 0)}
            agarre={function (g) { return <Mancuerna g={g} />; }}>
            {function (g) {
              return (
                <g>
                  {guiasPunta(g, pGuia, C.GRN)}
                  {flechasRodilla(g, 'afuera', C.GRN, pVerdes)}
                </g>
              );
            }}
          </B.Frente>
        </Mitad>
        <Pos x={JUICIO[0]} y={Y_ARRIBA + JUICIO[1]} e={tacha} dx={M.vibra(T, 44, 4)}>
          <P.Tacha s={0.55} />
        </Pos>
        <Pos x={JUICIO[0]} y={Y_ABAJO + JUICIO[1]} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.6} p={M.draw(T, f(0.58), 0.4)} />
        </Pos>
        <Rot T={T} text="RODILLAS ADENTRO" s={1} y={235} e={r1} />
        <Rot T={T} text="RODILLAS AFUERA" s={1} y={1460} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 10 — cierre: una repeticion limpia, todo se enciende, visto grande */
  function EscCierre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var prof = reps(T, f(0.02), f(0.86), 1);
    var luz = animate({ from: 0, to: 1, start: f(0.3), end: f(0.42) })(T);

    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.46), 0.5);
    var r1 = M.pop(T, f(0.38), 0.45);
    var r2 = M.pop(T, f(0.56), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.05 * t} foco={[540, 1000]}>
          <Pos x={FR.x} y={FR.y} e={fig} dy={M.life(T, 3.6, 5)}>
            <B.Frente s={FR.s} pose={sumo(prof, 0)} musc={{ cuad: luz }} muscGris={{ aduct: luz }}
              agarre={function (g) { return <Mancuerna g={g} />; }} />
          </Pos>
        </Camara>
        <Pos x={790} y={540} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.85} p={M.draw(T, f(0.46), 0.4)} />
        </Pos>
        <Rot T={T} text="SENTADILLA SUMO" s={1.4} y={250} e={r1} />
        <Rot T={T} text="TÉCNICA > PESO" y={1450} e={r2} fase={0.4} />
      </div>
    );
  }

  /* =========================================================
     GUION — duracion y locucion de cada escena
     Las duraciones salen de leer cada linea a ritmo normal
     (~2,7 palabras por segundo). Total: 49 s + 3 s del cierre de marca
     que agrega reel.jsx = 52 s.
     ========================================================= */

  var ESCENAS = [
    { nombre: 'Gancho', dur: 6.5, C: EscGancho,
      vo: '¿Haces sentadilla sumo? Si tus rodillas se van hacia adentro, estás perdiendo lo mejor del ejercicio.' },
    { nombre: 'Postura', dur: 5, C: EscPostura,
      vo: 'Abre los pies más que los hombros, con las puntas hacia afuera.' },
    { nombre: 'Mancuerna', dur: 4, C: EscMancuerna,
      vo: 'Sostén una mancuerna con las dos manos, cerca del cuerpo.' },
    { nombre: 'Bajada', dur: 5.5, C: EscBajada,
      vo: 'Baja con control, con las rodillas siempre en la misma dirección que los pies.' },
    { nombre: 'Subida', dur: 6, C: EscSubida,
      vo: 'Para subir, empuja el piso con los talones: se extienden la cadera y las rodillas.' },
    { nombre: 'Músculos', dur: 4, C: EscMusculosA,
      vo: 'Trabajan sobre todo los cuádriceps y el glúteo mayor…' },
    { nombre: 'Sinergistas', dur: 4, C: EscMusculosB,
      vo: '…con ayuda de los aductores, los isquiotibiales y los gemelos.' },
    { nombre: 'Error 1', dur: 5, C: EscError1,
      vo: 'Error número uno: curvar la espalda. Mantén la columna neutra todo el tiempo.' },
    { nombre: 'Error 2', dur: 6, C: EscError2,
      vo: 'Error número dos: rodillas hacia adentro. Llévalas hacia afuera, siguiendo la punta de los pies.' },
    { nombre: 'Cierre', dur: 3, C: EscCierre,
      vo: 'Así se hace una sentadilla sumo.' }
  ];

  global.REELS.registrar({ id: 'sentadilla-sumo', titulo: 'Sentadilla sumo', escenas: ESCENAS });
})(window);
