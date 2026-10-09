// Subnetting verstehen: ein Lernblock in zwölf ruhigen Schritten an einer Adresse. Jeder Schritt zeigt eine Idee;
// an den wichtigen Stellen wird erst geraten und dann aufgedeckt. Die Farben bedeuten überall dasselbe:
// Netz grün (Akzent), Host blau, Trennstrich orange, reserviert rot. Rechnung in lernweg.js und ip.js (getestet).
// Der Visualizer bleibt der Modus zum Nachschlagen.

import { Fragment } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../ui/bausteine.jsx';
import { link } from '../../../router.js';
import { zerlege, netz, maskeZahl } from './ip.js';
import {
  STELLENWERTE,
  netzBitsJeOktett,
  oktettRollen,
  maskenwert,
  binaerSchritte,
  adressArt,
  startOptionen,
  bewerteStart,
  endeOptionen,
  bewerteEnde,
  hostBits,
  grossesNetz,
  vergleichsZiele,
  aufteilTabelle,
  rechenweg,
  zufallsAufgabe,
  leseIp,
  leseZahl,
} from './lernweg.js';
import { zufall } from '../rahmen/zufall.js';

const MIN = 8;
const MAX = 30;
const START_IP = '192.168.40.150';
const START_PRAEFIX = 26;

const bitsVon = (zahl) => Array.from({ length: 32 }, (_, i) => (zahl >>> (31 - i)) & 1);
const oktetteVon = (zahl) => [24, 16, 8, 0].map((s) => (zahl >>> s) & 255);
const tausend = (n) => n.toLocaleString('de-DE');
const begrenze = (p) => Math.max(MIN, Math.min(MAX, p));
const bitWort = (n) => (n === 1 ? '1 Bit' : `${n} Bits`);

const SCHRITTE = [
  { kurz: 'Aufbau', titel: 'Woraus besteht eine IP-Adresse?', Inhalt: Aufbau },
  { kurz: 'Bits', titel: 'Von der Zahl zu den Bits', Inhalt: Bits },
  { kurz: 'Präfix', titel: 'Der Präfix ist ein Trennstrich', Inhalt: Praefix },
  { kurz: 'Subnetzmaske', titel: 'Die Subnetzmaske ist der Strich als Zahl', Inhalt: Maske },
  { kurz: 'Oktett', titel: 'Gerechnet wird nur in einem Oktett', Inhalt: Oktett },
  { kurz: 'Blöcke', titel: 'Das Oktett in Blöcke schneiden', Inhalt: Bloecke },
  { kurz: 'Dein Block', titel: 'Wo beginnt und wo endet dein Block?', Inhalt: DeinBlock, frisch: true },
  { kurz: 'Adressen', titel: 'Die Adressen zusammenbauen', Inhalt: Adressen, frisch: true },
  { kurz: 'Unter /24', titel: 'Wenn der Strich weiter links liegt', Inhalt: Unter24, frisch: true },
  { kurz: 'Gateway', titel: 'Gleiches Netz – oder übers Gateway?', Inhalt: Gateway, frisch: true },
  { kurz: 'Aufteilen', titel: 'Aufteilen, nicht wegnehmen', Inhalt: Aufteilen },
  { kurz: 'Rechenweg', titel: 'Der schnelle Rechenweg für die Prüfung', Inhalt: Rechenweg },
];

export function SubnetzVerstehen() {
  const [ip, setIp] = useState(START_IP);
  const [eingabe, setEingabe] = useState(START_IP);
  const [praefix, setPraefixRoh] = useState(START_PRAEFIX);
  const [schritt, setSchritt] = useState(0);
  const [besucht, setBesucht] = useState(0);
  const karte = useRef(null);
  const ersterLauf = useRef(true);
  const z = useMemo(() => zerlege(ip, praefix), [ip, praefix]);

  const setPraefix = (p) => setPraefixRoh(begrenze(p));
  const tippe = (text) => {
    setEingabe(text);
    const gelesen = leseIp(text);
    if (gelesen) setIp(gelesen);
  };
  const geheZu = (i) => {
    setSchritt(i);
    setBesucht((b) => Math.max(b, i));
  };
  // Von einem Schritt aus die Adresse ändern (Bits umschalten): Eingabefeld oben zieht mit
  const uebernehmeIp = (neu) => {
    setIp(neu);
    setEingabe(neu);
  };
  const neuerFall = () => {
    const a = zufallsAufgabe(zufall());
    setIp(a.ip);
    setEingabe(a.ip);
    setPraefixRoh(a.praefix);
    setSchritt(0);
  };

  // Beim Schrittwechsel an den Anfang der Karte, wenn sie oben aus dem Bild gerutscht ist (z. B. am Handy)
  useEffect(() => {
    if (ersterLauf.current) {
      ersterLauf.current = false;
      return;
    }
    const el = karte.current;
    if (el && el.getBoundingClientRect().top < 0) {
      const ruhig = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ block: 'start', behavior: ruhig ? 'auto' : 'smooth' });
    }
  }, [schritt]);

  const s = SCHRITTE[schritt];
  const Inhalt = s.Inhalt;
  const art = adressArt(ip, praefix);

  return (
    <div class="sv">
      <div class="flaeche sv-leiste">
        <label class="sv-leiste__feld">
          <span class="ueberschrift-klein">IP-Adresse</span>
          <input
            class={`feld mono sv-leiste__ip ${leseIp(eingabe) ? '' : 'feld--falsch'}`}
            value={eingabe}
            inputMode="decimal"
            spellcheck={false}
            autocomplete="off"
            onInput={(e) => tippe(e.currentTarget.value)}
          />
        </label>
        <div class="sv-leiste__feld">
          <span class="ueberschrift-klein" id="sv-praefix-titel">
            Präfix
          </span>
          <div class="sv-stepper" role="group" aria-labelledby="sv-praefix-titel">
            <button type="button" class="sv-stepper__knopf" onClick={() => setPraefix(praefix - 1)} disabled={praefix <= MIN} aria-label="Präfix verkleinern">
              <Icon name="minus" groesse={15} />
            </button>
            <span class="sv-stepper__wert mono" aria-live="polite">
              /{praefix}
            </span>
            <button type="button" class="sv-stepper__knopf" onClick={() => setPraefix(praefix + 1)} disabled={praefix >= MAX} aria-label="Präfix vergrößern">
              <Icon name="plus" groesse={15} />
            </button>
          </div>
        </div>
        <div class="sv-farben" aria-label="Farben in allen Schritten">
          <span>
            <i class="sv-legende__farbe sv-legende__farbe--netz" /> Netz
          </span>
          <span>
            <i class="sv-legende__farbe sv-legende__farbe--host" /> Host
          </span>
          <span>
            <i class="sv-farben__strich" /> Trennstrich
          </span>
          <span>
            <i class="sv-legende__farbe sv-legende__farbe--res" /> reserviert
          </span>
        </div>
        {art !== 'host' && (
          <p class="sv-leiste__hinweis">
            <Icon name="info" groesse={14} />
            <span>
              {ip} ist bei /{praefix} {art === 'netz' ? 'die Netzadresse' : 'der Broadcast'} – kein Gerät darf sie haben. Zum Rechnen ist das egal.
            </span>
          </p>
        )}
      </div>

      <Wegleiste schritt={schritt} besucht={besucht} onWahl={geheZu} />

      <section class="flaeche sv-karte" ref={karte} aria-labelledby="sv-titel">
        <header class="sv-karte__kopf">
          <span class="ueberschrift-klein ueberschrift-klein--akzent">
            Schritt {schritt + 1} von {SCHRITTE.length}
          </span>
          <h2 class="sv-karte__titel" id="sv-titel">
            {s.titel}
          </h2>
        </header>
        {/* Rätsel beginnen bei neuer Adresse oder neuem Präfix von vorn; Schritte mit eigenem Regler behalten ihren Stand */}
        <Inhalt key={s.frisch ? `${schritt}|${ip}/${praefix}` : schritt} z={z} ip={ip} praefix={praefix} setPraefix={setPraefix} setIp={uebernehmeIp} />
        <footer class="sv-fuss">
          <Knopf icon="arrow-left" onClick={() => geheZu(schritt - 1)} disabled={schritt === 0}>
            Zurück
          </Knopf>
          {schritt < SCHRITTE.length - 1 ? (
            <Knopf variante="primaer" iconRechts="arrow-right" onClick={() => geheZu(schritt + 1)}>
              Weiter: {SCHRITTE[schritt + 1].kurz}
            </Knopf>
          ) : (
            <Knopf variante="primaer" icon="shuffle" onClick={neuerFall}>
              Neue Adresse, von vorn
            </Knopf>
          )}
        </footer>
      </section>
    </div>
  );
}

// ---------- Bausteine ----------

