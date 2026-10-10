// Tests für den Lernweg-Rahmen (trainer/lernweg/) und den Lernweg des Zahlen-Trainers.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { baueLernweg, leseVerweis } from '../src/bereiche/trainer/lernweg/lernweg.js';
import { pruefeAntwort, leseGanzzahl, leseDezimal, leseBinaer, leseHex } from '../src/bereiche/trainer/lernweg/pruefen.js';
import { LERNWEGE, kursVon } from '../src/bereiche/trainer/lernweg/kurse.js';
import { LERNWEG, BLOECKE, LEKTIONEN, lektion } from '../src/bereiche/trainer/zahlen/verstehen/lernweg.js';
import { CHECKS } from '../src/bereiche/trainer/zahlen/verstehen/checks.js';
import { TRAINER, modiIn } from '../src/bereiche/trainer/verzeichnis.js';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inhalt = JSON.parse(fs.readFileSync(path.join(wurzel, 'Inhaltsdatei_AP1_AP2_tracker.json'), 'utf8'));
const koennen = (ids) => inhalt.stichpunkte.filter((s) => ids.includes(s.id)).flatMap((s) => s.koennen.map((k) => k.id));

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
        const { trainer, lektion: ziel } = leseVerweis(v);
        assert.notEqual(trainer, id, `${lek.id}: Grundlage im eigenen Trainer – dafür gibt es braucht`);
        for (const raum of ['AP1', 'AP2']) {
          if (!modiIn(t, raum).length) continue;
          assert.ok(kursVon(trainer, raum)?.lektion(ziel), `${id}/${lek.id}: Grundlage ${v} gibt es in ${raum} nicht`);
        }
      }
  }
});

// ---------- Zahlen-Lernweg ----------

test('Zahlen-Lernweg: Blöcke, Lektionen und Pflichtfelder', () => {
  assert.equal(BLOECKE[0].id, 'zahlensysteme');
  assert.equal(new Set(LEKTIONEN.map((l) => l.id)).size, LEKTIONEN.length, 'IDs eindeutig');
  let letzterBlock = -1;
  for (const l of LEKTIONEN) {
    const bi = BLOECKE.findIndex((b) => b.id === l.block);
    assert.ok(bi >= 0, `${l.id}: unbekannter Block`);
    assert.ok(bi >= letzterBlock, `${l.id}: Blöcke müssen zusammenhängend in Reihenfolge stehen`);
    letzterBlock = bi;
    assert.ok(l.begriff && l.leitfrage && l.definition, `${l.id}: Begriff, Leitfrage oder Definition fehlt`);
    assert.ok(l.leitfrage.length <= 60, `${l.id}: Leitfrage zu lang für die Kachel`);
    assert.ok(l.merksatz && l.fehler?.length, `${l.id}: Merksatz oder Stolperfalle fehlt`);
    assert.equal(lektion(l.id), l);
  }
});

test('Zahlen-Lernweg: braucht zeigt nur auf frühere Lektionen, auch je Raum', () => {
  for (const raum of [null, 'AP1', 'AP2']) {
    const k = baueLernweg(LERNWEG, raum);
    for (const l of k.LEKTIONEN)
      for (const b of l.braucht) {
        const vorher = k.lektion(b);
        assert.ok(vorher, `${raum}: ${l.id} braucht ${b} – gibt es dort nicht`);
        assert.ok(vorher.nr < l.nr, `${l.id} braucht ${b} – das kommt erst später`);
      }
  }
});

test('Zahlen-Lernweg: Kompetenzen der Stichpunkte sind abgedeckt', () => {
  const pflicht = koennen(['AP1-4-2-1', 'AP1-4-2-2', 'AP1-4-2-3', 'AP2-5-5-3', 'AP2-6-6-3']).concat(['AP1-5-2-3-K3', 'AP1-5-2-3-K5']);
  const alle = koennen(['AP1-4-2-1', 'AP1-4-2-2', 'AP1-4-2-3', 'AP1-5-2-3', 'AP2-5-5-3', 'AP2-6-6-3']);
  const abgedeckt = new Set(LEKTIONEN.flatMap((l) => l.kompetenzen));
  for (const k of pflicht) assert.ok(abgedeckt.has(k), `${k} gehört zu keiner Lektion`);
  for (const k of abgedeckt) assert.ok(alle.includes(k), `${k} gibt es in der Inhaltsdatei nicht`);
  // AP2-Kompetenzen nur in Lektionen, die es in AP2 gibt
  const ap2 = baueLernweg(LERNWEG, 'AP2');
  for (const l of LEKTIONEN.filter((l) => l.kompetenzen.some((k) => k.startsWith('AP2')))) assert.ok(ap2.lektion(l.id), `${l.id}: fehlt in AP2`);
});

