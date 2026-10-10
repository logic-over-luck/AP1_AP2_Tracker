// Tests für die Lernprompts im Lernplan: Block nur mit offenen Stichpunkten, Wiederholung, Abhaken-Signal.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ladeDaten } from '../tools/daten.mjs';
import { baueIndex } from '../src/daten/index.js';
import { lernpromptBlock, lernpromptStichpunkt, blockAuswahl } from '../src/bereiche/lernen/lernprompt.js';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const index = baueIndex(ladeDaten(wurzel));
const block = index.bloecke.get('AP1-6-2');
const stand = (erledigt = [], notizen = {}) => ({ spErledigt: new Map(erledigt.map((id) => [id, 1])), notizen: new Map(Object.entries(notizen)) });

test('Block-Prompt enthält jede Können-Aussage aller offenen Stichpunkte', () => {
  for (const b of index.bloecke.values()) {
    const text = lernpromptBlock(b, index);
    for (const id of b.sp) {
      const sp = index.sp.get(id);
      assert.ok(text.includes(sp.titel), `${b.id}: ${sp.titel}`);
      for (const [, k] of sp.koennen) assert.ok(text.includes(k), `${id}: ${k}`);
    }
  }
});

test('Block-Prompt nimmt nur offene Stichpunkte durch', () => {
  const [erster, ...rest] = block.sp;
  const text = lernpromptBlock(block, index, stand([erster]));
  const sp1 = index.sp.get(erster);
  assert.ok(text.includes(`Schon abgehakt (nur zur Einordnung, nicht neu durchnehmen): ${sp1.titel}`));
  assert.ok(!text.includes(sp1.koennen[0][1]), 'Können-Aussagen erledigter Stichpunkte fehlen');
  assert.ok(text.includes(`Noch offen sind ${rest.length} Stichpunkte`));
  assert.ok(text.includes(`Stichpunkt 1 von ${rest.length}: ${index.sp.get(rest[0]).titel}`));
  assert.ok(text.includes('Kannst du abhaken'));
  assert.ok(text.includes('ganze Block abgehakt'));
});

test('Ein offener Stichpunkt: kein Sitzungsablauf für mehrere', () => {
  const text = lernpromptBlock(block, index, stand(block.sp.slice(1)));
  assert.ok(text.includes('Noch offen ist ein Stichpunkt'));
  assert.ok(!text.includes('So läuft die Sitzung ab'));
  assert.deepEqual(blockAuswahl(block, stand(block.sp.slice(1))), { modus: 'lernen', ids: [block.sp[0]] });
});

test('Alles abgehakt: Block-Prompt wird zur Wiederholung', () => {
  const s = stand(block.sp);
  assert.equal(blockAuswahl(block, s).modus, 'wiederholen');
  const text = lernpromptBlock(block, index, s);
  assert.ok(text.includes('Jetzt geht es ums Wiederholen'));
  assert.ok(text.includes('wieder öffnen'));
  assert.ok(!text.includes('Kannst du abhaken'));
});

test('Zusatzschritt passt zur Art jedes Stichpunkts', () => {
  const text = lernpromptBlock(block, index);
  assert.ok(text.includes('- Rechnen: Gib mir zwei Rechenaufgaben'));
  assert.ok(text.includes('- Wissen: Fasse den Stichpunkt'));
  assert.ok(!text.includes('- Zeichnen:'));
  const ipv6 = lernpromptStichpunkt(index.sp.get('AP1-6-2-3'), index);
  assert.ok(ipv6.includes('4. Fasse den Stichpunkt'));
  assert.ok(!ipv6.includes('Rechenaufgaben'));
});

test('Stichpunkt-Prompt mit unklarer Tiefe und eigener Notiz', () => {
  const sp = [...index.sp.values()].find((s) => s.unklar);
  const text = lernpromptStichpunkt(sp, index, stand([], { [sp.id]: 'Meine Eselsbrücke' }));
  assert.ok(text.includes('Tiefe ist im Prüfungskatalog nicht eindeutig'));
  for (const a of sp.unklar.auslegungen) assert.ok(text.includes(`${a.kennung}) ${a.text}`));
  assert.ok(text.includes('Meine eigene Notiz dazu: Meine Eselsbrücke'));
  assert.ok(text.includes('Kannst du abhaken'));
  const wdh = lernpromptStichpunkt(sp, index, stand([sp.id]));
  assert.ok(wdh.includes('schon abgehakt') && wdh.includes('So möchte ich wiederholen'));
});
