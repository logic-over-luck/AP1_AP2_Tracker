# Zweitmeinung zur Wichtigkeit – Antwort und Bewertung

Stand: 17.10.2026 · Gehört zu `wichtigkeit-vorschlag.md` (Fassung 1 bewertet, Fassung 2 arbeitet die Ergebnisse ein).

**Herkunft:** Antwort einer zweiten KI auf `wichtigkeit-prompt-extern.md`. Sie gehört nach eigener Aussage wahrscheinlich zur selben Modellfamilie
wie die KI, die den Vorschlag geschrieben hat. Sie ist also **keine unabhängige** Meinung. Eine unabhängige Meinung steht noch aus (Modell eines anderen Anbieters).

---

## Teil A: Bewertung

Die Antwort ist eine gute, ehrliche Kritik. Die meisten Einwände gegen Fassung 1 treffen zu. Eine Vermutung (1d) und eine erwartete Wirkung (Beta-Regel)
haben die Nachrechnung nicht bestanden. Teil 5 ist für eine Lern-App überdimensioniert.

| Punkt | Urteil | Begründung |
|---|---|---|
| 1a Glätten zieht alle gleich stark | ✅ stimmt | Alle Stichpunkte eines Raums haben dieselbe Prüfungszahl N. |
| 1b Glätten widerspricht Stufe 5 | ✅ stimmt | Geglättet ist nichts mehr 0. Auch das Hand-Beispiel rechnete roh. |
| 1c AUC-Unterschiede sind Rauschen | ✅ stimmt | Standardfehler etwa 0,055 nach Hanley-McNeil, nachgerechnet. Auch der Unterschied Lernfeld gegen Prüfungen ist in AP1 nicht sicher. |
| 1d AP1 misst nur den Katalogwechsel | ❌ widerlegt | Eine neue Prüfung weglassen, aus allen übrigen vorhersagen: AUC 0,55 (alte Prüfungen zählen 0), 0,59 (Gewicht 0,6), 0,59 (Gewicht 1). AP1 streut wirklich. |
| 1e Wackeltest zu streng | ✅ stimmt | Wechsel je Lauf 12–24 % statt 51–73 %, weniger als 80 % stabil sind 25–41 %. |
| 1f Gewicht 1 / 0,6 schätzbar | ⚠️ ja, aber dünn | Für AP1 nur 4 Läufe. Ein gemeinsames Gewicht für PB1, PB2 und WiSo ist vernünftig. |
| 1g Zuordnung von Stufe 5 gezielt prüfen | ✅ übernommen | |
| 1h Breite der Stichpunkte | ✅ in den Bericht | nicht behebbar |
| 2 Beta-Regel für „unsicher“ | ❌ **getestet und verworfen** | Markiert 40–72 % der Stichpunkte, und zwar alle in den mittleren Stufen, aber keinen oben oder unten. Die Unsicherheit ist breiter als eine Stufe, die Markierung sagt also nichts über den Stichpunkt. Ersatz: plausibler Bereich je Stichpunkt (80-%-Intervall). |
| 2 Signale vorher festlegen, Aufnahmeregel | ✅ übernommen | |
| 2 rollierender Test, Log-Loss, Bootstrap über Prüfungen | ✅ übernommen | |
| 3 Katalogänderung, Rotation, Tiefe | ✅ als vorab festgelegte Kandidaten | Bei AP1 ist „nicht entscheidbar“ wahrscheinlich. |
| 3 Aufgabentyp für die Übungsform | ✅ übernommen | |
| 4 „Bisher nicht geprüft“, natürliche Häufigkeiten | ✅ übernommen | |
| 4 Farben | ✅ übernommen | `--fehler` ist rot, deshalb eine Farbe mit Füllgrad. |
| 4 Block „in x von N Prüfungen dran“ | ⚠️ nur als Zusatzzahl | Große Blöcke liegen damit automatisch hoch. |
| 4 Themenbereich als Anteil der Teilaufgaben (1/m) | ✅ übernommen | |
| 5 Fundament über den Wert der Abhängigen | ✅ übernommen | λ = 0,5 offen als Setzung |
| 5 Abdeckungskurve | ✅ übernommen | |
| 5 Vergessenskurve, Beherrschung je Aussage, Wert pro Aufwand | ❌ nicht übernommen | zu viele nicht prüfbare Stellschrauben; Beherrschung je Aussage misst die App nicht direkt |
| 5 jede 4. Empfehlung aus dem Fachkern | 💬 Entscheidung des Projektinhabers | Designfrage zu P54 |

