// Rechenhilfen für den Lernweg „Verstehen“ im Subnetz-Trainer. Rein, getestet in tests/subnetz.test.mjs.

import { ipZuZahl, zahlZuIp, zerlege, maskeZahl } from './ip.js';

// Rolle jedes Oktetts: 'fest' (ganz Netz, wird abgeschrieben), 'grenze' (hier wird gerechnet),
// 'frei' (ganz Host: 0 bei der Netzadresse, 255 beim Broadcast)
export function oktettRollen(praefix) {
  const index = Math.min(3, Math.floor(praefix / 8));
  return [0, 1, 2, 3].map((i) => (i < index ? 'fest' : i === index ? 'grenze' : 'frei'));
}

// Antwortmöglichkeiten für „Wo endet dein Block?“ (im entscheidenden Oktett), aufsteigend.
// Enthält die typischen Fehler: Anfang des nächsten Blocks (start + block) und eins zu wenig.
export function endeOptionen(z) {
  const kandidaten = [z.ende, z.ende + 1, z.ende - 1, z.start + z.block / 2];
  const gueltig = kandidaten.filter((x) => Number.isInteger(x) && x >= z.start && x <= 255);
  return [...new Set(gueltig)].slice(0, 4).sort((a, b) => a - b);
}

// Wie das freie Stück (ab dem entscheidenden Oktett) bei jedem Präfix aufgeteilt wird.
// Alle Zeilen teilen dieselbe Menge Adressen – nur in mehr oder weniger Netze.
export function aufteilTabelle(praefix) {
  const basis = Math.min(3, Math.floor(praefix / 8)) * 8;
  const zeilen = [];
  for (let p = basis; p <= Math.min(basis + 8, 30); p++) {
    const netze = 2 ** (p - basis);
    const adressen = 2 ** (32 - p);
    zeilen.push({ praefix: p, netze, adressen, hosts: adressen - 2, hostsGesamt: netze * (adressen - 2), reserviert: netze * 2 });
  }
  return { gesamt: 2 ** (32 - basis), zeilen };
}

// Vorschlag für eine zweite Adresse: gleiche Stelle im Nachbarblock (bei nur einem Block: weiter weg im selben)
export function nachbarVorschlag(ip, praefix) {
  const z = zerlege(ip, praefix);
  const okt = [...z.oktette];
  if (z.block === 256) okt[z.index] = (z.wert + 100) % 256;
  else okt[z.index] = (z.start > 0 ? z.start - z.block : z.start + z.block) + (z.wert - z.start);
  return okt.join('.');
}

// Adresse mit gesetztem Wert im entscheidenden Oktett und allen Oktetten danach auf `rest` (0 oder 255)
export function adresseImBlock(ip, praefix, wert, rest) {
  const z = zerlege(ip, praefix);
  return z.oktette.map((o, i) => (i < z.index ? o : i === z.index ? wert : rest)).join('.');
}

// Die beiden „falschen Freunde“ unterhalb von /24: x.255 und (x+1).0 sehen aus wie Broadcast und Netz,
// liegen aber mitten im Netz. null, wenn im 4. Oktett gerechnet wird.
export function fallen(ip, praefix) {
  const z = zerlege(ip, praefix);
  if (z.index === 3) return null;
  const netz = ipZuZahl(adresseImBlock(ip, praefix, z.start, 0));
  // Ende des ersten 256er-Stücks im Netz und Anfang des zweiten
  const ende = netz + 255;
  return { endeErstes: zahlZuIp(ende), anfangZweites: zahlZuIp(ende + 1) };
}

// Dezimal → binär wie auf Papier: von links nach rechts prüfen, ob der Stellenwert in den Rest passt.
// Je Stelle: Stellenwert, Rest vorher, passt (Bit 1) und Rest nachher.
export function binaerSchritte(wert) {
  let rest = wert;
  return [128, 64, 32, 16, 8, 4, 2, 1].map((g) => {
    const passt = rest >= g;
    const vorher = rest;
    if (passt) rest -= g;
    return { gewicht: g, vorher, passt, nachher: rest, bit: passt ? 1 : 0 };
  });
}

// Was der Trennstrich mit der echten Adresse macht: je Oktett Netzanteil (Hostbits auf 0) und Hostanteil
// (Netzbits auf 0). Der Netzanteil zusammen ist die Netzadresse, der Hostanteil die Nummer des Geräts im Netz.
export function teileAdresse(ip, praefix) {
  const zahl = ipZuZahl(ip);
  const m = maskeZahl(praefix);
  const netz = (zahl & m) >>> 0;
  const host = (zahl & ~m) >>> 0;
  const oktette = zahlZuIp(zahl)
    .split('.')
    .map(Number)
    .map((wert, i) => {
      const netzBits = Math.max(0, Math.min(8, praefix - i * 8));
      const maske = 256 - 2 ** (8 - netzBits);
      return { wert, netzBits, maske, netz: wert & maske, host: wert & ~maske & 255 };
    });
  return { oktette, netz: zahlZuIp(netz), host: zahlZuIp(host), hostNummer: host, maske: zahlZuIp(m) };
}
