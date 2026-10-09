// Rechenhilfen für die Erklärungen im Lernweg (Zwischenfragen mit typischen Fehlern, Bilder für große Netze).
// Rein, getestet in tests/subnetz.test.mjs. Blockanfang/-ende raten stammt aus dem früheren lernweg.js.

import { ipZuZahl, zahlZuIp, zerlege, netz } from '../ip.js';

// Antwortmöglichkeiten für „Wo beginnt der Block?“ (im entscheidenden Oktett), aufsteigend, 2 … 4 Stück.
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

// Antwortmöglichkeiten für „Wo endet der Block?“, aufsteigend; enthält den häufigsten Fehler (Anfang des nächsten Blocks).
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

// Hinweise zu falschen Antworten in Worten
export function startHinweis(z, v) {
  const art = bewerteStart(z, v);
  if (art === 'kein-anfang') return `${v} ist kein Blockanfang – Blöcke beginnen nur bei Vielfachen von ${z.block}.`;
  if (art === 'zu-weit') return `Zu weit: Der Block ab ${v} fängt erst nach ${z.wert} an.`;
  return `Zu früh: Der Block ${v}–${v + z.block - 1} ist schon vor ${z.wert} zu Ende.`;
}

export function endeHinweis(z, v) {
  const art = bewerteEnde(z, v);
  if (art === 'naechster-anfang') return `Fast! ${z.start} + ${z.block} = ${v} ist schon der Anfang des nächsten Blocks. Der Block endet eins davor.`;
  if (art === 'zu-kurz') return `Zu kurz: Von ${z.start} bis ${v} sind es nur ${v - z.start + 1} Zahlen, ein Block hat aber ${z.block}.`;
  return 'Zu weit – das gehört schon zum nächsten Block.';
}

// Rolle jedes Oktetts: 'netz' (ganz Netz: abschreiben), 'rechnen' (die Grenze liegt darin), 'host' (ganz Host: 0 bzw. 255).
// Bei /8, /16, /24 gibt es kein 'rechnen'.
export function oktettRollen(praefix) {
  return [0, 1, 2, 3].map((i) => {
    const k = Math.max(0, Math.min(8, praefix - i * 8));
    return k === 8 ? 'netz' : k === 0 ? 'host' : 'rechnen';
  });
}

// Ein Netz unter /24 in Stücke zu je 256 Adressen zerlegt (je ein Wert im 3. Oktett). Bei vielen Stücken:
// die ersten zwei, eine Lücke (null) und das letzte.
export function grossesNetz(ip, praefix) {
  const n = netz(ip, praefix);
  const start = ipZuZahl(n.netz);
  const stuecke = 2 ** Math.max(0, 24 - praefix);
  const stueck = (i) => ({ nr: i, von: zahlZuIp(start + i * 256), bis: zahlZuIp(start + i * 256 + 255) });
  const zeilen = stuecke <= 4 ? Array.from({ length: stuecke }, (_, i) => stueck(i)) : [stueck(0), stueck(1), null, stueck(stuecke - 1)];
  return { netz: n.netz, broadcast: n.broadcast, adressen: n.adressen, hosts: n.hostsKlassisch, stuecke, zeilen };
}

// Der komplette Rechenweg für die Prüfung (Lektion „Rechenweg“ und „Jetzt du“)
export function rechenweg(ip, praefix) {
  const z = zerlege(ip, praefix);
  const n = z.n;
  return {
    maske: n.maske,
    oktett: z.index + 1,
    maskenwert: z.maskenwert,
    block: z.block,
    wert: z.wert,
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
  };
}

// Zufällige Übungsadresse für „Jetzt du“: Präfix /20 … /30, nie Netzadresse oder Broadcast.
export function zufallsAufgabe(r) {
  for (;;) {
    const praefix = r.wahl([25, 26, 27, 28, 29, 30, 26, 27, 28, 29, 24, 23, 22, 20]);
    const a = r.wahl([10, 172, 192]);
    const b = a === 192 ? 168 : a === 172 ? r.ganz(16, 31) : r.ganz(0, 255);
    const ip = [a, b, r.ganz(0, 255), r.ganz(1, 254)].join('.');
    const n = netz(ip, praefix);
    if (ip !== n.netz && ip !== n.broadcast) return { ip, praefix };
  }
}
