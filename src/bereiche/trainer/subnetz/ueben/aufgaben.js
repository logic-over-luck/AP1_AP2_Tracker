// Aufgabenerzeuger Subnetz-Trainer. Rein, getestet in tests/subnetz.test.mjs.

import { netz, maske, binaer, gleichesNetz, istPrivat, ipv6Voll, ipv6Kurz, gruppenVoll, istRichtigGekuerzt, aufteilen as vlsm, ipZuZahl, zahlZuIp, zerlege } from '../ip.js';
import { pruefeStatisch } from '../verstehen/rechnen.js';

const SP = { subnetting: 'AP1-6-2-2', konfig: 'AP1-6-2-1', ipv6: 'AP1-6-2-3', mac: 'AP1-6-2-4' };

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
  return [`Adresse:  \`${fmt(b)}\``, `Maske /${praefix}: \`${fmt(m)}\``, `Netzanteil = erste ${praefix} Bit: \`${netzBits}\` | Hostanteil: ${32 - praefix} Bit`];
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

// Präfix ↔ Subnetzmaske
export function maskeAufgabe(r) {
  const p = r.wahl([8, 16, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
  if (r.ja())
    return {
      titel: 'Präfix → Subnetzmaske',
      sp: SP.konfig,
      text: `Wie lautet die Subnetzmaske zum Präfix **/${p}** in Punktschreibweise?`,
      felder: [{ id: 'm', label: 'Subnetzmaske', typ: 'ipv4', erwartet: maske(p) }],
      loesung: [`/${p} = ${p} Einsen, dann ${32 - p} Nullen`, `\`${binaer(maske(p))}\``, `= **${maske(p)}**`],
    };
  return {
    titel: 'Subnetzmaske → Präfix',
    sp: SP.konfig,
    text: `Welche Präfixlänge gehört zur Subnetzmaske **${maske(p)}**?`,
    felder: [{ id: 'p', label: 'Präfix (ohne /)', erwartet: p, platzhalter: 'z. B. 24' }],
    loesung: [`Binär: \`${binaer(maske(p))}\``, `Einsen zählen: **${p}** → /${p}`],
  };
}

// Netzgröße, nutzbare Hosts und Blockgröße
export function hostsAufgabe(r) {
  const p = r.wahl([16, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30]);
  if (r.ja(0.4)) {
    const z = zerlege('10.0.0.0', p);
    const nr = z.index + 1;
    return {
      titel: 'Blockgröße',
      sp: SP.subnetting,
      text: `Ein Netz hat die Subnetzmaske **${maske(p)}** (/${p}). In welchem Oktett liegt die Grenze, und wie groß ist dort die Blockgröße?`,
      felder: [
        { id: 'o', label: 'Entscheidendes Oktett', typ: 'auswahl', erwartet: String(nr), optionen: ['1', '2', '3', '4'].map((x) => ({ wert: x, text: `${x}. Oktett` })) },
        { id: 'b', label: 'Blockgröße', erwartet: z.block },
      ],
      loesung: [
        `Erstes Oktett der Subnetzmaske, das nicht 255 ist: das **${nr}.** (Wert ${z.maskenwert})`,
        `Blockgröße = 256 − ${z.maskenwert} = **${z.block}**`,
        z.block === 256 ? 'Die Grenze liegt genau zwischen zwei Oktetten – das ganze Oktett ist ein Block (0 bis 255).' : `Netze beginnen dort bei 0, ${z.block}, ${2 * z.block} …`,
      ],
    };
  }
  return {
    titel: 'Adressen und Hosts',
    sp: SP.subnetting,
    text: `Wie viele Adressen hat ein **/${p}**-Netz, und wie viele davon sind als Hosts nutzbar?`,
    felder: [
      { id: 'a', label: 'Adressen', erwartet: 2 ** (32 - p) },
      { id: 'h', label: 'Nutzbare Hosts', erwartet: 2 ** (32 - p) - 2 },
    ],
    loesung: [
      `Hostbits: 32 − ${p} = ${32 - p}`,
      `Adressen: 2^${32 - p} = ${(2 ** (32 - p)).toLocaleString('de-DE')}`,
      `Hosts: Adressen − 2 (Netz und Broadcast) = **${(2 ** (32 - p) - 2).toLocaleString('de-DE')}**`,
    ],
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
    loesung: [
      `Netz von ${a}: ${n.netz} (Bereich bis ${n.broadcast})`,
      `Netz von ${b}: ${netz(b, p).netz}`,
      ja ? '**Ja** – gleiche Netzadresse.' : '**Nein** – unterschiedliche Netzadressen, dazwischen braucht es einen Router.',
    ],
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
        optionen: [
          { wert: '10.0.0.0/8', text: 'privat: 10.0.0.0/8' },
          { wert: '172.16.0.0/12', text: 'privat: 172.16.0.0/12' },
          { wert: '192.168.0.0/16', text: 'privat: 192.168.0.0/16' },
          { wert: 'öffentlich', text: 'nicht privat (öffentlich)' },
        ],
      },
    ],
    loesung: [
      'Private Bereiche: 10.0.0.0/8 · 172.16.0.0/12 (172.16.0.0 bis 172.31.255.255) · 192.168.0.0/16',
      bereich ? `**${ip}** liegt in **${bereich}**.` : `**${ip}** liegt in keinem privaten Bereich.`,
    ],
  };
}

