// Inhalt der App: Struktur der Lernräume, Stichpunkte, Lernkarten, Glossar.
// Kommt beim Bauen aus der Inhaltsdatei und den eigenen Inhalten (siehe tools/daten.mjs).

import daten from 'virtual:daten';
import { baueIndex } from './index.js';

export const inhalt = baueIndex(daten);
