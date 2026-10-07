// Startseite eines Lernraums: Kennzahlen, Heute im Fokus, Timer, Aktivität, Tempo.

import { useState } from 'preact/hooks';
import { inhalt } from '../../daten/inhalt.js';
import { useLernstand, erfasse } from '../../lernstand/store.js';
import { kartenZustand } from '../../lernstand/ableiten.js';
import { heuteImFokus, staerkenUndSchwaechen, tempo } from '../../lernstand/empfehlung.js';
import { datumLang, datumKurz, tageZwischen, tagPlus, tagVon } from '../../lernstand/zeit.js';
import { link, geheZu } from '../../router.js';
import { Icon, Knopf, Balken, Zahl, PrioMarke, Marke } from '../../ui/bausteine.jsx';
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

export function Start({ raum }) {
  const stand = useLernstand();
  const r = inhalt.raeume.get(raum);
  const [terminOffen, setTerminOffen] = useState(false);

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
    <div class="start">
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">Dein {r.name}-Lernraum</div>
          <h1 class="seitenkopf__titel">{gruss()}</h1>
          <p class="seitenkopf__text">{r.titel}</p>
        </div>
        <div class="seitenkopf__rechts gedaempft">{datumLang(stand.heute)}</div>
      </header>

      <div class="kennzahlen">
        <a class="flaeche kennzahl flaeche--klickbar" href={link(raum, 'lernen')}>
          <div class="kennzahl__kopf">
            Lernplan <Icon name="trending-up" groesse={16} />
          </div>
          <div class="kennzahl__wert">
            <Zahl wert={anteilPlan * 100} />
            <span class="kennzahl__einheit">%</span>
          </div>
          <div class="kennzahl__text">
            {spErledigt} von {spIds.length} Stichpunkten · {bloeckeFertig}/{r.bloeckeListe.length} Blöcke
          </div>
          <div class="kennzahl__fuss">
            <Balken wert={anteilPlan} label="Lernplan" />
          </div>
        </a>

        <a class="flaeche kennzahl flaeche--klickbar" href={link(raum, 'karten')}>
          <div class="kennzahl__kopf">
            Lernkarten <Icon name="layers" groesse={16} />
          </div>
          <div class="kennzahl__wert">
            <Zahl wert={karten.gesamt ? (karten.sicher / karten.gesamt) * 100 : 0} />
            <span class="kennzahl__einheit">% sicher</span>
          </div>
          <div class="kennzahl__text">
            {karten.faellig > 0 ? <span class="text-warn">{karten.faellig} fällig</span> : 'nichts fällig'} · {karten.gesamt - karten.neu} von {karten.gesamt} gesehen
          </div>
          <div class="kennzahl__fuss">
            <Balken wert={karten.gesamt ? karten.sicher / karten.gesamt : 0} label="Lernkarten sicher" />
          </div>
        </a>

        <button class="flaeche kennzahl flaeche--klickbar" onClick={() => window.dispatchEvent(new CustomEvent('raenge-zeigen'))}>
          <div class="kennzahl__kopf">
            Deine Lernserie <Icon name="flame" groesse={16} class={stand.serie.heuteAktiv ? 'flamme-an' : ''} />
          </div>
          <div class="kennzahl__wert">
            <Zahl wert={stand.serie.aktuell} />
            <span class="kennzahl__einheit">{stand.serie.aktuell === 1 ? 'Tag' : 'Tage'}</span>
          </div>
          <div class="kennzahl__text">
            <span class="text-akzent">{stand.rang.name}</span>
            {stand.serie.heuteAktiv ? ' · heute dabei' : stand.serie.aktuell > 0 ? ' · heute noch offen' : ' · starte heute'}
          </div>
          <div class="kennzahl__fuss">
            <Balken wert={stand.rang.anteil} label="Fortschritt zum nächsten Rang" />
          </div>
        </button>

        <button class="flaeche kennzahl flaeche--klickbar" onClick={() => setTerminOffen(true)}>
          <div class="kennzahl__kopf">
            Bis zur Prüfung <Icon name="calendar-days" groesse={16} />
          </div>
          {termin ? (
            <>
              <div class="kennzahl__wert">
                {tageBis >= 0 ? <Zahl wert={tageBis} /> : '–'}
                <span class="kennzahl__einheit">{tageBis === 1 ? 'Tag' : 'Tage'}</span>
              </div>
              <div class="kennzahl__text">
                {r.name} · {datumKurz(termin)}
                {tageBis < 0 ? ' · vorbei' : tageBis === 0 ? ' · heute! Viel Erfolg!' : ''}
              </div>
            </>
          ) : (
            <>
              <div class="kennzahl__wert kennzahl__wert--leer">–</div>
              <div class="kennzahl__text">Noch kein Termin eingetragen</div>
            </>
          )}
          <div class="kennzahl__fuss kennzahl__link">
            {termin ? 'Termin anpassen' : 'Termin festlegen'} <Icon name="arrow-right" groesse={12} />
          </div>
        </button>
      </div>

      <div class="start-raster">
        <div class="stapel stapel--4">
          <Fokus raum={raum} fokus={fokus} gemerkt={gemerkt} sus={sus} stand={stand} />
          <Tempo t={t} raum={raum} onTermin={() => setTerminOffen(true)} />
        </div>
        <div class="stapel stapel--4">
          <FokusTimer raum={raum} />
          <Aktivitaet stand={stand} />
        </div>
      </div>

      <TerminDialog offen={terminOffen} raum={raum} termin={termin} heute={stand.heute} onSchliessen={() => setTerminOffen(false)} />
    </div>
  );
}

