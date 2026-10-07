// Lernplan: Ordner → Blöcke → Stichpunkte. Das Herzstück.

import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { inhalt } from '../../daten/inhalt.js';
import { useLernstand } from '../../lernstand/store.js';
import { blockZustand } from '../../lernstand/ableiten.js';
import { useEinstellung } from '../../lernstand/einstellungen.js';
import { link } from '../../router.js';
import { Reiter, Suchfeld, Knopf, Leer, Icon } from '../../ui/bausteine.jsx';
import { BlockKarte } from './BlockKarte.jsx';

function normal(text) {
  return (text ?? '').toLowerCase();
}

// Liefert für einen Block, ob er zur Suche passt und welche Stichpunkte treffen.
function suchTreffer(block, suche) {
  if (!suche) return { passt: true, sp: new Set() };
  const s = normal(suche);
  const sp = new Set();
  for (const id of block.sp) {
    const x = inhalt.sp.get(id);
    const texte = [x.titel, x.kurz?.ziel, ...(x.kurz?.punkte ?? []), x.rahmen, ...x.koennen.map((k) => k[1])];
    if (texte.some((t) => normal(t).includes(s))) sp.add(id);
  }
  const passt = sp.size > 0 || normal(block.titel).includes(s) || normal(block.satz).includes(s);
  return { passt, sp };
}

