import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeDaten } from '../tools/daten.mjs';
import { pruefeDiagramm, lueckenIn } from '../src/bereiche/trainer/modellieren/geometrie.js';
import { AUFGABEN, NOTATION, NOTATION_AP1 } from '../src/bereiche/trainer/modellieren/aufgaben/index.js';
import { TRAINER } from '../src/bereiche/trainer/verzeichnis.js';

const daten = await ladeDaten('.');
const spRaum = new Map((Array.isArray(daten.sp) ? daten.sp : Object.values(daten.sp)).map((s) => [s.id, s.raum]));
const modi = new Map(TRAINER.find((t) => t.id === 'modellieren').modi.map((m) => [m.id, m]));
const QUELLEN = /(Prüfung|Sommer|Winter|Herbst|Frühjahr)\s*(20\d\d|\d\d\/\d\d)|Podcast|Katalog|Belegsatz|Punkte\)/i;

test('jeder Modus hat Aufgaben', () => {
  for (const [id] of modi) assert.ok(AUFGABEN[id]?.length >= 3, `${id}: zu wenige Aufgaben`);
});

for (const [modus, liste] of Object.entries(AUFGABEN)) {
  test(`Aufgaben „${modus}" sind vollständig und stimmig`, () => {
    const ids = new Set();
    for (const n of [NOTATION[modus], NOTATION_AP1[modus]]) for (const b of n?.bilder ?? (n?.diagramm ? [n] : [])) assert.deepEqual(pruefeDiagramm(b.diagramm), [], `${modus} Notation`);
    for (const a of liste) {
      const wo = `${modus}/${a.id}`;
      assert.ok(a.id && !ids.has(a.id), `${wo}: id fehlt oder doppelt`);
      ids.add(a.id);
      assert.ok(['ergaenzen', 'fehler', 'fragen', 'zeichnen'].includes(a.art), `${wo}: art`);
      assert.ok(a.titel && a.text, `${wo}: titel/text`);
      assert.ok(Array.isArray(a.raum) && a.raum.length && a.raum.every((r) => r === 'AP1' || r === 'AP2'), `${wo}: raum`);
      assert.ok(modi.get(modus).sp.includes(a.sp), `${wo}: sp ${a.sp} gehört nicht zum Modus`);
      assert.ok(a.raum.includes(spRaum.get(a.sp)), `${wo}: sp ${a.sp} passt nicht zum Raum ${a.raum}`);
      assert.ok(a.raum.every((r) => modi.get(modus).sp.some((s) => spRaum.get(s) === r)), `${wo}: Modus gibt es in ${a.raum} nicht`);
      const texte = JSON.stringify([a.text, a.felder, a.loesung, a.pruefliste, a.hinweise, a.musterText]);
      assert.ok(!QUELLEN.test(texte), `${wo}: Quellen-/Prüfungsangabe im Text: ${texte.match(QUELLEN)?.[0]}`);
      for (const d of ['diagramm', 'muster', 'vorlage']) if (a[d]) assert.deepEqual(pruefeDiagramm(a[d]), [], `${wo}.${d}`);
      if (a.art === 'zeichnen') {
        assert.ok(a.muster || a.musterTabelle || a.musterText, `${wo}: Musterlösung fehlt`);
        assert.ok(a.pruefliste?.length >= 4, `${wo}: Prüfliste zu kurz`);
        continue;
      }
      assert.ok(a.felder?.length >= 1, `${wo}: felder`);
      assert.ok(a.loesung?.length >= 1, `${wo}: Erklärung fehlt`);
      const feldIds = new Set();
      for (const f of a.felder) {
        assert.ok(!feldIds.has(f.id), `${wo}: Feld ${f.id} doppelt`);
        feldIds.add(f.id);
        assert.ok(f.label, `${wo}: Feld ${f.id} ohne label`);
        assert.ok(Array.isArray(f.optionen) && f.optionen.length >= 2, `${wo}: Feld ${f.id} braucht Optionen`);
        assert.equal(new Set(f.optionen).size, f.optionen.length, `${wo}: Feld ${f.id} doppelte Option`);
        assert.ok(f.optionen.includes(f.erwartet), `${wo}: Feld ${f.id}: erwartet steht nicht in optionen`);
      }
      if (a.diagramm) {
        const luecken = lueckenIn(a.diagramm);
        const marken = [...JSON.stringify(a.diagramm).matchAll(/"marke":(\d+)/g)].map((m) => m[1]);
        for (const l of [...luecken, ...marken]) assert.ok(feldIds.has(l), `${wo}: Lücke/Marke ${l} ohne Feld`);
        for (const f of feldIds) if (/^\d+$/.test(f)) assert.ok(luecken.includes(f) || marken.includes(f), `${wo}: Feld ${f} ohne Lücke/Marke im Bild`);
        if (a.art === 'fehler') assert.ok(marken.length, `${wo}: Fehler-Aufgabe ohne Markierung`);
      }
    }
  });
}
