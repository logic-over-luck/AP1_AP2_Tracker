// Fortschritt im Lernweg: welche Lektionen verstanden sind. Eine Ansichts-Einstellung im Browser
// (lernstand/einstellungen.js), kein Lernstand-Ereignis – sie lässt sich im Lernweg zurücksetzen.

import { useEinstellung } from '../../../../lernstand/einstellungen.js';
import { LEKTIONEN, naechsteLektion } from './lernweg.js';

const SCHLUESSEL = 'subnetz.lernweg';

export function useFortschritt() {
  const [liste, setListe] = useEinstellung(SCHLUESSEL, []);
  // Nur IDs, die es (noch) gibt
  const verstanden = new Set(liste.filter((id) => LEKTIONEN.some((l) => l.id === id)));
  return {
    verstanden,
    naechste: naechsteLektion(verstanden),
    markiere: (id) => setListe((alt) => (alt.includes(id) ? alt : [...alt, id])),
    zuruecksetzen: () => setListe([]),
  };
}
