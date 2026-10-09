// Block 1 – Zahlensysteme: Stellenwertsystem, Binärzahl, Dezimal in binär, Zweierpotenzen, Hexadezimalzahl.

import { useState } from 'preact/hooks';
import { Knopf } from '../../../../../ui/bausteine.jsx';
import { Schritte, Raten, Absatz, Fakten, Fakt, Formel, Hinweis, Beispiele, Werkbank } from '../../../lernweg/bausteine.jsx';
import { Stellen, BitTafel, Umrechner, Restwert, Verdopplung, HexTafel, Nibbles, Wahl, HEX, tausend, binaer, gruppiert, hoch, stellenwertSchritte } from '../bausteine.jsx';

// ---------- 1 Stellenwertsystem ----------

function StellenwertErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Ziffern und Stellen',
          inhalt: (
            <>
              <Absatz>
                Die Zahl 352 besteht aus drei <strong>Ziffern</strong>: 3, 5 und 2. Was eine Ziffer wert ist, hängt davon ab, <strong>wo</strong> sie steht. Die 3 steht ganz links
                und bedeutet „3 Hunderter“, die 5 „5 Zehner“, die 2 „2 Einer“.
              </Absatz>
              <Stellen werte={[100, 10, 1]} ziffern={[3, 5, 2]} summe="= 3 · 100 + 5 · 10 + 2 · 1 = 352" />
              <Absatz>
                Diesen Wert einer Stelle nennt man <strong>Stellenwert</strong>. Deshalb ist die 3 in 300 mehr wert als in 30: gleiche Ziffer, anderer Stellenwert.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Jede Stelle ist zehnmal so viel wert',
          inhalt: (
            <>
              <Absatz>
                Von rechts nach links wird der Stellenwert jeweils <strong>zehnmal</strong> so groß. Mathematisch sind das Potenzen von 10: Die rechte Stelle ist 10⁰ = 1, dann 10¹
                = 10, 10² = 100, 10³ = 1.000 …
              </Absatz>
              <Verdopplung werte={[10000, 1000, 100, 10, 1]} faktor={10} />
              <Raten
                frage="Welchen Stellenwert hat die vierte Stelle von rechts?"
                optionen={[4, 40, 1000, 10000]}
                richtig={1000}
                format={tausend}
                hinweis={(v) => (v === 10000 ? 'Das ist schon die fünfte Stelle. Die rechte Stelle zählt mit (1).' : 'Zähl von rechts: 1, 10, 100, …')}
              >
                <Absatz>
                  Genau: 1, 10, 100, <strong>1.000</strong>. In 4.721 steht die 4 an dieser Stelle und trägt 4 · 1.000 = 4.000 bei.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die Basis bestimmt alles',
          inhalt: (
            <>
              <Absatz>
                Die 10 ist die <strong>Basis</strong> des Dezimalsystems. Sie legt zwei Dinge fest: wie viele Ziffern es gibt (10 Stück, 0 bis 9) und um welchen Faktor der
                Stellenwert wächst (mal 10). Nimmt man eine andere Basis, entsteht ein anderes Zahlensystem – nach genau denselben Regeln.
              </Absatz>
              <div class="lw-tabelle-huelle">
                <table class="lw-tabelle">
                  <thead>
                    <tr>
                      <th>System</th>
                      <th>Basis</th>
                      <th>Ziffern</th>
                      <th>Stellenwerte von rechts</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dezimal</td>
                      <td class="mono">10</td>
                      <td class="mono">0 – 9</td>
                      <td class="mono">1 · 10 · 100 · 1.000</td>
                    </tr>
                    <tr>
                      <td>Binär (Dual)</td>
                      <td class="mono">2</td>
                      <td class="mono">0, 1</td>
                      <td class="mono">1 · 2 · 4 · 8</td>
                    </tr>
                    <tr>
                      <td>Oktal</td>
                      <td class="mono">8</td>
                      <td class="mono">0 – 7</td>
                      <td class="mono">1 · 8 · 64 · 512</td>
                    </tr>
                    <tr>
                      <td>Hexadezimal</td>
                      <td class="mono">16</td>
                      <td class="mono">0 – 9, A – F</td>
                      <td class="mono">1 · 16 · 256 · 4.096</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Raten
                frage="Welche Ziffern gibt es im Binärsystem?"
                optionen={['0 und 1', '0, 1 und 2', '1 und 2', '0 bis 9']}
                richtig="0 und 1"
                hinweis={() => 'Die größte Ziffer ist immer Basis − 1.'}
              >
                <Absatz>
                  Basis 2 → zwei Ziffern: 0 und 1. Die größte Ziffer ist immer <strong>Basis − 1</strong> – im Dezimalsystem die 9, im Oktalsystem die 7.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Was ist „10“?',
          inhalt: (
            <>
              <Absatz>
                Die Zeichenfolge „10“ heißt in jedem System „eine Eins an der zweiten Stelle, eine Null an der ersten“. Ihr Wert ist also genau der Stellenwert der zweiten Stelle –
                und der ist die Basis.
              </Absatz>
              <Fakten>
                <Fakt titel="10 dezimal">1 · 10 + 0 = zehn</Fakt>
                <Fakt titel="10 binär">1 · 2 + 0 = zwei</Fakt>
                <Fakt titel="10 hexadezimal">1 · 16 + 0 = sechzehn</Fakt>
              </Fakten>
              <Absatz>
                Damit es keine Verwechslung gibt, schreibt man die Basis klein dazu: 10<sub>2</sub>, 10<sub>10</sub>, 10<sub>16</sub>. Üblich sind auch Vorsilben wie{' '}
                <span class="mono">0b1010</span> (binär) und <span class="mono">0x1F</span> oder <span class="mono">1Fh</span> (hexadezimal).
              </Absatz>
              <Raten
                frage="Welchen Dezimalwert hat 100 im Binärsystem?"
                optionen={[100, 4, 3, 8]}
                richtig={4}
                hinweis={(v) =>
                  v === 100 ? 'Im Binärsystem heißen die Stellenwerte 1, 2, 4 – nicht 1, 10, 100.' : 'Die 1 steht an der dritten Stelle. Welcher Stellenwert gehört dazu?'
                }
              >
                <Stellen werte={[4, 2, 1]} ziffern={[1, 0, 0]} summe="= 1 · 4 = 4" />
              </Raten>
            </>
          ),
        },
        {
          titel: 'Das Rezept für jede Basis',
          inhalt: (
            <>
              <Absatz>Egal welche Basis – der Wert einer Zahl entsteht immer gleich:</Absatz>
              <Formel>Wert = Summe aus (Ziffer · Stellenwert)</Formel>
              <Formel>Stellenwert = Basis hoch Stellennummer (die rechte Stelle hat die Nummer 0)</Formel>
              <Absatz>
                In den nächsten Lektionen wendest du genau dieses Rezept auf die Basis 2 (binär) und die Basis 16 (hexadezimal) an. Im Ausprobieren kannst du es jetzt schon mit
                jeder Basis testen.
              </Absatz>
            </>
          ),
        },
      ]}
    />
  );
}

