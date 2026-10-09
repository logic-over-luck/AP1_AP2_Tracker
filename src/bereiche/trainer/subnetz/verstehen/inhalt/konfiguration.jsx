// Block 3 – Einen PC ins Netz bringen: Standardgateway, Private Adressen, IPv4-Konfiguration, DHCP, Statische Adresse.

import { Fragment } from 'preact';
import { useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../../../ui/bausteine.jsx';
import { ipZuZahl, netz, gleichesNetz, istPrivat, leseIp, maske, ipFehler } from '../../ip.js';
import { pruefeStatisch } from '../rechnen.js';
import { Schritte, Raten, Absatz, Fakten, Fakt, Formel, Hinweis, Netz, Res, Konsole, Geraet, Zahlenstrahl, IpFeld, Ergebnis, Werkbank, Beispiele } from '../bausteine.jsx';

// Ein Weg als Kette von Geräten mit Pfeilen
function Weg({ glieder, ton = '' }) {
  return (
    <div class={`sn-weg ${ton ? `sn-weg--${ton}` : ''}`}>
      {glieder.map((g, i) => (
        <span key={i} class="sn-weg__glied">
          {i > 0 && <Icon name="arrow-right" groesse={18} class="sn-weg__pfeil" />}
          <Geraet klein {...g} />
        </span>
      ))}
    </div>
  );
}

// Ein Netz als gestrichelter Kasten mit Titel und Geräten
function NetzKasten({ titel, children, ton = '' }) {
  return (
    <div class={`sn-netzkasten ${ton ? `sn-netzkasten--${ton}` : ''}`}>
      <span class="sn-netzkasten__titel mono">{titel}</span>
      <div class="sn-netzkasten__geraete">{children}</div>
    </div>
  );
}

// ---------- 14 Standardgateway ----------

function GatewayErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Raus aus dem eigenen Netz',
          inhalt: (
            <>
              <Absatz>
                Aus Lektion 11 weißt du: Liegt das Ziel im eigenen Netz, schickt ein Gerät das Paket direkt. Aber was ist mit einem Ziel in einem <strong>anderen Netz</strong> –
                dem Lager nebenan oder einem Server im Internet? Dafür braucht es ein Gerät, das Netze verbindet: einen <strong>Router</strong>.
              </Absatz>
              <div class="sn-zweinetze-router">
                <NetzKasten titel="Büro · 192.168.1.0/24">
                  <Geraet klein icon="monitor" name="PC" ip=".20" />
                  <Geraet klein icon="printer" name="Drucker" ip=".50" />
                </NetzKasten>
                <div class="sn-router">
                  <span class="sn-router__bein mono">192.168.1.1</span>
                  <Geraet icon="router" name="Router" ton="router" />
                  <span class="sn-router__bein mono">192.168.2.1</span>
                </div>
                <NetzKasten titel="Lager · 192.168.2.0/24">
                  <Geraet klein icon="laptop" name="Laptop" ip=".10" />
                  <Geraet klein icon="server" name="Server" ip=".30" />
                </NetzKasten>
              </div>
              <Absatz>
                Ein Router steht mit einem Bein in jedem Netz, das er verbindet – und hat <strong>in jedem dieser Netze eine eigene IP-Adresse</strong>: hier 192.168.1.1 im Büro
                und 192.168.2.1 im Lager. Er nimmt Pakete aus dem einen Netz an und leitet sie anhand der Ziel-IP-Adresse ins andere weiter.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Das Standardgateway',
          inhalt: (
            <>
              <Absatz>
                Damit der PC im Büro weiß, wohin er Pakete für fremde Netze schicken soll, trägt man bei ihm die Adresse des Routers <strong>im eigenen Netz</strong> ein: das{' '}
                <strong>Standardgateway</strong> (Gateway = Tor, Übergang). „Standard“, weil es für <strong>alle</strong> Ziele gilt, die nicht im eigenen Netz liegen.
              </Absatz>
              <Konsole
                titel="ipconfig am PC im Büro"
                zeilen={[
                  '   IPv4-Adresse  . . . . . . . . . . : 192.168.1.20',
                  '   Subnetzmaske  . . . . . . . . . . : 255.255.255.0',
                  { text: '   Standardgateway . . . . . . . . . : 192.168.1.1', hervor: true },
                ]}
              />
              <Absatz>Zu Hause ist das Standardgateway meist dein WLAN-Router – er verbindet dein Heimnetz mit dem Internet.</Absatz>
            </>
          ),
        },
        {
          titel: 'Die Entscheidung vor jedem Paket',
          inhalt: (
            <>
              <div class="sn-entscheid">
                <span class="sn-entscheid__frage">Liegt das Ziel in meinem Netz? (Netzadressen vergleichen, Lektion 11)</span>
                <div class="sn-entscheid__zweige">
                  <div class="sn-entscheid__zweig sn-entscheid__zweig--ja">
                    <strong>Ja</strong> → direkt an das Ziel
                  </div>
                  <div class="sn-entscheid__zweig sn-entscheid__zweig--nein">
                    <strong>Nein</strong> → an das Standardgateway, der Router leitet weiter
                  </div>
                </div>
              </div>
              <Raten
                frage="Der PC (192.168.1.20/24) schickt ein Paket an 8.8.8.8, einen Server im Internet. Wohin geht das Paket zuerst?"
                optionen={['direkt an 8.8.8.8', 'an das Standardgateway 192.168.1.1', 'an alle im Netz']}
                richtig="an das Standardgateway 192.168.1.1"
                hinweis={(v) =>
                  v.startsWith('direkt')
                    ? '8.8.8.8 liegt nicht im Netz 192.168.1.0/24 – direkt kann der PC es nicht erreichen.'
                    : 'Ein Rundruf ist hier nicht nötig – der PC weiß, wohin mit fremden Zielen.'
                }
              >
                <Weg
                  glieder={[
                    { icon: 'monitor', name: 'PC', ip: '192.168.1.20' },
                    { icon: 'router', name: 'Gateway', ip: '192.168.1.1', ton: 'router' },
                    { icon: 'globe', name: 'Server', ip: '8.8.8.8', ton: 'fremd' },
                  ]}
                />
              </Raten>
            </>
          ),
        },
        {
          titel: 'Regeln für das Standardgateway',
          inhalt: (
            <>
              <Fakten>
                <Fakt titel="Im selben Netz" icon="circle-check">
                  Der PC muss das Gateway direkt erreichen können. Liegt es in einem fremden Netz, bräuchte er ja schon ein Gateway, um zum Gateway zu kommen.
                </Fakt>
                <Fakt titel="Ein Host, keine reservierte Adresse" icon="circle-check">
                  Das Gateway ist ein Gerät (der Router) – also nie Netzadresse oder Broadcastadresse.
                </Fakt>
                <Fakt titel="Üblich: erste oder letzte" icon="info">
                  Meist bekommt der Router die erste (z. B. .1) oder die letzte nutzbare Adresse (z. B. .254). Das ist eine Gewohnheit, keine Pflicht.
                </Fakt>
              </Fakten>
              <Raten
                frage="Welches Standardgateway passt zu einem PC mit 172.16.8.100/27 (Netz .96 bis .127)?"
                optionen={['172.16.8.1', '172.16.8.96', '172.16.8.97', '172.16.8.127']}
                richtig="172.16.8.97"
                hinweis={(v) =>
                  v.endsWith('.1') ? '.1 liegt im Netz .0 bis .31 – nicht im Netz des PCs.' : v.endsWith('.96') ? '.96 ist die Netzadresse.' : '.127 ist die Broadcastadresse.'
                }
              >
                <Hinweis ton="gut" icon="circle-check">
                  .97 ist die erste nutzbare Adresse im Netz 172.16.8.96/27 – ein typisches Gateway. (.126, die letzte nutzbare, wäre auch möglich.)
                </Hinweis>
              </Raten>
            </>
          ),
        },
      ]}
    />
  );
}

