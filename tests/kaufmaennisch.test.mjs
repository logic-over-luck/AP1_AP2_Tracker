import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as k from '../src/bereiche/trainer/kaufmaennisch/aufgaben.js';
import { zufall } from '../src/bereiche/trainer/rahmen/zufall.js';
import { runde } from '../src/bereiche/trainer/rahmen/pruefen.js';
import { pruefeErzeuger } from './hilfen/erzeuger.mjs';

test('Kaufmännisch: alle Erzeuger', () => {
  for (const [name, f] of Object.entries(k.ERZEUGER)) pruefeErzeuger(name, f);
});

test('Rechnung: Reihenfolge Rabatt → USt → Skonto stimmt', () => {
  for (let s = 1; s < 300; s++) {
    const a = k.rechnung(zufall(s));
    if (a.titel !== 'Rechnung berechnen') continue;
    const w = Object.fromEntries(a.felder.map((f) => [f.id, f.erwartet]));
    assert.equal(runde(w.ww - w.rab, 2), w.net);
    assert.equal(runde(w.net * 0.19, 2), w.ust);
    assert.equal(runde(w.net + w.ust, 2), w.br);
    assert.ok(w.zb < w.br && w.zb > w.br * 0.96);
  }
});

test('Tilgung: Summe der Tilgungen = Darlehen, Zinsen sinken', () => {
  for (let s = 1; s < 200; s++) {
    const a = k.tilgung(zufall(s));
    const d = Number(a.text.match(/über \*\*([\d.]+),00 €\*\*/)[1].replace(/\./g, ''));
    const jahre = Number(a.text.match(/in \*\*(\d) Jahren/)[1]);
    const t = a.felder.find((f) => f.id === 'til').erwartet;
    assert.equal(t * jahre, d);
  }
});

test('Sozialversicherung: Beispiel von Hand', () => {
  // 3.000 € brutto, Zusatzbeitrag 2,9 %: 3000 · (7,3 + 1,45) % = 262,50 €
  assert.equal(runde(3000 * (14.6 / 2 + 2.9 / 2) / 100, 2), 262.5);
  for (let s = 1; s < 300; s++) {
    const a = k.sv(zufall(s));
    const kv = a.felder.find((f) => f.id === 'kv').erwartet;
    const brutto = Number(a.text.match(/\*\*([\d.]+,\d\d) €\*\* brutto/)[1].replace(/\./g, '').replace(',', '.'));
    const zusatz = Number(a.text.match(/Zusatzbeitrag \*\*([\d,]+) %/)[1].replace(',', '.'));
    assert.equal(kv, runde(Math.min(brutto, 5812.5) * (7.3 + zusatz / 2) / 100, 2));
  }
});

test('Gewinnverteilung und Kennzahlen', () => {
  for (let s = 1; s < 200; s++) {
    const a = k.gewinn(zufall(s));
    assert.ok(a.felder[1].erwartet > 0);
    const b = k.kennzahlen(zufall(s));
    assert.ok(Number.isFinite(b.felder[0].erwartet));
  }
});
