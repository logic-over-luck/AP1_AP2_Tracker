// Verweise zwischen Trainern ('trainer:ziel', Lektionsfeld grundlagen und Baustein <Grundlage>): Ziel ist eine Lektion
// eines Lernwegs (Subnetz) oder ein Thema des Zahlen-Trainers. Rein: nur Beschreibungen, keine Inhalte.

import { baueLernweg, leseVerweis } from './lernweg.js';
import { LERNWEG as SUBNETZ } from '../subnetz/verstehen/lernweg.js';
import { VERWEISE as ZAHLEN } from '../zahlen/themen.js';

export const LERNWEGE = { subnetz: SUBNETZ };
export const THEMEN = { zahlen: ZAHLEN };

const cache = new Map();

export function kursVon(trainer, raum) {
  if (!LERNWEGE[trainer]) return null;
  const schluessel = `${trainer}|${raum}`;
  if (!cache.has(schluessel)) cache.set(schluessel, baueLernweg(LERNWEGE[trainer], raum));
  return cache.get(schluessel);
}

// Ziel eines Verweises im Lernraum: { trainer, begriff, params } und dazu lektion + schluessel (Lernweg)
// oder thema (Zahlen-Trainer); null, wenn es das Ziel nicht gibt.
export function zielVon(verweis, raum) {
  const { trainer, lektion } = leseVerweis(verweis);
  const kurs = kursVon(trainer, raum);
  const l = kurs?.lektion(lektion);
  if (l) return { trainer, begriff: l.begriff, lektion: l.id, schluessel: kurs.schluessel, params: { modus: 'verstehen', lektion: l.id } };
  const t = THEMEN[trainer]?.[lektion];
  if (t) return { trainer, begriff: t.begriff, thema: t.thema, params: { modus: t.thema } };
  return null;
}
