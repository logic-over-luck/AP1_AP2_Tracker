// Korrekturen an der Vorgabe (inhalte/korrekturen.json) prüfen und anwenden.
// Die Inhaltsdatei bleibt unverändert; wer Stichpunkte braucht, lädt sie über ladeInhalt().
// Format und Regeln: inhalte/README.md, Abschnitt „Korrekturen an der Vorgabe".

import fs from 'node:fs';
import path from 'node:path';

export const ARTEN = ['Wissen', 'Rechnen', 'Zeichnen', 'Schreiben'];
export const BELEG_QUELLEN = ['original', 'podcast_stichwort', 'forum'];
const SP_FELDER = { titel: 'stichpunkt', art: 'art', rahmen: 'rahmen', unklar: 'rahmen_unklar_details' };
export const WAS = ['titel', 'art', 'rahmen', 'unklar', 'koennen', 'koennen_neu', 'koennen_entfaellt', 'beleg_neu', 'beleg_falsch', 'punkte'];

const text = (w) => typeof w === 'string' && w.trim() !== '';
const kNummer = (id) => Number(id.match(/-K(\d+)$/)?.[1] ?? NaN);
const spVonK = (id) => id.replace(/-K\d+$/, '');

export function liesKorrekturen(wurzel) {
  const datei = path.join(wurzel, 'inhalte', 'korrekturen.json');
  return fs.existsSync(datei) ? JSON.parse(fs.readFileSync(datei, 'utf8')) : { pruefungen: [], korrekturen: [] };
}

// Passt ein Beleg zur Angabe in beleg_falsch? Prüfung muss stimmen, dazu Aufgabe oder Textanfang.
function belegPasst(b, w) {
  if (b.pruefung_id !== w.pruefung_id) return false;
  if (w.aufgabe !== undefined) return (b.aufgabe ?? null) === w.aufgabe;
  if (w.text !== undefined) return String(b.text).startsWith(w.text);
  return true;
}

// Liefert eine Liste von Fehlermeldungen (leer = alles in Ordnung).
export function pruefeKorrekturen(inhalt, korr) {
  const fehler = [];
  const spById = new Map(inhalt.stichpunkte.map((s) => [s.id, s]));
  const kAlt = new Set(inhalt.stichpunkte.flatMap((s) => s.koennen.map((k) => k.id)));
  const pruefungen = new Set((inhalt.meta?.pruefungen ?? []).map((p) => p.id));

  for (const [i, p] of (korr.pruefungen ?? []).entries()) {
    const ort = `pruefungen[${i}] ${p.id ?? '?'}`;
    if (!text(p.id)) fehler.push(`${ort}: id fehlt`);
    if (!text(p.grund)) fehler.push(`${ort}: grund fehlt`);
    if (!text(p.quelle)) fehler.push(`${ort}: quelle fehlt`);
    if (!pruefungen.has(p.id)) {
      for (const f of ['pruefung', 'termin', 'katalog']) if (!text(p[f])) fehler.push(`${ort}: neue Prüfung ohne ${f}`);
      if (typeof p.jahr !== 'number') fehler.push(`${ort}: neue Prüfung ohne jahr`);
    }
    if (p.katalog !== undefined && !['aktuell', 'alt'].includes(p.katalog)) fehler.push(`${ort}: katalog muss „aktuell" oder „alt" sein`);
    pruefungen.add(p.id);
  }

  const kNeu = new Set();
  const kWeg = new Set();
  const maxK = new Map();
  for (const s of inhalt.stichpunkte) maxK.set(s.id, Math.max(0, ...s.koennen.map((k) => kNummer(k.id))));

  for (const [i, e] of (korr.korrekturen ?? []).entries()) {
    const ort = `korrekturen[${i}] ${e.id ?? '?'} ${e.was ?? '?'}`;
    if (!WAS.includes(e.was)) {
      fehler.push(`${ort}: unbekanntes „was" (erlaubt: ${WAS.join(', ')})`);
      continue;
    }
    if (!text(e.grund)) fehler.push(`${ort}: grund fehlt`);
    if (!text(e.quelle)) fehler.push(`${ort}: quelle fehlt`);
    if (!text(e.id)) {
      fehler.push(`${ort}: id fehlt`);
      continue;
    }
    const istK = e.was.startsWith('koennen');
    const spId = istK ? spVonK(e.id) : e.id;
    const sp = spById.get(spId);
    if (!sp) {
      fehler.push(`${ort}: Stichpunkt ${spId} gibt es nicht`);
      continue;
    }
    if (istK && !/-K\d+$/.test(e.id)) fehler.push(`${ort}: Können-ID muss auf -K<Nummer> enden`);

    switch (e.was) {
      case 'titel':
      case 'rahmen':
        if (!text(e.wert)) fehler.push(`${ort}: wert fehlt`);
        break;
      case 'art':
        if (!ARTEN.includes(e.wert)) fehler.push(`${ort}: Art muss eine von ${ARTEN.join(', ')} sein`);
        break;
      case 'unklar':
        if (e.wert !== null && !(e.wert && Array.isArray(e.wert.auslegungen) && e.wert.auslegungen.every((a) => text(a.kennung) && text(a.text))))
          fehler.push(`${ort}: wert ist null (geklärt) oder { hinweis, auslegungen: [{ kennung, text }], nachsatz }`);
        break;
      case 'koennen':
        if (!kAlt.has(e.id) && !kNeu.has(e.id)) fehler.push(`${ort}: Können-Aussage gibt es nicht`);
        if (kWeg.has(e.id)) fehler.push(`${ort}: Können-Aussage ist schon als entfallen markiert`);
        if (!text(e.wert)) fehler.push(`${ort}: wert fehlt`);
        break;
      case 'koennen_neu':
        if (kAlt.has(e.id) || kNeu.has(e.id)) fehler.push(`${ort}: ID ist schon vergeben`);
        else if (kNummer(e.id) !== maxK.get(spId) + 1) fehler.push(`${ort}: neue ID muss fortlaufend sein (nächste: ${spId}-K${maxK.get(spId) + 1})`);
        if (!text(e.wert)) fehler.push(`${ort}: wert fehlt`);
        kNeu.add(e.id);
        maxK.set(spId, Math.max(maxK.get(spId), kNummer(e.id) || 0));
        break;
      case 'koennen_entfaellt':
        if (!kAlt.has(e.id) && !kNeu.has(e.id)) fehler.push(`${ort}: Können-Aussage gibt es nicht`);
        if (kWeg.has(e.id)) fehler.push(`${ort}: doppelt als entfallen markiert`);
        kWeg.add(e.id);
        break;
      case 'beleg_neu': {
        const w = e.wert ?? {};
        if (!pruefungen.has(w.pruefung_id)) fehler.push(`${ort}: Prüfung ${w.pruefung_id} gibt es nicht (ggf. unter „pruefungen" anlegen)`);
        if (!BELEG_QUELLEN.includes(w.quelle)) fehler.push(`${ort}: quelle des Belegs muss eine von ${BELEG_QUELLEN.join(', ')} sein`);
        if (!text(w.text)) fehler.push(`${ort}: Belegtext fehlt`);
        break;
      }
      case 'beleg_falsch': {
        const w = e.wert ?? {};
        const treffer = sp.belege.filter((b) => belegPasst(b, w));
        if (treffer.length !== 1) fehler.push(`${ort}: passt auf ${treffer.length} Belege (genau einer erwartet)`);
        break;
      }
      case 'punkte':
        if (!Number.isInteger(e.wert) || e.wert < 0 || e.wert > 100) fehler.push(`${ort}: Punkte als ganze Zahl 0–100`);
        break;
    }
  }
  return fehler;
}

