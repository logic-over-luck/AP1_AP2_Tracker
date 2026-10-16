// Vorschau des neuen AP1-Lernplans (tools/vorschau-ap1.mjs): Umwandlung im Build.
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ladeDaten } from '../tools/daten.mjs';
import { vorschauAp1, vorschauAlle, RAEUME_VORSCHAU, ladeLernplanAp1, ladeKartenAp1, ladeKurzAp1, ordnerVon, artAusTypen } from '../tools/vorschau-ap1.mjs';

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

// Teaser und Erklärungen (umbau/kurz/ap1/AP1-<n>.json): je Stichpunkt ein Teaser, je Können-Aussage eine Erklärung
test('Teaser und Erklärungen: vollständig je Ordner, keine fremden IDs', async () => {
  const fs = await import('node:fs');
  const ordner = path.join(wurzel, 'umbau', 'kurz', 'ap1');
  if (!fs.existsSync(ordner)) return;
  for (const f of fs.readdirSync(ordner).filter((f) => /^AP1-\d+\.json$/.test(f))) {
    const d = JSON.parse(fs.readFileSync(path.join(ordner, f), 'utf8'));
    assert.ok(d.teaser && d.erklaerung, `${f}: Felder teaser und erklaerung fehlen`);
    const plan = plaene.find((p) => p.oberblock.id === d.ordner);
    assert.ok(plan, `${f}: kein Lernplan für ${d.ordner}`);
    const sps = plan.themenbloecke.flatMap((t) => t.stichpunkte);
    const spIds = sps.map((s) => s.id);
    const kIds = sps.flatMap((s) => s.koennen.map((k) => k.id));
    for (const id of spIds) assert.ok(typeof d.teaser?.[id] === 'string' && d.teaser[id].trim(), `${d.ordner}: Teaser für ${id} fehlt`);
    for (const id of kIds) assert.ok(typeof d.erklaerung?.[id] === 'string' && d.erklaerung[id].trim(), `${d.ordner}: Erklärung für ${id} fehlt`);
    for (const id of Object.keys(d.teaser ?? {})) assert.ok(spIds.includes(id), `${d.ordner}: ${id} ist kein Stichpunkt des Ordners`);
    for (const id of Object.keys(d.erklaerung ?? {})) assert.ok(kIds.includes(id), `${d.ordner}: ${id} ist keine Können-Aussage des Ordners`);
  }
  const { teaser, erklaerung } = ladeKurzAp1(wurzel);
  for (const [id, text] of teaser) assert.equal(neu.sp[id].neu.kurz, text);
  for (const s of Object.values(neu.sp).filter((s) => s.raum === 'AP1')) for (const k of s.neu.koennen) assert.equal(k.erklaerung, erklaerung.get(k.id) ?? null);
  assert.equal(neu.vorschau.kurz, teaser.size);
  assert.equal(neu.vorschau.erklaerungen, erklaerung.size);
});

test('P27: Art neuer Stichpunkte aus den Aufgabentypen', () => {
  assert.equal(artAusTypen([]), 'Wissen');
  assert.equal(artAusTypen(['diagramm', 'diagramm', 'erklaeren']), 'Zeichnen');
  assert.equal(artAusTypen(['berechnen', 'erklaeren']), 'Rechnen');
  assert.equal(artAusTypen(['code_schreiben', 'text', 'aufzaehlen', 'erklaeren']), 'Schreiben');
  assert.equal(artAusTypen(['diagramm', 'erklaeren', 'aufzaehlen']), 'Wissen');
});

