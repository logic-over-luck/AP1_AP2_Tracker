// Kurz-Check am Ende jeder Zahlen-Lektion: 3 Fragen. Rein, getestet in tests/zahlen-lernweg.test.mjs.
// Fragenformat und Eingabe-Typen ('zahl', 'dezimal', 'text', 'binaer', 'hex'): lernweg/pruefen.js.
// tipp erscheint nach einer falschen Antwort, erklaerung nach der richtigen.

export const CHECKS = {
  // ---------- Block 1: Zahlensysteme ----------
  stellenwert: [
    {
      frage: 'Welchen Stellenwert hat die 4 in der Dezimalzahl 4.721?',
      optionen: ['4', '100', '1.000', '4.000'],
      richtig: '1.000',
      tipp: 'Zähl die Stellen von rechts: Einer, Zehner, Hunderter, … Gefragt ist der Stellenwert, nicht der Beitrag der Ziffer.',
      erklaerung: 'Die 4 steht an der vierten Stelle von rechts: Stellenwert 10³ = 1.000. Ihr Beitrag zur Zahl ist 4 · 1.000 = 4.000.',
    },
    {
      frage: 'Welche Ziffern gibt es im Oktalsystem (Basis 8)?',
      optionen: ['0 bis 7', '0 bis 8', '1 bis 8', '0 bis 9'],
      richtig: '0 bis 7',
      tipp: 'Die größte Ziffer ist immer Basis − 1.',
      erklaerung: 'Basis 8 heißt 8 Ziffern: 0, 1, 2, 3, 4, 5, 6, 7. Die 8 wäre schon „10“ – eine neue Stelle.',
    },
    {
      frage: 'Die Zahl 213 steht im Fünfersystem (Basis 5). Welchen Dezimalwert hat sie?',
      eingabe: 'zahl',
      loesung: 58,
      tipp: 'Die Stellenwerte zur Basis 5 sind von rechts 1, 5, 25. Rechne Ziffer · Stellenwert und addiere.',
      erklaerung: '2 · 25 + 1 · 5 + 3 · 1 = 50 + 5 + 3 = 58. Dasselbe Rezept gilt für jede Basis.',
    },
  ],
  binaer: [
    {
      frage: 'Welchen Dezimalwert hat die Binärzahl `0110 0100`?',
      eingabe: 'zahl',
      loesung: 100,
      tipp: 'Schreib die Stellenwerte 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1 darüber und addiere die über den Einsen.',
      erklaerung: 'Einsen unter 64, 32 und 4: 64 + 32 + 4 = 100.',
    },
    {
      frage: 'Welche Zahl ist größer: `1000 0000` oder `0111 1111`?',
      optionen: ['1000 0000', '0111 1111', 'beide sind gleich groß'],
      richtig: '1000 0000',
      tipp: 'Rechne beide aus – oder vergleiche das linke Bit.',
      erklaerung: '1000 0000 = 128, 0111 1111 = 64 + 32 + 16 + 8 + 4 + 2 + 1 = 127. Ein Bit ist mehr wert als alle Bits rechts davon zusammen.',
    },
    {
      frage: 'Welchen Stellenwert hat das linke Bit einer 8-Bit-Zahl?',
      optionen: ['8', '128', '255', '256'],
      richtig: '128',
      tipp: 'Von rechts bei 1 anfangen und siebenmal verdoppeln.',
      erklaerung: '1, 2, 4, 8, 16, 32, 64, 128 – das achte Bit von rechts hat den Stellenwert 2⁷ = 128.',
    },
  ],
  'dezimal-binaer': [
    {
      frage: 'Rechne die Dezimalzahl 77 ins Binärsystem um.',
      eingabe: 'binaer',
      loesung: '1001101',
      tipp: 'Restwertverfahren: 77 ÷ 2 = 38 Rest 1, 38 ÷ 2 = … – bis 0 herauskommt, dann die Reste von unten nach oben lesen.',
      erklaerung:
        '77 ÷ 2 = 38 R 1 · 38 ÷ 2 = 19 R 0 · 19 ÷ 2 = 9 R 1 · 9 ÷ 2 = 4 R 1 · 4 ÷ 2 = 2 R 0 · 2 ÷ 2 = 1 R 0 · 1 ÷ 2 = 0 R 1 → von unten: 100 1101. Probe: 64 + 8 + 4 + 1 = 77.',
    },
    {
      frage: 'Beim Restwertverfahren für 200 ist der erste Rest 0. Was bedeutet das?',
      optionen: ['Das rechte Bit ist 0 – 200 ist gerade.', 'Das linke Bit ist 0.', 'Die Binärzahl beginnt mit 0.', 'Die Rechnung ist falsch.'],
      richtig: 'Das rechte Bit ist 0 – 200 ist gerade.',
      tipp: 'Der erste Rest beantwortet: Bleibt beim Teilen durch 2 etwas übrig?',
      erklaerung: 'Der erste Rest ist das Bit mit dem Stellenwert 1, also das rechte. 200 ist gerade, darum Rest 0.',
    },
    {
      frage: 'Rechne die Dezimalzahl 255 ins Binärsystem um.',
      eingabe: 'binaer',
      loesung: '11111111',
      tipp: '255 ist die größte Zahl, die mit 8 Bit geht.',
      erklaerung: 'Alle acht Reste sind 1: 1111 1111 = 128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255.',
    },
  ],
  zweierpotenzen: [
    {
      frage: 'Wie viele verschiedene Werte lassen sich mit 10 Bit darstellen?',
      eingabe: 'zahl',
      loesung: 1024,
      tipp: 'n Bit → 2ⁿ Werte. 2⁸ = 256, dann noch zweimal verdoppeln.',
      erklaerung: '2¹⁰ = 1.024 – von 0 bis 1.023. Diese Zahl begegnet dir gleich wieder beim „Kibi“.',
    },
    {
      frage: 'Wie viele Bit braucht man mindestens, um 1.000 verschiedene Werte darzustellen?',
      optionen: ['9', '10', '11', '1.000'],
      richtig: '10',
      tipp: 'Gesucht ist die kleinste Zweierpotenz, die mindestens 1.000 ist.',
      erklaerung: '2⁹ = 512 reicht nicht, 2¹⁰ = 1.024 reicht. Also 10 Bit.',
    },
    {
      frage: 'Ein Bild speichert je Bildpunkt 24 Bit Farbinformation. Wie viele Farben sind möglich?',
      optionen: ['24', '256', '16.777.216', '72'],
      richtig: '16.777.216',
      tipp: 'Mit n Bit gibt es 2ⁿ Werte. Hier ist n = 24.',
      erklaerung: '2²⁴ = 16.777.216. Das sind je 8 Bit (256 Stufen) für Rot, Grün und Blau: 256 · 256 · 256.',
    },
  ],
  hex: [
    {
      frage: 'Rechne die Binärzahl `1011 1110` ins Hexadezimalsystem um.',
      eingabe: 'hex',
      loesung: 'BE',
      tipp: 'Jede Vierergruppe einzeln übersetzen: Welcher Wert ist 1011, welcher 1110?',
      erklaerung: '1011 = 8 + 2 + 1 = 11 = B · 1110 = 8 + 4 + 2 = 14 = E → BE.',
    },
    {
      frage: 'Welchen Dezimalwert hat die Hexadezimalzahl 3F?',
      eingabe: 'zahl',
      loesung: 63,
      tipp: 'Stellenwerte 16 und 1. F ist 15.',
      erklaerung: '3 · 16 + 15 · 1 = 48 + 15 = 63.',
    },
    {
      frage: 'Rechne die Binärzahl `1 0110 1010` ins Hexadezimalsystem um.',
      eingabe: 'hex',
      loesung: '16A',
      tipp: 'Von rechts in Vierergruppen teilen. Die linke Gruppe mit Nullen auf vier Bit auffüllen.',
      erklaerung: '0001 · 0110 · 1010 → 1 · 6 · A → 16A.',
    },
  ],

  // ---------- Block 2: Datenmengen ----------
  'bit-byte': [
    {
      frage: 'Wie viele Byte sind 256 Bit?',
      eingabe: 'zahl',
      loesung: 32,
      tipp: '8 Bit sind 1 Byte.',
      erklaerung: '256 ÷ 8 = 32 Byte.',
    },
    {
      frage: 'Eine Internetleitung hat 200 Mbit/s. Wie viele Megabyte je Sekunde kommen höchstens an?',
      optionen: ['200 MB/s', '25 MB/s', '1.600 MB/s', '20 MB/s'],
      richtig: '25 MB/s',
      tipp: 'Mbit ist Bit, MB ist Byte.',
      erklaerung: '200 Mbit/s ÷ 8 = 25 MB/s.',
    },
    {
      frage: 'Ein Zeichen wird mit 1 Byte gespeichert. Wie viele Bit braucht ein Text mit 120 Zeichen?',
      eingabe: 'zahl',
      loesung: 960,
      tipp: 'Erst Byte, dann Byte → Bit.',
      erklaerung: '120 Zeichen = 120 Byte · 8 = 960 Bit.',
    },
  ],
  praefixe: [
    {
      frage: 'Wie viele Byte sind 1 KiB?',
      optionen: ['1.000', '1.024', '8.192', '1.048.576'],
      richtig: '1.024',
      tipp: 'Das „i“ steht für den Binärpräfix.',
      erklaerung: '1 KiB (Kibibyte) = 2¹⁰ = 1.024 Byte. 1 kB (Kilobyte) wären 1.000 Byte.',
    },
    {
      frage: 'Ein USB-Stick hat laut Hersteller 64 GB. Wie viel GiB zeigt das Betriebssystem an? Runde auf zwei Nachkommastellen.',
      eingabe: 'dezimal',
      loesung: 59.6,
      toleranz: 0.005,
      tipp: 'Über Byte rechnen: 64 · 1.000³ Byte, dann ÷ 1.024³.',
      erklaerung: '64 · 1.000.000.000 = 64.000.000.000 Byte ÷ 1.073.741.824 = 59,60 GiB.',
    },
    {
      frage: 'Wie viele KiB sind 2 MiB?',
      eingabe: 'zahl',
      loesung: 2048,
      tipp: 'Eine Stufe die Treppe hinunter: · 1.024.',
      erklaerung: '2 MiB · 1.024 = 2.048 KiB.',
    },
  ],
  speicherbedarf: [
    {
      frage: 'Wie viele Byte braucht ein Bildpunkt bei 32 Bit Farbtiefe?',
      optionen: ['2', '4', '8', '32'],
      richtig: '4',
      tipp: 'Bit → Byte: ÷ 8.',
      erklaerung: '32 Bit ÷ 8 = 4 Byte je Bildpunkt.',
    },
    {
      frage: 'Ein unkomprimiertes Bild hat 1.280 × 720 Bildpunkte und 24 Bit Farbtiefe. Wie groß ist es in MiB? Runde auf zwei Nachkommastellen.',
      eingabe: 'dezimal',
      loesung: 2.64,
      toleranz: 0.005,
      tipp: 'Bildpunkte · 3 Byte, dann zweimal ÷ 1.024.',
      erklaerung: '1.280 · 720 = 921.600 Bildpunkte · 3 Byte = 2.764.800 Byte ÷ 1.024 ÷ 1.024 = 2,64 MiB.',
    },
    {
      frage: 'Bilder sollen statt mit 16 Bit künftig mit 24 Bit Farbtiefe gespeichert werden. Um wie viel Prozent steigt der Speicherbedarf?',
      eingabe: 'zahl',
      loesung: 50,
      platzhalter: 'Prozent',
      tipp: 'Mehrbedarf = (neu − alt) ÷ alt · 100.',
      erklaerung: '(24 − 16) ÷ 16 · 100 = 8 ÷ 16 · 100 = 50 %.',
    },
  ],
  uebertragung: [
    {
      frage: 'In welcher Einheit stehen Übertragungsraten in der Prüfung?',
      optionen: [
        'Bit je Sekunde mit Dezimalpräfix, z. B. Mbit/s',
        'Byte je Sekunde mit Binärpräfix, z. B. MiB/s',
        'Byte mit Dezimalpräfix, z. B. MB',
        'Bit mit Binärpräfix, z. B. Mibit',
      ],
      richtig: 'Bit je Sekunde mit Dezimalpräfix, z. B. Mbit/s',
      tipp: 'Leitungen werden in Bit gemessen – und mit welchem Faktor?',
      erklaerung: 'Übertragungsraten: Bit je Sekunde, Dezimalpräfix (1 Mbit/s = 1.000.000 bit/s). Datenmengen: Byte mit Binärpräfix.',
    },
    {
      frage: 'Wie viele Sekunden dauert die Übertragung von 500 MiB bei 100 Mbit/s? Runde auf zwei Nachkommastellen.',
      eingabe: 'dezimal',
      loesung: 41.94,
      toleranz: 0.005,
      tipp: 'Menge in Bit: 500 · 1.024² · 8. Rate in bit/s: 100 · 1.000.000.',
      erklaerung: '500 · 1.048.576 · 8 = 4.194.304.000 Bit ÷ 100.000.000 bit/s = 41,94 s.',
    },
    {
      frage: 'Eine Übertragung dauert 410 Sekunden. Wie viel ist das in Minuten und Sekunden?',
      optionen: ['4 min 10 s', '6 min 50 s', '6,83 min', '41 min'],
      richtig: '6 min 50 s',
      tipp: 'Wie oft passen 60 Sekunden in 410 – und was bleibt übrig?',
      erklaerung: '410 ÷ 60 = 6 Rest 50 → 6 min 50 s. (6,83 min ist derselbe Wert, aber nicht in Minuten und Sekunden.)',
    },
  ],

  // ---------- Block 3: Bits in der Praxis ----------
  dateirechte: [
    {
      frage: 'Welche Rechte setzt `chmod 640`? Schreib sie in der Form `rwxr-x---`.',
      eingabe: 'text',
      loesung: 'rw-r-----',
      auch: ['-rw-r-----'],
      platzhalter: 'z. B. rwxr-x---',
      tipp: 'Jede Ziffer einzeln: 6 = 4 + 2, 4 = 4, 0 = nichts. Fehlende Rechte als Strich.',
      erklaerung: '6 = rw- (Besitzer), 4 = r-- (Gruppe), 0 = --- (andere) → rw-r-----.',
    },
    {
      frage: 'Welche Ziffer steht für `r-x`?',
      optionen: ['1', '3', '5', '6'],
      richtig: '5',
      tipp: 'r = 4, w = 2, x = 1 – die vorhandenen addieren.',
      erklaerung: 'r (4) + x (1) = 5.',
    },
    {
      frage: 'Nach `chmod 754 skript.sh`: Was dürfen „andere“?',
      optionen: ['nur lesen', 'lesen und ausführen', 'alles', 'nichts'],
      richtig: 'nur lesen',
      tipp: 'Die dritte Ziffer gilt für „andere“.',
      erklaerung: 'Die dritte Ziffer ist 4 = r-- : nur lesen.',
    },
  ],
  paritaet: [
    {
      frage: 'Die Daten `0110100` sollen mit gerader Parität gesendet werden. Welches Paritätsbit wird angehängt?',
      optionen: ['0', '1'],
      richtig: '1',
      tipp: 'Zähl die Einsen. Ist ihre Zahl schon gerade?',
      erklaerung: 'Die Daten enthalten 3 Einsen – ungerade. Das Paritätsbit 1 macht daraus 4.',
    },
    {
      frage: 'Empfangen wurde `11010110` (7 Datenbits + Paritätsbit), vereinbart ist gerade Parität. Was folgt?',
      optionen: ['Ein Fehler ist erkannt.', 'Kein Fehler erkannt.', 'Das dritte Bit ist falsch.'],
      richtig: 'Ein Fehler ist erkannt.',
      tipp: 'Zähl alle Einsen, auch das Paritätsbit.',
      erklaerung: '5 Einsen – ungerade, obwohl gerade vereinbart ist. Ein Fehler ist erkannt; welches Bit falsch ist, verrät die Parität nicht.',
    },
    {
      frage: 'Was kann ein Paritätsbit nicht?',
      optionen: ['einen einzelnen Bitfehler erkennen', 'einen Fehler berichtigen', 'mit gerader Parität arbeiten', 'mit den Daten gesendet werden'],
      richtig: 'einen Fehler berichtigen',
      tipp: 'Weiß der Empfänger, welches Bit gekippt ist?',
      erklaerung: 'Es zeigt nur, dass die Parität nicht stimmt – nicht wo. Darum kann es nicht berichtigen.',
    },
  ],

  // ---------- Block 4: Leistung und Stromkosten ----------
  leistung: [
    {
      frage: 'Ein Gerät nimmt bei 230 V einen Strom von 0,5 A auf. Welche Leistung nimmt es auf (in W)?',
      eingabe: 'dezimal',
      loesung: 115,
      tipp: 'P = U · I.',
      erklaerung: 'P = 230 V · 0,5 A = 115 W.',
    },
    {
      frage: 'Die Komponenten eines PCs brauchen zusammen 380 W. Mit 25 % Zuschlag: Welches ist das kleinste passende Netzteil?',
      optionen: ['400 W', '450 W', '500 W', '550 W'],
      richtig: '500 W',
      tipp: 'Erst den Bedarf mit Zuschlag ausrechnen: 380 W · 1,25.',
      erklaerung: '380 W · 1,25 = 475 W. Das kleinste Netzteil, das das schafft, hat 500 W.',
    },
    {
      frage: 'Ein Netzteil gibt 360 W ab und hat einen Wirkungsgrad von 90 %. Welche Leistung nimmt es aus dem Stromnetz auf (in W)?',
      eingabe: 'dezimal',
      loesung: 400,
      tipp: 'Aufgenommen ist mehr als abgegeben: abgegeben ÷ η.',
      erklaerung: '360 W ÷ 0,9 = 400 W. Die 40 W Unterschied werden zu Wärme.',
    },
  ],
  energie: [
    {
      frage: 'Ein Monitor mit 30 W läuft 8 Stunden. Wie viele kWh verbraucht er?',
      eingabe: 'dezimal',
      loesung: 0.24,
      toleranz: 0.0001,
      tipp: 'W = P · t in Wh, dann ÷ 1.000.',
      erklaerung: '30 W · 8 h = 240 Wh = 0,24 kWh.',
    },
    {
      frage: 'Ein Server nimmt dauerhaft 200 W auf und läuft das ganze Jahr (8.760 h). Strom kostet 0,30 €/kWh. Was kostet der Strom im Jahr (in €)?',
      eingabe: 'dezimal',
      loesung: 525.6,
      toleranz: 0.01,
      tipp: 'Erst die Energie: 200 W · 8.760 h in kWh. Dann · Preis.',
      erklaerung: '200 W · 8.760 h = 1.752.000 Wh = 1.752 kWh · 0,30 €/kWh = 525,60 €.',
    },
    {
      frage: 'Was gibt die Einheit kWh an?',
      optionen: ['die Energie – Leistung über eine Zeit', 'die Leistung – wie viel gerade fließt', 'die Stromstärke', 'den Strompreis'],
      richtig: 'die Energie – Leistung über eine Zeit',
      tipp: 'Kilowatt mal Stunde …',
      erklaerung: 'kWh ist eine Energie: 1 kW eine Stunde lang. Watt allein ist die Leistung.',
    },
  ],
};
