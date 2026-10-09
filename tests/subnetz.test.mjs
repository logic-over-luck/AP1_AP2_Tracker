// Subnetz-Rechnung inkl. /31, /32 und IPv6-Kürzen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as ip from '../src/bereiche/trainer/subnetz/ip.js';
import * as aufgaben from '../src/bereiche/trainer/subnetz/aufgaben.js';
import { pruefeErzeuger } from './hilfen/erzeuger.mjs';
import { zufall } from '../src/bereiche/trainer/rahmen/zufall.js';

test('Netzberechnung Standardfälle', () => {
  const n = ip.netz('192.168.1.130', 26);
  assert.equal(n.netz, '192.168.1.128');
  assert.equal(n.broadcast, '192.168.1.191');
  assert.equal(n.erster, '192.168.1.129');
  assert.equal(n.letzter, '192.168.1.190');
  assert.equal(n.vorletzter, '192.168.1.189');
  assert.equal(n.hosts, 62);
  assert.equal(n.maske, '255.255.255.192');
  const g = ip.netz('172.20.77.5', 20);
  assert.equal(g.netz, '172.20.64.0');
  assert.equal(g.broadcast, '172.20.79.255');
  assert.equal(g.hosts, 4094);
  const k = ip.netz('10.1.2.3', 8);
  assert.equal(k.netz, '10.0.0.0');
  assert.equal(k.broadcast, '10.255.255.255');
  assert.equal(ip.netz('255.255.255.254', 30).netz, '255.255.255.252');
  assert.equal(ip.netz('255.255.255.254', 30).broadcast, '255.255.255.255');
});

test('Sonderfälle /30, /31, /32', () => {
  const a = ip.netz('10.0.0.6', 30);
  assert.deepEqual([a.netz, a.broadcast, a.erster, a.letzter, a.hosts], ['10.0.0.4', '10.0.0.7', '10.0.0.5', '10.0.0.6', 2]);
  assert.equal(a.vorletzter, null);
  const b = ip.netz('10.0.0.5', 31);
  assert.deepEqual([b.netz, b.broadcast, b.erster, b.letzter, b.hosts, b.hostsKlassisch, b.adressen], ['10.0.0.4', null, '10.0.0.4', '10.0.0.5', 2, 0, 2]);
  const c = ip.netz('10.0.0.5', 32);
  assert.deepEqual([c.netz, c.broadcast, c.erster, c.hosts, c.hostsKlassisch, c.adressen, c.maske], ['10.0.0.5', null, '10.0.0.5', 1, 0, 1, '255.255.255.255']);
});

test('Masken und Präfixe', () => {
  for (let p = 0; p <= 32; p++) assert.equal(ip.praefixAusMaske(ip.maske(p)), p);
  assert.equal(ip.maske(26), '255.255.255.192');
  assert.equal(ip.maske(0), '0.0.0.0');
  assert.equal(ip.praefixAusMaske('255.255.0.255'), null);
});

test('Gleiches Netz und private Bereiche', () => {
  assert.ok(ip.gleichesNetz('192.168.1.10', '192.168.1.62', 26));
  assert.ok(!ip.gleichesNetz('192.168.1.10', '192.168.1.64', 26));
  assert.equal(ip.istPrivat('172.31.255.1'), '172.16.0.0/12');
  assert.equal(ip.istPrivat('172.32.0.1'), null);
  assert.equal(ip.istPrivat('192.169.0.1'), null);
});

test('Aufteilen nach Hostbedarf', () => {
  const e = ip.aufteilen('192.168.10.0', 24, [{ hosts: 50 }, { hosts: 100 }, { hosts: 20 }]);
  assert.deepEqual(
    e.map((x) => [x.hosts, x.praefix, x.netz]),
    [
      [100, 25, '192.168.10.0'],
      [50, 26, '192.168.10.128'],
      [20, 27, '192.168.10.192'],
    ],
  );
  assert.equal(ip.aufteilen('192.168.10.0', 24, [{ hosts: 200 }, { hosts: 100 }]), null);
  assert.equal(ip.praefixFuerHosts(62), 26);
  assert.equal(ip.praefixFuerHosts(63), 25);
  assert.equal(ip.praefixFuerHosts(2), 30);
});

