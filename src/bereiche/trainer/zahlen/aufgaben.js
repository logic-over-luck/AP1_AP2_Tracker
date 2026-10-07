// Aufgabenerzeuger „Zahlen & IT-Rechnen". Rein: rng → Aufgabe. Getestet in tests/zahlen.test.mjs.
//
// Konventionen (Anhang des Prüfungskatalogs): Datenmengen mit Binärpräfixen (KiB, MiB, GiB, TiB),
// physikalische Größen und Übertragungsraten mit Dezimalpräfixen (kbit/s, Mbit/s, Gbit/s).

import { zahlText as z, runde } from '../rahmen/pruefen.js';

const SP = { zahlen: 'AP1-4-2-1', menge: 'AP1-4-2-2', mengeAP2: 'AP2-6-6-3', energie: 'AP1-4-2-3', rechte: 'AP1-5-2-3', paritaet: 'AP2-5-5-3' };

const BIN_EINHEIT = ['Byte', 'KiB', 'MiB', 'GiB', 'TiB'];
const DEZ_EINHEIT = ['Byte', 'kB', 'MB', 'GB', 'TB'];

function gruppiert(bin, breite = 4) {
  const s = bin.padStart(Math.ceil(bin.length / breite) * breite, '0');
  return s.match(new RegExp(`.{${breite}}`, 'g')).join(' ');
}

// ---------- Zahlensysteme ----------

function divisionsweg(n, basis) {
  const schritte = [];
  let x = n;
  if (x === 0) return ['0 ÷ ' + basis + ' = 0 Rest 0'];
  while (x > 0) {
    const rest = x % basis;
    schritte.push(`${x} ÷ ${basis} = ${Math.floor(x / basis)} Rest ${basis === 16 ? rest.toString(16).toUpperCase() + (rest > 9 ? ` (${rest})` : '') : rest}`);
    x = Math.floor(x / basis);
  }
  return schritte;
}

function stellenwertweg(text, basis) {
  const ziffern = text.split('');
  const teile = [];
  ziffern.forEach((c, i) => {
    const wert = parseInt(c, basis);
    const potenz = ziffern.length - 1 - i;
    if (wert) teile.push(`${wert}·${basis}^${potenz}`);
  });
  return teile.join(' + ');
}

export function zahlensysteme(r) {
  const art = r.art(['d2b', 'b2d', 'd2h', 'h2d', 'b2h', 'h2b', 'd2b', 'b2d', 'potenz', 'oktal']);
  if (art === 'potenz') {
    const n = r.wahl([2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 8, 16]);
    const frage = r.ja();
    return {
      titel: 'Zweierpotenzen',
      sp: SP.zahlen,
      text: frage ? `Wie viele verschiedene Werte lassen sich mit **${n} Bit** darstellen?` : `Berechne \`2^${n}\`.`,
      felder: [{ id: 'x', label: frage ? 'Anzahl Werte' : `2^${n}`, erwartet: 2 ** n }],
      loesung: [frage ? `Jedes Bit hat 2 Zustände: 2^${n} Kombinationen.` : `2^${n} heißt ${n}-mal 2 multiplizieren.`, `2^${n} = ${z(2 ** n)}`, n === 8 ? 'Mit 8 Bit (1 Byte) also die Werte 0 bis 255.' : n === 10 ? '2^10 = 1.024 – daher kommt das „Kibi" (1 KiB = 1.024 Byte).' : ''].filter(Boolean),
    };
  }
  if (art === 'oktal') {
    const n = r.ganz(8, 511);
    const okt = n.toString(8);
    const hin = r.ja();
    return {
      titel: 'Oktalsystem',
      sp: SP.zahlen,
      text: hin ? `Rechne die Dezimalzahl **${n}** ins Oktalsystem (Basis 8) um.` : `Rechne die Oktalzahl **${okt}₈** ins Dezimalsystem um.`,
      felder: [hin ? { id: 'x', label: 'Oktal', typ: 'basis', basis: 8, erwartet: n } : { id: 'x', label: 'Dezimal', erwartet: n }],
      loesung: hin
        ? [...divisionsweg(n, 8), `Reste von unten nach oben gelesen: **${okt}₈**`]
        : [`Stellenwerte: ${stellenwertweg(okt, 8)}`, `= ${n}`],
    };
  }
  const n = art.includes('h') ? (r.ja(0.6) ? r.ganz(16, 255) : r.ganz(256, 4095)) : r.ganz(5, 255);
  const bin = n.toString(2);
  const hex = n.toString(16).toUpperCase();
  switch (art) {
    case 'd2b':
      return {
        titel: 'Dezimal → Binär',
        sp: SP.zahlen,
        text: `Rechne die Dezimalzahl **${n}** ins Binärsystem um.`,
        felder: [{ id: 'x', label: 'Binär', typ: 'basis', basis: 2, erwartet: n }],
        loesung: [...divisionsweg(n, 2), `Reste von unten nach oben gelesen: **${gruppiert(bin)}**`, 'Gegenprobe über Stellenwerte: ' + stellenwertweg(bin, 2) + ` = ${n}`],
      };
    case 'b2d':
      return {
        titel: 'Binär → Dezimal',
        sp: SP.zahlen,
        text: `Rechne die Binärzahl **${gruppiert(bin)}** ins Dezimalsystem um.`,
        felder: [{ id: 'x', label: 'Dezimal', erwartet: n }],
        loesung: [`Stellenwerte von rechts: 1, 2, 4, 8, 16, 32, 64, 128 …`, `${stellenwertweg(bin, 2)}`, `= **${n}**`],
      };
    case 'd2h':
      return {
        titel: 'Dezimal → Hexadezimal',
        sp: SP.zahlen,
        text: `Rechne die Dezimalzahl **${n}** ins Hexadezimalsystem um.`,
        felder: [{ id: 'x', label: 'Hexadezimal', typ: 'basis', basis: 16, erwartet: n }],
        loesung: [...divisionsweg(n, 16), `Reste von unten nach oben: **${hex}**`, 'Ziffern über 9: A=10, B=11, C=12, D=13, E=14, F=15'],
      };
    case 'h2d':
      return {
        titel: 'Hexadezimal → Dezimal',
        sp: SP.zahlen,
        text: `Rechne die Hexadezimalzahl **${hex}** ins Dezimalsystem um.`,
        felder: [{ id: 'x', label: 'Dezimal', erwartet: n }],
        loesung: [`Stellenwerte: 1, 16, 256, 4096 …`, `${stellenwertweg(hex, 16)} (A=10 … F=15)`, `= **${n}**`],
      };
    case 'b2h':
      return {
        titel: 'Binär → Hexadezimal',
        sp: SP.zahlen,
        text: `Rechne die Binärzahl **${gruppiert(bin)}** ins Hexadezimalsystem um.`,
        felder: [{ id: 'x', label: 'Hexadezimal', typ: 'basis', basis: 16, erwartet: n }],
        loesung: [
          'Von rechts in Vierergruppen (Nibbles) teilen – jede Gruppe ist genau eine Hex-Ziffer.',
          gruppiert(bin)
            .split(' ')
            .map((g) => `${g} = ${parseInt(g, 2).toString(16).toUpperCase()}`)
            .join(' · '),
          `Ergebnis: **${hex}**`,
        ],
      };
    default:
      return {
        titel: 'Hexadezimal → Binär',
        sp: SP.zahlen,
        text: `Rechne die Hexadezimalzahl **${hex}** ins Binärsystem um.`,
        felder: [{ id: 'x', label: 'Binär', typ: 'basis', basis: 2, erwartet: n }],
        loesung: [
          'Jede Hex-Ziffer wird zu genau vier Bit.',
          hex
            .split('')
            .map((c) => `${c} = ${parseInt(c, 16).toString(2).padStart(4, '0')}`)
            .join(' · '),
          `Ergebnis: **${gruppiert(bin)}**`,
        ],
      };
  }
}

