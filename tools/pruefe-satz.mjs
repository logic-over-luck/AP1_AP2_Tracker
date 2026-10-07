#!/usr/bin/env node
// Prüft Prüfungssätze (src/bereiche/pruefung/saetze/…) auf Vollständigkeit und Punkte.
// Aufruf: node tools/pruefe-satz.mjs [datei.js …]   (ohne Datei: alle Sätze)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pruefeSatz, TEILE } from '../src/bereiche/pruefung/generator.js';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inhalt = JSON.parse(fs.readFileSync(path.join(wurzel, 'Inhaltsdatei_AP1_AP2_tracker.json'), 'utf8'));
const spIds = new Set(inhalt.stichpunkte.map((s) => s.id));

let dateien = process.argv.slice(2);
if (!dateien.length) {
  const basis = path.join(wurzel, 'src/bereiche/pruefung/saetze');
  dateien = fs
    .readdirSync(basis, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => fs.readdirSync(path.join(basis, d.name)).filter((f) => f.endsWith('.js')).map((f) => path.join(basis, d.name, f)));
}

let fehlerGesamt = 0;
for (const datei of dateien) {
  const satz = (await import(pathToFileURL(path.resolve(datei)).href)).default;
  const raumVon = { AP1: 'AP1', PB1: 'AP2', PB2: 'AP2', WISO: 'WISO' }[satz?.teil];
  const fehler = satz ? pruefeSatz(satz, (id) => spIds.has(id) && id.startsWith(raumVon === 'WISO' ? 'WISO' : raumVon)) : ['kein export default'];
  const teil = TEILE[satz?.teil];
  let info = '';
  if (satz?.aufgaben) info = satz.aufgaben.map((a) => `${a.art} ${a.punkte}`).join(' · ');
  if (satz?.fragen) {
    const arten = {};
    for (const q of satz.fragen) arten[q.art] = (arten[q.art] ?? 0) + 1;
    info = Object.entries(arten).map(([k, v]) => `${k} ${v}`).join(' · ');
  }
  console.log(`${fehler.length ? '✗' : '✓'} ${path.relative(wurzel, path.resolve(datei))} (${teil?.kurz ?? '?'}): ${info}`);
  for (const f of fehler) console.log('   ', f);
  fehlerGesamt += fehler.length;
}
process.exitCode = fehlerGesamt ? 1 : 0;
