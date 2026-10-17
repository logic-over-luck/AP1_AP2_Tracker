// Aufgaben „Zahlensysteme“: Umrechnen zwischen dezimal, binär, hexadezimal und oktal, Zweierpotenzen.

import { z, hoch, gruppiert, divisionsweg, stellenwertweg, nibbles } from '../rechnen.js';

export const ARTEN = [
  { id: 'd2b', name: 'Dezimal → Binär' },
  { id: 'b2d', name: 'Binär → Dezimal' },
  { id: 'd2h', name: 'Dezimal → Hex' },
  { id: 'h2d', name: 'Hex → Dezimal' },
  { id: 'b2h', name: 'Binär → Hex' },
  { id: 'h2b', name: 'Hex → Binär' },
  { id: 'oktal', name: 'Oktal' },
  { id: 'potenz', name: 'Zweierpotenzen' },
];

const HEX_HINWEIS = 'Ziffern über 9 sind Buchstaben: A = 10, B = 11, C = 12, D = 13, E = 14, F = 15.';

export function erzeuge(r, art) {
  if (art === 'potenz') return zweierpotenz(r);
  if (art === 'oktal') return oktal(r);
  // Binäraufgaben bleiben in einem Byte, Hex-Aufgaben gehen bis drei Ziffern
  const n = art.includes('h') ? (r.ja(0.6) ? r.ganz(16, 255) : r.ganz(256, 4095)) : r.ganz(5, 255);
  const bin = n.toString(2);
  const hex = n.toString(16).toUpperCase();
  switch (art) {
    case 'd2b':
      return {
        text: `Rechne die Dezimalzahl **${n}** ins Binärsystem um.`,
        felder: [{ id: 'x', label: 'Binär', typ: 'basis', basis: 2, erwartet: n, platzhalter: 'z. B. 1010 0110' }],
        loesung: [...divisionsweg(n, 2), `Reste von unten nach oben gelesen: **${gruppiert(bin)}**`, `Probe über die Stellenwerte: ${stellenwertweg(bin, 2)} = ${n}`],
      };
    case 'b2d':
      return {
        text: `Rechne die Binärzahl **${gruppiert(bin)}** ins Dezimalsystem um.`,
        felder: [{ id: 'x', label: 'Dezimal', erwartet: n }],
        loesung: ['Stellenwerte von rechts: 1, 2, 4, 8, 16, 32, 64, 128.', `Die Stellenwerte unter den Einsen addieren: ${stellenwertweg(bin, 2)}`, `= **${n}**`],
      };
    case 'd2h':
      return {
        text: `Rechne die Dezimalzahl **${z(n)}** ins Hexadezimalsystem um.`,
        felder: [{ id: 'x', label: 'Hexadezimal', typ: 'basis', basis: 16, erwartet: n, platzhalter: 'z. B. 3F' }],
        loesung: [...divisionsweg(n, 16), `Reste von unten nach oben gelesen: **${hex}**`, HEX_HINWEIS],
      };
    case 'h2d':
      return {
        text: `Rechne die Hexadezimalzahl **${hex}** ins Dezimalsystem um.`,
        felder: [{ id: 'x', label: 'Dezimal', erwartet: n }],
        loesung: ['Stellenwerte von rechts: 1, 16, 256, 4.096.', `${stellenwertweg(hex, 16)} (${HEX_HINWEIS})`, `= **${z(n)}**`],
      };
    case 'b2h':
      return {
        text: `Rechne die Binärzahl **${gruppiert(bin)}** ins Hexadezimalsystem um.`,
        felder: [{ id: 'x', label: 'Hexadezimal', typ: 'basis', basis: 16, erwartet: n, platzhalter: 'z. B. 3F' }],
        loesung: ['Von rechts in Vierergruppen teilen – jede Gruppe ist genau eine Hex-Ziffer.', nibbles(bin), `Ergebnis: **${hex}**`],
      };
    default:
      return {
        text: `Rechne die Hexadezimalzahl **${hex}** ins Binärsystem um.`,
        felder: [{ id: 'x', label: 'Binär', typ: 'basis', basis: 2, erwartet: n, platzhalter: 'z. B. 1010 0110' }],
        loesung: [
          'Jede Hex-Ziffer wird zu genau vier Bit.',
          [...hex].map((c) => `${c} = ${parseInt(c, 16).toString(2).padStart(4, '0')}`).join(' · '),
          `Ergebnis: **${gruppiert(bin)}**`,
        ],
      };
  }
}

function oktal(r) {
  const n = r.ganz(8, 511);
  const okt = n.toString(8);
  if (r.ja()) {
    return {
      text: `Rechne die Dezimalzahl **${n}** ins Oktalsystem (Basis 8) um.`,
      felder: [{ id: 'x', label: 'Oktal', typ: 'basis', basis: 8, erwartet: n, platzhalter: 'z. B. 310' }],
      loesung: [...divisionsweg(n, 8), `Reste von unten nach oben gelesen: **${okt}**`, 'Oktal gibt es nur die Ziffern 0 bis 7 – jede Ziffer entspricht drei Bit.'],
    };
  }
  return {
    text: `Rechne die Oktalzahl **${okt}** (Basis 8) ins Dezimalsystem um.`,
    felder: [{ id: 'x', label: 'Dezimal', erwartet: n }],
    loesung: ['Stellenwerte von rechts: 1, 8, 64, 512.', `${stellenwertweg(okt, 8)} = **${n}**`],
  };
}

function zweierpotenz(r) {
  const n = r.wahl([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16]);
  const frage = r.wahl(['werte', 'potenz', 'groesste']);
  const werte = 2 ** n;
  const merke = n === 8 ? 'Mit 8 Bit (1 Byte) gibt es 256 Werte: 0 bis 255.' : n === 10 ? '2¹⁰ = 1.024 – daher kommt das „Kibi“ in KiB.' : null;
  if (frage === 'werte') {
    return {
      text: `Wie viele verschiedene Werte lassen sich mit **${n} Bit** darstellen?`,
      felder: [{ id: 'x', label: 'Anzahl Werte', erwartet: werte }],
      loesung: ['Jedes Bit hat zwei Zustände, jedes weitere Bit verdoppelt die Möglichkeiten.', `2${hoch(n)} = **${z(werte)}**`, merke].filter(Boolean),
    };
  }
  if (frage === 'groesste') {
    return {
      text: `Welche ist die größte Zahl, die sich mit **${n} Bit** (ohne Vorzeichen) darstellen lässt?`,
      felder: [{ id: 'x', label: 'Größte Zahl', erwartet: werte - 1 }],
      loesung: [`${n} Bit ergeben 2${hoch(n)} = ${z(werte)} Werte.`, `Die Zählung beginnt bei 0, die größte Zahl ist also ${z(werte)} − 1 = **${z(werte - 1)}**.`, merke].filter(Boolean),
    };
  }
  return {
    text: `Berechne **2${hoch(n)}**.`,
    felder: [{ id: 'x', label: `2${hoch(n)}`, erwartet: werte }],
    loesung: [`2${hoch(n)} heißt: die 2 ${n}-mal mit sich selbst multiplizieren.`, `Zweierpotenzen auswendig: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1.024 …`, `2${hoch(n)} = **${z(werte)}**`, merke].filter(Boolean),
  };
}
