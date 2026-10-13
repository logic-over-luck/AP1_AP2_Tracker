// Prüft einen Ordner des neuen Lernplans (Schicht 3+4) und schreibt einen lesbaren Bericht.
//
// Aufruf:  node tools/umbau/lernplan-pruefen.mjs AP1-6
// Liest:   umbau/lernplan/ap1/<Ordner>.json und das Fundament (Bausteine, Zusatzbausteine, belegte Tiefe,
//          Zuordnung der Prüfungen), dazu den alten Stand (Inhaltsdatei, inhalte/lernen/<Ordner>.json)
// Schreibt: umbau/berichte/<Ordner>.md
//
// Prüfungen (UMBAU.md Abschnitt 5):
//   Struktur  IDs eindeutig und richtig aufgebaut; F3 (3–7 Können je Stichpunkt), F4 (3–6 Stichpunkte je Block)
//   T3        jede Können-Aussage hat eine gültige Herkunft, passend zu Bausteinen und Teilaufgaben des Stichpunkts
//   T4        jede Grenze nennt Katalogstellen und eine Begründung
//   T6        jeder Stichpunkt hat ein Gebiet seines Raums
//   T2b       jede Teilaufgabe, die nur Bausteine dieses Ordners betrifft, steckt in einem Stichpunkt
//   T8        Tiefe erreicht: je Baustein erreicht mindestens eine Können-Aussage die belegte Tiefe
//             (bei geteilten Bausteinen mit „anteil" nur Hinweis – der Rest wird in anderen Ordnern erreicht)
//   ALT       jede alte Können-Aussage des Ordners ist einsortiert; alte IDs bleiben erhalten, keine ID wird neu vergeben

import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';

const ORDNER = process.argv[2];
if (!ORDNER) { console.error('Aufruf: node tools/umbau/lernplan-pruefen.mjs <Ordner-ID, z. B. AP1-6>'); process.exit(2); }
const TEIL = ORDNER.split('-')[0];
const RAUM = TEIL.toLowerCase();

const lp = JSON.parse(readFileSync(process.env.LERNPLAN_DATEI ?? `umbau/lernplan/${RAUM}/${ORDNER}.json`, 'utf8'));
const b = JSON.parse(readFileSync('umbau/fundament/katalog-bausteine.json', 'utf8'));
const zusatz = JSON.parse(readFileSync('umbau/regeln/zusatzbausteine.json', 'utf8')).bausteine;
const belege = JSON.parse(readFileSync(`umbau/fundament/belege-${RAUM}.json`, 'utf8')).bausteine;
const regeln = JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8'));
const index = JSON.parse(readFileSync(`umbau/fundament/pruefungen-${RAUM}.json`, 'utf8'));
const alt = JSON.parse(readFileSync('Inhaltsdatei_AP1_AP2_tracker.json', 'utf8'));
const altPaket = JSON.parse(readFileSync(`inhalte/lernen/${ORDNER}.json`, 'utf8'));

const zuordnung = {};
for (const d of readdirSync(`umbau/zuordnung/${RAUM}`)) {
  Object.assign(zuordnung, JSON.parse(readFileSync(`umbau/zuordnung/${RAUM}/${d}`, 'utf8')).teilaufgaben);
}
const teilaufgabe = new Map(index.pruefungen.flatMap((p) => p.teilaufgaben.filter((t) => t.blatt).map((t) => [t.id, { ...t, pruefung: p.id }])));

const fehler = [], hinweise = [];
const F = (s) => fehler.push(s), H = (s) => hinweise.push(s);

const alleIds = new Set([
  ...b.fragenkomplexe.map((x) => x.id), ...b.punkte.map((x) => x.id), ...b.spiegelstriche.map((x) => x.id),
  ...b.anhang.map((x) => x.id), ...Object.keys(zusatz), ...b.pruefungsbereiche.flatMap((p) => p.gebiete.map((g) => g.id)),
]);
const raumBausteine = new Set([
  ...b.punkte.filter((x) => x.id.startsWith(`${TEIL}.`)).map((x) => x.id),
  ...b.spiegelstriche.filter((x) => x.id.startsWith(`${TEIL}.`)).map((x) => x.id),
  ...b.anhang.map((x) => x.id), ...Object.keys(zusatz),
]);
const gebieteRaum = new Set(b.pruefungsbereiche.find((p) => p.id === TEIL).gebiete.map((g) => g.id));
const REGELN = new Set(['P-GESCHWISTER', 'P-NAECHSTE-STUFE', 'P-GRUNDLAGE']);
const opStufe = { ...regeln.operatoren, ...regeln.pruefungsoperatoren.stufen };

