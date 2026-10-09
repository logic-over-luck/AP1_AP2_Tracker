// Rahmen einer Lektion – für alle Lektionen gleich:
// Kopf (Block, Nummer, Begriff, Leitfrage, „Baut auf“) → 1 Verstehen (Erklärung + Definition) → 2 Ausprobieren
// → 3 Aufpassen (Stolperfallen, Merksatz) → 4 Check → Weiter. Erklärung und Ausprobieren kommen aus inhalt/.

import { Icon, Knopf, Rich } from '../../../../ui/bausteine.jsx';
import { link } from '../../../../router.js';
import { LEKTIONEN, BLOECKE, blockVon, lektion as lektionVon, luecken } from './lernweg.js';
import { CHECKS } from './checks.js';
import { INHALT } from './inhalt/index.js';
import { Check } from './Check.jsx';
import { AlleOffen } from './bausteine.jsx';
import { trainerById } from '../../verzeichnis.js';

export function Lektion({ lektion, fortschritt, onLektion }) {
  const { verstanden, markiere } = fortschritt;
  const block = blockVon(lektion.id);
  const blockNr = BLOECKE.indexOf(block) + 1;
  const vorige = LEKTIONEN[lektion.nr - 2] ?? null;
  const naechste = LEKTIONEN[lektion.nr] ?? null;
  const fehlt = luecken(lektion.id, verstanden);
  const istVerstanden = verstanden.has(lektion.id);
  const inhalt = INHALT[lektion.id] ?? {};
  const { Erklaerung, Ausprobieren } = inhalt;
  const uebung = lektion.uebung ? trainerById('subnetz').modi.find((m) => m.id === lektion.uebung) : null;

  return (
    <article class="sn-lektion">
      <nav class="sn-lnav" aria-label="Lektionen">
        <button type="button" class="sn-lnav__zurueck" onClick={() => onLektion(null)}>
          <Icon name="arrow-left" groesse={14} /> Lernweg
        </button>
        <span class="sn-lnav__stand mono">
          {lektion.nr} / {LEKTIONEN.length}
        </span>
        <span class="sn-lnav__blaettern">
          <button
            type="button"
            class="sn-lnav__pfeil"
            disabled={!vorige}
            onClick={() => onLektion(vorige.id)}
            aria-label={vorige ? `Vorige Lektion: ${vorige.begriff}` : 'Keine vorige Lektion'}
          >
            <Icon name="chevron-left" groesse={16} />
          </button>
          <button
            type="button"
            class="sn-lnav__pfeil"
            disabled={!naechste}
            onClick={() => onLektion(naechste.id)}
            aria-label={naechste ? `Nächste Lektion: ${naechste.begriff}` : 'Keine nächste Lektion'}
          >
            <Icon name="chevron-right" groesse={16} />
          </button>
        </span>
      </nav>

      <header class="sn-lkopf">
        <span class="sn-lkopf__block">
          Block {blockNr} · {block.titel}
        </span>
        <h2 class="sn-lkopf__begriff">
          <span class="sn-lkopf__nr mono">{String(lektion.nr).padStart(2, '0')}</span>
          {lektion.begriff}
          {istVerstanden && (
            <span class="sn-lkopf__ok" title="verstanden">
              <Icon name="circle-check" groesse={18} /> verstanden
            </span>
          )}
        </h2>
        <p class="sn-lkopf__frage">{lektion.leitfrage}</p>
        {lektion.braucht.length > 0 && (
          <div class="sn-baut">
            <span class="sn-baut__titel">Baut auf</span>
            {lektion.braucht.map((id) => {
              const b = lektionVon(id);
              const ok = verstanden.has(id);
              return (
                <button key={id} type="button" class={`sn-baut__chip ${ok ? 'sn-baut__chip--ok' : ''}`} onClick={() => onLektion(id)}>
                  <Icon name={ok ? 'circle-check' : 'circle'} groesse={12} strich={2.2} />
                  {b.nr}. {b.begriff}
                </button>
              );
            })}
          </div>
        )}
        {fehlt.length > 0 && (
          <p class="sn-baut__luecke">
            <Icon name="info" groesse={14} />
            <span>
              Diese Lektion benutzt {fehlt.length === 1 ? 'einen Begriff, den' : 'Begriffe, die'} du noch nicht abgehakt hast. Am besten zuerst{' '}
              {fehlt.map((b, i) => (
                <span key={b.id}>
                  {i > 0 && (i === fehlt.length - 1 ? ' und ' : ', ')}
                  <button type="button" class="sn-link" onClick={() => onLektion(b.id)}>
                    {b.nr}. {b.begriff}
                  </button>
                </span>
              ))}
              .
            </span>
          </p>
        )}
      </header>

      <Abschnitt nr={1} titel="Verstehen" icon="book-open">
        <AlleOffen.Provider value={istVerstanden}>{Erklaerung ? <Erklaerung /> : null}</AlleOffen.Provider>
        <div class="sn-definition">
          <span class="sn-definition__titel">
            <Icon name="graduation-cap" groesse={15} /> So sagst du es in der Prüfung
          </span>
          <Rich text={lektion.definition} />
        </div>
      </Abschnitt>

      <Abschnitt nr={2} titel="Ausprobieren" icon="wand-sparkles">
        {Ausprobieren ? <Ausprobieren /> : null}
      </Abschnitt>

      <Abschnitt nr={3} titel="Aufpassen" icon="triangle-alert">
        <ul class="sn-fehler">
          {(lektion.fehler ?? []).map((f, i) => (
            <li key={i} class="sn-fehler__eintrag">
              <span class="sn-fehler__falsch">
                <Icon name="circle-x" groesse={15} />
                <Rich text={f.falsch} />
              </span>
              <span class="sn-fehler__richtig">
                <Icon name="circle-check" groesse={15} />
                <Rich text={f.richtig} />
              </span>
            </li>
          ))}
        </ul>
        {lektion.merksatz && (
          <p class="sn-merksatz">
            <Icon name="lightbulb" groesse={16} />
            <span>
              <strong>Merksatz:</strong> {lektion.merksatz}
            </span>
          </p>
        )}
      </Abschnitt>

      <Abschnitt nr={4} titel="Check" icon="list-checks">
        <Check fragen={CHECKS[lektion.id] ?? []} schonVerstanden={istVerstanden} onFertig={() => markiere(lektion.id)} />
      </Abschnitt>

      <footer class={`sn-lfuss ${istVerstanden ? 'sn-lfuss--ok' : ''}`}>
        {istVerstanden ? (
          <>
            <span class="sn-lfuss__text">
              <Icon name="party-popper" groesse={18} /> <strong>{lektion.begriff}</strong> – verstanden.
            </span>
            {naechste ? (
              <Knopf variante="primaer" iconRechts="arrow-right" onClick={() => onLektion(naechste.id)}>
                Weiter zu {naechste.nr}. {naechste.begriff}
              </Knopf>
            ) : (
              <Knopf variante="primaer" icon="route" onClick={() => onLektion(null)}>
                Zum Lernweg – alles geschafft
              </Knopf>
            )}
          </>
        ) : (
          <span class="sn-lfuss__text">
            <Icon name="list-checks" groesse={16} /> Beantworte die Fragen im Check – dann geht es weiter.
          </span>
        )}
        {uebung && (
          <a class="sn-lfuss__ueben" href={link('AP1', 'trainer', 'subnetz', { modus: uebung.id })}>
            <Icon name="target" groesse={14} /> Üben: {uebung.name}
          </a>
        )}
      </footer>
    </article>
  );
}

function Abschnitt({ nr, titel, icon, children }) {
  return (
    <section class="sn-abschnitt">
      <h3 class="sn-abschnitt__titel">
        <span class="sn-abschnitt__nr mono">{nr}</span>
        <Icon name={icon} groesse={16} />
        {titel}
      </h3>
      <div class="sn-abschnitt__inhalt">{children}</div>
    </section>
  );
}
