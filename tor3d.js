/* GENERADO por compilar.js desde tor3d.jsx — no editar a mano. */
/* ============================================================
   TOR EN 3D (window.TOR3D): el mismo Tor de siempre con volumen.
   Cuerpo blanco con sombreado plano de dos tonos, contorno negro grueso
   (casco invertido), cara simple, hombros redondos, short gris, musculo
   que trabaja en amarillo y mancuernas. Se dibuja con three.js (window.THREE)
   en un <canvas> debajo de los rotulos, las X y el sello del reel.

   El esqueleto se calcula punto por punto, como B.Perfil: tobillos fijos,
   cadera, rodillas por IK, tronco con bisagra, hombros, codos por IK y manos.
   Cada pieza se ubica entre sus dos articulaciones en cada cuadro.

   Uso:
     var vista = TOR3D.vista({ pose: {...}, camara: {...}, musc: {...}, fantasmas: [...] });
     <TOR3D.Lienzo vista={vista} />          // dibuja el cuadro
     TOR3D.proyectar(vista, 'dorsalI')        // -> [x, y] en el lienzo 1080x1920
   Pose: bisagra 0 (de pie) .. 1 (inclinado), rodillas 0..1, remo 0 (brazos
   colgando) .. 1 (mancuernas al abdomen), balanceo 0..1 (el error: el torso
   sube para ayudar), respira (-1..1), cabeza (grados, mira arriba).
   Camara: az (grados alrededor de Tor, 0 = de frente, 90 = de costado),
   el (grados hacia arriba), dist, y (altura del punto que mira), dx/dz, fov.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var ANCHO = 1080,
    ALTO = 1920;
  var INK = 0x14110F,
    YEL = 0xFFD400,
    GRY = 0xC9C3B8,
    BLANCO = 0xffffff,
    RED = 0xE03A2F;
  var G = 0.024; // grosor del contorno (en unidades del mundo; Tor mide ~2)
  var MOTOR = null;

  /* ---------------- materiales: dos tonos y contorno ---------------- */
  function hex3(h) {
    var c = new global.THREE.Color(h);
    return c;
  }
  function toon(base, sombra) {
    var THREE = global.THREE;
    return new THREE.ShaderMaterial({
      uniforms: {
        base: {
          value: hex3(base)
        },
        sombra: {
          value: hex3(sombra)
        },
        brillo: {
          value: 0
        },
        colorBrillo: {
          value: hex3(0xFFF3A6)
        },
        luz: {
          value: new THREE.Vector3(-0.55, 0.75, 0.6).normalize()
        }
      },
      vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 base; uniform vec3 sombra; uniform float brillo; uniform vec3 colorBrillo; uniform vec3 luz; varying vec3 vN;' + 'void main(){ float l = dot(normalize(vN), luz); float k = smoothstep(0.02, 0.12, l);' + 'vec3 c = mix(sombra, base, k); c = mix(c, colorBrillo, brillo); gl_FragColor = vec4(c, 1.0); }'
    });
  }
  function borde() {
    return new global.THREE.MeshBasicMaterial({
      color: INK,
      side: global.THREE.BackSide
    });
  }

  /* ---------------- piezas con su contorno ---------------- */
  function conBorde(geo, geoB, mat, escala, escalaB) {
    var THREE = global.THREE,
      g = new THREE.Group();
    var m = new THREE.Mesh(geo, mat);
    if (escala) m.scale.set(escala[0], escala[1], escala[2]);
    g.add(m);
    if (geoB) {
      var b = new THREE.Mesh(geoB, MOTOR.mat.borde);
      if (escalaB) b.scale.set(escalaB[0], escalaB[1], escalaB[2]);
      g.add(b);
    }
    g.userData.relleno = m;
    return g;
  }
  function elipsoide(rx, ry, rz, mat, grosor) {
    var THREE = global.THREE,
      geo = new THREE.SphereGeometry(1, 40, 28),
      gg = grosor == null ? G : grosor;
    return conBorde(geo, gg ? geo : null, mat, [rx, ry, rz], [rx + gg, ry + gg, rz + gg]);
  }
  function capsula(r, largo, mat, grosor) {
    var THREE = global.THREE,
      gg = grosor == null ? G : grosor;
    var g = conBorde(new THREE.CapsuleGeometry(r, largo, 10, 28), gg ? new THREE.CapsuleGeometry(r + gg, largo, 10, 28) : null, mat);
    g.userData.largo = largo;
    return g;
  }
  function cilindro(r, h, lados, mat) {
    var THREE = global.THREE;
    var g = conBorde(new THREE.CylinderGeometry(r, r, h, lados), new THREE.CylinderGeometry(r + G * 0.8, r + G * 0.8, h + G * 1.4, lados), mat);
    g.userData.largo = h;
    return g;
  }
  // cuerpo de revolucion con seccion eliptica: perfil [[y, r]], ez = profundidad / ancho
  function tuboEliptico(perfil, ez, extra) {
    var THREE = global.THREE,
      seg = 48,
      pos = [],
      idx = [];
    perfil.forEach(function (p) {
      for (var j = 0; j <= seg; j++) {
        var a = j / seg * Math.PI * 2,
          r = p[1] + extra;
        pos.push(Math.cos(a) * r, p[0], Math.sin(a) * (p[1] * ez + extra));
      }
    });
    for (var i = 0; i < perfil.length - 1; i++) {
      for (var j2 = 0; j2 < seg; j2++) {
        var a0 = i * (seg + 1) + j2,
          b0 = a0 + seg + 1;
        idx.push(a0, b0, a0 + 1, a0 + 1, b0, b0 + 1);
      }
    }
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }
  function tubo(perfil, ez, mat) {
    var ext = perfil.slice();
    ext.unshift([perfil[0][0] - G, 0.001]);
    ext.push([perfil[perfil.length - 1][0] + G, 0.001]);
    return conBorde(tuboEliptico(perfil, ez, 0), tuboEliptico(ext, ez, G), mat);
  }
  function radioEn(perfil, y) {
    for (var i = 0; i < perfil.length - 1; i++) {
      var a = perfil[i],
        b = perfil[i + 1];
      if (y >= a[0] && y <= b[0]) return a[1] + (b[1] - a[1]) * (y - a[0]) / (b[0] - a[0]);
    }
    return 0;
  }
  // linea de tinta sobre una superficie (pectorales, sonrisa)
  function trazo(puntos, r) {
    var THREE = global.THREE;
    var curva = new THREE.CatmullRomCurve3(puntos.map(function (p) {
      return new THREE.Vector3(p[0], p[1], p[2]);
    }));
    return new THREE.Mesh(new THREE.TubeGeometry(curva, 32, r, 8, false), MOTOR.mat.tinta);
  }

  /* ---------------- el modelo ---------------- */
  var TORSO = [[0.0, 0.265], [0.1, 0.27], [0.22, 0.295], [0.34, 0.355], [0.44, 0.41], [0.52, 0.43], [0.58, 0.405], [0.63, 0.31], [0.665, 0.15], [0.675, 0.04]];
  var EZ = 0.6;
  var SHORT = [[-0.2, 0.02], [-0.19, 0.13], [-0.16, 0.225], [-0.1, 0.275], [-0.03, 0.29], [0.04, 0.285], [0.085, 0.272], [0.16, 0.255], [0.17, 0.02]];
  function construir() {
    var THREE = global.THREE,
      M = MOTOR,
      m = M.mat,
      raiz = new THREE.Group();
    M.escena.add(raiz);
    var p = M.partes = {};
    // tronco: cuerpo blanco + dorsales, romboides y pectorales (en coordenadas del tronco)
    p.torso = tubo(TORSO, EZ, m.blanco);
    var surf = function (x, y, lado) {
      var r = radioEn(TORSO, y);
      return lado * EZ * Math.sqrt(Math.max(r * r - x * x, 0.0001));
    };
    p.dorsal = [-1, 1].map(function (s) {
      var d = elipsoide(0.12, 0.2, 0.07, m.dorsal, 0.012);
      d.position.set(s * 0.2, 0.33, surf(0.2, 0.33, -1) * 0.93);
      d.rotation.set(0.15, s * 0.5, s * -0.32);
      p.torso.add(d);
      return d;
    });
    p.romboides = elipsoide(0.13, 0.085, 0.05, m.romboides, 0.012);
    p.romboides.position.set(0, 0.5, surf(0, 0.5, -1) * 0.97);
    p.torso.add(p.romboides);
    [-1, 1].forEach(function (s) {
      var pts = [];
      for (var i = 0; i <= 10; i++) {
        var x = s * (0.03 + 0.28 * i / 10),
          y = 0.43 - 0.06 * Math.sin(Math.PI * i / 10);
        pts.push([x, y, surf(x, y, 1) + 0.004]);
      }
      p.torso.add(trazo(pts, 0.011));
    });
    raiz.add(p.torso);
    p.short = tubo(SHORT, 0.68, m.gris);
    raiz.add(p.short);
    p.cinturon = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 8, 48), m.tinta);
    p.cinturon.rotation.x = Math.PI / 2;
    p.cinturon.scale.set(0.29, 0.29 * 0.68, 1);
    p.cinturon.position.y = 0.035;
    p.short.add(p.cinturon);
    p.cuello = capsula(0.085, 0.1, m.blanco);
    raiz.add(p.cuello);
    // cabeza: ovalo, orejas, ojos, cejas alzadas, nariz y sonrisa
    p.cabeza = new THREE.Group();
    p.cabeza.add(elipsoide(0.225, 0.27, 0.235, m.blanco));
    [-1, 1].forEach(function (s) {
      var o = elipsoide(0.045, 0.075, 0.035, m.blanco, 0.016);
      o.position.set(s * 0.232, -0.005, -0.01);
      p.cabeza.add(o);
      var ojo = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), m.tinta);
      ojo.scale.set(0.027, 0.036, 0.014);
      ojo.position.set(s * 0.083, 0.03, 0.222);
      p.cabeza.add(ojo);
      p.cabeza.add(trazo([[s * 0.125, 0.105, 0.2], [s * 0.085, 0.125, 0.212], [s * 0.045, 0.108, 0.224]], 0.011));
    });
    p.cabeza.add(trazo([[0, -0.0, 0.236], [0, -0.05, 0.238]], 0.011));
    var sonrisa = [];
    for (var i = 0; i <= 8; i++) {
      var x = -0.08 + 0.16 * i / 8,
        y = -0.105 - 0.035 * Math.sin(Math.PI * i / 8);
      sonrisa.push([x, y, 0.235 * Math.sqrt(Math.max(1 - x / 0.225 * (x / 0.225) - y / 0.27 * (y / 0.27), 0.01)) + 0.004]);
    }
    p.cabeza.add(trazo(sonrisa, 0.012));
    raiz.add(p.cabeza);
    // brazos y piernas
    ['I', 'D'].forEach(function (L) {
      p['delt' + L] = elipsoide(0.12, 0.115, 0.115, m.blanco);
      raiz.add(p['delt' + L]);
      p['brazo' + L] = capsula(0.078, 0.41, m.blanco);
      raiz.add(p['brazo' + L]);
      p['ante' + L] = capsula(0.068, 0.39, m.blanco);
      raiz.add(p['ante' + L]);
      p['mano' + L] = elipsoide(0.085, 0.085, 0.085, m.blanco);
      raiz.add(p['mano' + L]);
      p['muslo' + L] = capsula(0.13, 0.43, m.blanco);
      raiz.add(p['muslo' + L]);
      p['pernera' + L] = cilindro(0.152, 0.2, 32, m.gris);
      raiz.add(p['pernera' + L]);
      p['pierna' + L] = capsula(0.095, 0.43, m.blanco);
      raiz.add(p['pierna' + L]);
      p['pie' + L] = new THREE.Group();
      var z = elipsoide(0.09, 0.068, 0.165, m.blanco);
      z.position.set(0, 0.02, 0.06);
      p['pie' + L].add(z);
      var suela = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.025, 0.32), m.tinta);
      suela.position.set(0, -0.04, 0.06);
      p['pie' + L].add(suela);
      raiz.add(p['pie' + L]);
      p['pesa' + L] = mancuerna(m.gris, m.blanco, true);
      raiz.add(p['pesa' + L]);
    });
    // copias difuminadas de las mancuernas (desenfoque de movimiento)
    p.fantasmas = [];
    for (var k = 0; k < 6; k++) {
      var f = mancuerna(m.fantasma[k % 3], m.fantasma[k % 3], false);
      f.visible = false;
      raiz.add(f);
      p.fantasmas.push(f);
    }
    // sombra suave en el piso
    var cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    var cx = cv.getContext('2d'),
      gr = cx.createRadialGradient(128, 128, 10, 128, 128, 128);
    gr.addColorStop(0, 'rgba(20,17,15,0.34)');
    gr.addColorStop(0.55, 'rgba(20,17,15,0.14)');
    gr.addColorStop(1, 'rgba(20,17,15,0)');
    cx.fillStyle = gr;
    cx.fillRect(0, 0, 256, 256);
    p.sombra = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.5), new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(cv),
      transparent: true,
      depthWrite: false
    }));
    p.sombra.rotation.x = -Math.PI / 2;
    p.sombra.position.y = 0.003;
    raiz.add(p.sombra);
  }
  function mancuerna(matDisco, matBarra, conContorno) {
    var THREE = global.THREE,
      g = new THREE.Group();
    var barra = conContorno ? cilindro(0.024, 0.34, 16, matBarra) : new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.34, 12), matBarra);
    g.add(barra);
    [-1, 1].forEach(function (s) {
      [0.13, 0.19].forEach(function (y, i) {
        var d = conContorno ? cilindro(i ? 0.085 : 0.105, 0.06, 6, matDisco) : new THREE.Mesh(new THREE.CylinderGeometry(i ? 0.085 : 0.105, i ? 0.085 : 0.105, 0.06, 6), matDisco);
        d.position.y = s * y;
        g.add(d);
      });
    });
    return g;
  }
  function motor() {
    if (MOTOR) return MOTOR;
    var THREE = global.THREE;
    var R = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: false
    });
    R.setPixelRatio(1);
    R.setSize(ANCHO, ALTO, false);
    R.setClearColor(0xffffff, 1);
    MOTOR = {
      R: R,
      escena: new THREE.Scene(),
      camara: new THREE.PerspectiveCamera(30, ANCHO / ALTO, 0.05, 50),
      mat: {
        blanco: toon(BLANCO, 0xE7E2DA),
        gris: toon(GRY, 0xAAA295),
        dorsal: toon(YEL, 0xE3B100),
        romboides: toon(GRY, 0xAAA295),
        tinta: new THREE.MeshBasicMaterial({
          color: INK
        }),
        borde: borde(),
        fantasma: [0.32, 0.2, 0.12].map(function (o) {
          return new THREE.MeshBasicMaterial({
            color: 0x8A8278,
            transparent: true,
            opacity: o,
            depthWrite: false
          });
        })
      }
    };
    construir();
    return MOTOR;
  }

  /* ---------------- el esqueleto ---------------- */
  function v(x, y, z) {
    return new global.THREE.Vector3(x, y, z);
  }
  function lerp(a, b, k) {
    return a + (b - a) * k;
  }
  // dos huesos: raiz A, objetivo T, largos l1 y l2, hacia donde dobla (polo)
  function ik(A, T, l1, l2, polo) {
    var d = T.clone().sub(A),
      dist = Math.min(d.length(), l1 + l2 - 1e-4);
    var eje = d.normalize();
    var a = (l1 * l1 + dist * dist - l2 * l2) / (2 * dist),
      h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
    var p = polo.clone().sub(eje.clone().multiplyScalar(polo.dot(eje))).normalize();
    var fin = A.clone().add(eje.clone().multiplyScalar(dist));
    return {
      codo: A.clone().add(eje.clone().multiplyScalar(a)).add(p.multiplyScalar(h)),
      fin: fin
    };
  }
  function esqueleto(o) {
    var b = o.bisagra || 0,
      kn = o.rodillas == null ? b : o.rodillas,
      k = o.remo || 0,
      sw = o.balanceo || 0,
      resp = o.respira || 0;
    var X = v(1, 0, 0),
      J = {};
    J.cadera = v(0, 1.0 - 0.035 * b - 0.03 * kn + 0.006 * resp, -0.21 * b + 0.015 * kn);
    var ang = (3 + 50 * b - 26 * sw * b) * Math.PI / 180;
    var d = v(0, Math.cos(ang), Math.sin(ang)),
      fr = v(0, -Math.sin(ang), Math.cos(ang));
    J.d = d;
    J.fr = fr;
    J.cuello = J.cadera.clone().add(d.clone().multiplyScalar(0.665 + 0.006 * resp));
    // piernas: tobillos fijos y rodillas al frente
    ['I', 'D'].forEach(function (L, i) {
      var s = i ? 1 : -1;
      var Hj = J.cadera.clone().add(X.clone().multiplyScalar(s * 0.12)).add(v(0, -0.04, 0));
      var A = v(s * 0.15, 0.115, 0);
      var r = ik(Hj, A, 0.43, 0.43, v(s * 0.15, 0, 1));
      J['caderaJ' + L] = Hj;
      J['rodilla' + L] = r.codo;
      J['tobillo' + L] = A;
      // hombros: se juntan arriba (retraccion) y se separan abajo
      var S = J.cuello.clone().sub(d.clone().multiplyScalar(0.085)).add(X.clone().multiplyScalar(s * (0.375 - 0.035 * k))).add(fr.clone().multiplyScalar(0.03 - 0.06 * k));
      J['hombro' + L] = S;
      var abajo = S.clone().add(v(s * 0.02, -0.74, 0.05));
      var arriba = J.cadera.clone().add(d.clone().multiplyScalar(0.2)).add(X.clone().multiplyScalar(s * 0.31)).add(fr.clone().multiplyScalar(0.06));
      var W = abajo.clone().lerp(arriba, k).add(X.clone().multiplyScalar(s * 0.04 * Math.sin(Math.PI * k)));
      var polo = fr.clone().multiplyScalar(-1).add(X.clone().multiplyScalar(s * 0.35)).add(v(0, 0.2, 0));
      var a = ik(S, W, 0.41, 0.39, polo);
      J['codo' + L] = a.codo;
      J['mano' + L] = a.fin;
    });
    J.cabeza = J.cuello.clone().add(d.clone().multiplyScalar(0.27)).add(fr.clone().multiplyScalar(0.03));
    J.cabezaAng = o.cabeza != null ? o.cabeza : 24 * b; // inclinado, mira un poco al frente
    return J;
  }

  /* ---------------- ubicar las piezas ---------------- */
  var Y = null;
  // la pieza va de a a b; si tiene largo propio, se estira lo justo para unirlos
  function entre(obj, a, b) {
    if (!Y) Y = v(0, 1, 0);
    var dir = b.clone().sub(a),
      l = dir.length();
    obj.position.copy(a).add(b).multiplyScalar(0.5);
    obj.quaternion.setFromUnitVectors(Y, dir.normalize());
    if (obj.userData.largo) obj.scale.set(1, l / obj.userData.largo, 1);
  }
  function conMarco(obj, pos, X, d, fr) {
    var m = new global.THREE.Matrix4().makeBasis(X, d, fr);
    obj.position.copy(pos);
    obj.quaternion.setFromRotationMatrix(m);
  }
  function posar(vista) {
    var THREE = global.THREE,
      p = MOTOR.partes,
      J = esqueleto(vista.pose || {});
    var X = v(1, 0, 0);
    conMarco(p.torso, J.cadera, X, J.d, J.fr);
    conMarco(p.short, J.cadera, X, J.d, J.fr);
    entre(p.cuello, J.cuello.clone().sub(J.d.clone().multiplyScalar(0.06)), J.cuello.clone().add(J.d.clone().multiplyScalar(0.12)));
    // la cabeza sigue al tronco y puede mirar un poco hacia adelante
    var ca = J.cabezaAng * Math.PI / 180;
    var dC = J.d.clone().multiplyScalar(Math.cos(ca)).sub(J.fr.clone().multiplyScalar(Math.sin(ca)));
    var fC = J.fr.clone().multiplyScalar(Math.cos(ca)).add(J.d.clone().multiplyScalar(Math.sin(ca)));
    conMarco(p.cabeza, J.cabeza, X, dC, fC);
    ['I', 'D'].forEach(function (L, i) {
      var s = i ? 1 : -1;
      p['delt' + L].position.copy(J['hombro' + L]).add(X.clone().multiplyScalar(s * 0.03)).add(J.d.clone().multiplyScalar(0.015));
      p['delt' + L].quaternion.copy(p.torso.quaternion);
      entre(p['brazo' + L], J['hombro' + L], J['codo' + L]);
      entre(p['ante' + L], J['codo' + L], J['mano' + L]);
      p['mano' + L].position.copy(J['mano' + L]);
      entre(p['muslo' + L], J['caderaJ' + L], J['rodilla' + L]);
      var finPernera = J['caderaJ' + L].clone().lerp(J['rodilla' + L], 0.42);
      entre(p['pernera' + L], J['caderaJ' + L].clone().lerp(J['rodilla' + L], 0.02), finPernera);
      entre(p['pierna' + L], J['rodilla' + L], J['tobillo' + L]);
      p['pie' + L].position.copy(J['tobillo' + L]).add(v(0, -0.04, 0));
      // mancuerna con agarre neutro: la barra va de adelante hacia atras
      var ante = J['mano' + L].clone().sub(J['codo' + L]).normalize();
      var eje = v(0, 0, 1);
      eje.sub(ante.clone().multiplyScalar(eje.dot(ante))).normalize();
      var pesa = p['pesa' + L];
      pesa.position.copy(J['mano' + L]);
      pesa.quaternion.setFromUnitVectors(v(0, 1, 0), eje);
    });
    // desenfoque: mancuernas de unos instantes antes
    p.fantasmas.forEach(function (f) {
      f.visible = false;
    });
    (vista.fantasmas || []).forEach(function (fp, i) {
      if (i * 2 + 1 >= p.fantasmas.length) return;
      var Jf = esqueleto(fp);
      ['I', 'D'].forEach(function (L, j) {
        var f = p.fantasmas[i * 2 + j];
        var ante = Jf['mano' + L].clone().sub(Jf['codo' + L]).normalize();
        var eje = v(0, 0, 1);
        eje.sub(ante.clone().multiplyScalar(eje.dot(ante))).normalize();
        f.position.copy(Jf['mano' + L]);
        f.quaternion.setFromUnitVectors(v(0, 1, 0), eje);
        f.visible = true;
      });
    });
    // colores del musculo: amarillo (trabaja), rojo (error) o gris
    var mu = vista.musc || {};
    var col = mu.rojo ? [RED, 0xB82A21] : [YEL, 0xE3B100];
    MOTOR.mat.dorsal.uniforms.base.value.setHex(col[0]);
    MOTOR.mat.dorsal.uniforms.sombra.value.setHex(col[1]);
    MOTOR.mat.dorsal.uniforms.brillo.value = mu.brillo || 0;
    MOTOR.mat.romboides.uniforms.base.value.setHex(mu.romboides ? 0xFFE680 : GRY);
    MOTOR.mat.romboides.uniforms.sombra.value.setHex(mu.romboides ? 0xE3C24A : 0xAAA295);
    p.sombra.position.x = 0;
    p.sombra.position.z = J.cadera.z * 0.5 + 0.05;
    return J;
  }
  function ponerCamara(c) {
    var cam = MOTOR.camara,
      az = (c.az || 0) * Math.PI / 180,
      el = (c.el || 0) * Math.PI / 180,
      dist = c.dist || 5;
    var obj = v(c.dx || 0, c.y == null ? 0.95 : c.y, c.dz == null ? -0.05 : c.dz);
    cam.fov = c.fov || 30;
    cam.updateProjectionMatrix();
    cam.position.set(obj.x + dist * Math.sin(az) * Math.cos(el), obj.y + dist * Math.sin(el), obj.z + dist * Math.cos(az) * Math.cos(el));
    cam.up.set(0, 1, 0);
    cam.lookAt(obj);
    if (c.giro) cam.rotateZ(c.giro * Math.PI / 180);
    cam.updateMatrixWorld();
  }

  /* ---------------- API ---------------- */
  // una vista = pose + camara + musculos; se reusa para dibujar y para proyectar
  function vista(o) {
    return o;
  }
  function preparar(vt) {
    motor();
    var J = posar(vt);
    ponerCamara(vt.camara || {});
    return J;
  }
  function dibujar(canvas, vt) {
    var M = motor();
    preparar(vt);
    M.R.render(M.escena, M.camara);
    var cx = canvas.getContext('2d');
    cx.clearRect(0, 0, ANCHO, ALTO);
    cx.drawImage(M.R.domElement, 0, 0, ANCHO, ALTO);
  }
  // punto del cuerpo (o [x,y,z]) a coordenadas del lienzo
  function proyectar(vt, que) {
    var J = preparar(vt),
      THREE = global.THREE,
      P;
    if (Array.isArray(que)) P = v(que[0], que[1], que[2]);else if (que === 'dorsalI' || que === 'dorsalD' || que === 'romboides') {
      var obj = que === 'romboides' ? MOTOR.partes.romboides : MOTOR.partes.dorsal[que === 'dorsalI' ? 0 : 1];
      MOTOR.partes.torso.updateMatrixWorld(true);
      P = new THREE.Vector3();
      obj.getWorldPosition(P);
    } else P = J[que].clone();
    P.project(MOTOR.camara);
    return [(P.x + 1) / 2 * ANCHO, (1 - P.y) / 2 * ALTO];
  }
  function Lienzo(props) {
    var ref = React.useRef(null);
    React.useLayoutEffect(function () {
      if (ref.current && global.THREE) dibujar(ref.current, props.vista);
    });
    return /*#__PURE__*/React.createElement("canvas", {
      ref: ref,
      width: ANCHO,
      height: ALTO,
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO
      }
    });
  }
  // camara por tomas, como V.Camara: [[fraccion, {az, el, dist, y, ...}], ...]; dos tomas casi pegadas = corte
  function tomaEn(tomas, t) {
    var Easing = global.Easing;
    if (t <= tomas[0][0]) return tomas[0][1];
    for (var i = 0; i < tomas.length - 1; i++) {
      var a = tomas[i],
        b = tomas[i + 1];
      if (t >= a[0] && t <= b[0]) {
        var k = b[0] - a[0] < 0.005 ? 1 : Easing.easeInOutSine((t - a[0]) / (b[0] - a[0]));
        var r = {};
        ['az', 'el', 'dist', 'y', 'dx', 'dz', 'fov', 'giro'].forEach(function (c) {
          var va = a[1][c],
            vb = b[1][c];
          if (va == null && vb == null) return;
          if (va == null) va = vb;
          if (vb == null) vb = va;
          r[c] = lerp(va, vb, k);
        });
        return r;
      }
    }
    return tomas[tomas.length - 1][1];
  }
  global.TOR3D = {
    Lienzo: Lienzo,
    vista: vista,
    proyectar: proyectar,
    tomaEn: tomaEn,
    esqueleto: esqueleto
  };
})(window);
