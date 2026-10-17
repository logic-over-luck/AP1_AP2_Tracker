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
//   T8   je Baustein erreicht eine Können-Aussage irgendeines Ordners die belegte Tiefe (auch geteilte Bausteine);
//        bei importierten Bausteinen (E2) zählt auch die im früheren Raum erreichte Stufe (umbau/export/<Raum>.json)
//   ALT  (ab PB1, P33) jede alte AP2-Können-Aussage ist genau einmal in einem alt_neu des Raums einsortiert;
//        WISO (P48): jede alte WiSo-Können-Aussage genau einmal
//   P47  (WISO) gedeckte WiSo-Bausteine (umbau/regeln/wiso-deckung.json): T1 erfüllt, wenn ein WiSo-Stichpunkt per
//        baut_auf auf einen deckenden Stichpunkt verweist; T8 zählt die dort erreichte Stufe

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { raum } from './raum.mjs';

const TEIL = process.argv[2];
if (!TEIL) { console.error('Aufruf: node tools/umbau/raum-pruefen.mjs <Teil, z. B. AP1>'); process.exit(2); }
const RAUM = TEIL.toLowerCase();
const R = raum(TEIL);
const exporte = Object.fromEntries(R.frueher.filter((r) => existsSync(`umbau/export/${r}.json`))
  .map((r) => [r, JSON.parse(readFileSync(`umbau/export/${r}.json`, 'utf8'))]));

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
const bautAuf = new Set(); // importierte Stichpunkte früherer Räume
const ist = new Map();     // Baustein → höchste erreichte Stufe
for (const f of ordner) {
  const lp = JSON.parse(readFileSync(`umbau/lernplan/${RAUM}/${f}`, 'utf8'));
  for (const tb of lp.themenbloecke) for (const sp of tb.stichpunkte) {
    for (const x of sp.bausteine) { if (!wo.has(x.id)) wo.set(x.id, new Set()); wo.get(x.id).add(lp.oberblock.id); }
    for (const ta of sp.teilaufgaben) inSP.add(ta);
    for (const ba of sp.baut_auf ?? []) bautAuf.add(ba);
    for (const k of sp.koennen) for (const h of k.herkunft) {
      const [art, wert] = [h.slice(0, h.indexOf(':')), h.slice(h.indexOf(':') + 1)];
      const ids = art === 'katalog' ? [wert] : art === 'beleg' ? (zuordnung[wert]?.bausteine ?? []) : [];
      for (const id of ids) ist.set(id, Math.max(ist.get(id) ?? 0, k.stufe));
    }
  }
}

const fehler = [];
const pflicht = R.pflicht;
// P47: Deckungstabelle prüfen
const deckung = R.deckung ?? {};
const exportSP = new Map(Object.values(exporte).flatMap((e) => e.stichpunkte.map((x) => [x.id, x])));
for (const [id, d] of Object.entries(deckung)) {
  if (!pflicht.includes(id)) fehler.push(`P47: ${id} in der Deckungstabelle ist kein Pflichtbaustein von ${TEIL}`);
  if (!d.grund || d.grund.length < 10) fehler.push(`P47: ${id} ohne Grund`);
  if (!d.stichpunkte?.length) fehler.push(`P47: ${id} ohne deckenden Stichpunkt`);
  for (const sp of d.stichpunkte ?? []) if (!exportSP.has(sp)) fehler.push(`P47: ${id}: Stichpunkt ${sp} steht in keinem Export (${R.frueher.join(', ')})`);
}
const gedecktErreicht = (id) => Math.max(0, ...(deckung[id]?.stichpunkte ?? []).flatMap((sp) => (exportSP.get(sp)?.koennen ?? []).map((k) => k.stufe)));
const gedecktSichtbar = (id) => (deckung[id]?.stichpunkte ?? []).some((sp) => bautAuf.has(sp));
const t1 = pflicht.filter((x) => !wo.has(x) && !gedecktSichtbar(x));
for (const x of t1) fehler.push(`T1: ${x} steckt in keinem Stichpunkt`);
const aufgaben = Object.entries(zuordnung).filter(([, z]) => !z.ausserhalb);
const t2b = aufgaben.filter(([ta]) => !inSP.has(ta)).map(([ta]) => ta);
for (const ta of t2b) fehler.push(`T2b: Teilaufgabe ${ta} steckt in keinem Stichpunkt`);
// Import (E2): erreicht = max(Stufe in diesem Raum, Stufe im früheren Raum laut Export)
const istGesamt = (id, x) => Math.max(ist.get(id) ?? 0, x.import ? (exporte[x.import]?.erreicht[id]?.stufe ?? 0) : 0, id in deckung ? gedecktErreicht(id) : 0);
for (const r of new Set(Object.values(belege).filter((x) => x.import).map((x) => x.import))) {
  if (!exporte[r]) fehler.push(`Export ${r} fehlt (node tools/umbau/export-raum.mjs ${r}) – Importe nicht prüfbar`);
}
const t8 = Object.entries(belege).filter(([id, x]) => x.stufe && !id.startsWith('ANH.') && istGesamt(id, x) < x.stufe);
for (const [id, x] of t8) fehler.push(`T8: ${id} braucht Stufe ${x.stufe}, erreicht ${x.import ? `(mit Import aus ${x.import}) ` : 'im Raum '}${istGesamt(id, x) || 'keine'}`);

