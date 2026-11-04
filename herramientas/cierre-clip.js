/* ============================================================
   cierre-clip.js — le pone el cierre nuevo (YouTube, Instagram, TikTok
   y @eltorvick) a un short de un video largo

       node herramientas/cierre-clip.js <id> --video "Short 1 - 5 a 50 minutos.mp4"
            [--miniatura miniatura.jpg] [--salida videos] [--comparar 26.6,28.9,30.5]

   <id> es el del registro (largos/<video>/clips.jsx, se ven todos en
   clips.html). Hasta el segundo `desde` el short queda igual, cuadro por
   cuadro; desde ahi va el cierre de clip-cierre.jsx, que repite el
   original (circulo, tarjeta, boton, cursor, subtitulos) y suma la
   pastilla de redes. El audio del original no se toca: el pop del boton
   y el clic siguen cayendo en su lugar.

   La tarjeta muestra la miniatura del registro (`miniatura` en clips.jsx)
   o la de --miniatura (16:9), con la insignia VIDEO COMPLETO y la barra
   roja. Sin ninguna (o con --sin-miniatura) lleva un recorte de la tarjeta
   del short original.

   Deja <salida>/<id>.mp4. Con --comparar deja ademas <id>-comparar.png:
   el original y el nuevo lado a lado en esos segundos, para revisar.

   Necesita Node, Playwright y ffmpeg. Si el CDN de React no esta
   disponible, TORVICK_VENDOR=<carpeta> con react.production.min.js y
   react-dom.production.min.js los sirve en local (como grabar.js).
   ============================================================ */
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn, execFileSync } = require('child_process');

function cargarPlaywright() {
  for (const r of ['playwright', '/opt/node22/lib/node_modules/playwright']) {
    try { return require(r); } catch (e) { /* sigue */ }
  }
  throw new Error('No encuentro Playwright: npm i -g playwright');
}

function args() {
  const a = process.argv.slice(2);
  const o = { id: null, video: null, miniatura: null, salida: 'videos', comparar: null };
  for (let i = 0; i < a.length; i++) {
    if (a[i] === '--video') o.video = a[++i];
    else if (a[i] === '--miniatura') o.miniatura = a[++i];
    else if (a[i] === '--salida') o.salida = a[++i];
    else if (a[i] === '--sin-miniatura') o.sinMiniatura = true;
    else if (a[i] === '--comparar') o.comparar = a[++i].split(',').map(Number);
    else if (!o.id) o.id = a[i];
  }
  return o;
}

function sonda(video) {
  const j = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries',
    'stream=width,height,r_frame_rate,nb_frames:format=duration', '-of', 'json', video]).toString());
  const s = j.streams[0];
  const [n, d] = s.r_frame_rate.split('/').map(Number);
  return { w: s.width, h: s.height, fps: n / d, dur: parseFloat(j.format.duration), cuadros: parseInt(s.nb_frames, 10) || null };
}

function cuadroOriginal(video, n, out) {
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', video, '-vf', 'select=eq(n\\,' + n + ')', '-vsync', '0',
    '-frames:v', '1', out]);
}

