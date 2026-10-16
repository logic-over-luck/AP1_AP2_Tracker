# Abgleich Lehrbuch ↔ Tracker (P54, 16.10.2026)

Grundlage: Inhaltsverzeichnisse der drei Westermann-Bände „IT-Berufe“ (Grundstufe LF1–5, Fachstufe Technische IT-Berufe
LF6–9, Fachstufe II Anwendungsentwicklung LF10–12), abgetippt und nur lokal unter `quellen/lehrbuch/` (E10), dort auch die
vollständigen Tabellen je Unterkapitel. Abgeglichen gegen die neutrale Fassung aller vier Räume (`build/extern/`) und den
Katalog, durch drei unabhängige Prüfer (je Buch einer), Stichprobe der Funde durch die Hauptsitzung bestätigt.

Ampeln: 🟢 abgedeckt · 🟡 zu schmal (nur Einzelfakten, Listen oder nur Zusatz) · 🔴 fehlt · 🔵 nicht im Katalog, für AE
fachlich wichtig · ⚪ nicht relevant (andere Fachrichtung, Historie, Übung, PROJEKT).

| Buch | Unterkapitel | 🟢 | 🟡 | 🔴 | 🔵 | ⚪ |
|---|---|---|---|---|---|---|
| Grundstufe LF1–5 | 150 | 93 | 31 | 1 | 6 | 19 |
| Fachstufe LF6–9 | 92 | 42 | 16 | 0 | 8 | 26 |
| Fachstufe II LF10–12 | 56 | 17 | 14 | 1 | 6 | 18 |
| **Summe** | **298** | **152** | **61** | **2** | **20** | **63** |

Von den 235 relevanten Unterkapiteln: 65 % abgedeckt, 26 % zu schmal, 9 % fehlen.
Dicht: Netzwerk-Bausteine, IT-Sicherheit, Testen, SQL, UML, Normalisierung, Projektmanagement, Recht.

## Lücken nach Thema (zusammengefasst über alle drei Bücher)

| Thema | Was fehlt (Beispiele) | in Büchern | betrifft im Tracker |
|---|---|---|---|
| **Datenbank aus dem Programm** | Verbindung → Statement mit Parametern → Ergebnismenge → Transaktion → schließen; DBMS-Aufgaben; ORM | **alle drei** | PB1-6, PB2-5/6 |
| **Datenstrukturen und Algorithmen** | Stack, Queue, Map, Set, Baum als Pflicht; Auswahlkriterien; O-Notation; Quick-/Mergesort; Hash-Tabelle | 2 | AP1-8-2, PB2-2 |
| **Sprachgrundlagen** | Typisierung, Gültigkeitsbereich, Wert- gegen Referenztyp, Zeichenketten, Ein-/Ausgabe, Dateizugriff | 2 | AP1-8-2, PB2-1 |
| **Datendarstellung** | Zweierkomplement, Überlauf, Gleitkomma, Unicode/UTF-8 | 1 | AP1-4-2 |
| **Sauberer Code und Entwurf** | Clean Code, Kommentieren, Modularisierung (Kopplung, Kohäsion), Architekturmuster | 1 | PB1-5 |
| **Oberflächen-Technik** | ereignisgesteuerte Programmierung (Event, Handler), Web (HTML/CSS/JS, DOM, Request/Response) | **2** | PB1-8 |
| **Sichere Softwareentwicklung** | Eingaben validieren, Ausgaben kodieren, keine Geheimnisse im Code, OWASP | 1 | PB1-10 |
| **Vorgehen und Betrieb** | Agile über Scrum hinaus (Kanban, Definition of Done, Schätzen), DevOps, VM/Container, RE-Prozess | 2 | PB1-1, PB1-3, PB1-12 |
| **Hardware-Gerüst** | EVA, von Neumann, Bus, Speicherhierarchie, Befehlszyklus | 1 (+ DAA) | AP1-4-1 |
| **Netzwerk-Gerüst** | Kapselung, Weg einer Anfrage, Port/Socket, TCP-Verbindungsaufbau | 1 | AP1-6 |
| **Kaufmännisches Gerüst** | Gewinn = Umsatz − Kosten, Verkaufskalkulation (im Trainer, nicht im Lernplan), ROI, Beschaffungsprozess als Ganzes | 1 | AP1-3 |

