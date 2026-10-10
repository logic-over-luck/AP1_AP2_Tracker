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
| **Lernen** | Ordner → Blöcke → Stichpunkte aus der Inhaltsdatei; Häkchen, Wichtigkeit, Wiederholungs-Phasen, Kurzfassung, „Alles anzeigen", Lernprompt, Filter, Suche |
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

*(zuletzt aktualisiert: alle Teile fertig, Abschluss-Durchgang erledigt)*

### Fertig und geprüft (Tests + im Browser als file:// durchgeklickt)
- Bauschritt `tools/build.mjs` → eine Datei `Lernstudio.html` (≈ 3,1 MB) mit Inhalt, Schriften, Symbolen, SQL-Engine
- Inhalte: 246 Kurzfassungen, 88 Blocksätze, ≈ 2.640 Lernkarten in 20 Paketen; jedes Paket von einem zweiten Bearbeiter
  unabhängig durchgesehen (Berichte in `inhalte/pruefberichte/`); Glossar mit 1.098 Begriffen zusammengeführt und geprüft
- Grundgerüst: Leiste mit Raumwahl AP1/AP2/WiSo, eigene Akzentfarbe je Raum, Kopfzeile, Befehlspalette (Strg+K)
- Lernstand: Ereignisprotokoll, Wiederholungs-Phasen (1/7/30 Tage), Kartenplanung, Serie, XP, Ränge, Sicherung mit Format-Version
- Lernplan-Seite mit Cockpit oben (auf Wunsch zusammengelegt): vier Kacheln (Fortschritt mit Prüfung und Tempo,
  Lernkarten, Serie mit Wochenleiste, Fokus-Timer), darunter „Dein nächster Schritt" über die volle Breite, dann der Lernplan