test('Zahlen-Lernweg: Übungen und Themen passen zum Verzeichnis', () => {
  const modi = TRAINER.find((t) => t.id === 'zahlen').modi;
  for (const l of LEKTIONEN)
    assert.ok(
      modi.some((m) => m.id === l.uebung && m.bereich === 'ueben'),
      `${l.id}: Übung ${l.uebung} fehlt`,
    );
  for (const m of modi.filter((m) => m.bereich === 'ueben'))
    assert.ok(
      BLOECKE.some((b) => b.id === m.thema),
      `${m.id}: Thema ${m.thema} ist kein Block`,
    );
  // Paritätsbit nur in AP2
  assert.ok(!baueLernweg(LERNWEG, 'AP1').lektion('paritaet'));
  assert.ok(baueLernweg(LERNWEG, 'AP2').lektion('paritaet'));
});

test('Zahlen-Checks: jede Lektion hat 3 stimmige Fragen', () => {
  for (const l of LEKTIONEN) {
    const fragen = CHECKS[l.id];
    assert.ok(fragen && fragen.length >= 2 && fragen.length <= 3, `${l.id}: ${fragen?.length ?? 0} Fragen`);
    for (const f of fragen) {
      assert.ok(f.frage && f.tipp && f.erklaerung, `${l.id}: Frage unvollständig – ${f.frage}`);
      if (f.optionen) {
        assert.ok(f.optionen.includes(f.richtig), `${l.id}: „${f.richtig}“ steht nicht in den Optionen`);
        assert.equal(new Set(f.optionen).size, f.optionen.length, `${l.id}: doppelte Option`);
        for (const o of f.optionen) assert.equal(pruefeAntwort(f, o).ok, o === f.richtig, `${l.id}: „${o}“`);
      } else {
        const loesung = String(f.loesung).replace('.', f.eingabe === 'dezimal' ? ',' : '.');
        assert.ok(pruefeAntwort(f, loesung).ok, `${l.id}: Lösung „${loesung}“ wird abgelehnt`);
        assert.ok(pruefeAntwort(f, '').leer);
      }
    }
  }
  assert.equal(Object.keys(CHECKS).length, LEKTIONEN.length, 'Checks ohne Lektion');
});

test('Zahlen-Checks: Lösungen nachgerechnet', () => {
  const f = (id, nr) => CHECKS[id][nr];
  assert.equal(f('stellenwert', 2).loesung, parseInt('213', 5));
  assert.equal(f('binaer', 0).loesung, 0b01100100);
  assert.equal(parseInt(f('dezimal-binaer', 0).loesung, 2), 77);
  assert.equal(f('zweierpotenzen', 0).loesung, 2 ** 10);
  assert.equal(parseInt(f('hex', 0).loesung, 16), 0b10111110);
  assert.equal(f('hex', 1).loesung, 0x3f);
  assert.equal(parseInt(f('hex', 2).loesung, 16), 0b101101010);
  assert.equal(f('bit-byte', 0).loesung, 256 / 8);
  assert.equal(f('praefixe', 1).loesung, Math.round((64e9 / 1024 ** 3) * 100) / 100);
  assert.equal(f('praefixe', 2).loesung, 2 * 1024);
  assert.equal(f('speicherbedarf', 1).loesung, Math.round(((1280 * 720 * 3) / 1024 ** 2) * 100) / 100);
  assert.equal(f('uebertragung', 1).loesung, Math.round(((500 * 1024 ** 2 * 8) / 1e8) * 100) / 100);
  assert.equal(f('leistung', 2).loesung, 360 / 0.9);
  assert.equal(f('energie', 1).loesung, (200 * 8760 * 0.3) / 1000);
  // Parität: Einsen zählen
  const einsen = (s) => [...s].filter((c) => c === '1').length;
  assert.equal(f('paritaet', 0).richtig, String(einsen('0110100') % 2));
  assert.equal(einsen('11010110') % 2, 1, 'empfangene Folge ist ungerade');
});