// Schrittleiste: Punkte mit Nummer, der aktuelle Schritt zeigt seinen Namen (nicht am Handy, dort steht er im Titel)
function Wegleiste({ schritt, besucht, onWahl }) {
  return (
    <nav class="sv-weg" aria-label="Schritte">
      <ol class="sv-weg__liste" style={{ '--fortschritt': schritt / (SCHRITTE.length - 1) }}>
        {SCHRITTE.map((s, i) => {
          const zustand = i === schritt ? 'aktiv' : i <= besucht ? 'besucht' : 'offen';
          return (
            <li key={s.kurz} class={`sv-weg__eintrag sv-weg__eintrag--${zustand}`}>
              <button
                type="button"
                class="sv-weg__knopf"
                onClick={() => onWahl(i)}
                aria-current={i === schritt ? 'step' : undefined}
                aria-label={`Schritt ${i + 1}: ${s.kurz}`}
                title={`${i + 1}. ${s.kurz}`}
              >
                <span class="sv-weg__nr mono">{i + 1}</span>
                <span class="sv-weg__name">{s.kurz}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function Merke({ children }) {
  return (
    <p class="sv-merke">
      <Icon name="lightbulb" groesse={16} />
      <span>{children}</span>
    </p>
  );
}

function Rueckmeldung({ ok, children }) {
  return (
    <p class={`sv-rueck ${ok ? 'sv-rueck--gut' : 'sv-rueck--falsch'}`} role="status">
      <Icon name={ok ? 'circle-check' : 'circle-x'} groesse={16} />
      <span>{children}</span>
    </p>
  );
}

function Hinweis({ icon = 'info', ton = '', children }) {
  return (
    <p class={`sv-hinweis ${ton ? `sv-hinweis--${ton}` : ''}`}>
      <Icon name={icon} groesse={16} />
      <span>{children}</span>
    </p>
  );
}

// Die 32 Bits einer Adresse in vier Oktetten (auf schmalen Bildschirmen zwei je Zeile). Ohne Präfix sind alle Bits
// neutral; mit Präfix sind die Bits davor grün (Netz), danach blau (Host), und hinter Bit `praefix` steht der Strich.
// dezimal: Zahl über jedem Oktett · klammer: Klammer zwischen Zahl und Bits · nummern: Bitnummer 1 … 32 darunter
// unter: Text je Oktett · gefuellt: false zeigt erst alles grau · einlauf: Bits färben sich nacheinander
function Bitband({ zahl, praefix = null, dezimal = true, klammer = false, nummern = false, unter = null, gefuellt = true, einlauf = false }) {
  const b = bitsVon(zahl);
  const okt = oktetteVon(zahl);
  return (
    <div class={`sv-band ${einlauf ? 'sv-band--einlauf' : ''} ${gefuellt ? '' : 'sv-band--leer'}`}>
      {[0, 1, 2, 3].map((o) => {
        const strichVorn = praefix !== null && o > 0 && praefix === o * 8;
        return (
          <div key={o} class={`sv-band__oktett ${strichVorn ? 'sv-band__oktett--strich' : ''}`} style={{ '--i': o * 8 }}>
            {dezimal && <span class="sv-band__dez mono">{okt[o]}</span>}
            {klammer && <span class="sv-band__klammer" aria-hidden="true" />}
            <span class="sv-band__bits">
              {b.slice(o * 8, o * 8 + 8).map((bit, j) => {
                const i = o * 8 + j;
                const art = praefix === null ? 'neutral' : gefuellt && i < praefix ? 'netz' : 'host';
                return (
                  <i key={j} class={`sv-bit sv-bit--${art} ${praefix !== null && j > 0 && i === praefix ? 'sv-bit--strich' : ''}`} style={{ '--i': i }}>
                    {bit}
                  </i>
                );
              })}
            </span>
            {nummern && (
              <span class="sv-band__nummern mono" aria-hidden="true">
                {Array.from({ length: 8 }, (_, j) => {
                  const nr = o * 8 + j + 1;
                  return (
                    <span key={j} class={nr === praefix ? 'sv-band__nr--grenze' : nr <= praefix ? 'sv-band__nr--netz' : 'sv-band__nr--host'}>
                      {nr}
                    </span>
                  );
                })}
              </span>
            )}
            {unter && <span class="sv-band__unter">{unter[o]}</span>}
          </div>
        );
      })}
    </div>
  );
}

// Die 8 Bits eines Oktetts mit dem Strich nach `netzBits`
function OktettBits({ wert, netzBits }) {
  return (
    <span class="sv-okbits">
      {Array.from({ length: 8 }, (_, j) => (
        <i key={j} class={`sv-bit sv-bit--${j < netzBits ? 'netz' : 'host'} ${j > 0 && j === netzBits ? 'sv-bit--strich' : ''}`}>
          {(wert >> (7 - j)) & 1}
        </i>
      ))}
    </span>
  );
}

// Eine Adresse, jedes Oktett in der Farbe seiner Rolle: Netz (abgeschrieben), Strich (gerechnet), Host (0 bzw. 255)
function IpZellen({ ip, rollen }) {
  return (
    <span class="sv-ip mono">
      {ip.split('.').map((o, i) => (
        <Fragment key={i}>
          {i > 0 && <span class="sv-ip__punkt">.</span>}
          <span class={`sv-ip__teil sv-ip__teil--${rollen[i]}`}>{o}</span>
        </Fragment>
      ))}
    </span>
  );
}

function Legende({ rollen }) {
  const eintraege = [
    { rolle: 'netz', text: 'abgeschrieben (Netz)' },
    { rolle: 'strich', text: 'gerechnet' },
    { rolle: 'host', text: '0 bzw. 255 (Host)' },
  ].filter((e) => rollen.includes(e.rolle));
  return (
    <div class="sv-legende">
      {eintraege.map((e) => (
        <span key={e.rolle}>
          <i class={`sv-legende__farbe sv-legende__farbe--${e.rolle}`} /> {e.text}
        </span>
      ))}
    </div>
  );
}

// Auswahlfrage: erst raten, falsche Antworten werden erklärt und bleiben durchgestrichen, „Zeig's mir“ deckt auf.
function Frage({ titel, optionen, richtig, hinweis, onGeloest, format = (v) => v, text = false }) {
  const [gewaehlt, setGewaehlt] = useState(null);
  const [falsch, setFalsch] = useState([]);
  const [geloest, setGeloest] = useState(false);
  const loese = () => {
    setGeloest(true);
    onGeloest?.();
  };
  const waehle = (v) => {
    setGewaehlt(v);
    if (v === richtig) loese();
    else setFalsch((f) => [...f, v]);
  };
  return (
    <div class="sv-frage">
      <p class="sv-frage__titel">{titel}</p>
      <div class="sv-frage__optionen" role="group" aria-label={titel}>
        {optionen.map((o) => {
          const zustand = geloest && o === richtig ? 'gut' : falsch.includes(o) ? 'falsch' : '';
          return (
            <button
              key={o}
              type="button"
              class={`sv-option ${text ? 'sv-option--text' : 'mono'} ${zustand ? `sv-option--${zustand}` : ''}`}
              disabled={geloest || falsch.includes(o)}
              onClick={() => waehle(o)}
            >
              {format(o)}
            </button>
          );
        })}
      </div>
      {!geloest && gewaehlt !== null && <Rueckmeldung ok={false}>{hinweis(gewaehlt)}</Rueckmeldung>}
      {geloest && gewaehlt === richtig && <Rueckmeldung ok>Richtig!</Rueckmeldung>}
      {!geloest && (
        <button type="button" class="sv-link" onClick={loese}>
          <Icon name="eye" groesse={14} /> Zeig's mir
        </button>
      )}
    </div>
  );
}

// Strich verschieben, mit der Wirkung des letzten Klicks (halbiert/verdoppelt)
function StrichKnoepfe({ praefix, setPraefix, links = 'Strich nach links', rechts = 'Strich nach rechts' }) {
  const [letzte, setLetzte] = useState(null);
  const schiebe = (d) => {
    const nach = begrenze(praefix + d);
    setLetzte({ von: praefix, nach });
    setPraefix(nach);
  };
  const zeige = letzte && letzte.nach === praefix && letzte.von !== letzte.nach;
  return (
    <div class="sv-schieben">
      <div class="sv-knoepfe">
        <Knopf groesse="s" icon="arrow-left" onClick={() => schiebe(-1)} disabled={praefix <= MIN}>
          {links}
        </Knopf>
        <Knopf groesse="s" iconRechts="arrow-right" onClick={() => schiebe(1)} disabled={praefix >= MAX}>
          {rechts}
        </Knopf>
      </div>
      {zeige && (
        <p class="sv-wirkung" role="status">
          /{letzte.von} → /{letzte.nach}: {letzte.nach > letzte.von ? 'ein Netzbit mehr' : 'ein Netzbit weniger'} →{' '}
          <strong class="mono">
            {tausend(2 ** (32 - letzte.von))} → {tausend(2 ** (32 - letzte.nach))}
          </strong>{' '}
          Adressen je Netz ({letzte.nach > letzte.von ? 'halbiert' : 'verdoppelt'})
        </p>
      )}
    </div>
  );
}

// Zahlenstrahl 0 … 255 des Oktetts mit dem Strich, in Blöcke geschnitten. marke: Wert mit Stecknadel ·
// aktiv: Anfang des hervorgehobenen Blocks · codes: die Netzbits jedes Blocks (nur bei wenigen Blöcken)
function Strahl({ z, marke = null, aktiv = null, codes = false }) {
  const anzahl = 256 / z.block;
  const k = z.netzBitsImOktett;
  const jede = Math.max(1, anzahl / 8);
  return (
    <div class="sv-strahl" role="img" aria-label={`Zahlen 0 bis 255, geschnitten in ${anzahl} ${anzahl === 1 ? 'Block' : 'Blöcke'} zu je ${z.block}`}>
      {marke !== null && (
        <div class="sv-strahl__nadelbahn">
          <span class="sv-nadel" style={{ left: `${((marke + 0.5) / 256) * 100}%` }}>
            <span class="sv-nadel__text mono">{marke}</span>
          </span>
        </div>
      )}
      <div class={`sv-strahl__leiste ${anzahl > 32 ? 'sv-strahl__leiste--dicht' : ''}`}>
        {Array.from({ length: anzahl }, (_, nr) => (
          <span key={nr} class={`sv-block ${nr % 2 ? 'sv-block--zwei' : ''} ${aktiv === nr * z.block ? 'sv-block--aktiv' : ''}`}>
            {codes && k > 0 && anzahl <= 8 && <span class="sv-block__code mono">{nr.toString(2).padStart(k, '0')}</span>}
            {aktiv === nr * z.block && anzahl <= 4 && (
              <span class="sv-block__bereich mono">
                {aktiv}–{aktiv + z.block - 1}
              </span>
            )}
          </span>
        ))}
      </div>
      <div class="sv-strahl__skala mono" aria-hidden="true">
        {Array.from({ length: anzahl / jede }, (_, i) => i * jede * z.block).map((start) => (
          <span key={start} class={`sv-strahl__zahl ${start === 0 ? 'sv-strahl__zahl--null' : ''}`} style={{ left: `${(start / 256) * 100}%` }}>
            {start}
          </span>
        ))}
        <span class="sv-strahl__zahl sv-strahl__zahl--ende">255</span>
      </div>
    </div>
  );
}

// ---------- 1. Aufbau ----------

function Aufbau({ z }) {
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        Eine IP-Adresse gibt es in zwei Schreibweisen. Wir Menschen schreiben vier Zahlen mit Punkten. Der Computer kennt aber nur <strong>0 und 1</strong> – für ihn ist die
        Adresse eine lange Kette aus Bits.
      </p>
      <div class="sv-zwei">
        <span class="sv-zwei__name">Für dich</span>
        <span class="sv-zwei__wert sv-zwei__wert--dez mono">{z.oktette.join('.')}</span>
        <span class="sv-zwei__name">Für den Computer</span>
        <span class="sv-zwei__wert sv-zwei__wert--bin mono">{bitsVon(z.zahl).join('')}</span>
      </div>
      <p class="sv-text">
        Damit man die 32 Bits lesen kann, schneidet man sie in <strong>4 Päckchen zu je 8 Bit</strong>. So ein Päckchen heißt <strong>Oktett</strong> (= 1 Byte). Jedes Oktett wird
        als Dezimalzahl geschrieben:
      </p>
      <Bitband
        zahl={z.zahl}
        klammer
        unter={[0, 1, 2, 3].map((o) => (
          <>
            {o + 1}. Oktett · <strong>8 Bit</strong>
          </>
        ))}
      />
      <p class="sv-formel mono">
        4 Oktette × 8 Bit = <strong>32 Bit</strong>
      </p>
      <div class="sv-fakten">
        <div class="sv-fakt">
          <span class="sv-fakt__titel">Warum nur 0 bis 255?</span>
          <span>
            8 Bits haben 2<sup>8</sup> = <strong>256</strong> Möglichkeiten: von <span class="mono">00000000</span> (= 0) bis <span class="mono">11111111</span> (= 255). Eine 256
            passt nicht mehr in 8 Bits – darum ist z. B. 192.168.1.256 ungültig.
          </span>
        </div>
        <div class="sv-fakt">
          <span class="sv-fakt__titel">Warum die Punkte?</span>
          <span>32 Nullen und Einsen am Stück kann sich niemand merken. Die Punkte trennen nur die vier Päckchen – für den Computer gibt es sie nicht.</span>
        </div>
        <div class="sv-fakt">
          <span class="sv-fakt__titel">Wie viele Adressen gibt es?</span>
          <span>
            2<sup>32</sup> = <strong>4.294.967.296</strong>, rund 4,3 Milliarden. Das reicht nicht für alle Geräte der Welt – darum gibt es private Netze und IPv6.
          </span>
        </div>
      </div>
      <Merke>
        IPv4 = <strong>4 Oktette × 8 Bit = 32 Bit</strong>. Jedes Oktett ist eine Zahl von 0 bis 255.
      </Merke>
    </div>
  );
}

// ---------- 2. Bits ----------

// Nach dem Umrechnen lassen sich die Bits umschalten. Das ändert das Oktett der echten Adresse oben mit,
// damit klar ist: Bits und Dezimalzahl sind dieselbe Adresse. Alle weiteren Schritte rechnen dann damit.
function Bits({ z, ip, setIp }) {
  const [okt, setOkt] = useState(z.index);
  const [gezeigt, setGezeigt] = useState(0);
  const ursprung = useRef(ip); // Adresse beim Öffnen bzw. nach der letzten Eingabe oben
  const selbst = useRef(false); // die letzte Änderung der Adresse kam vom Umschalten hier
  useEffect(() => {
    if (selbst.current) selbst.current = false;
    else {
      // oben eine andere Adresse eingetippt: Umrechnen beginnt von vorn
      ursprung.current = ip;
      setGezeigt(0);
    }
  }, [ip]);
  const wert = z.oktette[okt];
  const schritte = binaerSchritte(wert);
  const fertig = gezeigt >= 8;
  const letzter = gezeigt > 0 && !fertig ? schritte[gezeigt - 1] : null;
  const bits = schritte.map((s) => s.bit);
  const teile = STELLENWERTE.filter((g, j) => bits[j]);
  const geaendert = ip !== ursprung.current;
  const waehle = (i) => {
    setOkt(i);
    setGezeigt(0);
  };
  const kippe = (j) => {
    selbst.current = true;
    setIp(z.oktette.map((o, i) => (i === okt ? o ^ (1 << (7 - j)) : o)).join('.'));
  };

  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        Jedes der 8 Bits hat einen festen <strong>Stellenwert</strong>. Ganz rechts steht 1, nach links verdoppelt er sich: 1, 2, 4, 8 … bis 128. Ein Bit auf 1 heißt: Dieser Wert
        zählt mit.
      </p>
      <div class="sv-wahl" role="group" aria-label="Zahl wählen">
        <span class="sv-wahl__titel">Welche Zahl?</span>
        {z.oktette.map((o, i) => (
          <button key={i} type="button" class={`sv-chip mono ${i === okt ? 'sv-chip--aktiv' : ''}`} aria-pressed={i === okt} onClick={() => waehle(i)}>
            {o}
          </button>
        ))}
      </div>
      <div class="sv-tafel">
        {schritte.map((s, j) => {
          const offen = fertig || j < gezeigt;
          const an = offen && bits[j] === 1;
          return (
            <div key={j} class={`sv-tafel__spalte ${!fertig && j === gezeigt ? 'sv-tafel__spalte--jetzt' : ''}`}>
              <span class={`sv-tafel__wert mono ${an ? 'sv-tafel__wert--an' : ''}`}>{s.gewicht}</span>
              {fertig ? (
                <button
                  type="button"
                  class={`sv-tafel__bit mono ${an ? 'sv-tafel__bit--an' : ''}`}
                  onClick={() => kippe(j)}
                  aria-pressed={an}
                  aria-label={`Bit mit Stellenwert ${s.gewicht} umschalten`}
                >
                  {bits[j]}
                </button>
              ) : (
                <span class={`sv-tafel__bit mono ${offen ? (an ? 'sv-tafel__bit--an' : '') : 'sv-tafel__bit--frage'}`}>{offen ? bits[j] : '?'}</span>
              )}
            </div>
          );
        })}
      </div>
      {!fertig ? (
        <>
          <div class="sv-rechne">
            <span class="sv-rest">
              <span class="sv-rest__name">Noch übrig</span>
              <strong class="mono">{letzter ? letzter.nachher : wert}</strong>
            </span>
            <p class="sv-rechne__text" role="status">
              {!letzter ? (
                <>
                  Wir gehen von links nach rechts. Erste Frage: Passt <strong>128</strong> in <strong>{wert}</strong>?
                </>
              ) : letzter.passt ? (
                <>
                  Passt {letzter.gewicht} in {letzter.vorher}? <strong>Ja → 1.</strong> Abziehen: {letzter.vorher} − {letzter.gewicht} = {letzter.nachher}
                </>
              ) : (
                <>
                  Passt {letzter.gewicht} in {letzter.vorher}? <strong>Nein → 0.</strong> Der Rest bleibt {letzter.vorher}.
                </>
              )}
            </p>
          </div>
          <div class="sv-knoepfe">
            <Knopf variante="akzent" groesse="s" iconRechts="arrow-right" onClick={() => setGezeigt(gezeigt + 1)}>
              {gezeigt === 0 ? 'Erstes Bit' : 'Nächstes Bit'}
            </Knopf>
            <Knopf variante="geist" groesse="s" onClick={() => setGezeigt(8)}>
              Alle auf einmal
            </Knopf>
          </div>
        </>
      ) : (
        <>
          <p class="sv-formel mono">
            {wert} = {teile.length ? teile.join(' + ') : '0'} → <strong>{bits.join('')}</strong>
          </p>
          <Hinweis icon="info">
            {geaendert ? (
              <>
                Oben in der IP-Adresse hat sich das {okt + 1}. Oktett mitgeändert: jetzt <strong class="mono">{ip}</strong>. Alle weiteren Schritte rechnen mit dieser Adresse.{' '}
                <button
                  type="button"
                  class="sv-link sv-link--inline"
                  onClick={() => {
                    selbst.current = true;
                    setIp(ursprung.current);
                  }}
                >
                  zurück zu {ursprung.current}
                </button>
              </>
            ) : (
              'Jetzt du: Klick auf ein Bit, um es an- oder auszuschalten – die Zahl und oben die IP-Adresse ändern sich mit. Alle an ergibt 255, alle aus 0.'
            )}
          </Hinweis>
        </>
      )}
      <Merke>
        Von links nach rechts: <strong>Passt der Stellenwert in den Rest?</strong> Ja → 1 schreiben und abziehen. Nein → 0. Die Reihe{' '}
        <span class="mono">128 · 64 · 32 · 16 · 8 · 4 · 2 · 1</span> brauchst du gleich wieder.
      </Merke>
    </div>
  );
}

// ---------- 3. Präfix ----------

function Praefix({ z, praefix, setPraefix }) {
  // Beim Öffnen färben sich die Netzbits einmal von links nach rechts ein, dann erscheint der Strich
  const [gefuellt, setGefuellt] = useState(false);
  const [einlauf, setEinlauf] = useState(true);
  useEffect(() => {
    const a = setTimeout(() => setGefuellt(true), 200);
    const b = setTimeout(() => setEinlauf(false), 200 + 32 * 18 + 600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);
  const k = netzBitsJeOktett(praefix);
  const h = 32 - praefix;
  const unter = k.map((n) =>
    n === 8 ? (
      <span class="sv-farbe-netz">8 Netz</span>
    ) : n === 0 ? (
      <span class="sv-farbe-host">8 Host</span>
    ) : (
      <>
        <span class="sv-farbe-netz">{n} Netz</span> · <span class="sv-farbe-host">{8 - n} Host</span>
      </>
    ),
  );
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        Zu jeder Adresse gehört ein Präfix, hier <strong class="mono">/{praefix}</strong>. Er heißt:{' '}
        <strong>
          Die ersten {praefix} Bits sind das <span class="sv-farbe-netz">Netz</span>.
        </strong>{' '}
        Nach Bit {praefix} kommt ein Strich. Alles rechts davon ist der <strong class="sv-farbe-host">Host</strong> – das einzelne Gerät.
      </p>
      <Bitband zahl={z.zahl} praefix={praefix} nummern unter={unter} gefuellt={gefuellt} einlauf={einlauf} />
      <p class="sv-formel mono">
        {k.filter((n) => n > 0).join(' + ')} = <span class="sv-farbe-netz">{praefix} Netzbits</span> · 32 − {praefix} = <strong class="sv-farbe-host">{h} Hostbits</strong>
      </p>
      <div class="sv-anschrift">
        <div class="sv-anschrift__teil sv-anschrift__teil--netz">
          <span class="sv-anschrift__name">Netzteil = Straße</span>
          <span>Bei allen Geräten im selben Netz exakt gleich.</span>
        </div>
        <div class="sv-anschrift__teil sv-anschrift__teil--host">
          <span class="sv-anschrift__name">Hostteil = Hausnummer</span>
          <span>
            Für jedes Gerät anders. {h} Hostbits ergeben 2<sup>{h}</sup> = <strong>{tausend(2 ** h)}</strong> Nummern je Netz.
          </span>
        </div>
      </div>
      <StrichKnoepfe praefix={praefix} setPraefix={setPraefix} />
      <Merke>
        Präfix = Anzahl der Netzbits. <strong>Je weiter rechts der Strich, desto kleiner das Netz</strong> – jedes Bit nach rechts halbiert es.
      </Merke>
    </div>
  );
}

// ---------- 4. Maske ----------

function Maske({ z, praefix, setPraefix }) {
  const m = maskeZahl(praefix);
  const maske = oktetteVon(m).join('.');
  const k = z.netzBitsImOktett;
  const nr = z.index + 1;
  const summanden = STELLENWERTE.slice(0, k);
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        Die <strong>Subnetzmaske</strong> (auch Netzmaske, kurz Maske) ist <strong>derselbe Strich, nur als Zahl geschrieben</strong>: Jedes Netzbit wird eine <strong>1</strong>,
        jedes Hostbit eine <strong>0</strong>. Dann rechnet man jedes Oktett in eine Dezimalzahl um – wie eben in Schritt 2. Präfix (/{praefix}) und Subnetzmaske sind also zwei
        Schreibweisen derselben Sache.
      </p>
      <div class="sv-paar">
        <span class="sv-paar__name">Deine Adresse</span>
        <Bitband zahl={z.zahl} praefix={praefix} />
        <span class="sv-paar__name">Subnetzmaske: Netzbits → 1, Hostbits → 0</span>
        <Bitband zahl={m} praefix={praefix} />
      </div>
      <p class="sv-formel mono">
        {k > 0 ? (
          <>
            {nr}. Oktett: {'1'.repeat(k)}
            {'0'.repeat(8 - k)} → {summanden.join(' + ')} = <strong>{z.maskenwert}</strong>
          </>
        ) : (
          <>Der Strich liegt genau zwischen zwei Oktetten – in der Subnetzmaske stehen nur 255 und 0.</>
        )}
      </p>
      <div class="sv-masken">
        <span class="sv-masken__titel">Nur diese 9 Werte kann ein Oktett der Subnetzmaske haben. Von links immer den nächsten Stellenwert dazu:</span>
        <div class="sv-masken__reihe">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} class={`sv-masken__zelle ${n === k && n > 0 ? 'sv-masken__zelle--aktiv' : ''}`}>
              <span class="sv-masken__einsen">{n === 1 ? '1 Eins' : `${n} Einsen`}</span>
              <span class="sv-masken__wert mono">{maskenwert(n)}</span>
            </div>
          ))}
        </div>
      </div>
      <p class="sv-formel mono">
        Präfix <strong>/{praefix}</strong> entspricht Subnetzmaske <strong>{maske}</strong>
      </p>
      <StrichKnoepfe praefix={praefix} setPraefix={setPraefix} />
      <Merke>
        Der Präfix <span class="mono">/{praefix}</span> und die Subnetzmaske <span class="mono">{maske}</span> sagen dasselbe:{' '}
        <strong>
          {praefix} Einsen, dann {32 - praefix} Nullen.
        </strong>
      </Merke>
    </div>
  );
}

