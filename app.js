/* GENERADO por compilar.js desde app.jsx — no editar a mano. */
/* ============================================================
   APP — UI, llamada al modelo, transpilacion, montaje, ajuste
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var useState = React.useState;
  var useRef = React.useRef;
  var useEffect = React.useEffect;

  /* =========================================================
     HITO 4 — PROMPT DE SISTEMA (va literal en cada llamada)
     ========================================================= */

  var SYSTEM = `Generás UNA escena de animación en JSX para un video explicativo en español,
estilo pizarra: trazo negro grueso sobre fondo blanco, ilustraciones planas
tipo garabato técnico.

DEVOLVÉS SOLO CÓDIGO. Sin explicaciones, sin markdown, sin bloques de cerca.

Formato exacto, una sola función:

function Escena({ T, at, dur }) {
  const f = (v) => at + dur * v;
  const t = clamp((T - at) / dur, 0, 1);
  // ...cálculos
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      ...
    </div>
  );
}

REGLAS DURAS

1. Lienzo 1920x1080. Todo con position:absolute + left/top en píxeles
   literales. Nada de vh/vw. Nada de flex para colocar la escena.

2. Composición en COLUMNAS HORIZONTALES, nunca apilado vertical:
   sujeto a la izquierda (x 100-620), transición o flecha al centro
   (x 800-1200), resultado a la derecha (x 1300-1800).

3. TODOS los tiempos con f(fracción), fracción entre 0 y 1.
   PROHIBIDO escribir segundos sueltos como 0.5, 2, 4, at+3 en cualquier
   animate() / M.pop() / M.slide(): siempre at = f(x), fin = f(y).
   Si la duración cambia, la coreografía entera debe estirarse o encogerse
   proporcionalmente.
   Correcto:   M.pop(T, f(0.1), 0.4)
   PROHIBIDO:  M.pop(T, at + 1.2, 0.4)

4. El elemento principal YA está en pantalla en el primer fotograma:
   usá M.pop(T, at - 0.6, 0.5). Lo demás entra después, con f(...).
   El primer fotograma de una escena nunca puede estar en blanco.

5. Nada aparece de golpe: siempre M.pop (rebote) o M.slide (desde el borde).

6. Movimiento vivo continuo en todo lo que se queda en pantalla:
   M.life(T, periodo, amplitud) para flotar, latir, balancearse.

7. Lo que falla vibra: M.vibra(T, 44, 4).

8. Texto en pantalla: SOLO P.Rotulo, 2 a 4 palabras, señalando una imagen.
   Máximo dos rótulos por escena.
   NUNCA escribas la frase del guion en pantalla.

9. Jamás tapes nada con rectángulos opacos.

10. Piezas de 120px mínimo. Trazos de 11px mínimo.

11. Máximo 6 elementos en pantalla. Elegí 3 o 4 momentos claros a lo largo
    de la duración.

HELPERS DISPONIBLES
M.pop(T, cuando, dur) -> { opacity, scale }
M.slide(T, cuando, desdeX, dur) -> { opacity, x }
M.draw(T, cuando, dur) -> 0..1
M.life(T, periodo, amplitud, fase) -> oscilación continua
M.vibra(T, hz, amp) -> temblor
clamp(v, min, max)
interpolate([a, b], [c, d], Easing.easeOutCubic)(T)
animate({ from, to, start, end, ease })(T)
Easing: linear, easeInQuad, easeOutQuad, easeInOutQuad, easeInCubic,
easeOutCubic, easeInOutCubic, easeOutQuart, easeOutExpo, easeInOutSine,
easeOutBack, easeOutElastic

PIEZAS (usá SOLO estas; formas geométricas simples propias sí están permitidas)
P.Cerebro    620x600  (s, on, T, mirror, shortcut)  on 0..1 enciende la red de gris a verde; shortcut dibuja un atajo rojo y 2 nodos rojos; mirror refleja en X
P.Figura     230x380  (s, slump, posture)           monigote de palotes; slump 0..1 hunde la cabeza y encorva; posture "up" levanta los brazos
P.Escritorio 560x150  (s)                            tablero horizontal con dos patas
P.Corazon    110x100  (s, beat, color)               corazón relleno; beat multiplica la escala
P.Pesa       420x160  (s, tilt)                      barra con discos; tilt la rota en grados
P.Basurita   120x120  (kind, s)                      kind: "scroll" | "like" | "bell" | "fast"
P.Rotulo     auto     (text, dir, s)                 ÚNICO texto del lienzo; dir "left" | "right"
P.Nube       620x460  (s, children)                  nube de pensamiento; los children van centrados adentro
P.Parlante   220x230  (s, wob)                       busto hablando desde un atril; wob lo rota
P.Tacha      230x230  (s)                            X roja
P.Visto      220x200  (s, p)                         check verde; p 0..1 lo dibuja
P.Telefono   340x600  (s, children)                  teléfono vertical; los children van en la pantalla
P.Caballo    220x210  (s)                            silueta de cabeza de caballo
P.Gallina    210x200  (s)                            gallina
P.Risa       210x210  (s)                            cara amarilla riendo
P.Flecha     260x90   (s, color, dir)                dir "right" | "left" | "down"
P.Medidor    300x108  (p, s, shake, beat)            batería de 6 segmentos; p 0..1; el color se elige solo
P.Meta       300x300  (s, float, dim)                diana de tres anillos; float desplaza en Y; dim la atenúa
P.Reloj      240x240  (s, T, speed)                  manecillas que giran con T
P.Bombillo   200x260  (s, on)                        bombilla; on 0..1 la enciende con 6 rayos
P.Trazo      1920x1080 (p, x0, x1, y, shake, color)  línea con punta que avanza de x0 a x1 según p; ya viene en position absolute sobre todo el lienzo

COLORES: P.C.INK negro · P.C.YEL amarillo · P.C.RED rojo ·
P.C.GRN verde · P.C.GRY gris

CÓMO TRADUCIR LA FRASE
Buscá el CONTRASTE VISUAL, no la ilustración literal.
· "me distraigo"            -> figura + medidor que se vacía + basuritas orbitando
· "el cerebro se recablea"  -> P.Cerebro con on que baja y shortcut rojo
· "prefiero videos tontos"  -> nube con lo aburrido tachado, flecha, teléfono con animal
· "cuesta empezar"          -> figura empujando, P.Trazo que avanza lento
· "se acumula"              -> basuritas cayendo una tras otra, medidor subiendo

Si la frase es una queja, mostrá el FRACASO:
vibración, medidor a cero, tacha roja.
Si es una salida, mostrá la GANANCIA:
P.Visto, red verde encendida, P.Bombillo.

Antes de responder revisá tu propio código: si encontrás un número de
segundos absoluto fuera de f(...), corregilo. La escena debe verse igual
de completa en 5s que en 30s, solo que más rápida o más lenta.`;

  /* =========================================================
     HITO 5 — limpieza, transpilacion y fabricacion
     ========================================================= */

  function limpiar(src) {
    var s = String(src || '').trim();
    // si el modelo agrego cercas, quedarse con el bloque mas grande
    var bloques = s.match(/```[a-zA-Z]*\n?([\s\S]*?)```/g);
    if (bloques && bloques.length) {
      var mejor = '';
      bloques.forEach(function (b) {
        var cuerpo = b.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '');
        if (cuerpo.length > mejor.length) mejor = cuerpo;
      });
      s = mejor;
    }
    // por si quedo una cerca suelta al abrir o al cerrar
    s = s.replace(/^```[a-zA-Z]*\s*/, '').replace(/```\s*$/, '');
    return s.trim();
  }
  function compilar(src) {
    var out = Babel.transform(src, {
      presets: ['react']
    }).code;
    var fabrica = new Function('React', 'P', 'M', 'animate', 'Easing', 'interpolate', 'clamp', out + '\nreturn typeof Escena === "function" ? Escena : null;');
    var Escena = fabrica(global.React, global.P, global.M, global.animate, global.Easing, global.interpolate, global.clamp);
    if (!Escena) {
      throw new Error('El código devuelto no define una función llamada Escena.');
    }
    return Escena;
  }

  /* =========================================================
     llamada al modelo
     ========================================================= */

  function pedirAlModelo(opts) {
    return fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': opts.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: opts.modelo,
        max_tokens: 6000,
        system: SYSTEM,
        messages: opts.messages
      })
    }).then(function (r) {
      return r.text().then(function (txt) {
        if (!r.ok) {
          var detalle = txt;
          try {
            var j = JSON.parse(txt);
            if (j.error && j.error.message) detalle = j.error.message;
          } catch (e) {/* el cuerpo no era JSON */}
          throw new Error('La API respondió ' + r.status + ': ' + detalle);
        }
        var j2 = JSON.parse(txt);
        return (j2.content || []).filter(function (b) {
          return b.type === 'text';
        }).map(function (b) {
          return b.text;
        }).join('');
      });
    });
  }

  /* =========================================================
     montaje de la escena dentro del motor
     ========================================================= */

  function Lienzo(props) {
    var comp = global.useComposition();
    var T = comp.T;
    var total = comp.authoredTotal;
    var Escena = props.Escena;
    if (!Escena) {
      return /*#__PURE__*/React.createElement("div", {
        className: "vacio"
      }, "escribe una frase y genera");
    }
    var contenido = null;
    var error = null;
    try {
      // llamada directa: el try/catch corre por fotograma y no tumba la app
      contenido = Escena({
        T: T,
        at: 0,
        dur: total
      });
    } catch (e) {
      error = e && e.message ? e.message : String(e);
    }

    // camara: zoom lento continuo, en toda escena, siempre
    var zoom = 1 + 0.05 * (total > 0 ? T / total : 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        transform: 'scale(' + zoom + ')',
        transformOrigin: '50% 48%'
      }
    }, error ? null : contenido), error ? /*#__PURE__*/React.createElement("div", {
      className: "banda"
    }, "La escena fall\xF3 al dibujarse: ", error, /*#__PURE__*/React.createElement("br", null), "Ped\xED un ajuste describiendo el problema, o edit\xE1 el c\xF3digo abajo.") : null);
  }

  /* =========================================================
     HITOS 6 y 7 — interfaz y ajuste en lenguaje natural
     ========================================================= */

  var MODELOS = [{
    id: 'claude-opus-5',
    nombre: 'Opus 5'
  }, {
    id: 'claude-sonnet-5',
    nombre: 'Sonnet 5'
  }, {
    id: 'claude-haiku-4-5-20251001',
    nombre: 'Haiku 4.5'
  }];
  function App() {
    var _k = useState(function () {
      try {
        return localStorage.getItem('claveApi') || '';
      } catch (e) {
        return '';
      }
    });
    var apiKey = _k[0],
      setApiKey = _k[1];
    var _m = useState(function () {
      try {
        return localStorage.getItem('modelo') || MODELOS[0].id;
      } catch (e) {
        return MODELOS[0].id;
      }
    });
    var modelo = _m[0],
      setModelo = _m[1];
    var _s = useState(12);
    var segundos = _s[0],
      setSegundos = _s[1];
    var _f = useState('');
    var frase = _f[0],
      setFrase = _f[1];
    var _p = useState('');
    var pedido = _p[0],
      setPedido = _p[1];
    var _c = useState(''); // codigo fuente actual de la escena
    var codigo = _c[0],
      setCodigo = _c[1];
    var _b = useState(''); // borrador editable del panel de codigo
    var borrador = _b[0],
      setBorrador = _b[1];
    var _e = useState(null); // funcion Escena compilada
    var Escena = _e[0],
      setEscena = _e[1];
    var _l = useState(false);
    var cargando = _l[0],
      setCargando = _l[1];
    var _x = useState('');
    var error = _x[0],
      setError = _x[1];
    var _v = useState(false);
    var verCodigo = _v[0],
      setVerCodigo = _v[1];

    // la frase que produjo el codigo en pantalla: es la que se reenvia al ajustar
    var fraseDeLaEscena = useRef('');
    var durDeLaEscena = useRef(12);
    useEffect(function () {
      try {
        localStorage.setItem('claveApi', apiKey);
      } catch (e) {}
    }, [apiKey]);
    useEffect(function () {
      try {
        localStorage.setItem('modelo', modelo);
      } catch (e) {}
    }, [modelo]);
    function aplicar(src) {
      var limpio = limpiar(src);
      setCodigo(limpio);
      setBorrador(limpio);
      try {
        // compilar ANTES de tocar el estado: si setEscena recibiera un updater
        // que compila, React lo correria fuera de este try/catch y el error
        // escaparia tumbando la app
        var E = compilar(limpio);
        setEscena(function () {
          return E;
        });
        setError('');
      } catch (e) {
        // el codigo no compila: mostrarlo y dejar seguir trabajando
        setEscena(null);
        setError('No se pudo compilar el código: ' + (e && e.message ? e.message : String(e)));
        setVerCodigo(true);
      }
    }
    function validar() {
      if (!apiKey.trim()) {
        setError('Falta la API key.');
        return false;
      }
      if (!frase.trim()) {
        setError('Escribí una frase del guion.');
        return false;
      }
      return true;
    }
    function generar() {
      if (!validar()) return;
      setError('');
      setCargando(true);
      var f = frase.trim();
      var d = segundos;
      pedirAlModelo({
        apiKey: apiKey.trim(),
        modelo: modelo,
        messages: [{
          role: 'user',
          content: 'Frase: "' + f + '"\nDuración: ' + d + ' segundos.\nDevolvé solo la función Escena.'
        }]
      }).then(function (txt) {
        fraseDeLaEscena.current = f;
        durDeLaEscena.current = d;
        aplicar(txt);
      }).catch(function (e) {
        setError(e && e.message ? e.message : String(e));
      }).then(function () {
        setCargando(false);
      });
    }
    function ajustar() {
      if (!apiKey.trim()) {
        setError('Falta la API key.');
        return;
      }
      if (!pedido.trim()) {
        setError('Describí qué querés cambiar.');
        return;
      }
      setError('');
      setCargando(true);
      var p = pedido.trim();
      // tres mensajes: el codigo actual va como turno del asistente,
      // por eso el modelo corrige en vez de rehacer
      pedirAlModelo({
        apiKey: apiKey.trim(),
        modelo: modelo,
        messages: [{
          role: 'user',
          content: 'Frase: "' + fraseDeLaEscena.current + '"\nDuración: ' + durDeLaEscena.current + ' segundos.\nDevolvé solo la función Escena.'
        }, {
          role: 'assistant',
          content: codigo
        }, {
          role: 'user',
          content: 'Ajustá SOLO esto, sin rehacer el resto de la escena: ' + p + '\nSi el pedido es sobre duración o velocidad, revisá que TODOS los ' + 'tiempos usen f(fracción) y no segundos sueltos.\nDevolvé de nuevo ' + 'la función Escena completa, ya corregida.'
        }]
      }).then(function (txt) {
        aplicar(txt);
        setPedido('');
      }).catch(function (e) {
        setError(e && e.message ? e.message : String(e));
      }).then(function () {
        setCargando(false);
      });
    }
    function recompilar() {
      aplicar(borrador);
    }
    function exportar() {
      var blob = new Blob([codigo + '\n'], {
        type: 'text/plain;charset=utf-8'
      });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'escena.jsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () {
        URL.revokeObjectURL(url);
      }, 1000);
    }
    var hayEscena = !!codigo;
    var bandaError = error ? /*#__PURE__*/React.createElement("div", {
      className: "banda",
      style: {
        position: 'relative'
      }
    }, error) : null;
    return /*#__PURE__*/React.createElement("div", {
      className: "app"
    }, /*#__PURE__*/React.createElement("header", {
      className: "cabecera"
    }, /*#__PURE__*/React.createElement("div", {
      className: "marca"
    }, "Generador de escenas"), /*#__PURE__*/React.createElement("div", {
      className: "campo"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "seg"
    }, "Segundos"), /*#__PURE__*/React.createElement("input", {
      id: "seg",
      type: "number",
      min: "2",
      max: "60",
      step: "1",
      value: segundos,
      onChange: function (e) {
        var v = parseFloat(e.target.value);
        setSegundos(isNaN(v) ? 1 : global.clamp(v, 1, 120));
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "campo"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "mod"
    }, "Modelo"), /*#__PURE__*/React.createElement("select", {
      id: "mod",
      value: modelo,
      onChange: function (e) {
        setModelo(e.target.value);
      }
    }, MODELOS.map(function (m) {
      return /*#__PURE__*/React.createElement("option", {
        key: m.id,
        value: m.id
      }, m.nombre);
    }))), /*#__PURE__*/React.createElement("div", {
      className: "campo"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "key"
    }, "API key"), /*#__PURE__*/React.createElement("input", {
      id: "key",
      className: "llave",
      type: "password",
      value: apiKey,
      placeholder: "sk-ant-...",
      autoComplete: "off",
      onChange: function (e) {
        setApiKey(e.target.value);
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "cuerpo"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "lateral"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grupo"
    }, /*#__PURE__*/React.createElement("label", {
      className: "rotulo",
      htmlFor: "frase"
    }, "Frase del guion"), /*#__PURE__*/React.createElement("textarea", {
      id: "frase",
      rows: 4,
      value: frase,
      placeholder: "Siempre pospongo lo que importa",
      onChange: function (e) {
        setFrase(e.target.value);
      }
    })), /*#__PURE__*/React.createElement("button", {
      className: "primario",
      onClick: generar,
      disabled: cargando
    }, cargando ? 'Generando…' : 'Generar'), hayEscena ? /*#__PURE__*/React.createElement("div", {
      className: "separador"
    }) : null, hayEscena ? /*#__PURE__*/React.createElement("div", {
      className: "grupo"
    }, /*#__PURE__*/React.createElement("label", {
      className: "rotulo",
      htmlFor: "pedido"
    }, "\xBFAlgo no te gust\xF3?"), /*#__PURE__*/React.createElement("textarea", {
      id: "pedido",
      rows: 3,
      value: pedido,
      placeholder: "la figura est\xE1 muy chica",
      onChange: function (e) {
        setPedido(e.target.value);
      }
    }), /*#__PURE__*/React.createElement("button", {
      className: "ajuste",
      onClick: ajustar,
      disabled: cargando
    }, cargando ? 'Ajustando…' : 'Ajustar')) : null, hayEscena ? /*#__PURE__*/React.createElement("div", {
      className: "separador"
    }) : null, hayEscena ? /*#__PURE__*/React.createElement("div", {
      className: "grupo"
    }, /*#__PURE__*/React.createElement("button", {
      className: "plano",
      onClick: function () {
        setVerCodigo(!verCodigo);
      }
    }, verCodigo ? 'Ocultar código' : 'Ver código'), /*#__PURE__*/React.createElement("button", {
      className: "plano",
      onClick: exportar
    }, "Exportar .jsx")) : null, bandaError), /*#__PURE__*/React.createElement("main", {
      className: "escenario"
    }, /*#__PURE__*/React.createElement(global.Stage, {
      scenes: [{
        name: 'escena',
        dur: segundos
      }]
    }, /*#__PURE__*/React.createElement(Lienzo, {
      Escena: Escena
    })))), /*#__PURE__*/React.createElement("footer", {
      className: "pie"
    }, /*#__PURE__*/React.createElement("div", {
      className: "pie-barra"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rotulo"
    }, "C\xF3digo JSX"), /*#__PURE__*/React.createElement("button", {
      className: "plano",
      onClick: function () {
        setVerCodigo(!verCodigo);
      },
      disabled: !hayEscena
    }, verCodigo ? 'Colapsar' : 'Desplegar'), /*#__PURE__*/React.createElement("button", {
      className: "plano",
      onClick: recompilar,
      disabled: !hayEscena || !verCodigo
    }, "Recompilar")), verCodigo ? /*#__PURE__*/React.createElement("textarea", {
      className: "codigo",
      spellCheck: false,
      value: borrador,
      onChange: function (e) {
        setBorrador(e.target.value);
      }
    }) : null));
  }
  global.App = App;
  ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(window);
