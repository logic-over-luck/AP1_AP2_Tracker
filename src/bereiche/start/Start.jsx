// Kompakte Übersicht eines Lernraums – steht oben auf der Lernplan-Seite:
// eine Zahlenleiste, dein nächster Schritt und aufklappbar Tempo, Bilanz, Fokus-Timer und Aktivität.

import { useState } from 'preact/hooks';
import { inhalt } from '../../daten/inhalt.js';
import { useLernstand, erfasse } from '../../lernstand/store.js';
import { kartenZustand } from '../../lernstand/ableiten.js';
import { useEinstellung } from '../../lernstand/einstellungen.js';
import { heuteImFokus, staerkenUndSchwaechen, tempo } from '../../lernstand/empfehlung.js';
import { datumLang, datumKurz, tageZwischen, tagPlus, tagVon } from '../../lernstand/zeit.js';
import { link, geheZu } from '../../router.js';
import { Icon, Knopf, Balken, Zahl, PrioMarke, Marke, Aufklapp } from '../../ui/bausteine.jsx';
import { Dialog } from '../../ui/dialog.jsx';
import { FokusTimer } from './FokusTimer.jsx';
import { Aktivitaet } from './Aktivitaet.jsx';

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
  const [mehr, setMehr] = useEinstellung('uebersicht.mehr', false);

  const spIds = r.bloeckeListe.flatMap((b) => b.sp);
  const spErledigt = spIds.filter((id) => stand.spErledigt.has(id)).length;
  const anteilPlan = spIds.length ? spErledigt / spIds.length : 0;
  const bloeckeFertig = r.bloeckeListe.filter((b) => b.sp.every((id) => stand.spErledigt.has(id))).length;
  const karten = kartenZustand(stand, inhalt.kartenJeRaum.get(raum) ?? []);
  const fokus = heuteImFokus(stand, inhalt, raum);
  const sus = staerkenUndSchwaechen(stand, inhalt, raum);
  const t = tempo(stand, inhalt, raum);
  const termin = stand.termine[raum] ?? null;
  const tageBis = termin ? tageZwischen(stand.heute, termin) : null;
  const gemerkt = [...stand.gemerkt].filter((id) => inhalt.karten.has(id) && inhalt.raumVon(id) === raum).length;

  return (
    <section class="uebersicht" aria-label="Übersicht">
      <header class="uebersicht__kopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">
            {r.name} · {datumLang(stand.heute)}
          </div>
          <h1 class="uebersicht__titel">{gruss()}</h1>
        </div>
      </header>

      <div class="flaeche uebersicht__zahlen">
        <a class="uzahl" href="#lernplan" onClick={(e) => (e.preventDefault(), document.getElementById('lernplan')?.scrollIntoView({ behavior: 'smooth' }))}>
          <span class="uzahl__kopf">
            <Icon name="list-checks" groesse={14} /> Lernplan
          </span>
          <span class="uzahl__wert">
            <Zahl wert={anteilPlan * 100} />
            <small>%</small>
          </span>
          <span class="uzahl__text">
            {spErledigt}/{spIds.length} Stichpunkte · {bloeckeFertig}/{r.bloeckeListe.length} Blöcke
          </span>
          <Balken wert={anteilPlan} label="Lernplan" />
        </a>
        <a class="uzahl" href={link(raum, 'karten')}>
          <span class="uzahl__kopf">
            <Icon name="layers" groesse={14} /> Lernkarten
          </span>
          <span class="uzahl__wert">
            {karten.faellig > 0 ? (
              <>
                <span class="text-warn">
                  <Zahl wert={karten.faellig} />
                </span>
                <small>fällig</small>
              </>
            ) : (
              <>
                <Zahl wert={karten.gesamt ? (karten.sicher / karten.gesamt) * 100 : 0} />
                <small>% sicher</small>
              </>
            )}
          </span>
          <span class="uzahl__text">
            {karten.gesamt - karten.neu} von {karten.gesamt} gesehen
          </span>
          <Balken wert={karten.gesamt ? karten.sicher / karten.gesamt : 0} label="Lernkarten sicher" />
        </a>
        <button class="uzahl" onClick={() => window.dispatchEvent(new CustomEvent('raenge-zeigen'))}>
          <span class="uzahl__kopf">
            <Icon name="flame" groesse={14} class={stand.serie.heuteAktiv ? 'flamme-an' : ''} /> Serie
          </span>
          <span class="uzahl__wert">
            <Zahl wert={stand.serie.aktuell} />
            <small>{stand.serie.aktuell === 1 ? 'Tag' : 'Tage'}</small>
          </span>
          <span class="uzahl__text">
            <span class="text-akzent">{stand.rang.name}</span>
            {stand.serie.heuteAktiv ? ' · heute dabei' : ' · heute noch offen'}
          </span>
          <Balken wert={stand.rang.anteil} label="Fortschritt zum nächsten Rang" />
        </button>
        <button class="uzahl" onClick={() => setTerminOffen(true)}>
          <span class="uzahl__kopf">
            <Icon name="calendar-days" groesse={14} /> Prüfung
          </span>
          {termin ? (
            <>
              <span class="uzahl__wert">
                {tageBis >= 0 ? <Zahl wert={tageBis} /> : '–'}
                <small>{tageBis === 1 ? 'Tag' : 'Tage'}</small>
              </span>
              <span class="uzahl__text">
                {datumKurz(termin)}
                {tageBis < 0 ? ' · vorbei' : tageBis === 0 ? ' · heute! Viel Erfolg!' : ''}
              </span>
            </>
          ) : (
            <>
              <span class="uzahl__wert uzahl__wert--leer">–</span>
              <span class="uzahl__text uzahl__link">
                Termin festlegen <Icon name="arrow-right" groesse={12} />
              </span>
            </>
          )}
        </button>
      </div>

      <Fokus raum={raum} fokus={fokus} gemerkt={gemerkt} />

      <button class="uebersicht__mehr" aria-expanded={mehr} onClick={() => setMehr(!mehr)}>
        <Icon name="chevron-down" groesse={14} class={`spickzettel__pfeil ${mehr ? 'spickzettel__pfeil--offen' : ''}`} />
        {mehr ? 'Weniger anzeigen' : 'Mehr: Tempo, Stärken & Schwächen, Fokus-Timer, Aktivität'}
      </button>
      <Aufklapp offen={mehr}>
        <div class="start-raster">
          <div class="stapel stapel--4">
            <Tempo t={t} raum={raum} onTermin={() => setTerminOffen(true)} />
            <Bilanz raum={raum} fokus={fokus} sus={sus} />
          </div>
          <div class="stapel stapel--4">
            <FokusTimer raum={raum} />
            <Aktivitaet stand={stand} />
          </div>
        </div>
      </Aufklapp>

      <TerminDialog offen={terminOffen} raum={raum} termin={termin} heute={stand.heute} onSchliessen={() => setTerminOffen(false)} />
    </section>
  );
}

