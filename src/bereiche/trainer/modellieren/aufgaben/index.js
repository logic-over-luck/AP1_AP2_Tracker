// Aufgaben des Trainers „Modellieren", je Modus eine Datei. Format: siehe ../README.md

import anwendungsfall from './anwendungsfall.js';
import klasse from './klasse.js';
import aktivitaet from './aktivitaet.js';
import sequenz from './sequenz.js';
import zustand from './zustand.js';
import er from './er.js';
import relational from './relational.js';
import normalisierung from './normalisierung.js';
import prozess from './prozess.js';
import masken from './masken.js';
import dokumente from './dokumente.js';

const MODULE = { anwendungsfall, klasse, aktivitaet, sequenz, zustand, er, relational, normalisierung, prozess, masken, dokumente };

export const AUFGABEN = Object.fromEntries(Object.entries(MODULE).map(([k, m]) => [k, m.aufgaben ?? []]));
export const NOTATION = Object.fromEntries(Object.entries(MODULE).map(([k, m]) => [k, m.notation ?? null]));
export const SPICKZETTEL = Object.fromEntries(Object.entries(MODULE).map(([k, m]) => [k, m.spickzettel ?? null]));
