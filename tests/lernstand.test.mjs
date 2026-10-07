// Tests für Lernstand, Wiederholungen, Kartenplanung, Serie, Sicherung und Zuordnung.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ladeDaten, wichtigkeit } from '../tools/daten.mjs';
import { baueIndex, PRIO_RANG } from '../src/daten/index.js';
import { ableiten, blockZustand, kartenZustand, serieBerechnen } from '../src/lernstand/ableiten.js';
import { tagPlus, tageZwischen, tagVon, datumAusTag } from '../src/lernstand/zeit.js';
import { naechsteStufe, rangFuer, RAENGE, KARTEN_ABSTAND } from '../src/lernstand/regeln.js';
import { migriere, sicherungErstellen, sicherungLesen, zusammenfuehren, laden, speichern, FORMAT, SicherungsFehler } from '../src/lernstand/speicher.js';
import { heuteImFokus, tempo } from '../src/lernstand/empfehlung.js';
import { TRAINER, trainerIn, uebungenFuer, modiIn } from '../src/bereiche/trainer/verzeichnis.js';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = baueIndex(ladeDaten(wurzel));
const T0 = new Date(2026, 9, 7, 10, 0).getTime(); // 7.10.2026 10:00 Ortszeit
const TAG = 86400000;
const heute = tagVon(T0);

test('Datumsrechnung auf Tagesebene, auch über die Zeitumstellung', () => {
  assert.equal(tagPlus('2026-10-24', 2), '2026-10-26');
  assert.equal(tageZwischen('2026-10-24', '2026-10-26'), 2);
  assert.equal(tageZwischen('2026-03-28', '2026-03-30'), 2);
  assert.equal(tagPlus('2026-12-31', 1), '2027-01-01');
  assert.equal(tagVon(datumAusTag('2026-02-28')), '2026-02-28');
});

test('Inhalt: 3 Räume, 88 Blöcke, 246 Stichpunkte, jede Karte gehört zu einem Stichpunkt', () => {
  assert.equal(index.raeume.size, 3);
  assert.equal(index.bloecke.size, 88);
  assert.equal(index.sp.size, 246);
  for (const k of index.karten.values()) assert.ok(index.sp.has(k.sp), k.id);
});

test('Stichpunkt abhaken, Block wird erst mit allen Stichpunkten erledigt', () => {
  const b = index.bloecke.get('AP1-1-2');
  const ev = b.sp.slice(0, -1).map((id, i) => ({ t: T0 + i, e: 'sp', id, an: true }));
  let s = ableiten(ev, index, heute);
  assert.equal(blockZustand(s, b).fertig, false);
  assert.equal(blockZustand(s, b).angefangen, true);
  ev.push({ t: T0 + 10, e: 'sp', id: b.sp.at(-1), an: true });
  s = ableiten(ev, index, heute);
  const z = blockZustand(s, b);
  assert.equal(z.fertig, true);
  assert.equal(z.erledigtAm, T0 + 10);
  assert.deepEqual(z.naechste, { phase: 1, faellig: tagPlus(heute, 1) });
  assert.equal(z.faellig, false);
});

test('Wiederholungs-Phasen: 1, 7, 30 Tage; Reihenfolge erzwungen; pausiert bei offenem Block', () => {
  const b = index.bloecke.get('AP1-2-1');
  const ev = b.sp.map((id) => ({ t: T0, e: 'sp', id, an: true }));
  let s = ableiten(ev, index, tagPlus(heute, 1));
  assert.equal(blockZustand(s, b).faellig, true);
  // Phase 2 vor Phase 1 wird ignoriert
  ev.push({ t: T0 + TAG, e: 'wdh', id: b.id, p: 2 });
  ev.push({ t: T0 + TAG, e: 'wdh', id: b.id, p: 1 });
  s = ableiten(ev, index, tagPlus(heute, 1));
  let z = blockZustand(s, b);
  assert.deepEqual(z.phasen, [T0 + TAG, null, null]);
  assert.equal(z.naechste.faellig, tagPlus(heute, 8));
  assert.equal(z.faellig, false);
  // Stichpunkt wieder öffnen: nicht fällig, auch wenn Termin erreicht
  ev.push({ t: T0 + 2 * TAG, e: 'sp', id: b.sp[0], an: false });
  s = ableiten(ev, index, tagPlus(heute, 9));
  z = blockZustand(s, b);
  assert.equal(z.fertig, false);
  assert.equal(z.faellig, false);
  // Wieder abgehakt: Phase 2 fällig, erste Abschluss-Zeit bleibt
  ev.push({ t: T0 + 3 * TAG, e: 'sp', id: b.sp[0], an: true });
  s = ableiten(ev, index, tagPlus(heute, 9));
  z = blockZustand(s, b);
  assert.equal(z.erledigtAm, T0);
  assert.equal(z.faellig, true);
  ev.push({ t: T0 + 9 * TAG, e: 'wdh', id: b.id, p: 2 });
  s = ableiten(ev, index, tagPlus(heute, 9));
  assert.equal(blockZustand(s, b).naechste.faellig, tagPlus(heute, 39));
  ev.push({ t: T0 + 39 * TAG, e: 'wdh', id: b.id, p: 3 });
  s = ableiten(ev, index, tagPlus(heute, 40));
  assert.equal(blockZustand(s, b).gefestigt, true);
  assert.equal(blockZustand(s, b).naechste, null);
});

