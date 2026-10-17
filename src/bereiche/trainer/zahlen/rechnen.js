// Rechen- und Formathilfen des Zahlen-Trainers. Rein, ohne Browser-Abhängigkeit (Tests laden sie mit Node).
// Zahlen prüfen und formatieren übernimmt der gemeinsame Prüfer der Rechentrainer (rahmen/pruefen.js).

import { zahlText, runde, lesarten } from '../rahmen/pruefen.js';

export { zahlText as z, runde };
const z = zahlText;

// ---------- Einheiten ----------

export const BIN_EINHEITEN = ['Byte', 'KiB', 'MiB', 'GiB', 'TiB'];
export const DEZ_EINHEITEN = ['Byte', 'kB', 'MB', 'GB', 'TB'];

// Byte je Einheit – Datenmengen mit Binärpräfix (1.024), Herstellerangaben und Übertragungsraten dezimal (1.000)
export const BYTE_JE = {
  Bit: 1 / 8,
  Byte: 1,
  kB: 1e3,
  KiB: 1024,
  MB: 1e6,
  MiB: 1024 ** 2,
  GB: 1e9,
  GiB: 1024 ** 3,
  TB: 1e12,
  TiB: 1024 ** 4,
};

// Rechenweg-Text zum Faktor einer Einheit: „1.000³“, „1.024²“, „÷ 8“
export function faktorText(einheit) {
  if (einheit === 'Bit') return '÷ 8';
  if (einheit === 'Byte') return '1';
  const stufe = (einheit.endsWith('iB') ? BIN_EINHEITEN : DEZ_EINHEITEN).indexOf(einheit);
  const basis = einheit.endsWith('iB') ? '1.024' : '1.000';
  return stufe === 1 ? basis : `${basis}${hoch(stufe)}`;
}

// Passende Stufe für eine Bytezahl: die größte Einheit, in der der Wert mindestens 1 ist
export function passendeEinheit(byte, einheiten, basis) {
  let stufe = 0;
  while (stufe < einheiten.length - 1 && byte >= basis ** (stufe + 1)) stufe++;
  return { stufe, einheit: einheiten[stufe], wert: byte / basis ** stufe };
}

const HOCHZAHLEN = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
export const hoch = (n) =>
  String(n)
    .split('')
    .map((c) => HOCHZAHLEN[Number(c)])
    .join('');

// Sekunden als „2 min 10 s“ (Sekunden ganzzahlig gerundet)
export function minSek(sekunden) {
  const ganz = Math.round(sekunden);
  const min = Math.floor(ganz / 60);
  return min ? `${min} min ${ganz % 60} s` : `${ganz} s`;
}

// ---------- Eingaben lesen ----------

// Erste plausible Zahl einer Eingabe („1.024,5“, „2,5“, „3 400 000“) oder null
export function leseZahl(text) {
  const werte = lesarten(text);
  return werte.length ? werte[0] : null;
}

// Zahl in einem Stellenwertsystem lesen: Leerzeichen, 0x/0b/0o und ein h am Ende sind erlaubt
export function leseBasis(text, basis) {
  let s = String(text ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]/g, '');
  if (basis === 16) s = s.replace(/^0x/, '').replace(/h$/, '');
  if (basis === 2) s = s.replace(/^0b/, '');
  if (basis === 8) s = s.replace(/^0o/, '');
  const ziffern = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[0-9a-f]+$/ }[basis];
  return ziffern.test(s) ? parseInt(s, basis) : null;
}

// Bitfolge („0110 100“) als Array aus 0 und 1, sonst null
export function leseBits(text) {
  const s = String(text ?? '').replace(/\s/g, '');
  return /^[01]+$/.test(s) ? [...s].map(Number) : null;
}

// ---------- Zahlensysteme ----------

// Binärzahl in Vierergruppen: „1100 1000“
export function gruppiert(bin, breite = 4) {
  const s = bin.padStart(Math.ceil(bin.length / breite) * breite, '0');
  return s.match(new RegExp(`.{${breite}}`, 'g')).join(' ');
}

export const hexZiffer = (wert) => wert.toString(16).toUpperCase();

// Restwertverfahren: fortlaufend durch die Basis teilen, eine Zeile je Schritt
export function divisionsweg(n, basis) {
  if (n === 0) return [`0 ÷ ${basis} = 0 Rest 0`];
  const zeilen = [];
  for (let x = n; x > 0; x = Math.floor(x / basis)) {
    const rest = x % basis;
    const restText = basis === 16 && rest > 9 ? `${hexZiffer(rest)} (${rest})` : String(rest);
    zeilen.push(`${z(x)} ÷ ${basis} = ${z(Math.floor(x / basis))} Rest ${restText}`);
  }
  return zeilen;
}

// Stellenwerte einer Ziffernfolge: „1·128 + 1·64 + 1·8“ (Nullen weggelassen)
export function stellenwertweg(ziffern, basis) {
  const teile = [];
  [...ziffern].forEach((c, i) => {
    const wert = parseInt(c, basis);
    const stelle = ziffern.length - 1 - i;
    if (wert) teile.push(`${wert}·${z(basis ** stelle)}`);
  });
  return teile.join(' + ') || '0';
}

// Binärzahl in Nibbles mit Hex-Ziffer: „1100 = C · 1000 = 8“
export function nibbles(bin) {
  return gruppiert(bin)
    .split(' ')
    .map((g) => `${g} = ${hexZiffer(parseInt(g, 2))}`)
    .join(' · ');
}

// ---------- Dateirechte ----------

export const RWX = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];
export const KLASSEN = ['Besitzer', 'Gruppe', 'andere'];

// „754“ → „rwxr-xr--“
export function symbolisch(oktal) {
  return [...String(oktal)].map((d) => RWX[Number(d)]).join('');
}

// Rechte lesen – als Oktalzahl („754“, „0754“) oder symbolisch („rwxr-xr--“, „-rwxr-xr--“); null, wenn beides nicht passt
export function leseRechte(text) {
  const s = String(text ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s/g, '')
    .replace(/^chmod/, '');
  if (/^0?[0-7]{3}$/.test(s)) {
    const oktal = s.slice(-3);
    return { oktal, sym: symbolisch(oktal) };
  }
  const sym = s.replace(/^-(?=.{9}$)/, '');
  if (/^([-r][-w][-x]){3}$/.test(sym)) return { oktal: [0, 3, 6].map((i) => RWX.indexOf(sym.slice(i, i + 3))).join(''), sym };
  return null;
}

// Erklärung einer Oktalziffer: „7 = r + w + x = 4 + 2 + 1“
export function rechteSumme(ziffer) {
  const teile = [];
  if (ziffer & 4) teile.push(['r', 4]);
  if (ziffer & 2) teile.push(['w', 2]);
  if (ziffer & 1) teile.push(['x', 1]);
  if (!teile.length) return `${ziffer} = keine Rechte`;
  return `${ziffer} = ${teile.map(([b]) => b).join(' + ')} = ${teile.map(([, w]) => w).join(' + ')}`;
}

// ---------- Parität ----------

export const einsen = (bits) => bits.reduce((a, b) => a + b, 0);

// Paritätsbit für eine Bitfolge: gerade Parität → Gesamtzahl der Einsen gerade
export const paritaetsbit = (bits, gerade) => (gerade ? einsen(bits) % 2 : 1 - (einsen(bits) % 2));
