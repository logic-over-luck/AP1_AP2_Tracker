// Gemeinsame Oberfläche für Trainer: Seitenkopf mit Modulen und eine Übung mit Feldern,
// Prüfen, Rechenweg und neuer Aufgabe.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { inhalt } from '../../../daten/inhalt.js';
import { erfasse } from '../../../lernstand/store.js';
import { useEinstellung } from '../../../lernstand/einstellungen.js';
import { geheZu, link } from '../../../router.js';
import { Icon, Knopf, Rich, Kbd, Aufklapp, Marke } from '../../../ui/bausteine.jsx';
import { pruefeFeld, zahlText, runde } from './pruefen.js';
import { zufall } from './zufall.js';

export function TrainerSeite({ raum, trainer, modi, modus, children, untertitel }) {
  const r = inhalt.raeume.get(raum);
  const aktiv = modi.find((m) => m.id === modus) ?? modi[0];
  return (
    <div class="trainer">
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">{r.name} · Üben</div>
          <h1 class="seitenkopf__titel">{trainer.name}</h1>
          <p class="seitenkopf__text">{untertitel ?? trainer.text}</p>
        </div>
      </header>
      {modi.length > 1 && (
        <div class="trainer-modi" role="tablist" aria-label="Übungsarten">
          {modi.map((m) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={m.id === aktiv.id}
              class="trainer-modus"
              onClick={() => geheZu(raum, 'trainer', trainer.id, { modus: m.id }, { ersetzen: true })}
            >
              {m.name}
              {m.zusatzIn && <span class="trainer-modus__zusatz">Zusatz</span>}
            </button>
          ))}
        </div>
      )}
      {aktiv.hinweis && (
        <p class="trainer-hinweis">
          <Icon name="info" groesse={14} /> {aktiv.hinweis}
        </p>
      )}
      {children(aktiv)}
      <ThemenLinks raum={raum} modus={aktiv} />
    </div>
  );
}

function ThemenLinks({ raum, modus }) {
  const sps = modus.sp.map((id) => inhalt.sp.get(id)).filter((s) => s && s.raum === raum);
  if (!sps.length) return null;
  return (
    <div class="trainer-themen">
      <span class="ueberschrift-klein">Gehört zu</span>
      {sps.map((s) => (
        <a key={s.id} href={link(raum, 'lernen', null, { sp: s.id })} class="glossar__sp">
          {s.titel} <Icon name="arrow-right" groesse={12} />
        </a>
      ))}
    </div>
  );
}

// Spickzettel mit Formeln und Regeln, aufklappbar
export function Spickzettel({ titel = 'Formeln und Regeln', text, offenStart = false }) {
  const [offen, setOffen] = useState(offenStart);
  if (!text) return null;
  return (
    <div class="spickzettel">
      <button class="spickzettel__knopf" aria-expanded={offen} onClick={() => setOffen(!offen)}>
        <Icon name="lightbulb" groesse={15} /> {titel}
        <Icon name="chevron-down" groesse={15} class={`spickzettel__pfeil ${offen ? 'spickzettel__pfeil--offen' : ''}`} />
      </button>
      <Aufklapp offen={offen}>
        <div class="spickzettel__inhalt">
          <Rich text={text} />
        </div>
      </Aufklapp>
    </div>
  );
}

