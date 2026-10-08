/* ============================================================
   compilar.js — regenera primitivas.js y app.js desde los .jsx

   Solo hace falta correrlo si editaste algun .jsx:

       node compilar.js                  (todos)
       node compilar.js dominadas.jsx    (solo ese)

   Existe por una sola razon: los .jsx cargados con type="text/babel"
   se piden por XHR, y el navegador bloquea esa peticion cuando la
   pagina se abrio con doble clic (file://). Los .js generados se
   cargan como scripts normales y funcionan en los dos casos.
   Los .jsx siguen siendo la fuente: no edites los .js a mano.
   ============================================================ */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const URL_BABEL = 'https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.4/babel.min.js';
// orden de carga: motor -> primitivas -> cuerpo -> piezas extra -> marca -> reel -> videos
const FUENTES = [
  'primitivas.jsx', 'app.jsx',
  'cuerpo.jsx', 'perfil.jsx', 'frente.jsx', 'equipo.jsx',
  'marca.jsx', 'reel.jsx',
  'face-pull.jsx', 'sentadilla-sumo.jsx', 'elevacion-piernas.jsx', 'press-banca.jsx', 'dominadas.jsx'
];

async function traerBabel() {
  const cache = path.join(os.tmpdir(), 'babel-standalone-7.26.4.js');
  if (!fs.existsSync(cache)) {
    process.stdout.write('bajando Babel standalone… ');
    const r = await fetch(URL_BABEL);
    if (!r.ok) throw new Error('no se pudo bajar Babel: HTTP ' + r.status);
    fs.writeFileSync(cache, Buffer.from(await r.arrayBuffer()));
    console.log('listo');
  }
  return require(cache);
}

(async () => {
  const Babel = await traerBabel();
  const pedidos = process.argv.slice(2);
  const lista = pedidos.length ? pedidos : FUENTES.filter((f) => fs.existsSync(f));
  for (const fuente of lista) {
    const destino = fuente.replace(/\.jsx$/, '.js');
    const src = fs.readFileSync(fuente, 'utf8');
    const { code } = Babel.transform(src, { presets: ['react'], filename: fuente });
    fs.writeFileSync(destino,
      '/* GENERADO por compilar.js desde ' + fuente + ' — no editar a mano. */\n' + code + '\n');
    console.log(fuente + ' -> ' + destino + '  (' + code.length + ' chars)');
  }
})().catch((e) => { console.error('falló:', e.message); process.exit(1); });
