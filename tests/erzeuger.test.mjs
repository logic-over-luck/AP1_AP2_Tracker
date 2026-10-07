// Alle Aufgabenerzeuger: viele Startwerte, jede Musterlösung muss vom eigenen Prüfer als richtig
// erkannt werden – in mehreren Schreibweisen. Dazu inhaltliche Stichproben.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { zufall } from '../src/bereiche/trainer/rahmen/zufall.js';
import { pruefeFeld, runde, zahlText } from '../src/bereiche/trainer/rahmen/pruefen.js';
import { sollText } from './hilfen/soll.mjs';
import * as zahlen from '../src/bereiche/trainer/zahlen/aufgaben.js';

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

test('Zahlen & IT-Rechnen: alle Erzeuger', () => {
  for (const [name, f] of Object.entries(zahlen.ERZEUGER)) {
    pruefeErzeuger(name, f, 'AP1');
    pruefeErzeuger(name, f, 'AP2');
  }
});

test('Zahlen: Stichproben gegen Hand-Rechnung', () => {
  // 1.000 GB → 931,32 GiB (Beispiel aus dem Rahmen)
  assert.equal(runde((1000 * 1000 ** 3) / 1024 ** 3, 2), 931.32);
  // chmod 754
  assert.equal(zahlen.symbolisch('754'), 'rwxr-xr--');
  assert.equal(zahlen.symbolisch('640'), 'rw-r-----');
  // Zahlensysteme: Aufgabentext und Antwort passen zusammen
  for (let s = 1; s < 300; s++) {
    const a = zahlen.zahlensysteme(zufall(s));
    const m = a.text.match(/Dezimalzahl \*\*(\d+)\*\*/);
    if (m) assert.equal(a.felder[0].erwartet, Number(m[1]));
    const h = a.text.match(/Hexadezimalzahl \*\*([0-9A-F]+)\*\*/);
    if (h) assert.equal(a.felder[0].erwartet, parseInt(h[1], 16));
    const b = a.text.match(/Binärzahl \*\*([01 ]+)\*\*/);
    if (b) assert.equal(a.felder[0].erwartet, parseInt(b[1].replace(/ /g, ''), 2));
  }
  // Parität: Anzahl Einsen mit Paritätsbit hat die richtige Gerade/Ungerade
  for (let s = 1; s < 300; s++) {
    const a = zahlen.paritaet(zufall(s));
    if (a.titel !== 'Paritätsbit bilden') continue;
    const daten = a.text.match(/\*\*([01]{7})\*\*/)[1];
    const gerade = a.text.includes('**gerader');
    const einsen = [...daten].filter((c) => c === '1').length + Number(a.felder[0].erwartet);
    assert.equal(einsen % 2, gerade ? 0 : 1);
  }
});
