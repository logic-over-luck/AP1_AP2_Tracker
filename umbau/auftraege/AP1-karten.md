# Auftrag: Lernkarten AP1 neu aufstellen (Schicht 5)

> So benutzen: **Erst nach** Gegenprüfung und Abnahme des Lernplans (die Karten bauen auf den
> endgültigen Aussagen auf). Neue Sitzung (Opus, hohe Denkstufe), Repo `logic-over-luck/AP1_AP2_Tracker`,
> Branch `vorschau-ap1`. Je Sitzung ein bis zwei Ordner. Text ab „Auftrag“ einfügen.

---

**Auftrag**

Stelle die Lernkarten für den Ordner **AP1-<n>** neu auf, ausgehend vom neuen Lernplan
`umbau/lernplan/ap1/AP1-<n>.json`. Grundlage sind **nur** die Stichpunkte mit Ziel, Können-Aussagen
(mit Stufe), Grenzen und Kür. Lies vorher UMBAU.md Abschnitt 4.1 (Stufen) und STAND.md 2 (wie Karten
in der App funktionieren).

**Ausgangsmaterial:** die alten Karten in `inhalte/lernen/AP1-<n>.json` (Feld `karten`). Über `alt_neu`
im Lernplan weißt du, zu welcher neuen Aussage eine alte Karte gehört. Du entscheidest je Karte selbst:

| Entscheidung | Wann |
|---|---|
| **bleibt** | passt fachlich und zur Aussage, Tiefe stimmt |
| **bearbeitet** | Kern stimmt, aber Wortlaut, Tiefe oder Antwort passt nicht mehr zur neuen Aussage |
| **entfernt** | passt zu keiner Aussage mehr, fragt etwas hinter einer Grenze ab, doppelt, oder fachlich falsch |
| **neu** | Aussage hat zu wenig oder keine Karten |

**Regeln**

1. Jede Können-Aussage hat am Ende **mindestens eine Karte** – außer sie lässt sich nicht als Karte
   abfragen (z. B. Zeichnen, längere Rechnung): dann Eintrag in `nicht_abgefragt` mit Grund.
2. **Tiefe nach Stufe:** Stufe 1 = nennen/erkennen; 2 = erklären, unterscheiden, zuordnen;
   3 = an einem kleinen Fall anwenden; 4 = entscheiden und begründen (Mini-Fall mit Begründung).
3. **Nichts hinter den Grenzen** abfragen. **Keine Karten für Kür**-Einträge.
4. Eine Karte fragt **eine** Sache. Vorderseite als Frage im Prüfungston, Rückseite knapp und vollständig
   (Listen mit `- `). Eigene Formulierungen, nichts aus Prüfungen oder Lernzetteln abschreiben.
5. **IDs (Lernstand hängt daran):** Behaltene und bearbeitete Karten behalten ihre ID. IDs entfernter
   Karten werden **nie** neu vergeben. Neue Karten: `<Können-ID>-<Nr>` mit einer Nummer über der
   höchsten je vergebenen dieser Aussage. Verschobene Karten bekommen `k` und `sp` der neuen Aussage,
   behalten aber ihre ID.
6. Fachlich unsicher? Karte trotzdem nach bestem Wissen schreiben und in `unsicher` eintragen.

**Ergebnis**

- `umbau/karten/ap1/AP1-<n>.json` mit `karten` (Format wie in `inhalte/lernen`: `id`, `sp`, `k`, `vorne`,
  `hinten`), `nicht_abgefragt`, `unsicher` und `protokoll`: je alte und neue Karte
  `{ "id", "entscheidung": "bleibt|bearbeitet|entfernt|neu", "grund" }`.
- `inhalte/` **nicht ändern** (Umbau-Regel). Die Vorschau soll die neuen Karten zeigen: In
  `tools/vorschau-ap1.mjs` für Ordner mit einer Datei in `umbau/karten/ap1/` deren Karten statt der
  umgehängten alten nehmen; Test in `tests/vorschau-ap1.test.mjs` ergänzen (jede Aussage hat Karte oder
  `nicht_abgefragt`, keine vergebene ID doppelt, keine entfernte ID wieder da).
- `npm run build`, `npm test`, Browser-Prüfung; `Lernstudio.html` committen und auf `vorschau-ap1` pushen.
- Kurzer Bericht `umbau/berichte/AP1-<n>-karten.md` (Zahlen je Entscheidung, Auffälligkeiten).
  Am Ende nur eine Zeile melden: „AP1-x Karten: B bleiben, E bearbeitet, R entfernt, N neu“.