// ---------- Konfiguration prüfen ----------

// Ein kleines Firmennetz: Netz, Gateway (erste oder letzte nutzbare), Server, DHCP-Bereich (bei größeren Netzen)
function firmennetz(r) {
  const p = r.wahl([24, 24, 25, 26, 27, 28]);
  const art = r.wahl(['192.168', '10', '172']);
  const ip =
    art === '192.168'
      ? [192, 168, r.ganz(0, 254), r.ganz(1, 254)]
      : art === '10'
        ? [10, r.ganz(0, 255), r.ganz(0, 254), r.ganz(1, 254)]
        : [172, r.ganz(16, 31), r.ganz(0, 254), r.ganz(1, 254)];
  const n = netz(ip.join('.'), p);
  const start = ipZuZahl(n.netz);
  const groesse = n.adressen;
  const gwErster = r.ja();
  const gw = gwErster ? n.erster : n.letzter;
  const server = zahlZuIp(start + (gwErster ? 2 : 1) + r.ganz(0, 3));
  const dhcp = groesse >= 64 ? [zahlZuIp(start + Math.floor(groesse / 2)), zahlZuIp(start + groesse - 10)] : null;
  return {
    n,
    p,
    gw,
    gwErster,
    server,
    dhcp,
    belegt: [
      { ip: gw, name: 'Router' },
      { ip: server, name: 'Server' },
    ],
  };
}

