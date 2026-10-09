// Der Lernweg des Zahlen-Trainers (Raum „Verstehen“): Themen-Blöcke und Lektionen in fester Reihenfolge.
// Rein und ohne Browser-Abhängigkeit, getestet in tests/zahlen-lernweg.test.mjs. Abfragen: lernweg/lernweg.js.
//
// Felder einer Lektion wie im Subnetz-Lernweg (siehe lernweg/lernweg.js); kompetenzen: Können-IDs aus der
// Inhaltsdatei (AP1-4-2-1, AP1-4-2-2, AP1-4-2-3, AP1-5-2-3, AP2-5-5-3, AP2-6-6-3). raeume: ['AP2'] für das
// Paritätsbit, das nur in AP2 geprüft wird. Erklärung und Ausprobieren (JSX) stehen je Block in inhalt/.

import { baueLernweg } from '../../lernweg/lernweg.js';

export const BLOECKE = [
  { id: 'zahlensysteme', titel: 'Zahlensysteme', text: 'Dezimal, binär, hexadezimal: wie Stellenwerte funktionieren und wie man umrechnet.' },
  { id: 'datenmengen', titel: 'Datenmengen', text: 'Bit und Byte, kB und KiB, Speicherbedarf und Übertragungsdauer.' },
  { id: 'bits', titel: 'Bits in der Praxis', text: 'Dateirechte mit chmod und das Paritätsbit – Bits, die etwas bedeuten.' },
  { id: 'strom', titel: 'Leistung und Stromkosten', text: 'P = U · I, Netzteil und Wirkungsgrad, Energie in kWh und was sie kostet.' },
];

