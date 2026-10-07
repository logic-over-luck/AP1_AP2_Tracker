// Geometrie und Prüfung der Diagrammbeschreibungen – ohne JSX, damit die Tests sie laden können.

export const PX = 12; // Grundschrift
export const ZEILE = 15;
export const ZEICHEN = 6.4; // mittlere Zeichenbreite bei 12 px

export function umbrechen(text, maxZeichen) {
  const zeilen = [];
  for (const absatz of String(text ?? '').split('\n')) {
    if (!maxZeichen || absatz.length <= maxZeichen) {
      zeilen.push(absatz);
      continue;
    }
    let z = '';
    for (const wort of absatz.split(' ')) {
      if (z && (z + ' ' + wort).length > maxZeichen) {
        zeilen.push(z);
        z = wort;
      } else z = z ? z + ' ' + wort : wort;
    }
    if (z) zeilen.push(z);
  }
  return zeilen;
}

export const laenge = (t) => String(t ?? '').replace(/\{\d+\}/g, '[0]').length;


export const STANDARD = {
  akteur: [36, 62, 'rechteck'],
  anwendungsfall: [150, 52, 'ellipse'],
  aktion: [130, 40, 'rechteck'],
  start: [20, 20, 'ellipse'],
  ende: [24, 24, 'ellipse'],
  ablaufende: [22, 22, 'ellipse'],
  entscheidung: [28, 28, 'raute'],
  balken: [120, 7, 'rechteck'],
  zustand: [140, 44, 'rechteck'],
  entitaet: [120, 42, 'rechteck'],
  beziehung: [110, 52, 'raute'],
  attribut: [104, 34, 'ellipse'],
  ereignis: [140, 50, 'rechteck'],
  funktion: [140, 50, 'rechteck'],
  org: [130, 44, 'ellipse'],
  info: [120, 40, 'rechteck'],
  konnektor: [32, 32, 'ellipse'],
  aufgabe: [120, 54, 'rechteck'],
  startereignis: [32, 32, 'ellipse'],
  zwischenereignis: [32, 32, 'ellipse'],
  endereignis: [32, 32, 'ellipse'],
  gateway: [42, 42, 'raute'],
  datenobjekt: [34, 44, 'rechteck'],
  lebenslinie: [120, 34, 'rechteck'],
  text: [0, 0, 'rechteck'],
  kasten: [120, 32, 'rechteck'],
};

export function klassenMasse(k) {
  const zeilen = [k.name, ...(k.attribute ?? []), ...(k.methoden ?? [])];
  const w = k.w ?? Math.max(110, Math.ceil(Math.max(...zeilen.map(laenge)) * 6.5 + 22));
  const kopf = (k.stereotyp ? 14 : 0) + 28;
  const attr = Math.max(1, (k.attribute ?? []).length) * ZEILE + 10;
  const meth = Math.max(1, (k.methoden ?? []).length) * ZEILE + 10;
  return { w, h: kopf + attr + meth, kopf, attr };
}

function tabellenMasse(k) {
  const w = k.w ?? Math.max(120, Math.ceil(Math.max(laenge(k.name), ...k.spalten.map((s) => laenge(s.name) + 4)) * 6.6 + 34));
  return { w, h: 26 + k.spalten.length * 19 + 6 };
}

function zustandMasse(k) {
  const intern = k.intern ?? [];
  const w = k.w ?? Math.max(120, Math.ceil(Math.max(laenge(k.name) * 7, ...intern.map((z) => laenge(z) * 6.2)) + 26));
  return { w, h: k.h ?? 30 + (intern.length ? intern.length * 14 + 10 : 6) };
}

