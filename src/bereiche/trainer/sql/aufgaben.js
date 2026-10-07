// SQL-Aufgaben. Geprüft wird das Ergebnis, nicht der Wortlaut:
// – Abfragen: gleiche Zeilen (Reihenfolge nur, wenn die Aufgabe sortieren lässt), gleiche Spaltenzahl.
// – Änderungen (INSERT/UPDATE/DELETE): Danach liefert die Prüfabfrage dasselbe wie bei der Musterlösung.
// – Struktur (CREATE/ALTER/INDEX): Prüfabfrage auf die Tabellenbeschreibung.
// – Rechte (GRANT/REVOKE): SQLite kennt keine Benutzer; die Anweisung wird zerlegt und Teil für Teil verglichen.

export const SQL_AUFGABEN = [
  // ---------- SELECT auf einer Tabelle ----------
  { id: 's1', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Spalten auswählen', text: 'Erstellen Sie eine SQL-Anweisung, die von allen Artikeln die Bezeichnung und den Preis ausgibt.', punkte: 2, loesung: 'SELECT bezeichnung, preis FROM artikel;' },
  { id: 's2', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Filtern und sortieren', text: 'Erstellen Sie eine SQL-Anweisung, die Bezeichnung und Preis aller Artikel ausgibt, die mehr als 300 € kosten. Der teuerste Artikel soll zuerst erscheinen.', punkte: 3, loesung: 'SELECT bezeichnung, preis FROM artikel WHERE preis > 300 ORDER BY preis DESC;', sortiert: true },
  { id: 's3', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Bedingungen verknüpfen', text: 'Erstellen Sie eine SQL-Anweisung, die die Firmen aller Kunden mit Sitz in Mainz oder Wiesbaden ausgibt.', punkte: 2, loesung: "SELECT firma FROM kunde WHERE ort = 'Mainz' OR ort = 'Wiesbaden';" },
  { id: 's4', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'LIKE mit Platzhalter', text: 'Erstellen Sie eine SQL-Anweisung, die Vor- und Nachnamen aller Mitarbeiter ausgibt, deren Nachname mit „M“ beginnt.', punkte: 2, loesung: "SELECT vorname, nachname FROM mitarbeiter WHERE nachname LIKE 'M%';" },
  { id: 's5', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Leere Werte finden', text: 'Bei einigen Kunden fehlt der Ort. Erstellen Sie eine SQL-Anweisung, die die Firmen dieser Kunden ausgibt.', punkte: 2, loesung: 'SELECT firma FROM kunde WHERE ort IS NULL;' },
  { id: 's6', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Rechnen in der Ausgabe', text: 'Für die Preisliste werden Bruttopreise benötigt. Erstellen Sie eine SQL-Anweisung, die für alle Artikel der Kategorie 3 Bezeichnung, Nettopreis und Bruttopreis (19 % USt, auf zwei Nachkommastellen gerundet) unter dem Spaltennamen „brutto“ ausgibt.', punkte: 4, loesung: 'SELECT bezeichnung, preis, ROUND(preis * 1.19, 2) AS brutto FROM artikel WHERE kategorie_id = 3;' },
  { id: 's7', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Datumsfunktion YEAR', text: 'Erstellen Sie eine SQL-Anweisung, die Bestellnummer und Datum aller Bestellungen aus dem Jahr 2025 ausgibt, aufsteigend nach Datum sortiert.', punkte: 3, loesung: 'SELECT bestell_id, datum FROM bestellung WHERE YEAR(datum) = 2025 ORDER BY datum;', sortiert: true },
  { id: 's8', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Doppelte entfernen', text: 'Erstellen Sie eine SQL-Anweisung, die jeden Ort, in dem Kunden ansässig sind, genau einmal ausgibt – alphabetisch sortiert und ohne leere Einträge.', punkte: 3, loesung: 'SELECT DISTINCT ort FROM kunde WHERE ort IS NOT NULL ORDER BY ort;', sortiert: true },
  { id: 's9', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Bereich und Verneinung', text: 'Erstellen Sie eine SQL-Anweisung, die Bezeichnung und Bestand aller Artikel ausgibt, deren Bestand zwischen 5 und 20 Stück liegt (Grenzen eingeschlossen) und die nicht zur Kategorie 1 gehören.', punkte: 3, loesung: 'SELECT bezeichnung, bestand FROM artikel WHERE bestand BETWEEN 5 AND 20 AND NOT kategorie_id = 1;' },
  { id: 's10', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Textfunktion LEFT', text: 'Für eine Auswertung nach Regionen wird der PLZ-Bereich benötigt. Erstellen Sie eine SQL-Anweisung, die für alle Kunden mit Postleitzahl die Firma und die ersten beiden Ziffern der Postleitzahl unter dem Namen „plz_bereich“ ausgibt.', punkte: 3, loesung: 'SELECT firma, LEFT(plz, 2) AS plz_bereich FROM kunde WHERE plz IS NOT NULL;' },
  { id: 's11', modus: 'abfragen', sp: 'AP2-4-2-1', titel: 'Betriebszugehörigkeit', text: 'Erstellen Sie eine SQL-Anweisung, die Nachname und Eintrittsdatum aller Mitarbeiter ausgibt, die vor dem Jahr 2018 eingetreten sind. Die dienstältesten Mitarbeiter sollen zuerst erscheinen.', punkte: 3, loesung: "SELECT nachname, eintritt FROM mitarbeiter WHERE eintritt < '2018-01-01' ORDER BY eintritt;", sortiert: true },

  // ---------- JOIN ----------
  { id: 'j1', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Zwei Tabellen verbinden', text: 'Erstellen Sie eine SQL-Anweisung, die für jede Bestellung die Bestellnummer, das Bestelldatum und die Firma des Kunden ausgibt.', punkte: 3, loesung: 'SELECT b.bestell_id, b.datum, k.firma FROM bestellung b INNER JOIN kunde k ON b.kunden_id = k.kunden_id;' },
  { id: 'j2', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Artikel mit Kategorie', text: 'Erstellen Sie eine SQL-Anweisung, die die Bezeichnung jedes Artikels zusammen mit dem Namen seiner Kategorie ausgibt.', punkte: 3, loesung: 'SELECT a.bezeichnung, k.name FROM artikel a JOIN kategorie k ON a.kategorie_id = k.kategorie_id;' },
  { id: 'j3', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Drei Tabellen', text: 'Erstellen Sie eine SQL-Anweisung, die für die Bestellung 1003 alle Positionen mit Artikelbezeichnung, Menge und Einzelpreis ausgibt.', punkte: 4, loesung: 'SELECT a.bezeichnung, p.menge, a.preis FROM bestellposition p JOIN artikel a ON p.artikel_id = a.artikel_id WHERE p.bestell_id = 1003;' },
  { id: 'j4', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Vier Tabellen', text: 'Der Vertrieb möchte wissen, welche Kunden bereits Artikel der Kategorie „Netzwerk“ bestellt haben. Erstellen Sie eine SQL-Anweisung, die die Firmen dieser Kunden ohne Duplikate ausgibt.', punkte: 6, loesung: "SELECT DISTINCT k.firma FROM kunde k JOIN bestellung b ON k.kunden_id = b.kunden_id JOIN bestellposition p ON b.bestell_id = p.bestell_id JOIN artikel a ON p.artikel_id = a.artikel_id JOIN kategorie c ON a.kategorie_id = c.kategorie_id WHERE c.name = 'Netzwerk';" },
  { id: 'j5', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'LEFT JOIN: auch ohne Partner', text: 'Erstellen Sie eine SQL-Anweisung, die für alle Kunden die Firma und die Anzahl ihrer Bestellungen ausgibt. Kunden ohne Bestellung sollen mit der Anzahl 0 erscheinen.', punkte: 5, loesung: 'SELECT k.firma, COUNT(b.bestell_id) AS anzahl FROM kunde k LEFT JOIN bestellung b ON k.kunden_id = b.kunden_id GROUP BY k.kunden_id, k.firma;' },
  { id: 'j6', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Wer hat nie bestellt?', text: 'Erstellen Sie mithilfe eines LEFT JOIN eine SQL-Anweisung, die die Firmen aller Kunden ausgibt, die noch keine Bestellung aufgegeben haben.', punkte: 4, loesung: 'SELECT k.firma FROM kunde k LEFT JOIN bestellung b ON k.kunden_id = b.kunden_id WHERE b.bestell_id IS NULL;' },
  { id: 'j7', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Tabelle mit sich selbst verbinden', text: 'Erstellen Sie eine SQL-Anweisung, die für jeden Mitarbeiter den Nachnamen und den Nachnamen seines Vorgesetzten ausgibt. Auch Mitarbeiter ohne Vorgesetzten sollen erscheinen.', punkte: 5, loesung: 'SELECT m.nachname, v.nachname AS vorgesetzter FROM mitarbeiter m LEFT JOIN mitarbeiter v ON m.vorgesetzter_id = v.ma_id;' },
  { id: 'j8', modus: 'abfragen', sp: 'AP2-4-2-2', titel: 'Kategorien ohne Artikel', text: 'Erstellen Sie eine SQL-Anweisung, die alle Kategorien mit der Anzahl ihrer Artikel ausgibt. Auch Kategorien ohne Artikel sollen erscheinen.', punkte: 5, loesung: 'SELECT c.name, COUNT(a.artikel_id) AS artikel FROM kategorie c LEFT JOIN artikel a ON c.kategorie_id = a.kategorie_id GROUP BY c.kategorie_id, c.name;' },

  // ---------- Aggregate ----------
  { id: 'a1', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'Zählen je Gruppe', text: 'Erstellen Sie eine SQL-Anweisung, die je Ort die Anzahl der Kunden ausgibt. Kunden ohne Ort werden nicht berücksichtigt.', punkte: 3, loesung: 'SELECT ort, COUNT(*) AS anzahl FROM kunde WHERE ort IS NOT NULL GROUP BY ort;' },
  { id: 'a2', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'Durchschnitt je Gruppe', text: 'Erstellen Sie eine SQL-Anweisung, die je Kategorienummer den durchschnittlichen Artikelpreis, gerundet auf zwei Nachkommastellen, ausgibt.', punkte: 3, loesung: 'SELECT kategorie_id, ROUND(AVG(preis), 2) AS schnitt FROM artikel GROUP BY kategorie_id;' },
  { id: 'a3', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'Summe über einen JOIN', text: 'Erstellen Sie eine SQL-Anweisung, die je Bestellung die Bestellnummer und den Warenwert (Menge · Preis) ausgibt. Die Bestellung mit dem höchsten Warenwert soll zuerst erscheinen.', punkte: 5, loesung: 'SELECT p.bestell_id, SUM(p.menge * a.preis) AS warenwert FROM bestellposition p JOIN artikel a ON p.artikel_id = a.artikel_id GROUP BY p.bestell_id ORDER BY warenwert DESC;', sortiert: true },
  { id: 'a4', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'HAVING', text: 'Erstellen Sie eine SQL-Anweisung, die die Kundennummern aller Kunden mit mindestens drei Bestellungen sowie die Anzahl ihrer Bestellungen ausgibt.', punkte: 4, loesung: 'SELECT kunden_id, COUNT(*) AS anzahl FROM bestellung GROUP BY kunden_id HAVING COUNT(*) >= 3;' },
  { id: 'a5', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'MIN und MAX', text: 'Erstellen Sie eine SQL-Anweisung, die je Abteilung das niedrigste und das höchste Gehalt ausgibt.', punkte: 3, loesung: 'SELECT abteilung, MIN(gehalt), MAX(gehalt) FROM mitarbeiter GROUP BY abteilung;' },
  { id: 'a6', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'COUNT(*) und COUNT(Spalte)', text: 'Erstellen Sie eine SQL-Anweisung, die in einer Zeile die Anzahl aller Kunden und die Anzahl der Kunden mit eingetragenem Ort ausgibt.', punkte: 3, loesung: 'SELECT COUNT(*), COUNT(ort) FROM kunde;' },
  { id: 'a7', modus: 'abfragen', sp: 'AP2-4-2-3', titel: 'Umsatz je Kunde', text: 'Erstellen Sie eine SQL-Anweisung, die je Kunde die Firma und den gesamten Warenwert aller Bestellungen (Menge · Preis) ausgibt. Es sollen nur Kunden mit einem Warenwert über 3.000 € erscheinen, der höchste zuerst.', punkte: 8, loesung: 'SELECT k.firma, SUM(p.menge * a.preis) AS umsatz FROM kunde k JOIN bestellung b ON k.kunden_id = b.kunden_id JOIN bestellposition p ON b.bestell_id = p.bestell_id JOIN artikel a ON p.artikel_id = a.artikel_id GROUP BY k.kunden_id, k.firma HAVING SUM(p.menge * a.preis) > 3000 ORDER BY umsatz DESC;', sortiert: true },

  // ---------- Unterabfragen und UNION ----------
  { id: 'u1', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'Vergleich mit einem Einzelwert', text: 'Erstellen Sie eine SQL-Anweisung, die Bezeichnung und Preis aller Artikel ausgibt, deren Preis über dem Durchschnittspreis aller Artikel liegt.', punkte: 4, loesung: 'SELECT bezeichnung, preis FROM artikel WHERE preis > (SELECT AVG(preis) FROM artikel);' },
  { id: 'u2', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'Unterabfrage mit IN', text: 'Erstellen Sie mithilfe einer Unterabfrage eine SQL-Anweisung, die die Firmen aller Kunden ausgibt, die im Jahr 2026 bestellt haben.', punkte: 4, loesung: 'SELECT firma FROM kunde WHERE kunden_id IN (SELECT kunden_id FROM bestellung WHERE YEAR(datum) = 2026);' },
  { id: 'u3', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'NOT IN', text: 'Erstellen Sie eine SQL-Anweisung, die die Bezeichnungen aller Artikel ausgibt, die noch nie bestellt wurden.', punkte: 4, loesung: 'SELECT bezeichnung FROM artikel WHERE artikel_id NOT IN (SELECT artikel_id FROM bestellposition);' },
  { id: 'u4', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'EXISTS', text: 'Erstellen Sie mithilfe von EXISTS eine SQL-Anweisung, die die Namen aller Kategorien ausgibt, zu denen mindestens ein Artikel ohne Bestand (Bestand 0) gehört.', punkte: 5, loesung: 'SELECT name FROM kategorie c WHERE EXISTS (SELECT * FROM artikel a WHERE a.kategorie_id = c.kategorie_id AND a.bestand = 0);' },
  { id: 'u5', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'UNION', text: 'Erstellen Sie eine SQL-Anweisung, die alle Orte ausgibt, in denen Kunden oder Lieferanten ansässig sind – jeden Ort nur einmal, alphabetisch sortiert, ohne leere Einträge.', punkte: 4, loesung: 'SELECT ort FROM kunde WHERE ort IS NOT NULL UNION SELECT ort FROM lieferant ORDER BY ort;', sortiert: true },
  { id: 'u6', modus: 'abfragen', sp: 'AP2-4-2-4', titel: 'Unterabfrage in FROM', text: 'Ermitteln Sie den durchschnittlichen Warenwert einer Bestellung. Bilden Sie dazu in einer Unterabfrage im FROM-Teil den Warenwert je Bestellung und runden Sie den Durchschnitt auf zwei Nachkommastellen.', punkte: 6, loesung: 'SELECT ROUND(AVG(w.wert), 2) FROM (SELECT p.bestell_id, SUM(p.menge * a.preis) AS wert FROM bestellposition p JOIN artikel a ON p.artikel_id = a.artikel_id GROUP BY p.bestell_id) AS w;' },

  // ---------- INSERT, UPDATE, DELETE ----------
  { id: 'd1', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Datensatz einfügen', text: 'Der Kunde „Tanzschule Rhythmus“ aus 55118 Mainz soll mit der Kundennummer 11 und dem Datum 2026-05-01 als „kunde_seit“ erfasst werden. Erstellen Sie die SQL-Anweisung mit ausdrücklicher Spaltenliste.', punkte: 3, loesung: "INSERT INTO kunde (kunden_id, firma, ort, plz, kunde_seit) VALUES (11, 'Tanzschule Rhythmus', 'Mainz', '55118', '2026-05-01');", pruef: 'SELECT * FROM kunde ORDER BY kunden_id' },
  { id: 'd2', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Werte berechnet ändern', text: 'Die Preise aller Monitore (Kategorie 2) werden um 5 % erhöht. Erstellen Sie die SQL-Anweisung.', punkte: 3, loesung: 'UPDATE artikel SET preis = preis * 1.05 WHERE kategorie_id = 2;', pruef: 'SELECT artikel_id, ROUND(preis, 2) FROM artikel ORDER BY artikel_id' },
  { id: 'd3', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Löschen mit Bedingung', text: 'Erstellen Sie eine SQL-Anweisung, die alle Artikel löscht, die keinen Bestand haben und noch nie bestellt wurden.', punkte: 4, loesung: 'DELETE FROM artikel WHERE bestand = 0 AND artikel_id NOT IN (SELECT artikel_id FROM bestellposition);', pruef: 'SELECT artikel_id FROM artikel ORDER BY artikel_id' },
  { id: 'd4', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Textfunktion beim Ändern', text: 'Die Ortsnamen aller Kunden sollen einheitlich in Großbuchstaben gespeichert werden. Erstellen Sie die SQL-Anweisung.', punkte: 2, loesung: 'UPDATE kunde SET ort = UPPER(ort);', pruef: 'SELECT kunden_id, ort FROM kunde ORDER BY kunden_id' },
  { id: 'd5', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Abhängige Datensätze löschen', text: 'Die Bestellung 1005 wurde storniert und soll vollständig gelöscht werden. Erstellen Sie die SQL-Anweisungen in der richtigen Reihenfolge, sodass keine Bestellpositionen ohne Bestellung zurückbleiben.', punkte: 4, loesung: 'DELETE FROM bestellposition WHERE bestell_id = 1005; DELETE FROM bestellung WHERE bestell_id = 1005;', pruef: "SELECT 'b', bestell_id, 0 FROM bestellung UNION ALL SELECT 'p', bestell_id, artikel_id FROM bestellposition ORDER BY 1, 2, 3", fk: true },
  { id: 'd6', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'INSERT … SELECT: archivieren', text: 'Die Tabelle bestellung_archiv (gleicher Aufbau wie bestellung) ist bereits angelegt. Erstellen Sie eine SQL-Anweisung, die alle Bestellungen aus dem Jahr 2024 in diese Tabelle überträgt.', punkte: 4, vorbereitung: 'CREATE TABLE bestellung_archiv (bestell_id INTEGER PRIMARY KEY, kunden_id INTEGER, ma_id INTEGER, datum DATE);', loesung: 'INSERT INTO bestellung_archiv SELECT * FROM bestellung WHERE YEAR(datum) = 2024;', pruef: 'SELECT * FROM bestellung_archiv ORDER BY bestell_id' },
  { id: 'd7', modus: 'aendern', sp: 'AP2-4-3-1', titel: 'Gehaltserhöhung', text: 'Alle Mitarbeiter der Abteilung „Technik“ erhalten eine Gehaltserhöhung um 150 €. Erstellen Sie die SQL-Anweisung.', punkte: 2, loesung: "UPDATE mitarbeiter SET gehalt = gehalt + 150 WHERE abteilung = 'Technik';", pruef: 'SELECT ma_id, gehalt FROM mitarbeiter ORDER BY ma_id' },

  // ---------- CREATE, ALTER, DROP, INDEX ----------
  { id: 't1', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Tabelle anlegen', text: 'Erstellen Sie die SQL-Anweisung, die die Tabelle wartung mit folgenden Attributen anlegt: wartung_id (Ganzzahl, Primärschlüssel), artikel_id (Ganzzahl, Fremdschlüssel auf artikel), datum (Datum), bemerkung (Text, bis 200 Zeichen).', punkte: 6, loesung: 'CREATE TABLE wartung (wartung_id INTEGER PRIMARY KEY, artikel_id INTEGER, datum DATE, bemerkung VARCHAR(200), FOREIGN KEY (artikel_id) REFERENCES artikel(artikel_id));', pruef: "SELECT lower(name), pk FROM pragma_table_info('wartung') ORDER BY cid", pruef2: "SELECT lower(\"table\"), lower(\"from\"), lower(\"to\") FROM pragma_foreign_key_list('wartung')" },
  { id: 't2', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Spalte hinzufügen', text: 'Die Tabelle kunde soll um das Attribut email (Text, bis 100 Zeichen) erweitert werden. Erstellen Sie die SQL-Anweisung.', punkte: 2, loesung: 'ALTER TABLE kunde ADD COLUMN email VARCHAR(100);', pruef: "SELECT lower(name) FROM pragma_table_info('kunde') ORDER BY cid" },
  { id: 't3', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Index anlegen', text: 'Für schnellere Suchen soll auf das Attribut bezeichnung der Tabelle artikel ein Index mit dem Namen idx_bezeichnung angelegt werden. Erstellen Sie die SQL-Anweisung.', punkte: 2, loesung: 'CREATE INDEX idx_bezeichnung ON artikel (bezeichnung);', pruef: "SELECT lower(name) FROM pragma_index_list('artikel') WHERE lower(name) = 'idx_bezeichnung'", pruef2: "SELECT lower(name) FROM pragma_index_info('idx_bezeichnung')" },
  { id: 't4', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Tabelle löschen', text: 'Die Tabelle lieferant wird nicht mehr benötigt. Erstellen Sie die SQL-Anweisung, die sie löscht.', punkte: 1, loesung: 'DROP TABLE lieferant;', pruef: "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name" },
  { id: 't5', modus: 'struktur', sp: 'AP2-4-3-2', titel: 'Spalte umbauen', text: 'Die Tabelle mitarbeiter soll um das Attribut name (Text, bis 61 Zeichen) erweitert werden, das mit „Vorname Nachname“ (mit Leerzeichen) gefüllt wird. Erstellen Sie die beiden SQL-Anweisungen.', punkte: 5, loesung: "ALTER TABLE mitarbeiter ADD COLUMN name VARCHAR(61); UPDATE mitarbeiter SET name = vorname || ' ' || nachname;", pruef: 'SELECT ma_id, name FROM mitarbeiter ORDER BY ma_id' },
];

// ---------- Rechte: GRANT / REVOKE / CREATE USER ----------

export const RECHTE_AUFGABEN = [
  { id: 'r1', titel: 'Leserecht vergeben', text: 'Der Benutzer azubi soll die Tabelle artikel lesen dürfen. Erstellen Sie die SQL-Anweisung.', punkte: 2, soll: { art: 'GRANT', rechte: ['SELECT'], objekt: 'artikel', benutzer: 'azubi', weitergabe: false }, loesung: 'GRANT SELECT ON artikel TO azubi;' },
  { id: 'r2', titel: 'Mehrere Rechte mit Weitergabe', text: 'Der Benutzer vertrieb soll in der Tabelle kunde Datensätze lesen und ändern dürfen und diese Rechte an andere Benutzer weitergeben können. Erstellen Sie die SQL-Anweisung.', punkte: 3, soll: { art: 'GRANT', rechte: ['SELECT', 'UPDATE'], objekt: 'kunde', benutzer: 'vertrieb', weitergabe: true }, loesung: 'GRANT SELECT, UPDATE ON kunde TO vertrieb WITH GRANT OPTION;' },
  { id: 'r3', titel: 'Recht entziehen', text: 'Dem Benutzer praktikant soll das Recht entzogen werden, Datensätze in die Tabelle bestellung einzufügen. Erstellen Sie die SQL-Anweisung.', punkte: 2, soll: { art: 'REVOKE', rechte: ['INSERT'], objekt: 'bestellung', benutzer: 'praktikant' }, loesung: 'REVOKE INSERT ON bestellung FROM praktikant;' },
  { id: 'r4', titel: 'Nur was gebraucht wird', text: 'Der Benutzer buchhaltung soll Bestellungen lesen und neu anlegen, aber weder ändern noch löschen dürfen. Erstellen Sie die SQL-Anweisung nach dem Prinzip der minimalen Rechte.', punkte: 3, soll: { art: 'GRANT', rechte: ['SELECT', 'INSERT'], objekt: 'bestellung', benutzer: 'buchhaltung', weitergabe: false }, loesung: 'GRANT SELECT, INSERT ON bestellung TO buchhaltung;' },
  { id: 'r5', titel: 'Benutzer anlegen', text: 'Legen Sie den Benutzer pruefer mit dem Passwort Start#2026 an.', punkte: 2, soll: { art: 'CREATE USER', benutzer: 'pruefer', passwort: 'Start#2026' }, loesung: "CREATE USER pruefer IDENTIFIED BY 'Start#2026';" },
  { id: 'r6', titel: 'Alle Rechte entziehen', text: 'Dem Benutzer gast sollen alle Rechte an der Tabelle mitarbeiter entzogen werden. Erstellen Sie die SQL-Anweisung.', punkte: 2, soll: { art: 'REVOKE', rechte: ['ALL'], objekt: 'mitarbeiter', benutzer: 'gast' }, loesung: 'REVOKE ALL PRIVILEGES ON mitarbeiter FROM gast;' },
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
