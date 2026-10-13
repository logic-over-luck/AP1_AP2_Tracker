// Prüft den Prüfer: Wird ein absichtlich eingebauter Fehler in den Katalog-Bausteinen erkannt?
// Läuft nur, wenn die Katalogquelle lokal vorliegt (quellen/ ist nicht im Repo).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const QUELLE = 'quellen/katalog.md';
const BAUSTEINE = 'umbau/fundament/katalog-bausteine.json';
const vorhanden = existsSync(QUELLE) && existsSync(BAUSTEINE);

function pruefeMit(veraendern) {
  const b = JSON.parse(readFileSync(BAUSTEINE, 'utf8'));
  veraendern(b);
  const datei = join(mkdtempSync(join(tmpdir(), 'fundament-')), 'b.json');
  writeFileSync(datei, JSON.stringify(b));
  return spawnSync(process.execPath, ['tools/umbau/fundament-pruefen.mjs', QUELLE, datei], { encoding: 'utf8' });
}

test('unverändertes Fundament besteht', { skip: !vorhanden && 'Katalogquelle fehlt' }, () => {
  const r = pruefeMit(() => {});
  assert.equal(r.status, 0, r.stdout);
});

const fehlerfaelle = {
  'fehlender Spiegelstrich': (b) => { b.spiegelstriche.splice(100, 1); },
  'erfundener Spiegelstrich': (b) => { b.spiegelstriche.push({ ...b.spiegelstriche[0], id: 'AP1.01.01.99', text: 'IPv6-Subnetting' }); },
  'veränderter Wortlaut': (b) => { b.spiegelstriche[5].text += ' (vereinfacht)'; },
  'fehlender Katalogpunkt': (b) => { b.punkte.splice(10, 1); },
  'doppelte ID': (b) => { b.spiegelstriche[1].id = b.spiegelstriche[0].id; },
  'kaputter Verweis': (b) => { b.spiegelstriche[0].punkt = 'AP1.99.99'; },
  'fehlendes Gebiet': (b) => { b.pruefungsbereiche[1].gebiete.pop(); },
};

for (const [name, veraendern] of Object.entries(fehlerfaelle)) {
  test(`erkennt: ${name}`, { skip: !vorhanden && 'Katalogquelle fehlt' }, () => {
    const r = pruefeMit(veraendern);
    assert.equal(r.status, 1, `Fehler „${name}" wurde nicht erkannt:\n${r.stdout}`);
  });
}