// ---------- Vorschau PB1 (ersetzt in der App den Raum AP2) ----------
describe('Vorschau PB1 und PB2', () => {
  const cfg = RAEUME_VORSCHAU.PB1;
  const plaeneP = ladeLernplanAp1(wurzel, cfg);
  const plaene2 = ladeLernplanAp1(wurzel, RAEUME_VORSCHAU.PB2);
  const alle = vorschauAlle(alt, wurzel);
  const raum = alle.raeume.find((r) => r.id === 'PB1');
  test('Raum PB1 zeigt die Gliederung von PB1, AP1 bleibt, AP2 gibt es nicht mehr, PB2 neu oder als Platzhalter', { skip: !plaeneP.length && 'kein PB1' }, () => {
    assert.deepEqual(raum.ordner.map((o) => o.id), plaeneP.map((p) => p.oberblock.id));
    assert.deepEqual(alle.raeume.find((r) => r.id === 'AP1').ordner.map((o) => o.id), plaene.map((p) => p.oberblock.id));
    assert.equal(alle.vorschauRaeume.PB1.raum, 'PB1');
    assert.deepEqual(alle.raeume.map((r) => r.id), ['AP1', 'PB1', 'PB2', 'WISO']);
    if (plaene2.length) {
      assert.deepEqual(alle.raeume.find((r) => r.id === 'PB2').ordner.map((o) => o.id), plaene2.map((p) => p.oberblock.id));
      assert.equal(alle.raeume.find((r) => r.id === 'PB2').name, 'PB2');
      assert.equal(alle.vorschauRaeume.PB2.raum, 'PB2');
      assert.equal(alle.vorschauRaeume.PB2.koennen, plaene2.reduce((n, p) => n + p.themenbloecke.flatMap((t) => t.stichpunkte).reduce((m, s) => m + s.koennen.length, 0), 0));
    } else assert.ok(alle.vorschauRaeume.PB2.alt && alle.vorschauRaeume.PB2.stichpunkte > 0);
    assert.equal(alle.vorschauRaeume.AP1.raum, 'AP1');
  });
  test('keine alten AP2-Stichpunkte mehr, jede Karte hängt an einem vorhandenen Stichpunkt und einer Aussage', { skip: !plaeneP.length && 'kein PB1' }, () => {
    assert.equal(Object.values(alle.sp).filter((s) => s.raum === 'AP2').length, 0);
    for (const s of Object.values(alle.sp).filter((s) => s.raum === 'PB2')) assert.ok(s.id.startsWith(plaene2.length ? 'PB2-' : 'AP2-') && s.koennen.length, s.id);
    for (const [a, n] of Object.entries(alle.umzug.sp)) assert.ok((a.startsWith('WISO') ? ['WISO'] : ['PB1', 'PB2']).includes(alle.sp[n]?.raum) && !alle.sp[a], `Umzug ${a} → ${n}`);
    const kIds = new Set(Object.values(alle.sp).flatMap((s) => s.koennen.map(([id]) => id)));
    for (const k of alle.karten) {
      assert.ok(alle.sp[k.sp], `${k.id}: Stichpunkt ${k.sp} fehlt`);
      if (k.k) assert.ok(kIds.has(k.k), `${k.id}: Aussage ${k.k} fehlt`);
    }
    const ids = alle.karten.map((k) => k.id);
    assert.equal(new Set(ids).size, ids.length, 'Karten-ID doppelt');
  });
  test('PB2: jede alte Karte mit Aussage für PB2 ist in PB2 angekommen oder gestrichen', { skip: !plaene2.length && 'kein PB2' }, () => {
    const pb2 = new Set(plaeneP.flatMap((p) => p.alt_neu.koennen.filter((a) => a.status === 'PB2').map((a) => a.alt)));
    const altNeu = new Map(plaene2.flatMap((p) => p.alt_neu.koennen.map((a) => [a.alt, a])));
    const da = new Map(alle.karten.map((k) => [k.id, k]));
    const ersetzt = new Set(ladeKartenAp1(wurzel, RAEUME_VORSCHAU.PB2).keys());
    for (const k of alt.karten.filter((k) => k.k && pb2.has(k.k))) {
      const a = altNeu.get(k.k);
      assert.ok(a, `${k.k} fehlt im alt_neu von PB2`);
      if (a.status === 'gestrichen') continue;
      if (ersetzt.has(ordnerVon(a.neu))) continue; // entscheidet die Kartendatei des Ordners
      assert.equal(da.get(k.id)?.k, a.neu, `${k.id} → ${a.neu}`);
    }
  });
});

