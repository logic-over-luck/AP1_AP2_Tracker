// Regelwerk v2.x: Ein bisheriger Kür-Eintrag ist durch eine neue Pflicht-Aussage abgedeckt → Kür streichen,
// den Hinweis-Abgleich (R3) auf „Kern“ mit dieser Aussage umstellen, im Protokoll meta.v2 vermerken.
// Aufruf: node tools/umbau/v2-kuer-zu-pflicht.mjs <Ordner> <Stichpunkt> "<Anfang des Kür-Texts>" <Aussage-ID>[,<Aussage-ID>…]
import { readFileSync, writeFileSync } from 'node:fs';
const [ordner, spId, anfang, ids] = process.argv.slice(2);
const datei = `umbau/lernplan/${ordner.split('-')[0].toLowerCase()}/${ordner}.json`;
const text = readFileSync(datei, 'utf8');
const indent = [1, 2].find((n) => JSON.stringify(JSON.parse(text), null, n) === text.replace(/\n$/, '')) ?? 2;
const lp = JSON.parse(text);
const sp = lp.themenbloecke.flatMap((t) => t.stichpunkte).find((s) => s.id === spId);
const kIds = ids.split(',');
if (!sp) throw new Error(`Stichpunkt ${spId} fehlt`);
for (const k of kIds) if (!lp.themenbloecke.flatMap((t) => t.stichpunkte).some((s) => s.koennen.some((x) => x.id === k))) throw new Error(`Aussage ${k} fehlt`);
const i = (sp.kuer ?? []).findIndex((k) => k.text.startsWith(anfang));
if (i < 0) throw new Error(`Kür „${anfang}“ nicht gefunden`);
const [weg] = sp.kuer.splice(i, 1);
for (const t of lp.meta.hinweisabgleich?.themen ?? []) {
  if (t.ring === 'Kür' && t.wo.includes(spId) && (weg.text.startsWith(t.thema.slice(0, 40)) || t.thema.startsWith(weg.text.slice(0, 40).replace(/\.$/, '')))) {
    t.ring = 'Kern'; t.wo = kIds; t.notiz = `${t.notiz ? t.notiz + '; ' : ''}Regelwerk v2.1: bisher Kür, jetzt Pflicht (${kIds.join(', ')})`;
  }
}
const v2 = lp.meta.v2?.at(-1);
if (v2) (v2.kuer_gestrichen ??= []).push({ sp: spId, text: weg.text, grund: `jetzt Pflicht: ${kIds.join(', ')}` });
writeFileSync(datei, JSON.stringify(lp, null, indent) + (text.endsWith('\n') ? '\n' : ''));
console.log(`${spId}: Kür „${weg.text.slice(0, 60)}…“ gestrichen, jetzt ${kIds.join(', ')}`);
