/* ============================================================
   GTA 6 — reel con Tor, ESTILO 2 (~36 s con la accion y el cierre)
   "No juegues mucho GTA 6" (pedido del autor): Tor viciado y sedentario,
   y el mensaje no es "no juegues" sino "primero muevete y come bien".
   El juego se nombra (sale el 19 de noviembre de 2026) pero no se copia nada
   suyo: ni logo, ni arte, ni personajes; lo que se ve en la tele es un dibujo
   generico en el estilo de pizarra. El chiste de "Lucia" y "el club" va sin
   nada explicito: un personaje que camina y un cartel de neon.
   Lo que dice la evidencia: pasar muchas horas sentado empeora la salud
   metabolica; cortar el tiempo sentado con pausas cortas de movimiento
   (cada 30-60 min) mejora la glucosa y la insulina (Dunstan 2012).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, PL = global.PL, V = global.V, TOR = global.TOR, MU = global.MU, NOVIA = global.NOVIA;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var A = global.REELS.ayudas;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };
  var L1 = 198, L2 = 193, BAJA = 250;

  function pulso(T, cuando, d) { var u = (T - cuando) / d; return u > 0 && u < 1 ? Math.sin(Math.PI * u) : 0; }
  function icono(Cmp, c, k, ang, props) {
    return (
      <g transform={'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + (ang || 0).toFixed(1) + ') scale(' + k + ') translate(-120 -120)'}>
        <Cmp s={1} {...(props || {})} />
      </g>
    );
  }

  /* ---------------- Tor gamer (de frente, en el sofa) ---------------- */

  var TS = { x: 72, y: 190, s: 0.78 };
  function poseGamer(T, alza) {
    var p = MU.poseSentado({ baja: BAJA });
    var v = 4 * Math.sin(T * 34);
    p.izq.mano = [533, 1136 + v]; p.der.mano = [667, 1136 - v];
    p.izq.codo = B.ik([428, 626 + BAJA], p.izq.mano, L1, L2, -1);
    p.der.codo = B.ik([772, 626 + BAJA], p.der.mano, L1, L2, 1);
    return p;
  }
  // auriculares con microfono
  function casco(g) {
    var c = g.cabeza;
    var arco = 'M ' + (c[0] - 86) + ' ' + (c[1] + 2) + ' C ' + (c[0] - 100) + ' ' + (c[1] - 156) + ' ' + (c[0] + 100) + ' ' + (c[1] - 156) + ' ' + (c[0] + 86) + ' ' + (c[1] + 2);
    return (
      <g>
        <path d={arco} fill="none" stroke={C.INK} strokeWidth={24} strokeLinecap="round" />
        <path d={arco} fill="none" stroke={C.GRY} strokeWidth={8} strokeLinecap="round" />
        <rect x={c[0] - 110} y={c[1] - 34} width={44} height={90} rx={18} fill={C.RED} {...LN} strokeWidth={11} />
        <rect x={c[0] + 66} y={c[1] - 34} width={44} height={90} rx={18} fill={C.RED} {...LN} strokeWidth={11} />
        <path d={'M ' + (c[0] - 92) + ' ' + (c[1] + 54) + ' Q ' + (c[0] - 92) + ' ' + (c[1] + 100) + ' ' + (c[0] - 40) + ' ' + (c[1] + 92)} fill="none" stroke={C.INK} strokeWidth={10} strokeLinecap="round" />
        <circle cx={c[0] - 36} cy={c[1] + 92} r={12} fill={C.INK} />
      </g>
    );
  }
  function baba(g, T) {
    var l = 26 + 16 * (0.5 + 0.5 * Math.sin(T * 2.2));
    var x = g.cabeza[0] + 22, y = g.cabeza[1] + 66;
    return <path d={'M ' + (x - 7) + ' ' + y + ' L ' + (x - 7) + ' ' + (y + l) + ' A 7 7 0 0 0 ' + (x + 7) + ' ' + (y + l) + ' L ' + (x + 7) + ' ' + y + ' Z'} fill={BLANCO} stroke={C.INK} strokeWidth={6} strokeLinejoin="round" />;
  }
  function controlEn(g) {
    var c = U.lerpP(g.izq.mano, g.der.mano, 0.5);
    return <g transform={'translate(' + c[0].toFixed(1) + ' ' + (c[1] + 4).toFixed(1) + ') scale(1.05) translate(-120 -138)'}><N.ICONOS.control s={1} /></g>;
  }
  function luzTele(T) { return { color: C.YEL, v: 0.3 + 0.22 * Math.sin(T * 11) * Math.sin(T * 3.3) }; }

  // ventana: el sol y la luna se turnan (dia: 0 = sol arriba, 1 = luna arriba)
  function Cielo(props) {
    var k = props.k || 0;                              // vueltas: cada unidad es un dia entero
    var a = k * 2 * Math.PI;
    var sy = 130 + 150 * (1 - Math.cos(a)), ly = 130 + 150 * (1 + Math.cos(a));
    return (
      <svg width={240} height={240} viewBox="0 0 260 260" style={{ display: 'block', overflow: 'visible' }}>
        <rect x={10} y={10} width={240} height={240} rx={16} fill={BLANCO} {...LN} />
        <svg x={18} y={18} width={224} height={224} viewBox="18 18 224 224">
          <circle cx={130} cy={sy} r={46} fill={C.YEL} stroke={C.INK} strokeWidth={10} />
          <g transform={'translate(60 ' + (ly - 74).toFixed(1) + ') scale(0.6)'}><N.ICONOS.luna s={1} /></g>
        </svg>
        <path d="M 130 10 L 130 250 M 10 130 L 250 130" stroke={C.INK} strokeWidth={12} />
        <rect x={10} y={10} width={240} height={240} rx={16} fill="none" {...LN} />
      </svg>
    );
  }
  // cinco estrellas: n (0..5, con decimales) las va prendiendo
  function estrellas5(T, f, y, n, color) {
    var out = [];
    for (var i = 0; i < 5; i++) {
      var e = i === 0 ? M.pop(T, f(0) - 0.6, 0.5) : M.pop(T, f(0.03 + i * 0.03), 0.4);
      var on = n >= i + 1, salto = clamp(n - i, 0, 1);
      var sc = e.scale * (on ? 1 : 0.92) * (1 + 0.25 * Math.sin(Math.PI * clamp(salto * 1.0, 0, 1)) * (n < i + 1 ? 1 : 0));
      out.push(
        <g key={i} opacity={e.opacity} transform={'translate(' + (330 + i * 105) + ' ' + (y + M.life(T, 3, 4, i * 0.2)).toFixed(1) + ') scale(' + (0.42 * sc).toFixed(3) + ') translate(-120 -124)'}>
          <N.ICONOS.estrella s={1} on={on} color={color} />
        </g>
      );
    }
    return <g>{out}</g>;
  }

  /* ---------------- "Lucia" y "el club": de perfil frente a la tele ---------------- */

  var PISO_P = 1300;
  var BASEP = B.posePerfil.depie({ x: 700, piso: PISO_P });
  var FP = { x: 236, y: 486, s: 0.67 };
  function poseGamerPerfil(k, T) {
    var cadera = [820, 1020];
    var pose = Object.assign({}, BASEP, { cadera: cadera, cuello: U.suma(cadera, U.polar(-98 - 20 * k, 404)), curva: 0.22, cabeza: -16 });
    var g = B.geoPerfil({ pose: Object.assign({}, pose, { codo: cadera, mano: cadera }) });
    pose.codo = U.suma(g.hombro, U.polar(104, 232));
    pose.mano = U.suma(pose.codo, U.polar(176, 214));
    pose.mano = U.suma(pose.mano, [0, 3 * Math.sin(T * 34)]);
    pose.codo2 = U.suma(pose.codo, [12, -8]); pose.mano2 = U.suma(pose.mano, [12, -8]);
    pose.rodilla = U.suma(cadera, [-270, 4]); pose.tobillo = U.suma(pose.rodilla, [-12, 264]); pose.punta = U.suma(pose.tobillo, [-112, 32]);
    pose.rodilla2 = U.suma(pose.rodilla, [16, -10]); pose.tobillo2 = U.suma(pose.tobillo, [18, -4]); pose.punta2 = U.suma(pose.punta, [18, -4]);
    return pose;
  }
  // personaje generico que camina (no es el arte del juego): B.Perfil + las capas de NOVIA con otro top
  function poseCamina(T) {
    var w = T * 7;
    var p = Object.assign({}, BASEP);
    var cad = p.cadera;
    var pie = function (fase) {
      var s = Math.sin(w + fase), c = Math.cos(w + fase);
      return [cad[0] + 14 + 150 * s, PISO_P - 32 - 46 * Math.max(0, c)];
    };
    p.tobillo = pie(0); p.punta = U.suma(p.tobillo, [-112, 32]);
    p.tobillo2 = pie(Math.PI); p.punta2 = U.suma(p.tobillo2, [-112, 32]);
    p.rodilla = B.ik(cad, p.tobillo, 272, 268, -1);
    p.rodilla2 = B.ik(cad, p.tobillo2, 272, 268, -1);
    var g = B.geoPerfil({ pose: Object.assign({}, p, { codo: cad, mano: cad }) });
    var a = 90 - 26 * Math.sin(w);
    p.codo = U.suma(g.hombro, U.polar(a, 232)); p.mano = U.suma(p.codo, U.polar(a + 24, 214));
    var a2 = 90 + 26 * Math.sin(w);
    p.codo2 = U.suma(g.hombro, U.polar(a2, 232)); p.mano2 = U.suma(p.codo2, U.polar(a2 + 24, 214));
    return p;
  }
  function Caminante(props) {
    var T = props.T, op = { top: C.RED };
    return (
      <B.Perfil s={props.s} pose={poseCamina(T)}
        fondo={function (g) { return NOVIA.perfil(g, T, op).fondo; }}
        agarre={function (g) { return NOVIA.perfil(g, T, op).agarre; }}
        children={function (g) { return NOVIA.perfil(g, T, op).encima; }} />
    );
  }
  // lo que se ve en la tele (632 x 372): una ciudad con palmeras que pasan, y el personaje o el club
  function palmera(x, k) {
    return (
      <g key={'p' + x.toFixed(0)} transform={'translate(' + x.toFixed(1) + ' 300) scale(' + k + ')'}>
        <path d="M 0 0 Q 10 -80 -4 -170" fill="none" stroke={C.INK} strokeWidth={22} strokeLinecap="round" />
        <path d="M 0 0 Q 10 -80 -4 -170" fill="none" stroke={C.GRY} strokeWidth={9} strokeLinecap="round" />
        {[-150, -110, -60, -20, 30].map(function (a, i) {
          var r = a * Math.PI / 180;
          return <path key={i} d={'M -4 -170 Q ' + (-4 + 60 * Math.cos(r)).toFixed(1) + ' ' + (-190 + 60 * Math.sin(r)).toFixed(1) + ' ' + (-4 + 110 * Math.cos(r)).toFixed(1) + ' ' + (-150 + 70 * Math.sin(r)).toFixed(1)}
            fill="none" stroke={C.GRN} strokeWidth={18} strokeLinecap="round" />;
        })}
      </g>
    );
  }
  function Pantalla(props) {
    var T = props.T, club = props.club;
    var mod = function (v, m) { return ((v % m) + m) % m; };
    if (club) {
      var late = 1 + 0.08 * Math.sin(T * 9), on = Math.sin(T * 9) > -0.3;
      return (
        <g>
          <rect x={70} y={36} width={492} height={340} rx={10} fill={BLANCO} {...LN} strokeWidth={12} />
          <rect x={262} y={196} width={108} height={180} rx={8} fill={C.INK} />
          <circle cx={350} cy={292} r={8} fill={C.YEL} />
          <g transform={'translate(316 112) scale(' + (0.42 * late).toFixed(3) + ') translate(-120 -126)'}>
            <path d="M 120 208 C 30 146 14 86 52 52 C 86 24 120 44 120 76 C 120 44 154 24 188 52 C 226 86 210 146 120 208 Z"
              fill={on ? C.RED : BLANCO} stroke={on ? C.RED : C.GRY} strokeWidth={30} strokeLinejoin="round" />
            <path d="M 120 208 C 30 146 14 86 52 52 C 86 24 120 44 120 76 C 120 44 154 24 188 52 C 226 86 210 146 120 208 Z"
              fill="none" stroke={C.INK} strokeWidth={10} strokeLinejoin="round" />
          </g>
          {[150, 482].map(function (x, i) {
            var v = Math.sin(T * 9 + i * 2) > 0;
            return <path key={x} d={'M ' + (x - 24) + ' 80 L ' + x + ' 106 L ' + (x + 24) + ' 80 M ' + (x - 24) + ' 120 L ' + x + ' 146 L ' + (x + 24) + ' 120'} fill="none"
              stroke={v ? C.YEL : C.GRY} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />;
          })}
          <path d="M 206 372 L 206 300 M 426 372 L 426 300" stroke={C.INK} strokeWidth={14} strokeLinecap="round" />
          <path d="M 206 306 Q 240 350 262 318 M 370 318 Q 394 350 426 306" fill="none" stroke={C.RED} strokeWidth={10} strokeLinecap="round" />
        </g>
      );
    }
    var edif = [], palm = [];
    for (var i = 0; i < 5; i++) {
      var x = mod(i * 190 + T * 34, 950) - 160, h = 110 + 50 * ((i * 7) % 3);
      edif.push(<rect key={'e' + i} x={x.toFixed(1)} y={300 - h} width={120} height={h} fill={C.GRY} stroke={C.INK} strokeWidth={8} />);
    }
    for (var j = 0; j < 3; j++) palm.push(palmera(mod(j * 330 + T * 110, 990) - 170, 0.9));
    return (
      <g>
        <circle cx={540} cy={70} r={40} fill={C.YEL} stroke={C.INK} strokeWidth={9} />
        {edif}
        <rect x={-10} y={300} width={660} height={80} fill={C.GRY} stroke={C.INK} strokeWidth={8} />
        {[0, 1, 2, 3].map(function (i) { return <rect key={i} x={(mod(i * 190 + T * 150, 760) - 100).toFixed(1)} y={334} width={90} height={12} rx={5} fill={BLANCO} />; })}
        {palm}
        <g transform="translate(176 64) scale(0.2)"><Caminante T={T} s={1} /></g>
      </g>
    );
  }
  function EscLucia(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var club = T >= f(0.52);
    var k = animate({ from: 0, to: 0.5, start: f(0.08), end: f(0.3), ease: Easing.easeInOutCubic })(T) +
      animate({ from: 0, to: 0.5, start: f(0.56), end: f(0.74), ease: Easing.easeInOutCubic })(T);
    var amor = clamp((T - f(0.1)) / 0.3, 0, 1);
    var late = 1 + 0.18 * Math.max(0, Math.sin(T * 9));
    var pisoY = FP.y + PISO_P * FP.s;
    var flash = pulso(T, f(0.52), 0.22);
    var TV = { x: 24, y: 452, s: 0.9 };
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} tomas={[[0, { zoom: 1.0, foco: [540, 900] }], [0.3, { zoom: 1.08, foco: [520, 860] }], [0.5, { zoom: 1.0, foco: [540, 900] }], [0.8, { zoom: 1.1, foco: [520, 860] }], [1, { zoom: 1.02, foco: [540, 900] }]]}
          golpes={[0.36, 0.8]} pulsos={[0.52]}>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <path d={'M 20 ' + (pisoY + 3) + ' L 1060 ' + (pisoY + 3)} stroke={C.GRY} strokeWidth={12} strokeLinecap="round" />
            {/* el mueble de la tele */}
            <rect x={40} y={TV.y + 540 * TV.s - 6} width={590} height={pisoY - (TV.y + 540 * TV.s) + 6} rx={18} fill={C.GRY} {...LN} />
            <path d={'M 335 ' + (TV.y + 540 * TV.s + 20) + ' L 335 ' + (pisoY - 20)} stroke={C.INK} strokeWidth={10} strokeLinecap="round" />
            <circle cx={300} cy={(TV.y + 540 * TV.s + pisoY) / 2} r={9} fill={C.INK} /><circle cx={370} cy={(TV.y + 540 * TV.s + pisoY) / 2} r={9} fill={C.INK} />
            <g transform={'translate(' + TV.x + ' ' + TV.y + ')'}>
              <MU.Tele s={TV.s}>
                <Pantalla T={T} club={club} />
                {flash > 0.02 ? <rect x={0} y={0} width={632} height={372} fill={BLANCO} opacity={flash} /> : null}
              </MU.Tele>
            </g>
          </svg>
          <A.Pos x={FP.x} y={FP.y} e={M.pop(T, at - 0.6, 0.5)} dy={M.life(T, 3.6, 3)}>
            <B.Perfil s={FP.s} pose={poseGamerPerfil(k, T)} parpadeo={0}
              fondo={function () {
                return (
                  <g>
                    <V.Sombra c={[800, PISO_P + 2]} rx={320} />
                    <rect x={900} y={690} width={120} height={480} rx={50} fill={C.GRY} {...LN} />
                    <rect x={650} y={1150} width={370} height={130} rx={26} fill={C.GRY} {...LN} />
                    <rect x={630} y={1052} width={400} height={110} rx={44} fill={BLANCO} {...LN} />
                    <path d={'M 690 1280 L 690 ' + PISO_P + ' M 980 1280 L 980 ' + PISO_P} stroke={C.INK} strokeWidth={22} strokeLinecap="round" />
                  </g>
                );
              }}
              agarre={function (g) {
                return <g transform={'translate(' + (g.mano[0] - 30).toFixed(1) + ' ' + (g.mano[1] + 6).toFixed(1) + ') scale(0.78) translate(-120 -138)'}><N.ICONOS.control s={1} /></g>;
              }}
              children={function (g) {
                var ojo = g.ojo, m = g.menton;
                return (
                  <g>
                    <g transform={'translate(' + (ojo[0] - 2).toFixed(1) + ' ' + ojo[1].toFixed(1) + ') scale(' + (amor * late * 1.25).toFixed(3) + ')'}>
                      <path d="M 0 21 C -32 -2 -20 -26 0 -9 C 20 -26 32 -2 0 21 Z" fill={C.RED} stroke={C.INK} strokeWidth={6} strokeLinejoin="round" />
                    </g>
                    <ellipse cx={ojo[0] + 30} cy={ojo[1] + 44} rx={16} ry={10} fill={C.RED} opacity={0.55 * amor} />
                    {amor > 0.5 ? <path d={'M ' + (m[0] + 6) + ' ' + (m[1] - 22) + ' l 0 ' + (34 + 14 * Math.sin(T * 2.4)).toFixed(1) + ' a 7 7 0 0 0 14 0 l 0 ' + (-(34 + 14 * Math.sin(T * 2.4))).toFixed(1) + ' Z'}
                      fill={BLANCO} stroke={C.INK} strokeWidth={6} strokeLinejoin="round" /> : null}
                    {[0, 1, 2].map(function (i) {
                      var u = ((T * 0.8 + i / 3) % 1);
                      return amor > 0.5 ? (
                        <g key={i} opacity={1 - u} transform={'translate(' + (ojo[0] - 60 - 130 * u).toFixed(1) + ' ' + (ojo[1] - 60 - 150 * u + 30 * Math.sin(u * 9 + i)).toFixed(1) + ') scale(' + (0.7 + 0.5 * u).toFixed(2) + ')'}>
                          <path d="M 0 21 C -32 -2 -20 -26 0 -9 C 20 -26 32 -2 0 21 Z" fill={C.RED} stroke={C.INK} strokeWidth={6} strokeLinejoin="round" />
                        </g>
                      ) : null;
                    })}
                  </g>
                );
              }} />
          </A.Pos>
        </V.Camara>
        <A.Mal T={T} cuando={f(0.36)} hasta={f(0.5)} x={236} y={560} s={0.9} />
        <A.Mal T={T} cuando={f(0.8)} x={236} y={560} s={0.9} />
        <V.Rot T={T} text="LUCÍA NO ES REAL" y={280} s={1.15} cuando={at - 0.6} />
        <V.Rot T={T} text="Y SAL DEL CLUB" y={1490} s={1.15} cuando={f(0.6)} fase={0.4} />
      </div>
    );
  }

  /* ---------------- la pausa: sentadillas frente al sofa ---------------- */

  function poseSentadilla(k) {
    var p = B.poseFrente.sumo({ prof: k, pies: 150, pieAng: 18 });
    delete p.mancuerna;
    var g = B.geoFrente({ pose: p });
    var y = p.cuello[1] + 190;
    p.izq.mano = [560, y]; p.der.mano = [640, y];
    p.izq.codo = B.ik(g.izq.hombro, p.izq.mano, L1, L2, -1);
    p.der.codo = B.ik(g.der.hombro, p.der.mano, L1, L2, 1);
    return p;
  }
  function Pausa(props) {
    var s = props.s || 1;
    return (
      <svg width={200 * s} height={200 * s} viewBox="0 0 200 200" style={{ display: 'block', overflow: 'visible' }}>
        <rect x={10} y={10} width={180} height={180} rx={40} fill={C.YEL} {...LN} />
        <rect x={62} y={52} width={28} height={96} rx={10} fill={C.INK} />
        <rect x={110} y={52} width={28} height={96} rx={10} fill={C.INK} />
      </svg>
    );
  }

  /* ---------------- misiones del dia ---------------- */

  function tarjeta(T, f, i, cuando, hecho, dibujo, candado) {
    var e = i === 0 ? M.pop(T, f(0) - 0.6, 0.5) : M.pop(T, f(cuando), 0.42);
    if (e.opacity < 0.02) return null;
    var h = clamp((T - f(hecho)) / 0.25, 0, 1);
    var abre = candado == null ? 1 : clamp((T - f(candado)) / 0.3, 0, 1);
    var y = 520 + i * 262;
    return (
      <g key={i} opacity={e.opacity} transform={'translate(770 ' + (y + M.life(T, 3, 5, i * 0.3)).toFixed(1) + ') scale(' + e.scale.toFixed(3) + ')'}>
        <rect x={-250} y={-110} width={500} height={220} rx={36} fill={h > 0 && abre >= 1 ? C.YEL : BLANCO} {...LN} />
        <g transform="translate(-130 0)">{dibujo}</g>
        {candado != null && abre < 1 ? (
          <g transform={'translate(110 ' + (-10 - 60 * abre).toFixed(1) + ') rotate(' + (40 * abre).toFixed(1) + ')'} opacity={1 - abre}>
            <path d="M -30 -10 L -30 -44 Q -30 -78 0 -78 Q 30 -78 30 -44 L 30 -10" fill="none" stroke={C.INK} strokeWidth={16} strokeLinecap="round" />
            <rect x={-48} y={-14} width={96} height={80} rx={16} fill={C.GRY} {...LN} strokeWidth={12} />
            <circle cx={0} cy={22} r={10} fill={C.INK} />
          </g>
        ) : null}
        {h > 0 ? (
          <g transform={'translate(140 0) scale(' + Easing.easeOutBack(h).toFixed(3) + ')'}>
            <circle cx={0} cy={0} r={54} fill={C.GRN} stroke={C.INK} strokeWidth={12} />
            <path d="M -24 2 L -6 20 L 26 -18" fill="none" stroke={BLANCO} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </g>
    );
  }

  /* ---------------- escenas ---------------- */

  var BASURA = [[N.COMIDA.pizza, 30, 1250, 0.62, 0.12], [N.ICONOS.lata, 880, 1280, 0.6, 0.2], [N.ICONOS.lata, 190, 1330, 0.5, 0.3],
    [N.COMIDA.gaseosa, 760, 1290, 0.6, 0.42], [N.COMIDA.pizza, 900, 1130, 0.5, 0.54], [N.COMIDA.dona, 60, 1110, 0.5, 0.66]];

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: 'No juegues mucho GTA 6.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.42, foco: [540, 760] }], [1, { zoom: 1.02, foco: [540, 900] }]],
        tor: { x: TS.x, y: TS.y, s: TS.s, ojos: 'espiral', boca: 'abierta',
          pose: function (T) { return poseGamer(T); },
          gesto: function (T) { return { giroOjos: T * 300, boca: 0.6, cara: luzTele(T) }; },
          fondo: function () { return MU.sofa(); },
          agarre: function (g) { return controlEn(g); },
          extra: function (g, T) { return <g>{casco(g)}{baba(g, T)}</g>; } },
        piezas: BASURA.slice(0, 3).map(function (b) { return { C: b[0], x: b[1], y: b[2], s: b[3], cuando: b[4] }; }),
        mal: [{ x: 70, y: 430, cuando: 0.22, s: 0.6 }, { x: 860, y: 560, cuando: 0.46, s: 0.5 }],
        r1: { text: 'GTA 6', s: 1.4, cuando: 0.02 },
        r2: { text: 'MODO ZOMBI', s: 1.2, cuando: 0.4 }
      }) },

    { nombre: 'Días en el sofá', dur: 5.6, vo: 'Sale el 19 de noviembre, y ya sabes lo que viene: días enteros sin moverte del sofá.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.02, foco: [540, 900] }], [0.6, { zoom: 1.1, foco: [540, 860] }], [1, { zoom: 1.02, foco: [540, 900] }]],
        golpes: [0.82],
        tor: { x: TS.x, y: TS.y, s: TS.s, boca: 'abierta',
          ojos: function (T, f) { return T < f(0.5) ? 'espiral' : 'rojos'; },
          pose: function (T) { return poseGamer(T); },
          gesto: function (T, f) { return { giroOjos: T * 300, boca: 0.6, cara: T > f(0.82) ? { color: C.RED, v: 0.5 + 0.5 * Math.sin(T * 14) } : luzTele(T) }; },
          panza: function (T, f) { return animate({ from: 0, to: 0.8, start: f(0.1), end: f(0.8) })(T); },
          fondo: function () { return MU.sofa(); },
          agarre: function (g) { return controlEn(g); },
          extra: function (g, T, f) { A.sonido('sirena', f(0.82)); return <g>{casco(g)}{baba(g, T)}</g>; } },
        piezas: BASURA.map(function (b, i) { return { C: b[0], x: b[1], y: b[2], s: b[3], cuando: i < 3 ? null : b[4] }; }).concat([
          { C: Cielo, x: 40, y: 380, p: function (T, f) { return { k: animate({ from: 0, to: 3, start: f(0.06), end: f(0.86) })(T) }; } },
          { C: B.Cuenta, s: 1.0, x: 820, y: 390, p: function (T, f) { var n = Math.round(animate({ from: 1, to: 72, start: f(0.06), end: f(0.86) })(T)); return { n: n, p: n / 72 }; } }
        ]),
        lienzo: function (T, f) { return estrellas5(T, f, 470, animate({ from: 0, to: 5, start: f(0.2), end: f(0.82) })(T), C.RED); },
        r1: { text: 'HORAS SENTADO', s: 1.2, cuando: 0.02 },
        r2: { text: 'SEDENTARISMO NIVEL 5', s: 1.05, cuando: 0.74 }
      }) },

    { nombre: 'Lucía y el club', dur: 5.4, vo: 'Y no te embobes con Lucía, ni te quedes a vivir en el club.', C: EscLucia },

    { nombre: 'Pausa', dur: 5, vo: 'Regla del gamer: cada hora, pausa y muévete: diez sentadillas o diez flexiones.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [540, 860] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.34, 0.6, 0.86],
        detras: function (T, f) { return <V.Sombra c={[540, 1382]} rx={250} />; },
        tor: { x: 120, y: 330, s: 0.7, boca: 'sonrisa', musc: { cuad: 1 },
          pose: function (T, f) { return poseSentadilla(V.ida(V.fase(T, f(0.1), f(0.98), 3), 0.42, 0.12)); },
          extra: function (g, T, f) {
            var k = V.ida(V.fase(T, f(0.1), f(0.98), 3), 0.42, 0.12);
            return <g><V.Brillo T={T} c={g.izq.rodilla} r={90} v={k} /><V.Brillo T={T} c={g.der.rodilla} r={90} v={k} /></g>;
          } },
        piezas: [
          { C: Pausa, s: 1.0, x: 60, y: 400 },
          { C: N.ICONOS.control, s: 0.75, x: 60, y: 1230, cuando: 0.06 },
          { C: B.Cuenta, s: 1.0, x: 820, y: 390, cuando: 0.1,
            p: function (T, f) { var n = 8 + Math.min(2, Math.floor(clamp((T - f(0.1)) / (f(0.98) - f(0.1)), 0, 0.999) * 3)); return { n: n, p: n / 10 }; } }
        ],
        bien: [{ x: 850, y: 700, cuando: 0.9, s: 0.7 }],
        r1: { text: 'CADA HORA: PAUSA', s: 1.15, cuando: 0.04 },
        r2: { text: '10 SENTADILLAS', s: 1.2, cuando: 0.4 }
      }) },

    { nombre: 'Misiones', dur: 5, vo: 'Entrena antes de jugar y come comida de verdad, no solo snacks y energizantes.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.04, foco: [560, 800] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.74],
        tor: { s: 0.5, x: -40, y: 600, boca: 'sonrisa', musc: { bic: 1 },
          flex: function (T, f) { return animate({ from: 0, to: 1, start: f(0.72), end: f(0.86), ease: Easing.easeOutBack })(T); } },
        lienzo: function (T, f) {
          return (
            <g>
              {tarjeta(T, f, 0, 0, 0.26, <g transform="translate(-150 -56) scale(0.72)"><P.Pesa s={1} /></g>)}
              {tarjeta(T, f, 1, 0.12, 0.48, <g transform="translate(-96 -96) scale(0.8)"><N.COMIDA.pollo s={1} /></g>)}
              {tarjeta(T, f, 2, 0.24, 0.76, <g transform="translate(-100 -110) scale(0.84)"><N.ICONOS.control s={1} /></g>, 0.62)}
            </g>
          );
        },
        piezas: [
          { C: N.ICONOS.lata, s: 0.55, x: 40, y: 1250, cuando: 0.5 },
          { C: N.COMIDA.dona, s: 0.5, x: 190, y: 1270, cuando: 0.54 }
        ],
        mal: [{ x: 110, y: 1250, cuando: 0.6, s: 0.6 }],
        r1: { text: 'MISIONES DE HOY', s: 1.2, cuando: 0.02 },
        r2: { text: 'PRIMERO ENTRENA Y COME', s: 1.0, cuando: 0.5 }
      }) },

    { nombre: 'Misión cumplida', dur: 4.6, vo: 'Y ahí sí: juega todo lo que quieras. Misión cumplida.',
      C: PL.escena2({
        tomas: [[0, { zoom: 1.12, foco: [540, 820] }], [1, { zoom: 1.0, foco: [540, 900] }]],
        pulsos: [0.3],
        tor: { x: TS.x, y: TS.y, s: TS.s, boca: 'sonrisa', musc: { bic: 1 },
          pose: function (T, f) {
            var k = animate({ from: 0, to: 1, start: f(0.1), end: f(0.3), ease: Easing.easeOutBack })(T);
            var p = MU.poseSentado({ baja: BAJA });
            var fl = TOR.pose({ flex: k });
            p.izq.codo = U.suma(fl.izq.codo, [0, BAJA]); p.izq.mano = U.suma(fl.izq.mano, [0, BAJA]);
            p.der.mano = U.lerpP([667, 1136], [900, 640 + 14 * Math.sin(T * 6)], k);
            p.der.codo = B.ik([772, 626 + BAJA], p.der.mano, L1, L2, k > 0.5 ? -1 : 1);
            return p;
          },
          fondo: function () { return MU.sofa(); },
          agarre: function (g) { return <g transform={'translate(' + (g.der.mano[0] + 10).toFixed(1) + ' ' + (g.der.mano[1] - 30).toFixed(1) + ') rotate(-14) scale(0.9) translate(-120 -138)'}><N.ICONOS.control s={1} /></g>; },
          extra: function (g, T, f) { return <g>{casco(g)}<V.Chispa T={T} c={[g.der.mano[0], g.der.mano[1] - 60]} cuando={f(0.3)} r={170} /></g>; } },
        lienzo: function (T, f) {
          return <g>{estrellas5(T, f, 470, animate({ from: 0, to: 5, start: f(0.24), end: f(0.6) })(T))}<V.Confeti T={T} desde={f(0.4)} /></g>;
        },
        bien: [{ x: 850, y: 620, cuando: 0.66, s: 0.75 }],
        r1: { text: 'MISIÓN CUMPLIDA', s: 1.25, cuando: 0.04 },
        r2: { text: 'AHORA SÍ: A JUGAR', s: 1.15, cuando: 0.4 }
      }) }
  ];

  global.REELS.registrar({
    id: 'gta6', titulo: 'No juegues mucho GTA 6 (estilo 2)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿QUIÉN SE VA A VICIAR?', vo: 'Mándaselo al amigo que va a desaparecer cuando salga, y guarda este video.' }
  });
})(window);
