// Bühne des Lernwegs „Verstehen“: immer dieselbe Adresse, als Ebenen untereinander. Je weiter der Lernweg geht,
// desto näher zoomt sie heran – die ganze Adresse (32 Bit) → Lupe auf das Oktett mit dem Strich → dieses Oktett
// als Zahlenstrahl 0–255 → Lupe auf deinen Block. Ein Trichter zeigt, welcher Ausschnitt darunter vergrößert ist.
// Die Ebenen werden nur über Props gesteuert, damit die Übergänge zwischen den Schritten flüssig bleiben.
//
// Trichter: Eine Ebene markiert ihren vergrößerten Ausschnitt mit data-quelle, die nächste Ebene ihre Fläche mit
// data-ziel. Die Bühne misst beide und zeichnet dazwischen ein Trapez.

import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { oktettRollen } from './lernweg.js';

export const ALLE = 99; // „fertig gezählt“: alle Bits bis zum Präfix sind grün
export const GEWICHTE = [128, 64, 32, 16, 8, 4, 2, 1];
const EBENEN = ['adresse', 'oktett', 'strahl', 'block'];
const bits = (zahl) => Array.from({ length: 32 }, (_, i) => (zahl >>> (31 - i)) & 1);
export const bitVon = (wert, j) => (wert >> (7 - j)) & 1;

export function Buehne({ z, praefix, adresse, oktett, strahl, block, ergebnis }) {
  const wurzel = useRef(null);
  const [trichter, setTrichter] = useState([]);
  const sichtbar = EBENEN.filter((e, i) => [adresse, oktett, strahl, block][i]);

  const messen = useRef(null);
  messen.current = () => {
    const w = wurzel.current;
    if (!w) return [];
    const r0 = w.getBoundingClientRect();
    const neu = [];
    for (let n = 0; n < sichtbar.length - 1; n++) {
      const von = w.querySelector(`[data-quelle="${sichtbar[n]}"]`);
      const nach = w.querySelector(`[data-ziel="${sichtbar[n + 1]}"]`);
      if (!von || !nach) continue;
      const a = von.getBoundingClientRect();
      const b = nach.getBoundingClientRect();
      const x = (v) => Math.round(v - r0.left);
      const y = (v) => Math.round(v - r0.top);
      neu.push(`${x(a.left)},${y(a.bottom) + 4} ${x(a.right)},${y(a.bottom) + 4} ${x(b.right)},${y(b.top) - 4} ${x(b.left)},${y(b.top) - 4}`);
    }
    return neu;
  };
  const aktualisiere = () => {
    const neu = messen.current();
    setTrichter((alt) => (alt.join('|') === neu.join('|') ? alt : neu));
  };

  // Nach jedem Wechsel ein paar hundert Millisekunden mitmessen, solange die Übergänge laufen
  const schluessel = JSON.stringify([sichtbar, adresse?.fokus, adresse?.kompakt, oktett?.kompakt, oktett?.teilen, strahl?.dein, strahl?.kompakt, block?.kompakt, praefix, z.zahl]);
  useLayoutEffect(() => {
    let id;
    const bis = performance.now() + 900;
    const lauf = () => {
      aktualisiere();
      if (performance.now() < bis) id = requestAnimationFrame(lauf);
    };
    lauf();
    return () => cancelAnimationFrame(id);
  }, [schluessel]);
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined' || !wurzel.current) return undefined;
    const ro = new ResizeObserver(aktualisiere);
    ro.observe(wurzel.current);
    return () => ro.disconnect();
  }, []);

  return (
    <div class="slv-buehne" ref={wurzel}>
      <svg class="slv-trichter" aria-hidden="true">
        {trichter.map((punkte) => (
          <polygon key={punkte} points={punkte} />
        ))}
      </svg>
      {adresse && <EbeneAdresse z={z} praefix={praefix} {...adresse} />}
      {oktett && <EbeneOktett z={z} {...oktett} />}
      {strahl && <EbeneStrahl z={z} {...strahl} />}
      {block && <EbeneBlock z={z} {...block} />}
      {ergebnis && <EbeneErgebnis z={z} praefix={praefix} {...ergebnis} />}
    </div>
  );
}

