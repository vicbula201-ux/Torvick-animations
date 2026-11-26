/* ============================================================
   ¿LAS MEDIAS REPETICIONES SIRVEN? — formato de concepto en un solo plano (PS)
   Tor en la extension de piernas: el recorrido completo (amarillo), la mitad
   donde el musculo esta estirado (verde: crecio igual) y la mitad de arriba,
   donde esta corto (rojo: la que menos sirve). La base es el recorrido
   completo; las medias estiradas, un extra al final de la serie.
   Evidencia: Pedrosa GF, Lima FV, Schoenfeld BJ, y col. Partial range of motion
   training elicits favorable improvements in muscular adaptations when carried
   out at long muscle lengths. Eur J Sport Sci. 2022;22(8):1250-1260 (extension
   de piernas: las medias en la parte estirada, parecidas o mejores que el
   recorrido completo; las de la parte corta, menos). Wolf M, Androulakis-
   Korakakis P, Fisher J, Schoenfeld B, Steele J. Partial vs full range of
   motion resistance training: a systematic review and meta-analysis. Int J
   Strength Cond. 2023;3(1).
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var E3 = global.E3, PS = global.PS, TOR3D = global.TOR3D, A = global.REELS.ayudas;
  var Easing = global.Easing, clamp = global.clamp;
  var C = global.P.C;
  var RAD = Math.PI / 180;

  var ZONA_TARJETA = [70, 660, 1010, 1330];

  /* extension de piernas: k 0 rodillas dobladas (cuadriceps estirado) .. 1 piernas estiradas */
  function extension(k) {
    var e = clamp(k, 0, 1), t = (85 - 85 * e) * RAD;
    var p = { cadera: [0, 0.66, -0.05], tronco: [-4, 0, 0], cabeza: [0, 0, 0], rodillaI: [0.1, 0.8, 1], rodillaD: [0.1, 0.8, 1],
      manoI: [-0.36, 0.6, 0.0], manoD: [0.36, 0.6, 0.0], pies: [10 - 10 * e, 10 - 10 * e] };
    [-1, 1].forEach(function (s) {
      var L = s < 0 ? 'I' : 'D', rod = [s * 0.13, 0.62, 0.4];
      p['pie' + L] = [s * 0.13, rod[1] - 0.43 * Math.sin(t), rod[2] + 0.43 * Math.cos(t)];
    });
    return p;
  }
  function maquina(p) {
    var J = TOR3D.esqueleto(p);
    var sh = J.tobilloD.clone().sub(J.rodillaD).normalize();
    var frente = TOR3D.v(0, sh.z, -sh.y);
    var rod = J.tobilloD.clone().add(frente.multiplyScalar(0.1)).setX(0);
    return [
      { tipo: 'banco', p: [0, 0, 0.04], largo: 0.56, alto: 0.54, ancho: 0.5, respaldo: { ang: 95, largo: 0.95, ancho: 0.5 } },
      { tipo: 'rodillo', id: 'pierna', c: [rod.x, rod.y, rod.z], pivote: [0, J.rodillaD.y, J.rodillaD.z], ancho: 0.5 }
    ];
  }
  // un ciclo entre k0 y k1 (sube 40 %, baja 60 %)
  function ciclo(u, k0, k1) { return k0 + (k1 - k0) * PS.rep(u); }
  // el recorrido del tobillo entre k0 y k1, en pantalla
  function recorrido(pr, k0, k1) {
    var pts = [];
    for (var i = 0; i <= 14; i++) { var J = TOR3D.esqueleto(extension(k0 + (k1 - k0) * i / 14)); pts.push(pr([J.tobilloD.x + 0.2, J.tobilloD.y, J.tobilloD.z])); }
    return pts;
  }
  function Arco(props) {
    var d = props.pts.map(function (q, i) { return (i ? 'L ' : 'M ') + q[0].toFixed(1) + ' ' + q[1].toFixed(1); }).join(' ');
    return (
      <g opacity={props.op} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} stroke={C.INK} strokeWidth={30} />
        <path d={d} stroke={props.color} strokeWidth={18} />
      </g>
    );
  }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3.0, vo: '¿Las medias repeticiones sirven para algo?' },
    { nombre: 'Lo de siempre', dur: 3.2, vo: 'Siempre te dijeron que hagas el recorrido completo.' },
    { nombre: 'Estudio', dur: 5.4, vo: 'Pero un estudio probó hacer solo la mitad, en la parte donde el músculo está estirado.' },
    { nombre: 'Resultado', dur: 3.8, vo: 'Y el músculo creció igual que con el recorrido completo.' },
    { nombre: 'Las de arriba', dur: 4.8, vo: 'Las medias de arriba, donde el músculo está corto, son las que menos sirven.' },
    { nombre: 'El consejo', dur: 5.6, vo: 'Así que el recorrido completo es la base, y las medias estiradas, un extra al final de la serie.' },
    { nombre: 'Debate final', dur: 4.0, vo: '¿Tú haces medias repeticiones? Te leo en los comentarios.' }
  ];
  // que hace la pierna en cada momento: [k0, k1, color] del tramo y la k actual
  function plan(T, b) {
    if (T < b.f(1, 0)) return { k: ciclo(b.k(T, [0, 0.1], [0, 0.95]) * 3, 0, 0.35), tramo: null };
    if (T < b.f(2, 0.15)) return { k: ciclo(b.k(T, [1, 0.05], [2, 0.1]) * 2, 0, 1), tramo: [0, 1, 'amarillo'] };
    if (T < b.f(4, 0)) return { k: ciclo(b.k(T, [2, 0.15], [3, 0.95]) * 7, 0, 0.5), tramo: [0, 0.5, 'verde'] };
    if (T < b.f(5, 0)) return { k: ciclo(b.k(T, [4, 0.05], [4, 0.95]) * 4, 0.5, 1), tramo: [0.5, 1, 'rojo'] };
    if (T < b.f(6, 0)) {
      var u = b.k(T, [5, 0.05], [5, 0.95]);
      return u < 0.55 ? { k: ciclo(u / 0.55 * 2, 0, 1), tramo: [0, 1, 'amarillo'] } : { k: ciclo((u - 0.55) / 0.45 * 3, 0, 0.5), tramo: [0, 0.5, 'verde'] };
    }
    return { k: 0.05, tramo: null };
  }

  PS.video({
    id: 'parciales', titulo: '¿Las medias repeticiones sirven? (plano secuencia)',
    escenas: ESCENAS,
    claves: { medias: 'amarillo', completo: 'amarillo', estirado: 'verde', estiradas: 'verde', igual: 'verde', corto: 'rojo', arriba: 'rojo', menos: 'rojo', base: 'amarillo' },
    camara: [
      [[0, 0], { az: 36, el: 4, dist: 3.7, y: 1.26, dz: 0.15 }],
      [[0, 0.95], { az: 44, el: 4, dist: 3.9, y: 1.22, dz: 0.15 }],
      [[1, 0.9], { az: 78, el: 8, dist: 4.8, y: 0.85, dz: 0.2 }],
      [[3, 0.9], { az: 86, el: 10, dist: 5.0, y: 0.85, dz: 0.2 }],
      [[4, 0.9], { az: 70, el: 8, dist: 5.0, y: 0.85, dz: 0.2 }],
      [[5, 0.9], { az: 56, el: 8, dist: 5.0, y: 0.9, dz: 0.15 }],
      [[6, 1], { az: 24, el: 4, dist: 4.4, y: 1.0, dz: 0.1 }]
    ],
    libre: [[[0, 0], [0, 0.85]]],
    golpes: [[6, 0.72]],
    zona: function (T, b) {
      if (b.entre(T, [2, 0.25], [4, 0.04]) || b.entre(T, [5, 0.1], [6, 0.04]) || b.entre(T, [6, 0.25], [6, 1.01])) return ZONA_TARJETA;
      return T < b.f(1, 0.1) ? [70, 400, 1010, 1330] : [70, 330, 1010, 1330];
    },
    vista: function (T, b, cam, ex) {
      var abre = ex ? ex.abre : 0, q = plan(T, b), p = extension(q.k);
      var cara = PS.boca(abre), mira = 0.85, mus = { cuadriceps: true, brillo: 0.3 * q.k };
      if (T < b.f(1, 0)) cara.cejas = 'alzadas';
      if (q.tramo && q.tramo[2] === 'rojo') mus = { cuadriceps: 'rojo' };
      if (T >= b.f(6, 0)) {
        // el debate: senala desde la maquina y toca la pantalla
        var to = b.k(T, [6, 0.5], [6, 0.68]) * (1 - b.k(T, [6, 0.84], [6, 0.98]));
        var az = (cam.az || 0) * RAD;
        p.manoD = E3.lerp3([0.36, 0.6, 0.0], [0.2 + Math.sin(az) * 0.6, 1.35, Math.cos(az) * 0.6], Easing.easeInOutSine(to)); p.codoD = [0.3, -1, 0];
        cara.cejas = 'alzadas'; mira = 1; mus = null;
      }
      PS.mirarCamara(p, cam, mira);
      return { figuras: [{ quien: 'tor', pose: p, musc: mus, cara: cara }], objetos: maquina(p) };
    },
    lienzo: function (T, b, pr) {
      var q = plan(T, b), r = [];
      if (q.tramo) {
        var op = 0.95;
        r.push(<Arco key="ar" pts={recorrido(pr, q.tramo[0], q.tramo[1])} color={q.tramo[2] === 'verde' ? C.GRN : q.tramo[2] === 'rojo' ? C.RED : C.YEL} op={op} />);
      }
      if (b.entre(T, [3, 0.05], [4, 0])) r.push(<g key="br">{E3.brilla(T, pr, ['m:cuadriceps:0', 'm:cuadriceps:1'], b.k(T, [3, 0.05], [3, 0.3]), true, 60)}</g>);
      return <g>{r}</g>;
    },
    encima: function (T, b, pr) {
      var r = [];
      var tit = 1 - b.k(T, [0, 0.9], [1, 0.1]);
      if (tit > 0.01) r.push(<div key="tit" style={{ position: 'absolute', inset: 0, opacity: tit }}><E3.Rot T={T} text="¿MEDIAS *REPETICIONES*?" y={262} s={1.1} cuando={b.f(0, 0.04)} /></div>);
      r.push(<PS.Estudio key="es" T={T} cuando={b.f(2, 0.3)} hasta={b.f(3, 0.08)} autor="Pedrosa y col., 2022" detalle="Extensión de piernas · medias estiradas" />);
      r.push(<PS.Barras key="b1" T={T} cuando={b.f(3, 0.1)} hasta={b.f(4, 0.04)} titulo="CUÁDRICEPS"
        items={[{ label: 'COMPLETO', v: 0.8, color: 'amarillo', valor: '' }, { label: 'ESTIRADO', v: 0.82, color: 'verde', valor: '' }]} />);
      if (b.entre(T, [4, 0.3], [5, 0.05])) {
        // la X a la derecha, arriba, fuera del cuerpo de Tor (la caja del cuerpo se mide en pantalla)
        var xs = ['cabeza', 'cuello', 'cadera', 'rodillaD', 'tobilloD', 'manoD'].map(function (q) { return pr(q)[0]; });
        r.push(<A.Mal key="x" T={T} cuando={b.f(4, 0.35)} hasta={b.f(5, 0.0)} x={Math.min(920, Math.max.apply(null, xs) + 50)} y={520} s={0.5} />);
      }
      r.push(<PS.Tarjeta key="or" T={T} cuando={b.f(5, 0.12)} hasta={b.f(6, 0.02)} y={300} w={780} h={250}>
        <PS.Etiqueta x={30} y={58} text="EN CADA SERIE" />
        <g transform="translate(30 0)">
          <circle cx={34} cy={128} r={30} fill={C.YEL} stroke={C.INK} strokeWidth={5} />
          <text x={34} y={142} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={38} fill={C.INK}>1</text>
          <text x={84} y={142} fontFamily="'Barlow Semi Condensed', sans-serif" fontWeight={800} fontSize={44} fill={C.INK}>RECORRIDO COMPLETO</text>
          <circle cx={34} cy={204} r={30} fill={C.GRN} stroke={C.INK} strokeWidth={5} />
          <text x={34} y={218} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={38} fill="#ffffff">2</text>
          <text x={84} y={218} fontFamily="'Barlow Semi Condensed', sans-serif" fontWeight={800} fontSize={44} fill={C.INK}>MEDIAS ESTIRADAS AL FINAL</text>
        </g>
      </PS.Tarjeta>);
      r.push(<PS.Encuesta key="en" T={T} cuando={b.f(6, 0.3)} pregunta="¿HACES MEDIAS REPETICIONES?" a={{ text: 'SÍ', color: 'verde' }} b={{ text: 'NUNCA', color: 'rojo' }} />);
      return <div style={{ position: 'absolute', inset: 0 }}>{r}</div>;
    },
    sobre: function (T, b, pr) {
      if (!b.entre(T, [6, 0.6], [7, 0])) return null;
      var c = pr('manoD');
      return <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}><PS.Toque T={T} cuando={b.f(6, 0.7)} x={c[0]} y={c[1]} /></svg>;
    },
    accion: { dur: 4.2, pregunta: '¿HACES MEDIAS?', vo: 'Compártelo con tu compañero de entreno y guárdalo para tu próximo día de pierna.' },
    cierreVo: 'Sígueme para más contenido.'
  });
})(window);
