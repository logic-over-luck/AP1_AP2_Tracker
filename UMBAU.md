# UMBAU – Neuaufbau des Lernplans

Diese Datei ist der Bauplan für den Neuaufbau der Lerninhalte. **Jede KI-Sitzung, die am Umbau
arbeitet, liest zuerst diese Datei** und hält sich an die Entscheidungen und Regeln darin.

- Was hier nicht geregelt ist, wird **nicht** in der Sitzung entschieden, sondern kommt auf den
  **Parkplatz** (Abschnitt 8). Entschieden wird es vom Projektinhaber.
- Gearbeitet wird auf dem Branch `umbau`. Der bisherige Stand bleibt unverändert und benutzbar.
- Die App (Trainer, Lernkarten-System, Lernstand, Oberfläche, Glossar) bleibt. Neu gebaut werden die
  **Lerninhalte**: Gliederung, Rahmen, Können-Aussagen, Grenzen.

Status-Kennzeichen in dieser Datei: **[fest]** = entschieden · **[Vorschlag]** = Entwurf, vom Projektinhaber
zu bestätigen · **[unbestätigt]** = aus dem Gedächtnis, muss an der Quelle nachgeprüft werden.
Seitenangaben „PDF-S.“ = Original-PDF-Seite, wie sie in der Katalog-Fassung markiert ist.

---

## 1. Warum der Umbau

Befund am bisherigen Stand (`Inhaltsdatei_AP1_AP2_tracker.json`, Oktober 2026):

1. **Keine Definition von „fertig".** Es gab keine prüfbaren Kriterien, wann ein Stichpunkt richtig ist.
   Inhalte wirkten vollständig, weil sie sauber formuliert waren – nicht weil etwas geprüft wurde.
2. **Unsichtbare Regeln.** Wie tief ein Thema geht, wurde je Sitzung neu entschieden. In den Rahmentexten
   stehen 72 Sätze wie „war nicht verlangt" oder „reicht". Ein Teil davon begründet die Grenze mit
   dem Katalog (gut), ein Teil nur damit, dass es in wenigen Prüfungen nicht vorkam (falsch).
   Beispiel: „IPv6-Subnetting war nicht verlangt" – der Katalog nennt IPv4 und IPv6 gleichrangig.
   Ausgewertet waren nur 8 Originalprüfungen, davon 2 AP1-Prüfungen nach aktuellem Katalog.
3. **Kein offizielles Gerüst.** Die Gebiete aus dem Raster (Ausbildungsordnung) fehlen, damit fehlt
   ein Maßstab für die Gewichtung. Der größte AP2-Ordner ist „Netzwerk und Betrieb" (17 Stichpunkte).
   Netzwerk steht zwar im AP2-Katalog (AP2b.01 „Betreiben von IT-Systemen", gemeinsam für alle
   Fachinformatiker-Fachrichtungen), aber keines der acht PB1/PB2-Gebiete ist ein Netzwerk-Gebiet, und
   die ausgewerteten AE-Prüfungen hatten dazu kaum Aufgaben. Offen ist also Tiefe und Gewicht, nicht
   ob es dazugehört (P10).
4. **Keine Trennung der Räume.** 44 von 83 AP2-Stichpunkten haben ein Gegenstück in AP1 und eigene
   Karten (AP1 1.027 Karten, AP2 992 Karten bei gleicher Gewichtung von je 20 %).

---

## 2. Entscheidungen

**E1 – Fünf Räume** [fest]
Die Räume entsprechen den Prüfungsbereichen der Ausbildungsordnung (Raster im Katalog):

| Raum | Prüfung | Zeit | Gewicht | Art |
|---|---|---|---|---|
| AP1 | Einrichten eines IT-gestützten Arbeitsplatzes | 90 min, 4 Aufgaben, 100 P. | 20 % | Lernplan, Karten, Trainer |
| PB1 | Planen eines Softwareproduktes | 90 min, 4 Aufgaben, 100 P. | 10 % | Lernplan, Karten, Trainer |
| PB2 | Entwicklung und Umsetzung von Algorithmen | 90 min, 4 Aufgaben, 100 P. | 10 % | Lernplan, Karten, Trainer |
| WISO | Wirtschafts- und Sozialkunde | 60 min, ca. 30 maschinell auswertbare Aufgaben | 10 % | Lernplan, Karten |
| PROJEKT | Betriebliche Projektarbeit, Präsentation, Fachgespräch | – | 50 % | Fahrplan, Checklisten, Fragen zum eigenen Projekt |

