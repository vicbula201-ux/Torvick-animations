/* ============================================================
   TOP 3 GLUTEOS SEGUN LA CIENCIA — LA NOVIA DE TOR EN 3D (mismo guion que gluteos-top3.jsx)
   1. Hip thrust: el que mas activa el gluteo (Plotkin y cols., 2023).
   2. Sentadilla profunda: bajar completo hace crecer mas el gluteo (Kubo y cols., 2019).
   3. Sentadilla bulgara: con el torso un poco adelante, mas gluteo.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var E3 = global.E3, TOR3D = global.TOR3D;
  var Easing = global.Easing, clamp = global.clamp;

  var GLU = ['m:gluteos:0', 'm:gluteos:1'];
  var RAD = Math.PI / 180;
  function lado(p, s, mano, codo) { var L = s < 0 ? 'I' : 'D'; p['mano' + L] = mano; if (codo) p['codo' + L] = codo; }
  function aArr(q) { return [q.x, q.y, q.z]; }

  /* 1. hip thrust: la espalda en el banco; k 0 la cadera abajo .. 1 arriba, en linea */
  var PIV = [0, 0.64, -0.6];
  function hip(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)), b = (35 - 35 * e) * RAD;
    var d = [0, Math.sin(b), -Math.cos(b)];
    var cad = [0, PIV[1] - d[1] * 0.565, PIV[2] - d[2] * 0.565];
    var barra = [0, cad[1] + 0.25, cad[2] + 0.02];
    var p = { cadera: cad, tronco: [Math.atan2(d[2], d[1]) / RAD, 0, 0], cabeza: [-28, 0, 0],
      pieI: [-0.2, 0.115, 0.46], pieD: [0.2, 0.115, 0.46], _barra: barra };
    [-1, 1].forEach(function (s) { lado(p, s, [s * 0.42, barra[1] + 0.03, barra[2] - 0.03], [0.6, -0.4, 0.2]); });
    return p;
  }
  /* 2. sentadilla profunda con barra: k 0 abajo .. 1 arriba */
  function sentadilla(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var p = { cadera: E3.lerp3([0, 0.46, -0.26], [0, 1.0, 0], e), tronco: [40 - 32 * e, 0, 0], cabeza: [26 - 20 * e, 0, 0],
      pieI: [-0.24, 0.115, 0.02], pieD: [0.24, 0.115, 0.02], rodillaI: [0.5, 0, 1], rodillaD: [0.5, 0, 1] };
    var J = TOR3D.esqueleto(p, 'novia');
    var c = J.cuello.clone().sub(J.fr.clone().multiplyScalar(0.17)).sub(J.d.clone().multiplyScalar(0.06));
    p._barra = aArr(c);
    [-1, 1].forEach(function (s) { var m = c.clone().add(J.X.clone().multiplyScalar(s * 0.46)); lado(p, s, aArr(m), [0.4, -1, -0.6]); });
    return p;
  }
  /* 3. bulgara: el pie de atras en el banco; k 0 abajo .. 1 arriba */
  function bulgara(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    return { cadera: E3.lerp3([0, 0.58, -0.04], [0, 0.93, 0.06], e), tronco: [30 - 12 * e, 0, 0], cabeza: [18 - 10 * e, 0, 0],
      pieD: [0.13, 0.115, 0.4], pieI: [-0.13, 0.53, -0.56], pies: [150, 0], rodillaI: [0.1, -0.3, 1] };
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.6, vo: 'Los 3 mejores ejercicios de glúteos según la ciencia.',
      C: E3.gancho({
        musculo: 'GLÚTEOS', musc: { gluteos: true }, brillo: GLU, r: 85,
        tomas: [[0, { az: 200, el: 4, dist: 4.6, y: 1.0 }], [1, { az: 158, el: 4, dist: 6.0, y: 1.05 }]],
        figura: function (T, f, fl) { return { quien: 'novia', pose: E3.poseNovia(), cara: { boca: 'sonrisa' } }; }
      }) },
    { nombre: '1. Hip thrust', dur: 2.2, vo: 'Uno: hip thrust, apretando arriba.',
      C: E3.ejercicio({
        n: 1, r1: 'HIP *THRUST*', r2: 'APRIETA *ARRIBA*', brillo: GLU, r: 80,
        tomas: [[0, { az: 80, el: 10, dist: 6.0, y: 0.55, dz: -0.05 }], [1, { az: 62, el: 8, dist: 4.8, y: 0.55, dz: 0 }]],
        vista: function (T, f, k) {
          var p = hip(k);
          return { figuras: [{ quien: 'novia', pose: p, musc: { gluteos: true, isquios: 'gris', brillo: 0.35 * k }, cara: { boca: k > 0.5 ? 'dientes' : 'sonrisa' } }],
            objetos: [{ tipo: 'banco', p: [0, 0, -0.77], giro: 90, largo: 1.2, alto: 0.42 }, { tipo: 'barra', c: p._barra, eje: [1, 0, 0] }] };
        }
      }) },
    { nombre: '2. Sentadilla profunda', dur: 2.2, vo: 'Dos: sentadilla profunda, más glúteo que la corta.',
      C: E3.ejercicio({
        n: 2, r1: 'SENTADILLA *PROFUNDA*', r2: 'BAJA *COMPLETO*', brillo: GLU, r: 80, s1: 0.98,
        tomas: [[0, { az: 64, el: 6, dist: 6.6, y: 1.0, dz: 0 }], [1, { az: 48, el: 4, dist: 5.6, y: 0.9, dz: 0 }]],
        vista: function (T, f, k) {
          var p = sentadilla(k);
          return { figuras: [{ quien: 'novia', pose: p, musc: { gluteos: true, cuadriceps: 'gris', brillo: 0.35 * k }, cara: { boca: k < 0.5 ? 'dientes' : 'sonrisa' } }],
            objetos: [{ tipo: 'barra', c: p._barra, eje: [1, 0, 0] }] };
        }
      }) },
    { nombre: '3. Búlgara', dur: 2.2, vo: 'Tres: sentadilla búlgara, con el torso adelante.',
      C: E3.ejercicio({
        n: 3, r1: 'SENTADILLA *BÚLGARA*', r2: 'TORSO *ADELANTE*', brillo: GLU, r: 80, s1: 0.98,
        tomas: [[0, { az: 88, el: 6, dist: 6.4, y: 0.85, dz: -0.05 }], [1, { az: 120, el: 6, dist: 5.4, y: 0.8, dz: -0.05 }]],
        vista: function (T, f, k) {
          return { figuras: [{ quien: 'novia', pose: bulgara(k), pesas: 'neutro', musc: { gluteos: true, cuadriceps: 'gris', brillo: 0.35 * k }, cara: { boca: k < 0.5 ? 'dientes' : 'sonrisa' } }],
            objetos: [{ tipo: 'banco', p: [0, 0, -0.62], largo: 0.6, alto: 0.45 }] };
        }
      }) }
  ];

  global.REELS.registrar({
    id: 'gluteos-top3-3d', titulo: 'Top 3 glúteos (novia 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 3.6, pregunta: '¿CUÁL PROBARÁS?', vo: '¿Cuál vas a probar? Coméntalo, compártelo con una amiga y guárdalo.' }
  });
})(window);
