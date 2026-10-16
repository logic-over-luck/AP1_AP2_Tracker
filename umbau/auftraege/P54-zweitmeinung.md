# Prompt für eine Zweitmeinung (P54)

Zum Kopieren in eine andere KI (am besten nicht Claude, z. B. ChatGPT oder Gemini). Alles unter der Linie einfügen.
Die KI fragt zuerst, welche Dateien sie braucht; die Links stehen im Prompt. Kann sie keine Links öffnen, die genannten
Dateien aus dem Repo herunterladen und anhängen.

---

**Schritt 1, bevor du antwortest:** Lies diesen Text und sag mir dann, **welche der Dateien unten du sehen möchtest**
(und warum). Analysiere erst, wenn du sie hast. Wenn du Links öffnen kannst, nimm sie direkt.

| Datei | Inhalt |
|---|---|
| [STAND.md](https://github.com/logic-over-luck/AP1_AP2_Tracker/blob/umbau/STAND.md) | Gedächtnis des Projekts: was die App kann, Entscheidungen, Unsicherheiten |
| [UMBAU.md](https://github.com/logic-over-luck/AP1_AP2_Tracker/blob/umbau/UMBAU.md) | Bauplan des Umbaus: Regelwerk, Tests, Parkplatz der offenen Fragen (P54 ist das Thema hier) |
| [umbau/berichte/P54-analyse.md](https://github.com/logic-over-luck/AP1_AP2_Tracker/blob/umbau/umbau/berichte/P54-analyse.md) | Analyse: wie stark die Altprüfungen den Tracker prägen |
| [umbau/berichte/P54-lehrbuch-abgleich.md](https://github.com/logic-over-luck/AP1_AP2_Tracker/blob/umbau/umbau/berichte/P54-lehrbuch-abgleich.md) | Abgleich mit den drei Lehrbüchern, Zahlen, Korrekturen |
| [umbau/berichte/P54-stufe3/](https://github.com/logic-over-luck/AP1_AP2_Tracker/tree/umbau/umbau/berichte/P54-stufe3) | je Lehrbuchkapitel: was fehlt, was bewusst weggelassen wird |
| [umbau/extern/AP1.md](https://github.com/logic-over-luck/AP1_AP2_Tracker/blob/umbau/umbau/extern/AP1.md) (ebenso PB1.md, PB2.md, WISO.md) | die Lerninhalte selbst, neutral (ohne Regel-Fachsprache) |
| [umbau/lernplan/ap1/AP1-4.json](https://github.com/logic-over-luck/AP1_AP2_Tracker/blob/umbau/umbau/lernplan/ap1/AP1-4.json) | Beispiel eines Lernplan-Ordners im Rohformat (Herkunft, Stufen, Grenzen) |
| [umbau/regeln/regelwerk.json](https://github.com/logic-over-luck/AP1_AP2_Tracker/blob/umbau/umbau/regeln/regelwerk.json) | das Regelwerk als Datendatei |
| [src/bereiche/lernen/lernprompt.js](https://github.com/logic-over-luck/AP1_AP2_Tracker/blob/umbau/src/bereiche/lernen/lernprompt.js) | wie der Lernprompt gebaut wird |

Nicht im Repo (urheberrechtlich geschützt, nur bei mir): Prüfungskatalog, Altprüfungen, Lehrbücher, Unterrichtsunterlagen.

---

Ich brauche eine **ehrliche, tiefe und kritische Zweitmeinung**. Bitte nicht zustimmen, um nett zu sein. Wenn mein Plan
schlecht ist, sag es und begründe es.

## Wer ich bin

Ich mache eine Umschulung zum **Fachinformatiker für Anwendungsentwicklung** (IHK, Deutschland, 24 Monate, bei der DAA).
Ich bin im **2. Monat**. Mein Ziel: **eine 1 als Abschlussnote und sicher im Beruf sein**. Neben dem Unterricht habe ich
etwa **20 Stunden pro Woche** zum Lernen.

Prüfungsteile: AP1 (Einrichten eines IT-Arbeitsplatzes, 20 %), AP2 mit PB1 (Planen eines Softwareprodukts, 10 %),
PB2 (Algorithmen, 10 %), WiSo (10 %), betriebliche Projektarbeit mit Präsentation und Fachgespräch (50 %).

## Was ich gebaut habe

Mit einer KI (Claude) habe ich in mehreren Wochen einen eigenen **Lern-Tracker** gebaut (eine HTML-Datei, offline):
Lernplan, Lernkarten mit Abstandswiederholung, Trainer, Probeprüfungen, Lernprompts für KI-Chats.

Die Lerninhalte habe ich danach mit einem strengen **Regelwerk** komplett neu aufgebaut („Umbau“):
- **Quellen:** offizieller IHK-Prüfungskatalog (sagt, welche Themen drankommen dürfen) und 37 abgeschriebene
  Altprüfungen (AP1 11, PB1 9, PB2 9, WiSo 8).
- **Gliederung:** Raum → Ordner → Themenblock → Stichpunkt → Können-Aussagen („Du kannst …“). Heute 4 Räume,
  274 Stichpunkte, rund 1.290 Aussagen, Lernkarten zu fast jeder Aussage.
- **Regeln:** Breite kommt aus dem Katalog (jeder Katalogpunkt muss vorkommen, per Skript geprüft). Tiefe kommt aus dem
  Operator im Katalog („nennen“ = Stufe 1 … „beurteilen“ = Stufe 4); Prüfungsaufgaben heben die Tiefe nur an, nie ab.
  Grenzen („gehört nicht dazu“) nur mit Katalogstelle. Lehrbücher waren als Quelle für Tiefe ausdrücklich
  ausgeschlossen; Lernzettel und Podcasts nur als freiwillige „Kür“.
- **Prüfung:** Skripte (Abdeckung, Tiefe, Herkunft jeder Aussage) und unabhängige KI-Prüfer je Ordner.

## Das Problem, das ich beim Lernen gemerkt habe

Beim Lernen fühlte es sich an, als lerne ich **für alte Prüfungen statt das Fach**. Der Tracker wirkt „krass getrimmt“.

Was wir dazu herausgefunden haben:
1. **Zahlen:** Rund die Hälfte der Aussagen hat eine Altprüfung als Herkunft; in AP1 sind 35 % **nur** aus Prüfungen
   entstanden (ohne Katalogstelle). Nur 6–13 % der Aussagen enthalten ein „Warum“; 29–46 % sind Listen.
2. **Ursache:** Der Katalog besteht zu 60–85 % aus bloßen Stichworten („Hardwareprodukte, z. B. CPU, Motherboard,
   Speicher“) und sagt nicht, wie tief. Diese Lücke haben die Regeln mit **Prüfungsantworten** gefüllt. Bei
   **abgeschlossenen** Themen (UML-Notation, SQL, Rechenverfahren, Gesetze) ergibt das die volle Tiefe; bei **offenen**
   Sachthemen (Hardware, Betriebssysteme, Programmierpraxis) bleiben Einzelfakten aus einzelnen Aufgaben übrig, das
   Verständnisgerüst fehlt.
3. **Der Lernprompt** (den ich in eine KI kopiere) verstärkt das: „nicht tiefer als nötig“, jede Aussage mit einer
   Prüfungsfrage prüfen, Grenzen „nicht vertiefen“.
4. **Vergleich mit dem Unterricht:** Bei Hardware fehlt im Tracker viel, was der Dozent lehrt (von Neumann, Bus,
   Chipsatz …; teils nur als „freiwillig“ markiert). Bei UML ist der Tracker gleich gut oder tiefer. Der Dozent arbeitet
   selbst mit IHK-Lösungen und dem Westermann-Lehrbuch.
5. **Lehrbuch-Abgleich:** Die drei Westermann-Bände „IT-Berufe“ (Grundstufe LF1–5, Fachstufe LF6–9, Fachstufe II
   Anwendungsentwicklung LF10–12) wurden gegen den Tracker abgeglichen: erst alle 298 Unterkapitel nach Titel, dann die
   82 auffälligen Kapitel am echten Text (das sind 32 % des Buchtexts; die übrigen, „grünen“ Kapitel wurden nicht
   gelesen). Ergebnis über 225 relevante Kapitel: **70 % reicht, 23 % fehlen 1–3 Punkte, 8 % fehlt das Gerüst**; zusammen
   rund 180 fehlende Punkte. Größte Lücken: Datenbankzugriff aus dem Programm, Datenstrukturen, Darstellung von Daten
   (Zweierkomplement, Gleitkomma, Unicode), Kommentieren/Clean Code, wie eine CPU arbeitet, Geschäfts- und
   Beschaffungsprozess, Ursachenanalyse, Datenqualität, Sicherheit im Softwareentwurf; nicht im Katalog, aber für den
   Beruf wichtig: Clean Code, Oberflächen programmieren, Dateizugriff. Die Prüfer-Vorbefunde nach Titel waren oft
   überzogen; das Buch hat selbst Fehler.

## Meine eigene Einsicht

Ich habe mehr Zeit damit verbracht, etwas Wasserdichtes zum Lernen zu bauen, als zu lernen. Ich hatte das Gefühl,
mit etwas Unvollständigem anzufangen bringe nichts, und konnte mich nicht konzentrieren („Reicht das? Ist das zu viel?“).
Ich pendle zwischen „zu eng, prüfungsgetrimmt“ und „dann eben das ganze Buch“. Ich lerne jetzt, während die KI-Agenten
laufen, und will trotzdem weiterbauen.

## Was die KI (Claude) mir gesagt hat

- Kein Neubau: Struktur, IDs, Karten und Lernstand tragen; falsch war nur, woher die Tiefe kommt.
- Wasserdicht im absoluten Sinn gibt es nicht; jede Fehlerart braucht einen eigenen Test (Katalog-Abdeckung,
  Buch-Abdeckung, fachliche Prüfung, Altprüfungen nur als Zwischencheck, am Ende mein eigenes Erklären-Können).
- Zeitrechnung: Der Tracker braucht über die ganze Ausbildung grob 400–450 Stunden; bei 20 h/Woche habe ich
  1.700–1.900 Stunden. Also: Tracker für die schriftlichen Prüfungen (5–7 h/Woche), Beruf und Projekt durch **selbst
  programmieren** und Buchkapitel (13–15 h/Woche). Die Projektarbeit zählt 50 % und fragt nach dem Warum.
- Das Pendel komme von meinem Wunsch nach Gewissheit, nicht vom Material.

## Unser Vorhaben (noch nicht entschieden)

Den Tracker **nicht neu bauen**, sondern um eine zweite, **kleine und unauffällige Ebene „Verstehen (Lehrbuch)“**
ergänzen:
- Jede Aussage hat schon eine Herkunft (`katalog:`, `beleg:`, `regel:`). Neu: `buch:GS-2.4.3` (Band + Kapitel).
- Die Ebene ergibt sich automatisch: mindestens eine Katalog-, Prüfungs- oder Regel-Herkunft = **Prüfung**; nur `buch:` =
  **Verstehen** (klein angezeigt, eingeklappt, zählt nicht zum Fortschritt, keine Pflichtkarten).
- Ein Schalter in der App: „Prüfung“ (nur Prüfungsebene, für die Wochen vor einer Prüfung) / „Alles“.
- Die prüfungsrelevanten Lücken (Katalogbezug) kommen in die Prüfungsebene.
- **Balance-Regeln** gegen das Ausufern: (1) Kein Buchpunkt ohne Anker – er muss eine bestehende Prüfungsaussage erklären
  oder verbinden („Warum stimmt das?“). (2) Höchstens 3 Buchpunkte je Stichpunkt, etwa 15 Minuten Lesen. (3) Ein Satz plus
  Seitenverweis statt Nacherzählen. Themen ohne Anker (Clean Code, Dateizugriff, Oberflächen) kommen nicht in den Tracker,
  sondern werden beim Programmieren gelernt. Erwartung: 300–400 Buchsätze insgesamt, 50–70 Stunden Lesen.

## Bitte analysiere tief

1. **Diagnose:** Stimmt die Analyse (Katalog vage → Prüfungen füllten die Tiefe → offene Themen dünn)? Was übersehen wir?
2. **Mein Ziel:** Ist „eine 1 und sicher im Beruf“ mit dieser Aufteilung (Tracker = Prüfung, Programmieren = Beruf)
   sinnvoll umgesetzt? Was würdest du anders gewichten, auch mit Blick auf die Projektarbeit (50 %)?
3. **Das Vorhaben:** Ist die zweite Ebene eine gute Lösung oder ein weiterer Schritt in der Bauschleife? Sind die drei
   Balance-Regeln stark genug? Wo würden sie in der Praxis brechen? Gibt es einfachere Lösungen?
4. **Die Zahlen:** Sind 70 / 23 / 8 % belastbar, obwohl nur 32 % des Buchtexts gelesen wurden? Wie würdest du das klären?
5. **Lernen statt Bauen:** Was sagt die Lernforschung (Abstandswiederholung, aktives Abrufen, Elaboration, Interleaving,
   Lernen durch Tun) zu diesem ganzen Ansatz? Wo investiere ich Zeit falsch?
6. **Der Mensch dahinter:** Ich habe das Gefühl, ohne vollständiges Material nicht anfangen zu können. Wie gehe ich
   praktisch damit um, ohne dass es meine Ausbildung bremst?
7. **Klare Empfehlung:** Was soll ich in den nächsten 4 Wochen konkret tun, und was lassen?

**Form deiner Antwort:** zuerst eine Zusammenfassung in höchstens 8 Sätzen, dann je Frage ein Abschnitt. Kennzeichne,
was du sicher weißt und was du vermutest. Sei direkt.
