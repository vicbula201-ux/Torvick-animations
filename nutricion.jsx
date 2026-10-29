/* ============================================================
   NUTRICION — window.N: piezas para los videos de nutricion, en el
   estilo de P (trazo INK grueso, relleno blanco o de la paleta,
   puntas redondas, viewBox fijo y prop s de escala).

   Comida (viewBox 240x240, centrada en 120,120):
     N.COMIDA = { pollo, pescado, huevo, leche, legumbres, frutosSecos, semillas,
                  carne, espinaca, tofu, cereal, aguacate, aceite, fritas, hamburguesa,
                  pan, arroz, banana, manzana, brocoli, papa }
     (las primeras siete tambien sueltas: N.Pollo N.Pescado N.Huevo ...)
   Conceptos (viewBox 240x240):
     N.ICONOS = { hueso, gota, escudo, termometro, hormona, capsula (color),
                  globulo (o2 0..4), glucosa, zapatilla, calendario, barras (p 0..1),
                  vial (color), jeringa (color), raton, adn, estetoscopio, luna,
                  balon (giro), arco, copa, mundo, balonOro, camiseta (color, cuello,
                  numero, colorNumero, rayas), bareto (encendido), pulmones (humo, color),
                  persona (color), receta, basket (giro), aro, corona, anillo, billete }
   N.Plato    plato visto de arriba (viewBox 420x420); children van encima
   N.Bola     aminoacido: una bolita de color (r, color) para armar cadenas
   N.Balanza  balanza de baño vista de frente; va debajo de los pies de Tor
              (en fondo(g) de TOR.Tor, con { y: g.piso, x: g.centro[0] })
   N.Dial     el reloj de la balanza, grande, con la aguja en p 0..1
   ============================================================ */