// ---------- Präfixe ----------

export function praefixe(r) {
  const art = r.art(['dez2bin', 'dez2bin', 'bin2dez', 'bit2byte', 'byte2bit', 'kib']);
  if (art === 'dez2bin') {
    const stufe = r.wahl([2, 3, 3, 4]);
    const wert = stufe === 4 ? r.wahl([1, 2, 4, 8, 12, 16]) : r.wahl([250, 256, 500, 512, 960, 1000, 2000, 4000]);
    const byte = wert * 1000 ** stufe;
    const erg = byte / 1024 ** stufe;
    return {
      titel: 'Dezimal- in Binärpräfix',
      sp: SP.zahlen,
      text: `Ein Datenträger hat laut Hersteller **${z(wert)} ${DEZ_EINHEIT[stufe]}**. Wie viel **${BIN_EINHEIT[stufe]}** zeigt das Betriebssystem an? Runde auf zwei Nachkommastellen.`,
      felder: [{ id: 'x', label: BIN_EINHEIT[stufe], erwartet: erg, stellen: 2, einheit: BIN_EINHEIT[stufe] }],
      loesung: [
        `In Byte: ${z(wert)} ${DEZ_EINHEIT[stufe]} = ${z(wert)} · 1000^${stufe} Byte = ${z(byte)} Byte`,
        `In ${BIN_EINHEIT[stufe]}: ${z(byte)} Byte ÷ 1024^${stufe} = ${z(byte)} ÷ ${z(1024 ** stufe)}`,
        `= **${z(runde(erg, 2), 2)} ${BIN_EINHEIT[stufe]}**`,
        'Hersteller rechnen mit Dezimalpräfixen (1 GB = 10^9 Byte), Betriebssysteme oft mit Binärpräfixen (1 GiB = 2^30 Byte).',
      ],
    };
  }
  if (art === 'bin2dez') {
    const stufe = r.wahl([1, 2, 3]);
    const wert = r.wahl([4, 8, 16, 32, 64, 128, 256, 512]);
    const byte = wert * 1024 ** stufe;
    const erg = byte / 1000 ** stufe;
    return {
      titel: 'Binär- in Dezimalpräfix',
      sp: SP.zahlen,
      text: `Rechne **${z(wert)} ${BIN_EINHEIT[stufe]}** in **${DEZ_EINHEIT[stufe]}** um. Runde auf zwei Nachkommastellen.`,
      felder: [{ id: 'x', label: DEZ_EINHEIT[stufe], erwartet: erg, stellen: 2, einheit: DEZ_EINHEIT[stufe] }],
      loesung: [`${z(wert)} ${BIN_EINHEIT[stufe]} = ${z(wert)} · 1024^${stufe} Byte = ${z(byte)} Byte`, `÷ 1000^${stufe} = **${z(runde(erg, 2), 2)} ${DEZ_EINHEIT[stufe]}**`],
    };
  }
  if (art === 'bit2byte') {
    const bit = r.wahl([64, 256, 1024, 4096, 8192, 65536, 1048576]) * r.wahl([1, 2, 4]);
    return {
      titel: 'Bit und Byte',
      sp: SP.zahlen,
      text: `Wie viele **Byte** sind **${z(bit)} Bit**?`,
      felder: [{ id: 'x', label: 'Byte', erwartet: bit / 8, einheit: 'Byte' }],
      loesung: ['8 Bit sind 1 Byte – also durch 8 teilen.', `${z(bit)} ÷ 8 = **${z(bit / 8)} Byte**`],
    };
  }
  if (art === 'byte2bit') {
    const mib = r.wahl([1, 2, 5, 10, 25, 100]);
    return {
      titel: 'Bit und Byte',
      sp: SP.zahlen,
      text: `Wie viele **Bit** sind **${mib} MiB**?`,
      felder: [{ id: 'x', label: 'Bit', erwartet: mib * 1024 * 1024 * 8, einheit: 'Bit' }],
      loesung: [`${mib} MiB = ${mib} · 1024 · 1024 Byte = ${z(mib * 1048576)} Byte`, `· 8 = **${z(mib * 1048576 * 8)} Bit**`],
    };
  }
  const kib = r.wahl([2, 4, 16, 64, 512]);
  return {
    titel: 'kB und KiB',
    sp: SP.zahlen,
    text: `Eine Datei ist **${kib} KiB** groß. Wie viele **kB** sind das? Runde auf zwei Nachkommastellen.`,
    felder: [{ id: 'x', label: 'kB', erwartet: (kib * 1024) / 1000, stellen: 2, einheit: 'kB' }],
    loesung: [`${kib} KiB = ${kib} · 1.024 Byte = ${z(kib * 1024)} Byte`, `÷ 1.000 = **${z(runde((kib * 1024) / 1000, 2), 2)} kB**`],
  };
}

