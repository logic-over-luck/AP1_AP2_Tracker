// T10 – Buch-Abdeckung (Regelwerk v2.0, D1/D2/D4/D9, UMBAU.md 4.0).
//
// Aufruf:  node tools/umbau/buch-pruefen.mjs                 prüft alles, schreibt umbau/berichte/V2-buch.md
//          node tools/umbau/buch-pruefen.mjs AP1-4           wie oben, „neu“ zählt nur für Stichpunkte dieses Ordners
//          node tools/umbau/buch-pruefen.mjs AP1             … nur für Stichpunkte dieses Raums
//          node tools/umbau/buch-pruefen.mjs --schreiben     überträgt Zählungen und Aussage-IDs aus den lokalen
//                                                            Kernpunkt-Dateien nach umbau/zuordnung/buch.json
// Liest:   umbau/zuordnung/buch.json (im Repo: nur Kapitelnummern, Seiten, Stichpunkt-IDs, Zählungen – D9),
//          quellen/lehrbuch/kern/<Band>/<Kapitel>.json (nur lokal: eigene Stichworte je Kernpunkt, E10/D9),
//          alle Lernpläne umbau/lernplan/*/*.json
//
// Prüfungen:
//   T10a  buch.json: jedes Kapitel der drei Bände hat einen Eintrag (Anzahl laut meta.erwartet), Seiten gültig,
//         zugeordnete Stichpunkte gibt es; ein Kapitel mit „filter“ hat keine Stichpunkte
//   T10b  jede Herkunft buch:<Band>-<Kapitel>[-S<Seite>] nennt ein Kapitel aus buch.json, das ihrem Stichpunkt
//         zugeordnet ist; die Seite liegt im Kapitel; jede Kür-Quelle buch:… nennt ein Kapitel aus buch.json
//   T10c  (nur mit lokalen Quellen) jedes Kapitel hat eine Kernpunkt-Datei; Datei vollständig (band, kapitel,
//         seiten, stichpunkte, kernpunkte bzw. filter); je Kernpunkt Stichwort, Seite und genau einer von
//         aussage (ID oder Liste, muss existieren), neu: true (mit stichpunkt), filter (Grund aus Regel K),
//         kuer (Stichpunkt mit Kür-Eintrag, D8); Zählungen in buch.json passen zur Datei
//   T10d  kein Kernpunkt mehr „neu: true“ (im gewählten Ordner/Raum oder überall)

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';

const args = process.argv.slice(2);
const SCHREIBEN = args.includes('--schreiben');
const BEREICH = args.find((a) => !a.startsWith('--')) ?? null;
const ZUORDNUNG = process.env.BUCH_DATEI ?? 'umbau/zuordnung/buch.json';
const KERN = process.env.BUCH_KERN ?? 'quellen/lehrbuch/kern';
const regeln = JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8'));
const BUCH = new RegExp(regeln.buch.herkunft.regex);
const GRUENDE = new Set(regeln.buch.regel_k.filter_gruende);

const fehler = [], hinweise = [];
const F = (s) => fehler.push(s), H = (s) => hinweise.push(s);

// ---------- Lernpläne ----------
const sp = new Map(); // Stichpunkt-ID → { raum, ordner, koennen: Set, kuer }
const aussage = new Map(); // Können-ID → Stichpunkt-ID
const buchHerkunft = []; // { k, sp, wert }
const kuerQuellen = [];
for (const r of readdirSync('umbau/lernplan')) {
  for (const f of readdirSync(`umbau/lernplan/${r}`).filter((x) => x.endsWith('.json'))) {
    const lp = JSON.parse(readFileSync(`umbau/lernplan/${r}/${f}`, 'utf8'));
    for (const tb of lp.themenbloecke) for (const s of tb.stichpunkte) {
      sp.set(s.id, { raum: r.toUpperCase(), ordner: lp.oberblock.id, kuer: s.kuer ?? [] });
      for (const k of s.koennen) {
        aussage.set(k.id, s.id);
        for (const h of k.herkunft ?? []) if (h.startsWith('buch:')) buchHerkunft.push({ k: k.id, sp: s.id, wert: h.slice(5) });
      }
      for (const ku of s.kuer ?? []) for (const q of ku.quellen ?? []) if (q.startsWith('buch:')) kuerQuellen.push({ sp: s.id, wert: q.slice(5) });
    }
  }
}
const imBereich = (spId) => !BEREICH || spId === BEREICH || spId.startsWith(`${BEREICH}-`) || sp.get(spId)?.raum === BEREICH;

