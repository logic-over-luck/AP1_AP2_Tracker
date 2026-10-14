// Vorschau des neuen AP1-Lernplans (tools/vorschau-ap1.mjs): Umwandlung im Build.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ladeDaten } from '../tools/daten.mjs';
import { vorschauAp1, ladeLernplanAp1, ladeKartenAp1, ordnerVon } from '../tools/vorschau-ap1.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const alt = ladeDaten(wurzel);
const neu = vorschauAp1(alt, wurzel);
const plaene = ladeLernplanAp1(wurzel);
const kartenDateien = ladeKartenAp1(wurzel);

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

test('Karten hängen an einer Aussage ihres Stichpunkts, gestrichene fehlen (Ordner ohne neue Kartendatei)', () => {
  const altNeu = new Map(plaene.flatMap((p) => p.alt_neu.koennen.map((a) => [a.alt, a])));
  const gestrichen = new Set([...altNeu.values()].filter((a) => a.status === 'gestrichen').map((a) => a.alt));
  const altKarten = new Map(alt.karten.map((k) => [k.id, k]));
  for (const k of neu.karten.filter((k) => k.sp.startsWith('AP1'))) {
    const s = neu.sp[k.sp];
    if (kartenDateien.has(ordnerVon(k.sp))) {
      if (k.k) assert.ok(s?.koennen.some(([id]) => id === k.k), `Karte ${k.id}: ${k.k} gehört nicht zu ${k.sp}`);
      continue;
    }
    assert.ok(s, `Karte ${k.id}: Stichpunkt ${k.sp} fehlt`);
    if (k.k) assert.ok(s.koennen.some(([id]) => id === k.k), `Karte ${k.id}: ${k.k} gehört nicht zu ${k.sp}`);
    const vorher = altKarten.get(k.id);
    assert.equal(k.v, vorher.v);
    if (vorher.k) assert.equal(k.k, altNeu.get(vorher.k).neu);
  }
  const ids = new Set(neu.karten.map((k) => k.id));
  for (const k of alt.karten) {
    if (!k.k || !gestrichen.has(k.k) || kartenDateien.has(ordnerVon(k.sp))) continue;
    assert.ok(!ids.has(k.id), `gestrichene Karte ${k.id} noch da`);
  }
});

test('Kür ist kein Stichpunkt; neue Aussagen ohne Karten sind gekennzeichnet', () => {
  for (const s of Object.values(neu.sp).filter((s) => s.raum === 'AP1')) {
    assert.ok(s.neu.ziel, `${s.id} ohne Ziel`);
    for (const k of s.neu.koennen) if (k.status === 'neu') assert.equal(k.karten, neu.karten.filter((c) => c.k === k.id).length);
  }
  assert.equal(neu.vorschau.kuer, plaene.reduce((n, p) => n + p.themenbloecke.reduce((m, t) => m + t.stichpunkte.reduce((o, s) => o + (s.kuer ?? []).length, 0), 0), 0));
});

