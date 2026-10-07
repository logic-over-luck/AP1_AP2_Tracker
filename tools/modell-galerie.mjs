#!/usr/bin/env node
// Zeigt alle Aufgaben eines Modellieren-Modus mit Lösung und fotografiert jede einzeln.
// Aufruf: node tools/modell-galerie.mjs <modus> [ap1|ap2] [zielordner]
// Zum Durchsehen der Diagramme (Überlappungen, abgeschnittene Texte, falsche Pfeile).

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let playwright;
try {
  playwright = await import('playwright');
} catch {
  playwright = createRequire('/opt/node22/lib/node_modules/')('playwright');
}
const [modus, raum = 'ap2', ziel = path.join(wurzel, 'build', 'galerie')] = process.argv.slice(2);
if (!modus) {
  console.log('Aufruf: node tools/modell-galerie.mjs <modus> [ap1|ap2] [zielordner]');
  process.exit(1);
}
fs.mkdirSync(ziel, { recursive: true });
const browser = await playwright.chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const fehler = [];
page.on('console', (m) => m.type() === 'error' && fehler.push(m.text()));
page.on('pageerror', (e) => fehler.push(e.message));
await page.goto(pathToFileURL(path.join(wurzel, 'Lernstudio.html')).href + `#/${raum}/trainer/modellieren?modus=${modus}&galerie=1`);
await page.waitForSelector('.modell--galerie', { timeout: 10000 });
await page.addStyleTag({ content: '.kopf { display: none !important; }' });
await page.waitForTimeout(300);
const teile = await page.$$('.modell--galerie > section');
let i = 0;
for (const t of teile) {
  const id = (await t.getAttribute('data-aufgabe')) ?? 'notation';
  const datei = path.join(ziel, `${modus}-${String(++i).padStart(2, '0')}-${id}.png`);
  await t.screenshot({ path: datei });
  console.log(datei);
}
await browser.close();
if (fehler.length) {
  console.log('Fehler:\n' + fehler.join('\n'));
  process.exitCode = 1;
}
