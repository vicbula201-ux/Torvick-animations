/* ============================================================
   stickers.js — arma largos/stickers.js con los emojis que usan los planes

       node herramientas/stickers.js            (regenera largos/stickers.js)
       node herramientas/stickers.js buscar gym (lista nombres que contienen "gym")

   Los stickers son Fluent Emoji de Microsoft (estilo "Color", SVG, licencia MIT).
   El juego completo pesa ~100 MB, asi que al repo va solo lo que se usa: se
   juntan todas las cadenas de largo.jsx y de los .jsx de largos/ que coinciden con un
   nombre de emoji ('brain', 'fire', 'mobile-phone', ...).

   La primera vez baja el paquete @iconify-json/fluent-emoji de npm a
   ~/.torvick/fluent-emoji (o TORVICK_FLUENT=<carpeta con icons.json>).
   ============================================================ */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const VERSION = '1.2.7';
const TARBALL = 'https://registry.npmjs.org/@iconify-json/fluent-emoji/-/fluent-emoji-' + VERSION + '.tgz';
const raiz = path.resolve(__dirname, '..');

async function iconos() {
  const dir = process.env.TORVICK_FLUENT || path.join(os.homedir(), '.torvick', 'fluent-emoji');
  const json = path.join(dir, 'icons.json');
  if (!fs.existsSync(json)) {
    fs.mkdirSync(dir, { recursive: true });
    process.stdout.write('bajando Fluent Emoji ' + VERSION + ' de npm… ');
    const r = await fetch(TARBALL);
    if (!r.ok) throw new Error('no se pudo bajar: HTTP ' + r.status);
    const tgz = path.join(dir, 'fluent.tgz');
    fs.writeFileSync(tgz, Buffer.from(await r.arrayBuffer()));
    execFileSync('tar', ['xzf', tgz, '-C', dir, '--strip-components=1', 'package/icons.json']);
    fs.unlinkSync(tgz);
    console.log('listo');
  }
  return JSON.parse(fs.readFileSync(json, 'utf8')).icons;
}

function fuentes() {
  const out = [path.join(raiz, 'largo.jsx'), path.join(raiz, 'largo-plantillas.jsx')];
  const base = path.join(raiz, 'largos');
  const rec = (d) => {
    if (!fs.existsSync(d)) return;
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) { if (f !== 'media') rec(p); } else if (f.endsWith('.jsx')) out.push(p);
    }
  };
  rec(base);
  return out;
}

(async () => {
  const ic = await iconos();
  const [orden, que] = process.argv.slice(2);
  if (orden === 'buscar') {
    const q = String(que || '').toLowerCase();
    Object.keys(ic).filter((n) => n.includes(q)).sort().forEach((n) => console.log(n));
    return;
  }
  const usados = new Set();
  for (const f of fuentes()) {
    const src = fs.readFileSync(f, 'utf8');
    for (const m of src.matchAll(/['"]([a-z0-9]+(?:-[a-z0-9]+)*)['"]/g)) if (ic[m[1]]) usados.add(m[1]);
  }
  const nombres = [...usados].sort();
  const datos = {};
  for (const n of nombres) datos[n] = ic[n].body;
  const destino = path.join(raiz, 'largos', 'stickers.js');
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino,
    '/* GENERADO por herramientas/stickers.js — no editar a mano.\n' +
    '   Fluent Emoji (c) Microsoft Corporation, licencia MIT: https://github.com/microsoft/fluentui-emoji */\n' +
    'window.STICKERS = ' + JSON.stringify(datos) + ';\n');
  console.log(nombres.length + ' stickers -> ' + path.relative(raiz, destino) + '  (' +
    Math.round(fs.statSync(destino).size / 1024) + ' KB)');
})().catch((e) => { console.error('falló:', e.message); process.exit(1); });
