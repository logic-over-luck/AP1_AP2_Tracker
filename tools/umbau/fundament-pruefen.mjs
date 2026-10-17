// Prüft Schicht 1 (Fundament): Stimmen die Katalog-Bausteine mit dem Katalog überein?
//
// Absichtlich UNABHÄNGIG vom Zerleger geschrieben: Dieses Skript liest den Katalog mit eigenen,
// einfachen Regeln noch einmal und vergleicht. Ein Fehler im Zerleger fällt so auf, statt sich
// in beiden Skripten gleich zu wiederholen.
//
// Aufruf:  node tools/umbau/fundament-pruefen.mjs [quellen/katalog.md] [umbau/fundament/katalog-bausteine.json]
// Ergebnis: Liste aller Prüfungen mit OK/FEHLER; Exit-Code 1 bei mindestens einem Fehler.

import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const QUELLE = process.argv[2] ?? 'quellen/katalog.md';
const BAUSTEINE = process.argv[3] ?? 'umbau/fundament/katalog-bausteine.json';

const md = readFileSync(QUELLE, 'utf8');
const b = JSON.parse(readFileSync(BAUSTEINE, 'utf8'));
const norm = (s) => s.replace(/\s+/g, ' ').trim();

let fehler = 0;
function pruefe(name, liste) {
  if (liste.length === 0) { console.log(`OK      ${name}`); return; }
  fehler += liste.length;
  console.log(`FEHLER  ${name} (${liste.length})`);
  for (const f of liste.slice(0, 15)) console.log(`          - ${f}`);
  if (liste.length > 15) console.log(`          … und ${liste.length - 15} weitere`);
}

// ---------- 0. Ist die Bausteindatei aus genau dieser Quelle erzeugt? ----------
const hash = createHash('sha256').update(md).digest('hex');
pruefe('Bausteine passen zur aktuellen Katalogdatei (Prüfsumme)',
  hash === b.meta.quelle_sha256 ? [] : ['Katalogdatei wurde geändert – Bausteine neu erzeugen: node tools/umbau/katalog-zerlegen.mjs']);

pruefe('Zerleger hat keine Zeile offen gelassen',
  b.nicht_zugeordnet.map((n) => `Zeile ${n.zeile}: ${n.text}`));

