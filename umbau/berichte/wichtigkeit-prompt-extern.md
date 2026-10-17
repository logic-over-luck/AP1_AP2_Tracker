# Prompt für eine zweite KI: Ideen zur Wichtigkeit

Alles unterhalb der Linie in eine andere KI kopieren. Der Prompt ist in sich vollständig, die KI braucht keinen Zugriff aufs Repo.

**Wichtig:** Für eine unabhängige Meinung den Prompt in ein Modell eines **anderen Anbieters** geben. Die erste Zweitmeinung
(`wichtigkeit-zweitmeinung.md`) stammt wahrscheinlich aus derselben Modellfamilie wie der Vorschlag. Stand des Prompts: Fassung 2 des Vorschlags.

---

Du bist Experte für Lerndesign, Prüfungsvorbereitung und für Statistik bei kleinen Datenmengen. Ich brauche eine kritische
zweite Meinung und neue Ideen. Antworte auf Deutsch.

## Worum es geht

Ich mache eine Umschulung zum Fachinformatiker für Anwendungsentwicklung (IHK) und baue mir eine Lern-App. Sie läuft offline als eine HTML-Datei.
Der Lernstoff ist so gegliedert:

**Raum** (Prüfungsteil) → **Themenbereich** → **Block** → **Stichpunkt** (das, was ich abhake) → **Können-Aussagen** (3–10 je Stichpunkt)

| Raum | Prüfungsteil | Stichpunkte | ausgewertete Prüfungen | davon nach aktuellem Katalog |
|---|---|---|---|---|
| AP1 | Abschlussprüfung Teil 1 | 124 | 11 (2021–2026) | 4 |
| PB1 | AP2 „Planen eines Softwareproduktes“ | 76 | 9 | 2 |
| PB2 | AP2 „Entwicklung und Umsetzung von Algorithmen“ | 22 | 9 | 2 |
| WiSo | Wirtschafts- und Sozialkunde | 70 | 8 | 2 |

Jede Teilaufgabe jeder alten Prüfung ist einem oder mehreren Stichpunkten zugeordnet. Daraus soll eine **Wichtigkeit** je Stichpunkt
entstehen: Wie wahrscheinlich kommt das in der nächsten Prüfung dran, und was lerne ich zuerst?

## Vorhandene Daten je Stichpunkt

- Liste der Prüfungen, in denen er vorkam. Gewicht: aktueller Katalog 1, alter Katalog 0,6. Die 0,6 ist gesetzt, nicht hergeleitet.
- Aufgabentyp der Teilaufgaben (nennen, erklären, berechnen, zeichnen, Code schreiben …)
- Katalog-Bausteine aus dem IHK-Prüfungskatalog, dazu die Tiefe der Können-Aussagen (1 Wiedergeben, 2 Verstehen, 3 Anwenden, 4 Beurteilen)
- `baut_auf`: welche Stichpunkte früherer Räume er voraussetzt (vor allem AP1 → PB1/PB2; innerhalb eines Raums kaum erfasst)
- Gegenstücke: dasselbe Thema in einem anderen Raum
- Lernfeld und dessen Stundenzahl im Rahmenlehrplan; zugeordnete Lehrbuchkapitel mit Seitenzahlen
- Punkte je Aufgabe nur lokal, nicht nutzbar
- Themen-Stichworte eines Podcasts je Prüfungstermin (nur AP1, aus denselben Prüfungen, also kein unabhängiger Beleg)

## Was ich getestet habe

**Rückwärtstest:** Wichtigkeit aus den älteren Prüfungen berechnet, dann geprüft, ob sie die neuesten vorhersagt.
Gemessen als AUC: 0,5 = Zufall, 1,0 = perfekt.

| Variante | AP1 | PB1 | PB2 | WiSo |
|---|---|---|---|---|
| Nur Prüfungen | 0,57 | 0,76 | 0,78 | 0,69 |
| Prüfungen geglättet zum Themenbereich, (Treffer + 4·Bereichsquote)/(N + 4) | 0,58 | 0,78 | 0,77 | 0,72 |
| Nur Themenbereich | 0,55 | 0,74 | 0,67 | 0,67 |
| Nur Fundament (Anzahl Stichpunkte, die darauf aufbauen) | 0,54 | 0,68 | 0,55 | 0,51 |
| Nur Lernfeld-Stunden | 0,46 | 0,59 | 0,50 | 0,41 |
| Mischung 50/25/25 (Prüfungen/Fundament/Lernfeld) | 0,56 | 0,77 | 0,77 | 0,65 |

Wichtig zur Genauigkeit: Der Standardfehler einer einzelnen AUC liegt hier bei etwa ±0,055. Unterschiede von 0,01–0,03 sind also Rauschen.
In AP1 sagt auch das Weglassen je einer der 4 neuen Prüfungen und Vorhersagen aus allen übrigen nur AUC 0,55–0,59 voraus.

