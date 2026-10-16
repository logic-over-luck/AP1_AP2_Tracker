// Lernstand-Umzug (P6): erzeugt aus den alt_neu-Tabellen aller gebauten Räume eine Umzugstabelle
// alte ID → neue ID für Können-Aussagen, Stichpunkte und Themenblöcke.
//
// Aufruf:  node tools/umbau/umzug-erzeugen.mjs            schreibt umbau/umzug.json
//          node tools/umbau/umzug-erzeugen.mjs --pruefen  prüft nur Vollständigkeit gegen die alte Inhaltsdatei
//
// Regeln (P6, entschieden 14.10.2026):
//  - Können: Ziel laut alt_neu (übernommen/angepasst/verschoben → neue ID; gestrichen → null;
//    „PB2“ → offen, bis PB2 gebaut ist).
//  - Stichpunkt: alter Stichpunkt → der neue Stichpunkt, der die meisten seiner Können-Aussagen bekommen hat
//    (bei Gleichstand der erste in Lernplan-Reihenfolge). Sind alle gestrichen → null, alle „PB2“ → offen.
//  - Themenblock: genauso über die Stichpunkte.
//  - Karten: Karten-IDs sind „<Können-ID>-n“. Eine Karte mit unveränderter ID behält ihren Stand. Karten
//    verschobener oder neuer Aussagen sind neue Karten und starten neu (Inhalt hat sich geändert).
//  - Die App (Schritt 7) wendet die Tabelle beim Laden an und lässt das Ereignisprotokoll selbst unverändert,
//    damit alte Sicherungen lesbar bleiben.

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const PRUEFEN = process.argv.includes('--pruefen');
const RAEUME = ['ap1', 'pb1', 'pb2', 'wiso'].filter((r) => existsSync(`umbau/lernplan/${r}`));

const koennen = {};
const reihenfolge = []; // neue Stichpunkt-IDs in Lernplan-Reihenfolge
for (const r of RAEUME) {
  for (const f of readdirSync(`umbau/lernplan/${r}`).filter((x) => x.endsWith('.json')).sort((a, b) => a.localeCompare(b, 'de', { numeric: true }))) {
    const lp = JSON.parse(readFileSync(`umbau/lernplan/${r}/${f}`, 'utf8'));
    for (const tb of lp.themenbloecke) for (const sp of tb.stichpunkte) reihenfolge.push(sp.id);
    for (const e of lp.alt_neu?.koennen ?? []) {
      if (koennen[e.alt] && koennen[e.alt].status !== 'PB2') continue; // erste endgültige Einordnung gilt
      koennen[e.alt] = {
        status: e.status,
        neu: e.status === 'gestrichen' || e.status === 'PB2' ? null : e.neu ?? e.alt,
        raum: r.toUpperCase(),
      };
    }
  }
}

const spVon = (id) => id.replace(/-K\d+$/, '');
const blockVon = (sp) => sp.replace(/-\d+$/, '');
const rang = new Map(reihenfolge.map((id, i) => [id, i]));

function mehrheit(gruppen) {
  const aus = {};
  for (const [alt, ziele] of Object.entries(gruppen)) {
    const echt = ziele.filter((z) => typeof z === 'string');
    if (!echt.length) { aus[alt] = ziele.includes('offen') ? 'offen' : null; continue; }
    const zahl = new Map();
    for (const z of echt) zahl.set(z, (zahl.get(z) ?? 0) + 1);
    aus[alt] = [...zahl].sort((a, b) => b[1] - a[1] || (rang.get(a[0]) ?? 1e9) - (rang.get(b[0]) ?? 1e9))[0][0];
  }
  return aus;
}

const proSp = {};
for (const [alt, e] of Object.entries(koennen)) {
  (proSp[spVon(alt)] ??= []).push(e.neu ? spVon(e.neu) : e.status === 'PB2' ? 'offen' : null);
}
const stichpunkte = mehrheit(proSp);
const proBlock = {};
for (const [alt, neu] of Object.entries(stichpunkte)) (proBlock[blockVon(alt)] ??= []).push(typeof neu === 'string' && neu !== 'offen' ? blockVon(neu) : neu);
const bloecke = mehrheit(proBlock);

// Vollständigkeit: jede alte Können-Aussage der gebauten Räume steht in der Tabelle
const alt = JSON.parse(readFileSync('Inhaltsdatei_AP1_AP2_tracker.json', 'utf8'));
const teile = { ap1: 'AP1', pb1: 'AP2', pb2: 'AP2', wiso: 'WISO' };
const pflichtTeile = new Set(RAEUME.map((r) => teile[r]));
const fehlend = alt.stichpunkte.filter((s) => pflichtTeile.has(s.teil)).flatMap((s) => (s.koennen ?? []).map((k) => k.id)).filter((id) => !koennen[id]);

const sortiert = (o) => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b, 'de', { numeric: true })));
const zaehle = (o) => Object.values(o).reduce((a, v) => { const k = v === null ? 'entfällt' : v === 'offen' ? 'offen (PB2)' : 'Ziel'; a[k] = (a[k] ?? 0) + 1; return a; }, {});

if (fehlend.length) {
  console.log(`FEHLER ${fehlend.length} alte Können-Aussagen ohne Einordnung: ${fehlend.slice(0, 10).join(', ')}${fehlend.length > 10 ? ' …' : ''}`);
  process.exit(1);
}
const umzug = {
  meta: {
    erzeugt_mit: 'node tools/umbau/umzug-erzeugen.mjs',
    raeume: RAEUME.map((r) => r.toUpperCase()),
    hinweis: 'Lernstand-Umzug (P6). „offen“ = gehört nach PB2 und wird dort eingeordnet; null = entfällt. Karten-IDs „<Können-ID>-n“: gleiche ID behält ihren Stand, sonst neue Karte.',
    koennen: Object.keys(koennen).length,
    stichpunkte: zaehle(stichpunkte),
    bloecke: zaehle(bloecke),
  },
  koennen: Object.fromEntries(Object.entries(sortiert(koennen)).map(([k, v]) => [k, v.status === 'PB2' ? 'offen' : v.neu])),
  stichpunkte: sortiert(stichpunkte),
  bloecke: sortiert(bloecke),
};
if (PRUEFEN) {
  const ist = existsSync('umbau/umzug.json') ? readFileSync('umbau/umzug.json', 'utf8') : '';
  if (ist !== JSON.stringify(umzug, null, 1) + '\n') { console.log('FEHLER umbau/umzug.json ist veraltet – neu erzeugen.'); process.exit(1); }
  console.log('OK – Umzugstabelle aktuell.');
  process.exit(0);
}
writeFileSync('umbau/umzug.json', JSON.stringify(umzug, null, 1) + '\n');
console.log(`Umzug: ${umzug.meta.koennen} Können, Stichpunkte ${JSON.stringify(umzug.meta.stichpunkte)}, Blöcke ${JSON.stringify(umzug.meta.bloecke)} → umbau/umzug.json`);
