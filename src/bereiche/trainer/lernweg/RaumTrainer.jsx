// Rahmen für Trainer mit Räumen (Verstehen, Üben, ggf. weitere): Kopf, Raum-Umschalter, „Gehört zu“.
// Welcher Raum offen ist, ergibt sich aus ?modus= (Feld `bereich` der Modi in verzeichnis.js). So bleiben die
// Sprünge aus dem Lernplan („Üben: Netz bestimmen“ → ?modus=analyse) gültig. Die zuletzt gewählte Übung merkt
// sich der Rahmen je Trainer.
//
// raeume: [{ id, name, text, icon }] · children(aktiv, { uebungen, oeffne, waehleUebung }) → Inhalt des Raums

import { inhalt } from '../../../daten/inhalt.js';
import { geheZu } from '../../../router.js';
import { useEinstellung } from '../../../lernstand/einstellungen.js';
import { Icon } from '../../../ui/bausteine.jsx';
import { ThemenLinks } from '../rahmen/Uebung.jsx';

export const VERSTEHEN = { id: 'verstehen', name: 'Verstehen', text: 'Lernweg, ein Begriff nach dem anderen', icon: 'lightbulb' };
export const UEBEN = { id: 'ueben', name: 'Üben', text: 'Aufgaben mit Prüfen', icon: 'target' };

export function RaumTrainer({ raum, trainer, modi, params, untertitel, raeume, kuerzel, children }) {
  const aktiv = modi.find((m) => m.id === params.modus) ?? modi[0];
  const [letzteUebung, setLetzteUebung] = useEinstellung(`${trainer.id}.uebung`, null);
  const uebungen = modi.filter((m) => m.bereich === 'ueben');
  const r = inhalt.raeume.get(raum);

  const oeffne = (modus, weitere = {}, optionen = {}) => geheZu(raum, 'trainer', trainer.id, { modus, ...weitere }, optionen);
  const wechsle = (b) => {
    if (b === aktiv.bereich) return;
    const ziel = b === 'ueben' ? (uebungen.find((m) => m.id === letzteUebung) ?? uebungen[0]) : modi.find((m) => m.bereich === b);
    oeffne(ziel.id, {}, { ersetzen: true });
  };
  const waehleUebung = (m) => {
    setLetzteUebung(m.id);
    oeffne(m.id, {}, { ersetzen: true });
  };

  return (
    <div class={`trainer lw ${kuerzel ?? ''}`}>
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">{r.name} · Trainer</div>
          <h1 class="seitenkopf__titel">{trainer.name}</h1>
          <p class="seitenkopf__text">{untertitel ?? trainer.text}</p>
        </div>
      </header>
      <div class="lw-raeume" role="tablist" aria-label="Räume">
        {raeume.map((b) => (
          <button key={b.id} type="button" role="tab" aria-selected={b.id === aktiv.bereich} class="lw-raum" onClick={() => wechsle(b.id)}>
            <Icon name={b.icon} groesse={18} />
            <span>
              <span class="lw-raum__name">{b.name}</span>
              <span class="lw-raum__text">{b.text}</span>
            </span>
          </button>
        ))}
      </div>
      {children(aktiv, { uebungen, oeffne, waehleUebung })}
      <ThemenLinks raum={raum} modus={aktiv} />
    </div>
  );
}