test('IPv6 kürzen, ausschreiben, prüfen', () => {
  assert.equal(ip.ipv6Kurz('2001:0db8:0000:0000:0000:ff00:0042:8329'), '2001:db8::ff00:42:8329');
  assert.equal(ip.ipv6Kurz('0000:0000:0000:0000:0000:0000:0000:0001'), '::1');
  assert.equal(ip.ipv6Kurz('0000:0000:0000:0000:0000:0000:0000:0000'), '::');
  assert.equal(ip.ipv6Kurz('2001:db8:0:1:0:0:0:1'), '2001:db8:0:1::1');
  assert.equal(ip.ipv6Kurz('2001:db8:0:0:1:0:0:1'), '2001:db8::1:0:0:1');
  assert.equal(ip.ipv6Voll('fe80::1'), 'fe80:0000:0000:0000:0000:0000:0000:0001');
  assert.equal(ip.ipv6Voll('1::2::3'), null);
  assert.equal(ip.ipv6Voll('12345::'), null);
  const v = '2001:0db8:0000:0000:0001:0000:0000:0001';
  assert.ok(ip.istRichtigGekuerzt('2001:db8::1:0:0:1', v).ok);
  assert.ok(ip.istRichtigGekuerzt('2001:DB8:0:0:1::1', v).ok, 'gleich lange Folge, andere Wahl');
  assert.ok(!ip.istRichtigGekuerzt('2001:db8:0:0:1:0:0:1', v).ok);
  assert.ok(!ip.istRichtigGekuerzt('2001:0db8::1:0:0:1', v).ok);
  const w = '2001:0db8:0000:0001:0000:0000:0000:0001';
  assert.ok(!ip.istRichtigGekuerzt('2001:db8::1:0:0:0:1', w).ok, 'nicht die längste Folge');
  assert.ok(ip.istRichtigGekuerzt('2001:db8:0:1::1', w).ok);
  // einzelne Nullgruppe: 0 oder :: beides akzeptiert
  const x = '2001:0db8:0000:0001:0002:0003:0004:0005';
  assert.ok(ip.istRichtigGekuerzt('2001:db8:0:1:2:3:4:5', x).ok);
  assert.ok(ip.istRichtigGekuerzt('2001:db8::1:2:3:4:5', x).ok);
});

test('Subnetz: alle Erzeuger', () => {
  for (const [name, f] of Object.entries(aufgaben.ERZEUGER)) pruefeErzeuger(name, f);
});

test('Subnetz: Erzeuger rechnen wie die Bibliothek', () => {
  for (let s = 1; s < 300; s++) {
    const a = aufgaben.analyse(zufall(s));
    const m = a.text.match(/\*\*([\d.]+)\/(\d+)\*\*/);
    const n = ip.netz(m[1], Number(m[2]));
    assert.equal(a.felder[0].erwartet, n.netz);
  }
});

test('Visualizer: entscheidendes Oktett, Blockgröße und Block', async () => {
  const { zerlege } = await import('../src/bereiche/trainer/subnetz/ip.js');
  let z = zerlege('192.168.40.150', 26);
  assert.deepEqual([z.index, z.netzBitsImOktett, z.maskenwert, z.block, z.start, z.ende], [3, 2, 192, 64, 128, 191]);
  assert.equal(z.n.netz, '192.168.40.128');
  assert.equal(z.n.broadcast, '192.168.40.191');
  z = zerlege('10.20.77.5', 20);
  assert.deepEqual([z.index, z.netzBitsImOktett, z.maskenwert, z.block, z.start, z.ende], [2, 4, 240, 16, 64, 79]);
  assert.equal(z.n.broadcast, '10.20.79.255');
  z = zerlege('172.16.5.9', 24);
  assert.deepEqual([z.index, z.netzBitsImOktett, z.maskenwert, z.block, z.start, z.ende], [3, 0, 0, 256, 0, 255]);
  z = zerlege('192.168.1.6', 30);
  assert.deepEqual([z.block, z.start, z.ende], [4, 4, 7]);
});

test('Visualizer: alle Teilnetze im Oktett', async () => {
  const { subnetzeImOktett } = await import('../src/bereiche/trainer/subnetz/ip.js');
  const l = subnetzeImOktett('192.168.40.150', 26);
  assert.equal(l.length, 4);
  assert.deepEqual(l[2], { nr: 2, start: 128, netz: '192.168.40.128', erster: '192.168.40.129', letzter: '192.168.40.190', broadcast: '192.168.40.191', aktiv: true });
  assert.equal(subnetzeImOktett('10.20.77.5', 20)[4].broadcast, '10.20.79.255');
  assert.equal(subnetzeImOktett('192.168.1.6', 30).length, 64);
});

