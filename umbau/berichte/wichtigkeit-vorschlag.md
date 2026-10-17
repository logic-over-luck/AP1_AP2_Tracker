# Vorschlag: Wichtigkeit neu – 5 Stufen je Stichpunkt (Fassung 2)

Stand: 17.10.2026 · Status: **umgesetzt (UMBAU.md P72)**, Zuordnung geprüft (P73) · Zahlen aus den **alten, noch nicht neu geprüften** Zuordnungen
(`umbau/zuordnung/<raum>/*.json`). Endgültige Grenzen erst nach der Prüfung mit den neuen Abschriften.

Fassung 2 arbeitet die Zweitmeinung ein (`wichtigkeit-zweitmeinung.md`). Die Änderungen gegenüber Fassung 1 stehen in Abschnitt 6.

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

## 2. Was die Daten hergeben

### 2.1 Rückwärtstest: Welche Signale sagen die nächste Prüfung vorher?

Wichtigkeit nur aus den **älteren** Prüfungen berechnet, dann geprüft, ob sie die **neuesten** vorhergesagt hätte
(AP1: 2025F–2026H, sonst 2025S und 2025W). Wert = AUC: Wahrscheinlichkeit, dass ein später geprüfter Stichpunkt vor einem nicht
geprüften liegt (0,50 = Zufall, 1,00 = perfekt).

| Variante | AP1 | PB1 | PB2 | WiSo |
|---|---|---|---|---|
| Nur Prüfungen | 0,57 | 0,76 | 0,78 | 0,69 |
| Prüfungen, gemischt mit Themenbereich (k = 4) | 0,58 | 0,78 | 0,77 | 0,72 |
| Nur Themenbereich | 0,55 | 0,74 | 0,67 | 0,67 |
| Nur Fundament | 0,54 | 0,68 | 0,55 | 0,51 |
| Nur Lernfeld-Stunden | 0,46 | 0,59 | 0,50 | 0,41 |
| Mischung 50/25/25 | 0,56 | 0,77 | 0,77 | 0,65 |

**Wie genau das ist:** Der Standardfehler einer einzelnen AUC liegt hier bei etwa ±0,055, das 95-%-Intervall also bei etwa ±0,11.
Belastbar ist deshalb nur das Grobe:
- In PB1, PB2 und WiSo sagen Prüfungen die nächste Prüfung klar besser vorher als Zufall und als die Lernfeld-Stunden.
- Unterschiede von 0,01–0,03, etwa ob Mischen mit dem Themenbereich hilft, sind Rauschen.
- In AP1 ist kein Signal sicher besser als Zufall.

**AP1 auch mit neuen Prüfungen schwer vorhersagbar:** Jeweils eine der 4 neuen Prüfungen weggelassen und aus **allen** übrigen vorhergesagt,
also alte und neue zusammen. Ergebnis: AUC 0,55, wenn alte Prüfungen nicht zählen, und 0,59 bei Gewicht 0,6 oder 1. Die schwache Vorhersage
in AP1 kommt also nicht nur vom Testaufbau. Die AP1-Prüfungen streuen wirklich breit.

### 2.2 Wackeltest: Wie stabil sind 5 Stufen?

Jeweils eine Prüfung weglassen und neu rechnen (Grenzen 40 / 25 / 12 %).

| Raum | Wechsel je Lauf (Mittel) | Stichpunkte, die in weniger als 80 % der Läufe ihre Stufe halten | um mehr als 1 Stufe gesprungen (irgendein Lauf) |
|---|---|---|---|
| AP1 | 17 % | 25 % | 10 % |
| PB1 | 13 % | 36 % | 8 % |
| PB2 | 12 % | 27 % | 5 % |
| WiSo | 24 % | 41 % | 3 % |

Fassung 1 hatte „wechselt in irgendeinem Lauf“ gezählt (51–73 %). Das war zu streng. Die meisten Wechsel gehen in die Nachbarstufe.

### 2.3 Unsicherheit je Stichpunkt: Beta-Regel getestet und verworfen

Getestet wurde der Vorschlag der Zweitmeinung: Für jeden Stichpunkt eine Beta-Verteilung über die wahre Quote bilden und ihn
als „Datenlage dünn“ markieren, wenn die Wahrscheinlichkeit, dass er wirklich in seiner Stufe liegt, unter 50 % liegt.