test('XP: Stichpunkt zählt nur beim ersten Abhaken', () => {
  const id = 'AP1-1-1-1';
  const s = ableiten(
    [
      { t: T0, e: 'sp', id, an: true },
      { t: T0 + 1, e: 'sp', id, an: false },
      { t: T0 + 2, e: 'sp', id, an: true },
    ],
    index,
    heute,
  );
  assert.equal(s.xp, 10);
});

test('Lernkarten: Stufen und Fälligkeit', () => {
  assert.equal(naechsteStufe(0, 2), 2);
  assert.equal(naechsteStufe(1, 2), 2);
  assert.equal(naechsteStufe(3, 2), 4);
  assert.equal(naechsteStufe(6, 2), 6);
  assert.equal(naechsteStufe(0, 1), 1);
  assert.equal(naechsteStufe(4, 1), 3);
  assert.equal(naechsteStufe(5, 0), 0);
  const id = [...index.karten.keys()][0];
  let s = ableiten([{ t: T0, e: 'karte', id, n: 2 }], index, heute);
  assert.equal(s.karten.get(id).stufe, 2);
  assert.equal(s.karten.get(id).faellig, tagPlus(heute, KARTEN_ABSTAND[2]));
  s = ableiten([{ t: T0, e: 'karte', id, n: 0 }], index, heute);
  assert.equal(s.karten.get(id).faellig, heute);
  assert.equal(kartenZustand(s, [id]).faellig, 1);
  // unbekannte Karte wird übersprungen
  s = ableiten([{ t: T0, e: 'karte', id: 'GIBT-ES-NICHT', n: 2 }], index, heute);
  assert.equal(s.karten.size, 0);
});

test('Lernserie zählt bis gestern weiter, bricht bei Lücke ab', () => {
  const tage = new Map([
    [tagPlus(heute, -1), { xp: 5, n: 1 }],
    [tagPlus(heute, -2), { xp: 5, n: 1 }],
    [tagPlus(heute, -4), { xp: 5, n: 1 }],
  ]);
  assert.deepEqual(serieBerechnen(tage, heute), { aktuell: 2, beste: 2, heuteAktiv: false });
  tage.set(heute, { xp: 1, n: 1 });
  assert.equal(serieBerechnen(tage, heute).aktuell, 3);
  assert.equal(serieBerechnen(tage, tagPlus(heute, 2)).aktuell, 0);
});

test('Ränge: erster Rang Hello World, aufsteigend', () => {
  assert.equal(RAENGE[0].name, 'Hello World');
  assert.equal(rangFuer(0).name, 'Hello World');
  for (let i = 1; i < RAENGE.length; i++) assert.ok(RAENGE[i].ab > RAENGE[i - 1].ab);
  assert.equal(rangFuer(RAENGE[3].ab).index, 3);
  assert.equal(rangFuer(999999).naechster, null);
});

test('Heute im Fokus: fällige Wiederholung vor angefangenem Block vor offenem Thema', () => {
  const fertig = index.bloecke.get('AP1-2-1');
  const angefangen = index.bloecke.get('AP1-3-1');
  const ev = [...fertig.sp.map((id) => ({ t: T0 - 3 * TAG, e: 'sp', id, an: true })), { t: T0, e: 'sp', id: angefangen.sp[0], an: true }];
  let f = heuteImFokus(ableiten(ev, index, heute), index, 'AP1');
  assert.equal(f.haupt.art, 'wiederholung');
  assert.equal(f.haupt.block.id, fertig.id);
  assert.equal(f.weitere[0].block.id, angefangen.id);
  f = heuteImFokus(ableiten([], index, heute), index, 'AP1');
  assert.equal(f.haupt.art, 'neu');
  // Ohne Lernstand: das wichtigste offene Thema des Raums (höchste Stufe, dann höchster Wert)
  const wichtigste = [...index.raeume.get('AP1').bloeckeListe].sort((a, b) => PRIO_RANG[b.prio] - PRIO_RANG[a.prio] || b.gewicht - a.gewicht)[0];
  assert.equal(f.haupt.block.id, wichtigste.id);
});