// ---------- 1. Katalog unabhängig einlesen ----------
const zeilen = md.split('\n');
const start = zeilen.findIndex((z) => /^# Teil 1 der Abschlussprüfung/.test(z));
const ende = zeilen.findIndex((z) => /^# Anhang/.test(z));
const teilZeilen = zeilen.slice(start, ende);

const quelleSpiegel = teilZeilen.filter((z) => /^\s*- /.test(z)).map((z) => norm(z.replace(/^\s*- /, '')));
const quellePunkte = teilZeilen.filter((z) => /^#### /.test(z)).map((z) => norm(z.slice(5)));
const quelleFK = teilZeilen.filter((z) => /^## \d{2} /.test(z)).map((z) => norm(z.slice(3)));
const rasterStart = zeilen.findIndex((z) => /^# Raster/.test(z));
const rasterEnde = zeilen.findIndex((z, i) => i > rasterStart && /^# /.test(z));
const quelleGebiete = zeilen.slice(rasterStart, rasterEnde).filter((z) => /^\|.*\|\s*\d{2}\s*\|.*§/.test(z));

// ---------- 2. Vollständigkeit: alles aus der Quelle ist ein Baustein ----------
function multisetDiff(quelle, ziel) {
  const zaehl = new Map();
  for (const t of ziel) zaehl.set(t, (zaehl.get(t) ?? 0) + 1);
  const fehlt = [];
  for (const t of quelle) {
    const n = zaehl.get(t) ?? 0;
    if (n === 0) fehlt.push(t); else zaehl.set(t, n - 1);
  }
  const zuviel = [...zaehl].filter(([, n]) => n > 0).map(([t]) => t);
  return { fehlt, zuviel };
}

const alleListenTexte = [...b.spiegelstriche.map((s) => s.text), ...b.handlungen.map((h) => h.text)];
const d1 = multisetDiff(quelleSpiegel, alleListenTexte);
pruefe(`Jeder Listenpunkt des Katalogs ist ein Baustein (${quelleSpiegel.length} im Katalog)`, d1.fehlt.map((t) => `fehlt: ${t}`));
pruefe('Kein Baustein ist erfunden (Listenpunkte)', d1.zuviel.map((t) => `nicht im Katalog: ${t}`));

const punktTexte = b.punkte.map((p) => norm(`${p.nr} ${p.titel}${p.hinweise.length ? ' → ' + p.hinweise.join(' → ') : ''}`));
const d2 = multisetDiff(quellePunkte, punktTexte);
pruefe(`Jeder Katalogpunkt ist ein Baustein (${quellePunkte.length} im Katalog)`, [...d2.fehlt.map((t) => `fehlt: ${t}`), ...d2.zuviel.map((t) => `nicht im Katalog: ${t}`)]);

const fkTexte = b.fragenkomplexe.map((f) => norm(`${f.nr} ${f.titel} (${f.paragraf})`));
const d3 = multisetDiff(quelleFK, fkTexte);
pruefe(`Jeder Fragenkomplex ist ein Baustein (${quelleFK.length} im Katalog)`, [...d3.fehlt.map((t) => `fehlt: ${t}`), ...d3.zuviel.map((t) => `nicht im Katalog: ${t}`)]);

const gebiete = b.pruefungsbereiche.flatMap((p) => p.gebiete);
pruefe(`Jedes Gebiet aus dem Raster ist erfasst (${quelleGebiete.length} im Raster)`,
  quelleGebiete.length === gebiete.length ? [] : [`Raster hat ${quelleGebiete.length}, Bausteine haben ${gebiete.length}`]);

// ---------- 3. Wortlaut: jeder Text steht so im Katalog ----------
const mdNorm = norm(md);
const wortlaut = [
  ...b.spiegelstriche.map((s) => [s.id, s.text]),
  ...b.handlungen.map((h) => [h.id, h.text]),
  ...b.punkte.map((p) => [p.id, p.titel]),
  ...b.fragenkomplexe.map((f) => [f.id, f.titel]),
  ...gebiete.map((g) => [g.id, g.text]),
  ...b.lernfelder.map((l) => [l.id, l.titel]),
].filter(([, t]) => !mdNorm.includes(t)).map(([id, t]) => `${id}: „${t}"`);
pruefe('Jeder Baustein-Text steht wörtlich im Katalog', wortlaut);

// ---------- 4. IDs und Verweise ----------
const ids = [
  ...b.fragenkomplexe, ...b.punkte, ...b.spiegelstriche, ...b.handlungen, ...gebiete, ...b.anhang, ...b.lernfelder,
].map((x) => x.id);
const doppelt = ids.filter((id, i) => ids.indexOf(id) !== i);
pruefe('Alle IDs sind eindeutig', doppelt);

const idSet = new Set(ids);
const verweise = [
  ...b.punkte.filter((p) => !idSet.has(p.fragenkomplex)).map((p) => `${p.id} → ${p.fragenkomplex}`),
  ...b.spiegelstriche.filter((s) => !idSet.has(s.punkt)).map((s) => `${s.id} → ${s.punkt}`),
  ...b.spiegelstriche.filter((s) => s.eltern && !idSet.has(s.eltern)).map((s) => `${s.id} → ${s.eltern}`),
  ...b.handlungen.filter((h) => !idSet.has(h.fragenkomplex)).map((h) => `${h.id} → ${h.fragenkomplex}`),
  ...b.abdeckungspflichtig.filter((id) => !idSet.has(id)).map((id) => `abdeckungspflichtig: ${id}`),
];
pruefe('Alle Verweise zeigen auf vorhandene IDs', verweise);

// Nummerierung lückenlos: Katalogpunkte je Fragenkomplex 01..n
const luecken = [];
for (const fk of b.fragenkomplexe) {
  const nrs = b.punkte.filter((p) => p.fragenkomplex === fk.id).map((p) => Number(p.nr));
  nrs.forEach((n, i) => { if (n !== i + 1) luecken.push(`${fk.id}: an Stelle ${i + 1} steht Nr. ${n}`); });
}
pruefe('Katalogpunkte sind je Fragenkomplex lückenlos nummeriert', luecken);

// Je Prüfungsteil erwartete Fragenkomplexe laut Übersicht (Original-PDF-Seite 9)
const erwartet = { AP1: 7, AP2a: 4, AP2b: 5, WISO: 5 };
pruefe('Fragenkomplexe je Teil wie in der Übersicht des Katalogs (AP1 7, AP2 fachrichtungsübergreifend 4, AP2 AE 5, WiSo 5)',
  Object.entries(erwartet)
    .filter(([t, n]) => b.fragenkomplexe.filter((f) => f.teil === t).length !== n)
    .map(([t, n]) => `${t}: erwartet ${n}, gefunden ${b.fragenkomplexe.filter((f) => f.teil === t).length}`));

pruefe('Gebiete je Prüfungsbereich wie im Raster (AP1 5, PB1 4, PB2 4, WiSo 5)',
  Object.entries({ AP1: 5, PB1: 4, PB2: 4, WISO: 5 })
    .filter(([pb, n]) => (b.pruefungsbereiche.find((p) => p.id === pb)?.gebiete.length ?? 0) !== n)
    .map(([pb, n]) => `${pb}: erwartet ${n}`));

console.log(`\n${fehler === 0 ? 'Fundament in Ordnung.' : `${fehler} Fehler – Fundament nicht verwenden, bis behoben.`}`);
console.log(`Bausteine: ${b.fragenkomplexe.length} Fragenkomplexe, ${b.punkte.length} Katalogpunkte, ${b.spiegelstriche.length} Spiegelstriche, ` +
  `${b.handlungen.length} betriebliche Handlungen, ${gebiete.length} Gebiete, ${b.anhang.length} Anhänge; abdeckungspflichtig: ${b.abdeckungspflichtig.length}`);
if (fehler) process.exitCode = 1;
