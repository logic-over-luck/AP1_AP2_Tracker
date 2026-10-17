// Inhalt der App: Struktur der Lernräume, Stichpunkte, Lernkarten, Glossar.
// Kommt beim Bauen aus der Inhaltsdatei und den eigenen Inhalten (siehe tools/daten.mjs).

import daten from 'virtual:daten';
import { baueIndex } from './index.js';
import { setzeAufloesung } from '../bereiche/trainer/verzeichnis.js';

export const inhalt = baueIndex(daten);
setzeAufloesung({ raum: (id) => inhalt.raumVon(id), sp: (id) => inhalt.umzug.sp(id) });
