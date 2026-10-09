// Lernweg-Übersicht: je Themen-Block Titel, Fortschritt und die Lektionen als kleine Kacheln.
// Die Kacheln laufen als Schlange: Reihen von links nach rechts mit Pfeilen, am Reihenende biegt ein
// geschwungener Pfeil zurück zum Anfang der nächsten Reihe. Spaltenzahl nach Breite; schmal eine Spalte.

import { Fragment } from 'preact';
import { useLayoutEffect, useRef, useState } from 'preact/hooks';
import { Icon, Knopf, Balken, Rich, Aufklapp } from '../../../ui/bausteine.jsx';
import { bestaetige } from '../../../ui/dialog.jsx';

const PFEIL = 32; // Breite der Pfeil-Spalte zwischen zwei Kacheln (px), passt zu --lw-pfeil im CSS

function spaltenFuer(breite) {
  if (breite >= 960) return 4;
  if (breite >= 700) return 3;
  if (breite >= 500) return 2;
  return 1;
}

export function Lernweg({ kurs, fortschritt, onLektion }) {
  const { verstanden, naechste, zuruecksetzen } = fortschritt;
  const ref = useRef(null);
  const [breite, setBreite] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const messen = () => setBreite(el.clientWidth);
    messen();
    const ro = new ResizeObserver(messen);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const anzahl = verstanden.size;
  const gesamt = kurs.LEKTIONEN.length;

  const allesZuruecksetzen = async () => {
    const ok = await bestaetige({
      titel: 'Fortschritt zurücksetzen?',
      text: 'Alle Lektionen gelten danach wieder als „noch nicht dran“. Dein übriger Lernstand bleibt erhalten.',
      ja: 'Zurücksetzen',
      gefahr: true,
    });
    if (ok) zuruecksetzen();
  };

  return (
    <div class="lw-lernweg" ref={ref}>
      <section class="flaeche lw-start">
        <div class="lw-start__text">
          <span class="ueberschrift-klein">Dein Lernweg</span>
          <span class="lw-start__stand">
            <strong>{anzahl}</strong> von {gesamt} Lektionen verstanden
          </span>
          <Balken wert={anzahl / gesamt} label="Fortschritt im Lernweg" />
          <p class="lw-start__erkl">
            Jede Lektion erklärt einen Begriff, den die nächste braucht – zum Lesen, Ausprobieren und mit einem kurzen Check am Ende. Erst nach dem Check gilt sie als verstanden.
          </p>
        </div>
        <div class="lw-start__aktion">
          {naechste ? (
            <Knopf variante="primaer" iconRechts="arrow-right" onClick={() => onLektion(naechste.id)}>
              {anzahl ? 'Weiter' : 'Los geht’s'} mit {naechste.nr}. {naechste.begriff}
            </Knopf>
          ) : (
            <span class="lw-start__fertig">
              <Icon name="party-popper" groesse={16} /> Alle Lektionen verstanden
            </span>
          )}
          {anzahl > 0 && (
            <Knopf variante="geist" groesse="s" icon="rotate-ccw" onClick={allesZuruecksetzen}>
              Fortschritt zurücksetzen
            </Knopf>
          )}
        </div>
      </section>
      {breite > 0 && kurs.BLOECKE.map((b, i) => <Block key={b.id} kurs={kurs} block={b} nr={i + 1} verstanden={verstanden} breite={breite} onLektion={onLektion} />)}
    </div>
  );
}

function Block({ kurs, block, nr, verstanden, breite, onLektion }) {
  const [merkzettel, setMerkzettel] = useState(false);
  const lektionen = kurs.lektionenIn(block.id);
  const fertig = lektionen.filter((l) => verstanden.has(l.id)).length;
  const spalten = spaltenFuer(breite);
  return (
    <section class={`lw-block ${fertig === lektionen.length ? 'lw-block--fertig' : ''}`} aria-labelledby={`sn-block-${block.id}`}>
      <header class="lw-block__kopf">
        <div class="lw-block__titelzeile">
          <span class="lw-block__nr">Block {nr}</span>
          <h2 class="lw-block__titel" id={`sn-block-${block.id}`}>
            {block.titel}
          </h2>
          <span class="lw-block__stand" title="verstanden">
            {fertig === lektionen.length && <Icon name="check" groesse={13} strich={2.5} />}
            {fertig}/{lektionen.length}
          </span>
        </div>
        <p class="lw-block__text">{block.text}</p>
      </header>
      <Schlange kurs={kurs} lektionen={lektionen} spalten={spalten} breite={breite} verstanden={verstanden} onLektion={onLektion} />
      <button type="button" class="lw-merk__knopf" aria-expanded={merkzettel} onClick={() => setMerkzettel(!merkzettel)}>
        <Icon name="notebook-pen" groesse={14} /> Merkzettel: alle Definitionen dieses Blocks
        <Icon name="chevron-down" groesse={14} class={`lw-merk__pfeil ${merkzettel ? 'lw-merk__pfeil--offen' : ''}`} />
      </button>
      <Aufklapp offen={merkzettel}>
        <dl class="lw-merk">
          {lektionen.map((l) => (
            <div key={l.id} class="lw-merk__eintrag">
              <dt>
                <span class="lw-merk__nr mono">{l.nr}</span> {l.begriff}
              </dt>
              <dd>
                <Rich text={l.definition} />
              </dd>
            </div>
          ))}
        </dl>
      </Aufklapp>
    </section>
  );
}

