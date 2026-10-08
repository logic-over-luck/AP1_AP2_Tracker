// Probeprüfungen zusammenstellen und bewerten. Rein, ohne Browser-Abhängigkeit (Tests laden das mit Node).
//
// Der Vorrat besteht aus Prüfungssätzen: eine Firma mit Ausgangssituation und ihren Aufgaben (AP1, PB1, PB2)
// bzw. Fragen (WiSo). Eine feste Probeprüfung ist genau ein Satz. „Gemischt“ zieht Aufgaben aus verschiedenen
// Sätzen, gewichtet nach der Wichtigkeit ihrer Stichpunkte (wie im Lernplan) und nach dem Bauplan des Teils
// (z. B. PB2: immer eine Algorithmus- und eine SQL-Aufgabe). Jede gezogene Aufgabe bringt die Situation
// ihres Satzes mit.

import { zufall } from '../trainer/rahmen/zufall.js';
import { pruefeZahl } from '../trainer/rahmen/pruefen.js';

// Aufbau der Prüfungsteile nach den ausgewerteten Prüfungen (Bauplan)
export const TEILE = {
  AP1: { id: 'AP1', raum: 'AP1', name: 'AP1 · Einrichten eines IT-gestützten Arbeitsplatzes', kurz: 'AP1', dauer: 90, aufgaben: 4 },
  PB1: { id: 'PB1', raum: 'AP2', name: 'AP2 · Planen eines Softwareproduktes', kurz: 'Planen', dauer: 90, aufgaben: 4, pflicht: [['modell']] },
  PB2: {
    id: 'PB2',
    raum: 'AP2',
    name: 'AP2 · Entwicklung und Umsetzung von Algorithmen',
    kurz: 'Algorithmen',
    dauer: 90,
    aufgaben: 4,
    pflicht: [['algorithmus'], ['sql']],
  },
  WISO: { id: 'WISO', raum: 'WISO', name: 'Wirtschafts- und Sozialkunde', kurz: 'WiSo', dauer: 60, fragen: 30 },
};

export const TEILE_IN_RAUM = { AP1: ['AP1'], AP2: ['PB1', 'PB2'], WISO: ['WISO'] };

// IHK-Notenschlüssel (Prozent der erreichbaren Punkte)
const NOTEN = [
  [92, 1, 'sehr gut'],
  [81, 2, 'gut'],
  [67, 3, 'befriedigend'],
  [50, 4, 'ausreichend'],
  [30, 5, 'mangelhaft'],
  [0, 6, 'ungenügend'],
];

export function note(prozent) {
  const [, n, name] = NOTEN.find(([ab]) => prozent >= ab - 1e-9) ?? NOTEN[NOTEN.length - 1];
  return { note: n, name, bestanden: prozent >= 50 - 1e-9 };
}

export const runde1 = (x) => Math.round(x * 10) / 10;

// Wichtigkeit einer Aufgabe oder Frage: wichtigster Stichpunkt, dazu ein Sockel, damit auch selten
// geprüfte Themen ab und zu drankommen.
export function gewichtVon(spIds, index) {
  const w = Math.max(0, ...(spIds ?? []).map((id) => index?.sp?.get(id)?.gewicht ?? 0));
  return 1 + w;
}

const spVonAufgabe = (a) => [...new Set(a.teile.flatMap((t) => t.sp ?? a.sp ?? []))];

// Zieht ohne Zurücklegen, Wahrscheinlichkeit proportional zum Gewicht
function ziehe(r, liste, gewicht) {
  const summe = liste.reduce((s, x) => s + gewicht(x), 0);
  let z = r.zahl() * summe;
  for (const x of liste) {
    z -= gewicht(x);
    if (z <= 0) return x;
  }
  return liste[liste.length - 1];
}

