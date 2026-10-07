# Trainer „Modellieren" – Aufgabenformat

Je Modus eine Datei in `aufgaben/<modus>.js` mit drei Exporten (plus `export default { spickzettel, notation, aufgaben }`):

```js
export const spickzettel = `- Regel 1\n- Regel 2`;   // kurz, Markup wie überall: "- " Liste, **fett**, `code`
export const notation = { text, diagramm, punkte: [...] } // oder { text, bilder: [{ titel, diagramm }], punkte }
export const aufgaben = [ ... ];
```

Optional: `notationAP1` / `spickzettelAP1` – eigene Fassung für AP1, wenn die normale Notation AP2-Stoff zeigt.

Vorbild: `aufgaben/anwendungsfall.js`. Ansehen mit
`npm run build && node tools/modell-galerie.mjs <modus> ap2 <ordner>` (je Aufgabe ein Bild, mit Lösung).
Prüfen mit `node --test tests/modellieren.test.mjs`.

## Aufgabe

| Feld | Bedeutung |
|---|---|
| `id` | eindeutig, z. B. `kl-e1` (Kürzel des Modus, Art, Nummer) |
| `art` | `ergaenzen` (Lücken im Diagramm), `fehler` (markierte Stellen prüfen), `fragen` (ohne oder mit Tabelle), `zeichnen` (auf Papier, dann Musterlösung + Prüfliste) |
| `raum` | `['AP1']`, `['AP2']` oder `['AP1', 'AP2']` – AP1-Aufgaben dürfen nichts aus AP2 voraussetzen |
| `sp` | Stichpunkt-ID, die geübt wird (muss in `verzeichnis.js` beim Modus stehen und zum Raum passen) |
| `titel` | kurz |
| `text` | Aufgabentext (Markup erlaubt). Keine Quellen, keine Prüfungstermine, keine Punktzahlen |
| `diagramm` | optional, siehe unten; Lücken `{1}`, Markierungen `marke: 1` |
| `tabelle` | optional `{ kopf: [...], zeilen: [[...]] }` |
| `felder` | bei ergaenzen/fehler/fragen: `[{ id, label, optionen: [...], erwartet, anzeige? }]`. Numerische `id` = Lücke/Marke im Bild. `erwartet` muss wörtlich in `optionen` stehen. `anzeige: { 'lange Option': 'kurz' }` – was im Bild erscheint |
| `loesung` | Erklärung in Schritten (Array von Sätzen) – **warum** es so ist |
| `muster` | optional bei `fehler`: das korrigierte Diagramm; Pflicht bei `zeichnen` (oder `musterTabelle` / `musterText`) |
| `vorlage` | bei `zeichnen` optional: begonnenes Diagramm, das erweitert wird |
| `pruefliste` | bei `zeichnen`: 5–9 prüfbare Punkte, je ein Bewertungsmerkmal |
| `hinweise` | bei `zeichnen` optional: typische Fehler, erlaubte Varianten |

Optionen ohne Mischen: in sinnvoller Reihenfolge angeben, die richtige nicht immer an derselben Stelle.
Falsche Optionen müssen eindeutig falsch sein (keine zweite richtige Lesart).

## Diagramm

```js
{ breite, hoehe, rahmen: [...], knoten: [...], kanten: [...] }
```
Koordinaten in Pixeln, Ursprung oben links; `x`, `y` = linke obere Ecke. Alles muss innerhalb von breite × hoehe liegen.
Text darf `\n` enthalten; lange Texte werden umbrochen.

### Knoten (`typ`, Standardgröße w×h)
- UML Anwendungsfall: `akteur` (36×62 + Name), `anwendungsfall` (150×52, Ellipse; wächst mit Text)
- UML Aktivität: `start` (20), `ende` (24), `ablaufende` (22), `aktion` (130×40), `entscheidung` (28, Raute; `text` steht daneben), `balken` (120×7; senkrecht: w 7, h 120)
- UML Zustand: `zustand` { name, intern: ['entry / …', 'do / …'] } – Größe automatisch; Start/Ende wie oben
- UML Klasse: `klasse` { name, stereotyp?, abstrakt?, attribute: ['- name : String'], methoden: ['+ getName() : String'] } – Größe automatisch.
  Zeile mit `*` vorn = kursiv (abstrakt), mit `_` vorn = unterstrichen (statisch)
- UML Sequenz: `lebenslinie` { text: 'k : Kunde', laenge, aktiv: [[y1, y2]], zerstoert?: y } (Kopf 120×34)
- ER: `entitaet` (120×42; `schwach: true`), `beziehung` (110×52 Raute), `attribut` (104×34 Ellipse; `pk: true` unterstreicht)
- Relational: `tabelle` { name, spalten: [{ name, pk?, fk? }] } – Größe automatisch
- EPK: `ereignis` (140×50 Sechseck), `funktion` (140×50), `org` (130×44), `info` (120×40), `konnektor` { art: 'xor'|'und'|'oder' } (32)
- BPMN: `aufgabe` (120×54), `startereignis` / `zwischenereignis` / `endereignis` (32; `symbol: 'brief'|'uhr'`, `text` darunter), `gateway` { art: 'x'|'+'|'o' } (42), `datenobjekt` (34×44)
- Masken: `kasten` { stil: 'text'|'feld'|'knopf'|'auswahl'|'check'|'radio'|'bild'|'diagramm'|'liste'|'tabelle'|'kalender'|'rahmen'|'leiste', text, an?, zweit?, fett?, farbe?, textFarbe?, groesse? }
- Freitext: `text` { text, anker: 'start'|'middle'|'end', klein? } – x/y = Textanfang/-mitte

### Kanten (`typ`)
`assoziation`, `linie`, `gerichtet`, `generalisierung` (Dreieck an `nach`), `realisierung`, `abhaengigkeit` (gestrichelt, offener Pfeil – include/extend),
`aggregation` / `komposition` (Raute an **`von`** = das Ganze), `fluss` (Kontrollfluss, Übergang), `sequenzfluss` (BPMN), `nachrichtenfluss` (BPMN),
`datenfluss`, `nachricht` (synchron, volle Spitze), `async`, `antwort` (gestrichelt), `erzeugen`.

Weitere Felder: `text` (Mitte), `textVon` / `textNach` (an den Enden, z. B. Multiplizitäten), `textSeite: -1` (Text auf die andere Seite),
`textPos` (0…1 entlang der Linie), `via: [[x, y], …]` (Knickpunkte), `vonSeite` / `nachSeite`: `'oben'|'unten'|'links'|'rechts'` oder `'oben:20'` (versetzt),
`marke`, `hervor`.
Nachrichten im Sequenzdiagramm: `{ von, nach, typ: 'nachricht', y, text }` – waagerecht auf Höhe `y`; `von === nach` = Selbstaufruf.

### Rahmen
`system` { x, y, w, h, text }, `bahnen` { x, y, h, bahnen: [{ text, w }] } (senkrechte Schwimmbahnen),
`pool` { x, y, w, text, lanes: [{ text, h }] }, `fragment` { x, y, w, h, art: 'alt'|'opt'|'loop', waechter: [{ y, text }], trenner: [y] },
`maske` { x, y, w, h, text, geraet? } (helles Papier; `geraet: true` = Smartphone-Rundung), `gruppe`.
