// Allgemeine Bausteine für Lektionen (alle Trainer mit Lernweg): Schritte, Zwischenfragen, Text, Werkbank, Ergebnis,
// Konsole sowie Verweise auf Grundlagen in anderen Trainern. Klassen-Präfix lw- (styles/lernweg.css).

import { createContext } from 'preact';
import { useContext, useRef, useState } from 'preact/hooks';
import { Icon, Knopf } from '../../../ui/bausteine.jsx';
import { link } from '../../../router.js';
import { trainerById } from '../verzeichnis.js';
import { kursVon } from './kurse.js';
import { useVerstanden } from './fortschritt.js';
import { leseVerweis } from './lernweg.js';

// Lernraum der offenen Seite (für Links in andere Trainer)
export const LernwegKontext = createContext({ raum: 'AP1' });

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
    <div class="lw-schritte">
      <ol class="lw-schritte__liste">
        {schritte.slice(0, gezeigt).map((s, i) => (
          <li key={i} class="lw-schritt erscheinen" ref={i === gezeigt - 1 ? letzter : null}>
            <span class="lw-schritt__nr mono">{i + 1}</span>
            <div class="lw-schritt__inhalt">
              <h4 class="lw-schritt__titel">{s.titel}</h4>
              {s.inhalt}
            </div>
          </li>
        ))}
      </ol>
      {naechster && (
        <div class="lw-schritte__weiter">
          <Knopf variante="akzent" groesse="s" iconRechts="arrow-down" onClick={() => zeige(gezeigt + 1)}>
            Weiter: {naechster.titel}
          </Knopf>
          <span class="lw-schritte__stand mono">
            Schritt {gezeigt} von {schritte.length}
          </span>
          <button type="button" class="lw-link lw-schritte__alle" onClick={() => zeige(schritte.length)}>
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
  // Kurze Werte (Zahlen, Adressen) in Monospace, Sätze in normaler Schrift
  const mono = optionen.every((o) => String(format(o)).length <= 16);
  return (
    <div class={`lw-raten ${ok ? 'lw-raten--ok' : ''}`}>
      <span class="lw-raten__frage">
        <Icon name="circle-question-mark" groesse={15} /> {frage}
      </span>
      <div class="lw-raten__optionen" role="group" aria-label={frage}>
        {optionen.map((o) => {
          const istFalsch = falsch.includes(o);
          const istRichtig = ok && o === richtig;
          return (
            <button
              key={String(o)}
              type="button"
              class={`lw-option lw-option--klein ${mono ? 'mono' : ''} ${istFalsch ? 'lw-option--falsch' : ''} ${istRichtig ? 'lw-option--richtig' : ''}`}
              disabled={ok || istFalsch}
              onClick={() => (o === richtig ? setOk(true) : setFalsch([...falsch, o]))}
            >
              {format(o)}
            </button>
          );
        })}
        {!ok && falsch.length > 0 && (
          <button type="button" class="lw-link" onClick={() => setOk(true)}>
            Zeig’s mir
          </button>
        )}
      </div>
      {!ok && letzterFalsch !== undefined && hinweis && (
        <p class="lw-raten__hinweis" role="status">
          <Icon name="lightbulb" groesse={14} /> {hinweis(letzterFalsch)}
        </p>
      )}
      {ok && <div class="lw-raten__danach erscheinen">{children}</div>}
    </div>
  );
}

export function Absatz({ children }) {
  return <p class="lw-text">{children}</p>;
}

export function Fakten({ children }) {
  return <div class="lw-fakten">{children}</div>;
}

export function Fakt({ titel, icon, children }) {
  return (
    <div class="lw-fakt">
      <span class="lw-fakt__titel">
        {icon && <Icon name={icon} groesse={14} />}
        {titel}
      </span>
      <span>{children}</span>
    </div>
  );
}

export function Formel({ children }) {
  return <p class="lw-formel mono">{children}</p>;
}

export function Hinweis({ icon = 'info', ton = '', children }) {
  return (
    <p class={`lw-hinweis ${ton ? `lw-hinweis--${ton}` : ''}`} role={ton ? 'status' : undefined}>
      <Icon name={icon} groesse={16} />
      <span>{children}</span>
    </p>
  );
}

// Beispiel-Knöpfe
export function Beispiele({ titel = 'Beispiele:', liste, aktiv, onWahl }) {
  return (
    <div class="lw-beispiele" role="group" aria-label={titel}>
      <span class="lw-beispiele__titel">{titel}</span>
      {liste.map((b) => {
        const wert = typeof b === 'object' ? b.wert : b;
        return (
          <button key={wert} type="button" class={`lw-chip mono ${wert === aktiv ? 'lw-chip--aktiv' : ''}`} aria-pressed={wert === aktiv} onClick={() => onWahl(wert)}>
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
    <dl class="lw-ergebnis">
      {zeilen.map((z) => (
        <div key={z.name} class={`lw-ergebnis__zeile ${z.ton ? `lw-ergebnis__zeile--${z.ton}` : ''}`}>
          <dt>{z.name}</dt>
          <dd class="mono">{z.wert}</dd>
          {z.info && <span class="lw-ergebnis__info">{z.info}</span>}
        </div>
      ))}
    </dl>
  );
}

// Eine Werkzeug-Fläche fürs Ausprobieren
export function Werkbank({ children, leiste }) {
  return (
    <div class="lw-werkbank">
      {leiste && <div class="lw-werkbank__leiste">{leiste}</div>}
      <div class="lw-werkbank__inhalt">{children}</div>
    </div>
  );
}

// Konsolen-Ausgabe (z. B. ipconfig, arp -a). zeilen: Text oder { text, hervor: true }
export function Konsole({ titel, zeilen }) {
  return (
    <div class="lw-konsole">
      {titel && <span class="lw-konsole__titel mono">{titel}</span>}
      <pre class="lw-konsole__text mono">
        {zeilen.map((z, i) => (
          <span key={i} class={typeof z === 'object' && z.hervor ? 'lw-konsole__hervor' : ''}>
            {typeof z === 'object' ? z.text : z}
            {'\n'}
          </span>
        ))}
      </pre>
    </div>
  );
}

// ---------- Verweise auf Grundlagen in anderen Trainern ----------

function useGrundlage(verweis) {
  const { raum } = useContext(LernwegKontext);
  const v = leseVerweis(verweis);
  const kurs = kursVon(v.trainer, raum);
  const l = kurs?.lektion(v.lektion);
  const ok = useVerstanden(kurs ?? { schluessel: '' }, v.lektion);
  if (!l) return null;
  return { l, ok, trainer: trainerById(v.trainer), href: link(raum, 'trainer', v.trainer, { modus: 'verstehen', lektion: v.lektion }) };
}

// Chip im Lektionskopf („Baut auf“): Lektion eines anderen Trainers, mit Haken, wenn dort verstanden
export function GrundlageChip({ verweis }) {
  const g = useGrundlage(verweis);
  if (!g) return null;
  return (
    <a class={`lw-baut__chip lw-baut__chip--extern ${g.ok ? 'lw-baut__chip--ok' : ''}`} href={g.href} title={`Lektion im Trainer „${g.trainer.name}“`}>
      <Icon name={g.ok ? 'circle-check' : 'external-link'} groesse={12} strich={2.2} />
      {g.trainer.kurz}: {g.l.begriff}
    </a>
  );
}

// Hinweis im Text: „<Frage> → Lektion im anderen Trainer“
export function Grundlage({ verweis, children }) {
  const g = useGrundlage(verweis);
  if (!g) return null;
  return (
    <p class="lw-grundlage">
      <Icon name="book-open" groesse={14} />
      <span>
        {children ?? `${g.l.begriff} unklar?`}{' '}
        <a class="lw-link" href={g.href}>
          {g.trainer.kurz}-Trainer: {g.l.begriff}
          {g.ok && ' ✓'}
        </a>
      </span>
    </p>
  );
}
