/* ============================================================
   lote.js — varios reels con voz de una vez

       node herramientas/lote.js <carpeta-de-voces> [carpeta-salida] [--con-musica] [--nivel-efectos -6]

   En la carpeta de voces va una grabacion por reel, con el id del reel como nombre:
   plancha.m4a, hip-thrust.mp3, peptidos.wav... (mayusculas, tildes y espacios no
   importan: "Hip Thrust.m4a" sirve para hip-thrust). Por cada una corre
   herramientas/grabar.js <id> --voz <grabacion> y al final dice cuales salieron, cuales
   tienen avisos para revisar y cuales fallaron. Los videos quedan en la carpeta de
   salida (por defecto ./videos) como <id>-con-voz.mp4.
   ============================================================ */
'use strict';

const path = require('path');
const fs = require('fs');
const { spawnSync } = require('child_process');

const EXT = ['.m4a', '.mp3', '.wav', '.aac', '.ogg', '.opus', '.flac', '.mp4', '.mov', '.3gp', '.webm', '.caf'];

function normalizar(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function idsDeReels(raiz) {
  const ids = [];
  for (const f of fs.readdirSync(raiz)) {
    if (!f.endsWith('.jsx')) continue;
    const src = fs.readFileSync(path.join(raiz, f), 'utf8');
    const re = /REELS\.registrar\(\{\s*id:\s*'([^']+)'/g;
    let m;
    while ((m = re.exec(src))) ids.push(m[1]);
  }
  return ids.sort();
}

function parecidos(id, ids) {
  const tiene = ids.filter(x => x.indexOf(id) >= 0 || id.indexOf(x) >= 0);
  return tiene.length ? tiene : ids.filter(x => x[0] === id[0]);
}

const args = process.argv.slice(2);
const pos = [];
const pasar = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--con-musica') pasar.push(args[i]);
  else if (args[i] === '--nivel-efectos') pasar.push(args[i], args[++i]);
  else pos.push(args[i]);
}
const [dirVoces, dirSalida = 'videos'] = pos;
if (!dirVoces || !fs.existsSync(dirVoces)) {
  console.error('uso: node herramientas/lote.js <carpeta-de-voces> [carpeta-salida]');
  process.exit(1);
}
const raiz = path.resolve(__dirname, '..');
const ids = idsDeReels(raiz);
const salida = path.resolve(dirSalida);

const trabajos = [];
const sinReel = [];
for (const f of fs.readdirSync(dirVoces).sort()) {
  const ext = path.extname(f).toLowerCase();
  if (EXT.indexOf(ext) < 0) continue;
  const id = normalizar(path.basename(f, path.extname(f)));
  if (ids.indexOf(id) >= 0) trabajos.push({ id, voz: path.join(dirVoces, f) });
  else sinReel.push({ f, id });
}
if (!trabajos.length) {
  console.error('No encontre grabaciones con el nombre de un reel en ' + dirVoces + '.');
  if (sinReel.length) console.error('Archivos sin reel: ' + sinReel.map(s => s.f).join(', '));
  console.error('Los ids que hay:\n  ' + ids.join('\n  '));
  process.exit(1);
}

const t0 = Date.now();
const res = [];
for (const [i, t] of trabajos.entries()) {
  console.log('\n=== ' + (i + 1) + '/' + trabajos.length + ' · ' + t.id + ' · ' + path.basename(t.voz) + ' ===');
  const a = Date.now();
  const r = spawnSync('node', [path.join(__dirname, 'grabar.js'), t.id, salida, '--voz', t.voz].concat(pasar),
    { stdio: 'inherit' });
  const informe = path.join(salida, t.id + '-voz.txt');
  const avisos = r.status === 0 && fs.existsSync(informe)
    ? fs.readFileSync(informe, 'utf8').split('\n').filter(l => l.startsWith('- ')).length : 0;
  res.push({ id: t.id, ok: r.status === 0, avisos, min: (Date.now() - a) / 60000 });
}

console.log('\n=== RESUMEN · ' + ((Date.now() - t0) / 60000).toFixed(1) + ' min ===');
for (const r of res) {
  console.log((r.ok ? (r.avisos ? 'REVISAR ' : 'LISTO   ') : 'FALLO   ') + r.id +
    (r.ok ? '  ->  ' + path.join(salida, r.id + '-con-voz.mp4') : '') +
    (r.avisos ? '  (' + r.avisos + ' aviso' + (r.avisos > 1 ? 's' : '') + ' en ' + r.id + '-voz.txt)' : '') +
    '  · ' + r.min.toFixed(1) + ' min');
}
for (const s of sinReel) {
  console.log('SIN REEL ' + s.f + '  (no hay un reel "' + s.id + '"; ¿quisiste decir ' +
    (parecidos(s.id, ids).slice(0, 3).join(', ') || 'otro nombre') + '?)');
}
process.exit(res.every(r => r.ok) ? 0 : 1);
