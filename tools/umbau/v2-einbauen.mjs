// Regelwerk v2.0, Schritt 3+4: baut einen Ordner-Patch mit Buch-Aussagen in Lernplan, Kurzfassung und Karten ein.
//
// Aufruf:  node tools/umbau/v2-einbauen.mjs <patch.json> [--trocken]
//
// Der Patch (von der bauenden Sitzung geschrieben, eigene Worte, D9) hat die Form
// {
//   "ordner": "AP1-4",
//   "neue_stichpunkte": [{ "ref": "S1", "block": "AP1-4-1", "nach": "AP1-4-1-2", "titel": "…", "ziel": "…",
//                          "bausteine": [{ "id": "AP1.03.03.1", "anteil": "…" }], "gebiete": ["G.AP1.02"],
//                          "teaser": "…", "begruendung": "…" }],
//   "neue_aussagen": [{ "ref": "A1", "sp": "AP1-4-1-2" | "S1", "text": "Du kannst …", "kurz": "Cache-Stufen", "stufe": 2,
//                       "herkunft": ["buch:GS-2.4.3-S157"], "kernpunkte": ["GS-2.4.3#3"],
//                       "erklaerung": "…", "karten": [{ "vorne": "…", "hinten": "…" }] }],
//   "d6": [{ "aussage": "AP1-4-1-2-K1", "herkunft": "buch:GS-2.4.3-S157", "kernpunkte": ["GS-2.4.3#1"] }],
//   "kuer": [{ "sp": "AP1-4-1-2", "text": "…", "kurz": "…", "quelle": "buch:FS2-2.1.4", "grund": "…", "kernpunkte": ["…#2"] }],
//   "grenzen_gestrichen": [{ "sp": "AP1-4-1-2", "text_beginnt": "…", "grund": "D3: …" }],
//   "filter": [{ "kernpunkt": "GS-2.4.3#7", "filter": "hersteller", "grund": "…" }],
//   "umgehaengt": [{ "kernpunkt": "GS-2.4.3#8", "stichpunkt": "PB1-11-1-2", "grund": "…" }]
// }
// Kernpunkt-Verweis: <Band>-<Kapitel>#<Nummer ab 1> in quellen/lehrbuch/kern/<Band>/<Kapitel>.json.
//
// Was das Skript tut (mechanisch, ohne Ermessen):
//  - neue Stichpunkte mit der nächsten nie vergebenen Nummer im Block (P15/P48), hinter „nach“
//  - neue Aussagen mit der nächsten nie vergebenen K-Nummer des Stichpunkts (alte Inhaltsdatei, alt_neu, Umzug, Plan)
//  - D6: Buch-Herkunft an bestehende Aussagen anhängen (Text bleibt)
//  - Kür mit Hinweisquelle buch:… (R2: in meta.hinweisquellen beschrieben, R3: im Hinweis-Abgleich als Kür)
//  - Grenzen streichen (D3), R3-Einträge „Außen“, die danach ins Leere zeigen, werden „Kern“ auf die neuen Aussagen
//  - Kurzfassung: Teaser neuer Stichpunkte, Erklärung je neuer Aussage; Karten „<K-ID>-n“ mit Protokoll „neu“
//  - Kernpunkt-Dateien: neu → aussage / kuer / filter / umgehängt (neuer stichpunkt, bleibt neu)
//  - meta.v2 im Lernplan: Protokoll des Einbaus

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';

const [patchDatei] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const TROCKEN = process.argv.includes('--trocken');
if (!patchDatei) { console.error('Aufruf: node tools/umbau/v2-einbauen.mjs <patch.json> [--trocken]'); process.exit(2); }
const patch = JSON.parse(readFileSync(patchDatei, 'utf8'));
const ORDNER = patch.ordner;
const TEIL = ORDNER.split('-')[0];
const RAUM = TEIL.toLowerCase();
const KERN = process.env.BUCH_KERN ?? 'quellen/lehrbuch/kern';
const regeln = JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8'));
const BUCH = new RegExp(regeln.buch.herkunft.regex);
const HEUTE = new Date().toISOString().slice(0, 10);

