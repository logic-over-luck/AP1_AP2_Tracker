# Prüfbericht PB1-5 – Objektorientierter Entwurf und Entwurfsmuster (unabhängige Prüfung)

**Geprüft:** 6 Stichpunkte, 29 Können-Aussagen, 1 Grenze, 1 Kür. 21 zugeordnete Teilaufgaben samt Lösungshinweis gelesen (2022S-A3-ba, -bb, -bc, -cb; 2022W-A2-a; 2023S-A2-ba, -bb, -bc, -bd; 2024S-A3-ba, -bb, -bc; 2024W-A3-a, -A4-ba, -bb, -bc; 2025S-A4-aa, -ab, -b, -c, -d [2025S ohne Lösung, gegen Aufgabentext und englisches Material M2 geprüft]). PB1-5-1-3 (Fehlerbehandlung) hat keine Teilaufgabe und wurde gegen AP2b.04.17.5 geprüft. AP1-Abgleich: AP1-8-1-2, AP1-8-2-2, AP1-8-2-4, AP1-8-3-2.

**Kerntest gesamt:** Alle 21 Teilaufgaben sind lösbar. Die Pseudocode-Aufgaben setzen AP1-8-2-2 (Schleifen, Verzweigungen) und den Belegsatz voraus. 2025S-A4-aa/-ab sind mit dem vorgegebenen englischen Text lösbar. Kein Prüfungsinhalt fehlt.

