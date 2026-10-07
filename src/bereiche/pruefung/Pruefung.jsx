// Probeprüfung: Prüfung wählen (gemischt oder fest), unter Zeitdruck bearbeiten, danach bewerten
// (WiSo automatisch, sonst selbst mit Musterlösung und Punkteschema) und im Verlauf ablegen.
// Eine laufende Prüfung liegt in den Ansichts-Einstellungen und übersteht Neuladen und Tab-Wechsel.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { inhalt } from '../../daten/inhalt.js';
import { erfasse, useLernstand } from '../../lernstand/store.js';
import { einstellung, setzeEinstellung } from '../../lernstand/einstellungen.js';
import { link } from '../../router.js';
import { Icon, Knopf, Marke, Rich, Aufklapp, Leer } from '../../ui/bausteine.jsx';
import { Diagramm } from '../trainer/modellieren/diagramm.jsx';
import { TEILE, TEILE_IN_RAUM, stelleZusammen, auswerten, automatischePunkte, teilSchluessel, bewerteFrage, runde1, note } from './generator.js';
import { SAETZE } from './saetze/index.js';

const SCHLUESSEL = (raum) => `pruefung.laufend.${raum}`;
const zahl = (x) => String(runde1(x)).replace('.', ',');

export function PruefungBereich({ raum }) {
  const [laufend, setLaufendRoh] = useState(() => einstellung(SCHLUESSEL(raum), null));
  useEffect(() => setLaufendRoh(einstellung(SCHLUESSEL(raum), null)), [raum]);
  const setLaufend = (wert) => {
    setLaufendRoh(wert);
    setzeEinstellung(SCHLUESSEL(raum), wert);
  };
  const pruefung = useMemo(() => (laufend ? wiederherstellen(laufend) : null), [laufend?.id]);

  if (laufend && !pruefung) {
    return (
      <div class="flaeche">
        <Leer icon="triangle-alert" titel="Diese Probeprüfung gibt es nicht mehr" aktion={<Knopf onClick={() => setLaufend(null)}>Zurück zur Auswahl</Knopf>}>
          Die Aufgaben wurden mit einem Update geändert.
        </Leer>
      </div>
    );
  }
  if (laufend && pruefung) return <Durchgang raum={raum} zustand={laufend} pruefung={pruefung} setZustand={setLaufend} />;
  return <Auswahl raum={raum} starte={(p) => setLaufend(neuerZustand(p))} />;
}

// ---------- Zustand ----------

function neuerZustand(p) {
  return {
    id: `${p.teil}-${Date.now()}`,
    teil: p.teil,
    titel: p.titel,
    satz: p.satzId ?? null,
    ids: p.fragen ? p.fragen.map((x) => x.frage.id) : p.aufgaben.map((x) => x.aufgabe.id),
    start: Date.now(),
    pausiertSeit: null,
    pauseMs: 0,
    phase: 'schreiben', // schreiben → bewerten → fertig
    abgabe: null,
    antworten: {},
    punkte: {},
    ergebnis: null,
  };
}

// Prüfung aus den gemerkten IDs wieder aufbauen (unabhängig von späteren Änderungen am Zufall)
function wiederherstellen(z) {
  const saetze = SAETZE.filter((s) => s.teil === z.teil);
  if (z.teil === 'WISO') {
    const alle = new Map(saetze.flatMap((satz) => satz.fragen.map((frage) => [frage.id, { satz, frage }])));
    const fragen = z.ids.map((id) => alle.get(id));
    return fragen.every(Boolean) ? { teil: z.teil, titel: z.titel, satzId: z.satz, fragen } : null;
  }
  const alle = new Map(saetze.flatMap((satz) => satz.aufgaben.map((aufgabe) => [aufgabe.id, { satz, aufgabe }])));
  const aufgaben = z.ids.map((id) => alle.get(id));
  return aufgaben.every(Boolean) ? { teil: z.teil, titel: z.titel, satzId: z.satz, aufgaben } : null;
}

// ---------- Auswahl ----------

function Auswahl({ raum, starte }) {
  const stand = useLernstand();
  const r = inhalt.raeume.get(raum);
  const teile = TEILE_IN_RAUM[raum] ?? [];
  const verlauf = stand.pruefungen.filter((p) => teile.includes(p.teil)).reverse();
  return (
    <div class="pruefung">
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">{r.name} · Prüfen</div>
          <h1 class="seitenkopf__titel">Probeprüfung</h1>
          <p class="seitenkopf__text">Wie die echte Prüfung: gleicher Aufbau, gleiche Aufgabentypen, gleiche Zeit. Häufig geprüfte Themen kommen öfter dran.</p>
        </div>
      </header>
      {teile.map((id) => (
        <TeilKarte key={id} teil={TEILE[id]} stand={stand} starte={starte} />
      ))}
      {verlauf.length > 0 && <Verlauf liste={verlauf} />}
    </div>
  );
}

