// Block 2 – Datenmengen: Bit und Byte, Dezimal- und Binärpräfixe, Speicherbedarf, Übertragungsdauer.

import { useState } from 'preact/hooks';
import { Schritte, Raten, Absatz, Fakten, Fakt, Formel, Hinweis, Beispiele, Werkbank } from '../../../lernweg/bausteine.jsx';
import { Treppe, Rechenweg, ZahlFeld, Wahl, tausend, hoch } from '../bausteine.jsx';

const hoch1000 = (n) => `1.000${n > 1 ? hoch(n) : ''}`;
const hoch1024 = (n) => `1.024${n > 1 ? hoch(n) : ''}`;

const zwei = (x) => tausend(Math.round(x * 100) / 100, 2);
const rund = (x) => tausend(Math.round(x * 100) / 100);

// ---------- 6 Bit und Byte ----------

function BitByteErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Das Bit: die kleinste Einheit',
          inhalt: (
            <>
              <Absatz>
                Ein <strong>Bit</strong> ist eine einzige Binärziffer: 0 oder 1. Mehr Information als „ja oder nein“ passt nicht hinein. Alles, was ein Computer speichert – Texte,
                Bilder, Programme – sind lange Ketten solcher Bits.
              </Absatz>
            </>
          ),
        },
        {
          titel: '8 Bit = 1 Byte',
          inhalt: (
            <>
              <Absatz>
                Einzelne Bits sind unhandlich. Darum fasst man je <strong>8 Bit zu einem Byte</strong> zusammen. Ein Byte kann 2⁸ = 256 verschiedene Werte annehmen (0 bis 255) –
                genug für einen Buchstaben, eine Farbstufe oder ein Oktett einer IP-Adresse.
              </Absatz>
              <div class="zl-byte" aria-label="8 Bit bilden 1 Byte">
                <div class="zl-byte__bits mono">
                  {[0, 1, 0, 0, 0, 0, 0, 1].map((b, i) => (
                    <span key={i} class={`zl-byte__bit ${b ? 'zl-byte__bit--an' : ''}`}>
                      {b}
                    </span>
                  ))}
                </div>
                <span class="zl-byte__klammer" aria-hidden="true" />
                <span class="zl-byte__name">
                  1 Byte = 8 Bit · hier: <span class="mono">0100 0001</span> = 65 = Buchstabe „A“
                </span>
              </div>
            </>
          ),
        },
        {
          titel: 'Umrechnen: · 8 und ÷ 8',
          inhalt: (
            <>
              <Absatz>Byte sind die größere Einheit. Von Byte zu Bit werden es also mehr (· 8), von Bit zu Byte weniger (÷ 8):</Absatz>
              <Treppe stufen={['Bit', 'Byte']} faktoren={[8]} />
              <Raten
                frage="Wie viele Byte sind 64 Bit?"
                optionen={[8, 64, 512, 6]}
                richtig={8}
                hinweis={(v) => (v === 512 ? 'Bit → Byte: Es werden weniger, also teilen.' : '8 Bit ergeben 1 Byte.')}
              >
                <Formel>64 Bit ÷ 8 = 8 Byte</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Kleines b, großes B',
          inhalt: (
            <>
              <Absatz>
                Die Abkürzungen sehen ähnlich aus, bedeuten aber Faktor 8: <strong>bit</strong> (oder kleines b) steht für Bit, großes <strong>B</strong> für Byte.
                Übertragungsraten werden fast immer in Bit je Sekunde angegeben (Mbit/s), Dateigrößen in Byte (MB, MiB).
              </Absatz>
              <Raten
                frage="Eine Leitung hat 50 Mbit/s. Wie viele MB kommen höchstens je Sekunde an?"
                optionen={['50 MB', '6,25 MB', '400 MB', '5 MB']}
                richtig="6,25 MB"
                hinweis={(v) => (v === '50 MB' ? 'Mbit ist nicht MB – da steckt Faktor 8 dazwischen.' : v === '400 MB' ? 'Bit → Byte: teilen, nicht malnehmen.' : '50 ÷ 8 = ?')}
              >
                <Formel>50 Mbit/s ÷ 8 = 6,25 MB/s</Formel>
                <Absatz>Deshalb lädt eine 50-Mbit/s-Leitung eine 100-MB-Datei nicht in 2 Sekunden, sondern in etwa 16.</Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Nibble, Byte, Wort',
          inhalt: (
            <Fakten>
              <Fakt titel="Nibble">4 Bit – genau eine Hex-Ziffer</Fakt>
              <Fakt titel="Byte">8 Bit – zwei Hex-Ziffern, Werte 0 bis 255</Fakt>
              <Fakt titel="Wort">mehrere Bytes, die ein Prozessor auf einmal verarbeitet (z. B. 32 oder 64 Bit)</Fakt>
            </Fakten>
          ),
        },
      ]}
    />
  );
}

