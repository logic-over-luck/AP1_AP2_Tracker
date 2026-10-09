// Subnetz-Trainer: drei Räume – Verstehen (Lernweg), Üben (Aufgaben nach Themen), Visualisieren (Visualizer).
// Welcher Raum offen ist, ergibt sich aus ?modus= (Feld `bereich` der Module in verzeichnis.js). So bleiben die
// Sprünge aus dem Lernplan („Üben: Netz bestimmen“ → ?modus=analyse) gültig.

import { inhalt } from '../../../daten/inhalt.js';
import { geheZu } from '../../../router.js';
import { useEinstellung } from '../../../lernstand/einstellungen.js';
import { Icon } from '../../../ui/bausteine.jsx';
import { ThemenLinks } from '../rahmen/Uebung.jsx';
import { SubnetzVisualizer } from './Visualizer.jsx';
import { SubnetzVerstehen } from './Verstehen.jsx';
import { Ueben } from './ueben/Ueben.jsx';

const RAEUME = [
  { id: 'verstehen', name: 'Verstehen', text: 'Lernweg, ein Begriff nach dem anderen', icon: 'lightbulb' },
  { id: 'ueben', name: 'Üben', text: 'Aufgaben mit Prüfen', icon: 'target' },
  { id: 'visualisieren', name: 'Visualisieren', text: 'Eine Adresse zerlegt ansehen', icon: 'eye' },
];

export function SubnetzTrainer({ raum, trainer, modi, params }) {
  const aktiv = modi.find((m) => m.id === params.modus) ?? modi[0];
  const [letzteUebung, setLetzteUebung] = useEinstellung('subnetz.uebung', null);
  const uebungen = modi.filter((m) => m.bereich === 'ueben');
  const r = inhalt.raeume.get(raum);

  const oeffne = (modus, weitere = {}, optionen = {}) => geheZu(raum, 'trainer', trainer.id, { modus, ...weitere }, optionen);
  const wechsle = (b) => {
    if (b === aktiv.bereich) return;
    const ziel = b === 'ueben' ? (uebungen.find((m) => m.id === letzteUebung) ?? uebungen[0]) : modi.find((m) => m.bereich === b);
    oeffne(ziel.id, {}, { ersetzen: true });
  };

  return (
    <div class="trainer sn">
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">{r.name} · Trainer</div>
          <h1 class="seitenkopf__titel">{trainer.name}</h1>
          <p class="seitenkopf__text">IP-Adressen und Subnetting: verstehen, üben, ansehen.</p>
        </div>
      </header>
      <div class="sn-raeume" role="tablist" aria-label="Räume">
        {RAEUME.map((b) => (
          <button key={b.id} type="button" role="tab" aria-selected={b.id === aktiv.bereich} class="sn-raum" onClick={() => wechsle(b.id)}>
            <Icon name={b.icon} groesse={18} />
            <span>
              <span class="sn-raum__name">{b.name}</span>
              <span class="sn-raum__text">{b.text}</span>
            </span>
          </button>
        ))}
      </div>
      {aktiv.bereich === 'verstehen' && <SubnetzVerstehen lektion={params.lektion} onLektion={(id) => oeffne('verstehen', { lektion: id ?? undefined })} />}
      {aktiv.bereich === 'ueben' && (
        <Ueben
          uebungen={uebungen}
          aktiv={aktiv}
          onWahl={(m) => {
            setLetzteUebung(m.id);
            oeffne(m.id, {}, { ersetzen: true });
          }}
        />
      )}
      {aktiv.bereich === 'visualisieren' && <SubnetzVisualizer />}
      <ThemenLinks raum={raum} modus={aktiv} />
    </div>
  );
}
