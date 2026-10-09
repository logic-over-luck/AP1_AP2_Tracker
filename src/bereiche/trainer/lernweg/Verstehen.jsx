// Raum „Verstehen“: ohne ?lektion= der Lernweg, sonst die gewählte Lektion.
// lernweg: Beschreibung aus <trainer>/verstehen/lernweg.js · checks: { [lektionId]: Fragen }
// inhalt: { [lektionId]: { Erklaerung, Ausprobieren } } · typen: eigene Eingabe-Typen für den Check

import { useEffect, useMemo } from 'preact/hooks';
import { baueLernweg } from './lernweg.js';
import { useFortschritt } from './fortschritt.js';
import { LernwegKontext } from './bausteine.jsx';
import { Lernweg } from './Lernweg.jsx';
import { Lektion } from './Lektion.jsx';

export function Verstehen({ raum, lernweg, checks, inhalt, typen, lektionId, onLektion }) {
  const kurs = useMemo(() => baueLernweg(lernweg, raum), [lernweg, raum]);
  const fortschritt = useFortschritt(kurs);
  const l = lektionId ? kurs.lektion(lektionId) : null;
  useEffect(() => window.scrollTo({ top: 0 }), [l?.id]);
  return (
    <LernwegKontext.Provider value={{ raum }}>
      {l ? (
        <Lektion key={l.id} kurs={kurs} lektion={l} checks={checks[l.id] ?? []} inhalt={inhalt[l.id] ?? {}} typen={typen} fortschritt={fortschritt} onLektion={onLektion} />
      ) : (
        <Lernweg kurs={kurs} fortschritt={fortschritt} onLektion={onLektion} />
      )}
    </LernwegKontext.Provider>
  );
}