**Wackeltest** (5 Stufen, Grenzen 40 / 25 / 12 %, jeweils eine Prüfung weglassen):

| Raum | Wechsel je Lauf (Mittel) | Stichpunkte mit Stabilität unter 80 % | Sprung über mehr als 1 Stufe |
|---|---|---|---|
| AP1 | 17 % | 25 % | 10 % |
| PB1 | 13 % | 36 % | 8 % |
| PB2 | 12 % | 27 % | 5 % |
| WiSo | 24 % | 41 % | 3 % |

**Verworfen nach Test:**
- Glätten zum Themenbereich: zieht alle Stichpunkte gleich stark, weil alle dieselbe Prüfungszahl haben. Der Nutzen liegt im Rauschen.
- Markierung „unsicher“ über eine Beta-Verteilung (P(wahre Quote in der gezeigten Stufe) < 50 %): Sie markiert 40–72 % der Stichpunkte, und zwar alle in den mittleren Stufen. Die Unsicherheit ist breiter als eine Stufe.

## Aktueller Vorschlag (Fassung 2)

- **5 Stufen je Stichpunkt**, nur aus Prüfungen, ohne Glättung. Gewichtete Trefferquote: aktueller Katalog 1, alter 0,6.
  Sehr oft geprüft (ab 40 %), Oft (ab 25 %), Manchmal (ab 12 %), Selten (über 0 %), Bisher nicht geprüft. Zeichen ●◕◑◔○, eine Farbe mit Füllgrad.
- **Hauptzahl** „in 4 von 11 Prüfungen, zuletzt 2026F“. Dazu ein **plausibler Bereich** „wahrscheinlich 2 bis 7 von 11“ (80-%-Intervall, Jeffreys-Prior).
- **Block:** ein Zeichen je Stichpunkt (bis 6), sonst ein Balken. **Themenbereich:** Anteil der Teilaufgaben (bei Mehrfachzuordnung 1/m).
- **Lernreihenfolge:** Reihenfolge-Wert = q_s + λ · Σ q_t über offene Stichpunkte t, die auf s aufbauen; λ = 0,5 als Setzung. Geprüft mit einer Abdeckungskurve gegen zurückgehaltene Prüfungen.
- **Prüfplan:** Signale vorher festlegen (Gewicht alter Prüfungen, Katalogänderung AP1, Pause/Rotation, Tiefe). Rollierender Rückwärtstest mit Log-Loss/Brier, Bootstrap über Prüfungen. Aufnahme nur, wenn der Log-Loss in 3 von 4 Räumen sinkt und das Intervall die 0 nicht enthält.

## Rahmenbedingungen

- Mehr Prüfungen gibt es nicht. Die Datenmenge bleibt klein.
- Prüfungstexte sind urheberrechtlich geschützt und kommen nicht ins Repo. Nur IDs und eigene Stichworte sind erlaubt.
- Alles muss nachrechenbar sein (Prüfskript, Tests). Keine Werte, die nur geschätzt sind.
- Der Projektinhaber hat Sorge, zu prüfungsnah zu lernen statt das Fach zu verstehen.
- Für AP1 gilt seit 2025 ein neuer Prüfungskatalog. Alte AP1-Prüfungen sagen die neuen kaum vorher (AUC 0,57).

## Was ich von dir möchte

1. **Kritik:** Wo ist Fassung 2 schwach oder statistisch falsch? Ist es richtig, die Glättung zu streichen? Ist der plausible Bereich die richtige Art, Unsicherheit zu zeigen?
2. **Mit wenig Daten umgehen:** Gibt es bei 8–11 Prüfungen ein besseres Vorgehen als 5 feste Stufen, zum Beispiel Stufen nach Trefferzahl statt nach Prozent? Wie wähle ich die Grenzen, ohne mich an die Daten anzupassen?
3. **Neue Signale:** Was außer Prüfungshäufigkeit könnte Wichtigkeit messen und trotzdem prüfbar bleiben?
4. **Darstellung:** Bessere Namen? Wie zeige ich Block und Themenbereich am verständlichsten?
5. **Lernreihenfolge:** Wie verbinde ich Prüfungswahrscheinlichkeit, Fundament und meinen Lernstand zu einer guten Empfehlung „Was lerne ich als Nächstes?“

Antworte gegliedert nach diesen 5 Punkten. Mach je Punkt konkrete, umsetzbare Vorschläge mit Formel oder Regel, und sag dazu, wie man sie mit den vorhandenen Daten prüfen könnte.
Wenn du etwas nicht sicher weißt, sag das.
