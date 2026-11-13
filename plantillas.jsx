/* ============================================================
   PLANTILLAS — window.PL: escenas armadas con datos para los videos
   con Tor (nutricion y temas de entrenamiento). Respetan las reglas:
   todo entra con pop, todo respira, los tiempos son fracciones de la
   escena (f(fraccion)) y el elemento principal ya esta en T = at.

   PL.escena(o) -> componente de escena ({ T, at, dur }) con:
     o.tor     { x, y, s, flex, boca, musc, muscGris, muscRojo, balanza,
                 vibra, cuando, extra(g, T, f), fondo(g, T, f), agarre(g, T, f), ropa, pose, ojos,
                 gesto, panza, giro } o una lista de varios (gesto y panza: los de B.Frente;
                 giro: grados que se inclina todo Tor, para el tambaleo)
                 (fondo: SVG detras de Tor en sus coordenadas, como la cabecera de una cama)
                 (ropa: la de B.Frente, por ejemplo una camiseta; pose: de B.Frente;
                 ojos: 'rojos').
                 flex/boca/musc/x/y/... pueden ser numeros/objetos o funciones (T, f).
                 Sin cuando, Tor es el elemento principal (ya esta en pantalla).
     o.camara  { zoom, foco, mira } (zoom suma 0.04 * t solo)
     o.piezas  [{ C, p (props u (T, f) => props), x, y, cuando, hasta, vibra, plato, s, fase, quieto }]
               fase: la misma en varias piezas hace que respiren juntas (comida sobre un plato)
               caja de arriba a la izquierda en el lienzo; plato: N.Plato detras.
               Sin cuando la pieza es principal (ya esta en pantalla).
     o.lienzo  (T, f) => SVG en coordenadas del lienzo (flechas, lineas)
     o.mal / o.bien  [{ x, y, cuando, s, hasta }]  X con sonido de error / visto con "tin"
                     (hasta: fraccion en que se retira; solo en estilo 2)
     o.r1 / o.r2     { text, y, cuando, s, x }  rotulos (maximo dos; x solo en estilo 2)
   PL.escena2(o)  lo mismo en ESTILO 2: camara viva (o.tomas, o.pulsos; las X la
     sacuden, y o.golpes suma otras sacudidas), Tor que parpadea y rotulos que entran
     deslizando; o.detras(T, f) es SVG del lienzo DETRAS de Tor (el farol, la nevera); o.encima(T, f)
     va encima de todo, rotulos incluidos (la X que tacha el rotulo de un mito)
   PL.grilla(lista, opciones) -> piezas: comida en filas (3, 2, 2...) que
     aparecen cuando la voz las nombra. lista = [[tipo de N.COMIDA, fraccion], ...]
   PL.sangre(T, f, op)   vaso sanguineo con globulos que llevan oxigeno (para o.lienzo)
   PL.alBiceps(g, p, forma)   oxigeno ('bola'), glucosa ('hex') o agua ('gota') volando a los biceps
   PL.versus(T, f, op)   pantalla dividida: linea del medio y el VS (para o.lienzo)
   PL.FIG  encuadre de Tor de cuerpo entero (como en proteinas.jsx)
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, TOR = global.TOR;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var A = global.REELS.ayudas;
  var Pos = A.Pos, Rot = A.Rot, Camara = A.Camara, Mal = A.Mal, Bien = A.Bien, sale = A.sale, junta = A.junta;

  var FIG = { x: 72, y: 166, s: 0.78 };
  var PISO_BALANZA = 1430;

  function valor(v, T, f) { return typeof v === 'function' ? v(T, f) : v; }

  function balanza(g) { return <N.Balanza x={g.centro[0]} y={g.piso} />; }

  function TorEn(props) {
    var o = props.o, T = props.T, f = props.f, at = props.at;
    var s = o.s == null ? FIG.s : o.s;
    var e = o.cuando == null ? M.pop(T, at - 0.6, 0.5) : M.pop(T, f(o.cuando), 0.45);
    if (o.hasta != null) e = junta(e, sale(T, f(o.hasta)));
    return (
      <Pos x={o.x == null ? FIG.x : valor(o.x, T, f)} y={o.y == null ? FIG.y : valor(o.y, T, f)} e={e}
        rot={o.giro != null ? valor(o.giro, T, f) : 0} origen={o.giro != null ? '50% 92%' : undefined}
        dx={o.vibra ? M.vibra(T, 30, 3) : 0} dy={M.life(T, 3.6, 4, props.i * 0.5)}>
        <TOR.Tor s={s} flex={valor(o.flex, T, f) || 0} boca={valor(o.boca, T, f)} sinPiso
          parpadeo={props.v2 ? global.V.parpadeo(T, props.i * 1.3) : 0}
          musc={valor(o.musc, T, f)} muscGris={valor(o.muscGris, T, f)} muscRojo={valor(o.muscRojo, T, f)}
          piso={o.balanza ? PISO_BALANZA : undefined}
          fondo={o.fondo ? function (g) { return o.fondo(g, T, f); } : (o.balanza ? balanza : undefined)} ropa={valor(o.ropa, T, f)}
          pose={valor(o.pose, T, f)} ojos={valor(o.ojos, T, f)} gesto={valor(o.gesto, T, f)} panza={valor(o.panza, T, f)}
          agarre={o.agarre ? function (g) { return o.agarre(g, T, f); } : undefined}
          extra={o.extra ? function (g) { return o.extra(g, T, f); } : null} />
      </Pos>
    );
  }

  function Pieza(props) {
    var o = props.o, T = props.T, f = props.f, at = props.at;
    var e = o.cuando == null ? M.pop(T, at - 0.6, 0.5) : M.pop(T, f(o.cuando), 0.42);
    if (o.hasta != null) e = junta(e, sale(T, f(o.hasta)));
    var C = o.C;
    var p = Object.assign({ s: o.s == null ? 1 : o.s }, valor(o.p, T, f) || {});
    var cuerpo = <C {...p} />;
    if (o.plato) {
      var lado = 420 * o.plato;
      cuerpo = (
        <div style={{ position: 'relative', width: lado, height: lado }}>
          <N.Plato s={o.plato} />
          <div style={{ position: 'absolute', left: (lado - 240 * p.s) / 2, top: (lado - 240 * p.s) / 2 }}>{cuerpo}</div>
        </div>
      );
    }
    return (
      <Pos x={valor(o.x, T, f)} y={valor(o.y, T, f)} e={e} dx={o.vibra ? M.vibra(T, 30, 3) : 0}
        dy={o.quieto ? 0 : M.life(T, 3, 6, o.fase != null ? o.fase : props.i * 0.13)}>
        {cuerpo}
      </Pos>
    );
  }

  function escena(o) {
    return function Escena(props) {
      var T = props.T, at = props.at, dur = props.dur;
      var f = function (v) { return at + dur * v; };
      var t = clamp((T - at) / dur, 0, 1);
      var tors = o.tor == null ? [] : (o.tor.length != null ? o.tor : [o.tor]);
      var cam = valor(o.camara, T, f) || {};
      var rot = function (r, i) {
        if (!r) return null;
        return <Rot key={'r' + i} T={T} text={r.text} y={r.y == null ? (i ? 1490 : 250) : r.y} s={r.s}
          e={M.pop(T, r.cuando == null ? at - 0.6 : f(r.cuando), r.cuando == null ? 0.5 : 0.4)} fase={i * 0.4} />;
      };
      if (o.v2) return escenaV2(o, props, tors, f);
      return (
        <div style={{ position: 'absolute', inset: 0 }}>
          <Camara zoom={(cam.zoom || 1) + 0.04 * t} foco={cam.foco || [540, 960]} mira={cam.mira}>
            {tors.map(function (to, i) { return <TorEn key={'t' + i} o={to} T={T} f={f} at={at} i={i} />; })}
          </Camara>
          {(o.piezas || []).map(function (pz, i) { return <Pieza key={'p' + i} o={pz} T={T} f={f} at={at} i={i} />; })}
          {o.lienzo ? (
            <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {o.lienzo(T, f)}
            </svg>
          ) : null}
          {(o.mal || []).map(function (m, i) {
            return <Mal key={'m' + i} T={T} cuando={f(m.cuando)} x={m.x} y={m.y} s={m.s} />;
          })}
          {(o.bien || []).map(function (b, i) {
            return <Bien key={'b' + i} T={T} cuando={f(b.cuando)} x={b.x} y={b.y} s={b.s} fase={i * 0.4} />;
          })}
          {rot(o.r1, 0)}
          {rot(o.r2, 1)}
        </div>
      );
    };
  }

  // estilo 2: la camara viva (V.Camara) se lleva a Tor, las piezas y el lienzo; las X
  // la sacuden solas; Tor parpadea; los rotulos entran deslizando (V.Rot)
  function escenaV2(o, props, tors, f) {
    var V = global.V;
    var T = props.T, at = props.at, dur = props.dur;
    var mal = o.mal || [], bien = o.bien || [];
    var rot = function (r, i) {
      if (!r) return null;
      return <V.Rot key={'r' + i} T={T} text={r.text} x={r.x} y={r.y == null ? (i ? 1490 : 270) : r.y} s={r.s} fase={i * 0.4}
        cuando={r.cuando == null ? at - 0.6 : f(r.cuando)} />;
    };
    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <V.Camara T={T} at={at} dur={dur} tomas={o.tomas || [[0, { zoom: 1 }], [1, { zoom: 1.06 }]]}
          golpes={mal.map(function (m) { return m.cuando; }).concat(o.golpes || [])} pulsos={o.pulsos}>
          {o.detras ? (
            <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {o.detras(T, f)}
            </svg>
          ) : null}
          {tors.map(function (to, i) { return <TorEn key={'t' + i} o={to} T={T} f={f} at={at} i={i} v2 />; })}
          {(o.piezas || []).map(function (pz, i) { return <Pieza key={'p' + i} o={pz} T={T} f={f} at={at} i={i} />; })}
          {o.lienzo ? (
            <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {o.lienzo(T, f)}
            </svg>
          ) : null}
        </V.Camara>
        {mal.map(function (m, i) { return <Mal key={'m' + i} T={T} cuando={f(m.cuando)} x={m.x} y={m.y} s={m.s} hasta={m.hasta != null ? f(m.hasta) : null} />; })}
        {bien.map(function (b, i) { return <Bien key={'b' + i} T={T} cuando={f(b.cuando)} x={b.x} y={b.y} s={b.s} fase={i * 0.4} hasta={b.hasta != null ? f(b.hasta) : null} />; })}
        {rot(o.r1, 0)}
        {rot(o.r2, 1)}
        {o.encima ? o.encima(T, f) : null}
      </div>
    );
  }
  function escena2(o) { return escena(Object.assign({}, o, { v2: true })); }

  // comida en filas de 3 y luego de 2, centradas; cada plato aparece en su fraccion
  function grilla(lista, op) {
    op = op || {};
    var y0 = op.y0 == null ? 470 : op.y0, paso = op.paso || 300, plato = op.plato || 0.6;
    var lado = 420 * plato;
    var filas = [], i = 0;
    while (i < lista.length) {
      var resto = lista.length - i;
      var n = resto === 3 || resto > 4 ? 3 : Math.min(2, resto);
      filas.push(lista.slice(i, i + n)); i += n;
    }
    var piezas = [];
    filas.forEach(function (fila, r) {
      var ancho = fila.length * 310;
      fila.forEach(function (c, k) {
        var cx = 540 - ancho / 2 + 155 + k * 310;
        piezas.push({ C: N.COMIDA[c[0]] || N.ICONOS[c[0]], s: 0.8, plato: plato, x: cx - lado / 2, y: y0 + r * paso,
          cuando: c[1] });
      });
    });
    return piezas;
  }

  // un vaso sanguineo de lado a lado con globulos que avanzan llevando oxigeno
  // (para o.lienzo): op = { y (centro), alto, n, o2, desde (fraccion en que entran) }
  function sangre(T, f, op) {
    op = op || {};
    var y = op.y == null ? 880 : op.y, alto = op.alto || 300, n = op.n || 4, desde = op.desde || 0;
    // sin desde, el vaso es el elemento principal: ya esta dibujado al empezar la escena
    var pared = op.desde == null ? M.draw(T, f(0) - 0.6, 0.5) : M.draw(T, f(desde), 0.5);
    var largo = 1300 * pared;
    var celulas = [];
    for (var k = 0; k < n; k++) {
      var e = M.pop(T, f(desde + 0.05 + k * 0.05), 0.42);
      var x = ((T * 150 + k * (1300 / n)) % 1300) - 240;
      var tam = 240 * (op.s || 1.05), med = tam / 2;
      var cy = y - med + (k % 2 ? 26 : -26) + M.life(T, 2.4, 8, k * 0.3);
      celulas.push(
        <g key={k} opacity={e.opacity} transform={'translate(' + (x + med).toFixed(1) + ' ' + (cy + med).toFixed(1) + ') scale(' +
          e.scale.toFixed(3) + ') translate(' + (-med) + ' ' + (-med) + ')'}>
          <N.ICONOS.globulo s={op.s || 1.05} o2={op.o2 == null ? 3 : op.o2} />
        </g>
      );
    }
    return (
      <g>
        <path d={'M -10 ' + (y - alto / 2) + ' L ' + (largo - 10) + ' ' + (y - alto / 2)} stroke={P.C.INK} strokeWidth={15} strokeLinecap="round" />
        <path d={'M -10 ' + (y + alto / 2) + ' L ' + (largo - 10) + ' ' + (y + alto / 2)} stroke={P.C.INK} strokeWidth={15} strokeLinecap="round" />
        {celulas}
      </g>
    );
  }

  // particulas que vuelan hacia los dos biceps de Tor (para tor.extra):
  // p 0..1 avance; forma 'bola' (oxigeno, amarillo) | 'hex' (glucosa)
  function alBiceps(g, p, forma) {
    var U = B.util, piezas = [];
    ['izq', 'der'].forEach(function (k) {
      var q = g[k], dest = U.lerpP(q.hombro, q.codo, 0.72);
      [[1.2, -260], [1.5, -40], [1.1, 220]].forEach(function (o, j) {
        var desde = U.suma(dest, [q.lado * 200 * o[0], o[1]]);
        var u = clamp(p * 1.3 - j * 0.15, 0, 1);
        if (u <= 0 || u >= 1) return;
        var c = U.lerpP(desde, dest, Easing.easeInCubic(u));
        var r = 30 * (1 - 0.4 * u);
        if (forma === 'gota') {
          var w = r * 0.95;
          piezas.push(<path key={k + j} d={'M ' + c[0].toFixed(1) + ' ' + (c[1] - r * 1.4).toFixed(1) +
            ' C ' + (c[0] + w).toFixed(1) + ' ' + (c[1] - r * 0.3).toFixed(1) + ' ' + (c[0] + w).toFixed(1) + ' ' + (c[1] + r).toFixed(1) + ' ' + c[0].toFixed(1) + ' ' + (c[1] + r).toFixed(1) +
            ' C ' + (c[0] - w).toFixed(1) + ' ' + (c[1] + r).toFixed(1) + ' ' + (c[0] - w).toFixed(1) + ' ' + (c[1] - r * 0.3).toFixed(1) + ' ' + c[0].toFixed(1) + ' ' + (c[1] - r * 1.4).toFixed(1) + ' Z'}
            fill="#ffffff" stroke={P.C.INK} strokeWidth={9} strokeLinejoin="round" />);
        } else if (forma === 'hex') {
          var pts = [];
          for (var i = 0; i < 6; i++) { var a = (60 * i - 30) * Math.PI / 180; pts.push((c[0] + r * Math.cos(a)).toFixed(1) + ' ' + (c[1] + r * Math.sin(a)).toFixed(1)); }
          piezas.push(<path key={k + j} d={'M ' + pts.join(' L ') + ' Z'} fill={P.C.YEL} stroke={P.C.INK} strokeWidth={9} strokeLinejoin="round" />);
        } else {
          piezas.push(<circle key={k + j} cx={c[0]} cy={c[1]} r={r} fill={P.C.YEL} stroke={P.C.INK} strokeWidth={9} />);
        }
      });
    });
    return <g>{piezas}</g>;
  }

  // pantalla dividida (para o.lienzo): la linea del medio que se dibuja y el VS que
  // late; op = { x, y0, y1, yVs }. Ya esta en pantalla al empezar la escena.
  function versus(T, f, op) {
    op = op || {};
    var x = op.x == null ? 540 : op.x, y0 = op.y0 == null ? 360 : op.y0, y1 = op.y1 == null ? 1460 : op.y1;
    var yv = op.yVs == null ? 1140 : op.yVs;
    var d = M.draw(T, f(0) - 0.6, 0.5), e = M.pop(T, f(0) - 0.6, 0.5);
    var late = 1 + 0.06 * Math.sin(T * 5);
    return (
      <g>
        <path d={'M ' + x + ' ' + y0 + ' L ' + x + ' ' + y1} stroke={P.C.INK} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={y1 - y0} strokeDashoffset={(y1 - y0) * (1 - d)} />
        <g opacity={e.opacity} transform={'translate(' + x + ' ' + (yv + M.life(T, 3, 6)).toFixed(1) + ') scale(' + (e.scale * late).toFixed(3) + ')'}>
          <circle cx={0} cy={0} r={66} fill={P.C.YEL} stroke={P.C.INK} strokeWidth={13} />
          <text x={0} y={21} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={58} fill={P.C.INK}>VS</text>
        </g>
      </g>
    );
  }

  global.PL = { escena: escena, escena2: escena2, grilla: grilla, sangre: sangre, alBiceps: alBiceps, versus: versus, FIG: FIG, PISO_BALANZA: PISO_BALANZA };
})(window);
