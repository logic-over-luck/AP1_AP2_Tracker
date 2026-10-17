// Aufgabenschleife des Zahlen-Trainers: eine Aufgabe nach der anderen – Prüfen mit Enter, Lösungsweg zum Aufdecken,
// Rundenstand. quelle(nr) sagt, aus welchem Thema die nr-te Aufgabe kommt; mit laenge endet die Runde (onEnde).
//
// Gezählt wird eine Aufgabe genau einmal: beim ersten Prüfen (richtig oder falsch) oder sobald der Lösungsweg
// vor dem Prüfen aufgedeckt wird (falsch). Nachbessern bleibt möglich, ändert die Wertung aber nicht.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { erfasse } from '../../../lernstand/store.js';
import { Icon, Knopf, Rich, Kbd, Aufklapp, Marke, Balken } from '../../../ui/bausteine.jsx';
import { Tabelle } from '../rahmen/Uebung.jsx';
import { pruefeFeld, zahlText, runde } from '../rahmen/pruefen.js';
import { zufall } from '../rahmen/zufall.js';
import { erzeugeAufgabe, artName } from './aufgaben/index.js';
import { themaVon } from './themen.js';
import { gruppiert } from './rechnen.js';
import { Segmente } from './bausteine.jsx';

const neuerStartwert = () => Math.floor(Math.random() * 2 ** 31);

export function Training({ quelle, laenge = null, onEnde }) {
  const [nr, setNr] = useState(1);
  const [startwert, setStartwert] = useState(neuerStartwert);
  const [stand, setStand] = useState({ n: 0, ok: 0, serie: 0, ergebnisse: [] });
  // Ändert sich die Quelle (andere Aufgabenarten), kommt eine neue Aufgabe – die Runde läuft weiter
  const ersteQuelle = useRef(true);
  useEffect(() => {
    if (ersteQuelle.current) ersteQuelle.current = false;
    else setStartwert(neuerStartwert());
  }, [quelle]);

  const auftrag = quelle(nr);
  const schluessel = auftrag ? `${auftrag.thema}|${auftrag.sp}|${(auftrag.arten ?? []).join(',')}` : '';
  const aufgabe = useMemo(() => (auftrag ? erzeugeAufgabe(auftrag.thema, zufall(startwert), { sp: auftrag.sp, arten: auftrag.arten }) : null), [schluessel, startwert]);
  if (!aufgabe) return null;

  const zaehle = (ok) => {
    erfasse({ e: 'aufgabe', tr: 'zahlen', m: aufgabe.thema, sp: aufgabe.sp, ok });
    setStand((s) => ({ n: s.n + 1, ok: s.ok + (ok ? 1 : 0), serie: ok ? s.serie + 1 : 0, ergebnisse: [...s.ergebnisse, { thema: aufgabe.thema, ok }] }));
  };
  const weiter = () => {
    if (laenge && nr >= laenge) {
      onEnde?.(stand.ergebnisse);
      return;
    }
    setNr(nr + 1);
    setStartwert(neuerStartwert());
  };

  return <Aufgabe key={`${nr}-${startwert}`} aufgabe={aufgabe} nr={nr} laenge={laenge} stand={stand} onZaehle={zaehle} onWeiter={weiter} />;
}

