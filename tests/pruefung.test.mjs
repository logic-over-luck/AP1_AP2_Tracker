import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { note, bewerteFrage, auswerten, stelleZusammen, pruefeSatz, automatischePunkte, TEILE } from '../src/bereiche/pruefung/generator.js';
import { SAETZE } from '../src/bereiche/pruefung/saetze/index.js';

const inhalt = JSON.parse(fs.readFileSync(new URL('../Inhaltsdatei_AP1_AP2_tracker.json', import.meta.url), 'utf8'));
const spIds = new Set(inhalt.stichpunkte.map((s) => s.id));

test('IHK-Notenschlüssel', () => {
  assert.equal(note(92).note, 1);
  assert.equal(note(91.9).note, 2);
  assert.equal(note(81).note, 2);
  assert.equal(note(67).note, 3);
  assert.equal(note(50).note, 4);
  assert.equal(note(50).bestanden, true);
  assert.equal(note(49.9).bestanden, false);
  assert.equal(note(30).note, 5);
  assert.equal(note(0).note, 6);
});

test('WiSo-Fragen bewerten wie der Lösungsschlüssel', () => {
  assert.equal(bewerteFrage({ art: 'einfach', richtig: [2] }, 2), 1);
  assert.equal(bewerteFrage({ art: 'einfach', richtig: [2] }, 1), 0);
  assert.equal(bewerteFrage({ art: 'mehrfach', richtig: [0, 4] }, [0, 4]), 1);
  assert.equal(bewerteFrage({ art: 'mehrfach', richtig: [0, 4] }, [0, 3]), 0.5);
  assert.equal(bewerteFrage({ art: 'mehrfach', richtig: [0, 4] }, [0, 3, 4]), 0, 'zu viele Kreuze');
  assert.equal(bewerteFrage({ art: 'zuordnung', richtig: [2, 0, 1, 3] }, [2, 0, 3, 1]), 0.5);
  assert.equal(bewerteFrage({ art: 'reihenfolge', richtig: [2, 0, 1] }, [2, 0, 1]), 1);
  assert.equal(bewerteFrage({ art: 'reihenfolge', richtig: [2, 0, 1] }, [2, 1, 0]), 0);
  assert.equal(bewerteFrage({ art: 'zahl', richtig: 314.5, stellen: 2 }, '314,50'), 1);
  assert.equal(bewerteFrage({ art: 'zahl', richtig: 314.5, stellen: 2 }, '315'), 0);
  assert.equal(bewerteFrage({ art: 'einfach', richtig: [0] }, undefined), 0);
});

test('Zahlenfelder und Auswahl werden automatisch vorbewertet', () => {
  const teil = { punkte: 4, antwort: { art: 'zahlen', felder: [{ id: 'a', erwartet: 10 }, { id: 'b', erwartet: 2.5, stellen: 1 }] } };
  assert.equal(automatischePunkte(teil, { a: '10', b: '2,5' }), 4);
  assert.equal(automatischePunkte(teil, { a: '10', b: '3' }), 2);
  assert.equal(automatischePunkte({ punkte: 3, antwort: { art: 'text' } }, 'x'), null);
});

// Kleiner Vorrat zum Testen der Zusammenstellung
const teilA = (nr, p) => ({ nr, punkte: p, text: 'Nennen Sie …', loesung: ['x'] });
const aufgabe = (satz, i, art, sp) => ({ id: `${satz}-${i}`, art, titel: art, punkte: 25, sp: [sp], teile: [teilA('a', 10), teilA('b', 15)] });
const satz = (n, arten) => ({
  id: `pb2-${n}`,
  teil: 'PB2',
  titel: `Firma ${n}`,
  situation: 'S',
  aufgaben: arten.map((a, i) => aufgabe(`pb2-${n}`, i + 1, a, 'AP2-3-3-1')),
});
const vorrat = [satz(1, ['algorithmus', 'sql', 'modell', 'test']), satz(2, ['modell', 'sql', 'algorithmus', 'test']), satz(3, ['test', 'modell', 'sql', 'algorithmus']), satz(4, ['sql', 'algorithmus', 'test', 'modell'])];

