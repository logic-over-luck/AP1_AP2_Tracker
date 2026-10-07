// Grundlagen als kleines Lexikon: alle SQL-Befehle, die der Prüfungskatalog (Anhang „SQL-Syntax") und die
// Stichpunkte AP2-4-1-1 bis AP2-4-3-3 verlangen – je Begriff eine kurze Erklärung, mehr nicht.

// Reihenfolge der Klauseln in einer Abfrage
export const KLAUSELN = ['SELECT', 'FROM', 'JOIN … ON', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'];

// Befehlsgruppen
export const BEFEHLSGRUPPEN = [
  { kurz: 'DQL', name: 'Abfragen', befehle: 'SELECT' },
  { kurz: 'DML', name: 'Daten ändern', befehle: 'INSERT, UPDATE, DELETE' },
  { kurz: 'DDL', name: 'Struktur', befehle: 'CREATE, ALTER, DROP' },
  { kurz: 'DCL', name: 'Rechte', befehle: 'GRANT, REVOKE' },
];

// [Begriff, Erklärung]
export const GRUNDLAGEN = [
  {
    id: 'select',
    titel: 'Abfragen auf eine Tabelle',
    begriffe: [
      ['SELECT … FROM', 'Spalten auswählen (Projektion). * steht für alle Spalten.'],
      ['AS', 'Gibt einer Spalte oder Rechnung einen Namen. In der Ausgabe darf gerechnet werden.'],
      ['DISTINCT', 'Entfernt doppelte Zeilen aus dem Ergebnis.'],
      ['WHERE', 'Filtert Zeilen (Selektion). Vergleiche: =  <>  <  >  <=  >=. Text in einfachen Anführungszeichen.'],
      ['AND · OR · NOT', 'Verknüpft Bedingungen. AND bindet stärker als OR – im Zweifel Klammern setzen.'],
      ['BETWEEN … AND', 'Bereich – beide Grenzen gehören dazu.'],
      ['IN (…)', 'Wert ist einer aus einer Liste – kürzer als viele OR.'],
      ['LIKE', 'Textmuster: % steht für beliebig viele Zeichen, _ für genau ein Zeichen.'],
      ['IS NULL', 'Findet leere Felder. Nie „= NULL“ schreiben – das ist nie wahr.'],
      ['ORDER BY', 'Sortiert: ASC aufsteigend (Standard), DESC absteigend. Mehrere Spalten mit Komma.'],
    ],
  },
  {
    id: 'funktionen',
    titel: 'Funktionen aus dem Belegsatz',
    begriffe: [
      ['ROUND', 'Rundet auf n Nachkommastellen.'],
      ['UPPER · LOWER', 'Text in Groß- bzw. Kleinbuchstaben.'],
      ['LEFT · RIGHT', 'Die ersten bzw. letzten n Zeichen eines Textes.'],
      ['YEAR · MONTH', 'Jahr bzw. Monat aus einem Datum.'],
      ['NOW', 'Das heutige Datum.'],
      ['DATEDIFF', 'Abstand zweier Daten in Tagen (Ende, Start).'],
      ['DATEADD', 'Rechnet Tage, Monate oder Jahre auf ein Datum.'],
    ],
  },
  {
    id: 'join',
    titel: 'Mehrere Tabellen: JOIN',
    begriffe: [
      ['INNER JOIN … ON', 'Verbindet Zeilen, die zusammenpassen – meist Fremdschlüssel = Primärschlüssel. Nur Treffer erscheinen.'],
      ['Aliasnamen', 'Kurze Namen für Tabellen (bestellung b). Gleichnamige Spalten dann eindeutig mit b.spalte.'],
      ['Mehr als zwei Tabellen', 'JOINs einfach aneinanderhängen – jeder mit eigenem ON.'],
      ['LEFT JOIN', 'Alle Zeilen der linken Tabelle – auch ohne Partner rechts (dort dann NULL). Typisch: „auch Kunden ohne Bestellung“.'],
      ['RIGHT JOIN', 'Spiegelbild des LEFT JOIN: alle Zeilen der rechten Tabelle.'],
    ],
  },
  {
    id: 'gruppieren',
    titel: 'Aggregatfunktionen und Gruppieren',
    begriffe: [
      ['COUNT · SUM · AVG · MIN · MAX', 'Fassen viele Zeilen zu einem Wert zusammen. COUNT(*) zählt alle Zeilen, COUNT(spalte) nur die ohne NULL.'],
      ['GROUP BY', 'Bildet Gruppen. Jede Spalte im SELECT, die nicht aggregiert ist, muss ins GROUP BY.'],
      ['HAVING', 'Filtert Gruppen nach dem Gruppieren. WHERE filtert Zeilen davor.'],
      ['Aggregat mit JOIN', 'Erst verbinden, dann gruppieren – z. B. Umsatz je Kunde, sortiert nach der Summe.'],
    ],
  },
  {
    id: 'unter',
    titel: 'Unterabfragen und UNION',
    begriffe: [
      ['Vergleich mit Einzelwert', 'Die Unterabfrage liefert genau einen Wert, z. B. den Durchschnitt.'],
      ['IN · NOT IN', 'Die Unterabfrage liefert eine Liste von Werten.'],
      ['EXISTS', 'Wahr, wenn die Unterabfrage mindestens eine Zeile findet.'],
      ['Unterabfrage in FROM', 'Ergebnis einer Abfrage wie eine Tabelle nutzen – braucht einen Namen mit AS.'],
      ['UNION', 'Hängt zwei Ergebnisse mit gleicher Spaltenzahl untereinander, ohne Doppelte (UNION ALL behält sie).'],
    ],
  },
  {
    id: 'aendern',
    titel: 'Daten ändern',
    begriffe: [
      ['INSERT INTO … VALUES', 'Fügt einen Datensatz ein. Spaltenliste angeben – dann ist die Reihenfolge eindeutig.'],
      ['INSERT INTO … SELECT', 'Fügt das Ergebnis einer Abfrage ein, z. B. beim Archivieren.'],
      ['UPDATE … SET', 'Ändert Werte, auch berechnet. Ohne WHERE trifft es alle Zeilen!'],
      ['DELETE FROM', 'Löscht Zeilen. Ohne WHERE alle! Abhängige Zeilen (mit Fremdschlüssel) zuerst löschen.'],
    ],
  },
  {
    id: 'struktur',
    titel: 'Tabellen, Schlüssel und Index',
    begriffe: [
      ['CREATE TABLE', 'Legt eine Tabelle an: Spalten mit Datentyp, Primärschlüssel, Fremdschlüssel.'],
      ['Datentypen', 'INTEGER Ganzzahl · DECIMAL(8,2) Festkomma, für Geld · FLOAT Gleitkomma · VARCHAR(n) Text variabel · CHAR(n) Text fest · DATE Datum · BOOLEAN · BLOB Binärdaten.'],
      ['Constraints', 'Regeln, die die Datenbank erzwingt: PRIMARY KEY, FOREIGN KEY, NOT NULL, UNIQUE, CHECK.'],
      ['ALTER TABLE', 'Ändert eine Tabelle: Spalte hinzufügen oder entfernen.'],
      ['DROP TABLE', 'Löscht eine ganze Tabelle samt Daten.'],
      ['CREATE INDEX', 'Beschleunigt Suchen und Sortieren. Nachteil: braucht Speicher, bremst Einfügen und Ändern.'],
    ],
  },
  {
    id: 'rechte',
    titel: 'Benutzer und Rechte',
    begriffe: [
      ['CREATE USER', 'Legt einen Benutzer an.'],
      ['GRANT', 'Gibt Rechte (SELECT, INSERT, UPDATE, DELETE, ALL) auf eine Tabelle – nur so viele wie nötig.'],
      ['WITH GRANT OPTION', 'Der Benutzer darf das Recht an andere weitergeben.'],
      ['REVOKE', 'Entzieht ein Recht wieder.'],
    ],
  },
];
