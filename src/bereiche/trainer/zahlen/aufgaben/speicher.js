// Aufgaben „Speicherbedarf“: Bilder, Audio, Messwerte, Sammlungen über die Zeit, Komprimierung, Mehrbedarf,
// und ob ein Speicher reicht. Datenmengen mit Binärpräfix (Anhang des Prüfungskatalogs).

import { z, runde, hoch, BIN_EINHEITEN } from '../rechnen.js';

export const ARTEN = [
  { id: 'bild', name: 'Bild' },
  { id: 'farben', name: 'Farbtiefe' },
  { id: 'audio', name: 'Audio' },
  { id: 'messwerte', name: 'Messwerte' },
  { id: 'sammlung', name: 'Hochrechnen' },
  { id: 'komprimiert', name: 'Komprimierung' },
  { id: 'mehrbedarf', name: 'Mehrbedarf in %' },
  { id: 'reicht', name: 'Reicht der Speicher?' },
];

const AUFLOESUNGEN = [
  [1920, 1080],
  [1280, 720],
  [2560, 1440],
  [3840, 2160],
  [1024, 768],
  [4000, 3000],
  [6000, 4000],
];
const mit2 = (wert) => z(runde(wert, 2), 2);
const RUNDEN = 'Runde auf zwei Nachkommastellen.';

export function erzeuge(r, art) {
  switch (art) {
    case 'bild':
      return bild(r);
    case 'farben':
      return farben(r);
    case 'audio':
      return audio(r);
    case 'messwerte':
      return messwerte(r);
    case 'sammlung':
      return sammlung(r);
    case 'komprimiert':
      return komprimiert(r);
    case 'mehrbedarf':
      return mehrbedarf(r);
    default:
      return reicht(r);
  }
}

// Rechenweg eines Bildes bis Byte – von mehreren Arten genutzt
function bildWeg(b, h, tiefe) {
  const px = b * h;
  const bit = px * tiefe;
  return { px, bit, byte: bit / 8, zeilen: [`Bildpunkte: ${z(b)} · ${z(h)} = ${z(px)}`, `Bit: ${z(px)} · ${tiefe} = ${z(bit)} Bit`, `Byte: ${z(bit)} ÷ 8 = ${z(bit / 8)} Byte`] };
}

function bild(r) {
  const [b, h] = r.wahl(AUFLOESUNGEN);
  const tiefe = r.wahl([8, 16, 24, 24, 32]);
  const w = bildWeg(b, h, tiefe);
  const mib = w.byte / 1024 ** 2;
  return {
    text: `Ein unkomprimiertes Bild hat **${z(b)} × ${z(h)} Bildpunkte** und eine Farbtiefe von **${tiefe} Bit**. Wie groß ist es in **MiB**? ${RUNDEN}`,
    felder: [{ id: 'x', label: 'Speicherbedarf', erwartet: mib, stellen: 2, einheit: 'MiB' }],
    loesung: [...w.zeilen, `MiB: ${z(w.byte)} ÷ 1.024² = **${mit2(mib)} MiB**`],
  };
}

function farben(r) {
  const bit = r.wahl([1, 4, 8, 16, 24]);
  return {
    text: `Ein Bild speichert je Bildpunkt **${bit} Bit** Farbinformation. Wie viele verschiedene Farben sind möglich?`,
    felder: [{ id: 'x', label: 'Farben', erwartet: 2 ** bit }],
    loesung: ['Mit n Bit gibt es 2ⁿ verschiedene Werte.', `2${hoch(bit)} = **${z(2 ** bit)}**`, bit === 24 ? '24 Bit sind 3 · 8 Bit für Rot, Grün und Blau („True Color“).' : null].filter(Boolean),
  };
}

