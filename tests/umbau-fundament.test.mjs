// Prüft den Prüfer: Wird ein absichtlich eingebauter Fehler in den Katalog-Bausteinen erkannt?
// Läuft nur, wenn die Katalogquelle lokal vorliegt (quellen/ ist nicht im Repo).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const QUELLE = 'quellen/katalog.md';
const BAUSTEINE = 'umbau/fundament/katalog-bausteine.json';
const vorhanden = existsSync(QUELLE) && existsSync(BAUSTEINE);

function pruefeMit(veraendern) {
  const b = JSON.parse(readFileSync(BAUSTEINE, 'utf8'));
  veraendern(b);
  const datei = join(mkdtempSync(join(tmpdir(), 'fundament-')), 'b.json');
  writeFileSync(datei, JSON.stringify(b));
  return spawnSync(process.execPath, ['tools/umbau/fundament-pruefen.mjs', QUELLE, datei], { encoding: 'utf8' });
}

test('unverändertes Fundament besteht', { skip: !vorhanden && 'Katalogquelle fehlt' }, () => {
  const r = pruefeMit(() => {});
  assert.equal(r.status, 0, r.stdout);
});

const fehlerfaelle = {
  'fehlender Spiegelstrich': (b) => { b.spiegelstriche.splice(100, 1); },
  'erfundener Spiegelstrich': (b) => { b.spiegelstriche.push({ ...b.spiegelstriche[0], id: 'AP1.01.01.99', text: 'IPv6-Subnetting' }); },
  'veränderter Wortlaut': (b) => { b.spiegelstriche[5].text += ' (vereinfacht)'; },
  'fehlender Katalogpunkt': (b) => { b.punkte.splice(10, 1); },
  'doppelte ID': (b) => { b.spiegelstriche[1].id = b.spiegelstriche[0].id; },
  'kaputter Verweis': (b) => { b.spiegelstriche[0].punkt = 'AP1.99.99'; },
  'fehlendes Gebiet': (b) => { b.pruefungsbereiche[1].gebiete.pop(); },
};

for (const [name, veraendern] of Object.entries(fehlerfaelle)) {
  test(`erkennt: ${name}`, { skip: !vorhanden && 'Katalogquelle fehlt' }, () => {
    const r = pruefeMit(veraendern);
    assert.equal(r.status, 1, `Fehler „${name}" wurde nicht erkannt:\n${r.stdout}`);
  });
}

// ---------- Regelwerk (Schicht 2) ----------
import { OPERATOREN } from '../tools/umbau/katalog-zerlegen.mjs';

test('Regelwerk: jeder Operator hat genau eine Stufe 1–4', () => {
  const r = JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8'));
  for (const op of OPERATOREN) assert.ok([1, 2, 3, 4].includes(r.operatoren[op]), `Operator ohne gültige Stufe: ${op}`);
  for (const op of Object.keys(r.operatoren)) assert.ok(OPERATOREN.includes(op), `unbekannter Operator im Regelwerk: ${op}`);
});

