// Lernweg-Übersicht: je Themen-Block ein Kapitel – links Titel, Text und Fortschritt, rechts die Lektionen
// als ruhige Liste. Eine schmale Linie verbindet die Statuspunkte und füllt sich mit dem Fortschritt.

import { useState } from 'preact/hooks';
import { Icon, Knopf, Balken, Rich, Aufklapp } from '../../../ui/bausteine.jsx';
import { bestaetige } from '../../../ui/dialog.jsx';

export function Lernweg({ kurs, fortschritt, onLektion }) {
  const { verstanden, naechste, zuruecksetzen } = fortschritt;
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
    <div class="lw-lernweg">
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
      {kurs.BLOECKE.map((b, i) => (
        <Block key={b.id} kurs={kurs} block={b} nr={i + 1} verstanden={verstanden} onLektion={onLektion} />
      ))}
    </div>
  );
}

function Block({ kurs, block, nr, verstanden, onLektion }) {
  const [merkzettel, setMerkzettel] = useState(false);
  const lektionen = kurs.lektionenIn(block.id);
  const fertig = lektionen.filter((l) => verstanden.has(l.id)).length;
  const komplett = fertig === lektionen.length;
  return (
    <section class={`lw-block ${komplett ? 'lw-block--fertig' : ''}`} aria-labelledby={`lw-block-${block.id}`}>
      <header class="lw-block__kopf">
        <span class="lw-block__nr">Block {nr}</span>
        <h2 class="lw-block__titel" id={`lw-block-${block.id}`}>
          {block.titel}
        </h2>
        <p class="lw-block__text">{block.text}</p>
        <div class="lw-block__stand">
          <span class="lw-block__balken" aria-hidden="true">
            <span style={{ width: `${(fertig / lektionen.length) * 100}%` }} />
          </span>
          <span class="lw-block__zahl">
            {komplett && <Icon name="check" groesse={13} strich={2.5} />}
            {fertig} von {lektionen.length}
          </span>
        </div>
      </header>
      <div class="lw-block__inhalt">
        <ol class="lw-liste">
          {lektionen.map((l, i) => (
            <Zeile key={l.id} lektion={l} st={kurs.status(l.id, verstanden)} vorherFertig={i > 0 && verstanden.has(lektionen[i - 1].id)} onLektion={onLektion} />
          ))}
        </ol>
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
      </div>
    </section>
  );
}

const STATUS = {
  verstanden: 'verstanden',
  naechste: 'als Nächstes',
  offen: 'noch nicht dran',
};

function Zeile({ lektion, st, vorherFertig, onLektion }) {
  return (
    <li class={`lw-liste__eintrag lw-liste__eintrag--${st} ${vorherFertig ? 'lw-liste__eintrag--vorher' : ''}`}>
      <button type="button" class={`lw-zeile lw-zeile--${st}`} onClick={() => onLektion(lektion.id)} aria-label={`Lektion ${lektion.nr}: ${lektion.begriff} – ${STATUS[st]}`}>
        <span class="lw-zeile__punkt mono" aria-hidden="true">
          {st === 'verstanden' ? <Icon name="check" groesse={14} strich={2.75} /> : lektion.nr}
        </span>
        <span class="lw-zeile__text">
          <span class="lw-zeile__begriff">{lektion.begriff}</span>
          <span class="lw-zeile__frage">{lektion.leitfrage}</span>
        </span>
        {st === 'naechste' ? <span class="lw-zeile__marke">Als Nächstes</span> : <Icon name="chevron-right" groesse={16} class="lw-zeile__pfeil" />}
      </button>
    </li>
  );
}
