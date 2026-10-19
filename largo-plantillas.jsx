/* ============================================================
   PLANTILLAS LARGAS — window.LARGOS.X: escenas armadas con datos
   Cada una es una escena a pantalla completa para
   LARGOS.plan.escena(ini, fin, X.Algo, props [, { entra, sale, camara }]).
   Los tiempos (c) van en segundos del video (salen de t('frase')); si faltan,
   se reparten con f(fraccion). La primera pieza siempre aparece apenas la
   escena termina de entrar: ninguna escena entra vacia.

     Frase       la frase grande con palabras resaltadas en caja amarilla (Borja)
     Numero      un numero gigante que cuenta, con su linea de contexto
     Barras      barras anchas con el numero arriba y el rotulo abajo
     Comparar    dos columnas (HOY -> MANANA, antes | ahora, mal | bien)
     Fila        iconos o monigotes en fila con conectores (-> + =)
     Balanza     dos platos que se inclinan hacia un lado
     Camino      el monigote camina hacia la diana; llega o abandona
     Progreso    barra de tiempo que avanza (la del 1:20)
     Capas       capas que se apilan (hay muchas mas capas)
     Bateria     un icono y la bateria que se carga o se vacia
     Pensamiento monigote con una nube y lo que piensa
     Alrededor   un centro y las cosas que lo rodean (factores)
     Grafico     curvas que se dibujan con rotulos
     Puntos      grilla de puntos (personas) con unos pocos encendidos
     Opciones    grilla de opciones con la activa encendida (Saenz)
     Icono       un icono grande con su titulo
     Paso        tarjeta de recomendacion numerada
   Todas aceptan encabezado: 'Texto' (rotulo amarillo arriba a la izquierda).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var L = global.LARGOS, E = L.E, mov = L.mov;
  var Easing = global.Easing, clamp = global.clamp;
  var INK = '#14110F', YEL = '#FFD400', RED = '#E03A2F', GRN = '#16A06A', BLANCO = '#FFFFFF';
  var F = L.F, F_MONO = L.F_MONO, TENUE = L.TENUE;
  var COLOR = L.COLOR;
  function col(c, d) { return COLOR[c] || c || d; }

  function reloj(props) {
    var at = props.at, dur = props.dur;
    return function (v) { return at + dur * v; };
  }

  // la escena nunca entra vacia: su primera pieza aparece apenas termina de entrar
  function ancla(c, at, margen) { return Math.min(c, at + (margen == null ? 0.15 : margen)); }

  // marco comun: fondo + empuje; dividida = la camara esta en una tarjeta a un costado,
  // el contenido se achica a la otra mitad
  function Marco(props) {
    var p = props.p;
    var hijos = props.children;
    if (p.dividida) {
      // el centro del contenido (960) pasa al centro del lado libre
      var s = 0.62, libre = p.lado === 'izq' ? 1355 : 565;
      hijos = (
        <div style={{ position: 'absolute', inset: 0, transformOrigin: '0 50%',
          transform: 'translateX(' + (libre - 960 * s).toFixed(1) + 'px) scale(' + s + ')' }}>
          {props.children}
        </div>
      );
    }
    return (
      <E.Escena T={p.T} at={p.at} dur={p.dur} fondo={p.fondo || props.fondo} dividida={p.dividida} empuje={p.empuje}>
        {p.encabezado ? <Encabezado T={p.T} c={p.at + 0.02} txt={p.encabezado} dividida={p.dividida} lado={p.lado} /> : null}
        {hijos}
      </E.Escena>
    );
  }

  // rotulo amarillo arriba a la izquierda (el titulo chico de los graficos de Borja)
  function Encabezado(props) {
    var T = props.T;
    var p = mov.prog(T, props.c, 0.5, Easing.easeOutQuart);
    var x = props.dividida && props.lado === 'izq' ? 870 : 110;
    return (
      <div style={{ position: 'absolute', left: x, top: 92, opacity: clamp((T - props.c) / 0.15, 0, 1) }}>
        <div style={{ position: 'relative', padding: '10px 22px 12px' }}>
          <div style={{ position: 'absolute', inset: 0, background: YEL, borderRadius: 8, transformOrigin: '0 50%',
            transform: 'scaleX(' + p.toFixed(4) + ')' }} />
          <div style={{ position: 'relative', fontFamily: F, fontWeight: 800, fontSize: 40, color: INK, letterSpacing: '-0.01em',
            whiteSpace: 'nowrap', clipPath: 'inset(0 ' + ((1 - p) * 100).toFixed(1) + '% 0 0)' }}>{props.txt}</div>
        </div>
      </div>
    );
  }

  // rotulo (etiqueta negra) o texto debajo de una pieza
  function Rotulo(props) {
    if (!props.txt) return null;
    if (props.estilo === 'texto') {
      return <E.Texto T={props.T} x={props.x} y={props.y} c={props.c} s={props.s} tam={props.tam || 1.1} color={props.color} peso={800}>{props.txt}</E.Texto>;
    }
    return <E.Rot T={props.T} x={props.x} y={props.y} c={props.c} s={props.s} tam={props.tam || 1} dir={props.dir || 'ninguna'}
      fondo={props.fondo} mudo={props.mudo}>{props.txt}</E.Rot>;
  }

  // icono o monigote, segun lo que traiga el item
  function Pieza(props) {
    var it = props.it, T = props.T;
    if (it.fig) {
      return <E.Figura T={T} x={props.x} y={props.y + props.tam * 0.55} c={props.c} tam={props.tam * 1.15} pose={it.fig}
        fase={it.fig === 'camina' || it.fig === 'corre' ? (T - props.c) * 1.4 : 0} espejo={it.espejo} />;
    }
    return <E.Icono T={T} n={it.n} x={props.x} y={props.y} c={props.c} tam={props.tam} acento={it.acento} rot={it.rot} />;
  }

  /* ---------------- Frase ---------------- */

  function Frase(props) {
    var T = props.T, f = reloj(props);
    var texto = String(props.texto || '');
    var lineas = texto.split('\n');
    var largo = Math.max.apply(null, lineas.map(function (l) { return l.length; }));
    var tam = props.tam || Math.min(1.45, 15 / Math.max(8, largo) * 1.25);
    var tiempos = props.tiempos ? props.tiempos.slice() : null;
    if (tiempos && tiempos.length) tiempos[0] = ancla(tiempos[0], props.at);
    var y = props.y || (props.sub ? 470 : 520);
    var alinear = props.alinear || 'centro';
    var x = alinear === 'izq' ? 150 : 960;
    return (
      <Marco p={props}>
        <E.Titulo T={T} x={x} y={y} c={ancla(props.c != null ? props.c : f(0.02), props.at)} tiempos={tiempos} tam={tam}
          marcadas={props.marcadas} ancla={alinear === 'izq' ? 'izq' : undefined} escalonado={0.09} mayus={props.mayus}
          color={props.color} italica={props.italica}>{texto}</E.Titulo>
        {props.sub ? <E.Texto T={T} x={x} y={y + 90 * tam * lineas.length * 0.55 + 70} c={props.cSub || f(0.35)} tam={1.35}
          color={TENUE} peso={700} ancla={alinear === 'izq' ? 'izq' : undefined}>{props.sub}</E.Texto> : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 960} y={props.rotulo.y || 860}
          c={props.rotulo.c || f(0.4)} dir={props.rotulo.dir || 'ninguna'} tam={props.rotulo.tam || 1.1} fondo={props.rotulo.fondo} /> : null}
        {(props.iconos || []).map(function (it, i) {
          return <Pieza key={i} T={T} it={it} x={it.x} y={it.y} c={it.c || f(0.15 + 0.1 * i)} tam={it.tam || 200} />;
        })}
        {props.tachar ? <E.Tachon T={T} x={props.tachar.x || 960} y={props.tachar.y || y} w={props.tachar.w || 900} c={props.tachar.c} /> : null}
      </Marco>
    );
  }

  /* ---------------- Numero ---------------- */

  function Numero(props) {
    var T = props.T, f = reloj(props);
    var c = ancla(props.c != null ? props.c : f(0.02), props.at);
    var esNum = typeof props.valor === 'number';
    var y = props.sub ? 480 : 540;
    return (
      <Marco p={props}>
        {esNum ? (
          <E.Num T={T} x={960} y={y} c={c} desde={props.desde || 0} hasta={props.valor} tam={props.tam || 2} prefijo={props.prefijo}
            sufijo={props.sufijo} decimales={props.decimales} dur={props.durCuenta || 1.4} color={props.color} />
        ) : (
          <E.Titulo T={T} x={960} y={y} c={c} tam={props.tam || 3} marcarTodo={props.marcar} quieto>{String(props.valor)}</E.Titulo>
        )}
        {props.sub ? <E.Titulo T={T} x={960} y={y + 200 * (props.tam || 2) / 2 + 40} c={props.cSub || c + 0.4} tam={0.62} peso={800}
          marcadas={props.marcadas}>{props.sub}</E.Titulo> : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 960} y={props.rotulo.y || 900} c={props.rotulo.c || f(0.5)}
          dir={props.rotulo.dir} fondo={props.rotulo.fondo} /> : null}
      </Marco>
    );
  }

  /* ---------------- Barras ---------------- */

  function Barras(props) {
    var T = props.T, f = reloj(props);
    var barras = (props.barras || []).map(function (b, i) {
      return Object.assign({}, b, { c: b.c != null ? (i === 0 ? ancla(b.c, props.at, 0.3) : b.c) : f(0.06 + 0.4 * i / Math.max(1, props.barras.length)) });
    });
    var n = barras.length;
    var ancho = props.ancho || (n > 6 ? 90 : n > 3 ? 150 : 230);
    var sep = props.sep || (n > 6 ? 36 : n > 3 ? 70 : 110);
    return (
      <Marco p={props}>
        <E.Barras T={T} x={960} y={props.base || 860} h={props.alto || 520} barras={barras} max={props.max} ancho={ancho} sep={sep}
          c={barras.length ? barras[0].c - 0.1 : f(0.05)} fsNum={n > 6 ? 40 : n > 3 ? 60 : 80} fsTxt={n > 6 ? 26 : 38} />
        {props.nota ? <E.Texto T={T} x={1800} y={985} c={f(0.3)} mono tam={0.6} color={TENUE} ancla="der">{props.nota}</E.Texto> : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x} y={props.rotulo.y} c={props.rotulo.c}
          dir={props.rotulo.dir} fondo={props.rotulo.fondo} /> : null}
        {props.extra ? props.extra(T) : null}
      </Marco>
    );
  }

  /* ---------------- Comparar ---------------- */

  function Columna(props) {
    var T = props.T, d = props.d, x = props.x, c = props.c;
    var color = col(d.color, INK);
    var hayIco = !!(d.n || d.fig), tamI = d.tamIco || 250;
    return (
      <React.Fragment>
        {d.titulo ? <E.Titulo T={T} x={x} y={props.yTit} c={c} tam={d.tam || 1.25} color={color} quieto>{d.titulo}</E.Titulo> : null}
        {d.arriba ? <E.Texto T={T} x={x} y={props.yTit - 105 * (d.tam || 1.25) * 0.75} c={c} mono mayus tam={0.72} color={TENUE}>{d.arriba}</E.Texto> : null}
        {d.n || d.fig ? <Pieza T={T} it={d} x={x} y={props.yIco} c={d.cIco || c + 0.2} tam={d.tamIco || 250} /> : null}
        {d.txt ? <Rotulo T={T} txt={d.txt} x={x} y={props.yTxt} c={d.cTxt || c + 0.35} tam={1.05} fondo={d.fondoTxt} /> : null}
        {(d.items || []).map(function (it, i) {
          var ci = it.c != null ? it.c : c + 0.3 + 0.25 * i;
          return <E.Texto key={i} T={T} x={x} y={props.yIco - 60 + i * 70} c={ci} tam={1.1} peso={700} color={it.color}>{it.texto}</E.Texto>;
        })}
        {d.mal ? <E.Tacha T={T} x={hayIco ? x + tamI * 0.48 : x + 200} y={hayIco ? props.yIco - tamI * 0.42 : props.yTit - 80} c={d.mal} tam={100} /> : null}
        {d.bien ? <E.Check T={T} x={hayIco ? x + tamI * 0.48 : x + 200} y={hayIco ? props.yIco - tamI * 0.42 : props.yTit - 80} c={d.bien} tam={100} /> : null}
      </React.Fragment>
    );
  }

  function Comparar(props) {
    var T = props.T, f = reloj(props);
    var izq = props.izq || {}, der = props.der || {};
    var cI = ancla(izq.c != null ? izq.c : f(0.03), props.at);
    var cD = der.c != null ? der.c : f(0.4);
    var cCon = props.cCon != null ? props.cCon : (cI + cD) / 2;
    var xI = props.xIzq || 520, xD = props.xDer || 1400;
    var soloTitulos = !izq.n && !izq.fig && !der.n && !der.fig;
    var yTit = props.yTit || (soloTitulos ? 470 : 250);
    var yIco = props.yIco || 560, yTxt = props.yTxt || 830;
    var con = props.conector || 'flecha';
    return (
      <Marco p={props}>
        <Columna T={T} d={izq} x={xI} c={cI} yTit={yTit} yIco={yIco} yTxt={yTxt} />
        <Columna T={T} d={der} x={xD} c={cD} yTit={yTit} yIco={yIco} yTxt={yTxt} />
        {con === 'flecha' ? <E.Flecha T={T} de={[xI + 230, soloTitulos ? yTit : yIco]} a={[xD - 230, soloTitulos ? yTit : yIco]} c={cCon} grosor={9} curva={props.curva || 0} /> : null}
        {con === 'linea' ? <E.Linea T={T} de={[960, 170]} a={[960, 930]} c={cCon} grosor={5} color={TENUE} /> : null}
        {con === 'vs' ? <E.Texto T={T} x={960} y={yIco} c={cCon} tam={2.2} peso={900} color={TENUE}>vs</E.Texto> : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 960} y={props.rotulo.y || 975} c={props.rotulo.c || f(0.6)}
          dir={props.rotulo.dir} fondo={props.rotulo.fondo} /> : null}
      </Marco>
    );
  }

  /* ---------------- Fila ---------------- */

  function Fila(props) {
    var T = props.T, f = reloj(props);
    var items = props.items || [];
    var n = items.length;
    var ancho = props.ancho || (n >= 4 ? 1600 : n === 3 ? 1440 : n === 2 ? 1100 : 600);
    var paso = ancho / Math.max(1, n);
    var x0 = 960 - ancho / 2;
    var y = props.y || 500;
    var tam = props.tam || (n >= 4 ? 230 : n === 3 ? 270 : 320);
    var cs = items.map(function (it, i) { return it.c != null ? it.c : f(0.04 + 0.62 * i / Math.max(1, n)); });
    if (n) cs[0] = ancla(cs[0], props.at, props.encabezado ? 0.5 : 0.15);
    var con = props.con;
    return (
      <Marco p={props}>
        {items.map(function (it, i) {
          var x = x0 + paso * (i + 0.5);
          var c = cs[i];
          var conector = Array.isArray(con) ? con[i - 1] : con;
          var cc = i > 0 ? Math.max(cs[i - 1] + 0.15, c - 0.25) : 0;
          return (
            <React.Fragment key={i}>
              <Pieza T={T} it={it} x={x} y={y} c={c} tam={it.tam || tam} />
              <Rotulo T={T} txt={it.txt} x={x} y={y + tam * 0.5 + 90} c={c + 0.2} tam={n >= 4 ? 0.9 : 1.05} fondo={it.fondo} />
              {it.tacha ? <E.Tacha T={T} x={x + tam * 0.36} y={y - tam * 0.36} c={it.tacha} tam={96} /> : null}
              {it.check ? <E.Check T={T} x={x + tam * 0.36} y={y - tam * 0.36} c={it.check} tam={96} /> : null}
              {i > 0 && conector === '→' ? <E.Flecha T={T} de={[x - paso + tam * 0.55, y]} a={[x - tam * 0.55, y]} c={cc} grosor={8} /> : null}
              {i > 0 && conector && conector !== '→' ? <E.Texto T={T} x={x - paso / 2} y={y} c={cc} tam={2.4} peso={900} color={TENUE}>{conector}</E.Texto> : null}
            </React.Fragment>
          );
        })}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 960} y={props.rotulo.y || 960} c={props.rotulo.c || f(0.7)}
          dir={props.rotulo.dir} fondo={props.rotulo.fondo} /> : null}
      </Marco>
    );
  }

  /* ---------------- Balanza ---------------- */

  function Balanza(props) {
    var T = props.T, f = reloj(props);
    var izq = props.izq || {}, der = props.der || {};
    var cI = ancla(izq.c != null ? izq.c : f(0.05), props.at, 0.3);
    var cD = der.c != null ? der.c : f(0.3);
    var cG = props.cGira != null ? props.cGira : f(0.55);
    var giro = (props.hacia === 'der' ? 1 : -1) * 13 * mov.prog(T, cG, 1.0, Easing.easeOutBack);
    var cx = 960, cy = 330, brazo = 470;
    var rad = giro * Math.PI / 180;
    var pI = [cx - brazo * Math.cos(rad), cy - brazo * Math.sin(rad)];
    var pD = [cx + brazo * Math.cos(rad), cy + brazo * Math.sin(rad)];
    var pb = mov.prog(T, props.at - 0.1, 0.8, Easing.easeInOutCubic);
    var plato = function (p, d, c, i) {
      var yPlato = p[1] + 300;
      return (
        <React.Fragment key={i}>
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
            <path d={'M ' + p[0] + ' ' + p[1] + ' L ' + (p[0] - 175) + ' ' + yPlato + ' M ' + p[0] + ' ' + p[1] + ' L ' + (p[0] + 175) + ' ' + yPlato}
              stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pb} />
            <path d={'M ' + (p[0] - 190) + ' ' + yPlato + ' Q ' + p[0] + ' ' + (yPlato + 90) + ' ' + (p[0] + 190) + ' ' + yPlato + ' Z'}
              fill={d.acento ? col(d.acento) : BLANCO} stroke={INK} strokeWidth={7} strokeLinejoin="round" opacity={pb} />
          </svg>
          {d.n || d.fig ? <Pieza T={T} it={d} x={p[0]} y={yPlato - (d.tam || 150) * 0.42} c={c} tam={d.tam || 150} /> : null}
          {d.cosas ? d.cosas.map(function (k, j) {
            return <E.Icono key={j} T={T} n={k.n} x={p[0] + (j - (d.cosas.length - 1) / 2) * 110} y={yPlato - 52 - Math.floor(j / 3) * 90} c={k.c || c + 0.2 * j} tam={k.tam || 120} quieto />;
          }) : null}
          <Rotulo T={T} txt={d.txt} x={p[0]} y={yPlato + 130} c={c + 0.25} fondo={d.fondoTxt} />
        </React.Fragment>
      );
    };
    return (
      <Marco p={props}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d={'M ' + cx + ' 940 L ' + cx + ' ' + cy} stroke={INK} strokeWidth={9} strokeLinecap="round" pathLength={1}
            strokeDasharray="1 1" strokeDashoffset={1 - pb} />
          <path d={'M ' + (cx - 160) + ' 940 L ' + (cx + 160) + ' 940'} stroke={INK} strokeWidth={9} strokeLinecap="round" pathLength={1}
            strokeDasharray="1 1" strokeDashoffset={1 - pb} />
          <path d={'M ' + pI[0] + ' ' + pI[1] + ' L ' + pD[0] + ' ' + pD[1]} stroke={INK} strokeWidth={9} strokeLinecap="round" opacity={pb} />
          <circle cx={cx} cy={cy} r={16} fill={YEL} stroke={INK} strokeWidth={7} opacity={pb} />
        </svg>
        {plato(pI, izq, cI, 0)}
        {plato(pD, der, cD, 1)}
      </Marco>
    );
  }

  /* ---------------- Camino ---------------- */

  // el monigote camina hacia la meta. final: 'llega' (festeja, visto) | 'abandona' (cae, X)
  function Camino(props) {
    var T = props.T, f = reloj(props);
    var cIni = ancla(props.cInicio != null ? props.cInicio : f(0.02), props.at);
    var cObs = props.cObstaculo != null ? props.cObstaculo : f(0.4);
    var cFin = props.cFinal != null ? props.cFinal : f(0.7);
    var suelo = 760, x0 = 260, xMeta = 1600, xObs = props.obstaculo ? 980 : null;
    var final = props.final || 'llega';
    var xTope = final === 'abandona' && xObs ? xObs - 190 : xMeta - 220;
    var tLlega = final === 'abandona' && xObs ? cObs : cFin;
    var k = clamp((T - cIni) / Math.max(0.4, tLlega - cIni), 0, 1);
    var x = x0 + (xTope - x0) * Easing.easeInOutSine(k);
    var pose, fase = (T - cIni) * 1.6;
    if (T < tLlega) pose = props.corre ? 'corre' : 'camina';
    else if (final === 'abandona') pose = { de: 'empuja', a: 'caido', k: clamp((T - cFin) / 0.45, 0, 1) };
    else pose = { de: 'depie', a: 'brazos', k: clamp((T - cFin) / 0.35, 0, 1) };
    if (final === 'abandona' && T >= tLlega && T < cFin) pose = 'empuja';
    return (
      <Marco p={props}>
        <E.Linea T={T} de={[140, suelo]} a={[1780, suelo]} c={props.at - 0.15} grosor={5} color={TENUE} />
        <E.Figura T={T} x={x} y={suelo} c={cIni} tam={330} pose={pose} fase={fase} />
        {xObs ? <E.Icono T={T} n={props.obstaculo === true ? 'bloque' : props.obstaculo} x={xObs} y={suelo - 90} c={cObs - 0.3} tam={190} quieto /> : null}
        <E.Icono T={T} n={props.meta || 'diana'} x={xMeta} y={suelo - 150} c={props.cMeta || cIni + 0.1} tam={300} />
        {props.precio ? <E.Rot T={T} x={xMeta - 30} y={suelo - 360} c={props.cPrecio || cIni + 0.5} dir="ninguna" tam={1.1}>{props.precio}</E.Rot> : null}
        {final === 'abandona' ? <E.Tacha T={T} x={xMeta + 130} y={suelo - 300} c={cFin + 0.3} tam={110} /> : <E.Check T={T} x={xMeta + 130} y={suelo - 300} c={cFin + 0.2} tam={110} />}
        {(props.rotulos || []).map(function (r, i) {
          return <Rotulo key={i} T={T} txt={r.txt} x={r.x || 960} y={r.y || 900} c={r.c} dir={r.dir} fondo={r.fondo} tam={r.tam || 1.05} />;
        })}
      </Marco>
    );
  }

  /* ---------------- Progreso ---------------- */

  function Progreso(props) {
    var T = props.T, f = reloj(props);
    var cIni = ancla(props.cInicio != null ? props.cInicio : f(0.03), props.at);
    var cFin = props.cFin != null ? props.cFin : f(0.75);
    var x0 = 300, x1 = 1520, y = props.y || 520;
    var hasta = props.hasta == null ? 1 : props.hasta;
    var p = (props.desde || 0) + (hasta - (props.desde || 0)) * Easing.easeInOutCubic(clamp((T - cIni - 0.2) / Math.max(0.3, cFin - cIni - 0.2), 0, 1));
    var en = mov.entra(T, cIni, { dy: 20 });
    var xh = x0 + (x1 - x0) * p;
    return (
      <Marco p={props}>
        <div style={{ position: 'absolute', left: x0, top: y - 22, width: x1 - x0, height: 44, borderRadius: 22, background: 'rgba(20,17,15,0.1)',
          opacity: en.opacity, transform: 'translateY(' + en.y + 'px)' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (p * 100).toFixed(2) + '%', borderRadius: 22, background: col(props.color, YEL) }} />
        </div>
        <div style={{ position: 'absolute', left: xh, top: y - 150, transform: 'translateX(-50%)', opacity: en.opacity, textAlign: 'center' }}>
          <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 40, color: INK }}>{props.etiqueta ? props.etiqueta(p) : Math.round(p * 100) + '%'}</div>
          <div style={{ width: 6, height: 70, background: INK, margin: '10px auto 0', borderRadius: 3 }} />
        </div>
        {props.check ? <E.Check T={T} x={x1 + 140} y={y} c={props.check} tam={120} /> : null}
        {props.tacha ? <E.Tacha T={T} x={x1 + 140} y={y} c={props.tacha} tam={120} /> : null}
        {props.izq ? <E.Texto T={T} x={x0} y={y + 80} c={cIni + 0.1} mono mayus tam={0.8} color={TENUE} ancla="izq">{props.izq}</E.Texto> : null}
        {props.der ? <E.Texto T={T} x={x1} y={y + 80} c={cIni + 0.2} mono mayus tam={0.8} color={TENUE} ancla="der">{props.der}</E.Texto> : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 960} y={props.rotulo.y || 760} c={props.rotulo.c || f(0.6)}
          dir={props.rotulo.dir} fondo={props.rotulo.fondo} tam={1.15} /> : null}
        {props.n ? <E.Icono T={T} n={props.n} x={props.xIco || 960} y={props.yIco || 270} c={props.cIco || cIni} tam={props.tamIco || 200} /> : null}
      </Marco>
    );
  }

  /* ---------------- Capas ---------------- */

  function Capas(props) {
    var T = props.T, f = reloj(props);
    var n = props.n || 5;
    var c0 = ancla(props.c != null ? props.c : f(0.03), props.at);
    var cMas = props.cMas != null ? props.cMas : f(0.45);
    var x = props.dosPilas === false ? 960 : 620;
    var bloque = function (cx, y, i, c, color, w) {
      var p = mov.prog(T, c, 0.55, Easing.easeOutBack);
      if (p <= 0) return null;
      return <div key={cx + ':' + i} style={{ position: 'absolute', left: cx - w / 2, top: y - 34, width: w, height: 68, borderRadius: 14,
        background: color, transform: 'translateY(' + ((1 - p) * -60).toFixed(1) + 'px) scaleX(' + (0.6 + 0.4 * p).toFixed(3) + ')',
        opacity: clamp((T - c) / 0.15, 0, 1), boxShadow: L.SOMBRA_CHICA }} />;
    };
    var izq = [bloque(x, 520, 0, c0, YEL, 360), bloque(x, 610, 1, c0 + 0.2, '#C9C3B8', 360)];
    var der = [];
    if (props.dosPilas !== false) {
      for (var i = 0; i < n; i++) der.push(bloque(1380, 300 + i * 100, i, cMas + 0.15 + i * 0.12, i === 0 ? YEL : '#C9C3B8', 360));
    }
    return (
      <Marco p={props}>
        {izq}
        {der}
        {props.dosPilas !== false ? <E.Flecha T={T} de={[870, 560]} a={[1140, 560]} c={cMas} grosor={9} /> : null}
        {props.izqTxt ? <Rotulo T={T} txt={props.izqTxt} x={x} y={720} c={c0 + 0.4} /> : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 1380} y={props.rotulo.y || 870} c={props.rotulo.c || cMas + 0.5}
          dir={props.rotulo.dir} fondo={props.rotulo.fondo} /> : null}
      </Marco>
    );
  }

  /* ---------------- Bateria ---------------- */

  function BateriaGrande(props) {
    var T = props.T;
    var nivel = props.nivel;
    var color = nivel < 0.25 ? RED : nivel < 0.55 ? YEL : props.verde ? GRN : YEL;
    var en = mov.entra(T, props.c, { dy: 30 });
    return (
      <E.Pos x={props.x} y={props.y} e={en} dy={mov.deriva(T, 0.3, 2)}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 420, height: 200, borderRadius: 40, border: '12px solid ' + INK, padding: 18, background: BLANCO, boxSizing: 'border-box' }}>
            <div style={{ height: '100%', width: (Math.max(0.03, nivel) * 100).toFixed(1) + '%', background: color, borderRadius: 18 }} />
          </div>
          <div style={{ width: 26, height: 80, background: INK, borderRadius: '0 12px 12px 0' }} />
        </div>
      </E.Pos>
    );
  }

  function Bateria(props) {
    var T = props.T, f = reloj(props);
    var c0 = ancla(props.c != null ? props.c : f(0.03), props.at);
    var cCambio = props.cCambio != null ? props.cCambio : f(0.4);
    var desde = props.desde == null ? 1 : props.desde;
    var hasta = props.hasta == null ? 0.1 : props.hasta;
    var nivel = desde + (hasta - desde) * Easing.easeInOutCubic(clamp((T - cCambio) / (props.durCambio || 1.2), 0, 1));
    var hayIco = props.n || props.fig;
    return (
      <Marco p={props}>
        {hayIco ? <Pieza T={T} it={props} x={560} y={520} c={c0} tam={props.tamIco || 330} /> : null}
        {props.n2 ? <E.Icono T={T} n={props.n2} x={props.x2 || 330} y={props.y2 || 700} c={props.c2 || c0 + 0.3} tam={props.tam2 || 200} /> : null}
        <BateriaGrande T={T} x={hayIco ? 1320 : 960} y={520} c={c0 + (hayIco ? 0.25 : 0)} nivel={nivel} verde={props.verde} />
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || (hayIco ? 1320 : 960)} y={props.rotulo.y || 720}
          c={props.rotulo.c || cCambio} dir={props.rotulo.dir} fondo={props.rotulo.fondo} tam={1.1} /> : null}
      </Marco>
    );
  }

  /* ---------------- Pensamiento ---------------- */

  function Pensamiento(props) {
    var T = props.T, f = reloj(props);
    var c0 = ancla(props.c != null ? props.c : f(0.02), props.at);
    var cN = props.cNube != null ? props.cNube : c0 + 0.35;
    var x = props.x || 520;
    var piensa = props.piensa || [];
    return (
      <Marco p={props}>
        <E.Figura T={T} x={x} y={860} c={c0} tam={380} pose={props.pose || 'piensa'} />
        <E.Icono T={T} n="nube" x={x + 250} y={300} c={cN} tam={360} acento={props.acento} quieto />
        {piensa.length ? piensa.slice(0, 1).map(function (it, i) {
          return <E.Icono key={i} T={T} n={it.n} x={x + 255} y={292} c={it.c || cN + 0.35} tam={it.tam || 130} />;
        }) : null}
        {(props.lado || []).map(function (it, i) {
          return <Pieza key={i} T={T} it={it} x={it.x || 1350 + (i % 2) * 260} y={it.y || 430 + Math.floor(i / 2) * 260} c={it.c || f(0.4 + 0.12 * i)} tam={it.tam || 210} />;
        })}
        {(props.rotulos || []).map(function (r, i) {
          return <Rotulo key={i} T={T} txt={r.txt} x={r.x || 1400} y={r.y || 300} c={r.c} dir={r.dir || 'izq'} fondo={r.fondo} tam={r.tam || 1.05} />;
        })}
      </Marco>
    );
  }

  /* ---------------- Alrededor ---------------- */

  function Alrededor(props) {
    var T = props.T, f = reloj(props);
    var items = props.items || [];
    var c0 = ancla(props.c != null ? props.c : f(0.02), props.at);
    var cx = 960, cy = 560, rx = 640, ry = 330;
    return (
      <Marco p={props}>
        {props.centro ? <Pieza T={T} it={props.centro} x={cx} y={cy} c={c0} tam={props.centro.tam || 300} /> : null}
        {items.map(function (it, i) {
          var a = -Math.PI / 2 + (i + 0.5) * 2 * Math.PI / items.length;
          var x = cx + rx * Math.cos(a), y = cy + ry * Math.sin(a);
          var c = it.c != null ? it.c : f(0.15 + 0.6 * i / Math.max(1, items.length));
          return (
            <React.Fragment key={i}>
              <E.Linea T={T} de={[cx + 190 * Math.cos(a), cy + 150 * Math.sin(a)]} a={[x - 120 * Math.cos(a), y - 50 * Math.sin(a)]}
                c={c - 0.1} grosor={4} color={TENUE} punteada />
              {it.n ? <E.Icono T={T} n={it.n} x={x} y={y - 60} c={c} tam={130} /> : null}
              <Rotulo T={T} txt={it.txt} x={x} y={it.n ? y + 50 : y} c={c + 0.1} tam={1} fondo={it.fondo} />
            </React.Fragment>
          );
        })}
      </Marco>
    );
  }

  /* ---------------- Grafico ---------------- */

  function Grafico(props) {
    var T = props.T, f = reloj(props);
    var c = ancla(props.c != null ? props.c : f(0.02), props.at);
    var x0 = 300, y0 = 860, w = 1300, h = 560;
    return (
      <Marco p={props}>
        <E.Grafico T={T} x={x0} y={y0} w={w} h={h} c={c} ejeX={props.ejeX} ejeY={props.ejeY}
          curvas={(props.curvas || []).map(function (cv) { return Object.assign({}, cv, { c: cv.c != null ? cv.c : c + 0.2 }); })} />
        {(props.rotulos || []).map(function (r, i) {
          return <Rotulo key={i} T={T} txt={r.txt} x={x0 + r.x * w} y={y0 - r.y * h} c={r.c} dir={r.dir || 'ninguna'} fondo={r.fondo} tam={r.tam || 1} />;
        })}
        {(props.iconos || []).map(function (it, i) {
          return <E.Icono key={i} T={T} n={it.n} x={it.px != null ? x0 + it.px * w : it.x} y={it.py != null ? y0 - it.py * h : it.y} c={it.c} tam={it.tam || 150} />;
        })}
      </Marco>
    );
  }

  /* ---------------- Puntos ---------------- */

  function Puntos(props) {
    var T = props.T, f = reloj(props);
    var c = ancla(props.c != null ? props.c : f(0.02), props.at);
    return (
      <Marco p={props}>
        <E.Puntos T={T} x={props.x || 960} y={props.y || 540} n={props.n || 120} cols={props.cols || 20} paso={props.paso || 64} r={props.r || 22}
          c={c} dur={props.durAparece || 0.9} encendidos={props.encendidos} cEnciende={props.cEnciende} color={props.color} />
        {props.leyenda ? <E.Texto T={T} x={props.x || 960} y={props.yLeyenda || 960} c={c + 0.5} mono tam={0.9} color={TENUE}>{props.leyenda}</E.Texto> : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 960} y={props.rotulo.y || 960} c={props.rotulo.c || props.cEnciende}
          dir={props.rotulo.dir} fondo={props.rotulo.fondo} tam={1.1} /> : null}
      </Marco>
    );
  }

  /* ---------------- Opciones ---------------- */

  function Opciones(props) {
    var T = props.T, f = reloj(props);
    var c = ancla(props.c != null ? props.c : f(0.02), props.at);
    var items = props.items || [];
    var cols = props.cols || (items.length <= 4 ? items.length : 3);
    var filas = Math.ceil(items.length / cols);
    var titulo = props.titulo;
    return (
      <Marco p={props}>
        {titulo ? <E.Titulo T={T} x={960} y={filas > 1 ? 160 : 230} c={c} tam={0.9} quieto marcadas={props.marcadas}>{titulo}</E.Titulo> : null}
        <E.Opciones T={T} x={960} y={props.y || (filas > 1 ? 400 : 560)} w={1680} cols={cols} items={items.map(function (it, i) {
          return Object.assign({}, it, { c: it.c != null ? (i === 0 ? ancla(it.c, props.at, 0.3) : it.c) : c + 0.12 + 0.1 * i });
        })} activo={props.activo} cActivo={props.cActivo} altoFila={props.altoFila || 300} fs={props.fs || (cols >= 4 ? 50 : 60)} prefijo={props.prefijo || 'Punto '}
          etiquetasDesde={props.etiquetasDesde != null ? Math.min(props.etiquetasDesde, c) : undefined} />
      </Marco>
    );
  }

  /* ---------------- Icono ---------------- */

  function Icono(props) {
    var T = props.T, f = reloj(props);
    var c = ancla(props.c != null ? props.c : f(0.02), props.at);
    var conTitulo = !!props.titulo;
    return (
      <Marco p={props}>
        <Pieza T={T} it={props} x={conTitulo ? 600 : 960} y={520} c={c} tam={props.tam || 420} />
        {conTitulo ? <E.Titulo T={T} x={980} y={props.sub ? 470 : 520} c={props.cTitulo || c + 0.25} ancla="izq" tam={props.tamTitulo || 1.15}
          marcadas={props.marcadas} ancho={820}>{props.titulo}</E.Titulo> : null}
        {props.sub ? <E.Texto T={T} x={984} y={640} c={props.cSub || c + 0.5} tam={1.2} color={TENUE} ancla="izq" peso={700}>{props.sub}</E.Texto> : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || (conTitulo ? 600 : 960)} y={props.rotulo.y || 860}
          c={props.rotulo.c || f(0.4)} dir={props.rotulo.dir} fondo={props.rotulo.fondo} tam={1.1} /> : null}
        {props.tacha ? <E.Tacha T={T} x={(conTitulo ? 600 : 960) + 170} y={340} c={props.tacha} tam={120} /> : null}
        {props.check ? <E.Check T={T} x={(conTitulo ? 600 : 960) + 170} y={340} c={props.check} tam={120} /> : null}
      </Marco>
    );
  }

  /* ---------------- Paso ---------------- */

  // tarjeta de recomendacion: franja de tinta con "PASO n" y el titulo enorme
  function Paso(props) {
    var T = props.T, f = reloj(props);
    var c = ancla(props.c != null ? props.c : f(0.02), props.at);
    var titulo = String(props.titulo || '');
    var largo = Math.max.apply(null, titulo.split('\n').map(function (l) { return l.length; }));
    var fs = Math.min(1.9, 22 / Math.max(6, largo));
    return (
      <Marco p={props}>
        <E.Tarjeta T={T} x={960} y={540} c={c} w={1380} h={660} radio={40} giroY={0}>
          <div style={{ height: 96, background: INK, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: F_MONO, fontWeight: 600, fontSize: 38, letterSpacing: '0.2em', color: BLANCO }}>
            {(props.etiqueta || 'PASO') + ' ' + (props.n != null ? props.n : '')}
          </div>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 96, bottom: props.sub ? 130 : 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <E.Palabras T={T} txt={titulo} c={c + 0.3} fs={96 * fs} peso={900} marcadas={props.marcadas} escalonado={0.07} />
          </div>
          {props.sub ? <div style={{ position: 'absolute', left: 0, right: 0, bottom: 56, textAlign: 'center', fontFamily: F, fontWeight: 700,
            fontSize: 44, color: TENUE, opacity: clamp((T - c - 0.7) / 0.3, 0, 1) }}>{props.sub}</div> : null}
          <div style={{ position: 'absolute', left: 300, right: 300, bottom: 26, height: 8, borderRadius: 4, background: 'rgba(20,17,15,0.08)' }}>
            <div style={{ height: '100%', borderRadius: 4, background: YEL, width: (100 * mov.prog(T, c + 0.4, Math.max(1, props.dur * 0.8), Easing.easeInOutSine)).toFixed(1) + '%' }} />
          </div>
        </E.Tarjeta>
        {props.n2 ? <E.Icono T={T} n={props.n2} x={1600} y={230} c={c + 0.5} tam={200} rot={8} /> : null}
      </Marco>
    );
  }


  /* ---------------- Multitud ---------------- */

  // grilla de monigotes grises; los destacados [{ i, c }] pasan a tinta con anillo amarillo
  function Multitud(props) {
    var T = props.T, f = reloj(props);
    var cols = props.cols || 8, filas = props.filas || 3;
    var c0 = ancla(props.c != null ? props.c : f(0.01), props.at);
    var w = props.w || 1400, h = props.h || 620;
    var x0 = (props.x || 960) - w / 2, y0 = (props.y || 560) - h / 2;
    var pasoX = w / cols, pasoY = h / filas;
    var tam = Math.min(pasoY * 0.92, pasoX * 1.3);
    var dest = {};
    (props.destacados || []).forEach(function (d) { dest[d.i] = d; });
    var out = [];
    for (var i = 0; i < cols * filas; i++) {
      var x = x0 + pasoX * (i % cols + 0.5), y = y0 + pasoY * (Math.floor(i / cols) + 1) - 10;
      var d = dest[i];
      var cI = c0 + 0.35 * (i / (cols * filas));
      var activo = d && T >= d.c;
      var pa = d ? mov.prog(T, d.c, 0.5, Easing.easeOutBack) : 0;
      out.push(
        <React.Fragment key={i}>
          {d && pa > 0 ? (
            <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              <circle cx={x} cy={y - tam * 0.5} r={tam * 0.62 * pa} fill="none" stroke={YEL} strokeWidth={12} />
            </svg>
          ) : null}
          <E.Figura T={T} x={x} y={y} c={cI} tam={activo ? tam * (1 + 0.12 * pa) : tam} color={activo ? INK : '#C9C3B8'}
            pose={activo && d.pose ? d.pose : (props.pose || 'depie')} grosor={activo ? 8 : 6} />
        </React.Fragment>
      );
    }
    return (
      <Marco p={props}>
        {out}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 960} y={props.rotulo.y || 960} c={props.rotulo.c || f(0.6)}
          dir={props.rotulo.dir} fondo={props.rotulo.fondo} tam={1.15} /> : null}
        {props.extra ? props.extra(T) : null}
      </Marco>
    );
  }

  /* ---------------- Tareas ---------------- */

  // tarjeta de lista: casilla + texto por renglon; check (visto verde), tacha (linea),
  // orden + cOrden (los renglones se reacomodan). derecha(T) dibuja lo que va al lado.
  function Tareas(props) {
    var T = props.T, f = reloj(props);
    var items = props.items || [];
    var c0 = ancla(props.c != null ? props.c : f(0.01), props.at);
    var x = props.x || 560, y = props.y || 540, w = props.w || 760;
    var alto = props.altoFila || 104;
    var arriba = props.titulo ? 110 : 40;
    var hTot = arriba + items.length * alto + 40;
    var kO = props.orden ? Easing.easeInOutCubic(clamp((T - props.cOrden) / 0.9, 0, 1)) : 0;
    return (
      <Marco p={props}>
        <E.Tarjeta T={T} x={x} y={y} c={c0} w={w} h={hTot} radio={30} giroY={8}>
          {props.titulo ? <div style={{ position: 'absolute', left: 48, top: 40, fontFamily: F_MONO, fontWeight: 600, fontSize: 30,
            letterSpacing: '0.14em', color: TENUE, textTransform: 'uppercase' }}>{props.titulo}</div> : null}
          {items.map(function (it, i) {
            var yA = arriba + i * alto, yB = props.orden ? arriba + props.orden.indexOf(i) * alto : yA;
            var yy = yA + (yB - yA) * kO + (props.orden && yB !== yA ? Math.sin(Math.PI * kO) * (yB < yA ? -18 : 18) : 0);
            var cI = it.c != null ? it.c : c0 + 0.15 + 0.12 * i;
            var en = mov.entra(T, cI, { dy: 16, blur: 6, dx: -20 });
            var pc = it.check != null ? mov.prog(T, it.check, 0.35, Easing.easeInOutCubic) : 0;
            var pt = it.tacha != null ? mov.prog(T, it.tacha, 0.3, Easing.easeOutQuart) : 0;
            var color = it.color ? col(it.color) : null;
            return (
              <div key={i} style={{ position: 'absolute', left: 48, right: 48, top: yy, height: alto - 22, display: 'flex', alignItems: 'center', gap: 26,
                opacity: en.opacity, transform: 'translateX(' + en.x.toFixed(1) + 'px)', filter: en.blur > 0.2 ? 'blur(' + en.blur.toFixed(1) + 'px)' : undefined }}>
                <svg width={58} height={58} viewBox="0 0 58 58" style={{ flex: 'none', overflow: 'visible' }}>
                  <rect x={4} y={4} width={50} height={50} rx={12} fill={pc > 0 ? GRN : BLANCO} fillOpacity={pc > 0 ? clamp(pc * 3, 0, 1) : 1} stroke={pc > 0 ? GRN : INK} strokeWidth={6} />
                  {pc > 0 ? <path d="M 16 30 L 25 39 L 43 20" fill="none" stroke={BLANCO} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"
                    pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pc} /> : null}
                </svg>
                <div style={{ position: 'relative', flex: 1 }}>
                  {it.txt ? <div style={{ fontFamily: F, fontWeight: 800, fontSize: props.fs || 46, letterSpacing: '-0.02em', whiteSpace: 'nowrap',
                    color: pt > 0.5 ? 'rgba(20,17,15,0.4)' : INK }}>{it.txt}</div>
                    : <div style={{ height: 26, borderRadius: 13, background: color || '#C9C3B8', width: (it.ancho || 80) + '%' }} />}
                  {pt > 0 ? <div style={{ position: 'absolute', left: -6, top: '50%', height: 7, marginTop: -3, borderRadius: 4, background: INK,
                    width: (pt * 104).toFixed(1) + '%' }} /> : null}
                </div>
                {it.marca ? <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 28, color: it.marcaColor ? col(it.marcaColor) : TENUE }}>{it.marca}</div> : null}
              </div>
            );
          })}
        </E.Tarjeta>
        {props.derecha ? props.derecha(T) : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 1380} y={props.rotulo.y || 880} c={props.rotulo.c || f(0.6)}
          dir={props.rotulo.dir} fondo={props.rotulo.fondo} tam={1.15} /> : null}
      </Marco>
    );
  }

  /* ---------------- Calendario ---------------- */

  // grilla de dias que se llenan de verde de a uno; los de 'saltar' quedan en blanco
  function Calendario(props) {
    var T = props.T, f = reloj(props);
    var cols = props.cols || 7, filas = props.filas || 4;
    var c0 = ancla(props.c != null ? props.c : f(0.01), props.at);
    var cLlena = props.cLlena != null ? props.cLlena : c0 + 0.4;
    var durLlena = props.durLlena || 2.4;
    var saltar = props.saltar || [];
    var lado = 104, sep = 20;
    var w = cols * lado + (cols - 1) * sep, h = filas * lado + (filas - 1) * sep;
    var x0 = (props.x || 760) - w / 2, y0 = (props.y || 500) - h / 2;
    var n = cols * filas;
    var en = mov.entra(T, c0, { dy: 30 });
    var dias = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
    return (
      <Marco p={props}>
        <div style={{ position: 'absolute', left: 0, top: 0, opacity: en.opacity, transform: 'translateY(' + en.y.toFixed(1) + 'px)' }}>
          {dias.slice(0, cols).map(function (d, i) {
            return <div key={d} style={{ position: 'absolute', left: x0 + i * (lado + sep), top: y0 - 60, width: lado, textAlign: 'center',
              fontFamily: F_MONO, fontWeight: 600, fontSize: 30, color: TENUE }}>{d}</div>;
          })}
          {Array.apply(null, Array(n)).map(function (_, i) {
            var c = cLlena + durLlena * i / n;
            var lleno = saltar.indexOf(i) < 0 && T >= c;
            var pp = lleno ? mov.prog(T, c, 0.3, Easing.easeOutBack) : 0;
            return (
              <div key={i} style={{ position: 'absolute', left: x0 + (i % cols) * (lado + sep), top: y0 + Math.floor(i / cols) * (lado + sep),
                width: lado, height: lado, borderRadius: 22, background: BLANCO, boxShadow: '0 6px 18px rgba(20,17,15,0.10)', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: GRN, borderRadius: 22, transform: 'scale(' + pp.toFixed(3) + ')' }} />
              </div>
            );
          })}
        </div>
        {props.flecha !== false ? <E.Flecha T={T} de={[x0, y0 + h + 90]} a={[x0 + w + 120, y0 + h + 90]} c={cLlena} dur={durLlena} grosor={9} color="verde" /> : null}
        {props.rotulo ? <Rotulo T={T} txt={props.rotulo.txt} x={props.rotulo.x || 1500} y={props.rotulo.y || 500} c={props.rotulo.c || f(0.6)}
          dir={props.rotulo.dir || 'izq'} fondo={props.rotulo.fondo} tam={1.2} /> : null}
      </Marco>
    );
  }

  L.X = {
    Frase: Frase, Numero: Numero, Barras: Barras, Comparar: Comparar, Fila: Fila, Balanza: Balanza, Camino: Camino,
    Progreso: Progreso, Capas: Capas, Bateria: Bateria, Pensamiento: Pensamiento, Alrededor: Alrededor, Grafico: Grafico,
    Puntos: Puntos, Opciones: Opciones, Icono: Icono, Paso: Paso, Multitud: Multitud, Tareas: Tareas, Calendario: Calendario, BateriaGrande: BateriaGrande, Marco: Marco, Encabezado: Encabezado, Rotulo: Rotulo, Pieza: Pieza,
    ancla: ancla
  };
})(window);