### Nachrechnungen (alte Zuordnungen)

**1d – AP1, eine der 4 neuen Prüfungen weglassen, aus allen übrigen vorhersagen (AUC):**

| Gewicht alter Prüfungen | Mittel | 2025F | 2025H | 2026F | 2026H |
|---|---|---|---|---|---|
| 0 | 0,55 | 0,67 | 0,54 | 0,56 | 0,44 |
| 0,6 | 0,59 | 0,64 | 0,52 | 0,63 | 0,55 |
| 1 | 0,59 | 0,61 | 0,52 | 0,64 | 0,57 |

**1e – Wackeltest, 5 Stufen (40 / 25 / 12):**

| Raum | Wechsel je Lauf | Stabilität unter 80 % | Sprung über mehr als 1 Stufe |
|---|---|---|---|
| AP1 | 17 % | 25 % | 10 % |
| PB1 | 13 % | 36 % | 8 % |
| PB2 | 12 % | 27 % | 5 % |
| WiSo | 24 % | 41 % | 3 % |

**Beta-Regel – markiert, wenn P(wahre Quote in der gezeigten Stufe) < 50 %:**

| Raum | Stufen 1/2/3/4/5 | markiert je Stufe (Jeffreys) | gesamt Jeffreys | gesamt Gleichverteilung |
|---|---|---|---|---|
| AP1 | 8/29/44/16/27 | 0/29/44/0/0 | 59 % | 72 % |
| PB1 | 9/13/10/17/27 | 0/13/10/17/0 | 53 % | 53 % |
| PB2 | 12/2/2/5/1 | 0/2/2/5/0 | 41 % | 41 % |
| WiSo | 26/14/8/6/16 | 0/14/8/6/0 | 40 % | 40 % |

---

## Teil B: Antwort der zweiten KI (Wortlaut)

### 1. Kritik

**a) Die Glättung wirkt anders, als 3.2 sagt.**
Alle Stichpunkte eines Raums werden über dieselben Prüfungen beobachtet, haben also dasselbe N. Damit gilt:

```
geglättet = N/(N+k) · eigene Quote + k/(N+k) · Bereichsquote
```

Jeder Stichpunkt wird **gleich stark** zum Bereich gezogen. Mit k = 4 und N = 8,2 (AP1) sind das 33 %. Innerhalb eines Themenbereichs ändert sich die Reihenfolge gar nicht, nur über Bereiche hinweg. Der Satz „Ein Stichpunkt mit wenigen Belegen wird stärker gezogen“ stimmt also nicht. Gezogen wird alles gleich stark, nur dass niedrige Werte steigen und hohe sinken. Inhaltlich ist das eine Mischung „Prüfung + Themenbereich“ mit festem Gewicht, kein echtes Bayes-Glätten. Das ist nicht falsch, sollte aber so beschrieben werden.

**b) Stufe 5 und die Glättung widersprechen sich.**
Ein nie geprüfter Stichpunkt bekommt geglättet 4·q/(N+4) > 0. Er landet also rechnerisch mindestens in „Selten“, in einem heißen Themenbereich sogar in „Manchmal“. Entscheide dich für eine von zwei Lösungen:
- Stufe aus dem geglätteten Wert, dazu „bisher nicht geprüft“ als **Zeichen**, nicht als Stufe. Das empfehle ich.
- Oder Stufe 5 aus den Rohdaten und Stufe 1–4 aus dem geglätteten Wert. Das ist dann aber offen eine gemischte Regel.

Auch das Hand-Beispiel in 3.5 Punkt 5 rechnet roh (3,2 / 8,2 = 39 %), nicht geglättet. Der Test sollte den Wert prüfen, den die App wirklich zeigt.

**c) Die AUC-Unterschiede sind Rauschen.**
Bei etwa 30 geprüften und 90 nicht geprüften Stichpunkten liegt der Standardfehler einer AUC um 0,75 bei etwa 0,055 (Hanley-McNeil). Das 95-%-Intervall ist also rund ±0,11. Weil die Stichpunkte einer Prüfung nicht unabhängig sind, ist es in Wahrheit noch breiter. Unterschiede von 0,01 bis 0,03 („Glätten hilft leicht“) lassen sich so nicht belegen. Belastbar ist nur die grobe Aussage: Prüfungen sind klar besser als Lernfeld-Stunden.

