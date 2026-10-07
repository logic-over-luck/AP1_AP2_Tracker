#!/usr/bin/env node
// Prüft die Paketdateien in inhalte/lernen gegen die Inhaltsdatei.
// Aufruf: node tools/inhalte-pruefen.mjs [datei ...]
// Ohne Argument werden alle Pakete geprüft und die Gesamtabdeckung ausgegeben.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inhalt = JSON.parse(fs.readFileSync(path.join(wurzel, 'Inhaltsdatei_AP1_AP2_tracker.json'), 'utf8'));

const spById = new Map(inhalt.stichpunkte.map((s) => [s.id, s]));
const blockById = new Map();
for (const teil of inhalt.struktur)
  for (const ordner of teil.ordner)
    for (const block of ordner.bloecke) blockById.set(block.id, block);

const PAKETE = {
  'WISO-1a': ['WISO-1-1', 'WISO-1-2', 'WISO-1-3', 'WISO-1-4'],
  'WISO-1b': ['WISO-1-5', 'WISO-1-6', 'WISO-1-7', 'WISO-1-8'],
};
function bloeckeDesPakets(paket) {
  if (PAKETE[paket]) return PAKETE[paket];
  if (paket === 'WISO-4-5') return [...blockById.keys()].filter((b) => b.startsWith('WISO-4-') || b.startsWith('WISO-5-'));
  return [...blockById.keys()].filter((b) => b.startsWith(paket + '-'));
}

const fehler = [];
const warnungen = [];
const gesehen = { karten: new Set(), koennenAbgedeckt: new Set(), sp: new Set(), bloecke: new Set() };
let anzahlKarten = 0;