function Fokus({ raum, fokus, gemerkt, sus }) {
  const h = fokus.haupt;
  const zuBlock = (block) => geheZu(raum, 'lernen', null, { block: block.id });
  return (
    <section class="flaeche flaeche--akzent flaeche--gross fokus-karte" aria-label="Heute im Fokus">
      <div class="ueberschrift-klein ueberschrift-klein--akzent zeile">
        <Icon name="sparkles" groesse={14} /> Dein nächster Schritt
      </div>
      {h ? (
        <>
          <div class="fokus-karte__etikett zeile">
            <Marke ton={h.art === 'wiederholung' ? 'warn' : 'akzent'} icon={h.art === 'wiederholung' ? 'refresh-cw' : h.art === 'weiter' ? 'step-forward' : 'rocket'}>
              {h.etikett}
            </Marke>
            <PrioMarke prio={h.block.prio} />
          </div>
          <h2 class="fokus-karte__titel">{h.block.titel}</h2>
          <p class="fokus-karte__satz">{h.block.satz ?? inhalt.ordner.get(h.block.ordner).titel}</p>
          <p class="fokus-karte__grund">
            <Icon name="lightbulb" groesse={14} /> {h.grund}
          </p>
        </>
      ) : (
        <>
          <h2 class="fokus-karte__titel">Alles abgehakt und wiederholt.</h2>
          <p class="fokus-karte__satz">
            {fokus.karten.faellig ? `${fokus.karten.faellig} Lernkarten warten auf dich.` : 'Halte das Wissen mit Lernkarten und Trainern frisch.'}
          </p>
        </>
      )}
      <div class="fokus-karte__knoepfe">
        {h ? (
          <Knopf variante="primaer" groesse="l" iconRechts="arrow-right" onClick={() => zuBlock(h.block)}>
            {h.art === 'wiederholung' ? 'Jetzt wiederholen' : 'Lernen starten'}
          </Knopf>
        ) : (
          <Knopf variante="primaer" groesse="l" iconRechts="arrow-right" onClick={() => geheZu(raum, 'karten', 'sitzung', { quelle: 'faellig' })}>
            Karten lernen
          </Knopf>
        )}
        <Knopf variante="zweit" groesse="l" icon="layers" zahl={fokus.karten.faellig || null} onClick={() => geheZu(raum, 'karten', 'sitzung', { quelle: 'faellig' })}>
          Fällige Karten
        </Knopf>
        <Knopf variante="zweit" groesse="l" icon="shuffle" onClick={() => geheZu(raum, 'karten', 'sitzung', { quelle: 'mix' })}>
          Zufallsmix
        </Knopf>
        <Knopf variante="zweit" groesse="l" icon="bookmark" zahl={gemerkt} disabled={!gemerkt} onClick={() => geheZu(raum, 'karten', 'sitzung', { quelle: 'gemerkt' })}>
          Gemerkt
        </Knopf>
      </div>

      {fokus.weitere.length > 0 && (
        <div class="fokus-karte__weitere">
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

export { tagVon };
