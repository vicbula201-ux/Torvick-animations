/* ============================================================
   grabar.js — exporta un reel de reels.html a MP4 listo para subir

       node herramientas/grabar.js <id> [carpeta-salida] [--con-musica]
       node herramientas/grabar.js <id> [carpeta-salida] --voz mi-voz.m4a [--nivel-efectos -6]

   Sin --voz deja en la carpeta (por defecto ./videos):
     <id>.mp4              video + los sonidos de las X (error) y los vistos ("tin"),
                           sin musica (pedido del autor); la voz la grabas vos
     <id>-guion.txt        las lineas de la voz con su segundo de inicio
     <id>-cues.json        los momentos de esos sonidos
   Con --con-musica deja ademas <id>-con-musica.mp4 (musica original + todos los efectos).
   Los videos de estilo 2 se graban a 60 cuadros por segundo (mas fluidos); los demas a 30.

   Con --voz <grabacion> (una toma con todas las lineas del guion en orden, con una
   pausa entre linea y linea; m4a, mp3, wav, lo que sea que lea ffmpeg) el video se
   calza solo con la voz: herramientas/voz.py encuentra donde empieza cada linea, cada
   escena pasa a durar lo que dura su linea y la voz queda mezclada con los efectos.
   Deja <id>-con-voz.mp4 (listo para publicar), <id>-guion.txt con los tramos nuevos y
   <id>-voz.txt con el informe (que linea cayo en cada escena y los avisos para revisar).
   --nivel-efectos <dB> baja o sube los efectos frente a la voz (por defecto -6).

   Necesita: Node, Playwright (npm i -g playwright && npx playwright install chromium),
   ffmpeg y python3 con numpy. No es parte de la app: es una herramienta de escritorio.
   Si el CDN de React no esta disponible, TORVICK_VENDOR=<carpeta> con
   react.production.min.js y react-dom.production.min.js los sirve en local.
   ============================================================ */
'use strict';

const path = require('path');
const fs = require('fs');
const { spawn, execFileSync, spawnSync } = require('child_process');

function cargarPlaywright() {
  const rutas = ['playwright', '/opt/node22/lib/node_modules/playwright'];
  for (const r of rutas) { try { return require(r); } catch (e) { /* sigue */ } }
  throw new Error('No encuentro Playwright: npm i -g playwright');
}

function fmtT(s) {
  const m = Math.floor(s / 60), r = s - 60 * m;
  return String(m).padStart(2, '0') + ':' + r.toFixed(1).padStart(4, '0');
}

function leerArgs(args) {
  const o = { conMusica: false, voz: null, nivelEfectos: -6, pos: [] };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--con-musica') o.conMusica = true;
    else if (a === '--voz' || a === '--nivel-efectos') {
      const v = args[++i];
      if (v === undefined) { console.error('falta el valor de ' + a); process.exit(1); }
      if (a === '--voz') o.voz = v;
      else o.nivelEfectos = parseFloat(v);
    } else if (a.startsWith('--')) { console.error('opcion desconocida: ' + a); process.exit(1); }
    else o.pos.push(a);
  }
  if (!isFinite(o.nivelEfectos)) { console.error('--nivel-efectos necesita un numero (dB)'); process.exit(1); }
  return o;
}

