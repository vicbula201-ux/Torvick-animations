/* GENERADO por compilar.js desde escena3d.jsx — no editar a mano. */
/* ============================================================
   ESCENAS CON TOR EN 3D (window.E3): el armador comun de los reels 3D.
   E3.escena({...}) arma una escena del reel con TOR3D: camara que gira con
   deriva de camara en mano, el golpe de las X, la figura que entra con pop,
   y encima los rotulos nuevos (E3.Rot), las X, los vistos, flechas y efectos.

     E3.escena({
       tomas: [[0, { az, el, dist, y }], [1, {...}]],   // camara (fracciones)
       vista: function (T, f, t) { return { figuras | pose, musc, cara, pesas, objetos, fantasmas, vibra }; },
       lienzo: function (T, f, t, pr, info) { return <g>...</g>; },   // SVG sobre la figura
       encima: function (T, f, t, pr, info) { ... },                   // fuera del SVG (B.Cuenta)
       mal: [{ x, y, cuando, hasta }], bien: [...],
       r1: { text: 'REMA AL *ABDOMEN*', cuando, tono }, r2: {...}
     })
   pr(que, i) proyecta un punto (articulacion, 'm:pecho', [x,y,z]) de la figura i.

   E3.Rot: rotulo negro con punta, texto en Barlow 800, sombra dura de color
   (amarillo; 'rojo' para el error, 'verde' para la correccion) y la palabra
   entre asteriscos en amarillo. Entra abriendose de izquierda a derecha.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M,
    V = global.V,
    B = global.B,
    TOR3D = global.TOR3D;
  var Easing = global.Easing,
    clamp = global.clamp;
  var A = global.REELS.ayudas;
  var C = global.P.C;
  var TONO = {
    amarillo: C.YEL,
    rojo: C.RED,
    verde: C.GRN,
    gris: C.GRY
  };

  /* ---------------- rotulo pulido ---------------- */
  var CTX = null;
  function medir(txt, px) {
    if (!CTX) CTX = document.createElement('canvas').getContext('2d');
    CTX.font = '800 ' + px + 'px "Barlow Semi Condensed", sans-serif';
    return CTX.measureText(txt).width;
  }
  function trozos(text) {
    return String(text).toUpperCase().split('*').map(function (t, i) {
      return {
        t: t,
        clave: i % 2 === 1
      };
    }).filter(function (q) {
      return q.t;
    });
  }
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = h * 31 + s.charCodeAt(i) | 0;
    return Math.abs(h).toString(36);
  }
  function Rot(props) {
    var T = props.T,
      s = props.s || 1,
      px = 62 * s,
      esp = 1.2 * s;
    var H = 94 * s,
      pad = 32 * s,
      punta = 38 * s,
      sh = 10 * s,
      r = 14 * s;
    var tz = trozos(props.text);
    var tw = 0;
    tz.forEach(function (q) {
      q.w = medir(q.t, px) + esp * q.t.length;
      tw += q.w;
    });
    var W = tw + pad * 2 + punta;
    var x = props.x == null ? (1080 - W) / 2 : props.x;
    var u = T - props.cuando;
    if (u < 0) return null;
    var kF = Easing.easeOutExpo(clamp(u / 0.45, 0, 1));
    var kT = Easing.easeOutCubic(clamp((u - 0.12) / 0.34, 0, 1));
    var kS = Easing.easeOutBack(clamp((u - 0.18) / 0.42, 0, 1));
    var w = Math.max(r * 2, (W - punta) * kF),
      pk = punta * kF;
    var forma = function (dx, dy) {
      return 'M ' + (dx + r) + ' ' + dy + ' L ' + (dx + w) + ' ' + dy + ' L ' + (dx + w + pk) + ' ' + (dy + H / 2) + ' L ' + (dx + w) + ' ' + (dy + H) + ' L ' + (dx + r) + ' ' + (dy + H) + ' Q ' + dx + ' ' + (dy + H) + ' ' + dx + ' ' + (dy + H - r) + ' L ' + dx + ' ' + (dy + r) + ' Q ' + dx + ' ' + dy + ' ' + (dx + r) + ' ' + dy + ' Z';
    };
    var id = 'r3' + hash(props.text + '|' + props.y);
    var dy = M.life(T, 3.4, 5, props.fase || 0);
    var acento = TONO[props.tono] || C.YEL;
    var xs = pad;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: x,
        top: props.y,
        transform: 'translateY(' + dy.toFixed(1) + 'px)'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: W + sh + 4,
      height: H + sh + 4,
      style: {
        display: 'block',
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("clipPath", {
      id: id
    }, /*#__PURE__*/React.createElement("path", {
      d: forma(0, 0)
    }))), /*#__PURE__*/React.createElement("path", {
      d: forma(sh * kS, sh * kS),
      fill: acento,
      opacity: clamp(kS * 1.4, 0, 1)
    }), /*#__PURE__*/React.createElement("path", {
      d: forma(0, 0),
      fill: C.INK
    }), /*#__PURE__*/React.createElement("g", {
      clipPath: 'url(#' + id + ')'
    }, /*#__PURE__*/React.createElement("text", {
      y: H / 2 + px * 0.36 + (1 - kT) * 40,
      fontFamily: "'Barlow Semi Condensed', sans-serif",
      fontWeight: 800,
      fontSize: px,
      letterSpacing: esp,
      opacity: kT
    }, tz.map(function (q, i) {
      var el = /*#__PURE__*/React.createElement("tspan", {
        key: i,
        x: xs,
        fill: q.clave ? C.YEL : '#ffffff'
      }, q.t);
      xs += q.w;
      return el;
    })))));
  }

  /* ---------------- ayudas ---------------- */
  // repeticion: va rapido, aguanta y vuelve lento
  function rep(T, a, b, n, va, aguanta) {
    return V.ida(V.fase(T, a, b, n), va == null ? 0.36 : va, aguanta == null ? 0.14 : aguanta);
  }
  // la camara: tomas + deriva de camara en mano
  function camara(tomas, t, T, acerca) {
    var c = Object.assign({}, TOR3D.tomaEn(tomas, t));
    c.az = (c.az || 0) + Math.sin(T * 0.7) * 1.4;
    c.el = (c.el || 0) + Math.sin(T * 0.9 + 1) * 0.7;
    c.dist = (c.dist || 7) * (acerca || 1) * (1 + Math.sin(T * 0.5 + 2) * 0.008);
    return c;
  }
  // flecha en el lienzo entre dos puntos de pantalla, dibujada de a poco
  function Flecha(props) {
    var a = props.a,
      b = props.b,
      p = clamp(props.p, 0, 1);
    if (p < 0.01) return null;
    var x = a[0] + (b[0] - a[0]) * p,
      y = a[1] + (b[1] - a[1]) * p;
    var ang = Math.atan2(y - a[1], x - a[0]),
      L = 34;
    var punta = 'M ' + (x - L * Math.cos(ang - 0.5)).toFixed(1) + ' ' + (y - L * Math.sin(ang - 0.5)).toFixed(1) + ' L ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' L ' + (x - L * Math.cos(ang + 0.5)).toFixed(1) + ' ' + (y - L * Math.sin(ang + 0.5)).toFixed(1);
    var col = props.color || C.GRN;
    var linea = props.curva ? 'M ' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' Q ' + props.curva[0] + ' ' + props.curva[1] + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) : 'M ' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L ' + x.toFixed(1) + ' ' + y.toFixed(1);
    return /*#__PURE__*/React.createElement("g", {
      fill: "none",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      opacity: props.opacity
    }, /*#__PURE__*/React.createElement("path", {
      d: linea,
      stroke: C.INK,
      strokeWidth: 26
    }), /*#__PURE__*/React.createElement("path", {
      d: punta,
      stroke: C.INK,
      strokeWidth: 26
    }), /*#__PURE__*/React.createElement("path", {
      d: linea,
      stroke: col,
      strokeWidth: 13
    }), /*#__PURE__*/React.createElement("path", {
      d: punta,
      stroke: col,
      strokeWidth: 13
    }));
  }
  // guia punteada entre dos puntos (la espalda recta, la trayectoria)
  function Guia(props) {
    var a = props.a,
      b = props.b,
      p = clamp(props.p == null ? 1 : props.p, 0, 1);
    if (p < 0.01) return null;
    return /*#__PURE__*/React.createElement("path", {
      d: 'M ' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L ' + (a[0] + (b[0] - a[0]) * p).toFixed(1) + ' ' + (a[1] + (b[1] - a[1]) * p).toFixed(1),
      stroke: props.color || C.YEL,
      strokeWidth: props.w || 16,
      strokeDasharray: "34 22",
      strokeLinecap: "round",
      fill: "none",
      opacity: Math.min(1, p * 2)
    });
  }
  // el musculo que trabaja: resplandor (y destellos) sobre los puntos dados
  function brilla(T, pr, puntos, v, destellos, r) {
    if (v < 0.02) return null;
    var cs = puntos.map(function (q) {
      return pr(q);
    });
    var m = [0, 0];
    cs.forEach(function (c) {
      m[0] += c[0] / cs.length;
      m[1] += c[1] / cs.length;
    });
    return /*#__PURE__*/React.createElement("g", null, cs.map(function (c, i) {
      return /*#__PURE__*/React.createElement(V.Halo, {
        key: i,
        T: T,
        c: c,
        r: r || 80,
        v: v,
        opacidad: 0.5
      });
    }), destellos ? /*#__PURE__*/React.createElement(V.Destellos, {
      T: T,
      c: m,
      r: (r || 80) * 2.1,
      v: v,
      n: 6
    }) : null);
  }
  function contador(T, a, b, n, x, y) {
    var u = clamp((T - a) / (b - a), 0, 1) * n,
      hechas = Math.min(n, Math.floor(u + 0.62));
    var e = M.pop(T, a - 0.1, 0.4);
    return /*#__PURE__*/React.createElement(A.Pos, {
      x: x == null ? 60 : x,
      y: y == null ? 1080 : y,
      e: e,
      dy: M.life(T, 3, 4)
    }, /*#__PURE__*/React.createElement(B.Cuenta, {
      n: hechas,
      p: u / n,
      s: 0.62
    }));
  }
  function suma(a, b, k) {
    return a.clone().add(b.clone().multiplyScalar(k));
  }
  function lerp3(a, b, k) {
    return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  }
  function medio(a, b) {
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  }
  function arr(p) {
    return [p.x, p.y, p.z];
  }

  /* ---------------- piezas 2D encima (iconos de los videos con Tor, como en PL) ---------------- */
  function valor(v, T, f) {
    return typeof v === 'function' ? v(T, f) : v;
  }
  function Pieza(props) {
    var o = props.o,
      T = props.T,
      f = props.f,
      at = props.at;
    var e = o.cuando == null ? M.pop(T, at - 0.6, 0.5) : M.pop(T, f(o.cuando), 0.42);
    if (o.hasta != null) e = A.junta(e, A.sale(T, f(o.hasta)));
    var Cmp = o.C;
    var p = Object.assign({
      s: o.s == null ? 1 : o.s
    }, valor(o.p, T, f) || {});
    var cuerpo = /*#__PURE__*/React.createElement(Cmp, p);
    if (o.plato) {
      var N = global.N,
        lado = 420 * o.plato;
      cuerpo = /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          width: lado,
          height: lado
        }
      }, /*#__PURE__*/React.createElement(N.Plato, {
        s: o.plato
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          left: (lado - 240 * p.s) / 2,
          top: (lado - 240 * p.s) / 2
        }
      }, cuerpo));
    }
    return /*#__PURE__*/React.createElement(A.Pos, {
      x: valor(o.x, T, f),
      y: valor(o.y, T, f),
      e: e,
      dx: o.vibra ? M.vibra(T, 30, 3) : 0,
      dy: o.quieto ? 0 : M.life(T, 3, 6, o.fase != null ? o.fase : props.i * 0.13)
    }, cuerpo);
  }

  /* ---------------- armador de escenas ---------------- */
  function escena(o) {
    return function Escena(props) {
      var T = props.T,
        at = props.at,
        dur = props.dur;
      var f = function (v) {
        return at + dur * v;
      };
      var t = clamp((T - at) / dur, 0, 1);
      var info = o.vista(T, f, t) || {};
      var figs = info.figuras || [{
        quien: info.quien || 'tor',
        pose: info.pose,
        musc: info.musc,
        cara: info.cara,
        ropa: info.ropa,
        pesas: info.pesas,
        fantasmas: info.fantasmas
      }];
      var legado = info.pose && (info.pose.bisagra != null || info.pose.remo != null);
      figs.forEach(function (fg, i) {
        if (fg.pose && fg.pose.respira == null) fg.pose.respira = Math.sin(T * 2.3 + i);
        fg.cara = Object.assign({
          parpadeo: V.parpadeo(T, i * 0.9)
        }, fg.cara || {});
        fg.T = T;
      });
      var vt = legado ? {
        pose: info.pose,
        musc: info.musc,
        cara: figs[0].cara,
        fantasmas: info.fantasmas,
        objetos: info.objetos,
        T: T
      } : {
        figuras: figs,
        objetos: info.objetos,
        T: T
      };
      vt.camara = camara(o.tomas, t, T, o.acerca);
      var pr = function (q, i) {
        return TOR3D.proyectar(vt, q, i);
      };
      var golpe = 0;
      (o.mal || []).map(function (m) {
        return m.cuando;
      }).concat(o.golpes || []).forEach(function (c) {
        var u = (T - f(c)) / 0.35;
        if (u > 0 && u < 1) golpe += (1 - u) * Math.sin(u * 40) * 10;
      });
      var e = M.pop(T, at - 0.6, 0.5);
      var rot = function (r, i) {
        if (!r) return null;
        return /*#__PURE__*/React.createElement(Rot, {
          key: 'r' + i,
          T: T,
          text: r.text,
          y: r.y != null ? r.y : i ? 1470 : 262,
          x: r.x,
          s: r.s || 1,
          fase: i * 0.4,
          tono: r.tono,
          cuando: r.cuando == null ? at - 0.6 : f(r.cuando)
        });
      };
      return /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          inset: 0
        }
      }, /*#__PURE__*/React.createElement(A.Pos, {
        x: 0,
        y: 0,
        e: e,
        origen: "50% 55%",
        dx: (info.vibra ? M.vibra(T, 30, 4) : 0) + golpe
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'relative',
          width: 1080,
          height: 1920
        }
      }, /*#__PURE__*/React.createElement(TOR3D.Lienzo, {
        vista: vt
      }))), /*#__PURE__*/React.createElement("svg", {
        width: 1080,
        height: 1920,
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          overflow: 'visible'
        }
      }, o.lienzo ? o.lienzo(T, f, t, pr, info) : null), (o.piezas || []).map(function (pz, i) {
        return /*#__PURE__*/React.createElement(Pieza, {
          key: 'p' + i,
          o: pz,
          T: T,
          f: f,
          at: at,
          i: i
        });
      }), o.encima ? o.encima(T, f, t, pr, info) : null, (o.mal || []).map(function (m, i) {
        return /*#__PURE__*/React.createElement(A.Mal, {
          key: 'm' + i,
          T: T,
          cuando: f(m.cuando),
          hasta: m.hasta == null ? null : f(m.hasta),
          x: m.x,
          y: m.y,
          s: m.s || 0.5
        });
      }), (o.bien || []).map(function (b, i) {
        return /*#__PURE__*/React.createElement(A.Bien, {
          key: 'b' + i,
          T: T,
          cuando: f(b.cuando),
          hasta: b.hasta == null ? null : f(b.hasta),
          x: b.x,
          y: b.y,
          s: b.s || 0.55,
          fase: i * 0.4
        });
      }), rot(o.r1, 0), rot(o.r2, 1));
    };
  }

  /* ---------------- poses que se repiten ---------------- */
  // de pie sacando biceps: flex 0 brazos abajo .. 1 doble biceps
  function poseFlex(flex, extra) {
    var e = clamp(flex, 0, 1);
    var p = Object.assign({
      cadera: [0, 1.0, 0],
      pieI: [-0.2, 0.115, 0.02],
      pieD: [0.2, 0.115, 0.02],
      cabeza: [4 * e, 0, 0]
    }, extra || {});
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D';
      p['mano' + L] = lerp3([s * 0.34, 0.83, 0.08], [s * 0.7, 1.95, 0.1], e);
      p['codo' + L] = lerp3([0.35, 0.2, -1], [0.5, -1, 0.05], e);
    });
    return p;
  }

  // la novia de pie con las manos en la cadera; abre 0..1 las manos un poco
  function poseNovia(extra) {
    return Object.assign({
      cadera: [0, 1.0, 0],
      tronco: [0, 0, 2],
      cabeza: [3, 0, -4],
      pieI: [-0.17, 0.115, 0.02],
      pieD: [0.11, 0.115, 0.1],
      manoI: [-0.33, 1.06, -0.02],
      manoD: [0.33, 1.06, -0.02],
      codoI: [1, -0.1, -0.4],
      codoD: [1, -0.1, -0.4]
    }, extra || {});
  }

  /* ---------------- formato top 3 ---------------- */
  function cuenta(n, x, y, cuando) {
    return function (T, f) {
      return /*#__PURE__*/React.createElement(A.Pos, {
        x: x,
        y: y,
        e: M.pop(T, cuando == null ? f(0) - 0.6 : f(cuando), 0.5),
        dy: M.life(T, 3, 5)
      }, /*#__PURE__*/React.createElement(B.Cuenta, {
        s: 0.9,
        n: n,
        p: 1
      }));
    };
  }
  // gancho: Tor (o la novia) saca biceps con el musculo encendido, "TOP 3 <MUSCULO>" y el 3
  // o: { musculo, musc, brillo: ['m:pecho:0', ...], quien, tomas, s1, figura(T, f, fl) -> figura }
  function gancho(o) {
    return escena({
      tomas: o.tomas || [[0, {
        az: 16,
        el: 6,
        dist: 4.4,
        y: 1.4
      }], [1, {
        az: 6,
        el: 4,
        dist: 6.4,
        y: 1.1
      }]],
      vista: function (T, f) {
        var fl = Easing.easeOutBack(clamp((T - f(0.04)) / (f(0.3) - f(0.04)), 0, 1));
        var fig = o.figura ? o.figura(T, f, fl) : {
          quien: o.quien || 'tor',
          pose: poseFlex(fl * (o.flex == null ? 1 : o.flex)),
          cara: {
            boca: 'sonrisa'
          }
        };
        fig.musc = Object.assign({
          brillo: 0.3
        }, o.musc);
        return {
          figuras: [fig]
        };
      },
      lienzo: function (T, f, t, pr) {
        return brilla(T, pr, o.brillo, 1, true, o.r || 95);
      },
      encima: cuenta(3, 40, 1060, 0.3),
      r1: {
        text: 'TOP 3 *' + o.musculo + '*',
        s: o.s1 || 1.1,
        cuando: 0.02
      },
      r2: {
        text: 'SEGÚN LA *CIENCIA*',
        cuando: 0.4
      }
    });
  }
  // un ejercicio: una repeticion (k 0 estirado .. 1 contraido) con brillo al estirar y chispa al contraer
  // o: { n, r1, r2, s1, s2, tomas, reps, va, brillo: [...], r, vista(T, f, k, kEn) -> { figuras, objetos } }
  function ejercicio(o) {
    var rp = function (Tx, f) {
      return V.ida(V.fase(Tx, f(0.05), f(0.95), o.reps || 1), o.va || 0.45, 0.12);
    };
    return escena({
      tomas: o.tomas,
      acerca: o.acerca,
      vista: function (T, f) {
        var k = rp(T, f);
        var r = o.vista(T, f, k, function (dt) {
          return rp(T - dt, f);
        });
        r.k = k;
        return r;
      },
      lienzo: function (T, f, t, pr, info) {
        return /*#__PURE__*/React.createElement("g", null, brilla(T, pr, o.brillo, 1 - 0.7 * info.k, false, o.r || 85), o.brillo.map(function (q, i) {
          return /*#__PURE__*/React.createElement(V.Chispa, {
            key: i,
            T: T,
            c: pr(q),
            cuando: f(0.5),
            r: o.r || 85
          });
        }), o.lienzo ? o.lienzo(T, f, t, pr, info) : null);
      },
      encima: cuenta(o.n, 40, 380),
      r1: {
        text: o.r1,
        s: o.s1 || 1.05,
        cuando: null
      },
      r2: {
        text: o.r2,
        s: o.s2 || 1,
        cuando: 0.2
      }
    });
  }
  // fantasmas de una figura: la misma pose unos instantes antes, si se mueve
  function fantasmas(poseDe, kEn, k) {
    var r = [];
    if (!kEn) return r;
    [0.04, 0.08, 0.12].forEach(function (dt) {
      var k2 = kEn(dt);
      if (Math.abs(k2 - k) > 0.04) r.push(poseDe(k2));
    });
    return r;
  }
  global.PIEZAS3D = global.PIEZAS3D || {};
  global.E3 = {
    escena: escena,
    Rot: Rot,
    rep: rep,
    camara: camara,
    Flecha: Flecha,
    Guia: Guia,
    brilla: brilla,
    contador: contador,
    suma: suma,
    arr: arr,
    lerp3: lerp3,
    medio: medio,
    poseFlex: poseFlex,
    poseNovia: poseNovia,
    cuenta: cuenta,
    gancho: gancho,
    ejercicio: ejercicio,
    fantasmas: fantasmas
  };
})(window);