| Raum | markiert (Jeffreys-Prior) | markiert (Gleichverteilung) |
|---|---|---|
| AP1 | 59 % | 72 % |
| PB1 | 53 % | 53 % |
| PB2 | 41 % | 41 % |
| WiSo | 40 % | 40 % |

Markiert werden **alle** Stichpunkte der mittleren Stufen („Oft“, „Manchmal“), aber keiner in der obersten oder untersten.
Der Grund: Mit 8–11 Prüfungen ist die Unsicherheit eines einzelnen Stichpunkts breiter als eine ganze mittlere Stufe (13–15 Prozentpunkte).
Die Markierung sagt also nichts über den Stichpunkt, sondern nur etwas über die Breite der Stufe.
**Ergebnis: keine Markierung je Stichpunkt.** Stattdessen zeigt jeder Stichpunkt seinen plausiblen Bereich (Abschnitt 3.3), und die Legende sagt offen,
dass „Oft“ und „Manchmal“ nicht scharf trennbar sind.

### 2.4 Fundament – was das Andocken zeigt

- 101 von 292 Stichpunkten werden von mindestens einem anderen vorausgesetzt (Feld `baut_auf`).
- 16 Stichpunkte wurden nie geprüft, sind aber Grundlage für andere. Beispiele: „Relationales Modell“ (PB1-6-1-2, für 4) und „Bausteine eines Programms“ (AP1-8-2-1, für 2).
- Das Feld wurde für etwas anderes angelegt (E2). Abhängigkeiten **innerhalb** eines Raums sind kaum erfasst, WiSo hat keine.

---

## 3. Vorschlag

### 3.1 Fünf Stufen je Stichpunkt, ohne Glättung

Maß: gewichtete Trefferquote = Summe der Gewichte der Prüfungen, in denen der Stichpunkt vorkam, geteilt durch die Summe der Gewichte aller Prüfungen des Raums.
Jede Prüfung zählt pro Stichpunkt höchstens einmal. Gewicht vorläufig: aktueller Katalog 1, alter Katalog 0,6 (geprüft wird das in 3.6).

| # | Name | Grenze (vorläufig) | Zeichen | AP1 | PB1 | PB2 | WiSo |
|---|---|---|---|---|---|---|---|
| 1 | **Sehr oft geprüft** | ab 40 % | ● | 8 | 9 | 12 | 26 |
| 2 | **Oft geprüft** | ab 25 % | ◕ | 29 | 13 | 2 | 14 |
| 3 | **Manchmal geprüft** | ab 12 % | ◑ | 44 | 10 | 2 | 8 |
| 4 | **Selten geprüft** | über 0 % | ◔ | 16 | 17 | 5 | 6 |
| 5 | **Bisher nicht geprüft** | kein Beleg | ○ | 27 | 27 | 1 | 16 |

- **Keine Glättung.** Ihr Nutzen ist nicht belegt (2.1). Sie zieht alle Stichpunkte eines Raums gleich stark zum Themenbereich, weil alle dieselbe Prüfungszahl haben.
  Außerdem widerspricht sie Stufe 5, denn geglättet ist nichts mehr 0. Ohne Glättung ist jede Stufe direkt aus „in x von N Prüfungen“ nachvollziehbar.
- **Eine Farbe mit Füllgrad** statt Rot bis Grau. Rot ist in der App schon für Fehler belegt (`--fehler`), und Füllgrad funktioniert auch bei Farbschwäche.
- **„Bisher nicht geprüft“** statt „Nie geprüft“. Es beschreibt die Vergangenheit und verspricht nichts.
- Feste Grenzen, eine Stufe darf leer bleiben. Dass WiSo viele Stichpunkte in Stufe 1 hat, liegt am Prüfungsformat mit 30 Fragen und ist kein Fehler.

### 3.2 Hauptzahl: natürliche Häufigkeit

Angezeigt wird „**in 4 von 11 Prüfungen**, zuletzt 2026F“, keine Prozentzahl. Die gewichtete Quote (z. B. 39 %) steht nur in den Details und auf der Seite „Wichtigkeit“.

### 3.3 Unsicherheit: plausibler Bereich statt Markierung

Im Tooltip und in den Details steht zum Beispiel für „Peripheriegeräte und Anschlüsse“: „Wahrscheinlich in **2 bis 7 von 11** Prüfungen“.
Das ist das 80-%-Intervall der Beta-Verteilung (Jeffreys-Prior, Beta(3,2 + 0,5; 5,0 + 0,5) ergibt 20,5 % bis 61,0 %), umgerechnet auf die Prüfungszahl des Raums
und auf ganze Prüfungen gerundet. Das Prüfskript rechnet es vor, die App zeigt es nur an.
Der breite Bereich ist gewollt. Er zeigt ehrlich, wie wenig 11 Prüfungen festlegen.
Die Legende sagt offen: Mit 8–11 Prüfungen lassen sich die mittleren Stufen nicht scharf trennen. Die Stufe ist Orientierung, keine Vorhersage. Das gilt besonders für AP1.