const ZIELE = [
  { name: 'Drucker', icon: 'printer', ip: '192.168.1.50' },
  { name: 'Server im Lager', icon: 'server', ip: '192.168.2.30' },
  { name: 'Webseite', icon: 'globe', ip: '93.184.216.34' },
  { name: 'Kollegen-PC', icon: 'monitor', ip: '192.168.1.201' },
];

function GatewayAusprobieren() {
  const [praefix, setPraefix] = useState(24);
  const [ziel, setZiel] = useState(ZIELE[0].ip);
  const pc = '192.168.1.20';
  const gw = '192.168.1.1';
  const direkt = gleichesNetz(pc, ziel, praefix);
  const z = ZIELE.find((x) => x.ip === ziel) ?? { name: 'Ziel', icon: 'globe', ip: ziel };
  return (
    <Werkbank
      leiste={
        <>
          <span class="lw-feld">
            <span class="lw-feld__name">PC</span>
            <strong class="mono">
              {pc}/{praefix}
            </strong>
            <span class="sn-beschrift">Gateway {gw}</span>
          </span>
          <span class="lw-feld">
            <span class="lw-feld__name">Präfix des Netzes</span>
            <span class="lw-beispiele">
              {[24, 25, 16].map((p) => (
                <button key={p} type="button" class={`lw-chip mono ${p === praefix ? 'lw-chip--aktiv' : ''}`} onClick={() => setPraefix(p)}>
                  /{p}
                </button>
              ))}
            </span>
          </span>
          <IpFeld ip={ziel} onIp={setZiel} label="Ziel" />
        </>
      }
    >
      <Beispiele titel="Ziel wählen:" liste={ZIELE.map((x) => ({ wert: x.ip, text: x.name }))} aktiv={ziel} onWahl={setZiel} />
      <Ergebnis
        zeilen={[
          { name: 'Netz des PCs', wert: `${netz(pc, praefix).netz}/${praefix}`, ton: 'netz' },
          { name: 'Netz des Ziels', wert: `${netz(ziel, praefix).netz}/${praefix}`, ton: direkt ? 'netz' : 'fehler' },
        ]}
      />
      <Weg
        ton={direkt ? 'direkt' : 'gateway'}
        glieder={
          direkt
            ? [
                { icon: 'monitor', name: 'PC', ip: pc },
                { ...z, ip: ziel, ton: 'netz' },
              ]
            : [
                { icon: 'monitor', name: 'PC', ip: pc },
                { icon: 'router', name: 'Gateway', ip: gw, ton: 'router' },
                { ...z, ip: ziel, ton: 'fremd' },
              ]
        }
      />
      <Hinweis ton={direkt ? 'gut' : ''} icon={direkt ? 'circle-check' : 'router'}>
        {direkt ? 'Gleiche Netzadresse – der PC schickt das Paket direkt.' : 'Andere Netzadresse – das Paket geht ans Standardgateway, der Router leitet es weiter.'}
        {praefix === 16 && ' Bei /16 gehört auch 192.168.2.30 zum eigenen Netz – das Netz ist viel größer.'}
      </Hinweis>
    </Werkbank>
  );
}

// ---------- 15 Private Adressen ----------

const BEREICHE = [
  { netz: '10.0.0.0/8', von: '10.0.0.0', bis: '10.255.255.255', typisch: 'große Firmennetze', adressen: '16,7 Mio.' },
  { netz: '172.16.0.0/12', von: '172.16.0.0', bis: '172.31.255.255', typisch: 'mittlere Netze', adressen: '1 Mio.' },
  { netz: '192.168.0.0/16', von: '192.168.0.0', bis: '192.168.255.255', typisch: 'Heimnetze, kleine Firmen', adressen: '65.536' },
];

function PrivatErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Zu wenige Adressen',
          inhalt: (
            <>
              <Absatz>
                IPv4 hat nur rund 4,3 Milliarden Adressen (Lektion 1). Bekäme jedes Gerät jedes Haushalts und jeder Firma eine eigene, weltweit eindeutige Adresse, wären sie längst
                aufgebraucht. Die Lösung: Drei Bereiche wurden für <strong>interne Netze</strong> reserviert. Jeder darf sie in seinem eigenen Netz benutzen – ohne zu fragen.
              </Absatz>
              <Fakten>
                <Fakt titel="Privat" icon="house">
                  Frei für jedes lokale Netz. Tausende Heimnetze nutzen gleichzeitig 192.168.178.x – das stört niemanden, weil diese Adressen das eigene Netz nie verlassen.
                </Fakt>
                <Fakt titel="Öffentlich" icon="globe">
                  Alle anderen Adressen. Sie sind weltweit eindeutig und werden im Internet weitergeleitet, z. B. die Adresse eines Webservers.
                </Fakt>
              </Fakten>
            </>
          ),
        },
        {
          titel: 'Die drei privaten Bereiche',
          inhalt: (
            <div class="lw-tabelle-huelle">
              <table class="lw-tabelle">
                <thead>
                  <tr>
                    <th>Bereich</th>
                    <th>von – bis</th>
                    <th>Adressen</th>
                    <th class="lw-tabelle__extra">typisch für</th>
                  </tr>
                </thead>
                <tbody>
                  {BEREICHE.map((b) => (
                    <tr key={b.netz}>
                      <td class="mono">
                        <strong>{b.netz}</strong>
                      </td>
                      <td class="mono">
                        {b.von} – {b.bis}
                      </td>
                      <td class="mono">{b.adressen}</td>
                      <td class="lw-tabelle__extra">{b.typisch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          titel: 'Warum 172.16 bis 172.31?',
          inhalt: (
            <>
              <Absatz>
                Die ersten und letzten Bereiche erkennst du sofort (alles mit 10 am Anfang, alles mit 192.168). Beim mittleren hilft Lektion 12: /12 heißt 8 + 4 – die Grenze liegt
                im <strong>2. Oktett</strong>, dort 4 Netzbits. Subnetzmaske 255.<strong>240</strong>.0.0, Blockgröße im 2. Oktett 256 − 240 = <strong>16</strong>. Der Block, der
                bei 16 beginnt, geht bis 31:
              </Absatz>
              <Zahlenstrahl block={16} werte={[16]} aktiv={[16]} beschriftung={['172.16']} />
              <Raten
                frage="Ist 172.32.0.1 eine private Adresse?"
                optionen={['ja', 'nein']}
                richtig="nein"
                hinweis={() => '32 liegt schon im nächsten Block (32–47) des 2. Oktetts.'}
              >
                <Formel>172.16 … 172.31 privat · 172.15 und 172.32 öffentlich</Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Wie kommen private Adressen ins Internet?',
          inhalt: (
            <>
              <Absatz>
                Gar nicht direkt – im Internet werden private Adressen nicht weitergeleitet. Der Router hat neben seiner privaten Adresse eine <strong>öffentliche</strong>. Schickt
                ein PC ein Paket ins Internet, ersetzt der Router die private Absenderadresse durch seine öffentliche und merkt sich, wem die Antwort gehört (das heißt NAT, Network
                Address Translation).
              </Absatz>
              <Weg
                glieder={[
                  { icon: 'laptop', name: 'Laptop', ip: '192.168.178.20', ton: 'netz' },
                  { icon: 'router', name: 'Router', ip: '85.10.20.30', ton: 'router' },
                  { icon: 'globe', name: 'Webserver', ip: '93.184.216.34', ton: 'fremd' },
                ]}
              />
              <span class="sn-beschrift">Der Webserver sieht nur die öffentliche Adresse 85.10.20.30.</span>
            </>
          ),
        },
        {
          titel: 'Typische Fallen',
          inhalt: (
            <Fakten>
              <Fakt titel="172.15.x.x / 172.32.x.x">Knapp daneben – öffentlich. Nur 172.16 bis 172.31.</Fakt>
              <Fakt titel="192.169.x.x">Öffentlich. Privat ist nur 192.168.</Fakt>
              <Fakt titel="10.x.x.x">Immer privat, egal was dahinter steht.</Fakt>
              <Fakt titel="169.254.x.x">Kein privater Bereich im Sinne der Liste, sondern ein Notfall-Bereich – den lernst du in Lektion 17 kennen.</Fakt>
            </Fakten>
          ),
        },
      ]}
    />
  );
}

function PrivatAusprobieren() {
  const [ip, setIp] = useState('172.20.5.1');
  const bereich = istPrivat(ip);
  const [a, b] = ip.split('.').map(Number);
  const erklaerung = bereich
    ? a === 10
      ? 'Beginnt mit 10 – der ganze Bereich 10.0.0.0/8 ist privat.'
      : a === 172
        ? `2. Oktett ${b} liegt zwischen 16 und 31.`
        : 'Beginnt mit 192.168.'
    : a === 172
      ? `2. Oktett ${b} liegt nicht zwischen 16 und 31.`
      : a === 192
        ? '192 – aber nicht 192.168.'
        : a === 169 && b === 254
          ? '169.254 ist der Notfall-Bereich ohne DHCP (Lektion 17) – kein privater Bereich.'
          : 'Kein privater Bereich beginnt so.';
  return (
    <Werkbank leiste={<IpFeld ip={ip} onIp={setIp} />}>
      <Beispiele liste={['10.200.3.4', '172.15.1.1', '172.16.0.1', '172.31.255.1', '172.32.0.1', '192.168.178.20', '192.169.1.1', '8.8.8.8']} aktiv={ip} onWahl={setIp} />
      {a === 172 && <Zahlenstrahl block={16} werte={[b]} aktiv={[16]} beschriftung={[`172.${b}`]} lupe={false} />}
      <Hinweis ton={bereich ? 'gut' : 'fehler'} icon={bereich ? 'house' : 'globe'}>
        <strong>{bereich ? `Privat (${bereich})` : 'Öffentlich'}</strong> – {erklaerung}
      </Hinweis>
    </Werkbank>
  );
}

// ---------- 16 IPv4-Konfiguration ----------

function Dialog({ werte, hervor = null, automatisch = false }) {
  const felder = [
    ['ip', 'IP-Adresse:'],
    ['maske', 'Subnetzmaske:'],
    ['gw', 'Standardgateway:'],
    ['dns', 'Bevorzugter DNS-Server:'],
  ];
  return (
    <div class="sn-dialog" aria-label="IPv4-Einstellungen">
      <span class="sn-dialog__titel">Eigenschaften von Internetprotokoll, Version 4 (TCP/IPv4)</span>
      <span class="sn-dialog__wahl">
        <span class={`sn-dialog__radio ${automatisch ? 'sn-dialog__radio--an' : ''}`} /> IP-Adresse automatisch beziehen
      </span>
      <span class="sn-dialog__wahl">
        <span class={`sn-dialog__radio ${!automatisch ? 'sn-dialog__radio--an' : ''}`} /> Folgende IP-Adresse verwenden:
      </span>
      {felder.map(([id, name]) => (
        <Fragment key={id}>
          <span class="sn-dialog__name">{name}</span>
          <span class={`sn-dialog__feld mono ${hervor === id ? 'sn-dialog__feld--hervor' : ''} ${automatisch ? 'sn-dialog__feld--aus' : ''}`}>{automatisch ? '' : werte[id]}</span>
        </Fragment>
      ))}
    </div>
  );
}

function KonfigErklaerung() {
  const werte = { ip: '192.168.20.57', maske: '255.255.255.0', gw: '192.168.20.1', dns: '192.168.20.1' };
  return (
    <Schritte
      schritte={[
        {
          titel: 'Die Eingabemaske',
          inhalt: (
            <>
              <Absatz>
                So sieht die IPv4-Einstellung unter Windows aus – und genau so eine Maske war in der Prüfung auszufüllen. Wählt man „Folgende IP-Adresse verwenden“, trägt man{' '}
                <strong>vier Werte</strong> ein:
              </Absatz>
              <Dialog werte={werte} />
            </>
          ),
        },
        {
          titel: 'Was jeder Eintrag bewirkt',
          inhalt: (
            <div class="lw-tabelle-huelle">
              <table class="lw-tabelle">
                <thead>
                  <tr>
                    <th>Eintrag</th>
                    <th>beantwortet die Frage …</th>
                    <th>kennst du aus</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>IP-Adresse</strong>
                    </td>
                    <td>Wer bin ich im Netz?</td>
                    <td>Lektion 1</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Subnetzmaske</strong>
                    </td>
                    <td>Wie groß ist mein Netz – wen erreiche ich direkt?</td>
                    <td>Lektion 5, 11</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Standardgateway</strong>
                    </td>
                    <td>Wohin mit Paketen für fremde Netze?</td>
                    <td>Lektion 14</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>DNS-Server</strong>
                    </td>
                    <td>Wer übersetzt Namen in IP-Adressen?</td>
                    <td>neu – nächster Schritt</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ),
        },
        {
          titel: 'Der DNS-Server – das Telefonbuch',
          inhalt: (
            <>
              <Absatz>
                Menschen merken sich Namen wie <strong>www.beispiel.de</strong>, Computer brauchen IP-Adressen. Der <strong>DNS-Server</strong> (DNS = Domain Name System)
                übersetzt: Der PC fragt „Welche Adresse hat www.beispiel.de?“ und bekommt z. B. 93.184.216.34 zurück. Erst dann kann er die Webseite abrufen.
              </Absatz>
              <Weg
                glieder={[
                  { icon: 'monitor', name: 'PC fragt', ip: 'www.beispiel.de?' },
                  { icon: 'server', name: 'DNS-Server', ip: '192.168.20.1', ton: 'router' },
                  { icon: 'globe', name: 'Antwort', ip: '93.184.216.34', ton: 'netz' },
                ]}
              />
              <Raten
                frage="Der DNS-Eintrag ist falsch, alles andere stimmt. Was geht dann nicht mehr?"
                optionen={['gar nichts mehr', 'Webseiten über ihren Namen aufrufen', 'Drucken im eigenen Netz', 'ping auf 8.8.8.8']}
                richtig="Webseiten über ihren Namen aufrufen"
                hinweis={() => 'Der DNS-Server übersetzt nur Namen. Was ohne Namen auskommt, funktioniert weiter.'}
              >
                <Absatz>
                  Mit IP-Adressen klappt weiterhin alles – nur Namen lassen sich nicht mehr auflösen. Klassisches Fehlerbild: „Internet geht nicht, aber ping 8.8.8.8 funktioniert.“
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Alles muss zusammenpassen',
          inhalt: (
            <>
              <Absatz>Die vier Werte hängen voneinander ab. Bevor du auf OK klickst, prüfe:</Absatz>
              <ul class="sn-liste-ok">
                <li>
                  Die IP-Adresse ist ein <strong>Host</strong> – nicht Netz- oder Broadcastadresse (Lektion 10).
                </li>
                <li>
                  Die Subnetzmaske ist <strong>gültig</strong> und passt zum Netz (Lektion 5).
                </li>
                <li>
                  Das Standardgateway liegt <strong>im selben Netz</strong> wie die IP-Adresse (Lektion 14).
                </li>
                <li>Keine Adresse ist doppelt vergeben.</li>
              </ul>
              <Raten
                frage="PC: 192.168.20.25, 255.255.255.0, Gateway 192.168.21.1. Was ist falsch?"
                optionen={['die IP-Adresse', 'die Subnetzmaske', 'das Standardgateway']}
                richtig="das Standardgateway"
                hinweis={() => 'Netz des PCs: 192.168.20.0/24. Wo liegt das Gateway?'}
              >
                <Absatz>
                  192.168.21.1 liegt im Netz 192.168.21.0 – der PC kann es nicht direkt erreichen. Richtig wäre ein Router im Netz <Netz>192.168.20</Netz>.x, z. B. 192.168.20.1.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Dokumentieren',
          inhalt: (
            <>
              <Absatz>
                Zur Einrichtung gehört die Dokumentation: Wer später einen Fehler sucht, muss wissen, wie jedes Gerät eingestellt ist und <strong>wo es angeschlossen</strong> ist –
                an welcher Netzwerkdose bzw. an welchem Anschluss (Port) des <strong>Switches</strong>, also des Verteilers, an dem die Kabel eines Netzes zusammenlaufen.
              </Absatz>
              <div class="lw-tabelle-huelle">
                <table class="lw-tabelle">
                  <thead>
                    <tr>
                      <th>Gerät</th>
                      <th>Vergabe</th>
                      <th>IP-Adresse</th>
                      <th>Subnetzmaske</th>
                      <th>Gateway</th>
                      <th>DNS</th>
                      <th>Anschluss</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>PC-07</td>
                      <td>statisch</td>
                      <td class="mono">192.168.20.57</td>
                      <td class="mono">255.255.255.0</td>
                      <td class="mono">192.168.20.1</td>
                      <td class="mono">192.168.20.1</td>
                      <td>Dose 2.14 / Switch-Port 12</td>
                    </tr>
                    <tr>
                      <td>Laptop-03</td>
                      <td>DHCP</td>
                      <td colSpan={4}>vom DHCP-Server (Lektion 17)</td>
                      <td>WLAN</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <Absatz>
                Die eingestellten Werte prüfst du mit <code>ipconfig /all</code> (Windows) bzw. <code>ip a</code> (Linux).
              </Absatz>
            </>
          ),
        },
      ]}
    />
  );
}

const SZENARIEN = [
  {
    text: 'Netz 192.168.20.0/24. Der Router hat 192.168.20.1 und ist auch DNS-Server. Richte PC-07 mit der festen Adresse .57 ein.',
    netz: '192.168.20.0',
    praefix: 24,
    ip: '192.168.20.57',
    gw: '192.168.20.1',
    dns: '192.168.20.1',
  },
  {
    text: 'Netz 10.0.5.0/26. Der Router hat die letzte nutzbare Adresse, der DNS-Server steht auf 10.0.5.10. Richte den Drucker mit der Adresse .20 ein.',
    netz: '10.0.5.0',
    praefix: 26,
    ip: '10.0.5.20',
    gw: '10.0.5.62',
    dns: '10.0.5.10',
  },
  {
    text: 'Netz 172.16.4.0/23. Gateway ist die erste nutzbare Adresse, DNS-Server 172.16.4.2. Der Server bekommt 172.16.5.100.',
    netz: '172.16.4.0',
    praefix: 23,
    ip: '172.16.5.100',
    gw: '172.16.4.1',
    dns: '172.16.4.2',
  },
];

function KonfigAusprobieren() {
  const [nr, setNr] = useState(0);
  const s = SZENARIEN[nr];
  const [e, setE] = useState({});
  const [geprueft, setGeprueft] = useState(false);
  const soll = { ip: s.ip, maske: maske(s.praefix), gw: s.gw, dns: s.dns };
  const grund = (id) => {
    const wert = leseIp(e[id]);
    if (!wert) return ipFehler(e[id] ?? '') ?? 'keine gültige Adresse';
    if (wert === soll[id]) return null;
    if (id === 'maske') return `/${s.praefix} gehört zu ${soll.maske}.`;
    if (id === 'gw' && !gleichesNetz(wert, s.netz, s.praefix)) return 'liegt nicht im Netz des Geräts.';
    if (id === 'ip' && !gleichesNetz(wert, s.netz, s.praefix)) return 'liegt nicht im richtigen Netz.';
    return 'stimmt nicht mit der Aufgabe überein.';
  };
  const felder = [
    ['ip', 'IP-Adresse'],
    ['maske', 'Subnetzmaske'],
    ['gw', 'Standardgateway'],
    ['dns', 'Bevorzugter DNS-Server'],
  ];
  const alle = felder.every(([id]) => grund(id) === null);
  return (
    <Werkbank>
      <p class="lw-aufgabe">{s.text}</p>
      <form
        class="sn-schema"
        onSubmit={(ev) => {
          ev.preventDefault();
          setGeprueft(true);
        }}
      >
        {felder.map(([id, name]) => {
          const g = geprueft ? grund(id) : null;
          return (
            <label key={id} class="sn-schema__zeile sn-schema__zeile--breit">
              <span class="sn-schema__name">{name}</span>
              <input
                class={`feld feld--mono ${geprueft ? (g ? 'feld--falsch' : 'feld--richtig') : ''}`}
                value={e[id] ?? ''}
                inputMode="decimal"
                autoComplete="off"
                spellcheck={false}
                onInput={(ev) => {
                  setE({ ...e, [id]: ev.currentTarget.value });
                  setGeprueft(false);
                }}
              />
              {geprueft && <span class={`sn-schema__grund ${g ? 'sn-f-res' : 'sn-f-netz'}`}>{g ?? '✓'}</span>}
            </label>
          );
        })}
        <div class="lw-knoepfe">
          <Knopf variante="primaer" groesse="s" type="submit" icon="check">
            Prüfen
          </Knopf>
          <Knopf
            variante="geist"
            groesse="s"
            icon="refresh-cw"
            onClick={() => {
              setNr((nr + 1) % SZENARIEN.length);
              setE({});
              setGeprueft(false);
            }}
          >
            Andere Aufgabe
          </Knopf>
        </div>
      </form>
      {geprueft && alle && (
        <Hinweis ton="gut" icon="party-popper">
          Richtig eingerichtet. Netz {s.netz}/{s.praefix}, Gateway im selben Netz, Subnetzmaske passt.
        </Hinweis>
      )}
    </Werkbank>
  );
}

// ---------- 17 DHCP ----------

const DORA = [
  { von: 'Client', an: 'alle (Broadcast)', name: 'Discover', text: '„Gibt es hier einen DHCP-Server?“' },
  { von: 'DHCP-Server', an: 'Client', name: 'Offer', text: '„Du kannst 192.168.1.123 haben – mit Maske, Gateway und DNS.“' },
  { von: 'Client', an: 'alle (Broadcast)', name: 'Request', text: '„Ich nehme 192.168.1.123.“' },
  { von: 'DHCP-Server', an: 'Client', name: 'Acknowledge', text: '„Bestätigt – gültig für 24 Stunden.“' },
];

function DoraBild({ bis = 4 }) {
  return (
    <ol class="sn-dora">
      {DORA.slice(0, bis).map((d, i) => (
        <li key={d.name} class={`sn-dora__zeile ${d.von === 'Client' ? 'sn-dora__zeile--hin' : 'sn-dora__zeile--zurueck'}`}>
          <span class="sn-dora__nr mono">{i + 1}</span>
          <span class="sn-dora__weg">
            {d.von} <Icon name="arrow-right" groesse={13} /> {d.an}
          </span>
          <span class="sn-dora__name mono">{d.name}</span>
          <span class="sn-dora__text">{d.text}</span>
        </li>
      ))}
    </ol>
  );
}

function DhcpErklaerung() {
  return (
    <Schritte
      schritte={[
        {
          titel: 'Von Hand ist mühsam',
          inhalt: (
            <>
              <Absatz>
                Eine Firma mit 200 PCs: Bei jedem vier Werte von Hand eintragen? Das kostet Zeit, Tippfehler sind sicher, und schnell hat ein Gerät dieselbe Adresse wie ein
                anderes. Und ändert sich der DNS-Server, müsste man alle 200 Geräte anfassen.
              </Absatz>
              <Absatz>
                Die Lösung heißt <strong>DHCP</strong> (Dynamic Host Configuration Protocol): Ein <strong>DHCP-Server</strong> verteilt die Einstellungen automatisch. In Heimnetzen
                steckt er im Router, in Firmen läuft er oft auf einem Server.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Was der DHCP-Server verteilt',
          inhalt: (
            <>
              <div class="sn-dhcp-paket">
                <span class="sn-dhcp-paket__titel">
                  <Icon name="server" groesse={16} /> DHCP-Server teilt zu:
                </span>
                <span>
                  IP-Adresse <strong class="mono">192.168.1.123</strong>
                </span>
                <span>
                  Subnetzmaske <strong class="mono">255.255.255.0</strong>
                </span>
                <span>
                  Standardgateway <strong class="mono">192.168.1.1</strong>
                </span>
                <span>
                  DNS-Server <strong class="mono">192.168.1.1</strong>
                </span>
              </div>
              <Absatz>
                Die Adressen nimmt er aus einem festgelegten <strong>DHCP-Bereich</strong> (auch Pool), z. B. 192.168.1.100 bis 192.168.1.200. Jede Adresse ist nur für eine
                bestimmte Zeit verliehen (<strong>Lease</strong>, z. B. 24 Stunden) und wird danach verlängert oder an jemand anderen vergeben.
              </Absatz>
            </>
          ),
        },
        {
          titel: 'Der Ablauf in vier Nachrichten',
          inhalt: (
            <>
              <Absatz>Ein neuer Client hat noch keine Adresse und kennt den DHCP-Server nicht. Wie soll er ihn erreichen?</Absatz>
              <Raten
                frage="An wen schickt der Client seine erste Anfrage?"
                optionen={['an den Router 192.168.1.1', 'an alle (Broadcast)', 'an den DNS-Server']}
                richtig="an alle (Broadcast)"
                hinweis={() => 'Woher soll er die Adresse des Routers oder DNS-Servers kennen? Die bekommt er ja erst vom DHCP-Server.'}
              >
                <DoraBild />
                <span class="sn-beschrift">
                  Merkwort aus den Anfangsbuchstaben: DORA. Der Ablauf selbst ist kein AP1-Prüfungsstoff – wichtig ist: Er beginnt mit einem Broadcast.
                </span>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Automatisch oder fest?',
          inhalt: (
            <Fakten>
              <Fakt titel="Automatisch (DHCP)" icon="refresh-cw">
                Für Arbeitsplatz-PCs, Laptops, Smartphones, Gäste. Vorteile: wenig Aufwand, keine Tippfehler, keine doppelten Adressen, Änderungen zentral für alle.
              </Fakt>
              <Fakt titel="Fest (statisch)" icon="map-pin">
                Für Geräte, die andere immer unter derselben Adresse finden müssen: Server, Netzwerkdrucker, Router. Mehr dazu in Lektion 18.
              </Fakt>
            </Fakten>
          ),
        },
        {
          titel: 'Wenn keiner antwortet: 169.254.x.x',
          inhalt: (
            <>
              <Absatz>
                Bekommt der Client auf seinen Rundruf keine Antwort, gibt er sich nach kurzer Zeit <strong>selbst eine Adresse aus 169.254.0.0/16</strong> (APIPA, Automatic Private
                IP Addressing). Ein Gateway hat er dann nicht.
              </Absatz>
              <Konsole
                titel="ipconfig – kein DHCP-Server erreicht"
                zeilen={[
                  { text: '   Autokonfiguration IPv4-Adresse  . : 169.254.12.34', hervor: true },
                  '   Subnetzmaske  . . . . . . . . . . : 255.255.0.0',
                  '   Standardgateway . . . . . . . . . :',
                ]}
              />
              <Fakten>
                <Fakt titel="Was es bedeutet" icon="triangle-alert">
                  Kein DHCP-Server hat geantwortet. Der PC erreicht höchstens andere Geräte mit 169.254-Adresse im selben Netzabschnitt – kein Internet.
                </Fakt>
                <Fakt titel="Was du prüfst" icon="list-checks">
                  Kabel bzw. WLAN verbunden? Läuft der DHCP-Server? Hat er noch freie Adressen im Bereich?
                </Fakt>
              </Fakten>
            </>
          ),
        },
      ]}
    />
  );
}

function DhcpAusprobieren() {
  const [kabel, setKabel] = useState(true);
  const [server, setServer] = useState(true);
  const [frei, setFrei] = useState(true);
  const [gestartet, setGestartet] = useState(false);
  const klappt = kabel && server && frei;
  const umschalter = (name, wert, setze) => (
    <label class="sn-schalter">
      <input
        type="checkbox"
        checked={wert}
        onChange={(e) => {
          setze(e.currentTarget.checked);
          setGestartet(false);
        }}
      />
      <span>{name}</span>
    </label>
  );
  const ursache = !kabel
    ? 'Das Kabel ist nicht eingesteckt – der Rundruf kommt nirgends an.'
    : !server
      ? 'Der DHCP-Server läuft nicht – niemand antwortet.'
      : 'Der DHCP-Bereich ist voll – der Server hat keine Adresse mehr frei.';
  return (
    <Werkbank
      leiste={
        <>
          {umschalter('Kabel eingesteckt', kabel, setKabel)}
          {umschalter('DHCP-Server läuft', server, setServer)}
          {umschalter('Freie Adressen im DHCP-Bereich', frei, setFrei)}
        </>
      }
    >
      <p class="lw-aufgabe">Stell die Lage ein und schalte den PC ein. Was zeigt ipconfig danach?</p>
      <Knopf variante="akzent" groesse="s" icon="play" onClick={() => setGestartet(true)}>
        PC einschalten
      </Knopf>
      {gestartet && (
        <div class="erscheinen sn-dhcp-ergebnis">
          {klappt ? (
            <>
              <DoraBild />
              <Konsole
                titel="ipconfig"
                zeilen={[
                  '   DHCP aktiviert  . . . . . . . . . : Ja',
                  { text: '   IPv4-Adresse  . . . . . . . . . . : 192.168.1.123', hervor: true },
                  '   Subnetzmaske  . . . . . . . . . . : 255.255.255.0',
                  '   Standardgateway . . . . . . . . . : 192.168.1.1',
                  '   DNS-Server  . . . . . . . . . . . : 192.168.1.1',
                ]}
              />
              <Hinweis ton="gut" icon="circle-check">
                Der PC hat alle vier Einstellungen vom DHCP-Server bekommen.
              </Hinweis>
            </>
          ) : (
            <>
              <DoraBild bis={1} />
              <Konsole
                titel="ipconfig"
                zeilen={[
                  '   DHCP aktiviert  . . . . . . . . . : Ja',
                  { text: '   Autokonfiguration IPv4-Adresse  . : 169.254.87.12', hervor: true },
                  '   Subnetzmaske  . . . . . . . . . . : 255.255.0.0',
                  '   Standardgateway . . . . . . . . . :',
                ]}
              />
              <Hinweis ton="fehler" icon="triangle-alert">
                Keine Antwort auf den Rundruf → der PC gibt sich selbst eine 169.254-Adresse. Ursache hier: {ursache}
              </Hinweis>
            </>
          )}
        </div>
      )}
    </Werkbank>
  );
}

// ---------- 18 Statische Adresse ----------

const SKIZZEN = [
  {
    text: 'Der neue Netzwerkdrucker braucht eine feste Adresse.',
    netzAdr: '192.168.10.0',
    praefix: 24,
    belegt: [
      { ip: '192.168.10.1', name: 'Router', icon: 'router' },
      { ip: '192.168.10.10', name: 'Server', icon: 'server' },
    ],
    dhcp: ['192.168.10.100', '192.168.10.200'],
    neu: { name: 'Drucker', icon: 'printer' },
  },
  {
    text: 'Die letzte nutzbare Adresse hat der Router. Der Server soll die vorletzte nutzbare Adresse bekommen.',
    netzAdr: '10.0.0.0',
    praefix: 26,
    belegt: [
      { ip: '10.0.0.62', name: 'Router', icon: 'router' },
      { ip: '10.0.0.10', name: 'PC-1', icon: 'monitor' },
      { ip: '10.0.0.11', name: 'PC-2', icon: 'monitor' },
    ],
    dhcp: null,
    soll: '10.0.0.61',
    neu: { name: 'Server', icon: 'server' },
  },
  {
    text: 'Ein NAS (Netzwerkspeicher) braucht eine feste Adresse.',
    netzAdr: '172.16.8.96',
    praefix: 27,
    belegt: [
      { ip: '172.16.8.97', name: 'Router', icon: 'router' },
      { ip: '172.16.8.98', name: 'Drucker', icon: 'printer' },
    ],
    dhcp: ['172.16.8.100', '172.16.8.120'],
    neu: { name: 'NAS', icon: 'hard-drive-download' },
  },
];

function StatischErklaerung() {
  const s = SKIZZEN[1];
  return (
    <Schritte
      schritte={[
        {
          titel: 'Wer braucht eine feste Adresse?',
          inhalt: (
            <>
              <Absatz>
                Per DHCP kann ein Gerät heute .123 und morgen .145 bekommen. Für einen Laptop ist das egal. Aber stell dir den <strong>Drucker</strong> vor: Alle PCs haben
                gespeichert, dass er unter einer bestimmten Adresse erreichbar ist. Ändert sie sich, druckt niemand mehr.
              </Absatz>
              <Raten
                frage="Welches Gerät braucht ebenfalls unbedingt eine feste Adresse?"
                optionen={['das Smartphone eines Gastes', 'der Router (das Standardgateway)', 'ein Laptop im Homeoffice']}
                richtig="der Router (das Standardgateway)"
                hinweis={() => 'Welche Adresse steht bei allen Geräten in der Konfiguration?'}
              >
                <Absatz>
                  Das Standardgateway steht in der Konfiguration jedes Geräts – würde sich die Adresse des Routers ändern, käme niemand mehr aus dem Netz hinaus. Feste Adressen
                  bekommen also <strong>Server, Netzwerkdrucker, Router</strong> und andere Geräte, die immer gleich erreichbar sein müssen.
                </Absatz>
              </Raten>
            </>
          ),
        },
        {
          titel: 'Die vier Regeln für eine statische Adresse',
          inhalt: (
            <>
              <Absatz>Beispiel: Netz 192.168.10.0/24, der DHCP-Server vergibt .100 bis .200, Router .1, Server .10.</Absatz>
              <ol class="sn-regeln">
                <li>
                  <strong>Im richtigen Netz</strong> – 192.168.11.20 geht nicht, die liegt in einem anderen Netz.
                </li>
                <li>
                  <strong>Nicht Netz- oder Broadcastadresse</strong> – .0 und .255 sind <Res>reserviert</Res>.
                </li>
                <li>
                  <strong>Nicht schon vergeben</strong> – .1 (Router) und .10 (Server) sind belegt.
                </li>
                <li>
                  <strong>Außerhalb des DHCP-Bereichs</strong> – sonst könnte der DHCP-Server dieselbe Adresse an ein anderes Gerät geben: <strong>Adresskonflikt</strong>.
                </li>
              </ol>
              <AdressPlan netzAdr="192.168.10.0" praefix={24} belegt={SKIZZEN[0].belegt} dhcp={SKIZZEN[0].dhcp} />
            </>
          ),
        },
        {
          titel: 'Netzskizze lesen – wie in der Prüfung',
          inhalt: (
            <>
              <Absatz>
                In der Prüfung sieht das so aus: eine Netzskizze mit Netzadresse und Geräten, eine Adresse fehlt. Hier: Netz <strong class="mono">10.0.0.0/26</strong>. {s.text}
              </Absatz>
              <Skizze s={s} />
              <Raten
                frage="Welche Adresse bekommt der Server?"
                optionen={['10.0.0.61', '10.0.0.62', '10.0.0.63', '10.0.0.64']}
                richtig="10.0.0.61"
                hinweis={(v) =>
                  v.endsWith('.62')
                    ? '.62 ist die letzte nutzbare – die hat schon der Router.'
                    : v.endsWith('.63')
                      ? '.63 ist der Broadcast (0 + 64 − 1).'
                      : '.64 gehört schon zum nächsten Netz.'
                }
              >
                <Formel>
                  /26 → Blockgröße 64 → Broadcast 10.0.0.63 → letzte nutzbare .62 (Router) → vorletzte <strong>10.0.0.61</strong>
                </Formel>
              </Raten>
            </>
          ),
        },
        {
          titel: 'So gehst du vor',
          inhalt: (
            <ol class="sn-verfahren">
              <li>Netz bestimmen: Netzadresse, Broadcast, Hostbereich (Rechenweg aus Lektion 13).</li>
              <li>Alle schon vergebenen Adressen aus der Skizze streichen.</li>
              <li>Den DHCP-Bereich streichen.</li>
              <li>Aus dem Rest eine Adresse wählen – oder genau die, nach der gefragt ist (z. B. „vorletzte nutzbare“).</li>
            </ol>
          ),
        },
      ]}
    />
  );
}

// Adressplan eines Netzes als Leiste: reserviert, belegt, DHCP-Bereich, frei
function AdressPlan({ netzAdr, praefix, belegt, dhcp }) {
  const n = netz(netzAdr, praefix);
  const start = ipZuZahl(n.netz);
  const ende = ipZuZahl(n.broadcast);
  const breite = ende - start + 1;
  const pos = (ip) => ((ipZuZahl(ip) - start) / breite) * 100;
  const letztes = (ip) => ip.split('.')[3];
  return (
    <div class="sn-plan">
      <div class="sn-plan__leiste">
        <span class="sn-plan__teil sn-plan__teil--frei" style={{ left: 0, width: '100%' }} />
        {dhcp && (
          <span class="sn-plan__teil sn-plan__teil--dhcp" style={{ left: `${pos(dhcp[0])}%`, width: `${pos(dhcp[1]) - pos(dhcp[0]) + 100 / breite}%` }} title="DHCP-Bereich" />
        )}
        {belegt.map((b) => (
          <span key={b.ip} class="sn-plan__punkt sn-plan__punkt--belegt" style={{ left: `${pos(b.ip)}%` }} title={b.name} />
        ))}
        <span class="sn-plan__punkt sn-plan__punkt--res" style={{ left: 0 }} />
        <span class="sn-plan__punkt sn-plan__punkt--res" style={{ left: `${100 - 100 / breite}%` }} />
      </div>
      <div class="sn-plan__legende">
        <span>
          <i class="sn-plan__farbe sn-plan__farbe--res" /> reserviert .{letztes(n.netz)} / .{letztes(n.broadcast)}
        </span>
        <span>
          <i class="sn-plan__farbe sn-plan__farbe--belegt" /> vergeben: {belegt.map((b) => `${b.name} .${letztes(b.ip)}`).join(', ')}
        </span>
        {dhcp && (
          <span>
            <i class="sn-plan__farbe sn-plan__farbe--dhcp" /> DHCP-Bereich .{letztes(dhcp[0])}–.{letztes(dhcp[1])}
          </span>
        )}
        <span>
          <i class="sn-plan__farbe sn-plan__farbe--frei" /> frei für feste Adressen
        </span>
      </div>
    </div>
  );
}

function Skizze({ s, vorschlag = null, ok = null }) {
  return (
    <div class="sn-skizze">
      <span class="sn-skizze__netz mono">
        Netz {s.netzAdr}/{s.praefix}
      </span>
      <div class="sn-skizze__geraete">
        {s.belegt.map((b) => (
          <Geraet key={b.ip} klein icon={b.icon} name={b.name} ip={b.ip} ton={b.name === 'Router' ? 'router' : ''} />
        ))}
        <Geraet klein icon={s.neu.icon} name={s.neu.name} ip={vorschlag ?? '?'} ton={ok === null ? 'aktiv' : ok ? 'netz' : 'fremd'} />
      </div>
      {s.dhcp && (
        <span class="sn-skizze__dhcp">
          DHCP-Bereich: <span class="mono">{s.dhcp[0]}</span> bis <span class="mono">{s.dhcp[1]}</span>
        </span>
      )}
    </div>
  );
}

function StatischAusprobieren() {
  const [nr, setNr] = useState(0);
  const s = SKIZZEN[nr];
  const [text, setText] = useState('');
  const [r, setR] = useState(null);
  const pruefe = (e) => {
    e.preventDefault();
    let ergebnis = pruefeStatisch(text, s);
    if (ergebnis.ok && s.soll && leseIp(text) !== s.soll) ergebnis = { ok: false, grund: 'Frei wäre sie – gefragt ist aber die vorletzte nutzbare Adresse.' };
    setR(ergebnis);
  };
  return (
    <Werkbank>
      <p class="lw-aufgabe">{s.text} Trag eine passende Adresse ein.</p>
      <Skizze s={s} vorschlag={r?.ok ? leseIp(text) : null} ok={r ? r.ok : null} />
      <AdressPlan netzAdr={s.netzAdr} praefix={s.praefix} belegt={s.belegt} dhcp={s.dhcp} />
      <form class="lw-frage__eingabe lw-frage__eingabe--ohne" onSubmit={pruefe}>
        <input
          class={`feld feld--mono ${r ? (r.ok ? 'feld--richtig' : 'feld--falsch') : ''}`}
          value={text}
          placeholder="Adresse"
          inputMode="decimal"
          spellcheck={false}
          onInput={(e) => {
            setText(e.currentTarget.value);
            setR(null);
          }}
        />
        <Knopf variante="zweit" groesse="s" type="submit" icon="check">
          Prüfen
        </Knopf>
        <Knopf
          variante="geist"
          groesse="s"
          icon="refresh-cw"
          onClick={() => {
            setNr((nr + 1) % SKIZZEN.length);
            setText('');
            setR(null);
          }}
        >
          Andere Skizze
        </Knopf>
      </form>
      {r && (
        <Hinweis ton={r.ok ? 'gut' : 'fehler'} icon={r.ok ? 'circle-check' : 'circle-x'}>
          {r.ok ? 'Passt: im richtigen Netz, nicht reserviert, nicht vergeben, außerhalb des DHCP-Bereichs.' : r.grund}
        </Hinweis>
      )}
    </Werkbank>
  );
}

export const KONFIGURATION = {
  standardgateway: { Erklaerung: GatewayErklaerung, Ausprobieren: GatewayAusprobieren },
  privat: { Erklaerung: PrivatErklaerung, Ausprobieren: PrivatAusprobieren },
  konfiguration: { Erklaerung: KonfigErklaerung, Ausprobieren: KonfigAusprobieren },
  dhcp: { Erklaerung: DhcpErklaerung, Ausprobieren: DhcpAusprobieren },
  statisch: { Erklaerung: StatischErklaerung, Ausprobieren: StatischAusprobieren },
};
