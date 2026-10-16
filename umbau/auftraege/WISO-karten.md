# Auftrag: Kurzfassung und Lernkarten WISO (Schicht 5)

> So benutzen: **erst nach** der unabhängigen Prüfung und dem Einbau ihrer Funde (die Texte bauen auf den
> endgültigen Aussagen auf). Repo `logic-over-luck/AP1_AP2_Tracker`, Branch `umbau`. Je Agent ein Ordner
> (WISO-1 bei Bedarf geteilt: einer schreibt die Kurzfassung, einer die Karten). Regeln wie
> `umbau/auftraege/AP1-karten.md`, hier für WiSo zusammengefasst.

---

**Auftrag**

Schreibe für den Ordner **WISO-<n>** Kurzfassung und Lernkarten, ausgehend vom Lernplan
`umbau/lernplan/wiso/WISO-<n>.json`. Grundlage sind **nur** die Stichpunkte mit Ziel, Können-Aussagen (mit Stufe,
`neu`, `vorgegeben`), Grenzen und Hinweis. Lies vorher UMBAU.md Abschnitt 4.1 (Stufen, Z3b) und STAND.md 2 (wie
Karten in der App funktionieren). Die Abschriften (`quellen/pruefungen/wiso/`) darfst du lesen, um die Prüfungsform
zu treffen – **abschreiben darfst du nichts** (E10): eigene Fragen, eigene Beispiele.

**WiSo-Besonderheit:** Die Prüfung besteht aus ca. 30 Auswahl-, Zuordnungs-, Reihenfolge- und kurzen Rechenaufgaben.
Wer besteht, muss vor allem **falsche Antwortmöglichkeiten sicher erkennen**. Erklärungen und Karten nennen deshalb
gezielt die typischen Verwechslungen („nicht …, sondern …“), die in den Aussagen stehen. Jährlich wechselnde Werte
(Beitragssätze, Beträge, Grenzen) werden nicht als Zahl gelernt (B4: sie stehen in der Aufgabe); dauerhafte Regeln
(Fristen, Altersgrenzen, Schwellenwerte im Gesetz) schon. Rechtsstand Oktober 2026.

### Teil 1: Kurzfassung `umbau/kurz/wiso/WISO-<n>.json`

```json
{ "ordner": "WISO-<n>", "stand": "2026-10-16", "grundlage": "umbau/lernplan/wiso/WISO-<n>.json",
  "hinweis": "teaser: je Stichpunkt ein kurzer Einstieg … erklaerung: je Können-Aussage die ausführliche Erklärung …",
  "teaser": { "<Stichpunkt-ID>": "…" }, "erklaerung": { "<Können-ID>": "…" } }
```

- **teaser** je Stichpunkt: 1–3 Sätze, beginnt mit einer fett gesetzten Leitfrage, sagt worum es geht und warum es
  in der Prüfung zählt.
- **erklaerung** je Können-Aussage: das, was man wissen muss, um die Aussage zu können – mit Beispiel aus dem
  IT-Betrieb, bei Stufe 3 einem kleinen Rechenweg, bei Stufe 4 einer kurzen Abwägung. Typische Verwechslung am Ende.
  Bei Aussagen mit `neu`: zuerst ein Satz, was aus dem früheren Raum bekannt ist (Stichpunkt-ID nennen), dann nur das Neue.
- Auszeichnung: Zeilen mit `- ` als Liste, `**fett**`, `Code` nur für echte Codes; keine Überschriften, keine Tabellen.
- Vollständig: jeder Stichpunkt hat einen Teaser, jede Aussage eine Erklärung, keine fremden IDs.

### Teil 2: Karten `umbau/karten/wiso/WISO-<n>.json`

Ausgangsmaterial sind die alten Karten in `inhalte/lernen/WISO-*.json` (Feld `karten`, Felder `id`, `sp`, `k`, `vorne`,
`hinten`). Über `alt_neu` im Lernplan siehst du, zu welcher neuen Aussage eine alte Karte gehört (`übernommen`/`angepasst`:
gleiche ID; `verschoben`: Feld `neu`; `gestrichen`: keine). **Maßgeblich ist der Zielordner**: Eine alte Karte, deren
Aussage in einen anderen Ordner verschoben wurde, entscheidet die Datei dieses anderen Ordners. Karten ohne `k`
(Karte zum ganzen Stichpunkt) gehören zum Ordner ihres alten Stichpunkts.

| Entscheidung | Wann |
|---|---|
| **bleibt** | passt fachlich und zur Aussage, Tiefe stimmt; Text unverändert |
| **bearbeitet** | Kern stimmt, aber Wortlaut, Tiefe, Rechtsstand oder Antwort passt nicht mehr |
| **entfernt** | passt zu keiner Aussage mehr, doppelt, hinter einer Grenze, nur Zahl nach B4, oder fachlich falsch |
| **neu** | Aussage hat zu wenig oder keine Karten |

Regeln:

1. Jede Können-Aussage hat am Ende **mindestens eine Karte** – außer sie lässt sich nicht als Karte abfragen
   (z. B. längere Rechnung mit Tabelle aus der Aufgabe): dann Eintrag in `nicht_abgefragt` (`{ "k", "grund" }`).
2. **Tiefe nach Stufe:** 1 = nennen/erkennen; 2 = erklären, unterscheiden, zuordnen; 3 = kleiner Fall/Rechnung;
   4 = entscheiden und begründen.
3. Eine Karte fragt **eine** Sache. Vorderseite als Frage, Rückseite knapp und vollständig (Listen mit `- `).
   Höchstens etwa drei Karten je Aussage; lieber eine gute Unterscheidungskarte als drei Faktenkarten.
4. **IDs (Lernstand hängt daran):** Behaltene und bearbeitete Karten behalten ihre ID, auch wenn `k` und `sp` sich
   ändern (verschobene Karten bekommen `k` und `sp` der neuen Aussage). IDs entfernter Karten werden **nie** neu
   vergeben. Neue Karten: `<Können-ID>-<Nr>` mit einer Nummer über der höchsten je vergebenen Nummer dieser
   Aussage (auch über den Nummern alter Karten, die unter dieser Können-ID lagen).
5. Karten im Format `{ "id", "sp", "k", "vorne", "hinten" }`; `sp` ist der Stichpunkt der Aussage `k`.
6. `protokoll`: je alte Karte des Ordners und je neue Karte `{ "id", "entscheidung", "grund" }`. „bleibt“ nur, wenn
   `vorne` und `hinten` exakt der alten Karte entsprechen. Alte Karten, deren Aussage **gestrichen** ist, kommen
   nicht ins Protokoll, sondern in `alt_gestrichen` (`{ "id", "alt_aussage", "grund" }`).
7. Fachlich unsicher? Karte nach bestem Wissen schreiben und in `unsicher` (`{ "id", "was" }`) eintragen.

Dateikopf: `{ "ordner", "stand": "2026-10-16", "auftrag": "umbau/auftraege/WISO-karten.md", "grundlage", "karten",
"nicht_abgefragt", "unsicher", "protokoll", "alt_gestrichen" }`.

### Prüfen und berichten

- `node --test tests/vorschau-ap1.test.mjs` muss grün sein (prüft Vollständigkeit von Kurzfassung und Karten, IDs,
  Protokoll).
- Kurzer Bericht `umbau/berichte/WISO-<n>-karten.md`: Zahlen je Entscheidung, Auffälligkeiten, unsichere Stellen.
- `inhalte/`, `src/` und die Lernpläne **nicht ändern**.
