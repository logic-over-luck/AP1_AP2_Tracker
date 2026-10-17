// Stand je Thema aus dem Lernstand: die Aufgaben-Ereignisse des Zahlen-Trainers (e: 'aufgabe', tr: 'zahlen', m: Thema).
// Rein, getestet in tests/zahlen.test.mjs. Ein Thema gilt als „sicher“, wenn von den letzten Aufgaben
// mindestens SICHER.mindestens beantwortet und davon SICHER.anteil richtig sind.

export const FENSTER = 10;
export const SICHER = { mindestens: 5, anteil: 0.8 };

// Aufgaben aus dem früheren Zahlen-Trainer zählen für das heutige Thema weiter
const FRUEHERE_IDS = { datenmenge: 'speicher', energie: 'strom' };

// ereignisse → Map themaId → { n, ok, letzte: [true/false …], zuletztOk, sicher }
export function themenStand(ereignisse) {
  const stand = new Map();
  for (const ev of ereignisse) {
    if (ev.e !== 'aufgabe' || ev.tr !== 'zahlen' || !ev.m) continue;
    const id = FRUEHERE_IDS[ev.m] ?? ev.m;
    const s = stand.get(id) ?? { n: 0, ok: 0, letzte: [] };
    s.n += 1;
    if (ev.ok) s.ok += 1;
    s.letzte.push(!!ev.ok);
    if (s.letzte.length > FENSTER) s.letzte.shift();
    stand.set(id, s);
  }
  for (const s of stand.values()) {
    s.zuletztOk = s.letzte.filter(Boolean).length;
    s.sicher = s.letzte.length >= SICHER.mindestens && s.zuletztOk / s.letzte.length >= SICHER.anteil;
  }
  return stand;
}
