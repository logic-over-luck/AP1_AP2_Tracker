// Block 1 – Die IPv4-Adresse: IP-Adresse, Netzanteil und Hostanteil, Binärzahl, Präfix, Subnetzmaske.

import { useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../../../ui/bausteine.jsx';
import { ipZuZahl, maskeZahl, netzBitsJeOktett, binaerSchritte, leseIp, praefixAusMaske, ipFehler } from '../../ip.js';
import {
  Schritte,
  Raten,
  Konsole,
  Geraet,
  Stellen,
  Umrechner,
  OktettBits,
  Absatz,
  Fakten,
  Fakt,
  Formel,
  Hinweis,
  Netz,
  Host,
  Grenze,
  Legende,
  ZweiSichten,
  Anschrift,
  Bitband,
  BitTafel,
  MaskenRechnung,
  MaskenWerte,
  PraefixWahl,
  IpFeld,
  Beispiele,
  Werkbank,
  bin8,
} from '../bausteine.jsx';

// ---------- 1 IP-Adresse ----------

function IpErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Wozu eine Adresse?',
          inhalt: (
            <>
              <Absatz>
                Wenn du einen Brief verschickst, stehen Empfänger und Absender darauf – sonst kommt er nicht an. Im Netz ist es genauso: Jedes <strong>Datenpaket</strong> trägt die
                Adresse des Empfängers und die des Absenders. Diese Adressen heißen <strong>IP-Adressen</strong> (IP = Internet Protocol, die Regeln für Adressen im Netz).
              </Absatz>
              <div class="sn-paketweg">
                <Geraet icon="laptop" name="Laptop" ip="192.168.1.10" />
                <Icon name="arrow-right" groesse={18} class="sn-paketweg__pfeil" />
                <div class="sn-paket">
                  <span class="sn-paket__titel">
                    <Icon name="mail" groesse={14} /> Datenpaket
                  </span>
                  <span class="mono">von 192.168.1.10</span>
                  <span class="mono">an 192.168.1.20</span>
                </div>
                <Icon name="arrow-right" groesse={18} class="sn-paketweg__pfeil" />
                <Geraet icon="printer" name="Drucker" ip="192.168.1.20" />
              </div>
              <Hinweis icon="info">
                Jedes Gerät, das im Netz sendet oder empfängt, braucht eine IP-Adresse. Zwei Geräte im selben Netz dürfen nie dieselbe Adresse haben – sonst weiß niemand, wer
                gemeint ist.
              </Hinweis>
            </>
          ),
        },
        {
          titel: 'So sieht eine IPv4-Adresse aus',
          inhalt: (
            <>
              <Absatz>
                Hier geht es um <strong>IPv4</strong>, die Version 4 – die Adressen, die du überall siehst. Eine IPv4-Adresse besteht aus{' '}
                <strong>vier Zahlen, getrennt durch Punkte</strong>. Unter Windows zeigt der Befehl <code>ipconfig</code> die Adresse deines PCs:
              </Absatz>
              <Konsole
                titel="Eingabeaufforderung › ipconfig"
                zeilen={[
                  'Ethernet-Adapter Ethernet:',
                  '',
                  { text: '   IPv4-Adresse  . . . . . . . . . . : 192.168.1.10', hervor: true },
                  '   Subnetzmaske  . . . . . . . . . . : 255.255.255.0',
                  '   Standardgateway . . . . . . . . . : 192.168.1.1',
                ]}
              />
              <Absatz>Die beiden Zeilen darunter – Subnetzmaske und Standardgateway – lernst du in den Lektionen 5 und 14 kennen. Am Ende verstehst du jede Zeile.</Absatz>
            </>
          ),
        },
        {
          titel: 'Für dich und für den Computer',
          inhalt: (
            <>
              <Absatz>
                Eine IP-Adresse gibt es in zwei Schreibweisen. Wir Menschen schreiben vier Zahlen mit Punkten. Der Computer kennt nur <strong>0 und 1</strong> – für ihn ist die
                Adresse eine Kette aus <strong>32 Bits</strong>. Ein <strong>Bit</strong> ist die kleinste Informationseinheit: eine Stelle, die 0 oder 1 sein kann (Strom aus oder
                an).
              </Absatz>
              <ZweiSichten ip="192.168.1.10" />
              <Absatz>Beides ist dieselbe Adresse. Wie man von der einen Schreibweise zur anderen kommt, zeigt Lektion 3.</Absatz>
            </>
          ),
        },
        {
          titel: 'Vier Päckchen zu je 8 Bit',
          inhalt: (
            <>
              <Absatz>
                32 Nullen und Einsen am Stück kann niemand lesen. Darum schneidet man sie in <strong>vier Päckchen</strong>. Jedes Päckchen wird als eine Dezimalzahl geschrieben.
              </Absatz>
              <Raten
                frage="Wie viele Bit hat dann jedes Päckchen?"
                optionen={[4, 8, 16, 32]}
                richtig={8}
                hinweis={(v) => (v === 32 ? '32 Bit sind die ganze Adresse – und die wird auf vier Päckchen verteilt.' : `4 × ${v} = ${4 * v} – es müssen aber 32 Bit werden.`)}
              >
                <Bitband
                  zahl={ipZuZahl('192.168.1.10')}
                  klammer
                  unter={[0, 1, 2, 3].map((o) => (
                    <>
                      {o + 1}. Oktett · <strong>8 Bit</strong>
                    </>
                  ))}
                />
                <Formel>
                  4 Oktette × 8 Bit = <strong>32 Bit</strong>
                </Formel>
                <Absatz>
                  So ein Päckchen aus 8 Bit heißt <strong>Oktett</strong> (lateinisch octo = acht). 8 Bit nennt man auch <strong>1 Byte</strong>. Eine IPv4-Adresse ist also 4 Byte
                  groß.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Was daraus folgt',
          inhalt: (
            <Fakten>
              <Fakt titel="Jedes Oktett: 0 bis 255">
                8 Bit haben genau 256 Möglichkeiten: von <span class="mono">00000000</span> (= 0) bis <span class="mono">11111111</span> (= 255). Darum ist 192.168.1.256 ungültig –
                256 passt nicht in 8 Bit.
              </Fakt>
              <Fakt titel="Die Punkte sind nur für dich">Sie trennen die vier Oktette, damit Menschen die Adresse lesen können. Für den Computer gibt es sie nicht.</Fakt>
              <Fakt titel="Rund 4,3 Milliarden Adressen">
                2<sup>32</sup> = <strong>4.294.967.296</strong> verschiedene Adressen. Das ist weniger, als es Geräte auf der Welt gibt – das spielt später noch eine Rolle.
              </Fakt>
            </Fakten>
          ),
        },
      ]}
    />
  );
}

