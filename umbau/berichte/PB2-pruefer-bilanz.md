# Bilanz: Unabhängige Prüfung PB2 (K1–K3, Doppeltes und Unnötiges)

> **Hinweis (16.10.2026, P39):** Nach dieser Bilanz wurden die SQL-Ordner getauscht: alt PB2-5 (Datenpflege) = heute PB2-6, alt PB2-6 (Abfragen) = heute PB2-5. Die IDs unten sind die alten.

Stand: 16.10.2026 · Branch `umbau` · Auftrag `umbau/auftraege/PB2-pruefung.md`
Drei unabhängige Prüfer (PB2-1/2, PB2-3/4, PB2-5/6), ohne Kenntnis von `umbau/berichte/`, `meta`, `alt_neu` und den alten Inhalten.
Quellen: `quellen/katalog.md`, `quellen/pruefungen/pb2/*.md` (9 Prüfungen), Exporte AP1 und PB1, `raeume-ap2.json`.
Einzelberichte: `PB2-1-pruefer.md` … `PB2-6-pruefer.md`. Lernpläne wurden nicht geändert.

## Funde je Ordner

Zählung nach erster Art (manche Funde haben zwei Arten).

| Ordner | Teilaufgaben gelesen | Aussagen geprüft | Funde | K1 fehlt | K2 Herkunft | K2 Stufe | falsch/ungenau | doppelt PB2 | doppelt AP1 | doppelt PB1 | anderer Raum | zu fein | Grenze | unklar |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PB2-1 Programmlogik und Pseudocode | 19 | 17 | 18 | 6 | 4 | – | – | 3 | 2 | 2 | 1 | 2 | – | 1 |
| PB2-2 Suchen, Sortieren, Rekursion, Generik | 8 | 12 | 14 | 4 | 2 | 2 | 1 | 2 | – | 1 | – | 3 | – | 2 |
| PB2-3 Fehler, Debugging, Unit-Tests | 13 | 12 | 17 | 4 | – | 3 | – | 2 | 3 | 2 | 1 | 1 | – | 1 |
| PB2-4 Testszenarien und Testdaten | 11 | 14 | 12 | 1 | 1 | – | 2 | 3 | – | 2 | 1 | 2 | – | – |
| PB2-5 SQL: Tabellen, Datenpflege, Rechte | 35 | 20 | 16 | 6 | – | – | 3 | 1 | – | 1 | – | 2 | 1 | 2 |
| PB2-6 SQL: Daten abfragen | 25 | 17 | 12 | 5 | 2 | 1 | 1 | 1 | – | – | – | – | 1 | 1 |
| **Summe** | **111** | **92** | **89** | **26** | **9** | **6** | **7** | **12** | **5** | **8** | **3** | **10** | **2** | **7** |

## Aussagen vorher und nach den Vorschlägen

| Ordner | vorher | nachher | Kern der Änderung |
|---|---|---|---|
| PB2-1 | 17 | 15 (16) | PB2-1-1-4-K1/K2 zusammenfassen; neu: Nachbarvergleich/Gruppenwechsel, Index aus Fachwert; ggf. Datentyp-Falle |
| PB2-2 | 12 | 11 | PB2-2-1-1 und -1-2 zusammenlegen; Rekursion: Stellung zum Selbstaufruf ergänzen |
| PB2-3 | 12 | 10 | Doppelungen zu AP1/PB1 streichen; Unit-Test schreiben (mit TDD, Stufe 3); PB2-3-1-2 ggf. auflösen |
| PB2-4 | 14 | 11 (10) | „erwartet gegen tatsächlich“ und Überdeckungs-Testdaten bündeln; Grenzwert selbst ergänzen |
| PB2-5 | 20 | 19 | Sperren bei gleichzeitigem Zugriff neu; 5-1-4 in 5-1-1; mehrere Rechte/Rollen bei GRANT |
| PB2-6 | 17 | 19 | korrelierte Unterabfrage, Textfunktionen neu; LEFT JOIN (Bedingung in ON), UNION/UNION ALL |
| **Summe** | **92** | **85 (86)** | dazu 13+ umformulierte Aussagen, Grenze für SQL-Dialekte in IHK-Lösungen |

## Wichtigste Lücken (K1)

1. **Gruppenwechsel / Nachbarelemente vergleichen** (2023S-A3-ab mit 13 Punkten, 2024W-A1, 2022S-A1): letzte Gruppe nach der Schleife auswerten – fehlt in PB2-1 und PB2-3.
2. **Index aus Fachwert berechnen und Ergebnisarray anlegen** (2023S-A2, 2024W-A1); Zeitraumprüfung (2025S-A1).
3. **Rekursion:** Stellung einer Anweisung vor/nach dem Selbstaufruf bestimmt die Reihenfolge; iterative Fassung mit umgekehrter Ausgabe (2022W-A2).
4. **Unit-Test selbst schreiben** – vom Katalog verlangt, keine Aussage dazu.
5. **SQL:** korrelierte Unterabfrage (in SELECT-Liste und WHERE; 2022S-A4-bd, 2023W-A4-d, 2022S-A4-bb), LEFT JOIN mit Bedingung in ON (2022W-A4-a, 2023S-A4-c), Textfunktionen (2025W-A4-d), UNION vs. UNION ALL (2024S-A4-d), mehrere Rechte in einem GRANT (2025S-A4-b/-c), Sperren bei gleichzeitigen Zugriffen (2021W-A1-b, Stufe 4).

