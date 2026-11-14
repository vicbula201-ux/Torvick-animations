#!/usr/bin/env node
/* ============================================================
   Exporta un e-book (HTML con hojas A4) a PDF con Chromium.
   uso:
     node herramientas/ebook.js ebooks/7-errores.html             -> ebooks/pdf/7-errores.pdf
     node herramientas/ebook.js ebooks/7-errores.html salida.pdf
     node herramientas/ebook.js ebooks/7-errores.html --hojas dir  (ademas, un PNG por hoja)
   Necesita Node y Playwright (como grabar.js). Las fuentes salen de Google
   Fonts: la primera vez hace falta internet.
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
  const iH = args.indexOf('--hojas');
  const dirHojas = iH >= 0 ? path.resolve(args.splice(iH, 2)[1]) : null;
  const [entrada, salidaArg] = args;
  if (!entrada) { console.error('uso: node herramientas/ebook.js <archivo.html> [salida.pdf] [--hojas carpeta]'); process.exit(1); }
  const html = path.resolve(entrada);
  // los e-books pagos viven en ebooks/privado/ (fuera de git); el PDF va igual a ebooks/pdf/
  const base = path.basename(path.dirname(html)) === 'privado' ? path.dirname(path.dirname(html)) : path.dirname(html);
  const salida = path.resolve(salidaArg || path.join(base, 'pdf', path.basename(html, '.html') + '.pdf'));
  fs.mkdirSync(path.dirname(salida), { recursive: true });

  const { chromium } = cargarPlaywright();
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const b = await chromium.launch(proxy ? { proxy: { server: proxy } } : {});
  const p = await b.newPage({ viewport: { width: 900, height: 1200 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => console.log('error en la pagina:', e.message));
  p.on('requestfailed', r => { if (!/fonts\.(googleapis|gstatic)/.test(r.url())) console.log('no cargo:', r.url()); });
  await p.goto('file://' + html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  const fuentes = await p.evaluate(() => ['Archivo Black', 'Barlow Semi Condensed'].map(f => f + ': ' + (document.fonts.check('16px "' + f + '"') ? 'ok' : 'NO CARGO')));
  console.log(fuentes.join(' · '));
  const hojas = await p.evaluate(() => document.querySelectorAll('.pagina').length);

  // aviso si algo se pasa del borde de abajo de su hoja (o se mete en el pie)
  const desbordes = await p.evaluate(() => Array.from(document.querySelectorAll('.pagina')).map((h, i) => {
    if (h.classList.contains('portada')) return 0;
    const r = h.getBoundingClientRect();
    const fuera = Array.from(h.querySelectorAll('*')).filter(el => {
      if (el.closest('.pie') || el.closest('.cabeza')) return false;
      const q = el.getBoundingClientRect();
      return q.height > 0 && q.bottom > r.bottom - 60;
    });
    return fuera.length ? i + 1 : 0;
  }).filter(Boolean));
  if (desbordes.length) console.log('ojo: contenido pegado al pie o fuera de la hoja en', desbordes.join(', '));

  if (dirHojas) {
    fs.mkdirSync(dirHojas, { recursive: true });
    const els = await p.$$('.pagina');
    for (let i = 0; i < els.length; i++) {
      await els[i].screenshot({ path: path.join(dirHojas, 'hoja-' + String(i + 1).padStart(2, '0') + '.png') });
    }
  }
  await p.pdf({ path: salida, format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await b.close();
  console.log('listo:', salida, '·', hojas, 'hojas');
})();
