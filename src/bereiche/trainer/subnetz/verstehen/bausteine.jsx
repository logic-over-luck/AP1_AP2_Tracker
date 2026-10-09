// Gemeinsame Bausteine der Lektionen. Teils aus dem früheren Verstehen-Raum herausgelöst (Bitband, Bit-Tafel,
// Maskenrechnung, Zahlenstrahl mit Lupe, „für dich / für den Computer“, Faktenboxen), teils neu.
// Farben überall gleich: Netz grün (Akzent), Host blau, Grenze orange, reserviert rot.

import { Fragment, createContext } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../../ui/bausteine.jsx';
import { ipZuZahl, maskeZahl, netzBitsJeOktett, maskenwert, STELLENWERTE, leseIp, ipFehler } from '../ip.js';

export const bitsVon = (zahl) => Array.from({ length: 32 }, (_, i) => (zahl >>> (31 - i)) & 1);
export const oktetteVon = (zahl) => [24, 16, 8, 0].map((s) => (zahl >>> s) & 255);
export const tausend = (n) => n.toLocaleString('de-DE');
export const bin8 = (wert) => wert.toString(2).padStart(8, '0');

// ---------- Schritte und Zwischenfragen ----------

// true: Alle Schritte gleich offen und Zwischenfragen gelöst (z. B. wenn die Lektion schon verstanden ist)
export const AlleOffen = createContext(false);

// Eine Erklärung in Schritten: Jeder Schritt hat Titel und Inhalt; „Weiter“ deckt den nächsten auf.
export function Schritte({ schritte }) {
  const alleOffen = useContext(AlleOffen);
  const [gezeigt, setGezeigt] = useState(alleOffen ? schritte.length : 1);
  const letzter = useRef(null);
  const zeige = (n) => {
    setGezeigt(n);
    setTimeout(() => letzter.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
  };
  const naechster = schritte[gezeigt];
  return (
    <div class="sn-schritte">
      <ol class="sn-schritte__liste">
        {schritte.slice(0, gezeigt).map((s, i) => (
          <li key={i} class="sn-schritt erscheinen" ref={i === gezeigt - 1 ? letzter : null}>
            <span class="sn-schritt__nr mono">{i + 1}</span>
            <div class="sn-schritt__inhalt">
              <h4 class="sn-schritt__titel">{s.titel}</h4>
              {s.inhalt}
            </div>
          </li>
        ))}
      </ol>
      {naechster && (
        <div class="sn-schritte__weiter">
          <Knopf variante="akzent" groesse="s" iconRechts="arrow-down" onClick={() => zeige(gezeigt + 1)}>
            Weiter: {naechster.titel}
          </Knopf>
          <span class="sn-schritte__stand mono">
            Schritt {gezeigt} von {schritte.length}
          </span>
          <button type="button" class="sn-link sn-schritte__alle" onClick={() => zeige(schritte.length)}>
            alle zeigen
          </button>
        </div>
      )}
    </div>
  );
}

// Zwischenfrage in einer Erklärung: erst selbst überlegen. Falsche Antworten bleiben durchgestrichen und bekommen
// einen Hinweis (hinweis(v)); „Zeig’s mir“ löst auf. Nach der Lösung erscheint children.
export function Raten({ frage, optionen, richtig, hinweis, format = (v) => v, children }) {
  const alleOffen = useContext(AlleOffen);
  const [falsch, setFalsch] = useState([]);
  const [ok, setOk] = useState(alleOffen);
  const letzterFalsch = falsch[falsch.length - 1];
  return (
    <div class={`sn-raten ${ok ? 'sn-raten--ok' : ''}`}>
      <span class="sn-raten__frage">
        <Icon name="circle-question-mark" groesse={15} /> {frage}
      </span>
      <div class="sn-raten__optionen" role="group" aria-label={frage}>
        {optionen.map((o) => {
          const istFalsch = falsch.includes(o);
          const istRichtig = ok && o === richtig;
          return (
            <button
              key={String(o)}
              type="button"
              class={`sn-option sn-option--klein mono ${istFalsch ? 'sn-option--falsch' : ''} ${istRichtig ? 'sn-option--richtig' : ''}`}
              disabled={ok || istFalsch}
              onClick={() => (o === richtig ? setOk(true) : setFalsch([...falsch, o]))}
            >
              {format(o)}
            </button>
          );
        })}
        {!ok && falsch.length > 0 && (
          <button type="button" class="sn-link" onClick={() => setOk(true)}>
            Zeig’s mir
          </button>
        )}
      </div>
      {!ok && letzterFalsch !== undefined && hinweis && (
        <p class="sn-raten__hinweis" role="status">
          <Icon name="lightbulb" groesse={14} /> {hinweis(letzterFalsch)}
        </p>
      )}
      {ok && <div class="sn-raten__danach erscheinen">{children}</div>}
    </div>
  );
}

// ---------- Text-Bausteine ----------

export function Absatz({ children }) {
  return <p class="sn-text">{children}</p>;
}

export function Fakten({ children }) {
  return <div class="sn-fakten">{children}</div>;
}

export function Fakt({ titel, icon, children }) {
  return (
    <div class="sn-fakt">
      <span class="sn-fakt__titel">
        {icon && <Icon name={icon} groesse={14} />}
        {titel}
      </span>
      <span>{children}</span>
    </div>
  );
}

export function Formel({ children }) {
  return <p class="sn-formel mono">{children}</p>;
}

export function Hinweis({ icon = 'info', ton = '', children }) {
  return (
    <p class={`sn-hinweis ${ton ? `sn-hinweis--${ton}` : ''}`} role={ton ? 'status' : undefined}>
      <Icon name={icon} groesse={16} />
      <span>{children}</span>
    </p>
  );
}

// Farbiger Text in den festen Farben
export const Netz = ({ children }) => <span class="sn-f-netz">{children}</span>;
export const Host = ({ children }) => <span class="sn-f-host">{children}</span>;
export const Res = ({ children }) => <span class="sn-f-res">{children}</span>;
export const Grenze = ({ children }) => <span class="sn-f-grenze">{children}</span>;

export function Legende({ teile = ['netz', 'host', 'grenze'] }) {
  const namen = { netz: 'Netzanteil', host: 'Hostanteil', grenze: 'Grenze', res: 'reserviert (Netzadresse, Broadcast)' };
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
        <i key={j} class={`sn-bit sn-bit--${netzBits === null ? 'neutral' : j < netzBits ? 'netz' : hostArt} ${netzBits !== null && j > 0 && j === netzBits ? 'sn-bit--grenze' : ''}`}>
          {(wert >> (7 - j)) & 1}
        </i>
      ))}
    </span>
  );
}

