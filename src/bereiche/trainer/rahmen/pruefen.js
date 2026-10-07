// Prüfer für Antworten in den Rechentrainern.
//
// Grundsatz: Eine richtige Antwort darf nie als falsch gewertet werden. Deshalb:
// – Komma und Punkt sind beide als Dezimaltrenner erlaubt; Tausenderpunkte und Leerzeichen auch.
//   Ist eine Eingabe mehrdeutig („1.234"), zählt sie, wenn eine der Lesarten stimmt.
// – Einheiten und Währungszeichen hinter der Zahl werden ignoriert.
// – Gerundet wird nur dort verlangt, wo die Aufgabe es sagt. Eine genauere Antwort ist auch richtig.

// Liefert alle plausiblen Zahlenwerte einer Eingabe (meist genau einen).
export function lesarten(eingabe) {
  if (eingabe === null || eingabe === undefined) return [];
  let s = String(eingabe)
    .trim()
    .replace(/[   ]/g, ' ')
    .replace(/[−–]/g, '-');
  // Einheit oder Zeichen hinten / vorne weglassen (€, %, GiB, Tage, h …)
  s = s.replace(/^.*?(?=[+-]?\d|[+-]?[.,]\d)/, '').replace(/[^\d.,]+$/, '');
  s = s.replace(/(\d)\s+(?=\d{3}\b)/g, '$1'); // 1 234 567 → 1234567
  if (!/^[+-]?[\d.,]+$/.test(s) || !/\d/.test(s)) return [];
  const vorzeichen = s.startsWith('-') ? -1 : 1;
  s = s.replace(/^[+-]/, '');
  const ergebnisse = new Set();
  const punkte = (s.match(/\./g) ?? []).length;
  const kommas = (s.match(/,/g) ?? []).length;
  const zahl = (t) => {
    if (!/^\d*\.?\d*$/.test(t) || t === '' || t === '.') return null;
    const n = Number(t);
    return Number.isFinite(n) ? n * vorzeichen : null;
  };
  const tausenderGueltig = (t, trenner) => new RegExp(`^\\d{1,3}(\\${trenner}\\d{3})+$`).test(t);

  if (punkte && kommas) {
    // Das letzte Zeichen ist der Dezimaltrenner
    const dez = s.lastIndexOf(',') > s.lastIndexOf('.') ? ',' : '.';
    const tausend = dez === ',' ? '.' : ',';
    const [ganz, nach] = [s.slice(0, s.lastIndexOf(dez)), s.slice(s.lastIndexOf(dez) + 1)];
    if (ganz.includes(dez)) return [];
    if (ganz.includes(tausend) && !tausenderGueltig(ganz, tausend)) return [];
    const n = zahl(ganz.split(tausend).join('') + '.' + nach);
    if (n !== null) ergebnisse.add(n);
  } else if (kommas) {
    if (kommas === 1) {
      const n = zahl(s.replace(',', '.'));
      if (n !== null) ergebnisse.add(n);
    }
    if (tausenderGueltig(s, ',')) ergebnisse.add(Number(s.split(',').join('')) * vorzeichen);
  } else if (punkte) {
    if (punkte === 1) {
      const n = zahl(s);
      if (n !== null) ergebnisse.add(n);
    }
    if (tausenderGueltig(s, '.')) ergebnisse.add(Number(s.split('.').join('')) * vorzeichen);
  } else {
    const n = zahl(s);
    if (n !== null) ergebnisse.add(n);
  }
  return [...ergebnisse];
}

export function runde(wert, stellen = 0) {
  const f = 10 ** stellen;
  // kaufmännisch runden, robust gegen Gleitkomma-Reste (1.005 → 1.01)
  return Math.sign(wert) * Math.round(Math.abs(wert) * f + 1e-9) / f;
}