function BitByteAusprobieren() {
  const [wert, setWert] = useState(64);
  const [einheit, setEinheit] = useState('Bit');
  const bit = wert === null ? null : einheit === 'Bit' ? wert : wert * 8;
  const byte = bit === null ? null : bit / 8;
  const kaesten = bit !== null && Number.isInteger(bit) && bit > 0 && bit <= 64;
  return (
    <Werkbank
      leiste={
        <>
          <ZahlFeld label="Wert" wert={wert ?? ''} onWert={setWert} />
          <Wahl label="Einheit" optionen={['Bit', 'Byte']} wert={einheit} onWert={setEinheit} />
        </>
      }
    >
      {bit !== null && (
        <>
          <Formel>
            {einheit === 'Bit' ? (
              <>
                {tausend(wert)} Bit ÷ 8 = <strong>{tausend(byte)} Byte</strong>
              </>
            ) : (
              <>
                {tausend(wert)} Byte · 8 = <strong>{tausend(bit)} Bit</strong>
              </>
            )}
          </Formel>
          {kaesten && (
            <div class="zl-kaesten" aria-label={`${bit} Bit in Gruppen zu 8`}>
              {Array.from({ length: Math.ceil(bit / 8) }, (_, b) => (
                <span key={b} class={`zl-kaesten__byte ${(b + 1) * 8 > bit ? 'zl-kaesten__byte--rest' : ''}`}>
                  {Array.from({ length: Math.min(8, bit - b * 8) }, (_, i) => (
                    <i key={i} />
                  ))}
                </span>
              ))}
            </div>
          )}
          {kaesten && !Number.isInteger(byte) && <Hinweis>Die letzte Gruppe ist nicht voll – {tausend(bit)} Bit sind kein ganzes Vielfaches von 8.</Hinweis>}
        </>
      )}
      <Beispiele
        titel="Beispiele:"
        liste={[
          { wert: '64', text: '64 Bit' },
          { wert: '12', text: '12 Bit' },
          { wert: 'b5', text: '5 Byte' },
          { wert: 'b120', text: '120 Byte' },
        ]}
        aktiv={null}
        onWahl={(w) => {
          if (w.startsWith('b')) {
            setEinheit('Byte');
            setWert(Number(w.slice(1)));
          } else {
            setEinheit('Bit');
            setWert(Number(w));
          }
        }}
      />
    </Werkbank>
  );
}

// ---------- 7 Dezimal- und Binärpräfixe ----------

const DEZ = ['Byte', 'kB', 'MB', 'GB', 'TB'];
const BIN = ['Byte', 'KiB', 'MiB', 'GiB', 'TiB'];

function PraefixeErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Zwei Arten von „Kilo“',
          inhalt: (
            <>
              <Absatz>
                „Kilo“ heißt eigentlich 1.000 – 1 km sind 1.000 m. Computer rechnen aber in Zweierpotenzen, und 2¹⁰ = 1.024 liegt nah an 1.000. Darum hat man früher bei Speicher
                „Kilo“ gesagt und 1.024 gemeint. Um die Verwechslung zu beenden, gibt es eigene <strong>Binärpräfixe</strong> mit einem „i“: Kibi, Mebi, Gibi, Tebi.
              </Absatz>
              <Fakten>
                <Fakt titel="Dezimalpräfix: kB">1 Kilobyte = 1.000 Byte</Fakt>
                <Fakt titel="Binärpräfix: KiB">1 Kibibyte = 1.024 Byte</Fakt>
              </Fakten>
            </>
          ),
        },
        {
          titel: 'Die ganze Tabelle',
          inhalt: (
            <>
              <Absatz>Jede Stufe ist 1.000-mal (dezimal) bzw. 1.024-mal (binär) so groß wie die vorige:</Absatz>
              <div class="lw-tabelle-huelle">
                <table class="lw-tabelle">
                  <thead>
                    <tr>
                      <th>Dezimal</th>
                      <th>in Byte</th>
                      <th>Binär</th>
                      <th>in Byte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((s) => (
                      <tr key={s}>
                        <td class="mono">1 {DEZ[s]}</td>
                        <td class="mono">
                          1.000{s > 1 && <sup>{s}</sup>} = {tausend(1000 ** s)}
                        </td>
                        <td class="mono">1 {BIN[s]}</td>
                        <td class="mono">
                          1.024{s > 1 && <sup>{s}</sup>} = {tausend(1024 ** s)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Hinweis>Kleines k bei kB (Kilo), großes K bei KiB (Kibi). Alle anderen Präfixe sind groß: MB, MiB, GB, GiB.</Hinweis>
            </>
          ),
        },
        {
          titel: 'Wer nimmt was?',
          inhalt: (
            <>
              <Absatz>In der Prüfung gilt eine feste Regel (Anhang des Prüfungskatalogs):</Absatz>
              <Fakten>
                <Fakt titel="Datenmengen" icon="hard-drive">
                  Byte mit <strong>Binärpräfix</strong>: KiB, MiB, GiB, TiB
                </Fakt>
                <Fakt titel="Übertragungsraten" icon="cable">
                  Bit je Sekunde mit <strong>Dezimalpräfix</strong>: kbit/s, Mbit/s, Gbit/s
                </Fakt>
                <Fakt titel="Hersteller von Datenträgern" icon="factory">
                  rechnen mit <strong>Dezimalpräfix</strong>: Eine „1-TB-Festplatte“ hat 10¹² Byte
                </Fakt>
              </Fakten>
              <Raten
                frage="Eine Leitung hat 100 Mbit/s. Wie viele bit/s sind das?"
                optionen={['100.000.000', '104.857.600', '12.500.000']}
                richtig="100.000.000"
                hinweis={(v) => (v === '104.857.600' ? 'Das wäre 100 · 1.024². Raten stehen aber mit Dezimalpräfix.' : 'Gefragt sind Bit, nicht Byte.')}
              >
                <Formel>100 Mbit/s = 100 · 1.000.000 bit/s = 100.000.000 bit/s</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die Treppe: ÷ 1.024 je Stufe',
          inhalt: (
            <>
              <Absatz>Innerhalb der Binärpräfixe geht es in Stufen zu je 1.024. Nach oben teilt man, nach unten multipliziert man. Ganz unten steht das Bit (Faktor 8):</Absatz>
              <Treppe stufen={['Bit', 'Byte', 'KiB', 'MiB', 'GiB', 'TiB']} faktoren={[8, 1024, 1024, 1024, 1024]} />
              <Raten
                frage="Wie viele MiB sind 3.145.728 Byte?"
                optionen={['3', '3,15', '3.072', '3.000']}
                richtig="3"
                hinweis={(v) =>
                  v === '3.072' ? 'Das sind KiB – noch eine Stufe weiter.' : v === '3,15' ? 'Das wäre ÷ 1.000.000 – MiB ist aber ein Binärpräfix.' : 'Zweimal ÷ 1.024.'
                }
              >
                <Formel>3.145.728 Byte ÷ 1.024 = 3.072 KiB ÷ 1.024 = 3 MiB</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Zwischen dezimal und binär: immer über Byte',
          inhalt: (
            <>
              <Absatz>
                Will man GB in GiB umrechnen, geht man den Umweg über Byte: <strong>erst in Byte</strong> (mit dem Faktor der alten Einheit),{' '}
                <strong>dann in die neue Einheit</strong> (mit ihrem Faktor).
              </Absatz>
              <Rechenweg
                titel="500 GB in GiB"
                zeilen={[
                  { text: 'In Byte: 500 · 1.000³', wert: '500.000.000.000 Byte' },
                  { text: 'In GiB: ÷ 1.024³ = ÷ 1.073.741.824', wert: '465,66 GiB' },
                ]}
              />
              <Absatz>Deshalb zeigt der Computer bei einer „500-GB-Festplatte“ nur rund 466 an. Es fehlt nichts – es ist nur eine andere Einheit.</Absatz>
            </>
          ),
        },
        {
          titel: 'Wie groß ist der Unterschied?',
          inhalt: (
            <>
              <Absatz>Mit jeder Stufe wächst die Abweichung, weil sich der Faktor 1,024 vervielfacht:</Absatz>
              <div class="zl-abweichung">
                {[1, 2, 3, 4].map((s) => {
                  const p = (1.024 ** s - 1) * 100;
                  return (
                    <div key={s} class="zl-abweichung__zeile">
                      <span class="mono">
                        {BIN[s]} / {DEZ[s]}
                      </span>
                      <span class="zl-abweichung__balken" style={{ '--breite': `${p * 9}%` }} />
                      <strong class="mono">+{tausend(Math.round(p * 10) / 10)} %</strong>
                    </div>
                  );
                })}
              </div>
              <Raten
                frage="Wie viele GiB hat eine Festplatte mit 1 TB?"
                optionen={['1.024', '1.000', '976,56', '931,32']}
                richtig="931,32"
                hinweis={(v) =>
                  v === '976,56'
                    ? 'Fast: Du hast nur einmal durch 1,024 geteilt. Der Faktor zwischen GB und GiB ist aber 1,024³.'
                    : 'Über Byte: 1 TB = 1.000.000.000.000 Byte, dann ÷ 1.073.741.824.'
                }
              >
                <Formel>10¹² Byte ÷ 1.024³ = 931,32 GiB</Formel>
              </Raten>
            </>
          ),
        },
      ]}
    />
  );
}

const EINHEITEN = [
  { id: 'Bit', byte: 1 / 8 },
  { id: 'Byte', byte: 1 },
  ...[1, 2, 3, 4].map((s) => ({ id: DEZ[s], byte: 1000 ** s })),
  ...[1, 2, 3, 4].map((s) => ({ id: BIN[s], byte: 1024 ** s })),
];

function PraefixeAusprobieren() {
  const [wert, setWert] = useState(500);
  const [von, setVon] = useState('GB');
  const [nach, setNach] = useState('GiB');
  const e1 = EINHEITEN.find((e) => e.id === von);
  const e2 = EINHEITEN.find((e) => e.id === nach);
  const byte = wert === null ? null : wert * e1.byte;
  const faktor = (e) => (e.id === 'Bit' ? '÷ 8' : e.id === 'Byte' ? '' : e.byte % 1000 === 0 ? hoch1000(Math.log10(e.byte) / 3) : hoch1024(Math.log2(e.byte) / 10));
  return (
    <Werkbank
      leiste={
        <>
          <ZahlFeld label="Wert" wert={wert ?? ''} onWert={setWert} />
          <Wahl label="von" optionen={EINHEITEN.map((e) => e.id)} wert={von} onWert={setVon} />
          <Wahl label="nach" optionen={EINHEITEN.map((e) => e.id)} wert={nach} onWert={setNach} />
        </>
      }
    >
      {byte !== null && (
        <Rechenweg
          zeilen={[
            von === 'Byte'
              ? { text: 'Schon in Byte', wert: `${tausend(byte)} Byte` }
              : von === 'Bit'
                ? { text: `In Byte: ${tausend(wert)} Bit ÷ 8`, wert: `${tausend(byte)} Byte` }
                : { text: `In Byte: ${tausend(wert)} · ${faktor(e1)}`, wert: `${tausend(byte)} Byte` },
            nach === 'Byte'
              ? { text: 'Fertig', wert: `${tausend(byte)} Byte`, ton: 'gut' }
              : nach === 'Bit'
                ? { text: 'In Bit: · 8', wert: `${tausend(byte * 8)} Bit`, ton: 'gut' }
                : { text: `In ${nach}: ÷ ${faktor(e2)} = ÷ ${tausend(e2.byte)}`, wert: `${zwei(byte / e2.byte)} ${nach}`, ton: 'gut' },
          ]}
        />
      )}
      <Beispiele
        titel="Beispiele:"
        liste={[
          { wert: '500 GB GiB', text: '500 GB → GiB' },
          { wert: '1 TB GiB', text: '1 TB → GiB' },
          { wert: '64 KiB kB', text: '64 KiB → kB' },
          { wert: '3145728 Byte MiB', text: '3.145.728 Byte → MiB' },
        ]}
        aktiv={`${wert} ${von} ${nach}`}
        onWahl={(b) => {
          const [w, a, z] = b.split(' ');
          setWert(Number(w));
          setVon(a);
          setNach(z);
        }}
      />
    </Werkbank>
  );
}

// ---------- 8 Speicherbedarf ----------

function SpeicherbedarfErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Die Grundformel',
          inhalt: (
            <>
              <Absatz>Jede Speicheraufgabe folgt demselben Muster: Wie viele Werte sind es, und wie viele Bit braucht ein Wert?</Absatz>
              <Formel>Speicherbedarf in Bit = Anzahl der Werte · Bit je Wert</Formel>
              <Absatz>
                Beispiel: Ein Sensor speichert 1.000 Messwerte zu je 16 Bit → 16.000 Bit ÷ 8 = 2.000 Byte. Danach geht es mit der bekannten Treppe weiter (÷ 1.024 je Stufe).
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Ein Bild ist ein Raster',
          inhalt: (
            <>
              <Absatz>
                Ein Digitalbild besteht aus <strong>Bildpunkten</strong> (Pixeln) in Zeilen und Spalten. Ihre Anzahl ist <strong>Breite · Höhe</strong>. Für jeden Bildpunkt
                speichert man die Farbe mit einer bestimmten Anzahl Bit – der <strong>Farbtiefe</strong>.
              </Absatz>
              <div class="zl-raster" aria-label="Bild aus 8 mal 5 Bildpunkten">
                {Array.from({ length: 40 }, (_, i) => (
                  <i key={i} style={{ '--ton': `${(i * 37) % 100}%` }} />
                ))}
              </div>
              <Absatz>8 · 5 = 40 Bildpunkte. Ein Full-HD-Bild hat 1.920 · 1.080 = 2.073.600 Bildpunkte.</Absatz>
              <Raten
                frage="Wie viele Byte braucht ein Bildpunkt bei 24 Bit Farbtiefe?"
                optionen={[3, 8, 24]}
                richtig={3}
                hinweis={(v) => (v === 24 ? '24 ist die Zahl der Bit – gefragt sind Byte.' : 'Bit → Byte: ÷ 8.')}
              >
                <Formel>24 Bit ÷ 8 = 3 Byte je Bildpunkt (je 1 Byte für Rot, Grün, Blau)</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Durchrechnen: 1.920 × 1.080, 24 Bit',
          inhalt: (
            <>
              <Absatz>In der Prüfung schreibst du jeden Schritt mit Einheit auf. Gerundet wird erst am Ende:</Absatz>
              <Rechenweg
                zeilen={[
                  { text: 'Bildpunkte: 1.920 · 1.080', wert: '2.073.600' },
                  { text: 'Bit: 2.073.600 · 24', wert: '49.766.400 Bit' },
                  { text: 'Byte: ÷ 8', wert: '6.220.800 Byte' },
                  { text: 'KiB: ÷ 1.024', wert: '6.075 KiB' },
                  { text: 'MiB: ÷ 1.024', wert: '5,93 MiB', ton: 'gut' },
                ]}
              />
            </>
          ),
        },
        {
          titel: 'Megapixel sind dezimal',
          inhalt: (
            <>
              <Absatz>
                Kameras geben die Auflösung in <strong>Megapixel</strong> an. „Mega“ ist hier ein Dezimalpräfix: <strong>1 Megapixel = 1.000.000 Bildpunkte</strong>. Erst die
                Datenmenge rechnest du dann binär um.
              </Absatz>
              <Rechenweg
                titel="12 Megapixel, 24 Bit"
                zeilen={[
                  { text: 'Bildpunkte: 12 · 1.000.000', wert: '12.000.000' },
                  { text: 'Byte: · 3 Byte je Bildpunkt', wert: '36.000.000 Byte' },
                  { text: 'MiB: ÷ 1.024 ÷ 1.024', wert: '34,33 MiB', ton: 'gut' },
                ]}
              />
            </>
          ),
        },
        {
          titel: 'Hochrechnen über einen Zeitraum',
          inhalt: (
            <>
              <Absatz>
                Oft geht es nicht um ein Bild, sondern um alle Bilder eines Monats oder Jahres. Dann multipliziert man mit der <strong>Anzahl</strong>: Bilder je Tag · Tage. Bei
                großen Mengen landet man bei GiB oder TiB.
              </Absatz>
              <Rechenweg
                titel="Überwachungskamera: 500 Bilder am Tag zu 2 Megapixel, 3 Byte je Bildpunkt, 30 Tage"
                zeilen={[
                  { text: 'Je Bild: 2.000.000 · 3 Byte', wert: '6.000.000 Byte' },
                  { text: 'Je Tag: · 500', wert: '3.000.000.000 Byte' },
                  { text: '30 Tage: · 30', wert: '90.000.000.000 Byte' },
                  { text: 'GiB: ÷ 1.024³', wert: '83,82 GiB', ton: 'gut' },
                ]}
              />
            </>
          ),
        },
        {
          titel: 'Mehrbedarf in Prozent',
          inhalt: (
            <>
              <Absatz>
                Ändert sich nur die Farbtiefe, wächst der Speicher im selben Verhältnis wie die Bit je Bildpunkt. Den Mehrbedarf gibt man in Prozent vom alten Wert an:
              </Absatz>
              <Formel>Mehrbedarf = (neu − alt) ÷ alt · 100 %</Formel>
              <Raten
                frage="Statt 8 Bit sollen 24 Bit je Bildpunkt gespeichert werden. Mehrbedarf?"
                optionen={['200 %', '300 %', '16 %', '66,67 %']}
                richtig="200 %"
                hinweis={(v) =>
                  v === '300 %'
                    ? '24 ist 300 % von 8 – gefragt ist aber der Zuwachs.'
                    : v === '66,67 %'
                      ? 'Du hast durch den neuen Wert geteilt. Bezug ist der alte.'
                      : '(24 − 8) ÷ 8 · 100 = ?'
                }
              >
                <Formel>(24 − 8) ÷ 8 · 100 % = 16 ÷ 8 · 100 % = 200 %</Formel>
              </Raten>
            </>
          ),
        },
      ]}
    />
  );
}

