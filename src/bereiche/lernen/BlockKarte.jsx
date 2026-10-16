// Eine Block-Karte im Lernplan: zugeklappt Kopfzeile, aufgeklappt links die Stichpunkte,
// rechts Wiederholungs-Phasen und die Details des gewählten Stichpunkts.

import { useState } from 'preact/hooks';
import { inhalt } from '../../daten/inhalt.js';
import { erfasse } from '../../lernstand/store.js';
import { kartenZustand } from '../../lernstand/ableiten.js';
import { useEinstellung } from '../../lernstand/einstellungen.js';
import { PHASEN_ABSTAND } from '../../lernstand/regeln.js';
import { datumMitWochentag, relativ, tagVon } from '../../lernstand/zeit.js';
import { geheZu, link } from '../../router.js';
import { Icon, Knopf, SymbolKnopf, Haken, PrioMarke, Marke, Aufklapp, Ring, Rich, Treffer } from '../../ui/bausteine.jsx';
import { melde, bestaetige } from '../../ui/dialog.jsx';
import { uebungenFuer, uebungenFuerBlock } from '../trainer/verzeichnis.js';
import { lernpromptBlock, lernpromptStichpunkt, blockAuswahl, kopiere } from './lernprompt.js';

export const ART_ICON = { Wissen: 'book-open', Rechnen: 'calculator', Zeichnen: 'shapes', Schreiben: 'code-xml' };

async function promptKopieren(text, was = 'Lernprompt') {
  const ok = await kopiere(text);
  melde(ok ? `${was} kopiert – füge ihn in deinen KI-Chat ein.` : 'Kopieren hat nicht geklappt. Bitte erneut versuchen.', { icon: 'copy', fehler: !ok });
}

// Block-Prompt: nur offene Stichpunkte; ist alles abgehakt, ein Wiederholungs-Prompt
function blockPromptKopieren(block, stand) {
  const { modus, ids } = blockAuswahl(block, stand);
  const was = modus === 'wiederholen' ? 'Wiederholungs-Prompt' : ids.length === 1 ? 'Lernprompt für den offenen Stichpunkt' : `Lernprompt für ${ids.length} offene Stichpunkte`;
  promptKopieren(lernpromptBlock(block, inhalt, stand), was);
}

