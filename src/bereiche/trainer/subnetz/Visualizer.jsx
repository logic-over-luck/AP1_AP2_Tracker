// Subnetz-Visualizer: alles zu einer Adresse auf einen Blick – Rechenweg in vier Schritten, die 32 Bits von
// IP, Maske, Netz und Broadcast mit markierter Grenze, Kennzahlen, Zahlenstrahl des entscheidenden Oktetts,
// alle Teilnetze dieses Oktetts und die Präfix-Tabelle /24 … /30. Klick auf Bit, Block, Teilnetz oder
// Präfix verändert die Adresse bzw. das Präfix.

import { useMemo, useState } from 'preact/hooks';
import { Icon } from '../../../ui/bausteine.jsx';
import { ipZuZahl, zahlZuIp, zerlege, istPrivat, subnetzeImOktett, maske } from './ip.js';
import { zufall } from '../rahmen/zufall.js';

const GEWICHTE = [128, 64, 32, 16, 8, 4, 2, 1];
const TABELLE = [24, 25, 26, 27, 28, 29, 30];
const gueltig = (ip) => /^\d{1,3}(\.\d{1,3}){3}$/.test(ip) && ip.split('.').every((t) => Number(t) <= 255);
const bits = (zahl) => Array.from({ length: 32 }, (_, i) => (zahl >>> (31 - i)) & 1);
const tausend = (n) => n.toLocaleString('de-DE');

export function SubnetzVisualizer() {
  const [ip, setIpRoh] = useState('192.168.40.150');
  const [eingabe, setEingabe] = useState('192.168.40.150');
  const [praefix, setPraefix] = useState(26);
  const z = useMemo(() => zerlege(ip, praefix), [ip, praefix]);
  const netze = useMemo(() => subnetzeImOktett(ip, praefix), [ip, praefix]);

  const setIp = (neu) => {
    setIpRoh(neu);
    setEingabe(neu);
  };
  const tippe = (text) => {
    setEingabe(text);
    if (gueltig(text.trim())) setIpRoh(text.trim());
  };
  const kippe = (i) => setIp(zahlZuIp((z.zahl ^ (1 << (31 - i))) >>> 0));
  // in einen Block springen: erste Hostadresse dieses Blocks
  const springe = (start) => {
    const okt = z.oktette.map((o, i) => (i < z.index ? o : i === z.index ? start : 0));
    setIp(zahlZuIp(ipZuZahl(okt.join('.')) + 1));
  };
  const beispiel = () => {
    const r = zufall();
    const a = r.wahl([10, 172, 192]);
    const b = a === 192 ? 168 : a === 172 ? r.ganz(16, 31) : r.ganz(0, 255);
    setIp([a, b, r.ganz(0, 255), r.ganz(1, 254)].join('.'));
    setPraefix(r.wahl([24, 25, 26, 26, 27, 27, 28, 28, 29, 30, 20, 22, 23]));
  };

  return (
    <div class="snv">
      <div class="flaeche snv-leiste">
        <label class="snv-ip">
          <span class="ueberschrift-klein">IP-Adresse</span>
          <input class={`feld mono ${gueltig(eingabe.trim()) ? '' : 'snv-ip--falsch'}`} value={eingabe} inputMode="decimal" spellcheck={false} onInput={(e) => tippe(e.currentTarget.value)} />
        </label>
        <div class="snv-praefix">
          <span class="ueberschrift-klein">Präfix</span>
          <div class="snv-praefix__zeile">
            <button class="snv-schritt" onClick={() => setPraefix(Math.max(8, praefix - 1))} aria-label="Präfix verkleinern">
              −
            </button>
            <input type="range" min="8" max="30" value={praefix} onInput={(e) => setPraefix(Number(e.currentTarget.value))} aria-label="Präfix" />
            <button class="snv-schritt" onClick={() => setPraefix(Math.min(30, praefix + 1))} aria-label="Präfix vergrößern">
              +
            </button>
            <span class="snv-praefix__wert mono">/{praefix}</span>
          </div>
        </div>
        <button class="snv-zufall" onClick={beispiel}>
          <Icon name="shuffle" groesse={15} /> Beispiel
        </button>
      </div>

      <Rechenweg z={z} praefix={praefix} />

      <div class="snv-raster">
        <Bits z={z} praefix={praefix} kippe={kippe} />
        <Kennzahlen z={z} ip={ip} praefix={praefix} netze={netze} />
      </div>

      <Zahlenstrahl z={z} netze={netze} springe={springe} />

      <div class="snv-raster snv-raster--unten">
        <Teilnetze netze={netze} z={z} springe={springe} />
        <Praefixe praefix={praefix} setPraefix={setPraefix} />
      </div>
    </div>
  );
}