// ---------- T10a: buch.json ----------
if (!existsSync(ZUORDNUNG)) { console.log(`FEHLER ${ZUORDNUNG} fehlt`); process.exit(1); }
const zu = JSON.parse(readFileSync(ZUORDNUNG, 'utf8'));
const kapitel = zu.kapitel ?? {};
const ids = Object.keys(kapitel);
for (const [band, n] of Object.entries(zu.meta?.erwartet ?? {})) {
  const ist = ids.filter((id) => id.startsWith(`${band}-`)).length;
  if (ist !== n) F(`T10a: Band ${band}: ${ist} Kapitel in buch.json, erwartet ${n}`);
}
for (const [id, e] of Object.entries(kapitel)) {
  if (!BUCH.test(id)) F(`T10a: Kapitel-ID ${id} hat nicht das Format <Band>-<Kapitel>`);
  if (!Array.isArray(e.seiten) || e.seiten.length !== 2 || !(e.seiten[0] <= e.seiten[1])) F(`T10a: ${id}: Seiten fehlen oder ungültig`);
  if (e.filter && e.stichpunkte?.length) F(`T10a: ${id}: Kapitel mit filter hat trotzdem Stichpunkte`);
  if (e.filter && !GRUENDE.has(e.filter)) F(`T10a: ${id}: unbekannter Filter-Grund ${e.filter}`);
  if (!e.filter && !e.stichpunkte?.length) F(`T10a: ${id}: weder Stichpunkte noch filter`);
  for (const s of e.stichpunkte ?? []) if (!sp.has(s)) F(`T10a: ${id}: Stichpunkt ${s} gibt es nicht`);
}

// ---------- T10b: Herkunft buch: und Kür-Quellen ----------
const kapitelVon = (wert) => wert.replace(/-S\d+$/, '');
for (const { k, sp: s, wert } of buchHerkunft) {
  const kap = kapitelVon(wert);
  const e = kapitel[kap];
  if (!e) { F(`T10b: ${k}: Herkunft buch:${wert} – Kapitel ${kap} steht nicht in buch.json`); continue; }
  if (!(e.stichpunkte ?? []).includes(s)) F(`T10b: ${k}: Kapitel ${kap} ist dem Stichpunkt ${s} nicht zugeordnet`);
  const m = wert.match(/-S(\d+)$/);
  if (m && e.seiten && (Number(m[1]) < e.seiten[0] || Number(m[1]) > e.seiten[1])) F(`T10b: ${k}: Seite ${m[1]} liegt nicht im Kapitel ${kap} (S. ${e.seiten.join('–')})`);
}
for (const { sp: s, wert } of kuerQuellen) if (!kapitel[kapitelVon(wert)]) F(`T10b: ${s}: Kür-Quelle buch:${wert} – Kapitel steht nicht in buch.json`);