export function konfig(r) {
  const f = firmennetz(r);
  const { n, p } = f;
  const netzText = `${n.netz}/${p}`;
  const art = r.wahl(['frei', 'eintragen', 'fehler']);
  if (art === 'frei') {
    const s = { netzAdr: n.netz, praefix: p, belegt: f.belegt, dhcp: f.dhcp };
    let soll = null;
    for (let z = ipZuZahl(n.erster); z <= ipZuZahl(n.letzter); z++)
      if (pruefeStatisch(zahlZuIp(z), s).ok) {
        soll = zahlZuIp(z);
        break;
      }
    return {
      titel: 'Freie statische Adresse',
      sp: SP.konfig,
      text: `Netz **${netzText}**. Der Router hat **${f.gw}**, der Server **${f.server}**.${f.dhcp ? ` Der DHCP-Server vergibt **${f.dhcp[0]}** bis **${f.dhcp[1]}**.` : ''} Trage für den neuen Netzwerkdrucker eine passende statische Adresse und die Subnetzmaske ein.`,
      felder: [
        {
          id: 'ip',
          label: 'IP-Adresse des Druckers',
          typ: 'eigen',
          soll,
          platzhalter: 'eine freie Adresse',
          pruefe: (e) => (String(e ?? '').trim() ? pruefeStatisch(e, s) : { ok: false, leer: true }),
        },
        { id: 'm', label: 'Subnetzmaske', typ: 'ipv4', erwartet: n.maske },
        { id: 'gw', label: 'Standardgateway', typ: 'ipv4', erwartet: f.gw },
      ],
      loesung: [
        `Netz ${n.netz} bis ${n.broadcast} (Blockgröße ${n.adressen}), Hosts ${n.erster} bis ${n.letzter}`,
        `Belegt: Router ${f.gw}, Server ${f.server}${f.dhcp ? `; DHCP-Bereich ${f.dhcp[0]} bis ${f.dhcp[1]} meiden` : ''}`,
        `Zum Beispiel **${soll}** – jede andere freie Adresse im Hostbereich ist auch richtig`,
        `Subnetzmaske /${p} = **${n.maske}**, Standardgateway = Router **${f.gw}**`,
      ],
    };
  }
  if (art === 'eintragen') {
    const pc = zahlZuIp(ipZuZahl(n.erster) + Math.floor(n.hosts / 2));
    return {
      titel: 'Eingabemaske ausfüllen',
      sp: SP.konfig,
      text: `Netz **${netzText}**. Der Router hat die **${f.gwErster ? 'erste' : 'letzte'} nutzbare Adresse** und ist auch DNS-Server. Ein PC bekommt fest **${pc}**. Was trägst du ein?`,
      felder: [
        { id: 'm', label: 'Subnetzmaske', typ: 'ipv4', erwartet: n.maske },
        { id: 'gw', label: 'Standardgateway', typ: 'ipv4', erwartet: f.gw },
        { id: 'dns', label: 'Bevorzugter DNS-Server', typ: 'ipv4', erwartet: f.gw },
      ],
      loesung: [
        `/${p} → Subnetzmaske **${n.maske}**`,
        `Netz ${n.netz}, Broadcast ${n.broadcast} → ${f.gwErster ? `erste nutzbare = Netzadresse + 1` : 'letzte nutzbare = Broadcast − 1'} = **${f.gw}**`,
        `DNS-Server = Router = **${f.gw}**`,
      ],
    };
  }
  // Fehler finden
  const pc = zahlZuIp(ipZuZahl(n.erster) + Math.floor(n.hosts / 2));
  const fehler = r.wahl(['gw', 'ip', 'maske', 'keiner']);
  const fremdGw = zahlZuIp(ipZuZahl(n.netz) + n.adressen + 1);
  const conf = {
    ip: fehler === 'ip' ? r.wahl([n.netz, n.broadcast]) : pc,
    maske: fehler === 'maske' ? n.maske.replace(/\d+$/, (x) => (x === '0' ? '100' : String(Number(x) + 1))) : n.maske,
    gw: fehler === 'gw' ? fremdGw : f.gw,
  };
  const optionen = [
    { wert: 'ip', text: 'die IP-Adresse' },
    { wert: 'maske', text: 'die Subnetzmaske' },
    { wert: 'gw', text: 'das Standardgateway' },
    { wert: 'keiner', text: 'nichts – alles passt' },
  ];
  const grund = {
    ip: `${conf.ip} ist die ${conf.ip === n.netz ? 'Netzadresse' : 'Broadcastadresse'} des Netzes ${netzText} – die bekommt kein Gerät.`,
    maske: `${conf.maske} ist keine gültige Subnetzmaske (die Einsen stehen nicht lückenlos links); richtig wäre ${n.maske}.`,
    gw: `${fremdGw} liegt nicht im Netz ${netzText} (${n.netz} bis ${n.broadcast}) – der PC kann das Gateway nicht direkt erreichen.`,
    keiner: `Adresse ist ein Host, Subnetzmaske passt zu /${p}, Gateway ${f.gw} liegt im selben Netz.`,
  };
  return {
    titel: 'Fehler in der Konfiguration',
    sp: SP.konfig,
    text: `Das Netz ist **${netzText}**, der Router hat **${f.gw}**. Ein PC ist so eingestellt:\n- IP-Adresse: **${conf.ip}**\n- Subnetzmaske: **${conf.maske}**\n- Standardgateway: **${conf.gw}**\nWas ist falsch?`,
    felder: [{ id: 'x', label: 'Fehler', typ: 'auswahl', erwartet: fehler, optionen }],
    loesung: [
      `Netz ${n.netz} bis ${n.broadcast}, Hosts ${n.erster} bis ${n.letzter}, Subnetzmaske ${n.maske}`,
      `**${optionen.find((o) => o.wert === fehler).text}**: ${grund[fehler]}`,
    ],
  };
}

// ---------- MAC, ARP und DHCP ----------

const HERSTELLER = ['00:1A:2B', '3C:52:82', '00:80:77', 'F4:8E:38', 'AC:DE:48', '00:50:56'];
const hexByte = (r) => r.ganz(0, 255).toString(16).toUpperCase().padStart(2, '0');
const macNorm = (s) =>
  String(s ?? '')
    .replace(/[\s:.-]/g, '')
    .toUpperCase();

function macFeld(id, label, soll) {
  return {
    id,
    label,
    typ: 'eigen',
    breit: true,
    soll,
    platzhalter: 'z. B. 00-1A-2B',
    pruefe: (e) => (String(e ?? '').trim() ? { ok: macNorm(e) === macNorm(soll) } : { ok: false, leer: true }),
  };
}

