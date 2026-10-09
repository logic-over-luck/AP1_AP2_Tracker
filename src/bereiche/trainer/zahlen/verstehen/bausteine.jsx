// Bausteine der Zahlen-Lektionen: Stellenwert-Tafel, Bit-Schalter, Umrechner (Stellenwert- und Restwertverfahren),
// Hex-Tafel, Einheiten-Treppe, Rechenweg. Klassen-Präfix zl- (styles/zahlen.css). Stellen, BitTafel und Umrechner
// nutzt auch der Subnetz-Trainer.

import { useContext, useEffect, useState } from 'preact/hooks';
import { Knopf } from '../../../../ui/bausteine.jsx';
import { AlleOffen } from '../../lernweg/bausteine.jsx';

export const HEX = '0123456789ABCDEF';
export const tausend = (n, stellen = null) =>
  stellen === null ? n.toLocaleString('de-DE', { maximumFractionDigits: 10 }) : n.toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
// Hochzahl als hochgestellte Ziffern: hoch(3) → '³'
const HOCH = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const hoch = (n) =>
  String(n)
    .split('')
    .map((z) => HOCH[Number(z)])
    .join('');
export const binaer = (wert, breite = 8) => wert.toString(2).padStart(breite, '0');
export const gruppiert = (bin) =>
  bin
    .padStart(Math.ceil(bin.length / 4) * 4, '0')
    .match(/.{4}/g)
    .join(' ');
const stellenwerte = (bits) => Array.from({ length: bits }, (_, j) => 2 ** (bits - 1 - j));

// Stellenwert-Tafel ohne Schalter: werte (z. B. [100, 10, 1]), ziffern, Summe als Text
export function Stellen({ werte, ziffern, summe, an = null }) {
  return (
    <div class="zl-stellen">
      {werte.map((g, j) => {
        const leuchtet = an ? an[j] : Number.isNaN(Number(ziffern[j])) || Number(ziffern[j]) > 0;
        return (
          <span key={j} class={`zl-stellen__spalte ${leuchtet ? 'zl-stellen__spalte--an' : ''}`}>
            <span class="zl-stellen__wert mono">{typeof g === 'number' ? tausend(g) : g}</span>
            <span class="zl-stellen__bit mono">{ziffern[j]}</span>
          </span>
        );
      })}
      {summe && <span class="zl-stellen__summe mono">{summe}</span>}
    </div>
  );
}

// Bit-Tafel: Schalter mit Stellenwerten darüber, Summe darunter. nibbles: Hex-Ziffer je 4 Bit zeigen.
export function BitTafel({ wert, onWert, bits = 8, nibbles = false, ziel = null }) {
  const werte = stellenwerte(bits);
  const b = werte.map((_, j) => Math.floor(wert / 2 ** (bits - 1 - j)) % 2);
  const teile = werte.filter((_, j) => b[j]);
  const viertel = Array.from({ length: bits / 4 }, (_, i) => b.slice(i * 4, i * 4 + 4));
  return (
    <div class="zl-tafel-huelle">
      <div class={`zl-tafel ${nibbles ? 'zl-tafel--nibbles' : ''}`} style={bits !== 8 ? { gridTemplateColumns: `repeat(${bits}, minmax(0, 1fr))` } : null}>
        {b.map((bit, j) => (
          <div key={j} class="zl-tafel__spalte">
            <span class={`zl-tafel__wert mono ${bit ? 'zl-tafel__wert--an' : ''}`}>{werte[j]}</span>
            <button
              type="button"
              class={`zl-tafel__bit mono ${bit ? 'zl-tafel__bit--an' : ''}`}
              aria-pressed={!!bit}
              aria-label={`Bit mit Stellenwert ${werte[j]} umschalten`}
              onClick={() => onWert(bit ? wert - werte[j] : wert + werte[j])}
            >
              {bit}
            </button>
          </div>
        ))}
      </div>
      {nibbles && (
        <div class="zl-tafel__hex" style={bits !== 8 ? { gridTemplateColumns: `repeat(${bits / 4}, minmax(0, 1fr))`, maxWidth: 'none' } : null}>
          {viertel.map((v, i) => {
            const w = parseInt(v.join(''), 2);
            return (
              <span key={i}>
                <span class="mono">{v.join('')}</span> = {w} = <strong class="mono">{HEX[w]}</strong>
              </span>
            );
          })}
        </div>
      )}
      <p class={`lw-formel mono ${ziel !== null && wert === ziel ? 'lw-formel--gut' : ''}`}>
        {teile.length ? teile.join(' + ') : '0'} = <strong>{wert}</strong>
        {nibbles && (
          <>
            {' '}
            = hex{' '}
            <strong>
              {wert
                .toString(16)
                .toUpperCase()
                .padStart(bits / 4, '0')}
            </strong>
          </>
        )}
      </p>
    </div>
  );
}

