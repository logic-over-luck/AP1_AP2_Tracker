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

## Stufe 3: alle markierten Kapitel gelesen (16.10.2026, Freigabe Projektinhaber)

Fünf Prüfer haben die 82 Kapitel mit 🟡/🔴/🔵 am OCR-Text gelesen (eines, „IoT-Protokolle“, fehlt im OCR-Text) und mit
Pflicht, Erklärungen und Karten des Trackers verglichen. Maßstab war das Buchkapitel, gefiltert für AE (keine Historie,
Hersteller, Bedienschritte, Systemintegration). Auftrag und Ergebnisse je Gruppe: `umbau/berichte/P54-stufe3/`
(nur eigene Stichworte, keine Buchauszüge).

| Gruppe | Kapitel | ✅ reicht | ➕ kleine Ergänzung | 🧱 Gerüst fehlt | ⚪ nicht nötig |
|---|---|---|---|---|---|
| A Grundstufe LF1–2 | 18 | 1 | 11 | 3 | 3 |
| B Grundstufe LF3–5 | 20 | 2 | 12 | 5 | 1 |
| C Fachstufe LF6–7 | 12 | 1 | 6 | 2 | 3 |
| D Fachstufe LF8–9 | 11 | 0 | 7 | 3 | 1 |
| E Fachstufe II LF10–12 | 21 | 1 | 15 | 4 | 1 |
| **Summe** | **82** | **5** | **51** | **17** | **9** |

**Gesamtbild über alle relevanten Kapitel** (152 grün aus dem Inhaltsverzeichnis + 82 gelesen − 9 nicht nötig = 225):
**reicht 157 (70 %) · kleine Ergänzung 51 (23 %) · Gerüst fehlt 17 (8 %).**

### Wo das Gerüst fehlt (17 Kapitel, 13 Themen)

Im Katalog, also prüfungsrelevant:

| Thema | Kapitel | Tracker |
|---|---|---|
| Datenbank aus dem Programm (Verbindung → Anweisung → Ergebnis → commit → schließen, Fehler) | Grundstufe 5.8.6, dazu ➕ in Fachstufe 3.7.5 und Fachstufe II 2.3.8 – **in allen drei Büchern** | PB1-6, PB1-11-2-3 |
| Was ein Datenbanksystem ist (Datenbasis + DBMS, Aufgaben, Drei-Ebenen-Architektur) | Grundstufe 5.8.1 | PB1-6 |
| Datenstrukturen (Array, verkettete Liste, Stack, Queue, Hashtabelle, Set, Baum, Graph; Auswahl) | Fachstufe II 2.2.1, 2.2.2 | AP1-8-2, PB2-2 |
| Darstellung von Daten (Zweierkomplement, Gleitkomma, ASCII/Unicode/UTF-8, Datum/Zeit) | Grundstufe 5.2.4 | AP1-4-2 |
| Quellcode kommentieren, sprechende Namen | Grundstufe 5.10.3 | AP1-8, PB1-9 |
| Wie eine CPU arbeitet und was ihre Leistung begrenzt | Grundstufe 2.4.3 | AP1-4-1-2 |
| Geschäftsprozesse (Kern-/Supportprozess, Workflow, Flüsse) | Grundstufe 1.3.5 | AP1-3-1-5, AP1-8-4-4 |
| Beschaffungsprozess als Ganzes | Grundstufe 2.9.1 | AP1-3-2 |
| Ursachenanalyse bei Störungen (5-Why als Pflicht, Ishikawa) | Fachstufe 1.3.1 | AP1-1-3-2 |
| Datenqualität (Kriterien, Messung, Bereinigung) | Fachstufe 3.2.1 | PB1-7-1-3, PB2-6-1-5 |
| Sicherheit im Softwareentwurf (Schichten, sicherer Zustand, Eingaben prüfen, Framework statt Eigenbau) | Fachstufe 3.3.7 | PB1-10-1 |

Nicht im Katalog, für den Beruf wichtig:

| Thema | Kapitel |
|---|---|
| Clean Code (Refactoring, KISS, DRY, YAGNI, SRP/SOLID, Praxisregeln) | Fachstufe II 2.1.4 |
| Oberflächen programmieren (ereignisgesteuert, Listener; Web: HTML/CSS/JS, Formular GET/POST) | Fachstufe 3.5.4, Fachstufe II 1.4.4 |
| Dateizugriff aus Programmen | Grundstufe 5.7.7 |
| MQTT | Fachstufe 2.2.2 |

### Kalibrierung

In allen fünf Gruppen nannten die Vorbefunde (nur nach Titel) Inhalte, die im Kapitel gar nicht stehen (z. B. O-Notation,
Prepared Statements, Story Points, CAP/BASE, Typisierung, Gültigkeitsbereich, Container). Diese sind nicht gezählt; die
Urteile sind deshalb milder als die Ampeln. Das Buch hat selbst Fehler (2^64 als 512 GB, DDR3 als Standard) und
abweichende Lesarten (MVC: Logik im Controller); beim Nachbessern gilt fachliche Richtigkeit vor Buchtext.

### Folgerung

Für die schriftliche Prüfung reicht der Tracker in 70 % der Kapitel ganz, in 23 % fehlen ein bis drei Punkte, in 8 %
fehlt das Gerüst. Kein Umbau: Gliederung, IDs, Karten und Lernstand bleiben.

**Korrektur (nach Rückfrage des Projektinhabers):** (1) Gelesen wurden nur die 82 markierten Kapitel, **32 % des
Buchtexts**; die 152 grünen Kapitel sind nur nach Titel beurteilt (am Text geprüft: 1 Gegenprobe). Die 70 % sind deshalb
eine Obergrenze. (2) Die Ergebnisdateien nennen **rund 180 fehlende Punkte** (60 in 🧱, 119 in ➕), davon etwa zwei
Drittel in Kapiteln mit Katalogbezug – Größenordnung einer Nachbesserung also 150–180 Können-Aussagen (heute rund 1.290),
darunter etwa 13 neue oder erweiterte Stichpunkte. (3) Jedes Kapitel hat ein Prüfer gelesen; gegengeprüft nur
stichprobenweise. Offen: Stichprobe aus den grünen Kapiteln am Text.
