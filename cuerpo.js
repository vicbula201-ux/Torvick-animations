/* GENERADO por compilar.js desde cuerpo.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   CUERPO — window.B: piezas de cuerpo para videos de ejercicios
   Mismo estilo que P: trazo #14110F grueso, relleno blanco,
   puntas redondas, viewBox fijo, prop s de escala.

   B.Espalda   1100x1000  vista posterior: hombros, escapulas, brazos (face pull
                          o colgado de una barra), y cuerpo entero opcional
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
  var INK = P.C.INK,
    YEL = P.C.YEL,
    RED = P.C.RED,
    GRN = P.C.GRN,
    GRY = P.C.GRY;
  var BLANCO = '#ffffff';
  var GRAD = Math.PI / 180;

  /* ---------------- geometria ---------------- */

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function lerpP(p, q, t) {
    return [lerp(p[0], q[0], t), lerp(p[1], q[1], t)];
  }
  function suma(p, v) {
    return [p[0] + v[0], p[1] + v[1]];
  }
  function resta(p, q) {
    return [p[0] - q[0], p[1] - q[1]];
  }
  function por(v, k) {
    return [v[0] * k, v[1] * k];
  }
  function largo(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  }
  function unidad(v) {
    var l = largo(v) || 1;
    return [v[0] / l, v[1] / l];
  }
  function polar(ang, l) {
    return [Math.cos(ang * GRAD) * l, Math.sin(ang * GRAD) * l];
  }
  function pt(p) {
    return p[0].toFixed(1) + ' ' + p[1].toFixed(1);
  }
  function suave01(t) {
    t = clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
  }

  // segmento de miembro: capsula que se afina de ra (en a) a rb (en b)
  function capsula(a, b, ra, rb) {
    var d = resta(b, a);
    if (largo(d) < 1) {
      return 'M ' + pt([a[0] + ra, a[1]]) + ' A ' + ra + ' ' + ra + ' 0 1 0 ' + pt([a[0] - ra, a[1]]) + ' A ' + ra + ' ' + ra + ' 0 1 0 ' + pt([a[0] + ra, a[1]]) + ' Z';
    }
    var u = unidad(d);
    var n = [-u[1], u[0]];
    return 'M ' + pt(suma(a, por(n, ra))) + ' L ' + pt(suma(b, por(n, rb))) + ' A ' + rb + ' ' + rb + ' 0 0 0 ' + pt(suma(b, por(n, -rb))) + ' L ' + pt(suma(a, por(n, -ra))) + ' A ' + ra + ' ' + ra + ' 0 0 0 ' + pt(suma(a, por(n, ra))) + ' Z';
  }

  // poligono cerrado de esquinas redondeadas; k = cuanto de cada lado se curva
  function blando(pts, k) {
    if (k == null) k = 0.3;
    var n = pts.length;
    var d = '';
    for (var i = 0; i < n; i++) {
      var v = pts[i],
        ant = pts[(i + n - 1) % n],
        sig = pts[(i + 1) % n];
      var a = lerpP(v, ant, k),
        b = lerpP(v, sig, k);
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
    var m = function (p) {
      return [W - p[0], p[1]];
    };
    var pts = [ini].concat(segs.map(function (s) {
      return s[2];
    }));
    var d = 'M ' + pt(ini);
    segs.forEach(function (s) {
      d += ' C ' + pt(s[0]) + ' ' + pt(s[1]) + ' ' + pt(s[2]);
    });
    d += ' L ' + pt(m(pts[pts.length - 1]));
    for (var i = segs.length - 1; i >= 0; i--) {
      d += ' C ' + pt(m(segs[i][1])) + ' ' + pt(m(segs[i][0])) + ' ' + pt(m(pts[i]));
    }
    return d + ' Z';
  }
  var idSerie = 0;
  function useIdLocal(pref) {
    var ref = React.useRef(null);
    if (ref.current == null) {
      idSerie += 1;
      ref.current = pref + idSerie;
    }
    return ref.current;
  }

  // relleno de musculo: blanco de base + color encima segun cuanto se activa
  function tinte(v, color) {
    return v > 0.01 ? {
      fill: color,
      opacity: clamp(v, 0, 1)
    } : null;
  }

  /* ---------------- overlays SVG (van dentro de children) ---------------- */

  // flecha recta; p 0..1 la dibuja desde a hacia b
  function FlechaS(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.03) return null;
    var a = props.a,
      b = lerpP(props.a, props.b, p);
    var color = props.color || INK;
    var sw = props.sw || 16;
    var u = unidad(resta(b, a));
    var n = [-u[1], u[0]];
    var cab = props.cabeza || 34;
    var base = suma(b, por(u, -cab));
    var cuerpoFin = suma(b, por(u, -cab * 0.6));
    return /*#__PURE__*/React.createElement("g", {
      opacity: props.opacity
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + pt(a) + ' L ' + pt(cuerpoFin),
      stroke: color,
      strokeWidth: sw,
      strokeLinecap: "round",
      fill: "none"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: pt(b) + ' ' + pt(suma(base, por(n, cab * 0.62))) + ' ' + pt(suma(base, por(n, -cab * 0.62))),
      fill: color,
      stroke: color,
      strokeWidth: sw * 0.6,
      strokeLinejoin: "round"
    }));
  }

  // arco con punta: giros y rotaciones. a0 -> a1 en grados, p lo dibuja
  function Arco(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.03) return null;
    var c = props.c,
      r = props.r;
    var a0 = props.a0,
      a1 = lerp(props.a0, props.a1, p);
    var color = props.color || INK;
    var sw = props.sw || 16;
    var signo = a1 >= a0 ? 1 : -1;
    var cab = props.cabeza || 34;
    // el cuerpo del arco termina antes que la punta
    var recorte = cab * 0.6 / r / GRAD * signo;
    var aFin = Math.abs(a1 - a0) > Math.abs(recorte) ? a1 - recorte : a0;
    var ini = suma(c, polar(a0, r));
    var fin = suma(c, polar(aFin, r));
    var grande = Math.abs(aFin - a0) > 180 ? 1 : 0;
    var barrido = signo > 0 ? 1 : 0;
    var punta = suma(c, polar(a1, r));
    var tang = unidad(polar(a1 + 90 * signo, 1));
    var n = [-tang[1], tang[0]];
    var base = suma(punta, por(tang, -cab));
    return /*#__PURE__*/React.createElement("g", {
      opacity: props.opacity
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + pt(ini) + ' A ' + r + ' ' + r + ' 0 ' + grande + ' ' + barrido + ' ' + pt(fin),
      stroke: color,
      strokeWidth: sw,
      strokeLinecap: "round",
      fill: "none"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: pt(suma(punta, por(tang, cab * 0.15))) + ' ' + pt(suma(base, por(n, cab * 0.62))) + ' ' + pt(suma(base, por(n, -cab * 0.62))),
      fill: color,
      stroke: color,
      strokeWidth: sw * 0.6,
      strokeLinejoin: "round"
    }));
  }

  // linea de puntos (guias, trayectorias); p 0..1 la dibuja
  function Puntos(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.02) return null;
    var pts = props.pts;
    // recortar la polilinea al largo p
    var tramos = [],
      total = 0;
    for (var i = 1; i < pts.length; i++) {
      var l = largo(resta(pts[i], pts[i - 1]));
      tramos.push(l);
      total += l;
    }
    var resto = total * p,
      vis = [pts[0]];
    for (var j = 1; j < pts.length && resto > 0; j++) {
      if (tramos[j - 1] <= resto) {
        vis.push(pts[j]);
        resto -= tramos[j - 1];
      } else {
        vis.push(lerpP(pts[j - 1], pts[j], resto / tramos[j - 1]));
        resto = 0;
      }
    }
    var sw = props.sw || 13;
    return /*#__PURE__*/React.createElement("path", {
      d: 'M ' + vis.map(pt).join(' L '),
      fill: "none",
      stroke: props.color || INK,
      strokeWidth: sw,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      strokeDasharray: '0.1 ' + (props.hueco || sw * 2.3),
      opacity: props.opacity
    });
  }

  // anillo marcador alrededor de una articulacion
  function Anillo(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.02) return null;
    return /*#__PURE__*/React.createElement("circle", {
      cx: props.c[0],
      cy: props.c[1],
      r: (props.r || 46) * (0.6 + 0.4 * p),
      fill: "none",
      stroke: props.color || YEL,
      strokeWidth: props.sw || 14,
      opacity: p
    });
  }

  /* =========================================================
     B.Espalda — vista posterior. viewBox 1100x1000 (el dibujo se sale
     con overflow visible: brazos arriba hasta y ~ -60, piernas hasta ~1620)
      Modo face pull (por defecto, brazos detras del torso):
       codo 0..1  brazos adelante (inicio)  ->  codos altos y abiertos (final)
       rot  0..1  sin rotacion externa (manos adelante) -> manos junto a la cabeza
       enc  0..1  hombros encogidos hacia las orejas
       ret  0..1  escapulas juntas (retraccion)
     Modo dominadas: brazos='arriba' (brazos delante del torso, manos en una barra)
       sube 0..1  colgado con brazos extendidos -> pecho a la altura de la barra
       depr 0..1  escapulas elevadas y abiertas -> deprimidas y juntas
                  (si no se pasa sigue a sube, adelantada: suave01(sube / 0.5))
       agarre     de la columna a cada mano (300: un poco mas ancho que los hombros)
       anclaManos y del viewBox donde quedan las manos: traslada todo el dibujo
       barra      true o { x0, x1 }: barra a la altura de las manos, detras del cuerpo
     Comunes:
       musc { dp, inf, rm, rM, dor, tra, rom, trapRojo } 0..1 (numero o [izq, der])
         dp inf rm rM dor -> amarillo; tra rom -> gris; trapRojo -> trapecio rojo
       muscAmarillo / muscGris / muscRojo { clave: 0..1 } fuerzan el color
       piernas       pantalon largo que sale por abajo del lienzo
       cuerpoEntero  (o piernas='enteras') short gris + piernas de espaldas
       rodillas 0..1 piernas rectas -> rodillas dobladas con tobillos cruzados
                     (para poses quietas usar 0 o 1; en el medio se cruzan)
     children(g): g en coordenadas del viewBox, ya trasladadas por anclaManos
       g.izq / g.der  J hombro, E codo, H mano, A acromion, angSup angInf espinaMed
                      espinaLat bordeLat bordeMed (escapula), rMC y dorC (centros
                      del redondo mayor y del dorsal), X axila (solo brazos arriba),
                      cad rod tob (solo cuerpo entero)
       g.cabeza g.cintura  g.manoY = g.barraY  g.dy (traslado de anclaManos)
       g.piso (borde de abajo de las zapatillas)  g.sube g.depr g.el (elevacion)
     Manos fijas en la barra mientras el cuerpo sube: pasar siempre el mismo
     anclaManos; B.geoEspalda(props) devuelve la misma g sin dibujar.
     ========================================================= */

  var EW = 1100,
    EH = 1000;
  var BRAZO_ARR = 200,
    ANTE_ARR = 210; // brazo y antebrazo con los brazos arriba
  var AGARRE = 300; // de la columna a cada mano sobre la barra
  var COLOR_MUSC = {
    dp: YEL,
    inf: YEL,
    rm: YEL,
    rM: YEL,
    dor: YEL,
    tra: GRY,
    rom: GRY
  };
  function rotar(v, ang) {
    var co = Math.cos(ang * GRAD),
      si = Math.sin(ang * GRAD);
    return [v[0] * co - v[1] * si, v[0] * si + v[1] * co];
  }

  // codo por cinematica inversa (lado izquierdo de la imagen): se abre hacia afuera
  function codoIK(J, H, l1, l2) {
    var d = resta(H, J);
    var dist = clamp(largo(d), Math.abs(l1 - l2) + 1, l1 + l2 - 0.5);
    var u = unidad(d);
    var a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
    var h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    return suma(suma(J, por(u, a)), por([u[1], -u[0]], h));
  }

  // elevacion del brazo izquierdo en grados: 0 colgando, 90 horizontal, 180 arriba
  function elevacion(J, E) {
    var v = resta(E, J);
    return Math.atan2(-v[0], v[1]) / GRAD;
  }

  // piernas de espaldas: k = rodillas (0 rectas, 1 dobladas con los tobillos cruzados)
  // los tobillos se cruzan recien con las rodillas bien dobladas
  function cruce(k) {
    return suave01((k - 0.4) / 0.6);
  }
  function geoPiernas(k) {
    var kx = cruce(k);
    return {
      izq: {
        cad: [488, 912],
        rod: [lerp(494, 516, k), lerp(1238, 1196, k)],
        tob: [lerp(498, 580, kx), lerp(1546, 1352, k)]
      },
      der: {
        cad: [612, 912],
        rod: [lerp(606, 586, k), lerp(1238, 1204, k)],
        tob: [lerp(602, 518, kx), lerp(1546, 1372, k)]
      }
    };
  }
  function geoBase(o) {
    var arriba = o.brazos === 'arriba';
    var codo = clamp(o.codo || 0, 0, 1);
    var rot = clamp(o.rot || 0, 0, 1);
    var enc = clamp(o.enc || 0, 0, 1);
    var ret = clamp(o.ret || 0, 0, 1);
    var sube = clamp(o.sube || 0, 0, 1);
    var depr = o.depr == null ? suave01(sube / 0.5) : clamp(o.depr, 0, 1);
    var gx,
      gy,
      giro = 0;
    if (arriba) {
      // colgado: escapulas arriba, abiertas y giradas hacia arriba; arriba: abajo y juntas
      gx = lerp(-14, 22, depr) + 22 * ret * (1 - depr);
      gy = Math.max(-48, lerp(-40, 10, depr) - 40 * enc);
      giro = lerp(16, 0, depr);
      enc = clamp(-gy / 40, 0, 1);
      ret = clamp(gx / 22, 0, 1);
    } else {
      gx = 22 * ret;
      gy = -40 * enc;
    }
    var c = function (x, y) {
      return [x + gx, y + gy];
    };
    // con brazos arriba la escapula gira (rotacion superior) alrededor de PIV
    var PIV = [440, 480];
    var esc = function (x, y) {
      var q = suma(PIV, rotar(resta([x, y], PIV), giro));
      return c(q[0], q[1]);
    };
    var qInf = suma(PIV, rotar(resta([496, 602], PIV), giro));
    var J = c(352, 392); // articulacion del hombro
    var E,
      H,
      dirDelt,
      el = 0,
      X = null,
      rmA,
      rmB,
      K;
    if (arriba) {
      var Hx = 550 - (o.agarre == null ? AGARRE : o.agarre);
      var dx = Hx - J[0];
      var lleno = 0.985 * (BRAZO_ARR + ANTE_ARR);
      var R0 = Math.sqrt(Math.max(0, lleno * lleno - dx * dx));
      H = [Hx, J[1] - lerp(R0, -10, sube)];
      E = codoIK(J, H, BRAZO_ARR, ANTE_ARR);
      dirDelt = E;
      el = elevacion(J, E);
      // marco del brazo: u a lo largo del humero, n2 hacia el lado del torso/axila
      var u = unidad(resta(E, J)),
        n2 = [u[1], -u[0]];
      var enBrazo = function (a, b) {
        return suma(J, suma(por(u, a), por(n2, b)));
      };
      var fe = clamp(el / 165, 0, 1);
      // axila: donde el borde del dorsal sale de abajo del brazo
      var aX = BRAZO_ARR * lerp(0.62, 0.0, fe);
      X = enBrazo(aX, lerp(52, 41, aX / BRAZO_ARR) - 14);
      // inserciones de los redondos y del dorsal. Con el codo abajo quedan tapadas por
      // el brazo; colgado, el redondo mayor sale por el contorno justo bajo la axila
      // (pliegue posterior de la axila) y el dorsal queda debajo
      var wc = suave01((fe - 0.12) / 0.8);
      rmA = lerpP(enBrazo(-10, -14), suma(J, [20, 30]), wc);
      rmB = lerpP(enBrazo(20, 10), suma(J, [-22, 44]), wc);
      K = lerpP(enBrazo(70, 30), suma(J, [-70, 100]), wc);
    } else {
      var EA = c(322, 418),
        HA = c(430, 430); // inicio: brazos hacia la polea (tapados)
      var EB = c(175, 372); // final: codo alto y abierto
      // sin rotacion las manos se juntan delante de la cara (quedan tapadas
      // por la cabeza); al rotar el antebrazo sube y las manos salen a los lados
      var ang = lerp(-10, -42, rot);
      var HB = suma(EB, polar(ang, lerp(290, 235, rot)));
      var ce = suave01(codo);
      E = lerpP(EA, EB, ce);
      H = lerpP(HA, HB, codo);
      // el deltoides cae hacia afuera con el brazo adelante y sigue al codo al abrir
      dirDelt = lerpP(suma(J, [-50, 130]), E, ce);
      rmA = suma(J, [-12, 34]);
      rmB = suma(J, [8, 70]);
      K = [330 + gx * 0.5, 548 + gy * 0.4];
    }
    var angInf = [qInf[0] + gx * 1.1, qInf[1] + gy * 0.9];
    var bordeMed = esc(448, 542);
    var izq = {
      J: J,
      E: E,
      H: H,
      A: c(368, 352),
      dirDelt: dirDelt,
      espinaMed: esc(488, 430),
      espinaLat: esc(392, 392),
      angSup: esc(484, 398),
      angInf: angInf,
      bordeLat: esc(406, 454),
      bordeMed: bordeMed,
      rmA: rmA,
      rmB: rmB,
      K: K,
      // centros de musculo, para flechas y rotulos
      rMC: lerpP(lerpP(arriba ? bordeMed : suma(bordeMed, [24, 40]), angInf, 0.5), lerpP(rmB, K, 0.5), 0.45),
      dorC: [442 + gx * 0.3, 690]
    };
    if (X) izq.X = X;
    var m = function (p) {
      return [EW - p[0], p[1]];
    };
    var entero = !!(o.cuerpoEntero || o.piernas === 'enteras');
    var rodillas = clamp(o.rodillas || 0, 0, 1);
    if (entero) {
      var pi = geoPiernas(rodillas);
      ['cad', 'rod', 'tob'].forEach(function (k) {
        izq[k] = pi.izq[k];
      });
    }
    var der = {};
    Object.keys(izq).forEach(function (k) {
      der[k] = m(izq[k]);
    });
    if (entero) ['cad', 'rod', 'tob'].forEach(function (k) {
      der[k] = pi.der[k];
    });
    return {
      izq: izq,
      der: der,
      gx: gx,
      gy: gy,
      enc: enc,
      ret: ret,
      codo: codo,
      rot: rot,
      arriba: arriba,
      sube: sube,
      depr: depr,
      giro: giro,
      el: el,
      entero: entero,
      rodillas: rodillas,
      cabeza: [550, 205],
      cintura: [550, 838],
      piso: entero ? Math.max(bajoPie(izq, 1, rodillas), bajoPie(der, -1, rodillas)) : null,
      manoY: H[1],
      barraY: H[1],
      dy: 0,
      espejo: m
    };
  }
  function trasladar(g, dy) {
    if (!dy) return g;
    var t = function (p) {
      return [p[0], p[1] + dy];
    };
    var lado = function (L) {
      var r = {};
      Object.keys(L).forEach(function (k) {
        r[k] = t(L[k]);
      });
      return r;
    };
    var out = Object.assign({}, g, {
      izq: lado(g.izq),
      der: lado(g.der),
      cabeza: t(g.cabeza),
      cintura: t(g.cintura),
      manoY: g.manoY + dy,
      barraY: g.barraY + dy,
      dy: dy
    });
    if (g.piso != null) out.piso = g.piso + dy;
    return out;
  }

  // geometria publica: en coordenadas del viewBox, ya trasladada por anclaManos
  function geoEspalda(o) {
    var g = geoBase(o);
    return trasladar(g, o.anclaManos == null ? 0 : o.anclaManos - g.manoY);
  }
  function siluetaEspalda(g) {
    var gx = g.gx,
      gy = g.gy,
      enc = g.enc;
    var A = g.izq.A;
    var ini = [500, 262];
    var cuello = [[500, 280], [498, 296 + gy * 0.15], [496, 304 + gy * 0.2]];
    var trapecio = [[468, 318 + gy * 0.9 - 10 * enc], [412, 326 + gy - 18 * enc], A];
    if (!g.arriba) {
      return simetrica(EW, ini, [cuello, trapecio, [[348 + gx, 358 + gy], [334 + gx, 378 + gy], [338 + gx, 402 + gy]], [[344 + gx, 440 + gy * 0.6], [380, 462 + gy * 0.4], [398, 480 + gy * 0.3]], [[392, 520], [370, 548], [372, 592]], [[376, 690], [420, 770], [432, 842]]]);
    }
    // brazos arriba: del acromion a la axila por debajo del brazo (tapado),
    // y de ahi el dorsal en V hasta la cintura
    var J = g.izq.J,
      X = g.izq.X;
    var fe = clamp(g.el / 165, 0, 1);
    var Lb = [lerp(344, 362, fe), lerp(652, 600, fe)];
    return simetrica(EW, ini, [cuello, trapecio, [lerpP(A, J, 0.6), lerpP(J, X, 0.6), X], [suma(X, [-4, 70]), suma(Lb, [-2, -80]), Lb], [[Lb[0] + 6, 724], [420, 776], [432, 842]]]);
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
      d: 'M ' + pt(p1) + ' A 60 60 0 0 1 ' + pt(p2) + ' Q ' + pt(c2) + ' ' + pt(punta) + ' Q ' + pt(c1) + ' ' + pt(p1) + ' Z',
      fibra: 'M ' + pt(suma(J, por(u, -26))) + ' Q ' + pt(suma(J, suma(por(u, lp * 0.28), por(n, 8)))) + ' ' + pt(suma(J, por(u, lp * 0.75)))
    };
  }

  // color de un musculo: rojo > amarillo forzado > musc (color propio) > gris
  function valorLado(v, lado) {
    if (v == null) return 0;
    return Array.isArray(v) ? v[lado] || 0 : v;
  }
  function tonoMusc(props, k, lado) {
    var r = valorLado((props.muscRojo || {})[k], lado);
    if (k === 'tra') r = Math.max(r, valorLado((props.musc || {}).trapRojo, lado));
    if (r > 0.01) return tinte(r, RED);
    var a = valorLado((props.muscAmarillo || {})[k], lado);
    if (a > 0.01) return tinte(a, YEL);
    var v = valorLado((props.musc || {})[k], lado);
    if (v > 0.01) return tinte(v, COLOR_MUSC[k] || YEL);
    return tinte(valorLado((props.muscGris || {})[k], lado), GRY);
  }
  function Zona(props) {
    var t = props.t;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: props.d,
      fill: BLANCO,
      stroke: "none"
    }), t ? /*#__PURE__*/React.createElement("path", {
      d: props.d,
      fill: t.fill,
      opacity: t.opacity
    }) : null);
  }

  // musculos de un lado (el izquierdo; el derecho se dibuja espejado)
  function MusculosLado(props) {
    var L = props.L,
      g = props.g,
      tono = props.tono;
    var gy = g.gy;
    var bajoTrap = [550, 500 + gy * 0.3];
    var columnaRom = [550, 612 + gy * 0.5];
    var trap = [[550, 150], [300, 150], [300 + g.gx, 345 + gy], L.espinaLat, L.espinaMed, bajoTrap];
    var rom = [[550, 360 + gy * 0.5], L.angSup, L.espinaMed, L.angInf, columnaRom];
    var infra = [L.espinaMed, L.angInf, L.bordeMed, L.bordeLat, L.espinaLat];
    var bajoRm = suma(L.bordeMed, [24, 40]);
    // con brazos arriba los redondos salen del borde lateral de la escapula, uno al lado del otro
    var oRm = g.arriba ? [L.bordeLat, L.bordeMed] : [L.bordeMed, bajoRm];
    var oRM = [oRm[1], suma(L.angInf, [2, 4])];
    var red = [oRm[0], oRm[1], L.rmB, L.rmA];
    var redM = [oRM[0], oRM[1], L.K, L.rmB];
    // dorsal: de la axila al angulo inferior, la columna y la fascia lumbar
    var lumbar = [550, 694 + gy * 0.3],
      finDor = [470, 830];
    var bordeDor = 'M ' + pt(lumbar) + ' Q ' + pt([536, 770]) + ' ' + pt(finDor);
    var dor = 'M ' + pt(L.K) + ' L ' + pt(suma(L.angInf, [2, 4])) + ' L ' + pt(columnaRom) + ' L ' + pt(lumbar) + ' Q ' + pt([536, 770]) + ' ' + pt(finDor) + ' L 440 900 L 260 900 L 200 560 L ' + pt(suma(L.K, [-60, 0])) + ' Z';
    var fibDor = g.arriba ? curva([[494, 784], [446, 694], suma(lerpP(L.K, L.angInf, 0.5), [4, 48])]) : curva([[494, 776], [446, 680], [404, 606]]);
    var linea = {
      fill: 'none',
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    };
    var fibra = {
      fill: 'none',
      stroke: GRY,
      strokeWidth: 11,
      strokeLinecap: 'round'
    };
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Zona, {
      d: dor,
      t: tono('dor')
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: fibDor
    }, fibra)), /*#__PURE__*/React.createElement("path", _extends({
      d: bordeDor
    }, linea)), /*#__PURE__*/React.createElement(Zona, {
      d: 'M ' + rom.map(pt).join(' L ') + ' Z',
      t: tono('rom')
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + pt([550, 452 + gy * 0.4]) + ' L ' + pt(suma(L.angSup, [8, 96]))
    }, fibra)), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + pt([550, 520 + gy * 0.4]) + ' L ' + pt(suma(L.angInf, [-4, -40]))
    }, fibra)), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + pt(L.angInf) + ' L ' + pt(columnaRom)
    }, linea)), /*#__PURE__*/React.createElement(Zona, {
      d: 'M ' + trap.map(pt).join(' L ') + ' Z',
      t: tono('tra')
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: curva([L.espinaLat, lerpP(L.espinaLat, L.espinaMed, 0.55), L.espinaMed, bajoTrap])
    }, linea)), /*#__PURE__*/React.createElement(Zona, {
      d: blando(infra),
      t: tono('inf')
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + pt(suma(L.bordeLat, [22, 14])) + ' L ' + pt(suma(L.angInf, [-14, -50]))
    }, fibra)), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + pt(suma(L.bordeLat, [30, 6])) + ' L ' + pt(suma(L.espinaMed, [-6, 40]))
    }, fibra)), /*#__PURE__*/React.createElement("path", _extends({
      d: blando(infra)
    }, linea)), /*#__PURE__*/React.createElement(Zona, {
      d: blando(redM, 0.2),
      t: tono('rM')
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + pt(lerpP(lerpP(oRM[0], oRM[1], 0.5), lerpP(L.rmB, L.K, 0.5), 0.12)) + ' L ' + pt(lerpP(lerpP(oRM[0], oRM[1], 0.5), lerpP(L.rmB, L.K, 0.5), 0.62))
    }, fibra)), /*#__PURE__*/React.createElement("path", _extends({
      d: blando(redM, 0.2)
    }, linea)), /*#__PURE__*/React.createElement(Zona, {
      d: blando(red),
      t: tono('rm')
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: blando(red)
    }, linea)));
  }

  // brazo de la vista posterior. atras=true: detras del torso (face pull);
  // si no, delante del torso (dominadas), con la gorra del deltoides encima
  function BrazoAtras(props) {
    var L = props.L,
      paso = props.paso;
    var t = paso === 'trazo';
    var ini = props.adelante ? suma(L.J, por(unidad(resta(L.E, L.J)), 14)) : L.J;
    return /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: t ? INK : 'none',
      strokeWidth: t ? 30 : 0,
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: capsula(ini, L.E, 52, 41)
    }), /*#__PURE__*/React.createElement("path", {
      d: capsula(L.E, L.H, 39, 31)
    }), /*#__PURE__*/React.createElement("circle", {
      cx: L.H[0],
      cy: L.H[1],
      r: 38
    }));
  }

  // detalle del brazo arriba: herradura del triceps y nudillos de la mano en la barra
  function DetalleBrazo(props) {
    var L = props.L;
    var u = unidad(resta(L.E, L.J)),
      n = [-u[1], u[0]];
    var lb = largo(resta(L.E, L.J));
    var b = function (t, k) {
      return suma(L.J, suma(por(u, lb * t), por(n, k)));
    };
    var w = unidad(resta(L.H, L.E));
    var nw = [-w[1], w[0]];
    var nud = function (a, k) {
      return suma(L.H, suma(por(w, a), por(nw, k)));
    };
    return /*#__PURE__*/React.createElement("g", {
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: curva([b(0.95, -22), b(0.74, 0), b(0.95, 22)]),
      stroke: INK,
      strokeWidth: 11,
      opacity: suave01((elevacion(L.J, L.E) - 112) / 6)
    }), /*#__PURE__*/React.createElement("path", {
      d: curva([nud(6, -26), nud(26, 0), nud(6, 26)]),
      stroke: INK,
      strokeWidth: 11
    }));
  }

  // pantorrilla de espaldas: gemelo ancho arriba (la cabeza interna baja mas), tobillo fino
  var PERFIL_PANT = [[0, 48, 48], [0.14, 56, 58], [0.3, 60, 66], [0.46, 52, 58], [0.62, 40, 42], [0.82, 30, 31], [1, 28, 28]];
  function pantorrilla(rod, tob, haciaAdentro) {
    var u = unidad(resta(tob, rod)),
      l = largo(resta(tob, rod));
    var n = [-u[1], u[0]];
    // n apunta hacia adentro (la linea media) con el signo que corresponda
    var sg = n[0] * haciaAdentro >= 0 ? 1 : -1;
    var f = function (t, a) {
      return suma(suma(rod, por(u, l * t)), por(n, a * sg));
    };
    var afuera = PERFIL_PANT.map(function (q) {
      return f(q[0], -q[1]);
    });
    var adentro = PERFIL_PANT.map(function (q) {
      return f(q[0], q[2]);
    }).reverse();
    var pts = afuera.concat([f(1.08, 0)]).concat(adentro).concat([f(-0.08, 0)]);
    return {
      d: blando(pts, 0.5),
      f: f
    };
  }

  // direccion del pie (del talon a la punta) vista de atras; adentro = 1 pierna izquierda
  function dirPie(L, adentro, k) {
    return k < 0.01 ? [0, 1] : rotar(unidad(resta(L.tob, L.rod)), -adentro * 26 * cruce(k));
  }
  // y del borde inferior de la zapatilla (para apoyar la figura en un piso)
  function bajoPie(L, adentro, k) {
    var u = unidad(dirPie(L, adentro, k)),
      n = [-u[1], u[0]];
    var a = 74 + lerp(0, 120, k);
    return Math.max(L.tob[1] + u[1] * a + Math.abs(n[1]) * 46, L.tob[1] + 48) + 7;
  }

  // zapatilla vista de atras: talon + suela; con k > 0 se ve la planta (pie colgando)
  function zapatoAtras(tob, dir, k) {
    var u = unidad(dir),
      n = [-u[1], u[0]];
    var q = function (a, b) {
      return suma(tob, suma(por(u, a), por(n, b)));
    };
    var largoSuela = lerp(0, 120, k);
    var talon = blando([q(-10, -36), q(-10, 36), q(30, 48), q(48, 44), q(48, -44), q(30, -48)], 0.4);
    var suela = blando([q(36, -50), q(36, 50), q(74 + largoSuela, 46), q(74 + largoSuela, -46)], 0.4);
    return {
      talon: talon,
      suela: suela,
      linea: 'M ' + pt(q(14, -22)) + ' L ' + pt(q(14, 22))
    };
  }
  function PiernaAtras(props) {
    var L = props.L,
      adentro = props.adentro,
      k = props.k;
    var pa = pantorrilla(L.rod, L.tob, adentro);
    var muslo = capsula(L.cad, L.rod, 76, 52);
    var z = zapatoAtras(L.tob, dirPie(L, adentro, k), k);
    var f = pa.f;
    var um = unidad(resta(L.rod, L.cad)),
      nm = [-um[1], um[0]];
    var sgm = nm[0] * adentro >= 0 ? 1 : -1;
    var ft = function (t, a) {
      return suma(lerpP(L.cad, L.rod, t), por(nm, a * sgm));
    };
    var linea = {
      fill: 'none',
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    };
    var fibra = {
      fill: 'none',
      stroke: GRY,
      strokeWidth: 11,
      strokeLinecap: 'round'
    };
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 30,
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: muslo
    }), /*#__PURE__*/React.createElement("path", {
      d: pa.d
    })), /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: muslo
    }), /*#__PURE__*/React.createElement("path", {
      d: pa.d
    })), /*#__PURE__*/React.createElement("path", _extends({
      d: curva([ft(0.6, 2), ft(0.76, 0), ft(0.9, -2)])
    }, linea)), /*#__PURE__*/React.createElement("path", _extends({
      d: curva([ft(0.97, -24), ft(1.03, 0), ft(0.97, 24)])
    }, fibra)), /*#__PURE__*/React.createElement("g", {
      opacity: 1 - suave01((k - 0.42) / 0.1)
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: curva([f(0.1, 0), f(0.24, 2), f(0.34, 4)])
    }, linea)), /*#__PURE__*/React.createElement("path", _extends({
      d: curva([f(0.44, -42), f(0.54, -14), f(0.6, 10), f(0.54, 42)])
    }, linea))), /*#__PURE__*/React.createElement("path", _extends({
      d: curva([f(0.66, 0), f(0.8, 0), f(0.94, 0)])
    }, fibra)), /*#__PURE__*/React.createElement("path", {
      d: z.suela,
      fill: GRY,
      stroke: INK,
      strokeWidth: 13,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: z.talon,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: z.linea,
      fill: "none",
      stroke: GRY,
      strokeWidth: 11,
      strokeLinecap: "round"
    }));
  }
  function ShortAtras(props) {
    var g = props.g,
      L = g.izq,
      R = g.der;
    var cadera = blando([[424, 826], [676, 826], [698, 906], [652, 968], [448, 968], [402, 906]], 0.3);
    var ruedo = 0.42;
    var hemL = lerpP(L.cad, L.rod, ruedo),
      hemR = lerpP(R.cad, R.rod, ruedo);
    var entrep = [550, Math.min(hemL[1], hemR[1]) - 4];
    return /*#__PURE__*/React.createElement("g", null, ['trazo', 'relleno'].map(function (paso) {
      var t = paso === 'trazo';
      return /*#__PURE__*/React.createElement("g", {
        key: paso,
        fill: GRY,
        stroke: t ? INK : 'none',
        strokeWidth: t ? 28 : 0,
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: cadera
      }), /*#__PURE__*/React.createElement("path", {
        d: manga(L.cad, L.rod, ruedo, 84, 78)
      }), /*#__PURE__*/React.createElement("path", {
        d: manga(R.cad, R.rod, ruedo, 84, 78)
      }));
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M 550 862 L ' + pt(entrep),
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: "round",
      fill: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: curva([[466, 986], [502, 1000], [536, 992]]),
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: "round",
      fill: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: curva([[634, 986], [598, 1000], [564, 992]]),
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: "round",
      fill: "none"
    }));
  }
  function Barra(props) {
    var b = props.barra === true ? {} : props.barra;
    var x0 = b.x0 == null ? 40 : b.x0,
      x1 = b.x1 == null ? EW - 40 : b.x1;
    var y = props.y;
    return /*#__PURE__*/React.createElement("rect", {
      x: x0,
      y: y - 19,
      width: x1 - x0,
      height: 38,
      rx: 19,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 13
    });
  }
  function Espalda(props) {
    var s = props.s == null ? 1 : props.s;
    var g = geoBase(props);
    var dy = props.anclaManos == null ? 0 : props.anclaManos - g.manoY;
    var gv = trasladar(g, dy);
    var id = useIdLocal('esp');
    var sil = siluetaEspalda(g);
    var espejo = 'translate(' + EW + ',0) scale(-1,1)';
    var L = g.izq,
      R = g.der;
    var dL = deltoide(L.J, L.dirDelt),
      dR = deltoide(R.J, R.dirDelt);
    var bajo = props.piernas ? 1560 : EH;
    var tono = function (lado) {
      return function (k) {
        return tonoMusc(props, k, lado);
      };
    };
    var adelante = g.arriba;

    // cuerda: de mano a mano, pasa por delante de la cara (detras de la cabeza)
    var medioCuerda = [550, Math.max(L.H[1], R.H[1]) + 56];
    var cuerda = 'M ' + pt(L.H) + ' Q ' + pt(medioCuerda) + ' ' + pt(R.H);
    var brazos = function (pasoExtra) {
      return /*#__PURE__*/React.createElement("g", {
        key: pasoExtra
      }, /*#__PURE__*/React.createElement(BrazoAtras, {
        L: L,
        paso: "trazo",
        adelante: adelante
      }), /*#__PURE__*/React.createElement("g", {
        transform: espejo
      }, /*#__PURE__*/React.createElement(BrazoAtras, {
        L: L,
        paso: "trazo",
        adelante: adelante
      })), /*#__PURE__*/React.createElement(BrazoAtras, {
        L: L,
        paso: "relleno",
        adelante: adelante
      }), /*#__PURE__*/React.createElement("g", {
        transform: espejo
      }, /*#__PURE__*/React.createElement(BrazoAtras, {
        L: L,
        paso: "relleno",
        adelante: adelante
      })), adelante ? /*#__PURE__*/React.createElement(DetalleBrazo, {
        L: L
      }) : null, adelante ? /*#__PURE__*/React.createElement("g", {
        transform: espejo
      }, /*#__PURE__*/React.createElement(DetalleBrazo, {
        L: L
      })) : null);
    };
    var hijos = typeof props.children === 'function' ? props.children(gv) : props.children;
    return /*#__PURE__*/React.createElement("svg", {
      width: EW * s,
      height: EH * s,
      viewBox: '0 0 ' + EW + ' ' + EH,
      style: Object.assign({
        display: 'block',
        overflow: 'visible'
      }, props.style || {})
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: id
    }, /*#__PURE__*/React.createElement("path", {
      d: sil
    }))), props.barra ? /*#__PURE__*/React.createElement(Barra, {
      barra: props.barra,
      y: gv.barraY
    }) : null, /*#__PURE__*/React.createElement("g", {
      transform: dy ? 'translate(0 ' + dy.toFixed(1) + ')' : undefined
    }, g.arriba ? null : /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: cuerda,
      fill: "none",
      stroke: INK,
      strokeWidth: 30,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: cuerda,
      fill: "none",
      stroke: GRY,
      strokeWidth: 8,
      strokeLinecap: "round"
    })), adelante ? null : brazos('atras'), g.entero ? /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(PiernaAtras, {
      L: R,
      adentro: -1,
      k: g.rodillas
    }), /*#__PURE__*/React.createElement(PiernaAtras, {
      L: L,
      adentro: 1,
      k: g.rodillas
    }), /*#__PURE__*/React.createElement(ShortAtras, {
      g: g
    })) : /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: 'M 426 830 L 414 ' + bajo + ' L 686 ' + bajo + ' L 674 830 Z',
      fill: GRY,
      stroke: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M 426 830 L 414 ' + bajo + ' M 674 830 L 686 ' + bajo,
      stroke: INK,
      strokeWidth: 15,
      strokeLinecap: "round",
      fill: "none"
    })), /*#__PURE__*/React.createElement("path", {
      d: sil,
      fill: BLANCO,
      stroke: "none"
    }), /*#__PURE__*/React.createElement("g", {
      clipPath: 'url(#' + id + ')'
    }, /*#__PURE__*/React.createElement(MusculosLado, {
      L: L,
      g: g,
      tono: tono(0)
    }), /*#__PURE__*/React.createElement("g", {
      transform: espejo
    }, /*#__PURE__*/React.createElement(MusculosLado, {
      L: L,
      g: g,
      tono: tono(1)
    })), /*#__PURE__*/React.createElement("path", {
      d: "M 550 300 L 550 830",
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: "round"
    })), /*#__PURE__*/React.createElement("path", {
      d: sil,
      fill: "none",
      stroke: INK,
      strokeWidth: 15,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: 420,
      y: 818,
      width: 260,
      height: 40,
      rx: 14,
      fill: GRY,
      stroke: INK,
      strokeWidth: 13
    }), adelante ? brazos('adelante') : null, [dL, dR].map(function (d, i) {
      var tDp = tonoMusc(props, 'dp', i);
      return /*#__PURE__*/React.createElement("g", {
        key: 'd' + i
      }, /*#__PURE__*/React.createElement("path", {
        d: d.d,
        fill: BLANCO,
        stroke: "none"
      }), tDp ? /*#__PURE__*/React.createElement("path", {
        d: d.d,
        fill: tDp.fill,
        opacity: tDp.opacity
      }) : null, /*#__PURE__*/React.createElement("path", {
        d: d.fibra,
        fill: "none",
        stroke: GRY,
        strokeWidth: 11,
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: d.d,
        fill: "none",
        stroke: INK,
        strokeWidth: 13,
        strokeLinejoin: "round"
      }));
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 468,
      cy: 222,
      rx: 18,
      ry: 30,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 12
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 632,
      cy: 222,
      rx: 18,
      ry: 30,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 12
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 550,
      cy: 205,
      rx: 80,
      ry: 92,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    })), hijos);
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

  var SW = 1300,
    SH = 1300,
    PISO = 1268,
    PECHO_Y = 405;
  function rodilla(cadera, tobillo, l1, l2) {
    var d = resta(tobillo, cadera);
    var dist = Math.min(largo(d), l1 + l2 - 0.5);
    var u = unidad(d);
    var a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
    var h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    var n = [u[1], -u[0]]; // la rodilla se dobla hacia adelante (izquierda)
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
    var pa = clamp(paso * 1.6, 0, 1),
      pd = clamp(paso * 1.6 - 0.6, 0, 1);
    var tobAtras = [lerp(910, 1030, Easing.easeInOutCubic(pa)), 1236 - 70 * Math.sin(Math.PI * pa)];
    var tobAdel = [lerp(770, 890, Easing.easeInOutCubic(pd)), 1236 - 50 * Math.sin(Math.PI * pd)];
    var cadera = [X0 + 6, 700];
    var Sj = [X0 + 10, 362 - 28 * enc];
    var E0 = suma(Sj, [-200, 30]),
      H0 = suma(Sj, [-400, 42]);
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
      p: p,
      rot: rot,
      paso: paso,
      enc: enc,
      tension: tension,
      poleaY: poleaY,
      carga: carga,
      X0: X0,
      cadera: cadera,
      tobAtras: tobAtras,
      tobAdel: tobAdel,
      rodAtras: rodilla(cadera, tobAtras, 272, 272),
      rodAdel: rodilla(cadera, tobAdel, 272, 272),
      Sj: Sj,
      E: E,
      H: H,
      Ef: suma(E, lejos),
      Hf: suma(H, lejos),
      Sf: suma(Sj, lejos),
      rueda: rueda,
      salida: salida,
      K: K,
      suelta: !!o.suelta,
      cabeza: [X0, 188],
      pecho: [X0 - 112, PECHO_Y]
    };
  }
  function Maquina(props) {
    var g = props.g;
    var sube = 120 * g.carga;
    var discos = [];
    for (var i = 0; i < 8; i++) {
      var y = 1206 - i * 34;
      var arriba = i >= 5; // los tres de arriba van enganchados
      discos.push(/*#__PURE__*/React.createElement("rect", {
        key: 'd' + i,
        x: 98,
        y: y - (arriba ? sube : 0),
        width: 84,
        height: 28,
        rx: 6,
        fill: arriba ? GRY : BLANCO,
        stroke: INK,
        strokeWidth: 11
      }));
    }
    var topeY = 1206 - 8 * 34 - sube;
    var py = g.poleaY;
    return /*#__PURE__*/React.createElement("g", {
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 116 104 L 116 1240 M 164 104 L 164 1240",
      stroke: GRY,
      strokeWidth: 11
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M 140 100 L 140 ' + (topeY + 6),
      stroke: INK,
      strokeWidth: 11
    }), discos, /*#__PURE__*/React.createElement("rect", {
      x: 104,
      y: topeY,
      width: 72,
      height: 28,
      rx: 8,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 11
    }), /*#__PURE__*/React.createElement("rect", {
      x: 40,
      y: 70,
      width: 44,
      height: 1190,
      rx: 10,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("rect", {
      x: 196,
      y: 70,
      width: 44,
      height: 1190,
      rx: 10,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("rect", {
      x: 28,
      y: 46,
      width: 226,
      height: 50,
      rx: 12,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("rect", {
      x: 20,
      y: 1238,
      width: 244,
      height: 34,
      rx: 10,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("rect", {
      x: 182,
      y: py - 50,
      width: 72,
      height: 100,
      rx: 14,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("circle", {
      cx: g.rueda[0],
      cy: g.rueda[1],
      r: 28,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 13
    }), /*#__PURE__*/React.createElement("circle", {
      cx: g.rueda[0],
      cy: g.rueda[1],
      r: 7,
      fill: INK
    }));
  }

  // manga del short: trapecio con ruedo recto, perpendicular al muslo
  function manga(cad, rod, frac, ra, rb) {
    var u = unidad(resta(rod, cad));
    var n = [-u[1], u[0]];
    var ruedo = lerpP(cad, rod, frac);
    var arriba = suma(cad, por(u, -30));
    return 'M ' + [suma(arriba, por(n, ra)), suma(ruedo, por(n, rb)), suma(ruedo, por(n, -rb)), suma(arriba, por(n, -ra))].map(pt).join(' L ') + ' Z';
  }
  function Pierna(props) {
    var cad = props.cadera,
      rod = props.rodilla,
      tob = props.tobillo;
    var zap = blando([[tob[0] + 34, tob[1] + 32], [tob[0] - 112, tob[1] + 32], [tob[0] - 104, tob[1] - 6], [tob[0] - 34, tob[1] - 22], [tob[0] + 30, tob[1] - 30]], 0.35);
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 30,
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: capsula(cad, rod, 66, 46)
    }), /*#__PURE__*/React.createElement("path", {
      d: capsula(rod, tob, 46, 30)
    })), /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: capsula(cad, rod, 66, 46)
    }), /*#__PURE__*/React.createElement("path", {
      d: capsula(rod, tob, 46, 30)
    })), /*#__PURE__*/React.createElement("path", {
      d: zap,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14,
      strokeLinejoin: "round"
    }));
  }
  function BrazoLado(props) {
    var S = props.S,
      E = props.E,
      H = props.H;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 30,
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: capsula(S, E, 50, 40)
    }), /*#__PURE__*/React.createElement("path", {
      d: capsula(E, H, 38, 30)
    }), /*#__PURE__*/React.createElement("circle", {
      cx: H[0],
      cy: H[1],
      r: 36
    })), /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: capsula(S, E, 50, 40)
    }), /*#__PURE__*/React.createElement("path", {
      d: capsula(E, H, 38, 30)
    }), /*#__PURE__*/React.createElement("circle", {
      cx: H[0],
      cy: H[1],
      r: 36
    })));
  }
  function Estacion(props) {
    var s = props.s == null ? 1 : props.s;
    var g = geoEstacion(props);
    var mu = props.musc || {};
    var X0 = g.X0,
      enc = g.enc;
    var torso = 'M ' + pt([X0 - 30, 236]) + ' L ' + pt([X0 - 36, 300]) + ' C ' + pt([X0 - 70, 316]) + ' ' + pt([X0 - 112, 340]) + ' ' + pt([X0 - 112, 396]) + ' C ' + pt([X0 - 112, 444]) + ' ' + pt([X0 - 92, 472]) + ' ' + pt([X0 - 74, 492]) + ' C ' + pt([X0 - 62, 548]) + ' ' + pt([X0 - 56, 606]) + ' ' + pt([X0 - 58, 704]) + ' L ' + pt([X0 + 78, 704]) + ' C ' + pt([X0 + 58, 640]) + ' ' + pt([X0 + 44, 600]) + ' ' + pt([X0 + 50, 540]) + ' C ' + pt([X0 + 60, 470]) + ' ' + pt([X0 + 94, 432]) + ' ' + pt([X0 + 88, 372]) + ' C ' + pt([X0 + 82, 330 - 22 * enc]) + ' ' + pt([X0 + 52, 300 - 26 * enc]) + ' ' + pt([X0 + 30, 262 - 10 * enc]) + ' L ' + pt([X0 + 28, 236]) + ' Z';

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
    var cuerda = puntas ? 'M ' + pt(puntas[0]) + ' L ' + pt(g.K) + ' L ' + pt(puntas[1]) : 'M ' + pt(g.H) + ' L ' + pt(g.K) + ' L ' + pt(g.Hf);
    var hijos = typeof props.children === 'function' ? props.children(g) : props.children;
    var sinMaquina = props.sinMaquina;
    return /*#__PURE__*/React.createElement("svg", {
      width: SW * s,
      height: SH * s,
      viewBox: '0 0 ' + SW + ' ' + SH,
      style: Object.assign({
        display: 'block',
        overflow: 'visible'
      }, props.style || {})
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M 0 ' + (PISO + 4) + ' L ' + SW + ' ' + (PISO + 4),
      stroke: GRY,
      strokeWidth: 11,
      strokeLinecap: "round"
    }), sinMaquina ? null : /*#__PURE__*/React.createElement(Maquina, {
      g: g
    }), props.cable === 'yel' && !flojo ? /*#__PURE__*/React.createElement("path", {
      d: cable,
      fill: "none",
      stroke: INK,
      strokeWidth: 33,
      strokeLinecap: "round"
    }) : null, /*#__PURE__*/React.createElement("path", {
      d: cable,
      fill: "none",
      stroke: flojo ? GRY : props.cable === 'yel' ? YEL : INK,
      strokeWidth: 11,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement(BrazoLado, {
      S: g.Sf,
      E: g.Ef,
      H: g.Hf
    }), /*#__PURE__*/React.createElement(Pierna, {
      cadera: g.cadera,
      rodilla: g.rodAtras,
      tobillo: g.tobAtras
    }), /*#__PURE__*/React.createElement(Pierna, {
      cadera: g.cadera,
      rodilla: g.rodAdel,
      tobillo: g.tobAdel
    }), ['trazo', 'relleno'].map(function (paso) {
      var t = paso === 'trazo';
      return /*#__PURE__*/React.createElement("g", {
        key: paso,
        fill: GRY,
        stroke: t ? INK : 'none',
        strokeWidth: t ? 28 : 0,
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("rect", {
        x: X0 - 62,
        y: 640,
        width: 146,
        height: 104,
        rx: 30
      }), /*#__PURE__*/React.createElement("path", {
        d: manga(g.cadera, g.rodAtras, 0.62, 66, 58)
      }), /*#__PURE__*/React.createElement("path", {
        d: manga(g.cadera, g.rodAdel, 0.62, 66, 58)
      }));
    }), /*#__PURE__*/React.createElement("path", {
      d: torso,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: X0 - 66,
      y: 622,
      width: 148,
      height: 34,
      rx: 12,
      fill: GRY,
      stroke: INK,
      strokeWidth: 13,
      transform: 'rotate(-3 ' + X0 + ' 640)'
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + pt([X0 + 2, 108]) + ' C ' + pt([X0 + 48, 106]) + ' ' + pt([X0 + 72, 142]) + ' ' + pt([X0 + 70, 184]) + ' C ' + pt([X0 + 68, 222]) + ' ' + pt([X0 + 50, 246]) + ' ' + pt([X0 + 30, 258]) + ' C ' + pt([X0 + 6, 268]) + ' ' + pt([X0 - 30, 268]) + ' ' + pt([X0 - 48, 256]) + ' C ' + pt([X0 - 60, 248]) + ' ' + pt([X0 - 62, 236]) + ' ' + pt([X0 - 60, 226]) + ' L ' + pt([X0 - 88, 206]) + ' L ' + pt([X0 - 64, 182]) + ' C ' + pt([X0 - 72, 150]) + ' ' + pt([X0 - 50, 110]) + ' ' + pt([X0 + 2, 108]) + ' Z',
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: X0 - 38,
      cy: 174,
      r: 8,
      fill: INK
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + pt([X0 + 18, 178]) + ' Q ' + pt([X0 + 42, 180]) + ' ' + pt([X0 + 38, 198]) + ' Q ' + pt([X0 + 36, 214]) + ' ' + pt([X0 + 20, 212]),
      fill: "none",
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: cuerda,
      fill: "none",
      stroke: INK,
      strokeWidth: 28,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: cuerda,
      fill: "none",
      stroke: GRY,
      strokeWidth: 6,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: g.K[0],
      cy: g.K[1],
      r: 13,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 11
    }), puntas ? puntas.map(function (q, i) {
      return /*#__PURE__*/React.createElement("circle", {
        key: 'pu' + i,
        cx: q[0],
        cy: q[1],
        r: 15,
        fill: INK
      });
    }) : null, /*#__PURE__*/React.createElement(BrazoLado, {
      S: g.Sj,
      E: g.E,
      H: g.H
    }), /*#__PURE__*/React.createElement("path", {
      d: dl.d,
      fill: BLANCO,
      stroke: "none"
    }), tDp ? /*#__PURE__*/React.createElement("path", {
      d: dl.d,
      fill: tDp.fill,
      opacity: tDp.opacity
    }) : null, /*#__PURE__*/React.createElement("path", {
      d: dl.fibra,
      fill: "none",
      stroke: GRY,
      strokeWidth: 11,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: dl.d,
      fill: "none",
      stroke: INK,
      strokeWidth: 13,
      strokeLinejoin: "round"
    }), hijos);
  }

  /* ---------------- B.Cuenta: anillo que se vacia + numero ---------------- */

  function Cuenta(props) {
    var s = props.s == null ? 1 : props.s;
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    var r = 86,
      c = 110;
    var circ = 2 * Math.PI * r;
    return /*#__PURE__*/React.createElement(Svg220, {
      s: s,
      style: props.style
    }, /*#__PURE__*/React.createElement("circle", {
      cx: c,
      cy: c,
      r: r,
      fill: BLANCO,
      stroke: GRY,
      strokeWidth: 16
    }), /*#__PURE__*/React.createElement("circle", {
      cx: c,
      cy: c,
      r: r,
      fill: "none",
      stroke: YEL,
      strokeWidth: 16,
      strokeDasharray: circ,
      strokeDashoffset: circ * (1 - p),
      transform: 'rotate(-90 ' + c + ' ' + c + ')',
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: c,
      cy: c,
      r: r + 13,
      fill: "none",
      stroke: INK,
      strokeWidth: 11
    }), /*#__PURE__*/React.createElement("text", {
      x: c,
      y: c + 40,
      textAnchor: "middle",
      fontFamily: "'Archivo Black', sans-serif",
      fontSize: 118,
      fill: INK
    }, props.n));
  }
  function Svg220(props) {
    var s = props.s;
    return /*#__PURE__*/React.createElement("svg", {
      width: 220 * s,
      height: 220 * s,
      viewBox: "0 0 220 220",
      style: Object.assign({
        display: 'block',
        overflow: 'visible'
      }, props.style || {})
    }, props.children);
  }
  global.B = {
    PECHO_Y: PECHO_Y,
    Estacion: Estacion,
    geoEstacion: geoEstacion,
    Cuenta: Cuenta,
    Espalda: Espalda,
    geoEspalda: geoEspalda,
    ESPALDA: {
      ancho: EW,
      alto: EH,
      agarre: AGARRE,
      brazo: BRAZO_ARR,
      antebrazo: ANTE_ARR
    },
    util: {
      lerp: lerp,
      lerpP: lerpP,
      suma: suma,
      resta: resta,
      por: por,
      largo: largo,
      unidad: unidad,
      polar: polar,
      pt: pt,
      suave01: suave01,
      capsula: capsula,
      blando: blando,
      curva: curva,
      simetrica: simetrica,
      useIdLocal: useIdLocal,
      tinte: tinte
    },
    FlechaS: FlechaS,
    Arco: Arco,
    Puntos: Puntos,
    Anillo: Anillo
  };
})(window);
