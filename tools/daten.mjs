// Liest die Inhaltsdatei und die eigenen Inhalte und baut daraus das Datenpaket der App.
// Nur, was die App anzeigt oder für die Logik braucht, kommt hinein. Belege, Katalogstellen
// und Vermerke bleiben draußen; aus den Belegen wird hier nur die Priorität berechnet.

import fs from 'node:fs';
import path from 'node:path';

const RAUM_NAMEN = { AP1: 'AP1', AP2: 'AP2', WISO: 'WiSo' };

// Gewicht eines Belegs für die Feinsortierung innerhalb einer Prioritätsstufe.
function belegGewicht(b) {
  const aktuell = b.katalog === 'aktuell';
  if (b.quelle === 'original') return aktuell ? 3 : 2;
  return aktuell ? 1 : 0.5;
}

// Prioritätsstufe aus der Belegstärke. Ohne Beleg heißt „normal wichtig", nicht unwichtig.
export function prioritaetAusBelegstaerke(staerke) {
  switch (staerke) {
    case 'original_aktuell':
      return 'hoch';
    case 'original_alt':
    case 'stichwort_aktuell':
      return 'mittel';
    default:
      return 'normal';
  }
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
  const inhalt = JSON.parse(fs.readFileSync(path.join(wurzel, 'Inhaltsdatei_AP1_AP2_tracker.json'), 'utf8'));
  const pakete = liesJsonOrdner(path.join(wurzel, 'inhalte', 'lernen'));

  const kurz = {};
  const satz = {};
  const karten = [];
  for (const { daten } of pakete) {
    Object.assign(kurz, daten.stichpunkte ?? {});
    for (const [id, b] of Object.entries(daten.bloecke ?? {})) satz[id] = b.satz;
    for (const k of daten.karten ?? []) karten.push({ id: k.id, sp: k.sp, k: k.k ?? null, v: k.vorne, h: k.hinten });
  }

  const sp = {};
  for (const s of inhalt.stichpunkte) {
    const gewicht = new Map();
    for (const b of s.belege ?? []) {
      const g = belegGewicht(b);
      gewicht.set(b.pruefung_id, Math.max(gewicht.get(b.pruefung_id) ?? 0, g));
    }
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
      prio: prioritaetAusBelegstaerke(s.belegstaerke),
      gewicht: [...gewicht.values()].reduce((a, b) => a + b, 0),
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
