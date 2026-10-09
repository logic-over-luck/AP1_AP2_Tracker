// Block 5 – IPv6: IPv6-Adresse, Kurzschreibweise, Präfix und Interface-Identifier, verbindungslokale Adresse.

import { useState } from 'preact/hooks';
import { Icon } from '../../../../../ui/bausteine.jsx';
import { ipv6Voll, ipv6Kurz, ipv6Art } from '../../ip.js';
import { Schritte, Raten, Absatz, Fakten, Fakt, Formel, Hinweis, Netz, Host, Konsole, Werkbank, Beispiele, Geraet } from '../bausteine.jsx';

// Die 8 Blöcke einer ausgeschriebenen IPv6-Adresse; praefix: Anzahl Bits fürs Netz (färbt Blöcke), auswahl: hervorgehobener Block
function Bloecke({ voll, praefix = null, auswahl = null, onWahl = null, nummern = true }) {
  const g = voll.split(':');
  return (
    <div class="sn-v6">
      {g.map((b, i) => {
        const art = praefix === null ? 'neutral' : (i + 1) * 16 <= praefix ? 'netz' : 'host';
        const Tag = onWahl ? 'button' : 'span';
        return (
          <Tag
            key={i}
            type={onWahl ? 'button' : undefined}
            class={`sn-v6__block sn-v6__block--${art} ${auswahl === i ? 'sn-v6__block--aktiv' : ''}`}
            onClick={onWahl ? () => onWahl(i) : undefined}
          >
            <strong class="mono">{b}</strong>
            {nummern && (
              <span class="sn-v6__bits mono">
                Bit {i * 16 + 1}–{(i + 1) * 16}
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}

// Kürzen Schritt für Schritt: ausgeschrieben → Regel 1 → Regel 2
function kurzSchritte(voll) {
  const g = voll.split(':');
  const r1 = g.map((x) => x.replace(/^0+(?=.)/, ''));
  return { voll: g, regel1: r1, kurz: ipv6Kurz(voll) };
}

function Gekuerzt({ voll }) {
  const s = kurzSchritte(voll);
  return (
    <div class="sn-kuerzen">
      <span class="sn-kuerzen__name">ausgeschrieben</span>
      <span class="sn-kuerzen__wert mono">
        {s.voll.map((b, i) => {
          const fuehrend = b.match(/^0+(?=.)/)?.[0] ?? '';
          return (
            <span key={i}>
              {i > 0 && ':'}
              <span class="sn-kuerzen__weg">{fuehrend}</span>
              {b.slice(fuehrend.length)}
            </span>
          );
        })}
      </span>
      <span class="sn-kuerzen__name">nach Regel 1</span>
      <span class="sn-kuerzen__wert mono">{s.regel1.join(':')}</span>
      <span class="sn-kuerzen__name">nach Regel 2</span>
      <span class="sn-kuerzen__wert sn-kuerzen__wert--ziel mono">{s.kurz}</span>
    </div>
  );
}

// ---------- 22 IPv6-Adresse ----------

function Ipv6Erklaerung() {
  const voll = '2001:0db8:0000:0000:0000:ff00:0042:8329';
  return (
    <Schritte
      schritte={[
        {
          titel: 'IPv4 reicht nicht mehr',
          inhalt: (
            <>
              <Absatz>
                IPv4 hat rund <strong>4,3 Milliarden</strong> Adressen (Lektion 1). Auf der Erde leben über 8 Milliarden Menschen, und viele haben mehrere Geräte: Smartphone,
                Laptop, Fernseher, Uhr … Die freien IPv4-Adressen sind <strong>aufgebraucht</strong>. Private Adressen mit NAT (Lektion 15) sind nur eine Notlösung.
              </Absatz>
              <Absatz>
                Darum gibt es den Nachfolger: <strong>IPv6</strong> (Internet Protocol Version 6). Er macht dasselbe wie IPv4 – Geräte adressieren, Pakete zum Ziel bringen –, nur
                mit viel längeren Adressen.
              </Absatz>
            </>
          ),
        },
        {
          titel: '128 statt 32 Bit',
          inhalt: (
            <>
              <div class="sn-laengen">
                <span class="sn-beschrift">IPv4 · 32 Bit</span>
                <span class="sn-laengen__balken" style={{ width: '25%' }} />
                <span class="sn-beschrift">IPv6 · 128 Bit</span>
                <span class="sn-laengen__balken sn-laengen__balken--v6" style={{ width: '100%' }} />
              </div>
              <Raten
                frage="IPv6 hat 4-mal so viele Bits. Wie viele Adressen hat es im Vergleich zu IPv4?"
                optionen={['4-mal so viele', '96-mal so viele', '2⁹⁶-mal so viele']}
                richtig="2⁹⁶-mal so viele"
                hinweis={() => 'Jedes zusätzliche Bit verdoppelt die Zahl der Adressen (Lektion 6). Wie viele Bits kommen dazu?'}
              >
                <Formel>
                  2<sup>128</sup> ≈ 340.000.000.000.000.000.000.000.000.000.000.000.000 Adressen (3,4 · 10<sup>38</sup>) – 96 Bits mehr heißt 96-mal verdoppeln.
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die Schreibweise: 8 Blöcke in Hex',
          inhalt: (
            <>
              <Absatz>
                128 Bit dezimal mit Punkten wären 16 Zahlen – unhandlich. IPv6 schreibt man darum <strong>hexadezimal</strong> (Lektion 19): <strong>8 Blöcke</strong> zu je{' '}
                <strong>4 Hex-Ziffern</strong>, getrennt durch <strong>Doppelpunkte</strong>.
              </Absatz>
              <Bloecke voll={voll} />
              <Formel>
                8 Blöcke × 4 Hex-Ziffern × 4 Bit = 8 × 16 Bit = <strong>128 Bit</strong>
              </Formel>
            </>
          ),
        },
        {
          titel: 'IPv4 und IPv6 im Vergleich',
          inhalt: (
            <div class="lw-tabelle-huelle">
              <table class="lw-tabelle">
                <thead>
                  <tr>
                    <th />
                    <th>IPv4</th>
                    <th>IPv6</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Länge</td>
                    <td>32 Bit</td>
                    <td>128 Bit</td>
                  </tr>
                  <tr>
                    <td>Schreibweise</td>
                    <td>4 Dezimalzahlen 0–255</td>
                    <td>8 Blöcke zu 4 Hex-Ziffern</td>
                  </tr>
                  <tr>
                    <td>Trennzeichen</td>
                    <td>Punkt</td>
                    <td>Doppelpunkt</td>
                  </tr>
                  <tr>
                    <td>Beispiel</td>
                    <td class="mono">192.168.1.10</td>
                    <td class="mono">2001:db8::1</td>
                  </tr>
                  <tr>
                    <td>Adressen</td>
                    <td>≈ 4,3 Milliarden</td>
                    <td>≈ 3,4 · 10³⁸</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ),
        },
        {
          titel: 'Wo du sie siehst',
          inhalt: (
            <>
              <Absatz>Die meisten Geräte haben heute beide Adressen gleichzeitig. ipconfig zeigt sie untereinander:</Absatz>
              <Konsole
                titel="ipconfig"
                zeilen={[
                  { text: '   IPv6-Adresse. . . . . . . . . . . : 2001:db8:abcd:12::5', hervor: true },
                  '   Verbindungslokale IPv6-Adresse  . : fe80::1a2b:3cff:fe4d:5e6f%12',
                  '   IPv4-Adresse  . . . . . . . . . . : 192.168.1.10',
                ]}
              />
              <Absatz>Die IPv6-Adressen sehen kürzer aus als 8 Blöcke – sie sind gekürzt. Wie das geht, zeigt die nächste Lektion.</Absatz>
            </>
          ),
        },
      ]}
    />
  );
}

function Ipv6Ausprobieren() {
  const [text, setText] = useState('2001:0db8:0000:0000:0000:ff00:0042:8329');
  const [auswahl, setAuswahl] = useState(1);
  const voll = ipv6Voll(text);
  const g = voll?.split(':');
  return (
    <Werkbank>
      <p class="lw-aufgabe">Gib eine IPv6-Adresse ein und klick auf einen Block, um seine 16 Bits zu sehen.</p>
      <label class="lw-feld lw-feld--breit">
        <span class="lw-feld__name">IPv6-Adresse</span>
        <input
          class={`feld feld--mono lw-feld__eingabe ${voll ? 'feld--richtig' : 'feld--falsch'}`}
          value={text}
          spellcheck={false}
          onInput={(e) => setText(e.currentTarget.value)}
        />
      </label>
      <Beispiele liste={['2001:0db8:0000:0000:0000:ff00:0042:8329', 'fe80:0000:0000:0000:1a2b:3cff:fe4d:5e6f', '2001:db8::1', '2001:db8:g::1']} aktiv={text} onWahl={setText} />
      {voll ? (
        <>
          <Bloecke voll={voll} auswahl={auswahl} onWahl={setAuswahl} />
          <div class="sn-v6__detail">
            <span>
              Block {auswahl + 1}: <strong class="mono">{g[auswahl]}</strong> =
            </span>
            <span class="mono sn-v6__nibbles">
              {[...g[auswahl]].map((z, i) => (
                <span key={i}>
                  <strong>{z}</strong>
                  {parseInt(z, 16).toString(2).padStart(4, '0')}
                </span>
              ))}
            </span>
          </div>
          {voll !== text.trim().toLowerCase() && <Hinweis icon="info">Deine Eingabe war gekürzt – oben steht sie ausgeschrieben.</Hinweis>}
        </>
      ) : (
        <Hinweis ton="fehler" icon="circle-x">
          Keine gültige IPv6-Adresse: Erlaubt sind nur 0–9, a–f und Doppelpunkte, höchstens 8 Blöcke mit je bis zu 4 Ziffern und :: höchstens einmal.
        </Hinweis>
      )}
    </Werkbank>
  );
}

// ---------- 23 Kurzschreibweise ----------

function KurzErklaerung() {
  const voll = '2001:0db8:0000:0000:0000:ff00:0042:8329';
  return (
    <Schritte
      schritte={[
        {
          titel: 'Zu lang zum Tippen',
          inhalt: (
            <>
              <Absatz>
                Ausgeschrieben hat eine IPv6-Adresse 39 Zeichen. Viele davon sind Nullen. Darum darf man sie mit <strong>zwei Regeln</strong> kürzen – und muss gekürzte Adressen
                auch wieder ausschreiben können.
              </Absatz>
              <Bloecke voll={voll} nummern={false} />
            </>
          ),
        },
        {
          titel: 'Regel 1: führende Nullen weglassen',
          inhalt: (
            <>
              <Absatz>
                In jedem Block darf man die Nullen <strong>am Anfang</strong> weglassen – wie man auch nicht „0042 Euro“ schreibt. Ein Block aus lauter Nullen wird zu einer
                einzigen 0.
              </Absatz>
              <div class="sn-regel1">
                {[
                  ['0db8', 'db8'],
                  ['0000', '0'],
                  ['0042', '42'],
                  ['ff00', 'ff00'],
                ].map(([a, b]) => (
                  <span key={a} class="sn-regel1__paar mono">
                    {a} <Icon name="arrow-right" groesse={13} /> <strong>{b}</strong>
                  </span>
                ))}
              </div>
              <Raten
                frage="Was wird nach Regel 1 aus dem Block 00a0?"
                optionen={['a', 'a0', '0a0', 'a00']}
                richtig="a0"
                hinweis={(v) =>
                  v === 'a'
                    ? 'Die Null am Ende gehört zum Wert (wie bei 10 Euro) – sie bleibt.'
                    : v === '0a0'
                      ? 'Es dürfen alle führenden Nullen weg, nicht nur eine.'
                      : 'Die Reihenfolge bleibt gleich – nur vorne fallen Nullen weg.'
                }
              >
                <Formel>
                  00a0 → <strong>a0</strong> – nur vorne fallen Nullen weg, hinten nie (sonst wäre aus a0 = 160 plötzlich a = 10).
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Regel 2: Nullblöcke durch :: ersetzen',
          inhalt: (
            <>
              <Absatz>
                Eine <strong>zusammenhängende Folge von Nullblöcken</strong> darf man durch <strong>::</strong> ersetzen – aber nur <strong>einmal</strong> in der Adresse. Gibt es
                mehrere Folgen, nimmt man die längste (bei Gleichstand die erste).
              </Absatz>
              <Gekuerzt voll={voll} />
              <Raten
                frage="Warum darf :: nur einmal vorkommen?"
                optionen={['weil es sonst zu kurz wird', 'weil sonst unklar ist, wie viele Nullblöcke jede Lücke ersetzt', 'weil Doppelpunkte teuer sind']}
                richtig="weil sonst unklar ist, wie viele Nullblöcke jede Lücke ersetzt"
                hinweis={() => 'Denk ans Ausschreiben: Woher weiß man, wie viele Nullblöcke :: bedeutet?'}
              >
                <Absatz>
                  Bei <span class="mono">2001::1::2</span> könnte das erste :: einen, zwei, drei oder vier Nullblöcke bedeuten – die Adresse wäre nicht eindeutig.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Ausschreiben: der Rückweg',
          inhalt: (
            <>
              <Absatz>
                Beispiel <strong class="mono">fe80::1</strong>. Zuerst zählen, wie viele Blöcke dastehen: fe80 und 1 – das sind <strong>2</strong>. Eine Adresse hat 8 Blöcke, also
                ersetzt :: genau <strong>8 − 2 = 6</strong> Nullblöcke. Dann jeden Block vorne mit Nullen auf 4 Ziffern auffüllen.
              </Absatz>
              <div class="sn-kuerzen">
                <span class="sn-kuerzen__name">gekürzt</span>
                <span class="sn-kuerzen__wert mono">fe80::1</span>
                <span class="sn-kuerzen__name">:: auffüllen</span>
                <span class="sn-kuerzen__wert mono">
                  fe80:<span class="sn-kuerzen__neu">0:0:0:0:0:0</span>:1
                </span>
                <span class="sn-kuerzen__name">auf 4 Ziffern</span>
                <span class="sn-kuerzen__wert sn-kuerzen__wert--ziel mono">fe80:0000:0000:0000:0000:0000:0000:0001</span>
              </div>
            </>
          ),
        },
      ]}
    />
  );
}

function KurzAusprobieren() {
  const [text, setText] = useState('2001:0db8:0000:0000:0000:0000:1428:57ab');
  const voll = ipv6Voll(text);
  return (
    <Werkbank>
      <p class="lw-aufgabe">Gib eine Adresse ein – ausgeschrieben oder gekürzt. Du siehst beide Regeln einzeln.</p>
      <label class="lw-feld lw-feld--breit">
        <span class="lw-feld__name">IPv6-Adresse</span>
        <input
          class={`feld feld--mono lw-feld__eingabe ${voll ? 'feld--richtig' : 'feld--falsch'}`}
          value={text}
          spellcheck={false}
          onInput={(e) => setText(e.currentTarget.value)}
        />
      </label>
      <Beispiele
        liste={['2001:0db8:0000:0000:0000:0000:1428:57ab', '2001:0db8:0000:0042:0000:0000:0000:0001', 'fe80:0000:0000:0000:0000:0000:0000:0001', '2001:db8:0:0:1:0:0:1', '::1']}
        aktiv={text}
        onWahl={setText}
      />
      {voll ? (
        <>
          <Gekuerzt voll={voll} />
          <span class="sn-beschrift">
            Ausgeschrieben: <span class="mono">{voll}</span>
          </span>
        </>
      ) : (
        <Hinweis ton="fehler" icon="circle-x">
          Keine gültige IPv6-Adresse.
        </Hinweis>
      )}
    </Werkbank>
  );
}

// ---------- 24 Präfix und Interface-Identifier ----------

function PraefixV6Erklaerung() {
  const voll = ipv6Voll('2001:db8:abcd:12::5');
  return (
    <Schritte
      schritte={[
        {
          titel: 'Wie bei IPv4: Netz und Gerät',
          inhalt: (
            <>
              <Absatz>
                Auch eine IPv6-Adresse hat zwei Teile (Lektion 2): vorne das <Netz>Netz</Netz>, hinten das <Host>Gerät</Host>. Wie viele Bits zum Netz gehören, sagt wieder die{' '}
                <strong>Präfixlänge</strong> (Lektion 4) – geschrieben mit Schrägstrich, z. B. <strong class="mono">/64</strong>. Der Geräteteil heißt bei IPv6{' '}
                <strong>Interface-Identifier</strong> (Kennung der Schnittstelle).
              </Absatz>
              <Fakten>
                <Fakt titel="Präfix">bezeichnet das Netz – wie der Netzanteil bei IPv4</Fakt>
                <Fakt titel="Interface-Identifier">bezeichnet die Netzwerkschnittstelle des Geräts in diesem Netz – wie der Hostanteil</Fakt>
              </Fakten>
            </>
          ),
        },
        {
          titel: '/64 = 4 Blöcke Netz, 4 Blöcke Gerät',
          inhalt: (
            <>
              <Absatz>
                Fast immer ist der Präfix <strong>/64</strong>. Ein Block hat 16 Bit, also sind das 64 : 16 = <strong>4 Blöcke</strong>. Praktisch: Die Grenze liegt genau in der
                Mitte.
              </Absatz>
              <Bloecke voll={voll} praefix={64} />
              <div class="sn-v6-teile">
                <span>
                  <Netz>Präfix: die ersten 64 Bit</Netz>
                </span>
                <span>
                  <Host>Interface-Identifier: die letzten 64 Bit</Host>
                </span>
              </div>
            </>
          ),
        },
        {
          titel: 'Erst ausschreiben, dann teilen',
          inhalt: (
            <>
              <Absatz>
                Bei gekürzten Adressen sieht man die Grenze nicht – <strong>2001:db8:abcd:12::5</strong> hat scheinbar nur 5 Blöcke. Also zuerst ausschreiben (Lektion 23), dann
                nach 4 Blöcken teilen:
              </Absatz>
              <div class="sn-kuerzen">
                <span class="sn-kuerzen__name">ausgeschrieben</span>
                <span class="sn-kuerzen__wert mono">{voll}</span>
                <span class="sn-kuerzen__name">Präfix</span>
                <span class="sn-kuerzen__wert mono sn-f-netz">2001:0db8:abcd:0012 · kurz 2001:db8:abcd:12::/64</span>
                <span class="sn-kuerzen__name">Interface-ID</span>
                <span class="sn-kuerzen__wert mono sn-f-host">0000:0000:0000:0005 · kurz ::5</span>
              </div>
              <Raten
                frage="Wie lautet der Interface-Identifier von fe80::1/64?"
                optionen={['1', '0:0:0:1', 'fe80', '0:0:0:0']}
                richtig="0:0:0:1"
                hinweis={(v) =>
                  v === '1'
                    ? 'Der Interface-Identifier sind immer 4 Blöcke (64 Bit) – ausgeschrieben.'
                    : v === 'fe80'
                      ? 'fe80 steht vorne – das gehört zum Präfix.'
                      : 'Schreib die Adresse aus: fe80:0:0:0:0:0:0:1.'
                }
              >
                <Formel>
                  fe80:0000:0000:0000:<strong>0000:0000:0000:0001</strong> → Interface-Identifier 0:0:0:1 (gekürzt ::1)
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Gut zu wissen: Woher kommt der Interface-Identifier?',
          inhalt: (
            <>
              <Absatz>
                Oft bildet das Gerät ihn selbst aus seiner <strong>MAC-Adresse</strong> (Lektion 20): Die 48 Bit werden in der Mitte um <span class="mono">ff:fe</span> ergänzt (so
                werden es 64) und ein Bit im ersten Byte wird umgedreht. Darum erkennst du solche Adressen am <strong>ff:fe in der Mitte</strong>:
              </Absatz>
              <div class="sn-kuerzen">
                <span class="sn-kuerzen__name">MAC-Adresse</span>
                <span class="sn-kuerzen__wert mono">18:2b:3c:4d:5e:6f</span>
                <span class="sn-kuerzen__name">Interface-ID</span>
                <span class="sn-kuerzen__wert mono">
                  1a2b:3c<strong class="sn-f-grenze">ff:fe</strong>4d:5e6f
                </span>
              </div>
              <Hinweis icon="info">
                Viele Systeme nehmen aus Datenschutzgründen stattdessen eine Zufallszahl. Für die Prüfung reicht: Interface-Identifier = die hinteren 64 Bit.
              </Hinweis>
            </>
          ),
        },
      ]}
    />
  );
}

function PraefixV6Ausprobieren() {
  const [text, setText] = useState('2001:db8:abcd:12::5');
  const [praefix, setPraefix] = useState(64);
  const voll = ipv6Voll(text);
  const g = voll?.split(':');
  const n = praefix / 16;
  return (
    <Werkbank
      leiste={
        <span class="lw-feld">
          <span class="lw-feld__name">Präfixlänge</span>
          <span class="lw-beispiele">
            {[32, 48, 64].map((p) => (
              <button key={p} type="button" class={`lw-chip mono ${p === praefix ? 'lw-chip--aktiv' : ''}`} onClick={() => setPraefix(p)}>
                /{p}
              </button>
            ))}
          </span>
        </span>
      }
    >
      <label class="lw-feld lw-feld--breit">
        <span class="lw-feld__name">IPv6-Adresse</span>
        <input
          class={`feld feld--mono lw-feld__eingabe ${voll ? 'feld--richtig' : 'feld--falsch'}`}
          value={text}
          spellcheck={false}
          onInput={(e) => setText(e.currentTarget.value)}
        />
      </label>
      <Beispiele liste={['2001:db8:abcd:12::5', 'fe80::1a2b:3cff:fe4d:5e6f', 'fe80::1', '2a02:8108:1:2:3:4:5:6']} aktiv={text} onWahl={setText} />
      {voll ? (
        <>
          <Bloecke voll={voll} praefix={praefix} />
          <div class="sn-kuerzen">
            <span class="sn-kuerzen__name">Präfix</span>
            <span class="sn-kuerzen__wert mono sn-f-netz">
              {ipv6Kurz([...g.slice(0, n), ...Array(8 - n).fill('0')].join(':'))}/{praefix}
            </span>
            <span class="sn-kuerzen__name">Interface-ID</span>
            <span class="sn-kuerzen__wert mono sn-f-host">
              {g.slice(n).join(':')} · kurz {ipv6Kurz(g.slice(n).join(':'), 8 - n)}
            </span>
          </div>
          {praefix !== 64 && (
            <Hinweis icon="info">
              Bei /{praefix} ist der hintere Teil {128 - praefix} Bit lang. Im Alltag und in der Prüfung ist /64 der Normalfall.
            </Hinweis>
          )}
        </>
      ) : (
        <Hinweis ton="fehler" icon="circle-x">
          Keine gültige IPv6-Adresse.
        </Hinweis>
      )}
    </Werkbank>
  );
}

// ---------- 25 Verbindungslokale Adresse ----------

function LinkLocalErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Jedes Gerät hat sofort eine',
          inhalt: (
            <Absatz>
              Sobald ein Gerät IPv6 einschaltet, gibt es sich <strong>selbst</strong> eine Adresse – ganz ohne DHCP-Server. Sie beginnt immer mit <strong class="mono">fe80</strong>{' '}
              und heißt <strong>verbindungslokale Adresse</strong> (englisch Link-Local). Damit kann es sofort mit den Nachbarn im selben Netzabschnitt sprechen.
            </Absatz>
          ),
        },
        {
          titel: 'Nur im lokalen Netzabschnitt',
          inhalt: (
            <>
              <Absatz>
                „Verbindungslokal“ heißt: Die Adresse gilt nur auf der eigenen Verbindung, also im lokalen Netzabschnitt.{' '}
                <strong>Router leiten Pakete an fe80-Adressen nicht weiter.</strong>
              </Absatz>
              <div class="sn-weg">
                <span class="sn-weg__glied">
                  <Geraet klein icon="laptop" name="Laptop" ip="fe80::1" ton="netz" />
                </span>
                <span class="sn-weg__glied">
                  <Icon name="arrow-right" groesse={18} class="sn-weg__pfeil" />
                  <Geraet klein icon="printer" name="Drucker" ip="fe80::2" ton="netz" />
                </span>
                <span class="sn-weg__glied">
                  <Icon name="x" groesse={18} class="sn-f-res" />
                  <Geraet klein icon="router" name="Router" ton="router" />
                </span>
                <span class="sn-weg__glied">
                  <Icon name="x" groesse={18} class="sn-f-res" />
                  <Geraet klein icon="globe" name="Internet" ton="fremd" />
                </span>
              </div>
              <Raten
                frage="Kann man mit einer fe80-Adresse eine Webseite im Internet erreichen?"
                optionen={['ja', 'nein']}
                richtig="nein"
                hinweis={() => 'Der Weg ins Internet führt über einen Router – und der leitet fe80 nicht weiter.'}
              >
                <Absatz>
                  Für das Internet braucht ein Gerät zusätzlich eine <strong>globale</strong> IPv6-Adresse (meist beginnend mit 2 oder 3, z. B. 2001:…). Die meisten Geräte haben
                  beide.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Woran du sie erkennst',
          inhalt: (
            <>
              <Absatz>
                Verbindungslokale Adressen liegen im Bereich <strong class="mono">fe80::/10</strong>; in der Praxis beginnen sie mit <strong class="mono">fe80</strong>. In ipconfig
                stehen sie in einer eigenen Zeile – das <span class="mono">%12</span> dahinter ist nur die Nummer der Schnittstelle und gehört nicht zur Adresse:
              </Absatz>
              <Konsole
                titel="ipconfig"
                zeilen={[
                  '   IPv6-Adresse. . . . . . . . . . . : 2001:db8:abcd:12::5',
                  { text: '   Verbindungslokale IPv6-Adresse  . : fe80::1a2b:3cff:fe4d:5e6f%12', hervor: true },
                ]}
              />
            </>
          ),
        },
        {
          titel: 'Nicht verwechseln mit 169.254',
          inhalt: (
            <div class="lw-tabelle-huelle">
              <table class="lw-tabelle">
                <thead>
                  <tr>
                    <th />
                    <th>IPv4 169.254.x.x</th>
                    <th>IPv6 fe80::…</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>wann?</td>
                    <td>nur wenn kein DHCP-Server antwortet</td>
                    <td>immer, bei jedem IPv6-Gerät</td>
                  </tr>
                  <tr>
                    <td>bedeutet</td>
                    <td>Problem – Fehlersuche nötig (Lektion 17)</td>
                    <td>Normalfall</td>
                  </tr>
                  <tr>
                    <td>gemeinsam</td>
                    <td colSpan={2}>vom Gerät selbst gegeben, nur im lokalen Netzabschnitt gültig</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ),
        },
        {
          titel: 'Eine echte Prüfungsaufgabe',
          inhalt: (
            <>
              <Absatz>
                So war es 2024 gefragt: Zu <strong class="mono">fe80::1a2b:3cff:fe4d:5e6f/64</strong> waren Länge, ungekürzte Schreibweise, Präfixlänge und Interface-Identifier
                anzugeben. Mit Block 5 kannst du alles:
              </Absatz>
              <div class="sn-kuerzen">
                <span class="sn-kuerzen__name">Länge</span>
                <span class="sn-kuerzen__wert mono">128 Bit</span>
                <span class="sn-kuerzen__name">ungekürzt</span>
                <span class="sn-kuerzen__wert mono">fe80:0000:0000:0000:1a2b:3cff:fe4d:5e6f</span>
                <span class="sn-kuerzen__name">Präfixlänge</span>
                <span class="sn-kuerzen__wert mono sn-f-netz">64 (Präfix fe80::/64)</span>
                <span class="sn-kuerzen__name">Interface-ID</span>
                <span class="sn-kuerzen__wert mono sn-f-host">1a2b:3cff:fe4d:5e6f</span>
                <span class="sn-kuerzen__name">Art</span>
                <span class="sn-kuerzen__wert">beginnt mit fe80 → verbindungslokal</span>
              </div>
            </>
          ),
        },
      ]}
    />
  );
}

const ARTEN = {
  'link-local': { text: 'verbindungslokal (fe80::/10) – nur im lokalen Netzabschnitt', ton: 'gut', icon: 'house' },
  global: { text: 'global (beginnt mit 2 oder 3) – im Internet erreichbar', ton: '', icon: 'globe' },
  loopback: { text: 'Loopback ::1 – das eigene Gerät (wie 127.0.0.1 bei IPv4)', ton: '', icon: 'refresh-cw' },
  andere: { text: 'eine andere Adressart – für die AP1 nicht wichtig', ton: '', icon: 'info' },
};

function LinkLocalAusprobieren() {
  const [text, setText] = useState('fe80::1a2b:3cff:fe4d:5e6f');
  const art = ipv6Art(text);
  const voll = ipv6Voll(text);
  return (
    <Werkbank>
      <p class="lw-aufgabe">Welche Art von Adresse ist das? Probier verschiedene aus.</p>
      <label class="lw-feld lw-feld--breit">
        <span class="lw-feld__name">IPv6-Adresse</span>
        <input
          class={`feld feld--mono lw-feld__eingabe ${voll ? 'feld--richtig' : 'feld--falsch'}`}
          value={text}
          spellcheck={false}
          onInput={(e) => setText(e.currentTarget.value)}
        />
      </label>
      <Beispiele liste={['fe80::1a2b:3cff:fe4d:5e6f', 'fe80::1', '2001:db8:abcd:12::5', '2a02:8108::1', '::1']} aktiv={text} onWahl={setText} />
      {voll ? (
        <>
          <Bloecke voll={voll} praefix={64} nummern={false} />
          <Hinweis ton={ARTEN[art].ton} icon={ARTEN[art].icon}>
            <strong>{ARTEN[art].text}</strong>
          </Hinweis>
        </>
      ) : (
        <Hinweis ton="fehler" icon="circle-x">
          Keine gültige IPv6-Adresse.
        </Hinweis>
      )}
    </Werkbank>
  );
}

export const IPV6 = {
  ipv6: { Erklaerung: Ipv6Erklaerung, Ausprobieren: Ipv6Ausprobieren },
  'ipv6-kurz': { Erklaerung: KurzErklaerung, Ausprobieren: KurzAusprobieren },
  'ipv6-praefix': { Erklaerung: PraefixV6Erklaerung, Ausprobieren: PraefixV6Ausprobieren },
  'link-local': { Erklaerung: LinkLocalErklaerung, Ausprobieren: LinkLocalAusprobieren },
};
