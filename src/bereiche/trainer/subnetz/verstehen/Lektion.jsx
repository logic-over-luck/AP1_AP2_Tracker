// Rahmen einer Lektion – für alle Lektionen gleich (wird in Etappe 3 ausgebaut).

import { Icon } from '../../../../ui/bausteine.jsx';
import { blockVon } from './lernweg.js';

export function Lektion({ lektion, onLektion }) {
  const block = blockVon(lektion.id);
  return (
    <article class="sn-lektion">
      <button type="button" class="sn-zurueck" onClick={() => onLektion(null)}>
        <Icon name="arrow-left" groesse={14} /> Lernweg
      </button>
      <header class="sn-lkopf">
        <span class="sn-lkopf__block">
          {block.titel} · Lektion {lektion.nr}
        </span>
        <h2 class="sn-lkopf__begriff">{lektion.begriff}</h2>
        <p class="sn-lkopf__frage">{lektion.leitfrage}</p>
      </header>
    </article>
  );
}
