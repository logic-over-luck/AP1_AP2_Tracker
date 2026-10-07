# STAND – Lernstudio Fachinformatik

Diese Datei ist das Gedächtnis des Projekts. Eine neue Sitzung liest sie und macht beim
nächsten offenen Punkt weiter.

---

## 1. Plan

### Teile der App

| Teil | Inhalt |
|---|---|
| **Grundgerüst** | Leiste links mit Lernraum-Umschalter (AP1, AP2, WiSo), Kopfzeile, Bereiche, Tastatursteuerung, Meldungen, Dialoge |
| **Lernstand** | Ereignisprotokoll im Browser (localStorage), daraus berechnet: Fortschritt, Wiederholungen, Kartenstand, Serie, Rang, Aktivität, Empfehlung. Sicherung als Datei mit Versionsnummer |
| **Start** | Kennzahlen, „Heute im Fokus" mit nachvollziehbarer Regel, Fokus-Timer, Aktivitätsübersicht, Rang und Serie, Tage bis zur Prüfung, Tempo bis zur Prüfung |
| **Lernen** | Ordner → Blöcke → Stichpunkte aus der Inhaltsdatei; Häkchen, Priorität, Wiederholungs-Phasen, Kurzfassung, „Alles anzeigen", Lernprompt, Filter, Suche |
| **Lernkarten** | Abstandswiederholung mit drei Bewertungen, Merken, Startpunkte: fällig, Stichpunkt, Block, Ordner, Zufallsmix, Gemerkte |
| **Trainer** | Zahlen & IT-Rechnen, Subnetze, Kaufmännisches Rechnen, Netzplan, Code (Pseudocode), SQL-Labor (nur AP2), Modellieren (Diagramme) |
| **Nachschlagen** | Glossar, Hilfe |

### Technik

- **Eine Datei zum Doppelklicken:** `Lernstudio.html` enthält alles (Code, Inhalte, Schriften,
  Symbole, SQL-Engine). Kein Server, kein Internet, keine nachgeladenen Module oder JSON-Dateien.
- **Quelltext** in `src/` (Preact + JSX, gebündelt mit esbuild). `npm run build` erzeugt
  `Lernstudio.html`. Die fertige Datei liegt immer im Repo.
- **Inhalte** in `inhalte/` (eigene JSON-Dateien), verknüpft über die IDs der Inhaltsdatei.
  Die Inhaltsdatei bleibt unverändert.
- **SQL:** sql.js (SQLite als WebAssembly, MIT). Das WebAssembly wird als Base64 in die Datei
  eingebettet und direkt übergeben, damit nichts per `fetch` geladen werden muss.
- **Schriften:** Inter und JetBrains Mono (SIL Open Font License), eingebettet.
- **Symbole:** Lucide (ISC-Lizenz), als SVG-Pfade eingebettet.
- **Tests:** `node --test` für Aufgabenerzeuger, Prüfer, Pseudocode-Interpreter, Lernstand.
- **Browser-Prüfung:** Playwright öffnet `Lernstudio.html` als `file://` und klickt durch.

### Reihenfolge

1. Plan (diese Datei), Werkzeuge, Inhalts-Format und Prüfskript
2. Inhalte in Arbeit geben (Kurzfassungen, Blocksätze, Lernkarten, Glossar-Vorschläge)
   – parallel in 20 Paketen, danach unabhängige Durchsicht durch andere Bearbeiter
3. Grundgerüst, Gestaltungssystem, Lernstand mit Ereignisprotokoll
4. Lernen (Herzstück) und Start
5. Lernkarten, Glossar, Hilfe, Sicherung
6. Trainer-Rahmen und Rechentrainer (Zahlen, Subnetze, Kaufmännisch, Netzplan) mit Tests
7. Code-Trainer mit Interpreter, Visualizer, Schreibtischtest, Puzzle, Fehlersuche, Sortieren
8. SQL-Labor
9. Modellieren (Diagramme)
10. Inhalte einbauen, Durchsicht auswerten, Feinschliff, Anleitung

### Eigene Ideen (geplant)

