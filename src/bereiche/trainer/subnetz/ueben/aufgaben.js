// Aufgabenerzeuger Subnetz-Trainer. Rein, getestet in tests/subnetz.test.mjs.

import { netz, maske, binaer, gleichesNetz, istPrivat, ipv6Voll, ipv6Kurz, gruppenVoll, istRichtigGekuerzt, aufteilen as vlsm, ipZuZahl, zahlZuIp } from '../ip.js';

const SP = { subnetting: 'AP1-6-2-2', konfig: 'AP1-6-2-1', ipv6: 'AP1-6-2-3' };

function zufallsIp(r, praefix) {
  const art = r.wahl(['192.168', '192.168', '10', '172', 'oeff']);
  let a;
  if (art === '192.168') a = [192, 168, r.ganz(0, 254), r.ganz(1, 254)];
  else if (art === '10') a = [10, r.ganz(0, 255), r.ganz(0, 255), r.ganz(1, 254)];
  else if (art === '172') a = [172, r.ganz(16, 31), r.ganz(0, 255), r.ganz(1, 254)];
  else a = [r.wahl([80, 85, 141, 195, 212]), r.ganz(0, 255), r.ganz(0, 255), r.ganz(1, 254)];
  // Für kleine Präfixe den Host-Teil nicht immer am Netzanfang
  if (praefix <= 16) a[2] = r.ganz(0, 255);
  return a.join('.');
}

function bitWeg(ip, praefix) {
  const b = binaer(ip).replace(/\./g, '');
  const m = '1'.repeat(praefix).padEnd(32, '0');
  const fmt = (s) => s.match(/.{8}/g).join('.');
  const netzBits = b.slice(0, praefix);
  return [
    `Adresse:  \`${fmt(b)}\``,
    `Maske /${praefix}: \`${fmt(m)}\``,
    `Netzanteil = erste ${praefix} Bit: \`${netzBits}\` | Hostanteil: ${32 - praefix} Bit`,
  ];
}

// Netz bestimmen: Netzadresse, Broadcast, Hostbereich, Anzahl Hosts
export function analyse(r) {
  const sonder = r.ja(0.06);
  const praefix = sonder ? r.wahl([31, 32]) : r.wahl([24, 25, 26, 26, 27, 27, 28, 28, 29, 30, 22, 23, 20, 16]);
  const ip = zufallsIp(r, praefix);
  const n = netz(ip, praefix);
  if (praefix >= 31) {
    return {
      titel: `Sonderfall /${praefix}`,
      sp: SP.subnetting,
      text: `Gegeben ist die Adresse **${ip}/${praefix}**. Bestimme die Netzadresse und die Anzahl der Adressen im Netz.`,
      felder: [
        { id: 'netz', label: 'Netzadresse', typ: 'ipv4', erwartet: n.netz },
        { id: 'adressen', label: 'Adressen im Netz', erwartet: n.adressen },
      ],
      loesung: [
        ...bitWeg(ip, praefix),
        `Netzadresse: ${n.netz}, ${n.adressen === 1 ? 'eine einzige Adresse' : `zwei Adressen (${n.netz} und ${n.letzter})`}`,
        praefix === 31
          ? 'Klassisch (2^n − 2) bleiben keine Hosts übrig. In der Praxis nutzt man /31 nach RFC 3021 für Punkt-zu-Punkt-Verbindungen: beide Adressen sind Hosts, eine Broadcastadresse gibt es nicht.'
          : '/32 beschreibt genau einen einzelnen Host (z. B. in Routing-Tabellen oder Firewall-Regeln).',
      ],
    };
  }
  const mitVorletzter = praefix <= 29 && r.ja(0.35);
  const felder = [
    { id: 'netz', label: 'Netzadresse', typ: 'ipv4', erwartet: n.netz },
    { id: 'bc', label: 'Broadcastadresse', typ: 'ipv4', erwartet: n.broadcast },
    { id: 'erster', label: 'Erste nutzbare Adresse', typ: 'ipv4', erwartet: n.erster },
    { id: 'letzter', label: mitVorletzter ? 'Vorletzte nutzbare Adresse' : 'Letzte nutzbare Adresse', typ: 'ipv4', erwartet: mitVorletzter ? n.vorletzter : n.letzter },
    { id: 'hosts', label: 'Nutzbare Hosts', erwartet: n.hosts },
  ];
  return {
    titel: 'Netz bestimmen',
    sp: SP.subnetting,
    text: `Ein Rechner hat die Adresse **${ip}/${praefix}**. Bestimme Netzadresse, Broadcastadresse, den nutzbaren Bereich und die Anzahl nutzbarer Hosts.`,
    felder,
    loesung: [
      ...bitWeg(ip, praefix),
      `Netzadresse: alle Hostbits 0 → **${n.netz}**`,
      `Broadcast: alle Hostbits 1 → **${n.broadcast}**`,
      `Hostbereich: **${n.erster}** bis **${n.letzter}**${mitVorletzter ? `, vorletzte: **${n.vorletzter}**` : ''}`,
      `Hosts: 2^${32 - praefix} − 2 = **${n.hosts}** (Netz- und Broadcastadresse sind nicht nutzbar)`,
      praefix >= 24 ? `Kurzweg: Blockgröße 256 − ${maske(praefix).split('.')[3]} = ${2 ** (32 - praefix)}; Netze beginnen bei Vielfachen davon.` : '',
    ].filter(Boolean),
  };
}

