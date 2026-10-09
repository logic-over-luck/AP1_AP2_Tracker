// Subnetz-Rechnung inkl. /31, /32 und IPv6-Kürzen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as ip from '../src/bereiche/trainer/subnetz/ip.js';
import * as aufgaben from '../src/bereiche/trainer/subnetz/ueben/aufgaben.js';
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

// ---------- Raum „Verstehen“: Lernweg, Checks, Rechenhilfen ----------

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BLOECKE, LEKTIONEN, lektion, naechsteLektion, status, luecken } from '../src/bereiche/trainer/subnetz/verstehen/lernweg.js';
import { CHECKS, pruefeAntwort } from '../src/bereiche/trainer/subnetz/verstehen/checks.js';
import * as rechnen from '../src/bereiche/trainer/subnetz/verstehen/rechnen.js';
import { TRAINER } from '../src/bereiche/trainer/verzeichnis.js';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inhalt = JSON.parse(fs.readFileSync(path.join(wurzel, 'Inhaltsdatei_AP1_AP2_tracker.json'), 'utf8'));
const STICHPUNKTE = ['AP1-6-2-1', 'AP1-6-2-2', 'AP1-6-2-3', 'AP1-6-2-4'];
const KOMPETENZEN = inhalt.stichpunkte.filter((s) => STICHPUNKTE.includes(s.id)).flatMap((s) => s.koennen.map((k) => k.id));

test('Lernweg: Blöcke, Lektionen und Pflichtfelder', () => {
  assert.equal(BLOECKE[0].id, 'adresse', 'der Block um IPv4-Adressen kommt zuerst');
  assert.equal(new Set(LEKTIONEN.map((l) => l.id)).size, LEKTIONEN.length, 'IDs eindeutig');
  for (const b of BLOECKE)
    assert.ok(
      LEKTIONEN.some((l) => l.block === b.id),
      `Block ${b.id} ohne Lektion`,
    );
  let letzterBlock = -1;
  for (const l of LEKTIONEN) {
    const bi = BLOECKE.findIndex((b) => b.id === l.block);
    assert.ok(bi >= 0, `${l.id}: unbekannter Block`);
    assert.ok(bi >= letzterBlock, `${l.id}: Blöcke müssen zusammenhängend in Reihenfolge stehen`);
    letzterBlock = bi;
    assert.ok(l.begriff && l.leitfrage && l.definition, `${l.id}: Begriff, Leitfrage oder Definition fehlt`);
    assert.ok(l.leitfrage.length <= 60, `${l.id}: Leitfrage zu lang für die Kachel`);
    assert.ok(l.merksatz && l.fehler?.length, `${l.id}: Merksatz oder Stolperfalle fehlt`);
    assert.equal(lektion(l.id), l);
  }
});

test('Lernweg: braucht zeigt nur auf frühere Lektionen', () => {
  for (const l of LEKTIONEN) {
    for (const b of l.braucht) {
      const vorher = lektion(b);
      assert.ok(vorher, `${l.id}: braucht unbekannte Lektion ${b}`);
      assert.ok(vorher.nr < l.nr, `${l.id} (${l.nr}) braucht ${b} (${vorher.nr}) – das kommt erst später`);
    }
  }
  // Jede Lektion außer der ersten baut auf etwas auf
  for (const l of LEKTIONEN.slice(1)) assert.ok(l.braucht.length > 0, `${l.id}: braucht ist leer`);
});

test('Lernweg: jede Kompetenz von AP1-6-2-1 bis AP1-6-2-4 ist abgedeckt', () => {
  assert.ok(KOMPETENZEN.length >= 20);
  const abgedeckt = new Set(LEKTIONEN.flatMap((l) => l.kompetenzen));
  for (const k of KOMPETENZEN) assert.ok(abgedeckt.has(k), `${k} gehört zu keiner Lektion`);
  for (const k of abgedeckt) assert.ok(KOMPETENZEN.includes(k), `${k} gibt es in der Inhaltsdatei nicht`);
});