// ---------- Lernblock „Verstehen“ (lernweg.js) ----------

const lernweg = () => import('../src/bereiche/trainer/subnetz/lernweg.js');

test('Verstehen: Netzbits je Oktett, Rollen und Maskenwerte', async () => {
  const lw = await lernweg();
  assert.deepEqual(lw.netzBitsJeOktett(26), [8, 8, 8, 2]);
  assert.deepEqual(lw.netzBitsJeOktett(23), [8, 8, 7, 0]);
  assert.deepEqual(lw.netzBitsJeOktett(8), [8, 0, 0, 0]);
  assert.deepEqual(lw.oktettRollen(26), ['netz', 'netz', 'netz', 'strich']);
  assert.deepEqual(lw.oktettRollen(24), ['netz', 'netz', 'netz', 'host'], 'bei /24 liegt der Strich zwischen zwei Oktetten');
  assert.deepEqual(lw.oktettRollen(23), ['netz', 'netz', 'strich', 'host']);
  assert.deepEqual(lw.oktettRollen(20), ['netz', 'netz', 'strich', 'host']);
  assert.deepEqual(lw.oktettRollen(16), ['netz', 'netz', 'host', 'host']);
  assert.deepEqual(lw.oktettRollen(30), ['netz', 'netz', 'netz', 'strich']);
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7, 8].map(lw.maskenwert), [0, 128, 192, 224, 240, 248, 252, 254, 255]);
  for (let p = 8; p <= 30; p++) {
    const bits = lw.netzBitsJeOktett(p);
    assert.equal(
      bits.reduce((a, b) => a + b, 0),
      p,
    );
    assert.equal(bits.map(lw.maskenwert).join('.'), ip.maske(p), `/${p}`);
  }
});

test('Verstehen: Dezimal → binär Schritt für Schritt', async () => {
  const lw = await lernweg();
  const s = lw.binaerSchritte(150);
  assert.equal(s.map((x) => x.bit).join(''), '10010110');
  assert.deepEqual(s[0], { gewicht: 128, vorher: 150, passt: true, nachher: 22, bit: 1 });
  assert.deepEqual(s[1], { gewicht: 64, vorher: 22, passt: false, nachher: 22, bit: 0 });
  assert.equal(s[7].nachher, 0);
  for (let w = 0; w <= 255; w++)
    assert.equal(
      parseInt(
        lw
          .binaerSchritte(w)
          .map((x) => x.bit)
          .join(''),
        2,
      ),
      w,
    );
});

test('Verstehen: Blockanfang und Blockende raten', async () => {
  const lw = await lernweg();
  const z = ip.zerlege('192.168.40.150', 26);
  assert.deepEqual(lw.startOptionen(z), [64, 128, 150, 192]);
  assert.equal(lw.bewerteStart(z, 128), 'richtig');
  assert.equal(lw.bewerteStart(z, 150), 'kein-anfang');
  assert.equal(lw.bewerteStart(z, 192), 'zu-weit');
  assert.equal(lw.bewerteStart(z, 64), 'zu-frueh');
  assert.deepEqual(lw.endeOptionen(z), [160, 190, 191, 192]);
  assert.equal(lw.bewerteEnde(z, 191), 'richtig');
  assert.equal(lw.bewerteEnde(z, 192), 'naechster-anfang', '128 + 64 = 192 ist schon der nächste Block');
  assert.equal(lw.bewerteEnde(z, 190), 'zu-kurz');

  // Für jeden Präfix mit Strich im Oktett und viele Werte: Optionen gültig, richtige Antwort dabei, Bewertung stimmig
  for (let p = 8; p <= 30; p++) {
    if (p % 8 === 0) continue;
    for (const wert of [0, 1, 2, 3, 63, 64, 77, 127, 128, 150, 191, 192, 254, 255]) {
      const zz = ip.zerlege(`10.${wert}.${wert}.${wert}`, p);
      const so = lw.startOptionen(zz);
      assert.ok(so.includes(zz.start), `/${p} ${wert}`);
      assert.ok(so.length >= 2 && so.length <= 4, `/${p} ${wert}: ${so}`);
      assert.deepEqual(
        so,
        [...so].sort((a, b) => a - b),
      );
      assert.ok(so.every((x) => x >= 0 && x <= 255));
      assert.equal(so.filter((x) => lw.bewerteStart(zz, x) === 'richtig').length, 1);
      const eo = lw.endeOptionen(zz);
      assert.ok(eo.includes(zz.ende) && eo.length >= 1 && eo.length <= 4);
      assert.ok(eo.every((x) => x >= zz.start && x <= 255));
      assert.equal(eo.filter((x) => lw.bewerteEnde(zz, x) === 'richtig').length, 1);
      if (zz.ende < 255) assert.ok(eo.includes(zz.ende + 1), 'der typische Fehler ist dabei');
    }
  }
});

