# Prompt: Kurzfassung der Inhaltsdatei

> Anwendung: neuen Chat öffnen, die Datei `Inhaltsdatei_AP1_AP2_tracker.json` anhängen,
> dann alles unterhalb der Linie einfügen.

---

## Worum es geht

Ich baue mir einen Lern-Tracker für meine IHK-Abschlussprüfung (Fachinformatiker
Anwendungsentwicklung). Der Inhalt steht in der angehängten Datei
`Inhaltsdatei_AP1_AP2_tracker.json`: 246 Stichpunkte (AP1 98, AP2 83, WISO 65). Jeder Stichpunkt
hat einen `rahmen` (ein Absatz) und eine Liste `koennen` (insgesamt 1253 Aussagen, jede mit
eigener `id`).

Für die Anzeige ist das viel zu lang. Die Seite zeigt rechts neben der Stichpunktliste ein
schmales Feld mit einer Kurzinfo, etwa 40 Zeichen pro Zeile. Dafür brauche ich je Stichpunkt
eine Kurzform. Die Langform bleibt unverändert; sie ist die Quelle und kommt später ins
Nachschlagen.

## Was du lieferst

1. **`Kurzfassung_AP1_AP2_tracker.json`** im Format unten, mit allen 246 Stichpunkten.
2. **`Kurzfassung_AP1_AP2_tracker.xlsx`**, eine Tabelle zum Lesen und Korrigieren:
   - ein Blatt je Teil (AP1, AP2, WISO), eine Zeile je Stichpunkt
   - Spalten: ID | Ordner | Block | Stichpunkt | Art | Rahmen (lang) | Rahmen (kurz) |
     Zeichen | Können (lang) | Können (kurz)
   - „Können (lang)“: eine Aussage je Zeile in der Zelle, vorne die Nummer, z. B. `K3: Du kannst …`
   - „Können (kurz)“: ein Eintrag je Zeile, hinten in Klammern die Nummern, die er zusammenfasst,
     z. B. `SMART-Kriterien nennen und Ziele zuordnen (K3, K4)`
   - „Zeichen“: Länge von „Rahmen (kurz)“
   - Kopfzeile fixiert, Zeilenumbruch an, sinnvolle Spaltenbreiten

Wenn ich später in der Tabelle korrigiere und sie dir wiedergebe, erzeugst du daraus die JSON
neu. Deshalb müssen die Nummern in Klammern eindeutig lesbar bleiben.

## Regeln für die Kurzform

**`rahmen_kurz`**
- ein Satz, höchstens 140 Zeichen
- sagt, worum es geht und was man damit tut, in der Du-Form wie das Original
- keine Prüfungsjahre, keine Aufgabennummern, keine Verweise auf Katalog, Anhang oder Quellen
  („In der Prüfung 2026 …“, „Der Katalog verlangt …“). Quellen lenken beim Lernen ab.
- nichts erfinden: nur, was im Rahmen oder in den Können-Aussagen steht

**`koennen_kurz`**
- 2 bis 4 Einträge, je höchstens 70 Zeichen
- Stichwortstil ohne „Du kannst“: erst der Gegenstand, dann die Tätigkeit, z. B.
  „SMART-Kriterien nennen und Ziele zuordnen“,
  „Kosten je Monat aus Kaufpreis und Nutzungsdauer berechnen“
- Fachbegriffe, Abkürzungen, Formeln, Zahlen und Aufzählungen von Fachbegriffen bleiben
  wörtlich, z. B. „FAZ/FEZ“, „GP = SAZ − FAZ“, „Monopol, Oligopol, Polypol“
- jeder Eintrag nennt in `aus` die IDs der Original-Aussagen, die er zusammenfasst
- jede Original-Aussage steckt in mindestens einem Eintrag. Lieber vier dichte Einträge als
  etwas weglassen. Eine Aussage, die nur wiederholt, was schon drinsteht, darf in einem anderen
  Eintrag aufgehen.
- Reihenfolge wie im Original

**Allgemein**
- deutsche Rechtschreibung mit ß, Anführungszeichen „…“
- die Inhaltsdatei selbst nicht verändern
- Fälle, in denen eine Kurzform nur falsch oder unvollständig möglich ist, sammelst du und
  zeigst sie mir gebündelt, statt sie still zu entscheiden

## Format

Schlüssel ist die `id` aus `stichpunkte[]`.

```json
{
  "schema": "kurzfassung-1",
  "quelle": "Inhaltsdatei_AP1_AP2_tracker.json, schema_version 2",
  "stichpunkte": {
    "AP1-1-1-1": {
      "rahmen_kurz": "Du grenzt ein Projekt von einer Daueraufgabe ab und formulierst Projektziele nach SMART.",
      "koennen_kurz": [
        { "text": "Projektmerkmale nennen und ein Projekt erkennen", "aus": ["AP1-1-1-1-K1", "AP1-1-1-1-K2"] },
        { "text": "SMART-Kriterien nennen und Ziele zuordnen", "aus": ["AP1-1-1-1-K3", "AP1-1-1-1-K4"] },
        { "text": "Unscharfe Ziele SMART umformulieren", "aus": ["AP1-1-1-1-K5"] }
      ]
    }
  }
}
```

## Vorgehen

1. Mach zuerst eine **Probe mit den ersten zehn Stichpunkten von AP1** und zeig sie mir als
   Tabelle (lang und kurz nebeneinander). Ich sage dir, ob Ton und Länge passen. Erst danach
   machst du den Rest.
2. Arbeite dann in Abschnitten: AP1, AP2, WISO.
3. Erzeuge beide Dateien mit Code (Python), nicht von Hand im Chat, damit nichts abgeschnitten
   wird. Die Langform-Spalten füllst du per Code direkt aus der JSON.
4. Prüfe am Ende per Code und zeig mir das Ergebnis:
   - genau 246 Einträge, dieselben IDs wie in der Inhaltsdatei
   - jedes `rahmen_kurz` höchstens 140 Zeichen und ein Satz
   - je Stichpunkt 2 bis 4 `koennen_kurz`, jeder höchstens 70 Zeichen
   - jede Können-ID kommt in mindestens einem `aus` vor, keine unbekannten IDs
   - kein `rahmen_kurz` enthält „Prüfung“, „Katalog“, „Anhang“ oder eine Jahreszahl
   - die zehn längsten Kurzformen zur Ansicht

## Wofür das ist

Die JSON lege ich ins Repo neben die Inhaltsdatei. Das Build-Skript liest sie und zeigt die
Kurzform auf der Lernseite an. Die Tabelle dient nur zum Lesen und Korrigieren.
