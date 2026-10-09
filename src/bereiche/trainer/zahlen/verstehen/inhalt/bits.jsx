// Block 3 – Bits in der Praxis: Dateirechte mit chmod, Paritätsbit (nur AP2).

import { useState } from 'preact/hooks';
import { Schritte, Raten, Absatz, Fakten, Fakt, Formel, Hinweis, Konsole, Werkbank, Beispiele } from '../../../lernweg/bausteine.jsx';
import { Stellen, Wahl } from '../bausteine.jsx';

// ---------- 10 Dateirechte mit chmod ----------

const KLASSEN = ['Besitzer', 'Gruppe', 'andere'];
const RECHTE = [
  { z: 'r', name: 'lesen', wert: 4 },
  { z: 'w', name: 'schreiben', wert: 2 },
  { z: 'x', name: 'ausführen', wert: 1 },
];
const symbol = (ziffer) => RECHTE.map((r) => (ziffer & r.wert ? r.z : '-')).join('');

function DateirechteErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Wer darf was?',
          inhalt: (
            <>
              <Absatz>
                Unter Linux hat jede Datei Zugriffsrechte. Der Befehl <span class="mono">ls -l</span> zeigt sie ganz links an:
              </Absatz>
              <Konsole titel="Terminal" zeilen={['$ ls -l', { text: '-rwxr-xr--  1 anna  team  2048  bericht.sh', hervor: true }, '-rw-r-----  1 anna  team   512  notizen.txt']} />
              <Absatz>
                Das erste Zeichen sagt, was es ist (<span class="mono">-</span> Datei, <span class="mono">d</span> Verzeichnis). Danach folgen <strong>neun Zeichen</strong> – drei
                Dreiergruppen, um die es hier geht.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Drei Rechte für drei Klassen',
          inhalt: (
            <>
              <Absatz>Jede Dreiergruppe gehört zu einer Klasse von Benutzern und enthält – in fester Reihenfolge – drei Rechte. Ein Strich heißt: dieses Recht fehlt.</Absatz>
              <div class="zl-rechte" aria-label="rwxr-xr-- in drei Gruppen">
                {['rwx', 'r-x', 'r--'].map((g, i) => (
                  <div key={i} class="zl-rechte__gruppe">
                    <span class="zl-rechte__name">{KLASSEN[i]}</span>
                    <span class="zl-rechte__zeichen mono">
                      {g.split('').map((c, j) => (
                        <i key={j} class={c === '-' ? 'zl-rechte__aus' : ''}>
                          {c}
                        </i>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
              <Fakten>
                <Fakt titel="r – read">Datei lesen bzw. Verzeichnisinhalt auflisten</Fakt>
                <Fakt titel="w – write">Datei ändern bzw. im Verzeichnis anlegen und löschen</Fakt>
                <Fakt titel="x – execute">Datei als Programm ausführen bzw. Verzeichnis betreten</Fakt>
              </Fakten>
              <Absatz>
                <strong>Besitzer</strong> ist der Benutzer, dem die Datei gehört (hier anna), <strong>Gruppe</strong> die Benutzergruppe der Datei (team), <strong>andere</strong>{' '}
                alle übrigen.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Jedes Recht ist ein Bit',
          inhalt: (
            <>
              <Absatz>
                Drei Rechte, jedes an oder aus – das sind drei Bit. Liest man <span class="mono">r w x</span> als Binärzahl, haben sie die Stellenwerte <strong>4, 2, 1</strong>:
              </Absatz>
              <Stellen werte={['r 4', 'w 2', 'x 1']} ziffern={[1, 0, 1]} an={[true, false, true]} summe="r-x = 101₂ = 4 + 1 = 5" />
              <Raten
                frage="Welche Ziffer steht für rw-?"
                optionen={[3, 5, 6, 7]}
                richtig={6}
                hinweis={(v) =>
                  v === 7 ? '7 wären alle drei Rechte. x fehlt hier.' : v === 3 ? 'Die Werte stehen in der Reihenfolge r = 4, w = 2, x = 1.' : 'r = 4, w = 2 – addieren.'
                }
              >
                <Formel>rw- = 4 + 2 + 0 = 6</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Drei Ziffern für chmod',
          inhalt: (
            <>
              <Absatz>
                Jede Klasse ergibt so eine Ziffer von 0 bis 7. Drei Ziffern nebeneinander – Besitzer, Gruppe, andere – sind die Zahl für <span class="mono">chmod</span>. Weil jede
                Ziffer nur bis 7 geht, ist es eine <strong>Oktalzahl</strong> (Basis 8).
              </Absatz>
              <div class="zl-chmod-zerlegt mono">
                {[7, 5, 4].map((z, i) => (
                  <div key={i}>
                    <strong>{z}</strong>
                    <span>
                      ={' '}
                      {RECHTE.filter((r) => z & r.wert)
                        .map((r) => r.wert)
                        .join(' + ') || '0'}
                    </span>
                    <span>{symbol(z)}</span>
                    <span class="zl-chmod-zerlegt__name">{KLASSEN[i]}</span>
                  </div>
                ))}
              </div>
              <Konsole titel="Terminal" zeilen={['$ chmod 754 bericht.sh', '$ ls -l bericht.sh', { text: '-rwxr-xr--  1 anna  team  2048  bericht.sh', hervor: true }]} />
            </>
          ),
        },
        {
          titel: 'Typische Werte',
          inhalt: (
            <>
              <Fakten>
                <Fakt titel="755 – rwxr-xr-x">Programme und Skripte: alle dürfen ausführen, nur der Besitzer ändern</Fakt>
                <Fakt titel="644 – rw-r--r--">normale Dateien: alle lesen, nur der Besitzer schreibt</Fakt>
                <Fakt titel="600 – rw-------">private Dateien, z. B. Schlüssel: nur der Besitzer</Fakt>
                <Fakt titel="700 – rwx------">privates Verzeichnis oder Skript</Fakt>
              </Fakten>
              <Raten
                frage="Nur der Besitzer soll lesen und schreiben dürfen, sonst niemand etwas. Welcher Befehl?"
                optionen={['chmod 600', 'chmod 644', 'chmod 006', 'chmod 700']}
                richtig="chmod 600"
                hinweis={(v) =>
                  v === 'chmod 006' ? 'Die erste Ziffer gehört zum Besitzer.' : v === 'chmod 700' ? '7 erlaubt auch das Ausführen.' : '644 lässt Gruppe und andere lesen.'
                }
              >
                <Formel>Besitzer rw- = 6 · Gruppe --- = 0 · andere --- = 0 → chmod 600</Formel>
              </Raten>
            </>
          ),
        },
      ]}
    />
  );
}

function DateirechteAusprobieren() {
  const [ziffern, setZiffern] = useState([7, 5, 4]);
  const [text, setText] = useState('754');
  const setze = (z) => {
    setZiffern(z);
    setText(z.join(''));
  };
  const schalte = (k, wert) => setze(ziffern.map((z, i) => (i === k ? z ^ wert : z)));
  return (
    <Werkbank>
      <p class="lw-aufgabe">Hak die Rechte an – oder tipp eine Oktalzahl ein.</p>
      <div class="lw-tabelle-huelle">
        <table class="lw-tabelle zl-chmod">
          <thead>
            <tr>
              <th />
              {RECHTE.map((r) => (
                <th key={r.z}>
                  {r.z} · {r.name} ({r.wert})
                </th>
              ))}
              <th>Ziffer</th>
            </tr>
          </thead>
          <tbody>
            {KLASSEN.map((k, i) => (
              <tr key={k}>
                <th>{k}</th>
                {RECHTE.map((r) => (
                  <td key={r.z}>
                    <input type="checkbox" class="zl-chmod__haken" checked={!!(ziffern[i] & r.wert)} onChange={() => schalte(i, r.wert)} aria-label={`${k}: ${r.name}`} />
                  </td>
                ))}
                <td class="mono">
                  <strong>{ziffern[i]}</strong> = {symbol(ziffern[i])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <label class="lw-feld">
        <span class="lw-feld__name">Oktalzahl</span>
        <input
          class={`feld feld--mono lw-feld__eingabe ${/^[0-7]{3}$/.test(text) ? '' : 'feld--falsch'}`}
          value={text}
          maxLength={3}
          inputMode="numeric"
          onInput={(e) => {
            const t = e.currentTarget.value;
            setText(t);
            if (/^[0-7]{3}$/.test(t)) setZiffern(t.split('').map(Number));
          }}
        />
      </label>
      <Konsole titel="Terminal" zeilen={[`$ chmod ${ziffern.join('')} datei`, { text: `-${ziffern.map(symbol).join('')}  1 anna  team  …  datei`, hervor: true }]} />
      <Beispiele liste={['755', '644', '600', '700', '777']} aktiv={text} onWahl={(t) => setze(t.split('').map(Number))} />
      {ziffern[2] & 2 ? <Hinweis ton="warn">„andere“ dürfen schreiben – das ist selten gewollt.</Hinweis> : null}
    </Werkbank>
  );
}

// ---------- 11 Paritätsbit ----------

const einsen = (bits) => bits.filter(Boolean).length;
const paritaetsbit = (bits, gerade) => (gerade ? einsen(bits) % 2 : 1 - (einsen(bits) % 2));

function BitReihe({ bits, pbit = null, onBit = null, gekippt = [] }) {
  return (
    <span class="zl-pbits mono">
      {bits.map((b, i) => (
        <button
          key={i}
          type="button"
          class={`zl-pbits__bit ${b ? 'zl-pbits__bit--an' : ''} ${gekippt.includes(i) ? 'zl-pbits__bit--gekippt' : ''}`}
          disabled={!onBit}
          onClick={() => onBit?.(i)}
        >
          {b}
        </button>
      ))}
      {pbit !== null && (
        <button
          type="button"
          class={`zl-pbits__bit zl-pbits__bit--p ${pbit ? 'zl-pbits__bit--an' : ''} ${gekippt.includes(bits.length) ? 'zl-pbits__bit--gekippt' : ''}`}
          disabled={!onBit}
          onClick={() => onBit?.(bits.length)}
          title="Paritätsbit"
        >
          {pbit}
        </button>
      )}
    </span>
  );
}

function ParitaetErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Bits können kippen',
          inhalt: (
            <>
              <Absatz>
                Bei der Übertragung oder Speicherung kann ein Bit durch eine Störung umkippen: Aus 0 wird 1 oder umgekehrt. Der Empfänger bekommt dann falsche Daten – und merkt es
                nicht, wenn man nichts tut.
              </Absatz>
              <Absatz>
                Die Idee: Man sendet etwas mehr mit, als nötig wäre – eine kleine Prüfinformation. Diese zusätzliche Information heißt <strong>Redundanz</strong>. Die einfachste
                Form ist ein einzelnes Bit: das <strong>Paritätsbit</strong>.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Einsen zählen und ergänzen',
          inhalt: (
            <>
              <Absatz>
                Sender und Empfänger vereinbaren vorher, ob die Anzahl der Einsen <strong>gerade</strong> oder <strong>ungerade</strong> sein soll. Der Sender zählt die Einsen in
                den Daten und hängt ein Bit an, das die Zahl passend ergänzt.
              </Absatz>
              <div class="zl-pbeispiel">
                <span>Daten</span>
                <BitReihe bits={[1, 0, 1, 1, 0, 0, 1]} />
                <span>4 Einsen</span>
                <span>gerade Parität</span>
                <BitReihe bits={[1, 0, 1, 1, 0, 0, 1]} pbit={0} />
                <span>4 ist schon gerade → 0</span>
                <span>ungerade Parität</span>
                <BitReihe bits={[1, 0, 1, 1, 0, 0, 1]} pbit={1} />
                <span>4 + 1 = 5 ungerade → 1</span>
              </div>
              <Raten frage="Daten 1110000, gerade Parität – welches Paritätsbit?" optionen={['0', '1']} richtig="1" hinweis={() => '3 Einsen. Ist das gerade?'}>
                <Formel>3 Einsen (ungerade) → Paritätsbit 1 → insgesamt 4 Einsen (gerade)</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Der Empfänger prüft',
          inhalt: (
            <>
              <Absatz>
                Der Empfänger zählt alle Einsen – Daten <strong>und</strong> Paritätsbit. Stimmt das Ergebnis nicht mit der Vereinbarung überein, ist ein{' '}
                <strong>Fehler erkannt</strong>.
              </Absatz>
              <Raten
                frage="Empfangen: 1011 0011 (Paritätsbit am Ende), gerade Parität. Fehler?"
                optionen={['ja, Fehler erkannt', 'nein, kein Fehler erkannt']}
                richtig="ja, Fehler erkannt"
                hinweis={() => 'Zähl alle Einsen: 1+0+1+1 + 0+0+1+1.'}
              >
                <Formel>5 Einsen – ungerade, obwohl gerade vereinbart → Fehler erkannt</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Was ein Paritätsbit nicht kann',
          inhalt: (
            <>
              <Fakten>
                <Fakt titel="Nicht berichtigen" icon="circle-x">
                  Der Empfänger weiß nur, <em>dass</em> etwas falsch ist, nicht <em>welches</em> Bit. Er kann die Daten nur neu anfordern.
                </Fakt>
                <Fakt titel="Zwei Fehler übersehen" icon="eye-off">
                  Kippen zwei Bits, ändert sich die Anzahl der Einsen um 0 oder 2 – die Parität stimmt wieder. Der Fehler bleibt unentdeckt.
                </Fakt>
              </Fakten>
              <Absatz>Probier es im Ausprobieren aus: Kipp ein Bit, dann ein zweites.</Absatz>
            </>
          ),
        },
        {
          titel: 'Redundanz als Prüfverfahren',
          inhalt: (
            <>
              <Absatz>
                Das Paritätsbit ist das einfachste Beispiel für <strong>Redundanz</strong>: Information, die für den Inhalt nicht nötig ist, aber Fehler sichtbar macht. Dasselbe
                Prinzip steckt in Prüfsummen (z. B. CRC in Netzwerkpaketen), in der Prüfziffer einer IBAN oder in RAID-Systemen – dort sogar so viel, dass Fehler berichtigt werden
                können.
              </Absatz>
            </>
          ),
        },
      ]}
    />
  );
}

function ParitaetAusprobieren() {
  const [daten, setDaten] = useState([1, 0, 1, 1, 0, 0, 1]);
  const [gerade, setGerade] = useState(true);
  const [gekippt, setGekippt] = useState([]);
  const pbit = paritaetsbit(daten, gerade);
  const gesendet = [...daten, pbit];
  const empfangen = gesendet.map((b, i) => (gekippt.includes(i) ? 1 - b : b));
  const n = einsen(empfangen);
  const erkannt = gerade ? n % 2 === 1 : n % 2 === 0;
  return (
    <Werkbank
      leiste={
        <Wahl
          label="Vereinbart"
          optionen={[
            { wert: true, text: 'gerade Parität' },
            { wert: false, text: 'ungerade Parität' },
          ]}
          wert={gerade}
          onWert={(g) => {
            setGerade(g);
            setGekippt([]);
          }}
        />
      }
    >
      <div class="zl-pstrecke">
        <div class="zl-pstrecke__seite">
          <span class="lw-feld__name">Sender – Daten anklicken zum Ändern</span>
          <BitReihe
            bits={daten}
            pbit={pbit}
            onBit={(i) => {
              if (i < 7) setDaten(daten.map((b, j) => (j === i ? 1 - b : b)));
              setGekippt([]);
            }}
          />
          <span class="zl-pstrecke__info">
            {einsen(daten)} Einsen in den Daten → Paritätsbit {pbit}
          </span>
        </div>
        <span class="zl-pstrecke__leitung" aria-hidden="true">
          ⚡ Leitung
        </span>
        <div class="zl-pstrecke__seite">
          <span class="lw-feld__name">Empfänger – Bit anklicken = Störung</span>
          <BitReihe
            bits={empfangen.slice(0, 7)}
            pbit={empfangen[7]}
            gekippt={gekippt}
            onBit={(i) => setGekippt(gekippt.includes(i) ? gekippt.filter((x) => x !== i) : [...gekippt, i])}
          />
          <span class="zl-pstrecke__info">
            {n} Einsen insgesamt ({n % 2 ? 'ungerade' : 'gerade'})
          </span>
        </div>
      </div>
      {erkannt ? (
        <Hinweis ton="fehler" icon="triangle-alert">
          Fehler erkannt: Die Parität stimmt nicht. Welches Bit gekippt ist, weiß der Empfänger nicht.
        </Hinweis>
      ) : gekippt.length ? (
        <Hinweis ton="warn" icon="eye-off">
          {gekippt.length} Bits gekippt – aber die Parität stimmt. Der Fehler bleibt unentdeckt!
        </Hinweis>
      ) : (
        <Hinweis ton="gut" icon="circle-check">
          Kein Fehler erkannt. Klick beim Empfänger auf ein Bit, um eine Störung zu simulieren.
        </Hinweis>
      )}
    </Werkbank>
  );
}

export const BITS = {
  dateirechte: { Erklaerung: DateirechteErklaerung, Ausprobieren: DateirechteAusprobieren },
  paritaet: { Erklaerung: ParitaetErklaerung, Ausprobieren: ParitaetAusprobieren },
};