const BASEN = [
  { wert: 2, text: 'binär (2)' },
  { wert: 8, text: 'oktal (8)' },
  { wert: 10, text: 'dezimal (10)' },
  { wert: 16, text: 'hex (16)' },
];
const BEISPIEL = { 2: '1011', 8: '157', 10: '352', 16: '1F4' };

function StellenwertAusprobieren() {
  const [basis, setBasis] = useState(2);
  const [text, setText] = useState(BEISPIEL[2]);
  const ziffern = text.toUpperCase().replace(/\s/g, '').split('');
  const ungueltig = ziffern.filter((z) => !HEX.slice(0, basis).includes(z));
  const ok = ziffern.length > 0 && ziffern.length <= 8 && ungueltig.length === 0;
  const werte = ziffern.map((_, i) => basis ** (ziffern.length - 1 - i));
  const summe = ok ? ziffern.reduce((a, z, i) => a + HEX.indexOf(z) * werte[i], 0) : 0;
  return (
    <Werkbank
      leiste={
        <>
          <Wahl
            label="Basis"
            optionen={BASEN}
            wert={basis}
            onWert={(b) => {
              setBasis(b);
              setText(BEISPIEL[b]);
            }}
          />
          <label class="lw-feld">
            <span class="lw-feld__name">Zahl (bis 8 Ziffern)</span>
            <input
              class={`feld feld--mono lw-feld__eingabe ${ok ? '' : 'feld--falsch'}`}
              value={text}
              spellcheck={false}
              autoComplete="off"
              onInput={(e) => setText(e.currentTarget.value)}
            />
            {ungueltig.length > 0 && (
              <span class="lw-feld__fehler">
                „{ungueltig[0]}“ gibt es zur Basis {basis} nicht – erlaubt: {HEX.slice(0, basis).split('').join(', ')}.
              </span>
            )}
          </label>
        </>
      }
    >
      {ok && (
        <>
          <Stellen werte={werte} ziffern={ziffern} />
          <Formel>
            {ziffern
              .map((z, i) => [z, HEX.indexOf(z), werte[i]])
              .filter(([, w]) => w > 0)
              .map(([z, w, s]) => `${w} · ${tausend(s)}`)
              .join(' + ') || '0'}{' '}
            = <strong>{tausend(summe)}</strong>
          </Formel>
          {basis === 16 && ziffern.some((z) => HEX.indexOf(z) > 9) && <Hinweis>Buchstaben stehen für Werte: A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.</Hinweis>}
        </>
      )}
    </Werkbank>
  );
}

// ---------- 2 Binärzahl ----------

function BinaerErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Zwei Zustände: an und aus',
          inhalt: (
            <>
              <Absatz>
                Ein Computer speichert alles mit winzigen Schaltern, die nur zwei Zustände kennen: Strom an oder aus, magnetisiert oder nicht. Darum rechnet er im{' '}
                <strong>Binärsystem</strong> (Zweiersystem, Dualsystem) mit nur zwei Ziffern: <span class="mono">0</span> und <span class="mono">1</span>. Eine solche Ziffer heißt{' '}
                <strong>Bit</strong> (binary digit).
              </Absatz>
              <Absatz>Gezählt wird wie im Dezimalsystem – nur dass die Ziffern schon nach der 1 ausgehen und eine neue Stelle beginnt:</Absatz>
              <div class="lw-tabelle-huelle">
                <table class="lw-tabelle zl-zaehlen">
                  <tbody>
                    <tr>
                      <th>dezimal</th>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <td key={n} class="mono">
                          {n}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th>binär</th>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <td key={n} class="mono">
                          {n.toString(2)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <Absatz>Bei 2, 4 und 8 springt die Binärzahl um eine Stelle – so wie dezimal bei 10, 100 und 1.000.</Absatz>
            </>
          ),
        },
        {
          titel: 'Die Stellenwerte verdoppeln sich',
          inhalt: (
            <>
              <Absatz>
                Die Basis ist 2, also wird der Stellenwert von rechts nach links jeweils <strong>doppelt</strong> so groß: 2⁰ = 1, 2¹ = 2, 2² = 4 … Für 8 Bit:
              </Absatz>
              <Verdopplung werte={[128, 64, 32, 16, 8, 4, 2, 1]} />
              <Absatz>
                Diese Reihe <span class="mono">128 · 64 · 32 · 16 · 8 · 4 · 2 · 1</span> brauchst du ständig. Am einfachsten: rechts bei 1 anfangen und immer verdoppeln.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Binär → dezimal: Einsen addieren',
          inhalt: (
            <>
              <Absatz>Eine 1 heißt „dieser Stellenwert zählt mit“, eine 0 „zählt nicht“. Also addiert man einfach die Stellenwerte über den Einsen:</Absatz>
              <Stellen werte={[128, 64, 32, 16, 8, 4, 2, 1]} ziffern={[1, 1, 0, 0, 1, 0, 0, 0]} summe="= 128 + 64 + 8 = 200" />
              <Raten
                frage="Welchen Wert hat 0000 1010?"
                optionen={[10, 12, 20, 1010]}
                richtig={10}
                hinweis={(v) =>
                  v === 1010 ? 'Das ist die Binärschreibweise selbst – gesucht ist der Wert. Welche Stellenwerte stehen über den Einsen?' : 'Die Einsen stehen unter 8 und 2.'
                }
              >
                <Stellen werte={[128, 64, 32, 16, 8, 4, 2, 1]} ziffern={[0, 0, 0, 0, 1, 0, 1, 0]} summe="= 8 + 2 = 10" />
              </Raten>
            </>
          ),
        },
        {
          titel: 'Lange Binärzahlen lesbar schreiben',
          inhalt: (
            <>
              <Absatz>
                Lange Bitketten liest man leichter in <strong>Vierergruppen</strong>, von rechts gebildet: <span class="mono">11001000</span> schreibt man als{' '}
                <span class="mono">1100 1000</span>. Führende Nullen ändern den Wert nicht – wie bei 007 und 7.
              </Absatz>
              <Raten
                frage="Sind 0101 und 101 dieselbe Zahl?"
                optionen={['ja, beides ist 5', 'nein, 0101 ist größer', 'nein, 0101 ist kleiner']}
                richtig="ja, beides ist 5"
                hinweis={() => 'Die führende Null steht unter dem Stellenwert 8 – zählt sie mit?'}
              >
                <Absatz>
                  Ja: 4 + 1 = 5. Die Null vorne trägt nichts bei. Man schreibt sie oft trotzdem hin, damit alle Zahlen gleich lang sind – z. B. immer 8 Bit für ein Byte.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Gerade oder ungerade – auf einen Blick',
          inhalt: (
            <>
              <Absatz>
                Alle Stellenwerte außer dem rechten (1) sind gerade. Ob eine Binärzahl gerade oder ungerade ist, entscheidet also nur das <strong>rechte Bit</strong>.
              </Absatz>
              <Raten frage="Welche dieser Zahlen ist ungerade?" optionen={['1100', '1011', '1000', '0110']} richtig="1011" hinweis={() => 'Schau nur auf das rechte Bit.'}>
                <Stellen werte={[8, 4, 2, 1]} ziffern={[1, 0, 1, 1]} summe="= 8 + 2 + 1 = 11 (ungerade)" />
              </Raten>
            </>
          ),
        },
      ]}
    />
  );
}

const ZIELE = [5, 12, 100, 200, 37, 255, 64, 170, 99, 128, 7, 240];