function audio(r) {
  const rate = r.wahl([22050, 44100, 48000, 96000]);
  const tiefe = r.wahl([8, 16, 24]);
  const kanaele = r.wahl([1, 2]);
  const sekunden = r.wahl([30, 60, 90, 180, 240, 300]);
  const bit = rate * tiefe * kanaele * sekunden;
  const byte = bit / 8;
  const mib = byte / 1024 ** 2;
  const dauer = sekunden % 60 === 0 ? `${sekunden / 60} Minuten` : `${sekunden} Sekunden`;
  return {
    text: `Eine unkomprimierte Audioaufnahme: Abtastrate **${z(rate / 1000)} kHz**, Abtasttiefe **${tiefe} Bit**, **${kanaele === 2 ? 'Stereo (2 Kanäle)' : 'Mono (1 Kanal)'}**, Dauer **${dauer}**. Wie groß ist die Datei in **MiB**? ${RUNDEN}`,
    felder: [{ id: 'x', label: 'Speicherbedarf', erwartet: mib, stellen: 2, einheit: 'MiB' }],
    loesung: [
      `Abtastungen je Sekunde: ${z(rate)} (${z(rate / 1000)} kHz)`,
      `Bit: ${z(rate)} · ${tiefe} Bit · ${kanaele} ${kanaele === 2 ? 'Kanäle' : 'Kanal'} · ${sekunden} s = ${z(bit)} Bit`,
      `Byte: ${z(bit)} ÷ 8 = ${z(byte)} Byte`,
      `MiB: ${z(byte)} ÷ 1.024² = **${mit2(mib)} MiB**`,
    ],
  };
}

function messwerte(r) {
  const intervall = r.wahl([1, 5, 10, 15, 60]);
  const bit = r.wahl([8, 12, 16, 32]);
  const tage = r.wahl([1, 7, 30, 365]);
  const jeTag = 86400 / intervall;
  const werte = jeTag * tage;
  const byte = (werte * bit) / 8;
  const stufe = byte >= 1024 ** 2 ? 2 : 1;
  const einheit = BIN_EINHEITEN[stufe];
  const erg = byte / 1024 ** stufe;
  return {
    text: `Ein Sensor liefert alle **${intervall} s** einen Messwert mit **${bit} Bit**. Wie viel Speicher brauchen die Werte von **${tage} ${tage === 1 ? 'Tag' : 'Tagen'}** in **${einheit}**? ${RUNDEN}`,
    felder: [{ id: 'x', label: 'Speicherbedarf', erwartet: erg, stellen: 2, einheit }],
    loesung: [
      `Werte je Tag: 86.400 s ÷ ${intervall} s = ${z(jeTag)}`,
      `Werte gesamt: ${z(jeTag)} · ${tage} = ${z(werte)}`,
      `Bit: ${z(werte)} · ${bit} = ${z(werte * bit)} Bit → ÷ 8 = ${z(byte)} Byte`,
      `${einheit}: ${z(byte)} ÷ 1.024${stufe > 1 ? hoch(stufe) : ''} = **${mit2(erg)} ${einheit}**`,
    ],
  };
}

function sammlung(r) {
  const mp = r.wahl([8, 12, 12, 20, 24, 48]);
  const bytePx = r.wahl([3, 3, 4]);
  const jeTag = r.wahl([50, 120, 200, 500, 1000, 2400]);
  const tage = r.wahl([30, 250, 365]);
  const jeBild = mp * 1e6 * bytePx;
  const byte = jeBild * jeTag * tage;
  const stufe = byte >= 1024 ** 4 ? 4 : 3;
  const einheit = BIN_EINHEITEN[stufe];
  const erg = byte / 1024 ** stufe;
  return {
    text:
      `Eine Kamera speichert täglich **${z(jeTag)} Bilder** mit je **${mp} Megapixel**, unkomprimiert mit **${bytePx * 8} Bit** je Bildpunkt. ` +
      `Wie viel Speicher fällt in **${tage} Tagen** an, in **${einheit}**? ${RUNDEN} Wie viele **volle ${einheit}** müssen dafür bereitgestellt werden?`,
    felder: [
      { id: 'menge', label: `Speicherbedarf in ${einheit}`, erwartet: erg, stellen: 2, einheit },
      { id: 'voll', label: `Volle ${einheit} (aufgerundet)`, erwartet: Math.ceil(erg), einheit },
    ],
    loesung: [
      '1 Megapixel = 1.000.000 Bildpunkte (Dezimalpräfix).',
      `Je Bild: ${mp} · 1.000.000 · ${bytePx} Byte = ${z(jeBild)} Byte`,
      `Je Tag: ${z(jeBild)} · ${z(jeTag)} = ${z(jeBild * jeTag)} Byte`,
      `Gesamt: ${z(jeBild * jeTag)} · ${tage} = ${z(byte)} Byte`,
      `In ${einheit}: ${z(byte)} ÷ 1.024${hoch(stufe)} = **${mit2(erg)} ${einheit}**`,
      `Bereitstellen heißt aufrunden: **${z(Math.ceil(erg))} ${einheit}**`,
    ],
  };
}