// ---------- Struktur ----------
const ob = lp.oberblock;
if (ob.id !== ORDNER) F(`Oberblock-ID ${ob.id} passt nicht zur Datei ${ORDNER}`);
for (const g of ob.gebiete) if (!gebieteRaum.has(g)) F(`Oberblock: Gebiet ${g} gehört nicht zum Raum ${TEIL}`);
const spIds = [], kIds = [];
const stichpunkte = [];
for (const tb of lp.themenbloecke) {
  if (!tb.id.startsWith(`${ORDNER}-`)) F(`Themenblock ${tb.id} beginnt nicht mit ${ORDNER}-`);
  if (tb.stichpunkte.length < 3 || tb.stichpunkte.length > 6) F(`F4: Themenblock ${tb.id} hat ${tb.stichpunkte.length} Stichpunkte (erlaubt 3–6)`);
  for (const sp of tb.stichpunkte) {
    stichpunkte.push({ ...sp, block: tb.id });
    spIds.push(sp.id);
    if (!sp.id.startsWith(`${tb.id}-`)) F(`Stichpunkt ${sp.id} liegt nicht unter ${tb.id}`);
    if (sp.koennen.length < 3 || sp.koennen.length > 7) F(`F3: ${sp.id} hat ${sp.koennen.length} Können-Aussagen (erlaubt 3–7)`);
    if (!sp.gebiete?.length) F(`T6: ${sp.id} hat kein Gebiet`);
    for (const g of sp.gebiete ?? []) if (!gebieteRaum.has(g)) F(`T6: ${sp.id}: Gebiet ${g} gehört nicht zum Raum ${TEIL}`);
    const spB = new Set(sp.bausteine.map((x) => x.id));
    for (const x of sp.bausteine) if (!raumBausteine.has(x.id)) F(`${sp.id}: Baustein ${x.id} gehört nicht zum Raum ${TEIL}`);
    for (const ta of sp.teilaufgaben) {
      if (!teilaufgabe.has(ta)) { F(`${sp.id}: Teilaufgabe ${ta} unbekannt`); continue; }
      const z = zuordnung[ta];
      if (z.ausserhalb) F(`${sp.id}: Teilaufgabe ${ta} ist „ausserhalb" (${z.ausserhalb})`);
      else if (!z.bausteine.some((x) => spB.has(x))) H(`${sp.id}: Teilaufgabe ${ta} betrifft keinen Baustein des Stichpunkts (${z.bausteine.join(', ')})`);
    }
    for (const k of sp.koennen) {
      kIds.push(k.id);
      if (!new RegExp(`^${sp.id}-K\\d+$`).test(k.id)) F(`${k.id}: ID passt nicht zum Stichpunkt ${sp.id}`);
      if (!k.text.startsWith('Du kannst ')) F(`F1: ${k.id} beginnt nicht mit „Du kannst“`);
      if (![1, 2, 3, 4].includes(k.stufe)) F(`${k.id}: ungültige Stufe ${k.stufe}`);
      if (!k.herkunft?.length) F(`T3: ${k.id} hat keine Herkunft`);
      for (const h of k.herkunft ?? []) {
        const [art, wert] = [h.split(':')[0], h.slice(h.indexOf(':') + 1)];
        if (art === 'katalog') {
          if (!alleIds.has(wert)) F(`T3: ${k.id}: Katalog-ID ${wert} unbekannt`);
          else if (!spB.has(wert)) F(`T3: ${k.id}: ${wert} steht nicht in den Bausteinen von ${sp.id}`);
        } else if (art === 'beleg') {
          if (!teilaufgabe.has(wert)) F(`T3: ${k.id}: Teilaufgabe ${wert} unbekannt`);
          else if (!sp.teilaufgaben.includes(wert)) F(`T3: ${k.id}: Beleg ${wert} steht nicht in den Teilaufgaben von ${sp.id}`);
        } else if (art === 'regel') {
          if (!REGELN.has(wert)) F(`T3: ${k.id}: unbekannte Regel ${wert}`);
        } else F(`T3: ${k.id}: unbekannte Herkunftsart „${h}"`);
      }
      // F1-Heuristik: passt die Stufe zu einem Verb im Text?
      const verben = Object.keys(opStufe).filter((op) => new RegExp(`(^|[^A-Za-zÄÖÜäöüß])${op}([^A-Za-zÄÖÜäöüß]|$)`).test(k.text));
      if (verben.length && !verben.some((v) => opStufe[v] === k.stufe)) H(`F1: ${k.id}: Stufe ${k.stufe}, Verben im Text: ${verben.map((v) => `${v} (${opStufe[v]})`).join(', ')}`);
    }
    // Kür (K-Regeln): nur aus Hinweisquellen, nicht abdeckungspflichtig, zählt nicht zu F3
    for (const ku of sp.kuer ?? []) {
      if (!ku.text || !ku.grund) F(`KÜR: ${sp.id}: Kür-Eintrag ohne Text oder Grund`);
      if (!ku.quellen?.length) F(`KÜR: ${sp.id}: Kür-Eintrag ohne Hinweisquelle: „${(ku.text ?? '').slice(0, 50)}…"`);
      for (const q of ku.quellen ?? []) if (!(q in (lp.meta?.hinweisquellen ?? {}))) F(`KÜR: ${sp.id}: Hinweisquelle ${q} nicht in meta.hinweisquellen beschrieben`);
    }
    for (const g of sp.grenzen ?? []) {
      if (!g.katalog?.length) F(`T4: ${sp.id}: Grenze ohne Katalogstelle: „${g.text.slice(0, 60)}…"`);
      for (const id of g.katalog ?? []) if (!alleIds.has(id)) F(`T4: ${sp.id}: Grenze nennt unbekannte ID ${id}`);
      if (!g.begruendung || g.begruendung.length < 10) F(`T4: ${sp.id}: Grenze ohne Begründung`);
      if (/\b(kam|kommt|kamen)\b.*\bnicht\b.*\bvor\b|nicht (verlangt|vorgekommen|gefragt|geprüft|belegt)|nie (verlangt|gefragt|geprüft)|keine Aufgabe|ohne Beleg/i.test(g.begruendung)) F(`E6: ${sp.id}: Grenze stützt sich auf fehlende Prüfungsbelege`);
    }
  }
}
for (const [liste, name] of [[spIds, 'Stichpunkt'], [kIds, 'Können']]) {
  const d = liste.filter((x, i) => liste.indexOf(x) !== i);
  for (const x of d) F(`doppelte ${name}-ID ${x}`);
}

