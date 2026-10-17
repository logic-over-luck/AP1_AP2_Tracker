// Baut die geprüfte Zuordnung „Stichpunkt × Prüfung“ für die Wichtigkeit (UMBAU.md P73).
//
// Aufruf:  node tools/umbau/wichtigkeit-zuordnung.mjs
// Liest:   umbau/lernplan/<raum>/*.json            Zuordnung A (Feld teilaufgaben je Stichpunkt, beim Bau entstanden)
//          umbau/zuordnung/wichtigkeit/blind-<RAUM>.json    Zuordnung B (blind, ohne A zu kennen, an den Abschriften)
//          umbau/zuordnung/wichtigkeit/schied-<RAUM>.json   Schiedssprüche für die Paare, bei denen A und B uneinig sind
// Schreibt: umbau/zuordnung/wichtigkeit.json
//
// Regel: Ein Paar Stichpunkt × Prüfung zählt, wenn A und B es beide nennen (B mit Kern oder Rand), oder wenn der
// Schiedsspruch es bestätigt. Dazu die Gegenprobe mit den Podcast-Stichworten (podcast-<RAUM>.json, P74): „ergaenzt“
// fügt ein Paar mit Teilaufgabe hinzu; „nur_stichwort“ belegt eine Prüfung ohne (vollständige) Abschrift mit einer
// Stichwort-ID <Termin>-…-podcast-<Wort> (halbes Gewicht); „anderer_raum“ landet unter „quer“ (nur Anzeige). Belegt wird es durch Teilaufgaben-IDs. Nur IDs und eigene Worte, keine Prüfungstexte (E10).
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

// Prüfungen, deren Abschrift unvollständig ist (UMBAU.md P14): dort dürfen Podcast-Stichworte den fehlenden Teil belegen
const UNVOLLSTAENDIG = new Set(['2025H']);
const slug = (w) => w.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const stichwortId = (r, p, w) => `${p}-${r === 'AP1' ? '' : `${r}-`}podcast-${slug(w)}`;
const quer = {};
const setzeQuer = (spRaum, sp, pRaum, p, tas) => {
  const z = (((quer[spRaum] ??= {})[sp] ??= {})[pRaum] ??= {});
  z[p] = [...new Set([...(z[p] ?? []), ...tas])].sort();
};
const alleSp = new Map();
for (const r of RAEUME) for (const s of ladeLernplanAp1(wurzel, RAEUME_VORSCHAU[r]).flatMap((p) => p.themenbloecke.flatMap((t) => t.stichpunkte))) alleSp.set(s.id, r);

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
  // Gegenprobe mit den Themen-Stichworten des IT-Berufe-Podcasts (UMBAU.md P74)
  const podcastDatei = path.join(ordner, `podcast-${r}.json`);
  const pz = { stichworte: 0, gedeckt: 0, ergaenzt: 0, nur_stichwort: 0, anderer_raum: 0, ausserhalb: 0, passt_nicht: 0, ohne_stichpunkt: 0 };
  if (fs.existsSync(podcastDatei)) {
    const termineMitAbschrift = new Set([...zuordnung.keys()].map((t) => t.split('-')[0]));
    for (const [p, worte] of Object.entries(lies(podcastDatei)))
      for (const [w, x] of Object.entries(worte)) {
        pz.stichworte++;
        pz[x.status] = (pz[x.status] ?? 0) + 1;
        const sps = x.sp ?? [];
        if (x.status === 'gedeckt') {
          for (const sp of sps) if (!ergebnis[sp]?.[p]) fehler.push(`${r} ${p} „${w}“: als gedeckt gemeldet, aber kein geprüftes Paar ${sp}`);
        } else if (x.status === 'ergaenzt') {
          const tas = (x.ta ?? []).filter((t) => zaehlbar(t) && t.startsWith(`${p}-`));
          if (!tas.length || !sps.length) fehler.push(`${r} ${p} „${w}“: ergänzt ohne gültige Teilaufgabe oder Stichpunkt`);
          for (const sp of sps) {
            if (!spIds.has(sp)) fehler.push(`${r} ${p} „${w}“: unbekannter Stichpunkt ${sp}`);
            else setze(`${sp}|${p}`, new Set([...(ergebnis[sp]?.[p] ?? []), ...tas]));
          }
        } else if (x.status === 'nur_stichwort') {
          if (termineMitAbschrift.has(p) && !UNVOLLSTAENDIG.has(p)) fehler.push(`${r} ${p} „${w}“: nur_stichwort, obwohl die Abschrift vollständig ist`);
          if (sps.length > 1) fehler.push(`${r} ${p} „${w}“: nur_stichwort mit mehr als einem Stichpunkt`);
          if (!sps.length) pz.ohne_stichpunkt++;
          for (const sp of sps) {
            if (!spIds.has(sp)) fehler.push(`${r} ${p} „${w}“: unbekannter Stichpunkt ${sp}`);
            else if (!ergebnis[sp]?.[p]) setze(`${sp}|${p}`, [stichwortId(r, p, w)]);
          }
        } else if (x.status === 'anderer_raum') {
          const tas = (x.ta ?? []).filter((t) => t.startsWith(`${p}-`) && zuordnung.has(t));
          for (const sp of sps) {
            const spRaum = alleSp.get(sp);
            if (!spRaum || spRaum === r) fehler.push(`${r} ${p} „${w}“: anderer_raum mit Stichpunkt ${sp} aus ${spRaum ?? 'keinem Raum'}`);
            else setzeQuer(spRaum, sp, r, p, tas.length ? tas : [stichwortId(r, p, w)]);
          }
        }
      }
  }
  zaehlung[r] = { podcast: pz };

  aus[r] = Object.fromEntries(Object.entries(ergebnis).sort(([x], [y]) => x.localeCompare(y, 'de', { numeric: true })).map(([sp, p]) => [sp, Object.fromEntries(Object.entries(p).sort())]));
  zaehlung[r] = { ...zaehlung[r], teilaufgaben: zuordnung.size, paare_A: pa.size, paare_B: pb.size, einig, strittig: bestaetigt + verworfen, bestaetigt, verworfen, paare: Object.values(ergebnis).reduce((a, x) => a + Object.keys(x).length, 0), ergebnis: einig + bestaetigt };
}

