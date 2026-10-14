// Wohnort der AP2-Bausteine (Parkplatz P3, W2): PB1, PB2, PROJEKT oder keiner (G5).
// Daten: umbau/regeln/raeume-ap2.json (je Katalogpunkt, Spiegelstriche erben, Ausnahmen je Spiegelstrich).
//
// Aufruf:  node tools/umbau/raeume-ap2.mjs        prüft die Datei gegen das Fundament und zeigt die Verteilung
// Import:  import { raumVon, raeume } from './raeume-ap2.mjs'

import { readFileSync } from 'node:fs';

const DATEI = 'umbau/regeln/raeume-ap2.json';
const daten = JSON.parse(readFileSync(DATEI, 'utf8'));

/** Punkt-ID eines AP2-Bausteins: AP2b.05.03.2.1 → AP2b.05.03 */
const punktVon = (id) => id.split('.').slice(0, 3).join('.');

/** { raum, gebiet, grund, quelle } für einen AP2-Baustein (Katalogpunkt oder Spiegelstrich), sonst null */
export function raumVon(id) {
  if (!/^AP2[ab]\./.test(id)) return null;
  const p = daten.punkte[punktVon(id)];
  if (!p) return null;
  const a = p.ausnahmen?.[id];
  if (a) return { ...a, quelle: `ausnahme:${id}` };
  return { raum: p.raum, gebiet: p.gebiet, grund: p.grund, quelle: `punkt:${punktVon(id)}` };
}

/** alle abdeckungspflichtigen Bausteine eines Raums (PB1, PB2, PROJEKT, keiner) */
export function raeume(fundament) {
  const r = {};
  for (const id of fundament.abdeckungspflichtig.filter((x) => /^AP2/.test(x))) {
    const z = raumVon(id);
    const k = z?.raum ?? 'FEHLT';
    (r[k] ??= []).push(id);
  }
  return r;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const b = JSON.parse(readFileSync('umbau/fundament/katalog-bausteine.json', 'utf8'));
  const fehler = [];
  const punkte = new Set(b.punkte.filter((p) => p.id.startsWith('AP2')).map((p) => p.id));
  const alle = new Set([...punkte, ...b.spiegelstriche.map((s) => s.id)]);
  for (const p of punkte) if (!daten.punkte[p]) fehler.push(`Katalogpunkt ${p} fehlt in ${DATEI}`);
  for (const [p, z] of Object.entries(daten.punkte)) {
    if (!punkte.has(p)) fehler.push(`${p} ist kein AP2-Katalogpunkt`);
    if (!['PB1', 'PB2', 'PROJEKT', 'keiner'].includes(z.raum)) fehler.push(`${p}: unbekannter Raum ${z.raum}`);
    if (!z.grund) fehler.push(`${p}: Begründung fehlt`);
    if (/^PB[12]$/.test(z.raum) && !z.gebiet?.startsWith(`G.${z.raum}.`)) fehler.push(`${p}: Gebiet ${z.gebiet} passt nicht zu ${z.raum}`);
    for (const [s, a] of Object.entries(z.ausnahmen ?? {})) {
      if (!alle.has(s) || punktVon(s) !== p) fehler.push(`${p}: Ausnahme ${s} ist kein Spiegelstrich dieses Punkts`);
      if (/^PB[12]$/.test(a.raum) && !a.gebiet?.startsWith(`G.${a.raum}.`)) fehler.push(`${s}: Gebiet ${a.gebiet} passt nicht zu ${a.raum}`);
      if (!a.grund) fehler.push(`${s}: Begründung fehlt`);
    }
  }
  const r = raeume(b);
  if (r.FEHLT) fehler.push(`ohne Raum: ${r.FEHLT.join(', ')}`);
  const n = Object.values(r).reduce((a, x) => a + x.length, 0);
  console.log(`AP2: ${n} abdeckungspflichtige Bausteine → ` + Object.entries(r).map(([k, v]) => `${k} ${v.length}`).join(', '));
  for (const f of fehler) console.log(`FEHLER ${f}`);
  if (fehler.length) process.exitCode = 1; else console.log('OK – jeder AP2-Baustein hat genau einen Raum (P3).');
}
