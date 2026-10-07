// Gemeinsame Prüfung für Aufgabenerzeuger
import assert from 'node:assert/strict';
import { zufall } from '../../src/bereiche/trainer/rahmen/zufall.js';
import { pruefeFeld, runde, zahlText } from '../../src/bereiche/trainer/rahmen/pruefen.js';
import { sollText } from './soll.mjs';

const DURCHLAEUFE = 400;

// Schreibweisen, in denen ein Mensch die richtige Antwort eingeben könnte
export function schreibweisen(f) {
  if (f.typ === 'auswahl') return [f.erwartet];
  if (f.typ === 'basis') return [f.erwartet.toString(f.basis), f.erwartet.toString(f.basis).toUpperCase()];
  if (f.typ === 'ipv4' || f.typ === 'text') return [f.erwartet];
  if (f.typ === 'eigen') return [f.soll];
  const st = f.stellen ?? 0;
  const g = runde(f.erwartet, st);
  return [zahlText(g, st), zahlText(g, st, { tausender: false }), String(g), `${zahlText(g, st)} ${f.einheit ?? ''}`.trim()];
}

export function pruefeErzeuger(name, erzeuge, ...args) {
  for (let s = 1; s <= DURCHLAEUFE; s++) {
    const a = erzeuge(zufall(s), ...args);
    assert.ok(a.text && a.felder?.length && a.loesung?.length, `${name} #${s}: unvollständig`);
    assert.ok(a.sp, `${name} #${s}: ohne Stichpunkt`);
    for (const f of a.felder) {
      if (!f.typ || f.typ === 'zahl') assert.ok(Number.isFinite(f.erwartet), `${name} #${s} ${f.id}: erwartet ${f.erwartet}`);
      for (const w of schreibweisen(f)) assert.ok(pruefeFeld(w, f).ok, `${name} #${s} Feld ${f.id}: „${w}" wird abgelehnt (${a.text})`);
      assert.ok(pruefeFeld(sollText(f), f).ok || f.typ === 'basis', `${name} #${s}: Anzeige der Lösung „${sollText(f)}" wird abgelehnt`);
    }
    for (const t of [a.text, ...a.loesung]) assert.ok(!/NaN|undefined|Infinity/.test(t), `${name} #${s}: ${t}`);
  }
}

