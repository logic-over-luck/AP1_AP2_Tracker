// Block 4 – Im lokalen Netz: Hexadezimalzahl, MAC-Adresse, ARP.

import { useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../../../ui/bausteine.jsx';
import { gleichesNetz, leseMac } from '../../ip.js';
import { Schritte, Raten, Absatz, Fakten, Fakt, Formel, Hinweis, Netz, Host, Konsole, Geraet, Stellen, BitTafel, Werkbank, Beispiele, OktettBits } from '../bausteine.jsx';

const HEX = '0123456789ABCDEF';

// ---------- 19 Hexadezimalzahl ----------

function HexErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Lange Bitketten',
          inhalt: (
            <>
              <Absatz>
                Gleich kommen Adressen mit 48 Bit (MAC-Adresse) und 128 Bit (IPv6). Binär geschrieben wären sie endlos lang. Dezimal passt schlecht zu Bits – man sieht der Zahl 200
                nicht an, welche Bits gesetzt sind. Die Lösung ist ein Zahlensystem, bei dem <strong>eine Ziffer genau 4 Bit</strong> entspricht: das{' '}
                <strong>Hexadezimalsystem</strong>.
              </Absatz>
              <div class="sn-vergleich-zeilen mono">
                <span class="sn-beschrift">binär</span>
                <span>000000000001101000101011001111000100110101011110</span>
                <span class="sn-beschrift">hexadezimal</span>
                <span class="sn-f-netz">00:1A:2B:3C:4D:5E</span>
              </div>
              <span class="sn-beschrift">Beides ist dieselbe MAC-Adresse.</span>
            </>
          ),
        },
        {
          titel: 'Basis 16: Ziffern 0 bis 9 und A bis F',
          inhalt: (
            <>
              <Absatz>
                Im Zehnersystem gibt es 10 Ziffern, im Binärsystem 2 – im Hexadezimalsystem (kurz Hex) <strong>16</strong>. Für die Werte 10 bis 15 nimmt man Buchstaben: A = 10, B
                = 11 … F = 15.
              </Absatz>
              <div class="sn-hextafel">
                {Array.from({ length: 16 }, (_, i) => (
                  <span key={i} class={`sn-hextafel__zelle ${i >= 10 ? 'sn-hextafel__zelle--buchstabe' : ''}`}>
                    <strong class="mono">{HEX[i]}</strong>
                    <span class="mono">{i.toString(2).padStart(4, '0')}</span>
                    <span>= {i}</span>
                  </span>
                ))}
              </div>
            </>
          ),
        },
        {
          titel: 'Eine Hex-Ziffer = 4 Bit',
          inhalt: (
            <>
              <Absatz>
                Die Tabelle zeigt: Für die 16 Werte 0 bis 15 braucht man genau <strong>4 Bit</strong> (0000 bis 1111, 2<sup>4</sup> = 16). Jede Hex-Ziffer steht also für ein
                4er-Päckchen Bits – man kann sie direkt ineinander übersetzen.
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
          titel: 'Ein Byte = zwei Hex-Ziffern',
          inhalt: (
            <>
              <Absatz>
                Ein Byte (8 Bit) teilt man in zwei Hälften zu je 4 Bit – jede Hälfte wird eine Hex-Ziffer. So wird jedes Byte zu <strong>genau zwei Hex-Ziffern</strong>, von 00 bis
                FF.
              </Absatz>
              <div class="sn-nibbles">
                <span class="sn-nibbles__haelfte">
                  <span class="mono">1100</span>
                  <strong class="mono">C</strong>
                </span>
                <span class="sn-nibbles__haelfte">
                  <span class="mono">1000</span>
                  <strong class="mono">8</strong>
                </span>
                <span class="sn-nibbles__gleich mono">= C8</span>
              </div>
              <Absatz>Und zurück ins Dezimale: Die linke Ziffer zählt 16-fach (Stellenwerte 16 und 1):</Absatz>
              <Stellen werte={[16, 1]} ziffern={['C', 8]} an={[true, true]} summe="= 12 · 16 + 8 · 1 = 200" />
              <Fakten>
                <Fakt titel="00 bis FF">Ein Byte geht von 00 (= 0) bis FF (= 15 · 16 + 15 = 255) – genau wie ein Oktett von 0 bis 255.</Fakt>
                <Fakt titel="Groß oder klein">C8 und c8 sind dasselbe. MAC-Adressen sieht man oft groß, IPv6-Adressen meist klein.</Fakt>
              </Fakten>
            </>
          ),
        },
      ]}
    />
  );
}