// Präfix ↔ Maske, Anzahl Adressen und Hosts
export function maskeAufgabe(r) {
  const p = r.wahl([8, 16, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
  const art = r.wahl(['p2m', 'm2p', 'hosts']);
  if (art === 'p2m')
    return {
      titel: 'Präfix → Subnetzmaske',
      sp: SP.konfig,
      text: `Wie lautet die Subnetzmaske zum Präfix **/${p}** in Punktschreibweise?`,
      felder: [{ id: 'm', label: 'Subnetzmaske', typ: 'ipv4', erwartet: maske(p) }],
      loesung: [`/${p} = ${p} Einsen, dann ${32 - p} Nullen`, `\`${binaer(maske(p))}\``, `= **${maske(p)}**`],
    };
  if (art === 'm2p')
    return {
      titel: 'Subnetzmaske → Präfix',
      sp: SP.konfig,
      text: `Welche Präfixlänge gehört zur Subnetzmaske **${maske(p)}**?`,
      felder: [{ id: 'p', label: 'Präfix (ohne /)', erwartet: p, platzhalter: 'z. B. 24' }],
      loesung: [`Binär: \`${binaer(maske(p))}\``, `Einsen zählen: **${p}** → /${p}`],
    };
  return {
    titel: 'Adressen und Hosts',
    sp: SP.subnetting,
    text: `Wie viele Adressen hat ein **/${p}**-Netz, und wie viele davon sind als Hosts nutzbar?`,
    felder: [
      { id: 'a', label: 'Adressen', erwartet: 2 ** (32 - p) },
      { id: 'h', label: 'Nutzbare Hosts', erwartet: 2 ** (32 - p) - 2 },
    ],
    loesung: [`Hostbits: 32 − ${p} = ${32 - p}`, `Adressen: 2^${32 - p} = ${(2 ** (32 - p)).toLocaleString('de-DE')}`, `Hosts: Adressen − 2 (Netz und Broadcast) = **${(2 ** (32 - p) - 2).toLocaleString('de-DE')}**`],
  };
}

export function gleich(r) {
  const p = r.wahl([24, 25, 26, 27, 28, 29, 22, 23]);
  const a = zufallsIp(r, p);
  const n = netz(a, p);
  const groesse = 2 ** (32 - p);
  // Zweite Adresse: mal im selben Netz, mal knapp daneben
  const basis = ipZuZahl(n.netz);
  const versatz = r.ja() ? r.ganz(1, groesse - 2) : r.ja() ? groesse + r.ganz(1, groesse - 2) : -r.ganz(1, Math.min(groesse - 2, 60));
  const b = zahlZuIp(Math.max(1, basis + versatz) >>> 0);
  const ja = gleichesNetz(a, b, p);
  return {
    titel: 'Gleiches Netz?',
    sp: SP.subnetting,
    text: `Liegen **${a}/${p}** und **${b}/${p}** im selben Subnetz – können sie sich ohne Router erreichen?`,
    felder: [{ id: 'x', label: 'Selbes Netz?', typ: 'auswahl', erwartet: ja ? 'ja' : 'nein', optionen: ['ja', 'nein'] }],
    loesung: [`Netz von ${a}: ${n.netz} (Bereich bis ${n.broadcast})`, `Netz von ${b}: ${netz(b, p).netz}`, ja ? '**Ja** – gleiche Netzadresse.' : '**Nein** – unterschiedliche Netzadressen, dazwischen braucht es einen Router.'],
  };
}

export function privat(r) {
  const kandidaten = [
    () => `10.${r.ganz(0, 255)}.${r.ganz(0, 255)}.${r.ganz(1, 254)}`,
    () => `172.${r.ganz(16, 31)}.${r.ganz(0, 255)}.${r.ganz(1, 254)}`,
    () => `172.${r.wahl([15, 32, 100, 172])}.${r.ganz(0, 255)}.${r.ganz(1, 254)}`,
    () => `192.168.${r.ganz(0, 255)}.${r.ganz(1, 254)}`,
    () => `192.${r.wahl([167, 169, 0])}.${r.ganz(0, 255)}.${r.ganz(1, 254)}`,
    () => `${r.wahl([8, 11, 85, 141, 217])}.${r.ganz(0, 255)}.${r.ganz(0, 255)}.${r.ganz(1, 254)}`,
  ];
  const ip = r.wahl(kandidaten)();
  const bereich = istPrivat(ip);
  return {
    titel: 'Private Adressen',
    sp: SP.konfig,
    text: `Ist **${ip}** eine private IPv4-Adresse? Wenn ja: zu welchem Bereich gehört sie?`,
    felder: [
      {
        id: 'x',
        label: 'Bereich',
        typ: 'auswahl',
        erwartet: bereich ?? 'öffentlich',
        optionen: [{ wert: '10.0.0.0/8', text: 'privat: 10.0.0.0/8' }, { wert: '172.16.0.0/12', text: 'privat: 172.16.0.0/12' }, { wert: '192.168.0.0/16', text: 'privat: 192.168.0.0/16' }, { wert: 'öffentlich', text: 'nicht privat (öffentlich)' }],
      },
    ],
    loesung: ['Private Bereiche: 10.0.0.0/8 · 172.16.0.0/12 (172.16.0.0 bis 172.31.255.255) · 192.168.0.0/16', bereich ? `**${ip}** liegt in **${bereich}**.` : `**${ip}** liegt in keinem privaten Bereich.`],
  };
}

// ---------- IPv6 ----------

function zufallsIpv6(r) {
  const praefixe = [
    ['2001', 'db8'],
    ['fe80', '0'],
    ['2a02', r.wahl(['8108', '810d', '908'])],
    ['2001', r.wahl(['470', '67c', '1218'])],
  ];
  const [a, b] = r.wahl(praefixe);
  const g = [a, b, ...Array.from({ length: 6 }, () => '0')];
  // Gruppen 3–8 mit Mustern aus Nullen und Werten füllen
  const muster = r.wahl(['00xx0x', 'x00x0x', '0000xx', 'xx000x', 'x0x00x', '00000x', 'x0xx0x', 'xxxxxx']);
  for (let i = 0; i < 6; i++) {
    if (muster[i] === 'x') {
      const v = r.ganz(1, 0xffff);
      g[i + 2] = (r.ja(0.4) ? r.ganz(1, 0xff) : v).toString(16);
    }
  }
  if (a === 'fe80') for (let i = 1; i < 4; i++) g[i] = '0';
  return g.map((x) => x.padStart(4, '0')).join(':');
}

export function ipv6(r) {
  const voll = zufallsIpv6(r);
  const kurz = ipv6Kurz(voll);
  const art = r.wahl(['kuerzen', 'kuerzen', 'ausschreiben', 'teile']);
  const regeln = ['Regel 1: führende Nullen in jeder Gruppe weglassen (0db8 → db8, 0000 → 0).', 'Regel 2: eine Folge von Nullgruppen genau einmal durch :: ersetzen – die längste.'];
  if (art === 'ausschreiben')
    return {
      titel: 'IPv6 ausschreiben',
      sp: SP.ipv6,
      text: `Schreibe die Adresse **${kurz}** vollständig aus (8 Gruppen à 4 Hex-Ziffern).`,
      felder: [
        {
          id: 'x',
          label: 'Ausgeschrieben',
          typ: 'eigen',
          breit: true,
          soll: voll,
          platzhalter: 'xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx',
          pruefe: (e) => {
            const s = String(e ?? '').trim().toLowerCase();
            if (!s) return { ok: false, leer: true };
            const gruppen = s.split(':');
            if (gruppen.length !== 8 || gruppen.some((x) => x.length !== 4)) return { ok: false, grund: 'acht Gruppen mit je vier Ziffern' };
            return { ok: ipv6Voll(s) === voll };
          },
        },
      ],
      loesung: [`:: steht für ${8 - kurz.split('::').flatMap((t) => (t ? t.split(':') : [])).length} Nullgruppen.`, 'Jede Gruppe vorne mit Nullen auf vier Ziffern auffüllen.', `**${voll}**`],
    };
  if (art === 'teile') {
    const g = voll.split(':');
    const iid = g.slice(4).join(':');
    return {
      titel: 'Präfix und Interface-ID',
      sp: SP.ipv6,
      text: `Die Adresse **${kurz}/64** gehört zu einem Rechner. Wie lang ist eine IPv6-Adresse, und wie lautet der Interface-Identifier (gekürzt oder ausgeschrieben)?`,
      felder: [
        { id: 'bit', label: 'Länge in Bit', erwartet: 128, einheit: 'Bit' },
        {
          id: 'iid',
          label: 'Interface-Identifier (letzte 64 Bit)',
          typ: 'eigen',
          breit: true,
          soll: ipv6Kurz(iid, 4),
          pruefe: (e) => {
            const s = String(e ?? '').trim();
            if (!s) return { ok: false, leer: true };
            return { ok: gruppenVoll(s.replace(/^::(?=[0-9a-f])/i, '::'), 4) === iid };
          },
        },
        { id: 'll', label: 'Verbindungslokal (fe80::/10)?', typ: 'auswahl', erwartet: g[0] === 'fe80' ? 'ja' : 'nein', optionen: ['ja', 'nein'] },
      ],
      loesung: ['IPv6: 128 Bit, 8 Gruppen à 16 Bit (4 Hex-Ziffern).', `Ausgeschrieben: ${voll}`, `/64: die ersten 4 Gruppen sind das Präfix (${g.slice(0, 4).join(':')}), die letzten 4 der Interface-Identifier: **${iid}**`, g[0] === 'fe80' ? 'Beginnt mit fe80 → verbindungslokale Adresse (Link-Local).' : 'Beginnt nicht mit fe80 → keine verbindungslokale Adresse.'],
    };
  }
  return {
    titel: 'IPv6 kürzen',
    sp: SP.ipv6,
    text: `Kürze die Adresse **${voll}** so weit wie möglich.`,
    felder: [{ id: 'x', label: 'Gekürzt', typ: 'eigen', breit: true, soll: kurz, platzhalter: 'z. B. 2001:db8::1', pruefe: (e) => (String(e ?? '').trim() ? istRichtigGekuerzt(e, voll) : { ok: false, leer: true }) }],
    loesung: [...regeln, `Ergebnis: **${kurz}**`],
  };
}

// ---------- Zusatz: Netz nach Hostbedarf aufteilen ----------

export function aufteilen(r) {
  const basis = r.wahl(['192.168.10.0', '192.168.50.0', '10.20.30.0', '172.16.4.0']);
  const abteilungen = r.mische(['Verwaltung', 'Vertrieb', 'Entwicklung', 'Lager', 'Server', 'Gäste-WLAN']).slice(0, r.ganz(3, 4));
  let bedarfe;
  let erg = null;
  do {
    bedarfe = abteilungen.map((name) => ({ name, hosts: r.wahl([2, 5, 10, 12, 20, 25, 30, 40, 50, 60, 100]) }));
    erg = vlsm(basis, 24, bedarfe);
  } while (!erg);
  const sortiert = [...erg];
  return {
    titel: 'Netz nach Hostbedarf aufteilen',
    sp: SP.subnetting,
    text: `Das Netz **${basis}/24** soll aufgeteilt werden. Vergib die Subnetze lückenlos ab ${basis}, **größten Bedarf zuerst**, jeweils so klein wie möglich.\n${bedarfe.map((b) => `- ${b.name}: ${b.hosts} Hosts`).join('\n')}`,
    felder: sortiert.flatMap((b, i) => [
      { id: `p${i}`, label: `${b.name} (${b.hosts} Hosts): Präfix`, erwartet: b.praefix, platzhalter: 'z. B. 26' },
      { id: `n${i}`, label: `${b.name}: Netzadresse`, typ: 'ipv4', erwartet: b.netz },
    ]),
    loesung: [
      'Je Bedarf: kleinste Zweierpotenz mit 2^h − 2 ≥ Hosts → Präfix = 32 − h',
      ...sortiert.map((b) => `${b.name}: ${b.hosts} Hosts → ${b.groesse} Adressen → /${b.praefix} → ${b.netz} bis ${b.broadcast}`),
      'Größte Netze zuerst, damit jedes Netz an einer passenden Grenze beginnt.',
    ],
  };
}

export const ERZEUGER = { analyse, maske: maskeAufgabe, gleich, privat, ipv6, aufteilen };