test('Lernweg: Übungs-Verweise zeigen auf echte Übungen', () => {
  const modi = TRAINER.find((t) => t.id === 'subnetz').modi;
  for (const l of LEKTIONEN)
    if (l.uebung)
      assert.ok(
        modi.some((m) => m.id === l.uebung && m.bereich === 'ueben'),
        `${l.id}: Übung ${l.uebung} fehlt`,
      );
  for (const m of modi.filter((m) => m.bereich === 'ueben'))
    assert.ok(
      BLOECKE.some((b) => b.id === m.thema),
      `${m.id}: Thema ${m.thema} ist kein Block`,
    );
});

test('Lernweg: Status, als Nächstes und Lücken', () => {
  const v = new Set(['ip-adresse', 'netz-host']);
  assert.equal(naechsteLektion(new Set()).id, 'ip-adresse');
  assert.equal(naechsteLektion(v).id, 'binaer');
  assert.equal(status('netz-host', v), 'verstanden');
  assert.equal(status('binaer', v), 'naechste');
  assert.equal(status('praefix', v), 'offen');
  assert.deepEqual(
    luecken('praefix', v).map((l) => l.id),
    ['binaer'],
  );
  assert.equal(naechsteLektion(new Set(LEKTIONEN.map((l) => l.id))), null);
});

test('Checks: jede Lektion hat 2–3 stimmige Fragen', () => {
  for (const l of LEKTIONEN) {
    const fragen = CHECKS[l.id];
    assert.ok(fragen && fragen.length >= 2 && fragen.length <= 3, `${l.id}: ${fragen?.length ?? 0} Fragen`);
    for (const f of fragen) {
      assert.ok(f.frage && f.tipp && f.erklaerung, `${l.id}: Frage unvollständig – ${f.frage}`);
      if (f.optionen) {
        assert.ok(f.optionen.includes(f.richtig), `${l.id}: „${f.richtig}“ steht nicht in den Optionen`);
        assert.equal(new Set(f.optionen).size, f.optionen.length, `${l.id}: doppelte Option`);
        assert.ok(pruefeAntwort(f, f.richtig).ok);
        for (const o of f.optionen.filter((o) => o !== f.richtig)) assert.ok(!pruefeAntwort(f, o).ok, `${l.id}: „${o}“ gilt fälschlich als richtig`);
      } else {
        assert.ok(pruefeAntwort(f, f.loesung).ok, `${l.id}: Lösung „${f.loesung}“ wird abgelehnt`);
        assert.ok(!pruefeAntwort(f, '').ok && pruefeAntwort(f, '').leer);
        assert.ok(!pruefeAntwort(f, '1').ok || f.loesung === '1', `${l.id}: „1“ gilt als richtig`);
      }
      if (f.beleg) {
        const n = ip.netz(f.beleg.ip, f.beleg.praefix);
        assert.equal(String(n[f.beleg.feld]), f.loesung, `${l.id}: ${f.frage}`);
      }
    }
  }
});

test('Checks: Eingaben in mehreren Schreibweisen', () => {
  const zahl = { eingabe: 'zahl', loesung: '4094' };
  assert.ok(pruefeAntwort(zahl, '4.094').ok && pruefeAntwort(zahl, ' 4094 ').ok);
  const adr = { eingabe: 'ipv4', loesung: '10.4.6.0' };
  assert.ok(pruefeAntwort(adr, '10.4.6.0').ok && pruefeAntwort(adr, ' 10.4.006.0').ok);
  assert.ok(!pruefeAntwort(adr, '10.4.6.256').ok);
  const kurz = CHECKS['ipv6-kurz'][0];
  assert.ok(pruefeAntwort(kurz, '2001:DB8::1').ok);
  assert.ok(!pruefeAntwort(kurz, '2001:0db8::1').ok, 'führende Nullen nicht gekürzt');
  const voll = CHECKS['ipv6-kurz'][1];
  assert.ok(!pruefeAntwort(voll, 'fe80::1').ok, 'gekürzt statt ausgeschrieben');
  const iid = CHECKS['ipv6-praefix'][1];
  for (const e of ['::5', '0:0:0:5', '0000:0000:0000:0005']) assert.ok(pruefeAntwort(iid, e).ok, e);
  const hex = CHECKS.hex[1];
  assert.ok(pruefeAntwort(hex, 'ff').ok && pruefeAntwort(hex, '0xFF').ok);
});