function Schlange({ kurs, lektionen, spalten, breite, verstanden, onLektion }) {
  if (spalten === 1) {
    return (
      <ol class="lw-schlange lw-schlange--spalte">
        {lektionen.map((l, i) => (
          <li key={l.id} class="lw-schlange__glied">
            {i > 0 && <PfeilRunter fertig={verstanden.has(lektionen[i - 1].id)} />}
            <Kachel lektion={l} st={kurs.status(l.id, verstanden)} onLektion={onLektion} />
          </li>
        ))}
      </ol>
    );
  }
  const reihen = [];
  for (let i = 0; i < lektionen.length; i += spalten) reihen.push(lektionen.slice(i, i + spalten));
  const raster = { gridTemplateColumns: `repeat(${spalten - 1}, minmax(0, 1fr) ${PFEIL}px) minmax(0, 1fr)` };
  return (
    <ol class="lw-schlange">
      {reihen.map((reihe, r) => (
        <Fragment key={r}>
          <li class="lw-schlange__reihe" style={raster}>
            {reihe.map((l, i) => (
              <Fragment key={l.id}>
                {i > 0 && <PfeilRechts fertig={verstanden.has(reihe[i - 1].id)} />}
                <Kachel lektion={l} st={kurs.status(l.id, verstanden)} onLektion={onLektion} />
              </Fragment>
            ))}
          </li>
          {r < reihen.length - 1 && <Kurve spalten={spalten} breite={breite} fertig={verstanden.has(reihe[reihe.length - 1].id)} />}
        </Fragment>
      ))}
    </ol>
  );
}

const STATUS = {
  verstanden: { text: 'verstanden', icon: 'circle-check' },
  naechste: { text: 'als Nächstes', icon: 'arrow-right' },
  offen: { text: 'noch nicht dran', icon: 'circle' },
};

function Kachel({ lektion, st, onLektion }) {
  return (
    <button type="button" class={`lw-kachel lw-kachel--${st}`} onClick={() => onLektion(lektion.id)} aria-label={`Lektion ${lektion.nr}: ${lektion.begriff} – ${STATUS[st].text}`}>
      <span class="lw-kachel__nr mono">{String(lektion.nr).padStart(2, '0')}</span>
      <span class="lw-kachel__begriff">{lektion.begriff}</span>
      <span class="lw-kachel__frage">{lektion.leitfrage}</span>
      <span class="lw-kachel__status">
        <Icon name={STATUS[st].icon} groesse={13} strich={2.2} /> {STATUS[st].text}
      </span>
    </button>
  );
}

function PfeilRechts({ fertig }) {
  return (
    <span class={`lw-pfeil lw-pfeil--rechts ${fertig ? 'lw-pfeil--fertig' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 32 12" width="32" height="12">
        <path d="M3 6 H26" />
        <path d="M22 2 L28 6 L22 10" class="lw-pfeil__spitze" />
      </svg>
    </span>
  );
}

function PfeilRunter({ fertig }) {
  return (
    <span class={`lw-pfeil lw-pfeil--runter ${fertig ? 'lw-pfeil--fertig' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 12 28" width="12" height="28">
        <path d="M6 2 V22" />
        <path d="M2 18 L6 24 L10 18" class="lw-pfeil__spitze" />
      </svg>
    </span>
  );
}

// Geschwungener Pfeil vom Ende einer Reihe (Mitte der letzten Spalte) zurück zum Anfang der nächsten (Mitte der ersten)
function Kurve({ spalten, breite, fertig }) {
  const hoehe = 44;
  const kachel = (breite - (spalten - 1) * PFEIL) / spalten;
  const mitte = (c) => c * (kachel + PFEIL) + kachel / 2;
  const xe = mitte(spalten - 1);
  const xs = mitte(0);
  const m = hoehe / 2;
  const r = 16;
  const d = `M ${xe} 2 V ${m - r} Q ${xe} ${m} ${xe - r} ${m} H ${xs + r} Q ${xs} ${m} ${xs} ${m + r} V ${hoehe - 6}`;
  return (
    <li class={`lw-kurve ${fertig ? 'lw-pfeil--fertig' : ''}`} aria-hidden="true">
      <svg width={breite} height={hoehe} viewBox={`0 0 ${breite} ${hoehe}`}>
        <path d={d} />
        <path d={`M ${xs - 4} ${hoehe - 10} L ${xs} ${hoehe - 4} L ${xs + 4} ${hoehe - 10}`} class="lw-pfeil__spitze" />
      </svg>
    </li>
  );
}