// Neue Karten (Schicht 5, umbau/auftraege/AP1-karten.md), je Ordner mit Datei in umbau/karten/ap1/
describe('Neue Lernkarten AP1', () => {
  const altKarten = new Map(alt.karten.filter((k) => k.sp.startsWith('AP1')).map((k) => [k.id, k]));
  const altNeu = new Map(plaene.flatMap((p) => p.alt_neu.koennen.map((a) => [a.alt, a])));
  const kNachSp = new Map();
  for (const p of plaene) for (const t of p.themenbloecke) for (const s of t.stichpunkte) for (const k of s.koennen) kNachSp.set(k.id, s.id);
  // Zielordner einer alten Karte: Ordner ihrer neuen Aussage, sonst ihr bisheriger Ordner
  const zielordner = (k) => {
    const n = k.k ? altNeu.get(k.k)?.neu : null;
    return ordnerVon(n ? kNachSp.get(n) : k.sp);
  };
  const entfernt = new Set();
  for (const d of kartenDateien.values()) for (const p of d.protokoll) if (p.entscheidung === 'entfernt') entfernt.add(p.id);

  test('keine Karten-ID doppelt, keine entfernte ID wieder da', () => {
    const ids = neu.karten.map((k) => k.id);
    assert.equal(new Set(ids).size, ids.length, 'doppelte Karten-ID');
    const da = new Set(ids);
    for (const id of entfernt) assert.ok(!da.has(id), `entfernte Karte ${id} ist wieder da`);
  });

  for (const [ordner, d] of kartenDateien) {
    const plan = plaene.find((p) => p.oberblock.id === ordner);
    test(`${ordner}: jede Aussage hat eine Karte oder steht in nicht_abgefragt`, () => {
      assert.ok(plan, `${ordner}: kein Lernplan`);
      const nicht = new Map(d.nicht_abgefragt.map((n) => [n.k, n]));
      for (const n of nicht.values()) assert.ok(n.grund?.trim(), `${ordner}: ${n.k} in nicht_abgefragt ohne Grund`);
      for (const t of plan.themenbloecke) for (const s of t.stichpunkte) for (const k of s.koennen) {
        assert.ok(d.karten.some((c) => c.k === k.id) || nicht.has(k.id), `${ordner}: ${k.id} hat keine Karte`);
      }
    });

    test(`${ordner}: Karten vollständig und an einer Aussage des Ordners`, () => {
      for (const c of d.karten) {
        for (const f of ['id', 'sp', 'k', 'vorne', 'hinten']) assert.ok(typeof c[f] === 'string' && c[f].trim(), `${c.id}: Feld ${f} fehlt`);
        assert.equal(ordnerVon(c.sp), ordner, `${c.id}: Stichpunkt ${c.sp} liegt nicht in ${ordner}`);
        assert.equal(kNachSp.get(c.k), c.sp, `${c.id}: ${c.k} gehört nicht zu ${c.sp}`);
      }
    });

    test(`${ordner}: Protokoll deckt jede alte und neue Karte, IDs nach Regel`, () => {
      const prot = new Map();
      for (const p of d.protokoll) {
        assert.ok(!prot.has(p.id), `${ordner}: ${p.id} doppelt im Protokoll`);
        assert.ok(['bleibt', 'bearbeitet', 'entfernt', 'neu'].includes(p.entscheidung), `${p.id}: Entscheidung ${p.entscheidung}`);
        assert.ok(p.grund?.trim(), `${p.id}: ohne Grund`);
        prot.set(p.id, p);
      }
      // jede alte Karte mit diesem Zielordner ist entschieden
      for (const k of altKarten.values()) if (zielordner(k) === ordner) assert.ok(prot.has(k.id), `${ordner}: alte Karte ${k.id} nicht entschieden`);
      const inDatei = new Map(d.karten.map((c) => [c.id, c]));
      for (const p of prot.values()) {
        const vorher = altKarten.get(p.id);
        if (p.entscheidung === 'neu') {
          assert.ok(!vorher, `${p.id}: als neu geführt, die ID war schon vergeben`);
          const c = inDatei.get(p.id);
          assert.ok(c, `${p.id}: neue Karte fehlt in karten`);
          const m = p.id.match(/^(.*)-(\d+)$/);
          assert.equal(m[1], c.k, `${p.id}: ID passt nicht zur Aussage ${c.k}`);
          const hoechste = Math.max(0, ...[...altKarten.keys()].filter((id) => id.startsWith(`${c.k}-`)).map((id) => Number(id.slice(c.k.length + 1))).filter(Number.isFinite));
          assert.ok(Number(m[2]) > hoechste, `${p.id}: Nummer nicht über der höchsten vergebenen (${hoechste})`);
          continue;
        }
        assert.ok(vorher, `${p.id}: ${p.entscheidung}, aber keine alte Karte`);
        assert.equal(zielordner(vorher), ordner, `${p.id}: gehört in die Datei von ${zielordner(vorher)}`);
        if (p.entscheidung === 'entfernt') assert.ok(!inDatei.has(p.id), `${p.id}: entfernt, steht aber in karten`);
        else {
          const c = inDatei.get(p.id);
          assert.ok(c, `${p.id}: ${p.entscheidung}, fehlt in karten`);
          const gleich = c.vorne === vorher.v && c.hinten === vorher.h;
          if (p.entscheidung === 'bleibt') assert.ok(gleich, `${p.id}: bleibt, Text aber geändert`);
          else assert.ok(!gleich, `${p.id}: bearbeitet, Text aber unverändert`);
        }
      }
      for (const c of d.karten) assert.ok(prot.has(c.id) && prot.get(c.id).entscheidung !== 'entfernt', `${c.id}: nicht im Protokoll`);
    });
  }
});