export function macAufgabe(r) {
  const art = r.wahl(['hersteller', 'arp']);
  if (art === 'hersteller') {
    const trenner = r.wahl([':', '-']);
    const bytes = [...r.wahl(HERSTELLER).split(':'), hexByte(r), hexByte(r), hexByte(r)];
    const mac = bytes.join(trenner);
    return {
      titel: 'MAC-Adresse lesen',
      sp: SP.mac,
      text: `Ein Gerät hat die MAC-Adresse **${mac}**. Wie lang ist eine MAC-Adresse, und wie lautet die Herstellerkennung?`,
      felder: [{ id: 'bit', label: 'Länge in Bit', erwartet: 48, einheit: 'Bit' }, macFeld('h', 'Herstellerkennung', bytes.slice(0, 3).join(trenner))],
      loesung: [
        '6 Bytes × 8 Bit = **48 Bit**, geschrieben als 12 Hexadezimalziffern',
        `Die vordere Hälfte (3 Bytes) ist die Herstellerkennung: **${bytes.slice(0, 3).join(trenner)}**`,
      ],
    };
  }
  // art === 'arp'
  {
    const basis = r.wahl(['192.168.0', '192.168.1', '10.0.0', '172.16.5']);
    const eintraege = r
      .mische([1, 10, 20, 30, 50, 100, 254])
      .slice(0, 3)
      .map((h) => ({ ip: `${basis}.${h}`, mac: [hexByte(r), hexByte(r), hexByte(r), hexByte(r), hexByte(r), hexByte(r)].join('-').toLowerCase() }));
    const ziel = r.wahl(eintraege);
    const zeilen = eintraege.map((e) => `- \`${e.ip.padEnd(15)}  ${e.mac}  dynamisch\``).join('\n');
    return {
      titel: 'arp -a deuten',
      sp: SP.mac,
      text: `Der Befehl \`arp -a\` zeigt:\n${zeilen}\nWelche MAC-Adresse hat das Gerät **${ziel.ip}**, und wie ist der Eintrag entstanden?`,
      felder: [
        macFeld('m', `MAC-Adresse von ${ziel.ip}`, ziel.mac),
        {
          id: 'w',
          label: '„dynamisch“ heißt',
          typ: 'auswahl',
          erwartet: 'arp',
          optionen: [
            { wert: 'arp', text: 'automatisch per ARP gelernt' },
            { wert: 'dhcp', text: 'vom DHCP-Server zugeteilt' },
            { wert: 'hand', text: 'von Hand eingetragen' },
          ],
        },
      ],
      loesung: [
        `Spalten: IP-Adresse (Internetadresse) · MAC-Adresse (physische Adresse) · Typ`,
        `${ziel.ip} → **${ziel.mac}**`,
        '„dynamisch“ = per **ARP** gelernt (Anfrage per Broadcast, Antwort des Geräts); „statisch“ = fest eingetragen',
      ],
    };
  }
}

