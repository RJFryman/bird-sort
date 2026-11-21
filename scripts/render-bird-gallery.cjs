// Renders the actual bird-family components to an offline SVG contact sheet for art review.
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const babel = require('@babel/core');
const root = path.resolve(__dirname, '..');
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (module, filename) => {
  const { code } = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    filename, configFile: false, babelrc: false,
    presets: ['@babel/preset-typescript'],
    plugins: ['@babel/plugin-transform-react-jsx', '@babel/plugin-transform-modules-commonjs'],
  });
  module._compile(code, filename);
};
const load = Module._load;
Module._load = function (id, ...args) {
  if (id === 'react-native-svg') return new Proxy({}, { get: (_, key) => {
    if (key === '__esModule') return true;
    return key === 'default' ? 'svg' : key[0].toLowerCase() + key.slice(1);
  } });
  return load.call(this, id, ...args);
};
const { COLLECTIONS } = require(path.join(root, 'roster.ts'));
const collection = process.argv.includes('--fish') ? 'fish' : 'birds';
const roster = COLLECTIONS[collection];
const { FishArt } = require(path.join(root, 'FishArt.tsx'));
const { ParrotArt } = require(path.join(root, 'ParrotArt.tsx'));
const { SongbirdArt } = require(path.join(root, 'SongbirdArt.tsx'));
const { WildBirdArt } = require(path.join(root, 'WildBirdArt.tsx'));
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const svgs = roster.map(bird => {
  const art = collection === 'fish' ? FishArt({ fish: bird }) : ParrotArt({ bird }) ?? SongbirdArt({ bird }) ?? WildBirdArt({ bird });
  if (!art) throw Error(`Missing artwork: ${bird.name}`);
  const svg = renderToStaticMarkup(React.createElement('svg', {
    xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 96 96', width: 96, height: 96,
    role: 'img', 'aria-label': bird.name,
  }, art));
  return { name: bird.name, svg };
});
const cards = svgs.map(({name, svg}, i) => `<article><div class="art">${svg}<span class="small">${svg.replace('width="96" height="96"', 'width="48" height="56"')}</span></div><p><small>${i}</small> ${escape(name)}</p></article>`).join('');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bird Sort · Species artwork</title><style>*{box-sizing:border-box}body{margin:0;padding:28px;background:#edf5ef;color:#233c3b;font:15px system-ui}h1{font-size:28px;margin:0 0 8px}header{margin-bottom:24px}header p{max-width:760px;line-height:1.5}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(176px,1fr));gap:12px}article{background:#fffdf6;border:1px solid #d5e2d7;border-radius:16px;padding:12px}.art{height:116px;display:flex;align-items:center;justify-content:center;gap:8px}.small{display:flex;background:#cfebf3;border-radius:8px;padding:6px}article p{margin:7px 0 0;font-weight:600}small{color:#718b83;font-size:11px;font-weight:400}svg{overflow:hidden}</style><header><h1>${collection === 'fish' ? 'Fish' : 'Bird'} Sort · ${roster.length} species</h1><p>Actual illustration components at 96px and game size (48 × 56px). Numeric roster positions are preserved for existing saves. This sheet checks artwork; animation and the game interface require the real app.</p></header><main>${cards}</main></html>`;
const output = path.resolve(process.argv[2] || '/tmp/bird-sort-art/gallery.html');
fs.mkdirSync(path.dirname(output), {recursive:true});
fs.writeFileSync(output, html);
svgs.forEach(({name, svg}, i) => fs.writeFileSync(path.join(path.dirname(output), `${String(i).padStart(2,'0')}.svg`), svg));
console.log(`Rendered ${svgs.length} ${collection}: ${output}`);
