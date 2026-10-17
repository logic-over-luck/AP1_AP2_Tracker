# PB2-6 Karten – SQL: Tabellen, Datenpflege und Rechte

Stand: 16.10.2026 · Vorgehen wie `umbau/auftraege/AP1-karten.md` (für PB2 sinngemäß) · Ergebnis
`umbau/karten/pb2/PB2-6.json`, Kurzfassung `umbau/kurz/pb2/PB2-6.json`

**PB2-6 Karten: 36 bleiben, 3 bearbeitet, 2 entfernt, 21 neu**

## Zahlen

| Entscheidung | Karten |
|---|---|
| bleibt | 36 |
| bearbeitet | 3 |
| entfernt | 2 |
| neu | 21 |
| **alte AP2-Karten (Zielordner PB2-6 nach `alt_neu`)** | **41** |
| **Karten danach** | **60** |

Davon innerhalb des Ordners an eine andere Aussage gehängt (ID bleibt): 3 (Zweck des Index und „wann lohnt
sich ein Index“ → K4, Folgen eines ungeprüften Imports → PB2-6-1-5-K1).
Können-Aussagen: 19; mit Karte: 19; in `nicht_abgefragt`: 0; vorher ohne Karte: 5 (PB2-6-1-1-K3, -K6, -K7,
-1-2-K6, -1-5-K2). Unsicher: 1.

| Stufe | Aussagen | Karten |
|---|---|---|
| 2 | 5 | 13 |
| 3 | 12 | 42 |
| 4 | 2 | 5 |

## Auffälligkeiten

- **Karten zu gestrichenen Aussagen** (17) stehen nicht im Protokoll: Nach `alt_neu` sind AP2-4-3-1-K5
  (Löschweitergabe, P36), AP2-4-3-2-K4 (Befehlsgruppen) und AP2-6-6-3-K1–K5 (Datenmengen, E2) gestrichen;
  der Test ordnet solche Karten keinem PB2-Ordner zu und lässt einen Protokolleintrag nicht zu. Betroffen:
  AP2-4-3-1-K5-1 bis -3, AP2-4-3-2-K4-1/-2, AP2-6-6-3-K1-1 bis -3, -K2-1 bis -3, -K3-1/-2, -K4-1, -K5-1 bis -3.
  Sie erscheinen in der Vorschau nicht mehr.
- Entfernt: AP2-4-1-1-K4-3 (PLZ als CHAR statt INTEGER – Datentypwahl steht in PB1-6-1-2-K2) und
  AP2-4-3-3-K4-2 (Minimalprinzip – steht in AP1-7 und PB1-10-2-1), beide P36.
- Behalten, obwohl nahe an PB1-6-1-2-K2: AP2-4-1-1-K4-1/-2 (SQL-Typnamen und `DECIMAL(p,s)`); sie fragen die
  Schreibweise in CREATE TABLE ab, PB1-6 fragt allgemeine Datentypen.
- Bearbeitet nach P41 auf die Form des SQL-Auszugs: `ADD COLUMN`, `MODIFY COLUMN` (vorher zwei Dialekte
  gleichrangig); die Importkarte AP2-4-4-3-K2-1 wurde zum Mini-Fall mit Entscheidung (Stufe 4).
- Datenpflege mit Unterabfragen in Standardform (keine `UPDATE … FROM … JOIN`, kein `SELECT … INTO`),
  Archivieren in einer Transaktion mit `START TRANSACTION … COMMIT`.
- Unsicher: PB2-6-1-2-K6-3 (wann pessimistisch sperren) stützt sich auf allgemeine Fachliteratur, nicht auf
  einen Beleg.
- SQL-Anweisungen an einer Beispieldatenbank (PostgreSQL 16) ausgeführt; systemeigene Formen des Auszugs
  (`MODIFY COLUMN`, `CREATE USER … IDENTIFIED BY`, `Datenbank.*`) mit einem SQL-Parser bzw. nach MySQL-Syntax
  geprüft.