const lpDatei = `umbau/lernplan/${RAUM}/${ORDNER}.json`;
const kurzDatei = `umbau/kurz/${RAUM}/${ORDNER}.json`;
const kartenDatei = `umbau/karten/${RAUM}/${ORDNER}.json`;
// Schreibweise der Datei beibehalten (Einrückung 1 oder 2, Zeilenende am Schluss), damit der Diff nur den Inhalt zeigt
const stil = new Map();
const lies = (datei) => {
  const t = readFileSync(datei, 'utf8');
  const d = JSON.parse(t);
  const indent = [1, 2, 4].find((n) => JSON.stringify(d, null, n) === t.replace(/\n$/, '')) ?? 2;
  stil.set(datei, { indent, nl: t.endsWith('\n') ? '\n' : '' });
  return d;
};
const schreibe = (datei, d) => { const s = stil.get(datei) ?? { indent: 1, nl: '\n' }; writeFileSync(datei, JSON.stringify(d, null, s.indent) + s.nl); };
const lp = lies(lpDatei);
const kurz = lies(kurzDatei);
const karten = lies(kartenDatei);

const fehler = [];
const F = (s) => fehler.push(s);

// ---------- vergebene IDs (nie neu vergeben) ----------
const vergeben = new Set();
const alt = JSON.parse(readFileSync('Inhaltsdatei_AP1_AP2_tracker.json', 'utf8'));
for (const s of alt.stichpunkte) { vergeben.add(s.id); for (const k of s.koennen) vergeben.add(k.id); }
for (const t of alt.struktur ?? []) for (const o of t.ordner ?? []) for (const b of o.bloecke ?? []) vergeben.add(b.id);
if (existsSync('umbau/umzug.json')) {
  const u = JSON.parse(readFileSync('umbau/umzug.json', 'utf8'));
  for (const t of ['koennen', 'stichpunkte', 'bloecke']) for (const [a, n] of Object.entries(u[t] ?? {})) { vergeben.add(a); if (typeof n === 'string') vergeben.add(n); }
}
for (const r of readdirSync('umbau/lernplan')) for (const f of readdirSync(`umbau/lernplan/${r}`).filter((x) => x.endsWith('.json'))) {
  const l = f === `${ORDNER}.json` ? lp : JSON.parse(readFileSync(`umbau/lernplan/${r}/${f}`, 'utf8'));
  for (const a of l.alt_neu?.koennen ?? []) { vergeben.add(a.alt); if (a.neu) vergeben.add(a.neu); }
  for (const tb of l.themenbloecke) { vergeben.add(tb.id); for (const s of tb.stichpunkte) { vergeben.add(s.id); for (const k of s.koennen) vergeben.add(k.id); } }
}
for (const c of karten.karten) vergeben.add(c.k);
const naechste = (prefix, trenner) => {
  let n = 0;
  for (const id of vergeben) {
    if (!id.startsWith(prefix + trenner)) continue;
    const m = id.slice(prefix.length + trenner.length).match(/^(\d+)$/);
    if (m) n = Math.max(n, Number(m[1]));
  }
  const id = `${prefix}${trenner}${n + 1}`;
  vergeben.add(id);
  return id;
};

const spListe = () => lp.themenbloecke.flatMap((tb) => tb.stichpunkte);
const spVon = (id) => spListe().find((s) => s.id === id);

