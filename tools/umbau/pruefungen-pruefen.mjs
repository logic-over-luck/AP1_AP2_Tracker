// Prüft die Prüfungsabschriften (Schicht 0) auf Vollständigkeit und innere Stimmigkeit und
// erzeugt ein Verzeichnis aller Teilaufgaben (nur IDs, Punkte, Operatoren – kein Aufgabentext).
//
// Aufruf:  node tools/umbau/pruefungen-pruefen.mjs [quellen/pruefungen/ap1] [umbau/fundament/pruefungen-ap1.json]
//          node tools/umbau/pruefungen-pruefen.mjs pb1        (Kurzform: quellen/pruefungen/pb1 → umbau/fundament/pruefungen-pb1.json)
//
// Dateinamen: AP1 „2024H_AP1.md“ (Kopf-ID 2024H), AP2 „2025W_AP2-PB1.md“ (Kopf-ID 2025W-PB1),
// WiSo „2025W_WISO.md“ (Kopf-ID 2025W-WISO; 30 Aufgaben ohne Teilaufgaben, je 3,33333 Punkte).
//
// Erwartetes Format: wie 2024H_AP1.md – YAML-Kopf, „# <ID>-A1 · 25 Punkte", „## <ID>-A1-a · 3 Punkte",
// „### <ID>-A1-da · 2 Punkte", je Teilaufgabe ein ```yaml-Block mit operator: […].
//
// Fehler (Exit-Code 1): ID-Fehler, Punktsummen stimmen nicht, doppelte IDs.
// Hinweise (kein Fehler): fehlender Operator, fehlende Musterlösung, als unvollständig gekennzeichnete Teile.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const KURZ = /^(ap1|pb1|pb2|wiso)$/i.test(process.argv[2] ?? '') ? process.argv[2].toLowerCase() : null;
const ORDNER = KURZ ? `quellen/pruefungen/${KURZ}` : (process.argv[2] ?? 'quellen/pruefungen/ap1');
const ZIEL = KURZ ? `umbau/fundament/pruefungen-${KURZ}.json` : (process.argv[3] ?? 'umbau/fundament/pruefungen-ap1.json');

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
  const [termin, art = ''] = datei.replace(/\.md$/, '').split('_');
  const pb = art.match(/^AP2-(PB[12])$/);
  const wiso = art === 'WISO';
  const erwartetId = pb ? `${termin}-${pb[1]}` : wiso ? `${termin}-WISO` : termin;
  if (id !== erwartetId) fehler.push(`Kopf-ID „${id}" passt nicht zum Dateinamen (${erwartetId})`);

  const aufgaben = [];
  const teil = [];
  const ganz = []; // Kandidaten: Aufgaben, die selbst bewertete Einheit sind
  let aktuell = null; // aktuelle Teilaufgabe (für yaml / Musterlösung)
  const zeilen = md.split('\n');
  for (let i = 0; i < zeilen.length; i++) {
    const z = zeilen[i];
    const a = z.match(/^# (\S+-A\d+) · ([\d,.]+) Punkte?/);
    if (a) {
      aufgaben.push({ id: a[1], punkte: zahl(a[2]) });
      // Aufgabe ohne Teilaufgaben (z. B. AP2-PB2: ganze Aufgabe Pseudocode): yaml-Block direkt unter „# …-An“
      aktuell = {
        id: a[1], ebene: 1, punkte: zahl(a[2]), summe: false, aufgabe: a[1], operator: null, material: [],
        loesung_art: null, anzahl: null, hat_musterloesung: false, zeile: i + 1, yaml: false,
      };
      ganz.push(aktuell);
      continue;
    }
    const t = z.match(/^(#{2,3}) (\S+-A\d+-[a-z]+) · ([\d,.]+) Punkte?(.*)$/);
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
      aktuell.yaml = true;
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
        const at = y.match(/^aufgabentyp:\s*(.*)$/);
        if (at) aktuell.aufgabentyp = at[1].trim() || null;
      }
    }
    if (/^\*\*Musterlösung( \([^)]*\))?:\*\*/.test(z)) aktuell.hat_musterloesung = true;
  }

  // Aufgaben ohne Teilaufgaben, aber mit eigenem yaml-Block, sind selbst ein Blatt
  for (const g of ganz) {
    if (g.yaml && !teil.some((t) => t.aufgabe === g.id)) teil.push(g);
  }
  for (const t of teil) delete t.yaml;

  // IDs
  const alle = [...aufgaben.map((x) => x.id), ...teil.filter((x) => x.ebene > 1).map((x) => x.id)];
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
  // „je 3,33333“ (WiSo): alle Aufgaben gleich; sonst Liste [25, 25, …]
  const je = (k.aufgaben_punkte ?? '').match(/^je ([\d,.]+)/);
  const sollAufgaben = je ? aufgaben.map(() => zahl(je[1]))
    : (k.aufgaben_punkte ?? '').replace(/[[\]]/g, '').split(',').map(zahl).filter((n) => !Number.isNaN(n));
  aufgaben.forEach((a, n) => {
    if (sollAufgaben[n] !== undefined && sollAufgaben[n] !== a.punkte) fehler.push(`${a.id}: Kopf sagt ${sollAufgaben[n]}, Überschrift ${a.punkte} Punkte`);
    const s = teil.filter((t) => t.aufgabe === a.id && t.ebene <= 2).reduce((x, t) => x + t.punkte, 0);
    if (Math.abs(s - a.punkte) > 0.001) {
      const text = `${a.id}: Teilaufgaben ergeben ${s} statt ${a.punkte} Punkte`;
      if (unvollstaendig) hinweise.push(`${text} (Datei als unvollständig gekennzeichnet: ${k.fehlt})`); else fehler.push(text);
    }
  });
  const gesamt = aufgaben.reduce((x, a) => x + a.punkte, 0);
  // WiSo: 30 × 3,33333 = 99,9999 → Rundungstoleranz 0,01
  if (Math.abs(gesamt - zahl(k.punkte_gesamt)) > (wiso ? 0.01 : 0)) fehler.push(`Aufgaben ergeben ${gesamt} statt ${k.punkte_gesamt} Punkte`);
  const sollAnzahl = wiso ? zahl(k.aufgaben_anzahl ?? 30) : 4;
  if (aufgaben.length !== sollAnzahl) fehler.push(`${aufgaben.length} statt ${sollAnzahl} Aufgaben`);

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

// Aktueller Katalog gilt ab AP1 Frühjahr 2025 und AP2 Sommer 2025 (Katalog, PDF-S. 5).
// AP1: F = Frühjahr, H = Herbst; AP2 (PB1, PB2, WiSo): S = Sommer, W = Winter (2025W = Winter 2025/26).
export function katalogFuer(id) {
  const m = String(id).match(/^(\d{4})([FHSW])(-PB[12]|-WISO)?$/);
  if (!m) return null;
  if (/[FH]/.test(m[2]) === Boolean(m[3])) return null; // AP1 nur F/H, AP2 nur S/W
  return Number(m[1]) >= 2025 ? 'aktuell' : 'alt';
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
