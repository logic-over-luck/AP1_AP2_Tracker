// Zentrale Stelle für den Lernstand in der App: Ereignisse erfassen, speichern, Stand
// neu berechnen und Komponenten benachrichtigen. Erkennt besondere Momente (Rangaufstieg,
// Block geschafft, Serien-Meilenstein) und meldet sie an die Feier-Anzeige.

import { useState, useEffect } from 'preact/hooks';
import { inhalt } from '../daten/inhalt.js';
import { ableiten } from './ableiten.js';
import { laden, speichern } from './speicher.js';
import { tagVon } from './zeit.js';

const SERIEN_MEILENSTEINE = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 365];

let ereignisse = [];
let stand = null;
let ladeFehler = null;
let speicherFehler = null;
const hoerer = new Set();
const feierHoerer = new Set();

function berechne() {
  stand = ableiten(ereignisse, inhalt, tagVon(Date.now()));
}

export function initialisiere() {
  const geladen = laden();
  ereignisse = geladen.ereignisse;
  ladeFehler = geladen.fehler ?? null;
  berechne();
  // Tageswechsel bei offener App erkennen
  const pruefeTag = () => {
    if (stand && stand.heute !== tagVon(Date.now())) {
      berechne();
      melde();
    }
  };
  setInterval(pruefeTag, 60000);
  document.addEventListener('visibilitychange', pruefeTag);
  // Änderungen aus einem zweiten Fenster übernehmen
  window.addEventListener('storage', (e) => {
    if (e.key && e.key === 'lernstudio.lernstand') {
      ereignisse = laden().ereignisse;
      berechne();
      melde();
    }
  });
}

function melde() {
  for (const h of hoerer) h();
}

function persistiere() {
  try {
    speichern(ereignisse);
    speicherFehler = null;
  } catch (e) {
    speicherFehler = 'Der Lernstand konnte nicht gespeichert werden. Bitte jetzt eine Sicherung herunterladen.';
  }
}

export function erfasse(...neue) {
  const vorher = stand;
  const jetzt = Date.now();
  for (const ev of neue) ereignisse.push({ t: jetzt, ...ev });
  berechne();
  persistiere();
  melde();
  erkenneMomente(vorher, stand, neue);
}

export function ersetzeAlle(liste) {
  ereignisse = [...liste];
  berechne();
  persistiere();
  melde();
}

export function alleEreignisse() {
  return ereignisse;
}

export function aktuellerStand() {
  return stand;
}

export function fehlerZustand() {
  return { ladeFehler, speicherFehler };
}

export function useLernstand() {
  const [, neu] = useState(0);
  useEffect(() => {
    const h = () => neu((x) => x + 1);
    hoerer.add(h);
    return () => hoerer.delete(h);
  }, []);
  return stand;
}

// ---------- Besondere Momente ----------

export function aufFeier(h) {
  feierHoerer.add(h);
  return () => feierHoerer.delete(h);
}

function feiere(moment) {
  for (const h of feierHoerer) h(moment);
}

function erkenneMomente(vorher, nachher, neue) {
  if (!vorher) return;
  if (nachher.rang.index > vorher.rang.index) {
    feiere({ art: 'rang', rang: nachher.rang });
    return;
  }
  for (const ev of neue) {
    if (ev.e === 'sp' && ev.an) {
      const sp = inhalt.sp.get(ev.id);
      if (sp && !vorher.blockErledigtAm.has(sp.block) && nachher.blockErledigtAm.has(sp.block)) {
        feiere({ art: 'block', block: inhalt.bloecke.get(sp.block) });
        return;
      }
    }
  }
  if (!vorher.serie.heuteAktiv && nachher.serie.heuteAktiv && SERIEN_MEILENSTEINE.includes(nachher.serie.aktuell)) {
    feiere({ art: 'serie', tage: nachher.serie.aktuell });
  }
}
