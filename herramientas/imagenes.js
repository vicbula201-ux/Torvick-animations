/* ============================================================
   imagenes.js — exporta a PNG las imagenes de identidad.html
   (foto de perfil, portadas de destacadas y la vista previa)

       node herramientas/imagenes.js [carpeta-salida]     # por defecto ./identidad

   Necesita Node y Playwright. Si el CDN de React no esta disponible,
   TORVICK_VENDOR=<carpeta> con react.production.min.js y
   react-dom.production.min.js los sirve en local (igual que grabar.js).
   ============================================================ */
'use strict';

const path = require('path');
const fs = require('fs');

function cargarPlaywright() {
  const rutas = ['playwright', '/opt/node22/lib/node_modules/playwright'];
  for (const r of rutas) { try { return require(r); } catch (e) { /* sigue */ } }
  throw new Error('No encuentro Playwright: npm i -g playwright');
}

(async () => {
  const raiz = path.resolve(__dirname, '..');
  const salida = path.resolve(process.argv[2] || path.join(raiz, 'identidad'));
  fs.mkdirSync(salida, { recursive: true });

  const { chromium } = cargarPlaywright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 1 });
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
  await p.goto('file://' + path.join(raiz, 'identidad.html') + '#exportar');
  await p.waitForSelector('[data-png]', { timeout: 60000 });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const nombres = await p.$$eval('[data-png]', els => els.map(e => e.getAttribute('data-png')));
  for (const n of nombres) {
    const el = await p.$('[data-png="' + n + '"] > *');
    await el.screenshot({ path: path.join(salida, n + '.png') });
    console.log('listo:', n + '.png');
  }
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
