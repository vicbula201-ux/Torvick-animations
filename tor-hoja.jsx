/* ============================================================
   HOJA DE MODELO DE TOR (tor-hoja.html): las tres vistas clave del
   personaje en 1920x1080, para comparar acabados y como referencia para
   animar: de frente (neutro), 3/4 en press inclinado y de perfil sacando
   biceps. Se dibuja con el mismo Tor 3D de los reels (TOR3D).
     tor-hoja.html?acabado=plano|cel|arcilla&short=gris|caqui
   El acabado se elige antes de cargar tor3d.js (window.TOR3D_ACABADO).
   Exportar: node herramientas/tor-hoja.js  (deja los PNG en identidad/)
   ============================================================ */
(function (global) {
  'use strict';
  var React = global.React, E3 = global.E3, TOR3D = global.TOR3D, V = global.V;
  var params = new URLSearchParams(location.search);
  var ACABADO = global.TOR3D_ACABADO || 'plano';
  var SHORT = params.get('short') || 'gris';
  var NOMBRES = { plano: 'Plano (el de los reels)', cel: 'Cel: dibujo 2D pro', arcilla: 'Arcilla: 3D de estudio' };
  var ESC = 0.4;                         // cada lienzo 1080x1920 achicado a 432x768
  var ZONA = [190, 70, 890, 1860];       // donde entra el cuerpo (con aire a los lados para la sombra del piso)

  function lado(p, s, mano, codo) { var L = s < 0 ? 'I' : 'D'; p['mano' + L] = mano; p['codo' + L] = codo; }
  function poseNeutra() {
    var p = E3.poseFlex(0, { cabeza: [2, 0, 0] });
    lado(p, -1, [-0.36, 0.86, 0.04], [0.4, 0.1, -1]); lado(p, 1, [0.36, 0.86, 0.04], [0.4, 0.1, -1]);
    return p;
  }
  // el press inclinado con las mancuernas arriba (como en pecho-top3-3d)
  function posePress() {
    var p = { cadera: [0, 0.64, 0.09], tronco: [-60, 0, 0], pieI: [-0.32, 0.115, 0.78], pieD: [0.32, 0.115, 0.78], cabeza: [-4, 0, 0] };
    [-1, 1].forEach(function (s) { lado(p, s, [s * 0.27, 1.62, -0.14], [0.7, 0, -1]); });
    return p;
  }
  // de perfil: el brazo cercano saca biceps adelante, el otro abajo
  function poseBiceps() {
    var p = E3.poseFlex(0, { cabeza: [4, 10, 0] });
    lado(p, 1, [0.36, 1.9, 0.5], [0.2, -1, 0.15]);
    lado(p, -1, [-0.36, 0.86, 0.06], [0.4, 0.1, -1]);
    return p;
  }
  var ropa = { short: SHORT };
  var PANELES = [
    { titulo: 'Frente', sub: 'Neutro, de pie', camara: { az: 0, el: 3, dist: 5.4, y: 1.05 },
      figura: { quien: 'tor', pose: poseNeutra(), cara: { boca: 'sonrisa' }, ropa: ropa } },
    { titulo: '3/4', sub: 'Press inclinado con mancuernas', camara: { az: 42, el: 12, dist: 5.6, y: 1.0 },
      figura: { quien: 'tor', pose: posePress(), pesas: 'prono', musc: { pecho: true, deltoides: 'claro' }, cara: { boca: 'dientes', cejas: 'enojo' }, ropa: ropa },
      objetos: [{ tipo: 'banco', p: [0, 0, 0.2], largo: 0.45, alto: 0.45, respaldo: { ang: 30, largo: 1.15 } }],
      brillo: ['m:pecho:0', 'm:pecho:1'], zona: [40, 380, 1040, 1660] },
    { titulo: 'Perfil', sub: 'Sacando bíceps', camara: { az: 84, el: 4, dist: 5.4, y: 1.1 },
      figura: { quien: 'tor', pose: poseBiceps(), musc: { biceps: true }, cara: { boca: 'sonrisa' }, ropa: ropa },
      brillo: ['m:biceps:1'] }
  ];
  PANELES.forEach(function (pn) {
    var vt = { figuras: [pn.figura], objetos: pn.objetos || [], camara: pn.camara };
    vt.camara = TOR3D.encuadrar(vt, pn.zona || ZONA, pn.camara);
    pn.vista = vt;
  });

  function Panel(props) {
    var pn = props.pn, vt = pn.vista;
    var pr = function (q) { return TOR3D.proyectar(vt, q); };
    return (
      <figure className="panel">
        <div className="lienzo" style={{ width: 1080 * ESC, height: 1920 * ESC }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: 'scale(' + ESC + ')', transformOrigin: '0 0' }}>
            <TOR3D.Lienzo vista={vt} />
            <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}>
              {pn.brillo ? E3.brilla(1.35, pr, pn.brillo, 1, true, 95) : null}
            </svg>
          </div>
        </div>
        <figcaption><b>{pn.titulo}</b><span>{pn.sub}</span></figcaption>
      </figure>
    );
  }
  var MUESTRAS = [['#14110F', 'Trazo'], ['#FFFFFF', 'Cuerpo'], ['#FFD400', 'Músculo que trabaja'], [SHORT === 'caqui' ? '#BCAD86' : '#C9C3B8', 'Short ' + SHORT], ['#E03A2F', 'Error']];
  function Hoja() {
    return (
      <div className="hoja">
        <header>
          <div><h1>TOR</h1><p>Hoja de modelo · Entrena con Tor</p></div>
          <div className="acabado"><span>Acabado</span><b>{NOMBRES[ACABADO] || ACABADO}</b></div>
        </header>
        <div className="paneles">{PANELES.map(function (pn, i) { return <Panel key={i} pn={pn} />; })}</div>
        <footer>
          {MUESTRAS.map(function (m, i) { return <span key={i} className="muestra"><i style={{ background: m[0] }} />{m[1]}</span>; })}
          <span className="nota">Cabeza calva de huevo, ojos de punto, sonrisa chica · contorno negro grueso · el músculo que trabaja en amarillo, con su brillo</span>
        </footer>
      </div>
    );
  }
  ReactDOM.createRoot(document.getElementById('raiz')).render(<Hoja />);
  setTimeout(function () { global.HOJA_LISTA = true; }, 600);
})(window);
