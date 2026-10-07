// IPv4- und IPv6-Rechnung. Rein, getestet in tests/subnetz.test.mjs.
//
// Sonderfälle:
// – /31: Klassisch (2^n − 2) gibt es keine nutzbaren Hosts. Nach RFC 3021 werden /31-Netze auf
//   Punkt-zu-Punkt-Verbindungen genutzt; dort sind beide Adressen Hosts, es gibt keine Broadcastadresse.
// – /32: genau eine Adresse, ein einzelner Host (Host-Route).

export function ipZuZahl(ip) {
  const t = ip.split('.').map(Number);
  return ((t[0] << 24) >>> 0) + (t[1] << 16) + (t[2] << 8) + t[3];
}

export function zahlZuIp(n) {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

export function maskeZahl(praefix) {
  return praefix === 0 ? 0 : (0xffffffff << (32 - praefix)) >>> 0;
}

export function maske(praefix) {
  return zahlZuIp(maskeZahl(praefix));
}

export function praefixAusMaske(m) {
  const n = ipZuZahl(m);
  const bin = n.toString(2).padStart(32, '0');
  if (!/^1*0*$/.test(bin)) return null; // keine gültige Maske
  return bin.indexOf('0') === -1 ? 32 : bin.indexOf('0');
}

export function binaer(ip) {
  return ip
    .split('.')
    .map((t) => Number(t).toString(2).padStart(8, '0'))
    .join('.');
}

export function netz(ip, praefix) {
  const a = ipZuZahl(ip);
  const m = maskeZahl(praefix);
  const netzZahl = (a & m) >>> 0;
  const bc = (netzZahl | (~m >>> 0)) >>> 0;
  const adressen = 2 ** (32 - praefix);
  let erster, letzter, hosts;
  if (praefix <= 30) {
    erster = netzZahl + 1;
    letzter = bc - 1;
    hosts = adressen - 2;
  } else if (praefix === 31) {
    erster = netzZahl;
    letzter = bc;
    hosts = 2;
  } else {
    erster = letzter = netzZahl;
    hosts = 1;
  }
  return {
    netz: zahlZuIp(netzZahl),
    broadcast: praefix <= 30 ? zahlZuIp(bc) : null,
    erster: zahlZuIp(erster),
    letzter: zahlZuIp(letzter),
    vorletzter: praefix <= 29 ? zahlZuIp(letzter - 1) : null,
    adressen,
    hosts,
    hostsKlassisch: Math.max(0, adressen - 2),
    maske: maske(praefix),
  };
}

export function gleichesNetz(a, b, praefix) {
  const m = maskeZahl(praefix);
  return ((ipZuZahl(a) & m) >>> 0) === ((ipZuZahl(b) & m) >>> 0);
}

export function istPrivat(ip) {
  const [a, b] = ip.split('.').map(Number);
  if (a === 10) return '10.0.0.0/8';
  if (a === 172 && b >= 16 && b <= 31) return '172.16.0.0/12';
  if (a === 192 && b === 168) return '192.168.0.0/16';
  return null;
}

// Kleinstes Präfix (größtes Netz), das mindestens n Hosts fasst (klassisch, 2^h − 2 ≥ n)
export function praefixFuerHosts(n) {
  for (let p = 30; p >= 1; p--) if (2 ** (32 - p) - 2 >= n) return p;
  return null;
}

// Netz nach Hostbedarf aufteilen (VLSM): größter Bedarf zuerst, lückenlos hintereinander.
export function aufteilen(netzAdresse, praefix, bedarfe) {
  const sortiert = bedarfe.map((b, i) => ({ ...b, i })).sort((x, y) => y.hosts - x.hosts);
  let zeiger = ipZuZahl(netzAdresse);
  const ende = zeiger + 2 ** (32 - praefix);
  const ergebnis = [];
  for (const b of sortiert) {
    const p = praefixFuerHosts(b.hosts);
    if (p === null || p < praefix) return null;
    const groesse = 2 ** (32 - p);
    if (zeiger + groesse > ende) return null;
    ergebnis.push({ ...b, praefix: p, netz: zahlZuIp(zeiger), broadcast: zahlZuIp(zeiger + groesse - 1), groesse });
    zeiger += groesse;
  }
  return ergebnis;
}

// ---------- IPv6 ----------

// Gruppen einer (Teil-)Adresse auf volle Länge bringen: anzahl Gruppen à 4 Hex-Ziffern.
export function gruppenVoll(text, anzahl = 8) {
  let s = String(text ?? '')
    .trim()
    .toLowerCase();
  const praefix = s.match(/\/(\d{1,3})$/);
  if (praefix) s = s.slice(0, praefix.index);
  if (!/^[0-9a-f:]+$/.test(s)) return null;
  const teile = s.split('::');
  if (teile.length > 2) return null;
  const links = teile[0] ? teile[0].split(':') : [];
  const rechts = teile.length === 2 && teile[1] ? teile[1].split(':') : [];
  if ([...links, ...rechts].some((g) => !/^[0-9a-f]{1,4}$/.test(g))) return null;
  let gruppen;
  if (teile.length === 2) {
    const fehlen = anzahl - links.length - rechts.length;
    if (fehlen < 1) return null;
    gruppen = [...links, ...Array(fehlen).fill('0'), ...rechts];
  } else {
    gruppen = links;
  }
  if (gruppen.length !== anzahl) return null;
  return gruppen.map((g) => g.padStart(4, '0')).join(':');
}

// Ausschreiben: 8 Gruppen à 4 Hex-Ziffern, Kleinbuchstaben. null bei ungültiger Eingabe.
export function ipv6Voll(adresse) {
  return gruppenVoll(adresse, 8);
}

// Kürzen nach den beiden Regeln: führende Nullen weg, die längste Folge von Nullgruppen (mind. 2)
// einmal durch :: ersetzen (bei Gleichstand die erste).
export function ipv6Kurz(adresse, anzahl = 8) {
  const voll = gruppenVoll(adresse, anzahl);
  if (!voll) return null;
  const g = voll.split(':').map((x) => x.replace(/^0+(?=.)/, ''));
  let besteStart = -1;
  let besteLaenge = 0;
  for (let i = 0; i < anzahl; ) {
    if (g[i] !== '0') {
      i++;
      continue;
    }
    let j = i;
    while (j < anzahl && g[j] === '0') j++;
    if (j - i > besteLaenge) {
      besteStart = i;
      besteLaenge = j - i;
    }
    i = j;
  }
  if (besteLaenge < 2) return g.join(':');
  return `${g.slice(0, besteStart).join(':')}::${g.slice(besteStart + besteLaenge).join(':')}`;
}

// Prüft, ob eine Eingabe eine richtig und vollständig gekürzte Form der Adresse ist.
// Erlaubt: Groß-/Kleinschreibung beliebig; bei gleich langen Nullfolgen jede davon;
// eine einzelne Nullgruppe darf als 0 oder als :: geschrieben sein.
export function istRichtigGekuerzt(eingabe, adresse) {
  const s = String(eingabe ?? '')
    .trim()
    .toLowerCase();
  const voll = ipv6Voll(s);
  if (!voll || voll !== ipv6Voll(adresse)) return { ok: false, grund: voll ? 'andere Adresse' : 'keine gültige IPv6-Adresse' };
  const gruppen = s.split('::').flatMap((t) => (t ? t.split(':') : []));
  if (gruppen.some((x) => x.length > 1 && x.startsWith('0'))) return { ok: false, grund: 'führende Nullen nicht entfernt' };
  // längste Nullfolge der Adresse
  const g = voll.split(':');
  let laengste = 0;
  for (let i = 0; i < 8; i++) {
    let j = i;
    while (j < 8 && g[j] === '0000') j++;
    laengste = Math.max(laengste, j - i);
  }
  if (laengste >= 2) {
    if (!s.includes('::')) return { ok: false, grund: 'Nullfolge nicht durch :: ersetzt' };
    const ersetzt = 8 - gruppen.length;
    if (ersetzt < laengste) return { ok: false, grund: 'nicht die längste Nullfolge gekürzt' };
  }
  return { ok: true };
}
