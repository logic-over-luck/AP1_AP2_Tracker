// Zahlen-Trainer: Themen, Aufgabenerzeuger, Werkzeuge und Stand je Thema. Die Aufgaben laufen durch die gemeinsame
// Erzeuger-Prüfung (jede Musterlösung muss der Prüfer in mehreren Schreibweisen annehmen).

import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { zufall } from '../src/bereiche/trainer/rahmen/zufall.js';
import { pruefeFeld, runde } from '../src/bereiche/trainer/rahmen/pruefen.js';
import { pruefeErzeuger } from './hilfen/erzeuger.mjs';
import { ladeDaten } from '../tools/daten.mjs';
import { vorschauAlle } from '../tools/vorschau-ap1.mjs';
import { TRAINER } from '../src/bereiche/trainer/verzeichnis.js';
import { THEMEN, themaVon, VERWEISE } from '../src/bereiche/trainer/zahlen/themen.js';
import { ARTEN, artName, erzeugeAufgabe, baueRunde } from '../src/bereiche/trainer/zahlen/aufgaben/index.js';
import { themenStand, FENSTER } from '../src/bereiche/trainer/zahlen/stand.js';
import { leseRechte, symbolisch, leseBasis, gruppiert, passendeEinheit, minSek } from '../src/bereiche/trainer/zahlen/rechnen.js';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modi = TRAINER.find((t) => t.id === 'zahlen').modi;
const sp = (thema) => modi.find((m) => m.id === thema).sp[0];

// ---------- Themen ----------

test('Themen: ein Modus je Thema im Verzeichnis, Pflichtfelder, Aufgabenarten', () => {
  assert.deepEqual(
    THEMEN.map((t) => t.id),
    modi.map((m) => m.id),
    'Themen und Modi in derselben Reihenfolge',
  );
  for (const t of THEMEN) {
    assert.ok(t.name && t.icon && t.kurz && t.spickzettel && t.werkzeug, `${t.id}: Pflichtfeld fehlt`);
    assert.ok(t.erklaerung.length >= 3 && t.erklaerung.every((b) => b.titel && b.text), `${t.id}: Erklärung unvollständig`);
    assert.ok(t.koennen.length, `${t.id}: keine Kompetenzen`);
    assert.ok(ARTEN[t.id]?.length >= 2, `${t.id}: zu wenige Aufgabenarten`);
    assert.equal(new Set(ARTEN[t.id].map((a) => a.id)).size, ARTEN[t.id].length, `${t.id}: doppelte Aufgabenart`);
    assert.equal(themaVon(t.id), t);
  }
  assert.equal(themaVon('gibt-es-nicht'), null);
  for (const v of Object.values(VERWEISE)) assert.ok(themaVon(v.thema), `Verweis auf unbekanntes Thema ${v.thema}`);
});

test('Themen: Kompetenzen der Stichpunkte sind abgedeckt', () => {
  // Die Daten, mit denen die App gebaut wird (Lernplan-Vorschau); alte IDs lösen über den Umzug auf
  const daten = vorschauAlle(ladeDaten(wurzel), wurzel);
  const alias = daten.umzug?.sp ?? {};
  const koennenVon = (id) => (daten.sp[alias[id] ?? id]?.koennen ?? []).map(([k]) => k);
  const spIds = [...new Set(modi.flatMap((m) => m.sp))].filter((id) => koennenVon(id).length);
  const abgedeckt = new Set(THEMEN.flatMap((t) => t.koennen));
  // Reines Wissen bleibt dem Lernplan überlassen: ASCII/Binärdatei, analog/digital, Befehlszeile außer chmod
  const nichtImTrainer = new Set(['AP1-4-2-1-K6', 'AP1-4-2-2-K10', 'AP1-5-2-3-K1', 'AP1-5-2-3-K2', 'AP1-5-2-3-K4', 'AP1-5-2-3-K6', 'AP1-5-2-3-K7']);
  for (const id of spIds) {
    for (const k of koennenVon(id)) {
      if (nichtImTrainer.has(k)) continue;
      // Der Umzug benennt Kompetenzen um (AP2-5-5-3 → PB1-9-1-2): die Themen nennen die alten IDs
      const alt = k.replace(alias[id] ?? id, id);
      assert.ok(abgedeckt.has(k) || abgedeckt.has(alt), `${k} gehört zu keinem Thema`);
    }
  }
});

// ---------- Aufgaben ----------

