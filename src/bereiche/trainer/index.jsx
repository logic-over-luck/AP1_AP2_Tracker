// Trainer-Bereich: Übersicht und Zuordnung der Trainer-Komponenten.

import { inhalt } from '../../daten/inhalt.js';
import { useLernstand } from '../../lernstand/store.js';
import { link } from '../../router.js';
import { Icon, Leer, Knopf } from '../../ui/bausteine.jsx';
import { TRAINER, trainerById, trainerIn, modiIn } from './verzeichnis.js';

import { ZahlenTrainer } from './zahlen/Zahlen.jsx';
import { SubnetzTrainer } from './subnetz/Subnetz.jsx';
import { KaufmaennischTrainer } from './kaufmaennisch/Kaufmaennisch.jsx';
import { NetzplanTrainer } from './netzplan/Netzplan.jsx';

// Komponenten je Trainer. Ein neuer Trainer: Eintrag in verzeichnis.js + Komponente hier.
const KOMPONENTEN = {
  zahlen: ZahlenTrainer,
  subnetz: SubnetzTrainer,
  kaufmaennisch: KaufmaennischTrainer,
  netzplan: NetzplanTrainer,
};

export function TrainerBereich({ raum, trainerId, params }) {
  const stand = useLernstand();
  const t = trainerId ? trainerById(trainerId) : null;
  if (!t) return <TrainerUebersicht raum={raum} stand={stand} />;
  const modi = modiIn(t, raum);
  if (!modi.length) {
    return (
      <div class="flaeche">
        <Leer icon="lock" titel={`${t.name} gehört nicht zu ${inhalt.raeume.get(raum).name}`} aktion={<Knopf onClick={() => (location.hash = link(raum, 'trainer'))}>Zu den Trainern</Knopf>}>
          Nach dem Prüfungskatalog wird dieser Trainer in diesem Lernraum nicht gebraucht.
        </Leer>
      </div>
    );
  }
  const K = KOMPONENTEN[t.id];
  if (!K) return <Leer icon="target" titel={t.name}>Dieser Trainer wird gerade gebaut.</Leer>;
  return <K raum={raum} trainer={t} modi={modi} params={params} stand={stand} />;
}

function TrainerUebersicht({ raum, stand }) {
  const r = inhalt.raeume.get(raum);
  return (
    <div>
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">{r.name} · Üben</div>
          <h1 class="seitenkopf__titel">Trainer</h1>
          <p class="seitenkopf__text">Hier übst du, was in der Prüfung gerechnet, gezeichnet oder geschrieben wird.</p>
        </div>
      </header>
      <div class="trainer-raster">
        {trainerIn(raum).map((t) => {
          const s = stand.trainer.get(t.id);
          return (
            <a key={t.id} class="flaeche flaeche--klickbar trainer-kachel" href={link(raum, 'trainer', t.id)}>
              <span class="modul__symbol">
                <Icon name={t.icon} groesse={18} />
              </span>
              <span class="trainer-kachel__titel">{t.name}</span>
              <span class="trainer-kachel__text">{t.text}</span>
              <span class="trainer-kachel__fuss gedaempft">
                {modiIn(t, raum).length} Übungsarten{s ? ` · ${s.ok}/${s.n} richtig` : ''}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export { TRAINER };
