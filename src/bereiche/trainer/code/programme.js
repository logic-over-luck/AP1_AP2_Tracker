// Programme für Visualizer, Schreibtischtest, Puzzle und Fehlersuche.
// Jedes Programm wird vom Interpreter ausgeführt – die Lösungen werden nie von Hand eingetragen.
//
// Felder: id, titel, raum (AP1/AP2/beide), sp, code, eingaben(r) → Startwerte (zufällig),
// spalten (Schreibtischtest), messzeile (nach welcher Zeile eine Tabellenzeile entsteht),
// frage (was am Ende abgefragt wird).

const zahlen = (r, n, min, max) => Array.from({ length: n }, () => r.ganz(min, max));

export const PROGRAMME = [
  {
    id: 'summe',
    titel: 'Summenbildung (Akkumulator)',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-3',
    code: `summe = 0
FÜR i = 0 BIS LÄNGE(werte) - 1
  summe = summe + werte[i]
ENDE FÜR
AUSGABE summe`,
    eingaben: (r) => ({ werte: zahlen(r, r.ganz(4, 5), 1, 20) }),
    beispiel: { werte: [4, 10, 2, 7] },
    spalten: [
      { titel: 'i', wert: (v) => v.i },
      { titel: 'werte[i]', wert: (v) => v.werte[v.i] },
      { titel: 'summe', wert: (v) => v.summe },
    ],
    messzeile: 3,
    frage: 'ausgabe',
  },
  {
    id: 'maximum',
    titel: 'Größten Wert suchen',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-3',
    code: `max = werte[0]
FÜR i = 1 BIS LÄNGE(werte) - 1
  WENN werte[i] > max DANN
    max = werte[i]
  ENDE WENN
ENDE FÜR
AUSGABE "Maximum: ", max`,
    eingaben: (r) => ({ werte: zahlen(r, 5, 1, 50) }),
    beispiel: { werte: [12, 45, 7, 45, 30] },
    spalten: [
      { titel: 'i', wert: (v) => v.i },
      { titel: 'werte[i]', wert: (v) => v.werte[v.i] },
      { titel: 'max', wert: (v) => v.max },
    ],
    messzeile: 2,
    messEreignis: 'schleifenende',
    frage: 'ausgabe',
  },
  {
    id: 'zaehlen',
    titel: 'Werte über einer Grenze zählen',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-3',
    code: `anzahl = 0
FÜR i = 0 BIS LÄNGE(temperaturen) - 1
  WENN temperaturen[i] >= grenze DANN
    anzahl = anzahl + 1
  ENDE WENN
ENDE FÜR
AUSGABE anzahl, " Tage ab ", grenze, " Grad"`,
    eingaben: (r) => ({ temperaturen: zahlen(r, 5, 14, 32), grenze: r.wahl([20, 22, 25]) }),
    beispiel: { temperaturen: [18, 25, 22, 30, 19], grenze: 22 },
    spalten: [
      { titel: 'i', wert: (v) => v.i },
      { titel: 'temperaturen[i]', wert: (v) => v.temperaturen[v.i] },
      { titel: 'anzahl', wert: (v) => v.anzahl },
    ],
    messzeile: 2,
    messEreignis: 'schleifenende',
    frage: 'ausgabe',
  },
  {
    id: 'durchschnitt',
    titel: 'Durchschnitt und Prozent',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-3',
    code: `summe = 0
bestanden = 0
FÜR i = 0 BIS LÄNGE(punkte) - 1
  summe = summe + punkte[i]
  WENN punkte[i] >= 50 DANN
    bestanden = bestanden + 1
  ENDE WENN
ENDE FÜR
schnitt = summe / LÄNGE(punkte)
quote = bestanden * 100 / LÄNGE(punkte)
AUSGABE "Schnitt: ", RUNDEN(schnitt, 2)
AUSGABE "Bestanden: ", quote, " %"`,
    eingaben: (r) => ({ punkte: zahlen(r, 4, 20, 98) }),
    beispiel: { punkte: [67, 45, 88, 52] },
    spalten: [
      { titel: 'i', wert: (v) => v.i },
      { titel: 'summe', wert: (v) => v.summe },
      { titel: 'bestanden', wert: (v) => v.bestanden },
    ],
    messzeile: 3,
    messEreignis: 'schleifenende',
    frage: 'ausgabe',
  },
  {
    id: 'quersumme',
    titel: 'Quersumme mit DIV und MOD',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-3',
    code: `q = 0
SOLANGE zahl > 0
  q = q + zahl MOD 10
  zahl = zahl DIV 10
ENDE SOLANGE
AUSGABE q`,
    eingaben: (r) => ({ zahl: r.ganz(100, 98765) }),
    beispiel: { zahl: 4711 },
    spalten: [
      { titel: 'zahl', wert: (v) => v.zahl },
      { titel: 'q', wert: (v) => v.q },
    ],
    messzeile: 4,
    frage: 'ausgabe',
  },
  {
    id: 'rabatt',
    titel: 'Rabattstaffel (verschachtelte Verzweigung)',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-3',
    code: `WENN betrag >= 1000 DANN
  WENN stammkunde DANN
    rabatt = 15
  SONST
    rabatt = 10
  ENDE WENN
SONST WENN betrag >= 500 DANN
  rabatt = 5
SONST
  rabatt = 0
ENDE WENN
endpreis = betrag - betrag * rabatt / 100
AUSGABE endpreis`,
    eingaben: (r) => ({ betrag: r.wahl([180, 420, 500, 760, 999, 1000, 1250, 2400]), stammkunde: r.ja() }),
    beispiel: { betrag: 1250, stammkunde: true },
    spalten: [
      { titel: 'rabatt', wert: (v) => v.rabatt },
      { titel: 'endpreis', wert: (v) => v.endpreis },
    ],
    messzeile: 12,
    frage: 'ausgabe',
  },
  {
    id: 'fakultaet',
    titel: 'Produkt in einer Zählschleife',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-3',
    code: `ergebnis = 1
FÜR i = 1 BIS n
  ergebnis = ergebnis * i
ENDE FÜR
AUSGABE ergebnis`,
    eingaben: (r) => ({ n: r.ganz(3, 6) }),
    beispiel: { n: 5 },
    spalten: [
      { titel: 'i', wert: (v) => v.i },
      { titel: 'ergebnis', wert: (v) => v.ergebnis },
    ],
    messzeile: 3,
    frage: 'ausgabe',
  },
  {
    id: 'binaer',
    titel: 'Dezimal in Binär umrechnen',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-3',
    code: `ergebnis = ""
SOLANGE zahl > 0
  rest = zahl MOD 2
  ergebnis = rest + ergebnis
  zahl = zahl DIV 2
ENDE SOLANGE
AUSGABE ergebnis`,
    eingaben: (r) => ({ zahl: r.ganz(5, 40) }),
    beispiel: { zahl: 13 },
    spalten: [
      { titel: 'rest', wert: (v) => v.rest },
      { titel: 'ergebnis', wert: (v) => v.ergebnis, text: true },
      { titel: 'zahl', wert: (v) => v.zahl },
    ],
    messzeile: 5,
    frage: 'ausgabe',
  },
  {
    id: 'bonus',
    titel: 'Funktion mit Rückgabewert',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-3',
    code: `FUNKTION bonus(umsatz, jahre)
  b = 0
  WENN umsatz > 50000 DANN
    b = umsatz * 2 / 100
  ENDE WENN
  WENN jahre >= 5 UND b > 0 DANN
    b = b + 250
  ENDE WENN
  RÜCKGABE b
ENDE FUNKTION
AUSGABE bonus(umsatz, jahre)`,
    eingaben: (r) => ({ umsatz: r.wahl([30000, 48000, 50000, 52000, 75000, 120000]), jahre: r.wahl([2, 4, 5, 8]) }),
    beispiel: { umsatz: 75000, jahre: 6 },
    spalten: [{ titel: 'b', wert: (v) => v.b }],
    messzeile: 9,
    messEreignis: 'nach',
    frage: 'ausgabe',
  },
  {
    id: 'umkehren',
    titel: 'Array umkehren (Tausch mit Hilfsvariable)',
    raum: ['AP2'],
    sp: 'AP2-5-2-3',
    code: `links = 0
rechts = LÄNGE(a) - 1
SOLANGE links < rechts
  hilf = a[links]
  a[links] = a[rechts]
  a[rechts] = hilf
  links = links + 1
  rechts = rechts - 1
ENDE SOLANGE
AUSGABE a`,
    eingaben: (r) => ({ a: zahlen(r, r.ganz(5, 6), 1, 9) }),
    beispiel: { a: [3, 8, 1, 6, 2] },
    spalten: [
      { titel: 'links', wert: (v) => v.links },
      { titel: 'rechts', wert: (v) => v.rechts },
      { titel: 'a', wert: (v) => v.a, liste: true },
    ],
    messzeile: 8,
    frage: 'ausgabe',
  },
  {
    id: 'binaerSuche',
    titel: 'Binäre Suche',
    raum: ['AP2'],
    sp: 'AP2-3-2-3',
    code: `links = 0
rechts = LÄNGE(a) - 1
position = -1
SOLANGE links <= rechts UND position = -1
  mitte = (links + rechts) DIV 2
  WENN a[mitte] = gesucht DANN
    position = mitte
  SONST WENN a[mitte] < gesucht DANN
    links = mitte + 1
  SONST
    rechts = mitte - 1
  ENDE WENN
ENDE SOLANGE
AUSGABE position`,
    eingaben: (r) => {
      const a = [...new Set(zahlen(r, 12, 1, 60))].sort((x, y) => x - y).slice(0, r.ganz(7, 9));
      return { a, gesucht: r.ja(0.75) ? r.wahl(a) : r.ganz(1, 60) };
    },
    beispiel: { a: [3, 8, 12, 19, 25, 31, 40, 47], gesucht: 31 },
    spalten: [
      { titel: 'links', wert: (v) => v.links },
      { titel: 'rechts', wert: (v) => v.rechts },
      { titel: 'mitte', wert: (v) => v.mitte },
      { titel: 'a[mitte]', wert: (v) => v.a[v.mitte] },
    ],
    messzeile: 5,
    frage: 'ausgabe',
  },
  {
    id: 'bubble',
    titel: 'Bubble Sort',
    raum: ['AP2'],
    sp: 'AP2-3-2-3',
    code: `n = LÄNGE(a)
FÜR i = 0 BIS n - 2
  FÜR j = 0 BIS n - 2 - i
    WENN a[j] > a[j + 1] DANN
      hilf = a[j]
      a[j] = a[j + 1]
      a[j + 1] = hilf
    ENDE WENN
  ENDE FÜR
ENDE FÜR
AUSGABE a`,
    eingaben: (r) => ({ a: zahlen(r, 5, 1, 30) }),
    beispiel: { a: [5, 1, 4, 2, 8] },
    spalten: [
      { titel: 'i', wert: (v) => v.i },
      { titel: 'a nach Durchlauf', wert: (v) => v.a, liste: true },
    ],
    messzeile: 2,
    messEreignis: 'schleifenende',
    frage: 'ausgabe',
  },
  {
    id: 'abgleich',
    titel: 'Zwei Listen abgleichen',
    raum: ['AP2'],
    sp: 'AP2-3-2-2',
    code: `gemeinsam = []
FÜR i = 0 BIS LÄNGE(bestellt) - 1
  FÜR j = 0 BIS LÄNGE(geliefert) - 1
    WENN bestellt[i] = geliefert[j] DANN
      gemeinsam.add(bestellt[i])
    ENDE WENN
  ENDE FÜR
ENDE FÜR
AUSGABE "Geliefert: ", gemeinsam`,
    eingaben: (r) => {
      const pool = r.mische([101, 102, 103, 104, 105, 106, 107, 108]);
      return { bestellt: pool.slice(0, 4), geliefert: r.mische([...pool.slice(1, 3), ...pool.slice(4, 6)]) };
    },
    beispiel: { bestellt: [101, 104, 107], geliefert: [104, 102, 107] },
    spalten: [
      { titel: 'i', wert: (v) => v.i },
      { titel: 'gemeinsam', wert: (v) => v.gemeinsam, liste: true },
    ],
    messzeile: 2,
    messEreignis: 'schleifenende',
    frage: 'ausgabe',
  },
  {
    id: 'gruppieren',
    titel: 'Werte je Gruppe zählen',
    raum: ['AP2'],
    sp: 'AP2-3-2-2',
    code: `anzahl = [0, 0, 0, 0, 0, 0]
FÜR JEDES note IN noten
  anzahl[note - 1] = anzahl[note - 1] + 1
ENDE FÜR
beste = 0
FÜR k = 1 BIS 5
  WENN anzahl[k] > anzahl[beste] DANN
    beste = k
  ENDE WENN
ENDE FÜR
AUSGABE "Häufigste Note: ", beste + 1`,
    eingaben: (r) => ({ noten: zahlen(r, 7, 1, 5) }),
    beispiel: { noten: [2, 3, 2, 1, 4, 2, 3] },
    spalten: [
      { titel: 'note', wert: (v) => v.note },
      { titel: 'anzahl', wert: (v) => v.anzahl, liste: true },
    ],
    messzeile: 3,
    frage: 'ausgabe',
  },
];

