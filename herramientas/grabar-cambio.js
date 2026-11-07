/* ============================================================
   grabar-cambio.js — exporta un video vertical (P4) de cambio.html a MP4

       node herramientas/grabar-cambio.js <id> [opciones]

     --salida <carpeta>   por defecto ./videos
     --fuente <video>     el master (4K, el que sea) en vez del video del plan;
                          tiene que ser el MISMO corte que se uso para el plan
     --4k                 exporta 2160x3840 (los graficos se dibujan al doble)
     --desde <s> --hasta <s>   solo un tramo (para revisar)
     --cuadros 1.5,8,20   solo esas fotos (PNG), sin video
     --trabajos <n>       paginas en paralelo (por defecto: nucleos - 1, hasta 6)
     --crf <n>            calidad x264 (por defecto 18; menos = mejor)
     --preset <p>         preset de x264 (por defecto fast)
     --musica             agrega la musica sintetizada debajo de la voz
     --musica-wav <wav>   o una musica propia
     --nivel-efectos <dB> volumen de los efectos (por defecto -6)
     --nivel-voz <dBFS>   volumen de la voz donde se habla (por defecto -14.5: el video
                          queda en ~-14 LUFS, lo normal en Reels, TikTok y Shorts)

   Por cada cuadro: lee el cuadro del video (ffmpeg), se lo pasa a la pagina en
   modo render (#<id>/render), mueve T y saca la foto del lienzo (1080x1920).
   Los subtitulos van siempre, asi que todos los cuadros pasan por el navegador.
   Si el plan pone algo detras de la persona (dia, detras), antes calcula las
   mascaras con herramientas/recortar.py. Al final mezcla la voz del video con
   los efectos (herramientas/audio.py) y deja en la salida:
     <id>.mp4        el video editado
     <id>.srt        subtitulos (por si la plataforma los pide aparte)
     <id>-cues.json  los efectos con su segundo

   Necesita Node, Playwright, ffmpeg y python3 con numpy (+ onnxruntime para las
   mascaras). Si el CDN de React no responde, TORVICK_VENDOR=<carpeta> con
   react.production.min.js y react-dom.production.min.js los sirve en local.
   ============================================================ */
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn, execFileSync } = require('child_process');

function cargarPlaywright() {
  const rutas = ['playwright', '/opt/node22/lib/node_modules/playwright'];
  for (const r of rutas) { try { return require(r); } catch (e) { /* sigue */ } }
  throw new Error('No encuentro Playwright: npm i -g playwright');
}

function opciones(argv) {
  const o = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      o[k] = v;
    } else o._.push(a);
  }
  return o;
}

const raiz = path.resolve(__dirname, '..');
const FPS = 30;
const ANCHO = 1080, ALTO = 1920;

async function abrirPagina(browser, id, escala) {
  const p = await browser.newPage({ viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: escala || 1 });
  p.on('pageerror', (e) => console.log('error en la pagina:', e.message));
  p.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') console.log('pagina:', m.text()); });
  p.on('requestfailed', (r) => { if (!r.url().includes('/recorte/')) console.log('no carga:', r.url().replace('file://' + raiz + '/', '')); });
  const vendor = process.env.TORVICK_VENDOR;
  let actual = null;
  await p.route('**/*', (r) => {
    const u = r.request().url();
    if (u.startsWith('http://cuadro.local/')) {
      return r.fulfill({ body: actual || Buffer.alloc(0), contentType: 'image/jpeg' });
    }
    if (vendor) {
      for (const f of ['react.production.min.js', 'react-dom.production.min.js']) {
        if (u.endsWith(f)) return r.fulfill({ body: fs.readFileSync(path.join(vendor, f)), contentType: 'application/javascript' });
      }
    }
    return r.continue();
  });
  await p.goto('file://' + path.join(raiz, 'cambio.html') + '#' + id + '/render');
  await p.waitForFunction(() => window.CAMBIO && document.fonts && document.fonts.status === 'loaded', null, { timeout: 90000 });
  await p.evaluate(() => document.fonts.ready);
  // las fuentes que todavia no se usaron se cargan ahora (si no, el primer cuadro sale con la de reemplazo)
  await p.evaluate(() => Promise.all(["800 76px 'Inter Tight'", "600 30px 'Inter Tight'", "400 100px 'Archivo Black'",
    "400 60px 'Permanent Marker'", "600 28px 'IBM Plex Mono'"].map((f) => document.fonts.load(f))));
  await p.evaluate(() => window.CAMBIO.precargar && window.CAMBIO.precargar());
  let n = 0;
  p.cuadro = async (buf) => {
    actual = buf;
    await p.evaluate((u) => window.CAMBIO.cuadro(u), 'http://cuadro.local/' + (n++) + '.jpg');
  };
  p.ver = async (t) => { await p.evaluate((t) => window.CAMBIO.seek(t), t); };
  return p;
}