- **Befehlspalette (Strg+K):** Stichpunkte, Glossar und Trainer von überall finden.
- **Gegenstücke:** Am Stichpunkt ein Hinweis „Auch in AP2: …" mit Sprung in den anderen Raum.
- **Tempo bis zur Prüfung:** wie viele Stichpunkte je Woche nötig sind, um rechtzeitig fertig zu werden.
- **Eigene Notizen** je Stichpunkt.
- **Schwächen-Erkennung:** Fehler in Trainern und Karten fließen in „Hier lohnt sich Wiederholen".
- **Sicherungs-Erinnerung:** die Backup-Schaltfläche zeigt, wie lange die letzte Sicherung her ist.
- **Tastatur überall:** Lernkarten mit Leertaste und 1/2/3, Navigation mit Tastenkürzeln.

---

## 2. Stand

*(zuletzt aktualisiert: SQL-Labor fertig, als Nächstes Modellieren)*

### Fertig und geprüft (Tests + im Browser als file:// durchgeklickt)
- Bauschritt `tools/build.mjs` → eine Datei `Lernstudio.html` (≈ 2,6 MB) mit Inhalt, Schriften, Symbolen, SQL-Engine
- Inhalte: 246 Kurzfassungen, 88 Blocksätze, ≈ 2.640 Lernkarten in 20 Paketen; jedes Paket von einem zweiten Bearbeiter
  unabhängig durchgesehen (Berichte in `inhalte/pruefberichte/`); Glossar mit 1.098 Begriffen zusammengeführt und geprüft
- Grundgerüst: Leiste mit Raumwahl AP1/AP2/WiSo, eigene Akzentfarbe je Raum, Kopfzeile, Befehlspalette (Strg+K)
- Lernstand: Ereignisprotokoll, Wiederholungs-Phasen (1/7/30 Tage), Kartenplanung, Serie, XP, Ränge, Sicherung mit Format-Version
- Start: Kennzahlen, Heute im Fokus mit Regel, Fokus-Timer, Aktivität, Tempo bis zur Prüfung, Prüfungstermin je Raum
- Lernplan: Ordner, Block-Karten, Stichpunkte abhaken, Phasen, Kurzfassung, „Alles anzeigen", Lernprompt, Notizen, Gegenstücke, Filter, Suche
- Lernkarten: Übersicht, Sitzungen (fällig, neu, Mix, gemerkt, schwierig, Stichpunkt, Block, Ordner), Tastatur
- Glossar, Hilfe, Rangleiter, Feiern (Rang, Block, Serie)
- Trainer: Zahlen & IT-Rechnen, Subnetze, Kaufmännisches Rechnen, Netzplan & Projektplanung (mit Tests für Erzeuger und Prüfer)
- Pseudocode-Trainer: eigener Interpreter (`src/bereiche/trainer/code/pseudo.js`), Grundlagen, Visualizer, Schreibtischtest, Puzzle, Fehlersuche, Suchen & Sortieren
- SQL-Labor (nur AP2): sql.js läuft aus dem eingebetteten WebAssembly (`sql/laden.js`, kein fetch), 32 Abfragen,
  7 Änderungs-, 5 Struktur- und 6 Rechte-Aufgaben, freies Labor mit Beispielen; Prüfung über das Ergebnis,
  erwartetes Ergebnis und Musterlösung abrufbar, Schema-Ansicht mit PK/FK (klickbar), Fehlermeldungen auf Deutsch.
  Gelöste Aufgaben stehen im Lernstand (Ereignis `aufgabe` mit Feld `a` = Aufgaben-ID), Entwürfe nur in der Ansicht

### In Arbeit: Modellieren (nächster Schritt)
- Trainer für Diagramme und Modelle: zuordnen, ergänzen, Fehler finden; Musterlösung mit Prüfliste für Zeichnungen

### Offen
- Abschluss-Durchgang: alle Bereiche im Browser, schmale Fenster, Feinschliff
- Liste der fachlich unsicheren Inhalte in Abschnitt 4 übertragen

---

## 3. Entscheidungen

- **Eine HTML-Datei** statt mehrerer Dateien: robust beim Kopieren, garantiert ohne Nachladen.
- **Priorität eines Blocks = Durchschnitt** seiner Stichpunkte (hoch 3, mittel 2, normal 1; ab 2,5 hoch, ab 1,5 mittel).
  Das Maximum hätte fast jeden Block „hoch" gemacht. Stichpunkt-Priorität: original_aktuell → hoch;
  original_alt, stichwort_aktuell → mittel; stichwort_alt, kein_beleg → normal.
