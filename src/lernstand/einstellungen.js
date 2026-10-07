// Kleine Ansichts-Einstellungen (gewählter Raum, Filter, letzte Sicherung …).
// Kein Lernstand: geht beim Zurücksetzen des Browsers verloren, ohne dass Lernen verloren geht.

import { useState, useEffect } from 'preact/hooks';

const SCHLUESSEL = 'lernstudio.ansicht';
let werte = {};
try {
  werte = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}') ?? {};
} catch {
  werte = {};
}
const hoerer = new Set();

export function einstellung(name, standard) {
  return werte[name] ?? standard;
}

export function setzeEinstellung(name, wert) {
  werte = { ...werte, [name]: wert };
  try {
    localStorage.setItem(SCHLUESSEL, JSON.stringify(werte));
  } catch {}
  for (const h of hoerer) h();
}

export function useEinstellung(name, standard) {
  const [, neu] = useState(0);
  useEffect(() => {
    const h = () => neu((x) => x + 1);
    hoerer.add(h);
    return () => hoerer.delete(h);
  }, []);
  return [einstellung(name, standard), (wert) => setzeEinstellung(name, typeof wert === 'function' ? wert(einstellung(name, standard)) : wert)];
}
