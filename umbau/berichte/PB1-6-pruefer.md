# Prüfbericht PB1-6 – Datenmodellierung und Datenhaltung (unabhängige Prüfung)

**Geprüft:** 5 Stichpunkte, 25 Können-Aussagen, 1 Grenze, 1 Kür. 14 zugeordnete Teilaufgaben samt Lösungshinweis und Bewertungsschema gelesen (2021W-A2-b; 2022S-A2-c; 2022W-A4-c; 2023S-A4-ca, -cb; 2023W-A3-a, -b, -cb, -A4-a; 2024S-A4-a; 2025S-A2-a [ohne Lösung]; 2025W-A4-a, -b, -c). Katalog AP2a.02.03.1–.5, AP2b.04.10/.11 und AP2b.05.02 Wort für Wort mit den Aussagen und der Kür abgeglichen. AP1-Abgleich: AP1-8-4-1, AP1-8-4-2, AP1-8-4-5.

**Kerntest gesamt:** Alle 14 Teilaufgaben sind lösbar. Die Normalisierungsaufgabe 2025W-A4-c mit zusammengesetztem Schlüssel ist durch K5 abgedeckt. Eine Katalogaussage fehlt (Nr. 1). Mehrere Aussagen wiederholen AP1.

| Nr | Stelle (ID) | Art | Befund | Vorschlag | Sicherheit |
|---|---|---|---|---|---|
| 1 | PB1-6-1-2-K3 + Kür PB1-6-1-4 | K1 fehlt / Kür falsch | Laut Kür sind „weitere Datentypen wie BLOB und Geokoordinaten“ nur Hinweisquelle, „der Katalog nennt … eine feste Liste von Datentypen“. Das stimmt nicht: AP2a.02.03.2 nennt wörtlich „Boolesche Werte, Ganzzahl, Gleitkommawerte, Währung, Datumswerte, Texte fester und variabler Länge, **BLOB, Geokoordinaten**“. Damit sind beide Kern; K3 lässt sie weg. Geokoordinaten kamen in 2023S-A4 (Beet-Koordinaten) sogar vor. | In K3 ergänzen: „BLOB für Binärdaten wie Bilder oder Dokumente, Geokoordinaten (z. B. als Breiten-/Längengrad bzw. eigener Geodatentyp)“. Aus der Kür entfernen. | hoch |
| 2 | PB1-6-1-1-K4 | doppelt AP1 | „Ein vorhandenes ER-Modell um neue Entitäten und 1:n- und m:n-Beziehungen erweitern, ohne Angaben doppelt zu speichern“ = AP1-8-4-1-K6 (bestehendes ER-Modell um eine Entität mit Beziehung erweitern) + AP1-8-4-1-K5 (keine Angabe doppelt), alles Stufe 3. | Streichen. Den Beleg 2024S-A4-a an K3 hängen (die Modellierungstricks dort sind neu). | hoch |
| 3 | PB1-6-1-3-K1 | doppelt AP1 | „Redundanz an einem konkreten Beispiel aus einer Tabelle beschreiben“ ist AP1-8-4-2-K2 („erklären, was Redundanz ist, und ein Problem beschreiben“), gleiche Stufe 2. Der Katalog verlangt sogar nur „erkennen“ (Stufe 1). | In K2 aufnehmen: „Redundanz und die drei Anomalien je an einem konkreten Beispiel aus einer gegebenen Tabelle erläutern“. | hoch |
| 4 | PB1-6-1-4-K6 ↔ PB1-7-1-2-K3 | doppelt PB1 | Beide Aussagen fußen auf derselben Teilaufgabe 2023W-A3-cb: zusammengehörige Dokumente als Array in das übergeordnete Dokument einbetten. Hier zusätzlich mit der Begründung „statt über Schlüssel zu verknüpfen“. | Hier streichen. Die Begründung („bei gemeinsamem Zugriff einbetten statt verknüpfen“) als Halbsatz in PB1-7-1-2-K3. | hoch |
| 5 | PB1-6-1-2-K2 ↔ PB1-6-1-3-K5 | doppelt PB1 | Beide verlangen dieselbe Zeichenaufgabe: aus Tabellen- bzw. Beispieldaten ein relationales Modell (in 3. NF) mit PK, FK und Beziehungen erstellen. 2023S-A4-cb verlangt ausdrücklich „in der dritten Normalform“, ist aber hier zugeordnet statt bei der Normalisierung. | K2 streichen und den Beleg 2023S-A4-cb an PB1-6-1-3-K5 hängen („… auch erweitert um neue Anforderungen“). | mittel |
| 6 | PB1-6-1-4-K5 | zur Kür / K3 Woher / falsch (ungenau) | „Verteilte Datenbanken können nicht zugleich alle ACID-Eigenschaften und hohe Verfügbarkeit erfüllen“ stammt aus einem Einleitungssatz in 2023W-A3-b, nicht aus einer Aufgabe mit Operator. Inhaltlich ist es das CAP-Theorem, das die Kür desselben Stichpunkts als „nur Hinweisquelle“ führt; das ist widersprüchlich. „Deshalb dokumentenorientierte Systeme mit weniger strenger Konsistenz“ ist ungenau: Gängige Dokumentdatenbanken bieten heute auch ACID-Transaktionen; der Zielkonflikt entsteht bei Netzpartitionen. | Zur Kür (zusammen mit CAP/BASE) verschieben. | mittel |
| 7 | PB1-6-1-2-K6 ↔ PB1-6-1-5-K3 | doppelt PB1 | Zweimal Stufe 4: „beurteilen, welche Constraints die Datenbank erzwingen soll“ und „beurteilen, mit welchen technischen Maßnahmen die Datenintegrität gesichert wird: Constraints, Validierung, Transaktionen“. Die Constraints sind in beiden der Kern (AP2b.05.02.1). | Zu einer Aussage in PB1-6-1-5 zusammenfassen und die Constraint-Arten (PK, FK, NOT NULL, UNIQUE, CHECK) dort nennen. | mittel |
| 8 | PB1-6-1-1-K1 | doppelt AP1 (teilweise) | „Entitätstypen, Attribute, Beziehungen mit Kardinalitäten 1:1, 1:n, m:n und Primärschlüssel aus einer Beschreibung“ ist AP1-8-4-1-K2/K3/K4 (Stufe 3). Neu ist nur „umfangreich, vollständig, ohne Vorlage“. | Auf das Neue kürzen: „… ein umfangreiches ER-Modell ohne Vorlage vollständig erstellen, auch mit Attributen an m:n-Beziehungen“; baut_auf AP1-8-4-1 ist gesetzt. | mittel |
| 9 | PB1-6-1-2-K3 | doppelt AP1 (teilweise) | Datentypen zuweisen (Stufe 3) steht unter AP1-8-4-2-K3, wo schon begründet wird (Stufe 4, PLZ als Text). Neu ist nur die Katalogliste (Währung als Festkomma, Text fest/variabel, Boolean, dazu BLOB und Geo, siehe Nr. 1). | Auf die Katalogliste kürzen und baut_auf AP1-8-4-2 nennen (ist gesetzt). | niedrig |
| 10 | PB1-6-1-2-K4 / K5 | zu fein | „Referenzielle Integrität erklären“ (K4) ist die Voraussetzung von K5 (Lösch- und Aktualisierungsweitergabe festlegen). | Zu einer Aussage zusammenfassen. | niedrig |
| 11 | PB1-6-1-3-K3 / K4 | zu fein | 1. NF und 2./3. NF sind zwei Definitionsaussagen ohne eigenen Beleg; geprüft wird immer die Anwendung (K5). | Zu „die Regeln der 1. bis 3. Normalform erklären“ zusammenfassen; K5 und K6 bleiben. | niedrig |
| 12 | PB1-6-1-1 / PB1-6-1-2 | K2 Herkunft (B4) | 2024S lag die ER-Notation im Belegsatz bei (Symbol und Bezeichnung). Die Chen-Notation muss also nicht auswendig gekonnt werden. | Vermerk `vorgegeben: ER-Notation im Belegsatz (2024S)` bei K1. | niedrig |

