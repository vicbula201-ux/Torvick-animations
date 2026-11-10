/* ============================================================
   MARCA — window.MARCA: la firma de Torvick en todos los videos
   - Nombre: "TORVICK" en Archivo Black sobre un trazo de resaltador
   - Redes: YouTube, Instagram y TikTok dibujados en la paleta de cinco
   - Arroba: @eltorvick
   - Esquina: sello chico que acompana todo el video
   - EscMarca: escena de cierre (la agrega reel.jsx sola al final de cada reel)
   - Estilo 2 (los videos con estilo: 2): Esquina2 suma "ENTRENA CON TOR" con
     Instagram y TikTok, y EscMarca2 muestra las dos cuentas: Torvick con su foto
     (marca/torvick.jpg) y Entrena con Tor con Tor sacando biceps
   - Accion (estilo 2, con accion: true o { pregunta, vo, dur } en registrar): antes
     del cierre, Tor senala comentar / compartir / guardar y una mano los toca
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var P = global.P, M = global.M;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var INK = P.C.INK, YEL = P.C.YEL, RED = P.C.RED, GRN = P.C.GRN, GRY = P.C.GRY;
  var BLANCO = '#ffffff';

  var NOMBRE = 'TORVICK';
  var ARROBA = '@eltorvick';
  var REDES = ['youtube', 'instagram', 'tiktok'];

  var TOR_NOMBRE = 'ENTRENA CON TOR';
  var TOR_REDES = ['instagram', 'tiktok'];
  var FOTO = 'marca/torvick.jpg';

  // Archivo Black: ancho medio de una mayuscula ~0.78 em (el espacio ~0.3 em)
  function anchoNombre(fs, texto) {
    texto = texto || NOMBRE;
    var esp = (texto.match(/ /g) || []).length;
    return fs * (0.78 * (texto.length - esp) + 0.3 * esp);
  }

  /* ---------------- nombre con resaltador ---------------- */

  // p 0..1 dibuja el trazo amarillo de izquierda a derecha
  function Nombre(props) {
    var s = props.s == null ? 1 : props.s;
    var fs = 160, texto = props.texto || NOMBRE;
    var w = anchoNombre(fs, texto) + 80, h = 210;
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
          fontSize={fs} fill={INK} letterSpacing={2}>{texto}</text>
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

  /* ---------------- estilo 2: sello de dos filas ---------------- */

  // TORVICK + YouTube, Instagram, TikTok  /  ENTRENA CON TOR + Instagram, TikTok
  function Esquina2(props) {
    var s = props.s == null ? 1 : props.s;
    var fila = function (texto, fs, redes, y) {
      var wn = anchoNombre(fs, texto);
      return {
        w: 24 + wn + 22 + redes.length * 50 + 12,
        el: (
          <g key={texto}>
            <path d={'M 22 ' + (y + 30) + ' L ' + (24 + wn - 2) + ' ' + (y + 27)} stroke={YEL} strokeWidth={18} strokeLinecap="round" />
            <text x={24} y={y + 34} fontFamily="'Archivo Black', sans-serif" fontSize={fs} fill={INK}>{texto}</text>
            {redes.map(function (r, i) {
              return (
                <g key={r} transform={'translate(' + (24 + wn + 22 + i * 50) + ',' + (y - 2) + ') scale(0.22)'}>
                  <Glifo red={r} />
                </g>
              );
            })}
          </g>
        )
      };
    };
    var a = fila(NOMBRE, 36, REDES, 16), b = fila(TOR_NOMBRE, 30, TOR_REDES, 70);
    var w = Math.max(a.w, b.w), h = 128;
    return (
      <svg width={w * s} height={h * s} viewBox={'0 0 ' + w + ' ' + h}
        style={Object.assign({ display: 'block', overflow: 'visible' }, props.style || {})}>
        <rect x={6} y={6} width={w - 12} height={h - 12} rx={18} fill={BLANCO} stroke={INK} strokeWidth={11} />
        <path d={'M 22 64 L ' + (w - 22) + ' 64'} stroke={GRY} strokeWidth={6} strokeLinecap="round" />
        {a.el}
        {b.el}
      </svg>
    );
  }

  /* ---------------- estilo 2: cierre con las dos cuentas ---------------- */

  // circulo con contorno INK sobre un aro amarillo; adentro la foto o lo que venga
  function Circulo(props) {
    var d = props.d;
    return (
      <div style={{ position: 'relative', width: d, height: d }}>
        <div style={{ position: 'absolute', left: -14, top: -14, width: d + 28, height: d + 28, borderRadius: '50%', background: YEL }} />
        <div style={{ position: 'absolute', left: 0, top: 0, width: d, height: d, borderRadius: '50%', overflow: 'hidden',
          background: props.fondo || BLANCO, boxShadow: '0 0 0 12px ' + INK }}>
          {props.children}
        </div>
      </div>
    );
  }

  function EscMarca2(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);
    var TOR = global.TOR;
    var entra = function (cuando, desde) {
      var k = Easing.easeOutBack(clamp((T - cuando) / 0.5, 0, 1));
      return { opacity: clamp((T - cuando) / 0.2, 0, 1), x: desde * (1 - k) };
    };
    var caja = function (e, x, y, dy, hijo, key) {
      return (
        <div key={key} style={{
          position: 'absolute', left: x, top: y, opacity: e.opacity, transformOrigin: '50% 50%',
          transform: 'translate(' + (e.x || 0).toFixed(1) + 'px,' + dy.toFixed(1) + 'px) scale(' + (e.scale == null ? 1 : e.scale).toFixed(4) + ')'
        }}>{hijo}</div>
      );
    };
    var sN = 0.6, D = 290, xT = 400;
    var c1 = entra(at - 0.6, -500), c2 = entra(f(0.18), 500);
    var flex = 0.3 + 0.7 * Easing.easeOutBack(clamp((T - f(0.34)) / 0.4, 0, 1));
    var cta = M.pop(T, f(0.58), 0.45);
    var zoom = 1 + 0.03 * t;
    var redes = function (lista, x0, y, desde, fase) {
      return lista.map(function (r, i) {
        var e = M.pop(T, desde + i * 0.08, 0.42);
        return caja(e, x0 + i * 128, y, M.life(T, 2.6, 7, fase + i * 0.33), <Red red={r} s={0.5} />, r + y);
      });
    };
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 45%', transform: 'scale(' + zoom + ')' }}>
          {/* Torvick: la foto, el nombre, las tres redes y la arroba */}
          {caja(c1, 70, 330, M.life(T, 3.6, 5), (
            <Circulo d={D}><img src={FOTO} width={D} height={D} style={{ display: 'block' }} alt="" /></Circulo>
          ), 'f1')}
          {caja(c1, xT, 300, M.life(T, 3.4, 5, 0.2), <Nombre s={sN} p={M.draw(T, f(0.02), dur * 0.2)} />, 'n1')}
          {redes(REDES, xT + 24, 450, f(0.06), 0)}
          {caja(c1, xT + 26, 570, M.life(T, 3.4, 5, 0.5), (
            <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontWeight: 700, fontSize: 60, letterSpacing: 2, color: INK }}>
              {ARROBA}
            </div>
          ), 'a1')}
          <div style={{ position: 'absolute', left: 90, top: 700, width: 900, height: 0, borderTop: '8px dotted ' + GRY, opacity: c2.opacity }} />
          {/* Entrena con Tor: Tor sacando biceps, el nombre en dos lineas y Instagram + TikTok */}
          {caja(c2, 70, 790, M.life(T, 3.6, 5, 0.4), (
            <Circulo d={D} fondo={YEL}>
              <div style={{ position: 'absolute', left: D / 2 - 600 * 0.3, top: D * 0.54 - 590 * 0.3 }}>
                {TOR ? <TOR.Tor s={0.3} flex={flex} boca="sonrisa" sinPiso musc={{ bic: 1 }} parpadeo={global.V ? global.V.parpadeo(T, 0.7) : 0} /> : null}
              </div>
            </Circulo>
          ), 'f2')}
          {caja(c2, xT, 760, M.life(T, 3.4, 5, 0.6), <Nombre s={sN} texto="ENTRENA" p={M.draw(T, f(0.22), dur * 0.18)} />, 'n2')}
          {caja(c2, xT, 880, M.life(T, 3.4, 5, 0.8), <Nombre s={sN} texto="CON TOR" p={M.draw(T, f(0.3), dur * 0.18)} />, 'n3')}
          {redes(TOR_REDES, xT + 24, 1030, f(0.4), 0.5)}
          {caja(cta, (1080 - (16 * 30 + 110) * 1.1) / 2, 1250, M.life(T, 3.4, 5, 0.2),
            <P.Rotulo text="SÍGUEME PARA MÁS" s={1.1} />, 'c')}
        </div>
      </div>
    );
  }

  /* ---------------- accion: comenta, comparte, guarda (antes del cierre) ---------------- */

  function Boton(props) {
    // un boton redondo como los de Instagram/TikTok, con su icono adentro
    var r = props.r || 118;
    return (
      <svg width={2 * r + 40} height={2 * r + 40} viewBox={(-r - 20) + ' ' + (-r - 20) + ' ' + (2 * r + 40) + ' ' + (2 * r + 40)}
        style={{ display: 'block', overflow: 'visible' }}>
        <circle cx={0} cy={0} r={r} fill={BLANCO} stroke={INK} strokeWidth={14} />
        <g transform={'scale(' + (r / 118).toFixed(3) + ')'}>{props.children}</g>
      </svg>
    );
  }
  // globo de comentario; puntos 0..1 hace saltar los tres puntitos (escribiendo)
  function IcoComentario(props) {
    var T = props.T || 0, k = props.puntos || 0;
    return (
      <g>
        <path d="M -62 -46 Q -62 -66 -42 -66 L 42 -66 Q 62 -66 62 -46 L 62 18 Q 62 38 42 38 L -10 38 L -38 64 L -32 38 L -42 38 Q -62 38 -62 18 Z"
          fill={BLANCO} stroke={INK} strokeWidth={13} strokeLinejoin="round" />
        {[-28, 0, 28].map(function (x, i) {
          var dy = k > 0 ? -10 * Math.max(0, Math.sin(T * 10 - i * 0.9)) * k : 0;
          return <circle key={i} cx={x} cy={-14 + dy} r={9} fill={k > 0 ? YEL : INK} stroke={INK} strokeWidth={k > 0 ? 5 : 0} />;
        })}
      </g>
    );
  }
  // avion de papel (compartir); vuela 0..1 lo manda afuera y vuelve
  function IcoCompartir(props) {
    var v = props.vuela || 0;
    var dx = 140 * Math.sin(Math.PI * v), dy = -120 * Math.sin(Math.PI * v), sc = 1 - 0.4 * Math.sin(Math.PI * v);
    return (
      <g transform={'translate(' + dx.toFixed(1) + ' ' + dy.toFixed(1) + ') scale(' + sc.toFixed(3) + ')'}>
        <path d="M -66 -4 L 68 -60 L 30 66 L 4 18 Z" fill={BLANCO} stroke={INK} strokeWidth={13} strokeLinejoin="round" />
        <path d="M 4 18 L 68 -60" stroke={INK} strokeWidth={11} strokeLinecap="round" />
      </g>
    );
  }
  // marcador (guardar); lleno 0..1 lo pinta de amarillo de abajo hacia arriba
  function IcoGuardar(props) {
    var k = clamp(props.lleno || 0, 0, 1);
    var forma = 'M -46 -66 L 46 -66 Q 54 -66 54 -58 L 54 66 L 0 34 L -54 66 L -54 -58 Q -54 -66 -46 -66 Z';
    return (
      <g>
        <defs><clipPath id="marca-guardar"><path d={forma} /></clipPath></defs>
        <path d={forma} fill={BLANCO} />
        {k > 0 ? <rect x={-60} y={70 - 140 * k} width={120} height={140 * k} fill={YEL} clipPath="url(#marca-guardar)" /> : null}
        <path d={forma} fill="none" stroke={INK} strokeWidth={13} strokeLinejoin="round" />
      </g>
    );
  }
  // la mano que toca (indice estirado)
  function Mano(props) {
    var s = props.s == null ? 1 : props.s;
    return (
      <svg width={180 * s} height={220 * s} viewBox="0 0 180 220" style={{ display: 'block', overflow: 'visible' }}>
        <path d="M 62 112 L 62 26 Q 62 6 80 6 Q 98 6 98 26 L 98 92 Q 110 82 124 90 Q 136 80 150 90 Q 166 86 170 104 L 170 160 Q 170 210 118 212 L 84 212 Q 52 210 40 180 L 18 132 Q 10 114 26 108 Q 42 102 52 118 Z"
          fill={BLANCO} stroke={INK} strokeWidth={13} strokeLinejoin="round" />
        <path d="M 98 92 L 98 124 M 124 90 L 124 124 M 150 90 L 150 122" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      </svg>
    );
  }

  // el amigo al que le llega el video: un circulo con una persona; llega 0..1 lo
  // pinta de amarillo y le pone el visto verde
  function Amigo(props) {
    var k = clamp(props.llega || 0, 0, 1);
    return (
      <svg width={220} height={220} viewBox="-110 -110 220 220" style={{ display: 'block', overflow: 'visible' }}>
        <circle cx={0} cy={0} r={86} fill={k > 0 ? YEL : BLANCO} stroke={INK} strokeWidth={13} />
        <circle cx={0} cy={-24} r={28} fill={BLANCO} stroke={INK} strokeWidth={11} />
        <path d="M -50 52 Q -50 12 0 12 Q 50 12 50 52 Z" fill={BLANCO} stroke={INK} strokeWidth={11} strokeLinejoin="round" />
        {k > 0 ? (
          <g transform={'translate(64 60) scale(' + Easing.easeOutBack(k).toFixed(3) + ')'}>
            <circle cx={0} cy={0} r={32} fill={GRN} stroke={INK} strokeWidth={9} />
            <path d="M -14 1 L -3 12 L 15 -10" fill="none" stroke={BLANCO} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        ) : null}
      </svg>
    );
  }
  // punto de una curva cuadratica y su angulo (para el avion que vuela)
  function curva(a, c, b, u) {
    var v = 1 - u;
    var x = v * v * a[0] + 2 * v * u * c[0] + u * u * b[0];
    var y = v * v * a[1] + 2 * v * u * c[1] + u * u * b[1];
    var dx = 2 * v * (c[0] - a[0]) + 2 * u * (b[0] - c[0]);
    var dy = 2 * v * (c[1] - a[1]) + 2 * u * (b[1] - c[1]);
    return { x: x, y: y, ang: Math.atan2(dy, dx) * 180 / Math.PI };
  }

  // la escena: Tor saca biceps arriba, abajo tres botones que una mano toca en
  // orden (cada toque suena); al compartir sale un avion de papel que vuela hasta
  // un amigo, y al guardar el marcador se llena de amarillo
  function EscAccion(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var V = global.V, A = global.REELS.ayudas, TOR = global.TOR;
    var B3 = [[230, 1190], [540, 1190], [850, 1190]];
    var AMIGO = [880, 650];
    var toques = [0.27, 0.46, 0.74];
    var vuelo = [0.46, 0.6];
    A.sonido('pop', f(toques[0]));
    A.sonido('pop', f(toques[1]));
    A.sonido('whoosh', f(toques[1] + 0.01));
    A.sonido('pop', f(vuelo[1]));
    A.sonido('bien', f(toques[2]));
    // la mano: entra desde abajo y va de boton en boton; se queda quieta mientras toca
    var paradas = [[700, 1760]].concat(B3.map(function (b) { return [b[0] + 30, b[1] + 40]; }));
    var tramos = [[0.08, 0.24], [0.31, 0.43], [0.51, 0.71]];
    var mano = paradas[0];
    tramos.forEach(function (tr, i) {
      if (T <= f(tr[0])) return;
      var k = Easing.easeInOutCubic(clamp((T - f(tr[0])) / (f(tr[1]) - f(tr[0])), 0, 1));
      mano = [paradas[i][0] + (paradas[i + 1][0] - paradas[i][0]) * k, paradas[i][1] + (paradas[i + 1][1] - paradas[i][1]) * k];
    });
    var golpe = function (c) { var d = (T - f(c)) / 0.18; return d > 0 && d < 1 ? Math.sin(Math.PI * d) : 0; };
    var aprieta = Math.max(golpe(toques[0]), golpe(toques[1]), golpe(toques[2]));
    var flex = 0.5 + 0.5 * Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.02), end: f(0.2) })(T));
    // el avion que sale del boton de compartir y llega al amigo
    var u = Easing.easeInOutCubic(clamp((T - f(vuelo[0])) / (f(vuelo[1]) - f(vuelo[0])), 0, 1));
    var CTRL = [1010, 1080];
    var av = curva(B3[1], CTRL, AMIGO, u);
    var estela = [];
    for (var j = 0; j <= 24; j++) {
      var q = curva(B3[1], CTRL, AMIGO, u * j / 24);
      estela.push(q.x.toFixed(1) + ' ' + q.y.toFixed(1));
    }
    var llega = clamp((T - f(vuelo[1])) / 0.25, 0, 1);
    var botones = [
      <IcoComentario T={T} puntos={clamp((T - f(toques[0])) / 0.2, 0, 1)} />,
      // el avion sale del boton (vuela hasta el amigo) y despues vuelve a aparecer
      u <= 0 ? <IcoCompartir /> : u < 1 ? null : (
        <g transform={'scale(' + Easing.easeOutBack(clamp((T - f(vuelo[1])) / 0.3, 0, 1)).toFixed(3) + ')'}><IcoCompartir /></g>
      ),
      <IcoGuardar lleno={animate({ from: 0, to: 1, start: f(toques[2]), end: f(toques[2] + 0.1) })(T)} />
    ];
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} tomas={[[0, { zoom: 1.05, foco: [540, 860] }], [1, { zoom: 1.0, foco: [540, 960] }]]}
          pulsos={toques}>
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <V.Sombra c={[470, 1058]} rx={170} />
          </svg>
          <A.Pos x={170} y={300} e={M.pop(T, at - 0.6, 0.5)} dy={M.life(T, 3.6, 4) - 16 * aprieta}>
            <TOR.Tor s={0.5} flex={flex} boca="sonrisa" sinPiso musc={{ bic: 1 }} parpadeo={V.parpadeo(T)} />
          </A.Pos>
          <A.Pos x={AMIGO[0] - 110} y={AMIGO[1] - 110} e={M.pop(T, f(0.34), 0.42)} dy={M.life(T, 3, 6, 0.6)}
            esc={1 + 0.14 * Math.sin(Math.PI * clamp((T - f(vuelo[1])) / 0.3, 0, 1))}>
            <Amigo llega={llega} />
          </A.Pos>
          {B3.map(function (b, j) {
            var e = M.pop(T, f(0.04 + j * 0.06), 0.42);
            var sq = 1 - 0.12 * golpe(toques[j]);
            return (
              <A.Pos key={j} x={b[0] - 138} y={b[1] - 138} e={{ opacity: e.opacity, scale: e.scale * sq }} dy={M.life(T, 2.8, 6, j * 0.3)}>
                <Boton>{botones[j]}</Boton>
              </A.Pos>
            );
          })}
          <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            {u > 0 && llega < 1 ? (
              <path d={'M ' + estela.join(' L ')} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round"
                strokeDasharray="2 24" opacity={1 - llega} />
            ) : null}
            {u > 0 && u < 1 ? (
              <g transform={'translate(' + av.x.toFixed(1) + ' ' + av.y.toFixed(1) + ') rotate(' + (av.ang + 41).toFixed(1) + ') scale(0.8)'}>
                <path d="M -66 -4 L 68 -60 L 30 66 L 4 18 Z" fill={BLANCO} stroke={INK} strokeWidth={13} strokeLinejoin="round" />
                <path d="M 4 18 L 68 -60" stroke={INK} strokeWidth={11} strokeLinecap="round" />
              </g>
            ) : null}
            {B3.map(function (b, j) {
              return <V.Brillo key={j} T={T} c={b} r={120} v={clamp(1 - (T - f(toques[j])) / 0.6, 0, 1) * (T > f(toques[j]) ? 1 : 0)} />;
            })}
            <V.Brillo T={T} c={AMIGO} r={90} v={T > f(vuelo[1]) ? clamp(1 - (T - f(vuelo[1])) / 0.7, 0, 1) : 0} />
            <V.Chispa T={T} c={AMIGO} cuando={f(vuelo[1])} r={120} />
            <V.Chispa T={T} c={B3[2]} cuando={f(toques[2])} r={150} />
          </svg>
          <A.Pos x={mano[0]} y={mano[1]} e={M.pop(T, f(0.08), 0.3)} esc={1 - 0.1 * aprieta}>
            <Mano s={0.9} />
          </A.Pos>
        </V.Camara>
        <V.Rot T={T} text={props.pregunta || '¿ESTÁS DE ACUERDO?'} y={280} s={1.15} cuando={at - 0.6} />
        <V.Rot T={T} text="COMPÁRTELO Y GUÁRDALO" y={1450} s={1.05} cuando={f(0.46)} fase={0.4} />
      </div>
    );
  }
  function escenaAccion(op) {
    op = op || {};
    return {
      nombre: 'Comenta y comparte', dur: op.dur || 4.5,
      vo: op.vo || '¿Estás de acuerdo? Déjalo en los comentarios, compártelo con un amigo y guarda este video.',
      C: function (props) { return <EscAccion T={props.T} at={props.at} dur={props.dur} pregunta={op.pregunta} />; }
    };
  }

  global.MARCA = {
    NOMBRE: NOMBRE, ARROBA: ARROBA, REDES: REDES, TOR_NOMBRE: TOR_NOMBRE, TOR_REDES: TOR_REDES, FOTO: FOTO,
    Nombre: Nombre, Red: Red, Glifo: Glifo, Esquina: Esquina, EscMarca: EscMarca,
    Esquina2: Esquina2, EscMarca2: EscMarca2,
    // escena de accion (comenta, comparte, guarda): la suma reel.jsx antes del cierre con accion: true
    EscAccion: EscAccion, escenaAccion: escenaAccion, Mano: Mano, Boton: Boton,
    // escena lista para sumar al final de cualquier reel
    escena: {
      nombre: 'Torvick', dur: 3, C: EscMarca, marca: true,
      vo: 'Tu cierre: soy Torvick, sígueme en YouTube, Instagram y TikTok.'
    },
    // estilo 2: Torvick (con su foto) + Entrena con Tor (con Tor)
    escena2: {
      nombre: 'Torvick + Tor', dur: 3.5, C: EscMarca2, marca: true,
      vo: 'Tu cierre: sígueme en Torvick y entrena con Tor en Instagram y TikTok.'
    }
  };
})(window);