for (const R of ['PB1', 'PB2', 'WISO']) {
test(`${R}: Teaser und Erklärungen vollständig je Ordner, keine fremden IDs`, async () => {
  const fs = await import('node:fs');
  const cfg = RAEUME_VORSCHAU[R];
  const ordner = path.join(wurzel, 'umbau', 'kurz', cfg.dir);
  if (!fs.existsSync(ordner)) return;
  const plaeneP = ladeLernplanAp1(wurzel, cfg);
  for (const f of fs.readdirSync(ordner).filter((f) => new RegExp(`^${R}-\\d+\\.json$`).test(f))) {
    const d = JSON.parse(fs.readFileSync(path.join(ordner, f), 'utf8'));
    const plan = plaeneP.find((p) => p.oberblock.id === d.ordner);
    assert.ok(plan, `${f}: kein Lernplan für ${d.ordner}`);
    const sps = plan.themenbloecke.flatMap((t) => t.stichpunkte);
    const spIds = new Set(sps.map((s) => s.id));
    const kIds = new Set(sps.flatMap((s) => s.koennen.map((k) => k.id)));
    for (const id of spIds) assert.ok(d.teaser?.[id]?.trim(), `${d.ordner}: Teaser für ${id} fehlt`);
    for (const id of kIds) assert.ok(d.erklaerung?.[id]?.trim(), `${d.ordner}: Erklärung für ${id} fehlt`);
    for (const id of Object.keys(d.teaser)) assert.ok(spIds.has(id), `${d.ordner}: ${id} ist kein Stichpunkt des Ordners`);
    for (const id of Object.keys(d.erklaerung)) assert.ok(kIds.has(id), `${d.ordner}: ${id} ist keine Aussage des Ordners`);
  }
  const alle = vorschauAlle(alt, wurzel);
  const { teaser, erklaerung } = ladeKurzAp1(wurzel, cfg);
  assert.equal(alle.vorschauRaeume[R].kurz, teaser.size);
  assert.equal(alle.vorschauRaeume[R].erklaerungen, erklaerung.size);
});

// Neue Karten PB1 (umbau/karten/pb1/), Regeln wie AP1 (umbau/auftraege/AP1-karten.md)
describe(`Neue Lernkarten ${R}`, () => {
  const cfg = RAEUME_VORSCHAU[R];
  const plaeneP = ladeLernplanAp1(wurzel, cfg);
  const dateien = ladeKartenAp1(wurzel, cfg);
  const alle = vorschauAlle(alt, wurzel);
  const altKarten = new Map(alt.karten.filter((k) => k.sp.startsWith(cfg.altPrefix)).map((k) => [k.id, k]));
  const altNeu = new Map(plaeneP.flatMap((p) => p.alt_neu.koennen.map((a) => [a.alt, a])));
  const kNachSp = new Map();
  for (const p of plaeneP) for (const t of p.themenbloecke) for (const s of t.stichpunkte) for (const k of s.koennen) kNachSp.set(k.id, s.id);
  // Ordner, dessen Kartendatei eine alte Karte entscheidet; null: Aussage gestrichen (dann nur in alt_gestrichen)
  const zielordner = (k) => {
    const a = k.k ? altNeu.get(k.k) : null;
    if (a?.status === 'gestrichen') return null;
    return a?.neu && a.status !== 'PB2' ? ordnerVon(kNachSp.get(a.neu)) : ordnerVon(k.sp);
  };
  test('keine Karten-ID doppelt, keine entfernte ID wieder da, Vorschau nutzt die neuen Karten', { skip: !dateien.size && `keine ${R}-Karten` }, () => {
    const ids = alle.karten.map((k) => k.id);
    assert.equal(new Set(ids).size, ids.length);
    const da = new Set(ids);
    for (const d of dateien.values()) for (const p of d.protokoll) if (p.entscheidung === 'entfernt') assert.ok(!da.has(p.id), `${p.id} ist wieder da`);
    for (const [o, d] of dateien) for (const c of d.karten) assert.ok(da.has(c.id), `${o}: ${c.id} fehlt in der Vorschau`);
  });
  for (const [ordner, d] of dateien) {
    const plan = plaeneP.find((p) => p.oberblock.id === ordner);
    test(`${ordner}: jede Aussage hat eine Karte, Karten vollständig, Protokoll deckt alle alten Karten`, () => {
      assert.ok(plan, `${ordner}: kein Lernplan`);
      const nicht = new Set(d.nicht_abgefragt.map((n) => n.k));
      for (const t of plan.themenbloecke) for (const s of t.stichpunkte) for (const k of s.koennen) assert.ok(d.karten.some((c) => c.k === k.id) || nicht.has(k.id), `${k.id} ohne Karte`);
      for (const c of d.karten) {
        for (const f of ['id', 'sp', 'k', 'vorne', 'hinten']) assert.ok(typeof c[f] === 'string' && c[f].trim(), `${c.id}: ${f} fehlt`);
        assert.equal(kNachSp.get(c.k), c.sp, `${c.id}: ${c.k} gehört nicht zu ${c.sp}`);
        assert.equal(ordnerVon(c.sp), ordner);
      }
      const prot = new Map(d.protokoll.map((p) => [p.id, p]));
      assert.equal(prot.size, d.protokoll.length, 'doppelt im Protokoll');
      for (const k of altKarten.values()) if (zielordner(k) === ordner) assert.ok(prot.has(k.id), `alte Karte ${k.id} nicht entschieden`);
      // Karten gestrichener Aussagen stehen in alt_gestrichen, nicht im Protokoll (WISO: gleiche ID-Präfixe wie die neuen)
      for (const g of d.alt_gestrichen ?? []) assert.ok(altKarten.has(g.id) && zielordner(altKarten.get(g.id)) === null && !prot.has(g.id), `${g.id}: alt_gestrichen passt nicht`);
      const inDatei = new Map(d.karten.map((c) => [c.id, c]));
      for (const p of prot.values()) {
        assert.ok(p.grund?.trim(), `${p.id}: ohne Grund`);
        const vorher = altKarten.get(p.id);
        if (p.entscheidung === 'neu') {
          assert.ok(!vorher && inDatei.has(p.id), `${p.id}: neu, aber ID vergeben oder fehlt`);
          assert.equal(p.id.replace(/-\d+$/, ''), inDatei.get(p.id).k);
          continue;
        }
        assert.ok(vorher, `${p.id}: keine alte Karte`);
        assert.equal(zielordner(vorher), ordner, `${p.id}: gehört nach ${zielordner(vorher)}`);
        if (p.entscheidung === 'entfernt') assert.ok(!inDatei.has(p.id));
        else {
          const c = inDatei.get(p.id);
          const gleich = c.vorne === vorher.v && c.hinten === vorher.h;
          assert.ok(p.entscheidung === 'bleibt' ? gleich : !gleich, `${p.id}: ${p.entscheidung} passt nicht zum Text`);
        }
      }
    });
  }
});
}

