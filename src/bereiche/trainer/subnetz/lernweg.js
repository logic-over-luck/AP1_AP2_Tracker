// Rechenhilfen für den Lernblock „Verstehen“ im Subnetz-Trainer. Rein, getestet in tests/subnetz.test.mjs.
// Die eigentliche IP-Rechnung steht in ip.js; hier liegt nur, was die Schritte zusätzlich brauchen.

import { ipZuZahl, zahlZuIp, zerlege, maskeZahl, netz, gleichesNetz } from './ip.js';

export const STELLENWERTE = [128, 64, 32, 16, 8, 4, 2, 1];

// Netzbits je Oktett (0 … 8), z. B. /26 → [8, 8, 8, 2], /23 → [8, 8, 7, 0]
export function netzBitsJeOktett(praefix) {
  return [0, 1, 2, 3].map((i) => Math.max(0, Math.min(8, praefix - i * 8)));
}

// Rolle jedes Oktetts: 'netz' (ganz Netz: abschreiben), 'strich' (der Strich geht hindurch: hier rechnen),
// 'host' (ganz Host: 0 bei der Netzadresse, 255 beim Broadcast). Bei /8, /16, /24 gibt es kein 'strich'.
export function oktettRollen(praefix) {
  return netzBitsJeOktett(praefix).map((k) => (k === 8 ? 'netz' : k === 0 ? 'host' : 'strich'));
}

// Wert eines Masken-Oktetts mit `einsen` Einsen von links: 0, 128, 192, 224, 240, 248, 252, 254, 255
export function maskenwert(einsen) {
  return 256 - 2 ** (8 - einsen);
}

// Dezimal → binär wie auf Papier: von links nach rechts prüfen, ob der Stellenwert in den Rest passt.
// Je Stelle: Stellenwert, Rest vorher, passt (Bit 1) und Rest nachher.
export function binaerSchritte(wert) {
  let rest = wert;
  return STELLENWERTE.map((g) => {
    const passt = rest >= g;
    const vorher = rest;
    if (passt) rest -= g;
    return { gewicht: g, vorher, passt, nachher: rest, bit: passt ? 1 : 0 };
  });
}

// Ist die Adresse in ihrem Netz ein Gerät, die Netzadresse oder der Broadcast?
export function adressArt(ip, praefix) {
  const n = netz(ip, praefix);
  if (praefix <= 30 && ip === n.netz) return 'netz';
  if (praefix <= 30 && ip === n.broadcast) return 'broadcast';
  return 'host';
}

// Antwortmöglichkeiten für „Wo beginnt dein Block?“ (im Strich-Oktett), aufsteigend, 2 … 4 Stück.
// Neben der richtigen Antwort die typischen Fehler: die Zahl selbst, der Block davor und der danach.
export function startOptionen(z) {
  const kandidaten = [z.start, z.wert, z.start + z.block, z.start - z.block, z.start + z.block / 2, z.start - 2 * z.block];
  const gueltig = kandidaten.filter((x) => Number.isInteger(x) && x >= 0 && x <= 255);
  return [...new Set(gueltig)].slice(0, 4).sort((a, b) => a - b);
}

// 'richtig' | 'kein-anfang' (kein Vielfaches der Blockgröße) | 'zu-weit' (Block beginnt erst nach dem Wert) | 'zu-frueh'
export function bewerteStart(z, v) {
  if (v === z.start) return 'richtig';
  if (v % z.block !== 0) return 'kein-anfang';
  return v > z.wert ? 'zu-weit' : 'zu-frueh';
}

// Antwortmöglichkeiten für „Wo endet dein Block?“, aufsteigend. Enthält den häufigsten Fehler:
// den Anfang des nächsten Blocks (start + block).
export function endeOptionen(z) {
  const kandidaten = [z.ende, z.ende + 1, z.ende - 1, z.start + z.block / 2];
  const gueltig = kandidaten.filter((x) => Number.isInteger(x) && x >= z.start && x <= 255);
  return [...new Set(gueltig)].slice(0, 4).sort((a, b) => a - b);
}

// 'richtig' | 'naechster-anfang' (start + block, schon der nächste Block) | 'zu-kurz' | 'zu-weit'
export function bewerteEnde(z, v) {
  if (v === z.ende) return 'richtig';
  if (v === z.ende + 1) return 'naechster-anfang';
  return v < z.ende ? 'zu-kurz' : 'zu-weit';
}

// Die Hostbits einer Adresse als Text, an Oktettgrenzen mit Leerzeichen getrennt (z. B. /23, x.40.255 → „0 11111111“)
export function hostBits(ip, praefix) {
  const zahl = ipZuZahl(ip);
  let text = '';
  for (let i = praefix; i < 32; i++) {
    if (i > praefix && i % 8 === 0) text += ' ';
    text += (zahl >>> (31 - i)) & 1;
  }
  return text;
}

// Beispiel für Präfixe unter /24: Das Netz besteht aus mehreren Stücken zu je 256 Adressen. Die Grenzen
// zwischen den Stücken (x.255 und (x+1).0) liegen mitten im Netz und sind normale Hosts.
// Bei /24 und mehr wird dieselbe Adresse mit /23 gezeigt.
export function grossesNetz(ip, praefix) {
  const p = praefix < 24 ? praefix : 23;
  const n = netz(ip, p);
  const start = ipZuZahl(n.netz);
  const stuecke = 2 ** (24 - p);
  const stueck = (i) => ({ nr: i, von: zahlZuIp(start + i * 256), bis: zahlZuIp(start + i * 256 + 255) });
  // Bei vielen Stücken: die ersten zwei, eine Lücke (null) und das letzte
  const zeilen = stuecke <= 4 ? Array.from({ length: stuecke }, (_, i) => stueck(i)) : [stueck(0), stueck(1), null, stueck(stuecke - 1)];
  return {
    praefix: p,
    eigenes: praefix < 24,
    netz: n.netz,
    broadcast: n.broadcast,
    adressen: n.adressen,
    hosts: n.hostsKlassisch,
    stuecke,
    zeilen,
    endeErstes: zahlZuIp(start + 255),
    anfangZweites: zahlZuIp(start + 256),
  };
}

