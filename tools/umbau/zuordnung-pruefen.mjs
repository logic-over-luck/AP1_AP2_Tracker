// Prüft die Zuordnung „Teilaufgabe → Baustein" (Schicht 3, Test T2) und berechnet daraus die belegte
// Tiefe je Baustein.
//
// Aufruf:  node tools/umbau/zuordnung-pruefen.mjs [raum] [--teilweise]   (Standard: ap1; --teilweise: fehlende Prüfungen nur melden)
// Liest:   umbau/fundament/katalog-bausteine.json, umbau/fundament/tiefe.json,
//          umbau/fundament/pruefungen-<raum>.json (aus pruefungen-pruefen.mjs),
//          umbau/regeln/regelwerk.json, umbau/regeln/zusatzbausteine.json,
//          umbau/zuordnung/<raum>/<Prüfung>.json
// Schreibt: umbau/fundament/belege-<raum>.json  (nur IDs, Stufen, Themen in eigenen Worten)
//
// Format einer Zuordnungsdatei:
// { "pruefung": "2024H",
//   "teilaufgaben": {
//     "2024H-A1-a": { "bausteine": ["AP1.06.04.7"], "typ": "aufzaehlen", "thema": "…" },
//     "2021H-A3-e": { "bausteine": [], "ausserhalb": "B3: RAID nicht mehr im AP1-Katalog (AP2b.01.10.2)", "typ": "erklaeren", "thema": "…" },
//     … optional: "vorgegeben": "was als Material vorgegeben war (B4)" } }
//
// GOLDENE REGEL (E6), hier als Prüfung eingebaut:
//   - belegte Tiefe = max(Katalogtiefe, Belegstufen) – nie darunter
//   - Zuordnungen können Bausteine hinzufügen (Zusatzbausteine), nie Katalog-Bausteine entfernen
//   - „ausserhalb" nur mit Katalog-Begründung (B3) oder Raumgrenze, nie „kam nicht vor"

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';

const RAUM = (process.argv[2] ?? 'ap1').toLowerCase();
const TEIL = { ap1: 'AP1' }[RAUM];
if (!TEIL) { console.error(`Unbekannter Raum: ${RAUM}`); process.exit(2); }

const b = JSON.parse(readFileSync('umbau/fundament/katalog-bausteine.json', 'utf8'));
const tiefe = JSON.parse(readFileSync('umbau/fundament/tiefe.json', 'utf8'));
const index = JSON.parse(readFileSync(`umbau/fundament/pruefungen-${RAUM}.json`, 'utf8'));
const regeln = JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8'));
const zusatz = JSON.parse(readFileSync('umbau/regeln/zusatzbausteine.json', 'utf8')).bausteine;

export const TYPEN = {
  aufzaehlen: 'nennen, angeben, benennen – ohne Erklärung',
  erklaeren: 'beschreiben, erläutern, erklären, unterscheiden',
  begruenden: 'begründen, beurteilen, auswählen, empfehlen, vorschlagen',
  berechnen: 'Rechnung mit Rechenweg',
  zuordnen: 'zuordnen, ankreuzen, Reihenfolge, Tabelle mit Kategorien',
  diagramm: 'Diagramm erstellen, ergänzen oder auswerten (UML, ER, Netzplan, Netzwerkplan, EPK)',
  code_lesen: 'Code oder Pseudocode lesen: Schreibtischtest, Rückgabewert, Fehler finden, erklären',
  code_schreiben: 'Code oder Pseudocode schreiben oder ergänzen',
  konfigurieren: 'Konfiguration eintragen, Befehl angeben, Einstellung wählen',
  vorgehen: 'Vorgehensweise oder Arbeitsschritte beschreiben',
  text: 'Text formulieren (z. B. E-Mail, Hinweis, Übersetzung)',
};

const fehler = [];
const warn = [];
const katalogIds = new Set([
  ...b.punkte.filter((p) => p.id.startsWith(`${TEIL}.`)).map((p) => p.id),
  ...b.spiegelstriche.filter((s) => s.id.startsWith(`${TEIL}.`)).map((s) => s.id),
]);
const anhangIds = new Set(b.anhang.map((a) => a.id));
const opStufe = regeln.pruefungsoperatoren.stufen;
const formOps = new Set(regeln.pruefungsoperatoren.formoperatoren ?? []);
for (const op of formOps) if (!(op in opStufe)) fehler.push(`Formoperator ohne Stufe im Regelwerk: „${op}"`);

// Zusatzbausteine gültig?
for (const [id, z] of Object.entries(zusatz)) {
  if (!id.startsWith('ZB.')) fehler.push(`Zusatzbaustein-ID muss mit ZB. beginnen: ${id}`);
  if (!z.titel || !z.katalogbezug || !z.begruendung) fehler.push(`Zusatzbaustein ${id}: titel, katalogbezug und begruendung sind Pflicht`);
  if (z.katalogbezug && !katalogIds.has(z.katalogbezug)) fehler.push(`Zusatzbaustein ${id}: Katalogbezug ${z.katalogbezug} unbekannt`);
}

