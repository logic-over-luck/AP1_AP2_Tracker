# Analyse P54 – Wie stark prägen die Altprüfungen den Lernplan? (16.10.2026)

Anlass: Beim Lernen mit dem Lernprompt entsteht der Eindruck, für Altprüfungen zu lernen; die Prüfungen wirken wie
ein harter Schnitt statt einer neutralen Breite und Tiefe. Frage des Projektinhabers: Haben die Regeln zu sehr
eingeschränkt?

## Kurzantwort

Ja, aber anders als gedacht. Die Regeln haben **nichts weggeschnitten**, was im Katalog steht. Sie haben die Welt
des Lernplans auf **genau zwei Quellen** begrenzt (Katalog und Altprüfungen) und dann zweimal eine **Obergrenze**
eingezogen: die Stufe des Operators (G3) und den Lernprompt („nicht tiefer als nötig“). Dazu kommt die **Form**: Die
Aussagen sind wie Prüfungsantworten geschrieben, selten mit dem Warum. Der Lernplan beantwortet sehr gut die Frage
„Was muss ich für die schriftliche Prüfung können?“, aber nicht die Frage „Was muss ich verstehen?“. Danach war bei
den Regeln nie gefragt.

## Befund in Zahlen

| | AP1 | PB1 | PB2 | WiSo |
|---|---|---|---|---|
| Können-Aussagen | 604 | 265 | 93 | 325 |
| mit Prüfungsaufgabe als Herkunft | 50 % | 44 % | 81 % | 51 % |
| **nur** aus Prüfungen (keine Katalogstelle) | 35 % | 7 % | 6 % | 0 % |
| aus Puffer-Regeln (Geschwister, nächste Stufe, Grundlage) | 9 | 0 | 4 | 6 |
| Stufe 1–2 (nennen, erklären, unterscheiden) | 62 % | 46 % | 18 % | 91 % |
| in Listenform (Aufzählung, Zuordnung) | 29 % | 40 % | 46 % | 36 % |
| mit einem Warum („weil“, „damit“, „Zweck“, „Prinzip“) | 10 % | 10 % | 13 % | 6 % |
| Grenzen | 51 | 13 | 3 | 5 |
| Kür (freiwillig, zählt nicht) | 71 | 17 | 0 | 13 |

Die Grenzen sind **nicht** der Schnitt: In AP1 verweisen 32 von 51 nur auf einen anderen Raum, in dem das Thema wohnt.

## Wo die Prüfungen abfärben – fünf Stellen

1. **Quellen (E5, R1, R2).** Was gelernt wird, ist genau Katalog ∪ Altprüfungen. Fachbücher dürfen „nie eigene Themen,
   nie Tiefe“ liefern, Lernzettel und Podcast nur Kür. Die Puffer-Regeln, die über Katalog und Prüfung hinaus öffnen
   sollten, kamen in rund 1.300 Aussagen nur 19-mal zum Einsatz. Das Fach selbst ist keine Quelle.
2. **Inhalt aus Belegen (B1, Z1).** In AP1 ist ein Drittel der Aussagen direkt aus einer Prüfungsaufgabe entstanden,
   oft mit ihrer Situation, zum Beispiel AP1-3-1-2-K2 „… auch bei jährlich wachsendem Bestand, zum Beispiel einem
   Archiv“ oder K4 „… Arbeitszeit, die wegen einer Schulung ausfällt“. Das sind Aufgaben, keine Prinzipien.
3. **Form (F6 P-MUSTER, D11).** Aussagen ohne Prüfungsbeleg werden „nach dem Aufgabentyp formuliert, den die IHK beim
   selben Operator nutzt“; in WiSo wandern die falschen Antwortmöglichkeiten in die Aussage („… erklären und von
   falschen Angaben unterscheiden“). So klingt auch das Prüfungsferne wie eine Prüfung.
