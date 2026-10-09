// Bausteine der Subnetz-Lektionen (Bitband, Bit-Tafel, Maskenrechnung, Zahlenstrahl mit Lupe, Geräte, Adressen …).
// Allgemeine Bausteine (Schritte, Zwischenfragen, Text, Werkbank, Konsole) kommen aus lernweg/bausteine.jsx.
// Farben überall gleich: Netz grün (Akzent), Host blau, Grenze orange, reserviert rot.

import { Fragment } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Icon } from '../../../../ui/bausteine.jsx';
import { ipZuZahl, maskeZahl, netzBitsJeOktett, maskenwert, STELLENWERTE, leseIp, ipFehler } from '../ip.js';

// Allgemeine Bausteine aus dem Lernweg-Rahmen – hier weitergereicht, damit inhalt/ nur eine Quelle importiert
export { AlleOffen, Schritte, Raten, Absatz, Fakten, Fakt, Formel, Hinweis, Beispiele, Ergebnis, Werkbank, Konsole, Grundlage } from '../../lernweg/bausteine.jsx';

export const bitsVon = (zahl) => Array.from({ length: 32 }, (_, i) => (zahl >>> (31 - i)) & 1);
export const oktetteVon = (zahl) => [24, 16, 8, 0].map((s) => (zahl >>> s) & 255);
export const tausend = (n) => n.toLocaleString('de-DE');
export const bin8 = (wert) => wert.toString(2).padStart(8, '0');

// Farbiger Text in den festen Farben
export const Netz = ({ children }) => <span class="sn-f-netz">{children}</span>;
export const Host = ({ children }) => <span class="sn-f-host">{children}</span>;
export const Res = ({ children }) => <span class="sn-f-res">{children}</span>;
export const Grenze = ({ children }) => <span class="sn-f-grenze">{children}</span>;

export function Legende({ teile = ['netz', 'host', 'grenze'] }) {
  const namen = { netz: 'Netzanteil', host: 'Hostanteil', grenze: 'Grenze Netz | Host', res: 'reserviert (Netzadresse, Broadcast)' };
  return (
    <div class="sn-legende" aria-label="Farben">
      {teile.map((t) => (
        <span key={t}>
          <i class={`sn-legende__farbe sn-legende__farbe--${t}`} /> {namen[t]}
        </span>
      ))}
    </div>
  );
}

// „Für dich“ (Punkt-Dezimal) und „Für den Computer“ (32 Bit am Stück)
export function ZweiSichten({ ip }) {
  return (
    <div class="sn-zwei">
      <span class="sn-zwei__name">Für dich</span>
      <span class="sn-zwei__wert sn-zwei__wert--dez mono">{ip}</span>
      <span class="sn-zwei__name">Für den Computer</span>
      <span class="sn-zwei__wert sn-zwei__wert--bin mono">{bitsVon(ipZuZahl(ip)).join('')}</span>
    </div>
  );
}

// Eine Anschrift aus zwei Teilen (Netzanteil grün, Hostanteil blau)
export function Anschrift({ netz, host, trenner = '.', netzName = 'Netzanteil', hostName = 'Hostanteil' }) {
  return (
    <span class="sn-anschrift mono">
      <span class="sn-anschrift__teil sn-anschrift__teil--netz">
        <span class="sn-anschrift__wert">{netz}</span>
        <span class="sn-anschrift__name">{netzName}</span>
      </span>
      <span class="sn-anschrift__trenner">{trenner}</span>
      <span class="sn-anschrift__teil sn-anschrift__teil--host">
        <span class="sn-anschrift__wert">{host}</span>
        <span class="sn-anschrift__name">{hostName}</span>
      </span>
    </span>
  );
}

// ---------- Bits ----------

