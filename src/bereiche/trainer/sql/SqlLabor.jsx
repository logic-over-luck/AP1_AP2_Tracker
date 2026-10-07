// SQL-Labor (nur AP2): echte Abfragen gegen die Übungsdatenbank „Systemhaus Rheinblick".
// Ausführen läuft immer auf einer frischen Datenbank – so ist jedes Ergebnis wiederholbar.
// Geprüft wird das Ergebnis, nicht der Wortlaut (siehe engine.js).

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { TrainerSeite, Spickzettel } from '../rahmen/Uebung.jsx';
import { Icon, Knopf, Kbd, Rich, Marke, Aufklapp } from '../../../ui/bausteine.jsx';
import { geheZu } from '../../../router.js';
import { erfasse, useLernstand } from '../../../lernstand/store.js';
import { einstellung, setzeEinstellung } from '../../../lernstand/einstellungen.js';
import { ladeEngine } from './laden.js';
import { ausfuehren, pruefeAufgabe, fehlerText, schemaAus } from './engine.js';
import { SQL_AUFGABEN, RECHTE_AUFGABEN, pruefeRecht } from './aufgaben.js';
import { GRUNDLAGEN, KLAUSELN, BEFEHLSGRUPPEN } from './grundlagen.js';
import { setzeEin, genannteTabellen } from './einfuegen.js';

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
  if (modus.id === 'grundlagen') return <Grundlagen engine={engine} />;
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
  const [erwartet, setErwartet] = useState(false);
  const gezaehlt = useRef({ erst: false, ok: false });
  const editor = useRef(null);

  // Basis-Datenbank für Schema und erwartetes Ergebnis
  const basis = useMemo(() => {
    if (rechte) return { schema: schemaAusNeu(engine), soll: null };
    const db = engine.neueDb(aufgabe.vorbereitung);
    try {
      const schema = schemaAus(db);
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
    <div class="sql__haupt">
      <section class={`flaeche flaeche--gross aufgabe ${ok ? 'aufgabe--fertig' : ''}`}>
        <div class="zeile">
          <div class="ueberschrift-klein ueberschrift-klein--akzent wachsen">
            Aufgabe {nr} · {aufgabe.titel}
          </div>
          {warGeloest && !ok && (
            <Marke ton="gut" icon="check">
              schon gelöst
            </Marke>
          )}
        </div>
        <div class="aufgabe__text">
          <Rich text={aufgabe.text} />
        </div>
        {rechte && (
          <p class="trainer-hinweis">
            <Icon name="info" groesse={14} /> Die Übungsdatenbank kennt keine Benutzer. Deine Anweisung wird deshalb zerlegt und Teil für Teil geprüft:
            Befehl, Rechte, Tabelle, Benutzer, Weitergabe.
          </p>
        )}
        <label class="sql-editor">
          <span class="sr-only">SQL-Anweisung</span>
          <textarea
            ref={editor}
            class="feld sql-editor__feld"
            value={text}
            rows={Math.min(14, Math.max(5, text.split('\n').length + 1))}
            spellcheck={false}
            autoComplete="off"
            autoCapitalize="off"
            placeholder={rechte ? 'GRANT …' : aufgabe.modus === 'abfragen' ? 'SELECT …' : aufgabe.modus === 'aendern' ? 'INSERT / UPDATE / DELETE …' : 'CREATE / ALTER / DROP …'}
            onInput={(e) => setText(e.currentTarget.value)}
            onKeyDown={taste}
          />
        </label>
        <Bausteine art={rechte ? 'rechte' : aufgabe.modus} schema={basis.schema} text={text} einfuegen={einfuegen} />
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
          {basis.soll && (
            <Knopf variante="geist" icon="table" onClick={() => setErwartet(!erwartet)} aria-expanded={erwartet}>
              {erwartet ? 'Erwartetes Ergebnis ausblenden' : 'Erwartetes Ergebnis'}
            </Knopf>
          )}
          <Knopf variante="geist" icon={loesung ? 'eye-off' : 'eye'} onClick={zeigeLoesung} aria-expanded={loesung}>
            {loesung ? 'Lösung ausblenden' : 'Musterlösung'}
          </Knopf>
        </div>

        {pruefung && (
          <div class={`sql-urteil ${pruefung.ok ? 'sql-urteil--gut' : 'sql-urteil--falsch'} erscheinen`} role="status">
            <Icon name={pruefung.ok ? 'party-popper' : 'circle-x'} groesse={18} />
            <span>{pruefung.ok ? `Richtig!${pruefung.hinweis ? ' ' + pruefung.hinweis : ''}` : pruefung.grund ?? 'Stimmt noch nicht.'}</span>
          </div>
        )}

        <Aufklapp offen={erwartet}>
          {basis.soll && (
            <div class="sql-block">
              <div class="ueberschrift-klein">So soll das Ergebnis aussehen</div>
              <ErgebnisTabelle ergebnis={basis.soll} />
            </div>
          )}
        </Aufklapp>
        <Aufklapp offen={loesung}>
          <div class="sql-block">
            <div class="zeile">
              <div class="ueberschrift-klein wachsen">Musterlösung</div>
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
      {!rechte && <SchemaAnsicht schema={basis.schema} einfuegen={(w) => einfuegen(w)} />}
    </div>
  );
}

function schemaAusNeu(engine) {
  const db = engine.neueDb();
  try {
    return schemaAus(db);
  } finally {
    db.close();
  }
}

// ---------- Freies Labor ----------

function FreiesLabor({ engine }) {
  const db = useRef(null);
  const [schema, setSchema] = useState([]);
  const [text, setText] = useState(() => entwurf('frei') || 'SELECT * FROM artikel;');
  const [lauf, setLauf] = useState(null);
  const [verlauf, setVerlauf] = useState([]);
  const editor = useRef(null);

  const zuruecksetzen = () => {
    db.current?.close();
    db.current = engine.neueDb();
    setSchema(schemaAus(db.current));
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
    setSchema(schemaAus(db.current));
  };

  const einfuegen = useEinfuegen(editor, text, setText, schema);

  return (
    <div class="sql">
      <div class="sql__haupt">
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
          <Bausteine art="frei" schema={schema} text={text} einfuegen={einfuegen} />
          <div class="aufgabe__knoepfe">
            <Knopf variante="primaer" icon="play" onClick={ausfuehrenJetzt}>
              Ausführen <Kbd>Strg+Enter</Kbd>
            </Knopf>
            <Knopf variante="geist" icon="rotate-ccw" onClick={zuruecksetzen}>
              Datenbank zurücksetzen
            </Knopf>
          </div>
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
        <SchemaAnsicht schema={schema} einfuegen={(w) => einfuegen(w)} />
      </div>
    </div>
  );
}

// ---------- Bausteine zum Antippen ----------

// Reihen mit Titel; je Baustein [Anzeige, eingefügter Text, Cursor zurück]
const KOMMA = [[','], [';']];
const BAUSTEINE = {
  abfragen: [
    ['Befehle', [['SELECT'], ['*'], ['FROM'], ['WHERE'], ['JOIN'], ['LEFT JOIN'], ['ON'], ['GROUP BY'], ['HAVING'], ['ORDER BY'], ['DESC'], ['DISTINCT'], ['AS'], ['UNION'], ...KOMMA]],
    ['Bedingungen', [['='], ['<>'], ['>'], ['<'], ['>='], ['<='], ['AND'], ['OR'], ['NOT'], ["LIKE '%'", "LIKE '%'", 2], ['IS NULL'], ['IS NOT NULL'], ['IN ( )', 'IN ()', 1], ['BETWEEN … AND', 'BETWEEN'], ['EXISTS'], ['( SELECT … )', '(SELECT )', 1]]],
    ['Funktionen', [['COUNT(*)'], ['COUNT( )', 'COUNT()', 1], ['SUM( )', 'SUM()', 1], ['AVG( )', 'AVG()', 1], ['MIN( )', 'MIN()', 1], ['MAX( )', 'MAX()', 1], ['ROUND( , 2)', 'ROUND(, 2)', 4], ['YEAR( )', 'YEAR()', 1], ['LEFT( , n)', 'LEFT(, )', 3], ["' '", "''", 1]]],
  ],
  aendern: [
    ['Befehle', [['INSERT INTO'], ['VALUES ( )', 'VALUES ()', 1], ['( )', '()', 1], ['UPDATE'], ['SET'], ['DELETE FROM'], ['WHERE'], ['SELECT'], ['*'], ['FROM'], ...KOMMA]],
    ['Bedingungen', [['='], ['+'], ['*'], ['AND'], ['IN ( )', 'IN ()', 1], ['NOT IN ( )', 'NOT IN ()', 1], ['( SELECT … )', '(SELECT )', 1], ['YEAR( )', 'YEAR()', 1], ['UPPER( )', 'UPPER()', 1], ["' '", "''", 1]]],
  ],
  struktur: [
    ['Befehle', [['CREATE TABLE'], ['( )', '()', 1], ['ALTER TABLE'], ['ADD COLUMN'], ['DROP TABLE'], ['CREATE INDEX'], ['ON'], ['UPDATE'], ['SET'], ['='], ['||'], ["' '", "''", 1], ...KOMMA]],
    ['Typen & Schlüssel', [['INTEGER'], ['VARCHAR( )', 'VARCHAR()', 1], ['DECIMAL(8,2)'], ['DATE'], ['PRIMARY KEY'], ['NOT NULL'], ['FOREIGN KEY ( )', 'FOREIGN KEY ()', 1], ['REFERENCES']]],
  ],
  rechte: [
    ['Befehle', [['GRANT'], ['REVOKE'], ['ON'], ['TO'], ['FROM'], ['WITH GRANT OPTION'], ['CREATE USER'], ["IDENTIFIED BY ' '", "IDENTIFIED BY ''", 1], ...KOMMA]],
    ['Rechte', [['SELECT'], ['INSERT'], ['UPDATE'], ['DELETE'], ['ALL PRIVILEGES']]],
  ],
};
BAUSTEINE.frei = [BAUSTEINE.abfragen[0], BAUSTEINE.abfragen[1], ['Ändern', [['INSERT INTO'], ['VALUES ( )', 'VALUES ()', 1], ['UPDATE'], ['SET'], ['DELETE FROM'], ['CREATE TABLE'], ['ALTER TABLE'], ['DROP TABLE']]], BAUSTEINE.abfragen[2]];

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

function Bausteine({ art, schema, text, einfuegen }) {
  const tabellen = (schema ?? []).map((t) => t.name);
  const genannt = genannteTabellen(text, tabellen);
  const [gewaehlt, setGewaehlt] = useState(null);
  const aktiv = gewaehlt && tabellen.includes(gewaehlt) ? gewaehlt : genannt[0] ?? null;
  const spalten = aktiv ? schema.find((t) => t.name === aktiv).spalten : [];
  return (
    <div class="sql-bausteine" aria-label="Bausteine zum Antippen">
      {(BAUSTEINE[art] ?? BAUSTEINE.abfragen).map(([titel, reihe]) => (
        <div key={titel} class="sql-bausteine__zeile">
          <span class="sql-bausteine__titel">{titel}</span>
          <div class="sql-bausteine__reihe">
            {reihe.map(([zeige, wort = zeige, zurueck = 0]) => (
              <button key={zeige} type="button" class="sql-baustein sql-baustein--kw" onMouseDown={(e) => e.preventDefault()} onClick={() => einfuegen(wort, zurueck)}>
                {zeige}
              </button>
            ))}
          </div>
        </div>
      ))}
      {tabellen.length > 0 && (
        <div class="sql-bausteine__zeile">
          <span class="sql-bausteine__titel">Tabellen</span>
          <div class="sql-bausteine__reihe">
          {tabellen.map((n) => (
            <button
              key={n}
              type="button"
              class={`sql-baustein sql-baustein--tabelle ${n === aktiv ? 'sql-baustein--aktiv' : ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setGewaehlt(n);
                einfuegen(n);
              }}
            >
              {n}
            </button>
          ))}
          </div>
        </div>
      )}
      {tabellen.length > 0 && (
        <div class="sql-bausteine__zeile">
          <span class="sql-bausteine__titel">Spalten</span>
          <div class="sql-bausteine__reihe">
          {aktiv ? (
            spalten.map(([n, , marke]) => (
              <button key={n} type="button" class="sql-baustein sql-baustein--spalte" onMouseDown={(e) => e.preventDefault()} onClick={() => einfuegen(n)}>
                {marke.includes('PK') && <span class="sql-schema__pk">PK</span>}
                {n}
              </button>
            ))
          ) : (
            <span class="gedaempft sql-bausteine__hinweis">Tippe eine Tabelle an, dann erscheinen hier ihre Spalten.</span>
          )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Grundlagen ----------

function Grundlagen({ engine }) {
  return (
    <div class="sql-grund">
      <section class="flaeche flaeche--gross sql-grund__kopf">
        <div class="ueberschrift-klein ueberschrift-klein--akzent">So ist eine Abfrage aufgebaut</div>
        <div class="sql-grund__klauseln">
          {KLAUSELN.map((k, i) => (
            <span key={k} class="sql-grund__klausel">
              <span class="sql-grund__klausel-nr">{i + 1}</span>
              <span class="mono">{k}</span>
            </span>
          ))}
        </div>
        <p class="gedaempft sql-grund__satz">Immer in dieser Reihenfolge. Nur SELECT und FROM sind Pflicht, der Rest kommt dazu, wenn man ihn braucht.</p>
        <div class="sql-grund__gruppen">
          {BEFEHLSGRUPPEN.map((g) => (
            <div key={g.kurz} class="sql-grund__gruppe">
              <strong class="mono">{g.kurz}</strong>
              <span>{g.name}</span>
              <span class="gedaempft mono">{g.befehle}</span>
            </div>
          ))}
        </div>
      </section>
      <nav class="sql-grund__nav" aria-label="Themen">
        {GRUNDLAGEN.map((g) => (
          <a key={g.id} href={`#sql-${g.id}`} class="sql-baustein" onClick={(e) => (e.preventDefault(), document.getElementById(`sql-${g.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))}>
            {g.titel}
          </a>
        ))}
      </nav>
      {GRUNDLAGEN.map((g) => (
        <section key={g.id} id={`sql-${g.id}`} class="sql-grund__thema">
          <h2 class="sql-grund__titel">{g.titel}</h2>
          <div class="sql-grund__raster">
            {g.befehle.map((b) => (
              <BefehlKarte key={b.name} befehl={b} engine={engine} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function BefehlKarte({ befehl, engine }) {
  const [lauf, setLauf] = useState(null);
  const ausprobieren = () => {
    if (lauf) return setLauf(null);
    const db = engine.neueDb();
    try {
      setLauf(ausfuehren(db, befehl.beispiel));
    } catch (e) {
      setLauf({ fehler: fehlerText(e) });
    } finally {
      db.close();
    }
  };
  const imLabor = () => {
    merkeEntwurf('frei', befehl.beispiel);
    geheZu('AP2', 'trainer', 'sql', { modus: 'frei' });
  };
  return (
    <article class="flaeche sql-befehl">
      <h3 class="sql-befehl__name mono">{befehl.name}</h3>
      <p class="sql-befehl__text">{befehl.text}</p>
      <div class="sql-befehl__syntax">
        <span class="ueberschrift-klein">Aufbau</span>
        <SqlCode text={befehl.syntax} />
      </div>
      {befehl.beispiel && (
        <div class="sql-befehl__beispiel">
          <span class="ueberschrift-klein">Beispiel</span>
          <SqlCode text={befehl.beispiel} />
          {befehl.lauf !== false ? (
            <div class="sql-befehl__knoepfe">
              <Knopf variante="zweit" groesse="s" icon={lauf ? 'x' : 'play'} onClick={ausprobieren}>
                {lauf ? 'Ergebnis ausblenden' : 'Ausprobieren'}
              </Knopf>
              <Knopf variante="geist" groesse="s" icon="pencil" onClick={imLabor}>
                Im Labor bearbeiten
              </Knopf>
            </div>
          ) : (
            <p class="gedaempft sql-block__fuss">Die Übungsdatenbank kennt keine Benutzer – üben kannst du das im Reiter „Benutzer & Rechte".</p>
          )}
          {lauf && <LaufAnzeige lauf={lauf} modus="frei" klein />}
        </div>
      )}
    </article>
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

export function ErgebnisTabelle({ ergebnis }) {
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
          {ergebnis.zeilen.slice(0, GRENZE).map((z, i) => (
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
      {ergebnis.zeilen.length > GRENZE && <p class="gedaempft sql-block__fuss">… und {ergebnis.zeilen.length - GRENZE} weitere Zeilen.</p>}
    </div>
  );
}

function SchemaAnsicht({ schema, einfuegen }) {
  const [offen, setOffen] = useState(() => new Set());
  const umschalten = (n) => {
    const s = new Set(offen);
    s.has(n) ? s.delete(n) : s.add(n);
    setOffen(s);
  };
  return (
    <aside class="flaeche sql-schema" aria-label="Datenbankschema">
      <div class="zeile">
        <Icon name="database" groesse={15} />
        <span class="ueberschrift-klein wachsen">Schema</span>
      </div>
      <p class="gedaempft sql-schema__hilfe">Klick auf einen Namen fügt ihn in den Editor ein. PK = Primärschlüssel, FK = Fremdschlüssel.</p>
      {schema.map((t) => {
        const auf = !offen.has(t.name);
        return (
          <div key={t.name} class="sql-schema__tabelle">
            <div class="sql-schema__kopf">
              <button class="sql-schema__pfeil" aria-expanded={auf} aria-label={`${t.name} ${auf ? 'zuklappen' : 'aufklappen'}`} onClick={() => umschalten(t.name)}>
                <Icon name={auf ? 'chevron-down' : 'chevron-right'} groesse={14} />
              </button>
              <button class="sql-schema__name mono" onClick={() => einfuegen(t.name)}>
                {t.name}
              </button>
              <span class="gedaempft sql-schema__zahl">{t.zeilen}</span>
            </div>
            {auf && (
              <ul class="sql-schema__spalten">
                {t.spalten.map(([name, typ, marke]) => (
                  <li key={name}>
                    <button class="sql-schema__spalte mono" onClick={() => einfuegen(name)}>
                      {marke.includes('PK') && <span class="sql-schema__pk" title="Primärschlüssel">PK</span>}
                      {name}
                    </button>
                    <span class="sql-schema__typ">{typ}</span>
                    {marke.includes('FK') && <span class="sql-schema__fk">{marke.replace(/^PK, /, '')}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </aside>
  );
}

// ---------- SQL hübsch anzeigen ----------

const SCHLUESSELWOERTER = new Set(
  'SELECT FROM WHERE AND OR NOT IN IS NULL AS JOIN INNER LEFT RIGHT OUTER ON GROUP BY HAVING ORDER ASC DESC DISTINCT INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE ALTER ADD COLUMN DROP INDEX PRIMARY KEY FOREIGN REFERENCES UNION ALL EXISTS BETWEEN LIKE GRANT REVOKE TO WITH OPTION PRIVILEGES USER IDENTIFIED CASE WHEN THEN ELSE END LIMIT'.split(' '),
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
