# Prüfbericht PB1-7 – Schnittstellen und Datenaustausch (unabhängige Prüfung)

**Geprüft:** 6 Stichpunkte, 29 Können-Aussagen, 0 Grenzen, 1 Kür. 16 zugeordnete Teilaufgaben samt Lösungshinweis gelesen (2022W-A3-ca, -cb, -cc; 2023W-A3-ca, -cb; 2024S-A2-a bis -e; 2024W-A2-c; 2025W-A2-ba, -bb, -A3-ba, -bb, -bc). PB1-7-1-3 und PB1-7-2-2 haben keine Teilaufgabe; sie wurden gegen AP2b.02.05, AP2a.02.03.11, AP2b.03.03 und AP2b.04.21 geprüft. Fachlich gegen den aktuellen Stand der eRechnung geprüft (EN 16931, Pflicht im B2B-Bereich in Deutschland seit 1.1.2025). Ordnerübergreifend verglichen mit PB1-3-2-2, PB1-4-2-1, PB1-6-1-4 und PB1-10.

**Kerntest gesamt:** Alle 16 Teilaufgaben sind lösbar, einschließlich der XML-Fehlersuche gegen eine DTD (2022W-A3-cc) und der Grenzen der Schemavalidierung (2025W-A3-bc). Kein Prüfungsinhalt fehlt. Drei Aussagen stehen wortgleich in anderen Ordnern.

| Nr | Stelle (ID) | Art | Befund | Vorschlag | Sicherheit |
|---|---|---|---|---|---|
| 1 | PB1-7-2-3-K5 ↔ PB1-7-1-1-K5 | doppelt PB1 | Beide sagen dasselbe: Eine Schemaprüfung prüft nur Aufbau und Datentypen, deshalb braucht es zusätzlich eine inhaltliche bzw. logische Prüfung (z. B. Summen). K5 hier ist Stufe 4 ohne Beleg, 7-1-1-K5 ist mit 2025W-A3-bc belegt. | PB1-7-2-3-K5 streichen. In 7-1-1-K5 „und beurteilen, welche weiteren Prüfungen nötig sind (Plausibilität, Unit-Tests)“ ergänzen. | hoch |
| 2 | PB1-7-1-2-K4 | doppelt PB1 | „Ergebnisse eines Programms als JSON-Array in vorgegebener Struktur ausgeben“ (Beleg 2024W-A2-c) steht schon in PB1-3-2-2-K3 („… die Treffer als JSON-Array ausgibt“). Das JSON-Wissen dahinter ist K2 (Datensätze als Array von Objekten). | Streichen. Beleg 2024W-A2-c als zweiten Beleg an K2 hängen. | hoch |
| 3 | PB1-7-2-1-K5 ↔ PB1-4-2-1-K5 | doppelt PB1 | Dieselbe Teilaufgabe (2024S-A2-e) mit demselben Beispiel („GET /shareholders?city=Köln, Antwort aus Cache oder Datenbank, Response 200“) steht als Aussage hier und im Sequenzdiagramm-Stichpunkt. | Hier streichen; die REST-Seite ist mit K1–K4 abgedeckt, die Darstellung mit PB1-4-2-1-K5. | hoch |
| 4 | PB1-7-2-3-K2 | falsch (ungenau) | „Aspekte einer digitalen Rechnung: Sie liegt in einem **strukturierten** digitalen Format vor“ vermischt zwei Begriffe. Laut Material in 2025W ist eine *digitale* Rechnung jedes digitale Dokument (auch ein PDF); nur die *elektronische* Rechnung (eRechnung) ist strukturiert. Fachlich wichtig: Seit 1.1.2025 gilt in Deutschland ein reines PDF nicht als E-Rechnung (§ 14 UStG; EN 16931, z. B. XRechnung, ZUGFeRD ab 2.0.1). | „Digitale Rechnung: liegt digital vor (z. B. PDF) und hat einen visuellen Aspekt (für Menschen) und einen Datenaspekt (für Maschinen). Die eRechnung ist die Form, deren Datenaspekt strukturiert ist und automatisch verarbeitet wird“. | mittel |
| 5 | PB1-7-2-2-K3 ↔ PB1-7-2-1-K3 | doppelt PB1 | „Vorhandene Schnittstelle nutzen: aus der API-Dokumentation Endpunkt, Methode, Parameter, Antwortformat entnehmen und die Anfrage richtig aufbauen“ ist der Inhalt von 7-2-1-K3 („HTTP-Anfrage zusammenstellen: URL mit Pfad und Parametern, Methode, Header, Body“). | Zusammenfassen: In 7-2-1-K3 „… nach der Dokumentation einer vorhandenen API“ ergänzen; 7-2-2-K3 streichen. | mittel |
| 6 | PB1-7-1-3-K2 / K3 | K3 Woher / zu fein | Der Katalog nennt „Bildung eines Data Lake o. a.“; das Data Warehouse ist ein weiteres Mitglied dieser offenen Liste. Nach P-BEISPIELLISTE braucht es dafür zwei Hinweisquellen, die Herkunft nennt nur den Katalog. K3 (entscheiden, ob roh im Data Lake oder vorher aufbereitet) ist die direkte Anwendung von K2. | K2 und K3 zusammenfassen. Den Vergleich mit dem Data Warehouse nur behalten, wenn zwei Hinweisquellen ihn stützen, sonst als Kür. | niedrig |
| 7 | PB1-7-2-2-K4 | zu fein | „Wozu ein API-Schlüssel oder Token im Header dient“ ist ein Teil von 7-2-1-K3 (Kopfzeilen für Autorisierung; in 2024S-A2-c war „authorization … API-Key“ vorgegeben) und überschneidet sich mit PB1-10-2-3-K2 (Access Token). | Als Halbsatz in 7-2-1-K3 aufnehmen. | niedrig |
| 8 | PB1-7-1-2-K1 | K2 Herkunft (B4) | Die JSON-Syntax war in 2023W-A3 als Material M4 vorgegeben. Bei K2 ist das vermerkt, bei K1 (JSON-Aufbau) nicht. | `vorgegeben: JSON-Syntax (2023W)` auch an K1 setzen, oder K1 in K2 aufgehen lassen. | niedrig |
| 9 | PB1-7-2-3 | zur Kür (Frage) | Der deutsche Rechtsrahmen fehlt, obwohl die Aufgabe 2025W ihn voraussetzt („In Zukunft müssen die Rechnungen an Firmen als eRechnung versendet werden“): Empfangspflicht seit 1.1.2025, Ausstellungspflicht gestaffelt 2027/2028, Formate nach EN 16931 (XRechnung, ZUGFeRD). Nach G6 reicht der Zusatzbaustein nur so weit wie die Belege. | Als Kür aufnehmen (Hinweisquelle nötig). Projektinhaber fragen, ob das als P-NÄCHSTE-STUFE Puffer sein soll. | niedrig |

