// Regelwerk v2.x: Eine Buch-Aussage ist nach einer Entscheidung des Projektinhabers keine Pflicht mehr → Aussage aus
// `koennen` entfernen, als Kür am selben Stichpunkt eintragen (Quelle buch:<Band>-<Kapitel>), Erklärung und Karten
// (samt Protokolleintrag) entfernen, Hinweis-Abgleich (R3) und Geschwister (R4) nachziehen, meta.v2 vermerken und
// die lokale Kernpunkt-Liste (quellen/lehrbuch/kern, nie committet) von „aussage“ auf „kuer“ umstellen.
// Nur für reine Buch-Aussagen aus meta.v2[].neue_aussagen; bestehende Aussagen bleiben unangetastet (D6).
// Aufruf: node tools/umbau/v2-pflicht-zu-kuer.mjs <Aussage-ID> "<Kür-Text>" "<kurz>" "<Grund>"
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';

const [id, kuerText, kuerKurz, grund] = process.argv.slice(2);
if (!id || !kuerText || !kuerKurz || !grund) throw new Error('Aufruf: <Aussage-ID> "<Kür-Text>" "<kurz>" "<Grund>"');
const spId = id.replace(/-K\d+$/, '');
const raum = id.split('-')[0].toLowerCase();
const ordner = id.split('-').slice(0, 2).join('-');

const lesen = (p) => { const t = readFileSync(p, 'utf8'); const j = JSON.parse(t); return { j, ind: [1, 2, 4].find((n) => JSON.stringify(j, null, n) === t.replace(/\n$/, '')) ?? 2, nl: t.endsWith('\n') ? '\n' : '' }; };
const schreiben = (p, { j, ind, nl }) => writeFileSync(p, JSON.stringify(j, null, ind) + nl);

// Lernplan
const pLp = `umbau/lernplan/${raum}/${ordner}.json`;
const lp = lesen(pLp);
const sp = lp.j.themenbloecke.flatMap((t) => t.stichpunkte).find((s) => s.id === spId);
if (!sp) throw new Error(`Stichpunkt ${spId} fehlt`);
const i = sp.koennen.findIndex((k) => k.id === id);
if (i < 0) throw new Error(`Aussage ${id} fehlt`);
const v2Neu = (lp.j.meta.v2 ?? []).find((v) => v.neue_aussagen?.includes(id));
if (!v2Neu) throw new Error(`${id} ist keine neue Buch-Aussage (meta.v2[].neue_aussagen) – bestehende Aussagen bleiben (D6)`);
const [weg] = sp.koennen.splice(i, 1);
if (!weg.herkunft.every((h) => h.startsWith('buch:'))) throw new Error(`${id} hat nicht nur Buch-Herkunft: ${weg.herkunft.join(', ')}`);
const quellen = [...new Set(weg.herkunft.map((h) => h.replace(/-S\d+$/, '')))];
(sp.kuer ??= []).push({ text: kuerText, kurz: kuerKurz, quellen, grund });
for (const q of quellen) {
  const [band, kap] = q.slice(5).split(/-(.*)/s);
  lp.j.meta.hinweisquellen[q] ??= `Lehrbuch Westermann „IT-Berufe“ ${band} ${kap} (nur lokal unter quellen/lehrbuch/, E10/D9); Regelwerk v2.0, D8/RK1: Buch-Themen ohne Pflicht als Kür`;
}
v2Neu.neue_aussagen = v2Neu.neue_aussagen.filter((x) => x !== id);
const v2 = lp.j.meta.v2.at(-1);
v2.kuer.push(spId);
(v2.pflicht_gestrichen ??= []).push({ id, text: weg.text, grund });
for (const t of lp.j.meta.hinweisabgleich?.themen ?? []) {
  if (!t.wo?.includes(id)) continue;
  t.wo = t.wo.filter((w) => w !== id);
  if (!t.wo.length) { t.ring = 'Kür'; t.wo = [spId]; }
  t.notiz = `${t.notiz ? t.notiz + '; ' : ''}${id} ist Kür (${grund})`;
}
for (const g of lp.j.meta.geschwister ?? []) for (const [seite, ids] of Object.entries(g.abgedeckt ?? {})) {
  if (!ids.includes(id)) continue;
  g.abgedeckt[seite] = ids.filter((x) => x !== id);
  if (!g.abgedeckt[seite].length) throw new Error(`R4: ${g.katalog} (${g.paar}) „${seite}“ hätte keine Aussage mehr`);
}
schreiben(pLp, lp);

// Erklärung
const pKurz = `umbau/kurz/${raum}/${ordner}.json`;
if (existsSync(pKurz)) {
  const ku = lesen(pKurz);
  for (const v of Object.values(ku.j)) if (v && typeof v === 'object' && id in v) delete v[id];
  schreiben(pKurz, ku);
}

// Karten und Protokoll
const pKarten = `umbau/karten/${raum}/${ordner}.json`;
const ka = lesen(pKarten);
const kartenIds = new Set(ka.j.karten.filter((c) => c.k === id).map((c) => c.id));
ka.j.karten = ka.j.karten.filter((c) => c.k !== id);
const prot = ka.j.protokoll ?? [];
for (const e of prot.filter((p) => kartenIds.has(p.id) && p.entscheidung !== 'neu')) throw new Error(`Karte ${e.id} war schon vorher da (${e.entscheidung}) – von Hand klären`);
ka.j.protokoll = prot.filter((p) => !kartenIds.has(p.id));
schreiben(pKarten, ka);

// Lokale Kernpunkt-Liste
let kern = 0;
for (const band of existsSync('quellen/lehrbuch/kern') ? readdirSync('quellen/lehrbuch/kern') : []) {
  for (const f of readdirSync(`quellen/lehrbuch/kern/${band}`)) {
    const p = `quellen/lehrbuch/kern/${band}/${f}`;
    const k = JSON.parse(readFileSync(p, 'utf8'));
    let geaendert = false;
    for (const kp of k.kernpunkte ?? []) if (kp.aussage === id) { delete kp.aussage; kp.kuer = spId; geaendert = true; kern++; }
    if (geaendert) writeFileSync(p, JSON.stringify(k, null, 1));
  }
}
console.log(`${id} → Kür an ${spId} (${quellen.join(', ')}), ${kartenIds.size} Karten entfernt, ${kern} Kernpunkte auf Kür`);
