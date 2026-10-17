// Themenseite: Erklärung zum Aufklappen, links die Aufgaben (mit wählbaren Aufgabenarten), rechts Spickzettel und
// Werkzeug. Die Erklärung ist offen, bis die erste Aufgabe des Themas gelöst ist; danach entscheidet der Lernende.

import { useMemo, useState } from 'preact/hooks';
import { inhalt } from '../../../daten/inhalt.js';
import { link } from '../../../router.js';
import { useEinstellung } from '../../../lernstand/einstellungen.js';
import { Icon, Rich, Aufklapp } from '../../../ui/bausteine.jsx';
import { ThemenLinks } from '../rahmen/Uebung.jsx';
import { ARTEN } from './aufgaben/index.js';
import { Training } from './Training.jsx';
import { Werkzeug } from './Werkzeug.jsx';

export function Thema({ raum, trainer, thema, stand }) {
  const arten = ARTEN[thema.id];
  const [gewaehlt, setGewaehlt] = useEinstellung(`zahlen.arten.${thema.id}`, []);
  const gueltig = gewaehlt.filter((id) => arten.some((a) => a.id === id));
  const artenSchluessel = gueltig.join('|');
  const quelle = useMemo(() => () => ({ thema: thema.id, sp: thema.sp, arten: gueltig }), [thema.id, thema.sp, artenSchluessel]);

  const [erklaerung, setErklaerung] = useEinstellung(`zahlen.erklaerung.${thema.id}`, null);
  const [standardOffen] = useState(() => !(stand?.ok > 0));
  const offen = erklaerung ?? standardOffen;

  return (
    <div class="zt">
      <header class="zt-kopf">
        <a class="zt-zurueck" href={link(raum, 'trainer', trainer.id)}>
          <Icon name="arrow-left" groesse={14} /> Alle Themen
        </a>
        <h1 class="zt-kopf__titel">
          <span class="modul__symbol">
            <Icon name={thema.icon} groesse={18} />
          </span>
          {thema.name}
        </h1>
        <p class="zt-kopf__text">{thema.kurz}</p>
      </header>

      <Erklaerung thema={thema} offen={offen} onWechsel={() => setErklaerung(!offen)} />

      <div class="zt-arbeit">
        <div class="zt-haupt">
          <ArtenWahl arten={arten} gewaehlt={gueltig} onWahl={setGewaehlt} />
          <Training quelle={quelle} />
        </div>
        <aside class="zt-seite">
          <section class="flaeche zt-spick" aria-label="Formeln und Regeln">
            <h2 class="zt-seite__titel">
              <Icon name="lightbulb" groesse={15} /> Formeln und Regeln
            </h2>
            <Rich text={thema.spickzettel} />
          </section>
          <Werkzeug definition={thema.werkzeug} />
        </aside>
      </div>

      <ThemenLinks raum={raum} modus={{ sp: thema.spIds }} />
    </div>
  );
}

function Erklaerung({ thema, offen, onWechsel }) {
  // „Das übst du hier“: die Kompetenzen des Themas im Wortlaut der Inhaltsdatei
  const koennen = thema.spIds.flatMap((id) => inhalt.sp.get(id)?.koennen ?? []).filter(([id]) => thema.koennen.includes(id));
  return (
    <div class="zt-erkl">
      <button type="button" class="zt-erkl__knopf" aria-expanded={offen} onClick={onWechsel}>
        <Icon name="book-open" groesse={16} /> Erklärung: {thema.name}
        <Icon name="chevron-down" groesse={16} class="zt-erkl__pfeil" />
      </button>
      <Aufklapp offen={offen}>
        <div class="zt-erkl__inhalt">
          {thema.erklaerung.map((block) => (
            <section key={block.titel} class="zt-erkl__block">
              <h3>{block.titel}</h3>
              <Rich text={block.text} />
            </section>
          ))}
          {koennen.length > 0 && (
            <section class="zt-erkl__block zt-erkl__block--breit">
              <h3>Das übst du hier</h3>
              <Rich text={koennen.map(([, text]) => `- ${text}`).join('\n')} />
            </section>
          )}
        </div>
      </Aufklapp>
    </div>
  );
}

function ArtenWahl({ arten, gewaehlt, onWahl }) {
  if (arten.length < 2) return null;
  const umschalten = (id) => onWahl(gewaehlt.includes(id) ? gewaehlt.filter((x) => x !== id) : [...gewaehlt, id]);
  return (
    <div class="zt-arten" role="group" aria-label="Aufgabenarten">
      <span class="zt-arten__titel">Aufgaben:</span>
      <button type="button" class="zt-art" aria-pressed={gewaehlt.length === 0} onClick={() => onWahl([])}>
        Alle gemischt
      </button>
      {arten.map((a) => (
        <button key={a.id} type="button" class="zt-art" aria-pressed={gewaehlt.includes(a.id)} onClick={() => umschalten(a.id)}>
          {a.name}
        </button>
      ))}
    </div>
  );
}
