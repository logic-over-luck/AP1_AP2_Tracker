// Zahlen-Trainer: eine Übersicht der Themen, je Thema eine Seite mit Erklärung, Spickzettel, Werkzeug und Aufgaben,
// dazu ein gemischtes Training über alle Themen. Welche Themen es im Lernraum gibt, sagt das Verzeichnis (modi);
// das offene Thema steht in ?modus= – so führen die Sprünge aus dem Lernplan direkt hinein.
//
// Aufbau: themen.js (Inhalt je Thema) · aufgaben/ (Erzeuger) · stand.js (Stand je Thema aus dem Lernstand)
//         Uebersicht.jsx · Thema.jsx (mit Training.jsx, Werkzeug.jsx) · Mischtraining.jsx · styles/zahlen.css (zt-)

import { useMemo } from 'preact/hooks';
import { inhalt } from '../../../daten/inhalt.js';
import { alleEreignisse, useLernstand } from '../../../lernstand/store.js';
import { THEMEN } from './themen.js';
import { themenStand } from './stand.js';
import { Uebersicht } from './Uebersicht.jsx';
import { Thema } from './Thema.jsx';
import { Mischtraining, GEMISCHT } from './Mischtraining.jsx';

export function ZahlenTrainer({ raum, trainer, modi, params }) {
  const themen = useMemo(() => themenImRaum(modi, raum), [modi, raum]);
  const stand = useThemenStand();
  const aktiv = themen.find((t) => t.id === params.modus);
  if (params.modus === GEMISCHT && themen.length > 1) return <Mischtraining raum={raum} trainer={trainer} themen={themen} />;
  if (aktiv) return <Thema key={aktiv.id} raum={raum} trainer={trainer} thema={aktiv} stand={stand.get(aktiv.id)} />;
  return <Uebersicht raum={raum} trainer={trainer} themen={themen} stand={stand} />;
}

// Themen, die es im Lernraum gibt – mit dem Stichpunkt, dem die Aufgaben dort zugerechnet werden
function themenImRaum(modi, raum) {
  return modi
    .map((m) => {
      const thema = THEMEN.find((t) => t.id === m.id);
      return thema && { ...thema, spIds: m.sp, sp: m.sp.find((id) => inhalt.raumVon(id) === raum) ?? m.sp[0] };
    })
    .filter(Boolean);
}

function useThemenStand() {
  const lernstand = useLernstand();
  return useMemo(() => themenStand(alleEreignisse()), [lernstand]);
}