const L = [
  // ---------- Block 1: Zahlensysteme ----------
  {
    id: 'stellenwert',
    block: 'zahlensysteme',
    begriff: 'Stellenwertsystem',
    leitfrage: 'Warum ist die 3 in 300 mehr wert als in 30?',
    braucht: [],
    kompetenzen: ['AP1-4-2-1-K1'],
    definition:
      'In einem **Stellenwertsystem** hängt der Wert einer Ziffer von ihrer Stelle ab. Jede Stelle hat einen **Stellenwert**, eine Potenz der **Basis**: im Dezimalsystem (Basis 10) 1, 10, 100 …, im Binärsystem (Basis 2) 1, 2, 4 …, im Hexadezimalsystem (Basis 16) 1, 16, 256 … Der Wert der Zahl ist die Summe aus Ziffer · Stellenwert.',
    merksatz: 'Basis b: Ziffern 0 bis b − 1, Stellenwerte von rechts b⁰ = 1, b¹, b², …',
    fehler: [
      { falsch: 'Im Binärsystem gibt es die Ziffer 2.', richtig: 'Die größte Ziffer ist immer Basis − 1. Im Binärsystem (Basis 2) gibt es nur 0 und 1.' },
      { falsch: 'Die Stellenwerte zählt man von links.', richtig: 'Von rechts: Die rechte Stelle hat immer den Stellenwert 1 (Basis hoch 0).' },
    ],
    uebung: 'zahlensysteme',
  },
  {
    id: 'binaer',
    block: 'zahlensysteme',
    begriff: 'Binärzahl',
    leitfrage: 'Wie liest man eine Zahl aus Nullen und Einsen?',
    braucht: ['stellenwert'],
    kompetenzen: ['AP1-4-2-1-K1'],
    definition:
      'Eine **Binärzahl** (Dualzahl) ist eine Zahl im Stellenwertsystem zur Basis 2. Sie hat nur die Ziffern 0 und 1; jede Ziffer ist ein **Bit**. Die Stellenwerte sind von rechts 1, 2, 4, 8, 16, 32, 64, 128 … Den Dezimalwert erhält man, indem man die Stellenwerte aller Einsen addiert.',
    merksatz: 'Stellenwerte 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1 – die über den Einsen addieren.',
    fehler: [
      { falsch: '`1010` binär ist „tausendzehn“.', richtig: '`1010` binär = 8 + 2 = 10. Man liest die Ziffern einzeln: „eins-null-eins-null“.' },
      { falsch: 'Die linke Stelle hat den Stellenwert 1.', richtig: 'Rechts steht der Stellenwert 1, nach links verdoppelt er sich.' },
    ],
    uebung: 'zahlensysteme',
  },
  {
    id: 'dezimal-binaer',
    block: 'zahlensysteme',
    begriff: 'Dezimal in binär umrechnen',
    leitfrage: 'Wie wird aus 200 eine Binärzahl?',
    braucht: ['binaer'],
    kompetenzen: ['AP1-4-2-1-K1'],
    definition:
      'Beim **Restwertverfahren** teilt man die Dezimalzahl fortlaufend durch 2 und notiert die Reste, bis der Quotient 0 ist. Die Reste **von unten nach oben** gelesen ergeben die Binärzahl. Alternativ zieht man beim **Stellenwertverfahren** von links die passenden Stellenwerte ab. Zur Probe rechnet man das Ergebnis zurück.',
    merksatz: 'Durch 2 teilen, bis 0 herauskommt. Reste von unten nach oben lesen. Probe machen.',
    fehler: [
      { falsch: 'Die Reste von oben nach unten lesen.', richtig: 'Der erste Rest ist das Bit ganz rechts (Stellenwert 1). Darum von unten nach oben lesen.' },
      { falsch: 'Aufhören, wenn der Quotient 1 ist.', richtig: 'Weiterteilen, bis der Quotient 0 ist: 1 ÷ 2 = 0 Rest 1. Diese letzte 1 ist das linke Bit.' },
    ],
    uebung: 'zahlensysteme',
  },
  {
    id: 'zweierpotenzen',
    block: 'zahlensysteme',
    begriff: 'Zweierpotenzen',
    leitfrage: 'Wie viele Werte passen in n Bit?',
    braucht: ['binaer'],
    kompetenzen: ['AP1-4-2-1-K2', 'AP1-4-2-2-K2'],
    definition:
      'Mit **n Bit** lassen sich **2ⁿ verschiedene Werte** darstellen, als Zahl von 0 bis 2ⁿ − 1. Die Zweierpotenzen bis 2¹⁰: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1.024. Beispiel Farbtiefe: 24 Bit (je 8 Bit für Rot, Grün und Blau) ergeben 2²⁴ = 16.777.216 Farben.',
    merksatz: 'n Bit → 2ⁿ Werte → größte Zahl 2ⁿ − 1. Jedes Bit mehr verdoppelt.',
    fehler: [
      { falsch: 'Mit 8 Bit ist die größte Zahl 256.', richtig: '8 Bit ergeben 256 Werte, die größte Zahl ist aber 255 – die 0 zählt mit.' },
      { falsch: '2³ = 6', richtig: '2³ = 2 · 2 · 2 = 8. Die Hochzahl sagt, wie oft man die 2 mit sich selbst malnimmt.' },
      { falsch: '24 Bit Farbtiefe = 24 Farben', richtig: '24 Bit Farbtiefe = 2²⁴ = 16.777.216 Farben.' },
    ],
    uebung: 'zahlensysteme',
  },
  {
    id: 'hex',
    block: 'zahlensysteme',
    begriff: 'Hexadezimalzahl',
    leitfrage: 'Wie schreibt man 4 Bit mit einem Zeichen?',
    braucht: ['dezimal-binaer', 'zweierpotenzen'],
    kompetenzen: ['AP1-4-2-1-K1'],
    definition:
      'Eine **Hexadezimalzahl** ist eine Zahl zur Basis 16 mit den Ziffern 0–9 und A–F (A = 10 … F = 15). Eine Hex-Ziffer entspricht genau **4 Bit**, ein Byte also zwei Hex-Ziffern (00 bis FF). Binär → hexadezimal: von rechts in Vierergruppen teilen und jede Gruppe übersetzen. Hexadezimal → dezimal: Stellenwerte 1, 16, 256, 4.096 …',
    merksatz: 'Eine Hex-Ziffer = 4 Bit. A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.',
    fehler: [
      { falsch: 'Vierergruppen von links bilden.', richtig: 'Immer von rechts gruppieren und links mit Nullen auffüllen: `1 0110 1010` → `0001 0110 1010` = 16A.' },
      { falsch: 'Den Wert 12 als Hex-Ziffer „12“ schreiben.', richtig: 'Werte ab 10 sind Buchstaben: 12 = C. „12“ hexadezimal wären zwei Ziffern und damit 18 dezimal.' },
    ],
    uebung: 'zahlensysteme',
  },

  // ---------- Block 2: Datenmengen ----------
  {
    id: 'bit-byte',
    block: 'datenmengen',
    begriff: 'Bit und Byte',
    leitfrage: 'Wie viel ist ein Byte?',
    braucht: ['zweierpotenzen'],
    kompetenzen: ['AP1-4-2-1-K5'],
    definition:
      'Ein **Bit** ist die kleinste Informationseinheit: 0 oder 1. **8 Bit ergeben 1 Byte.** Ein Byte kann 2⁸ = 256 verschiedene Werte annehmen (0 bis 255). Umrechnen: Bit ÷ 8 = Byte, Byte · 8 = Bit. Abkürzungen: **bit** (oder b) für Bit, **B** für Byte – 100 Mbit/s sind also nicht 100 MB/s.',
    merksatz: 'Bit → Byte: ÷ 8. Byte → Bit: · 8. Kleines b = Bit, großes B = Byte.',
    fehler: [
      { falsch: '100 Mbit/s = 100 MB/s', richtig: '100 Mbit/s ÷ 8 = 12,5 MB/s. Übertragungsraten stehen in Bit, Dateigrößen in Byte.' },
      { falsch: 'Bei Byte → Bit durch 8 teilen.', richtig: 'Bit sind die kleinere Einheit, also werden es mehr: Byte · 8 = Bit.' },
    ],
    uebung: 'praefixe',
  },
  {
    id: 'praefixe',
    block: 'datenmengen',
    begriff: 'Dezimal- und Binärpräfixe',
    leitfrage: 'Sind 1 kB 1.000 oder 1.024 Byte?',
    braucht: ['zweierpotenzen', 'bit-byte'],
    kompetenzen: ['AP1-4-2-1-K3', 'AP1-4-2-1-K4', 'AP2-6-6-3-K2'],
    definition:
      '**Dezimalpräfixe** sind Potenzen von 1.000: 1 kB = 1.000 Byte, 1 MB = 1.000² Byte, 1 GB = 1.000³ Byte, 1 TB = 1.000⁴ Byte. **Binärpräfixe** sind Potenzen von 1.024: 1 KiB = 1.024 Byte, 1 MiB = 1.024² Byte, 1 GiB = 1.024³ Byte, 1 TiB = 1.024⁴ Byte. In der Prüfung stehen Datenmengen mit Binärpräfix, Übertragungsraten mit Dezimalpräfix; Hersteller von Datenträgern rechnen dezimal. Umgerechnet wird immer über Byte.',
    merksatz: 'Mit „i“ (KiB, MiB, GiB) → 1.024. Ohne „i“ (kB, MB, GB) → 1.000. Immer über Byte umrechnen.',
    fehler: [
      {
        falsch: 'Die Festplatte hat weniger Speicher als angegeben.',
        richtig: '1 TB = 10¹² Byte ≈ 931,32 GiB. Der Hersteller rechnet dezimal, das Betriebssystem zeigt oft binär an.',
      },
      { falsch: 'GB → GiB: mal 1,024', richtig: 'Über Byte rechnen: GB · 1.000³ = Byte, dann ÷ 1.024³. Der Faktor ist 1,024³, nicht 1,024.' },
      { falsch: 'kB und KiB: der Unterschied ist egal.', richtig: 'Bei Kilo sind es 2,4 %, bei Tera schon fast 10 %. In der Prüfung zählt die richtige Einheit.' },
    ],
    uebung: 'praefixe',
  },
  {
    id: 'speicherbedarf',
    block: 'datenmengen',
    begriff: 'Speicherbedarf',
    leitfrage: 'Wie viel Speicher braucht ein Bild?',
    braucht: ['zweierpotenzen', 'praefixe'],
    kompetenzen: ['AP1-4-2-2-K1', 'AP1-4-2-2-K5', 'AP1-4-2-2-K6', 'AP2-6-6-3-K1', 'AP2-6-6-3-K3', 'AP2-6-6-3-K5'],
    definition:
      'Der **Speicherbedarf** ist **Anzahl der Werte · Bit je Wert**. Für ein unkomprimiertes Bild: **Breite · Höhe · Farbtiefe** (Bit je Bildpunkt). Das Ergebnis in Bit teilt man durch 8 (→ Byte) und je Stufe durch 1.024 (→ KiB, MiB, GiB). Ein **Megapixel** sind 1.000.000 Bildpunkte. Für einen Zeitraum multipliziert man mit der Anzahl, z. B. Bilder je Tag · Tage. Mehrbedarf in Prozent: (neu − alt) ÷ alt · 100.',
    merksatz: 'Anzahl · Bit je Wert, ÷ 8, ÷ 1.024 je Stufe. Rechenweg hinschreiben, erst am Ende runden.',
    fehler: [
      { falsch: '24 Bit Farbtiefe = 24 Byte je Bildpunkt', richtig: '24 Bit = 3 Byte je Bildpunkt (24 ÷ 8).' },
      { falsch: 'Zwischenergebnisse runden.', richtig: 'Mit den vollen Zahlen weiterrechnen und erst das Endergebnis auf die verlangte Stellenzahl runden.' },
      { falsch: '12 Megapixel = 12 · 1.024 · 1.024 Bildpunkte', richtig: 'Megapixel ist ein Dezimalpräfix: 12 · 1.000.000 Bildpunkte.' },
    ],
    uebung: 'datenmenge',
  },
  {
    id: 'uebertragung',
    block: 'datenmengen',
    begriff: 'Übertragungsdauer',
    leitfrage: 'Wie lange dauert ein Download?',
    braucht: ['bit-byte', 'praefixe'],
    kompetenzen: ['AP1-4-2-2-K3', 'AP1-4-2-2-K4', 'AP2-6-6-3-K4', 'AP2-6-6-3-K5'],
    definition:
      'Die **Übertragungsdauer** ist **Datenmenge ÷ Übertragungsrate**. Vorher bringt man beide Größen auf Bit: die Datenmenge (in Byte mit Binärpräfix, z. B. GiB) mit · 1.024ⁿ · 8, die Übertragungsrate (in Bit je Sekunde mit Dezimalpräfix, z. B. Mbit/s) mit · 1.000ⁿ. Das Ergebnis in Sekunden rechnet man bei Bedarf in Minuten und Sekunden um.',
    merksatz: 'Beides in Bit: Menge · 1.024ⁿ · 8, Rate · 1.000ⁿ. Dann Menge ÷ Rate = Sekunden.',
    fehler: [
      { falsch: '1 GiB bei 100 Mbit/s dauert 1 ÷ 100 s.', richtig: 'Erst die Einheiten angleichen: 1 · 1.024³ · 8 Bit ÷ 100.000.000 bit/s ≈ 85,90 s.' },
      { falsch: 'Das · 8 vergessen.', richtig: 'Byte → Bit heißt · 8. Ohne diesen Schritt ist das Ergebnis achtmal zu klein.' },
      { falsch: '130 s = 1,3 min', richtig: '130 s = 2 min 10 s (130 ÷ 60 = 2 Rest 10).' },
    ],
    uebung: 'uebertragung',
  },

  // ---------- Block 3: Bits in der Praxis ----------
  {
    id: 'dateirechte',
    block: 'bits',
    begriff: 'Dateirechte mit chmod',
    leitfrage: 'Was bedeutet chmod 754?',
    braucht: ['binaer'],
    kompetenzen: ['AP1-5-2-3-K3', 'AP1-5-2-3-K5'],
    definition:
      '**chmod** (change mode) ändert unter Linux die Zugriffsrechte einer Datei. Es gibt drei Rechte – **r** lesen (4), **w** schreiben (2), **x** ausführen (1) – für drei Klassen: **Besitzer**, **Gruppe** und **andere**. Je Klasse werden die Werte addiert; so entsteht eine dreistellige Oktalzahl. Beispiel: `chmod 754` = `rwx` für den Besitzer, `r-x` für die Gruppe, `r--` für andere.',
    merksatz: 'r = 4, w = 2, x = 1 – je Klasse addieren. Reihenfolge: Besitzer, Gruppe, andere.',
    fehler: [
      { falsch: 'Eine 7 heißt „alles für alle“.', richtig: 'Jede Ziffer gilt nur für eine Klasse. Die 7 an erster Stelle heißt: alles für den Besitzer.' },
      { falsch: '6 = lesen und ausführen', richtig: '6 = 4 + 2 = lesen und schreiben. Lesen und ausführen ist 4 + 1 = 5.' },
    ],
    uebung: 'rechte',
  },
  {
    id: 'paritaet',
    block: 'bits',
    begriff: 'Paritätsbit',
    leitfrage: 'Wie merkt der Empfänger, dass ein Bit gekippt ist?',
    braucht: ['binaer'],
    raeume: ['AP2'],
    kompetenzen: ['AP2-5-5-3-K1', 'AP2-5-5-3-K2', 'AP2-5-5-3-K3'],
    definition:
      'Ein **Paritätsbit** ist ein zusätzliches Bit, das die Anzahl der Einsen auf eine gerade (**gerade Parität**) oder ungerade Zahl (**ungerade Parität**) ergänzt. Der Empfänger zählt die Einsen nach; stimmt die Parität nicht, ist ein Fehler erkannt. Ein Paritätsbit erkennt einen einzelnen Bitfehler, kann ihn aber nicht berichtigen; zwei Fehler gleichzeitig bleiben unentdeckt. Es ist ein Beispiel für **Redundanz**: zusätzliche Information, die nur zur Fehlererkennung mitgesendet wird.',
    merksatz: 'Einsen zählen und auf gerade bzw. ungerade ergänzen. Erkennt einen Fehler, berichtigt keinen.',
    fehler: [
      { falsch: 'Das Paritätsbit zeigt, welches Bit falsch ist.', richtig: 'Es zeigt nur, dass etwas nicht stimmt – nicht wo. Berichtigen kann es darum nicht.' },
      { falsch: 'Bei gerader Parität ist das Paritätsbit immer 0.', richtig: 'Es wird so gewählt, dass die Gesamtzahl der Einsen gerade ist – je nach Daten 0 oder 1.' },
    ],
    uebung: 'paritaet',
  },

  // ---------- Block 4: Leistung und Stromkosten ----------
  {
    id: 'leistung',
    block: 'strom',
    begriff: 'Elektrische Leistung',
    leitfrage: 'Wie groß muss das Netzteil sein?',
    braucht: [],
    kompetenzen: ['AP1-4-2-3-K1', 'AP1-4-2-3-K2', 'AP1-4-2-3-K4'],
    definition:
      'Die **elektrische Leistung** P in Watt (W) ist **Spannung mal Stromstärke**: P = U · I (W = V · A). Umgestellt: I = P ÷ U und U = P ÷ I. Für ein Netzteil addiert man die Leistungsaufnahme aller Komponenten, rechnet einen Zuschlag ein und wählt das kleinste Netzteil, das mindestens diesen Bedarf liefert. Der **Wirkungsgrad** η (eta) ist abgegebene ÷ aufgenommene Leistung; aufgenommen wird also abgegebene Leistung ÷ η.',
    merksatz: 'P = U · I. Netzteil: Summe · (1 + Zuschlag), dann aufrunden. Aufgenommen = abgegeben ÷ η.',
    fehler: [
      { falsch: 'Aufgenommene Leistung = abgegebene Leistung · η', richtig: 'Aufgenommen ist immer mehr als abgegeben: abgegeben ÷ η, z. B. 400 W ÷ 0,9 = 444,44 W.' },
      { falsch: '20 % Zuschlag: Summe + 20', richtig: '20 % Zuschlag: Summe · 1,2.' },
      { falsch: 'Das Netzteil abrunden, wenn es knapp ist.', richtig: 'Immer das nächstgrößere Netzteil wählen, das den Bedarf mit Zuschlag mindestens liefert.' },
    ],
    uebung: 'energie',
  },
  {
    id: 'energie',
    block: 'strom',
    begriff: 'Energie und Stromkosten',
    leitfrage: 'Was kostet ein Server im Jahr?',
    braucht: ['leistung'],
    kompetenzen: ['AP1-4-2-3-K3', 'AP1-4-2-3-K5'],
    definition:
      'Die **elektrische Energie** W ist Leistung mal Zeit: **W = P · t**. Mit P in Watt und t in Stunden erhält man Wattstunden (Wh); 1 **kWh** = 1.000 Wh. Die **Stromkosten** sind Energie in kWh · Preis je kWh. Für ein Jahr rechnet man die Betriebsstunden hoch, z. B. 24 h · 365 Tage = 8.760 h.',
    merksatz: 'kWh = Watt · Stunden ÷ 1.000. Kosten = kWh · Preis je kWh.',
    fehler: [
      { falsch: 'Watt und kWh verwechseln.', richtig: 'Watt ist die Leistung (wie viel gerade fließt), kWh die Energie (wie viel über die Zeit zusammenkommt).' },
      { falsch: 'Minuten direkt einsetzen.', richtig: 'Die Zeit in Stunden umrechnen: 30 min = 0,5 h, 90 min = 1,5 h.' },
      { falsch: 'Wh als kWh nehmen.', richtig: 'Wh ÷ 1.000 = kWh. 300 Wh sind 0,3 kWh.' },
    ],
    uebung: 'energie',
  },
];

export const LERNWEG = { trainer: 'zahlen', schluessel: 'zahlen.lernweg', bloecke: BLOECKE, lektionen: L };

// Ohne Raum: alle Lektionen (für Tests); die Ansicht baut den Lernweg je Raum (lernweg/Verstehen.jsx)
export const { LEKTIONEN, lektion, lektionenIn, blockVon, naechsteLektion, status, luecken } = baueLernweg(LERNWEG);