// Prüfungsoperatoren vollständig und konsistent mit der Katalog-Tabelle?
const alleOps = new Set(index.pruefungen.flatMap((p) => p.teilaufgaben.flatMap((t) => t.operator ?? [])));
for (const op of alleOps) if (!(op in opStufe)) fehler.push(`Prüfungsoperator ohne Stufe im Regelwerk: „${op}"`);
for (const [op, st] of Object.entries(opStufe)) {
  if (op in regeln.operatoren && regeln.operatoren[op] !== st && !(op in (regeln.pruefungsoperatoren.abweichungen ?? {}))) {
    fehler.push(`Prüfungsoperator „${op}" (${st}) weicht von der Katalog-Tabelle (${regeln.operatoren[op]}) ab, ohne Eintrag unter abweichungen`);
  }
}

// ---------- Zuordnungen lesen ----------
const ordner = process.env.ZUORDNUNG_ORDNER ?? `umbau/zuordnung/${RAUM}`;
const dateien = existsSync(ordner) ? readdirSync(ordner).filter((f) => f.endsWith('.json')) : [];
const zuordnung = new Map();
for (const d of dateien) {
  const z = JSON.parse(readFileSync(`${ordner}/${d}`, 'utf8'));
  if (`${z.pruefung}.json` !== d) fehler.push(`${d}: Feld pruefung (${z.pruefung}) passt nicht zum Dateinamen`);
  zuordnung.set(z.pruefung, z);
}

const belege = new Map(); // Baustein-ID -> [{ta, stufe, katalog}]
let zugeordnet = 0, blaetterGesamt = 0, ausserhalbZahl = 0;
const fehlendePruefungen = [];

for (const p of index.pruefungen) {
  const blaetter = p.teilaufgaben.filter((t) => t.blatt);
  blaetterGesamt += blaetter.length;
  const z = zuordnung.get(p.id);
  if (!z) { fehlendePruefungen.push(p.id); continue; }
  const ids = new Set(blaetter.map((t) => t.id));
  for (const id of Object.keys(z.teilaufgaben)) if (!ids.has(id)) fehler.push(`${p.id}: Teilaufgabe ${id} gibt es in der Abschrift nicht (oder sie ist kein Blatt)`);
  for (const t of blaetter) {
    const e = z.teilaufgaben[t.id];
    if (!e) { fehler.push(`${p.id}: Teilaufgabe ${t.id} nicht zugeordnet (T2)`); continue; }
    zugeordnet++;
    if (!Array.isArray(e.bausteine)) { fehler.push(`${t.id}: bausteine fehlt`); continue; }
    if (!(e.typ in TYPEN)) fehler.push(`${t.id}: unbekannter typ „${e.typ}"`);
    if (!e.thema || e.thema.length < 3) fehler.push(`${t.id}: thema fehlt`);
    if (e.bausteine.length === 0) {
      ausserhalbZahl++;
      if (!e.ausserhalb) fehler.push(`${t.id}: keine Bausteine und keine Begründung in „ausserhalb"`);
      else if (!/^(B3|RAUM|G5):/.test(e.ausserhalb)) fehler.push(`${t.id}: „ausserhalb" muss mit B3:, RAUM: oder G5: beginnen (Katalog-Begründung), nicht mit „kam nicht vor"`);
    } else if (e.ausserhalb) {
      fehler.push(`${t.id}: hat Bausteine und zugleich „ausserhalb"`);
    }
    // Z3 mit Z3a (v1.3, P25): Formoperatoren zählen nur, wenn die Teilaufgabe keinen anderen Operator hat.
    const ops = t.operator ?? [];
    const fachlich = ops.filter((o) => !formOps.has(o));
    const zaehlend = fachlich.length ? fachlich : ops;
    const stufe = zaehlend.length ? Math.max(...zaehlend.map((o) => opStufe[o] ?? 0)) : null;
    for (const bid of e.bausteine) {
      const gueltig = katalogIds.has(bid) || anhangIds.has(bid) || bid in zusatz;
      if (!gueltig) { fehler.push(`${t.id}: unbekannter Baustein ${bid}`); continue; }
      if (!belege.has(bid)) belege.set(bid, []);
      belege.get(bid).push({ ta: t.id, stufe, katalog: p.katalog, amtlich: p.loesungshinweise_amtlich !== 'nein' && p.loesungshinweise === 'ja' });
    }
  }
}