function Aufgabe({ aufgabe, nr, laenge, stand, onZaehle, onWeiter }) {
  const [eingaben, setEingaben] = useState({});
  const [ergebnis, setErgebnis] = useState(null); // je Feld { ok, leer?, grund?, hinweis? } nach dem Prüfen
  const [loesung, setLoesung] = useState(false);
  const [versuche, setVersuche] = useState(0);
  const gezaehlt = useRef(false);
  const karte = useRef(null);

  const geloest = !!ergebnis && aufgabe.felder.every((f) => ergebnis[f.id]?.ok);
  const falsch = ergebnis ? aufgabe.felder.filter((f) => !ergebnis[f.id].ok).length : 0;

  // Neue Aufgabe: ins erste Feld; gelöst: auf „Nächste Aufgabe“, damit Enter weiterführt. Ohne Scrollen – die
  // Erklärung über der Aufgabe soll sichtbar bleiben.
  useEffect(() => {
    karte.current?.querySelector(geloest ? '.knopf--primaer' : 'input, select, .zt-segment')?.focus({ preventScroll: true });
  }, [geloest]);

  const zaehle = (ok) => {
    if (gezaehlt.current) return;
    gezaehlt.current = true;
    onZaehle(ok);
  };
  const setze = (id, wert) => {
    setEingaben((e) => ({ ...e, [id]: wert }));
    // Eine markierte Eingabe wird beim Ändern wieder neutral, bis man erneut prüft
    if (ergebnis?.[id]) setErgebnis(({ [id]: _, ...rest }) => rest);
  };
  const pruefe = () => {
    const r = Object.fromEntries(aufgabe.felder.map((f) => [f.id, pruefeFeld(eingaben[f.id], f)]));
    if (Object.values(r).every((x) => x.leer)) {
      karte.current?.querySelector('input, select, .zt-segment')?.focus({ preventScroll: true });
      return;
    }
    setErgebnis(r);
    setVersuche((v) => v + 1);
    zaehle(aufgabe.felder.every((f) => r[f.id].ok));
  };
  const loesungUmschalten = () => {
    if (!loesung) zaehle(false);
    setLoesung(!loesung);
  };

  return (
    <section ref={karte} class={`flaeche flaeche--gross zt-aufgabe ${geloest ? 'zt-aufgabe--geloest' : ''}`} aria-label={`Aufgabe ${nr}`}>
      <header class="zt-aufgabe__kopf">
        <span class="ueberschrift-klein ueberschrift-klein--akzent">
          {themaVon(aufgabe.thema)?.name} · {artName(aufgabe.thema, aufgabe.art)}
        </span>
        <Rundenstand nr={nr} laenge={laenge} stand={stand} />
      </header>
      <div class="zt-aufgabe__text">
        <Rich text={aufgabe.text} />
      </div>
      {aufgabe.tabelle && <Tabelle {...aufgabe.tabelle} />}
      <form
        class="zt-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (geloest) onWeiter();
          else pruefe();
        }}
      >
        <div class="zt-felder">
          {aufgabe.felder.map((f) => (
            <Feld key={f.id} feld={f} wert={eingaben[f.id] ?? ''} ergebnis={ergebnis?.[f.id]} zeigeSoll={loesung} gesperrt={geloest} onEingabe={(w) => setze(f.id, w)} />
          ))}
        </div>
        {geloest && (
          <p class="zt-rueck zt-rueck--gut erscheinen" role="status">
            <Icon name="circle-check" groesse={18} />
            <span>
              <strong>{versuche > 1 ? 'Jetzt stimmt’s.' : 'Richtig!'}</strong> Weiter mit der nächsten Aufgabe.
            </span>
          </p>
        )}
        {ergebnis && !geloest && (
          <p class="zt-rueck zt-rueck--fehler" role="status">
            <Icon name="circle-x" groesse={18} />
            <span>
              {falsch === 1 ? 'Ein Wert stimmt noch nicht.' : `${falsch} Werte stimmen noch nicht.`} Korrigiere und prüfe erneut – oder sieh dir den Lösungsweg an.
            </span>
          </p>
        )}
        <div class="zt-aktionen">
          {geloest ? (
            <Knopf variante="primaer" type="submit" iconRechts="arrow-right">
              Nächste Aufgabe <Kbd>Enter</Kbd>
            </Knopf>
          ) : (
            <Knopf variante="primaer" type="submit" icon="check">
              Prüfen <Kbd>Enter</Kbd>
            </Knopf>
          )}
          <Knopf variante="zweit" icon={loesung ? 'eye-off' : 'eye'} onClick={loesungUmschalten}>
            {loesung ? 'Lösungsweg ausblenden' : 'Lösungsweg'}
          </Knopf>
          {!geloest && (
            <Knopf variante="geist" icon="shuffle" onClick={onWeiter}>
              Überspringen
            </Knopf>
          )}
        </div>
      </form>
      <Aufklapp offen={loesung}>
        <div class="zt-loesung">
          <span class="ueberschrift-klein">Lösungsweg</span>
          <ol>
            {aufgabe.loesung.map((schritt, i) => (
              <li key={i}>
                <Rich text={schritt} />
              </li>
            ))}
          </ol>
        </div>
      </Aufklapp>
    </section>
  );
}

