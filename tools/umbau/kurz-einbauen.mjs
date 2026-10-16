// Regelwerk v2.2: Trägt das Stichwort `kurz` in Können-Aussagen und Kür-Einträge eines Ordners ein.
//
// Aufruf:  node tools/umbau/kurz-einbauen.mjs <kurz.json> [--trocken]
//
// kurz.json (eigene Worte, von der erzeugenden Sitzung geschrieben):
// { "ordner": "AP1-4",
//   "koennen": { "AP1-4-1-2-K1": "Cache-Stufen und ihr Zweck", … },
//   "kuer":    { "AP1-4-1-2#1": "Prozessor-Sockel im Vergleich", … } }   // #n = n-ter Kür-Eintrag des Stichpunkts (ab 1)
//
// Das Feld steht direkt hinter `text`; `text` selbst bleibt unverändert. Vorhandenes `kurz` wird überschrieben.
// Fehlt für eine Aussage oder einen Kür-Eintrag des Ordners ein Stichwort, bricht das Skript ab (nichts geschrieben).
// Die Form (Länge, Wörter, „Du“, Eindeutigkeit) prüft danach lernplan-pruefen.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const [datei] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const TROCKEN = process.argv.includes('--trocken');
if (!datei) { console.error('Aufruf: node tools/umbau/kurz-einbauen.mjs <kurz.json> [--trocken]'); process.exit(2); }
const eingabe = JSON.parse(readFileSync(datei, 'utf8'));
const ORDNER = eingabe.ordner;
const raum = ORDNER.split('-')[0].toLowerCase();
const ziel = `umbau/lernplan/${raum}/${ORDNER}.json`;
if (!readdirSync(`umbau/lernplan/${raum}`).includes(`${ORDNER}.json`)) { console.error(`Lernplan ${ziel} fehlt`); process.exit(2); }

const roh = readFileSync(ziel, 'utf8');
const lp = JSON.parse(roh);
const indent = [1, 2, 4].find((n) => JSON.stringify(lp, null, n) === roh.replace(/\n$/, '')) ?? 2;

const mitKurz = (o, kurz) => Object.fromEntries(Object.entries({ ...o, kurz }).sort(([a], [b]) => {
  const pos = (x) => (x === 'kurz' ? Object.keys(o).indexOf('text') + 0.5 : Object.keys(o).indexOf(x));
  return pos(a) - pos(b);
}));

const fehler = [];
const benutzt = new Set();
let nK = 0, nKuer = 0;
for (const tb of lp.themenbloecke) for (const sp of tb.stichpunkte) {
  sp.koennen = sp.koennen.map((k) => {
    const kurz = eingabe.koennen?.[k.id];
    if (!kurz) { fehler.push(`${k.id}: kein Stichwort`); return k; }
    benutzt.add(k.id); nK++;
    return mitKurz(k, kurz.trim());
  });
  if (sp.kuer) sp.kuer = sp.kuer.map((ku, i) => {
    const schluessel = `${sp.id}#${i + 1}`;
    const kurz = eingabe.kuer?.[schluessel];
    if (!kurz) { fehler.push(`${schluessel} (Kür): kein Stichwort`); return ku; }
    benutzt.add(schluessel); nKuer++;
    return mitKurz(ku, kurz.trim());
  });
}
for (const id of [...Object.keys(eingabe.koennen ?? {}), ...Object.keys(eingabe.kuer ?? {})]) if (!benutzt.has(id)) fehler.push(`${id}: steht nicht im Ordner`);
if (fehler.length) { console.log(`FEHLER ${ORDNER}:\n  - ${fehler.join('\n  - ')}`); process.exit(1); }
if (!TROCKEN) writeFileSync(ziel, JSON.stringify(lp, null, indent) + (roh.endsWith('\n') ? '\n' : ''));
console.log(`${ORDNER}: kurz für ${nK} Aussagen und ${nKuer} Kür-Einträge${TROCKEN ? ' (trocken)' : ''}`);