// ---------- Code-Puzzles: Zeilen in die richtige Reihenfolge bringen ----------
// Geprüft wird nicht stur die Reihenfolge, sondern das Verhalten: Das gelegte Programm muss
// für alle Testeingaben dieselbe Ausgabe liefern wie die Musterlösung. Vertauschbare Zeilen
// (z. B. zwei Startwerte) zählen deshalb auch richtig.

export const PUZZLES = [
  {
    id: 'p-summe-gerade',
    titel: 'Summe der geraden Zahlen',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-2',
    aufgabe: 'Das Programm soll alle geraden Zahlen im Array aufsummieren und die Summe ausgeben.',
    code: `summe = 0
FÜR i = 0 BIS LÄNGE(zahlen) - 1
  WENN zahlen[i] MOD 2 = 0 DANN
    summe = summe + zahlen[i]
  ENDE WENN
ENDE FÜR
AUSGABE summe`,
    tests: [{ zahlen: [3, 4, 7, 10, 12] }, { zahlen: [1, 3, 5] }, { zahlen: [2, 2, 9, 8] }],
  },
  {
    id: 'p-countdown',
    titel: 'Countdown mit kopfgesteuerter Schleife',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-2',
    aufgabe: 'Gib die Zahlen von start abwärts bis 1 aus, danach „Los!".',
    code: `zaehler = start
SOLANGE zaehler > 0
  AUSGABE zaehler
  zaehler = zaehler - 1
ENDE SOLANGE
AUSGABE "Los!"`,
    tests: [{ start: 3 }, { start: 1 }, { start: 0 }],
  },
  {
    id: 'p-note',
    titel: 'Punkte in eine Note umrechnen',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-2',
    aufgabe: 'Ab 92 Punkten gibt es „sehr gut", ab 81 „gut", ab 67 „befriedigend", sonst „nicht ausreichend geprüft".',
    code: `WENN punkte >= 92 DANN
  note = "sehr gut"
SONST WENN punkte >= 81 DANN
  note = "gut"
SONST WENN punkte >= 67 DANN
  note = "befriedigend"
SONST
  note = "nicht ausreichend geprüft"
ENDE WENN
AUSGABE note`,
    tests: [{ punkte: 95 }, { punkte: 81 }, { punkte: 70 }, { punkte: 40 }],
  },
  {
    id: 'p-passwort',
    titel: 'Passwort-Eingabe mit fußgesteuerter Schleife',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-2',
    aufgabe: 'Zähle die Versuche, bis das richtige Passwort aus der Liste der Eingaben kommt oder drei Versuche verbraucht sind.',
    code: `versuche = 0
WIEDERHOLE
  eingabe = eingaben[versuche]
  versuche = versuche + 1
BIS eingabe = "geheim" ODER versuche = 3
AUSGABE versuche`,
    tests: [{ eingaben: ['abc', 'geheim', 'x'] }, { eingaben: ['a', 'b', 'c'] }, { eingaben: ['geheim', 'a', 'b'] }],
  },
  {
    id: 'p-durchschnitt',
    titel: 'Durchschnitt mit Sonderfall leere Liste',
    raum: ['AP2'],
    sp: 'AP2-3-2-1',
    aufgabe: 'Die Funktion soll den Durchschnitt einer Liste zurückgeben und bei einer leeren Liste 0 liefern (keine Division durch null).',
    code: `FUNKTION durchschnitt(liste)
  WENN liste.size() = 0 DANN
    RÜCKGABE 0
  ENDE WENN
  summe = 0
  FÜR JEDES wert IN liste
    summe = summe + wert
  ENDE FÜR
  RÜCKGABE summe / liste.size()
ENDE FUNKTION
AUSGABE durchschnitt(daten)`,
    tests: [{ daten: [2, 4, 9] }, { daten: [] }, { daten: [5] }],
  },
  {
    id: 'p-filtern',
    titel: 'Liste filtern',
    raum: ['AP2'],
    sp: 'AP2-3-2-2',
    aufgabe: 'Übernimm alle Bestellungen ab 100 € in eine neue Liste und gib sie aus.',
    code: `grosse = []
FÜR i = 0 BIS LÄNGE(betraege) - 1
  WENN betraege[i] >= 100 DANN
    grosse.add(betraege[i])
  ENDE WENN
ENDE FÜR
AUSGABE grosse`,
    tests: [{ betraege: [80, 120, 100, 99, 300] }, { betraege: [10] }],
  },
  {
    id: 'p-minimum',
    titel: 'Kleinstes Element mit Position',
    raum: ['AP2'],
    sp: 'AP2-3-2-2',
    aufgabe: 'Finde den kleinsten Wert und seine Position (Index) und gib beides aus.',
    code: `pos = 0
FÜR i = 1 BIS LÄNGE(a) - 1
  WENN a[i] < a[pos] DANN
    pos = i
  ENDE WENN
ENDE FÜR
AUSGABE "Minimum ", a[pos], " an Position ", pos`,
    tests: [{ a: [7, 3, 9, 1, 4] }, { a: [2, 5, 8] }, { a: [9, 9, 3, 3] }],
  },
  {
    id: 'p-lineare-suche',
    titel: 'Lineare Suche',
    raum: ['AP2'],
    sp: 'AP2-3-2-3',
    aufgabe: 'Die Funktion soll die Position des gesuchten Werts zurückgeben oder −1, wenn er nicht vorkommt.',
    code: `FUNKTION suche(liste, gesucht)
  FÜR i = 0 BIS LÄNGE(liste) - 1
    WENN liste[i] = gesucht DANN
      RÜCKGABE i
    ENDE WENN
  ENDE FÜR
  RÜCKGABE -1
ENDE FUNKTION
AUSGABE suche(werte, ziel)`,
    tests: [{ werte: [4, 8, 15, 16], ziel: 15 }, { werte: [4, 8], ziel: 3 }, { werte: [1, 1], ziel: 1 }],
  },
  {
    id: 'p-selection',
    titel: 'Selection Sort',
    raum: ['AP2'],
    sp: 'AP2-3-2-3',
    aufgabe: 'Sortiere aufsteigend: Suche im unsortierten Rest das Minimum und tausche es nach vorn.',
    code: `n = LÄNGE(a)
FÜR i = 0 BIS n - 2
  min = i
  FÜR j = i + 1 BIS n - 1
    WENN a[j] < a[min] DANN
      min = j
    ENDE WENN
  ENDE FÜR
  hilf = a[i]
  a[i] = a[min]
  a[min] = hilf
ENDE FÜR
AUSGABE a`,
    tests: [{ a: [29, 10, 14, 37, 13] }, { a: [3, 2, 1] }, { a: [1, 2, 3, 4] }],
  },
  {
    id: 'p-skript',
    titel: 'Skript: Adressen prüfen und als JSON ausgeben',
    raum: ['AP2'],
    sp: 'AP2-3-4-1',
    aufgabe: 'Für jede Adresse von .1 bis .5 wird pruefe(adresse) aufgerufen; nur erreichbare Adressen (Ergebnis nicht leer) kommen in die Ergebnisliste, die als JSON-Array ausgegeben wird.',
    code: `FUNKTION pruefe(adresse)
  WENN adresse MOD 2 = 1 DANN
    RÜCKGABE "online"
  ENDE WENN
  RÜCKGABE ""
ENDE FUNKTION
ergebnis = []
FÜR host = 1 BIS 5
  status = pruefe(host)
  WENN status <> "" DANN
    ergebnis.add("192.168.0." + host)
  ENDE WENN
ENDE FÜR
AUSGABE ergebnis`,
    tests: [{}],
  },
];

