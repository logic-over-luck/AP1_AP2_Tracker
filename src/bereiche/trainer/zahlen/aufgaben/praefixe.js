// Aufgaben „Bit, Byte und Präfixe“: Bit ↔ Byte, Dezimal- ↔ Binärpräfixe, physikalische Größen mit Dezimalpräfix.

import { z, runde, hoch, BIN_EINHEITEN, DEZ_EINHEITEN } from '../rechnen.js';

export const ARTEN = [
  { id: 'bitbyte', name: 'Bit ↔ Byte' },
  { id: 'dez2bin', name: 'GB → GiB' },
  { id: 'bin2dez', name: 'GiB → GB' },
  { id: 'physik', name: 'GHz, Mbit/s & Co.' },
];

const mit2 = (wert) => z(runde(wert, 2), 2);
const RUNDEN = 'Runde auf zwei Nachkommastellen.';

export function erzeuge(r, art) {
  switch (art) {
    case 'bitbyte':
      return bitByte(r);
    case 'dez2bin':
      return dezimalZuBinaer(r);
    case 'bin2dez':
      return binaerZuDezimal(r);
    default:
      return physik(r);
  }
}

function bitByte(r) {
  const form = r.wahl(['bit2byte', 'byte2bit', 'mib2bit']);
  if (form === 'bit2byte') {
    const bit = r.wahl([64, 256, 1024, 4096, 8192, 65536]);
    return {
      text: `Wie viele **Byte** sind **${z(bit)} Bit**?`,
      felder: [{ id: 'x', label: 'Byte', erwartet: bit / 8, einheit: 'Byte' }],
      loesung: ['8 Bit sind 1 Byte – also durch 8 teilen.', `${z(bit)} ÷ 8 = **${z(bit / 8)} Byte**`],
    };
  }
  if (form === 'byte2bit') {
    const byte = r.wahl([16, 64, 250, 512, 1000, 2048]);
    return {
      text: `Wie viele **Bit** sind **${z(byte)} Byte**?`,
      felder: [{ id: 'x', label: 'Bit', erwartet: byte * 8, einheit: 'Bit' }],
      loesung: ['1 Byte sind 8 Bit – also mit 8 multiplizieren.', `${z(byte)} · 8 = **${z(byte * 8)} Bit**`],
    };
  }
  const mib = r.wahl([1, 2, 5, 10, 25]);
  const byte = mib * 1024 ** 2;
  return {
    text: `Wie viele **Bit** sind **${mib} MiB**?`,
    felder: [{ id: 'x', label: 'Bit', erwartet: byte * 8, einheit: 'Bit' }],
    loesung: [`${mib} MiB = ${mib} · 1.024² Byte = ${z(byte)} Byte`, `${z(byte)} · 8 = **${z(byte * 8)} Bit**`],
  };
}

function dezimalZuBinaer(r) {
  const stufe = r.wahl([2, 3, 3, 4]);
  const wert = stufe === 4 ? r.wahl([1, 2, 4, 8, 12, 16]) : r.wahl([250, 256, 500, 512, 960, 1000, 2000, 4000]);
  const [dez, bin] = [DEZ_EINHEITEN[stufe], BIN_EINHEITEN[stufe]];
  const byte = wert * 1000 ** stufe;
  const erg = byte / 1024 ** stufe;
  return {
    text: `Ein Datenträger hat laut Hersteller **${z(wert)} ${dez}**. Wie viel **${bin}** zeigt das Betriebssystem an? ${RUNDEN}`,
    felder: [{ id: 'x', label: bin, erwartet: erg, stellen: 2, einheit: bin }],
    loesung: [
      `Hersteller rechnen dezimal: ${z(wert)} ${dez} = ${z(wert)} · 1.000${hoch(stufe)} Byte = ${z(byte)} Byte`,
      `Das Betriebssystem rechnet binär: ${z(byte)} Byte ÷ 1.024${hoch(stufe)} = ${z(byte)} ÷ ${z(1024 ** stufe)}`,
      `= **${mit2(erg)} ${bin}**`,
      'Es fehlt kein Speicher – dieselbe Bytezahl steht nur in einer anderen Einheit.',
    ],
  };
}

