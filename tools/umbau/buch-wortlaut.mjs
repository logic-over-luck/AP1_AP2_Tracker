// K5 maschinell (Regelwerk v2.0, D9): Sucht gleiche Wortfolgen zwischen eigenen Texten und dem Lehrbuch-OCR.
//
// Aufruf:  node tools/umbau/buch-wortlaut.mjs [--n 6] [--kern] [Raum|Ordner]
//   ohne --kern: prüft Können-Aussagen mit Herkunft buch:, ihre Erklärungen (umbau/kurz) und Karten (umbau/karten)
//   mit --kern:  prüft stichwort und vorschlag der lokalen Kernpunkt-Dateien (quellen/lehrbuch/kern)
// Verglichen wird mit dem Text des genannten Kapitels (Seitenbereich aus umbau/zuordnung/buch.json, ±1 Seite).
// Treffer = gleiche Folge von n Wörtern (Standard 6; Groß-/Kleinschreibung, Satzzeichen und Silbentrennung
// werden ausgeglichen). Allerweltsfolgen (nur Füllwörter) zählen nicht. Exit 1 bei Treffern.
// Braucht die lokalen Quellen (E10); ohne sie: Hinweis, Exit 0.

import { readFileSync, readdirSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const N = Number(args[args.indexOf('--n') + 1]) || 6;
const KERN = args.includes('--kern');
const BEREICH = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--n') ?? null;
const regeln = JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8'));
const zu = JSON.parse(readFileSync('umbau/zuordnung/buch.json', 'utf8'));

const baende = regeln.buch.baende;
if (!Object.values(baende).every((b) => existsSync(b.datei))) { console.log('HINWEIS Lehrbuch-OCR fehlt (quellen/ ist nur lokal) – K5-Prüfung übersprungen'); process.exit(0); }
const seiten = Object.fromEntries(Object.entries(baende).map(([k, b]) => [k, readFileSync(b.datei, 'utf8').split('\f')]));

const FUELL = new Set('der die das den dem des ein eine einen einem einer und oder in im ist sind zu zum zur von mit auf für bei als an es sich nicht auch wird werden kann können du man so wie wenn dass'.split(' '));
const woerter = (t) => t.replace(/-\n/g, '').toLowerCase().replace(/[^a-zäöüß0-9]+/g, ' ').trim().split(' ').filter(Boolean);
const ngramme = (w) => { const s = new Set(); for (let i = 0; i + N <= w.length; i++) { const g = w.slice(i, i + N); if (g.some((x) => !FUELL.has(x) && x.length > 3)) s.add(g.join(' ')); } return s; };
const cache = new Map();
function kapitelGramme(kap) {
  if (cache.has(kap)) return cache.get(kap);
  const band = kap.split('-')[0];
  const e = zu.kapitel[kap];
  if (!e) return null;
  const [a, b] = e.seiten;
  const text = seiten[band].slice(Math.max(0, a), b + 3).join('\n'); // Seite n steht im Abschnitt n+1
  const g = ngramme(woerter(text));
  cache.set(kap, g);
  return g;
}
const treffer = [];
function pruefe(wo, text, kapitel) {
  const eigen = ngramme(woerter(text));
  for (const kap of kapitel) {
    const g = kapitelGramme(kap);
    if (!g) continue;
    const gleich = [...eigen].filter((x) => g.has(x));
    if (gleich.length) treffer.push(`${wo} (${kap}): „${gleich.slice(0, 3).join(' | ')}“${gleich.length > 3 ? ` … ${gleich.length} Folgen` : ''}`);
  }
}

let geprueft = 0;
if (KERN) {
  const K = 'quellen/lehrbuch/kern';
  for (const band of existsSync(K) ? readdirSync(K) : []) for (const f of readdirSync(`${K}/${band}`)) {
    const kap = `${band}-${f.replace(/\.json$/, '')}`;
    if (BEREICH && !kap.startsWith(BEREICH)) continue;
    const d = JSON.parse(readFileSync(`${K}/${band}/${f}`, 'utf8'));
    (d.kernpunkte ?? []).forEach((kp, i) => {
      for (const feld of ['stichwort', 'vorschlag']) if (kp[feld]) { geprueft++; pruefe(`${kap}#${i + 1} ${feld}`, kp[feld], [kap]); }
    });
  }
} else {
  const kurz = new Map(), karten = new Map();
  for (const r of readdirSync('umbau/kurz')) for (const f of readdirSync(`umbau/kurz/${r}`)) for (const [id, t] of Object.entries(JSON.parse(readFileSync(`umbau/kurz/${r}/${f}`, 'utf8')).erklaerung ?? {})) kurz.set(id, t);
  for (const r of readdirSync('umbau/karten')) for (const f of readdirSync(`umbau/karten/${r}`)) for (const c of JSON.parse(readFileSync(`umbau/karten/${r}/${f}`, 'utf8')).karten ?? []) karten.set(c.k, [...(karten.get(c.k) ?? []), c]);
  for (const r of readdirSync('umbau/lernplan')) for (const f of readdirSync(`umbau/lernplan/${r}`).filter((x) => x.endsWith('.json'))) {
    const lp = JSON.parse(readFileSync(`umbau/lernplan/${r}/${f}`, 'utf8'));
    for (const tb of lp.themenbloecke) for (const sp of tb.stichpunkte) {
      if (BEREICH && !(sp.id === BEREICH || sp.id.startsWith(`${BEREICH}-`) || r.toUpperCase() === BEREICH)) continue;
      for (const k of sp.koennen) {
        const kap = [...new Set(k.herkunft.filter((h) => h.startsWith('buch:')).map((h) => h.slice(5).replace(/-S\d+$/, '')))];
        if (!kap.length) continue;
        geprueft++;
        pruefe(`${k.id} Aussage`, k.text, kap);
        if (kurz.has(k.id)) pruefe(`${k.id} Erklärung`, kurz.get(k.id), kap);
        for (const c of karten.get(k.id) ?? []) pruefe(`${c.id} Karte`, `${c.vorne}\n${c.hinten}`, kap);
      }
      for (const ku of sp.kuer ?? []) {
        const kap = (ku.quellen ?? []).filter((q) => q.startsWith('buch:')).map((q) => q.slice(5));
        if (kap.length) { geprueft++; pruefe(`${sp.id} Kür`, ku.text, kap); }
      }
    }
  }
}
console.log(`K5 (${N} Wörter): ${geprueft} ${KERN ? 'Kernpunkt-Felder' : 'Buch-Aussagen/Kür'} geprüft, ${treffer.length} Treffer`);
for (const t of treffer.slice(0, 200)) console.log('  - ' + t);
if (treffer.length) process.exitCode = 1;
