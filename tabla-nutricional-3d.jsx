/* ============================================================
   TABLA NUTRICIONAL — video nuevo, TOR EN 3D (~38 s con la accion y el cierre)
   Gancho del autor (error del que mira): "Estás leyendo mal la tabla
   nutricional". Como leerla, en orden:
   1. la porcion: todos los numeros son por porcion, y el envase puede traer
      varias (aqui 4: 150 kcal x 4 = 600);
   2. calorias y proteina;
   3. azucares anadidos: la OMS recomienda que los azucares libres sean menos
      del 10 % de las calorias del dia (unos 50 g en una dieta de 2000 kcal;
      WHO, Guideline: sugars intake for adults and children, 2015);
   4. sodio: la OMS recomienda menos de 2000 mg al dia (5 g de sal; WHO, 2012);
   5. ingredientes: van de mayor a menor cantidad; y los sellos negros de
      advertencia ("alto en" / "exceso") de varios paises de Latinoamerica.
   La tabla del lienzo es un dibujo con iconos y numeros (sin frases): los
   rotulos dicen lo que hay que mirar. Los numeros son un ejemplo.
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var M = global.M, P = global.P, B = global.B, N = global.N, V = global.V, E3 = global.E3, TOR3D = global.TOR3D;
  var animate = global.animate, Easing = global.Easing, clamp = global.clamp;
  var A = global.REELS.ayudas;
  var C = P.C;
  var BLANCO = '#ffffff';
  var LN = { stroke: C.INK, strokeWidth: 12, strokeLinejoin: 'round', strokeLinecap: 'round' };

  function aArr(q) { return [q.x, q.y, q.z]; }
  function icono(Cmp, c, k, ang, props) {
    return (
      <g transform={'translate(' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ') rotate(' + (ang || 0).toFixed(1) + ') scale(' + k + ') translate(-120 -120)'}>
        <Cmp s={1} {...(props || {})} />
      </g>
    );
  }
  /* ---------------- iconos propios ---------------- */
  function Azucar(props) {
    var c = props.c, k = props.k || 1;
    return (
      <g transform={'translate(' + c[0] + ' ' + c[1] + ') scale(' + k + ')'}>
        <path d="M -34 -14 L 0 -32 L 34 -14 L 0 4 Z" fill={BLANCO} {...LN} />
        <path d="M -34 -14 L -34 24 L 0 42 L 0 4 Z" fill={C.GRY} {...LN} />
        <path d="M 34 -14 L 34 24 L 0 42 L 0 4 Z" fill={BLANCO} {...LN} />
      </g>
    );
  }
  function Sal(props) {
    var c = props.c, k = props.k || 1;
    return (
      <g transform={'translate(' + c[0] + ' ' + c[1] + ') scale(' + k + ')'}>
        <rect x={-26} y={-20} width={52} height={64} rx={16} fill={BLANCO} {...LN} />
        <path d="M -24 -16 Q -24 -46 0 -46 Q 24 -46 24 -16 Z" fill={C.GRY} {...LN} />
        {[-10, 0, 10].map(function (x) { return <circle key={x} cx={x} cy={-32 + (x ? 4 : 0)} r={3.5} fill={C.INK} />; })}
      </g>
    );
  }
  function Sello(props) {
    var c = props.c, k = props.k || 1, pts = [];
    for (var i = 0; i < 8; i++) { var a = (i * 45 + 22.5) * Math.PI / 180; pts.push((Math.cos(a) * 92).toFixed(1) + ' ' + (Math.sin(a) * 92).toFixed(1)); }
    var pts2 = pts.map(function (q) { var v = q.split(' ').map(Number); return (v[0] * 0.86).toFixed(1) + ' ' + (v[1] * 0.86).toFixed(1); });
    return (
      <g transform={'translate(' + c[0] + ' ' + c[1] + ') scale(' + k + ')'}>
        <path d={'M ' + pts.join(' L ') + ' Z'} fill={C.INK} />
        <path d={'M ' + pts2.join(' L ') + ' Z'} fill="none" stroke={BLANCO} strokeWidth={5} />
        <g transform="scale(0.95)">{props.children}</g>
      </g>
    );
  }
  function num(x, y, t, size, color) {
    return <text x={x} y={y} textAnchor="end" fontFamily="'Archivo Black', sans-serif" fontSize={size || 56} fill={color || C.INK}>{t}</text>;
  }

  /* ---------------- la tabla (en pantalla) ---------------- */
  // o: { T, x, y, s, marca: { fila: [color, p] }, x4, vibra, e }
  var FILAS = 5, ALTO_F = 118, ANCHO = 520;
  function Tabla(o) {
    var T = o.T, x = o.x, y = o.y, s = o.s || 1, e = o.e || { opacity: 1, scale: 1 };
    if (e.opacity < 0.02) return null;
    var dx = o.vibra ? M.vibra(T, 26, 4) : 0, dy = M.life(T, 3.4, 6);
    var H = 110 + FILAS * ALTO_F + 30, marcas = o.marca || {};
    var filas = [
      { icono: function (c) { return icono(N.ICONOS.cuchara, c, 0.42, 0, { lleno: 1 }); }, val: '30 g' },
      { icono: function (c) { return icono(N.ICONOS.fuego, c, 0.4); }, val: o.kcal || '150' },
      { icono: function (c) { return icono(N.COMIDA.pollo, c, 0.38); }, val: '3 g' },
      { icono: function (c) { return <Azucar c={c} k={0.9} />; }, val: '18 g' },
      { icono: function (c) { return <Sal c={c} k={0.85} />; }, val: '800 mg' }
    ];
    return (
      <g opacity={e.opacity} transform={'translate(' + (x + dx).toFixed(1) + ' ' + (y + dy).toFixed(1) + ') scale(' + (s * e.scale).toFixed(3) + ')'}>
        <rect x={14} y={14} width={ANCHO} height={H} rx={30} fill={C.GRY} />
        <rect x={0} y={0} width={ANCHO} height={H} rx={30} fill={BLANCO} stroke={C.INK} strokeWidth={14} />
        <path d={'M 0 30 Q 0 0 30 0 L ' + (ANCHO - 30) + ' 0 Q ' + ANCHO + ' 0 ' + ANCHO + ' 30 L ' + ANCHO + ' 96 L 0 96 Z'} fill={C.INK} />
        {[40, 70].map(function (yy, i) { return <path key={i} d={'M 40 ' + yy + ' L ' + (i ? 300 : 420) + ' ' + yy} stroke={BLANCO} strokeWidth={12} strokeLinecap="round" />; })}
        {filas.map(function (fl, i) {
          var y0 = 110 + i * ALTO_F, m = marcas[i];
          var p = m ? clamp(m[1], 0, 1) : 0;
          return (
            <g key={i}>
              {p > 0.01 ? <rect x={18} y={y0 + 10} width={(ANCHO - 36) * p} height={ALTO_F - 20} rx={22} fill={m[0]} opacity={0.9} /> : null}
              {fl.icono([82, y0 + ALTO_F / 2])}
              {num(ANCHO - 40, y0 + ALTO_F / 2 + 20, fl.val, 54)}
              {i < FILAS - 1 ? <path d={'M 30 ' + (y0 + ALTO_F) + ' L ' + (ANCHO - 30) + ' ' + (y0 + ALTO_F)} stroke={C.INK} strokeWidth={6} strokeLinecap="round" /> : null}
            </g>
          );
        })}
        {o.x4 > 0.02 ? (
          <g transform={'translate(' + (ANCHO - 10) + ' 120) scale(' + Easing.easeOutBack(clamp(o.x4, 0, 1)).toFixed(3) + ')'}>
            <circle cx={0} cy={0} r={58} fill={C.YEL} stroke={C.INK} strokeWidth={12} />
            {num(34, 20, '×4', 50)}
          </g>
        ) : null}
      </g>
    );
  }
  // los ingredientes de mayor a menor: el primero es azucar
  function Ingredientes(o) {
    var T = o.T, e = o.e;
    if (e.opacity < 0.02) return null;
    var tam = [150, 122, 98, 78, 62], x = 0;
    return (
      <g opacity={e.opacity} transform={'translate(' + o.x + ' ' + (o.y + M.life(T, 3, 5)).toFixed(1) + ') scale(' + e.scale.toFixed(3) + ')'}>
        {tam.map(function (w, i) {
          var x0 = x; x += w + 22;
          return (
            <g key={i}>
              <rect x={x0} y={(150 - w) / 2} width={w} height={w} rx={22} fill={i === 0 ? C.RED : (i % 2 ? C.GRY : BLANCO)} stroke={C.INK} strokeWidth={12} />
              {i === 0 ? <Azucar c={[x0 + w / 2, 72]} k={1.25} /> : null}
            </g>
          );
        })}
        <path d={'M 10 196 L ' + (x - 40) + ' 196'} stroke={C.INK} strokeWidth={12} strokeLinecap="round" />
        <path d={'M ' + (x - 70) + ' 172 L ' + (x - 36) + ' 196 L ' + (x - 70) + ' 220'} fill="none" stroke={C.INK} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }

  /* ---------------- Tor y el paquete ---------------- */
  function leyendo(extra) {
    return Object.assign({ cadera: [0, 1.0, 0], pieI: [-0.2, 0.115, 0.03], pieD: [0.2, 0.115, 0.03], cabeza: [-16, 0, 0],
      manoI: [-0.13, 1.32, 0.32], manoD: [0.13, 1.32, 0.32], codoI: [0.8, -1, 0], codoD: [0.8, -1, 0] }, extra || {});
  }
  function paquete(p, giro, extra) {
    var J = TOR3D.esqueleto(p), c = J.manoI.clone().add(J.manoD).multiplyScalar(0.5).add(TOR3D.v(0, 0.12, 0.04));
    return Object.assign({ tipo: 'paquete', p: aArr(c), giro: giro || 0, inclina: -10 }, extra || {});
  }
  var CAM = { az: 14, el: 4, dist: 8.0, y: 1.2, dx: 0.66 };
  var CAM2 = { az: 22, el: 4, dist: 7.6, y: 1.2, dx: 0.62 };
  var TAB = { x: 520, y: 400, s: 0.98 };
  // donde queda la tabla en pantalla: Tor no va debajo de ella
  var OCUPA_TABLA = [510, 390, 1050, 1140];
  function tabla(T, f, extra) { return <Tabla T={T} x={TAB.x} y={TAB.y} s={TAB.s} e={M.pop(T, f(0) - 0.6, 0.5)} {...(extra || {})} />; }
  function marca(T, f, a, b) { return animate({ from: 0, to: 1, start: f(a), end: f(b), ease: Easing.easeOutCubic })(T); }

  var ESCENAS = [
    { nombre: 'Gancho', dur: 3, vo: 'Cómo leer correctamente la tabla nutricional.',
      C: E3.escena({
        ocupa: [OCUPA_TABLA],
        tomas: [[0, { az: 20, el: 6, dist: 5.0, y: 1.45, dx: 0.4 }], [1, CAM]],
        vista: function (T) {
          var p = leyendo({ cabeza: [-10, 14 * Math.sin(T * 3), 8 * Math.sin(T * 2)] });
          return { figuras: [{ quien: 'tor', pose: p, cara: { ojos: 'grandes', boca: 'ondulada', cejas: 'alzadas' } }], objetos: [paquete(p, 180 * (0.5 + 0.5 * Math.sin(T * 2.6)))] };
        },
        lienzo: function (T, f) { return tabla(T, f, { vibra: true }); },
        mal: [{ x: 60, y: 520, cuando: 0.22, s: 0.6 }, { x: 860, y: 1180, cuando: 0.46, s: 0.5 }],
        r1: { text: 'TABLA *NUTRICIONAL*', s: 1.05, cuando: 0.02, tono: 'rojo' },
        r2: { text: '¿LA LEES *BIEN*?', s: 1.1, cuando: 0.4 }
      }) },

    { nombre: 'La porción', dur: 5.4, vo: 'Primero lee la porción. Todos los números son por porción y el paquete puede traer varias.',
      C: E3.escena({
        ocupa: [OCUPA_TABLA],
        tomas: [[0, CAM], [1, CAM2]],
        vista: function (T) { var p = leyendo(); return { figuras: [{ quien: 'tor', pose: p, cara: { ojos: 'grandes', boca: 'o', cejas: 'alzadas' } }], objetos: [paquete(p, 180)] }; },
        lienzo: function (T, f) {
          var kc = Math.round(animate({ from: 150, to: 600, start: f(0.62), end: f(0.86) })(T));
          return tabla(T, f, { marca: { 0: [C.YEL, marca(T, f, 0.1, 0.28)], 1: [C.YEL, marca(T, f, 0.6, 0.72)] }, x4: clamp((T - f(0.36)) / 0.4, 0, 1), kcal: String(kc) });
        },
        r1: { text: 'PRIMERO, LA *PORCIÓN*', s: 1.0, cuando: 0.04 },
        r2: { text: '1 PAQUETE = *4 PORCIONES*', s: 0.92, cuando: 0.5 }
      }) },

    { nombre: 'Calorías y proteína', dur: 5, vo: 'Después están las calorías y las proteínas, la que te llena y la que te ayuda a construir músculo.',
      C: E3.escena({
        ocupa: [OCUPA_TABLA],
        tomas: [[0, CAM2], [1, CAM]],
        vista: function (T, f) {
          var fl = Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.5), end: f(0.7) })(T));
          var p = fl > 0.01 ? Object.assign(E3.poseFlex(fl * 0.8), {}) : leyendo();
          return { figuras: [{ quien: 'tor', pose: p, musc: fl > 0.3 ? { biceps: true, brillo: 0.3 } : null, cara: { boca: 'sonrisa' } }], objetos: fl > 0.01 ? [] : [paquete(p, 180)] };
        },
        lienzo: function (T, f) { return tabla(T, f, { marca: { 1: [C.YEL, marca(T, f, 0.06, 0.24)], 2: [C.GRN, marca(T, f, 0.4, 0.58)] } }); },
        bien: [{ x: 880, y: 1180, cuando: 0.6, s: 0.6 }],
        r1: { text: 'CALORÍAS Y *PROTEÍNA*', s: 1.0, cuando: 0.04 },
        r2: { text: 'LA PROTEÍNA *TE LLENA*', s: 1.0, cuando: 0.5, tono: 'verde' }
      }) },

    { nombre: 'Azúcares', dur: 5.2, vo: 'Ten cuidado con los azúcares añadidos. La OMS recomienda menos de 50 gramos al día.',
      C: E3.escena({
        ocupa: [OCUPA_TABLA],
        tomas: [[0, CAM], [1, CAM2]],
        vista: function (T) { var p = leyendo(); return { figuras: [{ quien: 'tor', pose: p, cara: { ojos: 'grandes', boca: 'ondulada', cejas: 'triste' } }], objetos: [paquete(p, 180)] }; },
        lienzo: function (T, f) {
          var cubos = [];
          var n = Math.floor(animate({ from: 0, to: 5, start: f(0.3), end: f(0.6) })(T));
          for (var i = 0; i < n; i++) cubos.push(<Azucar key={i} c={[600 + (i % 3) * 90, 1320 - Math.floor(i / 3) * 80 + M.life(T, 3, 4, i * 0.3)]} k={0.9} />);
          return <g>{tabla(T, f, { marca: { 3: [C.RED, marca(T, f, 0.08, 0.26)] } })}{cubos}</g>;
        },
        piezas: [{ C: P.Medidor, s: 0.6, x: 850, y: 1150, cuando: 0.5, p: function (T, f) { return { p: animate({ from: 0, to: 0.36, start: f(0.56), end: f(0.8) })(T) }; } }],
        mal: [{ x: 560, y: 1110, cuando: 0.62, s: 0.5 }],
        r1: { text: 'AZÚCARES *AÑADIDOS*', s: 1.0, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'MENOS DE *50 G* AL DÍA', s: 1.0, cuando: 0.5 }
      }) },

    { nombre: 'Sodio', dur: 4.6, vo: 'Y el sodio, menos de dos mil miligramos al día. Y aquí una porción ya trae 800.',
      C: E3.escena({
        ocupa: [OCUPA_TABLA],
        tomas: [[0, CAM2], [1, CAM]],
        vista: function (T) { var p = leyendo(); return { figuras: [{ quien: 'tor', pose: p, cara: { ojos: 'grandes', boca: 'o', cejas: 'alzadas' } }], objetos: [paquete(p, 180)] }; },
        lienzo: function (T, f) {
          var sacude = 18 * Math.sin(T * 14) * (T > f(0.3) ? 1 : 0);
          return <g>{tabla(T, f, { marca: { 4: [C.RED, marca(T, f, 0.08, 0.26)] } })}<g transform={'rotate(' + (180 + sacude).toFixed(1) + ' 700 1290)'}><Sal c={[700, 1290]} k={1.5} /></g></g>;
        },
        piezas: [{ C: P.Medidor, s: 0.6, x: 850, y: 1150, cuando: 0.4, p: function (T, f) { return { p: animate({ from: 0, to: 0.4, start: f(0.46), end: f(0.76) })(T) }; } }],
        mal: [{ x: 560, y: 1110, cuando: 0.56, s: 0.5 }],
        r1: { text: 'EL *SODIO*', s: 1.15, cuando: 0.04, tono: 'rojo' },
        r2: { text: 'MENOS DE *2000 MG* AL DÍA', s: 0.95, cuando: 0.46 }
      }) },

    { nombre: 'Ingredientes y sellos', dur: 5.4, vo: 'Los ingredientes van de mayor a menor. Del que más tiene al que menos tiene. Por ejemplo, si el azúcar va primero, simplemente déjalo a un lado. Y fíjate también en aquellos sellos negros que indican los excesos.',
      C: E3.escena({
        tomas: [[0, { az: 8, el: 4, dist: 9.6, y: 2.2, dx: 0 }], [1, { az: 18, el: 4, dist: 9.2, y: 2.2, dx: 0 }]],
        vista: function (T, f) {
          var p = leyendo({ cabeza: [-6, 0, 0] });
          return { figuras: [{ quien: 'tor', pose: p, cara: { ojos: 'grandes', boca: 'recta', cejas: T > f(0.6) ? 'enojo' : 'alzadas' } }], objetos: [paquete(p, 0)] };
        },
        lienzo: function (T, f) {
          var s1 = M.pop(T, f(0.56), 0.42), s2 = M.pop(T, f(0.64), 0.42);
          return (
            <g>
              <Ingredientes T={T} x={70} y={420} e={M.pop(T, f(0) - 0.6, 0.5)} />
              {s1.opacity > 0.02 ? <g opacity={s1.opacity} transform={'translate(250 790) scale(' + s1.scale.toFixed(3) + ') translate(-250 -790)'}><Sello c={[250, 790]} k={1.1}><Azucar c={[0, -4]} k={1.15} /></Sello></g> : null}
              {s2.opacity > 0.02 ? <g opacity={s2.opacity} transform={'translate(830 790) scale(' + s2.scale.toFixed(3) + ') translate(-830 -790)'}><Sello c={[830, 790]} k={1.1}><Sal c={[0, 4]} k={1.15} /></Sello></g> : null}
            </g>
          );
        },
        mal: [{ x: 70, y: 380, cuando: 0.3, s: 0.5 }],
        r1: { text: 'DE MAYOR A *MENOR*', s: 1.05, cuando: 0.04 },
        r2: { text: 'OJO CON LOS *SELLOS*', s: 1.05, cuando: 0.54, tono: 'rojo' }
      }) },

    { nombre: 'Cierre', dur: 4.6, vo: 'Así que la próxima vez, lee bien la etiqueta nutricional antes de echarla al carrito.',
      C: E3.escena({
        tomas: [[0, CAM], [1, { az: -8, el: 4, dist: 7.4, y: 1.2, dx: 0 }]],
        golpes: [0.3],
        vista: function (T, f) {
          var lanza = clamp((T - f(0.2)) / (f(0.42) - f(0.2)), 0, 1);
          var fl = Easing.easeOutBack(animate({ from: 0, to: 1, start: f(0.46), end: f(0.62) })(T));
          var p = fl > 0.01 ? E3.poseFlex(fl) : leyendo({ manoD: E3.lerp3([0.13, 1.32, 0.32], [0.7, 1.55, 0.2], Easing.easeOutCubic(clamp(lanza * 3, 0, 1))) });
          var obj = [];
          if (lanza <= 0) obj.push(paquete(p, 180));
          else if (lanza < 1) obj.push({ tipo: 'paquete', p: [0.6 + 2.0 * lanza, 1.6 + 0.8 * Math.sin(Math.PI * lanza), 0.2], giro: 180 + 500 * lanza, ladea: 300 * lanza });
          A.sonido('whoosh', f(0.22));
          return { figuras: [{ quien: 'tor', pose: p, musc: fl > 0.3 ? { biceps: true, brillo: 0.3 } : null, cara: { boca: 'sonrisa' } }], objetos: obj };
        },
        lienzo: function (T, f, t, pr) { return <V.Chispa T={T} c={pr('cabeza')} cuando={f(0.62)} r={180} />; },
        piezas: [
          { C: N.COMIDA.manzana, s: 0.75, x: 80, y: 420, cuando: 0.6 },
          { C: N.COMIDA.pollo, s: 0.75, x: 800, y: 420, cuando: 0.66 }
        ],
        bien: [{ x: 860, y: 680, cuando: 0.7, s: 0.8 }],
        r1: { text: 'LEE LA *ETIQUETA*', s: 1.1, cuando: null },
        r2: { text: 'ANTES DEL *CARRITO*', s: 1.05, cuando: 0.5, tono: 'verde' }
      }) }
  ];

  global.REELS.registrar({
    id: 'tabla-nutricional-3d', escenario: 'super', titulo: 'Tabla nutricional (Tor 3D)', estilo: 2, escenas: ESCENAS,
    accion: { dur: 4.2, pregunta: '¿LA LEÍAS BIEN?', vo: '¿La leías bien? Coméntalo, compártelo y guárdalo.' }
  });
})(window);
