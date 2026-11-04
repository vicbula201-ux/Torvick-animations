/* ============================================================
   grabar.js — exporta un reel de reels.html a MP4 listo para subir

       node herramientas/grabar.js <id> [carpeta-salida] [--con-musica]
       node herramientas/grabar.js <id> [carpeta-salida] --voz [--musica tema.wav]

   Deja en la carpeta (por defecto ./videos):
     <id>.mp4              video + los sonidos de las X (error) y los vistos ("tin"),
                           sin musica (pedido del autor); la voz la grabas vos
     <id>-guion.txt        las lineas de la voz con su segundo de inicio
     <id>-cues.json        los momentos de esos sonidos
   Con --con-musica deja ademas <id>-con-musica.mp4 (musica original + todos los efectos).
   Con --voz (doblaje automatico, herramientas/locutor.py): genera la voz de cada linea,
   alarga cada escena a lo que dura su linea (las escenas usan f(fraccion), la
   coreografia se estira sola) y deja <id>-voz.mp4 con voz + musica + efectos; la
   musica baja sola cuando se habla. --musica usa ese tema en vez del sintetizado.
   Los videos de estilo 2 se graban a 60 cuadros por segundo (mas fluidos); los demas a 30.

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
  const args = process.argv.slice(2);
  const conMusica = args.includes('--con-musica');
  const conVoz = args.includes('--voz');
  const iMus = args.indexOf('--musica');
  const tema = iMus >= 0 ? path.resolve(args[iMus + 1]) : null;
  const [id, dirSalida = 'videos'] = args.filter((a, i) => !a.startsWith('--') && (iMus < 0 || i !== iMus + 1));
  if (!id) { console.error('uso: node herramientas/grabar.js <id> [carpeta]'); process.exit(1); }
  const raiz = path.resolve(__dirname, '..');
  const salida = path.resolve(dirSalida);
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
  const abrir = async (durs) => {
    await p.goto('file://' + path.join(raiz, 'reels.html') + '#' + id + '/render' + (durs ? '/' + durs.join(',') : ''));
    await p.waitForFunction(() => window.REEL && document.fonts && document.fonts.status === 'loaded', null, { timeout: 60000 });
    await p.evaluate(() => document.fonts.ready);
    await p.evaluate(() => window.REEL.setPlaying(false));
    await p.waitForTimeout(300);
  };
  await abrir(null);

  // doblaje: la voz de cada linea manda la duracion de su escena
  const locutor = path.join(raiz, 'herramientas', 'locutor.py');
  const dirVoz = path.join(salida, id + '-voz');
  let voces = null, durs = null;
  if (conVoz) {
    const g0 = await p.evaluate(() => window.REEL.guion);
    fs.mkdirSync(dirVoz, { recursive: true });
    const fLin = path.join(dirVoz, 'pedido.json');
    fs.writeFileSync(fLin, JSON.stringify(g0.map((e, i) => ({ i: i, texto: e.vo || '' })), null, 1));
    execFileSync('python3', [locutor, 'decir', fLin, dirVoz], { stdio: 'inherit' });
    voces = JSON.parse(fs.readFileSync(path.join(dirVoz, 'lineas.json'), 'utf8'));
    const ultima = g0.length - 1;
    durs = g0.map((e, i) => {
      const v = voces[i] && voces[i].dur ? voces[i].dur : 0;
      // la linea entra 0,2 s despues del corte y deja un respiro antes del siguiente
      return Math.round(Math.max(i === ultima ? 3.5 : 2.0, v + (i === ultima ? 0.6 : 0.55)) * 100) / 100;
    });
    console.log('duraciones con la voz:', durs.join(' '));
    await abrir(durs);
  }
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
    'Lee cada linea dentro de su tramo; el video ya esta cortado a ese ritmo.\n\n' + lineas.join('\n'));

  const audio = path.join(raiz, 'herramientas', 'audio.py');
  const variantes = [[id + '.mp4', fCues, ['--sin-musica']]];
  if (conMusica) variantes.push([id + '-con-musica.mp4', fCuesTodos, []]);
  if (conVoz) {
    // pista de voz: cada linea 0,2 s despues del comienzo de su escena
    let t = 0;
    const plan = { dur: total, lineas: guion.map((e, i) => { const l = { archivo: voces[i] && voces[i].archivo, t: t + 0.2 }; t += e.dur; return l; }) };
    const fPlan = path.join(dirVoz, 'plan.json');
    fs.writeFileSync(fPlan, JSON.stringify(plan, null, 1));
    const fVoz = path.join(dirVoz, 'voz.wav');
    execFileSync('python3', [locutor, 'pista', fPlan, fVoz], { stdio: 'inherit' });
    variantes.push([id + '-voz.mp4', fCues, ['--base', fVoz, '--nivel-efectos', '4'].concat(tema ? ['--musica', tema] : [])]);
  }
  for (const [nombre, cuesArchivo, extra] of variantes) {
    const wav = path.join(salida, nombre + '.wav');
    execFileSync('python3', [audio, '--dur', String(total), '--cues', cuesArchivo, '--out', wav].concat(extra), { stdio: 'inherit' });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mudo, '-i', wav, '-c:v', 'copy', '-c:a', 'aac',
      '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(salida, nombre)], { stdio: 'inherit' });
    fs.unlinkSync(wav);
  }
  fs.unlinkSync(mudo);
  fs.unlinkSync(fCuesTodos);
  console.log('listo:', path.join(salida, id + '.mp4'), '·', total.toFixed(1), 's ·', fps, 'fps');
})().catch(e => { console.error(e); process.exit(1); });
