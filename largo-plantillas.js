/* GENERADO por compilar.js desde largo-plantillas.jsx — no editar a mano. */
/* ============================================================
   PLANTILLAS LARGAS — window.LARGOS.X: escenas armadas con datos
   Cada una es una escena a pantalla completa para LARGOS.plan.escena(ini, fin, X.Algo, props).
   Los tiempos (c) van en segundos del video; si faltan, se reparten con f(fraccion).

     Fila       1 a 4 stickers en fila con conectores (→ = + vs) y rotulos
     Palabra    frase grande que aparece palabra por palabra al ritmo de la voz
     Vs         comparacion en dos mitades (mal / bien)
     Alrededor  un centro y cosas que lo rodean (factores, causas)
     Lista      tarjeta de pendientes que se tachan
     Balanza    dos platos que se inclinan
     Camino     dos caminos: el facil baja, el dificil sube
     Grafico    ejes con curvas que se dibujan y rotulos
     Numero     un numero grande que cuenta
     Multitud   cuadricula de personas grises con alguna destacada
     Paso       tarjeta de recomendacion numerada (fondo amarillo)
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var L = global.LARGOS,
    E = L.E,
    M = global.M;
  var Easing = global.Easing,
    clamp = global.clamp;
  var INK = '#14110F',
    YEL = '#FFD400',
    RED = '#E03A2F',
    GRN = '#16A06A',
    GRY = '#C9C3B8';
  function reloj(props) {
    var at = props.at,
      dur = props.dur;
    return function (v) {
      return at + dur * v;
    };
  }

  // la escena nunca entra vacia: su primera pieza aparece apenas termina de entrar
  // (el resto sigue a la voz)
  function ancla(c, at, margen) {
    return Math.min(c, at + (margen == null ? 0.2 : margen));
  }

  // rotulo o texto bajo una pieza
  function Etiqueta(props) {
    var T = props.T;
    if (!props.txt) return null;
    if (props.estilo === 'titulo') {
      return /*#__PURE__*/React.createElement(E.Tx, {
        T: T,
        x: props.x,
        y: props.y,
        c: props.c,
        s: props.s,
        tam: props.tam || 0.62,
        color: props.color || 'negro'
      }, props.txt);
    }
    return /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: props.x,
      y: props.y,
      c: props.c,
      s: props.s,
      tam: props.tam || 0.9,
      dir: props.dir || 'ninguna',
      fondo: props.fondo
    }, props.txt);
  }

  /* ---------------- Fila ---------------- */

  function Fila(props) {
    var T = props.T,
      f = reloj(props);
    var items = props.items || [];
    var n = items.length;
    var ancho = props.ancho || (n >= 4 ? 1640 : n === 3 ? 1500 : n === 2 ? 1180 : 600);
    var paso = ancho / Math.max(1, n);
    var x0 = 960 - ancho / 2;
    var y = props.y || (props.titulo ? 560 : 500);
    var tam = props.tam || (n >= 4 ? 250 : n === 3 ? 290 : 340);
    var cs = items.map(function (it, i) {
      return it.c != null ? it.c : f(0.04 + 0.62 * i / Math.max(1, n));
    });
    if (n && !props.titulo) cs[0] = ancla(cs[0], props.at);else if (n) cs[0] = ancla(cs[0], props.at, 0.9);
    var con = props.con;
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo
    }, props.titulo ? /*#__PURE__*/React.createElement(E.Resalta, {
      T: T,
      x: 960,
      y: 140,
      c: props.cTitulo || f(0.01),
      tam: props.tamTitulo || 1,
      color: props.colorTitulo
    }, props.titulo) : null, items.map(function (it, i) {
      var x = it.x != null ? it.x : x0 + paso * (i + 0.5);
      var yi = it.y != null ? it.y : y + (it.dy || 0);
      var c = cs[i];
      var conector = Array.isArray(con) ? con[i] : con;
      var sig = i < n - 1 ? props.cCon && props.cCon[i] != null ? props.cCon[i] : cs[i + 1] - 0.18 : null;
      var xm = x + paso / 2;
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, it.n ? /*#__PURE__*/React.createElement(E.St, {
        T: T,
        n: it.n,
        x: x,
        y: yi,
        tam: it.tam || tam,
        c: c,
        s: it.s,
        rot: it.rot
      }) : null, it.grande ? /*#__PURE__*/React.createElement(E.Tx, {
        T: T,
        x: x,
        y: yi,
        c: c,
        s: it.s,
        tam: it.grande,
        color: it.color || 'negro'
      }, it.texto) : null, /*#__PURE__*/React.createElement(Etiqueta, {
        T: T,
        x: x,
        y: yi + (it.tam || tam) * 0.5 + 70,
        c: c + 0.1,
        s: it.s,
        txt: it.txt,
        estilo: it.estilo || props.estiloTxt,
        color: it.color,
        fondo: it.fondoTxt,
        tam: props.tamTxt
      }), it.tacha ? /*#__PURE__*/React.createElement(E.Tacha, {
        T: T,
        x: x + (it.tam || tam) * 0.36,
        y: yi - (it.tam || tam) * 0.36,
        c: it.tacha,
        tam: 120
      }) : null, it.check ? /*#__PURE__*/React.createElement(E.Check, {
        T: T,
        x: x + (it.tam || tam) * 0.36,
        y: yi - (it.tam || tam) * 0.36,
        c: it.check,
        tam: 120
      }) : null, conector && sig != null ? conector === '→' ? /*#__PURE__*/React.createElement(E.Flecha, {
        T: T,
        de: [xm - paso * 0.17, yi],
        a: [xm + paso * 0.17, yi],
        c: sig,
        grosor: 16,
        curva: props.curva || 0
      }) : /*#__PURE__*/React.createElement(E.Signo, {
        T: T,
        x: xm,
        y: yi,
        c: sig,
        t: conector,
        tam: conector === 'vs' ? 0.7 : 0.9,
        color: conector === '≠' || conector === 'vs' ? 'rojo' : conector === '=' ? 'amarillo' : 'negro'
      }) : null);
    }), props.abajo ? /*#__PURE__*/React.createElement(E.Caja, {
      T: T,
      x: 960,
      y: props.abajo.y || 950,
      c: props.abajo.c,
      tam: props.abajo.tam || 0.8,
      fondo: props.abajo.fondo,
      color: props.abajo.color
    }, props.abajo.txt) : null, props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Palabra ---------------- */

  // texto con \n para cortar lineas; marcadas en color de acento; tiempos los pone LARGOS al registrar
  function Palabra(props) {
    var T = props.T,
      f = reloj(props);
    var fondo = props.fondo || 'papel';
    var base = fondo === 'negro' ? 'blanco' : 'negro';
    var acento = props.acento || (fondo === 'amarillo' ? 'blanco' : 'amarillo');
    var marcadas = (props.marcadas || []).map(function (p) {
      return String(p).toLowerCase();
    });
    var lineas = String(props.texto).split('\n');
    var fs = 150 * (props.tam || 1);
    var k = 0;
    var total = String(props.texto).split(/\s+/).filter(Boolean).length;
    var limpio = function (p) {
      return p.toLowerCase().replace(/[^a-záéíóúñü0-9]/g, '');
    };
    var y = props.y || 540;
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: fondo
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: fs * 0.04
      }
    }, lineas.map(function (ln, li) {
      return /*#__PURE__*/React.createElement("div", {
        key: li,
        style: {
          display: 'flex',
          gap: fs * 0.24,
          justifyContent: 'center'
        }
      }, ln.split(' ').filter(Boolean).map(function (p, pi) {
        var i = k++;
        var c = props.tiempos && props.tiempos[i] != null ? props.tiempos[i] : f(0.05 + 0.55 * i / Math.max(1, total));
        var e = E.golpe(T, c, 0.28);
        var marcada = marcadas.indexOf(limpio(p)) >= 0;
        var color = marcada ? acento : base;
        var est = E.estiloTitulo(fs, color, fondo === 'negro' ? false : undefined);
        return /*#__PURE__*/React.createElement("span", {
          key: pi,
          style: Object.assign(est, {
            display: 'inline-block',
            opacity: e.opacity,
            transform: 'scale(' + e.scale.toFixed(4) + ') rotate(' + (e.giro * -7).toFixed(2) + 'deg)'
          })
        }, p.toUpperCase());
      }));
    })), (props.stickers || []).map(function (s, i) {
      var c = s.c != null ? s.c : f(0.1 + 0.3 * i);
      return /*#__PURE__*/React.createElement(E.St, {
        key: i,
        T: T,
        n: s.n,
        x: s.x,
        y: s.y,
        tam: s.tam || 240,
        c: i === 0 ? ancla(c, props.at, 0.15) : c,
        rot: s.rot,
        s: s.s
      });
    }), props.rotulo ? /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: props.rotulo.x || 960,
      y: props.rotulo.y || 900,
      c: props.rotulo.c || f(0.5),
      dir: props.rotulo.dir || 'ninguna'
    }, props.rotulo.txt) : null, props.tachar ? /*#__PURE__*/React.createElement(E.Tachon, {
      T: T,
      x: props.tachar.x || 960,
      y: props.tachar.y || y,
      w: props.tachar.w || 900,
      c: props.tachar.c
    }) : null, props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Vs ---------------- */

  function Lado(props) {
    var T = props.T,
      d = props.d,
      x = props.x;
    var color = d.color || (props.izq ? 'rojo' : 'verde');
    var hex = color === 'rojo' ? RED : color === 'verde' ? GRN : color === 'amarillo' ? YEL : INK;
    var e = E.golpe(T, d.c, 0.4);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(E.Centro, {
      x: x,
      y: 150,
      e: e,
      rot: props.izq ? -2 : 2,
      dy: M.life(T, 3.4, 3, props.izq ? 0 : 0.5)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: hex,
        color: color === 'amarillo' ? INK : '#fff',
        border: '9px solid ' + INK,
        borderRadius: 26,
        boxShadow: '0 9px 0 ' + INK,
        padding: '6px 34px 12px',
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 900,
        fontStyle: 'italic',
        fontSize: 84,
        whiteSpace: 'nowrap',
        lineHeight: 1
      }
    }, d.titulo)), (d.stickers || [{
      n: d.n
    }]).map(function (s, i, arr) {
      var xs = arr.length === 1 ? x : x + (i - (arr.length - 1) / 2) * 250;
      return s.n ? /*#__PURE__*/React.createElement(E.St, {
        key: i,
        T: T,
        n: s.n,
        x: s.x || xs,
        y: s.y || 500,
        tam: s.tam || (arr.length === 1 ? 360 : 230),
        c: s.c != null ? s.c : d.c + 0.15 + 0.2 * i,
        rot: s.rot
      }) : null;
    }), d.txt ? /*#__PURE__*/React.createElement(E.Tx, {
      T: T,
      x: x,
      y: d.yTxt || 840,
      c: d.cTxt || d.c + 0.3,
      tam: d.tamTxt || 0.75,
      ancho: 820
    }, d.txt) : null, d.tacha ? /*#__PURE__*/React.createElement(E.Tacha, {
      T: T,
      x: x + 200,
      y: 330,
      c: d.tacha,
      tam: 130
    }) : null, d.check ? /*#__PURE__*/React.createElement(E.Check, {
      T: T,
      x: x + 200,
      y: 330,
      c: d.check,
      tam: 130
    }) : null);
  }
  function Vs(props) {
    var T = props.T,
      f = reloj(props);
    var izq = Object.assign({
        c: f(0.03)
      }, props.izq),
      der = Object.assign({
        c: f(0.4)
      }, props.der);
    izq.c = ancla(izq.c, props.at, 0.15);
    var linea = M.draw(T, Math.min(izq.c, der.c), 0.4);
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 955,
        top: 60,
        width: 10,
        height: (960 * linea).toFixed(0) + 'px',
        background: INK,
        borderRadius: 5
      }
    }), /*#__PURE__*/React.createElement(Lado, {
      T: T,
      d: izq,
      x: 480,
      izq: true
    }), /*#__PURE__*/React.createElement(Lado, {
      T: T,
      d: der,
      x: 1440
    }), props.vs !== false ? /*#__PURE__*/React.createElement(E.Centro, {
      x: 960,
      y: 540,
      e: E.golpe(T, der.c - 0.1, 0.35),
      rot: -6
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 130,
        height: 130,
        borderRadius: 99,
        background: YEL,
        border: '10px solid ' + INK,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 54,
        color: INK
      }
    }, "VS")) : null, props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Alrededor ---------------- */

  function Alrededor(props) {
    var T = props.T,
      f = reloj(props);
    var items = props.items || [];
    var cx = props.cx || 960,
      cy = props.cy || 560,
      rx = props.rx || 640,
      ry = props.ry || 330;
    var cc = ancla(props.centro && props.centro.c != null ? props.centro.c : f(0.02), props.at, 0.15);
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo
    }, props.titulo ? /*#__PURE__*/React.createElement(E.Resalta, {
      T: T,
      x: 960,
      y: 110,
      c: props.cTitulo || f(0.01),
      tam: 0.85
    }, props.titulo) : null, items.map(function (it, i) {
      var a = (props.desde == null ? -Math.PI : props.desde) + Math.PI * 2 * i / items.length;
      var x = cx + rx * Math.cos(a),
        y = cy + ry * Math.sin(a);
      var c = it.c != null ? it.c : f(0.08 + 0.7 * i / items.length);
      var p = M.draw(T, c, 0.35);
      return /*#__PURE__*/React.createElement(React.Fragment, {
        key: i
      }, p > 0 ? /*#__PURE__*/React.createElement("svg", {
        width: "1920",
        height: "1080",
        style: {
          position: 'absolute',
          left: 0,
          top: 0
        }
      }, /*#__PURE__*/React.createElement("line", {
        x1: cx,
        y1: cy,
        x2: cx + (x - cx) * p,
        y2: cy + (y - cy) * p,
        stroke: GRY,
        strokeWidth: 10,
        strokeLinecap: "round",
        strokeDasharray: "4 22"
      })) : null, /*#__PURE__*/React.createElement(E.St, {
        T: T,
        n: it.n,
        x: x,
        y: y - 20,
        tam: it.tam || 190,
        c: c
      }), it.txt ? /*#__PURE__*/React.createElement(E.Rot, {
        T: T,
        x: x,
        y: y + 110,
        c: c + 0.08,
        tam: 0.75,
        dir: "ninguna"
      }, it.txt) : null);
    }), props.centro ? /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: props.centro.n,
      x: cx,
      y: cy,
      tam: props.centro.tam || 300,
      c: cc
    }) : null, props.centro && props.centro.txt ? /*#__PURE__*/React.createElement(E.Caja, {
      T: T,
      x: cx,
      y: cy + 210,
      c: cc + 0.15,
      tam: 0.62
    }, props.centro.txt) : null, props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Lista de pendientes ---------------- */

  function Lista(props) {
    var T = props.T,
      f = reloj(props);
    var items = props.items || [];
    var x = props.x || 760,
      w = props.w || 1000;
    var alto = 116;
    var h = 150 + items.length * alto;
    var y0 = 540 - h / 2;
    var ct = ancla(props.c != null ? props.c : f(0.02), props.at, 0.1);
    var e = E.golpe(T, ct, 0.4);
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo
    }, /*#__PURE__*/React.createElement(E.Centro, {
      x: x,
      y: 540,
      e: e,
      rot: -1.5,
      dy: M.life(T, 4, 3)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        height: h,
        background: '#fff',
        border: '10px solid ' + INK,
        borderRadius: 34,
        boxShadow: '0 12px 0 ' + INK,
        position: 'relative',
        padding: '26px 46px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Barlow Condensed', sans-serif",
        fontWeight: 900,
        fontStyle: 'italic',
        fontSize: 70,
        color: INK,
        lineHeight: 1,
        marginBottom: 18
      }
    }, props.titulo || 'HOY'), items.map(function (it, i) {
      var ci = it.c != null ? it.c : f(0.1 + 0.6 * i / items.length);
      var ei = E.golpe(T, ci, 0.3);
      var hecho = it.check != null && T >= it.check;
      var ph = it.check != null ? M.draw(T, it.check, 0.3) : 0;
      if (it.check != null) L.sonido('ding', it.check, 0.6);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          height: alto,
          opacity: ei.opacity,
          transform: 'scale(' + ei.scale.toFixed(3) + ')',
          transformOrigin: '0 50%'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 70,
          height: 70,
          flex: 'none',
          border: '9px solid ' + INK,
          borderRadius: 16,
          background: hecho ? GRN : '#fff',
          position: 'relative'
        }
      }, ph > 0 ? /*#__PURE__*/React.createElement("svg", {
        width: "70",
        height: "70",
        viewBox: "0 0 70 70",
        style: {
          position: 'absolute',
          left: -9,
          top: -9
        }
      }, /*#__PURE__*/React.createElement("path", {
        d: "M 16 36 L 30 50 L 56 20",
        fill: "none",
        stroke: "#fff",
        strokeWidth: "10",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeDasharray: "60",
        strokeDashoffset: 60 * (1 - ph)
      })) : null), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 64,
          color: hecho ? '#8C867C' : INK,
          whiteSpace: 'nowrap',
          lineHeight: 1
        }
      }, it.txt, ph > 0 ? /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: -6,
          top: '52%',
          height: 9,
          borderRadius: 5,
          background: INK,
          width: 'calc(' + (100 * ph).toFixed(1) + '% + 12px)'
        }
      }) : null), it.n ? /*#__PURE__*/React.createElement("div", {
        style: {
          marginLeft: 'auto'
        }
      }, /*#__PURE__*/React.createElement(L.Sticker, {
        n: it.n,
        tam: 92
      })) : null);
    }))), props.stickers ? props.stickers.map(function (s, i) {
      return /*#__PURE__*/React.createElement(E.St, {
        key: i,
        T: T,
        n: s.n,
        x: s.x,
        y: s.y,
        tam: s.tam || 230,
        c: s.c != null ? s.c : f(0.2),
        rot: s.rot
      });
    }) : null, props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Balanza ---------------- */

  function Balanza(props) {
    var T = props.T,
      f = reloj(props);
    var ci = props.izq && props.izq.c != null ? props.izq.c : f(0.1);
    var cd = props.der && props.der.c != null ? props.der.c : f(0.35);
    if (ci <= cd) ci = ancla(ci, props.at, 0.3);else cd = ancla(cd, props.at, 0.3);
    var cg = props.cGira != null ? props.cGira : f(0.6);
    var hacia = props.hacia === 'der' ? 1 : -1;
    var ang = hacia * 14 * Easing.easeOutElastic(clamp((T - cg) / 0.9, 0, 1)) + M.life(T, 3, 0.8);
    var e = E.golpe(T, f(0.01), 0.4);
    var cx = 960,
      cy = 430,
      brazo = 560;
    var rad = ang * Math.PI / 180;
    var pi = [cx - brazo * Math.cos(rad), cy - brazo * Math.sin(rad)];
    var pd = [cx + brazo * Math.cos(rad), cy + brazo * Math.sin(rad)];
    var plato = function (p, key) {
      return /*#__PURE__*/React.createElement("g", {
        key: key
      }, /*#__PURE__*/React.createElement("line", {
        x1: p[0],
        y1: p[1],
        x2: p[0] - 120,
        y2: p[1] + 200,
        stroke: INK,
        strokeWidth: 8
      }), /*#__PURE__*/React.createElement("line", {
        x1: p[0],
        y1: p[1],
        x2: p[0] + 120,
        y2: p[1] + 200,
        stroke: INK,
        strokeWidth: 8
      }), /*#__PURE__*/React.createElement("path", {
        d: 'M ' + (p[0] - 170) + ' ' + (p[1] + 200) + ' Q ' + p[0] + ' ' + (p[1] + 290) + ' ' + (p[0] + 170) + ' ' + (p[1] + 200) + ' Z',
        fill: YEL,
        stroke: INK,
        strokeWidth: 11,
        strokeLinejoin: "round"
      }));
    };
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo
    }, props.titulo ? /*#__PURE__*/React.createElement(E.Resalta, {
      T: T,
      x: 960,
      y: 110,
      c: f(0.01),
      tam: 0.85
    }, props.titulo) : null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        opacity: e.opacity
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "1920",
      height: "1080",
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: 'M ' + cx + ' ' + (cy + 10) + ' L ' + cx + ' 960',
      stroke: INK,
      strokeWidth: 22,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: 'M ' + (cx - 160) + ' 975 L ' + (cx + 160) + ' 975',
      stroke: INK,
      strokeWidth: 26,
      strokeLinecap: "round"
    }), plato(pi, 'i'), plato(pd, 'd'), /*#__PURE__*/React.createElement("line", {
      x1: pi[0],
      y1: pi[1],
      x2: pd[0],
      y2: pd[1],
      stroke: INK,
      strokeWidth: 22,
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: cx,
      cy: cy,
      r: 30,
      fill: YEL,
      stroke: INK,
      strokeWidth: 10
    }))), props.izq ? /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: props.izq.n,
      x: pi[0],
      y: pi[1] + 130,
      tam: props.izq.tam || 220,
      c: ci,
      quieto: true
    }) : null, props.der ? /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: props.der.n,
      x: pd[0],
      y: pd[1] + 130,
      tam: props.der.tam || 220,
      c: cd,
      quieto: true
    }) : null, props.izq && props.izq.txt ? /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: pi[0],
      y: pi[1] + 340,
      c: ci + 0.1,
      tam: 0.85,
      dir: "ninguna"
    }, props.izq.txt) : null, props.der && props.der.txt ? /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: pd[0],
      y: pd[1] + 340,
      c: cd + 0.1,
      tam: 0.85,
      dir: "ninguna"
    }, props.der.txt) : null, props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Camino ---------------- */

  function Camino(props) {
    var T = props.T,
      f = reloj(props);
    var cp = props.cPersona != null ? props.cPersona : f(0.02);
    var cf = ancla(props.facil && props.facil.c != null ? props.facil.c : f(0.2), props.at, 0.35);
    var cd = ancla(props.dificil && props.dificil.c != null ? props.dificil.c : f(0.45), props.at, 0.7);
    var pf = M.draw(T, cf, 0.6),
      pd = M.draw(T, cd, 0.6);
    var base = [960, 900];
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo
    }, /*#__PURE__*/React.createElement("svg", {
      width: "1920",
      height: "1080",
      style: {
        position: 'absolute',
        left: 0,
        top: 0
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M 930 905 C 720 885, 540 905, 380 940",
      fill: "none",
      stroke: GRY,
      strokeWidth: 70,
      strokeLinecap: "round",
      strokeDasharray: "1000",
      strokeDashoffset: 1000 * (1 - pf)
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 1020 880 C 1200 760, 1350 520, 1520 300",
      fill: "none",
      stroke: YEL,
      strokeWidth: 70,
      strokeLinecap: "round",
      strokeDasharray: "1000",
      strokeDashoffset: 1000 * (1 - pd)
    }), /*#__PURE__*/React.createElement("path", {
      d: "M 1020 880 C 1200 760, 1350 520, 1520 300",
      fill: "none",
      stroke: INK,
      strokeWidth: 8,
      strokeLinecap: "round",
      strokeDasharray: "30 30",
      opacity: pd > 0.98 ? 1 : 0
    })), /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: props.persona || 'person-standing',
      x: base[0],
      y: base[1] - 150,
      tam: 250,
      c: cp
    }), props.facil ? /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: props.facil.n || 'couch-and-lamp',
      x: 330,
      y: 830,
      tam: 260,
      c: cf + 0.35
    }) : null, props.facil ? /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 330,
      y: 1000,
      c: cf + 0.45,
      dir: "ninguna",
      fondo: "#8C867C"
    }, props.facil.txt || 'Camino fácil') : null, props.dificil ? /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: props.dificil.n || 'trophy',
      x: 1560,
      y: 230,
      tam: 260,
      c: cd + 0.4
    }) : null, props.dificil ? /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 1560,
      y: 420,
      c: cd + 0.5,
      dir: "ninguna"
    }, props.dificil.txt || 'Camino difícil') : null, props.facil && props.facil.tacha ? /*#__PURE__*/React.createElement(E.Tacha, {
      T: T,
      x: 470,
      y: 700,
      c: props.facil.tacha,
      tam: 130
    }) : null, props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Grafico ---------------- */

  function Grafico(props) {
    var T = props.T,
      f = reloj(props);
    var x0 = props.x0 || 330,
      y0 = props.y0 || 900,
      w = props.w || 1260,
      h = props.h || 640;
    var ce = ancla(props.c != null ? props.c : f(0.02), props.at, 0.1);
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo
    }, props.titulo ? /*#__PURE__*/React.createElement(E.Resalta, {
      T: T,
      x: 960,
      y: 100,
      c: ce,
      tam: 0.8
    }, props.titulo) : null, /*#__PURE__*/React.createElement(E.Grafico, {
      T: T,
      x: x0,
      y: y0,
      w: w,
      h: h,
      c: ce,
      curvas: props.curvas
    }), props.ejeX ? /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: x0 + w - 90,
      y: y0 + 60,
      c: ce + 0.2,
      tam: 0.75,
      dir: "der"
    }, props.ejeX) : null, props.ejeY ? /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: x0 + 10,
      y: y0 - h - 50,
      c: ce + 0.2,
      tam: 0.75,
      dir: "ninguna"
    }, props.ejeY) : null, (props.rotulos || []).map(function (r, i) {
      return /*#__PURE__*/React.createElement(E.Rot, {
        key: i,
        T: T,
        x: x0 + r.x * w,
        y: y0 - r.y * h,
        c: r.c,
        tam: r.tam || 0.85,
        dir: r.dir || 'ninguna',
        fondo: r.fondo
      }, r.txt);
    }), (props.stickers || []).map(function (s, i) {
      return /*#__PURE__*/React.createElement(E.St, {
        key: i,
        T: T,
        n: s.n,
        x: s.x != null ? s.x : x0 + s.px * w,
        y: s.y != null ? s.y : y0 - s.py * h,
        tam: s.tam || 170,
        c: s.c,
        rot: s.rot
      });
    }), props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Numero ---------------- */

  function Numero(props) {
    var T = props.T,
      f = reloj(props);
    var c = ancla(props.c != null ? props.c : f(0.05), props.at, 0.2);
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo
    }, /*#__PURE__*/React.createElement(E.Num, {
      T: T,
      x: props.x || 960,
      y: props.y || 470,
      c: c,
      dur: props.durCuenta || 1,
      desde: props.desde || 0,
      hasta: props.hasta,
      tam: props.tam || 2,
      color: props.color || 'amarillo',
      sufijo: props.sufijo,
      prefijo: props.prefijo
    }), props.txt ? /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: props.x || 960,
      y: (props.y || 470) + 230,
      c: c + 0.3,
      tam: 1.2,
      dir: "ninguna"
    }, props.txt) : null, (props.stickers || []).map(function (s, i) {
      return /*#__PURE__*/React.createElement(E.St, {
        key: i,
        T: T,
        n: s.n,
        x: s.x,
        y: s.y,
        tam: s.tam || 220,
        c: s.c != null ? s.c : c + 0.2,
        rot: s.rot
      });
    }), props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Multitud ---------------- */

  // una cuadricula de personas grises; las destacadas se pintan y llevan aro amarillo
  function Multitud(props) {
    var T = props.T,
      f = reloj(props);
    var filas = props.filas || 3,
      cols = props.cols || 8;
    var tam = props.tam || 150;
    var dx = props.dx || 190,
      dy = props.dy || 200;
    var x0 = 960 - (cols - 1) * dx / 2,
      y0 = (props.y || 560) - (filas - 1) * dy / 2;
    var dest = props.destacados || [];
    var c0 = ancla(props.c != null ? props.c : f(0.02), props.at, 0.05);
    var cosas = [];
    for (var r = 0; r < filas; r++) {
      for (var k = 0; k < cols; k++) {
        var i = r * cols + k;
        var d = null;
        dest.forEach(function (q) {
          if (q.i === i) d = q;
        });
        var x = x0 + k * dx,
          y = y0 + r * dy;
        var c = c0 + 0.025 * i;
        var e = E.golpe(T, c, 0.3);
        var on = d && T >= d.c;
        var aro = d ? M.draw(T, d.c, 0.35) : 0;
        cosas.push(/*#__PURE__*/React.createElement(E.Centro, {
          key: i,
          x: x,
          y: y,
          e: e,
          dy: M.life(T, 2.6, 4, i * 0.13)
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            position: 'relative',
            filter: on ? undefined : 'grayscale(1) opacity(0.45)'
          }
        }, /*#__PURE__*/React.createElement(L.Sticker, {
          n: d && d.n || props.n || 'person-standing',
          tam: on ? tam * 1.25 : tam,
          borde: on
        }), aro > 0 ? /*#__PURE__*/React.createElement("svg", {
          width: tam * 1.9,
          height: tam * 1.9,
          style: {
            position: 'absolute',
            left: (on ? tam * 1.25 : tam) / 2 - tam * 0.95,
            top: (on ? tam * 1.25 : tam) / 2 - tam * 0.95,
            overflow: 'visible'
          }
        }, /*#__PURE__*/React.createElement("circle", {
          cx: tam * 0.95,
          cy: tam * 0.95,
          r: tam * 0.85,
          fill: "none",
          stroke: YEL,
          strokeWidth: 16,
          strokeDasharray: Math.PI * 2 * tam * 0.85,
          strokeDashoffset: Math.PI * 2 * tam * 0.85 * (1 - aro),
          strokeLinecap: "round",
          transform: 'rotate(-90 ' + tam * 0.95 + ' ' + tam * 0.95 + ')'
        })) : null)));
        if (d) L.sonido('ding', d.c, 0.7);
      }
    }
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo
    }, props.titulo ? /*#__PURE__*/React.createElement(E.Resalta, {
      T: T,
      x: 960,
      y: 110,
      c: props.cTitulo || c0,
      tam: 0.85
    }, props.titulo) : null, cosas, (props.rotulos || []).map(function (r, i) {
      return /*#__PURE__*/React.createElement(E.Rot, {
        key: i,
        T: T,
        x: r.x,
        y: r.y,
        c: r.c,
        tam: r.tam || 0.9,
        dir: r.dir || 'ninguna',
        fondo: r.fondo
      }, r.txt);
    }), (props.stickers || []).map(function (s, i) {
      return /*#__PURE__*/React.createElement(E.St, {
        key: i,
        T: T,
        n: s.n,
        x: s.x,
        y: s.y,
        tam: s.tam || 230,
        c: s.c,
        rot: s.rot
      });
    }), props.abajo ? /*#__PURE__*/React.createElement(E.Caja, {
      T: T,
      x: 960,
      y: props.abajo.y || 960,
      c: props.abajo.c,
      tam: props.abajo.tam || 0.8,
      fondo: props.abajo.fondo,
      color: props.abajo.color
    }, props.abajo.txt) : null, props.extra ? props.extra(T, f) : null);
  }

  /* ---------------- Paso ---------------- */

  // tarjeta de recomendacion numerada (fondo amarillo): numero en circulo negro + titulo
  function Paso(props) {
    var T = props.T,
      f = reloj(props);
    var c = ancla(props.c != null ? props.c : f(0.03), props.at, 0.15);
    L.sonido('golpe', c, 0.8);
    var e = E.golpe(T, c, 0.4);
    return /*#__PURE__*/React.createElement(E.Papel, {
      fondo: props.fondo || 'amarillo'
    }, /*#__PURE__*/React.createElement(E.Centro, {
      x: props.sub ? 420 : 520,
      y: props.sub ? 460 : 540,
      e: e,
      rot: -6,
      dy: M.life(T, 3, 5)
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 300,
        height: 300,
        borderRadius: 999,
        background: INK,
        color: YEL,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Archivo Black', sans-serif",
        fontSize: 210,
        lineHeight: 1,
        border: '12px solid #fff',
        boxShadow: '0 14px 0 ' + INK
      }
    }, props.n)), /*#__PURE__*/React.createElement(E.Tx, {
      T: T,
      x: props.sub ? 680 : 760,
      y: props.sub ? 460 : 540,
      c: props.cTitulo || c + 0.15,
      tam: props.tamTitulo || Math.min(1.35, 1060 / (String(props.titulo).length * 0.45 * 96)),
      ancla: "izq",
      alinear: "left"
    }, props.titulo), props.sub ? /*#__PURE__*/React.createElement(E.Rot, {
      T: T,
      x: 960,
      y: 760,
      c: props.sub.c,
      tam: 1.2,
      dir: "ninguna"
    }, props.sub.txt) : null, props.ico ? /*#__PURE__*/React.createElement(E.St, {
      T: T,
      n: props.ico,
      x: props.icoX || 1650,
      y: props.icoY || 830,
      tam: 300,
      c: props.cIco || c + 0.3,
      rot: 10
    }) : null, props.extra ? props.extra(T, f) : null);
  }
  L.X = {
    Fila: Fila,
    Palabra: Palabra,
    Vs: Vs,
    Alrededor: Alrededor,
    Lista: Lista,
    Balanza: Balanza,
    Camino: Camino,
    Grafico: Grafico,
    Numero: Numero,
    Etiqueta: Etiqueta,
    Multitud: Multitud,
    Paso: Paso
  };
})(window);