// ---------- Speicherbedarf ----------

export function datenmenge(r, raum = 'AP1') {
  const sp = raum === 'AP2' ? SP.mengeAP2 : SP.menge;
  const arten = raum === 'AP2' ? ['bild', 'sammlung', 'sammlung', 'messwerte'] : ['bild', 'bild', 'farben', 'messwerte', 'mehrbedarf', 'sammlung'];
  const art = r.art(arten);
  if (art === 'farben') {
    const bit = r.wahl([1, 4, 8, 16, 24]);
    return {
      titel: 'Farbtiefe',
      sp,
      text: `Ein Bild speichert je Bildpunkt **${bit} Bit** Farbinformation. Wie viele verschiedene Farben sind möglich?`,
      felder: [{ id: 'x', label: 'Farben', erwartet: 2 ** bit }],
      loesung: [`Mit n Bit gibt es 2^n Werte.`, `2^${bit} = **${z(2 ** bit)}**`, bit === 24 ? '24 Bit = 3 · 8 Bit für Rot, Grün und Blau („True Color").' : ''].filter(Boolean),
    };
  }
  if (art === 'bild') {
    const [b, h] = r.wahl([
      [1920, 1080],
      [1280, 720],
      [2560, 1440],
      [3840, 2160],
      [1024, 768],
      [4000, 3000],
      [6000, 4000],
    ]);
    const tiefe = r.wahl([8, 16, 24, 24, 32]);
    const byte = (b * h * tiefe) / 8;
    const mib = byte / 1024 ** 2;
    return {
      titel: 'Unkomprimiertes Bild',
      sp,
      text: `Ein unkomprimiertes Bild hat **${z(b)} × ${z(h)} Pixel** und eine Farbtiefe von **${tiefe} Bit**. Wie groß ist es in **MiB**? Runde auf zwei Nachkommastellen.`,
      felder: [{ id: 'x', label: 'Speicherbedarf', erwartet: mib, stellen: 2, einheit: 'MiB' }],
      loesung: [`Bildpunkte: ${z(b)} · ${z(h)} = ${z(b * h)}`, `Bit: ${z(b * h)} · ${tiefe} = ${z(b * h * tiefe)} Bit`, `Byte: ÷ 8 = ${z(byte)} Byte`, `MiB: ÷ 1024 ÷ 1024 = **${z(runde(mib, 2), 2)} MiB**`],
    };
  }
  if (art === 'messwerte') {
    const intervall = r.wahl([1, 5, 10, 15, 60]); // Sekunden
    const bit = r.wahl([8, 12, 16, 32]);
    const tage = r.wahl([1, 7, 30, 365]);
    const werte = (86400 / intervall) * tage;
    const byte = (werte * bit) / 8;
    const ziel = byte > 50 * 1024 ** 2 ? 2 : byte > 50 * 1024 ? 1 : 1;
    const erg = byte / 1024 ** ziel;
    return {
      titel: 'Messwerte speichern',
      sp,
      text: `Ein Sensor liefert alle **${intervall} s** einen Messwert mit **${bit} Bit**. Wie viel Speicher brauchen die Werte von **${tage} ${tage === 1 ? 'Tag' : 'Tagen'}** in **${BIN_EINHEIT[ziel]}**? Runde auf zwei Nachkommastellen.`,
      felder: [{ id: 'x', label: 'Speicherbedarf', erwartet: erg, stellen: 2, einheit: BIN_EINHEIT[ziel] }],
      loesung: [
        `Werte je Tag: 86.400 s ÷ ${intervall} s = ${z(86400 / intervall)}`,
        `Werte gesamt: ${z(86400 / intervall)} · ${tage} = ${z(werte)}`,
        `Bit: ${z(werte)} · ${bit} = ${z(werte * bit)} Bit → ÷ 8 = ${z(byte)} Byte`,
        `${BIN_EINHEIT[ziel]}: ÷ ${ziel === 1 ? '1024' : '1024 ÷ 1024'} = **${z(runde(erg, 2), 2)} ${BIN_EINHEIT[ziel]}**`,
      ],
    };
  }
  if (art === 'mehrbedarf') {
    const [alt, neu] = r.wahl([
      [16, 24],
      [24, 32],
      [8, 24],
      [8, 16],
      [24, 48],
    ]);
    return {
      titel: 'Mehrbedarf in Prozent',
      sp,
      text: `Bilder sollen statt mit **${alt} Bit** künftig mit **${neu} Bit** Farbtiefe gespeichert werden (gleiche Auflösung). Um wie viel Prozent steigt der Speicherbedarf? Runde auf zwei Nachkommastellen.`,
      felder: [{ id: 'x', label: 'Mehrbedarf', erwartet: ((neu - alt) / alt) * 100, stellen: 2, einheit: '%' }],
      loesung: [`Der Speicherbedarf wächst im selben Verhältnis wie die Bit je Pixel.`, `(${neu} − ${alt}) ÷ ${alt} · 100 = **${z(runde(((neu - alt) / alt) * 100, 2), 2)} %**`],
    };
  }
  // Bildersammlung über einen Zeitraum (AP2-Stil)
  const mp = r.wahl([8, 12, 12, 20, 24, 48]);
  const bytePx = r.wahl([3, 3, 4]);
  const jeTag = r.wahl([50, 120, 200, 500, 1000, 2400]);
  const tage = r.wahl([30, 250, 365]);
  const byte = mp * 1e6 * bytePx * jeTag * tage;
  const ziel = byte >= 2 * 1024 ** 4 ? 4 : 3;
  const erg = byte / 1024 ** ziel;
  return {
    titel: 'Bildersammlung hochrechnen',
    sp,
    text: `Eine Kamera speichert täglich **${z(jeTag)} Bilder** mit je **${mp} Megapixel**, unkomprimiert mit **${bytePx * 8} Bit** je Bildpunkt (${bytePx} Byte). Wie viel Speicher fällt in **${tage} Tagen** an, in **${BIN_EINHEIT[ziel]}**? Runde auf zwei Nachkommastellen.`,
    felder: [{ id: 'x', label: 'Speicherbedarf', erwartet: erg, stellen: 2, einheit: BIN_EINHEIT[ziel] }],
    loesung: [
      `1 Megapixel = 1.000.000 Bildpunkte (Dezimalpräfix).`,
      `Je Bild: ${mp} · 10^6 · ${bytePx} Byte = ${z(mp * 1e6 * bytePx)} Byte`,
      `Je Tag: · ${z(jeTag)} = ${z(mp * 1e6 * bytePx * jeTag)} Byte`,
      `Gesamt: · ${tage} = ${z(byte)} Byte`,
      `In ${BIN_EINHEIT[ziel]}: ÷ 1024^${ziel} = **${z(runde(erg, 2), 2)} ${BIN_EINHEIT[ziel]}**`,
    ],
  };
}

