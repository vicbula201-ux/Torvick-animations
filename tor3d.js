/* GENERADO por compilar.js desde tor3d.jsx — no editar a mano. */
/* ============================================================
   TOR EN 3D (window.TOR3D): el mismo Tor de siempre con volumen.
   Cuerpo blanco con sombreado casi plano, contorno negro grueso (casco
   invertido), cara como la del Tor dibujado, short gris y el musculo que
   trabaja en amarillo. Se dibuja con three.js (window.THREE) en un <canvas>
   debajo de los rotulos, las X y el sello del reel.

   Uso:
     var vista = TOR3D.vista({
       figuras: [{ quien: 'tor' | 'novia', pose, musc, cara, ropa, pesas }],   // pesas: 'neutro' | 'prono' | [x,y,z] | { I, D } (una por mano)
       objetos: [{ tipo: 'banco' | 'barra' | 'polea' | ..., ... }],
       camara: { az, el, dist, y, dx, dz, fov, giro }
     });
     <TOR3D.Lienzo vista={vista} />              // dibuja el cuadro
     TOR3D.proyectar(vista, 'manoD')             // -> [x, y] en el lienzo 1080x1920
     TOR3D.proyectar(vista, 'm:pecho', 1)        // centro de un musculo de la figura 1
     TOR3D.esqueleto(pose)                       // las articulaciones (mundo)

   Pose (todo en el mundo: y arriba, el piso en y = 0, Tor mira a +z y mide ~2,06):
     cadera [x, y, z]; tronco [inclina, gira, ladea] en grados (inclina + = hacia
     adelante, 90 = acostado boca abajo, -90 = boca arriba); cabeza [mira arriba,
     gira, ladea] respecto del tronco; manoI / manoD y pieI / pieD (tobillos)
     [x, y, z]; codoI / codoD y rodillaI / rodillaD: hacia donde doblan, en el
     marco del cuerpo [afuera, arriba, adelante]; hombros { sube, junta };
     pies [inclinaI, inclinaD] (punta abajo +); respira -1..1.
   La pose vieja del remo (bisagra, remo, balanceo, rodillas) sigue andando.

   Musculos (musc): pecho, abdomen, oblicuos, dorsal, romboides, trapecio,
   lumbar, deltoides, biceps, triceps, gluteos, cuadriceps, isquios, gemelos;
   cada uno true / 'amarillo', 'rojo', 'gris' o 'claro'; brillo 0..1.
   Cara (cara): ojos 'normal' | 'cerrados' | 'x' | 'llanto' | 'grandes' |
   'rojos' | 'borracho' | 'corazon'; boca 'sonrisa' | 'triste' | 'recta' |
   'abierta' | 'o' | 'ondulada' | 'dientes'; cejas 'enojo' | 'triste' |
   'alzadas'; color { c: 'verde' | 'rojo' | 'amarillo', v }; mejillas; nariz
   'roja'; parpadeo 0..1.
   Ropa (ropa): { camiseta, mangas, short } con colores de la paleta.
   Camara: az (0 de frente, 90 de costado, 180 de espaldas), el, dist, y, dx, dz.
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
    RED = 0xE03A2F,
    GRN = 0x16A06A;
  var G = 0.027; // grosor del contorno (en unidades del mundo; Tor mide ~2)
  var MOTOR = null;
  var SIN_FANTASMAS = true; // las copias difuminadas de las mancuernas se leian como video borroso (pedido del autor)
  // [base, sombra] de cada color con que se pinta un musculo o la ropa
  var TONOS = {
    amarillo: [YEL, 0xEBBE00],
    rojo: [RED, 0xB82A21],
    gris: [GRY, 0xB7AFA2],
    claro: [0xFFE680, 0xEBCB55],
    verde: [GRN, 0x0F7A50],
    blanco: [BLANCO, 0xF0ECE6],
    negro: [0x2B2623, INK]
  };
  function tono(c) {
    return TONOS[c] || (c === true || c === 1 ? TONOS.amarillo : null);
  }

  /* ---------------- materiales: dos tonos y contorno ---------------- */
  function hex3(h) {
    return new global.THREE.Color(h);
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
      fragmentShader: 'uniform vec3 base; uniform vec3 sombra; uniform float brillo; uniform vec3 colorBrillo; uniform vec3 luz; varying vec3 vN;' + 'void main(){ float l = dot(normalize(vN), luz); float k = smoothstep(-0.22, -0.1, l);' + 'vec3 c = mix(sombra, base, k); c = mix(c, colorBrillo, brillo); gl_FragColor = vec4(c, 1.0); }'
    });
  }
  // el short con los gluteos: la zona de cada gluteo (peso por vertice 'glu') se pinta sola cuando trabaja
  function toonGlu(base, sombra) {
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
        mus: {
          value: hex3(YEL)
        },
        musS: {
          value: hex3(0xEBBE00)
        },
        on: {
          value: 0
        },
        brilloMus: {
          value: 0
        },
        luz: {
          value: new THREE.Vector3(-0.55, 0.75, 0.6).normalize()
        }
      },
      vertexShader: 'attribute float glu; varying vec3 vN; varying float vG; void main(){ vN = normalize(normalMatrix * normal); vG = glu; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform vec3 base; uniform vec3 sombra; uniform float brillo; uniform vec3 colorBrillo; uniform vec3 mus; uniform vec3 musS; uniform float on; uniform float brilloMus; uniform vec3 luz; varying vec3 vN; varying float vG;' + 'void main(){ float l = dot(normalize(vN), luz); float k = smoothstep(-0.22, -0.1, l);' + 'float g = on * smoothstep(0.2, 0.26, vG);' + 'vec3 c = mix(mix(sombra, base, k), mix(musS, mus, k), g); c = mix(c, colorBrillo, brillo + brilloMus * g); gl_FragColor = vec4(c, 1.0); }'
    });
  }
  function pintar(mat, c, mezcla) {
    var t = tono(c) || TONOS.blanco;
    if (mezcla) {
      var b = hex3(BLANCO).lerp(hex3(t[0]), mezcla.v),
        s = hex3(0xF0ECE6).lerp(hex3(t[1]), mezcla.v);
      mat.uniforms.base.value.copy(b);
      mat.uniforms.sombra.value.copy(s);
      return;
    }
    mat.uniforms.base.value.setHex(t[0]);
    mat.uniforms.sombra.value.setHex(t[1]);
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
  var ESFERA = null;
  function elipsoide(rx, ry, rz, mat, grosor) {
    var THREE = global.THREE,
      gg = grosor == null ? G : grosor;
    if (!ESFERA) ESFERA = new THREE.SphereGeometry(1, 40, 28);
    return conBorde(ESFERA, gg ? ESFERA : null, mat, [rx, ry, rz], [rx + gg, ry + gg, rz + gg]);
  }
  function capsula(r, largo, mat, grosor) {
    var THREE = global.THREE,
      gg = grosor == null ? G : grosor;
    var g = conBorde(new THREE.CapsuleGeometry(r, largo, 10, 28), gg ? new THREE.CapsuleGeometry(r + gg, largo, 10, 28) : null, mat);
    g.userData.largo = largo;
    return g;
  }
  function cilindro(r, h, lados, mat, grosor) {
    var THREE = global.THREE,
      gg = grosor == null ? G * 0.8 : grosor;
    var g = conBorde(new THREE.CylinderGeometry(r, r, h, lados), gg ? new THREE.CylinderGeometry(r + gg, r + gg, h + gg * 1.75, lados) : null, mat);
    g.userData.largo = h;
    return g;
  }
  function caja(w, h, d, mat, grosor) {
    var THREE = global.THREE,
      gg = grosor == null ? G * 0.8 : grosor;
    return conBorde(new THREE.BoxGeometry(w, h, d), gg ? new THREE.BoxGeometry(w + 2 * gg, h + 2 * gg, d + 2 * gg) : null, mat);
  }
  // rectangulo de esquinas redondas (para los cojines de los bancos)
  function rrect(w, h, r) {
    var THREE = global.THREE,
      s = new THREE.Shape(),
      x = -w / 2,
      y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  // cojin: ancho (x), alto (y), largo (z), con bordes redondeados
  function cojin(w, h, d, mat) {
    var THREE = global.THREE,
      b = Math.min(0.03, h * 0.3, w * 0.3);
    function geo(e) {
      var g = new THREE.ExtrudeGeometry(rrect(w + 2 * e - 2 * b, d + 2 * e - 2 * b, Math.min(0.05, (Math.min(w, d) - 2 * b) * 0.3)), {
        depth: Math.max(0.005, h + 2 * e - 2 * b),
        bevelEnabled: true,
        bevelThickness: b,
        bevelSize: b,
        bevelSegments: 3,
        curveSegments: 6
      });
      g.rotateX(-Math.PI / 2);
      g.center();
      return g;
    }
    return conBorde(geo(0), geo(G * 0.8), mat);
  }
  // cuerpo de revolucion con seccion eliptica: perfil [[y, r]], ez = profundidad / ancho
  function tuboEliptico(perfil, ez, extra, bulto) {
    var THREE = global.THREE,
      seg = bulto ? 96 : 48,
      pos = [],
      idx = [],
      pesos = [];
    if (bulto) {
      // perfil mas fino para que el bulto quede redondo
      var fino = [];
      perfil.forEach(function (p, i) {
        if (i === 0) {
          fino.push(p);
          return;
        }
        var q = perfil[i - 1],
          n = Math.max(1, Math.ceil(Math.abs(p[0] - q[0]) / 0.008));
        for (var k = 1; k <= n; k++) fino.push([q[0] + (p[0] - q[0]) * k / n, q[1] + (p[1] - q[1]) * k / n]);
      });
      perfil = fino;
    }
    perfil.forEach(function (p) {
      for (var j = 0; j <= seg; j++) {
        var a = j / seg * Math.PI * 2,
          r = p[1] + extra,
          b = bulto && p[1] > 0.01 ? bulto(p[0], a) : null,
          d = b ? b.d : 0;
        pos.push(Math.cos(a) * (r + d * 0.5), p[0], Math.sin(a) * (p[1] * ez + extra + d));
        pesos.push(b ? b.w : 0);
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
    if (bulto) geo.setAttribute('glu', new THREE.Float32BufferAttribute(pesos, 1));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    return geo;
  }
  function tubo(perfil, ez, mat, bulto) {
    var ext = perfil.slice();
    ext.unshift([perfil[0][0] - G, 0.001]);
    ext.push([perfil[perfil.length - 1][0] + G, 0.001]);
    return conBorde(tuboEliptico(perfil, ez, 0, bulto), tuboEliptico(ext, ez, G, bulto), mat);
  }
  // los gluteos como parte del short: dos lobulos atras (a = 270 grados), con la raya del medio
  function bultoGluteos(q) {
    var atras = Math.PI * 1.5;
    return function (y, a) {
      var vy = y - q.yc,
        wy = Math.exp(-(vy * vy) / ((vy > 0 ? q.sup : q.sdn) * (vy > 0 ? q.sup : q.sdn)));
      var w = 0;
      [-1, 1].forEach(function (lado) {
        var da = a - (atras + lado * q.d);
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        w = Math.max(w, Math.exp(-(da * da) / (q.sa * q.sa)) * wy);
      });
      return {
        d: q.A * w,
        w: w
      };
    };
  }
  function radioEn(perfil, y) {
    for (var i = 0; i < perfil.length - 1; i++) {
      var a = perfil[i],
        b = perfil[i + 1];
      if (y >= a[0] && y <= b[0]) return a[1] + (b[1] - a[1]) * (y - a[0]) / (b[0] - a[0]);
    }
    return 0;
  }
  // linea de tinta sobre una superficie (pectorales, sonrisa, rodillas)
  function trazo(puntos, r, mat) {
    var THREE = global.THREE;
    var curva = new THREE.CatmullRomCurve3(puntos.map(function (p) {
      return new THREE.Vector3(p[0], p[1], p[2]);
    }));
    return new THREE.Mesh(new THREE.TubeGeometry(curva, Math.max(8, puntos.length * 4), r, 8, false), mat || MOTOR.mat.tinta);
  }
  // brazo o pierna: radios [[t, r]] de un extremo (t 0) al otro (t 1), con puntas redondas
  function miembro(radios, largo, mat) {
    var r0 = radios[0][1],
      r1 = radios[radios.length - 1][1],
      perfil = [],
      i,
      a;
    for (i = 0; i <= 6; i++) {
      a = i / 6 * Math.PI / 2;
      perfil.push([-largo / 2 - r0 * Math.cos(a), Math.max(r0 * Math.sin(a), 0.002)]);
    }
    radios.forEach(function (q) {
      if (q[0] > 0 && q[0] < 1) perfil.push([-largo / 2 + largo * q[0], q[1]]);
    });
    for (i = 0; i <= 6; i++) {
      a = i / 6 * Math.PI / 2;
      perfil.push([largo / 2 + r1 * Math.sin(a), Math.max(r1 * Math.cos(a), 0.002)]);
    }
    var g = tubo(perfil, 1, mat);
    g.userData.largo = largo;
    g.userData.radios = radios;
    return g;
  }
  function radioMiembro(radios, t) {
    for (var i = 0; i < radios.length - 1; i++) {
      var a = radios[i],
        b = radios[i + 1];
      if (t >= a[0] && t <= b[0]) return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
    }
    return radios[radios.length - 1][1];
  }
  // la cabeza de Tor: un huevo, mas ancho arriba y angosto en la pera
  function angosta(y) {
    return y < 0 ? 1 - 0.2 * y * y : 1 - 0.04 * y * y;
  }
  function huevo(rx, ry, rz, mat) {
    var THREE = global.THREE,
      geo = new THREE.SphereGeometry(1, 48, 32),
      pos = geo.attributes.position;
    for (var i = 0; i < pos.count; i++) {
      var k = angosta(pos.getY(i));
      pos.setX(i, pos.getX(i) * k);
      pos.setZ(i, pos.getZ(i) * k);
    }
    geo.computeVertexNormals();
    return conBorde(geo, geo, mat, [rx, ry, rz], [rx + G, ry + G, rz + G]);
  }

  /* ---------------- medidas de cada personaje ---------------- */
  var TIPOS = {
    tor: {
      torso: [[0.0, 0.238], [0.1, 0.228], [0.2, 0.24], [0.3, 0.278], [0.4, 0.305], [0.48, 0.314], [0.55, 0.304], [0.6, 0.282], [0.64, 0.245], [0.675, 0.192], [0.705, 0.135], [0.722, 0.088]],
      ez: 0.62,
      short: [[-0.13, 0.02], [-0.125, 0.155], [-0.09, 0.245], [-0.03, 0.272], [0.03, 0.272], [0.08, 0.264], [0.12, 0.258], [0.16, 0.254], [0.17, 0.02]],
      gluteo: {
        A: 0.026,
        d: 0.36,
        sa: 0.42,
        yc: -0.06,
        sup: 0.1,
        sdn: 0.075
      },
      cabeza: [0.135, 0.158, 0.145],
      ojoX: 0.052,
      brazo: [[0, 0.08], [0.45, 0.088], [1, 0.066]],
      ante: [[0, 0.068], [0.3, 0.071], [1, 0.054]],
      muslo: [[0, 0.07], [0.1, 0.122], [0.55, 0.106], [1, 0.08]],
      pierna: [[0, 0.078], [0.3, 0.086], [1, 0.056]],
      delt: 0.084,
      mano: 0.07,
      hx: 0.3,
      cx: 0.135,
      pernera: 0.148,
      finPernera: 0.4,
      cuello: 0.082
    },
    novia: {
      torso: [[0.0, 0.262], [0.1, 0.206], [0.18, 0.174], [0.26, 0.182], [0.34, 0.214], [0.42, 0.24], [0.5, 0.246], [0.56, 0.238], [0.6, 0.218], [0.635, 0.178], [0.665, 0.13], [0.688, 0.075]],
      ez: 0.62,
      short: [[-0.155, 0.02], [-0.152, 0.12], [-0.14, 0.2], [-0.115, 0.262], [-0.08, 0.308], [-0.03, 0.336], [0.03, 0.318], [0.08, 0.278], [0.12, 0.244], [0.15, 0.226], [0.16, 0.02]],
      gluteo: {
        A: 0.062,
        d: 0.42,
        sa: 0.45,
        yc: -0.075,
        sup: 0.11,
        sdn: 0.08
      },
      busto: [0.078, 0.07, 0.06],
      cabeza: [0.124, 0.148, 0.134],
      ojoX: 0.048,
      brazo: [[0, 0.062], [0.45, 0.064], [1, 0.05]],
      ante: [[0, 0.052], [0.3, 0.054], [1, 0.042]],
      muslo: [[0, 0.08], [0.1, 0.146], [0.5, 0.114], [1, 0.074]],
      pierna: [[0, 0.07], [0.3, 0.08], [1, 0.05]],
      delt: 0.07,
      mano: 0.058,
      hx: 0.24,
      cx: 0.138,
      pernera: 0,
      finPernera: 0,
      cuello: 0.064
    }
  };

  /* ---------------- una figura (Tor o la novia) ---------------- */
  function crearFigura(quien) {
    var THREE = global.THREE,
      m = MOTOR.mat,
      D = TIPOS[quien] || TIPOS.tor;
    var fig = {
      quien: quien,
      D: D,
      raiz: new THREE.Group(),
      p: {},
      mus: {},
      mats: {}
    };
    MOTOR.escena.add(fig.raiz);
    var p = fig.p,
      raiz = fig.raiz,
      mats = fig.mats;
    mats.piel = toon(BLANCO, 0xF0ECE6);
    mats.cabeza = toon(BLANCO, 0xF0ECE6);
    mats.short = toon(GRY, 0xB7AFA2);
    mats.camiseta = toon(GRY, 0xB7AFA2);
    mats.pierna = quien === 'novia' ? mats.short : mats.piel;
    var musculo = function (nombre, obj) {
      if (!fig.mus[nombre]) fig.mus[nombre] = {
        mat: toon(YEL, 0xEBBE00),
        objs: []
      };
      if (obj) {
        obj.userData.relleno.material = fig.mus[nombre].mat;
        fig.mus[nombre].objs.push(obj);
      }
      return fig.mus[nombre];
    };
    var parche = function (nombre, rx, ry, rz) {
      var o = elipsoide(rx, ry, rz, m.blanco, 0.012);
      musculo(nombre, o);
      return o;
    };

    // tronco
    var TOR = D.torso,
      EZ = D.ez;
    p.torso = tubo(TOR, EZ, mats.piel);
    var surf = function (x, y, lado) {
      var r = radioEn(TOR, y);
      return lado * EZ * Math.sqrt(Math.max(r * r - x * x, 0.0001));
    };
    fig.surf = surf;
    [-1, 1].forEach(function (s) {
      var d = parche('dorsal', D.hx * 0.33, 0.17, 0.06);
      d.position.set(s * D.hx * 0.55, 0.34, surf(D.hx * 0.55, 0.34, -1) * 0.93);
      d.rotation.set(0.15, s * 0.5, s * -0.3);
      p.torso.add(d);
      var pe = parche('pecho', D.hx * 0.38, 0.062, 0.026);
      pe.position.set(s * D.hx * 0.4, 0.5, surf(D.hx * 0.4, 0.5, 1) * 0.985);
      pe.rotation.set(-0.15, s * 0.32, 0);
      // el trapecio tambien se ve de frente: la bajada del cuello al hombro
      var tz = parche('trapecio', 0.1, 0.03, 0.075);
      tz.position.set(s * 0.15, 0.636, -0.015);
      tz.rotation.set(0, 0, s * -0.55);
      p.torso.add(tz);
      p.torso.add(pe);
      var ob = parche('oblicuos', 0.05, 0.12, 0.08);
      var xr = radioEn(TOR, 0.22) * 0.86;
      ob.position.set(s * xr, 0.22, surf(xr, 0.22, 1) * 0.6);
      ob.rotation.set(0, s * 0.9, 0);
      p.torso.add(ob);
    });
    // la panza que crece (panza 0..1): un ovalo blanco al frente
    p.panza = elipsoide(0.2, 0.17, 0.12, mats.piel);
    p.panza.position.set(0, 0.2, surf(0, 0.2, 1) * 0.55);
    p.panza.visible = false;
    p.torso.add(p.panza);
    var ab = parche('abdomen', 0.095, 0.16, 0.04);
    ab.position.set(0, 0.24, surf(0, 0.24, 1) * 0.94);
    p.torso.add(ab);
    // los cuadritos del abdomen, solo cuando se enciende
    [0.06, 0.0, -0.06].forEach(function (y) {
      ab.add(trazo([[-0.07, y, 0.038], [0, y - 0.006, 0.042], [0.07, y, 0.038]], 0.006));
    });
    ab.add(trazo([[0, 0.13, 0.037], [0, 0, 0.042], [0, -0.13, 0.037]], 0.006));
    var ro = parche('romboides', D.hx * 0.35, 0.07, 0.045);
    ro.position.set(0, 0.5, surf(0, 0.5, -1) * 0.97);
    p.torso.add(ro);
    var tr = parche('trapecio', D.hx * 0.55, 0.06, 0.05);
    tr.position.set(0, 0.615, surf(0, 0.6, -1) * 0.8);
    tr.rotation.set(0.7, 0, 0);
    p.torso.add(tr);
    var lu = parche('lumbar', 0.11, 0.08, 0.04);
    lu.position.set(0, 0.13, surf(0, 0.13, -1) * 0.95);
    p.torso.add(lu);
    if (quien !== 'novia') {
      [-1, 1].forEach(function (s) {
        var pts = [];
        for (var i = 0; i <= 10; i++) {
          var x = s * (0.03 + 0.21 * i / 10),
            y = 0.44 - 0.05 * Math.sin(Math.PI * i / 10);
          pts.push([x, y, surf(x, y, 1) + 0.004]);
        }
        p.torso.add(trazo(pts, 0.011));
        // la tetilla: un punto chico arriba de la linea del pecho
        var tx = s * 0.138,
          ty = 0.418;
        var te = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), m.tinta);
        te.scale.set(0.013, 0.013, 0.006);
        te.position.set(tx, ty, surf(tx, ty, 1) + 0.001);
        te.lookAt(tx * 3, ty, surf(tx, ty, 1) * 3);
        p.torso.add(te);
      });
      // el six pack: la linea del medio y tres pares de cuadritos (siempre se ven)
      var enT = function (x, y) {
        return [x, y, surf(x, y, 1) + 0.003];
      };
      var med = [];
      for (var k = 0; k <= 8; k++) med.push(enT(0, 0.185 + 0.2 * k / 8));
      p.torso.add(trazo(med, 0.0068));
      [0.235, 0.29, 0.345].forEach(function (y) {
        [-1, 1].forEach(function (s) {
          var q = [];
          for (var k = 0; k <= 6; k++) {
            var x = s * (0.012 + 0.075 * k / 6);
            q.push(enT(x, y - 0.006 * Math.sin(Math.PI * k / 6)));
          }
          p.torso.add(trazo(q, 0.0062));
        });
      });
      // el borde de los oblicuos (la V que baja al short)
      [-1, 1].forEach(function (s) {
        var q = [];
        for (var k = 0; k <= 6; k++) {
          var u = k / 6;
          q.push(enT(s * (0.125 - 0.04 * u), 0.37 - 0.19 * u));
        }
        p.torso.add(trazo(q, 0.006, m.linea));
      });
    }
    raiz.add(p.torso);
    // short (o la calza de la novia)
    mats.shortG = toonGlu(GRY, 0xB7AFA2);
    p.short = tubo(D.short, 0.68, mats.shortG, bultoGluteos(D.gluteo));
    raiz.add(p.short);
    p.cinturon = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 8, 48), m.tinta);
    var rc = radioEn(D.short, 0.095);
    p.cinturon.rotation.x = Math.PI / 2;
    p.cinturon.scale.set(rc + 0.004, (rc + 0.004) * 0.68, 1);
    p.cinturon.position.y = 0.095;
    p.short.add(p.cinturon);
    // los gluteos: el short (o la calza) tiene dos lobulos atras; se pintan desde el shader cuando trabajan.
    // objs: dos marcas invisibles en el centro de cada uno (para proyectar 'm:gluteos')
    musculo('gluteos', null);
    fig.mus.gluteos.esPieza = true;
    fig.mus.gluteos.base = 'short';
    [-1, 1].forEach(function (s) {
      var gq = D.gluteo,
        a = Math.PI * 1.5 + s * gq.d,
        rg = radioEn(D.short, gq.yc);
      var ancla = new THREE.Object3D();
      ancla.position.set(Math.cos(a) * (rg + gq.A * 0.5), gq.yc, Math.sin(a) * (rg * 0.68 + gq.A));
      ancla.userData.relleno = {
        material: null
      };
      p.short.add(ancla);
      fig.mus.gluteos.objs.push(ancla);
    });
    if (quien === 'novia') {
      // la raya del medio, corta y fina
      var rq = [],
        ym;
      for (var k = 0; k <= 5; k++) {
        ym = -0.015 - 0.1 * k / 5;
        rq.push([0, ym, -(radioEn(D.short, ym) * 0.68 + D.gluteo.A * 0.42 * Math.exp(-Math.pow((ym - D.gluteo.yc) / (ym > D.gluteo.yc ? D.gluteo.sup : D.gluteo.sdn), 2))) - 0.002]);
      }
      p.short.add(trazo(rq, 0.0042));
    }
    // la camiseta (solo si lleva ropa)
    var perfC = TOR.filter(function (q) {
      return q[0] >= 0.08 && q[0] <= 0.645;
    }).map(function (q) {
      return [q[0], q[1] + 0.016];
    });
    p.camiseta = tubo(perfC, EZ + 0.02, mats.camiseta);
    p.camiseta.visible = false;
    raiz.add(p.camiseta);
    // la novia: top deportivo amarillo
    if (quien === 'novia') {
      var perfT = TOR.filter(function (q) {
        return q[0] >= 0.36 && q[0] <= 0.6;
      }).map(function (q) {
        return [q[0], q[1] + 0.014];
      });
      perfT.unshift([0.36, radioEn(TOR, 0.36) + 0.014]);
      p.top = tubo(perfT, EZ + 0.03, m.amarillo);
      p.torso.add(p.top);
      [-1, 1].forEach(function (s) {
        var bq = D.busto,
          bx = s * 0.082,
          by = 0.47;
        var bu = elipsoide(bq[0], bq[1], bq[2], m.amarillo, 0.016);
        bu.position.set(bx, by, surf(bx, by, 1) * 0.78 + 0.02);
        bu.rotation.set(0.1, s * 0.25, 0);
        p.torso.add(bu);
      });
    }
    p.cuello = capsula(D.cuello, 0.12, mats.piel);
    raiz.add(p.cuello);

    // cabeza y cara
    var cx = D.cabeza[0],
      cy = D.cabeza[1],
      cz = D.cabeza[2];
    var enCara = function (x, y) {
      var k = angosta(y / cy);
      return cz * k * Math.sqrt(Math.max(1 - x / (cx * k) * (x / (cx * k)) - y / cy * (y / cy), 0.01)) + 0.003;
    };
    fig.enCara = enCara;
    p.cabeza = new THREE.Group();
    p.cabeza.add(huevo(cx, cy, cz, mats.cabeza));
    [-1, 1].forEach(function (s) {
      var o = elipsoide(0.024, 0.05, 0.036, mats.cabeza, 0.014);
      o.position.set(s * (cx + 0.008), -0.012, -0.012);
      p.cabeza.add(o);
    });
    fig.cara = construirCara(fig, enCara);
    if (quien === 'novia') {
      // pelo negro: casquete arriba y atras, y la cola de caballo
      var pelo = m.pelo;
      var casq = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20, 0, Math.PI * 2, 0, Math.PI * 0.42), pelo);
      casq.scale.set(cx + 0.018, cy + 0.02, cz + 0.018);
      casq.position.y = 0.006;
      p.cabeza.add(casq);
      var nuca = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20, Math.PI, Math.PI, Math.PI * 0.3, Math.PI * 0.48), pelo);
      nuca.scale.set(cx + 0.016, cy + 0.016, cz + 0.016);
      p.cabeza.add(nuca);
      // pestanas
      [-1, 1].forEach(function (s) {
        var x0 = s * (D.ojoX + 0.014),
          y0 = 0.024;
        p.cabeza.add(trazo([[x0, y0, enCara(x0, y0)], [x0 + s * 0.016, y0 + 0.014, enCara(x0 + s * 0.016, y0 + 0.014) - 0.004]], 0.0055));
      });
      p.cola = [0.058, 0.066, 0.06, 0.045].map(function (r) {
        var c = elipsoide(r, r * 1.35, r, m.pelo, 0);
        raiz.add(c);
        return c;
      });
      p.colita = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.012, 8, 20), m.amarillo);
      raiz.add(p.colita);
    }
    raiz.add(p.cabeza);

    // brazos y piernas
    ['I', 'D'].forEach(function (L) {
      p['delt' + L] = elipsoide(D.delt, D.delt * 1.02, D.delt * 1.02, mats.piel);
      raiz.add(p['delt' + L]);
      musculo('deltoides', null);
      fig.mus.deltoides.objs.push(p['delt' + L]);
      fig.mus.deltoides.esPieza = true;
      p['brazo' + L] = miembro(D.brazo, 0.41, mats.piel);
      raiz.add(p['brazo' + L]);
      if (quien !== 'novia') {
        var bi = [],
          rb = radioMiembro(D.brazo, 0.45) + 0.003;
        for (var j = 0; j <= 6; j++) {
          var an = -0.5 + j / 6;
          bi.push([Math.sin(an) * rb, -0.06 + 0.13 * j / 6, Math.cos(an) * rb]);
        }
        p['brazo' + L].add(trazo(bi, 0.0075, m.linea));
      }
      var rB = radioMiembro(D.brazo, 0.5);
      var b1 = parche('biceps', rB * 0.7, 0.12, 0.04);
      b1.position.set(0, 0.03, rB * 0.86);
      p['brazo' + L].add(b1);
      var t1 = parche('triceps', rB * 0.72, 0.14, 0.04);
      t1.position.set(0, -0.0, -rB * 0.86);
      p['brazo' + L].add(t1);
      p['manga' + L] = cilindro(radioMiembro(D.brazo, 0.1) + 0.022, 0.17, 32, mats.camiseta);
      p['manga' + L].visible = false;
      raiz.add(p['manga' + L]);
      p['ante' + L] = miembro(D.ante, 0.39, mats.piel);
      raiz.add(p['ante' + L]);
      p['mano' + L] = elipsoide(D.mano, D.mano * 1.03, D.mano, mats.piel);
      raiz.add(p['mano' + L]);
      p['muslo' + L] = miembro(D.muslo, 0.43, mats.pierna);
      raiz.add(p['muslo' + L]);
      var rM = radioMiembro(D.muslo, 0.62);
      var q1 = parche('cuadriceps', rM * 0.72, 0.15, 0.045);
      q1.position.set(0, 0.07, rM * 0.86);
      p['muslo' + L].add(q1);
      var i1 = parche('isquios', rM * 0.72, 0.15, 0.045);
      i1.position.set(0, 0.07, -rM * 0.86);
      p['muslo' + L].add(i1);
      if (D.pernera) {
        p['pernera' + L] = cilindro(D.pernera, 0.2, 32, mats.short);
        raiz.add(p['pernera' + L]);
      }
      p['pierna' + L] = miembro(D.pierna, 0.43, mats.pierna);
      raiz.add(p['pierna' + L]);
      var rP = radioMiembro(D.pierna, 0.3);
      var g1 = parche('gemelos', rP * 0.7, 0.11, 0.04);
      g1.position.set(0, -0.1, -rP * 0.86);
      p['pierna' + L].add(g1);
      if (quien !== 'novia') {
        // la marca de la rodilla (una U chica al frente)
        var ro2 = [];
        for (var q = 0; q <= 8; q++) {
          var xr2 = -0.034 + 0.068 * q / 8;
          ro2.push([xr2, -0.215 + 0.045 - 0.016 * Math.sin(Math.PI * q / 8), Math.sqrt(Math.max(0.079 * 0.079 - xr2 * xr2, 0)) + 0.002]);
        }
        p['pierna' + L].add(trazo(ro2, 0.0075));
      }
      p['pie' + L] = new THREE.Group();
      var z = elipsoide(0.105, 0.056, 0.175, m.blanco);
      z.position.set(0, 0.012, 0.06);
      p['pie' + L].add(z);
      var suela = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.022, 0.33), m.tinta);
      suela.position.set(0, -0.036, 0.06);
      p['pie' + L].add(suela);
      raiz.add(p['pie' + L]);
      p['pesa' + L] = mancuerna(m.gris, m.blanco, true);
      p['pesa' + L].visible = false;
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
    p.sombra = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.5), m.sombra);
    p.sombra.rotation.x = -Math.PI / 2;
    p.sombra.position.y = 0.003;
    raiz.add(p.sombra);
    return fig;
  }

  // todas las caras posibles; en cada cuadro se prende la que pide la vista
  function construirCara(fig, enCara) {
    var THREE = global.THREE,
      m = MOTOR.mat,
      D = fig.D,
      ex = D.ojoX,
      ey = 0.008,
      my = -0.083;
    var grupo = function () {
      var g = new THREE.Group();
      g.visible = false;
      fig.p.cabeza.add(g);
      return g;
    };
    var punto = function (g, x, y, rx, ry, mat) {
      var o = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mat || m.tinta);
      o.scale.set(rx, ry, 0.01);
      o.position.set(x, y, enCara(x, y) - 0.004);
      g.add(o);
      return o;
    };
    var linea = function (g, pts, r) {
      g.add(trazo(pts.map(function (q) {
        return [q[0], q[1], enCara(q[0], q[1])];
      }), r || 0.0085));
    };
    var arco = function (x0, x1, y, h, n) {
      var pts = [];
      for (var i = 0; i <= (n || 8); i++) {
        var u = i / (n || 8);
        pts.push([x0 + (x1 - x0) * u, y - h * Math.sin(Math.PI * u)]);
      }
      return pts;
    };
    var c = {
      ojos: {},
      boca: {},
      cejas: {},
      nariz: {},
      mejillas: null
    };
    var o;
    o = c.ojos.normal = grupo();
    [-1, 1].forEach(function (s) {
      punto(o, s * ex, ey, 0.017, 0.021);
    });
    o = c.ojos.cerrados = grupo();
    [-1, 1].forEach(function (s) {
      linea(o, arco(s * ex - 0.022, s * ex + 0.022, ey + 0.002, 0.009), 0.0075);
    });
    o = c.ojos.x = grupo();
    [-1, 1].forEach(function (s) {
      linea(o, [[s * ex - 0.02, ey + 0.02], [s * ex + 0.02, ey - 0.02]], 0.0075);
      linea(o, [[s * ex - 0.02, ey - 0.02], [s * ex + 0.02, ey + 0.02]], 0.0075);
    });
    o = c.ojos.llanto = grupo();
    [-1, 1].forEach(function (s) {
      linea(o, [[s * ex + s * 0.02, ey + 0.02], [s * ex - s * 0.016, ey], [s * ex + s * 0.02, ey - 0.02]], 0.0075);
    });
    var grandes = function (g, dx, dy) {
      [-1, 1].forEach(function (s, i) {
        var b = new THREE.Group();
        var x = s * (ex + 0.004),
          y = ey + 0.006;
        var blanco = elipsoide(0.032, 0.04, 0.012, m.blanco, 0.006);
        b.add(blanco);
        var pu = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), m.tinta);
        pu.scale.set(0.015, 0.018, 0.01);
        pu.position.set((dx ? dx[i] : 0) * 0.014, (dy ? dy[i] : 0) * 0.016, 0.011);
        b.add(pu);
        b.position.set(x, y, enCara(x, y) - 0.008);
        g.add(b);
      });
    };
    o = c.ojos.grandes = grupo();
    grandes(o);
    o = c.ojos.borracho = grupo();
    grandes(o, [-1, 1], [0.6, -0.6]);
    o = c.ojos.rojos = grupo();
    [-1, 1].forEach(function (s) {
      punto(o, s * ex, ey - 0.004, 0.022, 0.011, m.rojo);
      linea(o, [[s * ex - 0.026, ey + 0.004], [s * ex + 0.026, ey + 0.004]], 0.0075);
    });
    o = c.ojos.espiral = grupo();
    [-1, 1].forEach(function (s) {
      var pts = [];
      for (var i = 0; i <= 28; i++) {
        var a = i / 28 * Math.PI * 4.2,
          r = 0.003 + 0.022 * i / 28;
        pts.push([s * ex + Math.cos(a * s) * r, ey + Math.sin(a * s) * r]);
      }
      linea(o, pts, 0.0055);
    });
    o = c.ojos.corazon = grupo();
    [-1, 1].forEach(function (s) {
      var sh = new THREE.Shape(),
        k = 0.026;
      sh.moveTo(0, -k * 0.9);
      sh.bezierCurveTo(k * 1.2, -k * 0.1, k * 0.9, k * 0.9, 0, k * 0.35);
      sh.bezierCurveTo(-k * 0.9, k * 0.9, -k * 1.2, -k * 0.1, 0, -k * 0.9);
      var h = new THREE.Mesh(new THREE.ShapeGeometry(sh), m.rojoPlano);
      var x = s * ex,
        y = ey;
      h.position.set(x, y, enCara(x, y) + 0.002);
      o.add(h);
    });
    o = c.boca.sonrisa = grupo();
    linea(o, arco(-0.042, 0.042, my, 0.018));
    o = c.boca.triste = grupo();
    linea(o, arco(-0.04, 0.04, my - 0.02, -0.018));
    o = c.boca.recta = grupo();
    linea(o, [[-0.035, my - 0.008], [0.035, my - 0.008]]);
    o = c.boca.ondulada = grupo();
    (function () {
      var pts = [];
      for (var i = 0; i <= 12; i++) {
        var u = i / 12;
        pts.push([-0.045 + 0.09 * u, my - 0.01 + 0.008 * Math.sin(u * Math.PI * 4)]);
      }
      linea(o, pts, 0.0075);
    })();
    o = c.boca.abierta = grupo();
    punto(o, 0, my - 0.012, 0.036, 0.026);
    o = c.boca.o = grupo();
    punto(o, 0, my - 0.01, 0.016, 0.02);
    o = c.boca.dientes = grupo();
    punto(o, 0, my - 0.012, 0.04, 0.026);
    punto(o, 0, my - 0.002, 0.032, 0.008, m.blancoPlano);
    o = c.cejas.enojo = grupo();
    [-1, 1].forEach(function (s) {
      linea(o, [[s * (ex + 0.026), 0.06], [s * (ex - 0.022), 0.044]], 0.0085);
    });
    o = c.cejas.triste = grupo();
    [-1, 1].forEach(function (s) {
      linea(o, [[s * (ex + 0.026), 0.044], [s * (ex - 0.022), 0.062]], 0.0085);
    });
    o = c.cejas.alzadas = grupo();
    [-1, 1].forEach(function (s) {
      linea(o, arco(s * ex - 0.026, s * ex + 0.026, 0.072, -0.01), 0.0085);
    });
    o = c.nariz.linea = grupo();
    linea(o, [[0, -0.022], [0, -0.05]], 0.0075);
    o = c.nariz.roja = grupo();
    punto(o, 0, -0.036, 0.026, 0.024, m.rojo);
    o = c.mejillas = grupo();
    [-1, 1].forEach(function (s) {
      punto(o, s * (ex + 0.03), -0.045, 0.026, 0.016, m.rubor);
    });
    return c;
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
    var SS = global.TOR3D_SS || 2;
    R.setPixelRatio(1);
    R.setSize(ANCHO * SS, ALTO * SS, false);
    R.setClearColor(0xffffff, 1);
    var cv = document.createElement('canvas');
    cv.width = cv.height = 256;
    var cx = cv.getContext('2d'),
      gr = cx.createRadialGradient(128, 128, 10, 128, 128, 128);
    gr.addColorStop(0, 'rgba(20,17,15,0.34)');
    gr.addColorStop(0.55, 'rgba(20,17,15,0.14)');
    gr.addColorStop(1, 'rgba(20,17,15,0)');
    cx.fillStyle = gr;
    cx.fillRect(0, 0, 256, 256);
    MOTOR = {
      R: R,
      escena: new THREE.Scene(),
      camara: new THREE.PerspectiveCamera(30, ANCHO / ALTO, 0.05, 60),
      mat: {
        blanco: toon(BLANCO, 0xF0ECE6),
        gris: toon(GRY, 0xB7AFA2),
        amarillo: toon(YEL, 0xEBBE00),
        rojo: toon(RED, 0xB82A21),
        verde: toon(GRN, 0x0F7A50),
        oscuro: toon(0x2B2623, INK),
        pelo: toon(0x2B2623, INK),
        tinta: new THREE.MeshBasicMaterial({
          color: INK
        }),
        borde: borde(),
        linea: new THREE.MeshBasicMaterial({
          color: GRY
        }),
        blancoPlano: new THREE.MeshBasicMaterial({
          color: BLANCO
        }),
        rojoPlano: new THREE.MeshBasicMaterial({
          color: RED,
          side: THREE.DoubleSide
        }),
        rubor: new THREE.MeshBasicMaterial({
          color: RED,
          transparent: true,
          opacity: 0.35,
          depthWrite: false
        }),
        fantasma: [0.32, 0.2, 0.12].map(function (o) {
          return new THREE.MeshBasicMaterial({
            color: 0x8A8278,
            transparent: true,
            opacity: o,
            depthWrite: false
          });
        }),
        sombra: new THREE.MeshBasicMaterial({
          map: new THREE.CanvasTexture(cv),
          transparent: true,
          depthWrite: false
        })
      },
      figuras: {
        tor: [],
        novia: []
      },
      objetos: {}
    };
    MOTOR.mat.pelo.side = THREE.DoubleSide;
    return MOTOR;
  }

  /* ---------------- el esqueleto ---------------- */
  function v(x, y, z) {
    return new global.THREE.Vector3(x, y, z);
  }
  function vec(a, def) {
    return a ? a.isVector3 ? a.clone() : v(a[0], a[1], a[2]) : def;
  }
  function lerp(a, b, k) {
    return a + (b - a) * k;
  }
  var RAD = Math.PI / 180;
  // dos huesos: raiz A, objetivo T, largos l1 y l2, hacia donde dobla (polo)
  function ik(A, T, l1, l2, polo) {
    var d = T.clone().sub(A),
      dist = Math.min(Math.max(d.length(), 0.05), l1 + l2 - 1e-4);
    var eje = d.normalize();
    var a = (l1 * l1 + dist * dist - l2 * l2) / (2 * dist),
      h = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
    var p = polo.clone().sub(eje.clone().multiplyScalar(polo.dot(eje)));
    if (p.length() < 1e-4) p = v(0, 0, 1).sub(eje.clone().multiplyScalar(eje.z));
    p.normalize();
    var fin = A.clone().add(eje.clone().multiplyScalar(dist));
    return {
      codo: A.clone().add(eje.clone().multiplyScalar(a)).add(p.multiplyScalar(h)),
      fin: fin
    };
  }
  function marco(ang) {
    // ang = [inclina, gira, ladea] en grados: gira sobre el eje del mundo, inclina hacia adelante, ladea
    var THREE = global.THREE,
      a = ang || [0, 0, 0];
    var q = new THREE.Quaternion().setFromEuler(new THREE.Euler((a[0] || 0) * RAD, (a[1] || 0) * RAD, (a[2] || 0) * RAD, 'YXZ'));
    return {
      q: q,
      X: v(1, 0, 0).applyQuaternion(q),
      d: v(0, 1, 0).applyQuaternion(q),
      fr: v(0, 0, 1).applyQuaternion(q)
    };
  }
  function enMarco(F, x, y, z) {
    return F.X.clone().multiplyScalar(x).add(F.d.clone().multiplyScalar(y)).add(F.fr.clone().multiplyScalar(z));
  }

  // la pose vieja del remo inclinado (bisagra, remo, balanceo)
  function esqueletoRemo(o) {
    var b = o.bisagra || 0,
      kn = o.rodillas == null ? b : o.rodillas,
      k = o.remo || 0,
      sw = o.balanceo || 0,
      resp = o.respira || 0;
    var X = v(1, 0, 0),
      J = {
        X: X
      };
    J.cadera = v(0, 1.0 - 0.035 * b - 0.03 * kn + 0.006 * resp, -0.21 * b + 0.015 * kn);
    var ang = (3 + 50 * b - 26 * sw * b) * RAD;
    var d = v(0, Math.cos(ang), Math.sin(ang)),
      fr = v(0, -Math.sin(ang), Math.cos(ang));
    J.d = d;
    J.fr = fr;
    J.cuello = J.cadera.clone().add(d.clone().multiplyScalar(0.665 + 0.006 * resp));
    ['I', 'D'].forEach(function (L, i) {
      var s = i ? 1 : -1;
      var Hj = J.cadera.clone().add(X.clone().multiplyScalar(s * 0.135)).add(v(0, -0.04, 0));
      var A = v(s * 0.155, 0.115, 0);
      var r = ik(Hj, A, 0.43, 0.43, v(s * 0.15, 0, 1));
      J['caderaJ' + L] = Hj;
      J['rodilla' + L] = r.codo;
      J['tobillo' + L] = A;
      J['pieAng' + L] = 0;
      var S = J.cuello.clone().sub(d.clone().multiplyScalar(0.1)).add(X.clone().multiplyScalar(s * (0.3 - 0.03 * k))).add(fr.clone().multiplyScalar(0.03 - 0.06 * k));
      J['hombro' + L] = S;
      var abajo = S.clone().add(v(s * 0.04, -0.74, 0.05));
      var arriba = J.cadera.clone().add(d.clone().multiplyScalar(0.2)).add(X.clone().multiplyScalar(s * 0.3)).add(fr.clone().multiplyScalar(0.06));
      var W = abajo.clone().lerp(arriba, k).add(X.clone().multiplyScalar(s * 0.04 * Math.sin(Math.PI * k)));
      var polo = fr.clone().multiplyScalar(-1).add(X.clone().multiplyScalar(s * 0.35)).add(v(0, 0.2, 0));
      var a = brazoSinChoques(J, TIPOS.tor, {
        X: X,
        d: d,
        fr: fr
      }, S, W, 0.41, 0.39, polo, 0.12);
      J['codo' + L] = a.codo;
      J['mano' + L] = a.fin;
    });
    var ca = (o.cabeza != null ? o.cabeza : 24 * b) * RAD;
    J.hd = d.clone().multiplyScalar(Math.cos(ca)).sub(fr.clone().multiplyScalar(Math.sin(ca)));
    J.hf = fr.clone().multiplyScalar(Math.cos(ca)).add(d.clone().multiplyScalar(Math.sin(ca)));
    J.hX = X.clone();
    J.cabeza = J.cuello.clone().add(d.clone().multiplyScalar(0.25)).add(fr.clone().multiplyScalar(0.02));
    J.giro = 0;
    return J;
  }

  /* ---------------- que el cuerpo no se atraviese a si mismo ----------------
     Las manos y los codos no entran al tronco, al short, a los muslos ni a la
     cabeza: si un objetivo cae adentro se empuja a la superficie (mas el radio de
     la mano, o el de la mancuerna si la lleva) y se vuelve a resolver el brazo. */
  function fueraCapsula(p, a, b, r) {
    var ab = b.clone().sub(a),
      t = clamp01(p.clone().sub(a).dot(ab) / Math.max(ab.lengthSq(), 1e-6));
    var c = a.clone().add(ab.multiplyScalar(t)),
      d = p.clone().sub(c),
      l = d.length();
    if (l >= r) return p;
    if (l < 1e-4) d = v(1, 0, 0);
    return c.add(d.normalize().multiplyScalar(r));
  }
  function fueraDelCuerpo(J, D, F, p, margen) {
    var q = p.clone();
    var v0 = q.clone().sub(J.cadera),
      y = v0.dot(F.d);
    if (y > -0.14 && y < 0.74) {
      var x = v0.dot(F.X),
        z = v0.dot(F.fr);
      var enShort = y < 0.15;
      var r = enShort ? Math.max(radioEn(D.short, y), y > 0 ? radioEn(D.torso, y) : 0) : radioEn(D.torso, Math.min(y, 0.72));
      var ez = enShort ? 0.68 : D.ez;
      var rx = r + margen,
        rz = r * ez + margen;
      var k = x * x / (rx * rx) + z * z / (rz * rz);
      if (k < 1 && r > 0.03) {
        if (k < 1e-6) {
          x = rx;
          z = 0;
        } else {
          var fk = 1 / Math.sqrt(k);
          x *= fk;
          z *= fk;
        }
        q = J.cadera.clone().add(F.d.clone().multiplyScalar(y)).add(F.X.clone().multiplyScalar(x)).add(F.fr.clone().multiplyScalar(z));
      }
    }
    if (J.cabeza) {
      var rh = 0.165 + margen,
        dv = q.clone().sub(J.cabeza),
        dl = dv.length();
      if (dl < rh) {
        if (dl < 1e-4) dv = F.fr.clone();
        q = J.cabeza.clone().add(dv.normalize().multiplyScalar(rh));
      }
    }
    ['I', 'D'].forEach(function (L) {
      if (J['caderaJ' + L] && J['rodilla' + L]) q = fueraCapsula(q, J['caderaJ' + L], J['rodilla' + L], (D.pernera || 0.13) + margen);
      if (J['rodilla' + L] && J['tobillo' + L]) q = fueraCapsula(q, J['rodilla' + L], J['tobillo' + L], 0.075 + margen);
    });
    return q;
  }
  function brazoSinChoques(J, D, F, S, W, l1, l2, polo, margen) {
    var W2 = fueraDelCuerpo(J, D, F, W, margen);
    var a = ik(S, W2, l1, l2, polo);
    var E2 = fueraDelCuerpo(J, D, F, a.codo, 0.085);
    if (E2.distanceTo(a.codo) > 0.005) {
      var mid = S.clone().add(a.fin).multiplyScalar(0.5);
      a = ik(S, W2, l1, l2, E2.clone().sub(mid));
    }
    var fin2 = fueraDelCuerpo(J, D, F, a.fin, margen);
    if (fin2.distanceTo(a.fin) > 0.005) a = ik(S, fin2, l1, l2, a.codo.clone().sub(S.clone().add(fin2).multiplyScalar(0.5)));
    return a;
  }

  // pose general: puntos explicitos y codos y rodillas por IK
  function esqueleto(o, quien) {
    o = o || {};
    if (o.bisagra != null || o.remo != null || o.balanceo != null) return esqueletoRemo(o);
    var D = TIPOS[quien] || TIPOS.tor,
      resp = o.respira || 0;
    var F = marco(o.tronco),
      J = {
        X: F.X,
        d: F.d,
        fr: F.fr
      };
    var Fy = marco([0, (o.tronco || [])[1] || 0, 0]); // la pelvis gira con el tronco, sin inclinarse
    J.giro = (o.tronco || [])[1] || 0;
    J.cadera = vec(o.cadera, v(0, 1.0, 0)).add(F.d.clone().multiplyScalar(0.006 * resp));
    J.cuello = J.cadera.clone().add(F.d.clone().multiplyScalar(0.665 + 0.006 * resp));
    var hs = o.hombros || {},
      sube = hs.sube || 0,
      junta = hs.junta || 0;
    ['I', 'D'].forEach(function (L, i) {
      var s = i ? 1 : -1;
      var Hj = J.cadera.clone().add(F.X.clone().multiplyScalar(s * D.cx)).sub(F.d.clone().multiplyScalar(0.04));
      var A = vec(o['pie' + L], Hj.clone().add(Fy.X.clone().multiplyScalar(s * 0.02)).setY(0.115));
      var pr = o['rodilla' + L] || [0.15, 0, 1];
      var r = ik(Hj, A, 0.43, 0.43, enMarco(F, s * pr[0], pr[1], pr[2]));
      J['caderaJ' + L] = Hj;
      J['rodilla' + L] = r.codo;
      J['tobillo' + L] = r.fin;
      J['pieAng' + L] = (o.pies || [])[i] || 0;
    });
    // cabeza: mira arriba (+), gira, ladea respecto del tronco
    var c = o.cabeza || [0, 0, 0];
    var THREE = global.THREE;
    var qh = F.q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(-(c[0] || 0) * RAD, (c[1] || 0) * RAD, (c[2] || 0) * RAD, 'YXZ')));
    J.hd = v(0, 1, 0).applyQuaternion(qh);
    J.hf = v(0, 0, 1).applyQuaternion(qh);
    J.hX = v(1, 0, 0).applyQuaternion(qh);
    J.cabeza = J.cuello.clone().add(J.hd.clone().multiplyScalar(0.23)).add(F.d.clone().multiplyScalar(0.02)).add(J.hf.clone().multiplyScalar(0.02));
    // brazos, sin atravesar el cuerpo (con mancuernas, el margen es el del disco)
    var margen = o._pesas ? 0.12 : 0.075;
    ['I', 'D'].forEach(function (L, i) {
      var s = i ? 1 : -1;
      var S = J.cuello.clone().sub(F.d.clone().multiplyScalar(0.1 - 0.06 * sube)).add(F.X.clone().multiplyScalar(s * (D.hx - 0.03 * junta))).add(F.fr.clone().multiplyScalar(0.03 - 0.06 * junta));
      J['hombro' + L] = S;
      var W = vec(o['mano' + L], S.clone().add(v(0, -0.74, 0)).add(F.X.clone().multiplyScalar(s * 0.04)).add(F.fr.clone().multiplyScalar(0.05)));
      var pc = o['codo' + L] || [0.35, 0.2, -1];
      var a = o._libre ? ik(S, W, 0.41, 0.39, enMarco(F, s * pc[0], pc[1], pc[2])) : brazoSinChoques(J, D, F, S, W, 0.41, 0.39, enMarco(F, s * pc[0], pc[1], pc[2]), margen);
      J['codo' + L] = a.codo;
      J['mano' + L] = a.fin;
    });
    return J;
  }

  /* ---------------- ubicar las piezas ---------------- */
  var Y = null;
  // la pieza va de a a b; si tiene largo propio, se estira lo justo para unirlos
  function entre(obj, a, b, frente) {
    if (!Y) Y = v(0, 1, 0);
    var dir = b.clone().sub(a),
      l = dir.length();
    obj.position.copy(a).add(b).multiplyScalar(0.5);
    if (l < 1e-6) return;
    dir.normalize();
    var z = (frente || v(0, 0, 1)).clone();
    z.sub(dir.clone().multiplyScalar(z.dot(dir)));
    if (z.length() < 0.2) {
      z = v(0, 1, 0);
      z.sub(dir.clone().multiplyScalar(z.dot(dir)));
    }
    if (z.length() < 0.05) {
      z = v(1, 0, 0);
      z.sub(dir.clone().multiplyScalar(z.dot(dir)));
    }
    z.normalize();
    var x = dir.clone().cross(z);
    obj.quaternion.setFromRotationMatrix(new global.THREE.Matrix4().makeBasis(x, dir, z));
    if (obj.userData.largo) obj.scale.set(1, l / obj.userData.largo, 1);
  }
  function conMarco(obj, pos, X, d, fr) {
    var m = new global.THREE.Matrix4().makeBasis(X, d, fr);
    obj.position.copy(pos);
    obj.quaternion.setFromRotationMatrix(m);
  }
  function pesaEnMano(pesa, J, L, agarre) {
    var ante = J['mano' + L].clone().sub(J['codo' + L]).normalize();
    var eje = agarre === 'prono' ? J.X.clone() : Array.isArray(agarre) ? v(agarre[0], agarre[1], agarre[2]) : J.fr.clone();
    eje.sub(ante.clone().multiplyScalar(eje.dot(ante)));
    if (eje.length() < 0.05) eje = J.X.clone();
    eje.normalize();
    pesa.position.copy(J['mano' + L]);
    pesa.quaternion.setFromUnitVectors(v(0, 1, 0), eje);
  }
  function posarFigura(fig, f, legado) {
    var THREE = global.THREE,
      p = fig.p,
      D = fig.D,
      J = esqueleto(Object.assign({
        _pesas: !!f.pesas
      }, f.pose || {}), fig.quien);
    fig.raiz.visible = !f.oculto;
    var X = J.X;
    conMarco(p.torso, J.cadera, X, J.d, J.fr);
    conMarco(p.short, J.cadera, X, J.d, J.fr);
    conMarco(p.camiseta, J.cadera, X, J.d, J.fr);
    entre(p.cuello, J.cuello.clone().sub(J.d.clone().multiplyScalar(0.06)), J.cuello.clone().add(J.hd.clone().multiplyScalar(0.13)));
    conMarco(p.cabeza, J.cabeza, J.hX || X, J.hd, J.hf);
    ['I', 'D'].forEach(function (L, i) {
      var s = i ? 1 : -1;
      p['delt' + L].position.copy(J['hombro' + L]).add(X.clone().multiplyScalar(s * 0.018)).sub(J.d.clone().multiplyScalar(0.004));
      p['delt' + L].quaternion.copy(p.torso.quaternion);
      var anteDir = J['mano' + L].clone().sub(J['codo' + L]).normalize();
      entre(p['brazo' + L], J['hombro' + L], J['codo' + L], anteDir.clone().add(J.fr.clone().multiplyScalar(0.6)));
      entre(p['manga' + L], J['hombro' + L].clone().lerp(J['codo' + L], -0.02), J['hombro' + L].clone().lerp(J['codo' + L], 0.4));
      entre(p['ante' + L], J['codo' + L], J['mano' + L], J.fr);
      p['mano' + L].position.copy(J['mano' + L]);
      var rodDir = J['rodilla' + L].clone().sub(J['caderaJ' + L]).normalize();
      var shin = J['tobillo' + L].clone().sub(J['rodilla' + L]).normalize();
      // el frente del muslo: hacia donde va la pierna de abajo, o el frente del cuerpo
      entre(p['muslo' + L], J['caderaJ' + L], J['rodilla' + L], shin.clone().add(J.fr.clone().multiplyScalar(0.5)));
      if (p['pernera' + L]) entre(p['pernera' + L], J['caderaJ' + L].clone().lerp(J['rodilla' + L], -0.16), J['caderaJ' + L].clone().lerp(J['rodilla' + L], D.finPernera));
      entre(p['pierna' + L], J['rodilla' + L], J['tobillo' + L], rodDir.clone().add(J.fr.clone().multiplyScalar(0.5)));
      // el pie: plano en el piso, mirando hacia donde gira el cuerpo; pieAng inclina la punta
      var g = (J.giro || 0) * RAD,
        pa = (J['pieAng' + L] || 0) * RAD;
      p['pie' + L].position.copy(J['tobillo' + L]).add(v(0, -0.04, 0));
      p['pie' + L].rotation.set(pa, g, 0, 'YXZ');
      if (f.pesas) {
        p['pesa' + L].visible = true;
        pesaEnMano(p['pesa' + L], J, L, f.pesas.I !== undefined ? f.pesas[L] : f.pesas);
      } else p['pesa' + L].visible = false;
    });
    // la cola de caballo cuelga con la gravedad
    if (p.cola) {
      var base = J.cabeza.clone().add(J.hd.clone().multiplyScalar(0.07)).sub(J.hf.clone().multiplyScalar(D.cabeza[2] + 0.02));
      p.colita.position.copy(base);
      p.colita.quaternion.setFromUnitVectors(v(0, 0, 1), J.hf);
      var prev = base,
        vaiven = Math.sin((f.T || 0) * 2.2) * 0.012;
      p.cola.forEach(function (c, i) {
        var paso = v(vaiven * i, -0.085, 0).sub(J.hf.clone().multiplyScalar(0.035 - 0.01 * i));
        var pos = prev.clone().add(paso);
        c.position.copy(i === 0 ? base.clone().add(paso.clone().multiplyScalar(0.5)) : pos);
        c.quaternion.setFromUnitVectors(v(0, 1, 0), paso.clone().normalize());
        prev = pos;
      });
    }
    // desenfoque: mancuernas de unos instantes antes
    p.fantasmas.forEach(function (fa) {
      fa.visible = false;
    });
    (SIN_FANTASMAS ? [] : f.fantasmas || []).forEach(function (fp, i) {
      if (i * 2 + 1 >= p.fantasmas.length) return;
      var Jf = esqueleto(fp, fig.quien);
      ['I', 'D'].forEach(function (L, j) {
        var fa = p.fantasmas[i * 2 + j];
        pesaEnMano(fa, Jf, L, f.pesas || 'neutro');
        fa.visible = true;
      });
    });
    // musculos: amarillo (trabaja), rojo (error), gris o claro; apagados no se ven
    var mu = f.musc || {};
    if (legado && mu.dorsal == null) mu = {
      dorsal: mu.rojo ? 'rojo' : 'amarillo',
      romboides: mu.romboides ? 'claro' : 'gris',
      brillo: mu.brillo
    };
    var ropa = f.ropa || {};
    Object.keys(fig.mus).forEach(function (n) {
      var g = fig.mus[n],
        t = tono(mu[n]);
      if (g.esPieza) {
        if (g.base === 'short') {
          var ms = fig.mats.shortG.uniforms,
            tt = t || TONOS.amarillo;
          ms.on.value = t ? 1 : 0;
          ms.mus.value.setHex(tt[0]);
          ms.musS.value.setHex(tt[1]);
          ms.brilloMus.value = t && mu[n] !== 'rojo' && mu[n] !== 'gris' ? mu.brillo || 0 : 0;
          return;
        }
        var colorDelt = t ? null : ropa.camiseta && ropa.mangas !== false ? ropa.camiseta : null;
        pintar(g.mat, t ? mu[n] : colorDelt || 'blanco');
        g.mat.uniforms.brillo.value = t && mu[n] !== 'rojo' && mu[n] !== 'gris' ? mu.brillo || 0 : 0;
        g.objs.forEach(function (o) {
          o.userData.relleno.material = t || colorDelt ? g.mat : fig.mats.piel;
        });
        return;
      }
      g.objs.forEach(function (o) {
        o.visible = !!t;
      });
      if (!t) return;
      pintar(g.mat, mu[n] === true || mu[n] === 1 ? 'amarillo' : mu[n]);
      g.mat.uniforms.brillo.value = mu[n] !== 'rojo' && mu[n] !== 'gris' ? mu.brillo || 0 : 0;
    });
    // ropa
    p.camiseta.visible = !!ropa.camiseta;
    if (ropa.camiseta) pintar(fig.mats.camiseta, ropa.camiseta);
    ['I', 'D'].forEach(function (L) {
      p['manga' + L].visible = !!ropa.camiseta && ropa.mangas !== false;
    });
    pintar(fig.mats.short, ropa.short || 'gris');
    pintar(fig.mats.shortG, ropa.short || 'gris');
    // cara
    var cara = f.cara || {},
      c = fig.cara;
    var ojos = cara.ojos || 'normal';
    if ((cara.parpadeo || 0) > 0.45 && (ojos === 'normal' || ojos === 'grandes')) ojos = 'cerrados';
    Object.keys(c.ojos).forEach(function (k) {
      c.ojos[k].visible = k === ojos;
    });
    var boca = cara.boca || 'sonrisa';
    Object.keys(c.boca).forEach(function (k) {
      c.boca[k].visible = k === boca;
    });
    Object.keys(c.cejas).forEach(function (k) {
      c.cejas[k].visible = k === cara.cejas;
    });
    c.nariz.linea.visible = cara.nariz !== 'roja';
    c.nariz.roja.visible = cara.nariz === 'roja';
    c.mejillas.visible = !!cara.mejillas;
    if (cara.color) pintar(fig.mats.cabeza, cara.color.c, {
      v: cara.color.v == null ? 0.4 : cara.color.v
    });else pintar(fig.mats.cabeza, 'blanco');
    var pz = f.pose && f.pose.panza || f.panza || 0;
    p.panza.visible = pz > 0.02;
    if (pz > 0.02) {
      p.panza.scale.set(0.7 + 0.7 * pz, 0.8 + 0.45 * pz, 0.3 + 1.5 * pz);
    }
    p.sombra.visible = f.sombra !== false;
    p.sombra.position.set(J.cadera.x, 0.003, J.cadera.z * 0.5 + 0.05);
    return J;
  }

  /* ---------------- objetos: equipo del gimnasio ---------------- */
  var OBJ = {};
  function ubicar(g, o) {
    var p = vec(o.p, v(0, 0, 0));
    g.position.copy(p);
    g.rotation.set(0, (o.giro || 0) * RAD, 0);
  }
  function barraEntre(obj, a, b) {
    entre(obj, a, b);
  }
  OBJ.mancuerna = function () {
    var g = mancuerna(MOTOR.mat.gris, MOTOR.mat.blanco, true);
    return {
      g: g,
      poner: function (o) {
        g.position.copy(vec(o.p));
        g.quaternion.setFromUnitVectors(v(0, 1, 0), vec(o.eje, v(1, 0, 0)).normalize());
      }
    };
  };
  // barra olimpica: centro c, eje (a lo largo), largo, discos (radio)
  OBJ.barra = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group(),
      inner = new THREE.Group();
    g.add(inner);
    var barra = cilindro(0.024, 2.0, 16, m.gris);
    inner.add(barra);
    var discos = [];
    [-1, 1].forEach(function (s) {
      [0.72, 0.79].forEach(function (y, i) {
        var d = cilindro(i ? 0.19 : 0.225, 0.055, 40, m.gris);
        d.position.y = s * y;
        inner.add(d);
        discos.push(d);
        var aro = new THREE.Mesh(new THREE.TorusGeometry(i ? 0.12 : 0.15, 0.008, 8, 40), m.tinta);
        aro.rotation.x = Math.PI / 2;
        aro.position.y = s * (y + 0.03);
        inner.add(aro);
        discos.push(aro);
      });
      var cuello = cilindro(0.045, 0.04, 20, m.blanco);
      cuello.position.y = s * 0.67;
      inner.add(cuello);
    });
    return {
      g: g,
      poner: function (o) {
        g.position.copy(vec(o.c));
        g.quaternion.setFromUnitVectors(v(0, 1, 0), vec(o.eje, v(1, 0, 0)).normalize());
        var esc = o.discos === 0 ? 0 : 1;
        discos.forEach(function (d) {
          d.visible = !!esc;
        });
      }
    };
  };
  // barra EZ (corta) con discos chicos
  OBJ.ez = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    g.add(cilindro(0.022, 1.25, 16, m.gris));
    [-1, 1].forEach(function (s) {
      var d = cilindro(0.13, 0.05, 32, m.gris);
      d.position.y = s * 0.5;
      g.add(d);
      var d2 = cilindro(0.1, 0.04, 32, m.gris);
      d2.position.y = s * 0.555;
      g.add(d2);
    });
    return {
      g: g,
      poner: function (o) {
        g.position.copy(vec(o.c));
        g.quaternion.setFromUnitVectors(v(0, 1, 0), vec(o.eje, v(1, 0, 0)).normalize());
      }
    };
  };
  // banco: asiento (largo en z) a la altura alto; respaldo { ang (90 = vertical), largo } que sube desde atras;
  // inclina el asiento entero (banco inclinado)
  OBJ.banco = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var asiento = cojin(0.34, 0.1, 1, m.gris);
    g.add(asiento);
    var resp = cojin(0.34, 0.1, 1, m.gris);
    g.add(resp);
    var patas = [0, 1].map(function () {
      var pa = cilindro(0.03, 1, 12, m.tinta, 0);
      pa.userData.largo = 1;
      g.add(pa);
      return pa;
    });
    var pies = [0, 1].map(function () {
      var pi = caja(0.44, 0.04, 0.07, m.oscuro, 0.01);
      g.add(pi);
      return pi;
    });
    var sombra = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m.sombra);
    sombra.rotation.x = -Math.PI / 2;
    sombra.position.y = 0.002;
    g.add(sombra);
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        var largo = o.largo || 1.2,
          alto = o.alto || 0.45,
          inc = (o.inclina || 0) * RAD;
        var an = (o.ancho || 0.34) / 0.34;
        asiento.scale.set(an, 1, largo);
        asiento.position.set(0, alto - 0.05, 0);
        asiento.rotation.set(-inc, 0, 0);
        var r = o.respaldo;
        resp.visible = !!r;
        if (r) {
          var a = (r.ang == null ? 90 : r.ang) * RAD,
            lr = r.largo || 0.8;
          var bisagra = v(0, alto - 0.05, -largo / 2 + 0.05);
          var dir = v(0, Math.sin(a), -Math.cos(a));
          resp.scale.set((r.ancho || o.ancho || 0.34) / 0.34, 1, lr);
          resp.position.copy(bisagra.clone().add(dir.clone().multiplyScalar(lr / 2)));
          resp.rotation.set(a - Math.PI, 0, 0);
        }
        var zp = largo / 2 - 0.1;
        [-1, 1].forEach(function (s, i) {
          var yTop = alto - 0.1 + Math.sin(inc) * s * zp * -1;
          entre(patas[i], v(0, 0.03, s * zp), v(0, Math.max(0.1, yTop), s * zp));
          pies[i].position.set(0, 0.02, s * zp);
        });
        sombra.scale.set(0.9, largo + 0.2, 1);
      }
    };
  };
  OBJ.colchoneta = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group(),
      c = cojin(1, 0.04, 1, m.gris);
    g.add(c);
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        c.scale.set(o.ancho || 0.7, 1, o.largo || 1.9);
        c.position.y = 0.02;
      }
    };
  };
  // torre de polea: columna, placas y la roldana a la altura alto; el cable baja hasta fin (con su agarre)
  OBJ.polea = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group(),
      base = new THREE.Group();
    g.add(base);
    var col = caja(0.16, 2.3, 0.16, m.gris);
    col.position.set(0, 1.15, -0.12);
    base.add(col);
    var pila = caja(0.32, 0.6, 0.18, m.blanco);
    pila.position.set(0, 0.36, -0.3);
    base.add(pila);
    [0.18, 0.3, 0.42, 0.54].forEach(function (y) {
      var l = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.008, 0.19), m.tinta);
      l.position.set(0, y, -0.3);
      base.add(l);
    });
    var pieBase = caja(0.6, 0.05, 0.6, m.oscuro, 0.01);
    pieBase.position.set(0, 0.025, -0.2);
    base.add(pieBase);
    var rold = new THREE.Group();
    base.add(rold);
    var rueda = cilindro(0.075, 0.045, 32, m.blanco);
    rueda.rotation.z = Math.PI / 2;
    rold.add(rueda);
    var soporte = caja(0.06, 0.06, 0.16, m.oscuro, 0.01);
    soporte.position.set(0, 0, -0.08);
    rold.add(soporte);
    var cable = cilindro(0.009, 1, 8, m.tinta, 0);
    cable.userData.largo = 1;
    g.add(cable);
    var agarres = {
      cuerda: function () {
        var a = new THREE.Group();
        [-1, 1].forEach(function (s) {
          var t = cilindro(0.022, 0.32, 12, m.oscuro, 0.008);
          t.position.set(s * 0.06, -0.15, 0);
          t.rotation.z = s * 0.35;
          a.add(t);
          var bo = elipsoide(0.035, 0.035, 0.035, m.oscuro, 0.008);
          bo.position.set(s * 0.115, -0.3, 0);
          a.add(bo);
        });
        return a;
      }(),
      barra: function () {
        var a = new THREE.Group();
        var b = cilindro(0.022, 0.6, 12, m.gris);
        b.rotation.z = Math.PI / 2;
        a.add(b);
        return a;
      }(),
      manija: function () {
        var a = new THREE.Group();
        var b = cilindro(0.02, 0.14, 12, m.gris);
        b.rotation.z = Math.PI / 2;
        b.position.y = -0.06;
        a.add(b);
        return a;
      }()
    };
    Object.keys(agarres).forEach(function (k) {
      g.add(agarres[k]);
    });
    // la cuerda en V hasta las dos manos
    var sogas = [0, 1].map(function () {
      var c = cilindro(0.02, 1, 12, m.oscuro, 0.008);
      g.add(c);
      return c;
    });
    var nudos = [0, 1].map(function () {
      var n = elipsoide(0.035, 0.035, 0.035, m.oscuro, 0.008);
      g.add(n);
      return n;
    });
    return {
      g: g,
      poner: function (o) {
        ubicar(base, {
          p: o.p,
          giro: o.giro
        });
        var alto = o.alto == null ? 2.1 : o.alto;
        rold.position.set(0, alto, 0.02);
        base.updateMatrixWorld(true);
        var desde = rold.getWorldPosition(v(0, 0, 0));
        var fin = vec(o.fin, desde.clone().add(v(0, -1, 0.3)));
        entre(cable, desde, fin);
        Object.keys(agarres).forEach(function (k) {
          agarres[k].visible = !o.manos && k === (o.agarre || 'cuerda');
        });
        sogas.forEach(function (c, i) {
          c.visible = nudos[i].visible = !!o.manos;
          if (o.manos) {
            var mn = vec(o.manos[i]);
            entre(c, fin, mn);
            nudos[i].position.copy(mn);
          }
        });
        var ag = agarres[o.agarre || 'cuerda'];
        ag.position.copy(fin);
        var dirC = fin.clone().sub(desde).normalize();
        var ejeX = vec(o.eje, v(1, 0, 0));
        ejeX.sub(dirC.clone().multiplyScalar(ejeX.dot(dirC))).normalize();
        var zz = ejeX.clone().cross(dirC.clone().multiplyScalar(-1));
        ag.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(ejeX, dirC.clone().multiplyScalar(-1), zz));
      }
    };
  };
  // barra fija (para colgarse): dos postes y la barra a la altura alto
  OBJ.barraFija = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var b = cilindro(0.026, 1.3, 16, m.gris);
    b.rotation.z = Math.PI / 2;
    g.add(b);
    var postes = [-1, 1].map(function (s) {
      var po = caja(0.08, 1, 0.08, m.oscuro, 0.01);
      g.add(po);
      return po;
    });
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        var alto = o.alto || 2.35;
        b.position.set(0, alto, 0);
        postes.forEach(function (po, i) {
          po.scale.set(1, alto + 0.05, 1);
          po.position.set((i ? 1 : -1) * 0.65, (alto + 0.05) / 2, 0);
        });
      }
    };
  };
  // paralelas (fondos): dos barras a lo largo de z, separadas sep, a la altura alto
  OBJ.paralelas = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group(),
      barras = [],
      postes = [];
    [-1, 1].forEach(function (s) {
      var b = cilindro(0.028, 0.75, 16, m.gris);
      b.rotation.x = Math.PI / 2;
      g.add(b);
      barras.push(b);
      [-1, 1].forEach(function () {
        var po = caja(0.06, 1, 0.06, m.oscuro, 0.01);
        g.add(po);
        postes.push(po);
      });
    });
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        var alto = o.alto || 1.25,
          sep = o.sep || 0.58;
        barras.forEach(function (b, i) {
          b.position.set((i ? 1 : -1) * sep / 2, alto, 0);
        });
        postes.forEach(function (po, i) {
          var s = i < 2 ? -1 : 1,
            z = (i % 2 ? 1 : -1) * 0.3;
          po.scale.set(1, alto, 1);
          po.position.set(s * (sep / 2 + 0.04), alto / 2, z);
        });
      }
    };
  };
  // rueda abdominal: rueda (eje en x) con su manija
  OBJ.rueda = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var r = cilindro(0.11, 0.07, 32, m.gris);
    r.rotation.z = Math.PI / 2;
    g.add(r);
    var cubo = cilindro(0.04, 0.075, 16, m.blanco);
    cubo.rotation.z = Math.PI / 2;
    g.add(cubo);
    var man = cilindro(0.02, 0.36, 12, m.oscuro, 0.008);
    man.rotation.z = Math.PI / 2;
    g.add(man);
    [-1, 1].forEach(function (s) {
      var h = cilindro(0.03, 0.09, 12, m.oscuro, 0.008);
      h.rotation.z = Math.PI / 2;
      h.position.x = s * 0.14;
      g.add(h);
    });
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        g.position.y = vec(o.p, v(0, 0, 0)).y || 0.11;
      }
    };
  };

  // rodillo acolchado (a lo largo de x) en c; con pivote, la palanca negra que lo sostiene
  OBJ.rodillo = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var r = cilindro(0.07, 0.46, 32, m.gris);
    r.rotation.z = Math.PI / 2;
    g.add(r);
    var eje = cilindro(0.02, 0.62, 12, m.oscuro, 0.006);
    eje.rotation.z = Math.PI / 2;
    g.add(eje);
    var palanca = cilindro(0.025, 1, 12, m.oscuro, 0.008);
    palanca.userData.largo = 1;
    var piv = elipsoide(0.05, 0.05, 0.05, m.oscuro, 0.01);
    var raiz = new THREE.Group();
    raiz.add(g);
    raiz.add(palanca);
    raiz.add(piv);
    return {
      g: raiz,
      poner: function (o) {
        var c = vec(o.c);
        g.position.copy(c);
        g.scale.set((o.ancho || 0.46) / 0.46, 1, 1);
        palanca.visible = piv.visible = !!o.pivote;
        if (o.pivote) {
          var lx = ((o.ancho || 0.46) / 2 + 0.06) * (o.lado || 1);
          var pv = vec(o.pivote);
          pv.x = c.x + lx;
          entre(palanca, pv, v(c.x + lx, c.y, c.z));
          piv.position.copy(pv);
        }
      }
    };
  };
  // Smith: dos rieles verticales y la barra que corre por ellos a la altura barra
  OBJ.smith = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    [-1, 1].forEach(function (s) {
      var r = caja(0.07, 2.35, 0.07, m.gris);
      r.position.set(s * 0.82, 1.175, 0);
      g.add(r);
      var pie = caja(0.12, 0.05, 0.7, m.oscuro, 0.01);
      pie.position.set(s * 0.82, 0.025, 0);
      g.add(pie);
    });
    var arriba = caja(1.75, 0.08, 0.08, m.gris);
    arriba.position.set(0, 2.35, 0);
    g.add(arriba);
    var barra = OBJ.barra();
    g.add(barra.g);
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        barra.poner({
          c: [0, o.barra || 1.5, 0],
          eje: [1, 0, 0]
        });
      }
    };
  };
  // maquina de abduccion (sentado): asiento, respaldo, la torre de pesas atras y dos brazos con
  // almohadillas que van por afuera de las rodillas. o = { p, giro, alto (asiento), respaldo (grados desde
  // la vertical, hacia atras), rodillas: [[x,y,z] izq, [x,y,z] der], pies: [[x,y,z], [x,y,z]] } (mundo)
  OBJ.abductora = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var asiento = cojin(0.52, 0.1, 0.5, m.gris);
    g.add(asiento);
    var resp = cojin(0.52, 0.1, 0.72, m.gris);
    g.add(resp);
    var col = cilindro(0.05, 1, 16, m.tinta, 0);
    g.add(col);
    var base = caja(0.64, 0.05, 1.05, m.oscuro, 0.01);
    g.add(base);
    var torre = caja(0.2, 1.55, 0.16, m.gris);
    g.add(torre);
    var pesas = [0, 1, 2, 3, 4, 5].map(function () {
      var q = caja(0.3, 0.07, 0.22, m.gris, 0.008);
      g.add(q);
      return q;
    });
    var poste = cilindro(0.03, 1, 12, m.tinta, 0);
    g.add(poste);
    var pivote = cilindro(0.06, 0.1, 18, m.tinta, 0);
    g.add(pivote);
    var pads = [0, 1].map(function () {
      var c = cojin(0.1, 0.26, 0.24, m.gris);
      g.add(c);
      return c;
    });
    var brazos = [0, 1].map(function () {
      var b = cilindro(0.026, 1, 12, m.tinta, 0);
      g.add(b);
      return b;
    });
    var bajadas = [0, 1].map(function () {
      var b = cilindro(0.022, 1, 12, m.tinta, 0);
      g.add(b);
      return b;
    });
    var apoyos = [0, 1].map(function () {
      var a = caja(0.15, 0.035, 0.22, m.oscuro, 0.01);
      g.add(a);
      return a;
    });
    var sombra = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m.sombra);
    sombra.rotation.x = -Math.PI / 2;
    sombra.position.y = 0.002;
    g.add(sombra);
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        g.updateMatrixWorld(true);
        var alto = o.alto || 0.5,
          ar = (o.respaldo == null ? 12 : o.respaldo) * RAD;
        asiento.position.set(0, alto - 0.05, 0.02);
        var bis = v(0, alto - 0.02, -0.24),
          dir = v(0, Math.cos(ar), -Math.sin(ar));
        resp.position.copy(bis.clone().add(dir.clone().multiplyScalar(0.38)).add(v(0, 0, -0.05)));
        resp.rotation.set(Math.PI / 2 - ar, 0, 0);
        entre(col, v(0, 0.05, 0.02), v(0, alto - 0.1, 0.02));
        base.position.set(0, 0.025, -0.05);
        torre.position.set(0, 0.775, -0.66);
        pesas.forEach(function (q, i) {
          q.position.set(0, 0.12 + i * 0.075, -0.52);
        });
        entre(poste, v(0, 0.05, -0.52), v(0, 0.6, -0.52));
        var piv = v(0, alto - 0.17, 0.2);
        pivote.position.copy(piv);
        var rod = o.rodillas || [[-0.2, alto + 0.08, 0.42], [0.2, alto + 0.08, 0.42]];
        [-1, 1].forEach(function (s, i) {
          var k = g.worldToLocal(vec(rod[i]));
          var yaw = Math.atan2(k.x, k.z - piv.z);
          var lado = v(Math.cos(yaw), 0, -Math.sin(yaw)).multiplyScalar(s);
          var c = k.clone().add(lado.clone().multiplyScalar(0.135)).add(v(0, -0.01, 0));
          pads[i].position.copy(c);
          pads[i].rotation.set(0, yaw, 0);
          var pie = c.clone().add(lado.clone().multiplyScalar(0.02));
          pie.y = piv.y;
          entre(brazos[i], piv, pie);
          entre(bajadas[i], pie, c.clone().add(v(0, -0.12, 0)));
          var pp = o.pies && o.pies[i] ? g.worldToLocal(vec(o.pies[i])) : v(s * 0.2, 0.12, 0.55);
          apoyos[i].position.set(pp.x, Math.max(0.05, pp.y - 0.1), pp.z + 0.04);
          apoyos[i].rotation.set(0, yaw, 0);
        });
        sombra.scale.set(0.9, 1.4, 1);
        sombra.position.z = -0.1;
      }
    };
  };
  // prensa a 45°: asiento y respaldo, rieles y la plataforma donde van los pies (plato)
  OBJ.prensa = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var asiento = cojin(0.5, 0.1, 0.5, m.gris);
    g.add(asiento);
    var resp = cojin(0.5, 0.1, 0.95, m.gris);
    g.add(resp);
    var base = caja(0.55, 0.35, 0.6, m.oscuro, 0.01);
    g.add(base);
    var rieles = [-1, 1].map(function (s) {
      var r = cilindro(0.03, 1, 12, m.oscuro, 0.008);
      r.userData.largo = 1;
      g.add(r);
      return r;
    });
    var plato = cojin(0.75, 0.06, 0.6, m.gris);
    g.add(plato);
    var carro = caja(0.6, 0.1, 0.4, m.blanco);
    g.add(carro);
    return {
      g: g,
      poner: function (o) {
        var cad = vec(o.cadera),
          u = vec(o.u, v(0, 0.7071, 0.7071)).normalize(),
          pl = vec(o.plato);
        // el asiento bajo la cadera, el respaldo acostado a 45° hacia atras
        asiento.position.set(0, cad.y - 0.24, cad.z + 0.06);
        asiento.rotation.set(-0.35, 0, 0);
        var atras = v(0, Math.sin(45 * RAD), -Math.cos(45 * RAD));
        resp.position.copy(cad.clone().add(atras.clone().multiplyScalar(0.5)).add(v(0, -0.17, -0.17)));
        resp.rotation.set(45 * RAD - Math.PI, 0, 0);
        base.position.set(0, (cad.y - 0.29) / 2, cad.z - 0.05);
        base.scale.set(1, Math.max(0.2, cad.y - 0.29) / 0.35, 1);
        var a0 = cad.clone().add(v(0, -0.2, 0.3)),
          a1 = a0.clone().add(u.clone().multiplyScalar(1.9));
        rieles.forEach(function (r, i) {
          var dx = v((i ? 1 : -1) * 0.36, 0, 0);
          entre(r, a0.clone().add(dx), a1.clone().add(dx));
        });
        var pp = pl.clone().add(u.clone().multiplyScalar(0.07));
        plato.position.copy(pp);
        plato.quaternion.setFromUnitVectors(v(0, 1, 0), u);
        carro.position.copy(pp.clone().add(u.clone().multiplyScalar(0.1)));
        carro.quaternion.copy(plato.quaternion);
      }
    };
  };

  /* ---------------- objetos: escenografia de los videos con Tor ---------------- */
  function luzMat(c, op) {
    return new global.THREE.MeshBasicMaterial({
      color: c,
      transparent: true,
      opacity: op,
      depthWrite: false,
      side: global.THREE.DoubleSide
    });
  }
  // farol: poste, brazo y la lampara con su cono de luz
  OBJ.farol = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var poste = cilindro(0.055, 2.75, 20, m.oscuro);
    poste.position.y = 1.375;
    g.add(poste);
    var base = cilindro(0.13, 0.16, 20, m.oscuro);
    base.position.y = 0.08;
    g.add(base);
    var brazo = cilindro(0.035, 0.55, 12, m.oscuro);
    brazo.rotation.z = Math.PI / 2;
    brazo.position.set(-0.26, 2.72, 0);
    g.add(brazo);
    var lamp = cilindro(0.16, 0.14, 24, m.oscuro);
    lamp.position.set(-0.5, 2.62, 0);
    g.add(lamp);
    var vidrio = elipsoide(0.12, 0.08, 0.12, m.amarillo, 0.01);
    vidrio.position.set(-0.5, 2.52, 0);
    g.add(vidrio);
    var cono = new THREE.Mesh(new THREE.ConeGeometry(1.0, 2.5, 40, 1, true), luzMat(YEL, 0.16));
    cono.position.set(-0.5, 1.27, 0);
    g.add(cono);
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        cono.visible = o.luz !== false;
      }
    };
  };
  // jarra de cerveza: vaso con cerveza amarilla, espuma y el asa
  OBJ.jarra = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group(),
      cuerpo = new THREE.Group();
    g.add(cuerpo);
    var vaso = cilindro(0.08, 0.22, 28, m.amarillo);
    cuerpo.add(vaso);
    var espuma = elipsoide(0.088, 0.045, 0.088, m.blanco, 0.012);
    espuma.position.y = 0.115;
    cuerpo.add(espuma);
    var asa = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.018, 10, 24, Math.PI), m.blanco);
    asa.rotation.z = -Math.PI / 2;
    asa.position.x = 0.085;
    cuerpo.add(asa);
    var asaB = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.03, 10, 24, Math.PI), MOTOR.mat.borde);
    asaB.rotation.z = -Math.PI / 2;
    asaB.position.x = 0.085;
    cuerpo.add(asaB);
    return {
      g: g,
      poner: function (o) {
        g.position.copy(vec(o.p));
        g.rotation.set((o.inclina || 0) * RAD, (o.giro || 0) * RAD, (o.ladea || 0) * RAD, 'YXZ');
        var k = o.s || 1;
        g.scale.set(k, k, k);
      }
    };
  };
  // balde: cuerpo gris, el borde y lo que tiene adentro (nivel 0..1, amarillo)
  OBJ.balde = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var geo = new THREE.CylinderGeometry(0.2, 0.15, 0.34, 32),
      geoB = new THREE.CylinderGeometry(0.2 + G * 0.8, 0.15 + G * 0.8, 0.34 + G * 1.6, 32);
    g.add(conBorde(geo, geoB, m.gris));
    var hueco = new THREE.Mesh(new THREE.CircleGeometry(0.175, 32), m.oscuro);
    hueco.rotation.x = -Math.PI / 2;
    hueco.position.y = 0.172;
    g.add(hueco);
    var liq = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), m.amarillo);
    liq.rotation.x = -Math.PI / 2;
    liq.position.y = 0.174;
    g.add(liq);
    var aro = new THREE.Mesh(new THREE.TorusGeometry(0.195, 0.012, 8, 40), m.tinta);
    aro.rotation.x = Math.PI / 2;
    aro.position.y = 0.17;
    g.add(aro);
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        g.position.y = vec(o.p).y + 0.17;
        var n = clamp01(o.nivel || 0);
        liq.visible = n > 0.02;
        liq.scale.set(0.3 + 0.7 * n, 0.3 + 0.7 * n, 1);
      }
    };
  };
  function clamp01(x) {
    return Math.max(0, Math.min(1, x));
  }
  // cama: colchon, cabecera, almohada y la manta (cubre de los pies hasta manta 0..1)
  OBJ.cama = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var marco = cojin(1.15, 0.2, 2.2, m.gris);
    marco.position.set(0, 0.25, 0);
    g.add(marco);
    var colchon = cojin(1.05, 0.2, 2.1, m.blanco);
    colchon.position.set(0, 0.45, 0);
    g.add(colchon);
    var cabecera = cojin(1.2, 0.9, 0.1, m.gris);
    cabecera.position.set(0, 0.75, -1.12);
    g.add(cabecera);
    var almohada = cojin(0.62, 0.14, 0.36, m.blanco);
    almohada.position.set(0, 0.6, -0.82);
    g.add(almohada);
    var manta = cojin(1.12, 0.12, 1, m.amarillo);
    g.add(manta);
    [-1, 1].forEach(function (sx) {
      [-1, 1].forEach(function (sz) {
        var pa = caja(0.08, 0.15, 0.08, m.oscuro, 0.01);
        pa.position.set(sx * 0.5, 0.075, sz * 1.0);
        g.add(pa);
      });
    });
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        var c = clamp01(o.manta == null ? 0.7 : o.manta),
          L = 2.1 * c;
        manta.scale.set(1, 1, Math.max(0.05, L));
        manta.position.set(0, o.mantaY || 0.62, 1.05 - L / 2);
        manta.visible = c > 0.02;
      }
    };
  };
  // sofa: base, respaldo, brazos y almohadones
  OBJ.sofa = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var base = cojin(1.9, 0.3, 0.85, m.gris);
    base.position.set(0, 0.25, 0);
    g.add(base);
    var asiento = cojin(1.5, 0.14, 0.72, m.gris);
    asiento.position.set(0, 0.46, 0.05);
    g.add(asiento);
    var resp = cojin(1.9, 0.75, 0.22, m.gris);
    resp.position.set(0, 0.75, -0.36);
    resp.rotation.x = -0.12;
    g.add(resp);
    [-1, 1].forEach(function (s) {
      var br = cojin(0.22, 0.6, 0.85, m.gris);
      br.position.set(s * 0.86, 0.5, 0);
      g.add(br);
    });
    [-1, 0, 1].forEach(function (k) {
      var a = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.62, 0.012), m.tinta);
      a.position.set(k * 0.5, 0.78, -0.235);
      a.rotation.x = -0.12;
      if (k) g.add(a);
    });
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
      }
    };
  };
  // manta suelta (sobre las piernas en el sofa)
  OBJ.manta = function () {
    var g = cojin(1, 0.1, 1, MOTOR.mat.amarillo);
    return {
      g: g,
      poner: function (o) {
        g.position.copy(vec(o.p));
        g.rotation.set((o.inclina || 0) * RAD, (o.giro || 0) * RAD, 0);
        g.scale.set(o.ancho || 0.8, o.alto || 1, o.largo || 0.7);
      }
    };
  };
  // nevera abierta vista de frente: caja, puerta abierta, estantes y la luz de adentro
  OBJ.nevera = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var cuerpo = caja(0.9, 1.9, 0.7, m.blanco);
    cuerpo.position.set(0, 0.95, 0);
    g.add(cuerpo);
    var adentro = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 1.7), luzMat(0xFFF3A6, 1));
    adentro.position.set(0, 0.95, 0.352);
    g.add(adentro);
    [0.45, 0.85, 1.25, 1.6].forEach(function (y) {
      var e = caja(0.78, 0.025, 0.05, m.gris, 0.008);
      e.position.set(0, y, 0.33);
      g.add(e);
    });
    var puerta = new THREE.Group();
    var pu = caja(0.9, 1.9, 0.08, m.blanco);
    pu.position.set(-0.45, 0, 0);
    puerta.add(pu);
    var mani = caja(0.04, 0.4, 0.04, m.oscuro, 0.008);
    mani.position.set(-0.8, 0.2, 0.07);
    puerta.add(mani);
    puerta.position.set(0.45, 0.95, 0.39);
    g.add(puerta);
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        puerta.rotation.y = o.abre == null ? 1.9 : o.abre;
      }
    };
  };
  // tacho de basura con la tapa (abre 0..1)
  OBJ.tacho = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var geo = new THREE.CylinderGeometry(0.24, 0.2, 0.62, 32),
      geoB = new THREE.CylinderGeometry(0.24 + G * 0.8, 0.2 + G * 0.8, 0.62 + G * 1.6, 32);
    var c = conBorde(geo, geoB, m.gris);
    c.position.y = 0.31;
    g.add(c);
    var hueco = new THREE.Mesh(new THREE.CircleGeometry(0.22, 32), m.oscuro);
    hueco.rotation.x = -Math.PI / 2;
    hueco.position.y = 0.622;
    g.add(hueco);
    var bisagra = new THREE.Group();
    bisagra.position.set(0, 0.63, -0.24);
    g.add(bisagra);
    var tapa = cilindro(0.26, 0.05, 32, m.oscuro);
    tapa.position.set(0, 0.02, 0.24);
    bisagra.add(tapa);
    return {
      g: g,
      poner: function (o) {
        ubicar(g, o);
        bisagra.rotation.x = -1.6 * clamp01(o.abre || 0);
      }
    };
  };
  // cosas chicas en la mano: celular, helado, vape (p, giro, inclina, ladea, s)
  function chico(construye) {
    return function () {
      var THREE = global.THREE,
        g = new THREE.Group();
      construye(g, MOTOR.mat, THREE);
      return {
        g: g,
        poner: function (o) {
          g.position.copy(vec(o.p));
          g.rotation.set((o.inclina || 0) * RAD, (o.giro || 0) * RAD, (o.ladea || 0) * RAD, 'YXZ');
          var k = o.s || 1;
          g.scale.set(k, k, k);
          if (g.userData.act) g.userData.act(o);
        }
      };
    };
  }
  OBJ.celular = chico(function (g, m) {
    g.add(caja(0.085, 0.165, 0.014, m.oscuro, 0.008));
    var pant = caja(0.07, 0.14, 0.004, m.amarillo, 0);
    pant.position.z = 0.009;
    g.add(pant);
    g.userData.act = function (o) {
      pant.visible = o.prendido !== false;
    };
  });
  OBJ.helado = chico(function (g, m) {
    g.add(cilindro(0.09, 0.13, 28, m.blanco));
    var banda = cilindro(0.093, 0.04, 28, m.amarillo, 0);
    g.add(banda);
    var bola = elipsoide(0.08, 0.04, 0.08, m.amarillo, 0.01);
    bola.position.y = 0.07;
    g.add(bola);
    var cuch = cilindro(0.01, 0.16, 8, m.gris, 0.006);
    cuch.position.set(0.03, 0.1, 0);
    cuch.rotation.z = -0.5;
    g.add(cuch);
  });
  OBJ.vape = chico(function (g, m) {
    g.add(cilindro(0.018, 0.13, 16, m.oscuro, 0.008));
    var punta = cilindro(0.012, 0.03, 12, m.amarillo, 0.006);
    punta.position.y = 0.075;
    g.add(punta);
  });
  // paquete de un snack: caja amarilla con su etiqueta blanca (la tabla) atras
  OBJ.paquete = chico(function (g, m) {
    g.add(caja(0.3, 0.4, 0.08, m.amarillo, 0.01));
    var frente = caja(0.2, 0.12, 0.004, m.blanco, 0.006);
    frente.position.set(0, 0.06, 0.042);
    g.add(frente);
    var tabla = caja(0.22, 0.3, 0.004, m.blanco, 0.006);
    tabla.position.set(0, 0, -0.042);
    g.add(tabla);
    [0.08, 0.03, -0.02, -0.07].forEach(function (y) {
      var l = caja(0.16, 0.008, 0.002, m.tinta, 0);
      l.position.set(0, y, -0.046);
      g.add(l);
    });
  });
  // un brazo que entra a cuadro (el que ofrece "la ultima"): de a (hombro, afuera) a b (la mano)
  OBJ.brazo = function () {
    var THREE = global.THREE,
      m = MOTOR.mat,
      g = new THREE.Group();
    var b = capsula(0.075, 1, m.blanco);
    g.add(b);
    var mano = elipsoide(0.075, 0.075, 0.075, m.blanco);
    g.add(mano);
    return {
      g: g,
      poner: function (o) {
        var a = vec(o.a),
          c = vec(o.b);
        entre(b, a, c);
        mano.position.copy(c);
      }
    };
  };
  function objeto(o, i) {
    var clave = o.id || o.tipo + '#' + i;
    var ob = MOTOR.objetos[clave];
    if (!ob) {
      if (!OBJ[o.tipo]) return null;
      ob = MOTOR.objetos[clave] = OBJ[o.tipo]();
      MOTOR.escena.add(ob.g);
    }
    ob.usado = true;
    ob.g.visible = true;
    ob.poner(o);
    return ob;
  }

  /* ---------------- armar la escena de un cuadro ---------------- */
  function figurasDe(vt) {
    if (vt.figuras) return vt.figuras;
    var legado = vt.pose && (vt.pose.bisagra != null || vt.pose.remo != null || vt.pose.balanceo != null);
    return [{
      quien: 'tor',
      pose: vt.pose,
      musc: vt.musc,
      cara: vt.cara,
      ropa: vt.ropa,
      pesas: vt.pesas == null ? legado ? 'neutro' : null : vt.pesas,
      fantasmas: vt.fantasmas,
      legado: legado,
      T: vt.T
    }];
  }
  function posar(vt) {
    var M = MOTOR,
      usadas = {
        tor: 0,
        novia: 0
      },
      Js = [];
    var lista = figurasDe(vt);
    lista.forEach(function (f) {
      var q = f.quien === 'novia' ? 'novia' : 'tor';
      var arr = M.figuras[q];
      if (!arr[usadas[q]]) arr[usadas[q]] = crearFigura(q);
      var fig = arr[usadas[q]++];
      if (f.T == null) f.T = vt.T;
      Js.push(posarFigura(fig, f, f.legado));
    });
    ['tor', 'novia'].forEach(function (q) {
      M.figuras[q].forEach(function (fig, i) {
        if (i >= usadas[q]) fig.raiz.visible = false;
      });
    });
    Object.keys(M.objetos).forEach(function (k) {
      M.objetos[k].usado = false;
    });
    (vt.objetos || []).forEach(function (o, i) {
      objeto(o, i);
    });
    Object.keys(M.objetos).forEach(function (k) {
      if (!M.objetos[k].usado) M.objetos[k].g.visible = false;
    });
    return Js;
  }
  function ponerCamara(c) {
    var cam = MOTOR.camara,
      az = (c.az || 0) * RAD,
      el = (c.el || 0) * RAD,
      dist = c.dist || 5;
    var obj = v(c.dx || 0, c.y == null ? 0.95 : c.y, c.dz == null ? -0.05 : c.dz);
    cam.fov = c.fov || 30;
    cam.updateProjectionMatrix();
    cam.position.set(obj.x + dist * Math.sin(az) * Math.cos(el), obj.y + dist * Math.sin(el), obj.z + dist * Math.cos(az) * Math.cos(el));
    cam.up.set(0, 1, 0);
    cam.lookAt(obj);
    if (c.giro) cam.rotateZ(c.giro * RAD);
    cam.updateMatrixWorld();
  }

  /* ---------------- encuadre: el avatar siempre entero dentro del cuadro ----------------
     puntosVista da los puntos del cuerpo (con su radio) de las figuras visibles;
     cajaEnPantalla los proyecta con una camara (sin tocar la de three.js);
     encuadrar aleja la camara y corre el punto que mira hasta que todo entra en zona. */
  function puntosCuerpo(J, f) {
    var P = [],
      add = function (p, r) {
        P.push({
          p: p,
          r: r
        });
      };
    if (J.hd) {
      add(J.cabeza.clone().add(J.hd.clone().multiplyScalar(0.17)), 0.03);
      add(J.cabeza.clone().sub(J.hd.clone().multiplyScalar(0.16)), 0.03);
      add(J.cabeza.clone().add(J.hX.clone().multiplyScalar(0.16)), 0.03);
      add(J.cabeza.clone().sub(J.hX.clone().multiplyScalar(0.16)), 0.03);
      add(J.cabeza.clone().add(J.hf.clone().multiplyScalar(0.16)), 0.03);
      add(J.cabeza.clone().sub(J.hf.clone().multiplyScalar(0.16)), 0.03);
    }
    ['I', 'D'].forEach(function (L) {
      add(J['hombro' + L], 0.13);
      add(J['codo' + L], 0.1);
      add(J['mano' + L], f.pesas ? 0.21 : 0.1);
      add(J['caderaJ' + L], 0.18);
      add(J['rodilla' + L], 0.11);
      add(J['tobillo' + L], 0.1);
      var g = (J.giro || 0) * RAD,
        pa = (J['pieAng' + L] || 0) * RAD;
      var fw = v(Math.sin(g) * Math.cos(pa), -Math.sin(pa), Math.cos(g) * Math.cos(pa));
      add(J['tobillo' + L].clone().add(fw.clone().multiplyScalar(0.25)).add(v(0, -0.05, 0)), 0.06);
      add(J['tobillo' + L].clone().sub(fw.clone().multiplyScalar(0.12)).add(v(0, -0.05, 0)), 0.06);
    });
    add(J.cadera, 0.29);
    add(J.cuello, 0.3);
    if (f.quien === 'novia' && J.hf) add(J.cabeza.clone().sub(J.hf.clone().multiplyScalar(0.22)).add(v(0, -0.3, 0)), 0.08);
    return P;
  }
  function puntosVista(vt) {
    var lista = figurasDe(vt),
      P = [];
    lista.forEach(function (f) {
      if (f.oculto || f.encuadre === false) return;
      var legado = f.legado;
      var J = esqueleto(Object.assign({
        _pesas: !!f.pesas
      }, f.pose || {}), f.quien === 'novia' ? 'novia' : 'tor');
      P = P.concat(puntosCuerpo(J, Object.assign({
        pesas: f.pesas || legado
      }, f)));
    });
    // puntos que tambien tienen que entrar (una guia dibujada encima, el tope de una repeticion)
    if (P.length) (vt.encuadreExtra || []).forEach(function (q) {
      P.push({
        p: v(q[0], q[1], q[2]),
        r: q[3] || 0.06
      });
    });
    // las barras que lleva el avatar: sus discos tambien entran en cuadro
    if (P.length) (vt.objetos || []).forEach(function (o) {
      if (o.tipo !== 'barra' && o.tipo !== 'ez' || o.encuadre === false || !o.c) return;
      var c = vec(o.c),
        e = vec(o.eje, v(1, 0, 0)).normalize(),
        L = o.tipo === 'barra' ? 0.78 : 0.53,
        r = o.tipo === 'barra' ? o.discos === 0 ? 0.05 : 0.235 : 0.14;
      P.push({
        p: c.clone().add(e.clone().multiplyScalar(L)),
        r: r
      });
      P.push({
        p: c.clone().sub(e.clone().multiplyScalar(L)),
        r: r
      });
    });
    return P;
  }
  function baseCamara(c) {
    var az = (c.az || 0) * RAD,
      el = (c.el || 0) * RAD,
      dist = c.dist || 5;
    var obj = v(c.dx || 0, c.y == null ? 0.95 : c.y, c.dz == null ? -0.05 : c.dz);
    var pos = v(obj.x + dist * Math.sin(az) * Math.cos(el), obj.y + dist * Math.sin(el), obj.z + dist * Math.cos(az) * Math.cos(el));
    var fw = obj.clone().sub(pos).normalize(),
      r = fw.clone().cross(v(0, 1, 0)).normalize(),
      u = r.clone().cross(fw).normalize();
    if (c.giro) {
      var q = new global.THREE.Quaternion().setFromAxisAngle(fw, -c.giro * RAD);
      r.applyQuaternion(q);
      u.applyQuaternion(q);
    }
    return {
      pos: pos,
      fw: fw,
      r: r,
      u: u,
      obj: obj,
      fpx: ALTO / 2 / Math.tan((c.fov || 30) * RAD / 2)
    };
  }
  function cajaEnPantalla(P, c) {
    var b = baseCamara(c),
      x0 = 1e9,
      y0 = 1e9,
      x1 = -1e9,
      y1 = -1e9;
    P.forEach(function (q) {
      var d = q.p.clone().sub(b.pos),
        z = Math.max(0.05, d.dot(b.fw));
      var sx = ANCHO / 2 + d.dot(b.r) / z * b.fpx,
        sy = ALTO / 2 - d.dot(b.u) / z * b.fpx,
        rr = q.r / z * b.fpx + 6;
      x0 = Math.min(x0, sx - rr);
      x1 = Math.max(x1, sx + rr);
      y0 = Math.min(y0, sy - rr);
      y1 = Math.max(y1, sy + rr);
    });
    return {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1
    };
  }
  function encuadrar(vt, zona, cam0, P) {
    P = P || puntosVista(vt);
    var c = Object.assign({}, cam0);
    if (!P.length) return c;
    for (var it = 0; it < 10; it++) {
      var bb = cajaEnPantalla(P, c);
      var zw = zona[2] - zona[0],
        zh = zona[3] - zona[1];
      var sc = Math.max((bb.x1 - bb.x0) / zw, (bb.y1 - bb.y0) / zh);
      if (sc > 1.002) {
        c.dist = (c.dist || 5) * Math.min(3, sc * 1.015);
        continue;
      }
      var mx = 0,
        my = 0;
      if (bb.x0 < zona[0]) mx = zona[0] - bb.x0;else if (bb.x1 > zona[2]) mx = zona[2] - bb.x1;
      if (bb.y0 < zona[1]) my = zona[1] - bb.y0;else if (bb.y1 > zona[3]) my = zona[3] - bb.y1;
      if (Math.abs(mx) < 0.5 && Math.abs(my) < 0.5) break;
      var b = baseCamara(c),
        wpp = 2 * b.pos.distanceTo(b.obj) * Math.tan((c.fov || 30) * RAD / 2) / ALTO;
      var o2 = b.obj.clone().sub(b.r.clone().multiplyScalar(mx * wpp * 1.02)).add(b.u.clone().multiplyScalar(my * wpp * 1.02));
      c.dx = o2.x;
      c.y = o2.y;
      c.dz = o2.z;
    }
    return c;
  }

  /* ---------------- API ---------------- */
  function vista(o) {
    return o;
  }
  function preparar(vt) {
    motor();
    var Js = posar(vt);
    ponerCamara(vt.camara || {});
    return Js;
  }
  function dibujar(canvas, vt) {
    var M = motor();
    preparar(vt);
    M.R.render(M.escena, M.camara);
    var cx = canvas.getContext('2d');
    cx.imageSmoothingEnabled = true;
    cx.imageSmoothingQuality = 'high';
    cx.clearRect(0, 0, ANCHO, ALTO);
    cx.drawImage(M.R.domElement, 0, 0, ANCHO, ALTO);
  }
  // punto del cuerpo (o [x,y,z]) a coordenadas del lienzo; i = la figura
  function proyectar(vt, que, i) {
    var Js = preparar(vt),
      THREE = global.THREE,
      P,
      J = Js[i || 0];
    var lista = figurasDe(vt),
      f = lista[i || 0] || {};
    var fig = MOTOR.figuras[f.quien === 'novia' ? 'novia' : 'tor'][function () {
      var n = 0;
      for (var k = 0; k < (i || 0); k++) if (lista[k].quien === 'novia' === (f.quien === 'novia')) n++;
      return n;
    }()];
    if (Array.isArray(que)) P = v(que[0], que[1], que[2]);else if (que && que.isVector3) P = que.clone();else if (que === 'dorsalI' || que === 'dorsalD' || que === 'romboides' || typeof que === 'string' && que.indexOf('m:') === 0) {
      var nombre = que === 'romboides' ? 'romboides' : que.indexOf('m:') === 0 ? que.split(':')[1] : 'dorsal';
      var cual = que === 'dorsalI' ? 0 : que === 'dorsalD' ? 1 : que.split(':')[2] != null ? +que.split(':')[2] : -1;
      var objs = fig.mus[nombre].objs;
      fig.raiz.updateMatrixWorld(true);
      P = v(0, 0, 0);
      if (cual >= 0) objs[cual].getWorldPosition(P);else {
        objs.forEach(function (o) {
          P.add(o.getWorldPosition(v(0, 0, 0)));
        });
        P.multiplyScalar(1 / objs.length);
      }
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
    esqueleto: esqueleto,
    encuadrar: encuadrar,
    puntosVista: puntosVista,
    cajaEnPantalla: cajaEnPantalla,
    v: v,
    lerpV: function (a, b, k) {
      return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
    }
  };
})(window);
