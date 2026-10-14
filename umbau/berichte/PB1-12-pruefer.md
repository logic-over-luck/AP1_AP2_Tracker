# Prüfbericht PB1-12 – Betrieb, Verfügbarkeit und Cloud (unabhängige Prüfung)

**Geprüft:** 6 Stichpunkte, 25 Können-Aussagen, 0 Grenzen, 1 Kür. 3 zugeordnete Teilaufgaben samt Lösungshinweis gelesen (2022S-A4-a; 2022W-A1-a, -b). Vier Stichpunkte haben keine Teilaufgabe (PB1-12-1-3, -2-1, -2-3 ganz, -2-2 größtenteils). Sie wurden gegen Katalog AP2b.01.08–.12 und AP2b.02.04 sowie den Katalog-Anhang Präfixe geprüft. Rechnungen nachgerechnet: 99,9 % Verfügbarkeit ≈ 8,76 h Ausfall pro Jahr; RAID-Kapazitäten (RAID 1: 4 TB, RAID 5 aus 4 × 2 TB: 6 TB, RAID 10 aus 4 × 2 TB: 4 TB), alle richtig. AP1-Abgleich: AP1-1-3-1, AP1-1-3-2, AP1-1-5-2, AP1-3-3-2, AP1-5-1-3, AP1-7-3-5.

**Kerntest gesamt:** Alle 3 Teilaufgaben sind lösbar. 2022S-A4-a (Ticketsystem: drei Vorteile, ein Nachteil) ist mit K1 und AP1-1-3-1 lösbar. Kein Prüfungsinhalt fehlt. Der Ordner ist vergleichsweise schlank; die Funde sind Überschneidungen und kleine Ungenauigkeiten.

| Nr | Stelle (ID) | Art | Befund | Vorschlag | Sicherheit |
|---|---|---|---|---|---|
| 1 | PB1-12-1-2-K3 | doppelt AP1 / doppelt PB1 | „Maßnahmen für die Betriebssicherheit mit dem PDCA-Zyklus planen“ ist die dritte Anwendung desselben Zyklus: AP1-1-5-2-K3/K4 (PDCA erklären und anwenden, Stufe 3), PB1-9-1-2-K1 (PDCA auf Softwareentwicklung) und hier. Neu ist nur der Gegenstand. | Streichen; baut_auf AP1-1-5-2 ist gesetzt. Den Katalogbezug AP2b.01.09.1 über baut_auf erfüllen. | hoch |
| 2 | PB1-12-2-1-K5 ↔ PB1-12-2-2-K2 | doppelt PB1 | Predictive Maintenance („aus S.M.A.R.T.-Werten vorhersagen, wann ein Teil ausfällt, und vorher tauschen“) und „Monitoringergebnisse analysieren und Maßnahmen bestimmen, z. B. bei steigenden S.M.A.R.T.-Fehlern die Platte tauschen“ nutzen dasselbe Beispiel und dieselbe Handlung. | In PB1-12-2-2-K2 ein anderes Beispiel wählen (z. B. Speicherengpass, Überlast) und auf Predictive Maintenance verweisen. Oder K5 als Beispiel in K2 aufnehmen. | mittel |
| 3 | PB1-12-1-1-K3 ↔ PB1-1-3-2-K1/K2 | doppelt PB1 (teilweise) | „Verfügbarkeit … auch als nichtfunktionale Anforderung an eine IT-Infrastruktur“ hat denselben Beleg (2022W-A1-b) wie PB1-1-3-2-K1/K2, wo „Verfügbarkeit“ als nichtfunktionale Anforderung schon steht. | Den Halbsatz „als nichtfunktionale Anforderung“ und den Beleg streichen; K3 auf „angemessene Verfügbarkeit festlegen und nötige Maßnahmen begründen“ beschränken. | mittel |
| 4 | PB1-12-1-3-K5 | doppelt AP1 (teilweise) | „Backup-Strategien, getrennte Aufbewahrung … beurteilen“ ist AP1-7-3-5-K1/K2/K5/K6 (Sicherungsarten, getrennt lagern, 3-2-1-Regel, bestehende Sicherung beurteilen, Stufe 4). Neu sind „RAID ersetzt kein Backup“ und Snapshots. | Auf das Neue kürzen; baut_auf AP1-7-3-5 ist gesetzt. | mittel |
| 5 | PB1-12-2-3-K3 | doppelt AP1 (teilweise) | „Zwischen On-Premises und Cloud auswählen und begründen (Kosten, Skalierbarkeit, Datenschutz, Abhängigkeit)“ ist AP1-5-1-3-K3/K4 (begründet zwischen Cloud und On-Premises wählen; Vor- und Nachteile, Stufe 4). Neu ist die Wahl zwischen IaaS, PaaS und SaaS. | Auf „… zwischen IaaS, PaaS und SaaS auswählen und begründen (eigenes Fachwissen, Verantwortung, Kosten)“ kürzen. | mittel |
| 6 | PB1-12-1-3-K4 | unklar (Präfixe) | Die RAID-Kapazitäten sind mit „TB“ gerechnet. Der Katalog-Anhang „Präfixe“ verlangt für Datenmengen ausdrücklich Binärpräfixe („nur mit Binärpräfixen richtig“). Hersteller geben Platten aber dezimal an. | Hinweis ergänzen: „Herstellerangabe in TB (dezimal); bei der Angabe als Datenmenge in TiB umrechnen (AP1-4-2-1)“. | niedrig |
| 7 | PB1-12-2-2-K4 / K5 | unklar | „Service Level 1–3“ im Katalog ist mehrdeutig: Gemeint sein können SLA-Stufen (Reaktions- und Lösungszeiten) oder die Support-Stufen First/Second/Third Level (AP1-1-3-1-K1). K4 deutet es als SLA-Stufen, K5 eskaliert „an die nächste Support-Stufe“. Lernende bekommen zwei Bedeutungen ohne Hinweis. | In K4 beide Lesarten nennen und klarstellen, welche gemeint ist; in K5 auf AP1-1-3-1 verweisen. | niedrig |
| 8 | PB1-12-2-3, Kür | Kür entfernen / falsche Stelle | Die Kür „RAID 6, JBOD, DAS“ steht unter Service- und Liefermodellen und ist mit der „offenen z. B.-Liste“ von AP2b.02.04 begründet. Diese Begriffe gehören aber zu Speicher und Redundanz (AP2b.01.10.2, PB1-12-1-3), nicht zu On-Premises/Cloud/IaaS. | Den Teil der Kür nach PB1-12-1-3 verschieben (eigene Begründung über AP2b.01.10.2) oder streichen. | niedrig |
| 9 | PB1-12 gesamt | Frage (P10, E6) | 25 Aussagen zu „Betreiben von IT-Systemen“ mit 3 Belegen, darunter 13 Aussagen in Stufe 4 ohne Beleg (USV, Redundanz, RAID, SOP, SLA, Eskalation). Die Tiefe für AE ist offen (P10). | Projektinhaber: P10 entscheiden. Bis dahin unverändert lassen (E6). | niedrig |

