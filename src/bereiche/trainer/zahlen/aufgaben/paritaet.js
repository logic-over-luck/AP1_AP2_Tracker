// Aufgaben „Paritätsbit“: Paritätsbit bilden und beim Empfänger prüfen (kein, ein oder zwei gekippte Bits).

import { einsen, paritaetsbit } from '../rechnen.js';

export const ARTEN = [
  { id: 'bilden', name: 'Paritätsbit bilden' },
  { id: 'pruefen', name: 'Fehler erkennen' },
];

export function erzeuge(r, art) {
  const bits = Array.from({ length: 7 }, () => (r.ja() ? 1 : 0));
  const gerade = r.ja();
  const regel = gerade ? 'Gerade Parität: Die Gesamtzahl der Einsen (mit Paritätsbit) muss gerade sein.' : 'Ungerade Parität: Die Gesamtzahl der Einsen (mit Paritätsbit) muss ungerade sein.';
  const p = paritaetsbit(bits, gerade);
  const n = einsen(bits);
  if (art === 'bilden') {
    return {
      text: `Die Datenbits **${bits.join('')}** sollen mit **${gerade ? 'gerader' : 'ungerader'} Parität** übertragen werden. Welches Paritätsbit wird angehängt?`,
      felder: [{ id: 'x', label: 'Paritätsbit', typ: 'auswahl', erwartet: String(p), optionen: ['0', '1'] }],
      loesung: [`Einsen in den Daten: ${n} (${n % 2 === 0 ? 'gerade' : 'ungerade'})`, regel, `Paritätsbit: **${p}** → gesendet wird ${bits.join('')}${p}`],
    };
  }
  // Beim Empfänger: 0, 1 oder 2 Bits sind unterwegs gekippt
  const gekippt = r.wahl([0, 1, 1, 2]);
  const empfangen = [...bits, p];
  for (const stelle of r.mische([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, gekippt)) empfangen[stelle] ^= 1;
  const gesamt = einsen(empfangen);
  const erkannt = gerade ? gesamt % 2 === 1 : gesamt % 2 === 0;
  return {
    text: `Vereinbart ist **${gerade ? 'gerade' : 'ungerade'} Parität**. Empfangen wird **${empfangen.join('')}** (7 Datenbits, das Paritätsbit steht am Ende). Meldet die Prüfung beim Empfänger einen Fehler?`,
    felder: [{ id: 'x', label: 'Fehler erkannt?', typ: 'auswahl', erwartet: erkannt ? 'ja' : 'nein', optionen: ['ja', 'nein'] }],
    loesung: [
      `Einsen insgesamt: ${gesamt} (${gesamt % 2 === 0 ? 'gerade' : 'ungerade'})`,
      regel,
      erkannt ? 'Die Parität stimmt nicht → **Fehler erkannt**.' : 'Die Parität stimmt → **kein Fehler erkannt**.',
      gekippt === 2 ? 'Tatsächlich sind zwei Bits gekippt – das Paritätsbit bemerkt es nicht, weil die Anzahl der Einsen wieder passt.' : gekippt === 1 ? 'Ein Bit ist gekippt. Der Empfänger weiß nur, dass etwas nicht stimmt – nicht, welches Bit.' : 'Die Folge kam unverändert an.',
    ],
  };
}