// ---------- T2b: Teilaufgaben des Ordners abgedeckt ----------
const ordnerBausteine = new Set(stichpunkte.flatMap((sp) => sp.bausteine.map((x) => x.id)));
const geteilt = new Set(stichpunkte.flatMap((sp) => sp.bausteine.filter((x) => x.anteil).map((x) => x.id)));
const inSP = new Set(stichpunkte.flatMap((sp) => sp.teilaufgaben));
for (const [ta, z] of Object.entries(zuordnung)) {
  if (z.ausserhalb || !z.bausteine.length) continue;
  // Pflicht nur, wenn die Teilaufgabe einen Baustein betrifft, den dieser Ordner ganz übernimmt;
  // Teilaufgaben, die nur geteilte Bausteine betreffen, prüft T2b am Ende auf Raum-Ebene.
  const ganzHier = z.bausteine.some((x) => ordnerBausteine.has(x) && !geteilt.has(x));
  if (ganzHier && !inSP.has(ta)) F(`T2b: Teilaufgabe ${ta} (${z.bausteine.join(', ')}) steckt in keinem Stichpunkt`);
}

// ---------- T8: Tiefe erreicht ----------
const tiefe = [];
for (const id of ordnerBausteine) {
  if (id.startsWith('ANH.')) continue;
  const soll = belege[id]?.stufe ?? null;
  let ist = 0;
  for (const sp of stichpunkte) for (const k of sp.koennen) {
    const trifft = k.herkunft.some((h) => h === `katalog:${id}` || (h.startsWith('beleg:') && zuordnung[h.slice(6)]?.bausteine.includes(id)));
    if (trifft) ist = Math.max(ist, k.stufe);
  }
  tiefe.push({ id, soll, ist, geteilt: geteilt.has(id) });
  if (soll && ist < soll) {
    const text = `T8: ${id} braucht Stufe ${soll}, erreicht in ${ORDNER} ${ist || 'keine'}`;
    if (geteilt.has(id)) H(`${text} – geteilter Baustein, Rest muss ein anderer Ordner erreichen`); else F(text);
  }
}

