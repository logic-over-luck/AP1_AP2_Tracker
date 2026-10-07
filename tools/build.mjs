#!/usr/bin/env node
// Baut Lernstudio.html: eine einzige Datei mit Code, Inhalten, Schriften, Symbolen und SQL-Engine.
// Aufruf: node tools/build.mjs [--watch] [--dev]
//
// Warum eine Datei? Die App wird per Doppelklick als file:// geöffnet. Browser laden dort
// weder JSON-Dateien noch JavaScript-Module nach, und WebAssembly lässt sich nicht per fetch
// holen. Deshalb steckt alles inline in der HTML-Datei.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { ladeDaten } from './daten.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argumente = new Set(process.argv.slice(2));
const dev = argumente.has('--dev') || argumente.has('--watch');
// LERNSTUDIO_AUS=build/x.html baut in eine andere Datei (z. B. wenn mehrere gleichzeitig bauen)
const ziel = process.env.LERNSTUDIO_AUS ? path.resolve(wurzel, process.env.LERNSTUDIO_AUS) : path.join(wurzel, 'Lernstudio.html');

function iconPlugin() {
  return {
    name: 'icons',
    setup(build) {
      build.onResolve({ filter: /^virtual:icons$/ }, () => ({ path: 'icons', namespace: 'virtual' }));
      build.onResolve({ filter: /^virtual:daten$/ }, () => ({ path: 'daten', namespace: 'virtual' }));
      build.onLoad({ filter: /.*/, namespace: 'virtual' }, (args) => {
        if (args.path === 'icons') {
          const namen = JSON.parse(fs.readFileSync(path.join(wurzel, 'src/ui/icon-namen.json'), 'utf8'));
          const alle = JSON.parse(fs.readFileSync(path.join(wurzel, 'node_modules/lucide-static/icon-nodes.json'), 'utf8'));
          const auswahl = {};
          for (const n of namen) {
            if (!alle[n]) throw new Error(`Symbol "${n}" gibt es in Lucide nicht`);
            auswahl[n] = alle[n];
          }
          return { contents: `export default ${JSON.stringify(auswahl)};`, loader: 'js' };
        }
        const daten = ladeDaten(wurzel);
        // JSON.parse ist für große Daten schneller als ein Objektliteral.
        return { contents: `export default JSON.parse(${JSON.stringify(JSON.stringify(daten))});`, loader: 'js' };
      });
    },
  };
}

async function baue() {
  const start = Date.now();
  const js = await esbuild.build({
    entryPoints: [path.join(wurzel, 'src/main.jsx')],
    bundle: true,
    write: false,
    format: 'iife',
    target: ['chrome110', 'firefox115', 'safari16'],
    minify: !dev,
    sourcemap: dev ? 'inline' : false,
    jsx: 'automatic',
    jsxImportSource: 'preact',
    define: { 'process.env.NODE_ENV': dev ? '"development"' : '"production"' },
    plugins: [iconPlugin()],
    logLevel: 'silent',
    // sql.js enthält einen Node-Zweig, der im Browser nie läuft.
    external: ['fs', 'path', 'crypto'],
  });
  const css = await esbuild.build({
    entryPoints: [path.join(wurzel, 'src/styles/index.css')],
    bundle: true,
    write: false,
    minify: !dev,
    loader: { '.woff2': 'dataurl' },
    logLevel: 'silent',
  });
  const wasm = fs.readFileSync(path.join(wurzel, 'node_modules/sql.js/dist/sql-wasm-browser.wasm')).toString('base64');
  const favicon = fs.readFileSync(path.join(wurzel, 'src/favicon.svg'), 'utf8');

  const jsText = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const cssText = css.outputFiles[0].text.replace(/<\/style/gi, '<\\/style');
  const html = `<!doctype html>
<html lang="de" data-raum="AP1">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Lernstudio · Fachinformatik</title>
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(favicon)}">
<style>${cssText}</style>
</head>
<body>
<div id="app"><div class="lade-hinweis">Lernstudio wird geladen …</div></div>
<noscript><p class="lade-hinweis">Das Lernstudio braucht JavaScript. Bitte im Browser erlauben.</p></noscript>
<script type="application/octet-stream" id="sqljs-wasm">${wasm}</script>
<script>${jsText}</script>
</body>
</html>
`;
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  fs.writeFileSync(ziel, html);
  const kb = (fs.statSync(ziel).size / 1024).toFixed(0);
  console.log(`${path.relative(wurzel, ziel)} gebaut (${kb} KB, ${Date.now() - start} ms${dev ? ', Entwicklungsmodus' : ''})`);
}

try {
  await baue();
} catch (e) {
  console.error(e.errors ? e.errors.map((f) => `${f.location?.file}:${f.location?.line} ${f.text}`).join('\n') : e);
  if (!argumente.has('--watch')) process.exit(1);
}

if (argumente.has('--watch')) {
  let timer = null;
  const neu = () => {
    clearTimeout(timer);
    timer = setTimeout(() => baue().catch((e) => console.error(e.message)), 120);
  };
  for (const d of ['src', 'inhalte']) fs.watch(path.join(wurzel, d), { recursive: true }, neu);
  console.log('Beobachte src/ und inhalte/ …');
}