function komprimiert(r) {
  const [b, h] = r.wahl(AUFLOESUNGEN);
  const prozent = r.wahl([30, 40, 50, 60, 75, 80, 90]);
  const w = bildWeg(b, h, 24);
  const mib = w.byte / 1024 ** 2;
  const klein = mib * (1 - prozent / 100);
  return {
    text:
      `Ein Bild mit **${z(b)} × ${z(h)} Bildpunkten** und **24 Bit** Farbtiefe wird mit einem Verfahren gespeichert, das den Speicherbedarf um **${prozent} %** verringert. ` +
      `Berechne den Speicherbedarf **unkomprimiert** und **komprimiert** in MiB. ${RUNDEN}`,
    felder: [
      { id: 'roh', label: 'Unkomprimiert', erwartet: mib, stellen: 2, einheit: 'MiB' },
      { id: 'klein', label: 'Komprimiert', erwartet: klein, stellen: 2, einheit: 'MiB' },
    ],
    loesung: [...w.zeilen, `Unkomprimiert: ${z(w.byte)} ÷ 1.024² = **${mit2(mib)} MiB**`, `Um ${prozent} % verringert heißt: es bleiben ${100 - prozent} %.`, `${mit2(mib)} · ${z(1 - prozent / 100)} = **${mit2(klein)} MiB**`],
  };
}

function mehrbedarf(r) {
  const [alt, neu] = r.wahl([
    [16, 24],
    [24, 32],
    [8, 24],
    [8, 16],
    [24, 48],
  ]);
  const prozent = ((neu - alt) / alt) * 100;
  return {
    text: `Bilder sollen statt mit **${alt} Bit** künftig mit **${neu} Bit** Farbtiefe gespeichert werden (gleiche Auflösung). Um wie viel **Prozent** steigt der Speicherbedarf? ${RUNDEN}`,
    felder: [{ id: 'x', label: 'Mehrbedarf', erwartet: prozent, stellen: 2, einheit: '%' }],
    loesung: ['Der Speicherbedarf wächst im selben Verhältnis wie die Bit je Bildpunkt.', `(${neu} − ${alt}) ÷ ${alt} · 100 = **${mit2(prozent)} %**`],
  };
}

const KARTEN_GB = [8, 16, 32, 64, 128, 256, 512];

function reicht(r) {
  const anzahl = r.wahl([200, 500, 1000, 2500, 5000]);
  const [b, h] = r.wahl(AUFLOESUNGEN);
  const w = bildWeg(b, h, 24);
  const byte = w.byte * anzahl;
  // Karte so wählen, dass die Entscheidung eindeutig ist (mindestens 5 % Abstand)
  let karte = r.wahl(KARTEN_GB);
  while (Math.abs(byte - karte * 1e9) < 0.05 * karte * 1e9) karte = KARTEN_GB[(KARTEN_GB.indexOf(karte) + 1) % KARTEN_GB.length];
  const gib = byte / 1024 ** 3;
  const karteGib = (karte * 1e9) / 1024 ** 3;
  const passt = byte <= karte * 1e9;
  return {
    text:
      `Auf einer Speicherkarte mit **${karte} GB** (Herstellerangabe) sollen **${z(anzahl)} unkomprimierte Bilder** mit **${z(b)} × ${z(h)} Bildpunkten** und **24 Bit** Farbtiefe gespeichert werden. ` +
      `Wie viel **GiB** brauchen die Bilder (zwei Nachkommastellen)? Reicht die Karte?`,
    felder: [
      { id: 'menge', label: 'Speicherbedarf', erwartet: gib, stellen: 2, einheit: 'GiB' },
      { id: 'reicht', label: 'Reicht die Karte?', typ: 'auswahl', erwartet: passt ? 'ja' : 'nein', optionen: ['ja', 'nein'] },
    ],
    loesung: [
      ...w.zeilen,
      `Alle Bilder: ${z(w.byte)} · ${z(anzahl)} = ${z(byte)} Byte → ÷ 1.024³ = **${mit2(gib)} GiB**`,
      `Die Karte: ${karte} GB = ${karte} · 1.000³ Byte = ${z(karte * 1e9)} Byte = ${mit2(karteGib)} GiB`,
      passt ? `${mit2(gib)} GiB ≤ ${mit2(karteGib)} GiB → **die Karte reicht**.` : `${mit2(gib)} GiB > ${mit2(karteGib)} GiB → **die Karte reicht nicht**.`,
    ],
  };
}