// Wendet die Korrekturen auf eine Kopie der Inhaltsdatei an. Wirft bei Fehlern.
export function wendeKorrekturenAn(inhalt, korr) {
  const fehler = pruefeKorrekturen(inhalt, korr);
  if (fehler.length) throw new Error(`inhalte/korrekturen.json:\n- ${fehler.join('\n- ')}`);
  const neu = structuredClone(inhalt);
  const spById = new Map(neu.stichpunkte.map((s) => [s.id, s]));

  const pruefungen = new Map((neu.meta.pruefungen ?? []).map((p) => [p.id, p]));
  for (const { grund, quelle, ...p } of korr.pruefungen ?? []) {
    if (pruefungen.has(p.id)) Object.assign(pruefungen.get(p.id), p, { korrigiert: true });
    else pruefungen.set(p.id, { termin_hinweis: null, original_ausgewertet: false, quellen: [], ...p, korrigiert: true });
  }
  neu.meta.pruefungen = [...pruefungen.values()];

  for (const e of korr.korrekturen ?? []) {
    const sp = spById.get(e.was.startsWith('koennen') ? spVonK(e.id) : e.id);
    const vermerk = { grund: e.grund, quelle: e.quelle, was: e.was, id: e.id };
    (sp.korrekturen ??= []).push(vermerk);
    switch (e.was) {
      case 'titel':
      case 'art':
      case 'rahmen':
        sp[SP_FELDER[e.was]] = e.wert;
        break;
      case 'unklar':
        sp.rahmen_unklar = e.wert !== null;
        sp.rahmen_unklar_details = e.wert;
        break;
      case 'koennen': {
        const k = sp.koennen.find((k) => k.id === e.id);
        k.text = e.wert;
        k.korrigiert = true;
        break;
      }
      case 'koennen_neu':
        sp.koennen.push({ id: e.id, text: e.wert, vermerk: 'korrektur', korrigiert: true });
        break;
      case 'koennen_entfaellt':
        sp.koennen = sp.koennen.filter((k) => k.id !== e.id);
        (sp.koennen_entfallen ??= []).push(e.id);
        break;
      case 'beleg_neu': {
        const p = pruefungen.get(e.wert.pruefung_id);
        sp.belege.push({
          quelle: e.wert.quelle,
          pruefung: p.pruefung,
          pruefung_id: p.id,
          termin: p.termin,
          termin_hinweis: p.termin_hinweis ?? null,
          bereich: e.wert.bereich ?? null,
          katalog: p.katalog,
          aufgabe: e.wert.aufgabe ?? null,
          text: e.wert.text,
          korrigiert: true,
        });
        break;
      }
      case 'beleg_falsch':
        sp.belege.find((b) => !b.falsch && belegPasst(b, e.wert)).falsch = true;
        break;
      case 'punkte':
        sp.punkte = e.wert;
        break;
    }
  }
  // Termin und Katalog der Belege folgen dem (ggf. korrigierten) Prüfungsverzeichnis.
  for (const s of neu.stichpunkte)
    for (const b of s.belege) {
      const p = pruefungen.get(b.pruefung_id);
      if (p?.korrigiert) Object.assign(b, { termin: p.termin, katalog: p.katalog, termin_hinweis: p.termin_hinweis ?? null });
    }
  return neu;
}

// Inhaltsdatei samt Korrekturen – die Fassung, die App, Lernprompts und Prüfskripte sehen.
export function ladeInhalt(wurzel) {
  const inhalt = JSON.parse(fs.readFileSync(path.join(wurzel, 'Inhaltsdatei_AP1_AP2_tracker.json'), 'utf8'));
  return wendeKorrekturenAn(inhalt, liesKorrekturen(wurzel));
}
