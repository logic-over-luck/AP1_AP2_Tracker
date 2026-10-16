# UMBAU – Neuaufbau des Lernplans

Diese Datei ist der Bauplan für den Neuaufbau der Lerninhalte. **Jede KI-Sitzung, die am Umbau
arbeitet, liest zuerst diese Datei** und hält sich an die Entscheidungen und Regeln darin.

- Was hier nicht geregelt ist, wird **nicht** in der Sitzung entschieden, sondern kommt auf den
  **Parkplatz** (Abschnitt 8). Entschieden wird es vom Projektinhaber.
- Gearbeitet wird auf dem Branch `umbau` (seit 16.10.2026 enthält er auch den früheren Branch `vorschau-ap1`, der gelöscht ist). Der bisherige Stand bleibt unverändert und benutzbar.
- Die App (Trainer, Lernkarten-System, Lernstand, Oberfläche, Glossar) bleibt. Neu gebaut werden die
  **Lerninhalte**: Gliederung, Rahmen, Können-Aussagen, Grenzen.

**Arbeitsweise jeder neuen Sitzung** (Entscheidung Projektinhaber, 13.10.2026):
- Modell: Opus auf hoher Denkstufe. Ein AP1-Ordner pro Sitzung.
- Zuerst diese Datei komplett lesen, Quellen nach Abschnitt 9 unter `quellen/` ablegen, alle Prüfskripte laufen lassen.
- Nach jedem Zwischenschritt committen und pushen, damit bei erschöpftem Nutzungslimit nichts verloren geht.
- **Nutzungsarm arbeiten:** Fehler der Prüfskripte selbst beheben, nicht nachfragen. Dem Projektinhaber am Ende
  nur **eine Zeile** melden: „AP1-x fertig, alle Prüfungen bestanden“ – oder was offen bleibt. Keine langen
  Zusammenfassungen; Details stehen im Bericht `umbau/berichte/<Ordner>.md`.
