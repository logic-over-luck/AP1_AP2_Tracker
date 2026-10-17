// Übersicht des Zahlen-Trainers: je Thema eine Kachel mit Stand, dazu das gemischte Training.

import { inhalt } from '../../../daten/inhalt.js';
import { link } from '../../../router.js';
import { Icon, Marke } from '../../../ui/bausteine.jsx';
import { StandZeile } from './bausteine.jsx';
import { GEMISCHT, MISCH_LAENGE } from './Mischtraining.jsx';

export function Uebersicht({ raum, trainer, themen, stand }) {
  const r = inhalt.raeume.get(raum);
  const ziel = (modus) => link(raum, 'trainer', trainer.id, { modus });
  return (
    <div class="zt">
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">{r.name} · Trainer</div>
          <h1 class="seitenkopf__titel">{trainer.name}</h1>
          <p class="seitenkopf__text">Such dir ein Thema aus. Jede Seite hat die Formeln, ein Werkzeug zum Ausprobieren und Aufgaben mit Lösungsweg.</p>
        </div>
      </header>
      <div class="zt-kacheln">
        {themen.map((t) => (
          <a key={t.id} class="flaeche flaeche--klickbar zt-kachel" href={ziel(t.id)}>
            <span class="zt-kachel__kopf">
              <span class="modul__symbol">
                <Icon name={t.icon} groesse={18} />
              </span>
              {stand.get(t.id)?.sicher && (
                <Marke ton="gut" icon="check">
                  sicher
                </Marke>
              )}
            </span>
            <span class="zt-kachel__titel">{t.name}</span>
            <span class="zt-kachel__text">{t.kurz}</span>
            <StandZeile stand={stand.get(t.id)} />
          </a>
        ))}
        {themen.length > 1 && (
          <a class="flaeche flaeche--klickbar flaeche--akzent zt-kachel zt-kachel--misch" href={ziel(GEMISCHT)}>
            <span class="modul__symbol">
              <Icon name="shuffle" groesse={18} />
            </span>
            <span class="zt-kachel__misch-text">
              <span class="zt-kachel__titel">Gemischtes Training</span>
              <span class="zt-kachel__text">
                {MISCH_LAENGE} Aufgaben quer durch {themen.length === 2 ? 'beide' : `alle ${themen.length}`} Themen, ohne Vorwarnung – wie in der Prüfung. Am Ende siehst du, wo es hakt.
              </span>
            </span>
            <Icon name="arrow-right" groesse={18} class="zt-kachel__pfeil" />
          </a>
        )}
      </div>
    </div>
  );
}
