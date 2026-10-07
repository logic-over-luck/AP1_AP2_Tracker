// Trainer „Modellieren": UML, ER- und Tabellenmodell, Normalisierung, Prozesse, Masken, Lasten-/Pflichtenheft.
//
// Zeichnungen lassen sich nicht ehrlich automatisch bewerten. Deshalb drei Arten:
// – Üben: Lücken im Diagramm ergänzen, Fehler finden, Fragen zu Tabellen – automatisch geprüft
// – Zeichnen: auf Papier zeichnen, dann Musterlösung und Prüfliste zum Selbstvergleich
// – Notation: alle Sinnbilder auf einen Blick

import { useCallback, useMemo, useState } from 'preact/hooks';
import { TrainerSeite, Uebung, Tabelle } from '../rahmen/Uebung.jsx';
import { Icon, Knopf, Rich, Reiter, Haken, Marke, Aufklapp, Leer } from '../../../ui/bausteine.jsx';
import { erfasse, useLernstand } from '../../../lernstand/store.js';
import { Diagramm } from './diagramm.jsx';
import { AUFGABEN, NOTATION, SPICKZETTEL, NOTATION_AP1, SPICKZETTEL_AP1 } from './aufgaben/index.js';

export function ModellierenTrainer({ raum, trainer, modi, params }) {
  return (
    <TrainerSeite raum={raum} trainer={trainer} modi={modi} modus={params.modus}>
      {(m) => <Modus key={m.id} raum={raum} modus={m} params={params} />}
    </TrainerSeite>
  );
}

const fuerRaum = (liste, raum) => (liste ?? []).filter((a) => !a.raum || a.raum.includes(raum));

function Modus({ raum, modus, params }) {
  const alle = useMemo(() => fuerRaum(AUFGABEN[modus.id], raum), [modus.id, raum]);
  const ueben = useMemo(() => alle.filter((a) => a.art !== 'zeichnen'), [alle]);
  const zeichnen = useMemo(() => alle.filter((a) => a.art === 'zeichnen'), [alle]);
  const notation = (raum === 'AP1' && NOTATION_AP1[modus.id]) || NOTATION[modus.id];
  const eintraege = [
    ueben.length && { id: 'ueben', text: 'Üben', icon: 'target', zahl: ueben.length },
    zeichnen.length && { id: 'zeichnen', text: zeichnen.every((a) => a.muster) ? 'Zeichnen' : zeichnen.some((a) => a.muster) ? 'Zeichnen & Schreiben' : 'Ausarbeiten', icon: 'pencil', zahl: zeichnen.length },
    notation && { id: 'notation', text: 'Notation', icon: 'shapes' },
  ].filter(Boolean);
  const [reiter, setReiter] = useState(params.ansicht && eintraege.some((e) => e.id === params.ansicht) ? params.ansicht : eintraege[0]?.id);

  if (params.galerie) return <Galerie aufgaben={alle} notation={notation} />;
  if (!eintraege.length) return <Leer icon="shapes" titel="Noch keine Aufgaben">Für diesen Bereich gibt es hier noch keine Aufgaben.</Leer>;

  return (
    <div class="modell">
      {eintraege.length > 1 && <Reiter eintraege={eintraege} aktiv={reiter} onWahl={setReiter} label="Art der Übung" />}
      {reiter === 'ueben' && <Ueben key={modus.id} aufgaben={ueben} modus={modus} spickzettel={(raum === 'AP1' && SPICKZETTEL_AP1[modus.id]) || SPICKZETTEL[modus.id]} />}
      {reiter === 'zeichnen' && <Zeichnen aufgaben={zeichnen} modus={modus} />}
      {reiter === 'notation' && <Notation n={notation} />}
    </div>
  );
}

// ---------- Üben: Lücken, Fehler, Fragen ----------

function alsUebung(a) {
  const mitBild = Boolean(a.diagramm);
  return {
    ...a,
    titel: `${ART_NAME[a.art] ?? 'Aufgabe'} · ${a.titel}`,
    felder: a.felder.map((f) => ({ ...f, typ: 'auswahl', label: mitBild && /^\d+$/.test(f.id) ? `**[${f.id}]** ${f.label}` : f.label, breit: true })),
  };
}

const ART_NAME = { ergaenzen: 'Ergänzen', fehler: 'Fehler finden', fragen: 'Verstehen', zuordnen: 'Zuordnen' };

function Ueben({ aufgaben, modus, spickzettel }) {
  const erzeuge = useCallback(
    (rng) => {
      // nicht zweimal hintereinander dieselbe Aufgabe
      const zuletzt = Ueben.zuletzt?.[modus.id];
      const auswahl = aufgaben.length > 1 ? aufgaben.filter((a) => a.id !== zuletzt) : aufgaben;
      const a = rng.wahl(auswahl);
      Ueben.zuletzt = { ...Ueben.zuletzt, [modus.id]: a.id };
      return alsUebung(a);
    },
    [aufgaben, modus.id],
  );
  return <Uebung erzeuge={erzeuge} trainerId="modellieren" modusId={modus.id} spIds={modus.sp} spickzettel={spickzettel} ansicht={DiagrammAnsicht} loesungName="Erklärung" />;
}

