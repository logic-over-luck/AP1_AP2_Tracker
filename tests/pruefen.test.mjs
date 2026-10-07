// Prüfer: eine richtige Antwort darf nie als falsch gelten.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lesarten, pruefeZahl, pruefeBasis, pruefeIPv4, runde, zahlText, pruefeFeld } from '../src/bereiche/trainer/rahmen/pruefen.js';

test('Zahlen lesen: Komma, Punkt, Tausender, Einheiten, Vorzeichen', () => {
  assert.deepEqual(lesarten('931,32'), [931.32]);
  assert.deepEqual(lesarten('931.32'), [931.32]);
  assert.deepEqual(lesarten('1.234,5'), [1234.5]);
  assert.deepEqual(lesarten('1,234.5'), [1234.5]);
  assert.deepEqual(lesarten('1 234 567'), [1234567]);
  assert.deepEqual(lesarten('931,32 GiB'), [931.32]);
  assert.deepEqual(lesarten('  12 € '), [12]);
  assert.deepEqual(lesarten('19 %'), [19]);
  assert.deepEqual(lesarten('−3,5'), [-3.5]);
  assert.deepEqual(lesarten('-0,25'), [-0.25]);
  assert.deepEqual(lesarten('ca. 7'), [7]);
  // mehrdeutig: beide Lesarten
  assert.deepEqual(lesarten('1.234').sort(), [1.234, 1234].sort());
  assert.deepEqual(lesarten('1,234').sort(), [1.234, 1234].sort());
  assert.deepEqual(lesarten('1.234.567'), [1234567]);
  assert.deepEqual(lesarten('abc'), []);
  assert.deepEqual(lesarten(''), []);
  assert.deepEqual(lesarten('1,2,3'), []);
});

test('Runden kaufmännisch, robust gegen Gleitkomma', () => {
  assert.equal(runde(1.005, 2), 1.01);
  assert.equal(runde(2.675, 2), 2.68);
  assert.equal(runde(931.3225746154785, 2), 931.32);
  assert.equal(runde(0.5, 0), 1);
  assert.equal(runde(-2.5, 0), -3);
  assert.equal(zahlText(1234.5, 2), '1.234,50');
});

test('Zahl prüfen: gerundet, genauer, Toleranz', () => {
  const f = { erwartet: 931.3225746154785, stellen: 2 };
  assert.ok(pruefeZahl('931,32', f).ok);
  assert.ok(pruefeZahl('931.32', f).ok);
  assert.ok(pruefeZahl('931,32 GiB', f).ok);
  assert.ok(pruefeZahl('931,3226', f).ok, 'genauer ist auch richtig');
  assert.ok(!pruefeZahl('931,33', f).ok);
  assert.ok(!pruefeZahl('931,3', f).ok);
  assert.ok(!pruefeZahl('931', f).ok);
  // Ganzzahl
  assert.ok(pruefeZahl('1.024', { erwartet: 1024 }).ok);
  assert.ok(pruefeZahl('1024', { erwartet: 1024 }).ok);
  assert.ok(!pruefeZahl('1025', { erwartet: 1024 }).ok);
  // 2,50 und 2,5 sind dasselbe
  assert.ok(pruefeZahl('2,5', { erwartet: 2.5, stellen: 2 }).ok);
  // Toleranz für Zwischenrundung
  assert.ok(pruefeZahl('0,71', { erwartet: 0.70368, stellen: 2, toleranz: 0.011 }).ok);
  assert.ok(!pruefeZahl('0,72', { erwartet: 0.70368, stellen: 2, toleranz: 0.011 }).ok);
  // Mehrdeutige Eingabe zählt, wenn eine Lesart stimmt
  assert.ok(pruefeZahl('1.234', { erwartet: 1234 }).ok);
  assert.ok(pruefeZahl('1.234', { erwartet: 1.234, stellen: 3 }).ok);
  // Leere Eingabe
  assert.equal(pruefeZahl('', { erwartet: 1 }).leer, true);
  // Halbe-Grenze: 2,675 → 2,68; 2,67 ist falsch
  assert.ok(pruefeZahl('2,68', { erwartet: 2.675, stellen: 2 }).ok);
  assert.ok(!pruefeZahl('2,67', { erwartet: 2.675, stellen: 2 }).ok);
});

test('Stellenwertsysteme', () => {
  assert.ok(pruefeBasis('1111 0000', 240, 2).ok);
  assert.ok(pruefeBasis('0b11110000', 240, 2).ok);
  assert.ok(pruefeBasis('011110000', 240, 2).ok);
  assert.ok(pruefeBasis('f0', 240, 16).ok);
  assert.ok(pruefeBasis('0xF0', 240, 16).ok);
  assert.ok(pruefeBasis('F0h', 240, 16).ok);
  assert.ok(!pruefeBasis('F1', 240, 16).ok);
  assert.ok(!pruefeBasis('12', 240, 2).ok);
  assert.ok(pruefeBasis('754', 492, 8).ok);
});

test('IPv4 prüfen', () => {
  assert.ok(pruefeIPv4('192.168.1.0', '192.168.1.0').ok);
  assert.ok(pruefeIPv4(' 192.168.001.000 ', '192.168.1.0').ok);
  assert.ok(!pruefeIPv4('192.168.1', '192.168.1.0').ok);
  assert.ok(!pruefeIPv4('192.168.1.256', '192.168.1.0').ok);
});

test('Feldtypen', () => {
  assert.ok(pruefeFeld('ja', { typ: 'auswahl', erwartet: 'ja' }).ok);
  assert.ok(pruefeFeld(' Bubble  Sort ', { typ: 'text', erlaubt: ['bubble sort'] }).ok);
});
