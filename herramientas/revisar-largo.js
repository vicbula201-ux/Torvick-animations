/* ============================================================
   revisar-largo.js — revisa un plan antes de grabar

       node herramientas/revisar-largo.js <id>

   Abre largo.html#<id>/render y avisa de:
     - frases del plan que no aparecen en la transcripcion (t('...') no las halla)
     - iconos que no estan en LARGOS.I (largo-iconos.jsx)
     - escenas a pantalla completa que se pisan
     - si existe largos/<id>/fuente-tramos.json (video que ya traia edicion):
       insertos viejos que ninguna escena tapa ni estan marcados con p.mantener
   Sale con codigo 1 si encuentra algo.
   ============================================================ */
'use strict';

const path = require('path');
const fs = require('fs');

function cargarPlaywright() {
  const rutas = ['playwright', '/opt/node22/lib/node_modules/playwright'];
  for (const r of rutas) { try { return require(r); } catch (e) { /* sigue */ } }
  throw new Error('No encuentro Playwright: npm i -g playwright');
}

const VENTANA = { latigo: 0.2, barrido: 0.26, zoom: 0.22, fundido: 0.16, pop: 0, corte: 0 };

(async () => {
  const id = process.argv[2];
  if (!id) { console.error('uso: node herramientas/revisar-largo.js <id>'); process.exit(1); }
  const raiz = path.resolve(__dirname, '..');
  const { chromium } = cargarPlaywright();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const avisos = [];
  p.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') avisos.push(m.text()); });
  p.on('pageerror', (e) => avisos.push('error: ' + e.message));
  const vendor = process.env.TORVICK_VENDOR;
  if (vendor) {
    await p.route('**/*', (r) => {
      const u = r.request().url();
      for (const f of ['react.production.min.js', 'react-dom.production.min.js']) {
        if (u.endsWith(f)) return r.fulfill({ body: fs.readFileSync(path.join(vendor, f)), contentType: 'application/javascript' });
      }
      return r.continue();
    });
  }
  await p.goto('file://' + path.join(raiz, 'largo.html') + '#' + id + '/render');
  await p.waitForFunction(() => window.LARGO, null, { timeout: 60000 });
  await p.evaluate(() => window.LARGO.recolectar());
  // recorre el video entero para que cada escena se dibuje (y avise iconos que faltan)
  await p.evaluate(async () => {
    for (let t = 0; t < window.LARGO.total; t += 0.5) { await window.LARGO.seek(t); }
  });
  const tr = await p.evaluate(() => window.LARGO.tramos());
  await b.close();

  let problemas = 0;
  const unicos = [...new Set(avisos)];
  unicos.forEach((a) => { console.log('AVISO', a); problemas++; });

  // escenas que se pisan (mas alla de sus transiciones)
  const pan = tr.pantallas.map(([a, z, en, sa, tipo]) => ({ a, z, en, sa, dividida: tipo === 'dividida' })).sort((x, y) => x.a - y.a);
  for (let i = 1; i < pan.length; i++) {
    if (pan[i].a < pan[i - 1].z - 0.02) {
      console.log('PISA  escena %s-%s con %s-%s', pan[i - 1].a.toFixed(2), pan[i - 1].z.toFixed(2), pan[i].a.toFixed(2), pan[i].z.toFixed(2));
      problemas++;
    }
  }

  // insertos viejos sin tapar
  const fTramos = path.join(raiz, 'largos', id, 'fuente-tramos.json');
  if (fs.existsSync(fTramos)) {
    const tramos = JSON.parse(fs.readFileSync(fTramos, 'utf8'));
    // tiempo en que cada escena tapa del todo: despues de su entrada y antes de su salida
    // las divididas NO tapan: la camara se sigue viendo en su tarjeta
    const tapa = pan.filter((s) => !s.dividida).map((s) => [s.a + (VENTANA[s.en] || 0), s.z - (VENTANA[s.sa] || 0)]);
    pan.filter((s) => s.dividida).forEach((s) => {
      const pisa = tramos.filter((x) => x[0] !== 'C' && x[1] < s.z + 0.3 && x[2] > s.a - 0.3);
      if (pisa.length) { console.log('DIVIDIDA %s-%s muestra un inserto viejo en su tarjeta (%s-%s)', s.a.toFixed(2), s.z.toFixed(2), pisa[0][1], pisa[0][2]); problemas++; }
    });
    const libres = tapa.concat(tr.mantener);
    const cubierto = (t) => libres.some(([a, z]) => t >= a - 0.001 && t <= z + 0.001);
    let sinTapar = 0;
    tramos.filter((x) => x[0] !== 'C').forEach(([c, a, z]) => {
      const huecos = [];
      for (let t = a + 0.05; t < z - 0.05; t += 0.05) if (!cubierto(t)) huecos.push(t);
      if (huecos.length) {
        sinTapar += huecos.length * 0.05;
        console.log('SIN TAPAR  %s %s-%s  (%s s sin cubrir, desde %s)', c, a.toFixed(2), z.toFixed(2),
          (huecos.length * 0.05).toFixed(2), huecos[0].toFixed(2));
        problemas++;
      }
    });
    console.log('insertos viejos sin tapar: %s s', sinTapar.toFixed(2));
  }
  console.log(problemas ? problemas + ' problemas' : 'todo bien', '·', pan.length, 'escenas ·', tr.mantener.length, 'tramos conservados');
  process.exit(problemas ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
