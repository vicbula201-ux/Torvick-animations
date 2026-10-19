/* ============================================================
   DISCIPLINA — reedicion con el estilo de los videos largos

   La base son las animaciones ORIGINALES de este video (fondo claro, linea de
   tinta, monigotes, dianas, barras amarillas, etiquetas negras con flechita),
   rehechas en limpio: cada escena de abajo recrea el inserto viejo que tapa,
   con la misma idea y al ritmo de la voz.

   Fuente: el video ya publicado (largos/disciplina/media/fuente.mp4), que trae
   la edicion vieja encima. Por eso el plan:
     - tapa CADA inserto viejo con una escena nueva (esc: cubre de a a b, con
       la transicion por fuera; los cortes estan en fuente-tramos.json);
     - conserva los clips de archivo (p.mantener) y les pone un texto;
     - esconde las placas de texto viejas sobre la camara con un primer plano
       corto (tapar) que las deja fuera de cuadro.
   Con el video crudo (sin edicion) nada de esto hace falta: solo el plan.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var L = global.LARGOS, E = L.E, X = L.X, p = L.plan, mov = L.mov;
  var Easing = global.Easing, clamp = global.clamp;
  var t = L.buscador('disciplina');
  var INK = '#14110F', YEL = '#FFD400', RED = '#E03A2F', GRN = '#16A06A', GRY = '#C9C3B8', BLANCO = '#FFFFFF';
  var F = L.F, F_MONO = L.F_MONO, TENUE = L.TENUE;

  // media ventana de cada transicion: la escena cubre del todo de a a b
  var VENT = { latigo: 0.2, barrido: 0.26, zoom: 0.22, fundido: 0.16, pop: 0.2, corte: 0 };
  function esc(a, b, C, props, o) {
    o = Object.assign({ entra: 'latigo', sale: 'latigo' }, o || {});
    return p.escena(a - VENT[o.entra], b + VENT[o.sale], C, props, o);
  }
  // primer plano corto que deja fuera de cuadro las placas viejas de abajo
  function tapar(a, b, o) {
    return p.camara(a - 0.2, b + 0.2, Object.assign({ zoom: 1.3, foco: [0.47, 0.385] }, o || {}));
  }
  // frase clave abajo, palabra por palabra al ritmo de la voz
  function dice(frase, desde, dur, o, txt) {
    var a = t(frase, desde);
    return p.texto(a - 0.05, a + (dur || 1.8), txt || frase, o);
  }

  /* =========================================================
     PIEZAS PROPIAS
     ========================================================= */

  // reloj de linea con la aguja roja girando
  function Reloj(props) {
    var T = props.T, tam = props.tam || 200;
    var en = mov.entra(T, props.c, { dy: 20, desde: 0.2 });
    var a = (T - props.c) * (props.vueltas || 1.4) * 360;
    return (
      <E.Pos x={props.x} y={props.y} e={en}>
        <svg width={tam} height={tam} viewBox="0 0 200 200" style={{ display: 'block', overflow: 'visible' }}>
          <circle cx="100" cy="106" r="74" fill={BLANCO} stroke={INK} strokeWidth="8" />
          <path d="M 84 20 L 116 20 M 100 20 L 100 32" stroke={INK} strokeWidth="8" strokeLinecap="round" />
          <path d={'M 100 106 L 100 70'} stroke={INK} strokeWidth="8" strokeLinecap="round" transform={'rotate(' + (a / 12).toFixed(1) + ' 100 106)'} />
          <path d={'M 100 106 L 100 50'} stroke={RED} strokeWidth="6" strokeLinecap="round" transform={'rotate(' + a.toFixed(1) + ' 100 106)'} />
          <circle cx="100" cy="106" r="7" fill={INK} />
        </svg>
      </E.Pos>
    );
  }

  // corazon que late
  function Corazon(props) {
    var T = props.T;
    var en = mov.entra(T, props.c, { dy: 10, desde: 0.4, ease: Easing.easeOutBack, dur: 0.6 });
    var lat = 1 + 0.06 * Math.max(0, Math.sin((T - props.c) * 7.5)) * (T > props.c + 0.4 ? 1 : 0);
    return (
      <E.Pos x={props.x} y={props.y} e={en} esc={lat}>
        <E.Ico n={props.acento ? 'corazon-a' : 'corazon'} p={1} tam={props.tam || 260} acento={props.acento} />
      </E.Pos>
    );
  }

  // pildora de texto (una excusa, un pensamiento)
  function Pildora(props) {
    return (
      <div style={{ background: props.fondo || GRY, color: INK, fontFamily: F, fontWeight: 800, fontSize: props.fs || 40, letterSpacing: '-0.02em',
        padding: '18px 32px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: L.SOMBRA_CHICA }}>{props.children}</div>
    );
  }

  /* =========================================================
     ESCENAS PROPIAS DE ESTE VIDEO (las originales, rehechas)
     ========================================================= */

  // la meta tiene un precio: diana con su etiqueta colgando y alguien que la mira
  function EscPrecio(props) {
    var T = props.T, at = props.at;
    var cTag = at + 0.3, cFig = t('poca gente', 69);
    var balanceo = Math.exp(-Math.max(0, T - cTag) * 2.2) * Math.sin(Math.max(0, T - cTag) * 9) * 14;
    var pTag = mov.prog(T, cTag, 0.5);
    var hilo = mov.prog(T, cTag - 0.1, 0.4, Easing.easeInOutCubic);
    return (
      <X.Marco p={props}>
        <E.Icono T={T} n="diana" x={1300} y={500} c={at} tam={400} />
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
          <path d="M 1150 360 Q 1040 330 930 380" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" pathLength={1}
            strokeDasharray="1 1" strokeDashoffset={1 - hilo} />
        </svg>
        <div style={{ position: 'absolute', left: 930, top: 380, transformOrigin: '0 0', opacity: clamp((T - cTag) / 0.15, 0, 1),
          transform: 'rotate(' + (12 + balanceo).toFixed(2) + 'deg) translate(-40px, ' + ((1 - pTag) * -30).toFixed(1) + 'px)' }}>
          <svg width={330} height={180} viewBox="0 0 330 180" style={{ display: 'block', overflow: 'visible', transform: 'scaleX(-1)' }}>
            <path d="M 6 90 L 70 14 L 316 14 L 316 166 L 70 166 Z" fill={BLANCO} stroke={INK} strokeWidth="8" strokeLinejoin="round" />
            <circle cx="62" cy="90" r="12" fill={YEL} stroke={INK} strokeWidth="6" />
          </svg>
          <div style={{ position: 'absolute', left: 30, top: 32, fontFamily: F, fontWeight: 900, fontSize: 76, letterSpacing: '-0.04em', color: INK, lineHeight: 1 }}>1.000</div>
          <div style={{ position: 'absolute', left: 36, top: 112, fontFamily: F_MONO, fontWeight: 600, fontSize: 30, color: TENUE }}>horas</div>
        </div>
        <E.Figura T={T} x={430} y={880} c={Math.min(cFig, at + 0.4)} tam={360} pose="piensa" />
        <X.Rotulo T={T} txt="El precio real" x={1300} y={860} c={t('dispuesta', 70)} tam={1.2} />
      </X.Marco>
    );
  }

  // obligar al cerebro a ver videos como este: la busqueda en YouTube
  function EscBusqueda(props) {
    var T = props.T, at = props.at;
    var q = 'cómo ser disciplinado';
    var n = Math.round(q.length * clamp((T - at - 0.1) / 0.9, 0, 1));
    var cursor = Math.floor((T - at) * 2.4) % 2 === 0;
    return (
      <X.Marco p={props}>
        <E.Tarjeta T={T} x={960} y={540} c={at - 0.1} w={1320} h={760} radio={36} giroY={0} quieto>
          <div style={{ position: 'absolute', left: 60, right: 60, top: 54, height: 96, borderRadius: 48, border: '4px solid rgba(20,17,15,0.15)',
            display: 'flex', alignItems: 'center', padding: '0 36px', gap: 22 }}>
            <svg width="44" height="44" viewBox="0 0 200 200"><E.Trazos lista={L.I.lupa} p={1} grosor={14} /></svg>
            <div style={{ fontFamily: F, fontWeight: 700, fontSize: 46, color: INK, letterSpacing: '-0.01em' }}>
              {q.slice(0, n)}<span style={{ opacity: cursor ? 1 : 0, color: TENUE }}>|</span>
            </div>
          </div>
          {[0, 1, 2].map(function (i) {
            var en = mov.entra(T, at + 1.0 + i * 0.22, { dy: 40, blur: 8 });
            return (
              <div key={i} style={{ position: 'absolute', left: 60, right: 60, top: 200 + i * 180, height: 150, display: 'flex', gap: 34,
                opacity: en.opacity, transform: 'translateY(' + en.y.toFixed(1) + 'px)', filter: en.blur > 0.2 ? 'blur(' + en.blur.toFixed(1) + 'px)' : undefined }}>
                <div style={{ width: 266, height: 150, borderRadius: 16, background: i === 0 ? YEL : '#E4E1DB', position: 'relative' }}>
                  <div style={{ position: 'absolute', right: 10, bottom: 10, background: INK, color: BLANCO, fontFamily: F_MONO, fontSize: 20,
                    padding: '2px 8px', borderRadius: 6 }}>{['11:47', '8:38', '20:47'][i]}</div>
                </div>
                <div style={{ flex: 1, paddingTop: 10 }}>
                  <div style={{ height: 30, width: ['86%', '72%', '80%'][i], borderRadius: 15, background: 'rgba(20,17,15,0.75)' }} />
                  <div style={{ height: 22, width: '38%', borderRadius: 11, background: 'rgba(20,17,15,0.18)', marginTop: 22 }} />
                  <div style={{ height: 22, width: '58%', borderRadius: 11, background: 'rgba(20,17,15,0.12)', marginTop: 14 }} />
                </div>
              </div>
            );
          })}
        </E.Tarjeta>
      </X.Marco>
    );
  }

  // al cerebro le encantan el placer y el confort: el cerebro en el sofa, la bateria se carga
  function EscConfort(props) {
    var T = props.T, at = props.at;
    var cP = t('placer', 112), cC = t('confort', 113);
    var nivel = 0.3 + 0.65 * Easing.easeInOutCubic(clamp((T - cP) / 1.4, 0, 1));
    return (
      <X.Marco p={props}>
        <E.Icono T={T} n="sofa" x={620} y={600} c={at} tam={480} />
        <E.Icono T={T} n="cerebro" x={620} y={470} c={at + 0.25} tam={230} />
        <E.Icono T={T} n="control" x={960} y={760} c={cP - 0.2} tam={170} rot={-24} />
        <X.BateriaGrande T={T} x={1380} y={450} c={cP} nivel={nivel} verde />
        <X.Rotulo T={T} txt="Placer y confort" x={1380} y={680} c={cC} tam={1.2} />
      </X.Marco>
    );
  }

  // contra la corriente: todo empuja hacia atras y el sigue hacia adelante
  function EscCorriente(props) {
    var T = props.T, at = props.at;
    var filas = [];
    for (var r = 0; r < 4; r++) {
      for (var k = 0; k < 9; k++) {
        var x = ((k * 260 - (T - at) * 300 * (r % 2 ? 1.2 : 1) + r * 90) % 2340 + 2340) % 2340 - 210;
        filas.push(
          <svg key={r + '-' + k} width="150" height="50" style={{ position: 'absolute', left: x, top: 170 + r * 230, opacity: 0.8 }}>
            <path d="M 140 25 L 20 25 M 46 6 L 18 25 L 46 44" fill="none" stroke={GRY} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      }
    }
    return (
      <X.Marco p={props}>
        {filas}
        <E.Figura T={T} x={900} y={840} c={at} tam={420} pose="camina" fase={(T - at) * 1.1} />
        <E.Flecha T={T} de={[800, 330]} a={[1120, 330]} c={at + 0.5} grosor={14} color="amarillo" />
        <X.Rotulo T={T} txt="Contra la corriente" x={960} y={960} c={t('contra', 115)} tam={1.25} />
      </X.Marco>
    );
  }

  // tu tambien puedes: de la masa gris a la persona disciplinada
  function EscTuTambien(props) {
    var T = props.T, at = props.at;
    var cG = t('convertir', 185);
    var anillo = mov.prog(T, cG - 0.2, 0.6, Easing.easeOutBack);
    return (
      <X.Marco p={props}>
        {[0, 1, 2].map(function (i) {
          return <E.Figura key={i} T={T} x={280 + i * 130} y={820} c={at + i * 0.08} tam={220} color={GRY} grosor={6} />;
        })}
        <E.Flecha T={T} de={[660, 690]} a={[1060, 690]} c={t('tú que estás', 182) + 0.6} grosor={9} />
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <circle cx={1400} cy={600} r={260 * anillo} fill="none" stroke={YEL} strokeWidth={16} />
        </svg>
        <E.Figura T={T} x={1400} y={880} c={at + 0.1} tam={480} pose={T > cG ? { de: 'depie', a: 'brazos', k: clamp((T - cG) / 0.4, 0, 1) } : 'depie'} />
        <E.Icono T={T} n="bombillo" x={1640} y={300} c={cG + 0.2} tam={170} />
        <X.Rotulo T={T} txt="Tú también puedes" x={1400} y={980} c={cG + 0.4} tam={1.2} />
      </X.Marco>
    );
  }

  // con la motivacion en cero la persona disciplinada trabaja igual
  function EscMotivacionCero(props) {
    var T = props.T, at = props.at;
    var cM = t('estar o no', 197), cT = cM + 0.9;
    var nivel = 0.62 * (1 - Easing.easeInOutCubic(clamp((T - at - 0.2) / 1.6, 0, 1)));
    return (
      <X.Marco p={props}>
        <X.BateriaGrande T={T} x={480} y={480} c={at} nivel={nivel} />
        <X.Rotulo T={T} txt="Motivación en cero" x={480} y={680} c={cM} tam={1.1} />
        <E.Flecha T={T} de={[790, 520]} a={[1040, 520]} c={cM + 0.25} grosor={9} />
        <E.Figura T={T} x={1360} y={760} c={cM + 0.4} tam={360} pose="sentado" />
        <E.Icono T={T} n="laptop" x={1530} y={650} c={cM + 0.55} tam={200} />
        <X.Rotulo T={T} txt="Trabaja igual" x={1420} y={880} c={cT} tam={1.1} />
        <E.Check T={T} x={1680} y={430} c={cT + 0.3} tam={110} />
      </X.Marco>
    );
  }

  // el tu de hoy y tu yo del futuro (se usa dos veces)
  function EscFuturo(props) {
    var T = props.T, at = props.at;
    var cG = props.cGrande, cF = props.cFlecha, cB = props.cBombillo;
    return (
      <X.Marco p={props}>
        <E.Figura T={T} x={430} y={870} c={at} tam={250} />
        <X.Rotulo T={T} txt="El tú de hoy" x={430} y={950} c={at + 0.2} tam={1} />
        <E.Flecha T={T} de={[560, 760]} a={[1180, 520]} c={cF} grosor={8} color={GRY} dur={0.7} />
        <E.Figura T={T} x={1400} y={880} c={cG} tam={560} />
        <E.Icono T={T} n="bombillo" x={1650} y={260} c={cB} tam={180} />
        <X.Rotulo T={T} txt={props.txtFuturo || 'Tu yo del futuro'} x={1400} y={975} c={props.cTxt} tam={1.15} />
      </X.Marco>
    );
  }

  // la campana: la media gris y alguien que se sale de ella
  function EscCampana(props) {
    var T = props.T, at = props.at;
    var pts = [];
    for (var i = 0; i <= 60; i++) {
      var u = i / 60, x = 200 + 1520 * u, z = (u - 0.45) / 0.15;
      pts.push((i ? 'L ' : 'M ') + x.toFixed(1) + ' ' + (820 - 560 * Math.exp(-z * z / 2)).toFixed(1));
    }
    var pc = mov.prog(T, at - 0.1, 1.0, Easing.easeInOutCubic);
    var cFuera = t('dejar de ser', 306) + 0.4, cMedia = t('de la media', 307);
    var anillo = mov.prog(T, cFuera + 0.2, 0.5, Easing.easeOutBack);
    return (
      <X.Marco p={props}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d="M 160 820 L 1760 820" stroke={TENUE} strokeWidth="5" strokeLinecap="round" />
          <path d={pts.join(' ')} fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pc} />
          <circle cx={1580} cy={700} r={130 * anillo} fill="none" stroke={YEL} strokeWidth={14} />
        </svg>
        {[0, 1, 2, 3, 4].map(function (k) {
          return <E.Figura key={k} T={T} x={640 + k * 110} y={800} c={at + 0.4 + k * 0.12} tam={200} color={GRY} grosor={6} />;
        })}
        <X.Rotulo T={T} txt="La media" x={860} y={900} c={cMedia} tam={1.05} />
        <E.Figura T={T} x={1580} y={800} c={cFuera} tam={240} />
        <X.Rotulo T={T} txt="Fuera de la media" x={1580} y={900} c={cFuera + 0.4} tam={1.05} />
      </X.Marco>
    );
  }

  // romper la barrera: el muro de ladrillos sale volando y aparece la meta
  function EscBarrera(props) {
    var T = props.T, at = props.at;
    var cR = t('físicas', 318);
    var ladrillos = [];
    for (var f = 0; f < 6; f++) {
      for (var k = 0; k < 3; k++) {
        var x = 870 + k * 130 + (f % 2 ? 65 : 0) - 65, y = 820 - f * 74;
        var s = Math.max(0, T - cR);
        var dir = (k - 1) + (f % 2 ? 0.5 : -0.5);
        var dx = dir * 900 * s, dy = -520 * s + 1400 * s * s;
        var rot = dir * 200 * s;
        var en = mov.entra(T, at + 0.03 * (f * 3 + k), { dy: 0, blur: 0, desde: 0.3, dur: 0.35 });
        ladrillos.push(
          <div key={f + '-' + k} style={{ position: 'absolute', left: x - 60, top: y - 34, width: 120, height: 64, borderRadius: 10, background: GRY,
            border: '6px solid ' + INK, boxSizing: 'border-box', opacity: en.opacity * (1 - clamp((s - 0.35) / 0.25, 0, 1)),
            transform: 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg) scale(' + en.escala.toFixed(3) + ')' }} />
        );
      }
    }
    return (
      <X.Marco p={props}>
        <E.Figura T={T} x={460} y={860} c={at} tam={380} pose={T < cR ? 'empuja' : { de: 'empuja', a: 'camina', k: clamp((T - cR) / 0.3, 0, 1) }} />
        {ladrillos}
        <E.Icono T={T} n="diana" x={1580} y={600} c={cR + 0.3} tam={300} />
        <X.Rotulo T={T} txt="Rompe las barreras" x={460} y={960} c={t('rompas', 317)} tam={1.15} />
      </X.Marco>
    );
  }

  // la voz del entorno dice "relajate" y el sigue igual
  function EscVozEntorno(props) {
    var T = props.T, at = props.at;
    var c1 = t('amargarse', 336), c2 = t('la vida es una', 339);
    var b1 = mov.entra(T, c1, { dy: 20, desde: 0.2, ease: Easing.easeOutBack });
    var b2 = mov.entra(T, c2, { dy: 20, desde: 0.2, ease: Easing.easeOutBack });
    return (
      <X.Marco p={props}>
        <E.Icono T={T} n="mensaje" x={420} y={620} c={at} tam={280} />
        <E.Pos x={560} y={300} e={b1}><Pildora>¿Para qué amargarse?</Pildora></E.Pos>
        <E.Pos x={520} y={420} e={b2}><Pildora>La vida es una</Pildora></E.Pos>
        <X.Rotulo T={T} txt="La voz del entorno" x={420} y={860} c={at + 0.4} tam={1.1} />
        <E.Figura T={T} x={1400} y={860} c={at + 0.3} tam={420} pose="camina" fase={(T - at) * 1.2} />
        <X.Rotulo T={T} txt="Sigue igual" x={1400} y={960} c={c2 + 0.5} tam={1.1} />
        <E.Check T={T} x={1640} y={420} c={c2 + 0.8} tam={110} />
      </X.Marco>
    );
  }

  // dos caminos: el facil baja hacia el sofa, el dificil sube hacia la meta
  function EscCaminos(props) {
    var T = props.T, at = props.at;
    var cD = at + 1.0;
    var k = Easing.easeInOutSine(clamp((T - cD) / 2.8, 0, 1));
    var x = 380 + (1300 - 380) * k, y = 560 - (560 - 300) * k;
    return (
      <X.Marco p={props}>
        <E.Linea T={T} de={[380, 560]} a={[1400, 880]} c={at - 0.1} grosor={8} color={GRY} />
        <E.Icono T={T} n="sofa" x={1520} y={860} c={at + 0.2} tam={220} />
        <X.Rotulo T={T} txt="Camino fácil" x={1040} y={860} c={t('camino fácil', 345)} tam={1} fondo={GRY} />
        <E.Linea T={T} de={[380, 560]} a={[1420, 250]} c={at + 0.4} grosor={10} />
        <E.Icono T={T} n="diana" x={1540} y={220} c={at + 0.8} tam={220} />
        <X.Rotulo T={T} txt="El difícil" x={900} y={310} c={at + 0.9} tam={1} />
        <E.Figura T={T} x={x} y={y} c={at} tam={300} pose={T > cD ? 'camina' : 'depie'} fase={(T - cD) * 1.4} />
        <E.Tacha T={T} x={1520} y={720} c={t('simplemente no van', 347) + 0.4} tam={100} />
      </X.Marco>
    );
  }

  // una sola decision: la torre y la pieza roja (fase 1 quieta, fase 2 se cae)
  function EscTorre(props) {
    var T = props.T, at = props.at;
    var cSaca = props.cSaca, fase2 = props.fase === 2;
    var pieza = function (i) {
      var roja = i === 3;
      var y = 880 - i * 92;
      var dx = 0, dy = 0, rot = 0;
      if (fase2 && roja) dx = -260 * Easing.easeOutCubic(clamp((T - cSaca) / 0.45, 0, 1));
      if (fase2 && i > 3) {
        var s = clamp((T - cSaca - 0.4) / 0.7, 0, 1);
        rot = 32 * Easing.easeInQuad(s) * (i % 2 ? 1 : 1.3);
        dx = 160 * Easing.easeInQuad(s) + (i - 4) * 70 * s;
        dy = 92 * (i - 3) * Easing.easeInQuad(s) + 40 * s;
      }
      var en = fase2 ? { opacity: 1, x: 0, y: 0, escala: 1, blur: 0 } : mov.entra(T, at - 0.2 + 0.05 * i, { dy: -40, blur: 4 });
      return (
        <div key={i} style={{ position: 'absolute', left: 560 - 170, top: y - 40, width: 340, height: 80, borderRadius: 14,
          background: roja ? RED : BLANCO, border: '7px solid ' + INK, boxSizing: 'border-box', opacity: en.opacity,
          transform: 'translate(' + (dx + en.x).toFixed(1) + 'px,' + (dy + en.y).toFixed(1) + 'px) rotate(' + rot.toFixed(1) + 'deg)',
          transformOrigin: '100% 100%' }} />
      );
    };
    var apaga = fase2 ? clamp((T - cSaca - 0.9) / 0.4, 0, 1) : 0;
    return (
      <X.Marco p={props}>
        <E.Linea T={T} de={[260, 925]} a={[1700, 925]} c={at - 0.3} grosor={5} color={TENUE} />
        {[0, 1, 2, 3, 4, 5].map(pieza)}
        <div style={{ position: 'absolute', inset: 0, filter: 'grayscale(' + apaga.toFixed(2) + ')', opacity: 1 - 0.35 * apaga }}>
          <E.Icono T={T} n="diana" x={1380} y={560} c={fase2 ? at - 1 : at + 0.2} tam={340} />
        </div>
        {fase2 ? <E.Tacha T={T} x={1520} y={410} c={cSaca + 1.0} tam={120} /> : null}
        <X.Rotulo T={T} txt="Una sola decisión" x={fase2 ? 560 : 900} y={fase2 ? 980 : 380} c={fase2 ? at - 1 : t('milésimas', 357)} tam={1.1} dir={fase2 ? 'ninguna' : 'izq'} />
      </X.Marco>
    );
  }

  // postergar: la persona que quieres ser se aleja un paso
  function EscAleja(props) {
    var T = props.T, at = props.at;
    var cA = t('postergan', 365);
    var dx = 240 * Easing.easeInOutCubic(clamp((T - cA) / 1.2, 0, 1));
    return (
      <X.Marco p={props}>
        <E.Figura T={T} x={420} y={880} c={at} tam={300} />
        <E.Linea T={T} de={[540, 640]} a={[1240 + dx, 560]} c={at + 0.1} grosor={6} color={GRY} punteada />
        <E.Figura T={T} x={1380 + dx} y={880} c={at + 0.1} tam={520} pose={T > cA ? 'camina' : 'depie'} fase={(T - cA) * 1.2} />
        <X.Rotulo T={T} txt="Se aleja un paso" x={860} y={460} c={cA + 0.3} tam={1.15} />
      </X.Marco>
    );
  }

  // la disciplina es un musculo: las pesas crecen x1, x2, x3
  function EscMusculo(props) {
    var T = props.T, at = props.at;
    var cs = [at + 0.3, at + 1.0, at + 1.7];
    var crece = 1 + 0.5 * clamp((T - at) / 2.4, 0, 1);
    var bombeo = Math.sin((T - at) * 9) * 10;
    return (
      <X.Marco p={props}>
        <E.Figura T={T} x={480} y={900} c={at} tam={500} pose="carga" />
        <E.Pos x={480} y={440 + bombeo} e={{ opacity: 1, x: 0, y: 0, escala: crece, blur: 0 }}>
          <E.Ico n="pesa" p={1} tam={300} />
        </E.Pos>
        {['×1', '×2', '×3'].map(function (s, i) {
          var en = mov.entra(T, cs[i], { dy: 30, desde: 0.3, ease: Easing.easeOutBack, dur: 0.5 });
          return (
            <E.Pos key={i} x={980 + i * 220} y={700 - i * 130} e={en}>
              <div style={{ fontFamily: F, fontWeight: 900, fontSize: 130 + i * 30, letterSpacing: '-0.04em', color: i === 2 ? GRN : INK }}>{s}</div>
            </E.Pos>
          );
        })}
        <X.Rotulo T={T} txt="Se entrena a diario" x={1300} y={900} c={t('todos los días', 386)} tam={1.15} />
      </X.Marco>
    );
  }

  // las areas de la vida: las fichas se acomodan solas (orden casi obsesivo)
  function EscOrden(props) {
    var T = props.T, at = props.at;
    var cO = at + 1.4;
    var k = Easing.easeOutBack(clamp((T - cO) / 0.8, 0, 1));
    var iconos = ['pesa', 'laptop', 'dinero', 'corazon', 'cama', 'libro'];
    var desorden = [[-14, -40], [9, 30], [-6, -10], [16, 50], [-11, -30], [7, 20]];
    return (
      <X.Marco p={props}>
        {iconos.map(function (n, i) {
          var x = 330 + i * 252, y = 440;
          var d = desorden[i];
          var en = mov.entra(T, at + 0.08 * i, { dy: 30, blur: 6 });
          return (
            <div key={n} style={{ position: 'absolute', left: x - 105, top: y - 105, width: 210, height: 210, borderRadius: 34,
              background: i === 5 ? YEL : BLANCO, boxShadow: L.SOMBRA_CHICA, opacity: en.opacity, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'translateY(' + (en.y + d[1] * (1 - k)).toFixed(1) + 'px) rotate(' + (d[0] * (1 - k)).toFixed(2) + 'deg)' }}>
              <E.Ico n={n} p={1} tam={140} />
            </div>
          );
        })}
        <E.Linea T={T} de={[230, 700]} a={[1580, 700]} c={cO + 0.6} grosor={5} color={TENUE} dur={0.9} />
        {[0, 1, 2, 3, 4, 5, 6].map(function (i) {
          return <E.Linea key={i} T={T} de={[230 + i * 225, 680]} a={[230 + i * 225, 720]} c={cO + 0.7 + i * 0.08} grosor={5} dur={0.2} />;
        })}
        <E.Check T={T} x={1700} y={700} c={cO + 1.4} tam={110} />
        <X.Rotulo T={T} txt="Todo en orden" x={900} y={850} c={cO + 0.9} tam={1.2} />
      </X.Marco>
    );
  }

  // la energia del dia: lo dificil temprano (fase 1), lo facil al final (fase 2)
  function EscEnergia(props) {
    var T = props.T, at = props.at, fase = props.fase;
    var cD = props.cDificil, cF = props.cFacil;
    var bloque = function (x, y, color, c, key, txt) {
      var en = mov.entra(T, c, { dy: -40, desde: 0.2, ease: Easing.easeOutBack, dur: 0.5 });
      return (
        <E.Pos key={key} x={x} y={y} e={en}>
          <div style={{ width: 230, height: 70, borderRadius: 14, background: color, boxShadow: L.SOMBRA_CHICA, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: F, fontWeight: 800, fontSize: 32, color: INK }}>{txt}</div>
        </E.Pos>
      );
    };
    return (
      <X.Marco p={props}>
        <E.Grafico T={T} x={300} y={880} w={1400} h={600} c={fase === 1 ? at - 0.2 : at - 3} ejeX="hora del día" ejeY="energía"
          curvas={[{ puntos: [[0, 0.95], [0.3, 0.78], [0.6, 0.4], [1, 0.12]], color: 'negro', grosor: 10, c: fase === 1 ? at : at - 3, dur: 1.0 }]} />
        {bloque(560, 380, YEL, fase === 1 ? cD : at - 3, 'd1', 'Lo difícil')}
        {bloque(820, 470, YEL, fase === 1 ? cD + 0.5 : at - 3, 'd2', 'Lo pesado')}
        {fase === 2 ? bloque(1380, 700, GRY, cF, 'f1', 'Lo fácil') : null}
        {fase === 2 ? bloque(1600, 760, GRY, cF + 0.5, 'f2', 'Lo irrelevante') : null}
        <X.Rotulo T={T} txt={fase === 1 ? 'Energía del día' : 'Lo duro temprano'} x={fase === 1 ? 1300 : 1200} y={300}
          c={fase === 1 ? cD + 0.9 : cF + 0.9} tam={1.1} dir="izq" />
      </X.Marco>
    );
  }

  // la meta del canal: de 634 a 700 suscriptores
  function EscMetaCanal(props) {
    var T = props.T, at = props.at;
    var c7 = t('700', 600);
    var k = Easing.easeInOutCubic(clamp((T - c7) / 2.4, 0, 1));
    var v = Math.round(634 + 66 * k);
    var en = mov.entra(T, at, { dy: 30 });
    var en7 = mov.entra(T, c7 - 0.2, { dy: 20 });
    return (
      <X.Marco p={props}>
        <E.Pos x={300} y={400} e={en} ancla="izq">
          <div style={{ fontFamily: F, fontWeight: 900, fontSize: 280, letterSpacing: '-0.05em', color: INK, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
          <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 40, color: TENUE, marginTop: 10 }}>suscriptores</div>
        </E.Pos>
        <E.Pos x={1620} y={400} e={en7} ancla="der">
          <div style={{ fontFamily: F, fontWeight: 900, fontSize: 160, letterSpacing: '-0.05em', color: GRY, lineHeight: 0.9 }}>700</div>
          <div style={{ fontFamily: F_MONO, fontWeight: 600, fontSize: 32, color: TENUE, marginTop: 8, textAlign: 'right' }}>la meta</div>
        </E.Pos>
        <div style={{ position: 'absolute', left: 300, top: 700, width: 1320, height: 64, borderRadius: 32, background: 'rgba(20,17,15,0.1)',
          opacity: en.opacity, overflow: 'hidden' }}>
          <div style={{ height: '100%', borderRadius: 32, background: GRN, width: (100 * (0.9 + 0.1 * k)).toFixed(2) + '%' }} />
        </div>
      </X.Marco>
    );
  }

  // tu apoyo -> mejor calidad (se usa dos veces)
  function EscCalidad(props) {
    var T = props.T, at = props.at;
    var cP = props.cPlay;
    var ep = mov.entra(T, cP, { dy: 40, desde: 0.25, dur: 0.9 });
    return (
      <X.Marco p={props}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
          return <E.Figura key={i} T={T} x={260 + (i % 3) * 150} y={420 + Math.floor(i / 3) * 210} c={at + 0.04 * i} tam={180} grosor={6} />;
        })}
        <E.Flecha T={T} de={[760, 560]} a={[980, 560]} c={cP - 0.2} grosor={9} />
        <E.Pos x={1400} y={540} e={ep}>
          <div style={{ width: 680, height: 400, borderRadius: 30, background: INK, boxShadow: L.SOMBRA, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: 130, height: 130, marginLeft: -65, marginTop: -65, borderRadius: 65, background: YEL,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="60" height="60" viewBox="0 0 60 60"><path d="M 18 10 L 50 30 L 18 50 Z" fill={INK} /></svg>
            </div>
            <div style={{ position: 'absolute', left: 30, right: 30, bottom: 28, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.2)' }}>
              <div style={{ height: '100%', borderRadius: 5, background: RED, width: (100 * mov.prog(T, cP + 0.4, 2.5, Easing.linear)).toFixed(1) + '%' }} />
            </div>
          </div>
        </E.Pos>
        <X.Rotulo T={T} txt="Mejor calidad" x={1400} y={830} c={cP + 0.6} tam={1.15} />
        <E.Check T={T} x={1740} y={330} c={cP + 1.1} tam={110} />
      </X.Marco>
    );
  }

  // la disciplina es el arbol; la raiz, el proposito
  function EscArbol(props) {
    var T = props.T, at = props.at;
    var raices = ['M 760 700 C 740 780 640 820 560 900', 'M 760 700 C 762 790 770 860 760 960', 'M 760 700 C 790 770 880 800 960 880',
      'M 760 700 C 700 760 690 800 650 840', 'M 760 700 C 830 740 900 760 1000 770'];
    return (
      <X.Marco p={props}>
        <E.Linea T={T} de={[300, 700]} a={[1700, 700]} c={at - 0.3} grosor={5} color={TENUE} />
        <E.Icono T={T} n="arbol" x={760} y={470} c={at - 0.2} tam={500} quieto />
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          {raices.map(function (d, i) {
            var pr = mov.prog(T, at + 0.2 + i * 0.25, 0.7, Easing.easeInOutCubic);
            return <path key={i} d={d} fill="none" stroke={i === 1 ? YEL : INK} strokeWidth={i === 1 ? 14 : 9} strokeLinecap="round" pathLength={1}
              strokeDasharray="1 1" strokeDashoffset={1 - pr} />;
          })}
        </svg>
        <X.Rotulo T={T} txt="Disciplina" x={1180} y={360} c={at + 0.3} tam={1.1} dir="izq" />
        <X.Rotulo T={T} txt="La raíz: el propósito" x={1300} y={880} c={t('propósito claro', 615) + 1.2} tam={1.15} dir="izq" />
      </X.Marco>
    );
  }

  // sin proposito las excusas te tumban; con proposito rebotan
  function EscExcusas(props) {
    var T = props.T, at = props.at, firme = props.firme;
    var excusas = ['Mañana empiezo', 'No tengo tiempo', 'Hoy no tengo ganas'];
    var cs = props.cs;
    var caida = firme ? 0 : clamp((T - cs[2] - 0.55) / 0.5, 0, 1);
    return (
      <X.Marco p={props}>
        {firme ? (
          <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
            <path d="M 500 900 C 440 930 380 950 300 1000 M 500 900 C 560 930 620 950 700 1000 M 500 900 L 500 1010" fill="none" stroke={YEL}
              strokeWidth="12" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - mov.prog(T, at, 0.8, Easing.easeInOutCubic)} />
          </svg>
        ) : null}
        <E.Figura T={T} x={500} y={900} c={at - 0.2} tam={460} pose={caida > 0 ? { de: 'depie', a: 'caido', k: caida } : 'depie'} />
        {excusas.map(function (txt, i) {
          var c = cs[i];
          if (T < c) return null;
          var u = clamp((T - c) / 0.6, 0, 1);
          var x, y = 420 + i * 120, op = 1;
          if (firme) {
            // llega y rebota hacia arriba a la derecha
            var r = clamp((T - c - 0.6) / 0.7, 0, 1);
            x = 1600 - (1600 - 760) * Easing.easeInQuad(u) + 900 * Easing.easeOutCubic(r);
            y = y - 380 * Easing.easeOutCubic(r);
            op = 1 - r;
          } else {
            x = 1600 - (1600 - 720) * Easing.easeInQuad(u);
            op = 1 - clamp((T - c - 0.8) / 0.3, 0, 1);
          }
          return (
            <div key={i} style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%) rotate(' + (firme ? -12 * clamp((T - c - 0.6) / 0.7, 0, 1) : 0) + 'deg)', opacity: op }}>
              <Pildora>{txt}</Pildora>
            </div>
          );
        })}
        <X.Rotulo T={T} txt={firme ? 'Con propósito, rebotan' : 'Sin propósito, caes'} x={1250} y={900} c={cs[1]} tam={1.2} fondo={firme ? GRN : INK} />
      </X.Marco>
    );
  }

  // aunque la gente no entienda
  function EscNoEntienden(props) {
    var T = props.T, at = props.at;
    var cG = t('gente a tu alrededor', 640), cF = t('familia', 642);
    return (
      <X.Marco p={props}>
        <svg width={1920} height={1080} style={{ position: 'absolute', left: 0, top: 0 }}>
          <circle cx={360} cy={900} r={120 * mov.prog(T, at + 0.1, 0.5, Easing.easeOutBack)} fill="none" stroke={YEL} strokeWidth={14} />
        </svg>
        <E.Figura T={T} x={360} y={890} c={at} tam={480} />
        <E.Flecha T={T} de={[560, 700]} a={[980, 640]} c={at + 0.5} grosor={8} color={GRY} />
        {[0, 1, 2].map(function (i) {
          var c = i < 2 ? cG + 0.2 * i : cF;
          return (
            <React.Fragment key={i}>
              <E.Figura T={T} x={1200 + i * 210} y={880} c={c} tam={260} color={GRY} grosor={6} />
              <E.Texto T={T} x={1200 + i * 210} y={540} c={c + 0.3} tam={2.2} peso={900} color={TENUE}>?</E.Texto>
            </React.Fragment>
          );
        })}
        <X.Rotulo T={T} txt="Aunque no entiendan" x={1410} y={960} c={t('no entienda', 643)} tam={1.15} />
      </X.Marco>
    );
  }

  // los sacrificios eran actos de amor propio: las pesas se vuelven un corazon
  function EscAmorPropio(props) {
    var T = props.T, at = props.at;
    var cA = t('actos', 657), cR = t('respeto', 659);
    var se = clamp((T - cA - 0.3) / 0.8, 0, 1);
    return (
      <X.Marco p={props}>
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - 0.75 * se }}>
          {[0, 1, 2].map(function (i) {
            return <E.Icono key={i} T={T} n="pesa" x={420} y={760 - i * 150} c={at + 0.15 * i} tam={260} quieto />;
          })}
        </div>
        <X.Rotulo T={T} txt="Sacrificios" x={420} y={920} c={at + 0.4} tam={1.05} fondo={GRY} />
        <E.Flecha T={T} de={[700, 560]} a={[980, 560]} c={cA - 0.4} grosor={9} />
        <Corazon T={T} x={1340} y={540} c={cA} tam={340} acento={YEL} />
        <X.Rotulo T={T} txt="Actos de amor propio" x={1340} y={800} c={cA + 0.4} tam={1.15} />
        <E.Titulo T={T} x={960} y={960} c={cR} tam={0.72} marcadas={['respeto']}>Respeto por ti mismo</E.Titulo>
      </X.Marco>
    );
  }

  // Topuria: ver para creer, tachado; creer para ver
  function EscTopuria(props) {
    var T = props.T, at = props.at;
    var cV = t('ver para creer', 663), cX = t('al revés', 665), cC = t('tienes que creer', 667);
    return (
      <X.Marco p={props}>
        <E.Titulo T={T} x={960} y={390} c={Math.min(cV, at + 0.4)} tam={1.45} color={T > cX + 0.2 ? GRY : 'negro'} quieto>Ver para creer</E.Titulo>
        <E.Tachon T={T} x={960} y={392} w={1120} c={cX} rot={-3} />
        <E.Titulo T={T} x={960} y={640} c={cC} tam={1.6} marcadas={['creer']}>Creer para ver</E.Titulo>
        <E.Texto T={T} x={960} y={860} c={at + 0.2} mono mayus tam={0.95} color={TENUE}>Ilia Topuria</E.Texto>
      </X.Marco>
    );
  }

  // el 3 queda en pausa: "espera"
  function EscPausa(props) {
    var T = props.T, at = props.at;
    var cP = props.cPausa;
    var en = mov.entra(T, cP, { dy: 0, desde: 0.4, ease: Easing.easeOutBack, dur: 0.5 });
    return (
      <X.Marco p={props}>
        <E.Pos x={420} y={500} e={mov.entra(T, at - 0.1, { dy: 40 })}>
          <div style={{ fontFamily: F, fontWeight: 900, fontSize: 520, letterSpacing: '-0.06em', color: GRY, lineHeight: 0.9 }}>3</div>
        </E.Pos>
        <E.Pos x={1180} y={500} e={en}>
          <div style={{ display: 'flex', gap: 60 }}>
            <div style={{ width: 90, height: 320, borderRadius: 24, background: INK }} />
            <div style={{ width: 90, height: 320, borderRadius: 24, background: INK }} />
          </div>
        </E.Pos>
        <X.Rotulo T={T} txt="Merece su propio capítulo" x={1180} y={800} c={cP + 0.4} tam={1.1} />
      </X.Marco>
    );
  }

  /* =========================================================
     PLAN
     ========================================================= */

  var plan = [
    /* ---------------- INTRO ---------------- */
    dice('una sola frase', 0, 1.9, { marcadas: ['frase'] }, 'en una sola frase'),
    tapar(3.4, 4.6, { mov: 'golpe' }),
    p.texto(t('sería la siguiente', 2) - 0.05, 4.4, 'sería la siguiente…', {}),
    esc(4.6, 11.4, X.Comparar, {
      izq: { arriba: 'Ignorar lo que quieres', titulo: 'HOY', color: 'rojo', n: 'celular', txt: 'Lo que quieres hoy', c: t('ignorar', 4), mal: t('hoy', 6) + 0.2 },
      der: { arriba: 'Para conseguir lo que quieres', titulo: 'MAÑANA', color: 'verde', n: 'diana', txt: 'Lo que quieres mañana', c: t('para poder', 7), cIco: t('quieres', 9), bien: t('mañana', 9) + 0.1 },
      cCon: t('para poder', 7) - 0.3, encabezado: 'La disciplina es…', yTit: 310, yIco: 600, yTxt: 860 }, { entra: 'latigo', sale: 'latigo' }),
    p.detras(t('preciso momento', 12) - 0.1, 14.68, 'AHORA', { color: 'amarillo' }),
    esc(14.9, 18.8, X.Balanza, { encabezado: 'En el fondo lo sabes', hacia: 'der', cGira: t('traerá', 15),
      izq: { n: 'dona', txt: 'Placer ahora', c: 14.9, tam: 170 },
      der: { txt: 'Problemas después', c: t('sabes', 15), cosas: [{ n: 'bloque', c: t('sabes', 15) }, { n: 'bloque', c: t('que te', 16) }, { n: 'reloj', c: t('al final', 16) }] } },
    { entra: 'zoom', sale: 'latigo' }),
    dice('simplista', 20, 2.2, { marcadas: ['simplista'] }, 'un poco simplista'),
    tapar(22.8, 23.8),
    esc(23.7, 26.9, X.Capas, { encabezado: 'La disciplina', izqTxt: 'Lo simple', cMas: t('muchísimos', 24) + 0.4,
      rotulo: { txt: 'Hay muchas más capas', c: t('conceptos', 25) } }, { entra: 'barrido', sale: 'latigo' }),
    dice('de realmente ser disciplinados', 29, 2.4, { marcadas: ['disciplinados.'] }, 'ser disciplinados de verdad'),
    tapar(31.0, 32.2),
    dice('quédate en este video', 31.5, 2.2, { marcadas: ['video'] }),
    esc(34.4, 43.9, X.Opciones, { encabezado: 'En este video', cols: 2, activo: 'ultimo', etiquetasDesde: 34.3, y: 440, altoFila: 330, fs: 66,
      prefijo: 'Parte ', items: [
        { texto: 'Cómo funciona la disciplina', c: t('cómo funciona', 33) },
        { texto: 'Las características de los disciplinados', c: t('características', 35) },
        { texto: 'Por qué deberías serlo', c: t('por qué deberías', 37) },
        { texto: 'Cómo serlo en tu vida diaria', c: t('cómo ser disciplinado', 40) }] }, { entra: 'barrido', sale: 'latigo' }),
    dice('acompáñanos', 43, 1.5, { marcadas: ['acompáñanos.'] }, 'acompáñanos.'),

    /* ---------------- CAPITULO 1 ---------------- */
    p.capitulo(45.4 - VENT.barrido, 47.9 + VENT.latigo, { n: 1, de: 3, titulo: '¿Por qué cuesta tanto ser disciplinado?', corto: 'Por qué cuesta tanto',
      entra: 'barrido', sale: 'latigo' }),
    p.mantener(49.0, 53.4),
    dice('mejorar nuestras vidas', 49, 2.4, { marcadas: ['mejorar'] }),
    tapar(53.4, 55.8),
    dice('presente', 53, 2.6, { marcadas: ['futuro.'] }, 'presente y futuro'),
    esc(56.7, 60.9, X.Barras, { encabezado: 'Altas en el gimnasio · por mes', nota: 'Fuente: IHRSA · altas de enero', alto: 470, base: 840,
      barras: [{ v: 100, txt: 'ENE', color: 'amarillo', c: 56.9 }, { v: 88, txt: 'FEB', color: 'amarillo' }, { v: 64, txt: 'MAR', color: 'gris' },
        { v: 58, txt: 'ABR', color: 'gris' }, { v: 55, txt: 'MAY', color: 'gris' }, { v: 52, txt: 'JUN', color: 'gris' }, { v: 51, txt: 'JUL', color: 'gris' },
        { v: 50, txt: 'AGO', color: 'gris' }, { v: 50, txt: 'SEP', color: 'gris' }, { v: 49, txt: 'OCT', color: 'gris' }, { v: 49, txt: 'NOV', color: 'gris' },
        { v: 48, txt: 'DIC', color: 'gris' }].map(function (b) { return Object.assign(b, { valor: '' }); }),
      extra: function (T) {
        return (
          <React.Fragment>
            <E.Num T={T} x={1250} y={330} c={t('pocas personas', 57) + 0.3} hasta={50} sufijo="%" tam={1.2} color={RED} dur={0.8} />
            <E.Rot T={T} x={1250} y={460} c={t('realmente', 59)} dir="ninguna" tam={1.1}>La mitad se va</E.Rot>
          </React.Fragment>
        );
      } }, { entra: 'latigo', sale: 'latigo' }),
    p.titular(t('esfuerzos y sacrificios', 60) - 0.1, 63.3, 'Esfuerzos y\nsacrificios', { marcadas: ['sacrificios'] }),
    esc(63.6, 67.3, X.Pensamiento, { x: 560, c: 63.6, cNube: 63.8, piensa: [{ n: 'diana', c: 64.1 }],
      lado: [{ n: 'pesa', x: 1340, y: 780, c: 63.75, tam: 250 }, { n: 'pesa', x: 1340, y: 640, c: 64.6, tam: 250 }, { n: 'pesa', x: 1340, y: 500, c: 65.5, tam: 250 }],
      rotulos: [{ txt: 'Nadie ve el sacrificio', x: 1340, y: 330, c: 66.3, dir: 'ninguna' }] }, { entra: 'barrido', sale: 'latigo' }),
    esc(68.4, 72.7, EscPrecio, {}, { entra: 'latigo', sale: 'latigo' }),
    esc(73.6, 77.0, X.Camino, { obstaculo: true, final: 'abandona', cInicio: 73.6, cObstaculo: t('dificultad', 74) - 0.2, cFinal: t('abandonan', 76) - 0.3,
      rotulos: [{ txt: 'Al primer golpe abandonan', x: 1100, y: 300, c: t('abandonan', 76), dir: 'ninguna' }] }, { entra: 'latigo', sale: 'latigo' }),
    esc(77.8, 81.5, X.Progreso, { cInicio: 77.8, cFin: 81.3, desde: 0.05, hasta: 0.11, etiqueta: function () { return '1:20'; },
      check: t('ya estás', 80), izq: '0:00', der: '11:47', n: 'tv', yIco: 260,
      rotulo: { txt: 'Eso ya es disciplina', c: t('viendo este video', 79), y: 720 } }, { entra: 'latigo', sale: 'latigo' }),
    dice('extremadamente difícil', 82, 2.2, { marcadas: ['difícil'] }),
    esc(84.7, 87.8, EscBusqueda, {}, { entra: 'zoom', sale: 'latigo' }),
    dice('placeres inmediatos', 89, 2.2, { marcadas: ['inmediatos'] }),
    p.mantener(90.0, 91.6),
    p.camara(91.6, 94.6, { mov: 'empuje', zoom: 1.04 }),
    esc(94.6, 97.5, X.Bateria, { n: 'cerebro-red', tamIco: 330, n2: 'pesa', x2: 560, y2: 300, c2: 94.7, desde: 0.95, hasta: 0.15, cCambio: 95.0, durCambio: 2.0,
      rotulo: { txt: 'Esfuerzo mental duro', c: 95.6 } }, { entra: 'barrido', sale: 'latigo' }),
    dice('pendejadas', 98, 2.2, { marcadas: ['pendejadas'] }, 'todas las pendejadas'),
    p.mantener(102.5, 106.1),
    p.etiqueta(t('6x7', 101) - 0.05, 106.1, '6-7', { pos: [140, 230], dir: 'der', ancla: 'izq' }),
    p.etiqueta(t('aura farming', 102) - 0.05, 106.1, 'Aura farming', { pos: [140, 330], dir: 'der', ancla: 'izq' }),
    p.etiqueta(t('novelas', 103) - 0.05, 106.1, 'Novelas de frutas con IA', { pos: [140, 430], dir: 'der', ancla: 'izq' }),
    tapar(106.6, 109.0),
    dice('estupides', 106, 2.2, { marcadas: ['estupideces'] }, 'muchas estupideces'),
    esc(111.7, 115.6, EscConfort, {}, { entra: 'barrido', sale: 'latigo' }),
    esc(119.4, 124.1, EscCorriente, {}, { entra: 'latigo', sale: 'corte' }),
    p.escena(124.1, 137.6 + VENT.latigo, X.Alrededor, { centro: { fig: 'depie', tam: 300 }, c: 124.1, items: [
      { n: 'mensaje', txt: 'Amigos', c: t('amigos', 123) },
      { n: 'casa', txt: 'Familia', c: t('familiares', 124) },
      { n: 'nube', txt: 'Creencias', c: t('creencias', 125) },
      { n: 'corazon', txt: 'Crianza', c: t('crianza', 126) },
      { n: 'celular', txt: 'Redes sociales', c: t('redes sociales', 127) },
      { n: 'plato', txt: 'Comida', c: t('comida', 128) }],
      encabezado: 'Todo te condiciona' }, { entra: 'corte', sale: 'latigo' }),
    p.caja(t('no es tu culpa', 134) - 0.05, 137.4, 'Quizás no es tu culpa', { pos: [960, 990], tam: 0.8, sobreEscena: true, sfx: false }),
    p.mantener(139.5, 141.7),
    dice('personalidad', 138, 2.2, { marcadas: ['personalidad'] }, 'tu personalidad'),
    tapar(141.8, 143.4),
    dice('más o menos disciplinado', 141, 2, { marcadas: ['disciplinado.'] }),
    p.mantener(145.0, 146.1),
    p.texto(t('nivel biológico', 144) - 0.05, 146.3, 'a nivel biológico', { marcadas: ['biológico'] }),
    esc(148.2, 154.1, X.Fila, { encabezado: 'Cada vez menos esfuerzo', con: '→', tam: 210, items: [
      { n: 'fuego', txt: 'Sobrevivir', c: 148.3 },
      { n: 'casa', txt: 'Construir', c: 149.5 },
      { n: 'laptop', txt: 'Trabajar sentado', c: 150.9 },
      { n: 'celular', txt: 'Todo a un clic', c: 152.0 }] }, { entra: 'barrido', sale: 'corte' }),
    p.escena(154.1, 158.9 + VENT.latigo, X.Comparar, { conector: 'linea',
      izq: { titulo: 'ANTES', color: 'gris', fig: 'empuja', txt: 'Esfuerzo para comer y tener techo', c: 154.1 },
      der: { titulo: 'AHORA', n: 'celular', txt: 'Todo llega solo', c: 155.2, cIco: 155.4 } }, { entra: 'corte', sale: 'latigo' }),
    p.titular(t('no necesitas esforzarte', 158) - 0.1, 163.0, 'No necesitas\nesforzarte', { marcadas: ['esforzarte'], sub: 'ni sufrir para conseguir lo básico' }),
    p.mantener(167.1, 170.0),
    p.etiqueta(t('comida', 165) - 0.05, 170.0, 'Comida', { pos: [140, 230], dir: 'der', ancla: 'izq' }),
    p.etiqueta(t('refugio', 167) - 0.05, 170.0, 'Refugio', { pos: [140, 330], dir: 'der', ancla: 'izq' }),
    p.etiqueta(t('hogar', 168) - 0.05, 170.0, 'Hogar', { pos: [140, 430], dir: 'der', ancla: 'izq' }),
    p.mantener(172.0, 176.0),
    dice('alguien disciplinado', 172, 2.4, { marcadas: ['disciplinado'] }),
    esc(176.0, 178.9, X.Multitud, { cols: 9, filas: 3, destacados: [{ i: 13, c: 177.0 }], rotulo: { txt: 'Uno entre cientos', c: 177.6, y: 990 } },
      { entra: 'zoom', sale: 'latigo' }),
    tapar(181.4, 182.6),
    dice('no existen', 180, 2.2, { marcadas: ['existen'] }, 'no quiere decir que no existan'),
    esc(184.3, 188.2, EscTuTambien, {}, { entra: 'latigo', sale: 'corte' }),

    /* ---------------- CAPITULO 2 ---------------- */
    p.capitulo(188.2, 190.8 + VENT.latigo, { n: 2, de: 3, titulo: 'Características de una persona disciplinada', corto: 'Características',
      entra: 'corte', sale: 'latigo' }),
    dice('más diferencia', 190, 2.4, { marcadas: ['diferencia'] }, 'lo que más los diferencia'),
    esc(195.8, 200.6, EscMotivacionCero, {}, { entra: 'barrido', sale: 'latigo' }),
    tapar(204.2, 206.0),
    dice('progresar y mejorar', 203, 2.2, { marcadas: ['progresar'] }),
    esc(206.0, 211.3, X.Grafico, { encabezado: 'Motivación vs. disciplina', ejeX: 'tiempo', c: 206.0,
      curvas: [{ puntos: [[0, 0.15], [0.1, 0.9], [0.2, 0.25], [0.32, 0.72], [0.44, 0.2], [0.56, 0.5], [0.68, 0.12], [1, 0.08]], color: 'amarillo', c: 206.1, dur: 2.2 },
        { puntos: [[0, 0.05], [0.5, 0.45], [1, 0.95]], color: 'verde', c: t('así como viene', 209), dur: 1.4 }],
      rotulos: [{ txt: 'La motivación cae', x: 0.3, y: 1.05, c: t('traicionera', 207) },
        { txt: 'La disciplina sigue', x: 0.78, y: 1.05, c: t('se va', 210), fondo: GRN }] }, { entra: 'latigo', sale: 'corte' }),
    p.cita(211.3, 217.3 + VENT.latigo, { texto: 'No actúes por emoción, actúa por deber.', autor: 'Marco Aurelio', rol: 'emperador romano',
      marcadas: ['deber.'], entra: 'corte', sale: 'latigo' }),
    esc(219.9, 224.0, EscFuturo, { cGrande: t('futuro yo', 219) + 0.3, cFlecha: t('dependen', 220), cBombillo: t('acciones', 221), cTxt: t('presente', 222) },
      { entra: 'latigo', sale: 'latigo' }),
    esc(225.5, 230.5, X.Grafico, { encabezado: 'A la larga', ejeX: 'tiempo', ejeY: 'bienestar', c: 225.5,
      curvas: [{ puntos: [[0, 0.3], [0.1, 0.95], [0.3, 0.6], [0.6, 0.3], [1, 0.08]], color: 'rojo', c: 225.5, dur: 1.2 },
        { puntos: [[0, 0.3], [0.2, 0.18], [0.5, 0.45], [1, 0.95]], color: 'verde', c: 227.0, dur: 1.4 }],
      rotulos: [{ txt: 'Placer inmediato', x: 0.3, y: 1.08, c: 226.4, fondo: RED }, { txt: 'Esfuerzo sostenido', x: 0.82, y: 1.07, c: 228.5, fondo: GRN }] },
    { entra: 'zoom', sale: 'latigo' }),
    tapar(231.4, 233.0),
    dice('totalmente miserable', 230, 2.2, { marcadas: ['miserable'] }, 'una vida miserable'),
    tapar(236.2, 237.2, { mov: 'golpe' }),
    p.texto(t('todo lo contrario', 234) - 0.05, 237.0, 'todo lo contrario', { marcadas: ['contrario'] }),
    p.escena(237.2 - VENT.latigo, t('mohamed', 241) - 0.15, X.Fila, { con: '→', items: [
      { n: 'pesa', txt: 'Primero lo difícil', c: 237.2 },
      { n: 'trofeo', txt: 'Después la gloria', c: t('gloria', 240) - 0.3, check: t('gloria', 240) + 0.2 }] }, { entra: 'latigo', sale: 'latigo' }),
    p.cita(t('mohamed', 241) - 0.15 + 0.4, 254.2 + VENT.latigo, { texto: 'Odié cada segundo de mis entrenamientos, pero me repetía: no renuncies, sufre ahora y vive el resto de tu vida como un campeón.',
      autor: 'Muhammad Ali', rol: 'campeón de boxeo', marcadas: ['renuncies,', 'campeón.'], entra: 'latigo', sale: 'latigo' }),
    p.camara(t('sería', 257) - 0.1, 259.7, { zoom: 1.2, foco: [0.47, 0.4], mov: 'golpe' }),
    esc(259.8, 263.5, X.Frase, { texto: 'Respeto\npor ti mismo', marcadas: ['respeto'], tam: 1.5 }, { entra: 'barrido', sale: 'latigo' }),
    esc(266.1, 271.0, X.Fila, { con: '+', items: [
      { fig: 'depie', txt: 'Tú', c: 266.1 },
      { n: 'engranaje', txt: 'Motor interno', c: t('interno', 266) }],
      rotulo: { txt: 'No eres como los demás', c: t('no eres como', 267), y: 960 } }, { entra: 'latigo', sale: 'corte' }),
    p.mantener(271.0, 275.7),
    dice('grupo exclusivo', 271, 2.6, { marcadas: ['exclusivo'] }),
    esc(277.7, 282.1, X.Fila, { encabezado: 'Congruencia', con: '=', items: [
      { n: 'nube', txt: 'Lo que piensas', c: t('pensamientos', 277) },
      { fig: 'empuja', txt: 'Lo que haces', c: t('acciones', 278), check: t('acciones', 278) + 0.8 }] }, { entra: 'barrido', sale: 'latigo' }),
    tapar(282.2, 283.4),
    dice('dichos objetivos', 281, 1.8, { marcadas: ['objetivos.'] }),
    esc(284.9, 289.0, EscFuturo, { cGrande: 285.3, cFlecha: 285.7, cBombillo: t('hoy', 287) - 0.3, cTxt: t('depende', 284) + 0.4, txtFuturo: 'Depende de lo que haces hoy' },
      { entra: 'latigo', sale: 'latigo' }),
    p.etiqueta(289.1, 291.3, 'Otra característica', { pos: [140, 230], dir: 'der', ancla: 'izq' }),
    p.mantener(291.3, 296.7),
    dice('orden excesivo', 291, 2.6, { marcadas: ['orden'] }),
    dice('milimétricamente', 296, 2.4, { marcadas: ['milimétricamente'] }, 'milimétricamente medido'),
    p.mantener(300.7, 302.4),
    dice('obsesivas', 300, 1.8, { marcadas: ['obsesivas.'] }),
    p.camara(302.4, 306.1, { mov: 'empuje', zoom: 1.04 }),
    esc(306.1, 311.1, EscCampana, {}, { entra: 'barrido', sale: 'latigo' }),
    tapar(313.6, 314.4),
    dice('no hacen', 311, 1.8, { marcadas: ['hacen.'] }, 'lo que la media no hace'),
    esc(317.4, 321.5, EscBarrera, {}, { entra: 'latigo', sale: 'latigo' }),
    p.mantener(323.6, 326.5),
    dice('por qué te esfuerzas', 323, 2.4, { marcadas: ['esfuerzas'] }),
    dice('por qué se esfuerzan tanto', 327, 2.4, { marcadas: ['tanto'] }, '¿por qué se esfuerzan tanto?'),
    p.mantener(332.4, 336.5),
    dice('disfrutar la vida', 332, 2.4, { marcadas: ['disfrutar'] }),
    esc(336.5, 341.0, EscVozEntorno, {}, { entra: 'barrido', sale: 'latigo' }),
    dice('posibilidad de ir', 342, 2.4, { marcadas: ['fácil'] }, 'la posibilidad de ir por el camino fácil'),
    esc(344.7, 349.7, EscCaminos, {}, { entra: 'latigo', sale: 'latigo' }),
    p.detras(t('por qué no lo hacen', 350) - 0.05, 352.3, '¿POR QUÉ?', { color: 'amarillo' }),
    tapar(353.8, 355.0, { mov: 'golpe' }),
    dice('sencilla razón', 352, 1.8, { marcadas: ['razón.'] }, 'una sencilla razón'),
    esc(357.5, 359.4, EscTorre, { fase: 1 }, { entra: 'latigo', sale: 'corte' }),
    p.escena(361.7, 364.5 + VENT.corte, EscTorre, { fase: 2, cSaca: 361.85 }, { entra: 'corte', sale: 'corte' }),
    esc(366.2, 369.6, EscAleja, {}, { entra: 'latigo', sale: 'latigo' }),
    p.camara(t('muy bien', 371) - 0.1, t.fin('qué hago', 376) + 0.4, { zoom: 1.14, foco: [0.47, 0.42], bn: true, mov: 'golpe' }),
    dice('muy bonitas palabras', 372, 2.4, {}, 'muy bonitas palabras…'),
    dice('qué hago', 376, 2.4, { marcadas: ['hago'] }, '¿qué hago?'),

    /* ---------------- CAPITULO 3 ---------------- */
    p.capitulo(379.8 - VENT.barrido, 382.3 + VENT.latigo, { n: 3, de: 3, titulo: '¿Cómo ser una persona disciplinada?', corto: 'Cómo ser disciplinado',
      entra: 'barrido', sale: 'latigo' }),
    p.detras(t('la disciplina funciona', 382) - 0.05, 385.05, 'DISCIPLINA', { color: 'amarillo' }),
    dice('como un músculo', 383, 1.9, { marcadas: ['músculo.'] }),
    esc(385.3, 388.6, EscMusculo, {}, { entra: 'latigo', sale: 'latigo' }),
    esc(391.4, 394.0, X.Numero, { valor: 3, desde: 0, durCuenta: 0.6, tam: 2.6, c: 391.4, sub: 'recomendaciones prácticas', marcadas: ['prácticas'] },
      { entra: 'zoom', sale: 'latigo' }),
    tapar(395.6, 396.2),
    dice('ahora mismo', 395, 1.6, { marcadas: ['mismo.'] }),
    esc(400.9, 405.6, EscOrden, {}, { entra: 'latigo', sale: 'latigo' }),
    tapar(408.0, 409.4),
    dice('lograr el objetivo', 407, 1.8, { marcadas: ['objetivo.'] }),
    p.escena(t('son las listas', 412) - 0.4, 415.6, X.Paso, { n: 1, titulo: 'Haz listas', marcadas: ['listas'], n2: 'lista' }, { entra: 'barrido', sale: 'corte' }),
    p.mantener(415.6, 420.8),
    dice('empiezas el día', 415, 2.6, { marcadas: ['día'] }, 'desde que empiezas el día'),
    esc(420.8, 424.2, X.Tareas, { titulo: 'Mi día', x: 620, c: 420.8, cOrden: t('más importante', 421) - 0.1, orden: [2, 3, 0, 1, 4], items: [
      { txt: 'Responder mensajes', marca: 'baja' }, { txt: 'Ordenar el cuarto', marca: 'baja' }, { txt: 'Entrenar', marca: 'alta', marcaColor: RED },
      { txt: 'Estudiar 1 hora', marca: 'alta', marcaColor: RED }, { txt: 'Ver series', marca: 'baja' }],
      derecha: function (T) { return <E.Flecha T={T} de={[1180, 760]} a={[1180, 330]} c={421.0} grosor={12} color="amarillo" />; },
      rotulo: { txt: 'Lo pesado primero', x: 1500, y: 540, c: 422.6, dir: 'izq' } }, { entra: 'latigo', sale: 'latigo' }),
    dice('más fricción', 424, 2, { marcadas: ['fricción'] }),
    esc(426.4, 429.2, EscEnergia, { fase: 1, cDificil: t('hazlo al principio', 427) - 0.2 }, { entra: 'barrido', sale: 'corte' }),
    p.escena(429.2, 434.2 + VENT.latigo, EscEnergia, { fase: 2, cFacil: t('más fácil', 431) }, { entra: 'corte', sale: 'latigo' }),
    p.mantener(435.6, 438.1),
    dice('tiempo límite', 435, 2.2, { marcadas: ['límite'] }),
    esc(439.8, 449.3, X.Tareas, { titulo: 'Hoy', x: 620, c: 439.8, items: [
      { txt: 'Entrenar', marca: '45 min', c: 439.9 }, { txt: 'Estudiar', marca: '1 h', c: 440.1 }, { txt: 'Leer', marca: '20 min', c: 440.3 }],
      derecha: function (T) {
        return (
          <React.Fragment>
            <Reloj T={T} x={1420} y={430} c={t('comprometas', 443) - 0.2} tam={300} vueltas={1.6} />
            <X.BateriaGrande T={T} x={1420} y={760} c={t('tiempo determinado', 446)} nivel={0.9 - 0.75 * Easing.easeInOutCubic(clamp((T - t('tiempo determinado', 446) - 0.4) / 2.2, 0, 1))} verde />
          </React.Fragment>
        );
      },
      rotulo: { txt: 'Con tiempo límite', x: 620, y: 860, c: 441.6 } }, { entra: 'latigo', sale: 'latigo' }),
    p.mantener(453.6, 455.7),
    dice('una a una', 453, 2.2, { marcadas: ['una'] }, 'tachando una a una'),
    dice('satisfactorio', 456, 2.2, { marcadas: ['satisfactorio'] }),
    esc(460.4, 465.2, X.Tareas, { titulo: 'Hoy', x: 620, c: 460.4, items: [
      { txt: 'Entrenar', check: 460.85, tacha: 461.05 }, { txt: 'Trabajo pesado', check: t('progreso', 461), tacha: t('progreso', 461) + 0.2 },
      { txt: 'Leer 20 minutos', check: t('estoy haciendo', 463), tacha: t('estoy haciendo', 463) + 0.2 }, { txt: 'Dormir temprano', check: 464.4, tacha: 464.6 }],
      derecha: function (T) {
        var hechos = [460.85, t('progreso', 461), t('estoy haciendo', 463), 464.4].filter(function (c) { return T >= c; }).length;
        return <X.BateriaGrande T={T} x={1420} y={460} c={460.4} nivel={0.08 + 0.23 * hechos} verde />;
      },
      rotulo: { txt: 'Una por una', x: 1420, y: 680, c: 461.4 } }, { entra: 'latigo', sale: 'latigo' }),
    tapar(468.2, 469.0, { mov: 'golpe' }),
    dice('muy importante', 466, 1.8, { marcadas: ['importante'] }),
    esc(469.0, 472.6, X.Frase, { texto: 'No existe la\nperfección', marcadas: ['perfección'], tam: 1.45 }, { entra: 'barrido', sale: 'corte' }),
    p.escena(472.6, 478.8 + VENT.latigo, X.Tareas, { titulo: 'Hoy', x: 620, c: 472.6, items: [
      { txt: 'Entrenar', check: 472.85, tacha: 473.0 }, { txt: 'Estudiar' }, { txt: 'Leer' }],
      derecha: function (T) { return <Corazon T={T} x={1450} y={430} c={t('eso está bien', 476)} tam={280} acento={YEL} />; },
      rotulo: { txt: 'Y está bien', x: 1450, y: 680, c: t('eso está bien', 476) + 0.3 } }, { entra: 'corte', sale: 'latigo' }),
    dice('días perfectos', 478, 2.2, { marcadas: ['perfectos'] }, 'no hay días perfectos'),
    esc(481.7, 486.0, X.Calendario, { c: 481.7, cLlena: 481.95, durLlena: 3.3, saltar: [4, 9, 17, 24], x: 640, y: 470,
      rotulo: { txt: 'La racha sigue viva', x: 1450, y: 470, c: 484.0 } }, { entra: 'latigo', sale: 'latigo' }),
    p.mantener(488.1, 490.1),
    p.mantener(494.3, 495.3),
    dice('respeto propio', 493, 2.2, { marcadas: ['propio'] }),
    dice('no te des tan duro', 495, 2.4, { marcadas: ['duro'] }, 'no te des tan duro'),
    p.mantener(497.9, 502.5),
    p.escena(t('número 2', 501) - 0.4, 507.2 + VENT.latigo, X.Paso, { n: 2, titulo: 'Elimina lo que\nno suma', marcadas: ['elimina'], n2: 'bloque',
      c: t('número 2', 501) - 0.2 }, { entra: 'barrido', sale: 'latigo' }),
    tapar(508.4, 509.6),
    dice('ni aporte nada', 507, 2, { marcadas: ['nada'] }, 'ni aporta nada'),
    esc(511.5, 516.5, X.Balanza, { hacia: 'der', cGira: t('dejar de', 515),
      izq: { n: 'corazon', txt: 'Lo que haces', c: 511.6, tam: 150 }, der: { n: 'celular', txt: 'Lo que dejas', c: t('también', 514), tam: 150 } },
    { entra: 'zoom', sale: 'latigo' }),
    p.mantener(516.5, 521.2),
    dice('vale la pena', 518, 2.2, { marcadas: ['pena'] }, '¿vale la pena?'),
    tapar(523.2, 524.4),
    dice('la siguiente pregunta', 521, 2.2, { marcadas: ['pregunta.'] }, 'hazte esta pregunta'),
    esc(525.4, 528.9, X.Frase, { texto: '¿Me acerca\no me aleja?', marcadas: ['acerca:verde', 'aleja?:rojo'], tam: 1.5 }, { entra: 'barrido', sale: 'latigo' }),
    p.detras(t('una sola pregunta', 528) - 0.05, 531.3, 'UNA SOLA\nPREGUNTA', { color: 'amarillo' }),
    esc(531.5, 536.9, X.Comparar, { conector: 'linea', yTit: 260, yIco: 470,
      izq: { titulo: 'TE ACERCA', color: 'verde', tam: 1.05, items: [{ texto: 'Entrenar', c: 532.0 }, { texto: 'Leer', c: 532.6 }, { texto: 'Dormir bien', c: 533.2 }], c: 531.5 },
      der: { titulo: 'TE ALEJA', color: 'rojo', tam: 1.05, items: [{ texto: 'Scroll infinito', c: 533.8 }, { texto: 'Comida chatarra', c: 534.4 }, { texto: 'Vicios', c: 535.0 }], c: 531.6 },
      rotulo: { txt: 'Sé brutalmente honesto', c: t('brutalmente', 533), y: 960 } }, { entra: 'latigo', sale: 'latigo' }),
    p.detras(t('elimines', 537) - 0.05, 540.25, 'ELIMINA', { color: 'amarillo' }),
    p.mantener(540.4, 550.0),
    p.caja(t('deja de seguir a gente', 539) - 0.05, t('deja de seguir haciendo', 542) - 0.1, 'Deja de seguir a quien no aporta', { pos: 'abajo', tam: 0.75 }),
    p.caja(t('deja de seguir haciendo', 542) - 0.05, t('deja de comer', 545) - 0.1, 'Deja lo que no te aporta', { pos: 'abajo', tam: 0.75 }),
    p.caja(t('deja de comer', 545) - 0.05, 550.0, 'Deja lo que te hace daño', { pos: 'abajo', tam: 0.75 }),
    tapar(555.2, 556.4),
    dice('primero tienes que dejar de hacer', 553, 2.6, { marcadas: ['dejar'] }, 'primero, deja de hacer'),
    esc(556.5, 561.0, X.Fila, { encabezado: 'Igual o más importante que hacer', items: [
      { n: 'celular', c: 556.6, tacha: 556.95 }, { n: 'hamburguesa', c: 556.8, tacha: 557.5 }, { n: 'tv', c: 557.0, tacha: 558.0 }],
      rotulo: { txt: 'Deja de hacerlo', c: 558.5, y: 900 } }, { entra: 'barrido', sale: 'latigo' }),
    tapar(561.0, 564.8),
    dice('calidad sobre cantidad', 560, 2.8, { marcadas: ['calidad'] }),
    esc(565.3, 568.7, X.Comparar, { conector: 'flecha', yTit: 300, yIco: 600,
      izq: { titulo: 'Cantidad', color: 'gris', tam: 0.9, n: 'capas', tamIco: 300, c: 565.3 },
      der: { titulo: 'Calidad', tam: 0.9, n: 'medalla', tamIco: 300, c: 566.0 },
      rotulo: { txt: 'Poco y bueno', c: t('siempre', 566), y: 900 } }, { entra: 'latigo', sale: 'corte' }),
    p.escena(568.7, 572.3 + VENT.latigo, EscPausa, { cPausa: 570.9 }, { entra: 'corte', sale: 'latigo' }),
    p.camara(t('espera', 573) - 0.05, 576.15, { zoom: 1.24, foco: [0.47, 0.4], mov: 'golpe', bn: true }),
    p.detras(t('espera', 573) - 0.05, 576.05, '¡ESPERA!', { color: 'amarillo' }),
    tapar(576.4, 578.8),
    dice('un mensaje muy importante', 576, 2.4, { marcadas: ['importante'] }),
    esc(580.1, 583.1, X.Fila, { items: [
      { n: 'pulgar', txt: 'Dale like', c: t('like', 580) },
      { n: 'campana', txt: 'Suscríbete', c: t('suscribirte', 580) },
      { n: 'mensaje', txt: 'Compártelo', c: t('compartir', 581) }] }, { entra: 'barrido', sale: 'latigo' }),
    p.titular(t('bastante edición', 584) - 0.1, 590.6, 'Edición y\nanimaciones', { marcadas: ['animaciones'], sub: 'tardan bastante en hacerse' }),
    p.mantener(592.7, 595.2),
    p.etiqueta(592.7, 595.2, 'Lo edito yo mismo', { pos: [140, 230], dir: 'der', ancla: 'izq' }),
    esc(597.2, 603.6, EscMetaCanal, {}, { entra: 'barrido', sale: 'latigo' }),
    p.suscribete(604.2, 609.0),
    tapar(605.8, 609.2),
    esc(609.2, 612.5, EscCalidad, { cPlay: t('calidad', 609) - 0.2 }, { entra: 'latigo', sale: 'latigo' }),
    tapar(613.6, 614.8),
    dice('continuamos con el video', 612, 2, { marcadas: ['continuamos'] }, 'continuemos'),
    p.escena(614.7 - VENT.barrido, 616.3, X.Paso, { n: 3, titulo: 'Ten un propósito', marcadas: ['propósito'], n2: 'diana', c: 614.6 }, { entra: 'barrido', sale: 'corte' }),
    p.escena(616.3, 619.7 + VENT.latigo, EscArbol, {}, { entra: 'corte', sale: 'latigo' }),
    dice('por qué haces lo que haces', 619, 2.4, { marcadas: ['por', 'qué'] }, '¿por qué haces lo que haces?'),
    esc(622.0, 625.4, EscExcusas, { cs: [t('excusa', 622) - 0.3, t('excusa', 622) + 0.4, t('rendirte', 623) - 0.6] }, { entra: 'latigo', sale: 'latigo' }),
    dice('bien sólido', 626, 2.2, { marcadas: ['sólido'] }, 'bien definido y sólido'),
    esc(628.8, 631.1, EscExcusas, { firme: true, cs: [628.85, 629.35, 629.85] }, { entra: 'latigo', sale: 'latigo' }),
    p.mantener(633.3, 637.0),
    dice('te conviertes en esa persona', 631, 2.6, { marcadas: ['persona'] }),
    dice('adversidades', 637, 2.4, { marcadas: ['adversidades'] }, 'a pesar de todas las adversidades'),
    esc(640.6, 644.6, EscNoEntienden, {}, { entra: 'latigo', sale: 'latigo' }),
    p.titular(t('veas atrás', 647) - 0.1, 650.7, 'Valió\nla pena', { marcadas: ['pena'], lado: 'izq' }),
    p.mantener(650.9, 653.6),
    esc(654.7, 662.25, EscAmorPropio, {}, { entra: 'latigo', sale: 'corte' }),
    p.escena(662.25, 670.5 + VENT.latigo, EscTopuria, {}, { entra: 'corte', sale: 'latigo' }),
    p.titular(t('convertirte', 670) - 0.1, 675.5, 'Conviértete en\nesa persona', { marcadas: ['persona'], sub: 'gracias a la disciplina' }),
    esc(675.8, 679.7, X.Fila, { items: [
      { n: 'campana', txt: 'Suscríbete', c: t('suscríbete', 675) },
      { n: 'pulgar', txt: 'Dale like', c: t('like', 676) },
      { n: 'mensaje', txt: 'Compártelo', c: t('compártelo', 677) }] }, { entra: 'barrido', sale: 'latigo' }),
    p.suscribete(680.6, 686.4),
    esc(687.8, 691.1, EscCalidad, { cPlay: 688.3 }, { entra: 'latigo', sale: 'latigo' }),
    tapar(692.8, 696.0),
    dice('muchas gracias', 692, 2.2, { marcadas: ['gracias'] }, '¡muchas gracias!'),
    p.cierre(696.9 - VENT.barrido, 706.8)
  ];

  L.registrar({
    id: 'disciplina',
    titulo: 'Disciplina (reedición)',
    video: 'largos/disciplina/media/fuente.mp4',
    plan: plan
  });
})(window);
