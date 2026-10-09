// Kurz-Check am Ende einer Lektion. Jede Frage ist erst gelöst, wenn sie richtig beantwortet ist; nach einer
// falschen Antwort kommt ein Tipp, nach der richtigen die Erklärung. Sind alle gelöst, meldet der Check onFertig.

import { useEffect, useRef, useState } from 'preact/hooks';
import { Icon, Knopf, Rich } from '../../../../ui/bausteine.jsx';
import { pruefeAntwort } from './checks.js';

export function Check({ fragen, schonVerstanden, onFertig }) {
  const [geloest, setGeloest] = useState(() => fragen.map(() => false));
  const gemeldet = useRef(false);
  const anzahl = geloest.filter(Boolean).length;
  useEffect(() => {
    if (anzahl === fragen.length && !gemeldet.current) {
      gemeldet.current = true;
      onFertig();
    }
  }, [anzahl]);
  return (
    <div class="sn-check">
      <p class="sn-check__kopf">
        {schonVerstanden
          ? 'Du hast diese Lektion schon verstanden – der Check ist zum Wiederholen.'
          : `${fragen.length} kurze Fragen. Sind alle richtig, gilt die Lektion als verstanden.`}
        <span class="sn-check__stand mono">
          {anzahl}/{fragen.length}
        </span>
      </p>
      <ol class="sn-check__liste">
        {fragen.map((f, i) => (
          <Frage key={i} nr={i + 1} frage={f} onGeloest={() => setGeloest((g) => g.map((x, j) => (j === i ? true : x)))} />
        ))}
      </ol>
    </div>
  );
}

function Frage({ nr, frage, onGeloest }) {
  const [falsch, setFalsch] = useState([]); // falsch gewählte Optionen bzw. Zahl falscher Eingaben
  const [richtig, setRichtig] = useState(false);
  const [text, setText] = useState('');
  const [grund, setGrund] = useState(null);
  const [zeigen, setZeigen] = useState(false);

  const loese = () => {
    setRichtig(true);
    onGeloest();
  };

  const waehle = (o) => {
    if (richtig) return;
    if (pruefeAntwort(frage, o).ok) loese();
    else if (!falsch.includes(o)) setFalsch([...falsch, o]);
  };

  const pruefe = (e) => {
    e.preventDefault();
    if (richtig) return;
    const r = pruefeAntwort(frage, text);
    if (r.leer) return;
    if (r.ok) {
      setGrund(null);
      loese();
    } else {
      setGrund(r.grund ?? null);
      setFalsch([...falsch, text]);
    }
  };

  return (
    <li class={`sn-frage ${richtig ? 'sn-frage--richtig' : falsch.length ? 'sn-frage--falsch' : ''}`}>
      <div class="sn-frage__kopf">
        <span class="sn-frage__nr mono">{richtig ? <Icon name="check" groesse={14} strich={2.5} /> : nr}</span>
        <div class="sn-frage__text">
          <Rich text={frage.frage} />
        </div>
      </div>
      {frage.optionen ? (
        <div class="sn-frage__optionen" role="group" aria-label={`Antworten zu Frage ${nr}`}>
          {frage.optionen.map((o) => {
            const istFalsch = falsch.includes(o);
            const istRichtig = richtig && o === frage.richtig;
            return (
              <button
                key={o}
                type="button"
                class={`sn-option ${istFalsch ? 'sn-option--falsch' : ''} ${istRichtig ? 'sn-option--richtig' : ''}`}
                disabled={richtig || istFalsch}
                onClick={() => waehle(o)}
              >
                {istRichtig && <Icon name="circle-check" groesse={15} />}
                {istFalsch && <Icon name="circle-x" groesse={15} />}
                <span>{o}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <form class="sn-frage__eingabe" onSubmit={pruefe}>
          <input
            class={`feld feld--mono ${richtig ? 'feld--richtig' : grund || falsch.length ? 'feld--falsch' : ''}`}
            value={text}
            disabled={richtig}
            spellcheck={false}
            autoComplete="off"
            inputMode={frage.eingabe === 'zahl' || frage.eingabe === 'ipv4' ? 'decimal' : 'text'}
            placeholder={frage.platzhalter ?? (frage.eingabe === 'zahl' ? 'Zahl' : frage.eingabe === 'ipv4' ? 'z. B. 192.168.1.0' : '')}
            aria-label={`Antwort zu Frage ${nr}`}
            onInput={(e) => setText(e.currentTarget.value)}
          />
          {!richtig && (
            <Knopf variante="zweit" groesse="s" type="submit" icon="check">
              Prüfen
            </Knopf>
          )}
        </form>
      )}
      {!richtig && falsch.length > 0 && (
        <div class="sn-frage__tipp" role="status">
          <Icon name="lightbulb" groesse={15} />
          <span>
            {grund ? `${grund} ` : 'Noch nicht. '}
            {frage.tipp}
            {!frage.optionen && falsch.length >= 2 && !zeigen && (
              <>
                {' '}
                <button type="button" class="sn-link" onClick={() => setZeigen(true)}>
                  Lösung zeigen
                </button>
              </>
            )}
            {zeigen && (
              <>
                {' '}
                Lösung: <strong class="mono">{frage.loesung}</strong> – tipp sie ein, dann zählt die Frage.
              </>
            )}
          </span>
        </div>
      )}
      {richtig && (
        <div class="sn-frage__erkl erscheinen" role="status">
          <Icon name="circle-check" groesse={15} />
          <span>
            <strong>Richtig.</strong> {frage.erklaerung}
          </span>
        </div>
      )}
    </li>
  );
}
