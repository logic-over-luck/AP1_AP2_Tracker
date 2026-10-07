# Inhalte des Lernstudios

Alles hier ergänzt die Inhaltsdatei `Inhaltsdatei_AP1_AP2_tracker.json` und verweist über
deren IDs auf sie. Die Inhaltsdatei selbst wird nie verändert.

| Ordner/Datei | Inhalt |
|---|---|
| `lernen/<paket>.json` | Blocksätze, Kurzfassungen, Lernkarten und Glossar-Vorschläge je Paket |
| `glossar.json` | zusammengeführtes Glossar |
| `trainer/` | feste Aufgaben der Trainer (Pseudocode, SQL, Modellieren) |
| `zuordnung.json` | welcher Stichpunkt in welchem Trainer geübt wird |
| `pruefberichte/<paket>.md` | Ergebnis der unabhängigen Durchsicht je Paket |

Prüfen: `node tools/inhalte-pruefen.mjs` (alle Pakete) oder
`node tools/inhalte-pruefen.mjs inhalte/lernen/AP1-1.json` (ein Paket).

---

## Format einer Paketdatei `lernen/<paket>.json`

```json
{
  "paket": "AP1-1",
  "bloecke": {
    "AP1-1-1": { "satz": "Was ein Projekt ausmacht, wie man es plant und wer daran beteiligt ist." }
  },
  "stichpunkte": {
    "AP1-1-1-1": {
      "ziel": "Ein Projekt von einer Daueraufgabe abgrenzen und Ziele nach SMART formulieren.",
      "punkte": [
        "Merkmale: einmalig, befristet, klares Ziel, begrenzte Mittel, eigenes Team",
        "SMART: spezifisch, messbar, akzeptiert, realistisch, terminiert",
        "Zielbeschreibungen dem passenden Kriterium zuordnen"
      ]
    }
  },
  "karten": [
    {
      "id": "AP1-1-1-1-K3-1",
      "sp": "AP1-1-1-1",
      "k": "AP1-1-1-1-K3",
      "vorne": "Wofür stehen die fünf Buchstaben in SMART?",
      "hinten": "- spezifisch\n- messbar\n- akzeptiert\n- realistisch\n- terminiert"
    }
  ],
  "nicht_abgefragt": [
    { "k": "AP1-1-1-1-K5", "grund": "Umformulieren ist eine Schreibübung, keine Abfrage." }
  ],
  "glossar": [
    {
      "begriff": "SMART",
      "langform": "spezifisch, messbar, akzeptiert, realistisch, terminiert",
      "erklaerung": "Merkregel für gut formulierte Ziele: Ein Ziel ist spezifisch, messbar, akzeptiert, realistisch und terminiert.",
      "sp": ["AP1-1-1-1"]
    }
  ],
  "unsicher": [
    { "id": "AP1-1-1-1-K3-1", "frage": "Wird das A in der Prüfung als „akzeptiert" oder „attraktiv" erwartet?" }
  ]
}
```

### Felder

- **`bloecke`**: ein Eintrag je Block des Pakets. `satz` sagt in einem Satz, worum es im
  Block geht (höchstens 160 Zeichen).
- **`stichpunkte`**: ein Eintrag je Stichpunkt.
  - `ziel`: ein Satz, was man können muss, im Infinitiv-Stil („… bestimmen und begründen.").
    Höchstens 200 Zeichen.
  - `punkte`: 2 bis 5 knappe Punkte mit dem Wesentlichen, je höchstens 110 Zeichen, ohne
    Schlusspunkt.
  - Die Kurzfassung verdichtet nur, was in `rahmen` und `koennen` steht, und fügt nichts hinzu.
    Prüfungstermine, Punktzahlen, Quellen („In der Prüfung 2026 …", „laut Podcast …") gehören
    nicht hinein.
- **`karten`**: Lernkarten.
  - `id`: `<Können-ID>-<laufende Nummer>`, z. B. `AP1-1-1-1-K3-1`, `AP1-1-1-1-K3-2`.
    Eine Karte ohne passende Können-Aussage bekommt `<Stichpunkt-ID>-X<Nummer>` und `"k": null`.
    IDs sind dauerhaft: Der Lernstand hängt an ihnen. Nie umnummerieren, nur ergänzen.
  - `sp`: Stichpunkt-ID; `k`: Können-ID oder `null`.
  - `vorne`: die Frage. `hinten`: die Antwort.
- **`nicht_abgefragt`**: Können-Aussagen ohne Karte, mit kurzem Grund (z. B. reine
  Rechen- oder Zeichenübung, die im Trainer geübt wird).
- **`glossar`**: Fachbegriffe, die in den Stichpunkten des Pakets vorkommen (Titel, Rahmen,
  Können). `langform` nur bei Abkürzungen. `erklaerung` 1–2 Sätze, höchstens 240 Zeichen.
  `sp`: alle Stichpunkte des Pakets, in denen der Begriff vorkommt.
- **`unsicher`**: alles, was sich fachlich nicht sicher klären ließ. Lieber hier eintragen
  als stillschweigend stehen lassen.

### Textauszeichnung (in `hinten`, `punkte`, `erklaerung`)

- Zeilenumbruch: `\n`. Zeilen, die mit `- ` beginnen, werden als Aufzählung dargestellt.
- `` `Code` `` in Backticks wird als Code dargestellt (Befehle, SQL, Formeln mit Variablen).
- `**fett**` für ein einzelnes Schlüsselwort, sparsam.
- Sonst reiner Text. Typografie: „deutsche Anführungszeichen", Gedankenstrich –,
  Rechenzeichen · − × ÷ ≤ ≥ ≠, Einheiten mit Leerzeichen (19 %, 1.024 Byte, 60 W).

---

## Regeln für Lernkarten

1. **Richtigkeit vor Menge.** Eine falsche Karte wird falsch gelernt.
2. **Quelle ist `rahmen` und `koennen`.** Was dort steht, sinngemäß übernehmen. Was aus
   Fachwissen ergänzt wird, muss dem Stand des IHK-Prüfungskatalogs entsprechen.
3. **Tiefe aus `rahmen`.** Keine Karte geht darüber hinaus. AP1-Karten setzen nichts aus AP2
   voraus.
4. **Abdeckung.** Jede Können-Aussage, die sich abfragen lässt, bekommt mindestens eine Karte;
   umfangreiche Aussagen (Aufzählungen, Unterscheidungen) bekommen mehrere.
5. **Eine Karte, eine Sache.** Die Frage ist eindeutig: Es gibt genau eine richtige Antwort,
   oder die Antwort nennt alle, die gelten.
6. **Kurze Antworten.** Man muss sie im Kopf vergleichen können: ideal unter 200 Zeichen,
   Aufzählungen höchstens 6 Punkte, nie über 400 Zeichen.
7. **Rechnen, Zeichnen, Schreiben:** Die Karten fragen Begriffe, Formeln, Regeln und
   Notation ab; das Rechnen und Zeichnen selbst wird im Trainer geübt.
8. **Kartenarten mischen:** Begriff → Bedeutung, Bedeutung → Begriff, Unterschied zweier
   Begriffe, Beispiel → Einordnung, Aufzählung, Regel/Formel, „Warum …?".
9. **Keine Prüfungsverweise** („In der Prüfung 2026 …") auf Karten.
10. **Fragen ohne Hinweis auf die Antwort.** Die Frage verrät die Antwort nicht.
