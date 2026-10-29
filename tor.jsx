/* ============================================================
   TOR — window.TOR: el avatar de Torvick (la figura de frente de B.Frente)
   con la pose de doble biceps, que se usa en los videos de nutricion y
   en la foto de perfil.

   TOR.pose({ x=600, piso=1500, flex=0 })  pose de B.Frente: flex 0 brazos
       al costado -> 1 doble biceps (brazos afuera, puños a la altura de la
       cabeza). El brazo sube y el antebrazo gira por afuera, sin cruzar el
       torso.
   <TOR.Tor s flex musc muscGris muscRojo boca pose sinPiso fondo agarre extra ropa ojos />
       B.Frente + el pico del biceps (se abomba con flex; amarillo con
       musc.bic). extra(g) se dibuja encima de todo, como children.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var B = global.B, P = global.P;
  var clamp = global.clamp, Easing = global.Easing;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var GRAD = Math.PI / 180;

  // brazo: angulos desde la vertical hacia abajo, positivos hacia afuera
  var BRAZO0 = Math.atan2(38, 194) / GRAD, BRAZO1 = 84;
  var ANTE0 = Math.atan2(18, 192) / GRAD, ANTE1 = 180 + Math.atan2(35, 190) / GRAD;
  var L_BRAZO = Math.hypot(38, 194), L_ANTE = Math.hypot(18, 192);

  function pose(o) {
    o = o || {};
    var p = B.poseFrente.depie({ x: o.x, piso: o.piso });
    var g = B.geoFrente({ pose: p });
    var k = Easing.easeInOutCubic(clamp(o.flex || 0, 0, 1));
    ['izq', 'der'].forEach(function (lado, i) {
      var l = i ? 1 : -1, S = g[lado].hombro;
      var a = (BRAZO0 + (BRAZO1 - BRAZO0) * k) * GRAD;
      var b = (ANTE0 + (ANTE1 - ANTE0) * k) * GRAD;
      // flexionado el brazo se ve un poco mas largo: deja lugar al biceps despues del deltoides
      var lb = L_BRAZO * (1 + 0.2 * k), la = L_ANTE * (1 + 0.04 * k);
      var E = U.suma(S, [l * Math.sin(a) * lb, Math.cos(a) * lb]);
      var H = U.suma(E, [l * Math.sin(b) * la, Math.cos(b) * la]);
      p[lado].codo = E;
      p[lado].mano = H;
    });
    return p;
  }

  // biceps contraido: un bulto sobre el brazo (hombro -> codo) que crece hacia arriba
  function Pico(props) {
    var g = props.g, q = g[props.lado], h = props.h, v = props.v;
    if (h < 2) return null;
    var S = q.hombro, E = q.codo, L = U.largo(U.resta(E, S));
    var d = U.unidad(U.resta(E, S));
    var n = U.por([d[1], -d[0]], q.lado);           // normal hacia arriba del brazo
    var en = function (u, w) { return U.suma(U.suma(S, U.por(d, u * L)), U.por(n, w)); };
    var arriba = 'M ' + U.pt(en(0.48, 28)) + ' C ' + U.pt(en(0.56, 40 + 1.6 * h)) + ' ' +
      U.pt(en(0.8, 40 + 1.6 * h)) + ' ' + U.pt(en(0.88, 22));
    var forma = arriba + ' C ' + U.pt(en(0.82, -26)) + ' ' + U.pt(en(0.56, -30)) + ' ' + U.pt(en(0.48, 28)) + ' Z';
    var fibra = 'M ' + U.pt(en(0.55, 10)) + ' Q ' + U.pt(en(0.68, 24 + 0.8 * h)) + ' ' + U.pt(en(0.82, 8));
    return (
      <g>
        <path d={forma} fill={BLANCO} />
        {v > 0 ? <path d={forma} fill={props.color} opacity={v} /> : null}
        <path d={fibra} fill="none" stroke={C.GRY} strokeWidth={11} strokeLinecap="round" opacity={Math.min(1, 2.2 * v)} />
        <path d={forma} fill="none" stroke={C.INK} strokeWidth={11} strokeLinejoin="round" />
        <path d={arriba} fill="none" stroke={C.INK} strokeWidth={14} strokeLinecap="round" />
      </g>
    );
  }

  function nivel(m, k) {
    var v = (m || {})[k];
    return v == null ? 0 : (typeof v === 'number' ? v : Math.max(v[0], v[1]));
  }

  function Tor(props) {
    var flex = props.flex || 0;
    var p = props.pose || pose({ x: props.x, piso: props.piso, flex: flex });
    var h = 40 * clamp((flex - 0.45) / 0.55, 0, 1);
    var rojo = nivel(props.muscRojo, 'bic'), am = nivel(props.musc, 'bic');
    var color = rojo > 0 ? C.RED : C.YEL;
    var v = rojo > 0 ? rojo : am;
    // con el brazo flexionado el biceps lo dibuja el pico entero
    var sinBic = function (m) { return h > 2 && m ? Object.assign({}, m, { bic: 0 }) : m; };
    return (
      <B.Frente s={props.s} pose={p} boca={props.boca} sinPiso={props.sinPiso} parpadeo={props.parpadeo} ropa={props.ropa} ojos={props.ojos}
        musc={sinBic(props.musc)} muscGris={props.muscGris} muscRojo={sinBic(props.muscRojo)}
        fondo={props.fondo} agarre={props.agarre}
        children={function (g) {
          return (
            <g>
              <Pico g={g} lado="izq" h={h} v={v} color={color} />
              <Pico g={g} lado="der" h={h} v={v} color={color} />
              {props.extra ? props.extra(g) : null}
            </g>
          );
        }} />
    );
  }

  global.TOR = { pose: pose, Tor: Tor };
})(window);