**Bilanz PB1-6:** 12 Funde (davon 4 hoch). Lücken: 1 (Nr. 1, Erweiterung von K3). Kann weg bzw. zusammengelegt: 8 Aussagen (Nr. 2, 3, 4, 5, 6, 7, 10, 11). Vorher 25 → nach Vorschlägen etwa 17.

## Umsetzung (bauende Sitzung, 14.10.2026, Entscheidungen P35)

| Nr | Umsetzung |
|---|---|
| 1 | umgesetzt: BLOB und Geokoordinaten in der Datentyp-Aussage (Kern), aus der Kür entfernt |
| 2 | umgesetzt: gestrichen; Erweitern steht in AP1-8-4-1, Beleg 2024S-A4-a trägt die Aussage „Anforderungen in Attribute übertragen“ |
| 3 | umgesetzt: Redundanz und Anomalien in einer Aussage |
| 4 | umgesetzt: gestrichen, Einbetten wohnt in PB1-7 (die Teilaufgabe bleibt dem Stichpunkt zugeordnet) |
| 5 | umgesetzt: gestrichen, Beleg 2023S-A4-cb an der Normalisierungs-Zeichenaufgabe |
| 6 | umgesetzt: zur Kür (CAP), Formulierung auf Netzpartition korrigiert |
| 7 | umgesetzt: eine Aussage in Transaktionen und Datenintegrität mit den Constraint-Arten |
| 8 | umgesetzt: auf das Neue gekürzt (umfangreich, ohne Vorlage, Attribute an m:n) |
| 9 | umgesetzt: Verweis auf AP1-8-4-2 für die Begründung |
| 10 | umgesetzt: referenzielle Integrität und Weitergabe in einer Aussage |
| 11 | umgesetzt: 1. bis 3. NF in einer Aussage |
| 12 | umgesetzt: `vorgegeben` an der ER-Aussage |

Ergebnis: 25 → 17 Aussagen.

## Doppelungen zu AP1 (16.10.2026, P36)

Abgleich jeder Aussage mit `umbau/export/AP1.json` und `umbau/lernplan/ap1/*.json` nach T7 (P36) und P35 Nr. 4 („tiefer heißt mehr Inhalt“). Importierte AP1-Bausteine stehen nur noch in `bausteine`, wenn eine Aussage mit `neu` sie betrifft; sonst genügt `baut_auf`.

| Aussage | gestrichen/gekürzt/neu begründet | AP1-Gegenstück | Grund |
|---|---|---|---|
| PB1-6-1-1-K1 | gekürzt | AP1-8-4-1-K2, -K4, -K7 | Elemente (Entitäten aus Text, Kardinalitäten, Beziehungsattribute) gestrichen; bleibt: ganzes Modell ohne Vorlage mit neuen Modellierungsentscheidungen (mehrere Beziehungen zwischen denselben Entitätstypen, Vorgang als Entitätstyp; 2021W-PB1-A2-b). Fünf Karten entfernt, zwei neue (PB1-6-1-1-K1-1, -K1-2). |
| PB1-6-1-4 (bausteine) | Baustein entfernt | AP1-2-3-1 | AP1.02.03.4 ohne Aussage mit `neu`. |