// ---------- Übertragung ----------

export function uebertragung(r, raum = 'AP1') {
  const sp = raum === 'AP2' ? SP.mengeAP2 : SP.menge;
  const art = r.art(['dauer', 'dauer', 'dauerMinuten', 'rate']);
  const stufe = r.wahl([2, 3, 3]);
  const menge = stufe === 2 ? r.wahl([300, 500, 700, 800]) : r.wahl([1, 2, 4, 5, 8, 10, 25]);
  const rate = r.wahl([16, 50, 100, 250, 500, 1000]);
  const bit = menge * 1024 ** stufe * 8;
  const sek = bit / (rate * 1e6);
  if (art === 'rate') {
    const dauer = r.wahl([30, 60, 90, 120, 300, 600]);
    const mbit = bit / dauer / 1e6;
    return {
      titel: 'Benötigte Übertragungsrate',
      sp,
      text: `**${z(menge)} ${BIN_EINHEIT[stufe]}** sollen in **${dauer} Sekunden** übertragen werden. Welche Übertragungsrate in **Mbit/s** ist mindestens nötig? Runde auf zwei Nachkommastellen.`,
      felder: [{ id: 'x', label: 'Rate', erwartet: mbit, stellen: 2, einheit: 'Mbit/s' }],
      loesung: [
        `Datenmenge in Bit: ${z(menge)} · 1024^${stufe} · 8 = ${z(bit)} Bit`,
        `Rate = Datenmenge ÷ Zeit = ${z(bit)} ÷ ${dauer} = ${z(bit / dauer)} bit/s`,
        `In Mbit/s (÷ 1.000.000): **${z(runde(mbit, 2), 2)} Mbit/s**`,
      ],
    };
  }
  if (art === 'dauerMinuten') {
    const gesamt = Math.round(sek);
    return {
      titel: 'Übertragungsdauer',
      sp,
      text: `Wie lange dauert die Übertragung von **${z(menge)} ${BIN_EINHEIT[stufe]}** über eine Leitung mit **${z(rate)} Mbit/s**? Gib das Ergebnis in Minuten und Sekunden an (Sekunden ganzzahlig gerundet).`,
      felder: [
        { id: 'm', label: 'Minuten', erwartet: Math.floor(gesamt / 60), einheit: 'min' },
        { id: 's', label: 'Sekunden', erwartet: gesamt % 60, einheit: 's' },
      ],
      loesung: [
        `Datenmenge in Bit: ${z(menge)} · 1024^${stufe} · 8 = ${z(bit)} Bit`,
        `Rate in bit/s: ${z(rate)} · 1.000.000 = ${z(rate * 1e6)} bit/s`,
        `Dauer = ${z(bit)} ÷ ${z(rate * 1e6)} = ${z(runde(sek, 2), 2)} s ≈ ${gesamt} s`,
        `${gesamt} s = **${Math.floor(gesamt / 60)} min ${gesamt % 60} s**`,
      ],
    };
  }
  return {
    titel: 'Übertragungsdauer',
    sp,
    text: `Wie viele **Sekunden** dauert die Übertragung von **${z(menge)} ${BIN_EINHEIT[stufe]}** bei **${z(rate)} Mbit/s**? Runde auf zwei Nachkommastellen.`,
    felder: [{ id: 'x', label: 'Dauer', erwartet: sek, stellen: 2, einheit: 's' }],
    loesung: [
      `Achtung Einheiten: Datenmenge in Byte mit Binärpräfix, Rate in Bit je Sekunde mit Dezimalpräfix.`,
      `Datenmenge in Bit: ${z(menge)} · 1024^${stufe} · 8 = ${z(bit)} Bit`,
      `Rate: ${z(rate)} Mbit/s = ${z(rate * 1e6)} bit/s`,
      `Dauer = ${z(bit)} ÷ ${z(rate * 1e6)} = **${z(runde(sek, 2), 2)} s**`,
    ],
  };
}

