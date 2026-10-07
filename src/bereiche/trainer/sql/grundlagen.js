// Nachschlagewerk im Aufbau des Prüfungs-Belegsatzes „SQL-Syntax (Auszug)": Syntax links, Beschreibung rechts,
// gegliedert nach Tabelle, Schlüssel, Datentypen, Befehle, Datenmanipulation, Berechtigungen, Aggregatfunktionen,
// Funktionen, Operatoren. Formulierungen sind eigene; der Umfang folgt dem Katalog-Anhang und den Stichpunkten
// AP2-4-1-1 bis AP2-4-3-3. Einträge mit drittem Wert true kennt die Übungsdatenbank (SQLite) nicht.

// Reihenfolge der Klauseln in einer Abfrage
export const KLAUSELN = ['SELECT', 'FROM', 'JOIN … ON', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'];

// Befehlsgruppen
export const BEFEHLSGRUPPEN = [
  { kurz: 'DQL', name: 'Abfragen', befehle: 'SELECT' },
  { kurz: 'DML', name: 'Daten ändern', befehle: 'INSERT, UPDATE, DELETE' },
  { kurz: 'DDL', name: 'Struktur', befehle: 'CREATE, ALTER, DROP' },
  { kurz: 'DCL', name: 'Rechte', befehle: 'GRANT, REVOKE' },
];

// [Syntax, Beschreibung, nichtAusfuehrbar?]
export const GRUNDLAGEN = [
  {
    id: 'tabelle',
    titel: 'Tabelle',
    begriffe: [
      ['CREATE TABLE tabelle (\n  spalte DATENTYP,\n  …,\n  PRIMARY KEY (spalte),\n  FOREIGN KEY (spalte) REFERENCES tabelle2(spalte)\n)', 'Legt eine neue, leere Tabelle mit den angegebenen Spalten und Schlüsseln an.'],
      ['ALTER TABLE tabelle ADD COLUMN spalte DATENTYP', 'Fügt einer Tabelle eine Spalte hinzu.'],
      ['ALTER TABLE tabelle DROP COLUMN spalte', 'Entfernt eine Spalte.'],
      ['ALTER TABLE tabelle MODIFY COLUMN spalte DATENTYP', 'Ändert den Datentyp einer Spalte.', true],
      ['ALTER TABLE tabelle ADD FOREIGN KEY (spalte) REFERENCES tabelle2(spalte)', 'Ergänzt nachträglich einen Fremdschlüssel.', true],
      ['DROP TABLE tabelle', 'Löscht die Tabelle samt allen Daten.'],
      ['CREATE INDEX name ON tabelle (spalte)', 'Legt einen Index an: schnelleres Suchen und Sortieren, dafür mehr Speicher und langsameres Einfügen und Ändern.'],
    ],
  },
  {
    id: 'schluessel',
    titel: 'Schlüssel und Regeln',
    begriffe: [
      ['PRIMARY KEY (spalte)', 'Primärschlüssel: identifiziert jeden Datensatz eindeutig. Auch aus mehreren Spalten möglich.'],
      ['FOREIGN KEY (spalte) REFERENCES tabelle(spalte)', 'Fremdschlüssel: verweist auf den Primärschlüssel einer anderen Tabelle.'],
      ['NOT NULL · UNIQUE · CHECK (bedingung)', 'Feld darf nicht leer sein · Wert darf nur einmal vorkommen · Wert muss die Bedingung erfüllen.'],
    ],
  },
  {
    id: 'typen',
    titel: 'Datentypen',
    begriffe: [
      ['INTEGER', 'Ganzzahl'],
      ['DECIMAL(p, s)', 'Festkommazahl mit p Stellen, davon s nach dem Komma – für Geldbeträge'],
      ['DOUBLE · FLOAT', 'Gleitkommazahl'],
      ['CHAR(n)', 'Text mit fester Länge n'],
      ['VARCHAR(n)', 'Text mit höchstens n Zeichen'],
      ['DATE', 'Datum'],
      ['BOOLEAN', 'Wahrheitswert'],
      ['BLOB', 'Große Binärdaten, z. B. Bilder'],
    ],
  },
  {
    id: 'befehle',
    titel: 'Befehle und Klauseln',
    begriffe: [
      ['SELECT * | spalte1, spalte2 …', 'Wählt alle Spalten (*) oder die genannten Spalten aus.'],
      ['SELECT DISTINCT …', 'Wie SELECT, aber ohne doppelte Zeilen.'],
      ['ausdruck AS name', 'Gibt einer Spalte oder Berechnung einen Namen. Tabellen bekommen so einen Kurznamen: FROM kunde AS k.'],
      ['FROM tabelle', 'Tabelle(n), aus denen gelesen wird.'],
      ['[INNER] JOIN tabelle2 ON bedingung', 'Verbindet zwei Tabellen; nur Datensätze mit passendem Partner erscheinen.'],
      ['LEFT [OUTER] JOIN … ON …', 'Alle Datensätze der linken Tabelle, dazu die passenden der rechten – fehlt ein Partner, steht dort NULL.'],
      ['RIGHT [OUTER] JOIN … ON …', 'Spiegelbild: alle Datensätze der rechten Tabelle.'],
      ['WHERE bedingung', 'Filtert Zeilen.'],
      ['GROUP BY spalte1, spalte2 …', 'Bildet Gruppen gleicher Werte – für Aggregatfunktionen je Gruppe.'],
      ['HAVING bedingung', 'Filtert Gruppen (nach GROUP BY). WHERE filtert dagegen Zeilen vor dem Gruppieren.'],
      ['ORDER BY spalte [ASC | DESC] …', 'Sortiert: ASC aufsteigend (Standard), DESC absteigend.'],
      ['WHERE spalte [NOT] IN (SELECT …)', 'Unterabfrage liefert eine Liste; der Wert ist (nicht) darin enthalten.'],
      ['WHERE [NOT] EXISTS (SELECT …)', 'Wahr, wenn die Unterabfrage mindestens eine Zeile liefert.'],
      ['FROM (SELECT …) AS name', 'Das Ergebnis einer Unterabfrage wird wie eine Tabelle benutzt.'],
      ['abfrage1 UNION abfrage2', 'Hängt zwei Ergebnisse mit gleicher Spaltenzahl untereinander, ohne Doppelte.'],
    ],
  },
  {
    id: 'aendern',
    titel: 'Datenmanipulation',
    begriffe: [
      ['INSERT INTO tabelle (spalte1, spalte2)\nVALUES (wert1, wert2)', 'Fügt einen Datensatz mit festen Werten ein.'],
      ['INSERT INTO tabelle (…)\nSELECT … FROM … WHERE …', 'Fügt das Ergebnis einer Abfrage ein, z. B. beim Archivieren.'],
      ['UPDATE tabelle SET spalte = wert [, …]\nWHERE …', 'Ändert Werte. Ohne WHERE sind alle Zeilen betroffen.'],
      ['DELETE FROM tabelle WHERE …', 'Löscht Datensätze. Abhängige Datensätze (mit Fremdschlüssel) zuerst löschen.'],
    ],
  },
  {
    id: 'rechte',
    titel: 'Berechtigungen',
    begriffe: [
      ["CREATE USER benutzer IDENTIFIED BY 'passwort'", 'Legt einen Benutzer mit Passwort an.'],
      ['GRANT recht[, recht] ON tabelle TO benutzer\n[WITH GRANT OPTION]', 'Gibt Rechte (SELECT, INSERT, UPDATE, DELETE, ALL). Mit WITH GRANT OPTION darf der Benutzer sie weitergeben.'],
      ['REVOKE recht ON tabelle FROM benutzer', 'Entzieht ein Recht wieder.'],
    ],
  },
  {
    id: 'aggregat',
    titel: 'Aggregatfunktionen',
    begriffe: [
      ['COUNT(* | spalte)', 'Anzahl der Zeilen; mit Spalte nur die Zeilen, in denen sie nicht NULL ist.'],
      ['SUM(spalte | ausdruck)', 'Summe'],
      ['AVG(spalte | ausdruck)', 'Durchschnitt (arithmetisches Mittel)'],
      ['MIN(…) · MAX(…)', 'Kleinster bzw. größter Wert'],
      ['STDDEV(spalte) · VARIANCE(spalte)', 'Standardabweichung bzw. Varianz'],
    ],
  },
  {
    id: 'funktionen',
    titel: 'Funktionen',
    begriffe: [
      ['LEFT(text, n) · RIGHT(text, n)', 'Die ersten bzw. letzten n Zeichen'],
      ['UPPER(text) · LOWER(text)', 'Text in Groß- bzw. Kleinbuchstaben'],
      ['ROUND(zahl, n)', 'Rundet auf n Nachkommastellen'],
      ['NOW()', 'Aktuelles Datum'],
      ['YEAR(datum) · MONTH(datum) · DAY(datum)', 'Jahr, Monat bzw. Tag aus einem Datum'],
      ['WEEKDAY(datum)', 'Wochentag als Zahl (Montag = 0)'],
      ['HOUR(zeit) · MINUTE(zeit)', 'Stunde bzw. Minute aus einer Zeitangabe'],
      ['DATEADD(teil, anzahl, datum)', 'Rechnet auf ein Datum auf; teil = DAY, MONTH, YEAR'],
      ['DATEDIFF(teil, start, ende)', 'Abstand zweier Daten in der Einheit teil'],
    ],
  },
  {
    id: 'operatoren',
    titel: 'Operatoren',
    begriffe: [
      ['=  <>  <  >  <=  >=', 'Vergleiche (<> heißt ungleich)'],
      ['AND · OR · NOT', 'Logisches UND, ODER, NICHT'],
      ['BETWEEN a AND b', 'Bereich, beide Grenzen eingeschlossen'],
      ["LIKE 'muster'", 'Textvergleich mit Platzhaltern: % beliebig viele Zeichen, _ genau ein Zeichen'],
      ['IS [NOT] NULL', 'Prüft auf leeres Feld – nie „= NULL“'],
      ['+  −  *  /', 'Rechnen'],
    ],
  },
];
