// Liest die Inhaltsdatei und die eigenen Inhalte und baut daraus das Datenpaket der App.
// Nur, was die App anzeigt oder für die Logik braucht, kommt hinein. Belege, Katalogstellen
// und Vermerke bleiben draußen; aus den Belegen wird hier nur die Wichtigkeit berechnet.

import fs from 'node:fs';
import path from 'node:path';
import { ladeInhalt } from './korrekturen.mjs';

const RAUM_NAMEN = { AP1: 'AP1', AP2: 'AP2', WISO: 'WiSo' };

// ---------- Wichtigkeit ----------
// Wie wichtig ein Stichpunkt für die Prüfung ist, ergibt sich aus den ausgewerteten Prüfungen:
// – Häufigkeit: in wie vielen Prüfungen kam er vor (jede Prüfung zählt nur einmal)
// – Aktualität und Sicherheit: Originalprüfung nach aktuellem Katalog zählt voll, ältere Kataloge
//   und bloße Themen-Stichworte (Podcast-Themenliste, Gedächtnisprotokolle) zählen weniger
// – Punkte: Aufgaben mit vielen Punkten heben den Stichpunkt an (aus dem Rahmen und inhalte/gewichtung.json;
//   in inhalte/korrekturen.json gesetzte Punkte gelten statt dieser beiden)
// Als falsch markierte Belege (inhalte/korrekturen.json) zählen nicht.
// Gezeigt wird nur das Ergebnis (Stufe, Anzahl Prüfungen), nie die Quellen selbst.

export const BELEG_GEWICHT = {
  original: { aktuell: 1, alt: 0.6 },
  podcast_stichwort: { aktuell: 0.5, alt: 0.3 },
  forum: { aktuell: 0.5, alt: 0.3 },
};

export function belegGewicht(b) {
  const g = BELEG_GEWICHT[b.quelle] ?? BELEG_GEWICHT.forum;
  return b.katalog === 'aktuell' ? g.aktuell : g.alt;
}

export function punkteBonus(punkte) {
  if (!punkte) return 0;
  return punkte >= 15 ? 1 : punkte >= 10 ? 0.5 : 0;
}

// Stufe aus dem Wert. Ohne Prüfungsbeleg heißt „selten geprüft" – das Thema steht trotzdem im Katalog.
export const STUFEN_SP = [
  ['top', 2.5],
  ['hoch', 1.5],
  ['mittel', 0.5],
  ['normal', -Infinity],
];
export const stufeFuer = (wert, grenzen = STUFEN_SP) => grenzen.find(([, g]) => wert >= g)[0];

export function wichtigkeit(s, punkteZusatz) {
  const jePruefung = new Map();
  for (const b of s.belege ?? []) if (!b.falsch) jePruefung.set(b.pruefung_id, Math.max(jePruefung.get(b.pruefung_id) ?? 0, belegGewicht(b)));
  const ausRahmen = [...String(s.rahmen ?? '').matchAll(/(\d+) Punkte/g)].map((m) => Number(m[1]));
  const punkte = s.punkte ?? Math.max(0, punkteZusatz ?? 0, ...ausRahmen);
  const wert = [...jePruefung.values()].reduce((a, b) => a + b, 0) + punkteBonus(punkte);
  return { wert: Math.round(wert * 100) / 100, pruefungen: [...jePruefung.entries()].sort(), punkte: punkte || null, stufe: stufeFuer(wert) };
}

function liesJsonOrdner(ordner) {
  if (!fs.existsSync(ordner)) return [];
  return fs
    .readdirSync(ordner)
    .filter((f) => f.endsWith('.json'))
    .sort()
    .map((f) => ({ datei: f, daten: JSON.parse(fs.readFileSync(path.join(ordner, f), 'utf8')) }));
}

export function ladeDaten(wurzel) {
  const inhalt = ladeInhalt(wurzel);
  const pakete = liesJsonOrdner(path.join(wurzel, 'inhalte', 'lernen'));

  const kurz = {};
  const satz = {};
  const karten = [];
  for (const { daten } of pakete) {
    Object.assign(kurz, daten.stichpunkte ?? {});
    for (const [id, b] of Object.entries(daten.bloecke ?? {})) satz[id] = b.satz;
    for (const k of daten.karten ?? []) karten.push({ id: k.id, sp: k.sp, k: k.k ?? null, v: k.vorne, h: k.hinten });
  }

  const gewichtung = fs.existsSync(path.join(wurzel, 'inhalte', 'gewichtung.json')) ? JSON.parse(fs.readFileSync(path.join(wurzel, 'inhalte', 'gewichtung.json'), 'utf8')) : {};
  const sp = {};
  for (const s of inhalt.stichpunkte) {
    const w = wichtigkeit(s, gewichtung.punkte?.[s.id]);
    sp[s.id] = {
      id: s.id,
      raum: s.teil,
      ordner: s.ordner_id,
      block: s.block_id,
      pos: s.position,
      titel: s.stichpunkt,
      art: s.art,
      rahmen: s.rahmen,
      unklar: s.rahmen_unklar ? s.rahmen_unklar_details : null,
      koennen: s.koennen.map((k) => [k.id, k.text]),
      prio: w.stufe,
      gewicht: w.wert,
      pruef: w.pruefungen,
      punkte: w.punkte,
      gegen: s.gegenstuecke ?? [],
      kurz: kurz[s.id] ?? null,
    };
  }

  const raeume = inhalt.struktur.map((t) => ({
    id: t.teil,
    name: RAUM_NAMEN[t.teil] ?? t.teil,
    titel: t.titel,
    ordner: t.ordner.map((o) => ({
      id: o.id,
      titel: o.titel,
      bloecke: o.bloecke.map((b) => ({ id: b.id, titel: b.titel, satz: satz[b.id] ?? null, sp: b.stichpunkte })),
    })),
  }));

  let glossar = [];
  const glossarDatei = path.join(wurzel, 'inhalte', 'glossar.json');
  if (fs.existsSync(glossarDatei)) {
    glossar = JSON.parse(fs.readFileSync(glossarDatei, 'utf8')).begriffe ?? [];
  } else {
    // Vorläufig: Vorschläge aus den Paketen, nach Begriff zusammengeführt.
    const map = new Map();
    for (const { daten } of pakete)
      for (const g of daten.glossar ?? []) {
        const key = g.begriff.toLowerCase();
        const vorhanden = map.get(key);
        if (vorhanden) vorhanden.sp = [...new Set([...vorhanden.sp, ...g.sp])];
        else map.set(key, { begriff: g.begriff, langform: g.langform ?? null, erklaerung: g.erklaerung, sp: [...g.sp] });
      }
    glossar = [...map.values()];
  }
  glossar = glossar
    .map((g) => ({ b: g.begriff, l: g.langform ?? null, e: g.erklaerung, sp: g.sp.filter((id) => sp[id]) }))
    .sort((a, b) => a.b.localeCompare(b.b, 'de'));

  const trainer = {};
  for (const { datei, daten } of liesJsonOrdner(path.join(wurzel, 'inhalte', 'trainer'))) trainer[datei.replace(/\.json$/, '')] = daten;

  return {
    stand: inhalt.meta?.schema_version ?? 1,
    raeume,
    sp,
    karten,
    glossar,
    trainer,
  };
}