function HexAusprobieren() {
  const [wert, setWert] = useState(200);
  const [text, setText] = useState('C8');
  const setzeHex = (t) => {
    setText(t);
    if (/^[0-9a-f]{1,2}$/i.test(t.trim())) setWert(parseInt(t.trim(), 16));
  };
  return (
    <Werkbank>
      <p class="sn-aufgabe">Schalte Bits um – oder tippe eine zweistellige Hex-Zahl ein.</p>
      <BitTafel
        wert={wert}
        onWert={(w) => {
          setWert(w);
          setText(w.toString(16).toUpperCase().padStart(2, '0'));
        }}
        nibbles
      />
      <label class="sn-feld">
        <span class="sn-feld__name">Hex</span>
        <input
          class={`feld feld--mono sn-feld__eingabe ${/^[0-9a-f]{1,2}$/i.test(text.trim()) ? '' : 'feld--falsch'}`}
          value={text}
          maxLength={2}
          spellcheck={false}
          onInput={(e) => setzeHex(e.currentTarget.value)}
        />
      </label>
      <Beispiele liste={['FF', '00', 'A0', '1A', 'C0', '7F']} aktiv={text.toUpperCase()} onWahl={setzeHex} />
    </Werkbank>
  );
}

// ---------- 20 MAC-Adresse ----------

function MacBild({ bytes }) {
  return (
    <div class="sn-mac">
      {bytes.map((b, i) => (
        <span key={i} class={`sn-mac__byte ${i < 3 ? 'sn-mac__byte--hersteller' : 'sn-mac__byte--geraet'}`}>
          <strong class="mono">{b}</strong>
          <OktettBits wert={parseInt(b, 16)} />
          <span class="sn-mac__nr">Byte {i + 1}</span>
        </span>
      ))}
      <span class="sn-mac__teil sn-mac__teil--hersteller">Herstellerkennung (3 Bytes)</span>
      <span class="sn-mac__teil sn-mac__teil--geraet">vom Hersteller fortlaufend vergeben (3 Bytes)</span>
    </div>
  );
}

function MacErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Die Adresse ab Werk',
          inhalt: (
            <>
              <Absatz>
                Jede Netzwerkschnittstelle – die Netzwerkkarte im PC, der WLAN-Chip im Laptop, der Anschluss am Drucker – bekommt schon bei der Herstellung eine feste Adresse: die{' '}
                <strong>MAC-Adresse</strong> (Media Access Control). Sie ist in der Regel weltweit eindeutig. Oft steht sie sogar auf einem Aufkleber am Gerät.
              </Absatz>
              <div class="sn-aufkleber">
                <Icon name="cable" groesse={20} />
                <span>
                  Netzwerkkarte · <span class="mono">MAC 00:1A:2B:3C:4D:5E</span>
                </span>
              </div>
            </>
          ),
        },
        {
          titel: 'Aufbau: sechs Bytes in Hex',
          inhalt: (
            <>
              <Absatz>
                Eine MAC-Adresse ist <strong>48 Bit</strong> lang. Man schreibt sie als <strong>sechs Bytes</strong>, jedes mit zwei Hex-Ziffern (Lektion 19), getrennt durch
                Doppelpunkt oder Bindestrich (Windows).
              </Absatz>
              <MacBild bytes={['00', '1A', '2B', '3C', '4D', '5E']} />
              <Raten
                frage="Wie viele Hex-Ziffern hat eine MAC-Adresse insgesamt?"
                optionen={[6, 12, 16, 48]}
                richtig={12}
                hinweis={(v) =>
                  v === 6 ? '6 ist die Zahl der Bytes – jedes hat zwei Ziffern.' : v === 48 ? '48 ist die Zahl der Bits. Eine Hex-Ziffer fasst 4 Bit.' : '6 Bytes × 2 Ziffern.'
                }
              >
                <Formel>
                  6 Bytes × 2 Hex-Ziffern = 12 Ziffern · 12 × 4 Bit = <strong>48 Bit</strong>
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Zwei Hälften',
          inhalt: (
            <Fakten>
              <Fakt titel="Vordere Hälfte: Herstellerkennung" icon="award">
                Die ersten drei Bytes (hier 00:1A:2B) bekommt jeder Hersteller fest zugeteilt (OUI, Organizationally Unique Identifier). Daran erkennt man, wer die Schnittstelle
                gebaut hat.
              </Fakt>
              <Fakt titel="Hintere Hälfte: Gerätenummer" icon="hash">
                Die letzten drei Bytes (hier 3C:4D:5E) vergibt der Hersteller selbst, fortlaufend für jedes Gerät.
              </Fakt>
            </Fakten>
          ),
        },
        {
          titel: 'IP-Adresse und MAC-Adresse',
          inhalt: (
            <>
              <Absatz>
                Ein Gerät hat also zwei Adressen. Vergleich mit der Post: Die <strong>IP-Adresse</strong> ist wie die Wohnanschrift – sie hängt davon ab, wo das Gerät gerade ist,
                und ändert sich beim „Umzug“ in ein anderes Netz. Die <strong>MAC-Adresse</strong> ist wie eine Seriennummer – sie bleibt immer gleich.
              </Absatz>
              <div class="sn-tabelle-huelle">
                <table class="sn-tabelle">
                  <thead>
                    <tr>
                      <th />
                      <th>IP-Adresse (IPv4)</th>
                      <th>MAC-Adresse</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Art</td>
                      <td>logisch</td>
                      <td>physisch (Hardware-Adresse)</td>
                    </tr>
                    <tr>
                      <td>vergeben von</td>
                      <td>Admin oder DHCP-Server</td>
                      <td>Hersteller</td>
                    </tr>
                    <tr>
                      <td>Länge</td>
                      <td>32 Bit, dezimal mit Punkten</td>
                      <td>48 Bit, hexadezimal mit : oder -</td>
                    </tr>
                    <tr>
                      <td>im anderen Netz</td>
                      <td>ändert sich</td>
                      <td>bleibt gleich</td>
                    </tr>
                    <tr>
                      <td>wofür</td>
                      <td>Weg über Netze hinweg</td>
                      <td>Zustellung im lokalen Netz</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ),
        },
        {
          titel: 'MAC-Adresse herausfinden',
          inhalt: (
            <>
              <Absatz>
                Unter Windows zeigt <code>ipconfig /all</code> die MAC-Adresse als „Physische Adresse“ (auch <code>getmac</code>). Unter Linux: <code>ip link</code> (früher{' '}
                <code>ifconfig</code>).
              </Absatz>
              <Konsole
                titel="ipconfig /all"
                zeilen={[
                  'Ethernet-Adapter Ethernet:',
                  '   Beschreibung. . . . . . . . . . . : Intel(R) Ethernet Connection',
                  { text: '   Physische Adresse . . . . . . . . : 00-1A-2B-3C-4D-5E', hervor: true },
                  '   DHCP aktiviert. . . . . . . . . . : Ja',
                  '   IPv4-Adresse  . . . . . . . . . . : 192.168.1.10',
                ]}
              />
              <Konsole
                titel="ip link (Linux)"
                zeilen={['2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500', { text: '    link/ether 00:1a:2b:3c:4d:5e brd ff:ff:ff:ff:ff:ff', hervor: true }]}
              />
            </>
          ),
        },
      ]}
    />
  );
}

function macFehler(text) {
  const s = String(text ?? '').trim();
  if (!s) return 'Noch leer.';
  const teile = s.split(/[:-]/);
  if (teile.length !== 6) return `${teile.length} ${teile.length === 1 ? 'Teil' : 'Teile'} statt 6 – eine MAC-Adresse hat sechs Bytes.`;
  const falsch = teile.findIndex((t) => !/^[0-9a-f]{2}$/i.test(t));
  if (falsch !== -1) return `Byte ${falsch + 1} („${teile[falsch]}“) ist keine zweistellige Hex-Zahl (0–9, A–F).`;
  return 'Trennzeichen bitte einheitlich: nur : oder nur -.';
}