function IpAusprobieren() {
  const [text, setText] = useState('192.168.1.10');
  const fehler = ipFehler(text);
  const ip = leseIp(text);
  const teile = text.replace(/\s+/g, '').split('.');
  return (
    <Werkbank>
      <p class="sn-aufgabe">Tippe eine Adresse ein – auch eine falsche. Was macht sie gültig, was nicht?</p>
      <label class="sn-feld">
        <span class="sn-feld__name">IP-Adresse</span>
        <input
          class={`feld feld--mono sn-feld__eingabe ${fehler ? 'feld--falsch' : 'feld--richtig'}`}
          value={text}
          spellcheck={false}
          autoComplete="off"
          onInput={(e) => setText(e.currentTarget.value)}
        />
      </label>
      <Beispiele liste={['192.168.1.10', '10.0.0.1', '8.8.8.8', '192.168.1.256', '172.16.5', '10.0.0.1.5']} aktiv={text} onWahl={setText} />
      <div class="sn-oktettliste">
        {teile.slice(0, 6).map((t, i) => {
          const n = Number(t);
          const ok = /^\d+$/.test(t) && n <= 255 && i < 4;
          return (
            <span key={i} class={`sn-oktettliste__teil ${ok ? 'sn-oktettliste__teil--ok' : 'sn-oktettliste__teil--falsch'}`}>
              <span class="sn-oktettliste__nr">{i < 4 ? `${i + 1}. Oktett` : 'zu viel'}</span>
              <strong class="mono">{t || '–'}</strong>
              <span class="sn-oktettliste__bits mono">{ok ? bin8(n) : /^\d+$/.test(t) && n > 255 ? '> 8 Bit' : '—'}</span>
            </span>
          );
        })}
      </div>
      {ip ? (
        <>
          <Hinweis ton="gut" icon="circle-check">
            Gültig: vier Oktette, jedes zwischen 0 und 255. Für den Computer sind das diese 32 Bit:
          </Hinweis>
          <Bitband zahl={ipZuZahl(ip)} />
        </>
      ) : (
        <Hinweis ton="fehler" icon="circle-x">
          {fehler}
        </Hinweis>
      )}
    </Werkbank>
  );
}

// ---------- 2 Netzanteil und Hostanteil ----------

function NetzHostErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Zwei Teile wie bei einer Anschrift',
          inhalt: (
            <>
              <Absatz>
                Eine Postanschrift hat zwei Teile: die <strong>Straße</strong> (welche Gegend?) und die <strong>Hausnummer</strong> (welches Haus dort?). Eine IP-Adresse ist
                genauso gebaut. Der vordere Teil sagt, in welchem Netz ein Gerät steht: der <Netz>Netzanteil</Netz>. Der hintere Teil sagt, welches Gerät in diesem Netz gemeint
                ist: der <Host>Hostanteil</Host>.
              </Absatz>
              <div class="sn-vergleich">
                <span class="sn-vergleich__name">Post</span>
                <Anschrift netz="Hauptstraße" host="12" trenner=" " netzName="Straße" hostName="Hausnummer" />
                <span class="sn-vergleich__name">Netz</span>
                <Anschrift netz="192.168.1" host="12" />
              </div>
              <Absatz>
                <strong>Host</strong> ist der Fachbegriff für jedes Gerät mit eigener IP-Adresse – PC, Laptop, Drucker, Server, Smartphone.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Ein Netz = gleicher Netzanteil',
          inhalt: (
            <>
              <Absatz>
                Alle Geräte, die zu einem Netz gehören – zum Beispiel alle Geräte im Büro – haben <strong>denselben Netzanteil</strong>. Sie unterscheiden sich nur im Hostanteil,
                so wie die Häuser einer Straße nur in der Hausnummer.
              </Absatz>
              <div class="sn-zweinetze">
                <div class="sn-zweinetze__netz">
                  <span class="sn-zweinetze__titel">
                    Büro · Netzanteil <Netz>192.168.1</Netz>
                  </span>
                  {[
                    ['monitor', 'PC-A', '10'],
                    ['monitor', 'PC-B', '11'],
                    ['printer', 'Drucker', '50'],
                  ].map(([icon, name, h]) => (
                    <span key={h} class="sn-zweinetze__geraet">
                      <Icon name={icon} groesse={14} /> {name}{' '}
                      <span class="mono">
                        <Netz>192.168.1</Netz>.<Host>{h}</Host>
                      </span>
                    </span>
                  ))}
                </div>
                <div class="sn-zweinetze__netz">
                  <span class="sn-zweinetze__titel">
                    Lager · Netzanteil <Netz>192.168.2</Netz>
                  </span>
                  {[
                    ['laptop', 'Laptop', '10'],
                    ['server', 'Server', '20'],
                  ].map(([icon, name, h]) => (
                    <span key={h} class="sn-zweinetze__geraet">
                      <Icon name={icon} groesse={14} /> {name}{' '}
                      <span class="mono">
                        <Netz>192.168.2</Netz>.<Host>{h}</Host>
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <Absatz>
                Achtung: PC-A (192.168.1.<Host>10</Host>) und der Laptop (192.168.2.<Host>10</Host>) haben denselben Hostanteil – das ist erlaubt, denn sie stehen in verschiedenen
                Netzen. Wie zwei Häuser mit der Nummer 10 in verschiedenen Straßen.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Wozu die Trennung?',
          inhalt: (
            <>
              <Absatz>
                Bevor ein Gerät ein Paket losschickt, stellt es sich eine Frage: <strong>Ist der Empfänger in meinem Netz?</strong> Dafür vergleicht es nur die Netzanteile. Sind
                sie gleich, kann es das Paket direkt zustellen. Sind sie verschieden, muss das Paket aus dem eigenen Netz hinaus – wie das geht, zeigt Block 3.
              </Absatz>
              <Raten
                frage="PC-A (192.168.1.10) schickt etwas an 192.168.1.50. Der Netzanteil sind die ersten drei Oktette. Liegt der Empfänger im selben Netz?"
                optionen={['ja', 'nein']}
                richtig="ja"
                hinweis={() => 'Vergleiche nur den Netzanteil, also die ersten drei Oktette: 192.168.1 und 192.168.1.'}
              >
                <Hinweis ton="gut" icon="circle-check">
                  Netzanteil <Netz>192.168.1</Netz> = <Netz>192.168.1</Netz> → gleiches Netz, das Paket geht direkt zum Drucker. Genau diese Prüfung wirst du in Lektion 11 mit
                  jeder beliebigen Grenze können.
                </Hinweis>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Wo genau liegt die Grenze?',
          inhalt: (
            <>
              <Absatz>
                Der Netzanteil sind <strong>nicht immer die ersten drei Oktette</strong>. Dieselbe Adresse kann – je nach Konfiguration – ganz verschieden aufgeteilt sein:
              </Absatz>
              <div class="sn-aufteilungen">
                <Anschrift netz="10" host="20.30.40" netzName="Netz" hostName="Host" />
                <Anschrift netz="10.20" host="30.40" netzName="Netz" hostName="Host" />
                <Anschrift netz="10.20.30" host="40" netzName="Netz" hostName="Host" />
              </div>
              <Absatz>
                Welche Aufteilung gilt, steht in der Konfiguration des Geräts: als <strong>Präfix</strong> (Lektion 4) oder als <strong>Subnetzmaske</strong> (Lektion 5). Und oft
                liegt die Grenze sogar <strong>mitten in einer Zahl</strong>. Um das zu sehen, brauchen wir die Bits – das ist die nächste Lektion.
              </Absatz>
              <Hinweis icon="info">
                In dieser Lektion ist der Netzanteil immer die ersten drei Oktette und der Hostanteil das vierte – so kannst du das Prinzip in Ruhe ausprobieren.
              </Hinweis>
            </>
          ),
        },
      ]}
    />
  );
}

const GERAETE = [
  { name: 'Drucker', ip: '192.168.1.50' },
  { name: 'Laptop', ip: '192.168.2.10' },
  { name: 'Server', ip: '192.168.1.200' },
  { name: 'Smartphone', ip: '10.0.1.10' },
  { name: 'PC-B', ip: '192.168.10.1' },
  { name: 'Kamera', ip: '192.168.1.7' },
];

function NetzHostAusprobieren() {
  const [antworten, setAntworten] = useState({});
  const meinNetz = '192.168.1';
  const fertig = GERAETE.every((g) => antworten[g.name] !== undefined);
  const richtig = GERAETE.filter((g) => antworten[g.name] === g.ip.startsWith(`${meinNetz}.`)).length;
  return (
    <Werkbank>
      <p class="sn-aufgabe">
        PC-A hat die Adresse{' '}
        <strong class="mono">
          <Netz>192.168.1</Netz>.<Host>25</Host>
        </strong>
        . Der Netzanteil sind die ersten drei Oktette (<Netz>192.168.1</Netz>), der Hostanteil das vierte (<Host>25</Host>). Welche Geräte liegen im selben Netz wie PC-A?
      </p>
      <ul class="sn-sortier">
        {GERAETE.map((g) => {
          const a = antworten[g.name];
          const soll = g.ip.startsWith(`${meinNetz}.`);
          const teile = g.ip.split('.');
          return (
            <li key={g.name} class={`sn-sortier__zeile ${a === undefined ? '' : a === soll ? 'sn-sortier__zeile--gut' : 'sn-sortier__zeile--falsch'}`}>
              <span class="sn-sortier__name">{g.name}</span>
              <span class="sn-sortier__ip mono">
                {a === undefined ? (
                  g.ip
                ) : (
                  <>
                    <Netz>{teile.slice(0, 3).join('.')}</Netz>.<Host>{teile[3]}</Host>
                  </>
                )}
              </span>
              <span class="sn-sortier__knoepfe">
                <button type="button" class="sn-chip" aria-pressed={a === true} onClick={() => setAntworten({ ...antworten, [g.name]: true })}>
                  selbes Netz
                </button>
                <button type="button" class="sn-chip" aria-pressed={a === false} onClick={() => setAntworten({ ...antworten, [g.name]: false })}>
                  anderes Netz
                </button>
              </span>
              {a !== undefined && (
                <span class="sn-sortier__info">
                  {a === soll ? <Icon name="circle-check" groesse={14} /> : <Icon name="circle-x" groesse={14} />} Netzanteil {teile.slice(0, 3).join('.')}{' '}
                  {soll ? '= wie PC-A' : '≠ 192.168.1'}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {fertig && (
        <Hinweis ton={richtig === GERAETE.length ? 'gut' : ''} icon={richtig === GERAETE.length ? 'party-popper' : 'info'}>
          {richtig} von {GERAETE.length} richtig.{' '}
          {richtig === GERAETE.length
            ? 'Achte auf 192.168.10.1: Sie beginnt auch mit „192.168.1“, aber die dritte Zahl ist 10, nicht 1.'
            : 'Vergleiche Zahl für Zahl die ersten drei Oktette – „192.168.10“ ist nicht „192.168.1“.'}
        </Hinweis>
      )}
      {Object.keys(antworten).length > 0 && (
        <Knopf variante="geist" groesse="s" icon="rotate-ccw" onClick={() => setAntworten({})}>
          Nochmal
        </Knopf>
      )}
    </Werkbank>
  );
}

// ---------- 3 Binärzahl ----------

function BinaerErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Stellenwerte kennst du schon',
          inhalt: (
            <>
              <Absatz>
                Im Zehnersystem hat jede Stelle einen <strong>Stellenwert</strong>: Einer, Zehner, Hunderter. Die Zahl 352 bedeutet „3 Hunderter, 5 Zehner, 2 Einer“. Von rechts
                nach links wird der Stellenwert jeweils <strong>zehnmal</strong> so groß.
              </Absatz>
              <Stellen werte={[100, 10, 1]} ziffern={[3, 5, 2]} summe="= 3·100 + 5·10 + 2·1 = 352" />
            </>
          ),
        },
        {
          titel: 'Im Binärsystem: nur 0 und 1',
          inhalt: (
            <>
              <Absatz>
                Das <strong>Binärsystem</strong> (Zweiersystem) hat nur die Ziffern 0 und 1 – genau die Bits. Darum wird der Stellenwert von rechts nach links nicht zehnmal,
                sondern <strong>zweimal</strong> so groß. Für ein Oktett mit 8 Bit:
              </Absatz>
              <div class="sn-verdopplung mono" aria-label="Stellenwerte verdoppeln sich">
                {[128, 64, 32, 16, 8, 4, 2, 1].map((g, i) => (
                  <span key={g} class="sn-verdopplung__glied">
                    <span class="sn-verdopplung__wert">{g}</span>
                    {i < 7 && <span class="sn-verdopplung__mal">←·2</span>}
                  </span>
                ))}
              </div>
              <Absatz>
                Diese Reihe <span class="mono">128 · 64 · 32 · 16 · 8 · 4 · 2 · 1</span> brauchst du ab jetzt ständig. Am einfachsten: von rechts bei 1 anfangen und immer
                verdoppeln.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Binär → dezimal: addieren',
          inhalt: (
            <>
              <Absatz>Eine 1 heißt: Dieser Stellenwert zählt mit. Eine 0 heißt: zählt nicht. Also einfach die Stellenwerte über den Einsen addieren:</Absatz>
              <Stellen werte={[128, 64, 32, 16, 8, 4, 2, 1]} ziffern={[1, 1, 0, 0, 0, 0, 0, 0]} summe="= 128 + 64 = 192" />
              <Raten
                frage="Und welche Zahl ist 00001010?"
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
          titel: 'Dezimal → binär: Passt es noch?',
          inhalt: (
            <>
              <Absatz>
                Umgekehrt geht man von links nach rechts und fragt bei jedem Stellenwert: <strong>Passt er in den Rest?</strong> Ja → 1 schreiben und abziehen. Nein → 0 schreiben.
                Klick dich durch das Beispiel 150:
              </Absatz>
              <Umrechner wert={150} />
            </>
          ),
        },
        {
          titel: 'Darum geht ein Oktett nur bis 255',
          inhalt: (
            <>
              <Absatz>Die größte Zahl mit 8 Bit entsteht, wenn alle Bits 1 sind:</Absatz>
              <Stellen werte={[128, 64, 32, 16, 8, 4, 2, 1]} ziffern={[1, 1, 1, 1, 1, 1, 1, 1]} summe="= 255" />
              <Absatz>
                Die kleinste ist <span class="mono">00000000</span> = 0. Von 0 bis 255 sind das <strong>256 verschiedene Werte</strong> – mehr gibt es mit 8 Bit nicht. Darum steht
                in jedem Oktett einer IP-Adresse eine Zahl von 0 bis 255.
              </Absatz>
            </>
          ),
        },
      ]}
    />
  );
}

const ZIELE = [192, 172, 10, 255, 168, 224, 100, 64, 1, 240, 127, 254];

function BinaerAusprobieren() {
  const [wert, setWert] = useState(0);
  const [zielNr, setZielNr] = useState(0);
  const [weg, setWeg] = useState(false);
  const ziel = ZIELE[zielNr % ZIELE.length];
  const geschafft = wert === ziel;
  return (
    <Werkbank>
      <p class="sn-aufgabe">
        Klick auf die Bits, um sie an- und auszuschalten. Aufgabe: Stell die Zahl <strong class="mono">{ziel}</strong> ein.
      </p>
      <BitTafel wert={wert} onWert={setWert} ziel={ziel} />
      {geschafft ? (
        <Hinweis ton="gut" icon="party-popper">
          Genau: {ziel} = <span class="mono">{bin8(ziel)}</span>.
        </Hinweis>
      ) : (
        weg && (
          <ol class="sn-rechenweg__liste sn-rechenweg__liste--klein">
            {binaerSchritte(ziel).map((s) => (
              <li key={s.gewicht} class={s.passt ? 'sn-rechenweg__ja' : ''}>
                {s.gewicht} in {s.vorher}? {s.passt ? `ja → 1, Rest ${s.nachher}` : 'nein → 0'}
              </li>
            ))}
          </ol>
        )
      )}
      <div class="sn-knoepfe">
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
            {weg ? 'Rechenweg ausblenden' : 'Rechenweg zeigen'}
          </Knopf>
        )}
      </div>
    </Werkbank>
  );
}

// ---------- 4 Präfix ----------

function PraefixErklaerung() {
  const zahl = ipZuZahl('192.168.1.10');
  return (
    <Schritte
      schritte={[
        {
          titel: 'Die Grenze liegt zwischen zwei Bits',
          inhalt: (
            <>
              <Absatz>
                Du kennst jetzt beide Zutaten: Eine Adresse hat einen <Netz>Netzanteil</Netz> und einen <Host>Hostanteil</Host> (Lektion 2), und sie besteht aus 32 Bits (Lektion
                3). Die Grenze zwischen Netz und Host liegt also <strong>zwischen zwei Bits</strong>. Man zählt einfach, wie viele Bits von links zum Netz gehören.
              </Absatz>
              <Bitband zahl={zahl} nummern />
              <Absatz>Die kleinen Zahlen unter den Bits sind ihre Nummern von 1 bis 32 – damit lässt sich die Grenze genau angeben.</Absatz>
            </>
          ),
        },
        {
          titel: 'Der Präfix zählt die Netzbits',
          inhalt: (
            <>
              <Absatz>
                Diese Zahl heißt <strong>Präfixlänge</strong>, kurz <strong>Präfix</strong>. Man schreibt sie mit Schrägstrich hinter die Adresse:{' '}
                <strong class="mono">192.168.1.10/24</strong> heißt: Bit 1 bis 24 sind Netz, der Rest ist Host.
              </Absatz>
              <Legende />
              <Bitband zahl={zahl} praefix={24} nummern unter={['8 Netz', '8 Netz', '8 Netz', '8 Host']} />
              <Absatz>
                24 = 8 + 8 + 8: Die Grenze liegt genau zwischen dem 3. und 4. Oktett. Darum kann man hier Netz und Host direkt an den Dezimalzahlen ablesen – wie in Lektion 2:{' '}
                <span class="mono">
                  <Netz>192.168.1</Netz>.<Host>10</Host>
                </span>
                .
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Die Grenze mitten im Oktett',
          inhalt: (
            <>
              <Absatz>
                Jetzt dieselbe Adresse mit <strong class="mono">/26</strong>. 26 = 8 + 8 + 8 + 2 – die Grenze rutscht zwei Bits weiter, <Grenze>mitten ins 4. Oktett</Grenze>.
              </Absatz>
              <Bitband zahl={zahl} praefix={26} nummern unter={['8 Netz', '8 Netz', '8 Netz', '2 Netz · 6 Host']} />
              <Raten
                frage="Die 10 im 4. Oktett ist binär 00001010. Wie viele dieser 8 Bits gehören bei /26 zum Netz?"
                optionen={[2, 6, 8, 26]}
                richtig={2}
                hinweis={(v) =>
                  v === 26
                    ? '26 sind alle Netzbits zusammen. Wie viele davon bleiben nach den ersten drei Oktetten (24 Bit) übrig?'
                    : v === 6
                      ? '6 ist die Zahl der Hostbits im 4. Oktett.'
                      : 'Bei /24 wären es 0. Bei /26 sind es zwei mehr.'
                }
              >
                <div class="sn-oktettbild">
                  <span class="mono">10 =</span>
                  <OktettBits wert={10} netzBits={2} />
                  <span>
                    <Netz>2 Bit Netz</Netz> · <Host>6 Bit Host</Host>
                  </span>
                </div>
                <Absatz>
                  Die Dezimalzahl 10 gehört jetzt <strong>teils zum Netz und teils zum Host</strong>. In der Punkt-Schreibweise sieht man das nicht mehr – darum braucht man für
                  Subnetting die Bits.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Hostbits = 32 − Präfix',
          inhalt: (
            <>
              <Absatz>Was nicht Netz ist, ist Host. Die Zahl der Hostbits ist deshalb immer 32 minus Präfix:</Absatz>
              <div class="sn-tabelle-huelle">
                <table class="sn-tabelle">
                  <thead>
                    <tr>
                      <th>Präfix</th>
                      <th>Netzbits</th>
                      <th>Hostbits</th>
                      <th>Die Grenze liegt …</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[8, 16, 20, 24, 26, 30].map((p) => {
                      const k = netzBitsJeOktett(p);
                      const im = k.findIndex((n) => n > 0 && n < 8);
                      return (
                        <tr key={p}>
                          <td class="mono">/{p}</td>
                          <td class="mono sn-f-netz">{p}</td>
                          <td class="mono sn-f-host">{32 - p}</td>
                          <td>{im === -1 ? `zwischen ${p / 8}. und ${p / 8 + 1}. Oktett` : `im ${im + 1}. Oktett (${k[im]} Netz · ${8 - k[im]} Host)`}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ),
        },
        {
          titel: 'Größerer Präfix, kleineres Netz',
          inhalt: (
            <>
              <Absatz>
                Schiebt man die Grenze nach rechts (größerer Präfix), werden die Hostbits weniger. Weniger Hostbits heißt: weniger verschiedene Hostanteile – also{' '}
                <strong>weniger Geräte im Netz</strong>. Wie viele genau, rechnest du in Lektion 6 aus.
              </Absatz>
              <span class="sn-beschrift mono">/24 – 8 Hostbits</span>
              <Bitband zahl={zahl} praefix={24} dezimal={false} />
              <span class="sn-beschrift mono">/28 – nur noch 4 Hostbits</span>
              <Bitband zahl={zahl} praefix={28} dezimal={false} />
            </>
          ),
        },
      ]}
    />
  );
}

function PraefixAusprobieren() {
  const [ip, setIp] = useState('192.168.1.10');
  const [praefix, setPraefix] = useState(26);
  const k = netzBitsJeOktett(praefix);
  const unter = k.map((n) =>
    n === 8 ? (
      <Netz>8 Netz</Netz>
    ) : n === 0 ? (
      <Host>8 Host</Host>
    ) : (
      <>
        <Netz>{n} Netz</Netz> · <Host>{8 - n} Host</Host>
      </>
    ),
  );
  return (
    <Werkbank
      leiste={
        <>
          <IpFeld ip={ip} onIp={setIp} />
          <PraefixWahl praefix={praefix} setPraefix={setPraefix} min={8} max={30} />
        </>
      }
    >
      <p class="sn-aufgabe">Schieb den Präfix hin und her und beobachte, wo die Grenze landet.</p>
      <Bitband zahl={ipZuZahl(ip)} praefix={praefix} nummern unter={unter} />
      <Formel>
        {k.filter((n) => n > 0).join(' + ')} = <Netz>{praefix} Netzbits</Netz> · 32 − {praefix} = <Host>{32 - praefix} Hostbits</Host>
      </Formel>
      <Hinweis icon="info">
        {k.every((n) => n === 0 || n === 8) ? (
          <>Die Grenze liegt genau zwischen zwei Oktetten – Netz- und Hostanteil kann man an den Dezimalzahlen ablesen.</>
        ) : (
          <>
            Die Grenze liegt mitten im {k.findIndex((n) => n > 0 && n < 8) + 1}. Oktett: <Netz>{k.find((n) => n > 0 && n < 8)} Bit</Netz> davon gehören zum Netz,{' '}
            <Host>{8 - k.find((n) => n > 0 && n < 8)} Bit</Host> zum Host.
          </>
        )}
      </Hinweis>
    </Werkbank>
  );
}

// ---------- 5 Subnetzmaske ----------

function MaskeErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Wo du sie siehst',
          inhalt: (
            <>
              <Absatz>
                Viele Eingabemasken fragen nicht nach dem Präfix, sondern nach der <strong>Subnetzmaske</strong> – zum Beispiel die IPv4-Einstellungen unter Windows und auch die
                Prüfungsaufgaben:
              </Absatz>
              <div class="sn-dialog" aria-label="Beispiel: IPv4-Einstellungen">
                <span class="sn-dialog__titel">Eigenschaften von Internetprotokoll, Version 4 (TCP/IPv4)</span>
                <span class="sn-dialog__name">IP-Adresse:</span>
                <span class="sn-dialog__feld mono">192.168.1.10</span>
                <span class="sn-dialog__name">Subnetzmaske:</span>
                <span class="sn-dialog__feld sn-dialog__feld--hervor mono">255.255.255.192</span>
                <span class="sn-dialog__name">Standardgateway:</span>
                <span class="sn-dialog__feld mono">…</span>
              </div>
              <Absatz>
                Die Subnetzmaske ist <strong>keine neue Information</strong>: Sie beschreibt dieselbe Grenze wie der Präfix, nur in einer anderen Schreibweise. 255.255.255.192 und
                /26 sagen genau dasselbe.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Netzbits → 1, Hostbits → 0',
          inhalt: (
            <>
              <Absatz>
                So entsteht die Subnetzmaske: Man nimmt 32 Bits und schreibt für jedes Netzbit eine <strong>1</strong>, für jedes Hostbit eine <strong>0</strong>. Bei /26 also 26
                Einsen, dann 6 Nullen.
              </Absatz>
              <Legende />
              <span class="sn-beschrift">Adresse 192.168.1.10/26</span>
              <Bitband zahl={ipZuZahl('192.168.1.10')} praefix={26} dezimal={false} />
              <span class="sn-beschrift">Subnetzmaske /26</span>
              <Bitband zahl={maskeZahl(26)} praefix={26} dezimal={false} />
            </>
          ),
        },
        {
          titel: 'Oktett für Oktett umrechnen',
          inhalt: (
            <>
              <Absatz>Jetzt jedes Oktett in eine Dezimalzahl umrechnen – genau wie in Lektion 3: die Stellenwerte über den Einsen addieren.</Absatz>
              <MaskenRechnung praefix={26} />
              <Absatz>Volle Oktette (8 Einsen) ergeben immer 255, leere (8 Nullen) immer 0. Rechnen musst du nur in dem Oktett, in dem die Grenze liegt.</Absatz>
            </>
          ),
        },
        {
          titel: 'Nur neun mögliche Werte',
          inhalt: (
            <>
              <Absatz>
                Weil die Einsen immer <strong>von links</strong> kommen, kann ein Oktett der Subnetzmaske nur neun Werte haben. Jede weitere Eins addiert den nächsten Stellenwert:
                128, +64 = 192, +32 = 224 …
              </Absatz>
              <MaskenWerte />
              <Raten
                frage="Welchen Wert hat ein Masken-Oktett mit 3 Einsen (11100000)?"
                optionen={[3, 192, 224, 240]}
                richtig={224}
                hinweis={(v) =>
                  v === 3 ? '3 ist die Zahl der Einsen – gesucht ist der Wert: 128 + 64 + 32.' : v === 192 ? '192 sind nur 2 Einsen (128 + 64).' : '240 sind 4 Einsen.'
                }
              >
                <Formel>
                  11100000 = 128 + 64 + 32 = <strong>224</strong>
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Rückweg: Subnetzmaske → Präfix',
          inhalt: (
            <>
              <Absatz>
                Umgekehrt zählt man die Einsen. 255 sind 8 Einsen, 0 sind keine, und die Werte dazwischen liest du aus der Reihe oben ab. Beispiel{' '}
                <strong class="mono">255.255.240.0</strong>:
              </Absatz>
              <div class="sn-tabelle-huelle">
                <table class="sn-tabelle">
                  <thead>
                    <tr>
                      <th>Oktett</th>
                      <th>Wert</th>
                      <th>Bits</th>
                      <th>Einsen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[255, 255, 240, 0].map((w, i) => (
                      <tr key={i}>
                        <td>{i + 1}.</td>
                        <td class="mono">{w}</td>
                        <td class="mono">
                          <OktettBits wert={w} netzBits={w.toString(2).replace(/0+$/, '').length * (w > 0 ? 1 : 0)} />
                        </td>
                        <td class="mono">{w ? w.toString(2).replace(/0+$/, '').length : 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Formel>
                8 + 8 + 4 + 0 = <strong>/20</strong>
              </Formel>
            </>
          ),
        },
        {
          titel: 'Keine Lücken erlaubt',
          inhalt: (
            <>
              <Absatz>
                Eine Subnetzmaske beschreibt <strong>eine</strong> Grenze. Deshalb stehen alle Einsen zusammen links, danach nur Nullen. Gibt es eine Lücke, ist es keine
                Subnetzmaske:
              </Absatz>
              <div class="sn-oktettbild">
                <span class="mono">100 =</span>
                <OktettBits wert={100} />
                <span class="sn-f-res">Nullen zwischen den Einsen – ungültig</span>
              </div>
              <Absatz>255.255.255.100 oder 255.255.0.255 sind darum keine gültigen Subnetzmasken.</Absatz>
            </>
          ),
        },
      ]}
    />
  );
}

function MaskeAusprobieren() {
  const [praefix, setPraefix] = useState(26);
  const [maskeText, setMaskeText] = useState('255.255.255.224');
  const m = leseIp(maskeText);
  const p = m ? praefixAusMaske(m) : null;
  return (
    <Werkbank>
      <div class="sn-zwei-spalten">
        <div class="sn-teilwerk">
          <span class="sn-teilwerk__titel">Präfix → Subnetzmaske</span>
          <PraefixWahl praefix={praefix} setPraefix={setPraefix} min={8} max={30} />
          <MaskenRechnung praefix={praefix} />
        </div>
        <div class="sn-teilwerk">
          <span class="sn-teilwerk__titel">Subnetzmaske → Präfix</span>
          <label class="sn-feld">
            <span class="sn-feld__name">Subnetzmaske</span>
            <input
              class={`feld feld--mono sn-feld__eingabe ${m && p !== null ? 'feld--richtig' : 'feld--falsch'}`}
              value={maskeText}
              spellcheck={false}
              onInput={(e) => setMaskeText(e.currentTarget.value)}
            />
          </label>
          <Beispiele liste={['255.255.255.0', '255.255.255.192', '255.255.240.0', '255.255.255.100']} aktiv={maskeText} onWahl={setMaskeText} />
          {m ? (
            <>
              <Bitband zahl={ipZuZahl(m)} praefix={p} dezimal={false} />
              {p !== null ? (
                <Hinweis ton="gut" icon="circle-check">
                  {netzBitsJeOktett(p)
                    .filter((n) => n > 0)
                    .join(' + ')}{' '}
                  Einsen = <strong>/{p}</strong>
                </Hinweis>
              ) : (
                <Hinweis ton="fehler" icon="circle-x">
                  Keine gültige Subnetzmaske: Zwischen den Einsen stehen Nullen. Die Einsen müssen lückenlos links stehen.
                </Hinweis>
              )}
            </>
          ) : (
            <Hinweis ton="fehler" icon="circle-x">
              {ipFehler(maskeText)}
            </Hinweis>
          )}
        </div>
      </div>
    </Werkbank>
  );
}

export const ADRESSE = {
  'ip-adresse': { Erklaerung: IpErklaerung, Ausprobieren: IpAusprobieren },
  'netz-host': { Erklaerung: NetzHostErklaerung, Ausprobieren: NetzHostAusprobieren },
  binaer: { Erklaerung: BinaerErklaerung, Ausprobieren: BinaerAusprobieren },
  praefix: { Erklaerung: PraefixErklaerung, Ausprobieren: PraefixAusprobieren },
  subnetzmaske: { Erklaerung: MaskeErklaerung, Ausprobieren: MaskeAusprobieren },
};