- **Wiederholungs-Phasen** nach 1, 7 und 30 Tagen, gesperrt bis zum Fälligkeitstag. Wird ein Block wieder geöffnet,
  ruhen die Phasen; erledigte bleiben erhalten.
- **Lernkarten-Abstände** 0/1/3/7/16/35/75 Tage; „sicher" ab Stufe 3. „Nicht gewusst" kommt in derselben Runde noch einmal.
- **XP und Ränge** gelten über alle drei Räume (eine Person lernt), Fortschritt dagegen je Raum.
- **„Alles anzeigen"** zeigt auch den Hinweis, wenn die Tiefe eines Stichpunkts laut Inhaltsdatei unklar ist (`rahmen_unklar`),
  weil das beim Lernen hilft (für die weitere Auslegung lernen). Belege, Katalogstellen und Vermerke bleiben unsichtbar.
- **Prüfungstermine** sind anfangs leer; die Startseite bittet darum, sie einzutragen (kein geratenes Datum).
- **Zuordnung Stichpunkt → Trainer** steht im Code (`src/bereiche/trainer/verzeichnis.js`); ein Test stellt sicher, dass
  jeder der 49 Stichpunkte außer „Wissen" geübt werden kann. Zusätzlich geübt: chmod (AP1-5-2-3), Parität (AP2-5-5-3),
  IPv4-Konfiguration und IPv6 (AP1-6-2-1, AP1-6-2-3).
- **Subnetz-Trainer** nur in AP1 (laut Inhaltsdatei keine Subnetz-Rechnung in AP2). „Netz aufteilen" ist als **Zusatz**
  markiert, weil es für AP1 laut Rahmen nicht belegt ist.
