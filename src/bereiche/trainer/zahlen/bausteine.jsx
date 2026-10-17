// Kleine Bausteine des Zahlen-Trainers: Segmentknöpfe für Auswahlfelder und die Stand-Zeile eines Themas.

import { Icon, Balken } from '../../../ui/bausteine.jsx';

// Auswahl aus wenigen Möglichkeiten als Knopfreihe. optionen: Texte oder [{ wert, text }]
// In einem Formular schickt Enter auf einem Knopf das Formular ab (prüfen), statt den Knopf erneut zu drücken.
export function Segmente({ optionen, wert, onWahl, label, disabled, zustand }) {
  const enterPrueft = (e) => {
    if (e.key !== 'Enter' || !e.currentTarget.form) return;
    e.preventDefault();
    e.currentTarget.form.requestSubmit();
  };
  return (
    <div class={`zt-segmente ${zustand ? `zt-segmente--${zustand}` : ''}`} role="group" aria-label={label}>
      {optionen.map((o) => {
        const w = o.wert ?? o;
        return (
          <button key={w} type="button" class="zt-segment" aria-pressed={w === wert} disabled={disabled} onClick={() => onWahl(w)} onKeyDown={enterPrueft}>
            {o.text ?? o}
          </button>
        );
      })}
    </div>
  );
}

// „Noch nicht geübt“ oder ein Balken mit „zuletzt 8 von 10 richtig · 23 gelöst“
export function StandZeile({ stand }) {
  if (!stand?.n) {
    return (
      <div class="zt-stand zt-stand--leer">
        <Icon name="circle" groesse={12} /> Noch nicht geübt
      </div>
    );
  }
  const anteil = stand.zuletztOk / stand.letzte.length;
  return (
    <div class="zt-stand">
      <Balken wert={anteil} ton={anteil < 0.5 ? 'warn' : undefined} label="Zuletzt richtig" />
      <div class="zt-stand__text">
        zuletzt <strong>{stand.zuletztOk}</strong> von {stand.letzte.length} richtig · {stand.ok} gelöst
      </div>
    </div>
  );
}