const TIEFEN = [1, 8, 16, 24, 32];
const BILDER = [
  { wert: '1920x1080', text: 'Full HD' },
  { wert: '3840x2160', text: '4K' },
  { wert: '4000x3000', text: '12 MP' },
  { wert: '1280x720', text: 'HD' },
];

function SpeicherbedarfAusprobieren() {
  const [breite, setBreite] = useState(1920);
  const [hoehe, setHoehe] = useState(1080);
  const [tiefe, setTiefe] = useState(24);
  const [anzahl, setAnzahl] = useState(1);
  const ok = [breite, hoehe, anzahl].every((x) => x !== null && x > 0);
  const px = ok ? breite * hoehe : 0;
  const bit = px * tiefe;
  const byte = bit / 8;
  const gesamt = byte * (anzahl ?? 1);
  const stufe = gesamt >= 1024 ** 4 ? 4 : gesamt >= 1024 ** 3 ? 3 : gesamt >= 1024 ** 2 ? 2 : 1;
  return (
    <Werkbank
      leiste={
        <>
          <ZahlFeld label="Breite" wert={breite ?? ''} onWert={setBreite} einheit="px" />
          <ZahlFeld label="Höhe" wert={hoehe ?? ''} onWert={setHoehe} einheit="px" />
          <Wahl label="Farbtiefe" optionen={TIEFEN.map((t) => ({ wert: t, text: `${t} Bit` }))} wert={tiefe} onWert={setTiefe} />
          <ZahlFeld label="Anzahl Bilder" wert={anzahl ?? ''} onWert={setAnzahl} />
        </>
      }
    >
      <Beispiele
        liste={BILDER}
        aktiv={`${breite}x${hoehe}`}
        onWahl={(w) => {
          const [b, h] = w.split('x').map(Number);
          setBreite(b);
          setHoehe(h);
        }}
      />
      {ok && (
        <Rechenweg
          zeilen={[
            { text: `Bildpunkte: ${tausend(breite)} · ${tausend(hoehe)}`, wert: tausend(px) },
            { text: `Bit: · ${tiefe}`, wert: `${tausend(bit)} Bit` },
            { text: 'Byte: ÷ 8', wert: `${rund(byte)} Byte` },
            ...(anzahl > 1 ? [{ text: `${tausend(anzahl)} Bilder: · ${tausend(anzahl)}`, wert: `${rund(gesamt)} Byte` }] : []),
            { text: `${BIN[stufe]}: ÷ 1.024${stufe > 1 ? hoch(stufe) : ''}`, wert: `${zwei(gesamt / 1024 ** stufe)} ${BIN[stufe]}`, ton: 'gut' },
          ]}
        />
      )}
    </Werkbank>
  );
}