// Eine Übung aus einem Aufgabenerzeuger.
// erzeuge(rng) → { titel?, text, tabelle?, felder: [...], loesung: [...], sp? }
// arten: optionale Liste { name, ids } – damit lässt sich auswählen, welche Aufgabenarten kommen.
export function Uebung({ erzeuge, trainerId, modusId, spIds = [], spickzettel, ansicht: Ansicht, loesungName = 'Rechenweg', arten }) {
  const [startwert, setStartwert] = useState(() => Math.floor(Math.random() * 2 ** 31));
  const [gewaehlt, setGewaehlt] = useEinstellung(`arten.${trainerId}.${modusId}`, []);
  const auswahl = arten ? gewaehlt.filter((n) => arten.some((a) => a.name === n)) : [];
  const auswahlSchluessel = auswahl.join('|');
  const aufgabe = useMemo(() => {
    const r = zufall(startwert);
    r.arten = new Set(arten?.filter((a) => auswahl.includes(a.name)).flatMap((a) => a.ids));
    return erzeuge(r);
  }, [startwert, erzeuge, auswahlSchluessel]);
  const [notiz, setNotiz] = useState('');
  const [eingaben, setEingaben] = useState({});
  const [ergebnis, setErgebnis] = useState(null);
  const [loesung, setLoesung] = useState(false);
  const [gezaehlt, setGezaehlt] = useState(false);
  const [sitzung, setSitzung] = useState({ n: 0, ok: 0, serie: 0 });
  const erstesFeld = useRef(null);

  const neu = () => {
    setStartwert(Math.floor(Math.random() * 2 ** 31));
    setNotiz('');
    setEingaben({});
    setErgebnis(null);
    setLoesung(false);
    setGezaehlt(false);
    setTimeout(() => erstesFeld.current?.focus(), 30);
  };
  useEffect(() => {
    neu();
  }, [modusId, auswahlSchluessel]);

  const umschalten = (name) => setGewaehlt(auswahl.includes(name) ? auswahl.filter((n) => n !== name) : [...auswahl, name]);

  const zaehle = (ok) => {
    if (gezaehlt) return;
    setGezaehlt(true);
    erfasse({ e: 'aufgabe', tr: trainerId, m: modusId, sp: aufgabe.sp ?? spIds[0], ok });
    setSitzung((s) => ({ n: s.n + 1, ok: s.ok + (ok ? 1 : 0), serie: ok ? s.serie + 1 : 0 }));
  };

  const pruefe = () => {
    const r = {};
    let alleOk = true;
    let leer = false;
    for (const f of aufgabe.felder) {
      const x = pruefeFeld(eingaben[f.id], f);
      r[f.id] = x;
      if (!x.ok) alleOk = false;
      if (x.leer) leer = true;
    }
    if (leer && !Object.values(eingaben).some((v) => String(v ?? '').trim())) return;
    setErgebnis(r);
    zaehle(alleOk);
  };

  const aufdecken = () => {
    setLoesung(!loesung);
    if (!loesung && !ergebnis) zaehle(false);
  };

  const fertig = ergebnis && aufgabe.felder.every((f) => ergebnis[f.id]?.ok);
  const imBildFalsch = ergebnis ? aufgabe.felder.filter((f) => f.imBild && !ergebnis[f.id]?.ok).length : 0;

  return (
    <div class="uebung">
      <div class="uebung__kopf">
        <div class="uebung__sitzung">
          <span>
            Diese Runde: <strong>{sitzung.ok}</strong>/{sitzung.n} richtig
          </span>
          {sitzung.serie >= 3 && (
            <Marke ton="akzent" icon="flame">
              {sitzung.serie} in Folge
            </Marke>
          )}
        </div>
        <Spickzettel text={spickzettel} />
      </div>
      {arten?.length > 1 && (
        <div class="arten" role="group" aria-label="Welche Aufgaben möchtest du üben?">
          <span class="arten__titel">Üben:</span>
          <button type="button" class="art" aria-pressed={auswahl.length === 0} onClick={() => setGewaehlt([])}>
            Alle gemischt
          </button>
          {arten.map((a) => (
            <button key={a.name} type="button" class="art" aria-pressed={auswahl.includes(a.name)} onClick={() => umschalten(a.name)}>
              {a.name}
            </button>
          ))}
        </div>
      )}
      <section class={`flaeche flaeche--gross aufgabe ${fertig ? 'aufgabe--fertig' : ''}`} key={startwert}>
        {aufgabe.titel && <div class="ueberschrift-klein ueberschrift-klein--akzent">{aufgabe.titel}</div>}
        <div class="aufgabe__text">
          <Rich text={aufgabe.text} />
        </div>
        {aufgabe.tabelle && <Tabelle {...aufgabe.tabelle} />}
        {Ansicht && (
          <Ansicht
            aufgabe={aufgabe}
            eingaben={eingaben}
            setze={(id, wert) => setEingaben((e) => ({ ...e, [id]: wert }))}
            ergebnis={ergebnis}
            loesung={loesung || fertig}
          />
        )}
        <label class="notiz">
          <span class="notiz__kopf">
            <Icon name="pencil" groesse={13} /> Rechenweg &amp; Notizen <span class="gedaempft">· wird nicht geprüft</span>
          </span>
          <textarea
            class="feld feld--mono notiz__feld"
            rows={2}
            value={notiz}
            spellcheck={false}
            placeholder="Hier kannst du rechnen oder deine Notizen zur Aufgabe schreiben …"
            onInput={(e) => {
              setNotiz(e.currentTarget.value);
              e.currentTarget.style.height = 'auto';
              e.currentTarget.style.height = `${e.currentTarget.scrollHeight + 2}px`;
            }}
          />
        </label>
        <form
          class="aufgabe__felder"
          onSubmit={(e) => {
            e.preventDefault();
            if (fertig) neu();
            else pruefe();
          }}
        >
          {aufgabe.felder.map((f, i) => {
            if (f.imBild) return null;
            const r = ergebnis?.[f.id];
            return (
              <label key={f.id} class={`afeld ${f.breit ? 'afeld--breit' : ''}`}>
                <span class="afeld__label">
                  <Rich text={f.label} />
                </span>
                <span class="afeld__eingabe">
                  {f.typ === 'auswahl' ? (
                    <select
                      ref={i === 0 ? erstesFeld : null}
                      class={`feld ${r ? (r.ok ? 'feld--richtig' : 'feld--falsch') : ''}`}
                      value={eingaben[f.id] ?? ''}
                      onChange={(e) => setEingaben({ ...eingaben, [f.id]: e.currentTarget.value })}
                    >
                      <option value="">– wählen –</option>
                      {f.optionen.map((o) => (
                        <option key={o.wert ?? o} value={o.wert ?? o}>
                          {o.text ?? o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      ref={i === 0 ? erstesFeld : null}
                      class={`feld feld--mono ${r ? (r.ok ? 'feld--richtig' : 'feld--falsch') : ''}`}
                      value={eingaben[f.id] ?? ''}
                      inputMode={f.typ === 'zahl' ? 'decimal' : 'text'}
                      autoComplete="off"
                      spellcheck={false}
                      placeholder={f.platzhalter ?? '?'}
                      onInput={(e) => setEingaben({ ...eingaben, [f.id]: e.currentTarget.value })}
                    />
                  )}
                  {f.einheit && <span class="afeld__einheit">{f.einheit}</span>}
                  {r && <Icon name={r.ok ? 'circle-check' : 'circle-x'} groesse={18} class={r.ok ? 'text-gut' : 'text-fehler'} />}
                </span>
                {r && !r.ok && (loesung || fertig || ergebnis) && <span class="afeld__soll">{loesung ? `richtig: ${sollText(f)}` : r.grund ? `${r.grund}` : 'stimmt noch nicht'}</span>}
                {r?.ok && r.hinweis && <span class="afeld__soll afeld__soll--gut">{r.hinweis}</span>}
              </label>
            );
          })}
          <div class="aufgabe__knoepfe">
            {fertig ? (
              <Knopf variante="primaer" type="submit" iconRechts="arrow-right">
                Neue Aufgabe <Kbd>Enter</Kbd>
              </Knopf>
            ) : (
              <Knopf variante="primaer" type="submit" icon="check">
                Prüfen <Kbd>Enter</Kbd>
              </Knopf>
            )}
            <Knopf variante="zweit" icon={loesung ? 'eye-off' : 'eye'} onClick={aufdecken}>
              {loesung ? `${loesungName} ausblenden` : `${loesungName} zeigen`}
            </Knopf>
            {!fertig && (
              <Knopf variante="geist" icon="refresh-cw" onClick={neu}>
                Neue Aufgabe
              </Knopf>
            )}
          </div>
        </form>
        {imBildFalsch > 0 && !fertig && (
          <div class="aufgabe__hinweis">
            <Icon name="circle-x" groesse={16} /> {imBildFalsch} {imBildFalsch === 1 ? 'Wert' : 'Werte'} im Diagramm {imBildFalsch === 1 ? 'stimmt' : 'stimmen'} noch nicht (rot markiert).
          </div>
        )}
        {fertig && (
          <div class="aufgabe__lob erscheinen">
            <Icon name="party-popper" groesse={18} /> {gezaehlt && ergebnis ? 'Richtig!' : 'Stimmt.'} {aufgabe.lob ?? ''}
          </div>
        )}
        <Aufklapp offen={loesung}>
          <div class="rechenweg">
            <div class="ueberschrift-klein">{loesungName}</div>
            <ol class="rechenweg__schritte">
              {aufgabe.loesung.map((s, i) => (
                <li key={i}>
                  <Rich text={s} />
                </li>
              ))}
            </ol>
          </div>
        </Aufklapp>
      </section>
    </div>
  );
}

export function sollText(f) {
  if (f.soll) return f.soll;
  if (f.typ === 'auswahl') return (f.optionen.find((o) => (o.wert ?? o) === f.erwartet)?.text ?? f.erwartet).toString();
  if (f.typ === 'basis') return f.erwartet.toString(f.basis).toUpperCase();
  if (f.typ === 'zahl' || !f.typ) return zahlText(runde(f.erwartet, f.stellen ?? 0), f.stellen ?? 0) + (f.einheit ? ` ${f.einheit}` : '');
  return String(f.erwartet);
}

export function Tabelle({ kopf, zeilen, rechtsbuendig = [], fuss }) {
  return (
    <div class="atabelle-huelle">
      <table class="atabelle">
        {kopf && (
          <thead>
            <tr>
              {kopf.map((k, i) => (
                <th key={i} class={rechtsbuendig.includes(i) ? 'rechts' : ''}>
                  {k}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {zeilen.map((z, i) => (
            <tr key={i}>
              {z.map((c, j) => (
                <td key={j} class={rechtsbuendig.includes(j) ? 'rechts' : ''}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {fuss && (
          <tfoot>
            <tr>
              {fuss.map((c, j) => (
                <td key={j} class={rechtsbuendig.includes(j) ? 'rechts' : ''}>
                  {c}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
