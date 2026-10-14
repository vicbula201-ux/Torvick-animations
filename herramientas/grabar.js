/* ============================================================
   grabar.js — exporta un reel de reels.html a MP4 listo para subir

       node herramientas/grabar.js <id> [carpeta-salida]

   Deja en la carpeta (por defecto ./videos):
     <id>.mp4              video + musica + efectos (sin voz: la voz la grabas vos)
     <id>-sin-musica.mp4   video + efectos, para poner otra musica
     <id>-guion.txt        las lineas de la voz con su segundo de inicio
     <id>-cues.json        los momentos de cada efecto (X, visto, cambios de escena)

   Necesita: Node, Playwright (npm i -g playwright && npx playwright install chromium),
   ffmpeg y python3 con numpy. No es parte de la app: es una herramienta de escritorio.
   Si el CDN de React no esta disponible, TORVICK_VENDOR=<carpeta> con
   react.production.min.js y react-dom.production.min.js los sirve en local.
   ============================================================ */
'use strict';

const path = require('path');
const fs = require('fs');
const { spawn, execFileSync } = require('child_process');

function cargarPlaywright() {
  const rutas = ['playwright', '/opt/node22/lib/node_modules/playwright'];
  for (const r of rutas) { try { return require(r); } catch (e) { /* sigue */ } }
  throw new Error('No encuentro Playwright: npm i -g playwright');
}

function fmtT(s) {
  const m = Math.floor(s / 60), r = s - 60 * m;
  return String(m).padStart(2, '0') + ':' + r.toFixed(1).padStart(4, '0');
}

(async () => {
  const [id, dirSalida = 'videos'] = process.argv.slice(2);
  if (!id) { console.error('uso: node herramientas/grabar.js <id> [carpeta]'); process.exit(1); }
  const raiz = path.resolve(__dirname, '..');
  const salida = path.resolve(dirSalida);
  fs.mkdirSync(salida, { recursive: true });
  const fps = 30;

  const { chromium } = cargarPlaywright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  p.on('pageerror', e => console.log('error en la pagina:', e.message));
  const vendor = process.env.TORVICK_VENDOR;
  if (vendor) {
    await p.route('**/*', r => {
      const u = r.request().url();
      for (const f of ['react.production.min.js', 'react-dom.production.min.js']) {
        if (u.endsWith(f)) return r.fulfill({ body: fs.readFileSync(path.join(vendor, f)), contentType: 'application/javascript' });
      }
      return r.continue();
    });
  }
  await p.goto('file://' + path.join(raiz, 'reels.html') + '#' + id + '/render');
  await p.waitForFunction(() => window.REEL && document.fonts && document.fonts.status === 'loaded', null, { timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.REEL.setPlaying(false));
  await p.waitForTimeout(300);
  const total = await p.evaluate(() => window.REEL.total);
  const n = Math.round(total * fps);

  const mudo = path.join(salida, id + '.mudo.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
    '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium', mudo],
  { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) {
    await p.evaluate((t) => window.REEL.seek(t), i / fps);
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    const buf = await p.screenshot({ clip: { x: 0, y: 0, width: 1080, height: 1920 }, type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(id, 'cuadro', i, '/', n);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));

  // los efectos se marcan mientras se dibuja cada escena: se leen al final
  const cues = await p.evaluate(() => window.REEL.cues());
  const guion = await p.evaluate(() => window.REEL.guion);
  await b.close();

  const fCues = path.join(salida, id + '-cues.json');
  fs.writeFileSync(fCues, JSON.stringify(cues, null, 1));
  let acc = 0;
  const lineas = guion.map((e) => {
    const l = '[' + fmtT(acc) + ' - ' + fmtT(acc + e.dur) + ']  ' + e.nombre.toUpperCase() + '\n' + e.vo + '\n';
    acc += e.dur;
    return l;
  });
  fs.writeFileSync(path.join(salida, id + '-guion.txt'),
    'GUION · ' + id + ' · ' + total.toFixed(1) + ' s\n' +
    'Lee cada linea dentro de su tramo; el video ya esta cortado a ese ritmo.\n\n' + lineas.join('\n'));

  const audio = path.join(raiz, 'herramientas', 'audio.py');
  const variantes = [[id + '.mp4', []], [id + '-sin-musica.mp4', ['--sin-musica']]];
  for (const [nombre, extra] of variantes) {
    const wav = path.join(salida, nombre + '.wav');
    execFileSync('python3', [audio, '--dur', String(total), '--cues', fCues, '--out', wav].concat(extra), { stdio: 'inherit' });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mudo, '-i', wav, '-c:v', 'copy', '-c:a', 'aac',
      '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(salida, nombre)], { stdio: 'inherit' });
    fs.unlinkSync(wav);
  }
  fs.unlinkSync(mudo);
  console.log('listo:', path.join(salida, id + '.mp4'), '·', total.toFixed(1), 's ·', cues.length, 'efectos');
})().catch(e => { console.error(e); process.exit(1); });