// Stellenwertverfahren zum Mitklicken: von links nach rechts „Passt der Stellenwert in den Rest?“
export function stellenwertSchritte(wert, bits = 8) {
  let rest = wert;
  return stellenwerte(bits).map((g) => {
    const passt = rest >= g;
    const vorher = rest;
    if (passt) rest -= g;
    return { gewicht: g, vorher, passt, nachher: rest, bit: passt ? 1 : 0 };
  });
}

export function Umrechner({ wert, bits = 8 }) {
  const alleOffen = useContext(AlleOffen);
  const [gezeigt, setGezeigt] = useState(alleOffen ? bits : 0);
  useEffect(() => setGezeigt(alleOffen ? bits : 0), [wert]);
  const schritte = stellenwertSchritte(wert, bits);
  const fertig = gezeigt >= bits;
  const letzter = gezeigt > 0 ? schritte[gezeigt - 1] : null;
  return (
    <div class="zl-umrechner">
      <div class="zl-tafel" style={bits !== 8 ? { gridTemplateColumns: `repeat(${bits}, minmax(0, 1fr))` } : null}>
        {schritte.map((s, j) => {
          const offen = j < gezeigt;
          return (
            <div key={j} class={`zl-tafel__spalte ${!fertig && j === gezeigt ? 'zl-tafel__spalte--jetzt' : ''}`}>
              <span class={`zl-tafel__wert mono ${offen && s.bit ? 'zl-tafel__wert--an' : ''}`}>{s.gewicht}</span>
              <span class={`zl-tafel__bit mono ${offen ? (s.bit ? 'zl-tafel__bit--an' : '') : 'zl-tafel__bit--frage'}`}>{offen ? s.bit : '?'}</span>
            </div>
          );
        })}
      </div>
      <div class="zl-umrechner__zeile">
        <span class="zl-rest">
          <span class="zl-rest__name">Noch übrig</span>
          <strong class="mono">{letzter ? letzter.nachher : wert}</strong>
        </span>
        <p class="zl-umrechner__text" role="status">
          {!letzter ? (
            <>
              Start bei <strong>{wert}</strong>. Erste Frage: Passt <strong>{schritte[0].gewicht}</strong> in {wert}?
            </>
          ) : letzter.passt ? (
            <>
              Passt {letzter.gewicht} in {letzter.vorher}? <strong>Ja → 1.</strong> Abziehen: {letzter.vorher} − {letzter.gewicht} = {letzter.nachher}
            </>
          ) : (
            <>
              Passt {letzter.gewicht} in {letzter.vorher}? <strong>Nein → 0.</strong> Der Rest bleibt {letzter.vorher}.
            </>
          )}
          {fertig && (
            <>
              {' '}
              Fertig:{' '}
              <strong class="mono">
                {wert} = {schritte.map((s) => s.bit).join('')}
              </strong>
            </>
          )}
        </p>
      </div>
      {!fertig && (
        <div class="lw-knoepfe">
          <Knopf variante="zweit" groesse="s" iconRechts="arrow-right" onClick={() => setGezeigt(gezeigt + 1)}>
            {gezeigt === 0 ? 'Erstes Bit' : 'Nächstes Bit'}
          </Knopf>
          <Knopf variante="geist" groesse="s" onClick={() => setGezeigt(bits)}>
            Alle auf einmal
          </Knopf>
        </div>
      )}
    </div>
  );
}

