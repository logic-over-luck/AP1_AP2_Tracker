// SQL-Labor (nur AP2): echte Abfragen gegen die Übungsdatenbank „Systemhaus Rheinblick".
// Ausführen läuft immer auf einer frischen Datenbank – so ist jedes Ergebnis wiederholbar.
// Geprüft wird das Ergebnis, nicht der Wortlaut (siehe engine.js).

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { TrainerSeite, Spickzettel } from '../rahmen/Uebung.jsx';
import { Icon, Knopf, Kbd, Rich, Marke, Aufklapp } from '../../../ui/bausteine.jsx';
import { erfasse, useLernstand } from '../../../lernstand/store.js';
import { einstellung, setzeEinstellung } from '../../../lernstand/einstellungen.js';
import { ladeEngine } from './laden.js';
import { ausfuehren, pruefeAufgabe, fehlerText, schemaAus } from './engine.js';
import { SQL_AUFGABEN, RECHTE_AUFGABEN, pruefeRecht } from './aufgaben.js';
import { GRUNDLAGEN, KLAUSELN, BEFEHLSGRUPPEN } from './grundlagen.js';
import { setzeEin } from './einfuegen.js';

const SPICKZETTEL = {
  abfragen:
    '- Reihenfolge: SELECT … FROM … JOIN … ON … WHERE … GROUP BY … HAVING … ORDER BY …\n- Text in einfachen Anführungszeichen: `\'Mainz\'`\n- Leere Werte: `IS NULL` / `IS NOT NULL`, nie `= NULL`\n- Bedingung auf Gruppen: HAVING, auf Zeilen: WHERE\n- Datum als Text `\'2025-03-01\'`; YEAR(), MONTH(), DATEDIFF() gibt es hier auch',
  aendern:
    '- `INSERT INTO t (a, b) VALUES (1, \'x\');`\n- `UPDATE t SET a = a * 1.05 WHERE …;` – ohne WHERE trifft es alle Zeilen\n- `DELETE FROM t WHERE …;`\n- Abhängige Zeilen zuerst löschen (Fremdschlüssel)\n- Mehrere Anweisungen mit `;` trennen',
  struktur:
    '- `CREATE TABLE t (id INTEGER PRIMARY KEY, name VARCHAR(40), …, FOREIGN KEY (x) REFERENCES u(x));`\n- `ALTER TABLE t ADD COLUMN c VARCHAR(100);`\n- `CREATE INDEX name ON t (spalte);`\n- `DROP TABLE t;`',
  rechte:
    '- `GRANT SELECT, UPDATE ON tabelle TO benutzer;`\n- `… WITH GRANT OPTION` – darf weitergeben\n- `REVOKE INSERT ON tabelle FROM benutzer;`\n- `CREATE USER name IDENTIFIED BY \'passwort\';`\n- Nur vergeben, was gebraucht wird (Minimalprinzip)',
};

const BEISPIELE = [
  ['Alle Kunden', 'SELECT * FROM kunde;'],
  ['Artikel je Kategorie', 'SELECT c.name, COUNT(a.artikel_id) AS anzahl\nFROM kategorie c LEFT JOIN artikel a ON a.kategorie_id = c.kategorie_id\nGROUP BY c.kategorie_id, c.name;'],
  ['Umsatz je Bestellung', 'SELECT p.bestell_id, SUM(p.menge * a.preis) AS warenwert\nFROM bestellposition p JOIN artikel a ON a.artikel_id = p.artikel_id\nGROUP BY p.bestell_id\nORDER BY warenwert DESC;'],
  ['Mitarbeiter mit Chef', 'SELECT m.vorname, m.nachname, v.nachname AS chef\nFROM mitarbeiter m LEFT JOIN mitarbeiter v ON m.vorgesetzter_id = v.ma_id;'],
  ['Datumsrechnen', "SELECT bestell_id, datum, DATEDIFF(NOW(), datum) AS tage_her\nFROM bestellung\nORDER BY datum DESC;"],
];

// Zwischenüberschriften in der Aufgabenliste „Abfragen"
const GRUPPE = { 'AP2-4-2-1': 'Eine Tabelle', 'AP2-4-2-2': 'JOIN', 'AP2-4-2-3': 'Gruppieren', 'AP2-4-2-4': 'Unterabfragen & UNION' };

