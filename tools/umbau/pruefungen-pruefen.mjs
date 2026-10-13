// Prüft die Prüfungsabschriften (Schicht 0) auf Vollständigkeit und innere Stimmigkeit und
// erzeugt ein Verzeichnis aller Teilaufgaben (nur IDs, Punkte, Operatoren – kein Aufgabentext).
//
// Aufruf:  node tools/umbau/pruefungen-pruefen.mjs [quellen/pruefungen/ap1] [umbau/fundament/pruefungen-ap1.json]
//
// Erwartetes Format: wie 2024H_AP1.md – YAML-Kopf, „# <ID>-A1 · 25 Punkte", „## <ID>-A1-a · 3 Punkte",
// „### <ID>-A1-da · 2 Punkte", je Teilaufgabe ein ```yaml-Block mit operator: […].
//
// Fehler (Exit-Code 1): ID-Fehler, Punktsummen stimmen nicht, doppelte IDs.
// Hinweise (kein Fehler): fehlender Operator, fehlende Musterlösung, als unvollständig gekennzeichnete Teile.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ORDNER = process.argv[2] ?? 'quellen/pruefungen/ap1';
const ZIEL = process.argv[3] ?? 'umbau/fundament/pruefungen-ap1.json';

const zahl = (s) => Number(String(s).replace(',', '.'));

function kopf(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  const k = {};
  if (!m) return k;
  for (const z of m[1].split('\n')) {
    const t = z.match(/^([\wäöüÄÖÜß_]+):\s*(.*)$/);
    if (t) k[t[1]] = t[2].trim();
  }
  return k;
}