test('Aufgaben: jede Art jedes Themas, viele Startwerte, Musterlösung wird angenommen', () => {
  for (const t of THEMEN) {
    for (const a of ARTEN[t.id]) {
      pruefeErzeuger(`${t.id}/${a.id}`, (r) => erzeugeAufgabe(t.id, r, { sp: sp(t.id), arten: [a.id] }));
      for (let s = 1; s <= 20; s++) assert.equal(erzeugeAufgabe(t.id, zufall(s), { sp: sp(t.id), arten: [a.id] }).art, a.id, 'gewählte Art wird gezogen');
    }
    const alle = new Set();
    for (let s = 1; s <= 300; s++) alle.add(erzeugeAufgabe(t.id, zufall(s), { sp: sp(t.id) }).art);
    assert.equal(alle.size, ARTEN[t.id].length, `${t.id}: ohne Auswahl kommen alle Arten vor`);
    assert.equal(erzeugeAufgabe(t.id, zufall(1), { sp: sp(t.id), arten: ['unbekannt'] }).thema, t.id, 'unbekannte Arten werden ignoriert');
  }
  assert.throws(() => erzeugeAufgabe('nix', zufall(1)));
  assert.equal(artName('zahlensysteme', 'd2b'), 'Dezimal → Binär');
});

test('Aufgaben: Zahlensysteme – Aufgabentext und Antwort passen zusammen', () => {
  for (let s = 1; s < 400; s++) {
    const a = erzeugeAufgabe('zahlensysteme', zufall(s), { sp: 'AP1-4-2-1' });
    const d = a.text.match(/Dezimalzahl \*\*([\d.]+)\*\*/);
    if (d) assert.equal(a.felder[0].erwartet, Number(d[1].replace(/\./g, '')));
    const h = a.text.match(/Hexadezimalzahl \*\*([0-9A-F]+)\*\*/);
    if (h) assert.equal(a.felder[0].erwartet, parseInt(h[1], 16));
    const b = a.text.match(/Binärzahl \*\*([01 ]+)\*\*/);
    if (b) assert.equal(a.felder[0].erwartet, parseInt(b[1].replace(/ /g, ''), 2));
    const o = a.text.match(/Oktalzahl \*\*([0-7]+)\*\*/);
    if (o) assert.equal(a.felder[0].erwartet, parseInt(o[1], 8));
  }
});

test('Aufgaben: Stichproben gegen Hand-Rechnung', () => {
  // 1.000 GB → 931,32 GiB
  assert.equal(runde((1000 * 1000 ** 3) / 1024 ** 3, 2), 931.32);
  // Parität: Einsen mit Paritätsbit haben die vereinbarte Parität
  for (let s = 1; s < 300; s++) {
    const a = erzeugeAufgabe('paritaet', zufall(s), { sp: 'AP2-5-5-3', arten: ['bilden'] });
    const daten = a.text.match(/\*\*([01]{7})\*\*/)[1];
    const gerade = a.text.includes('**gerader');
    const einsen = [...daten].filter((c) => c === '1').length + Number(a.felder[0].erwartet);
    assert.equal(einsen % 2, gerade ? 0 : 1);
  }
  // Netzteil: das gewählte Netzteil ist das kleinste über dem Bedarf
  for (let s = 1; s < 100; s++) {
    const a = erzeugeAufgabe('strom', zufall(s), { sp: 'AP1-4-2-3', arten: ['netzteil'] });
    const bedarf = a.felder[1].erwartet;
    const nt = Number(a.felder[2].erwartet);
    assert.ok(nt >= bedarf && nt - bedarf < 100, `${nt} W für ${bedarf} W`);
  }
  // Steckdose und Speicherkarte: Entscheidung eindeutig
  for (let s = 1; s < 100; s++) {
    const st = erzeugeAufgabe('strom', zufall(s), { sp: 'AP1-4-2-3', arten: ['steckdose'] });
    assert.equal(st.felder[2].erwartet, st.felder[1].erwartet > 3680 ? 'ja' : 'nein');
    const sk = erzeugeAufgabe('speicher', zufall(s), { sp: 'AP1-4-2-2', arten: ['reicht'] });
    const karte = Number(sk.text.match(/\*\*(\d+) GB\*\*/)[1]);
    assert.equal(sk.felder[1].erwartet, sk.felder[0].erwartet * 1024 ** 3 <= karte * 1e9 ? 'ja' : 'nein');
  }
  // chmod: symbolische Schreibweise auch mit führendem Strich, Oktalzahl auch mit führender Null
  const z = erzeugeAufgabe('rechte', zufall(7), { sp: 'AP1-5-2-3', arten: ['zuSym'] });
  assert.ok(pruefeFeld(`-${z.felder[0].erwartet}`, z.felder[0]).ok);
  const o = erzeugeAufgabe('rechte', zufall(7), { sp: 'AP1-5-2-3', arten: ['zuOktal'] });
  assert.ok(pruefeFeld(`0${o.felder[0].erwartet}`, o.felder[0]).ok);
  assert.ok(!pruefeFeld('777', { ...o.felder[0], erwartet: '640', erlaubt: ['640'] }).ok);
});