function MacAusprobieren() {
  const [text, setText] = useState('3C-52-82-11-AA-07');
  const bytes = leseMac(text);
  return (
    <Werkbank>
      <p class="sn-aufgabe">Gib eine MAC-Adresse ein – oder probier die Beispiele, auch die falschen.</p>
      <label class="sn-feld sn-feld--breit">
        <span class="sn-feld__name">MAC-Adresse</span>
        <input
          class={`feld feld--mono sn-feld__eingabe ${bytes ? 'feld--richtig' : 'feld--falsch'}`}
          value={text}
          spellcheck={false}
          onInput={(e) => setText(e.currentTarget.value)}
        />
      </label>
      <Beispiele liste={['00:1A:2B:3C:4D:5E', '3C-52-82-11-AA-07', 'ff:ff:ff:ff:ff:ff', '00:1A:2B:3C:4D', '00:1G:2B:3C:4D:5E', '192.168.1.10']} aktiv={text} onWahl={setText} />
      {bytes ? (
        <>
          <MacBild bytes={bytes} />
          <Hinweis ton="gut" icon="circle-check">
            Gültig: 6 Bytes · 12 Hex-Ziffern · 48 Bit. Herstellerkennung <span class="mono">{bytes.slice(0, 3).join(':')}</span>
            {bytes.every((b) => b === 'FF') && ' – FF:FF:FF:FF:FF:FF ist die Broadcast-MAC-Adresse: „an alle“ (kommt bei ARP vor).'}
          </Hinweis>
        </>
      ) : (
        <Hinweis ton="fehler" icon="circle-x">
          {macFehler(text)}
        </Hinweis>
      )}
    </Werkbank>
  );
}

// ---------- 21 ARP ----------

function ArpErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Zwei Adressen, eine Lücke',
          inhalt: (
            <>
              <Absatz>
                Im lokalen Netz werden Daten an die <strong>MAC-Adresse</strong> zugestellt: Jede Netzwerkkarte nimmt nur Pakete an, auf denen ihre eigene MAC-Adresse (oder die
                Broadcast-MAC) steht. Der PC kennt vom Ziel aber nur die <strong>IP-Adresse</strong> – die hat der Nutzer eingegeben oder der DNS-Server geliefert.
              </Absatz>
              <div class="sn-luecke">
                <span>
                  bekannt: <strong class="mono">IP 192.168.1.20</strong>
                </span>
                <Icon name="arrow-right" groesse={18} />
                <span>
                  gesucht: <strong class="mono">MAC ??-??-??-??-??-??</strong>
                </span>
              </div>
              <Absatz>
                Diese Lücke schließt <strong>ARP</strong> (Address Resolution Protocol, „Adressauflösung“).
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Die ARP-Anfrage: ein Rundruf',
          inhalt: (
            <>
              <Absatz>
                Der PC weiß nicht, welches Gerät die Adresse hat. Also fragt er <strong>alle</strong> im lokalen Netz – per Broadcast an die MAC-Adresse FF-FF-FF-FF-FF-FF:
              </Absatz>
              <div class="sn-arp-bild">
                <Geraet klein icon="monitor" name="PC-A" ip=".10" ton="aktiv" />
                <div class="sn-arp-bild__ruf">
                  <span class="sn-arp-bild__blase">„Wer hat 192.168.1.20? Antwort an 192.168.1.10.“</span>
                  <span class="sn-beschrift">an alle (Broadcast)</span>
                </div>
                <div class="sn-arp-bild__alle">
                  <Geraet klein icon="monitor" name="PC-B" ip=".20" />
                  <Geraet klein icon="printer" name="Drucker" ip=".30" />
                  <Geraet klein icon="router" name="Router" ip=".1" ton="router" />
                </div>
              </div>
              <Raten
                frage="Wer antwortet auf diese Anfrage?"
                optionen={['alle Geräte', 'nur das Gerät mit 192.168.1.20', 'der Router', 'niemand']}
                richtig="nur das Gerät mit 192.168.1.20"
                hinweis={() => 'Alle hören die Frage – aber gefragt ist nur nach einer bestimmten IP-Adresse.'}
              >
                <Absatz>Alle hören die Frage, aber nur PC-B erkennt seine eigene IP-Adresse und antwortet – direkt an PC-A, nicht an alle.</Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die Antwort und der ARP-Cache',
          inhalt: (
            <>
              <div class="sn-arp-bild">
                <Geraet klein icon="monitor" name="PC-B" ip=".20" ton="netz" />
                <div class="sn-arp-bild__ruf">
                  <span class="sn-arp-bild__blase sn-arp-bild__blase--antwort">„192.168.1.20 ist bei 3c-52-82-11-aa-07.“</span>
                  <span class="sn-beschrift">direkt an PC-A</span>
                </div>
                <Geraet klein icon="monitor" name="PC-A" ip=".10" ton="aktiv" />
              </div>
              <Absatz>
                PC-A speichert die Zuordnung im <strong>ARP-Cache</strong> (Zwischenspeicher). Beim nächsten Paket an .20 muss er nicht mehr fragen. Nach einiger Zeit ohne Verkehr
                wird der Eintrag wieder gelöscht.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'arp -a lesen',
          inhalt: (
            <>
              <Absatz>
                Der Befehl <code>arp -a</code> zeigt den ARP-Cache. Genau so eine Ausgabe war in der Prüfung zu deuten:
              </Absatz>
              <Konsole
                titel="arp -a"
                zeilen={[
                  'Schnittstelle: 192.168.1.10 --- 0x5',
                  '  Internetadresse       Physische Adresse     Typ',
                  { text: '  192.168.1.1           00-1a-2b-3c-4d-5e     dynamisch', hervor: true },
                  '  192.168.1.20          3c-52-82-11-aa-07     dynamisch',
                  '  192.168.1.255         ff-ff-ff-ff-ff-ff     statisch',
                ]}
              />
              <Fakten>
                <Fakt titel="Internetadresse">die IP-Adresse des anderen Geräts</Fakt>
                <Fakt titel="Physische Adresse">seine MAC-Adresse</Fakt>
                <Fakt titel="Typ">
                  <strong>dynamisch</strong> = per ARP gelernt · <strong>statisch</strong> = fest eingetragen (z. B. die Broadcastadresse → ff-ff-ff-ff-ff-ff)
                </Fakt>
              </Fakten>
              <Absatz>Die erste Zeile heißt also: Das Gerät 192.168.1.1 hat die MAC-Adresse 00-1a-2b-3c-4d-5e; der PC hat das per ARP gelernt.</Absatz>
            </>
          ),
        },
        {
          titel: 'Ziel in einem fremden Netz',
          inhalt: (
            <>
              <Absatz>
                ARP funktioniert nur im <strong>lokalen</strong> Netz – Rundrufe gehen nicht über den Router hinaus. Liegt das Ziel woanders, schickt der PC das Paket ja ohnehin
                ans Standardgateway (Lektion 14). Also braucht er dessen MAC-Adresse.
              </Absatz>
              <Raten
                frage="PC-A (192.168.1.10/24) will an 8.8.8.8 senden. Nach welcher IP-Adresse fragt er per ARP?"
                optionen={['8.8.8.8', '192.168.1.1 (Standardgateway)', '192.168.1.255']}
                richtig="192.168.1.1 (Standardgateway)"
                hinweis={(v) => (v === '8.8.8.8' ? '8.8.8.8 liegt in einem anderen Netz – der Rundruf erreicht es nie.' : '.255 ist der Broadcast, kein Gerät.')}
              >
                <Absatz>
                  Darum steht der Router fast immer im ARP-Cache: Jedes Paket ins Internet geht an seine MAC-Adresse. Die IP-Adresse 8.8.8.8 bleibt als Ziel im Paket stehen.
                </Absatz>
              </Raten>
            </>
          ),
        },
      ]}
    />
  );
}

