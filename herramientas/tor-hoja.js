#!/usr/bin/env node
/* ============================================================
   Exporta la hoja de modelo de Tor (tor-hoja.html) a PNG de 1920x1080,
   una por acabado:  node herramientas/tor-hoja.js [plano cel arcilla] [--short caqui]
   Deja identidad/tor-hoja-<acabado>[-<short>].png. Necesita Node y Playwright.
   Con TORVICK_VENDOR=<carpeta> usa las copias locales de React y three.js
   (como grabar.js) en vez del CDN.
   ============================================================ */
const fs = require('fs'), path = require('path');
function cargarPlaywright() {
  try { return require('playwright'); } catch (e) {}
  for (const p of ['/opt/node22/lib/node_modules/playwright', '/usr/local/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) {
    try { return require(p); } catch (e) {}
  }
  console.error('Falta Playwright: npm i -g playwright && npx playwright install chromium');
  process.exit(1);
}
(async () => {
  const args = process.argv.slice(2);
  const iS = args.indexOf('--short');
  const short = iS >= 0 ? args.splice(iS, 2)[1] : 'gris';
  const acabados = args.length ? args : ['plano', 'cel', 'arcilla'];
  const raiz = path.resolve(__dirname, '..');
  const salida = path.join(raiz, 'identidad');
  fs.mkdirSync(salida, { recursive: true });
  const { chromium } = cargarPlaywright();
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const b = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
  const vendor = process.env.TORVICK_VENDOR;
  for (const a of acabados) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    p.on('pageerror', e => console.log('error en la pagina:', e.message));
    if (vendor) await p.route(/cdnjs\.cloudflare\.com/, r => {
      const f = path.join(vendor, path.basename(new URL(r.request().url()).pathname));
      return fs.existsSync(f) ? r.fulfill({ path: f, contentType: 'application/javascript' }) : r.continue();
    });
    await p.goto('file://' + path.join(raiz, 'tor-hoja.html') + '?acabado=' + a + '&short=' + short, { waitUntil: 'networkidle' });
    await p.waitForFunction(() => window.HOJA_LISTA, null, { timeout: 120000 });
    await p.evaluate(() => document.fonts.ready);
    const archivo = path.join(salida, 'tor-hoja-' + a + (short !== 'gris' ? '-' + short : '') + '.png');
    await p.screenshot({ path: archivo, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    console.log('listo:', archivo);
    await p.close();
  }
  await b.close();
})();