// ---------- 5. Oktett ----------

const ROLLEN = {
  netz: { name: 'abschreiben', text: 'ganz Netz' },
  strich: { name: 'hier rechnen', text: 'der Strich geht hindurch' },
  host: { name: '0 oder 255', text: 'ganz Host' },
};

function Oktett({ z, praefix }) {
  const k = netzBitsJeOktett(praefix);
  const rollen = oktettRollen(praefix);
  const ohne = z.netzBitsImOktett === 0;
  const nr = z.index + 1;
  const vorschau = (rest) => z.oktette.map((o, i) => (rollen[i] === 'netz' ? o : rollen[i] === 'strich' ? '?' : rest));
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        Du musst nicht alle 32 Bits ausrechnen. Zerleg den Präfix in Achter:{' '}
        <strong class="mono">
          /{praefix} = {k.filter((n) => n > 0).join(' + ')}
        </strong>
        .{' '}
        {ohne ? (
          <>
            Der Strich liegt genau zwischen dem {nr - 1}. und dem {nr}. Oktett. Davor ist alles Netz, danach alles Host – <strong>hier gibt es nichts zu rechnen.</strong>
          </>
        ) : (
          <>
            {z.index === 1 ? 'Das 1. Oktett ist' : `Die ersten ${z.index} Oktette sind`} ganz Netz. Durch das <strong>{nr}. Oktett</strong> geht der Strich – nur dort wird
            gerechnet.
          </>
        )}
      </p>
      <div class="sv-oktette">
        {rollen.map((rolle, i) => (
          <div key={i} class={`sv-okt sv-okt--${rolle}`}>
            <span class="sv-okt__nr">{i + 1}. Oktett</span>
            <span class="sv-okt__wert mono">{z.oktette[i]}</span>
            <OktettBits wert={z.oktette[i]} netzBits={k[i]} />
            <span class="sv-okt__rolle">{ROLLEN[rolle].name}</span>
            <span class="sv-okt__text">{ROLLEN[rolle].text}</span>
          </div>
        ))}
      </div>
      <div class="sv-vorschau">
        {[
          { name: 'Netzadresse', rest: 0 },
          { name: 'Broadcast', rest: 255 },
        ].map((zeile) => (
          <div key={zeile.name} class="sv-vorschau__zeile">
            <span class="sv-vorschau__name">{zeile.name}</span>
            <IpZellen ip={vorschau(zeile.rest).join('.')} rollen={rollen} />
          </div>
        ))}
        <span class="sv-vorschau__text">
          {ohne ? `Fertig, ohne zu rechnen: Netzadresse ${z.n.netz}, Broadcast ${z.n.broadcast}.` : 'Nur das ? musst du ausrechnen – das zeigen die nächsten zwei Schritte.'}
        </span>
      </div>
      <Merke>
        Davor: <strong>abschreiben</strong>. Im Oktett mit dem Strich: <strong>rechnen</strong>. Danach: <strong>0</strong> bei der Netzadresse, <strong>255</strong> beim
        Broadcast.
      </Merke>
    </div>
  );
}

