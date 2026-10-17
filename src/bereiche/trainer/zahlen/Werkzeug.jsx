// Werkzeug zum Ausprobieren: ein paar Felder, das Ergebnis rechnet sich beim Tippen mit, der Rechenweg lässt
// sich aufklappen. Was gerechnet wird, beschreibt das Thema (themen.js, Feld werkzeug).

import { useMemo, useState } from 'preact/hooks';
import { Icon } from '../../../ui/bausteine.jsx';
import { Segmente } from './bausteine.jsx';

export function Werkzeug({ definition }) {
  const [werte, setWerte] = useState(() => Object.fromEntries(definition.felder.map((f) => [f.id, f.start ?? ''])));
  const ergebnis = useMemo(() => definition.rechne(werte), [definition, werte]);
  const setze = (id, wert) => setWerte((w) => ({ ...w, [id]: wert }));

  return (
    <section class="flaeche zt-werkzeug" aria-label={definition.titel}>
      <h2 class="zt-seite__titel">
        <Icon name="wand-sparkles" groesse={15} /> {definition.titel}
      </h2>
      <div class="zt-werkzeug__felder">
        {definition.felder.map((f) =>
          f.wahl ? (
            <div key={f.id} class="zt-wfeld">
              <span>{f.label}</span>
              <Segmente optionen={f.wahl} wert={werte[f.id]} onWahl={(w) => setze(f.id, w)} label={f.label} />
            </div>
          ) : (
            <label key={f.id} class="zt-wfeld">
              <span>{f.label}</span>
              <span class="zt-feld__eingabe">
                <input class="feld feld--mono" value={werte[f.id]} inputMode="decimal" autoComplete="off" spellcheck={false} onInput={(e) => setze(f.id, e.currentTarget.value)} />
                {f.einheit && <span class="zt-feld__einheit">{f.einheit}</span>}
              </span>
            </label>
          ),
        )}
      </div>
      {ergebnis.fehler ? (
        <p class="zt-werkzeug__fehler" role="status">
          <Icon name="info" groesse={14} /> {ergebnis.fehler}
        </p>
      ) : (
        <>
          <dl class="zt-ergebnis">
            {ergebnis.zeilen.map((zeile, i) => (
              <div key={i} class={`zt-ergebnis__zeile ${zeile.hervor ? 'zt-ergebnis__zeile--hervor' : ''}`}>
                <dt>{zeile.name}</dt>
                <dd class="mono">{zeile.wert}</dd>
              </div>
            ))}
          </dl>
          {ergebnis.schritte?.length > 0 && (
            <details class="zt-werkzeug__weg">
              <summary>Rechenweg</summary>
              <ol>
                {ergebnis.schritte.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </details>
          )}
        </>
      )}
    </section>
  );
}