// lee un flujo MJPEG de ffmpeg y entrega los cuadros de a uno
function lectorCuadros(args) {
  const ff = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'inherit'] });
  let buf = Buffer.alloc(0);
  const cola = [];
  let esperando = null, fin = false;
  const despachar = () => {
    while (esperando && cola.length) { const r = esperando; esperando = null; r(cola.shift()); }
    if (esperando && fin) { const r = esperando; esperando = null; r(null); }
  };
  ff.stdout.on('data', (d) => {
    buf = Buffer.concat([buf, d]);
    for (;;) {
      const ini = buf.indexOf(Buffer.from([0xff, 0xd8]));
      if (ini < 0) { buf = Buffer.alloc(0); break; }
      const fn = buf.indexOf(Buffer.from([0xff, 0xd9]), ini + 2);
      if (fn < 0) { if (ini > 0) buf = buf.subarray(ini); break; }
      cola.push(buf.subarray(ini, fn + 2));
      buf = buf.subarray(fn + 2);
    }
    if (cola.length > 60) ff.stdout.pause();
    despachar();
  });
  ff.stdout.on('end', () => { fin = true; despachar(); });
  return {
    siguiente: () => new Promise((r) => {
      if (cola.length < 20) ff.stdout.resume();
      esperando = r; despachar();
    })
  };
}

function srt(trans) {
  const fmt = (s) => {
    const ms = Math.round(s * 1000);
    const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, se = Math.floor(ms / 1000) % 60, r = ms % 1000;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(se).padStart(2, '0') + ',' + String(r).padStart(3, '0');
  };
  const out = [];
  let act = [];
  const cerrar = () => {
    if (!act.length) return;
    out.push({ ini: act[0].ini, fin: act[act.length - 1].fin, txt: act.map((w) => w.p).join(' ') });
    act = [];
  };
  trans.palabras.forEach((w) => {
    const prev = act[act.length - 1];
    if (prev && (w.ini - prev.fin > 0.6 || act.map((x) => x.p).join(' ').length + w.p.length > 42)) cerrar();
    act.push(w);
    if (/[.?!]$/.test(w.p)) cerrar();
  });
  cerrar();
  return out.map((b, i) => (i + 1) + '\n' + fmt(b.ini) + ' --> ' + fmt(Math.max(b.fin, b.ini + 0.8)) + '\n' + b.txt + '\n').join('\n');
}

function leerTranscripcion(id) {
  const f = path.join(raiz, 'cambios', id, 'transcripcion.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
}

// escala la fuente a la salida; si no es 9:16, recorta al centro (como object-fit: cover)
function filtroEscala(fuente, W, H) {
  const [w, h] = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
    '-of', 'csv=p=0', fuente]).toString().trim().split(',').map(Number);
  let f = 'scale=' + W + ':' + H + ':force_original_aspect_ratio=increase:flags=lanczos,crop=' + W + ':' + H;
  if (h && h < H * 0.95) {
    f += ',unsharp=5:5:0.5:5:5:0';
    console.log('ojo: la fuente es de ' + w + 'x' + h + ' y la salida de ' + W + 'x' + H + ' (se agranda)');
  }
  if (w && h && Math.abs(w / h - 9 / 16) > 0.02) console.log('ojo: la fuente no es 9:16 (' + w + 'x' + h + '): se recorta al centro');
  return f;
}