// Die 32 Bits einer Adresse in vier Oktetten (schmal: zwei je Zeile). Ohne Präfix neutral; mit Präfix
// Netzbits grün, Hostbits blau und die Grenze orange hinter Bit `praefix`.
// dezimal: Zahl über jedem Oktett · klammer: Klammer zwischen Zahl und Bits · nummern: Bitnummer 1 … 32
// unter: Text je Oktett · onBit(i): Bit i (0 … 31) umschalten
export function Bitband({ zahl, praefix = null, dezimal = true, klammer = false, nummern = false, unter = null, onBit = null }) {
  const b = bitsVon(zahl);
  const okt = oktetteVon(zahl);
  return (
    <div class="sn-band">
      {[0, 1, 2, 3].map((o) => {
        const grenzeVorn = praefix !== null && o > 0 && praefix === o * 8;
        return (
          <div key={o} class={`sn-band__oktett ${grenzeVorn ? 'sn-band__oktett--grenze' : ''}`}>
            {dezimal && <span class="sn-band__dez mono">{okt[o]}</span>}
            {klammer && <span class="sn-band__klammer" aria-hidden="true" />}
            <span class="sn-band__bits">
              {b.slice(o * 8, o * 8 + 8).map((bit, j) => {
                const i = o * 8 + j;
                const art = praefix === null ? 'neutral' : i < praefix ? 'netz' : 'host';
                const klasse = `sn-bit sn-bit--${art} ${praefix !== null && j > 0 && i === praefix ? 'sn-bit--grenze' : ''}`;
                return onBit ? (
                  <button key={j} type="button" class={`${klasse} sn-bit--knopf`} onClick={() => onBit(i)} aria-label={`Bit ${i + 1} umschalten`}>
                    {bit}
                  </button>
                ) : (
                  <i key={j} class={klasse}>
                    {bit}
                  </i>
                );
              })}
            </span>
            {nummern && (
              <span class="sn-band__nummern mono" aria-hidden="true">
                {Array.from({ length: 8 }, (_, j) => {
                  const nr = o * 8 + j + 1;
                  return (
                    <span key={j} class={praefix === null ? '' : nr === praefix ? 'sn-band__nr--grenze' : nr <= praefix ? 'sn-band__nr--netz' : 'sn-band__nr--host'}>
                      {nr}
                    </span>
                  );
                })}
              </span>
            )}
            {unter && <span class="sn-band__unter">{unter[o]}</span>}
          </div>
        );
      })}
    </div>
  );
}

// Die 8 Bits eines Oktetts, mit Grenze nach `netzBits` (null = neutral)
export function OktettBits({ wert, netzBits = null, hostArt = 'host' }) {
  return (
    <span class="sn-okbits">
      {Array.from({ length: 8 }, (_, j) => (
        <i
          key={j}
          class={`sn-bit sn-bit--${netzBits === null ? 'neutral' : j < netzBits ? 'netz' : hostArt} ${netzBits !== null && j > 0 && j === netzBits ? 'sn-bit--grenze' : ''}`}
        >
          {(wert >> (7 - j)) & 1}
        </i>
      ))}
    </span>
  );
}

// ---------- Subnetzmaske ----------

// Rechnung je Oktett: Einsen und Nullen, Summe der Stellenwerte, Wert
export function MaskenRechnung({ praefix }) {
  const k = netzBitsJeOktett(praefix);
  return (
    <div class="sn-mrechnung" aria-label="Subnetzmaske Oktett für Oktett">
      {k.map((einsen, o) => (
        <div key={o} class={`sn-mrechnung__zeile ${einsen > 0 && einsen < 8 ? 'sn-mrechnung__zeile--grenze' : ''}`}>
          <span class="sn-mrechnung__name">{o + 1}. Oktett</span>
          <span class="sn-mrechnung__bits mono">
            <span class="sn-f-netz">{'1'.repeat(einsen)}</span>
            <span class="sn-f-host">{'0'.repeat(8 - einsen)}</span>
          </span>
          <span class="sn-mrechnung__summe mono">
            → {einsen ? STELLENWERTE.slice(0, einsen).join(' + ') : 'keine Eins'} = <strong>{maskenwert(einsen)}</strong>
          </span>
        </div>
      ))}
      <div class="sn-mrechnung__ergebnis mono">
        /{praefix} entspricht <strong>{k.map(maskenwert).join('.')}</strong>
      </div>
    </div>
  );
}