// ---------- 9 Übertragungsdauer ----------

function UebertragungErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Menge durch Tempo',
          inhalt: (
            <>
              <Absatz>
                Wie lange es dauert, einen Eimer mit 10 Litern bei 2 Litern je Sekunde zu füllen? 10 ÷ 2 = 5 Sekunden. Bei Daten ist es genauso: Die <strong>Datenmenge</strong> ist
                der Eimer, die <strong>Übertragungsrate</strong> der Wasserhahn.
              </Absatz>
              <Formel>Übertragungsdauer = Datenmenge ÷ Übertragungsrate</Formel>
            </>
          ),
        },
        {
          titel: 'Die Einheiten-Falle',
          inhalt: (
            <>
              <Absatz>
                Die Formel funktioniert nur, wenn beide Größen dieselbe Einheit haben. Genau das ist in der Prüfung fast nie so: Die Datenmenge steht in <strong>Byte</strong> mit{' '}
                <strong>Binärpräfix</strong> (z. B. GiB), die Rate in <strong>Bit</strong> je Sekunde mit <strong>Dezimalpräfix</strong> (z. B. Mbit/s). Also bringt man beides auf
                Bit:
              </Absatz>
              <Fakten>
                <Fakt titel="Datenmenge → Bit">· 1.024 je Stufe, dann · 8</Fakt>
                <Fakt titel="Rate → bit/s">· 1.000 je Stufe</Fakt>
              </Fakten>
              <Raten
                frage="Wie viele bit/s sind 50 Mbit/s?"
                optionen={['50.000.000', '52.428.800', '6.250.000']}
                richtig="50.000.000"
                hinweis={(v) => (v === '52.428.800' ? 'Raten stehen mit Dezimalpräfix: · 1.000.000.' : 'Nicht in Byte umrechnen – gefragt sind Bit.')}
              >
                <Formel>50 · 1.000.000 = 50.000.000 bit/s</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Ein Beispiel durchrechnen',
          inhalt: (
            <>
              <Absatz>Wie lange dauert es, 2 GiB über eine 50-Mbit/s-Leitung zu übertragen?</Absatz>
              <Rechenweg
                zeilen={[
                  { text: 'Datenmenge in Byte: 2 · 1.024³', wert: '2.147.483.648 Byte' },
                  { text: 'in Bit: · 8', wert: '17.179.869.184 Bit' },
                  { text: 'Rate in bit/s: 50 · 1.000.000', wert: '50.000.000 bit/s' },
                  { text: 'Dauer: 17.179.869.184 ÷ 50.000.000', wert: '343,60 s', ton: 'gut' },
                ]}
              />
            </>
          ),
        },
        {
          titel: 'Sekunden in Minuten und Sekunden',
          inhalt: (
            <>
              <Absatz>
                Verlangt die Aufgabe Minuten und Sekunden, teilt man durch 60: Das Ganze sind die Minuten, der Rest die Sekunden. 343,60 s ≈ 344 s → 344 ÷ 60 = 5 Rest 44 →{' '}
                <strong>5 min 44 s</strong>.
              </Absatz>
              <Raten
                frage="Wie viel sind 200 Sekunden?"
                optionen={['3 min 20 s', '3,33 min', '2 min', '3 min 33 s']}
                richtig="3 min 20 s"
                hinweis={(v) =>
                  v === '3,33 min'
                    ? 'Stimmt als Dezimalzahl – gefragt sind aber Minuten und Sekunden.'
                    : v === '3 min 33 s'
                      ? 'Die Nachkommastellen von 3,33 sind keine Sekunden. Rechne den Rest aus.'
                      : '200 ÷ 60 = ? Rest ?'
                }
              >
                <Formel>200 ÷ 60 = 3 Rest 20 → 3 min 20 s</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Umgekehrt: Welche Rate brauche ich?',
          inhalt: (
            <>
              <Absatz>Stellt man die Formel um, erhält man die nötige Übertragungsrate:</Absatz>
              <Formel>Übertragungsrate = Datenmenge ÷ Dauer</Formel>
              <Absatz>
                Beispiel: 1 GiB soll in 60 Sekunden übertragen werden → 8.589.934.592 Bit ÷ 60 s = 143.165.576,53 bit/s ≈ <strong>143,17 Mbit/s</strong>.
              </Absatz>
            </>
          ),
        },
      ]}
    />
  );
}