function Fokus({ raum, fokus, gemerkt }) {
  const h = fokus.haupt;
  const zuBlock = (block) => geheZu(raum, 'lernen', null, { block: block.id });
  const karten = (quelle) => geheZu(raum, 'karten', 'sitzung', { quelle });
  return (
    <section class="flaeche flaeche--akzent fokus-karte fokus-karte--kompakt" aria-label="Dein nächster Schritt">
      <div class="fokus-karte__links">
        <div class="zeile fokus-karte__etikett">
          <span class="ueberschrift-klein ueberschrift-klein--akzent zeile">
            <Icon name="sparkles" groesse={13} /> Nächster Schritt
          </span>
          {h && (
            <>
              <Marke ton={h.art === 'wiederholung' ? 'warn' : 'akzent'} icon={h.art === 'wiederholung' ? 'refresh-cw' : h.art === 'weiter' ? 'step-forward' : 'rocket'}>
                {h.etikett}
              </Marke>
              <PrioMarke prio={h.block.prio} pruefungen={h.block.pruefungen} punkte={h.block.punkte} />
            </>
          )}
        </div>
        <h2 class="fokus-karte__titel">{h ? h.block.titel : 'Alles abgehakt und wiederholt.'}</h2>
        <p class="fokus-karte__grund">
          <Icon name="lightbulb" groesse={14} />{' '}
          {h ? h.grund : fokus.karten.faellig ? `${fokus.karten.faellig} Lernkarten warten auf dich.` : 'Halte das Wissen mit Lernkarten und Trainern frisch.'}
        </p>
      </div>
      <div class="fokus-karte__knoepfe">
        <Knopf variante="primaer" iconRechts="arrow-right" onClick={() => (h ? zuBlock(h.block) : karten('faellig'))}>
          {h ? (h.art === 'wiederholung' ? 'Jetzt wiederholen' : 'Lernen starten') : 'Karten lernen'}
        </Knopf>
        <Knopf icon="layers" zahl={fokus.karten.faellig || null} onClick={() => karten('faellig')}>
          Fällige Karten
        </Knopf>
        <Knopf icon="shuffle" onClick={() => karten('mix')}>
          Zufallsmix
        </Knopf>
        {gemerkt > 0 && (
          <Knopf icon="bookmark" zahl={gemerkt} onClick={() => karten('gemerkt')}>
            Gemerkt
          </Knopf>
        )}
      </div>
    </section>
  );
}