// ---------- Fehlersuche ----------
// Jede Aufgabe: korrekter Code, eine Zeile wird durch eine falsche ersetzt.
// Erwartetes Ergebnis = korrekter Code, tatsächliches = fehlerhafter Code (beide vom Interpreter).

export const FEHLER = [
  {
    id: 'f-grenze',
    titel: 'Schleife endet eine Stelle zu spät',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-4',
    beschreibung: 'Die Funktion soll die Summe aller Werte im Array zurückgeben.',
    code: `FUNKTION summe(werte)
  s = 0
  FÜR i = 0 BIS LÄNGE(werte) - 1
    s = s + werte[i]
  ENDE FÜR
  RÜCKGABE s
ENDE FUNKTION`,
    zeile: 3,
    falsch: '  FÜR i = 0 BIS LÄNGE(werte)',
    alternativen: ['  FÜR i = 1 BIS LÄNGE(werte) - 1', '  FÜR i = 0 BIS LÄNGE(werte) + 1'],
    aufruf: 'summe',
    tests: [[[3, 5, 2]], [[10]], [[1, 2, 3, 4]]],
  },
  {
    id: 'f-startwert',
    titel: 'Falscher Startwert',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-4',
    beschreibung: 'Die Funktion soll das Produkt aller Zahlen von 1 bis n zurückgeben.',
    code: `FUNKTION produkt(n)
  p = 1
  FÜR i = 1 BIS n
    p = p * i
  ENDE FÜR
  RÜCKGABE p
ENDE FUNKTION`,
    zeile: 2,
    falsch: '  p = 0',
    alternativen: ['  p = n', '  p = i'],
    aufruf: 'produkt',
    tests: [[3], [4], [1]],
  },
  {
    id: 'f-vergleich',
    titel: 'Vertauschter Vergleichsoperator',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-4',
    beschreibung: 'Die Funktion soll den größten Wert im Array zurückgeben.',
    code: `FUNKTION maximum(a)
  m = a[0]
  FÜR i = 1 BIS LÄNGE(a) - 1
    WENN a[i] > m DANN
      m = a[i]
    ENDE WENN
  ENDE FÜR
  RÜCKGABE m
ENDE FUNKTION`,
    zeile: 4,
    falsch: '    WENN a[i] < m DANN',
    alternativen: ['    WENN a[i] = m DANN', '    WENN a[i] > a[0] DANN'],
    aufruf: 'maximum',
    tests: [[[3, 9, 4]], [[7, 2, 5]], [[1, 1, 8]]],
  },
  {
    id: 'f-rabatt',
    titel: 'Grenze falsch gesetzt',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-4',
    beschreibung: 'Ab einem Bestellwert von 500 € (einschließlich) gibt es 5 % Rabatt. Die Funktion soll den Rechnungsbetrag zurückgeben.',
    code: `FUNKTION betrag(wert)
  WENN wert >= 500 DANN
    RÜCKGABE wert * 0.95
  ENDE WENN
  RÜCKGABE wert
ENDE FUNKTION`,
    zeile: 2,
    falsch: '  WENN wert > 500 DANN',
    alternativen: ['  WENN wert <= 500 DANN', '  WENN wert >= 5 DANN'],
    aufruf: 'betrag',
    tests: [[400], [500], [800]],
  },
  {
    id: 'f-zaehler',
    titel: 'Zähler wird nicht erhöht',
    raum: ['AP1', 'AP2'],
    sp: 'AP1-8-2-4',
    beschreibung: 'Die Funktion soll zählen, wie viele Werte negativ sind.',
    code: `FUNKTION negative(a)
  anzahl = 0
  FÜR i = 0 BIS LÄNGE(a) - 1
    WENN a[i] < 0 DANN
      anzahl = anzahl + 1
    ENDE WENN
  ENDE FÜR
  RÜCKGABE anzahl
ENDE FUNKTION`,
    zeile: 5,
    falsch: '      anzahl = 1',
    alternativen: ['      anzahl = anzahl - 1', '      anzahl = a[i]'],
    aufruf: 'negative',
    tests: [[[-2, 5, -1, -7]], [[3, 4]], [[-1, 0, 2]]],
  },
  {
    id: 'f-schnitt',
    titel: 'Durchschnitt durch die falsche Zahl geteilt',
    raum: ['AP2'],
    sp: 'AP2-5-2-3',
    beschreibung: 'Die Funktion soll den Durchschnitt der Werte zurückgeben.',
    code: `FUNKTION schnitt(a)
  summe = 0
  FÜR i = 0 BIS LÄNGE(a) - 1
    summe = summe + a[i]
  ENDE FÜR
  RÜCKGABE summe / LÄNGE(a)
ENDE FUNKTION`,
    zeile: 6,
    falsch: '  RÜCKGABE summe / (LÄNGE(a) - 1)',
    alternativen: ['  RÜCKGABE summe DIV LÄNGE(a)', '  RÜCKGABE LÄNGE(a) / summe'],
    aufruf: 'schnitt',
    tests: [[[2, 4, 6]], [[1, 2]], [[3, 4, 4, 6]]],
  },
  {
    id: 'f-suche',
    titel: 'Schleife beginnt eine Stelle zu spät',
    raum: ['AP2'],
    sp: 'AP2-5-2-3',
    beschreibung: 'Die Funktion soll die Position des ersten Vorkommens zurückgeben, sonst −1.',
    code: `FUNKTION position(a, x)
  FÜR i = 0 BIS LÄNGE(a) - 1
    WENN a[i] = x DANN
      RÜCKGABE i
    ENDE WENN
  ENDE FÜR
  RÜCKGABE -1
ENDE FUNKTION`,
    zeile: 2,
    falsch: '  FÜR i = 1 BIS LÄNGE(a) - 1',
    alternativen: ['  FÜR i = 0 BIS LÄNGE(a)', '  FÜR i = LÄNGE(a) - 1 BIS 0'],
    aufruf: 'position',
    tests: [[[5, 7, 9], 5], [[5, 7, 5], 5], [[5, 7, 9], 4]],
  },
  {
    id: 'f-tausch',
    titel: 'Tausch ohne Hilfsvariable',
    raum: ['AP2'],
    sp: 'AP2-5-2-3',
    beschreibung: 'Die Funktion soll die Elemente an den Positionen i und j tauschen und das Array zurückgeben.',
    code: `FUNKTION tausche(a, i, j)
  hilf = a[i]
  a[i] = a[j]
  a[j] = hilf
  RÜCKGABE a
ENDE FUNKTION`,
    zeile: 4,
    falsch: '  a[j] = a[i]',
    alternativen: ['  a[i] = hilf', '  hilf = a[j]'],
    aufruf: 'tausche',
    tests: [[[1, 2, 3], 0, 2], [[4, 5], 0, 1]],
  },
];

export function fehlerCode(f) {
  const zeilen = f.code.split('\n');
  zeilen[f.zeile - 1] = f.falsch;
  return zeilen.join('\n');
}
