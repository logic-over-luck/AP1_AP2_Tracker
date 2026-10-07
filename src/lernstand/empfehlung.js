// „Heute im Fokus": eine nachvollziehbare Regel statt Zufall.
//
// 1. Fällige Wiederholungen – am längsten überfällig zuerst.
// 2. Angefangene Blöcke – die weiter fortgeschrittenen zuerst, damit etwas fertig wird.
// 3. Offene Blöcke – höchste Priorität zuerst, dann nach Prüfungsgewicht, dann Reihenfolge.
// 4. Alles abgehakt – fällige Lernkarten.
// Jede Empfehlung trägt einen Grund, der in der Oberfläche steht.

import { blockZustand, kartenZustand } from './ableiten.js';
import { PRIO_RANG, PRIO_NAME } from '../daten/index.js';
import { relativ, tageZwischen, tagPlus } from './zeit.js';
import { KARTE_SICHER_AB } from './regeln.js';

export function heuteImFokus(stand, index, raumId) {
  const raum = index.raeume.get(raumId);
  const liste = raum.bloeckeListe.map((b) => ({ block: b, z: blockZustand(stand, b) }));

  const faellig = liste.filter((x) => x.z.faellig).sort((a, b) => b.z.tageUeberfaellig - a.z.tageUeberfaellig || PRIO_RANG[b.block.prio] - PRIO_RANG[a.block.prio]);
  const angefangen = liste
    .filter((x) => x.z.angefangen)
    .sort((a, b) => b.z.anteil - a.z.anteil || PRIO_RANG[b.block.prio] - PRIO_RANG[a.block.prio] || b.block.gewicht - a.block.gewicht);
  const offen = liste
    .filter((x) => x.z.erledigt === 0)
    .sort((a, b) => PRIO_RANG[b.block.prio] - PRIO_RANG[a.block.prio] || b.block.gewicht - a.block.gewicht);

  const vorschlaege = [];
  for (const x of faellig) {
    const wann = relativ(x.z.naechste.faellig, stand.heute);
    vorschlaege.push({
      art: 'wiederholung',
      block: x.block,
      zustand: x.z,
      etikett: `Wiederholung ${x.z.naechste.phase} von 3`,
      grund: wann === 'heute' ? `Die ${x.z.naechste.phase}. Wiederholung ist heute fällig.` : `Die ${x.z.naechste.phase}. Wiederholung ist ${wann} fällig.`,
    });
  }
  for (const x of angefangen) {
    vorschlaege.push({
      art: 'weiter',
      block: x.block,
      zustand: x.z,
      etikett: 'Weitermachen',
      grund: `${x.z.erledigt} von ${x.z.gesamt} Stichpunkten sind schon erledigt – mach den Block fertig.`,
    });
  }
  for (const x of offen) {
    vorschlaege.push({
      art: 'neu',
      block: x.block,
      zustand: x.z,
      etikett: 'Neues Thema',
      grund:
        x.block.prio === 'hoch'
          ? 'Hohe Priorität: Dieses Thema kommt in Prüfungen nach aktuellem Katalog vor.'
          : x.block.prio === 'mittel'
            ? 'Mittlere Priorität und noch nicht begonnen.'
            : 'Noch nicht begonnen – als Nächstes in deinem Lernplan.',
    });
  }
  const karten = kartenZustand(stand, index.kartenJeRaum.get(raumId) ?? []);
  return {
    haupt: vorschlaege[0] ?? null,
    weitere: vorschlaege.slice(1, 4),
    anzahlFaellig: faellig.length,
    karten,
    allesErledigt: liste.every((x) => x.z.fertig),
  };
}

// Stärken und Schwächen je Block aus Lernkarten und Trainer-Aufgaben.
export function staerkenUndSchwaechen(stand, index, raumId) {
  const raum = index.raeume.get(raumId);
  const werte = [];
  for (const block of raum.bloeckeListe) {
    let gut = 0;
    let schwach = 0;
    let beantwortet = 0;
    for (const id of index.kartenJeBlock.get(block.id) ?? []) {
      const k = stand.karten.get(id);
      if (!k) continue;
      beantwortet++;
      if (k.note === 0) schwach += 2;
      else if (k.note === 1) schwach += 1;
      if (k.stufe >= KARTE_SICHER_AB) gut++;
    }
    let aufgabenN = 0;
    let aufgabenOk = 0;
    for (const id of block.sp) {
      const a = stand.aufgaben.get(id);
      if (!a) continue;
      aufgabenN += a.n;
      aufgabenOk += a.ok;
    }
    const aufgabenFehler = aufgabenN - aufgabenOk;
    const z = blockZustand(stand, block);
    werte.push({
      block,
      schwach: schwach + Math.min(aufgabenFehler, 6),
      gut: gut + (z.gefestigt ? 3 : z.phasen.filter(Boolean).length) + (aufgabenN >= 3 && aufgabenOk / aufgabenN >= 0.8 ? 2 : 0),
      beantwortet,
      fertig: z.fertig,
    });
  }
  const schwaechen = werte.filter((w) => w.schwach > 0).sort((a, b) => b.schwach - a.schwach).slice(0, 3);
  const schwachIds = new Set(schwaechen.map((w) => w.block.id));
  const staerken = werte
    .filter((w) => w.gut >= 3 && !schwachIds.has(w.block.id))
    .sort((a, b) => b.gut - a.gut)
    .slice(0, 3);
  return { staerken, schwaechen };
}

// Tempo bis zur Prüfung: wie viele Stichpunkte je Woche nötig sind.
export function tempo(stand, index, raumId) {
  const raum = index.raeume.get(raumId);
  const termin = stand.termine[raumId] ?? null;
  const offen = raum.bloeckeListe.reduce((n, b) => n + b.sp.filter((id) => !stand.spErledigt.has(id)).length, 0);
  const wocheStart = tagPlus(stand.heute, -6);
  let dieseWoche = 0;
  for (const [id, t] of stand.spErledigt) {
    if (index.raumVon(id) !== raumId) continue;
    const tag = new Date(t);
    const key = `${tag.getFullYear()}-${String(tag.getMonth() + 1).padStart(2, '0')}-${String(tag.getDate()).padStart(2, '0')}`;
    if (key >= wocheStart) dieseWoche++;
  }
  if (!termin) return { termin: null, offen, dieseWoche };
  const tage = tageZwischen(stand.heute, termin);
  const wochen = Math.max(tage / 7, 1 / 7);
  return { termin, tage, offen, dieseWoche, jeWoche: tage > 0 ? Math.ceil(offen / wochen) : offen };
}

export { PRIO_NAME };
