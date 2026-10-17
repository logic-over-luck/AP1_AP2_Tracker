// Baut die geprüfte Zuordnung „Stichpunkt × Prüfung“ für die Wichtigkeit (UMBAU.md P73).
//
// Aufruf:  node tools/umbau/wichtigkeit-zuordnung.mjs
// Liest:   umbau/lernplan/<raum>/*.json            Zuordnung A (Feld teilaufgaben je Stichpunkt, beim Bau entstanden)
//          umbau/zuordnung/wichtigkeit/blind-<RAUM>.json    Zuordnung B (blind, ohne A zu kennen, an den Abschriften)
//          umbau/zuordnung/wichtigkeit/schied-<RAUM>.json   Schiedssprüche für die Paare, bei denen A und B uneinig sind
// Schreibt: umbau/zuordnung/wichtigkeit.json
//
// Regel: Ein Paar Stichpunkt × Prüfung zählt, wenn A und B es beide nennen (B mit Kern oder Rand), oder wenn der
// Schiedsspruch es bestätigt. Belegt wird es durch Teilaufgaben-IDs. Nur IDs und eigene Worte, keine Prüfungstexte (E10).
// Das Feld teilaufgaben im Lernplan bleibt unverändert: Es belegt Inhalt und Tiefe der Aussagen; diese Datei beantwortet
// nur, wo ein Stichpunkt im Kern geprüft wurde.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RAEUME_VORSCHAU, ladeLernplanAp1 } from '../vorschau-ap1.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const ordner = path.join(wurzel, 'umbau', 'zuordnung', 'wichtigkeit');
const RAEUME = ['AP1', 'PB1', 'PB2', 'WISO'];
const lies = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const fehler = [];

// Paare aus einer Zuordnung Teilaufgabe → Stichpunkte
function paare(taZuSp) {
  const m = new Map();
  for (const [ta, sps] of taZuSp)
    for (const sp of sps) {
      const k = `${sp}|${ta.split('-')[0]}`;
      (m.get(k) ?? m.set(k, new Set()).get(k)).add(ta);
    }
  return m;
}

