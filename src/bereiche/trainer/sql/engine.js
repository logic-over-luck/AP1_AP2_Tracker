// SQL ausführen und Ergebnisse vergleichen. Unabhängig davon, wie sql.js geladen wird
// (Browser: eingebettetes WebAssembly; Tests: Node).

import { ERSTELLEN, registriereFunktionen } from './datenbank.js';

const UEBERSETZUNG = [
  [/no such table: (\S+)/i, (m) => `Die Tabelle „${m[1]}" gibt es nicht. Schau ins Schema rechts.`],
  [/no such column: (\S+)/i, (m) => `Die Spalte „${m[1]}" gibt es nicht (oder sie ist ohne Tabellenpräfix mehrdeutig).`],
  [/ambiguous column name: (\S+)/i, (m) => `Die Spalte „${m[1]}" ist mehrdeutig – schreibe tabelle.${m[1]} oder alias.${m[1]}.`],
  [/near "(.+?)": syntax error/i, (m) => `Syntaxfehler in der Nähe von „${m[1]}".`],
  [/incomplete input/i, () => 'Die Anweisung ist unvollständig.'],
  [/FOREIGN KEY constraint failed/i, () => 'Fremdschlüssel verletzt: Es gibt abhängige Datensätze (oder einen Verweis ins Leere). Achte auf die Reihenfolge.'],
  [/UNIQUE constraint failed: (\S+)/i, (m) => `Der Wert für ${m[1]} ist schon vergeben (Primärschlüssel oder eindeutig).`],
  [/NOT NULL constraint failed: (\S+)/i, (m) => `${m[1]} darf nicht leer sein.`],
  [/misuse of aggregate/i, () => 'Aggregatfunktion an falscher Stelle – Bedingungen auf Gruppen gehören in HAVING, nicht in WHERE.'],
  [/a GROUP BY clause is required/i, () => 'Für HAVING brauchst du GROUP BY.'],
  [/table (\S+) already exists/i, (m) => `Die Tabelle ${m[1]} gibt es schon.`],
  [/duplicate column name: (\S+)/i, (m) => `Die Spalte ${m[1]} gibt es schon.`],
  [/SELECTs to the left and right of UNION do not have the same number of result columns/i, () => 'Bei UNION müssen beide Abfragen gleich viele Spalten liefern.'],
  [/wrong number of arguments to function (\S+)/i, (m) => `Falsche Anzahl Argumente für ${m[1]}.`],
  [/no such function: (\S+)/i, (m) => `Die Funktion ${m[1]} gibt es hier nicht.`],
];

export function fehlerText(e) {
  const msg = String(e?.message ?? e);
  for (const [re, f] of UEBERSETZUNG) {
    const m = msg.match(re);
    if (m) return f(m);
  }
  return msg;
}

export function erstelleEngine(SQL, heute = new Date()) {
  const neueDb = (vorbereitung) => {
    const db = new SQL.Database();
    registriereFunktionen(db, heute);
    db.exec(ERSTELLEN);
    if (vorbereitung) db.exec(vorbereitung);
    return db;
  };
  return { neueDb, ausfuehren, vergleiche };
}