- Intro beim Öffnen (einmal je Tab, jederzeit per Klick aufs Logo, überspringbar, von selbst nicht bei „Bewegung reduzieren"): Terminal tippt „hello world",
  Logo erscheint; die Cockpit-Kacheln warten und treten erst nach dem Intro nacheinander auf (auch nach Überspringen sofort)
- Lernplan: Ordner, Block-Karten, Stichpunkte abhaken, Phasen, Kurzfassung, „Alles anzeigen", Lernprompt, Notizen, Gegenstücke, Filter, Suche
- Lernprompts (`lernen/lernprompt.js`): Block-Knopf kopiert nur die noch offenen Stichpunkte (erledigte stehen nur als
  Einordnung dabei), jede Stichpunkt-Zeile hat einen eigenen Kopier-Knopf. Die KI geht die Stichpunkte einzeln durch
  (Vorwissen fragen → erklären → je Können-Aussage eine Frage → Zusatz je Art) und sagt am Ende „✅ Kannst du abhaken: …“.
  Unklare Tiefe und eigene Notiz stehen mit drin. Ist alles abgehakt, wird daraus ein Wiederholungs-Prompt.
  Tests: `tests/lernprompt.test.mjs`
- Lernkarten: Übersicht, Sitzungen (fällig, neu, Mix, gemerkt, schwierig, Stichpunkt, Block, Ordner), Tastatur
- Glossar, Hilfe, Rangleiter, Feiern (Rang, Block, Serie)
- Trainer: Zahlen & IT-Rechnen, Subnetze, Kaufmännisches Rechnen, Netzplan & Projektplanung (mit Tests für Erzeuger und Prüfer)
- Subnetz-Trainer neu aufgestellt (Abschnitt 6): drei Räume, Lernweg mit 23 Lektionen als Kapitel-Liste, jede Lektion gleich
  aufgebaut (Erklärung in Schritten, Prüfungsdefinition, Ausprobieren, Stolperfallen, Check), 10 Übungen nach Themen;
  Tests für `braucht`, Kompetenz-Abdeckung, Checks und Übungen; im Browser auf Desktop und Handy (390 px) durchgeklickt
- Zahlen-Trainer mit Räumen Verstehen und Üben (Abschnitt 7): Lernweg mit 13 Lektionen (Zahlensysteme, Datenmengen,
  Bits in der Praxis, Strom; Paritätsbit nur AP2), gleicher Rahmen wie beim Subnetz-Trainer (`trainer/lernweg/`);
  der Subnetz-Lernweg verweist für Binär, Zweierpotenzen und Hex dorthin. Tests in `tests/lernweg.test.mjs`
- Pseudocode-Trainer: eigener Interpreter (`src/bereiche/trainer/code/pseudo.js`), Grundlagen, Visualizer, Schreibtischtest, Puzzle, Fehlersuche, Suchen & Sortieren
- SQL-Labor (nur AP2): sql.js läuft aus dem eingebetteten WebAssembly (`sql/laden.js`, kein fetch), 32 Abfragen,
  7 Änderungs-, 5 Struktur- und 6 Rechte-Aufgaben, freies Labor mit Beispielen; Prüfung über das Ergebnis,
  Musterlösung und Nachschlagewerk unter jeder Aufgabe aufklappbar (kein eigener Grundlagen-Reiter mehr),
  Schema-Ansicht mit PK/FK (klickbar), Fehlermeldungen auf Deutsch.
  Gelöste Aufgaben stehen im Lernstand (Ereignis `aufgabe` mit Feld `a` = Aufgaben-ID), Entwürfe nur in der Ansicht
- Modellieren: eigener SVG-Diagramm-Baukasten (`modellieren/diagramm.jsx`) für UML (Anwendungsfall, Klasse, Aktivität,
  Sequenz, Zustand), ER- und Tabellenmodell, EPK/BPMN und Masken. 108 Aufgaben in 11 Bereichen: Lücken ergänzen und
  Fehler finden (automatisch geprüft, Lösung erscheint im Diagramm), Verständnisfragen, Zeichen- und Schreibaufgaben mit
  Musterlösung und Prüfliste zur Selbstbewertung, Notation je Bereich (für AP1 eigene, schlanke Fassung, wo nötig).
  Jeder Bereich von einem Bearbeiter erstellt und von einem zweiten unabhängig geprüft; alle Bilder angesehen
  (`tools/modell-galerie.mjs`); Struktur-Tests in `tests/modellieren.test.mjs`

### Offen / bewusst nicht umgesetzt
- Bilder von Anschlüssen und Netzwerksymbolen (AP1-4-1-4, AP1-6-1-3): Die Karten beschreiben sie in Worten.
- Die Diagramm-Zeichenaufgaben bewertest du selbst mit der Prüfliste – eine automatische Bewertung freier Zeichnungen wäre nicht ehrlich.

---

## 3. Entscheidungen

- **Eine HTML-Datei** statt mehrerer Dateien: robust beim Kopieren, garantiert ohne Nachladen.
- **Wichtigkeit statt Belegstärke** (auf Wunsch geändert): Ein Block ist so wichtig, wie oft er in den ausgewerteten
  Prüfungen dran war. Jede Prüfung zählt einmal mit ihrem stärksten Beleg: Originalprüfung nach aktuellem Katalog 1,
  nach altem Katalog 0,6, nur Themen-Stichwort (Podcast-Themenliste, Gedächtnisprotokoll) 0,5 bzw. 0,3. Dazu Punkte:
  eine Aufgabe ab 10 Punkten +0,5, ab 15 Punkten +1 (aus dem Rahmen; weitere Punktangaben in `inhalte/gewichtung.json`).
  Die Stufe ist relativ zum wichtigsten Block des Raums: Top-Thema ab 80 %, Häufig ab 50 %, Gelegentlich ab 20 %,
  sonst Selten. Relativ deshalb, weil WiSo nur drei ausgewertete Prüfungen hat. Die Marke zeigt beim Darüberfahren,
  in wie vielen Prüfungen das Thema vorkam und wie viele Punkte es höchstens brachte – nie die Quellen selbst.
  Offen: Eine Punkte-Auswertung je Thema (z. B. aus dem IT-Berufe-Podcast) würde die Gewichtung weiter schärfen;
  die Seite war von hier aus nicht erreichbar.
- **Wiederholungs-Phasen** nach 1, 7 und 30 Tagen, gesperrt bis zum Fälligkeitstag. Wird ein Block wieder geöffnet,
  ruhen die Phasen; erledigte bleiben erhalten.
- **Lernkarten-Abstände** 0/1/3/7/16/35/75 Tage; „sicher" ab Stufe 3. „Nicht gewusst" kommt in derselben Runde noch einmal. „Gewusst" bei einer neuen Karte springt gleich auf 3 Tage, „Unsicher" auf 1 Tag – so unterscheiden sich die Knöpfe auch beim ersten Mal.
- **XP und Ränge** gelten über alle drei Räume (eine Person lernt), Fortschritt dagegen je Raum. Abwählen eines Stichpunkts zieht seine Punkte und einen Block-Bonus wieder ab (auf den Tag, an dem sie gebucht wurden); An- und Abhaken bringt also nichts. Konfetti läuft zeitbasiert (gleich schnell auf 60- und 144-Hz-Bildschirmen), rund 4 Sekunden.
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
- **Aufgabenarten wählen:** Im Zahlen-Trainer (Raum Üben) lassen sich einzelne Arten an- und abwählen (z. B. nur Dez → Hex);
  die Auswahl merkt sich der Browser. Andere Trainer haben das noch nicht.
- **SQL-Labor (prüfungsnah):** Aufbau nach echten AP2-Prüfungen (Winter 2025/26, Sommer 2026 – nur das Format
  übernommen, keine Prüfungsinhalte im Repository). Das Schema steht kompakt direkt über dem Lösungsfeld: je Tabelle
  eine Karte mit Spalten, Typ und Schlüsselsymbol (anders als in der Prüfung, dort sind Schlüssel nicht markiert);
  Namen sind anklickbar und landen im Lösungsfeld. Die ersten Datensätze jeder Tabelle („Beispieldaten“) lassen sich
  aufklappen; die Wahl merkt sich der Browser. Aufgaben im
  Prüfungsstil mit Punkten (geschätzt nach Umfang), ohne Ergebnisbeispiel. Unter „Prüfen“:
  Lösungshinweis und Nachschlagewerk im Aufbau des Belegsatzes „SQL-Syntax (Auszug)“ (Syntax | Beschreibung, eigene
  Formulierungen). Die Übungsdatenbank kennt zusätzlich die Belegsatz-Funktionen WEEKDAY, HOUR, MINUTE, STDDEV,
  VARIANCE und DATEADD/DATEDIFF mit Datumsteil ohne Anführungszeichen. MODIFY COLUMN und nachträgliches ADD FOREIGN
  KEY kann SQLite nicht – im Nachschlagewerk vermerkt.
- **Probeprüfung (im Aufbau):** eigener Bereich je Lernraum (`src/bereiche/pruefung/`). Bauplan aus der Auswertung echter
  Prüfungen (AP1 F24–2026, AP2 PB1/PB2 S24–S26, WiSo S24–S26; nur Aufbau, Typen, Punkte und Themen übernommen, keine
  Prüfungsinhalte im Repository). Prüfungssätze = eigene fiktive Firma mit 4 Aufgaben/100 P bzw. 30 WiSo-Fragen
  (Format: `src/bereiche/pruefung/README.md`, Prüfung mit `node tools/pruefe-satz.mjs`). „Gemischt“ zieht gewichtet nach
  Wichtigkeit und Bauplan (PB2: Algorithmus + SQL, PB1: Modell), Uhr mit Pause, WiSo automatisch bewertet (Teilpunkte bei
  Mehrfachauswahl/Zuordnung), sonst Selbstbewertung mit Musterlösung und Punkteschema; Ergebnis mit IHK-Note als Ereignis
  `pruefung` im Lernstand (XP, Schwächen je Stichpunkt). Bewertung (AP1/PB1/PB2) ohne Selbstbewertung: Zahlen und Auswahl prüft die App,
  den Rest eine KI nach Wahl über einen kopierten Prompt (`ki.js`); deren Antwort besteht nur aus Zeilen „1aa:4“ und
  wird streng gelesen (jede Nummer genau einmal, 0 … Höchstpunkte, halbe Punkte). Zeichenaufgaben werden nicht bewertet
  und im Ergebnis als „nicht ermittelt“ mit ihren Punkten ausgewiesen; Prozent und Note beziehen sich auf die
  ermittelten Punkte. Vorrat: je Teil 2 Sätze (ap1-01/02, pb1-01/02, pb2-01/02, wiso-01/02), jeder unabhängig geprüft.
- **Subnetz-Trainer neu aufgestellt** (auf Wunsch, Oktober 2026): drei Räume **Verstehen** (Lernweg mit 23 Lektionen in
  5 Themen-Blöcken), **Üben** (Aufgaben nach denselben Blöcken) und **Visualisieren** (Visualizer unverändert). Der alte
  Verstehen-Raum (Tabs → Schritte → Lektionen) wurde nicht weiter umgebaut, sondern ersetzt; Plan, Gliederung, Tabelle
  Kompetenz → Lektion und Dateistruktur in Abschnitt 6.
- **Zahlensysteme gehören in den Zahlen-Trainer** (auf Wunsch, Oktober 2026): Binär- und Hexadezimalzahlen werden nicht im
  Subnetz-Lernweg erklärt, sondern im Lernweg des Zahlen-Trainers. Der Subnetz-Lernweg zeigt Binärzahlen nur dort, wo er sie
  braucht, und verweist mit einem Klick auf die Grundlage. Der Zahlen-Trainer hat dafür dieselben Räume bekommen; der
  gemeinsame Rahmen steht in `trainer/lernweg/` (Abschnitt 7).
- **Subnetz-Visualizer:** eigener Raum „Visualisieren“, zum Nachschlagen (`subnetz/Visualizer.jsx`, Rechnung `zerlege` und
  `subnetzeImOktett` in `ip.js`, getestet). Kompakt auf einer Seite: Leiste (IP, Präfix-Regler, Beispiel), Rechenweg als vier
  Karten (Grenze, Maske, Blockgröße, Block der Adresse), 32 Bits von IP/Maske/Netz/Broadcast mit markierter Grenze (IP-Bits
  per Klick umschaltbar), Kennzahlen-Kacheln (inkl. Wildcard, privat/öffentlich, Teilnetze), Zahlenstrahl des
  entscheidenden Oktetts (Hover zeigt den Block, Klick springt hinein), Liste aller Teilnetze und Präfix-Tabelle /24–/30.
- **Kaufmännisch im Schema:** Rechnung, Kosten je Monat, Budget, Vor-/Nachkalkulation, Kauf/Leasing/Finanzierung,
  Tilgungsplan, Angebotsvergleich (Listenpreis → Zieleinkaufspreis → Bareinkaufspreis → Bezugspreis), Nutzwertanalyse,
  Sozialversicherung und Gewinnverteilung werden direkt in einer Tabelle ausgefüllt wie im Unterricht. Kleine
  Ein-Zahl-Aufgaben (Kennzahlen, Soll-Ist, Pay-per-Use …) behalten einzelne Felder.
- **Eigener Rechenweg:** Rechen-Trainer (Zahlen, Subnetze, Kaufmännisch, Netzplan, Pseudocode außer Puzzle) haben ein Feld „Rechenweg & Notizen“. Es steht immer direkt über „Prüfen“, wird nicht geprüft und nicht
  gespeichert, bei „Neue Aufgabe“ ist es wieder leer.
- **Netzplan-Pfeile:** gerade und rechtwinklig wie in den Prüfungsheften (waagerecht raus, in der Lücke senkrecht,
  waagerecht rein). Spalten werden so sortiert, dass sich wenige Pfeile kreuzen; Pfeile über mehrere Spalten laufen
  durch eine freie Bahn statt hinter Knoten.
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
- **ER/Tabellen/Normalisierung**: Kardinalitäten in Chen-Notation stehen neben der Entität, deren Anzahl sie angeben („1 Kunde – n Bestellungen"); andere Unterlagen schreiben sie gegenüber. Zusammengesetzte Anschrift gilt als 1NF-Verstoß (übliche Lesart, theoretisch umstritten). PLZ → Ort: eigene Ort-Tabelle und Verbleib beim Teilnehmer gelten beide als richtig. Spalten Kurs1, Kurs2, Kurs3 als Wiederholungsgruppe = nicht 1NF-gerecht (manche Bücher sehen das formal anders).
- **Aktivitätsdiagramm**: Zwei eingehende Kanten direkt an einer Aktion bedeuten nach UML 2 „warten auf beide" – deshalb führt die App Zusammenführungen immer über eine Raute. Manche Lösungen sind da lockerer; bewertet wird die Regel in keiner Auswahl.
- **Zustandsdiagramm**: Ein Zeitablauf ist ein Auslöser `after(15 min)`, keine Bedingung `[nach 15 min]` – so in zwei Aufgaben als Fehler gewertet.
- **EPK**: „Mit XOR verzweigt, mit XOR zusammenführen" ist übliche Praxis, keine harte Regel jeder EPK-Lehre. Organisationseinheiten und Informationsobjekte hängen mit einfacher Linie an der Funktion.
- **Dialoggestaltung (DIN EN ISO 9241-110)**: Abgefragt werden nur Grundsätze, die in alter und neuer Fassung stehen; „Fehlertoleranz" heißt seit 2020 „Robustheit gegen Benutzungsfehler".
- **Lasten-/Pflichtenheft**: „Pflichtenheft ist nach Freigabe verbindliche Grundlage" ist Lehrmeinung; die Vertragspraxis kann abweichen.
- **Klassendiagramm**: Aggregation vs. Komposition bei Lehrbuchfällen (Gebäude–Raum = Komposition, Projektteam–Mitarbeiter = Aggregation) ist diskutierbar; die Aufgabe nennt deshalb die Prüffrage „Was passiert mit den Teilen, wenn das Ganze gelöscht wird?". „Klasse mit Liste": Musterlösung als Attribut `List<…>`, Assoziation gilt als ebenso richtig.
- **Sequenzdiagramm**: Erzeugen wird gestrichelt mit offener Spitze und «create» gezeichnet (manche Werkzeuge: durchgezogen); Rückgabe mit offener Spitze.
- **Masken**: Grundsätze der Dialoggestaltung nach der Fassung 2020; die Grenze zwischen Selbstbeschreibungsfähigkeit und Erlernbarkeit ist fließend – die Aufgabe fragt nach dem Grundsatz, „der hier im Vordergrund steht".
- **BPMN in AP1**: Sequenz- und Nachrichtenfluss werden in AP1 nur benannt/gelesen; Unterscheiden und Modellieren ist AP2.

---

## 5. Anleitung

### Starten
1. `Lernstudio.html` aus dem Repository herunterladen (auf GitHub: Datei öffnen → „Download raw file").
2. In einen festen Ordner legen, z. B. `Dokumente/Lernstudio/`.
3. Doppelklick – die Datei öffnet sich im Browser (Chrome, Edge oder Firefox). Kein Internet, keine Installation.
4. Oben links den Lernraum wählen (AP1, AP2, WiSo), oben auf der Lernplan-Seite bei „Prüfung“ das Prüfungsdatum eintragen.

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
- **Alles zurücksetzen** (ganz unten im Sicherungsfenster, mit Sicherheitsabfrage) löscht den gesamten Lernstand und die Ansichts-Einstellungen in diesem Browser.

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
- `node tools/pruefpakete.mjs` – schreibt `inhalte/pruefpakete/<paket>.md` neu (nach jeder Änderung an `inhalte/lernen/`). Für eine externe Durchsicht ein Paket zusammen mit `inhalte/pruefpakete/PRUEFAUFTRAG.md` an eine KI oder Lehrkraft geben.
- `node tools/browser-check.mjs '#/ap2/trainer/sql'` – öffnet die Datei als file:// in Chromium, macht Fotos, meldet Konsolenfehler.
- `node tools/modell-galerie.mjs <modus> ap2 <ordner>` – zeigt alle Modellieren-Aufgaben eines Modus mit Lösung als Bilder.
- Neuer Trainer: Eintrag in `src/bereiche/trainer/verzeichnis.js` (welche Stichpunkte er übt) und Komponente in
  `src/bereiche/trainer/index.jsx`. Neue Diagrammaufgaben: siehe `src/bereiche/trainer/modellieren/README.md`.
- Die Inhaltsdatei `Inhaltsdatei_AP1_AP2_tracker.json` wird nie verändert; eigene Inhalte liegen in `inhalte/`.

---

## 6. Subnetz-Trainer – Neuaufbau

*Stand: umgesetzt (Etappen 1–5), getestet (`tests/subnetz.test.mjs`), im Browser auf Desktop und Handy geprüft.
Oktober 2026 überarbeitet: Binär- und Hexadezimalzahlen sind in den Zahlen-Trainer gewandert (Abschnitt 7), der
Rahmen (Räume, Lernweg, Lektion, Check) liegt in `trainer/lernweg/` und wird von beiden Trainern genutzt.*

Der alte Trainer („Verstehen“ als Tabs → Schritte → Lektionen) wird nicht weiter ausgebessert, sondern neu
aufgestellt. Geplant ist von den Inhalten her, nicht vom alten Code aus; der alte Code dient danach nur als
Steinbruch für einzelne Bausteine (siehe 6.6).

### 6.1 Drei Räume

Oben im Trainer genau drei Umschalter:

| Raum | Inhalt |
|---|---|
| **Verstehen** | Lernweg: 5 Themen-Blöcke, 23 Lektionen, Begriff für Begriff |
| **Üben** | Aufgaben mit Prüfen, gruppiert nach denselben Themen-Blöcken |
| **Visualisieren** | der bestehende Visualizer, unverändert |

Adresse: `#/ap1/trainer/subnetz?modus=<id>&lektion=<id>`. `modus` bleibt der Schlüssel, weil Lernplan und
Block-Karten schon mit `?modus=analyse` usw. in den Trainer springen. Der Raum ergibt sich aus dem Modus
(`verstehen`, `visual` oder eine Übung).

### 6.2 Gliederung „Verstehen“

`braucht` = Lektionen dieses Lernwegs (nur rückwärts), `Grundlage` = Lektion in einem anderen Trainer
(Feld `grundlagen`, als Chip im Lektionskopf und als Hinweis im Text – kein Muss für den Fortschritt).

**Die IPv4-Adresse** (Lektion 1–4)
Erst das Ding selbst (vier Oktette mit Punkten), dann die eine Idee, auf der alles Weitere ruht: Eine Adresse
besteht aus Netzanteil und Hostanteil. Wo der Netzanteil endet, sagen Präfix und Subnetzmaske – zwei Schreibweisen
derselben Sache. Die Stelle heißt im Lernweg kurz „Grenze zwischen Netz- und Hostanteil“; das Hilfswort wird in
Lektion 2 ausdrücklich eingeführt und taucht in Leitfragen, Definitionen und Checks nicht auf. Binärzahlen werden
hier nicht mehr erklärt, sondern vorausgesetzt: Präfix und Subnetzmaske verweisen auf die Lektion „Binärzahl“ im
Zahlen-Trainer.

| Nr | id | Begriff | Leitfrage | braucht | Grundlage |
|---|---|---|---|---|---|
| 1 | `ip-adresse` | IP-Adresse | Woran erkennt das Netz ein Gerät? | – | – |
| 2 | `netz-host` | Netzanteil und Hostanteil | Welcher Teil nennt das Netz, welcher das Gerät? | 1 | – |
| 3 | `praefix` | Präfix | Wie viele Bits gehören zum Netzanteil? | 2 | zahlen:binaer |
| 4 | `subnetzmaske` | Subnetzmaske | Wie schreibt man den Präfix als Adresse? | 3 | zahlen:binaer |


**Subnetting** (Lektion 5–12)
Zuerst nur Netze, deren Netzanteil im letzten Oktett endet (/24 bis /30): Dort steht alles Wichtige in einer
Zahl, Netzgröße und Blockgröße sind gleich. Von „Wie groß?“ über „Wo fängt es an, wo hört es auf?“ zu
„Welche Adressen bekommen Geräte?“; erst wenn das sitzt, kommt das 3. Oktett (die häufigste Stolperstelle) und
am Ende das feste Rechenschema für die Prüfung.

| Nr | id | Begriff | Leitfrage | braucht | Grundlage |
|---|---|---|---|---|---|
| 5 | `netzgroesse` | Netzgröße | Wie viele Adressen hat ein Netz? | 3 | zahlen:zweierpotenzen |
| 6 | `blockgroesse` | Blockgröße | In welchen Schritten liegen die Netze? | 4, 5 | – |
| 7 | `netzadresse` | Netzadresse | Mit welcher Adresse beginnt mein Netz? | 6 | – |
| 8 | `broadcast` | Broadcastadresse | Wo endet mein Netz? | 7 | – |
| 9 | `hostbereich` | Hostbereich | Welche Adressen bekommen Geräte? | 5, 8 | – |
| 10 | `gleiches-netz` | Gleiches Netz? | Können zwei Geräte direkt miteinander reden? | 7 | – |
| 11 | `oktett3` | Entscheidendes Oktett | Was, wenn der Netzanteil im 3. Oktett endet? | 9, 10 | – |
| 12 | `rechenweg` | Rechenweg | In welcher Reihenfolge rechne ich? | 11 | – |


**Einen PC ins Netz bringen** (Lektion 13–17)
Jetzt wird das Gerechnete angewendet. Zuerst die Tür nach draußen (Standardgateway), dann welche Adressen
man intern überhaupt nimmt (privat; braucht die Blockgröße im 2. Oktett für 172.16.0.0/12), dann die vollständige
Konfiguration, dann wer sie automatisch verteilt (DHCP) – und zum Schluss die Prüfungsaufgabe „freie statische
Adresse in einer Netzskizze“, die alles verbindet.

| Nr | id | Begriff | Leitfrage | braucht | Grundlage |
|---|---|---|---|---|---|
| 13 | `standardgateway` | Standardgateway | Wohin schickt ein PC Pakete für fremde Netze? | 9, 10 | – |
| 14 | `privat` | Private Adressen | Welche Adressen darf jeder intern nutzen? | 11, 13 | – |
| 15 | `konfiguration` | IPv4-Konfiguration | Was trägt man an einem PC ein? | 13 | – |
| 16 | `dhcp` | DHCP | Wer verteilt die Einstellungen automatisch? | 8, 15 | – |
| 17 | `statisch` | Statische Adresse | Welche feste Adresse ist frei und erlaubt? | 9, 16 | – |


**Im lokalen Netz: MAC und ARP** (Lektion 18–19)
Bisher ging es um die logische Adresse. Im lokalen Netz wird aber an die Hardware-Adresse zugestellt: erst die
MAC-Adresse (Hexadezimalzahlen setzt sie voraus – Verweis in den Zahlen-Trainer), dann ARP, das beide verbindet.

| Nr | id | Begriff | Leitfrage | braucht | Grundlage |
|---|---|---|---|---|---|
| 18 | `mac` | MAC-Adresse | Welche Adresse hat die Netzwerkkarte ab Werk? | 2 | zahlen:hex |
| 19 | `arp` | ARP | Wie findet ein PC zur IP-Adresse die MAC-Adresse? | 8, 13, 18 | – |


**IPv6** (Lektion 20–23)
IPv6 löst dieselbe Aufgabe mit längeren Adressen. Erst Grund und Aufbau, dann die Kurzschreibweise (die größte
Stolperstelle), dann wie bei IPv4 Netz- und Geräteteil, zum Schluss die Adresse, die jedes Gerät von selbst hat.

| Nr | id | Begriff | Leitfrage | braucht | Grundlage |
|---|---|---|---|---|---|
| 20 | `ipv6` | IPv6-Adresse | Warum IPv6, und wie sieht die Adresse aus? | 1 | zahlen:hex |
| 21 | `ipv6-kurz` | Kurzschreibweise | Wie kürzt man eine IPv6-Adresse – und zurück? | 20 | – |
| 22 | `ipv6-praefix` | Präfix und Interface-Identifier | Welcher Teil ist Netz, welcher Gerät? | 3, 18, 21 | – |
| 23 | `link-local` | Verbindungslokale Adresse | Welche Adresse hat jedes Gerät von selbst? | 16, 22 | – |

### 6.3 Eine Lektion

Alle Lektionen haben denselben Aufbau (`trainer/lernweg/Lektion.jsx`, gilt auch für den Zahlen-Trainer):

1. **Kopf:** Block, Nummer, Begriff, Leitfrage; darunter „Baut auf“ mit den `braucht`-Lektionen (anklickbar, mit
   Status) und gestrichelt den Grundlagen aus anderen Trainern (z. B. „Zahlen: Binärzahl“, Haken, wenn dort verstanden). Fehlt davon etwas, steht ein Hinweis mit Link darunter. Vor/zurück blättern und „Lernweg“ oben.
2. **① Verstehen:** die Erklärung als **Schritte** (Baustein `Schritte`): 4–7 Schritte, jeder mit Titel, Text und Bild
   (Bitband, Zahlenstrahl mit Lupe, Netzskizze, Konsole …); „Weiter“ deckt den nächsten Schritt auf, „alle zeigen“ alles.
   Mitten in den Schritten **Zwischenfragen** (Baustein `Raten`): erst selbst überlegen, falsche Antworten bekommen
   einen gezielten Hinweis (z. B. „64 + 64 = 128 ist schon der nächste Block“), danach geht die Erklärung weiter.
   Am Ende der Kasten **„So sagst du es in der Prüfung“** mit der Definition.
3. **② Ausprobieren:** ein Werkzeug zum Selbst-Ändern (Bit-Schalter, Präfix-Regler, Zahlenstrahl, Eingabemaske,
   DHCP-Simulation, ARP-Cache …).
4. **③ Aufpassen:** typische Fehler (falsch → richtig) und ein Merksatz.
5. **④ Check:** 2–3 Fragen (Auswahl oder Eingabe), Tipp nach falscher Antwort, Erklärung nach der richtigen; bei
   Eingaben nach zwei Fehlversuchen „Lösung zeigen“. Erst wenn alle richtig beantwortet sind, gilt die Lektion als
   verstanden und „Weiter zu …“ erscheint. Bei verstandenen Lektionen sind alle Schritte gleich offen.

Fortschritt: `useEinstellung('subnetz.lernweg', [])` (Liste der verstandenen Lektionen), zurücksetzbar im Lernweg
(mit Sicherheitsabfrage). Der frühere Schlüssel `subnetz.verstanden` wird nicht mehr gelesen.

### 6.4 Lernweg-Ansicht

Je Block ein **Kapitel**: links „Block N“, Titel, ein Satz und ein schmaler Fortschrittsbalken („3 von 5“), rechts
die Lektionen als ruhige Liste (Begriff, Leitfrage). Vor jeder Lektion ein runder Statuspunkt: Nummer (noch nicht
dran), Akzent-Ring mit Marke „Als Nächstes“ und hinterlegter Zeile, gefüllter Punkt mit ✓ (verstanden). Eine dünne
Linie verbindet die Punkte und färbt sich, soweit verstanden ist. Unter der Liste ein aufklappbarer **Merkzettel**
mit allen Definitionen des Blocks (eigene Idee: Wiederholen vor der Prüfung). Am Handy steht der Kopf über der
Liste. Auf Wunsch ersetzt diese Liste die frühere „Schlange“ aus Kacheln mit Pfeilen (zu unruhig). Auch „noch nicht
dran“ lässt sich öffnen (zum Hineinschauen); der Kopf der Lektion zeigt dann, was vorher fehlt.

### 6.5 Kompetenz → Lektion

| Kompetenz | Inhalt (kurz) | Lektion |
|---|---|---|
| AP1-6-2-1-K1 | IP, Subnetzmaske, Gateway eintragen | 15 Konfiguration (Gateway: 13) |
| AP1-6-2-1-K2 | freie statische Adresse außerhalb des DHCP-Bereichs | 17 Statische Adresse |
| AP1-6-2-1-K3 | /24 → 255.255.255.0 | 3 Präfix, 4 Subnetzmaske |
| AP1-6-2-1-K4 | statisch oder automatisch, wann fest | 16 DHCP, 17 Statische Adresse |
| AP1-6-2-1-K5 | private Bereiche | 14 Private Adressen |
| AP1-6-2-1-K6 | Einstellungen dokumentieren | 15 Konfiguration |
| AP1-6-2-2-K1 | Adressen und nutzbare Hosts aus dem Präfix | 5 Netzgröße, 9 Hostbereich, 12 Rechenweg |
| AP1-6-2-2-K2 | Netzadresse und Broadcastadresse | 6 Blockgröße, 7 Netzadresse, 8 Broadcast, 11 Entscheidendes Oktett, 12 Rechenweg |
| AP1-6-2-2-K3 | erste, letzte, vorletzte Hostadresse | 9 Hostbereich, 12 Rechenweg |
| AP1-6-2-2-K4 | Netzskizze lesen, Adresse eintragen | 17 Statische Adresse (mit 13) |
| AP1-6-2-2-K5 | Präfix ↔ Subnetzmaske | 4 Subnetzmaske |
| AP1-6-2-2-K6 | zwei Adressen im selben Subnetz? | 10 Gleiches Netz? |
| AP1-6-2-3-K1 | 128 Bit, 8 Blöcke à 4 Hex-Ziffern | 20 IPv6-Adresse |
| AP1-6-2-3-K2 | kürzen und ausschreiben | 21 Kurzschreibweise |
| AP1-6-2-3-K3 | Präfix und Interface-Identifier | 22 Präfix und Interface-Identifier |
| AP1-6-2-3-K4 | fe80 = verbindungslokal | 23 Verbindungslokale Adresse |
| AP1-6-2-3-K5 | Grund: IPv4-Adressraum erschöpft | 20 IPv6-Adresse |
| AP1-6-2-4-K1 | MAC: 48 Bit, 6 Bytes hex, Herstellerkennung | 18 MAC-Adresse |
| AP1-6-2-4-K2 | Aufgabe von ARP | 19 ARP |
| AP1-6-2-4-K3 | Ausgabe von `arp` deuten | 19 ARP |
| AP1-6-2-4-K4 | was DHCP zuteilt | 16 DHCP |
| AP1-6-2-4-K5 | 169.254.x.x deuten | 16 DHCP |

Nicht im Tracker, aber zum Verstehen nötig: Netzanteil/Hostanteil (2), Netzgröße (5), Blockgröße (6),
Entscheidendes Oktett (11); Binärzahl, Zweierpotenzen und Hexadezimalzahl stehen im Zahlen-Trainer. Ein Test prüft,
dass jede Kompetenz von AP1-6-2-1 bis AP1-6-2-4 mindestens einer Lektion zugeordnet ist und `braucht` nur auf frühere
Lektionen zeigt; ein zweiter, dass jede Grundlage im anderen Trainer existiert.

### 6.6 Üben

Die bestehenden Übungen bleiben und sind nach den Blöcken sortiert; Lücken sind gefüllt. Unter jeder Übung steht
„Dazu im Lernweg“ mit den passenden Lektionen (Feld `uebung` der Lektion), jede Lektion verlinkt umgekehrt ihre Übung.

| Block | Übungen (modus-ID) |
|---|---|
| Die IPv4-Adresse | Präfix und Subnetzmaske (`maske`); „Oktett binär“ entfiel, Zahlensysteme übt der Zahlen-Trainer |
| Subnetting | Adressen, Hosts, Blockgröße (`hosts`, aus „Präfix und Maske“ herausgelöst + Blockgröße), Netz bestimmen (`analyse`), Gleiches Netz? (`gleich`), Netz aufteilen (`aufteilen`, Zusatz) |
| Einen PC ins Netz bringen | Private Adressen (`privat`), Konfiguration prüfen (`konfig`: freie statische Adresse, Eingabemaske, Fehler finden), DHCP und 169.254.x.x (`dhcp`: was DHCP zuteilt, Größe eines DHCP-Bereichs, 169.254) |
| MAC und ARP | MAC-Adresse und ARP (`mac`: Herstellerkennung, `arp -a`) |
| IPv6 | IPv6 kürzen & ausschreiben (`ipv6`) |

### 6.7 Dateistruktur

```
src/bereiche/trainer/lernweg/          Rahmen für Trainer mit Räumen (Subnetz, Zahlen) – siehe 7.3
src/bereiche/trainer/subnetz/
  Subnetz.jsx              Räume Verstehen / Üben / Visualisieren, Spickzettel (nutzt lernweg/RaumTrainer)
  ip.js                    Rechnung IPv4/IPv6 + Helfer (Stellenwerte, Maskenwert, Eingaben lesen, MAC, IPv6-Art)
  Visualizer.jsx           unverändert
  verstehen/
    lernweg.js             Blöcke + Lektionen: braucht, grundlagen, Kompetenzen, Definition, Merksatz, Stolperfallen
    checks.js              Check-Fragen je Lektion + eigene Eingabe-Typen (ipv4, ipv6kurz, ipv6voll, iid)
    rechnen.js             Rechenhilfen der Erklärungen: Blockanfang/-ende raten, Oktett-Rollen, Rechenweg, statische Adresse prüfen
    bausteine.jsx          Bitband, Maskenrechnung, Zahlenstrahl mit Lupe, Grenzlupe, Gerät, Adressen … (+ allgemeine aus lernweg/)
    inhalt/                Erklärung + Ausprobieren je Block (adresse, subnetting, konfiguration, lokal, ipv6)
  ueben/
    aufgaben.js            Aufgabenerzeuger (getestet)
src/styles/subnetz.css     Stile des Trainers (Präfix sn-)
src/styles/subnetz-visual.css   Visualizer (unverändert)
tests/subnetz.test.mjs     Rechnung, Aufgaben, Lernweg-Struktur, Checks, Rechenhilfen
```
Entfernt: das alte `subnetz/Verstehen.jsx`, das alte `subnetz/lernweg.js`, `subnetz-lernen.css`, die Raum-Logik
(`bereich`) in `TrainerSeite`; im Oktober 2026 außerdem die Lektionen „Binärzahl“ und „Hexadezimalzahl“, die Übung
„Oktett binär“ und `subnetz/ueben/Ueben.jsx`, `verstehen/Lernweg.jsx`, `Lektion.jsx`, `Check.jsx`, `Verstehen.jsx`,
`fortschritt.js` (jetzt allgemein in `trainer/lernweg/`).

### 6.8 Steinbruch: was aus dem alten Code herausgelöst wurde

| Baustein | alt | neu |
|---|---|---|
| IPv4- und IPv6-Rechnung (getestet) | `ip.js` | bleibt `ip.js` (der Visualizer importiert daraus) |
| Helfer: Stellenwerte, Netzbits je Oktett, Maskenwert, Dezimal → binär in Schritten, Eingaben lesen | `lernweg.js` | `ip.js` |
| Blockanfang/-ende raten mit typischen Fehlern | `lernweg.js` | `verstehen/rechnen.js` (Zwischenfragen in Netzadresse, Broadcast, Entscheidendes Oktett) |
| „Für dich / für den Computer“ mit Faktenboxen | `Verstehen.jsx` → `Aufbau` | Lektion 1 (Bausteine `ZweiSichten`, `Fakten`) |
| 32-Bit-Band mit Netz/Host-Farben und Grenze | `Bitband` | Baustein `Bitband` |
| Bit-Tafel mit Stellenwerten, „Passt es noch?“ Schritt für Schritt | `Bits` | Bausteine `BitTafel` und `Umrechner`, jetzt im Zahlen-Trainer (`zahlen/verstehen/bausteine.jsx`) |
| Präfix → Subnetzmaske für alle vier Oktette, die neun Maskenwerte | `Maske` | Bausteine `MaskenRechnung`, `MaskenWerte` (Lektion „Subnetzmaske“) |
| Zahlenstrahl 0–255 in Blöcken mit Lupe und Trichter | `Strahl` | Baustein `Zahlenstrahl` (Block Subnetting, private Adressen), auch mit zwei Markierungen. Bis 4 Blöcke stehen die Bereiche im Block und darunter „Block mit der …“, ohne Lupe. Ab 8 Blöcken vergrößert die Lupe den Block mit der Zahl und seine Nachbarn („rund N-mal so groß“); ein Fenster auf der Leiste und ein gestrichelter Trichter zeigen den Ausschnitt. Dichte Schilder zeigen voneinander weg, Schilder am Rand ragen nicht hinaus |
| Lupe auf die Blockgrenze, Blockgröße = Stellenwert des letzten Netzbits | `Grenze`, `Bloecke` | Baustein `Grenzlupe`, Schritt in der Lektion „Blockgröße“ |
| Aufgabenerzeuger | `aufgaben.js` | `ueben/aufgaben.js`; „Präfix und Maske“ geteilt, vier Übungen neu |
| Farbschema: Netz = Akzent (grün), Host = `--info` (blau), Grenze = `--warn` (orange), reserviert = `--fehler` (rot) | `subnetz-lernen.css` | `subnetz.css` (Präfix `sn-`), Legende bei jedem Bit-Bild |
| Visualizer | `Visualizer.jsx`, `subnetz-visual.css` | unverändert im Raum „Visualisieren“ |

Nicht übernommen: Lektionsliste, Teile-Leiste, Kurz-Check-Logik, Übersicht, Gateway-/Aufteilen-Bilder und die
gemeinsame Beispiel-Adresse oben – jede Lektion hat jetzt ihr eigenes, festes Beispiel und ihr eigenes Werkzeug.

### 6.9 Eigene Ideen (umgesetzt)

- **Merkzettel** je Block: alle Prüfungsdefinitionen des Blocks auf einen Blick – zum Wiederholen vor der Prüfung.
- **„Baut auf“** im Kopf jeder Lektion mit Status und Lücken-Hinweis; **„Dazu im Lernweg“** unter jeder Übung.
- **Zwischenfragen mit gezielten Hinweisen** zu den typischen Fehlern (Blockende, 2·h statt 2^h, 172.32 …).
- **Simulationen:** DHCP mit Schaltern (Kabel, Server, freie Adressen → 169.254), ARP-Cache zum Mitverfolgen mit
  `arp -a`, Netzskizze wie in der Prüfung mit Adressplan (reserviert, vergeben, DHCP-Bereich, frei).
- **„Jetzt du“** in der Lektion Rechenweg: das komplette Schema an einer zufälligen Adresse, mit Lösungsweg.

### 6.10 Offen / Ideen für später

- Der Fortschritt im Lernweg ist eine Ansichts-Einstellung, kein Lernstand-Ereignis: Er ist nicht in der Sicherung
  enthalten. Wer das möchte, kann ihn als Ereignis (`lektion`) ins Protokoll aufnehmen.
- IPv6-Subnetting und Netz aufteilen (VLSM) sind für AP1 nicht belegt und deshalb nicht im Lernweg (Aufteilen bleibt als
  Zusatz-Übung).

## 7. Zahlen-Trainer mit Lernweg und gemeinsamer Lernweg-Rahmen

*Stand: umgesetzt (Oktober 2026), getestet (`tests/lernweg.test.mjs`), alle Lektionen im Browser auf Desktop und Handy geprüft.*

Anlass: Binär- und Hexadezimalzahlen sind kein Netzwerkthema und wurden im Subnetz-Lernweg zu ausführlich erklärt.
Sie stehen jetzt im Zahlen-Trainer, der dafür dieselben Räume wie der Subnetz-Trainer bekommen hat.

### 7.1 Räume

| Raum | Inhalt |
|---|---|
| **Verstehen** | Lernweg: 4 Blöcke, 13 Lektionen (AP1: 12 – das Paritätsbit gibt es nur in AP2) |
| **Üben** | die bisherigen 7 Übungen, nach denselben Blöcken sortiert (Aufgabenarten weiter wählbar) |

Der Trainer gehört zu AP1 und AP2. In AP2 zeigt der Lernweg alle Lektionen (AP2 setzt AP1 voraus); Übungen, die es in
AP2 nicht gibt, werden in der Lektion nicht verlinkt.

### 7.2 Gliederung

**Zahlensysteme** (Lektion 1–5)

| Nr | id | Begriff | Leitfrage | braucht | Grundlage |
|---|---|---|---|---|---|
| 1 | `stellenwert` | Stellenwertsystem | Warum ist die 3 in 300 mehr wert als in 30? | – | – |
| 2 | `binaer` | Binärzahl | Wie liest man eine Zahl aus Nullen und Einsen? | 1 | – |
| 3 | `dezimal-binaer` | Dezimal in binär umrechnen | Wie wird aus 200 eine Binärzahl? | 2 | – |
| 4 | `zweierpotenzen` | Zweierpotenzen | Wie viele Werte passen in n Bit? | 2 | – |
| 5 | `hex` | Hexadezimalzahl | Wie schreibt man 4 Bit mit einem Zeichen? | 3, 4 | – |

**Datenmengen** (Lektion 6–9)

| Nr | id | Begriff | Leitfrage | braucht | Grundlage |
|---|---|---|---|---|---|
| 6 | `bit-byte` | Bit und Byte | Wie viel ist ein Byte? | 4 | – |
| 7 | `praefixe` | Dezimal- und Binärpräfixe | Sind 1 kB 1.000 oder 1.024 Byte? | 4, 6 | – |
| 8 | `speicherbedarf` | Speicherbedarf | Wie viel Speicher braucht ein Bild? | 4, 7 | – |
| 9 | `uebertragung` | Übertragungsdauer | Wie lange dauert ein Download? | 6, 7 | – |

**Bits in der Praxis** (Lektion 10–11)

| Nr | id | Begriff | Leitfrage | braucht | Grundlage |
|---|---|---|---|---|---|
| 10 | `dateirechte` | Dateirechte mit chmod | Was bedeutet chmod 754? | 2 | – |
| 11 | `paritaet` | Paritätsbit | Wie merkt der Empfänger, dass ein Bit gekippt ist? | 2 | – (nur AP2) |

**Leistung und Stromkosten** (Lektion 12–13)

| Nr | id | Begriff | Leitfrage | braucht | Grundlage |
|---|---|---|---|---|---|
| 12 | `leistung` | Elektrische Leistung | Wie groß muss das Netzteil sein? | – | – |
| 13 | `energie` | Energie und Stromkosten | Was kostet ein Server im Jahr? | 12 | – |

Jede Lektion: Erklärung in 5–7 Schritten mit Zwischenfragen, „So sagst du es in der Prüfung“, ein eigenes Werkzeug
(Basis-Rechner für jede Basis, Bit-Schalter mit Zielzahl, Restwert- und Stellenwertverfahren zum Mitklicken,
Bit-Regler 1–32, Dreifach-Umrechner dezimal/binär/hex, Präfix-Umrechner mit Rechenweg, Bild-Rechner, Download-Rechner
mit Vergleich verschiedener Leitungen, chmod-Baukasten, Paritäts-Strecke mit Störung, Netzteil-Planer,
Stromkosten-Rechner), Stolperfallen, Merksatz und 3 Check-Fragen.

Kompetenzen: alle von AP1-4-2-1, AP1-4-2-2, AP1-4-2-3, AP2-5-5-3 und AP2-6-6-3 sowie AP1-5-2-3-K3/K5 (chmod); die
übrigen Kommandozeilen-Kompetenzen von AP1-5-2-3 (dir, ls, cp, alias …) gehören nicht in einen Zahlen-Trainer. Ein Test
prüft die Abdeckung.

### 7.3 Gemeinsamer Rahmen `trainer/lernweg/`

```
lernweg.js        baueLernweg({ trainer, schluessel, bloecke, lektionen }, raum) → Lektionen nummeriert, je Raum gefiltert,
                  Status, als Nächstes, Lücken (rein, getestet)
kurse.js          alle Lernwege nach Trainer – für Verweise zwischen Trainern (Feld grundlagen: 'zahlen:binaer')
fortschritt.js    verstandene Lektionen je Trainer (Ansichts-Einstellung '<trainer>.lernweg'), zurücksetzbar
pruefen.js        Check-Antworten prüfen; Typen zahl, dezimal (Komma, Toleranz), text, binaer, hex; Trainer können
                  eigene Typen mitgeben (Subnetz: ipv4, ipv6kurz, ipv6voll, iid)
RaumTrainer.jsx   Kopf, Raum-Umschalter, „Gehört zu“; merkt sich die letzte Übung je Trainer
Verstehen.jsx     Lernweg oder Lektion
Lernweg.jsx       Kapitel-Liste mit Statuspunkten, Merkzettel je Block
Lektion.jsx       Rahmen einer Lektion (Kopf mit „Baut auf“ und Grundlagen, ① bis ④, Fuß mit „Weiter“ und Übung)
Check.jsx         Kurz-Check
Ueben.jsx         Übungen nach Blöcken, „Dazu im Lernweg“
bausteine.jsx     Schritte, Raten, Absatz, Fakten, Formel, Hinweis, Werkbank, Beispiele, Ergebnis, Konsole,
                  Grundlage (Verweis-Hinweis) und GrundlageChip
src/styles/lernweg.css   Stile des Rahmens (Präfix lw-)
```

Zahlen-Trainer: `zahlen/Zahlen.jsx` (Räume, Spickzettel), `zahlen/verstehen/` (`lernweg.js`, `checks.js`,
`bausteine.jsx` mit Stellen, BitTafel, Umrechner, Restwert, HexTafel, Nibbles, Treppe, Rechenweg; `inhalt/` je Block),
Stile in `src/styles/zahlen.css` (Präfix zl-). Die Aufgabenerzeuger in `zahlen/aufgaben.js` sind unverändert.

Ein neuer Trainer mit Lernweg braucht: Lernweg-Beschreibung, Checks, Inhalte, einen Modus `verstehen` mit
`bereich: 'verstehen'` und Übungen mit `bereich: 'ueben'` und `thema` (= Block-ID) in `verzeichnis.js`, Eintrag in
`lernweg/kurse.js`.

### 7.4 Offen

- Der Fortschritt beider Lernwege ist eine Ansichts-Einstellung und nicht in der Sicherung enthalten (wie 6.10).
- Andere Rechen-Trainer (Kaufmännisch, Netzplan) könnten denselben Rahmen bekommen, wenn sie einen Lernweg brauchen.
