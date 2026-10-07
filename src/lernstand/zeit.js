// Datumsrechnung auf Tagesebene, immer in Ortszeit. Ein Tag wird als 'JJJJ-MM-TT' geführt.

export const TAG_MS = 86400000;

export function tagVon(zeitpunkt) {
  const d = new Date(zeitpunkt);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function datumAusTag(tag) {
  const [j, m, t] = tag.split('-').map(Number);
  return new Date(j, m - 1, t);
}

export function tagPlus(tag, tage) {
  const d = datumAusTag(tag);
  d.setDate(d.getDate() + tage);
  return tagVon(d);
}

// Ganze Tage von a bis b (b − a), unabhängig von Sommerzeit.
export function tageZwischen(a, b) {
  const da = datumAusTag(a);
  const db = datumAusTag(b);
  return Math.round((Date.UTC(db.getFullYear(), db.getMonth(), db.getDate()) - Date.UTC(da.getFullYear(), da.getMonth(), da.getDate())) / TAG_MS);
}

const WOCHENTAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const WOCHENTAGE_KURZ = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

export function datumLang(tag) {
  const d = datumAusTag(tag);
  return `${WOCHENTAGE[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]}`;
}

export function datumKurz(tag) {
  const d = datumAusTag(tag);
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

export function datumMitWochentag(tag) {
  const d = datumAusTag(tag);
  return `${WOCHENTAGE_KURZ[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.`;
}

// „heute", „morgen", „in 3 Tagen", „seit gestern", „seit 4 Tagen"
export function relativ(tag, heute) {
  const n = tageZwischen(heute, tag);
  if (n === 0) return 'heute';
  if (n === 1) return 'morgen';
  if (n === -1) return 'seit gestern';
  if (n > 1) return `in ${n} Tagen`;
  return `seit ${-n} Tagen`;
}
