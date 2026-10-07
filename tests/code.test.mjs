import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fuehreAus } from '../src/bereiche/trainer/code/pseudo.js';
import { PROGRAMME, PUZZLES, FEHLER, fehlerCode } from '../src/bereiche/trainer/code/programme.js';
import * as c from '../src/bereiche/trainer/code/aufgaben.js';
import { zufall } from '../src/bereiche/trainer/rahmen/zufall.js';
import { pruefeErzeuger } from './hilfen/erzeuger.mjs';

test('Alle Programme laufen mit Beispiel- und Zufallswerten fehlerfrei', () => {
  for (const p of PROGRAMME) {
    const b = fuehreAus(p.code, { eingaben: p.beispiel });
    assert.equal(b.fehler, null, `${p.id}: ${b.fehler?.message}`);
    for (let s = 1; s < 60; s++) {
      const t = c.tabelleFuer(p, p.eingaben(zufall(s)));
      assert.ok(t.zeilen.length >= 1, `${p.id} #${s}: keine Tabellenzeile`);
    }
  }
});

test('Schreibtischtest Summe: bekannte Tabelle', () => {
  const p = PROGRAMME.find((x) => x.id === 'summe');
  const t = c.tabelleFuer(p, { werte: [4, 10, 2, 7] });
  assert.deepEqual(t.zeilen, [[0, 4, 4], [1, 10, 14], [2, 2, 16], [3, 7, 23]]);
  assert.deepEqual(t.ausgabe, ['23']);
  const m = c.tabelleFuer(PROGRAMME.find((x) => x.id === 'maximum'), { werte: [12, 45, 7, 45, 30] });
  assert.deepEqual(m.zeilen, [[1, 45, 45], [2, 7, 45], [3, 45, 45], [4, 30, 45]]);
  const b = c.tabelleFuer(PROGRAMME.find((x) => x.id === 'binaer'), { zahl: 13 });
  assert.deepEqual(b.zeilen, [[1, '1', 6], [0, '01', 3], [1, '101', 1], [1, '1101', 0]]);
  const bs = c.tabelleFuer(PROGRAMME.find((x) => x.id === 'binaerSuche'), { a: [3, 8, 12, 19, 25, 31, 40, 47], gesucht: 31 });
  assert.deepEqual(bs.ausgabe, ['5']);
});

test('Puzzles: Musterlösung besteht, eine falsche Reihenfolge nicht', () => {
  for (const p of PUZZLES) {
    const a = c.puzzleAusgaben(p.code, p.tests);
    assert.ok(!a.some((x) => x.startsWith('Fehler')), `${p.id}: ${a}`);
  }
  for (let s = 1; s < 80; s++) {
    const a = c.puzzle(zufall(s), s % 2 ? 'AP1' : 'AP2');
    const f = a.felder[0];
    assert.ok(f.pruefe(a.puzzle.zeilen.map((_, i) => i)).ok);
    assert.ok(!f.pruefe(a.puzzle.start).ok || a.puzzle.start.every((x, i) => x === i) === false);
  }
});

test('Fehlersuche: fehlerhafter Code liefert bei mindestens einem Test ein anderes Ergebnis', () => {
  for (const f of FEHLER) {
    const falsch = fehlerCode(f);
    const unterschied = f.tests.some((args) => {
      const a = fuehreAus(f.code, { aufruf: { name: f.aufruf, args } });
      const b = fuehreAus(falsch, { aufruf: { name: f.aufruf, args } });
      assert.equal(a.fehler, null, `${f.id}: korrekter Code wirft ${a.fehler?.message}`);
      return b.fehler || JSON.stringify(a.rueckgabe) !== JSON.stringify(b.rueckgabe);
    });
    assert.ok(unterschied, `${f.id}: Fehler zeigt sich in keinem Test`);
    // Keine der falschen Alternativen darf zufällig auch richtig sein
    for (const alt of f.alternativen) {
      const zeilen = f.code.split('\n');
      zeilen[f.zeile - 1] = alt;
      const code = zeilen.join('\n');
      const gleich = f.tests.every((args) => {
        const a = fuehreAus(f.code, { aufruf: { name: f.aufruf, args } });
        const b = fuehreAus(code, { aufruf: { name: f.aufruf, args } });
        return !b.fehler && JSON.stringify(a.rueckgabe) === JSON.stringify(b.rueckgabe);
      });
      assert.ok(!gleich, `${f.id}: Alternative „${alt.trim()}" wäre ebenfalls richtig`);
    }
  }
});

test('Sortierschritte von Hand', () => {
  assert.deepEqual(c.sortierSchritte('bubble', [5, 1, 4, 2, 8]), [[1, 4, 2, 5, 8], [1, 2, 4, 5, 8], [1, 2, 4, 5, 8], [1, 2, 4, 5, 8]]);
  assert.deepEqual(c.sortierSchritte('selection', [29, 10, 14, 37, 13]), [[10, 29, 14, 37, 13], [10, 13, 14, 37, 29], [10, 13, 14, 37, 29], [10, 13, 14, 29, 37]]);
  assert.deepEqual(c.sortierSchritte('insertion', [5, 2, 4, 6, 1]), [[2, 5, 4, 6, 1], [2, 4, 5, 6, 1], [2, 4, 5, 6, 1], [1, 2, 4, 5, 6]]);
});

test('Wertvergleich im Schreibtischtest', () => {
  assert.ok(c.pruefeWert('3,5', 3.5).ok);
  assert.ok(c.pruefeWert('[1, 2, 3]', [1, 2, 3]).ok);
  assert.ok(c.pruefeWert('1 2 3', [1, 2, 3]).ok);
  assert.ok(!c.pruefeWert('1, 3, 2', [1, 2, 3]).ok);
  assert.ok(c.pruefeWert('"1101"', '1101').ok);
  assert.ok(c.pruefeWert('wahr', true).ok);
});

test('Pseudocode: alle Erzeuger', () => {
  for (const [name, f] of Object.entries(c.ERZEUGER)) {
    pruefeErzeuger(name, f, 'AP1');
    pruefeErzeuger(name, f, 'AP2');
  }
});

import { GRUNDLAGEN } from '../src/bereiche/trainer/code/grundlagen.js';
test('Alle ausführbaren Grundlagen-Beispiele laufen fehlerfrei', () => {
  for (const g of GRUNDLAGEN) {
    if (!g.code || g.nurLesen) continue;
    const r = fuehreAus(g.code);
    assert.equal(r.fehler, null, `${g.titel}: ${r.fehler?.message}`);
  }
  const t = fuehreAus(GRUNDLAGEN.find((g) => g.titel.startsWith('Typische')).code);
  assert.equal(t.variablen.schnitt, 16 / 3);
  assert.equal(fuehreAus(GRUNDLAGEN.find((g) => g.titel.startsWith('Kopfgesteuerte')).code).variablen.q, 13);
});