// ---------- 6. Blöcke ----------

function Bloecke({ z, praefix, setPraefix }) {
  const k = z.netzBitsImOktett;
  const hb = 8 - k;
  const anzahl = 256 / z.block;
  const nr = z.index + 1;
  return (
    <div class="sv-inhalt">
      {k > 0 ? (
        <p class="sv-text">
          Im {nr}. Oktett sind {bitWort(k)} Netz und {bitWort(hb)} Host. Die Hostbits zählen von{' '}
          <span class="mono">
            {'0'.repeat(hb)} bis {'1'.repeat(hb)}
          </span>{' '}
          – das sind 2<sup>{hb}</sup> = <strong>{z.block} Zahlen</strong>. So groß ist ein Block. Die Netzbits sagen, <strong>welcher</strong> Block: 2<sup>{k}</sup> = {anzahl}{' '}
          Blöcke.
        </p>
      ) : (
        <p class="sv-text">
          Bei /{praefix} liegt der Strich genau vor dem {nr}. Oktett. Alle 8 Bits sind Host – es gibt nur <strong>einen Block</strong> von 0 bis 255 (2<sup>8</sup> = 256).
        </p>
      )}
      {k > 0 && (
        <div class="sv-blockgr">
          <div class="sv-blockgr__reihe">
            {STELLENWERTE.map((g, j) => (
              <span
                key={j}
                class={`sv-blockgr__zelle mono ${j < k ? 'sv-blockgr__zelle--netz' : ''} ${j === k - 1 ? 'sv-blockgr__zelle--letzte' : ''} ${j === k ? 'sv-blockgr__zelle--strich' : ''}`}
              >
                {g}
              </span>
            ))}
          </div>
          <p class="sv-blockgr__text">
            Abkürzung: <strong>Blockgröße = Stellenwert des letzten Netzbits = {z.block}</strong>. Probe: 256 − {z.maskenwert} (Subnetzmaske) = {z.block}.
          </p>
        </div>
      )}
      <Strahl z={z} codes />
      <p class="sv-formel mono">
        {anzahl} {anzahl === 1 ? 'Block' : 'Blöcke'} × {z.block} = 256
      </p>
      <StrichKnoepfe praefix={praefix} setPraefix={setPraefix} links="Blöcke zusammenlegen" rechts="Blöcke halbieren" />
      <Merke>
        {anzahl === 1 ? (
          <>
            Liegt der Strich zwischen zwei Oktetten, ist das ganze Oktett <strong>ein Block: 0 bis 255</strong>.
          </>
        ) : (
          <>
            Blöcke beginnen immer bei <strong>Vielfachen der Blockgröße</strong>:{' '}
            <span class="mono">
              {Array.from({ length: Math.min(anzahl, 5) }, (_, i) => i * z.block).join(', ')}
              {anzahl > 5 && ' …'}
            </span>
            {anzahl > 5 ? '' : '.'} Jede Zahl von 0 bis 255 gehört zu genau einem Block.
          </>
        )}
      </Merke>
    </div>
  );
}

