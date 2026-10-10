// Lernweg eines Trainers: Themen-Blöcke und Lektionen in fester Reihenfolge, dazu die Abfragen, die Ansicht
// und Tests brauchen. Rein und ohne Browser-Abhängigkeit.
//
// Ein Lernweg wird beschrieben durch { trainer, schluessel, bloecke, lektionen }:
//   trainer: ID aus verzeichnis.js · schluessel: Name der Ansichts-Einstellung für den Fortschritt
//   bloecke: [{ id, titel, text }]
//   lektionen: [{ id, block, begriff, leitfrage, braucht, grundlagen?, raeume?, kompetenzen, definition,
//                merksatz?, fehler?, uebung? }]
//     braucht: frühere Lektionen desselben Lernwegs, deren Begriffe hier benutzt werden (nur rückwärts)
//     grundlagen: Lektionen anderer Trainer als 'trainer:lektion' (z. B. 'zahlen:binaer') – Verweis, keine Pflicht
//     raeume: nur in diesen Lernräumen (z. B. ['AP2']); ohne Angabe überall

export function baueLernweg({ trainer, schluessel, bloecke, lektionen }, raum = null) {
  const LEKTIONEN = lektionen.filter((l) => !raum || !l.raeume || l.raeume.includes(raum)).map((l, i) => ({ ...l, nr: i + 1 }));
  const BLOECKE = bloecke.filter((b) => LEKTIONEN.some((l) => l.block === b.id));
  const nachId = new Map(LEKTIONEN.map((l) => [l.id, l]));
  const lektion = (id) => nachId.get(id) ?? null;
  // Erste noch nicht verstandene Lektion in der festen Reihenfolge (null, wenn alle verstanden sind)
  const naechsteLektion = (verstanden) => LEKTIONEN.find((l) => !verstanden.has(l.id)) ?? null;
  return {
    trainer,
    schluessel,
    raum,
    BLOECKE,
    LEKTIONEN,
    lektion,
    lektionenIn: (blockId) => LEKTIONEN.filter((l) => l.block === blockId),
    blockVon: (id) => BLOECKE.find((b) => b.id === lektion(id)?.block) ?? null,
    naechsteLektion,
    // 'verstanden' | 'naechste' | 'offen'
    status: (id, verstanden) => (verstanden.has(id) ? 'verstanden' : naechsteLektion(verstanden)?.id === id ? 'naechste' : 'offen'),
    // Lektionen, auf die eine Lektion aufbaut und die noch nicht verstanden sind
    luecken: (id, verstanden) => (lektion(id)?.braucht ?? []).filter((b) => !verstanden.has(b)).map(lektion),
  };
}

// 'zahlen:binaer' → { trainer: 'zahlen', lektion: 'binaer' }
export function leseVerweis(text) {
  const [trainer, lektion] = text.split(':');
  return { trainer, lektion };
}