aus.meta = {
  stand: new Date().toISOString().slice(0, 10),
  erzeugt_mit: 'node tools/umbau/wichtigkeit-zuordnung.mjs',
  hinweis:
    'Geprüfte Zuordnung Stichpunkt × Prüfung für die Wichtigkeit (src/daten/wichtigkeit.js, UMBAU.md P73). Je Raum: Stichpunkt → Prüfung → Teilaufgaben, die den Beleg tragen. Zählt, wenn Zuordnung A (Lernplan, Feld teilaufgaben) und die blinde Zuordnung B (umbau/zuordnung/wichtigkeit/blind-*.json) das Paar beide nennen oder der Schiedsspruch (schied-*.json) es bestätigt. Nur IDs.',
  zaehlung,
};
aus.quer = quer;
aus.entscheide = entscheide;

if (fehler.length) {
  console.error(`${fehler.length} Fehler:`);
  for (const f of fehler.slice(0, 40)) console.error(`  ${f}`);
  process.exit(1);
}
fs.writeFileSync(path.join(wurzel, 'umbau', 'zuordnung', 'wichtigkeit.json'), `${JSON.stringify(aus, null, 1)}\n`);
for (const [r, z] of Object.entries(zaehlung))
  console.log(`${r.padEnd(5)} Paare A ${z.paare_A}, B ${z.paare_B}; einig ${z.einig}, strittig ${z.strittig} (bestätigt ${z.bestaetigt}, verworfen ${z.verworfen}) → ${z.ergebnis}; mit Podcast ${z.paare} · Podcast ${JSON.stringify(z.podcast)}`);
console.log('geschrieben: umbau/zuordnung/wichtigkeit.json');