test('Rechenhilfen: Blockanfang und -ende raten', () => {
  const z = ip.zerlege('192.168.1.100', 26);
  assert.ok(rechnen.startOptionen(z).includes(64));
  assert.equal(rechnen.bewerteStart(z, 64), 'richtig');
  assert.equal(rechnen.bewerteStart(z, 100), 'kein-anfang');
  assert.equal(rechnen.bewerteStart(z, 128), 'zu-weit');
  assert.equal(rechnen.bewerteStart(z, 0), 'zu-frueh');
  assert.ok(rechnen.endeOptionen(z).includes(127) && rechnen.endeOptionen(z).includes(128));
  assert.equal(rechnen.bewerteEnde(z, 128), 'naechster-anfang');
  assert.match(rechnen.endeHinweis(z, 128), /nächsten Blocks/);
  for (let p = 8; p <= 30; p++) {
    const zz = ip.zerlege('172.20.130.77', p);
    const o = rechnen.startOptionen(zz);
    assert.ok(o.includes(zz.start) && o.length >= 1 && o.length <= 4, `/${p}`);
    assert.ok(rechnen.endeOptionen(zz).includes(zz.ende), `/${p}`);
  }
});

test('Rechenhilfen: Oktett-Rollen, große Netze, Rechenweg', () => {
  assert.deepEqual(rechnen.oktettRollen(26), ['netz', 'netz', 'netz', 'rechnen']);
  assert.deepEqual(rechnen.oktettRollen(23), ['netz', 'netz', 'rechnen', 'host']);
  assert.deepEqual(rechnen.oktettRollen(24), ['netz', 'netz', 'netz', 'host']);
  const g = rechnen.grossesNetz('10.4.7.20', 23);
  assert.equal(g.stuecke, 2);
  assert.deepEqual([g.netz, g.broadcast, g.hosts], ['10.4.6.0', '10.4.7.255', 510]);
  assert.equal(rechnen.grossesNetz('10.4.7.20', 20).zeilen.length, 4);
  for (let p = 8; p <= 30; p++) {
    const r = rechnen.rechenweg('172.20.130.77', p);
    const n = ip.netz('172.20.130.77', p);
    assert.equal(r.maske, ip.maske(p));
    assert.equal(r.block, 256 - r.maskenwert);
    assert.equal(r.start % r.block, 0);
    assert.ok(r.start <= r.wert && r.wert <= r.ende);
    assert.deepEqual([r.netz, r.broadcast, r.hosts], [n.netz, n.broadcast, n.hostsKlassisch]);
  }
  for (let s = 1; s < 300; s++) {
    const a = rechnen.zufallsAufgabe(zufall(s));
    const n = ip.netz(a.ip, a.praefix);
    assert.ok(a.ip !== n.netz && a.ip !== n.broadcast, `${a.ip}/${a.praefix}`);
  }
});

test('Rechenhilfen: statische Adresse prüfen', () => {
  const s = { netzAdr: '192.168.10.0', praefix: 24, belegt: [{ ip: '192.168.10.1', name: 'Router' }], dhcp: ['192.168.10.100', '192.168.10.200'] };
  assert.ok(rechnen.pruefeStatisch('192.168.10.20', s).ok);
  assert.match(rechnen.pruefeStatisch('192.168.11.20', s).grund, /nicht im Netz/);
  assert.match(rechnen.pruefeStatisch('192.168.10.0', s).grund, /Netzadresse/);
  assert.match(rechnen.pruefeStatisch('192.168.10.255', s).grund, /Broadcast/);
  assert.match(rechnen.pruefeStatisch('192.168.10.1', s).grund, /Router/);
  assert.match(rechnen.pruefeStatisch('192.168.10.150', s).grund, /DHCP/);
  assert.ok(!rechnen.pruefeStatisch('192.168.10.300', s).ok);
});