(async () => {
  const o = opciones(process.argv.slice(2));
  const id = o._[0];
  if (!id) { console.error('uso: node herramientas/grabar-cambio.js <id> [--fuente master.mp4] [--4k] [--desde s] [--hasta s] [--cuadros a,b] [--salida dir]'); process.exit(1); }
  if (!fs.existsSync(path.join(raiz, 'cambios', id))) {
    const hay = fs.existsSync(path.join(raiz, 'cambios')) ? fs.readdirSync(path.join(raiz, 'cambios')).filter((d) => !d.startsWith('.')) : [];
    console.error('no existe cambios/' + id + '. Videos: ' + (hay.join(', ') || 'ninguno'));
    process.exit(1);
  }
  const salida = path.resolve(o.salida || 'videos');
  fs.mkdirSync(salida, { recursive: true });
  const { chromium } = cargarPlaywright();
  const browser = await chromium.launch();
  const escala = o['4k'] ? 2 : 1;
  const W = ANCHO * escala, H = ALTO * escala;
  const p0 = await abrirPagina(browser, id, escala);
  const info = await p0.evaluate(() => ({ total: window.CAMBIO.total, video: window.CAMBIO.video }));
  const fuente = o.fuente ? path.resolve(String(o.fuente)) : path.join(raiz, info.video);
  if (!fs.existsSync(fuente)) throw new Error('no encuentro el video: ' + fuente);
  const escalar = filtroEscala(fuente, W, H);

  // ---------- mascaras para lo que va detras de la persona ----------
  const recorte = await p0.evaluate(() => window.CAMBIO.tramos().recorte || []);
  if (recorte.length) {
    console.log('recortando a la persona en', recorte.length, 'tramos…');
    execFileSync('python3', [path.join(raiz, 'herramientas', 'recortar.py'), fuente, '--alto', '1280', '--tramos',
      recorte.map((r) => r[0].toFixed(2) + '-' + r[1].toFixed(2)).join(','),
      '--out', path.join(raiz, 'cambios', id, 'media', 'recorte')], { stdio: 'inherit' });
  }

  // ---------- fotos sueltas ----------
  if (o.cuadros) {
    const ts = String(o.cuadros).split(',').map(Number);
    for (const t of ts) {
      const jpg = execFileSync('ffmpeg', ['-v', 'error', '-ss', String(t), '-i', fuente, '-frames:v', '1',
        '-vf', escalar, '-f', 'image2pipe', '-c:v', 'mjpeg', '-q:v', '2', '-'], { maxBuffer: 1 << 28 });
      await p0.cuadro(jpg);
      await p0.ver(t);
      const dest = path.join(salida, id + '-' + t.toFixed(2) + '.png');
      await p0.screenshot({ path: dest, clip: { x: 0, y: 0, width: ANCHO, height: ALTO } });
      console.log('foto', dest);
    }
    await browser.close();
    return;
  }

  const cues = await p0.evaluate(() => window.CAMBIO.cues());
  await p0.close();
  const desde = Number(o.desde || 0);
  const hasta = Math.min(Number(o.hasta || info.total), info.total);
  const nTot = Math.floor((hasta - desde) * FPS);
  const trabajos = Math.max(1, Number(o.trabajos || Math.min(6, Math.max(1, os.cpus().length - 1))));
  const crf = String(o.crf || 18);
  const preset = String(o.preset || 'fast');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cambio-' + id + '-'));
  const por = Math.ceil(nTot / trabajos);
  const t0 = Date.now();
  let hechos = 0;
  console.log('cuadros:', nTot, '·', trabajos, 'paginas en paralelo');

  const tramo = async (k) => {
    const i0 = k * por, i1 = Math.min(nTot, (k + 1) * por);
    if (i1 <= i0) return null;
    const p = await abrirPagina(browser, id, escala);
    const a = desde + i0 / FPS;
    const lector = lectorCuadros(['-v', 'error', '-ss', a.toFixed(4), '-i', fuente, '-frames:v', String(i1 - i0),
      '-vf', 'fps=' + FPS + ',' + escalar, '-f', 'image2pipe', '-c:v', 'mjpeg', '-q:v', '2', '-']);
    const seg = path.join(tmp, 'tramo-' + String(k).padStart(2, '0') + '.mp4');
    const enc = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', preset, '-crf', crf, '-pix_fmt', 'yuv420p', '-r', String(FPS), seg],
    { stdio: ['pipe', 'inherit', 'inherit'] });
    let ultimo = null;
    for (let i = i0; i < i1; i++) {
      const c = await lector.siguiente();
      if (c) ultimo = c;
      if (ultimo) await p.cuadro(ultimo);
      await p.ver(desde + i / FPS);
      const foto = await p.screenshot({ type: 'jpeg', quality: 94, clip: { x: 0, y: 0, width: ANCHO, height: ALTO } });
      if (!enc.stdin.write(foto)) await new Promise((r) => enc.stdin.once('drain', r));
      hechos++;
      if (hechos % 150 === 0) {
        const s = (Date.now() - t0) / 1000;
        console.log(id, 'cuadro', hechos, '/', nTot, '·', (hechos / s).toFixed(1), 'cuadros/s · faltan ~' +
          Math.max(1, Math.round((nTot - hechos) / (hechos / s) / 60)) + ' min');
      }
    }
    enc.stdin.end();
    await new Promise((r) => enc.on('close', r));
    await p.close();
    return seg;
  };

  const segs = (await Promise.all([...Array(trabajos).keys()].map(tramo))).filter(Boolean);
  await browser.close();

  const lista = path.join(tmp, 'lista.txt');
  fs.writeFileSync(lista, segs.map((s) => "file '" + s + "'").join('\n'));
  const mudo = path.join(tmp, 'mudo.mp4');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-c', 'copy', mudo], { stdio: 'inherit' });

  // ---------- audio: voz del video + efectos (+ musica opcional) ----------
  const sufijo = (o.desde || o.hasta) ? '-' + Math.round(desde) + '-' + Math.round(hasta) : '';
  const fCues = path.join(salida, id + sufijo + '-cues.json');
  const cuesTramo = cues.filter((c) => c.t >= desde && c.t < hasta).map((c) => Object.assign({}, c, { t: c.t - desde }));
  fs.writeFileSync(fCues, JSON.stringify(cuesTramo, null, 1));
  const voz = path.join(tmp, 'voz.wav');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', String(desde), '-t', String(hasta - desde), '-i', fuente,
    '-vn', '-ac', '2', '-ar', '48000', '-c:a', 'pcm_s16le', voz], { stdio: 'inherit' });
  const mezcla = path.join(tmp, 'mezcla.wav');
  const args = [path.join(raiz, 'herramientas', 'audio.py'), '--dur', String(hasta - desde), '--cues', fCues,
    '--out', mezcla, '--base', voz, '--nivel-efectos', String(o['nivel-efectos'] || -6),
    // Reels, TikTok y Shorts no suben el volumen de lo que llega bajo: la voz va a ~-14 LUFS
    '--nivel-voz', String(o['nivel-voz'] || -14.5)];
  if (o['musica-wav']) args.push('--musica', String(o['musica-wav']));
  else if (!o.musica) args.push('--sin-musica');
  execFileSync('python3', args, { stdio: 'inherit' });

  const final = path.join(salida, id + sufijo + '.mp4');
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', mudo, '-i', mezcla, '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', final], { stdio: 'inherit' });

  const tr = leerTranscripcion(id);
  if (tr && !sufijo) fs.writeFileSync(path.join(salida, id + '.srt'), srt(tr));
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('listo:', final, '·', (hasta - desde).toFixed(1), 's ·', cuesTramo.length, 'efectos ·',
    Math.round((Date.now() - t0) / 1000), 's');
})().catch((e) => { console.error(e); process.exit(1); });
