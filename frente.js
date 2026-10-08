/* GENERADO por compilar.js desde frente.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   FRENTE — B.Frente: figura humana de frente, cuerpo entero
   Misma familia que B.Espalda y B.Estacion: trazo #14110F grueso,
   relleno blanco, puntas redondas, viewBox fijo, prop s de escala.

   B.Frente       1200x1600  persona de frente (o vista cenital acostada)
   B.geoFrente    la misma geometria, sin dibujar
   B.poseFrente   constructores de pose: depie, sumo, bancaArriba, mezclar

   La pose son puntos explicitos (centro de la pelvis, base del cuello,
   y por lado codo, mano, rodilla, tobillo, pieAng). Los constructores
   la arman a partir de dos o tres numeros; las escenas pueden tocar
   cualquier punto a mano o mezclar dos poses.

   izq / der son los lados de la IMAGEN (izq = lado izquierdo del
   lienzo = brazo derecho de la persona, que mira a camara).

   Capas, de atras hacia adelante:
     fondo(g) -> banco (cenital) -> piernas -> short -> torso -> cabeza
     -> brazos -> deltoides -> agarre(g) -> puños -> children(g)
   agarre(g) es para lo que se sostiene en la mano (la mancuerna):
   queda encima de los brazos y debajo de los puños.
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
    por = U.por;
  var largo = U.largo,
    unidad = U.unidad,
    pt = U.pt,
    capsula = U.capsula,
    blando = U.blando;
  var FW = 1200,
    FH = 1600;
  var L_TORSO = 360; // centro de la pelvis -> base del cuello
  var HOMBRO = [172, -306]; // articulacion del hombro en coordenadas del torso
  var CADERA_X = 86; // articulacion de la cadera, a cada lado del centro
  var L_BRAZO = 200,
    L_ANTE = 196,
    L_MUSLO = 268,
    L_PIERNA = 268;
  var TOBILLO = 32; // alto del tobillo sobre el piso
  var R_PUNO = 36;
  var CABEZA_D = 162; // base del cuello -> centro de la cabeza

  /* ---------------- geometria ---------------- */

  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }

  // marco del torso: (x, y) locales -> mundo. x a la derecha de la imagen,
  // y negativa hacia el cuello; (0,0) = centro de la pelvis, (0,-360) = cuello.
  // Si el cuello queda mas cerca que 360, el torso se acorta (escorzo).
  function marco(centro, cuello) {
    var d = resta(cuello, centro);
    var l = largo(d) || 1;
    var u = por(d, 1 / l);
    var n = [-u[1], u[0]];
    var ky = l / L_TORSO;
    function a(p) {
      return suma(suma(centro, por(n, p[0])), por(u, -p[1] * ky));
    }
    function inv(w) {
      var r = resta(w, centro);
      return [dot(r, n), -dot(r, u) / ky];
    }
    return {
      a: a,
      inv: inv,
      u: u,
      n: n,
      ky: ky
    };
  }

  // comandos de path en coordenadas propias -> string, pasando cada punto por f
  function ruta(f, cmds) {
    return cmds.map(function (c) {
      if (c === 'Z') return 'Z';
      return c[0] + ' ' + c.slice(1).map(function (q) {
        return pt(f(q));
      }).join(' ');
    }).join(' ');
  }

  // dos segmentos de largo l1 y l2 de A a C; la articulacion se dobla hacia nPref
  function ik(A, C, l1, l2, nPref) {
    var d = resta(C, A);
    var dist = Math.max(1, Math.min(largo(d), l1 + l2 - 0.5));
    var u = unidad(d);
    var a = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
    var h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    var n = [-u[1], u[0]];
    if (dot(n, nPref) < 0) n = por(n, -1);
    return suma(suma(A, por(u, a)), por(n, h));
  }

  // marco de un miembro: t 0..1 de A a B, o = desplazamiento hacia AFUERA del cuerpo
  function segF(A, Bp, lado) {
    var d = resta(Bp, A),
      u = unidad(d);
    var n = lado < 0 ? [-u[1], u[0]] : [u[1], -u[0]];
    var f = function (q) {
      return suma(suma(A, por(d, q[0])), por(n, q[1]));
    };
    f.u = u;
    f.n = n;
    f.l = largo(d);
    return f;
  }

  // casco convexo (cadena monotona)
  function casco(pts) {
    var p = pts.slice().sort(function (a, b) {
      return a[0] - b[0] || a[1] - b[1];
    });
    function cruz(o, a, b) {
      return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    }
    var lo = [],
      hi = [];
    p.forEach(function (q) {
      while (lo.length >= 2 && cruz(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop();
      lo.push(q);
    });
    for (var i = p.length - 1; i >= 0; i--) {
      var q = p[i];
      while (hi.length >= 2 && cruz(hi[hi.length - 2], hi[hi.length - 1], q) <= 0) hi.pop();
      hi.push(q);
    }
    hi.pop();
    lo.pop();
    var c = lo.concat(hi),
      out = [];
    c.forEach(function (q) {
      if (!out.length || largo(resta(q, out[out.length - 1])) > 16) out.push(q);
    });
    if (out.length > 3 && largo(resta(out[0], out[out.length - 1])) < 16) out.pop();
    return out;
  }

  // zapatilla de frente: perfil lateral [a lo largo desde el tobillo, alto, medio ancho]
  // girado pieAng hacia afuera y proyectado sobre el plano de la camara
  var PERFIL_ZAP = [[-46, 2, 34], [-50, 46, 34], [-22, 74, 36], [30, 72, 40], [96, 52, 46], [158, 34, 46], [192, 20, 40], [200, 6, 36], [184, 0, 40], [0, 0, 42]];
  function zapatoFrente(tob, piso, ang, lado) {
    var a = ang * GRAD,
      sa = Math.sin(a),
      ca = Math.cos(a);
    var pts = [];
    PERFIL_ZAP.forEach(function (q) {
      pts.push([tob[0] + lado * q[0] * sa + q[2] * ca, piso - q[1]]);
      pts.push([tob[0] + lado * q[0] * sa - q[2] * ca, piso - q[1]]);
    });
    return blando(casco(pts), 0.34);
  }

  // zapatilla vista desde arriba (cenital): huella con la punta hacia dir
  function zapatoArriba(tob, dir, k) {
    var n = [-dir[1], dir[0]];
    var q = function (a, c) {
      return suma(tob, por(suma(por(dir, a), por(n, c)), k));
    };
    return {
      d: blando([q(-40, -24), q(-40, 24), q(60, 40), q(150, 46), q(206, 20), q(206, -20), q(150, -46), q(60, -40)], 0.42),
      cordon: 'M ' + pt(q(40, 0)) + ' L ' + pt(q(112, 0))
    };
  }

  /* ---------------- constructores de pose ---------------- */

  function lados(fn) {
    return [['izq', -1], ['der', 1]].forEach(function (k) {
      fn(k[0], k[1]);
    });
  }

  // de pie, brazos al costado
  function depie(o) {
    o = o || {};
    var x = o.x == null ? 600 : o.x,
      piso = o.piso == null ? 1500 : o.piso;
    var pies = o.pies == null ? 96 : o.pies;
    var pieAng = o.pieAng == null ? 12 : o.pieAng;
    var tobY = piso - TOBILLO;
    var dx = pies - CADERA_X;
    var yH = tobY - Math.sqrt(Math.max(0, Math.pow(L_MUSLO + L_PIERNA, 2) - dx * dx));
    var pose = {
      vista: 'frente',
      centro: [x, yH],
      cuello: [x, yH - L_TORSO],
      piso: piso
    };
    lados(function (k, l) {
      var S = [x + l * HOMBRO[0], yH + HOMBRO[1]];
      var cad = [x + l * CADERA_X, yH],
        tob = [x + l * pies, tobY];
      var E = suma(S, [l * 26, 196]),
        H = suma(E, [l * 10, 194]);
      pose[k] = {
        codo: E,
        mano: H,
        rodilla: lerpP(cad, tob, 0.5),
        tobillo: tob,
        pieAng: pieAng
      };
    });
    return pose;
  }

  // sentadilla sumo con una mancuerna vertical entre las piernas
  function sumo(o) {
    o = o || {};
    var x = o.x == null ? 600 : o.x,
      piso = o.piso == null ? 1500 : o.piso;
    var prof = clamp(o.prof || 0, 0, 1),
      valgo = clamp(o.valgo || 0, 0, 1);
    var pies = o.pies == null ? 270 : o.pies;
    var pieAng = o.pieAng == null ? 35 : o.pieAng;
    var tobY = piso - TOBILLO;
    var dx = pies - CADERA_X;
    var yH0 = tobY - Math.sqrt(Math.max(0, Math.pow(L_MUSLO + L_PIERNA, 2) - dx * dx));
    var yH1 = tobY - 272;
    var yH = lerp(yH0, yH1, prof);
    var centro = [x, yH],
      cuello = [x, yH - L_TORSO * (1 - 0.07 * prof)];
    var fr = marco(centro, cuello);
    // al fondo la rodilla queda sobre el pie, un poco afuera del tobillo:
    // los largos proyectados salen de esa meta (el muslo se acorta: escorzo)
    var K1 = [pies + 40, tobY - 250 - yH1];
    var lt1 = largo(resta(K1, [CADERA_X, 0])),
      ls1 = largo(resta(K1, [pies, tobY - yH1]));
    var lt = lerp(L_MUSLO, lt1, prof),
      ls = lerp(L_PIERNA, ls1, prof);
    var hy = 0;
    var pose = {
      vista: 'frente',
      centro: centro,
      cuello: cuello,
      piso: piso
    };
    lados(function (k, l) {
      var cad = [x + l * CADERA_X, yH],
        tob = [x + l * pies, tobY];
      var rod = ik(cad, tob, lt, ls, [l, -1]);
      if (valgo > 0) {
        var v = valgo * prof;
        rod = [rod[0] - l * v * 140, rod[1] + v * 10];
      }
      var S = fr.a([l * HOMBRO[0], HOMBRO[1]]);
      var hx = x + l * 30;
      var alcance = 386;
      var h = Math.min(S[1] + Math.sqrt(Math.max(0, alcance * alcance - Math.pow(S[0] - hx, 2))), piso - 254);
      hy = h;
      var H = [hx, h];
      var E = ik(S, H, L_BRAZO, L_ANTE, [l, 0]);
      pose[k] = {
        codo: E,
        mano: H,
        rodilla: rod,
        tobillo: tob,
        pieAng: pieAng
      };
    });
    pose.mancuerna = {
      arriba: [x, hy - 38],
      abajo: [x, hy + 196],
      centro: [x, hy + 79],
      eje: 90,
      largo: 234
    };
    return pose;
  }

  // vista cenital: acostado boca arriba en un banco plano, cabeza arriba del cuadro.
  // Los brazos se proyectan con perspectiva (camara a D sobre el pecho):
  // lo que sube hacia la camara crece (kCodo, kMano) y se abre un poco.
  function bancaArriba(o) {
    o = o || {};
    var x = o.x == null ? 600 : o.x,
      y = o.y == null ? 520 : o.y;
    var p = clamp(o.p || 0, 0, 1);
    var abd = clamp(o.abd == null ? 45 : o.abd, 0, 110);
    var centro = [x, y - HOMBRO[1]],
      cuello = [x, y - (L_TORSO + HOMBRO[1])];
    var C = [x, y + 40],
      D = 2000;
    function proy(q) {
      var k = D / (D - q[2]);
      return {
        p: [C[0] + (q[0] - C[0]) * k, C[1] + (q[1] - C[1]) * k],
        k: k
      };
    }
    var pose = {
      vista: 'cenital',
      centro: centro,
      cuello: cuello,
      banco: {
        x: x,
        y0: y - 330,
        y1: centro[1] + 300,
        ancho: 112
      }
    };
    lados(function (k, l) {
      var S = [x + l * HOMBRO[0], y];
      var a = abd * GRAD;
      var dirH = [l * Math.sin(a), Math.cos(a)];
      var th = lerp(-36, 90, p) * GRAD;
      var adentro = 0.2 * p * p; // al final las mancuernas se juntan un poco sobre el pecho
      var v = [dirH[0] * Math.cos(th) - l * adentro, dirH[1] * Math.cos(th), Math.sin(th)];
      var lv = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
      v = [v[0] / lv, v[1] / lv, v[2] / lv];
      var E3 = [S[0] + v[0] * L_BRAZO, S[1] + v[1] * L_BRAZO, v[2] * L_BRAZO];
      var fa = [-l * adentro, 0, 1];
      var lf = Math.sqrt(fa[0] * fa[0] + 1);
      var H3 = [E3[0] + fa[0] / lf * L_ANTE, E3[1], E3[2] + L_ANTE / lf];
      var pe = proy(E3),
        ph = proy(H3);
      // piernas abiertas a los lados del banco, rodillas dobladas, pies al piso
      var rod = [x + l * 196, centro[1] + 222];
      pose[k] = {
        hombro: S,
        codo: pe.p,
        mano: ph.p,
        kCodo: pe.k,
        kMano: ph.k,
        rodilla: rod,
        tobillo: suma(rod, [l * 30, 66]),
        pieAng: 22,
        kPie: 0.82,
        abd: abd
      };
    });
    return pose;
  }

  // interpola dos poses de la misma forma (puntos, numeros); lo demas cambia a la mitad
  function mezclar(a, b, t) {
    if (typeof a === 'number' && typeof b === 'number') return lerp(a, b, t);
    if (Array.isArray(a) && Array.isArray(b) && typeof a[0] === 'number') return lerpP(a, b, t);
    if (a && b && typeof a === 'object' && typeof b === 'object') {
      var o = {};
      Object.keys(a).concat(Object.keys(b)).forEach(function (k) {
        if (k in o) return;
        o[k] = a[k] == null ? b[k] : b[k] == null ? a[k] : mezclar(a[k], b[k], t);
      });
      return o;
    }
    return t < 0.5 ? a : b;
  }

  /* ---------------- geometria completa ---------------- */

  function geoFrente(props) {
    var pose = props.pose || depie({});
    var vista = pose.vista || 'frente';
    var fr = marco(pose.centro, pose.cuello);
    var cabeza = pose.cabeza || suma(pose.cuello, por(fr.u, CABEZA_D));
    var inclinacion = Math.atan2(fr.u[0], -fr.u[1]) / GRAD;
    var piso = pose.piso;
    var g = {
      vista: vista,
      pose: pose,
      centro: pose.centro,
      cuello: pose.cuello,
      cabeza: cabeza,
      inclinacion: inclinacion,
      u: fr.u,
      n: fr.n,
      local: fr.a,
      marco: fr,
      pecho: fr.a([0, -280]),
      ombligo: fr.a([0, -124]),
      cintura: fr.a([0, -78]),
      mancuerna: pose.mancuerna || null,
      banco: pose.banco || null
    };
    lados(function (k, l) {
      var q = pose[k] || {};
      var S = q.hombro || fr.a([l * HOMBRO[0], HOMBRO[1]]);
      var cad = q.cadera || fr.a([l * CADERA_X, 0]);
      var E = q.codo || suma(S, [l * 26, 196]);
      var H = q.mano || suma(E, [l * 10, 194]);
      var tob = q.tobillo || suma(cad, [l * 10, L_MUSLO + L_PIERNA]);
      var rod = q.rodilla || lerpP(cad, tob, 0.5);
      var pieAng = q.pieAng == null ? 12 : q.pieAng;
      var kPie = q.kPie == null ? 1 : q.kPie;
      var pisoL = piso == null ? tob[1] + TOBILLO : piso;
      var punta, dirPie;
      if (vista === 'cenital') {
        dirPie = [l * Math.sin(pieAng * GRAD), Math.cos(pieAng * GRAD)];
        punta = suma(tob, por(dirPie, 210 * kPie));
      } else {
        punta = [tob[0] + l * 196 * Math.sin(pieAng * GRAD), pisoL - 8];
        dirPie = [l * Math.sin(pieAng * GRAD), Math.cos(pieAng * GRAD)];
      }
      var medioPie = vista === 'cenital' ? lerpP(tob, punta, 0.45) : [lerp(tob[0], punta[0], 0.42), pisoL - 30];
      var lado = {
        lado: l,
        hombro: S,
        codo: E,
        mano: H,
        cadera: cad,
        rodilla: rod,
        tobillo: tob,
        punta: punta,
        dirPie: dirPie,
        pieAng: pieAng,
        medioPie: medioPie,
        kPie: kPie,
        kCodo: q.kCodo == null ? 1 : q.kCodo,
        kMano: q.kMano == null ? 1 : q.kMano,
        guiaRodilla: [[medioPie[0], pisoL - 6], [medioPie[0], rod[1] - 80]],
        desvioRodilla: l * (rod[0] - medioPie[0])
      };
      lado.rPuno = R_PUNO * lado.kMano;
      var dirB = resta(E, S);
      lado.angCodo = largo(dirB) > 2 ? Math.acos(clamp(dot(unidad(dirB), por(fr.u, -1)), -1, 1)) / GRAD : 0;
      var aTorso = Math.atan2(-fr.u[1], -fr.u[0]) / GRAD;
      var aBrazo = Math.atan2(dirB[1], dirB[0]) / GRAD;
      lado.arco = {
        c: S,
        r: 130,
        a0: aTorso,
        a1: aBrazo
      };
      lado.ejeTorso = [S, suma(S, por(fr.u, -230))];
      if (q.abd != null) lado.abd = q.abd;
      g[k] = lado;
    });
    g.piso = piso == null ? Math.max(g.izq.tobillo[1], g.der.tobillo[1]) + TOBILLO : piso;
    g.manos = lerpP(g.izq.mano, g.der.mano, 0.5);
    return g;
  }

  /* ---------------- musculos ---------------- */

  // nivel y color de un musculo: musc = amarillo, muscGris = gris, muscRojo = rojo (error).
  // El valor puede ser un numero (los dos lados) o [izq, der].
  function nivel(props, clave, i) {
    function val(o) {
      if (!o) return 0;
      var v = o[clave];
      if (v == null) return 0;
      if (Array.isArray(v)) v = v[i || 0];
      return clamp(+v || 0, 0, 1);
    }
    var r = val(props.muscRojo),
      y = val(props.musc),
      gr = val(props.muscGris);
    if (r > 0.01) return {
      v: r,
      color: RED
    };
    if (y > 0.01) return {
      v: y,
      color: YEL
    };
    if (gr > 0.01) return {
      v: gr,
      color: GRY
    };
    return null;
  }
  var LINEA = {
    fill: 'none',
    stroke: INK,
    strokeWidth: 11,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  var FIBRA = {
    fill: 'none',
    stroke: GRY,
    strokeWidth: 11,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  // un musculo: tinte con opacidad = valor, contorno y fibras que entran mas rapido
  function Musculo(props) {
    var m = props.m;
    if (!m) return null;
    var lo = Math.min(1, m.v * 2.2);
    var lineas = (props.sinContorno ? [] : [props.d]).concat(props.lineas || []);
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: props.d,
      fill: m.color,
      opacity: m.v,
      stroke: "none"
    }), (props.fibras || []).map(function (d, i) {
      return /*#__PURE__*/React.createElement("path", _extends({
        key: 'f' + i,
        d: d
      }, FIBRA, {
        opacity: lo
      }));
    }), lineas.map(function (d, i) {
      return /*#__PURE__*/React.createElement("path", _extends({
        key: 'l' + i,
        d: d
      }, LINEA, {
        opacity: lo
      }));
    }));
  }

  /* ---- torso: todo en coordenadas del torso, lado izquierdo canonico (x < 0) ---- */

  function mitadTorso(S) {
    var sx = S[0],
      sy = S[1];
    return {
      ini: [-40, -446],
      segs: [[[-40, -420], [-42, -400], [-50, -386]], [[-90, -372], [sx + 58, sy - 52], [sx + 14, sy - 44]], [[sx - 24, sy - 38], [sx - 36, sy + 4], [sx - 20, sy + 44]], [[sx - 8, sy + 64], [sx + 8, sy + 72], [sx + 14, sy + 78]], [[-160, -202], [-160, -176], [-150, -146]], [[-140, -120], [-132, -104], [-134, -84]], [[-136, -70], [-144, -56], [-150, -40]]]
    };
  }
  function siluetaTorso(fr, SL, SR) {
    var fi = fr.a;
    var fd = function (p) {
      return fr.a([-p[0], p[1]]);
    };
    var a = mitadTorso(SL),
      b = mitadTorso([-SR[0], SR[1]]);
    var d = 'M ' + pt(fi(a.ini));
    a.segs.forEach(function (s) {
      d += ' C ' + pt(fi(s[0])) + ' ' + pt(fi(s[1])) + ' ' + pt(fi(s[2]));
    });
    var pts = [b.ini].concat(b.segs.map(function (s) {
      return s[2];
    }));
    d += ' L ' + pt(fd(pts[pts.length - 1]));
    for (var i = b.segs.length - 1; i >= 0; i--) {
      d += ' C ' + pt(fd(b.segs[i][1])) + ' ' + pt(fd(b.segs[i][0])) + ' ' + pt(fd(pts[i]));
    }
    return d + ' Z';
  }
  function formasTorso(S) {
    var sx = S[0],
      sy = S[1];
    var bordePec = [['M', [sx + 22, sy + 44]], ['C', [-124, -226], [-96, -206], [-58, -204]], ['C', [-30, -204], [-14, -212], [-12, -232]]];
    var filas = [[-210, -166, 64, 62], [-160, -118, 62, 59], [-112, -72, 58, 54]];
    return {
      bordePec: bordePec,
      pec: [['M', [-12, -346]], ['C', [-50, -354], [sx + 72, sy - 40], [sx + 30, sy - 26]], ['C', [sx + 12, sy - 4], [sx + 10, sy + 24], [sx + 22, sy + 44]], ['C', [-124, -226], [-96, -206], [-58, -204]], ['C', [-30, -204], [-14, -212], [-12, -232]], 'Z'],
      pecFibra: [['M', [-34, -236]], ['Q', [-84, -238], [sx + 30, sy + 30]]],
      trap: [['M', [-44, -460]], ['L', [sx - 30, sy - 120]], ['L', [sx + 24, sy - 30]], ['C', [sx + 70, sy - 38], [-72, -356], [-48, -372]], 'Z'],
      trapLinea: [['M', [sx + 24, sy - 30]], ['C', [sx + 70, sy - 38], [-72, -356], [-48, -372]]],
      trapFibra: [['M', [-58, -400]], ['Q', [-92, -384], [sx + 30, sy - 52]]],
      abd: filas.map(function (f) {
        return [[-10, f[0]], [-f[2], f[0] + 2], [-f[3], f[1]], [-10, f[1]]];
      }),
      obl: [['M', [-66, -198]], ['C', [-96, -206], [-140, -212], [-178, -198]], ['L', [-178, -30]], ['L', [-64, -50]], ['C', [-58, -100], [-60, -160], [-66, -198]], 'Z'],
      oblLinea: [['M', [-66, -198]], ['C', [-60, -160], [-58, -100], [-64, -50]]],
      oblFibras: [[['M', [-150, -178]], ['L', [-96, -124]]], [['M', [-150, -128]], ['L', [-100, -86]]]],
      serr: [-224, -200, -176].map(function (y, i) {
        return [[-180, y - 13], [-180, y + 11], [-126 - i * 2, y + 9]];
      })
    };
  }
  function MusculosTorso(props) {
    var fr = props.fr,
      SL = props.SL,
      SR = props.SR,
      pr = props.pr;
    var out = [];
    [[-1, SL, 0], [1, [-SR[0], SR[1]], 1]].forEach(function (c) {
      var l = c[0],
        i = c[2];
      var f = l < 0 ? fr.a : function (p) {
        return fr.a([-p[0], p[1]]);
      };
      var F = formasTorso(c[1]);
      var R = function (cmds) {
        return ruta(f, cmds);
      };
      var mObl = nivel(pr, 'obl', i),
        mSerr = nivel(pr, 'serr', i),
        mPec = nivel(pr, 'pec', i);
      var mAbd = nivel(pr, 'abd', i),
        mTrap = nivel(pr, 'trap', i);
      out.push(/*#__PURE__*/React.createElement("g", {
        key: 'mt' + l
      }, /*#__PURE__*/React.createElement(Musculo, {
        m: mObl,
        d: R(F.obl),
        sinContorno: true,
        lineas: [R(F.oblLinea)],
        fibras: F.oblFibras.map(R)
      }), F.serr.map(function (q, j) {
        return /*#__PURE__*/React.createElement(Musculo, {
          key: 's' + j,
          m: mSerr,
          d: blando(q.map(f), 0.3)
        });
      }), /*#__PURE__*/React.createElement(Musculo, {
        m: mTrap,
        d: R(F.trap),
        sinContorno: true,
        lineas: [R(F.trapLinea)],
        fibras: [R(F.trapFibra)]
      }), /*#__PURE__*/React.createElement(Musculo, {
        m: mPec,
        d: R(F.pec),
        fibras: [R(F.pecFibra)]
      }), F.abd.map(function (q, j) {
        return /*#__PURE__*/React.createElement(Musculo, {
          key: 'a' + j,
          m: mAbd,
          d: blando(q.map(f), 0.32)
        });
      }), mPec ? null : /*#__PURE__*/React.createElement("path", _extends({
        d: R(F.bordePec)
      }, LINEA))));
    });
    return /*#__PURE__*/React.createElement("g", null, out);
  }

  /* ---- miembros: (t 0..1 a lo largo, o hacia afuera) ---- */

  var FORMAS_MUSLO = {
    cuad: [['M', [0.22, 62]], ['C', [0.5, 78], [0.8, 60], [0.93, 28]], ['C', [0.99, 10], [0.99, -12], [0.93, -26]], ['C', [0.87, -52], [0.72, -56], [0.6, -44]], ['C', [0.46, -32], [0.3, -36], [0.22, -42]], 'Z'],
    cuadLineas: [[['M', [0.56, -40]], ['Q', [0.74, -20], [0.9, -14]]]],
    cuadFibra: [['M', [0.42, 46]], ['Q', [0.62, 54], [0.8, 40]]],
    aduct: [['M', [0.16, -40]], ['C', [0.34, -34], [0.5, -36], [0.66, -50]], ['L', [0.62, -100]], ['L', [0.12, -100]], 'Z'],
    aductLinea: [['M', [0.16, -40]], ['C', [0.34, -34], [0.5, -36], [0.66, -50]]],
    aductFibra: [['M', [0.3, -52]], ['Q', [0.44, -58], [0.56, -58]]],
    sart: [['M', [0.14, 66]], ['C', [0.4, 30], [0.62, -26], [0.96, -36]], ['L', [0.96, -58]], ['C', [0.6, -50], [0.38, 6], [0.12, 40]], 'Z'],
    tfl: [['M', [0.06, 60]], ['C', [0.24, 84], [0.44, 84], [0.54, 68]], ['C', [0.42, 56], [0.26, 50], [0.08, 44]], 'Z'],
    tflLinea: [['M', [0.54, 66]], ['L', [0.94, 44]]]
  };
  function MusculosMuslo(props) {
    var f = segF(props.A, props.B, props.lado),
      pr = props.pr,
      i = props.i;
    var R = function (c) {
      return ruta(f, c);
    };
    var F = FORMAS_MUSLO;
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement(Musculo, {
      m: nivel(pr, 'aduct', i),
      d: R(F.aduct),
      sinContorno: true,
      lineas: [R(F.aductLinea)],
      fibras: [R(F.aductFibra)]
    }), /*#__PURE__*/React.createElement(Musculo, {
      m: nivel(pr, 'tfl', i),
      d: R(F.tfl),
      lineas: [R(F.tflLinea)]
    }), /*#__PURE__*/React.createElement(Musculo, {
      m: nivel(pr, 'cuad', i),
      d: R(F.cuad),
      lineas: F.cuadLineas.map(R),
      fibras: [R(F.cuadFibra)]
    }), /*#__PURE__*/React.createElement(Musculo, {
      m: nivel(pr, 'sart', i),
      d: R(F.sart)
    }));
  }
  function MusculoBrazo(props) {
    var f = segF(props.A, props.B, props.lado);
    if (f.l < 70) return null;
    var R = function (c) {
      return ruta(f, c);
    };
    var m = nivel(props.pr, props.clave, props.i);
    if (props.clave === 'bic') {
      return /*#__PURE__*/React.createElement(Musculo, {
        m: m,
        d: R([['M', [0.36, -2]], ['Q', [0.66, 42], [0.96, 0]], ['Q', [0.66, -44], [0.36, -2]], 'Z']),
        fibras: [R([['M', [0.5, 0]], ['L', [0.86, 0]]])]
      });
    }
    return /*#__PURE__*/React.createElement(Musculo, {
      m: m,
      d: R([['M', [0.02, 10]], ['Q', [0.3, 52], [0.72, 8]], ['Q', [0.3, -28], [0.02, 10]], 'Z']),
      fibras: [R([['M', [0.14, 12]], ['L', [0.54, 14]]])]
    });
  }

  // deltoides como gorra (igual que en cuerpo.jsx)
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

  /* ---------------- piezas de la figura ---------------- */

  function Banco(props) {
    var b = props.b;
    var x0 = b.x - b.ancho,
      w = b.ancho * 2,
      h = b.y1 - b.y0;
    return /*#__PURE__*/React.createElement("g", {
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: b.x - 176,
      y: b.y0 + 34,
      width: 352,
      height: 46,
      rx: 16,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 13
    }), /*#__PURE__*/React.createElement("rect", {
      x: b.x - 176,
      y: b.y1 - 120,
      width: 352,
      height: 46,
      rx: 16,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 13
    }), /*#__PURE__*/React.createElement("rect", {
      x: x0,
      y: b.y0,
      width: w,
      height: h,
      rx: 40,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("rect", {
      x: x0 + 26,
      y: b.y0 + 26,
      width: w - 52,
      height: h - 52,
      rx: 24,
      fill: "none",
      stroke: GRY,
      strokeWidth: 11
    }));
  }
  function Cabeza(props) {
    var g = props.g;
    return /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + pt(g.cabeza).replace(' ', ',') + ') rotate(' + g.inclinacion.toFixed(2) + ')'
    }, /*#__PURE__*/React.createElement("ellipse", {
      cx: -74,
      cy: 8,
      rx: 17,
      ry: 28,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 12
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 74,
      cy: 8,
      rx: 17,
      ry: 28,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 12
    }), /*#__PURE__*/React.createElement("ellipse", {
      cx: 0,
      cy: 0,
      rx: 70,
      ry: 84,
      fill: BLANCO,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("circle", {
      cx: -26,
      cy: -2,
      r: 8,
      fill: INK
    }), /*#__PURE__*/React.createElement("circle", {
      cx: 26,
      cy: -2,
      r: 8,
      fill: INK
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: "M 0 12 L 0 32"
    }, LINEA)), /*#__PURE__*/React.createElement("path", _extends({
      d: "M -16 52 L 16 52"
    }, LINEA)));
  }
  function Frente(props) {
    var s = props.s == null ? 1 : props.s;
    var g = geoFrente(props);
    var fr = g.marco;
    var id = U.useIdLocal('fre');
    var L = g.izq,
      R = g.der;
    var cen = g.vista === 'cenital';
    var SL = fr.inv(L.hombro),
      SR = fr.inv(R.hombro);
    var sil = siluetaTorso(fr, SL, SR);
    var tDelt = [nivel(props, 'delt', 0), nivel(props, 'delt', 1)];
    var llamar = function (x) {
      return typeof x === 'function' ? x(g) : x;
    };
    var hijos = llamar(props.children);
    var fondo = llamar(props.fondo);
    var agarre = llamar(props.agarre);
    var lad = [L, R];
    var kPie = function (q) {
      return q.kPie;
    };

    // short: bloque de cadera + mangas cortas (se ven los muslos)
    var cortoFrac = props.short == null ? 0.3 : props.short;
    var bloque = blando([[-160, -66], [160, -66], [164, 2], [48, 66], [-48, 66], [-164, 2]].map(fr.a), 0.3);
    var faja = blando([[-158, -72], [158, -72], [158, -34], [-158, -34]].map(fr.a), 0.22);
    var manga = function (q) {
      var u = unidad(resta(q.rodilla, q.cadera));
      var n = [-u[1], u[0]];
      var ruedo = lerpP(q.cadera, q.rodilla, cortoFrac);
      var arriba = suma(q.cadera, por(u, -40));
      var lr = largo(resta(q.rodilla, q.cadera));
      var rb = lr < 140 ? 74 : 70;
      return 'M ' + [suma(arriba, por(n, 76)), suma(ruedo, por(n, rb)), suma(ruedo, por(n, -rb)), suma(arriba, por(n, -76))].map(pt).join(' L ') + ' Z';
    };
    var piernas = function (paso) {
      var t = paso === 'trazo';
      return /*#__PURE__*/React.createElement("g", {
        key: paso,
        fill: BLANCO,
        stroke: t ? INK : 'none',
        strokeWidth: t ? 30 : 0,
        strokeLinejoin: "round"
      }, lad.map(function (q, i) {
        return /*#__PURE__*/React.createElement("g", {
          key: i
        }, /*#__PURE__*/React.createElement("path", {
          d: capsula(q.cadera, q.rodilla, 66, 46)
        }), /*#__PURE__*/React.createElement("path", {
          d: capsula(q.rodilla, finPierna(q), 46, 30 * (cen ? kPie(q) : 1))
        }), cen ? null : /*#__PURE__*/React.createElement("path", {
          d: pantorrilla(q)
        }));
      }));
    };

    // rodilla: un arco corto bajo la rotula, abierto hacia el muslo
    var rotula = function (q) {
      var v = unidad(resta(q.tobillo, q.rodilla));
      var n = [-v[1], v[0]];
      var c = suma(q.rodilla, por(v, 2));
      return 'M ' + pt(suma(c, suma(por(n, 19), por(v, -6)))) + ' Q ' + pt(suma(c, por(v, 18))) + ' ' + pt(suma(c, suma(por(n, -19), por(v, -6))));
    };
    // pantorrilla: un poco de volumen bajo la rodilla, mas hacia adentro
    var pantorrilla = function (q) {
      var d = resta(q.tobillo, q.rodilla),
        l = largo(d);
      if (l < 120) return '';
      var v = por(d, 1 / l);
      var adentro = q.lado < 0 ? [v[1], -v[0]] : [-v[1], v[0]];
      return capsula(suma(suma(q.rodilla, por(v, l * 0.14)), por(adentro, 3)), suma(q.rodilla, por(v, l * 0.64)), 49, 34);
    };
    // la pierna termina un poco antes del tobillo para que la zapatilla la tape entera
    var finPierna = function (q) {
      if (cen) return q.tobillo;
      return suma(q.tobillo, por(unidad(resta(q.rodilla, q.tobillo)), 18));
    };
    var zapatos = lad.map(function (q, i) {
      if (cen) {
        var z = zapatoArriba(q.tobillo, q.dirPie, q.kPie);
        return /*#__PURE__*/React.createElement("g", {
          key: 'z' + i
        }, /*#__PURE__*/React.createElement("path", {
          d: z.d,
          fill: BLANCO,
          stroke: INK,
          strokeWidth: 14,
          strokeLinejoin: "round"
        }), /*#__PURE__*/React.createElement("path", _extends({
          d: z.cordon
        }, LINEA)));
      }
      return /*#__PURE__*/React.createElement("g", {
        key: 'z' + i
      }, /*#__PURE__*/React.createElement("path", {
        d: zapatoFrente(q.tobillo, g.piso, q.pieAng, q.lado),
        fill: BLANCO,
        stroke: INK,
        strokeWidth: 14,
        strokeLinejoin: "round"
      }));
    });

    // brazo superior y antebrazo
    var brazos = function (paso, que) {
      var t = paso === 'trazo';
      return /*#__PURE__*/React.createElement("g", {
        key: paso + que,
        fill: BLANCO,
        stroke: t ? INK : 'none',
        strokeWidth: t ? 30 : 0,
        strokeLinejoin: "round"
      }, lad.map(function (q, i) {
        return /*#__PURE__*/React.createElement("g", {
          key: i
        }, que !== 'ante' ? /*#__PURE__*/React.createElement("path", {
          d: capsula(q.hombro, q.codo, 50, 40 * q.kCodo)
        }) : null, que !== 'brazo' ? /*#__PURE__*/React.createElement("path", {
          d: capsula(q.codo, q.mano, 38 * q.kCodo, 30 * q.kMano)
        }) : null);
      }));
    };
    var clipCap = function (k, a, b, ra, rb) {
      return /*#__PURE__*/React.createElement("clipPath", {
        id: id + k
      }, /*#__PURE__*/React.createElement("path", {
        d: capsula(a, b, ra, rb)
      }));
    };
    var deltoides = lad.map(function (q, i) {
      var lb = largo(resta(q.codo, q.hombro));
      var dir = lb > 24 ? q.codo : suma(q.hombro, [q.lado * 60, 100]);
      var dl = deltoide(q.hombro, dir, clamp(lb * 0.56, 58, 112));
      var m = tDelt[i];
      return /*#__PURE__*/React.createElement("g", {
        key: 'd' + i
      }, /*#__PURE__*/React.createElement("path", {
        d: dl.d,
        fill: BLANCO,
        stroke: "none"
      }), m ? /*#__PURE__*/React.createElement("path", {
        d: dl.d,
        fill: m.color,
        opacity: m.v
      }) : null, /*#__PURE__*/React.createElement("path", _extends({
        d: dl.fibra
      }, FIBRA)), /*#__PURE__*/React.createElement("path", {
        d: dl.d,
        fill: "none",
        stroke: INK,
        strokeWidth: 13,
        strokeLinejoin: "round"
      }));
    });
    var punos = lad.map(function (q, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: 'p' + i
      }, /*#__PURE__*/React.createElement("circle", {
        cx: q.mano[0],
        cy: q.mano[1],
        r: q.rPuno,
        fill: BLANCO,
        stroke: INK,
        strokeWidth: 30
      }), /*#__PURE__*/React.createElement("circle", {
        cx: q.mano[0],
        cy: q.mano[1],
        r: q.rPuno,
        fill: BLANCO,
        stroke: "none"
      }));
    });
    return /*#__PURE__*/React.createElement("svg", {
      width: FW * s,
      height: FH * s,
      viewBox: '0 0 ' + FW + ' ' + FH,
      style: Object.assign({
        display: 'block',
        overflow: 'visible'
      }, props.style || {})
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: id + 't'
    }, /*#__PURE__*/React.createElement("path", {
      d: sil
    })), lad.map(function (q, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, clipCap('m' + i, q.cadera, q.rodilla, 66, 46));
    }), lad.map(function (q, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, clipCap('b' + i, q.hombro, q.codo, 50, 40 * q.kCodo));
    }), lad.map(function (q, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, clipCap('a' + i, q.codo, q.mano, 38 * q.kCodo, 30 * q.kMano));
    })), fondo, !cen && !props.sinPiso ? /*#__PURE__*/React.createElement("path", {
      d: 'M 0 ' + (g.piso + 4) + ' L ' + FW + ' ' + (g.piso + 4),
      stroke: GRY,
      strokeWidth: 11,
      strokeLinecap: "round"
    }) : null, cen && g.banco && !props.sinBanco ? /*#__PURE__*/React.createElement(Banco, {
      b: g.banco
    }) : null, cen ? zapatos : null, piernas('trazo'), piernas('relleno'), lad.map(function (q, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: 'mm' + i,
        clipPath: 'url(#' + id + 'm' + i + ')'
      }, /*#__PURE__*/React.createElement(MusculosMuslo, {
        A: q.cadera,
        B: q.rodilla,
        lado: q.lado,
        pr: props,
        i: i
      }));
    }), lad.map(function (q, i) {
      return /*#__PURE__*/React.createElement("path", _extends({
        key: 'r' + i,
        d: rotula(q)
      }, LINEA));
    }), cen ? null : zapatos, ['trazo', 'relleno'].map(function (paso) {
      var t = paso === 'trazo';
      return /*#__PURE__*/React.createElement("g", {
        key: paso,
        fill: GRY,
        stroke: t ? INK : 'none',
        strokeWidth: t ? 28 : 0,
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: bloque
      }), /*#__PURE__*/React.createElement("path", {
        d: manga(L)
      }), /*#__PURE__*/React.createElement("path", {
        d: manga(R)
      }));
    }), /*#__PURE__*/React.createElement("path", {
      d: sil,
      fill: BLANCO,
      stroke: "none"
    }), /*#__PURE__*/React.createElement("g", {
      clipPath: 'url(#' + id + 't)'
    }, /*#__PURE__*/React.createElement(MusculosTorso, {
      fr: fr,
      SL: SL,
      SR: SR,
      pr: props
    })), /*#__PURE__*/React.createElement("path", {
      d: sil,
      fill: "none",
      stroke: INK,
      strokeWidth: 15,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: faja,
      fill: GRY,
      stroke: INK,
      strokeWidth: 13,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement(Cabeza, {
      g: g
    }), cen ? brazos('trazo', 'brazo') : brazos('trazo', 'todo'), cen ? brazos('relleno', 'brazo') : brazos('relleno', 'todo'), lad.map(function (q, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: 'mb' + i,
        clipPath: 'url(#' + id + 'b' + i + ')'
      }, /*#__PURE__*/React.createElement(MusculoBrazo, {
        A: q.hombro,
        B: q.codo,
        lado: q.lado,
        pr: props,
        i: i,
        clave: "bic"
      }));
    }), cen ? null : lad.map(function (q, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: 'ma' + i,
        clipPath: 'url(#' + id + 'a' + i + ')'
      }, /*#__PURE__*/React.createElement(MusculoBrazo, {
        A: q.codo,
        B: q.mano,
        lado: q.lado,
        pr: props,
        i: i,
        clave: "ante"
      }));
    }), deltoides, cen ? lad.map(function (q, i) {
      return /*#__PURE__*/React.createElement("g", {
        key: 'ac' + i
      }, /*#__PURE__*/React.createElement("path", {
        d: capsula(q.codo, q.mano, 38 * q.kCodo, 30 * q.kMano),
        fill: BLANCO,
        stroke: INK,
        strokeWidth: 30,
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: capsula(q.codo, q.mano, 38 * q.kCodo, 30 * q.kMano),
        fill: BLANCO
      }), /*#__PURE__*/React.createElement("g", {
        clipPath: 'url(#' + id + 'a' + i + ')'
      }, /*#__PURE__*/React.createElement(MusculoBrazo, {
        A: q.codo,
        B: q.mano,
        lado: q.lado,
        pr: props,
        i: i,
        clave: "ante"
      })));
    }) : null, agarre, punos, hijos);
  }
  Object.assign(B, {
    Frente: Frente,
    geoFrente: geoFrente,
    poseFrente: {
      depie: depie,
      sumo: sumo,
      bancaArriba: bancaArriba,
      mezclar: mezclar
    },
    FRENTE: {
      W: FW,
      H: FH,
      L_TORSO: L_TORSO,
      HOMBRO: HOMBRO,
      CADERA_X: CADERA_X
    }
  });
})(window);
