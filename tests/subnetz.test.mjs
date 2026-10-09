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
  assert.deepEqual(e.map((x) => [x.hosts, x.praefix, x.netz]), [[100, 25, '192.168.10.0'], [50, 26, '192.168.10.128'], [20, 27, '192.168.10.192']]);
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

test('Lernweg: Rollen der Oktette, Blockende-Optionen, Aufteilen, Fallen', async () => {
  const lw = await import('../src/bereiche/trainer/subnetz/lernweg.js');
  assert.deepEqual(lw.oktettRollen(26), ['fest', 'fest', 'fest', 'grenze']);
  assert.deepEqual(lw.oktettRollen(24), ['fest', 'fest', 'fest', 'grenze']);
  assert.deepEqual(lw.oktettRollen(23), ['fest', 'fest', 'grenze', 'frei']);
  assert.deepEqual(lw.oktettRollen(8), ['fest', 'grenze', 'frei', 'frei']);

  // Blockende: richtige Antwort und der typische Fehler (Anfang des nächsten Blocks) sind dabei
  const z = ip.zerlege('192.168.40.150', 26);
  const opt = lw.endeOptionen(z);
  assert.ok(opt.includes(191) && opt.includes(192));
  assert.deepEqual(opt, [...opt].sort((a, b) => a - b));
  for (let p = 8; p <= 30; p++)
    for (const wert of [0, 1, 77, 128, 150, 254, 255]) {
      const zz = ip.zerlege(`10.${wert}.${wert}.${wert}`, p);
      const o = lw.endeOptionen(zz);
      assert.ok(o.includes(zz.ende), `/${p} ${wert}`);
      assert.ok(o.length >= 1 && o.length <= 4);
      assert.ok(o.every((x) => x >= zz.start && x <= 255));
    }

  // Aufteilen: Netze × Adressen ist in jeder Zeile gleich
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
  assert.deepEqual(
    t26.zeilen.map((r) => r.praefix),
    [24, 25, 26, 27, 28, 29, 30],
  );
  assert.equal(t26.zeilen.find((r) => r.praefix === 26).hostsGesamt, 248);

  // Nachbar: bei mehreren Blöcken ein anderes Netz, bei einem Block dasselbe
  assert.equal(lw.nachbarVorschlag('192.168.40.150', 26), '192.168.40.86');
  assert.ok(!ip.gleichesNetz('192.168.40.150', lw.nachbarVorschlag('192.168.40.150', 26), 26));
  assert.ok(!ip.gleichesNetz('192.168.40.10', lw.nachbarVorschlag('192.168.40.10', 26), 26));
  assert.ok(!ip.gleichesNetz('192.168.41.150', lw.nachbarVorschlag('192.168.41.150', 23), 23));
  assert.ok(ip.gleichesNetz('192.168.40.150', lw.nachbarVorschlag('192.168.40.150', 24), 24));

  // Fallen unter /24: x.255 und (x+1).0 liegen mitten im Netz
  assert.equal(lw.fallen('192.168.40.150', 26), null);
  assert.deepEqual(lw.fallen('192.168.41.150', 23), { endeErstes: '192.168.40.255', anfangZweites: '192.168.41.0' });
  assert.deepEqual(lw.fallen('172.20.77.5', 20), { endeErstes: '172.20.64.255', anfangZweites: '172.20.65.0' });
  for (const [adresse, p] of [['192.168.41.150', 23], ['172.20.77.5', 20], ['10.9.8.7', 12]]) {
    const f = lw.fallen(adresse, p);
    const n = ip.netz(adresse, p);
    assert.ok(ipZwischen(f.endeErstes, n.erster, n.letzter) && ipZwischen(f.anfangZweites, n.erster, n.letzter));
  }
});

function ipZwischen(a, von, bis) {
  const z = ip.ipZuZahl(a);
  return z >= ip.ipZuZahl(von) && z <= ip.ipZuZahl(bis);
}

test('Lernweg: Dezimal → binär und Trennstrich in der echten Adresse', async () => {
  const lw = await import('../src/bereiche/trainer/subnetz/lernweg.js');
  const s = lw.binaerSchritte(150);
  assert.equal(s.map((x) => x.bit).join(''), '10010110');
  assert.deepEqual(s[0], { gewicht: 128, vorher: 150, passt: true, nachher: 22, bit: 1 });
  assert.equal(s[7].nachher, 0);
  for (let w = 0; w <= 255; w++) assert.equal(parseInt(lw.binaerSchritte(w).map((x) => x.bit).join(''), 2), w);

  const t = lw.teileAdresse('192.168.40.150', 26);
  assert.equal(t.netz, '192.168.40.128');
  assert.equal(t.host, '0.0.0.22');
  assert.equal(t.hostNummer, 22);
  assert.equal(t.maske, '255.255.255.192');
  assert.deepEqual(t.oktette[3], { wert: 150, netzBits: 2, maske: 192, netz: 128, host: 22 });
  assert.deepEqual(t.oktette[0], { wert: 192, netzBits: 8, maske: 255, netz: 192, host: 0 });

  const u = lw.teileAdresse('192.168.41.150', 23);
  assert.equal(u.netz, '192.168.40.0');
  assert.equal(u.host, '0.0.1.150');
  assert.equal(u.hostNummer, 406);
  assert.deepEqual(u.oktette[3], { wert: 150, netzBits: 0, maske: 0, netz: 0, host: 150 });
  for (const [a, p] of [['10.20.30.40', 8], ['172.20.77.5', 20], ['10.0.0.6', 30]]) {
    const v = lw.teileAdresse(a, p);
    assert.equal(v.netz, ip.netz(a, p).netz);
    assert.equal(v.oktette.every((o) => o.netz + o.host === o.wert), true);
  }
});