Besser:
- **Rollierender Rückwärtstest:** Prüfung t aus allen Prüfungen vor t vorhersagen, für jedes t ab der 4. Prüfung. Bei AP1 sind das 8 Testläufe statt 4. Die Läufe vor und nach dem Katalogwechsel getrennt auswerten.
- **Paarweiser Vergleich** zweier Varianten auf denselben Testprüfungen und Bootstrap **über Prüfungen**, nicht über Stichpunkte.
- **Log-Loss oder Brier-Score zusätzlich zur AUC.** Die AUC misst nur die Reihenfolge. Deine Stufen versprechen aber feste Häufigkeiten („in mehr als jeder 3. Prüfung“). Das ist eine Aussage über die Treffsicherheit der Werte selbst, und die prüft die AUC nicht. Einfache Probe: Von den Stichpunkten mit Vorhersage ≥ 40 %, wie viele kamen in der zurückgehaltenen Prüfung wirklich dran?

**d) Die AP1-AUC von 0,57 misst den Katalogwechsel, nicht das Signal.**
Gelernt wurde nur aus Prüfungen nach altem Katalog, getestet nur auf Prüfungen nach neuem Katalog. Die Frage für die Zukunft ist aber eine andere: Wie gut sagen 4 neue plus 7 alte Prüfungen die nächste neue vorher? Testen lässt sich das, indem man jeweils eine der 4 neuen Prüfungen weglässt (Abschnitt 2).

**e) Der Wackeltest ist zu streng gezählt.**
Wenn 73 % der AP1-Stichpunkte als „unsicher“ markiert werden, sagt das Zeichen nichts mehr. Wahrscheinlich zählt „wechselt in irgendeinem der 11 Läufe“. Berichte lieber die **mittlere Wechselquote je Lauf** und die **Stabilität je Stichpunkt** (Anteil der Läufe mit gleicher Stufe). Grundproblem: Eine AP1-Prüfung mit Gewicht 1 verschiebt die Quote um bis zu 12 Prozentpunkte (1 / 8,2). Das ist so groß wie die Abstände zwischen den Grenzen. Die Stufen sind deshalb in Wahrheit „Anzahl gewichteter Treffer“ in Prozent verkleidet.

**f) Die Gewichte 1 / 0,6** sind als Startwert vertretbar, aber schätzbar statt gesetzt (Abschnitt 2).

**g) „Nie geprüft“ hängt am stärksten an der Zuordnung.**
Eine einzige übersehene Zuordnung schiebt einen Stichpunkt von Stufe 5 nach 4. Das spricht für deinen blinden Zweitdurchgang. Werte bei der Prüfung gezielt die Stufe-5-Stichpunkte aus: Gibt es wirklich keine Teilaufgabe dazu?

**h) Wie breit ein Stichpunkt geschnitten ist, verzerrt die Stufe.**
Breite Stichpunkte werden öfter „getroffen“. Wurden Stichpunkte nach dem Lesen der Prüfungen gebildet, ist das zusätzlich zirkulär. Das kannst du nicht ganz beheben, solltest es aber im Bericht nennen.

### 2. Mit wenig Daten umgehen

**Gewicht alter Prüfungen schätzen statt setzen:**
```
p_s(w) = (Treffer_neu + w·Treffer_alt + k·q_A) / (N_neu + w·N_alt + k)
```
Für w ∈ {0; 0,2; …; 1}: Jede neue Prüfung einmal weglassen, sie aus dem Rest vorhersagen und den Log-Loss summieren. Nimm das w mit dem kleinsten Fehler. Bei AP1 sind das 4 Läufe. Bei PB1, PB2 und WiSo (je 2 neue Prüfungen) ist das zu wenig. Schätze dort **ein gemeinsames w für alle drei Räume**.

Alternative mit einem Parameter: Alterung `Gewicht = δ^(Jahre seit Prüfung)`. Sie wird genauso geschätzt und kommt nur hinein, wenn sie besser abschneidet als die Katalogregel.