- Hinweis-Abgleich (R3) und Geschwister-Prüfung (R4) macht die Sitzung selbst; der Projektinhaber liefert kein Material.

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
   ob es dazugehört (P10, entschieden: Katalogtiefe, Gewicht über die Wichtigkeit).
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
| **Rahmenlehrplan, Ausbildungsrahmenplan** | Offizielle Ordnungsmittel, auf die der Katalog verweist (Lernfelder). Der Katalog „schränkt die zugrundeliegenden Ordnungsmittel nicht ein" (PDF-S. 4). Rahmenlehrplan (KMK 13.12.2019) abgeglichen: beschreibt Handlungen, nicht Tiefe; jedes Lernfeld-Thema hat einen Wohnort (P5). |
| **Forum, Gedächtnisprotokolle** | Nur Hinweis auf ein Thema, nie Beleg für Tiefe. |
| **IT-Berufe-Podcast** (it-berufe-podcast.de, Stefan Macke) | Hinweisquelle (Ring Kür, Abgleich nach R3). (a) Themen-Schlagworte je Prüfungstermin (AP1 Herbst 2021 bis Frühjahr 2026) – zum Gegenprüfen der eigenen Zuordnung; (b) Änderungsliste alter → neuer AP1-Katalog (Folge #190) – Grundlage für B3, gegen den neuen Katalog mechanisch nachgeprüft. Nie Beleg für Tiefe. |
| **Community-Lernzettel** (Hinweisquelle; fachinformatiker.de: Obsidian-Lernzettel 03/2025 nach aktuellem Katalog, 125 S.; Word-Lernzettel 02/2024 nach altem Katalog, 56 S.) | Material und Lückenhinweis. Nutzen: (1) Abgleich „Thema im Lernzettel, aber keinem Baustein zugeordnet?“ → prüfen, nicht automatisch übernehmen; (2) Anregung für Erklärungen. Nie Beleg, nie Tiefe, Fakten nicht ungeprüft übernehmen, keinen Text übernehmen (fremdes Werk) – Inhalte in eigenen Worten. |
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

## 4. Regelwerk – v1.8 [fest]

Freigegeben am 13.10.2026 (der Projektinhaber hat die Entscheidung übertragen). v1.1: Prüfungsoperatoren, Zusatzbausteine (4.7). v1.2: vier Ringe (4.8). v1.3: Formoperatoren (Z3a, P25). v1.4 (14.10.2026, Entscheidung übertragen): B3 auch für neue Prüfungen, F1 mehrere Operatoren aus einer Teilaufgabe, Ring für betriebliche Handlungen (P26). v1.5 (14.10.2026, Projektinhaber): P-BEISPIELLISTE (P17), P-MUSTER als F6 (P18). v1.6 (14.10.2026, Entscheidung übertragen): Prüfungsoperatoren aus PB1 eingestuft (verdeutlichen 2, Stellung nehmen 4, einfügen 3 als Formoperator, implementieren, finden, vorschlagen, umwandeln, skizzieren, schreiben, bringen je 3). v1.7 (14.10.2026): Operatoren der PB2-Aufgaben (Schritt 6). v1.8 (16.10.2026, Projektinhaber, P46): Z3b – Stufe der WiSo-Aufgaben aus dem Aufgabentyp (4.7); „ordnen“ Stufe 2. Maßgeblich für die
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
  **Seit v1.4** gilt das auch für Prüfungen nach neuem Katalog: Teilaufgaben oder Lösungsteile zu diesen gestrichenen
  Themen zählen nicht (Stand 14.10.2026 betroffen: nur „LTE/5G-Router“ in der nicht amtlichen Lösung zu 2026H-A4-a).
  Themen, die nie im Katalog standen, aber in einer Prüfung verlangt wurden, sind **nicht** gestrichen; sie bleiben
  Zusatzbausteine (Z1).
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
- **P-BEISPIELLISTE** (seit v1.5, P17) Bei einer offenen „z. B.“-Liste im Katalog sind die genannten Beispiele Kern.
  Weitere übliche Mitglieder derselben Gruppe werden Puffer, wenn mindestens **zwei unabhängige Hinweisquellen** sie
  nennen, sonst Kür. Unabhängig heißt: verschiedene Quellenarten (Podcast, Lernzettel, Unterricht); die beiden
  Lernzettel von fachinformatiker.de zählen zusammen als eine. Stufe der Puffer-Aussage: die Stufe der Katalogstelle.
  Lehrbücher sind optional (nur die betroffene Stelle, nie ganze Bücher, nie eigene Themen, nie Tiefe).

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

- **F1** Können-Aussage: „Du kannst …", genau ein Operator, prüfbar (man kann eine Frage dazu stellen). **Seit v1.4:**
  Mehrere Operatoren sind erlaubt, wenn genau diese Operatoren zusammen in **einer** Teilaufgabe der Herkunft stehen
  (z. B. 2023H-A4-ba „erstellen, einzeichnen“); Stufe = höchste. Maßstab ist die Teilaufgabe, nicht die Aufgabe (wie Z3).
  Operatoren aus verschiedenen Teilaufgaben kommen in getrennte Aussagen oder werden unter einem Operator zusammengefasst.
- **F2** Jede Können-Aussage hat eine Herkunft: `katalog:<Baustein-ID>` · `beleg:<Teilaufgaben-ID>` ·
  `regel:<P-…>`.
- **F3** Stichpunkt: 3–7 Können-Aussagen, eine Lerneinheit von etwa 30–90 Minuten.
- **F4** Themenblock: 3–6 Stichpunkte mit gemeinsamer Grundlage.
- **F5** Gruppierung: Was in Prüfungen in derselben Aufgabe zusammen abgefragt wird, gehört in denselben
  Stichpunkt oder Themenblock. Grundlagen stehen vor ihrer Anwendung.
- **F6 P-MUSTER** (seit v1.5, P18) Können-Aussagen zu Katalogthemen ohne Prüfungsbeleg werden nach dem Aufgabentyp
  formuliert, den die IHK beim selben Operator sonst nutzt (z. B. „beurteilen“ = Vor- und Nachteile nennen und begründet
  empfehlen). Das bestimmt nur die Form, nie die Stufe.

### 4.6 Räume

- **W1** Wohnort und Import wie E2.
- **W2** Katalogpunkte aus AP2 (Teile `AP2a` und `AP2b` im Fundament) trennt der Katalog nicht nach PB1 und
  PB2. Zuordnung über die Gebiete im Raster; Inhalte, die beide brauchen, wohnen in PB1 (früher gebaut).
  Festgelegt in `umbau/regeln/raeume-ap2.json` (P3).

### 4.7 Zusatzbausteine und Zuordnung (seit v1.1)

- **Z1** Was in einer Originalprüfung verlangt wurde, aber nicht wörtlich im Katalog steht, wird ein
  Zusatzbaustein (`umbau/regeln/zusatzbausteine.json`, ID `ZB.…`) mit nächstem Katalogbezug, Begründung
  und erstem Beleg. Zusatzbausteine sind abdeckungspflichtig wie Katalog-Bausteine. Sie erweitern nur.
- **Z2** Jede Teilaufgabe bekommt einen festen **Aufgabentyp** (aufzaehlen, erklaeren, begruenden,
  berechnen, zuordnen, diagramm, code_lesen, code_schreiben, konfigurieren, vorgehen, text) – Grundlage
  für Karten und Probeprüfungen im IHK-Stil.
- **Z3** Stufe einer Teilaufgabe = höchste Stufe ihrer Prüfungsoperatoren (`pruefungsoperatoren` im
  Regelwerk). Sie gilt für alle Bausteine, denen die Teilaufgabe zugeordnet ist.
- **Z3a** (seit v1.3, P25) **Formoperatoren** bezeichnen nur die Antwortform („eintragen“, „ausfüllen“,
  „vervollständigen“, „ergänzen“, „markieren“; Liste `pruefungsoperatoren.formoperatoren`). Sie zählen in Z3
  nur, wenn die Teilaufgabe keinen anderen Operator hat. Beispiel: 2026F-A2-b „ausfüllen, angeben“ → Stufe 1.
  Steht nur ein Formoperator da (Netzplan, ERD, Diagramm ergänzen), bleibt seine Stufe.
- **Z3b** (seit v1.8, P46, nur Raum WISO) In WiSo-Aufgaben ist „eintragen“ fast immer nur die Antwortform (Ziffer ins
  Kästchen). Die Stufe kommt deshalb aus dem **Aufgabentyp** der Abschrift: Einfach- und Mehrfachauswahl, Zuordnung und
  Reihenfolge 2, Eintrag 1, Rechnen 3; hat die Zuordnung den Typ `berechnen`, zählt die Teilaufgabe als Rechnen (3).
  Fachliche Operatoren in der Aufgabe gehen vor. Die Katalogstufe bleibt Untergrenze je Baustein (T8). Festgelegt in
  `regelwerk.json` → `pruefungsoperatoren.z3b`, geprüft von `tools/umbau/zuordnung-pruefen.mjs`.
- **Z5** (seit 16.10.2026, P47, nur Raum WISO) **Deckung:** Ein WiSo-Baustein, den ein früherer Raum **vollständig**
  lehrt, wird nicht neu formuliert. Er steht in `umbau/regeln/wiso-deckung.json` mit den deckenden Stichpunkten des
  Exports und einem Grund und gilt als abgedeckt (T1), wenn ein WiSo-Stichpunkt per `baut_auf` auf einen davon verweist;
  T7/T8 behandeln ihn wie einen Import. Teilweise gedeckte Bausteine stehen nicht in der Tabelle; der WiSo-Plan schreibt
  dort nur das Neue mit `neu`.
- **Z4** Teilaufgaben zu gestrichenen Themen: Ist nur die **Darstellungsform** gestrichen (Struktogramm)
  oder nur ein **Teil** (Vererbung in einer Klassenaufgabe), bleibt die Teilaufgabe den verbliebenen
  Bausteinen zugeordnet, mit `hinweis`. Ist das **ganze Thema** gestrichen (RAID, SAN, SQL), steht sie unter
  `ausserhalb` mit B3-Begründung.


### 4.8 Die vier Ringe (seit v1.2)

Jedes Thema, das irgendwo auftaucht (Katalog, Prüfung, Podcast, Lernzettel, Unterricht), bekommt **genau
einen** Ring. So muss keine Sitzung neu überlegen, ob etwas dazugehört.

| Ring | Wann | Im Lernplan |
|---|---|---|
| **Kern** | steht im Katalog (Baustein) oder wurde in einer Originalprüfung verlangt (Beleg, Zusatzbaustein) | Können-Aussage, Pflicht |
| **Puffer** | Regel P-GESCHWISTER, P-NÄCHSTE-STUFE oder P-GRUNDLAGE trifft zu | Können-Aussage, Pflicht, Herkunft `regel:…` |
| **Kür** | nur in einer Hinweisquelle (Podcast, Lernzettel, Unterricht) oder nur als betriebliche Handlung im Katalog (P26), weder Kern noch Puffer, aber auch nicht vom Katalog ausgeschlossen | Feld `kuer` am Stichpunkt: Text, Hinweisquelle(n), Grund; sichtbar, freiwillig, zählt nicht zum Fortschritt, keine Pflichtkarten |
| **Außen** | der Katalog schließt es aus (G1–G6, z. B. weil es im AP2-Katalog steht) | Grenze mit Katalogstelle |

- **R1** Reihenfolge der Prüfung: erst Kern, dann Puffer, dann Außen; was übrig bleibt, ist Kür.
- **R2** Kür entsteht nur aus Hinweisquellen, die in `meta.hinweisquellen` des Ordners beschrieben sind.
- **R3 Hinweis-Abgleich (fester Schritt je Ordner):** Die bauende Sitzung gleicht den Ordner mit den
  Hinweisquellen ab (IT-Berufe-Podcast: Themenlisten und passende Folgen; Community-Lernzettel). Jedes dort
  genannte Thema wird einem Ring zugeordnet. Der Projektinhaber muss dafür kein Material liefern.
- **R4** P-GESCHWISTER wird je Ordner **systematisch** geprüft: Zu jeder Können-Aussage, deren Katalogstelle
  zwei gleichrangige Begriffe nennt (IPv4/IPv6, TCP/UDP …), gibt es das Gegenstück.

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
| T1 | Jeder abdeckungspflichtige Baustein des Raums steckt in mindestens einem Stichpunkt | ✓ Raum-Ebene `tools/umbau/raum-pruefen.mjs` (AP1 grün) |
| T2 | Jede Teilaufgabe der Prüfungen dieses Raums ist zugeordnet: Bausteine oder „ausserhalb“ mit Katalog-Begründung (B3, RAUM, G5); gültige Baustein-IDs; fester Aufgabentyp; jeder Prüfungsoperator hat eine Stufe. Prüft zugleich die **goldene Regel**: belegte Tiefe nie unter Katalogtiefe, kein Katalog-Baustein verliert seine Abdeckungspflicht | ✓ `tools/umbau/zuordnung-pruefen.mjs` (+ Tests) |
| T2b | Jede Teilaufgabe, die einen Baustein des Ordners betrifft, steckt in einem Stichpunkt (Teilaufgaben nur mit geteilten Bausteinen: auf Raum-Ebene) | ✓ je Ordner `tools/umbau/lernplan-pruefen.mjs`, Raum-Ebene `tools/umbau/raum-pruefen.mjs` |
| T8 | Tiefe erreicht: je Baustein erreicht mindestens eine Können-Aussage die belegte Tiefe | ✓ je Ordner (geteilte Bausteine: Hinweis), Raum-Ebene `tools/umbau/raum-pruefen.mjs` |
| ALT | Jede alte Können-Aussage ist einsortiert (übernommen, angepasst, verschoben, gestrichen); übernommene und angepasste behalten ihre ID; freigewordene IDs werden nie neu vergeben | ✓ je Ordner |
| T3 | Jede Können-Aussage hat eine gültige Herkunft (F2) | ✓ je Ordner |
| T4 | Jede Grenze nennt eine Katalogstelle (G1) | ✓ je Ordner (lehnt Begründungen wie „kam nicht vor“ ab) |
| T5 | Größen stimmen (F3, F4) | ✓ je Ordner |
| T6 | Jeder Stichpunkt hat ein Gebiet seines Raums | ✓ je Ordner |
| T7 | Inhalte früherer Räume sind importiert, nicht doppelt (E2): Aussagen nur zu importierten Bausteinen brauchen `neu`, importierte Bausteine in `bausteine` nur mit einer solchen Aussage (P36) | ✓ je Ordner `tools/umbau/lernplan-pruefen.mjs` (seit 16.10.2026) |
| P47 | WiSo-Deckung (Z5): jeder Eintrag in `wiso-deckung.json` ist ein WiSo-Pflichtbaustein mit Grund, seine Stichpunkte stehen im Export eines früheren Raums; gedeckte Bausteine gelten in T1/T7/T8 als Import | ✓ `tools/umbau/raum-pruefen.mjs`, `tools/umbau/lernplan-pruefen.mjs`, Test |
| R3 | Hinweis-Abgleich: jedes Thema aus den Hinweisquellen hat einen Ring (Kern, Puffer, Kür, Außen; „Ordner“ = wohnt in anderem Ordner oder Raum, P23), Hinweisquelle beschrieben, Verweis passt zum Ring | ✓ je Ordner (`meta.hinweisabgleich`) |
| R4 | Geschwister-Prüfung: jede Seite eines Katalog-Paars hat mindestens eine Können-Aussage | ✓ je Ordner (`meta.geschwister`) |
| T9 | Rückblick-Test: Punkte je Prüfung auf Themen, die vorher weder im Katalog noch in einer früheren Prüfung standen; bei jeder neuen Prüfung neu berechnen | einmal von Hand gerechnet (6.1), als Skript geplant |

**KI-Prüfer (Inhalt; eigene Sitzung, sieht nur einen Stichpunkt mit seinen Quellen)**

- K1 **Kerntest:** Kann jemand, der genau diese Können-Aussagen beherrscht, jede zugeordnete Teilaufgabe
  mit voller Punktzahl lösen? Wenn nein: Welche Aussage fehlt?
- K2 Passt jede Können-Aussage zu ihrer Herkunft und zur Stufe aus 4.1?
- K3 Steht etwas drin, das weder aus Katalog noch Beleg noch Regel kommt?

**Mensch**

Neu gefasst am 14.10.2026 (Projektinhaber): Die fachliche Richtigkeit prüfen Skripte und unabhängige KI-Prüfer (K1–K3).
Der Projektinhaber nimmt aus Sicht des Lernenden ab, nicht fachlich.

- M1 **Altprüfungs-Test:** je Ordner eine Altprüfung durchgehen – findet sich zu jeder Teilaufgabe der Stichpunkt, und
  wüsste man nach dem Lernen seiner Aussagen, was zu tun ist? Jede Stelle, an der das nicht klappt, ist ein Fund.
- M2 **Verständlichkeit und Größe:** Stichproben – ist eine Aussage ohne Vorwissen verständlich, wirkt ein Stichpunkt
  wie eine Lerneinheit von etwa einer Stunde?
- M3 **Grundsatzfragen:** Parkplatz-Punkte entscheiden, die den eigenen Lernplan betreffen (keine Fachfragen).

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
Katalog. Alle Abschriften bestehen T-1.

**AP2 (PB1 und PB2)**, Dateien `quellen/pruefungen/pb1/<Termin>_AP2-PB1.md` (Kopf-ID `2025W-PB1`), ebenso pb2.
Termine S = Sommer, W = Winter (2025W = Winter 2025/26). Aktueller AP2-Katalog ab Sommer 2025 → 2025S und 2025W
aktuell, Rest B3. Belegsatz (gemeinsames Heft) steht als Material M1. Eigener Prüfbericht der Abschriften:
`quellen/pruefungen/PRUEFBERICHT_AP2.md` (lokal).

| Termin | PB1 Teilaufg. | PB2 Teilaufg. | Lösungshinweise | Bemerkung |
|---|---|---|---|---|
| 2021W (24.11.2021) | 20 | 10 | amtlich | vollständig |
| 2022S (04.05.2022) | 14 | 14 | amtlich | vollständig |
| 2022W (23.11.2022) | 21 | 15 | amtlich | vollständig |
| 2023S (26.04.2023) | 20 | 11 | amtlich | PB2: S. 8 fehlt (keine Teilaufgabe betroffen) |
| 2023W (29.11.2023) | 17 | 8 | amtlich | vollständig |
| 2024S (24.04.2024) | 16 | 15 | amtlich | vollständig |
| 2024W (27.11.2024) | 16 | 10 | amtlich | Deckblatt, Belegsatz fehlen; PB1 Zeichenseite 4a |
| 2025S (07.05.2025) | 13 | 12 | – | aktueller Katalog |
| 2025W (26.11.2025) | 15 | 12 | amtlich | aktueller Katalog; Belegsatz fehlt; PB1 Zeichenseite 4c; PB2 nur Lösungshinweise, kein Aufgabensatz (keine Operatoren) |

Summe: PB1 9 Prüfungen, 152 Teilaufgaben; PB2 9 Prüfungen, 107 Teilaufgaben; je 2 nach aktuellem Katalog.
Alle 18 Abschriften bestehen T-1 (14.10.2026). PB2 hat Aufgaben ohne Teilaufgaben (z. B. 2021W-PB2-A2,
25 Punkte Pseudocode); dort ist die Aufgabe selbst die Teilaufgabe (ID `2021W-PB2-A2`).

**WiSo**, Dateien `quellen/pruefungen/wiso/<Termin>_WISO.md` (Kopf-ID `2025W-WISO`, Aufgaben `2025W-WISO-A1` … `-A30`,
je Aufgabe Feld `aufgabentyp`). Aktueller Katalog ab Sommer 2025 → 2025S und 2025W aktuell, Rest B3.

| Termin | Aufgaben | Lösungshinweise | Bemerkung |
|---|---|---|---|
| 2021W | 30 | amtlich | vollständig |
| 2022S | 30 | amtlich | vollständig |
| 2022W | 30 | amtlich | vollständig |
| 2023S | 30 | amtlich | vollständig |
| 2023W | 30 | amtlich | vollständig |
| 2024S | 30 | amtlich | vollständig |
| 2025S | 30 | eigene, nicht amtlich | aktueller Katalog |
| 2025W | 30 | amtlich | aktueller Katalog |

Summe WiSo: 8 Prüfungen, 240 Aufgaben (jede Aufgabe ist eine Teilaufgabe). Alle Abschriften bestehen T-1
(`node tools/umbau/pruefungen-pruefen.mjs wiso`, 16.10.2026). Für WiSo nennt der IT-Berufe-Podcast keine Schlagworte
der Termine 2021–2026; Community-Lernzettel zu WiSo gibt es nicht. Kür deshalb aus der unabhängigen Prüfung (P49).

Zuordnung Teilaufgabe → Baustein und Aufgabentyp kommt **nicht** in die Abschriften, sondern in eine
eigene Datei je Prüfung (`umbau/zuordnung/ap1/<Prüfung>.json`). So bleiben die Abschriften reine Quellen.

### 6.1 Ergebnis der Zuordnung AP1 (Regelwerk v1.1)

- 301 Teilaufgaben zugeordnet, davon 13 außerhalb nach B3 (RAID 4, SAN 1, SQL 8).
- 183 abdeckungspflichtige Bausteine (179 Katalog + 4 Zusatz). **125 mit Prüfungsbeleg**, davon 46 nur aus
  Prüfungen nach altem Katalog. **58 ohne Beleg** – sie bleiben vollständig mit ihrer Katalogtiefe
  drin (goldene Regel); auffällig: Qualitätsmanagement (AP1.05) kam in keiner der 11 Prüfungen vor.
- **23 Bausteine durch Belege angehoben** (seit v1.3 und P13: 21; AP1.06.04.1 und AP1.07.01.5 bleiben bei Katalogstufe 2), z. B. Verschlüsselungstechniken 1 → 4, Härtung 2 → 4,
  Kontrollstrukturen 2 → 4, Schreibtischtest 3 → 4.
- Zusatzbausteine: `ZB.ipv4-subnetting` (2022F, 2025F, 2025H, 2026F), `ZB.ipv6-subnetting` (2022H: Teilnetz-
  Anzahl bestimmen, Adressen aus Präfix vergeben), `ZB.datendarstellung` (2024F, 2026F), `ZB.rechnung` (2025H).
- **IPv6:** AP1.04.01.3 Stufe 4 mit 14 Belegen; IPv6-Präfixe aufteilen ist belegt (2022H) und damit Teil
  von AP1. Der alte Satz „IPv6-Subnetting war nicht verlangt“ war falsch.
- **Rückblick-Test (13.10.2026):** Prüfungen in zeitlicher Reihenfolge; gezählt wurden Punkte auf Themen, die
  weder im Katalog standen noch in einer früheren Prüfung vorkamen: 2022F 3, 2022H 2, 2024F 4, 2025H 4 Punkte,
  in den übrigen 7 Prüfungen 0 (je von 100). Die Puffer-Regeln hätten 2022H (P-GESCHWISTER nach 2022F) und
  2024F (P-GRUNDLAGE) vorhergesagt; 2025H ist bis auf den GiroCode durch den Katalog-Anhang „Rechnung“ gedeckt.
  Grenze der Messung: Sie erfasst neue Themen, nicht neue Blickwinkel auf bekannte Themen.
- **Drei Arten von Unbekanntem:** (1) Themen außerhalb des Katalogs – gemessen, klein (oben);
  (2) Katalogthemen ohne Prüfungsbeleg (58 von 183) – Tiefe aus dem Operator, Formulierung nach P-MUSTER (P18);
  (3) offene „z. B.“-Listen (43 Stellen im AP1-Katalog) – P-BEISPIELLISTE (P17).

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
- [x] **Schritt 3a – Vier Ringe (Regelwerk v1.2):** Anlass: IPv6-Video des IT-Berufe-Podcasts. Ergebnis für IPv6:
      alle 7 im Video genannten Prüfungsthemen waren schon Kern; 3 Puffer-Aussagen ergänzt (IPv6-Adressarten,
      Adressvergabe SLAAC/DHCPv6/statisch, NDP und Multicast statt ARP und Broadcast); 7 Kür-Einträge
      (SLAAC-Ablauf, EUI-64, Multicast-Adressen, Privacy Extensions, Gateway aus RA, AAAA/DS-Lite, Anycast).
      Eine falsch begründete Grenze (SLAAC/EUI-64 per G6) entfernt. Hinweis-Abgleich für den Rest des Ordners offen.
- [x] **Schritt 3c – AP1-6 abgeschlossen (13.10.2026):** Hinweis-Abgleich (R3) für den ganzen Ordner: 65 Themen aus
      Podcast-Themenlisten und beiden Lernzetteln (Kern 29, Puffer 5, Kür 12, Außen 16, anderer Ordner 3).
      Kern-Lücken geschlossen: WLAN- und Ethernet-Standards, Netzwerkkarte (Katalogwortlaut AP1.03.03.1) und PoE
      (Beleg 2026F-A1-ac) im neuen Stichpunkt AP1-6-1-5; WLAN-Router als Kombigerät, NAT/PAT (Katalog-Anhang
      Netzwerkplan), VPN am Arbeitsplatz einrichten (AP1.04.05.5). Grenzen ergänzt (TCP/UDP-Eigenschaften, SMB/NFS,
      Proxy, Topologien, Netzausdehnung, DHCP-Ablauf, DNS-Eintragsarten, WLAN-Sicherheitsverfahren, VPN-Verfahren);
      AAAA-Record nach R1 von Kür nach Außen. Geschwister-Prüfung (R4) systematisch: 14 Paare. Prüfskript prüft und
      berichtet R3 und R4. Stand: 13 Stichpunkte, 80 Können-Aussagen, 17 Kür-Einträge.
- [x] **Schritt 3b – Abnahme durch den Projektinhaber:** AP1 nach Gegenprüfung (3d) in der Vorschau abgenommen (14.10.2026).
      Danach Schicht 5 für den Ordner (Karten prüfen/umhängen/neu, Lernprompts) und unabhängiger KI-Prüfer (K1–K3).
- [x] **Schritt 4 – Rest von AP1**, Ordner für Ordner nach dem Muster des Probelaufs (alle 8 Ordner gebaut, Abnahme offen wie 3b)
  - [x] **AP1-1 Projektmanagement und Qualität (13.10.2026):** `umbau/lernplan/ap1/AP1-1.json`, Bericht
        `umbau/berichte/AP1-1.md`. 5 Themenblöcke, 16 Stichpunkte, 93 Können-Aussagen, 10 Kür-Einträge. Alt → neu:
        73 alte Aussagen, davon 39 übernommen, 32 angepasst, 2 gestrichen (AP1-1-1-2-K5: Vorgehensmodelle vergleichen
        steht im AP2-Katalog, AP2b.04.02; AP1-1-5-1-K4: ISO 9001 nach G4, siehe P22); 22 neu. Karten: 74 bleiben,
        83 prüfen, 3 entfallen. 32 Teilaufgaben zugeordnet, Kerntest als Selbstprüfung. R3: 52 Themen
        (Kern 27, Kür 10, Außen 6, anderer Ordner oder Raum 9); R4: 12 Paare. Alle Ordner-Prüfungen grün.
  - [x] **AP1-2 Kunde, Markt und Unternehmen (13.10.2026):** 5 Themenblöcke, 16 Stichpunkte, 76 Können-Aussagen,
        9 Kür-Einträge. Alt → neu: 24 übernommen, 20 angepasst, 6 verschoben, 0 gestrichen; 26 neu. 34 Teilaufgaben.
        R3: 37 Themen (Kern 18, Kür 10, Außen 4, anderer Ordner oder Raum 5); R4: 13 Paare.
  - [x] **AP1-3 Wirtschaftlichkeit und Verträge (13.10.2026):** 4 Themenblöcke, 16 Stichpunkte, 87 Können-Aussagen,
        9 Kür-Einträge. Alt → neu: 42 übernommen, 17 angepasst, 4 verschoben, 0 gestrichen; 24 neu. 51 Teilaufgaben.
        R3: 32 Themen (Kern 20, Kür 9, Außen 1, anderer Ordner 2); R4: 10 Paare.
  - [x] **AP1-4 Hardware und Arbeitsplatz (13.10.2026):** 3 Themenblöcke, 13 Stichpunkte, 78 Können-Aussagen,
        7 Kür-Einträge. Alt → neu: 32 übernommen, 12 angepasst, 2 verschoben, 0 gestrichen; 32 neu. 53 Teilaufgaben.
        R3: 29 Themen (Kern 14, Kür 8, Außen 4, anderer Ordner 3); R4: 8 Paare.
  - [x] **AP1-5 Software und Betriebssysteme (13.10.2026):** 2 Themenblöcke, 9 Stichpunkte, 54 Können-Aussagen,
        6 Kür-Einträge. Alt → neu: 34 übernommen, 7 angepasst, 0 verschoben, 0 gestrichen; 13 neu. 19 Teilaufgaben.
        R3: 28 Themen (Kern 17, Kür 7, Außen 1, anderer Ordner 3); R4: 10 Paare.
  - [x] **AP1-7 IT-Sicherheit und Datenschutz (13.10.2026):** 5 Themenblöcke, 18 Stichpunkte, 98 Können-Aussagen,
        6 Kür-Einträge. Alt → neu: 53 übernommen, 15 angepasst, 4 verschoben, 2 gestrichen (AP1-7-1-1-K4 Authentizität
        und AP1-7-3-1-K5 Verfahrensnamen AES/RSA/TLS: weder Katalog noch Prüfung, jetzt Kür); 26 neu. 56 Teilaufgaben.
        R3: 31 Themen (Kern 21, Kür 5, Außen 4, anderer Raum 1); R4: 12 Paare.
  - [x] **AP1-8 Programmieren und Modellieren (13.10.2026):** 4 Themenblöcke, 15 Stichpunkte, 83 Können-Aussagen,
        6 Kür-Einträge. Alt → neu: 55 übernommen, 13 angepasst, 0 verschoben, 0 gestrichen; 15 neu (neuer Stichpunkt
        AP1-8-4-5 Primär- und Fremdschlüssel). 32 Teilaufgaben. R3: 33 Themen (Kern 20, Kür 6, Außen 5, anderer
        Ordner 2); R4: 11 Paare. EPK/BPMN unverändert übernommen, Einordnung offen (P24).
  - [x] **Raum-Prüfung AP1 (13.10.2026):** `tools/umbau/raum-pruefen.mjs AP1`, Bericht `umbau/berichte/AP1-raum.md`:
        T1 (183 Pflichtbausteine inkl. 4 Zusatzbausteine), T2b (288 Teilaufgaben) und T8 (183 Bausteine) über alle
        Ordner grün. Alle Ordner-Prüfungen grün; Kerntest je Ordner nur als Selbstprüfung (P16).
  - [x] **Unabhängige Prüfung K1–K3 (P16, 13.10.2026):** 76 Funde in 8 Berichten (`umbau/berichte/AP1-<n>-pruefer.md`),
        daraus Regelwerk v1.3 (Z3a, P25). Funde in alle 8 Lernpläne eingebaut: Operatoren nach 4.1, fehlende
        Katalogstellen in der Herkunft, 6 K1-Lücken geschlossen, 3 Aussagen gestrichen oder verschoben
        (AP1-1-4-2-K4 → AP1-3-3-2-K7, AP1-2-4-1-K5 und AP1-7-2-3-K3 gestrichen), Social Engineering und Zielkonflikte
        als Grenze (P21), Paketmanager als Kür. Alle Ordner- und Raum-Prüfungen grün.
- [x] **Vorschau AP1 in der App (14.10.2026, Branch `vorschau-ap1`):** Der Raum AP1 zeigt die acht Lernpläne als
      Lernraum (Abnahme M1/M2 aus Lernsicht). Umwandlung nur im Build (`tools/vorschau-ap1.mjs`, Test
      `tests/vorschau-ap1.test.mjs`); `LERNSTUDIO_AP1=alt npm run build` baut den alten Stand. Karten über `alt_neu`:
      1.016 bleiben (40 umgehängt), 11 entfallen; 192 neue Aussagen ohne Karten sind gekennzeichnet. P27, P28 entschieden.
- [x] **Schritt 3d – Kritische Gegenprüfung AP1 (14.10.2026):** unabhängige Sitzung ohne frühere Berichte, mit
      Katalog und 11 Abschriften. Ergebnis: aus den Prüfungen fehlt nichts; vor allem Doppelungen über Ordnergrenzen.
      Bericht mit Nachtrag zur Umsetzung: `umbau/berichte/AP1-gegenpruefung.md`. Eingebaut (Freigabe Projektinhaber):
      652 → 604 Können-Aussagen, Protokoll je Ordner in `meta.gegenpruefung`; alle Ordner- und Raum-Prüfungen grün.
      `lernplan-pruefen.mjs` erlaubt jetzt „verschoben“ in einen anderen Ordner desselben Raums. Entscheidungen P30–P32.
      Danach Abnahme durch den Projektinhaber (3b).
- [x] **Schritt 3e – Lernkarten AP1 neu (Entscheidung Projektinhaber, 14.10.2026):** nach der Abnahme. Die KI
      entscheidet je alter Karte bleibt / bearbeitet / entfernt und ergänzt neue; IDs bleiben erhalten. Auftrag:
      `umbau/auftraege/AP1-karten.md`, Ergebnis in `umbau/karten/ap1/`. Erledigt 14.10.2026 für alle 8 Ordner:
      1.027 alte Karten (966 bleiben, 36 bearbeitet, 25 entfernt), 291 neu, 1.293 Karten; jede Aussage hat eine Karte
      außer AP1-6-1-3-K5 (Symbole, `nicht_abgefragt`). Vorschau und Test (`tests/vorschau-ap1.test.mjs`) nehmen die
      neuen Dateien. Berichte `umbau/berichte/AP1-<n>-karten.md`. Hinweis: npm-Registry war gesperrt, `Lernstudio.html`
      wurde durch Austausch des Datenliterals erzeugt (Code unverändert); `tests/sql.test.mjs` braucht sql.js.
- [x] **Schritt 3f – Teaser und Erklärungen AP1 (Wunsch Projektinhaber, 14.10.2026):** in
      `umbau/kurz/ap1/AP1-<n>.json` zwei Felder. `teaser`: je Stichpunkt ein kurzer Einstieg (1–2 Sätze, oft mit einer
      Frage), worum es geht – die Kurzfassung (116 Stichpunkte). `erklaerung`: je Können-Aussage die ausführliche
      Erklärung mit Beispiel – die Langfassung (604 Aussagen). Die Vorschau zeigt den Teaser unter dem Ziel
      (`neu.kurz`), die Erklärung lässt sich an jeder Aussage unter „Das musst du können“ aufklappen
      (`erklaerung`, `<details class="np-erkl">` in `BlockKarte.jsx`). Test in `tests/vorschau-ap1.test.mjs`
      (jeder Stichpunkt hat einen Teaser, jede Aussage eine Erklärung, keine fremden IDs). Schicht 5: hängt an den
      Lernplänen, ändert sie aber nicht (AP1 bleibt eingefroren). Die erste Fassung (ein langer Text je Stichpunkt)
      ist ersetzt.
- [x] **Schritt 3g – AP1 mit Quellen nachgeprüft (14.10.2026):** Fundament aus dem Katalog neu erzeugt (T0, T0c grün),
      11 AP1-Abschriften (T-1), Zuordnung (T2, goldene Regel), alle 8 Ordner, Raum-Prüfung (T1, T2b, T8) und alle
      185 Tests grün; keine Datei hat sich dabei geändert. `Lernstudio.html` jetzt echt mit `npm run build` gebaut
      (gleiche Funktionen, nur andere Minifizierung) und im Browser ohne Konsolenfehler geöffnet.
- [x] **Schritt 5a – Abschriften PB1/PB2 geprüft (14.10.2026):** `pruefungen-pruefen.mjs` kennt jetzt AP2-Dateinamen
      (`2025W_AP2-PB1.md` ↔ Kopf-ID `2025W-PB1`), Termine S/W mit Katalogstand (aktuell ab 2025S) und Aufgaben ohne
      Teilaufgaben (yaml direkt unter `# …-An`); Kurzaufruf `node tools/umbau/pruefungen-pruefen.mjs pb1`. Alle 18
      Abschriften bestehen T-1; einziger Hinweis: 2025W-PB2 ohne Operatoren (Aufgabensatz fehlt). Tests ergänzt.
- [x] **Schritt 6a – Prüfungen zugeordnet (PB1, 14.10.2026):** alle 152 Teilaufgaben der 9 PB1-Prüfungen in
      `umbau/zuordnung/pb1/<Termin>-PB1.json`, keine außerhalb (B3 betrifft in AP2 nur die Darstellungsform Struktogramm:
      2023S-PB1-A2-bc/bd mit Hinweis nach Z4). Gültige Bausteine je Raum regelt `tools/umbau/raum.mjs`: PB1 nutzt eigene
      AP2-Bausteine (P3) und importiert AP1-Bausteine (E2), PB2-Bausteine lehnt der Prüfer ab (P3 Regel 3, Test).
      Ergebnis `umbau/fundament/belege-pb1.json`: 231 Pflichtbausteine (230 Katalog + `ZB.erechnung`), 88 mit Beleg,
      14 durch Belege angehoben (z. B. REST 1 → 3, Observer/Polymorphie/Interfaces 3 → 4, SAN und Netzausdehnung 2 → 4);
      24 AP1-Bausteine werden aus PB1 belegt (Projektmanagement: Stakeholder, Risiko, Machbarkeit, Kosten; Veränderung;
      Verschlüsselung; Open Source und Lizenzen). Zusatzbausteine haben jetzt ein Feld `raum`. Regelwerk v1.6.
- [x] **Schritt 5 – AP1 einfrieren, Export erzeugen (14.10.2026):** `node tools/umbau/export-raum.mjs AP1` →
      `umbau/export/AP1.json` (116 Stichpunkte, 604 Können-Aussagen in Kurzform mit Stufe, je Baustein die erreichte Stufe)
      und `AP1.md` (eine Zeile je Stichpunkt). Der Export speichert Prüfsummen der acht Lernpläne; der Test
      (`export-raum.mjs AP1 --pruefen`) schlägt fehl, sobald ein AP1-Lernplan geändert wird. **AP1 ist eingefroren:**
      Änderungen nur über den Parkplatz, danach Export neu erzeugen. PB1 sieht von AP1 nur den Export; bei Importen
      prüft `raum-pruefen.mjs` T8 mit der in AP1 erreichten Stufe (E2: ergänzt wird nur, was tiefer ist).
- [x] **Schritt 6 – PB1**, dann **PB2**, dann **WISO** (jeweils mit Export der früheren Räume)
  - Gliederung PB1 (E8, P33): zwölf Ordner, alle im Gebiet ihres Inhalts verankert: PB1-1 Projekt, Vorgehen und
    Anforderungen · PB1-2 Kunde, Recht und Präsentation · PB1-3 Entwicklungsumgebung und Werkzeuge · PB1-4 UML ·
    PB1-5 Objektorientierter Entwurf und Entwurfsmuster · PB1-6 Datenmodellierung · PB1-7 Schnittstellen und
    Datenaustausch · PB1-8 Benutzeroberflächen · PB1-9 Qualität und Test · PB1-10 IT-Sicherheit und Datenschutz ·
    PB1-11 Netzwerk · PB1-12 Betrieb, Verfügbarkeit und Cloud. Prüfer: `lernplan-pruefen.mjs PB1-<n>` prüft zusätzlich
    E2 (Bausteine aus AP1 nur mit `baut_auf` auf einen Stichpunkt des Exports) und T7 (eine Aussage nur zu
    AP1-Bausteinen muss tiefer gehen als AP1 oder von einer PB1-Teilaufgabe belegt sein).
  - [x] **PB1-1 Projekt, Vorgehen und Anforderungen (14.10.2026):** 3 Themenblöcke, 9 Stichpunkte, 36 Können-Aussagen.
        Alte AP2-Aussagen: 16 angepasst, 4 verschoben, 6 gestrichen (Netzplan wohnt in AP1; begründete Modellwahl G3).
        Projektumfeld (Stakeholder, Risiko, Veränderung, Fremdvergabe) aus AP1 importiert, neu nur, was PB1 verlangt.
  - [x] **PB1-2 Kunde, Recht und Präsentation (14.10.2026):** 1 Themenblock, 4 Stichpunkte, 22 Können-Aussagen, 3 Kür.
        Alte AP2-Aussagen: 10 angepasst, 1 verschoben, 4 gestrichen (Englisch wohnt in AP1), 1 für PB2.
        Recht und Präsentation ohne Prüfungsbeleg nach P-MUSTER mit dem Katalogoperator (gestalten, aufbereiten).
  - [x] **PB1-3 Entwicklungsumgebung und Werkzeuge (14.10.2026):** 2 Themenblöcke, 7 Stichpunkte, 29 Können-Aussagen.
        Alte AP2-Aussagen: 21 angepasst, 3 verschoben, 6 gestrichen (Werkzeug-Grundlagen in AP1-8-1-1; Git-Grundfunktionen
        in PROJEKT nach P9). Zuordnung 2023S-PB1-A4-a korrigiert: Verschlüsselung für Sensoren, nicht Sensorauswahl.
  - [x] **PB1-4 UML-Modellierung (14.10.2026):** 2 Themenblöcke, 6 Stichpunkte, 24 Können-Aussagen. Alte AP2-Aussagen:
        20 angepasst, 4 verschoben, 8 gestrichen (Grundnotation in AP1-8-3; EPK/BPMN nur im AP1-Anhang), 1 für PB2
        (Algorithmen als Aktivitätsdiagramm). Sequenz- und Zustandsdiagramm sind neu gegenüber AP1.
  - [x] **PB1-5 Objektorientierter Entwurf und Entwurfsmuster (14.10.2026):** 2 Themenblöcke, 6 Stichpunkte,
        29 Können-Aussagen. Alte AP2-Aussagen: 22 angepasst, 3 verschoben, 4 für PB2 (Klassen erweitern, Ausnahmen im Code
        erkennen). Pseudocode-Teilaufgaben in PB1 setzen OO-Methoden um und bauen auf AP1-8-2-2 auf.
  - [x] **PB1-6 Datenmodellierung und Datenhaltung (14.10.2026):** 1 Themenblock, 5 Stichpunkte, 25 Können-Aussagen.
        Alte AP2-Aussagen: 26 angepasst, 3 verschoben, 2 für PB2 (SQL-Datentypen, Datenqualität beim Import); zwei weitere
        Aussagen aus AP2-4-1-2 (Validierung, Schemaprüfung) sortiert PB1-7 ein.
  - [x] **PB1-7 Schnittstellen und Datenaustausch (14.10.2026):** 2 Themenblöcke, 6 Stichpunkte, 29 Können-Aussagen.
        Alte AP2-Aussagen: 14 angepasst, 4 verschoben, 1 für PB2 (Importfähigkeit eines Datenbestands). Zusatzbaustein
        eRechnung hier; damit ist die eRechnung, in AP1 Kür (P30), in PB1 Kern.
  - [x] **PB1-8 Benutzeroberflächen (14.10.2026):** 1 Themenblock, 4 Stichpunkte, 19 Können-Aussagen. Alte AP2-Aussagen:
        8 angepasst, 3 verschoben. Grundsätze der Dialoggestaltung in der aktuellen Fassung (mit Erlernbarkeit, Benutzerbindung).
  - [x] **PB1-9 Qualität und Test (14.10.2026):** 2 Themenblöcke, 7 Stichpunkte, 28 Können-Aussagen. Alte AP2-Aussagen:
        24 angepasst, 4 verschoben, 5 gestrichen, 23 für PB2 (Testdaten, Überdeckung, Schreibtischtest an Code, Debugging, TDD).
        Weitere Testarten (Last-, Regressionstest, Test-Doubles) nach P-BEISPIELLISTE Kür: nur eine Hinweisquelle.
  - [x] **PB1-10 IT-Sicherheit und Datenschutz in Anwendungen (14.10.2026):** 3 Themenblöcke, 10 Stichpunkte,
        41 Können-Aussagen. Alte AP2-Aussagen: 47 angepasst, 2 verschoben, 7 gestrichen (Kryptografie-, Hash- und
        Anmelde-Grundlagen wohnen in AP1-7-3). Die 15 TOM-Beispiele aus AP2a.04.06 verlangen „prüfen“ (Stufe 4).
  - [x] **PB1-11 Netzwerk (14.10.2026):** 2 Themenblöcke, 8 Stichpunkte, 36 Können-Aussagen. Alte AP2-Aussagen:
        44 angepasst, 3 verschoben, 5 gestrichen (Grundlagen in AP1-6), 5 für PB2 (Datenmengen berechnen). Deckt die
        Grenzen von AP1-6 ab, die auf AP2 verweisen (TCP/UDP, DHCP-Ablauf, Topologien, Netzausdehnung, VPN-Modelle, IPsec).
        Tiefe ohne Beleg = Katalogtiefe (meist Stufe 2); so entschieden mit P10.
  - [x] **PB1-12 Betrieb, Verfügbarkeit und Cloud (14.10.2026):** 2 Themenblöcke, 6 Stichpunkte, 25 Können-Aussagen.
        Alte AP2-Aussagen: 26 angepasst, 1 gestrichen (Backup-Arten in AP1-7-3-5). RAID ist hier Kern (in AP1 nach B3 außen).
  - [x] **Raum-Prüfung PB1 (14.10.2026):** `node tools/umbau/raum-pruefen.mjs PB1`, Bericht `umbau/berichte/PB1-raum.md`:
        T1 (232 Pflichtbausteine inkl. 2 Zusatzbausteine), T2b (152 Teilaufgaben), T8 (256 Bausteine mit belegter Tiefe,
        auch Importe aus AP1) und ALT grün. Alle 445 alten AP2-Können-Aussagen einsortiert: 34 verschoben, 278 angepasst,
        42 gestrichen, 91 für PB2 vermerkt (Algorithmen, SQL, Testdaten, Überdeckung, Debugging, Datenmengen).
        Gesamt PB1: 12 Ordner, 23 Themenblöcke, 78 Stichpunkte, 343 Können-Aussagen, 15 Kür-Einträge. Test in
        `tests/umbau-fundament.test.mjs` prüft alle PB1-Ordner und den Raum.
  - [x] **Unabhängige Prüfung PB1 (14.10.2026):** Prüf-Agent ohne Kenntnis des Baus, Auftrag `umbau/auftraege/PB1-pruefung.md`
        (K1–K3 und ausdrücklich Doppeltes und Unnötiges, auch gegen den AP1-Export). Berichte `umbau/berichte/PB1-<n>-pruefer.md`,
        Bilanz `PB1-pruefer-bilanz.md`: 153 Funde (41 hoch). Fragen entschieden mit P35. Alle Funde eingebaut, je Bericht ein
        Abschnitt „Umsetzung“ (umgesetzt, teilweise mit Grund). Wichtigstes: Doppelungen innerhalb PB1 und zu AP1 gestrichen
        (E2 heißt mehr Inhalt), Last-/Performancetest, BLOB und Geokoordinaten als Kern, Netzwerktopologie außen (E7, Ausnahme
        in `raeume-ap2.json`), fachliche Fehler korrigiert (V-Modell, Signatur, DSGVO-Rechtsgrundlagen, E-Rechnung, Factory).
        Danach: **12 Ordner, 17 Themenblöcke, 67 Stichpunkte, 266 Können-Aussagen (vorher 343), 17 Kür-Einträge**; alle
        Ordner, Raum-Prüfung und Tests grün; ALT: 445 alte Aussagen → 20 verschoben, 285 angepasst, 48 gestrichen, 92 PB2.
        Umzugstabelle neu erzeugt.
  - [x] **Vorschau, Kurzfassungen und Karten PB1 (14.10.2026, Wunsch Projektinhaber):**
        - Vorschau: `tools/vorschau-ap1.mjs` verallgemeinert (`vorschauRaum`, `RAEUME_VORSCHAU`); in der App zeigt der Raum
          AP2 jetzt den PB1-Lernplan („Planen eines Softwareproduktes (PB1)“). Alte AP2-Aussagen, die nach PB2 gehören, fehlen
          dort, bis PB2 gebaut ist (209 alte Karten warten). Hinweis je Raum über `vorschauRaeume`.
        - Kurzfassungen wie AP1 (3f): `umbau/kurz/pb1/PB1-<n>.json`, 67 Teaser und 266 Erklärungen.
        - Karten wie AP1 (3e): `umbau/karten/pb1/PB1-<n>.json`, Berichte `umbau/berichte/PB1-<n>-karten.md`. Von 676 alten
          AP2-Karten mit Ziel in PB1: 586 bleiben, 7 bearbeitet (zusammen 28 an eine andere Aussage im Ordner gehängt),
          83 entfernt (meist E2: Grundlagen stehen in AP1), 105 neu → 698 Karten, jede der 266 Aussagen hat mindestens eine.
        - Tests in `tests/vorschau-ap1.test.mjs` (Gliederung, Kurzfassungen, Karten-Regeln wie AP1).
  - [x] **Eigene Räume PB1 und PB2 in der App (14.10.2026, Wunsch Projektinhaber, Teil von Schritt 7 vorgezogen):**
        Raumwahl AP1 | PB1 | PB2 | WiSo statt AP1 | AP2 | WiSo (`#/pb1`, `#/pb2`; `#/ap2` führt nach PB1; Akzentfarbe PB2
        orange). PB1 zeigt den neuen Lernplan. PB2 zeigt bis zum Neubau die alten AP2-Stichpunkte mit genau den Aussagen,
        die laut `alt_neu` nach PB2 gehören (24 Stichpunkte, 92 Aussagen, 209 Karten, alte IDs). Lernstand-Umzug (P6)
        umgesetzt: `daten.umzug` aus `umbau/umzug.json`; `ableiten` schreibt alte Stichpunkt-, Block- und Termin-IDs beim
        Lesen auf die neuen um, das Protokoll bleibt unverändert (alte Sicherungen bleiben lesbar); behaltene Karten haben
        ihre alte ID. Trainer und Probeprüfungen: Inhalte für „AP2“ gelten in PB1 und PB2 (`trainer/rahmen/raum.js`), welcher
        Trainer wo erscheint, entscheiden seine Stichpunkte über den Umzug; Prüfungsteil PB1 im Raum PB1, PB2 im Raum PB2.
        Tests in `tests/vorschau-ap1.test.mjs` (Räume, Umzug beim Ableiten). Der alte Stand (`LERNSTUDIO_AP1=alt`) baut weiter.
  - [x] **PB1 abgenommen (16.10.2026, Projektinhaber, siehe P45)**, Export PB1 endgültig (E3). Früher: Für den Bau von PB2 ist ein
        **vorläufiger Export** `umbau/export/PB1.json` erzeugt (Claude im Auftrag des Projektinhabers, 14.10.2026);
        ändert sich PB1 bei der Abnahme, wird er neu erzeugt und PB2 erneut geprüft (T7/T8).
  - [x] **PB2 Zuordnung (14.10.2026):** `umbau/zuordnung/pb2/*.json`, 107 Teilaufgaben, 34 Pflichtbausteine (32 mit Beleg).
        Regelwerk 1.7: Operatoren der PB2-Aufgaben (anlegen, anzeigen, erhöhen, … Stufe 3; überprüfen, argumentieren 4;
        aufzeigen 2; notieren 1). Zusatzbausteine ZB.prozedur-trigger, ZB.rekursion, ZB.generik-funktionsobjekte (Raum PB2).
        SQL-Teilaufgaben belegen immer auch AP2a.02.03.6 und AP2b.03.03.2 (Datenbankabfrage, SQL nutzen) und die passenden
        AP2a.02.03.8–10. 2025W-PB2 ohne Aufgabensatz belegt nur das Thema (P34). Test „Zuordnung PB2 besteht T2 …“.
  - [x] **PB2 Ordner 1–6 (14.10.2026):** IDs nach P33 (`PB2-1-1-1-K1`). Importe aus AP1 und PB1 über `baut_auf` (E2):
        Datenmodell, ERM/Normalisierung und UML wohnen in PB1, PB2 ergänzt nur, was tiefer ist.
        | Ordner | Titel | SP | Können | alte Aussagen |
        |---|---|---|---|---|
        | PB2-1 | Programmlogik und Pseudocode | 4 | 17 | 12 angepasst, 1 gestrichen |
        | PB2-2 | Suchen, Sortieren, Rekursion und Generik | 4 | 12 | 6 angepasst |
        | PB2-3 | Fehler finden, Debugging und Unit-Tests | 3 | 12 | 10 angepasst, 1 gestrichen |
        | PB2-4 | Testszenarien und Testdaten | 3 | 14 | 13 angepasst, 1 gestrichen |
        | PB2-5 | SQL: Tabellen, Datenpflege und Rechte | 5 | 20 | 18 angepasst, 7 gestrichen (Datentypen in PB1-7) |
        | PB2-6 | SQL: Daten abfragen | 4 | 17 | 23 angepasst |
        Raum-Prüfung `node tools/umbau/raum-pruefen.mjs PB2` grün (T1, T2b, T8, ALT: alle 92 in PB1 für PB2 vermerkten
        Aussagen genau einmal einsortiert, 82 angepasst, 10 gestrichen). Gesamt: 6 Ordner, 23 Stichpunkte, 92 Können-Aussagen.
        Umzugstabelle hat kein „offen“ mehr. Test „Raum PB2 …“ in `tests/umbau-fundament.test.mjs`.
  - [x] **Vorschau PB2 (14.10.2026):** `vorschauPb2` in `tools/vorschau-ap1.mjs` ersetzt den Platzhalter, sobald
        `umbau/lernplan/pb2` vorliegt: Raum PB2 zeigt 6 Ordner, 23 Stichpunkte, 92 Aussagen; die 209 alten PB2-Karten laufen
        über das `alt_neu` von PB2 (186 an neuen Aussagen, 23 gestrichen). Lernstand-Umzug für alle alten AP2-Stichpunkte
        nach PB1 oder PB2. Tests in `tests/vorschau-ap1.test.mjs` gelten für PB1 und PB2. 26 Aussagen haben noch keine Karte.
  - [x] **PB2 fertig und abgenommen (16.10.2026):** (vorher: Stand 14.10.2026, 20:30, Pause wegen Nutzungslimit)
        1. ~~Unabhängige Prüfung PB2~~ **erledigt 16.10.2026:** 89 Funde in 6 Berichten, Bilanz
           `umbau/berichte/PB2-pruefer-bilanz.md` (92 → 85 Aussagen vorgeschlagen, 9 offene Fragen an den Projektinhaber). Alt: Bei
           Fortsetzung neu starten (Berichte `umbau/berichte/PB2-<n>-pruefer.md`, Bilanz `PB2-pruefer-bilanz.md`).
        2. ~~Funde einbauen~~ **erledigt 16.10.2026:** je Bericht Abschnitt „Umsetzung“; T7 streng (P36), Entscheidungen P37–P44
           umgesetzt, SQL-Ordner getauscht (P39: PB2-5 = Abfragen, PB2-6 = Tabellen/Datenpflege/Rechte). Stand: 6 Ordner,
           21 Stichpunkte, 93 Können-Aussagen (PB2-1 15, PB2-2 11, PB2-3 11, PB2-4 12, PB2-5 25, PB2-6 19); 31 Aussagen ohne Karte.
           Raum-Prüfung PB2, alle Ordner und `npm test` grün, Umzug neu erzeugt, Build und Browser-Check `#/pb2` ohne Fehler.
           Die Generatoren in `tools/umbau/gen-pb2/` bilden den Stand vor dem 16.10. ab und dürfen nicht mehr laufen.
        3. ~~Kurzfassungen~~ **erledigt 16.10.2026:** `umbau/kurz/pb2/PB2-1.json` … `PB2-6.json`, 21 Teaser, 93 Erklärungen.
        4. ~~Karten~~ **erledigt 16.10.2026:** `umbau/karten/pb2/PB2-<n>.json` + Berichte `PB2-<n>-karten.md`; 304 Karten
           (PB2-1 50, PB2-2 30, PB2-3 34, PB2-4 40, PB2-5 90, PB2-6 60), jede Aussage mit Karte, alte Karten im Protokoll
           entschieden (Karten zu im alt_neu gestrichenen Aussagen entfallen ohne Protokoll, wie in PB1). SQL-Beispiele an
           PostgreSQL 16 bzw. am SQL-Auszug des Anhangs geprüft (P41).
        5. Build und Browser-Check `#/pb2` **erledigt 16.10.2026** (ohne Fehler). **Offen: Abnahme PB1 und PB2 durch den
           Projektinhaber** – **erledigt 16.10.2026 (P45)**; Export PB2 erzeugt: `umbau/export/PB2.json` (E3, eingefroren).
        6. **PB1 nach P36 bereinigt (16.10.2026):** 32 T7-Fehler behoben (14 AP1-Bausteine nur noch per `baut_auf`,
           7 Aussagen mit `neu`, 11 auf das Neue gekürzt, PB1-10-2-3-K1 gestrichen), 20 Karten entfernt, 3 neu; Export PB1 neu
           erzeugt, PB2 dagegen grün. Abschnitte „Doppelungen zu AP1“ in `umbau/berichte/PB1-<n>-pruefer.md`.
        Bau-Skripte gesichert in `tools/umbau/gen-pb2/` (siehe LIESMICH dort). Regelwerk der PB2-Ordner: 1.7.
- [x] **Raum WISO (16.10.2026, Schritt 6, letzter Teil):** nach dem Muster von PB1/PB2. Regelwerk 1.8.
  - **Quellen:** Katalog (pandoc) und 8 WiSo-Abschriften lokal unter `quellen/` (E10), T-1 grün (Prüfer kann jetzt WiSo:
    30 Aufgaben je Prüfung, „je X Punkte“, Musterlösung mit Zusatz). Fundament unverändert.
  - **Werkzeuge:** `raum.mjs` kennt WISO (frühere Räume AP1, PB1, PB2; Wohnort `WISO.`; Deckungstabelle),
    `zuordnung-pruefen.mjs` (Z3b, Zusatzbausteine Raum WISO), `lernplan-pruefen.mjs` (ID-Erhalt wie AP1, alte Karten aus
    allen `inhalte/lernen/WISO-*.json`, Deckung in T7/T8), `raum-pruefen.mjs` (P47, ALT über alle alten WiSo-Aussagen),
    `umzug-erzeugen.mjs` (WISO). **Werkzeugfehler behoben:** Der Umzug leitete einen weiterbestehenden Stichpunkt auf einen
    anderen um, wenn er die Mehrheit seiner Aussagen abgab (AP1-6-3-1 → AP1-6-3-3, WISO-3-4-2 → WISO-3-1-3); jetzt zeigt
    eine alte ID, die es im neuen Plan noch gibt, auf sich selbst (Test). Für AP1 ändert das nur diesen einen Eintrag.
  - **Zuordnung:** `umbau/zuordnung/wiso/<Termin>-WISO.json`, 240 Aufgaben, 242 Pflichtbausteine (237 Katalog + 5 Zusatz:
    ZB.wiso-konjunktur, -oekonomisches-prinzip, -gerichtsbarkeit, -kaufmann, -verursacherprinzip), 101 mit Beleg,
    14 durch Belege angehoben. Importe aus AP1/PB1 nur in Zuordnungen, deren Aufgabe ein früherer Raum löst.
  - **Lernplan:** `umbau/lernplan/wiso/WISO-1.json` … `WISO-5.json`, erzeugt mit `tools/umbau/gen-wiso/wiso_<n>.py`
    (Bibliothek `lpw.py`; seit der Abnahme stillgelegt, siehe `LIESMICH.md` dort). IDs bleiben (P48).
  - **Unabhängige Prüfung K1–K3 (16.10.2026):** Auftrag `umbau/auftraege/WISO-pruefung.md`, 6 Prüfer, 197 Funde, Berichte
    `umbau/berichte/WISO-<n>-pruefer.md` mit Abschnitt „Umsetzung“, Bilanz `WISO-pruefer-bilanz.md` (Entscheidungen D1–D12
    aus dem Regelwerk abgeleitet). 155 umgesetzt, 15 teilweise, 12 abgelehnt mit Grund, 8 Kür-Vorschläge → P49.
    Deckungstabelle danach: 10 Bausteine (WISO.03.08.2, .03.08.4, WISO.02.03.3 herausgenommen, nur teilweise gedeckt).
  - **Stand:** 5 Ordner, 20 Themenblöcke, 70 Stichpunkte, 325 Können-Aussagen (WISO-1 143, WISO-2 69, WISO-3 60,
    WISO-4 25, WISO-5 28). Alle Ordner, Raum-Prüfung (T1, T2b, T8, ALT, P47), Zuordnung, Umzug und `npm test` grün.
  - **Kurzfassung und Karten:** Auftrag `umbau/auftraege/WISO-karten.md`; `umbau/kurz/wiso/WISO-<n>.json`,
    `umbau/karten/wiso/WISO-<n>.json`, Berichte `umbau/berichte/WISO-<n>-karten.md`. Karten gestrichener Aussagen stehen nur
    in `alt_gestrichen` (Test angepasst: bei WiSo haben alte und neue IDs dasselbe Präfix).
  - **Vorschau:** `RAEUME_VORSCHAU.WISO` (`vorschauWiso`): Der Raum WiSo zeigt den neuen Lernplan, Name „WiSo“ bleibt,
    Umzug für entfallene WiSo-IDs; **nicht abgenommen** → gelber Hinweis. Tests in `tests/vorschau-ap1.test.mjs`
    („Vorschau WISO“), Raum- und Deckungstests in `tests/umbau-fundament.test.mjs`. Build und Browser-Check `#/wiso`.
  - **Kür (P49, 16.10.2026):** Hinweisquelle `pruefer:wiso-2026-10`; 14 Kür-Einträge an 11 Stichpunkten (WISO-1 5, WISO-2 1,
    WISO-3 5, WISO-4 1, WISO-5 1), je Ordner im Hinweis-Abgleich (R3, Ring Kür). Lernpläne sonst unverändert.
  - **Abgenommen (P52, 16.10.2026):** `abgenommen: true` in `RAEUME_VORSCHAU.WISO`, Export `umbau/export/WISO.json` und
    `WISO.md` (70 Stichpunkte, 325 Können-Aussagen, eingefroren; Test prüft alle vier Exporte), Generatoren stillgelegt
    (`lpw.py` bricht beim Schreiben ab). Alle Ordner, Raum-Prüfung, Zuordnung, Umzug und `npm test` grün (233, 24 übersprungen
    ohne AP1/PB-Quellen, P51); Build und Browser-Check `#/wiso` auf Desktop und Handy ohne Fehler.
- [x] **Entscheidungen P6, P10, P27, P28, P29 (14.10.2026, Claude im Auftrag des Projektinhabers):** siehe Parkplatz.
      Umzugstabelle `umbau/umzug.json` aus allen `alt_neu` (`node tools/umbau/umzug-erzeugen.mjs`, Test prüft
      Vollständigkeit und Aktualität). Art neuer Stichpunkte in der Vorschau aus den Aufgabentypen (P27).
- [x] **Schritt 7 – App (16.10.2026):** AP1, PB1 und PB2 zeigen den neuen Lernplan als fertigen Stand; WiSo zeigt seit
      dem Bau von WISO den neuen Lernplan (seit P52 ebenfalls abgenommen). Weiter **vier Räume** (AP1 | PB1 | PB2 | WiSo); der Raum PROJEKT kommt mit Schritt 8 (zurückgestellt, P53). Lernstand-Umzug (P6)
      war schon vorgezogen (siehe „Eigene Räume PB1 und PB2“).
      - **Importe anzeigen (E2/P36):** `baut_auf` kommt als `neu.bautAuf` in die Daten (`tools/vorschau-ap1.mjs`). Im
        Stichpunkt-Detail steht oben im Rahmen „Baut auf“ mit dem Satz „Das kennst du schon – hier kommt nur das Neue dazu.“,
        je importiertem Stichpunkt Titel, Raum und Häkchen aus dem Lernstand; ein Klick springt in den anderen Raum und
        öffnet dort den Stichpunkt (wie die Gegenstücke).
      - **„neu gegenüber …“:** Aussagen mit Feld `neu` tragen eine kleine Marke „+ neu gegenüber <ID>“; antippen klappt
        `was` und die Grundlage als Link auf (auf dem Handy bedienbar, am Desktop zusätzlich Tooltip).
      - **P29:** „Das musst du können“ einklappbar; zugeklappt mit Anzahl der Aussagen (und „n neu ohne Karten“, falls > 0),
        aufgeklappt wie bisher. Zustand je Gerät in den Ansichts-Einstellungen (`lernen.koennenOffen`, Standard offen).
      - **Abnahme sichtbar (P45):** `RAEUME_VORSCHAU` hat das Feld `abgenommen`; der gelbe Hinweis erscheint nur noch für
        Räume ohne Abnahme (seit P52 keiner, auch WiSo nicht). `LERNSTUDIO_AP1=alt npm run build` baut weiter den alten Stand.
      - Tests in `tests/vorschau-ap1.test.mjs` („Schritt 7: baut_auf, neu und Abnahme“), Build, Browser-Check und eigene
        Prüfung mit Playwright (PB1, PB2 auf 1400 px und 390 px, Sprung, Einklappen, kein waagerechtes Scrollen).
- [ ] **Schritt 8 – PROJEKT** – **bewusst zurückgestellt** (Projektinhaber, 16.10.2026, P53): wird später gebaut, näher an der
      Projektphase. Bis dahin nicht anfangen.

---

## 8. Parkplatz

Offene Fragen und Ideen. Neue Punkte unten anhängen, nie still entscheiden.

| Nr | Frage | Stand |
|---|---|---|
| P1 | Repo ist öffentlich, Quellen urheberrechtlich geschützt. **Entschieden:** Quellen bleiben lokal und werden der Sitzung bei Bedarf angehängt (E10). | erledigt |
| P2 | Nachgeprüft: § 10 Abs. 2 FIAusbV, Wortlaut „nur insoweit einbezogen werden, als es für die Feststellung der beruflichen Handlungsfähigkeit erforderlich ist". Bei E2 eingetragen. | erledigt |
| P3 | Zuordnung der AP2-Katalogpunkte zu PB1/PB2 (W2). **Entschieden (Claude im Auftrag des Projektinhabers, 14.10.2026):** Datei `umbau/regeln/raeume-ap2.json`, Prüfung `node tools/umbau/raeume-ap2.mjs`. Regeln: (1) das Gebiet im Raster entscheidet; (2) passt ein Baustein zu Gebieten beider Räume, zu keinem, oder brauchen ihn Prüfungen beider Räume → PB1 (W2); (3) was eine PB1-Teilaufgabe braucht, muss in AP1 oder PB1 wohnen (E3); (4) je Katalogpunkt, Spiegelstriche erben, Ausnahmen einzeln; (5) Katalog-Zusätze → keiner (G5) bzw. PROJEKT (P9). Ergebnis: 263 Bausteine → **PB1 230, PB2 31, PROJEKT 2**. PB2 wohnen: Algorithmen und Pseudocode (AP2b.03.05, .04.16, .04.18, .04.19, AP2a.02.02.1), SQL (AP2b.04.22, AP2a.02.03.6–10, AP2b.03.03.2), Debugging/Ablaufverfolgung (AP2a.02.01.1, AP2a.03.01.3), Testdaten und Testszenarien (AP2a.02.01.3, AP2a.03.02.3, AP2b.03.08.2, AP2b.05.03.2.1–3). Alles andere wohnt in PB1, auch Datenmodellierung (ERM, relationales Modell, Normalisierung), Testverfahren, OOP-Konzepte, UML einschließlich Aktivitätsdiagramm, weil beide Prüfungen sie verlangen; PB2 importiert sie und ergänzt, was dort tiefer ist. Netzwerk, Betrieb, Speicher und IT-Sicherheit (AP2b.01, AP2b.02, AP2a.04) wohnen in PB1, weil kein Gebiet sie nennt und die Belege nur aus PB1 kommen; Tiefe dafür bleibt P10. | erledigt |
| P4 | 41 Katalogpunkte ohne Operator: im Regelwerk v1.0 festgelegt (Abschnitt 4.1, `ohne_operator`). | erledigt |
| P5 | Rahmenlehrplan (KMK, 13.12.2019): LF1–LF5 im 1., LF6 im 2. Ausbildungsjahr; laut Rahmenlehrplan sind „aufgrund ihrer Prüfungsrelevanz“ LF1–6 vor Teil 1 zu unterrichten. Die Lernfelder sind als Kompetenzen formuliert (z. B. LF3: Netzwerkinfrastruktur analysieren, Clients konfigurieren und einbinden); Adressierungsdetails (IPv4/IPv6) wurden in der NRW-Fassung nicht gefunden [unbestätigt, Wortlaut nicht vollständig gelesen]. Für die Tiefe weniger genau als der Katalog → nicht eingebunden. Wieder aufnehmen, wenn das Original-PDF vorliegt. **Nachgeprüft (16.10.2026, Original-PDF des Projektinhabers, lokal unter `quellen/rahmenlehrplan/`):** Jahre und Satz zur Prüfungsrelevanz wörtlich bestätigt; IPv4/IPv6 nennt der Rahmenlehrplan nirgends. Abgleich LF1–9 und LF10a–12a gegen alle vier Exporte: jedes Thema hat einen Wohnort, keine Änderung (Bericht `umbau/berichte/rahmenlehrplan-abgleich.md`). E5 bleibt: Tiefe aus dem Katalog. | erledigt |
| P6 | Lernstand-Umzug: Tabelle alte ID → neue ID für Stichpunkte und Karten; bisherige Sicherungen müssen lesbar bleiben. **Entschieden (Claude im Auftrag des Projektinhabers, 14.10.2026):** Eine Tabelle für alle Räume, erzeugt aus den `alt_neu`-Tabellen der Lernpläne: `node tools/umbau/umzug-erzeugen.mjs` → `umbau/umzug.json` (`--pruefen` und Test: jede alte Können-Aussage der gebauten Räume ist eingeordnet, Datei aktuell). Regeln: Können-Aussage → Ziel laut `alt_neu` (gestrichen → entfällt, „PB2“ → offen bis PB2 gebaut ist); Stichpunkt und Themenblock → das neue Ziel, das die meisten ihrer Aussagen bekommen hat (Gleichstand: erstes in Lernplan-Reihenfolge); Karten (`<Können-ID>-n`) behalten ihren Stand nur bei gleicher ID, Karten verschobener Aussagen starten neu, weil sich der Inhalt geändert hat. Die App wendet die Tabelle in Schritt 7 beim Laden an (Schritt in `migriere`); das Ereignisprotokoll selbst bleibt unverändert, so bleiben alte Sicherungen lesbar. Stand jetzt (AP1 + PB1): 912 Aussagen, Stichpunkte 163 mit Ziel, 2 entfallen (Inhalt in AP1), 16 offen für PB2. Umgesetzt in der App am 14.10.2026 für AP2 → PB1/PB2 (`ableiten`, `daten.umzug`). | erledigt |
| P7 | Zeitbudget – verworfen, siehe P19. | erledigt |
| P8 | PROJEKT: Vorgaben der IHK für Rheinhessen (Antrag, Umfang, Dokumentation, Präsentation, Fachgespräch) beschaffen. Die IT-Prüfungsseite der IHK Rheinhessen nennt sie nicht; dort steht ein Ansprechpartner für die IT-Prüfungen. | offen |
| P9 | Katalog-Zusätze „kann Bestandteil der praktischen Prüfung sein" (Versionsverwaltung AP2b.05.04, Präsentieren AP2b.05.05): gehört das in den Raum PROJEKT? **Entschieden (Projektinhaber, 14.10.2026): ja.** Beide wohnen im Raum PROJEKT; in PB1 stehen sie nur als Grenze mit Verweis auf PROJEKT und Katalogstelle (G5). | erledigt |
| P10 | Kapitel AP2b.01–03 sind laut Katalog gemeinsame Inhalte aller Fachinformatiker-Fachrichtungen (Quellenauffälligkeit, PDF-S. 21). Tiefe für Anwendungsentwickler? **Entschieden (Claude im Auftrag des Projektinhabers, 14.10.2026):** **Katalogtiefe, keine Kürzung.** Der Katalog gilt für AE genauso (E6/E7: Grenzen nur aus dem Katalog), und PB1-Prüfungen haben Netzwerk und Betrieb mehrfach abgefragt (z. B. 2024W-PB1-A2, Belege in PB1-11/PB1-12). Belegte Tiefe zählt wie überall; ohne Beleg gilt die Katalogtiefe (meist Stufe 2). Das Gewicht beim Lernen regelt die Wichtigkeit (P28): selten geprüfte Themen erscheinen nicht als Top-Thema. Eine eigene Sonderregel „AE lernt weniger“ gäbe es nur mit einer Quelle, die das sagt – die gibt es nicht. | erledigt |
| P11 | Gegenprüfung mit den Themen-Schlagworten des IT-Berufe-Podcasts (AP1 Herbst 2021 bis Frühjahr 2026) durchgeführt: 2 Struktogramm-Aufgaben (2022F-A4-d, 2022H-A4-b) und 1 fehlender Baustein (2024F-A4-a Zugangs-/Zugriffskontrolle) korrigiert. Für 2025H nennt der Podcast zusätzlich Pseudocode, Schreibtischtest, Code erklären, ERM – das liegt im fehlenden Teil der Abschrift (P14). | erledigt |
| P12 | Lücken-Abgleich mit Lernzetteln und Podcast: jetzt fester Schritt R3 je Ordner (Abschnitt 4.8). | erledigt (Regel) |
| P13 | Z3 überträgt die Stufe einer Teilaufgabe auf alle ihre Bausteine. Bei Teilaufgaben mit mehreren Bausteinen kann ein Nebenbaustein dadurch zu hoch eingestuft werden (Richtung „eher mehr lernen“, also mit der goldenen Regel vereinbar). Im Probelauf vom KI-Prüfer (K2) je Stichpunkt prüfen lassen. **Entschieden (Projektinhaber hat die Entscheidung übertragen, 13.10.2026): keine neue Regel, falsche Zuordnungen einzeln korrigieren.** Der KI-Prüfer (P16) fand zwei Fälle: 2023H-A2-a (Telearbeitsplatz) verliert AP1.07.03.1, 2024F-A1-d (Zustandekommen des Kaufvertrags) verliert AP1.07.01.5, je mit `hinweis` in der Zuordnung. AP1.07.03.1 sinkt von 4 auf 3, AP1.07.01.5 von 4 auf die Katalogstufe 2. Folgen: AP1-1-4-1-K1 jetzt „festlegen“ (Stufe 3), AP1-1-4-1-K5 entfällt (Telearbeitsplatz steht in AP1-4-1-1-K7). Weitere Fälle findet der KI-Prüfer (K2) und werden genauso behandelt. | erledigt |
| P14 | **Bewusst ignoriert (Entscheidung Projektinhaber):** 2025H ist unvollständig (A4 ab b fehlt, 18 Punkte; laut Podcast u. a. Pseudocode, Schreibtischtest, ERM). Rest der Prüfung beschaffen und abschreiben. 2025H und 2026F haben keine Lösungshinweise, 2026H nur nicht amtliche. | erledigt |
| P15 | **ID-Erhalt** löst P6 zum großen Teil: Übernommene und angepasste Stichpunkte und Können-Aussagen behalten ihre alte ID (Lernstand und Karten bleiben gültig). Nur verschobene Aussagen brauchen eine Umzugstabelle (`alt_neu` im Lernplan). **Entschieden (Projektinhaber, 14.10.2026): angenommen**; wird vom Prüfskript (ALT) erzwungen. | erledigt |
| P16 | Kerntest K1 wurde im Probelauf von der bauenden Sitzung selbst gemacht. Für die Abnahme: eine **unabhängige** Sitzung prüft je Stichpunkt mit Musterlösungen (K1–K3). Ohne Musterlösung waren 9 Teilaufgaben (2025H, 2026F). **Durchgeführt 13.10.2026:** unabhängige Prüfung K1–K3, Berichte `umbau/berichte/AP1-<n>-pruefer.md`, 76 Funde (K1 6, K2 64, K3 6). Alle Vorschläge eingebaut (Freigabe Projektinhaber), Die beiden P13-Fälle sind danach mit P13 gelöst; AP1-2-4-1-K6 bleibt Stufe 3 nach Z3a. Nachprüfung der geänderten Stichpunkte durch eine frische Sitzung durchgeführt (14.10.2026): 12 neue Funde (K1 1, K2 11), Berichte `umbau/berichte/AP1-<n>-nachpruefung.md`; von 76 alten Funden 75 behoben, 1 bewusst nicht (AP1-2-4-1-K6, P25). Neue Funde am 14.10.2026 nach Regelwerk v1.4 eingebaut (Nachtrag in den Berichten): alle 12 umgesetzt; bei 2 Operator-Funden (AP1-1-2-1-K2, AP1-6-2-3-K4) wäre nach F1 neu kein Fund geblieben, sie wurden nur an die Teilaufgabe angepasst. | erledigt |
| P17 | Regel P-BEISPIELLISTE für die 43 „z. B.“-Listen im AP1-Katalog. **Entschieden (Projektinhaber, 14.10.2026): angenommen, Regelwerk v1.5 (4.3).** Umgesetzt: Puffer wurden Retrospektive (AP1-1-1-4-K6), weitere Dateibefehle (AP1-5-2-3-K7) und FTP/SFTP/NTP/LDAP (AP1-6-1-2-K6); Kür bleiben u. a. Hub, ICMP (beide Lernzettel = eine Quelle), Fat/Zero Client, Monitor-Kenngrößen, weitere Lizenzen, Kommunikationsarten. | erledigt |
| P18 | Regel P-MUSTER für Aussagen zu nie geprüften Katalogthemen. **Entschieden (Projektinhaber, 14.10.2026): angenommen als F6, Regelwerk v1.5.** Gilt für neu formulierte Aussagen; die bestehenden folgen ihr bereits weitgehend. | erledigt |
| P19 | **Entschieden (Projektinhaber):** kein Zeitbudget. Maßstab ist fachliche Richtigkeit und Vollständigkeit nach den Regeln (Kern + Puffer Pflicht, Kür freiwillig), nicht die verfügbare Zeit. P7 entfällt. | erledigt |
| P20 | **Erledigt (13.10.2026):** R3 für den Rest von AP1-6 (Schritt 3c) und Ordner AP1-1 (Schritt 4). Weiter wie bisher: je Sitzung ein AP1-Ordner nach dem Muster von AP1-6/AP1-1; vorher nur diese Datei und den Bericht des letzten Ordners lesen. | erledigt |
| P21 | **Entschieden (Projektinhaber, 13.10.2026), nach Recherche:** Themen, die nur ein späterer Raum (AP2, WiSo) nennt, bleiben in AP1 **Außen** und werden dort gelernt. Geprüft wurden alle 29 betroffenen Themen gegen die 11 AP1-Prüfungen, den Katalog, die Podcast-Themenliste aller AP1-Termine und Podcast #190 (Katalog-Änderungen ab 2025): keines kam in AP1 vor, alle stehen im AP2- oder WiSo-Katalog; Vorgehensmodelle außer Wasserfall/Scrum sowie TCP/UDP/SMB/NFS sind laut #190 ausdrücklich aus AP1 gestrichen. Einzige Ausnahme: Scrum-Rollen sind Kür in AP1-1-1-2, weil Scrum in AP1 Pflicht ist. Ein erster Versuch (alle 29 als Kür, Commit 927621d) ist damit zurückgenommen. | erledigt |
| P22 | **Entschieden (Claude im Auftrag des Projektinhabers):** G4 bleibt, Normabschnitte und -nummern sind Außen. Name und Zweck der ISO 9001 sind als Kür eingetragen (AP1-1-5-1), weil sie ohne Hilfsmittel abfragbar sind. | erledigt |
| P23 | **Entschieden (Claude im Auftrag des Projektinhabers):** Die Kennzeichnung „Ordner“ im Hinweis-Abgleich bleibt. Sie ist nur Buchführung: Das Thema steht dort, wo es wohnt. | erledigt |
| P24 | **Entschieden (Projektinhaber, 13.10.2026): Pflicht.** Was der Katalog-Anhang zeigt, gehört zu AP1; Prüfungen erweitern nur. Umgesetzt: EPK und BPMN (AP1-8-4-4) bleiben Kern, Aggregation und Komposition sind jetzt Kern (neue Aussage AP1-8-3-2-K6). | erledigt |
| P25 | **Formoperatoren in Z3** (gefunden bei P16): Prüfungsoperatoren, die nur die Antwortform bezeichnen („eintragen“, „ausfüllen“, „vervollständigen“, „ergänzen“, „markieren“), bestimmen nach Z3 die Stufe der Teilaufgabe und damit die Mindesttiefe aller zugeordneten Bausteine. Beispiel: 2023H-A2-d „Tragen Sie Vor- und Nachteile von Homeoffice ein“ hebt AP1.07.02.3 von Stufe 1 auf 3, fachlich ist es „nennen“. Soll in solchen Fällen der fachliche Kern zählen? Verwandt mit P13. **Entschieden (Projektinhaber hat die Entscheidung übertragen, 13.10.2026): Regel Z3a, Regelwerk v1.3.** Formoperatoren zählen nur, wenn kein anderer Operator dasteht. Betroffen: 2023H-A4-ab, 2024F-A4-a, 2026F-A2-b, 2026F-A4-c; Mindesttiefe ändert sich nur bei AP1.06.04.1 (3 → 2). Reine Formaufgaben behalten ihre Stufe (mechanisch, goldene Regel „eher mehr lernen“), auch 2023H-A2-d. | erledigt |
| P26 | **Ring für betriebliche Handlungen** (gefunden bei der Nachprüfung P16, AP1-2-2-1): Die „Beispiele für betriebliche Handlungen/Qualifikationen“ (z. B. AP1.02.H1 Marktbeobachtung) sind Bausteine im Fundament, aber nicht abdeckungspflichtig. 4.8 sagt „steht im Katalog (Baustein) → Kern“. Sind Themen, die nur in einer betrieblichen Handlung stehen, Kern, Puffer oder Kür? **Entschieden (Claude im Auftrag des Projektinhabers, 14.10.2026): Kür.** Die betrieblichen Handlungen sind im Katalog als „Beispiele“ überschrieben und nicht abdeckungspflichtig (T1); prüfungsrelevant sind laut Katalog die Überschriften mit Operatoren (PDF-S. 8). Ein Prüfungsbeleg macht ein solches Thema wie jedes andere zum Kern. Umgesetzt: AP1-2-2-1 (Marktbeobachtung). | erledigt |
| P27 | **Art des Stichpunkts** (gefunden bei der Vorschau AP1): Die App nutzt eine Art je Stichpunkt (Wissen, Rechnen, Zeichnen, Schreiben) für Symbol und Lernprompt; der neue Lernplan hat dieses Feld nicht. Die Vorschau übernimmt die alte Art bei alter ID, die 18 neuen Stichpunkte gelten als „Wissen“. Soll der Lernplan ein Feld Art bekommen (z. B. abgeleitet aus Aufgabentyp der Teilaufgaben)? **Entschieden (Claude im Auftrag des Projektinhabers, 14.10.2026):** **Kein neues Feld im Lernplan, Ableitung im Build.** Alte IDs behalten ihre Art (Lernstand und Gewohnheit); neue Stichpunkte bekommen die Art aus den Aufgabentypen ihrer Teilaufgaben (Zuordnung): diagramm → Zeichnen, berechnen → Rechnen, code_schreiben/text → Schreiben, wenn dieser Typ mindestens die Hälfte der Teilaufgaben stellt, sonst Wissen (`artAusTypen` in `tools/vorschau-ap1.mjs`, Test). So bleibt die Art aus den Prüfungen abgeleitet und muss nicht von Hand gepflegt werden. Ergebnis AP1: AP1-2-3-3 Schreiben, AP1-3-2-4, AP1-4-2-4, AP1-6-1-5 Rechnen, die übrigen 14 Wissen. Gilt in Schritt 7 für alle Räume. | erledigt |
| P28 | **Wichtigkeit im neuen Lernplan** (gefunden bei der Vorschau AP1): Die Marke „Top-Thema/Häufig …“ rechnet die Vorschau aus den zugeordneten Teilaufgaben (je Prüfung einmal, aktueller Katalog 1, alter 0,6); der frühere Punkte-Zuschlag fehlt, weil der Lernplan keine Punkte enthält (Punkte stehen nur in den lokalen Abschriften). Soll die Wichtigkeit so bleiben, Punkte bekommen oder sich nach der Stufe richten? **Entschieden (Claude im Auftrag des Projektinhabers, 14.10.2026):** **Bleibt so.** Punkte stehen nur in den lokalen Abschriften (E10) und kämen ins öffentliche Repo nur über die Zuordnung – das lohnt nicht, denn die Häufigkeit über Prüfungstermine sagt mehr als Punkte einer einzelnen Aufgabe. Die Stufe misst Tiefe, nicht Häufigkeit; beides zu mischen machte die Marke unklar. | erledigt |
| P29 | **Idee aus der Vorschau (Projektinhaber, 14.10.2026), noch nicht umgesetzt:** „Das musst du können“ im Stichpunkt-Detail einklappbar machen, schön gestaltet (z. B. zugeklappt mit Anzahl der Aussagen und Hinweis auf neue ohne Karten), weil die Liste sonst viel Platz im Block einnimmt. Bei der endgültigen Übernahme (Schritt 7) mitbauen. **Entschieden (Claude im Auftrag des Projektinhabers, 14.10.2026):** **Ja, so umsetzen**: zugeklappt mit Anzahl der Aussagen und Zahl neuer Aussagen ohne Karten, aufgeklappt wie bisher; Zustand je Gerät gemerkt. Gebaut wird es in Schritt 7, nicht jetzt, weil die Vorschau-Oberfläche parallel in einer anderen Sitzung bearbeitet wird. **Umgesetzt 16.10.2026 (Schritt 7).** | erledigt |
| P30 | **Aktueller Rechts- und Technikstand als Kür** (aus der Gegenprüfung): R2 erlaubt Kür nur aus festgelegten Hinweisquellen. **Entschieden (Projektinhaber, 14.10.2026): ja**, die Gegenprüfung zählt als Hinweisquelle (`gegenpruefung:2026-10`). Umgesetzt: E-Rechnung (AP1-3-1-6), BFSG (AP1-4-3-2), EuGH 2025 zu Pseudonymen (AP1-7-5-2). | erledigt |
| P31 | **Eine Teilaufgabe, eine Aussage** (aus der Gegenprüfung): Dieselbe Teilaufgabe soll nicht zweimal als eigene Können-Aussage in verschiedenen Stichpunkten stehen. **Entschieden (Projektinhaber, 14.10.2026): ja.** Ausnahme: Beide Stellen bleiben, wenn sonst die Tiefe eines Bausteins im Ordner (T8) oder eine Geschwister-Seite (R4) fehlt. | erledigt |
| P32 | **Prüfungstechnik ist keine Können-Aussage** (aus der Gegenprüfung): „Rechenweg aufschreiben“, „runden“, „zwei Nachkommastellen“. **Entschieden (Projektinhaber, 14.10.2026): ja**, gestrichen (AP1-3-1-2-K5, AP1-8-2-3-K5); als Prüfungstipp später in Lernprompt oder Hilfe. | erledigt |
| P33 | **ID-Schema PB1 (Entscheidung Projektinhaber, 14.10.2026):** Neue IDs nach dem AP1-Muster mit PB1 vorne: Ordner `PB1-1`, Themenblock `PB1-1-1`, Stichpunkt `PB1-1-1-1`, Können-Aussage `PB1-1-1-1-K1`. Ordner nach E8 so, wie es sich gut lernen lässt, verankert in den Gebieten `G.PB1.*`. Die alten AP2-IDs (`AP2-x-…`) werden nicht weiterverwendet und nie neu vergeben. In `alt_neu` wird jede alte AP2-Können-Aussage einsortiert, die PB1 betrifft: verschoben (neue PB1-ID), angepasst oder gestrichen; was nach PB2 gehört, wird als „PB2“ vermerkt und dort später einsortiert. Die Umzugstabelle ist zugleich der Lernstand-Umzug (P6) für AP2. | erledigt |
| P34 | **Quellenlücken sind endgültig (Projektinhaber, 14.10.2026):** Weitere Prüfungen, Lösungen oder Belegsätze gibt es nicht; gearbeitet wird nur mit dem, was in `quellen/` liegt. Betroffen: 2025H unvollständig, 2025H/2026F ohne Lösungshinweise, 2026H nur nicht amtliche (P14); 2024W und 2025W ohne Belegsatz; 2025W-PB2 nur Lösungshinweise ohne Aufgabensatz. Regeln dafür (Claude im Auftrag des Projektinhabers): (1) Fehlt der Belegsatz, wird die Teilaufgabe aus Aufgabentext und Lösungshinweis zugeordnet; keine Lücke im Lernplan. (2) Fehlt die Musterlösung, prüft K1 gegen Katalog und Aufgabentext (wie bei P16 für 9 AP1-Teilaufgaben). (3) Fehlt der Operator (2025W-PB2), belegt die Teilaufgabe nur das Thema: Bausteine werden zugeordnet, die Tiefe kommt aus dem Katalog bzw. anderen Belegen, Z3 hebt nichts an (wie `nur_punkt`). Wird beim Bau von PB2 umgesetzt. | erledigt |
| P35 | **Fragen aus der unabhängigen Prüfung PB1** (`umbau/berichte/PB1-pruefer-bilanz.md`). **Entschieden (Claude im Auftrag des Projektinhabers, 14.10.2026):** (1) Tiefe Netzwerk/Betrieb: keine pauschale Obergrenze (P10); Stufe 4 ohne Beleg wird auf die Katalogstufe gesenkt, wo der Operator es nicht trägt. (2) Versionsverwaltung: Anwenden bleibt PROJEKT (P9); Zweck, Begriffe (Commit, Branch, Merge) und begründeter Einsatz bleiben in PB1, weil 2021W-PB1-A1-c ihn verlangt (E6). (3) Fachrichtungsvermerke im Katalog („FI DV/FI SI“) sind Grenzen nach E7; für AE wird das Thema Außen. (4) „Tiefer“ nach E2 heißt **mehr Inhalt**: Eine höhere Stufe mit derselben Liste wie in AP1 ist doppelt; die PB1-Aussage entfällt, der AP1-Stichpunkt wird per `baut_auf` importiert. Bleibt sie für T8 nötig, wird sie auf das wirklich Neue gekürzt. (5) Was nur als betriebliche Handlung im Katalog steht, ist Kür (P26), auch gegen eine G3-Grenze. (6) Recht: E-Rechnung ist Kern (ZB.erechnung, Beleg 2025W), Aufbewahrungsfristen Kern (Katalog AP2b.05.01.1), BFSG Kür (P30). (7) Fachlich falsche amtliche Lösungen: Die Aussage bleibt fachlich richtig; am Stichpunkt steht ein `hinweis`, was die IHK-Lösung erwartet hat. (8) Notation aus dem Belegsatz (UML, ER, vorgegebene Fremdtexte) gilt als **vorgegeben** (B4): anwenden, nicht auswendig. (9) Stichpunkte ohne Beleg werden nicht gestrichen (E6), aber auf das Nötige gekürzt, mindestens 3 Aussagen (F3). Dazu: Kür, die wörtlich im Katalog steht, ist Kern (Last-/Performancetest, BLOB, Geokoordinaten). | erledigt |

| P36 | **Doppelungen technisch verhindern (aus der Prüfung PB2, Frage 1).** **Entschieden (Projektinhaber, 16.10.2026; Ausgestaltung Claude):** E2 wird streng durchgesetzt, und zwar per Skript statt nur per Text. T7 in `tools/umbau/lernplan-pruefen.mjs`: (1) Eine Können-Aussage, die nur Bausteine früherer Räume betrifft, braucht das Feld `neu` = `{ gegenueber: [<baut_auf-ID>], was: "<was hier neu ist>" }`, sonst Fehler – das bisherige Schlupfloch „ein Beleg dieses Raums macht sie neu“ entfällt. (2) Ohne Beleg dieses Raums muss sie zudem tiefer gehen als der frühere Raum. (3) Ein importierter Baustein steht nur in `bausteine`, wenn eine Aussage mit `neu` ihn betrifft; sonst genügt `baut_auf`. „Neu“ heißt mehr Inhalt, nicht nur höhere Stufe (P35 Nr. 4). Vergessen zwischen AP1 und AP2 fängt die Wiederholung der AP1-Karten auf, nicht eine zweite Fassung. | erledigt |
| P37 | **Gruppenwechsel / Nachbarelemente vergleichen** (2023S-PB2-A3-ab, 2024W-PB2-A1, 2022S-PB2-A1): wohnt in **PB2-1** (Programmlogik); PB2-3 verweist nur für die Fehlersuche darauf. Entschieden (Projektinhaber, 16.10.2026). | erledigt |
| P38 | **„kennen“ bei Algorithmen** (binäre/lineare Suche, Sortierverfahren): Prinzip erklären (Stufe 2) gehört dazu, Herkunft `regel:P-NAECHSTE-STUFE` (kleiner Zusatzaufwand, sonst G3). Entschieden (Projektinhaber, 16.10.2026). | erledigt |
| P39 | **Reihenfolge der SQL-Ordner:** Abfragen vor Datenpflege – die bisherigen Ordner PB2-5 (Tabellen, Datenpflege, Rechte) und PB2-6 (Abfragen) tauschen Platz und IDs (F5: Grundlagen vor Anwendung). Entschieden (Projektinhaber, 16.10.2026). | erledigt |
| P40 | **Vorgegebenes relationales Modell lesen** (ca. 20 Punkte je PB2-Prüfung rund um ein gegebenes Tabellenmodell): eigener Übungs-Stichpunkt im SQL-Abfrage-Ordner, `baut_auf` auf das Tabellenmodell in PB1, `neu` = Schlüssel und JOIN-Pfade für Abfragen finden. Entschieden (Projektinhaber, 16.10.2026). | erledigt |
| P41 | **SQL-Dialekte in IHK-Lösungen** (`SELECT … INTO`, `[Alias]`, `"Text"`, `UPDATE … FROM … JOIN`): gelernt wird Standard-SQL wie im Katalog-Anhang; Dialekte stehen als Grenze, am Stichpunkt ein `hinweis`, was die IHK-Lösung zeigt und dass es dort anerkannt wurde (wie P35 Nr. 7). Entschieden (Projektinhaber, 16.10.2026). | erledigt |
| P42 | **STDDEV, VARIANCE, CORR** (SQL-Auszug im Anhang, in keiner Prüfung): Vorschlag war Kür; wegen P24/P35 („was der Katalog-Anhang zeigt, ist Pflicht“) als **kurze Kern-Aussage auf niedriger Stufe** (erkennen und mit dem Auszug anwenden, B4). Entschieden (Projektinhaber, 16.10.2026, Angleichung an P24 durch Claude). | erledigt |
| P43 | **Kleine Stichpunkte** (unter 3 Aussagen nach den Prüfer-Vorschlägen, z. B. PB2-1-1-4, PB2-3-1-2): auflösen und in den passenden Nachbar-Stichpunkt einbauen (F3). Entschieden (Projektinhaber, 16.10.2026). | erledigt |
| P44 | **2025W-PB2-A3-ba** (Aufgabentext fehlt, P34): Die Testdaten gelten als **vorgegeben** (B4, „anwenden, nicht auswendig“). Entschieden (Projektinhaber, 16.10.2026). | erledigt |
| P45 | **Abnahme PB1 und PB2 (Projektinhaber, 16.10.2026):** Freigabe im Vertrauen auf Skripte und unabhängige KI-Prüfer; eine fachliche Stichprobe (M1/M2) kann der Projektinhaber als Lernender noch nicht leisten. Funde beim späteren Lernen werden wie Prüfer-Funde behandelt: an der Ursache korrigieren (E4), Raum neu prüfen, Export neu erzeugen und spätere Räume gegenprüfen. PB1 und PB2 sind damit eingefroren (E3). | erledigt |
| P46 | **Stufe der WiSo-Aufgaben** (Bau WISO): „eintragen“ ist in WiSo fast immer nur die Antwortform; nach Z3a hätte jede Auswahlaufgabe Stufe 3. **Entschieden (Projektinhaber, 16.10.2026): Stufe aus dem Aufgabentyp** (Z3b, Regelwerk v1.8): Auswahl, Zuordnung, Reihenfolge 2, Eintrag 1, Rechnen 3 (auch Zuordnungstyp `berechnen`). Die Stufe bestimmt nur die Form der Aussage, nicht wie viel gelernt wird. | erledigt |
| P47 | **WiSo-Bausteine, die ein früherer Raum schon lehrt** (IT-Sicherheit WISO.03.08, Ergonomie, Matrix, Planungstechniken …). **Entschieden (Projektinhaber, 16.10.2026): Deckungstabelle** `umbau/regeln/wiso-deckung.json` (Z5). Nach der unabhängigen Prüfung (Claude, Regel der Tabelle): nur vollständig gedeckte Bausteine; WISO.03.08.2, WISO.03.08.4 und WISO.02.03.3 herausgenommen und als WiSo-Bausteine mit `neu` gegenüber AP1 gelehrt; WISO.03.08.6 um AP1-7-1-4 ergänzt. Stand: 10 Bausteine. | erledigt |
| P48 | **IDs in WiSo.** **Entschieden (Projektinhaber, 16.10.2026): ID-Erhalt wie AP1 (P15).** Übernommene und angepasste Stichpunkte und Aussagen behalten ihre alte ID, neue bekommen die nächste nie vergebene Nummer; eine Lücke in der Nummerierung (z. B. kein Themenblock WISO-5-1) ist gewollt. | erledigt |
| P49 | **R3 ohne Hinweisquellen für WiSo** (Bau WISO). Der IT-Berufe-Podcast nennt für die WiSo-Termine 2021–2026 keine Schlagworte, die Community-Lernzettel lagen nicht vor; `meta.hinweisabgleich` ist deshalb leer, es gibt keine Kür. Die Prüfer schlugen Kür vor, die ohne Hinweisquelle nicht zulässig ist (R2): MoPeG/eGbR (WISO-2-2-1), Pflichtangaben in geschäftlichen E-Mails (WISO-5-2-2), GS-Zeichen-Details, Sicherheitsbeauftragte ab 20 Beschäftigten, CO2 in kleinen Räumen, Löschmittel-Tabelle und Brandklasse F, Ergonomie-Maße (WISO-3), Grüner Punkt (WISO-4), Steuerklasse VI, Pflege-Abschlag für Eltern, elektronisches Ausbildungszeugnis (WISO-1). **Vorschlag:** wie P30 die unabhängige Prüfung als Hinweisquelle zulassen (`pruefer:wiso-2026-10`) und diese Punkte als Kür eintragen; die Lernzettel bei Gelegenheit nachreichen und R3 nachholen. **Entschieden (Projektinhaber, 16.10.2026): ja.** Wie P30 gilt die unabhängige Prüfung als Hinweisquelle `pruefer:wiso-2026-10` (in `meta.hinweisquellen` jedes WiSo-Ordners). Die Kür-Vorschläge der Prüfer stehen als `kuer` am Stichpunkt und im Hinweis-Abgleich (`meta.hinweisabgleich.themen`, Ring Kür). Rechtsstand Oktober 2026, das elektronische Ausbildungszeugnis an § 16 BBiG nachgeprüft. **Nachtrag (Projektinhaber, 16.10.2026):** Community-Lernzettel zu WiSo gibt es nicht; R3 für WiSo ist damit abgeschlossen (Hinweisquellen: Podcast ohne WiSo-Schlagworte, unabhängige Prüfung). | erledigt |
| P50 | **Amtliche Lösungen, die durch eine Rechtsänderung falsch geworden sind** (Bau WISO): 2022W-WISO-A14 wertet „Auszubildende bis 27 dürfen die JAV wählen“ als falsch – seit dem Betriebsrätemodernisierungsgesetz (2021) gibt es für Auszubildende keine Altersgrenze mehr; 2024S-WISO-A22 (anmeldepflichtiges Kartell, Rechtslage vor 2005); 2022S-WISO-A24 (UVV „aushängen“, seit DGUV Vorschrift 1 auch elektronisch); 2022S-WISO-A13 (Tarifvorrang). Umgesetzt wie P35 Nr. 7: Aussage nach Rechtsstand, `hinweis` mit der IHK-Erwartung. **Vorschlag:** P35 Nr. 7 ausdrücklich auch für Rechtsänderungen nach der Prüfung festschreiben. **Entschieden (Claude im Auftrag des Projektinhabers, 16.10.2026): ja.** P35 Nr. 7 gilt auch, wenn eine amtliche Lösung erst durch eine spätere Rechtsänderung falsch geworden ist (oder die Rechtslage schon zum Prüfungstermin anders war): Die Aussage folgt dem Rechtsstand, der `hinweis` am Stichpunkt nennt die IHK-Erwartung und den Grund. Begründung: Gelernt wird für die kommende Prüfung, und die IHK bewertet nach aktuellem Recht; ein `hinweis` verhindert, dass alte Lösungen verwirren. Die vier Fälle sind schon so umgesetzt. | erledigt |
| P51 | **Quellen früherer Räume fehlten beim Bau von WISO.** Angehängt waren nur Katalog und WiSo-Abschriften; die Prüfskripte für AP1, PB1 und PB2 (Abschriften, Zuordnung) liefen deshalb nicht, 24 Tests wurden übersprungen. Geprüft wurde gegen die eingefrorenen Exporte (`umbau/export/`), was für E2/T7 genügt. Geändert wurde an früheren Räumen nur `umbau/umzug.json` (Werkzeugfehler, Schritt 6 WISO). **Vorschlag:** keine Maßnahme; eine Sitzung, die frühere Räume ändert, bekommt deren Abschriften. **Zur Kenntnis genommen (Projektinhaber, 16.10.2026):** keine Maßnahme. | erledigt |
| P52 | **Abnahme WISO** (wie P45). Der Lernplan ist gebaut, unabhängig geprüft und eingebaut; die App zeigt ihn mit Hinweis „noch nicht abgenommen“. Nach der Abnahme: `abgenommen: true` in `RAEUME_VORSCHAU.WISO`, Export `umbau/export/WISO.json` (E3), Generatoren `tools/umbau/gen-wiso/` nicht mehr laufen lassen. **Entschieden (Claude im Auftrag des Projektinhabers, 16.10.2026): abgenommen**, wie P45 im Vertrauen auf Skripte und unabhängige KI-Prüfer, nachdem die Kür nach P49 eingetragen ist und alle Prüfungen erneut grün sind. Umgesetzt: `abgenommen: true` in `RAEUME_VORSCHAU.WISO`, Export `umbau/export/WISO.json` (E3), Generatoren `tools/umbau/gen-wiso/` stillgelegt. Funde beim Lernen wie P45. | erledigt |
| P53 | **Raum PROJEKT (Schritt 8) zurückgestellt (Projektinhaber, 16.10.2026):** bewusst jetzt nicht bauen, weil die betriebliche Projektarbeit noch weit in der Zukunft liegt. Später wieder aufnehmen, zusammen mit P8 (Vorgaben der IHK Rheinhessen). Bis dahin beginnt keine Sitzung von sich aus mit Schritt 8. | zurückgestellt |
---

## 9. Fundament erzeugen und prüfen

Lokale Quellen (nicht im Repo, werden der Sitzung angehängt):

```
quellen/katalog.md                  aus der Word-Fassung (pandoc, siehe unten)
quellen/pruefungen/ap1/<ID>_AP1.md  Prüfungsabschriften, z. B. 2024H_AP1.md
quellen/pruefungen/pb1/<Termin>_AP2-PB1.md   z. B. 2025W_AP2-PB1.md (pb2 entsprechend)
quellen/pruefungen/wiso/<Termin>_WISO.md     z. B. 2025W_WISO.md
quellen/lernzettel/*.pdf            Community-Lernzettel (nur Material)
quellen/rahmenlehrplan/*.pdf        Rahmenlehrplan KMK 13.12.2019 (P5)
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
node tools/umbau/pruefungen-pruefen.mjs pb1   # dasselbe für PB1 (pb2 entsprechend) → umbau/fundament/pruefungen-pb1.json
npm run umbau:zuordnung   # T2 + goldene Regel, berechnet die belegte Tiefe (belege-ap1.json)
node tools/umbau/lernplan-pruefen.mjs AP1-6   # prüft einen Ordner des neuen Lernplans (auch R3, R4), schreibt umbau/berichte/AP1-6.md
node tools/umbau/lernplan-pruefen.mjs AP1-1
node tools/umbau/raum-pruefen.mjs AP1         # prüft T1, T2b, T8 über alle Ordner des Raums, schreibt umbau/berichte/AP1-raum.md
node tools/umbau/pruefungen-pruefen.mjs wiso  # WiSo-Abschriften → umbau/fundament/pruefungen-wiso.json
node tools/umbau/zuordnung-pruefen.mjs wiso   # T2 + Z3b, schreibt umbau/fundament/belege-wiso.json
node tools/umbau/export-raum.mjs WISO --pruefen  # WISO ist eingefroren (P52); Generatoren gen-wiso/ stillgelegt
node tools/umbau/raum-pruefen.mjs WISO        # T1, T2b, T8, ALT, Deckung P47
node tools/umbau/umzug-erzeugen.mjs           # Lernstand-Umzug aller gebauten Räume
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
| Lernplan PB1 (P33) | Ordner `PB1-1`, Themenblock `PB1-1-1`, Stichpunkt `PB1-1-1-1`, Können `PB1-1-1-1-K1` |
| Anhang | `ANH.sql-syntax-auszug` |

Die IDs ändern sich nur, wenn sich der Katalog ändert. Die Bausteindatei wird nie von Hand bearbeitet.