// ---------- Ebene 1: die ganze Adresse ----------

// gezaehlt: 0 = noch ohne Farben; 1 … Präfix = beim Mitzählen; ALLE = Strich gesetzt
function EbeneAdresse({ z, praefix, gezaehlt = 0, zaehler, fokus, kompakt, namen, onBit }) {
  const b = bits(z.zahl);
  const strich = gezaehlt >= praefix;
  const gruen = Math.min(gezaehlt, praefix);
  return (
    <section class={`slv-ebene slv-adresse ${kompakt ? 'slv-adresse--kompakt' : ''}`}>
      <span class="slv-ebene__titel">Die ganze Adresse · 32 Bit{strich ? ` · /${praefix}` : ''}</span>
      <div class="slv-oktette" data-ziel="adresse">
        {[0, 1, 2, 3].map((o) => {
          const imFokus = fokus && o === z.index;
          return (
            <div key={o} class={`slv-okt ${fokus ? (imFokus ? 'slv-okt--fokus' : 'slv-okt--grau') : ''}`} data-quelle={imFokus ? 'adresse' : undefined}>
              <span class="slv-okt__dez mono">{z.oktette[o]}</span>
              <span class="slv-okt__bits">
                {b.slice(o * 8, o * 8 + 8).map((bit, j) => {
                  const i = o * 8 + j;
                  const farbe = gezaehlt > 0 ? (i < gruen ? 'slv-bit--netz' : 'slv-bit--host') : '';
                  const cls = `slv-bit ${farbe} ${!strich && gezaehlt > 0 && i === gezaehlt - 1 ? 'slv-bit--jetzt' : ''}`;
                  return [
                    strich && i === praefix && <span key={`s${i}`} class="slv-strich" aria-hidden="true" />,
                    <span key={i} class="slv-spalte">
                      {onBit ? (
                        <button class={cls} onClick={() => onBit(i + 1)} title={`Strich hinter Bit ${i + 1} setzen`}>
                          {bit}
                        </button>
                      ) : (
                        <i class={cls}>{bit}</i>
                      )}
                      {zaehler && (
                        <span class={`slv-zaehler mono ${i < gruen ? 'slv-zaehler--netz' : ''} ${strich && i + 1 === praefix ? 'slv-zaehler--grenze' : ''}`}>{i + 1}</span>
                      )}
                    </span>,
                  ];
                })}
              </span>
              {namen && (
                <span class="slv-okt__name">
                  {o + 1}. Oktett · <strong>8 Bit</strong>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------- Ebene 2: Lupe auf das Oktett mit dem Strich ----------

// gezeigt: wie viele Bits schon umgerechnet sind (0 … 8); teilen: Strich, Klammern und Netz-/Hostanteil zeigen
function EbeneOktett({ z, gezeigt = 8, teilen, kompakt }) {
  const wert = z.oktette[z.index];
  const k = z.netzBitsImOktett;
  const netz = GEWICHTE.filter((g, j) => j < k && bitVon(wert, j));
  const host = GEWICHTE.filter((g, j) => j >= k && bitVon(wert, j));
  const summe = (liste) => liste.reduce((a, x) => a + x, 0);
  return (
    <section class={`slv-ebene slv-lupe ${kompakt ? 'slv-lupe--kompakt' : ''}`}>
      <span class="slv-ebene__titel">
        Lupe: {z.index + 1}. Oktett = {wert}
      </span>
      <div class="slv-lupe__inhalt" data-quelle="oktett">
        <div class="slv-lupe__bits" data-ziel="oktett">
          {GEWICHTE.map((g, j) => {
            const offen = j >= gezeigt;
            const bit = bitVon(wert, j);
            const art = teilen ? (j < k ? 'netz' : 'host') : '';
            const farbe = offen ? 'slv-bit--offen' : art ? `slv-bit--${art}` : bit ? 'slv-bit--eins' : '';
            return [
              teilen && j === k && <span key={`s${j}`} class="slv-strich" aria-hidden="true" />,
              <span key={j} class="slv-spalte">
                <i class={`slv-bit ${farbe} ${!teilen && j === gezeigt ? 'slv-bit--jetzt' : ''}`}>{offen ? '?' : bit}</i>
                <span class={`slv-wert mono ${!offen && bit ? `slv-wert--an ${art ? `slv-wert--${art}` : ''}` : ''}`}>{g}</span>
              </span>,
            ];
          })}
        </div>
        {teilen && (
          <div class="slv-klammern">
            {k > 0 && (
              <span class="slv-klammer slv-klammer--netz" style={{ flexGrow: k }}>
                {kompakt ? 'Netz' : `Netz · ${k} Bit`}
              </span>
            )}
            <span class="slv-klammer slv-klammer--host" style={{ flexGrow: 8 - k }}>
              {kompakt ? 'Host' : `Host · ${8 - k} Bit`}
            </span>
          </div>
        )}
        {teilen && !kompakt && (
          <div class="slv-summen mono">
            <span class="slv-farbe-netz">
              Netz: {netz.length ? `${netz.join(' + ')} = ` : ''}
              <strong>{summe(netz)}</strong>
            </span>
            <span class="slv-farbe-host">
              Host: {host.length ? `${host.join(' + ')} = ` : ''}
              <strong>{summe(host)}</strong>
            </span>
            <strong>
              {wert} = <span class="slv-farbe-netz">{summe(netz)}</span> + <span class="slv-farbe-host">{summe(host)}</span>
            </strong>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Ebene 3: das Oktett als Zahlenstrahl 0–255, in Blöcke geschnitten ----------

// muster: Netz-Bit-Muster (00, 01, …) in die Blöcke schreiben; dein: eigenen Block markieren;
// onWahl: Blöcke anklickbar; falsch/fremd: Anfang eines falsch gewählten bzw. fremden Blocks
function EbeneStrahl({ z, muster, dein, zeiger = [], onWahl, falsch, fremd, kompakt }) {
  const anzahl = 256 / z.block;
  const k = z.netzBitsImOktett;
  const zeigeMuster = muster && k > 0 && anzahl <= 16;
  const jede = Math.max(1, anzahl / 16); // jede wievielte Blockgrenze beschriften
  return (
    <section class={`slv-ebene slv-strahl ${kompakt ? 'slv-strahl--kompakt' : ''}`}>
      <span class="slv-ebene__titel">
        {z.index + 1}. Oktett als Zahl: 0 bis 255 · {anzahl === 1 ? 'ein Block' : `${anzahl} Blöcke à ${z.block}`}
      </span>
      <div class={`slv-strahl__leiste ${anzahl > 32 ? 'slv-strahl__leiste--dicht' : ''}`} data-ziel="strahl">
        {Array.from({ length: anzahl }, (_, nr) => {
          const start = nr * z.block;
          const istDein = dein && start === z.start;
          const cls = `slv-block ${istDein ? 'slv-block--dein' : ''} ${fremd === start ? 'slv-block--fremd' : ''} ${falsch === start ? 'slv-block--falsch' : ''} ${onWahl ? 'slv-block--klick' : ''}`;
          const innen = [
            zeigeMuster && (
              <span key="m" class="slv-block__muster mono">
                {nr.toString(2).padStart(k, '0')}
              </span>
            ),
            nr % jede === 0 && (
              <span key="v" class="slv-block__von mono">
                {start}
              </span>
            ),
          ];
          return onWahl ? (
            <button key={nr} class={cls} data-quelle={istDein ? 'strahl' : undefined} onClick={() => onWahl(start)} aria-label={`Block ${start} bis ${start + z.block - 1}`}>
              {innen}
            </button>
          ) : (
            <span key={nr} class={cls} data-quelle={istDein ? 'strahl' : undefined}>
              {innen}
            </span>
          );
        })}
        <span class="slv-strahl__ende mono">255</span>
        {zeiger.map((p) => (
          <span key={p.text} class={`slv-zeiger ${p.ton ? `slv-zeiger--${p.ton}` : ''}`} style={{ left: `${((p.wert + 0.5) / 256) * 100}%` }}>
            <span class="mono">{p.text}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

// ---------- Ebene 4: Lupe auf deinen Block ----------

function EbeneBlock({ z, endeZeigen, kompakt }) {
  const rest = z.wert - z.start;
  const stelle = (rest / (z.block - 1)) * 100;
  const naechster = z.start + z.block;
  return (
    <section class={`slv-ebene slv-blupe ${kompakt ? 'slv-blupe--kompakt' : ''}`}>
      <span class="slv-ebene__titel">Lupe: dein Block · {z.block} Zahlen</span>
      <div class="slv-blupe__zeile">
        <div class="slv-blupe__leiste" data-ziel="block">
          <span class="slv-blupe__strecke" style={{ width: `${stelle}%` }}>
            {rest > 0 && <span class="mono">+{rest}</span>}
          </span>
          <span class="slv-blupe__zeiger" style={{ left: `${stelle}%` }}>
            <span class="mono">{z.wert}</span>
          </span>
        </div>
        {naechster <= 255 && <span class={`slv-blupe__naechster mono ${endeZeigen ? '' : 'slv-blupe__naechster--zu'}`}>{endeZeigen ? `${naechster} →` : '?'}</span>}
      </div>
      <div class="slv-blupe__enden">
        <span>
          <strong class="mono slv-farbe-netz">{z.start}</strong>
          <span>Anfang</span>
          {endeZeigen && <small>Host-Bits alle 0 · Netzadresse</small>}
        </span>
        <span class="slv-blupe__rechts">
          <strong class="mono slv-farbe-host">{endeZeigen ? z.ende : '?'}</strong>
          <span>Ende</span>
          {endeZeigen && <small>Host-Bits alle 1 · Broadcast</small>}
        </span>
      </div>
    </section>
  );
}

// ---------- Ergebnis: die ganze Adresse zusammengesetzt ----------

function EbeneErgebnis({ z, praefix, zeigen }) {
  const rollen = oktettRollen(praefix);
  const n = z.n;
  const zeilen = [
    { name: 'Netzadresse', ip: n.netz, text: 'Blockanfang, danach alles 0' },
    { name: 'Erster Host', ip: n.erster, text: 'Netzadresse + 1' },
    { name: 'Letzter Host', ip: n.letzter, text: 'Broadcast − 1', raten: true },
    { name: 'Broadcast', ip: n.broadcast, text: 'Blockende, danach alles 255', raten: true },
  ];
  return (
    <section class="slv-ebene slv-ergebnis">
      <span class="slv-ebene__titel">Wieder rausgezoomt: dein Netz</span>
      <div class="slv-tab-rahmen">
        <table class="slv-ergebnis__tab">
          <tbody>
            {zeilen.map((zeile) => {
              const verdeckt = zeile.raten && !zeigen;
              return (
                <tr key={zeile.name}>
                  <th>{zeile.name}</th>
                  {zeile.ip.split('.').map((o, i) => (
                    <td key={i} class={`mono slv-z--${rollen[i]}`}>
                      {verdeckt ? '?' : o}
                      {i < 3 && <span class="slv-ergebnis__punkt">.</span>}
                    </td>
                  ))}
                  <td class="slv-ergebnis__text">{verdeckt ? '' : zeile.text}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div class="slv-legende">
        <span>
          <i class="slv-farbe slv-farbe--fest" /> abgeschrieben
        </span>
        <span>
          <i class="slv-farbe slv-farbe--grenze" /> gerechnet ({z.index + 1}. Oktett)
        </span>
        {rollen.includes('frei') && (
          <span>
            <i class="slv-farbe slv-farbe--frei" /> ganz Host: 0 bzw. 255
          </span>
        )}
      </div>
    </section>
  );
}

// 8 kleine Bits mit Strich nach k Netz-Bits – für Beweis-Zeilen im Text
export function MiniBits({ wert, k }) {
  return (
    <span class="slv-minibits">
      {GEWICHTE.map((g, j) => [
        j === k && j > 0 && <span key={`s${j}`} class="slv-strich slv-strich--mini" aria-hidden="true" />,
        <i key={j} class={`slv-bit ${j < k ? 'slv-bit--netz' : 'slv-bit--host'}`}>
          {bitVon(wert, j)}
        </i>,
      ])}
    </span>
  );
}