const LAN = [
  { name: 'PC-B', icon: 'monitor', ip: '192.168.1.20', mac: '3c-52-82-11-aa-07' },
  { name: 'Drucker', icon: 'printer', ip: '192.168.1.30', mac: '00-80-77-4a-21-9c' },
  { name: 'Router', icon: 'router', ip: '192.168.1.1', mac: '00-1a-2b-3c-4d-5e' },
];
const FERN = { name: 'Webserver', icon: 'globe', ip: '93.184.216.34' };

function ArpAusprobieren() {
  const [cache, setCache] = useState([]);
  const [verlauf, setVerlauf] = useState(null);
  const sende = (ziel) => {
    const lokal = gleichesNetz('192.168.1.10', ziel.ip, 24);
    const arpZiel = lokal ? ziel : LAN.find((g) => g.name === 'Router');
    const schonDa = cache.some((c) => c.ip === arpZiel.ip);
    setVerlauf({ ziel, lokal, arpZiel, schonDa });
    if (!schonDa) setCache([...cache, arpZiel]);
  };
  return (
    <Werkbank>
      <p class="sn-aufgabe">
        Du bist PC-A (<span class="mono">192.168.1.10/24</span>). Schick Pakete an verschiedene Ziele und beobachte den ARP-Cache.
      </p>
      <div class="sn-beispiele">
        <span class="sn-beispiele__titel">Paket senden an:</span>
        {[...LAN, FERN].map((z) => (
          <button key={z.ip} type="button" class="sn-chip" onClick={() => sende(z)}>
            <Icon name={z.icon} groesse={13} /> &nbsp;{z.name}
          </button>
        ))}
      </div>
      {verlauf && (
        <ol class="sn-ablauf erscheinen" key={`${verlauf.ziel.ip}-${cache.length}`}>
          <li>
            Ziel {verlauf.ziel.ip}:{' '}
            {verlauf.lokal ? (
              <>
                <Netz>im eigenen Netz</Netz> → MAC-Adresse des Ziels nötig.
              </>
            ) : (
              <>
                <Host>fremdes Netz</Host> → Paket geht ans Standardgateway → MAC-Adresse des Routers (192.168.1.1) nötig.
              </>
            )}
          </li>
          {verlauf.schonDa ? (
            <li>
              {verlauf.arpZiel.ip} steht schon im ARP-Cache → <strong>keine Anfrage nötig</strong>, sofort senden.
            </li>
          ) : (
            <>
              <li>
                ARP-Anfrage an alle: „Wer hat <span class="mono">{verlauf.arpZiel.ip}</span>?“
              </li>
              <li>
                Antwort von {verlauf.arpZiel.name}: „<span class="mono">{verlauf.arpZiel.mac}</span>“ → in den ARP-Cache.
              </li>
            </>
          )}
          <li>Paket geht an MAC {verlauf.arpZiel.mac}.</li>
        </ol>
      )}
      <Konsole
        titel="arp -a"
        zeilen={[
          'Schnittstelle: 192.168.1.10 --- 0x5',
          '  Internetadresse       Physische Adresse     Typ',
          ...cache.map((c) => ({ text: `  ${c.ip.padEnd(22)}${c.mac.padEnd(22)}dynamisch`, hervor: verlauf && !verlauf.schonDa && c.ip === verlauf.arpZiel.ip })),
          '  192.168.1.255         ff-ff-ff-ff-ff-ff     statisch',
        ]}
      />
      <Knopf
        variante="geist"
        groesse="s"
        icon="trash"
        onClick={() => {
          setCache([]);
          setVerlauf(null);
        }}
      >
        ARP-Cache leeren
      </Knopf>
    </Werkbank>
  );
}

export const LOKAL = {
  hex: { Erklaerung: HexErklaerung, Ausprobieren: HexAusprobieren },
  mac: { Erklaerung: MacErklaerung, Ausprobieren: MacAusprobieren },
  arp: { Erklaerung: ArpErklaerung, Ausprobieren: ArpAusprobieren },
};
