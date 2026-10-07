// Grundlagen: alle SQL-Befehle, die der Prüfungskatalog (Anhang „SQL-Syntax") und die Stichpunkte
// AP2-4-1-1 bis AP2-4-3-3 verlangen – je mit Kurzerklärung, Aufbau und einem Beispiel, das auf der
// Übungsdatenbank läuft. Beispiele mit lauf: false (Rechte) zeigt die App nur an.

// Reihenfolge der Klauseln in einer Abfrage
export const KLAUSELN = ['SELECT', 'FROM', 'JOIN … ON', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'];

// Befehlsgruppen
export const BEFEHLSGRUPPEN = [
  { kurz: 'DQL', name: 'Abfragen', befehle: 'SELECT' },
  { kurz: 'DML', name: 'Daten ändern', befehle: 'INSERT, UPDATE, DELETE' },
  { kurz: 'DDL', name: 'Struktur', befehle: 'CREATE, ALTER, DROP' },
  { kurz: 'DCL', name: 'Rechte', befehle: 'GRANT, REVOKE' },
];

export const GRUNDLAGEN = [
  {
    id: 'select',
    titel: 'Abfragen auf eine Tabelle',
    befehle: [
      { name: 'SELECT … FROM', text: 'Spalten auswählen (Projektion). * steht für alle Spalten.', syntax: 'SELECT spalte1, spalte2 FROM tabelle;', beispiel: 'SELECT bezeichnung, preis FROM artikel;' },
      { name: 'AS', text: 'Gibt einer Spalte oder Rechnung einen Namen. In der Ausgabe darf gerechnet werden.', syntax: 'SELECT ausdruck AS name FROM tabelle;', beispiel: 'SELECT bezeichnung, preis * 1.19 AS brutto FROM artikel;' },
      { name: 'DISTINCT', text: 'Entfernt doppelte Zeilen aus dem Ergebnis.', syntax: 'SELECT DISTINCT spalte FROM tabelle;', beispiel: 'SELECT DISTINCT ort FROM kunde;' },
      { name: 'WHERE', text: 'Filtert Zeilen (Selektion). Vergleiche: =  <>  <  >  <=  >=. Text in einfachen Anführungszeichen.', syntax: 'SELECT … FROM tabelle WHERE bedingung;', beispiel: "SELECT firma FROM kunde WHERE ort = 'Mainz';" },
      { name: 'AND · OR · NOT', text: 'Verknüpft Bedingungen. AND bindet stärker als OR – im Zweifel Klammern setzen.', syntax: 'WHERE a = 1 AND (b = 2 OR c = 3)', beispiel: 'SELECT bezeichnung, preis FROM artikel WHERE preis > 200 AND NOT kategorie_id = 1;' },
      { name: 'BETWEEN … AND', text: 'Bereich – beide Grenzen gehören dazu.', syntax: 'WHERE spalte BETWEEN von AND bis', beispiel: 'SELECT bezeichnung, bestand FROM artikel WHERE bestand BETWEEN 5 AND 20;' },
      { name: 'IN (…)', text: 'Wert ist einer aus einer Liste – kürzer als viele OR.', syntax: 'WHERE spalte IN (wert1, wert2)', beispiel: 'SELECT bezeichnung FROM artikel WHERE kategorie_id IN (2, 4);' },
      { name: 'LIKE', text: 'Textmuster: % steht für beliebig viele Zeichen, _ für genau ein Zeichen.', syntax: "WHERE spalte LIKE 'M%'", beispiel: "SELECT vorname, nachname FROM mitarbeiter WHERE nachname LIKE 'M%';" },
      { name: 'IS NULL', text: 'Findet leere Felder. Nie „= NULL“ schreiben – das ist nie wahr.', syntax: 'WHERE spalte IS NULL / IS NOT NULL', beispiel: 'SELECT firma FROM kunde WHERE ort IS NULL;' },
      { name: 'ORDER BY', text: 'Sortiert: ASC aufsteigend (Standard), DESC absteigend. Mehrere Spalten mit Komma.', syntax: 'ORDER BY spalte DESC, spalte2', beispiel: 'SELECT bezeichnung, preis FROM artikel ORDER BY preis DESC;' },
    ],
  },
  {
    id: 'funktionen',
    titel: 'Funktionen aus dem Belegsatz',
    befehle: [
      { name: 'ROUND', text: 'Rundet auf n Nachkommastellen.', syntax: 'ROUND(zahl, n)', beispiel: 'SELECT bezeichnung, ROUND(preis * 1.19, 2) AS brutto FROM artikel;' },
      { name: 'UPPER · LOWER', text: 'Text in Groß- bzw. Kleinbuchstaben.', syntax: 'UPPER(text)', beispiel: 'SELECT UPPER(firma) FROM kunde;' },
      { name: 'LEFT · RIGHT', text: 'Die ersten bzw. letzten n Zeichen eines Textes.', syntax: 'LEFT(text, n)', beispiel: 'SELECT firma, LEFT(plz, 2) AS plz_bereich FROM kunde;' },
      { name: 'YEAR · MONTH', text: 'Jahr bzw. Monat aus einem Datum.', syntax: 'YEAR(datum)', beispiel: 'SELECT bestell_id, datum FROM bestellung WHERE YEAR(datum) = 2025;' },
      { name: 'NOW', text: 'Das heutige Datum.', syntax: 'NOW()', beispiel: 'SELECT NOW() AS heute;' },
      { name: 'DATEDIFF', text: 'Abstand zweier Daten in Tagen (Ende, Start).', syntax: 'DATEDIFF(ende, start)', beispiel: 'SELECT bestell_id, DATEDIFF(NOW(), datum) AS tage_her FROM bestellung;' },
      { name: 'DATEADD', text: 'Rechnet Tage, Monate oder Jahre auf ein Datum.', syntax: "DATEADD('day', anzahl, datum)", beispiel: "SELECT bestell_id, datum, DATEADD('day', 14, datum) AS faellig FROM bestellung;" },
    ],
  },
  {
    id: 'join',
    titel: 'Mehrere Tabellen: JOIN',
    befehle: [
      { name: 'INNER JOIN … ON', text: 'Verbindet Zeilen, die zusammenpassen – meist Fremdschlüssel = Primärschlüssel. Nur Treffer erscheinen.', syntax: 'FROM a INNER JOIN b ON a.fk = b.pk', beispiel: 'SELECT b.bestell_id, b.datum, k.firma FROM bestellung b INNER JOIN kunde k ON b.kunden_id = k.kunden_id;' },
      { name: 'Aliasnamen', text: 'Kurze Namen für Tabellen (bestellung b). Gleichnamige Spalten dann eindeutig mit b.spalte.', syntax: 'FROM tabelle t', beispiel: 'SELECT a.bezeichnung, k.name FROM artikel a JOIN kategorie k ON a.kategorie_id = k.kategorie_id;' },
      { name: 'Mehr als zwei Tabellen', text: 'JOINs einfach aneinanderhängen – jeder mit eigenem ON.', syntax: 'FROM a JOIN b ON … JOIN c ON …', beispiel: 'SELECT k.firma, a.bezeichnung, p.menge FROM kunde k JOIN bestellung b ON k.kunden_id = b.kunden_id JOIN bestellposition p ON b.bestell_id = p.bestell_id JOIN artikel a ON p.artikel_id = a.artikel_id;' },
      { name: 'LEFT JOIN', text: 'Alle Zeilen der linken Tabelle – auch ohne Partner rechts (dort dann NULL). Typisch: „auch Kunden ohne Bestellung“.', syntax: 'FROM a LEFT JOIN b ON …', beispiel: 'SELECT k.firma, b.bestell_id FROM kunde k LEFT JOIN bestellung b ON k.kunden_id = b.kunden_id;' },
      { name: 'RIGHT JOIN', text: 'Spiegelbild des LEFT JOIN: alle Zeilen der rechten Tabelle.', syntax: 'FROM a RIGHT JOIN b ON …', beispiel: 'SELECT a.bezeichnung, c.name FROM artikel a RIGHT JOIN kategorie c ON a.kategorie_id = c.kategorie_id;' },
    ],
  },
  {
    id: 'gruppieren',
    titel: 'Aggregatfunktionen und Gruppieren',
    befehle: [
      { name: 'COUNT · SUM · AVG · MIN · MAX', text: 'Fassen viele Zeilen zu einem Wert zusammen. COUNT(*) zählt alle Zeilen, COUNT(spalte) nur die ohne NULL.', syntax: 'SELECT COUNT(*), AVG(spalte) FROM tabelle;', beispiel: 'SELECT COUNT(*) AS kunden, COUNT(ort) AS mit_ort FROM kunde;' },
      { name: 'GROUP BY', text: 'Bildet Gruppen. Jede Spalte im SELECT, die nicht aggregiert ist, muss ins GROUP BY.', syntax: 'SELECT spalte, COUNT(*) FROM t GROUP BY spalte;', beispiel: 'SELECT ort, COUNT(*) AS anzahl FROM kunde GROUP BY ort;' },
      { name: 'HAVING', text: 'Filtert Gruppen nach dem Gruppieren. WHERE filtert Zeilen davor.', syntax: 'GROUP BY spalte HAVING COUNT(*) >= 3', beispiel: 'SELECT kunden_id, COUNT(*) AS bestellungen FROM bestellung GROUP BY kunden_id HAVING COUNT(*) >= 3;' },
      { name: 'Aggregat mit JOIN', text: 'Erst verbinden, dann gruppieren – z. B. Umsatz je Kunde, sortiert nach der Summe.', syntax: 'FROM a JOIN b ON … GROUP BY … ORDER BY SUM(…) DESC', beispiel: 'SELECT p.bestell_id, SUM(p.menge * a.preis) AS warenwert FROM bestellposition p JOIN artikel a ON p.artikel_id = a.artikel_id GROUP BY p.bestell_id ORDER BY warenwert DESC;' },
    ],
  },
  {
    id: 'unter',
    titel: 'Unterabfragen und UNION',
    befehle: [
      { name: 'Vergleich mit Einzelwert', text: 'Die Unterabfrage liefert genau einen Wert, z. B. den Durchschnitt.', syntax: 'WHERE spalte > (SELECT AVG(spalte) FROM t)', beispiel: 'SELECT bezeichnung, preis FROM artikel WHERE preis > (SELECT AVG(preis) FROM artikel);' },
      { name: 'IN · NOT IN', text: 'Die Unterabfrage liefert eine Liste von Werten.', syntax: 'WHERE id IN (SELECT id FROM …)', beispiel: 'SELECT bezeichnung FROM artikel WHERE artikel_id NOT IN (SELECT artikel_id FROM bestellposition);' },
      { name: 'EXISTS', text: 'Wahr, wenn die Unterabfrage mindestens eine Zeile findet.', syntax: 'WHERE EXISTS (SELECT * FROM … WHERE …)', beispiel: 'SELECT name FROM kategorie c WHERE EXISTS (SELECT * FROM artikel a WHERE a.kategorie_id = c.kategorie_id AND a.bestand = 0);' },
      { name: 'Unterabfrage in FROM', text: 'Ergebnis einer Abfrage wie eine Tabelle nutzen – braucht einen Namen mit AS.', syntax: 'FROM (SELECT …) AS x', beispiel: 'SELECT ROUND(AVG(w.wert), 2) AS schnitt FROM (SELECT bestell_id, SUM(menge) AS wert FROM bestellposition GROUP BY bestell_id) AS w;' },
      { name: 'UNION', text: 'Hängt zwei Ergebnisse mit gleicher Spaltenzahl untereinander, ohne Doppelte (UNION ALL behält sie).', syntax: 'SELECT … UNION SELECT … ORDER BY …', beispiel: 'SELECT ort FROM kunde WHERE ort IS NOT NULL UNION SELECT ort FROM lieferant ORDER BY ort;' },
    ],
  },
  {
    id: 'aendern',
    titel: 'Daten ändern',
    befehle: [
      { name: 'INSERT INTO … VALUES', text: 'Fügt einen Datensatz ein. Spaltenliste angeben – dann ist die Reihenfolge eindeutig.', syntax: 'INSERT INTO t (a, b) VALUES (1, \'x\');', beispiel: "INSERT INTO kategorie (kategorie_id, name) VALUES (7, 'Drucker');\nSELECT * FROM kategorie;" },
      { name: 'INSERT INTO … SELECT', text: 'Fügt das Ergebnis einer Abfrage ein, z. B. beim Archivieren.', syntax: 'INSERT INTO ziel SELECT … FROM quelle WHERE …;', beispiel: "CREATE TABLE archiv (bestell_id INTEGER, datum DATE);\nINSERT INTO archiv SELECT bestell_id, datum FROM bestellung WHERE YEAR(datum) = 2024;\nSELECT * FROM archiv;" },
      { name: 'UPDATE … SET', text: 'Ändert Werte, auch berechnet. Ohne WHERE trifft es alle Zeilen!', syntax: 'UPDATE t SET spalte = wert WHERE …;', beispiel: 'UPDATE artikel SET preis = preis * 1.05 WHERE kategorie_id = 2;\nSELECT bezeichnung, preis FROM artikel WHERE kategorie_id = 2;' },
      { name: 'DELETE FROM', text: 'Löscht Zeilen. Ohne WHERE alle! Abhängige Zeilen (mit Fremdschlüssel) zuerst löschen.', syntax: 'DELETE FROM t WHERE …;', beispiel: 'DELETE FROM bestellposition WHERE bestell_id = 1005;\nDELETE FROM bestellung WHERE bestell_id = 1005;\nSELECT bestell_id FROM bestellung;' },
    ],
  },
  {
    id: 'struktur',
    titel: 'Tabellen, Schlüssel und Index',
    befehle: [
      { name: 'CREATE TABLE', text: 'Legt eine Tabelle an: Spalten mit Datentyp, Primärschlüssel, Fremdschlüssel.', syntax: 'CREATE TABLE t (id INTEGER PRIMARY KEY, …, FOREIGN KEY (x) REFERENCES u(x));', beispiel: 'CREATE TABLE wartung (\n  wartung_id INTEGER PRIMARY KEY,\n  artikel_id INTEGER,\n  datum DATE NOT NULL,\n  FOREIGN KEY (artikel_id) REFERENCES artikel(artikel_id)\n);\nSELECT name, type FROM pragma_table_info(\'wartung\');' },
      { name: 'Datentypen', text: 'INTEGER Ganzzahl · DECIMAL(8,2) Festkomma, für Geld · FLOAT Gleitkomma · VARCHAR(n) Text variabel · CHAR(n) Text fest · DATE Datum · BOOLEAN · BLOB Binärdaten.', syntax: 'preis DECIMAL(8,2)', beispiel: null },
      { name: 'Constraints', text: 'Regeln, die die Datenbank erzwingt: PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK. Das Beispiel verletzt absichtlich eine Regel – die Datenbank lehnt den Datensatz ab.', syntax: 'email VARCHAR(100) UNIQUE, menge INTEGER CHECK (menge > 0)', beispiel: "CREATE TABLE test (id INTEGER PRIMARY KEY, menge INTEGER CHECK (menge > 0));\nINSERT INTO test VALUES (1, -5);" },
      { name: 'ALTER TABLE', text: 'Ändert eine Tabelle: Spalte hinzufügen oder entfernen.', syntax: 'ALTER TABLE t ADD COLUMN c VARCHAR(100); / DROP COLUMN c;', beispiel: 'ALTER TABLE kunde ADD COLUMN email VARCHAR(100);\nSELECT * FROM kunde;' },
      { name: 'DROP TABLE', text: 'Löscht eine ganze Tabelle samt Daten.', syntax: 'DROP TABLE t;', beispiel: "DROP TABLE lieferant;\nSELECT name FROM sqlite_master WHERE type = 'table';" },
      { name: 'CREATE INDEX', text: 'Beschleunigt Suchen und Sortieren. Nachteil: braucht Speicher, bremst Einfügen und Ändern.', syntax: 'CREATE INDEX name ON t (spalte);', beispiel: "CREATE INDEX idx_ort ON kunde (ort);\nSELECT name FROM pragma_index_list('kunde');" },
    ],
  },
  {
    id: 'rechte',
    titel: 'Benutzer und Rechte',
    befehle: [
      { name: 'CREATE USER', text: 'Legt einen Benutzer an.', syntax: "CREATE USER name IDENTIFIED BY 'passwort';", beispiel: "CREATE USER azubi IDENTIFIED BY 'Start#2026';", lauf: false },
      { name: 'GRANT', text: 'Gibt Rechte (SELECT, INSERT, UPDATE, DELETE, ALL) auf eine Tabelle – nur so viele wie nötig.', syntax: 'GRANT recht, recht ON tabelle TO benutzer;', beispiel: 'GRANT SELECT, UPDATE ON kunde TO vertrieb;', lauf: false },
      { name: 'WITH GRANT OPTION', text: 'Der Benutzer darf das Recht an andere weitergeben.', syntax: 'GRANT … TO benutzer WITH GRANT OPTION;', beispiel: 'GRANT SELECT ON artikel TO teamleitung WITH GRANT OPTION;', lauf: false },
      { name: 'REVOKE', text: 'Entzieht ein Recht wieder.', syntax: 'REVOKE recht ON tabelle FROM benutzer;', beispiel: 'REVOKE INSERT ON bestellung FROM praktikant;', lauf: false },
    ],
  },
];