function Rundenstand({ nr, laenge, stand }) {
  if (laenge) {
    return (
      <div class="zt-runde">
        <span>
          Aufgabe <strong>{nr}</strong> von {laenge}
        </span>
        <div class="zt-runde__balken">
          <Balken wert={(nr - 1) / laenge} label="Fortschritt der Runde" />
        </div>
      </div>
    );
  }
  return (
    <div class="zt-runde">
      <span>
        Diese Runde: <strong>{stand.ok}</strong>/{stand.n} richtig
      </span>
      {stand.serie >= 3 && (
        <Marke ton="akzent" icon="flame">
          {stand.serie} in Folge
        </Marke>
      )}
    </div>
  );
}

function Feld({ feld, wert, ergebnis, zeigeSoll, gesperrt, onEingabe }) {
  const zustand = ergebnis ? (ergebnis.ok ? 'ok' : 'falsch') : '';
  const feldKlasse = `feld ${zustand === 'ok' ? 'feld--richtig' : zustand === 'falsch' ? 'feld--falsch' : ''}`;
  const auswahl = feld.typ === 'auswahl';
  const segmente = auswahl && feld.optionen.length <= 4;
  // Knöpfe gehören nicht in ein <label> – sonst würde ein Klick auf den Text den ersten Knopf drücken
  const Huelle = segmente ? 'div' : 'label';
  return (
    <Huelle class="zt-feld">
      <span class="zt-feld__label">{feld.label}</span>
      <span class="zt-feld__eingabe">
        {segmente ? (
          <Segmente optionen={feld.optionen} wert={wert} onWahl={onEingabe} label={feld.label} disabled={gesperrt} zustand={zustand} />
        ) : auswahl ? (
          <select class={feldKlasse} value={wert} disabled={gesperrt} onChange={(e) => onEingabe(e.currentTarget.value)}>
            <option value="">– wählen –</option>
            {feld.optionen.map((o) => (
              <option key={o.wert ?? o} value={o.wert ?? o}>
                {o.text ?? o}
              </option>
            ))}
          </select>
        ) : (
          <input
            class={`${feldKlasse} feld--mono`}
            value={wert}
            inputMode={feld.typ === 'basis' || feld.typ === 'text' ? 'text' : 'decimal'}
            autoComplete="off"
            spellcheck={false}
            placeholder={feld.platzhalter ?? '?'}
            readOnly={gesperrt}
            onInput={(e) => onEingabe(e.currentTarget.value)}
          />
        )}
        {feld.einheit && <span class="zt-feld__einheit">{feld.einheit}</span>}
        {ergebnis && (
          <span class={`zt-feld__status zt-feld__status--${zustand}`}>
            <Icon name={ergebnis.ok ? 'circle-check' : 'circle-x'} groesse={18} />
          </span>
        )}
      </span>
      {ergebnis && !ergebnis.ok && <span class="zt-feld__hinweis">{zeigeSoll ? `Richtig wäre: ${sollText(feld)}` : ergebnis.leer ? 'bitte ausfüllen' : (ergebnis.grund ?? 'stimmt noch nicht')}</span>}
      {ergebnis?.ok && ergebnis.hinweis && <span class="zt-feld__hinweis zt-feld__hinweis--gut">{ergebnis.hinweis}</span>}
    </Huelle>
  );
}

// Der richtige Wert eines Feldes, so geschrieben, wie man ihn eintippen würde
function sollText(feld) {
  if (feld.typ === 'auswahl') return String(feld.optionen.find((o) => (o.wert ?? o) === feld.erwartet)?.text ?? feld.erwartet);
  if (feld.typ === 'basis') return feld.basis === 2 ? gruppiert(feld.erwartet.toString(2)) : feld.erwartet.toString(feld.basis).toUpperCase();
  if (feld.typ === 'text') return feld.erwartet;
  const stellen = feld.stellen ?? 0;
  return `${zahlText(runde(feld.erwartet, stellen), stellen)}${feld.einheit ? ` ${feld.einheit}` : ''}`;
}