test('P6: alter AP2-Lernstand wandert beim Ableiten in PB1, PB2-Karten behalten ihren Stand', async () => {
  const { baueIndex } = await import('../src/daten/index.js');
  const { ableiten } = await import('../src/lernstand/ableiten.js');
  const alle = vorschauAlle(alt, wurzel);
  const index = baueIndex(alle);
  const [altSp, neuSp] = Object.entries(alle.umzug.sp)[0];
  const pb2Karte = alle.karten.find((k) => alle.sp[k.sp]?.raum === 'PB2');
  const t = Date.now();
  const stand = ableiten(
    [
      { e: 'sp', id: altSp, an: true, t },
      { e: 'karte', id: pb2Karte.id, n: 3, t: t + 1 },
      { e: 'termin', r: 'AP2', d: '2027-05-01', t: t + 2 },
    ],
    index,
  );
  assert.ok(stand.spErledigt.has(neuSp), `${altSp} → ${neuSp} nicht übernommen`);
  assert.ok(stand.karten.has(pb2Karte.id));
  assert.equal(stand.termine.PB1, '2027-05-01');
  assert.equal(index.raumVon(altSp), 'PB1');
  assert.equal(index.raumVon(pb2Karte.id), 'PB2');
});

// ---------- Schritt 7: Importe anzeigen (E2/P36) und abgenommene Räume (P45) ----------
describe('Schritt 7: baut_auf, neu und Abnahme', () => {
  const alle = vorschauAlle(alt, wurzel);
  const raeumeMitPlan = ['AP1', 'PB1', 'PB2', 'WISO'].filter((R) => ladeLernplanAp1(wurzel, RAEUME_VORSCHAU[R]).length);
  const frueher = { PB1: ['AP1'], PB2: ['AP1', 'PB1'], WISO: ['AP1', 'PB1', 'PB2'] };

  for (const R of raeumeMitPlan) {
    const plaeneR = ladeLernplanAp1(wurzel, RAEUME_VORSCHAU[R]);
    const spPlan = plaeneR.flatMap((p) => p.themenbloecke.flatMap((t) => t.stichpunkte));

    test(`${R}: baut_auf kommt vollständig an und zeigt auf Stichpunkte früherer Räume`, () => {
      for (const s of spPlan) {
        const app = alle.sp[s.id];
        assert.deepEqual(app.neu.bautAuf, s.baut_auf ?? [], `${s.id}: baut_auf nicht durchgereicht`);
        for (const id of app.neu.bautAuf) {
          const ziel = alle.sp[id];
          assert.ok(ziel, `${s.id}: baut_auf ${id} gibt es in der App nicht`);
          assert.ok((frueher[R] ?? []).includes(ziel.raum), `${s.id}: baut_auf ${id} liegt in ${ziel.raum}, keinem früheren Raum`);
        }
      }
    });

    test(`${R}: Feld neu der Können-Aussagen kommt an, gegenueber zeigt auf vorhandene Stichpunkte`, () => {
      for (const s of spPlan) {
        const app = new Map(alle.sp[s.id].neu.koennen.map((k) => [k.id, k]));
        for (const k of s.koennen) {
          const a = app.get(k.id);
          if (!k.neu) {
            assert.equal(a.neu, null, `${k.id}: neu ohne Vorlage`);
            continue;
          }
          assert.deepEqual(a.neu.gegenueber, k.neu.gegenueber);
          assert.equal(a.neu.was, k.neu.was);
          assert.ok(a.neu.was.trim(), `${k.id}: neu.was leer`);
          for (const id of a.neu.gegenueber) assert.ok(alle.sp[id], `${k.id}: gegenueber ${id} gibt es nicht`);
        }
      }
    });

    test(`${R}: Abnahme (P45) kommt in der App an – ohne Abnahme zeigt sie den Hinweis „noch nicht endgültig“`, () => {
      assert.equal(alle.vorschauRaeume[R].abgenommen, RAEUME_VORSCHAU[R].abgenommen);
      assert.equal(RAEUME_VORSCHAU[R].abgenommen, true, `${R} ist abgenommen (P45, P52)`);
    });
  }

  test('PB1 und PB2 haben Importe und neu-Aussagen (sonst wäre die Anzeige leer)', { skip: raeumeMitPlan.length < 3 && 'PB1/PB2 fehlen' }, () => {
    for (const R of ['PB1', 'PB2']) {
      const sps = Object.values(alle.sp).filter((s) => s.raum === R);
      assert.ok(sps.some((s) => s.neu.bautAuf.length), `${R}: kein baut_auf`);
      assert.ok(sps.some((s) => s.neu.koennen.some((k) => k.neu)), `${R}: keine Aussage mit neu`);
    }
  });

});

