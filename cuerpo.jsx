/* ============================================================
   CUERPO — window.B: piezas de cuerpo para videos de ejercicios
   Mismo estilo que P: trazo #14110F grueso, relleno blanco,
   puntas redondas, viewBox fijo, prop s de escala.

   B.Espalda   1100x1000  vista posterior: hombros, escapulas, brazos
   B.Estacion  1300x1300  vista lateral: persona + polea + cable
   B.Cuenta    220x220    anillo que se vacia con un numero adentro

   Las dos vistas reciben children como funcion: (g) => overlays SVG.
   g trae las coordenadas de las articulaciones, asi las flechas y
   las guias quedan pegadas al cuerpo aunque el brazo se mueva.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var clamp = global.clamp;
  var Easing = global.Easing;
  var P = global.P;

  var INK = P.C.INK, YEL = P.C.YEL, RED = P.C.RED, GRN = P.C.GRN, GRY = P.C.GRY;
  var BLANCO = '#ffffff';
  var GRAD = Math.PI / 180;

  /* ---------------- geometria ---------------- */

  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpP(p, q, t) { return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)]; }
  function suma(p, v) { return [p[0] + v[0], p[1] + v[1]]; }
  function resta(p, q) { return [p[0] - q[0], p[1] - q[1]]; }
  function por(v, k) { return [v[0] * k, v[1] * k]; }
  function largo(v) { return Math.sqrt(v[0] * v[0] + v[1] * v[1]); }
  function unidad(v) { var l = largo(v) || 1; return [v[0] / l, v[1] / l]; }
  function polar(ang, l) { return [Math.cos(ang * GRAD) * l, Math.sin(ang * GRAD) * l]; }
  function pt(p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }
  function suave01(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }

  // segmento de miembro: capsula que se afina de ra (en a) a rb (en b)
  function capsula(a, b, ra, rb) {
    var d = resta(b, a);
    if (largo(d) < 1) {
      return 'M ' + pt([a[0] + ra, a[1]]) + ' A ' + ra + ' ' + ra + ' 0 1 0 ' +
        pt([a[0] - ra, a[1]]) + ' A ' + ra + ' ' + ra + ' 0 1 0 ' + pt([a[0] + ra, a[1]]) + ' Z';
    }
    var u = unidad(d);
    var n = [-u[1], u[0]];
    return 'M ' + pt(suma(a, por(n, ra))) +
      ' L ' + pt(suma(b, por(n, rb))) +
      ' A ' + rb + ' ' + rb + ' 0 0 0 ' + pt(suma(b, por(n, -rb))) +
      ' L ' + pt(suma(a, por(n, -ra))) +
      ' A ' + ra + ' ' + ra + ' 0 0 0 ' + pt(suma(a, por(n, ra))) + ' Z';
  }

  // poligono cerrado de esquinas redondeadas; k = cuanto de cada lado se curva
  function blando(pts, k) {
    if (k == null) k = 0.3;
    var n = pts.length;
    var d = '';
    for (var i = 0; i < n; i++) {
      var v = pts[i], ant = pts[(i + n - 1) % n], sig = pts[(i + 1) % n];
      var a = lerpP(v, ant, k), b = lerpP(v, sig, k);
      d += (i === 0 ? 'M ' : ' L ') + pt(a) + ' Q ' + pt(v) + ' ' + pt(b);
    }
    return d + ' Z';
  }

  // linea abierta suave que pasa por los extremos
  function curva(pts) {
    if (pts.length < 3) return 'M ' + pt(pts[0]) + ' L ' + pt(pts[pts.length - 1]);
    var d = 'M ' + pt(pts[0]);
    for (var i = 1; i < pts.length - 1; i++) {
      var fin = i === pts.length - 2 ? pts[i + 1] : lerpP(pts[i], pts[i + 1], 0.5);
      d += ' Q ' + pt(pts[i]) + ' ' + pt(fin);
    }
    return d;
  }

  // silueta simetrica: media silueta izquierda + su espejo en x
  function simetrica(W, ini, segs) {
    var m = function (p) { return [W - p[0], p[1]]; };
    var pts = [ini].concat(segs.map(function (s) { return s[2]; }));
    var d = 'M ' + pt(ini);
    segs.forEach(function (s) { d += ' C ' + pt(s[0]) + ' ' + pt(s[1]) + ' ' + pt(s[2]); });
    d += ' L ' + pt(m(pts[pts.length - 1]));
    for (var i = segs.length - 1; i >= 0; i--) {
      d += ' C ' + pt(m(segs[i][1])) + ' ' + pt(m(segs[i][0])) + ' ' + pt(m(pts[i]));
    }
    return d + ' Z';
  }

  var idSerie = 0;
  function useIdLocal(pref) {
    var ref = React.useRef(null);
    if (ref.current == null) { idSerie += 1; ref.current = pref + idSerie; }
    return ref.current;
  }

  // relleno de musculo: blanco de base + color encima segun cuanto se activa
  function tinte(v, color) {
    return v > 0.01 ? { fill: color, opacity: clamp(v, 0, 1) } : null;
  }

  /* ---------------- overlays SVG (van dentro de children) ---------------- */

  // flecha recta; p 0..1 la dibuja desde a hacia b
  function FlechaS(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.03) return null;
    var a = props.a, b = lerpP(props.a, props.b, p);
    var color = props.color || INK;
    var sw = props.sw || 16;
    var u = unidad(resta(b, a));
    var n = [-u[1], u[0]];
    var cab = props.cabeza || 34;
    var base = suma(b, por(u, -cab));
    var cuerpoFin = suma(b, por(u, -cab * 0.6));
    return (
      <g opacity={props.opacity}>
        <path d={'M ' + pt(a) + ' L ' + pt(cuerpoFin)} stroke={color} strokeWidth={sw}
          strokeLinecap="round" fill="none" />
        <polygon
          points={pt(b) + ' ' + pt(suma(base, por(n, cab * 0.62))) + ' ' +
            pt(suma(base, por(n, -cab * 0.62)))}
          fill={color} stroke={color} strokeWidth={sw * 0.6} strokeLinejoin="round" />
      </g>
    );
  }

  // arco con punta: giros y rotaciones. a0 -> a1 en grados, p lo dibuja
  function Arco(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.03) return null;
    var c = props.c, r = props.r;
    var a0 = props.a0, a1 = lerp(props.a0, props.a1, p);
    var color = props.color || INK;
    var sw = props.sw || 16;
    var signo = a1 >= a0 ? 1 : -1;
    var cab = props.cabeza || 34;
    // el cuerpo del arco termina antes que la punta
    var recorte = (cab * 0.6 / r) / GRAD * signo;
    var aFin = Math.abs(a1 - a0) > Math.abs(recorte) ? a1 - recorte : a0;
    var ini = suma(c, polar(a0, r));
    var fin = suma(c, polar(aFin, r));
    var grande = Math.abs(aFin - a0) > 180 ? 1 : 0;
    var barrido = signo > 0 ? 1 : 0;
    var punta = suma(c, polar(a1, r));
    var tang = unidad(polar(a1 + 90 * signo, 1));
    var n = [-tang[1], tang[0]];
    var base = suma(punta, por(tang, -cab));
    return (
      <g opacity={props.opacity}>
        <path d={'M ' + pt(ini) + ' A ' + r + ' ' + r + ' 0 ' + grande + ' ' + barrido + ' ' + pt(fin)}
          stroke={color} strokeWidth={sw} strokeLinecap="round" fill="none" />
        <polygon
          points={pt(suma(punta, por(tang, cab * 0.15))) + ' ' +
            pt(suma(base, por(n, cab * 0.62))) + ' ' + pt(suma(base, por(n, -cab * 0.62)))}
          fill={color} stroke={color} strokeWidth={sw * 0.6} strokeLinejoin="round" />
      </g>
    );
  }

  // linea de puntos (guias, trayectorias); p 0..1 la dibuja
  function Puntos(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.02) return null;
    var pts = props.pts;
    // recortar la polilinea al largo p
    var tramos = [], total = 0;
    for (var i = 1; i < pts.length; i++) {
      var l = largo(resta(pts[i], pts[i - 1]));
      tramos.push(l); total += l;
    }
    var resto = total * p, vis = [pts[0]];
    for (var j = 1; j < pts.length && resto > 0; j++) {
      if (tramos[j - 1] <= resto) { vis.push(pts[j]); resto -= tramos[j - 1]; }
      else { vis.push(lerpP(pts[j - 1], pts[j], resto / tramos[j - 1])); resto = 0; }
    }
    var sw = props.sw || 13;
    return (
      <path d={'M ' + vis.map(pt).join(' L ')} fill="none" stroke={props.color || INK}
        strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={'0.1 ' + (props.hueco || sw * 2.3)} opacity={props.opacity} />
    );
  }

  // anillo marcador alrededor de una articulacion
  function Anillo(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.02) return null;
    return (
      <circle cx={props.c[0]} cy={props.c[1]} r={(props.r || 46) * (0.6 + 0.4 * p)}
        fill="none" stroke={props.color || YEL} strokeWidth={props.sw || 14}
        opacity={p} />
    );
  }

  /* =========================================================
     B.Espalda — vista posterior, de la cintura para arriba
     codo 0..1  brazos adelante (inicio)  ->  codos altos y abiertos (final)
     rot  0..1  sin rotacion externa (manos adelante) -> manos junto a la cabeza
     enc  0..1  hombros encogidos hacia las orejas
     ret  0..1  escapulas juntas (retraccion)
     musc { dp, inf, rm, tra, rom, trapRojo }  0..1 cuanto se pinta cada musculo
     piernas    alarga el pantalon hacia abajo para que salga del lienzo
     ========================================================= */

  var EW = 1100, EH = 1000;

  function geoEspalda(o) {
    var codo = clamp(o.codo || 0, 0, 1);
    var rot = clamp(o.rot || 0, 0, 1);
    var enc = clamp(o.enc || 0, 0, 1);
    var ret = clamp(o.ret || 0, 0, 1);
    var gx = 22 * ret, gy = -40 * enc;
    var c = function (x, y) { return [x + gx, y + gy]; };

    var J = c(352, 392);                      // articulacion del hombro
    var EA = c(322, 418), HA = c(430, 430);   // inicio: brazos hacia la polea (tapados)
    var EB = c(175, 372);                     // final: codo alto y abierto
    // sin rotacion las manos se juntan delante de la cara (quedan tapadas
    // por la cabeza); al rotar el antebrazo sube y las manos salen a los lados
    var ang = lerp(-10, -42, rot);
    var HB = suma(EB, polar(ang, lerp(290, 235, rot)));
    var ce = suave01(codo);
    var E = lerpP(EA, EB, ce);
    var H = lerpP(HA, HB, codo);
    // el deltoides cae hacia afuera con el brazo adelante y sigue al codo al abrir
    var dirDelt = lerpP(suma(J, [-50, 130]), E, ce);

    var izq = {
      J: J, E: E, H: H, A: c(368, 352), dirDelt: dirDelt,
      espinaMed: c(488, 430), espinaLat: c(392, 392),
      angSup: c(484, 398), angInf: [496 + gx * 1.1, 602 + gy * 0.9],
      bordeLat: c(406, 454), bordeMed: c(448, 542)
    };
    var m = function (p) { return [EW - p[0], p[1]]; };
    var der = {};
    Object.keys(izq).forEach(function (k) { der[k] = m(izq[k]); });

    return {
      izq: izq, der: der, gx: gx, gy: gy, enc: enc, ret: ret, codo: codo, rot: rot,
      cabeza: [550, 205], espejo: m
    };
  }

  function siluetaEspalda(g) {
    var gx = g.gx, gy = g.gy, enc = g.enc;
    var A = g.izq.A;
    return simetrica(EW, [500, 262], [
      [[500, 280], [498, 296 + gy * 0.15], [496, 304 + gy * 0.2]],
      [[468, 318 + gy * 0.9 - 10 * enc], [412, 326 + gy - 18 * enc], A],
      [[348 + gx, 358 + gy], [334 + gx, 378 + gy], [338 + gx, 402 + gy]],
      [[344 + gx, 440 + gy * 0.6], [380, 462 + gy * 0.4], [398, 480 + gy * 0.3]],
      [[392, 520], [370, 548], [372, 592]],
      [[376, 690], [420, 770], [432, 842]]
    ]);
  }

  function deltoide(J, E, lp) {
    if (lp == null) lp = 128;
    var u = unidad(resta(E, J));
    var n = [-u[1], u[0]];
    var p1 = suma(J, suma(por(n, 58), por(u, -12)));
    var p2 = suma(J, suma(por(n, -58), por(u, -12)));
    var punta = suma(J, por(u, lp));
    var c2 = suma(J, suma(por(n, -56), por(u, lp * 0.58)));
    var c1 = suma(J, suma(por(n, 56), por(u, lp * 0.58)));
    return {
      d: 'M ' + pt(p1) + ' A 60 60 0 0 1 ' + pt(p2) + ' Q ' + pt(c2) + ' ' + pt(punta) +
        ' Q ' + pt(c1) + ' ' + pt(p1) + ' Z',
      fibra: 'M ' + pt(suma(J, por(u, -26))) + ' Q ' + pt(suma(J, suma(por(u, lp * 0.28), por(n, 8)))) +
        ' ' + pt(suma(J, por(u, lp * 0.75)))
    };
  }

  // musculos de un lado (el izquierdo; el derecho se dibuja espejado)
  function MusculosLado(props) {
    var L = props.L, g = props.g, mu = props.mu;
    var gy = g.gy;
    var bajoTrap = [550, 500 + gy * 0.3];
    var trap = [[550, 150], [300, 150], [300 + g.gx, 345 + gy], L.espinaLat, L.espinaMed, bajoTrap];
    var rom = [[550, 360 + gy * 0.5], L.angSup, L.espinaMed, L.angInf, [550, 612 + gy * 0.5]];
    var infra = [L.espinaMed, L.angInf, L.bordeMed, L.bordeLat, L.espinaLat];
    var red = [L.bordeMed, suma(L.bordeMed, [24, 40]), suma(L.J, [8, 70]), suma(L.J, [-12, 34])];
    var linea = { fill: 'none', stroke: INK, strokeWidth: 11, strokeLinecap: 'round', strokeLinejoin: 'round' };
    var fibra = { fill: 'none', stroke: GRY, strokeWidth: 11, strokeLinecap: 'round' };
    var tRom = tinte(mu.rom, GRY);
    var tTra = mu.trapRojo > 0.01 ? tinte(mu.trapRojo, RED) : tinte(mu.tra, GRY);
    var tInf = tinte(mu.inf, YEL);
    var tRed = tinte(mu.rm, YEL);
    return (
      <g>
        {/* romboides: entre la escapula y la columna */}
        <path d={'M ' + rom.map(pt).join(' L ') + ' Z'} fill={BLANCO} stroke="none" />
        {tRom ? <path d={'M ' + rom.map(pt).join(' L ') + ' Z'} fill={tRom.fill} opacity={tRom.opacity} /> : null}
        <path d={'M ' + pt([550, 452 + gy * 0.4]) + ' L ' + pt(suma(L.angSup, [8, 96]))} {...fibra} />
        <path d={'M ' + pt([550, 520 + gy * 0.4]) + ' L ' + pt(suma(L.angInf, [-4, -40]))} {...fibra} />
        <path d={'M ' + pt(L.angInf) + ' L ' + pt([550, 612 + gy * 0.5])} {...linea} />

        {/* trapecio: del cuello al acromion y hacia la columna */}
        <path d={'M ' + trap.map(pt).join(' L ') + ' Z'} fill={BLANCO} stroke="none" />
        {tTra ? <path d={'M ' + trap.map(pt).join(' L ') + ' Z'} fill={tTra.fill} opacity={tTra.opacity} /> : null}
        <path d={curva([L.espinaLat, lerpP(L.espinaLat, L.espinaMed, 0.55), L.espinaMed, bajoTrap])} {...linea} />

        {/* infraespinoso: el cuerpo de la escapula, bajo la espina */}
        <path d={blando(infra)} fill={BLANCO} stroke="none" />
        {tInf ? <path d={blando(infra)} fill={tInf.fill} opacity={tInf.opacity} /> : null}
        <path d={'M ' + pt(suma(L.bordeLat, [22, 14])) + ' L ' + pt(suma(L.angInf, [-14, -50]))} {...fibra} />
        <path d={'M ' + pt(suma(L.bordeLat, [30, 6])) + ' L ' + pt(suma(L.espinaMed, [-6, 40]))} {...fibra} />
        <path d={blando(infra)} {...linea} />

        {/* redondo menor: del borde lateral al humero */}
        <path d={blando(red)} fill={BLANCO} stroke="none" />
        {tRed ? <path d={blando(red)} fill={tRed.fill} opacity={tRed.opacity} /> : null}
        <path d={blando(red)} {...linea} />
      </g>
    );
  }

  function BrazoAtras(props) {
    var L = props.L, paso = props.paso;
    if (paso === 'trazo') {
      return (
        <g fill={BLANCO} stroke={INK} strokeWidth={30} strokeLinejoin="round">
          <path d={capsula(L.J, L.E, 52, 41)} />
          <path d={capsula(L.E, L.H, 39, 31)} />
          <circle cx={L.H[0]} cy={L.H[1]} r={38} />
        </g>
      );
    }
    return (
      <g fill={BLANCO} stroke="none">
        <path d={capsula(L.J, L.E, 52, 41)} />
        <path d={capsula(L.E, L.H, 39, 31)} />
        <circle cx={L.H[0]} cy={L.H[1]} r={38} />
      </g>
    );
  }

  function Espalda(props) {
    var s = props.s == null ? 1 : props.s;
    var g = geoEspalda(props);
    var mu = props.musc || {};
    var id = useIdLocal('esp');
    var sil = siluetaEspalda(g);
    var espejo = 'translate(' + EW + ',0) scale(-1,1)';
    var L = g.izq, R = g.der;
    var dL = deltoide(L.J, L.dirDelt), dR = deltoide(R.J, R.dirDelt);
    var tDp = tinte(mu.dp, YEL);
    var bajo = props.piernas ? 1560 : EH;

    // cuerda: de mano a mano, pasa por delante de la cara (detras de la cabeza)
    var medioCuerda = [550, Math.max(L.H[1], R.H[1]) + 56];
    var cuerda = 'M ' + pt(L.H) + ' Q ' + pt(medioCuerda) + ' ' + pt(R.H);

    var hijos = typeof props.children === 'function' ? props.children(g) : props.children;

    return (
      <svg width={EW * s} height={EH * s} viewBox={'0 0 ' + EW + ' ' + EH}
        style={Object.assign({ display: 'block', overflow: 'visible' }, props.style || {})}>
        <defs>
          <clipPath id={id}><path d={sil} /></clipPath>
        </defs>

        <path d={cuerda} fill="none" stroke={INK} strokeWidth={30} strokeLinecap="round" />
        <path d={cuerda} fill="none" stroke={GRY} strokeWidth={8} strokeLinecap="round" />

        {/* brazos detras del torso: primero el contorno, despues el relleno */}
        <BrazoAtras L={L} paso="trazo" />
        <g transform={espejo}><BrazoAtras L={L} paso="trazo" /></g>
        <BrazoAtras L={L} paso="relleno" />
        <g transform={espejo}><BrazoAtras L={L} paso="relleno" /></g>

        {/* pantalon */}
        <path d={'M 426 830 L 414 ' + bajo + ' L 686 ' + bajo + ' L 674 830 Z'} fill={GRY} stroke="none" />
        <path d={'M 426 830 L 414 ' + bajo + ' M 674 830 L 686 ' + bajo} stroke={INK} strokeWidth={15}
          strokeLinecap="round" fill="none" />

        {/* torso */}
        <path d={sil} fill={BLANCO} stroke="none" />
        <g clipPath={'url(#' + id + ')'}>
          <MusculosLado L={L} g={g} mu={mu} />
          <g transform={espejo}><MusculosLado L={L} g={g} mu={mu} /></g>
          <path d="M 550 300 L 550 830" stroke={INK} strokeWidth={11} strokeLinecap="round" />
        </g>
        <path d={sil} fill="none" stroke={INK} strokeWidth={15} strokeLinejoin="round" />
        <rect x={420} y={818} width={260} height={40} rx={14} fill={GRY} stroke={INK} strokeWidth={13} />

        {/* deltoides: tapan la union del brazo con el torso */}
        {[dL, dR].map(function (d, i) {
          return (
            <g key={'d' + i}>
              <path d={d.d} fill={BLANCO} stroke="none" />
              {tDp ? <path d={d.d} fill={tDp.fill} opacity={tDp.opacity} /> : null}
              <path d={d.fibra} fill="none" stroke={GRY} strokeWidth={11} strokeLinecap="round" />
              <path d={d.d} fill="none" stroke={INK} strokeWidth={13} strokeLinejoin="round" />
            </g>
          );
        })}

        {/* cabeza de espaldas */}
        <ellipse cx={468} cy={222} rx={18} ry={30} fill={BLANCO} stroke={INK} strokeWidth={12} />
        <ellipse cx={632} cy={222} rx={18} ry={30} fill={BLANCO} stroke={INK} strokeWidth={12} />
        <ellipse cx={550} cy={205} rx={80} ry={92} fill={BLANCO} stroke={INK} strokeWidth={15} />

        {hijos}
      </svg>
    );
  }

  /* =========================================================
     B.Estacion — vista lateral: polea a la izquierda, persona mirando a la polea
     p      0..1  brazos estirados -> cuerda en la cara
     rot    0..1  antebrazo adelante -> antebrazo arriba (rotacion externa)
     paso   0..1  pegado a la maquina -> un paso atras (cable tenso)
     tension 0..1 cable flojo (gris, colgando) -> tenso
     poleaY       altura de la polea en el viewBox (B.PECHO_Y = altura del pecho)
     carga  0..1  cuanto sube la pila de discos (por defecto sigue a p)
     cable  'yel' resalta el cable en amarillo
     suelta       brazos abajo y la cuerda colgando de la polea (antes de agarrarla)
     musc { dp }  deltoides posterior
     ========================================================= */

  var SW = 1300, SH = 1300, PISO = 1268, PECHO_Y = 405;

  function rodilla(cadera, tobillo, l1, l2) {
    var d = resta(tobillo, cadera);
    var dist = Math.min(largo(d), l1 + l2 - 0.5);
    var u = unidad(d);
    var a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
    var h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    var n = [u[1], -u[0]];          // la rodilla se dobla hacia adelante (izquierda)
    if (n[0] > 0) n = por(n, -1);
    return suma(suma(cadera, por(u, a)), por(n, h));
  }

  function geoEstacion(o) {
    var p = clamp(o.p || 0, 0, 1);
    var rot = clamp(o.rot == null ? 0 : o.rot, 0, 1);
    var paso = clamp(o.paso == null ? 1 : o.paso, 0, 1);
    var enc = clamp(o.enc || 0, 0, 1);
    var tension = clamp(o.tension == null ? 1 : o.tension, 0, 1);
    var poleaY = o.poleaY == null ? PECHO_Y : o.poleaY;
    var carga = o.carga == null ? tension * (0.1 + 0.9 * p) : clamp(o.carga, 0, 1);

    var X0 = lerp(840, 960, Easing.easeInOutCubic(paso));
    // el pie de atras sale primero y el de adelante lo sigue
    var pa = clamp(paso * 1.6, 0, 1), pd = clamp(paso * 1.6 - 0.6, 0, 1);
    var tobAtras = [lerp(910, 1030, Easing.easeInOutCubic(pa)), 1236 - 70 * Math.sin(Math.PI * pa)];
    var tobAdel = [lerp(770, 890, Easing.easeInOutCubic(pd)), 1236 - 50 * Math.sin(Math.PI * pd)];
    var cadera = [X0 + 6, 700];

    var Sj = [X0 + 10, 362 - 28 * enc];
    var E0 = suma(Sj, [-200, 30]), H0 = suma(Sj, [-400, 42]);
    var E1 = suma(Sj, [40, -12]);
    var H1 = suma(E1, polar(lerp(186, 228, rot), lerp(175, 180, rot)));
    var E = lerpP(E0, E1, Easing.easeInOutCubic(p));
    var H = lerpP(H0, H1, p);
    var lejos = [16, -12];
    if (o.suelta) {
      E = suma(Sj, [-14, 236]);
      H = suma(Sj, [-40, 448]);
      lejos = [20, -6];
    }

    var rueda = [262, poleaY];
    var salida = [288, poleaY];
    var K = o.suelta ? suma(salida, [30, 8]) : suma(H, por(unidad(resta(salida, H)), 84));

    return {
      p: p, rot: rot, paso: paso, enc: enc, tension: tension, poleaY: poleaY, carga: carga,
      X0: X0, cadera: cadera, tobAtras: tobAtras, tobAdel: tobAdel,
      rodAtras: rodilla(cadera, tobAtras, 272, 272), rodAdel: rodilla(cadera, tobAdel, 272, 272),
      Sj: Sj, E: E, H: H, Ef: suma(E, lejos), Hf: suma(H, lejos), Sf: suma(Sj, lejos),
      rueda: rueda, salida: salida, K: K, suelta: !!o.suelta,
      cabeza: [X0, 188], pecho: [X0 - 112, PECHO_Y]
    };
  }

  function Maquina(props) {
    var g = props.g;
    var sube = 120 * g.carga;
    var discos = [];
    for (var i = 0; i < 8; i++) {
      var y = 1206 - i * 34;
      var arriba = i >= 5;   // los tres de arriba van enganchados
      discos.push(
        <rect key={'d' + i} x={98} y={y - (arriba ? sube : 0)} width={84} height={28} rx={6}
          fill={arriba ? GRY : BLANCO} stroke={INK} strokeWidth={11} />
      );
    }
    var topeY = 1206 - 8 * 34 - sube;
    var py = g.poleaY;
    return (
      <g strokeLinejoin="round" strokeLinecap="round">
        <path d="M 116 104 L 116 1240 M 164 104 L 164 1240" stroke={GRY} strokeWidth={11} />
        <path d={'M 140 100 L 140 ' + (topeY + 6)} stroke={INK} strokeWidth={11} />
        {discos}
        <rect x={104} y={topeY} width={72} height={28} rx={8} fill={BLANCO} stroke={INK} strokeWidth={11} />
        <rect x={40} y={70} width={44} height={1190} rx={10} fill={BLANCO} stroke={INK} strokeWidth={15} />
        <rect x={196} y={70} width={44} height={1190} rx={10} fill={BLANCO} stroke={INK} strokeWidth={15} />
        <rect x={28} y={46} width={226} height={50} rx={12} fill={BLANCO} stroke={INK} strokeWidth={15} />
        <rect x={20} y={1238} width={244} height={34} rx={10} fill={BLANCO} stroke={INK} strokeWidth={15} />
        {/* carro de la polea */}
        <rect x={182} y={py - 50} width={72} height={100} rx={14} fill={BLANCO} stroke={INK} strokeWidth={15} />
        <circle cx={g.rueda[0]} cy={g.rueda[1]} r={28} fill={BLANCO} stroke={INK} strokeWidth={13} />
        <circle cx={g.rueda[0]} cy={g.rueda[1]} r={7} fill={INK} />
      </g>
    );
  }

  // manga del short: trapecio con ruedo recto, perpendicular al muslo
  function manga(cad, rod, frac, ra, rb) {
    var u = unidad(resta(rod, cad));
    var n = [-u[1], u[0]];
    var ruedo = lerpP(cad, rod, frac);
    var arriba = suma(cad, por(u, -30));
    return 'M ' + [suma(arriba, por(n, ra)), suma(ruedo, por(n, rb)), suma(ruedo, por(n, -rb)),
      suma(arriba, por(n, -ra))].map(pt).join(' L ') + ' Z';
  }

  function Pierna(props) {
    var cad = props.cadera, rod = props.rodilla, tob = props.tobillo;
    var zap = blando([[tob[0] + 34, tob[1] + 32], [tob[0] - 112, tob[1] + 32], [tob[0] - 104, tob[1] - 6],
      [tob[0] - 34, tob[1] - 22], [tob[0] + 30, tob[1] - 30]], 0.35);
    return (
      <g>
        <g fill={BLANCO} stroke={INK} strokeWidth={30} strokeLinejoin="round">
          <path d={capsula(cad, rod, 66, 46)} />
          <path d={capsula(rod, tob, 46, 30)} />
        </g>
        <g fill={BLANCO} stroke="none">
          <path d={capsula(cad, rod, 66, 46)} />
          <path d={capsula(rod, tob, 46, 30)} />
        </g>
        <path d={zap} fill={BLANCO} stroke={INK} strokeWidth={14} strokeLinejoin="round" />
      </g>
    );
  }

  function BrazoLado(props) {
    var S = props.S, E = props.E, H = props.H;
    return (
      <g>
        <g fill={BLANCO} stroke={INK} strokeWidth={30} strokeLinejoin="round">
          <path d={capsula(S, E, 50, 40)} />
          <path d={capsula(E, H, 38, 30)} />
          <circle cx={H[0]} cy={H[1]} r={36} />
        </g>
        <g fill={BLANCO} stroke="none">
          <path d={capsula(S, E, 50, 40)} />
          <path d={capsula(E, H, 38, 30)} />
          <circle cx={H[0]} cy={H[1]} r={36} />
        </g>
      </g>
    );
  }

  function Estacion(props) {
    var s = props.s == null ? 1 : props.s;
    var g = geoEstacion(props);
    var mu = props.musc || {};
    var X0 = g.X0, enc = g.enc;

    var torso = 'M ' + pt([X0 - 30, 236]) +
      ' L ' + pt([X0 - 36, 300]) +
      ' C ' + pt([X0 - 70, 316]) + ' ' + pt([X0 - 112, 340]) + ' ' + pt([X0 - 112, 396]) +
      ' C ' + pt([X0 - 112, 444]) + ' ' + pt([X0 - 92, 472]) + ' ' + pt([X0 - 74, 492]) +
      ' C ' + pt([X0 - 62, 548]) + ' ' + pt([X0 - 56, 606]) + ' ' + pt([X0 - 58, 704]) +
      ' L ' + pt([X0 + 78, 704]) +
      ' C ' + pt([X0 + 58, 640]) + ' ' + pt([X0 + 44, 600]) + ' ' + pt([X0 + 50, 540]) +
      ' C ' + pt([X0 + 60, 470]) + ' ' + pt([X0 + 94, 432]) + ' ' + pt([X0 + 88, 372]) +
      ' C ' + pt([X0 + 82, 330 - 22 * enc]) + ' ' + pt([X0 + 52, 300 - 26 * enc]) + ' ' +
      pt([X0 + 30, 262 - 10 * enc]) +
      ' L ' + pt([X0 + 28, 236]) + ' Z';

    // de perfil, con el codo apuntando a camara el deltoides se ve como una gorra redonda
    var dl = deltoide(g.Sj, g.E, clamp(largo(resta(g.E, g.Sj)) * 0.62, 58, 128));
    var tDp = tinte(mu.dp, YEL);

    // cable: de la rueda al mosqueton; cuelga cuando no hay tension
    var medio = lerpP(g.salida, g.K, 0.5);
    var comba = (1 - g.tension) * 170;
    var cable = 'M ' + pt(g.salida) + ' Q ' + pt(suma(medio, [0, comba * 2])) + ' ' + pt(g.K);
    var flojo = g.tension < 0.97 && !g.suelta;
    if (g.suelta) cable = 'M ' + pt(g.salida) + ' L ' + pt(g.K);
    // suelta: las dos puntas de la cuerda cuelgan del mosqueton
    var puntas = g.suelta ? [suma(g.K, [-10, 150]), suma(g.K, [16, 144])] : null;
    var cuerda = puntas
      ? 'M ' + pt(puntas[0]) + ' L ' + pt(g.K) + ' L ' + pt(puntas[1])
      : 'M ' + pt(g.H) + ' L ' + pt(g.K) + ' L ' + pt(g.Hf);

    var hijos = typeof props.children === 'function' ? props.children(g) : props.children;
    var sinMaquina = props.sinMaquina;

    return (
      <svg width={SW * s} height={SH * s} viewBox={'0 0 ' + SW + ' ' + SH}
        style={Object.assign({ display: 'block', overflow: 'visible' }, props.style || {})}>
        <path d={'M 0 ' + (PISO + 4) + ' L ' + SW + ' ' + (PISO + 4)} stroke={GRY} strokeWidth={11}
          strokeLinecap="round" />
        {sinMaquina ? null : <Maquina g={g} />}

        {/* cable */}
        {props.cable === 'yel' && !flojo ? (
          <path d={cable} fill="none" stroke={INK} strokeWidth={33} strokeLinecap="round" />
        ) : null}
        <path d={cable} fill="none"
          stroke={flojo ? GRY : props.cable === 'yel' ? YEL : INK}
          strokeWidth={11} strokeLinecap="round" />

        {/* brazo lejano, detras del cuerpo */}
        <BrazoLado S={g.Sf} E={g.Ef} H={g.Hf} />

        <Pierna cadera={g.cadera} rodilla={g.rodAtras} tobillo={g.tobAtras} />
        <Pierna cadera={g.cadera} rodilla={g.rodAdel} tobillo={g.tobAdel} />
        {/* short: cadera + las dos mangas, como una sola silueta */}
        {['trazo', 'relleno'].map(function (paso) {
          var t = paso === 'trazo';
          return (
            <g key={paso} fill={GRY} stroke={t ? INK : 'none'} strokeWidth={t ? 28 : 0} strokeLinejoin="round">
              <rect x={X0 - 62} y={640} width={146} height={104} rx={30} />
              <path d={manga(g.cadera, g.rodAtras, 0.62, 66, 58)} />
              <path d={manga(g.cadera, g.rodAdel, 0.62, 66, 58)} />
            </g>
          );
        })}

        <path d={torso} fill={BLANCO} stroke={INK} strokeWidth={15} strokeLinejoin="round" />
        <rect x={X0 - 66} y={622} width={148} height={34} rx={12} fill={GRY} stroke={INK} strokeWidth={13}
          transform={'rotate(-3 ' + X0 + ' 640)'} />

        {/* cabeza de perfil */}
        <path d={'M ' + pt([X0 + 2, 108]) +
          ' C ' + pt([X0 + 48, 106]) + ' ' + pt([X0 + 72, 142]) + ' ' + pt([X0 + 70, 184]) +
          ' C ' + pt([X0 + 68, 222]) + ' ' + pt([X0 + 50, 246]) + ' ' + pt([X0 + 30, 258]) +
          ' C ' + pt([X0 + 6, 268]) + ' ' + pt([X0 - 30, 268]) + ' ' + pt([X0 - 48, 256]) +
          ' C ' + pt([X0 - 60, 248]) + ' ' + pt([X0 - 62, 236]) + ' ' + pt([X0 - 60, 226]) +
          ' L ' + pt([X0 - 88, 206]) + ' L ' + pt([X0 - 64, 182]) +
          ' C ' + pt([X0 - 72, 150]) + ' ' + pt([X0 - 50, 110]) + ' ' + pt([X0 + 2, 108]) + ' Z'}
          fill={BLANCO} stroke={INK} strokeWidth={15} strokeLinejoin="round" />
        <circle cx={X0 - 38} cy={174} r={8} fill={INK} />
        <path d={'M ' + pt([X0 + 18, 178]) + ' Q ' + pt([X0 + 42, 180]) + ' ' + pt([X0 + 38, 198]) +
          ' Q ' + pt([X0 + 36, 214]) + ' ' + pt([X0 + 20, 212])}
          fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />

        {/* cuerda: de las manos al mosqueton */}
        <path d={cuerda} fill="none" stroke={INK} strokeWidth={28} strokeLinecap="round" strokeLinejoin="round" />
        <path d={cuerda} fill="none" stroke={GRY} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={g.K[0]} cy={g.K[1]} r={13} fill={BLANCO} stroke={INK} strokeWidth={11} />
        {puntas ? puntas.map(function (q, i) {
          return <circle key={'pu' + i} cx={q[0]} cy={q[1]} r={15} fill={INK} />;
        }) : null}

        {/* brazo cercano */}
        <BrazoLado S={g.Sj} E={g.E} H={g.H} />
        <path d={dl.d} fill={BLANCO} stroke="none" />
        {tDp ? <path d={dl.d} fill={tDp.fill} opacity={tDp.opacity} /> : null}
        <path d={dl.fibra} fill="none" stroke={GRY} strokeWidth={11} strokeLinecap="round" />
        <path d={dl.d} fill="none" stroke={INK} strokeWidth={13} strokeLinejoin="round" />

        {hijos}
      </svg>
    );
  }

  /* ---------------- B.Cuenta: anillo que se vacia + numero ---------------- */

  function Cuenta(props) {
    var s = props.s == null ? 1 : props.s;
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    var r = 86, c = 110;
    var circ = 2 * Math.PI * r;
    return (
      <Svg220 s={s} style={props.style}>
        <circle cx={c} cy={c} r={r} fill={BLANCO} stroke={GRY} strokeWidth={16} />
        <circle cx={c} cy={c} r={r} fill="none" stroke={YEL} strokeWidth={16}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - p)}
          transform={'rotate(-90 ' + c + ' ' + c + ')'} strokeLinecap="round" />
        <circle cx={c} cy={c} r={r + 13} fill="none" stroke={INK} strokeWidth={11} />
        <text x={c} y={c + 40} textAnchor="middle" fontFamily="'Archivo Black', sans-serif"
          fontSize={118} fill={INK}>{props.n}</text>
      </Svg220>
    );
  }

  function Svg220(props) {
    var s = props.s;
    return (
      <svg width={220 * s} height={220 * s} viewBox="0 0 220 220"
        style={Object.assign({ display: 'block', overflow: 'visible' }, props.style || {})}>
        {props.children}
      </svg>
    );
  }

  global.B = {
    PECHO_Y: PECHO_Y,
    Estacion: Estacion,
    geoEstacion: geoEstacion,
    Cuenta: Cuenta,
    Espalda: Espalda,
    geoEspalda: geoEspalda,
    util: {
      lerp: lerp, lerpP: lerpP, suma: suma, resta: resta, por: por, largo: largo,
      unidad: unidad, polar: polar, pt: pt, suave01: suave01, capsula: capsula,
      blando: blando, curva: curva, simetrica: simetrica, useIdLocal: useIdLocal,
      tinte: tinte
    },
    FlechaS: FlechaS,
    Arco: Arco,
    Puntos: Puntos,
    Anillo: Anillo
  };
})(window);