(function (global) {
  'use strict';

  var React = global.React;
  var P = global.P;
  var clamp = global.clamp;
  var C = P.C;
  var BLANCO = '#ffffff';
  var T0 = { stroke: C.INK, strokeWidth: 13, strokeLinecap: 'round', strokeLinejoin: 'round' };

  function Svg(props) {
    var s = props.s == null ? 1 : props.s, w = props.w || 240, h = props.h || 240;
    return (
      <svg width={w * s} height={h * s} viewBox={'0 0 ' + w + ' ' + h}
        style={Object.assign({ display: 'block', overflow: 'visible' }, props.style || {})}>
        {props.children}
      </svg>
    );
  }

  /* ---------------- comida ---------------- */

  // muslo de pollo: carne dorada + hueso con sus dos nudos
  function Pollo(props) {
    return (
      <Svg s={props.s}>
        <path d="M 138 102 L 192 48" stroke={C.INK} strokeWidth={40} strokeLinecap="round" />
        <path d="M 138 102 L 192 48" stroke={BLANCO} strokeWidth={16} strokeLinecap="round" />
        <circle cx={186} cy={36} r={17} fill={BLANCO} {...T0} />
        <circle cx={204} cy={54} r={17} fill={BLANCO} {...T0} />
        <path d="M 192 48 L 178 62" stroke={BLANCO} strokeWidth={16} strokeLinecap="round" />
        <path d="M 150 92 C 168 120 160 172 118 196 C 76 218 32 196 30 152 C 28 110 70 72 112 70 C 128 70 140 78 150 92 Z"
          fill={C.YEL} {...T0} />
        <path d="M 62 140 Q 70 116 92 104" fill="none" stroke={BLANCO} strokeWidth={11} strokeLinecap="round" />
      </Svg>
    );
  }

  // pescado mirando a la izquierda
  function Pescado(props) {
    return (
      <Svg s={props.s}>
        <path d="M 168 120 L 214 82 Q 204 120 214 158 Z" fill={C.GRY} {...T0} />
        <path d="M 82 90 Q 104 44 148 90 Z" fill={C.GRY} {...T0} strokeWidth={11} />
        <path d="M 24 120 C 56 70 128 62 176 120 C 128 178 56 170 24 120 Z" fill={BLANCO} {...T0} />
        <path d="M 96 92 Q 86 120 96 148" fill="none" {...T0} strokeWidth={11} />
        <circle cx={58} cy={112} r={8} fill={C.INK} />
        <path d="M 132 108 L 146 120 L 132 132" fill="none" stroke={C.GRY} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  // huevo frito
  function Huevo(props) {
    return (
      <Svg s={props.s}>
        <path d="M 120 28 C 160 26 196 52 200 88 C 214 116 210 160 178 184 C 150 208 108 214 76 196 C 40 180 24 140 34 108 C 40 70 76 30 120 28 Z"
          fill={BLANCO} {...T0} />
        <circle cx={124} cy={114} r={42} fill={C.YEL} {...T0} />
        <path d="M 104 100 Q 110 88 124 86" fill="none" stroke={BLANCO} strokeWidth={10} strokeLinecap="round" />
      </Svg>
    );
  }

  // caja de leche: frente blanco, costado gris, techo a dos aguas
  function Leche(props) {
    return (
      <Svg s={props.s}>
        <path d="M 150 92 L 186 72 L 186 196 L 150 214 Z" fill={C.GRY} {...T0} />
        <path d="M 150 92 L 128 54 L 164 34 L 186 72 Z" fill={C.GRY} {...T0} />
        <path d="M 66 92 L 108 54 L 150 92 L 150 214 L 66 214 Z" fill={BLANCO} {...T0} />
        <path d="M 108 54 L 128 54" fill="none" {...T0} />
        <path d="M 102 30 L 112 54" fill="none" {...T0} strokeWidth={11} />
        <rect x={80} y={128} width={56} height={44} rx={10} fill={C.YEL} {...T0} strokeWidth={11} />
      </Svg>
    );
  }

  // vaina de arvejas abierta
  function Legumbres(props) {
    return (
      <Svg s={props.s}>
        <path d="M 28 148 C 60 80 150 46 214 70 C 196 140 110 196 28 148 Z" fill={C.GRN} {...T0} />
        <path d="M 52 140 C 90 104 150 86 192 84 C 170 126 110 160 52 140 Z" fill={BLANCO} {...T0} strokeWidth={10} />
        <circle cx={86} cy={126} r={17} fill={C.GRN} {...T0} strokeWidth={10} />
        <circle cx={122} cy={114} r={18} fill={C.GRN} {...T0} strokeWidth={10} />
        <circle cx={158} cy={102} r={16} fill={C.GRN} {...T0} strokeWidth={10} />
        <path d="M 214 70 Q 226 56 220 40" fill="none" {...T0} />
      </Svg>
    );
  }

  // dos almendras
  function Almendra(props) {
    return (
      <g transform={'translate(' + props.x + ' ' + props.y + ') rotate(' + props.rot + ')'}>
        <path d="M 0 -62 C 34 -30 42 18 24 44 C 12 60 -12 60 -24 44 C -42 18 -34 -30 0 -62 Z" fill={C.GRY} {...T0} />
        <path d="M -8 -30 Q -16 0 -8 30 M 10 -20 Q 16 6 8 32" fill="none" stroke={BLANCO} strokeWidth={8} strokeLinecap="round" />
      </g>
    );
  }
  function FrutosSecos(props) {
    return (
      <Svg s={props.s}>
        <Almendra x={88} y={128} rot={-24} />
        <Almendra x={156} y={116} rot={26} />
      </Svg>
    );
  }

  // pipas de girasol: negras con rayas blancas
  function Pipa(props) {
    return (
      <g transform={'translate(' + props.x + ' ' + props.y + ') rotate(' + props.rot + ')'}>
        <path d="M 0 -40 C 22 -18 24 18 12 32 C 6 40 -6 40 -12 32 C -24 18 -22 -18 0 -40 Z" fill={C.INK} {...T0} strokeWidth={8} />
        <path d="M -7 -16 L -7 22 M 7 -16 L 7 22" stroke={BLANCO} strokeWidth={6} strokeLinecap="round" />
      </g>
    );
  }
  function Semillas(props) {
    return (
      <Svg s={props.s}>
        <Pipa x={76} y={134} rot={-30} />
        <Pipa x={122} y={108} rot={8} />
        <Pipa x={166} y={140} rot={40} />
        <Pipa x={118} y={170} rot={-80} />
      </Svg>
    );
  }

  // bistec: carne gris de la parrilla, borde de grasa y marcas de la parrilla
  function Carne(props) {
    return (
      <Svg s={props.s}>
        <path d="M 46 96 C 50 56 112 38 162 50 C 206 60 220 100 206 140 C 192 182 140 204 92 196 C 44 188 40 136 46 96 Z"
          fill={C.GRY} {...T0} />
        <path d="M 62 100 C 64 72 110 56 158 64 C 188 70 200 92 198 112" fill="none" stroke={BLANCO} strokeWidth={14} strokeLinecap="round" />
        <path d="M 76 170 L 136 92 M 108 182 L 168 104 M 146 178 L 190 122" stroke={C.INK} strokeWidth={11} strokeLinecap="round" />
      </Svg>
    );
  }

  // hoja de espinaca
  function Espinaca(props) {
    return (
      <Svg s={props.s}>
        <path d="M 60 196 C 30 140 52 62 126 36 C 186 50 214 120 176 176 C 148 214 96 222 60 196 Z" fill={C.GRN} {...T0} />
        <path d="M 60 196 Q 110 130 132 54" fill="none" stroke={BLANCO} strokeWidth={9} strokeLinecap="round" />
        <path d="M 96 146 L 70 118 M 110 116 L 92 84 M 106 156 L 150 140 M 120 120 L 160 104" stroke={BLANCO} strokeWidth={7} strokeLinecap="round" />
        <path d="M 60 196 L 36 220" stroke={C.INK} strokeWidth={13} strokeLinecap="round" />
      </Svg>
    );
  }

  // cubo de tofu
  function Tofu(props) {
    return (
      <Svg s={props.s}>
        <path d="M 52 96 L 120 62 L 196 92 L 128 128 Z" fill={BLANCO} {...T0} />
        <path d="M 128 128 L 196 92 L 196 170 L 128 206 Z" fill={C.GRY} {...T0} />
        <path d="M 52 96 L 128 128 L 128 206 L 52 172 Z" fill={BLANCO} {...T0} />
        <circle cx={84} cy={140} r={5} fill={C.GRY} /><circle cx={104} cy={166} r={5} fill={C.GRY} /><circle cx={108} cy={134} r={4} fill={C.GRY} />
      </Svg>
    );
  }

  // caja de cereal fortificado
  function Cereal(props) {
    return (
      <Svg s={props.s}>
        <path d="M 150 40 L 184 56 L 184 206 L 150 190 Z" fill={C.GRY} {...T0} />
        <rect x={62} y={40} width={88} height={150} rx={8} fill={BLANCO} {...T0} />
        <rect x={74} y={62} width={64} height={40} rx={8} fill={C.YEL} {...T0} strokeWidth={10} />
        <circle cx={92} cy={136} r={9} fill={C.YEL} stroke={C.INK} strokeWidth={7} />
        <circle cx={118} cy={150} r={9} fill={C.YEL} stroke={C.INK} strokeWidth={7} />
        <circle cx={100} cy={166} r={9} fill={C.YEL} stroke={C.INK} strokeWidth={7} />
      </Svg>
    );
  }

  // medio aguacate con su carozo
  function Aguacate(props) {
    return (
      <Svg s={props.s}>
        <path d="M 120 24 C 150 24 160 60 172 90 C 200 116 206 164 182 196 C 158 226 82 226 58 196 C 34 164 40 116 68 90 C 80 60 90 24 120 24 Z"
          fill={C.GRN} {...T0} />
        <path d="M 120 44 C 140 44 148 74 156 98 C 178 120 184 160 166 182 C 146 206 94 206 74 182 C 56 160 62 120 84 98 C 92 74 100 44 120 44 Z"
          fill={C.YEL} {...T0} strokeWidth={10} />
        <circle cx={120} cy={150} r={32} fill={C.GRY} {...T0} />
        <path d="M 106 140 Q 110 128 122 126" fill="none" stroke={BLANCO} strokeWidth={8} strokeLinecap="round" />
      </Svg>
    );
  }

  // botella de aceite de oliva con una aceituna
  function Aceite(props) {
    return (
      <Svg s={props.s}>
        <path d="M 102 30 L 138 30 L 138 70 C 166 84 172 108 172 130 L 172 200 Q 172 214 158 214 L 82 214 Q 68 214 68 200 L 68 130 C 68 108 74 84 102 70 Z"
          fill={BLANCO} {...T0} />
        <path d="M 72 132 L 168 132 L 168 200 Q 168 210 158 210 L 82 210 Q 72 210 72 200 Z" fill={C.YEL} stroke="none" />
        <path d="M 102 30 L 138 30 L 138 70 C 166 84 172 108 172 130 L 172 200 Q 172 214 158 214 L 82 214 Q 68 214 68 200 L 68 130 C 68 108 74 84 102 70 Z"
          fill="none" {...T0} />
        <rect x={96} y={18} width={48} height={22} rx={8} fill={C.GRN} {...T0} strokeWidth={10} />
        <ellipse cx={120} cy={168} rx={18} ry={24} fill={C.GRN} {...T0} strokeWidth={10} />
      </Svg>
    );
  }

  // papas fritas en su caja: grasas trans (lo que se evita)
  function Fritas(props) {
    var palitos = [[78, 52], [100, 36], [122, 46], [144, 30], [164, 50]];
    return (
      <Svg s={props.s}>
        {palitos.map(function (p, i) {
          return <rect key={i} x={p[0] - 9} y={p[1]} width={18} height={110} rx={6} fill={C.YEL} {...T0} strokeWidth={9}
            transform={'rotate(' + (i * 6 - 12) + ' ' + p[0] + ' 150)'} />;
        })}
        <path d="M 52 104 L 188 104 L 172 214 L 68 214 Z" fill={C.RED} {...T0} />
        <path d="M 84 140 Q 120 160 156 140" fill="none" stroke={BLANCO} strokeWidth={10} strokeLinecap="round" />
      </Svg>
    );
  }

  // hamburguesa: grasas saturadas (lo que se evita en exceso)
  function Hamburguesa(props) {
    return (
      <Svg s={props.s}>
        <path d="M 36 112 C 36 50 204 50 204 112 Z" fill={C.YEL} {...T0} />
        <path d="M 84 82 L 92 78 M 120 70 L 128 68 M 150 84 L 158 82" stroke={BLANCO} strokeWidth={8} strokeLinecap="round" />
        <path d="M 30 126 Q 60 112 90 126 Q 120 140 150 126 Q 180 112 210 126" fill="none" stroke={C.GRN} strokeWidth={14} strokeLinecap="round" />
        <rect x={34} y={130} width={172} height={34} rx={14} fill={C.GRY} {...T0} />
        <path d="M 40 170 L 200 170 Q 200 202 168 202 L 72 202 Q 40 202 40 170 Z" fill={C.YEL} {...T0} />
      </Svg>
    );
  }

  // rebanada de pan integral
  function Pan(props) {
    return (
      <Svg s={props.s}>
        <path d="M 52 210 L 52 110 C 22 96 30 34 92 36 L 148 36 C 210 34 218 96 188 110 L 188 210 Z" fill={C.GRY} {...T0} />
        <path d="M 70 196 L 70 102 C 50 92 54 52 96 54 L 144 54 C 186 52 190 92 170 102 L 170 196 Z" fill={BLANCO} {...T0} strokeWidth={9} />
        <path d="M 96 92 L 102 96 M 136 104 L 142 100 M 110 140 L 116 144 M 146 152 L 150 148 M 94 170 L 100 172" stroke={C.GRY} strokeWidth={9} strokeLinecap="round" />
      </Svg>
    );
  }

  // plato hondo de arroz
  function Arroz(props) {
    return (
      <Svg s={props.s}>
        <path d="M 46 116 C 54 64 186 64 194 116 Z" fill={BLANCO} {...T0} />
        <path d="M 90 92 L 98 90 M 120 80 L 128 80 M 148 94 L 156 96 M 110 104 L 118 104" stroke={C.GRY} strokeWidth={8} strokeLinecap="round" />
        <path d="M 30 116 L 210 116 C 206 170 170 200 120 200 C 70 200 34 170 30 116 Z" fill={C.YEL} {...T0} />
        <path d="M 94 214 L 146 214" stroke={C.INK} strokeWidth={13} strokeLinecap="round" />
      </Svg>
    );
  }

  function Banana(props) {
    return (
      <Svg s={props.s}>
        <path d="M 46 70 C 54 160 130 206 206 168 C 196 150 184 148 170 152 C 120 166 80 130 72 66 Z" fill={C.YEL} {...T0} />
        <path d="M 74 92 C 88 138 120 156 160 156" fill="none" stroke={BLANCO} strokeWidth={8} strokeLinecap="round" />
        <path d="M 58 68 L 54 46" stroke={C.INK} strokeWidth={16} strokeLinecap="round" />
      </Svg>
    );
  }

  function Manzana(props) {
    return (
      <Svg s={props.s}>
        <path d="M 120 82 C 96 62 46 68 46 128 C 46 178 82 214 104 214 C 112 214 116 208 120 208 C 124 208 128 214 136 214 C 158 214 194 178 194 128 C 194 68 144 62 120 82 Z"
          fill={C.GRN} {...T0} />
        <path d="M 74 126 C 74 108 82 98 96 94" fill="none" stroke={BLANCO} strokeWidth={10} strokeLinecap="round" />
        <path d="M 120 82 Q 116 58 128 40" fill="none" {...T0} />
        <path d="M 130 60 C 142 36 172 32 186 40 C 176 62 150 70 130 60 Z" fill={C.YEL} {...T0} strokeWidth={10} />
      </Svg>
    );
  }

  function Brocoli(props) {
    return (
      <Svg s={props.s}>
        <path d="M 104 120 L 96 214 L 144 214 L 136 120 Z" fill={BLANCO} {...T0} />
        <circle cx={78} cy={104} r={40} fill={C.GRN} {...T0} />
        <circle cx={162} cy={104} r={40} fill={C.GRN} {...T0} />
        <circle cx={120} cy={72} r={46} fill={C.GRN} {...T0} />
        <path d="M 104 62 Q 112 52 124 52 M 64 96 Q 70 88 80 88" fill="none" stroke={BLANCO} strokeWidth={8} strokeLinecap="round" />
      </Svg>
    );
  }

  // papa (tuberculo)
  function Papa(props) {
    return (
      <Svg s={props.s}>
        <path d="M 40 130 C 30 80 80 50 130 56 C 190 62 214 104 200 150 C 186 196 120 206 80 190 C 56 180 44 160 40 130 Z"
          fill={C.GRY} {...T0} />
        <path d="M 74 104 L 82 108 M 140 90 L 148 92 M 116 140 L 122 146 M 166 146 L 172 142" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
        <path d="M 70 132 Q 74 112 90 100" fill="none" stroke={BLANCO} strokeWidth={8} strokeLinecap="round" />
      </Svg>
    );
  }

  /* ---------------- conceptos (mismo viewBox 240) ---------------- */

  function Hueso(props) {
    var d = 'M 70 82 C 50 58 70 34 92 46 C 100 30 128 38 120 62 L 172 132 C 196 122 214 146 198 162 ' +
      'C 216 178 196 206 174 194 C 166 214 138 206 144 184 L 90 112 C 66 124 46 98 70 82 Z';
    return (
      <Svg s={props.s}>
        <path d={d} fill={BLANCO} {...T0} />
        <path d="M 100 84 L 158 158" stroke={C.GRY} strokeWidth={9} strokeLinecap="round" />
      </Svg>
    );
  }

  function Gota(props) {
    return (
      <Svg s={props.s}>
        <path d="M 120 26 C 150 76 190 112 190 152 C 190 192 158 216 120 216 C 82 216 50 192 50 152 C 50 112 90 76 120 26 Z"
          fill={BLANCO} {...T0} />
        <path d="M 84 150 C 84 128 94 112 108 100" fill="none" stroke={C.GRY} strokeWidth={10} strokeLinecap="round" />
      </Svg>
    );
  }

  function Escudo(props) {
    return (
      <Svg s={props.s}>
        <path d="M 120 24 L 196 52 C 196 130 170 186 120 216 C 70 186 44 130 44 52 Z" fill={C.GRN} {...T0} />
        <path d="M 86 122 L 112 148 L 160 92" fill="none" stroke={BLANCO} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  function Termometro(props) {
    return (
      <Svg s={props.s}>
        <path d="M 100 156 L 100 52 C 100 24 140 24 140 52 L 140 156 C 166 172 164 214 120 216 C 76 214 74 172 100 156 Z"
          fill={BLANCO} {...T0} />
        <path d="M 120 180 L 120 96" stroke={C.YEL} strokeWidth={18} strokeLinecap="round" />
        <circle cx={120} cy={184} r={20} fill={C.YEL} stroke={C.INK} strokeWidth={9} />
        <path d="M 150 70 L 164 70 M 150 98 L 164 98 M 150 126 L 164 126" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
      </Svg>
    );
  }

  // hormona: dos anillos hexagonales unidos (esquema de molecula)
  function Hormona(props) {
    var hex = function (cx, cy, r) {
      var pts = [];
      for (var i = 0; i < 6; i++) { var a = (60 * i - 30) * Math.PI / 180; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
      return pts;
    };
    var A = hex(84, 120, 46), Bx = hex(164, 120, 46);
    var path = function (pts) { return 'M ' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L ') + ' Z'; };
    return (
      <Svg s={props.s}>
        <path d={path(A)} fill={BLANCO} {...T0} />
        <path d={path(Bx)} fill={BLANCO} {...T0} />
        {A.concat(Bx).map(function (p, i) { return <circle key={i} cx={p[0]} cy={p[1]} r={11} fill={i % 3 ? C.YEL : C.GRY} stroke={C.INK} strokeWidth={7} />; })}
      </Svg>
    );
  }

  // capsula de vitamina
  function Capsula(props) {
    return (
      <Svg s={props.s}>
        <g transform="rotate(-35 120 120)">
          <path d="M 120 76 L 72 76 C 30 76 30 164 72 164 L 120 164 Z" fill={props.color || C.YEL} {...T0} />
          <path d="M 120 76 L 168 76 C 210 76 210 164 168 164 L 120 164 Z" fill={BLANCO} {...T0} />
          <path d="M 64 100 L 96 100" stroke={BLANCO} strokeWidth={9} strokeLinecap="round" />
        </g>
      </Svg>
    );
  }

  // globulo rojo de la sangre (dibujado en blanco y gris) llevando oxigeno (bolitas amarillas)
  function Globulo(props) {
    var o2 = props.o2 == null ? 3 : props.o2;
    var lugares = [[86, 84], [160, 92], [118, 168], [74, 150]];
    return (
      <Svg s={props.s}>
        <ellipse cx={120} cy={120} rx={92} ry={78} fill={BLANCO} {...T0} />
        <ellipse cx={120} cy={120} rx={46} ry={34} fill={C.GRY} stroke="none" />
        {lugares.slice(0, o2).map(function (p, i) {
          return <circle key={i} cx={p[0]} cy={p[1]} r={20} fill={C.YEL} stroke={C.INK} strokeWidth={9} />;
        })}
      </Svg>
    );
  }

  // glucosa: un hexagono amarillo
  function Glucosa(props) {
    var pts = [];
    for (var i = 0; i < 6; i++) { var a = (60 * i - 30) * Math.PI / 180; pts.push((120 + 70 * Math.cos(a)).toFixed(1) + ' ' + (120 + 70 * Math.sin(a)).toFixed(1)); }
    return (
      <Svg s={props.s}>
        <path d={'M ' + pts.join(' L ') + ' Z'} fill={C.YEL} {...T0} />
        <circle cx={120} cy={120} r={18} fill={BLANCO} stroke={C.INK} strokeWidth={9} />
      </Svg>
    );
  }

  // zapatilla de correr
  function Zapatilla(props) {
    return (
      <Svg s={props.s}>
        <path d="M 30 166 L 30 120 C 60 120 80 96 92 70 L 132 70 C 140 100 170 118 206 126 C 222 130 222 166 206 166 Z"
          fill={BLANCO} {...T0} />
        <path d="M 26 166 L 212 166 Q 216 192 196 192 L 40 192 Q 22 192 26 166 Z" fill={C.GRY} {...T0} />
        <path d="M 68 146 C 110 140 150 126 178 132" fill="none" stroke={C.YEL} strokeWidth={14} strokeLinecap="round" />
        <path d="M 100 88 L 120 96 M 104 104 L 126 112" stroke={C.INK} strokeWidth={8} strokeLinecap="round" />
      </Svg>
    );
  }

  // calendario con un dia marcado
  function Calendario(props) {
    var celdas = [];
    for (var f = 0; f < 3; f++) for (var c = 0; c < 4; c++) {
      var marcado = f === 2 && c === 3;
      celdas.push(<rect key={f + '-' + c} x={56 + c * 34} y={104 + f * 32} width={24} height={22} rx={5}
        fill={marcado ? C.YEL : C.GRY} stroke={marcado ? C.INK : 'none'} strokeWidth={7} />);
    }
    return (
      <Svg s={props.s}>
        <rect x={40} y={50} width={160} height={164} rx={18} fill={BLANCO} {...T0} />
        <path d="M 40 90 L 200 90" stroke={C.INK} strokeWidth={13} />
        <path d="M 82 34 L 82 64 M 158 34 L 158 64" stroke={C.INK} strokeWidth={14} strokeLinecap="round" />
        {celdas}
      </Svg>
    );
  }

  // barras que suben: el progreso medido
  function Barras(props) {
    var p = clamp(props.p == null ? 1 : props.p, 0, 1);
    var alturas = [50, 84, 118, 156];
    return (
      <Svg s={props.s}>
        <path d="M 34 30 L 34 206 L 214 206" fill="none" {...T0} />
        {alturas.map(function (h, i) {
          var hh = h * clamp(p * 4 - i, 0, 1);
          return hh > 2 ? <rect key={i} x={56 + i * 40} y={196 - hh} width={28} height={hh} rx={6}
            fill={i === 3 ? C.GRN : C.YEL} stroke={C.INK} strokeWidth={10} /> : null;
        })}
      </Svg>
    );
  }

  // frasco de peptido: vidrio blanco, liquido (color), tapa gris y etiqueta
  function Vial(props) {
    var liq = props.color || C.YEL;
    return (
      <Svg s={props.s}>
        <rect x={92} y={26} width={56} height={34} rx={8} fill={C.GRY} {...T0} />
        <path d="M 100 60 L 140 60 L 140 76 C 172 84 176 100 176 118 L 176 196 Q 176 214 158 214 L 82 214 Q 64 214 64 196 L 64 118 C 64 100 68 84 100 76 Z"
          fill={BLANCO} {...T0} />
        <path d="M 70 140 L 170 140 L 170 196 Q 170 208 158 208 L 82 208 Q 70 208 70 196 Z" fill={liq} stroke="none" />
        <path d="M 100 60 L 140 60 L 140 76 C 172 84 176 100 176 118 L 176 196 Q 176 214 158 214 L 82 214 Q 64 214 64 196 L 64 118 C 64 100 68 84 100 76 Z"
          fill="none" {...T0} />
        <rect x={86} y={104} width={68} height={28} rx={6} fill={BLANCO} stroke={C.INK} strokeWidth={9} />
        <path d="M 84 160 L 84 190" stroke={BLANCO} strokeWidth={9} strokeLinecap="round" />
      </Svg>
    );
  }

  function Jeringa(props) {
    return (
      <Svg s={props.s}>
        <g transform="rotate(-40 120 120)">
          <path d="M 120 18 L 120 50" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
          <rect x={98} y={50} width={44} height={110} rx={8} fill={BLANCO} {...T0} />
          <rect x={104} y={104} width={32} height={52} rx={4} fill={props.color || C.YEL} stroke="none" />
          <path d="M 104 78 L 116 78 M 104 96 L 116 96 M 104 114 L 116 114" stroke={C.INK} strokeWidth={6} strokeLinecap="round" />
          <rect x={84} y={158} width={72} height={16} rx={6} fill={C.GRY} {...T0} strokeWidth={10} />
          <path d="M 120 174 L 120 206" stroke={C.INK} strokeWidth={14} strokeLinecap="round" />
          <rect x={96} y={204} width={48} height={16} rx={6} fill={BLANCO} {...T0} strokeWidth={10} />
        </g>
      </Svg>
    );
  }

  // raton de laboratorio (los estudios en animales)
  function Raton(props) {
    return (
      <Svg s={props.s}>
        <path d="M 200 156 C 230 150 232 120 214 112" fill="none" stroke={C.INK} strokeWidth={10} strokeLinecap="round" />
        <path d="M 60 170 C 52 120 92 84 140 88 C 186 92 208 132 200 170 Z" fill={BLANCO} {...T0} />
        <path d="M 74 112 C 52 104 30 120 30 140 C 30 156 46 166 64 166" fill={BLANCO} {...T0} />
        <circle cx={92} cy={96} r={22} fill={BLANCO} {...T0} />
        <circle cx={92} cy={96} r={10} fill={C.GRY} />
        <circle cx={58} cy={134} r={6} fill={C.INK} />
        <circle cx={32} cy={146} r={7} fill={C.RED} stroke={C.INK} strokeWidth={5} />
        <path d="M 80 170 L 76 188 M 170 170 L 174 188" stroke={C.INK} strokeWidth={10} strokeLinecap="round" />
      </Svg>
    );
  }

  // doble helice de ADN
  function Adn(props) {
    var a = [], b = [], peld = [];
    for (var i = 0; i <= 20; i++) {
      var y = 24 + i * 9.6, x = 120 + 56 * Math.sin(i * 0.52);
      a.push(x.toFixed(1) + ' ' + y.toFixed(1)); b.push((240 - x).toFixed(1) + ' ' + y.toFixed(1));
      if (i % 2 === 0 && i > 0 && i < 20) peld.push(<path key={i} d={'M ' + x.toFixed(1) + ' ' + y.toFixed(1) + ' L ' + (240 - x).toFixed(1) + ' ' + y.toFixed(1)}
        stroke={i % 4 ? C.YEL : C.GRY} strokeWidth={10} strokeLinecap="round" />);
    }
    return (
      <Svg s={props.s}>
        {peld}
        <path d={'M ' + a.join(' L ')} fill="none" {...T0} />
        <path d={'M ' + b.join(' L ')} fill="none" {...T0} />
      </Svg>
    );
  }

  function Estetoscopio(props) {
    return (
      <Svg s={props.s}>
        <path d="M 64 30 L 64 92 C 64 136 116 136 116 92 L 116 30" fill="none" {...T0} />
        <path d="M 90 128 L 90 170 C 90 206 160 210 166 168 L 166 146" fill="none" {...T0} />
        <circle cx={166} cy={128} r={22} fill={C.GRY} {...T0} />
        <circle cx={166} cy={128} r={8} fill={BLANCO} stroke={C.INK} strokeWidth={6} />
        <circle cx={64} cy={28} r={8} fill={C.INK} />
        <circle cx={116} cy={28} r={8} fill={C.INK} />
      </Svg>
    );
  }

  // luna con las "z" del sueño (descanso)
  function Luna(props) {
    var z = function (x, y, s) { return 'M ' + x + ' ' + y + ' L ' + (x + s) + ' ' + y + ' L ' + x + ' ' + (y + s) + ' L ' + (x + s) + ' ' + (y + s); };
    return (
      <Svg s={props.s}>
        <path d="M 132 40 A 86 86 0 1 0 204 168 A 70 70 0 1 1 132 40 Z" fill={C.YEL} {...T0} />
        <path d={z(160, 64, 34)} fill="none" {...T0} strokeWidth={11} />
        <path d={z(198, 28, 24)} fill="none" {...T0} strokeWidth={10} />
      </Svg>
    );
  }

  /* ---------------- futbol (video de Cristiano) ---------------- */

  // pelota de futbol; giro (grados) rueda el dibujo
  function Balon(props) {
    var g = props.giro || 0;
    var pent = function (cx, cy, r, a0) {
      var pts = [];
      for (var i = 0; i < 5; i++) {
        var a = (a0 + i * 72) * Math.PI / 180;
        pts.push((cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1));
      }
      return 'M ' + pts.join(' L ') + ' Z';
    };
    var parches = [], rayos = [];
    for (var i = 0; i < 5; i++) {
      var a = (-90 + g + i * 72) * Math.PI / 180, b = (-54 + g + i * 72) * Math.PI / 180;
      rayos.push(<path key={'r' + i} d={'M ' + (120 + 32 * Math.cos(a)).toFixed(1) + ' ' + (120 + 32 * Math.sin(a)).toFixed(1) +
        ' L ' + (120 + 72 * Math.cos(a)).toFixed(1) + ' ' + (120 + 72 * Math.sin(a)).toFixed(1)} stroke={C.INK} strokeWidth={9} strokeLinecap="round" />);
      parches.push(<path key={'p' + i} d={pent(120 + 98 * Math.cos(b), 120 + 98 * Math.sin(b), 30, -54 + g + i * 72)} fill={C.INK} />);
    }
    return (
      <Svg s={props.s}>
        <defs><clipPath id="n-balon"><circle cx={120} cy={120} r={96} /></clipPath></defs>
        <circle cx={120} cy={120} r={96} fill={BLANCO} />
        <g clipPath="url(#n-balon)">{parches}</g>
        {rayos}
        <path d={pent(120, 120, 34, -90 + g)} fill={C.INK} stroke={C.INK} strokeWidth={6} strokeLinejoin="round" />
        <circle cx={120} cy={120} r={96} fill="none" {...T0} />
      </Svg>
    );
  }

  // arco de futbol de frente, con la red
  function Arco(props) {
    var red = [];
    for (var x = 40; x <= 200; x += 32) red.push(<path key={'x' + x} d={'M ' + x + ' 72 L ' + x + ' 186'} stroke={C.GRY} strokeWidth={6} />);
    for (var y = 98; y <= 186; y += 30) red.push(<path key={'y' + y} d={'M 22 ' + y + ' L 218 ' + y} stroke={C.GRY} strokeWidth={6} />);
    return (
      <Svg s={props.s}>
        {red}
        <path d="M 14 196 L 14 62 L 226 62 L 226 196" fill="none" {...T0} strokeWidth={15} />
        <path d="M 2 198 L 238 198" stroke={C.GRY} strokeWidth={10} strokeLinecap="round" />
      </Svg>
    );
  }

  // copa (trofeo)
  function Copa(props) {
    return (
      <Svg s={props.s}>
        <path d="M 62 52 C 22 52 26 116 78 116 M 178 52 C 218 52 214 116 162 116" fill="none" {...T0} />
        <path d="M 60 34 L 180 34 L 176 80 C 172 128 146 146 120 146 C 94 146 68 128 64 80 Z" fill={C.YEL} {...T0} />
        <path d="M 108 146 L 104 178 L 136 178 L 132 146" fill={C.YEL} {...T0} />
        <rect x={74} y={178} width={92} height={30} rx={8} fill={C.GRY} {...T0} />
        <path d="M 92 60 C 92 92 100 112 112 122" fill="none" stroke={BLANCO} strokeWidth={10} strokeLinecap="round" />
      </Svg>
    );
  }

  // planeta: la marca en todo el mundo
  function Mundo(props) {
    return (
      <Svg s={props.s}>
        <circle cx={120} cy={120} r={96} fill={BLANCO} />
        <path d="M 44 92 C 60 60 96 50 112 62 C 128 74 104 86 112 100 C 120 114 100 128 86 122 C 74 154 92 168 78 186 C 58 172 46 150 50 128 C 36 120 36 104 44 92 Z" fill={C.GRN} stroke={C.INK} strokeWidth={9} strokeLinejoin="round" />
        <path d="M 142 44 C 168 46 196 70 204 100 C 194 108 178 98 170 114 C 186 130 176 160 156 168 C 142 150 150 128 138 118 C 124 104 134 88 150 84 C 140 72 130 58 142 44 Z" fill={C.GRN} stroke={C.INK} strokeWidth={9} strokeLinejoin="round" />
        <ellipse cx={120} cy={120} rx={44} ry={96} fill="none" stroke={C.GRY} strokeWidth={7} />
        <path d="M 30 92 L 210 92 M 30 148 L 210 148" stroke={C.GRY} strokeWidth={7} />
        <circle cx={120} cy={120} r={96} fill="none" {...T0} />
      </Svg>
    );
  }

  // balon de oro: la pelota dorada sobre su pie
  function BalonOro(props) {
    return (
      <Svg s={props.s}>
        <path d="M 96 168 L 144 168 L 150 184 L 90 184 Z" fill={C.YEL} {...T0} strokeWidth={11} />
        <path d="M 70 190 L 170 190 L 182 226 L 58 226 Z" fill={C.GRY} {...T0} />
        <circle cx={120} cy={96} r={74} fill={C.YEL} {...T0} />
        <path d="M 120 64 L 150 86 L 139 120 L 101 120 L 90 86 Z" fill="none" stroke={C.INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M 120 64 L 120 26 M 150 86 L 188 74 M 139 120 L 160 154 M 101 120 L 80 154 M 90 86 L 52 74" stroke={C.INK} strokeWidth={8} strokeLinecap="round" />
        <path d="M 74 70 Q 84 46 108 38" fill="none" stroke={BLANCO} strokeWidth={10} strokeLinecap="round" />
      </Svg>
    );
  }

  // camiseta de futbol vista de frente, con su numero
  var CAMISETA = 'M 80 26 L 40 44 L 12 98 L 50 118 L 66 94 L 66 216 L 174 216 L 174 94 L 190 118 L 228 98 L 200 44 L 160 26 Q 120 58 80 26 Z';
  function Camiseta(props) {
    var color = props.color || BLANCO;
    return (
      <Svg s={props.s}>
        <path d={CAMISETA} fill={color} />
        {props.rayas ? (
          <g>
            <defs><clipPath id="n-camiseta"><path d={CAMISETA} /></clipPath></defs>
            <g clipPath="url(#n-camiseta)">
              {[44, 92, 140, 188].map(function (x) { return <rect key={x} x={x} y={20} width={24} height={200} fill={props.rayas} />; })}
            </g>
          </g>
        ) : null}
        <path d={CAMISETA} fill="none" {...T0} />
        <path d="M 80 26 Q 120 58 160 26" fill="none" stroke={C.INK} strokeWidth={24} strokeLinecap="round" />
        <path d="M 80 26 Q 120 58 160 26" fill="none" stroke={props.cuello || BLANCO} strokeWidth={10} strokeLinecap="round" />
        <path d="M 22 92 L 48 106 M 218 92 L 192 106" stroke={props.cuello || BLANCO} strokeWidth={9} strokeLinecap="round" />
        {props.numero != null ? (
          <text x={120} y={176} textAnchor="middle" fontFamily="'Archivo Black', sans-serif" fontSize={86}
            fill={props.colorNumero || BLANCO} stroke={C.INK} strokeWidth={7} strokeLinejoin="round" paintOrder="stroke">{props.numero}</text>
        ) : null}
      </Svg>
    );
  }

  // bareto: el cono de papel, el filtro y la brasa (encendido 0..1)
  function Bareto(props) {
    var e = props.encendido == null ? 1 : props.encendido;
    return (
      <Svg s={props.s}>
        <path d="M 30 128 L 186 104 Q 204 108 204 130 Q 204 152 186 156 L 30 140 Z" fill={BLANCO} {...T0} strokeWidth={10} />
        <path d="M 30 128 L 66 123 L 66 145 L 30 140 Z" fill={C.GRY} stroke={C.INK} strokeWidth={9} strokeLinejoin="round" />
        <path d="M 96 126 L 150 120 M 100 140 L 140 142" stroke={C.GRY} strokeWidth={6} strokeLinecap="round" />
        {e > 0 ? (
          <g opacity={e}>
            <ellipse cx={200} cy={130} rx={13} ry={24} fill={C.RED} stroke={C.INK} strokeWidth={8} />
            <ellipse cx={203} cy={130} rx={6} ry={12} fill={C.YEL} />
          </g>
        ) : null}
      </Svg>
    );
  }

  // pulmones: humo 0..1 los llena de manchas grises; color tine los lobulos (irritacion)
  function Pulmones(props) {
    var h = props.humo || 0, fill = props.color || BLANCO;
    var izq = 'M 104 72 C 70 62 30 104 28 160 C 26 208 62 224 96 212 C 112 206 112 182 112 160 L 112 96 C 112 82 110 74 104 72 Z';
    var der = 'M 136 72 C 170 62 210 104 212 160 C 214 208 178 224 144 212 C 128 206 128 182 128 160 L 128 96 C 128 82 130 74 136 72 Z';
    var manchas = [[70, 130, 16], [60, 176, 13], [92, 186, 11], [168, 128, 15], [182, 172, 13], [150, 190, 10], [86, 150, 9], [160, 154, 9]];
    return (
      <Svg s={props.s}>
        <path d={izq} fill={fill} {...T0} />
        <path d={der} fill={fill} {...T0} />
        {h > 0 ? manchas.map(function (m, i) {
          return <circle key={i} cx={m[0]} cy={m[1]} r={m[2] * (0.6 + 0.4 * h)} fill={C.GRY} opacity={Math.min(1, h * 1.4)} />;
        }) : null}
        <path d="M 120 14 L 120 98 M 120 98 L 98 124 M 120 98 L 142 124" fill="none" {...T0} strokeWidth={14} />
      </Svg>
    );
  }

  // una persona (para contar "3 de cada 10")
  function Persona(props) {
    var color = props.color || BLANCO;
    return (
      <Svg s={props.s}>
        <circle cx={120} cy={64} r={38} fill={color} {...T0} />
        <path d="M 58 218 Q 58 118 120 114 Q 182 118 182 218 Z" fill={color} {...T0} />
      </Svg>
    );
  }

  // receta medica: la hoja con la cruz verde
  function Receta(props) {
    return (
      <Svg s={props.s}>
        <rect x={50} y={20} width={140} height={200} rx={14} fill={BLANCO} {...T0} />
        <path d="M 108 48 L 132 48 L 132 66 L 150 66 L 150 90 L 132 90 L 132 108 L 108 108 L 108 90 L 90 90 L 90 66 L 108 66 Z"
          fill={C.GRN} stroke={C.INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M 76 136 L 164 136 M 76 162 L 164 162 M 76 188 L 136 188" stroke={C.GRY} strokeWidth={10} strokeLinecap="round" />
      </Svg>
    );
  }

  // pelota de basquet (amarilla, con sus costuras); giro rota las costuras
  function Basket(props) {
    return (
      <Svg s={props.s}>
        <circle cx={120} cy={120} r={94} fill={C.YEL} {...T0} />
        <g transform={'rotate(' + (props.giro || 0) + ' 120 120)'}>
          <path d="M 120 26 L 120 214 M 26 120 L 214 120" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
          <path d="M 54 54 Q 96 120 54 186 M 186 54 Q 144 120 186 186" fill="none" stroke={C.INK} strokeWidth={9} strokeLinecap="round" />
        </g>
        <circle cx={120} cy={120} r={94} fill="none" {...T0} />
      </Svg>
    );
  }

  // aro de basquet: tablero, aro y red
  function Aro(props) {
    return (
      <Svg s={props.s}>
        <rect x={36} y={14} width={168} height={110} rx={8} fill={BLANCO} {...T0} />
        <rect x={92} y={60} width={56} height={44} fill="none" stroke={C.INK} strokeWidth={9} />
        <path d="M 78 140 L 92 214 L 106 150 L 120 214 L 134 150 L 148 214 L 162 140" fill="none" stroke={C.GRY} strokeWidth={7} strokeLinejoin="round" />
        <path d="M 92 214 L 148 214" stroke={C.GRY} strokeWidth={7} strokeLinecap="round" />
        <ellipse cx={120} cy={138} rx={50} ry={11} fill="none" stroke={C.INK} strokeWidth={22} />
        <ellipse cx={120} cy={138} rx={50} ry={11} fill="none" stroke={C.RED} strokeWidth={10} />
      </Svg>
    );
  }

  // corona (el "Rey")
  function Corona(props) {
    return (
      <Svg s={props.s}>
        <path d="M 30 176 L 36 70 L 84 120 L 120 44 L 156 120 L 204 70 L 210 176 Z" fill={C.YEL} {...T0} />
        <rect x={28} y={172} width={184} height={36} rx={10} fill={C.YEL} {...T0} />
        <circle cx={36} cy={66} r={13} fill={C.RED} {...T0} strokeWidth={9} />
        <circle cx={120} cy={40} r={14} fill={C.GRN} {...T0} strokeWidth={9} />
        <circle cx={204} cy={66} r={13} fill={C.RED} {...T0} strokeWidth={9} />
        <circle cx={120} cy={190} r={9} fill={C.RED} stroke={C.INK} strokeWidth={6} />
      </Svg>
    );
  }

  // anillo de campeon
  function Anillo(props) {
    return (
      <Svg s={props.s}>
        <circle cx={120} cy={150} r={62} fill="none" stroke={C.INK} strokeWidth={38} />
        <circle cx={120} cy={150} r={62} fill="none" stroke={C.YEL} strokeWidth={20} />
        <path d="M 66 46 L 174 46 L 186 86 L 162 122 L 78 122 L 54 86 Z" fill={C.YEL} {...T0} />
        <path d="M 120 58 L 130 80 L 154 82 L 136 98 L 142 120 L 120 108 L 98 120 L 104 98 L 86 82 L 110 80 Z"
          fill={BLANCO} stroke={C.INK} strokeWidth={7} strokeLinejoin="round" />
      </Svg>
    );
  }

  // billetes (dinero)
  function Billete(props) {
    var uno = function (dx, dy) {
      return (
        <g transform={'translate(' + dx + ' ' + dy + ')'}>
          <rect x={14} y={70} width={196} height={104} rx={12} fill={C.GRN} {...T0} />
          <rect x={30} y={86} width={164} height={72} rx={8} fill="none" stroke={BLANCO} strokeWidth={6} />
          <circle cx={112} cy={122} r={24} fill={BLANCO} stroke={C.INK} strokeWidth={8} />
        </g>
      );
    };
    return <Svg s={props.s}>{uno(16, -26)}{uno(0, 0)}{uno(16, 30)}</Svg>;
  }

  var COMIDA = {
    pollo: Pollo, pescado: Pescado, huevo: Huevo, leche: Leche,
    legumbres: Legumbres, frutosSecos: FrutosSecos, semillas: Semillas,
    carne: Carne, espinaca: Espinaca, tofu: Tofu, cereal: Cereal, aguacate: Aguacate, aceite: Aceite,
    fritas: Fritas, hamburguesa: Hamburguesa, pan: Pan, arroz: Arroz, banana: Banana, manzana: Manzana,
    brocoli: Brocoli, papa: Papa
  };
  var ICONOS = {
    hueso: Hueso, gota: Gota, escudo: Escudo, termometro: Termometro, hormona: Hormona, capsula: Capsula,
    globulo: Globulo, glucosa: Glucosa, zapatilla: Zapatilla, calendario: Calendario, barras: Barras,
    vial: Vial, jeringa: Jeringa, raton: Raton, adn: Adn, estetoscopio: Estetoscopio, luna: Luna,
    balon: Balon, arco: Arco, copa: Copa, mundo: Mundo,
    balonOro: BalonOro, camiseta: Camiseta, bareto: Bareto, pulmones: Pulmones, persona: Persona,
    receta: Receta, basket: Basket, aro: Aro, corona: Corona, anillo: Anillo, billete: Billete
  };

  /* ---------------- plato, aminoacidos, balanza ---------------- */

  function Plato(props) {
    return (
      <Svg s={props.s} w={420} h={420}>
        <circle cx={210} cy={210} r={196} fill={BLANCO} {...T0} strokeWidth={15} />
        <circle cx={210} cy={210} r={142} fill="none" stroke={C.GRY} strokeWidth={12} />
      </Svg>
    );
  }

  function Bola(props) {
    var r = props.r || 34;
    return (
      <Svg s={props.s} w={2 * r + 20} h={2 * r + 20}>
        <circle cx={r + 10} cy={r + 10} r={r} fill={props.color || C.YEL} {...T0} />
        <path d={'M ' + (r + 10 - r * 0.5) + ' ' + (r + 10 - r * 0.1) + ' Q ' + (r + 10 - r * 0.45) + ' ' + (r + 10 - r * 0.5) + ' ' + (r + 10 - r * 0.05) + ' ' + (r + 10 - r * 0.55)}
          fill="none" stroke={BLANCO} strokeWidth={8} strokeLinecap="round" />
      </Svg>
    );
  }

  // balanza de baño de frente: tapa (y .. y+26) y frente (hasta y+70), ancha 560
  function Balanza(props) {
    var x = props.x == null ? 600 : props.x, y = props.y;
    return (
      <g>
        <rect x={x - 280} y={y + 18} width={560} height={58} rx={24} fill={BLANCO} {...T0} strokeWidth={15} />
        <rect x={x - 296} y={y - 6} width={592} height={30} rx={14} fill={C.GRY} {...T0} strokeWidth={15} />
        <rect x={x - 54} y={y + 32} width={108} height={30} rx={10} fill={C.YEL} {...T0} strokeWidth={11} />
      </g>
    );
  }

  // dial de la balanza: semicirculo con marcas, la aguja barre de -70 a +70 grados
  function Dial(props) {
    var p = clamp(props.p == null ? 0 : props.p, 0, 1);
    var a = (-70 + 140 * p) * Math.PI / 180;
    var marcas = [];
    for (var i = 0; i <= 8; i++) {
      var b = (-70 + 140 * i / 8) * Math.PI / 180, l = i % 2 ? 18 : 30;
      marcas.push(<path key={i} d={'M ' + (150 + 112 * Math.sin(b)) + ' ' + (170 - 112 * Math.cos(b)) + ' L ' +
        (150 + (112 - l) * Math.sin(b)) + ' ' + (170 - (112 - l) * Math.cos(b))} stroke={C.INK} strokeWidth={9} strokeLinecap="round" />);
    }
    return (
      <Svg s={props.s} w={300} h={220}>
        <rect x={12} y={12} width={276} height={196} rx={40} fill={BLANCO} {...T0} strokeWidth={15} />
        <path d="M 38 170 A 112 112 0 0 1 262 170" fill="none" stroke={C.GRY} strokeWidth={12} />
        {props.zona ? (
          <path d={'M ' + (150 + 112 * Math.sin(props.zona[0])) + ' ' + (170 - 112 * Math.cos(props.zona[0])) +
            ' A 112 112 0 0 1 ' + (150 + 112 * Math.sin(props.zona[1])) + ' ' + (170 - 112 * Math.cos(props.zona[1]))}
            fill="none" stroke={C.GRN} strokeWidth={22} strokeLinecap="round" />
        ) : null}
        {marcas}
        <path d={'M 150 170 L ' + (150 + 96 * Math.sin(a)) + ' ' + (170 - 96 * Math.cos(a))} stroke={C.INK} strokeWidth={12} strokeLinecap="round" />
        <circle cx={150} cy={170} r={16} fill={C.INK} />
      </Svg>
    );
  }

  global.N = {
    Pollo: Pollo, Pescado: Pescado, Huevo: Huevo, Leche: Leche, Legumbres: Legumbres,
    FrutosSecos: FrutosSecos, Semillas: Semillas, COMIDA: COMIDA, ICONOS: ICONOS,
    Plato: Plato, Bola: Bola, Balanza: Balanza, Dial: Dial
  };
})(window);
