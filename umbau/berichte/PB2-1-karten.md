# PB2-1 Karten – Programmlogik und Pseudocode

Stand: 16.10.2026 · Vorgehen wie `umbau/auftraege/AP1-karten.md` (für PB2 sinngemäß) · Ergebnis `umbau/karten/pb2/PB2-1.json`, Kurzfassung `umbau/kurz/pb2/PB2-1.json`

**PB2-1 Karten: 18 bleiben, 5 bearbeitet, 6 entfernt, 27 neu**

## Zahlen

| Entscheidung | Karten |
|---|---|
| bleibt | 18 |
| bearbeitet | 5 |
| entfernt | 6 |
| neu | 27 |
| **alte AP2-Karten (Zielordner PB2-1)** | **29** |
| **Karten danach** | **50** |

Dazu 4 alte Karten an der gestrichenen Aussage AP2-3-2-1-K3 (AP2-3-2-1-K3-1 bis -4): entfallen, stehen unter `alt_gestrichen` (siehe unten).
Innerhalb des Ordners an eine andere Aussage gehängt (ID bleibt): 1 (AP2-3-2-2-K6-1 → PB2-1-1-1-K2, Schleifengrenze beim Nachbarelement).
Können-Aussagen: 15; mit Karte: 15; in `nicht_abgefragt`: 0; vorher ohne passende Karte: 5 (PB2-1-1-1-K3, -K6, PB2-1-1-2-K7, PB2-1-1-3-K2, -K3). Unsicher: 2.

| Stufe | Aussagen | Karten |
|---|---|---|
| 3 | 15 | 50 |

## Auffälligkeiten

- Entfernt wurden vor allem AP1-Grundlagen (E2/P36): Schleifenarten, fußgesteuerte Eingabeprüfung, Einrücken, `return` (AP1-8-2-1, AP1-8-2-2); dazu eine Doppelung (gültige Indizes) und die Karte „eindeutige Schlüssel sammeln“, die zu keiner Aussage mehr passt.
- Bearbeitet: Aktivitätsdiagramm-Karten auf das Neue zugespitzt (Zählschleife mit Initialisierung/Prüfung/Schrittweite, überschneidungsfreie Bedingungen), Zählschleife auf die Grenze `size() - 1`, Gruppensumme auf das Ergebnisarray mit Index aus dem Fachwert, Methodenaufruf auf den Aufruf über ein Attribut.
- Alle Aussagen sind Stufe 3; die neuen Karten sind deshalb kleine Fälle (Index berechnen, Bedingung formulieren, Grenze setzen). Längere Schreibaufgaben sind auf Teilschritte verteilt, `nicht_abgefragt` blieb leer.
- Gestrichene Aussage: Die vier Karten zu AP2-3-2-1-K3 stehen nicht im `protokoll`, weil der Test „Neue Lernkarten PB2“ entfernte Karten dem Ordner ihrer neuen Aussage zuordnet und eine gestrichene Aussage keinen Ordner hat (gleiches Vorgehen wie in PB1). Die Entscheidung „entfernt“ ist im Feld `alt_gestrichen` festgehalten; die Vorschau lässt sie ohnehin weg.
- Unsicher: Rückgabesemantik von `compare()` (als Annahme „laut Beschreibung“ formuliert, nicht am Aufgabentext 2024W-PB2-A2-b geprüft); Content-Length in Bytes statt Zeichen.
- Kurzfassung: Pseudocode-Zeilen als Liste mit `end if`/`end for`, weil die App Einrückungen nicht darstellt.