test('Verstehen: Adressart und Hostbits', async () => {
  const lw = await lernweg();
  assert.equal(lw.adressArt('192.168.40.150', 26), 'host');
  assert.equal(lw.adressArt('192.168.40.128', 26), 'netz');
  assert.equal(lw.adressArt('192.168.40.191', 26), 'broadcast');
  assert.equal(lw.adressArt('192.168.40.255', 23), 'host');
  assert.equal(lw.hostBits('192.168.40.150', 26), '010110');
  assert.equal(lw.hostBits('192.168.40.255', 23), '0 11111111');
  assert.equal(lw.hostBits('192.168.41.0', 23), '1 00000000');
  assert.equal(lw.hostBits('172.20.64.255', 20), '0000 11111111');
  assert.equal(lw.hostBits('10.0.0.1', 8), '00000000 00000000 00000001');
});

test('Verstehen: Präfixe unter /24 – x.255 und (x+1).0 liegen mitten im Netz', async () => {
  const lw = await lernweg();
  const g = lw.grossesNetz('192.168.40.150', 26);
  assert.equal(g.praefix, 23, 'bei /24 und mehr: Beispiel mit /23');
  assert.equal(g.eigenes, false);
  assert.deepEqual([g.netz, g.broadcast, g.endeErstes, g.anfangZweites, g.stuecke, g.hosts], ['192.168.40.0', '192.168.41.255', '192.168.40.255', '192.168.41.0', 2, 510]);
  assert.deepEqual(
    g.zeilen.map((z) => `${z.von}-${z.bis}`),
    ['192.168.40.0-192.168.40.255', '192.168.41.0-192.168.41.255'],
  );
  const h = lw.grossesNetz('172.20.77.5', 20);
  assert.equal(h.eigenes, true);
  assert.equal(h.stuecke, 16);
  assert.equal(h.zeilen.length, 4);
  assert.equal(h.zeilen[2], null);
  assert.equal(h.zeilen[3].bis, '172.20.79.255');
  for (let p = 8; p <= 30; p++) {
    const f = lw.grossesNetz('10.9.8.7', p);
    const n = ip.netz('10.9.8.7', f.praefix);
    assert.ok(f.praefix < 24);
    assert.equal(lw.adressArt(f.endeErstes, f.praefix), 'host');
    assert.equal(lw.adressArt(f.anfangZweites, f.praefix), 'host');
    assert.ok(ipZwischen(f.endeErstes, n.erster, n.letzter) && ipZwischen(f.anfangZweites, n.erster, n.letzter));
    assert.equal(f.zeilen[0].von, n.netz);
    assert.equal(f.zeilen.at(-1).bis, n.broadcast);
  }
});

function ipZwischen(a, von, bis) {
  const z = ip.ipZuZahl(a);
  return z >= ip.ipZuZahl(von) && z <= ip.ipZuZahl(bis);
}

test('Verstehen: Ziele für „Gleiches Netz?“', async () => {
  const lw = await lernweg();
  const z = lw.vergleichsZiele('192.168.40.150', 26);
  assert.deepEqual(
    z.map((x) => [x.id, x.ip, x.gleich, x.netz]),
    [
      ['drucker', '192.168.40.190', true, '192.168.40.128'],
      ['server', '192.168.40.214', false, '192.168.40.192'],
      ['internet', '8.8.8.8', false, '8.8.8.0'],
    ],
  );
  for (let p = 8; p <= 30; p++)
    for (const adresse of ['192.168.40.150', '10.0.0.1', '172.16.255.254', '8.8.8.9', '192.168.1.6', '255.255.255.254']) {
      const [drucker, server, internet] = lw.vergleichsZiele(adresse, p);
      assert.ok(drucker.gleich && drucker.ip !== adresse, `/${p} ${adresse}`);
      assert.ok(!server.gleich, `/${p} ${adresse}`);
      assert.ok(!internet.gleich, `/${p} ${adresse}`);
    }
});