function binaerZuDezimal(r) {
  const stufe = r.wahl([1, 2, 3]);
  const wert = r.wahl([4, 8, 16, 32, 64, 128, 256, 512]);
  const [dez, bin] = [DEZ_EINHEITEN[stufe], BIN_EINHEITEN[stufe]];
  const byte = wert * 1024 ** stufe;
  const erg = byte / 1000 ** stufe;
  return {
    text: `Eine Datei ist **${z(wert)} ${bin}** groß. Wie viel **${dez}** sind das? ${RUNDEN}`,
    felder: [{ id: 'x', label: dez, erwartet: erg, stellen: 2, einheit: dez }],
    loesung: [`${z(wert)} ${bin} = ${z(wert)} · 1.024${hoch(stufe)} Byte = ${z(byte)} Byte`, `${z(byte)} ÷ 1.000${hoch(stufe)} = **${mit2(erg)} ${dez}**`],
  };
}

function physik(r) {
  const form = r.wahl(['ghz', 'mhz', 'mbit', 'kbit', 'tb']);
  if (form === 'ghz') {
    const f = r.wahl([1.8, 2.4, 3, 3.4, 3.6, 4.2, 5]);
    return {
      text: `Ein Prozessor taktet mit **${z(f)} GHz**. Wie viele **Hz** sind das?`,
      felder: [{ id: 'x', label: 'Frequenz', erwartet: f * 1e9, einheit: 'Hz' }],
      loesung: ['Giga ist ein Dezimalpräfix: 1 GHz = 10⁹ Hz = 1.000.000.000 Hz.', `${z(f)} · 1.000.000.000 = **${z(f * 1e9)} Hz**`],
    };
  }
  if (form === 'mhz') {
    const f = r.wahl([100, 800, 1600, 2400, 3200]);
    return {
      text: `Ein Speicherbaustein arbeitet mit **${z(f)} MHz**. Wie viele **kHz** sind das?`,
      felder: [{ id: 'x', label: 'Frequenz', erwartet: f * 1000, einheit: 'kHz' }],
      loesung: ['Mega → Kilo ist eine Stufe von 1.000.', `${z(f)} · 1.000 = **${z(f * 1000)} kHz**`],
    };
  }
  if (form === 'mbit') {
    const rate = r.wahl([16, 50, 100, 250, 1000]);
    return {
      text: `Ein Anschluss hat **${z(rate)} Mbit/s**. Wie viele **bit/s** sind das?`,
      felder: [{ id: 'x', label: 'Rate', erwartet: rate * 1e6, einheit: 'bit/s' }],
      loesung: ['Übertragungsraten haben Dezimalpräfixe: 1 Mbit/s = 1.000.000 bit/s.', `${z(rate)} · 1.000.000 = **${z(rate * 1e6)} bit/s**`],
    };
  }
  if (form === 'kbit') {
    const rate = r.wahl([56, 128, 384, 768]);
    return {
      text: `Eine alte Leitung schafft **${z(rate)} kbit/s**. Wie viele **Byte je Sekunde** sind das?`,
      felder: [{ id: 'x', label: 'Rate', erwartet: (rate * 1000) / 8, einheit: 'Byte/s' }],
      loesung: [`${z(rate)} kbit/s = ${z(rate * 1000)} bit/s`, `÷ 8 = **${z((rate * 1000) / 8)} Byte/s**`],
    };
  }
  const tb = r.wahl([1, 2, 4, 8]);
  return {
    text: `Eine Festplatte ist mit **${tb} TB** beschriftet. Wie viele **Byte** sind das laut Hersteller?`,
    felder: [{ id: 'x', label: 'Byte', erwartet: tb * 1e12, einheit: 'Byte' }],
    loesung: ['Hersteller rechnen dezimal: 1 TB = 1.000⁴ Byte = 10¹² Byte.', `${tb} · 1.000.000.000.000 = **${z(tb * 1e12)} Byte**`],
  };
}
