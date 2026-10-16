# PB2-2 Karten – Suchen, Sortieren, Rekursion und Generik

Stand: 16.10.2026 · Vorgehen wie `umbau/auftraege/AP1-karten.md` (für PB2 sinngemäß) · Ergebnis `umbau/karten/pb2/PB2-2.json`, Kurzfassung `umbau/kurz/pb2/PB2-2.json`

**PB2-2 Karten: 12 bleiben, 1 bearbeitet, 0 entfernt, 17 neu**

## Zahlen

| Entscheidung | Karten |
|---|---|
| bleibt | 12 |
| bearbeitet | 1 |
| entfernt | 0 |
| neu | 17 |
| **alte AP2-Karten (Zielordner PB2-2)** | **13** |
| **Karten danach** | **30** |

Innerhalb des Ordners an eine andere Aussage gehängt (ID bleibt): 2 (AP2-3-2-3-K5-1, -K5-2: Tausch über Hilfsvariable → PB2-2-1-1-K4, wie im `alt_neu`-Grund vermerkt).
Können-Aussagen: 11; mit Karte: 11; in `nicht_abgefragt`: 0; vorher ohne passende Karte: 6 (Rekursion PB2-2-1-3-K1 bis -K4, Generik PB2-2-1-4-K1, -K2). Unsicher: 0.

| Stufe | Aussagen | Karten |
|---|---|---|
| 2 | 7 | 17 |
| 3 | 4 | 13 |

## Auffälligkeiten

- Die alten Such- und Sortierkarten passen fast unverändert; ergänzt wurden der Aufwandsvergleich (höchstens 10 Vergleiche bei 1.000 Elementen), Sortieren von Objekten nach Attribut und Bubble Sort als ganze Schreibkarte.
- Rekursion und Generik (Zusatzbausteine) hatten keine alten Karten; alle 13 Karten dort sind neu, Beispiele aus dem Lernplan (Binärumrechnung von 11: 1101 vs. 1011, Gehaltsvergleich mit Kommazahlen).
- Einzige Bearbeitung: AP2-3-2-3-K5-3 (Vergleichsfunktion einsetzen) um die Auswertung „> 0 → tauschen“ ergänzt.
- Pseudocode in den Kurzfassungen und Schreibkarten mit `end if`/`end for`, weil die App Einrückungen nicht darstellt.
