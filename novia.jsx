/* ============================================================
   NOVIA — window.NOVIA: la novia de Tor (personaje para el publico
   femenino). Deportista, pelo negro largo, top deportivo amarillo y
   calzas grises; siempre con la paleta de cinco y el trazo INK.

   <NOVIA.Novia s pose k parpadeo boca />   de frente (viewBox 1200x1600,
       cabeza en 600,400, piso en 1500, como Tor). pose: 'abajo' | 'cadera'
       (manos en la cintura) | 'saludo' | 'flex' (saca biceps con el brazo
       derecho de la pantalla) o un objeto { izq: {codo, mano}, der: {...} };
       k 0..1 mezcla de 'abajo' a la pose. boca 'sonrisa' (por defecto) o
       'triste'. musc: { glu, cuad } tine las calzas (no se ven los gluteos de
       frente: en los ejercicios se usa el perfil).
   NOVIA.perfil(g, T, op) -> { fondo, agarre, encima }: capas para B.Perfil
       que la convierten en ella: cola de caballo que cuelga con la gravedad
       (fondo), top deportivo y gluteo mas redondo (agarre; op.glu 0..1 lo pinta
       de amarillo como musc; op.top cambia el color del top), pelo y pestanas (encima). Se suman a lo que ya
       dibuje cada escena en esas capas.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var P = global.P, B = global.B;
  var clamp = global.clamp;
  var U = B.util;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = { stroke: C.INK, strokeWidth: 15, strokeLinejoin: 'round', strokeLinecap: 'round' };

  /* ---------------- de frente ---------------- */

  var POSES = {
    abajo: { izq: { codo: [446, 820], mano: [452, 1000] }, der: { codo: [754, 820], mano: [748, 1000] } },
    cadera: { izq: { codo: [372, 800], mano: [478, 930] }, der: { codo: [828, 800], mano: [722, 930] } },
    saludo: { izq: { codo: [372, 800], mano: [478, 930] }, der: { codo: [870, 560], mano: [900, 360] } },
    flex: { izq: { codo: [372, 800], mano: [478, 930] }, der: { codo: [900, 620], mano: [880, 450] } }
  };
  var HOMBRO = { izq: [462, 628], der: [738, 628] };

  function mezclar(a, b, k) {
    var r = {};
    ['izq', 'der'].forEach(function (l) {
      r[l] = { codo: U.lerpP(a[l].codo, b[l].codo, k), mano: U.lerpP(a[l].mano, b[l].mano, k) };
    });
    return r;
  }

  function Novia(props) {
    var s = props.s == null ? 1 : props.s;
    var k = props.k == null ? 1 : clamp(props.k, 0, 1);
    var meta = typeof props.pose === 'object' && props.pose ? props.pose : (POSES[props.pose] || POSES.cadera);
    var pz = mezclar(POSES.abajo, meta, k);
    var par = clamp(props.parpadeo || 0, 0, 1);
    var triste = props.boca === 'triste';
    var musc = props.musc || {};
    var cuad = clamp(musc.cuad || 0, 0, 1);
    var brazo = function (l) {
      var h = HOMBRO[l], q = pz[l];
      return (
        <g key={l}>
          <path d={U.capsula(h, q.codo, 36, 30)} fill={BLANCO} {...LN} />
          <path d={U.capsula(q.codo, q.mano, 30, 24)} fill={BLANCO} {...LN} />
          <circle cx={q.mano[0]} cy={q.mano[1]} r={32} fill={BLANCO} stroke={C.INK} strokeWidth={14} />
        </g>
      );
    };
    var pierna = function (l, i) {
      var x = i ? 1 : -1;
      var cad = [600 + x * 78, 1060], rod = [600 + x * 92, 1268], tob = [600 + x * 84, 1450];
      return (
        <g key={l}>
          <path d={U.capsula(cad, rod, 92, 54)} fill={C.GRY} {...LN} />
          <path d={U.capsula(rod, tob, 54, 34)} fill={C.GRY} {...LN} />
          {cuad > 0 ? <path d={U.capsula(U.lerpP(cad, rod, 0.12), U.lerpP(cad, rod, 0.8), 64, 38)} fill={C.YEL} opacity={cuad} /> : null}
          <path d={'M ' + (tob[0] - x * 6 - 46) + ' 1500 Q ' + (tob[0] - 50) + ' 1440 ' + tob[0] + ' 1440 Q ' + (tob[0] + 50) + ' 1440 ' + (tob[0] + x * 6 + 46) + ' 1500 Z'}
            fill={BLANCO} {...LN} strokeWidth={13} />
        </g>
      );
    };
    var ojo = function (cx, i) {
      if (par > 0.5) return <path key={i} d={'M ' + (cx - 18) + ' 412 Q ' + cx + ' 420 ' + (cx + 18) + ' 412'} fill="none" stroke={C.INK} strokeWidth={8} strokeLinecap="round" />;
      var lado = i ? 1 : -1;
      return (
        <g key={i}>
          <ellipse cx={cx} cy={412} rx={13} ry={16 * (1 - par)} fill={C.INK} />
          <path d={'M ' + (cx - 22) + ' 400 Q ' + cx + ' 386 ' + (cx + 22) + ' 400'} fill="none" stroke={C.INK} strokeWidth={8} strokeLinecap="round" />
          <path d={'M ' + (cx + lado * 20) + ' 398 L ' + (cx + lado * 32) + ' 388'} stroke={C.INK} strokeWidth={7} strokeLinecap="round" />
        </g>
      );
    };
    return (
      <svg width={1200 * s} height={1600 * s} viewBox="0 0 1200 1600" style={{ display: 'block', overflow: 'visible' }}>
        {/* el pelo largo, detras de la cabeza y los hombros */}
        <path d="M 498 360 C 450 470 452 650 474 790 Q 600 820 726 790 C 748 650 750 470 702 360 Z" fill={C.INK} stroke={C.INK} strokeWidth={14} strokeLinejoin="round" />
        {props.fondo || null}
        {pierna('izq', 0)}
        {pierna('der', 1)}
        {/* torso: hombros, cintura y cadera */}
        <path d={'M 528 586 Q 476 590 456 616 Q 436 646 444 700 Q 456 786 494 862 Q 506 900 484 960 Q 454 1012 452 1074 ' +
          'Q 600 1104 748 1074 Q 746 1012 716 960 Q 694 900 706 862 Q 744 786 756 700 Q 764 646 744 616 Q 724 590 672 586 Z'}
          fill={BLANCO} {...LN} />
        {/* cuello */}
        <path d="M 566 470 L 562 590 Q 600 612 638 590 L 634 470 Z" fill={BLANCO} {...LN} />
        {/* calzas: la cadera hasta la cintura */}
        <path d="M 484 960 Q 470 990 464 1020 Q 452 1060 452 1074 Q 600 1104 748 1074 Q 748 1060 736 1020 Q 730 990 716 960 Q 600 984 484 960 Z"
          fill={C.GRY} {...LN} />
        <path d="M 488 962 Q 600 990 712 962" fill="none" stroke={C.INK} strokeWidth={12} strokeLinecap="round" />
        {/* top deportivo */}
        <path d="M 454 640 Q 470 606 526 600 L 556 648 Q 600 672 644 648 L 674 600 Q 730 606 746 640 Q 756 712 742 800 Q 600 826 458 800 Q 444 712 454 640 Z"
          fill={C.YEL} {...LN} />
        <path d="M 478 742 Q 538 796 600 744 Q 662 796 722 742" fill="none" stroke={C.INK} strokeWidth={10} strokeLinecap="round" />
        {/* ombligo y un apunte de abdomen */}
        <path d="M 592 900 Q 600 912 608 900" fill="none" stroke={C.INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M 560 840 Q 556 870 562 896 M 640 840 Q 644 870 638 896" fill="none" stroke={C.GRY} strokeWidth={8} strokeLinecap="round" />
        {brazo('izq')}
        {brazo('der')}
        {/* cabeza */}
        <ellipse cx={600} cy={402} rx={88} ry={104} fill={BLANCO} {...LN} />
        {/* mechones que caen al costado de la cara y el flequillo */}
        <path d="M 520 350 C 498 430 500 520 520 610 L 550 606 C 534 520 532 444 548 384 Z" fill={C.INK} stroke={C.INK} strokeWidth={10} strokeLinejoin="round" />
        <path d="M 680 350 C 702 430 700 520 680 610 L 650 606 C 666 520 668 444 652 384 Z" fill={C.INK} stroke={C.INK} strokeWidth={10} strokeLinejoin="round" />
        <path d="M 512 392 C 506 316 552 290 604 290 C 664 292 700 326 690 396 C 664 352 628 338 590 344 C 560 346 532 364 512 392 Z"
          fill={C.INK} stroke={C.INK} strokeWidth={12} strokeLinejoin="round" />
        {ojo(564, 0)}
        {ojo(636, 1)}
        <path d="M 600 424 L 594 446 L 606 448" fill="none" stroke={C.INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        {triste
          ? <path d="M 578 478 Q 600 464 622 478" fill="none" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
          : <path d="M 574 466 Q 600 494 626 466 Q 600 476 574 466 Z" fill={C.RED} stroke={C.INK} strokeWidth={7} strokeLinejoin="round" />}
        {props.children || null}
      </svg>
    );
  }

  /* ---------------- de perfil: capas para B.Perfil ---------------- */

  // tira de pelo con grosor que se afina (de w0 a w1) a lo largo de una polilinea
  function mechon(pts, w0, w1) {
    var izq = [], der = [];
    pts.forEach(function (p, i) {
      var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      var u = U.unidad(U.resta(b, a)), n = [-u[1], u[0]];
      var w = U.lerp(w0, w1, i / (pts.length - 1));
      izq.push(U.suma(p, U.por(n, w))); der.push(U.suma(p, U.por(n, -w)));
    });
    return 'M ' + izq.map(U.pt).join(' L ') + ' L ' + der.reverse().map(U.pt).join(' L ') + ' Z';
  }
  function bezier(a, b, c, d, n) {
    var r = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n, v = 1 - t;
      r.push([v * v * v * a[0] + 3 * v * v * t * b[0] + 3 * v * t * t * c[0] + t * t * t * d[0],
        v * v * v * a[1] + 3 * v * v * t * b[1] + 3 * v * t * t * c[1] + t * t * t * d[1]]);
    }
    return r;
  }

  function perfil(g, T, op) {
    op = op || {};
    var cab = g._cab;
    var glu = clamp(op.glu || 0, 0, 1);
    // cola de caballo: sale de arriba atras de la cabeza y cuelga con la gravedad
    var a = cab([52, -170]);
    var atras = U.unidad(U.resta(cab([100, -110]), cab([0, -110])));
    var mece = 16 * Math.sin((T || 0) * 2.3);
    var b = U.suma(a, U.por(atras, 120));
    var c = U.suma(U.suma(a, U.por(atras, 150)), [mece * 0.5, 170]);
    var d = U.suma(U.suma(a, U.por(atras, 110)), [mece, 330]);
    var cola = mechon(bezier(a, b, c, d, 14), 34, 8);
    // gluteo redondo: un bulto detras de la cadera, en el marco de la pelvis
    var pv = g.pelvis;
    var g0 = pv(80, -58), g1 = pv(-96, -26);
    var bulto = 'M ' + U.pt(g0) + ' C ' + U.pt(pv(70, -178)) + ' ' + U.pt(pv(-118, -176)) + ' ' + U.pt(g1);
    // top deportivo: una banda del torso con el busto
    var frente = [], espalda = [];
    for (var i = 0; i <= 8; i++) {
      var t = 0.58 + 0.28 * i / 8;
      var busto = 36 * Math.exp(-Math.pow((t - 0.7) / 0.06, 2));
      frente.push(g.torso(t, g.anchoFrente(t) + 6 + busto));
      espalda.push(g.torso(t, -g.anchoEspalda(t) - 6));
    }
    var top = 'M ' + frente.map(U.pt).join(' L ') + ' L ' + espalda.reverse().map(U.pt).join(' L ') + ' Z';
    // pelo: casquete negro sobre la cabeza (deja la cara)
    var casco = [[-62, -150], [-54, -190], [10, -212], [70, -186], [94, -140], [92, -96], [78, -62],
      [56, -60], [60, -100], [44, -140], [8, -166], [-30, -166]].map(cab);
    var pestanas = [[[-30, -130], [-20, -146]], [[-40, -128], [-36, -144]]].map(function (s) { return 'M ' + U.pt(cab(s[0])) + ' L ' + U.pt(cab(s[1])); }).join(' ');
    return {
      fondo: (
        <g>
          <path d={cola} fill={C.INK} stroke={C.INK} strokeWidth={10} strokeLinejoin="round" />
        </g>
      ),
      agarre: (
        <g>
          <path d={bulto + ' L ' + U.pt(pv(-10, -40)) + ' Z'} fill={C.GRY} />
          {glu > 0 ? <path d={bulto + ' L ' + U.pt(pv(-10, -40)) + ' Z'} fill={C.YEL} opacity={glu} /> : null}
          <path d={bulto} fill="none" stroke={C.INK} strokeWidth={15} strokeLinecap="round" />
          <path d={top} fill={op.top || C.YEL} {...LN} strokeWidth={13} />
        </g>
      ),
      encima: (
        <g>
          <path d={'M ' + casco.map(U.pt).join(' L ') + ' Z'} fill={C.INK} stroke={C.INK} strokeWidth={14} strokeLinejoin="round" />
          <circle cx={a[0]} cy={a[1]} r={20} fill={C.YEL} stroke={C.INK} strokeWidth={9} />
          <path d={pestanas} stroke={C.INK} strokeWidth={7} strokeLinecap="round" />
        </g>
      )
    };
  }

  global.NOVIA = { Novia: Novia, POSES: POSES, perfil: perfil };
})(window);