Ordnerübergreifend: PB1-12-1-2-K1 bleibt Wohnort für 2022W-A1-a. Das Duplikat PB1-11-2-2-K5 ist in Bericht PB1-11, Nr. 6 gezählt. Die Überwachung per Skript (PB1-3-2-2-K5) ist in Bericht PB1-3, Nr. 9 gezählt.

**Bilanz PB1-12:** 9 Funde (davon 1 hoch). Lücken: 0. Kann weg bzw. zusammengelegt: 2 Aussagen (Nr. 1, 2). Vorher 25 → nach Vorschlägen etwa 23.

## Umsetzung (bauende Sitzung, 14.10.2026, Entscheidungen P35)

| Nr | Umsetzung |
|---|---|
| 1 | umgesetzt: PDCA-Aussage gestrichen; AP2b.01.09.1 hängt als Halbsatz (Verbesserung im PDCA-Zyklus aus AP1) am Notfallkonzept, damit der Pflichtbaustein in PB1 eine Aussage hat |
| 2 | umgesetzt: anderes Beispiel (Speicherengpass, Überlast), Verweis auf Predictive Maintenance |
| 3 | teilweise: Halbsatz „als nichtfunktionale Anforderung“ gestrichen, Hinweis auf PB1-1; der Beleg 2022W-A1-b bleibt, weil er die Stufe 4 von AP2b.01.08 trägt |
| 4 | umgesetzt: auf „RAID ersetzt kein Backup“ und Snapshots gekürzt |
| 5 | umgesetzt: auf die Wahl zwischen IaaS, PaaS und SaaS gekürzt |
| 6 | umgesetzt: Hinweis TB dezimal, als Datenmenge in TiB |
| 7 | umgesetzt: beide Lesarten von „Service Level 1–3“ genannt, Eskalation verweist auf AP1-1-3-1 |
| 8 | umgesetzt: RAID 6, JBOD, DAS als eigene Kür beim RAID-Stichpunkt |
| 9 | entschieden mit P10/P35: Die Stufe-4-Aussagen bleiben, weil der Katalog sie mit „beurteilen“ (AP2b.01.08, .10) und „analysieren, bestimmen“ (AP2b.01.12) verlangt |

Ergebnis: 25 → 24 Aussagen.
