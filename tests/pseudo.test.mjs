import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fuehreAus, parse, messreihe, PseudoFehler, formatiere, hervorheben } from '../src/bereiche/trainer/code/pseudo.js';

const lauf = (code, opt) => {
  const r = fuehreAus(code, opt);
  if (r.fehler) throw r.fehler;
  return r;
};

test('Summe über ein Array (Beispiel aus dem alten Tracker)', () => {
  const r = lauf(`summe = 0
werte = [4, 10, 2, 7]
FÜR i = 0 BIS 3
  summe = summe + werte[i]
ENDE FÜR
AUSGABE summe`);
  assert.deepEqual(r.ausgabe, ['23']);
  assert.deepEqual(messreihe(r, 4, ['i', 'summe']), [
    { i: 0, summe: 4 },
    { i: 1, summe: 14 },
    { i: 2, summe: 16 },
    { i: 3, summe: 23 },
  ]);
});

test('Verzweigungen mit SONST WENN, Vergleich mit =', () => {
  const code = `WENN punkte >= 50 DANN
  ergebnis = "Bestanden"
SONST WENN punkte >= 30 DANN
  ergebnis = "Mündliche Ergänzungsprüfung"
SONST
  ergebnis = "Nicht bestanden"
ENDE WENN
WENN ergebnis = "Bestanden" UND NICHT punkte > 90 DANN
  AUSGABE "gut"
ENDE WENN`;
  assert.equal(lauf(code, { eingaben: { punkte: 70 } }).variablen.ergebnis, 'Bestanden');
  assert.deepEqual(lauf(code, { eingaben: { punkte: 70 } }).ausgabe, ['gut']);
  assert.equal(lauf(code, { eingaben: { punkte: 30 } }).variablen.ergebnis, 'Mündliche Ergänzungsprüfung');
  assert.equal(lauf(code, { eingaben: { punkte: 29 } }).variablen.ergebnis, 'Nicht bestanden');
});

test('SOLANGE, DIV, MOD: Quersumme', () => {
  const r = lauf(`GANZZAHL zahl = 4711
GANZZAHL q = 0
SOLANGE zahl > 0
  q = q + zahl MOD 10
  zahl = zahl DIV 10
ENDE SOLANGE`);
  assert.equal(r.variablen.q, 13);
  assert.equal(r.variablen.zahl, 0);
});

test('WIEDERHOLE … BIS und WIEDERHOLE … SOLANGE', () => {
  assert.equal(lauf('i = 0\nWIEDERHOLE\n  i = i + 3\nBIS i > 10').variablen.i, 12);
  assert.equal(lauf('i = 0\nWIEDERHOLE\n  i = i + 3\nSOLANGE i < 10').variablen.i, 12);
  // innere SOLANGE-Schleife in WIEDERHOLE
  const r = lauf(`n = 0
WIEDERHOLE
  k = 0
  SOLANGE k < 2
    k = k + 1
    n = n + 1
  ENDE SOLANGE
BIS n >= 6`);
  assert.equal(r.variablen.n, 6);
});

test('Funktionen mit Rückgabe, Listen mit add/size/get', () => {
  const code = `FUNKTION maximum(liste)
  max = liste.get(0)
  FÜR i = 1 BIS liste.size() - 1
    WENN liste.get(i) > max DANN
      max = liste.get(i)
    ENDE WENN
  ENDE FÜR
  RÜCKGABE max
ENDE FUNKTION
l = []
l.add(3)
l.add(9)
l.add(4)
AUSGABE "Max: ", maximum(l)`;
  assert.deepEqual(lauf(code).ausgabe, ['Max: 9']);
  assert.equal(lauf(code.split('l = []')[0], { aufruf: { name: 'maximum', args: [[5, 2, 8, 1]] } }).rueckgabe, 8);
});

test('FÜR mit SCHRITT, rückwärts, FÜR JEDES', () => {
  assert.equal(lauf('s = 0\nFÜR i = 10 BIS 0 SCHRITT -2\n  s = s + i\nENDE FÜR').variablen.s, 30);
  assert.equal(lauf('s = 0\nFÜR i = 5 BIS 1\n  s = s + 1\nENDE FÜR').variablen.s, 5);
  assert.equal(lauf('s = 0\nFÜR JEDES x IN [1, 2, 3]\n  s = s + x * x\nENDE FÜR').variablen.s, 14);
});

test('Tausch über Hilfsvariable und Bubble Sort', () => {
  const r = lauf(`a = [5, 1, 4, 2, 8]
n = LÄNGE(a)
FÜR i = 0 BIS n - 2
  FÜR j = 0 BIS n - 2 - i
    WENN a[j] > a[j + 1] DANN
      hilf = a[j]
      a[j] = a[j + 1]
      a[j + 1] = hilf
    ENDE WENN
  ENDE FÜR
ENDE FÜR`);
  assert.deepEqual(r.variablen.a, [1, 2, 4, 5, 8]);
});

test('Prozent und Division: / ist Kommadivision, DIV ganzzahlig', () => {
  const r = lauf('preis = 80\nrabatt = preis * 15 / 100\nhalb = 7 DIV 2\nrest = 7 MOD 2\nschnitt = 7 / 2');
  assert.equal(r.variablen.rabatt, 12);
  assert.equal(r.variablen.halb, 3);
  assert.equal(r.variablen.rest, 1);
  assert.equal(r.variablen.schnitt, 3.5);
  assert.equal(formatiere(3.5), '3,5');
});

test('Verständliche Fehler mit Zeilennummer', () => {
  let r = fuehreAus('a = [1, 2, 3]\nx = a[3]');
  assert.ok(r.fehler instanceof PseudoFehler);
  assert.equal(r.fehler.zeile, 2);
  assert.match(r.fehler.message, /außerhalb/);
  r = fuehreAus('x = y + 1');
  assert.match(r.fehler.message, /nicht belegt/);
  r = fuehreAus('i = 0\nSOLANGE i < 5\n  x = 1\nENDE SOLANGE', { maxSchritte: 500 });
  assert.match(r.fehler.message, /Endlosschleife/);
  assert.throws(() => parse('WENN x > 1 DANN\n  y = 2'), /nicht abgeschlossen/);
  r = fuehreAus('x = 5 / 0');
  assert.match(r.fehler.message, /Division durch null/);
});

test('Varianten der Schreibweise', () => {
  assert.equal(lauf('x ← 3\nx := x + 1\nx += 2\nKOMMAZAHL y = x * 0.5').variablen.y, 3);
  assert.equal(lauf('wenn 3 > 2 dann\n  z = wahr\nende wenn').variablen.z, true);
  assert.equal(lauf('t = "a" + 1 + "b"').variablen.t, 'a1b');
  assert.equal(lauf('ok = 3 ≤ 4 UND 5 ≠ 6').variablen.ok, true);
  assert.equal(lauf('FÜR i VON 1 BIS 3\n  x = i\nENDE FÜR').variablen.x, 3);
});

test('Hervorhebung erkennt Schlüsselwörter, Texte, Zahlen, Kommentare', () => {
  const t = hervorheben('WENN x > 10 DANN AUSGABE "hi" // Kommentar');
  assert.deepEqual(t.filter((x) => x.art !== 'text').map((x) => x.art), ['kw', 'num', 'kw', 'kw', 'str', 'kom']);
});