### 3.4 Wo es auftaucht

| Ebene | Anzeige |
|---|---|
| Stichpunkt | Zeichen ●◕◑◔○ vor dem Titel; in den Details die Marke mit Namen, „in x von N Prüfungen, zuletzt …“ und dem plausiblen Bereich |
| Block | bis 6 Stichpunkte ein Zeichen je Stichpunkt, sortiert; darüber ein schmaler gestapelter Balken. Im Tooltip zusätzlich: „In 7 von 11 Prüfungen kam etwas aus diesem Block dran.“ Das ist nur eine Zusatzzahl, weil große Blöcke damit automatisch hoch liegen |
| Themenbereich | „x % der Prüfungsaufgaben“: Anteil der Teilaufgaben des Raums. Bei Mehrfachzuordnung zählt eine Teilaufgabe je Stichpunkt 1/m. Dazu der Balken in den Stufen-Zeichen |
| „Heute im Fokus“ und neue Lernkarten | nach dem Reihenfolge-Wert (3.5) |
| Menü „Nachschlagen“ → **„Wichtigkeit“** | Legende: die 5 Stufen mit Zeichen, Grenze und Erklärung; Anzahl der Stichpunkte je Stufe im Raum (aufklappbar, mit Sprung in den Lernplan); Datenbasis (Prüfungen, davon aktueller Katalog, Gewichtung); Hinweis zur Unsicherheit; wie Block und Themenbereich zusammengefasst werden |

Der Abschnitt „Wichtigkeit“ in der Hilfe wird gekürzt und verweist auf die neue Seite.

### 3.5 Fundament und Lernreihenfolge

Das Fundament geht **nicht** in die Stufe ein, sondern nur in die Reihenfolge. Gezählt wird der Prüfungswert dessen, was auf dem Stichpunkt aufbaut,
nicht nur die Anzahl:

```
Reihenfolge-Wert(s) = q_s + λ · Σ q_t   über alle offenen Stichpunkte t, die auf s aufbauen
q = gewichtete Trefferquote (3.1), λ = 0,5
```

- Zeichen am Stichpunkt: „Grundlage für X Stichpunkte“.
- **λ = 0,5 ist eine Setzung.** Aus Prüfungsdaten lässt sich λ nicht schätzen, und so steht es auch im Bericht.
- **Geprüft wird mit einer Abdeckungskurve:** Stichpunkte nach Empfehlung ordnen und daneben eine zurückgehaltene Prüfung legen. Welcher Anteil ihrer Teilaufgaben ist nach 10, 20, 30 … gelernten Stichpunkten abgedeckt?
  Verglichen werden vier Reihenfolgen: Zufall, Katalog, nur q, und q mit Fundament. „Grundlagen zuerst“ bleibt, wenn es höchstens 5 % Abdeckung kostet. Diese Grenze setzt der Projektinhaber.
- Nicht übernommen aus der Zweitmeinung: Vergessenskurve und Beherrschung je Können-Aussage. Das sind zu viele Stellschrauben, die sich nicht prüfen lassen, und die App misst Beherrschung je Aussage heute höchstens indirekt über die Lernkarten.

### 3.6 Geprüft rechnen

1. **Geprüfte Datenbasis:** Jede Teilaufgabe aus den neuen Abschriften wird blind neu einem Stichpunkt zugeordnet und mit der alten Zuordnung verglichen. Strittige Fälle entscheidet ein dritter Durchgang mit Begründung.
   **Gezielt:** Für alle Stichpunkte in „Bisher nicht geprüft“ wird nachgesehen, ob es wirklich keine passende Teilaufgabe gibt, denn eine einzige übersehene Zuordnung verschiebt die Stufe.
   Der Podcast dient nur als Gegenprobe, und bei der fehlenden Abschrift (Rest von 2025H, P14) zählt er mit halbem Gewicht.