// Restwertverfahren: fortlaufend durch die Basis teilen. → [{ zahl, quotient, rest }]
export function restwertSchritte(wert, basis = 2) {
  if (wert === 0) return [{ zahl: 0, quotient: 0, rest: 0 }];
  const schritte = [];
  for (let x = wert; x > 0; x = Math.floor(x / basis)) schritte.push({ zahl: x, quotient: Math.floor(x / basis), rest: x % basis });
  return schritte;
}

// Restwertverfahren zum Mitklicken: Tabelle Zeile für Zeile, am Ende Pfeil „von unten nach oben lesen“
export function Restwert({ wert, basis = 2 }) {
  const alleOffen = useContext(AlleOffen);
  const schritte = restwertSchritte(wert, basis);
  const [gezeigt, setGezeigt] = useState(alleOffen ? schritte.length : 1);
  useEffect(() => setGezeigt(alleOffen ? schritte.length : 1), [wert, basis]);
  const fertig = gezeigt >= schritte.length;
  const ziffer = (r) => HEX[r];
  const ergebnis = schritte
    .map((s) => ziffer(s.rest))
    .reverse()
    .join('');
  return (
    <div class="zl-restwert">
      <div class="zl-restwert__tabelle">
        <ol class="zl-restwert__liste">
          {schritte.slice(0, gezeigt).map((s, i) => (
            <li key={i} class="zl-restwert__zeile erscheinen">
              <span class="mono">
                {s.zahl} ÷ {basis} = {s.quotient}
              </span>
              <span class="zl-restwert__rest mono">
                Rest <strong>{ziffer(s.rest)}</strong>
                {basis === 16 && s.rest > 9 && <span class="zl-restwert__klein"> ({s.rest})</span>}
              </span>
            </li>
          ))}
        </ol>
        {fertig && (
          <span class="zl-restwert__pfeil" aria-hidden="true">
            <svg viewBox="0 0 16 100" preserveAspectRatio="none">
              <path d="M8 96 V6" />
              <path d="M3 12 L8 4 L13 12" />
            </svg>
            <span>von unten nach oben lesen</span>
          </span>
        )}
      </div>
      {fertig ? (
        <p class="lw-formel mono lw-formel--gut">
          {wert} = <strong>{basis === 2 ? gruppiert(ergebnis) : ergebnis}</strong>
          {basis !== 10 && <sub>{basis}</sub>}
        </p>
      ) : (
        <div class="lw-knoepfe">
          <Knopf variante="zweit" groesse="s" iconRechts="arrow-down" onClick={() => setGezeigt(gezeigt + 1)}>
            Weiter teilen: {schritte[gezeigt - 1].quotient} ÷ {basis}
          </Knopf>
          <Knopf variante="geist" groesse="s" onClick={() => setGezeigt(schritte.length)}>
            Alle Schritte
          </Knopf>
        </div>
      )}
    </div>
  );
}

// Stellenwerte als Kette, die sich je Stelle vervielfachen (← · basis)
export function Verdopplung({ werte, faktor = 2 }) {
  return (
    <div class="zl-verdopplung mono" aria-label={`Stellenwerte, jeweils mal ${faktor}`}>
      {werte.map((g, i) => (
        <span key={g} class="zl-verdopplung__glied">
          <span class="zl-verdopplung__wert">{tausend(g)}</span>
          {i < werte.length - 1 && <span class="zl-verdopplung__mal">←·{faktor}</span>}
        </span>
      ))}
    </div>
  );
}

// Die 16 Hex-Ziffern mit Binärwert (4 Bit) und Dezimalwert
export function HexTafel() {
  return (
    <div class="zl-hextafel">
      {Array.from({ length: 16 }, (_, i) => (
        <span key={i} class={`zl-hextafel__zelle ${i >= 10 ? 'zl-hextafel__zelle--buchstabe' : ''}`}>
          <strong class="mono">{HEX[i]}</strong>
          <span class="mono">{binaer(i, 4)}</span>
          <span>= {i}</span>
        </span>
      ))}
    </div>
  );
}

