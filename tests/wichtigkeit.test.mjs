// Tests für die Wichtigkeit je Stichpunkt (src/daten/wichtigkeit.js), mit Hand-Beispielen aus den Zuordnungen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ladeDaten } from '../tools/daten.mjs';
import { vorschauAlle } from '../tools/vorschau-ap1.mjs';
import { baueIndex } from '../src/daten/index.js';
import {
  STUFEN,
  stufeFuer,
  terminName,
  terminVergleich,
  plausiblerBereich,
  wichtigkeitRaum,
  wichtigkeitText,
  reihenfolgeWert,
  blockWert,
  LAMBDA,
} from '../src/daten/wichtigkeit.js';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = baueIndex(vorschauAlle(ladeDaten(wurzel), wurzel));
const RAEUME = ['AP1', 'PB1', 'PB2', 'WISO'];
const spIn = (raum) => index.raeume.get(raum).bloeckeListe.flatMap((b) => b.sp.map((id) => index.sp.get(id)));

test('Stufen: Grenzen 40 / 25 / 12 %, ohne Beleg Stufe 5', () => {
  assert.equal(STUFEN.length, 5);
  assert.equal(stufeFuer(0.4, true), 1);
  assert.equal(stufeFuer(0.399, true), 2);
  assert.equal(stufeFuer(0.25, true), 2);
  assert.equal(stufeFuer(0.12, true), 3);
  assert.equal(stufeFuer(0.119, true), 4);
  assert.equal(stufeFuer(0.01, true), 4);
  assert.equal(stufeFuer(0, false), 5);
  assert.equal(stufeFuer(0.9, false), 5); // ohne Beleg nie höher
});

test('Prüfungstermine: Namen und Reihenfolge', () => {
  assert.equal(terminName('2026H'), 'Herbst 2026');
  assert.equal(terminName('2025F'), 'Frühjahr 2025');
  assert.equal(terminName('2025S'), 'Sommer 2025');
  assert.equal(terminName('2021W'), 'Winter 2021');
  assert.deepEqual(['2026F', '2025H', '2025F', '2021H'].sort(terminVergleich), ['2021H', '2025F', '2025H', '2026F']);
  assert.deepEqual(['2025W', '2025S', '2024W'].sort(terminVergleich), ['2024W', '2025S', '2025W']);
});

test('Plausibler Bereich: Hand-Beispiel 3,2 von 8,2 bei 11 Prüfungen → 2 bis 7', () => {
  // Beta(3,7; 5,5): 10-%-Quantil ≈ 0,205, 90-%-Quantil ≈ 0,610 → × 11 = 2,3 und 6,7
  assert.deepEqual(plausiblerBereich(3.2, 8.2, 11), { von: 2, bis: 7 });
  const nie = plausiblerBereich(0, 8.2, 11);
  assert.equal(nie.von, 0);
  assert.ok(nie.bis >= 1 && nie.bis <= 2, JSON.stringify(nie));
  assert.deepEqual(plausiblerBereich(0, 0, 0), { von: 0, bis: 0 });
});

test('Rechnung an einem kleinen Raum von Hand', () => {
  const { raum, je } = wichtigkeitRaum([
    { id: 'a', pruef: [['2025F', 1], ['2024H', 0.6], ['2024H', 0.6]] }, // doppelte Prüfung zählt einmal
    { id: 'b', pruef: [['2023F', 0.6]] },
    { id: 'c', pruef: [] },
  ]);
  assert.equal(raum.n, 3);
  assert.equal(raum.aktuell, 1);
  assert.equal(Math.round(raum.summe * 10) / 10, 2.2);
  assert.equal(je.get('a').x, 2);
  assert.equal(je.get('a').quote, 1.6 / 2.2);
  assert.equal(je.get('a').stufe, 1);
  assert.equal(je.get('a').zuletzt, '2025F');
  assert.equal(je.get('b').stufe, 2); // 0,6 / 2,2 = 27 %
  assert.equal(je.get('c').stufe, 5);
});

test('Hand-Beispiel AP1: Peripheriegeräte und Anschlüsse', () => {
  const s = spIn('AP1').find((x) => x.titel.startsWith('Peripheriegeräte und Anschlüsse'));
  assert.ok(s);
  // 2022F, 2024F (alter Katalog, je 0,6) und 2025F, 2026F (je 1) = 3,2 von 8,2 = 39 % → „Oft geprüft“
  assert.deepEqual(s.wichtig.termine, ['2022F', '2024F', '2025F', '2026F']);
  assert.equal(s.wichtig.x, 4);
  assert.equal(s.wichtig.n, 11);
  assert.equal(Math.round(s.wichtig.quote * 1000) / 1000, Math.round((3.2 / 8.2) * 1000) / 1000);
  assert.equal(s.wichtig.stufe, 2);
  assert.equal(wichtigkeitText(s.wichtig), 'Oft geprüft · in 4 von 11 Prüfungen, zuletzt Frühjahr 2026 · wahrscheinlich 2 bis 7 von 11');
});

