// Vorschau des neuen AP1-Lernplans (tools/vorschau-ap1.mjs): Umwandlung im Build.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ladeDaten } from '../tools/daten.mjs';
import { vorschauAp1, ladeLernplanAp1 } from '../tools/vorschau-ap1.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const alt = ladeDaten(wurzel);
const neu = vorschauAp1(alt, wurzel);
const plaene = ladeLernplanAp1(wurzel);

test('AP1 zeigt genau die Gliederung der Lernpläne', () => {
  const ap1 = neu.raeume.find((r) => r.id === 'AP1');
  assert.deepEqual(
    ap1.ordner.map((o) => o.id),
    plaene.map((p) => p.oberblock.id),
  );
  const spPlan = plaene.flatMap((p) => p.themenbloecke.flatMap((t) => t.stichpunkte.map((s) => s.id)));
  const spApp = ap1.ordner.flatMap((o) => o.bloecke.flatMap((b) => b.sp));
  assert.deepEqual(spApp, spPlan);
  assert.equal(Object.values(neu.sp).filter((s) => s.raum === 'AP1').length, spPlan.length);
});

test('AP2 und WiSo bleiben unverändert', () => {
  for (const id of ['AP2', 'WISO']) assert.deepEqual(neu.raeume.find((r) => r.id === id), alt.raeume.find((r) => r.id === id));
  for (const [id, s] of Object.entries(alt.sp)) if (s.raum !== 'AP1') assert.deepEqual(neu.sp[id], s);
  assert.deepEqual(
    neu.karten.filter((k) => !k.sp.startsWith('AP1')),
    alt.karten.filter((k) => !k.sp.startsWith('AP1')),
  );
});

test('Karten hängen an einer Aussage ihres Stichpunkts, gestrichene fehlen', () => {
  const altNeu = new Map(plaene.flatMap((p) => p.alt_neu.koennen.map((a) => [a.alt, a])));
  const gestrichen = new Set([...altNeu.values()].filter((a) => a.status === 'gestrichen').map((a) => a.alt));
  const altKarten = new Map(alt.karten.map((k) => [k.id, k]));
  for (const k of neu.karten.filter((k) => k.sp.startsWith('AP1'))) {
    const s = neu.sp[k.sp];
    assert.ok(s, `Karte ${k.id}: Stichpunkt ${k.sp} fehlt`);
    if (k.k) assert.ok(s.koennen.some(([id]) => id === k.k), `Karte ${k.id}: ${k.k} gehört nicht zu ${k.sp}`);
    const vorher = altKarten.get(k.id);
    assert.equal(k.v, vorher.v);
    if (vorher.k) assert.equal(k.k, altNeu.get(vorher.k).neu);
  }
  const ids = new Set(neu.karten.map((k) => k.id));
  for (const k of alt.karten) if (k.k && gestrichen.has(k.k)) assert.ok(!ids.has(k.id), `gestrichene Karte ${k.id} noch da`);
});

test('Kür ist kein Stichpunkt; neue Aussagen ohne Karten sind gekennzeichnet', () => {
  for (const s of Object.values(neu.sp).filter((s) => s.raum === 'AP1')) {
    assert.ok(s.neu.ziel, `${s.id} ohne Ziel`);
    for (const k of s.neu.koennen) if (k.status === 'neu') assert.equal(k.karten, neu.karten.filter((c) => c.k === k.id).length);
  }
  assert.equal(neu.vorschau.kuer, plaene.reduce((n, p) => n + p.themenbloecke.reduce((m, t) => m + t.stichpunkte.reduce((o, s) => o + (s.kuer ?? []).length, 0), 0), 0));
});