test('Gemischte Runde: jedes Thema kommt mindestens einmal vor, Länge stimmt', () => {
  const themen = THEMEN.map((t) => ({ id: t.id, sp: sp(t.id) }));
  for (let s = 1; s < 50; s++) {
    const folge = baueRunde(themen, 10, zufall(s));
    assert.equal(folge.length, 10);
    assert.equal(new Set(folge.map((f) => f.thema)).size, themen.length);
    assert.ok(folge.every((f) => f.sp));
  }
  assert.equal(baueRunde(themen.slice(0, 2), 3, zufall(1)).length, 3);
});

// ---------- Werkzeuge ----------

test('Werkzeuge: Startwerte rechnen, Unsinn wird gemeldet', () => {
  for (const t of THEMEN) {
    const start = Object.fromEntries(t.werkzeug.felder.map((f) => [f.id, f.start]));
    const erg = t.werkzeug.rechne(start);
    assert.ok(!erg.fehler && erg.zeilen.length && erg.schritte.length, `${t.id}: Werkzeug rechnet mit den Startwerten nicht`);
    for (const f of t.werkzeug.felder) if (f.wahl) assert.ok(f.wahl.some((w) => w.wert === f.start), `${t.id}: Startwert ${f.start} nicht in der Auswahl`);
    const kaputt = t.werkzeug.rechne({ ...start, [t.werkzeug.felder[0].id]: 'abc' });
    assert.ok(kaputt.fehler, `${t.id}: keine Fehlermeldung bei Unsinn`);
  }
  const w = (id, werte) => themaVon(id).werkzeug.rechne(werte);
  assert.equal(w('zahlensysteme', { zahl: '200', basis: '10' }).zeilen[3].wert, 'C8');
  assert.equal(w('zahlensysteme', { zahl: 'ff', basis: '16' }).zeilen[0].wert, '255');
  assert.equal(w('praefixe', { wert: '1000', einheit: 'GB' }).zeilen[3].wert, '931,32 GiB');
  assert.equal(w('speicher', { breite: '1920', hoehe: '1080', tiefe: '24', anzahl: '1' }).zeilen[3].wert, '5,93');
  assert.equal(w('uebertragung', { menge: '1', einheit: 'GiB', rate: '100' }).zeilen[2].wert, '85,90 s');
  assert.equal(w('strom', { leistung: '150', stunden: '24', tage: '365', preis: '0,30' }).zeilen[3].wert, '394,20 €');
  assert.equal(w('rechte', { rechte: 'rwxr-xr--' }).zeilen[3].wert, 'chmod 754');
  assert.equal(w('paritaet', { bits: '0110100', art: 'gerade' }).zeilen[1].wert, '1');
  assert.equal(w('paritaet', { bits: '0110100', art: 'ungerade' }).zeilen[1].wert, '0');
});

test('Rechenhilfen', () => {
  assert.deepEqual(leseRechte('754'), { oktal: '754', sym: 'rwxr-xr--' });
  assert.deepEqual(leseRechte('-rw-r-----'), { oktal: '640', sym: 'rw-r-----' });
  assert.equal(leseRechte('rwx'), null);
  assert.equal(symbolisch('000'), '---------');
  assert.equal(leseBasis('0b1010', 2), 10);
  assert.equal(leseBasis('3Fh', 16), 63);
  assert.equal(leseBasis('102', 2), null);
  assert.equal(gruppiert('1011'), '1011');
  assert.equal(gruppiert('11011'), '0001 1011');
  assert.deepEqual(passendeEinheit(1024 ** 2, ['Byte', 'KiB', 'MiB'], 1024), { stufe: 2, einheit: 'MiB', wert: 1 });
  assert.equal(minSek(85.9), '1 min 26 s');
  assert.equal(minSek(42), '42 s');
});

// ---------- Stand ----------

test('Stand je Thema aus dem Lernstand', () => {
  const ev = (m, ok) => ({ e: 'aufgabe', tr: 'zahlen', m, ok });
  const leer = themenStand([]);
  assert.equal(leer.size, 0);
  const ereignisse = [
    ...Array.from({ length: 12 }, (_, i) => ev('zahlensysteme', i % 3 !== 0)), // zuletzt 10: 7 richtig
    ...Array.from({ length: 5 }, () => ev('strom', true)),
    ev('rechte', true),
    ev('datenmenge', true), // früherer Modus zählt für „speicher“
    { e: 'aufgabe', tr: 'subnetz', m: 'maske', ok: true },
    { e: 'karte', id: 'x' },
  ];
  const stand = themenStand(ereignisse);
  assert.equal(stand.get('zahlensysteme').n, 12);
  assert.equal(stand.get('zahlensysteme').letzte.length, FENSTER);
  assert.equal(stand.get('zahlensysteme').zuletztOk, 7);
  assert.equal(stand.get('zahlensysteme').sicher, false);
  assert.equal(stand.get('strom').sicher, true, '5 von 5 richtig reicht');
  assert.equal(stand.get('rechte').sicher, false, 'zu wenige Aufgaben');
  assert.equal(stand.get('speicher').ok, 1);
  assert.ok(!stand.has('maske'));
});
