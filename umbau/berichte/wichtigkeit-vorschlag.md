# Vorschlag: Wichtigkeit neu – 5 Stufen je Stichpunkt

Stand: 17.10.2026 · Status: **Vorschlag, nicht umgesetzt** · Zahlen aus den **alten, noch nicht neu geprüften** Zuordnungen
(`umbau/zuordnung/<raum>/*.json`). Endgültige Grenzen erst nach der Prüfung mit den neuen Abschriften.

---

## 1. Ausgangslage – was heute schiefläuft

Die Wichtigkeit wird heute **je Block** angezeigt (Top-Thema / Häufig / Gelegentlich / Selten), relativ zum wichtigsten Block
des Raums (`src/daten/index.js`). Die Stichpunkte darunter haben schon eine eigene Stufe, sie wird aber nirgends gezeigt.

| Befund (AP1) | Zahl |
|---|---|
| Blöcke, deren Stichpunkte unterschiedliche Stufen haben | 29 von 31 |
| Stichpunkte in „Top-Thema“-Blöcken, die **nie** geprüft wurden | 9 von 48 |
| Top- oder Häufig-Stichpunkte, die in „Gelegentlich“- oder „Selten“-Blöcken stecken | 12 |
| Nie geprüfte Stichpunkte, die wegen des Lernfeld-Ersatzgewichts (D7) als „Gelegentlich“ gelten | 21 (PB1: 20) |

Folge: Die Block-Marke ist ein Durchschnitt und verdeckt genau die Ausreißer.

---

## 2. Was die Daten hergeben – drei Tests

### 2.1 Rückwärtstest: Welche Signale sagen die nächste Prüfung vorher?

Wichtigkeit nur aus den **älteren** Prüfungen berechnet, dann geprüft, ob sie die **neuesten** vorhergesagt hätte
(AP1: 2025F–2026H, sonst 2025S und 2025W). Wert = Wahrscheinlichkeit, dass ein später geprüfter Stichpunkt vor einem nicht
geprüften liegt (0,50 = Zufall, 1,00 = perfekt).

| Variante | AP1 | PB1 | PB2 | WiSo |
|---|---|---|---|---|
| Nur Prüfungen | 0,57 | 0,76 | **0,78** | 0,69 |
| Prüfungen, geglättet mit dem Themenbereich | **0,58** | **0,78** | 0,77 | **0,72** |
| Nur Themenbereich | 0,55 | 0,74 | 0,67 | 0,67 |
| Nur Fundament (wird von anderen vorausgesetzt) | 0,54 | 0,68 | 0,55 | 0,51 |
| Nur Lehrplan (Lernfeld-Stunden) | 0,46 | 0,59 | 0,50 | 0,41 |
| Mischung 50 % Prüfungen / 25 % Fundament / 25 % Lehrplan | 0,56 | 0,77 | 0,77 | 0,65 |

Ergebnisse:
- **Prüfungen sind das beste Signal.** Glätten hilft leicht (+0,01 bis +0,03).
- **Lernfeld-Stunden haben keine Vorhersagekraft.** Sie fliegen raus, außer als letzter Gleichstandsbrecher.
- **Fundament sagt die Prüfung kaum vorher.** Beigemischt macht es die Stufe schlechter. Es ist trotzdem nützlich, aber für eine andere Frage (Abschnitt 3.4).
- **AP1: Alte Prüfungen sagen die neuen kaum vorher (0,57).** Wahrscheinliche Ursache ist der neue Katalog ab 2025. Rangfolgen in AP1 sind deshalb unsicher.

Einschränkung: Getestet wurde mit nur 2–4 Testprüfungen je Raum. Das reicht, um schlechte Signale zu erkennen, aber nicht zum Feinabstimmen.

### 2.2 Wackeltest: Wie viele Stufen tragen die Daten?

Jeweils eine Prüfung weglassen und neu rechnen. Gezählt wird der Anteil der Stichpunkte, die dabei die Stufe wechseln.

| Raum | 3 Stufen | 4 Stufen | **5 Stufen** | 6 Stufen | 8 Stufen |
|---|---|---|---|---|---|
| AP1 | 37 % | 59 % | **73 %** | 77 % | 77 % |
| PB1 | 37 % | 53 % | **61 %** | 62 % | 62 % |
| PB2 | 41 % | 45 % | **55 %** | 59 % | 59 % |
| WiSo | 31 % | 40 % | **51 %** | 63 % | 63 % |