test('Raum: Prüfungen und Gewichte wie in den Zuordnungen', () => {
  const erwartet = { AP1: [11, 4], PB1: [9, 2], PB2: [9, 2], WISO: [8, 2] };
  for (const r of RAEUME) {
    const w = index.raeume.get(r).wichtig;
    assert.deepEqual([w.n, w.aktuell], erwartet[r], r);
    assert.equal(Math.round(w.summe * 10) / 10, Math.round((w.aktuell + 0.6 * (w.n - w.aktuell)) * 10) / 10, r);
  }
});

test('Jeder Stichpunkt hat eine Stufe; ohne Beleg genau Stufe 5', () => {
  for (const r of RAEUME)
    for (const s of spIn(r)) {
      assert.ok(s.wichtig, s.id);
      assert.equal(s.wichtig.stufe === 5, s.wichtig.x === 0, s.id);
      assert.ok(s.wichtig.von <= s.wichtig.bis && s.wichtig.bis <= s.wichtig.n, s.id);
    }
});

test('Block und Themenbereich fassen ihre Stichpunkte zusammen, ohne Durchschnitt', () => {
  for (const r of RAEUME) {
    const raum = index.raeume.get(r);
    for (const b of raum.bloeckeListe) {
      const sps = b.sp.map((id) => index.sp.get(id));
      assert.equal(b.wichtig.anzahl.reduce((a, x) => a + x, 0), sps.length, b.id);
      assert.equal(b.wichtig.beste, Math.min(...sps.map((s) => s.wichtig.stufe)), b.id);
      assert.equal(b.wichtig.x, new Set(sps.flatMap((s) => s.wichtig.termine)).size, b.id);
    }
    // Anteile der Themenbereiche an den Prüfungsaufgaben ergeben zusammen 100 %
    const summe = raum.ordner.reduce((a, o) => a + index.ordner.get(o.id).wichtig.anteil, 0);
    assert.ok(Math.abs(summe - 1) < 1e-9, `${r}: ${summe}`);
  }
});

test('Fundament: „Grundlage für“ ist die Umkehrung von „Baut auf“', () => {
  let paare = 0;
  for (const s of new Set(index.sp.values()))
    for (const id of s.neu?.bautAuf ?? []) {
      const ziel = index.sp.get(id);
      if (!ziel) continue;
      assert.ok(ziel.grundlageFuer.includes(s.id), `${id} ← ${s.id}`);
      paare++;
    }
  assert.ok(paare > 100);
});

test('Reihenfolge-Wert: eigener Anteil plus LAMBDA × offene Abhängige', () => {
  const s = [...new Set(index.sp.values())].find((x) => x.grundlageFuer.length >= 3);
  const abh = s.grundlageFuer.reduce((a, id) => a + index.sp.get(id).wichtig.quote, 0);
  assert.equal(reihenfolgeWert(s, index), s.wichtig.quote + LAMBDA * abh);
  // Sind die Abhängigen abgehakt, zählt nur noch der eigene Anteil
  assert.equal(reihenfolgeWert(s, index, (id) => id === s.id), s.wichtig.quote);
  // Block: der beste offene Stichpunkt zählt; ein ganz abgehakter Block liegt hinten
  const b = index.bloecke.get(s.block);
  assert.ok(blockWert(b, index).bester >= reihenfolgeWert(s, index));
  assert.equal(blockWert(b, index, () => false).bester, -1);
});

test('Geprüfte Zuordnung (P73): App zählt aus umbau/zuordnung/wichtigkeit.json', async () => {
  const fs = await import('node:fs');
  const geprueft = JSON.parse(fs.readFileSync(path.join(wurzel, 'umbau', 'zuordnung', 'wichtigkeit.json'), 'utf8'));
  for (const r of RAEUME)
    for (const s of spIn(r)) assert.deepEqual(s.wichtig.termine, Object.keys(geprueft[r][s.id] ?? {}).sort((a, b) => a.localeCompare(b)), s.id);
  // Beispiel: Zahlensysteme und Präfixe – die Umrechnung kB/KiB wird in 6 von 11 AP1-Prüfungen gebraucht
  const z = spIn('AP1').find((x) => x.titel.startsWith('Zahlensysteme und Präfixe'));
  assert.equal(z.wichtig.x, 6);
  assert.equal(z.wichtig.stufe, 1);
  // Jede Zahl ist belegt: Teilaufgaben gehören zur Prüfung, unter der sie stehen
  for (const r of RAEUME) for (const p of Object.values(geprueft[r])) for (const [termin, tas] of Object.entries(p)) for (const ta of tas) assert.ok(ta.startsWith(`${termin}-`), ta);
});