2. **Liste der Signale vorher festlegen** (vor dem Testen ins Repo schreiben):
   - Gewicht alter Prüfungen w ∈ {0; 0,2; …; 1}. AP1 bekommt ein eigenes w, PB1, PB2 und WiSo bekommen ein gemeinsames.
   - Katalogänderung AP1 (neu, geändert, unverändert), für ein mögliches Zeichen „neu im Katalog“
   - Pause/Rotation: War der Stichpunkt in der letzten Prüfung dran?
   - höchste Tiefe der Können-Aussagen (3–4)
3. **Rückwärtstest neu:** rollierend, also Prüfung t aus allen Prüfungen vor t vorhersagen, ab der 4. Prüfung. Gemessen wird mit **Log-Loss und Brier-Score**, die AUC nur zusätzlich.
   Vergleich zweier Varianten auf denselben Testprüfungen, Bootstrap **über Prüfungen**.
   Dazu eine Probe auf Treffsicherheit: Von den Stichpunkten mit Quote ab 40 %, wie viele kamen in der zurückgehaltenen Prüfung wirklich dran?
4. **Aufnahmeregel:** Ein Signal kommt nur hinein, wenn es den Log-Loss in mindestens 3 von 4 Räumen senkt **und** das Bootstrap-Intervall der Verbesserung 0 nicht enthält.
   Bei 4 neuen AP1-Prüfungen ist „nicht entscheidbar“ ein erwartbares Ergebnis. Dann bleibt der Startwert.
5. **Prüfskript** `npm run umbau:wichtigkeit`: rechnet Stufen, Bereiche, Teilaufgaben-Anteile und Reihenfolge-Werte aus den Zuordnungsdateien neu und führt die Tests 3 und 4 aus.
   Es bricht ab bei einer Teilaufgabe ohne Zuordnung oder Begründung und bei Abweichungen zur App.
6. **Tests mit Hand-Beispielen,** gerechnet wie in der App: „Peripheriegeräte und Anschlüsse“ (AP1) kam in 2022F und 2024F (je 0,6) sowie in 2025F und 2026F (je 1) vor. Das sind 3,2 von 8,2, also 39 %, damit „Oft geprüft“. Anzeige: „in 4 von 11 Prüfungen, zuletzt 2026F“.
7. **Bericht als Tabelle:** jeder Stichpunkt mit Stufe, Quote, Prüfungsliste, plausiblem Bereich und Fundament.
   Dazu bekannte Grenzen: Wie breit ein Stichpunkt geschnitten ist, beeinflusst die Trefferzahl. Einige Stichpunkte sind nach dem Lesen der Prüfungen entstanden, was teilweise zirkulär ist.

Punkte zählen nicht (P28). Die Tiefe bleibt getrennt, solange sie die Aufnahmeregel nicht besteht. Der Aufgabentyp entscheidet über die Übungsform
(Lernkarte oder Übungsaufgabe), nicht über die Stufe.

---

## 4. Ablauf

1. Fassung 2 abstimmen. Den Prompt (`wichtigkeit-prompt-extern.md`) in ein Modell eines **anderen Anbieters** geben, für eine unabhängige Meinung.
2. Zuordnung mit den neuen Abschriften prüfen (3.6, Punkt 1) und den Katalog-Abgleich für AP1 machen.
3. Liste der Signale ins Repo schreiben, dann Prüfskript, Tests und Bericht. Rückwärtstest, Wackeltest und Abdeckungskurve auf den geprüften Daten rechnen und die Grenzen festlegen.
4. App umbauen: Stufen, Zeichen, Bereich, Block, Themenbereich, Menü „Wichtigkeit“.
5. UMBAU.md (neuer Parkplatz-Eintrag, ersetzt P28 und D7 teilweise) und STAND.md nachführen.

## 5. Entscheidungen beim Projektinhaber

- Grenzen 40 / 25 / 12 bestätigen. Endgültig erst nach Schritt 3.
- Wie viel Abdeckung darf „Grundlagen zuerst“ kosten? Vorschlag: höchstens 5 %.
- Soll jede 4. Empfehlung bewusst aus dem Fachkern kommen (bisher nicht geprüft, aber Grundlage oder Tiefe 3–4)? Das ist eine Designfrage zu P54, keine Statistik.
- Sollen Abhängigkeiten innerhalb eines Raums später ergänzt werden? Das wäre neue inhaltliche Arbeit.

## 6. Änderungen gegenüber Fassung 1