const MENGEN = ['MiB', 'GiB', 'MB', 'GB'];
const RATEN = [
  { id: 'kbit/s', f: 1e3 },
  { id: 'Mbit/s', f: 1e6 },
  { id: 'Gbit/s', f: 1e9 },
];
const VERGLEICH = [16, 50, 100, 250, 1000];

function UebertragungAusprobieren() {
  const [menge, setMenge] = useState(2);
  const [einheit, setEinheit] = useState('GiB');
  const [rate, setRate] = useState(50);
  const [rEinheit, setREinheit] = useState('Mbit/s');
  const stufe = einheit.startsWith('M') ? 2 : 3;
  const byte = menge === null ? null : menge * (einheit.includes('i') ? 1024 : 1000) ** stufe;
  const bit = byte === null ? null : byte * 8;
  const f = RATEN.find((r) => r.id === rEinheit).f;
  const bps = rate === null || rate <= 0 ? null : rate * f;
  const sek = bit !== null && bps ? bit / bps : null;
  const ganze = sek === null ? 0 : Math.round(sek);
  const zeit = (s) => (s >= 3600 ? `${Math.floor(s / 3600)} h ${Math.floor((s % 3600) / 60)} min` : s >= 60 ? `${Math.floor(s / 60)} min ${Math.round(s % 60)} s` : `${zwei(s)} s`);
  const max = bit === null ? 1 : bit / (VERGLEICH[0] * 1e6);
  return (
    <Werkbank
      leiste={
        <>
          <ZahlFeld label="Datenmenge" wert={menge ?? ''} onWert={setMenge} />
          <Wahl label="Einheit" optionen={MENGEN} wert={einheit} onWert={setEinheit} />
          <ZahlFeld label="Übertragungsrate" wert={rate ?? ''} onWert={setRate} />
          <Wahl label="Einheit" optionen={RATEN.map((r) => r.id)} wert={rEinheit} onWert={setREinheit} />
        </>
      }
    >
      {sek !== null && (
        <>
          <Rechenweg
            zeilen={[
              { text: `Datenmenge in Byte: ${tausend(menge)} · ${einheit.includes('i') ? '1.024' : '1.000'}${hoch(stufe)}`, wert: `${tausend(byte)} Byte` },
              { text: 'in Bit: · 8', wert: `${tausend(bit)} Bit` },
              { text: `Rate in bit/s: ${tausend(rate)} · ${tausend(f)}`, wert: `${tausend(bps)} bit/s` },
              { text: 'Dauer: Bit ÷ bit/s', wert: `${zwei(sek)} s`, ton: 'gut' },
              ...(sek >= 60 ? [{ text: `${ganze} s ÷ 60 = ${Math.floor(ganze / 60)} Rest ${ganze % 60}`, wert: zeit(ganze) }] : []),
            ]}
          />
          {einheit.includes('i') !== true && <Hinweis>MB und GB sind Dezimalpräfixe. In der Prüfung stehen Datenmengen meist mit Binärpräfix (MiB, GiB).</Hinweis>}
          <div class="zl-vergleich-raten" aria-label="Dauer bei verschiedenen Raten">
            <span class="lw-feld__name">Dieselbe Datenmenge bei anderen Leitungen</span>
            {VERGLEICH.map((r) => {
              const s = bit / (r * 1e6);
              return (
                <div key={r} class={`zl-vergleich-raten__zeile ${rEinheit === 'Mbit/s' && rate === r ? 'zl-vergleich-raten__zeile--aktiv' : ''}`}>
                  <span class="mono">{tausend(r)} Mbit/s</span>
                  <span class="zl-vergleich-raten__balken" style={{ '--breite': `${Math.max(1, (s / max) * 100)}%` }} />
                  <span class="mono">{zeit(s)}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Werkbank>
  );
}

export const DATENMENGEN = {
  'bit-byte': { Erklaerung: BitByteErklaerung, Ausprobieren: BitByteAusprobieren },
  praefixe: { Erklaerung: PraefixeErklaerung, Ausprobieren: PraefixeAusprobieren },
  speicherbedarf: { Erklaerung: SpeicherbedarfErklaerung, Ausprobieren: SpeicherbedarfAusprobieren },
  uebertragung: { Erklaerung: UebertragungErklaerung, Ausprobieren: UebertragungAusprobieren },
};