// Zahl mit deutschem Komma, ohne Tausenderpunkte bei kleinen Zahlen
export function zahlText(wert, stellen = null, { tausender = true } = {}) {
  if (wert === null || wert === undefined || Number.isNaN(wert)) return '–';
  const opts = stellen === null ? { maximumFractionDigits: 10 } : { minimumFractionDigits: stellen, maximumFractionDigits: stellen };
  return wert.toLocaleString('de-DE', { ...opts, useGrouping: tausender });
}

export function euro(wert) {
  return `${zahlText(wert, 2)} €`;
}

// Prüft eine Zahl. feld: { erwartet, stellen?, toleranz? }
// erwartet ist der exakte (ungerundete) Wert; stellen sagt, worauf die Aufgabe runden lässt.
export function pruefeZahl(eingabe, feld) {
  const werte = lesarten(eingabe);
  if (!werte.length) return { ok: false, leer: String(eingabe ?? '').trim() === '', grund: 'keine Zahl' };
  const stellen = feld.stellen ?? 0;
  const gerundet = runde(feld.erwartet, stellen);
  const halbe = 0.5 * 10 ** -stellen;
  const toleranz = Math.max(feld.toleranz ?? 0, 1e-9);
  for (const x of werte) {
    if (Math.abs(x - gerundet) <= toleranz + 1e-9 * Math.max(1, Math.abs(gerundet))) return { ok: true };
    // genauer als verlangt: mehr Nachkommastellen, die richtig gerundet das Ergebnis ergeben
    if (x !== runde(x, stellen) && runde(x, stellen) === gerundet && Math.abs(x - feld.erwartet) < halbe) return { ok: true, hinweis: `gerundet: ${zahlText(gerundet, stellen)}` };
  }
  return { ok: false };
}

// Zahl in einem Stellenwertsystem (2, 8, 16). Leerzeichen, führende Nullen, 0x/0b/h erlaubt.
export function pruefeBasis(eingabe, erwartet, basis) {
  let s = String(eingabe ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]/g, '');
  if (basis === 16) s = s.replace(/^0x/, '').replace(/h$/, '');
  if (basis === 2) s = s.replace(/^0b/, '');
  if (basis === 8) s = s.replace(/^0o/, '');
  const erlaubt = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^\d+$/, 16: /^[0-9a-f]+$/ }[basis];
  if (!s) return { ok: false, leer: true };
  if (!erlaubt.test(s)) return { ok: false, grund: 'ungültige Ziffer' };
  return { ok: parseInt(s, basis) === erwartet };
}

// IPv4-Adresse oder Maske vergleichen
export function pruefeIPv4(eingabe, erwartet) {
  const s = String(eingabe ?? '').trim();
  if (!s) return { ok: false, leer: true };
  const teile = s.split('.').map((t) => t.trim());
  if (teile.length !== 4 || teile.some((t) => !/^\d{1,3}$/.test(t) || Number(t) > 255)) return { ok: false, grund: 'keine gültige IPv4-Adresse' };
  return { ok: teile.map(Number).join('.') === erwartet };
}

export function pruefeText(eingabe, erlaubt) {
  const norm = (x) =>
    String(x ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  const e = norm(eingabe);
  if (!e) return { ok: false, leer: true };
  return { ok: erlaubt.some((a) => norm(a) === e) };
}

// Ein Feld prüfen, je nach Typ
export function pruefeFeld(eingabe, feld) {
  switch (feld.typ ?? 'zahl') {
    case 'zahl':
      return pruefeZahl(eingabe, feld);
    case 'basis':
      return pruefeBasis(eingabe, feld.erwartet, feld.basis);
    case 'ipv4':
      return pruefeIPv4(eingabe, feld.erwartet);
    case 'auswahl':
      return { ok: eingabe === feld.erwartet, leer: eingabe === '' || eingabe === undefined };
    case 'text':
      return pruefeText(eingabe, feld.erlaubt ?? [feld.erwartet]);
    case 'eigen':
      return feld.pruefe(eingabe);
    default:
      return { ok: false };
  }
}