test('Verstehen: Aufteilen – Netze × Adressen bleibt gleich', async () => {
  const lw = await lernweg();
  for (const p of [8, 16, 20, 23, 24, 26, 30]) {
    const { gesamt, zeilen } = lw.aufteilTabelle(p);
    assert.ok(zeilen.some((r) => r.praefix === p));
    for (const r of zeilen) {
      assert.equal(r.netze * r.adressen, gesamt);
      assert.equal(r.hostsGesamt + r.reserviert, gesamt);
    }
  }
  const t26 = lw.aufteilTabelle(26);
  assert.equal(t26.gesamt, 256);
  assert.equal(t26.basis, 24);
  assert.deepEqual(
    t26.zeilen.map((r) => r.praefix),
    [24, 25, 26, 27, 28, 29, 30],
  );
  assert.equal(t26.zeilen.find((r) => r.praefix === 26).hostsGesamt, 248);
});

test('Verstehen: schneller Rechenweg für jeden Präfix von /8 bis /30', async () => {
  const lw = await lernweg();
  const r = lw.rechenweg('192.168.40.150', 26);
  assert.deepEqual(r.teile, [8, 8, 8, 2]);
  assert.deepEqual([r.nr, r.netzBits, r.block, r.maskenwert, r.blockNr, r.rest, r.start, r.ende, r.hostBits, r.hosts], [4, 2, 64, 192, 2, 22, 128, 191, 6, 62]);
  assert.deepEqual([r.netz, r.erster, r.letzter, r.broadcast, r.maske], ['192.168.40.128', '192.168.40.129', '192.168.40.190', '192.168.40.191', '255.255.255.192']);
  const v = lw.rechenweg('192.168.40.150', 24);
  assert.equal(v.ohneRechnung, true);
  assert.deepEqual(v.teile, [8, 8, 8]);
  assert.deepEqual([v.netz, v.broadcast, v.hosts], ['192.168.40.0', '192.168.40.255', 254]);
  const d = lw.rechenweg('192.168.41.150', 23);
  assert.deepEqual([d.teile, d.nr, d.block, d.start, d.ende, d.netz, d.broadcast, d.hosts], [[8, 8, 7], 3, 2, 40, 41, '192.168.40.0', '192.168.41.255', 510]);
  for (let p = 8; p <= 30; p++)
    for (const adresse of ['192.168.40.150', '10.20.30.40', '172.31.255.254', '1.0.0.0']) {
      const w = lw.rechenweg(adresse, p);
      const n = ip.netz(adresse, p);
      assert.equal(
        w.teile.reduce((a, b) => a + b, 0),
        p,
      );
      assert.equal(w.block, 256 - w.maskenwert);
      assert.equal(w.block, 2 ** (8 - w.netzBits), 'Blockgröße = Stellenwert des letzten Netzbits');
      assert.equal(w.start, w.blockNr * w.block);
      assert.equal(w.start + w.rest, w.wert);
      assert.equal(w.ende, w.start + w.block - 1);
      assert.equal(w.netz.split('.')[w.nr - 1], String(w.start));
      assert.equal(w.broadcast.split('.')[w.nr - 1], String(w.ende));
      assert.deepEqual([w.netz, w.broadcast, w.erster, w.letzter, w.hosts], [n.netz, n.broadcast, n.erster, n.letzter, 2 ** (32 - p) - 2]);
    }
});

test('Verstehen: Übungsaufgaben und Eingaben lesen', async () => {
  const lw = await lernweg();
  for (let s = 1; s < 300; s++) {
    const a = lw.zufallsAufgabe(zufall(s));
    assert.ok(a.praefix >= 20 && a.praefix <= 30);
    assert.equal(lw.adressArt(a.ip, a.praefix), 'host');
    assert.equal(lw.leseIp(a.ip), a.ip);
  }
  assert.equal(lw.leseIp(' 192.168.040.1 '), '192.168.40.1');
  assert.equal(lw.leseIp('192.168.1'), null);
  assert.equal(lw.leseIp('192.168.1.256'), null);
  assert.equal(lw.leseIp('a.b.c.d'), null);
  assert.equal(lw.leseZahl('4.094'), 4094);
  assert.equal(lw.leseZahl(' 62 '), 62);
  assert.equal(lw.leseZahl('62 Hosts'), null);
  assert.equal(lw.leseZahl(''), null);
  const t = lw.teileAdresse('192.168.40.150', 26);
  assert.deepEqual(t, { netz: '192.168.40.128', hostNummer: 22 });
  assert.deepEqual(lw.teileAdresse('192.168.41.150', 23), { netz: '192.168.40.0', hostNummer: 406 });
});
