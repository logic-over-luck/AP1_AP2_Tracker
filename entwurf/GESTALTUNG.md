# Design-Entwurf AP1: Gestaltungsentscheidungen

Öffnen: `entwurf/ap1-entwurf.html` per Doppelklick (kein Server, nichts aus dem Internet).
Neu bauen nach Änderungen an Vorlage oder Inhaltsdatei: `python3 entwurf/bauen.py`.

Unten in der Mitte sitzt die Entwurfsleiste. Sie gehört nicht zum Design. Damit schaltest du
zwischen Lernseite und Bausteinen und zwischen den drei Stilrichtungen um.

## Gemeinsam in allen drei Richtungen

- Leiste links 112 px, Inhaltsspalte überall 66rem breit (`scrollbar-gutter: stable`, damit nichts springt)
- Lernseite: oben die acht Oberordner als Auswahl (4 × 2, mit Fortschrittsbalken), darunter nur der
  gewählte Ordner. Ein Wechsel blendet kurz über.
- Je Themenblock eine Karte. Kopf: Status, Titel, „x von y“, Lernkarten (noch ohne Funktion), Pfeil zum
  Zuklappen. Inhalt links die Stichpunkte mit Häkchen und Info-Symbol, rechts ein Feld von 20rem mit der
  Kurzinfo zum gewählten Stichpunkt und darunter der Wiederholung (1x / 2x / 3x) für den ganzen Block.
  Unter 960 px rückt das rechte Feld unter die Liste.
- Kurzinfo: Titel, Art, Rahmen in einem Satz, 2–4 Können-Stichworte, Knöpfe. Schrift eine Stufe kleiner.
  Die Texte kommen aus `Kurzfassung_AP1_AP2_tracker.json`. Fehlt sie, kürzt `bauen.py` als Platzhalter
  und die Seite zeigt den Hinweis „Automatisch gekürzt“.
- Häkchen stehen in einer eigenen Spalte; alle Stichpunkttitel einer Karte beginnen an derselben Kante
- Zwei Knopfarten: Primär (gefüllt, Akzent) und Sekundär (Rand)
- Eine Kartenart, eine Eckenrundung, eine Schrift, vier Schriftgrößen
- Eine Übergangsdauer je Richtung für alles (Aufklappen, Häkchen, Balken, Hover); längere Effekte sind Vielfache davon
- Art des Stichpunkts wird nur angezeigt, wenn sie nicht „Wissen“ ist (Rechnen, Zeichnen, Schreiben)

## A · Notizbuch (zurückhaltend)

| | |
|---|---|
| Grundeinheit | 8 px; Abstände 8 / 16 / 24 / 32 / 48 / 64 |
| Schrift | Serif aus dem System: Charter, Sitka Text, Cambria, Georgia |
| Schriftgrößen | 14 / 16 / 20 / 28 px; Etiketten in Kapitälchen |
| Farben | Grund #15171a, Leiste #111316, Fläche #1c1f23, Linie #2b2f35, Text #e6e3dc, gedämpft #a1a5ad, blass #686d76, Akzent #8fb3d9 (Tintenblau) |
| Eckenrundung | 4 px |
| Übergänge | 220 ms, weich auslaufend (`cubic-bezier(.2,.7,.2,1)`) |
| Spiel | Häkchen zeichnet sich, Zahl zählt; kein Rang im Kopf; Rangaufstieg: Ring zeichnet sich ruhig |
| Karten | nur Haarlinie, keine Fläche; Status als Ring; Kurzinfo blendet mit 4 px Hub über |

## B · Konsole (mittel)

| | |
|---|---|
| Grundeinheit | 4 px; Abstände 4 / 12 / 20 / 28 / 40 / 56 |
| Schrift | Monospace aus dem System: Cascadia Mono, Consolas, SF Mono, Menlo |
| Schriftgrößen | 13 / 14 / 16 / 22 px; Etiketten klein mit `//` |
| Farben | Grund #0f100d, Leiste #0b0c09, Fläche #171812, Linie #2e3026, Text #e2dfcf, gedämpft #9d9a89, blass #67654f, Akzent #e8a33d (Bernstein) |
| Eckenrundung | 0 px |
| Übergänge | 120 ms, linear; Balken und Häkchen in Stufen (`steps`) |
| Spiel | gestrichelte Linien, Segmentbalken, Cursor am Titel, `rang=hello_world` im Kopf; Rangaufstieg als Terminalausgabe |
| Karten | Fläche mit Linie, Stand als `[2/4]`, Status als Füllbalken in Stufen; gewählter Ordner und Stichpunkt mit Akzentstrich; Kurzinfo blendet ohne Bewegung über |

## C · Level (deutlich)

| | |
|---|---|
| Grundeinheit | 8 px; Abstände 8 / 16 / 24 / 40 / 56 / 80 |
| Schrift | technische Grotesk aus dem System: Bahnschrift, DIN Alternate, Avenir Next, Segoe UI |
| Schriftgrößen | 13 / 15 / 20 / 32 px; Etiketten in Versalien |
| Farben | Grund #0f111a, Leiste #0b0d14, Fläche #171a26, Linie #272b3c, Text #eceef7, gedämpft #a3a8bf, blass #646a84, Akzent #5fe0b0 (Minze) mit leichtem Schein |
| Eckenrundung | 12 px |
| Übergänge | 300 ms; Flächen weich, Abzeichen und Häkchen federnd (`cubic-bezier(.34,1.56,.64,1)`) |
| Spiel | Ordner als Karten, „+1“ beim Abhaken, Glanz über dem Balken, Sechseck-Abzeichen, Rang-Chip im Kopf; Rangaufstieg mit Funken |
| Karten | Fläche ohne Linie, rechtes Feld als eingelassene Fläche; Status-Ring mit Schein und Plopp; Kurzinfo gleitet 12 px von rechts herein |

## Spätere Akzentfarben (im Prüfungsmenü als Punkte zu sehen)

| Richtung | AP1 | AP2 | WiSo |
|---|---|---|---|
| Notizbuch | #8fb3d9 | #c4a3d6 | #a6c79a |
| Konsole | #e8a33d | #5fb6d9 | #d9786a |
| Level | #5fe0b0 | #ff8a78 | #ffcf5c |
