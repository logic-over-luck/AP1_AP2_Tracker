// Wichtigkeit: Legende der Stufen, Stichpunkte je Stufe im Raum und wie gerechnet wird.
// Liest Stufen, Grenzen und Rechenweg aus src/daten/wichtigkeit.js, damit Text und Verhalten übereinstimmen.

import { useState } from 'preact/hooks';
import { inhalt } from '../../daten/inhalt.js';
import { useLernstand } from '../../lernstand/store.js';
import { STUFEN, LAMBDA, BEREICH, terminName, wichtigkeitText } from '../../daten/wichtigkeit.js';
import { link } from '../../router.js';
import { Icon, StufenZeichen, StufenBalken, Aufklapp } from '../../ui/bausteine.jsx';

const prozent = (x) => `${Math.round(x * 100)} %`;

export function Wichtigkeit({ raum }) {
  const stand = useLernstand();
  const r = inhalt.raeume.get(raum);
  const w = r.wichtig;
  const sps = r.bloeckeListe.flatMap((b) => b.sp.map((id) => inhalt.sp.get(id)).filter(Boolean));
  const jeStufe = STUFEN.map((s) => sps.filter((x) => x.wichtig.stufe === s.nr).sort((a, b) => b.wichtig.quote - a.wichtig.quote || a.titel.localeCompare(b.titel, 'de')));
  const [offen, setOffen] = useState(null);

  return (
    <div class="wichtigkeit">
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">Nachschlagen</div>
          <h1 class="seitenkopf__titel">Wichtigkeit</h1>
          <p class="seitenkopf__text">
            Wie oft ein Stichpunkt in den ausgewerteten IHK-Prüfungen von {r.name} vorkam. Die Stufe sagt, was bisher geprüft wurde – nicht, was sicher kommt.
          </p>
        </div>
      </header>

      <section class="flaeche flaeche--gross wichtigkeit__stufen" aria-label="Die fünf Stufen">
        {STUFEN.map((s, i) => (
          <div key={s.nr} class="wichtigkeit__stufe">
            <button class="wichtigkeit__kopf" aria-expanded={offen === s.nr} onClick={() => setOffen(offen === s.nr ? null : s.nr)}>
              <StufenZeichen nr={s.nr} groesse={16} />
              <span class="wichtigkeit__name">{s.name}</span>
              <span class="wichtigkeit__grenze mono">{s.ab === null ? 'kein Beleg' : s.ab === 0 ? `unter ${prozent(STUFEN[i - 1].ab)}` : `ab ${prozent(s.ab)}`}</span>
              <span class="wichtigkeit__text">{s.text}</span>
              <span class="wichtigkeit__zahl tabellenziffern">{jeStufe[i].length}</span>
              <Icon name="chevron-down" groesse={16} class="wichtigkeit__pfeil" />
            </button>
            <Aufklapp offen={offen === s.nr}>
              {jeStufe[i].length ? (
                <ul class="wichtigkeit__liste">
                  {jeStufe[i].map((x) => (
                    <li key={x.id}>
                      <a class={`wichtigkeit__sp ${stand.spErledigt.has(x.id) ? 'wichtigkeit__sp--erledigt' : ''}`} href={link(raum, 'lernen', null, { sp: x.id })}>
                        <span class="wichtigkeit__sp-titel">{x.titel}</span>
                        <span class="gedaempft wichtigkeit__sp-zahl">{x.wichtig.x ? `${x.wichtig.x} von ${x.wichtig.n}` : '–'}</span>
                        <Icon name="arrow-right" groesse={13} />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="gedaempft wichtigkeit__leer">In {r.name} liegt kein Stichpunkt in dieser Stufe.</p>
              )}
            </Aufklapp>
          </div>
        ))}
      </section>

      <div class="hilfe-raster">
        <section class="flaeche flaeche--gross hilfe-abschnitt">
          <h2 class="hilfe-abschnitt__titel">
            <span class="hilfe-abschnitt__symbol">
              <Icon name="calculator" groesse={18} />
            </span>
            So wird gerechnet
          </h2>
          <div class="hilfe-abschnitt__text">
            <p>
              Grundlage sind <strong>{w.n} ausgewertete Prüfungen</strong> ({w.termine.length ? `${terminName(w.termine[0])} bis ${terminName(w.termine.at(-1))}` : '–'}), davon {w.aktuell} nach dem
              aktuellen Prüfungskatalog. Jede Prüfung zählt je Stichpunkt höchstens einmal, nach aktuellem Katalog voll, nach altem Katalog mit 0,6.
              {w.nurStichwort.length > 0 && (
                <>
                  {' '}
                  Von {w.nurStichwort.map(terminName).join(', ')} gibt es keine Abschrift; dort zählen die Themen-Stichworte des IT-Berufe-Podcasts mit halbem Gewicht.
                </>
              )}
            </p>
            <p>
              Die Stufe kommt aus dem Anteil dieser gewichteten Prüfungen, in denen der Stichpunkt vorkam. Angezeigt wird die einfache Zahl: „in 4 von {w.n} Prüfungen“.
            </p>
            <p>
              Welche Aufgabe welchen Stichpunkt prüft, ist doppelt geprüft: Zwei unabhängige Zuordnungen jeder Teilaufgabe, und wo sie sich uneinig waren, hat ein
              Schiedsspruch an der Musterlösung entschieden. Gezählt wird ein Stichpunkt nur, wenn man seinen Stoff zum Lösen wirklich braucht. Als Gegenprobe
              dienten die Themenlisten des IT-Berufe-Podcasts.
            </p>
            <p>
              <strong>„auch in 4 von 10 PB2“</strong>: Der Stoff wohnt in diesem Prüfungsteil, wurde aber auch in Prüfungen des anderen Teils abgefragt. Das steht als
              Hinweis dabei und ändert die Stufe nicht.
            </p>
            <p>
              <strong>Wahrscheinlich … bis …</strong>: Mit so wenigen Prüfungen ist jede Zahl unsicher. Der Bereich zeigt, wie oft der Stichpunkt bei {w.n} Prüfungen plausibel drankäme ({Math.round((BEREICH[1] - BEREICH[0]) * 100)}-%-Bereich).
              „Oft“ und „Manchmal“ lassen sich deshalb nicht scharf trennen – die Stufe ist Orientierung, keine Vorhersage.
            </p>
          </div>
        </section>

        <section class="flaeche flaeche--gross hilfe-abschnitt">
          <h2 class="hilfe-abschnitt__titel">
            <span class="hilfe-abschnitt__symbol">
              <Icon name="list-checks" groesse={18} />
            </span>
            Block und Themenbereich
          </h2>
          <div class="hilfe-abschnitt__text">
            <p>
              <strong>Block:</strong> ein Zeichen je Stichpunkt, sortiert von oft nach nie, zum Beispiel <StufenZeichen nr={1} /> <StufenZeichen nr={2} /> <StufenZeichen nr={3} /> <StufenZeichen nr={5} />. Bei mehr als
              sechs Stichpunkten ein Balken. Es gibt keine Durchschnitts-Stufe – sie würde verdecken, welcher Stichpunkt wichtig ist.
            </p>
            <p>
              <strong>Themenbereich:</strong> welcher Anteil der Prüfungsaufgaben ihn betrifft, mit der Verteilung der Stufen <StufenBalken anzahl={[0, 2, 3, 4, 1, 2]} breite="60px" />.
            </p>
          </div>
        </section>

        <section class="flaeche flaeche--gross hilfe-abschnitt">
          <h2 class="hilfe-abschnitt__titel">
            <span class="hilfe-abschnitt__symbol">
              <Icon name="layers" groesse={18} />
            </span>
            Grundlagen und Reihenfolge
          </h2>
          <div class="hilfe-abschnitt__text">
            <p>
              „<strong>Grundlage für 3</strong>“ heißt: Drei andere Stichpunkte bauen darauf auf, auch in späteren Prüfungsteilen. Das ändert die Stufe nicht, zählt aber für „Heute im
              Fokus“: Ein Thema, auf dem oft geprüfte Themen aufbauen, kommt früher dran.
            </p>
            <p class="gedaempft">
              Reihenfolge-Wert = eigener Anteil + {String(LAMBDA).replace('.', ',')} × Anteile der offenen Stichpunkte, die darauf aufbauen. Ein Block zählt mit seinem wichtigsten offenen Stichpunkt.
            </p>
          </div>
        </section>

        <section class="flaeche flaeche--gross hilfe-abschnitt">
          <h2 class="hilfe-abschnitt__titel">
            <span class="hilfe-abschnitt__symbol">
              <Icon name="info" groesse={18} />
            </span>
            Wofür die Stufe nicht taugt
          </h2>
          <div class="hilfe-abschnitt__text">
            <p>
              „Bisher nicht geprüft“ heißt nicht unwichtig: Alles im Lernplan steht im Prüfungskatalog und kann drankommen. Und die Stufe sagt nichts darüber, wie tief du ein Thema können
              musst – das steht an den Können-Aussagen.
            </p>
            <p>
              Die Stufe beschreibt die Vergangenheit. Ein „sehr oft geprüfter“ Stichpunkt kam in der jeweils nächsten Prüfung in gut der Hälfte der Fälle wieder dran (WiSo, PB2),
              in PB1 in gut einem Viertel.
            </p>
            {raum === 'AP1' && (
              <p>
                In AP1 sagen die älteren Prüfungen die neuen nur schwach vorher (neuer Katalog ab 2025, breit gestreute Aufgaben): Von den „sehr oft geprüften“ Stichpunkten war in der
                nächsten Prüfung nur knapp jeder vierte dran. Lerne dort nicht nur nach der Stufe.
              </p>
            )}
            {jeStufe.flat()[0] && <p class="gedaempft">Beispiel: „{jeStufe.flat()[0].titel}“ – {wichtigkeitText(jeStufe.flat()[0].wichtig)}</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
