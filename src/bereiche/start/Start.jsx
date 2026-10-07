// Cockpit eines Lernraums – steht oben auf der Lernplan-Seite. Alles auf einen Blick, ohne Aufklappen:
// – nächster Schritt (mit „Danach", Schwächen und Stärken)
// – Fortschritt: Lernplan, Prüfungstermin und Tempo in einer Kachel, weil sie zusammenhängen
// – Lernkarten
// – Serie mit Rang und Aktivität der letzten Wochen
// – Fokus-Timer

import { useEffect, useState } from 'preact/hooks';
import { inhalt } from '../../daten/inhalt.js';
import { useLernstand, erfasse } from '../../lernstand/store.js';
import { kartenZustand } from '../../lernstand/ableiten.js';
import { heuteImFokus, staerkenUndSchwaechen, tempo } from '../../lernstand/empfehlung.js';
import { datumLang, tagPlus } from '../../lernstand/zeit.js';
import { link, geheZu } from '../../router.js';
import { Icon, Knopf, Balken, Zahl, PrioMarke, Marke, Ring } from '../../ui/bausteine.jsx';
import { Dialog } from '../../ui/dialog.jsx';
import { FokusTimer } from './FokusTimer.jsx';
import { Woche } from './Aktivitaet.jsx';
import { introLaeuft, aufIntroStart, aufIntroEnde, frischGeoeffnet } from '../intro/Intro.jsx';

function gruss() {
  const h = new Date().getHours();
  if (h < 5) return 'Noch wach?';
  if (h < 11) return 'Guten Morgen.';
  if (h < 17) return 'Schön, dass du da bist.';
  if (h < 22) return 'Guten Abend.';
  return 'Späte Lernrunde?';
}

export function Uebersicht({ raum }) {
  const stand = useLernstand();
  const r = inhalt.raeume.get(raum);
  const [terminOffen, setTerminOffen] = useState(false);
  // Auftritt der Kacheln: Läuft gerade das Intro, warten sie unsichtbar und treten auf, sobald es
  // vorbei ist (auch nach Überspringen oder Abspielen per Logo). Sonst nur beim ersten Anzeigen im Tab.
  const [auftritt, setAuftritt] = useState(() => {
    const frisch = frischGeoeffnet.wert;
    frischGeoeffnet.wert = false;
    return introLaeuft() ? 'wartet' : frisch ? 1 : 0;
  });
  useEffect(() => {
    let runde = typeof auftritt === 'number' ? auftritt : 0;
    const weg1 = aufIntroStart(() => setAuftritt('wartet'));
    const weg2 = aufIntroEnde(() => setAuftritt(++runde || 1));
    return () => (weg1(), weg2());
  }, []);

  const spIds = r.bloeckeListe.flatMap((b) => b.sp);
  const spErledigt = spIds.filter((id) => stand.spErledigt.has(id)).length;
  const bloeckeFertig = r.bloeckeListe.filter((b) => b.sp.every((id) => stand.spErledigt.has(id))).length;
  const karten = kartenZustand(stand, inhalt.kartenJeRaum.get(raum) ?? []);
  const fokus = heuteImFokus(stand, inhalt, raum);
  const sus = staerkenUndSchwaechen(stand, inhalt, raum);
  const t = tempo(stand, inhalt, raum);
  const termin = stand.termine[raum] ?? null;
  const gemerkt = [...stand.gemerkt].filter((id) => inhalt.karten.has(id) && inhalt.raumVon(id) === raum).length;

  return (
    <section class={`cockpit ${auftritt === 'wartet' ? 'cockpit--wartet' : auftritt ? 'cockpit--auftritt' : ''}`} aria-label="Übersicht">
      <header class="cockpit__kopf">
        <h1 class="cockpit__gruss">{gruss()}</h1>
        <span class="ueberschrift-klein">
          {r.name} · {datumLang(stand.heute)}
        </span>
      </header>
      <div class="cockpit__raster" key={auftritt}>
        <Fortschritt
          i={0}
          erledigt={spErledigt}
          gesamt={spIds.length}
          bloeckeFertig={bloeckeFertig}
          bloecke={r.bloeckeListe.length}
          termin={termin}
          t={t}
          onTermin={() => setTerminOffen(true)}
        />
        <KartenKachel i={1} raum={raum} karten={karten} gemerkt={gemerkt} />
        <SerieKachel i={2} stand={stand} />
        <FokusTimer i={3} raum={raum} kompakt />
        <Fokus i={4} raum={raum} fokus={fokus} sus={sus} />
      </div>
      <TerminDialog offen={terminOffen} raum={raum} termin={termin} heute={stand.heute} onSchliessen={() => setTerminOffen(false)} />
    </section>
  );
}