// ---------- Leistung, Energie, Kosten ----------

export function energie(r) {
  const art = r.art(['pui', 'pui', 'netzteil', 'kosten', 'kosten', 'wirkungsgrad', 'jahr']);
  if (art === 'pui') {
    const u = r.wahl([5, 12, 24, 230]);
    const i = u === 230 ? r.wahl([0.2, 0.5, 1.5, 2, 4.5]) : r.wahl([0.5, 1.5, 2, 3, 4.5, 8]);
    const p = u * i;
    const gesucht = r.wahl(['P', 'I', 'U']);
    const text =
      gesucht === 'P'
        ? `Ein Gerät wird mit **${u} V** betrieben und nimmt **${z(i)} A** auf. Welche Leistung nimmt es auf?`
        : gesucht === 'I'
          ? `Ein Gerät mit **${z(p)} W** Leistungsaufnahme wird an **${u} V** betrieben. Welcher Strom fließt? Runde auf zwei Nachkommastellen.`
          : `Ein Gerät nimmt **${z(p)} W** bei **${z(i)} A** auf. Mit welcher Spannung wird es betrieben?`;
    const erwartet = gesucht === 'P' ? p : gesucht === 'I' ? i : u;
    return {
      titel: 'P = U · I',
      sp: SP.energie,
      text,
      felder: [{ id: 'x', label: { P: 'Leistung P', I: 'Stromstärke I', U: 'Spannung U' }[gesucht], erwartet, stellen: gesucht === 'I' ? 2 : 1, einheit: { P: 'W', I: 'A', U: 'V' }[gesucht] }],
      loesung: [
        'Grundformel: P = U · I (Watt = Volt · Ampere)',
        gesucht === 'P' ? `P = ${u} V · ${z(i)} A = **${z(p)} W**` : gesucht === 'I' ? `I = P ÷ U = ${z(p)} W ÷ ${u} V = **${z(runde(i, 2), 2)} A**` : `U = P ÷ I = ${z(p)} W ÷ ${z(i)} A = **${z(u)} V**`,
      ],
    };
  }
  if (art === 'netzteil') {
    const teile = [
      ['Prozessor', r.wahl([65, 95, 105, 125])],
      ['Grafikkarte', r.wahl([75, 120, 170, 220, 285])],
      ['Mainboard', r.wahl([30, 40, 50])],
      ['Arbeitsspeicher', r.wahl([8, 10, 16])],
      ['SSD', r.wahl([5, 6, 8])],
      ['Lüfter und Sonstiges', r.wahl([10, 15, 20])],
    ];
    const summe = teile.reduce((a, [, w]) => a + w, 0);
    const zuschlag = r.wahl([20, 25, 30]);
    const bedarf = summe * (1 + zuschlag / 100);
    const netzteile = [300, 350, 400, 450, 500, 550, 650, 750];
    const passend = netzteile.find((n) => n >= bedarf);
    return {
      titel: 'Netzteil auswählen',
      sp: SP.energie,
      text: `Die Komponenten eines PCs nehmen höchstens diese Leistung auf. Für Reserve soll ein Zuschlag von **${zuschlag} %** eingerechnet werden. Wie groß ist der Leistungsbedarf, und welches Netzteil ist das kleinste passende?`,
      tabelle: { kopf: ['Komponente', 'Leistung'], zeilen: teile.map(([n, w]) => [n, `${w} W`]), rechtsbuendig: [1] },
      felder: [
        { id: 'summe', label: 'Summe der Komponenten', erwartet: summe, einheit: 'W' },
        { id: 'bedarf', label: `Bedarf mit ${zuschlag} % Zuschlag`, erwartet: bedarf, stellen: 1, einheit: 'W' },
        { id: 'nt', label: 'Netzteil', typ: 'auswahl', erwartet: String(passend), optionen: netzteile.map((n) => ({ wert: String(n), text: `${n} W` })) },
      ],
      loesung: [`Summe: ${teile.map(([, w]) => w).join(' + ')} = ${summe} W`, `Mit Zuschlag: ${summe} W · ${z(1 + zuschlag / 100)} = ${z(runde(bedarf, 1))} W`, `Kleinstes Netzteil, das mindestens ${z(runde(bedarf, 1))} W liefert: **${passend} W**`],
    };
  }
  if (art === 'wirkungsgrad') {
    const pab = r.wahl([150, 200, 300, 350, 450]);
    const eta = r.wahl([80, 85, 88, 90, 92]);
    const pauf = pab / (eta / 100);
    return {
      titel: 'Wirkungsgrad',
      sp: SP.energie,
      text: `Ein Netzteil gibt **${pab} W** an die Komponenten ab und hat einen Wirkungsgrad von **${eta} %**. Welche Leistung nimmt es aus dem Stromnetz auf? Runde auf zwei Nachkommastellen.`,
      felder: [{ id: 'x', label: 'Aufgenommene Leistung', erwartet: pauf, stellen: 2, einheit: 'W' }],
      loesung: ['Wirkungsgrad η = abgegebene Leistung ÷ aufgenommene Leistung', `Aufgenommen = abgegeben ÷ η = ${pab} W ÷ ${z(eta / 100)} = **${z(runde(pauf, 2), 2)} W**`, `Die Differenz von ${z(runde(pauf - pab, 2), 2)} W wird zu Wärme.`],
    };
  }
  if (art === 'jahr') {
    const w = r.wahl([35, 60, 90, 120, 180]);
    const std = r.wahl([8, 10, 24]);
    const tage = std === 24 ? 365 : r.wahl([220, 230, 250]);
    const preis = r.wahl([0.28, 0.3, 0.32, 0.35, 0.38]);
    const kwh = (w * std * tage) / 1000;
    return {
      titel: 'Stromkosten im Jahr',
      sp: SP.energie,
      text: `Ein Gerät nimmt **${w} W** auf und läuft **${std} Stunden** an **${tage} Tagen** im Jahr. Der Strom kostet **${z(preis, 2)} €/kWh**. Berechne den Energiebedarf und die Stromkosten im Jahr. Runde auf zwei Nachkommastellen.`,
      felder: [
        { id: 'kwh', label: 'Energie', erwartet: kwh, stellen: 2, einheit: 'kWh' },
        { id: 'eur', label: 'Kosten', erwartet: kwh * preis, stellen: 2, einheit: '€', toleranz: 0.011 },
      ],
      loesung: [`Betriebsstunden: ${std} h · ${tage} = ${z(std * tage)} h`, `Energie W = P · t = ${w} W · ${z(std * tage)} h = ${z(w * std * tage)} Wh = **${z(runde(kwh, 2), 2)} kWh**`, `Kosten = ${z(kwh)} kWh · ${z(preis, 2)} €/kWh = **${z(runde(kwh * preis, 2), 2)} €**`],
    };
  }
  const w = r.wahl([5, 12, 45, 65, 150, 400, 650]);
  const std = r.wahl([2, 4.5, 8, 24, 30, 100]);
  const preis = r.wahl([0.29, 0.31, 0.34, 0.36]);
  const kwh = (w * std) / 1000;
  return {
    titel: 'Energie und Kosten',
    sp: SP.energie,
    text: `Ein Gerät mit **${w} W** läuft **${z(std)} Stunden**. Wie viel Energie verbraucht es in **kWh**, und was kostet das bei **${z(preis, 2)} €/kWh**? Runde die Energie auf drei, die Kosten auf zwei Nachkommastellen.`,
    felder: [
      { id: 'kwh', label: 'Energie', erwartet: kwh, stellen: 3, einheit: 'kWh' },
      { id: 'eur', label: 'Kosten', erwartet: kwh * preis, stellen: 2, einheit: '€', toleranz: 0.011 },
    ],
    loesung: [`W = P · t = ${w} W · ${z(std)} h = ${z(w * std)} Wh`, `In kWh (÷ 1.000): **${z(runde(kwh, 3), 3)} kWh**`, `Kosten: ${z(kwh)} kWh · ${z(preis, 2)} € = **${z(runde(kwh * preis, 2), 2)} €**`],
  };
}

