// Speichern, Sichern und Einlesen des Lernstands.
//
// Der Lernstand ist ein Ereignisprotokoll im localStorage des Browsers, getrennt vom Inhalt.
// Beide sind nur über IDs verbunden. Das Format trägt eine Versionsnummer; ältere Stände
// werden beim Laden auf die aktuelle Version gehoben (migriere).

export const FORMAT = 1;
export const SCHLUESSEL = 'lernstudio.lernstand';
export const APP_KENNUNG = 'Lernstudio Fachinformatik';

const ERLAUBTE_TYPEN = new Set(['sp', 'wdh', 'karte', 'merken', 'aufgabe', 'fokus', 'termin', 'notiz']);

export class SicherungsFehler extends Error {}

// Hebt gespeicherte Daten auf das aktuelle Format. Jede künftige Formatänderung bekommt
// hier einen Schritt, damit alte Sicherungen lesbar bleiben.
export function migriere(roh) {
  if (!roh || typeof roh !== 'object') throw new SicherungsFehler('Die Datei enthält keinen Lernstand.');
  let daten = { ...roh };
  if (daten.format === undefined && Array.isArray(daten.ereignisse)) daten.format = 1;
  if (typeof daten.format !== 'number') throw new SicherungsFehler('Die Datei enthält keinen Lernstand des Lernstudios.');
  if (daten.format > FORMAT)
    throw new SicherungsFehler(`Diese Sicherung stammt aus einer neueren Version (Format ${daten.format}). Bitte die neueste Lernstudio.html verwenden.`);
  // if (daten.format === 1) { …umbauen…; daten.format = 2; }
  if (!Array.isArray(daten.ereignisse)) throw new SicherungsFehler('In der Datei fehlt das Ereignisprotokoll.');
  return { format: FORMAT, ereignisse: bereinige(daten.ereignisse) };
}

// Wirft kaputte oder unbekannte Einträge heraus und sortiert nach Zeit.
export function bereinige(liste) {
  return liste
    .filter((ev) => ev && typeof ev === 'object' && typeof ev.t === 'number' && Number.isFinite(ev.t) && ERLAUBTE_TYPEN.has(ev.e))
    .sort((a, b) => a.t - b.t);
}

// Zwei Protokolle zusammenführen, doppelte Einträge nur einmal behalten.
export function zusammenfuehren(a, b) {
  const gesehen = new Set();
  const ergebnis = [];
  for (const ev of [...a, ...b]) {
    const key = JSON.stringify(ev);
    if (gesehen.has(key)) continue;
    gesehen.add(key);
    ergebnis.push(ev);
  }
  return bereinige(ergebnis);
}

export function laden(speicher = globalThis.localStorage) {
  try {
    const text = speicher?.getItem(SCHLUESSEL);
    if (!text) return { ereignisse: [], neu: true };
    return { ...migriere(JSON.parse(text)), neu: false };
  } catch (e) {
    // Beschädigte Daten nicht überschreiben: eine Kopie zur Rettung ablegen.
    try {
      const text = speicher.getItem(SCHLUESSEL);
      if (text) speicher.setItem(`${SCHLUESSEL}.defekt.${Date.now()}`, text);
    } catch {}
    return { ereignisse: [], neu: true, fehler: e.message };
  }
}

export function speichern(ereignisse, speicher = globalThis.localStorage) {
  speicher.setItem(SCHLUESSEL, JSON.stringify({ format: FORMAT, ereignisse }));
}

export function sicherungErstellen(ereignisse, jetzt = new Date()) {
  return {
    app: APP_KENNUNG,
    format: FORMAT,
    exportiert: jetzt.toISOString(),
    anzahl: ereignisse.length,
    ereignisse,
  };
}

export function sicherungLesen(text) {
  let roh;
  try {
    roh = JSON.parse(text);
  } catch {
    throw new SicherungsFehler('Die Datei ist keine gültige Sicherung (kein JSON).');
  }
  if (roh?.app && roh.app !== APP_KENNUNG) throw new SicherungsFehler('Die Datei stammt nicht aus dem Lernstudio.');
  return migriere(roh);
}
