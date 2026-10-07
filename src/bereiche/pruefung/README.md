# Probeprüfungen – Format der Prüfungssätze

Ein **Prüfungssatz** ist eine vollständige, eigene Probeprüfung zu einer fiktiven Firma: Ausgangssituation und
4 Aufgaben mit zusammen 100 Punkten (AP1, PB1, PB2) bzw. 30 Fragen (WiSo). Eine Datei je Satz unter
`saetze/<teil>/<id>.js`, eingetragen in `saetze/index.js`. Die Generator-Logik steht in `generator.js`;
`tests/pruefung.test.mjs` prüft jeden Satz mit `pruefeSatz`.

Alle Texte sind **eigene Formulierungen**. Aus echten IHK-Prüfungen werden nur Aufbau, Aufgabentypen,
Punkteverteilung und Themen übernommen – nie Wortlaut, Szenarien, Firmennamen, Tabellen, Code oder Lösungen.

## AP1, PB1, PB2

```js
export default {
  id: 'pb2-03',                 // <teil klein>-<nr>
  teil: 'PB2',                  // 'AP1' | 'PB1' | 'PB2'
  titel: 'Lieferdienst Rheinkiste',          // Firma bzw. Projekt (fiktiv)
  situation: 'Ausgangssituation (2–5 Sätze)…', // gilt für alle Aufgaben
  aufgaben: [
    {
      id: 'pb2-03-1',
      art: 'algorithmus',       // siehe Arten unten – der Generator mischt danach
      titel: 'Tourenplanung',   // kurzer Titel der Aufgabe
      punkte: 25,               // = Summe der Teile
      sp: ['AP2-3-3-1'],        // Stichpunkte der Aufgabe (Teile können eigene haben)
      situation: 'Unterkontext der Aufgabe (optional, 1–3 Sätze)',
      vorgaben: [ /* Blöcke, gelten für alle Teile */ ],
      teile: [
        {
          nr: 'a',              // 'a', 'b', 'ba', 'bb' …
          punkte: 6,
          text: 'Aufgabentext mit Operator (Nennen Sie …, Erläutern Sie …). **fett** und `code` erlaubt, Listen mit „- “.',
          sp: ['AP2-…'],        // optional, sonst die der Aufgabe
          vorgaben: [ /* Blöcke nur für diesen Teil */ ],
          antwort: { art: 'text', zeilen: 6 },   // siehe Antwortarten
          loesung: [ /* Blöcke: Musterlösung, bei „nennen“ mehr Beispiele als gefordert */ ],
          bewertung: ['je Nennung 1 P (max. 3)', 'andere sinnvolle Antworten sind richtig'],
        },
      ],
    },
  ],
};
```

### Blöcke (vorgaben, loesung)
- `'Text'` – Absatz (Rich: `**fett**`, `` `code` ``, Listenzeilen mit „- “)
- `{ tabelle: { titel?, kopf: ['Spalte', …], zeilen: [['a', 'b'], …] } }`
- `{ code: 'Zeile 1\nZeile 2', nummern: true, titel? }` – Quelltext/Pseudocode/SQL, `nummern` für Zeilennummern
- `{ hinweis: 'Text' }` – Kasten (z. B. Erklärung einer Funktion, die nicht im Belegsatz steht)
- `{ diagramm: d, titel? }` – Diagramm im Format von `trainer/modellieren/README.md` (optional)

### Antwortarten (`antwort.art`)
- `text` (Standard) – Freitext; `zeilen` = Höhe
- `code` – Pseudocode/SQL, Festbreitenschrift; `zeilen`; optional `rahmen: 'erste Zeile\n…\nletzte Zeile'` (vorgegebener Methodenrahmen)
- `tabelle` – `{ kopf: [...], zeilen: [[vorgabe | null, …], …] }`; `null` = Eingabefeld
- `zahlen` – `{ felder: [{ id, label, erwartet, stellen?, toleranz?, einheit? }] }` – prüft die App selbst
- `auswahl` – `{ optionen: [...], richtig: [i], mehrfach? }` – prüft die App selbst
- `papier` – Zeichnung auf Papier (Diagramme); die Lösung zeigt die Musterzeichnung oder beschreibt sie Element für Element

### Arten (`aufgabe.art`)
- AP1: `projekt`, `wirtschaft`, `hardware`, `netzwerk`, `sicherheit`, `programmieren`
- PB1: `projekt`, `modell`, `schnittstelle`, `sicherheit`, `qualitaet`
- PB2: `algorithmus`, `sql`, `modell`, `test`

## WiSo

```js
export default {
  id: 'wiso-02', teil: 'WISO', titel: 'Netzwerk-Service GmbH',
  situation: 'Gesamtsituation (Firma, Größe, Rechtsform, Ausbildung) …',
  bloecke: [{ id: 's1', text: 'Situationsblock für 2–3 Fragen …' }],
  fragen: [
    { id: 'wiso-02-01', sp: ['WISO-1-1-2'], art: 'einfach', situation?: 's1',
      text: 'Stammfrage …', optionen: ['…', '…', '…', '…', '…'], richtig: [2],
      erklaerung: 'Warum 3 richtig ist und die anderen nicht (kurz).' },
    { art: 'mehrfach', optionen: [6 Stück], richtig: [0, 4] },           // „zwei zutreffende“
    { art: 'zuordnung', links: ['a …', 'b …'], optionen: ['1 …', '2 …', '3 …'], richtig: [2, 0] },
    { art: 'reihenfolge', optionen: ['…'], richtig: [2, 0, 1, 3] },      // Indizes in richtiger Reihenfolge
    { art: 'zahl', text: '…', richtig: 123.45, stellen: 2, einheit: 'EUR' },
  ],
};
```
