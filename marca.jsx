/* ============================================================
   MARCA — window.MARCA: la firma de Torvick en todos los videos
   - Nombre: "TORVICK" en Archivo Black sobre un trazo de resaltador
   - Redes: YouTube, Instagram y TikTok dibujados en la paleta de cinco
   - Arroba: @eltorvick
   - Esquina: sello chico que acompana todo el video
   - EscMarca: escena de cierre (la agrega reel.jsx sola al final de cada reel)
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var P = global.P, M = global.M;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var INK = P.C.INK, YEL = P.C.YEL, RED = P.C.RED, GRY = P.C.GRY;
  var BLANCO = '#ffffff';

  var NOMBRE = 'TORVICK';
  var ARROBA = '@eltorvick';
  var REDES = ['youtube', 'instagram', 'tiktok'];

  // Archivo Black: ancho medio de una mayuscula ~0.78 em
  function anchoNombre(fs) { return fs * 0.78 * NOMBRE.length; }

  /* ---------------- nombre con resaltador ---------------- */

  // p 0..1 dibuja el trazo amarillo de izquierda a derecha
  function Nombre(props) {
    var s = props.s == null ? 1 : props.s;
    var fs = 160;
    var w = anchoNombre(fs) + 80, h = 210;
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    var x0 = 30, x1 = w - 30;
    var xf = x0 + (x1 - x0) * p;
    return (
      <svg width={w * s} height={h * s} viewBox={'0 0 ' + w + ' ' + h}
        style={Object.assign({ display: 'block', overflow: 'visible' }, props.style || {})}>
        {/* resaltador detras de la mitad baja de las letras, sin contorno: se lee como marcador */}
        {p > 0.02 ? (
          <path d={'M ' + x0 + ' 146 L ' + xf + ' 134'} stroke={YEL} strokeWidth={62}
            strokeLinecap="round" fill="none" />
        ) : null}
        <text x={w / 2} y={162} textAnchor="middle" fontFamily="'Archivo Black', sans-serif"
          fontSize={fs} fill={INK} letterSpacing={2}>{NOMBRE}</text>
      </svg>
    );
  }

  /* ---------------- redes (200x200) ---------------- */

  function Glifo(props) {
    var red = props.red;
    if (red === 'youtube') {
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <rect x={10} y={36} width={180} height={128} rx={40} fill={RED} stroke={INK} strokeWidth={15} />
          <path d="M 82 70 L 138 100 L 82 130 Z" fill={BLANCO} stroke={BLANCO} strokeWidth={10} />
        </g>
      );
    }
    if (red === 'instagram') {
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          <rect x={14} y={14} width={172} height={172} rx={52} fill={YEL} stroke={INK} strokeWidth={15} />
          <rect x={46} y={46} width={108} height={108} rx={34} fill={BLANCO} stroke={INK} strokeWidth={13} />
          <circle cx={100} cy={100} r={26} fill={YEL} stroke={INK} strokeWidth={13} />
          <circle cx={134} cy={66} r={8} fill={INK} />
        </g>
      );
    }
    // tiktok: nota blanca sobre cuadrado negro, con un eco rojo detras
    var nota = function (dx, dy, color) {
      return (
        <g transform={'translate(' + dx + ',' + dy + ')'} fill="none" stroke={color}
          strokeWidth={20} strokeLinecap="round" strokeLinejoin="round">
          <circle cx={84} cy={128} r={24} />
          <path d="M 108 128 L 108 46" />
          <path d="M 108 50 C 112 70, 128 82, 150 84" />
        </g>
      );
    };
    return (
      <g strokeLinejoin="round">
        <rect x={14} y={14} width={172} height={172} rx={46} fill={INK} stroke={INK} strokeWidth={15} />
        {nota(7, 5, RED)}
        {nota(0, 0, BLANCO)}
      </g>
    );
  }

  function Red(props) {
    var s = props.s == null ? 1 : props.s;
    return (
      <svg width={200 * s} height={200 * s} viewBox="0 0 200 200"
        style={Object.assign({ display: 'block', overflow: 'visible' }, props.style || {})}>
        <Glifo red={props.red} />
      </svg>
    );
  }

  /* ---------------- sello de esquina ---------------- */

  // nombre chico + las tres redes; alto ~64 px a s=1
  function Esquina(props) {
    var s = props.s == null ? 1 : props.s;
    var fs = 40;
    var wn = anchoNombre(fs);
    var w = 24 + wn + 26 + 3 * 52 + 14, h = 76;
    return (
      <svg width={w * s} height={h * s} viewBox={'0 0 ' + w + ' ' + h}
        style={Object.assign({ display: 'block', overflow: 'visible' }, props.style || {})}>
        <rect x={6} y={6} width={w - 12} height={h - 12} rx={18} fill={BLANCO} stroke={INK} strokeWidth={11} />
        <path d={'M 22 48 L ' + (24 + wn - 2) + ' 45'} stroke={YEL} strokeWidth={20} strokeLinecap="round" />
        <text x={24} y={53} fontFamily="'Archivo Black', sans-serif" fontSize={fs} fill={INK}>{NOMBRE}</text>
        {REDES.map(function (r, i) {
          return (
            <g key={r} transform={'translate(' + (24 + wn + 26 + i * 52) + ',14) scale(0.24)'}>
              <Glifo red={r} />
            </g>
          );
        })}
      </svg>
    );
  }

  /* ---------------- escena de cierre ---------------- */

  function EscMarca(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var nombre = M.pop(T, at - 0.6, 0.5);
    var trazo = M.draw(T, f(0.04), dur * 0.22);
    var sNombre = 0.96;
    var wNombre = (anchoNombre(160) + 80) * sNombre;

    var iconoS = 0.9, paso = 236;
    var x0 = (1080 - (2 * paso + 200 * iconoS)) / 2;
    var arroba = M.slide(T, f(0.4), 140, 0.45);
    var cta = M.pop(T, f(0.56), 0.45);

    var caja = function (e, x, y, dy, rot, hijo, key) {
      return (
        <div key={key} style={{
          position: 'absolute', left: x, top: y, opacity: e.opacity,
          transformOrigin: '50% 50%',
          transform: 'translate(' + (e.x || 0).toFixed(2) + 'px,' + dy.toFixed(2) + 'px) scale(' +
            (e.scale == null ? 1 : e.scale).toFixed(4) + ') rotate(' + rot.toFixed(2) + 'deg)'
        }}>{hijo}</div>
      );
    };

    var zoom = 1 + 0.03 * t;
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 45%', transform: 'scale(' + zoom + ')' }}>
          {caja(nombre, (1080 - wNombre) / 2, 560, M.life(T, 3.4, 6), 0,
            <Nombre s={sNombre} p={trazo} />, 'n')}
          {REDES.map(function (r, i) {
            var e = M.pop(T, f(0.14 + i * 0.08), 0.45);
            return caja(e, x0 + i * paso, 880, M.life(T, 2.6, 9, i * 0.33), M.life(T, 3.1, 4, i * 0.25),
              <Red red={r} s={iconoS} />, r);
          })}
          {caja(arroba, 0, 1110, M.life(T, 3.4, 5, 0.5), 0,
            <div style={{
              width: 1080, textAlign: 'center', fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontWeight: 700, fontSize: 84, letterSpacing: 2, color: INK
            }}>{ARROBA}</div>, 'a')}
          {caja(cta, (1080 - (Math.max(120, 16 * 30) + 110) * 1.1) / 2, 1290, M.life(T, 3.4, 5, 0.2), 0,
            <P.Rotulo text="SÍGUEME PARA MÁS" s={1.1} />, 'c')}
        </div>
      </div>
    );
  }

  global.MARCA = {
    NOMBRE: NOMBRE, ARROBA: ARROBA, REDES: REDES,
    Nombre: Nombre, Red: Red, Glifo: Glifo, Esquina: Esquina, EscMarca: EscMarca,
    // escena lista para sumar al final de cualquier reel
    escena: {
      nombre: 'Torvick', dur: 3, C: EscMarca, marca: true,
      vo: '(opcional) Sígueme para más técnica.'
    }
  };
})(window);
