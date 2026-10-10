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

// Alles, was die Ansicht braucht, aus Adresse und Präfix
// Für den Visualizer: entscheidendes Oktett, Blockgröße, Block der Adresse
export function zerlege(ip, praefix) {
  const zahl = ipZuZahl(ip);
  const m = maskeZahl(praefix);
  const n = netz(ip, praefix);
  const oktette = ip.split('.').map(Number);
  // entscheidendes Oktett: dort liegt das erste Hostbit (bei /24 also das 4. Oktett, bei /20 das 3.)
  const index = Math.min(3, Math.floor(praefix / 8));
  const netzBitsImOktett = praefix - index * 8; // 0 … 8
  const block = 2 ** (8 - netzBitsImOktett); // Blockgröße in diesem Oktett
  const maskenwert = 256 - block;
  const wert = oktette[index];
  const blockNr = Math.floor(wert / block);
  const start = blockNr * block;
  return { zahl, m, n, oktette, index, netzBitsImOktett, block, maskenwert, wert, blockNr, start, ende: start + block - 1 };
}

// Alle Teilnetze im entscheidenden Oktett (für die Liste im Visualizer): je Block Netz, Hostbereich, Broadcast
export function subnetzeImOktett(ip, praefix) {
  const z = zerlege(ip, praefix);
  const liste = [];
  for (let s = 0; s < 256; s += z.block) {
    const okt = z.oktette.map((o, i) => (i < z.index ? o : i === z.index ? s : 0));
    const n = netz(okt.join('.'), praefix);
    liste.push({ nr: s / z.block, start: s, netz: n.netz, erster: n.erster, letzter: n.letzter, broadcast: n.broadcast, aktiv: s === z.start });
  }
  return liste;
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

// ---------- Helfer für den Lernweg (aus dem früheren lernweg.js übernommen) ----------

export const STELLENWERTE = [128, 64, 32, 16, 8, 4, 2, 1];

// Netzbits je Oktett (0 … 8), z. B. /26 → [8, 8, 8, 2], /23 → [8, 8, 7, 0]
export function netzBitsJeOktett(praefix) {
  return [0, 1, 2, 3].map((i) => Math.max(0, Math.min(8, praefix - i * 8)));
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

// Warum eine Eingabe keine gültige IPv4-Adresse ist – in Worten (null, wenn sie gültig ist)
export function ipFehler(text) {
  const s = String(text ?? '').replace(/\s+/g, '');
  if (!s) return 'Noch leer.';
  const teile = s.split('.');
  if (teile.length !== 4) return `${teile.length} ${teile.length === 1 ? 'Teil' : 'Teile'} statt 4 – eine IPv4-Adresse hat genau vier Oktette.`;
  const leer = teile.findIndex((t) => t === '');
  if (leer !== -1) return `Das ${leer + 1}. Oktett fehlt.`;
  const keineZahl = teile.findIndex((t) => !/^\d+$/.test(t));
  if (keineZahl !== -1) return `Im ${keineZahl + 1}. Oktett steht „${teile[keineZahl]}“ – erlaubt sind nur Ziffern.`;
  const zuGross = teile.findIndex((t) => Number(t) > 255);
  if (zuGross !== -1) return `Das ${zuGross + 1}. Oktett ist ${Number(teile[zuGross])} – mehr als 255 passt nicht in 8 Bit.`;
  return null;
}

// Rolle einer Adresse in ihrem Netz: 'netz' | 'broadcast' | 'host' (nur /0 … /30)
export function adressArt(ip, praefix) {
  const n = netz(ip, praefix);
  if (praefix <= 30 && ip === n.netz) return 'netz';
  if (praefix <= 30 && ip === n.broadcast) return 'broadcast';
  return 'host';
}

// MAC-Adresse lesen: sechs Bytes aus je zwei Hex-Ziffern, getrennt durch : oder - (einheitlich).
// Liefert die Bytes in Großbuchstaben oder null.
export function leseMac(text) {
  const s = String(text ?? '').trim();
  const m = s.match(/^([0-9a-f]{2})([:-])([0-9a-f]{2})\2([0-9a-f]{2})\2([0-9a-f]{2})\2([0-9a-f]{2})\2([0-9a-f]{2})$/i);
  if (!m) return null;
  return [m[1], m[3], m[4], m[5], m[6], m[7]].map((b) => b.toUpperCase());
}

// Art einer IPv6-Adresse für den Lernweg: 'link-local' (fe80::/10), 'loopback' (::1), 'global' (2000::/3), 'andere'; null bei ungültig
export function ipv6Art(adresse) {
  const voll = ipv6Voll(adresse);
  if (!voll) return null;
  if (voll === '0000:0000:0000:0000:0000:0000:0000:0001') return 'loopback';
  const erster = parseInt(voll.slice(0, 4), 16);
  if ((erster & 0xffc0) === 0xfe80) return 'link-local';
  if ((erster & 0xe000) === 0x2000) return 'global';
  return 'andere';
}
