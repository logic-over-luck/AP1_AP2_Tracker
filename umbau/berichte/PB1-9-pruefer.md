# Prüfbericht PB1-9 – Qualität und Test (unabhängige Prüfung)

**Geprüft:** 7 Stichpunkte, 28 Können-Aussagen, 2 Grenzen, 1 Kür. 6 zugeordnete Teilaufgaben samt Lösungshinweis gelesen (2021W-A1-bb, -A4-cb, -A4-d; 2023S-A1-e; 2023W-A1-d; 2024S-A1-b). Vier Stichpunkte haben keine Teilaufgabe (PB1-9-1-2, -1-3, -2-2, -2-4). Sie wurden gegen Katalog AP2a.02.01, AP2a.03.01/.02, AP2b.01.13, AP2b.03.08 und AP2b.05.03 Wort für Wort geprüft, ebenso die Kür gegen die „z. B.“-Listen. Raumregeln gegen raeume-ap2 (AP2b.05.03.2.1–.3 in PB2). AP1-Abgleich: AP1-1-4-2, AP1-1-4-3, AP1-1-5-2, AP1-1-5-3, AP1-3-1-3, AP1-8-2-3.

**Kerntest gesamt:** Alle 6 Teilaufgaben sind lösbar. Eine im Katalog ausdrücklich genannte Testart fehlt (Nr. 1). Vier Aussagen wiederholen AP1 in derselben Stufe.

| Nr | Stelle (ID) | Art | Befund | Vorschlag | Sicherheit |
|---|---|---|---|---|---|
| 1 | Kür PB1-9-2-2 / PB1-9-2-1 | K1 fehlt / Kür falsch | Die Kür führt „Last-, Performance-, Smoke- und Regressionstest“ als „offene z. B.-Liste, nur eine Hinweisquelle, daher Kür“. Last- und Performancetest stehen aber wörtlich in AP2a.03.01.2 („… Extremwertetest, Testdaten, **Last- und Performancetest**“), Belastungstests in AP2b.05.03.1. Nach P-BEISPIELLISTE sind genannte Beispiele Kern. Keine Aussage behandelt sie. | Neue Aussage (Stufe 2): „Last- bzw. Belastungstest und Performancetest erklären: Verhalten und Antwortzeiten bei erwarteter und bei Spitzenlast prüfen“. Aus der Kür entfernen; Smoke- und Regressionstest bleiben Kür. | hoch |
| 2 | PB1-9-1-2-K1 | doppelt AP1 | „PDCA-Zyklus auf ein Vorhaben anwenden (Plan … Act)“ ist AP1-1-5-2-K4 („PDCA auf eine Verbesserung im eigenen Arbeitsbereich anwenden“, Stufe 3), nur mit anderem Beispiel. Ein dritter PDCA steht in PB1-12-1-2-K3. | Streichen; baut_auf AP1-1-5-2 ist gesetzt. Das Software-Beispiel höchstens als Hinweis. | hoch |
| 3 | PB1-9-1-2-K4 | doppelt AP1 | „Im Soll-Ist-Vergleich Abweichungen erkennen und als Differenz und in Prozent des Sollwerts berechnen“ = AP1-3-1-3-K4 (Abweichung in Euro berechnen) + AP1-3-1-3-K5 (über den Anteil an den geplanten Kosten bewerten) + AP1-1-4-3-K1/K2. | Streichen; baut_auf AP1-1-4-3 ist gesetzt, AP1-3-1-3 ergänzen. | hoch |
| 4 | PB1-9-2-3-K5 | doppelt AP1 | „Abnahmeprotokoll erstellen: Vertragspartner, abgenommene Leistung, Ergebnis, Mängel mit Frist, Unterschriften“ = AP1-1-4-2-K2 (dieselbe Liste, Stufe 3). Neu ist nur „Version der Software“. Auch PB1-1-2-3-K3 (Abschlussprotokoll) überschneidet sich. | Streichen; baut_auf AP1-1-4-2 ist gesetzt. „Version“ als Halbsatz in K3. | hoch |
| 5 | PB1-9-2-3-K3 | doppelt AP1 | „Testprotokoll erstellen: Testfall, Eingabedaten, erwartetes und tatsächliches Ergebnis, Bewertung, Tester, Datum“ entspricht AP1-1-5-3-K5 (Testprotokoll mit Testfällen, Beschreibung, erwartetem und tatsächlichem Ergebnis, Stufe 3). | Auf das Neue kürzen („für eine Software: auch Eingabedaten, Version, Tester“) oder streichen und baut_auf AP1-1-5-3 nutzen (ist gesetzt). | hoch |
| 6 | PB1-9-2-1-K5 | anderer Raum | „Beurteilen, welche Testverfahren für eine Situation passen“ ist inhaltlich AP2b.05.03.2.1 „Auswahl des Testverfahrens“. Laut raeume-ap2 wohnt das in PB2 (G.PB2.03), und die Grenze desselben Stichpunkts nennt AP2b.05.03.2.1 selbst als PB2. Das widerspricht sich. | Streichen. Das PB1-Belegte (Stellung nehmen zu „nur Unit-Tests und Code-Reviews“) ist PB1-9-1-1-K2. | mittel |
| 7 | PB1-9-1-1-K3 | doppelt PB1 / doppelt AP1 | „Qualitätslenkung anwenden: Reviews und Tests nach Plan durchführen, Fehler erfassen und Behebung nachverfolgen“ ist PB1-9-2-3-K2 (Testprozess: durchführen, protokollieren, Fehler beheben lassen, erneut testen) plus AP1-1-5-2-K5 (Maßnahmen der Qualitätslenkung). | Streichen. | mittel |
| 8 | PB1-9-2-2-K1 ↔ PB1-1-1-2-K1 | doppelt PB1 (Querverweis) | Die Teststufen (Komponenten-, Integrations-, System-, Abnahmetest) werden hier eingeführt, aber schon im V-Modell (PB1-1-1-2-K1) vorausgesetzt. Dort stimmen die Paare nicht (siehe Bericht PB1-1, Nr. 5). | Hier belassen (Wohnort). PB1-1-1-2-K1 soll auf PB1-9-2-2 verweisen, statt die Stufen erneut aufzuzählen. | mittel |
| 9 | PB1-9-2-2-K2 | zu fein | „Zweck eines Unit-Tests: ein Baustein getrennt, automatisch, wiederholbar geprüft“ ist der Komponententest aus K1 (dort mit „auch Modul- oder Unit-Test“ gleichgesetzt). | In K1 als Halbsatz aufnehmen. | niedrig |
| 10 | PB1-9-1-3 | unklar | „Redundanz“ meint hier zusätzliche Prüfinformation (Prüfsumme, Prüfziffer), in PB1-6 dagegen unerwünschte Datenredundanz. Ohne Hinweis verwechseln Lernende das leicht. Ein passendes PB1-Beispiel gäbe es: die Frame Check Sequence im Ethernet-Frame (2024W-A2-ba). | Im Ziel-Satz klarstellen („Redundanz als gewollte Prüfinformation, nicht Datenredundanz“) und FCS/CRC als Beispiel in K3 nennen. | niedrig |