test('Gemischte PB2-Prüfung: 4 Aufgaben aus verschiedenen Sätzen, Algorithmus und SQL immer dabei', () => {
  for (let s = 1; s <= 40; s++) {
    const p = stelleZusammen('PB2', vorrat, { startwert: s });
    assert.equal(p.aufgaben.length, 4);
    const arten = p.aufgaben.map((x) => x.aufgabe.art);
    assert.ok(arten.includes('algorithmus') && arten.includes('sql'), arten.join());
    assert.equal(new Set(p.aufgaben.map((x) => x.satz.id)).size, 4, 'jede Aufgabe aus einem anderen Satz');
    assert.equal(new Set(arten).size, 4, 'keine Art doppelt');
  }
  // gleicher Startwert → gleiche Prüfung
  const a = stelleZusammen('PB2', vorrat, { startwert: 7 }).aufgaben.map((x) => x.aufgabe.id);
  const b = stelleZusammen('PB2', vorrat, { startwert: 7 }).aufgaben.map((x) => x.aufgabe.id);
  assert.deepEqual(a, b);
});

test('Feste Prüfung ist genau der Satz', () => {
  const p = stelleZusammen('PB2', vorrat, { satzId: 'pb2-3' });
  assert.deepEqual(
    p.aufgaben.map((x) => x.aufgabe.id),
    vorrat[2].aufgaben.map((a) => a.id),
  );
});

test('Auswertung: Punkte, Prozent, Note und Punkte je Stichpunkt', () => {
  const p = stelleZusammen('PB2', vorrat, { satzId: 'pb2-1' });
  const punkte = {};
  for (const { aufgabe: a } of p.aufgaben) {
    punkte[`${a.id}:a`] = 10;
    punkte[`${a.id}:b`] = 5;
  }
  const e = auswerten(p, { punkte });
  assert.equal(e.erreicht, 60);
  assert.equal(e.max, 100);
  assert.equal(e.note, 4);
  assert.deepEqual(e.jeSp['AP2-3-3-1'], [60, 100]);
  // mehr als die Höchstpunkte zählen nicht
  punkte[`${p.aufgaben[0].aufgabe.id}:a`] = 99;
  assert.equal(auswerten(p, { punkte }).erreicht, 60);
});

test('Alle Prüfungssätze sind vollständig', () => {
  const raumVon = { AP1: 'AP1', PB1: 'AP2', PB2: 'AP2', WISO: 'WISO' };
  const ids = new Set();
  const aufgabenIds = new Set();
  for (const s of SAETZE) {
    assert.ok(!ids.has(s.id), `Satz ${s.id} doppelt`);
    ids.add(s.id);
    for (const x of s.aufgaben ?? s.fragen) {
      assert.ok(!aufgabenIds.has(x.id), `ID ${x.id} doppelt`);
      aufgabenIds.add(x.id);
    }
    const fehler = pruefeSatz(s, (id) => spIds.has(id) && id.startsWith(raumVon[s.teil]));
    assert.deepEqual(fehler, [], fehler.join('\n'));
  }
});

test('Gemischte Prüfungen aus dem echten Vorrat', () => {
  for (const teil of Object.keys(TEILE)) {
    const eigene = SAETZE.filter((s) => s.teil === teil);
    if (!eigene.length) continue;
    const p = stelleZusammen(teil, SAETZE, { startwert: 3 });
    if (TEILE[teil].fragen) assert.equal(p.fragen.length, Math.min(30, eigene.reduce((n, s) => n + s.fragen.length, 0)));
    else assert.equal(p.aufgaben.length, Math.min(4, eigene.length * 4));
  }
});