async function main() {
  const o = args();
  const raiz = path.resolve(__dirname, '..');
  if (!o.id || !o.video) {
    console.error('Uso: node herramientas/cierre-clip.js <id> --video <short.mp4> [--miniatura img] [--salida videos]');
    process.exit(1);
  }
  const video = path.resolve(o.video);
  if (!fs.existsSync(video)) { console.error('No encuentro el video: ' + video); process.exit(1); }
  const info = sonda(video);
  if (info.w !== 1080 || info.h !== 1920) console.log('aviso: el short es de ' + info.w + 'x' + info.h + ', el cierre se dibuja en 1080x1920');
  const fps = info.fps;
  const salida = path.resolve(o.salida);
  fs.mkdirSync(salida, { recursive: true });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cierre-'));

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
  await p.goto('file://' + path.join(raiz, 'clips.html'));
  await p.waitForFunction(() => window.CLIPS, null, { timeout: 60000 });
  const def = await p.evaluate((id) => {
    const d = window.CLIPS.buscar(id);
    return d ? { id: d.id, desde: d.desde, fin: d.fin, titulo: d.titulo, miniatura: d.miniatura || null } : null;
  }, o.id);
  if (!def) {
    const ids = await p.evaluate(() => window.CLIPS.lista().map(d => d.id + '  (' + d.titulo + ')'));
    await b.close();
    console.error('No hay ningun clip con el id "' + o.id + '". Los que hay:\n  ' + ids.join('\n  '));
    process.exit(1);
  }

  // el primer cuadro del cierre y cuantos cuadros tiene el short
  const k0 = Math.round(def.desde * fps);
  const nTotal = info.cuadros || Math.round(info.dur * fps);
  const nCierre = nTotal - k0;
  if (nCierre <= 0) { await b.close(); console.error('El cierre empieza despues del final del video.'); process.exit(1); }

  // la imagen de la tarjeta: la miniatura nueva o un recorte de la original apenas se acomoda
  // (sin la barra roja de abajo, que se dibuja aparte porque se va llenando)
  let mini;
  // --miniatura manda; si no, la que tenga el registro (relativa a la raiz); --sin-miniatura usa el recorte
  if (!o.miniatura && def.miniatura && !o.sinMiniatura) o.miniatura = path.join(raiz, def.miniatura);
  if (o.miniatura) {
    const m = path.resolve(o.miniatura);
    if (!fs.existsSync(m)) { await b.close(); console.error('No encuentro la miniatura: ' + m); process.exit(1); }
    mini = { src: 'file://' + m, recorte: false };
  } else {
    const rec = path.join(tmp, 'recorte.png');
    const kRec = Math.min(nTotal - 1, k0 + Math.round(0.7 * fps));
    const c = await p.evaluate((t) => window.CLIPS.cajaImagen(t), kRec / fps - def.desde);
    const r = (v) => Math.round(v);
    execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', video, '-vf',
      'select=eq(n\\,' + kRec + '),crop=' + r(c.w) + ':' + r(c.h) + ':' + r(c.x) + ':' + r(c.y) +
      ',scale=' + c.wBase + ':' + c.hBase + ':flags=lanczos', '-vsync', '0', '-frames:v', '1', rec]);
    mini = { src: 'file://' + rec, recorte: true };
  }
  // la misma pagina pasa a modo render (solo cambia el hash: no se recarga)
  await p.evaluate((m) => { window.CLIP_MINIATURA = m; }, mini);
  await p.evaluate((id) => { document.body.className = 'render'; location.hash = id + '/render'; }, o.id);
  await p.waitForFunction((id) => window.CLIP && window.CLIP.id === id && document.fonts.status === 'loaded', o.id, { timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => Promise.all(Array.from(document.images).map(i => i.decode && i.decode().catch(() => null))));
  const listo = await p.evaluate(() => Promise.all(['900 82px Montserrat', '800 54px Montserrat', '700 40px Montserrat']
    .map(f => document.fonts.load(f))).then(() => document.fonts.check('900 82px Montserrat')));
  if (!listo) console.log('aviso: no cargo la letra Montserrat (¿sin internet?); los textos salen con otra');

  const foto = async (t) => {
    await p.evaluate((v) => window.CLIP.seek(v), t);
    await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    return p.screenshot({ clip: { x: 0, y: 0, width: 1080, height: 1920 }, type: 'png' });
  };

  if (o.comparar) {
    const fotos = [];
    for (const t of o.comparar) {
      const n = Math.round(t * fps);
      const a = path.join(tmp, 'o' + n + '.png'), c = path.join(tmp, 'n' + n + '.png');
      cuadroOriginal(video, n, a);
      fs.writeFileSync(c, await foto(n / fps));
      fotos.push(a, c);
    }
    const ent = [];
    fotos.forEach(f => ent.push('-i', f));
    const filtro = fotos.map((_, i) => '[' + i + ':v]scale=360:640[v' + i + ']').join(';') + ';' +
      fotos.map((_, i) => '[v' + i + ']').join('') + 'hstack=inputs=' + fotos.length + '[s]';
    const out = path.join(salida, o.id + '-comparar.png');
    execFileSync('ffmpeg', ['-y', '-v', 'error', ...ent, '-filter_complex', filtro, '-map', '[s]', out]);
    console.log('comparacion (original | nuevo en cada segundo): ' + out);
  }

  // el cierre cuadro por cuadro
  const cierre = path.join(tmp, 'cierre.mp4');
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps),
    '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '14', '-preset', 'medium', cierre],
  { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < nCierre; i++) {
    const buf = await foto((k0 + i) / fps);
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();

  // original hasta el cuadro k0, el cierre nuevo despues; el audio entero del original
  const out = path.join(salida, o.id + '.mp4');
  const escala = (info.w !== 1080 || info.h !== 1920) ? 'scale=' + info.w + ':' + info.h + ',' : '';
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', video, '-i', cierre, '-filter_complex',
    '[0:v]trim=end_frame=' + k0 + ',setpts=PTS-STARTPTS[a];[1:v]' + escala + 'setpts=PTS-STARTPTS,fps=' + fps + '[b];' +
    '[a][b]concat=n=2:v=1:a=0,format=yuv420p[v]',
    '-map', '[v]', '-map', '0:a?', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-r', String(fps),
    '-c:a', 'copy', '-movflags', '+faststart', out]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(def.titulo + ': ' + out + '  (cierre desde ' + (k0 / fps).toFixed(2) + ' s, ' + nCierre + ' cuadros'
    + (o.miniatura ? ', con la miniatura nueva' : ', con la imagen de la tarjeta original') + ')');
}

main().catch(e => { console.error(e); process.exit(1); });