function pruefeText(ort, wert, max, pflicht = true) {
  if (typeof wert !== 'string' || (pflicht && wert.trim() === '')) {
    fehler.push(`${ort}: Text fehlt`);
    return;
  }
  if (wert.length > max) fehler.push(`${ort}: ${wert.length} Zeichen (höchstens ${max})`);
  if (/Prüfung (19|20)\d\d|Podcast|Gedächtnisprotokoll|Belegsatz/.test(wert))
    warnungen.push(`${ort}: enthält vermutlich einen Prüfungs- oder Quellenverweis`);
  if (/"[^"]*"/.test(wert)) warnungen.push(`${ort}: gerade Anführungszeichen statt „…"`);
}

function pruefeDatei(datei) {
  let daten;
  try {
    daten = JSON.parse(fs.readFileSync(datei, 'utf8'));
  } catch (e) {
    fehler.push(`${datei}: kein gültiges JSON (${e.message})`);
    return;
  }
  const name = path.basename(datei);
  const paket = daten.paket;
  const sollBloecke = bloeckeDesPakets(paket);
  if (!sollBloecke.length) {
    fehler.push(`${name}: unbekanntes Paket "${paket}"`);
    return;
  }
  const sollSp = sollBloecke.flatMap((b) => blockById.get(b).stichpunkte);

  for (const b of sollBloecke) {
    const e = daten.bloecke?.[b];
    if (!e) fehler.push(`${name}: Block ${b} fehlt`);
    else pruefeText(`${name} ${b}.satz`, e.satz, 160);
    gesehen.bloecke.add(b);
  }
  for (const b of Object.keys(daten.bloecke ?? {}))
    if (!sollBloecke.includes(b)) fehler.push(`${name}: Block ${b} gehört nicht zum Paket`);

  for (const s of sollSp) {
    const e = daten.stichpunkte?.[s];
    gesehen.sp.add(s);
    if (!e) {
      fehler.push(`${name}: Kurzfassung für ${s} fehlt`);
      continue;
    }
    pruefeText(`${name} ${s}.ziel`, e.ziel, 200);
    if (!Array.isArray(e.punkte) || e.punkte.length < 2 || e.punkte.length > 5)
      fehler.push(`${name} ${s}.punkte: 2 bis 5 Punkte erwartet`);
    else e.punkte.forEach((p, i) => {
      pruefeText(`${name} ${s}.punkte[${i}]`, p, 110);
      if (/\.$/.test(p) && !/\.\.\.$|usw\.$|z\. B\.$/.test(p)) warnungen.push(`${name} ${s}.punkte[${i}]: Schlusspunkt`);
    });
  }
  for (const s of Object.keys(daten.stichpunkte ?? {}))
    if (!sollSp.includes(s)) fehler.push(`${name}: Stichpunkt ${s} gehört nicht zum Paket`);

  const idsInDatei = new Set();
  for (const [i, k] of (daten.karten ?? []).entries()) {
    const ort = `${name} karten[${i}] ${k.id ?? '?'}`;
    if (!k.id || typeof k.id !== 'string') {
      fehler.push(`${ort}: id fehlt`);
      continue;
    }
    if (gesehen.karten.has(k.id) || idsInDatei.has(k.id)) fehler.push(`${ort}: ID doppelt`);
    idsInDatei.add(k.id);
    gesehen.karten.add(k.id);
    anzahlKarten++;
    const sp = spById.get(k.sp);
    if (!sp || !sollSp.includes(k.sp)) {
      fehler.push(`${ort}: Stichpunkt ${k.sp} unbekannt oder nicht im Paket`);
      continue;
    }
    if (k.k === null) {
      if (!new RegExp(`^${k.sp}-X\\d+$`).test(k.id)) fehler.push(`${ort}: ID muss ${k.sp}-X<n> lauten`);
    } else {
      if (!sp.koennen.some((kk) => kk.id === k.k)) fehler.push(`${ort}: Können-ID ${k.k} gehört nicht zu ${k.sp}`);
      if (!new RegExp(`^${k.k}-\\d+$`).test(k.id)) fehler.push(`${ort}: ID muss ${k.k}-<n> lauten`);
      gesehen.koennenAbgedeckt.add(k.k);
    }
    pruefeText(`${ort}.vorne`, k.vorne, 300);
    pruefeText(`${ort}.hinten`, k.hinten, 400);
    if (typeof k.hinten === 'string' && k.hinten.length > 260) warnungen.push(`${ort}.hinten: ${k.hinten.length} Zeichen – lässt sich das kürzen?`);
  }

  const ohneKarte = new Set();
  for (const s of sollSp) for (const kk of spById.get(s).koennen) if (!(daten.karten ?? []).some((k) => k.k === kk.id)) ohneKarte.add(kk.id);
  for (const n of daten.nicht_abgefragt ?? []) {
    if (!ohneKarte.has(n.k)) warnungen.push(`${name}: nicht_abgefragt ${n.k} hat doch eine Karte oder ist unbekannt`);
    if (!n.grund) fehler.push(`${name}: nicht_abgefragt ${n.k} ohne Grund`);
    ohneKarte.delete(n.k);
  }
  for (const k of ohneKarte) fehler.push(`${name}: Können ${k} hat weder Karte noch Eintrag in nicht_abgefragt`);

  for (const [i, g] of (daten.glossar ?? []).entries()) {
    const ort = `${name} glossar[${i}] ${g.begriff ?? '?'}`;
    pruefeText(`${ort}.begriff`, g.begriff, 80);
    pruefeText(`${ort}.erklaerung`, g.erklaerung, 240);
    if (g.langform !== undefined && g.langform !== null) pruefeText(`${ort}.langform`, g.langform, 160);
    if (!Array.isArray(g.sp) || !g.sp.length) fehler.push(`${ort}: sp fehlt`);
    else for (const s of g.sp) if (!spById.has(s)) fehler.push(`${ort}: Stichpunkt ${s} unbekannt`);
  }
  for (const u of daten.unsicher ?? []) if (!u.id || !u.frage) fehler.push(`${name}: unsicher-Eintrag unvollständig`);

  console.log(
    `${name.padEnd(16)} Blöcke ${Object.keys(daten.bloecke ?? {}).length}  Stichpunkte ${Object.keys(daten.stichpunkte ?? {}).length}  ` +
      `Karten ${(daten.karten ?? []).length}  ohne Karte ${(daten.nicht_abgefragt ?? []).length}  Glossar ${(daten.glossar ?? []).length}  unsicher ${(daten.unsicher ?? []).length}`,
  );
}

const ordner = path.join(wurzel, 'inhalte', 'lernen');
const argumente = process.argv.slice(2);
const dateien = argumente.length
  ? argumente
  : fs.readdirSync(ordner).filter((f) => f.endsWith('.json')).sort().map((f) => path.join(ordner, f));
for (const d of dateien) pruefeDatei(d);

if (!argumente.length) {
  const alleBloecke = [...blockById.keys()];
  const fehlendeBloecke = alleBloecke.filter((b) => !gesehen.bloecke.has(b));
  console.log(`\nGesamt: ${anzahlKarten} Karten, ${gesehen.sp.size}/${spById.size} Stichpunkte, ${gesehen.bloecke.size}/${alleBloecke.length} Blöcke`);
  if (fehlendeBloecke.length) console.log(`Noch ohne Paket: ${fehlendeBloecke.length} Blöcke`);
}
for (const w of warnungen) console.log('Warnung:', w);
for (const f of fehler) console.log('FEHLER:', f);
console.log(fehler.length ? `\n${fehler.length} Fehler` : '\nKeine Fehler.');
process.exit(fehler.length ? 1 : 0);