// ---------- T10c/T10d: lokale Kernpunkt-Dateien ----------
const lokal = existsSync(KERN);
const summe = {}; // Band → Zählung
const neuOffen = [];
if (lokal) {
  for (const [id, e] of Object.entries(kapitel)) {
    const band = id.split('-')[0];
    const nr = id.slice(band.length + 1);
    const datei = `${KERN}/${band}/${nr}.json`;
    const z = (summe[band] ??= { kapitel: 0, filterKapitel: 0, kernpunkte: 0, abgedeckt: 0, neu: 0, filter: 0, kuer: 0 });
    z.kapitel++;
    if (!existsSync(datei)) { F(`T10c: ${id}: Kernpunkt-Datei ${datei} fehlt`); continue; }
    let d;
    try { d = JSON.parse(readFileSync(datei, 'utf8')); } catch (x) { F(`T10c: ${id}: ${datei} ist kein JSON (${x.message})`); continue; }
    if (d.band !== band || d.kapitel !== nr) F(`T10c: ${id}: band/kapitel in der Datei passen nicht (${d.band}-${d.kapitel})`);
    if (!Array.isArray(d.seiten) || d.seiten.length !== 2) F(`T10c: ${id}: seiten fehlt`);
    else if (e.seiten && (d.seiten[0] !== e.seiten[0] || d.seiten[1] !== e.seiten[1])) F(`T10c: ${id}: Seiten ${d.seiten.join('–')} ≠ buch.json ${e.seiten.join('–')}`);
    const spDatei = [...(d.stichpunkte ?? [])].sort().join(',');
    if (spDatei !== [...(e.stichpunkte ?? [])].sort().join(',')) F(`T10c: ${id}: Stichpunkte der Datei (${spDatei || '–'}) ≠ buch.json (${(e.stichpunkte ?? []).join(',') || '–'})`);
    if (d.filter) {
      z.filterKapitel++;
      if (!GRUENDE.has(d.filter)) F(`T10c: ${id}: unbekannter Filter-Grund ${d.filter}`);
      if (d.kernpunkte?.length) F(`T10c: ${id}: Kapitel mit filter hat Kernpunkte`);
      if (!d.filter_grund) H(`${id}: filter ohne Erläuterung (filter_grund)`);
      continue;
    }
    if (!d.kernpunkte?.length) F(`T10c: ${id}: keine Kernpunkte und kein filter`);
    const zaehl = { kernpunkte: 0, abgedeckt: 0, neu: 0, filter: 0, kuer: 0 };
    const aussagen = new Set();
    for (const [i, kp] of (d.kernpunkte ?? []).entries()) {
      const wo = `T10c: ${id} Kernpunkt ${i + 1}`;
      if (!kp.stichwort || kp.stichwort.length < 3) F(`${wo}: Stichwort fehlt`);
      if (kp.stichwort && kp.stichwort.length > 200) H(`${id} Kernpunkt ${i + 1}: Stichwort über 200 Zeichen – eigene Stichworte, kein Buchsatz (D9)`);
      if (!Number.isInteger(kp.seite)) F(`${wo}: Seite fehlt`);
      else if (d.seiten && (kp.seite < d.seiten[0] || kp.seite > d.seiten[1])) F(`${wo}: Seite ${kp.seite} außerhalb des Kapitels`);
      const arten = ['aussage', 'neu', 'filter', 'kuer'].filter((a) => kp[a] !== undefined && kp[a] !== false && kp[a] !== null);
      if (arten.length !== 1) { F(`${wo}: braucht genau eines von aussage, neu, filter, kuer (hat ${arten.join(', ') || 'keines'})`); continue; }
      zaehl.kernpunkte++;
      const art = arten[0];
      if (art === 'aussage') {
        zaehl.abgedeckt++;
        for (const a of [kp.aussage].flat()) {
          if (!aussage.has(a)) F(`${wo}: Aussage ${a} gibt es nicht`);
          else if (!(d.stichpunkte ?? []).includes(aussage.get(a))) H(`${id} Kernpunkt ${i + 1}: Aussage ${a} liegt in ${aussage.get(a)}, nicht in einem zugeordneten Stichpunkt`);
          aussagen.add(a);
        }
      } else if (art === 'neu') {
        zaehl.neu++;
        if (kp.neu !== true) F(`${wo}: neu muss true sein`);
        if (!kp.stichpunkt || !sp.has(kp.stichpunkt)) F(`${wo}: neu ohne gültigen stichpunkt`);
        if (!kp.stichpunkt || imBereich(kp.stichpunkt)) neuOffen.push(`${id} Kernpunkt ${i + 1} → ${kp.stichpunkt}`);
      } else if (art === 'filter') {
        zaehl.filter++;
        if (!GRUENDE.has(kp.filter)) F(`${wo}: unbekannter Filter-Grund ${kp.filter} (erlaubt: ${[...GRUENDE].join(', ')})`);
      } else {
        zaehl.kuer++;
        if (!sp.get(kp.kuer)?.kuer?.some((k) => (k.quellen ?? []).some((q) => kapitelVon(q.replace(/^buch:/, '')) === id))) F(`${wo}: kuer ${kp.kuer} – dort gibt es keinen Kür-Eintrag mit Quelle buch:${id}`);
      }
    }
    for (const [k, v] of Object.entries(zaehl)) z[k] += v;
    if (SCHREIBEN) {
      e.kernpunkte = zaehl;
      e.aussagen = [...aussagen].sort();
    } else if (e.kernpunkte && JSON.stringify(e.kernpunkte) !== JSON.stringify(zaehl)) F(`T10c: ${id}: Zählung in buch.json veraltet (node tools/umbau/buch-pruefen.mjs --schreiben)`);
  }
  for (const x of neuOffen) F(`T10d: noch neu: ${x}`);
} else H('Kernpunkt-Dateien fehlen (quellen/ ist nur lokal) – T10c/T10d übersprungen, geprüft wurden nur buch.json und die Lernpläne');