function BinaerAusprobieren() {
  const [wert, setWert] = useState(0);
  const [zielNr, setZielNr] = useState(0);
  const [weg, setWeg] = useState(false);
  const ziel = ZIELE[zielNr % ZIELE.length];
  const geschafft = wert === ziel;
  return (
    <Werkbank>
      <p class="lw-aufgabe">
        Klick auf die Bits, um sie an- und auszuschalten. Aufgabe: Stell die Zahl <strong class="mono">{ziel}</strong> ein.
      </p>
      <BitTafel wert={wert} onWert={setWert} ziel={ziel} />
      {geschafft ? (
        <Hinweis ton="gut" icon="party-popper">
          Genau: {ziel} = <span class="mono">{gruppiert(binaer(ziel))}</span>.
        </Hinweis>
      ) : (
        weg && (
          <ol class="zl-liste-weg">
            {stellenwertSchritte(ziel).map((s) => (
              <li key={s.gewicht} class={s.passt ? 'zl-liste-weg__ja' : ''}>
                {s.gewicht} in {s.vorher}? {s.passt ? `ja → 1, Rest ${s.nachher}` : 'nein → 0'}
              </li>
            ))}
          </ol>
        )
      )}
      <div class="lw-knoepfe">
        <Knopf
          variante={geschafft ? 'primaer' : 'zweit'}
          groesse="s"
          iconRechts="arrow-right"
          onClick={() => {
            setZielNr(zielNr + 1);
            setWert(0);
            setWeg(false);
          }}
        >
          Nächste Zahl
        </Knopf>
        {!geschafft && (
          <Knopf variante="geist" groesse="s" icon="lightbulb" onClick={() => setWeg(!weg)}>
            {weg ? 'Hilfe ausblenden' : 'Welche Bits?'}
          </Knopf>
        )}
      </div>
    </Werkbank>
  );
}

// ---------- 3 Dezimal in binär umrechnen ----------

function DezimalBinaerErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Zwei Wege, ein Ergebnis',
          inhalt: (
            <>
              <Absatz>
                Binär → dezimal war einfach: Stellenwerte addieren. Für die Gegenrichtung gibt es zwei Verfahren. Beide liefern dasselbe Ergebnis – nimm in der Prüfung das, mit dem
                du sicherer bist.
              </Absatz>
              <Fakten>
                <Fakt titel="Stellenwertverfahren" icon="arrow-right">
                  Von links: Passt der Stellenwert noch in den Rest? Gut für Zahlen bis 255.
                </Fakt>
                <Fakt titel="Restwertverfahren" icon="arrow-down">
                  Immer wieder durch 2 teilen und die Reste notieren. Klappt mit jeder Größe – und mit jeder Basis.
                </Fakt>
              </Fakten>
            </>
          ),
        },
        {
          titel: 'Stellenwertverfahren: Passt es noch?',
          inhalt: (
            <>
              <Absatz>
                Man geht von links nach rechts und fragt bei jedem Stellenwert: <strong>Passt er in den Rest?</strong> Ja → 1 schreiben und abziehen. Nein → 0 schreiben. Klick dich
                durch das Beispiel 150:
              </Absatz>
              <Umrechner wert={150} />
            </>
          ),
        },
        {
          titel: 'Restwertverfahren: durch 2 teilen',
          inhalt: (
            <>
              <Absatz>
                Man teilt die Zahl durch 2 und schreibt den <strong>Rest</strong> auf (0 oder 1). Mit dem Ergebnis macht man weiter, bis 0 herauskommt. Dann liest man die Reste{' '}
                <strong>von unten nach oben</strong>. Beispiel 200:
              </Absatz>
              <Restwert wert={200} />
            </>
          ),
        },
        {
          titel: 'Warum von unten nach oben?',
          inhalt: (
            <>
              <Absatz>
                Der erste Rest beantwortet die Frage „Ist die Zahl gerade?“ – und das entscheidet das rechte Bit (Stellenwert 1). Jede weitere Division schiebt die Zahl um eine
                Stelle nach rechts. Der erste Rest ist also das <strong>rechte</strong> Bit, der letzte das <strong>linke</strong>.
              </Absatz>
              <Raten
                frage="Welches Bit liefert der letzte Rest (1 ÷ 2 = 0 Rest 1)?"
                optionen={['das linke Bit', 'das rechte Bit', 'gar keins – man hört vorher auf']}
                richtig="das linke Bit"
                hinweis={(v) =>
                  v === 'das rechte Bit' ? 'Das rechte Bit kommt aus dem ersten Rest.' : 'Erst wenn der Quotient 0 ist, ist man fertig – diese letzte 1 gehört dazu.'
                }
              >
                <Absatz>Genau. Darum: weiterteilen, bis 0 herauskommt, und die letzte 1 nicht vergessen – sie ist das linke, höchste Bit.</Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Probe: zurückrechnen',
          inhalt: (
            <>
              <Absatz>Rechne das Ergebnis immer zurück. Das kostet zehn Sekunden und findet fast jeden Fehler:</Absatz>
              <Stellen werte={[128, 64, 32, 16, 8, 4, 2, 1]} ziffern={[1, 1, 0, 0, 1, 0, 0, 0]} summe="= 128 + 64 + 8 = 200 ✓" />
              <Raten
                frage="Was ist 37 im Binärsystem?"
                optionen={['100101', '101001', '100110', '110001']}
                richtig="100101"
                hinweis={(v) => {
                  const w = parseInt(v, 2);
                  return `${v} wäre ${w} – Probe stimmt nicht. ${w === 41 ? 'Hast du die Reste von oben nach unten gelesen?' : ''}`;
                }}
              >
                <Stellen werte={[32, 16, 8, 4, 2, 1]} ziffern={[1, 0, 0, 1, 0, 1]} summe="= 32 + 4 + 1 = 37 ✓" />
              </Raten>
            </>
          ),
        },
        {
          titel: 'Das Restwertverfahren geht mit jeder Basis',
          inhalt: (
            <>
              <Absatz>
                Teilt man nicht durch 2, sondern durch 8 oder 16, erhält man die Oktal- bzw. Hexadezimalzahl. Für 16 brauchst du die Ziffern A bis F – die kommen in Lektion 5. Hier
                schon einmal 200 durch 8:
              </Absatz>
              <Restwert wert={200} basis={8} />
            </>
          ),
        },
      ]}
    />
  );
}