AP1 ist für alle IT-Berufe gleich (Katalog, PDF-S. 9: „AP1 – berufsübergreifend gemeinsame Inhalte").

**E2 – Ein Inhalt wohnt in genau einem Raum** [fest]
Wohnort ist der erste Raum in der Bau-Reihenfolge (E3), dessen Prüfung den Inhalt braucht. Spätere
Räume schreiben ihn nicht neu, sondern **importieren** ihn (`baut_auf: <ID>`) und ergänzen nur, was dort
**neu oder tiefer** ist. Lernkarten gibt es nur am Wohnort.
Grundlage: § 10 Abs. 2 FIAusbV – Inhalte aus Teil 1 sollen in Teil 2 „nur insoweit einbezogen werden, als
es für die Feststellung der beruflichen Handlungsfähigkeit erforderlich ist".

**E3 – Bau-Reihenfolge der Räume** [fest]
AP1 → PB1 → PB2 → WISO → PROJEKT. Ein Raum wird erst gebaut, wenn der vorige fertig ist (alle Tests
grün). Danach wird er eingefroren und als kompakter **Export** (eine Zeile je Stichpunkt: ID, Titel,
Können-Aussagen in Kurzform) bereitgestellt. Eine KI-Sitzung sieht immer nur **einen** Raum vollständig,
von früheren Räumen nur den Export.

**E4 – Schichten, Abhängigkeit nur nach oben** [fest]
Siehe Abschnitt 3. Jede Schicht wird nur aus den Schichten darunter erzeugt. Ist etwas falsch, wird es
**an der Ursache** korrigiert (Quelle oder Regel) und ab dort neu gebaut – nie direkt im Ergebnis.

**E5 – Rollen der Quellen** [fest]

| Quelle | Rolle |
|---|---|
| **Prüfungskatalog** | Legt fest, **was** dazugehört (Breite), und über die Operatoren, **wie tief**. Der Katalog sagt das selbst (PDF-S. 8): „Die Überschriften weisen durch die Wahl der Operatoren auf die beabsichtigte inhaltliche Tiefe der prüfungsrelevanten Themen und Inhalte hin." |
| **Raster (Gebiete)** | Gerüst je Prüfungsbereich: Jeder Stichpunkt hängt an mindestens einem Gebiet seines Raums. |
| **Altprüfungen** | Stichprobe, kein Fundament. Rollen: (1) Mindesttiefe belegen, (2) IHK-Stil zeigen (Operatoren, Antwortformate, Situationen), (3) Prioritäten (Häufigkeit, Punkte), (4) Gruppierung (was zusammen abgefragt wird), (5) katalogfremde Themen aufdecken, (6) zeigen, was als Material vorgegeben wird und nicht auswendig gelernt werden muss, (7) zeigen, wie bewertet wird. **Nicht:** zeigen, was fehlt; Obergrenzen setzen. |
| **Rahmenlehrplan, Ausbildungsrahmenplan** | Offizielle Ordnungsmittel, auf die der Katalog verweist (Lernfelder). Der Katalog „schränkt die zugrundeliegenden Ordnungsmittel nicht ein" (PDF-S. 4). Noch nicht eingebunden → Parkplatz P5. |
| **Forum, Gedächtnisprotokolle** | Nur Hinweis auf ein Thema, nie Beleg für Tiefe. |
| **IT-Berufe-Podcast** (it-berufe-podcast.de, Stefan Macke) | Hinweis. (a) Themen-Schlagworte je Prüfungstermin (AP1 Herbst 2021 bis Frühjahr 2026) – zum Gegenprüfen der eigenen Zuordnung; (b) Änderungsliste alter → neuer AP1-Katalog (Folge #190) – Grundlage für B3, gegen den neuen Katalog mechanisch nachgeprüft. Nie Beleg für Tiefe. |
| **Community-Lernzettel** (fachinformatiker.de: Obsidian-Lernzettel 03/2025 nach aktuellem Katalog, 125 S.; Word-Lernzettel 02/2024 nach altem Katalog, 56 S.) | Material und Lückenhinweis. Nutzen: (1) Abgleich „Thema im Lernzettel, aber keinem Baustein zugeordnet?“ → prüfen, nicht automatisch übernehmen; (2) Anregung für Erklärungen. Nie Beleg, nie Tiefe, Fakten nicht ungeprüft übernehmen, keinen Text übernehmen (fremdes Werk) – Inhalte in eigenen Worten. |
| **BIBB-Umsetzungshilfe** (Fachinformatiker/-in, BIBB 2020, frei als PDF, CC BY-NC-ND) | Hintergrund zur Ausbildungsordnung und Beispiele für Lernsituationen. Für Tiefe in der schriftlichen Prüfung nachrangig; nicht eingebunden. |

**E6 – Prüfungen heben die Tiefe nur an** [fest]
Was in einer Prüfung verlangt wurde, wird mindestens so tief gelernt. Was **nicht** vorkam, ist
**keine** Grenze. Sätze wie „X war nicht verlangt" dürfen keine Können-Aussage streichen.

**E7 – Grenzen nur aus dem Katalog** [fest]
Eine Grenze („gehört nicht dazu") braucht eine Katalogstelle als Begründung, z. B. den Operator, den Namen
des Prüfungsbereichs, „nicht Bestandteil der schriftlichen Prüfung" oder einen Zusatz wie „kann
Bestandteil der praktischen Prüfung sein". Regeln dazu: Abschnitt 4, G1–G5.

**E8 – Gliederung nach dem Lernen, verankert im Katalog** [fest]
Gliederung: **Oberblock → Themenblock → Stichpunkt → Rahmen** (Können-Aussagen und Grenze). Die
Gliederung folgt dem, was sich gut zusammen lernen lässt, nicht der Paragrafen-Reihenfolge. Jeder
Stichpunkt trägt aber Pflichtfelder: Gebiet(e) und Katalog-Baustein-IDs.

**E9 – Altes Material wird einsortiert, nicht weggeworfen** [fest]
Vorgehen wie beim Strangler Pattern: Das Neue wächst neben dem Alten. Jede alte Können-Aussage, Karte
und jeder Beleg wird einer von drei Gruppen zugeordnet: **übernommen** (passt zu Quelle und Regeln),
**angepasst**, **gestrichen** (mit Begründung). Daraus entsteht je Ordner eine Liste „alt → neu".
Der Lernstand hängt an Stichpunkt- und Karten-IDs → Umzugstabelle nötig (Parkplatz P6).

**E10 – Quellen bleiben lokal** [fest]
Katalog und Prüfungsabschriften sind urheberrechtlich geschützt, das Repo ist öffentlich. Deshalb:
`quellen/` steht in `.gitignore`; die daraus erzeugte Bausteindatei ebenfalls. Braucht eine Sitzung Katalog
oder Prüfungsabschriften, hängt der Projektinhaber sie an; die Sitzung legt sie unter `quellen/` ab und
erzeugt das Fundament neu (`npm run umbau:katalog`).

---

## 3. Schichten

| Schicht | Inhalt | Entsteht durch | Datei | Stand |
|---|---|---|---|---|
| 0 Quellen | Katalog (Markdown aus der Word-Fassung), Prüfungsabschriften (.md) | Projektinhaber | `quellen/` (nur lokal) | Katalog ✓, Prüfungen in Arbeit |
| 1 Fundament | Prüfungsbereiche, Gebiete, Lernfelder, Fragenkomplexe, Katalogpunkte, Spiegelstriche, betriebliche Handlungen, Anhänge – mit festen IDs | Skript, mechanisch, kein Ermessen | `umbau/fundament/katalog-bausteine.json` | ✓ erzeugt und geprüft |
| 2 Regeln | Regelwerk (Abschnitt 4) | einmal mit dem Projektinhaber festgelegt, mit Version | diese Datei, später zusätzlich als Datendatei | Entwurf v0.1 |
| 3 Gerüst | Oberblöcke → Themenblöcke → Stichpunkte, je mit Gebiet und Baustein-IDs; Zuordnung Teilaufgabe → Baustein | KI nach Regeln, Skript prüft Abdeckung | noch offen | – |
| 4 Rahmen | Können-Aussagen mit Herkunft, Grenze, Tiefe | KI nach Regeln, Skript + KI-Prüfer | noch offen | – |
| 5 Ausgabe | Lernkarten, Kurzfassungen, Lernprompts, Probeprüfungen | aus Schicht 4 erzeugt | `inhalte/` wie bisher | – |

Kann eine Schicht kippen? Schicht 1 nicht (kein Ermessen, Wortlaut geprüft). Schicht 2 nur durch eine
bewusste Regeländerung. Schicht 3 nicht, solange die Abdeckungstests grün sind. Schicht 4 darf sich
verbessern, ohne dass darunter etwas wackelt. Schicht 5 wird jederzeit neu erzeugt.

---

## 4. Regelwerk – v1.0 [fest]

Freigegeben am 13.10.2026 (der Projektinhaber hat die Entscheidung übertragen). Maßgeblich für die
Tiefe ist `umbau/regeln/regelwerk.json`; die Tabelle unten muss damit übereinstimmen (prüft
`tools/umbau/tiefe-berechnen.mjs`). Änderungen nur bewusst, mit neuer Versionsnummer.

### 4.1 Tiefe aus dem Operator

Fast jeder Katalogpunkt hat einen oder mehrere Operatoren im Titel (`operatoren` im Fundament). Mehrere
Operatoren → es gilt die **höchste** Stufe. Ein Spiegelstrich mit eigenem Operator („… definieren
können") hat dessen Stufe – auch wenn sie niedriger ist; so begrenzt der Katalog z. B. das ISMS auf
„kennen und unterstützen" (AP1.06.03.4, Stufe 2). Sonst gilt die Stufe des Katalogpunkts.
Groß-/Kleinschreibung zählt: „beim Testen" ist kein Operator, „testen" schon; ein substantiviertes Verb
am Anfang („Planen mit geeigneten Modellen") zählt.

| Stufe | Bedeutung | Operatoren |
|---|---|---|
| 1 Wiedergeben | nennen, erkennen, ohne Erklärung | nennen, benennen, kennen, erkennen, wahrnehmen, entnehmen |
| 2 Verstehen | erklären, unterscheiden, zuordnen, mitwirken | beschreiben, erläutern, unterscheiden, vergleichen, charakterisieren, zuordnen, einordnen, identifizieren, interpretieren, definieren, nachweisen, unterstützen, begleiten |
| 3 Anwenden | selbst durchführen, an einem Fall | anwenden, abbilden, ableiten, abstimmen, aufbereiten, automatisieren, beheben, beraten, bestimmen, darstellen, dokumentieren, durchführen, einrichten, einsetzen, entwickeln, erfassen, erstellen, erweitern, festlegen, formulieren, gestalten, implementieren, konfigurieren, konzeptionieren, messen, modellieren, nutzen, planen, präsentieren, testen, umsetzen, verhindern, verwenden, vorbereiten, vornehmen, zusammenführen, überwachen |
| 4 Beurteilen | entscheiden und begründen | beurteilen, bewerten, begründen, auswählen, analysieren, auswerten, einschätzen, prüfen, überprüfen |

**Katalogpunkte ohne Operator** (41): festgelegt in `regelwerk.json` → `ohne_operator`, je mit Begründung.
WiSo (37 Punkte) Stufe 2, weil die Prüfung aus ca. 30 maschinell auswertbaren Aufgaben besteht;
AP1.06.03 Stufe 3 („Modellierung"); AP2b.02.01 Stufe 2; AP2b.03.08 Stufe 3 (Gebiet PB2 „Testszenarien …");
AP2a.01.01 keine (nicht Bestandteil der schriftlichen Prüfung).

Ergebnis für die 679 abdeckungspflichtigen Bausteine (`umbau/fundament/tiefe.json`): Stufe 1: 36,
Stufe 2: 298, Stufe 3: 189, Stufe 4: 156.

Beispiel IPv6: AP1.04.01 nennt „IP(v4/v6)-Konfiguration" unter „konzeptionieren, konfigurieren,
testen und dokumentieren" → Stufe 3 für IPv4 **und** IPv6.

### 4.2 Belege aus Prüfungen

- **B1** Mindesttiefe = höchste Stufe aus Katalog und Belegen.
- **B2** Ein Beleg zählt nur aus einer **Originalprüfung** (eigene Abschrift mit Teilaufgaben-ID, z. B.
  `2024H-A1-db`). Forum, Podcast und Lernzettel sind kein Beleg. Aufgabenstellung und Operator zählen immer;
  die Musterlösung nur, wenn sie amtlich ist (`lösungshinweise_amtlich: ja`). Nicht amtliche Lösungen
  (2026H) zeigen nur, was gefragt war, nicht, was als Antwort reicht.
- **B3** Prüfungen nach altem Katalog (vor AP1 Frühjahr 2025 / AP2 Sommer 2025) zählen voll, **außer**
  für Themen, die der neue Katalog gestrichen oder verschoben hat. Laut Vorbemerkung (PDF-S. 4): SQL und
  RAID nur noch in AP2; Struktogramm und PAP gestrichen. Laut IT-Berufe-Podcast #190 außerdem aus AP1
  entfernt; mechanisch nachgeprüft, dass keines davon im neuen AP1-Katalog steht: SAN, RAID, LTE, 5G,
  Vererbung, Struktogramm, PAP, SQL, nicht-relationale Datenbanken, ISO-27000-Normen, SWOT-Analyse,
  Suchoperatoren. Belege zu diesen Themen zählen für AP1 nicht (SAN, RAID, Vererbung, SQL, NoSQL stehen im
  AP2-Katalog und zählen dort).
- **B4** Material, das in der Aufgabe vorgegeben war (z. B. „die fünf SMART-Begriffe standen dabei"),
  wird als „anwenden, nicht auswendig" vermerkt.

### 4.3 Puffer (abgeleitete Inhalte)

Jede abgeleitete Können-Aussage nennt die Regel, aus der sie kommt.

- **P-GESCHWISTER** Was im Katalog gleichrangig nebeneinander steht („IPv4/IPv6", „TCP/UDP"), bekommt
  dasselbe Verfahren, mindestens in der Grundform.
- **P-NÄCHSTE-STUFE** Die nächste Stufe eines Verfahrens, das schon belegt ist (z. B. ein Netz
  aufteilen, wenn Netzadresse und Broadcast belegt sind), wenn der Zusatzaufwand klein ist (Richtwert:
  unter einer Stunde, wenn die Grundlage sitzt).
- **P-GRUNDLAGE** Was gebraucht wird, um einen Baustein überhaupt bearbeiten zu können
  (z. B. Binär- und Hexadezimalzahlen für Subnetting und IPv6).

### 4.4 Grenzen

- **G1** Jede Grenze nennt eine Katalogstelle (E7). Fehlende Prüfungsbelege sind keine Begründung.
- **G2** Perspektive des Prüfungsbereichs: AP1 = „Einrichten eines IT-gestützten Arbeitsplatzes"
  (Sicht des Arbeitsplatzes, nicht der Server-Infrastruktur), PB1/PB2 = die vier Gebiete aus dem Raster.
- **G3** Was über die Stufe aus 4.1/4.2 hinausgeht, gehört nicht dazu – außer über eine Puffer-Regel.
- **G4** Prüfungsformat: Eine Teilaufgabe bringt meist 2–8 Punkte und wird ohne Hilfsmittel gelöst.
  Was so nicht abfragbar ist (Herleitungen, Herstellerdetails, Normnummern), gehört nicht dazu.
- **G6** Bei **Zusatzbausteinen** (nicht im Katalog) reicht der Umfang so weit wie die Belege plus Puffer
  (P-NÄCHSTE-STUFE, P-GESCHWISTER). Weil der Katalog sie nicht nennt, ist das hier die Katalog-Begründung.
- **G5** „nicht Bestandteil der schriftlichen Prüfung" (AP2a.01.01) und „kann Bestandteil der
  praktischen Prüfung sein" (AP2b.05.04, AP2b.05.05) werden ausgewiesen, nicht stillschweigend weggelassen.

### 4.5 Form

- **F1** Können-Aussage: „Du kannst …", genau ein Operator, prüfbar (man kann eine Frage dazu stellen).
- **F2** Jede Können-Aussage hat eine Herkunft: `katalog:<Baustein-ID>` · `beleg:<Teilaufgaben-ID>` ·
  `regel:<P-…>`.
- **F3** Stichpunkt: 3–7 Können-Aussagen, eine Lerneinheit von etwa 30–90 Minuten.
- **F4** Themenblock: 3–6 Stichpunkte mit gemeinsamer Grundlage.
- **F5** Gruppierung: Was in Prüfungen in derselben Aufgabe zusammen abgefragt wird, gehört in denselben
  Stichpunkt oder Themenblock. Grundlagen stehen vor ihrer Anwendung.

### 4.6 Räume

- **W1** Wohnort und Import wie E2.
- **W2** Katalogpunkte aus AP2 (Teile `AP2a` und `AP2b` im Fundament) trennt der Katalog nicht nach PB1 und
  PB2. Zuordnung über die Gebiete im Raster; Inhalte, die beide brauchen, wohnen in PB1 (früher gebaut).
  Offene Fälle → Parkplatz P3.

### 4.7 Zusatzbausteine und Zuordnung (seit v1.1)

- **Z1** Was in einer Originalprüfung verlangt wurde, aber nicht wörtlich im Katalog steht, wird ein
  Zusatzbaustein (`umbau/regeln/zusatzbausteine.json`, ID `ZB.…`) mit nächstem Katalogbezug, Begründung
  und erstem Beleg. Zusatzbausteine sind abdeckungspflichtig wie Katalog-Bausteine. Sie erweitern nur.
- **Z2** Jede Teilaufgabe bekommt einen festen **Aufgabentyp** (aufzaehlen, erklaeren, begruenden,
  berechnen, zuordnen, diagramm, code_lesen, code_schreiben, konfigurieren, vorgehen, text) – Grundlage
  für Karten und Probeprüfungen im IHK-Stil.
- **Z3** Stufe einer Teilaufgabe = höchste Stufe ihrer Prüfungsoperatoren (`pruefungsoperatoren` im
  Regelwerk). Sie gilt für alle Bausteine, denen die Teilaufgabe zugeordnet ist.
- **Z4** Teilaufgaben zu gestrichenen Themen: Ist nur die **Darstellungsform** gestrichen (Struktogramm)
  oder nur ein **Teil** (Vererbung in einer Klassenaufgabe), bleibt die Teilaufgabe den verbliebenen
  Bausteinen zugeordnet, mit `hinweis`. Ist das **ganze Thema** gestrichen (RAID, SAN, SQL), steht sie unter
  `ausserhalb` mit B3-Begründung.

---

## 5. Definition von „fertig" (Tests)

Ein Raum ist fertig, wenn alle Tests grün sind und der Projektinhaber die Stichproben abgenommen hat.

**Skript (Struktur, kein Ermessen)**

| Nr | Prüft | Stand |
|---|---|---|
| T-1 | Prüfungsabschriften: IDs passen zu Datei und Prüfung, keine doppelten IDs, Punkte der Teilaufgaben ergeben die Aufgabe, Aufgaben ergeben 100; Hinweise bei fehlendem Operator oder fehlender Musterlösung | ✓ `tools/umbau/pruefungen-pruefen.mjs` (+ Test) |
| T0 | Fundament: jeder Katalog-Listenpunkt, Katalogpunkt, Fragenkomplex und jedes Gebiet ist ein Baustein; kein Baustein erfunden; Wortlaut unverändert; IDs eindeutig; Verweise gültig; Nummerierung lückenlos | ✓ `tools/umbau/fundament-pruefen.mjs` |
| T0b | Der Prüfer selbst erkennt eingebaute Fehler (fehlender, erfundener, veränderter Baustein, doppelte ID, kaputter Verweis, fehlendes Gebiet) | ✓ `tests/umbau-fundament.test.mjs` |
| T0c | Regelwerk lückenlos: jeder Operator hat eine Stufe, jeder abdeckungspflichtige Baustein hat eine Stufe, Tabelle in 4.1 = `regelwerk.json` | ✓ `tools/umbau/tiefe-berechnen.mjs` |
| T1 | Jeder abdeckungspflichtige Baustein des Raums steckt in mindestens einem Stichpunkt | geplant |
| T2 | Jede Teilaufgabe der Prüfungen dieses Raums ist zugeordnet: Bausteine oder „ausserhalb“ mit Katalog-Begründung (B3, RAUM, G5); gültige Baustein-IDs; fester Aufgabentyp; jeder Prüfungsoperator hat eine Stufe. Prüft zugleich die **goldene Regel**: belegte Tiefe nie unter Katalogtiefe, kein Katalog-Baustein verliert seine Abdeckungspflicht | ✓ `tools/umbau/zuordnung-pruefen.mjs` (+ Tests) |
| T2b | Jede Teilaufgabe, die einen Baustein des Ordners betrifft, steckt in einem Stichpunkt (Teilaufgaben nur mit geteilten Bausteinen: auf Raum-Ebene) | ✓ je Ordner `tools/umbau/lernplan-pruefen.mjs` |
| T8 | Tiefe erreicht: je Baustein erreicht mindestens eine Können-Aussage die belegte Tiefe | ✓ je Ordner (geteilte Bausteine: Hinweis, Rest auf Raum-Ebene) |
| ALT | Jede alte Können-Aussage ist einsortiert (übernommen, angepasst, verschoben, gestrichen); übernommene und angepasste behalten ihre ID; freigewordene IDs werden nie neu vergeben | ✓ je Ordner |
| T3 | Jede Können-Aussage hat eine gültige Herkunft (F2) | ✓ je Ordner |
| T4 | Jede Grenze nennt eine Katalogstelle (G1) | ✓ je Ordner (lehnt Begründungen wie „kam nicht vor“ ab) |
| T5 | Größen stimmen (F3, F4) | ✓ je Ordner |
| T6 | Jeder Stichpunkt hat ein Gebiet seines Raums | ✓ je Ordner |
| T7 | Inhalte früherer Räume sind importiert, nicht doppelt (E2) | geplant |

**KI-Prüfer (Inhalt; eigene Sitzung, sieht nur einen Stichpunkt mit seinen Quellen)**

- K1 **Kerntest:** Kann jemand, der genau diese Können-Aussagen beherrscht, jede zugeordnete Teilaufgabe
  mit voller Punktzahl lösen? Wenn nein: Welche Aussage fehlt?
- K2 Passt jede Können-Aussage zu ihrer Herkunft und zur Stufe aus 4.1?
- K3 Steht etwas drin, das weder aus Katalog noch Beleg noch Regel kommt?

**Mensch**

- M1 Rote Stellen ansehen und entscheiden.
- M2 Stichproben je Ordner.
- M3 Parkplatz abarbeiten.

---

## 6. Quellen-Inventar

Aktueller Katalog gilt ab AP1 Frühjahr 2025 und AP2 Sommer 2025 (Katalog, PDF-S. 5). Ältere Prüfungen →
Regel B3. Spalte „.md" = Abschrift im Format wie `2024H_AP1.md` (Teilaufgaben-IDs, YAML je Teilaufgabe).

| Prüfung | Raum | Katalog | .md | Lösungshinweise | Teilaufgaben | Bemerkung |
|---|---|---|---|---|---|---|
| 2021H (29.09.2021) | AP1 | alt | ✓ | ✓ | 23 | vollständig |
| 2022F (30.03.2022) | AP1 | alt | ✓ | ✓ | 30 | vollständig; 2 Teilaufgaben ohne Operator (A1-cb, A4-c) |
| 2022H (21.09.2022) | AP1 | alt | ✓ | ✓ | 27 | vollständig |
| 2023F (01.03.2023) | AP1 | alt | ✓ | ✓ | 24 | vollständig |
| 2023H (19.09.2023) | AP1 | alt | ✓ | ✓ | 31 | Lösungshinweise zu A4-cb bis A4-cd fehlen |
| 2024F (28.02.2024) | AP1 | alt | ✓ | ✓ | 30 | vollständig |
| 2024H (17.09.2024) | AP1 | alt | ✓ | ✓ | 26 | vollständig |
| 2025F (25.03.2025) | AP1 | aktuell | ✓ | ✓ | 30 | vollständig |
| 2025H (17.09.2025) | AP1 | aktuell | ✓ | – | 26 | A4 ab b) fehlt (18 von 24 Punkten) |
| 2026F (25.02.2026) | AP1 | aktuell | ✓ | – | 27 | vollständig |
| 2026H (30.09.2026) | AP1 | aktuell | ✓ | nicht amtlich | 27 | vollständig |

Summe AP1: 11 Prüfungen, 301 Teilaufgaben (kleinste bewertete Einheiten), davon 4 Prüfungen nach aktuellem
Katalog. Alle Abschriften bestehen T-1. PB1, PB2, WiSo: noch keine Abschriften.

Zuordnung Teilaufgabe → Baustein und Aufgabentyp kommt **nicht** in die Abschriften, sondern in eine
eigene Datei je Prüfung (`umbau/zuordnung/ap1/<Prüfung>.json`). So bleiben die Abschriften reine Quellen.

### 6.1 Ergebnis der Zuordnung AP1 (Regelwerk v1.1)

- 301 Teilaufgaben zugeordnet, davon 13 außerhalb nach B3 (RAID 4, SAN 1, SQL 8).
- 183 abdeckungspflichtige Bausteine (179 Katalog + 4 Zusatz). **125 mit Prüfungsbeleg**, davon 46 nur aus
  Prüfungen nach altem Katalog. **58 ohne Beleg** – sie bleiben vollständig mit ihrer Katalogtiefe
  drin (goldene Regel); auffällig: Qualitätsmanagement (AP1.05) kam in keiner der 11 Prüfungen vor.
- **23 Bausteine durch Belege angehoben**, z. B. Verschlüsselungstechniken 1 → 4, Härtung 2 → 4,
  Kontrollstrukturen 2 → 4, Schreibtischtest 3 → 4.
- Zusatzbausteine: `ZB.ipv4-subnetting` (2022F, 2025F, 2025H, 2026F), `ZB.ipv6-subnetting` (2022H: Teilnetz-
  Anzahl bestimmen, Adressen aus Präfix vergeben), `ZB.datendarstellung` (2024F, 2026F), `ZB.rechnung` (2025H).
- **IPv6:** AP1.04.01.3 Stufe 4 mit 14 Belegen; IPv6-Präfixe aufteilen ist belegt (2022H) und damit Teil
  von AP1. Der alte Satz „IPv6-Subnetting war nicht verlangt“ war falsch.

---

## 7. Bau-Reihenfolge

- [x] **Schritt 0 – Fundament Katalog:** Zerleger, Prüfer, Prüfer-Test (Abschnitt 9)
- [x] **Schritt 1 – Regelwerk v1.0:** freigegeben, als Datendatei `umbau/regeln/regelwerk.json`, Tiefe je
      Baustein berechnet (`umbau/fundament/tiefe.json`), P1, P2, P4 erledigt
- [x] **Schritt 1b – Quellen AP1 geprüft:** 11 Abschriften bestehen T-1; Rollen von Podcast, Lernzettel,
      BIBB und Rahmenlehrplan festgelegt (E5)
- [x] **Schritt 2 – Prüfungen zugeordnet (AP1):** alle 301 Teilaufgaben der 11 AP1-Prüfungen in
      `umbau/zuordnung/ap1/<Prüfung>.json`; 57 Prüfungsoperatoren im Regelwerk v1.1 eingestuft;
      4 Zusatzbausteine (Abschnitt 4.7); Ergebnis in `umbau/fundament/belege-ap1.json` (siehe 6.1);
      T2 grün; Gegenprüfung mit den Podcast-Schlagworten (P11) hat 3 Zuordnungen korrigiert
- [x] **Schritt 3 – Probelauf AP1 / Netzwerk (Schicht 3+4):** `umbau/lernplan/ap1/AP1-6.json`, Bericht
      `umbau/berichte/AP1-6.md`. 3 Themenblöcke, 12 Stichpunkte (2 neu: AP1-6-2-5 IPv6 im Netz, AP1-6-3-3 VPN),
      69 Können-Aussagen. Alt → neu: 52 alte Aussagen, davon 37 übernommen, 12 angepasst, 3 verschoben,
      0 gestrichen; 17 neu. Karten: 92 bleiben, 30 prüfen, 5 umhängen, 0 entfallen. Abnahmekriterium erfüllt:
      IPv6 mit Stufe 3 (AP1-6-2-3, AP1-6-2-5), begründet mit AP1.04.01.3 und Belegen aus 2022H. Alle
      Ordner-Prüfungen grün. Kerntest K1 als Selbstprüfung: 2 Lücken gefunden und geschlossen.
- [ ] **Schritt 3b – Abnahme durch den Projektinhaber:** Bericht lesen, Stichproben, entscheiden.
      Danach Schicht 5 für den Ordner (Karten prüfen/umhängen/neu, Lernprompts) und unabhängiger KI-Prüfer (K1–K3).
- [ ] **Schritt 4 – Rest von AP1**, Ordner für Ordner nach dem Muster des Probelaufs
- [ ] **Schritt 5 – AP1 einfrieren, Export erzeugen**
- [ ] **Schritt 6 – PB1**, dann **PB2**, dann **WISO** (jeweils mit Export der früheren Räume)
- [ ] **Schritt 7 – App:** Raum-Umschalter auf fünf Räume, Importe anzeigen, Lernstand-Umzug (P6)
- [ ] **Schritt 8 – PROJEKT**

---

## 8. Parkplatz

Offene Fragen und Ideen. Neue Punkte unten anhängen, nie still entscheiden.

| Nr | Frage | Stand |
|---|---|---|
| P1 | Repo ist öffentlich, Quellen urheberrechtlich geschützt. **Entschieden:** Quellen bleiben lokal und werden der Sitzung bei Bedarf angehängt (E10). | erledigt |
| P2 | Nachgeprüft: § 10 Abs. 2 FIAusbV, Wortlaut „nur insoweit einbezogen werden, als es für die Feststellung der beruflichen Handlungsfähigkeit erforderlich ist". Bei E2 eingetragen. | erledigt |
| P3 | Zuordnung der AP2-Katalogpunkte zu PB1/PB2 (W2): Liste erstellen und vom Projektinhaber bestätigen lassen. | offen |
| P4 | 41 Katalogpunkte ohne Operator: im Regelwerk v1.0 festgelegt (Abschnitt 4.1, `ohne_operator`). | erledigt |
| P5 | Rahmenlehrplan (KMK, 13.12.2019): LF1–LF5 im 1., LF6 im 2. Ausbildungsjahr; laut Rahmenlehrplan sind „aufgrund ihrer Prüfungsrelevanz“ LF1–6 vor Teil 1 zu unterrichten. Die Lernfelder sind als Kompetenzen formuliert (z. B. LF3: Netzwerkinfrastruktur analysieren, Clients konfigurieren und einbinden); Adressierungsdetails (IPv4/IPv6) wurden in der NRW-Fassung nicht gefunden [unbestätigt, Wortlaut nicht vollständig gelesen]. Für die Tiefe weniger genau als der Katalog → nicht eingebunden. Wieder aufnehmen, wenn das Original-PDF vorliegt. | zurückgestellt |
| P6 | Lernstand-Umzug: Tabelle alte ID → neue ID für Stichpunkte und Karten; bisherige Sicherungen müssen lesbar bleiben. | offen |
| P7 | Zeitbudget je Raum aus der Gewichtung; Lernzeit je Stichpunkt schätzen; Puffer zuerst kürzen, wenn das Budget überschritten wird. | offen |
| P8 | PROJEKT: Vorgaben der IHK für Rheinhessen (Antrag, Umfang, Dokumentation, Präsentation, Fachgespräch) beschaffen. Die IT-Prüfungsseite der IHK Rheinhessen nennt sie nicht; dort steht ein Ansprechpartner für die IT-Prüfungen. | offen |
| P9 | Katalog-Zusätze „kann Bestandteil der praktischen Prüfung sein" (Versionsverwaltung AP2b.05.04, Präsentieren AP2b.05.05): gehört das in den Raum PROJEKT? | offen |
| P10 | Kapitel AP2b.01–03 sind laut Katalog gemeinsame Inhalte aller Fachinformatiker-Fachrichtungen (Quellenauffälligkeit, PDF-S. 21). Tiefe für Anwendungsentwickler? | offen |
| P11 | Gegenprüfung mit den Themen-Schlagworten des IT-Berufe-Podcasts (AP1 Herbst 2021 bis Frühjahr 2026) durchgeführt: 2 Struktogramm-Aufgaben (2022F-A4-d, 2022H-A4-b) und 1 fehlender Baustein (2024F-A4-a Zugangs-/Zugriffskontrolle) korrigiert. Für 2025H nennt der Podcast zusätzlich Pseudocode, Schreibtischtest, Code erklären, ERM – das liegt im fehlenden Teil der Abschrift (P14). | erledigt |
| P12 | Lücken-Abgleich mit den Community-Lernzetteln (nach Schritt 3/4): Themen im Lernzettel ohne Baustein → einzeln entscheiden (katalogfremd, alter Katalog oder echte Lücke). | offen |
| P13 | Z3 überträgt die Stufe einer Teilaufgabe auf alle ihre Bausteine. Bei Teilaufgaben mit mehreren Bausteinen kann ein Nebenbaustein dadurch zu hoch eingestuft werden (Richtung „eher mehr lernen“, also mit der goldenen Regel vereinbar). Im Probelauf vom KI-Prüfer (K2) je Stichpunkt prüfen lassen. | offen |
| P14 | **Bewusst ignoriert (Entscheidung Projektinhaber):** 2025H ist unvollständig (A4 ab b fehlt, 18 Punkte; laut Podcast u. a. Pseudocode, Schreibtischtest, ERM). Rest der Prüfung beschaffen und abschreiben. 2025H und 2026F haben keine Lösungshinweise, 2026H nur nicht amtliche. | erledigt |
| P15 | **ID-Erhalt** löst P6 zum großen Teil: Übernommene und angepasste Stichpunkte und Können-Aussagen behalten ihre alte ID (Lernstand und Karten bleiben gültig). Nur verschobene Aussagen brauchen eine Umzugstabelle (`alt_neu` im Lernplan). | Vorschlag |
| P16 | Kerntest K1 wurde im Probelauf von der bauenden Sitzung selbst gemacht. Für die Abnahme: eine **unabhängige** Sitzung prüft je Stichpunkt mit Musterlösungen (K1–K3). Ohne Musterlösung waren 9 Teilaufgaben (2025H, 2026F). | offen |

---

## 9. Fundament erzeugen und prüfen

Lokale Quellen (nicht im Repo, werden der Sitzung angehängt):

```
quellen/katalog.md                  aus der Word-Fassung (pandoc, siehe unten)
quellen/pruefungen/ap1/<ID>_AP1.md  Prüfungsabschriften, z. B. 2024H_AP1.md
quellen/lernzettel/*.pdf            Community-Lernzettel (nur Material)
```

Einmalig die Katalogquelle anlegen (Word-Fassung → Markdown):

```
pandoc Pruefungskatalog_FIAE_korrigiert_v2_1.docx -t gfm --wrap=none -o quellen/katalog.md
```

Dann:

```
npm run umbau:katalog     # zerlegt quellen/katalog.md → umbau/fundament/katalog-bausteine.json
npm run umbau:pruefen     # prüft die Bausteine unabhängig gegen den Katalog
npm run umbau:tiefe       # berechnet die Mindesttiefe je Baustein und prüft das Regelwerk
npm run umbau:pruefungen  # prüft die Prüfungsabschriften, erzeugt das Teilaufgaben-Verzeichnis
npm run umbau:zuordnung   # T2 + goldene Regel, berechnet die belegte Tiefe (belege-ap1.json)
node tools/umbau/lernplan-pruefen.mjs AP1-6   # prüft einen Ordner des neuen Lernplans, schreibt umbau/berichte/AP1-6.md
node --test tests/umbau-fundament.test.mjs   # prüft, ob der Prüfer Fehler erkennt
```

Stand der letzten Erzeugung: 21 Fragenkomplexe, 142 Katalogpunkte, 663 Spiegelstriche, 84 betriebliche
Handlungen, 18 Gebiete, 12 Lernfelder, 12 Anhänge. Abdeckungspflichtig: 679 Bausteine
(AP1 179, AP2 fachrichtungsübergreifend 80, AP2 Anwendungsentwicklung 183, WiSo 237).

ID-Schema:

| Was | Beispiel |
|---|---|
| Teil | `AP1`, `AP2a` (AP2 fachrichtungsübergreifend), `AP2b` (AP2 Fachrichtung AE), `WISO` |
| Fragenkomplex | `AP1.04` |
| Katalogpunkt | `AP1.04.05` |
| Spiegelstrich | `AP1.04.05.5`, eingerückt `AP1.01.01.2.4` |
| Betriebliche Handlung | `AP1.04.H2` |
| Gebiet | `G.AP1.03`, `G.PB1.02`, `G.PB2.04`, `G.WISO.01` |
| Anhang | `ANH.sql-syntax-auszug` |

Die IDs ändern sich nur, wenn sich der Katalog ändert. Die Bausteindatei wird nie von Hand bearbeitet.
