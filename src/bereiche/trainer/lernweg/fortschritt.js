// Fortschritt in einem Lernweg: welche Lektionen verstanden sind. Eine Ansichts-Einstellung im Browser
// (lernstand/einstellungen.js), kein Lernstand-Ereignis – sie lässt sich im Lernweg zurücksetzen.

import { useEinstellung } from '../../../lernstand/einstellungen.js';

export function useFortschritt(kurs) {
  const [liste, setListe] = useEinstellung(kurs.schluessel, []);
  // Nur IDs, die es (noch) gibt
  const verstanden = new Set(liste.filter((id) => kurs.lektion(id)));
  return {
    verstanden,
    naechste: kurs.naechsteLektion(verstanden),
    markiere: (id) => setListe((alt) => (alt.includes(id) ? alt : [...alt, id])),
    zuruecksetzen: () => setListe([]),
  };
}

// Nur lesen: ist eine Lektion eines (anderen) Lernwegs verstanden?
export function useVerstanden(kurs, id) {
  const [liste] = useEinstellung(kurs.schluessel, []);
  return liste.includes(id);
}
