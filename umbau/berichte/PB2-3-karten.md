# PB2-3 Karten – Fehler finden, Debugging und Unit-Tests

Stand: 16.10.2026 · Vorgehen wie `umbau/auftraege/AP1-karten.md` (für PB2 sinngemäß) · Ergebnis `umbau/karten/pb2/PB2-3.json`, Kurzfassung `umbau/kurz/pb2/PB2-3.json`

**PB2-3 Karten: 6 bleiben, 5 bearbeitet, 4 entfernt, 23 neu**

## Zahlen

| Entscheidung | Karten |
|---|---|
| bleibt | 6 |
| bearbeitet | 5 |
| entfernt | 4 |
| neu | 23 |
| **alte AP2-Karten (Zielordner PB2-3)** | **15** |
| **Karten danach** | **34** |

Können-Aussagen: 11; mit Karte: 11; in `nicht_abgefragt`: 0. Unsicher: 1 (F.I.R.S.T. „Timely“).
Vorher ohne Karte: PB2-3-1-1-K3, PB2-3-1-2-K4, PB2-3-1-3-K2, -K3, -K4.

| Stufe | Aussagen | Karten |
|---|---|---|
| 2 | 2 | 5 |
| 3 | 6 | 19 |
| 4 | 3 | 10 |

## Auffälligkeiten

- **P36:** Schreibtischtest-Definition (AP2-5-2-3-K1-1), Ablaufverfolgung (AP2-5-3-1-K2-1) und die beiden Schleifengrenzen-Karten (AP2-5-2-3-K5-3, -K5-4) entfernt – Stoff von AP1-8-2-3/-4. K1 fragt nur Rekursion ab, K4 nur die PB2-typischen Fehlerbilder.
- Alte Karten mit Status `gestrichen` im `alt_neu` (AP2-3-3-3-K2-1 bis -3, AP2-5-3-1-K5-1 bis -3) stehen **nicht** im Protokoll: Der Test ordnet gestrichene Karten keinem PB2-Ordner zu (Zielordner = alter AP2-Ordner) und würde einen Protokolleintrag hier als Fehler werten. Sie fehlen in der Vorschau, wie bei PB1.
- Startwert-Karte (AP2-5-2-3-K5-2) vom Summen- auf das Prüfungsbeispiel Minimum umgestellt; TDD-Karte um Red/Green/Refactor ergänzt.
- Neue Stufe-4-Karten mit Mini-Fall: zwei zusammenwirkende Fehler mit Zeilennummer, Unit-Test von Hand prüfen, Debugger oder print-Debugging je Situation.
