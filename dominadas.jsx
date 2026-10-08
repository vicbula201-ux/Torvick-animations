/* ============================================================
   DOMINADAS — reel vertical 1080x1920 (~57,5 s con el cierre de marca)
   Fuente tecnica: libro de biomecanica, pag. 58. Agarre un poco mas
   ancho que los hombros, brazos extendidos y pies en el aire; tirar
   hasta que el pecho quede cerca de la barra llevando los codos hacia
   abajo; bajar con control hasta estirar del todo. Fase concentrica:
   aduccion de hombro, flexion de codo, rotacion descendente de la
   escapula. Dorsal ancho primario; biceps, deltoides posterior,
   trapecio y redondo mayor sinergistas. Errores: recorrido parcial y
   balanceo del cuerpo.

   Cada escena sigue la regla de f(fraccion): si cambias una duracion
   (en ESCENAS o en la lista de la pagina) la coreografia se estira o
   se encoge sola, para calzar con la locucion grabada.
   La pagina, las transiciones, el sello y el cierre de marca los pone
   reel.jsx; aca solo van las escenas.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var A = global.REELS.ayudas;
  var sale = A.sale, junta = A.junta, reps = A.reps, Pos = A.Pos, Rot = A.Rot;
  var Camara = A.Camara, Recorte = A.Recorte;

  /* =========================================================
     LA FIGURA: B.Espalda colgada, con las manos fijas en la barra
     ========================================================= */

  var EW = 1100, EH = 1000;              // viewBox de B.Espalda
  var AN = 120;                          // y del viewBox donde quedan las manos (siempre la misma)
  var PISO_V = AN + 1585 + 240;          // piso de la estacion (los pies cuelgan 240 por encima)

  // ubicacion de la figura en el lienzo: s y la y de la barra en el lienzo
  function base(s, barY, cx) {
    if (cx == null) cx = 540;
    return { x: cx - 550 * s, y: barY - AN * s, s: s };
  }
  var GR = base(0.82, 610);              // figura grande (escenas de una sola figura)
  var AG = base(0.6, 400);               // figura entera con el piso (escena del agarre)

  function enLienzo(b, p) { return [b.x + p[0] * b.s, b.y + p[1] * b.s]; }

  var OPC = { brazos: 'arriba', cuerpoEntero: true, rodillas: 1 };
  // geometria anclada (manos en AN) y geometria del cuerpo (sin anclar: el torso no se mueve)
  function geo(o) { return B.geoEspalda(Object.assign({}, OPC, { anclaManos: AN }, o)); }
  function geoCuerpo(o) { return B.geoEspalda(Object.assign({}, OPC, o)); }

  // barra sola (sin parantes), con las zonas de agarre grises, como B.BarraG
  function BarraSola(props) {
    var x0 = props.x0 == null ? -160 : props.x0, x1 = props.x1 == null ? EW + 160 : props.x1;
    var gr = 40, y = AN;
    var zonas = [250, 850].map(function (x) {
      return 'M ' + (x - 85) + ' ' + (y - gr / 2) + ' h 170 v ' + gr + ' h -170 Z';
    }).join(' ');
    return (
      <g>
        <rect x={x0} y={y - gr / 2} width={x1 - x0} height={gr} rx={gr / 2} fill="#ffffff" />
        <path d={zonas} fill={C.GRY} />
        <path d={zonas} fill="none" stroke={C.INK} strokeWidth={11} />
        <rect x={x0} y={y - gr / 2} width={x1 - x0} height={gr} rx={gr / 2} fill="none"
          stroke={C.INK} strokeWidth={15} />
      </g>
    );
  }

  // la espalda colgada + la barra detras (o la estacion entera con el piso)
  function Colgado(props) {
    var s = props.s;
    return (
      <div style={{ position: 'relative', width: EW * s, height: EH * s }}>
        <svg width={EW * s} height={EH * s} viewBox={'0 0 ' + EW + ' ' + EH}
          style={{ position: 'absolute', left: 0, top: 0, display: 'block', overflow: 'visible' }}>
          {props.estacion ? (
            <g>
              <B.PisoG y={PISO_V} x0={-400} x1={EW + 400} />
              <B.BarraG vista="frente" x={550} y={AN} piso={PISO_V} />
            </g>
          ) : <BarraSola x0={props.x0} x1={props.x1} />}
        </svg>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <B.Espalda s={s} brazos="arriba" cuerpoEntero rodillas={1} anclaManos={AN}
            sube={props.sube} depr={props.depr} musc={props.musc} muscGris={props.muscGris}
            muscRojo={props.muscRojo}>
            {props.children}
          </B.Espalda>
        </div>
      </div>
    );
  }

  /* ---------------- overlays ---------------- */

  // flechas verdes que empujan los codos hacia abajo (siguen al codo)
  function flechasCodo(g, p, opacity) {
    return [g.izq, g.der].map(function (L, i) {
      return <B.FlechaS key={'fc' + i} a={U.suma(L.E, [0, 60])} b={U.suma(L.E, [0, 260])}
        p={p} opacity={opacity} color={C.GRN} sw={24} cabeza={50} />;
    });
  }

  // guia recta al costado de cada brazo (brazos estirados)
  function guiasBrazo(g, p, color, sep) {
    if (sep == null) sep = 78;
    return [[g.izq, 1], [g.der, -1]].map(function (par, i) {
      var L = par[0];
      var u = U.unidad(U.resta(L.H, L.J));
      var n = U.por([u[1], -u[0]], par[1]);
      return <B.Puntos key={'gb' + i} pts={[U.suma(L.J, U.por(n, sep)), U.suma(L.H, U.suma(U.por(n, sep), U.por(u, -40)))]}
        p={p} color={color || C.GRN} sw={22} />;
    });
  }

  // llave "}" de x, entre y0 e y1, que apunta hacia +x
  function llave(x, y0, y1, w) {
    var ym = (y0 + y1) / 2, h = w / 2;
    var r = Math.min(h, (y1 - y0) / 4);
    return 'M ' + x + ' ' + y0 + ' Q ' + (x + h) + ' ' + y0 + ' ' + (x + h) + ' ' + (y0 + r) +
      ' L ' + (x + h) + ' ' + (ym - r) + ' Q ' + (x + h) + ' ' + ym + ' ' + (x + w) + ' ' + ym +
      ' Q ' + (x + h) + ' ' + ym + ' ' + (x + h) + ' ' + (ym + r) +
      ' L ' + (x + h) + ' ' + (y1 - r) + ' Q ' + (x + h) + ' ' + y1 + ' ' + x + ' ' + y1;
  }

  // arco que pasa por p0 y p1 abriendo "grados"; lado +1/-1 elige de que lado queda el centro
  function arcoEntre(p0, p1, grados, lado) {
    var d = U.resta(p1, p0), l = U.largo(d);
    var u = U.unidad(d), n = U.por([-u[1], u[0]], lado);
    var th = grados * Math.PI / 180;
    var r = (l / 2) / Math.sin(th / 2);
    var c = U.suma(U.lerpP(p0, p1, 0.5), U.por(n, (l / 2) / Math.tan(th / 2)));
    var a0 = Math.atan2(p0[1] - c[1], p0[0] - c[0]) * 180 / Math.PI;
    var a1 = Math.atan2(p1[1] - c[1], p1[0] - c[0]) * 180 / Math.PI;
    while (a1 - a0 > 180) a1 -= 360;
    while (a1 - a0 < -180) a1 += 360;
    return { c: c, r: r, a0: a0, a1: a1 };
  }

  function angulo(v) { return Math.atan2(v[1], v[0]) * 180 / Math.PI; }

  // escapula izquierda: el contorno del cuerpo de la escapula
  function escapula(L) { return [L.espinaLat, L.espinaMed, L.angInf, L.bordeMed, L.bordeLat]; }
  function mover(pts, dy) { return pts.map(function (p) { return [p[0], p[1] + dy]; }); }

  // capa SVG a tamano de lienzo (overlays en coordenadas del lienzo)
  function Capa(props) {
    return (
      <svg width={1080} height={1920} viewBox="0 0 1080 1920"
        style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: props.opacity }}>
        {props.children}
      </svg>
    );
  }

  /* =========================================================
     ESCENAS
     ========================================================= */

  /* 1 — gancho: sube pensando solo en subir; despues los codos abajo y el dorsal se enciende */
  function EscGancho(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var rep1 = T < f(0.48) ? reps(T, f(0.08), f(0.46), 1) : 0;
    var rep2 = animate({ from: 0, to: 1, start: f(0.52), end: f(0.8), ease: Easing.easeInOutSine })(T);
    var sube = rep1 + rep2;
    var luz = animate({ from: 0, to: 1, start: f(0.6), end: f(0.76) })(T);
    var acerca = animate({ from: 0, to: 1, start: f(0.5), end: f(0.8), ease: Easing.easeInOutCubic })(T);
    var zoom = 1 + 0.12 * acerca + 0.03 * t;

    var fig = M.pop(T, at - 0.6, 0.5);
    var titulo = M.pop(T, f(0.03), 0.45);
    var oArriba = junta(M.pop(T, f(0.16), 0.4), sale(T, f(0.46))).opacity;
    var pArriba = M.draw(T, f(0.16), 0.4);
    var pCodos = M.draw(T, f(0.56), 0.4);
    var rotulo = M.pop(T, f(0.64), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={zoom} foco={enLienzo(GR, [550, 300])}>
          <Pos x={GR.x} y={GR.y} e={fig} dy={M.life(T, 3.6, 5)}>
            <Colgado s={GR.s} sube={sube} musc={{ dor: luz, rM: luz }}>
              {function (g) {
                return (
                  <g>
                    {/* "solo subir": flecha gris que sube con el cuerpo */}
                    <B.FlechaS a={[990, g.cabeza[1] + 170]} b={[990, g.cabeza[1] - 300]} p={pArriba}
                      opacity={oArriba} color={C.GRY} sw={42} cabeza={80} />
                    {flechasCodo(g, pCodos)}
                  </g>
                );
              }}
            </Colgado>
          </Pos>
        </Camara>
        <Rot T={T} text="DOMINADAS" s={1.4} y={236} e={titulo} />
        <Rot T={T} text="CODOS ABAJO" y={1450} e={rotulo} fase={0.4} />
      </div>
    );
  }

  /* 2 — agarre: un poco mas ancho que los hombros, brazos estirados, pies en el aire */
  function EscAgarre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var estira = animate({ from: 0, to: 1, start: f(0.42), end: f(0.54), ease: Easing.easeInOutCubic })(T);
    var sube = 0.14 * (1 - estira);
    var aleja = animate({ from: 0, to: 1, start: f(0.6), end: f(0.76), ease: Easing.easeInOutCubic })(T);
    var foco = enLienzo(AG, [550, 330]);
    var zoom = U.lerp(1.5, 1, aleja) + 0.02 * t;
    var mira = U.lerpP([540, 665], foco, aleja);

    var pHombros = M.draw(T, f(0.08), 0.4);
    var anillo = animate({ from: 0, to: 1, start: f(0.16), end: f(0.26) })(T);
    var pAncho = M.draw(T, f(0.22), 0.35);
    var pBrazos = M.draw(T, f(0.52), 0.4);
    var pPies = M.draw(T, f(0.76), 0.35);

    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = junta(M.pop(T, f(0.06), 0.45), sale(T, f(0.42)));
    var r2 = M.pop(T, f(0.47), 0.45);
    var visto = M.pop(T, f(0.84), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={zoom} foco={foco} mira={mira}>
          <Pos x={AG.x} y={AG.y} e={fig} dy={M.life(T, 3.6, 3)}>
            <Colgado s={AG.s} sube={sube} estacion>
              {function (g) {
                var L = g.izq, R = g.der;
                var yA = AN + 120;
                var medio = (g.piso + PISO_V) / 2;
                return (
                  <g>
                    {/* ancho de hombros (gris) contra el agarre (amarillo) */}
                    <B.Puntos pts={[[L.A[0], L.A[1] - 30], [L.A[0], AN + 46]]} p={pHombros} color={C.GRY} sw={28} />
                    <B.Puntos pts={[[R.A[0], R.A[1] - 30], [R.A[0], AN + 46]]} p={pHombros} color={C.GRY} sw={28} />
                    <B.Anillo c={L.H} r={70} p={anillo} color={C.YEL} sw={20} />
                    <B.Anillo c={R.H} r={70} p={anillo} color={C.YEL} sw={20} />
                    <B.FlechaS a={[L.A[0] - 14, yA]} b={[L.H[0] - 30, yA]} p={pAncho} color={C.YEL} sw={22} cabeza={44} />
                    <B.FlechaS a={[R.A[0] + 14, yA]} b={[R.H[0] + 30, yA]} p={pAncho} color={C.YEL} sw={22} cabeza={44} />
                    {/* brazos estirados */}
                    {guiasBrazo(g, pBrazos)}
                    {/* pies en el aire */}
                    <B.FlechaS a={[550, medio]} b={[550, g.piso + 10]} p={pPies} color={C.GRN} sw={22} cabeza={42} />
                    <B.FlechaS a={[550, medio]} b={[550, PISO_V - 12]} p={pPies} color={C.GRN} sw={22} cabeza={42} />
                  </g>
                );
              }}
            </Colgado>
          </Pos>
        </Camara>
        <Pos x={585} y={1318} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.55} p={M.draw(T, f(0.84), 0.4)} />
        </Pos>
        <Rot T={T} text="AGARRE ANCHO" y={236} e={r1} />
        <Rot T={T} text="BRAZOS ESTIRADOS" y={236} e={r2} />
      </div>
    );
  }

  /* 3 — tiron: el pecho sube hasta la barra; despues, los codos hacia abajo */
  function EscTiron(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var ida1 = animate({ from: 0, to: 1, start: f(0.04), end: f(0.36), ease: Easing.easeInOutSine })(T);
    var baja = animate({ from: 0, to: 1, start: f(0.48), end: f(0.6), ease: Easing.easeInOutSine })(T);
    var ida2 = animate({ from: 0, to: 1, start: f(0.62), end: f(0.92), ease: Easing.easeInOutSine })(T);
    var sube = ida1 - baja + ida2;
    var luz = 0.5 * ida2;

    var pLinea = M.draw(T, f(0.06), 0.45);
    var pCodos = M.draw(T, f(0.6), 0.4);

    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.24), 0.45);
    var r2 = M.pop(T, f(0.6), 0.45);
    var visto = M.pop(T, f(0.36), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={[540, 900]}>
          <Pos x={GR.x} y={GR.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Colgado s={GR.s} sube={sube} musc={{ dor: luz, rM: luz }}>
              {function (g) {
                var yPecho = g.izq.J[1] + 64;
                var llega = sube > 0.96;
                return (
                  <g>
                    <B.Puntos pts={[[-60, yPecho], [EW + 60, yPecho]]} p={pLinea}
                      color={llega ? C.GRN : C.YEL} sw={20} />
                    {flechasCodo(g, pCodos)}
                  </g>
                );
              }}
            </Colgado>
          </Pos>
        </Camara>
        <Pos x={850} y={380} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.55} p={M.draw(T, f(0.36), 0.4)} />
        </Pos>
        <Rot T={T} text="PECHO A LA BARRA" y={236} e={r1} />
        <Rot T={T} text="CODOS HACIA ABAJO" y={1450} e={r2} fase={0.4} />
      </div>
    );
  }

  /* 4 — biomecanica: zoom al hombro; aduccion del brazo y rotacion de la escapula */
  var GEO0 = geoCuerpo({ sube: 0 });
  // angulo del humero colgado (arriba a la izquierda, ~247): al bajar pasa por 180 (afuera)
  var ANG0 = (angulo(U.resta(GEO0.izq.E, GEO0.izq.J)) + 360) % 360;

  function EscBiomecanica(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var sube = animate({ from: 0, to: 1, start: f(0.08), end: f(0.52), ease: Easing.easeInOutSine })(T);
    var g = geo({ sube: sube });
    var acerca = animate({ from: 0, to: 1, start: f(0), end: f(0.14), ease: Easing.easeInOutCubic })(T);
    var foco = enLienzo(GR, [390, 470 + g.dy]);
    var zoom = 1 + 0.75 * acerca + 0.03 * t;
    var mira = U.lerpP(foco, [630, 990], acerca);

    var oFantasma = animate({ from: 0, to: 1, start: f(0.06), end: f(0.14) })(T);
    var oEsc = animate({ from: 0, to: 1, start: f(0.56), end: f(0.64) })(T);
    var pEscArco = M.draw(T, f(0.62), 0.45);

    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.18), 0.45);
    var r2 = M.pop(T, f(0.6), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={zoom} foco={foco} mira={mira}>
          <Pos x={GR.x} y={GR.y} e={fig} dy={M.life(T, 3.6, 3)}>
            <Colgado s={GR.s} sube={sube}>
              {function (g) {
                var L = g.izq;
                var a1 = (angulo(U.resta(L.E, L.J)) + 360) % 360;   // mismo rango que ANG0
                var brazo0 = U.suma(L.J, U.por(U.unidad(U.resta(GEO0.izq.E, GEO0.izq.J)), 230));
                var oArco = clamp(sube / 0.08, 0, 1);
                // escapula ahora (amarillo); la flecha sale de donde estaba su angulo inferior colgado
                var antes = mover(escapula(GEO0.izq), g.dy);
                var ahora = escapula(L);
                var arc = arcoEntre(U.suma(antes[2], [-20, 46]), U.suma(ahora[2], [16, 50]), 80, -1);
                return (
                  <g>
                    <B.Puntos pts={[L.J, brazo0]} opacity={oFantasma} color={C.GRY} sw={20} />
                    {sube > 0.02 ? <B.Arco c={L.J} r={280} a0={ANG0} a1={a1} color={C.GRN} sw={22}
                      cabeza={48} opacity={oArco} /> : null}
                    <path d={U.blando(ahora, 0.3)} fill="none" stroke={C.YEL} strokeWidth={20}
                      strokeLinejoin="round" opacity={oEsc} />
                    <B.Arco c={arc.c} r={arc.r} a0={arc.a0} a1={arc.a1} p={pEscArco} color={C.GRN}
                      sw={20} cabeza={44} />
                  </g>
                );
              }}
            </Colgado>
          </Pos>
        </Camara>
        <Rot T={T} text="ADUCCIÓN DEL HOMBRO" y={236} e={r1} s={1} />
        <Rot T={T} text="ROTACIÓN DE ESCÁPULA" y={1450} e={r2} s={1} fase={0.4} />
      </div>
    );
  }

  /* 5 — bajada: lenta, 3-2-1, hasta estirar los brazos; el dorsal se estira */
  function EscBajada(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var u = clamp((T - f(0.06)) / (f(0.7) - f(0.06)), 0, 1);
    var sube = 1 - Easing.easeInOutSine(u);
    var n = u < 1 / 3 ? 3 : u < 2 / 3 ? 2 : 1;
    var anillo = u >= 1 ? 0 : 1 - ((u * 3) % 1);
    var luz = 0.6 + 0.4 * animate({ from: 0, to: 1, start: f(0.72), end: f(0.82) })(T);

    var pBrazos = M.draw(T, f(0.7), 0.4);
    var pEstira = M.draw(T, f(0.76), 0.4);

    var fig = M.pop(T, at - 0.6, 0.5);
    var cuenta = junta(M.pop(T, f(0.04), 0.45), sale(T, f(0.8)));
    var rotulo = M.pop(T, f(0.1), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.04 * t} foco={[540, 900]}>
          <Pos x={GR.x} y={GR.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Colgado s={GR.s} sube={sube} musc={{ dor: luz, rM: luz }}>
              {function (g) {
                var lados = [[g.izq, 1], [g.der, -1]];
                return (
                  <g>
                    {guiasBrazo(g, pBrazos)}
                    {lados.map(function (par, i) {
                      var L = par[0];
                      var abajo = [550 - par[1] * 150, g.cintura[1] - 90];
                      var m = U.lerpP(abajo, L.X, 0.5);
                      return (
                        <g key={'es' + i}>
                          <B.FlechaS a={m} b={U.lerpP(abajo, L.X, 0.08)} p={pEstira} color={C.GRN} sw={20} cabeza={40} />
                          <B.FlechaS a={m} b={U.lerpP(abajo, L.X, 0.92)} p={pEstira} color={C.GRN} sw={20} cabeza={40} />
                        </g>
                      );
                    })}
                  </g>
                );
              }}
            </Colgado>
          </Pos>
        </Camara>
        <Pos x={60} y={640} e={cuenta} dy={M.life(T, 3, 5)}>
          <B.Cuenta s={0.85} n={n} p={anillo} />
        </Pos>
        <Rot T={T} text="BAJA CON CONTROL" y={236} e={rotulo} />
      </div>
    );
  }

  /* 6 — musculos: el dorsal en amarillo; los ayudantes en gris, al ritmo de la voz */
  function EscMusculos(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var dor = animate({ from: 0, to: 1, start: f(0.04), end: f(0.14) })(T);
    var rM = animate({ from: 0, to: 1, start: f(0.48), end: f(0.56) })(T);
    var dp = animate({ from: 0, to: 1, start: f(0.64), end: f(0.72) })(T);
    var tra = animate({ from: 0, to: 1, start: f(0.82), end: f(0.9) })(T);
    var sube = 0.62 + M.life(T, 3, 0.05);


    var fig = M.pop(T, at - 0.6, 0.5);
    var r1 = M.pop(T, f(0.08), 0.45);
    var r2 = M.pop(T, f(0.33), 0.45);   // el biceps no se ve de espaldas: lo nombra el rotulo

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1.22 + 0.06 * t} foco={enLienzo(GR, [550, 320])} mira={[540, 760]}>
          <Pos x={GR.x} y={GR.y} e={fig} dy={M.life(T, 3.6, 4)}>
            <Colgado s={GR.s} sube={sube} musc={{ dor: dor, tra: tra }} muscGris={{ rM: rM, dp: dp }} />
          </Pos>
        </Camara>
        <Rot T={T} text="DORSAL ANCHO" y={236} e={r1} />
        <Rot T={T} text="+ BÍCEPS Y TRAPECIO" y={1450} e={r2} s={1} fase={0.4} />
      </div>
    );
  }

  /* =========================================================
     ERRORES: comparacion arriba (mal) / abajo (bien), de perfil
     B.Perfil colgado de una barra de pared (el parante queda fuera
     del lienzo, a la izquierda); la columna derecha lleva el rotulo
     y la X o el visto de cada mitad.
     ========================================================= */

  var BARRA_P = [700, 200];                          // barra en el viewBox de B.Perfil

  function BarraPared() {
    return <B.BarraG vista="lado" x={BARRA_P[0]} y={BARRA_P[1]} brazo={980} sinBase />;
  }

  function posePerfil(sube, bal) {
    return B.posePerfil.colgado({ barra: BARRA_P, sube: sube, balanceo: bal || 0, rodillas: 1 });
  }
  function cabezaPerfil(sube) { return B.geoPerfil({ pose: posePerfil(sube) }).centroCabeza; }

  // ventana: muestra del viewBox y = desde .. desde + alto; x = donde cae el viewBox en el lienzo
  function Mitad(props) {
    var c = props.c;
    return (
      <Pos x={0} y={0} e={props.e} dx={props.dx} dy={props.dy}>
        <Recorte x={0} y={props.y} w={1080} h={c.alto * c.s} desde={c.desde * c.s}>
          <div style={{ position: 'absolute', left: c.x, top: 0 }}>{props.children}</div>
        </Recorte>
      </Pos>
    );
  }
  function enMitad(c, yMitad, p) { return [c.x + p[0] * c.s, yMitad + (p[1] - c.desde) * c.s]; }

  // columna de la derecha: rotulo arriba de la mitad, juicio debajo
  var COL = { x: 585, rot: 26, juicio: [640, 250] };

  /* 7 — error 1: repeticiones a medias vs recorrido completo */
  var CMP1 = { s: 0.64, desde: -40, alto: 940, x: 330 - 700 * 0.64, yArriba: 300, yAbajo: 912 };

  function EscError1(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };

    var mal = 0.3 + 0.4 * reps(T, f(0.02), f(0.98), 3.5);
    var bien = reps(T, f(0.42), f(0.98), 1.5);

    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.38), 0.45);
    var tacha = M.pop(T, f(0.16), 0.4);
    var visto = M.pop(T, f(0.66), 0.45);
    var r1 = M.pop(T, f(0.05), 0.45);
    var r2 = M.pop(T, f(0.44), 0.45);
    var pMal = M.draw(T, f(0.08), 0.35);
    var pBien = M.draw(T, f(0.5), 0.45);

    var xLlave = 960;                                 // a la derecha del recorrido de la cabeza
    var llaves = [
      { y: CMP1.yArriba, a: 0.3, b: 0.7, color: C.RED, p: pMal, e: arriba, ph: 0 },
      { y: CMP1.yAbajo, a: 0, b: 1, color: C.GRN, p: pBien, e: abajo, ph: 0.5 }
    ];

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad c={CMP1} y={CMP1.yArriba} e={arriba} dx={M.vibra(T, 44, 2)} dy={M.life(T, 3.6, 4)}>
          <B.Perfil s={CMP1.s} pose={posePerfil(mal)} fondo={BarraPared} />
        </Mitad>
        <Mitad c={CMP1} y={CMP1.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <B.Perfil s={CMP1.s} pose={posePerfil(bien)} fondo={BarraPared} musc={{ dor: abajo.opacity }} />
        </Mitad>
        {llaves.map(function (k, i) {
          var p0 = enMitad(CMP1, k.y, [xLlave, cabezaPerfil(k.b)[1]]);
          var p1 = enMitad(CMP1, k.y, [xLlave, cabezaPerfil(k.a)[1]]);
          return (
            <Pos key={'ll' + i} x={0} y={0} e={k.e} dy={M.life(T, 3.6, 4, k.ph)}>
              <Capa>
                <path d={llave(p0[0], p0[1], p1[1], 46)} fill="none" stroke={k.color} strokeWidth={15}
                  strokeLinecap="round" strokeLinejoin="round"
                  strokeDasharray={2000} strokeDashoffset={2000 * (1 - k.p)} />
              </Capa>
            </Pos>
          );
        })}
        <Pos x={COL.juicio[0]} y={CMP1.yArriba + COL.juicio[1]} e={tacha} dx={M.vibra(T, 44, 4)}>
          <P.Tacha s={0.6} />
        </Pos>
        <Pos x={COL.juicio[0]} y={CMP1.yAbajo + COL.juicio[1]} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.65} p={M.draw(T, f(0.66), 0.4)} />
        </Pos>
        <Rot T={T} text="A MEDIAS" x={COL.x} y={CMP1.yArriba + COL.rot} e={r1} s={1} />
        <Rot T={T} text="RECORRIDO COMPLETO" x={COL.x - 20} y={CMP1.yAbajo + COL.rot} e={r2} s={0.75} fase={0.4} />
      </div>
    );
  }

  /* 8 — error 2: balancearse vs cuerpo quieto */
  var CMP2 = { s: 0.405, desde: -20, alto: 1505, x: 320 - 700 * 0.405, yArriba: 296, yAbajo: 912 };

  function EscError2(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };

    // mal: se columpia +-25 grados y sube con el impulso; bien: una repeticion quieta
    var u = clamp((T - f(0.02)) / (f(0.98) - f(0.02)), 0, 1);
    var bal = 25 * Math.sin(u * Math.PI * 2 * 2.25);
    var subeMal = 0.6 * (0.5 - 0.5 * Math.cos(u * Math.PI * 2 * 2.25 - 0.6));
    var subeBien = reps(T, f(0.42), f(0.98), 1);

    var arriba = M.pop(T, at - 0.6, 0.5);
    var abajo = M.pop(T, f(0.38), 0.45);
    var tacha = M.pop(T, f(0.14), 0.4);
    var visto = M.pop(T, f(0.62), 0.45);
    var r1 = M.pop(T, f(0.05), 0.45);
    var r2 = M.pop(T, f(0.44), 0.45);
    var pArco = M.draw(T, f(0.08), 0.4);
    var pPlomo = M.draw(T, f(0.48), 0.4);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Mitad c={CMP2} y={CMP2.yArriba} e={arriba} dy={M.life(T, 3.6, 4)}>
          <B.Perfil s={CMP2.s} pose={posePerfil(subeMal, bal)} fondo={BarraPared}>
            {function () {
              return (
                <g>
                  <B.Arco c={BARRA_P} r={1262} a0={90} a1={119} p={pArco} color={C.RED} sw={40} cabeza={86} />
                  <B.Arco c={BARRA_P} r={1262} a0={90} a1={61} p={pArco} color={C.RED} sw={40} cabeza={86} />
                </g>
              );
            }}
          </B.Perfil>
        </Mitad>
        <Mitad c={CMP2} y={CMP2.yAbajo} e={abajo} dy={M.life(T, 3.6, 4, 0.5)}>
          <B.Perfil s={CMP2.s} pose={posePerfil(subeBien)} fondo={BarraPared} musc={{ dor: abajo.opacity }}>
            {function () {
              return <B.Puntos pts={[[BARRA_P[0] + 110, BARRA_P[1] - 120], [BARRA_P[0] + 110, BARRA_P[1] + 1330]]}
                p={pPlomo} color={C.GRN} sw={36} />;
            }}
          </B.Perfil>
        </Mitad>
        <Pos x={COL.juicio[0]} y={CMP2.yArriba + COL.juicio[1]} e={tacha} dx={M.vibra(T, 44, 4)}>
          <P.Tacha s={0.6} />
        </Pos>
        <Pos x={COL.juicio[0]} y={CMP2.yAbajo + COL.juicio[1]} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.65} p={M.draw(T, f(0.62), 0.4)} />
        </Pos>
        <Rot T={T} text="BALANCEO" x={COL.x} y={CMP2.yArriba + COL.rot} e={r1} s={1} />
        <Rot T={T} text="CUERPO QUIETO" x={COL.x} y={CMP2.yAbajo + COL.rot} e={r2} s={0.85} fase={0.4} />
      </div>
    );
  }

  /* 9 — cierre: una dominada limpia, el dorsal encendido, visto grande */
  function EscCierre(props) {
    var T = props.T, at = props.at, dur = props.dur;
    var f = function (v) { return at + dur * v; };
    var t = clamp((T - at) / dur, 0, 1);

    var sube = animate({ from: 0, to: 1, start: f(0.04), end: f(0.42), ease: Easing.easeInOutSine })(T);
    var luz = animate({ from: 0, to: 1, start: f(0.36), end: f(0.48) })(T);

    var fig = M.pop(T, at - 0.6, 0.5);
    var visto = M.pop(T, f(0.5), 0.5);
    var r1 = M.pop(T, f(0.44), 0.45);
    var r2 = M.pop(T, f(0.6), 0.45);

    return (
      <div style={{ position: 'absolute', inset: 0 }}>
        <Camara zoom={1 + 0.05 * t} foco={[540, 900]}>
          <Pos x={GR.x} y={GR.y} e={fig} dy={M.life(T, 3.6, 5)}>
            <Colgado s={GR.s} sube={sube} musc={{ dor: luz, rM: luz }} />
          </Pos>
        </Camara>
        <Pos x={780} y={760} e={visto} dy={M.life(T, 2.8, 6)}>
          <P.Visto s={0.85} p={M.draw(T, f(0.5), 0.4)} />
        </Pos>
        <Rot T={T} text="DOMINADAS" s={1.4} y={236} e={r1} />
        <Rot T={T} text="TÉCNICA > PESO" y={1450} e={r2} fase={0.4} />
      </div>
    );
  }

  /* =========================================================
     GUION — duracion y locucion de cada escena
     Las duraciones salen de leer cada linea a ritmo normal
     (~2,7 palabras por segundo). Total: 54,5 s + 3 s del cierre de marca
     que agrega reel.jsx = 57,5 s.
     ========================================================= */

  var ESCENAS = [
    { nombre: 'Gancho', dur: 6.5, C: EscGancho,
      vo: '¿Haces dominadas? Si solo piensas en subir, te pierdes la clave: llevar los codos hacia abajo.' },
    { nombre: 'Agarre', dur: 7.5, C: EscAgarre,
      vo: 'Agarra la barra un poco más ancho que los hombros, con los brazos totalmente extendidos y los pies sin tocar el suelo.' },
    { nombre: 'Tirón', dur: 8, C: EscTiron,
      vo: 'Tira de tu cuerpo hacia arriba hasta que el pecho quede cerca de la barra, pensando en llevar los codos hacia abajo.' },
    { nombre: 'Biomecánica', dur: 5.5, C: EscBiomecanica,
      vo: 'En la subida, el hombro hace aducción y la escápula rota hacia abajo.' },
    { nombre: 'Bajada', dur: 6, C: EscBajada,
      vo: 'Baja con control hasta estirar por completo los brazos y sentir el estiramiento de la espalda.' },
    { nombre: 'Músculos', dur: 7.5, C: EscMusculos,
      vo: 'El protagonista es el dorsal ancho, con ayuda del bíceps, el redondo mayor, el deltoides posterior y el trapecio.' },
    { nombre: 'Error 1', dur: 5.5, C: EscError1,
      vo: 'Error uno: quedarte a medias. Sube hasta arriba y estira del todo al bajar.' },
    { nombre: 'Error 2', dur: 5, C: EscError2,
      vo: 'Error dos: balancearte para ganar impulso. El cuerpo sube quieto, sin columpiarse.' },
    { nombre: 'Cierre', dur: 3, C: EscCierre,
      vo: 'Así se hace una dominada.' }
  ];

  global.REELS.registrar({ id: 'dominadas', titulo: 'Dominadas', escenas: ESCENAS });
})(window);