// ---------- WISO (Schritt 6): neuer Lernplan an der Stelle des alten Raums, IDs bleiben (P48) ----------
describe('Vorschau WISO', () => {
  const plaeneW = ladeLernplanAp1(wurzel, RAEUME_VORSCHAU.WISO);
  const alle = vorschauAlle(alt, wurzel);
  const wiso = alle.raeume.find((r) => r.id === 'WISO');
  test('Raum WISO zeigt die Gliederung des Lernplans, Name „WiSo“ bleibt, an letzter Stelle', { skip: !plaeneW.length && 'kein WISO-Lernplan' }, () => {
    assert.equal(alle.raeume.at(-1).id, 'WISO');
    assert.equal(wiso.name, alt.raeume.find((r) => r.id === 'WISO').name);
    assert.deepEqual(wiso.ordner.map((o) => o.id), plaeneW.map((p) => p.oberblock.id));
    const spPlan = plaeneW.flatMap((p) => p.themenbloecke.flatMap((t) => t.stichpunkte));
    assert.deepEqual(wiso.ordner.flatMap((o) => o.bloecke.flatMap((b) => b.sp)), spPlan.map((s) => s.id));
    for (const s of spPlan) assert.deepEqual(alle.sp[s.id].koennen.map(([id]) => id), s.koennen.map((k) => k.id), s.id);
    assert.equal(Object.values(alle.sp).filter((s) => s.raum === 'WISO').length, spPlan.length);
    assert.equal(alle.vorschauRaeume.WISO.raum, 'WISO');
  });
  test('jede alte WiSo-Karte ist an ihrer neuen Aussage oder mit ihr gestrichen; Umzug nur für entfallene IDs', { skip: !plaeneW.length && 'kein WISO-Lernplan' }, () => {
    const altNeu = new Map(plaeneW.flatMap((p) => p.alt_neu.koennen.map((a) => [a.alt, a])));
    const da = new Map(alle.karten.map((k) => [k.id, k]));
    const ersetzt = new Set(ladeKartenAp1(wurzel, RAEUME_VORSCHAU.WISO).keys());
    for (const k of alt.karten.filter((k) => k.sp.startsWith('WISO') && k.k)) {
      const a = altNeu.get(k.k);
      assert.ok(a, `${k.k} fehlt im alt_neu`);
      if (a.status === 'gestrichen') continue;
      if (ersetzt.has(ordnerVon(a.neu))) continue; // entscheidet die Kartendatei des Ordners
      assert.equal(da.get(k.id)?.k, a.neu, `${k.id} → ${a.neu}`);
    }
    const wisoUmzug = Object.entries(alle.umzug.sp).filter(([a]) => a.startsWith('WISO'));
    assert.ok(wisoUmzug.length > 0);
    for (const [a, n] of wisoUmzug) assert.ok(!alle.sp[a] && alle.sp[n]?.raum === 'WISO', `${a} → ${n}`);
    // AP2-Umzug bleibt erhalten
    assert.ok(Object.keys(alle.umzug.sp).some((a) => a.startsWith('AP2')));
    assert.equal(alle.umzug.raeume.AP2, 'PB1');
  });
  test('P6: Haken an einem entfallenen WiSo-Stichpunkt landet beim neuen, ein weiterbestehender bleibt bei sich', { skip: !plaeneW.length && 'kein WISO-Lernplan' }, async () => {
    const { baueIndex } = await import('../src/daten/index.js');
    const { ableiten } = await import('../src/lernstand/ableiten.js');
    const index = baueIndex(alle);
    const [altSp, neuSp] = Object.entries(alle.umzug.sp).find(([a]) => a.startsWith('WISO'));
    const bleibt = 'WISO-3-4-2';
    const t = Date.now();
    const stand = ableiten([{ e: 'sp', id: altSp, an: true, t }, { e: 'sp', id: bleibt, an: true, t: t + 1 }], index);
    assert.ok(stand.spErledigt.has(neuSp), `${altSp} → ${neuSp}`);
    assert.ok(stand.spErledigt.has(bleibt), `${bleibt} umgeleitet`);
    assert.equal(index.raumVon(altSp), 'WISO');
  });
});