if (SCHREIBEN) {
  zu.meta.stand = new Date().toISOString().slice(0, 10);
  writeFileSync(ZUORDNUNG, JSON.stringify(zu, null, 1) + '\n');
}

// ---------- Bericht ----------
if (!process.env.BUCH_DATEI) {
  const z = [`# T10 – Buch-Abdeckung (Regelwerk v2.0)`, '', 'Erzeugt mit `node tools/umbau/buch-pruefen.mjs`. Nicht von Hand bearbeiten.', '',
    `**Ergebnis:** ${fehler.length ? `${fehler.length} Fehler` : 'bestanden'}${BEREICH ? ` (neu geprüft für ${BEREICH})` : ''}, ${hinweise.length} Hinweise.`, ''];
  if (lokal) {
    z.push('| Band | Kapitel | davon Filter (ganz) | Kernpunkte | abgedeckt | neu | Filter | Kür |', '|---|---|---|---|---|---|---|---|');
    for (const [b, x] of Object.entries(summe)) z.push(`| ${b} | ${x.kapitel} | ${x.filterKapitel} | ${x.kernpunkte} | ${x.abgedeckt} | ${x.neu} | ${x.filter} | ${x.kuer} |`);
    z.push('');
  }
  z.push(`Buch-Herkunft in Können-Aussagen: ${buchHerkunft.length}; Kür-Quellen aus dem Buch: ${kuerQuellen.length}.`, '');
  if (fehler.length || hinweise.length) { z.push('## Fehler und Hinweise', ''); for (const f of fehler.slice(0, 500)) z.push(`- ✗ ${f}`); for (const h of hinweise.slice(0, 200)) z.push(`- · ${h}`); }
  mkdirSync('umbau/berichte', { recursive: true });
  writeFileSync('umbau/berichte/V2-buch.md', z.join('\n') + '\n');
}
console.log(`T10: ${ids.length} Kapitel in buch.json, ${buchHerkunft.length} Aussagen mit Buch-Herkunft${lokal ? `; Kernpunkte: ${Object.entries(summe).map(([b, x]) => `${b} ${x.kernpunkte} (abgedeckt ${x.abgedeckt}, neu ${x.neu}, Filter ${x.filter}, Kür ${x.kuer})`).join(' · ')}` : ''}`);
for (const h of hinweise.slice(0, 20)) console.log(`HINWEIS ${h}`);
if (fehler.length) { console.log(`FEHLER (${fehler.length})`); for (const f of fehler.slice(0, 60)) console.log(`  - ${f}`); if (fehler.length > 60) console.log(`  … ${fehler.length - 60} weitere`); process.exitCode = 1; }
else console.log('OK – T10 bestanden.');