export function SqlLabor({ raum, trainer, modi, params }) {
  return (
    <TrainerSeite raum={raum} trainer={trainer} modi={modi} modus={params.modus}>
      {(m) => <Labor key={m.id} modus={m} startAufgabe={params.aufgabe} />}
    </TrainerSeite>
  );
}

// ---------- Engine laden ----------

function useEngine() {
  const [zustand, setZustand] = useState({ engine: null, fehler: null });
  useEffect(() => {
    let aktiv = true;
    ladeEngine().then(
      (engine) => aktiv && setZustand({ engine, fehler: null }),
      (e) => aktiv && setZustand({ engine: null, fehler: e.message ?? String(e) }),
    );
    return () => (aktiv = false);
  }, []);
  return zustand;
}

function Labor({ modus, startAufgabe }) {
  const { engine, fehler } = useEngine();
  if (fehler)
    return (
      <div class="flaeche sql-meldung sql-meldung--fehler">
        <Icon name="triangle-alert" groesse={18} /> Die Datenbank konnte nicht gestartet werden: {fehler}
      </div>
    );
  if (!engine)
    return (
      <div class="flaeche sql-laden" aria-live="polite">
        <Icon name="database" groesse={18} /> Datenbank wird gestartet …
      </div>
    );
  if (modus.id === 'grundlagen') return <Grundlagen />;
  if (modus.id === 'frei') return <FreiesLabor engine={engine} />;
  return <AufgabenLabor engine={engine} modus={modus} startAufgabe={startAufgabe} />;
}

// ---------- Entwürfe (je Aufgabe, nur Ansicht – kein Lernstand) ----------

const entwurf = (id) => einstellung('sql-entwuerfe', {})[id] ?? '';
const merkeEntwurf = (id, text) => {
  const alle = { ...einstellung('sql-entwuerfe', {}) };
  if (text.trim()) alle[id] = text;
  else delete alle[id];
  setzeEinstellung('sql-entwuerfe', alle);
};

// ---------- Aufgaben ----------

function AufgabenLabor({ engine, modus, startAufgabe }) {
  const rechte = modus.id === 'rechte';
  const liste = useMemo(() => (rechte ? RECHTE_AUFGABEN.map((a) => ({ ...a, modus: 'rechte', sp: modus.sp[0] })) : SQL_AUFGABEN.filter((a) => a.modus === modus.id)), [modus.id]);
  const stand = useLernstand();
  const geloest = useMemo(() => new Set(liste.filter((a) => stand.geloest.has(`sql:${a.id}`)).map((a) => a.id)), [stand, liste]);
  const ersteOffene = liste.find((a) => !geloest.has(a.id)) ?? liste[0];
  const [aktuellId, setAktuellId] = useState(liste.some((a) => a.id === startAufgabe) ? startAufgabe : ersteOffene.id);
  const aufgabe = liste.find((a) => a.id === aktuellId) ?? liste[0];
  const index = liste.indexOf(aufgabe);

  return (
    <div class="sql">
      <div class="uebung__kopf">
        <div class="uebung__sitzung">
          <span>
            Gelöst: <strong>{liste.filter((a) => geloest.has(a.id)).length}</strong>/{liste.length}
          </span>
        </div>
        <Spickzettel text={SPICKZETTEL[modus.id]} />
      </div>
      <AufgabenLeiste liste={liste} aktuell={aufgabe} geloest={geloest} waehle={setAktuellId} />
      <AufgabeKarte
        key={aufgabe.id}
        engine={engine}
        aufgabe={aufgabe}
        nr={index + 1}
        rechte={rechte}
        warGeloest={geloest.has(aufgabe.id)}
        weiter={index < liste.length - 1 ? () => setAktuellId(liste[index + 1].id) : null}
      />
    </div>
  );
}

