/* ============================================================
   ¿SI NO LLEGAS AL FALLO, NO CRECES? — formato de concepto en un solo plano (PS)
   Tor hace la serie hasta el fallo (el medidor de repeticiones en reserva llega
   a 0 y se le cae la mancuerna), mira a la camara y rebobina el video (cuarta
   pared); el estudio, el musculo parecido, el cansancio que no, y la serie
   bien hecha: termina con una a tres repeticiones en reserva.
   Evidencia: Refalo MC, Helms ER, Trexler ET, Hamilton DL, Fyfe JJ. Influence
   of resistance training proximity-to-failure on skeletal muscle hypertrophy:
   a systematic review with meta-analysis. Sports Med. 2023;53(3):649-665
   (hipertrofia parecida al fallo y cerca del fallo). El fallo aumenta la fatiga
   y la recuperacion (Moran-Navarro y col., 2017, Eur J Appl Physiol).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var V = global.V, E3 = global.E3, PS = global.PS, A = global.REELS.ayudas;
  var Easing = global.Easing, clamp = global.clamp;

  var ZONA_TARJETA = [70, 660, 1010, 1330];
  var TAM = 1.25;   // la mancuerna

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3.0, vo: '¿Si no llegas al fallo, no creces?' },
    { nombre: 'El mito', dur: 5.0, vo: 'Mucha gente cree que cada serie tiene que terminar sin poder hacer una repetición más.' },
    { nombre: 'Estudio', dur: 4.2, vo: 'Pero un análisis de 2023 comparó entrenar al fallo con quedarse cerca.' },
    { nombre: 'Resultado', dur: 2.6, vo: 'Y el músculo creció casi igual.' },
    { nombre: 'Cansancio', dur: 4.6, vo: 'Pero ir al fallo siempre te cansa mucho más y te deja peor para la siguiente serie.' },
    { nombre: 'Lo ideal', dur: 4.2, vo: 'Lo ideal es que termines la serie cuando te queden de una a tres repeticiones.' },
    { nombre: 'Debate final', dur: 4.2, vo: '¿Y tú? ¿Llegas al fallo en cada serie? Te leo en los comentarios.' }
  ];

  // la serie al fallo (escena 1): 3 repeticiones buenas y la cuarta que no sale
  function serieFallo(T, b) {
    var u = b.k(T, [1, 0.04], [1, 0.8]) * 3.6;
    if (u < 3) { var lenta = u > 2 ? 1.0 : 0; return { k: PS.rep(u), n: 3 - Math.floor(u), temblor: lenta ? 0.01 * Math.sin(T * 50) : 0 }; }
    var v = (u - 3) / 0.6;                       // la cuarta: sube a medias temblando y se cae
    return { k: 0.55 * Math.sin(Math.PI * clamp(v, 0, 1) * 0.5) * (v < 1 ? 1 : 0), n: 0, temblor: 0.016 * Math.sin(T * 60), falla: true };
  }
  // la mancuerna que cae (0 en la mano .. 1 en el piso, con un rebote)
  function caida(x) {
    var g = clamp(x, 0, 1);
    if (g < 0.7) { var u = g / 0.7; return { y: 1 - u * u, giro: u * 1.6 }; }
    var r = (g - 0.7) / 0.3; return { y: 0.12 * Math.sin(Math.PI * r) * (1 - r), giro: 1.6 + 0.3 * r };
  }

  PS.video({
    id: 'fallo', titulo: '¿Hay que llegar al fallo? (plano secuencia)',
    escenas: ESCENAS,
    claves: { fallo: 'rojo', cerca: 'verde', igual: 'amarillo', cansa: 'rojo', tres: 'verde', una: 'verde', ideal: 'amarillo' },
    camara: [
      [[0, 0], { az: 14, el: 4, dist: 3.7, y: 1.5 }],
      [[0, 0.95], { az: 4, el: 4, dist: 3.9, y: 1.46 }],
      [[1, 0.6], { az: 32, el: 6, dist: 4.8, y: 1.0 }],
      [[2, 0.2], { az: 10, el: 4, dist: 4.4, y: 1.05 }],
      [[3, 0.9], { az: -24, el: 10, dist: 5.2, y: 1.0 }],
      [[4, 0.9], { az: -40, el: 12, dist: 5.4, y: 1.0 }],
      [[5, 0.8], { az: 26, el: 8, dist: 5.0, y: 1.0 }],
      [[6, 0.6], { az: 4, el: 4, dist: 4.4, y: 1.12 }],
      [[6, 1], { az: -2, el: 4, dist: 4.2, y: 1.15 }]
    ],
    libre: [[[0, 0], [0, 0.85]]],
    golpes: [[1, 0.88], [6, 0.72]],
    zona: function (T, b) {
      if (b.entre(T, [2, 0.36], [3, 0.98]) || b.entre(T, [3, 0.98], [5, 0.02]) || b.entre(T, [6, 0.25], [6, 1.01])) return ZONA_TARJETA;
      return [70, 300, 820, 1330];   // a la derecha, el medidor de reserva
    },
    vista: function (T, b, cam, ex) {
      var abre = ex ? ex.abre : 0;
      var p = PS.depie(T, {}), cara = PS.boca(abre), mus = null, pesas = { I: null, D: 'neutro' }, objetos = [], mira = 0.9;
      var tCae = b.f(1, 0.86), tRebob = [b.f(2, 0.02), b.f(2, 0.34)];
      if (T < b.f(1, 0)) {
        // gancho: la mancuerna a la altura del pecho, la pregunta a la camara
        PS.curl(p, 0.75 + 0.05 * Math.sin(T * 2), 0, 0, 'D'); pesas.D = PS.ejeCurl(0.75); cara.cejas = 'alzadas';
      } else if (T < tRebob[0] || (T >= tRebob[0] && T < tRebob[1])) {
        // la serie al fallo; al rebobinar se ve hacia atras
        var Ts = T, rebob = T >= tRebob[0];
        if (rebob) { var kr = (T - tRebob[0]) / (tRebob[1] - tRebob[0]); Ts = tCae + 0.9 - kr * (tCae + 0.9 - b.f(1, 0.6)); }
        var s = serieFallo(Ts, b);
        PS.curl(p, s.k, 0, s.temblor, 'D'); pesas.D = PS.ejeCurl(s.k);
        mus = { biceps: s.falla ? 'rojo' : true, brillo: 0.3 * s.k };
        cara = s.n <= 1 ? { boca: 'dientes', cejas: 'enojo' } : PS.boca(abre);
        mira = 0.3;
        if (Ts >= tCae) {
          // se le cae: la mancuerna al piso, Tor agotado
          var c = caida((Ts - tCae) / 0.55), J = global.TOR3D.esqueleto(Object.assign({ _pesas: true }, p));
          pesas.D = null;
          objetos.push({ tipo: 'mancuerna', id: 'cae', p: [J.manoD.x + 0.06, 0.105 + (J.manoD.y - 0.105) * c.y, J.manoD.z + 0.1], eje: [Math.cos(c.giro), Math.sin(c.giro) * 0.3, Math.sin(c.giro)] });
          p.tronco = [12, 0, 0]; p.hombros = { sube: -0.3 };
          cara = { ojos: 'llanto', boca: 'ondulada' };
        }
        if (rebob) { cara = { ojos: 'grandes', boca: 'o' }; mira = 1; p.manoI = [-0.2, 1.4 + 0.08 * Math.sin(T * 14), 0.42 + 0.08 * Math.cos(T * 14)]; p.codoI = [0.6, -0.6, -0.3]; }
      } else if (T < b.f(3, 0)) {
        PS.curl(p, 0.1, 0, 0, 'D'); pesas.D = PS.ejeCurl(0.1); mira = 1; cara.cejas = 'alzadas';
      } else if (T < b.f(4, 0)) {
        // el musculo crecio casi igual: saca biceps con la mancuerna
        var fl = b.k(T, [3, 0.05], [3, 0.35], Easing.easeOutBack);
        p.manoD = E3.lerp3([0.34, 0.86, 0.08], [0.62, 1.75, 0.12], fl); p.codoD = E3.lerp3([0.35, 0.2, -1], [0.5, -1, 0.05], fl);
        mus = { biceps: true, brillo: 0.4 * fl }; pesas.D = 'prono';
      } else if (T < b.f(5, 0)) {
        // el cansancio: encorvado, resoplando, despues se endereza
        var cans = 1 - b.k(T, [4, 0.7], [4, 0.95]);
        p.tronco = [14 * cans, 0, 3 * cans]; p.hombros = { sube: -0.3 * cans }; p.cabeza = [-10 * cans, 0, 0];
        PS.curl(p, 0, 0, 0, 'D'); pesas.D = PS.ejeCurl(0);
        cara = cans > 0.5 ? { ojos: 'cerrados', boca: 'abierta' } : PS.boca(abre); mira = cans > 0.5 ? 0 : 0.8;
      } else if (T < b.f(6, 0)) {
        // la serie bien: dos repeticiones y para con reserva
        var u2 = b.k(T, [5, 0.05], [5, 0.55]), k2 = u2 >= 1 ? 0 : PS.rep(u2);
        PS.curl(p, k2, 0, 0, 'D'); pesas.D = PS.ejeCurl(k2); mus = { biceps: true, brillo: 0.3 * k2 };
        cara = u2 >= 1 ? PS.boca(abre) : { boca: 'recta' }; mira = u2 >= 1 ? 1 : 0.3;
      } else {
        // el debate: senala y toca la pantalla
        PS.curl(p, 0, 0, 0, 'D'); pesas.D = PS.ejeCurl(0);
        PS.senalar(p, cam, b.k(T, [6, 0.5], [6, 0.68]) * (1 - b.k(T, [6, 0.84], [6, 0.98])), -1);
        cara.cejas = 'alzadas'; mira = 1;
      }
      PS.mirarCamara(p, cam, mira);
      return { figuras: [{ quien: 'tor', pose: p, pesas: pesas, pesaTam: { D: TAM }, pesaColor: { D: 'rojo' }, musc: mus, cara: cara }], objetos: objetos };
    },
    lienzo: function (T, b, pr) {
      var r = [];
      if (b.entre(T, [1, 0.6], [1, 1])) r.push(<V.Gotas key="g" T={T} c={pr('cabeza')} v={1} />);
      if (b.entre(T, [4, 0], [4, 0.75])) r.push(<V.Gotas key="g2" T={T} c={pr('cabeza')} v={1} />);
      if (b.entre(T, [3, 0.05], [4, 0])) r.push(<g key="br">{E3.brilla(T, pr, ['m:biceps:1'], b.k(T, [3, 0.05], [3, 0.3]), true, 60)}</g>);
      return <g>{r}</g>;
    },
    encima: function (T, b, pr) {
      var r = [];
      var tit = 1 - b.k(T, [0, 0.9], [1, 0.1]);
      if (tit > 0.01) r.push(<div key="tit" style={{ position: 'absolute', inset: 0, opacity: tit }}><E3.Rot T={T} text="¿AL *FALLO*?" y={262} s={1.2} cuando={b.f(0, 0.04)} tono="rojo" /></div>);
      // el medidor de reserva, al costado de Tor
      var n = 3;
      if (b.entre(T, [1, 0], [2, 0.02])) n = serieFallo(T, b).n;
      else if (b.entre(T, [2, 0.02], [2, 0.34])) n = 3 * b.k(T, [2, 0.02], [2, 0.34]);
      else if (b.entre(T, [5, 0], [6, 0])) n = 3 - Math.min(1, Math.floor(b.k(T, [5, 0.05], [5, 0.55]) + 0.4));
      var vis = b.entre(T, [1, 0.0], [2, 0.36]) || b.entre(T, [5, 0], [6, 0.05]);
      if (vis) r.push(<PS.Reserva key="rs" T={T} n={n} x={930} y={760} cuando={b.entre(T, [5, 0], [6, 0.05]) ? b.f(5, 0) : b.f(1, 0)} hasta={b.entre(T, [5, 0], [6, 0.05]) ? b.f(5, 0.95) : b.f(2, 0.34)} />);
      if (b.entre(T, [5, 0.62], [6, 0])) r.push(<A.Bien key="ok" T={T} cuando={b.f(5, 0.64)} x={850} y={980} s={0.6} />);
      r.push(<PS.Estudio key="es" T={T} cuando={b.f(2, 0.4)} hasta={b.f(3, 0.02)} autor="Refalo y col., 2023" detalle="Metaanálisis · al fallo vs. cerca del fallo" />);
      r.push(<PS.Barras key="b1" T={T} cuando={b.f(3, 0.05)} hasta={b.f(4, 0.02)} titulo="MÚSCULO"
        items={[{ label: 'AL FALLO', v: 0.82, color: 'rojo', valor: '' }, { label: 'CERCA', v: 0.8, color: 'verde', valor: '' }]} />);
      r.push(<PS.Barras key="b2" T={T} cuando={b.f(4, 0.08)} hasta={b.f(5, 0.0)} titulo="CANSANCIO" sombra="rojo"
        items={[{ label: 'AL FALLO', v: 0.92, color: 'rojo', valor: '' }, { label: 'CERCA', v: 0.45, color: 'verde', valor: '' }]} />);
      r.push(<PS.Encuesta key="en" T={T} cuando={b.f(6, 0.3)} pregunta="¿LLEGAS AL FALLO?" a={{ text: 'SIEMPRE', color: 'rojo' }} b={{ text: 'CERCA', color: 'verde' }} />);
      return <div style={{ position: 'absolute', inset: 0 }}>{r}</div>;
    },
    sobre: function (T, b, pr) {
      A.sonido('golpe', b.f(1, 0.88));   // la mancuerna contra el piso
      var r = [<PS.Rebobina key="rb" T={T} desde={b.f(2, 0.0)} hasta={b.f(2, 0.36)} />];
      if (b.entre(T, [6, 0.6], [7, 0])) {
        var c = pr('manoI');
        r.push(<svg key="tq" width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}><PS.Toque T={T} cuando={b.f(6, 0.7)} x={c[0]} y={c[1]} /></svg>);
      }
      return <div style={{ position: 'absolute', inset: 0 }}>{r}</div>;
    },
    accion: { dur: 4.2, pregunta: '¿AL FALLO O CERCA?', vo: '' },
    cierreVo: '¿Quieres ver más videos similares? Sígueme para más contenido.'
  });
})(window);