// Eine Prüfung zusammenstellen. satzId: feste Probeprüfung; sonst gemischt.
// Ergebnis: { teil, titel, satzId?, startwert, aufgaben: [{ satz, aufgabe }] } bzw. für WiSo { fragen: [{ satz, frage }] }
export function stelleZusammen(teilId, saetze, { satzId = null, startwert, index } = {}) {
  const teil = TEILE[teilId];
  const r = zufall(startwert);
  const eigene = saetze.filter((s) => s.teil === teilId);
  if (satzId) {
    const satz = eigene.find((s) => s.id === satzId);
    if (!satz) return null;
    if (teil.fragen) return { teil: teilId, titel: satz.titel, satzId, startwert: r.startwert, fragen: satz.fragen.map((frage) => ({ satz, frage })) };
    return { teil: teilId, titel: satz.titel, satzId, startwert: r.startwert, aufgaben: satz.aufgaben.map((aufgabe) => ({ satz, aufgabe })) };
  }
  if (teil.fragen) return { teil: teilId, titel: 'Gemischte Probeprüfung', startwert: r.startwert, fragen: mischeFragen(r, eigene, teil.fragen, index) };

  const pool = eigene.flatMap((satz) => satz.aufgaben.map((aufgabe) => ({ satz, aufgabe, w: gewichtVon(spVonAufgabe(aufgabe), index) })));
  const gewaehlt = [];
  // jede Aufgabe aus einem anderen Satz – solange der Vorrat genug Sätze hat
  const genugSaetze = eigene.length >= teil.aufgaben;
  const frei = (x) => !gewaehlt.some((g) => g.aufgabe.id === x.aufgabe.id || (genugSaetze && g.satz.id === x.satz.id));
  // erst die Pflicht-Bausteine des Bauplans, dann gewichtet auffüllen
  for (const arten of teil.pflicht ?? []) {
    const kandidaten = pool.filter((x) => frei(x) && arten.includes(x.aufgabe.art));
    if (kandidaten.length) gewaehlt.push(ziehe(r, kandidaten, (x) => x.w));
  }
  while (gewaehlt.length < teil.aufgaben) {
    // nicht zweimal dieselbe Art, solange es Alternativen gibt (so wird die Prüfung breit wie das Original)
    let kandidaten = pool.filter((x) => frei(x) && !gewaehlt.some((g) => g.aufgabe.art === x.aufgabe.art));
    if (!kandidaten.length) kandidaten = pool.filter(frei);
    if (!kandidaten.length) break;
    gewaehlt.push(ziehe(r, kandidaten, (x) => x.w));
  }
  // Reihenfolge wie im Original: Planung/Wissen vorn, Algorithmus und SQL eher hinten
  const ordnung = ['projekt', 'wirtschaft', 'hardware', 'netzwerk', 'sicherheit', 'schnittstelle', 'qualitaet', 'programmieren', 'modell', 'algorithmus', 'test', 'sql'];
  const platz = (x) => {
    const i = ordnung.indexOf(x.aufgabe.art);
    return i < 0 ? ordnung.length : i;
  };
  const aufgaben = r
    .mische(gewaehlt)
    .sort((a, b) => platz(a) - platz(b))
    .map(({ satz, aufgabe }) => ({ satz, aufgabe }));
  return { teil: teilId, titel: 'Gemischte Probeprüfung', startwert: r.startwert, aufgaben };
}

// WiSo: Fragen gewichtet ziehen; je Ordner (Themenbereich) höchstens 45 %, 2–4 Rechenaufgaben
function mischeFragen(r, saetze, anzahl, index) {
  const pool = saetze.flatMap((satz) => satz.fragen.map((frage) => ({ satz, frage, w: gewichtVon(frage.sp, index) })));
  const bereich = (x) => (x.frage.sp?.[0] ?? '').split('-').slice(0, 2).join('-');
  const gewaehlt = [];
  const frei = (x) => !gewaehlt.includes(x);
  const rechnen = pool.filter((x) => x.frage.art === 'zahl');
  const zielRechnen = Math.min(rechnen.length, 2 + Math.floor(r.zahl() * 3));
  for (let i = 0; i < zielRechnen; i++) gewaehlt.push(ziehe(r, rechnen.filter(frei), (x) => x.w));
  const grenze = Math.ceil(anzahl * 0.45);
  while (gewaehlt.length < Math.min(anzahl, pool.length)) {
    const zaehle = (b) => gewaehlt.filter((g) => bereich(g) === b).length;
    let kandidaten = pool.filter((x) => frei(x) && x.frage.art !== 'zahl' && zaehle(bereich(x)) < grenze);
    if (!kandidaten.length) kandidaten = pool.filter(frei);
    gewaehlt.push(ziehe(r, kandidaten, (x) => x.w));
  }
  // Fragen eines Betriebs stehen beieinander (seine Situation steht einmal davor), innerhalb gemischt;
  // Fragen mit gemeinsamem Situationsblock bleiben direkt hintereinander
  const reihe = r.mische([...new Set(gewaehlt.map((x) => x.satz.id))]);
  const block = (x) => x.frage.situation ?? x.frage.id;
  return reihe.flatMap((id) => {
    const eigene = r.mische(gewaehlt.filter((x) => x.satz.id === id));
    const bloecke = [...new Set(eigene.map(block))];
    return bloecke.flatMap((b) => eigene.filter((x) => block(x) === b)).map(({ satz, frage }) => ({ satz, frage }));
  });
}