**Glättungsstärke k ohne Überanpassung:**
- Raster k ∈ {0, 1, 2, 4, 8, 16}, Auswahl nach Log-Loss mit „eine Prüfung weglassen“, **gemeinsam über alle Räume** (ein k statt vier).
- Gegenprobe mit Beta-Binomial (empirisches Bayes): α und β je Themenbereich per Maximum-Likelihood aus den Trefferzahlen schätzen, dann ist k = α + β. Liegen beide Wege ähnlich, ist k belastbar.
- Die Bereichsquote q_A ohne den Stichpunkt selbst rechnen. Das ist ein kleiner Effekt, aber sauberer.

**Unsicherheit statt Wackeltest-Zeichen:**
Je Stichpunkt die Beta-Verteilung Beta(Treffer + k·q_A, N − Treffer + k·(1−q_A)). Markiere ihn nur dann als unsicher, wenn **P(wahre Quote liegt in der gezeigten Stufe) < 50 %** ist. Das ist eine geschlossene Formel und wird im Prüfskript vorberechnet, nicht in der App. Erwartung: deutlich weniger als 73 % markiert, und die Markierung bedeutet dann etwas.

**Regeln gegen das Durchprobieren:**
Lege die Liste der Kandidaten-Signale fest, **bevor** du sie testest, und schreibe sie ins Repo. Ein Signal kommt nur hinein, wenn es den Log-Loss in mindestens 3 von 4 Räumen senkt **und** das Bootstrap-Intervall der Verbesserung nicht 0 enthält. Bei 10 Prüfungen findest du sonst immer irgendetwas, das zufällig gut aussieht.

### 3. Neue Signale

Sortiert nach meiner Erwartung. Jedes Signal mit Test:

| Signal | Regel | Test |
|---|---|---|
| **Katalogänderung (AP1)** | neu im Katalog 2025 / geändert / unverändert | Trefferquote der neuen Bausteine in 2025F–2026H gegen unveränderte, nie geprüfte. Ist sie klar höher, gehören neue Bausteine nicht in „Nie geprüft“, sondern bekommen ein Zeichen „neu im Katalog“. |
| **Pause/Rotation** | Kam der Stichpunkt in der letzten Prüfung dran? | Quote in Prüfung t bei „in t−1 dran“ gegen „nicht dran“. Wechseln die Prüfer die Themen durch, kommt ein Abschlag hinein, sonst nicht. |
| **Tiefe (Katalog 3–4)** | höchste Tiefe der Können-Aussagen | logistische Regression mit Treffer als Zielgröße, Tiefe und geglätteter Quote als Eingang. Nur aufnehmen, wenn die Tiefe über die Quote hinaus etwas erklärt. |
| **Aufgabentyp** | Anteil „berechnen / zeichnen / Code“ | **Nicht für die Stufe**, sondern für die Übungsform: Bei solchen Stichpunkten reichen Lernkarten nicht, es braucht Übungsaufgaben. |
| **Gemeinsames Auftreten** | Welche Stichpunkte kommen in einer Szenario-Aufgabe zusammen? | nicht für die Stufe, sondern für Lernpakete („lerne X mit Y“). Prüfbar mit Zählung über die Zuordnungen. |
| **Eigene Fehlerquote** | Anteil falsch beantworteter Können-Aussagen | gehört in die Reihenfolge (Abschnitt 5), nie in die Stufe |

Eine Idee am Rand, nur wenn sie vorab auf die Liste kommt: Lernfeld-Stunden **je Stichpunkt** (Stunden geteilt durch Anzahl Stichpunkte im Lernfeld). Die AUC unter 0,5 könnte daran liegen, dass große Lernfelder auf viele Stichpunkte verteilt sind. Ich halte das für wenig aussichtsreich.

### 4. Darstellung

- **Die Namen sind gut**, weil sie die Vergangenheit beschreiben („geprüft“) und nichts versprechen. Das passt auch zu P54. Zwei Änderungen:
  - „Nie geprüft“ → **„Bisher nicht geprüft“**. „Nie“ klingt endgültig.
  - Als Hauptzahl **natürliche Häufigkeiten** zeigen: „in 3 von 11 Prüfungen, zuletzt 2026F“. Die gewichteten Prozente (39 % von 8,2) wirken genauer, als sie sind, und gehören nur in die Details.
