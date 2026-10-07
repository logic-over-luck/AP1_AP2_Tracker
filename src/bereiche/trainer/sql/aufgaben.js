// SQL-Aufgaben. Geprüft wird das Ergebnis, nicht der Wortlaut:
// – Abfragen: gleiche Zeilen (Reihenfolge nur, wenn die Aufgabe sortieren lässt), gleiche Spaltenzahl.
// – Änderungen (INSERT/UPDATE/DELETE): Danach liefert die Prüfabfrage dasselbe wie bei der Musterlösung.
// – Struktur (CREATE/ALTER/INDEX): Prüfabfrage auf die Tabellenbeschreibung.
// – Rechte (GRANT/REVOKE): SQLite kennt keine Benutzer; die Anweisung wird zerlegt und Teil für Teil verglichen.

export const SQL_AUFGABEN = [
  // ---------- SELECT auf einer Tabelle ----------
  { id: 's1', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Spalten auswählen', text: 'Gib von allen Artikeln die Bezeichnung und den Preis aus.', loesung: 'SELECT bezeichnung, preis FROM artikel;' },
  { id: 's2', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Filtern und sortieren', text: 'Gib Bezeichnung und Preis aller Artikel aus, die mehr als 300 € kosten – der teuerste zuerst.', loesung: 'SELECT bezeichnung, preis FROM artikel WHERE preis > 300 ORDER BY preis DESC;', sortiert: true },
  { id: 's3', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Bedingungen verknüpfen', text: 'Gib die Firmen aller Kunden aus, die in Mainz oder Wiesbaden sitzen.', loesung: "SELECT firma FROM kunde WHERE ort = 'Mainz' OR ort = 'Wiesbaden';" },
  { id: 's4', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'LIKE mit Platzhalter', text: 'Gib Vor- und Nachname aller Mitarbeiter aus, deren Nachname mit „M" beginnt.', loesung: "SELECT vorname, nachname FROM mitarbeiter WHERE nachname LIKE 'M%';" },
  { id: 's5', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Leere Werte finden', text: 'Welche Kunden haben keinen Ort eingetragen? Gib die Firma aus.', loesung: 'SELECT firma FROM kunde WHERE ort IS NULL;' },
  { id: 's6', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Rechnen in der Ausgabe', text: 'Gib Bezeichnung, Nettopreis und den Bruttopreis (19 % Umsatzsteuer, auf 2 Stellen gerundet) unter dem Namen „brutto" für alle Artikel der Kategorie 3 aus.', loesung: 'SELECT bezeichnung, preis, ROUND(preis * 1.19, 2) AS brutto FROM artikel WHERE kategorie_id = 3;' },
  { id: 's7', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Datumsfunktion YEAR', text: 'Gib Bestellnummer und Datum aller Bestellungen aus dem Jahr 2025 aus, nach Datum aufsteigend.', loesung: 'SELECT bestell_id, datum FROM bestellung WHERE YEAR(datum) = 2025 ORDER BY datum;', sortiert: true },
  { id: 's8', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Doppelte entfernen', text: 'Gib jeden Ort, in dem Kunden sitzen, genau einmal aus – alphabetisch sortiert. Kunden ohne Ort bleiben außen vor.', loesung: 'SELECT DISTINCT ort FROM kunde WHERE ort IS NOT NULL ORDER BY ort;', sortiert: true },
  { id: 's9', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Bereich und Verneinung', text: 'Gib Bezeichnung und Bestand aller Artikel aus, deren Bestand zwischen 5 und 20 liegt (beide eingeschlossen) und die nicht zur Kategorie 1 gehören.', loesung: 'SELECT bezeichnung, bestand FROM artikel WHERE bestand BETWEEN 5 AND 20 AND NOT kategorie_id = 1;' },
  { id: 's10', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Textfunktion LEFT', text: 'Gib für alle Kunden die Firma und die ersten zwei Ziffern der Postleitzahl als „plz_bereich" aus – nur Kunden mit Postleitzahl.', loesung: 'SELECT firma, LEFT(plz, 2) AS plz_bereich FROM kunde WHERE plz IS NOT NULL;' },
  { id: 's11', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Betriebszugehörigkeit', text: 'Gib Nachname und Eintrittsdatum der Mitarbeiter aus, die vor 2018 eingetreten sind, die dienstältesten zuerst.', loesung: "SELECT nachname, eintritt FROM mitarbeiter WHERE eintritt < '2018-01-01' ORDER BY eintritt;", sortiert: true },

  // ---------- JOIN ----------
  { id: 'j1', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Zwei Tabellen verbinden', text: 'Gib für jede Bestellung die Bestellnummer, das Datum und die Firma des Kunden aus.', loesung: 'SELECT b.bestell_id, b.datum, k.firma FROM bestellung b INNER JOIN kunde k ON b.kunden_id = k.kunden_id;' },
  { id: 'j2', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Artikel mit Kategorie', text: 'Gib die Bezeichnung jedes Artikels zusammen mit dem Namen seiner Kategorie aus.', loesung: 'SELECT a.bezeichnung, k.name FROM artikel a JOIN kategorie k ON a.kategorie_id = k.kategorie_id;' },
  { id: 'j3', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Drei Tabellen', text: 'Gib für Bestellung 1003 jede Position mit Artikelbezeichnung, Menge und Einzelpreis aus.', loesung: 'SELECT a.bezeichnung, p.menge, a.preis FROM bestellposition p JOIN artikel a ON p.artikel_id = a.artikel_id WHERE p.bestell_id = 1003;' },
  { id: 'j4', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Vier Tabellen', text: 'Welche Firmen haben schon einmal einen Artikel der Kategorie „Netzwerk" bestellt? Jede Firma nur einmal.', loesung: "SELECT DISTINCT k.firma FROM kunde k JOIN bestellung b ON k.kunden_id = b.kunden_id JOIN bestellposition p ON b.bestell_id = p.bestell_id JOIN artikel a ON p.artikel_id = a.artikel_id JOIN kategorie c ON a.kategorie_id = c.kategorie_id WHERE c.name = 'Netzwerk';" },
  { id: 'j5', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'LEFT JOIN: auch ohne Partner', text: 'Gib alle Kunden (Firma) mit der Anzahl ihrer Bestellungen aus – auch Kunden ohne Bestellung (Anzahl 0).', loesung: 'SELECT k.firma, COUNT(b.bestell_id) AS anzahl FROM kunde k LEFT JOIN bestellung b ON k.kunden_id = b.kunden_id GROUP BY k.kunden_id, k.firma;' },
  { id: 'j6', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Wer hat nie bestellt?', text: 'Gib die Firmen aller Kunden aus, die noch nie bestellt haben (mit LEFT JOIN).', loesung: 'SELECT k.firma FROM kunde k LEFT JOIN bestellung b ON k.kunden_id = b.kunden_id WHERE b.bestell_id IS NULL;' },
  { id: 'j7', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Tabelle mit sich selbst verbinden', text: 'Gib für jeden Mitarbeiter den Nachnamen und den Nachnamen seines Vorgesetzten aus. Mitarbeiter ohne Vorgesetzten erscheinen auch (Vorgesetzter leer).', loesung: 'SELECT m.nachname, v.nachname AS vorgesetzter FROM mitarbeiter m LEFT JOIN mitarbeiter v ON m.vorgesetzter_id = v.ma_id;' },
  { id: 'j8', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Kategorien ohne Artikel', text: 'Gib alle Kategorien mit der Zahl ihrer Artikel aus, auch Kategorien ohne Artikel.', loesung: 'SELECT c.name, COUNT(a.artikel_id) AS artikel FROM kategorie c LEFT JOIN artikel a ON c.kategorie_id = a.kategorie_id GROUP BY c.kategorie_id, c.name;' },

  // ---------- Aggregate ----------
  { id: 'a1', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'Zählen je Gruppe', text: 'Wie viele Kunden gibt es je Ort? Kunden ohne Ort zählen nicht mit. Gib Ort und Anzahl aus.', loesung: 'SELECT ort, COUNT(*) AS anzahl FROM kunde WHERE ort IS NOT NULL GROUP BY ort;' },
  { id: 'a2', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'Durchschnitt je Gruppe', text: 'Gib je Kategorie-Nummer den durchschnittlichen Artikelpreis aus, auf 2 Stellen gerundet.', loesung: 'SELECT kategorie_id, ROUND(AVG(preis), 2) AS schnitt FROM artikel GROUP BY kategorie_id;' },
  { id: 'a3', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'Summe über einen JOIN', text: 'Berechne den Warenwert (Menge · Preis) je Bestellung. Gib Bestellnummer und Warenwert aus, der höchste zuerst.', loesung: 'SELECT p.bestell_id, SUM(p.menge * a.preis) AS warenwert FROM bestellposition p JOIN artikel a ON p.artikel_id = a.artikel_id GROUP BY p.bestell_id ORDER BY warenwert DESC;', sortiert: true },
  { id: 'a4', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'HAVING', text: 'Welche Kunden (kunden_id) haben mindestens drei Bestellungen? Gib kunden_id und Anzahl aus.', loesung: 'SELECT kunden_id, COUNT(*) AS anzahl FROM bestellung GROUP BY kunden_id HAVING COUNT(*) >= 3;' },
  { id: 'a5', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'MIN und MAX', text: 'Gib je Abteilung das niedrigste und das höchste Gehalt aus.', loesung: 'SELECT abteilung, MIN(gehalt), MAX(gehalt) FROM mitarbeiter GROUP BY abteilung;' },
  { id: 'a6', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'COUNT(*) und COUNT(Spalte)', text: 'Gib in einer Zeile aus: Anzahl aller Kunden und Anzahl der Kunden mit eingetragenem Ort.', loesung: 'SELECT COUNT(*), COUNT(ort) FROM kunde;' },
  { id: 'a7', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'Umsatz je Kunde', text: 'Gib je Firma den gesamten Warenwert aller Bestellungen aus (Menge · Preis), nur Firmen mit mehr als 3.000 €, der höchste zuerst.', loesung: 'SELECT k.firma, SUM(p.menge * a.preis) AS umsatz FROM kunde k JOIN bestellung b ON k.kunden_id = b.kunden_id JOIN bestellposition p ON b.bestell_id = p.bestell_id JOIN artikel a ON p.artikel_id = a.artikel_id GROUP BY k.kunden_id, k.firma HAVING SUM(p.menge * a.preis) > 3000 ORDER BY umsatz DESC;', sortiert: true },

  // ---------- Unterabfragen und UNION ----------
  { id: 'u1', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'Vergleich mit einem Einzelwert', text: 'Gib Bezeichnung und Preis aller Artikel aus, die teurer sind als der Durchschnittspreis aller Artikel.', loesung: 'SELECT bezeichnung, preis FROM artikel WHERE preis > (SELECT AVG(preis) FROM artikel);' },
  { id: 'u2', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'Unterabfrage mit IN', text: 'Gib die Firmen aller Kunden aus, die im Jahr 2026 bestellt haben – mit einer Unterabfrage.', loesung: 'SELECT firma FROM kunde WHERE kunden_id IN (SELECT kunden_id FROM bestellung WHERE YEAR(datum) = 2026);' },
  { id: 'u3', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'NOT IN', text: 'Welche Artikel wurden noch nie bestellt? Gib die Bezeichnung aus.', loesung: 'SELECT bezeichnung FROM artikel WHERE artikel_id NOT IN (SELECT artikel_id FROM bestellposition);' },
  { id: 'u4', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'EXISTS', text: 'Gib die Namen aller Kategorien aus, zu denen es mindestens einen Artikel mit Bestand 0 gibt – mit EXISTS.', loesung: 'SELECT name FROM kategorie c WHERE EXISTS (SELECT * FROM artikel a WHERE a.kategorie_id = c.kategorie_id AND a.bestand = 0);' },
  { id: 'u5', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'UNION', text: 'Gib alle Orte aus, in denen Kunden oder Lieferanten sitzen – jeden Ort einmal, alphabetisch, ohne leere Orte.', loesung: 'SELECT ort FROM kunde WHERE ort IS NOT NULL UNION SELECT ort FROM lieferant ORDER BY ort;', sortiert: true },
  { id: 'u6', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'Unterabfrage in FROM', text: 'Wie hoch ist der durchschnittliche Warenwert einer Bestellung? Berechne erst den Warenwert je Bestellung (Unterabfrage in FROM), dann den Durchschnitt, auf 2 Stellen gerundet.', loesung: 'SELECT ROUND(AVG(w.wert), 2) FROM (SELECT p.bestell_id, SUM(p.menge * a.preis) AS wert FROM bestellposition p JOIN artikel a ON p.artikel_id = a.artikel_id GROUP BY p.bestell_id) AS w;' },

  // ---------- INSERT, UPDATE, DELETE ----------
  { id: 'd1', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Datensatz einfügen', text: 'Lege den Kunden 11 „Tanzschule Rhythmus" in Mainz (PLZ 55118) an, Kunde seit 2026-05-01. Nenne die Spalten ausdrücklich.', loesung: "INSERT INTO kunde (kunden_id, firma, ort, plz, kunde_seit) VALUES (11, 'Tanzschule Rhythmus', 'Mainz', '55118', '2026-05-01');", pruef: 'SELECT * FROM kunde ORDER BY kunden_id' },
  { id: 'd2', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Werte berechnet ändern', text: 'Erhöhe die Preise aller Monitore (Kategorie 2) um 5 %.', loesung: 'UPDATE artikel SET preis = preis * 1.05 WHERE kategorie_id = 2;', pruef: 'SELECT artikel_id, ROUND(preis, 2) FROM artikel ORDER BY artikel_id' },
  { id: 'd3', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Löschen mit Bedingung', text: 'Lösche alle Artikel, die keinen Bestand haben und noch nie bestellt wurden.', loesung: 'DELETE FROM artikel WHERE bestand = 0 AND artikel_id NOT IN (SELECT artikel_id FROM bestellposition);', pruef: 'SELECT artikel_id FROM artikel ORDER BY artikel_id' },
  { id: 'd4', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Textfunktion beim Ändern', text: 'Schreibe die Ortsnamen aller Kunden in Großbuchstaben.', loesung: 'UPDATE kunde SET ort = UPPER(ort);', pruef: 'SELECT kunden_id, ort FROM kunde ORDER BY kunden_id' },
  { id: 'd5', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Abhängige Datensätze löschen', text: 'Lösche die Bestellung 1005 vollständig – in der richtigen Reihenfolge, damit keine Positionen ohne Bestellung zurückbleiben. (Zwei Anweisungen, mit ; trennen.)', loesung: 'DELETE FROM bestellposition WHERE bestell_id = 1005; DELETE FROM bestellung WHERE bestell_id = 1005;', pruef: "SELECT 'b', bestell_id, 0 FROM bestellung UNION ALL SELECT 'p', bestell_id, artikel_id FROM bestellposition ORDER BY 1, 2, 3", fk: true },
  { id: 'd6', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'INSERT … SELECT: archivieren', text: 'Die Tabelle bestellung_archiv (gleicher Aufbau wie bestellung) ist angelegt. Übertrage alle Bestellungen aus dem Jahr 2024 dorthin.', vorbereitung: 'CREATE TABLE bestellung_archiv (bestell_id INTEGER PRIMARY KEY, kunden_id INTEGER, ma_id INTEGER, datum DATE);', loesung: 'INSERT INTO bestellung_archiv SELECT * FROM bestellung WHERE YEAR(datum) = 2024;', pruef: 'SELECT * FROM bestellung_archiv ORDER BY bestell_id' },
  { id: 'd7', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Gehaltserhöhung', text: 'Alle Mitarbeiter der Abteilung Technik bekommen 150 € mehr Gehalt.', loesung: "UPDATE mitarbeiter SET gehalt = gehalt + 150 WHERE abteilung = 'Technik';", pruef: 'SELECT ma_id, gehalt FROM mitarbeiter ORDER BY ma_id' },

  // ---------- CREATE, ALTER, DROP, INDEX ----------
  { id: 't1', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Tabelle anlegen', text: 'Lege die Tabelle wartung an: wartung_id (Ganzzahl, Primärschlüssel), artikel_id (Ganzzahl, Fremdschlüssel auf artikel), datum (DATE), bemerkung (Text bis 200 Zeichen).', loesung: 'CREATE TABLE wartung (wartung_id INTEGER PRIMARY KEY, artikel_id INTEGER, datum DATE, bemerkung VARCHAR(200), FOREIGN KEY (artikel_id) REFERENCES artikel(artikel_id));', pruef: "SELECT lower(name), pk FROM pragma_table_info('wartung') ORDER BY cid", pruef2: "SELECT lower(\"table\"), lower(\"from\"), lower(\"to\") FROM pragma_foreign_key_list('wartung')" },
  { id: 't2', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Spalte hinzufügen', text: 'Ergänze die Tabelle kunde um die Spalte email (Text bis 100 Zeichen).', loesung: 'ALTER TABLE kunde ADD COLUMN email VARCHAR(100);', pruef: "SELECT lower(name) FROM pragma_table_info('kunde') ORDER BY cid" },
  { id: 't3', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Index anlegen', text: 'Lege auf die Spalte bezeichnung der Tabelle artikel einen Index mit dem Namen idx_bezeichnung an.', loesung: 'CREATE INDEX idx_bezeichnung ON artikel (bezeichnung);', pruef: "SELECT lower(name) FROM pragma_index_list('artikel') WHERE lower(name) = 'idx_bezeichnung'", pruef2: "SELECT lower(name) FROM pragma_index_info('idx_bezeichnung')" },
  { id: 't4', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Tabelle löschen', text: 'Die Tabelle lieferant wird nicht mehr gebraucht. Lösche sie.', loesung: 'DROP TABLE lieferant;', pruef: "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name" },
  { id: 't5', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Spalte umbauen', text: 'Ergänze in mitarbeiter die Spalte name (Text bis 61 Zeichen) und fülle sie mit „Vorname Nachname" (Leerzeichen dazwischen). Zwei Anweisungen.', loesung: "ALTER TABLE mitarbeiter ADD COLUMN name VARCHAR(61); UPDATE mitarbeiter SET name = vorname || ' ' || nachname;", pruef: 'SELECT ma_id, name FROM mitarbeiter ORDER BY ma_id' },
];

// ---------- Rechte: GRANT / REVOKE / CREATE USER ----------

export const RECHTE_AUFGABEN = [
  { id: 'r1', titel: 'Leserecht vergeben', text: 'Der Benutzer azubi soll die Tabelle artikel lesen dürfen.', soll: { art: 'GRANT', rechte: ['SELECT'], objekt: 'artikel', benutzer: 'azubi', weitergabe: false }, loesung: 'GRANT SELECT ON artikel TO azubi;' },
  { id: 'r2', titel: 'Mehrere Rechte mit Weitergabe', text: 'Der Benutzer vertrieb soll in der Tabelle kunde lesen und ändern dürfen und diese Rechte an andere weitergeben können.', soll: { art: 'GRANT', rechte: ['SELECT', 'UPDATE'], objekt: 'kunde', benutzer: 'vertrieb', weitergabe: true }, loesung: 'GRANT SELECT, UPDATE ON kunde TO vertrieb WITH GRANT OPTION;' },
  { id: 'r3', titel: 'Recht entziehen', text: 'Dem Benutzer praktikant wird das Recht entzogen, Datensätze in bestellung einzufügen.', soll: { art: 'REVOKE', rechte: ['INSERT'], objekt: 'bestellung', benutzer: 'praktikant' }, loesung: 'REVOKE INSERT ON bestellung FROM praktikant;' },
  { id: 'r4', titel: 'Nur was gebraucht wird', text: 'Die Buchhaltung (Benutzer buchhaltung) soll Bestellungen lesen und neue anlegen dürfen, aber nichts ändern oder löschen.', soll: { art: 'GRANT', rechte: ['SELECT', 'INSERT'], objekt: 'bestellung', benutzer: 'buchhaltung', weitergabe: false }, loesung: 'GRANT SELECT, INSERT ON bestellung TO buchhaltung;' },
  { id: 'r5', titel: 'Benutzer anlegen', text: 'Lege den Benutzer pruefer mit dem Passwort Start#2026 an.', soll: { art: 'CREATE USER', benutzer: 'pruefer', passwort: 'Start#2026' }, loesung: "CREATE USER pruefer IDENTIFIED BY 'Start#2026';" },
  { id: 'r6', titel: 'Alle Rechte entziehen', text: 'Dem Benutzer gast werden alle Rechte an der Tabelle mitarbeiter entzogen.', soll: { art: 'REVOKE', rechte: ['ALL'], objekt: 'mitarbeiter', benutzer: 'gast' }, loesung: 'REVOKE ALL PRIVILEGES ON mitarbeiter FROM gast;' },
];

const ohneAnf = (s) => String(s ?? '').replace(/^[`'"]|[`'"]$/g, '').toLowerCase();

// Zerlegt GRANT/REVOKE/CREATE USER. Erlaubt verbreitete Varianten (TABLE-Schlüsselwort,
// Benutzer in Anführungszeichen oder mit @host, ALL oder ALL PRIVILEGES).
export function zerlegeRecht(text) {
  const s = String(text ?? '')
    .trim()
    .replace(/;\s*$/, '')
    .replace(/\s+/g, ' ');
  let m;
  if ((m = s.match(/^GRANT (.+?) ON (?:TABLE )?([\w.`"']+) TO ([\w`"'@.%]+)( WITH GRANT OPTION)?$/i))) {
    return { art: 'GRANT', rechte: rechteListe(m[1]), objekt: ohneAnf(m[2]), benutzer: ohneAnf(m[3].split('@')[0]), weitergabe: !!m[4] };
  }
  if ((m = s.match(/^REVOKE (.+?) ON (?:TABLE )?([\w.`"']+) FROM ([\w`"'@.%]+)$/i))) {
    return { art: 'REVOKE', rechte: rechteListe(m[1]), objekt: ohneAnf(m[2]), benutzer: ohneAnf(m[3].split('@')[0]) };
  }
  if ((m = s.match(/^CREATE USER ([\w`"'@.%]+?)(?: IDENTIFIED BY '(.*)'| WITH PASSWORD '(.*)'| PASSWORD '(.*)')?$/i))) {
    return { art: 'CREATE USER', benutzer: ohneAnf(m[1].split('@')[0]), passwort: m[2] ?? m[3] ?? m[4] ?? null };
  }
  return null;
}

function rechteListe(t) {
  return t
    .split(',')
    .map((x) => x.trim().toUpperCase().replace(/^ALL PRIVILEGES$/, 'ALL'))
    .sort();
}

export function pruefeRecht(eingabe, soll) {
  const ist = zerlegeRecht(eingabe);
  if (!ist) return { ok: false, grund: 'Anweisung nicht erkannt. Aufbau: GRANT recht ON tabelle TO benutzer;' };
  if (ist.art !== soll.art) return { ok: false, grund: `Hier ist ${soll.art} gefragt.` };
  if (soll.benutzer !== ist.benutzer) return { ok: false, grund: 'Benutzer stimmt nicht.' };
  if (soll.art === 'CREATE USER') return { ok: ist.passwort === soll.passwort, grund: ist.passwort === soll.passwort ? null : 'Passwort fehlt oder stimmt nicht.' };
  if (soll.objekt !== ist.objekt) return { ok: false, grund: 'Tabelle stimmt nicht.' };
  if ([...soll.rechte].sort().join() !== ist.rechte.join()) return { ok: false, grund: 'Die Rechte stimmen nicht – nur vergeben, was gebraucht wird.' };
  if (soll.art === 'GRANT' && soll.weitergabe !== ist.weitergabe) return { ok: false, grund: soll.weitergabe ? 'Die Weitergabe fehlt (WITH GRANT OPTION).' : 'Weitergabe war nicht verlangt.' };
  return { ok: true };
}