// ---------- Dateirechte (chmod) ----------

const RWX = ['---', '--x', '-w-', '-wx', 'r--', 'r-x', 'rw-', 'rwx'];

export function symbolisch(oktal) {
  return String(oktal)
    .split('')
    .map((d) => RWX[Number(d)])
    .join('');
}

export function rechte(r) {
  const ziffern = [r.wahl([7, 7, 6, 5]), r.wahl([7, 5, 5, 4, 6, 0]), r.wahl([5, 4, 4, 0, 1])];
  const oktal = ziffern.join('');
  const sym = symbolisch(oktal);
  const art = r.art(['zuSym', 'zuOktal', 'wer']);
  const erklaerung = ['r = 4 (lesen), w = 2 (schreiben), x = 1 (ausführen) – je Gruppe addieren.', 'Reihenfolge: Besitzer, Gruppe, andere.'];
  if (art === 'zuOktal') {
    return {
      titel: 'chmod: symbolisch → oktal',
      sp: SP.rechte,
      text: `Eine Datei hat die Rechte \`${sym}\`. Welcher Zahlenwert gehört zu \`chmod\`?`,
      felder: [{ id: 'x', label: 'Oktalwert', typ: 'text', erwartet: oktal, erlaubt: [oktal, '0' + oktal], platzhalter: 'z. B. 640' }],
      loesung: [...erklaerung, ...[0, 1, 2].map((i) => `${['Besitzer', 'Gruppe', 'andere'][i]}: ${sym.slice(i * 3, i * 3 + 3)} = ${ziffern[i]}`), `Ergebnis: **chmod ${oktal}**`],
    };
  }
  if (art === 'wer') {
    const gruppe = r.wahl([0, 1, 2]);
    const recht = RWX[ziffern[gruppe]];
    return {
      titel: 'chmod deuten',
      sp: SP.rechte,
      text: `Nach \`chmod ${oktal} bericht.txt\`: Was darf **${['der Besitzer', 'die Gruppe', 'jeder andere'][gruppe]}**?`,
      felder: [
        { id: 'r', label: 'lesen', typ: 'auswahl', erwartet: recht[0] === 'r' ? 'ja' : 'nein', optionen: ['ja', 'nein'] },
        { id: 'w', label: 'schreiben', typ: 'auswahl', erwartet: recht[1] === 'w' ? 'ja' : 'nein', optionen: ['ja', 'nein'] },
        { id: 'x', label: 'ausführen', typ: 'auswahl', erwartet: recht[2] === 'x' ? 'ja' : 'nein', optionen: ['ja', 'nein'] },
      ],
      loesung: [...erklaerung, `${['Besitzer', 'Gruppe', 'andere'][gruppe]}: ${ziffern[gruppe]} = ${recht} → lesen ${recht[0] === 'r' ? 'ja' : 'nein'}, schreiben ${recht[1] === 'w' ? 'ja' : 'nein'}, ausführen ${recht[2] === 'x' ? 'ja' : 'nein'}`],
    };
  }
  return {
    titel: 'chmod: oktal → symbolisch',
    sp: SP.rechte,
    text: `Welche Rechte setzt \`chmod ${oktal}\`? Schreibe sie in der Form \`rwxr-x---\`.`,
    felder: [
      {
        id: 'x',
        label: 'Rechte',
        typ: 'eigen',
        soll: sym,
        platzhalter: 'rwx------',
        pruefe: (e) => {
          const s = String(e ?? '')
            .trim()
            .toLowerCase()
            .replace(/\s/g, '')
            .replace(/^-(?=[-r][-w][-x][-r][-w][-x][-r][-w][-x]$)/, '');
          return { ok: s === sym, leer: !s };
        },
      },
    ],
    loesung: [...erklaerung, ...[0, 1, 2].map((i) => `${ziffern[i]} = ${RWX[ziffern[i]]}`), `Ergebnis: **${sym}**`],
  };
}

