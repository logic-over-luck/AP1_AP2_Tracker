// Dialoge und Meldungen.

import { useEffect, useRef, useState } from 'preact/hooks';
import { createPortal } from 'preact/compat';
import { Icon, SymbolKnopf, Knopf } from './bausteine.jsx';

export function Dialog({ offen, titel, icon, onSchliessen, children, aktionen, breit }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!offen) return;
    const vorher = document.activeElement;
    const taste = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onSchliessen?.();
      }
      if (e.key === 'Tab' && ref.current) {
        const fokussierbar = ref.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!fokussierbar.length) return;
        const erstes = fokussierbar[0];
        const letztes = fokussierbar[fokussierbar.length - 1];
        if (e.shiftKey && document.activeElement === erstes) {
          e.preventDefault();
          letztes.focus();
        } else if (!e.shiftKey && document.activeElement === letztes) {
          e.preventDefault();
          erstes.focus();
        }
      }
    };
    document.addEventListener('keydown', taste, true);
    setTimeout(() => ref.current?.querySelector('[autofocus], .knopf--primaer, input, button')?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', taste, true);
      vorher?.focus?.();
    };
  }, [offen]);
  if (!offen) return null;
  // Direkt in <body> hängen: Ein Vorfahr mit backdrop-filter (z. B. die Kopfzeile) würde
  // „position: fixed" sonst auf sich selbst beziehen, und der Dialog ragte aus dem Fenster.
  return createPortal(
    <div class="dialog-huelle" onMouseDown={(e) => e.target === e.currentTarget && onSchliessen?.()}>
      <div class={`dialog ${breit ? 'dialog--breit' : ''}`} role="dialog" aria-modal="true" aria-label={titel} ref={ref}>
        <div class="dialog__kopf">
          {icon && <Icon name={icon} groesse={18} />}
          <div class="dialog__titel wachsen">{titel}</div>
          <SymbolKnopf icon="x" label="Schließen" groesse="s" onClick={onSchliessen} />
        </div>
        <div class="dialog__inhalt">{children}</div>
        {aktionen && <div class="dialog__aktionen">{aktionen}</div>}
      </div>
    </div>,
    document.body,
  );
}

// Bestätigung als Promise: await bestaetige({ titel, text, ja: 'Löschen' })
let bestaetigeSetzen = null;
export function bestaetige(optionen) {
  return new Promise((aufloesen) => bestaetigeSetzen?.({ ...optionen, aufloesen }));
}

export function BestaetigungsDialog() {
  const [frage, setFrage] = useState(null);
  bestaetigeSetzen = setFrage;
  const antworte = (ja) => {
    frage?.aufloesen(ja);
    setFrage(null);
  };
  return (
    <Dialog
      offen={!!frage}
      titel={frage?.titel}
      icon={frage?.icon}
      onSchliessen={() => antworte(false)}
      aktionen={
        <>
          <Knopf variante="geist" onClick={() => antworte(false)}>
            {frage?.nein ?? 'Abbrechen'}
          </Knopf>
          <Knopf variante={frage?.gefahr ? 'gefahr' : 'primaer'} onClick={() => antworte(true)}>
            {frage?.ja ?? 'OK'}
          </Knopf>
        </>
      }
    >
      {frage?.text}
    </Dialog>
  );
}

// ---------- Meldungen ----------
let meldungenSetzen = null;
let zaehler = 0;
export function melde(text, { icon = 'circle-check', aktion, dauer = 4000, fehler } = {}) {
  const id = ++zaehler;
  meldungenSetzen?.((liste) => [...liste.slice(-2), { id, text, icon: fehler ? 'triangle-alert' : icon, aktion, fehler }]);
  setTimeout(() => meldungenSetzen?.((liste) => liste.filter((m) => m.id !== id)), dauer);
}

export function Meldungen() {
  const [liste, setListe] = useState([]);
  meldungenSetzen = setListe;
  return (
    <div class="meldungen" role="status" aria-live="polite">
      {liste.map((m) => (
        <div key={m.id} class={`meldung ${m.fehler ? 'meldung--fehler' : ''}`}>
          <Icon name={m.icon} groesse={17} />
          <span class="meldung__text">{m.text}</span>
          {m.aktion && (
            <Knopf
              variante="geist"
              groesse="s"
              onClick={() => {
                m.aktion.ausfuehren();
                setListe((l) => l.filter((x) => x.id !== m.id));
              }}
            >
              {m.aktion.text}
            </Knopf>
          )}
          <SymbolKnopf icon="x" label="Schließen" groesse="s" onClick={() => setListe((l) => l.filter((x) => x.id !== m.id))} />
        </div>
      ))}
    </div>
  );
}
