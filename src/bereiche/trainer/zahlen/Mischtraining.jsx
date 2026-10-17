// Gemischtes Training: eine feste Zahl Aufgaben quer durch alle Themen des Lernraums, jedes Thema kommt mindestens
// einmal dran. Am Ende eine Bilanz je Thema mit Sprung in die Themen, bei denen es hakte.

import { useCallback, useMemo, useState } from 'preact/hooks';
import { link } from '../../../router.js';
import { Icon, Knopf } from '../../../ui/bausteine.jsx';
import { zufall } from '../rahmen/zufall.js';
import { baueRunde } from './aufgaben/index.js';
import { Training } from './Training.jsx';

export const GEMISCHT = 'gemischt';
export const MISCH_LAENGE = 10;

export function Mischtraining({ raum, trainer, themen }) {
  const [runde, setRunde] = useState(1);
  const [bilanz, setBilanz] = useState(null);
  const folge = useMemo(() => baueRunde(themen, MISCH_LAENGE, zufall()), [themen, runde]);
  const quelle = useCallback((nr) => folge[nr - 1] ?? null, [folge]);

  return (
    <div class="zt">
      <header class="zt-kopf">
        <a class="zt-zurueck" href={link(raum, 'trainer', trainer.id)}>
          <Icon name="arrow-left" groesse={14} /> Alle Themen
        </a>
        <h1 class="zt-kopf__titel">
          <span class="modul__symbol">
            <Icon name="shuffle" groesse={18} />
          </span>
          Gemischtes Training
        </h1>
        <p class="zt-kopf__text">
          {MISCH_LAENGE} Aufgaben quer durch {themen.length} Themen, ohne Vorwarnung – wie in der Prüfung. Am Ende siehst du, wo es hakt.
        </p>
      </header>
      {bilanz ? (
        <Bilanz
          ergebnisse={bilanz}
          themen={themen}
          raum={raum}
          trainer={trainer}
          onNochmal={() => {
            setBilanz(null);
            setRunde(runde + 1);
          }}
        />
      ) : (
        <Training key={runde} quelle={quelle} laenge={MISCH_LAENGE} onEnde={setBilanz} />
      )}
    </div>
  );
}

function Bilanz({ ergebnisse, themen, raum, trainer, onNochmal }) {
  const richtig = ergebnisse.filter((e) => e.ok).length;
  const jeThema = themen
    .map((t) => {
      const eigene = ergebnisse.filter((e) => e.thema === t.id);
      return { thema: t, n: eigene.length, ok: eigene.filter((e) => e.ok).length };
    })
    .filter((x) => x.n);
  const schwach = jeThema.filter((x) => x.ok < x.n);
  const text = !ergebnisse.length
    ? 'Du hast alle Aufgaben übersprungen – beim nächsten Mal einfach eine Zahl eintippen und prüfen.'
    : !schwach.length
      ? 'Alles richtig – das sitzt. Eine weitere Runde festigt es.'
      : `Wiederhole am besten ${schwach.map((x) => x.thema.name).join(', ')}: Dort steht auf der Themenseite der Rechenweg neben den Aufgaben.`;

  return (
    <section class="flaeche flaeche--gross zt-bilanz erscheinen" aria-label="Bilanz der Runde">
      <div class="zt-bilanz__kopf">
        <div class="zt-bilanz__zahl">
          {richtig}
          <small>von {MISCH_LAENGE} richtig</small>
        </div>
        <p class="zt-bilanz__text">{text}</p>
      </div>
      {jeThema.length > 0 && (
        <ul class="zt-bilanz__liste">
          {jeThema.map((x) => (
            <li key={x.thema.id} class="zt-bilanz__zeile">
              <span class={`zt-feld__status zt-feld__status--${x.ok === x.n ? 'ok' : 'falsch'}`}>
                <Icon name={x.ok === x.n ? 'circle-check' : 'circle-x'} groesse={16} />
              </span>
              <span class="zt-bilanz__name">{x.thema.name}</span>
              <span class="zt-bilanz__punkte">
                {x.ok}/{x.n}
              </span>
              {x.ok < x.n && (
                <a class="knopf knopf--zweit knopf--s" href={link(raum, 'trainer', trainer.id, { modus: x.thema.id })}>
                  Üben
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
      <div class="zt-bilanz__aktionen">
        <Knopf variante="primaer" icon="refresh-cw" onClick={onNochmal}>
          Noch eine Runde
        </Knopf>
        <a class="knopf knopf--geist knopf--m" href={link(raum, 'trainer', trainer.id)}>
          Zur Übersicht
        </a>
      </div>
    </section>
  );
}
