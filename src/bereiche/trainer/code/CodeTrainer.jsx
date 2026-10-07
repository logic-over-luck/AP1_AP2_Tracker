// Pseudocode-Trainer: Grundlagen, Visualizer, Schreibtischtest, Puzzle, Fehlersuche, Sortieren.

import { useCallback, useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { TrainerSeite, Uebung, Tabelle } from '../rahmen/Uebung.jsx';
import { Icon, Knopf, SymbolKnopf, Rich, Kbd } from '../../../ui/bausteine.jsx';
import { fuehreAus, formatiere, hervorheben } from './pseudo.js';
import { ERZEUGER, imRaum } from './aufgaben.js';
import { PROGRAMME } from './programme.js';
import { GRUNDLAGEN } from './grundlagen.js';

const SPICKZETTEL = {
  schreibtisch: '- Startwerte in die erste Zeile, dann Zeile für Zeile\n- BIS ist einschließlich\n- DIV: ganzzahlig, MOD: Rest\n- Listen als 1, 2, 3 eintragen; Kommazahlen mit Komma oder Punkt',
  puzzle: '- Erst Startwerte, dann Schleife, dann Ausgabe\n- Jeder Block braucht sein Ende (ENDE WENN, ENDE FÜR …)\n- Gleichwertige Reihenfolgen zählen auch',
  fehler: '- Soll: was die Beschreibung verlangt\n- Ist: was der Code wirklich liefert\n- Wo beides abweicht, steckt der Fehler\n- Typisch: Grenze ±1 (> statt >=), falscher Startwert, vertauschter Vergleich',
  sortieren: '- Bubble: Nachbarn tauschen, Größtes wandert nach hinten\n- Selection: Minimum suchen, nach vorn tauschen\n- Insertion: einfügen in den sortierten Teil\n- Binäre Suche: Mitte = (links + rechts) DIV 2',
};

export function CodeTrainer({ raum, trainer, modi, params }) {
  return (
    <TrainerSeite raum={raum} trainer={trainer} modi={modi} modus={params.modus}>
      {(m) => {
        if (m.id === 'grundlagen') return <Grundlagen raum={raum} />;
        if (m.id === 'visualizer') return <Visualizer raum={raum} start={params.programm} />;
        return <CUebung key={m.id} raum={raum} modus={m} />;
      }}
    </TrainerSeite>
  );
}

function CUebung({ raum, modus }) {
  const erzeuge = useCallback((rng) => ERZEUGER[modus.id](rng, raum), [modus.id, raum]);
  const ansicht = { schreibtisch: SchreibtischBild, puzzle: PuzzleBild, fehler: FehlerBild }[modus.id];
  return <Uebung erzeuge={erzeuge} trainerId="code" modusId={modus.id} spIds={modus.sp} spickzettel={SPICKZETTEL[modus.id]} ansicht={ansicht} />;
}

// ---------- Code-Anzeige mit Zeilennummern und Hervorhebung ----------

export function CodeBlock({ code, aktiv, markiere = [], fehler, klickbar, onZeile, gewaehlt }) {
  const zeilen = code.split('\n');
  return (
    <pre class="codeblock" aria-label="Pseudocode">
      {zeilen.map((z, i) => {
        const nr = i + 1;
        const Tag = klickbar ? 'button' : 'div';
        return (
          <Tag
            key={i}
            type={klickbar ? 'button' : undefined}
            class={`codezeile ${aktiv === nr ? 'codezeile--aktiv' : ''} ${markiere.includes(nr) ? 'codezeile--markiert' : ''} ${fehler === nr ? 'codezeile--fehler' : ''} ${gewaehlt === nr ? 'codezeile--gewaehlt' : ''}`}
            onClick={klickbar ? () => onZeile(nr) : undefined}
          >
            <span class="codezeile__nr">{nr}</span>
            <span class="codezeile__text">
              {hervorheben(z).map((t, j) => (
                <span key={j} class={`hl-${t.art}`}>
                  {t.text}
                </span>
              ))}
              {z === '' ? ' ' : null}
            </span>
          </Tag>
        );
      })}
    </pre>
  );
}

// ---------- Grundlagen ----------

function Grundlagen({ raum }) {
  const karten = GRUNDLAGEN.filter((g) => g.raum.includes(raum));
  return (
    <div class="grundlagen">
      <div class="flaeche flaeche--gross grundlagen__kopf">
        <div class="marke marke--akzent">{raum} · Prüfungsstandard</div>
        <h2>Pseudocode verstehen – Logik und Schreibtischtests</h2>
        <p class="text-2">
          In der Prüfung geht es nicht um die Syntax einer bestimmten Programmiersprache, sondern um den Ablauf: Pseudocode muss für Dritte lesbar sein,
          Kontrollstrukturen werden durch Einrücken sichtbar, kleine Syntaxfehler werden toleriert.
        </p>
      </div>
      <div class="grundlagen__raster">
        {karten.map((k, i) => (
          <section key={k.titel} class="flaeche flaeche--gross gkarte">
            <h3 class="gkarte__titel">
              <span class="gkarte__nr">{i + 1}</span>
              {k.titel}
            </h3>
            <div class="gkarte__text">
              <Rich text={k.text} />
            </div>
            {k.code && <CodeBlock code={k.code} />}
            {k.liste && <Rich text={k.liste.map((l) => `- ${l}`).join('\n')} class="gkarte__liste" />}
            {k.hinweis && (
              <p class="gkarte__hinweis">
                <Icon name="info" groesse={14} /> {k.hinweis}
              </p>
            )}
            {k.code && !k.nurLesen && (
              <a class="gkarte__link" href={`#/${raum.toLowerCase()}/trainer/code?modus=visualizer&programm=g${i}`} onClick={() => sessionStorage.setItem('lernstudio.vis', k.code)}>
                <Icon name="play" groesse={13} /> Im Visualizer ausführen
              </a>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

// ---------- Visualizer ----------

const EREIGNIS_TEXT = {
  start: () => 'Programm startet',
  nach: (s) => `Zeile ${s.zeile} ausgeführt`,
  bedingung: (s) => `Bedingung in Zeile ${s.zeile} ist ${s.ergebnis ? 'WAHR' : 'FALSCH'}`,
  schleife: (s) => `Schleife in Zeile ${s.zeile}: neuer Durchlauf`,
  iterationsende: (s) => `Durchlauf der Schleife in Zeile ${s.zeile} beendet`,
  aufruf: (s) => `Funktion ${s.funktion} aufgerufen`,
  ende: () => 'Programm beendet',
};

function startCode(raum, programmId) {
  let gespeichert = null;
  try {
    gespeichert = sessionStorage.getItem('lernstudio.vis');
    sessionStorage.removeItem('lernstudio.vis');
  } catch {}
  if (gespeichert) return gespeichert;
  const p = PROGRAMME.find((x) => x.id === programmId) ?? imRaum(PROGRAMME, raum)[0];
  return mitStartwerten(p);
}

function mitStartwerten(p) {
  const vorne = Object.entries(p.beispiel)
    .map(([k, v]) => `${k} = ${Array.isArray(v) ? `[${v.join(', ')}]` : typeof v === 'boolean' ? (v ? 'WAHR' : 'FALSCH') : typeof v === 'string' ? `"${v}"` : v}`)
    .join('\n');
  return `// Startwerte\n${vorne}\n\n${p.code}`;
}

function Visualizer({ raum, start }) {
  const [code, setCode] = useState(() => startCode(raum, start));
  const [bearbeiten, setBearbeiten] = useState(false);
  const [pos, setPos] = useState(0);
  const [laeuft, setLaeuft] = useState(false);
  const [tempo, setTempo] = useState(700);

  const lauf = useMemo(() => {
    try {
      return fuehreAus(code, { maxSchritte: 5000 });
    } catch (e) {
      return { schritte: [], ausgabe: [], fehler: e };
    }
  }, [code]);
  const schritte = useMemo(() => lauf.schritte.filter((s) => s.ereignis !== 'vor'), [lauf]);
  const s = schritte[Math.min(pos, schritte.length - 1)];
  const vorher = schritte[Math.max(0, pos - 1)];
  const amEnde = pos >= schritte.length - 1;

  useEffect(() => setPos(0), [code]);
  useEffect(() => {
    if (!laeuft) return;
    if (amEnde) {
      setLaeuft(false);
      return;
    }
    const t = setTimeout(() => setPos((p) => p + 1), tempo);
    return () => clearTimeout(t);
  }, [laeuft, pos, amEnde, tempo]);

  useEffect(() => {
    const taste = (e) => {
      if (bearbeiten || e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowRight') setPos((p) => Math.min(p + 1, schritte.length - 1));
      if (e.key === 'ArrowLeft') setPos((p) => Math.max(p - 1, 0));
    };
    window.addEventListener('keydown', taste);
    return () => window.removeEventListener('keydown', taste);
  }, [bearbeiten, schritte.length]);

  const vars = s ? { ...(s.global ?? {}), ...s.vars } : {};
  const varsVorher = vorher ? { ...(vorher.global ?? {}), ...vorher.vars } : {};

  return (
    <div class="vis">
      <div class="vis__leiste">
        <select
          class="feld vis__auswahl"
          aria-label="Beispielprogramm"
          onChange={(e) => {
            const p = PROGRAMME.find((x) => x.id === e.currentTarget.value);
            if (p) setCode(mitStartwerten(p));
            setBearbeiten(false);
          }}
        >
          <option value="">Beispiel wählen …</option>
          {imRaum(PROGRAMME, raum).map((p) => (
            <option key={p.id} value={p.id}>
              {p.titel}
            </option>
          ))}
        </select>
        <Knopf groesse="s" variante={bearbeiten ? 'primaer' : 'zweit'} icon={bearbeiten ? 'check' : 'pencil'} onClick={() => setBearbeiten(!bearbeiten)}>
          {bearbeiten ? 'Fertig' : 'Code bearbeiten'}
        </Knopf>
      </div>

      <div class="vis__raster">
        <div class="flaeche vis__code">
          {bearbeiten ? (
            <textarea class="feld feld--mono vis__editor" value={code} spellcheck={false} onInput={(e) => setCode(e.currentTarget.value)} aria-label="Pseudocode bearbeiten" />
          ) : (
            <CodeBlock code={code} aktiv={s?.zeile} fehler={lauf.fehler?.zeile} />
          )}
          <div class="vis__steuerung">
            <SymbolKnopf icon="skip-back" label="Zum Anfang" onClick={() => setPos(0)} disabled={pos === 0} />
            <SymbolKnopf icon="step-back" label="Schritt zurück (←)" onClick={() => setPos(Math.max(0, pos - 1))} disabled={pos === 0} />
            <button class="vis__abspielen" aria-label={laeuft ? 'Anhalten' : 'Abspielen'} onClick={() => (amEnde ? (setPos(0), setLaeuft(true)) : setLaeuft(!laeuft))} disabled={!schritte.length}>
              <Icon name={laeuft ? 'pause' : 'play'} groesse={18} />
            </button>
            <SymbolKnopf icon="step-forward" label="Schritt vor (→)" onClick={() => setPos(Math.min(schritte.length - 1, pos + 1))} disabled={amEnde} />
            <span class="vis__zaehler tabellenziffern">
              {schritte.length ? pos + 1 : 0} / {schritte.length}
            </span>
            <label class="vis__tempo">
              Tempo
              <input type="range" min="150" max="1500" step="50" value={1650 - tempo} onInput={(e) => setTempo(1650 - Number(e.currentTarget.value))} />
            </label>
          </div>
        </div>
        <div class="stapel stapel--4">
          <div class="flaeche flaeche--innen vis__ereignis" aria-live="polite">
            <div class="ueberschrift-klein">Was passiert</div>
            <div class="vis__ereignis-text">{s ? EREIGNIS_TEXT[s.ereignis]?.(s) ?? '' : '–'}</div>
            {s?.ebene > 0 && <div class="gedaempft">in Funktion {s.funktion}</div>}
          </div>
          <div class="flaeche flaeche--innen">
            <div class="ueberschrift-klein">Variablen</div>
            {Object.keys(vars).length === 0 ? (
              <p class="gedaempft vis__leer">Noch keine Variablen.</p>
            ) : (
              <table class="vis__vars">
                <tbody>
                  {Object.entries(vars).map(([k, v]) => {
                    const neu = formatiere(varsVorher[k]) !== formatiere(v) || !(k in varsVorher);
                    return (
                      <tr key={k} class={neu && pos > 0 ? 'vis__var--neu' : ''}>
                        <td class="mono">{k}</td>
                        <td class="mono">{typeof v === 'string' ? `"${v}"` : formatiere(v)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div class="flaeche flaeche--innen">
            <div class="ueberschrift-klein">Ausgabe</div>
            <pre class="vis__ausgabe">{(s?.ausgabe ?? []).join('\n') || ' '}</pre>
          </div>
          {lauf.fehler && (
            <div class="flaeche flaeche--innen vis__fehler" role="alert">
              <Icon name="triangle-alert" groesse={16} /> {lauf.fehler.message}
            </div>
          )}
        </div>
      </div>
      <p class="gedaempft vis__tipp">
        Tipp: <Kbd>←</Kbd> <Kbd>→</Kbd> gehen Schritt für Schritt. Mit „Code bearbeiten" kannst du eigenen Pseudocode schreiben und ausführen.
      </p>
    </div>
  );
}

// ---------- Schreibtischtest: Code + Tabelle zum Ausfüllen ----------

function SchreibtischBild({ aufgabe, eingaben, setze, ergebnis, loesung }) {
  const feld = (i, j) => {
    const id = `z${i}s${j}`;
    const r = ergebnis?.[id];
    const soll = aufgabe.zeilen[i][j];
    return (
      <input
        class={`feld feld--mono tt__feld ${r ? (r.ok ? 'feld--richtig' : 'feld--falsch') : ''}`}
        value={loesung && !r?.ok ? formatiere(soll) : (eingaben[id] ?? '')}
        readOnly={loesung && !r?.ok}
        placeholder="?"
        aria-label={`Zeile ${i + 1}, ${aufgabe.spalten[j]}`}
        onInput={(e) => setze(id, e.currentTarget.value)}
      />
    );
  };
  return (
    <div class="stapel stapel--4">
      <CodeBlock code={aufgabe.code} markiere={aufgabe.markiere} />
      <div class="ueberschrift-klein">Trace-Tabelle</div>
      <div class="atabelle-huelle">
        <table class="atabelle tt">
          <thead>
            <tr>
              <th>Schritt</th>
              {aufgabe.spalten.map((s) => (
                <th key={s} class="mono">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {aufgabe.zeilen.map((z, i) => (
              <tr key={i}>
                <td class="mono gedaempft">{i + 1}</td>
                {z.map((_, j) => (
                  <td key={j}>{feld(i, j)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------- Code-Puzzle ----------

function PuzzleBild({ aufgabe, eingaben, setze, ergebnis }) {
  const ordnung = eingaben.ordnung ?? aufgabe.puzzle.start;
  const zeilen = aufgabe.puzzle.zeilen;
  const [ziehen, setZiehen] = useState(null);
  const r = ergebnis?.ordnung;
  const verschiebe = (von, nach) => {
    if (nach < 0 || nach >= ordnung.length) return;
    const n = [...ordnung];
    const [x] = n.splice(von, 1);
    n.splice(nach, 0, x);
    setze('ordnung', n);
  };
  return (
    <div class={`puzzle ${r ? (r.ok ? 'puzzle--richtig' : 'puzzle--falsch') : ''}`}>
      <ol class="puzzle__liste">
        {ordnung.map((idx, pos) => (
          <li
            key={idx}
            class={`puzzle__zeile ${ziehen === pos ? 'puzzle__zeile--zieht' : ''}`}
            draggable
            onDragStart={() => setZiehen(pos)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (ziehen !== null) verschiebe(ziehen, pos);
              setZiehen(null);
            }}
            onDragEnd={() => setZiehen(null)}
          >
            <Icon name="grip-vertical" groesse={14} class="puzzle__griff" />
            <span class="codezeile__nr">{pos + 1}</span>
            <code class="puzzle__code">
              {hervorheben(zeilen[idx]).map((t, j) => (
                <span key={j} class={`hl-${t.art}`}>
                  {t.text}
                </span>
              ))}
            </code>
            <span class="puzzle__knoepfe">
              <SymbolKnopf icon="chevron-up" label="Nach oben" groesse="s" onClick={() => verschiebe(pos, pos - 1)} disabled={pos === 0} />
              <SymbolKnopf icon="chevron-down" label="Nach unten" groesse="s" onClick={() => verschiebe(pos, pos + 1)} disabled={pos === ordnung.length - 1} />
            </span>
          </li>
        ))}
      </ol>
      {r && !r.ok && <p class="text-fehler puzzle__meldung">Das Programm verhält sich so noch nicht wie verlangt.{r.grund ? ` (${r.grund})` : ''}</p>}
      <p class="gedaempft puzzle__tipp">Ziehen mit der Maus oder mit den Pfeil-Knöpfen verschieben.</p>
    </div>
  );
}

// ---------- Fehlersuche ----------

function FehlerBild({ aufgabe, eingaben, setze, ergebnis, loesung }) {
  const f = (id) => {
    const r = ergebnis?.[id];
    const feld = aufgabe.felder.find((x) => x.id === id);
    return (
      <input
        class={`feld feld--mono tt__feld ${r ? (r.ok ? 'feld--richtig' : 'feld--falsch') : ''}`}
        value={loesung && !r?.ok ? feld.soll : (eingaben[id] ?? '')}
        readOnly={loesung && !r?.ok}
        placeholder="?"
        onInput={(e) => setze(id, e.currentTarget.value)}
      />
    );
  };
  const zeile = Number(eingaben.zeile) || null;
  return (
    <div class="stapel stapel--4">
      <CodeBlock code={aufgabe.code} klickbar onZeile={(nr) => setze('zeile', String(nr))} gewaehlt={zeile} fehler={loesung ? aufgabe.felder.find((x) => x.id === 'zeile')?.erwartet * 1 : null} />
      <p class="gedaempft">
        {aufgabe.tests
          ? 'Soll: was laut Aufgabe herauskommen müsste. Ist: was der Code wirklich liefert, wenn du ihn durchspielst. Die fehlerhafte Zeile kannst du direkt im Code anklicken.'
          : 'Tipp: Klicke auf eine Zeile, um sie als fehlerhaft auszuwählen.'}
      </p>
      {aufgabe.tests && (
        <div class="atabelle-huelle">
          <table class="atabelle tt">
            <thead>
              <tr>
                <th>Aufruf</th>
                <th>Soll (laut Aufgabe)</th>
                <th>Ist (was der Code liefert)</th>
              </tr>
            </thead>
            <tbody>
              {aufgabe.tests.map((t, i) => (
                <tr key={i}>
                  <td class="mono">{t.aufruf}</td>
                  <td>{f(`soll${i}`)}</td>
                  <td>{f(`ist${i}`)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export { Tabelle, useRef };
