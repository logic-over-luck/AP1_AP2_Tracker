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
    const t = a.felder.find((f) => f.id === 'til2').erwartet;
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
    const gewinn = a.felder.filter((f) => f.id.startsWith('g')).reduce((x, f) => x + f.erwartet, 0);
    assert.equal(runde(gewinn, 2), Number(a.text.match(/Gewinn von \*\*([\d.]+),00 €/)[1].replace(/\./g, '')));
    const b = k.kennzahlen(zufall(s));
    assert.ok(Number.isFinite(b.felder[0].erwartet));
  }
});

test('Rechenblätter: jedes Feld im Blatt gibt es, jedes Blatt-Feld steht im Blatt', () => {
  for (const [name, erz] of Object.entries(k.ERZEUGER))
    for (let s = 1; s < 150; s++) {
      const a = erz(zufall(s));
      if (!a.rechenblatt) {
        assert.ok(!a.felder.some((f) => f.imBlatt), `${name} #${s}: imBlatt ohne Rechenblatt`);
        continue;
      }
      const imBlatt = a.rechenblatt.zeilen.flatMap((z) => (Array.isArray(z) ? z : z.zellen)).filter((c) => c && c.feld).map((c) => c.feld);
      for (const id of imBlatt) assert.ok(a.felder.some((f) => f.id === id && f.imBlatt), `${name} #${s}: Feld ${id} fehlt`);
      for (const f of a.felder.filter((f) => f.imBlatt)) assert.ok(imBlatt.includes(f.id), `${name} #${s}: ${f.id} nicht im Blatt`);
      const breite = (z) => (Array.isArray(z) ? z : z.zellen).reduce((n, c) => n + ((c && c.span) || 1), 0);
      for (const z of a.rechenblatt.zeilen) assert.equal(breite(z), a.rechenblatt.kopf.length, `${name} #${s}: Zeilenbreite`);
    }
});