// DHCP: was er zuteilt, wie viele Adressen ein Bereich hat, was 169.254.x.x bedeutet
export function dhcpAufgabe(r) {
  const art = r.wahl(['apipa', 'liefert', 'bereich']);
  if (art === 'bereich') {
    const basis = r.wahl(['192.168.10', '192.168.178', '10.1.20', '172.16.4']);
    const von = r.wahl([20, 50, 100, 101, 150]);
    const bis = Math.min(254, von + r.wahl([49, 99, 100, 50, 30]));
    return {
      titel: 'Größe des DHCP-Bereichs',
      sp: SP.mac,
      text: `Im Netz **${basis}.0/24** vergibt der DHCP-Server die Adressen **${basis}.${von}** bis **${basis}.${bis}**. Wie viele Clients können höchstens gleichzeitig eine Adresse per DHCP bekommen?`,
      felder: [{ id: 'x', label: 'Clients', erwartet: bis - von + 1 }],
      loesung: [
        `Von ${von} bis ${bis} – beide Enden zählen mit: ${bis} − ${von} + 1 = **${bis - von + 1}**`,
        'Jede Adresse kann nur an einen Client gleichzeitig vergeben werden.',
      ],
    };
  }
  if (art === 'apipa') {
    const ip = `169.254.${r.ganz(1, 254)}.${r.ganz(1, 254)}`;
    return {
      titel: 'Adresse aus 169.254.x.x',
      sp: SP.mac,
      text: `Ein PC soll seine Adresse per DHCP bekommen. ipconfig zeigt **${ip}** und kein Standardgateway. Was ist passiert?`,
      felder: [
        {
          id: 'x',
          label: 'Ursache',
          typ: 'auswahl',
          erwartet: 'kein-dhcp',
          optionen: [
            { wert: 'kein-dhcp', text: 'kein DHCP-Server erreicht – der PC hat sich selbst eine Adresse gegeben' },
            { wert: 'router', text: 'der Router hat ihm eine öffentliche Adresse gegeben' },
            { wert: 'statisch', text: 'jemand hat die Adresse statisch eingetragen' },
            { wert: 'ipv6', text: 'das ist eine IPv6-Adresse' },
          ],
        },
      ],
      loesung: [
        '169.254.0.0/16 nimmt sich ein Client selbst, wenn **kein DHCP-Server antwortet** (APIPA)',
        'Prüfen: Kabel bzw. WLAN, läuft der DHCP-Server, hat er noch freie Adressen?',
      ],
    };
  }
  // art === 'liefert'
  const fehlt = r.wahl(['MAC-Adresse', 'Broadcastadresse']);
  return {
    titel: 'Was liefert DHCP?',
    sp: SP.mac,
    text: 'Welche dieser Angaben teilt ein DHCP-Server einem Client **nicht** zu?',
    felder: [
      {
        id: 'x',
        label: 'Antwort',
        typ: 'auswahl',
        erwartet: fehlt,
        optionen: r.mische([...r.mische(['IP-Adresse', 'Subnetzmaske', 'Standardgateway', 'DNS-Server']).slice(0, 3), fehlt]),
      },
    ],
    loesung: [
      'DHCP teilt zu: **IP-Adresse, Subnetzmaske, Standardgateway, DNS-Server**',
      fehlt === 'MAC-Adresse' ? 'Die MAC-Adresse ist fest in der Netzwerkkarte – sie wird nicht verteilt.' : 'Die Broadcastadresse ergibt sich aus IP-Adresse und Subnetzmaske.',
    ],
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
  const regeln = [
    'Regel 1: führende Nullen in jeder Gruppe weglassen (0db8 → db8, 0000 → 0).',
    'Regel 2: eine Folge von Nullgruppen genau einmal durch :: ersetzen – die längste.',
  ];
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
            const s = String(e ?? '')
              .trim()
              .toLowerCase();
            if (!s) return { ok: false, leer: true };
            const gruppen = s.split(':');
            if (gruppen.length !== 8 || gruppen.some((x) => x.length !== 4)) return { ok: false, grund: 'acht Gruppen mit je vier Ziffern' };
            return { ok: ipv6Voll(s) === voll };
          },
        },
      ],
      loesung: [
        `:: steht für ${8 - kurz.split('::').flatMap((t) => (t ? t.split(':') : [])).length} Nullgruppen.`,
        'Jede Gruppe vorne mit Nullen auf vier Ziffern auffüllen.',
        `**${voll}**`,
      ],
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
      loesung: [
        'IPv6: 128 Bit, 8 Gruppen à 16 Bit (4 Hex-Ziffern).',
        `Ausgeschrieben: ${voll}`,
        `/64: die ersten 4 Gruppen sind das Präfix (${g.slice(0, 4).join(':')}), die letzten 4 der Interface-Identifier: **${iid}**`,
        g[0] === 'fe80' ? 'Beginnt mit fe80 → verbindungslokale Adresse (Link-Local).' : 'Beginnt nicht mit fe80 → keine verbindungslokale Adresse.',
      ],
    };
  }
  return {
    titel: 'IPv6 kürzen',
    sp: SP.ipv6,
    text: `Kürze die Adresse **${voll}** so weit wie möglich.`,
    felder: [
      {
        id: 'x',
        label: 'Gekürzt',
        typ: 'eigen',
        breit: true,
        soll: kurz,
        platzhalter: 'z. B. 2001:db8::1',
        pruefe: (e) => (String(e ?? '').trim() ? istRichtigGekuerzt(e, voll) : { ok: false, leer: true }),
      },
    ],
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

export const ERZEUGER = { maske: maskeAufgabe, hosts: hostsAufgabe, analyse, gleich, aufteilen, privat, konfig, dhcp: dhcpAufgabe, mac: macAufgabe, ipv6 };