// Führt einen oder mehrere Befehle aus. Liefert das letzte Ergebnis mit Zeilen.
// Belegsatz-Schreibweise DATEADD(DAY, 14, datum) / DATEDIFF(MONTH, a, b): SQLite hielte DAY für eine
// Spalte – deshalb wird der Datumsteil vorher in Anführungszeichen gesetzt.
const DATUMSTEIL = /\b(DATEADD|DATEDIFF)\s*\(\s*(DAY|DAYS|MONTH|YEAR|HOUR|MINUTE|DD|MM|YY|YYYY)\s*,/gi;

export function ausfuehren(db, text) {
  const t = String(text ?? '').trim().replace(DATUMSTEIL, (_, f, teil) => `${f}('${teil}',`);
  if (!t) return { ergebnis: null, meldung: 'Keine Anweisung.' };
  const vorher = db.exec('SELECT total_changes()')[0].values[0][0];
  const res = db.exec(t);
  const nachher = db.exec('SELECT total_changes()')[0].values[0][0];
  const letztes = res.length ? res[res.length - 1] : null;
  return { ergebnis: letztes ? { spalten: letztes.columns, zeilen: letztes.values } : null, geaendert: nachher - vorher };
}

const norm = (v) => (typeof v === 'number' ? Math.round(v * 100) / 100 : v === null ? null : String(v));
const gleich = (a, b) => (typeof a === 'number' && typeof b === 'number' ? Math.abs(a - b) <= 0.005 + 1e-9 : norm(a) === norm(b));
const zeileGleich = (a, b) => a.length === b.length && a.every((x, i) => gleich(x, b[i]));
const schluessel = (z) => JSON.stringify(z.map(norm));

function mengeGleich(a, b, permutiert) {
  const f = permutiert ? (z) => [...z].map(norm).sort((x, y) => String(x).localeCompare(String(y))) : (z) => z;
  const sa = a.map(f).map((z) => [schluessel(z), z]).sort((x, y) => x[0].localeCompare(y[0]));
  const sb = b.map(f).map((z) => [schluessel(z), z]).sort((x, y) => x[0].localeCompare(y[0]));
  return sa.every((x, i) => zeileGleich(x[1], sb[i][1]));
}

// Ergebnis mit der Musterlösung vergleichen
export function vergleiche(soll, ist, { sortiert = false } = {}) {
  if (!ist) return { ok: false, grund: 'Die Anweisung liefert keine Tabelle.' };
  if (!soll) return { ok: !ist.zeilen.length };
  if (ist.spalten.length !== soll.spalten.length) return { ok: false, grund: `Dein Ergebnis hat ${ist.spalten.length} Spalten, erwartet sind ${soll.spalten.length}.` };
  if (ist.zeilen.length !== soll.zeilen.length) return { ok: false, grund: `Dein Ergebnis hat ${ist.zeilen.length} Zeilen, erwartet sind ${soll.zeilen.length}.` };
  if (sortiert) {
    if (soll.zeilen.every((z, i) => zeileGleich(z, ist.zeilen[i]))) return { ok: true };
    if (mengeGleich(soll.zeilen, ist.zeilen, false)) return { ok: false, grund: 'Die richtigen Zeilen, aber in falscher Reihenfolge – prüfe ORDER BY.' };
    return { ok: false, grund: 'Die Werte stimmen noch nicht.' };
  }
  if (mengeGleich(soll.zeilen, ist.zeilen, false)) return { ok: true };
  if (mengeGleich(soll.zeilen, ist.zeilen, true)) return { ok: true, hinweis: 'Richtig – nur die Spaltenreihenfolge weicht ab.' };
  return { ok: false, grund: 'Die Werte stimmen noch nicht.' };
}

// Prüft eine Aufgabe vollständig: Musterlösung und Eingabe je in eigener, frischer Datenbank.
export function pruefeAufgabe(engine, aufgabe, eingabe) {
  const soll = engine.neueDb(aufgabe.vorbereitung);
  const ist = engine.neueDb(aufgabe.vorbereitung);
  try {
    const s = ausfuehren(soll, aufgabe.loesung);
    let i;
    try {
      i = ausfuehren(ist, eingabe);
    } catch (e) {
      return { ok: false, grund: fehlerText(e), fehler: true };
    }
    if (aufgabe.modus === 'abfragen') return { ...vergleiche(s.ergebnis, i.ergebnis, { sortiert: aufgabe.sortiert }), ergebnis: i.ergebnis };
    // Änderungen und Struktur: Prüfabfragen auf beiden Datenbanken
    for (const q of [aufgabe.pruef, aufgabe.pruef2].filter(Boolean)) {
      const a = ausfuehren(soll, q).ergebnis;
      const b = ausfuehren(ist, q).ergebnis;
      const v = vergleiche(a ?? { spalten: b?.spalten ?? [], zeilen: [] }, b ?? { spalten: a?.spalten ?? [], zeilen: [] }, { sortiert: true });
      if (!v.ok) return { ok: false, grund: 'Der Datenbestand danach stimmt noch nicht mit der Aufgabe überein.', ergebnis: b, vergleich: a };
    }
    return { ok: true, ergebnis: i.ergebnis, geaendert: i.geaendert };
  } finally {
    soll.close();
    ist.close();
  }
}

// Liest den aktuellen Aufbau einer Datenbank (für die Schema-Ansicht, auch nach CREATE/ALTER/DROP).
export function schemaAus(db) {
  const werte = (q) => db.exec(q)[0]?.values ?? [];
  return werte("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY rowid").map(([name]) => {
    const n = String(name).replace(/'/g, "''");
    const fks = new Map(werte(`SELECT "from", "table" FROM pragma_foreign_key_list('${n}')`).map(([von, ziel]) => [von, ziel]));
    const spalten = werte(`SELECT name, type, pk FROM pragma_table_info('${n}') ORDER BY cid`).map(([sp, typ, pk]) => {
      const marken = [pk ? 'PK' : '', fks.has(sp) ? `FK → ${fks.get(sp)}` : ''].filter(Boolean).join(', ');
      return [sp, typ || '–', marken];
    });
    const zeilen = werte(`SELECT COUNT(*) FROM "${String(name).replace(/"/g, '""')}"`)[0]?.[0] ?? 0;
    return { name, spalten, zeilen };
  });
}
