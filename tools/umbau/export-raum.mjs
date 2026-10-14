// Friert einen fertigen Raum ein und erzeugt seinen kompakten Export (E3, Schritt 5).
// Spätere Räume sehen von diesem Raum nur den Export: eine Zeile je Stichpunkt (ID, Titel, Können in Kurzform)
// und je Baustein die im Raum erreichte Stufe (für Importe nach E2: ergänzt wird nur, was tiefer ist).
//
// Aufruf:  node tools/umbau/export-raum.mjs AP1           erzeugt umbau/export/AP1.json und AP1.md
//          node tools/umbau/export-raum.mjs AP1 --pruefen  prüft nur, ob der Export zum Lernplan passt (eingefroren)
// Voraussetzung: node tools/umbau/raum-pruefen.mjs <Raum> ist grün.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const TEIL = process.argv[2];
if (!TEIL) { console.error('Aufruf: node tools/umbau/export-raum.mjs <Raum, z. B. AP1> [--pruefen]'); process.exit(2); }
const RAUM = TEIL.toLowerCase();
const PRUEFEN = process.argv.includes('--pruefen');

const dateien = readdirSync(`umbau/lernplan/${RAUM}`).filter((f) => f.endsWith('.json')).sort();
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const quellen = Object.fromEntries(dateien.map((f) => [f, hash(readFileSync(`umbau/lernplan/${RAUM}/${f}`))]));

const zuordnung = {};
for (const f of readdirSync(`umbau/zuordnung/${RAUM}`).filter((x) => x.endsWith('.json'))) {
  Object.assign(zuordnung, JSON.parse(readFileSync(`umbau/zuordnung/${RAUM}/${f}`, 'utf8')).teilaufgaben);
}

const kurz = (t) => t.replace(/^Du kannst /, '').replace(/\.$/, '');
const stichpunkte = [];
const erreicht = {};
for (const f of dateien) {
  const lp = JSON.parse(readFileSync(`umbau/lernplan/${RAUM}/${f}`, 'utf8'));
  for (const tb of lp.themenbloecke) for (const sp of tb.stichpunkte) {
    stichpunkte.push({
      id: sp.id, ordner: lp.oberblock.id, block: tb.id, titel: sp.titel, gebiete: sp.gebiete,
      bausteine: sp.bausteine.map((x) => x.id),
      koennen: sp.koennen.map((k) => ({ id: k.id, stufe: k.stufe, kurz: kurz(k.text) })),
    });
    for (const k of sp.koennen) for (const h of k.herkunft) {
      const i = h.indexOf(':');
      const [art, wert] = [h.slice(0, i), h.slice(i + 1)];
      const ids = art === 'katalog' ? [wert] : art === 'beleg' ? (zuordnung[wert]?.bausteine ?? []) : [];
      for (const id of ids) {
        const e = (erreicht[id] ??= { stufe: 0, stichpunkte: [] });
        e.stufe = Math.max(e.stufe, k.stufe);
        if (!e.stichpunkte.includes(sp.id)) e.stichpunkte.push(sp.id);
      }
    }
  }
}

const ziel = `umbau/export/${TEIL}.json`;
if (PRUEFEN) {
  if (!existsSync(ziel)) { console.log(`FEHLER ${ziel} fehlt`); process.exit(1); }
  const alt = JSON.parse(readFileSync(ziel, 'utf8'));
  const geaendert = dateien.filter((f) => alt.meta.quellen[f] !== quellen[f]);
  if (geaendert.length) {
    console.log(`FEHLER Raum ${TEIL} ist eingefroren, aber geändert: ${geaendert.join(', ')} – Änderung über den Parkplatz, dann Export neu erzeugen.`);
    process.exit(1);
  }
  console.log(`OK – Export ${TEIL} passt zum Lernplan (${dateien.length} Ordner).`);
  process.exit(0);
}

const exp = {
  meta: {
    raum: TEIL,
    erzeugt_mit: `node tools/umbau/export-raum.mjs ${TEIL}`,
    regelwerk_version: JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8')).version,
    hinweis: 'Eingefrorener Raum (E3). Spätere Räume importieren Stichpunkte mit baut_auf und ergänzen nur, was neu oder tiefer ist (E2). „erreicht“ = höchste Stufe einer Können-Aussage je Baustein in diesem Raum.',
    stichpunkte: stichpunkte.length,
    koennen: stichpunkte.reduce((a, s) => a + s.koennen.length, 0),
    quellen,
  },
  stichpunkte,
  erreicht: Object.fromEntries(Object.entries(erreicht).sort(([a], [b]) => a.localeCompare(b, 'de', { numeric: true }))),
};
mkdirSync('umbau/export', { recursive: true });
writeFileSync(ziel, JSON.stringify(exp, null, 1) + '\n');
const md = [`# Export ${TEIL} (eingefroren)`, '', `Erzeugt mit \`node tools/umbau/export-raum.mjs ${TEIL}\`. Eine Zeile je Stichpunkt; Können in Kurzform mit Stufe.`, '',
  `${exp.meta.stichpunkte} Stichpunkte, ${exp.meta.koennen} Können-Aussagen.`, '', '| Stichpunkt | Titel | Können (Stufe) |', '|---|---|---|',
  ...stichpunkte.map((s) => `| ${s.id} | ${s.titel} | ${s.koennen.map((k) => `${k.id.replace(s.id + '-', '')} ${k.kurz} (${k.stufe})`).join(' · ')} |`), ''];
writeFileSync(`umbau/export/${TEIL}.md`, md.join('\n'));
console.log(`Export ${TEIL}: ${exp.meta.stichpunkte} Stichpunkte, ${exp.meta.koennen} Können-Aussagen, ${Object.keys(erreicht).length} Bausteine mit erreichter Stufe → ${ziel}`);