Ordnerübergreifend: PB1-9-2-4-K2 (Programmdokumentation) und PB1-3-2-1-K2 sind doppelt. Gezählt wird das in Bericht PB1-3, Nr. 2; K2 hier bleibt der Wohnort.

**Bilanz PB1-9:** 10 Funde (davon 5 hoch). Lücken: 1 (Nr. 1, 1 neue Aussage). Kann weg bzw. zusammengelegt: 7 Aussagen (Nr. 2, 3, 4, 5, 6, 7, 9). Vorher 28 → nach Vorschlägen etwa 22.

## Umsetzung (bauende Sitzung, 14.10.2026, Entscheidungen P35)

| Nr | Umsetzung |
|---|---|
| 1 | umgesetzt: neue Aussage Last-/Belastungs- und Performancetest (Kern), aus der Kür entfernt |
| 2 | umgesetzt: gestrichen, PDCA über `baut_auf` AP1-1-5-2 |
| 3 | umgesetzt: gestrichen; der Soll-Ist-Vergleich hängt als Anwendung an der Kennzahlen-Aussage (sonst wäre AP2a.03.02.2 in PB1 ohne Aussage) |
| 4 | teilweise: auf das Neue gekürzt (Version, Abnahmetests, Zusammenführen im Abschlussprotokoll); bleibt, weil nur sie AP2a.03.02.5 (Stufe 3, Beleg 2025S-A1-c) erreicht (P35 Nr. 4). Der Beleg 2025S-A1-c hängt jetzt hier statt in PB1-1 |
| 5 | umgesetzt: auf das Neue gekürzt, `baut_auf` AP1-1-5-3 |
| 6 | umgesetzt: gestrichen (PB2); alte Aussage als „PB2“ vermerkt |
| 7 | umgesetzt: gestrichen |
| 8 | umgesetzt: Querverweis auf das V-Modell im Ziel |
| 9 | umgesetzt: Unit-Test als Halbsatz beim Komponententest |
| 10 | umgesetzt: Klarstellung im Ziel, Frame Check Sequence als Beispiel |
| PB1-3 Nr. 2 | Bibliotheks-Erweiterung in der Programmdokumentation ergänzt |

Für T8 trägt die Black-/White-Box-Aussage jetzt „einsetzen“ (Stufe 3, Katalog AP2b.03.08.1), weil die gestrichene Auswahl-Aussage diese Tiefe lieferte. Gliederung: ein Themenblock mit sechs Stichpunkten, Qualitätssicherung und Kennzahlen in einem Stichpunkt (F3/F4). Ergebnis: 28 → 24 Aussagen.