// ---------- Rechenweg: vier Karten ----------

function Rechenweg({ z, praefix }) {
  const nr = z.index + 1;
  const teile = [...Array(z.index).fill(8), ...(z.netzBitsImOktett ? [z.netzBitsImOktett] : [])];
  const werte = GEWICHTE.slice(0, z.netzBitsImOktett);
  const starts = z.block < 256 ? [0, z.block, z.block * 2].filter((x) => x < 256) : [0];
  return (
    <ol class="snv-weg">
      <li class="flaeche">
        <span class="snv-weg__nr">1</span>
        <div>
          <div class="snv-weg__titel">Grenze</div>
          <div class="mono">
            /{praefix} = {teile.join(' + ') || '0'}
          </div>
          <div class="snv-weg__text">
            {z.netzBitsImOktett ? `→ ${nr}. Oktett, ${z.netzBitsImOktett} Netzbit${z.netzBitsImOktett > 1 ? 's' : ''}` : `→ Grenze vor dem ${nr}. Oktett`}
          </div>
        </div>
      </li>
      <li class="flaeche">
        <span class="snv-weg__nr">2</span>
        <div>
          <div class="snv-weg__titel">Maske im {nr}. Oktett</div>
          <div class="mono">{werte.length ? `${werte.join('+')} = ${z.maskenwert}` : '0'}</div>
          <div class="snv-weg__text mono">→ {maske(praefix)}</div>
        </div>
      </li>
      <li class="flaeche">
        <span class="snv-weg__nr">3</span>
        <div>
          <div class="snv-weg__titel">Blockgröße</div>
          <div class="mono">
            256 − {z.maskenwert} = <strong>{z.block}</strong>
          </div>
          <div class="snv-weg__text mono">
            → Netze bei {starts.join(', ')}
            {z.block * 3 < 256 ? ', …' : ''}
          </div>
        </div>
      </li>
      <li class="flaeche snv-weg--ziel">
        <span class="snv-weg__nr">4</span>
        <div>
          <div class="snv-weg__titel">Block der Adresse</div>
          <div class="mono">
            {z.wert} : {z.block} = {z.blockNr} Rest {z.wert - z.start}
          </div>
          <div class="snv-weg__text mono">
            → {z.blockNr} × {z.block} = <strong>{z.start}</strong> bis <strong>{z.ende}</strong>
          </div>
        </div>
      </li>
    </ol>
  );
}

// ---------- Bits ----------