## Fachlich falsch oder ungenau

- PB2-4-1-3-K2: Grenzwertanalyse ohne den Grenzwert selbst („knapp innerhalb und außerhalb“).
- PB2-1-1-1-K4/K5: Beleg 2025S-PB2-A1 trägt die Aussagen nicht (richtig: 2025W-A1-a/-b, 2021W-A2, 2022S-A2-b).
- PB2-2: einziger Beleg der linearen Suche (2025W-A1-b) ist eine Minimumsuche; Stufe 2 bei binärer Suche/Sortierverfahren ohne Herkunft (Katalog: „kennen“).
- PB2-6: GROUP-BY-Regel als absolute Tatsache, obwohl die IHK-Lösung 2025W-A4-b sie verletzt; PB2-5-1-2-K2: UPDATE über verknüpfte Tabellen ohne Standardweg (IHK-Lösung 2023W-A4-c nutzt SQL-Server-Dialekt).

## Ordnerübergreifende Doppelungen

- **Sonderfälle / Reaktion auf Fehler:** PB2-1-1-1-K5, PB2-3-1-2-K4, PB2-4-1-3-K3, PB1-5-1-2-K3.
- **„Erwartet gegen tatsächlich“:** PB2-4-1-2-K3, PB2-4-1-3-K5, PB2-3-1-1-K2, PB2-3-1-3-K3, PB1-9-1-5-K3.
- **Schleifengrenzen:** PB2-1-1-1-K2, PB2-3-1-1-K4, AP1-8-2-4-K5.
- **Ablaufverfolgung = Schreibtischtest:** PB2-3-1-2-K2, PB2-3-1-1-K1 wiederholt AP1-8-2-3 (neu nur Rekursion).
- **UPDATE/DELETE mit Unterabfrage:** PB2-5-1-2-K2/K3 und PB2-6-1-4-K1/K2 mit denselben Teilaufgaben.
- **Kontrollstrukturen als Aktivitätsdiagramm:** PB2-1-1-4-K1/K2 wiederholen AP1-8-3-3 und PB1-4-1-5.
- **Datentypen:** PB2-5-1-5-K2 wiederholt PB1-7-1-3-K1 flacher.
- **Teilaufgaben doppelt zugeordnet:** 2023S-A3-ab (PB2-1-1-3, PB2-3-1-1), 2022W-A1-b (PB2-1-1-3, PB2-2-1-4); 2024S-A1-ba/-bb verweisen auf PB1-10-1-2, passender AP1-7-4-1-K8.

## Gesamturteil

Der PB2-Lernplan deckt die Themen des Katalogs vollständig ab, ist aber bei den eigentlichen Lösungsmustern der Prüfungen zu dünn: Gruppenwechsel, Indexberechnung, Rekursionsreihenfolge, korrelierte Unterabfragen und LEFT JOIN fehlen genau dort, wo viele Punkte liegen. Gleichzeitig wiederholt er an rund 25 Stellen Inhalte aus AP1, PB1 oder anderen PB2-Ordnern, statt per `baut_auf` darauf aufzubauen. Nach den Vorschlägen schrumpft er leicht (92 → 85 Aussagen) und wird zugleich prüfungsnäher.

## Offene Fragen an den Projektinhaber

1. **Bausteine aus PB1 in PB2:** Dürfen Bausteine, die laut `raeume-ap2.json` in PB1 wohnen (z. B. AP2a.02.01.2, AP2b.03.08.1, AP2b.04.17.5, AP2b.04.09.x, AP2b.04.21.1), in `bausteine` eines PB2-Stichpunkts stehen, oder nur über `baut_auf`? (von zwei Prüfern unabhängig gestellt)
2. **Gruppenwechsel:** Wohnort PB2-1 (Programmlogik) oder PB2-3 (Fehler finden)?
3. **„kennen“ bei Algorithmen:** reicht der Name (Stufe 1) oder gehört das Prinzip dazu (Stufe 2)?
4. **Reihenfolge SQL-Ordner:** PB2-5 setzt SELECT und Unterabfragen voraus, die erst in PB2-6 kommen – PB2-6 vor PB2-5 stellen oder nur `baut_auf` ergänzen?
5. **Relationales Modell üben:** ca. 20 Punkte je Prüfung, bisher nur Hinweis in einem DDL-Stichpunkt – eigener Übungs-Stichpunkt?
6. **SQL-Dialekte in IHK-Lösungen** (SELECT … INTO, `[Alias]`, `"Text"`, UPDATE … FROM … JOIN): als Grenze behandeln oder Belegsatz maßgeblich?
7. **STDDEV, VARIANCE, CORR** (Anhang, in keiner Prüfung): aufnehmen nach E6?
8. **Kleine Stichpunkte:** PB2-1-1-4 (2 Aussagen, reiner Diagramm-Übungsstichpunkt) und PB2-3-1-2 (nach Vorschlägen < 3 Aussagen) behalten oder auflösen?
9. **2025W-A3-ba:** Waren die Testdaten vorgegeben (Aufgabentext fehlt)? Bestimmt Herkunft von PB2-4-1-3-K3.
