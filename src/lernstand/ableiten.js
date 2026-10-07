// Berechnet den gesamten Lernstand aus dem Ereignisprotokoll.
// Rein und ohne Browser-Abhängigkeit: gleiche Ereignisse + gleicher Inhalt + gleicher Tag
// ergeben immer denselben Stand. Unbekannte IDs (z. B. nach einem Inhalts-Update) werden
// übersprungen, ohne etwas zu beschädigen.

import { tagVon, tagPlus, tageZwischen } from './zeit.js';
import { PHASEN_ABSTAND, KARTEN_ABSTAND, KARTE_SICHER_AB, naechsteStufe, XP, rangFuer } from './regeln.js';

export function leererStand() {
  return {
    spErledigt: new Map(), // spId → Zeitpunkt
    spJeMalAbgehakt: new Set(),
    blockErledigtAm: new Map(), // blockId → Zeitpunkt des ersten Abschlusses
    phasen: new Map(), // blockId → [t1, t2, t3]
    karten: new Map(), // kartenId → { stufe, faellig, n, richtig, zuletzt, note }
    gemerkt: new Set(),
    termine: {},
    notizen: new Map(),
    aufgaben: new Map(), // spId → { n, ok, zuletzt }
    trainer: new Map(), // trainerId → { n, ok }
    geloest: new Set(), // „trainerId:aufgabenId" fester Aufgaben (SQL-Labor), die schon einmal gelöst wurden
    fokusMinuten: 0,
    tage: new Map(), // tag → { xp, n }
    xp: 0,
    xpVerlauf: [], // [zeitpunkt, xp gesamt] bei Rangwechseln
  };
}

function buche(stand, t, xp) {
  const tag = tagVon(t);
  let eintrag = stand.tage.get(tag);
  if (!eintrag) stand.tage.set(tag, (eintrag = { xp: 0, n: 0 }));
  eintrag.xp += xp;
  eintrag.n += 1;
  stand.xp += xp;
}

export function ableiten(ereignisse, index, heute = tagVon(Date.now())) {
  const stand = leererStand();
  const spJeBlockErledigt = new Map();

  for (const ev of ereignisse) {
    switch (ev.e) {
      case 'sp': {
        const sp = index.sp.get(ev.id);
        if (!sp) break;
        const war = stand.spErledigt.has(ev.id);
        if (ev.an && !war) {
          stand.spErledigt.set(ev.id, ev.t);
          spJeBlockErledigt.set(sp.block, (spJeBlockErledigt.get(sp.block) ?? 0) + 1);
          let xp = 0;
          if (!stand.spJeMalAbgehakt.has(ev.id)) {
            stand.spJeMalAbgehakt.add(ev.id);
            xp += XP.stichpunkt;
          }
          const block = index.bloecke.get(sp.block);
          if (block && spJeBlockErledigt.get(sp.block) === block.sp.length && !stand.blockErledigtAm.has(sp.block)) {
            stand.blockErledigtAm.set(sp.block, ev.t);
            xp += XP.blockGeschafft;
          }
          buche(stand, ev.t, xp);
        } else if (!ev.an && war) {
          stand.spErledigt.delete(ev.id);
          spJeBlockErledigt.set(sp.block, spJeBlockErledigt.get(sp.block) - 1);
        }
        break;
      }
      case 'wdh': {
        const block = index.bloecke.get(ev.id);
        if (!block || !stand.blockErledigtAm.has(ev.id)) break;
        const p = stand.phasen.get(ev.id) ?? [null, null, null];
        if (ev.p < 1 || ev.p > 3 || p[ev.p - 1] !== null) break;
        if (ev.p > 1 && p[ev.p - 2] === null) break;
        p[ev.p - 1] = ev.t;
        stand.phasen.set(ev.id, p);
        buche(stand, ev.t, XP.wiederholung);
        break;
      }
      case 'karte': {
        if (!index.karten.has(ev.id)) break;
        const k = stand.karten.get(ev.id) ?? { stufe: 0, faellig: null, n: 0, richtig: 0, zuletzt: null, note: null, verlauf: '' };
        k.stufe = naechsteStufe(k.stufe, ev.n);
        k.faellig = tagPlus(tagVon(ev.t), KARTEN_ABSTAND[k.stufe]);
        k.n += 1;
        if (ev.n === 2) k.richtig += 1;
        k.zuletzt = ev.t;
        k.note = ev.n;
        k.verlauf = (k.verlauf + ev.n).slice(-8);
        stand.karten.set(ev.id, k);
        buche(stand, ev.t, XP.karte[ev.n] ?? 1);
        break;
      }
      case 'merken':
        if (ev.an) stand.gemerkt.add(ev.id);
        else stand.gemerkt.delete(ev.id);
        break;
      case 'aufgabe': {
        if (ev.sp && index.sp.has(ev.sp)) {
          const a = stand.aufgaben.get(ev.sp) ?? { n: 0, ok: 0, zuletzt: null, fehlerZuletzt: null };
          a.n += 1;
          if (ev.ok) a.ok += 1;
          else a.fehlerZuletzt = ev.t;
          a.zuletzt = ev.t;
          stand.aufgaben.set(ev.sp, a);
        }
        const tr = stand.trainer.get(ev.tr) ?? { n: 0, ok: 0 };
        tr.n += 1;
        if (ev.ok) tr.ok += 1;
        stand.trainer.set(ev.tr, tr);
        if (ev.ok && ev.a) stand.geloest.add(`${ev.tr}:${ev.a}`);
        buche(stand, ev.t, ev.ok ? XP.aufgabeRichtig : XP.aufgabeVersucht);
        break;
      }
      case 'fokus': {
        const min = Math.max(0, Math.min(180, Math.round(ev.min ?? 0)));
        stand.fokusMinuten += min;
        buche(stand, ev.t, Math.floor(min / XP.fokusJeMinuten));
        break;
      }
      case 'termin':
        if (ev.r) stand.termine[ev.r] = ev.d ?? null;
        break;
      case 'notiz':
        if (ev.text) stand.notizen.set(ev.id, ev.text);
        else stand.notizen.delete(ev.id);
        break;
      default:
        break;
    }
  }

  stand.heute = heute;
  stand.rang = rangFuer(stand.xp);
  stand.serie = serieBerechnen(stand.tage, heute);
  return stand;
}

