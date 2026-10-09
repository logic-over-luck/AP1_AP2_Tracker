// Raum „Üben“: die Aufgaben, gruppiert nach den Themen-Blöcken des Lernwegs (Feld `thema` der Modi).
// Unter der Übung: die Lektionen, die zu ihr hinführen.

import { useMemo } from 'preact/hooks';
import { Icon } from '../../../ui/bausteine.jsx';
import { link } from '../../../router.js';
import { baueLernweg } from './lernweg.js';

export function Ueben({ raum, lernweg, uebungen, aktiv, onWahl, children }) {
  const kurs = useMemo(() => baueLernweg(lernweg, raum), [lernweg, raum]);
  const gruppen = kurs.BLOECKE.map((b) => ({ ...b, uebungen: uebungen.filter((m) => m.thema === b.id) })).filter((g) => g.uebungen.length);
  return (
    <div class="lw-ueben">
      <nav class="lw-themen" aria-label="Übungen nach Themen">
        {gruppen.map((g) => (
          <div key={g.id} class="lw-thema">
            <span class="lw-thema__titel">{g.titel}</span>
            <div class="lw-thema__liste" role="tablist" aria-label={g.titel}>
              {g.uebungen.map((m) => (
                <button key={m.id} type="button" role="tab" aria-selected={m.id === aktiv.id} class="trainer-modus" onClick={() => onWahl(m)}>
                  {m.name}
                  {m.zusatzIn && <span class="trainer-modus__zusatz">Zusatz</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      {aktiv.hinweis && (
        <p class="trainer-hinweis">
          <Icon name="info" groesse={14} /> {aktiv.hinweis}
        </p>
      )}
      {children}
      <DazuImLernweg kurs={kurs} modus={aktiv} />
    </div>
  );
}

function DazuImLernweg({ kurs, modus }) {
  const lektionen = kurs.LEKTIONEN.filter((l) => l.uebung === modus.id);
  if (!lektionen.length) return null;
  return (
    <div class="lw-dazu">
      <span class="ueberschrift-klein">
        <Icon name="lightbulb" groesse={13} /> Dazu im Lernweg
      </span>
      {lektionen.map((l) => (
        <a key={l.id} class="lw-baut__chip" href={link(kurs.raum, 'trainer', kurs.trainer, { modus: 'verstehen', lektion: l.id })}>
          {l.nr}. {l.begriff}
        </a>
      ))}
    </div>
  );
}