function Bits({ z, praefix, kippe }) {
  const netzZahl = ipZuZahl(z.n.netz);
  const zeilen = [
    { name: 'IP', zahl: z.zahl, klick: true },
    { name: 'Maske', zahl: z.m },
    { name: 'Netz', zahl: netzZahl, tip: 'IP UND Maske: alle Hostbits 0' },
    { name: 'Broadcast', zahl: (netzZahl | (~z.m >>> 0)) >>> 0, tip: 'alle Hostbits 1' },
  ];
  return (
    <section class="flaeche snv-bits">
      <div class="snv-kopf">
        <span class="ueberschrift-klein">Bit für Bit</span>
        <span class="snv-legende">
          <i class="snv-bit snv-bit--netz">1</i> Netz {praefix}
          <i class="snv-bit snv-bit--host">0</i> Host {32 - praefix}
        </span>
      </div>
      <div class="snv-bits__tabelle">
        {zeilen.map((zeile) => {
          const b = bits(zeile.zahl);
          return (
            <div key={zeile.name} class="snv-zeile" title={zeile.tip}>
              <span class="snv-zeile__name">
                {zeile.name}
                <span class="snv-zeile__dez mono">{zahlZuIp(zeile.zahl)}</span>
              </span>
              {[0, 1, 2, 3].map((o) => (
                <span key={o} class={`snv-oktett ${o === z.index ? 'snv-oktett--wichtig' : ''}`}>
                  {b.slice(o * 8, o * 8 + 8).map((bit, j) => {
                    const i = o * 8 + j;
                    const cls = `snv-bit ${i < praefix ? 'snv-bit--netz' : 'snv-bit--host'} ${i === praefix ? 'snv-bit--grenze' : ''}`;
                    return zeile.klick ? (
                      <button key={j} class={cls} onClick={() => kippe(i)} title={`Bit ${i + 1} (Wert ${GEWICHTE[j]}) umschalten`}>
                        {bit}
                      </button>
                    ) : (
                      <i key={j} class={cls}>
                        {bit}
                      </i>
                    );
                  })}
                </span>
              ))}
            </div>
          );
        })}
        <div class="snv-zeile snv-zeile--gewichte">
          <span class="snv-zeile__name" />
          {[0, 1, 2, 3].map((o) => (
            <span key={o} class="snv-oktett">
              {GEWICHTE.map((g, j) => (
                <i key={j} class="snv-gewicht">
                  {o === z.index ? g : ''}
                </i>
              ))}
            </span>
          ))}
        </div>
      </div>
      <p class="snv-hinweis">Bit der IP anklicken = umschalten · hervorgehoben: das {z.index + 1}. Oktett, in dem gerechnet wird</p>
    </section>
  );
}

// ---------- Kennzahlen ----------

