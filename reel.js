/* GENERADO por compilar.js desde reel.jsx — no editar a mano. */
/* ============================================================
   REEL — window.REELS: el armazon comun de todos los videos verticales
   Cada video (face-pull.jsx, dominadas.jsx, ...) solo define sus escenas
   y llama a REELS.registrar({ id, titulo, escenas }). Este archivo pone:
   - el lienzo 1080x1920 y el reloj (Stage de motor.js)
   - una transicion de empuje corta entre escena y escena
   - el sello de Torvick en la esquina durante todo el video
   - la escena de cierre con el nombre y las redes (MARCA.escena), siempre
   - la pagina: guion para leer, duraciones editables, selector de videos
   - #id/render: solo el lienzo a tamano real, con window.REEL para exportar
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var M = global.M,
    P = global.P;
  var animate = global.animate,
    Easing = global.Easing,
    clamp = global.clamp;
  var MARCA = global.MARCA;
  var ANCHO = 1080,
    ALTO = 1920;
  var TRANSICION = 0.36; // segundos que dura el empuje entre escenas
  var ESQUINA = {
    x: 34,
    y: 150
  }; // sello de marca (debajo de la barra superior de las apps)

  /* =========================================================
     AYUDAS para escribir escenas (REELS.ayudas)
     ========================================================= */

  // lo inverso de M.pop: nada se va de golpe
  function sale(T, cuando, dur) {
    if (dur == null) dur = 0.3;
    var k = animate({
      from: 1,
      to: 0,
      start: cuando,
      end: cuando + dur,
      ease: Easing.easeInCubic
    })(T);
    return {
      opacity: k,
      scale: 0.55 + 0.45 * k
    };
  }
  function junta(a, b) {
    return {
      opacity: a.opacity * b.opacity,
      scale: (a.scale == null ? 1 : a.scale) * (b.scale == null ? 1 : b.scale),
      x: a.x
    };
  }

  // repeticiones 0 -> 1 -> 0 entre a y b; n = 1.5 termina arriba
  function reps(T, a, b, n) {
    if (T <= a) return 0;
    var u = Math.min(1, (T - a) / (b - a));
    return 0.5 - 0.5 * Math.cos(u * n * Math.PI * 2);
  }

  // caja absoluta: entra con pop o slide, respira y puede temblar
  function Pos(props) {
    var e = props.e || {
      opacity: 1,
      scale: 1
    };
    var sc = (e.scale == null ? 1 : e.scale) * (props.esc || 1);
    var dx = (e.x || 0) + (props.dx || 0);
    var dy = props.dy || 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: props.x,
        top: props.y,
        opacity: e.opacity,
        transformOrigin: props.origen || '50% 50%',
        transform: 'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px) scale(' + sc.toFixed(4) + ')' + (props.rot ? ' rotate(' + props.rot.toFixed(2) + 'deg)' : '')
      }
    }, props.children);
  }
  function anchoRotulo(txt) {
    return Math.max(120, String(txt).length * 30) + 64 + 46;
  }

  // rotulo centrado en x salvo que se pida otra posicion
  function Rot(props) {
    var s = props.s || 1.1;
    var w = anchoRotulo(props.text) * s;
    var x = props.x == null ? (ANCHO - w) / 2 : props.x;
    return /*#__PURE__*/React.createElement(Pos, {
      x: x,
      y: props.y,
      e: props.e,
      dy: M.life(props.T, 3.4, 5, props.fase || 0)
    }, /*#__PURE__*/React.createElement(P.Rotulo, {
      text: props.text,
      dir: props.dir || 'right',
      s: s
    }));
  }

  // camara: escala alrededor de foco y lo deja en mira
  function Camara(props) {
    var z = props.zoom == null ? 1 : props.zoom;
    var f = props.foco || [ANCHO / 2, ALTO / 2];
    var m = props.mira || f;
    var tx = m[0] - z * f[0],
      ty = m[1] - z * f[1];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: ANCHO,
        height: ALTO,
        transformOrigin: '0 0',
        transform: 'translate(' + tx.toFixed(2) + 'px,' + ty.toFixed(2) + 'px) scale(' + z.toFixed(4) + ')'
      }
    }, props.children);
  }

  // ventana que muestra solo una franja de una pieza (para las comparaciones)
  function Recorte(props) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: props.x,
        top: props.y,
        width: props.w,
        height: props.h,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: -props.desde
      }
    }, props.children));
  }

  /* =========================================================
     REEL: escenas + transiciones + sello + cierre de marca
     ========================================================= */

  // cada escena se dibuja tambien media transicion antes y despues de su tramo,
  // corrida de costado: la que sale se va a la izquierda y la que entra viene de la derecha
  function Reel(props) {
    var T = global.useComposition().T;
    var escenas = props.escenas;
    var n = escenas.length;
    var h = TRANSICION / 2;
    var limites = [],
      acc = 0;
    escenas.forEach(function (e) {
      limites.push(acc);
      acc += e.dur;
    });
    var total = acc;
    var capas = [];
    escenas.forEach(function (e, i) {
      var at = limites[i],
        fin = at + e.dur;
      var desde = i > 0 ? at - h : at;
      var hasta = i < n - 1 ? fin + h : fin;
      if (T < desde || T >= hasta) return;
      var x = 0;
      if (i > 0 && T < at + h) {
        x = ANCHO * (1 - Easing.easeInOutCubic(clamp((T - (at - h)) / (2 * h), 0, 1)));
      } else if (i < n - 1 && T >= fin - h) {
        x = -ANCHO * Easing.easeInOutCubic(clamp((T - (fin - h)) / (2 * h), 0, 1));
      }
      var Esc = e.C;
      capas.push(/*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: 'absolute',
          left: 0,
          top: 0,
          width: ANCHO,
          height: ALTO,
          transform: x ? 'translateX(' + x.toFixed(1) + 'px)' : undefined
        }
      }, /*#__PURE__*/React.createElement(Esc, {
        T: T,
        at: at,
        dur: e.dur
      })));
    });

    // el sello acompana todo el video y se retira cuando entra el cierre de marca
    var iMarca = -1;
    escenas.forEach(function (e, i) {
      if (e.marca) iMarca = i;
    });
    var tMarca = iMarca >= 0 ? limites[iMarca] : total + 1;
    var entra = M.pop(T, -0.6, 0.5);
    var vaSale = sale(T, tMarca - h, 2 * h);
    var sello = junta(entra, vaSale);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: '#ffffff'
      }
    }, capas, sello.opacity > 0.01 ? /*#__PURE__*/React.createElement(Pos, {
      x: ESQUINA.x,
      y: ESQUINA.y,
      e: sello,
      origen: "0 50%",
      dy: M.life(T, 4, 3)
    }, /*#__PURE__*/React.createElement(MARCA.Esquina, {
      s: 0.84
    })) : null);
  }

  /* =========================================================
     REGISTRO de videos
     ========================================================= */

  var REGISTRO = [];
  function registrar(def) {
    REGISTRO.push(def);
  }
  function buscar(id) {
    for (var i = 0; i < REGISTRO.length; i++) if (REGISTRO[i].id === id) return REGISTRO[i];
    return REGISTRO[0];
  }

  // escenas propias + el cierre de marca: va SIEMPRE, en todos los videos (pedido del autor)
  function conMarca(def) {
    return def.escenas.concat([MARCA.escena]);
  }

  /* =========================================================
     PAGINA: lienzo vertical + guion para grabar la voz
     ========================================================= */

  function claveDur(id) {
    return 'reel.' + id + '.duraciones';
  }
  function durDefecto(def) {
    return conMarca(def).map(function (e) {
      return e.dur;
    });
  }
  function cargarDur(def) {
    var n = conMarca(def).length;
    try {
      var v = JSON.parse(localStorage.getItem(claveDur(def.id)) || 'null');
      if (Array.isArray(v) && v.length === n && v.every(function (x) {
        return typeof x === 'number' && x > 0;
      })) return v;
    } catch (e) {/* sin almacenamiento: tiempos por defecto */}
    return durDefecto(def);
  }
  function fmt(v) {
    return (Math.round(v * 10) / 10).toFixed(1);
  }

  // campo de segundos: deja escribir libre y aplica solo valores validos
  function CampoSeg(props) {
    var _t = useState(String(props.valor));
    var txt = _t[0],
      setTxt = _t[1];
    var editando = React.useRef(false);
    useEffect(function () {
      if (!editando.current) setTxt(String(props.valor));
    }, [props.valor]);
    return /*#__PURE__*/React.createElement("input", {
      type: "number",
      min: "1",
      max: "30",
      step: "0.5",
      value: txt,
      onFocus: function () {
        editando.current = true;
      },
      onBlur: function () {
        editando.current = false;
        setTxt(String(props.valor));
      },
      onChange: function (ev) {
        setTxt(ev.target.value);
        var v = parseFloat(ev.target.value);
        if (v >= 1 && v <= 30) props.onValor(v);
      }
    });
  }
  function Guion(props) {
    var api = props.api;
    useEffect(function () {
      global.REEL = {
        seek: api.seek,
        setPlaying: api.setPlaying,
        total: api.total
      };
    });
    if (props.render) return null;
    var acc = 0,
      actual = -1;
    var filas = props.escenas.map(function (e, i) {
      var at = acc;
      acc += e.dur;
      var activa = api.T >= at && api.T < acc;
      if (activa) actual = i;
      return /*#__PURE__*/React.createElement("li", {
        key: i,
        className: (activa ? 'activa' : '') + (e.marca ? ' firma' : ''),
        onClick: function () {
          api.seek(at + 0.001);
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "num"
      }, i + 1), /*#__PURE__*/React.createElement("div", {
        className: "texto"
      }, /*#__PURE__*/React.createElement("b", null, e.nombre), /*#__PURE__*/React.createElement("span", null, e.vo)), /*#__PURE__*/React.createElement("label", {
        className: "seg",
        onClick: function (ev) {
          ev.stopPropagation();
        }
      }, /*#__PURE__*/React.createElement(CampoSeg, {
        valor: e.dur,
        onValor: function (v) {
          var nuevo = props.durs.slice();
          nuevo[i] = v;
          props.setDurs(nuevo);
        }
      }), /*#__PURE__*/React.createElement("span", null, "s")));
    });
    var total = acc;
    return /*#__PURE__*/React.createElement("div", {
      className: "guion"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rotulo"
    }, "Ahora dice"), /*#__PURE__*/React.createElement("div", {
      className: "ahora"
    }, actual >= 0 ? props.escenas[actual].vo : '—'), /*#__PURE__*/React.createElement("div", {
      className: 'total' + (total > 60 ? ' pasa' : '')
    }, "Total ", fmt(total), " s", total > 60 ? ' · pasa del minuto' : ''), /*#__PURE__*/React.createElement("ol", null, filas), /*#__PURE__*/React.createElement("button", {
      className: "plano",
      onClick: function () {
        props.setDurs(props.defecto);
      }
    }, "Restablecer tiempos"));
  }
  function Video(props) {
    var def = props.def,
      modoRender = props.render;
    var _d = useState(function () {
      return modoRender ? durDefecto(def) : cargarDur(def);
    });
    var durs = _d[0],
      setDurs = _d[1];
    useEffect(function () {
      if (modoRender) return;
      try {
        localStorage.setItem(claveDur(def.id), JSON.stringify(durs));
      } catch (e) {/* nada */}
    }, [durs]);
    var escenas = conMarca(def).map(function (e, i) {
      return Object.assign({}, e, {
        dur: durs[i]
      });
    });
    var scenes = escenas.map(function (e) {
      return {
        name: e.nombre,
        dur: e.dur
      };
    });
    return /*#__PURE__*/React.createElement(global.Stage, {
      ancho: ANCHO,
      alto: ALTO,
      scenes: scenes,
      debajo: function (api) {
        return /*#__PURE__*/React.createElement(Guion, {
          api: api,
          escenas: escenas,
          durs: durs,
          setDurs: setDurs,
          defecto: durDefecto(def),
          render: modoRender
        });
      }
    }, /*#__PURE__*/React.createElement(Reel, {
      escenas: escenas
    }));
  }

  // hash: #face-pull  o  #face-pull/render
  function leerHash() {
    var h = String(global.location.hash || '').replace(/^#/, '');
    var partes = h.split('/');
    return {
      id: partes[0] || REGISTRO[0] && REGISTRO[0].id,
      render: partes[1] === 'render'
    };
  }
  function App() {
    var _h = useState(leerHash);
    var ruta = _h[0],
      setRuta = _h[1];
    useEffect(function () {
      var cambio = function () {
        setRuta(leerHash());
      };
      global.addEventListener('hashchange', cambio);
      return function () {
        global.removeEventListener('hashchange', cambio);
      };
    }, []);
    var def = buscar(ruta.id);
    if (!def) return /*#__PURE__*/React.createElement("p", {
      style: {
        padding: 24
      }
    }, "No hay videos registrados.");
    if (ruta.render) {
      return /*#__PURE__*/React.createElement("div", {
        className: "fp-render"
      }, /*#__PURE__*/React.createElement(Video, {
        key: def.id + ':r',
        def: def,
        render: true
      }));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "fp"
    }, /*#__PURE__*/React.createElement("header", {
      className: "fp-cabecera"
    }, /*#__PURE__*/React.createElement("div", {
      className: "marca"
    }, def.titulo), /*#__PURE__*/React.createElement("nav", {
      className: "videos"
    }, REGISTRO.map(function (d) {
      return /*#__PURE__*/React.createElement("a", {
        key: d.id,
        href: '#' + d.id,
        className: d.id === def.id ? 'actual' : ''
      }, d.titulo);
    })), /*#__PURE__*/React.createElement("div", {
      className: "sub"
    }, "reel vertical 1080\xD71920 \xB7 le\xE9 la l\xEDnea resaltada mientras corre")), /*#__PURE__*/React.createElement(Video, {
      key: def.id,
      def: def
    }));
  }
  function montar() {
    ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
  }
  global.REELS = {
    ANCHO: ANCHO,
    ALTO: ALTO,
    TRANSICION: TRANSICION,
    registrar: registrar,
    buscar: buscar,
    montar: montar,
    lista: function () {
      return REGISTRO.slice();
    },
    conMarca: conMarca,
    Reel: Reel,
    ayudas: {
      sale: sale,
      junta: junta,
      reps: reps,
      Pos: Pos,
      Rot: Rot,
      Camara: Camara,
      Recorte: Recorte,
      anchoRotulo: anchoRotulo
    }
  };
})(window);
