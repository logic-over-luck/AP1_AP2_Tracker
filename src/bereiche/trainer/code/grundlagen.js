// Spickzettel „Grundlagen" des Pseudocode-Trainers. Alle Code-Beispiele laufen im Interpreter
// (geprüft in tests/code.test.mjs), außer sie sind als „nur lesen" markiert.

export const GRUNDLAGEN = [
  {
    titel: 'Variablen, Zuweisung und Datentypen',
    raum: ['AP1', 'AP2'],
    text: 'Eine Variable ist ein benannter Speicherplatz für einen Wert. Mit `=` oder `←` wird zugewiesen.',
    code: `// Die vier wichtigsten Datentypen
GANZZAHL alter = 21          // Ganzzahl (Integer)
KOMMAZAHL preis = 19.99      // Kommazahl (Float/Double)
TEXT status = "In Prüfung"   // Zeichenkette (String)
BOOLEAN gueltig = WAHR       // Wahrheitswert`,
    hinweis: 'In Bedingungen heißt = „ist gleich". Viele Programmiersprachen unterscheiden: = weist zu, == vergleicht.',
  },
  {
    titel: 'Verzweigung: WENN … DANN',
    raum: ['AP1', 'AP2'],
    text: 'Ein Block wird nur ausgeführt, wenn die Bedingung WAHR ist. Mehrere Fälle mit SONST WENN, der Rest mit SONST.',
    code: `punkte = 42
WENN punkte >= 50 DANN
  ergebnis = "Bestanden"
SONST WENN punkte >= 30 DANN
  ergebnis = "Ergänzungsprüfung"
SONST
  ergebnis = "Nicht bestanden"
ENDE WENN`,
    hinweis: 'Logische Operatoren: UND, ODER, NICHT. Vergleiche: = ≠ < ≤ > ≥ (auch <> und != für „ungleich").',
  },
  {
    titel: 'Zählschleife: FÜR',
    raum: ['AP1', 'AP2'],
    text: 'Wenn die Anzahl der Durchläufe vorher feststeht. Die Zählvariable läuft vom Start- bis einschließlich Endwert.',
    code: `summe = 0
FÜR i = 1 BIS 5
  summe = summe + i
ENDE FÜR
// summe ist jetzt 15

FÜR k = 10 BIS 0 SCHRITT -2
  AUSGABE k
ENDE FÜR`,
    hinweis: 'BIS ist einschließlich: FÜR i = 0 BIS 3 läuft viermal (0, 1, 2, 3).',
  },
  {
    titel: 'Kopfgesteuerte Schleife: SOLANGE',
    raum: ['AP1', 'AP2'],
    text: 'Die Bedingung wird vor jedem Durchlauf geprüft. Ist sie gleich zu Beginn FALSCH, läuft die Schleife kein einziges Mal.',
    code: `zahl = 4711
q = 0
SOLANGE zahl > 0
  q = q + zahl MOD 10
  zahl = zahl DIV 10
ENDE SOLANGE
// q ist die Quersumme 13`,
    hinweis: 'In der Schleife muss sich etwas ändern, das die Bedingung irgendwann FALSCH macht – sonst entsteht eine Endlosschleife.',
  },
  {
    titel: 'Fußgesteuerte Schleife: WIEDERHOLE … BIS',
    raum: ['AP1', 'AP2'],
    text: 'Die Bedingung wird erst nach dem Durchlauf geprüft: Der Rumpf läuft mindestens einmal. Die Schleife endet, sobald die Bedingung hinter BIS WAHR ist.',
    code: `versuche = 0
WIEDERHOLE
  versuche = versuche + 1
BIS versuche = 3`,
    hinweis: 'Manche schreiben WIEDERHOLE … SOLANGE Bedingung (Schleife läuft, solange WAHR). Achte darauf, welche Form verwendet wird.',
  },
  {
    titel: 'Arrays und Listen',
    raum: ['AP1', 'AP2'],
    text: 'Ein Array speichert mehrere Werte unter einem Namen. Der Zugriff erfolgt über den Index, der bei 0 beginnt.',
    code: `werte = [4, 10, 2, 7]
erstes = werte[0]                  // 4
letztes = werte[LÄNGE(werte) - 1]  // 7
werte[1] = 99                      // ändert das zweite Element`,
    hinweis: 'Der letzte gültige Index ist LÄNGE − 1. Ein Zugriff auf werte[LÄNGE(werte)] liegt hinter dem Ende – ein typischer Fehler.',
  },
  {
    titel: 'Funktionen und Prozeduren',
    raum: ['AP1', 'AP2'],
    text: 'Eine Funktion ist ein benannter Codeblock mit Parametern und Rückgabewert. Eine Prozedur hat keinen Rückgabewert.',
    code: `FUNKTION brutto(netto, satz)
  RÜCKGABE netto + netto * satz / 100
ENDE FUNKTION

preis = brutto(100, 19)   // 119`,
    hinweis: 'Beim Aufruf werden die Argumente in der Reihenfolge der Parameter übergeben. RÜCKGABE beendet die Funktion sofort.',
  },
  {
    titel: 'Rechnen: DIV, MOD und Prozent',
    raum: ['AP1', 'AP2'],
    text: 'DIV teilt ganzzahlig ohne Rest, MOD liefert den Rest. / teilt mit Nachkommastellen.',
    code: `a = 17 DIV 5      // 3
b = 17 MOD 5      // 2
c = 17 / 5        // 3,4
rabatt = 80 * 15 / 100   // 12
gerade = 8 MOD 2 = 0     // WAHR`,
    hinweis: 'Mit MOD 2 prüfst du, ob eine Zahl gerade ist. Mit MOD 10 und DIV 10 zerlegst du eine Zahl in ihre Ziffern.',
  },
  {
    titel: 'Typische Muster',
    raum: ['AP1', 'AP2'],
    text: 'Fast jede Aufgabe ist eine Variante dieser Muster: summieren, zählen, Größtes/Kleinstes suchen, Durchschnitt bilden.',
    code: `werte = [3, 8, 5]
summe = 0
anzahlGross = 0
max = werte[0]
FÜR i = 0 BIS LÄNGE(werte) - 1
  summe = summe + werte[i]
  WENN werte[i] > 4 DANN
    anzahlGross = anzahlGross + 1
  ENDE WENN
  WENN werte[i] > max DANN
    max = werte[i]
  ENDE WENN
ENDE FÜR
schnitt = summe / LÄNGE(werte)`,
    hinweis: 'Startwerte: Summe und Zähler beginnen bei 0, ein Produkt bei 1, das Maximum beim ersten Element.',
  },
  {
    titel: 'Schreibtischtest: so gehst du vor',
    raum: ['AP1', 'AP2'],
    text: 'Code von Hand mit gegebenen Werten durchgehen und jede Änderung in einer Tabelle notieren.',
    liste: [
      'Für jede Variable eine Spalte anlegen, Startwerte in die erste Zeile',
      'Zeile für Zeile ausführen, nur geänderte Werte neu eintragen',
      'Bei jeder Bedingung das Ergebnis (WAHR/FALSCH) notieren',
      'Schleifenende prüfen: läuft BIS einschließlich?',
      'Ganzzahldivision (DIV) und Rundung genau so ausführen wie verlangt',
    ],
  },
  {
    titel: 'Fehlerarten und Debugging',
    raum: ['AP1', 'AP2'],
    text: 'Formale (syntaktische) Fehler verletzen die Regeln der Sprache – das Programm startet nicht. Inhaltliche (semantische, logische) Fehler: Das Programm läuft, liefert aber ein falsches Ergebnis.',
    liste: [
      'falsche Schleifengrenze (eine Stelle zu früh oder zu spät)',
      'vertauschter Vergleichsoperator (< statt >)',
      'falscher oder fehlender Startwert',
      'Division durch null, Zugriff hinter das Array-Ende',
      'Debugging: Programm schrittweise ausführen, Haltepunkte setzen, Variablenwerte beobachten',
    ],
  },
  {
    titel: 'Listen mit vorgegebenen Methoden',
    raum: ['AP2'],
    text: 'In AP2 sind Klassen, Listen und Hilfsmethoden oft vorgegeben. Verwende sie genau so, wie sie in der Aufgabe stehen.',
    code: `ergebnis = []
ergebnis.add(5)
ergebnis.add(8)
anzahl = ergebnis.size()     // 2
erstes = ergebnis.get(0)     // 5
WENN ergebnis.size() = 0 DANN
  AUSGABE "Liste ist leer"
ENDE WENN`,
    hinweis: 'Sonderfälle abfangen: leere Liste, Division durch null, ungültige Eingaben – das bringt in AP2 Punkte.',
  },
  {
    titel: 'Klassen und Objekte nutzen',
    raum: ['AP2'],
    text: 'Aus dem Klassendiagramm liest du ab, welche Attribute und Methoden es gibt. Private Attribute erreichst du über Getter und Setter.',
    code: `// nur lesen – Beispiel für eine Methode, die eine Klasse nutzt
FUNKTION teureArtikel(artikelliste, grenze)
  ergebnis = NEU Liste()
  FÜR JEDES a IN artikelliste
    WENN a.getPreis() > grenze DANN
      ergebnis.add(a)
    ENDE WENN
  ENDE FÜR
  RÜCKGABE ergebnis
ENDE FUNKTION

k = NEU Kunde("Meier", 42)   // Konstruktor erzeugt ein Objekt`,
    nurLesen: true,
    hinweis: 'Objekt mit NEU und Konstruktor erzeugen, dann Methoden mit Punkt aufrufen: objekt.methode(argumente).',
  },
  {
    titel: 'Ausnahmen',
    raum: ['AP2'],
    text: 'Bei ungültigen Eingaben kann eine Funktion eine Ausnahme auslösen statt eines falschen Ergebnisses. Der Aufrufer fängt sie ab.',
    code: `// nur lesen
FUNKTION teile(a, b)
  WENN b = 0 DANN
    WIRF Ausnahme("Division durch null")
  ENDE WENN
  RÜCKGABE a / b
ENDE FUNKTION

VERSUCHE
  x = teile(10, 0)
FANGE Ausnahme e
  AUSGABE "Fehler: ", e.nachricht
ENDE VERSUCHE`,
    nurLesen: true,
  },
  {
    titel: 'Skripte: PowerShell, Bash, Python',
    raum: ['AP2'],
    text: 'Wiederkehrende Abläufe (Datensicherung, Benutzer anlegen, Protokolle auswerten, Dienste überwachen) automatisiert man mit Skripten. Die genaue Syntax einer Shell wird nicht verlangt – Pseudocode genügt.',
    code: `// nur lesen – dieselbe Schleife in drei Sprachen
// Python:      for i in range(1, 6):
// PowerShell:  foreach ($i in 1..5) { … }
// Bash:        for i in {1..5}; do … done

ergebnis = []
FÜR host = 1 BIS 254
  adresse = "192.168.0." + host
  WENN pruefe(adresse) <> "" DANN
    ergebnis.add(adresse)
  ENDE WENN
ENDE FÜR
AUSGABE ergebnis   // als JSON-Array: ["192.168.0.1", …]`,
    nurLesen: true,
  },
  {
    titel: 'Suchen und Sortieren',
    raum: ['AP2'],
    text: 'Lineare Suche prüft der Reihe nach. Binäre Suche halbiert den Bereich – nur bei sortierten Daten.',
    liste: [
      'Bubble Sort: benachbarte Elemente vergleichen und tauschen; das Größte wandert nach hinten',
      'Selection Sort: kleinstes Element im Rest suchen und nach vorn tauschen',
      'Insertion Sort: nächstes Element in den sortierten Teil einfügen',
      'Tausch immer über eine Hilfsvariable: hilf = a; a = b; b = hilf',
    ],
  },
];
