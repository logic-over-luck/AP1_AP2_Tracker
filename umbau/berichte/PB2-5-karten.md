# PB2-5 Karten – SQL: Daten abfragen

Stand: 16.10.2026 · Vorgehen wie `umbau/auftraege/AP1-karten.md` (für PB2 sinngemäß) · Ergebnis
`umbau/karten/pb2/PB2-5.json`, Kurzfassung `umbau/kurz/pb2/PB2-5.json`

**PB2-5 Karten: 57 bleiben, 2 bearbeitet, 0 entfernt, 31 neu**

## Zahlen

| Entscheidung | Karten |
|---|---|
| bleibt | 57 |
| bearbeitet | 2 |
| entfernt | 0 |
| neu | 31 |
| **alte AP2-Karten (Zielordner PB2-5 nach `alt_neu`)** | **59** |
| **Karten danach** | **90** |

Davon innerhalb des Ordners an eine andere Aussage gehängt (ID bleibt): 4 (Vergleichsoperatoren → K2,
DISTINCT → K1, LEFT/RIGHT → neue Aussage K6, „Woran erkennt man LEFT JOIN“ → PB2-5-1-5-K4).
Können-Aussagen: 25; mit Karte: 25; in `nicht_abgefragt`: 0; vorher ohne Karte: 8
(PB2-5-1-1-K6, -1-2-K4, -1-3-K5, -1-4-K5 und alle vier von PB2-5-1-5). Unsicher: 1.

| Stufe | Aussagen | Karten |
|---|---|---|
| 1 | 1 | 1 |
| 3 | 24 | 89 |

## Auffälligkeiten

- Keine gestrichenen alten Aussagen in `alt_neu` von PB2-5; nach dem Ordnertausch (P39) stammen alle 59 Karten
  aus AP2-4-2-*.
- Bearbeitet: `SELECT *`-Karte zur Spaltenauswahl in Reihenfolge der Ergebnistabelle (Aussage K1);
  DATEDIFF/DATEADD in der Form des SQL-Auszugs mit Datumsteil (`DATEDIFF(MINUTE, …)`).
- Neue Karten decken die Neuerungen der Aussagen ab: IN/BETWEEN, Spaltenvergleich, `LIKE '___3%'`, WEEKDAY,
  Alias mit Leerzeichen in doppelten Anführungszeichen (P41), Bedingung in ON beim LEFT JOIN, Selbst-Join,
  NOT-IN-NULL-Falle, UNION ALL mit Archiv, korrelierte Unterabfragen, Modell lesen (PB2-5-1-5).
- Unsicher: PB2-5-1-1-K6-2 nimmt für das Zerlegen am Leerzeichen beispielhaft `POSITION(' ' IN …)` und
  `CHAR_LENGTH` an; in der Prüfung gibt die Aufgabe die Funktion vor.
- Alle vollständigen SQL-Anweisungen aus Kurzfassung und Karten an einer Beispieldatenbank (PostgreSQL 16 mit
  Hilfsfunktionen YEAR/MONTH/WEEKDAY) ausgeführt; DATEDIFF/DATEADD mit einem SQL-Parser geprüft.
  Absichtlich falsch ist nur die alte Karte AP2-4-2-3-K2-3 („Was ist falsch an …“).