// ---------- Paritätsbit ----------

export function paritaet(r) {
  const bits = Array.from({ length: 7 }, () => (r.ja() ? 1 : 0));
  const einsen = bits.reduce((a, b) => a + b, 0);
  const gerade = r.ja();
  const pbit = gerade ? einsen % 2 : 1 - (einsen % 2);
  if (r.art(['bilden', 'bilden', 'bilden', 'erkennen', 'erkennen']) === 'bilden') {
    return {
      titel: 'Paritätsbit bilden',
      sp: SP.paritaet,
      text: `Die Daten **${bits.join('')}** sollen mit **${gerade ? 'gerader' : 'ungerader'} Parität** übertragen werden. Welches Paritätsbit wird angehängt?`,
      felder: [{ id: 'x', label: 'Paritätsbit', typ: 'auswahl', erwartet: String(pbit), optionen: ['0', '1'] }],
      loesung: [`Anzahl Einsen in den Daten: ${einsen}`, gerade ? 'Gerade Parität: Die Gesamtzahl der Einsen (mit Paritätsbit) muss gerade sein.' : 'Ungerade Parität: Die Gesamtzahl der Einsen (mit Paritätsbit) muss ungerade sein.', `Paritätsbit: **${pbit}** → gesendet: ${bits.join('')}${pbit}`],
    };
  }
  const fehler = r.ja();
  const empfangen = [...bits, pbit];
  if (fehler) empfangen[r.ganz(0, 7)] ^= 1;
  const e2 = empfangen.reduce((a, b) => a + b, 0);
  const erkannt = gerade ? e2 % 2 === 1 : e2 % 2 === 0;
  return {
    titel: 'Übertragungsfehler erkennen',
    sp: SP.paritaet,
    text: `Empfangen wurde **${empfangen.join('')}** (7 Datenbits + Paritätsbit am Ende) bei **${gerade ? 'gerader' : 'ungerader'} Parität**. Zeigt die Prüfung einen Fehler an?`,
    felder: [{ id: 'x', label: 'Fehler erkannt?', typ: 'auswahl', erwartet: erkannt ? 'ja' : 'nein', optionen: ['ja', 'nein'] }],
    loesung: [`Einsen insgesamt: ${e2} (${e2 % 2 === 0 ? 'gerade' : 'ungerade'})`, `Erwartet bei ${gerade ? 'gerader' : 'ungerader'} Parität: ${gerade ? 'gerade' : 'ungerade'} → **${erkannt ? 'Fehler erkannt' : 'kein Fehler erkannt'}**`, 'Ein Paritätsbit erkennt einen einzelnen Bitfehler, kann ihn aber nicht berichtigen. Zwei gleichzeitige Fehler bleiben unentdeckt.'],
  };
}