test('ip.js: Helfer für den Lernweg', () => {
  assert.deepEqual([0, 1, 2, 3, 8].map(ip.maskenwert), [0, 128, 192, 224, 255]);
  assert.deepEqual(ip.netzBitsJeOktett(23), [8, 8, 7, 0]);
  assert.equal(
    ip
      .binaerSchritte(150)
      .map((s) => s.bit)
      .join(''),
    '10010110',
  );
  assert.equal(ip.leseIp(' 192.168.001.010 '), '192.168.1.10');
  assert.equal(ip.leseIp('192.168.1.256'), null);
  assert.equal(ip.leseZahl('4.094'), 4094);
  assert.equal(ip.ipFehler('1.2.3.4'), null);
  assert.match(ip.ipFehler('192.168.1.256'), /255/);
  assert.match(ip.ipFehler('192.168.1'), /3 Teile/);
  assert.deepEqual(ip.leseMac('00:1a:2b:3c:4d:5e'), ['00', '1A', '2B', '3C', '4D', '5E']);
  assert.equal(ip.leseMac('00:1a-2b:3c:4d:5e'), null, 'gemischte Trennzeichen');
  assert.equal(ip.leseMac('00:1a:2b:3c:4d'), null);
  assert.equal(ip.ipv6Art('fe80::1'), 'link-local');
  assert.equal(ip.ipv6Art('2001:db8::1'), 'global');
  assert.equal(ip.ipv6Art('::1'), 'loopback');
  assert.equal(ip.ipv6Art('fec0::1'), 'andere');
  assert.equal(ip.ipv6Art('xyz'), null);
  assert.equal(ip.adressArt('192.168.1.64', 26), 'netz');
  assert.equal(ip.adressArt('192.168.1.127', 26), 'broadcast');
  assert.equal(ip.adressArt('10.4.6.255', 23), 'host');
});

test('Üben: neue Übungen rechnen richtig', () => {
  for (let s = 1; s < 300; s++) {
    const b = aufgaben.binaerAufgabe(zufall(s));
    const m = b.text.match(/\*\*([01]{8})\*\*/);
    if (m) assert.equal(b.felder[0].erwartet, parseInt(m[1], 2));

    const k = aufgaben.konfig(zufall(s));
    if (k.titel === 'Freie statische Adresse') {
      const f = k.felder[0];
      const gw = k.felder.find((x) => x.id === 'gw').erwartet;
      assert.ok(!f.pruefe(gw).ok, 'das Gateway ist keine freie Adresse');
      assert.ok(f.pruefe(f.soll).ok);
    }
    if (k.titel === 'Fehler in der Konfiguration') {
      const adr = k.text.match(/IP-Adresse: \*\*([\d.]+)\*\*/)[1];
      const gw = k.text.match(/Standardgateway: \*\*([\d.]+)\*\*/)[1];
      const maske = k.text.match(/Subnetzmaske: \*\*([\d.]+)\*\*/)[1];
      const p = Number(k.text.match(/Netz ist \*\*[\d.]+\/(\d+)\*\*/)[1]);
      const art = k.felder[0].erwartet;
      assert.equal(ip.gleichesNetz(adr, gw, p), art !== 'gw', `${art}: ${k.text}`);
      assert.equal(ip.praefixAusMaske(maske) === p, art !== 'maske', `${art}: ${k.text}`);
      assert.equal(ip.adressArt(adr, p) === 'host', art !== 'ip', `${art}: ${k.text}`);
    }

    const h = aufgaben.hostsAufgabe(zufall(s));
    if (h.titel === 'Blockgröße') assert.equal(256 % h.felder[1].erwartet, 0);
  }
});
