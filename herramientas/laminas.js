#!/usr/bin/env node
/* ============================================================
   Laminas para los e-books: saca la figura de un ejercicio de su reel
   (solo el cuerpo y su maquina, sin rotulos, X ni vistos) como PNG
   transparente, al doble de resolucion.
   uso:
     node herramientas/laminas.js <carpeta> id:Escena:fraccion[:nombre] ...
     node herramientas/laminas.js ebooks/img peso-muerto:Cierre:0.8 "peso-muerto:Error 1:0.3:pm-mal"
   La fraccion es el momento dentro de esa escena (0..1). En el final de una
   escena (0.95+) ya entra la transicion a la siguiente: usar 0.3 a 0.85.
   Sin internet: TORVICK_VENDOR=<carpeta con react y react-dom> (como grabar.js).
   Despues conviene achicarlas (los e-books las usan a ~110 px).
   ============================================================ */
const fs = require('fs'), path = require('path');
let pw;
try { pw = require('playwright'); } catch (e) { pw = require('/opt/node22/lib/node_modules/playwright'); }
const { chromium } = pw;
const RAIZ = path.join(__dirname, '..');
const VENDOR = process.env.TORVICK_VENDOR || '';

(async () => {
  const [out, ...specs] = process.argv.slice(2);
  if (!out || !specs.length) { console.error('uso: node herramientas/laminas.js <carpeta> id:Escena:fraccion[:nombre] ...'); process.exit(1); }
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => console.log('error en la pagina:', e.message));
  if (VENDOR) {
    await p.route('**/*', r => {
      const u = r.request().url();
      for (const f of ['react.production.min.js', 'react-dom.production.min.js']) {
        if (u.endsWith(f)) return r.fulfill({ body: fs.readFileSync(path.join(VENDOR, f)), contentType: 'application/javascript' });
      }
      return r.continue();
    });
  }
  for (const spec of specs) {
    const [id, escena, frac, nombre] = spec.split(':');
    await p.goto('about:blank');
    await p.goto('file://' + path.join(RAIZ, 'reels.html') + '#' + id + '/render');
    await p.waitForFunction(() => window.REEL, null, { timeout: 60000 });
    await p.evaluate(() => window.REEL.setPlaying(false));
    const t = await p.evaluate(([escena, frac]) => {
      let at = 0;
      for (const e of window.REEL.guion) {
        if (e.nombre === escena) return at + e.dur * +frac;
        at += e.dur;
      }
      return null;
    }, [escena, frac]);
    if (t == null) {
      console.log('no esta la escena', escena, 'en', id, '->', await p.evaluate(() => window.REEL.guion.map(e => e.nombre).join(', ')));
      continue;
    }
    await p.evaluate((t) => window.REEL.seek(t), t);
    await p.waitForTimeout(350);
    // la figura es el SVG con mas elementos; todo lo demas se esconde
    const clip = await p.evaluate(() => {
      const svgs = Array.from(document.querySelectorAll('svg')).filter(s => !s.parentElement.closest('svg'));
      let mejor = null, n = -1;
      svgs.forEach(s => { const k = s.querySelectorAll('*').length; if (k > n) { n = k; mejor = s; } });
      document.body.style.visibility = 'hidden';
      mejor.style.visibility = 'visible';
      document.documentElement.style.background = 'transparent';
      document.body.style.background = 'transparent';
      const bb = mejor.getBBox(), m = mejor.getScreenCTM();
      const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y], [bb.x, bb.y + bb.height], [bb.x + bb.width, bb.y + bb.height]]
        .map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
      const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]), pad = 12;
      const x0 = Math.max(0, Math.min(...xs) - pad), y0 = Math.max(0, Math.min(...ys) - pad);
      const x1 = Math.min(1080, Math.max(...xs) + pad), y1 = Math.min(1920, Math.max(...ys) + pad);
      return { x: x0, y: y0, width: x1 - x0, height: y1 - y0, n };
    });
    const archivo = path.join(out, (nombre || id) + '.png');
    await p.screenshot({ path: archivo, clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height }, omitBackground: true });
    console.log(nombre || id, Math.round(clip.width) + 'x' + Math.round(clip.height), 't ' + t.toFixed(2) + ' s');
  }
  await b.close();
})();
