// render.js — render cuadro por cuadro con Playwright (Chromium headless) + ffmpeg.
//
//   node render.js                    video completo -> salida/video-sin-audio.mp4, salida/cues.json, salida/miniatura.png
//   node render.js --fotos 0,6.2,30   capturas PNG de esos segundos -> salida/fotos/
//   node render.js --hoja 0.5         hojas de contacto (una captura cada 0.5 s) -> salida/hojas/
//   node render.js --procesos 4       cantidad de procesos en paralelo (por defecto 4)
//
// Cada cuadro: window.__seek(f/60) -> screenshot JPEG 93 -> pipe a ffmpeg (libx264 -crf 16, yuv420p, 60 fps).
// Los segmentos se unen con el demuxer concat, sin recodificar.
'use strict';
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const RAIZ = __dirname;
const SALIDA = path.join(RAIZ, 'salida');
const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const PROCESOS = +(opt('--procesos') || 4);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.otf': 'font/otf', '.woff2': 'font/woff2', '.json': 'application/json' };
function servidor() {
  return new Promise((ok) => {
    const s = http.createServer((req, res) => {
      const p = path.join(RAIZ, decodeURIComponent(req.url.split('?')[0]));
      if (!p.startsWith(RAIZ) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
      fs.createReadStream(p).pipe(res);
    });
    s.listen(0, '127.0.0.1', () => ok(s));
  });
}

async function abrir(browser, url) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errores = [];
  page.on('pageerror', (e) => errores.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
  await page.goto(url);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 90000 }).catch((e) => {
    throw new Error('La página no quedó lista: ' + errores.join(' | ') + ' ' + e.message);
  });
  if (errores.length) console.warn('Avisos de la página:', errores.join(' | '));
  return page;
}

function ffmpeg(argsFF) {
  const p = spawn('ffmpeg', argsFF, { stdio: ['pipe', 'inherit', 'inherit'] });
  p.fin = new Promise((ok, mal) => p.on('close', (c) => (c === 0 ? ok() : mal(new Error('ffmpeg salió con ' + c)))));
  return p;
}

async function segmento(url, i, f0, f1, fps, out) {
  const browser = await chromium.launch();
  const page = await abrir(browser, url);
  const ff = ffmpeg(['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(fps), out]);
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    await page.evaluate((t) => window.__seek(t), f / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 93 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if ((f - f0) % 300 === 0) console.log(`  proceso ${i}: cuadro ${f - f0}/${f1 - f0}  (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  }
  ff.stdin.end();
  await ff.fin;
  await browser.close();
}

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const srv = await servidor();
  const url = `http://127.0.0.1:${srv.address().port}/index.html?render=1`;
  try {
    if (opt('--fotos') || opt('--hoja')) {
      const browser = await chromium.launch();
      const page = await abrir(browser, url);
      const dur = await page.evaluate(() => window.__duration);
      let tiempos, dir;
      if (opt('--fotos')) { tiempos = opt('--fotos').split(',').map(Number); dir = path.join(SALIDA, 'fotos'); }
      else { const paso = +opt('--hoja'); tiempos = []; for (let t = 0; t < dur; t += paso) tiempos.push(+t.toFixed(3)); dir = path.join(SALIDA, 'hojas'); }
      fs.mkdirSync(dir, { recursive: true });
      for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
      let k = 0;
      for (const t of tiempos) {
        await page.evaluate((x) => window.__seek(x), t);
        const nombre = opt('--fotos') ? `t-${t.toFixed(2).padStart(6, '0')}.png` : `f${String(k++).padStart(4, '0')}.jpg`;
        await page.screenshot({ path: path.join(dir, nombre), type: nombre.endsWith('png') ? 'png' : 'jpeg', quality: nombre.endsWith('png') ? undefined : 85 });
      }
      if (opt('--hoja')) {
        // hojas de 6x3 cuadros con el tiempo de cada uno
        const etiquetas = tiempos.map((t) => t.toFixed(1) + 's');
        fs.writeFileSync(path.join(dir, 'tiempos.txt'), etiquetas.join('\n'));
      }
      console.log(`${tiempos.length} capturas en ${dir}`);
      await browser.close();
      return;
    }

    // ---- render completo ----
    const browser = await chromium.launch();
    const page = await abrir(browser, url);
    const info = await page.evaluate(() => ({ dur: window.__duration, tl: window.__tlDuration, cues: window.__cues }));
    fs.writeFileSync(path.join(SALIDA, 'cues.json'), JSON.stringify({ duracion: info.dur, cues: info.cues }, null, 1));
    await page.evaluate(() => window.__seek(0));
    await page.screenshot({ path: path.join(SALIDA, 'miniatura.png'), type: 'png' });
    await browser.close();
    if (info.tl > info.dur + 0.001) console.warn(`Ojo: la línea de tiempo dura ${info.tl}s y el video ${info.dur}s.`);
    const fps = 60, total = Math.round(info.dur * fps);
    console.log(`Render: ${info.dur}s, ${total} cuadros, ${PROCESOS} procesos`);
    const trozo = Math.ceil(total / PROCESOS), partes = [];
    const t0 = Date.now();
    await Promise.all(Array.from({ length: PROCESOS }, (_, i) => {
      const f0 = i * trozo, f1 = Math.min(total, f0 + trozo);
      const out = path.join(SALIDA, `parte-${i}.mp4`);
      partes.push(out);
      return segmento(url, i, f0, f1, fps, out);
    }));
    const lista = path.join(SALIDA, 'partes.txt');
    fs.writeFileSync(lista, partes.map((p) => `file '${p}'`).join('\n'));
    const cat = ffmpeg(['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', path.join(SALIDA, 'video-sin-audio.mp4')]);
    cat.stdin.end();
    await cat.fin;
    for (const p of partes) fs.unlinkSync(p);
    fs.unlinkSync(lista);
    console.log(`Listo en ${((Date.now() - t0) / 1000).toFixed(0)} s -> salida/video-sin-audio.mp4`);
  } finally {
    srv.close();
  }
})().catch((e) => { console.error(e); process.exit(1); });