// ALT (ab PB1, P33): jede alte AP2-Können-Aussage genau einmal einsortiert (PB2: die in PB1 für PB2 vermerkten)
function altFuerPb2() {
  const ids = new Set();
  for (const f of readdirSync('umbau/lernplan/pb1').filter((x) => x.endsWith('.json')))
    for (const x of JSON.parse(readFileSync(`umbau/lernplan/pb1/${f}`, 'utf8')).alt_neu?.koennen ?? []) if (x.status === 'PB2') ids.add(x.alt);
  return ids;
}
let altBilanz = null;
if (TEIL === 'PB1' || TEIL === 'PB2' || TEIL === 'WISO') {
  const alt = JSON.parse(readFileSync('Inhaltsdatei_AP1_AP2_tracker.json', 'utf8'));
  // PB1: alle alten AP2-Aussagen; PB2: die in PB1 als „PB2“ vermerkten; WISO: alle alten WiSo-Aussagen
  const altTeil = (t) => alt.stichpunkte.filter((s) => s.teil === t).flatMap((s) => s.koennen.map((k) => k.id));
  const altK = TEIL === 'PB1' ? altTeil('AP2') : TEIL === 'WISO' ? altTeil('WISO') : [...altFuerPb2()];
  const eintraege = [];
  for (const f of ordner) eintraege.push(...(JSON.parse(readFileSync(`umbau/lernplan/${RAUM}/${f}`, 'utf8')).alt_neu?.koennen ?? []));
  for (const id of altK) {
    const n = eintraege.filter((x) => x.alt === id).length;
    if (n !== 1) fehler.push(`ALT: ${id} ist ${n}-mal einsortiert (soll genau 1, P33)`);
  }
  altBilanz = Object.fromEntries(['übernommen', 'verschoben', 'angepasst', 'gestrichen', 'PB2'].map((st) => [st, eintraege.filter((x) => x.status === st).length]));
  altBilanz.alt = altK.length;
}

const geteilt = [...wo].filter(([, s]) => s.size > 1).sort(([a], [c]) => a.localeCompare(c));
const zeilen = [
  `# Raum ${TEIL} – Prüfung über alle Ordner`, '',
  `Ordner: ${ordner.map((f) => f.replace('.json', '')).join(', ')}.`, '',
  `- T1: ${pflicht.length} abdeckungspflichtige Bausteine (davon ${R.zusatzHier.length} Zusatzbausteine), ${t1.length} fehlen.`,
  `- T2b: ${aufgaben.length} Teilaufgaben, ${t2b.length} ohne Stichpunkt.`,
  `- T8: ${Object.values(belege).filter((x) => x.stufe).length} Bausteine mit belegter Tiefe, ${t8.length} nicht erreicht.`,
  ...(deckung && Object.keys(deckung).length ? [`- P47: ${Object.keys(deckung).length} WiSo-Bausteine durch frühere Räume gedeckt (umbau/regeln/wiso-deckung.json).`] : []),
  ...(altBilanz ? [`- ALT (${TEIL === 'WISO' ? 'P48' : 'P33'}): ${altBilanz.alt} alte ${TEIL === 'WISO' ? 'WiSo' : 'AP2'}-Können-Aussagen → ${TEIL === 'WISO' ? `${altBilanz['übernommen']} übernommen, ` : ''}${altBilanz.verschoben} verschoben, ${altBilanz.angepasst} angepasst, ${altBilanz.gestrichen} gestrichen${TEIL === 'PB1' ? `, ${altBilanz.PB2} für PB2 vermerkt` : ''}.`] : []), '',
  '## Bausteine in mehreren Ordnern', '', '| Baustein | Ordner |', '|---|---|',
  ...geteilt.map(([id, s]) => `| ${id} | ${[...s].sort().join(', ')} |`), '',
  '## Fehler', '', ...(fehler.length ? fehler.map((x) => `- ${x}`) : ['keine']), '',
];
writeFileSync(`umbau/berichte/${TEIL}-raum.md`, zeilen.join('\n'));
console.log(`${TEIL}: ${ordner.length} Ordner, ${pflicht.length} Pflichtbausteine, ${aufgaben.length} Teilaufgaben`);
if (fehler.length) { console.log(`FEHLER (${fehler.length})`); for (const x of fehler) console.log('  - ' + x); process.exit(1); }
console.log('OK – T1, T2b, T8 auf Raum-Ebene bestanden.');