| Nr | Stelle (ID) | Art | Befund | Vorschlag | Sicherheit |
|---|---|---|---|---|---|
| 1 | PB1-5-2-1-K4 | doppelt PB1 + doppelt AP1 | „Aus einer fachlichen Beschreibung die Klassen mit Attributen und Beziehungen ableiten (Analyse) und Methoden, Datentypen und Datenstrukturen festlegen (Entwurf)“ hat denselben Beleg (2024W-A3-a) und dieselbe Fähigkeit wie PB1-4-1-3-K2. Das Ableiten von Klassen aus einem Text ist zudem AP1-8-3-2-K5 (Stufe 3). | Streichen. Höchstens „OOA (was) und OOD (wie) unterscheiden“ (Stufe 2) behalten, und zwar als Halbsatz in K3. | hoch |
| 2 | PB1-5-2-3-K1 … K5, PB1-5-1-2-K4 | zu fein | Je Prüfungsteilaufgabe gibt es eine eigene Pseudocode-Aussage (sechs Aussagen in Stufe 3): Liste durchlaufen und Methode aufrufen (K1), Liste durchsuchen und Boolean liefern (K2), Objekt erzeugen und einfügen (K3), Fabrikmethode mit Mehrfachauswahl (K4), notifyObservers (K5), überschreibende Methode (5-1-2-K4). K1 und K5 sind dieselbe Struktur (for each … o.methode()). | Auf drei Aussagen zusammenfassen: (a) Liste von Objekten durchlaufen und je Objekt Methoden aufrufen (z. B. einladen, notifyObservers); (b) Liste durchsuchen und Ergebnis zurückgeben; (c) Objekte erzeugen, mit Konstruktor oder Fabrikmethode (Mehrfachauswahl), und in eine Liste einfügen. 5-1-2-K4 in (c) bzw. als Beispiel aufnehmen. | mittel |
| 3 | PB1-5-2-2-K4 | falsch (ungenau) | „Factory Method: Erzeugung in eine Methode oder Erzeugerklasse ausgelagert, die **je nach Parameter oder Unterklasse** das Produkt liefert“ vermischt zwei Dinge. Die statische Fabrikmethode mit Typ-Parameter aus 2023S-A2 ist eine „Simple Factory“. Das GoF-Muster Factory Method aus 2025S-A4 lässt Unterklassen die Fabrikmethode überschreiben, ohne Parameter. Für 2025S-A4-aa/-c braucht man genau die Unterscheidung. | Trennen: „Statische Fabrikmethode: liefert je nach Parameter ein Objekt der passenden Unterklasse (2023S)“ und „Factory Method: jede konkrete Erzeugerklasse überschreibt die Fabrikmethode und liefert ihr Produkt (2025S)“. | mittel |
| 4 | PB1-5-2-2-K4 / K5 | K2 Herkunft (B4) | 2025S-A4-aa/-ab bringen den englischen Text zur Factory Method als Material M2 mit; die Einschränkung aus K5 („gemeinsame Basisklasse oder Interface“) steht wörtlich darin. Der Vermerk „vorgegeben“ fehlt. | `vorgegeben: englischer Text zur Factory Method` an K4/K5 setzen; baut_auf AP1-2-3-1 (englische Fachtexte). | mittel |
| 5 | PB1-5-1-2-K2 ↔ PB1-5-2-2-K3 | doppelt PB1 | „Realisierung eines Interface begründen, z. B. Observer: jede Anzeige überschreibt update, das Subjekt ruft für alle dieselbe Methode auf“ ist der Kern von PB1-5-2-2-K3 (Observer: Subjekt benachrichtigt alle über update) plus K1 (Polymorphie). | Streichen und den Beleg 2022S-A3-bc an PB1-5-2-2-K3 hängen; dort „dank Polymorphie“ ergänzen. | mittel |
| 6 | PB1-5-1-1-K4 | doppelt PB1 | „Interface legt nur Methodensignaturen fest, jede implementierende Klasse muss sie bereitstellen“ steht schon in K3 (Interfaces im Vergleich zur abstrakten Klasse) und in PB1-5-1-2-K2 (Realisierung eines Interface). | Streichen, oder K3 und K4 zu einer Aussage „abstrakte Klasse und Interface unterscheiden und im Entwurf einsetzen“ zusammenfassen. | mittel |
| 7 | PB1-5-1-1-K1 | doppelt AP1 (teilweise) | „Attribute privat, Zugriff nur über öffentliche Methoden“ ist AP1-8-1-2-K5 (Stufe 2). Neu ist nur die Begründung (Klasse prüft ihre Daten, Inneres änderbar) und die Stufe „anwenden“. | Auf das Neue kürzen: „Kapselung anwenden und begründen: Daten prüfen im Setter, Implementierung austauschbar“. | mittel |
| 8 | PB1-5-1-3-K3 | doppelt AP1 | „Fehlerfälle nennen: ungültige Eingaben, nicht vorhandenes Objekt, Index außerhalb des Arrays, Division durch null, Datei nicht erreichbar“ steht weitgehend in AP1-8-2-4-K1/K3/K5 (Laufzeitfehler, Array-Ende, Division durch null). | Streichen und baut_auf AP1-8-2-4 nutzen (ist gesetzt). Die Beispiele als Halbsatz in K4. | mittel |
| 9 | PB1-5-1-1-K3 / K4 | falsch (ungenau) | „Eine Klasse erbt von nur einer Oberklasse“ gilt nur für Java und C#; C++ und Python kennen Mehrfachvererbung. „Interface legt nur Methodensignaturen fest“ ist seit Java 8 und C# 8 (Default-Methoden) nicht mehr allgemein richtig. | Einschränken: „in Sprachen wie Java oder C# …“ und „klassisch nur Signaturen (in neueren Sprachversionen auch Standardimplementierungen)“. | niedrig |
| 10 | PB1-5-1-2-K5 | zu fein | „Begründen, warum sich ein polymorpher Entwurf ohne Änderung des aufrufenden Codes erweitern lässt und Fallunterscheidungen vermeidet“ ist die Begründung zu K3 (Umbau in einen polymorphen Entwurf). Sie stand in 2023S-A2-b schon im Aufgabentext. | In K3 aufnehmen („… umbauen und begründen, warum …“). | niedrig |
| 11 | PB1-5-2-1-K1 / K2 | zu fein | Top-down und Bottom-up sind Gegenstücke derselben Frage. Zwei Aussagen in Stufe 3 ohne Beleg sind viel. | Zusammenfassen: „Top-down- und Bottom-up-Entwurf unterscheiden und anwenden“. | niedrig |
| 12 | PB1-5-1-3-K1 / K2 | zu fein | K1 (was eine Ausnahme ist) ist der erste Halbsatz von K2 (try/catch/finally anwenden). | Zusammenfassen. | niedrig |
| 13 | PB1-5-1-2, Kür | anderer Raum | Datenstrukturen (Queue, Stack, Baum, Graph) und Lambda, Map, Filter, Reduce gehören zu Algorithmen und Programmlogik (G.PB2.01/.02), nicht zum Entwurf in PB1. | Kür nach PB2 verschieben. | niedrig |
| 14 | PB1-5-2-2-K6 | K1 fehlt (gering) | Beim Singleton fehlt das Merkmal, das ihn erst sichert: der private Konstruktor. Ohne ihn ist „genau ein Objekt“ nicht erklärbar. | „… privater Konstruktor, Zugriff über eine statische Methode, die immer dasselbe Objekt liefert“. | niedrig |