function DezimalBinaerAusprobieren() {
  const [text, setText] = useState('77');
  const [verfahren, setVerfahren] = useState('rest');
  const zahl = /^\d{1,3}$/.test(text.trim()) ? Number(text.trim()) : null;
  const ok = zahl !== null && zahl <= 255;
  return (
    <Werkbank
      leiste={
        <>
          <label class="lw-feld">
            <span class="lw-feld__name">Dezimalzahl (0 bis 255)</span>
            <input class={`feld feld--mono lw-feld__eingabe ${ok ? '' : 'feld--falsch'}`} value={text} inputMode="numeric" onInput={(e) => setText(e.currentTarget.value)} />
            {!ok && <span class="lw-feld__fehler">Bitte eine ganze Zahl von 0 bis 255.</span>}
          </label>
          <Wahl
            label="Verfahren"
            optionen={[
              { wert: 'rest', text: 'Restwert (÷ 2)' },
              { wert: 'stelle', text: 'Stellenwert' },
            ]}
            wert={verfahren}
            onWert={setVerfahren}
          />
        </>
      }
    >
      <Beispiele liste={['77', '13', '100', '192', '255', '0']} aktiv={text} onWahl={setText} />
      {ok && (verfahren === 'rest' ? <Restwert key={`r${zahl}`} wert={zahl} /> : <Umrechner key={`s${zahl}`} wert={zahl} />)}
    </Werkbank>
  );
}

// ---------- 4 Zweierpotenzen ----------

function ZweierpotenzenErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Wie viele Muster gibt es?',
          inhalt: (
            <>
              <Absatz>Ein Bit hat 2 Zustände. Wie viele verschiedene Muster ergeben 2 Bit, 3 Bit? Zählen wir sie einfach auf:</Absatz>
              <div class="zl-muster">
                {[1, 2, 3].map((n) => (
                  <div key={n} class="zl-muster__spalte">
                    <span class="zl-muster__kopf">
                      {n} Bit → <strong>{2 ** n}</strong>
                    </span>
                    {Array.from({ length: 2 ** n }, (_, i) => (
                      <span key={i} class="zl-muster__wert mono">
                        {binaer(i, n)}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <Absatz>
                Jedes neue Bit <strong>verdoppelt</strong> die Zahl der Muster: Alle bisherigen Muster gibt es einmal mit 0 und einmal mit 1 davor.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'n Bit → 2ⁿ Werte',
          inhalt: (
            <>
              <Absatz>
                n-mal verdoppeln heißt: 2 hoch n. Mit <strong>n Bit</strong> lassen sich <strong>2ⁿ verschiedene Werte</strong> darstellen. Die Hochzahl sagt, wie oft man die 2 mit
                sich selbst malnimmt – 2³ = 2 · 2 · 2 = 8, nicht 2 · 3.
              </Absatz>
              <Raten
                frage="Wie viele Werte gibt es mit 4 Bit?"
                optionen={[8, 15, 16, 32]}
                richtig={16}
                hinweis={(v) => (v === 15 ? '15 ist die größte Zahl – gefragt ist die Anzahl der Werte, die 0 zählt mit.' : v === 8 ? 'Das wären 3 Bit.' : 'Rechne 2 · 2 · 2 · 2.')}
              >
                <Absatz>
                  2⁴ = 16. Das sind die Muster <span class="mono">0000</span> bis <span class="mono">1111</span>.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Gezählt wird ab 0',
          inhalt: (
            <>
              <Absatz>
                Weil der erste Wert die 0 ist, reicht der Bereich von <strong>0 bis 2ⁿ − 1</strong>. Die beiden Zahlen „Anzahl der Werte“ und „größte Zahl“ unterscheiden sich darum
                immer um 1:
              </Absatz>
              <Fakten>
                <Fakt titel="4 Bit">16 Werte · 0 bis 15</Fakt>
                <Fakt titel="8 Bit (1 Byte)">256 Werte · 0 bis 255</Fakt>
                <Fakt titel="16 Bit">65.536 Werte · 0 bis 65.535</Fakt>
              </Fakten>
              <Raten
                frage="Welche ist die größte Zahl, die mit 8 Bit geht?"
                optionen={[128, 255, 256]}
                richtig={255}
                hinweis={() => 'Es sind 256 Werte – und der erste ist die 0.'}
              >
                <Absatz>
                  255 = <span class="mono">1111 1111</span>. Darum geht jedes Oktett einer IPv4-Adresse nur bis 255.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die Tabelle bis 2¹⁰',
          inhalt: (
            <>
              <Absatz>Diese Werte solltest du auswendig können – oder schnell durch Verdoppeln herleiten:</Absatz>
              <div class="lw-tabelle-huelle">
                <table class="lw-tabelle zl-potenzen">
                  <tbody>
                    <tr>
                      <th>n</th>
                      {Array.from({ length: 11 }, (_, n) => (
                        <td key={n} class="mono">
                          {n}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th>2ⁿ</th>
                      {Array.from({ length: 11 }, (_, n) => (
                        <td key={n} class="mono">
                          {tausend(2 ** n)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <Hinweis icon="lightbulb">
                2¹⁰ = 1.024 liegt ganz nah an 1.000. Daher kommt die Verwirrung zwischen „Kilobyte“ und „Kibibyte“ – mehr dazu im Block Datenmengen.
              </Hinweis>
            </>
          ),
        },
        {
          titel: 'Umgekehrt: Wie viele Bit brauche ich?',
          inhalt: (
            <>
              <Absatz>
                Oft ist die Frage andersherum: Es sollen N verschiedene Werte gespeichert werden – wie viele Bit sind nötig? Gesucht ist das kleinste n mit <strong>2ⁿ ≥ N</strong>.
                Beispiel: 26 Buchstaben → 2⁴ = 16 reicht nicht, 2⁵ = 32 reicht → 5 Bit.
              </Absatz>
              <Raten
                frage="Wie viele Bit braucht man mindestens für 100 verschiedene Werte?"
                optionen={[6, 7, 8, 100]}
                richtig={7}
                hinweis={(v) => (v === 6 ? '2⁶ = 64 – zu wenig.' : v === 8 ? '8 Bit gehen auch, aber es geht mit weniger.' : 'Such die kleinste Zweierpotenz ab 100.')}
              >
                <Absatz>2⁶ = 64 &lt; 100 ≤ 128 = 2⁷. Also 7 Bit.</Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Farbtiefe',
          inhalt: (
            <>
              <Absatz>
                Die <strong>Farbtiefe</strong> eines Bildes sagt, wie viele Bit je Bildpunkt gespeichert werden – und damit, wie viele Farben möglich sind:
              </Absatz>
              <Fakten>
                <Fakt titel="1 Bit">2¹ = 2 Farben (schwarz/weiß)</Fakt>
                <Fakt titel="8 Bit">2⁸ = 256 Farben</Fakt>
                <Fakt titel="24 Bit (True Color)">je 8 Bit für Rot, Grün, Blau: 2²⁴ = 16.777.216 Farben</Fakt>
              </Fakten>
              <Formel>256 · 256 · 256 = 2⁸ · 2⁸ · 2⁸ = 2²⁴ = 16.777.216</Formel>
            </>
          ),
        },
      ]}
    />
  );
}

function ZweierpotenzenAusprobieren() {
  const [n, setN] = useState(8);
  const [bedarf, setBedarf] = useState('100');
  const N = /^\d{1,10}$/.test(bedarf.trim()) ? Number(bedarf.trim()) : null;
  const noetig = N && N > 1 ? Math.ceil(Math.log2(N)) : N === 1 ? 0 : null;
  const BEISPIELE = { 1: 'schwarz/weiß', 4: 'eine Hex-Ziffer', 8: 'ein Byte, ein Oktett', 16: 'eine Portnummer (0–65.535)', 24: 'True Color', 32: 'eine IPv4-Adresse' };
  return (
    <Werkbank>
      <div class="zl-regler">
        <span class="lw-feld__name">Anzahl Bit</span>
        <div class="zl-regler__reihe">
          <button type="button" class="zl-regler__knopf" onClick={() => setN(Math.max(1, n - 1))} disabled={n <= 1} aria-label="ein Bit weniger">
            −
          </button>
          <strong class="zl-regler__wert mono">{n} Bit</strong>
          <button type="button" class="zl-regler__knopf" onClick={() => setN(Math.min(32, n + 1))} disabled={n >= 32} aria-label="ein Bit mehr">
            +
          </button>
          <input type="range" class="zl-regler__regler" min={1} max={32} value={n} onInput={(e) => setN(Number(e.currentTarget.value))} aria-label="Anzahl Bit" />
        </div>
      </div>
      <Fakten>
        <Fakt titel="Anzahl Werte">
          2<sup>{n}</sup> = <strong class="mono">{tausend(2 ** n)}</strong>
        </Fakt>
        <Fakt titel="Wertebereich">
          <span class="mono">0 bis {tausend(2 ** n - 1)}</span>
        </Fakt>
        <Fakt titel="Größte Zahl binär">
          <span class="mono">{gruppiert('1'.repeat(n))}</span>
        </Fakt>
      </Fakten>
      {BEISPIELE[n] && (
        <Hinweis icon="lightbulb">
          {n} Bit kennst du schon: {BEISPIELE[n]}.
        </Hinweis>
      )}
      <label class="lw-feld">
        <span class="lw-feld__name">Wie viele Bit für so viele Werte?</span>
        <input class="feld feld--mono lw-feld__eingabe" value={bedarf} inputMode="numeric" onInput={(e) => setBedarf(e.currentTarget.value)} />
      </label>
      {noetig !== null && (
        <Formel>
          {N} Werte → {noetig > 0 ? `2${hoch(noetig)} = ${tausend(2 ** noetig)} ≥ ${tausend(N)}` : 'ein einziger Wert braucht kein Bit'}
          {noetig > 1 && ` (2${hoch(noetig - 1)} = ${tausend(2 ** (noetig - 1))} reicht nicht)`} → <strong>{noetig} Bit</strong>
        </Formel>
      )}
    </Werkbank>
  );
}

// ---------- 5 Hexadezimalzahl ----------

function HexErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Lange Bitketten',
          inhalt: (
            <>
              <Absatz>
                Eine MAC-Adresse hat 48 Bit, eine IPv6-Adresse 128 Bit. Binär geschrieben wären sie endlos lang. Dezimal passt schlecht zu Bits – man sieht der Zahl 200 nicht an,
                welche Bits gesetzt sind. Die Lösung ist ein Zahlensystem, bei dem <strong>eine Ziffer genau 4 Bit</strong> entspricht: das <strong>Hexadezimalsystem</strong>.
              </Absatz>
              <div class="zl-vergleich mono">
                <span class="zl-vergleich__name">binär</span>
                <span>0000 0000 0001 1010 0010 1011 0011 1100 0100 1101 0101 1110</span>
                <span class="zl-vergleich__name">hexadezimal</span>
                <strong class="zl-vergleich__hex">00:1A:2B:3C:4D:5E</strong>
              </div>
              <Absatz>Beides ist dieselbe MAC-Adresse – hexadezimal nur viermal so kurz.</Absatz>
            </>
          ),
        },
        {
          titel: 'Basis 16: Ziffern 0 bis 9 und A bis F',
          inhalt: (
            <>
              <Absatz>
                Das Hexadezimalsystem (kurz <strong>Hex</strong>) hat die Basis 16, braucht also 16 Ziffern. Für die Werte 10 bis 15 nimmt man Buchstaben: A = 10, B = 11 … F = 15.
              </Absatz>
              <HexTafel />
            </>
          ),
        },
        {
          titel: 'Eine Hex-Ziffer = 4 Bit',
          inhalt: (
            <>
              <Absatz>
                Die Tafel zeigt: Für die 16 Werte 0 bis 15 braucht man genau <strong>4 Bit</strong> (0000 bis 1111, denn 2⁴ = 16). Jede Hex-Ziffer steht also für ein 4er-Päckchen
                Bits. Ein solches Päckchen heißt auch <strong>Nibble</strong> (Halbbyte).
              </Absatz>
              <Raten
                frage="Welche Hex-Ziffer steht für 1100?"
                optionen={['B', 'C', 'D', '12']}
                richtig="C"
                hinweis={(v) => (v === '12' ? '1100 ist dezimal 12 – als Hex-Ziffer schreibt man dafür einen Buchstaben.' : '1100 = 8 + 4 = 12. Welcher Buchstabe steht für 12?')}
              >
                <Stellen werte={[8, 4, 2, 1]} ziffern={[1, 1, 0, 0]} summe="= 8 + 4 = 12 = C" />
              </Raten>
            </>
          ),
        },
        {
          titel: 'Binär ↔ hexadezimal: in Vierergruppen',
          inhalt: (
            <>
              <Absatz>
                Darum ist das Umrechnen zwischen binär und hex ganz einfach: Die Binärzahl <strong>von rechts</strong> in Vierergruppen teilen und jede Gruppe einzeln übersetzen.
                Fehlen links Bits, füllt man mit Nullen auf.
              </Absatz>
              <Nibbles wert={0xb6} />
              <Nibbles wert={0x16a} />
              <Absatz>
                Rückwärts genauso: Jede Hex-Ziffer wird zu genau vier Bit. <span class="mono">3F</span> → <span class="mono">0011 1111</span>.
              </Absatz>
              <Raten
                frage="Welche Hex-Zahl ist 1111 0000?"
                optionen={['F0', '0F', 'FF', '150']}
                richtig="F0"
                hinweis={(v) => (v === '0F' ? 'Die linke Gruppe 1111 kommt nach links: F zuerst.' : 'Übersetze 1111 und 0000 einzeln.')}
              >
                <Nibbles wert={0xf0} />
              </Raten>
            </>
          ),
        },
        {
          titel: 'Hexadezimal → dezimal',
          inhalt: (
            <>
              <Absatz>
                Ins Dezimale rechnet man mit dem bekannten Rezept: Ziffer · Stellenwert. Die Stellenwerte sind Potenzen von 16: <span class="mono">1 · 16 · 256 · 4.096</span>.
              </Absatz>
              <Stellen werte={[16, 1]} ziffern={['C', '8']} summe="= 12 · 16 + 8 · 1 = 200" />
              <Stellen werte={[256, 16, 1]} ziffern={['1', 'F', '4']} summe="= 1 · 256 + 15 · 16 + 4 · 1 = 500" />
              <Raten
                frage="Welchen Dezimalwert hat FF?"
                optionen={[30, 255, 256, 1515]}
                richtig={255}
                hinweis={(v) =>
                  v === 30 ? 'Die linke F zählt 16-fach: 15 · 16.' : v === 256 ? 'FF ist die größte zweistellige Hex-Zahl – wie 99 dezimal. Also eins weniger als 16².' : 'F = 15.'
                }
              >
                <Absatz>
                  15 · 16 + 15 = 255. Ein Byte geht also von <span class="mono">00</span> bis <span class="mono">FF</span> – genau wie von 0 bis 255.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Dezimal → hexadezimal',
          inhalt: (
            <>
              <Absatz>
                Zwei Wege: entweder erst ins Binärsystem und dann in Vierergruppen – oder direkt mit dem Restwertverfahren, diesmal durch 16. Reste über 9 schreibt man als
                Buchstaben.
              </Absatz>
              <Restwert wert={500} basis={16} />
            </>
          ),
        },
        {
          titel: 'Wo dir Hex begegnet',
          inhalt: (
            <>
              <Fakten>
                <Fakt titel="MAC-Adressen">6 Bytes = 12 Hex-Ziffern, z. B. 00:1A:2B:3C:4D:5E</Fakt>
                <Fakt titel="IPv6-Adressen">8 Blöcke zu je 4 Hex-Ziffern, z. B. 2001:db8::1</Fakt>
                <Fakt titel="Farbcodes">#FF8800 – je ein Byte für Rot, Grün, Blau</Fakt>
                <Fakt titel="Schreibweisen">0x1F, 1Fh oder 1F₁₆ – groß und klein ist gleich</Fakt>
              </Fakten>
            </>
          ),
        },
      ]}
    />
  );
}

// Dezimal, binär und hex gleichzeitig: jede Eingabe stellt die anderen beiden ein (0 … 65.535)
function HexAusprobieren() {
  const [wert, setWert] = useState(200);
  const [texte, setTexte] = useState({ dez: '200', bin: gruppiert(binaer(200)), hex: 'C8' });
  const LESEN = { dez: [/^\d{1,5}$/, 10], bin: [/^[01]{1,16}$/, 2], hex: [/^[0-9a-f]{1,4}$/i, 16] };
  const setze = (art, t) => {
    const s = t.replace(/\s/g, '');
    const [re, basis] = LESEN[art];
    const neu = { ...texte, [art]: t };
    if (re.test(s) && parseInt(s, basis) <= 65535) {
      const w = parseInt(s, basis);
      setWert(w);
      if (art !== 'dez') neu.dez = String(w);
      if (art !== 'bin') neu.bin = gruppiert(w.toString(2));
      if (art !== 'hex') neu.hex = w.toString(16).toUpperCase();
    }
    setTexte(neu);
  };
  const feld = (art, name) => {
    const [re, basis] = LESEN[art];
    const s = texte[art].replace(/\s/g, '');
    const ok = re.test(s) && parseInt(s, basis) <= 65535;
    return (
      <label class="lw-feld lw-feld--breit">
        <span class="lw-feld__name">{name}</span>
        <input
          class={`feld feld--mono lw-feld__eingabe ${ok ? '' : 'feld--falsch'}`}
          value={texte[art]}
          spellcheck={false}
          autoComplete="off"
          onInput={(e) => setze(art, e.currentTarget.value)}
        />
      </label>
    );
  };
  const kurz = wert <= 255;
  return (
    <Werkbank>
      <p class="lw-aufgabe">Tipp eine Zahl in ein beliebiges Feld (bis 65.535) – oder schalte Bits. Die anderen Schreibweisen folgen.</p>
      <div class="zl-dreifach">
        {feld('dez', 'Dezimal')}
        {feld('bin', 'Binär')}
        {feld('hex', 'Hexadezimal')}
      </div>
      <BitTafel
        bits={kurz ? 8 : 16}
        wert={wert}
        onWert={(w) => {
          setWert(w);
          setTexte({ dez: String(w), bin: gruppiert(w.toString(2)), hex: w.toString(16).toUpperCase() });
        }}
        nibbles
      />
      <Beispiele
        liste={['FF', 'C0', 'A8', '1F4', 'FFFF']}
        aktiv={texte.hex.toUpperCase()}
        onWahl={(h) => {
          setze('hex', h);
        }}
      />
    </Werkbank>
  );
}

export const ZAHLENSYSTEME = {
  stellenwert: { Erklaerung: StellenwertErklaerung, Ausprobieren: StellenwertAusprobieren },
  binaer: { Erklaerung: BinaerErklaerung, Ausprobieren: BinaerAusprobieren },
  'dezimal-binaer': { Erklaerung: DezimalBinaerErklaerung, Ausprobieren: DezimalBinaerAusprobieren },
  zweierpotenzen: { Erklaerung: ZweierpotenzenErklaerung, Ausprobieren: ZweierpotenzenAusprobieren },
  hex: { Erklaerung: HexErklaerung, Ausprobieren: HexAusprobieren },
};