// Drei Ziele für „Gleiches Netz?“: ein Gerät im eigenen Netz, eins an derselben Stelle im Nachbarnetz
// (letztes Netzbit gekippt) und eins im Internet. Ob es dasselbe Netz ist, wird immer gerechnet.
export function vergleichsZiele(ip, praefix) {
  const n = netz(ip, praefix);
  const eigen = ipZuZahl(ip);
  const letzter = ipZuZahl(n.letzter);
  const gleich = eigen !== letzter ? letzter : ipZuZahl(n.erster);
  const nachbar = (eigen ^ (2 ** (32 - praefix))) >>> 0;
  const fern = ip.startsWith('8.') ? '9.9.9.9' : '8.8.8.8';
  return [
    { id: 'drucker', name: 'Drucker', ip: zahlZuIp(gleich) },
    { id: 'server', name: 'Server', ip: zahlZuIp(nachbar) },
    { id: 'internet', name: 'Webseite im Internet', ip: fern },
  ].map((ziel) => ({ ...ziel, gleich: gleichesNetz(ip, ziel.ip, praefix), netz: netz(ziel.ip, praefix).netz }));
}

// Wie das freie Stück (ab dem Oktett mit dem Strich) bei jedem Präfix aufgeteilt wird.
// Alle Zeilen teilen dieselbe Menge Adressen – nur in mehr oder weniger Netze.
export function aufteilTabelle(praefix) {
  const basis = Math.min(3, Math.floor(praefix / 8)) * 8;
  const zeilen = [];
  for (let p = basis; p <= Math.min(basis + 8, 30); p++) {
    const netze = 2 ** (p - basis);
    const adressen = 2 ** (32 - p);
    zeilen.push({ praefix: p, netze, adressen, hosts: adressen - 2, hostsGesamt: netze * (adressen - 2), reserviert: netze * 2 });
  }
  return { basis, gesamt: 2 ** (32 - basis), zeilen };
}

// Der schnelle Rechenweg ohne Bilder: alle Zwischenergebnisse für die Prüfung.
// ohneRechnung: Der Strich liegt genau zwischen zwei Oktetten (/8, /16, /24) – nur abschreiben, 0 und 255.
export function rechenweg(ip, praefix) {
  const z = zerlege(ip, praefix);
  const n = z.n;
  const k = z.netzBitsImOktett;
  return {
    teile: netzBitsJeOktett(praefix)
      .slice(0, z.index + 1)
      .filter((x) => x > 0),
    nr: z.index + 1,
    netzBits: k,
    ohneRechnung: k === 0,
    wert: z.wert,
    maskenwert: z.maskenwert,
    block: z.block,
    blockNr: z.blockNr,
    rest: z.wert - z.start,
    start: z.start,
    ende: z.ende,
    hostBits: 32 - praefix,
    adressen: n.adressen,
    hosts: n.hostsKlassisch,
    netz: n.netz,
    broadcast: n.broadcast,
    erster: n.erster,
    letzter: n.letzter,
    maske: n.maske,
  };
}

// Eine Übungsaufgabe für „Jetzt du“: meist /24 … /30, ab und zu darunter. Nie die Netzadresse oder der Broadcast.
export function zufallsAufgabe(r) {
  for (;;) {
    const praefix = r.wahl([25, 26, 27, 28, 29, 30, 26, 27, 28, 29, 24, 23, 22, 20]);
    const a = r.wahl([10, 172, 192]);
    const b = a === 192 ? 168 : a === 172 ? r.ganz(16, 31) : r.ganz(0, 255);
    const ip = [a, b, r.ganz(0, 255), r.ganz(1, 254)].join('.');
    if (adressArt(ip, praefix) === 'host') return { ip, praefix };
  }
}

// Eingegebene IPv4-Adresse lesen (Leerzeichen und führende Nullen sind egal). null, wenn ungültig.
export function leseIp(text) {
  const teile = String(text ?? '')
    .replace(/\s+/g, '')
    .split('.');
  if (teile.length !== 4 || teile.some((t) => !/^\d{1,3}$/.test(t) || Number(t) > 255)) return null;
  return teile.map(Number).join('.');
}

// Eingegebene ganze Zahl lesen; Tausenderpunkte und Leerzeichen sind erlaubt („4.094“). null, wenn keine Zahl.
export function leseZahl(text) {
  const s = String(text ?? '').replace(/[\s.]/g, '');
  return /^\d+$/.test(s) ? Number(s) : null;
}

// Was der Strich mit der echten Adresse macht: Netzteil (Hostbits auf 0) und Hostteil (Netzbits auf 0).
// Der Netzteil ist die Netzadresse, der Hostteil die Nummer des Geräts im Netz.
export function teileAdresse(ip, praefix) {
  const zahl = ipZuZahl(ip);
  const m = maskeZahl(praefix);
  const host = (zahl & ~m) >>> 0;
  return { netz: zahlZuIp((zahl & m) >>> 0), hostNummer: host };
}
