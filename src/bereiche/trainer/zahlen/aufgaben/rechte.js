// Aufgaben „Dateirechte (chmod)“: Oktalzahl ↔ rwx-Schreibweise, Rechte deuten, Rechte aus einer Beschreibung festlegen.

import { RWX, KLASSEN, symbolisch, rechteSumme } from '../rechnen.js';

export const ARTEN = [
  { id: 'zuSym', name: 'Oktal → rwx' },
  { id: 'zuOktal', name: 'rwx → Oktal' },
  { id: 'deuten', name: 'Rechte deuten' },
  { id: 'wunsch', name: 'Rechte festlegen' },
];

const GRUNDLAGE = ['r = 4 (lesen), w = 2 (schreiben), x = 1 (ausführen) – je Klasse addieren.', 'Reihenfolge der Ziffern: Besitzer, Gruppe, andere.'];
const RECHTE_NAMEN = ['lesen', 'schreiben', 'ausführen'];

export function erzeuge(r, art) {
  const ziffern = [r.wahl([7, 7, 6, 5]), r.wahl([7, 5, 5, 4, 6, 0]), r.wahl([5, 4, 4, 0, 1])];
  const oktal = ziffern.join('');
  const sym = symbolisch(oktal);
  const jeKlasse = KLASSEN.map((k, i) => `${k}: ${rechteSumme(ziffern[i])} → ${RWX[ziffern[i]]}`);
  switch (art) {
    case 'zuSym':
      return {
        text: `Welche Rechte setzt \`chmod ${oktal}\`? Schreibe sie in der Form \`rwxr-x---\` (neun Zeichen).`,
        felder: [{ id: 'x', label: 'Rechte', typ: 'text', erwartet: sym, erlaubt: [sym, `-${sym}`], platzhalter: 'rwxr-x---' }],
        loesung: [...GRUNDLAGE, ...jeKlasse, `Ergebnis: **${sym}**`],
      };
    case 'zuOktal':
      return {
        text: `\`ls -l\` zeigt für eine Datei die Rechte \`-${sym}\`. Welche Zahl gehört zu \`chmod\`?`,
        felder: [{ id: 'x', label: 'Oktalzahl', typ: 'text', erwartet: oktal, erlaubt: [oktal, `0${oktal}`, `chmod ${oktal}`], platzhalter: 'z. B. 640' }],
        loesung: [...GRUNDLAGE, ...KLASSEN.map((k, i) => `${k}: ${sym.slice(i * 3, i * 3 + 3)} → ${rechteSumme(ziffern[i])}`), `Ergebnis: **chmod ${oktal}**`],
      };
    case 'deuten': {
      const klasse = r.wahl([0, 1, 2]);
      const recht = RWX[ziffern[klasse]];
      const darf = (i) => (recht[i] !== '-' ? 'ja' : 'nein');
      return {
        text: `Nach \`chmod ${oktal} bericht.txt\`: Was darf **${['der Besitzer', 'die Gruppe', 'jeder andere'][klasse]}** mit der Datei tun?`,
        felder: RECHTE_NAMEN.map((name, i) => ({ id: name, label: name, typ: 'auswahl', erwartet: darf(i), optionen: ['ja', 'nein'] })),
        loesung: [...GRUNDLAGE, `${KLASSEN[klasse]}: ${rechteSumme(ziffern[klasse])} → ${recht}`, `Also: ${RECHTE_NAMEN.map((n, i) => `${n} ${darf(i)}`).join(', ')}.`],
      };
    }
    default:
      return {
        text: `Für eine Datei sollen diese Rechte gelten: ${beschreibung(ziffern)} Welche Zahl gibst du \`chmod\` mit?`,
        felder: [{ id: 'x', label: 'Oktalzahl', typ: 'text', erwartet: oktal, erlaubt: [oktal, `0${oktal}`, `chmod ${oktal}`], platzhalter: 'z. B. 640' }],
        loesung: [...GRUNDLAGE, ...jeKlasse, `Ergebnis: **chmod ${oktal}**`],
      };
  }
}

// „Der Besitzer darf lesen, schreiben und ausführen; die Gruppe darf lesen und ausführen; alle anderen dürfen nichts.“
function beschreibung(ziffern) {
  const wer = ['Der Besitzer darf', 'die Gruppe darf', 'alle anderen dürfen'];
  const teile = ziffern.map((d, i) => {
    const rechte = RECHTE_NAMEN.filter((_, j) => d & (4 >> j));
    const liste = rechte.length ? (rechte.length > 1 ? `${rechte.slice(0, -1).join(', ')} und ${rechte[rechte.length - 1]}` : rechte[0]) : 'nichts';
    return `${wer[i]} ${liste}`;
  });
  return `**${teile[0]}; ${teile[1]}; ${teile[2]}.**`;
}
