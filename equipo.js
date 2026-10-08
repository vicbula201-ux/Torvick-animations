/* GENERADO por compilar.js desde equipo.jsx — no editar a mano. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* ============================================================
   EQUIPO — equipamiento de gimnasio para los videos de ejercicios
   Misma familia que la maquina de poleas de B.Estacion: estructura
   blanca con contorno #14110F 15, discos/goma GRY con INK 11,
   puntas redondas. Se suma a window.B (no lo redefine).

   Cada equipo tiene dos formas (+ su geometria):
     B.Xxx(props)    pieza suelta: <svg> con viewBox fijo, prop s, style,
                     children(g) encima (g = B.geoXxx en coords del viewBox)
     B.XxxG(props)   grupo <g> para dibujar DENTRO de otra pieza
                     (fondo(g) / agarre(g) / children(g) de los cuerpos),
                     en las coordenadas del viewBox de esa pieza. opacity opcional.
     B.geoXxx(props) la geometria, sin dibujar
   Las sueltas dibujan la linea de piso en las vistas de costado
   (sinPiso la saca); las G nunca: usa B.PisoG.

   Escala: la del humano de B.Estacion / B.Perfil (~1160 = 1,80 m,
   puno r36). Mancuerna ~308 de largo con k=1, banco 290 de alto
   (altura de rodilla), barra de dominadas 1500 sobre el piso.

   --- Mancuerna (viewBox 400x400, centro 200,200) ---
   B.MancuernaG({ c, ang, k, vista, giro, rodar, tipo, discos, color, a, b, opacity })
     c       [x,y] centro del mango (donde va el puno)
     ang     grados del eje en pantalla (0 = horizontal; 90 = vertical)
     k       escala (1: ~308 de largo, discos r76, mango visible 96)
     vista   'lado' (de costado, default) | 'punta' (de frente al extremo)
     giro    0..1 continuo: 0 = lado, 1 = punta; en el medio, 3/4 con
             discos elipticos. La cabeza +x (la que apunta a ang) queda
             hacia la camara. Pisa a vista.
     tipo    'discos' (default: collar + 3 discos + tuerca) | 'hex' (cabezas hexagonales)
     discos  3 (default) | 2       rodar  grados, gira el hexagono sobre su eje
     color   relleno de discos/cabezas (default GRY; YEL para resaltarla)
     a, b    alternativa a c/ang: centros de las dos cabezas (como pose.mancuerna
             .arriba/.abajo de B.Perfil y B.Frente). El mango se estira; k se
             achica solo si no entra
   B.Mancuerna({ s, ang, vista, giro, rodar, tipo, discos, color, k, children, style })
   B.geoMancuerna(props) -> { c, ang, k, giro, tipo, discos, u (eje), n (normal),
     a, b (centros de las cabezas, b = la de +x), extremos [p0,p1], mango [p0,p1],
     radio (del disco grande), largo (real, sin escorzo), caja {x0,y0,x1,y1} }
     Apoyada en el piso de costado: c = [x, piso - 76*k] (caja.y1 ~ piso + 9).

   --- Banco plano (viewBox 1000x420) ---
   B.BancoG({ vista:'lado', x, largo, x0, x1, y, piso, color, opacity })
     y      cara de arriba del colchon (donde se apoya la espalda)
     piso   y del piso (default y + 290). Si solo hay piso: y = piso - 290
     x + largo (default 780) o x0/x1 (extremos del colchon, como pose.banco)
     color  relleno del colchon (default blanco)
   B.BancoG({ vista:'arriba', x, y, largo, ang, ancho, color })  centro (x,y),
     ancho 200 (B.Frente usa ancho = 2*banco.ancho). Banco vertical en pantalla:
     { x, y0, y1 } (cabecera en y0). Tambien x0/x1 (+ y) horizontal.
   B.Banco({ s, vista, ...lo mismo, sinPiso, children })  defaults: lado x 500
     piso 400 (y 110); arriba centro (500,210)
   B.geoBanco(props)
     lado   -> { vista, x, y, x0, x1, largo, piso, alto, grosor 62, base (cara de
               abajo del colchon), centro [x,y], extremos [[x0,y],[x1,y]], patas [xa,xb] }
     arriba -> { vista, centro, ang, largo, ancho, u, n, extremos, x0, x1, y0, y1
               (caja sin girar), patas [p,p] (centro de cada travesano) }

   --- Barra de dominadas (viewBox 1200x1750) ---
   B.BarraG({ vista:'frente', x, y, ancho, piso, agarre, zona, sinBase, opacity })
     x,y    centro de la barra (y = altura de la barra; default 600,200)
     ancho  entre ejes de los parantes (900; > 2*agarre + zona)
     piso   default y + 1500        agarre  del centro a cada mano (300)
     zona   largo de cada zona de agarre gris (170)    sinBase  sin pies
   B.BarraG({ vista:'lado', x, y, brazo, piso, sinBase })  barra vista de punta en
     (x,y); parante en x - brazo (brazo 340; negativo = parante a la derecha)
   B.Barra({ s, vista, ...lo mismo, sinPiso, children })
   B.geoBarra(props)
     frente -> { vista, x, y, centro, piso, alto, ancho, parantes [xl,xr], x0, x1,
                 extremos, agarre, agarres [[a0,a1],[b0,b1]], manos [[x,y],[x,y]], radio 20 }
     lado   -> { vista, x, y, centro, piso, alto, brazo, parante (x), radio 24 }

   --- Colchoneta (viewBox 1000x300) ---
   B.ColchonetaG({ vista:'lado', x, largo, x0, x1, y, cara, grosor, paneles, color })
     y      linea de apoyo del cuerpo (ej. pose.piso de B.Perfil acostado)
     cara   alto de la cara de arriba que se ve (36; 0 = tira plana)
     grosor alto del canto (22). El piso queda en y + 0.6*cara + grosor
     color  GRY (default) | YEL ...    paneles  n pliegues (1 = lisa)
   B.ColchonetaG({ vista:'arriba', x, y, largo, ancho, paneles, color })  centro (x,y)
     largo 860, ancho 260
   B.Colchoneta({ s, vista, ...lo mismo, sinPiso, children })
   B.geoColchoneta(props)
     lado   -> { vista, x, y, x0, x1, largo, cara, grosor, atras, adelante, piso }
     arriba -> { vista, centro, x0, x1, y0, y1, largo, ancho }

   --- Piso y sombra ---
   B.SombraG({ c, rx = 160, ry = rx*0.16, opacity })  elipse GRY sin borde
   B.PisoG({ y, x0 = 0, x1 = 1300, opacity })        linea GRY 11

   B.EQUIPO  { mancuerna, banco, barra, colchoneta }: medidas por defecto
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var B = global.B;
  var U = B.util;
  var P = global.P;
  var clamp = global.clamp;
  var INK = P.C.INK,
    GRY = P.C.GRY;
  var BLANCO = '#ffffff';
  var GRAD = Math.PI / 180;
  var lerpP = U.lerpP,
    suma = U.suma,
    resta = U.resta,
    por = U.por,
    largo = U.largo,
    polar = U.polar,
    pt = U.pt;

  /* ---------------- ayudas privadas ---------------- */

  function num(v, def) {
    return v == null || isNaN(v) ? def : v;
  }
  function f1(v) {
    return (Math.round(v * 10) / 10).toString();
  }
  function llamar(x, g) {
    return typeof x === 'function' ? x(g) : x;
  }
  function Lienzo(props) {
    var s = props.s == null ? 1 : props.s;
    return /*#__PURE__*/React.createElement("svg", {
      width: props.W * s,
      height: props.H * s,
      viewBox: '0 0 ' + props.W + ' ' + props.H,
      style: Object.assign({
        display: 'block',
        overflow: 'visible'
      }, props.style || {})
    }, props.children);
  }

  // envolvente convexa (cadena monotona); para las caras de los prismas
  function envolvente(pts) {
    var q = pts.slice().sort(function (a, b) {
      return a[0] - b[0] || a[1] - b[1];
    });
    var cruz = function (o, a, b) {
      return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    };
    var lo = [],
      hi = [],
      i;
    for (i = 0; i < q.length; i++) {
      while (lo.length >= 2 && cruz(lo[lo.length - 2], lo[lo.length - 1], q[i]) <= 1e-6) lo.pop();
      lo.push(q[i]);
    }
    for (i = q.length - 1; i >= 0; i--) {
      while (hi.length >= 2 && cruz(hi[hi.length - 2], hi[hi.length - 1], q[i]) <= 1e-6) hi.pop();
      hi.push(q[i]);
    }
    lo.pop();
    hi.pop();
    return lo.concat(hi);
  }
  // poligono cerrado, siempre en sentido horario en pantalla (igual que rrect):
  // asi varias formas en un mismo path se suman y no se agujerean
  function poli(pts) {
    var a = 0;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i],
        q = pts[(i + 1) % pts.length];
      a += p[0] * q[1] - q[0] * p[1];
    }
    var v = a < 0 ? pts.slice().reverse() : pts;
    return 'M ' + v.map(pt).join(' L ') + ' Z';
  }

  // rectangulo redondeado como path (para juntar varios en un solo trazo)
  function rrect(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    return 'M ' + f1(x + r) + ' ' + f1(y) + ' L ' + f1(x + w - r) + ' ' + f1(y) + ' A ' + r + ' ' + r + ' 0 0 1 ' + f1(x + w) + ' ' + f1(y + r) + ' L ' + f1(x + w) + ' ' + f1(y + h - r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + f1(x + w - r) + ' ' + f1(y + h) + ' L ' + f1(x + r) + ' ' + f1(y + h) + ' A ' + r + ' ' + r + ' 0 0 1 ' + f1(x) + ' ' + f1(y + h - r) + ' L ' + f1(x) + ' ' + f1(y + r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + f1(x + r) + ' ' + f1(y) + ' Z';
  }

  // "truco de union": primero todas las formas con trazo grueso (el contorno
  // exterior), despues las mismas con su trazo fino. Afuera queda 15, adentro 11.
  var BAJO = 19; // 19/2 + 11/2 = 15 de contorno exterior

  // estructura soldada: varias formas blancas como UNA silueta (sin costuras
  // adentro), contorno exterior 15 = la mitad de afuera de un trazo de 30
  function Union(props) {
    return /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
      d: props.d,
      fill: props.fill || BLANCO,
      stroke: INK,
      strokeWidth: 30,
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: props.d,
      fill: props.fill || BLANCO,
      stroke: "none"
    }));
  }

  /* =========================================================
     MANCUERNA
     Se arma sobre su eje local: x a lo largo del eje (0 = centro del
     mango), y perpendicular. giro inclina el eje hacia la camara:
     0 = de costado ('lado'), 1 = de punta ('punta'). Proyeccion
     ortogonal: x -> x*cos(giro), los discos se ven como elipses.
     ========================================================= */

  var MANC = {
    rMango: 16,
    discos: {
      mango: 48,
      collar: [16, 26],
      tuerca: [20, 21],
      // discos iguales y uno chico afuera: de punta se leen dos aros + la tuerca
      pila: {
        3: [[26, 76], [24, 76], [20, 58]],
        2: [[30, 76], [24, 58]]
      }
    },
    hex: {
      mango: 56,
      collar: [14, 24],
      cabeza: [82, 72],
      tapa: 34
    }
  };
  function opcionesManc(o) {
    var tipo = o.tipo === 'hex' ? 'hex' : 'discos';
    var nd = o.discos === 2 ? 2 : 3;
    var pila = MANC.discos.pila[nd];
    var largoPila = pila.reduce(function (a, d) {
      return a + d[0];
    }, 0);
    // del final del mango al centro de la cabeza, y al extremo
    var aCab = tipo === 'hex' ? MANC.hex.collar[0] + MANC.hex.cabeza[0] / 2 : MANC.discos.collar[0] + largoPila / 2;
    var aFin = tipo === 'hex' ? MANC.hex.collar[0] + MANC.hex.cabeza[0] : MANC.discos.collar[0] + largoPila + MANC.discos.tuerca[0];
    var rMax = tipo === 'hex' ? MANC.hex.cabeza[1] : pila[0][1];
    return {
      tipo: tipo,
      nd: nd,
      pila: pila,
      aCab: aCab,
      aFin: aFin,
      rMax: rMax,
      mango: tipo === 'hex' ? MANC.hex.mango : MANC.discos.mango
    };
  }
  function geoMancuerna(o) {
    o = o || {};
    var op = opcionesManc(o);
    var k = num(o.k, 1);
    var giro = o.giro != null ? clamp(o.giro, 0, 1) : o.vista === 'punta' ? 1 : 0;
    var co = Math.cos(giro * 90 * GRAD),
      si = Math.sin(giro * 90 * GRAD);
    var c, ang, hm;
    if (o.a && o.b) {
      // a y b: centros de las dos cabezas. El mango se estira; si no entra, se achica todo
      var d = resta(o.b, o.a);
      c = lerpP(o.a, o.b, 0.5);
      ang = Math.atan2(d[1], d[0]) / GRAD;
      var real = largo(d) / Math.max(co, 0.25);
      hm = real / 2 - op.aCab * k;
      if (hm < 34 * k) {
        k = real / 2 / (34 + op.aCab);
        hm = 34 * k;
      }
    } else {
      c = o.c || [0, 0];
      ang = num(o.ang, 0);
      hm = op.mango * k;
    }
    var u = polar(ang, 1),
      n = [-u[1], u[0]];
    var en = function (x) {
      return suma(c, por(u, x * co));
    };
    // caja en pantalla (con el contorno): para apoyarla en el piso o encuadrarla
    var A = (hm + op.aFin * k) * co + op.rMax * k * si + 9,
      Bn = op.rMax * k + 9;
    var hx = Math.abs(u[0]) * A + Math.abs(n[0]) * Bn,
      hy = Math.abs(u[1]) * A + Math.abs(n[1]) * Bn;
    var caja = {
      x0: c[0] - hx,
      y0: c[1] - hy,
      x1: c[0] + hx,
      y1: c[1] + hy
    };
    return {
      c: c,
      ang: ang,
      k: k,
      giro: giro,
      tipo: op.tipo,
      discos: op.nd,
      u: u,
      n: n,
      a: en(-(hm + op.aCab * k)),
      b: en(hm + op.aCab * k),
      extremos: [en(-(hm + op.aFin * k)), en(hm + op.aFin * k)],
      mango: [en(-hm), en(hm)],
      radio: op.rMax * k,
      largo: 2 * (hm + op.aFin * k),
      caja: caja,
      _hm: hm,
      _op: op
    };
  }

  // lista de piezas sobre el eje local, de atras (x negativo) hacia adelante
  function piezasManc(g, color) {
    var op = g._op,
      k = g.k,
      hm = g._hm;
    var lst = [];
    var poner = function (sg, x0, x1, r, forma, fill, papel) {
      if (sg > 0) lst.push({
        x0: x0,
        x1: x1,
        r: r,
        forma: forma,
        fill: fill,
        papel: papel,
        sg: sg
      });else lst.push({
        x0: -x1,
        x1: -x0,
        r: r,
        forma: forma,
        fill: fill,
        papel: papel,
        sg: sg
      });
    };
    [-1, 1].forEach(function (sg) {
      var x = hm;
      if (op.tipo === 'hex') {
        var hc = MANC.hex;
        poner(sg, x, x + hc.collar[0] * k, hc.collar[1] * k, 'cil', BLANCO, 'collar');
        x += hc.collar[0] * k;
        poner(sg, x, x + hc.cabeza[0] * k, hc.cabeza[1] * k, 'hex', color, 'cabeza');
      } else {
        var dc = MANC.discos;
        poner(sg, x, x + dc.collar[0] * k, dc.collar[1] * k, 'cil', BLANCO, 'collar');
        x += dc.collar[0] * k;
        op.pila.forEach(function (d) {
          poner(sg, x, x + d[0] * k, d[1] * k, 'cil', color, 'disco');
          x += d[0] * k;
        });
        poner(sg, x, x + dc.tuerca[0] * k, dc.tuerca[1] * k, 'cil', BLANCO, 'tuerca');
      }
    });
    lst.push({
      x0: -hm,
      x1: hm,
      r: MANC.rMango * k,
      forma: 'cil',
      fill: BLANCO,
      papel: 'mango',
      sg: 0
    });
    lst.sort(function (a, b) {
      return a.x0 + a.x1 - (b.x0 + b.x1);
    });
    // discos iguales y pegados: un solo cilindro con ranuras (asi, inclinada,
    // la pila no se llena de contornos superpuestos)
    var out = [];
    lst.forEach(function (p) {
      var u = out[out.length - 1];
      if (u && u.papel === 'disco' && p.papel === 'disco' && Math.abs(u.r - p.r) < 0.01 && Math.abs(u.x1 - p.x0) < 0.01) {
        u.cortes.push(u.x1);
        u.x1 = p.x1;
      } else {
        out.push(Object.assign({
          cortes: []
        }, p));
      }
    });
    return out;
  }

  // cilindro proyectado: cascara (contorno) + cara de adelante (la de x1)
  function cilindro(p, co, si) {
    var bx = p.x0 * co,
      fx = p.x1 * co,
      r = p.r,
      rx = Math.max(r * si, 0);
    var a = ' A ' + f1(rx) + ' ' + f1(r) + ' 0 0 1 ';
    return {
      casc: 'M ' + f1(bx) + ' ' + f1(-r) + ' L ' + f1(fx) + ' ' + f1(-r) + a + f1(fx) + ' ' + f1(r) + ' L ' + f1(bx) + ' ' + f1(r) + a + f1(bx) + ' ' + f1(-r) + ' Z',
      cara: si > 0.03 ? {
        cx: fx,
        rx: rx,
        ry: r
      } : null
    };
  }

  // prisma hexagonal: vertices en el plano del disco (y = pantalla, z = hacia la camara)
  function prisma(p, co, si, rodar) {
    var vs = [];
    for (var i = 0; i < 6; i++) {
      var f = (60 * i + rodar) * GRAD;
      vs.push([Math.cos(f) * p.r, Math.sin(f) * p.r, f]);
    }
    var proy = function (x, v) {
      return [x * co - v[1] * si, v[0]];
    };
    var atras = vs.map(function (v) {
      return proy(p.x0, v);
    });
    var adel = vs.map(function (v) {
      return proy(p.x1, v);
    });
    // aristas largas visibles: entre dos caras que miran a la camara
    var aristas = [];
    for (var j = 0; j < 6; j++) {
      var fa = (60 * j - 30 + rodar) * GRAD,
        fb = (60 * j + 30 + rodar) * GRAD;
      if (Math.sin(fa) * co > 0.05 && Math.sin(fb) * co > 0.05) aristas.push([atras[j], adel[j]]);
    }
    return {
      casc: poli(envolvente(atras.concat(adel))),
      aristas: aristas,
      cara: si > 0.03 ? poli(adel) : null,
      centro: [p.x1 * co, 0]
    };
  }
  function MancuernaG(props) {
    var g = geoMancuerna(props);
    var color = props.color || GRY;
    var giro = g.giro;
    var co = Math.cos(giro * 90 * GRAD),
      si = Math.sin(giro * 90 * GRAD);
    var rodar = num(props.rodar, 0);
    var piezas = piezasManc(g, color).map(function (p) {
      return Object.assign({
        geo: p.forma === 'hex' ? prisma(p, co, si, rodar) : cilindro(p, co, si)
      }, p);
    });
    var trazo = {
      stroke: INK,
      strokeWidth: 11,
      strokeLinejoin: 'round',
      strokeLinecap: 'round'
    };
    var hm = g._hm;
    return /*#__PURE__*/React.createElement("g", {
      transform: 'translate(' + f1(g.c[0]) + ' ' + f1(g.c[1]) + ') rotate(' + f1(g.ang) + ')',
      opacity: props.opacity
    }, /*#__PURE__*/React.createElement("path", {
      d: piezas.map(function (p) {
        return p.geo.casc;
      }).join(' '),
      fill: BLANCO,
      stroke: INK,
      strokeWidth: BAJO,
      strokeLinejoin: "round"
    }), piezas.map(function (p, i) {
      var G = p.geo;
      if (p.papel === 'mango') {
        // mango con moleteado: rayitas grises en la zona de agarre
        var rayas = [];
        if (co > 0.25) {
          var paso = 19 * g.k,
            nr = Math.floor(2 * (hm - 20 * g.k) / paso) + 1;
          for (var ir = 0; ir < nr; ir++) {
            var x = (ir - (nr - 1) / 2) * paso;
            rayas.push('M ' + f1(x * co - 5) + ' ' + f1(-6 * g.k) + ' L ' + f1(x * co + 5) + ' ' + f1(6 * g.k));
          }
        }
        return /*#__PURE__*/React.createElement("g", {
          key: i
        }, /*#__PURE__*/React.createElement("path", {
          d: G.casc,
          fill: BLANCO,
          stroke: "none"
        }), rayas.length ? /*#__PURE__*/React.createElement("path", {
          d: rayas.join(' '),
          stroke: GRY,
          strokeWidth: 11,
          strokeLinecap: "round"
        }) : null, /*#__PURE__*/React.createElement("path", _extends({
          d: G.casc,
          fill: "none"
        }, trazo)));
      }
      if (p.forma === 'hex') {
        return /*#__PURE__*/React.createElement("g", {
          key: i
        }, /*#__PURE__*/React.createElement("path", _extends({
          d: G.casc,
          fill: p.fill
        }, trazo)), G.aristas.map(function (a, j) {
          return /*#__PURE__*/React.createElement("path", _extends({
            key: j,
            d: 'M ' + pt(a[0]) + ' L ' + pt(a[1]),
            fill: "none"
          }, trazo));
        }), G.cara ? /*#__PURE__*/React.createElement("path", _extends({
          d: G.cara,
          fill: p.fill
        }, trazo)) : null, G.cara && si > 0.2 && p.sg > 0 ? /*#__PURE__*/React.createElement("ellipse", _extends({
          cx: G.centro[0],
          cy: 0,
          rx: MANC.hex.tapa * g.k * si,
          ry: MANC.hex.tapa * g.k,
          fill: p.fill
        }, trazo)) : null);
      }
      var cara = G.cara;
      return /*#__PURE__*/React.createElement("g", {
        key: i
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: G.casc,
        fill: p.fill
      }, trazo)), p.cortes.map(function (xc, j) {
        if ((xc - p.x0) * co < 13 || (p.x1 - xc) * co < 13) return null;
        var cx = xc * co,
          rx = p.r * si;
        return /*#__PURE__*/React.createElement("path", _extends({
          key: 'r' + j,
          d: 'M ' + f1(cx) + ' ' + f1(-p.r) + ' A ' + f1(rx) + ' ' + f1(p.r) + ' 0 0 0 ' + f1(cx) + ' ' + f1(p.r),
          fill: "none"
        }, trazo));
      }), cara ? /*#__PURE__*/React.createElement("ellipse", _extends({
        cx: cara.cx,
        cy: 0,
        rx: cara.rx,
        ry: cara.ry,
        fill: p.fill
      }, trazo)) : null, cara && p.papel === 'tuerca' && p.sg > 0 && si > 0.3 ? /*#__PURE__*/React.createElement("circle", {
        cx: cara.cx,
        cy: 0,
        r: 7 * g.k,
        fill: INK
      }) : null);
    }));
  }
  function Mancuerna(props) {
    var o = Object.assign({}, props, {
      c: [200, 200],
      a: null,
      b: null
    });
    var g = geoMancuerna(o);
    return /*#__PURE__*/React.createElement(Lienzo, {
      W: 400,
      H: 400,
      s: props.s,
      style: props.style
    }, /*#__PURE__*/React.createElement(MancuernaG, _extends({}, o, {
      children: null
    })), llamar(props.children, g));
  }

  /* =========================================================
     BANCO plano
     'lado'   colchon (rect redondeado, costura gris) + viga + dos patas
              en T con refuerzos, todo soldado en una silueta. y = cara de arriba
     'arriba' el colchon visto desde arriba + los travesanos de las patas
              que asoman a los costados (con tacos de goma GRY)
     ========================================================= */

  var BANCO = {
    alto: 290,
    largo: 780,
    ancho: 200,
    colchon: 62,
    viga: 30,
    pata: 44
  };
  function geoBanco(o) {
    o = o || {};
    var vista = o.vista === 'arriba' ? 'arriba' : 'lado';
    if (vista === 'arriba') {
      var anchoA = num(o.ancho, BANCO.ancho);
      var cA, angA, LA;
      if (o.y0 != null && o.y1 != null) {
        // banco vertical en pantalla (cabecera arriba), como el de B.Frente cenital
        cA = [num(o.x, 500), (o.y0 + o.y1) / 2];
        angA = 90;
        LA = Math.abs(o.y1 - o.y0);
      } else if (o.x0 != null && o.x1 != null) {
        cA = [(o.x0 + o.x1) / 2, num(o.y, 210)];
        angA = num(o.ang, 0);
        LA = Math.abs(o.x1 - o.x0);
      } else {
        cA = [num(o.x, 500), num(o.y, 210)];
        angA = num(o.ang, 0);
        LA = num(o.largo, BANCO.largo);
      }
      var uA = polar(angA, 1);
      var retA = clamp(LA * 0.17, 70, 140);
      return {
        vista: vista,
        centro: cA,
        ang: angA,
        largo: LA,
        ancho: anchoA,
        u: uA,
        n: [-uA[1], uA[0]],
        extremos: [suma(cA, por(uA, -LA / 2)), suma(cA, por(uA, LA / 2))],
        x0: cA[0] - LA / 2,
        x1: cA[0] + LA / 2,
        y0: cA[1] - anchoA / 2,
        y1: cA[1] + anchoA / 2,
        patas: [-LA / 2 + retA, LA / 2 - retA].map(function (d) {
          return suma(cA, por(uA, d));
        }),
        _ret: retA
      };
    }
    var x0, x1;
    if (o.x0 != null && o.x1 != null) {
      x0 = Math.min(o.x0, o.x1);
      x1 = Math.max(o.x0, o.x1);
    } else {
      var L = num(o.largo, BANCO.largo),
        x = num(o.x, 500);
      x0 = x - L / 2;
      x1 = x + L / 2;
    }
    var y, piso;
    if (o.y != null) {
      y = o.y;
      piso = num(o.piso, y + BANCO.alto);
    } else {
      piso = num(o.piso, 400);
      y = piso - BANCO.alto;
    }
    var Lr = x1 - x0;
    var retiro = clamp(Lr * 0.17, 70, 140);
    return {
      vista: vista,
      x: (x0 + x1) / 2,
      y: y,
      x0: x0,
      x1: x1,
      largo: Lr,
      piso: piso,
      alto: piso - y,
      grosor: BANCO.colchon,
      base: y + BANCO.colchon,
      centro: [(x0 + x1) / 2, y],
      extremos: [[x0, y], [x1, y]],
      patas: [x0 + retiro, x1 - retiro]
    };
  }
  function BancoG(props) {
    var g = geoBanco(props);
    var color = props.color || BLANCO;
    var linea = {
      fill: 'none',
      stroke: GRY,
      strokeWidth: 11,
      strokeLinecap: 'round'
    };
    if (g.vista === 'arriba') {
      var L = g.largo,
        W = g.ancho;
      var dxs = [-L / 2 + g._ret, L / 2 - g._ret];
      // travesanos de las patas: asoman a los dos lados del colchon
      var pies = dxs.map(function (dx) {
        return rrect(dx - 28, -W / 2 - 74, 56, W + 148, 22);
      }).join(' ');
      var gomas = [];
      dxs.forEach(function (dx) {
        gomas.push(rrect(dx - 22, -W / 2 - 68, 44, 34, 14), rrect(dx - 22, W / 2 + 34, 44, 34, 14));
      });
      return /*#__PURE__*/React.createElement("g", {
        transform: 'translate(' + f1(g.centro[0]) + ' ' + f1(g.centro[1]) + ') rotate(' + f1(g.ang) + ')',
        opacity: props.opacity,
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement(Union, {
        d: pies
      }), /*#__PURE__*/React.createElement("path", {
        d: gomas.join(' '),
        fill: GRY,
        stroke: INK,
        strokeWidth: 11
      }), /*#__PURE__*/React.createElement("rect", {
        x: -L / 2,
        y: -W / 2,
        width: L,
        height: W,
        rx: 44,
        fill: color,
        stroke: INK,
        strokeWidth: 15
      }), /*#__PURE__*/React.createElement("rect", _extends({
        x: -L / 2 + 26,
        y: -W / 2 + 26,
        width: L - 52,
        height: W - 52,
        rx: 26
      }, linea)));
    }
    var x0 = g.x0,
      x1 = g.x1,
      y = g.y,
      piso = g.piso;
    var yb = y + BANCO.colchon; // cara de abajo del colchon
    var yv = yb + BANCO.viga; // cara de abajo de la viga
    var hp = BANCO.pata / 2;
    var pie = 30;
    var yPie = piso - pie;
    // estructura (viga + patas en T + refuerzos) como una sola silueta
    var vx0 = Math.min(x0 + 84, g.patas[0] - hp - 20),
      vx1 = Math.max(x1 - 84, g.patas[1] + hp + 20);
    var est = [rrect(vx0, yb - 14, vx1 - vx0, BANCO.viga + 14, 10)];
    g.patas.forEach(function (xp) {
      est.push(rrect(xp - hp, yv - 10, BANCO.pata, yPie - yv + 20, 6));
      var hacia = xp < g.x ? 1 : -1;
      est.push(poli([[xp + hacia * hp - hacia * 4, yv - 4], [xp + hacia * (hp + 46), yv - 4], [xp + hacia * hp - hacia * 4, yv + 46]]));
      est.push(rrect(xp - 84, yPie, 168, pie, 14));
    });
    return /*#__PURE__*/React.createElement("g", {
      opacity: props.opacity,
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement(Union, {
      d: est.join(' ')
    }), /*#__PURE__*/React.createElement("rect", {
      x: x0,
      y: y,
      width: x1 - x0,
      height: BANCO.colchon,
      rx: 28,
      fill: color,
      stroke: INK,
      strokeWidth: 15
    }), /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + f1(x0 + 34) + ' ' + f1(y + 22) + ' L ' + f1(x1 - 34) + ' ' + f1(y + 22)
    }, linea)));
  }
  function Banco(props) {
    var arriba = props.vista === 'arriba';
    var o = Object.assign({}, props);
    if (!arriba) {
      if (o.x == null && o.x0 == null) o.x = 500;
      if (o.y == null && o.piso == null) o.piso = 400;
    } else {
      if (o.x == null && o.x0 == null) o.x = 500;
      if (o.y == null && o.y0 == null) o.y = 210;
    }
    var g = geoBanco(o);
    return /*#__PURE__*/React.createElement(Lienzo, {
      W: 1000,
      H: 420,
      s: props.s,
      style: props.style
    }, !arriba && !props.sinPiso ? /*#__PURE__*/React.createElement(PisoG, {
      y: g.piso,
      x0: 20,
      x1: 980
    }) : null, /*#__PURE__*/React.createElement(BancoG, o), llamar(props.children, g));
  }

  /* =========================================================
     BARRA de dominadas
     'frente' dos parantes + barra con zonas de agarre + pies
     'lado'   un parante + brazo + la barra vista de punta
     ========================================================= */

  var BARRA = {
    alto: 1500,
    ancho: 900,
    agarre: 300,
    zona: 170,
    brazo: 340,
    grosor: 40,
    parante: 60
  };
  function geoBarra(o) {
    o = o || {};
    var vista = o.vista === 'lado' ? 'lado' : 'frente';
    var x = num(o.x, vista === 'lado' ? 760 : 600);
    var y = num(o.y, 200);
    var piso = num(o.piso, y + BARRA.alto);
    if (vista === 'lado') {
      var brazo = num(o.brazo, BARRA.brazo);
      return {
        vista: vista,
        x: x,
        y: y,
        centro: [x, y],
        piso: piso,
        alto: piso - y,
        brazo: brazo,
        parante: x - brazo,
        radio: BARRA.grosor / 2 + 4
      };
    }
    var ancho = num(o.ancho, BARRA.ancho);
    var agarre = num(o.agarre, BARRA.agarre);
    var zona = num(o.zona, BARRA.zona);
    var xl = x - ancho / 2,
      xr = x + ancho / 2;
    return {
      vista: vista,
      x: x,
      y: y,
      centro: [x, y],
      piso: piso,
      alto: piso - y,
      ancho: ancho,
      parantes: [xl, xr],
      x0: xl - 64,
      x1: xr + 64,
      extremos: [[xl - 64, y], [xr + 64, y]],
      agarre: agarre,
      agarres: [[x - agarre - zona / 2, x - agarre + zona / 2], [x + agarre - zona / 2, x + agarre + zona / 2]],
      manos: [[x - agarre, y], [x + agarre, y]],
      radio: BARRA.grosor / 2
    };
  }

  // agujeros del rack: puntos grises a lo largo del parante
  function agujeros(xp, yA, yB) {
    var d = '';
    for (var yy = yA; yy <= yB; yy += 62) d += 'M ' + f1(xp) + ' ' + f1(yy) + ' l 0 0.1 ';
    return d;
  }
  function BarraG(props) {
    var g = geoBarra(props);
    var hp = BARRA.parante / 2,
      pie = 40;
    var piso = g.piso,
      y = g.y;
    var yPie = piso - pie;
    var conBase = !props.sinBase;
    var est = [],
      huecos = '',
      tapas = [];
    // parante con su pie en T y dos refuerzos; ancho = largo del pie
    var parante = function (xp, yTop, ancho) {
      est.push(rrect(xp - hp, yTop, BARRA.parante, (conBase ? yPie + 10 : piso) - yTop, 10));
      tapas.push(rrect(xp - hp + 8, yTop - 12, BARRA.parante - 16, 22, 8));
      if (!conBase) return;
      est.push(rrect(xp - ancho / 2, yPie, ancho, pie, 16));
      [-1, 1].forEach(function (sg) {
        est.push(poli([[xp + sg * (hp - 4), yPie + 4], [xp + sg * (hp + 92), yPie + 4], [xp + sg * (hp - 4), yPie - 92]]));
      });
    };
    if (g.vista === 'lado') {
      var xp = g.parante,
        sg = g.brazo >= 0 ? 1 : -1; // sg: hacia donde sale el brazo
      parante(xp, y - 150, 540);
      // brazo: del parante a la barra, con su refuerzo
      var xa = xp + sg * (hp - 6),
        xb = g.x;
      est.push(rrect(Math.min(xa, xb), y - 24, Math.abs(xb - xa), 48, 12));
      est.push(poli([[xa, y + 16], [xa + sg * 104, y + 16], [xa, y + 120]]));
      huecos = agujeros(xp, y + 150, yPie - 130);
      return /*#__PURE__*/React.createElement("g", {
        opacity: props.opacity,
        strokeLinejoin: "round",
        strokeLinecap: "round"
      }, /*#__PURE__*/React.createElement(Union, {
        d: est.join(' ')
      }), /*#__PURE__*/React.createElement("path", {
        d: huecos,
        stroke: GRY,
        strokeWidth: 16,
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: tapas.join(' '),
        fill: GRY,
        stroke: INK,
        strokeWidth: 11
      }), /*#__PURE__*/React.createElement("circle", {
        cx: g.x,
        cy: y,
        r: g.radio + 8,
        fill: BLANCO,
        stroke: INK,
        strokeWidth: 15
      }), /*#__PURE__*/React.createElement("circle", {
        cx: g.x,
        cy: y,
        r: g.radio - 10,
        fill: GRY,
        stroke: INK,
        strokeWidth: 11
      }));
    }
    var xl = g.parantes[0],
      xr = g.parantes[1];
    parante(xl, y - 70, 300);
    parante(xr, y - 70, 300);
    huecos = agujeros(xl, y + 110, yPie - 130) + agujeros(xr, y + 110, yPie - 130);
    var gr = BARRA.grosor;
    var zonas = g.agarres.map(function (z) {
      return rrect(z[0], y - gr / 2, z[1] - z[0], gr, 6);
    }).join(' ');
    return /*#__PURE__*/React.createElement("g", {
      opacity: props.opacity,
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement(Union, {
      d: est.join(' ')
    }), /*#__PURE__*/React.createElement("path", {
      d: huecos,
      stroke: GRY,
      strokeWidth: 16,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: tapas.join(' '),
      fill: GRY,
      stroke: INK,
      strokeWidth: 11
    }), /*#__PURE__*/React.createElement("rect", {
      x: g.x0,
      y: y - gr / 2,
      width: g.x1 - g.x0,
      height: gr,
      rx: gr / 2,
      fill: BLANCO,
      stroke: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: zonas,
      fill: GRY,
      stroke: "none"
    }), /*#__PURE__*/React.createElement("path", {
      d: zonas,
      fill: "none",
      stroke: INK,
      strokeWidth: 11
    }), /*#__PURE__*/React.createElement("rect", {
      x: g.x0,
      y: y - gr / 2,
      width: g.x1 - g.x0,
      height: gr,
      rx: gr / 2,
      fill: "none",
      stroke: INK,
      strokeWidth: 15
    }), [xl, xr].map(function (xp, i) {
      return /*#__PURE__*/React.createElement("circle", {
        key: 'tu' + i,
        cx: xp,
        cy: y,
        r: 22,
        fill: BLANCO,
        stroke: INK,
        strokeWidth: 11
      });
    }));
  }
  function Barra(props) {
    var g = geoBarra(props);
    return /*#__PURE__*/React.createElement(Lienzo, {
      W: 1200,
      H: 1750,
      s: props.s,
      style: props.style
    }, !props.sinPiso ? /*#__PURE__*/React.createElement(PisoG, {
      y: g.piso,
      x0: 20,
      x1: 1180
    }) : null, /*#__PURE__*/React.createElement(BarraG, props), llamar(props.children, g));
  }

  /* =========================================================
     COLCHONETA
     'lado'   cara de arriba (banda que se ve con la camara apenas
              elevada) + canto. y = linea de apoyo del cuerpo
     'arriba' rectangulo redondeado, con pliegues si paneles > 1
     ========================================================= */

  var COLCH = {
    largo: 860,
    ancho: 260,
    grosor: 22,
    cara: 36
  };
  function geoColchoneta(o) {
    o = o || {};
    var vista = o.vista === 'arriba' ? 'arriba' : 'lado';
    var x0, x1;
    if (o.x0 != null && o.x1 != null) {
      x0 = Math.min(o.x0, o.x1);
      x1 = Math.max(o.x0, o.x1);
    } else {
      var L = num(o.largo, COLCH.largo),
        x = num(o.x, 500);
      x0 = x - L / 2;
      x1 = x + L / 2;
    }
    var y = num(o.y, 150);
    if (vista === 'arriba') {
      var W = num(o.ancho, COLCH.ancho);
      return {
        vista: vista,
        centro: [(x0 + x1) / 2, y],
        x0: x0,
        x1: x1,
        y0: y - W / 2,
        y1: y + W / 2,
        largo: x1 - x0,
        ancho: W
      };
    }
    var cara = num(o.cara, COLCH.cara),
      grosor = num(o.grosor, COLCH.grosor);
    return {
      vista: vista,
      x: (x0 + x1) / 2,
      y: y,
      x0: x0,
      x1: x1,
      largo: x1 - x0,
      cara: cara,
      grosor: grosor,
      atras: y - cara * 0.4,
      adelante: y + cara * 0.6,
      piso: y + cara * 0.6 + grosor
    };
  }
  function ColchonetaG(props) {
    var g = geoColchoneta(props);
    var color = props.color || GRY;
    var trazo = {
      stroke: INK,
      strokeLinejoin: 'round',
      strokeLinecap: 'round'
    };
    if (g.vista === 'arriba') {
      var n = Math.max(1, Math.round(num(props.paneles, 1)));
      var pl = '';
      for (var i = 1; i < n; i++) {
        var xx = g.x0 + (g.x1 - g.x0) * i / n;
        pl += 'M ' + f1(xx) + ' ' + f1(g.y0 + 18) + ' L ' + f1(xx) + ' ' + f1(g.y1 - 18) + ' ';
      }
      return /*#__PURE__*/React.createElement("g", {
        opacity: props.opacity
      }, /*#__PURE__*/React.createElement("rect", _extends({
        x: g.x0,
        y: g.y0,
        width: g.largo,
        height: g.ancho,
        rx: 34,
        fill: color,
        strokeWidth: 15
      }, trazo)), pl ? /*#__PURE__*/React.createElement("path", _extends({
        d: pl,
        fill: "none",
        strokeWidth: 11
      }, trazo)) : null);
    }
    var x0 = g.x0,
      x1 = g.x1,
      yA = g.atras,
      yB = g.adelante,
      yP = g.piso;
    var r = Math.min(26, (yP - yA) / 2);
    // silueta entera (cara + canto) y la arista que las separa
    var sil = rrect(x0, yA, x1 - x0, yP - yA, r);
    var n2 = Math.max(1, Math.round(num(props.paneles, 1)));
    var pl2 = '';
    for (var j = 1; j < n2; j++) {
      var xq = x0 + (x1 - x0) * j / n2;
      pl2 += 'M ' + f1(xq) + ' ' + f1(yA + 6) + ' L ' + f1(xq) + ' ' + f1(yP - 6) + ' ';
    }
    return /*#__PURE__*/React.createElement("g", {
      opacity: props.opacity
    }, /*#__PURE__*/React.createElement("path", _extends({
      d: sil,
      fill: color,
      strokeWidth: 15
    }, trazo)), g.cara > 4 ? /*#__PURE__*/React.createElement("path", _extends({
      d: 'M ' + f1(x0 + 8) + ' ' + f1(yB) + ' L ' + f1(x1 - 8) + ' ' + f1(yB),
      fill: "none",
      strokeWidth: 11
    }, trazo)) : null, pl2 ? /*#__PURE__*/React.createElement("path", _extends({
      d: pl2,
      fill: "none",
      strokeWidth: 11
    }, trazo)) : null);
  }
  function Colchoneta(props) {
    var g = geoColchoneta(props);
    return /*#__PURE__*/React.createElement(Lienzo, {
      W: 1000,
      H: 300,
      s: props.s,
      style: props.style
    }, g.vista === 'lado' && !props.sinPiso ? /*#__PURE__*/React.createElement(PisoG, {
      y: g.piso,
      x0: 20,
      x1: 980
    }) : null, /*#__PURE__*/React.createElement(ColchonetaG, props), llamar(props.children, g));
  }

  /* ---------------- sombra y piso ---------------- */

  function SombraG(props) {
    var c = props.c || [0, 0];
    var rx = num(props.rx, 160);
    var ry = num(props.ry, rx * 0.16);
    return /*#__PURE__*/React.createElement("ellipse", {
      cx: c[0],
      cy: c[1],
      rx: rx,
      ry: ry,
      fill: GRY,
      stroke: "none",
      opacity: props.opacity
    });
  }
  function PisoG(props) {
    return /*#__PURE__*/React.createElement("path", {
      d: 'M ' + f1(num(props.x0, 0)) + ' ' + f1(props.y) + ' L ' + f1(num(props.x1, 1300)) + ' ' + f1(props.y),
      stroke: GRY,
      strokeWidth: 11,
      strokeLinecap: "round",
      fill: "none",
      opacity: props.opacity
    });
  }
  Object.assign(B, {
    Mancuerna: Mancuerna,
    MancuernaG: MancuernaG,
    geoMancuerna: geoMancuerna,
    Banco: Banco,
    BancoG: BancoG,
    geoBanco: geoBanco,
    Barra: Barra,
    BarraG: BarraG,
    geoBarra: geoBarra,
    Colchoneta: Colchoneta,
    ColchonetaG: ColchonetaG,
    geoColchoneta: geoColchoneta,
    SombraG: SombraG,
    PisoG: PisoG,
    EQUIPO: {
      mancuerna: {
        largo: 308,
        radio: 76,
        mango: 96,
        puno: 36
      },
      banco: BANCO,
      barra: BARRA,
      colchoneta: COLCH
    }
  });
})(window);