const aus = { meta: null };
const entscheide = [];
const zaehlung = {};
for (const r of RAEUME) {
  const cfg = RAEUME_VORSCHAU[r];
  const sps = ladeLernplanAp1(wurzel, cfg).flatMap((p) => p.themenbloecke.flatMap((t) => t.stichpunkte));
  const spIds = new Set(sps.map((s) => s.id));
  const zuordnung = new Map();
  const zdir = path.join(wurzel, 'umbau', 'zuordnung', cfg.dir);
  for (const f of fs.readdirSync(zdir).filter((f) => f.endsWith('.json'))) for (const [id, t] of Object.entries(lies(path.join(zdir, f)).teilaufgaben)) zuordnung.set(id, t);

  const a = new Map();
  for (const s of sps) for (const ta of s.teilaufgaben ?? []) if (zuordnung.get(ta)?.bausteine?.length) (a.get(ta) ?? a.set(ta, []).get(ta)).push(s.id);
  const blind = lies(path.join(ordner, `blind-${r}.json`));
  // Teilaufgaben, die laut Zuordnung begründet außerhalb liegen (z. B. B3: aus dem Katalog gestrichen), zählen nie
  const zaehlbar = (ta) => !!zuordnung.get(ta)?.bausteine?.length;
  const b = new Map(Object.entries(blind).filter(([ta]) => zaehlbar(ta)).map(([ta, x]) => [ta, [...(x.haupt ?? []), ...(x.rand ?? [])]]));
  for (const ta of zuordnung.keys()) if (!blind[ta]) fehler.push(`${r}: Teilaufgabe ${ta} fehlt in blind-${r}.json`);
  for (const [ta, list] of b) {
    if (!zuordnung.has(ta)) fehler.push(`${r}: blind-${r}.json nennt unbekannte Teilaufgabe ${ta}`);
    for (const sp of list) if (!spIds.has(sp)) fehler.push(`${r}: blind-${r}.json, ${ta}: unbekannter Stichpunkt ${sp}`);
  }

  const pa = paare(a);
  const pb = paare(b);
  const schied = fs.existsSync(path.join(ordner, `schied-${r}.json`)) ? lies(path.join(ordner, `schied-${r}.json`)) : [];
  const spruch = new Map(schied.map((x) => [`${x.sp}|${x.pruefung}`, x]));

  const ergebnis = {};
  const setze = (k, tas) => {
    const [sp, p] = k.split('|');
    ((ergebnis[sp] ??= {})[p] = [...tas].sort());
  };
  let einig = 0;
  let bestaetigt = 0;
  let verworfen = 0;
  for (const k of new Set([...pa.keys(), ...pb.keys()])) {
    if (pa.has(k) && pb.has(k)) {
      einig++;
      setze(k, new Set([...pa.get(k), ...pb.get(k)]));
      continue;
    }
    const x = spruch.get(k);
    if (!x) {
      fehler.push(`${r}: strittiges Paar ${k} (${pa.has(k) ? 'nur A' : 'nur B'}) ohne Schiedsspruch`);
      continue;
    }
    const seite = pa.has(k) ? 'A' : 'B';
    entscheide.push({ raum: r, sp: x.sp, pruefung: x.pruefung, nur: seite, zaehlt: x.zaehlt, ta: x.ta, grund: x.grund });
    if (x.zaehlt) {
      bestaetigt++;
      const erlaubt = (pa.get(k) ?? pb.get(k));
      const tas = x.ta.filter((t) => erlaubt.has(t));
      if (!tas.length) fehler.push(`${r}: Schiedsspruch ${k} zählt, nennt aber keine der strittigen Teilaufgaben`);
      setze(k, tas.length ? tas : erlaubt);
    } else verworfen++;
  }
  const ueberzaehlig = [...spruch.keys()].filter((k) => pa.has(k) === pb.has(k));
  if (ueberzaehlig.length) console.log(`${r}: ${ueberzaehlig.length} Schiedssprüche ohne Wirkung (Paar nicht mehr strittig, z. B. Teilaufgabe außerhalb): ${ueberzaehlig.join(', ')}`);
  aus[r] = Object.fromEntries(Object.entries(ergebnis).sort(([x], [y]) => x.localeCompare(y, 'de', { numeric: true })).map(([sp, p]) => [sp, Object.fromEntries(Object.entries(p).sort())]));
  zaehlung[r] = { teilaufgaben: zuordnung.size, paare_A: pa.size, paare_B: pb.size, einig, strittig: bestaetigt + verworfen, bestaetigt, verworfen, ergebnis: einig + bestaetigt };
}

aus.meta = {
  stand: new Date().toISOString().slice(0, 10),
  erzeugt_mit: 'node tools/umbau/wichtigkeit-zuordnung.mjs',
  hinweis:
    'Geprüfte Zuordnung Stichpunkt × Prüfung für die Wichtigkeit (src/daten/wichtigkeit.js, UMBAU.md P73). Je Raum: Stichpunkt → Prüfung → Teilaufgaben, die den Beleg tragen. Zählt, wenn Zuordnung A (Lernplan, Feld teilaufgaben) und die blinde Zuordnung B (umbau/zuordnung/wichtigkeit/blind-*.json) das Paar beide nennen oder der Schiedsspruch (schied-*.json) es bestätigt. Nur IDs.',
  zaehlung,
};
aus.entscheide = entscheide;

if (fehler.length) {
  console.error(`${fehler.length} Fehler:`);
  for (const f of fehler.slice(0, 40)) console.error(`  ${f}`);
  process.exit(1);
}
fs.writeFileSync(path.join(wurzel, 'umbau', 'zuordnung', 'wichtigkeit.json'), `${JSON.stringify(aus, null, 1)}\n`);
for (const [r, z] of Object.entries(zaehlung))
  console.log(`${r.padEnd(5)} Paare A ${z.paare_A}, B ${z.paare_B}; einig ${z.einig}, strittig ${z.strittig} (bestätigt ${z.bestaetigt}, verworfen ${z.verworfen}) → ${z.ergebnis}`);
console.log('geschrieben: umbau/zuordnung/wichtigkeit.json');
