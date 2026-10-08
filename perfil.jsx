/* ============================================================
   PERFIL — B.Perfil: figura humana de perfil, articulada
   Misma familia que B.Estacion (misma cabeza, mismos grosores,
   mismo truco de union en los miembros) pero armada sobre puntos:
   sirve parada, inclinada, acostada o colgada.

   Mira hacia la IZQUIERDA: -x es el frente. viewBox 1400x1400.

   B.Perfil({ s, pose, musc, muscGris, muscRojo, fondo, medio, children })
   B.posePerfil.depie / sentadilla / acostado / banco / colgado
   B.geoPerfil(props)   la misma geometria que recibe children(g)
   B.ik(a, b, l1, l2, lado)
   B.PERFIL             medidas (largos de segmentos, viewBox, piso)
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var B = global.B;
  var U = B.util;
  var P = global.P;
  var clamp = global.clamp;

  var INK = P.C.INK, YEL = P.C.YEL, RED = P.C.RED, GRY = P.C.GRY;
  var BLANCO = '#ffffff';
  var GRAD = Math.PI / 180;

  var lerp = U.lerp, lerpP = U.lerpP, suma = U.suma, resta = U.resta, por = U.por,
    largo = U.largo, unidad = U.unidad, polar = U.polar, pt = U.pt, capsula = U.capsula,
    blando = U.blando;

  var PW = 1400, PH = 1400, PISO = 1300;
  // largos de cada segmento (iguales a B.Estacion)
  var MED = {
    muslo: 272, pierna: 268, brazo: 232, ante: 214, columna: 404,
    cuelloHombro: 66, hombroAtras: -2, tobillo: 32, pie: 116.5
  };
  // radios de las capsulas: [en la articulacion de arriba, en la de abajo]
  var R_MUSLO = [66, 46], R_PIERNA = [46, 30], R_BRAZO = [50, 40], R_ANTE = [38, 30], R_PUNO = 36;

  /* ---------------- ayudas privadas ---------------- */

  function rotar(v, deg) {
    var c = Math.cos(deg * GRAD), s = Math.sin(deg * GRAD);
    return [v[0] * c - v[1] * s, v[0] * s + v[1] * c];
  }
  function angulo(v) { return Math.atan2(v[1], v[0]) / GRAD; }
  function suave(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  // normal "de frente" de un eje que sube por el cuerpo (cadera -> cuello)
  function frenteDe(u) { return [u[1], -u[0]]; }
  // normal del lado que flexiona en un segmento que baja (hombro -> codo, cadera -> rodilla)
  function flexDe(u) { return [-u[1], u[0]]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1]; }
  function lerp3(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
  function unidad3(v) { var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }

  // Catmull-Rom -> Bezier. tramo() devuelve solo los ' C ...' (sin el M inicial)
  function tramo(pts, cerrada) {
    var n = pts.length, d = '';
    var segs = cerrada ? n : n - 1;
    for (var i = 0; i < segs; i++) {
      var p0 = pts[cerrada ? (i - 1 + n) % n : Math.max(i - 1, 0)];
      var p1 = pts[i], p2 = pts[(i + 1) % n];
      var p3 = pts[cerrada ? (i + 2) % n : Math.min(i + 2, n - 1)];
      var c1 = suma(p1, por(resta(p2, p0), 1 / 6));
      var c2 = resta(p2, por(resta(p3, p1), 1 / 6));
      d += ' C ' + pt(c1) + ' ' + pt(c2) + ' ' + pt(p2);
    }
    return d;
  }
  function suaveAbierta(pts) { return 'M ' + pt(pts[0]) + tramo(pts, false); }
  function suaveCerrada(pts) { return 'M ' + pt(pts[0]) + tramo(pts, true) + ' Z'; }
  function poli(pts) { return 'M ' + pts.map(pt).join(' L '); }

  function tabla(T, t) {
    if (t <= T[0][0]) return T[0][1];
    for (var i = 1; i < T.length; i++) {
      if (t <= T[i][0]) {
        var a = T[i - 1], b = T[i];
        return lerp(a[1], b[1], suave((t - a[0]) / (b[0] - a[0])));
      }
    }
    return T[T.length - 1][1];
  }

  // anchos del torso respecto del eje de la columna (t: 0 cadera -> 1 cuello)
  var ANCHO_FRENTE = [[0.1, 62], [0.2, 62], [0.3, 63], [0.42, 67], [0.52, 78], [0.62, 95],
    [0.72, 104], [0.8, 101], [0.88, 86], [0.95, 62], [1.0, 38]];
  var ANCHO_ESPALDA = [[0.1, 70], [0.2, 63], [0.3, 53], [0.42, 55], [0.55, 66], [0.68, 82],
    [0.78, 89], [0.86, 83], [0.93, 62], [1.0, 30]];
  var T_TORSO = [0.135, 0.2, 0.3, 0.42, 0.52, 0.62, 0.72, 0.8, 0.88, 0.95, 1.0];
  var T_FAJA = 0.165;

  // short: bloque de cadera en el marco de la pelvis [a lo largo, hacia el frente]
  var SHORT = [[76, 56], [-58, 62], [-86, 22], [-86, -40], [-68, -84], [-6, -94], [76, -66]];

  // cabeza de perfil: el mismo path que B.Estacion, con origen en la base del cuello
  var CAB = {
    ini: [4, -188],
    segs: [
      ['C', [50, -190], [74, -154], [72, -112]],
      ['C', [70, -74], [52, -50], [32, -38]],
      ['C', [8, -28], [-28, -28], [-46, -40]],
      ['C', [-58, -48], [-60, -60], [-58, -70]],
      ['L', [-86, -90]],
      ['L', [-62, -114]],
      ['C', [-70, -146], [-48, -186], [4, -188]]
    ],
    ojo: [-36, -122],
    oreja: [[20, -118], [44, -116], [40, -98], [38, -82], [22, -84]],
    centro: [2, -108], nuca: [72, -112], menton: [-46, -40], nariz: [-86, -90], coronilla: [4, -188],
    cuelloFrente: [-28, -58], cuelloAtras: [32, -58], pivote: [0, -62]
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
    var c = resta(cue, cad), L = largo(c) || 1, uc = unidad(c), nc = frenteDe(uc);
    k = clamp(k || 0, -1, 1);
    var b1 = k >= 0 ? -k * 72 : -k * 96;
    var b2 = k >= 0 ? -k * 94 : -k * 24;
    var P0 = cad, P3 = cue;
    var P1 = suma(suma(cad, por(c, 1 / 3)), por(nc, b1));
    var P2 = suma(suma(cad, por(c, 2 / 3)), por(nc, b2));
    function bez(t) {
      var m = 1 - t, a = m * m * m, b = 3 * m * m * t, cc = 3 * m * t * t, d = t * t * t;
      return [a * P0[0] + b * P1[0] + cc * P2[0] + d * P3[0], a * P0[1] + b * P1[1] + cc * P2[1] + d * P3[1]];
    }
    function der(t) {
      var m = 1 - t;
      return [3 * m * m * (P1[0] - P0[0]) + 6 * m * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]),
        3 * m * m * (P1[1] - P0[1]) + 6 * m * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1])];
    }
    function tan(t) { return unidad(der(clamp(t, 0, 1))); }
    function punto(t) {
      if (t < 0) return suma(P0, por(tan(0), t * L));
      if (t > 1) return suma(P3, por(tan(1), (t - 1) * L));
      return bez(t);
    }
    function nrm(t) { return frenteDe(tan(t)); }
    function en(t, w) { return suma(punto(t), por(nrm(t), w)); }
    return { punto: punto, tan: tan, nrm: nrm, en: en, L: L, u: uc, n: nc };
  }

  function segmento(a, b, ra, rb) {
    var d = resta(b, a), l = largo(d) || 1, u = unidad(d);
    return {
      a: a, b: b, u: u, n: flexDe(u), largo: l, ra: ra, rb: rb,
      r: function (s) { return lerp(ra, rb, clamp(s, 0, 1)); },
      en: function (s, w) { return suma(suma(a, por(u, s * l)), por(flexDe(u), w)); }
    };
  }

  /* ---------------- geometria ---------------- */

  function geoPerfil(props) {
    props = props || {};
    var o = props.pose || posePerfil.depie({});
    var cad = o.cadera, cue = o.cuello;
    var k = clamp(o.curva || 0, -1, 1);
    var col = columna(cad, cue, k);
    var L = col.L;
    var uTop = col.tan(1), nTop = col.nrm(1);
    var u0 = col.tan(0), n0 = col.nrm(0);
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
    var lejosP = suma(por(nTop, -18), por(uTop, 6));
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

    function pelvis(al, w) { return suma(suma(cad, por(u0, al)), por(n0, w)); }
    function anchoFrente(t) { return tabla(ANCHO_FRENTE, t); }
    function anchoEspalda(t) { return tabla(ANCHO_ESPALDA, t); }
    function torso(t, w) { return col.en(t, w); }

    function zapato(tob, pun) {
      var giro = angulo(resta(pun, tob)) - ZAP_ANG;
      return ZAP.map(function (q) { return suma(tob, rotar(q, giro)); });
    }
    var zap = zapato(tobillo, punta), zap2 = zapato(tobillo2, punta2);

    var ejes = {
      tronco: { o: cad, u: col.u, n: col.n, largo: L },
      pelvis: { o: cad, u: u0, n: n0 },
      pecho: { o: col.punto(0.72), u: col.tan(0.72), n: col.nrm(0.72) },
      cuello: { o: cue, u: uTop, n: nTop },
      cabeza: { o: cab(CAB.centro), u: uCab, n: frenteDe(uCab) },
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

    var g = Object.assign({}, o, {
      W: PW, H: PH,
      cadera: cad, cuello: cue, curva: k, cabeza: cabeza,
      hombro: hombro, codo: codo, mano: mano, hombro2: hombro2, codo2: codo2, mano2: mano2,
      rodilla: rodilla, tobillo: tobillo, punta: punta, rodilla2: rodilla2, tobillo2: tobillo2, punta2: punta2,
      talon: zap[0], talon2: zap2[0],
      hombros: [hombro, hombro2], codos: [codo, codo2], manos: [mano, mano2],
      rodillas: [rodilla, rodilla2], tobillos: [tobillo, tobillo2], puntas: [punta, punta2],
      centroCabeza: cab(CAB.centro), coronilla: cab(CAB.coronilla), nuca: cab(CAB.nuca),
      menton: cab(CAB.menton), nariz: cab(CAB.nariz), ojo: cab(CAB.ojo),
      frentePecho: torso(0.72, anchoFrente(0.72)),
      espaldaAlta: torso(0.78, -anchoEspalda(0.78)),
      lumbar: torso(0.3, -anchoEspalda(0.3)),
      panza: torso(0.32, anchoFrente(0.32)),
      gluteo: pelvis(-6, -94),
      axila: axila,
      columna: col.punto, torso: torso, pelvis: pelvis, anchoFrente: anchoFrente, anchoEspalda: anchoEspalda,
      ejes: ejes,
      _col: col, _cab: cab, _zap: zap, _zap2: zap2, _sube: sube
    });
    return g;
  }

  /* ---------------- formas ---------------- */

  function manga(cad, rod, frac, ra, rb) {
    var u = unidad(resta(rod, cad));
    var n = [-u[1], u[0]];
    var ruedo = lerpP(cad, rod, frac);
    var arriba = suma(cad, por(u, -30));
    return 'M ' + [suma(arriba, por(n, ra)), suma(ruedo, por(n, rb)), suma(ruedo, por(n, -rb)),
      suma(arriba, por(n, -ra))].map(pt).join(' L ') + ' Z';
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
        ' ' + pt(suma(J, por(u, lp * 0.75))),
      u: u, n: n, lp: lp
    };
  }

  function formas(g) {
    var col = g._col, cab = g._cab;
    var F = g.anchoFrente, Bk = g.anchoEspalda;
    var frente = T_TORSO.map(function (t) { return col.en(t, F(t)); });
    var espalda = T_TORSO.slice().reverse().map(function (t) { return col.en(t, -Bk(t)); });
    var torso = 'M ' + pt(frente[0]) + tramo(frente, false) +
      ' L ' + pt(cab(CAB.cuelloFrente)) + ' L ' + pt(cab(CAB.cuelloAtras)) +
      ' L ' + pt(espalda[0]) + tramo(espalda, false) + ' Z';

    var shortBloque = blando(SHORT.map(function (q) { return g.pelvis(q[0], q[1]); }), 0.32);

    // faja: rectangulo redondeado perpendicular al eje, a la altura T_FAJA
    var fa = T_FAJA, wf = F(fa) + 9, wb = Bk(fa) + 9;
    var cF = col.en(fa, (wf - wb) / 2);
    var nF = col.nrm(fa);
    var faja = { c: cF, ancho: wf + wb, alto: 34, ang: angulo(nF) - 180 };

    var c = CAB.segs;
    var cabeza = 'M ' + pt(cab(CAB.ini));
    c.forEach(function (s) {
      if (s[0] === 'C') cabeza += ' C ' + pt(cab(s[1])) + ' ' + pt(cab(s[2])) + ' ' + pt(cab(s[3]));
      else cabeza += ' L ' + pt(cab(s[1]));
    });
    cabeza += ' Z';
    var oj = CAB.oreja.map(cab);
    var oreja = 'M ' + pt(oj[0]) + ' Q ' + pt(oj[1]) + ' ' + pt(oj[2]) + ' Q ' + pt(oj[3]) + ' ' + pt(oj[4]);

    var lp = clamp(largo(resta(g.codo, g.hombro)) * 0.62, 58, 128);
    return {
      torso: torso, short: shortBloque, faja: faja, cabeza: cabeza, oreja: oreja,
      ojo: cab(CAB.ojo), delt: deltoide(g.hombro, g.codo, lp),
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
    var pts = interior.map(function (q) { return sg.en(q[0], signo * q[1] * sg.r(q[0])); });
    var s0 = interior[0][0], s1 = interior[interior.length - 1][0];
    var fuera = [sg.en(s1, signo * (sg.r(s1) + 70)), sg.en(s0, signo * (sg.r(s0) + 70))];
    return 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z';
  }
  function lineaMiembro(sg, pares) {
    return suaveAbierta(pares.map(function (q) { return sg.en(q[0], q[1] * sg.r(q[0])); }));
  }

  // cada musculo: { capa, clip, forma, lineas, fibras, banda }
  var MUSCULOS = {
    /* ---- tronco (clip: torso) ---- */
    abd: function (g) {
      var F = g.anchoFrente, T = g.torso;
      var ts = [0.12, 0.24, 0.38, 0.5, 0.6, 0.66];
      var ins = [[0.12, 46], [0.24, 36], [0.38, 36], [0.5, 38], [0.6, 40], [0.66, 70]];
      var pts = ins.map(function (q) { return T(q[0], F(q[0]) - q[1]); });
      var fuera = [T(0.68, F(0.68) + 60), T(0.1, F(0.1) + 60)];
      var lineas = [0.27, 0.38, 0.49].map(function (t) {
        return poli([T(t, F(t) - 37), T(t + 0.01, F(t) + 20)]);
      });
      void ts;
      return {
        capa: 'torso', clip: 't',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        lineas: lineas
      };
    },
    obl: function (g) {
      var F = g.anchoFrente, T = g.torso;
      var pts = [T(0.15, F(0.15) - 40), T(0.36, F(0.36) - 38), T(0.56, F(0.56) - 40),
        T(0.62, 10), T(0.42, -26), T(0.2, -38)];
      return {
        capa: 'torso', clip: 't',
        forma: suaveCerrada(pts),
        fibras: [poli([T(0.52, -2), T(0.36, F(0.36) - 50)]), poli([T(0.4, -20), T(0.23, F(0.23) - 48)])]
      };
    },
    erec: function (g) {
      var Bk = g.anchoEspalda, T = g.torso;
      var ins = [[0.08, 40], [0.22, 36], [0.4, 36], [0.6, 32], [0.8, 28], [0.92, 34]];
      var pts = ins.map(function (q) { return T(q[0], -(Bk(q[0]) - q[1])); });
      var fuera = [T(0.94, -(Bk(0.94) + 60)), T(0.06, -(Bk(0.06) + 60))];
      return {
        capa: 'torso', clip: 't',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        fibras: [suaveAbierta([0.14, 0.4, 0.62, 0.84].map(function (t) { return T(t, -(Bk(t) - 15)); }))]
      };
    },
    dor: function (g) {
      var Bk = g.anchoEspalda, T = g.torso;
      var A = g.axila;
      var pts = [A, T(0.42, -6), T(0.22, -Bk(0.22) + 10)];
      var fuera = [T(0.16, -(Bk(0.16) + 60)), T(0.76, -(Bk(0.76) + 60))];
      return {
        capa: 'torso', clip: 't',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        fibras: [poli([lerpP(A, T(0.3, -40), 0.12), T(0.34, -48)]),
          poli([lerpP(A, T(0.62, -70), 0.15), T(0.58, -Bk(0.58) + 14)])]
      };
    },
    pec: function (g) {
      var F = g.anchoFrente, T = g.torso;
      var tip = lerpP(g.hombro, g.codo, 0.16);
      var pts = [T(0.56, F(0.56) + 4), T(0.6, F(0.6) - 26), T(0.68, 30), tip, T(0.9, 40), T(0.93, F(0.93) - 6)];
      var fuera = [T(0.95, F(0.95) + 60), T(0.55, F(0.55) + 60)];
      return {
        capa: 'torso', clip: 't',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        fibras: [poli([T(0.66, F(0.66) - 14), lerpP(T(0.66, F(0.66) - 14), tip, 0.62)]),
          poli([T(0.82, F(0.82) - 12), lerpP(T(0.82, F(0.82) - 12), tip, 0.6)])]
      };
    },
    /* ---- cadera y pierna (clip: c = short + muslo, m = muslo, p = pierna) ---- */
    glu: function (g) {
      var PF = g.pelvis;
      var ins = [[-112, -60], [-64, -16], [6, -4], [64, -24]];
      var pts = ins.map(function (q) { return PF(q[0], q[1]); });
      var fuera = [PF(90, -170), PF(-130, -170)];
      return {
        capa: 'pierna', clip: 'c',
        forma: 'M ' + pt(pts[0]) + tramo(pts, false) + ' L ' + fuera.map(pt).join(' L ') + ' Z',
        fibras: [poli([PF(44, -54), PF(-50, -82)]), poli([PF(30, -86), PF(-24, -100)])]
      };
    },
    tfl: function (g) {
      var m = g.ejes.muslo;
      var pts = [m.en(-0.24, 0.62 * 66), m.en(-0.06, 0.98 * 66), m.en(0.2, 0.62 * m.r(0.2)),
        m.en(0.3, 0.32 * m.r(0.3)), m.en(0.12, 0.26 * m.r(0.12)), m.en(-0.1, 0.36 * 66)];
      return {
        capa: 'pierna', clip: 'c',
        forma: suaveCerrada(pts),
        fibras: [lineaMiembro(m, [[-0.12, 0.62], [0.2, 0.45]])]
      };
    },
    recto: function (g) {
      var m = g.ejes.muslo;
      return {
        capa: 'pierna', clip: 'c',
        forma: ladoMiembro(m, 1, [[-0.16, 1.4], [-0.06, 0.62], [0.2, 0.32], [0.5, 0.24], [0.78, 0.36],
          [0.9, 0.62], [0.95, 1.3]]),
        fibras: [lineaMiembro(m, [[0.04, 0.72], [0.45, 0.6], [0.82, 0.72]])]
      };
    },
    cuad: function (g) {
      var m = g.ejes.muslo;
      return {
        capa: 'pierna', clip: 'm',
        forma: ladoMiembro(m, 1, [[0.06, 1.3], [0.14, 0.4], [0.4, -0.22], [0.66, -0.2], [0.86, 0.18],
          [0.95, 1.3]]),
        lineas: [lineaMiembro(m, [[0.6, -0.08], [0.78, 0.28], [0.9, 0.62]])],
        fibras: [lineaMiembro(m, [[0.2, 0.62], [0.5, 0.52], [0.72, 0.62]])]
      };
    },
    sart: function (g) {
      var m = g.ejes.muslo;
      return {
        capa: 'pierna', clip: 'c',
        banda: lineaMiembro(m, [[-0.1, 0.78], [0.25, 0.5], [0.6, 0.02], [0.86, -0.42], [0.98, -0.5]])
      };
    },
    isq: function (g) {
      var m = g.ejes.muslo;
      return {
        capa: 'pierna', clip: 'm',
        forma: ladoMiembro(m, -1, [[0.04, 1.3], [0.14, 0.2], [0.42, -0.24], [0.7, -0.14], [0.88, 0.3],
          [0.96, 1.3]]),
        lineas: [lineaMiembro(m, [[0.64, -0.5], [0.8, -0.52], [0.97, -0.62]])],
        fibras: [lineaMiembro(m, [[0.2, -0.6], [0.5, -0.5], [0.7, -0.58]])]
      };
    },
    gem: function (g) {
      var p = g.ejes.pierna;
      return {
        capa: 'pierna', clip: 'p',
        forma: ladoMiembro(p, -1, [[-0.04, 1.3], [0.08, 0.1], [0.28, -0.24], [0.48, -0.06], [0.62, 0.5],
          [0.7, 1.3]]),
        lineas: [lineaMiembro(p, [[0.12, -0.5], [0.3, -0.42], [0.46, -0.56]])]
      };
    },
    psoas: function (g) {
      var T = g.torso, Bk = g.anchoEspalda, m = g.ejes.muslo;
      var pts = [T(0.5, -Bk(0.5) * 0.4), T(0.3, -14), T(0.12, 12), g.pelvis(-14, 36),
        m.en(0.12, 0.2 * 66), m.en(0.2, -0.05 * m.r(0.2))];
      return { capa: 'pierna', clip: null, banda: suaveAbierta(pts) };
    },
    /* ---- brazo cercano (clip: b = brazo, a = antebrazo) ---- */
    bic: function (g) {
      var b = g.ejes.brazo;
      return {
        capa: 'brazo', clip: 'b',
        forma: ladoMiembro(b, 1, [[0.16, 1.3], [0.28, 0.2], [0.52, -0.1], [0.76, 0.1], [0.88, 0.5], [0.92, 1.3]]),
        fibras: [lineaMiembro(b, [[0.34, 0.56], [0.58, 0.5], [0.8, 0.6]])]
      };
    },
    tri: function (g) {
      var b = g.ejes.brazo;
      return {
        capa: 'brazo', clip: 'b',
        forma: ladoMiembro(b, -1, [[0.04, 1.3], [0.16, 0.1], [0.46, -0.16], [0.72, 0.0], [0.88, 0.4], [0.94, 1.3]]),
        lineas: [lineaMiembro(b, [[0.6, -0.55], [0.74, -0.42], [0.88, -0.55]])],
        fibras: [lineaMiembro(b, [[0.2, -0.56], [0.42, -0.54]])]
      };
    },
    ante: function (g) {
      var a = g.ejes.antebrazo;
      var r = function (s) { return a.r(s) + 70; };
      return {
        capa: 'brazo', clip: 'a',
        forma: 'M ' + pt(a.en(-0.2, -r(0))) + ' L ' + pt(a.en(0.5, -r(0.5))) +
          ' Q ' + pt(a.en(0.74, 0)) + ' ' + pt(a.en(0.5, r(0.5))) + ' L ' + pt(a.en(-0.2, r(0))) + ' Z',
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
    var r = (props.muscRojo || {})[k], y = (props.musc || {})[k], gr = (props.muscGris || {})[k];
    if (r > 0.01) return [RED, clamp(r, 0, 1)];
    if (y > 0.01) return [YEL, clamp(y, 0, 1)];
    if (gr > 0.01) return [GRY, clamp(gr, 0, 1)];
    return null;
  }

  function Musculo(props) {
    var m = props.m, color = props.color, clip = props.clip;
    var fibra = color === GRY ? null : GRY;
    return (
      <g opacity={props.v} clipPath={clip ? 'url(#' + clip + ')' : undefined}>
        {m.forma ? <path d={m.forma} fill={color} stroke="none" /> : null}
        {fibra && m.fibras ? m.fibras.map(function (d, i) {
          return <path key={'f' + i} d={d} fill="none" stroke={fibra} strokeWidth={11} strokeLinecap="round" />;
        }) : null}
        {m.lineas ? m.lineas.map(function (d, i) {
          return <path key={'l' + i} d={d} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />;
        }) : null}
        {m.forma ? <path d={m.forma} fill="none" stroke={INK} strokeWidth={11} strokeLinejoin="round" /> : null}
        {m.banda ? <path d={m.banda} fill="none" stroke={INK} strokeWidth={38} strokeLinecap="round"
          strokeLinejoin="round" /> : null}
        {m.banda ? <path d={m.banda} fill="none" stroke={color} strokeWidth={16} strokeLinecap="round"
          strokeLinejoin="round" /> : null}
      </g>
    );
  }

  function capaMusculos(props, g, capa, ids) {
    return ORDEN_MUSC[capa].map(function (k) {
      var c = colorDe(props, k);
      if (!c) return null;
      var m = MUSCULOS[k](g);
      return <Musculo key={k} m={m} color={c[0]} v={c[1]} clip={m.clip ? ids[m.clip] : null} />;
    });
  }

  /* ---------------- piezas ---------------- */

  function Pierna(props) {
    var cad = props.cadera, rod = props.rodilla, tob = props.tobillo;
    return (
      <g>
        <g fill={BLANCO} stroke={INK} strokeWidth={30} strokeLinejoin="round">
          <path d={capsula(cad, rod, R_MUSLO[0], R_MUSLO[1])} />
          <path d={capsula(rod, tob, R_PIERNA[0], R_PIERNA[1])} />
        </g>
        <g fill={BLANCO} stroke="none">
          <path d={capsula(cad, rod, R_MUSLO[0], R_MUSLO[1])} />
          <path d={capsula(rod, tob, R_PIERNA[0], R_PIERNA[1])} />
        </g>
        <path d={blando(props.zap, 0.35)} fill={BLANCO} stroke={INK} strokeWidth={14} strokeLinejoin="round" />
      </g>
    );
  }

  function Brazo(props) {
    var S = props.S, E = props.E, H = props.H;
    return (
      <g>
        <g fill={BLANCO} stroke={INK} strokeWidth={30} strokeLinejoin="round">
          <path d={capsula(S, E, R_BRAZO[0], R_BRAZO[1])} />
          <path d={capsula(E, H, R_ANTE[0], R_ANTE[1])} />
          <circle cx={H[0]} cy={H[1]} r={R_PUNO} />
        </g>
        <g fill={BLANCO} stroke="none">
          <path d={capsula(S, E, R_BRAZO[0], R_BRAZO[1])} />
          <path d={capsula(E, H, R_ANTE[0], R_ANTE[1])} />
          <circle cx={H[0]} cy={H[1]} r={R_PUNO} />
        </g>
      </g>
    );
  }

  function Perfil(props) {
    var s = props.s == null ? 1 : props.s;
    var g = geoPerfil(props);
    var f = formas(g);
    var id = U.useIdLocal('perf');
    var ids = { t: id + 't', c: id + 'c', m: id + 'm', p: id + 'p', b: id + 'b', a: id + 'a', d: id + 'd' };

    var fondo = typeof props.fondo === 'function' ? props.fondo(g) : props.fondo;
    var medio = typeof props.medio === 'function' ? props.medio(g) : props.medio;
    var enMano = typeof props.enMano === 'function' ? props.enMano(g) : props.enMano;
    var hijos = typeof props.children === 'function' ? props.children(g) : props.children;

    var brazoLejos = <Brazo S={g.hombro2} E={g.codo2} H={g.mano2} />;
    var piernaLejos = <Pierna cadera={g.cadera} rodilla={g.rodilla2} tobillo={g.tobillo2} zap={g._zap2} />;
    var dentro = !!g.brazosDentro;

    var dl = f.delt;
    var cDelt = colorDe(props, 'delt'), cDeltT = colorDe(props, 'delto');
    // medio deltoides de adelante: el lado del biceps (n) del eje del brazo
    var J = g.hombro;
    var semi = 'M ' + [suma(J, por(dl.u, -140)), suma(J, por(dl.u, 220)),
      suma(suma(J, por(dl.u, 220)), por(dl.n, 160)), suma(suma(J, por(dl.u, -140)), por(dl.n, 160))]
      .map(pt).join(' L ') + ' Z';
    var divDelt = 'M ' + pt(suma(J, suma(por(dl.u, -44), por(dl.n, -4)))) + ' Q ' +
      pt(suma(J, suma(por(dl.u, dl.lp * 0.4), por(dl.n, 10)))) + ' ' + pt(suma(J, por(dl.u, dl.lp * 0.92)));

    var fa = f.faja;

    return (
      <svg width={PW * s} height={PH * s} viewBox={'0 0 ' + PW + ' ' + PH}
        style={Object.assign({ display: 'block', overflow: 'visible' }, props.style || {})}>
        <defs>
          <clipPath id={ids.t}><path d={f.torso} /></clipPath>
          <clipPath id={ids.c}><path d={f.short} /><path d={f.muslo} /></clipPath>
          <clipPath id={ids.m}><path d={f.muslo} /></clipPath>
          <clipPath id={ids.p}><path d={f.pierna} /></clipPath>
          <clipPath id={ids.b}><path d={f.brazo} /></clipPath>
          <clipPath id={ids.a}><path d={f.ante} /></clipPath>
          <clipPath id={ids.d}><path d={semi} /></clipPath>
        </defs>

        {fondo}

        {dentro ? null : brazoLejos}
        {piernaLejos}
        {dentro ? brazoLejos : null}
        {medio}
        <Pierna cadera={g.cadera} rodilla={g.rodilla} tobillo={g.tobillo} zap={g._zap} />

        {/* short: cadera + las dos mangas, como una sola silueta */}
        {['trazo', 'relleno'].map(function (paso) {
          var t = paso === 'trazo';
          return (
            <g key={paso} fill={GRY} stroke={t ? INK : 'none'} strokeWidth={t ? 28 : 0} strokeLinejoin="round">
              <path d={f.short} />
              <path d={f.manga2} />
              <path d={f.manga} />
            </g>
          );
        })}

        {/* torso */}
        <path d={f.torso} fill={BLANCO} stroke="none" />
        {capaMusculos(props, g, 'torso', ids)}
        <path d={f.torso} fill="none" stroke={INK} strokeWidth={15} strokeLinejoin="round" />
        <rect x={fa.c[0] - fa.ancho / 2} y={fa.c[1] - fa.alto / 2} width={fa.ancho} height={fa.alto} rx={12}
          fill={GRY} stroke={INK} strokeWidth={13}
          transform={'rotate(' + fa.ang.toFixed(2) + ' ' + pt(fa.c) + ')'} />

        {capaMusculos(props, g, 'pierna', ids)}

        {/* cabeza de perfil */}
        <path d={f.cabeza} fill={BLANCO} stroke={INK} strokeWidth={15} strokeLinejoin="round" />
        <circle cx={f.ojo[0]} cy={f.ojo[1]} r={8} fill={INK} />
        <path d={f.oreja} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />

        {enMano}

        {/* brazo cercano */}
        <Brazo S={g.hombro} E={g.codo} H={g.mano} />
        {capaMusculos(props, g, 'brazo', ids)}

        {/* deltoides: tapa la union del brazo con el torso */}
        <path d={dl.d} fill={BLANCO} stroke="none" />
        {cDeltT ? <path d={dl.d} fill={cDeltT[0]} opacity={cDeltT[1]} /> : null}
        {cDelt ? (
          <g opacity={cDelt[1]}>
            <path d={dl.d} fill={cDelt[0]} clipPath={'url(#' + ids.d + ')'} />
            <path d={divDelt} fill="none" stroke={INK} strokeWidth={11} strokeLinecap="round" />
          </g>
        ) : null}
        <path d={dl.fibra} fill="none" stroke={GRY} strokeWidth={11} strokeLinecap="round" />
        <path d={dl.d} fill="none" stroke={INK} strokeWidth={13} strokeLinejoin="round" />

        {hijos}
      </svg>
    );
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
  function mover(pose, d) {
    var r = {};
    Object.keys(pose).forEach(function (k) {
      var v = pose[k];
      r[k] = Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' ? suma(v, d) : v;
    });
    return r;
  }
  function girar(pose, c, deg) {
    var r = {};
    Object.keys(pose).forEach(function (k) {
      var v = pose[k];
      r[k] = Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' ? suma(c, rotar(resta(v, c), deg)) : v;
    });
    return r;
  }
  // punto mas bajo de la espalda + short + cabeza en la direccion dir (para apoyar el cuerpo)
  function apoyo(cad, cue, k, cabeza, dir) {
    var col = columna(cad, cue, k);
    var mx = -1e9;
    for (var t = 0.14; t <= 1.0001; t += 0.02) {
      mx = Math.max(mx, dot(col.en(t, -tabla(ANCHO_ESPALDA, t)), dir));
    }
    var u0 = col.tan(0), n0 = col.nrm(0);
    SHORT.forEach(function (q) { mx = Math.max(mx, dot(suma(suma(cad, por(u0, q[0])), por(n0, q[1])), dir)); });
    var ang = angulo(col.tan(1)) + 90;
    var q = suma(CAB.pivote, rotar(resta(CAB.nuca, CAB.pivote), -(cabeza || 0)));
    mx = Math.max(mx, dot(suma(cue, rotar(q, ang)), dir));
    return mx;
  }

  var posePerfil = {
    // 1. parado, brazos colgando. x = cadera
    depie: function (o) {
      o = o || {};
      var x = o.x == null ? 700 : o.x, piso = o.piso == null ? PISO : o.piso;
      var tob = [x + 14, piso - MED.tobillo];
      var cad = [x, tob[1] - 538];
      var cue = [x - 6, cad[1] - MED.columna];
      var hom = hombroDe(cad, cue, 0);
      var codo = suma(hom, polar(93, MED.brazo));
      var mano = suma(codo, polar(98, MED.ante));
      var tob2 = [x + 40, piso - MED.tobillo];
      return {
        cadera: cad, cuello: cue, curva: 0, cabeza: 0,
        codo: codo, mano: mano,
        rodilla: ik(cad, tob, MED.muslo, MED.pierna, -1), tobillo: tob, punta: suma(tob, ZAP_PUNTA),
        rodilla2: ik(cad, tob2, MED.muslo, MED.pierna, -1), tobillo2: tob2, punta2: suma(tob2, ZAP_PUNTA),
        piso: piso
      };
    },

    // 2. sentadilla sumo de perfil. x = tobillo (los pies no se mueven)
    sentadilla: function (o) {
      o = o || {};
      var x = o.x == null ? 640 : o.x, piso = o.piso == null ? PISO : o.piso;
      var k = clamp(o.curva || 0, 0, 1);
      function armar(p) {
        var tob = [x, piso - MED.tobillo];
        var fi = lerp(2, 17, p);
        var rod = suma(tob, polar(-90 - fi, MED.pierna));
        var lm = lerp(MED.muslo, 226, suave(p));
        var cad = suma(rod, polar(lerp(-87, -3, p), lm));
        var lean = lerp(3, 26, p) + k * lerp(4, 12, p);
        var cue = suma(cad, polar(-90 - lean, MED.columna * (1 - 0.05 * k)));
        var curva = k * lerp(0.35, 1, p);
        var hom = hombroDe(cad, cue, curva);
        var codo = suma(hom, polar(92, MED.brazo));
        var mano = suma(codo, polar(92, MED.ante));
        return { tob: tob, rod: rod, cad: cad, cue: cue, curva: curva, hom: hom, codo: codo, mano: mano, lm: lm };
      }
      var p = clamp(o.prof || 0, 0, 1);
      var a = armar(p);
      var tob2 = [x + 26, piso - MED.tobillo];
      var rod2 = ik(a.cad, tob2, a.lm, MED.pierna, -1);
      var pose = {
        cadera: a.cad, cuello: a.cue, curva: a.curva,
        cabeza: lerp(0, -10, p) * (1 - k) + k * 16,
        hombro: a.hom, codo: a.codo, mano: a.mano,
        codo2: suma(a.codo, [12, -8]), mano2: suma(a.mano, [6, -4]),
        rodilla: a.rod, tobillo: a.tob, punta: suma(a.tob, [-104, 32]),
        rodilla2: rod2, tobillo2: tob2, punta2: suma(tob2, [-104, 32]),
        brazosDentro: true, piso: piso
      };
      if (o.pesa) {
        var fondo1 = armar(1).mano;
        pose.mancuerna = {
          agarre: lerpP(a.mano, pose.mano2, 0.5), eje: [0, 1],
          largo: Math.max(120, piso - 10 - fondo1[1])
        };
      }
      return pose;
    },

    // 3. boca arriba en el piso, cabeza a la derecha. x = cadera
    acostado: function (o) {
      o = o || {};
      var x = o.x == null ? 700 : o.x, piso = o.piso == null ? PISO : o.piso;
      var pr = clamp(o.piernas || 0, 0, 90), rd = clamp(o.rodilla || 0, 0, 1), ar = clamp(o.arco || 0, 0, 1);
      var curva = lerp(0.3, -0.62, ar);
      var cabeza = -4;
      var cad = [x, piso - 100], cue = [x + MED.columna, piso - 90];
      var dy = piso - apoyo(cad, cue, curva, cabeza, [0, 1]);
      cad = suma(cad, [0, dy]); cue = suma(cue, [0, dy]);
      var hom = hombroDe(cad, cue, curva);
      // brazo apoyado en el piso, manos debajo de los gluteos
      var codo = [hom[0] - 218, piso - R_BRAZO[1] - 2];
      var mano = [cad[0] - 30, piso - R_PUNO - 2];
      // piernas
      var e = lerp(-6, 90, pr / 90);
      var flex = rd * 72;
      var th = e + rd * 18, rod, tob, angP;
      for (var i = 0; i < 120; i++) {
        rod = suma(cad, polar(180 + th, MED.muslo));
        angP = 180 + th - flex;
        tob = suma(rod, polar(angP, MED.pierna));
        if (tob[1] <= piso - 40 || th >= 100) break;
        th += 1;
      }
      var pun = pieDesde(tob, angP, 60);
      var nM = flexDe(unidad(resta(rod, cad)));
      var lj = suma(por(nM, 14), por(unidad(resta(rod, cad)), -4));
      return {
        cadera: cad, cuello: cue, curva: curva, cabeza: cabeza,
        hombro: hom, codo: codo, mano: mano,
        hombro2: suma(hom, [10, -12]), codo2: suma(codo, [16, -10]), mano2: suma(mano, [18, -8]),
        rodilla: rod, tobillo: tob, punta: pun,
        rodilla2: suma(rod, lj), tobillo2: suma(tob, lj), punta2: suma(pun, lj),
        piso: piso
      };
    },

    // 4. boca arriba en banco plano. x = cadera, y = cara de arriba del banco
    banco: function (o) {
      o = o || {};
      var x = o.x == null ? 560 : o.x, piso = o.piso == null ? PISO : o.piso;
      var y = o.y == null ? piso - 290 : o.y;
      var p = clamp(o.p || 0, 0, 1);
      var curva = 0.12, cabeza = -4;
      var cad = [x, y - 100], cue = [x + MED.columna, y - 92];
      var dy = y - apoyo(cad, cue, curva, cabeza, [0, 1]);
      cad = suma(cad, [0, dy]); cue = suma(cue, [0, dy]);
      var col = columna(cad, cue, curva);
      var hom = hombroDe(cad, cue, curva);
      var u = col.tan(0.84), n = col.nrm(0.84);
      // brazo en 3D [hacia la cabeza, hacia arriba (frente), hacia la camara]
      var ua = unidad3(lerp3([-0.16, -0.62, 0.77], [0.02, 0.985, 0.17], suave(p)));
      var fa = unidad3(lerp3([0.04, 0.99, -0.1], [0.0, 0.99, -0.12], p));
      var en2 = function (v, l) { return suma(por(u, v[0] * l), por(n, v[1] * l)); };
      var codo = suma(hom, en2(ua, MED.brazo));
      var mano = suma(codo, en2(fa, MED.ante));
      // piernas: rodillas a ~90 grados, pies apoyados en el piso
      var tob = [cad[0] - 236, piso - MED.tobillo];
      var rod = ik(cad, tob, MED.muslo, MED.pierna, -1);
      var tob2 = suma(tob, [22, -2]);
      var rod2 = ik(cad, tob2, MED.muslo, MED.pierna, -1);
      var bancoX0 = cad[0] - 150;
      return {
        cadera: cad, cuello: cue, curva: curva, cabeza: cabeza,
        hombro: hom, codo: codo, mano: mano,
        codo2: suma(codo, [14, -10]), mano2: suma(mano, [14, -10]),
        rodilla: rod, tobillo: tob, punta: suma(tob, ZAP_PUNTA),
        rodilla2: rod2, tobillo2: tob2, punta2: suma(tob2, ZAP_PUNTA),
        piso: piso, banco: { y: y, x0: bancoX0, x1: cue[0] + 190 }
      };
    },

    // 5. colgado de una barra (dominadas), visto de costado
    colgado: function (o) {
      o = o || {};
      var barra = o.barra || [o.x == null ? 700 : o.x, 210];
      var sb = clamp(o.sube || 0, 0, 1), rd = clamp(o.rodillas || 0, 0, 1);
      var bal = o.balanceo || 0;
      var e = suave(sb);
      // brazo en 3D [adelante, arriba, hacia la camara]
      var ua = unidad3(lerp3([0.05, 0.96, 0.28], [0.34, -0.48, 0.8], e));
      var fa = unidad3(lerp3([0.04, 0.97, 0.24], [0.14, 0.97, 0.2], e));
      var v = function (q, l) { return [-q[0] * l, -q[1] * l]; };
      var mano = barra;
      var codo = resta(mano, v(fa, MED.ante));
      var hom = resta(codo, v(ua, MED.brazo));
      var elev = 26 * (1 - e);
      var cue = suma(hom, [-12, -(MED.cuelloHombro - elev)]);
      var cad = suma(cue, [6, MED.columna]);
      var thA = 90 + 4 + rd * 24;
      var rod = suma(cad, polar(thA, MED.muslo));
      var shA = thA - rd * 86;
      var tob = suma(rod, polar(shA, MED.pierna));
      var pun = pieDesde(tob, shA, 40);
      var cruz = lerpP([16, -8], [-34, 6], rd);
      var tob2 = suma(tob, cruz);
      var pose = {
        cadera: cad, cuello: cue, curva: -0.08 * e, cabeza: -10 * e,
        hombro: hom, codo: codo, mano: mano,
        hombro2: suma(hom, [16, -10]), codo2: suma(codo, [18, -6]), mano2: suma(mano, [4, -2]),
        rodilla: rod, tobillo: tob, punta: pun,
        rodilla2: suma(rod, [16, -6]), tobillo2: tob2, punta2: suma(pun, cruz),
        barra: barra
      };
      var giro = bal + 9 * e;
      return giro ? Object.assign(girar(pose, barra, giro), { barra: barra }) : pose;
    }
  };

  Object.assign(B, {
    Perfil: Perfil,
    geoPerfil: geoPerfil,
    posePerfil: posePerfil,
    ik: ik,
    PERFIL: { W: PW, H: PH, PISO: PISO, medidas: MED }
  });
})(window);
