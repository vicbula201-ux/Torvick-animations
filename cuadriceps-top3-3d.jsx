/* ============================================================
   TOP 3 CUADRICEPS SEGUN LA CIENCIA — LA NOVIA DE TOR EN 3D (mismo guion que cuadriceps-top3.jsx)
   1. Sentadilla en maquina (Smith), bien abajo (Kubo y cols., 2019).
   2. Extension de piernas: trabaja el recto femoral (Ema y cols., 2013).
   3. Prensa: mucho peso con la espalda apoyada, sin despegar la cadera.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var E3 = global.E3, TOR3D = global.TOR3D;
  var Easing = global.Easing, clamp = global.clamp;

  var CUAD = ['m:cuadriceps:0', 'm:cuadriceps:1'];
  var RAD = Math.PI / 180;
  function aArr(q) { return [q.x, q.y, q.z]; }

  /* 1. Smith: k 0 abajo .. 1 arriba; los pies un poco adelante, el torso mas derecho */
  function smith(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1));
    var p = { cadera: E3.lerp3([0, 0.5, -0.24], [0, 0.99, -0.06], e), tronco: [22 - 16 * e, 0, 0], cabeza: [14 - 10 * e, 0, 0],
      pieI: [-0.22, 0.115, 0.14], pieD: [0.22, 0.115, 0.14], rodillaI: [0.4, 0, 1], rodillaD: [0.4, 0, 1] };
    var J = TOR3D.esqueleto(p, 'novia');
    var c = J.cuello.clone().sub(J.fr.clone().multiplyScalar(0.17)).sub(J.d.clone().multiplyScalar(0.06));
    p._barra = c.y;
    [-1, 1].forEach(function (s) { p[s < 0 ? 'manoI' : 'manoD'] = [s * 0.48, c.y, c.z]; p[s < 0 ? 'codoI' : 'codoD'] = [0.4, -1, -0.6]; });
    p._z = c.z;
    return p;
  }
  /* 2. extension de piernas: k 0 rodillas dobladas .. 1 piernas estiradas */
  function extension(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)), t = (85 - 85 * e) * RAD;
    var p = { cadera: [0, 0.66, -0.05], tronco: [-4, 0, 0], cabeza: [0, 0, 0], rodillaI: [0.1, 0.8, 1], rodillaD: [0.1, 0.8, 1],
      manoI: [-0.36, 0.6, 0.0], manoD: [0.36, 0.6, 0.0], pies: [10 - 10 * e, 10 - 10 * e] };
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D', rod = [s * 0.13, 0.62, 0.4];
      p['pie' + L] = [s * 0.13, rod[1] - 0.43 * Math.sin(t), rod[2] + 0.43 * Math.cos(t)];
    });
    return p;
  }
  function extObjetos(p) {
    var J = TOR3D.esqueleto(p, 'novia');
    var sh = J.tobilloD.clone().sub(J.rodillaD).normalize();
    var frente = TOR3D.v(0, sh.z, -sh.y);   // la cara de adelante de la pierna
    var rod = J.tobilloD.clone().add(frente.multiplyScalar(0.1)).setX(0);
    return [
      { tipo: 'banco', p: [0, 0, 0.04], largo: 0.56, alto: 0.54, ancho: 0.5, respaldo: { ang: 95, largo: 0.95, ancho: 0.5 } },
      { tipo: 'rodillo', id: 'pierna', c: aArr(rod), pivote: [0, J.rodillaD.y, J.rodillaD.z], ancho: 0.5 }
    ];
  }
  /* 3. prensa a 45°: k 0 rodillas al pecho .. 1 piernas casi estiradas */
  var CAD_P = [0, 0.62, -0.1], U = [0, Math.SQRT1_2, Math.SQRT1_2];
  function prensa(k) {
    var e = Easing.easeInOutSine(clamp(k, 0, 1)), L = 0.5 + 0.32 * e;
    var p = { cadera: CAD_P, tronco: [-45, 0, 0], cabeza: [-8, 0, 0], pies: [-135, -135],
      manoI: [-0.34, 0.55, -0.02], manoD: [0.34, 0.55, -0.02], rodillaI: [0.25, 1, 0], rodillaD: [0.25, 1, 0] };
    [-1, 1].forEach(function (s) { p[s < 0 ? 'pieI' : 'pieD'] = [s * 0.2, CAD_P[1] - 0.03 + U[1] * L, CAD_P[2] + 0.03 + U[2] * L]; });
    p._plato = [0, CAD_P[1] - 0.03 + U[1] * L - 0.03, CAD_P[2] + 0.03 + U[2] * L + 0.03];
    return p;
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.6, vo: 'Los 3 mejores ejercicios de cuádriceps según la ciencia.',
      C: E3.gancho({
        musculo: 'CUÁDRICEPS', s1: 1.05, musc: { cuadriceps: true }, brillo: CUAD, r: 85,
        tomas: [[0, { az: 18, el: 2, dist: 4.6, y: 0.9 }], [1, { az: 22, el: 4, dist: 6.0, y: 1.0 }]],
        figura: function () { return { quien: 'novia', pose: E3.poseNovia(), cara: { boca: 'sonrisa' } }; }
      }) },
    { nombre: '1. Sentadilla en máquina', dur: 2.2, vo: 'Uno: sentadilla en máquina, bajando bien.',
      C: E3.ejercicio({
        n: 1, r1: 'SENTADILLA EN *MÁQUINA*', r2: 'BIEN *ABAJO*', brillo: CUAD, r: 80, s1: 0.95,
        tomas: [[0, { az: 50, el: 6, dist: 7.0, y: 1.1, dz: 0 }], [1, { az: 40, el: 4, dist: 5.8, y: 0.95, dz: 0 }]],
        vista: function (T, f, k) {
          var p = smith(k);
          return { figuras: [{ quien: 'novia', pose: p, musc: { cuadriceps: true, gluteos: 'claro', brillo: 0.35 * k }, cara: { boca: k < 0.5 ? 'dientes' : 'sonrisa' } }],
            objetos: [{ tipo: 'smith', p: [0, 0, p._z], barra: p._barra }] };
        }
      }) },
    { nombre: '2. Extensión de piernas', dur: 2.2, vo: 'Dos: extensión de piernas, la que trabaja el recto femoral.',
      C: E3.ejercicio({
        n: 2, r1: 'EXTENSIÓN DE *PIERNAS*', r2: 'RECTO *FEMORAL*', brillo: CUAD, r: 80, s1: 0.95,
        tomas: [[0, { az: 70, el: 8, dist: 6.0, y: 0.8, dz: 0.2 }], [1, { az: 52, el: 6, dist: 5.0, y: 0.75, dz: 0.25 }]],
        vista: function (T, f, k) {
          var p = extension(k);
          return { figuras: [{ quien: 'novia', pose: p, musc: { cuadriceps: true, brillo: 0.35 * k }, cara: { boca: k > 0.5 ? 'dientes' : 'sonrisa' } }], objetos: extObjetos(p) };
        }
      }) },
    { nombre: '3. Prensa', dur: 2.2, vo: 'Tres: prensa, sin despegar la cadera.',
      C: E3.ejercicio({
        n: 3, r1: '*PRENSA*', r2: 'CADERA *PEGADA*', brillo: CUAD, r: 80,
        tomas: [[0, { az: 84, el: 10, dist: 7.6, y: 0.75, dz: 0.3 }], [1, { az: 66, el: 10, dist: 6.4, y: 0.72, dz: 0.3 }]],
        vista: function (T, f, k) {
          var p = prensa(k);
          return { figuras: [{ quien: 'novia', pose: p, musc: { cuadriceps: true, gluteos: 'claro', brillo: 0.35 * k }, cara: { boca: k > 0.5 ? 'dientes' : 'sonrisa' } }],
            objetos: [{ tipo: 'prensa', cadera: CAD_P, plato: p._plato, u: U }] };
        }
      }) }
  ];

  global.REELS.registrar({
    id: 'cuadriceps-top3-3d', titulo: 'Top 3 cuádriceps (novia 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 3.6, pregunta: '¿CUÁL PROBARÁS?', vo: '¿Cuál vas a probar? Coméntalo, compártelo con una amiga y guárdalo.' }
  });
})(window);
