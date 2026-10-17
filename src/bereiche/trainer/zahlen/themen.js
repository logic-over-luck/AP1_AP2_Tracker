// Die Themen des Zahlen-Trainers: Name, Kompetenzen, Spickzettel, Erklärung und ein Werkzeug zum Ausprobieren.
// Rein und ohne Browser-Abhängigkeit (Tests). Die Aufgaben stehen in aufgaben/, die Stichpunkte je Thema
// im Trainer-Verzeichnis (verzeichnis.js, gleiche IDs).
//
// Werkzeug: { titel, felder: [{ id, label, start, einheit?, wahl? }], rechne(werte) }
//   rechne liefert { fehler } oder { zeilen: [{ name, wert, hervor? }], schritte: [Text …] }

import {
  z,
  runde,
  hoch,
  gruppiert,
  leseZahl,
  leseBasis,
  leseBits,
  divisionsweg,
  stellenwertweg,
  nibbles,
  BYTE_JE,
  BIN_EINHEITEN,
  DEZ_EINHEITEN,
  faktorText,
  passendeEinheit,
  minSek,
  leseRechte,
  rechteSumme,
  RWX,
  KLASSEN,
  einsen,
  paritaetsbit,
} from './rechnen.js';

const mit2 = (wert) => z(runde(wert, 2), 2);