// Lernserie: aufeinanderfolgende Tage mit mindestens einer Lernhandlung.
// Ist heute noch nichts passiert, zählt die Serie bis gestern weiter.
export function serieBerechnen(tage, heute) {
  const aktiv = (tag) => (tage.get(tag)?.n ?? 0) > 0;
  const heuteAktiv = aktiv(heute);
  let aktuell = 0;
  let tag = heuteAktiv ? heute : tagPlus(heute, -1);
  while (aktiv(tag)) {
    aktuell++;
    tag = tagPlus(tag, -1);
  }
  const sortiert = [...tage.keys()].filter(aktiv).sort();
  let beste = 0;
  let lauf = 0;
  let vorher = null;
  for (const t of sortiert) {
    lauf = vorher && tageZwischen(vorher, t) === 1 ? lauf + 1 : 1;
    beste = Math.max(beste, lauf);
    vorher = t;
  }
  return { aktuell, beste, heuteAktiv };
}

// ---------- Abfragen auf dem Stand ----------

export function blockZustand(stand, block) {
  const erledigt = block.sp.filter((id) => stand.spErledigt.has(id)).length;
  const gesamt = block.sp.length;
  const fertig = erledigt === gesamt;
  const erledigtAm = stand.blockErledigtAm.get(block.id) ?? null;
  const phasen = stand.phasen.get(block.id) ?? [null, null, null];

  // Nächste Phase und ihr Fälligkeitstag
  let naechste = null;
  if (erledigtAm !== null) {
    const p = phasen.findIndex((x) => x === null);
    if (p !== -1) {
      const anker = p === 0 ? erledigtAm : phasen[p - 1];
      naechste = { phase: p + 1, faellig: tagPlus(tagVon(anker), PHASEN_ABSTAND[p]) };
    }
  }
  const faellig = fertig && naechste !== null && naechste.faellig <= stand.heute;
  return {
    erledigt,
    gesamt,
    fertig,
    angefangen: erledigt > 0 && !fertig,
    anteil: gesamt ? erledigt / gesamt : 0,
    erledigtAm,
    phasen,
    naechste,
    faellig,
    gefestigt: phasen.every((x) => x !== null),
    tageUeberfaellig: faellig ? tageZwischen(naechste.faellig, stand.heute) : 0,
  };
}

export function kartenZustand(stand, kartenIds) {
  let neu = 0;
  let lernen = 0;
  let sicher = 0;
  let faellig = 0;
  let richtig = 0;
  let antworten = 0;
  for (const id of kartenIds) {
    const k = stand.karten.get(id);
    if (!k) {
      neu++;
      continue;
    }
    antworten += k.n;
    richtig += k.richtig;
    if (k.stufe >= KARTE_SICHER_AB) sicher++;
    else lernen++;
    if (k.faellig <= stand.heute) faellig++;
  }
  return { gesamt: kartenIds.length, neu, lernen, sicher, faellig, richtig, antworten, quote: antworten ? richtig / antworten : null };
}

export function istKarteFaellig(stand, id) {
  const k = stand.karten.get(id);
  return !!k && k.faellig <= stand.heute;
}
