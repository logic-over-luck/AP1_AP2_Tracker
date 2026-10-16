// Prüft den Prüfer: Wird ein absichtlich eingebauter Fehler in den Katalog-Bausteinen erkannt?
// Läuft nur, wenn die Katalogquelle lokal vorliegt (quellen/ ist nicht im Repo).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, writeFileSync, mkdtempSync, readdirSync, mkdirSync } from 'node:fs';
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

test('Abschriften-Prüfer: WiSo (30 Aufgaben ohne Teilaufgaben, je 3,33333 Punkte)', async () => {
  const { katalogFuer } = await import('../tools/umbau/pruefungen-pruefen.mjs');
  const aufgabe = (n) => `# 2099S-WISO-A${n} · 3,33333 Punkte\n\`\`\`yaml\noperator: [eintragen]\naufgabentyp: einfachauswahl\n\`\`\`\n**Musterlösung:** 1\n`;
  const kopf = '---\nid: 2099S-WISO\npunkte_gesamt: 100\naufgaben_anzahl: 30\naufgaben_punkte: je 3,33333\nlösungshinweise: ja\nvollständig: ja\n---\n';
  const wiso = kopf + Array.from({ length: 30 }, (_, i) => aufgabe(i + 1)).join('');
  const r = lies('2099S_WISO.md', wiso);
  assert.deepEqual(r.fehler, []);
  assert.equal(r.pruefung.teilaufgaben.filter((t) => t.blatt).length, 30);
  assert.equal(r.pruefung.teilaufgaben.find((t) => t.id === '2099S-WISO-A30').aufgabentyp, 'einfachauswahl');
  assert.ok(lies('2099S_WISO.md', kopf + Array.from({ length: 29 }, (_, i) => aufgabe(i + 1)).join('')).fehler.length > 0, '29 Aufgaben');
  assert.equal(katalogFuer('2024S-WISO'), 'alt');
  assert.equal(katalogFuer('2025W-WISO'), 'aktuell');
  assert.equal(katalogFuer('2025F-WISO'), null);
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
for (const R of ['AP1', 'PB1', 'PB2', 'WISO']) {
  test(`Raum ${R} ist eingefroren: Export passt zum Lernplan`, { skip: !existsSync(`umbau/export/${R}.json`) && 'kein Export' }, () => {
    const r = spawnSync(process.execPath, ['tools/umbau/export-raum.mjs', R, '--pruefen'], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stdout);
  });
}

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

test('P6/P48: eine alte ID, die im neuen Lernplan weiterbesteht, zeigt im Umzug auf sich selbst', () => {
  const u = JSON.parse(readFileSync('umbau/umzug.json', 'utf8'));
  const sp = new Set();
  const bl = new Set();
  for (const r of ['ap1', 'pb1', 'pb2', 'wiso']) {
    if (!existsSync(`umbau/lernplan/${r}`)) continue;
    for (const f of readdirSync(`umbau/lernplan/${r}`).filter((x) => x.endsWith('.json'))) {
      for (const t of JSON.parse(readFileSync(`umbau/lernplan/${r}/${f}`, 'utf8')).themenbloecke) {
        bl.add(t.id);
        for (const s of t.stichpunkte) sp.add(s.id);
      }
    }
  }
  const falsch = [
    ...Object.entries(u.stichpunkte).filter(([a, n]) => sp.has(a) && a !== n),
    ...Object.entries(u.bloecke).filter(([a, n]) => bl.has(a) && a !== n),
  ];
  assert.deepEqual(falsch, []);
});

// ---------- Raum WISO (Schritt 6) ----------
const wisoDa = vorhanden && existsSync('umbau/fundament/pruefungen-wiso.json') && existsSync('umbau/lernplan/wiso');
test('Zuordnung WISO besteht T2 und die goldene Regel (Z3b: Stufe aus dem Aufgabentyp, P46)', { skip: !wisoDa && 'Quellen fehlen' }, () => {
  const r = spawnSync(process.execPath, ['tools/umbau/zuordnung-pruefen.mjs', 'wiso'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
});
test('Raum WISO: alle Ordner und die Raum-Prüfung (T1, T2b, T8, ALT, Deckung P47) bestehen', { skip: !wisoDa && 'Quellen fehlen' }, () => {
  for (const f of readdirSync('umbau/lernplan/wiso').filter((x) => x.endsWith('.json'))) {
    const r = spawnSync(process.execPath, ['tools/umbau/lernplan-pruefen.mjs', f.replace('.json', '')], { encoding: 'utf8', env: { ...process.env, LERNPLAN_DATEI: `umbau/lernplan/wiso/${f}` } });
    assert.equal(r.status, 0, `${f}: ${r.stdout}`);
  }
  const r = spawnSync(process.execPath, ['tools/umbau/raum-pruefen.mjs', 'WISO'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
});
test('Regelwerk: Z3b gilt nur für WISO und kennt alle Aufgabentypen der Abschriften', () => {
  const z = JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8')).pruefungsoperatoren.z3b;
  assert.deepEqual(z.raeume, ['WISO']);
  assert.equal(z.stufe_nach_aufgabentyp.eintrag, 1);
  assert.equal(z.stufe_nach_aufgabentyp.rechnen, 3);
  for (const t of ['einfachauswahl', 'mehrfachauswahl', 'zuordnung', 'reihenfolge']) assert.equal(z.stufe_nach_aufgabentyp[t], 2);
});
test('Deckung P47: jeder gedeckte Baustein ist ein WISO-Baustein und zeigt auf Stichpunkte im Export', () => {
  const d = JSON.parse(readFileSync('umbau/regeln/wiso-deckung.json', 'utf8'));
  const exp = new Set();
  for (const r of ['AP1', 'PB1', 'PB2']) {
    const e = JSON.parse(readFileSync(`umbau/export/${r}.json`, 'utf8'));
    JSON.stringify(e).replace(/"((?:AP1|PB1|PB2)-\d+-\d+-\d+)"/g, (_, id) => exp.add(id));
  }
  const eintraege = Object.entries(d.bausteine);
  assert.ok(eintraege.length > 0);
  for (const [id, e] of eintraege) {
    assert.match(id, /^WISO\./);
    const sp = e.stichpunkte ?? [];
    assert.ok(sp.length && e.grund, `${id} ohne Stichpunkte oder Grund`);
    for (const s of sp) assert.ok(exp.has(s), `${id}: ${s} nicht im Export`);
  }
});

// ---------- Regelwerk v2.0: Lehrbuch als Tiefe (D1–D10, UMBAU.md 4.0) ----------
test('Regelwerk 2.0: Abschnitt buch mit Regel K, Herkunftsformat, Band-Kürzeln und F3 3–10', () => {
  const r = JSON.parse(readFileSync('umbau/regeln/regelwerk.json', 'utf8'));
  assert.ok(['2.0', '2.1'].includes(r.version));
  assert.equal(r.buch.form.f4_max, 8);
  for (const x of ['RK1', 'RK2', 'RK3', 'RK4', 'RK5', 'RK6']) assert.ok(r.buch.regel_k.schaerfung[x], x);
  assert.deepEqual(Object.keys(r.buch.baende), ['GS', 'FS', 'FS2']);
  const re = new RegExp(r.buch.herkunft.regex);
  for (const ok of ['GS-2.4.3', 'GS-2.4.3-S119', 'FS2-1.4', 'FS-3.7.5-S281']) assert.match(ok, re);
  for (const nein of ['GS-2', 'XY-1.2', 'GS-2.4.3-119', 'gs-2.4.3', 'GS-2.4.3.1.2']) assert.doesNotMatch(nein, re);
  assert.equal(r.buch.form.f3_min, 3);
  assert.equal(r.buch.form.f3_max, 10);
  assert.ok(r.buch.regel_k.dazu.length === 4 && r.buch.regel_k.nicht_dazu.length === 6);
});
const kopieK = (sp, n) => { for (let i = 0; i < n; i++) sp.koennen.push({ ...sp.koennen[0], id: `${sp.id}-K${90 + i}` }); };
test('Lernplan-Prüfer v2.0: Herkunft buch: im richtigen Format ist gültig', { skip: !lernplanDa && 'Quellen fehlen' }, () => {
  const r = lernplanMit((lp) => { sp0(lp).koennen[0].herkunft.push('buch:GS-3.4.5-S331'); sp0(lp).koennen[1].herkunft = ['buch:GS-3.4.5']; });
  assert.equal(r.status, 0, r.stdout);
});
test('Lernplan-Prüfer v2.0 erkennt: Buch-Herkunft im falschen Format', { skip: !lernplanDa && 'Quellen fehlen' }, () => {
  assert.equal(lernplanMit((lp) => { sp0(lp).koennen[0].herkunft = ['buch:Grundstufe 3.4.5']; }).status, 1);
});
test('Lernplan-Prüfer v2.0: F3 erlaubt bis 10 Aussagen, 11 nicht', { skip: !lernplanDa && 'Quellen fehlen' }, () => {
  const lp = JSON.parse(readFileSync('umbau/lernplan/ap1/AP1-6.json', 'utf8'));
  const n = sp0(lp).koennen.length;
  assert.equal(lernplanMit((x) => kopieK(sp0(x), 10 - n)).status, 0);
  assert.equal(lernplanMit((x) => kopieK(sp0(x), 11 - n)).status, 1);
});

// T10 mit einer kleinen Beispiel-Zuordnung und einer Kernpunkt-Datei (die echten liegen nur lokal, D9)
function buchMit(veraendern) {
  const dir = mkdtempSync(join(tmpdir(), 'buch-'));
  const zu = { meta: { erwartet: { GS: 1 } }, kapitel: { 'GS-3.4.5': { seiten: [330, 338], stichpunkte: ['AP1-6-2-1'] } } };
  const kern = { band: 'GS', kapitel: '3.4.5', seiten: [330, 338], stichpunkte: ['AP1-6-2-1'], kernpunkte: [
    { stichwort: 'MAC-Adresse als Hardware-Adresse', seite: 331, aussage: 'AP1-6-2-1-K1' },
    { stichwort: 'Adressklassen (veraltet)', seite: 333, filter: 'historie' },
  ] };
  veraendern(zu, kern);
  writeFileSync(join(dir, 'buch.json'), JSON.stringify(zu));
  const kd = join(dir, 'kern', 'GS');
  mkdirSync(kd, { recursive: true });
  writeFileSync(join(kd, '3.4.5.json'), JSON.stringify(kern));
  return spawnSync(process.execPath, ['tools/umbau/buch-pruefen.mjs'], { encoding: 'utf8', env: { ...process.env, BUCH_DATEI: join(dir, 'buch.json'), BUCH_KERN: join(dir, 'kern') } });
}
test('T10: stimmige Beispiel-Zuordnung besteht', () => {
  const r = buchMit(() => {});
  assert.equal(r.status, 0, r.stdout);
});
const buchFehler = {
  'Kernpunkt noch neu': (zu, k) => { k.kernpunkte.push({ stichwort: 'Ports', seite: 335, neu: true, stichpunkt: 'AP1-6-2-1' }); },
  'unbekannte Aussage': (zu, k) => { k.kernpunkte[0].aussage = 'AP1-6-2-1-K99'; },
  'Kernpunkt ohne Status': (zu, k) => { delete k.kernpunkte[0].aussage; },
  'unbekannter Filter-Grund': (zu, k) => { k.kernpunkte[1].filter = 'zu schwer'; },
  'Seite außerhalb des Kapitels': (zu, k) => { k.kernpunkte[0].seite = 400; },
  'Kapitel fehlt in buch.json': (zu) => { zu.meta.erwartet.GS = 2; },
  'unbekannter Stichpunkt': (zu, k) => { zu.kapitel['GS-3.4.5'].stichpunkte = ['AP1-6-9-9']; k.stichpunkte = ['AP1-6-9-9']; },
  'Stichpunkte in Datei und buch.json verschieden': (zu, k) => { k.stichpunkte = ['AP1-6-2-2']; },
};
for (const [name, f] of Object.entries(buchFehler)) {
  test(`T10 erkennt: ${name}`, () => {
    assert.equal(buchMit(f).status, 1);
  });
}