// ---------- Belegte Tiefe (goldene Regel) ----------
const stufeKatalog = (id) => (tiefe.spiegelstriche[id] ?? tiefe.punkte[id])?.stufe ?? null;
const ergebnis = {};
const abdeckungspflichtig = [
  ...b.abdeckungspflichtig.filter((id) => id.startsWith(`${TEIL}.`)),
  ...Object.keys(zusatz),
];
for (const id of abdeckungspflichtig) {
  const k = id.startsWith('ZB.') ? null : stufeKatalog(id);
  const bl = belege.get(id) ?? [];
  const belegStufe = bl.reduce((m, x) => Math.max(m, x.stufe ?? 0), 0) || null;
  const gesamt = Math.max(k ?? 0, belegStufe ?? 0) || null;
  ergebnis[id] = {
    katalog_stufe: k, beleg_stufe: belegStufe, stufe: gesamt,
    angehoben: k !== null && belegStufe !== null && belegStufe > k,
    belege_aktuell: bl.filter((x) => x.katalog === 'aktuell').map((x) => x.ta),
    belege_alt: bl.filter((x) => x.katalog === 'alt').map((x) => x.ta),
  };
  // Goldene Regel als harte Prüfung
  if (k !== null && (gesamt ?? 0) < k) fehler.push(`GOLDENE REGEL verletzt: ${id} läge unter der Katalogtiefe (${gesamt} < ${k})`);
}
// Kein Katalog-Baustein darf durch die Zuordnung verschwinden
for (const id of b.abdeckungspflichtig.filter((x) => x.startsWith(`${TEIL}.`))) {
  if (!(id in ergebnis)) fehler.push(`GOLDENE REGEL verletzt: Katalog-Baustein ${id} ist nicht mehr abdeckungspflichtig`);
}
for (const [bid] of belege) if (!(bid in ergebnis) && !anhangIds.has(bid)) {
  // Beleg auf Katalogpunkt mit Spiegelstrichen (nicht selbst abdeckungspflichtig): erlaubt, zählt für den Punkt
  ergebnis[bid] = { katalog_stufe: stufeKatalog(bid), beleg_stufe: Math.max(...belege.get(bid).map((x) => x.stufe ?? 0)) || null, nur_punkt: true,
    belege_aktuell: belege.get(bid).filter((x) => x.katalog === 'aktuell').map((x) => x.ta), belege_alt: belege.get(bid).filter((x) => x.katalog === 'alt').map((x) => x.ta) };
}

const mitBeleg = abdeckungspflichtig.filter((id) => ergebnis[id].belege_aktuell.length + ergebnis[id].belege_alt.length > 0);
const angehoben = abdeckungspflichtig.filter((id) => ergebnis[id].angehoben);

if (!process.env.ZUORDNUNG_ORDNER) writeFileSync(`umbau/fundament/belege-${RAUM}.json`, JSON.stringify({
  meta: {
    erzeugt_mit: `node tools/umbau/zuordnung-pruefen.mjs ${RAUM}`,
    regelwerk_version: regeln.version,
    hinweis: 'stufe = max(katalog_stufe, beleg_stufe) (goldene Regel E6). Belege nur als Teilaufgaben-IDs.',
    pruefungen_zugeordnet: zuordnung.size, teilaufgaben: blaetterGesamt, teilaufgaben_zugeordnet: zugeordnet,
    teilaufgaben_ausserhalb: ausserhalbZahl,
    bausteine_abdeckungspflichtig: abdeckungspflichtig.length, bausteine_mit_beleg: mitBeleg.length, bausteine_angehoben: angehoben.length,
  },
  bausteine: ergebnis,
}, null, 2) + '\n');

console.log(`Zuordnung ${TEIL}: ${zuordnung.size}/${index.pruefungen.length} Prüfungen, ${zugeordnet}/${blaetterGesamt} Teilaufgaben ` +
  `(davon ${ausserhalbZahl} außerhalb mit Katalog-Begründung)`);
console.log(`Bausteine: ${abdeckungspflichtig.length} abdeckungspflichtig (davon ${Object.keys(zusatz).length} Zusatz), ` +
  `${mitBeleg.length} mit Prüfungsbeleg, ${angehoben.length} durch Belege angehoben`);
if (fehlendePruefungen.length) {
  const text = `Noch ohne Zuordnung: ${fehlendePruefungen.join(', ')}`;
  if (process.argv.includes('--teilweise')) warn.push(text); else fehler.push(`${text} (T2)`);
}
for (const w of warn) console.log(`HINWEIS ${w}`);
if (fehler.length) {
  console.log(`FEHLER (${fehler.length})`);
  for (const f of fehler.slice(0, 40)) console.log(`  - ${f}`);
  process.exitCode = 1;
} else console.log('OK – T2 und goldene Regel erfüllt für alle zugeordneten Prüfungen.');
