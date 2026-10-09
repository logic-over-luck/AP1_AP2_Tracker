// Subnetting verstehen: ein Lernweg in neun Schritten an einer Adresse. Oben steht immer dieselbe Bühne
// (Buehne.jsx) – je weiter der Lernweg, desto näher zoomt sie heran: die Adresse → der Strich → das Oktett mit
// dem Strich → dieses Oktett als Zahlenstrahl → dein Block. Danach geht es wieder heraus zum Ergebnis.
// Darunter erklärt jeder Schritt genau das, was die Bühne gerade zeigt; an den wichtigen Stellen wird erst
// geraten und dann aufgedeckt. Der Visualizer („alles auf einen Blick“) bleibt der Modus zum Nachschlagen.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../ui/bausteine.jsx';
import { zerlege, maske, gleichesNetz } from './ip.js';
import { endeOptionen, aufteilTabelle, nachbarVorschlag, fallen, binaerSchritte, kurzweg } from './lernweg.js';
import { zufall } from '../rahmen/zufall.js';
import { Buehne, MiniBits, ALLE, GEWICHTE, bitVon } from './Buehne.jsx';

const MIN = 8;
const MAX = 30;
const START_IP = '192.168.40.150';
const START_PRAEFIX = 26;
const gueltig = (ip) => /^\d{1,3}(\.\d{1,3}){3}$/.test(ip) && ip.split('.').every((t) => Number(t) <= 255);
const tausend = (n) => n.toLocaleString('de-DE');
const begrenze = (p) => Math.max(MIN, Math.min(MAX, p));
const bitText = (zahl) => Array.from({ length: 32 }, (_, i) => (zahl >>> (31 - i)) & 1).join('');

// Rätsel-Stand je Adresse und Präfix; ändert sich eins davon, beginnen die Rätsel von vorn
function frischesQuiz(ip, praefix) {
  return {
    fall: `${ip}/${praefix}`,
    bits: 0,
    blockVersuch: null,
    blockGeloest: zerlege(ip, praefix).block === 256,
    endeGewaehlt: null,
    bcAntwort: '',
    bcVersuch: null,
    bcGeloest: false,
    nachbar: nachbarVorschlag(ip, praefix),
  };
}

// Was die Bühne in jedem Schritt zeigt. Von Schritt zu Schritt wird es immer näher.
const FERTIG = { gezaehlt: ALLE };
const FOKUS = { gezaehlt: ALLE, fokus: true, kompakt: true };

const SCHRITTE = [
  {
    kurz: 'Adresse',
    titel: 'Woraus besteht eine IP-Adresse?',
    Inhalt: SchrittAdresse,
    buehne: () => ({ adresse: { namen: true } }),
  },
  {
    kurz: 'Strich',
    titel: 'Der Präfix setzt einen Strich',
    Inhalt: SchrittStrich,
    buehne: (c) => ({ adresse: { gezaehlt: c.gezaehlt, zaehler: true, onBit: c.gezaehlt >= ALLE ? c.setPraefix : null } }),
  },
  {
    kurz: 'Oktett',
    titel: 'Näher ran: das Oktett mit dem Strich',
    Inhalt: SchrittOktett,
    buehne: (c) => ({ adresse: FOKUS, oktett: { gezeigt: c.q.bits, teilen: c.q.bits >= 8 } }),
  },
  {
    kurz: 'Blöcke',
    titel: 'Noch näher: die Zahl als Zahlenstrahl',
    Inhalt: SchrittBloecke,
    buehne: (c) => {
      const geloest = c.q.blockGeloest;
      return {
        adresse: FOKUS,
        oktett: { teilen: true, kompakt: true },
        strahl: {
          muster: true,
          dein: geloest,
          zeiger: geloest ? [{ wert: c.z.wert, text: String(c.z.wert) }] : [],
          onWahl: geloest ? null : c.waehleBlock,
          falsch: !geloest && Number.isInteger(c.q.blockVersuch) ? c.q.blockVersuch : null,
        },
      };
    },
  },
  {
    kurz: 'Dein Block',
    titel: 'Ganz nah: dein Block',
    Inhalt: SchrittBlock,
    buehne: (c) => ({
      adresse: FOKUS,
      strahl: { muster: true, dein: true, kompakt: true },
      block: { endeZeigen: c.q.endeGewaehlt === c.z.ende || c.z.block === 256 },
    }),
  },
  {
    kurz: 'Ergebnis',
    titel: 'Wieder raus: die ganze Adresse',
    Inhalt: SchrittErgebnis,
    buehne: (c) => ({ adresse: FERTIG, ergebnis: { zeigen: c.q.bcGeloest } }),
  },
  {
    kurz: 'Nachbarn',
    titel: 'Wer ist im selben Netz?',
    Inhalt: SchrittNachbar,
    buehne: (c) => {
      const text = c.q.nachbar.trim();
      const ziel = gueltig(text) ? zerlege(text, c.praefix) : null;
      const vorneGleich = ziel && c.z.oktette.slice(0, c.z.index).every((o, i) => o === ziel.oktette[i]);
      const gleich = ziel && gleichesNetz(c.ip, text, c.praefix);
      const zeiger = [{ wert: c.z.wert, text: `du ${c.z.wert}` }];
      if (vorneGleich && ziel.wert !== c.z.wert) zeiger.push({ wert: ziel.wert, text: `Ziel ${ziel.wert}`, ton: gleich ? 'gut' : 'fremd' });
      return { adresse: FOKUS, strahl: { muster: true, dein: true, zeiger, fremd: vorneGleich && !gleich ? ziel.start : null } };
    },
  },
  {
    kurz: 'Kurzweg',
    titel: 'Der schnelle Weg für die Prüfung',
    Inhalt: SchrittKurzweg,
    buehne: () => ({
      adresse: FOKUS,
      oktett: { teilen: true, kompakt: true },
      strahl: { muster: true, dein: true, kompakt: true },
      block: { endeZeigen: true, kompakt: true },
    }),
  },
  {
    kurz: 'Aufteilen',
    titel: 'Aufteilen, nicht wegnehmen',
    Inhalt: SchrittAufteilen,
    buehne: () => ({ adresse: FOKUS, strahl: { muster: true, dein: true } }),
  },
];