// ---------- ALT: alte Inhalte einsortiert, IDs erhalten ----------
const altSP = alt.stichpunkte.filter((s) => s.ordner_id === ORDNER);
const altK = altSP.flatMap((s) => s.koennen.map((k) => k.id));
const an = lp.alt_neu?.koennen ?? [];
const STATUS = new Set(['übernommen', 'angepasst', 'verschoben', 'gestrichen']);
const neuK = new Set(kIds);
for (const id of altK) {
  const e = an.filter((x) => x.alt === id);
  if (e.length !== 1) { F(`ALT: ${id} ist ${e.length}-mal einsortiert (soll genau 1)`); continue; }
  const x = e[0];
  if (!STATUS.has(x.status)) F(`ALT: ${id}: unbekannter Status ${x.status}`);
  if (x.status === 'gestrichen' && !x.grund) F(`ALT: ${id}: gestrichen ohne Grund`);
  if (x.status !== 'gestrichen' && !neuK.has(x.neu)) F(`ALT: ${id}: Ziel ${x.neu} gibt es im neuen Plan nicht`);
  if ((x.status === 'übernommen' || x.status === 'angepasst') && x.neu !== id) F(`ALT: ${id}: übernommen/angepasst muss die ID behalten (Lernstand, Karten)`);
}
for (const x of an) if (!altK.includes(x.alt)) F(`ALT: ${x.alt} ist keine alte Können-Aussage dieses Ordners`);
const freigewordene = new Set(an.filter((x) => x.status === 'verschoben' || x.status === 'gestrichen').map((x) => x.alt));
for (const id of kIds) if (freigewordene.has(id)) F(`ALT: ID ${id} wird neu vergeben, obwohl sie verschoben/gestrichen wurde`);
for (const s of altSP) if (!spIds.includes(s.id)) F(`ALT: alter Stichpunkt ${s.id} fehlt im neuen Plan (ID-Erhalt)`);

// Karten-Bilanz
const statusVon = Object.fromEntries(an.map((x) => [x.alt, x]));
const karten = { bleiben: 0, pruefen: 0, umhaengen: 0, entfallen: 0, ohne_koennen: 0 };
for (const k of altPaket.karten) {
  const x = statusVon[k.k];
  if (!x) karten.ohne_koennen++;
  else if (x.status === 'übernommen') karten.bleiben++;
  else if (x.status === 'angepasst') karten.pruefen++;
  else if (x.status === 'verschoben') karten.umhaengen++;
  else karten.entfallen++;
}
const altSet = new Set(altK);
const neueKoennen = kIds.filter((id) => !altSet.has(id) && !an.some((x) => x.neu === id));