function Bilanz({ raum, fokus, sus }) {
  const zuBlock = (block) => geheZu(raum, 'lernen', null, { block: block.id });
  return (
    <section class="flaeche flaeche--innen bilanz">
      {fokus.weitere.length > 0 && (
        <div class="fokus-karte__weitere bilanz__danach">
          <div class="ueberschrift-klein">Danach</div>
          {fokus.weitere.map((v) => (
            <button key={v.block.id} class="fokus-weiter" onClick={() => zuBlock(v.block)}>
              <Icon name={v.art === 'wiederholung' ? 'refresh-cw' : v.art === 'weiter' ? 'step-forward' : 'circle'} groesse={14} />
              <span class="wachsen">{v.block.titel}</span>
              <span class="gedaempft">{v.etikett}</span>
            </button>
          ))}
        </div>
      )}
      <div class="fokus-karte__bilanz">
        <div>
          <div class="ueberschrift-klein">Das sitzt schon gut</div>
          {sus.staerken.length ? (
            sus.staerken.map((w) => (
              <button key={w.block.id} class="bilanz-eintrag" onClick={() => zuBlock(w.block)}>
                <Icon name="circle-check" groesse={14} class="text-gut" /> {w.block.titel}
              </button>
            ))
          ) : (
            <p class="bilanz-leer">Zeigt sich, sobald du Karten und Aufgaben sicher beherrschst.</p>
          )}
        </div>
        <div>
          <div class="ueberschrift-klein">Hier lohnt sich Wiederholen</div>
          {sus.schwaechen.length ? (
            sus.schwaechen.map((w) => (
              <button key={w.block.id} class="bilanz-eintrag" onClick={() => zuBlock(w.block)}>
                <Icon name="target" groesse={14} class="text-warn" /> {w.block.titel}
              </button>
            ))
          ) : (
            <p class="bilanz-leer">Noch keine Schwachstellen – oder noch zu wenig geübt.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Tempo({ t, onTermin }) {
  if (!t.termin) {
    return (
      <section class="flaeche flaeche--innen tempo">
        <div class="zeile zeile--3">
          <Icon name="route" groesse={18} class="gedaempft" />
          <div class="wachsen">
            <div class="tempo__titel">Dein Tempo bis zur Prüfung</div>
            <div class="gedaempft">Trag deinen Prüfungstermin ein, dann rechne ich dir aus, wie viel du pro Woche schaffen solltest.</div>
          </div>
          <Knopf groesse="s" onClick={onTermin}>
            Termin festlegen
          </Knopf>
        </div>
      </section>
    );
  }
  const imPlan = t.offen === 0 || (t.tage > 0 && t.dieseWoche >= t.jeWoche);
  return (
    <section class="flaeche flaeche--innen tempo">
      <div class="zeile zeile--3">
        <Icon name="route" groesse={18} class={imPlan ? 'text-gut' : 'text-warn'} />
        <div class="wachsen">
          <div class="tempo__titel">
            {t.offen === 0
              ? 'Alle Stichpunkte abgehakt – jetzt festigen.'
              : t.tage <= 0
                ? `Noch ${t.offen} Stichpunkte offen.`
                : `Etwa ${t.jeWoche} Stichpunkte pro Woche, dann bist du rechtzeitig durch.`}
          </div>
          <div class="gedaempft">
            Noch {t.offen} offen · in den letzten 7 Tagen {t.dieseWoche} abgehakt
            {t.offen > 0 && t.tage > 0 ? (imPlan ? ' · du liegst im Plan' : ' · etwas mehr Tempo hilft') : ''}
          </div>
        </div>
      </div>
    </section>
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