function Kennzahlen({ z, ip, praefix, netze }) {
  const n = z.n;
  const privat = istPrivat(ip);
  const kacheln = [
    ['Netzadresse', n.netz, true],
    ['Broadcast', n.broadcast, true],
    ['Erster Host', n.erster],
    ['Letzter Host', n.letzter],
    ['Maske', n.maske],
    ['Wildcard', zahlZuIp(~z.m >>> 0)],
    ['Nutzbare Hosts', tausend(n.hostsKlassisch), false, `2^${32 - praefix} − 2`],
    ['Adressen', tausend(n.adressen), false, `2^${32 - praefix}`],
    ['Blockgröße', String(z.block), false, `im ${z.index + 1}. Oktett`],
    ['Teilnetze', String(netze.length), false, `im ${z.index + 1}. Oktett`],
  ];
  return (
    <section class="flaeche snv-zahlen">
      <div class="snv-kopf">
        <span class="ueberschrift-klein">Kennzahlen</span>
        <span class={`snv-marke-text ${privat ? 'snv-marke-text--privat' : ''}`}>{privat ? `privat · ${privat}` : 'öffentlich'}</span>
      </div>
      <div class="snv-kacheln">
        {kacheln.map(([name, wert, wichtig, unter]) => (
          <div key={name} class={`snv-kachel ${wichtig ? 'snv-kachel--wichtig' : ''}`}>
            <span class="snv-kachel__name">{name}</span>
            <span class="snv-kachel__wert mono">{wert}</span>
            {unter && <span class="snv-kachel__unter mono">{unter}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Zahlenstrahl ----------

function Zahlenstrahl({ z, netze, springe }) {
  const [zeige, setZeige] = useState(null);
  const anzahl = netze.length;
  const info = netze[zeige ?? z.blockNr];
  const jede = anzahl <= 16 ? 1 : anzahl <= 32 ? 2 : 4; // jede wievielte Blockgrenze beschriften
  return (
    <section class="flaeche snv-strahl">
      <div class="snv-kopf">
        <span class="ueberschrift-klein">
          {z.index + 1}. Oktett 0–255 · {anzahl} {anzahl === 1 ? 'Block' : 'Blöcke'} à {z.block}
        </span>
        <span class="snv-strahl__info mono">
          {zeige !== null && zeige !== z.blockNr ? `Block ${info.nr}: ` : 'Dein Block: '}
          <i class="snv-c snv-c--netz" />
          {info.netz} … <i class="snv-c snv-c--bc" />
          {info.broadcast}
        </span>
      </div>
      <div class="snv-strahl__leiste" onMouseLeave={() => setZeige(null)}>
        {netze.map((b) => (
          <button
            key={b.nr}
            class={`snv-block ${b.aktiv ? 'snv-block--aktiv' : ''} ${zeige === b.nr ? 'snv-block--hover' : ''}`}
            onMouseEnter={() => setZeige(b.nr)}
            onFocus={() => setZeige(b.nr)}
            onClick={() => springe(b.start)}
            aria-label={`Block ${b.nr}: ${b.netz} bis ${b.broadcast}`}
          >
            {b.nr % jede === 0 && <span class="snv-block__von mono">{b.start}</span>}
          </button>
        ))}
        <span class="snv-strahl__ende mono">255</span>
        <span class="snv-zeiger" style={{ left: `${((z.wert + 0.5) / 256) * 100}%` }}>
          <span class="mono">{z.wert}</span>
        </span>
      </div>
      <div class="snv-strahl__legende">
        <span>
          <i class="snv-c snv-c--netz" />
          Netzadresse
        </span>
        <span>
          <i class="snv-c snv-c--host" />
          Hosts
        </span>
        <span>
          <i class="snv-c snv-c--bc" />
          Broadcast
        </span>
        <span class="gedaempft">Block anklicken = hineinspringen</span>
      </div>
    </section>
  );
}

// ---------- Tabellen ----------

// Adresse kompakt: nur die letzten zwei Oktette
const kurz = (ip) => '…' + ip.split('.').slice(2).join('.');

function Teilnetze({ netze, z, springe }) {
  return (
    <section class="flaeche snv-liste">
      <div class="snv-kopf">
        <span class="ueberschrift-klein">Alle Teilnetze im {z.index + 1}. Oktett</span>
        <span class="gedaempft snv-klein">
          {netze.length} {netze.length === 1 ? 'Netz' : 'Netze'} · Zeile anklicken = hineinspringen
        </span>
      </div>
      <div class="snv-liste__rollen">
        <table class="snv-tab">
          <thead>
            <tr>
              <th>Nr.</th>
              <th>Netzadresse</th>
              <th>Hosts</th>
              <th>Broadcast</th>
            </tr>
          </thead>
          <tbody>
            {netze.map((b) => (
              <tr key={b.nr} class={b.aktiv ? 'snv-tab--aktiv' : ''} onClick={() => springe(b.start)}>
                <td class="mono">{b.nr}</td>
                <td class="mono">
                  <span class="snv-lang">{b.netz}</span>
                  <span class="snv-kurz">{kurz(b.netz)}</span>
                </td>
                <td class="mono">
                  {kurz(b.erster)} – {kurz(b.letzter)}
                </td>
                <td class="mono">
                  <span class="snv-lang">{b.broadcast}</span>
                  <span class="snv-kurz">{kurz(b.broadcast)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Praefixe({ praefix, setPraefix }) {
  return (
    <section class="flaeche snv-liste">
      <div class="snv-kopf">
        <span class="ueberschrift-klein">Präfix-Tabelle zum Merken</span>
        <span class="gedaempft snv-klein">Zeile anklicken = Präfix wählen</span>
      </div>
      <table class="snv-tab">
        <thead>
          <tr>
            <th>Präfix</th>
            <th>Maske</th>
            <th>Block</th>
            <th>Hosts</th>
          </tr>
        </thead>
        <tbody>
          {TABELLE.map((p) => (
            <tr key={p} class={p === praefix ? 'snv-tab--aktiv' : ''} onClick={() => setPraefix(p)}>
              <td class="mono">/{p}</td>
              <td class="mono">…{256 - 2 ** (32 - p)}</td>
              <td class="mono">{2 ** (32 - p)}</td>
              <td class="mono">{2 ** (32 - p) - 2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