export const THEMEN = [
  {
    id: 'zahlensysteme',
    name: 'Zahlensysteme',
    icon: 'binary',
    kurz: 'Dezimal, binär, hexadezimal und oktal – in alle Richtungen umrechnen, Zweierpotenzen sicher anwenden.',
    koennen: ['AP1-4-2-1-K1', 'AP1-4-2-1-K2', 'AP1-4-2-1-K8', 'AP1-4-2-1-K9'],
    spickzettel:
      '- Dezimal → binär/hex: fortlaufend durch 2 bzw. 16 teilen, die Reste **von unten nach oben** lesen\n' +
      '- Binär/hex → dezimal: Ziffer · Stellenwert addieren (von rechts: 1, 2, 4, 8 … bzw. 1, 16, 256 …)\n' +
      '- Binär ↔ hex: 4 Bit = 1 Hex-Ziffer, A = 10 … F = 15\n' +
      '- n Bit → 2ⁿ Werte, größte Zahl 2ⁿ − 1 (8 Bit: 256 Werte, 0 bis 255)\n' +
      '- 2⁰ … 2¹⁰: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1.024',
    erklaerung: [
      {
        titel: 'Stellenwerte',
        text:
          'Jede Zahl ist eine Summe aus **Ziffer · Stellenwert**. Die Basis legt die Stellenwerte fest: dezimal 1, 10, 100 …, binär 1, 2, 4, 8 …, hexadezimal 1, 16, 256 … Ziffern gibt es von 0 bis Basis − 1 – binär also nur 0 und 1, hexadezimal 0–9 und A–F. Die rechte Stelle hat immer den Stellenwert 1.',
      },
      {
        titel: 'So rechnest du um',
        text:
          '- **Dezimal → andere Basis:** durch die Basis teilen, Rest notieren, mit dem Ergebnis weiterteilen, bis 0 herauskommt. Reste von unten nach oben lesen.\n' +
          '- **Andere Basis → dezimal:** jede Ziffer mit ihrem Stellenwert multiplizieren und alles addieren.\n' +
          '- **Binär ↔ hex:** von rechts in Vierergruppen teilen; jede Gruppe ist genau eine Hex-Ziffer. Links mit Nullen auffüllen.',
      },
      {
        titel: 'Beispiel: 200',
        text:
          '200 ÷ 2 = 100 R 0 · 100 ÷ 2 = 50 R 0 · 50 ÷ 2 = 25 R 0 · 25 ÷ 2 = 12 R 1 · 12 ÷ 2 = 6 R 0 · 6 ÷ 2 = 3 R 0 · 3 ÷ 2 = 1 R 1 · 1 ÷ 2 = 0 R 1 → von unten gelesen **1100 1000**. In Nibbles: 1100 = C, 1000 = 8 → **C8**. Probe: 12 · 16 + 8 = 200.',
      },
      {
        titel: 'Stolperfallen',
        text:
          '- Reste von **unten** nach oben lesen – der erste Rest ist das Bit ganz rechts.\n' +
          '- 8 Bit ergeben 256 Werte, die größte Zahl ist aber **255** (die 0 zählt mit).\n' +
          '- Der Wert 12 ist hexadezimal **C**, nicht „12“ (das wären 18).\n' +
          '- Im Code kennzeichnet `0x` eine Hex-Zahl und `0b` eine Binärzahl: `0xFF` = 255. Hex begegnet dir bei Farbcodes (#FF8800), MAC- und Speicheradressen.',
      },
    ],
    werkzeug: {
      titel: 'Umrechner',
      felder: [
        { id: 'zahl', label: 'Zahl', start: '200' },
        {
          id: 'basis',
          label: 'Basis',
          start: '10',
          wahl: [
            { wert: '2', text: 'binär' },
            { wert: '8', text: 'oktal' },
            { wert: '10', text: 'dezimal' },
            { wert: '16', text: 'hex' },
          ],
        },
      ],
      rechne({ zahl, basis }) {
        const b = Number(basis);
        const n = leseBasis(zahl, b);
        if (n === null) return { fehler: `Das ist keine gültige Zahl zur Basis ${b}.` };
        if (n > 0xffff) return { fehler: 'Bitte eine Zahl bis 65.535 (hex FFFF) eingeben.' };
        const bin = n.toString(2);
        const zeilen = [
          { name: 'Dezimal', wert: z(n), hervor: b === 10 },
          { name: 'Binär', wert: gruppiert(bin), hervor: b === 2 },
          { name: 'Oktal', wert: n.toString(8), hervor: b === 8 },
          { name: 'Hexadezimal', wert: n.toString(16).toUpperCase(), hervor: b === 16 },
        ];
        const schritte =
          b === 10
            ? [...divisionsweg(n, 2), `Reste von unten nach oben: ${gruppiert(bin)}`, `Vierergruppen als Hex-Ziffern: ${nibbles(bin)}`]
            : [`Stellenwerte: ${stellenwertweg(n.toString(b), b)} = ${z(n)}`, ...(b === 2 ? [`Vierergruppen als Hex-Ziffern: ${nibbles(bin)}`] : [`Binär: ${gruppiert(bin)}`])];
        return { zeilen, schritte };
      },
    },
  },

  {
    id: 'praefixe',
    name: 'Bit, Byte und Präfixe',
    icon: 'hash',
    kurz: 'Bit und Byte, kB und KiB, GHz und Mbit/s – wann 1.000 gilt, wann 1.024, und wie man sauber umrechnet.',
    koennen: ['AP1-4-2-1-K3', 'AP1-4-2-1-K4', 'AP1-4-2-1-K5', 'AP1-4-2-1-K7', 'AP2-6-6-3-K2'],
    spickzettel:
      '- 8 Bit = 1 Byte · Bit → Byte: ÷ 8 · Byte → Bit: · 8 · kleines b = Bit, großes B = Byte\n' +
      '- **Dezimalpräfixe** (Potenzen von 1.000): kB, MB, GB, TB – Hersteller, Übertragungsraten, physikalische Größen (GHz, MHz)\n' +
      '- **Binärpräfixe** (Potenzen von 1.024): KiB, MiB, GiB, TiB – Datenmengen laut Prüfungskatalog\n' +
      '- Umrechnen immer über Byte: 1.000 GB = 10¹² Byte, ÷ 1.024³ ≈ 931,32 GiB\n' +
      '- 3,4 GHz = 3,4 · 10⁹ Hz · 100 Mbit/s = 100.000.000 bit/s = 12,5 MB/s',
    erklaerung: [
      {
        titel: 'Zwei Familien von Präfixen',
        text:
          'Ein **Bit** ist 0 oder 1, **8 Bit sind 1 Byte**. Präfixe ohne „i“ (kB, MB, GB, TB) sind Dezimalpräfixe und meinen Potenzen von 1.000 – wie überall in der Physik (km, kg, GHz). Präfixe mit „i“ (KiB, MiB, GiB, TiB) sind Binärpräfixe und meinen Potenzen von 1.024 = 2¹⁰. Der Prüfungskatalog verlangt für Datenmengen die Binärpräfixe; Hersteller von Datenträgern und Übertragungsraten rechnen dezimal.',
      },
      {
        titel: 'So rechnest du um',
        text:
          '- Erst alles in **Byte** (oder Bit) umrechnen: Wert · 1.000ⁿ bzw. · 1.024ⁿ.\n' +
          '- Dann in die Zieleinheit: ÷ 1.000ⁿ bzw. ÷ 1.024ⁿ. Der Faktor zwischen GB und GiB ist 1,024³ ≈ 1,074 – nicht 1,024.\n' +
          '- Bit und Byte: · 8 oder ÷ 8. Eine Leitung mit 100 Mbit/s liefert 12,5 MB je Sekunde.',
      },
      {
        titel: 'Beispiel: die 1-TB-Festplatte',
        text:
          '1 TB laut Hersteller = 1 · 1.000⁴ Byte = 1.000.000.000.000 Byte. Das Betriebssystem rechnet binär: ÷ 1.024⁴ = **0,91 TiB** bzw. ÷ 1.024³ = **931,32 GiB**. Es fehlt nichts – die Zahl ist nur in einer anderen Einheit angegeben.',
      },
      {
        titel: 'Stolperfallen',
        text:
          '- GB → GiB ist nicht „÷ 1,024“: Du teilst dreimal durch 1,024 (einmal je Stufe).\n' +
          '- 100 Mbit/s sind **nicht** 100 MB/s – erst ÷ 8.\n' +
          '- Ein Megapixel ist 1.000.000 Bildpunkte (dezimal), eine Taktfrequenz von 3,4 GHz sind 3.400.000.000 Hz.',
      },
    ],
    werkzeug: {
      titel: 'Einheiten-Umrechner',
      felder: [
        { id: 'wert', label: 'Wert', start: '1000' },
        { id: 'einheit', label: 'Einheit', start: 'GB', wahl: ['Bit', 'Byte', 'kB', 'KiB', 'MB', 'MiB', 'GB', 'GiB', 'TB', 'TiB'].map((e) => ({ wert: e, text: e })) },
      ],
      rechne({ wert, einheit }) {
        const w = leseZahl(wert);
        if (w === null || w < 0) return { fehler: 'Bitte eine Zahl eingeben.' };
        const byte = w * BYTE_JE[einheit];
        const dez = passendeEinheit(byte, DEZ_EINHEITEN, 1000);
        const bin = passendeEinheit(byte, BIN_EINHEITEN, 1024);
        return {
          zeilen: [
            { name: 'Bit', wert: z(byte * 8) },
            { name: 'Byte', wert: z(byte) },
            { name: 'Dezimalpräfix', wert: `${mit2(dez.wert)} ${dez.einheit}`, hervor: !einheit.endsWith('iB') },
            { name: 'Binärpräfix', wert: `${mit2(bin.wert)} ${bin.einheit}`, hervor: einheit.endsWith('iB') },
          ],
          schritte: [
            einheit === 'Bit' ? `${z(w)} Bit ÷ 8 = ${z(byte)} Byte` : `${z(w)} ${einheit} = ${z(w)} · ${faktorText(einheit)} Byte = ${z(byte)} Byte`,
            dez.stufe ? `${z(byte)} ÷ 1.000${hoch(dez.stufe)} = ${mit2(dez.wert)} ${dez.einheit}` : null,
            bin.stufe ? `${z(byte)} ÷ 1.024${hoch(bin.stufe)} = ${mit2(bin.wert)} ${bin.einheit}` : null,
          ].filter(Boolean),
        };
      },
    },
  },

  {
    id: 'speicher',
    name: 'Speicherbedarf',
    icon: 'hard-drive',
    kurz: 'Bilder, Audio, Messwerte und ganze Sammlungen: Anzahl · Bit je Wert, dann sauber in MiB, GiB und TiB.',
    koennen: ['AP1-4-2-2-K1', 'AP1-4-2-2-K2', 'AP1-4-2-2-K5', 'AP1-4-2-2-K6', 'AP1-4-2-2-K7', 'AP1-4-2-2-K8', 'AP1-4-2-2-K9', 'AP1-4-2-2-K11', 'AP2-6-6-3-K1', 'AP2-6-6-3-K3', 'AP2-6-6-3-K5'],
    spickzettel:
      '- Speicher in Bit = **Anzahl der Werte · Bit je Wert** · ÷ 8 → Byte · je Stufe ÷ 1.024 → KiB, MiB, GiB, TiB\n' +
      '- Bild: Breite · Höhe · Farbtiefe (Bit) · Audio: Abtastrate · Abtasttiefe · Kanäle · Sekunden\n' +
      '- n Bit → 2ⁿ Werte: 24 Bit = 16.777.216 Farben · 1 Megapixel = 1.000.000 Bildpunkte\n' +
      '- Komprimierung um p %: · (1 − p ÷ 100) · Mehrbedarf in % = (neu − alt) ÷ alt · 100\n' +
      '- Erst am Ende runden; „volle TiB“ heißt aufrunden',
    erklaerung: [
      {
        titel: 'Eine Formel für alles',
        text:
          'Speicherbedarf ist immer **Anzahl der Werte · Bit je Wert**. Bei einem Bild sind die Werte die Bildpunkte (Breite · Höhe) und die Bit je Wert die Farbtiefe. Bei Audio sind es Abtastungen je Sekunde (Abtastrate) · Kanäle · Sekunden, jede mit der Abtasttiefe in Bit. Bei Messwerten: Werte je Tag · Tage · Bit je Wert.',
      },
      {
        titel: 'So rechnest du',
        text:
          '- Werte zählen, mit den Bit je Wert multiplizieren → Bit.\n' +
          '- ÷ 8 → Byte. Dann je Stufe ÷ 1.024 → KiB → MiB → GiB → TiB.\n' +
          '- Für eine Sammlung mit der Anzahl multiplizieren (Bilder je Tag · Tage). Mit den vollen Zahlen weiterrechnen, erst das Endergebnis runden.',
      },
      {
        titel: 'Beispiel: Full-HD-Bild',
        text:
          '1.920 · 1.080 = 2.073.600 Bildpunkte · 24 Bit = 49.766.400 Bit · ÷ 8 = 6.220.800 Byte · ÷ 1.024 = 6.075 KiB · ÷ 1.024 = **5,93 MiB**. Mit 30 % Komprimierung: 5,93 · 0,7 = 4,15 MiB.',
      },
      {
        titel: 'Stolperfallen',
        text:
          '- 24 Bit sind **3 Byte** je Bildpunkt, nicht 24 Byte.\n' +
          '- Megapixel ist ein Dezimalpräfix: 12 MP = 12.000.000 Bildpunkte.\n' +
          '- Zwischenergebnisse nicht runden; sonst stimmt die zweite Nachkommastelle nicht.\n' +
          '- Reicht der Speicher? Herstellerangabe (GB, dezimal) und Bedarf (GiB) erst in dieselbe Einheit bringen.',
      },
    ],
    werkzeug: {
      titel: 'Bild-Rechner',
      felder: [
        { id: 'breite', label: 'Breite', start: '1920', einheit: 'px' },
        { id: 'hoehe', label: 'Höhe', start: '1080', einheit: 'px' },
        { id: 'tiefe', label: 'Farbtiefe', start: '24', wahl: ['8', '16', '24', '32'].map((b) => ({ wert: b, text: `${b} Bit` })) },
        { id: 'anzahl', label: 'Anzahl Bilder', start: '1' },
      ],
      rechne({ breite, hoehe, tiefe, anzahl }) {
        const [b, h, n] = [breite, hoehe, anzahl].map(leseZahl);
        if ([b, h, n].some((x) => x === null || x <= 0)) return { fehler: 'Bitte Breite, Höhe und Anzahl als Zahlen eingeben.' };
        const t = Number(tiefe);
        const bit = b * h * t * n;
        const byte = bit / 8;
        const zeilen = [
          { name: 'Bildpunkte', wert: z(b * h) },
          { name: 'Bit', wert: z(bit) },
          { name: 'Byte', wert: z(byte) },
          { name: 'MiB', wert: mit2(byte / 1024 ** 2), hervor: true },
          { name: 'GiB', wert: mit2(byte / 1024 ** 3) },
        ];
        if (byte >= 1024 ** 4 / 100) zeilen.push({ name: 'TiB', wert: mit2(byte / 1024 ** 4) });
        return {
          zeilen,
          schritte: [
            `${z(b)} · ${z(h)} = ${z(b * h)} Bildpunkte`,
            `${z(b * h)} · ${t} Bit${n > 1 ? ` · ${z(n)} Bilder` : ''} = ${z(bit)} Bit`,
            `${z(bit)} ÷ 8 = ${z(byte)} Byte`,
            `${z(byte)} ÷ 1.024² = ${mit2(byte / 1024 ** 2)} MiB`,
          ],
        };
      },
    },
  },

  {
    id: 'uebertragung',
    name: 'Übertragungsdauer',
    icon: 'cable',
    kurz: 'Datenmenge und Übertragungsrate: wie lange ein Download dauert, welche Rate nötig ist – mit den richtigen Einheiten.',
    koennen: ['AP1-4-2-2-K3', 'AP1-4-2-2-K4', 'AP2-6-6-3-K4', 'AP2-6-6-3-K5'],
    spickzettel:
      '- **Dauer = Datenmenge ÷ Übertragungsrate** · Rate = Datenmenge ÷ Dauer · Datenmenge = Rate · Dauer\n' +
      '- Datenmenge in Bit: Byte · 8, Binärpräfix beachten (1 MiB = 1.024² Byte)\n' +
      '- Rate in bit/s: Dezimalpräfix (1 Mbit/s = 1.000.000 bit/s)\n' +
      '- Sekunden → Minuten und Sekunden: ÷ 60, der Rest sind die Sekunden',
    erklaerung: [
      {
        titel: 'Die Grundgleichung',
        text:
          'Eine Übertragung ist wie Wasser durch ein Rohr: Die **Datenmenge** ist die Wassermenge, die **Übertragungsrate** der Durchfluss je Sekunde. Darum gilt **Dauer = Datenmenge ÷ Rate**. Beide Größen müssen vorher dieselbe Einheit haben: Bit.',
      },
      {
        titel: 'So rechnest du',
        text:
          '- Datenmenge in Bit: MiB · 1.024² · 8 bzw. GiB · 1.024³ · 8.\n' +
          '- Rate in bit/s: Mbit/s · 1.000.000, Gbit/s · 1.000.000.000.\n' +
          '- Teilen → Sekunden. Für Minuten und Sekunden: ÷ 60, der Rest bleibt in Sekunden.',
      },
      {
        titel: 'Beispiel: 1 GiB über 100 Mbit/s',
        text: '1 · 1.024³ · 8 = 8.589.934.592 Bit · 100 Mbit/s = 100.000.000 bit/s · 8.589.934.592 ÷ 100.000.000 = **85,90 s** ≈ 1 min 26 s.',
      },
      {
        titel: 'Stolperfallen',
        text:
          '- Das **· 8** vergessen: Datenmengen stehen in Byte, Raten in Bit.\n' +
          '- MiB (1.024²) und Mbit (1.000.000) sind verschiedene Präfixe – nicht kürzen.\n' +
          '- 130 s sind 2 min 10 s, nicht „1,3 min“ oder „2 min 30 s“.',
      },
    ],
    werkzeug: {
      titel: 'Download-Rechner',
      felder: [
        { id: 'menge', label: 'Datenmenge', start: '1' },
        { id: 'einheit', label: 'Einheit', start: 'GiB', wahl: ['MB', 'MiB', 'GB', 'GiB'].map((e) => ({ wert: e, text: e })) },
        { id: 'rate', label: 'Übertragungsrate', start: '100', einheit: 'Mbit/s' },
      ],
      rechne({ menge, einheit, rate }) {
        const m = leseZahl(menge);
        const r = leseZahl(rate);
        if (m === null || m < 0 || r === null || r <= 0) return { fehler: 'Bitte Datenmenge und Rate als Zahlen eingeben.' };
        const bit = m * BYTE_JE[einheit] * 8;
        const bps = r * 1e6;
        const sek = bit / bps;
        return {
          zeilen: [
            { name: 'Datenmenge', wert: `${z(bit)} Bit` },
            { name: 'Rate', wert: `${z(bps)} bit/s` },
            { name: 'Dauer', wert: `${mit2(sek)} s`, hervor: true },
            { name: 'Dauer', wert: minSek(sek) },
          ],
          schritte: [`${z(m)} ${einheit} = ${z(m)} · ${faktorText(einheit)} · 8 Bit = ${z(bit)} Bit`, `${z(r)} Mbit/s = ${z(bps)} bit/s`, `${z(bit)} ÷ ${z(bps)} = ${mit2(sek)} s`],
        };
      },
    },
  },

  {
    id: 'strom',
    name: 'Leistung und Stromkosten',
    icon: 'zap',
    kurz: 'P = U · I, Netzteil und Wirkungsgrad, Energie in kWh und was sie im Jahr kostet – auch Steckdose und USB-Anschluss.',
    koennen: ['AP1-4-2-3-K1', 'AP1-4-2-3-K2', 'AP1-4-2-3-K3', 'AP1-4-2-3-K4', 'AP1-4-2-3-K5', 'AP1-4-2-3-K6', 'AP1-4-2-3-K7', 'AP1-4-2-3-K8'],
    spickzettel:
      '- **P = U · I** (W = V · A) → I = P ÷ U · U = P ÷ I\n' +
      '- Netzteil: Summe der Komponenten · (1 + Zuschlag), dann das nächstgrößere Netzteil\n' +
      '- Wirkungsgrad η = P_ab ÷ P_auf → P_auf = P_ab ÷ η · hintereinander: η_gesamt = η₁ · η₂\n' +
      '- Energie W = P · t (Wh) · kWh = Wh ÷ 1.000 · Kosten = kWh · Preis je kWh\n' +
      '- Mehrfachsteckdose: 16 A · 230 V = 3.680 W zulässig · USB-Anschluss: 5 V, liefert nur begrenzten Strom',
    erklaerung: [
      {
        titel: 'Leistung, Energie, Kosten',
        text:
          '**Leistung** P in Watt sagt, wie viel gerade fließt: P = U · I. **Energie** W ist Leistung über die Zeit: W = P · t, in Wattstunden, ÷ 1.000 in kWh. **Kosten** sind kWh · Preis je kWh. Ein Gerät mit 100 W, das 10 Stunden läuft, verbraucht 1 kWh.',
      },
      {
        titel: 'So rechnest du',
        text:
          '- Netzteil: Leistungen aller Komponenten addieren, Zuschlag einrechnen (20 % → · 1,2), das kleinste Netzteil wählen, das mindestens so viel liefert.\n' +
          '- Wirkungsgrad: aufgenommen = abgegeben ÷ η. Zwei Stufen hintereinander: η₁ · η₂ (0,9 · 0,9 = 0,81).\n' +
          '- Stromkosten im Jahr: Watt · Stunden je Tag · Tage ÷ 1.000 = kWh, · Preis. Läuft ein Gerät teils unter Last, teils im Leerlauf, rechnest du beide Anteile getrennt und addierst.',
      },
      {
        titel: 'Beispiel: Server im Dauerbetrieb',
        text: '150 W · 24 h · 365 Tage = 1.314.000 Wh = **1.314 kWh** · 0,30 €/kWh = **394,20 €** im Jahr. Bei 90 % Wirkungsgrad des Netzteils nimmt es für 150 W am Ausgang 150 ÷ 0,9 = 166,67 W aus dem Netz.',
      },
      {
        titel: 'Stolperfallen',
        text:
          '- Watt (Leistung) und kWh (Energie) nicht verwechseln.\n' +
          '- Minuten in Stunden umrechnen: 90 min = 1,5 h.\n' +
          '- Aufgenommene Leistung ist abgegebene **÷** η – sie ist immer größer, nicht kleiner.\n' +
          '- Steckdose: Summe der Geräte mit 3.680 W (16 A · 230 V) vergleichen. USB: I = P ÷ 5 V mit dem vergleichen, was der Anschluss liefern kann.',
      },
    ],
    werkzeug: {
      titel: 'Stromkosten-Rechner',
      felder: [
        { id: 'leistung', label: 'Leistung', start: '150', einheit: 'W' },
        { id: 'stunden', label: 'Stunden je Tag', start: '24', einheit: 'h' },
        { id: 'tage', label: 'Tage', start: '365' },
        { id: 'preis', label: 'Strompreis', start: '0,30', einheit: '€/kWh' },
      ],
      rechne({ leistung, stunden, tage, preis }) {
        const [p, h, t, c] = [leistung, stunden, tage, preis].map(leseZahl);
        if ([p, h, t, c].some((x) => x === null || x < 0)) return { fehler: 'Bitte alle vier Werte als Zahlen eingeben.' };
        const wh = p * h * t;
        const kwh = wh / 1000;
        return {
          zeilen: [
            { name: 'Betriebsstunden', wert: `${z(h * t)} h` },
            { name: 'Energie', wert: `${z(wh)} Wh` },
            { name: 'Energie', wert: `${mit2(kwh)} kWh`, hervor: true },
            { name: 'Kosten', wert: `${mit2(kwh * c)} €`, hervor: true },
            { name: 'Strom bei 230 V', wert: `${mit2(p / 230)} A` },
          ],
          schritte: [`${z(h)} h · ${z(t)} Tage = ${z(h * t)} h`, `W = P · t = ${z(p)} W · ${z(h * t)} h = ${z(wh)} Wh = ${mit2(kwh)} kWh`, `${mit2(kwh)} kWh · ${z(c, 2)} €/kWh = ${mit2(kwh * c)} €`, `I = P ÷ U = ${z(p)} W ÷ 230 V = ${mit2(p / 230)} A`],
        };
      },
    },
  },

  {
    id: 'rechte',
    name: 'Dateirechte (chmod)',
    icon: 'key-round',
    kurz: 'Lesen, Schreiben, Ausführen für Besitzer, Gruppe und andere – als Oktalzahl und in der Schreibweise rwxr-xr--.',
    koennen: ['AP1-5-2-3-K3', 'AP1-5-2-3-K5'],
    spickzettel:
      '- r = 4 (lesen), w = 2 (schreiben), x = 1 (ausführen) – je Klasse addieren\n' +
      '- Drei Klassen in dieser Reihenfolge: **Besitzer**, **Gruppe**, **andere**\n' +
      '- chmod 754 = rwx r-x r-- · chmod 640 = rw- r-- --- · chmod 755 = rwx r-x r-x\n' +
      '- Symbolisch: `chmod u+x datei` (Besitzer darf ausführen), `chmod g-w datei`, `chmod o=r datei`',
    erklaerung: [
      {
        titel: 'Was chmod macht',
        text:
          '`chmod` (change mode) ändert unter Linux die **Zugriffsrechte** einer Datei oder eines Verzeichnisses. Es gibt drei Rechte – **r** lesen, **w** schreiben, **x** ausführen – für drei Klassen: den **Besitzer** (u), die **Gruppe** (g) und **andere** (o). `ls -l` zeigt sie als neun Zeichen: `-rwxr-xr--`.',
      },
      {
        titel: 'So liest du die Zahl',
        text:
          '- Jede Ziffer steht für eine Klasse: erste Ziffer Besitzer, zweite Gruppe, dritte andere.\n' +
          '- Jede Ziffer ist die Summe aus r = 4, w = 2, x = 1. 7 = alles, 6 = lesen und schreiben, 5 = lesen und ausführen, 4 = nur lesen, 0 = nichts.\n' +
          '- Umgekehrt: `rw-` → 4 + 2 = 6, `r-x` → 4 + 1 = 5.',
      },
      {
        titel: 'Beispiel: chmod 754',
        text: '7 = rwx: Der Besitzer darf alles. 5 = r-x: Die Gruppe darf lesen und ausführen, nicht schreiben. 4 = r--: Alle anderen dürfen nur lesen. Zusammen: **rwxr-xr--**.',
      },
      {
        titel: 'Stolperfallen',
        text:
          '- 6 ist lesen **und schreiben** (4 + 2), nicht lesen und ausführen (das wäre 5).\n' +
          '- Die Reihenfolge ist fest: Besitzer, Gruppe, andere – nicht andersherum.\n' +
          '- Eine 7 an erster Stelle heißt „alles für den Besitzer“, nicht „alles für alle“.',
      },
    ],
    werkzeug: {
      titel: 'chmod-Deuter',
      felder: [{ id: 'rechte', label: 'Oktalzahl oder rwx-Schreibweise', start: '754' }],
      rechne({ rechte }) {
        const r = leseRechte(rechte);
        if (!r) return { fehler: 'Bitte drei Ziffern von 0 bis 7 (z. B. 754) oder neun Zeichen wie rwxr-xr-- eingeben.' };
        const ziffern = [...r.oktal].map(Number);
        return {
          zeilen: [
            ...KLASSEN.map((k, i) => ({ name: k, wert: `${RWX[ziffern[i]]}  (${ziffern[i]})` })),
            { name: 'Befehl', wert: `chmod ${r.oktal}`, hervor: true },
            { name: 'ls -l zeigt', wert: `-${r.sym}`, hervor: true },
          ],
          schritte: KLASSEN.map((k, i) => `${k}: ${rechteSumme(ziffern[i])}`),
        };
      },
    },
  },

  {
    id: 'paritaet',
    name: 'Paritätsbit',
    icon: 'square-check-big',
    kurz: 'Ein zusätzliches Bit, mit dem der Empfänger einen Übertragungsfehler bemerkt – gerade und ungerade Parität.',
    koennen: ['AP2-5-5-3-K1', 'AP2-5-5-3-K2', 'AP2-5-5-3-K3'],
    spickzettel:
      '- **Gerade Parität:** Anzahl der Einsen inklusive Paritätsbit ist gerade · **ungerade Parität:** ungerade\n' +
      '- Paritätsbit = das Bit, das die Einsen auf die passende Anzahl ergänzt (0 oder 1)\n' +
      '- Der Empfänger zählt nach: Parität falsch → Fehler erkannt. Er sieht nicht, welches Bit gekippt ist\n' +
      '- Erkennt **einen** Bitfehler, berichtigt keinen; **zwei** gekippte Bits bleiben unbemerkt\n' +
      '- Redundanz: Zusatzinformation nur zum Prüfen – Paritätsbit, Prüfsumme, Prüfziffer, CRC im Ethernet-Frame',
    erklaerung: [
      {
        titel: 'Die Idee',
        text:
          'Sender und Empfänger vereinbaren eine **Parität**. Der Sender hängt an jede Bitfolge ein **Paritätsbit** an, sodass die Gesamtzahl der Einsen gerade (gerade Parität) oder ungerade (ungerade Parität) ist. Der Empfänger zählt die Einsen nach. Stimmt die Parität nicht, wurde unterwegs ein Bit verfälscht.',
      },
      {
        titel: 'So gehst du vor',
        text:
          '- Einsen in den Datenbits zählen.\n' +
          '- Gerade Parität: Ist die Anzahl schon gerade, Paritätsbit 0, sonst 1. Ungerade Parität: genau umgekehrt.\n' +
          '- Prüfen beim Empfänger: alle Einsen (mit Paritätsbit) zählen und mit der vereinbarten Parität vergleichen.',
      },
      {
        titel: 'Beispiel: 0110100 bei gerader Parität',
        text: 'Drei Einsen – ungerade. Das Paritätsbit muss also **1** sein, gesendet wird 0110100**1** (vier Einsen). Kommt 0100100**1** an (drei Einsen), passt die Parität nicht: Fehler erkannt.',
      },
      {
        titel: 'Grenzen und Redundanz',
        text:
          '- Das Paritätsbit zeigt nur, **dass** etwas falsch ist, nicht **wo** – berichtigen kann es nichts.\n' +
          '- Kippen zwei Bits, stimmt die Parität wieder: Der Fehler bleibt unbemerkt.\n' +
          '- Das Prinzip heißt **Redundanz**: zusätzliche Prüfinformation mitsenden oder mitspeichern, die der Empfänger neu berechnet und vergleicht – wie eine Prüfsumme, eine Prüfziffer oder die CRC im Ethernet-Frame.',
      },
    ],
    werkzeug: {
      titel: 'Paritäts-Prüfer',
      felder: [
        { id: 'bits', label: 'Datenbits', start: '0110100' },
        {
          id: 'art',
          label: 'Parität',
          start: 'gerade',
          wahl: [
            { wert: 'gerade', text: 'gerade' },
            { wert: 'ungerade', text: 'ungerade' },
          ],
        },
      ],
      rechne({ bits, art }) {
        const b = leseBits(bits);
        if (!b) return { fehler: 'Bitte nur Nullen und Einsen eingeben.' };
        if (b.length > 16) return { fehler: 'Bitte höchstens 16 Bit.' };
        const gerade = art === 'gerade';
        const p = paritaetsbit(b, gerade);
        const n = einsen(b);
        return {
          zeilen: [
            { name: 'Einsen in den Daten', wert: `${n} (${n % 2 === 0 ? 'gerade' : 'ungerade'})` },
            { name: 'Paritätsbit', wert: String(p), hervor: true },
            { name: 'Gesendet wird', wert: `${b.join('')} ${p}`, hervor: true },
            { name: 'Einsen gesamt', wert: `${n + p} (${(n + p) % 2 === 0 ? 'gerade' : 'ungerade'})` },
          ],
          schritte: [
            `Die Daten enthalten ${n} Einsen.`,
            `${gerade ? 'Gerade' : 'Ungerade'} Parität: Die Gesamtzahl muss ${gerade ? 'gerade' : 'ungerade'} sein → Paritätsbit ${p}.`,
            'Der Empfänger zählt alle Einsen nach. Stimmt die Parität nicht, ist ein Bit gekippt.',
          ],
        };
      },
    },
  },
];

export const themaVon = (id) => THEMEN.find((t) => t.id === id) ?? null;

// Ziele für Verweise aus anderen Trainern ('zahlen:binaer' usw., siehe lernweg/kurse.js)
export const VERWEISE = {
  binaer: { thema: 'zahlensysteme', begriff: 'Binärzahl' },
  hex: { thema: 'zahlensysteme', begriff: 'Hexadezimalzahl' },
  zweierpotenzen: { thema: 'zahlensysteme', begriff: 'Zweierpotenzen' },
  praefixe: { thema: 'praefixe', begriff: 'Dezimal- und Binärpräfixe' },
};