// Kompakte Aufgabenwahl: Themen als Reiter (nur bei Abfragen), darunter die Aufgaben als Nummern
function AufgabenLeiste({ liste, aktuell, geloest, waehle }) {
  const gruppen = [...new Set(liste.map((a) => a.sp))].filter((sp) => GRUPPE[sp]);
  const inGruppe = gruppen.length > 1 ? liste.filter((a) => a.sp === aktuell.sp) : liste;
  const i = liste.indexOf(aktuell);
  return (
    <nav class="flaeche sql-leiste" aria-label="Aufgaben">
      {gruppen.length > 1 && (
        <div class="sql-leiste__gruppen" role="tablist">
          {gruppen.map((sp) => {
            const teil = liste.filter((a) => a.sp === sp);
            const fertig = teil.filter((a) => geloest.has(a.id)).length;
            return (
              <button key={sp} role="tab" class="sql-leiste__gruppe" aria-selected={sp === aktuell.sp} onClick={() => sp !== aktuell.sp && waehle((teil.find((a) => !geloest.has(a.id)) ?? teil[0]).id)}>
                {GRUPPE[sp]}
                <span class="sql-leiste__fortschritt">
                  {fertig}/{teil.length}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <div class="sql-leiste__zeile">
        <button class="sql-leiste__pfeil" aria-label="Vorherige Aufgabe" disabled={i === 0} onClick={() => waehle(liste[i - 1].id)}>
          <Icon name="chevron-left" groesse={16} />
        </button>
        <div class="sql-leiste__nummern">
          {inGruppe.map((a) => (
            <button
              key={a.id}
              class={`sql-leiste__nr ${a.id === aktuell.id ? 'sql-leiste__nr--aktiv' : ''} ${geloest.has(a.id) ? 'sql-leiste__nr--geloest' : ''}`}
              aria-current={a.id === aktuell.id ? 'true' : undefined}
              title={a.titel}
              onClick={() => waehle(a.id)}
            >
              {geloest.has(a.id) && a.id !== aktuell.id ? <Icon name="check" groesse={13} strich={2.6} /> : liste.indexOf(a) + 1}
            </button>
          ))}
        </div>
        <button class="sql-leiste__pfeil" aria-label="Nächste Aufgabe" disabled={i === liste.length - 1} onClick={() => waehle(liste[i + 1].id)}>
          <Icon name="chevron-right" groesse={16} />
        </button>
      </div>
    </nav>
  );
}

function AufgabeKarte({ engine, aufgabe, nr, rechte, warGeloest, weiter }) {
  const [text, setText] = useState(() => entwurf(aufgabe.id));
  const [lauf, setLauf] = useState(null); // { ergebnis, geaendert, fehler, nachher }
  const [pruefung, setPruefung] = useState(null); // { ok, grund, hinweis }
  const [loesung, setLoesung] = useState(false);
  const [nachschlagen, setNachschlagen] = useState(false);
  const gezaehlt = useRef({ erst: false, ok: false });
  const editor = useRef(null);

  // Basis-Datenbank für Schema und erwartetes Ergebnis
  const basis = useMemo(() => {
    if (rechte) return { schema: schemaAusNeu(engine), soll: null };
    const db = engine.neueDb(aufgabe.vorbereitung);
    try {
      const schema = mitBeispiel(db, schemaAus(db));
      let soll = null;
      if (aufgabe.modus === 'abfragen') soll = ausfuehren(db, aufgabe.loesung).ergebnis;
      return { schema, soll };
    } finally {
      db.close();
    }
  }, [aufgabe.id]);

  const zaehle = (ok) => {
    const g = gezaehlt.current;
    if (!g.erst || (ok && !g.ok)) {
      erfasse({ e: 'aufgabe', tr: 'sql', m: aufgabe.modus, sp: aufgabe.sp, a: aufgabe.id, ok });
      g.erst = true;
      if (ok) g.ok = true;
    }
  };

  const ausfuehrenJetzt = () => {
    merkeEntwurf(aufgabe.id, text);
    if (rechte) return pruefen();
    const db = engine.neueDb(aufgabe.vorbereitung);
    try {
      const r = ausfuehren(db, text);
      const nachher = aufgabe.pruef && aufgabe.modus !== 'abfragen' ? ausfuehren(db, aufgabe.pruef).ergebnis : null;
      setLauf({ ...r, nachher });
    } catch (e) {
      setLauf({ fehler: fehlerText(e) });
    } finally {
      db.close();
    }
  };

  const pruefen = () => {
    merkeEntwurf(aufgabe.id, text);
    if (!text.trim()) {
      editor.current?.focus();
      return;
    }
    if (rechte) {
      const r = pruefeRecht(text, aufgabe.soll);
      setPruefung(r);
      zaehle(r.ok);
      return;
    }
    const r = pruefeAufgabe(engine, aufgabe, text);
    setPruefung(r);
    if (r.fehler) setLauf({ fehler: r.grund });
    else if (aufgabe.modus === 'abfragen') setLauf({ ergebnis: r.ergebnis });
    else ausfuehrenJetzt();
    zaehle(r.ok);
  };

  const zeigeLoesung = () => {
    if (!loesung && !gezaehlt.current.erst) {
      erfasse({ e: 'aufgabe', tr: 'sql', m: aufgabe.modus, sp: aufgabe.sp, a: aufgabe.id, ok: false });
      gezaehlt.current.erst = true;
    }
    setLoesung(!loesung);
  };

  const taste = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (e.shiftKey) pruefen();
      else ausfuehrenJetzt();
    }
  };

  const einfuegen = useEinfuegen(editor, text, setText, basis.schema);

  const ok = pruefung?.ok;
  return (
    <div class="sql__einspaltig">
      <DatenbankTabellen schema={basis.schema} einfuegen={einfuegen} />
      <section class={`flaeche flaeche--gross aufgabe ${ok ? 'aufgabe--fertig' : ''}`}>
        <div class="zeile">
          <div class="ueberschrift-klein ueberschrift-klein--akzent wachsen">Aufgabe {nr}</div>
          {warGeloest && !ok && (
            <Marke ton="gut" icon="check">
              schon gelöst
            </Marke>
          )}
          <span class="sql-punkte">{aufgabe.punkte} Punkte</span>
        </div>
        <div class="aufgabe__text">
          <Rich text={aufgabe.text} />
        </div>
        {basis.soll && (
          <div class="sql-beispiel-ergebnis">
            <span class="sql-beispiel-ergebnis__titel">Ergebnisbeispiel:</span>
            <ErgebnisTabelle ergebnis={basis.soll} grenze={3} />
          </div>
        )}
        {rechte && (
          <p class="trainer-hinweis">
            <Icon name="info" groesse={14} /> Die Übungsdatenbank kennt keine Benutzer. Deine Anweisung wird deshalb zerlegt und Teil für Teil geprüft:
            Befehl, Rechte, Tabelle, Benutzer, Weitergabe.
          </p>
        )}
        <label class="sql-editor">
          <span class="sql-editor__titel">Lösung</span>
          <textarea
            ref={editor}
            class="feld sql-editor__feld"
            value={text}
            rows={Math.min(14, Math.max(5, text.split('\n').length + 1))}
            spellcheck={false}
            autoComplete="off"
            autoCapitalize="off"
            placeholder="Ihre SQL-Anweisung …"
            onInput={(e) => setText(e.currentTarget.value)}
            onKeyDown={taste}
          />
        </label>
        <div class="aufgabe__knoepfe">
          {!rechte && (
            <Knopf variante="zweit" icon="play" onClick={ausfuehrenJetzt}>
              Ausführen <Kbd>Strg+Enter</Kbd>
            </Knopf>
          )}
          {ok && weiter ? (
            <Knopf variante="primaer" iconRechts="arrow-right" onClick={weiter}>
              Nächste Aufgabe
            </Knopf>
          ) : (
            <Knopf variante="primaer" icon="check" onClick={pruefen}>
              Prüfen <Kbd>{rechte ? 'Strg+Enter' : 'Strg+⇧+Enter'}</Kbd>
            </Knopf>
          )}
          <Knopf variante="geist" icon={loesung ? 'eye-off' : 'eye'} onClick={zeigeLoesung} aria-expanded={loesung}>
            {loesung ? 'Lösungshinweis ausblenden' : 'Lösungshinweis'}
          </Knopf>
          <Knopf variante="geist" icon="book-open" onClick={() => setNachschlagen(!nachschlagen)} aria-expanded={nachschlagen}>
            {nachschlagen ? 'Nachschlagewerk ausblenden' : 'Nachschlagewerk'}
          </Knopf>
        </div>
        <Aufklapp offen={nachschlagen}>
          <Nachschlagewerk />
        </Aufklapp>

        {pruefung && (
          <div class={`sql-urteil ${pruefung.ok ? 'sql-urteil--gut' : 'sql-urteil--falsch'} erscheinen`} role="status">
            <Icon name={pruefung.ok ? 'party-popper' : 'circle-x'} groesse={18} />
            <span>{pruefung.ok ? `Richtig!${pruefung.hinweis ? ' ' + pruefung.hinweis : ''}` : pruefung.grund ?? 'Stimmt noch nicht.'}</span>
          </div>
        )}

        <Aufklapp offen={loesung}>
          <div class="sql-block">
            <div class="zeile">
              <div class="ueberschrift-klein wachsen">Lösungshinweis</div>
              <Knopf variante="geist" groesse="s" icon="corner-down-left" onClick={() => setText(formatiereSql(aufgabe.loesung))}>
                In den Editor
              </Knopf>
            </div>
            <SqlCode text={formatiereSql(aufgabe.loesung)} />
            <p class="gedaempft sql-block__fuss">Andere Schreibweisen sind genauso richtig, wenn das Ergebnis stimmt – zum Beispiel ohne Alias oder mit anderer Spaltenreihenfolge.</p>
          </div>
        </Aufklapp>

        {lauf && <LaufAnzeige lauf={lauf} modus={aufgabe.modus} />}
      </section>
    </div>
  );
}

function schemaAusNeu(engine) {
  const db = engine.neueDb();
  try {
    return mitBeispiel(db, schemaAus(db));
  } finally {
    db.close();
  }
}

// Wie in der Prüfung: von jeder Tabelle die ersten Datensätze als Auszug
const AUSZUG = 4;
function mitBeispiel(db, schema) {
  return schema.map((t) => {
    try {
      return { ...t, beispiel: ausfuehren(db, `SELECT * FROM "${t.name}" LIMIT ${AUSZUG}`).ergebnis };
    } catch {
      return t;
    }
  });
}

// ---------- Freies Labor ----------

function FreiesLabor({ engine }) {
  const db = useRef(null);
  const [schema, setSchema] = useState([]);
  const [text, setText] = useState(() => entwurf('frei') || 'SELECT * FROM artikel;');
  const [lauf, setLauf] = useState(null);
  const [verlauf, setVerlauf] = useState([]);
  const [nachschlagen, setNachschlagen] = useState(false);
  const editor = useRef(null);
  const einfuegen = useEinfuegen(editor, text, setText, schema);

  const zuruecksetzen = () => {
    db.current?.close();
    db.current = engine.neueDb();
    setSchema(mitBeispiel(db.current, schemaAus(db.current)));
    setLauf(null);
  };
  useEffect(() => {
    zuruecksetzen();
    return () => db.current?.close();
  }, []);

  const ausfuehrenJetzt = () => {
    merkeEntwurf('frei', text);
    try {
      const r = ausfuehren(db.current, text);
      setLauf(r);
      setVerlauf((v) => [text.trim(), ...v.filter((x) => x !== text.trim())].slice(0, 8));
    } catch (e) {
      setLauf({ fehler: fehlerText(e) });
    }
    setSchema(mitBeispiel(db.current, schemaAus(db.current)));
  };


  return (
    <div class="sql">
      <div class="sql__einspaltig">
        <DatenbankTabellen schema={schema} einfuegen={einfuegen} />
        <section class="flaeche flaeche--gross aufgabe">
          <div class="ueberschrift-klein ueberschrift-klein--akzent">Freies Labor</div>
          <p class="aufgabe__text text-2">
            Probiere alles aus – auch INSERT, UPDATE, DELETE oder CREATE TABLE. Die Änderungen bleiben erhalten, bis du die Datenbank zurücksetzt.
          </p>
          <div class="sql-beispiele">
            {BEISPIELE.map(([name, sql]) => (
              <button key={name} class="sql-beispiel" onClick={() => setText(sql)}>
                {name}
              </button>
            ))}
          </div>
          <label class="sql-editor">
            <span class="sr-only">SQL-Anweisung</span>
            <textarea
              ref={editor}
              class="feld sql-editor__feld"
              value={text}
              rows={Math.min(16, Math.max(6, text.split('\n').length + 1))}
              spellcheck={false}
              autoComplete="off"
              autoCapitalize="off"
              onInput={(e) => setText(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  ausfuehrenJetzt();
                }
              }}
            />
          </label>
          <div class="aufgabe__knoepfe">
            <Knopf variante="primaer" icon="play" onClick={ausfuehrenJetzt}>
              Ausführen <Kbd>Strg+Enter</Kbd>
            </Knopf>
            <Knopf variante="geist" icon="rotate-ccw" onClick={zuruecksetzen}>
              Datenbank zurücksetzen
            </Knopf>
            <Knopf variante="geist" icon="book-open" onClick={() => setNachschlagen(!nachschlagen)} aria-expanded={nachschlagen}>
              {nachschlagen ? 'Nachschlagewerk ausblenden' : 'Nachschlagewerk'}
            </Knopf>
          </div>
          <Aufklapp offen={nachschlagen}>
            <Nachschlagewerk />
          </Aufklapp>
          {lauf && <LaufAnzeige lauf={lauf} modus="frei" />}
          {verlauf.length > 1 && (
            <div class="sql-block">
              <div class="ueberschrift-klein">Zuletzt ausgeführt</div>
              <div class="sql-verlauf">
                {verlauf.slice(1).map((v) => (
                  <button key={v} class="sql-verlauf__punkt mono" onClick={() => setText(v)} title="In den Editor">
                    {v.replace(/\s+/g, ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

// ---------- Einfügen per Klick ----------

// Fügt an der Cursorposition ein – mit passenden Leerzeichen und Kommas (siehe einfuegen.js)
function useEinfuegen(editor, text, setText, schema) {
  const spalten = useMemo(() => new Set((schema ?? []).flatMap((t) => t.spalten.map(([n]) => n.toLowerCase()))), [schema]);
  return (wort, zurueck = 0) => {
    const t = editor.current;
    const a = t && document.activeElement === t ? t.selectionStart : (t?.dataset.pos ? Number(t.dataset.pos) : text.length);
    const b = t && document.activeElement === t ? t.selectionEnd : a;
    const r = setzeEin(text, Math.min(a, text.length), Math.min(b, text.length), wort, { zurueck, spalten });
    setText(r.text);
    requestAnimationFrame(() => {
      if (!t) return;
      // Auf dem Handy nicht fokussieren – sonst springt die Tastatur bei jedem Baustein auf
      if (!window.matchMedia('(hover: none)').matches) t.focus();
      t.setSelectionRange(r.pos, r.pos);
      t.dataset.pos = r.pos;
    });
  };
}

// ---------- Grundlagen: kleines Lexikon ----------

function Grundlagen() {
  return (
    <div class="sql-grund">
      <section class="flaeche sql-grund__kopf">
        <div class="ueberschrift-klein ueberschrift-klein--akzent">Reihenfolge in einer Abfrage</div>
        <div class="sql-grund__klauseln">
          {KLAUSELN.map((k, i) => (
            <span key={k} class="sql-grund__klausel">
              <span class="sql-grund__klausel-nr">{i + 1}</span>
              <span class="mono">{k}</span>
            </span>
          ))}
        </div>
        <div class="sql-grund__gruppen">
          {BEFEHLSGRUPPEN.map((g) => (
            <span key={g.kurz} class="sql-grund__gruppe">
              <strong class="mono">{g.kurz}</strong> {g.name}: <span class="mono gedaempft">{g.befehle}</span>
            </span>
          ))}
        </div>
      </section>
      <section class="flaeche sql-lexikon">
        <Lexikon />
      </section>
    </div>
  );
}

// Wie der Belegsatz „SQL-Syntax (Auszug)": Syntax | Beschreibung, nach Bereichen gegliedert
function Lexikon() {
  return (
    <div class="atabelle-huelle">
      <table class="atabelle sql-syntax">
        <thead>
          <tr>
            <th>Syntax</th>
            <th>Beschreibung</th>
          </tr>
        </thead>
        {GRUNDLAGEN.map((g) => (
          <tbody key={g.id}>
            <tr class="sql-syntax__bereich">
              <td colSpan={2}>{g.titel}</td>
            </tr>
            {g.begriffe.map(([syntax, beschreibung, nicht]) => (
              <tr key={syntax}>
                <td class="sql-syntax__code">
                  <SqlCodeZeile text={syntax} />
                </td>
                <td>
                  {beschreibung}
                  {nicht && <span class="gedaempft"> (in der Übungsdatenbank nicht ausführbar)</span>}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

// Wie der Belegsatz in der Prüfung, direkt unter der Aufgabe
function Nachschlagewerk() {
  return (
    <div class="sql-block sql-nachschlagen">
      <div class="ueberschrift-klein">SQL-Syntax (Auszug) · Reihenfolge: {KLAUSELN.join(' → ')}</div>
      <Lexikon />
    </div>
  );
}

function SqlCodeZeile({ text }) {
  return (
    <code class="sql-syntax__text">
      {hervorhebenSql(text).map((t, i) => (
        <span key={i} class={t.art === 'text' ? '' : `hl-${t.art}`}>
          {t.text}
        </span>
      ))}
    </code>
  );
}

// ---------- Anzeige ----------

function LaufAnzeige({ lauf, modus }) {
  if (lauf.fehler)
    return (
      <div class="sql-meldung sql-meldung--fehler" role="alert">
        <Icon name="triangle-alert" groesse={16} /> {lauf.fehler}
      </div>
    );
  return (
    <div class="sql-block erscheinen">
      {lauf.ergebnis ? (
        <>
          <div class="ueberschrift-klein">Dein Ergebnis · {zeilenText(lauf.ergebnis.zeilen.length)}</div>
          <ErgebnisTabelle ergebnis={lauf.ergebnis} />
        </>
      ) : (
        <div class="sql-meldung">
          <Icon name="circle-check" groesse={16} /> Ausgeführt
          {lauf.geaendert ? ` – ${lauf.geaendert} ${lauf.geaendert === 1 ? 'Zeile' : 'Zeilen'} geändert.` : modus === 'abfragen' ? ' – die Anweisung liefert keine Tabelle.' : '.'}
        </div>
      )}
      {lauf.nachher && (
        <>
          <div class="ueberschrift-klein">Geprüfter Ausschnitt danach</div>
          <ErgebnisTabelle ergebnis={lauf.nachher} />
        </>
      )}
    </div>
  );
}

const zeilenText = (n) => (n === 1 ? '1 Zeile' : `${n} Zeilen`);
const GRENZE = 200;

function wertText(v) {
  if (v === null || v === undefined) return <span class="sql-null">NULL</span>;
  if (typeof v === 'number' && !Number.isInteger(v)) return String(Math.round(v * 10000) / 10000);
  if (v instanceof Uint8Array) return <span class="sql-null">[{v.length} Byte]</span>;
  return String(v);
}

export function ErgebnisTabelle({ ergebnis, grenze = GRENZE }) {
  if (!ergebnis.zeilen.length)
    return (
      <div class="sql-leer">
        <Icon name="table" groesse={14} /> Keine Zeilen. Spalten: <span class="mono">{ergebnis.spalten.join(', ')}</span>
      </div>
    );
  const zahl = ergebnis.spalten.map((_, j) => ergebnis.zeilen.every((z) => z[j] === null || typeof z[j] === 'number'));
  return (
    <div class="atabelle-huelle sql-tabelle">
      <table class="atabelle">
        <thead>
          <tr>
            {ergebnis.spalten.map((s, j) => (
              <th key={j} class={zahl[j] ? 'rechts' : ''}>
                {s}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ergebnis.zeilen.slice(0, grenze).map((z, i) => (
            <tr key={i}>
              {z.map((c, j) => (
                <td key={j} class={zahl[j] ? 'rechts' : ''}>
                  {wertText(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {ergebnis.zeilen.length > grenze && grenze < GRENZE && <span class="sql-auslassung">…</span>}
      {ergebnis.zeilen.length > grenze && grenze >= GRENZE && <p class="gedaempft sql-block__fuss">… und {ergebnis.zeilen.length - grenze} weitere Zeilen.</p>}
    </div>
  );
}

// Wie in der Prüfung: jede Tabelle mit Spaltenköpfen und den ersten Datensätzen, ohne Schlüssel-Markierung –
// welche Spalten zusammengehören, erkennt man wie dort an den Namen. Klick auf Tabellen- oder Spaltennamen
// trägt ihn ins Lösungsfeld ein.
function DatenbankTabellen({ schema, einfuegen }) {
  return (
    <section class="flaeche sql-db">
      <div class="ueberschrift-klein ueberschrift-klein--akzent">Die folgenden Tabellen stehen auszugsweise zur Verfügung</div>
      <div class="sql-db__raster">
        {schema.map((t) => (
          <div key={t.name} class="sql-db__tabelle">
            <div class="sql-db__titel">
              Tabelle{' '}
              <button class="sql-db__name" onClick={() => einfuegen(t.name)}>
                {t.name}
              </button>
            </div>
            <div class="atabelle-huelle">
              <table class="atabelle sql-db__daten">
                <thead>
                  <tr>
                    {t.spalten.map(([name, typ]) => (
                      <th key={name}>
                        <button class="sql-db__name" title={typ} onClick={() => einfuegen(name)}>
                          {name}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(t.beispiel?.zeilen ?? []).map((z, i) => (
                    <tr key={i}>
                      {z.map((c, j) => (
                        <td key={j}>{wertText(c)}</td>
                      ))}
                    </tr>
                  ))}
                  {t.zeilen > (t.beispiel?.zeilen.length ?? 0) && (
                    <tr>
                      {t.spalten.map(([name], j) => (
                        <td key={name}>{j === 0 ? '…' : ''}</td>
                      ))}
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <p class="gedaempft sql-db__hinweis">Klick auf einen Tabellen- oder Spaltennamen trägt ihn ins Lösungsfeld ein.</p>
    </section>
  );
}

// ---------- SQL hübsch anzeigen ----------

const SCHLUESSELWOERTER = new Set(
  'SELECT FROM WHERE AND OR NOT IN IS NULL AS JOIN INNER LEFT RIGHT OUTER ON GROUP BY HAVING ORDER ASC DESC DISTINCT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE ALTER ADD COLUMN DROP INDEX PRIMARY KEY FOREIGN REFERENCES UNION ALL EXISTS BETWEEN LIKE GRANT REVOKE TO WITH OPTION PRIVILEGES USER IDENTIFIED CASE WHEN THEN ELSE END LIMIT MODIFY'.split(' '),
);
const TYPEN = new Set('INTEGER INT VARCHAR CHAR DATE DECIMAL TEXT BOOLEAN FLOAT DOUBLE'.split(' '));

export function hervorhebenSql(text) {
  const teile = [];
  const re = /('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+|[^\sA-Za-z0-9_']+)/g;
  let m;
  while ((m = re.exec(text))) {
    if (m[1]) teile.push({ art: 'str', text: m[1] });
    else if (m[2]) teile.push({ art: 'num', text: m[2] });
    else if (m[3]) {
      const gross = m[3].toUpperCase();
      teile.push({ art: SCHLUESSELWOERTER.has(gross) ? 'kw' : TYPEN.has(gross) ? 'typ' : 'text', text: m[3] });
    } else teile.push({ art: 'text', text: m[4] });
  }
  return teile;
}

// Bricht eine einzeilige Musterlösung an den Hauptklauseln um.
export function formatiereSql(sql) {
  return sql
    .split(/;\s*/)
    .filter((s) => s.trim())
    .map((s) =>
      s
        .replace(/\s+(FROM|WHERE|GROUP BY|HAVING|ORDER BY|UNION|VALUES|SET|(?:INNER |LEFT )?JOIN)\b/g, '\n$1')
        .replace(/\(SELECT/g, '(\n  SELECT')
        .trim() + ';',
    )
    .join('\n');
}

function SqlCode({ text }) {
  return (
    <pre class="codeblock sql-code">
      {hervorhebenSql(text).map((t, i) => (
        <span key={i} class={t.art === 'text' ? '' : `hl-${t.art}`}>
          {t.text}
        </span>
      ))}
    </pre>
  );
}
