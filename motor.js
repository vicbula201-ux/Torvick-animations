/* ============================================================
   MOTOR — reloj de autor + composicion continua
   Todo se calcula por fotograma a partir de un unico T.
   Nada de @keyframes, animation: ni transition: para la escena.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var h = React.createElement;
  var useState = React.useState;
  var useEffect = React.useEffect;
  var useRef = React.useRef;
  var useMemo = React.useMemo;
  var useContext = React.useContext;
  var createContext = React.createContext;

  /* ---------- utilidades ---------- */

  function clamp(v, min, max) {
    if (v < min) return min;
    if (v > max) return max;
    return v;
  }

  /* ---------- las trece curvas ---------- */

  var BACK_S = 1.70158;

  var Easing = {
    linear: function (t) { return t; },

    easeInQuad: function (t) { return t * t; },
    easeOutQuad: function (t) { return t * (2 - t); },
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },

    easeInCubic: function (t) { return t * t * t; },
    easeOutCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    },

    easeOutQuart: function (t) { return 1 - Math.pow(1 - t, 4); },
    easeInOutQuart: function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    },

    easeOutExpo: function (t) {
      return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
    },

    easeInOutSine: function (t) {
      return -(Math.cos(Math.PI * t) - 1) / 2;
    },

    easeOutBack: function (t) {
      var s = BACK_S;
      var p = t - 1;
      return 1 + (s + 1) * p * p * p + s * p * p;
    },

    easeOutElastic: function (t) {
      if (t <= 0) return 0;
      if (t >= 1) return 1;
      var c4 = (2 * Math.PI) / 3;
      return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
  };

  /* ---------- animate / interpolate ----------
     Nunca extrapolan: antes de start devuelven from, despues de end devuelven to. */

  function animate(spec) {
    var from = spec.from;
    var to = spec.to;
    var start = spec.start;
    var end = spec.end;
    var ease = spec.ease || Easing.easeOutCubic;
    return function (T) {
      if (T <= start) return from;
      if (T >= end) return to;
      if (end <= start) return to;
      var p = (T - start) / (end - start);
      return from + (to - from) * ease(p);
    };
  }

  function interpolate(tiempos, valores, ease) {
    return animate({
      from: valores[0],
      to: valores[1],
      start: tiempos[0],
      end: tiempos[1],
      ease: ease || Easing.easeOutCubic
    });
  }

  /* ---------- contexto de composicion ---------- */

  var CompositionContext = createContext({ T: 0, authoredTotal: 1, CUES: {} });

  function useComposition() {
    return useContext(CompositionContext);
  }

  /* <Shot from={a} to={b}> — solo renderiza si T cae en el rango */
  function Shot(props) {
    var comp = useComposition();
    var T = comp.T;
    var from = props.from == null ? 0 : props.from;
    var to = props.to == null ? comp.authoredTotal : props.to;
    if (T < from || T >= to) return null;
    return h(React.Fragment, null, props.children);
  }

  /* ---------- reloj ---------- */

  function useClock(authoredTotal) {
    var st = useState(0);
    var T = st[0], setT = st[1];
    var pl = useState(true);
    var playing = pl[0], setPlaying = pl[1];

    var tRef = useRef(0);
    var lastRef = useRef(0);
    var rafRef = useRef(0);
    var scrubRef = useRef(false);
    var totalRef = useRef(authoredTotal);
    totalRef.current = authoredTotal;

    useEffect(function () {
      lastRef.current = performance.now();
      var step = function (now) {
        var dt = (now - lastRef.current) / 1000;
        lastRef.current = now;
        if (dt > 0.1) dt = 0.1; // pestana en segundo plano: no saltar
        var total = totalRef.current;
        if (playing && !scrubRef.current && total > 0) {
          var n = tRef.current + dt;
          while (n >= total) n -= total; // loop del reloj de autor
          if (n < 0) n = 0;
          tRef.current = n;
          setT(n);
        }
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
      return function () { cancelAnimationFrame(rafRef.current); };
    }, [playing]);

    // si cambia la duracion, reencuadrar T dentro del nuevo rango
    useEffect(function () {
      if (tRef.current > authoredTotal) {
        tRef.current = 0;
        setT(0);
      }
    }, [authoredTotal]);

    var seek = function (v) {
      var val = clamp(v, 0, totalRef.current);
      tRef.current = val;
      setT(val);
    };

    var setScrubbing = function (v) { scrubRef.current = !!v; };

    return {
      T: T,
      playing: playing,
      setPlaying: setPlaying,
      seek: seek,
      setScrubbing: setScrubbing
    };
  }

  /* ---------- escalado del lienzo 1920x1080 ---------- */

  function useEscala(ref) {
    var st = useState(1);
    var escala = st[0], setEscala = st[1];
    useEffect(function () {
      var el = ref.current;
      if (!el) return;
      var medir = function () {
        var w = el.clientWidth;
        if (w > 0) setEscala(w / 1920);
      };
      medir();
      if (typeof ResizeObserver === 'undefined') {
        global.addEventListener('resize', medir);
        return function () { global.removeEventListener('resize', medir); };
      }
      var ro = new ResizeObserver(medir);
      ro.observe(el);
      return function () { ro.disconnect(); };
    }, [ref]);
    return escala;
  }

  /* ---------- CUES desde la lista de escenas ---------- */

  function derivarCues(scenes) {
    var CUES = {};
    var acc = 0;
    for (var i = 0; i < scenes.length; i++) {
      var s = scenes[i];
      CUES[s.name] = acc;
      acc += s.dur;
    }
    return { CUES: CUES, total: acc };
  }

  function fmt(v) { return (Math.round(v * 10) / 10).toFixed(1) + 's'; }

  /* ---------- Stage: lienzo + controles ---------- */

  function Stage(props) {
    var scenes = props.scenes || [];
    var derivado = useMemo(function () { return derivarCues(scenes); },
      [JSON.stringify(scenes)]);
    var authoredTotal = props.total != null ? props.total : derivado.total;
    if (!(authoredTotal > 0)) authoredTotal = 1;

    var reloj = useClock(authoredTotal);
    var marcoRef = useRef(null);
    var escala = useEscala(marcoRef);

    var ctx = useMemo(function () {
      return { T: reloj.T, authoredTotal: authoredTotal, CUES: derivado.CUES };
    }, [reloj.T, authoredTotal, derivado]);

    var lienzo = h('div', {
      style: {
        position: 'absolute', left: 0, top: 0,
        width: 1920, height: 1080,
        transformOrigin: '0 0',
        transform: 'scale(' + escala + ')',
        background: '#ffffff',
        overflow: 'hidden'
      }
    }, h(CompositionContext.Provider, { value: ctx }, props.children));

    var marco = h('div', {
      ref: marcoRef,
      className: 'motor-marco',
      style: {
        position: 'relative',      // confina lo absoluto: no se monta sobre la UI
        aspectRatio: '16 / 9',
        width: '100%',
        background: '#ffffff',
        overflow: 'hidden',
        borderRadius: 9
      }
    }, lienzo, props.overlay || null);

    var boton = h('button', {
      type: 'button',
      className: 'motor-play',
      onClick: function () { reloj.setPlaying(!reloj.playing); },
      'aria-label': reloj.playing ? 'Pausar' : 'Reproducir'
    }, reloj.playing ? '❚❚' : '▶');

    var barra = h('input', {
      type: 'range',
      className: 'motor-scrub',
      min: 0,
      max: authoredTotal,
      step: 0.01,
      value: reloj.T,
      onPointerDown: function () { reloj.setScrubbing(true); },
      onPointerUp: function () { reloj.setScrubbing(false); },
      onPointerCancel: function () { reloj.setScrubbing(false); },
      onChange: function (e) { reloj.seek(parseFloat(e.target.value)); }
    });

    var tiempo = h('span', { className: 'motor-tiempo' },
      fmt(reloj.T) + ' / ' + fmt(authoredTotal));

    var controles = h('div', { className: 'motor-controles' }, boton, barra, tiempo);

    return h('div', { className: 'motor-mesa' }, marco, controles);
  }

  /* ---------- exports ---------- */

  global.Easing = Easing;
  global.clamp = clamp;
  global.animate = animate;
  global.interpolate = interpolate;
  global.useComposition = useComposition;
  global.CompositionContext = CompositionContext;
  global.Shot = Shot;
  global.Stage = Stage;
  global.MOTOR = {
    Easing: Easing, clamp: clamp, animate: animate, interpolate: interpolate,
    useComposition: useComposition, Shot: Shot, Stage: Stage
  };
})(window);