// ---------- Regelwerk v2.0: Marke „Buch“ (D4) und Wichtigkeit aus dem Lernfeld (D7) ----------
describe('Regelwerk v2.0 in der Vorschau', async () => {
  const { ersatzGewicht, ladeLernfelder } = await import('../tools/vorschau-ap1.mjs');
  const { baueIndex } = await import('../src/daten/index.js');
  const alle = vorschauAlle(alt, wurzel);
  const lf = ladeLernfelder(wurzel);
  test('D4: jede Aussage trägt herkunftArten; buch-Herkunft wird erkannt', () => {
    let n = 0;
    for (const s of Object.values(alle.sp)) for (const k of s.neu?.koennen ?? []) {
      n++;
      assert.deepEqual(k.herkunftArten, [...new Set(k.herkunft.map((h) => h.split(':')[0]))], k.id);
      assert.equal(k.herkunftArten.includes('buch'), k.herkunft.some((h) => h.startsWith('buch:')), k.id);
    }
    assert.ok(n > 1000);
  });
  test('D7: jeder Ordner hat ein Lernfeld mit Zeitrichtwert', () => {
    for (const r of Object.values(RAEUME_VORSCHAU)) for (const p of ladeLernplanAp1(wurzel, r)) {
      const e = lf.ordner[p.oberblock.id];
      assert.ok(e?.lernfelder?.length, p.oberblock.id);
      for (const x of e.lernfelder) assert.ok(lf.zeitrichtwerte[x] > 0, `${p.oberblock.id}: ${x}`);
    }
  });
  test('D7: Ersatzgewicht 0,5 × Zeitrichtwert / 80, höchstens „mittel“', () => {
    assert.equal(ersatzGewicht('AP1-7', lf).wert, 0.25); // LF4, 40 Stunden
    assert.equal(ersatzGewicht('AP1-4', lf).wert, 0.5); // LF2, 80 Stunden
    assert.equal(ersatzGewicht('AP1-1', lf).wert, 0.75); // LF12a, 120 Stunden
    assert.equal(ersatzGewicht('AP1-6', lf).wert, 0.5); // LF3 und LF9
    assert.equal(ersatzGewicht('XYZ-1', lf), null);
    for (const o of Object.keys(lf.ordner)) assert.ok(['normal', 'mittel'].includes(ersatzGewicht(o, lf).stufe), o);
  });
  test('D7: Stichpunkte ohne Beleg tragen das Lernfeld-Gewicht, mit Beleg bleibt es prüfungsbasiert', () => {
    let ohne = 0;
    for (const s of Object.values(alle.sp).filter((x) => x.neu)) {
      if (s.pruef.length) assert.equal(s.gewichtLernfeld, null, s.id);
      else {
        ohne++;
        assert.ok(s.gewichtLernfeld?.length, s.id);
        assert.equal(s.gewicht, ersatzGewicht(s.ordner, lf).wert, s.id);
      }
    }
    assert.ok(ohne > 0);
    const index = baueIndex(alle);
    for (const b of index.bloecke.values()) {
      const sps = b.sp.map((id) => index.sp.get(id));
      if (sps.every((s) => s.gewichtLernfeld)) assert.ok(b.gewicht >= Math.min(...sps.map((s) => s.gewicht)), b.id);
    }
  });
});
