// Gemeinsame Raum-Logik der Umbau-Prüfskripte: welche Bausteine wohnen in einem Raum (E2, W2, P3),
// welche darf er aus früheren Räumen importieren (E3), welche sind dort abdeckungspflichtig (T1).
//
//   AP1  Bausteine AP1.*, Zusatzbausteine mit raum AP1
//   PB1  AP2-Bausteine mit Wohnort PB1 (umbau/regeln/raeume-ap2.json), Zusatzbausteine mit raum PB1;
//        importieren darf PB1 aus AP1
//   PB2  AP2-Bausteine mit Wohnort PB2, Zusatzbausteine mit raum PB2; importieren darf PB2 aus AP1 und PB1
// Anhänge (ANH.*) sind in jedem Raum erlaubt (Notationen, SQL-Auszug); sie sind nicht abdeckungspflichtig.

import { readFileSync } from 'node:fs';
import { raumVon } from './raeume-ap2.mjs';

export const RAEUME = ['AP1', 'PB1', 'PB2'];
const FRUEHER = { AP1: [], PB1: ['AP1'], PB2: ['AP1', 'PB1'] };

/** Wohnort-Raum eines Bausteins (oder null) */
export function wohnort(id, zusatz) {
  if (id.startsWith('ZB.')) return zusatz[id]?.raum ?? 'AP1';
  if (id.startsWith('AP1.')) return 'AP1';
  if (/^AP2[ab]\./.test(id)) return raumVon(id)?.raum ?? null;
  return null;
}

export function raum(name, b = JSON.parse(readFileSync('umbau/fundament/katalog-bausteine.json', 'utf8')),
  zusatz = JSON.parse(readFileSync('umbau/regeln/zusatzbausteine.json', 'utf8')).bausteine) {
  const TEIL = name.toUpperCase();
  if (!RAEUME.includes(TEIL)) throw new Error(`Unbekannter Raum: ${name}`);
  const katalog = [...b.punkte.map((p) => p.id), ...b.spiegelstriche.map((s) => s.id)];
  const anhang = b.anhang.map((a) => a.id);
  const hier = (id) => wohnort(id, zusatz) === TEIL;
  const importierbar = (id) => FRUEHER[TEIL].includes(wohnort(id, zusatz));
  return {
    TEIL,
    raum: TEIL.toLowerCase(),
    frueher: FRUEHER[TEIL],
    /** Baustein wohnt in diesem Raum */
    hier,
    /** Baustein wohnt in einem früheren Raum und darf importiert werden (E2, E3) */
    importierbar,
    /** gültig in Zuordnung und Lernplan dieses Raums: eigene, importierte, Anhänge */
    gueltig: new Set([...katalog, ...Object.keys(zusatz)].filter((id) => hier(id) || importierbar(id)).concat(anhang)),
    /** abdeckungspflichtig in diesem Raum (T1) */
    pflicht: [...b.abdeckungspflichtig.filter(hier), ...Object.keys(zusatz).filter(hier)],
    zusatzHier: Object.keys(zusatz).filter(hier),
    gebiete: new Set(b.pruefungsbereiche.find((p) => p.id === TEIL).gebiete.map((g) => g.id)),
    anhang: new Set(anhang),
  };
}