test('Tiefe-Berechnung läuft fehlerfrei', { skip: !vorhanden && 'Katalogquelle fehlt' }, () => {
  const r = spawnSync(process.execPath, ['tools/umbau/tiefe-berechnen.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
});

// ---------- Prüfungsabschriften (Schicht 0) ----------
import { lies } from '../tools/umbau/pruefungen-pruefen.mjs';

const MUSTER = `---
id: 2099F
prüfung: AP1
punkte_gesamt: 100
aufgaben_punkte: [25, 25, 25, 25]
lösungshinweise: ja
vollständig: ja
---
# 2099F-A1 · 25 Punkte
## 2099F-A1-a · 24 Punkte
\`\`\`yaml
operator: [nennen]
\`\`\`
**Musterlösung:** x
## 2099F-A1-b · 1 Punkt (Summe aus ba–bb)
### 2099F-A1-ba · 0,5 Punkte
\`\`\`yaml
operator: [nennen]
\`\`\`
**Musterlösung:** x
### 2099F-A1-bb · 0,5 Punkte
\`\`\`yaml
operator: [nennen]
\`\`\`
**Musterlösung:** x
# 2099F-A2 · 25 Punkte
## 2099F-A2-a · 25 Punkte
# 2099F-A3 · 25 Punkte
## 2099F-A3-a · 25 Punkte
# 2099F-A4 · 25 Punkte
## 2099F-A4-a · 25 Punkte
`;

test('Abschriften-Prüfer: stimmige Musterdatei hat keine Fehler', () => {
  const r = lies('2099F_AP1.md', MUSTER);
  assert.deepEqual(r.fehler, []);
  assert.equal(r.pruefung.teilaufgaben.filter((t) => t.blatt).length, 6);
});

const abschriftFehler = {
  'falsche Teilpunkte': (m) => m.replace('2099F-A1-a · 24 Punkte', '2099F-A1-a · 23 Punkte'),
  'falsche Unterteilpunkte': (m) => m.replace('2099F-A1-bb · 0,5 Punkte', '2099F-A1-bb · 1 Punkt'),
  'doppelte ID': (m) => m.replace('2099F-A3-a', '2099F-A2-a'),
  'fremde ID': (m) => m.replace('2099F-A4-a', '2098F-A4-a'),
  'Kopf passt nicht zum Dateinamen': (m) => m.replace('id: 2099F', 'id: 2099H'),
};
for (const [name, aendern] of Object.entries(abschriftFehler)) {
  test(`Abschriften-Prüfer erkennt: ${name}`, () => {
    assert.ok(lies('2099F_AP1.md', aendern(MUSTER)).fehler.length > 0);
  });
}

test('Abschriften-Prüfer: AP2-Dateinamen und Katalogstand', async () => {
  const { katalogFuer } = await import('../tools/umbau/pruefungen-pruefen.mjs');
  const pb = MUSTER.replaceAll('2099F', '2099W-PB1');
  assert.deepEqual(lies('2099W_AP2-PB1.md', pb).fehler, []);
  assert.ok(lies('2099W_AP2-PB2.md', pb).fehler.length > 0);
  assert.equal(katalogFuer('2024W-PB1'), 'alt');
  assert.equal(katalogFuer('2025S-PB2'), 'aktuell');
  assert.equal(katalogFuer('2024H'), 'alt');
  assert.equal(katalogFuer('2025F'), 'aktuell');
  assert.equal(katalogFuer('2025W'), null);
});

test('Abschriften-Prüfer: Aufgabe ohne Teilaufgaben ist selbst ein Blatt', () => {
  const ganz = MUSTER.replace('# 2099F-A2 · 25 Punkte\n## 2099F-A2-a · 25 Punkte\n', '# 2099F-A2 · 25 Punkte\n```yaml\noperator: [entwickeln]\n```\n**Musterlösung:** x\n');
  const r = lies('2099F_AP1.md', ganz);
  assert.deepEqual(r.fehler, []);
  assert.ok(r.pruefung.teilaufgaben.some((t) => t.id === '2099F-A2' && t.blatt && t.operator[0] === 'entwickeln'));
  const ohneYaml = MUSTER.replace('## 2099F-A2-a · 25 Punkte\n', '');
  assert.ok(lies('2099F_AP1.md', ohneYaml).fehler.length > 0);
});

// ---------- Zuordnung Teilaufgabe → Baustein (T2, goldene Regel) ----------
import { cpSync, rmSync } from 'node:fs';
const zuordnungDa = vorhanden && existsSync('umbau/fundament/pruefungen-ap1.json') && existsSync('umbau/zuordnung/ap1');

function zuordnungMit(veraendern) {
  const ordner = join(mkdtempSync(join(tmpdir(), 'zuo-')), 'ap1');
  cpSync('umbau/zuordnung/ap1', ordner, { recursive: true });
  veraendern(ordner);
  return spawnSync(process.execPath, ['tools/umbau/zuordnung-pruefen.mjs', 'ap1'], { encoding: 'utf8', env: { ...process.env, ZUORDNUNG_ORDNER: ordner } });
}
const aendereJson = (datei, f) => { const j = JSON.parse(readFileSync(datei, 'utf8')); f(j); writeFileSync(datei, JSON.stringify(j)); };

test('Zuordnung AP1 besteht T2 und die goldene Regel', { skip: !zuordnungDa && 'Quellen fehlen' }, () => {
  assert.equal(zuordnungMit(() => {}).status, 0);
});
const zuordnungFehler = {
  'fehlende Teilaufgabe': (o) => aendereJson(join(o, '2024H.json'), (j) => { delete j.teilaufgaben['2024H-A1-a']; }),
  'unbekannter Baustein': (o) => aendereJson(join(o, '2024H.json'), (j) => { j.teilaufgaben['2024H-A1-a'].bausteine = ['AP1.99.99']; }),
  '„kam nicht vor" als Begründung': (o) => aendereJson(join(o, '2024H.json'), (j) => { j.teilaufgaben['2024H-A1-a'] = { bausteine: [], typ: 'aufzaehlen', thema: 'x', ausserhalb: 'kam in keiner anderen Prüfung vor' }; }),
  'fehlende Prüfung': (o) => rmSync(join(o, '2025F.json')),
  'unbekannter Typ': (o) => aendereJson(join(o, '2024H.json'), (j) => { j.teilaufgaben['2024H-A1-a'].typ = 'raten'; }),
};
for (const [name, f] of Object.entries(zuordnungFehler)) {
  test(`Zuordnungs-Prüfer erkennt: ${name}`, { skip: !zuordnungDa && 'Quellen fehlen' }, () => {
    assert.equal(zuordnungMit(f).status, 1);
  });
}

// PB1 (P3): Bausteine mit Wohnort PB2 sind in PB1 nicht erlaubt, AP2-Bausteine nicht in AP1
const zuordnungPb1Da = vorhanden && existsSync('umbau/fundament/pruefungen-pb1.json') && existsSync('umbau/zuordnung/pb1');
function zuordnungPb1Mit(veraendern) {
  const ordner = join(mkdtempSync(join(tmpdir(), 'zuo-')), 'pb1');
  cpSync('umbau/zuordnung/pb1', ordner, { recursive: true });
  veraendern(ordner);
  return spawnSync(process.execPath, ['tools/umbau/zuordnung-pruefen.mjs', 'pb1'], { encoding: 'utf8', env: { ...process.env, ZUORDNUNG_ORDNER: ordner } });
}
test('Zuordnung PB1 besteht T2 und die goldene Regel', { skip: !zuordnungPb1Da && 'Quellen fehlen' }, () => {
  assert.equal(zuordnungPb1Mit(() => {}).status, 0);
});
test('Zuordnungs-Prüfer PB1 lehnt Baustein mit Wohnort PB2 ab (P3)', { skip: !zuordnungPb1Da && 'Quellen fehlen' }, () => {
  const r = zuordnungPb1Mit((o) => aendereJson(join(o, '2025W-PB1.json'), (j) => { j.teilaufgaben['2025W-PB1-A4-a'].bausteine = ['AP2b.04.22.4']; }));
  assert.equal(r.status, 1);
  assert.match(r.stdout, /wohnt in PB2/);
});
test('Zuordnung PB2 besteht T2 und die goldene Regel (Importe aus AP1 und PB1 erlaubt)', { skip: !(vorhanden && existsSync('umbau/fundament/pruefungen-pb2.json') && existsSync('umbau/zuordnung/pb2')) && 'Quellen fehlen' }, () => {
  const r = spawnSync(process.execPath, ['tools/umbau/zuordnung-pruefen.mjs', 'pb2'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
});
test('Zuordnungs-Prüfer AP1 lehnt AP2-Baustein ab', { skip: !zuordnungDa && 'Quellen fehlen' }, () => {
  assert.equal(zuordnungMit((o) => aendereJson(join(o, '2024H.json'), (j) => { j.teilaufgaben['2024H-A1-a'].bausteine = ['AP2b.04.10.1']; })).status, 1);
});

// ---------- Lernplan (Schicht 3+4), Probelauf AP1-6 ----------
const lernplanDa = zuordnungDa && existsSync('umbau/lernplan/ap1/AP1-6.json');
function lernplanMit(veraendern) {
  const lp = JSON.parse(readFileSync('umbau/lernplan/ap1/AP1-6.json', 'utf8'));
  veraendern(lp);
  const datei = join(mkdtempSync(join(tmpdir(), 'lp-')), 'AP1-6.json');
  writeFileSync(datei, JSON.stringify(lp));
  return spawnSync(process.execPath, ['tools/umbau/lernplan-pruefen.mjs', 'AP1-6'], { encoding: 'utf8', env: { ...process.env, LERNPLAN_DATEI: datei } });
}
const sp0 = (lp) => lp.themenbloecke[0].stichpunkte[0];
test('Lernplan AP1-6 besteht alle Prüfungen', { skip: !lernplanDa && 'Quellen fehlen' }, () => {
  const r = lernplanMit(() => {});
  assert.equal(r.status, 0, r.stdout);
});
const lernplanFehler = {
  'Können ohne Herkunft': (lp) => { sp0(lp).koennen[0].herkunft = []; },
  'Beleg, der nicht zum Stichpunkt gehört': (lp) => { sp0(lp).koennen[0].herkunft = ['beleg:2025H-A1-a']; },
  'Grenze ohne Katalogstelle': (lp) => { sp0(lp).grenzen = [{ text: 'x', begruendung: 'weil es so ist, ganz sicher', katalog: [] }]; },
  'Grenze mit „kam nicht vor“ (goldene Regel)': (lp) => { sp0(lp).grenzen = [{ text: 'IPv6-Subnetting', begruendung: 'kam in den Prüfungen nicht vor', katalog: ['AP1.04.01.3'] }]; },
  'zu wenige Können-Aussagen': (lp) => { sp0(lp).koennen = sp0(lp).koennen.slice(0, 2); },
  'alte ID geändert': (lp) => { sp0(lp).koennen[0].id = 'AP1-6-1-1-K9'; },
  'verschobene ID neu vergeben': (lp) => { lp.themenbloecke[2].stichpunkte[0].koennen[2].id = 'AP1-6-3-1-K3'; },
  'Tiefe nicht erreicht': (lp) => { for (const tb of lp.themenbloecke) for (const sp of tb.stichpunkte) for (const k of sp.koennen) if (sp.id === 'AP1-6-2-2') k.stufe = 1; },
};
for (const [name, f] of Object.entries(lernplanFehler)) {
  test(`Lernplan-Prüfer erkennt: ${name}`, { skip: !lernplanDa && 'Quellen fehlen' }, () => {
    assert.equal(lernplanMit(f).status, 1);
  });
}

// ---------- Eingefrorene Räume (E3, Schritt 5) ----------
test('Raum AP1 ist eingefroren: Export passt zum Lernplan', { skip: !existsSync('umbau/export/AP1.json') && 'kein Export' }, () => {
  const r = spawnSync(process.execPath, ['tools/umbau/export-raum.mjs', 'AP1', '--pruefen'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
});

// ---------- Raum PB1 (Schritt 6) ----------
const pb1Da = vorhanden && existsSync('umbau/fundament/pruefungen-pb1.json') && existsSync('umbau/lernplan/pb1');
test('Raum PB1: alle Ordner und die Raum-Prüfung (T1, T2b, T8, ALT) bestehen', { skip: !pb1Da && 'Quellen fehlen' }, () => {
  for (const f of readdirSync('umbau/lernplan/pb1').filter((x) => x.endsWith('.json'))) {
    const r = spawnSync(process.execPath, ['tools/umbau/lernplan-pruefen.mjs', f.replace('.json', '')], { encoding: 'utf8', env: { ...process.env, LERNPLAN_DATEI: `umbau/lernplan/pb1/${f}` } });
    assert.equal(r.status, 0, `${f}: ${r.stdout}`);
  }
  const r = spawnSync(process.execPath, ['tools/umbau/raum-pruefen.mjs', 'PB1'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
});

// ---------- Raum PB2 (Schritt 6) ----------
const pb2Da = vorhanden && existsSync('umbau/fundament/pruefungen-pb2.json') && existsSync('umbau/lernplan/pb2');
test('Raum PB2: alle Ordner und die Raum-Prüfung (T1, T2b, T8, ALT) bestehen', { skip: !pb2Da && 'Quellen fehlen' }, () => {
  for (const f of readdirSync('umbau/lernplan/pb2').filter((x) => x.endsWith('.json'))) {
    const r = spawnSync(process.execPath, ['tools/umbau/lernplan-pruefen.mjs', f.replace('.json', '')], { encoding: 'utf8', env: { ...process.env, LERNPLAN_DATEI: `umbau/lernplan/pb2/${f}` } });
    assert.equal(r.status, 0, `${f}: ${r.stdout}`);
  }
  const r = spawnSync(process.execPath, ['tools/umbau/raum-pruefen.mjs', 'PB2'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
});

// ---------- T7 / P36: Doppelungen zu früheren Räumen werden erkannt ----------
function pb2Mit(veraendern) {
  const lp = JSON.parse(readFileSync('umbau/lernplan/pb2/PB2-1.json', 'utf8'));
  veraendern(lp);
  const datei = join(mkdtempSync(join(tmpdir(), 'lp-')), 'PB2-1.json');
  writeFileSync(datei, JSON.stringify(lp));
  return spawnSync(process.execPath, ['tools/umbau/lernplan-pruefen.mjs', 'PB2-1'], { encoding: 'utf8', env: { ...process.env, LERNPLAN_DATEI: datei } });
}
/** fügt dem ersten Stichpunkt eine Aussage hinzu, die nur einen AP1-Baustein betrifft (wie eine Dublette) */
function dublette(lp, mitNeu) {
  const ap1 = JSON.parse(readFileSync('umbau/export/AP1.json', 'utf8'));
  const [id, x] = Object.entries(ap1.erreicht).find(([k, v]) => k.startsWith('AP1.') && v.stufe >= 2 && v.stufe <= 3);
  const sp = lp.themenbloecke[0].stichpunkte[0];
  sp.bausteine.push({ id });
  sp.baut_auf = [...(sp.baut_auf ?? []), x.stichpunkte[0]];
  sp.koennen = sp.koennen.slice(0, 6);
  const k = { id: `${sp.id}-K99`, text: 'Du kannst das beurteilen.', stufe: x.stufe + 1, herkunft: [`katalog:${id}`] }; // tiefer als AP1, damit nur „neu“ entscheidet
  if (mitNeu) k.neu = { gegenueber: [x.stichpunkte[0]], was: 'Testfall: etwas wirklich Neues' };
  sp.koennen.push(k);
}
test('T7 (P36): Aussage nur zu importiertem Baustein ohne „neu“ wird als Dublette erkannt', { skip: !pb2Da && 'Quellen fehlen' }, () => {
  const r = pb2Mit((lp) => dublette(lp, false));
  assert.equal(r.status, 1);
  assert.match(r.stdout, /T7: .* ohne Angabe „neu“/);
});
test('T7 (P36): mit „neu“ begründet ist dieselbe Aussage erlaubt', { skip: !pb2Da && 'Quellen fehlen' }, () => {
  const r = pb2Mit((lp) => dublette(lp, true));
  assert.doesNotMatch(r.stdout, /T7:/);
});
test('T7 (P36): importierter Baustein in „bausteine“ ohne neue Aussage wird erkannt', { skip: !pb2Da && 'Quellen fehlen' }, () => {
  const r = pb2Mit((lp) => {
    const ap1 = JSON.parse(readFileSync('umbau/export/AP1.json', 'utf8'));
    const [id, x] = Object.entries(ap1.erreicht).find(([k]) => k.startsWith('AP1.'));
    const sp = lp.themenbloecke[0].stichpunkte[0];
    sp.bausteine.push({ id });
    sp.baut_auf = [...(sp.baut_auf ?? []), x.stichpunkte[0]];
  });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /T7: .*importierter Baustein .* ohne Aussage mit „neu“/);
});

// ---------- Lernstand-Umzug (P6) ----------
test('P6: Umzugstabelle ist vollständig und aktuell', () => {
  const r = spawnSync(process.execPath, ['tools/umbau/umzug-erzeugen.mjs', '--pruefen'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
});