// ---------- Bericht ----------
const zaehl = (s) => an.filter((x) => x.status === s).length;
const zeilen = [];
zeilen.push(`# Probelauf ${ORDNER} – ${ob.titel}`, '', `Erzeugt mit \`node tools/umbau/lernplan-pruefen.mjs ${ORDNER}\`. Nicht von Hand bearbeiten.`, '');
zeilen.push(`**Ergebnis:** ${fehler.length ? `${fehler.length} Fehler` : 'alle Prüfungen bestanden'}, ${hinweise.length} Hinweise.`, '');
zeilen.push('## Struktur', '');
for (const tb of lp.themenbloecke) {
  zeilen.push(`### ${tb.id} ${tb.titel}`, '', `_${tb.satz}_`, '');
  for (const sp of tb.stichpunkte) {
    const neu = !altSP.some((s) => s.id === sp.id);
    zeilen.push(`#### ${sp.id} ${sp.titel}${neu ? ' (neu)' : ''}`, '', sp.ziel, '');
    zeilen.push(`Bausteine: ${sp.bausteine.map((x) => x.id + (x.anteil ? ` (${x.anteil})` : '')).join('; ')} · Gebiete: ${sp.gebiete.join(', ')}`, '');
    zeilen.push(`Teilaufgaben: ${sp.teilaufgaben.join(', ')}`, '');
    zeilen.push('| ID | Können | Stufe | Herkunft |', '|---|---|---|---|');
    for (const k of sp.koennen) zeilen.push(`| ${k.id.replace(sp.id + '-', '')} | ${k.text}${k.vorgegeben ? ` _(vorgegeben: ${k.vorgegeben})_` : ''} | ${k.stufe} | ${k.herkunft.join(', ')} |`);
    zeilen.push('');
    if (sp.kuer?.length) {
      zeilen.push('**Kür** (freiwillig, zählt nicht zum Fortschritt):', '');
      for (const ku of sp.kuer) zeilen.push(`- ${ku.text} _(${ku.quellen.join(', ')})_`);
      zeilen.push('');
    }
    for (const g of sp.grenzen ?? []) zeilen.push(`**Grenze:** ${g.text} — _${g.begruendung}_ (${g.katalog.join(', ')})`, '');
    if (sp.hinweis) zeilen.push(`_Hinweis:_ ${sp.hinweis}`, '');
  }
}
zeilen.push('## Tiefe je Baustein (T8)', '', '| Baustein | belegte Tiefe | erreicht | geteilt |', '|---|---|---|---|');
for (const t of tiefe.sort((x, y) => x.id.localeCompare(y.id))) zeilen.push(`| ${t.id} | ${t.soll ?? '–'} | ${t.ist || '–'} | ${t.geteilt ? 'ja' : ''} |`);
zeilen.push('', '## Alt → neu', '');
zeilen.push(`Können-Aussagen: ${altK.length} alt → ${zaehl('übernommen')} übernommen, ${zaehl('angepasst')} angepasst, ${zaehl('verschoben')} verschoben, ${zaehl('gestrichen')} gestrichen; ${neueKoennen.length} neu.`, '');
zeilen.push(`Stichpunkte: ${altSP.length} alt, ${spIds.length} neu (${spIds.filter((id) => !altSP.some((s) => s.id === id)).join(', ') || 'keine neuen'}).`, '');
zeilen.push(`Karten (${altPaket.karten.length}): ${karten.bleiben} bleiben, ${karten.pruefen} prüfen (Aussage angepasst), ${karten.umhaengen} umhängen (Aussage verschoben), ${karten.entfallen} entfallen, ${karten.ohne_koennen} ohne Können-Bezug. Neue Aussagen ohne Karten: ${neueKoennen.join(', ') || 'keine'}.`, '');
zeilen.push('| alt | Status | neu | Grund |', '|---|---|---|---|');
for (const x of an) zeilen.push(`| ${x.alt} | ${x.status} | ${x.neu ?? '–'} | ${x.grund || ''} |`);
zeilen.push('', '### Sätze aus alten Rahmentexten', '', '| alt | Satz | Status | Grund |', '|---|---|---|---|');
for (const x of lp.alt_neu?.rahmen ?? []) zeilen.push(`| ${x.alt} | ${x.satz} | ${x.status} | ${x.grund} |`);
if (fehler.length || hinweise.length) {
  zeilen.push('', '## Fehler und Hinweise', '');
  for (const f of fehler) zeilen.push(`- ✗ ${f}`);
  for (const h of hinweise) zeilen.push(`- · ${h}`);
}
if (!process.env.LERNPLAN_DATEI) {
  mkdirSync('umbau/berichte', { recursive: true });
  writeFileSync(`umbau/berichte/${ORDNER}.md`, zeilen.join('\n') + '\n');
}

console.log(`${ORDNER}: ${lp.themenbloecke.length} Themenblöcke, ${spIds.length} Stichpunkte, ${kIds.length} Können-Aussagen, ${stichpunkte.reduce((a, sp) => a + (sp.kuer?.length ?? 0), 0)} Kür-Einträge`);
console.log(`Alt → neu: ${zaehl('übernommen')} übernommen, ${zaehl('angepasst')} angepasst, ${zaehl('verschoben')} verschoben, ${zaehl('gestrichen')} gestrichen, ${neueKoennen.length} neu`);
console.log(`Karten: ${JSON.stringify(karten)}`);
for (const h of hinweise) console.log(`HINWEIS ${h}`);
if (fehler.length) { console.log(`FEHLER (${fehler.length})`); for (const f of fehler) console.log(`  - ${f}`); process.exitCode = 1; }
else console.log('OK – Struktur, T2b, T3, T4, T6, T8 und Alt→neu bestanden.');