// Binärzahl in Vierergruppen und je Gruppe die Hex-Ziffer
export function Nibbles({ wert, breite = null }) {
  const bin = binaer(wert, breite ?? Math.max(4, Math.ceil(wert.toString(2).length / 4) * 4));
  const gruppen = bin.match(/.{4}/g);
  return (
    <div class="zl-nibbles">
      {gruppen.map((g, i) => (
        <span key={i} class="zl-nibbles__haelfte">
          <span class="mono">{g}</span>
          <strong class="mono">{HEX[parseInt(g, 2)]}</strong>
        </span>
      ))}
      <span class="zl-nibbles__gleich mono">= {wert.toString(16).toUpperCase()}</span>
    </div>
  );
}

// Rechenweg als nummerierte Zeilen. zeilen: [{ text, wert?, ton? }] – wert wird rechts fett gezeigt.
export function Rechenweg({ zeilen, titel }) {
  return (
    <div class="zl-weg">
      {titel && <span class="zl-weg__titel">{titel}</span>}
      <ol class="zl-weg__liste">
        {zeilen.map((z, i) => (
          <li key={i} class={`zl-weg__zeile ${z.ton ? `zl-weg__zeile--${z.ton}` : ''}`}>
            <span class="zl-weg__nr mono">{i + 1}</span>
            <span class="zl-weg__text">{z.text}</span>
            {z.wert !== undefined && <strong class="zl-weg__wert mono">{z.wert}</strong>}
          </li>
        ))}
      </ol>
    </div>
  );
}

// Einheiten-Treppe: Stufen mit Umrechnungsfaktor dazwischen. stufen: ['Bit', 'Byte', 'KiB', …], faktoren: [8, 1024, …]
export function Treppe({ stufen, faktoren, aktiv = [] }) {
  return (
    <div class="zl-treppe" role="img" aria-label={`Einheiten: ${stufen.join(', ')}`}>
      {stufen.map((s, i) => (
        <div key={s} class={`zl-treppe__stufe ${aktiv.includes(s) ? 'zl-treppe__stufe--aktiv' : ''}`} style={{ '--stufe': i }}>
          <strong class="mono">{s}</strong>
          {i < faktoren.length && (
            <span class="zl-treppe__faktor mono">
              <span>÷ {tausend(faktoren[i])} →</span>
              <span>← · {tausend(faktoren[i])}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// Zahlenfeld mit Beschriftung und Einheit; onWert bekommt die gelesene Zahl (oder null)
export function ZahlFeld({ label, wert, onWert, einheit, min = 0, max = null, schritt = 'any', breit = false }) {
  return (
    <label class={`lw-feld ${breit ? 'lw-feld--breit' : ''}`}>
      <span class="lw-feld__name">{label}</span>
      <span class="zl-zahlfeld">
        <input
          class="feld feld--mono lw-feld__eingabe zl-zahlfeld__eingabe"
          type="number"
          inputMode="decimal"
          value={wert}
          min={min}
          max={max ?? undefined}
          step={schritt}
          onInput={(e) => {
            const v = e.currentTarget.valueAsNumber;
            onWert(Number.isFinite(v) ? v : null);
          }}
        />
        {einheit && <span class="zl-zahlfeld__einheit">{einheit}</span>}
      </span>
    </label>
  );
}

// Auswahl als Knopfreihe
export function Wahl({ label, optionen, wert, onWert }) {
  return (
    <div class="lw-feld">
      <span class="lw-feld__name">{label}</span>
      <div class="lw-beispiele" role="group" aria-label={label}>
        {optionen.map((o) => {
          const w = typeof o === 'object' ? o.wert : o;
          return (
            <button key={String(w)} type="button" class={`lw-chip mono ${w === wert ? 'lw-chip--aktiv' : ''}`} aria-pressed={w === wert} onClick={() => onWert(w)}>
              {typeof o === 'object' ? o.text : o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
