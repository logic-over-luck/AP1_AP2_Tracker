# Prompt für eine zweite KI: Ideen zur Wichtigkeit

Alles unterhalb der Linie in eine andere KI kopieren. Der Prompt ist in sich vollständig, die KI braucht keinen Zugriff aufs Repo.

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

**Wackeltest:** jeweils eine Prüfung weglassen. Anteil der Stichpunkte, die dabei die Stufe wechseln:

| Raum | 3 Stufen | 4 | 5 | 6 | 8 |
|---|---|---|---|---|---|
| AP1 | 37 % | 59 % | 73 % | 77 % | 77 % |
| PB1 | 37 % | 53 % | 61 % | 62 % | 62 % |
| PB2 | 41 % | 45 % | 55 % | 59 % | 59 % |
| WiSo | 31 % | 40 % | 51 % | 63 % | 63 % |

Bei 5 Stufen springen nur 3–10 % um mehr als eine Stufe.

## Aktueller Vorschlag

- **5 Stufen je Stichpunkt**, nur aus Prüfungen (geglättet): Sehr oft geprüft (ab 40 %), Oft (ab 25 %), Manchmal (ab 12 %), Selten (über 0 %), Nie geprüft.
- Zeichen **„unsicher“**, wenn der Stichpunkt im Wackeltest die Stufe wechselt.
- Zeichen **„Grundlage für X Stichpunkte“** (Fundament). Es zählt nicht für die Stufe, nur für die Lernreihenfolge.
- **Block:** ein farbiger Punkt je Stichpunkt. **Themenbereich:** „x % des Prüfungsgewichts“ plus Balken.
- **Empfehlung „Heute im Fokus“:** Block mit dem wichtigsten offenen Stichpunkt zuerst; bei Gleichstand Grundlagen zuerst.
- **Regel:** Ein Signal geht nur in die Stufe ein, wenn es im Rückwärtstest besser abschneidet als „nur Prüfungen“.

## Rahmenbedingungen

- Mehr Prüfungen gibt es nicht. Die Datenmenge bleibt klein.
- Prüfungstexte sind urheberrechtlich geschützt und kommen nicht ins Repo. Nur IDs und eigene Stichworte sind erlaubt.
- Alles muss nachrechenbar sein (Prüfskript, Tests). Keine Werte, die nur geschätzt sind.
- Der Projektinhaber hat Sorge, zu prüfungsnah zu lernen statt das Fach zu verstehen.
- Für AP1 gilt seit 2025 ein neuer Prüfungskatalog. Alte AP1-Prüfungen sagen die neuen kaum vorher (AUC 0,57).

## Was ich von dir möchte

1. **Kritik:** Wo ist der Vorschlag schwach oder statistisch falsch? Ist AUC bei 2–4 Testprüfungen überhaupt aussagekräftig? Sind die Gewichte 1 / 0,6 vertretbar?
2. **Mit wenig Daten umgehen:** Welche Verfahren eignen sich für 8–11 Prüfungen? Zum Beispiel Bayes-Glättung, hierarchische Modelle, Konfidenzintervalle, Bootstrap. Wie wähle ich die Glättungsstärke ohne Überanpassung?
3. **Neue Signale:** Was außer Prüfungshäufigkeit könnte Wichtigkeit messen und trotzdem prüfbar bleiben? Denk an Aufgabentyp, Tiefe, Katalogänderungen, Abhängigkeiten, Kombinationen mit anderen Themen, Fehleranfälligkeit beim Lernen.
4. **Darstellung:** Bessere Namen für die 5 Stufen? Wie zeige ich Unsicherheit, ohne zu verwirren? Wie fasse ich Block und Themenbereich zusammen?
5. **Lernreihenfolge:** Wie verbinde ich Prüfungswahrscheinlichkeit, Fundament und meinen Lernstand zu einer guten Empfehlung „Was lerne ich als Nächstes?“

Antworte gegliedert nach diesen 5 Punkten. Mach je Punkt konkrete, umsetzbare Vorschläge mit Formel oder Regel, und sag dazu, wie man sie mit den vorhandenen Daten prüfen könnte.
Wenn du etwas nicht sicher weißt, sag das.