export function BlockKarte({ block, zustand: z, stand, offen, onUmschalten, auswahl, onAuswahl, suche, treffer, raum }) {
  const kartenIds = inhalt.kartenJeBlock.get(block.id) ?? [];
  const uebungen = uebungenFuerBlock(block.sp).filter((u) => u.modus.sp.some((id) => block.sp.includes(id)));
  const gewaehlt = auswahl && block.sp.includes(auswahl) ? auswahl : (block.sp.find((id) => !stand.spErledigt.has(id)) ?? block.sp[0]);

  const blockHaken = async (an) => {
    if (an) {
      const offeneSp = block.sp.filter((id) => !stand.spErledigt.has(id));
      erfasse(...offeneSp.map((id) => ({ e: 'sp', id, an: true })));
      if (offeneSp.length > 1)
        melde(`${offeneSp.length} Stichpunkte abgehakt.`, {
          aktion: { text: 'Rückgängig', ausfuehren: () => erfasse(...offeneSp.map((id) => ({ e: 'sp', id, an: false }))) },
        });
    } else {
      const ok = await bestaetige({
        titel: 'Block wieder öffnen?',
        text: `Alle ${block.sp.length} Stichpunkte von „${block.titel}" werden wieder als offen markiert, die Punkte dafür werden abgezogen. Erledigte Wiederholungen bleiben erhalten.`,
        ja: 'Wieder öffnen',
      });
      if (ok) erfasse(...block.sp.map((id) => ({ e: 'sp', id, an: false })));
    }
  };

  return (
    <article
      id={`block-${block.id}`}
      class={`block ${offen ? 'block--offen' : ''} ${z.fertig ? 'block--fertig' : ''} ${z.faellig ? 'block--faellig' : ''}`}
    >
      <div class="block__kopf" onClick={onUmschalten}>
        <Haken an={z.fertig} teil={z.angefangen} gross onWechsel={blockHaken} label={`Block ${block.titel} abhaken`} />
        <div class="block__titelbereich">
          <div class="block__titelzeile">
            <h3 class="block__titel">
              <button
                class="block__titelknopf"
                aria-expanded={offen}
                aria-controls={`block-inhalt-${block.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onUmschalten();
                }}
              >
                <Treffer text={block.titel} suche={suche} />
              </button>
            </h3>
            <PrioMarke prio={block.prio} pruefungen={block.pruefungen} punkte={block.punkte} />
            {z.faellig && (
              <Marke ton="warn" icon="refresh-cw">
                Wiederholung fällig
              </Marke>
            )}
            {z.gefestigt && (
              <Marke ton="gut" icon="award" tip="Alle drei Wiederholungen erledigt">
                Gefestigt
              </Marke>
            )}
          </div>
          {block.satz && <p class="block__satz">{block.satz}</p>}
        </div>
        <div class="block__aktionen" onClick={(e) => e.stopPropagation()}>
          <span class="block__stand" data-tip={`${z.erledigt} von ${z.gesamt} Stichpunkten erledigt`}>
            <Ring wert={z.anteil} groesse={18} />
            <span class="tabellenziffern">
              {z.erledigt}/{z.gesamt}
            </span>
          </span>
          {uebungen.length > 0 ? (
            <SymbolKnopf icon="target" label="Üben" onClick={() => geheZu(raum, 'trainer', uebungen[0].trainer.id, { modus: uebungen[0].modus.id })} />
          ) : (
            <span class="symbolknopf-platz" aria-hidden="true" />
          )}
          <SymbolKnopf
            icon="copy"
            label={z.fertig ? 'Wiederholungs-Prompt kopieren' : 'Lernprompt kopieren (nur offene Stichpunkte)'}
            onClick={() => blockPromptKopieren(block, stand)}
          />
          <Knopf
            groesse="s"
            variante="akzent"
            icon="layers"
            zahl={kartenIds.length}
            disabled={!kartenIds.length}
            onClick={() => geheZu(raum, 'karten', 'sitzung', { quelle: `block:${block.id}` })}
          >
            Lernkarten
          </Knopf>
          <SymbolKnopf icon="chevron-down" label={offen ? 'Zuklappen' : 'Aufklappen'} class="block__pfeil" onClick={onUmschalten} />
        </div>
      </div>

      <Aufklapp offen={offen}>
        <div class="block__inhalt" id={`block-inhalt-${block.id}`}>
          <div class="block__links">
            <div class="ueberschrift-klein block__spalte-titel">
              <Icon name="list-checks" groesse={13} /> Stichpunkte
            </div>
            <ul class="sp-liste">
              {block.sp.map((id) => (
                <SpZeile key={id} sp={inhalt.sp.get(id)} an={stand.spErledigt.has(id)} gewaehlt={id === gewaehlt} onWahl={() => onAuswahl(id)} suche={suche} treffer={treffer.has(id)} stand={stand} />
              ))}
            </ul>
          </div>
          <div class="block__rechts">
            <Phasen block={block} z={z} heute={stand.heute} raum={raum} />
            <SpDetail key={gewaehlt} sp={inhalt.sp.get(gewaehlt)} stand={stand} raum={raum} />
          </div>
        </div>
      </Aufklapp>
    </article>
  );
}

function SpZeile({ sp, an, gewaehlt, onWahl, suche, treffer, stand }) {
  const notiz = stand.notizen.has(sp.id);
  return (
    <li class={`sp ${gewaehlt ? 'sp--gewaehlt' : ''} ${an ? 'sp--erledigt' : ''} ${treffer && suche ? 'sp--treffer' : ''}`}>
      <Haken an={an} onWechsel={(neu) => erfasse({ e: 'sp', id: sp.id, an: neu })} label={`${sp.titel} abhaken`} />
      <button class="sp__knopf" aria-pressed={gewaehlt} onClick={onWahl}>
        <span class="sp__titel">
          <Treffer text={sp.titel} suche={suche} />
        </span>
        <span class="sp__info">
          {sp.neu?.istNeu && <span class="sp__neu" data-tip="Neuer Stichpunkt im Lernplan">neu</span>}
          {notiz && <Icon name="notebook-pen" groesse={13} />}
          {sp.art !== 'Wissen' && (
            <span class="sp__art" data-tip={sp.art}>
              <Icon name={ART_ICON[sp.art]} groesse={13} />
            </span>
          )}
          <Icon name="chevron-right" groesse={14} class="sp__pfeil" />
        </span>
      </button>
      <SymbolKnopf icon="copy" groesse="s" label={`Lernprompt kopieren: ${sp.titel}`} class="sp__kopie" onClick={() => promptKopieren(lernpromptStichpunkt(sp, inhalt, stand))} />
    </li>
  );
}

function Phasen({ block, z, heute, raum }) {
  const markieren = (phase) => {
    erfasse({ e: 'wdh', id: block.id, p: phase });
    melde(phase === 3 ? `Alle drei Wiederholungen geschafft – „${block.titel}" ist gefestigt.` : `Wiederholung ${phase} erledigt. Die nächste folgt in ${PHASEN_ABSTAND[phase]} Tagen.`, {
      icon: phase === 3 ? 'award' : 'refresh-cw',
    });
  };
  let hinweis;
  if (!z.erledigtAm) hinweis = 'Hake alle Stichpunkte ab. Danach wird der Block nach 1, 7 und 30 Tagen zur Wiederholung fällig.';
  else if (z.gefestigt) hinweis = 'Alle drei Wiederholungen erledigt. Halte das Wissen mit den Lernkarten frisch.';
  else if (!z.fertig) hinweis = 'Ein Stichpunkt ist wieder offen. Die Wiederholungen ruhen, bis der Block wieder abgehakt ist.';
  else if (z.faellig) hinweis = 'Lies die Kurzfassungen und geh die Lernkarten des Blocks durch. Dann die fällige Phase anklicken.';
  else hinweis = `Nächste Wiederholung ${relativ(z.naechste.faellig, heute)} (${datumMitWochentag(z.naechste.faellig)}).`;

  return (
    <div class="phasen">
      <div class="ueberschrift-klein block__spalte-titel">
        <Icon name="refresh-cw" groesse={13} /> Wiederholungs-Phasen
      </div>
      <div class="phasen__reihe">
        {[1, 2, 3].map((p) => {
          const erledigt = z.phasen[p - 1];
          const istNaechste = z.naechste?.phase === p;
          const faellig = istNaechste && z.faellig;
          const zustand = erledigt ? 'erledigt' : faellig ? 'faellig' : 'gesperrt';
          const tip = erledigt
            ? `Erledigt am ${datumMitWochentag(tagVon(erledigt))}`
            : faellig
              ? 'Jetzt fällig – anklicken, wenn du wiederholt hast'
              : istNaechste && z.fertig
                ? `Fällig ab ${datumMitWochentag(z.naechste.faellig)}`
                : 'Noch gesperrt';
          return (
            <button key={p} class={`phase phase--${zustand}`} disabled={!faellig} onClick={() => markieren(p)} data-tip={tip} aria-label={`Wiederholung ${p}: ${tip}`}>
              {erledigt ? <Icon name="check" groesse={13} strich={2.6} /> : !faellig ? <Icon name="lock" groesse={12} /> : null}
              {p}×
            </button>
          );
        })}
        {z.faellig && (
          <Knopf groesse="s" variante="geist" icon="layers" onClick={() => geheZu(raum, 'karten', 'sitzung', { quelle: `block:${block.id}` })}>
            Mit Karten wiederholen
          </Knopf>
        )}
      </div>
      <p class="phasen__hinweis">{hinweis}</p>
    </div>
  );
}

