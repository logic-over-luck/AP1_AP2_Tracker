// Antworten im Check prüfen. Rein, getestet in tests/lernweg.test.mjs.
//
// Frage:
//   { frage, optionen: [...], richtig, tipp, erklaerung }                    – Auswahl
//   { frage, eingabe: <Typ>, loesung, auch?: [...], platzhalter?, tipp, erklaerung }  – Eingabe
// Eingebaute Typen: 'zahl' (ganze Zahl), 'dezimal' (Komma oder Punkt, toleranz?), 'text', 'binaer', 'hex'.
// Ein Trainer kann eigene Typen mitgeben: { name: { pruefe(s, frage) → { ok, grund? }, platzhalter?, zahlartig? } }

// Ganze Zahl, Tausenderpunkte und Leerzeichen erlaubt („1.024“, „1 024“)
export function leseGanzzahl(text) {
  const s = String(text ?? '').replace(/[\s.]/g, '');
  return /^-?\d+$/.test(s) ? Number(s) : null;
}

// Dezimalzahl mit Komma oder Punkt („2,5“, „2.5“); Tausenderpunkte nur, wenn zusätzlich ein Komma folgt („1.024,5“)
export function leseDezimal(text) {
  let s = String(text ?? '').replace(/\s/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(s) ? Number(s) : null;
}

// Binärzahl („1010 0110“, „0b1010“) → Wert oder null
export function leseBinaer(text) {
  const s = String(text ?? '')
    .replace(/\s/g, '')
    .replace(/^0b/i, '');
  return /^[01]+$/.test(s) ? parseInt(s, 2) : null;
}

// Hexadezimalzahl („3F“, „0x3f“, „3f h“) → Wert oder null
export function leseHex(text) {
  const s = String(text ?? '')
    .replace(/\s/g, '')
    .replace(/^0x/i, '')
    .replace(/h$/i, '');
  return /^[0-9a-f]+$/i.test(s) ? parseInt(s, 16) : null;
}

const norm = (x) => String(x).replace(/\s+/g, '').toLowerCase();

export const TYPEN = {
  zahl: {
    zahlartig: true,
    platzhalter: 'Zahl',
    pruefe: (s, f) => {
      const z = leseGanzzahl(s);
      return z === null ? { ok: false, grund: 'Bitte eine ganze Zahl eingeben.' } : { ok: z === Number(f.loesung) };
    },
  },
  dezimal: {
    zahlartig: true,
    platzhalter: 'Zahl, z. B. 2,5',
    pruefe: (s, f) => {
      const z = leseDezimal(s);
      if (z === null) return { ok: false, grund: 'Bitte eine Zahl eingeben (Komma erlaubt).' };
      return { ok: Math.abs(z - Number(f.loesung)) <= (f.toleranz ?? 1e-9) };
    },
  },
  text: {
    pruefe: (s, f) => ({ ok: [f.loesung, ...(f.auch ?? [])].some((l) => norm(l) === norm(s)) }),
  },
  binaer: {
    platzhalter: 'z. B. 1010 0110',
    pruefe: (s, f) => {
      const z = leseBinaer(s);
      return z === null ? { ok: false, grund: 'Eine Binärzahl besteht nur aus 0 und 1.' } : { ok: z === leseBinaer(f.loesung) };
    },
  },
  hex: {
    platzhalter: 'z. B. 3F',
    pruefe: (s, f) => {
      const z = leseHex(s);
      return z === null ? { ok: false, grund: 'Hexadezimal sind nur die Ziffern 0–9 und A–F erlaubt.' } : { ok: z === leseHex(f.loesung) };
    },
  },
};

export function pruefeAntwort(frage, eingabe, typen = TYPEN) {
  const s = String(eingabe ?? '').trim();
  if (!s) return { ok: false, leer: true };
  if (frage.optionen) return { ok: s === frage.richtig };
  const typ = typen[frage.eingabe] ?? TYPEN[frage.eingabe];
  return typ ? typ.pruefe(s, frage) : { ok: false };
}