export function lueckenFuer(aufgabe, eingaben, ergebnis, loesung) {
  const l = {};
  for (const f of aufgabe.felder ?? []) {
    const zeige = (w) => f.anzeige?.[w] ?? w;
    if (loesung) l[f.id] = { text: zeige(f.erwartet), zustand: 'loesung' };
    else if (eingaben?.[f.id]) l[f.id] = { text: zeige(eingaben[f.id]), zustand: ergebnis ? (ergebnis[f.id]?.ok ? 'richtig' : 'falsch') : 'gewaehlt' };
  }
  return l;
}

function DiagrammAnsicht({ aufgabe, eingaben, ergebnis, loesung }) {
  if (!aufgabe.diagramm) return null;
  return (
    <div class="modell__bild">
      <Diagramm d={aufgabe.diagramm} luecken={lueckenFuer(aufgabe, eingaben, ergebnis, loesung)} />
      {loesung && aufgabe.muster && (
        <div class="modell__muster erscheinen">
          <div class="ueberschrift-klein">So ist es richtig</div>
          <Diagramm d={aufgabe.muster} marken={false} />
        </div>
      )}
    </div>
  );
}

// ---------- Zeichnen: Musterlösung + Prüfliste ----------

function Zeichnen({ aufgaben, modus }) {
  const stand = useLernstand();
  const [id, setId] = useState(() => (aufgaben.find((a) => !stand.geloest.has(`modellieren:${a.id}`)) ?? aufgaben[0]).id);
  const a = aufgaben.find((x) => x.id === id) ?? aufgaben[0];
  const i = aufgaben.indexOf(a);
  return (
    <div class="sql__raster">
      <nav class="flaeche sql-liste" aria-label="Zeichenaufgaben">
        {aufgaben.map((x, n) => (
          <button key={x.id} class={`sql-liste__punkt ${x.id === a.id ? 'sql-liste__punkt--aktiv' : ''}`} aria-current={x.id === a.id ? 'true' : undefined} onClick={() => setId(x.id)}>
            <span class="sql-liste__nr">{stand.geloest.has(`modellieren:${x.id}`) ? <Icon name="check" groesse={13} strich={2.6} /> : n + 1}</span>
            <span class="sql-liste__titel">{x.titel}</span>
          </button>
        ))}
      </nav>
      <ZeichenAufgabe key={a.id} a={a} modus={modus} weiter={i < aufgaben.length - 1 ? () => setId(aufgaben[i + 1].id) : null} />
    </div>
  );
}