function TeilKarte({ teil, stand, starte }) {
  const saetze = SAETZE.filter((s) => s.teil === teil.id);
  const gemacht = new Map();
  for (const p of stand.pruefungen) if (p.satz) gemacht.set(p.satz, Math.max(gemacht.get(p.satz) ?? 0, (p.p / p.max) * 100));
  const umfang = teil.fragen ? `${teil.fragen} Aufgaben` : `${teil.aufgaben} Aufgaben · 100 Punkte`;
  const gemischt = () => starte(stelleZusammen(teil.id, SAETZE, { index: inhalt }));
  return (
    <section class="flaeche flaeche--gross pruefung-teil">
      <div class="pruefung-teil__kopf">
        <div class="wachsen">
          <h2 class="pruefung-teil__titel">{teil.name}</h2>
          <p class="gedaempft">
            <Icon name="timer" groesse={14} /> {teil.dauer} Minuten · {umfang}
          </p>
        </div>
        <Knopf variante="primaer" icon="shuffle" onClick={gemischt} disabled={!saetze.length}>
          Gemischte Prüfung starten
        </Knopf>
      </div>
      {saetze.length ? (
        <>
          <div class="ueberschrift-klein">Feste Probeprüfungen</div>
          <div class="pruefung-saetze">
            {saetze.map((s, i) => {
              const bester = gemacht.get(s.id);
              return (
                <button key={s.id} class="pruefung-satz" onClick={() => starte(stelleZusammen(teil.id, SAETZE, { satzId: s.id }))}>
                  <span class="pruefung-satz__nr">{i + 1}</span>
                  <span class="pruefung-satz__titel">{s.titel}</span>
                  {bester !== undefined && (
                    <Marke ton={bester >= 50 ? 'gut' : 'warn'} icon={bester >= 50 ? 'check' : 'rotate-ccw'}>
                      {Math.round(bester)} %
                    </Marke>
                  )}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <p class="gedaempft">Für diesen Teil gibt es noch keine Aufgaben.</p>
      )}
    </section>
  );
}

function Verlauf({ liste }) {
  return (
    <section class="flaeche flaeche--gross">
      <div class="ueberschrift-klein">Bisherige Probeprüfungen</div>
      <div class="atabelle-huelle">
        <table class="atabelle pruefung-verlauf">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Teil</th>
              <th>Prüfung</th>
              <th class="zahl">Punkte</th>
              <th>Note</th>
              <th class="zahl">Zeit</th>
            </tr>
          </thead>
          <tbody>
            {liste.map((p) => {
              const prozent = (p.p / p.max) * 100;
              const n = note(prozent);
              return (
                <tr key={p.t}>
                  <td>{new Date(p.t).toLocaleDateString('de-DE')}</td>
                  <td>{TEILE[p.teil]?.kurz ?? p.teil}</td>
                  <td>{p.titel}</td>
                  <td class="zahl">
                    {zahl(p.p)} / {zahl(p.max)}
                  </td>
                  <td>
                    <span class={`pruefung-note pruefung-note--${n.bestanden ? 'gut' : 'schlecht'}`}>
                      {n.note} · {n.name}
                    </span>
                  </td>
                  <td class="zahl">{p.dauer ? `${p.dauer} min` : '–'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ---------- Durchgang ----------

function Durchgang({ raum, zustand, pruefung, setZustand }) {
  const teil = TEILE[pruefung.teil];
  const [z, setZ] = useState(zustand);
  // Eingaben sofort im Zustand, gespeichert mit kurzer Verzögerung (nicht bei jedem Tastendruck)
  const merker = useRef(null);
  const aendere = (neu, sofort = false) => {
    setZ(neu);
    clearTimeout(merker.current);
    if (sofort) setZustand(neu);
    else merker.current = setTimeout(() => setZustand(neu), 400);
  };
  useEffect(() => () => clearTimeout(merker.current), []);

  const abbrechen = () => {
    if (confirm('Probeprüfung abbrechen? Deine Antworten gehen verloren.')) setZustand(null);
  };

  if (z.phase === 'fertig') return <Ergebnis raum={raum} z={z} pruefung={pruefung} schliessen={() => setZustand(null)} />;
  if (z.phase === 'bewerten') return <Bewerten z={z} pruefung={pruefung} aendere={aendere} abschliessen={(neu) => aendere(neu, true)} />;
  return <Schreiben teil={teil} z={z} pruefung={pruefung} aendere={aendere} abbrechen={abbrechen} />;
}

function verstrichen(z, jetzt = Date.now()) {
  const ende = z.abgabe ?? z.pausiertSeit ?? jetzt;
  return Math.max(0, ende - z.start - z.pauseMs);
}

function useJetzt(aktiv) {
  const [jetzt, setJetzt] = useState(Date.now());
  useEffect(() => {
    if (!aktiv) return;
    const i = setInterval(() => setJetzt(Date.now()), 1000);
    return () => clearInterval(i);
  }, [aktiv]);
  return jetzt;
}

function Uhr({ teil, z, aendere }) {
  const jetzt = useJetzt(!z.pausiertSeit);
  const rest = teil.dauer * 60000 - verstrichen(z, jetzt);
  const minuten = Math.floor(Math.abs(rest) / 60000);
  const sekunden = Math.floor((Math.abs(rest) % 60000) / 1000);
  const text = `${rest < 0 ? '+' : ''}${minuten}:${String(sekunden).padStart(2, '0')}`;
  const ton = rest < 0 ? 'vorbei' : rest < 10 * 60000 ? 'knapp' : 'normal';
  const pause = () => {
    if (z.pausiertSeit) aendere({ ...z, pauseMs: z.pauseMs + (Date.now() - z.pausiertSeit), pausiertSeit: null }, true);
    else aendere({ ...z, pausiertSeit: Date.now() }, true);
  };
  return (
    <div class={`pruefung-uhr pruefung-uhr--${ton}`} role="timer" aria-live="off">
      <Icon name="timer" groesse={16} />
      <span class="pruefung-uhr__zeit mono">{text}</span>
      <span class="pruefung-uhr__text">{rest < 0 ? 'über der Zeit' : z.pausiertSeit ? 'pausiert' : 'verbleibend'}</span>
      <button class="pruefung-uhr__knopf" onClick={pause} title={z.pausiertSeit ? 'Weiter' : 'Pause'} aria-label={z.pausiertSeit ? 'Weiter' : 'Pause'}>
        <Icon name={z.pausiertSeit ? 'play' : 'pause'} groesse={14} />
      </button>
    </div>
  );
}

function Schreiben({ teil, z, pruefung, aendere, abbrechen }) {
  const setAntwort = (k, wert) => aendere({ ...z, antworten: { ...z.antworten, [k]: wert } });
  const abgeben = () => {
    const offen = pruefung.fragen ? pruefung.fragen.filter(({ frage }) => leer(z.antworten[frage.id])).length : 0;
    if (!confirm(offen ? `Noch ${offen} Aufgaben ohne Antwort. Trotzdem abgeben?` : 'Prüfung abgeben? Danach kannst du nichts mehr ändern.')) return;
    const abgabe = Date.now();
    const neu = { ...z, abgabe: z.pausiertSeit ?? abgabe, pausiertSeit: null };
    if (pruefung.fragen) aendere({ ...neu, phase: 'fertig', ergebnis: speichere(neu, pruefung) }, true);
    else aendere({ ...neu, phase: 'bewerten', punkte: vorschlag(pruefung, z.antworten) }, true);
  };
  return (
    <div class="pruefung">
      <div class="pruefung-leiste">
        <div class="wachsen pruefung-leiste__titel">
          <span class="ueberschrift-klein ueberschrift-klein--akzent">{teil.kurz}</span>
          <span>{pruefung.titel}</span>
        </div>
        <Uhr teil={teil} z={z} aendere={aendere} />
        <Knopf variante="geist" icon="x" onClick={abbrechen}>
          Abbrechen
        </Knopf>
        <Knopf variante="primaer" icon="send" onClick={abgeben}>
          Abgeben
        </Knopf>
      </div>
      {z.pausiertSeit ? (
        <div class="flaeche pruefung-pause">
          <Leer icon="pause" titel="Pause" aktion={<Knopf variante="primaer" icon="play" onClick={() => aendere({ ...z, pauseMs: z.pauseMs + (Date.now() - z.pausiertSeit), pausiertSeit: null }, true)}>Weiter</Knopf>}>
            Die Zeit steht. In der echten Prüfung gibt es keine Pause.
          </Leer>
        </div>
      ) : pruefung.fragen ? (
        <WisoBogen pruefung={pruefung} antworten={z.antworten} setAntwort={setAntwort} />
      ) : (
        <Aufgabenheft pruefung={pruefung} antworten={z.antworten} setAntwort={setAntwort} />
      )}
    </div>
  );
}

const leer = (x) => x === undefined || x === null || x === '' || (Array.isArray(x) && !x.filter((y) => y !== undefined && y !== null && y !== '').length);

// ---------- Aufgabenheft (AP1, PB1, PB2) ----------

function Aufgabenheft({ pruefung, antworten, setAntwort }) {
  const gemischt = !pruefung.satzId;
  const satz = pruefung.aufgaben[0].satz;
  return (
    <>
      {!gemischt && (
        <section class="flaeche flaeche--gross pruefung-situation">
          <div class="ueberschrift-klein ueberschrift-klein--akzent">Ausgangssituation</div>
          <Bloecke liste={[satz.situation]} />
        </section>
      )}
      <nav class="pruefung-sprung" aria-label="Aufgaben">
        {pruefung.aufgaben.map(({ aufgabe }, i) => (
          <a key={aufgabe.id} href={`#aufgabe-${i + 1}`} class="pruefung-sprung__punkt" onClick={(e) => springe(e, `aufgabe-${i + 1}`)}>
            {i + 1}. Aufgabe <span class="gedaempft">({aufgabe.punkte} P)</span>
          </a>
        ))}
      </nav>
      {pruefung.aufgaben.map(({ satz, aufgabe }, i) => (
        <section key={aufgabe.id} id={`aufgabe-${i + 1}`} class="flaeche flaeche--gross pruefung-aufgabe">
          <div class="pruefung-aufgabe__kopf">
            <h2 class="wachsen">
              {i + 1}. Aufgabe <span class="gedaempft">· {aufgabe.titel}</span>
            </h2>
            <span class="sql-punkte">{aufgabe.punkte} Punkte</span>
          </div>
          {gemischt && (
            <div class="pruefung-firma">
              <div class="ueberschrift-klein">Situation: {satz.titel}</div>
              <Bloecke liste={[satz.situation]} />
            </div>
          )}
          {aufgabe.situation && <Bloecke liste={[aufgabe.situation]} />}
          {aufgabe.vorgaben && <Bloecke liste={aufgabe.vorgaben} />}
          {aufgabe.teile.map((t) => (
            <div key={t.nr} class="pruefung-teilaufgabe">
              <div class="pruefung-teilaufgabe__kopf">
                <span class="pruefung-teilaufgabe__nr">{t.nr})</span>
                <div class="wachsen">
                  <Rich text={t.text} />
                </div>
                <span class="pruefung-teilaufgabe__punkte">{zahl(t.punkte)} P</span>
              </div>
              {t.vorgaben && <Bloecke liste={t.vorgaben} />}
              <Antwortfeld teil={t} wert={antworten[teilSchluessel(aufgabe, t)]} setze={(w) => setAntwort(teilSchluessel(aufgabe, t), w)} />
            </div>
          ))}
        </section>
      ))}
    </>
  );
}

function springe(e, id) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Antwortfeld({ teil, wert, setze, nurLesen = false }) {
  const a = teil.antwort ?? { art: 'text' };
  switch (a.art) {
    case 'zahlen':
      return (
        <div class="pruefung-zahlen">
          {a.felder.map((f) => (
            <label key={f.id} class="pruefung-zahl">
              <span>{f.label}</span>
              <span class="pruefung-zahl__eingabe">
                <input class="feld" inputMode="decimal" value={wert?.[f.id] ?? ''} disabled={nurLesen} onInput={(e) => setze({ ...(wert ?? {}), [f.id]: e.currentTarget.value })} />
                {f.einheit && <span class="gedaempft">{f.einheit}</span>}
              </span>
            </label>
          ))}
        </div>
      );
    case 'auswahl':
      return (
        <div class="pruefung-optionen">
          {a.optionen.map((o, i) => {
            const an = a.mehrfach ? (wert ?? []).includes(i) : wert === i;
            const wechsel = () => (a.mehrfach ? setze(an ? (wert ?? []).filter((x) => x !== i) : [...(wert ?? []), i]) : setze(i));
            return (
              <label key={i} class={`pruefung-option ${an ? 'pruefung-option--an' : ''}`}>
                <input type={a.mehrfach ? 'checkbox' : 'radio'} checked={an} disabled={nurLesen} onChange={wechsel} />
                <span>
                  <Rich text={o} />
                </span>
              </label>
            );
          })}
        </div>
      );
    case 'tabelle':
      return (
        <div class="atabelle-huelle">
          <table class="atabelle pruefung-tabelle">
            <thead>
              <tr>
                {a.kopf.map((k, i) => (
                  <th key={i}>{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.zeilen.map((zeile, i) => (
                <tr key={i}>
                  {zeile.map((zelle, j) =>
                    zelle === null ? (
                      <td key={j} class="pruefung-tabelle__feld">
                        <textarea
                          class="feld"
                          rows={1}
                          value={wert?.[`${i}:${j}`] ?? ''}
                          disabled={nurLesen}
                          onInput={(e) => setze({ ...(wert ?? {}), [`${i}:${j}`]: e.currentTarget.value })}
                        />
                      </td>
                    ) : (
                      <td key={j}>
                        <Rich text={String(zelle)} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'papier':
      return (
        <div class="pruefung-papier">
          <p class="gedaempft">
            <Icon name="pencil" groesse={14} /> Zeichnen Sie auf Papier. Hier können Sie Notizen festhalten.
          </p>
          <textarea class="feld" rows={3} value={wert ?? ''} disabled={nurLesen} onInput={(e) => setze(e.currentTarget.value)} />
        </div>
      );
    case 'code':
      return (
        <div class="pruefung-code">
          {a.rahmen && <pre class="pruefung-code__rahmen mono">{a.rahmen}</pre>}
          <textarea
            class="feld mono pruefung-code__feld"
            rows={a.zeilen ?? 10}
            spellcheck={false}
            autoComplete="off"
            autoCapitalize="off"
            value={wert ?? ''}
            disabled={nurLesen}
            onInput={(e) => setze(e.currentTarget.value)}
            onKeyDown={tabEinruecken}
          />
        </div>
      );
    default:
      return <textarea class="feld pruefung-text" rows={a.zeilen ?? 4} value={wert ?? ''} disabled={nurLesen} onInput={(e) => setze(e.currentTarget.value)} />;
  }
}

// Tab im Code-Feld rückt ein statt den Fokus zu wechseln
function tabEinruecken(e) {
  if (e.key !== 'Tab' || e.shiftKey) return;
  e.preventDefault();
  const t = e.currentTarget;
  const a = t.selectionStart;
  t.setRangeText('  ', a, t.selectionEnd, 'end');
  t.dispatchEvent(new Event('input', { bubbles: true }));
}

// ---------- WiSo-Bogen ----------

function WisoBogen({ pruefung, antworten, setAntwort, ergebnis = false }) {
  const satz = pruefung.fragen[0].satz;
  const gezeigt = new Set();
  return (
    <>
      <section class="flaeche flaeche--gross pruefung-situation">
        <div class="ueberschrift-klein ueberschrift-klein--akzent">Ausgangssituation</div>
        <Bloecke liste={[pruefung.satzId ? satz.situation : 'Die Aufgaben stammen aus verschiedenen Betrieben. Die Situation des Betriebs steht jeweils vor seinen Aufgaben.']} />
      </section>
      {pruefung.fragen.map(({ satz: s, frage }, i) => {
        const block = frage.situation ? s.bloecke?.find((b) => b.id === frage.situation) : null;
        const zeigeBlock = block && !gezeigt.has(`${s.id}:${block.id}`);
        if (zeigeBlock) gezeigt.add(`${s.id}:${block.id}`);
        const anteil = ergebnis ? bewerteFrage(frage, antworten[frage.id]) : null;
        return (
          <section key={frage.id} class={`flaeche pruefung-frage ${ergebnis ? (anteil === 1 ? 'pruefung-frage--gut' : anteil > 0 ? 'pruefung-frage--teils' : 'pruefung-frage--falsch') : ''}`}>
            {!pruefung.satzId && s.id !== pruefung.fragen[i - 1]?.satz.id && (
              <div class="pruefung-firma">
                <div class="ueberschrift-klein">Situation: {s.titel}</div>
                <Bloecke liste={[s.situation]} />
              </div>
            )}
            {zeigeBlock && (
              <div class="pruefung-firma">
                <Bloecke liste={[block.text]} />
              </div>
            )}
            <div class="pruefung-teilaufgabe__kopf">
              <span class="pruefung-teilaufgabe__nr">{i + 1}.</span>
              <div class="wachsen">
                <Rich text={frage.text} />
                {frage.art === 'mehrfach' && <p class="gedaempft">Kreuzen Sie {zahlwort(frage.richtig.length)} Antworten an.</p>}
              </div>
              {ergebnis && <span class="pruefung-teilaufgabe__punkte">{zahl(anteil * (100 / pruefung.fragen.length))} P</span>}
            </div>
            <FrageEingabe frage={frage} wert={antworten[frage.id]} setze={(w) => setAntwort(frage.id, w)} ergebnis={ergebnis} />
            {ergebnis && (
              <div class="pruefung-erklaerung">
                <Icon name={anteil === 1 ? 'check' : 'info'} groesse={14} /> <Rich text={loesungText(frage) + ' ' + frage.erklaerung} />
              </div>
            )}
          </section>
        );
      })}
    </>
  );
}

const zahlwort = (n) => ['keine', 'eine', 'zwei', 'drei', 'vier'][n] ?? String(n);

function loesungText(frage) {
  switch (frage.art) {
    case 'einfach':
    case 'mehrfach':
      return `Richtig: ${frage.richtig.map((i) => i + 1).join(' und ')}.`;
    case 'zuordnung':
      return `Richtig: ${frage.richtig.map((z, i) => `${String.fromCharCode(97 + i)} → ${z + 1}`).join(', ')}.`;
    case 'reihenfolge':
      return `Richtige Reihenfolge: ${frage.richtig.map((i) => i + 1).join(' → ')}.`;
    case 'zahl':
      return `Richtig: ${String(frage.richtig).replace('.', ',')}${frage.einheit ? ' ' + frage.einheit : ''}.`;
    default:
      return '';
  }
}

function FrageEingabe({ frage, wert, setze, ergebnis }) {
  const markiere = (i) => (ergebnis ? (frage.richtig.includes(i) ? 'pruefung-option--richtig' : '') : '');
  switch (frage.art) {
    case 'einfach':
    case 'mehrfach': {
      const mehr = frage.art === 'mehrfach';
      return (
        <div class="pruefung-optionen">
          {frage.optionen.map((o, i) => {
            const an = mehr ? (wert ?? []).includes(i) : wert === i;
            const wechsel = () => (mehr ? setze(an ? (wert ?? []).filter((x) => x !== i) : [...(wert ?? []), i]) : setze(i));
            return (
              <label key={i} class={`pruefung-option ${an ? 'pruefung-option--an' : ''} ${markiere(i)}`}>
                <input type={mehr ? 'checkbox' : 'radio'} name={frage.id} checked={an} disabled={ergebnis} onChange={wechsel} />
                <span class="pruefung-option__nr">{i + 1}</span>
                <span>
                  <Rich text={o} />
                </span>
              </label>
            );
          })}
        </div>
      );
    }
    case 'zuordnung':
      return (
        <div class="pruefung-zuordnung">
          <ol class="pruefung-zuordnung__ziele">
            {frage.optionen.map((o, i) => (
              <li key={i}>
                <span class="pruefung-option__nr">{i + 1}</span> <Rich text={o} />
              </li>
            ))}
          </ol>
          {frage.links.map((l, i) => (
            <label key={i} class="pruefung-zuordnung__zeile">
              <span class="pruefung-option__nr">{String.fromCharCode(97 + i)}</span>
              <span class="wachsen">
                <Rich text={l} />
              </span>
              <select class="feld" value={wert?.[i] ?? ''} disabled={ergebnis} onChange={(e) => setze(Object.assign([...(wert ?? [])], { [i]: e.currentTarget.value === '' ? null : Number(e.currentTarget.value) }))}>
                <option value="">–</option>
                {frage.optionen.map((_, j) => (
                  <option key={j} value={j}>
                    {j + 1}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      );
    case 'reihenfolge': {
      // Eingabe: Rang je Option; daraus die Reihenfolge der Indizes
      const rang = (i) => {
        const p = (wert ?? []).indexOf(i);
        return p < 0 ? '' : String(p + 1);
      };
      const setzeRang = (i, r) => {
        const liste = [...(wert ?? [])].map((x) => (x === i ? null : x));
        if (r) liste[Number(r) - 1] = i;
        setze(liste);
      };
      return (
        <div class="pruefung-zuordnung">
          <p class="gedaempft">Tragen Sie die Reihenfolge 1 bis {frage.optionen.length} ein.</p>
          {frage.optionen.map((o, i) => (
            <label key={i} class="pruefung-zuordnung__zeile">
              <select class="feld" value={rang(i)} disabled={ergebnis} onChange={(e) => setzeRang(i, e.currentTarget.value)}>
                <option value="">–</option>
                {frage.optionen.map((_, j) => (
                  <option key={j} value={j + 1}>
                    {j + 1}
                  </option>
                ))}
              </select>
              <span class="wachsen">
                <Rich text={o} />
              </span>
            </label>
          ))}
        </div>
      );
    }
    case 'zahl':
      return (
        <label class="pruefung-zahl">
          <span class="pruefung-zahl__eingabe">
            <input class="feld" inputMode="decimal" value={wert ?? ''} disabled={ergebnis} onInput={(e) => setze(e.currentTarget.value)} />
            {frage.einheit && <span class="gedaempft">{frage.einheit}</span>}
          </span>
        </label>
      );
    default:
      return null;
  }
}

// ---------- Bewerten (AP1, PB1, PB2) ----------

function vorschlag(pruefung, antworten) {
  const punkte = {};
  for (const { aufgabe } of pruefung.aufgaben)
    for (const t of aufgabe.teile) {
      const k = teilSchluessel(aufgabe, t);
      const p = automatischePunkte(t, antworten[k]);
      if (p !== null) punkte[k] = p;
    }
  return punkte;
}

function Bewerten({ z, pruefung, aendere, abschliessen }) {
  const setPunkte = (k, p) => aendere({ ...z, punkte: { ...z.punkte, [k]: p } });
  const alleTeile = pruefung.aufgaben.flatMap(({ aufgabe }) => aufgabe.teile.map((t) => teilSchluessel(aufgabe, t)));
  const offen = alleTeile.filter((k) => z.punkte[k] === undefined).length;
  const vorlaeufig = auswerten(pruefung, { punkte: z.punkte });
  const fertig = () => {
    if (offen && !confirm(`${offen} Teilaufgaben sind noch nicht bewertet und zählen mit 0 Punkten. Trotzdem abschließen?`)) return;
    abschliessen({ ...z, phase: 'fertig', ergebnis: speichere(z, pruefung) });
  };
  return (
    <div class="pruefung">
      <div class="pruefung-leiste">
        <div class="wachsen pruefung-leiste__titel">
          <span class="ueberschrift-klein ueberschrift-klein--akzent">Selbst bewerten</span>
          <span>
            {zahl(vorlaeufig.erreicht)} von {zahl(vorlaeufig.max)} Punkten {offen > 0 && <span class="gedaempft">· noch {offen} offen</span>}
          </span>
        </div>
        <Knopf variante="primaer" icon="check" onClick={fertig}>
          Bewertung abschließen
        </Knopf>
      </div>
      <p class="trainer-hinweis">
        <Icon name="info" groesse={14} /> Vergleiche deine Antwort mit der Musterlösung und vergib Punkte nach dem Schema – ehrlich wie ein Prüfer. Andere sinnvolle Antworten zählen auch. Zahlen und Auswahl hat die App schon vorgeschlagen.
      </p>
      {pruefung.aufgaben.map(({ aufgabe }, i) => (
        <section key={aufgabe.id} class="flaeche flaeche--gross pruefung-aufgabe">
          <div class="pruefung-aufgabe__kopf">
            <h2 class="wachsen">
              {i + 1}. Aufgabe <span class="gedaempft">· {aufgabe.titel}</span>
            </h2>
            <span class="sql-punkte">
              {zahl(aufgabe.teile.reduce((s, t) => s + (Number(z.punkte[teilSchluessel(aufgabe, t)]) || 0), 0))} / {aufgabe.punkte} P
            </span>
          </div>
          {aufgabe.teile.map((t) => {
            const k = teilSchluessel(aufgabe, t);
            return (
              <div key={t.nr} class="pruefung-teilaufgabe pruefung-bewertung">
                <div class="pruefung-teilaufgabe__kopf">
                  <span class="pruefung-teilaufgabe__nr">{t.nr})</span>
                  <div class="wachsen">
                    <Rich text={t.text} />
                  </div>
                </div>
                <div class="pruefung-bewertung__raster">
                  <div>
                    <div class="ueberschrift-klein">Deine Antwort</div>
                    <EigeneAntwort teil={t} wert={z.antworten[k]} />
                  </div>
                  <div>
                    <div class="ueberschrift-klein">Musterlösung</div>
                    <Bloecke liste={Array.isArray(t.loesung) ? t.loesung : [t.loesung]} />
                    {t.bewertung?.length > 0 && (
                      <div class="pruefung-schema">
                        <div class="ueberschrift-klein">Punkteschema</div>
                        <ul>
                          {t.bewertung.map((b, j) => (
                            <li key={j}>
                              <Rich text={b} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <PunkteWahl max={t.punkte} wert={z.punkte[k]} setze={(p) => setPunkte(k, p)} />
              </div>
            );
          })}
        </section>
      ))}
      <div class="pruefung-ende">
        <Knopf variante="primaer" icon="check" onClick={fertig}>
          Bewertung abschließen
        </Knopf>
      </div>
    </div>
  );
}

function EigeneAntwort({ teil, wert }) {
  const art = teil.antwort?.art ?? 'text';
  if (art === 'text' || art === 'papier' || art === 'code') {
    return leer(wert) ? <p class="gedaempft">– keine Antwort –</p> : <pre class={`pruefung-eigene ${art === 'code' ? 'mono' : ''}`}>{wert}</pre>;
  }
  return <Antwortfeld teil={teil} wert={wert} setze={() => {}} nurLesen />;
}

function PunkteWahl({ max, wert, setze }) {
  const stufen = [];
  const schritt = max > 12 ? 1 : 0.5;
  for (let p = 0; p <= max + 1e-9; p += schritt) stufen.push(runde1(p));
  if (stufen[stufen.length - 1] !== max) stufen.push(max);
  return (
    <div class="pruefung-punktwahl" role="radiogroup" aria-label="Punkte">
      <span class="gedaempft">Punkte:</span>
      {stufen.map((p) => (
        <button key={p} role="radio" aria-checked={wert === p} class={`pruefung-punkt ${wert === p ? 'pruefung-punkt--an' : ''}`} onClick={() => setze(p)}>
          {zahl(p)}
        </button>
      ))}
    </div>
  );
}

// ---------- Ergebnis ----------

function speichere(z, pruefung) {
  const e = auswerten(pruefung, { punkte: z.punkte, antworten: z.antworten });
  const dauer = Math.round(verstrichen(z) / 60000);
  erfasse({ e: 'pruefung', teil: pruefung.teil, titel: pruefung.titel, satz: pruefung.satzId ?? null, p: e.erreicht, max: e.max, dauer, sp: e.jeSp });
  return { ...e, dauer };
}

function Ergebnis({ raum, z, pruefung, schliessen }) {
  const e = z.ergebnis ?? auswerten(pruefung, { punkte: z.punkte, antworten: z.antworten });
  const [details, setDetails] = useState(false);
  const schwach = Object.entries(e.jeSp)
    .map(([id, [erreicht, max]]) => ({ sp: inhalt.sp.get(id), verloren: max - erreicht, anteil: max ? erreicht / max : 1 }))
    .filter((x) => x.sp && x.verloren > 0.01)
    .sort((a, b) => b.verloren - a.verloren)
    .slice(0, 6);
  return (
    <div class="pruefung">
      <section class={`flaeche flaeche--gross pruefung-ergebnis pruefung-ergebnis--${e.bestanden ? 'gut' : 'schlecht'}`}>
        <div class="ueberschrift-klein ueberschrift-klein--akzent">{TEILE[pruefung.teil].name}</div>
        <h1 class="pruefung-ergebnis__titel">{pruefung.titel}</h1>
        <div class="pruefung-ergebnis__zahlen">
          <div>
            <div class="pruefung-ergebnis__wert">{zahl(e.erreicht)}</div>
            <div class="gedaempft">von {zahl(e.max)} Punkten</div>
          </div>
          <div>
            <div class="pruefung-ergebnis__wert">{zahl(e.prozent)} %</div>
            <div class="gedaempft">erreicht</div>
          </div>
          <div>
            <div class="pruefung-ergebnis__wert">{e.note}</div>
            <div class="gedaempft">{e.name}</div>
          </div>
          <div>
            <div class="pruefung-ergebnis__wert">{e.dauer ?? '–'}</div>
            <div class="gedaempft">Minuten</div>
          </div>
        </div>
        <p>{bestehensText(pruefung.teil, e.prozent)}</p>
      </section>
      {schwach.length > 0 && (
        <section class="flaeche flaeche--gross">
          <div class="ueberschrift-klein">Hier hast du die meisten Punkte verloren</div>
          <ul class="pruefung-schwach">
            {schwach.map(({ sp, verloren, anteil }) => (
              <li key={sp.id}>
                <a href={link(raum, 'lernen', null, { block: sp.block, sp: sp.id })}>{sp.titel ?? sp.stichpunkt ?? sp.id}</a>
                <span class="gedaempft">
                  −{zahl(verloren)} P · {Math.round(anteil * 100)} % erreicht
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {pruefung.fragen && (
        <>
          <Knopf variante="geist" icon={details ? 'eye-off' : 'eye'} onClick={() => setDetails(!details)}>
            {details ? 'Lösungen ausblenden' : 'Alle Aufgaben mit Lösung ansehen'}
          </Knopf>
          <Aufklapp offen={details}>{details && <WisoBogen pruefung={pruefung} antworten={z.antworten} setAntwort={() => {}} ergebnis />}</Aufklapp>
        </>
      )}
      <div class="pruefung-ende">
        <Knopf variante="primaer" icon="arrow-left" onClick={schliessen}>
          Zur Übersicht
        </Knopf>
      </div>
    </div>
  );
}

// Bestehensregeln (FIAusbV §§ 16, 17): AP1 zählt nur mit 20 % in die Gesamtnote, ist allein kein Sperrfach.
// In Teil 2 darf kein Bereich unter 30 liegen; unter 50 ist auf Antrag eine mündliche Ergänzungsprüfung möglich.
function bestehensText(teil, prozent) {
  if (teil === 'AP1') return prozent >= 50 ? 'Gut – über 50 Punkten. AP1 zählt mit 20 % in die Gesamtnote.' : 'Unter 50 Punkten. AP1 allein entscheidet nicht über das Bestehen, zählt aber mit 20 % in die Gesamtnote.';
  if (prozent >= 50) return 'Bestanden – ab 50 Punkten ist der Prüfungsbereich geschafft.';
  if (prozent >= 30) return 'Unter 50 Punkten. In einem schriftlichen Bereich von Teil 2 kannst du dann eine mündliche Ergänzungsprüfung beantragen.';
  return 'Unter 30 Punkten – in Teil 2 wäre das ein Sperrfach: Die Prüfung gilt dann insgesamt als nicht bestanden.';
}

// ---------- Blöcke ----------

export function Bloecke({ liste }) {
  return (
    <div class="pruefung-bloecke">
      {(liste ?? []).filter(Boolean).map((b, i) => {
        if (typeof b === 'string') return <Rich key={i} text={b} />;
        if (b.tabelle)
          return (
            <div key={i} class="pruefung-block">
              {b.tabelle.titel && <div class="pruefung-block__titel">{b.tabelle.titel}</div>}
              <div class="atabelle-huelle">
                <table class="atabelle pruefung-vorgabe-tabelle">
                  {b.tabelle.kopf && (
                    <thead>
                      <tr>
                        {b.tabelle.kopf.map((k, j) => (
                          <th key={j}>{k}</th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {b.tabelle.zeilen.map((z, j) => (
                      <tr key={j}>
                        {z.map((c, k) => (
                          <td key={k}>
                            <Rich text={String(c ?? '')} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        if (b.code !== undefined)
          return (
            <div key={i} class="pruefung-block">
              {b.titel && <div class="pruefung-block__titel">{b.titel}</div>}
              <pre class="pruefung-quelltext mono">
                {String(b.code)
                  .split('\n')
                  .map((z, j) => (
                    <div key={j} class="pruefung-quelltext__zeile">
                      {b.nummern && <span class="pruefung-quelltext__nr">{j + 1}</span>}
                      <span>{z || ' '}</span>
                    </div>
                  ))}
              </pre>
            </div>
          );
        if (b.hinweis)
          return (
            <div key={i} class="pruefung-hinweis">
              <Icon name="info" groesse={14} /> <Rich text={b.hinweis} />
            </div>
          );
        if (b.diagramm)
          return (
            <div key={i} class="pruefung-block">
              {b.titel && <div class="pruefung-block__titel">{b.titel}</div>}
              <Diagramm d={b.diagramm} />
            </div>
          );
        return null;
      })}
    </div>
  );
}