function SpDetail({ sp, stand, raum }) {
  const [alles, setAlles] = useState(false);
  const [notizOffen, setNotizOffen] = useState(stand.notizen.has(sp.id));
  const kartenIds = inhalt.kartenJeSp.get(sp.id) ?? [];
  const kz = kartenZustand(stand, kartenIds);
  const uebungen = uebungenFuer(sp.id);
  const gegen = sp.gegen.map((id) => inhalt.sp.get(id)).filter(Boolean);
  const aufgaben = stand.aufgaben.get(sp.id);

  return (
    <div class="sp-detail erscheinen">
      <div class="sp-detail__kopf">
        <div class="ueberschrift-klein block__spalte-titel">
          <Icon name={ART_ICON[sp.art]} groesse={13} /> {sp.neu ? (sp.art === 'Wissen' ? 'Stichpunkt' : `Stichpunkt · ${sp.art}`) : sp.art === 'Wissen' ? 'Kurzfassung' : `Kurzfassung · ${sp.art}`}
        </div>
      </div>
      <h4 class="sp-detail__titel">{sp.titel}</h4>
      {sp.neu ? (
        <div class="kurz">
          <p class="kurz__ziel">{sp.neu.ziel}</p>
          {sp.neu.kurz && <Rich text={sp.neu.kurz} />}
          {sp.neu.hinweis && (
            <p class="np-hinweis">
              <Icon name="info" groesse={13} /> {sp.neu.hinweis}
            </p>
          )}
        </div>
      ) : sp.kurz ? (
        <div class="kurz">
          <p class="kurz__ziel">{sp.kurz.ziel}</p>
          <Rich text={sp.kurz.punkte.map((p) => `- ${p}`).join('\n')} />
        </div>
      ) : (
        <p class="gedaempft">Die Kurzfassung fehlt noch. Unter „Alles anzeigen" steht der volle Wortlaut.</p>
      )}

      <div class="sp-detail__knoepfe">
        <Knopf groesse="s" variante="akzent" icon="layers" zahl={kartenIds.length} disabled={!kartenIds.length} onClick={() => geheZu(raum, 'karten', 'sitzung', { quelle: `sp:${sp.id}` })}>
          Lernkarten
        </Knopf>
        {uebungen.map((u) => (
          <Knopf key={u.trainer.id + u.modus.id} groesse="s" icon="target" onClick={() => geheZu(raum, 'trainer', u.trainer.id, { modus: u.modus.id })}>
            Üben: {u.modus.name}
          </Knopf>
        ))}
        <Knopf groesse="s" variante="geist" icon="copy" onClick={() => promptKopieren(lernpromptStichpunkt(sp, inhalt, stand))}>
          Lernprompt
        </Knopf>
        <Knopf groesse="s" variante="geist" icon="notebook-pen" onClick={() => setNotizOffen(!notizOffen)} aria-pressed={notizOffen}>
          Notiz
        </Knopf>
      </div>

      {(kz.antworten > 0 || aufgaben) && (
        <div class="sp-detail__stand">
          {kz.antworten > 0 && (
            <span>
              Karten: <strong>{kz.sicher}</strong>/{kz.gesamt} sicher
              {kz.faellig ? <span class="text-warn"> · {kz.faellig} fällig</span> : null}
            </span>
          )}
          {aufgaben && (
            <span>
              Aufgaben: <strong>{aufgaben.ok}</strong>/{aufgaben.n} richtig
            </span>
          )}
        </div>
      )}

      {notizOffen && <Notiz sp={sp} text={stand.notizen.get(sp.id) ?? ''} />}

      {sp.neu ? (
        <NeuerRahmen sp={sp} stand={stand} />
      ) : (
        <>
      <button class="alles-knopf" aria-expanded={alles} onClick={() => setAlles(!alles)}>
        <Icon name={alles ? 'eye-off' : 'eye'} groesse={14} />
        {alles ? 'Weniger anzeigen' : 'Alles anzeigen: Rahmen und alle Können-Aussagen'}
      </button>
      <Aufklapp offen={alles}>
        <div class="voll">
          <div class="voll__abschnitt">
            <div class="ueberschrift-klein">Rahmen – wie tief das Thema geht</div>
            <p>{sp.rahmen}</p>
          </div>
          {sp.unklar && (
            <div class="voll__abschnitt voll__unklar">
              <div class="ueberschrift-klein">
                <Icon name="info" groesse={12} /> Tiefe nicht eindeutig
              </div>
              {sp.unklar.hinweis && <p>{sp.unklar.hinweis}</p>}
              <ul>
                {sp.unklar.auslegungen.map((a) => (
                  <li key={a.kennung}>
                    <span class="mono">{a.kennung})</span> {a.text}
                  </li>
                ))}
              </ul>
              {sp.unklar.nachsatz && <p class="gedaempft">{sp.unklar.nachsatz}</p>}
              <p class="gedaempft">Tipp: Lerne für die weitere Auslegung, dann bist du auf beides vorbereitet.</p>
            </div>
          )}
          <div class="voll__abschnitt">
            <div class="ueberschrift-klein">Das musst du können</div>
            <ol class="koennen">
              {sp.koennen.map(([id, text]) => (
                <li key={id}>{text}</li>
              ))}
            </ol>
          </div>
        </div>
      </Aufklapp>
        </>
      )}

      {gegen.length > 0 && (
        <div class="gegen">
          {gegen.map((g) => (
            <a key={g.id} class="gegen__link" href={link(g.raum, 'lernen', null, { sp: g.id })}>
              <Icon name="arrow-left-right" groesse={14} />
              <span>
                Auch in {inhalt.raeume.get(g.raum).name}: <strong>{g.titel}</strong>
              </span>
              <Icon name="arrow-right" groesse={13} />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// Neuer Lernplan: „Baut auf“, Können-Aussagen (einklappbar, P29), Grenzen und Kür;
// Stufe, Herkunft und Begründungen klein zum Aufklappen.
const STUFE_NAME = { 1: 'Wiedergeben', 2: 'Verstehen', 3: 'Anwenden', 4: 'Beurteilen' };

function herkunftText(h) {
  const [art, wert] = h.split(':');
  return art === 'katalog' ? `Katalog ${wert}` : art === 'beleg' ? `Prüfung ${wert}` : art === 'regel' ? `Puffer-Regel ${wert}` : h;
}

function KoennenMarken({ k }) {
  return (
    <>
      {k.status === 'neu' && (k.karten ? <span class="np-marke" data-tip="Diese Aussage kam beim Umbau des Lernplans neu dazu">neu im Plan</span> : <span class="np-marke np-marke--warn" data-tip="Neue Können-Aussage – Lernkarten folgen später">neu im Plan · noch keine Karten</span>)}
      {k.status === 'verschoben' && <span class="np-marke" data-tip={`Karten von ${k.von} hierher umgehängt`}>umgehängt</span>}
      {k.status === 'angepasst' && <span class="np-marke" data-tip="Aussage neu gefasst – die Karten stammen noch von der alten Fassung">angepasst</span>}
      {k.vorgegeben && <span class="np-marke" data-tip="Wird in der Prüfung als Material vorgegeben">vorgegeben: {k.vorgegeben}</span>}
    </>
  );
}

// E2: Sprung zu einem Stichpunkt eines früheren Raums (wie Gegenstücke und Befehlspalette)
function spLink(z) {
  return link(z.raum, 'lernen', null, { sp: z.id });
}

// „Baut auf“: Stichpunkte früherer Räume, die hier vorausgesetzt werden, mit Häkchen aus dem Lernstand
function BautAuf({ ids, stand }) {
  const ziele = ids.map((id) => inhalt.sp.get(id)).filter(Boolean);
  if (!ziele.length) return null;
  return (
    <div class="voll__abschnitt np-bautauf">
      <div class="ueberschrift-klein">
        <Icon name="layers" groesse={12} /> Baut auf
      </div>
      <p class="np-bautauf__satz">Das kennst du schon – hier kommt nur das Neue dazu.</p>
      <ul class="np-bautauf__liste">
        {ziele.map((z) => {
          const an = stand.spErledigt.has(z.id);
          return (
            <li key={z.id}>
              <a class={`np-bautauf__link ${an ? 'np-bautauf__link--an' : ''}`} href={spLink(z)}>
                <span class="np-bautauf__status" data-tip={an ? 'Im Lernstand abgehakt' : 'Noch offen'} aria-label={an ? 'abgehakt' : 'offen'}>
                  {an ? <Icon name="check" groesse={11} strich={3} /> : null}
                </span>
                <span class="np-bautauf__titel">{z.titel}</span>
                <span class="np-marke np-bautauf__raum">{inhalt.raeume.get(z.raum)?.name ?? z.raum}</span>
                <Icon name="arrow-right" groesse={13} class="np-bautauf__pfeil" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// „neu gegenüber …“ an einer Aussage zu importierten Bausteinen (P36); antippen zeigt, was neu ist
function NeuMarke({ neu, offen, onUmschalten }) {
  return (
    <button
      type="button"
      class="np-marke np-marke--neu"
      aria-expanded={offen}
      data-tip={!offen && neu.was ? neu.was : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onUmschalten();
      }}
    >
      <Icon name="plus" groesse={10} strich={2.6} /> neu gegenüber {neu.gegenueber.join(', ')}
    </button>
  );
}

function NeuText({ neu }) {
  const ziele = neu.gegenueber.map((id) => inhalt.sp.get(id)).filter(Boolean);
  return (
    <div class="np-neu">
      {neu.was && <p>{neu.was}</p>}
      {ziele.length > 0 && (
        <p class="np-neu__grundlage">
          Grundlage:{' '}
          {ziele.map((z, i) => (
            <span key={z.id}>
              {i > 0 && ', '}
              <a href={spLink(z)}>{z.titel}</a> <span class="gedaempft">({inhalt.raeume.get(z.raum)?.name ?? z.raum})</span>
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

function KoennenZeile({ k, text, details }) {
  const [neuOffen, setNeuOffen] = useState(false);
  const marken = (
    <>
      <KoennenMarken k={k} />
      {k.neu && <NeuMarke neu={k.neu} offen={neuOffen} onUmschalten={() => setNeuOffen(!neuOffen)} />}
    </>
  );
  return (
    <li>
      {k.erklaerung ? (
        <details class="np-erkl">
          <summary>
            {text} {marken}
          </summary>
          <Rich class="np-erkl__text" text={k.erklaerung} />
        </details>
      ) : (
        <>
          {text} {marken}
        </>
      )}
      {neuOffen && <NeuText neu={k.neu} />}
      {details && (
        <div class="np__meta">
          <span class="mono">{k.id}</span> · Stufe {k.stufe} {STUFE_NAME[k.stufe]} · {k.herkunft.map(herkunftText).join(', ')}
          {k.status === 'verschoben' && ` · vorher ${k.von}`}
          {k.grund && <div>Änderung: {k.grund}</div>}
        </div>
      )}
    </li>
  );
}

function NeuerRahmen({ sp, stand }) {
  const [details, setDetails] = useState(false);
  const [offen, setOffen] = useEinstellung('lernen.koennenOffen', true);
  const texte = new Map(sp.koennen);
  const { koennen, grenzen, kuer } = sp.neu;
  const ohneKarten = koennen.filter((k) => k.status === 'neu' && !k.karten).length;
  return (
    <div class="voll np">
      {sp.neu.bautAuf?.length > 0 && <BautAuf ids={sp.neu.bautAuf} stand={stand} />}
      <div class="voll__abschnitt">
        <div class="ueberschrift-klein np__kopf">
          <button class="np__klapp" aria-expanded={offen} onClick={() => setOffen(!offen)}>
            <span class="np__klapp-titel">
              <Icon name="chevron-right" groesse={12} class="np__klapp-pfeil" />
              Das musst du können
            </span>
            {!offen && (
              <span class="np__zahl">
                {koennen.length} {koennen.length === 1 ? 'Aussage' : 'Aussagen'}
                {ohneKarten > 0 && <span class="np__zahl-warn"> · {ohneKarten} neu ohne Karten</span>}
              </span>
            )}
          </button>
          {offen && (
            <button class="np__details" aria-expanded={details} onClick={() => setDetails(!details)}>
              <Icon name={details ? 'eye-off' : 'eye'} groesse={12} /> {details ? 'Stufe und Herkunft ausblenden' : 'Stufe und Herkunft'}
            </button>
          )}
        </div>
        <Aufklapp offen={offen}>
          <ol class="koennen">
            {koennen.map((k) => (
              <KoennenZeile key={k.id} k={k} text={texte.get(k.id)} details={details} />
            ))}
          </ol>
        </Aufklapp>
      </div>
      {grenzen.length > 0 && (
        <div class="voll__abschnitt">
          <div class="ueberschrift-klein">
            <Icon name="minus" groesse={12} /> Gehört nicht dazu
          </div>
          <ul class="np__liste">
            {grenzen.map((g, i) => (
              <li key={i}>
                {g.text}
                {details && g.begruendung && <div class="np__meta">Begründung: {g.begruendung}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {kuer.length > 0 && (
        <div class="voll__abschnitt np__kuer">
          <div class="ueberschrift-klein">
            <Icon name="sparkles" groesse={12} /> Kür – freiwillig, zählt nicht zum Fortschritt
          </div>
          <ul class="np__liste">
            {kuer.map((k, i) => (
              <li key={i}>
                {k.text}
                {details && k.grund && <div class="np__meta">Warum Kür: {k.grund}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Notiz({ sp, text }) {
  const [wert, setWert] = useState(text);
  const speichern = () => {
    if (wert.trim() !== text.trim()) {
      erfasse({ e: 'notiz', id: sp.id, text: wert.trim() });
      melde(wert.trim() ? 'Notiz gespeichert.' : 'Notiz gelöscht.', { icon: 'notebook-pen', dauer: 2000 });
    }
  };
  return (
    <div class="notiz">
      <textarea class="feld" value={wert} placeholder="Eigene Notiz, Eselsbrücke, offene Frage …" onInput={(e) => setWert(e.currentTarget.value)} onBlur={speichern} maxLength={2000} />
      <div class="notiz__fuss gedaempft">Wird beim Verlassen des Feldes gespeichert.</div>
    </div>
  );
}