function Fokus({ i, raum, fokus, sus }) {
  const h = fokus.haupt;
  const zuBlock = (block) => geheZu(raum, 'lernen', null, { block: block.id });
  const karten = (quelle) => geheZu(raum, 'karten', 'sitzung', { quelle });
  const unten = [
    ...fokus.weitere.slice(0, 2).map((v) => ({ block: v.block, icon: v.art === 'wiederholung' ? 'refresh-cw' : v.art === 'weiter' ? 'step-forward' : 'circle', vor: 'Danach', nach: v.etikett })),
    ...sus.schwaechen.slice(0, 2).map((w) => ({ block: w.block, icon: 'target', ton: 'text-warn', vor: 'Wiederholen lohnt' })),
    ...sus.staerken.slice(0, 1).map((w) => ({ block: w.block, icon: 'circle-check', ton: 'text-gut', vor: 'Sitzt gut' })),
  ].slice(0, 4);
  return (
    <section class="flaeche flaeche--akzent kachel kachel--fokus" aria-label="Dein nächster Schritt" style={{ '--i': i }}>
      <div class="fokus-haupt">
      <div class="kachel__kopf kachel__kopf--akzent">
        <Icon name="sparkles" groesse={14} /> Dein nächster Schritt
        {h && (
          <span class="kachel__marken">
            <Marke ton={h.art === 'wiederholung' ? 'warn' : 'akzent'} icon={h.art === 'wiederholung' ? 'refresh-cw' : h.art === 'weiter' ? 'step-forward' : 'rocket'}>
              {h.etikett}
            </Marke>
            <PrioMarke prio={h.block.prio} pruefungen={h.block.pruefungen} punkte={h.block.punkte} />
          </span>
        )}
      </div>
      <h2 class="fokus-karte__titel">{h ? h.block.titel : 'Alles abgehakt und wiederholt.'}</h2>
      {h?.block.satz && <p class="fokus-karte__satz">{h.block.satz}</p>}
      <p class="fokus-karte__grund">
        <Icon name="lightbulb" groesse={14} />
        <span>{h ? h.grund : fokus.karten.faellig ? `${fokus.karten.faellig} Lernkarten warten auf dich.` : 'Halte das Wissen mit Lernkarten und Trainern frisch.'}</span>
      </p>
      <div class="fokus-karte__knoepfe">
        <Knopf variante="primaer" iconRechts="arrow-right" onClick={() => (h ? zuBlock(h.block) : karten('faellig'))}>
          {h ? (h.art === 'wiederholung' ? 'Jetzt wiederholen' : 'Lernen starten') : 'Karten lernen'}
        </Knopf>
        <Knopf icon="layers" zahl={fokus.karten.faellig || null} onClick={() => karten('faellig')}>
          Fällige Karten
        </Knopf>
        <Knopf variante="geist" icon="shuffle" onClick={() => karten('mix')}>
          Zufallsmix
        </Knopf>
      </div>
      </div>
      {unten.length > 0 && (
        <div class="fokus-neben" aria-label="Danach">
          {unten.map((u) => (
            <button key={u.vor + u.block.id} class="fokus-weiter" onClick={() => zuBlock(u.block)}>
              <Icon name={u.icon} groesse={14} class={u.ton ?? ''} />
              <span class="wachsen fokus-neben__text">
                <span class="fokus-neben__vor">{u.vor}</span>
                {u.block.titel}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

// Lernplan, Prüfungstermin und Tempo in einer Kachel – sie hängen zusammen
function Fortschritt({ i, erledigt, gesamt, bloeckeFertig, bloecke, termin, t, onTermin }) {
  const anteil = gesamt ? erledigt / gesamt : 0;
  const imPlan = t.offen === 0 || (t.tage > 0 && t.dieseWoche >= t.jeWoche);
  return (
    <section class="flaeche kachel" aria-label="Fortschritt und Prüfung" style={{ '--i': i }}>
      <div class="kachel__kopf">
        <Icon name="trending-up" groesse={14} /> Fortschritt
      </div>
      <div class="fortschritt">
        <div class="fortschritt__ring">
          <Ring wert={anteil} groesse={64} dicke={6} />
          <span class="fortschritt__prozent tabellenziffern">{Math.round(anteil * 100)}%</span>
        </div>
        <div class="fortschritt__zahlen">
          <div>
            <strong class="tabellenziffern">{erledigt}</strong>
            <span class="gedaempft"> / {gesamt} Stichpunkte</span>
          </div>
          <div>
            <strong class="tabellenziffern">{bloeckeFertig}</strong>
            <span class="gedaempft"> / {bloecke} Blöcke</span>
          </div>
          {termin && t.offen > 0 && t.tage > 0 && (
            <div class={`fortschritt__tempo ${imPlan ? 'text-gut' : 'text-warn'}`}>{imPlan ? 'Du liegst im Plan' : `${t.jeWoche} Stichpunkte/Woche nötig`}</div>
          )}
        </div>
      </div>
      <button class="kachel__fuss kachel__fuss--knopf" onClick={onTermin}>
        <Icon name="calendar-days" groesse={13} />
        <span class="wachsen">
          {!termin ? (
            'Prüfungstermin festlegen'
          ) : t.tage < 0 ? (
            'Prüfung vorbei'
          ) : (
            <>
              Prüfung in <strong>{t.tage}</strong> {t.tage === 1 ? 'Tag' : 'Tagen'}
            </>
          )}
        </span>
        <Icon name="chevron-right" groesse={13} />
      </button>
    </section>
  );
}

function KartenKachel({ i, raum, karten, gemerkt }) {
  const sicher = karten.gesamt ? karten.sicher / karten.gesamt : 0;
  return (
    <a class="flaeche flaeche--klickbar kachel" href={link(raum, 'karten')} aria-label="Lernkarten" style={{ '--i': i }}>
      <div class="kachel__kopf">
        <Icon name="layers" groesse={14} /> Lernkarten
      </div>
      <div class="kachel__wert">
        {karten.faellig > 0 ? (
          <>
            <span class="text-warn">
              <Zahl wert={karten.faellig} />
            </span>
            <small>fällig</small>
          </>
        ) : (
          <>
            <Zahl wert={sicher * 100} />
            <small>% sicher</small>
          </>
        )}
      </div>
      <Balken wert={sicher} label="Lernkarten sicher" />
      <div class="kachel__fuss gedaempft">
        {karten.neu} neu · {karten.gesamt - karten.neu} gesehen{gemerkt ? ` · ${gemerkt} gemerkt` : ''}
      </div>
    </a>
  );
}

// Serie, Rang und Aktivität: alles, was „dranbleiben" zeigt
function SerieKachel({ i, stand }) {
  return (
    <button class="flaeche flaeche--klickbar kachel" onClick={() => window.dispatchEvent(new CustomEvent('raenge-zeigen'))} aria-label="Serie, Rang und Aktivität" style={{ '--i': i }}>
      <div class="kachel__kopf">
        <Icon name="flame" groesse={14} class={stand.serie.heuteAktiv ? 'flamme-an' : ''} /> Serie
        <span class="kachel__rang">{stand.rang.name}</span>
      </div>
      <div class="kachel__wert">
        <Zahl wert={stand.serie.aktuell} />
        <small>{stand.serie.aktuell === 1 ? 'Tag' : 'Tage'}</small>
        <span class="kachel__neben">{stand.serie.heuteAktiv ? 'heute dabei' : 'heute noch offen'}</span>
      </div>
      <Woche stand={stand} />
    </button>
  );
}

function TerminDialog({ offen, raum, termin, heute, onSchliessen }) {
  const [wert, setWert] = useState(termin ?? '');
  const r = inhalt.raeume.get(raum);
  const speichere = (d) => {
    erfasse({ e: 'termin', r: raum, d: d || null });
    onSchliessen();
  };
  return (
    <Dialog
      offen={offen}
      titel={`Prüfungstermin ${r.name}`}
      icon="calendar-days"
      onSchliessen={onSchliessen}
      aktionen={
        <>
          {termin && (
            <Knopf variante="geist" onClick={() => speichere(null)}>
              Termin entfernen
            </Knopf>
          )}
          <span class="wachsen" />
          <Knopf variante="geist" onClick={onSchliessen}>
            Abbrechen
          </Knopf>
          <Knopf variante="primaer" disabled={!wert} onClick={() => speichere(wert)}>
            Speichern
          </Knopf>
        </>
      }
    >
      <p>Jeder Lernraum hat seinen eigenen Termin. Daraus berechnet das Lernstudio die Tage bis zur Prüfung und dein Wochentempo.</p>
      <label class="stapel" style={{ marginTop: '16px' }}>
        <span class="ueberschrift-klein">Datum der Prüfung</span>
        <input class="feld" type="date" value={wert} min={tagPlus(heute, -365)} onInput={(e) => setWert(e.currentTarget.value)} autoFocus />
      </label>
    </Dialog>
  );
}

