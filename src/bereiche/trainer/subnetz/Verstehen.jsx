// Subnetting verstehen: ein Lernweg in acht kleinen Schritten an einer Adresse. Jeder Schritt zeigt nur
// eine Idee, an den wichtigen Stellen wird erst geraten und dann aufgedeckt. Der Visualizer („alles auf
// einen Blick“) bleibt der Modus zum Nachschlagen.

import { useMemo, useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../ui/bausteine.jsx';
import { zerlege, maske, gleichesNetz } from './ip.js';
import { oktettRollen, endeOptionen, aufteilTabelle, nachbarVorschlag, fallen } from './lernweg.js';
import { zufall } from '../rahmen/zufall.js';

const GEWICHTE = [128, 64, 32, 16, 8, 4, 2, 1];
const MIN = 8;
const MAX = 30;
const gueltig = (ip) => /^\d{1,3}(\.\d{1,3}){3}$/.test(ip) && ip.split('.').every((t) => Number(t) <= 255);
const bits = (zahl) => Array.from({ length: 32 }, (_, i) => (zahl >>> (31 - i)) & 1);
const tausend = (n) => n.toLocaleString('de-DE');
const begrenze = (p) => Math.max(MIN, Math.min(MAX, p));

const BEISPIELE = [
  { ip: '192.168.40.150', praefix: 26, text: 'Grundfall' },
  { ip: '192.168.41.150', praefix: 23, text: 'über die Oktettgrenze' },
  { ip: '10.0.0.6', praefix: 30, text: 'Router-Verbindung' },
  { ip: '192.168.40.150', praefix: 24, text: 'ein großer Block' },
  { ip: '172.20.77.5', praefix: 20, text: 'größeres Netz' },
];

const SCHRITTE = [
  { kurz: 'Trennstrich', titel: 'Der Präfix ist ein Trennstrich' },
  { kurz: 'Oktett', titel: 'Wo wird gerechnet?' },
  { kurz: 'Blöcke', titel: 'In Blöcke schneiden' },
  { kurz: 'Dein Block', titel: 'In welchem Block liegt deine Adresse?' },
  { kurz: 'Blockende', titel: 'Wo endet der Block?' },
  { kurz: 'Adressen', titel: 'Die Adressen zusammenbauen' },
  { kurz: 'Nachbarn', titel: 'Wer ist Nachbar?' },
  { kurz: 'Aufteilen', titel: 'Aufteilen, nicht wegnehmen' },
];

export function SubnetzVerstehen() {
  const [ip, setIpRoh] = useState(BEISPIELE[0].ip);
  const [eingabe, setEingabe] = useState(BEISPIELE[0].ip);
  const [praefix, setPraefixRoh] = useState(BEISPIELE[0].praefix);
  const [aenderung, setAenderung] = useState(null);
  const [schritt, setSchritt] = useState(0);
  const z = useMemo(() => zerlege(ip, praefix), [ip, praefix]);

  // Präfix schrittweise ändern: die Wirkung (halbiert/verdoppelt) wird angezeigt
  const setPraefix = (p) => {
    const neu = begrenze(p);
    if (neu === praefix) return;
    setAenderung({ von: praefix, nach: neu });
    setPraefixRoh(neu);
  };
  const setFall = (neuIp, neuPraefix) => {
    setIpRoh(neuIp);
    setEingabe(neuIp);
    setPraefixRoh(neuPraefix);
    setAenderung(null);
  };
  const tippe = (text) => {
    setEingabe(text);
    if (gueltig(text.trim())) setIpRoh(text.trim());
  };
  const zufallsFall = () => {
    const r = zufall();
    const a = r.wahl([10, 172, 192]);
    const b = a === 192 ? 168 : a === 172 ? r.ganz(16, 31) : r.ganz(0, 255);
    setFall([a, b, r.ganz(0, 255), r.ganz(1, 254)].join('.'), r.wahl([24, 25, 26, 27, 28, 29, 30, 23, 22, 20]));
  };

  // Schlüssel: Rätsel beginnen bei jeder neuen Adresse oder jedem neuen Präfix von vorn
  const fall = `${ip}/${praefix}`;
  const props = { z, ip, praefix, setPraefix, aenderung };
  const Inhalt = [Trennstrich, Oktett, Bloecke, DeinBlock, Blockende, Adressen, Nachbar, Aufteilen][schritt];

  return (
    <div class="snv snl">
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
        <div class="snl-praefix">
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
        <div class="snl-beispiele">
          <span class="ueberschrift-klein">Beispiele</span>
          <div class="snl-beispiele__liste">
            {BEISPIELE.map((b) => (
              <button
                key={b.text}
                class={`snl-beispiel ${b.ip === ip && b.praefix === praefix ? 'snl-beispiel--aktiv' : ''}`}
                onClick={() => setFall(b.ip, b.praefix)}
                title={b.text}
              >
                <span class="mono">/{b.praefix}</span> {b.text}
              </button>
            ))}
            <button class="snl-beispiel" onClick={zufallsFall}>
              <Icon name="shuffle" groesse={13} /> Zufall
            </button>
          </div>
        </div>
      </div>

      <ol class="snl-schritte" aria-label="Schritte">
        {SCHRITTE.map((s, i) => (
          <li key={s.kurz}>
            <button
              class={`snl-schritt ${i === schritt ? 'snl-schritt--aktiv' : ''} ${i < schritt ? 'snl-schritt--fertig' : ''}`}
              aria-current={i === schritt ? 'step' : undefined}
              onClick={() => setSchritt(i)}
            >
              <span class="snl-schritt__nr mono">{i < schritt ? <Icon name="check" groesse={12} strich={2.5} /> : i + 1}</span>
              <span class="snl-schritt__name">{s.kurz}</span>
            </button>
          </li>
        ))}
      </ol>

      <section class="flaeche snl-karte">
        <div class="snl-karte__kopf">
          <span class="ueberschrift-klein ueberschrift-klein--akzent">
            Schritt {schritt + 1} von {SCHRITTE.length}
          </span>
          <h2 class="snl-karte__titel">{SCHRITTE[schritt].titel}</h2>
        </div>
        <Inhalt key={fall} {...props} />
        <div class="snl-fuss">
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
                zufallsFall();
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
    <p class="snl-merke">
      <Icon name="lightbulb" groesse={16} />
      <span>{children}</span>
    </p>
  );
}

function Rueckmeldung({ ok, children }) {
  return (
    <p class={`snl-rueck ${ok ? 'snl-rueck--gut' : 'snl-rueck--falsch'}`} role="status">
      <Icon name={ok ? 'circle-check' : 'circle-x'} groesse={16} />
      <span>{children}</span>
    </p>
  );
}

// Die 32 Bits der IP mit Trennstrich nach Bit `praefix`. Klick auf ein Bit setzt den Strich dahinter.
function BitLeiste({ z, praefix, onGrenze }) {
  const b = bits(z.zahl);
  return (
    <div class="snl-bits">
      {[0, 1, 2, 3].map((o) => (
        <div key={o} class="snl-bits__oktett">
          <span class="snl-bits__dez mono">{z.oktette[o]}</span>
          <span class="snl-bits__reihe">
            {b.slice(o * 8, o * 8 + 8).map((bit, j) => {
              const i = o * 8 + j;
              return [
                i === praefix && <span key={`t${i}`} class="snl-trenner" aria-hidden="true" />,
                <button
                  key={i}
                  class={`snv-bit snl-bit ${i < praefix ? 'snv-bit--netz' : 'snv-bit--host'}`}
                  onClick={() => onGrenze(i + 1)}
                  title={`Trennstrich hinter Bit ${i + 1} setzen (/${begrenze(i + 1)})`}
                >
                  {bit}
                </button>,
              ];
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

// Zahlenstrahl des entscheidenden Oktetts, in Blöcke geschnitten
function Strahl({ z, zeigeBlock, zeiger = [], onWahl, falsch }) {
  const anzahl = 256 / z.block;
  const jede = Math.max(1, anzahl / 16); // jede wievielte Blockgrenze beschriften
  return (
    <div class="snl-strahl">
      <div class="snl-strahl__leiste">
        {Array.from({ length: anzahl }, (_, nr) => {
          const start = nr * z.block;
          const aktiv = zeigeBlock && start === z.start;
          const cls = `snl-block ${aktiv ? 'snl-block--aktiv' : ''} ${falsch === start ? 'snl-block--falsch' : ''} ${onWahl ? 'snl-block--klick' : ''}`;
          const beschriftung = nr % jede === 0 && <span class="snl-block__von mono">{start}</span>;
          return onWahl ? (
            <button key={nr} class={cls} onClick={() => onWahl(start)} aria-label={`Block ${start} bis ${start + z.block - 1}`}>
              {beschriftung}
            </button>
          ) : (
            <span key={nr} class={cls}>
              {beschriftung}
            </span>
          );
        })}
        <span class="snl-strahl__ende mono">255</span>
        {zeiger.map((p) => (
          <span key={p.text} class={`snl-zeiger ${p.ton ? `snl-zeiger--${p.ton}` : ''}`} style={{ left: `${((p.wert + 0.5) / 256) * 100}%` }}>
            <span class="mono">{p.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Wirkung({ aenderung }) {
  if (!aenderung) return null;
  const { von, nach } = aenderung;
  const d = Math.abs(nach - von);
  const mehr = nach > von;
  const faktor = 2 ** d;
  return (
    <p class="snl-effekt">
      <Icon name="info" groesse={15} />
      <span>
        /{von} → /{nach}: {d === 1 ? 'ein Bit' : `${d} Bits`} {mehr ? 'mehr' : 'weniger'} fürs Netz →{' '}
        <strong class="mono">
          {tausend(2 ** (32 - von))} → {tausend(2 ** (32 - nach))}
        </strong>{' '}
        Adressen pro Netz ({d === 1 ? (mehr ? 'halbiert' : 'verdoppelt') : `${mehr ? 'geteilt durch' : 'mal'} ${faktor}`}).
      </span>
    </p>
  );
}

// ---------- 1. Trennstrich ----------

function Trennstrich({ z, praefix, setPraefix, aenderung }) {
  const h = 32 - praefix;
  return (
    <div class="snl-inhalt">
      <p>
        Eine IPv4-Adresse besteht aus <strong>32 Bits</strong>. Der Präfix <strong class="mono">/{praefix}</strong> zieht einen Trennstrich nach Bit {praefix}. Mehr bedeutet er
        nicht.
      </p>
      <BitLeiste z={z} praefix={praefix} onGrenze={setPraefix} />
      <div class="snl-teile">
        <span class="snl-teil snl-teil--netz">
          <strong>Netzteil</strong> · {praefix} Bit · wie die <em>Straße</em>
        </span>
        <span class="snl-teil snl-teil--host">
          <strong>Hostteil</strong> · {h} Bit · wie die <em>Hausnummer</em>
        </span>
      </div>
      <div class="snl-zeile">
        <Knopf groesse="s" icon="arrow-left" onClick={() => setPraefix(praefix - 1)} disabled={praefix <= MIN}>
          Strich nach links
        </Knopf>
        <Knopf groesse="s" iconRechts="arrow-right" onClick={() => setPraefix(praefix + 1)} disabled={praefix >= MAX}>
          Strich nach rechts
        </Knopf>
        <span class="gedaempft snl-klein">oder auf ein Bit klicken</span>
      </div>
      <p class="snl-rechnung mono">
        {h} Hostbits → 2<sup>{h}</sup> = <strong>{tausend(2 ** h)}</strong> Adressen in diesem Netz
      </p>
      <Wirkung aenderung={aenderung} />
      <Merke>
        Alle Geräte im selben Netz haben <strong>links vom Strich dieselben Bits</strong> (gleiche Straße). Rechts unterscheiden sie sich (Hausnummer). Strich nach rechts = mehr
        Netze, aber jedes nur halb so groß.
      </Merke>
    </div>
  );
}

// ---------- 2. Oktett ----------

const ROLLEN = {
  fest: { name: 'abschreiben', text: 'ganz Netz – bleibt wie in der IP' },
  grenze: { name: 'hier rechnen', text: 'hier liegt der Trennstrich' },
  frei: { name: 'ganz Host', text: 'Netzadresse 0, Broadcast 255' },
};

function Oktett({ z, praefix }) {
  const rollen = oktettRollen(praefix);
  const nr = z.index + 1;
  const k = z.netzBitsImOktett;
  const teile = [...Array(z.index).fill(8), k];
  return (
    <div class="snl-inhalt">
      <p>
        Zerleg den Präfix in Achter-Päckchen:{' '}
        <strong class="mono">
          /{praefix} = {teile.join(' + ')}
        </strong>
        .{' '}
        {k ? (
          <>
            Nach {z.index} vollen Oktetten bleiben {k} Netzbit{k > 1 ? 's' : ''} übrig – der Strich liegt <strong>im {nr}. Oktett</strong>.
          </>
        ) : (
          <>
            Der Strich liegt genau <strong>vor dem {nr}. Oktett</strong> – das {nr}. Oktett ist komplett Host.
          </>
        )}
      </p>
      <div class="snl-oktette">
        {rollen.map((rolle, i) => (
          <div key={i} class={`snl-okt snl-okt--${rolle}`}>
            <span class="snl-okt__nr">{i + 1}. Oktett</span>
            <span class="snl-okt__wert mono">{z.oktette[i]}</span>
            <span class="snl-okt__rolle">{ROLLEN[rolle].name}</span>
            <span class="snl-okt__text">{ROLLEN[rolle].text}</span>
          </div>
        ))}
      </div>
      <div class="snl-lupe">
        <span class="ueberschrift-klein">Lupe aufs {nr}. Oktett: die Maske</span>
        <div class="snl-lupe__bits">
          {GEWICHTE.map((g, j) => (
            <span key={j} class="snl-lupe__spalte">
              <i class={`snv-bit snl-bit ${j < k ? 'snv-bit--netz' : 'snv-bit--host'}`}>{j < k ? 1 : 0}</i>
              <span class={`snl-lupe__gewicht mono ${j < k ? 'snl-lupe__gewicht--an' : ''}`}>{g}</span>
            </span>
          ))}
        </div>
        <p class="snl-rechnung mono">
          {k ? `${GEWICHTE.slice(0, k).join(' + ')} = ${z.maskenwert}` : 'keine Einsen = 0'} → Maske {maske(praefix)}
        </p>
      </div>
      <Merke>
        Du rechnest immer nur in <strong>einem</strong> Oktett. Davor: abschreiben. Danach: bei der Netzadresse 0, beim Broadcast 255.
      </Merke>
    </div>
  );
}

// ---------- 3. Blöcke ----------

function Bloecke({ z, praefix, setPraefix, aenderung }) {
  const nr = z.index + 1;
  const anzahl = 256 / z.block;
  const hostBits = 8 - z.netzBitsImOktett;
  const vielfache = Array.from({ length: Math.min(anzahl, 5) }, (_, i) => i * z.block);
  return (
    <div class="snl-inhalt">
      <p>
        Die {hostBits} Hostbits im {nr}. Oktett bestimmen, wie groß ein Block ist:{' '}
        <strong class="mono">
          2^{hostBits} = {z.block}
        </strong>
        . Schneller im Kopf:{' '}
        <strong class="mono">
          256 − {z.maskenwert} = {z.block}
        </strong>
        .
      </p>
      <Strahl z={z} />
      <p class="snl-rechnung mono">
        {anzahl} {anzahl === 1 ? 'Block' : 'Blöcke'} × {z.block} = 256
      </p>
      <div class="snl-zeile">
        <Knopf groesse="s" onClick={() => setPraefix(praefix + 1)} disabled={praefix >= MAX}>
          /{praefix + 1}: jeden Block halbieren
        </Knopf>
        <Knopf groesse="s" onClick={() => setPraefix(praefix - 1)} disabled={praefix <= MIN}>
          /{praefix - 1}: je zwei zusammenlegen
        </Knopf>
      </div>
      <Wirkung aenderung={aenderung} />
      <Merke>
        {anzahl === 1 ? (
          <>
            Bei /{praefix} gibt es im {nr}. Oktett nur einen Block: 0 bis 255.
          </>
        ) : (
          <>
            Jede Zahl von 0 bis 255 gehört zu genau einem Block – nichts geht verloren. Blöcke beginnen immer bei Vielfachen der Blockgröße:{' '}
            <span class="mono">
              {vielfache.join(', ')}
              {anzahl > 5 ? ', …' : ''}
            </span>
          </>
        )}
      </Merke>
    </div>
  );
}

// ---------- 4. Dein Block (raten) ----------

function DeinBlock({ z, ip }) {
  const [antwort, setAntwort] = useState('');
  const [versuch, setVersuch] = useState(null);
  const [geloest, setGeloest] = useState(z.block === 256);
  const nr = z.index + 1;

  const pruefe = (v) => {
    setVersuch(v);
    if (v === z.start) setGeloest(true);
  };
  let hinweis = null;
  if (versuch !== null && !geloest) {
    if (Number.isNaN(versuch)) hinweis = 'Gib eine Zahl ein.';
    else if (versuch % z.block !== 0) hinweis = `${versuch} ist kein Blockanfang – Blöcke beginnen bei Vielfachen von ${z.block}.`;
    else if (versuch > z.wert) hinweis = `Zu weit: Der Block ab ${versuch} beginnt erst nach ${z.wert}.`;
    else hinweis = `Zu früh: Der Block ${versuch}–${versuch + z.block - 1} endet schon vor ${z.wert}.`;
  }

  return (
    <div class="snl-inhalt">
      <p>
        Deine Adresse ist <strong class="mono">{ip}</strong>. Im {nr}. Oktett steht die <strong class="mono">{z.wert}</strong>.{' '}
        {z.block === 256 ? 'Es gibt hier nur einen Block – sie liegt also in 0 bis 255.' : 'In welchem Block liegt sie? Klick auf den Block oder gib seinen Anfang ein.'}
      </p>
      <Strahl
        z={z}
        zeigeBlock={geloest}
        zeiger={geloest ? [{ wert: z.wert, text: String(z.wert) }] : []}
        onWahl={geloest ? null : pruefe}
        falsch={!geloest && Number.isInteger(versuch) ? versuch : null}
      />
      {!geloest && (
        <form
          class="snl-frage"
          onSubmit={(e) => {
            e.preventDefault();
            pruefe(Number(antwort.trim() === '' ? NaN : antwort));
          }}
        >
          <label>
            Block beginnt bei <input class="feld mono snl-frage__feld" value={antwort} inputMode="numeric" onInput={(e) => setAntwort(e.currentTarget.value)} />
          </label>
          <Knopf variante="primaer" groesse="s" type="submit">
            Prüfen
          </Knopf>
          <Knopf variante="geist" groesse="s" icon="eye" onClick={() => setGeloest(true)}>
            Zeig's mir
          </Knopf>
        </form>
      )}
      {hinweis && <Rueckmeldung ok={false}>{hinweis}</Rueckmeldung>}
      {geloest && (
        <>
          {versuch === z.start && <Rueckmeldung ok>Richtig!</Rueckmeldung>}
          <p class="snl-rechnung mono">
            {z.wert} : {z.block} = {z.blockNr} Rest {z.wert - z.start} → {z.blockNr} × {z.block} = <strong>{z.start}</strong>
          </p>
          <Merke>
            Gesucht ist das <strong>größte Vielfache der Blockgröße, das nicht größer ist</strong> als deine Zahl. Teilen, Rest weglassen, wieder malnehmen.
          </Merke>
        </>
      )}
    </div>
  );
}

// ---------- 5. Blockende (raten) ----------

function Blockende({ z }) {
  const [gewaehlt, setGewaehlt] = useState(null);
  const optionen = useMemo(() => endeOptionen(z), [z]);
  const naechster = z.start + z.block;
  const geloest = gewaehlt === z.ende || z.block === 256;

  let hinweis = null;
  if (gewaehlt !== null && !geloest) {
    if (gewaehlt === naechster) hinweis = `Fast! ${z.start} + ${z.block} = ${naechster} ist schon der Anfang des NÄCHSTEN Blocks. Probier's nochmal.`;
    else if (gewaehlt < z.ende) hinweis = `Zu kurz: Von ${z.start} bis ${gewaehlt} sind nur ${gewaehlt - z.start + 1} Adressen, der Block hat aber ${z.block}.`;
    else hinweis = 'Zu weit – das gehört nicht mehr zu deinem Block.';
  }

  if (z.block === 256)
    return (
      <div class="snl-inhalt">
        <p>Es gibt nur einen Block, er geht von 0 bis 255. Das Ende ist also 255.</p>
        <Merke>Ende = Anfang des nächsten Blocks − 1. Hier gibt es keinen nächsten Block, also 256 − 1 = 255.</Merke>
      </div>
    );

  return (
    <div class="snl-inhalt">
      <p>
        Dein Block beginnt bei <strong class="mono">{z.start}</strong> und hat <strong class="mono">{z.block}</strong> Adressen. Bei welcher Zahl endet er?
      </p>
      <div class="snl-optionen">
        {optionen.map((o) => (
          <button
            key={o}
            class={`snl-option mono ${gewaehlt === o ? (o === z.ende ? 'snl-option--gut' : 'snl-option--falsch') : ''}`}
            onClick={() => setGewaehlt(o)}
            disabled={geloest}
          >
            {o}
          </button>
        ))}
      </div>
      {hinweis && <Rueckmeldung ok={false}>{hinweis}</Rueckmeldung>}
      {!geloest && (
        <Knopf variante="geist" groesse="s" icon="eye" onClick={() => setGewaehlt(z.ende)}>
          Zeig's mir
        </Knopf>
      )}
      {geloest && (
        <>
          <Rueckmeldung ok>
            {z.ende} – genau! {z.start} + {z.block} = {naechster} ist schon der nächste Block, das Ende liegt eins davor.
          </Rueckmeldung>
          <div class="snl-zoom" aria-label="Blockgrenze vergrößert">
            {[z.ende - 1, z.ende].map((x) => (
              <span key={x} class="snl-zoom__zelle snl-zoom__zelle--dein mono">
                {x}
              </span>
            ))}
            <span class="snl-zoom__wand" />
            {[naechster, naechster + 1]
              .filter((x) => x <= 255)
              .map((x) => (
                <span key={x} class="snl-zoom__zelle mono">
                  {x}
                </span>
              ))}
            {naechster > 255 && <span class="snl-zoom__zelle snl-zoom__zelle--leer">Ende des Oktetts</span>}
          </div>
          <div class="snl-zoom__legende">
            <span>
              ← dein Block ({z.start}–{z.ende})
            </span>
            {naechster <= 255 && <span>nächster Block ab {naechster} →</span>}
          </div>
          <Merke>
            <strong>Ende = nächster Blockanfang − 1.</strong> Das ist der häufigste Fehler: {naechster} ist nicht das Ende, sondern schon der Anfang des Nachbarn.
          </Merke>
        </>
      )}
    </div>
  );
}

// ---------- 6. Adressen (raten) ----------

function Adressen({ z, ip, praefix }) {
  const [antwort, setAntwort] = useState('');
  const [versuch, setVersuch] = useState(null);
  const [geloest, setGeloest] = useState(false);
  const rollen = oktettRollen(praefix);
  const n = z.n;
  const nr = z.index + 1;
  const h = 32 - praefix;
  const falle = fallen(ip, praefix);

  const pruefe = () => {
    const text = antwort.trim();
    setVersuch(text);
    if (text === n.broadcast) setGeloest(true);
  };
  let hinweis = null;
  if (versuch !== null && !geloest) {
    if (!gueltig(versuch)) hinweis = 'Das ist keine gültige IPv4-Adresse (vier Zahlen von 0 bis 255 mit Punkten).';
    else {
      const ist = versuch.split('.').map(Number);
      const soll = n.broadcast.split('.').map(Number);
      const i = ist.findIndex((x, j) => x !== soll[j]);
      if (rollen[i] === 'fest') hinweis = `Das ${i + 1}. Oktett wird aus der IP abgeschrieben.`;
      else if (rollen[i] === 'grenze') hinweis = `Im ${i + 1}. Oktett steht beim Broadcast das Blockende (nächster Blockanfang − 1).`;
      else hinweis = `Alle Oktette nach dem ${nr}. sind beim Broadcast 255 – alle Hostbits auf 1.`;
    }
  }

  const zeilen = [
    { name: 'Netzadresse', ip: n.netz, text: `Blockanfang, danach alles 0`, reserviert: true },
    { name: 'Erster Host', ip: n.erster, text: 'Netzadresse + 1' },
    { name: 'Letzter Host', ip: n.letzter, text: 'Broadcast − 1' },
    { name: 'Broadcast', ip: n.broadcast, text: `Blockende, danach alles 255`, reserviert: true },
  ];

  return (
    <div class="snl-inhalt">
      <p>
        Jetzt setzt du alles zusammen. Probier's zuerst selbst: Wie lautet die <strong>Broadcast-Adresse</strong> von{' '}
        <span class="mono">
          {ip}/{praefix}
        </span>
        ?
      </p>
      {!geloest && (
        <form
          class="snl-frage"
          onSubmit={(e) => {
            e.preventDefault();
            pruefe();
          }}
        >
          <input
            class="feld mono snl-frage__feld snl-frage__feld--ip"
            value={antwort}
            placeholder="z. B. 10.0.0.255"
            spellcheck={false}
            onInput={(e) => setAntwort(e.currentTarget.value)}
          />
          <Knopf variante="primaer" groesse="s" type="submit">
            Prüfen
          </Knopf>
          <Knopf variante="geist" groesse="s" icon="eye" onClick={() => setGeloest(true)}>
            Zeig's mir
          </Knopf>
        </form>
      )}
      {hinweis && <Rueckmeldung ok={false}>{hinweis}</Rueckmeldung>}
      {geloest && (
        <>
          {versuch === n.broadcast && <Rueckmeldung ok>Richtig!</Rueckmeldung>}
          <div class="snl-tab-rahmen">
            <table class="snl-tab">
              <tbody>
                {zeilen.map((zeile) => (
                  <tr key={zeile.name} class={zeile.reserviert ? 'snl-tab__reserviert' : ''}>
                    <th>{zeile.name}</th>
                    {zeile.ip.split('.').map((o, i) => (
                      <td key={i} class={`mono snl-z--${rollen[i]}`}>
                        {o}
                        {i < 3 && <span class="snl-tab__punkt">.</span>}
                      </td>
                    ))}
                    <td class="snl-tab__text">{zeile.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div class="snl-legende">
            <span>
              <i class="snl-farbe snl-farbe--fest" /> abgeschrieben
            </span>
            <span>
              <i class="snl-farbe snl-farbe--grenze" /> gerechnet ({nr}. Oktett)
            </span>
            {rollen.includes('frei') && (
              <span>
                <i class="snl-farbe snl-farbe--frei" /> ganz Host: 0 bzw. 255
              </span>
            )}
          </div>
          <p class="snl-rechnung mono">
            {h} Hostbits → 2<sup>{h}</sup> = {tausend(n.adressen)} Adressen − 2 = <strong>{tausend(n.hostsKlassisch)} Hosts</strong>
          </p>
          {falle && (
            <p class="snl-falle">
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

function Nachbar({ z, ip, praefix }) {
  const [anderes, setAnderes] = useState(() => nachbarVorschlag(ip, praefix));
  const ok = gueltig(anderes.trim());
  const ziel = ok ? anderes.trim() : null;
  const zz = ziel ? zerlege(ziel, praefix) : null;
  const gleich = ziel && gleichesNetz(ip, ziel, praefix);
  // Liegt das Ziel vor dem entscheidenden Oktett schon anders, passt es nicht auf denselben Zahlenstrahl
  const vorneGleich = zz && z.oktette.slice(0, z.index).every((o, i) => o === zz.oktette[i]);
  const nr = z.index + 1;

  return (
    <div class="snl-inhalt">
      <p>
        Ob zwei Geräte im selben Netz sind, entscheidet <strong>jeder PC selbst</strong>: Er nimmt seine eigene Maske und schaut, ob das Ziel in seinem Block liegt. Tipp eine
        zweite Adresse ein:
      </p>
      <div class="snl-zeile">
        <span class="snl-pc mono">
          Dein PC: <strong>{ip}</strong>/{praefix}
        </span>
        <span class="gedaempft">will zu</span>
        <input
          class={`feld mono snl-frage__feld snl-frage__feld--ip ${ok ? '' : 'snv-ip--falsch'}`}
          value={anderes}
          spellcheck={false}
          onInput={(e) => setAnderes(e.currentTarget.value)}
        />
      </div>
      {zz && (
        <>
          {vorneGleich ? (
            <Strahl
              z={z}
              zeigeBlock
              zeiger={[
                { wert: z.wert, text: `du ${z.wert}` },
                { wert: zz.wert, text: `Ziel ${zz.wert}`, ton: gleich ? 'gut' : 'fremd' },
              ]}
            />
          ) : (
            <p class="gedaempft">Die Adressen unterscheiden sich schon vor dem {nr}. Oktett – da braucht man gar nicht weiterzurechnen.</p>
          )}
          <div class="snl-vergleich mono">
            <span>Dein Netz:</span> <strong>{z.n.netz}</strong>
            <span>Netz des Ziels (mit deiner Maske):</span> <strong>{zz.n.netz}</strong>
          </div>
          {gleich ? (
            <Rueckmeldung ok>Gleiches Netz – der PC schickt das Paket direkt hin (über den Switch).</Rueckmeldung>
          ) : (
            <p class="snl-falle snl-falle--info">
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
        „Netz“ ist eine <strong>Regel im Kopf des PCs</strong> (IP + Maske), kein Kabel. Darum brauchen alle Geräte eines Netzes dieselbe Maske und eine IP aus demselben Block –
        und das Gateway muss auch in diesem Block liegen.
      </Merke>
    </div>
  );
}

// ---------- 8. Aufteilen ----------

function Aufteilen({ z, praefix, setPraefix }) {
  const { gesamt, zeilen } = aufteilTabelle(praefix);
  const nr = z.index + 1;
  const basis = zeilen[0].praefix;
  return (
    <div class="snl-inhalt">
      <p>
        Ab dem {nr}. Oktett ist bei /{basis} alles frei: <strong class="mono">{tausend(gesamt)}</strong> Adressen. Der Präfix entscheidet nur, in <strong>wie viele Netze</strong>{' '}
        sie geschnitten werden – die übrigen Adressen sind nicht weg, sie gehören den anderen Netzen.
      </p>
      <div class="snl-tab-rahmen">
        <table class="snv-tab snl-aufteil">
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
      <p class="gedaempft snl-klein">
        „Netze × Adressen“ ist in jeder Zeile {tausend(gesamt)}. Jedes Netz kostet 2 Adressen (Netzadresse + Broadcast) – mehr Netze, mehr reserviert. Zeile anklicken = Präfix
        wählen.
      </p>
      <div class="snl-wozu">
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
      <Merke>Subnetting heißt aufteilen, nicht wegnehmen: Jedes Netz bekommt so viele Adressen, wie es braucht.</Merke>
    </div>
  );
}