// ---------- 7. Dein Block ----------

const START_HINWEIS = {
  'kein-anfang': (z, v) => `${v} ist kein Blockanfang – Blöcke beginnen nur bei Vielfachen von ${z.block}.`,
  'zu-weit': (z, v) => `Zu weit: Der Block ab ${v} fängt erst nach ${z.wert} an.`,
  'zu-frueh': (z, v) => `Zu früh: Der Block ${v}–${v + z.block - 1} ist schon vor ${z.wert} zu Ende.`,
};
const ENDE_HINWEIS = {
  'naechster-anfang': (z, v) => `Fast! ${z.start} + ${z.block} = ${v} ist schon der Anfang des nächsten Blocks. Dein Block endet eins davor.`,
  'zu-kurz': (z, v) => `Zu kurz: Von ${z.start} bis ${v} sind es nur ${v - z.start + 1} Zahlen, ein Block hat aber ${z.block}.`,
  'zu-weit': () => 'Zu weit – das gehört schon zum nächsten Block.',
};

function DeinBlock({ z, praefix }) {
  const nurEiner = z.block === 256;
  const [startOk, setStartOk] = useState(nurEiner);
  const [endeOk, setEndeOk] = useState(nurEiner);
  const nr = z.index + 1;
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        Im {nr}. Oktett deiner Adresse steht die <strong class="mono">{z.wert}</strong>.{' '}
        {nurEiner ? `Bei /${praefix} gibt es dort nur einen Block: 0 bis 255.` : 'In welchem Block liegt sie?'}
      </p>
      <Strahl z={z} marke={z.wert} aktiv={startOk ? z.start : null} />
      {!nurEiner && (
        <Frage
          titel="Bei welcher Zahl beginnt der Block?"
          optionen={startOptionen(z)}
          richtig={z.start}
          hinweis={(v) => START_HINWEIS[bewerteStart(z, v)](z, v)}
          onGeloest={() => setStartOk(true)}
        />
      )}
      {startOk && !nurEiner && (
        <>
          <p class="sv-formel mono">
            {z.wert} : {z.block} = {z.blockNr} Rest {z.wert - z.start} → {z.blockNr} × {z.block} = <strong>{z.start}</strong>
          </p>
          <Frage
            titel={`Und wo endet der Block, der bei ${z.start} beginnt?`}
            optionen={endeOptionen(z)}
            richtig={z.ende}
            hinweis={(v) => ENDE_HINWEIS[bewerteEnde(z, v)](z, v)}
            onGeloest={() => setEndeOk(true)}
          />
        </>
      )}
      {endeOk && (
        <>
          <Grenze z={z} />
          <AnfangEnde z={z} />
          <Merke>
            <strong>Ende = nächster Blockanfang − 1.</strong>{' '}
            {z.ende < 255 ? (
              <>
                Der häufigste Fehler: {z.start} + {z.block} = {z.ende + 1} ist nicht das Ende, sondern schon der Anfang des Nachbarn.
              </>
            ) : (
              'Hier gibt es keinen nächsten Block mehr, also endet er bei 255.'
            )}
          </Merke>
        </>
      )}
    </div>
  );
}

// Lupe auf die Blockgrenze: die letzten zwei Zahlen deines Blocks, die Wand, die ersten zwei des nächsten
function Grenze({ z }) {
  const naechster = z.ende + 1;
  return (
    <div class="sv-grenze">
      <div class="sv-grenze__zellen">
        {[z.ende - 1, z.ende]
          .filter((x) => x >= z.start)
          .map((x) => (
            <span key={x} class="sv-grenze__zelle sv-grenze__zelle--dein mono">
              {x}
            </span>
          ))}
        <span class="sv-grenze__wand" aria-hidden="true" />
        {naechster <= 255 ? (
          [naechster, naechster + 1]
            .filter((x) => x <= 255)
            .map((x) => (
              <span key={x} class="sv-grenze__zelle mono">
                {x}
              </span>
            ))
        ) : (
          <span class="sv-grenze__zelle sv-grenze__zelle--leer">Ende des Oktetts</span>
        )}
      </div>
      <div class="sv-grenze__legende">
        <span>
          ← dein Block {z.start}–{z.ende}
        </span>
        {naechster <= 255 && <span>nächster Block ab {naechster} →</span>}
      </div>
    </div>
  );
}