function ZeichenAufgabe({ a, modus, weiter }) {
  const [offen, setOffen] = useState(false);
  const [haken, setHaken] = useState(() => a.pruefliste.map(() => false));
  const [gespeichert, setGespeichert] = useState(null);
  const n = haken.filter(Boolean).length;
  const speichern = () => {
    const ok = n === haken.length;
    erfasse({ e: 'aufgabe', tr: 'modellieren', m: modus.id, sp: a.sp, a: a.id, ok });
    setGespeichert({ ok, n });
  };
  return (
    <section class="flaeche flaeche--gross aufgabe">
      <div class="ueberschrift-klein ueberschrift-klein--akzent">{a.muster ? 'Zeichnen' : 'Ausarbeiten'} · {a.titel}</div>
      <div class="aufgabe__text">
        <Rich text={a.text} />
      </div>
      {a.tabelle && <Tabelle {...a.tabelle} />}
      {a.vorlage && (
        <div class="modell__bild">
          <div class="ueberschrift-klein">Vorlage</div>
          <Diagramm d={a.vorlage} marken={false} />
        </div>
      )}
      <p class="trainer-hinweis">
        <Icon name="pencil" groesse={14} />{' '}
        {a.muster
          ? 'Zeichne auf Papier – so wie in der Prüfung. Danach vergleichst du mit der Musterlösung und hakst ab, was du richtig hast.'
          : 'Schreib deine Antwort auf Papier – in ganzen Sätzen, so wie in der Prüfung. Danach vergleichst du mit der Musterlösung und hakst ab, was du drin hast.'}
      </p>
      <div class="aufgabe__knoepfe">
        <Knopf variante={offen ? 'zweit' : 'primaer'} icon={offen ? 'eye-off' : 'eye'} onClick={() => setOffen(!offen)} aria-expanded={offen}>
          {offen ? 'Musterlösung ausblenden' : a.muster ? 'Fertig gezeichnet – Musterlösung zeigen' : 'Fertig – Musterlösung zeigen'}
        </Knopf>
      </div>
      <Aufklapp offen={offen}>
        <div class="modell__loesung">
          <div class="ueberschrift-klein">Musterlösung</div>
          {a.muster && <Diagramm d={a.muster} marken={false} />}
          {a.musterTabelle && <Tabelle {...a.musterTabelle} />}
          {a.musterText && <Rich text={a.musterText} class="text-2" />}
          <div class="modell__pruefliste">
            <div class="zeile">
              <div class="ueberschrift-klein wachsen">Prüfliste – was hast du drin?</div>
              <span class="gedaempft tabellenziffern">
                {n}/{haken.length}
              </span>
            </div>
            {a.pruefliste.map((p, i) => (
              <label key={i} class="modell__punkt">
                <Haken an={haken[i]} label={p} onWechsel={(v) => setHaken(haken.map((h, j) => (j === i ? v : h)))} />
                <span>
                  <Rich text={p} />
                </span>
              </label>
            ))}
            {a.hinweise && (
              <div class="modell__hinweise">
                <Rich text={a.hinweise} />
              </div>
            )}
            <div class="aufgabe__knoepfe">
              <Knopf variante="primaer" icon="check" onClick={speichern}>
                Selbstbewertung speichern
              </Knopf>
              {weiter && (
                <Knopf variante="geist" iconRechts="arrow-right" onClick={weiter}>
                  Nächste Aufgabe
                </Knopf>
              )}
            </div>
            {gespeichert && (
              <div class={`sql-urteil ${gespeichert.ok ? 'sql-urteil--gut' : 'sql-urteil--falsch'} erscheinen`} role="status">
                <Icon name={gespeichert.ok ? 'party-popper' : 'notebook-pen'} groesse={18} />
                <span>
                  {gespeichert.ok
                    ? 'Alles drin – stark!'
                    : `${gespeichert.n} von ${haken.length} Punkten. Schau dir die fehlenden Punkte an und zeichne die Aufgabe später noch einmal.`}
                </span>
              </div>
            )}
          </div>
        </div>
      </Aufklapp>
    </section>
  );
}

// ---------- Notation ----------

function Notation({ n }) {
  return (
    <section class="flaeche flaeche--gross modell__notation">
      {n.text && <Rich text={n.text} class="text-2" />}
      {(n.bilder ?? [n]).map((b, i) =>
        b.diagramm ? (
          <div key={i} class="modell__bild">
            {b.titel && <div class="ueberschrift-klein">{b.titel}</div>}
            <Diagramm d={b.diagramm} marken={false} />
          </div>
        ) : null,
      )}
      {n.punkte && (
        <ul class="modell__notationsliste">
          {n.punkte.map((p, i) => (
            <li key={i}>
              <Rich text={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// ---------- Galerie: alle Aufgaben mit Lösung (zur Durchsicht) ----------

function Galerie({ aufgaben, notation }) {
  return (
    <div class="modell modell--galerie">
      {notation && <Notation n={notation} />}
      {aufgaben.map((a) => (
        <section key={a.id} class="flaeche flaeche--gross aufgabe" data-aufgabe={a.id}>
          <div class="zeile">
            <div class="ueberschrift-klein ueberschrift-klein--akzent wachsen">
              {a.id} · {ART_NAME[a.art] ?? 'Zeichnen'} · {a.titel}
            </div>
            <Marke>{(a.raum ?? ['AP1', 'AP2']).join(' · ')}</Marke>
          </div>
          <Rich text={a.text} />
          {a.tabelle && <Tabelle {...a.tabelle} />}
          {a.diagramm && <Diagramm d={a.diagramm} />}
          {a.diagramm && a.felder && <Diagramm d={a.diagramm} luecken={lueckenFuer(a, {}, null, true)} marken={false} />}
          {a.vorlage && <Diagramm d={a.vorlage} marken={false} />}
          {a.felder && (
            <ol class="modell__galerie-felder">
              {a.felder.map((f) => (
                <li key={f.id}>
                  <strong>[{f.id}]</strong> {f.label} → <span class="text-gut">{f.erwartet}</span>
                  <span class="gedaempft"> (Auswahl: {f.optionen.join(' | ')})</span>
                </li>
              ))}
            </ol>
          )}
          {a.loesung && (
            <ol class="rechenweg__schritte">
              {a.loesung.map((s, i) => (
                <li key={i}>
                  <Rich text={s} />
                </li>
              ))}
            </ol>
          )}
          {a.muster && <Diagramm d={a.muster} marken={false} />}
          {a.musterTabelle && <Tabelle {...a.musterTabelle} />}
          {a.musterText && <Rich text={a.musterText} />}
          {a.pruefliste && (
            <ul>
              {a.pruefliste.map((p, i) => (
                <li key={i}>
                  <Rich text={p} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
