/* ============================================================
   ¿EL CARDIO TE QUITA MUSCULO? — formato de concepto en un solo plano (PS)
   Tor pedalea en la bici estatica y le habla a la camara; el miedo (el
   medidor de musculo que se vacia en su cabeza), el estudio, el resultado
   (musculo y fuerza igual), el matiz (la potencia: se baja de la bici y salta)
   y el consejo (si van el mismo dia, primero lo que mas te importa).
   Evidencia: Schumann M, Feuerbacher JF, Sunkeler M, y col. Compatibility of
   concurrent aerobic and strength training for skeletal muscle size and
   function: an updated systematic review and meta-analysis. Sports Med.
   2022;52(3):601-612. El entrenamiento combinado no redujo la hipertrofia ni
   la fuerza maxima; si la fuerza explosiva, sobre todo en la misma sesion.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var E3 = global.E3, PS = global.PS, TOR3D = global.TOR3D, A = global.REELS.ayudas;
  var Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;

  var ZONA_TARJETA = [70, 660, 1010, 1330];
  var XP = 0.62;   // donde queda Tor de pie, al lado de la bici

  var ESCENAS = [
    { nombre: 'Gancho', dur: 2.6, vo: '¿El cardio te quita músculo?' },
    { nombre: 'El miedo', dur: 5.2, vo: 'Muchos no hacen ni un minuto de cardio por miedo a perder lo que ganaron entrenando.' },
    { nombre: 'Estudio', dur: 4.0, vo: 'Un análisis de 2022 juntó los estudios que mezclaron cardio y pesas.' },
    { nombre: 'Resultado', dur: 3.4, vo: 'Y no encontró menos músculo ni menos fuerza máxima.' },
    { nombre: 'La potencia', dur: 6.0, vo: 'Lo único que se resiente un poco es la potencia, como saltar o hacer sprints, sobre todo si haces las dos cosas el mismo día.' },
    { nombre: 'El consejo', dur: 3.6, vo: 'Si los haces el mismo día, primero lo que más te importa.' },
    { nombre: 'Debate final', dur: 4.2, vo: '¿Y tú, haces cardio o le tienes miedo? Te leo en los comentarios.' }
  ];

  function mezcla(a, c, k) {
    var r = {};
    Object.keys(c).forEach(function (n) {
      var va = a[n], vc = c[n];
      if (Array.isArray(vc) && Array.isArray(va) && typeof vc[0] === 'number') r[n] = E3.lerp3(va, vc, k);
      else r[n] = k < 0.5 && va != null ? va : vc;
    });
    return r;
  }
  // el salto (j 0..1): se agacha, despega, vuela y cae
  function salto(p, j) {
    var ag = j < 0.35 ? Easing.easeInOutSine(j / 0.35) : j < 0.5 ? 1 - Easing.easeOutCubic((j - 0.35) / 0.15) : j < 0.78 ? 0 : Math.sin(Math.PI * (j - 0.78) / 0.22) * 0.8;
    var h = j > 0.45 && j < 0.8 ? Math.sin(Math.PI * (j - 0.45) / 0.35) * 0.42 : 0;
    var brazos = j < 0.35 ? -Easing.easeInOutSine(j / 0.35) : j < 0.6 ? -1 + 2.4 * Easing.easeOutCubic((j - 0.35) / 0.25) : 1.4 * (1 - Easing.easeInOutSine((j - 0.6) / 0.4));
    p.cadera = [p.cadera[0], 1.0 - 0.3 * ag + h, p.cadera[2] - 0.08 * ag];
    p.tronco = [20 * ag, p.tronco[1], 0];
    p.pieI = [p.pieI[0], 0.115 + h, p.pieI[2]]; p.pieD = [p.pieD[0], 0.115 + h, p.pieD[2]];
    p.rodillaI = [0.1, 0, 1]; p.rodillaD = [0.1, 0, 1];
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D', x = p.cadera[0];
      p['mano' + L] = brazos < 0 ? E3.lerp3([x + s * 0.34, 0.86, 0.06], [x + s * 0.3, 0.85, -0.45], -brazos) : E3.lerp3([x + s * 0.34, 0.86, 0.06], [x + s * 0.3, 2.0 + h, 0.2], Math.min(1, brazos));
      p['codo' + L] = [0.3, -0.3, -0.6];
    });
    p.pies = [h > 0.05 ? 25 : 0, h > 0.05 ? 25 : 0];
    return p;
  }

  PS.video({
    id: 'cardio-musculo', titulo: '¿El cardio te quita músculo? (plano secuencia)',
    escenas: ESCENAS,
    claves: { cardio: 'amarillo', musculo: 'verde', fuerza: 'verde', potencia: 'rojo', miedo: 'rojo', primero: 'amarillo' },
    camara: [
      [[0, 0], { az: 40, el: 6, dist: 4.1, y: 1.44 }],
      [[0, 0.95], { az: 30, el: 6, dist: 4.3, y: 1.4 }],
      [[1, 0.8], { az: 58, el: 8, dist: 5.2, y: 1.0 }],
      [[2, 0.8], { az: 30, el: 8, dist: 5.4, y: 1.0 }],
      [[3, 0.8], { az: -20, el: 8, dist: 5.4, y: 1.0 }],
      [[4, 0.25], { az: 14, el: 6, dist: 5.6, y: 1.0, dx: 0.3 }],
      [[4, 0.9], { az: 24, el: 8, dist: 5.8, y: 1.0, dx: 0.4 }],
      [[5, 0.8], { az: 6, el: 6, dist: 5.2, y: 1.05, dx: 0.4 }],
      [[6, 0.7], { az: 0, el: 4, dist: 4.6, y: 1.12, dx: 0.45 }],
      [[6, 1], { az: -4, el: 4, dist: 4.4, y: 1.14, dx: 0.45 }]
    ],
    libre: [[[0, 0], [0, 0.85]]],
    golpes: [[4, 0.62], [6, 0.72]],
    zona: function (T, b) {
      if (b.entre(T, [1, 0.28], [4, 0.05]) || b.entre(T, [4, 0.7], [6, 0.02]) || b.entre(T, [6, 0.25], [6, 1.01])) return ZONA_TARJETA;
      return [70, 300, 1010, 1330];
    },
    vista: function (T, b, cam, ex) {
      var abre = ex ? ex.abre : 0;
      // pedalea mas rapido en el estudio; se baja de la bici al empezar la potencia
      var vel = 160 + 120 * b.k(T, [2, 0], [2, 0.4]) - 200 * b.k(T, [3, 0.6], [4, 0.05]);
      var ang = T * vel;
      var baja = b.k(T, [4, 0.02], [4, 0.2], Easing.easeInOutCubic);
      var sentado = TOR3D.bici(ang), parado = PS.depie(T, { x: XP, z: -0.1 });
      var p = baja <= 0 ? sentado : baja >= 1 ? parado : mezcla(sentado, parado, baja);
      var cara = PS.boca(abre), mus = null, mira = 0.85, pesas = null;
      if (T < b.f(1, 0)) cara.cejas = 'alzadas';
      else if (T < b.f(2, 0)) {
        var miedo = b.k(T, [1, 0.35], [1, 0.6]);
        if (miedo > 0) { cara = { ojos: 'grandes', boca: abre > 0.07 ? 'habla' : 'o', abre: abre, cerrada: 'o' }; mus = { biceps: 'rojo' }; }
      } else if (T < b.f(3, 0)) { mira = 0.6; }
      else if (T < b.f(4, 0)) {
        // alivio: saca biceps desde la bici
        var fl = b.k(T, [3, 0.15], [3, 0.45], Easing.easeOutBack) * (1 - b.k(T, [3, 0.85], [4, 0.02]));
        p.manoD = E3.lerp3(p.manoD, [0.6, 1.75, -0.2], fl); p.codoD = E3.lerp3(p.codoD, [0.5, -1, 0.05], fl);
        mus = { biceps: true, brillo: 0.3 * fl }; cara = PS.boca(abre);
      } else if (T < b.f(5, 0)) {
        if (baja >= 1) {
          var j = b.k(T, [4, 0.3], [4, 0.72]);
          if (j > 0 && j < 1) { salto(p, j); mus = { cuadriceps: true, gluteos: true, gemelos: true, brillo: 0.3 }; cara = { boca: 'dientes', cejas: 'enojo' }; mira = 0.2; }
        }
      } else if (T < b.f(6, 0)) {
        // cuenta con los dedos: primero lo que mas te importa
        p = PS.depie(T, { x: XP, z: -0.1, gesto: b.k(T, [5, 0.05], [5, 0.25]) * (1 - b.k(T, [5, 0.8], [5, 0.98])), lado: 1 });
      } else {
        p = PS.depie(T, { x: XP, z: -0.1 });
        PS.senalar(p, cam, b.k(T, [6, 0.5], [6, 0.68]) * (1 - b.k(T, [6, 0.84], [6, 0.98])), -1);
        cara.cejas = 'alzadas'; mira = 1;
      }
      PS.mirarCamara(p, cam, mira);
      return { figuras: [{ quien: 'tor', pose: p, pesas: pesas, musc: mus, cara: cara }], objetos: [{ tipo: 'bici', p: [0, 0, 0], pedal: ang }] };
    },
    lienzo: function (T, b, pr) {
      var r = [];
      if (b.entre(T, [3, 0.15], [4, 0])) r.push(<g key="br">{E3.brilla(T, pr, ['m:biceps:1'], b.k(T, [3, 0.15], [3, 0.4]), true, 60)}</g>);
      if (b.entre(T, [4, 0.55], [4, 0.9])) r.push(<global.V.Polvo key="pv" T={T} c={pr([XP, 0.05, -0.1])} cuando={b.f(4, 0.64)} n={18} fuerza={1} dura={0.9} />);
      return <g>{r}</g>;
    },
    encima: function (T, b, pr) {
      var r = [];
      var tit = 1 - b.k(T, [0, 0.9], [1, 0.1]);
      if (tit > 0.01) r.push(<div key="tit" style={{ position: 'absolute', inset: 0, opacity: tit }}><E3.Rot T={T} text="¿EL *CARDIO* TE QUITA MÚSCULO?" y={262} s={0.98} cuando={b.f(0, 0.04)} /></div>);
      // el miedo: el musculo "imaginado" que se vacia
      if (b.entre(T, [1, 0.3], [2, 0.05])) {
        var v = 1 - 0.85 * b.k(T, [1, 0.4], [1, 0.95], Easing.easeInOutSine);
        r.push(<PS.Barras key="mi" T={T} cuando={b.f(1, 0.32)} hasta={b.f(2, 0.0)} titulo="EL MIEDO" sombra="rojo" y={300}
          items={[{ label: 'MÚSCULO', v: v, color: v < 0.5 ? 'rojo' : 'amarillo', valor: '' }]} />);
      }
      r.push(<PS.Estudio key="es" T={T} cuando={b.f(2, 0.2)} hasta={b.f(3, 0.05)} autor="Schumann y col., 2022" detalle="Metaanálisis · cardio + pesas vs. solo pesas" />);
      r.push(<PS.Barras key="b1" T={T} cuando={b.f(3, 0.08)} hasta={b.f(4, 0.1)} titulo="CARDIO + PESAS" sombra="verde"
        items={[{ label: 'MÚSCULO', v: 0.85, color: 'verde', valor: 'IGUAL' }, { label: 'FUERZA', v: 0.85, color: 'verde', valor: 'IGUAL' }]} />);
      r.push(<PS.Barras key="b2" T={T} cuando={b.f(4, 0.74)} hasta={b.f(5, 0.04)} titulo="CARDIO + PESAS" sombra="rojo"
        items={[{ label: 'POTENCIA', v: 0.68, color: 'rojo', valor: 'UN POCO' }]} />);
      // el consejo: el orden
      r.push(<PS.Tarjeta key="or" T={T} cuando={b.f(5, 0.12)} hasta={b.f(6, 0.02)} y={300} w={760} h={250}>
        <PS.Etiqueta x={30} y={58} text="EL MISMO DÍA" />
        <g transform="translate(30 0)">
          <circle cx={34} cy={128} r={30} fill={C.YEL} stroke={C.INK} strokeWidth={5} />
          <text x={34} y={142} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={38} fill={C.INK}>1</text>
          <text x={84} y={142} fontFamily="'Barlow Semi Condensed', sans-serif" fontWeight={800} fontSize={44} fill={C.INK}>LO QUE MÁS TE IMPORTA</text>
          <circle cx={34} cy={204} r={30} fill="#EFEBE4" stroke={C.INK} strokeWidth={5} />
          <text x={34} y={218} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={38} fill={C.INK}>2</text>
          <text x={84} y={218} fontFamily="'Barlow Semi Condensed', sans-serif" fontWeight={800} fontSize={44} fill="#5a534b">LO OTRO</text>
        </g>
      </PS.Tarjeta>);
      r.push(<PS.Encuesta key="en" T={T} cuando={b.f(6, 0.3)} pregunta="¿HACES CARDIO?" a={{ text: 'SÍ', color: 'verde' }} b={{ text: 'ME DA MIEDO', color: 'rojo' }} />);
      return <div style={{ position: 'absolute', inset: 0 }}>{r}</div>;
    },
    sobre: function (T, b, pr) {
      if (!b.entre(T, [6, 0.6], [7, 0])) return null;
      var c = pr('manoI');
      return <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}><PS.Toque T={T} cuando={b.f(6, 0.7)} x={c[0]} y={c[1]} /></svg>;
    },
    accion: { dur: 4.2, pregunta: '¿CARDIO SÍ O NO?', vo: 'Compártelo con quien le tiene miedo al cardio y guárdalo para tu próximo entreno.' },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