// Bit-Tafel: 8 Schalter mit Stellenwerten darüber, Summe darunter. nibbles: Hexadezimalziffer je 4 Bit zeigen.
export function BitTafel({ wert, onWert, nibbles = false, ziel = null }) {
  const bits = Array.from({ length: 8 }, (_, j) => (wert >> (7 - j)) & 1);
  const teile = STELLENWERTE.filter((_, j) => bits[j]);
  return (
    <div class="sn-tafel-huelle">
      <div class={`sn-tafel ${nibbles ? 'sn-tafel--nibbles' : ''}`}>
        {bits.map((bit, j) => (
          <div key={j} class="sn-tafel__spalte">
            <span class={`sn-tafel__wert mono ${bit ? 'sn-tafel__wert--an' : ''}`}>{STELLENWERTE[j]}</span>
            <button
              type="button"
              class={`sn-tafel__bit mono ${bit ? 'sn-tafel__bit--an' : ''}`}
              aria-pressed={!!bit}
              aria-label={`Bit mit Stellenwert ${STELLENWERTE[j]} umschalten`}
              onClick={() => onWert(wert ^ (1 << (7 - j)))}
            >
              {bit}
            </button>
          </div>
        ))}
      </div>
      {nibbles && (
        <div class="sn-tafel__hex">
          <span>
            <span class="mono">{bits.slice(0, 4).join('')}</span> = {wert >> 4} = <strong class="mono">{(wert >> 4).toString(16).toUpperCase()}</strong>
          </span>
          <span>
            <span class="mono">{bits.slice(4).join('')}</span> = {wert & 15} = <strong class="mono">{(wert & 15).toString(16).toUpperCase()}</strong>
          </span>
        </div>
      )}
      <p class={`sn-formel mono ${ziel !== null && wert === ziel ? 'sn-formel--gut' : ''}`}>
        {teile.length ? teile.join(' + ') : '0'} = <strong>{wert}</strong>
        {nibbles && (
          <>
            {' '}
            = hex <strong>{wert.toString(16).toUpperCase().padStart(2, '0')}</strong>
          </>
        )}
      </p>
    </div>
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
      <span class="sn-feld__name">{label}</span>
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
    <label class={`sn-feld ${breit ? 'sn-feld--breit' : ''}`}>
      <span class="sn-feld__name">{label}</span>
      <input
        class={`feld feld--mono sn-feld__eingabe ${fehler ? 'feld--falsch' : ''}`}
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
      {fehler && <span class="sn-feld__fehler">{fehler}</span>}
    </label>
  );
}

// Beispiel-Knöpfe
export function Beispiele({ titel = 'Beispiele:', liste, aktiv, onWahl }) {
  return (
    <div class="sn-beispiele" role="group" aria-label={titel}>
      <span class="sn-beispiele__titel">{titel}</span>
      {liste.map((b) => {
        const wert = typeof b === 'object' ? b.wert : b;
        return (
          <button key={wert} type="button" class={`sn-chip mono ${wert === aktiv ? 'sn-chip--aktiv' : ''}`} aria-pressed={wert === aktiv} onClick={() => onWahl(wert)}>
            {typeof b === 'object' ? b.text : b}
          </button>
        );
      })}
    </div>
  );
}

