// Neutrale Fassung der Lerninhalte für eine externe Durchsicht (ohne Regelwerk, Herkunft, Stufen, IDs der Quellen).
// Aufruf: node tools/extern/neutral-export.mjs   → build/extern/<RAUM>.md (Lernplan) und <RAUM>-lang.md (+ Erklärungen, Karten)
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';

const RAEUME = [
  ['AP1', 'ap1', 'Einrichten eines IT-gestützten Arbeitsplatzes – gemeinsame Grundlagen aller IT-Berufe (1. bis 2. Ausbildungsjahr)'],
  ['PB1', 'pb1', 'Planen eines Softwareproduktes – Fachrichtung Anwendungsentwicklung (2. bis 3. Ausbildungsjahr)'],
  ['PB2', 'pb2', 'Entwicklung und Umsetzung von Algorithmen – Fachrichtung Anwendungsentwicklung (2. bis 3. Ausbildungsjahr)'],
  ['WISO', 'wiso', 'Wirtschafts- und Sozialkunde – Arbeitswelt, Betrieb, Recht, Arbeitsschutz, Umwelt'],
];
const json = (p) => JSON.parse(readFileSync(p, 'utf8'));
const ohneCodes = (t) => t.replace(/\s*\((?:[A-Z]{1,2}\d+[a-z]?|P-[A-ZÄÖÜ-]+|E\d+)(?:[,;] ?(?:[A-Z]{1,2}\d+[a-z]?|P-[A-ZÄÖÜ-]+|E\d+))*\)/g, '');

// Titel aller Stichpunkte für „Baut auf“
const titel = {};
for (const [R, d] of RAEUME) for (const f of readdirSync(`umbau/lernplan/${d}`)) {
  const lp = json(`umbau/lernplan/${d}/${f}`);
  for (const tb of lp.themenbloecke) for (const sp of tb.stichpunkte) titel[sp.id] = `${sp.titel} (${R})`;
}

mkdirSync('build/extern', { recursive: true });
for (const [R, d, kopf] of RAEUME) {
  const kurz = {}, karten = {};
  for (const f of readdirSync(`umbau/lernplan/${d}`).sort((a, b) => a.localeCompare(b, 'de', { numeric: true }))) {
    const o = f.replace('.json', '');
    if (existsSync(`umbau/kurz/${d}/${f}`)) Object.assign(kurz, { [o]: json(`umbau/kurz/${d}/${f}`) });
    if (existsSync(`umbau/karten/${d}/${f}`)) for (const k of json(`umbau/karten/${d}/${f}`).karten) (karten[k.k] ??= []).push(k);
  }
  const zeilen = { kurz: [], lang: [] };
  const beide = (...z) => { zeilen.kurz.push(...z); zeilen.lang.push(...z); };
  beide(`# Lerninhalte ${R}`, '', `**Themengebiet:** ${kopf}`, '',
    'Gliederung: Ordner → Themenblock → Stichpunkt (eine Lerneinheit von etwa 30–90 Minuten) → „Das musst du können“.',
    '„Baut auf“ heißt: Das Thema wurde in einem früheren Teil schon gelernt; hier steht nur, was neu dazukommt.',
    '„Bewusst nicht enthalten“ sind gezogene Grenzen, „Zusatz“ ist freiwilliger Stoff.', '');
  let nSp = 0, nK = 0;
  for (const f of readdirSync(`umbau/lernplan/${d}`).sort((a, b) => a.localeCompare(b, 'de', { numeric: true }))) {
    const lp = json(`umbau/lernplan/${d}/${f}`);
    const o = f.replace('.json', '');
    beide(`## ${lp.oberblock.id} ${lp.oberblock.titel}`, '');
    for (const tb of lp.themenbloecke) {
      beide(`### ${tb.id} ${tb.titel}`, '', tb.satz ? `_${tb.satz}_` : '', '');
      for (const sp of tb.stichpunkte) {
        nSp++;
        beide(`#### ${sp.id} ${sp.titel}`, '', `**Ziel:** ${ohneCodes(sp.ziel)}`, '');
        const teaser = kurz[o]?.teaser?.[sp.id];
        if (teaser) zeilen.lang.push(`**Einstieg:** ${teaser}`, '');
        if (sp.baut_auf?.length) beide(`**Baut auf:** ${sp.baut_auf.map((id) => titel[id] ?? id).join('; ')}`, '');
        beide('**Das musst du können:**', '');
        sp.koennen.forEach((k, i) => {
          nK++;
          const neu = k.neu ? ` _(neu gegenüber: ${k.neu.gegenueber.map((id) => titel[id] ?? id).join(', ')} – ${k.neu.was})_` : '';
          beide(`${i + 1}. ${ohneCodes(k.text)}${neu}`);
          const e = kurz[o]?.erklaerung?.[k.id];
          if (e) zeilen.lang.push('', `   <details><summary>Erklärung</summary>`, '', ...e.split('\n').map((z) => `   ${z}`), '', '   </details>');
          for (const c of karten[k.id] ?? []) zeilen.lang.push(`   - Karte: **${c.vorne.replace(/\n/g, ' ')}** → ${c.hinten.replace(/\n/g, ' ')}`);
        });
        beide('');
        if (sp.grenzen?.length) beide('**Bewusst nicht enthalten:**', '', ...sp.grenzen.map((g) => `- ${ohneCodes(g.text)}`), '');
        if (sp.kuer?.length) beide('**Zusatz (freiwillig):**', '', ...sp.kuer.map((k) => `- ${ohneCodes(k.text)}`), '');
      }
    }
  }
  writeFileSync(`build/extern/${R}.md`, zeilen.kurz.join('\n'));
  writeFileSync(`build/extern/${R}-lang.md`, zeilen.lang.join('\n'));
  console.log(`${R}: ${nSp} Stichpunkte, ${nK} Können-Aussagen → build/extern/${R}.md (${Math.round(zeilen.kurz.join('\n').length / 1024)} KB), ${R}-lang.md (${Math.round(zeilen.lang.join('\n').length / 1024)} KB)`);
}