export function lies(datei, md) {
  const k = kopf(md);
  const fehler = [], hinweise = [];
  const id = k.id;
  const erwartetId = datei.split('_')[0];
  if (id !== erwartetId) fehler.push(`Kopf-ID „${id}" passt nicht zum Dateinamen (${erwartetId})`);

  const aufgaben = [];
  const teil = [];
  let aktuell = null; // aktuelle Teilaufgabe (für yaml / Musterlösung)
  const zeilen = md.split('\n');
  for (let i = 0; i < zeilen.length; i++) {
    const z = zeilen[i];
    const a = z.match(/^# (\S+-A\d) · ([\d,.]+) Punkte?/);
    if (a) {
      aufgaben.push({ id: a[1], punkte: zahl(a[2]) });
      aktuell = null;
      continue;
    }
    const t = z.match(/^(#{2,3}) (\S+-A\d-[a-z]+) · ([\d,.]+) Punkte?(.*)$/);
    if (t) {
      aktuell = {
        id: t[2], ebene: t[1].length, punkte: zahl(t[3]), summe: /Summe aus/.test(t[4]),
        aufgabe: t[2].replace(/-[a-z]+$/, ''), operator: null, material: [], loesung_art: null,
        anzahl: null, hat_musterloesung: false, zeile: i + 1,
      };
      teil.push(aktuell);
      continue;
    }
    if (!aktuell) continue;
    if (z.startsWith('```yaml')) {
      for (let j = i + 1; j < zeilen.length && !zeilen[j].startsWith('```'); j++) {
        const y = zeilen[j];
        const op = y.match(/^operator:\s*\[(.*)\]/);
        if (op) aktuell.operator = op[1].split(',').map((x) => x.trim()).filter(Boolean);
        const ma = y.match(/^material:\s*\[(.*)\]/);
        if (ma) aktuell.material = ma[1].split(',').map((x) => x.trim()).filter(Boolean);
        const la = y.match(/^lösung_art:\s*(.*)$/);
        if (la) aktuell.loesung_art = la[1].trim() || null;
        const an = y.match(/^anzahl:\s*(.*)$/);
        if (an) aktuell.anzahl = an[1].trim() || null;
      }
    }
    if (/^\*\*Musterlösung:\*\*/.test(z)) aktuell.hat_musterloesung = true;
  }

  // IDs
  const alle = [...aufgaben.map((x) => x.id), ...teil.map((x) => x.id)];
  for (const x of alle) if (!x.startsWith(`${id}-`)) fehler.push(`ID ${x} passt nicht zur Prüfung ${id}`);
  const doppelt = alle.filter((x, i) => alle.indexOf(x) !== i);
  for (const x of doppelt) fehler.push(`doppelte ID ${x}`);

  // Blätter: Teilaufgaben ohne Unterteilung
  for (const t of teil) {
    const kinder = teil.filter((u) => u.ebene === 3 && u.id.startsWith(t.id) && u.id !== t.id);
    t.blatt = !(t.ebene === 2 && kinder.length > 0);
    if (!t.blatt) {
      const s = kinder.reduce((a, u) => a + u.punkte, 0);
      if (Math.abs(s - t.punkte) > 0.001) fehler.push(`${t.id}: Unterteile ergeben ${s} statt ${t.punkte} Punkte`);
    }
  }

  // Punktsummen
  const unvollstaendig = k['vollständig'] === 'nein';
  const sollAufgaben = (k.aufgaben_punkte ?? '').replace(/[[\]]/g, '').split(',').map(zahl).filter((n) => !Number.isNaN(n));
  aufgaben.forEach((a, n) => {
    if (sollAufgaben[n] !== undefined && sollAufgaben[n] !== a.punkte) fehler.push(`${a.id}: Kopf sagt ${sollAufgaben[n]}, Überschrift ${a.punkte} Punkte`);
    const s = teil.filter((t) => t.aufgabe === a.id && t.ebene === 2).reduce((x, t) => x + t.punkte, 0);
    if (Math.abs(s - a.punkte) > 0.001) {
      const text = `${a.id}: Teilaufgaben ergeben ${s} statt ${a.punkte} Punkte`;
      if (unvollstaendig) hinweise.push(`${text} (Datei als unvollständig gekennzeichnet: ${k.fehlt})`); else fehler.push(text);
    }
  });
  const gesamt = aufgaben.reduce((x, a) => x + a.punkte, 0);
  if (gesamt !== zahl(k.punkte_gesamt)) fehler.push(`Aufgaben ergeben ${gesamt} statt ${k.punkte_gesamt} Punkte`);
  if (aufgaben.length !== 4) fehler.push(`${aufgaben.length} statt 4 Aufgaben`);

  // Hinweise je Blatt
  const loesung = k['lösungshinweise'] === 'ja';
  for (const t of teil.filter((x) => x.blatt)) {
    if (!t.operator || t.operator.length === 0) hinweise.push(`${t.id}: kein Operator im yaml-Block`);
    if (loesung && !t.hat_musterloesung) hinweise.push(`${t.id}: keine Musterlösung`);
  }

  return {
    pruefung: {
      id, datei, termin: k.termin ?? null,
      katalog: katalogFuer(id),
      loesungshinweise: k['lösungshinweise'] ?? null,
      loesungshinweise_amtlich: k['lösungshinweise_amtlich'] || null,
      vollstaendig: k['vollständig'] ?? null, fehlt: k.fehlt || null,
      aufgaben, teilaufgaben: teil.map(({ zeile, ...r }) => r),
    },
    fehler, hinweise,
  };
}

// Aktueller Katalog gilt ab AP1 Frühjahr 2025 (Katalog, PDF-S. 5).
function katalogFuer(id) {
  const m = id.match(/^(\d{4})([FH])$/);
  if (!m) return null;
  const jahr = Number(m[1]);
  return jahr > 2025 || (jahr === 2025) ? 'aktuell' : 'alt';
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dateien = readdirSync(ORDNER).filter((f) => f.endsWith('.md')).sort();
  const pruefungen = [];
  let fehlerGesamt = 0;
  for (const d of dateien) {
    const r = lies(d, readFileSync(join(ORDNER, d), 'utf8'));
    pruefungen.push(r.pruefung);
    const blaetter = r.pruefung.teilaufgaben.filter((t) => t.blatt).length;
    console.log(`${r.fehler.length ? 'FEHLER ' : 'OK     '} ${d}  ${blaetter} Teilaufgaben, Katalog ${r.pruefung.katalog}` +
      `${r.hinweise.length ? `, ${r.hinweise.length} Hinweise` : ''}`);
    for (const f of r.fehler) console.log(`          ✗ ${f}`);
    for (const h of r.hinweise) console.log(`          · ${h}`);
    fehlerGesamt += r.fehler.length;
  }
  mkdirSync(dirname(ZIEL), { recursive: true });
  writeFileSync(ZIEL, JSON.stringify({
    meta: {
      erzeugt_mit: 'node tools/umbau/pruefungen-pruefen.mjs',
      hinweis: 'Verzeichnis der Teilaufgaben ohne Aufgabentext. „blatt" = kleinste bewertete Einheit.',
      anzahl_pruefungen: pruefungen.length,
      anzahl_teilaufgaben: pruefungen.reduce((a, p) => a + p.teilaufgaben.filter((t) => t.blatt).length, 0),
    },
    pruefungen,
  }, null, 2) + '\n');
  console.log(`\n${fehlerGesamt ? `${fehlerGesamt} Fehler.` : 'Alle Abschriften stimmig.'}`);
  if (fehlerGesamt) process.exitCode = 1;
}