// Ergebnis-Liste: [{ name, wert, ton? ('netz' | 'host' | 'res' | 'gut' | 'fehler'), info? }]
export function Ergebnis({ zeilen }) {
  return (
    <dl class="sn-ergebnis">
      {zeilen.map((z) => (
        <div key={z.name} class={`sn-ergebnis__zeile ${z.ton ? `sn-ergebnis__zeile--${z.ton}` : ''}`}>
          <dt>{z.name}</dt>
          <dd class="mono">{z.wert}</dd>
          {z.info && <span class="sn-ergebnis__info">{z.info}</span>}
        </div>
      ))}
    </dl>
  );
}

// Eine Werkzeug-Fläche fürs Ausprobieren
export function Werkbank({ children, leiste }) {
  return (
    <div class="sn-werkbank">
      {leiste && <div class="sn-werkbank__leiste">{leiste}</div>}
      <div class="sn-werkbank__inhalt">{children}</div>
    </div>
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

// Konsolen-Ausgabe (z. B. ipconfig, arp -a). zeilen: Text oder { text, hervor: true }
export function Konsole({ titel, zeilen }) {
  return (
    <div class="sn-konsole">
      {titel && <span class="sn-konsole__titel mono">{titel}</span>}
      <pre class="sn-konsole__text mono">
        {zeilen.map((z, i) => (
          <span key={i} class={typeof z === 'object' && z.hervor ? 'sn-konsole__hervor' : ''}>
            {typeof z === 'object' ? z.text : z}
            {'\n'}
          </span>
        ))}
      </pre>
    </div>
  );
}

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

// Stellenwert-Tafel ohne Schalter: werte (z. B. [100, 10, 1]), ziffern, Summe als Text
export function Stellen({ werte, ziffern, summe, an = null }) {
  return (
    <div class="sn-stellen">
      {werte.map((g, j) => {
        const leuchtet = an ? an[j] : Number(ziffern[j]) > 0;
        return (
          <span key={j} class={`sn-stellen__spalte ${leuchtet ? 'sn-stellen__spalte--an' : ''}`}>
            <span class="sn-stellen__wert mono">{g}</span>
            <span class="sn-stellen__bit mono">{ziffern[j]}</span>
          </span>
        );
      })}
      {summe && <span class="sn-stellen__summe mono">{summe}</span>}
    </div>
  );
}

// Dezimal → binär zum Mitklicken: von links nach rechts „Passt der Stellenwert in den Rest?“
export function Umrechner({ wert }) {
  const alleOffen = useContext(AlleOffen);
  const [gezeigt, setGezeigt] = useState(alleOffen ? 8 : 0);
  useEffect(() => setGezeigt(alleOffen ? 8 : 0), [wert]);
  const schritte = binaerSchritteLokal(wert);
  const fertig = gezeigt >= 8;
  const letzter = gezeigt > 0 ? schritte[gezeigt - 1] : null;
  return (
    <div class="sn-umrechner">
      <div class="sn-tafel">
        {schritte.map((s, j) => {
          const offen = j < gezeigt;
          return (
            <div key={j} class={`sn-tafel__spalte ${!fertig && j === gezeigt ? 'sn-tafel__spalte--jetzt' : ''}`}>
              <span class={`sn-tafel__wert mono ${offen && s.bit ? 'sn-tafel__wert--an' : ''}`}>{s.gewicht}</span>
              <span class={`sn-tafel__bit mono ${offen ? (s.bit ? 'sn-tafel__bit--an' : '') : 'sn-tafel__bit--frage'}`}>{offen ? s.bit : '?'}</span>
            </div>
          );
        })}
      </div>
      <div class="sn-umrechner__zeile">
        <span class="sn-rest">
          <span class="sn-rest__name">Noch übrig</span>
          <strong class="mono">{letzter ? letzter.nachher : wert}</strong>
        </span>
        <p class="sn-umrechner__text" role="status">
          {!letzter ? (
            <>
              Start bei <strong>{wert}</strong>. Erste Frage: Passt <strong>128</strong> in {wert}?
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
              Fertig: <strong class="mono">{wert} = {schritte.map((s) => s.bit).join('')}</strong>
            </>
          )}
        </p>
      </div>
      {!fertig && (
        <div class="sn-knoepfe">
          <Knopf variante="zweit" groesse="s" iconRechts="arrow-right" onClick={() => setGezeigt(gezeigt + 1)}>
            {gezeigt === 0 ? 'Erstes Bit' : 'Nächstes Bit'}
          </Knopf>
          <Knopf variante="geist" groesse="s" onClick={() => setGezeigt(8)}>
            Alle auf einmal
          </Knopf>
        </div>
      )}
    </div>
  );
}

function binaerSchritteLokal(wert) {
  let rest = wert;
  return STELLENWERTE.map((g) => {
    const passt = rest >= g;
    const vorher = rest;
    if (passt) rest -= g;
    return { gewicht: g, vorher, passt, nachher: rest, bit: passt ? 1 : 0 };
  });
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