Bei 5 Stufen springen aber nur **3–10 %** um **mehr als eine** Stufe. Die meisten Wechsel gehen in die Nachbarstufe.
Deshalb ist 5 vertretbar, wenn unsichere Stichpunkte als „unsicher“ markiert werden. 8 Stufen bringen gegenüber 5 nichts mehr.

### 2.3 Fundament – was das Andocken zeigt

- 101 von 292 Stichpunkten werden von mindestens einem anderen vorausgesetzt (Feld `baut_auf`).
- **16 Stichpunkte wurden nie geprüft, sind aber Grundlage für andere.** Beispiele: „Relationales Modell“ (PB1-6-1-2, Grundlage für 4) und „Bausteine eines Programms“ (AP1-8-2-1, Grundlage für 2).
- Das Feld wurde für etwas anderes angelegt (E2: Was baut ein späterer Raum auf einem früheren auf?). Abhängigkeiten **innerhalb** eines Raums sind kaum erfasst, WiSo hat keine.

---

## 3. Vorschlag

### 3.1 Fünf Stufen je Stichpunkt

Maß: **Anteil der Prüfungen des Raums**, in denen der Stichpunkt vorkam. Jede Prüfung zählt höchstens einmal. Nach aktuellem Katalog zählt sie 1, nach altem Katalog 0,6 (Abschnitt 3.5).
Der Anteil wird mit dem Themenbereich geglättet (Abschnitt 3.2).

| # | Name | Grenze (vorläufig) | heißt | AP1 | PB1 | PB2 | WiSo |
|---|---|---|---|---|---|---|---|
| 1 | **Sehr oft geprüft** | ab 40 % | in mehr als jeder 3. Prüfung | 8 | 9 | 12 | 26 |
| 2 | **Oft geprüft** | ab 25 % | etwa jede 4. Prüfung | 29 | 13 | 2 | 14 |
| 3 | **Manchmal geprüft** | ab 12 % | etwa jede 8. Prüfung | 44 | 10 | 2 | 8 |
| 4 | **Selten geprüft** | über 0 % | ein-, zweimal, meist alter Katalog | 16 | 17 | 5 | 6 |
| 5 | **Nie geprüft** | kein Beleg | steht nur im Katalog, kann trotzdem kommen | 27 | 27 | 1 | 16 |

Farben: Rot → Orange → Gelb → Grau. „Nie geprüft“ wird als leerer Kreis gezeigt.
Feste Grenzen statt fester Anteile je Stufe. Das ist ehrlicher, weil eine Stufe auch leer bleiben darf.
WiSo hat viele Stichpunkte in Stufe 1, weil jede WiSo-Prüfung 30 Fragen zu fast allen Themen stellt. Das ist kein Fehler der Grenzen.

### 3.2 Glätten

> geglättete Quote = (eigene Treffer + k × Quote des Themenbereichs) / (Prüfungen + k), Vorschlag k = 4

Ein Stichpunkt mit wenigen Belegen wird zum Durchschnitt seines Themenbereichs gezogen, denn der Themenbereich hat mehr Daten.
Das Glätten wirkt nur innerhalb der Prüfungsdaten, es mischt kein fremdes Signal hinein. Den Wert für k legt der Rückwärtstest fest (k = 2 und k = 4 schnitten gleich ab).

### 3.3 Zusatzzeichen (keine Stufe)

- **„unsicher“**: Der Stichpunkt wechselt im Wackeltest die Stufe.
- **„Grundlage für X Stichpunkte“**: Fundament aus `baut_auf` und den Gegenstücken.
- Beim Drüberfahren immer die genauen Zahlen: „Oft geprüft · in 3 von 11 Prüfungen, zuletzt 2026F“.

### 3.4 Wo es auftaucht

| Ebene | Anzeige |
|---|---|
| Stichpunkt | farbiger Punkt vor dem Titel; in den Details die volle Marke mit Namen und Zahlen |
| Block | ein Punkt je Stichpunkt, sortiert (`● ● ◐ ○ ○`), statt einer Durchschnittsmarke |
| Themenbereich | „19 % des Prüfungsgewichts“ plus ein schmaler Balken in den Stufenfarben |
| „Heute im Fokus“ und neue Lernkarten | zuerst der Block mit dem wichtigsten **offenen** Stichpunkt; bei Gleichstand Grundlagen zuerst (Fundament), dann mehr offener Prüfungswert |
| Menü „Nachschlagen“ → **„Wichtigkeit“** | Legende: 5 Stufen mit Farbe, Grenze und Erklärung; Anzahl Stichpunkte je Stufe im Raum (aufklappbar, mit Sprung in den Lernplan); Datenbasis (Prüfungen, davon aktueller Katalog, Gewichtung); wie Block und Themenbereich zusammengefasst werden |