(async () => {
  const o = leerArgs(process.argv.slice(2));
  const [id, dirSalida = 'videos'] = o.pos;
  if (!id) {
    console.error('uso: node herramientas/grabar.js <id> [carpeta] [--con-musica] [--voz grabacion.m4a]');
    process.exit(1);
  }
  const raiz = path.resolve(__dirname, '..');
  const salida = path.resolve(dirSalida);
  const voz = o.voz ? path.resolve(o.voz) : null;
  if (voz && !fs.existsSync(voz)) { console.error('No encuentro la grabacion: ' + voz); process.exit(1); }
  fs.mkdirSync(salida, { recursive: true });

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
  const pagina = 'file://' + path.join(raiz, 'reels.html') + '#' + id + '/render';
  await p.goto(pagina);
  await p.waitForFunction(() => window.REEL && document.fonts && document.fonts.status === 'loaded', null, { timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);

  // un id mal escrito mostraria el primer video de la lista sin avisar
  const ids = await p.evaluate(() => window.REELS.lista().map(d => d.id));
  if (ids.indexOf(id) < 0) {
    await b.close();
    console.error('No hay ningun reel con el id "' + id + '". Los que hay:\n  ' + ids.join('\n  '));
    process.exit(1);
  }

  let vozWav = null;
  let tramosVoz = null;
  if (voz) {
    // 1) el guion con los tiempos del archivo  2) voz.py los calza con la grabacion
    // 3) la pagina se vuelve a armar con esas duraciones
    const guion0 = await p.evaluate(() => window.REEL.guion);
    const fGuion = path.join(salida, id + '.guion-voz.json');
    const fRes = path.join(salida, id + '.voz.json');
    vozWav = path.join(salida, id + '.voz.wav');
    fs.writeFileSync(fGuion, JSON.stringify(guion0, null, 1));
    const r = spawnSync('python3', [path.join(raiz, 'herramientas', 'voz.py'), '--voz', voz, '--guion', fGuion,
      '--out', fRes, '--wav', vozWav, '--informe', path.join(salida, id + '-voz.txt')], { stdio: 'inherit' });
    fs.unlinkSync(fGuion);
    if (r.status !== 0) { await b.close(); console.error('No se pudo calzar la voz con el guion.'); process.exit(1); }
    const res = JSON.parse(fs.readFileSync(fRes, 'utf8'));
    fs.unlinkSync(fRes);
    tramosVoz = res.durs;
    await p.goto(pagina + '/' + res.durs.join(','));
    await p.waitForFunction((t) => window.REEL && Math.abs(window.REEL.total - t) < 0.01, res.total, { timeout: 30000 })
      .catch(() => null);
    const ok = await p.evaluate((d) => window.REEL.guion.length === d.length &&
      window.REEL.guion.every((e, i) => Math.abs(e.dur - d[i]) < 0.001), res.durs);
    if (!ok) { await b.close(); console.error('La pagina no tomo las duraciones de la voz.'); process.exit(1); }
  }

  await p.evaluate(() => window.REEL.setPlaying(false));
  await p.waitForTimeout(300);
  const total = await p.evaluate(() => window.REEL.total);
  const fps = await p.evaluate(() => window.REEL.fps || 30);
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

  // solo suenan las X, los vistos y los efectos que una escena marca a proposito (el "siuuu",
  // la tribuna, un golpe...); los cambios de escena y la marca solo con --con-musica
  const SUENAN = ['error', 'bien', 'siu', 'publico', 'golpe', 'whoosh', 'campana', 'pop'];
  const fCues = path.join(salida, id + '-cues.json');
  fs.writeFileSync(fCues, JSON.stringify(cues.filter(c => SUENAN.indexOf(c.tipo) >= 0), null, 1));
  const fCuesTodos = path.join(salida, id + '.cues-todos.json');
  fs.writeFileSync(fCuesTodos, JSON.stringify(cues, null, 1));
  let acc = 0;
  const lineas = guion.map((e) => {
    const l = '[' + fmtT(acc) + ' - ' + fmtT(acc + e.dur) + ']  ' + e.nombre.toUpperCase() + '\n' + e.vo + '\n';
    acc += e.dur;
    return l;
  });
  fs.writeFileSync(path.join(salida, id + '-guion.txt'),
    'GUION · ' + id + ' · ' + total.toFixed(1) + ' s\n' +
    (voz ? 'Tramos calzados con la voz de ' + path.basename(voz) + '.\n\n'
      : 'Lee cada linea dentro de su tramo; el video ya esta cortado a ese ritmo.\n\n') + lineas.join('\n'));

  const audio = path.join(raiz, 'herramientas', 'audio.py');
  const conVoz = voz ? ['--base', vozWav, '--nivel-efectos', String(o.nivelEfectos)] : [];
  const variantes = [[id + (voz ? '-con-voz' : '') + '.mp4', fCues, ['--sin-musica'].concat(conVoz)]];
  if (o.conMusica) variantes.push([id + (voz ? '-con-voz-y-musica' : '-con-musica') + '.mp4', fCuesTodos, conVoz]);
  for (const [nombre, cuesArchivo, extra] of variantes) {
    const wav = path.join(salida, nombre + '.wav');
    execFileSync('python3', [audio, '--dur', String(total), '--cues', cuesArchivo, '--out', wav].concat(extra), { stdio: 'inherit' });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mudo, '-i', wav, '-c:v', 'copy', '-c:a', 'aac',
      '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(salida, nombre)], { stdio: 'inherit' });
    fs.unlinkSync(wav);
  }
  fs.unlinkSync(mudo);
  fs.unlinkSync(fCuesTodos);
  if (vozWav) fs.unlinkSync(vozWav);
  console.log('listo:', path.join(salida, variantes[0][0]), '·', total.toFixed(1), 's ·', fps, 'fps');
  if (tramosVoz) {
    console.log('duraciones calzadas con la voz (por si querés fijarlas en ESCENAS):', tramosVoz.join(', '));
  }
})().catch(e => { console.error(e); process.exit(1); });