export function SubnetzVerstehen() {
  const [ip, setIpRoh] = useState(START_IP);
  const [eingabe, setEingabe] = useState(START_IP);
  const [praefix, setPraefixRoh] = useState(START_PRAEFIX);
  const [schritt, setSchrittRoh] = useState(0);
  const [gezaehlt, setGezaehlt] = useState(0);
  const [aenderung, setAenderung] = useState(null);
  const [quiz, setQuiz] = useState(() => frischesQuiz(START_IP, START_PRAEFIX));
  const buehneRef = useRef(null);
  const z = useMemo(() => zerlege(ip, praefix), [ip, praefix]);

  const fall = `${ip}/${praefix}`;
  const q = quiz.fall === fall ? quiz : frischesQuiz(ip, praefix);
  const setQ = (teil) => setQuiz((alt) => ({ ...(alt.fall === fall ? alt : frischesQuiz(ip, praefix)), ...teil }));

  const setPraefix = (p) => {
    const neu = begrenze(p);
    if (neu === praefix) return;
    setAenderung({ von: praefix, nach: neu, schritt });
    setPraefixRoh(neu);
  };
  const tippe = (text) => {
    setEingabe(text);
    if (gueltig(text.trim())) setIpRoh(text.trim());
  };
  const neueAdresse = () => {
    const r = zufall();
    const a = r.wahl([10, 172, 192]);
    const b = a === 192 ? 168 : a === 172 ? r.ganz(16, 31) : r.ganz(0, 255);
    const neu = [a, b, r.ganz(0, 255), r.ganz(1, 254)].join('.');
    setIpRoh(neu);
    setEingabe(neu);
    setPraefixRoh(r.wahl([24, 25, 26, 27, 28, 29, 30, 23, 22, 20]));
    setAenderung(null);
  };
  const setSchritt = (s) => {
    setSchrittRoh(s);
    setAenderung(null);
  };

  // Beim Schrittwechsel die Bühne ins Bild holen, damit man den Zoom sieht
  useEffect(() => {
    const el = buehneRef.current;
    if (el && el.getBoundingClientRect().top < 64) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [schritt]);

  const ctx = {
    z,
    ip,
    praefix,
    setPraefix,
    aenderung: aenderung?.schritt === schritt ? aenderung : null,
    gezaehlt,
    setGezaehlt,
    q,
    setQ,
    setSchritt,
    neueAdresse,
    waehleBlock: (v) => setQ({ blockVersuch: v, blockGeloest: v === z.start }),
  };
  const aktiv = SCHRITTE[schritt];
  const Inhalt = aktiv.Inhalt;

  return (
    <div class="slv">
      <div class="flaeche snv-leiste">
        <label class="snv-ip">
          <span class="ueberschrift-klein">IP-Adresse</span>
          <input
            class={`feld mono ${gueltig(eingabe.trim()) ? '' : 'snv-ip--falsch'}`}
            value={eingabe}
            inputMode="decimal"
            spellcheck={false}
            onInput={(e) => tippe(e.currentTarget.value)}
          />
        </label>
        <div class="slv-praefix">
          <span class="ueberschrift-klein">Präfix</span>
          <div class="snv-praefix__zeile">
            <button class="snv-schritt" onClick={() => setPraefix(praefix - 1)} disabled={praefix <= MIN} aria-label="Präfix verkleinern">
              −
            </button>
            <span class="snv-praefix__wert mono">/{praefix}</span>
            <button class="snv-schritt" onClick={() => setPraefix(praefix + 1)} disabled={praefix >= MAX} aria-label="Präfix vergrößern">
              +
            </button>
          </div>
        </div>
      </div>

      <ol class="slv-schritte" aria-label="Schritte">
        {SCHRITTE.map((s, i) => (
          <li key={s.kurz}>
            <button
              class={`slv-schritt ${i === schritt ? 'slv-schritt--aktiv' : ''} ${i < schritt ? 'slv-schritt--fertig' : ''}`}
              aria-current={i === schritt ? 'step' : undefined}
              onClick={() => setSchritt(i)}
            >
              <span class="slv-schritt__nr mono">{i < schritt ? <Icon name="check" groesse={12} strich={2.5} /> : i + 1}</span>
              <span class="slv-schritt__name">{s.kurz}</span>
            </button>
          </li>
        ))}
      </ol>

      <div class="flaeche slv-buehne-rahmen" ref={buehneRef}>
        <Buehne z={z} praefix={praefix} {...aktiv.buehne(ctx)} />
      </div>

      <section class="flaeche slv-karte">
        <div class="slv-karte__kopf">
          <span class="ueberschrift-klein ueberschrift-klein--akzent">
            Schritt {schritt + 1} von {SCHRITTE.length}
          </span>
          <h2 class="slv-karte__titel">{aktiv.titel}</h2>
        </div>
        <Inhalt key={schritt} {...ctx} />
        <div class="slv-fuss">
          <Knopf icon="arrow-left" onClick={() => setSchritt(schritt - 1)} disabled={schritt === 0}>
            Zurück
          </Knopf>
          {schritt < SCHRITTE.length - 1 ? (
            <Knopf variante="primaer" iconRechts="arrow-right" onClick={() => setSchritt(schritt + 1)}>
              Weiter: {SCHRITTE[schritt + 1].kurz}
            </Knopf>
          ) : (
            <Knopf
              variante="primaer"
              icon="shuffle"
              onClick={() => {
                neueAdresse();
                setGezaehlt(0);
                setSchritt(0);
              }}
            >
              Neue Adresse, von vorn
            </Knopf>
          )}
        </div>
      </section>
    </div>
  );
}

// ---------- Bausteine ----------

function Merke({ children }) {
  return (
    <p class="slv-merke">
      <Icon name="lightbulb" groesse={16} />
      <span>{children}</span>
    </p>
  );
}

function Rueckmeldung({ ok, children }) {
  return (
    <p class={`slv-rueck ${ok ? 'slv-rueck--gut' : 'slv-rueck--falsch'}`} role="status">
      <Icon name={ok ? 'circle-check' : 'circle-x'} groesse={16} />
      <span>{children}</span>
    </p>
  );
}

function Wirkung({ aenderung }) {
  if (!aenderung) return null;
  const { von, nach } = aenderung;
  const d = Math.abs(nach - von);
  const mehr = nach > von;
  return (
    <p class="slv-hinweis">
      <Icon name="info" groesse={15} />
      <span>
        /{von} → /{nach}: {d === 1 ? 'ein Bit' : `${d} Bits`} {mehr ? 'mehr' : 'weniger'} fürs Netz →{' '}
        <strong class="mono">
          {tausend(2 ** (32 - von))} → {tausend(2 ** (32 - nach))}
        </strong>{' '}
        Adressen pro Netz ({d === 1 ? (mehr ? 'halbiert' : 'verdoppelt') : `${mehr ? 'geteilt durch' : 'mal'} ${2 ** d}`}).
      </span>
    </p>
  );
}

function StrichKnoepfe({ praefix, setPraefix, text }) {
  return (
    <div class="slv-zeile">
      <Knopf groesse="s" icon="arrow-left" onClick={() => setPraefix(praefix - 1)} disabled={praefix <= MIN}>
        Strich nach links
      </Knopf>
      <Knopf groesse="s" iconRechts="arrow-right" onClick={() => setPraefix(praefix + 1)} disabled={praefix >= MAX}>
        Strich nach rechts
      </Knopf>
      {text && <span class="gedaempft slv-klein">{text}</span>}
    </div>
  );
}

const einzahl = (liste, eins, viele) => (liste.length === 1 ? eins : viele);

// ---------- 1. Adresse ----------

function SchrittAdresse({ z }) {
  return (
    <div class="slv-inhalt">
      <p>
        Oben siehst du deine IP-Adresse, und zwar in beiden Schreibweisen. Wir Menschen schreiben vier Zahlen mit Punkten. Der Computer kennt aber nur <strong>0 und 1</strong> –
        für ihn ist die Adresse eine lange Kette aus Bits:
      </p>
      <div class="slv-zwei">
        <span class="slv-zwei__name">Für dich</span>
        <span class="slv-zwei__wert slv-zwei__wert--dez mono">{z.oktette.join('.')}</span>
        <span class="slv-zwei__name">Für den Computer</span>
        <span class="slv-zwei__wert slv-zwei__wert--bin mono">{bitText(z.zahl)}</span>
      </div>
      <p>
        Damit man das lesen kann, schneidet man die Kette in <strong>4 Päckchen zu je 8 Bit</strong>. So ein Päckchen heißt <strong>Oktett</strong> (= 1 Byte). Jedes Oktett wird
        als Dezimalzahl geschrieben – das sind die vier Zahlen über den Bits.
      </p>
      <p class="slv-rechnung mono">
        4 Oktette × 8 Bit = <strong>32 Bit</strong>
      </p>
      <div class="slv-fakten">
        <div class="slv-fakt">
          <span class="slv-fakt__titel">Warum nur 0 bis 255?</span>
          <span>
            8 Bits haben 2<sup>8</sup> = <strong>256</strong> Möglichkeiten: von <span class="mono">00000000</span> (= 0) bis <span class="mono">11111111</span> (= 255). Eine 256
            passt nicht mehr in 8 Bits – darum ist z. B. 192.168.1.256 ungültig.
          </span>
        </div>
        <div class="slv-fakt">
          <span class="slv-fakt__titel">Warum die Punkte?</span>
          <span>32 Nullen und Einsen am Stück kann sich niemand merken. Die Punkte trennen nur die vier Päckchen – für den Computer gibt es sie nicht.</span>
        </div>
        <div class="slv-fakt">
          <span class="slv-fakt__titel">Wie viele Adressen gibt es?</span>
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

// ---------- 2. Strich ----------

function SchrittStrich({ praefix, setPraefix, aenderung, gezaehlt, setGezaehlt }) {
  const uhr = useRef(null);
  useEffect(() => () => clearInterval(uhr.current), []);
  const fertig = gezaehlt >= ALLE;
  const h = 32 - praefix;
  const zaehle = () => {
    clearInterval(uhr.current);
    let n = 0;
    setGezaehlt(0);
    uhr.current = setInterval(() => {
      n += 1;
      if (n >= praefix) {
        clearInterval(uhr.current);
        setGezaehlt(ALLE);
      } else setGezaehlt(n);
    }, 110);
  };
  return (
    <div class="slv-inhalt">
      <p>
        Jetzt kommt der Präfix dazu. <strong class="mono">/{praefix}</strong> heißt: <strong>Die ersten {praefix} Bits gehören zum Netz.</strong> Zähl oben von links mit – nach Bit{' '}
        {praefix} kommt ein Strich.
      </p>
      {!fertig ? (
        <div class="slv-zeile">
          <Knopf variante="primaer" groesse="s" iconRechts="arrow-right" onClick={zaehle}>
            {gezaehlt > 0 ? 'Nochmal zählen' : 'Mitzählen'}
          </Knopf>
          <Knopf
            variante="geist"
            groesse="s"
            onClick={() => {
              clearInterval(uhr.current);
              setGezaehlt(ALLE);
            }}
          >
            Überspringen
          </Knopf>
          {gezaehlt > 0 && <span class="slv-zaehlstand mono">{gezaehlt} …</span>}
        </div>
      ) : (
        <>
          <div class="slv-teile">
            <span class="slv-teil slv-teil--netz">
              <strong>Netzteil</strong> · Bit 1 bis {praefix}
            </span>
            <span class="slv-teil slv-teil--host">
              <strong>Hostteil</strong> · Bit {praefix + 1} bis 32 ({h} Bit)
            </span>
          </div>
          <p>
            Der <strong>Netzteil</strong> ist wie die <em>Straße</em>: Bei allen Geräten im selben Netz sind diese Bits genau gleich. Der <strong>Hostteil</strong> ist wie die{' '}
            <em>Hausnummer</em>: Er ist bei jedem Gerät anders.
          </p>
          <p class="slv-rechnung mono">
            {h} Hostbits → 2<sup>{h}</sup> = <strong>{tausend(2 ** h)}</strong> Adressen in diesem Netz
          </p>
          <p class="slv-rechnung mono">
            Maske = der Strich als Zahl: {praefix} Einsen, {h} Nullen → <strong>{maske(praefix)}</strong>
          </p>
          <StrichKnoepfe praefix={praefix} setPraefix={setPraefix} text="oder oben auf ein Bit klicken" />
          <Wirkung aenderung={aenderung} />
        </>
      )}
      <Merke>
        Links vom Strich: <strong>Netz</strong> (Straße) – bei allen Geräten im Netz gleich. Rechts: <strong>Gerät</strong> (Hausnummer). Strich eins nach rechts = halb so viele
        Adressen.
      </Merke>
    </div>
  );
}

// ---------- 3. Oktett ----------

function SchrittOktett({ z, praefix, q, setQ }) {
  const wert = z.wert;
  const k = z.netzBitsImOktett;
  const nr = z.index + 1;
  const schritte = binaerSchritte(wert);
  const gezeigt = q.bits;
  const fertig = gezeigt >= 8;
  const jetzt = schritte[Math.min(gezeigt, 7)];
  const vorne = z.oktette.slice(0, z.index);
  const hinten = z.oktette.slice(z.index + 1);
  const netz = GEWICHTE.filter((g, j) => j < k && bitVon(wert, j)).reduce((a, x) => a + x, 0);
  const host = wert - netz;
  return (
    <div class="slv-inhalt">
      <p>
        Wir zoomen näher ran – auf das <strong>{nr}. Oktett</strong>, denn da geht der Strich durch: die <strong>{wert}</strong>.{' '}
        {vorne.length > 0 && (
          <>
            {einzahl(vorne, 'Das Oktett', 'Die Oktette')} davor ({vorne.join('.')}) {einzahl(vorne, 'liegt', 'liegen')} ganz links vom Strich: reines Netz, das schreibst du nur
            ab.{' '}
          </>
        )}
        {hinten.length > 0 && (
          <>
            {einzahl(hinten, 'Das Oktett', 'Die Oktette')} danach ({hinten.join('.')}) {einzahl(hinten, 'ist', 'sind')} reiner Host.
          </>
        )}
      </p>

      <h3 class="slv-unterkopf">1. Die {wert} in Bits</h3>
      <p>
        Jedes der 8 Bits hat einen festen <strong>Stellenwert</strong> – oben unter den Bits: 128, 64, 32 … 1. Von links nach rechts fragst du:{' '}
        <em>Passt der Stellenwert in den Rest?</em>
      </p>
      {gezeigt > 0 && (
        <ol class="slv-wegliste">
          {schritte.slice(0, gezeigt).map((s) => (
            <li key={s.gewicht} class={s.passt ? 'slv-wegliste--an' : ''}>
              <span class="slv-wegliste__wert mono">{s.gewicht}</span>
              <span>
                {s.passt ? (
                  <>
                    Passt {s.gewicht} in {s.vorher}? <strong>Ja → 1</strong>, Rest {s.vorher} − {s.gewicht} = <strong class="mono">{s.nachher}</strong>
                  </>
                ) : (
                  <>
                    Passt {s.gewicht} in {s.vorher}? Nein → 0
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
      )}
      {!fertig ? (
        <div class="slv-zeile">
          <Knopf variante="primaer" groesse="s" iconRechts="arrow-right" onClick={() => setQ({ bits: gezeigt + 1 })}>
            {gezeigt === 0 ? `Start mit ${wert}` : 'Nächstes Bit'}
          </Knopf>
          <Knopf variante="geist" groesse="s" onClick={() => setQ({ bits: 8 })}>
            Alle auf einmal
          </Knopf>
          <span class="gedaempft slv-klein">
            als Nächstes: passt {jetzt.gewicht} in {jetzt.vorher}?
          </span>
        </div>
      ) : (
        <>
          <p class="slv-rechnung mono">
            {wert} ={' '}
            {schritte
              .filter((s) => s.passt)
              .map((s) => s.gewicht)
              .join(' + ') || '0'}{' '}
            → <strong>{schritte.map((s) => s.bit).join('')}</strong>
          </p>

          <h3 class="slv-unterkopf">2. Am Strich teilen</h3>
          <p>
            {k ? (
              <>
                Jetzt kommt der Strich dazu: {k} Bit{k > 1 ? 's' : ''} links, {8 - k} rechts. Oben siehst du, was auf jeder Seite zusammenkommt:
              </>
            ) : (
              <>
                Bei /{praefix} liegt der Strich genau <strong>vor</strong> der {wert} – sie ist komplett Host:
              </>
            )}
          </p>
          <div class="slv-gleichung">
            <span class="slv-gleichung__teil">
              <span class="slv-gleichung__wert mono">{wert}</span>
              <span>deine Zahl</span>
            </span>
            <span class="slv-gleichung__op">=</span>
            <span class="slv-gleichung__teil slv-gleichung__teil--netz">
              <span class="slv-gleichung__wert mono">{netz}</span>
              <span>Netzanteil</span>
            </span>
            <span class="slv-gleichung__op">+</span>
            <span class="slv-gleichung__teil slv-gleichung__teil--host">
              <span class="slv-gleichung__wert mono">{host}</span>
              <span>Hostanteil</span>
            </span>
          </div>
          <p>
            Der <strong>Netzanteil {netz}</strong> ist bei allen Geräten in deinem Netz gleich. Der <strong>Hostanteil {host}</strong>{' '}
            {z.index === 3 ? 'ist die Nummer deines Geräts in diesem Netz.' : 'ist der Anfang der Gerätenummer – die Oktette danach gehören auch noch dazu.'}
          </p>
        </>
      )}
      <Merke>
        Gerechnet wird nur in <strong>diesem einen Oktett</strong>. Davor: abschreiben. Danach: bei der Netzadresse 0, beim Broadcast 255.
      </Merke>
    </div>
  );
}

// ---------- 4. Blöcke ----------

function SchrittBloecke({ z, praefix, q, setQ, waehleBlock }) {
  const [antwort, setAntwort] = useState('');
  const k = z.netzBitsImOktett;
  const hb = 8 - k;
  const nr = z.index + 1;
  const anzahl = 256 / z.block;
  const meinMuster = k ? (z.wert >> hb).toString(2).padStart(k, '0') : '';
  const alleMuster = Array.from({ length: anzahl }, (_, i) => i.toString(2).padStart(k, '0'));
  const v = q.blockVersuch;
  const geloest = q.blockGeloest;

  if (k === 0)
    return (
      <div class="slv-inhalt">
        <p>
          Die {z.wert} ist eine Zahl von 0 bis 255 – oben als Zahlenstrahl. Bei /{praefix} hat das {nr}. Oktett <strong>keine Netz-Bits</strong>: Es gibt nur einen einzigen Block,
          0 bis 255.
        </p>
        <Merke>Die Netz-Bits im Oktett schneiden den Zahlenstrahl in Blöcke. Keine Netz-Bits = ein Block mit allen 256 Zahlen.</Merke>
      </div>
    );

  let hinweis = null;
  if (v !== null && !geloest) {
    if (Number.isNaN(v)) hinweis = 'Gib eine Zahl ein.';
    else if (v % z.block !== 0) hinweis = `${v} ist kein Blockanfang – Blöcke beginnen bei Vielfachen von ${z.block}.`;
    else if (v > z.wert) hinweis = `Zu weit: Der Block ab ${v} beginnt erst nach ${z.wert}.`;
    else hinweis = `Zu früh: Der Block ${v}–${v + z.block - 1} endet schon vor ${z.wert}.`;
  }

  return (
    <div class="slv-inhalt">
      <p>
        Noch näher: Die {z.wert} ist eine Zahl von 0 bis 255 – oben als <strong>Zahlenstrahl</strong>. Die {k} Netz-Bits schneiden ihn in Blöcke: {k} Bit{k > 1 ? 's' : ''}{' '}
        {k > 1 ? 'haben' : 'hat'} 2<sup>{k}</sup> = <strong>{anzahl} Muster</strong>
        {anzahl <= 16 && <span class="mono"> ({alleMuster.join(', ')})</span>} – jedes Muster ist ein Block.
      </p>
      <p>
        Die {hb} Host-Bits zählen in jedem Block von <span class="mono">{'0'.repeat(hb)}</span> bis <span class="mono">{'1'.repeat(hb)}</span>, also 2<sup>{hb}</sup> ={' '}
        <strong>{z.block} Zahlen pro Block</strong>.
      </p>
      <p class="slv-rechnung mono">
        Schneller im Kopf: Maske im Oktett {GEWICHTE.slice(0, k).join(' + ')} = {z.maskenwert} → 256 − {z.maskenwert} = <strong>{z.block}</strong>
      </p>

      <h3 class="slv-unterkopf">Probier's: Wo liegt deine {z.wert}?</h3>
      {!geloest ? (
        <>
          <p>
            Deine Netz-Bits im {nr}. Oktett sind <strong class="mono">{meinMuster}</strong>. In welchem Block liegt die {z.wert}? Klick oben auf den Block oder gib seinen Anfang
            ein.
          </p>
          <form
            class="slv-frage"
            onSubmit={(e) => {
              e.preventDefault();
              waehleBlock(Number(antwort.trim() === '' ? NaN : antwort));
            }}
          >
            <label>
              Block beginnt bei <input class="feld mono slv-frage__feld" value={antwort} inputMode="numeric" onInput={(e) => setAntwort(e.currentTarget.value)} />
            </label>
            <Knopf variante="primaer" groesse="s" type="submit">
              Prüfen
            </Knopf>
            <Knopf variante="geist" groesse="s" icon="eye" onClick={() => setQ({ blockGeloest: true })}>
              Zeig's mir
            </Knopf>
          </form>
          {hinweis && <Rueckmeldung ok={false}>{hinweis}</Rueckmeldung>}
        </>
      ) : (
        <>
          <Rueckmeldung ok>
            Block <span class="mono">{meinMuster}</span>: {z.start} bis {z.ende}.
          </Rueckmeldung>
          <div class="slv-wege">
            <div class="slv-weg">
              <span class="slv-weg__titel">Über die Bits</span>
              <span class="mono">
                Netz-Bits {meinMuster}, Host-Bits alle 0 → {meinMuster}
                {'0'.repeat(hb)} = <strong>{z.start}</strong>
              </span>
            </div>
            <div class="slv-weg">
              <span class="slv-weg__titel">Über Rechnen</span>
              <span class="mono">
                {z.wert} : {z.block} = {z.blockNr} Rest {z.wert - z.start} → {z.blockNr} × {z.block} = <strong>{z.start}</strong>
              </span>
            </div>
          </div>
        </>
      )}
      <Merke>
        Die <strong>Netz-Bits wählen den Block</strong>, die <strong>Host-Bits zählen darin</strong>. Blöcke beginnen immer bei Vielfachen der Blockgröße:{' '}
        <span class="mono">
          {Array.from({ length: Math.min(anzahl, 4) }, (_, i) => i * z.block).join(', ')}
          {anzahl > 4 ? ', …' : ''}
        </span>
      </Merke>
    </div>
  );
}

// ---------- 5. Dein Block ----------

function SchrittBlock({ z, q, setQ }) {
  const optionen = useMemo(() => endeOptionen(z), [z]);
  const k = z.netzBitsImOktett;
  const naechster = z.start + z.block;
  const gewaehlt = q.endeGewaehlt;
  const geloest = gewaehlt === z.ende;

  if (z.block === 256)
    return (
      <div class="slv-inhalt">
        <p>Es gibt nur einen Block: 0 bis 255. Am Anfang (0) sind alle Host-Bits 0, am Ende (255) alle 1.</p>
        <Merke>Ende = Anfang des nächsten Blocks − 1. Hier gibt es keinen nächsten Block, also 256 − 1 = 255.</Merke>
      </div>
    );

  let hinweis = null;
  if (gewaehlt !== null && !geloest) {
    if (gewaehlt === naechster) hinweis = `Fast! ${z.start} + ${z.block} = ${naechster} ist schon der Anfang des NÄCHSTEN Blocks. Probier's nochmal.`;
    else if (gewaehlt < z.ende) hinweis = `Zu kurz: Von ${z.start} bis ${gewaehlt} sind nur ${gewaehlt - z.start + 1} Zahlen, der Block hat aber ${z.block}.`;
    else hinweis = 'Zu weit – das gehört nicht mehr zu deinem Block.';
  }

  return (
    <div class="slv-inhalt">
      <p>
        Ganz nah: Oben siehst du nur noch deinen Block. Er beginnt bei <strong class="mono">{z.start}</strong> und hat <strong class="mono">{z.block}</strong> Zahlen. Deine{' '}
        {z.wert} sitzt {z.wert - z.start} Schritte nach dem Anfang. <strong>Bei welcher Zahl endet der Block?</strong>
      </p>
      <div class="slv-optionen">
        {optionen.map((o) => (
          <button
            key={o}
            class={`slv-option mono ${gewaehlt === o ? (o === z.ende ? 'slv-option--gut' : 'slv-option--falsch') : ''}`}
            onClick={() => setQ({ endeGewaehlt: o })}
            disabled={geloest}
          >
            {o}
          </button>
        ))}
      </div>
      {hinweis && <Rueckmeldung ok={false}>{hinweis}</Rueckmeldung>}
      {!geloest && (
        <Knopf variante="geist" groesse="s" icon="eye" onClick={() => setQ({ endeGewaehlt: z.ende })}>
          Zeig's mir
        </Knopf>
      )}
      {geloest && (
        <>
          <Rueckmeldung ok>
            {z.ende}! {z.start} + {z.block} = {naechster} ist schon der nächste Block – das Ende liegt eins davor.
          </Rueckmeldung>
          <div class="slv-beweis">
            <span class="ueberschrift-klein">Warum? Schau auf die Bits</span>
            {[
              { wert: z.start, name: 'Anfang', text: 'Host-Bits alle 0 → Netzadresse', cls: 'slv-farbe-netz' },
              { wert: z.ende, name: 'Ende', text: 'Host-Bits alle 1 → Broadcast', cls: 'slv-farbe-host' },
            ].map((r) => (
              <div key={r.name} class="slv-beweis__zeile">
                <span class="slv-beweis__name">
                  {r.name}
                  <span>{r.text}</span>
                </span>
                <MiniBits wert={r.wert} k={k} />
                <span class={`slv-beweis__wert mono ${r.cls}`}>= {r.wert}</span>
              </div>
            ))}
          </div>
          <Merke>
            <strong>Ende = nächster Blockanfang − 1.</strong> Der Anfang deines Blocks wird zur <strong>Netzadresse</strong>, das Ende zum <strong>Broadcast</strong>. Dazwischen
            liegen die Geräte.
          </Merke>
        </>
      )}
    </div>
  );
}

// ---------- 6. Ergebnis ----------

function SchrittErgebnis({ z, ip, praefix, q, setQ }) {
  const n = z.n;
  const nr = z.index + 1;
  const h = 32 - praefix;
  const falle = fallen(ip, praefix);
  const versuch = q.bcVersuch;
  const geloest = q.bcGeloest;

  let hinweis = null;
  if (versuch !== null && !geloest) {
    if (!gueltig(versuch)) hinweis = 'Das ist keine gültige IPv4-Adresse (vier Zahlen von 0 bis 255 mit Punkten).';
    else {
      const ist = versuch.split('.').map(Number);
      const soll = n.broadcast.split('.').map(Number);
      const i = ist.findIndex((x, j) => x !== soll[j]);
      if (i < z.index) hinweis = `Das ${i + 1}. Oktett wird aus der IP abgeschrieben.`;
      else if (i === z.index) hinweis = `Im ${i + 1}. Oktett steht beim Broadcast das Blockende (nächster Blockanfang − 1).`;
      else hinweis = `Alle Oktette nach dem ${nr}. sind beim Broadcast 255 – alle Host-Bits auf 1.`;
    }
  }

  return (
    <div class="slv-inhalt">
      <p>
        Jetzt zoomen wir wieder raus und bauen die ganze Adresse. Die Regel: Oktette vor dem Strich-Oktett <strong>abschreiben</strong>, im {nr}. Oktett{' '}
        <strong>Blockanfang bzw. Blockende</strong>
        {z.index < 3 ? ', alle Oktette danach 0 bzw. 255' : ''}. Die Netzadresse steht oben schon. <strong>Wie lautet der Broadcast?</strong>
      </p>
      {!geloest ? (
        <>
          <form
            class="slv-frage"
            onSubmit={(e) => {
              e.preventDefault();
              const text = q.bcAntwort.trim();
              setQ({ bcVersuch: text, bcGeloest: text === n.broadcast });
            }}
          >
            <input
              class="feld mono slv-frage__feld slv-frage__feld--ip"
              value={q.bcAntwort}
              placeholder="z. B. 10.0.0.255"
              spellcheck={false}
              onInput={(e) => setQ({ bcAntwort: e.currentTarget.value })}
            />
            <Knopf variante="primaer" groesse="s" type="submit">
              Prüfen
            </Knopf>
            <Knopf variante="geist" groesse="s" icon="eye" onClick={() => setQ({ bcGeloest: true })}>
              Zeig's mir
            </Knopf>
          </form>
          {hinweis && <Rueckmeldung ok={false}>{hinweis}</Rueckmeldung>}
        </>
      ) : (
        <>
          {versuch === n.broadcast && <Rueckmeldung ok>Richtig – {n.broadcast}!</Rueckmeldung>}
          <p>
            Oben steht jetzt dein ganzes Netz. Die Geräte bekommen alles dazwischen: <strong class="mono">{n.erster}</strong> bis <strong class="mono">{n.letzter}</strong>.
          </p>
          <p class="slv-rechnung mono">
            {h} Hostbits → 2<sup>{h}</sup> = {tausend(n.adressen)} Adressen − 2 = <strong>{tausend(n.hostsKlassisch)} Hosts</strong>
          </p>
          {falle && (
            <p class="slv-falle">
              <Icon name="triangle-alert" groesse={16} />
              <span>
                <strong>Prüfungsfalle:</strong> <span class="mono">{falle.endeErstes}</span> und <span class="mono">{falle.anfangZweites}</span> sehen aus wie Broadcast und
                Netzadresse, liegen aber <strong>mitten im Netz</strong> – das sind ganz normale Hosts. Reserviert sind nur die allererste und die allerletzte Adresse.
              </span>
            </p>
          )}
          <Merke>Netzadresse und Broadcast gehören dem Netz selbst, nicht einem Gerät. Darum immer „− 2“ bei den Hosts.</Merke>
        </>
      )}
    </div>
  );
}

// ---------- 7. Nachbarn ----------

function SchrittNachbar({ z, ip, praefix, q, setQ }) {
  const ziel = q.nachbar.trim();
  const ok = gueltig(ziel);
  const zz = ok ? zerlege(ziel, praefix) : null;
  const gleich = ok && gleichesNetz(ip, ziel, praefix);
  const vorneGleich = zz && z.oktette.slice(0, z.index).every((o, i) => o === zz.oktette[i]);
  return (
    <div class="slv-inhalt">
      <p>
        Die anderen Blöcke auf dem Zahlenstrahl sind <strong>andere Netze</strong>. Ob zwei Geräte im selben Netz sind, entscheidet jeder PC selbst: Er nimmt seine eigene Maske und
        schaut, ob das Ziel in seinem Block liegt. Tipp eine zweite Adresse ein:
      </p>
      <div class="slv-zeile">
        <span class="slv-pc mono">
          Dein PC: <strong>{ip}</strong>/{praefix}
        </span>
        <span class="gedaempft">will zu</span>
        <input
          class={`feld mono slv-frage__feld slv-frage__feld--ip ${ok ? '' : 'snv-ip--falsch'}`}
          value={q.nachbar}
          spellcheck={false}
          onInput={(e) => setQ({ nachbar: e.currentTarget.value })}
        />
      </div>
      {zz && (
        <>
          {!vorneGleich && <p class="gedaempft">Die Adressen unterscheiden sich schon vor dem {z.index + 1}. Oktett – da braucht man gar nicht weiterzurechnen.</p>}
          <div class="slv-vergleich mono">
            <span>Dein Netz:</span> <strong>{z.n.netz}</strong>
            <span>Netz des Ziels (mit deiner Maske):</span> <strong>{zz.n.netz}</strong>
          </div>
          {gleich ? (
            <Rueckmeldung ok>Gleiches Netz – der PC schickt das Paket direkt hin (über den Switch).</Rueckmeldung>
          ) : (
            <p class="slv-falle slv-falle--info">
              <Icon name="network" groesse={16} />
              <span>
                <strong>Anderes Netz.</strong> Der PC schickt das Paket an sein <strong>Standardgateway</strong> (Router). Ohne Router keine Verbindung – auch wenn beide Kabel im
                selben Switch stecken.
              </span>
            </p>
          )}
        </>
      )}
      <Merke>
        „Netz“ ist eine <strong>Regel im Kopf des PCs</strong> (IP + Maske), kein Kabel. Alle Geräte eines Netzes brauchen dieselbe Maske und eine IP aus demselben Block – und das
        Gateway muss auch in diesem Block liegen.
      </Merke>
    </div>
  );
}

// ---------- 8. Kurzweg ----------

function SchrittKurzweg({ ip, praefix, setSchritt, neueAdresse }) {
  const r = kurzweg(ip, praefix);
  const zeilen = [
    { titel: 'Oktett finden', rechnung: `/${praefix} = ${r.teile.join(' + ')} → ${r.nr}. Oktett, die ${r.wert}`, schritt: 2 },
    { titel: 'Maske im Oktett', rechnung: r.netzBits ? `${r.maskenteile.join(' + ')} = ${r.maskenwert}` : '0 – keine Netz-Bits in diesem Oktett', schritt: 3 },
    { titel: 'Blockgröße', rechnung: `256 − ${r.maskenwert} = ${r.block}`, schritt: 3 },
    { titel: 'Dein Block', rechnung: `${r.wert} : ${r.block} = ${r.blockNr} Rest ${r.rest} → ${r.blockNr} × ${r.block} = ${r.start}`, schritt: 3 },
    { titel: 'Blockende', rechnung: `${r.start} + ${r.block} − 1 = ${r.ende}`, schritt: 4 },
    { titel: 'Zusammensetzen', rechnung: `Netz ${r.netz} · Broadcast ${r.broadcast}`, schritt: 5 },
    { titel: 'Hosts', rechnung: `2^${r.hostBits} − 2 = ${tausend(r.hosts)} (${r.erster} bis ${r.letzter})`, schritt: 5 },
  ];
  return (
    <div class="slv-inhalt">
      <p>
        Oben siehst du den ganzen Weg auf einmal – von der Adresse bis zu deinem Block. In der Prüfung rechnest du genau diesen Weg, nur ohne Bilder. Jede Zeile führt zurück zu dem
        Schritt, in dem du sie gesehen hast:
      </p>
      <ol class="slv-rezept">
        {zeilen.map((zeile, i) => (
          <li key={zeile.titel}>
            <span class="slv-rezept__nr mono">{i + 1}</span>
            <span class="slv-rezept__text">
              <strong>{zeile.titel}</strong>
              <span class="mono">{zeile.rechnung}</span>
            </span>
            <Knopf variante="geist" groesse="s" iconRechts="arrow-right" onClick={() => setSchritt(zeile.schritt)}>
              {SCHRITTE[zeile.schritt].kurz}
            </Knopf>
          </li>
        ))}
      </ol>
      <div class="slv-zeile">
        <Knopf variante="akzent" groesse="s" icon="shuffle" onClick={neueAdresse}>
          Mit neuer Adresse durchrechnen
        </Knopf>
        <span class="gedaempft slv-klein">Erst selbst rechnen, dann vergleichen. Üben mit Punkten: Reiter „Netz bestimmen“.</span>
      </div>
      <Merke>Die Bilder sind zum Verstehen da. In der Prüfung reichen diese sieben Zeilen – und wenn du hängst, weißt du jetzt, was dahintersteckt.</Merke>
    </div>
  );
}

// ---------- 9. Aufteilen ----------

function SchrittAufteilen({ z, praefix, setPraefix, aenderung }) {
  const { gesamt, zeilen } = aufteilTabelle(praefix);
  const basis = zeilen[0].praefix;
  return (
    <div class="slv-inhalt">
      <p>
        Ab dem {z.index + 1}. Oktett gibt es bei /{basis} <strong class="mono">{tausend(gesamt)}</strong> Adressen. Der Präfix entscheidet nur, in <strong>wie viele Netze</strong>{' '}
        sie geschnitten werden. Schieb den Strich und schau oben zu, wie sich die Blöcke teilen:
      </p>
      <StrichKnoepfe praefix={praefix} setPraefix={setPraefix} />
      <Wirkung aenderung={aenderung} />
      <div class="slv-tab-rahmen">
        <table class="snv-tab slv-aufteil">
          <thead>
            <tr>
              <th>Präfix</th>
              <th>Netze × Adressen</th>
              <th>Hosts je Netz</th>
              <th>Hosts gesamt</th>
              <th>reserviert</th>
            </tr>
          </thead>
          <tbody>
            {zeilen.map((r) => (
              <tr key={r.praefix} class={r.praefix === praefix ? 'snv-tab--aktiv' : ''} onClick={() => setPraefix(r.praefix)}>
                <td class="mono">/{r.praefix}</td>
                <td class="mono">
                  {tausend(r.netze)} × {tausend(r.adressen)}
                </td>
                <td class="mono">{tausend(r.hosts)}</td>
                <td class="mono">{tausend(r.hostsGesamt)}</td>
                <td class="mono">{tausend(r.reserviert)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p class="gedaempft slv-klein">
        „Netze × Adressen“ ist in jeder Zeile {tausend(gesamt)} – nichts geht verloren. Jedes Netz kostet nur 2 Adressen (Netzadresse + Broadcast). Zeile anklicken = Präfix wählen.
      </p>
      <div class="slv-wozu">
        <span class="ueberschrift-klein">Wozu kleine Netze?</span>
        <ul>
          <li>
            <strong>Trennen:</strong> Gäste-WLAN, Server und Buchhaltung bekommen eigene Netze, dazwischen regelt eine Firewall, wer wohin darf.
          </li>
          <li>
            <strong>Weniger Broadcast:</strong> Ein Broadcast erreicht nur das eigene Netz, nicht hunderte Geräte.
          </li>
          <li>
            <strong>Passende Größe:</strong> Eine Leitung zwischen zwei Routern braucht genau 2 Adressen → /30. Ein /24 dafür würde 252 Adressen verschwenden.
          </li>
        </ul>
      </div>
      <Merke>Subnetting heißt aufteilen, nicht wegnehmen: Jedes Netz bekommt so viele Adressen, wie es braucht – die übrigen gehören den anderen Netzen.</Merke>
    </div>
  );
}