Der Abschnitt „Wichtigkeit“ in der Hilfe wird gekürzt und verweist auf die neue Seite.

### 3.5 Geprüft rechnen

1. **Geprüfte Datenbasis:** Jede Teilaufgabe aus den neuen Abschriften wird blind neu einem Stichpunkt zugeordnet und mit der alten Zuordnung verglichen. Strittige Fälle entscheidet ein dritter Durchgang mit Begründung, sie stehen im Bericht.
   Der Podcast dient nur als Gegenprobe. Nur bei einer fehlenden Abschrift (Rest von 2025H, P14) zählt er mit halbem Gewicht.
2. **Gewicht alter Prüfungen:** Die pauschalen 0,6 sind gesetzt, nicht begründet. Prüfen lässt sich das so: Jede alte Teilaufgabe wird gegen den aktuellen Katalog abgeglichen. Unverändert ergibt 1,0, geändert 0,5, gestrichen 0.
   Diese Regel kommt nur hinein, wenn sie im Rückwärtstest besser abschneidet als die 0,6. Für AP1 liegt die Änderungsliste vor (Podcast #190). Für PB1, PB2 und WiSo fehlt der alte Katalog, dort bleibt es bei 0,6 mit dem Vermerk „ungeprüft“.
3. **Regel für neue Signale:** Ein Signal geht nur in die Stufe ein, wenn es im Rückwärtstest besser abschneidet als „nur Prüfungen“.
4. **Prüfskript** `npm run umbau:wichtigkeit`: rechnet alles aus den Zuordnungsdateien neu und führt Rückwärtstest und Wackeltest aus. Es bricht ab bei einer Teilaufgabe ohne Zuordnung oder Begründung und bei einer Stufe, die von der Neuberechnung abweicht.
5. **Tests mit Hand-Beispielen.** Beispiel: „Peripheriegeräte und Anschlüsse“ (AP1) kam in 2022F und 2024F (je 0,6) sowie in 2025F und 2026F (je 1) vor. Das sind 3,2 von 8,2, also 39 %, und damit „Oft geprüft“.
6. **Bericht als Tabelle:** jeder Stichpunkt mit Stufe, Anteil, Prüfungsliste, „unsicher“ und Fundament, damit jede Stufe nachrechenbar ist.

Punkte zählen nicht (P28). Die Tiefe (Stufe 1–4 der Können-Aussagen) bleibt getrennt, weil sie misst, *wie gut*, nicht *wie wichtig*.

---

## 4. Ablauf

1. Vorschlag abstimmen (Namen, Grenzen, Anzeige). Ideen einer zweiten KI einholen (Prompt: `wichtigkeit-prompt-extern.md`).
2. Zuordnung mit den neuen Abschriften prüfen (Abschnitt 3.5, Punkt 1) und den Katalog-Abgleich für AP1 machen (Punkt 2).
3. Prüfskript, Tests und Bericht schreiben. Rückwärtstest und Wackeltest auf den geprüften Daten wiederholen und die Grenzen festlegen.
4. App umbauen: Stufen, Punkte, Prozent, Menü „Wichtigkeit“.
5. UMBAU.md (neuer Parkplatz-Eintrag, ersetzt P28 teilweise) und STAND.md nachführen.

## 5. Offene Fragen

- Sind die Grenzen 40 / 25 / 12 richtig? Erst nach Schritt 3 festlegen.
- Soll AP1 nur die 4 Prüfungen nach aktuellem Katalog stärker gewichten, weil die alten kaum vorhersagen?
- Soll das Fundament später um Abhängigkeiten innerhalb eines Raums ergänzt werden? Das wäre neue inhaltliche Arbeit.
- Verträgt sich das mit P54 („zu prüfungsnah“)? Die Stufe misst bewusst nur Prüfungsnähe. „Nie geprüft“ heißt nicht „unwichtig fürs Fach“.