- **/31 und /32:** Aufgaben fragen dort nur Netzadresse und Adressanzahl und erklären klassisch (0 Hosts) und RFC 3021.
- **Prüfer:** Komma und Punkt beide erlaubt, Einheiten werden ignoriert, mehrdeutige Eingaben („1.234") zählen, wenn eine
  Lesart stimmt; genauere Ergebnisse als verlangt sind richtig; Eurobeträge haben 1 Cent Toleranz (Zwischenrundung).
- **Netzplan-Knoten:** FAZ | FEZ / Nr. | Vorgang / D | GP | FP / SAZ | SEZ, Start bei 0. Bei mehreren kritischen
  Wegen gilt jeder einzelne, mehrere oder die Menge aller kritischen Vorgänge als richtig.
- **Sozialversicherung:** Sätze und Bemessungsgrenzen stehen in jeder Aufgabe („Werte laut Aufgabe"), weil sie sich jährlich ändern.

---

## 4. Inhalte, bei denen ich fachlich nicht sicher bin

Alles hier ist in der App so umgesetzt, wie es nach bestem Wissen richtig ist – aber die Frage ist nicht endgültig
geklärt. Die IDs findest du in der App über die Suche (Strg+K) bzw. in `inhalte/lernen/*.json` (Feld `unsicher`).
Vor der Prüfung lohnt sich ein kurzer Abgleich mit Ausbilder, Lehrkraft oder den Prüfungsunterlagen.

### Rechtsstand (zuerst prüfen, ändert sich womöglich bis zur Prüfung)
- **Arbeitszeitgesetz** (WISO-1-3-4, WISO-3-1-1): Karten und Kurzfassung geben das geltende Recht wieder
  (8 bzw. 10 Stunden werktäglich, Stand Oktober 2026). Ein Regierungsentwurf will eine wöchentliche
  Höchstarbeitszeit (48 Stunden) einführen. Tritt er in Kraft, sind WISO-1-3-4-K5-1, -K5-4, WISO-3-1-1-K3-1 und die
  Kurzfassung WISO-1-3-4 anzupassen.
- **Sozialversicherung** (Kaufmännisch-Trainer): Beitragssätze und Bemessungsgrenzen stehen bewusst **in jeder
  Aufgabe** (KV 14,6 % + Zusatzbeitrag, PV 3,6 % + 0,6 % Kinderlosenzuschlag ab 23, RV 18,6 %, AV 2,6 %,
  BBG KV/PV 5.812,50 €, RV/AV 8.450 € je Monat). Die Rechenwege bleiben richtig, auch wenn sich Werte ändern; die
  Zahlen selbst sind jährlich zu prüfen.
- **ISO/IEC 25010** (AP2-1-3-1-K3-2): Die Norm wurde 2023 überarbeitet. Welche Fassung und welche deutschen Begriffe
  erwartet werden (z. B. „Reife" oder „Fehlerfreiheit"), ist offen.

### AP1
- **AP1-2-5-1-K1** Change-Management: Die Karten nutzen das Drei-Phasen-Modell nach Lewin. Ob ein anderes Modell
  (Kotter, Streich) erwartet wird, ist offen.
- **AP1-3-2-3-K1-1** Nutzwertanalyse: Wie Rangpunkte bei Gleichstand vergeben werden, wenn die Aufgabe nichts sagt.
- **AP1-4-1-4-K2-1** Anschlüsse am Bild erkennen: Die Karten beschreiben die Anschlüsse nur in Worten.
- **AP1-4-2-3-K2-1** Netzteil-Zuschlag: kein fester Prozentsatz; die Karten nennen keinen Wert.
- **AP1-4-1-2-K3-4** Bauform SO-DIMM/DIMM: Karte geht über die Können-Aussage hinaus.
- **AP1-5-1-3-K2-2** „Virtuelle Desktops (lokal)": nur eigene Server oder auch VM auf dem eigenen PC?
- **AP1-6-1-3-K5** Netzwerksymbole: liegen nicht als Bild vor.
- **AP1-8-2-4-K1-3** Laufzeitfehler: dritte Fehlerart oder inhaltlicher Fehler? Keine Karte fragt die Einordnung ab.
- **AP1-8-4-1-K5-2** Attribute an einer m:n-Beziehung (z. B. Menge): in AP1 erwartet?
- **AP1-8-4-4** EPK/BPMN: Sinnbilder nach ARIS bzw. BPMN 2.0; ob sie in AP1 überhaupt vorkommen, ist offen.

### AP2
- **AP2-2-1-1** „Klasse mit Liste": als Attributtyp `List<…>`, als Multiplizität am Attribut oder als Assoziation?
- **AP2-2-1-4-K2-1** Rückgabe im Sequenzdiagramm: offene oder gefüllte Pfeilspitze (UML erlaubt beide; die App zeigt die offene).
- **AP2-2-2-2-K3-3** Fremdschlüssel-Kennzeichnung im Tabellenmodell: „FK", „#" oder Pfeil? Die App schreibt „PK"/„FK".
- **AP2-2-3-1** EPK und BPMN: Prüfungsrelevanz für Anwendungsentwickler unklar; „Objekt" in der EPK als Informationsobjekt angenommen.
- **AP2-4-2-1-K6-3** `DATEDIFF`/`DATEADD`: Argumentreihenfolge je nach SQL-Dialekt. Das SQL-Labor akzeptiert
  `DATEDIFF(ende, start)` und `DATEDIFF('day', start, ende)`, `DATEADD('day', n, datum)` und `DATE_ADD(datum, n)`; die Karten fragen nur den Zweck.
- **AP2-4-3-2-K2-4** Datentyp ändern: `ALTER COLUMN` oder `MODIFY` – die Karten nennen beide.
- **AP2-4-3-3** Rechte: Das SQL-Labor erwartet `CREATE USER name IDENTIFIED BY 'pw'`; andere Systeme schreiben `WITH PASSWORD`.
  Rollen (`CREATE ROLE`) sind nicht abgedeckt.
- **AP2-5-5-3** „Redundanz": Prüfinformationen in Daten (so umgesetzt) oder doppelt ausgelegte Technik? Prüfziffern sind nicht abgedeckt.
- **AP2-6-1-1-K2-2** ARP: OSI-Schicht 2 (so in der Karte, mit Hinweis auf die uneinheitliche Zuordnung).
- **AP2-6-4-2-K4-3** RAID: Kapazität wird nur als Regel genannt, nicht gerechnet.

### WiSo
- **WISO-1-5-2-K2-1** Urabstimmung: Die üblichen 75 %/25 % stehen in Satzungen, nicht im Gesetz – keine eigene Karte.
- **WISO-3-2-1-K3-1** „Schwere Geräte heben": mechanische Gefährdung (laut Können-Aussage) oder physische Belastung?
- **WISO-3-4-1-K1-1** Rettungskette: Reihenfolge „sichern – Notruf – Erste Hilfe" nach Können-Aussage; lebensrettende Sofortmaßnahmen teils früher.
- **WISO-5-2-3** „Abgrenzung von Zuständigkeiten": Die Karten decken alle drei Auslegungen ab.

### Trainer
- **Netzplan**: Knotenaufbau FAZ | FEZ / Nr. | Vorgang / D | GP | FP / SAZ | SEZ mit Start bei 0. Manche Unterlagen
  zählen ab Tag 1 oder ordnen die Felder anders – die Rechenlogik ist dieselbe.
<!-- MODELLIEREN-UNSICHER -->

---

## 5. Anleitung

### Starten
1. `Lernstudio.html` aus dem Repository herunterladen (auf GitHub: Datei öffnen → „Download raw file").
2. In einen festen Ordner legen, z. B. `Dokumente/Lernstudio/`.
3. Doppelklick – die Datei öffnet sich im Browser (Chrome, Edge oder Firefox). Kein Internet, keine Installation.
4. Oben links den Lernraum wählen (AP1, AP2, WiSo), auf der Übersicht das Prüfungsdatum eintragen.

Bedienung mit der Tastatur: **Strg+K** (oder **/**) sucht überall, in Lernkarten **Leertaste** = umdrehen,
**1/2/3** = bewerten, in den Trainern **Enter** = prüfen, im SQL-Labor **Strg+Enter** = ausführen.

### Lernstand sichern
Der Lernstand liegt **nur in diesem Browser** auf diesem Rechner (localStorage). Er geht verloren, wenn du die
Browserdaten löschst, einen anderen Browser nimmst oder – je nach Browser – die Datei verschiebst.
- **Sicherung** (Knopf oben rechts) → „Sicherung herunterladen" speichert `lernstudio-sicherung-<Datum>.json`.
  Ein Punkt am Knopf erinnert dich, wenn die letzte Sicherung älter als 7 Tage ist.
- **Einlesen** auf derselben Seite: „Ersetzen" (Stand aus der Datei übernehmen) oder „Zusammenführen" (beide Stände
  vereinen, z. B. Laptop + PC). Jede Sicherung trägt eine Formatnummer; ältere Sicherungen werden beim Einlesen
  automatisch umgewandelt.

### Neue Version einspielen
1. Vorher eine **Sicherung** herunterladen.
2. Die neue `Lernstudio.html` an **dieselbe Stelle** legen (alte Datei ersetzen) und öffnen.
3. Der Lernstand ist normalerweise sofort wieder da. Falls nicht: Sicherung einlesen („Ersetzen").

Lernstand und Inhalt sind nur über IDs verbunden. Ändert sich ein Inhalt, bleibt der Fortschritt erhalten;
Häkchen zu Stichpunkten, die es nicht mehr gibt, werden einfach übersprungen.

### Für die Weiterentwicklung
- `npm install` einmalig, dann `npm run build` → baut `Lernstudio.html` neu (Inhalte, Code, Schriften, SQL-Engine in einer Datei).
- `npm test` – alle automatischen Tests (Prüfer, Aufgabenerzeuger, Interpreter, SQL, Lernstand, Modellieren-Aufgaben).
- `npm run inhalte` – prüft die Inhaltspakete in `inhalte/lernen/`.
- `node tools/browser-check.mjs '#/ap2/trainer/sql'` – öffnet die Datei als file:// in Chromium, macht Fotos, meldet Konsolenfehler.
- `node tools/modell-galerie.mjs <modus> ap2 <ordner>` – zeigt alle Modellieren-Aufgaben eines Modus mit Lösung als Bilder.
- Neuer Trainer: Eintrag in `src/bereiche/trainer/verzeichnis.js` (welche Stichpunkte er übt) und Komponente in
  `src/bereiche/trainer/index.jsx`. Neue Diagrammaufgaben: siehe `src/bereiche/trainer/modellieren/README.md`.
- Die Inhaltsdatei `Inhaltsdatei_AP1_AP2_tracker.json` wird nie verändert; eigene Inhalte liegen in `inhalte/`.
