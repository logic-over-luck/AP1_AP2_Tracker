// Tests für den Lernweg-Rahmen (trainer/lernweg/): Aufbau, Eingaben, Check-Typen, Verweise zwischen Trainern.

import test from 'node:test';
import assert from 'node:assert/strict';
import { baueLernweg, leseVerweis } from '../src/bereiche/trainer/lernweg/lernweg.js';
import { pruefeAntwort, leseGanzzahl, leseDezimal, leseBinaer, leseHex } from '../src/bereiche/trainer/lernweg/pruefen.js';
import { LERNWEGE, THEMEN, kursVon, zielVon } from '../src/bereiche/trainer/lernweg/kurse.js';
import { TRAINER, modiIn } from '../src/bereiche/trainer/verzeichnis.js';

// ---------- Rahmen ----------

test('Rahmen: baueLernweg nummeriert, filtert nach Raum und liefert Status', () => {
  const beschreibung = {
    trainer: 't',
    schluessel: 't.lernweg',
    bloecke: [
      { id: 'a', titel: 'A' },
      { id: 'b', titel: 'B' },
    ],
    lektionen: [
      { id: 'x', block: 'a', braucht: [] },
      { id: 'y', block: 'a', braucht: ['x'] },
      { id: 'z', block: 'b', braucht: ['x'], raeume: ['AP2'] },
    ],
  };
  const alle = baueLernweg(beschreibung);
  assert.deepEqual(
    alle.LEKTIONEN.map((l) => l.nr),
    [1, 2, 3],
  );
  const ap1 = baueLernweg(beschreibung, 'AP1');
  assert.deepEqual(
    ap1.LEKTIONEN.map((l) => l.id),
    ['x', 'y'],
  );
  assert.deepEqual(
    ap1.BLOECKE.map((b) => b.id),
    ['a'],
    'Block ohne Lektion im Raum fällt weg',
  );
  assert.equal(ap1.raum, 'AP1');
  const v = new Set(['x']);
  assert.equal(ap1.status('x', v), 'verstanden');
  assert.equal(ap1.status('y', v), 'naechste');
  assert.equal(ap1.naechsteLektion(new Set(['x', 'y'])), null);
  assert.deepEqual(
    alle.luecken('z', new Set()).map((l) => l.id),
    ['x'],
  );
  assert.equal(alle.blockVon('z').id, 'b');
  assert.deepEqual(leseVerweis('zahlen:binaer'), { trainer: 'zahlen', lektion: 'binaer' });
});

test('Rahmen: Eingaben lesen', () => {
  assert.equal(leseGanzzahl('1.024'), 1024);
  assert.equal(leseGanzzahl(' 2 048 '), 2048);
  assert.equal(leseGanzzahl('2,5'), null);
  assert.equal(leseDezimal('2,5'), 2.5);
  assert.equal(leseDezimal('59.60'), 59.6);
  assert.equal(leseDezimal('1.024,5'), 1024.5);
  assert.equal(leseDezimal('abc'), null);
  assert.equal(leseBinaer('1100 1000'), 200);
  assert.equal(leseBinaer('0b101'), 5);
  assert.equal(leseBinaer('102'), null);
  assert.equal(leseHex('c8'), 200);
  assert.equal(leseHex('0x1F4'), 500);
  assert.equal(leseHex('FFh'), 255);
  assert.equal(leseHex('G1'), null);
});

test('Rahmen: Eingabe-Typen im Check', () => {
  assert.ok(pruefeAntwort({ eingabe: 'dezimal', loesung: 59.6, toleranz: 0.005 }, '59,60').ok);
  assert.ok(!pruefeAntwort({ eingabe: 'dezimal', loesung: 59.6, toleranz: 0.005 }, '59,61').ok);
  assert.ok(pruefeAntwort({ eingabe: 'binaer', loesung: '1001101' }, '0100 1101').ok, 'führende Null erlaubt');
  assert.ok(pruefeAntwort({ eingabe: 'hex', loesung: 'BE' }, 'be').ok);
  assert.ok(!pruefeAntwort({ eingabe: 'hex', loesung: 'BE' }, 'EB').ok);
  assert.equal(pruefeAntwort({ eingabe: 'binaer', loesung: '1' }, '2').grund, 'Eine Binärzahl besteht nur aus 0 und 1.');
  // Eigener Typ eines Trainers
  const typen = { gross: { pruefe: (s) => ({ ok: s === s.toUpperCase() }) } };
  assert.ok(pruefeAntwort({ eingabe: 'gross' }, 'ABC', typen).ok);
});

test('Rahmen: alle Lernwege im Verzeichnis, Verweise zwischen Trainern lösen auf', () => {
  for (const [id, l] of Object.entries(LERNWEGE)) {
    assert.equal(l.trainer, id);
    const t = TRAINER.find((x) => x.id === id);
    assert.ok(
      t.modi.some((m) => m.bereich === 'verstehen'),
      `${id}: kein Modus „verstehen“`,
    );
    for (const lek of l.lektionen)
      for (const v of lek.grundlagen ?? []) {
        const { trainer } = leseVerweis(v);
        assert.notEqual(trainer, id, `${lek.id}: Grundlage im eigenen Trainer – dafür gibt es braucht`);
        for (const raum of ['AP1', 'AP2']) {
          if (!modiIn(t, raum).length) continue;
          const ziel = zielVon(v, raum);
          assert.ok(ziel, `${id}/${lek.id}: Grundlage ${v} gibt es in ${raum} nicht`);
          assert.ok(ziel.begriff && ziel.params.modus, `${v}: Ziel ohne Begriff oder Modus`);
          const zielTrainer = TRAINER.find((x) => x.id === ziel.trainer);
          assert.ok(ziel.lektion || zielTrainer.modi.some((m) => m.id === ziel.params.modus), `${v}: Modus ${ziel.params.modus} fehlt im Verzeichnis`);
        }
      }
  }
  // Themen-Verweise zeigen auf Modi des Trainers; Lernweg-Ziele tragen Lektion und Schlüssel
  for (const [trainer, ziele] of Object.entries(THEMEN)) {
    const t = TRAINER.find((x) => x.id === trainer);
    for (const [name, z] of Object.entries(ziele)) {
      assert.ok(t.modi.some((m) => m.id === z.thema), `${trainer}:${name} zeigt auf unbekanntes Thema ${z.thema}`);
      assert.deepEqual(zielVon(`${trainer}:${name}`, 'AP1'), { trainer, begriff: z.begriff, thema: z.thema, params: { modus: z.thema } });
    }
  }
  const l = zielVon('subnetz:praefix', 'AP1');
  assert.ok(l?.lektion === 'praefix' && l.schluessel && l.params.lektion === 'praefix');
  assert.equal(zielVon('zahlen:gibt-es-nicht', 'AP1'), null);
  assert.equal(zielVon('nix:nix', 'AP1'), null);
  assert.equal(kursVon('zahlen', 'AP1'), null);
});
