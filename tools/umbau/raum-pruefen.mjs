// Prüft einen Raum des neuen Lernplans als Ganzes (alle Ordner zusammen).
//
// Aufruf:  node tools/umbau/raum-pruefen.mjs AP1
// Liest:   umbau/lernplan/<raum>/*.json, das Fundament (Bausteine, belegte Tiefe, Zuordnung der Prüfungen)
//          und die Zusatzbausteine
// Schreibt: umbau/berichte/<RAUM>-raum.md
//
// Prüfungen (UMBAU.md Abschnitt 5, Raum-Ebene):
//   T1   jeder abdeckungspflichtige Baustein des Teils und jeder Zusatzbaustein steckt in einem Stichpunkt
//   T2b  jede Teilaufgabe (außer „ausserhalb") steckt in einem Stichpunkt – auch die, die nur geteilte Bausteine betreffen
//   T8   je Baustein erreicht eine Können-Aussage irgendeines Ordners die belegte Tiefe (auch geteilte Bausteine)

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const TEIL = process.argv[2];
if (!TEIL) { console.error('Aufruf: node tools/umbau/raum-pruefen.mjs <Teil, z. B. AP1>'); process.exit(2); }
const RAUM = TEIL.toLowerCase();

const b = JSON.parse(readFileSync('umbau/fundament/katalog-bausteine.json', 'utf8'));
const zusatz = JSON.parse(readFileSync('umbau/regeln/zusatzbausteine.json', 'utf8')).bausteine;
const belege = JSON.parse(readFileSync(`umbau/fundament/belege-${RAUM}.json`, 'utf8')).bausteine;
const zuordnung = {};
for (const f of readdirSync(`umbau/zuordnung/${RAUM}`).filter((x) => x.endsWith('.json')).sort()) {
  Object.assign(zuordnung, JSON.parse(readFileSync(`umbau/zuordnung/${RAUM}/${f}`, 'utf8')).teilaufgaben);
}

const ordner = readdirSync(`umbau/lernplan/${RAUM}`).filter((x) => x.endsWith('.json')).sort();
const wo = new Map();      // Baustein → Ordner
const inSP = new Set();    // Teilaufgaben in Stichpunkten
const ist = new Map();     // Baustein → höchste erreichte Stufe
for (const f of ordner) {
  const lp = JSON.parse(readFileSync(`umbau/lernplan/${RAUM}/${f}`, 'utf8'));
  for (const tb of lp.themenbloecke) for (const sp of tb.stichpunkte) {
    for (const x of sp.bausteine) { if (!wo.has(x.id)) wo.set(x.id, new Set()); wo.get(x.id).add(lp.oberblock.id); }
    for (const ta of sp.teilaufgaben) inSP.add(ta);
    for (const k of sp.koennen) for (const h of k.herkunft) {
      const [art, wert] = [h.slice(0, h.indexOf(':')), h.slice(h.indexOf(':') + 1)];
      const ids = art === 'katalog' ? [wert] : art === 'beleg' ? (zuordnung[wert]?.bausteine ?? []) : [];
      for (const id of ids) ist.set(id, Math.max(ist.get(id) ?? 0, k.stufe));
    }
  }
}

const fehler = [];
const pflicht = [...b.abdeckungspflichtig.filter((x) => x.startsWith(`${TEIL}.`)), ...Object.keys(zusatz)];
const t1 = pflicht.filter((x) => !wo.has(x));
for (const x of t1) fehler.push(`T1: ${x} steckt in keinem Stichpunkt`);
const aufgaben = Object.entries(zuordnung).filter(([, z]) => !z.ausserhalb);
const t2b = aufgaben.filter(([ta]) => !inSP.has(ta)).map(([ta]) => ta);
for (const ta of t2b) fehler.push(`T2b: Teilaufgabe ${ta} steckt in keinem Stichpunkt`);
const t8 = Object.entries(belege).filter(([id, x]) => x.stufe && !id.startsWith('ANH.') && (ist.get(id) ?? 0) < x.stufe);
for (const [id, x] of t8) fehler.push(`T8: ${id} braucht Stufe ${x.stufe}, erreicht im Raum ${ist.get(id) ?? 'keine'}`);

const geteilt = [...wo].filter(([, s]) => s.size > 1).sort(([a], [c]) => a.localeCompare(c));
const zeilen = [
  `# Raum ${TEIL} – Prüfung über alle Ordner`, '',
  `Ordner: ${ordner.map((f) => f.replace('.json', '')).join(', ')}.`, '',
  `- T1: ${pflicht.length} abdeckungspflichtige Bausteine (davon ${Object.keys(zusatz).length} Zusatzbausteine), ${t1.length} fehlen.`,
  `- T2b: ${aufgaben.length} Teilaufgaben, ${t2b.length} ohne Stichpunkt.`,
  `- T8: ${Object.values(belege).filter((x) => x.stufe).length} Bausteine mit belegter Tiefe, ${t8.length} nicht erreicht.`, '',
  '## Bausteine in mehreren Ordnern', '', '| Baustein | Ordner |', '|---|---|',
  ...geteilt.map(([id, s]) => `| ${id} | ${[...s].sort().join(', ')} |`), '',
  '## Fehler', '', ...(fehler.length ? fehler.map((x) => `- ${x}`) : ['keine']), '',
];
writeFileSync(`umbau/berichte/${TEIL}-raum.md`, zeilen.join('\n'));
console.log(`${TEIL}: ${ordner.length} Ordner, ${pflicht.length} Pflichtbausteine, ${aufgaben.length} Teilaufgaben`);
if (fehler.length) { console.log(`FEHLER (${fehler.length})`); for (const x of fehler) console.log('  - ' + x); process.exit(1); }
console.log('OK – T1, T2b, T8 auf Raum-Ebene bestanden.');
