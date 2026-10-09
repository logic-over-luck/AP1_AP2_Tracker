// Alle Lernwege nach Trainer – für Verweise zwischen Trainern (Lektionsfeld grundlagen, Baustein <Grundlage>).
// Rein: nur die Lernweg-Beschreibungen, keine Inhalte.

import { baueLernweg } from './lernweg.js';
import { LERNWEG as SUBNETZ } from '../subnetz/verstehen/lernweg.js';

export const LERNWEGE = { subnetz: SUBNETZ };

const cache = new Map();

export function kursVon(trainer, raum) {
  if (!LERNWEGE[trainer]) return null;
  const schluessel = `${trainer}|${raum}`;
  if (!cache.has(schluessel)) cache.set(schluessel, baueLernweg(LERNWEGE[trainer], raum));
  return cache.get(schluessel);
}