| Fassung 1 | Fassung 2 | Grund |
|---|---|---|
| Glättung mit dem Themenbereich (k = 4) | gestrichen | Nutzen nicht belegt, zieht alle gleich stark, widerspricht Stufe 5 |
| Zeichen „unsicher“ aus dem Wackeltest | plausibler Bereich je Stichpunkt und Hinweis in der Legende | Wackeltest zu streng gezählt; die Beta-Regel getestet, sie markiert alle mittleren Stufen |
| Wackeltest 51–73 % | 12–24 % je Lauf | Zählweise korrigiert |
| „Nie geprüft“ | „Bisher nicht geprüft“ | verspricht nichts |
| Rot bis Grau | eine Farbe mit Füllgrad ●◕◑◔○ | Rot ist für Fehler belegt; Farbschwäche |
| Prozent als Hauptzahl | „in x von N Prüfungen“ | Prozente wirken genauer, als sie sind |
| Themenbereich: Summe der Stichpunkt-Quoten | Anteil der Teilaufgaben (1/m) | klar definiert, keine Doppelzählung |
| Fundament: Anzahl der Abhängigen | Prüfungswert der Abhängigen, λ = 0,5 offen als Setzung | ein Top-Thema als Abhängiger zählt mehr als drei seltene |
| Rückwärtstest mit AUC | rollierend, Log-Loss/Brier, Bootstrap über Prüfungen, Signale vorher festgelegt | AUC-Unterschiede waren Rauschen |
| AP1-Schwäche = Katalogwechsel | AP1 streut auch mit neuen Prüfungen (AUC 0,55–0,59) | nachgerechnet |

## 7. Umsetzung (17.10.2026)

Der Projektinhaber hat die Entscheidung an Claude übertragen. Umgesetzt wie Fassung 2, mit diesen Festlegungen:

- Rechnung in `src/daten/wichtigkeit.js` (App, Prüfskript und Tests nutzen dieselbe Datei), Seite `src/bereiche/wichtigkeit/Wichtigkeit.jsx`.
- Prüfskript `npm run umbau:wichtigkeit` schreibt `wichtigkeit-bericht.md`. Es rechnet Stufen unabhängig aus den Lernplänen nach und bricht bei Abweichungen ab. Außerdem prüft es die Zuordnung und führt Wackeltest, rollierenden Rückwärtstest (AUC, Brier, Log-Loss, Treffer) und Abdeckungskurve aus.
- Abdeckungskurve: „Grundlagen zuerst“ (λ = 0,5) kostet höchstens 2 % (PB1), in AP1 gewinnt es 1 %. Die Grenze von 5 % ist eingehalten, λ bleibt deshalb bei 0,5.
- Treffer-Probe: Von den Stichpunkten, die nach den früheren Prüfungen „sehr oft geprüft“ waren, kamen in der nächsten Prüfung wieder dran: AP1 15 %, PB1 26 %, PB2 62 %, WiSo 54 % (Gewicht alt 0,6).
  Die Stufen beschreiben also die Vergangenheit. Die Seite „Wichtigkeit“ sagt das offen, für AP1 ausdrücklich.
- Das Lernfeld-Ersatzgewicht (D7) bleibt im Datenfeld `gewicht` (Probeprüfung), beeinflusst aber keine Stufe mehr.

## 8. Geprüfte Zuordnung (17.10.2026, P73)

Umgesetzt wie 3.6 Punkt 1, mit einer Abweichung: Die Lernpläne bleiben unverändert. Die geprüfte Zuordnung steht in einer eigenen
Datei `umbau/zuordnung/wichtigkeit.json`, aus der App und Prüfskript zählen.

| Raum | Paare einig | strittig | bestätigt | verworfen | gezählt |
|---|---|---|---|---|---|
| AP1 | 216 | 71 | 16 | 55 | 232 |
| PB1 | 108 | 19 | 4 | 15 | 112 |
| PB2 | 76 | 20 | 10 | 10 | 86 |
| WiSo | 182 | 30 | 6 | 24 | 188 |

Rückwärtstest danach (AUC, Gewicht alt 0,6): AP1 0,59 (vorher 0,57), PB1 0,72 (0,68), PB2 0,76 (0,73), WiSo 0,74 (0,74). Die Treffer-Probe
„Sehr oft“ liegt bei AP1 23 %, PB1 27 %, PB2 64 %, WiSo 55 %. Die Unterschiede liegen im Rauschen, die Richtung ist aber überall gleich oder besser.
Gewicht alter Prüfungen: 1 statt 0,6 senkt den Log-Loss nur in PB1 (und AP1 um 0,001), also nicht in 3 von 4 Räumen. Es bleibt bei 0,6.
