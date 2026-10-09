// Raum „Verstehen“: ohne ?lektion= der Lernweg, sonst die gewählte Lektion.

import { useEffect } from 'preact/hooks';
import { lektion } from './lernweg.js';
import { useFortschritt } from './fortschritt.js';
import { Lernweg } from './Lernweg.jsx';
import { Lektion } from './Lektion.jsx';

export function Verstehen({ lektionId, onLektion }) {
  const fortschritt = useFortschritt();
  const l = lektionId ? lektion(lektionId) : null;
  useEffect(() => window.scrollTo({ top: 0 }), [l?.id]);
  if (!l) return <Lernweg fortschritt={fortschritt} onLektion={onLektion} />;
  return <Lektion key={l.id} lektion={l} fortschritt={fortschritt} onLektion={onLektion} />;
}
