/* GENERADO por compilar.js desde perfil.jsx — no editar a mano. */
/* ============================================================
   PERFIL — B.Perfil: figura humana de perfil, articulada
   Misma familia que B.Estacion (misma cabeza, mismos grosores,
   mismo truco de union en los miembros) pero armada sobre puntos:
   sirve parada, inclinada, acostada o colgada.

   Mira hacia la IZQUIERDA: -x es el frente. viewBox 1400x1400, piso y=1300.

   <B.Perfil s pose musc muscGris muscRojo fondo medio agarre children style />
     pose      puntos de la pose (ver abajo); sin pose = posePerfil.depie({})
     musc      { clave: 0..1 } amarillo (principal). 0 = no se dibuja
     muscGris  { clave: 0..1 } gris (secundario)
     muscRojo  { clave: 0..1 } rojo (error / tension mala). Prioridad rojo > amarillo > gris
       claves: cuad recto psoas tfl sart glu isq gem abd obl erec dor pec delt delto tri bic ante
     fondo(g)  SVG antes del cuerpo (piso, colchoneta, banco, barra)
     medio(g)  SVG entre la pierna lejana y la cercana
     agarre(g) SVG entre el tronco y el brazo cercano (lo que se tiene en la mano:
               la mano cercana lo tapa). Alias: enMano
     children(g) SVG encima de todo (flechas, guias, rotulos)
   Orden: fondo, brazo lejano, pierna lejana, medio, pierna cercana, short,
   torso (+ musculos), cabeza, agarre, brazo cercano, deltoides, children.

   pose = { cadera, cuello, curva (-1..1), cabeza (grados), hombro?, codo, mano,
            hombro2?, codo2?, mano2?, rodilla, tobillo, punta, rodilla2?, tobillo2?,
            punta2?, piso?, pegado?, brazosDentro?, cabezaEncima? }
   B.posePerfil.depie / sentadilla / acostado / banco / colgado / mezclar / mover / girar
   B.geoPerfil(props)   la misma geometria g que reciben fondo/agarre/children
   B.ik(a, b, l1, l2, lado)
   B.PERFIL             { W, H, PISO, medidas }
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var B = global.B;
  var U = B.util;
  var P = global.P;
  var clamp = global.clamp;
  var INK = P.C.INK,
    YEL = P.C.YEL,
    RED = P.C.RED,
    GRY = P.C.GRY;
  var BLANCO = '#ffffff';
  var GRAD = Math.PI / 180;
  var lerp = U.lerp,
    lerpP = U.lerpP,
    suma = U.suma,
    resta = U.resta,
    por = U.por,
    largo = U.largo,
    unidad = U.unidad,
    polar = U.polar,
    pt = U.pt,
    capsula = U.capsula,
    blando = U.blando;
  var PW = 1400,
    PH = 1400,
    PISO = 1300;
  // largos de cada segmento (iguales a B.Estacion)
  var MED = {
    muslo: 272,
    pierna: 268,
    brazo: 232,
    ante: 214,
    columna: 404,
    cuelloHombro: 66,
    hombroAtras: 6,
    tobillo: 32,
    pie: 116.5
  };
  // radios de las capsulas: [en la articulacion de arriba, en la de abajo]
  var R_MUSLO = [66, 46],
    R_PIERNA = [46, 30],
    R_BRAZO = [50, 40],
    R_ANTE = [38, 30],
    R_PUNO = 36;

  /* ---------------- ayudas privadas ---------------- */

  function rotar(v, deg) {
    var c = Math.cos(deg * GRAD),
      s = Math.sin(deg * GRAD);
    return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
  }
  function angulo(v) {
    return Math.atan2(v[1], v[0]) / GRAD;
  }
  function suave(t) {
    t = clamp(t, 0, 1);
    return t * t * (3 - 2 * t);
  }
  // normal "de frente" de un eje que sube por el cuerpo (cadera -> cuello)
  function frenteDe(u) {
    return [u[1], -u[0]];
  }
  // normal del lado que flexiona en un segmento que baja (hombro -> codo, cadera -> rodilla)
  function flexDe(u) {
    return [-u[1], u[0]];
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function lerp3(a, b, t) {
    return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
  }
  function unidad3(v) {
    var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }

  // Catmull-Rom -> Bezier. tramo() devuelve solo los ' C ...' (sin el M inicial)
  function tramo(pts, cerrada) {
    var n = pts.length,
      d = '';
    var segs = cerrada ? n : n - 1;
    for (var i = 0; i < segs; i++) {
      var p0 = pts[cerrada ? (i - 1 + n) % n : Math.max(i - 1, 0)];
      var p1 = pts[i],
        p2 = pts[(i + 1) % n];
      var p3 = pts[cerrada ? (i + 2) % n : Math.min(i + 2, n - 1)];
      var c1 = suma(p1, por(resta(p2, p0), 1 / 6));
      var c2 = resta(p2, por(resta(p3, p1), 1 / 6));
      d += ' C ' + pt(c1) + ' ' + pt(c2) + ' ' + pt(p2);
    }
    return d;
  }
  function suaveAbierta(pts) {
    return 'M ' + pt(pts[0]) + tramo(pts, false);
  }
  function suaveCerrada(pts) {
    return 'M ' + pt(pts[0]) + tramo(pts, true) + ' Z';
  }
  function poli(pts) {
    return 'M ' + pts.map(pt).join(' L ');
  }
  function tabla(T, t) {
    if (t <= T[0][0]) return T[0][1];
    for (var i = 1; i < T.length; i++) {
      if (t <= T[i][0]) {
        var a = T[i - 1],
          b = T[i];
        return lerp(a[1], b[1], suave((t - a[0]) / (b[0] - a[0])));
      }
    }
    return T[T.length - 1][1];
  }

  // anchos del torso respecto del eje de la columna (t: 0 cadera -> 1 cuello),
  // medidos sobre la silueta de B.Estacion: pecho que sale bien adelante,
  // cintura, escapula atras y la bajada del trapecio hacia la nuca
  var ANCHO_FRENTE = [[0.1, 61], [0.2, 60], [0.3, 62], [0.4, 66], [0.5, 77], [0.58, 97], [0.66, 112], [0.74, 116], [0.82, 108], [0.9, 92], [0.95, 70], [1.0, 40]];
  var ANCHO_ESPALDA = [[0.1, 68], [0.2, 54], [0.3, 48], [0.4, 48], [0.5, 55], [0.6, 70], [0.7, 84], [0.8, 87], [0.88, 80], [0.95, 66], [1.0, 54]];
  var T_TORSO = [0.135, 0.2, 0.3, 0.4, 0.5, 0.58, 0.66, 0.74, 0.82, 0.9, 0.95, 1.0];
  var T_FAJA = 0.165;

  // short: bloque de cadera en el marco de la pelvis [a lo largo, hacia el frente]
  var SHORT = [[76, 64], [40, 66], [-58, 66], [-86, 24], [-86, -40], [-68, -84], [-6, -94], [76, -66]];

  // cabeza de perfil: el mismo path que B.Estacion, con origen en la base del cuello
  var CAB = {
    ini: [4, -188],
    segs: [['C', [50, -190], [74, -154], [72, -112]], ['C', [70, -74], [52, -50], [32, -38]], ['C', [8, -28], [-28, -28], [-46, -40]], ['C', [-58, -48], [-60, -60], [-58, -70]], ['L', [-86, -90]], ['L', [-62, -114]], ['C', [-70, -146], [-48, -186], [4, -188]]],
    ojo: [-36, -122],
    oreja: [[20, -118], [44, -116], [40, -98], [38, -82], [22, -84]],
    orejaC: [31, -100],
    centro: [2, -108],
    nuca: [72, -112],
    menton: [-46, -40],
    nariz: [-86, -90],
    coronilla: [4, -188],
    cuelloFrente: [-28, -58],
    cuelloAtras: [32, -36],
    pivote: [0, -62]
  };

  // zapatilla de B.Estacion, relativa al tobillo, con la punta en ZAP_PUNTA
  var ZAP = [[34, 32], [-112, 32], [-104, -6], [-34, -22], [30, -30]];
  var ZAP_PUNTA = [-112, 32];
  var ZAP_ANG = angulo(ZAP_PUNTA);

  /* ---------------- cinematica inversa ---------------- */

  // articulacion intermedia entre a y b (largos l1, l2).
  // lado +1: dobla como un codo (brazo: a=hombro, b=mano)
  // lado -1: dobla como una rodilla (pierna: a=cadera, b=tobillo)
  // (para una figura que mira a la izquierda; si no alcanza, queda recta)
  function ik(a, b, l1, l2, lado) {
    var d = resta(b, a);
    var dist = clamp(largo(d), Math.abs(l1 - l2) + 0.5, l1 + l2 - 0.5);
    var u = largo(d) < 0.001 ? [0, 1] : unidad(d);
    var x = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
    var h = Math.sqrt(Math.max(0, l1 * l1 - x * x));
    var s = lado < 0 ? -1 : 1;
    return suma(suma(a, por(u, x)), por([u[1] * s, -u[0] * s], h));
  }

  /* ---------------- columna ---------------- */

  // eje del tronco: Bezier de la cadera al cuello. curva + redondea (el medio
  // se va hacia la espalda), curva - arquea la zona lumbar (el medio va al frente)
  function columna(cad, cue, k) {
    var c = resta(cue, cad),
      L = largo(c) || 1,
      uc = unidad(c),
      nc = frenteDe(uc);
    k = clamp(k || 0, -1, 1);
    // k < 0: la zona lumbar va al frente y la dorsal apenas atras (S de la
    // hiperlordosis): acostado, las escapulas siguen en el piso y la lumbar se despega
    var b1 = k >= 0 ? -k * 72 : -k * 110;
    var b2 = k >= 0 ? -k * 94 : k * 36;
    var P0 = cad,
      P3 = cue;
    var P1 = suma(suma(cad, por(c, 1 / 3)), por(nc, b1));
    var P2 = suma(suma(cad, por(c, 2 / 3)), por(nc, b2));
    function bez(t) {
      var m = 1 - t,
        a = m * m * m,
        b = 3 * m * m * t,
        cc = 3 * m * t * t,
        d = t * t * t;
      return [a * P0[0] + b * P1[0] + cc * P2[0] + d * P3[0], a * P0[1] + b * P1[1] + cc * P2[1] + d * P3[1]];
    }
    function der(t) {
      var m = 1 - t;
      return [3 * m * m * (P1[0] - P0[0]) + 6 * m * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]), 3 * m * m * (P1[1] - P0[1]) + 6 * m * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1])];
    }
    function tan(t) {
      return unidad(der(clamp(t, 0, 1)));
    }
    function punto(t) {
      if (t < 0) return suma(P0, por(tan(0), t * L));
      if (t > 1) return suma(P3, por(tan(1), (t - 1) * L));
      return bez(t);
    }
    function nrm(t) {
      return frenteDe(tan(t));
    }
    function en(t, w) {
      return suma(punto(t), por(nrm(t), w));
    }
    return {
      punto: punto,
      tan: tan,
      nrm: nrm,
      en: en,
      L: L,
      u: uc,
      n: nc
    };
  }
  function segmento(a, b, ra, rb) {
    var d = resta(b, a),
      l = largo(d) || 1,
      u = unidad(d);
    return {
      a: a,
      b: b,
      u: u,
      n: flexDe(u),
      largo: l,
      ra: ra,
      rb: rb,
      r: function (s) {
        return lerp(ra, rb, clamp(s, 0, 1));
      },
      en: function (s, w) {
        return suma(suma(a, por(u, s * l)), por(flexDe(u), w));
      }
    };
  }

  /* ---------------- geometria ---------------- */

  function geoPerfil(props) {
    props = props || {};
    var o = props.pose || posePerfil.depie({});
    var cad = o.cadera,
      cue = o.cuello;
    var k = clamp(o.curva || 0, -1, 1);
    var col = columna(cad, cue, k);
    var L = col.L;
    var uTop = col.tan(1),
      nTop = col.nrm(1);
    var u0 = col.tan(0),
      n0 = col.nrm(0);
    var abajo = por(col.u, -1);
    var hombro = o.hombro || col.en(1 - MED.cuelloHombro / L, -MED.hombroAtras);
    var lejos = suma(por(nTop, -16), por(uTop, 12));
    var codo = o.codo || suma(hombro, por(rotar(abajo, -4), MED.brazo));
    var mano = o.mano || suma(codo, por(rotar(abajo, -8), MED.ante));
    var hombro2 = o.hombro2 || suma(hombro, lejos);
    var codo2 = o.codo2 || suma(codo, lejos);
    var mano2 = o.mano2 || suma(mano, lejos);
    var tobillo = o.tobillo || suma(cad, por(abajo, MED.muslo + MED.pierna - 4));
    var rodilla = o.rodilla || ik(cad, tobillo, MED.muslo, MED.pierna, -1);
    var punta = o.punta || suma(tobillo, rotar(ZAP_PUNTA, angulo(abajo) - 90));
    // la pierna lejana asoma ~32 por detras: se ve una franja blanca entre los
    // dos contornos (con menos, los dos trazos se funden en una banda negra)
    var lejosP = suma(por(nTop, -32), por(uTop, 4));
    var tobillo2 = o.tobillo2 || suma(tobillo, lejosP);
    var rodilla2 = o.rodilla2 || suma(rodilla, lejosP);
    var punta2 = o.punta2 || suma(punta, lejosP);

    // cabeza: sigue al tronco (tangente arriba de la columna) + inclinacion propia
    var angTronco = angulo(uTop) + 90;
    var cabeza = o.cabeza || 0;
    function cab(p) {
      var q = suma(CAB.pivote, rotar(resta(p, CAB.pivote), -cabeza));
      return suma(cue, rotar(q, angTronco));
    }
    var uCab = unidad(resta(cab([0, -100]), cab([0, 0])));
    function pelvis(al, w) {
      return suma(suma(cad, por(u0, al)), por(n0, w));
    }
    function anchoFrente(t) {
      return tabla(ANCHO_FRENTE, t);
    }
    // pegado { y, lumbar, alto }: la espalda se aplasta contra un plano
    // horizontal (piso, banco). lumbar/alto 0..1 = cuanto se pega la zona lumbar
    // y la dorsal (1 = sin hueco). Solo actua con la espalda mirando hacia abajo.
    var pg = o.pegado;
    function anchoEspalda(t) {
      var b = tabla(ANCHO_ESPALDA, t);
      if (!pg || t < 0.1 || t > 0.99) return b;
      var nn = col.nrm(t);
      if (nn[1] > -0.5) return b;
      var q = col.en(t, -b);
      var gap = (pg.y - q[1]) / -nn[1];
      if (gap <= 0) return b;
      var fz = lerp(pg.lumbar == null ? 1 : pg.lumbar, pg.alto == null ? 1 : pg.alto, suave((t - 0.55) / 0.25));
      var vent = suave((t - 0.1) / 0.07) * suave((0.99 - t) / 0.12);
      return b + gap * fz * vent;
    }
    function torso(t, w) {
      return col.en(t, w);
    }
    function zapato(tob, pun) {
      var giro = angulo(resta(pun, tob)) - ZAP_ANG;
      return ZAP.map(function (q) {
        return suma(tob, rotar(q, giro));
      });
    }
    var zap = zapato(tobillo, punta),
      zap2 = zapato(tobillo2, punta2);
    var ejes = {
      tronco: {
        o: cad,
        u: col.u,
        n: col.n,
        largo: L
      },
      pelvis: {
        o: cad,
        u: u0,
        n: n0
      },
      pecho: {
        o: col.punto(0.72),
        u: col.tan(0.72),
        n: col.nrm(0.72)
      },
      cuello: {
        o: cue,
        u: uTop,
        n: nTop
      },
      cabeza: {
        o: cab(CAB.centro),
        u: uCab,
        n: frenteDe(uCab)
      },
      muslo: segmento(cad, rodilla, R_MUSLO[0], R_MUSLO[1]),
      pierna: segmento(rodilla, tobillo, R_PIERNA[0], R_PIERNA[1]),
      brazo: segmento(hombro, codo, R_BRAZO[0], R_BRAZO[1]),
      antebrazo: segmento(codo, mano, R_ANTE[0], R_ANTE[1]),
      muslo2: segmento(cad, rodilla2, R_MUSLO[0], R_MUSLO[1]),
      pierna2: segmento(rodilla2, tobillo2, R_PIERNA[0], R_PIERNA[1]),
      brazo2: segmento(hombro2, codo2, R_BRAZO[0], R_BRAZO[1]),
      antebrazo2: segmento(codo2, mano2, R_ANTE[0], R_ANTE[1])
    };

    // axila: abajo del hombro con el brazo colgando, sube con el brazo levantado
    var dirBrazo = unidad(resta(codo, hombro));
    var sube = clamp((1 + dot(dirBrazo, uTop)) / 2, 0, 1);
    var axila = lerpP(torso(1 - (MED.cuelloHombro + 70) / L, 6), suma(hombro, por(dirBrazo, 36)), suave(sube));

    // contornos muestreados (para guias: linea de la espalda, del pecho, de la columna)
    var TS = [0.14, 0.22, 0.3, 0.38, 0.46, 0.54, 0.62, 0.7, 0.78, 0.86, 0.94, 1];
    var espaldaPts = TS.map(function (t) {
      return torso(t, -anchoEspalda(t));
    });
    var frentePts = TS.map(function (t) {
      return torso(t, anchoFrente(t));
    });
    var columnaPts = [0, 0.2, 0.4, 0.6, 0.8, 1].map(col.punto);
    // hueco lumbar: donde la espalda queda mas lejos del plano de apoyo
    var hueco = null;
    if (pg) {
      for (var ti = 0.22; ti <= 0.7001; ti += 0.01) {
        var qh = torso(ti, -anchoEspalda(ti)),
          alto = pg.y - qh[1];
        if (!hueco || alto > hueco.alto) hueco = {
          t: ti,
          arriba: qh,
          abajo: [qh[0], pg.y],
          alto: alto
        };
      }
      if (hueco.alto < 0) hueco.alto = 0;
    }
    var g = Object.assign({}, o, {
      W: PW,
      H: PH,
      cadera: cad,
      cuello: cue,
      curva: k,
      cabeza: cabeza,
      hombro: hombro,
      codo: codo,
      mano: mano,
      hombro2: hombro2,
      codo2: codo2,
      mano2: mano2,
      rodilla: rodilla,
      tobillo: tobillo,
      punta: punta,
      rodilla2: rodilla2,
      tobillo2: tobillo2,
      punta2: punta2,
      talon: zap[0],
      talon2: zap2[0],
      hombros: [hombro, hombro2],
      codos: [codo, codo2],
      manos: [mano, mano2],
      rodillas: [rodilla, rodilla2],
      tobillos: [tobillo, tobillo2],
      puntas: [punta, punta2],
      centroCabeza: cab(CAB.centro),
      coronilla: cab(CAB.coronilla),
      nuca: cab(CAB.nuca),
      menton: cab(CAB.menton),
      nariz: cab(CAB.nariz),
      ojo: cab(CAB.ojo),
      frentePecho: torso(0.72, anchoFrente(0.72)),
      espaldaAlta: torso(0.78, -anchoEspalda(0.78)),
      lumbar: torso(0.32, -anchoEspalda(0.32)),
      hueco: hueco,
      espaldaPts: espaldaPts,
      frentePts: frentePts,
      columnaPts: columnaPts,
      panza: torso(0.32, anchoFrente(0.32)),
      gluteo: pelvis(-6, -94),
      axila: axila,
      columna: col.punto,
      torso: torso,
      pelvis: pelvis,
      anchoFrente: anchoFrente,
      anchoEspalda: anchoEspalda,
      ejes: ejes,
      _col: col,
      _cab: cab,
      _zap: zap,
      _zap2: zap2,
      _sube: sube
    });
    return g;
  }

  /* ---------------- formas ---------------- */

  function manga(cad, rod, frac, ra, rb) {
    var u = unidad(resta(rod, cad));
    var n = [-u[1], u[0]];
    var ruedo = lerpP(cad, rod, frac);
    var arriba = suma(cad, por(u, -12));
    return 'M ' + [suma(arriba, por(n, ra)), suma(ruedo, por(n, rb)), suma(ruedo, por(n, -rb)), suma(arriba, por(n, -ra))].map(pt).join(' L ') + ' Z';
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
      fibra: 'M ' + pt(suma(J, por(u, -26))) + ' Q ' + pt(suma(J, suma(por(u, lp * 0.28), por(n, 8)))) + ' ' + pt(suma(J, por(u, lp * 0.75))),
      u: u,
      n: n,
      lp: lp
    };
  }
  function formas(g) {
    var col = g._col,
      cab = g._cab;
    var F = g.anchoFrente,
      Bk = g.anchoEspalda;
    var frente = T_TORSO.map(function (t) {
      return col.en(t, F(t));
    });
    var espalda = T_TORSO.slice().reverse().map(function (t) {
      return col.en(t, -Bk(t));
    });
    // garganta recta hasta la base del cuello (como B.Estacion); la nuca baja
    // suave por el trapecio hasta la espalda
    espalda.unshift(cab(CAB.cuelloAtras));
    var torso = 'M ' + pt(frente[0]) + tramo(frente, false) + ' L ' + pt(cab(CAB.cuelloFrente)) + ' L ' + pt(espalda[0]) + tramo(espalda, false) + ' Z';
    var shortBloque = blando(SHORT.map(function (q) {
      return g.pelvis(q[0], q[1]);
    }), 0.32);

    // faja: rectangulo redondeado perpendicular al eje, a la altura T_FAJA
    var fa = T_FAJA,
      wf = F(fa) + 9,
      wb = Bk(fa) + 9;
    var cF = col.en(fa, (wf - wb) / 2);
    var nF = col.nrm(fa);
    var faja = {
      c: cF,
      ancho: wf + wb,
      alto: 34,
      ang: angulo(nF) - 180
    };
    var c = CAB.segs;
    var cabeza = 'M ' + pt(cab(CAB.ini));
    c.forEach(function (s) {
      if (s[0] === 'C') cabeza += ' C ' + pt(cab(s[1])) + ' ' + pt(cab(s[2])) + ' ' + pt(cab(s[3]));else cabeza += ' L ' + pt(cab(s[1]));
    });
    cabeza += ' Z';
    // oreja: la C se abre hacia la cara. Con la cara mirando al techo (acostado)
    // esa C quedaria como una sonrisa debajo del ojo; ahi se gira para abrirse
    // hacia el menton, como en la figura parada.
    var cc = cab(CAB.orejaC);
    var F = unidad(resta(cab([-100, CAB.orejaC[1]]), cc));
    var Dm = unidad(resta(cab([CAB.orejaC[0], 0]), cc));
    var tA = clamp((-F[1] - 0.45) / 0.4, 0, 1);
    var O = unidad(lerpP(F, Dm, tA));
    var giroO = angulo(O) - 180;
    var oj = CAB.oreja.map(function (q) {
      return suma(cc, rotar(resta(q, CAB.orejaC), giroO));
    });
    var oreja = 'M ' + pt(oj[0]) + ' Q ' + pt(oj[1]) + ' ' + pt(oj[2]) + ' Q ' + pt(oj[3]) + ' ' + pt(oj[4]);
    var lp = clamp(largo(resta(g.codo, g.hombro)) * 0.62, 58, 128);
    return {
      torso: torso,
      short: shortBloque,
      faja: faja,
      cabeza: cabeza,
      oreja: oreja,
      ojo: cab(CAB.ojo),
      delt: deltoide(g.hombro, g.codo, lp),
      manga: manga(g.cadera, g.rodilla, 0.62, 66, 58),
      manga2: manga(g.cadera, g.rodilla2, 0.62, 66, 58),
      muslo: capsula(g.cadera, g.rodilla, R_MUSLO[0], R_MUSLO[1]),
      pierna: capsula(g.rodilla, g.tobillo, R_PIERNA[0], R_PIERNA[1]),
      brazo: capsula(g.hombro, g.codo, R_BRAZO[0], R_BRAZO[1]),
      ante: capsula(g.codo, g.mano, R_ANTE[0], R_ANTE[1])
    };
  }

  /* ---------------- musculos ---------------- */

  // musculo de un lado de un miembro: linea interior [[s, f]] (f = fraccion del
  // radio, + hacia el lado elegido) y el borde exterior por fuera de la capsula
  // (lo recorta el clip, asi solo se ve la linea interior)
  function ladoMiembro(sg, signo, interior) {
    var pts = interior.map(function (q) {
      return sg.en(q[0], signo * q[1] * sg.r(q[0]));
    });
    var s0 = interior[0][0],
      s1 = interior[interior.length - 1][0];
    var fuera = [sg.en(s1, signo * (sg.r(s1) + 70)), sg.en(s0, signo * (sg.r(s0) + 70))];
    return 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z';
  }
  function lineaMiembro(sg, pares) {
    return suaveAbierta(pares.map(function (q) {
      return sg.en(q[0], q[1] * sg.r(q[0]));
    }));
  }

  // cada musculo: { capa, clip, forma, lineas, fibras, banda }
  var MUSCULOS = {
    /* ---- tronco (clip: torso) ---- */
    abd: function (g) {
      var F = g.anchoFrente,
        T = g.torso;
      // banda de la pared frontal, del pubis al borde de las costillas (bajo el
      // pectoral), con las puntas redondeadas hacia el contorno
      var ins = [[0.1, 2], [0.14, 30], [0.22, 40], [0.36, 40], [0.5, 40], [0.57, 32], [0.61, 2]];
      var pts = ins.map(function (q) {
        return T(q[0], F(q[0]) - q[1]);
      });
      var fuera = [T(0.63, F(0.63) + 60), T(0.08, F(0.08) + 60)];
      // las tres intersecciones tendinosas (los "cuadritos")
      var lineas = [0.26, 0.36, 0.46].map(function (t) {
        return poli([T(t, F(t) - 40), T(t, F(t) + 20)]);
      });
      return {
        capa: 'torso',
        clip: 't',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        lineas: lineas
      };
    },
    obl: function (g) {
      var F = g.anchoFrente,
        T = g.torso;
      var pts = [T(0.15, F(0.15) - 40), T(0.36, F(0.36) - 38), T(0.56, F(0.56) - 40), T(0.62, 10), T(0.42, -26), T(0.2, -38)];
      return {
        capa: 'torso',
        clip: 't',
        forma: suaveCerrada(pts),
        fibras: [poli([T(0.52, -2), T(0.36, F(0.36) - 50)]), poli([T(0.4, -20), T(0.23, F(0.23) - 48)])]
      };
    },
    erec: function (g) {
      var Bk = g.anchoEspalda,
        T = g.torso;
      var ins = [[0.08, 40], [0.22, 36], [0.4, 36], [0.6, 32], [0.8, 28], [0.92, 34]];
      var pts = ins.map(function (q) {
        return T(q[0], -(Bk(q[0]) - q[1]));
      });
      var fuera = [T(0.94, -(Bk(0.94) + 60)), T(0.06, -(Bk(0.06) + 60))];
      return {
        capa: 'torso',
        clip: 't',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        fibras: [suaveAbierta([0.14, 0.4, 0.62, 0.84].map(function (t) {
          return T(t, -(Bk(t) - 15));
        }))]
      };
    },
    dor: function (g) {
      var Bk = g.anchoEspalda,
        T = g.torso;
      var A = g.axila;
      var pts = [A, T(0.42, -6), T(0.22, -Bk(0.22) + 10)];
      var fuera = [T(0.16, -(Bk(0.16) + 60)), T(0.76, -(Bk(0.76) + 60))];
      return {
        capa: 'torso',
        clip: 't',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        fibras: [poli([lerpP(A, T(0.3, -40), 0.12), T(0.34, -48)]), poli([lerpP(A, T(0.62, -70), 0.15), T(0.58, -Bk(0.58) + 14)])]
      };
    },
    pec: function (g) {
      var F = g.anchoFrente,
        T = g.torso;
      var tip = lerpP(g.hombro, g.codo, 0.16);
      var pts = [T(0.56, F(0.56) + 4), T(0.6, F(0.6) - 26), T(0.68, 30), tip, T(0.9, 40), T(0.93, F(0.93) - 6)];
      var fuera = [T(0.95, F(0.95) + 60), T(0.55, F(0.55) + 60)];
      return {
        capa: 'torso',
        clip: 't',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        fibras: [poli([T(0.66, F(0.66) - 14), lerpP(T(0.66, F(0.66) - 14), tip, 0.62)]), poli([T(0.82, F(0.82) - 12), lerpP(T(0.82, F(0.82) - 12), tip, 0.6)])]
      };
    },
    /* ---- cadera y pierna (clip: c = short + muslo, m = muslo, p = pierna) ---- */
    glu: function (g) {
      var PF = g.pelvis;
      var ins = [[-112, -60], [-64, -16], [6, -4], [64, -24]];
      var pts = ins.map(function (q) {
        return PF(q[0], q[1]);
      });
      var fuera = [PF(90, -170), PF(-130, -170)];
      return {
        capa: 'pierna',
        clip: 'c',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        fibras: [poli([PF(44, -54), PF(-50, -82)]), poli([PF(30, -86), PF(-24, -100)])]
      };
    },
    tfl: function (g) {
      var m = g.ejes.muslo;
      var pts = [m.en(-0.24, 0.62 * 66), m.en(-0.06, 0.98 * 66), m.en(0.2, 0.62 * m.r(0.2)), m.en(0.3, 0.32 * m.r(0.3)), m.en(0.12, 0.26 * m.r(0.12)), m.en(-0.1, 0.36 * 66)];
      return {
        capa: 'pierna',
        clip: 'c',
        forma: suaveCerrada(pts),
        fibras: [lineaMiembro(m, [[-0.12, 0.62], [0.2, 0.45]])]
      };
    },
    recto: function (g) {
      var m = g.ejes.muslo;
      return {
        capa: 'pierna',
        clip: 'c',
        forma: ladoMiembro(m, 1, [[-0.16, 1.4], [-0.06, 0.62], [0.2, 0.32], [0.5, 0.24], [0.78, 0.36], [0.9, 0.62], [0.95, 1.3]]),
        fibras: [lineaMiembro(m, [[0.04, 0.72], [0.45, 0.6], [0.82, 0.72]])]
      };
    },
    cuad: function (g) {
      var m = g.ejes.muslo;
      return {
        capa: 'pierna',
        clip: 'm',
        forma: ladoMiembro(m, 1, [[0.06, 1.3], [0.14, 0.4], [0.4, -0.22], [0.66, -0.2], [0.86, 0.18], [0.95, 1.3]]),
        lineas: [lineaMiembro(m, [[0.6, -0.08], [0.78, 0.28], [0.9, 0.62]])],
        fibras: [lineaMiembro(m, [[0.2, 0.62], [0.5, 0.52], [0.72, 0.62]])]
      };
    },
    sart: function (g) {
      var m = g.ejes.muslo;
      return {
        capa: 'pierna',
        clip: 'c',
        banda: lineaMiembro(m, [[-0.1, 0.78], [0.25, 0.5], [0.6, 0.02], [0.86, -0.42], [0.98, -0.5]])
      };
    },
    isq: function (g) {
      var m = g.ejes.muslo;
      return {
        capa: 'pierna',
        clip: 'm',
        forma: ladoMiembro(m, -1, [[0.04, 1.3], [0.14, 0.2], [0.42, -0.24], [0.7, -0.14], [0.88, 0.3], [0.96, 1.3]]),
        lineas: [lineaMiembro(m, [[0.64, -0.5], [0.8, -0.52], [0.97, -0.62]])],
        fibras: [lineaMiembro(m, [[0.2, -0.6], [0.5, -0.5], [0.7, -0.58]])]
      };
    },
    gem: function (g) {
      var p = g.ejes.pierna;
      return {
        capa: 'pierna',
        clip: 'p',
        forma: ladoMiembro(p, -1, [[-0.04, 1.3], [0.08, 0.1], [0.28, -0.24], [0.48, -0.06], [0.62, 0.5], [0.7, 1.3]]),
        lineas: [lineaMiembro(p, [[0.12, -0.5], [0.3, -0.42], [0.46, -0.56]])]
      };
    },
    psoas: function (g) {
      // banda esquematica: de las vertebras lumbares (mitad de atras del tronco)
      // baja por dentro de la pelvis, pasa por delante de la articulacion de la
      // cadera y se mete en la cara interna del muslo, cerca de la raiz
      var T = g.torso,
        Bk = g.anchoEspalda,
        m = g.ejes.muslo;
      var pts = [T(0.5, -Bk(0.5) * 0.45), T(0.3, -10), T(0.14, 16), g.pelvis(-20, 34), m.en(0.24, 0.55 * m.r(0.24))];
      return {
        capa: 'pierna',
        clip: null,
        banda: suaveAbierta(pts)
      };
    },
    /* ---- brazo cercano (clip: b = brazo, a = antebrazo) ---- */
    bic: function (g) {
      var b = g.ejes.brazo;
      return {
        capa: 'brazo',
        clip: 'b',
        forma: ladoMiembro(b, 1, [[0.16, 1.3], [0.28, 0.2], [0.52, -0.1], [0.76, 0.1], [0.88, 0.5], [0.92, 1.3]]),
        fibras: [lineaMiembro(b, [[0.34, 0.56], [0.58, 0.5], [0.8, 0.6]])]
      };
    },
    tri: function (g) {
      var b = g.ejes.brazo;
      return {
        capa: 'brazo',
        clip: 'b',
        forma: ladoMiembro(b, -1, [[0.04, 1.3], [0.16, 0.1], [0.46, -0.16], [0.72, 0.0], [0.88, 0.4], [0.94, 1.3]]),
        lineas: [lineaMiembro(b, [[0.6, -0.55], [0.74, -0.42], [0.88, -0.55]])],
        fibras: [lineaMiembro(b, [[0.2, -0.56], [0.42, -0.54]])]
      };
    },
    ante: function (g) {
      var a = g.ejes.antebrazo;
      var r = function (s) {
        return a.r(s) + 70;
      };
      return {
        capa: 'brazo',
        clip: 'a',
        forma: 'M ' + pt(a.en(-0.2, -r(0))) + ' L ' + pt(a.en(0.5, -r(0.5))) + ' Q ' + pt(a.en(0.74, 0)) + ' ' + pt(a.en(0.5, r(0.5))) + ' L ' + pt(a.en(-0.2, r(0))) + ' Z',
        fibras: [lineaMiembro(a, [[0.1, 0.3], [0.32, 0.22], [0.5, 0.3]])]
      };
    }
  };
  var ORDEN_MUSC = {
    torso: ['erec', 'dor', 'obl', 'abd', 'pec'],
    pierna: ['glu', 'isq', 'cuad', 'recto', 'tfl', 'sart', 'gem', 'psoas'],
    brazo: ['tri', 'bic', 'ante']
  };
  function colorDe(props, k) {
    var r = (props.muscRojo || {})[k],
      y = (props.musc || {})[k],
      gr = (props.muscGris || {})[k];
    if (r > 0.01) return [RED, clamp(r, 0, 1)];
    if (y > 0.01) return [YEL, clamp(y, 0, 1)];
    if (gr > 0.01) return [GRY, clamp(gr, 0, 1)];
    return null;
  }
  function Musculo(props) {
    var m = props.m,
      color = props.color,
      clip = props.clip;
    var fibra = color === GRY ? null : GRY;
    return /*#__PURE__*/React.createElement("g", {
      opacity: props.v,
      clipPath: clip ? 'url(#' + clip + ')' : undefined
    }, m.forma ? /*#__PURE__*/React.createElement("path", {
      d: m.forma,
      fill: color,
      stroke: "none"
    }) : null, fibra && m.fibras ? m.fibras.map(function (d, i) {
      return /*#__PURE__*/React.createElement("path", {
        key: 'f' + i,
        d: d,
        fill: "none",
        stroke: fibra,
        strokeWidth: 11,
        strokeLinecap: "round"
      });
    }) : null, m.lineas ? m.lineas.map(function (d, i) {
      return /*#__PURE__*/React.createElement("path", {
        key: 'l' + i,
        d: d,
        fill: "none",
        stroke: INK,
        strokeWidth: 11,
        strokeLinecap: "round"
      });
    }) : null, m.forma ? /*#__PURE__*/React.createElement("path", {
      d: m.forma,
      fill: "none",
      stroke: INK,
      strokeWidth: 11,
      strokeLinejoin: "round"
    }) : null, m.banda ? /*#__PURE__*/React.createElement("path", {
      d: m.banda,
      fill: "none",
      stroke: INK,
      strokeWidth: 38,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }) : null, m.banda ? /*#__PURE__*/React.createElement("path", {
      d: m.banda,
      fill: "none",
      stroke: color,
      strokeWidth: 16,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }) : null);
  }
  function capaMusculos(props, g, capa, ids) {
    return ORDEN_MUSC[capa].map(function (k) {
      var c = colorDe(props, k);
      if (!c) return null;
      var m = MUSCULOS[k](g);
      return /*#__PURE__*/React.createElement(Musculo, {
        key: k,
        m: m,
        color: c[0],
        v: c[1],
        clip: m.clip ? ids[m.clip] : null
      });
    });
  }

  /* ---------------- piezas ---------------- */

  function Pierna(props) {
    var cad = props.cadera,
      rod = props.rodilla,
      tob = props.tobillo;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 30,
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: capsula(cad, rod, R_MUSLO[0], R_MUSLO[1])
    }), /*#__PURE__*/React.createElement("path", {
      d: capsula(rod, tob, R_PIERNA[0], R_PIERNA[1])
    })), /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: capsula(cad, rod, R_MUSLO[0], R_MUSLO[1])
    }), /*#__PURE__*/React.createElement("path", {
      d: capsula(rod, tob, R_PIERNA[0], R_PIERNA[1])
    })), /*#__PURE__*/React.createElement("path", {
      d: blando(props.zap, 0.35),
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 14,
      strokeLinejoin: "round"
    }));
  }
  function Brazo(props) {
    var S = props.S,
      E = props.E,
      H = props.H;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 30,
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: capsula(S, E, R_BRAZO[0], R_BRAZO[1])
    }), /*#__PURE__*/React.createElement("path", {
      d: capsula(E, H, R_ANTE[0], R_ANTE[1])
    }), /*#__PURE__*/React.createElement("circle", {
      cx: H[0],
      cy: H[1],
      r: R_PUNO
    })), /*#__PURE__*/React.createElement("g", {
      fill: BLANCO,
      stroke: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: capsula(S, E, R_BRAZO[0], R_BRAZO[1])
    }), /*#__PURE__*/React.createElement("path", {
      d: capsula(E, H, R_ANTE[0], R_ANTE[1])
    }), /*#__PURE__*/React.createElement("circle", {
      cx: H[0],
      cy: H[1],
      r: R_PUNO
    })));
  }
  function Perfil(props) {
    var s = props.s == null ? 1 : props.s;
    var g = geoPerfil(props);
    var f = formas(g);
    var id = U.useIdLocal('perf');
    var ids = {
      t: id + 't',
      c: id + 'c',
      m: id + 'm',
      p: id + 'p',
      b: id + 'b',
      a: id + 'a',
      d: id + 'd',
      s: id + 's'
    };
    var hayPierna = ORDEN_MUSC.pierna.some(function (k) {
      return !!colorDe(props, k);
    });
    var fondo = typeof props.fondo === 'function' ? props.fondo(g) : props.fondo;
    var medio = typeof props.medio === 'function' ? props.medio(g) : props.medio;
    var agarreF = props.agarre || props.enMano;
    var enMano = typeof agarreF === 'function' ? agarreF(g) : agarreF;
    var hijos = typeof props.children === 'function' ? props.children(g) : props.children;
    var brazoLejos = /*#__PURE__*/React.createElement(Brazo, {
      S: g.hombro2,
      E: g.codo2,
      H: g.mano2
    });
    var piernaLejos = /*#__PURE__*/React.createElement(Pierna, {
      cadera: g.cadera,
      rodilla: g.rodilla2,
      tobillo: g.tobillo2,
      zap: g._zap2
    });
    var dentro = !!g.brazosDentro;
    var dl = f.delt;
    var cDelt = colorDe(props, 'delt'),
      cDeltT = colorDe(props, 'delto');
    // medio deltoides de adelante: el lado del biceps (n) del eje del brazo
    var J = g.hombro;
    var semi = 'M ' + [suma(J, por(dl.u, -140)), suma(J, por(dl.u, 220)), suma(suma(J, por(dl.u, 220)), por(dl.n, 160)), suma(suma(J, por(dl.u, -140)), por(dl.n, 160))].map(pt).join(' L ') + ' Z';
    var divDelt = 'M ' + pt(suma(J, suma(por(dl.u, -44), por(dl.n, -4)))) + ' Q ' + pt(suma(J, suma(por(dl.u, dl.lp * 0.4), por(dl.n, 10)))) + ' ' + pt(suma(J, por(dl.u, dl.lp * 0.92)));
    var fa = f.faja;
    var encima = !!g.cabezaEncima;
    var cabeza = /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: f.cabeza,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: f.ojo[0],
      cy: f.ojo[1],
      r: 8,
      fill: INK
    }), /*#__PURE__*/React.createElement("path", {
      d: f.oreja,
      fill: "none",
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }));
    return /*#__PURE__*/React.createElement("svg", {
      width: PW * s,
      height: PH * s,
      viewBox: '0 0 ' + PW + ' ' + PH,
      style: Object.assign({
        display: 'block',
        overflow: 'visible'
      }, props.style || {})
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: ids.t
    }, /*#__PURE__*/React.createElement("path", {
      d: f.torso
    })), /*#__PURE__*/React.createElement("clipPath", {
      id: ids.c
    }, /*#__PURE__*/React.createElement("path", {
      d: f.short
    }), /*#__PURE__*/React.createElement("path", {
      d: f.muslo
    })), /*#__PURE__*/React.createElement("clipPath", {
      id: ids.m
    }, /*#__PURE__*/React.createElement("path", {
      d: f.muslo
    })), /*#__PURE__*/React.createElement("clipPath", {
      id: ids.p
    }, /*#__PURE__*/React.createElement("path", {
      d: f.pierna
    })), /*#__PURE__*/React.createElement("clipPath", {
      id: ids.b
    }, /*#__PURE__*/React.createElement("path", {
      d: f.brazo
    })), /*#__PURE__*/React.createElement("clipPath", {
      id: ids.a
    }, /*#__PURE__*/React.createElement("path", {
      d: f.ante
    })), /*#__PURE__*/React.createElement("clipPath", {
      id: ids.d
    }, /*#__PURE__*/React.createElement("path", {
      d: semi
    })), hayPierna ? /*#__PURE__*/React.createElement("mask", {
      id: ids.s,
      maskUnits: "userSpaceOnUse",
      x: -PW,
      y: -PH,
      width: PW * 3,
      height: PH * 3
    }, /*#__PURE__*/React.createElement("rect", {
      x: -PW,
      y: -PH,
      width: PW * 3,
      height: PH * 3,
      fill: "#fff"
    }), /*#__PURE__*/React.createElement("g", {
      fill: "#000"
    }, /*#__PURE__*/React.createElement("path", {
      d: f.short
    }), /*#__PURE__*/React.createElement("path", {
      d: f.manga2
    }), /*#__PURE__*/React.createElement("path", {
      d: f.manga
    }))) : null), fondo, dentro ? null : brazoLejos, piernaLejos, dentro ? brazoLejos : null, medio, /*#__PURE__*/React.createElement(Pierna, {
      cadera: g.cadera,
      rodilla: g.rodilla,
      tobillo: g.tobillo,
      zap: g._zap
    }), ['trazo', 'relleno'].map(function (paso) {
      var t = paso === 'trazo';
      return /*#__PURE__*/React.createElement("g", {
        key: paso,
        fill: GRY,
        stroke: t ? INK : 'none',
        strokeWidth: t ? 28 : 0,
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: f.short
      }), /*#__PURE__*/React.createElement("path", {
        d: f.manga2
      }), /*#__PURE__*/React.createElement("path", {
        d: f.manga
      }));
    }), /*#__PURE__*/React.createElement("path", {
      d: f.torso,
      fill: BLANCO,
      stroke: "none"
    }), capaMusculos(props, g, 'torso', ids), /*#__PURE__*/React.createElement("path", {
      d: f.torso,
      fill: "none",
      stroke: INK,
      strokeWidth: 15,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: fa.c[0] - fa.ancho / 2,
      y: fa.c[1] - fa.alto / 2,
      width: fa.ancho,
      height: fa.alto,
      rx: 12,
      fill: GRY,
      stroke: INK,
      strokeWidth: 13,
      transform: 'rotate(' + fa.ang.toFixed(2) + ' ' + pt(fa.c) + ')'
    }), capaMusculos(props, g, 'pierna', ids), hayPierna ? /*#__PURE__*/React.createElement("g", {
      mask: 'url(#' + ids.s + ')',
      fill: "none",
      stroke: INK,
      strokeWidth: 28,
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: f.short
    }), /*#__PURE__*/React.createElement("path", {
      d: f.manga2
    }), /*#__PURE__*/React.createElement("path", {
      d: f.manga
    })) : null, encima ? null : cabeza, enMano, /*#__PURE__*/React.createElement(Brazo, {
      S: g.hombro,
      E: g.codo,
      H: g.mano
    }), capaMusculos(props, g, 'brazo', ids), /*#__PURE__*/React.createElement("path", {
      d: dl.d,
      fill: BLANCO,
      stroke: "none"
    }), cDeltT ? /*#__PURE__*/React.createElement("path", {
      d: dl.d,
      fill: cDeltT[0],
      opacity: cDeltT[1]
    }) : null, cDelt ? /*#__PURE__*/React.createElement("g", {
      opacity: cDelt[1]
    }, /*#__PURE__*/React.createElement("path", {
      d: dl.d,
      fill: cDelt[0],
      clipPath: 'url(#' + ids.d + ')'
    }), /*#__PURE__*/React.createElement("path", {
      d: divDelt,
      fill: "none",
      stroke: INK,
      strokeWidth: 11,
      strokeLinecap: "round"
    })) : null, /*#__PURE__*/React.createElement("path", {
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
    }), encima ? cabeza : null, hijos);
  }

  /* =========================================================
     constructores de pose (funciones puras -> pose)
     ========================================================= */

  function hombroDe(cad, cue, k) {
    var col = columna(cad, cue, k);
    return col.en(1 - MED.cuelloHombro / col.L, -MED.hombroAtras);
  }
  function pieDesde(tob, angPierna, extra) {
    // angulo de la punta = el de la pierna (tobillo <- rodilla) + 74 en neutro
    return suma(tob, polar(angPierna + (extra == null ? 74 : extra), MED.pie));
  }
  function esPunto(v) {
    return Array.isArray(v) && v.length === 2 && typeof v[0] === 'number';
  }
  function mapaPuntos(pose, f) {
    if (esPunto(pose)) return f(pose);
    if (Array.isArray(pose)) return pose.map(function (v) {
      return mapaPuntos(v, f);
    });
    if (pose && typeof pose === 'object') {
      var r = {};
      Object.keys(pose).forEach(function (k) {
        r[k] = mapaPuntos(pose[k], f);
      });
      return r;
    }
    return pose;
  }
  // traslada una pose (todos los puntos, tambien los de mancuerna, banco, barra, pegado)
  function mover(pose, d) {
    var r = mapaPuntos(pose, function (p) {
      return suma(p, d);
    });
    if (pose.piso != null) r.piso = pose.piso + d[1];
    if (pose.banco) r.banco = {
      y: pose.banco.y + d[1],
      x0: pose.banco.x0 + d[0],
      x1: pose.banco.x1 + d[0]
    };
    if (pose.pegado) r.pegado = Object.assign({}, pose.pegado, {
      y: pose.pegado.y + d[1]
    });
    return r;
  }
  // gira todos los puntos alrededor de c (grados, + horario en pantalla)
  function girar(pose, c, deg) {
    return mapaPuntos(pose, function (p) {
      return suma(c, rotar(resta(p, c), deg));
    });
  }
  // punto mas bajo de la espalda + short + cabeza en la direccion dir (para apoyar el cuerpo)
  function apoyo(cad, cue, k, cabeza, dir) {
    var col = columna(cad, cue, k);
    var mx = -1e9;
    for (var t = 0.14; t <= 1.0001; t += 0.02) {
      mx = Math.max(mx, dot(col.en(t, -tabla(ANCHO_ESPALDA, t)), dir));
    }
    var u0 = col.tan(0),
      n0 = col.nrm(0);
    SHORT.forEach(function (q) {
      mx = Math.max(mx, dot(suma(suma(cad, por(u0, q[0])), por(n0, q[1])), dir));
    });
    var ang = angulo(col.tan(1)) + 90;
    var q = suma(CAB.pivote, rotar(resta(CAB.nuca, CAB.pivote), -(cabeza || 0)));
    mx = Math.max(mx, dot(suma(cue, rotar(q, ang)), dir));
    return mx;
  }
  var posePerfil = {
    // 1. parado, brazos colgando. x = cadera, brazo = grados (+ adelante)
    depie: function (o) {
      o = o || {};
      var x = o.x == null ? 700 : o.x,
        piso = o.piso == null ? PISO : o.piso;
      var tob = [x + 14, piso - MED.tobillo];
      var cad = [x, tob[1] - 538];
      var cue = [x - 6, cad[1] - MED.columna];
      var hom = hombroDe(cad, cue, 0);
      // brazo colgando apenas por detras del eje: deja ver el frente del
      // tronco y del muslo (abdominales, cuadriceps) sin parecer forzado
      // brazo: grados respecto de la vertical (+ adelante, - atras)
      var br = o.brazo == null ? -3 : o.brazo;
      var codo = suma(hom, polar(90 + br, MED.brazo));
      var mano = suma(codo, polar(95 + br + Math.max(0, br) * 0.15, MED.ante));
      var tob2 = [x + 48, piso - MED.tobillo];
      return {
        cadera: cad,
        cuello: cue,
        curva: 0,
        cabeza: 0,
        codo: codo,
        mano: mano,
        rodilla: ik(cad, tob, MED.muslo, MED.pierna, -1),
        tobillo: tob,
        punta: suma(tob, ZAP_PUNTA),
        rodilla2: ik(cad, tob2, MED.muslo, MED.pierna, -1),
        tobillo2: tob2,
        punta2: suma(tob2, ZAP_PUNTA),
        piso: piso
      };
    },
    // 2. sentadilla sumo de perfil. x = tobillo (los pies no se mueven)
    sentadilla: function (o) {
      o = o || {};
      var x = o.x == null ? 640 : o.x,
        piso = o.piso == null ? PISO : o.piso;
      var k = clamp(o.curva || 0, 0, 1);
      function armar(p) {
        var tob = [x, piso - MED.tobillo];
        var fi = lerp(2, 17, p);
        var rod = suma(tob, polar(-90 - fi, MED.pierna));
        // sumo: los muslos se abren hacia los costados -> de perfil se ven mas cortos
        var lm = lerp(MED.muslo, 226, suave(p));
        var cad = suma(rod, polar(lerp(-87, -3, p), lm));
        var lean = lerp(3, 26, p) + k * lerp(4, 12, p);
        var cue = suma(cad, polar(-90 - lean, MED.columna * (1 - 0.05 * k)));
        var curva = k * lerp(0.35, 1, p);
        var hom = hombroDe(cad, cue, curva);
        var codo = suma(hom, polar(92, MED.brazo));
        var mano = suma(codo, polar(92, MED.ante));
        return {
          tob: tob,
          rod: rod,
          cad: cad,
          cue: cue,
          curva: curva,
          hom: hom,
          codo: codo,
          mano: mano,
          lm: lm
        };
      }
      var p = clamp(o.prof || 0, 0, 1);
      var a = armar(p);
      var tob2 = [x + 34, piso - MED.tobillo];
      var rod2 = ik(a.cad, tob2, a.lm, MED.pierna, -1);
      var pose = {
        cadera: a.cad,
        cuello: a.cue,
        curva: a.curva,
        // la mirada queda al frente aunque el tronco se incline; con la espalda
        // redondeada la cabeza cae
        cabeza: lerp(0, -16, p) * (1 - k) + k * lerp(-4, -10, p),
        hombro: a.hom,
        codo: a.codo,
        mano: a.mano,
        codo2: suma(a.codo, [12, -8]),
        mano2: suma(a.mano, [6, -4]),
        rodilla: a.rod,
        tobillo: a.tob,
        punta: suma(a.tob, ZAP_PUNTA),
        rodilla2: rod2,
        tobillo2: tob2,
        punta2: suma(tob2, ZAP_PUNTA),
        brazosDentro: true,
        piso: piso
      };
      if (o.pesa) {
        // una mancuerna vertical colgando de las dos manos; el largo hace que
        // en el fondo (prof 1) el centro de la cabeza de abajo quede a 40 del piso
        var fondo1 = armar(1).mano;
        var agarre = lerpP(a.mano, pose.mano2, 0.5);
        var lg = clamp(piso - 40 - fondo1[1], 100, 320);
        pose.mancuerna = {
          agarre: agarre,
          eje: [0, 1],
          largo: lg,
          arriba: suma(agarre, [0, -6]),
          abajo: suma(agarre, [0, lg])
        };
      }
      return pose;
    },
    // 3. boca arriba en el piso, cabeza a la derecha. x = cadera
    acostado: function (o) {
      o = o || {};
      var x = o.x == null ? 640 : o.x,
        piso = o.piso == null ? PISO : o.piso;
      var pr = clamp(o.piernas || 0, 0, 90),
        rd = clamp(o.rodilla || 0, 0, 1),
        ar = clamp(o.arco || 0, 0, 1);
      var curva = lerp(0.15, -0.85, suave(ar));
      var cabeza = -10;
      var cad = [x, piso - 100],
        cue = [x + MED.columna, piso - 92];
      var dy = piso - apoyo(cad, cue, curva, cabeza, [0, 1]);
      cad = suma(cad, [0, dy]);
      cue = suma(cue, [0, dy]);
      var col = columna(cad, cue, curva);
      var hom = hombroDe(cad, cue, curva);
      // brazo a lo largo del cuerpo, apoyado sobre la mitad de adelante del
      // tronco (un poco abierto hacia la camara): asi no tapa la zona lumbar y
      // el hueco con el piso se ve. La mano queda junto al gluteo.
      // brazo cercano: apoyado en el piso, del lado de la camara. Con la camara
      // apenas elevada lo que esta mas cerca queda mas abajo en pantalla: el
      // brazo baja del hombro y corre por delante del piso, asi no tapa ni los
      // abdominales ni la zona lumbar (el hueco con el piso se ve).
      var mano = [cad[0] - 24, piso + 20];
      var codo = [lerp(mano[0], hom[0], 0.5) + 14, piso + 32];
      // brazo lejano: escondido detras del tronco
      var codo2 = col.en(0.36, 16),
        mano2 = col.en(-0.1, -6);
      // piernas: e = elevacion del muslo; con rodilla el muslo sube un poco mas
      // y la pierna cae (la rodilla apunta al techo)
      var hip = cad;
      var th0 = -Math.asin(clamp((piso - 34 - hip[1]) / (MED.muslo + MED.pierna), -1, 1)) / GRAD;
      var th = lerp(th0, 90, pr / 90) + rd * 22;
      var flex = rd * 78;
      var rod, tob, angP;
      for (var i = 0; i < 140; i++) {
        rod = suma(hip, polar(180 + th, MED.muslo));
        angP = 180 + th - flex;
        tob = suma(rod, polar(angP, MED.pierna));
        if (tob[1] <= piso - 34 || th >= 110) break;
        th += 1;
      }
      var pun = pieDesde(tob, angP, 62);
      // pierna lejana: asoma arriba (en pantalla) y hacia la cabeza
      var lj = [30, -30];
      return {
        cadera: cad,
        cuello: cue,
        curva: curva,
        cabeza: cabeza,
        hombro: hom,
        codo: codo,
        mano: mano,
        hombro2: suma(hom, [10, -12]),
        codo2: codo2,
        mano2: mano2,
        rodilla: rod,
        tobillo: tob,
        punta: pun,
        rodilla2: suma(rod, lj),
        tobillo2: suma(tob, lj),
        punta2: suma(pun, lj),
        piso: piso,
        pegado: {
          y: piso,
          lumbar: 1 - suave(ar),
          alto: 1
        }
      };
    },
    // 4. boca arriba en banco plano. x = cadera, y = cara de arriba del banco
    banco: function (o) {
      o = o || {};
      var x = o.x == null ? 560 : o.x,
        piso = o.piso == null ? PISO : o.piso;
      var y = o.y == null ? piso - 290 : o.y;
      var p = clamp(o.p || 0, 0, 1);
      var curva = 0.12,
        cabeza = -10;
      var cad = [x, y - 100],
        cue = [x + MED.columna, y - 92];
      var dy = y - apoyo(cad, cue, curva, cabeza, [0, 1]);
      cad = suma(cad, [0, dy]);
      cue = suma(cue, [0, dy]);
      var col = columna(cad, cue, curva);
      var hom = hombroDe(cad, cue, curva);
      var u = col.tan(0.84),
        n = col.nrm(0.84);
      // brazo: phi = elevacion sobre el plano del banco (-30: codo por debajo
      // del banco; 84: vertical), alfa = angulo del brazo con el costado hacia
      // los pies (45: codos a 45 grados del torso). De perfil se ve la proyeccion.
      var e = suave(p);
      var phi = lerp(-30, 84, e) * GRAD,
        alfa = lerp(45, 10, e) * GRAD;
      var ua = [-Math.cos(phi) * Math.sin(alfa) - 0.06 * e, Math.sin(phi)];
      var fa = unidad([lerp(0.04, 0.12, e), 0.99]); // antebrazo vertical; arriba, codo apenas flexionado
      var en2 = function (v, l) {
        return suma(por(u, v[0] * l), por(n, v[1] * l));
      };
      var codo = suma(hom, en2(ua, MED.brazo));
      var mano = suma(codo, en2(fa, MED.ante));
      // piernas: rodillas a ~90 grados, pies apoyados en el piso
      var tob = [cad[0] - 236, piso - MED.tobillo];
      var rod = ik(cad, tob, MED.muslo, MED.pierna, -1);
      var tob2 = suma(tob, [34, -2]);
      var rod2 = ik(cad, tob2, MED.muslo, MED.pierna, -1);
      return {
        cadera: cad,
        cuello: cue,
        curva: curva,
        cabeza: cabeza,
        hombro: hom,
        codo: codo,
        mano: mano,
        hombro2: suma(hom, [14, -10]),
        codo2: suma(codo, [14, -10]),
        mano2: suma(mano, [14, -10]),
        rodilla: rod,
        tobillo: tob,
        punta: suma(tob, ZAP_PUNTA),
        rodilla2: rod2,
        tobillo2: tob2,
        punta2: suma(tob2, ZAP_PUNTA),
        piso: piso,
        banco: {
          y: y,
          x0: cad[0] - 150,
          x1: cue[0] + 190
        }
      };
    },
    // 5. colgado de una barra (dominadas), visto de costado
    colgado: function (o) {
      o = o || {};
      var barra = o.barra || [o.x == null ? 700 : o.x, 200];
      var sb = clamp(o.sube || 0, 0, 1),
        rd = clamp(o.rodillas || 0, 0, 1);
      var bal = o.balanceo || 0;
      var e = suave(sb);
      var mano = barra;
      // hombro respecto de la barra. Abajo el brazo casi vertical (la cabeza se
      // dibuja encima del brazo para que la cara se vea); a mitad de camino el
      // antebrazo sube vertical delante de la cara; arriba el pecho llega a la
      // barra y la barra queda bajo el menton.
      var hom = suma(barra, [tabla([[0, -40], [0.5, 132], [1, 116]], e), lerp(444, 46, e)]);
      // el brazo se abre hacia los costados al subir: de perfil se ve mas corto
      var l1 = MED.brazo * tabla([[0, 1], [0.5, 0.45], [1, 0.76]], e);
      var l2 = MED.ante * lerp(1, 0.97, e);
      var codo = ik(hom, mano, l1, l2, 1);
      // tronco: abajo casi vertical; arriba se echa atras (cadera adelante)
      var fi = lerp(2, 5, e);
      var dn = polar(90 + fi, 1);
      // colgado abajo los hombros suben hasta las orejas: el cuello queda un poco
      // por delante del hombro y el brazo sube por detras de la cabeza
      var cue = suma(suma(hom, por(dn, -(MED.cuelloHombro - 22 * (1 - e)))), por(rotar(dn, 90), 30 * (1 - e)));
      var cad = suma(cue, por(dn, MED.columna));
      var thA = 90 + fi + 6 + rd * 34;
      var rod = suma(cad, polar(thA, MED.muslo));
      var shA = thA - rd * 100;
      var tob = suma(rod, polar(shA, MED.pierna));
      var pun = pieDesde(tob, shA, 52);
      // pierna lejana: con rodillas los tobillos se cruzan (el pie lejano pasa adelante)
      var cruz = lerpP([30, -10], [-44, 6], rd);
      var pose = {
        cadera: cad,
        cuello: cue,
        curva: -0.1 * e,
        cabeza: lerp(-16, -14, e),
        hombro: hom,
        codo: codo,
        mano: mano,
        hombro2: suma(hom, [18, -8]),
        codo2: suma(codo, [18, -8]),
        mano2: suma(mano, [6, -2]),
        rodilla: rod,
        tobillo: tob,
        punta: pun,
        rodilla2: suma(rod, lerpP([30, -10], [10, -8], rd)),
        tobillo2: suma(tob, cruz),
        punta2: suma(pun, cruz),
        barra: barra,
        cabezaEncima: true
      };
      // el cuerpo cuelga con el centro de masa bajo la barra; balanceo lo saca de ahi
      var cm = suma(suma(por(cad, 0.4), por(lerpP(cue, cad, 0.3), 0.3)), suma(por(rod, 0.18), por(tob, 0.12)));
      // (correccion parcial: de perfil un cuerpo mas vertical se lee mejor)
      var giro = 0.5 * (90 - angulo(resta(cm, barra))) + bal;
      return Object.assign(girar(pose, barra, giro), {
        barra: barra
      });
    },
    // mezcla dos poses: t 0 -> a, 1 -> b (puntos y numeros se interpolan)
    mezclar: function mezclar(a, b, t) {
      if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, t);
      if (esPunto(a) && esPunto(b)) return lerpP(a, b, t);
      if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a)) {
        var r = {};
        Object.keys(a).forEach(function (k) {
          r[k] = k in b ? mezclar(a[k], b[k], t) : a[k];
        });
        Object.keys(b).forEach(function (k) {
          if (!(k in a)) r[k] = b[k];
        });
        return r;
      }
      return t < 0.5 ? a : b;
    },
    mover: mover,
    girar: girar
  };
  Object.assign(B, {
    Perfil: Perfil,
    geoPerfil: geoPerfil,
    posePerfil: posePerfil,
    ik: ik,
    PERFIL: {
      W: PW,
      H: PH,
      PISO: PISO,
      medidas: MED
    }
  });
})(window);
