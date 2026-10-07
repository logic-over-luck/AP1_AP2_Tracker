#!/usr/bin/env node
// Öffnet Lernstudio.html wirklich als file:// in Chromium, sammelt Fehler aus der Konsole
// und macht Bildschirmfotos.
//
// Aufruf: node tools/browser-check.mjs [--skript datei.mjs] [route ...]
//   route z. B.  #/ap1  #/ap1/lernen  #/ap2/trainer/sql
//   --skript: Modul mit export default async (page, hilfen) => {...} für Klickabläufe
// Fotos landen in build/fotos/ (oder FOTOS=pfad).

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let playwright;
try {
  playwright = await import('playwright');
} catch {
  const require = createRequire('/opt/node22/lib/node_modules/');
  playwright = require('playwright');
}

const args = process.argv.slice(2);
let skript = null;
const routen = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--skript') skript = args[++i];
  else routen.push(args[i]);
}
if (!routen.length && !skript) routen.push('#/ap1');

const fotos = process.env.FOTOS ?? path.join(wurzel, 'build', 'fotos');
fs.mkdirSync(fotos, { recursive: true });
const datei = pathToFileURL(path.join(wurzel, 'Lernstudio.html')).href;

const browser = await playwright.chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? undefined : undefined });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const meldungen = [];
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') meldungen.push(`[${m.type()}] ${m.text()}`);
});
page.on('pageerror', (e) => meldungen.push(`[pageerror] ${e.message}`));
page.on('requestfailed', (r) => meldungen.push(`[request] ${r.url().slice(0, 120)} ${r.failure()?.errorText}`));

let nr = 0;
const foto = async (name, ganz = false) => {
  const ziel = path.join(fotos, `${String(++nr).padStart(2, '0')}-${name.replace(/[^a-z0-9-]+/gi, '_')}.png`);
  await page.screenshot({ path: ziel, fullPage: ganz });
  console.log('Foto:', ziel);
  return ziel;
};

await page.goto(datei + '#/ap1');
await page.waitForSelector('.app', { timeout: 10000 });

for (const r of routen) {
  await page.evaluate((h) => (location.hash = h), r);
  await page.waitForTimeout(400);
  await foto(r.replace(/^#\//, ''), process.env.GANZ === '1');
}
if (skript) {
  const mod = await import(pathToFileURL(path.resolve(skript)).href);
  await mod.default(page, { foto, datei, warte: (ms) => page.waitForTimeout(ms) });
}

await browser.close();
if (meldungen.length) {
  console.log('\nKonsole:');
  for (const m of meldungen) console.log(m);
  process.exitCode = 1;
} else console.log('\nKeine Fehler in der Konsole.');