**Bilanz PB1-5:** 14 Funde (davon 1 hoch). Lücken: 1 (Nr. 14, Halbsatz). Kann weg bzw. zusammengelegt: 10 Aussagen (Nr. 1, 2 [−3], 5, 6, 8, 10, 11, 12). Vorher 29 → nach Vorschlägen etwa 19.

## Umsetzung (bauende Sitzung, 14.10.2026, Entscheidungen P35)

| Nr | Umsetzung |
|---|---|
| 1 | umgesetzt: auf „OOA und OOD unterscheiden“ (Stufe 2) gekürzt; das Umsetzen trägt die Pseudocode-Aussage zum Erzeugen |
| 2 | umgesetzt: sechs Pseudocode-Aussagen auf drei (Liste durchlaufen und Methoden aufrufen; prüfen, berechnen, überschreiben; Objekte erzeugen und einfügen) |
| 3 | umgesetzt: Factory Method (2025S) und statische Fabrikmethode (2023S) getrennt |
| 4 | umgesetzt: `vorgegeben` an beiden Factory-Aussagen |
| 5 | umgesetzt: gestrichen, Beleg 2022S-A3-bc und „dank Polymorphie“ in der Observer-Aussage (trägt Stufe 4 für Polymorphie und Interface) |
| 6 | umgesetzt: abstrakte Klasse und Interface in einer Aussage |
| 7 | umgesetzt: auf Anwenden und Begründen gekürzt |
| 8 | umgesetzt: gestrichen, Fehlerfälle als Halbsatz in der Festlegen-Aussage |
| 9 | umgesetzt: „in Java oder C#“, Standardimplementierungen erwähnt |
| 10 | umgesetzt: Erweiterbarkeit als Halbsatz in der Umbau-Aussage |
| 11 | umgesetzt: Top-down und Bottom-up in einer Aussage |
| 12 | nicht umgesetzt: sonst unterschreitet der Stichpunkt F3 |
| 13 | umgesetzt: Kür gestrichen, Hinweis-Abgleich verweist auf PB2 |
| 14 | umgesetzt: privater Konstruktor |

Gliederung: Kapselung/Vererbung und Polymorphie in einem Stichpunkt, ein Themenblock statt zwei (F3/F4). Ergebnis: 29 → 21 Aussagen.

## Doppelungen zu AP1 (16.10.2026, P36)

Abgleich jeder Aussage mit `umbau/export/AP1.json` und `umbau/lernplan/ap1/*.json` nach T7 (P36) und P35 Nr. 4 („tiefer heißt mehr Inhalt“). Importierte AP1-Bausteine stehen nur noch in `bausteine`, wenn eine Aussage mit `neu` sie betrifft; sonst genügt `baut_auf`.

| Aussage | gestrichen/gekürzt/neu begründet | AP1-Gegenstück | Grund |
|---|---|---|---|
| PB1-5-1-5 (bausteine) | Baustein entfernt | AP1-8-2-2 | AP1.04.07.1 ohne Aussage mit `neu`; Pseudocode mit Objekten und Listen hängt an PB1-Bausteinen. |