export function Lernen({ raum, params }) {
  const stand = useLernstand();
  const r = inhalt.raeume.get(raum);
  const [filter, setFilter] = useEinstellung(`filter.${raum}`, 'alle');
  const [suche, setSuche] = useState('');
  const [offen, setOffen] = useState(() => new Set(params.block ? [params.block] : []));
  const [auswahl, setAuswahl] = useState(() => (params.sp ? { [params.block ?? inhalt.sp.get(params.sp)?.block]: params.sp } : {}));
  const sprungRef = useRef(null);

  // Sprung aus Start, Glossar oder Suche: Block öffnen, Stichpunkt wählen, hinscrollen
  useEffect(() => {
    const blockId = params.block ?? (params.sp ? inhalt.sp.get(params.sp)?.block : null);
    if (!blockId) return;
    setOffen((o) => new Set([...o, blockId]));
    if (params.sp) setAuswahl((a) => ({ ...a, [blockId]: params.sp }));
    setFilter('alle');
    setSuche('');
    sprungRef.current = blockId;
    setTimeout(() => {
      const el = document.getElementById(`block-${blockId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('block--hervor');
        setTimeout(() => el.classList.remove('block--hervor'), 1600);
      }
    }, 80);
  }, [params.block, params.sp]);

  const zustaende = useMemo(() => new Map(r.bloeckeListe.map((b) => [b.id, blockZustand(stand, b)])), [stand, raum]);
  const zaehler = {
    alle: r.bloeckeListe.length,
    offen: r.bloeckeListe.filter((b) => !zustaende.get(b.id).fertig).length,
    hoch: r.bloeckeListe.filter((b) => b.prio === 'hoch').length,
    faellig: r.bloeckeListe.filter((b) => zustaende.get(b.id).faellig).length,
  };

  const passtFilter = (b) => {
    const z = zustaende.get(b.id);
    if (filter === 'offen') return !z.fertig;
    if (filter === 'hoch') return b.prio === 'hoch';
    if (filter === 'faellig') return z.faellig;
    return true;
  };

  const gruppen = r.ordner
    .map((o) => {
      const bloecke = o.bloecke
        .map((b) => inhalt.bloecke.get(b.id))
        .map((b) => ({ block: b, treffer: suchTreffer(b, suche.trim()) }))
        .filter((x) => passtFilter(x.block) && x.treffer.passt);
      return { ordner: o, bloecke };
    })
    .filter((g) => g.bloecke.length);
  const trefferAnzahl = gruppen.reduce((n, g) => n + g.bloecke.length, 0);
  const autoOffen = suche.trim().length >= 3 && trefferAnzahl <= 4;

  const umschalten = (id) =>
    setOffen((o) => {
      const n = new Set(o);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const spGesamt = r.bloeckeListe.reduce((n, b) => n + b.sp.length, 0);

  return (
    <div class="lernen">
      <header class="seitenkopf">
        <div>
          <div class="ueberschrift-klein ueberschrift-klein--akzent">{r.name} · Lernplan</div>
          <h1 class="seitenkopf__titel">Dein Lernplan</h1>
          <p class="seitenkopf__text">
            {r.ordner.length} Themenbereiche, {r.bloeckeListe.length} Blöcke, {spGesamt} Stichpunkte – ein Schritt nach dem anderen.
          </p>
        </div>
        <div class="seitenkopf__rechts zeile">
          {offen.size > 0 && (
            <Knopf variante="geist" groesse="s" icon="chevron-up" onClick={() => setOffen(new Set())}>
              Alle zuklappen
            </Knopf>
          )}
          <Knopf groesse="s" icon="book-open" onClick={() => (location.hash = link(raum, 'glossar'))}>
            Zum Glossar
          </Knopf>
        </div>
      </header>

      <div class="lernen__leiste">
        <Reiter
          label="Filter"
          aktiv={filter}
          onWahl={setFilter}
          eintraege={[
            { id: 'alle', text: 'Alle', zahl: zaehler.alle },
            { id: 'offen', text: 'Noch offen', zahl: zaehler.offen },
            { id: 'hoch', text: 'Hohe Priorität', zahl: zaehler.hoch },
            { id: 'faellig', text: 'Fällig', zahl: zaehler.faellig, icon: zaehler.faellig ? 'refresh-cw' : undefined },
          ]}
        />
        <span class="wachsen" />
        <Suchfeld wert={suche} onEingabe={setSuche} platzhalter="Themen durchsuchen …" />
      </div>

      {gruppen.length === 0 ? (
        <div class="flaeche">
          {suche ? (
            <Leer icon="search" titel="Nichts gefunden" aktion={<Knopf onClick={() => setSuche('')}>Suche leeren</Knopf>}>
              Kein Block und kein Stichpunkt enthält „{suche}". Versuch es mit einem anderen Begriff oder schau ins Glossar.
            </Leer>
          ) : filter === 'faellig' ? (
            <Leer icon="circle-check" titel="Keine Wiederholung fällig" aktion={<Knopf onClick={() => setFilter('alle')}>Alle Blöcke zeigen</Knopf>}>
              Wenn du einen Block abhakst, wird er nach 1, 7 und 30 Tagen zur Wiederholung fällig. Dann erscheint er hier.
            </Leer>
          ) : filter === 'offen' ? (
            <Leer icon="trophy" titel="Alles abgehakt!" aktion={<Knopf onClick={() => setFilter('alle')}>Alle Blöcke zeigen</Knopf>}>
              Du hast jeden Stichpunkt in diesem Lernraum erledigt. Jetzt heißt es: wiederholen und üben.
            </Leer>
          ) : (
            <Leer titel="Keine Blöcke" />
          )}
        </div>
      ) : (
        gruppen.map((g, gi) => <OrdnerGruppe key={g.ordner.id} nummer={r.ordner.indexOf(g.ordner) + 1} gruppe={g} stand={stand} zustaende={zustaende} offen={offen} autoOffen={autoOffen} umschalten={umschalten} auswahl={auswahl} setAuswahl={setAuswahl} suche={suche.trim()} raum={raum} erste={gi === 0} />)
      )}
    </div>
  );
}

function OrdnerGruppe({ nummer, gruppe, stand, zustaende, offen, autoOffen, umschalten, auswahl, setAuswahl, suche, raum }) {
  const o = inhalt.ordner.get(gruppe.ordner.id);
  const erledigt = o.spIds.filter((id) => stand.spErledigt.has(id)).length;
  const anteil = o.spIds.length ? erledigt / o.spIds.length : 0;
  return (
    <section class="ordner" aria-labelledby={`ordner-${o.id}`}>
      <header class="ordner__kopf">
        <span class="ordner__nummer">{String(nummer).padStart(2, '0')}</span>
        <div class="wachsen">
          <h2 class="ordner__titel" id={`ordner-${o.id}`}>
            {o.titel}
          </h2>
          <div class="ordner__text">
            {o.bloecke.length} Blöcke · {erledigt} von {o.spIds.length} Stichpunkten erledigt
          </div>
        </div>
        <div class="ordner__fortschritt">
          <div class="ordner__balken">
            <div class="balken">
              <div class="balken__fuellung" style={{ width: `${anteil * 100}%` }} />
            </div>
          </div>
          <span class={`ordner__prozent ${anteil === 1 ? 'ordner__prozent--fertig' : ''}`}>
            {anteil === 1 ? <Icon name="check" groesse={12} strich={3} /> : null}
            {Math.round(anteil * 100)}%
          </span>
        </div>
      </header>
      <div class="ordner__bloecke">
        {gruppe.bloecke.map(({ block, treffer }) => (
          <BlockKarte
            key={block.id}
            block={block}
            zustand={zustaende.get(block.id)}
            stand={stand}
            offen={offen.has(block.id) || autoOffen}
            onUmschalten={() => umschalten(block.id)}
            auswahl={auswahl[block.id]}
            onAuswahl={(spId) => setAuswahl((a) => ({ ...a, [block.id]: spId }))}
            suche={suche}
            treffer={treffer.sp}
            raum={raum}
          />
        ))}
      </div>
    </section>
  );
}