// ---------- Bewerten ----------

// WiSo: Anteil 0…1. Einfachauswahl, Reihenfolge und Zahl ganz oder gar nicht; Mehrfachauswahl und
// Zuordnung mit Teilpunkten (wie im Lösungsschlüssel).
export function bewerteFrage(frage, antwort) {
  if (antwort === undefined || antwort === null || antwort === '') return 0;
  switch (frage.art) {
    case 'einfach':
      return antwort === frage.richtig[0] ? 1 : 0;
    case 'mehrfach': {
      const gewaehlt = new Set(antwort);
      const richtig = new Set(frage.richtig);
      // zu viele Kreuze machen die Aufgabe falsch, sonst je richtigem Kreuz der Anteil
      if (gewaehlt.size > richtig.size) return 0;
      return [...gewaehlt].filter((x) => richtig.has(x)).length / richtig.size;
    }
    case 'zuordnung':
      return frage.richtig.filter((z, i) => antwort[i] === z).length / frage.richtig.length;
    case 'reihenfolge':
      return frage.richtig.every((z, i) => antwort[i] === z) ? 1 : 0;
    case 'zahl':
      return pruefeZahl(antwort, { erwartet: frage.richtig, stellen: frage.stellen ?? 2, toleranz: frage.toleranz }).ok ? 1 : 0;
    default:
      return 0;
  }
}

// Vorschlag für die Punkte einer Teilaufgabe, die die App selbst prüfen kann (Zahlenfelder, Auswahl).
// null: muss selbst bewertet werden.
export function automatischePunkte(teil, antwort) {
  const a = teil.antwort ?? {};
  if (a.art === 'zahlen') {
    const felder = a.felder ?? [];
    if (!felder.length) return null;
    const richtig = felder.filter((f) => pruefeZahl(antwort?.[f.id], f).ok).length;
    return Math.round((teil.punkte * richtig * 2) / felder.length) / 2;
  }
  if (a.art === 'auswahl') {
    const anteil = bewerteFrage({ art: a.mehrfach ? 'mehrfach' : 'einfach', richtig: a.richtig }, antwort);
    return Math.round(teil.punkte * anteil * 2) / 2;
  }
  return null;
}

// Zeichenaufgaben (auf Papier) bewertet niemand automatisch – sie zählen nicht mit und werden als
// „nicht ermittelt“ ausgewiesen.
export const istZeichnung = (t) => t.antwort?.art === 'papier';

// Ergebnis einer Prüfung. punkte: Map/Objekt teilKey → Punkte (bei AP1/PB1/PB2), antworten bei WiSo.
// Liefert erreicht, max (ohne Zeichnungen), offen (Punkte der Zeichnungen), prozent und Note bezogen auf die
// ermittelten Punkte und die Punkte je Stichpunkt (für Lernstand und „Daran hängst du“).
export function auswerten(pruefung, { punkte = {}, antworten = {} } = {}) {
  const jeSp = {};
  const buche = (sps, erreicht, max) => {
    for (const id of sps ?? []) {
      const e = (jeSp[id] ??= [0, 0]);
      e[0] += erreicht / sps.length;
      e[1] += max / sps.length;
    }
  };
  let erreicht = 0;
  let max = 0;
  let offen = 0;
  if (pruefung.fragen) {
    const je = 100 / pruefung.fragen.length;
    for (const { frage } of pruefung.fragen) {
      const p = bewerteFrage(frage, antworten[frage.id]) * je;
      erreicht += p;
      max += je;
      buche(frage.sp, p, je);
    }
  } else {
    for (const { aufgabe } of pruefung.aufgaben) {
      for (const t of aufgabe.teile) {
        if (istZeichnung(t)) {
          offen += t.punkte;
          continue;
        }
        const k = teilSchluessel(aufgabe, t);
        const p = Math.max(0, Math.min(t.punkte, Number(punkte[k]) || 0));
        erreicht += p;
        max += t.punkte;
        buche(t.sp ?? aufgabe.sp, p, t.punkte);
      }
    }
  }
  const prozent = max ? (erreicht / max) * 100 : 0;
  for (const id in jeSp) jeSp[id] = jeSp[id].map(runde1);
  return { erreicht: runde1(erreicht), max: runde1(max), offen: runde1(offen), prozent: runde1(prozent), ...note(prozent), jeSp };
}