export const ERZEUGER = { zahlensysteme, praefixe, datenmenge, uebertragung, energie, rechte, paritaet };

// Aufgabenarten zum Auswählen (Knöpfe über der Aufgabe). ids = Werte, die r.art() oben ziehen darf.
export function artenFuer(modus, raum = 'AP1') {
  const liste = {
    zahlensysteme: [
      { name: 'Dez → Bin', ids: ['d2b'] },
      { name: 'Bin → Dez', ids: ['b2d'] },
      { name: 'Dez → Hex', ids: ['d2h'] },
      { name: 'Hex → Dez', ids: ['h2d'] },
      { name: 'Bin → Hex', ids: ['b2h'] },
      { name: 'Hex → Bin', ids: ['h2b'] },
      { name: 'Oktal', ids: ['oktal'] },
      { name: 'Zweierpotenzen', ids: ['potenz'] },
    ],
    praefixe: [
      { name: 'kB → KiB', ids: ['dez2bin'] },
      { name: 'KiB → kB', ids: ['bin2dez', 'kib'] },
      { name: 'Bit ↔ Byte', ids: ['bit2byte', 'byte2bit'] },
    ],
    datenmenge: [
      { name: 'Bild', ids: ['bild'] },
      { name: 'Farbtiefe', ids: ['farben'], nur: 'AP1' },
      { name: 'Messwerte', ids: ['messwerte'] },
      { name: 'Mehrbedarf in %', ids: ['mehrbedarf'], nur: 'AP1' },
      { name: 'Bildersammlung', ids: ['sammlung'] },
    ],
    uebertragung: [
      { name: 'Übertragungsdauer', ids: ['dauer', 'dauerMinuten'] },
      { name: 'Benötigte Rate', ids: ['rate'] },
    ],
    energie: [
      { name: 'P = U · I', ids: ['pui'] },
      { name: 'Netzteil', ids: ['netzteil'] },
      { name: 'Energie & Kosten', ids: ['kosten'] },
      { name: 'Wirkungsgrad', ids: ['wirkungsgrad'] },
      { name: 'Stromkosten im Jahr', ids: ['jahr'] },
    ],
    rechte: [
      { name: 'oktal → symbolisch', ids: ['zuSym'] },
      { name: 'symbolisch → oktal', ids: ['zuOktal'] },
      { name: 'Rechte deuten', ids: ['wer'] },
    ],
    paritaet: [
      { name: 'Paritätsbit bilden', ids: ['bilden'] },
      { name: 'Fehler erkennen', ids: ['erkennen'] },
    ],
  }[modus];
  return liste?.filter((a) => !a.nur || a.nur === raum) ?? null;
}