// Anfang und Ende als Bits: links vom Strich gleich, rechts lauter 0 bzw. lauter 1
function AnfangEnde({ z }) {
  const k = z.netzBitsImOktett;
  return (
    <div class="sv-ae">
      <p class="sv-ae__titel">Warum genau dort? Schau auf die Bits:</p>
      {[
        { name: 'Anfang', wert: z.start, text: 'alle Hostbits 0' },
        { name: 'Ende', wert: z.ende, text: 'alle Hostbits 1' },
      ].map((r) => (
        <div key={r.name} class="sv-ae__zeile">
          <span class="sv-ae__name">{r.name}</span>
          <OktettBits wert={r.wert} netzBits={k} />
          <span class="sv-ae__wert mono">= {r.wert}</span>
          <span class="sv-ae__text">{r.text}</span>
        </div>
      ))}
      <p class="sv-ae__fuss">
        {k > 0
          ? 'Links vom Strich bleibt alles gleich. Rechts zählen die Hostbits von lauter 0 bis lauter 1 – mehr Platz gibt es im Block nicht.'
          : 'Alle 8 Bits sind Host: Sie zählen von lauter 0 bis lauter 1.'}
        {z.index < 3 && ' In den Oktetten danach genauso: beim Anfang 0, beim Ende 255.'}
      </p>
    </div>
  );
}

// ---------- 8. Adressen ----------

const ZEILEN = [
  { id: 'netz', name: 'Netzadresse', reserviert: true },
  { id: 'erster', name: 'Erster Host' },
  { id: 'letzter', name: 'Letzter Host' },
  { id: 'broadcast', name: 'Broadcast', reserviert: true },
];
// Erst der Rahmen, dann das Innere
const AUFDECKEN = ['netz', 'broadcast', 'erster', 'letzter'];

function Adressen({ z, praefix }) {
  const [offen, setOffen] = useState(0);
  const n = z.n;
  const rollen = oktettRollen(praefix);
  const ohne = z.netzBitsImOktett === 0;
  const danach = z.index < 3 || ohne;
  const rezept = {
    netz: ohne ? 'davor abschreiben · danach 0' : `abschreiben · Blockanfang ${z.start}${danach ? ' · danach 0' : ''}`,
    broadcast: ohne ? 'davor abschreiben · danach 255' : `abschreiben · Blockende ${z.ende}${danach ? ' · danach 255' : ''}`,
    erster: 'Netzadresse + 1 (ganz hinten)',
    letzter: 'Broadcast − 1 (ganz hinten)',
  };
  const h = 32 - praefix;
  const alle = offen >= AUFDECKEN.length;
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        Jetzt setzt du die ganzen Adressen zusammen. Erst den <strong>Rahmen</strong> (Netzadresse und Broadcast), dann das <strong>Innere</strong>. Überleg jeweils kurz selbst,
        dann deck auf.
      </p>
      <div class="sv-adressen">
        {ZEILEN.map((zeile) => {
          const pos = AUFDECKEN.indexOf(zeile.id);
          const sichtbar = pos < offen;
          const dran = pos === offen;
          return (
            <div key={zeile.id} class={`sv-adresse ${zeile.reserviert ? 'sv-adresse--reserviert' : ''} ${dran ? 'sv-adresse--dran' : ''}`}>
              <div class="sv-adresse__kopf">
                <span class="sv-adresse__name">{zeile.name}</span>
                <span class="sv-adresse__rezept">{rezept[zeile.id]}</span>
              </div>
              <div class="sv-adresse__wert">
                {sichtbar ? (
                  <IpZellen ip={n[zeile.id]} rollen={rollen} />
                ) : dran ? (
                  <Knopf variante="akzent" groesse="s" icon="eye" onClick={() => setOffen(offen + 1)}>
                    Aufdecken
                  </Knopf>
                ) : (
                  <span class="sv-adresse__leer mono">?.?.?.?</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!alle ? (
        <button type="button" class="sv-link" onClick={() => setOffen(AUFDECKEN.length)}>
          Alle aufdecken
        </button>
      ) : (
        <>
          <Legende rollen={rollen} />
          <p class="sv-formel mono">
            {h} Hostbits → 2<sup>{h}</sup> = {tausend(n.adressen)} Adressen − 2 = <strong>{tausend(n.hostsKlassisch)} Hosts</strong>
          </p>
          <Merke>
            Netzadresse und Broadcast gehören dem Netz selbst, nicht einem Gerät. Darum immer{' '}
            <strong>
              2<sup>h</sup> − 2
            </strong>{' '}
            (h = Anzahl Hostbits).
          </Merke>
        </>
      )}
    </div>
  );
}

// ---------- 9. Unter /24 ----------

function Unter24({ ip, praefix }) {
  const g = useMemo(() => grossesNetz(ip, praefix), [ip, praefix]);
  const [geloest, setGeloest] = useState(false);
  const hb = 32 - g.praefix;
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        {g.eigenes ? (
          <>Dein Präfix /{praefix} ist kleiner als /24 – hier wird es spannend. </>
        ) : (
          <>
            Dein /{praefix} rechnet im 4. Oktett. In der Prüfung kommen aber auch Präfixe <strong>unter /24</strong> vor – hier dieselbe Adresse mit <strong>/{g.praefix}</strong>
            .{' '}
          </>
        )}
        Ein /{g.praefix} hat 2<sup>{hb}</sup> = {tausend(g.adressen)} Adressen. Das ist mehr, als in ein Oktett passt: Das Netz besteht aus{' '}
        <strong>{tausend(g.stuecke)} Stücken zu je 256</strong>.
      </p>
      <div class="sv-stuecke">
        <span class="sv-stuecke__titel">
          Ein einziges Netz /{g.praefix}: <span class="mono">{g.netz}</span> bis <span class="mono">{g.broadcast}</span>
        </span>
        {g.zeilen.map((s) => {
          if (s === null)
            return (
              <div key="luecke" class="sv-stuecke__luecke">
                … {tausend(g.stuecke - 3)} weitere Stücke …
              </div>
            );
          const erstes = s.nr === 0;
          const letztes = s.nr === g.stuecke - 1;
          return (
            <div key={s.nr} class="sv-stueck">
              <span class="sv-stueck__ende">
                <span class="mono">{s.von}</span>
                {erstes ? <span class="sv-stueck__marke sv-stueck__marke--res">Netzadresse</span> : <span class="sv-stueck__marke sv-stueck__marke--host">Host</span>}
              </span>
              <span
                class={`sv-stueck__balken ${erstes ? 'sv-stueck__balken--start-res' : 'sv-stueck__balken--start-host'} ${
                  letztes ? 'sv-stueck__balken--ende-res' : 'sv-stueck__balken--ende-host'
                }`}
                aria-hidden="true"
              />
              <span class="sv-stueck__ende sv-stueck__ende--rechts">
                <span class="mono">{s.bis}</span>
                {letztes ? <span class="sv-stueck__marke sv-stueck__marke--res">Broadcast</span> : <span class="sv-stueck__marke sv-stueck__marke--host">Host</span>}
              </span>
            </div>
          );
        })}
      </div>
      <Frage
        titel={`Darf ein PC die Adresse ${g.endeErstes} bekommen?`}
        optionen={['ja', 'nein']}
        richtig="ja"
        text
        format={(v) => (v === 'ja' ? 'Ja, ganz normaler Host' : 'Nein, das ist ein Broadcast')}
        hinweis={() => `Schau genau hin: Das Netz geht bis ${g.broadcast}. ${g.endeErstes} liegt mittendrin, nicht am Ende.`}
        onGeloest={() => setGeloest(true)}
      />
      {geloest && (
        <>
          <div class="sv-hb">
            <span class="sv-hb__titel">Entscheidend sind alle {hb} Hostbits – nicht nur das letzte Oktett:</span>
            {[
              { ip: g.endeErstes, text: 'nicht alle 1 → normaler Host', ok: true },
              { ip: g.anfangZweites, text: 'nicht alle 0 → normaler Host', ok: true },
              { ip: g.broadcast, text: 'alle 1 → Broadcast', ok: false },
            ].map((r) => (
              <div key={r.ip} class="sv-hb__zeile">
                <span class="sv-hb__ip mono">{r.ip}</span>
                <span class="sv-hb__bits">
                  {hostBits(r.ip, g.praefix)
                    .split(' ')
                    .map((gruppe, gi) => (
                      <span key={gi} class="sv-hb__gruppe">
                        {[...gruppe].map((bit, bi) => (
                          <i key={bi} class="sv-bit sv-bit--host">
                            {bit}
                          </i>
                        ))}
                      </span>
                    ))}
                </span>
                <span class={`sv-hb__urteil ${r.ok ? 'sv-hb__urteil--host' : 'sv-hb__urteil--res'}`}>{r.text}</span>
              </div>
            ))}
          </div>
          <p class="sv-formel mono">
            /{g.praefix}: {g.netz} bis {g.broadcast} · 2<sup>{hb}</sup> − 2 = <strong>{tausend(g.hosts)} Hosts</strong>
          </p>
          <Merke>
            Unter /24 sind Adressen wie <span class="mono">x.255</span> und <span class="mono">x.0</span> oft <strong>ganz normale Hosts</strong>. Reserviert sind nur die
            allererste und die allerletzte Adresse des <strong>ganzen</strong> Netzes.
          </Merke>
        </>
      )}
    </div>
  );
}

// ---------- 10. Gateway ----------

function Gateway({ z, ip, praefix }) {
  const ziele = useMemo(() => vergleichsZiele(ip, praefix), [ip, praefix]);
  const [antworten, setAntworten] = useState({});
  const [eigenes, setEigenes] = useState('');
  const n = z.n;
  const gateway = ip === n.erster ? n.letzter : n.erster;
  const eigenesIp = leseIp(eigenes);
  const eigenesZiel = eigenesIp && { id: 'eigenes', name: 'Dein Ziel', ip: eigenesIp, netz: netz(eigenesIp, praefix).netz };
  if (eigenesZiel) eigenesZiel.gleich = eigenesZiel.netz === n.netz;
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        Bevor dein PC ein Paket losschickt, prüft er <strong>selbst</strong>: Liegt das Ziel in meinem Netz? Dazu nimmt er <strong>seine eigene Subnetzmaske</strong>, rechnet damit
        die Netzadresse des Ziels aus und vergleicht sie mit seiner. Gleich → direkt hin. Verschieden → ab zum <strong>Standardgateway</strong> (dem Router).
      </p>
      <div class="sv-pc">
        <span class="sv-pc__teil">
          <span class="sv-pc__name">Dein PC</span>
          <strong class="mono">
            {ip}/{praefix}
          </strong>
        </span>
        <span class="sv-pc__teil">
          <span class="sv-pc__name">Dein Netz</span>
          <span class="mono sv-farbe-netz">{n.netz}</span>
        </span>
        <span class="sv-pc__teil">
          <span class="sv-pc__name">Gateway</span>
          <span class="mono">{gateway}</span>
        </span>
      </div>
      <div class="sv-ziele">
        {ziele.map((ziel) => (
          <ZielKarte key={ziel.id} ziel={ziel} meinNetz={n.netz} praefix={praefix} antwort={antworten[ziel.id]} onAntwort={(a) => setAntworten({ ...antworten, [ziel.id]: a })} />
        ))}
      </div>
      <div class="sv-eigenes">
        <label class="sv-eigenes__feld">
          <span class="sv-eigenes__name">Eigenes Ziel ausprobieren</span>
          <input
            class={`feld mono ${eigenes && !eigenesIp ? 'feld--falsch' : ''}`}
            value={eigenes}
            placeholder="z. B. 192.168.40.20"
            inputMode="decimal"
            spellcheck={false}
            autocomplete="off"
            onInput={(e) => setEigenes(e.currentTarget.value)}
          />
        </label>
        {eigenesZiel && <ZielKarte ziel={eigenesZiel} meinNetz={n.netz} praefix={praefix} antwort="gezeigt" />}
      </div>
      <Merke>
        „Netz“ ist eine <strong>Rechnung im PC</strong> (eigene IP + eigene Subnetzmaske), kein Kabel. Darum brauchen alle Geräte eines Netzes dieselbe Subnetzmaske – und das
        Gateway muss selbst im eigenen Netz liegen.
      </Merke>
    </div>
  );
}

// Ein Ziel: erst raten (direkt oder Gateway), dann die Rechnung des PCs und der Weg des Pakets
function ZielKarte({ ziel, meinNetz, praefix, antwort, onAntwort }) {
  const geantwortet = antwort !== undefined;
  const richtig = ziel.gleich ? 'direkt' : 'gateway';
  return (
    <div class="sv-ziel">
      <div class="sv-ziel__kopf">
        <span class="sv-ziel__name">
          {ziel.name}
          <strong class="sv-ziel__ip mono">{ziel.ip}</strong>
        </span>
        {!geantwortet && (
          <div class="sv-knoepfe" role="group" aria-label={`Wie kommt das Paket zu ${ziel.ip}?`}>
            <Knopf groesse="s" onClick={() => onAntwort('direkt')}>
              Direkt
            </Knopf>
            <Knopf groesse="s" onClick={() => onAntwort('gateway')}>
              Übers Gateway
            </Knopf>
          </div>
        )}
      </div>
      {geantwortet && (
        <>
          {antwort !== 'gezeigt' && (
            <Rueckmeldung ok={antwort === richtig}>
              {antwort === richtig ? 'Richtig!' : `Nein – ${ziel.gleich ? 'das Ziel ist im selben Netz' : 'das ist ein anderes Netz'}.`}
            </Rueckmeldung>
          )}
          <p class="sv-ziel__rechnung mono">
            Netz des Ziels mit /{praefix}: <strong>{ziel.netz}</strong> {ziel.gleich ? '=' : '≠'} {meinNetz} → {ziel.gleich ? 'gleiches Netz' : 'anderes Netz'}
          </p>
          <Route direkt={ziel.gleich} ziel={ziel.name} />
        </>
      )}
    </div>
  );
}

function Route({ direkt, ziel }) {
  const stationen = direkt ? ['Dein PC', 'Switch', ziel] : ['Dein PC', 'Switch', 'Gateway (Router)', ziel];
  return (
    <div class="sv-route" aria-label={`Weg des Pakets: ${stationen.join(', ')}`}>
      {stationen.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && <Icon name="arrow-right" groesse={13} />}
          <span class={`sv-station ${s.startsWith('Gateway') ? 'sv-station--gw' : ''}`}>{s}</span>
        </Fragment>
      ))}
    </div>
  );
}

