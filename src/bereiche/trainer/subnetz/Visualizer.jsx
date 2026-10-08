// Subnetz-Visualizer: zeigt, wo die Grenze zwischen Netz- und Hostteil liegt, warum die Maske so heißt,
// wie groß ein Block ist und in welchem Block die Adresse liegt – Schritt für Schritt, Bit für Bit und
// auf einem Zahlenstrahl des entscheidenden Oktetts. Alles live zur eingegebenen Adresse.

import { useMemo, useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../ui/bausteine.jsx';
import { ipZuZahl, zahlZuIp, zerlege } from './ip.js';
import { zufall } from '../rahmen/zufall.js';

const GEWICHTE = [128, 64, 32, 16, 8, 4, 2, 1];
const SCHNELL = [24, 25, 26, 27, 28, 29, 30];
const gueltig = (ip) => /^\d{1,3}(\.\d{1,3}){3}$/.test(ip) && ip.split('.').every((t) => Number(t) <= 255);

const bits = (zahl) => Array.from({ length: 32 }, (_, i) => (zahl >>> (31 - i)) & 1);

export function SubnetzVisualizer() {
  const [ip, setIp] = useState('192.168.40.150');
  const [eingabe, setEingabe] = useState('192.168.40.150');
  const [praefix, setPraefix] = useState(26);
  const z = useMemo(() => zerlege(ip, praefix), [ip, praefix]);

  const setzeIp = (text) => {
    setEingabe(text);
    if (gueltig(text.trim())) setIp(text.trim());
  };
  const kippe = (i) => {
    const neu = zahlZuIp((z.zahl ^ (1 << (31 - i))) >>> 0);
    setIp(neu);
    setEingabe(neu);
  };
  const beispiel = () => {
    const r = zufall();
    const neu = [r.wahl([10, 172, 192]), r.ganz(0, 255), r.ganz(0, 255), r.ganz(1, 254)];
    if (neu[0] === 192) neu[1] = 168;
    if (neu[0] === 172) neu[1] = r.ganz(16, 31);
    const text = neu.join('.');
    setIp(text);
    setEingabe(text);
    setPraefix(r.wahl([24, 25, 26, 26, 27, 27, 28, 29, 30, 20, 22, 23]));
  };

  return (
    <div class="snv">
      <section class="flaeche flaeche--gross snv-eingabe">
        <label class="snv-feld">
          <span class="ueberschrift-klein">IP-Adresse</span>
          <input class={`feld mono ${gueltig(eingabe.trim()) ? '' : 'snv-feld--falsch'}`} value={eingabe} inputMode="decimal" onInput={(e) => setzeIp(e.currentTarget.value)} />
        </label>
        <div class="snv-feld snv-praefix">
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
          <div class="snv-schnell">
            {SCHNELL.map((p) => (
              <button key={p} class={`snv-chip ${p === praefix ? 'snv-chip--an' : ''}`} onClick={() => setPraefix(p)}>
                /{p}
              </button>
            ))}
          </div>
        </div>
        <Knopf variante="zweit" icon="shuffle" onClick={beispiel}>
          Zufälliges Beispiel
        </Knopf>
      </section>

      <Schritte z={z} ip={ip} praefix={praefix} />
      <BitAnsicht z={z} praefix={praefix} kippe={kippe} />
      <Zahlenstrahl z={z} />
      <Ergebnis z={z} praefix={praefix} />
    </div>
  );
}

// ---------- Rechenweg ----------

function Schritte({ z, ip, praefix }) {
  const nr = z.index + 1;
  const volle = z.index; // volle Netz-Oktette davor
  const zerlegung = [...Array(volle).fill(8), z.netzBitsImOktett].filter((x, i) => x > 0 || i < volle).join(' + ');
  const netzBitsWerte = GEWICHTE.slice(0, z.netzBitsImOktett);
  const okt = (i, wert) => z.oktette.map((o, j) => (j === i ? <strong key={j}>{wert}</strong> : j < i ? o : 0)).reduce((a, b, j) => [...a, j ? '.' : '', b], []);
  return (
    <section class="flaeche flaeche--gross snv-schritte">
      <div class="ueberschrift-klein ueberschrift-klein--akzent">Rechenweg für {ip}/{praefix}</div>
      <ol>
        <li>
          <strong>Wo liegt die Grenze?</strong> {praefix} = {zerlegung || '0'}. Die ersten {volle} Oktette gehören komplett zum Netz
          {z.netzBitsImOktett > 0 ? (
            <>
              , im <strong>{nr}. Oktett</strong> sind es noch <strong>{z.netzBitsImOktett} Netzbits</strong> – dort wird gerechnet.
            </>
          ) : (
            <>
              . Die Grenze liegt genau vor dem <strong>{nr}. Oktett</strong> – es gehört komplett zum Hostteil.
            </>
          )}
        </li>
        <li>
          <strong>Maske:</strong>{' '}
          {z.netzBitsImOktett > 0 ? (
            <>
              Im {nr}. Oktett stehen {z.netzBitsImOktett} Einsen vorn: {netzBitsWerte.join(' + ')} = <strong>{z.maskenwert}</strong>.
            </>
          ) : (
            <>Im {nr}. Oktett steht keine Eins: 0.</>
          )}{' '}
          Maske = <span class="mono">{zahlZuIp(z.m)}</span>
        </li>
        <li>
          <strong>Blockgröße:</strong> 256 − {z.maskenwert} = <strong>{z.block}</strong>
          {z.netzBitsImOktett > 0 && (
            <span class="gedaempft">
              {' '}
              (= Wert des letzten Netzbits, {GEWICHTE[z.netzBitsImOktett - 1]})
            </span>
          )}
          . Die Netze im {nr}. Oktett beginnen bei 0, {z.block}
          {z.block * 2 < 256 ? `, ${z.block * 2}` : ''}
          {z.block * 3 < 256 ? ', …' : ''}
        </li>
        <li>
          <strong>In welchem Block liegt die Adresse?</strong> Das {nr}. Oktett ist <strong>{z.wert}</strong>. {z.wert} : {z.block} = {z.blockNr} Rest {z.wert - z.start} → Block {z.blockNr} beginnt bei {z.blockNr} × {z.block} ={' '}
          <strong>{z.start}</strong> und endet bei {z.start} + {z.block} − 1 = <strong>{z.ende}</strong>.
          <div class="snv-folgerung">
            Netzadresse: alle Hostbits 0 → <span class="mono">{okt(z.index, z.start)}</span>
            <br />
            Broadcast: alle Hostbits 1 → <span class="mono">{z.n.broadcast}</span>
          </div>
        </li>
      </ol>
    </section>
  );
}

// ---------- Bits ----------

function BitAnsicht({ z, praefix, kippe }) {
  const zeilen = [
    { name: 'IP-Adresse', zahl: z.zahl, klick: true },
    { name: 'Maske', zahl: z.m },
    { name: 'Netzadresse (IP UND Maske)', zahl: ipZuZahl(z.n.netz) },
    { name: 'Broadcast (Hostbits = 1)', zahl: (ipZuZahl(z.n.netz) | (~z.m >>> 0)) >>> 0 },
  ];
  return (
    <section class="flaeche flaeche--gross snv-bits">
      <div class="snv-bits__kopf">
        <div class="ueberschrift-klein">Bit für Bit</div>
        <span class="snv-legende">
          <i class="snv-bit snv-bit--netz">1</i> Netzteil ({praefix} Bit) <i class="snv-bit snv-bit--host">0</i> Hostteil ({32 - praefix} Bit)
        </span>
      </div>
      <div class="snv-tabelle">
        {zeilen.map((zeile) => {
          const b = bits(zeile.zahl);
          const okt = zahlZuIp(zeile.zahl).split('.');
          return (
            <div key={zeile.name} class="snv-zeile">
              <div class="snv-zeile__name">{zeile.name}</div>
              <div class="snv-zeile__oktette">
                {[0, 1, 2, 3].map((o) => (
                  <div key={o} class={`snv-oktett ${o === z.index ? 'snv-oktett--wichtig' : ''}`}>
                    <div class="snv-oktett__wert mono">{okt[o]}</div>
                    <div class="snv-oktett__bits">
                      {b.slice(o * 8, o * 8 + 8).map((bit, j) => {
                        const i = o * 8 + j;
                        const cls = `snv-bit ${i < praefix ? 'snv-bit--netz' : 'snv-bit--host'} ${i === praefix ? 'snv-bit--grenze' : ''}`;
                        return zeile.klick ? (
                          <button key={j} class={cls} onClick={() => kippe(i)} title={`Bit ${i + 1} umschalten`}>
                            {bit}
                          </button>
                        ) : (
                          <i key={j} class={cls}>
                            {bit}
                          </i>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div class="snv-zeile snv-zeile--gewichte">
          <div class="snv-zeile__name gedaempft">Wertigkeit im {z.index + 1}. Oktett</div>
          <div class="snv-zeile__oktette">
            {[0, 1, 2, 3].map((o) => (
              <div key={o} class="snv-oktett">
                <div class="snv-oktett__bits">
                  {GEWICHTE.map((g, j) => (
                    <i key={j} class={`snv-gewicht ${o === z.index ? '' : 'snv-gewicht--leer'}`}>
                      {o === z.index ? g : ''}
                    </i>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p class="gedaempft snv-tipp">
        <Icon name="info" groesse={13} /> Tipp: Klick auf ein Bit der IP-Adresse schaltet es um – so siehst du, welche Bits das Netz ändern und welche nur den Host.
      </p>
    </section>
  );
}

// ---------- Zahlenstrahl ----------

function Zahlenstrahl({ z }) {
  const anzahl = 256 / z.block;
  const mitText = anzahl <= 16;
  return (
    <section class="flaeche flaeche--gross snv-strahl">
      <div class="ueberschrift-klein">
        {z.index + 1}. Oktett von 0 bis 255 – aufgeteilt in {anzahl} {anzahl === 1 ? 'Block' : 'Blöcke'} zu je {z.block}
      </div>
      <div class="snv-strahl__leiste">
        {Array.from({ length: anzahl }, (_, i) => {
          const s = i * z.block;
          const aktiv = i === z.blockNr;
          return (
            <div key={i} class={`snv-block ${aktiv ? 'snv-block--aktiv' : ''}`} style={{ flex: 1 }} title={`${s} – ${s + z.block - 1}`}>
              {mitText && <span class="snv-block__von mono">{s}</span>}
              {aktiv && anzahl <= 8 && (
                <span class="snv-block__bereich mono">
                  {s} – {s + z.block - 1}
                </span>
              )}
            </div>
          );
        })}
        <span class="snv-strahl__ende mono">255</span>
        <div class="snv-marke" style={{ left: `${((z.wert + 0.5) / 256) * 100}%` }}>
          <span class="mono">{z.wert}</span>
        </div>
      </div>
      <div class="snv-strahl__erklaerung">
        <span>
          <i class="snv-farbe snv-farbe--netz" /> erste Adresse des Blocks = Netzadresse
        </span>
        <span>
          <i class="snv-farbe snv-farbe--host" /> dazwischen = Hosts
        </span>
        <span>
          <i class="snv-farbe snv-farbe--bc" /> letzte Adresse = Broadcast
        </span>
      </div>
      <div class="snv-aktiv-block mono">
        <span class="snv-farbe snv-farbe--netz" /> {z.start} <span class="gedaempft">Netz</span>
        <span class="snv-pfeil">→</span>
        <span class="snv-farbe snv-farbe--host" /> {z.block > 2 ? `${z.start + 1} … ${z.ende - 1}` : '–'} <span class="gedaempft">Hosts</span>
        <span class="snv-pfeil">→</span>
        <span class="snv-farbe snv-farbe--bc" /> {z.ende} <span class="gedaempft">Broadcast</span>
        {z.index < 3 && <span class="gedaempft"> (im {z.index + 1}. Oktett; dahinter jeweils .0 bzw. .255)</span>}
      </div>
    </section>
  );
}

// ---------- Ergebnis ----------

function Ergebnis({ z, praefix }) {
  const n = z.n;
  const zeilen = [
    ['Netzadresse', `${n.netz}/${praefix}`],
    ['Subnetzmaske', n.maske],
    ['Erste nutzbare Adresse', n.erster],
    ['Letzte nutzbare Adresse', n.letzter],
    ['Broadcastadresse', n.broadcast ?? '–'],
    ['Adressen im Netz', `2^${32 - praefix} = ${n.adressen.toLocaleString('de-DE')}`],
    ['Nutzbare Hosts', `2^${32 - praefix} − 2 = ${n.hostsKlassisch.toLocaleString('de-DE')}`],
  ];
  return (
    <section class="flaeche flaeche--gross">
      <div class="ueberschrift-klein">Ergebnis</div>
      <div class="atabelle-huelle">
        <table class="atabelle snv-ergebnis">
          <tbody>
            {zeilen.map(([a, b]) => (
              <tr key={a}>
                <th>{a}</th>
                <td class="mono">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
