// Tests für inhalte/korrekturen.json: Prüfen, Anwenden, Wirkung auf Wichtigkeit und Lernprompt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pruefeKorrekturen, wendeKorrekturenAn, liesKorrekturen } from '../tools/korrekturen.mjs';
import { wichtigkeit, ladeDaten } from '../tools/daten.mjs';
import { baueIndex } from '../src/daten/index.js';
import { lernpromptStichpunkt } from '../src/bereiche/lernen/lernprompt.js';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const original = JSON.parse(fs.readFileSync(path.join(wurzel, 'Inhaltsdatei_AP1_AP2_tracker.json'), 'utf8'));
const Q = { grund: 'Test', quelle: 'Test-Quelle' };
const sp = (inhalt, id) => inhalt.stichpunkte.find((s) => s.id === id);

test('Die echte korrekturen.json ist fehlerfrei', () => {
  assert.deepEqual(pruefeKorrekturen(original, liesKorrekturen(wurzel)), []);
});

test('Ersetzen von Titel, Art, Rahmen und unklarer Tiefe', () => {
  const unklar = original.stichpunkte.find((s) => s.rahmen_unklar);
  const neu = wendeKorrekturenAn(original, {
    korrekturen: [
      { id: 'AP1-1-1-1', was: 'titel', wert: 'Neuer Titel', ...Q },
      { id: 'AP1-1-1-1', was: 'art', wert: 'Schreiben', ...Q },
      { id: 'AP1-1-1-1', was: 'rahmen', wert: 'Neuer Rahmen.', ...Q },
      { id: unklar.id, was: 'unklar', wert: null, ...Q },
    ],
  });
  const s = sp(neu, 'AP1-1-1-1');
  assert.equal(s.stichpunkt, 'Neuer Titel');
  assert.equal(s.art, 'Schreiben');
  assert.equal(s.rahmen, 'Neuer Rahmen.');
  assert.equal(sp(neu, unklar.id).rahmen_unklar, false);
  assert.equal(s.korrekturen.length, 3);
  assert.equal(sp(original, 'AP1-1-1-1').stichpunkt, 'Projektmerkmale und SMART-Ziele', 'Original bleibt unverändert');
});

test('Können-Aussagen umformulieren, ergänzen, entfallen lassen', () => {
  const neu = wendeKorrekturenAn(original, {
    korrekturen: [
      { id: 'AP1-1-1-1-K2', was: 'koennen', wert: 'Neu formuliert.', ...Q },
      { id: 'AP1-1-1-1-K6', was: 'koennen_neu', wert: 'Ganz neu.', ...Q },
      { id: 'AP1-1-1-1-K7', was: 'koennen_neu', wert: 'Noch eine.', ...Q },
      { id: 'AP1-1-1-1-K5', was: 'koennen_entfaellt', ...Q },
    ],
  });
  const k = sp(neu, 'AP1-1-1-1').koennen;
  assert.equal(k.find((x) => x.id === 'AP1-1-1-1-K2').text, 'Neu formuliert.');
  assert.deepEqual(k.map((x) => x.id), ['AP1-1-1-1-K1', 'AP1-1-1-1-K2', 'AP1-1-1-1-K3', 'AP1-1-1-1-K4', 'AP1-1-1-1-K6', 'AP1-1-1-1-K7']);
  assert.deepEqual(sp(neu, 'AP1-1-1-1').koennen_entfallen, ['AP1-1-1-1-K5']);
});

test('Fehler: unbekannte IDs, doppelte oder nicht fortlaufende neue IDs, fehlende Quelle', () => {
  const f = pruefeKorrekturen(original, {
    korrekturen: [
      { id: 'AP1-9-9-9', was: 'rahmen', wert: 'x', ...Q },
      { id: 'AP1-1-1-1-K99', was: 'koennen', wert: 'x', ...Q },
      { id: 'AP1-1-1-1-K3', was: 'koennen_neu', wert: 'x', ...Q },
      { id: 'AP1-1-1-1-K8', was: 'koennen_neu', wert: 'x', ...Q },
      { id: 'AP1-1-1-1', was: 'rahmen', wert: 'x', grund: 'ohne Quelle' },
      { id: 'AP1-1-1-1', was: 'art', wert: 'Malen', ...Q },
      { id: 'AP1-1-1-1', was: 'quatsch', ...Q },
    ],
  });
  assert.equal(f.length, 7, f.join('\n'));
  assert.throws(() => wendeKorrekturenAn(original, { korrekturen: [{ id: 'AP1-9-9-9', was: 'rahmen', wert: 'x', ...Q }] }));
});

test('Belege ergänzen und als falsch markieren, Punkte setzen: Wichtigkeit folgt', () => {
  const s0 = sp(original, 'AP1-1-1-1');
  const b = s0.belege[0];
  const vorher = wichtigkeit(s0);
  const neu = wendeKorrekturenAn(original, {
    pruefungen: [{ id: 'AP1-2099-F', pruefung: 'AP1', termin: 'Frühjahr 2099', jahr: 2099, katalog: 'aktuell', ...Q }],
    korrekturen: [
      { id: 'AP1-1-1-1', was: 'beleg_falsch', wert: { pruefung_id: b.pruefung_id, aufgabe: b.aufgabe }, ...Q },
      { id: 'AP1-1-1-1', was: 'beleg_neu', wert: { pruefung_id: 'AP1-2099-F', quelle: 'podcast_stichwort', text: 'SMART' }, ...Q },
      { id: 'AP1-1-1-1', was: 'punkte', wert: 15, ...Q },
    ],
  });
  const s = sp(neu, 'AP1-1-1-1');
  const nachher = wichtigkeit(s);
  assert.deepEqual(nachher.pruefungen, [['AP1-2099-F', 0.5]]);
  assert.equal(nachher.punkte, 15);
  assert.equal(nachher.wert, 1.5);
  assert.notDeepEqual(vorher.pruefungen, nachher.pruefungen);
  assert.equal(s.belege.find((x) => x.pruefung_id === 'AP1-2099-F').katalog, 'aktuell');
  // Beleg auf eine unbekannte Prüfung und ein nicht passender falscher Beleg sind Fehler
  const f = pruefeKorrekturen(original, {
    korrekturen: [
      { id: 'AP1-1-1-1', was: 'beleg_neu', wert: { pruefung_id: 'AP1-2099-X', quelle: 'original', text: 'x' }, ...Q },
      { id: 'AP1-1-1-1', was: 'beleg_falsch', wert: { pruefung_id: 'AP1-2099-X' }, ...Q },
    ],
  });
  assert.equal(f.length, 2, f.join('\n'));
});

test('App-Daten und Lernprompt zeigen die korrigierte Vorgabe', () => {
  const daten = ladeDaten(wurzel);
  const korr = liesKorrekturen(wurzel);
  const index = baueIndex(daten);
  for (const e of korr.korrekturen ?? []) {
    if (e.was === 'rahmen') assert.equal(index.sp.get(e.id).rahmen, e.wert);
    if (e.was === 'koennen' || e.was === 'koennen_neu') {
      const s = index.sp.get(e.id.replace(/-K\d+$/, ''));
      assert.ok(lernpromptStichpunkt(s, index).includes(e.wert), e.id);
    }
    if (e.was === 'koennen_entfaellt') assert.ok(!index.sp.get(e.id.replace(/-K\d+$/, '')).koennen.some(([id]) => id === e.id), e.id);
  }
});