// ---------- 11. Aufteilen ----------

function Aufteilen({ praefix, setPraefix }) {
  const { basis, gesamt, zeilen } = aufteilTabelle(praefix);
  const jetzt = zeilen.find((r) => r.praefix === praefix);
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        Ein /{basis} hat {tausend(gesamt)} Adressen. Teilt man es in kleinere Netze, geht <strong>keine Adresse verloren</strong> – sie verteilen sich nur auf mehr Netze. Jedes
        Netz kostet bloß <strong>2 Adressen</strong>: seine Netzadresse und seinen Broadcast.
      </p>
      <AdressBalken praefix={praefix} jetzt={jetzt} gesamt={gesamt} />
      <div class="sv-legende">
        <span>
          <i class="sv-legende__farbe sv-legende__farbe--geraet" /> für Geräte (Hosts)
        </span>
        <span>
          <i class="sv-legende__farbe sv-legende__farbe--res" /> reserviert (Netzadresse + Broadcast)
        </span>
      </div>
      <p class="sv-formel mono">
        {tausend(jetzt.netze)} {jetzt.netze === 1 ? 'Netz' : 'Netze'} × {tausend(jetzt.adressen)} = {tausend(gesamt)} · davon {tausend(jetzt.hostsGesamt)} für Geräte,{' '}
        <span class="sv-farbe-res">{tausend(jetzt.reserviert)} reserviert</span>
      </p>
      <div class="sv-tabelle-rahmen">
        <table class="sv-tabelle">
          <thead>
            <tr>
              <th>Präfix</th>
              <th>Netze</th>
              <th>Adressen je Netz</th>
              <th>Hosts je Netz</th>
              <th>reserviert</th>
            </tr>
          </thead>
          <tbody>
            {zeilen.map((r) => (
              <tr key={r.praefix} class={r.praefix === praefix ? 'sv-tabelle__aktiv' : ''}>
                <td>
                  <button type="button" class="sv-tabelle__wahl mono" onClick={() => setPraefix(r.praefix)} aria-pressed={r.praefix === praefix}>
                    /{r.praefix}
                  </button>
                </td>
                <td>{tausend(r.netze)}</td>
                <td>{tausend(r.adressen)}</td>
                <td>{tausend(r.hosts)}</td>
                <td>{tausend(r.reserviert)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="sv-klein">Präfix anklicken, um ihn zu wählen. „Netze × Adressen je Netz“ ergibt in jeder Zeile {tausend(gesamt)}.</p>
      <div class="sv-wozu">
        <span class="sv-wozu__titel">Wozu kleine Netze?</span>
        <ul>
          <li>
            <strong>Trennen:</strong> Gäste-WLAN, Server und Buchhaltung bekommen eigene Netze. Dazwischen regelt der Router bzw. die Firewall, wer wohin darf.
          </li>
          <li>
            <strong>Weniger Broadcast:</strong> Ein Broadcast erreicht nur das eigene Netz, nicht hunderte Geräte.
          </li>
          <li>
            <strong>Passende Größe:</strong> Eine Leitung zwischen zwei Routern braucht genau 2 Adressen → /30. Ein ganzes /24 dafür würde 252 Adressen verschwenden.
          </li>
        </ul>
      </div>
      <Merke>
        Subnetting heißt <strong>aufteilen, nicht wegnehmen</strong>: Jedes Netz bekommt so viele Adressen, wie es braucht, und zahlt dafür nur 2.
      </Merke>
    </div>
  );
}

// Ein /24 (oder kleiner): jede Adresse ein Strich, Netzadresse und Broadcast jedes Netzes rot. Bei größeren Bereichen
// wären einzelne Adressen zu schmal – dann die Netze als Blöcke und darunter der Anteil für Geräte und reserviert.
function AdressBalken({ praefix, jetzt, gesamt }) {
  const block = 2 ** (32 - praefix);
  if (gesamt <= 256)
    return (
      <svg class="sv-balken" viewBox="0 0 256 24" preserveAspectRatio="none" role="img" aria-label={`${jetzt.netze} Netze zu je ${block} Adressen, je Netz 2 reserviert`}>
        {Array.from({ length: 256 }, (_, i) => {
          const pos = i % block;
          return <rect key={i} x={i} y="0" width="1.02" height="24" class={pos === 0 || pos === block - 1 ? 'sv-balken__res' : 'sv-balken__geraet'} />;
        })}
        {block >= 8 &&
          Array.from({ length: jetzt.netze - 1 }, (_, j) => (
            <line key={j} x1={(j + 1) * block} x2={(j + 1) * block} y1="0" y2="24" class="sv-balken__grenze" vector-effect="non-scaling-stroke" />
          ))}
      </svg>
    );
  return (
    <div class="sv-balken-gross">
      <div class={`sv-strahl__leiste ${jetzt.netze > 32 ? 'sv-strahl__leiste--dicht' : ''}`} role="img" aria-label={`${jetzt.netze} Netze`}>
        {Array.from({ length: jetzt.netze }, (_, i) => (
          <span key={i} class={`sv-block ${i % 2 ? 'sv-block--zwei' : ''}`} />
        ))}
      </div>
      <div class="sv-anteil" role="img" aria-label={`${jetzt.hostsGesamt} Adressen für Geräte, ${jetzt.reserviert} reserviert`}>
        <span class="sv-anteil__geraet" style={{ flexGrow: jetzt.hostsGesamt }} />
        <span class="sv-anteil__res" style={{ flexGrow: jetzt.reserviert }} />
      </div>
    </div>
  );
}

// ---------- 12. Rechenweg ----------

function Rechenweg({ ip, praefix }) {
  const [aufgabe, setAufgabe] = useState(() => zufallsAufgabe(zufall()));
  return (
    <div class="sv-inhalt">
      <p class="sv-text">
        In der Prüfung hast du keine Bilder, nur Stift und Papier. Dann rechnest du so – hier mit deiner Adresse{' '}
        <strong class="mono">
          {ip}/{praefix}
        </strong>
        :
      </p>
      <RechenwegListe ip={ip} praefix={praefix} />
      <Merke>
        <strong>
          Zerlegen → Blockgröße → Anfang → Ende → abschreiben, 0 und 255 → 2<sup>h</sup> − 2.
        </strong>{' '}
        Mehr braucht es nicht.
      </Merke>
      <JetztDu key={`${aufgabe.ip}/${aufgabe.praefix}`} aufgabe={aufgabe} onNeu={() => setAufgabe(zufallsAufgabe(zufall()))} />
      <a class="sv-weiter" href={link('AP1', 'trainer', 'subnetz', { modus: 'analyse' })}>
        Mehr üben mit „Netz bestimmen“ <Icon name="arrow-right" groesse={14} />
      </a>
    </div>
  );
}

function RechenwegListe({ ip, praefix }) {
  const r = rechenweg(ip, praefix);
  const danach = r.nr < 4;
  const hosts = (
    <>
      {r.erster} bis {r.letzter} · 2<sup>{r.hostBits}</sup> − 2 = <strong>{tausend(r.hosts)}</strong>
    </>
  );
  const schritte = r.ohneRechnung
    ? [
        [
          'Präfix zerlegen',
          <>
            /{praefix} = {r.teile.join(' + ')} → Strich genau nach dem {r.nr - 1}. Oktett, nichts zu rechnen
          </>,
        ],
        [
          'Netzadresse',
          <>
            abschreiben · danach 0 → <strong>{r.netz}</strong>
          </>,
        ],
        [
          'Broadcast',
          <>
            abschreiben · danach 255 → <strong>{r.broadcast}</strong>
          </>,
        ],
        ['Hosts', hosts],
      ]
    : [
        [
          'Präfix zerlegen',
          <>
            /{praefix} = {r.teile.join(' + ')} → Strich im {r.nr}. Oktett ({r.wert}), {bitWort(r.netzBits)} Netz
          </>,
        ],
        [
          'Blockgröße',
          <>
            letztes Netzbit = <strong>{r.block}</strong> (Probe: 256 − {r.maskenwert} = {r.block})
          </>,
        ],
        [
          'Blockanfang',
          <>
            {r.wert} : {r.block} = {r.blockNr} Rest {r.rest} → {r.blockNr} × {r.block} = <strong>{r.start}</strong>
          </>,
        ],
        [
          'Blockende',
          <>
            {r.start} + {r.block} − 1 = <strong>{r.ende}</strong>
          </>,
        ],
        [
          'Netzadresse',
          <>
            abschreiben · {r.start}
            {danach ? ' · danach 0' : ''} → <strong>{r.netz}</strong>
          </>,
        ],
        [
          'Broadcast',
          <>
            abschreiben · {r.ende}
            {danach ? ' · danach 255' : ''} → <strong>{r.broadcast}</strong>
          </>,
        ],
        ['Hosts', hosts],
      ];
  return (
    <ol class="sv-rezept">
      {schritte.map(([name, inhalt], i) => (
        <li key={name} class="sv-rezept__schritt">
          <span class="sv-rezept__nr mono">{i + 1}</span>
          <span class="sv-rezept__name">{name}</span>
          <span class="sv-rezept__inhalt mono">{inhalt}</span>
        </li>
      ))}
    </ol>
  );
}

// Selbst rechnen: Netzadresse, Broadcast und Anzahl Hosts zu einer neuen Adresse, mit Lösungsweg auf Wunsch
function JetztDu({ aufgabe, onNeu }) {
  const { ip, praefix } = aufgabe;
  const n = netz(ip, praefix);
  const [werte, setWerte] = useState({ netz: '', broadcast: '', hosts: '' });
  const [geprueft, setGeprueft] = useState(false);
  const [weg, setWeg] = useState(false);
  const felder = [
    { id: 'netz', name: 'Netzadresse', ok: (t) => leseIp(t) === n.netz, platz: 'z. B. 10.0.0.0', modus: 'decimal' },
    { id: 'broadcast', name: 'Broadcast', ok: (t) => leseIp(t) === n.broadcast, platz: 'z. B. 10.0.0.255', modus: 'decimal' },
    { id: 'hosts', name: 'Anzahl Hosts', ok: (t) => leseZahl(t) === n.hostsKlassisch, platz: 'z. B. 254', modus: 'numeric' },
  ];
  const alleOk = felder.every((f) => f.ok(werte[f.id]));
  return (
    <section class="sv-jetzt" aria-label="Jetzt du">
      <div class="sv-jetzt__kopf">
        <span class="ueberschrift-klein ueberschrift-klein--akzent">Jetzt du</span>
        <span class="sv-jetzt__aufgabe mono">
          {ip}/{praefix}
        </span>
      </div>
      <form
        class="sv-jetzt__felder"
        onSubmit={(e) => {
          e.preventDefault();
          setGeprueft(true);
        }}
      >
        {felder.map((f) => {
          const zustand = geprueft ? (f.ok(werte[f.id]) ? 'richtig' : 'falsch') : '';
          return (
            <label key={f.id} class="sv-jetzt__feld">
              <span class="sv-jetzt__name">{f.name}</span>
              <input
                class={`feld mono ${zustand ? `feld--${zustand}` : ''}`}
                value={werte[f.id]}
                placeholder={f.platz}
                inputMode={f.modus}
                spellcheck={false}
                autocomplete="off"
                onInput={(e) => {
                  setWerte({ ...werte, [f.id]: e.currentTarget.value });
                  setGeprueft(false);
                }}
              />
            </label>
          );
        })}
        <div class="sv-knoepfe sv-jetzt__knoepfe">
          <Knopf variante="primaer" groesse="s" type="submit">
            Prüfen
          </Knopf>
          <Knopf variante="geist" groesse="s" icon={weg ? 'eye-off' : 'eye'} onClick={() => setWeg(!weg)}>
            {weg ? 'Lösungsweg ausblenden' : 'Lösungsweg zeigen'}
          </Knopf>
          <Knopf variante="geist" groesse="s" icon="shuffle" onClick={onNeu}>
            Neue Aufgabe
          </Knopf>
        </div>
      </form>
      {geprueft &&
        (alleOk ? (
          <Rueckmeldung ok>Alles richtig – genau so rechnest du in der Prüfung.</Rueckmeldung>
        ) : (
          <Rueckmeldung ok={false}>Noch nicht ganz: Die roten Felder stimmen nicht. Der Lösungsweg zeigt dir, wo es hakt.</Rueckmeldung>
        ))}
      {weg && <RechenwegListe ip={ip} praefix={praefix} />}
    </section>
  );
}
