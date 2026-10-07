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

*(zuletzt aktualisiert: Pseudocode-Trainer fertig, SQL-Labor halb fertig)*

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

### In Arbeit: SQL-Labor (nächster Schritt)
- Fertig und getestet (`tests/sql.test.mjs`): Übungsdatenbank `sql/datenbank.js` mit Belegsatz-Funktionen (YEAR, MONTH,
  LEFT, RIGHT, CONCAT, DATEDIFF, DATEADD, NOW), 41 Aufgaben + 6 Rechte-Aufgaben `sql/aufgaben.js`, Prüfung über das Ergebnis `sql/engine.js`
- Fehlt: Laden von sql.js im Browser aus dem eingebetteten WebAssembly (`<script id="sqljs-wasm">`, Base64 →
  `initSqlJs({ instantiateWasm })`), Oberfläche `sql/SqlLabor.jsx` (Aufgabenliste je Modus, Editor, Strg+Enter,
  Ergebnistabelle, Schema-Ansicht, Musterlösung, freies Labor), Eintrag in `trainer/index.jsx`, Browser-Prüfung als file://

### Offen
- Modellieren (Diagramme: zuordnen, ergänzen, Fehler finden; Musterlösung mit Prüfliste)
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

*(wird zum Abschluss aus den Prüfberichten übertragen)*

---

## 5. Anleitung

*(folgt, sobald die App startbar ist)*