export const teilSchluessel = (aufgabe, t) => `${aufgabe.id}:${t.nr}`;

// Prüft einen Satz auf Vollständigkeit (für Tests): Punkte, IDs, Antworttypen, Lösungen.
export function pruefeSatz(satz, spBekannt = () => true) {
  const fehler = [];
  const f = (text) => fehler.push(`${satz.id}: ${text}`);
  if (!TEILE[satz.teil]) f(`unbekannter Teil ${satz.teil}`);
  if (!satz.titel || !satz.situation) f('Titel oder Situation fehlt');
  if (satz.teil === 'WISO') {
    const ids = new Set();
    for (const q of satz.fragen ?? []) {
      if (ids.has(q.id)) f(`Frage ${q.id} doppelt`);
      ids.add(q.id);
      if (!q.text) f(`${q.id}: Text fehlt`);
      if (!q.sp?.length || !q.sp.every(spBekannt)) f(`${q.id}: Stichpunkte fehlen/unbekannt`);
      if (!['einfach', 'mehrfach', 'zuordnung', 'reihenfolge', 'zahl'].includes(q.art)) f(`${q.id}: Art ${q.art}`);
      if (q.art === 'einfach' && !(q.optionen?.length >= 4 && q.richtig?.length === 1 && q.richtig[0] < q.optionen.length)) f(`${q.id}: Einfachauswahl unvollständig`);
      if (q.art === 'mehrfach' && !(q.optionen?.length >= 5 && q.richtig?.length >= 2 && q.richtig.every((i) => i < q.optionen.length))) f(`${q.id}: Mehrfachauswahl unvollständig`);
      if (q.art === 'zuordnung' && !(q.links?.length && q.optionen?.length && q.richtig?.length === q.links.length && q.richtig.every((i) => i < q.optionen.length))) f(`${q.id}: Zuordnung unvollständig`);
      if (q.art === 'reihenfolge' && !(q.optionen?.length >= 3 && q.richtig?.length === q.optionen.length)) f(`${q.id}: Reihenfolge unvollständig`);
      if (q.art === 'zahl' && typeof q.richtig !== 'number') f(`${q.id}: Zahl fehlt`);
      if (!q.erklaerung) f(`${q.id}: Erklärung fehlt`);
      if (q.situation && !satz.bloecke?.some((b) => b.id === q.situation)) f(`${q.id}: Situationsblock ${q.situation} fehlt`);
    }
    if ((satz.fragen ?? []).length !== 30) f(`${(satz.fragen ?? []).length} statt 30 Fragen`);
    return fehler;
  }
  let summe = 0;
  for (const a of satz.aufgaben ?? []) {
    if (!a.id || !a.art || !a.titel) f(`Aufgabe ohne id/art/titel`);
    const teilSumme = a.teile.reduce((s, t) => s + t.punkte, 0);
    if (a.punkte !== teilSumme) f(`${a.id}: Punkte ${a.punkte} ≠ Summe der Teile ${teilSumme}`);
    summe += teilSumme;
    for (const t of a.teile) {
      const sps = t.sp ?? a.sp;
      if (!sps?.length || !sps.every(spBekannt)) f(`${a.id} ${t.nr}: Stichpunkte fehlen/unbekannt`);
      if (!t.text) f(`${a.id} ${t.nr}: Text fehlt`);
      if (!t.loesung) f(`${a.id} ${t.nr}: Lösung fehlt`);
      if (!(t.punkte > 0)) f(`${a.id} ${t.nr}: Punkte fehlen`);
      const art = t.antwort?.art ?? 'text';
      if (!['text', 'code', 'tabelle', 'zahlen', 'auswahl', 'papier'].includes(art)) f(`${a.id} ${t.nr}: Antwortart ${art}`);
      if (art === 'zahlen' && !t.antwort.felder?.every((x) => x.id && typeof x.erwartet === 'number')) f(`${a.id} ${t.nr}: Zahlenfelder unvollständig`);
      if (art === 'tabelle' && !(t.antwort.kopf?.length && t.antwort.zeilen?.length)) f(`${a.id} ${t.nr}: Tabelle unvollständig`);
      if (art === 'auswahl' && !(t.antwort.optionen?.length && t.antwort.richtig?.length)) f(`${a.id} ${t.nr}: Auswahl unvollständig`);
    }
  }
  if ((satz.aufgaben ?? []).length !== 4) f(`${(satz.aufgaben ?? []).length} statt 4 Aufgaben`);
  if (summe !== 100) f(`Summe ${summe} statt 100 Punkte`);
  return fehler;
}