// ---------- Kernpunkt-Dateien ----------
const kernCache = new Map();
function kernpunkt(ref) {
  const m = ref.match(/^(GS|FS2|FS)-([\d.]+)#(\d+)$/);
  if (!m) { F(`Kernpunkt-Verweis ${ref} ungültig`); return null; }
  const datei = `${KERN}/${m[1]}/${m[2]}.json`;
  if (!kernCache.has(datei)) {
    if (!existsSync(datei)) { F(`Kernpunkt-Datei ${datei} fehlt`); return null; }
    kernCache.set(datei, JSON.parse(readFileSync(datei, 'utf8')));
  }
  const d = kernCache.get(datei);
  const kp = d.kernpunkte?.[Number(m[3]) - 1];
  if (!kp) { F(`${ref}: Kernpunkt gibt es nicht`); return null; }
  return { d, kp, kapitel: `${m[1]}-${m[2]}` };
}
const setzeStatus = (kp, art, wert) => { for (const x of ['aussage', 'neu', 'filter', 'kuer', 'stichpunkt', 'katalog', 'operator', 'vorschlag']) if (x !== 'stichwort') delete kp[x]; kp[art] = wert; };

const protokoll = { stand: HEUTE, regelwerk: regeln.version, neue_aussagen: [], neue_stichpunkte: [], d6: [], kuer: [], grenzen_gestrichen: [], filter: [], umgehaengt: [] };

// ---------- neue Themenblöcke (F4 seit v2.1: 3–8 Stichpunkte, sonst teilen; P55) ----------
const refTb = new Map();
for (const nb of patch.neue_bloecke ?? []) {
  const id = naechste(ORDNER, '-');
  const pos = lp.themenbloecke.findIndex((t) => t.id === nb.nach);
  lp.themenbloecke.splice(pos >= 0 ? pos + 1 : lp.themenbloecke.length, 0, { id, titel: nb.titel, satz: nb.satz ?? '', stichpunkte: [] });
  refTb.set(nb.ref, id);
  protokoll.neue_bloecke ??= [];
  protokoll.neue_bloecke.push({ id, nach: nb.nach ?? null, begruendung: nb.begruendung ?? '' });
}

// ---------- neue Stichpunkte ----------
const refSp = new Map();
for (const ns of patch.neue_stichpunkte ?? []) {
  const tb = lp.themenbloecke.find((t) => t.id === (refTb.get(ns.block) ?? ns.block));
  if (!tb) { F(`neuer Stichpunkt ${ns.ref}: Block ${ns.block} gibt es nicht`); continue; }
  if (!ns.bausteine?.length) F(`neuer Stichpunkt ${ns.ref}: ohne Katalog-Baustein (D8)`);
  const id = naechste(tb.id, '-');
  const vorbild = spVon(ns.nach) ?? tb.stichpunkte.at(-1);
  const sp = { id, titel: ns.titel, ziel: ns.ziel, gebiete: ns.gebiete?.length ? ns.gebiete : vorbild.gebiete, bausteine: ns.bausteine, teilaufgaben: [], koennen: [], grenzen: [], kuer: [] };
  const pos = tb.stichpunkte.findIndex((s) => s.id === ns.nach);
  tb.stichpunkte.splice(pos >= 0 ? pos + 1 : tb.stichpunkte.length, 0, sp);
  refSp.set(ns.ref, id);
  if (ns.teaser) kurz.teaser[id] = ns.teaser; else F(`neuer Stichpunkt ${ns.ref}: Teaser fehlt`);
  protokoll.neue_stichpunkte.push({ id, nach: ns.nach ?? null, begruendung: ns.begruendung ?? '' });
}
const spId = (x) => refSp.get(x) ?? x;

// ---------- neue Aussagen ----------
const refK = new Map();
const opStufe = { ...regeln.operatoren, ...regeln.pruefungsoperatoren.stufen };
for (const na of patch.neue_aussagen ?? []) {
  const sp = spVon(spId(na.sp));
  if (!sp) { F(`Aussage ${na.ref}: Stichpunkt ${na.sp} gibt es im Ordner nicht`); continue; }
  if (!na.text?.startsWith('Du kannst ')) F(`Aussage ${na.ref}: beginnt nicht mit „Du kannst“`);
  if (![1, 2, 3, 4].includes(na.stufe)) F(`Aussage ${na.ref}: Stufe ${na.stufe}`);
  if (!na.herkunft?.length || !na.herkunft.every((h) => h.startsWith('buch:') ? BUCH.test(h.slice(5)) : /^(katalog|beleg|regel):/.test(h))) F(`Aussage ${na.ref}: Herkunft ungültig (${na.herkunft})`);
  if (!na.erklaerung?.trim()) F(`Aussage ${na.ref}: Erklärung fehlt`);
  // v2.2: Stichwort kurz (Prüfung der Form in lernplan-pruefen) und höchstens 200 Zeichen je Buch-Aussage ab PB1
  if (!na.kurz?.trim()) F(`Aussage ${na.ref}: kurz fehlt (v2.2)`);
  const max = !ORDNER.startsWith('AP1-') ? regeln.buch?.form?.buch_aussage_max : null;
  if (max && na.text?.length > max) F(`Aussage ${na.ref}: ${na.text.length} Zeichen (höchstens ${max}; Begründung und Beispiel in die Erklärung)`);
  if (!na.karten?.length || na.karten.some((c) => !c.vorne?.trim() || !c.hinten?.trim())) F(`Aussage ${na.ref}: Karte fehlt oder unvollständig`);
  const id = naechste(sp.id, '-K');
  const k = { id, text: na.text, ...(na.kurz ? { kurz: na.kurz } : {}), stufe: na.stufe, herkunft: na.herkunft };
  sp.koennen.push(k);
  refK.set(na.ref, id);
  kurz.erklaerung[id] = na.erklaerung;
  na.karten.forEach((c, i) => {
    const kid = `${id}-${i + 1}`;
    karten.karten.push({ id: kid, sp: sp.id, k: id, vorne: c.vorne, hinten: c.hinten });
    karten.protokoll.push({ id: kid, entscheidung: 'neu', grund: `Regelwerk v2.0: neue Buch-Aussage (${na.herkunft.filter((h) => h.startsWith('buch:')).join(', ')})` });
  });
  for (const ref of na.kernpunkte ?? []) { const x = kernpunkt(ref); if (x) setzeStatus(x.kp, 'aussage', id); }
  // Verb im Text passt zur Stufe? (wie F1-Heuristik im Prüfer, nur Hinweis)
  const verben = Object.keys(opStufe).filter((op) => new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${op}([^A-Za-zÄÖÜäöüß]|$)`).test(na.text));
  if (verben.length && !verben.some((v) => opStufe[v] === na.stufe)) console.log(`HINWEIS F1 ${id}: Stufe ${na.stufe}, Verben ${verben.join(', ')}`);
  protokoll.neue_aussagen.push(id);
}

// ---------- D6: Buch-Herkunft an bestehende Aussagen ----------
for (const d of patch.d6 ?? []) {
  const sp = spListe().find((s) => s.koennen.some((k) => k.id === d.aussage));
  if (!sp) { F(`D6: Aussage ${d.aussage} gibt es im Ordner nicht`); continue; }
  const k = sp.koennen.find((x) => x.id === d.aussage);
  if (!BUCH.test(d.herkunft.replace(/^buch:/, ''))) F(`D6: ${d.aussage}: Herkunft ${d.herkunft} ungültig`);
  if (!k.herkunft.includes(d.herkunft)) k.herkunft.push(d.herkunft);
  for (const ref of d.kernpunkte ?? []) { const x = kernpunkt(ref); if (x) setzeStatus(x.kp, 'aussage', d.aussage); }
  protokoll.d6.push(d.aussage);
}

// ---------- schon in einem früheren Raum abgedeckt (E2): Kernpunkt → bestehende Aussage dort ----------
const alleAussagen = new Set();
for (const r of readdirSync('umbau/lernplan')) for (const f of readdirSync(`umbau/lernplan/${r}`).filter((x) => x.endsWith('.json'))) {
  const l = f === `${ORDNER}.json` ? lp : JSON.parse(readFileSync(`umbau/lernplan/${r}/${f}`, 'utf8'));
  for (const tb of l.themenbloecke) for (const s of tb.stichpunkte) for (const k of s.koennen) alleAussagen.add(k.id);
}
for (const a of patch.abgedeckt ?? []) {
  if (!alleAussagen.has(a.aussage)) { F(`abgedeckt: Aussage ${a.aussage} gibt es nicht`); continue; }
  const x = kernpunkt(a.kernpunkt);
  if (x) setzeStatus(x.kp, 'aussage', a.aussage);
  protokoll.abgedeckt ??= [];
  protokoll.abgedeckt.push({ kernpunkt: a.kernpunkt, aussage: a.aussage, grund: a.grund ?? '' });
}

// ---------- Kür (D8) ----------
lp.meta.hinweisquellen ??= {};
lp.meta.hinweisabgleich ??= { stand: HEUTE, umfang: 'ganzer Ordner', themen: [] };
lp.meta.hinweisabgleich.themen ??= [];
for (const ku of patch.kuer ?? []) {
  const sp = spVon(spId(ku.sp));
  if (!sp) { F(`Kür: Stichpunkt ${ku.sp} gibt es nicht`); continue; }
  const q = ku.quelle;
  if (!q?.startsWith('buch:') || !BUCH.test(q.slice(5))) { F(`Kür: Quelle ${q} ungültig`); continue; }
  // Quellen: genannte Quelle und die Kapitel aller zugeordneten Kernpunkte (eine Kür kann mehrere Kapitel bündeln)
  const kapitel = [...new Set([q.slice(5).replace(/-S\d+$/, ''), ...(ku.kernpunkte ?? []).map((r) => r.split('#')[0])])];
  for (const kap of kapitel) lp.meta.hinweisquellen[`buch:${kap}`] ??= `Lehrbuch Westermann „IT-Berufe“ ${kap.replace('-', ' ')} (nur lokal unter quellen/lehrbuch/, E10/D9); Regelwerk v2.0, D8/RK1: Buch-Themen ohne Pflicht als Kür`;
  sp.kuer ??= [];
  if (!ku.kurz?.trim()) F(`Kür ${sp.id}: kurz fehlt (v2.2)`);
  sp.kuer.push({ text: ku.text, ...(ku.kurz ? { kurz: ku.kurz } : {}), quellen: kapitel.map((k) => `buch:${k}`), grund: ku.grund ?? 'D8: Thema aus dem Lehrbuch ohne Katalog-Baustein; vom Katalog nicht ausgeschlossen.' });
  lp.meta.hinweisabgleich.themen.push({ thema: ku.text.slice(0, 120), quellen: kapitel.map((k) => `buch:${k}`), ring: 'Kür', wo: [sp.id], notiz: 'Regelwerk v2.x, D8/RK1' });
  for (const ref of ku.kernpunkte ?? []) { const x = kernpunkt(ref); if (x) setzeStatus(x.kp, 'kuer', sp.id); }
  protokoll.kuer.push(sp.id);
}

// ---------- Grenzen streichen (D3) ----------
for (const g of patch.grenzen_gestrichen ?? []) {
  const sp = spVon(g.sp);
  const i = (sp?.grenzen ?? []).findIndex((x) => x.text.startsWith(g.text_beginnt));
  if (i < 0) { F(`Grenze ${g.sp} „${g.text_beginnt}“ nicht gefunden`); continue; }
  const [weg] = sp.grenzen.splice(i, 1);
  protokoll.grenzen_gestrichen.push({ sp: sp.id, text: weg.text, katalog: weg.katalog, grund: g.grund });
  if (!sp.grenzen.length) {
    // R3: Themen „Außen“ mit Verweis auf diesen Stichpunkt brauchen eine Grenze – sie werden Kern (D3: jetzt Pflicht)
    const neueHier = sp.koennen.filter((k) => protokoll.neue_aussagen.includes(k.id)).map((k) => k.id);
    for (const t of lp.meta.hinweisabgleich.themen.filter((t) => t.ring === 'Außen' && t.wo.includes(sp.id))) {
      t.wo = t.wo.filter((w) => w !== sp.id);
      if (!t.wo.length) { t.ring = 'Kern'; t.wo = neueHier.length ? neueHier : sp.koennen.map((k) => k.id).slice(-1); t.notiz = `${t.notiz ? t.notiz + '; ' : ''}Regelwerk v2.0 (D3): Grenze gestrichen, jetzt Kern`; }
    }
  }
}

// ---------- Hinweise am Stichpunkt (RK5: Buch weicht ab, aktueller Stand) ----------
for (const h of patch.hinweise ?? []) {
  const sp = spVon(spId(h.sp));
  if (!sp) { F(`Hinweis: Stichpunkt ${h.sp} gibt es nicht`); continue; }
  sp.hinweis = sp.hinweis ? `${sp.hinweis} ${h.text}` : h.text;
  protokoll.hinweise ??= [];
  protokoll.hinweise.push(sp.id);
}

// ---------- Kernpunkte: Filter und Umhängen ----------
for (const f of patch.filter ?? []) {
  const x = kernpunkt(f.kernpunkt);
  if (!x) continue;
  if (!regeln.buch.regel_k.filter_gruende.includes(f.filter)) { F(`Filter ${f.kernpunkt}: Grund ${f.filter} unbekannt`); continue; }
  setzeStatus(x.kp, 'filter', f.filter);
  x.kp.filter_nachtrag = f.grund;
  protokoll.filter.push(f.kernpunkt);
}
for (const u of patch.umgehaengt ?? []) {
  const x = kernpunkt(u.kernpunkt);
  if (!x) continue;
  x.kp.stichpunkt = u.stichpunkt;
  x.kp.umgehaengt = `${ORDNER}: ${u.grund}`;
  protokoll.umgehaengt.push(u.kernpunkt);
}

// ---------- Rest: offene neu-Kernpunkte dieses Ordners? ----------
const spIds = new Set(spListe().map((s) => s.id));
if (existsSync(KERN)) for (const band of readdirSync(KERN)) for (const f of readdirSync(`${KERN}/${band}`)) {
  const datei = `${KERN}/${band}/${f}`;
  const d = kernCache.get(datei) ?? JSON.parse(readFileSync(datei, 'utf8'));
  (d.kernpunkte ?? []).forEach((kp, i) => { if (kp.neu && spIds.has(kp.stichpunkt)) console.log(`OFFEN ${band}-${f.replace('.json', '')}#${i + 1} → ${kp.stichpunkt}`); });
}

lp.meta.regelwerk_version = regeln.version;
lp.meta.stand = HEUTE;
lp.meta.v2 = [...(lp.meta.v2 ?? []), protokoll];
kurz.stand = HEUTE;
karten.stand = HEUTE;

if (fehler.length) { console.log(`FEHLER (${fehler.length}) – nichts geschrieben`); for (const x of fehler) console.log('  - ' + x); process.exit(1); }
if (!TROCKEN) {
  schreibe(lpDatei, lp);
  schreibe(kurzDatei, kurz);
  schreibe(kartenDatei, karten);
  for (const [datei, d] of kernCache) writeFileSync(datei, JSON.stringify(d, null, 1) + '\n');
}
console.log(`${ORDNER}: ${protokoll.neue_aussagen.length} neue Aussagen, ${protokoll.neue_stichpunkte.length} neue Stichpunkte, ${protokoll.d6.length} D6, ${protokoll.kuer.length} Kür, ${protokoll.grenzen_gestrichen.length} Grenzen gestrichen, ${protokoll.filter.length} Filter, ${protokoll.umgehaengt.length} umgehängt${TROCKEN ? ' (trocken)' : ''}`);
