// Berechnet die Mindesttiefe (Stufe 1–4) für jeden Katalogpunkt und Spiegelstrich – rein mechanisch
// aus Fundament (Schicht 1) und Regelwerk (Schicht 2). Prüft dabei, ob das Regelwerk lückenlos ist.
//
// Aufruf:  node tools/umbau/tiefe-berechnen.mjs
// Liest:   umbau/fundament/katalog-bausteine.json, umbau/regeln/regelwerk.json, UMBAU.md
// Schreibt: umbau/fundament/tiefe.json  (nur IDs, Stufen und Operator-Wörter, kein Katalogtext)
//
// Regeln (UMBAU.md 4.1): mehrere Operatoren → höchste Stufe; ein Spiegelstrich mit eigenem Operator
// hat dessen Stufe (auch wenn sie niedriger ist – so begrenzt der Katalog z. B. das ISMS auf
// „kennen und unterstützen"), sonst die seines Katalogpunkts; ohne Operator → Eintrag in „ohne_operator"
// (zuerst nach Katalogpunkt-ID, dann nach Teil).

import { readFileSync, writeFileSync } from 'node:fs';
import { OPERATOREN } from './katalog-zerlegen.mjs';

const b = JSON.parse(readFileSync('umbau/fundament/katalog-bausteine.json', 'utf8'));
const r = JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8'));
const umbau = readFileSync('UMBAU.md', 'utf8');

const fehler = [];

// ---------- Regelwerk vollständig? ----------
for (const op of OPERATOREN) if (!(op in r.operatoren)) fehler.push(`Operator ohne Stufe: ${op}`);
for (const op of Object.keys(r.operatoren)) if (!OPERATOREN.includes(op)) fehler.push(`Regelwerk nennt unbekannten Operator: ${op}`);
for (const [op, st] of Object.entries(r.operatoren)) if (![1, 2, 3, 4].includes(st)) fehler.push(`Ungültige Stufe ${st} bei ${op}`);

// ---------- UMBAU.md-Tabelle stimmt mit dem Regelwerk überein? ----------
const abschnitt = umbau.split('### 4.1')[1]?.split('### 4.2')[0] ?? '';
const tabelle = {};
for (const z of abschnitt.split('\n')) {
  const m = z.match(/^\| ([1-4]) /);
  if (m) for (const op of z.split('|')[3].split(',').map((x) => x.trim()).filter(Boolean)) tabelle[op] = Number(m[1]);
}
for (const [op, st] of Object.entries(r.operatoren)) {
  if (tabelle[op] !== st) fehler.push(`UMBAU.md 4.1 und regelwerk.json weichen ab bei „${op}" (${tabelle[op]} ≠ ${st})`);
}

// ---------- Stufen berechnen ----------
const stufeAus = (ops) => ops.length ? Math.max(...ops.map((o) => r.operatoren[o])) : null;
const punkte = {};
for (const p of b.punkte) {
  let stufe = stufeAus(p.operatoren);
  let quelle = p.operatoren.length ? `operator:${p.operatoren.join(',')}` : null;
  if (stufe === null) {
    const teil = p.fragenkomplex.split('.')[0];
    const regel = r.ohne_operator[p.id] ?? r.ohne_operator[teil];
    if (!regel) fehler.push(`Katalogpunkt ohne Operator und ohne Regel: ${p.id}`);
    else { stufe = regel.stufe; quelle = `regel:ohne_operator:${p.id in r.ohne_operator ? p.id : teil}`; }
  }
  punkte[p.id] = { stufe, quelle };
}
const spiegelstriche = {};
for (const s of b.spiegelstriche) {
  const eigen = stufeAus(s.operatoren);
  spiegelstriche[s.id] = eigen !== null
    ? { stufe: eigen, quelle: `operator:${s.operatoren.join(',')}` }
    : { stufe: punkte[s.punkt].stufe, quelle: `von:${s.punkt}` };
}

// Jeder abdeckungspflichtige Baustein braucht eine Stufe
for (const id of b.abdeckungspflichtig) {
  const t = spiegelstriche[id] ?? punkte[id];
  if (!t || t.stufe == null) fehler.push(`Abdeckungspflichtiger Baustein ohne Stufe: ${id}`);
}

const verteilung = { 1: 0, 2: 0, 3: 0, 4: 0 };
for (const id of b.abdeckungspflichtig) verteilung[(spiegelstriche[id] ?? punkte[id]).stufe]++;

writeFileSync('umbau/fundament/tiefe.json', JSON.stringify({
  meta: {
    schicht: '1+2 (berechnet)',
    regelwerk_version: r.version,
    fundament_sha256: b.meta.quelle_sha256,
    erzeugt_mit: 'node tools/umbau/tiefe-berechnen.mjs',
    hinweis: 'Mindesttiefe aus dem Katalog. Belege aus Prüfungen können sie anheben (B1), nie senken (E6).',
    verteilung_abdeckungspflichtig: verteilung,
  },
  punkte, spiegelstriche,
}, null, 2) + '\n');

if (fehler.length) {
  console.log(`FEHLER (${fehler.length})`);
  for (const f of fehler) console.log(`  - ${f}`);
  process.exitCode = 1;
} else {
  console.log(`Regelwerk v${r.version} lückenlos. Stufen der ${b.abdeckungspflichtig.length} abdeckungspflichtigen Bausteine: ` +
    Object.entries(verteilung).map(([s, n]) => `Stufe ${s}: ${n}`).join(', '));
}