- **Unsicherheit:** keine eigene Marke, sondern der Punkt halb gefüllt oder mit „~“. Im Tooltip: „Kann auch ‚Manchmal‘ sein, zu wenig Daten“. Falls die App „unsicher“ schon für deinen Lernstand nutzt, ein anderes Wort nehmen, zum Beispiel „Datenlage dünn“.
- **Farben:** Rot steht in Lern-Apps oft für „falsch“. Prüfe, ob das mit deinen Lernstand-Farben kollidiert. Sicherer ist **eine Farbe in Abstufungen** plus Füllgrad (● ◕ ◑ ◔ ○). Das funktioniert auch bei Farbschwäche.
- **Block:** Punkte je Stichpunkt sind gut bis etwa 6 Stichpunkte, darüber ein schmaler gestapelter Balken. Dazu eine echte Kennzahl statt Durchschnitt: **„In 7 von 11 Prüfungen kam etwas aus diesem Block dran.“** Das ist direkt aus den Zuordnungen zählbar. Nicht als 1 − Π(1 − p) rechnen: Das setzt Unabhängigkeit voraus und übertreibt.
- **Themenbereich:** „x % des Prüfungsgewichts“ genau festlegen, zum Beispiel als Anteil der Teilaufgaben, bei Mehrfachzuordnung je 1/m. Dazu dieselbe Kennzahl „in x von N Prüfungen dran“.

### 5. Lernreihenfolge

**Formel:**
```
Wert(s)  = p_s · (1 − m_s)                                  # eigener offener Prüfungswert
         + λ · Σ_{t baut auf s} p_t · (1 − m_t)             # was s freischaltet
Prio(s)  = Wert(s) / offene_Aussagen(s)                     # Wert pro Aufwand
```
- **p_s** = geglättete Prüfungsquote
- **m_s** = Beherrschung: Anteil bestätigter Können-Aussagen, mit Vergessen `m_s · 0,5^(Tage seit Wiederholung / H)`. H verdoppelt sich nach jeder erfolgreichen Wiederholung (wie beim Leitner-System).
- So zählt das Fundament über den **Prüfungswert dessen, was darauf aufbaut**, nicht als bloße Anzahl. Ein Stichpunkt, auf dem drei selten geprüfte Stichpunkte aufbauen, zählt weniger als einer, auf dem ein Top-Thema aufbaut.

**Feste Regeln zusätzlich:**
1. **Sperre:** Ist eine Voraussetzung r von s noch schwach (m_r < 0,5), wird zuerst r empfohlen.
2. **Verstehen-Anteil (gegen P54):** Jede 4. Empfehlung kommt aus dem Bereich „Fachkern“ (bisher nicht geprüft, aber Grundlage, oder Tiefe 3–4). Das ist eine offene Designentscheidung und keine versteckte Gewichtung.
3. **λ ehrlich als Setzung:** zum Beispiel 0,5, in den letzten 4 Wochen vor der Prüfung linear auf 0. λ lässt sich nicht aus Prüfungsdaten schätzen, das sollte im Bericht auch so stehen.

**Prüfbar über eine Abdeckungskurve:**
Ordne die Stichpunkte nach der Empfehlung und lege die zurückgehaltene Prüfung daneben. Welcher Anteil ihrer Teilaufgaben ist nach 10, 20, 30 … gelernten Stichpunkten abgedeckt? Vergleiche die Fläche unter der Kurve für: Zufall, Katalogreihenfolge, nur p, p plus Fundament. Das Fundament wird hier wahrscheinlich etwas verlieren. Die ehrliche Frage ist dann: **Kostet „Grundlagen zuerst“ weniger als zum Beispiel 5 % Abdeckung?** Wenn ja, ist die Entscheidung gut begründet.

### Was ich sicher, was ich unsicher weiß
- **Sicher:** dass beim Glätten alle gleich stark gezogen werden (1a), der Widerspruch bei Stufe 5 (1b), die Größe des AUC-Standardfehlers (1c) und dass die Stufen faktisch Trefferzahlen sind (1e).
- **Unsicher:** ob Pause/Rotation und Katalogänderung wirklich etwas bringen. Das zeigt erst der Test. Die 73 % kann ich nicht nachrechnen, ohne zu wissen, wie genau gezählt wurde.