export function masse(k) {
  const [sw, sh, form] = STANDARD[k.typ] ?? [100, 40, 'rechteck'];
  let w = k.w ?? sw;
  let h = k.h ?? sh;
  if (k.typ === 'klasse') ({ w, h } = klassenMasse(k));
  if (k.typ === 'tabelle') ({ w, h } = tabellenMasse(k));
  if (k.typ === 'zustand') ({ w, h } = zustandMasse(k));
  // Akteur: Beschriftung gehört zur Fläche, damit keine Linie durch den Namen läuft
  if (k.typ === 'akteur') h = 62 + umbrechen(k.text, 18).length * ZEILE + 4;
  // Ellipsen wachsen mit dem Text
  if ((k.typ === 'anwendungsfall' || k.typ === 'attribut') && !k.h) h = Math.max(h, ellipsenZeilen(k, w).length * ZEILE + 22);
  return { x: k.x, y: k.y, w, h, form: k.typ === 'klasse' || k.typ === 'tabelle' || k.typ === 'zustand' ? 'rechteck' : form };
}

export const ellipsenZeilen = (k, w) => umbrechen(k.text, Math.floor(((w - 14) / ZEICHEN) * 0.82));

export const mitte = (m) => [m.x + m.w / 2, m.y + m.h / 2];


export const KANTEN = {
  assoziation: { strich: false },
  linie: { strich: false },
  gerichtet: { strich: false, ende: 'offen' },
  generalisierung: { strich: false, ende: 'dreieck' },
  realisierung: { strich: true, ende: 'dreieck' },
  abhaengigkeit: { strich: true, ende: 'offen' },
  aggregation: { strich: false, anfang: 'raute' },
  komposition: { strich: false, anfang: 'raute-voll' },
  fluss: { strich: false, ende: 'offen' },
  sequenzfluss: { strich: false, ende: 'voll' },
  nachrichtenfluss: { strich: true, anfang: 'kreis', ende: 'dreieck' },
  datenfluss: { strich: 'punkt', ende: 'offen' },
  nachricht: { strich: false, ende: 'voll' },
  async: { strich: false, ende: 'offen' },
  antwort: { strich: true, ende: 'offen' },
  erzeugen: { strich: true, ende: 'offen' },
};


// Prüft eine Diagrammbeschreibung auf Tippfehler (für Tests und Inhaltsprüfung)
export function pruefeDiagramm(d) {
  const fehler = [];
  if (!d || !Array.isArray(d.knoten)) return ['Diagramm ohne knoten'];
  if (!(d.breite > 0 && d.hoehe > 0)) fehler.push('breite/hoehe fehlen');
  const ids = new Set();
  for (const k of d.knoten) {
    if (!k.id) fehler.push(`Knoten ohne id (${k.typ})`);
    if (ids.has(k.id)) fehler.push(`id doppelt: ${k.id}`);
    ids.add(k.id);
    if (!STANDARD[k.typ] && !['klasse', 'tabelle'].includes(k.typ)) fehler.push(`unbekannter Typ: ${k.typ}`);
    if (typeof k.x !== 'number' || typeof k.y !== 'number') fehler.push(`Knoten ${k.id}: x/y fehlen`);
    if (k.typ === 'tabelle' && !Array.isArray(k.spalten)) fehler.push(`Tabelle ${k.id}: spalten fehlen`);
    const m = masse(k);
    if (k.typ !== 'text' && (m.x < 0 || m.y < 0 || m.x + m.w > d.breite + 1 || m.y + m.h > d.hoehe + 1)) fehler.push(`Knoten ${k.id} ragt über den Rand`);
  }
  for (const ka of d.kanten ?? []) {
    if (!ids.has(ka.von)) fehler.push(`Kante: unbekannter Knoten ${ka.von}`);
    if (!ids.has(ka.nach)) fehler.push(`Kante: unbekannter Knoten ${ka.nach}`);
    if (!KANTEN[ka.typ]) fehler.push(`Kante ${ka.von}→${ka.nach}: unbekannter Typ ${ka.typ}`);
  }
  return fehler;
}

export function lueckenIn(d) {
  const s = JSON.stringify(d ?? {});
  return [...new Set([...s.matchAll(/\{(\d+)\}/g)].map((m) => m[1]))];
}