Ordnerübergreifend: PB1-7-1-2-K3 (JSON einbetten) und PB1-6-1-4-K6 sind doppelt. Gezählt wird das in Bericht PB1-6, Nr. 4; dort wird die Streichung vorgeschlagen, K3 hier bleibt.

**Bilanz PB1-7:** 9 Funde (davon 3 hoch). Lücken: 0 (Nr. 9 als Kür-Frage). Kann weg bzw. zusammengelegt: 6 Aussagen (Nr. 1, 2, 3, 5, 6, 7). Vorher 29 → nach Vorschlägen etwa 23.

## Umsetzung (bauende Sitzung, 14.10.2026, Entscheidungen P35)

| Nr | Umsetzung |
|---|---|
| 1 | umgesetzt: eRechnungs-Aussage gestrichen; die belegte Schemavalidierungs-Aussage ist jetzt „beurteilen“ (Stufe 4, Katalog AP2b.05.02.2) mit Plausibilitätsprüfung und Unit-Tests |
| 2 | umgesetzt: gestrichen, Beleg 2024W-A2-c an der Umwandlungs-Aussage |
| 3 | umgesetzt: gestrichen, Verweis auf PB1-4 im Ziel |
| 4 | umgesetzt: digitale Rechnung und eRechnung getrennt, PDF seit 2025 keine eRechnung |
| 5 | umgesetzt: „nach der Dokumentation einer vorhandenen API“ in der Anfrage-Aussage |
| 6 | umgesetzt: Data-Lake-Aussagen zusammengelegt, Data Warehouse als Kür |
| 7 | umgesetzt: API-Schlüssel als Halbsatz |
| 8 | umgesetzt: `vorgegeben` auch an der JSON-Aufbau-Aussage |
| 9 | umgesetzt als Kür (P35 Nr. 6) |
| PB1-6 Nr. 4 | Begründung „einbetten statt verknüpfen“ hier ergänzt |

Gliederung: REST und SOAP in einem Stichpunkt, ein Themenblock statt zwei (F3/F4). Ergebnis: 29 → 23 Aussagen.