## Befund

1. Das Muster aus dem DAA-Vergleich bestätigt sich: Abgeschlossene Themen sind gut, offene Sachthemen haben Einzelfakten
   statt Gerüst.
2. **Neu:** Die größte Lücke ist die **Programmierpraxis** (Datenbankzugriff, Datenstrukturen, Sprachgrundlagen, Clean
   Code, Oberflächen). Die schriftliche Prüfung fragt Programmieren nur über Pseudocode und SQL auf Papier ab; was man
   zum echten Programmieren braucht, kam deshalb nie als Beleg vor. Für Beruf und Projektarbeit ist das zentral.
3. Größenordnung: rund 80 Unterkapitel (🟡, 🔴, 🔵), verteilt auf etwa 12 Tracker-Ordner. Ein Umbau ist das nicht: Die
   Gliederung trägt, es fehlt Gerüst in vorhandenen Stichpunkten, an wenigen Stellen ein neuer Stichpunkt.

## Nachprüfung am Buchtext (Stufe 1 und 2, 16.10.2026)

OCR-Text aller drei Bände lokal (`quellen/lehrbuch/`, E10), nur per Skript ausgewertet und vier Kapitel gelesen.

**Stufe 1 (Skript):** Bücher an den Unterkapiteln aufgeschnitten (276 von 298 gefunden), je Kapitel die 15 kennzeichnenden
Fachbegriffe (tf-idf) im Tracker gesucht. Anteil der Begriffe in Pflicht-Aussagen: 🟢 60 %, 🟡 48 %, 🔵 49 %. Die
Richtung stimmt, für ein einzelnes Kapitel ist das Maß zu grob (Allerweltswörter wie „Datenbank“ treffen immer;
ob ein Prinzip gelehrt wird, misst eine Wortzählung nicht).

**Stufe 2 (gelesen):**

| Kapitel | Ampel | Befund am Buchtext |
|---|---|---|
| Grundstufe 2.4.3 Prozessoren | 🟡 bestätigt | Buch: Bestandteile (ALU, Steuerwerk, MMU, Cache), Chipsatz als Verbindung, Taktgrenze und Parallelisierung (Multithreading, Pipelining), Desktop- gegen Server-CPU (ECC, TDP, PCIe-Lanes). Tracker: Aufgaben, Kerne/Takt, Hyper-Threading, Cache in einem Satz. Buch enthält auch Rabbit Holes (Codenamen, Nanometer, Moore). |
| Grundstufe 5.8.6 Datenbank mit Python | 🟡 bestätigt | Buch: Ablauf Verbindung → Cursor → execute → commit → close mit Fehlerbehandlung. Fehlt im Tracker. Parametrisierte Anweisungen (vom Prüfer erwartet) stehen **nicht** im Kapitel. |
| Fachstufe II 2.2.1 Datenstrukturen | 🟡 bestätigt | Buch: Array, Liste, verkettete Liste, Stack, Queue (LIFO/FIFO), Baum, Graph, Hashing, Zeiger, Effizienz der Grundoperationen. Tracker: Array und Liste Pflicht, Stack/Queue nur Zusatz. O-Notation (vom Prüfer erwartet) steht **nicht** im Kapitel. |
| Grundstufe 3.4.5 Adressen im Netzwerk (Gegenprobe) | 🟢 bestätigt | Buch: MAC, IPv4/IPv6, Subnetz, Broadcast, CIDR, Unicast/Multicast, Ports, Adressklassen. Tracker gleich oder tiefer (Subnetting-Lernweg); Adressklassen sind veraltet. |

**Kalibrierung:** Die Ampeln stimmen in 4 von 4 Fällen. Die Stichworte „was fehlt“ der Prüfer gehen teils über das Buch
hinaus (Prepared Statements, O-Notation) und stammen aus deren eigenem Fachwissen. Beim Nachbessern ist deshalb das
**Buchkapitel** der Maßstab für Tiefe und Ende, nicht die Stichwortliste.
