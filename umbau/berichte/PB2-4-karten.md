# PB2-4 Karten – Testszenarien und Testdaten

Stand: 16.10.2026 · Vorgehen wie `umbau/auftraege/AP1-karten.md` (für PB2 sinngemäß) · Ergebnis `umbau/karten/pb2/PB2-4.json`, Kurzfassung `umbau/kurz/pb2/PB2-4.json`

**PB2-4 Karten: 18 bleiben, 6 bearbeitet, 0 entfernt, 16 neu**

## Zahlen

| Entscheidung | Karten |
|---|---|
| bleibt | 18 |
| bearbeitet | 6 |
| entfernt | 0 |
| neu | 16 |
| **alte AP2-Karten (Zielordner PB2-4)** | **24** |
| **Karten danach** | **40** |

Davon innerhalb des Ordners an eine andere Aussage gehängt (ID bleibt): 1 (AP2-5-2-2-K3-2 → PB2-4-1-1-K4, Mindestzahl Testfälle).
Können-Aussagen: 12; mit Karte: 12; in `nicht_abgefragt`: 0. Unsicher: 0.
Vorher ohne Karte: PB2-4-1-1-K4, PB2-4-1-1-K6, PB2-4-1-2-K2.

| Stufe | Aussagen | Karten |
|---|---|---|
| 2 | 2 | 11 |
| 3 | 6 | 18 |
| 4 | 4 | 11 |

## Auffälligkeiten

- Die drei Karten zu statement/branch/path coverage (AP2-1-2-3-K4-1 bis -3) waren inhaltlich doppelt zu den deutschen „Wann erreicht?“-Karten; jetzt fragen sie nur die Übersetzung ab (englischer Text ist in der Prüfung vorgegeben, 2024S).
- Grenzwert-Karte (AP2-5-2-1-K1-2) auf Grenzwert plus Nachbarwerte mit Begründung erweitert; Sonderfälle und Testdatengenerator an den Wortlaut der neuen Aussagen angepasst.
- Die gestrichene Extremwerte-Karte AP2-5-2-1-K2-1 (steht in PB1-9-1-3) steht nicht im Protokoll, aus demselben Grund wie in PB2-3 (Test ordnet gestrichene Karten dem alten AP2-Ordner zu).
