// Aufgaben „Übertragungsdauer“: Dauer, Dauer in Minuten und Sekunden, nötige Rate, übertragene Menge.
// Datenmenge mit Binärpräfix (Byte), Übertragungsrate mit Dezimalpräfix (bit/s).

import { z, runde, hoch, BIN_EINHEITEN } from '../rechnen.js';

export const ARTEN = [
  { id: 'dauer', name: 'Dauer in Sekunden' },
  { id: 'minuten', name: 'Minuten und Sekunden' },
  { id: 'rate', name: 'Nötige Rate' },
  { id: 'menge', name: 'Übertragene Menge' },
];

const mit2 = (wert) => z(runde(wert, 2), 2);
const EINHEITEN = 'Datenmenge in Byte mit Binärpräfix, Rate in Bit je Sekunde mit Dezimalpräfix – beides erst in Bit bzw. bit/s bringen.';

export function erzeuge(r, art) {
  if (art === 'menge') return menge(r);
  const stufe = r.wahl([2, 3, 3]);
  const wert = stufe === 2 ? r.wahl([300, 500, 700, 800]) : r.wahl([1, 2, 4, 5, 8, 10, 25]);
  const einheit = BIN_EINHEITEN[stufe];
  const bit = wert * 1024 ** stufe * 8;
  const bitZeile = `Datenmenge in Bit: ${z(wert)} ${einheit} = ${z(wert)} · 1.024${hoch(stufe)} · 8 = ${z(bit)} Bit`;
  if (art === 'rate') {
    const dauer = r.wahl([30, 60, 90, 120, 300, 600]);
    const mbit = bit / dauer / 1e6;
    return {
      text: `**${z(wert)} ${einheit}** sollen in **${dauer} Sekunden** übertragen werden. Welche Übertragungsrate in **Mbit/s** ist dafür mindestens nötig? Runde auf zwei Nachkommastellen.`,
      felder: [{ id: 'x', label: 'Übertragungsrate', erwartet: mbit, stellen: 2, einheit: 'Mbit/s' }],
      loesung: [bitZeile, `Rate = Datenmenge ÷ Dauer = ${z(bit)} ÷ ${dauer} = ${z(bit / dauer)} bit/s`, `In Mbit/s (÷ 1.000.000): **${mit2(mbit)} Mbit/s**`],
    };
  }
  const rate = r.wahl([16, 50, 100, 250, 500, 1000]);
  const bps = rate * 1e6;
  const sek = bit / bps;
  if (art === 'minuten') {
    const ganz = Math.round(sek);
    return {
      text: `Wie lange dauert die Übertragung von **${z(wert)} ${einheit}** über eine Leitung mit **${z(rate)} Mbit/s**? Gib das Ergebnis in **Minuten und Sekunden** an (Sekunden ganzzahlig gerundet).`,
      felder: [
        { id: 'min', label: 'Minuten', erwartet: Math.floor(ganz / 60), einheit: 'min' },
        { id: 'sek', label: 'Sekunden', erwartet: ganz % 60, einheit: 's' },
      ],
      loesung: [EINHEITEN, bitZeile, `Rate in bit/s: ${z(rate)} · 1.000.000 = ${z(bps)} bit/s`, `Dauer = ${z(bit)} ÷ ${z(bps)} = ${mit2(sek)} s ≈ ${ganz} s`, `${ganz} s = ${ganz} ÷ 60 = ${Math.floor(ganz / 60)} Rest ${ganz % 60} → **${Math.floor(ganz / 60)} min ${ganz % 60} s**`],
    };
  }
  return {
    text: `Wie viele **Sekunden** dauert die Übertragung von **${z(wert)} ${einheit}** bei **${z(rate)} Mbit/s**? Runde auf zwei Nachkommastellen.`,
    felder: [{ id: 'x', label: 'Dauer', erwartet: sek, stellen: 2, einheit: 's' }],
    loesung: [EINHEITEN, bitZeile, `Rate in bit/s: ${z(rate)} Mbit/s = ${z(bps)} bit/s`, `Dauer = ${z(bit)} ÷ ${z(bps)} = **${mit2(sek)} s**`],
  };
}

function menge(r) {
  const rate = r.wahl([16, 50, 100, 250, 1000]);
  const dauer = r.wahl([10, 30, 60, 120, 300]);
  const bit = rate * 1e6 * dauer;
  const mib = bit / 8 / 1024 ** 2;
  return {
    text: `Eine Leitung mit **${z(rate)} Mbit/s** ist **${dauer} Sekunden** lang voll ausgelastet. Wie viele **MiB** wurden übertragen? Runde auf zwei Nachkommastellen.`,
    felder: [{ id: 'x', label: 'Datenmenge', erwartet: mib, stellen: 2, einheit: 'MiB' }],
    loesung: [`Datenmenge = Rate · Dauer = ${z(rate * 1e6)} bit/s · ${dauer} s = ${z(bit)} Bit`, `÷ 8 = ${z(bit / 8)} Byte`, `÷ 1.024² = **${mit2(mib)} MiB**`],
  };
}
