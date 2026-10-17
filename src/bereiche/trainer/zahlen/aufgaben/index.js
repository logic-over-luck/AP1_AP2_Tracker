// Aufgaben des Zahlen-Trainers: je Thema ein Modul mit ARTEN (wählbare Aufgabenarten) und erzeuge(rng, art).
// Rein: rng → Aufgabe. Getestet in tests/zahlen.test.mjs.
//
// Aufgabe: { thema, art, sp, text, tabelle?, felder: [{ id, label, typ?, erwartet, stellen?, einheit?, … }], loesung: [Text …] }
// Die Felder prüft der gemeinsame Prüfer der Rechentrainer (rahmen/pruefen.js, pruefeFeld).

import * as zahlensysteme from './zahlensysteme.js';
import * as praefixe from './praefixe.js';
import * as speicher from './speicher.js';
import * as uebertragung from './uebertragung.js';
import * as strom from './strom.js';
import * as rechte from './rechte.js';
import * as paritaet from './paritaet.js';

const MODULE = { zahlensysteme, praefixe, speicher, uebertragung, strom, rechte, paritaet };

// Aufgabenarten je Thema: [{ id, name }]
export const ARTEN = Object.fromEntries(Object.entries(MODULE).map(([id, m]) => [id, m.ARTEN]));

export const artName = (thema, art) => ARTEN[thema]?.find((a) => a.id === art)?.name ?? '';

// Eine Aufgabe aus dem Thema ziehen. arten: gewählte Aufgabenarten (leer = alle); sp: Stichpunkt, dem sie zählt.
export function erzeugeAufgabe(thema, rng, { sp, arten = [] } = {}) {
  const modul = MODULE[thema];
  if (!modul) throw new Error(`Unbekanntes Thema: ${thema}`);
  const gewaehlt = modul.ARTEN.filter((a) => arten.includes(a.id));
  const art = rng.wahl(gewaehlt.length ? gewaehlt : modul.ARTEN).id;
  return { thema, art, sp, ...modul.erzeuge(rng, art) };
}

// Reihenfolge einer gemischten Runde: alle Themen gemischt, dann weiter auffüllen, bis die Länge erreicht ist.
// themen: [{ id, sp }] → [{ thema, sp }]
export function baueRunde(themen, laenge, rng) {
  const folge = [];
  while (folge.length < laenge) folge.push(...rng.mische(themen));
  return folge.slice(0, laenge).map((t) => ({ thema: t.id, sp: t.sp }));
}
