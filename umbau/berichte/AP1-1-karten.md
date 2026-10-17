# AP1-1 Karten – Projektmanagement und Qualität

Stand: 14.10.2026 · Auftrag `umbau/auftraege/AP1-karten.md` · Ergebnis `umbau/karten/ap1/AP1-1.json`

**AP1-1 Karten: 143 bleiben, 8 bearbeitet, 7 entfernt, 37 neu**

## Zahlen

| Entscheidung | Karten |
|---|---|
| bleibt | 143 |
| bearbeitet | 8 |
| entfernt | 7 |
| neu | 37 |
| **alte Karten (Zielordner AP1-1)** | **158** |
| **Karten danach** | **188** |

Davon innerhalb des Ordners an eine andere Aussage verschoben (ID bleibt): 6.
Können-Aussagen: 81; mit Karte: 81; in `nicht_abgefragt`: 0;
vorher ohne passende Karte: 16. Unsicher: 0.

| Stufe | Aussagen | Karten |
|---|---|---|
| 1 | 19 | 36 |
| 2 | 23 | 53 |
| 3 | 26 | 68 |
| 4 | 13 | 31 |

## Auffälligkeiten

- Scrum-Rollen (Product Owner, Scrum Master, Entwicklungsteam) waren drei Karten an K4; die Rollen sind jetzt Kür, die Karten sind entfernt. Die Daily-Karte nennt statt „Entwicklungsteam“ die Entwickler (Scrum Guide 2020).
- Mehrere Karten fragten an einer Stufe-4-Aussage nur eine Aufzählung ab (Terminprobleme K2, Risiken K5). Sie sind zur passenden Nenn- bzw. Festlege-Aussage verschoben; die Stufe-4-Aussagen haben jetzt Fallkarten mit Begründung.
- Vier alte Karten aus AP1-4 (Arbeitsspeicher prüfen, Riegel einzeln testen) sind mit ihren Aussagen nach AP1-1-5-3 umgezogen und hier entschieden (Zielordner-Regel); zwei davon innerhalb von AP1-1-5-3 zwischen K3 und K6 getauscht.
- Die Karte „Folgen der Abnahme“ (AP1-1-4-2-K4-1) ist entfernt, weil ihre Aussage gestrichen ist. Der Inhalt gehört zum Werkvertrag in AP1-3 und wird dort mit dessen Karten abgedeckt.
- Neue Rechenkarten (Vorgangsdauer, Hotline-Minutenpreis, Risikovergleich, Netzplanfehler) mit eigenen Zahlen, nicht aus Prüfungen übernommen; alle Ergebnisse nachgerechnet.
- Build: Die npm-Registry war in dieser Sitzung gesperrt (403), `npm run build` lief deshalb nicht. `Lernstudio.html` wurde stattdessen erzeugt, indem nur das eingebettete Datenliteral durch die Ausgabe von `vorschauAp1` ersetzt wurde (Code unverändert; das Verfahren reproduziert das vorhandene Literal byte-genau). `tests/sql.test.mjs` scheitert aus demselben Grund (sql.js fehlt), alle übrigen Tests grün.
