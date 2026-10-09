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

// Kurz-Check am Ende jeder Lektion im Verstehen-Raum. Absichtlich an einer anderen Adresse als im Beispiel
// (172.16.8.100/27, für Netze unter /24: 10.4.7.20/23), damit man überträgt statt wiedererkennt.
// Je Frage: frage, optionen, richtig, tipp (bei falscher Antwort), erklaerung (nach dem Lösen), text (keine Zahlen).
export function kurzCheck(lektion) {
  const n = netz('172.16.8.100', 27);
  const g = netz('10.4.7.20', 23);
  const fragen = {
    ip: [
      {
        frage: 'Aus wie vielen Bits besteht eine IPv4-Adresse?',
        optionen: ['8', '16', '32', '64'],
        richtig: '32',
        tipp: 'Wie viele Oktette, wie viele Bits je Oktett?',
        erklaerung: '4 Oktette × 8 Bit = 32 Bit.',
      },
      {
        frage: 'Ist 192.168.1.256 eine gültige IP-Adresse?',
        optionen: ['Ja', 'Nein'],
        richtig: 'Nein',
        text: true,
        tipp: 'Wie groß kann eine Zahl mit 8 Bits höchstens werden?',
        erklaerung: '8 Bits reichen nur von 0 bis 255 – eine 256 passt nicht in ein Oktett.',
      },
    ],
    binaer: [
      {
        frage: 'Welche Bits ergeben die Zahl 192?',
        optionen: ['10000000', '10100000', '11000000', '11100000'],
        richtig: '11000000',
        tipp: 'Passt 128 hinein? Und danach 64?',
        erklaerung: '128 + 64 = 192 → 11000000.',
      },
      {
        frage: 'Welche Zahl steht hinter 00101000?',
        optionen: ['28', '40', '48', '80'],
        richtig: '40',
        tipp: 'Welche Stellenwerte stehen über den Einsen?',
        erklaerung: 'Die Einsen stehen bei 32 und 8: 32 + 8 = 40.',
      },
    ],
    praefix: [
      {
        frage: 'Wie viele Hostbits hat ein /27?',
        optionen: ['3', '5', '8', '27'],
        richtig: '5',
        tipp: 'Eine Adresse hat 32 Bits. Wie viele bleiben nach den Netzbits übrig?',
        erklaerung: '32 − 27 = 5 Hostbits.',
      },
      {
        frage: 'Wie viele Adressen hat ein /27-Netz?',
        optionen: ['27', '30', '32', '64'],
        richtig: String(n.adressen),
        tipp: '2 hoch Hostbits.',
        erklaerung: '5 Hostbits → 2⁵ = 32 Adressen.',
      },
    ],
    maske: [
      {
        frage: 'Welche Subnetzmaske gehört zu /27?',
        optionen: ['255.255.255.192', '255.255.255.224', '255.255.255.240', '255.255.255.27'],
        richtig: n.maske,
        tipp: '27 = 8 + 8 + 8 + 3. Wie viel ergeben 3 Einsen von links?',
        erklaerung: '27 = 8 + 8 + 8 + 3 → im 4. Oktett 3 Einsen: 128 + 64 + 32 = 224.',
      },
      {
        frage: 'Welcher Präfix gehört zu 255.255.255.240?',
        optionen: ['/24', '/26', '/28', '/30'],
        richtig: '/28',
        tipp: 'Wie viele Einsen stecken in 240?',
        erklaerung: '240 = 128 + 64 + 32 + 16 → 4 Einsen. 24 + 4 = /28.',
      },
    ],
    netzadresse: [
      {
        frage: 'Wie lautet die Netzadresse von 172.16.8.100/27?',
        optionen: ['172.16.8.64', '172.16.8.96', '172.16.8.100', '172.16.8.128'],
        richtig: n.netz,
        tipp: 'Blockgröße = 256 − 224. In welchem Block liegt die 100?',
        erklaerung: 'Blockgröße 256 − 224 = 32. 100 : 32 = 3 Rest 4 → 3 × 32 = 96.',
      },
    ],
    broadcast: [
      {
        frage: 'Wie lautet der Broadcast von 172.16.8.100/27?',
        optionen: ['172.16.8.126', '172.16.8.127', '172.16.8.128', '172.16.8.255'],
        richtig: n.broadcast,
        tipp: 'Der Block beginnt bei 96 und hat 32 Zahlen. Wo ist der nächste Block?',
        erklaerung: '96 + 32 = 128 ist schon der nächste Block → Ende 127.',
      },
    ],
    hosts: [
      {
        frage: 'Wie viele Hosts passen in ein /27-Netz?',
        optionen: ['27', '30', '31', '32'],
        richtig: String(n.hostsKlassisch),
        tipp: 'Zwei Adressen bekommt kein Gerät.',
        erklaerung: '2⁵ = 32 Adressen − Netzadresse − Broadcast = 30.',
      },
      {
        frage: 'Welcher ist der erste Host von 172.16.8.100/27?',
        optionen: ['172.16.8.1', '172.16.8.96', '172.16.8.97', '172.16.8.101'],
        richtig: n.erster,
        tipp: 'Netzadresse + 1.',
        erklaerung: 'Netzadresse 172.16.8.96 + 1 = 172.16.8.97.',
      },
    ],
    unter24: [
      {
        frage: 'Wie lautet der Broadcast von 10.4.7.20/23?',
        optionen: ['10.4.6.255', '10.4.7.254', '10.4.7.255', '10.4.255.255'],
        richtig: g.broadcast,
        tipp: 'Bei /23 liegt der Strich im 3. Oktett. Blockgröße dort: 256 − 254.',
        erklaerung: 'Blockgröße 2 → Block 6–7 im 3. Oktett. Broadcast: 7 im 3. Oktett, danach 255 → 10.4.7.255.',
      },
      {
        frage: 'Darf ein PC im Netz 10.4.6.0/23 die Adresse 10.4.6.255 bekommen?',
        optionen: ['Ja', 'Nein'],
        richtig: 'Ja',
        text: true,
        tipp: 'Wo endet das Netz 10.4.6.0/23?',
        erklaerung: 'Das Netz geht bis 10.4.7.255. 10.4.6.255 liegt mittendrin – ein ganz normaler Host.',
      },
    ],
    gateway: [
      {
        frage: 'Ein PC hat 172.16.8.100/27 und schickt ein Paket an 172.16.8.130. Wie?',
        optionen: ['Direkt', 'Übers Gateway'],
        richtig: gleichesNetz('172.16.8.100', '172.16.8.130', 27) ? 'Direkt' : 'Übers Gateway',
        text: true,
        tipp: 'Sein Block ist 96–127. Wo liegt die 130?',
        erklaerung: '130 liegt im Block 128–159 – anderes Netz, also ans Standardgateway.',
      },
      {
        frage: 'Und an 172.16.8.120?',
        optionen: ['Direkt', 'Übers Gateway'],
        richtig: gleichesNetz('172.16.8.100', '172.16.8.120', 27) ? 'Direkt' : 'Übers Gateway',
        text: true,
        tipp: 'Liegt 120 im Block 96–127?',
        erklaerung: '120 liegt im selben Block 96–127 – gleiches Netz, das Paket geht direkt.',
      },
    ],
    aufteilen: [
      {
        frage: 'Ein /24 wird in /26-Netze aufgeteilt. Wie viele Netze entstehen?',
        optionen: ['2', '4', '6', '64'],
        richtig: '4',
        tipp: 'Wie viele Bits kommen fürs Netz dazu?',
        erklaerung: '2 Netzbits mehr → 2² = 4 Netze zu je 64 Adressen.',
      },
      {
        frage: 'Wie viele Adressen sind dabei insgesamt für Netzadressen und Broadcasts reserviert?',
        optionen: ['2', '4', '8', '0'],
        richtig: '8',
        tipp: 'Jedes Netz braucht 2.',
        erklaerung: '4 Netze × 2 = 8. Alle anderen 248 Adressen bleiben für Geräte.',
      },
    ],
  };
  return fragen[lektion] ?? [];
}
