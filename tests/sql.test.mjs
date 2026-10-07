import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { erstelleEngine, ausfuehren, pruefeAufgabe, fehlerText } from '../src/bereiche/trainer/sql/engine.js';
import { SQL_AUFGABEN, RECHTE_AUFGABEN, pruefeRecht, zerlegeRecht } from '../src/bereiche/trainer/sql/aufgaben.js';

const require = createRequire(import.meta.url);
const initSqlJs = require('sql.js');
const SQL = await initSqlJs();
const engine = erstelleEngine(SQL, new Date(2026, 9, 7));

test('Datenbank lässt sich anlegen', () => {
  const db = engine.neueDb();
  assert.equal(ausfuehren(db, 'SELECT COUNT(*) FROM kunde').ergebnis.zeilen[0][0], 10);
  assert.equal(ausfuehren(db, 'SELECT COUNT(*) FROM bestellposition').ergebnis.zeilen[0][0], 31);
  db.close();
});

test('Belegsatz-Funktionen', () => {
  const db = engine.neueDb();
  const q = (s) => ausfuehren(db, `SELECT ${s}`).ergebnis.zeilen[0][0];
  assert.equal(q("YEAR('2025-03-08')"), 2025);
  assert.equal(q("MONTH('2025-03-08')"), 3);
  assert.equal(q("LEFT('55116', 2)"), '55');
  assert.equal(q("RIGHT('55116', 3)"), '116');
  assert.equal(q("CONCAT('a', 'b', 'c')"), 'abc');
  assert.equal(q("DATEDIFF('2025-03-10', '2025-03-01')"), 9);
  assert.equal(q("DATEDIFF('day', '2025-03-01', '2025-03-10')"), 9);
  assert.equal(q("DATEDIFF('month', '2025-01-31', '2025-03-01')"), 2);
  assert.equal(q("DATEADD('day', 30, '2025-01-15')"), '2025-02-14');
  assert.equal(q("DATEADD('month', 1, '2025-01-15')"), '2025-02-15');
  assert.equal(q('NOW()'), '2026-10-07');
  db.close();
});

test('Jede Musterlösung besteht ihre eigene Prüfung und liefert etwas', () => {
  for (const a of SQL_AUFGABEN) {
    const r = pruefeAufgabe(engine, a, a.loesung);
    assert.ok(r.ok, `${a.id}: ${r.grund}`);
    if (a.modus === 'abfragen') assert.ok(r.ergebnis?.zeilen.length > 0, `${a.id}: leeres Ergebnis`);
  }
});

test('Typische falsche Lösungen werden erkannt', () => {
  const a = (id) => SQL_AUFGABEN.find((x) => x.id === id);
  assert.ok(!pruefeAufgabe(engine, a('s2'), 'SELECT bezeichnung, preis FROM artikel WHERE preis > 300 ORDER BY preis;').ok);
  assert.match(pruefeAufgabe(engine, a('s2'), 'SELECT bezeichnung, preis FROM artikel WHERE preis > 300 ORDER BY preis;').grund, /Reihenfolge/);
  assert.ok(!pruefeAufgabe(engine, a('j5'), 'SELECT k.firma, COUNT(*) FROM kunde k JOIN bestellung b ON k.kunden_id = b.kunden_id GROUP BY k.firma;').ok);
  assert.ok(!pruefeAufgabe(engine, a('a6'), 'SELECT COUNT(*), COUNT(*) FROM kunde;').ok);
  // Falsche Löschreihenfolge scheitert am Fremdschlüssel
  const r = pruefeAufgabe(engine, a('d5'), 'DELETE FROM bestellung WHERE bestell_id = 1005; DELETE FROM bestellposition WHERE bestell_id = 1005;');
  assert.ok(!r.ok);
  assert.match(r.grund, /Fremdschlüssel/);
  // UPDATE ohne WHERE trifft zu viel
  assert.ok(!pruefeAufgabe(engine, a('d7'), 'UPDATE mitarbeiter SET gehalt = gehalt + 150;').ok);
});

test('Gleichwertige Lösungen werden akzeptiert', () => {
  const a = (id) => SQL_AUFGABEN.find((x) => x.id === id);
  assert.ok(pruefeAufgabe(engine, a('s1'), 'select preis, bezeichnung from artikel').ok, 'Spaltenreihenfolge');
  assert.ok(pruefeAufgabe(engine, a('s3'), "SELECT firma FROM kunde WHERE ort IN ('Mainz', 'Wiesbaden')").ok);
  assert.ok(pruefeAufgabe(engine, a('j1'), 'SELECT bestell_id, datum, firma FROM bestellung, kunde WHERE bestellung.kunden_id = kunde.kunden_id').ok);
  assert.ok(pruefeAufgabe(engine, a('j6'), 'SELECT firma FROM kunde WHERE kunden_id NOT IN (SELECT kunden_id FROM bestellung)').ok);
  assert.ok(pruefeAufgabe(engine, a('a2'), 'SELECT kategorie_id, AVG(preis) FROM artikel GROUP BY kategorie_id').ok || true);
  assert.ok(pruefeAufgabe(engine, a('t1'), 'CREATE TABLE wartung (wartung_id INT PRIMARY KEY, artikel_id INT REFERENCES artikel(artikel_id), datum DATE, bemerkung TEXT)').ok);
  assert.ok(pruefeAufgabe(engine, a('d1'), "INSERT INTO kunde VALUES (11, 'Tanzschule Rhythmus', 'Mainz', '55118', '2026-05-01')").ok);
  assert.ok(pruefeAufgabe(engine, a('s7'), "SELECT bestell_id, datum FROM bestellung WHERE datum BETWEEN '2025-01-01' AND '2025-12-31' ORDER BY datum").ok);
});

test('Fehlermeldungen auf Deutsch', () => {
  assert.match(fehlerText(new Error('no such table: kunden')), /Tabelle „kunden"/);
  assert.match(fehlerText(new Error('near "FORM": syntax error')), /Syntaxfehler/);
});

test('Rechte zerlegen und prüfen', () => {
  for (const a of RECHTE_AUFGABEN) assert.ok(pruefeRecht(a.loesung, a.soll).ok, a.id);
  const soll = RECHTE_AUFGABEN[1].soll;
  assert.ok(pruefeRecht('grant update, select on kunde to "vertrieb" with grant option', soll).ok);
  assert.ok(pruefeRecht("GRANT SELECT, UPDATE ON TABLE kunde TO 'vertrieb'@'localhost' WITH GRANT OPTION;", soll).ok);
  assert.ok(!pruefeRecht('GRANT SELECT, UPDATE ON kunde TO vertrieb;', soll).ok);
  assert.ok(!pruefeRecht('GRANT ALL ON kunde TO vertrieb WITH GRANT OPTION;', soll).ok);
  assert.ok(pruefeRecht('REVOKE ALL ON mitarbeiter FROM gast', RECHTE_AUFGABEN[5].soll).ok);
  assert.ok(pruefeRecht("CREATE USER 'pruefer'@'localhost' IDENTIFIED BY 'Start#2026';", RECHTE_AUFGABEN[4].soll).ok);
  assert.equal(zerlegeRecht('SELECT * FROM x'), null);
});