test('Tempo bis zur Prüfung', () => {
  const s = ableiten([{ t: T0, e: 'termin', r: 'AP1', d: tagPlus(heute, 70) }], index, heute);
  const t = tempo(s, index, 'AP1');
  assert.equal(t.offen, 98);
  assert.equal(t.jeWoche, 10);
});

test('Sicherung: erstellen, lesen, Versionsprüfung, Zusammenführen', () => {
  const ev = [
    { t: T0, e: 'sp', id: 'AP1-1-1-1', an: true },
    { t: T0 + 1, e: 'karte', id: 'x', n: 2 },
  ];
  const text = JSON.stringify(sicherungErstellen(ev, new Date(T0)));
  assert.deepEqual(sicherungLesen(text).ereignisse, ev);
  assert.throws(() => sicherungLesen('kein json'), SicherungsFehler);
  assert.throws(() => sicherungLesen(JSON.stringify({ format: FORMAT + 1, ereignisse: [] })), /neueren Version/);
  assert.throws(() => sicherungLesen(JSON.stringify({ app: 'Fremd', format: 1, ereignisse: [] })), SicherungsFehler);
  // kaputte Einträge werden entfernt
  assert.equal(migriere({ format: 1, ereignisse: [{ t: 'x', e: 'sp' }, { t: 1, e: 'unbekannt' }, ...ev] }).ereignisse.length, 2);
  // Zusammenführen ohne Doppel
  assert.equal(zusammenfuehren(ev, [...ev, { t: T0 + 5, e: 'fokus', min: 25 }]).length, 3);
});

test('Speicher: beschädigter Stand wird beiseitegelegt statt überschrieben', () => {
  const daten = new Map();
  const speicher = { getItem: (k) => daten.get(k) ?? null, setItem: (k, v) => daten.set(k, v) };
  speichern([{ t: 1, e: 'sp', id: 'A', an: true }], speicher);
  assert.equal(laden(speicher).ereignisse.length, 1);
  daten.set('lernstudio.lernstand', '{kaputt');
  const r = laden(speicher);
  assert.equal(r.ereignisse.length, 0);
  assert.ok(r.fehler);
  assert.ok([...daten.keys()].some((k) => k.includes('defekt')));
});

test('Trainer-Zuordnung: jeder Stichpunkt außer „Wissen" wird geübt; SQL nur in AP2', () => {
  for (const sp of index.sp.values()) {
    if (sp.art === 'Wissen') continue;
    assert.ok(uebungenFuer(sp.id).length > 0, `${sp.id} ${sp.titel} hat keinen Trainer`);
  }
  for (const t of TRAINER) for (const m of t.modi) for (const id of m.sp) assert.ok(index.sp.has(id), `${t.id}/${m.id}: ${id} unbekannt`);
  assert.ok(!trainerIn('AP1').some((t) => t.id === 'sql'));
  assert.ok(trainerIn('AP2').some((t) => t.id === 'sql'));
  assert.ok(!trainerIn('AP2').some((t) => t.id === 'subnetz'));
  assert.deepEqual(
    trainerIn('WISO').map((t) => t.id),
    ['kaufmaennisch'],
  );
  assert.deepEqual(
    modiIn(TRAINER.find((t) => t.id === 'kaufmaennisch'), 'WISO').map((m) => m.id),
    ['sv', 'gewinn', 'kennzahlen'],
  );
});

test('Wichtigkeit: Häufigkeit, Aktualität und Punkte', () => {
  const b = (pruefung_id, quelle, katalog) => ({ pruefung_id, quelle, katalog });
  // dieselbe Prüfung zählt nur einmal, mit dem stärksten Beleg
  let w = wichtigkeit({ rahmen: '', belege: [b('A', 'podcast_stichwort', 'aktuell'), b('A', 'original', 'aktuell')] });
  assert.equal(w.wert, 1);
  assert.equal(w.pruefungen.length, 1);
  // drei aktuelle Originalprüfungen → Top-Thema
  w = wichtigkeit({ rahmen: '', belege: ['A', 'B', 'C'].map((p) => b(p, 'original', 'aktuell')) });
  assert.equal(w.stufe, 'top');
  // ältere Prüfungen zählen weniger
  w = wichtigkeit({ rahmen: '', belege: ['A', 'B'].map((p) => b(p, 'original', 'alt')) });
  assert.equal(w.wert, 1.2);
  assert.equal(w.stufe, 'mittel');
  // viele Punkte heben an (Rahmen oder Zusatzdatei)
  w = wichtigkeit({ rahmen: 'brachte 18 Punkte', belege: [b('A', 'original', 'aktuell')] });
  assert.equal(w.punkte, 18);
  assert.equal(w.stufe, 'hoch');
  assert.equal(wichtigkeit({ rahmen: '', belege: [] }, 12).wert, 0.5);
  // ohne Beleg: selten geprüft
  assert.equal(wichtigkeit({ rahmen: '', belege: [] }).stufe, 'normal');
});
