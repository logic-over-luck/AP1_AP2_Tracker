// Block 2 – Subnetting: Netzgröße, Blockgröße, Netzadresse, Broadcastadresse, Hostbereich, Gleiches Netz?,
// Entscheidendes Oktett, Rechenweg. Bis „Gleiches Netz?“ endet der Netzanteil im 4. Oktett (/24 … /30).

import { useMemo, useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../../../ui/bausteine.jsx';
import { ipZuZahl, zerlege, maske, netzBitsJeOktett, gleichesNetz, STELLENWERTE, leseIp, leseZahl } from '../../ip.js';
import { zufall } from '../../../rahmen/zufall.js';
import { startOptionen, startHinweis, endeOptionen, endeHinweis, oktettRollen, grossesNetz, rechenweg, zufallsAufgabe } from '../rechnen.js';
import {
  Schritte,
  Raten,
  Absatz,
  Fakten,
  Fakt,
  Formel,
  Hinweis,
  Netz,
  Host,
  Res,
  Legende,
  Bitband,
  OktettBits,
  Zahlenstrahl,
  PraefixWahl,
  IpFeld,
  Ergebnis,
  Werkbank,
  Zusammenbau,
  Grenzlupe,
  Grundlage,
  tausend,
} from '../bausteine.jsx';

const hoch = (b, e) => (
  <>
    {b}
    <sup>{e}</sup>
  </>
);

// Ein Block als Reihe von Zellen: Netzadresse und Broadcast rot, Hosts blau (bei bis zu 32 Zellen jede einzeln)
function HostLeiste({ start, block, prefix = '', vorletzte = false }) {
  const ende = start + block - 1;
  if (block <= 32) {
    return (
      <div class="sn-hostleiste" style={{ '--n': block }}>
        {Array.from({ length: block }, (_, i) => {
          const w = start + i;
          const art = i === 0 ? 'netz' : i === block - 1 ? 'bc' : 'host';
          const marke = i === 0 ? 'Netz' : i === block - 1 ? 'BC' : i === 1 ? '1.' : i === block - 2 ? 'letzte' : vorletzte && i === block - 3 && block > 4 ? 'vorl.' : '';
          return (
            <span key={i} class={`sn-hostleiste__zelle sn-hostleiste__zelle--${art}`} title={`${prefix}${w}`}>
              <span class="mono">{w}</span>
              {marke && <span class="sn-hostleiste__marke">{marke}</span>}
            </span>
          );
        })}
      </div>
    );
  }
  return (
    <div class="sn-hostleiste sn-hostleiste--kurz">
      <span class="sn-hostleiste__zelle sn-hostleiste__zelle--netz">
        <span class="mono">{start}</span>
        <span class="sn-hostleiste__marke">Netz</span>
      </span>
      <span class="sn-hostleiste__zelle sn-hostleiste__zelle--host">
        <span class="mono">{start + 1}</span>
        <span class="sn-hostleiste__marke">1.</span>
      </span>
      <span class="sn-hostleiste__luecke">… {block - 4} weitere Hosts …</span>
      {vorletzte && (
        <span class="sn-hostleiste__zelle sn-hostleiste__zelle--host">
          <span class="mono">{ende - 2}</span>
          <span class="sn-hostleiste__marke">vorl.</span>
        </span>
      )}
      <span class="sn-hostleiste__zelle sn-hostleiste__zelle--host">
        <span class="mono">{ende - 1}</span>
        <span class="sn-hostleiste__marke">letzte</span>
      </span>
      <span class="sn-hostleiste__zelle sn-hostleiste__zelle--bc">
        <span class="mono">{ende}</span>
        <span class="sn-hostleiste__marke">BC</span>
      </span>
    </div>
  );
}

// Werkzeug-Kopf mit Adresse und Präfix
function useAdresse(startIp, startPraefix) {
  const [ip, setIp] = useState(startIp);
  const [praefix, setPraefix] = useState(startPraefix);
  const z = useMemo(() => zerlege(ip, praefix), [ip, praefix]);
  return { ip, setIp, praefix, setPraefix, z };
}

// ---------- Netzgröße ----------

const KOMBIS = [1, 2, 3].map((n) => Array.from({ length: 2 ** n }, (_, i) => i.toString(2).padStart(n, '0')));

function NetzgroesseErklaerung() {
  const zahl = ipZuZahl('192.168.1.100');
  return (
    <Schritte
      schritte={[
        {
          titel: 'Worauf es ankommt: die Hostbits',
          inhalt: (
            <>
              <Absatz>
                Wie viele Adressen hat ein Netz? Alle Geräte im Netz haben dieselben Netzbits – die stehen fest. Unterscheiden können sie sich nur in den <Host>Hostbits</Host>.
                Jede andere Kombination der Hostbits ist eine andere Adresse. Die Frage ist also: <strong>Wie viele Kombinationen haben die Hostbits?</strong>
              </Absatz>
              <Legende />
              <Bitband zahl={zahl} praefix={26} unter={['fest', 'fest', 'fest', '2 fest · 6 frei']} />
            </>
          ),
        },
        {
          titel: 'Kombinationen zählen',
          inhalt: (
            <>
              <Absatz>Probieren wir es mit wenigen Bits aus und schreiben alle Möglichkeiten auf:</Absatz>
              <div class="sn-kombis">
                {KOMBIS.map((liste, i) => (
                  <div key={i} class="sn-kombis__spalte">
                    <span class="sn-kombis__titel">
                      {i + 1} {i ? 'Bits' : 'Bit'} → <strong>{liste.length}</strong>
                    </span>
                    <span class="sn-kombis__liste mono">
                      {liste.map((k) => (
                        <span key={k}>{k}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
              <Absatz>
                Jedes zusätzliche Bit <strong>verdoppelt</strong> die Anzahl: Jede bisherige Kombination gibt es einmal mit 0 und einmal mit 1 davor.
              </Absatz>
              <Raten
                frage="Wie viele Kombinationen haben 4 Bits?"
                optionen={[4, 8, 16, 32]}
                richtig={16}
                hinweis={(v) => (v === 4 ? 'Nicht 4 × 1 – sondern verdoppeln: 3 Bits haben 8.' : v === 8 ? '8 sind es bei 3 Bits. Ein Bit mehr verdoppelt.' : 'Das wären 5 Bits.')}
              >
                <Formel>
                  2 · 2 · 2 · 2 = {hoch(2, 4)} = <strong>16</strong>
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die Formel',
          inhalt: (
            <>
              <Absatz>Bei h Hostbits gibt es also 2 · 2 · … · 2 (h-mal) = {hoch(2, 'h')} Adressen. Die Hostbits sind 32 − Präfix (Lektion „Präfix“). Für /26:</Absatz>
              <Formel>
                32 − 26 = <Host>6 Hostbits</Host> → {hoch(2, 6)} = 2 · 2 · 2 · 2 · 2 · 2 = <strong>64 Adressen</strong>
              </Formel>
              <Formel>Adressen = {hoch(2, '(32 − Präfix)')}</Formel>
            </>
          ),
        },
        {
          titel: 'Die Zahlen kennst du schon',
          inhalt: (
            <>
              <Absatz>
                Die Zweierpotenzen sind genau die Stellenwerte einer Binärzahl – plus 256. Wer die Reihe 1, 2, 4 … 128, 256 kann, kann jede Netzgröße von /24 bis /32 auswendig:
              </Absatz>
              <Grundlage verweis="zahlen:zweierpotenzen">Zweierpotenzen noch nicht sicher?</Grundlage>
              <div class="lw-tabelle-huelle">
                <table class="lw-tabelle">
                  <thead>
                    <tr>
                      <th>Präfix</th>
                      <th>Hostbits</th>
                      <th>Adressen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[24, 25, 26, 27, 28, 29, 30].map((p) => (
                      <tr key={p} class={p === 26 ? 'lw-tabelle__aktiv' : ''}>
                        <td class="mono">/{p}</td>
                        <td class="mono sn-f-host">{32 - p}</td>
                        <td class="mono">
                          {hoch(2, 32 - p)} = <strong>{2 ** (32 - p)}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ),
        },
        {
          titel: 'Auch für große Netze',
          inhalt: (
            <>
              <Absatz>Die Formel gilt für jeden Präfix. Ein Bit weniger Präfix heißt ein Hostbit mehr – das Netz verdoppelt sich.</Absatz>
              <Raten
                frage="Ein /24 hat 256 Adressen. Wie viele hat ein /23?"
                optionen={[23, 255, 512, 1024]}
                richtig={512}
                hinweis={(v) =>
                  v === 1024 ? '1024 wäre /22 – zwei Bits mehr.' : v === 23 ? '23 ist der Präfix, nicht die Größe. Hostbits: 32 − 23 = 9.' : 'Ein Hostbit mehr verdoppelt.'
                }
              >
                <Formel>
                  32 − 23 = 9 Hostbits → {hoch(2, 9)} = <strong>512 Adressen</strong> · /16 → {hoch(2, 16)} = {tausend(65536)} · /8 → {hoch(2, 24)} = {tausend(2 ** 24)}
                </Formel>
              </Raten>
            </>
          ),
        },
      ]}
    />
  );
}

function NetzgroesseAusprobieren() {
  const [praefix, setPraefix] = useState(26);
  const h = 32 - praefix;
  const n = 2 ** h;
  return (
    <Werkbank leiste={<PraefixWahl praefix={praefix} setPraefix={setPraefix} min={16} max={30} />}>
      <p class="lw-aufgabe">Verschieb den Präfix. Wie verändert sich die Zahl der Adressen?</p>
      <Bitband zahl={ipZuZahl('192.168.1.100')} praefix={praefix} dezimal={false} />
      <Formel>
        32 − {praefix} = <Host>{h} Hostbits</Host> → {hoch(2, h)} = <strong>{tausend(n)} Adressen</strong>
      </Formel>
      {n <= 256 ? (
        <div class="sn-raster" style={{ '--spalten': Math.min(n, 32) }} aria-label={`${n} Adressen als Kästchen`}>
          {Array.from({ length: n }, (_, i) => (
            <span key={i} class="sn-raster__zelle" />
          ))}
        </div>
      ) : (
        <div class="sn-raster sn-raster--gross" aria-label={`${n / 256} mal 256 Adressen`}>
          {Array.from({ length: Math.min(n / 256, 64) }, (_, i) => (
            <span key={i} class="sn-raster__stueck">
              256
            </span>
          ))}
          {n / 256 > 64 && <span class="sn-raster__mehr">… insgesamt {tausend(n / 256)} Stücke zu je 256</span>}
        </div>
      )}
      <Hinweis icon="info">
        Jedes Kästchen ist eine Adresse{n > 256 ? ' (ab hier steht ein Kästchen für 256)' : ''}. /{praefix - 1 >= 16 ? praefix - 1 : praefix} → /{praefix}:{' '}
        {praefix > 16 ? `aus ${tausend(2 * n)} werden ${tausend(n)} – halbiert.` : 'größer geht es hier nicht.'}
      </Hinweis>
    </Werkbank>
  );
}

// ---------- Blockgröße ----------

function BlockgroesseErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Ein /24 aufteilen',
          inhalt: (
            <>
              <Absatz>
                Nimm alle Adressen von 192.168.1.0 bis 192.168.1.255 – ein /24 mit 256 Adressen. Ein Betrieb will daraus kleinere Netze machen, zum Beispiel /26-Netze mit je 64
                Adressen (Lektion „Netzgröße“): eins für das Büro, eins für das Lager …
              </Absatz>
              <Raten frage="Wie viele /26-Netze passen in die 256 Adressen?" optionen={[2, 4, 8, 64]} richtig={4} hinweis={() => '256 Adressen geteilt durch 64 Adressen je Netz.'}>
                <Formel>
                  256 : 64 = <strong>4 Netze</strong>
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Lückenlos hintereinander',
          inhalt: (
            <>
              <Absatz>
                Die vier Netze liegen <strong>lückenlos hintereinander</strong>, wie gleich große Zimmer in einem Flur. Hier der Zahlenstrahl des letzten Oktetts, geschnitten in
                die vier Netze:
              </Absatz>
              <Zahlenstrahl block={64} lupe={false} />
              <Absatz>
                Die Größe eines solchen Stücks heißt <strong>Blockgröße</strong>. Bei /26 ist sie 64: Die Netze beginnen bei <strong>0, 64, 128 und 192</strong> – nie irgendwo
                dazwischen.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Warum genau dort? Ein Blick in die Bits',
          inhalt: (
            <>
              <Absatz>
                Bei /26 gehören im 4. Oktett die ersten <Netz>2 Bits</Netz> zum Netz, die anderen <Host>6 Bits</Host> zum Host. Die 2 Netzbits haben 4 Kombinationen – das sind die
                4 Netze. Innerhalb eines Netzes zählen nur die 6 Hostbits von 000000 bis 111111:
              </Absatz>
              <div class="lw-tabelle-huelle">
                <table class="lw-tabelle">
                  <thead>
                    <tr>
                      <th>Netzbits</th>
                      <th>Hostbits von … bis</th>
                      <th>Zahlen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['00', '01', '10', '11'].map((nb, i) => (
                      <tr key={nb}>
                        <td class="mono sn-f-netz">{nb}</td>
                        <td class="mono">
                          <span class="sn-f-netz">{nb}</span>
                          <span class="sn-f-host">000000</span> … <span class="sn-f-netz">{nb}</span>
                          <span class="sn-f-host">111111</span>
                        </td>
                        <td class="mono">
                          <strong>{i * 64}</strong> – {i * 64 + 63}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Absatz>
                Ein Block beginnt immer dort, wo <strong>alle Hostbits 0</strong> sind – und das ist bei einem Vielfachen der Blockgröße.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Die Blockgröße schnell finden',
          inhalt: (
            <>
              <Absatz>Zwei Wege, die immer dasselbe ergeben:</Absatz>
              <Fakten>
                <Fakt titel="Weg 1: 256 − Subnetzmaske">
                  /26 hat im 4. Oktett den Maskenwert 192 (Lektion „Subnetzmaske“): <strong class="mono">256 − 192 = 64</strong>.
                </Fakt>
                <Fakt titel="Weg 2: Stellenwert des letzten Netzbits">Das letzte Netzbit im Oktett steht bei /26 unter dem Stellenwert 64. Das ist die Blockgröße.</Fakt>
              </Fakten>
              <div class="sn-blockgr">
                <div class="sn-blockgr__reihe">
                  {STELLENWERTE.map((g, j) => (
                    <span
                      key={j}
                      class={`sn-blockgr__zelle mono ${j < 2 ? 'sn-blockgr__zelle--netz' : ''} ${j === 1 ? 'sn-blockgr__zelle--letzte' : ''} ${j === 2 ? 'sn-blockgr__zelle--grenze' : ''}`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <span class="sn-beschrift">Stellenwerte im 4. Oktett bei /26 – das letzte Netzbit steht unter 64</span>
              </div>
            </>
          ),
        },
        {
          titel: 'Die Tabelle zum Merken',
          inhalt: (
            <>
              <div class="lw-tabelle-huelle">
                <table class="lw-tabelle">
                  <thead>
                    <tr>
                      <th>Präfix</th>
                      <th>Maske (4. Oktett)</th>
                      <th>Blockgröße</th>
                      <th>Netze beginnen bei</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[24, 25, 26, 27, 28, 29, 30].map((p) => {
                      const b = 2 ** (32 - p);
                      return (
                        <tr key={p}>
                          <td class="mono">/{p}</td>
                          <td class="mono">{b === 256 ? 0 : 256 - b}</td>
                          <td class="mono">
                            <strong>{b}</strong>
                          </td>
                          <td class="mono">
                            {Array.from({ length: Math.min(256 / b, 5) }, (_, i) => i * b).join(', ')}
                            {256 / b > 5 ? ' …' : ''}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Raten
                frage="Bei /28: Wo beginnen die Netze?"
                optionen={['0, 14, 28, 42 …', '0, 16, 32, 48 …', '0, 28, 56, 84 …', '1, 17, 33, 49 …']}
                richtig="0, 16, 32, 48 …"
                format={(v) => v}
                hinweis={(v) =>
                  v.startsWith('1')
                    ? 'Netze beginnen immer bei 0, nicht bei 1.'
                    : v.startsWith('0, 28')
                      ? '28 ist der Präfix. Die Blockgröße ist 256 − 240.'
                      : '14 ist die Zahl der Hosts. Die Blockgröße ist 256 − 240.'
                }
              >
                <Formel>
                  /28 → Maske 240 → 256 − 240 = <strong>16</strong> → 0, 16, 32, 48, 64 …
                </Formel>
              </Raten>
            </>
          ),
        },
      ]}
    />
  );
}

function BlockgroesseAusprobieren() {
  const [praefix, setPraefix] = useState(26);
  const z = zerlege('192.168.1.0', praefix);
  const [aktiv, setAktiv] = useState(0);
  const anfaenge = Array.from({ length: 256 / z.block }, (_, i) => i * z.block);
  const gewaehlt = anfaenge.includes(aktiv) ? aktiv : 0;
  return (
    <Werkbank
      leiste={
        <PraefixWahl
          praefix={praefix}
          setPraefix={(p) => {
            setPraefix(p);
            setAktiv(0);
          }}
          min={24}
          max={30}
        />
      }
    >
      <Formel>
        /{praefix} → Maske {z.maskenwert} → 256 − {z.maskenwert} = <strong>Blockgröße {z.block}</strong> → {256 / z.block} {256 / z.block === 1 ? 'Netz' : 'Netze'}
      </Formel>
      <Zahlenstrahl block={z.block} werte={[gewaehlt]} aktiv={[gewaehlt]} beschriftung={[`ab ${gewaehlt}`]} />
      <div class="sn-anfaenge">
        <span class="sn-beschrift">Netzanfänge – klick einen an:</span>
        <div class="lw-beispiele">
          {anfaenge.slice(0, 64).map((a) => (
            <button key={a} type="button" class={`lw-chip mono ${a === gewaehlt ? 'lw-chip--aktiv' : ''}`} onClick={() => setAktiv(a)}>
              {a}
            </button>
          ))}
        </div>
      </div>
      <Hinweis icon="info">
        Netz von 192.168.1.<strong>{gewaehlt}</strong> bis 192.168.1.<strong>{gewaehlt + z.block - 1}</strong> – {z.block} Adressen.
      </Hinweis>
    </Werkbank>
  );
}

// ---------- Netzadresse ----------

const BSP = zerlege('192.168.1.100', 26);

function NetzadresseErklaerung() {
  const z = BSP;
  return (
    <Schritte
      schritte={[
        {
          titel: 'Jede Adresse liegt in genau einem Block',
          inhalt: (
            <>
              <Absatz>
                Unser Beispiel: <strong class="mono">192.168.1.100/26</strong>. Blockgröße 64 (Lektion „Blockgröße“) – die Netze im 4. Oktett sind 0–63, 64–127, 128–191, 192–255.
                Die 100 liegt in genau einem davon:
              </Absatz>
              <Zahlenstrahl block={64} werte={[100]} />
              <Absatz>
                Die <strong>erste Adresse</strong> dieses Blocks ist die <strong>Netzadresse</strong>. Sie ist sozusagen der Name des Netzes – „das Netz 192.168.1.…/26“.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Wo beginnt der Block?',
          inhalt: (
            <>
              <Absatz>Überleg selbst: Bei welcher Zahl beginnt der Block, in dem die 100 liegt?</Absatz>
              <Raten frage="Bei welcher Zahl beginnt der Block?" optionen={startOptionen(z)} richtig={z.start} hinweis={(v) => startHinweis(z, v)}>
                <Zahlenstrahl block={64} werte={[100]} aktiv={[64]} />
                <Formel>
                  100 : 64 = 1 Rest 36 → 1 × 64 = <strong>64</strong>
                </Formel>
                <Absatz>
                  Rechentrick: Die Zahl durch die Blockgröße teilen, den Rest wegwerfen, wieder mal Blockgröße. Das ergibt das{' '}
                  <strong>größte Vielfache der Blockgröße, das nicht größer ist</strong> als die Zahl.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die ganze Adresse zusammenbauen',
          inhalt: (
            <>
              <Absatz>
                Die ersten drei Oktette sind bei /26 ganz Netz – sie werden einfach <Netz>abgeschrieben</Netz>. Im 4. Oktett steht der <strong>Blockanfang</strong>:
              </Absatz>
              <Zusammenbau ip="192.168.1.64" rollen={['netz', 'netz', 'netz', 'rechnen']} rezept="192.168.1 abschreiben · 4. Oktett: Blockanfang 64" />
              <Formel>
                Netzadresse von 192.168.1.100/26 = <strong>192.168.1.64</strong>
              </Formel>
            </>
          ),
        },
        {
          titel: 'So rechnet der Computer: Hostbits auf 0',
          inhalt: (
            <>
              <Absatz>
                Der Computer rechnet nicht mit Blöcken, sondern mit Bits. Er setzt einfach <strong>alle Hostbits auf 0</strong>. Dafür verknüpft er Adresse und Subnetzmaske mit{' '}
                <strong>UND</strong>: Nur wo beide eine 1 haben, bleibt eine 1.
              </Absatz>
              <div class="sn-und">
                <span class="sn-und__name">Adresse (100)</span>
                <OktettBits wert={100} netzBits={2} />
                <span class="sn-und__name">UND Maske (192)</span>
                <OktettBits wert={192} netzBits={2} />
                <span class="sn-und__name">= Netzadresse</span>
                <span class="sn-und__ergebnis">
                  <OktettBits wert={64} netzBits={2} /> <strong class="mono">= 64</strong>
                </span>
              </div>
              <Absatz>
                Die <Netz>Netzbits</Netz> (01) bleiben, die <Host>Hostbits</Host> werden alle 0. Das ist genau der Blockanfang – beide Wege kommen auf <strong>64</strong>.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Warum bekommt sie kein Gerät?',
          inhalt: (
            <Absatz>
              Die Netzadresse steht für das <strong>ganze Netz</strong> – in Netzplänen, Skizzen und Tabellen schreibt man „Netz 192.168.1.64/26“. Bekäme ein Gerät diese Adresse,
              wäre nicht mehr klar, ob das Netz oder das Gerät gemeint ist. Darum ist sie <Res>reserviert</Res>.
            </Absatz>
          ),
        },
      ]}
    />
  );
}

function NetzadresseAusprobieren() {
  const { ip, setIp, praefix, setPraefix, z } = useAdresse('192.168.1.100', 26);
  return (
    <Werkbank
      leiste={
        <>
          <IpFeld ip={ip} onIp={setIp} />
          <PraefixWahl praefix={praefix} setPraefix={setPraefix} min={24} max={30} />
        </>
      }
    >
      <p class="lw-aufgabe">Ändere Adresse und Präfix. Wo liegt der Blockanfang?</p>
      <Zahlenstrahl block={z.block} werte={[z.wert]} aktiv={[z.start]} />
      <Formel>
        Blockgröße 256 − {z.maskenwert} = {z.block} · {z.wert} : {z.block} = {z.blockNr} Rest {z.wert - z.start} → {z.blockNr} × {z.block} = <strong>{z.start}</strong>
      </Formel>
      <div class="sn-und">
        <span class="sn-und__name">Adresse ({z.wert})</span>
        <OktettBits wert={z.wert} netzBits={z.netzBitsImOktett} />
        <span class="sn-und__name">Hostbits auf 0</span>
        <span class="sn-und__ergebnis">
          <OktettBits wert={z.start} netzBits={z.netzBitsImOktett} /> <strong class="mono">= {z.start}</strong>
        </span>
      </div>
      <Zusammenbau titel="Netzadresse" ip={z.n.netz} rollen={['netz', 'netz', 'netz', 'rechnen']} />
    </Werkbank>
  );
}

// ---------- Broadcastadresse ----------

function BroadcastErklaerung() {
  const z = BSP;
  return (
    <Schritte
      schritte={[
        {
          titel: 'Das Ende des Blocks',
          inhalt: (
            <>
              <Absatz>
                Weiter mit <strong class="mono">192.168.1.100/26</strong>. Der Block beginnt bei 64 (Lektion „Netzadresse“). Die <strong>letzte Adresse</strong> dieses Blocks ist
                die <strong>Broadcastadresse</strong>.
              </Absatz>
              <Zahlenstrahl block={64} werte={[100]} aktiv={[64]} />
            </>
          ),
        },
        {
          titel: 'Wo endet der Block?',
          inhalt: (
            <>
              <Absatz>Der Block beginnt bei 64 und hat 64 Zahlen. Bei welcher Zahl endet er?</Absatz>
              <Raten frage="Wo endet der Block, der bei 64 beginnt?" optionen={endeOptionen(z)} richtig={z.ende} hinweis={(v) => endeHinweis(z, v)}>
                <Grenzlupe start={64} ende={127} />
                <Formel>
                  64 + 64 = 128 ist schon der nächste Block → 128 − 1 = <strong>127</strong>
                </Formel>
                <Absatz>
                  Das ist der <strong>häufigste Fehler</strong> beim Subnetting: Anfang + Blockgröße ist schon der Anfang des nächsten Blocks. Das Ende liegt immer eins davor.
                  Probe: Von 64 bis 127 sind es 127 − 64 + 1 = 64 Zahlen.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die ganze Adresse zusammenbauen',
          inhalt: (
            <>
              <Absatz>Wieder die ersten drei Oktette abschreiben, im 4. Oktett das Blockende:</Absatz>
              <Zusammenbau ip="192.168.1.127" rollen={['netz', 'netz', 'netz', 'rechnen']} rezept="192.168.1 abschreiben · 4. Oktett: Blockende 127" />
              <Formel>
                Broadcastadresse von 192.168.1.100/26 = <strong>192.168.1.127</strong>
              </Formel>
            </>
          ),
        },
        {
          titel: 'In Bits: alle Hostbits 1',
          inhalt: (
            <>
              <Absatz>Die Netzadresse hatte alle Hostbits 0. Die Broadcastadresse ist das Gegenstück: alle Hostbits 1 – höher geht es in diesem Block nicht.</Absatz>
              <div class="sn-und">
                <span class="sn-und__name">Netzadresse</span>
                <span class="sn-und__ergebnis">
                  <OktettBits wert={64} netzBits={2} /> <strong class="mono">= 64</strong>
                </span>
                <span class="sn-und__name">Broadcast</span>
                <span class="sn-und__ergebnis">
                  <OktettBits wert={127} netzBits={2} /> <strong class="mono">= 127</strong>
                </span>
              </div>
              <Absatz>
                Links von der Grenze bleiben die <Netz>Netzbits</Netz> gleich (01). Rechts davon zählen die <Host>Hostbits</Host> von 000000 bis 111111 – das ist der ganze Block.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Wozu ein Rundruf?',
          inhalt: (
            <>
              <Absatz>
                „Broadcast“ heißt <strong>Rundruf</strong>. Ein Paket an die Broadcastadresse geht an <strong>alle Geräte im Netz</strong> gleichzeitig. Das braucht man, wenn ein
                Gerät jemanden sucht, ohne seine Adresse zu kennen – etwa „Gibt es hier einen Server, der mir eine Adresse gibt?“ (DHCP, Lektion „DHCP“).
              </Absatz>
              <Hinweis icon="info">
                Weil ein Paket an diese Adresse bei allen ankommt, darf sie kein einzelnes Gerät bekommen – sie ist <Res>reserviert</Res>, genau wie die Netzadresse.
              </Hinweis>
            </>
          ),
        },
      ]}
    />
  );
}

function BroadcastAusprobieren() {
  const { ip, setIp, praefix, setPraefix, z } = useAdresse('192.168.1.100', 26);
  return (
    <Werkbank
      leiste={
        <>
          <IpFeld ip={ip} onIp={setIp} />
          <PraefixWahl praefix={praefix} setPraefix={setPraefix} min={24} max={30} />
        </>
      }
    >
      <p class="lw-aufgabe">Ändere Adresse und Präfix. Wo endet der Block – und wo beginnt schon der nächste?</p>
      <Zahlenstrahl block={z.block} werte={[z.wert]} aktiv={[z.start]} />
      <Grenzlupe start={z.start} ende={z.ende} />
      <Formel>
        {z.start} + {z.block} = {z.start + z.block}
        {z.start + z.block <= 255 ? ' (nächster Block)' : ''} → − 1 = <strong>{z.ende}</strong>
      </Formel>
      <Ergebnis
        zeilen={[
          { name: 'Netzadresse', wert: z.n.netz, ton: 'res', info: 'alle Hostbits 0' },
          { name: 'Broadcastadresse', wert: z.n.broadcast, ton: 'res', info: 'alle Hostbits 1' },
        ]}
      />
    </Werkbank>
  );
}

// ---------- Hostbereich ----------

function HostbereichErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Rahmen und Inneres',
          inhalt: (
            <>
              <Absatz>
                Netzadresse und Broadcastadresse bilden den <Res>Rahmen</Res> eines Netzes. Alles dazwischen ist der <Host>Hostbereich</Host>: die Adressen, die Geräte bekommen
                können. Ganz klein am Beispiel <strong class="mono">192.168.1.64/29</strong> (Blockgröße 8):
              </Absatz>
              <HostLeiste start={64} block={8} prefix="192.168.1." />
              <Legende teile={['host', 'res']} />
              <Absatz>
                Von 8 Adressen sind 2 reserviert – <strong>6 bleiben für Geräte</strong>: .65 bis .70.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Erste und letzte nutzbare Adresse',
          inhalt: (
            <>
              <Absatz>Die erste nutzbare Adresse liegt direkt hinter der Netzadresse, die letzte direkt vor dem Broadcast:</Absatz>
              <Fakten>
                <Fakt titel="Erste nutzbare Adresse">Netzadresse + 1</Fakt>
                <Fakt titel="Letzte nutzbare Adresse">Broadcastadresse − 1</Fakt>
              </Fakten>
              <Raten
                frage="Netz 192.168.1.64/26 (Broadcast .127). Welche ist die letzte nutzbare Adresse?"
                optionen={['192.168.1.125', '192.168.1.126', '192.168.1.127', '192.168.1.128']}
                richtig="192.168.1.126"
                hinweis={(v) =>
                  v.endsWith('127') ? '.127 ist der Broadcast – den bekommt kein Gerät.' : v.endsWith('128') ? '.128 gehört schon zum nächsten Netz.' : '.125 ist die vorletzte.'
                }
              >
                <HostLeiste start={64} block={64} prefix="192.168.1." />
                <Formel>
                  erste: 64 + 1 = <strong>65</strong> · letzte: 127 − 1 = <strong>126</strong>
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die vorletzte – eine echte Prüfungsfrage',
          inhalt: (
            <>
              <Absatz>
                In der Prüfung war schon nach der <strong>vorletzten nutzbaren Adresse</strong> gefragt, weil die letzte bereits vergeben war (für den Router – das kommt in Lektion
                14). Einfach noch eins weiter zurück:
              </Absatz>
              <HostLeiste start={64} block={64} prefix="192.168.1." vorletzte />
              <Formel>
                vorletzte = Broadcast − 2 = 127 − 2 = <strong>125</strong>
              </Formel>
            </>
          ),
        },
        {
          titel: 'Wie viele Hosts?',
          inhalt: (
            <>
              <Absatz>
                Alle Adressen minus die zwei reservierten. Mit der Formel aus Lektion „Netzgröße“: <strong>Hosts = {hoch(2, 'h')} − 2</strong>.
              </Absatz>
              <div class="lw-tabelle-huelle">
                <table class="lw-tabelle">
                  <thead>
                    <tr>
                      <th>Präfix</th>
                      <th>Adressen</th>
                      <th>nutzbare Hosts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[24, 25, 26, 27, 28, 29, 30].map((p) => (
                      <tr key={p}>
                        <td class="mono">/{p}</td>
                        <td class="mono">{2 ** (32 - p)}</td>
                        <td class="mono">
                          <strong>{2 ** (32 - p) - 2}</strong>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Hinweis icon="info">
                Sonderfälle: /31 hat nur 2 Adressen und klassisch gerechnet keinen Host (in der Praxis nutzt man es für Verbindungen zwischen genau zwei Routern), /32 ist eine
                einzelne Adresse. In der AP1 rechnest du mit /30 und kleiner.
              </Hinweis>
            </>
          ),
        },
      ]}
    />
  );
}

function HostbereichAusprobieren() {
  const { ip, setIp, praefix, setPraefix, z } = useAdresse('192.168.1.100', 26);
  const n = z.n;
  return (
    <Werkbank
      leiste={
        <>
          <IpFeld ip={ip} onIp={setIp} />
          <PraefixWahl praefix={praefix} setPraefix={setPraefix} min={24} max={30} />
        </>
      }
    >
      <HostLeiste start={z.start} block={z.block} prefix={`${z.oktette.slice(0, 3).join('.')}.`} vorletzte={z.block > 4} />
      <Ergebnis
        zeilen={[
          { name: 'Netzadresse', wert: n.netz, ton: 'res' },
          { name: 'Erste nutzbare', wert: n.erster, ton: 'host', info: 'Netzadresse + 1' },
          ...(n.vorletzter ? [{ name: 'Vorletzte nutzbare', wert: n.vorletzter, ton: 'host', info: 'Broadcast − 2' }] : []),
          { name: 'Letzte nutzbare', wert: n.letzter, ton: 'host', info: 'Broadcast − 1' },
          { name: 'Broadcastadresse', wert: n.broadcast, ton: 'res' },
          {
            name: 'Nutzbare Hosts',
            wert: (
              <>
                {hoch(2, 32 - praefix)} − 2 = {n.hosts}
              </>
            ),
            info: `${n.adressen} Adressen − 2 reservierte`,
          },
        ]}
      />
    </Werkbank>
  );
}

// ---------- Gleiches Netz? ----------

function GleichErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Die Frage vor jedem Senden',
          inhalt: (
            <Absatz>
              Bevor ein Gerät ein Paket losschickt, prüft es: <strong>Liegt das Ziel in meinem Netz?</strong> Wenn ja, schickt es das Paket direkt dorthin. Wenn nein, muss das
              Paket aus dem Netz hinaus – das geht nicht direkt (wie, zeigt Lektion „Standardgateway“). Diese Prüfung musst du auch in der Prüfung können.
            </Absatz>
          ),
        },
        {
          titel: 'Erst raten',
          inhalt: (
            <Raten
              frage="Liegen 192.168.1.60/26 und 192.168.1.70/26 im selben Netz?"
              optionen={['ja', 'nein']}
              richtig="nein"
              hinweis={() => 'Beide beginnen mit 192.168.1 – aber bei /26 liegt die Grenze im 4. Oktett. In welchem Block liegt 60, in welchem 70?'}
            >
              <Zahlenstrahl block={64} werte={[60, 70]} aktiv={[0, 64]} />
              <Absatz>
                60 liegt im Block 0–63, 70 im Block 64–127. Die Netzadressen sind <strong class="mono">192.168.1.0</strong> und <strong class="mono">192.168.1.64</strong> – also{' '}
                <strong>verschiedene Netze</strong>, obwohl die Zahlen nur 10 auseinander liegen.
              </Absatz>
            </Raten>
          ),
        },
        {
          titel: 'Das Verfahren',
          inhalt: (
            <>
              <ol class="sn-verfahren">
                <li>
                  Für beide Adressen mit <strong>derselben Subnetzmaske</strong> die Netzadresse bestimmen (Lektion „Netzadresse“).
                </li>
                <li>Netzadressen vergleichen: gleich → gleiches Netz, verschieden → verschiedene Netze.</li>
              </ol>
              <Ergebnis
                zeilen={[
                  { name: '192.168.1.60/26', wert: '→ Netz 192.168.1.0', ton: 'netz' },
                  { name: '192.168.1.70/26', wert: '→ Netz 192.168.1.64', ton: 'netz' },
                  { name: 'Ergebnis', wert: 'verschieden → verschiedene Netze', ton: 'fehler' },
                ]}
              />
            </>
          ),
        },
        {
          titel: 'In Bits: die Netzbits vergleichen',
          inhalt: (
            <>
              <Absatz>Der Computer vergleicht nur die Netzbits. Im 4. Oktett sind das bei /26 die ersten zwei:</Absatz>
              <div class="sn-und">
                <span class="sn-und__name">60</span>
                <OktettBits wert={60} netzBits={2} />
                <span class="sn-und__name">70</span>
                <OktettBits wert={70} netzBits={2} />
              </div>
              <Absatz>
                Netzbits <Netz>00</Netz> und <Netz>01</Netz> – verschieden, also verschiedene Netze.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Die Falle',
          inhalt: (
            <Hinweis icon="triangle-alert">
              Nur bei <strong>/24</strong> reicht es, die ersten drei Oktette zu vergleichen. Bei jedem anderen Präfix muss man die Netzadressen ausrechnen – „sieht ähnlich aus“
              zählt nicht.
            </Hinweis>
          ),
        },
      ]}
    />
  );
}

function GleichAusprobieren() {
  const [a, setA] = useState('192.168.1.60');
  const [b, setB] = useState('192.168.1.70');
  const [praefix, setPraefix] = useState(26);
  const za = zerlege(a, praefix);
  const zb = zerlege(b, praefix);
  const gleich = gleichesNetz(a, b, praefix);
  const vorneGleich = za.oktette.slice(0, 3).join('.') === zb.oktette.slice(0, 3).join('.');
  return (
    <Werkbank
      leiste={
        <>
          <IpFeld ip={a} onIp={setA} label="Gerät A" />
          <IpFeld ip={b} onIp={setB} label="Gerät B" />
          <PraefixWahl praefix={praefix} setPraefix={setPraefix} min={24} max={30} />
        </>
      }
    >
      {vorneGleich ? (
        <Zahlenstrahl block={za.block} werte={[za.wert, zb.wert]} aktiv={[za.start, zb.start]} beschriftung={[`A ${za.wert}`, `B ${zb.wert}`]} />
      ) : (
        <Hinweis icon="info">Schon die ersten drei Oktette sind verschieden – dann liegen die Adressen bei /24 bis /30 auf jeden Fall in verschiedenen Netzen.</Hinweis>
      )}
      <Ergebnis
        zeilen={[
          { name: `Netz von A`, wert: za.n.netz, ton: 'netz' },
          { name: `Netz von B`, wert: zb.n.netz, ton: 'netz' },
          { name: 'Ergebnis', wert: gleich ? 'gleiches Netz – direkt erreichbar' : 'verschiedene Netze', ton: gleich ? 'gut' : 'fehler' },
        ]}
      />
    </Werkbank>
  );
}

// ---------- Entscheidendes Oktett ----------

const ROLLEN_TEXT = { netz: 'abschreiben', rechnen: 'hier rechnen', host: '0 bzw. 255' };

function OktettRollen({ ip, praefix }) {
  const z = zerlege(ip, praefix);
  const k = netzBitsJeOktett(praefix);
  const rollen = oktettRollen(praefix);
  return (
    <div class="sn-rollen">
      {rollen.map((r, i) => (
        <div key={i} class={`sn-rollen__oktett sn-rollen__oktett--${r}`}>
          <span class="sn-rollen__nr">{i + 1}. Oktett</span>
          <span class="sn-rollen__wert mono">{z.oktette[i]}</span>
          <OktettBits wert={z.oktette[i]} netzBits={k[i]} />
          <span class="sn-rollen__maske mono">Maske {maske(praefix).split('.')[i]}</span>
          <span class="sn-rollen__rolle">{ROLLEN_TEXT[r]}</span>
        </div>
      ))}
    </div>
  );
}

function Oktett3Erklaerung() {
  const g = grossesNetz('10.4.7.20', 23);
  const z = zerlege('10.4.7.20', 23);
  return (
    <Schritte
      schritte={[
        {
          titel: 'Größere Netze',
          inhalt: (
            <>
              <Absatz>
                Bisher lag die Grenze immer im 4. Oktett (/24 bis /30). In Firmen gibt es aber auch Netze mit <strong>mehr als 256 Adressen</strong>, zum Beispiel /23, /22 oder
                /20. Dann liegt die Grenze <strong>im 3. Oktett</strong> – und das 4. Oktett gehört ganz zum Host. Unser Beispiel: <strong class="mono">10.4.7.20/23</strong>.
              </Absatz>
              <Legende />
              <Bitband zahl={ipZuZahl('10.4.7.20')} praefix={23} unter={['8 Netz', '8 Netz', '7 Netz · 1 Host', '8 Host']} />
            </>
          ),
        },
        {
          titel: 'Welches Oktett entscheidet?',
          inhalt: (
            <>
              <Absatz>
                Die Subnetzmaske von /23 ist <strong class="mono">255.255.254.0</strong>. Das <strong>entscheidende Oktett</strong> ist das, in dem die Grenze liegt – du erkennst
                es daran, dass es das <strong>erste Oktett der Subnetzmaske ist, das nicht 255 ist</strong>.
              </Absatz>
              <Raten
                frage="Welches Oktett ist bei 255.255.254.0 das entscheidende?"
                optionen={['1.', '2.', '3.', '4.']}
                richtig="3."
                hinweis={(v) => (v === '4.' ? 'Das 4. Oktett ist 0 – ganz Host. Gesucht ist das erste, das nicht 255 ist.' : 'Dieses Oktett ist 255 – ganz Netz.')}
              >
                <OktettRollen ip="10.4.7.20" praefix={23} />
              </Raten>
            </>
          ),
        },
        {
          titel: 'Drei Rollen',
          inhalt: (
            <>
              <Absatz>Jedes Oktett hat jetzt eine von drei Rollen:</Absatz>
              <Fakten>
                <Fakt titel="Davor: abschreiben">Oktette mit Maske 255 sind ganz Netz. In Netzadresse und Broadcast stehen sie unverändert: 10 und 4.</Fakt>
                <Fakt titel="Das entscheidende: rechnen">Hier wird mit der Blockgröße gerechnet – genau wie bisher im 4. Oktett.</Fakt>
                <Fakt titel="Dahinter: 0 bzw. 255">Oktette mit Maske 0 sind ganz Host: alle Bits 0 in der Netzadresse (→ 0), alle Bits 1 im Broadcast (→ 255).</Fakt>
              </Fakten>
            </>
          ),
        },
        {
          titel: 'Im 3. Oktett rechnen',
          inhalt: (
            <>
              <Absatz>
                Blockgröße im 3. Oktett: 256 − 254 = <strong>2</strong>. Die Blöcke dort sind 0–1, 2–3, 4–5, 6–7 … Im 3. Oktett steht die <strong>7</strong>.
              </Absatz>
              <Zahlenstrahl block={2} werte={[7]} />
              <Raten frage="Wo beginnt der Block mit der 7?" optionen={startOptionen(z)} richtig={z.start} hinweis={(v) => startHinweis(z, v)}>
                <Formel>
                  7 : 2 = 3 Rest 1 → 3 × 2 = <strong>6</strong> · Ende: 6 + 2 − 1 = <strong>7</strong>
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Zusammenbauen',
          inhalt: (
            <>
              <Zusammenbau titel="Netzadresse" ip="10.4.6.0" rollen={['netz', 'netz', 'rechnen', 'host']} rezept="10.4 abschreiben · 3. Oktett: Blockanfang 6 · 4. Oktett: 0" />
              <Zusammenbau
                titel="Broadcastadresse"
                ip="10.4.7.255"
                rollen={['netz', 'netz', 'rechnen', 'host']}
                rezept="10.4 abschreiben · 3. Oktett: Blockende 7 · 4. Oktett: 255"
              />
              <Ergebnis
                zeilen={[
                  { name: 'Erste nutzbare', wert: '10.4.6.1', ton: 'host' },
                  { name: 'Letzte nutzbare', wert: '10.4.7.254', ton: 'host' },
                ]}
              />
            </>
          ),
        },
        {
          titel: 'Das Netz besteht aus zwei Stücken',
          inhalt: (
            <>
              <Absatz>Ein /23 ist so groß wie zwei /24 nebeneinander:</Absatz>
              <div class="sn-stuecke">
                {g.zeilen.map((st) =>
                  st ? (
                    <div key={st.nr} class="sn-stuecke__stueck">
                      <span class="mono">{st.von}</span>
                      <span class="sn-stuecke__balken" />
                      <span class="mono">{st.bis}</span>
                    </div>
                  ) : null,
                )}
              </div>
              <Absatz>
                Darum liegen <strong class="mono">10.4.6.255</strong> und <strong class="mono">10.4.7.0</strong> <strong>mitten im Netz</strong> – es sind ganz normale
                Host-Adressen, keine Broadcast- oder Netzadressen! Reserviert sind nur der Anfang 10.4.6.0 und das Ende 10.4.7.255.
              </Absatz>
              <Hinweis icon="triangle-alert">
                Achtung: Die Blockgröße im 3. Oktett (2) ist <strong>nicht</strong> die Netzgröße. Die Netzgröße rechnest du weiter mit den Hostbits: 32 − 23 = 9 → {hoch(2, 9)} =
                512 Adressen, <strong>510 Hosts</strong>.
              </Hinweis>
            </>
          ),
        },
        {
          titel: 'Sonderfall /16 und /8',
          inhalt: (
            <Absatz>
              Liegt die Grenze genau zwischen zwei Oktetten (/8, /16, /24), gibt es nichts zu rechnen: davor abschreiben, dahinter 0 bzw. 255. Beispiel 172.16.5.4/16 → Netzadresse{' '}
              <strong class="mono">172.16.0.0</strong>, Broadcast <strong class="mono">172.16.255.255</strong>.
            </Absatz>
          ),
        },
      ]}
    />
  );
}

function Oktett3Ausprobieren() {
  const { ip, setIp, praefix, setPraefix, z } = useAdresse('10.4.7.20', 23);
  const rollen = oktettRollen(praefix);
  return (
    <Werkbank
      leiste={
        <>
          <IpFeld ip={ip} onIp={setIp} />
          <PraefixWahl praefix={praefix} setPraefix={setPraefix} min={8} max={30} />
        </>
      }
    >
      <OktettRollen ip={ip} praefix={praefix} />
      {z.netzBitsImOktett > 0 ? (
        <>
          <span class="sn-beschrift">
            Entscheidendes Oktett: das {z.index + 1}. – Blockgröße 256 − {z.maskenwert} = {z.block}
          </span>
          <Zahlenstrahl block={z.block} werte={[z.wert]} aktiv={[z.start]} />
        </>
      ) : (
        <Hinweis icon="info">Die Grenze liegt genau zwischen zwei Oktetten – nichts zu rechnen: davor abschreiben, dahinter 0 bzw. 255.</Hinweis>
      )}
      <div class="sn-bau-paar">
        <Zusammenbau titel="Netzadresse" ip={z.n.netz} rollen={rollen} />
        <Zusammenbau titel="Broadcastadresse" ip={z.n.broadcast ?? z.n.netz} rollen={rollen} />
      </div>
      <Ergebnis
        zeilen={[
          { name: 'Erste nutzbare', wert: z.n.erster, ton: 'host' },
          { name: 'Letzte nutzbare', wert: z.n.letzter, ton: 'host' },
          { name: 'Nutzbare Hosts', wert: tausend(z.n.hostsKlassisch), info: `2^${32 - praefix} − 2` },
        ]}
      />
    </Werkbank>
  );
}

// ---------- Rechenweg ----------

function RechenwegErklaerung() {
  const r = rechenweg('172.16.8.100', 27);
  const schritt = (titel, text, ergebnis) => ({
    titel,
    inhalt: (
      <>
        <Absatz>{text}</Absatz>
        {ergebnis}
      </>
    ),
  });
  return (
    <>
      <Absatz>
        Alles aus Block 2 als festes Schema – immer in dieser Reihenfolge. Beispiel: <strong class="mono">172.16.8.100/27</strong>.
      </Absatz>
      <Schritte
        schritte={[
          schritt(
            'Subnetzmaske',
            <>Präfix in Achter zerlegen: 27 = 8 + 8 + 8 + 3. Volle Achter → 255, drei Einsen → 128 + 64 + 32 = 224.</>,
            <Formel>
              /27 → <strong>{r.maske}</strong>
            </Formel>,
          ),
          schritt(
            'Entscheidendes Oktett und Blockgröße',
            <>Das erste Oktett der Maske, das nicht 255 ist: das {r.oktett}. Dort 256 minus Maskenwert.</>,
            <Formel>
              {r.oktett}. Oktett · 256 − {r.maskenwert} = <strong>Blockgröße {r.block}</strong>
            </Formel>,
          ),
          schritt(
            'Netzadresse',
            <>Im entscheidenden Oktett das größte Vielfache der Blockgröße, das nicht größer als {r.wert} ist. Davor abschreiben, dahinter 0.</>,
            <>
              <Zahlenstrahl block={r.block} werte={[r.wert]} aktiv={[r.start]} />
              <Formel>
                {r.wert} : {r.block} = {r.blockNr} Rest {r.rest} → {r.blockNr} × {r.block} = {r.start} → <strong>{r.netz}</strong>
              </Formel>
            </>,
          ),
          schritt(
            'Broadcastadresse',
            <>Blockanfang + Blockgröße − 1 (der nächste Block beginnt schon bei {r.start + r.block}). Dahinter 255.</>,
            <Formel>
              {r.start} + {r.block} − 1 = {r.ende} → <strong>{r.broadcast}</strong>
            </Formel>,
          ),
          schritt(
            'Erste und letzte Hostadresse',
            <>Netzadresse + 1 und Broadcast − 1 (vorletzte: Broadcast − 2).</>,
            <Ergebnis
              zeilen={[
                { name: 'Erste', wert: r.erster, ton: 'host' },
                { name: 'Letzte', wert: r.letzter, ton: 'host' },
              ]}
            />,
          ),
          schritt(
            'Anzahl der Hosts',
            <>Hostbits = 32 − Präfix, dann 2 hoch Hostbits minus 2.</>,
            <Formel>
              32 − 27 = {r.hostBits} → {hoch(2, r.hostBits)} − 2 = <strong>{r.hosts} Hosts</strong>
            </Formel>,
          ),
          {
            titel: 'Gegenprobe',
            inhalt: (
              <Fakten>
                <Fakt titel="Netzadresse teilbar?">
                  Im entscheidenden Oktett muss die Netzadresse durch die Blockgröße teilbar sein: {r.start} : {r.block} = {r.start / r.block} ✓
                </Fakt>
                <Fakt titel="Broadcast + 1 teilbar?">
                  Broadcast + 1 ist der nächste Netzanfang: {r.ende} + 1 = {r.ende + 1} = {(r.ende + 1) / r.block} × {r.block} ✓
                </Fakt>
                <Fakt titel="Liegt die Adresse drin?">
                  {r.start} ≤ {r.wert} ≤ {r.ende} ✓
                </Fakt>
              </Fakten>
            ),
          },
        ]}
      />
    </>
  );
}

const FELDER = [
  { id: 'maske', name: 'Subnetzmaske', typ: 'ip' },
  { id: 'block', name: 'Blockgröße', typ: 'zahl' },
  { id: 'netz', name: 'Netzadresse', typ: 'ip' },
  { id: 'broadcast', name: 'Broadcastadresse', typ: 'ip' },
  { id: 'erster', name: 'Erste nutzbare', typ: 'ip' },
  { id: 'letzter', name: 'Letzte nutzbare', typ: 'ip' },
  { id: 'hosts', name: 'Nutzbare Hosts', typ: 'zahl' },
];

function RechenwegAusprobieren() {
  const [saat, setSaat] = useState(() => Math.floor(Math.random() * 1e9));
  const aufgabe = useMemo(() => zufallsAufgabe(zufall(saat)), [saat]);
  const r = rechenweg(aufgabe.ip, aufgabe.praefix);
  const [eingaben, setEingaben] = useState({});
  const [geprueft, setGeprueft] = useState(false);
  const [weg, setWeg] = useState(false);
  const ok = (f) => {
    const e = eingaben[f.id];
    return f.typ === 'ip' ? leseIp(e) === r[f.id] : leseZahl(e) === r[f.id];
  };
  const alle = FELDER.every(ok);
  const neu = () => {
    setSaat(Math.floor(Math.random() * 1e9));
    setEingaben({});
    setGeprueft(false);
    setWeg(false);
  };
  return (
    <Werkbank>
      <p class="lw-aufgabe">
        Jetzt du: Ein Rechner hat die Adresse{' '}
        <strong class="mono">
          {aufgabe.ip}/{aufgabe.praefix}
        </strong>
        . Fülle das Schema von oben nach unten aus.
      </p>
      <form
        class="sn-schema"
        onSubmit={(e) => {
          e.preventDefault();
          setGeprueft(true);
        }}
      >
        {FELDER.map((f, i) => (
          <label key={f.id} class="sn-schema__zeile">
            <span class="sn-schema__nr mono">{i + 1}</span>
            <span class="sn-schema__name">{f.name}</span>
            <input
              class={`feld feld--mono ${geprueft ? (ok(f) ? 'feld--richtig' : 'feld--falsch') : ''}`}
              value={eingaben[f.id] ?? ''}
              inputMode="decimal"
              autoComplete="off"
              spellcheck={false}
              onInput={(e) => {
                setEingaben({ ...eingaben, [f.id]: e.currentTarget.value });
                setGeprueft(false);
              }}
            />
            {geprueft && <Icon name={ok(f) ? 'circle-check' : 'circle-x'} groesse={18} class={ok(f) ? 'text-gut' : 'text-fehler'} />}
          </label>
        ))}
        <div class="lw-knoepfe">
          <Knopf variante="primaer" groesse="s" type="submit" icon="check">
            Prüfen
          </Knopf>
          <Knopf variante="geist" groesse="s" icon={weg ? 'eye-off' : 'eye'} onClick={() => setWeg(!weg)}>
            {weg ? 'Lösungsweg ausblenden' : 'Lösungsweg zeigen'}
          </Knopf>
          <Knopf variante="geist" groesse="s" icon="refresh-cw" onClick={neu}>
            Neue Adresse
          </Knopf>
        </div>
      </form>
      {geprueft && alle && (
        <Hinweis ton="gut" icon="party-popper">
          Alles richtig – das ist genau der Weg, den die Prüfung erwartet.
        </Hinweis>
      )}
      {weg && (
        <ol class="sn-loesungsweg">
          <li>
            /{aufgabe.praefix} → Subnetzmaske <strong class="mono">{r.maske}</strong>
          </li>
          <li>
            Entscheidendes Oktett: das {r.oktett}. · 256 − {r.maskenwert} = <strong>{r.block}</strong>
          </li>
          <li>
            {r.wert} : {r.block} = {r.blockNr} Rest {r.rest} → {r.start} → Netzadresse <strong class="mono">{r.netz}</strong>
          </li>
          <li>
            {r.start} + {r.block} − 1 = {r.ende} → Broadcast <strong class="mono">{r.broadcast}</strong>
          </li>
          <li>
            Erste <strong class="mono">{r.erster}</strong> · letzte <strong class="mono">{r.letzter}</strong>
          </li>
          <li>
            2^{r.hostBits} − 2 = <strong>{tausend(r.hosts)}</strong> Hosts
          </li>
        </ol>
      )}
    </Werkbank>
  );
}

export const SUBNETTING = {
  netzgroesse: { Erklaerung: NetzgroesseErklaerung, Ausprobieren: NetzgroesseAusprobieren },
  blockgroesse: { Erklaerung: BlockgroesseErklaerung, Ausprobieren: BlockgroesseAusprobieren },
  netzadresse: { Erklaerung: NetzadresseErklaerung, Ausprobieren: NetzadresseAusprobieren },
  broadcast: { Erklaerung: BroadcastErklaerung, Ausprobieren: BroadcastAusprobieren },
  hostbereich: { Erklaerung: HostbereichErklaerung, Ausprobieren: HostbereichAusprobieren },
  'gleiches-netz': { Erklaerung: GleichErklaerung, Ausprobieren: GleichAusprobieren },
  oktett3: { Erklaerung: Oktett3Erklaerung, Ausprobieren: Oktett3Ausprobieren },
  rechenweg: { Erklaerung: RechenwegErklaerung, Ausprobieren: RechenwegAusprobieren },
};