// Die neun möglichen Werte eines Masken-Oktetts, der mit `aktiv` Einsen hervorgehoben
export function MaskenWerte({ aktiv = null }) {
  return (
    <div class="sn-masken">
      <span class="sn-masken__titel">Nur diese neun Werte kann ein Oktett der Subnetzmaske haben – von links kommt immer der nächste Stellenwert dazu:</span>
      <div class="sn-masken__reihe">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} class={`sn-masken__zelle ${n === aktiv ? 'sn-masken__zelle--aktiv' : ''}`}>
            <span class="sn-masken__einsen">{n === 1 ? '1 Eins' : `${n} Einsen`}</span>
            <span class="sn-masken__wert mono">{maskenwert(n)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Zahlenstrahl mit Lupe ----------

// Zahlenstrahl 0 … 255 eines Oktetts, in Blöcke der Größe `block` geschnitten. werte: markierte Zahlen
// (die erste bekommt die Lupe), aktiv: hervorgehobene Blockanfänge. Darunter eine Lupe auf den Block mit der
// ersten Zahl und seine Nachbarn; Rahmen und Trichter zeigen den vergrößerten Abschnitt. Bei Blöcken bis 4
// steht jede Zahl einzeln da.
const NACHBAR = { '-2': '2 Blöcke davor', '-1': 'Block davor', 1: 'Block danach', 2: '2 Blöcke danach' };

export function Zahlenstrahl({ block, werte = [], aktiv = [], lupe = true, beschriftung = null }) {
  const anzahl = 256 / block;
  const jede = Math.max(1, anzahl / 8);
  const wert = werte[0] ?? null;
  const mitte = wert === null ? 0 : Math.floor(wert / block);
  const erster = Math.max(0, Math.min(mitte - 1, anzahl - 3));
  const fenster = Array.from({ length: Math.min(3, anzahl) }, (_, i) => erster + i);
  const von = fenster[0] * block;
  const bis = (fenster[fenster.length - 1] + 1) * block - 1;
  const prozent = (x) => (x / 256) * 100;
  const mitLupe = lupe && anzahl > 1 && wert !== null;
  return (
    <div class="sn-strahl">
      <div role="img" aria-label={`Zahlen 0 bis 255, geschnitten in ${anzahl} ${anzahl === 1 ? 'Block' : 'Blöcke'} zu je ${block}`}>
        {werte.length > 0 && (
          <div class="sn-strahl__nadelbahn">
            {werte.map((w, i) => (
              <span key={i} class={`sn-nadel ${i ? 'sn-nadel--zwei' : ''}`} style={{ left: `${((w + 0.5) / 256) * 100}%` }}>
                <span class="sn-nadel__text mono">{beschriftung?.[i] ?? w}</span>
              </span>
            ))}
          </div>
        )}
        <div class={`sn-strahl__leiste ${anzahl > 32 ? 'sn-strahl__leiste--dicht' : ''}`}>
          {Array.from({ length: anzahl }, (_, nr) => (
            <span key={nr} class={`sn-seg ${nr % 2 ? 'sn-seg--zwei' : ''} ${aktiv.includes(nr * block) ? 'sn-seg--aktiv' : ''}`}>
              {anzahl <= 4 && (
                <span class="sn-seg__bereich mono">
                  {nr * block}–{nr * block + block - 1}
                </span>
              )}
            </span>
          ))}
          {mitLupe && <span class="sn-strahl__rahmen" style={{ left: `${prozent(von)}%`, width: `${prozent(bis - von + 1)}%` }} aria-hidden="true" />}
        </div>
        <div class="sn-strahl__skala mono" aria-hidden="true">
          {Array.from({ length: anzahl / jede }, (_, i) => i * jede * block).map((start) => (
            <span key={start} class={`sn-strahl__zahl ${start === 0 ? 'sn-strahl__zahl--null' : ''}`} style={{ left: `${prozent(start)}%` }}>
              {start}
            </span>
          ))}
          <span class="sn-strahl__zahl sn-strahl__zahl--ende">255</span>
        </div>
      </div>
      {mitLupe && (
        <>
          <svg class="sn-trichter" viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
            <polygon points={`${prozent(von)},0 ${prozent(bis + 1)},0 100,24 0,24`} class="sn-trichter__flaeche" />
            <line x1={prozent(von)} y1="0" x2="0" y2="24" class="sn-trichter__linie" vector-effect="non-scaling-stroke" />
            <line x1={prozent(bis + 1)} y1="0" x2="100" y2="24" class="sn-trichter__linie" vector-effect="non-scaling-stroke" />
          </svg>
          <div class="sn-lupe" aria-label={`Lupe: Ausschnitt ${von} bis ${bis}`}>
            <span class="sn-lupe__titel">
              <Icon name="search" groesse={13} /> Lupe auf {von}–{bis}
            </span>
            <div class="sn-lupe__bloecke">
              {fenster.map((nr) => {
                const start = nr * block;
                const ende = start + block - 1;
                const hier = werte.filter((w) => w >= start && w <= ende);
                return (
                  <div key={nr} class={`sn-lupe__block ${aktiv.includes(start) ? 'sn-lupe__block--aktiv' : ''}`}>
                    <div class="sn-lupe__balken">
                      {block <= 4
                        ? Array.from({ length: block }, (_, i) => (
                            <span key={i} class={`sn-lupe__zelle mono ${hier.includes(start + i) ? 'sn-lupe__zelle--wert' : ''}`}>
                              {start + i}
                            </span>
                          ))
                        : hier.map((w) => (
                            <span key={w} class={`sn-lupe__nadel ${w !== wert ? 'sn-lupe__nadel--zwei' : ''}`} style={{ left: `${((w - start + 0.5) / block) * 100}%` }}>
                              <span class="mono">{w}</span>
                            </span>
                          ))}
                    </div>
                    <div class="sn-lupe__zahlen mono">
                      <span>{start}</span>
                      <span>{ende}</span>
                    </div>
                    <span class="sn-lupe__name">{nr === mitte ? `Block mit der ${wert}` : NACHBAR[nr - mitte]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------- Eingaben ----------

// Präfix wählen: − / + und Schieberegler
export function PraefixWahl({ praefix, setPraefix, min = 8, max = 30, label = 'Präfix' }) {
  const setze = (p) => setPraefix(Math.max(min, Math.min(max, p)));
  return (
    <div class="sn-pwahl">
      <span class="lw-feld__name">{label}</span>
      <div class="sn-pwahl__reihe">
        <button type="button" class="sn-pwahl__knopf" onClick={() => setze(praefix - 1)} disabled={praefix <= min} aria-label="Präfix kleiner">
          −
        </button>
        <strong class="sn-pwahl__wert mono">/{praefix}</strong>
        <button type="button" class="sn-pwahl__knopf" onClick={() => setze(praefix + 1)} disabled={praefix >= max} aria-label="Präfix größer">
          +
        </button>
        <input type="range" class="sn-pwahl__regler" min={min} max={max} value={praefix} onInput={(e) => setze(Number(e.currentTarget.value))} aria-label={label} />
      </div>
    </div>
  );
}

// IPv4-Adresse eingeben. onIp bekommt nur gültige Adressen; ungültige Eingaben werden erklärt.
export function IpFeld({ ip, onIp, label = 'IP-Adresse', breit = false }) {
  const [text, setText] = useState(ip);
  useEffect(() => {
    if (leseIp(text) !== ip) setText(ip);
  }, [ip]);
  const fehler = ipFehler(text);
  return (
    <label class={`lw-feld ${breit ? 'lw-feld--breit' : ''}`}>
      <span class="lw-feld__name">{label}</span>
      <input
        class={`feld feld--mono lw-feld__eingabe ${fehler ? 'feld--falsch' : ''}`}
        value={text}
        spellcheck={false}
        autoComplete="off"
        inputMode="decimal"
        onInput={(e) => {
          const t = e.currentTarget.value;
          setText(t);
          const g = leseIp(t);
          if (g) onIp(g);
        }}
      />
      {fehler && <span class="lw-feld__fehler">{fehler}</span>}
    </label>
  );
}

// Adresse mit Rollen je Oktett einfärben: 'netz' | 'rechnen' | 'host'
export function IpZellen({ ip, rollen }) {
  return (
    <span class="sn-ip mono">
      {ip.split('.').map((o, i) => (
        <Fragment key={i}>
          {i > 0 && <span class="sn-ip__punkt">.</span>}
          <span class={`sn-ip__teil sn-ip__teil--${rollen[i]}`}>{o}</span>
        </Fragment>
      ))}
    </span>
  );
}

// Maske als Zahl → Oktette (für Anzeigen)
export const maskeOktette = (praefix) => oktetteVon(maskeZahl(praefix));

// ---------- Bilder ----------

// Ein Gerät mit Symbol, Name und Adresse
export function Geraet({ icon = 'monitor', name, ip, ton = '', klein = false, children }) {
  return (
    <div class={`sn-geraet ${ton ? `sn-geraet--${ton}` : ''} ${klein ? 'sn-geraet--klein' : ''}`}>
      <span class="sn-geraet__symbol">
        <Icon name={icon} groesse={klein ? 18 : 22} />
      </span>
      <span class="sn-geraet__name">{name}</span>
      {ip && <span class="sn-geraet__ip mono">{ip}</span>}
      {children}
    </div>
  );
}

// Netzadresse/Broadcast zusammenbauen: Adresse mit Rollen je Oktett und Rezept in Worten
export function Zusammenbau({ titel, ip, rollen, rezept }) {
  return (
    <div class="sn-bau">
      {titel && <span class="sn-bau__titel">{titel}</span>}
      <IpZellen ip={ip} rollen={rollen} />
      {rezept && <span class="sn-bau__rezept">{rezept}</span>}
    </div>
  );
}

// Lupe auf eine Blockgrenze: die letzten zwei Zahlen eines Blocks, die Wand, die ersten zwei des nächsten
export function Grenzlupe({ start, ende }) {
  const naechster = ende + 1;
  return (
    <div class="sn-grenzlupe">
      <div class="sn-grenzlupe__zellen">
        {[ende - 1, ende]
          .filter((x) => x >= start)
          .map((x) => (
            <span key={x} class={`sn-grenzlupe__zelle mono ${x === ende ? 'sn-grenzlupe__zelle--ende' : 'sn-grenzlupe__zelle--dein'}`}>
              {x}
            </span>
          ))}
        <span class="sn-grenzlupe__wand" aria-hidden="true" />
        {naechster <= 255 ? (
          [naechster, naechster + 1]
            .filter((x) => x <= 255)
            .map((x) => (
              <span key={x} class={`sn-grenzlupe__zelle mono ${x === naechster ? 'sn-grenzlupe__zelle--anfang' : ''}`}>
                {x}
              </span>
            ))
        ) : (
          <span class="sn-grenzlupe__zelle sn-grenzlupe__zelle--leer">Ende des Oktetts</span>
        )}
      </div>
      <div class="sn-grenzlupe__legende">
        <span>
          ← Block {start}–{ende}
        </span>
        {naechster <= 255 && <span>nächster Block ab {naechster} →</span>}
      </div>
    </div>
  );
}