4. **Obergrenze (G3, F3, P31).** „Was über die Stufe hinausgeht, gehört nicht dazu.“ Die Stufe kommt aus dem
   Operator. Damit ist „erklären“ eine Decke, kein Boden. Dazu 3–7 Aussagen je Stichpunkt und „eine Teilaufgabe,
   eine Aussage“: Das verdichtet auf die Antwort.
5. **Lernprompt (`src/bereiche/lernen/lernprompt.js`) – der stärkste Verstärker.** Er beginnt mit „Ich bereite mich
   auf die IHK-Prüfung vor“, sagt der KI „Halte dich an den Rahmen: nicht tiefer als nötig“, prüft **jede Aussage mit
   einer Prüfungsfrage**, nennt Grenzen „nicht vertiefen“ und Kür „nicht abfragen, bevor die Pflicht sitzt“, Übungen
   „im Prüfungsstil … wie ein IHK-Prüfer“, Abhaken erst, wenn alle Aussagen sitzen. Die KI unterrichtet also genau bis
   zur Kante und hört dort auf. Das ist das Gefühl vom „harten Schnitt“.

## Gut oder schlecht?

**Gut** für das Bestehen der schriftlichen Prüfung: effizient, nachprüfbar, nichts aus dem Katalog fehlt, der
Rückblick-Test (UMBAU.md 6.1) fand 0–4 von 100 Punkten auf vorher unbekannte Themen.

**Schlecht** für alles andere:
- **Brüchiges Wissen.** Wer Antwortmuster lernt, scheitert an einem neuen Blickwinkel auf ein bekanntes Thema. Genau
  das misst der Rückblick-Test nicht (6.1: „Grenze der Messung“). Verstehen überträgt sich auf neue Aufgaben.
- **Projekt und Fachgespräch (50 % der Note)** fragen fast nur nach dem Warum.
- **Beruf:** Im Betrieb zählt Verstehen, Listen schlägt man nach.
- **Motivation:** Lernen fühlt sich wie Pauken an.

Die Inhalte sind dabei nicht falsch und nicht zu schmal **für die Prüfung**. Zu eng sind die **Haltung** und die
**Form**, nicht die Fakten.

## Was man tun kann (nach Aufwand)

| | Maßnahme | Aufwand | Wirkung | Berührt |
|---|---|---|---|---|
| A | Lernprompt mit Wahl **Verstehen / Prüfung**: im Verstehensmodus erst Prinzip, Warum, Zusammenhänge und eigene Beispiele, über den Rahmen hinaus erlaubt; Prüfungsfragen erst am Ende als Check; Grenzen heißen „für die Prüfung nicht nötig“ statt „nicht vertiefen“ | klein | groß, sofort | `src/bereiche/lernen/` (bisher gesperrt) |
| B | **Verstehens-Schicht** je Stichpunkt (Schicht 5): Warum gibt es das, welches Prinzip steckt dahinter, wie hängt es mit anderen zusammen, typische Missverständnisse | mittel | groß | nur `umbau/kurz/`, Räume bleiben eingefroren |
| C | **Regelwerk v2.0:** G3 wird Prüfungsgrenze statt Lerngrenze; Fachquellen (Lehrbücher, Ausbildungsrahmenplan) als Quelle für Breite; Form nach dem Fach statt nach dem Aufgabentyp; Aussagen nur aus Prüfungen auf das Prinzip verallgemeinern | groß | am gründlichsten | alle Räume neu bauen und prüfen |

Sofort und ohne Änderung möglich: beim Kopieren des Lernprompts eine Zeile ergänzen, z. B. „Mir geht es ums
Verstehen, nicht nur um die Prüfung: Erkläre das Warum und die Zusammenhänge, gern auch über den Rahmen hinaus.
Prüfungsfragen erst am Schluss.“

**Empfehlung:** A und B. C erst, wenn die unabhängige Durchsicht mit dem Beruf als Maßstab (`build/extern/PROMPT.md`)
zeigt, dass nicht nur Form und Haltung, sondern auch Breite fehlt.
