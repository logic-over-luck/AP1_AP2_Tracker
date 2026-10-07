// Grundgerüst: Leiste, Kopfzeile, Bereich.

import { useEffect, useState } from 'preact/hooks';
import { inhalt } from './daten/inhalt.js';
import { useRoute, link, geheZu } from './router.js';
import { useLernstand, fehlerZustand } from './lernstand/store.js';
import { setzeEinstellung, einstellung } from './lernstand/einstellungen.js';
import { kartenZustand, blockZustand } from './lernstand/ableiten.js';
import { Icon, SymbolKnopf, Balken } from './ui/bausteine.jsx';
import { Meldungen, BestaetigungsDialog, melde } from './ui/dialog.jsx';
import { trainerIn, trainerById } from './bereiche/trainer/verzeichnis.js';
import { Start } from './bereiche/start/Start.jsx';
import { Lernen } from './bereiche/lernen/Lernen.jsx';
import { Karten } from './bereiche/karten/Karten.jsx';
import { Glossar } from './bereiche/glossar/Glossar.jsx';
import { Hilfe } from './bereiche/hilfe/Hilfe.jsx';
import { TrainerBereich } from './bereiche/trainer/index.jsx';
import { SicherungsKnopf } from './bereiche/sicherung/Sicherung.jsx';
import { Feier } from './bereiche/feier/Feier.jsx';
import { Befehlspalette } from './bereiche/palette/Befehlspalette.jsx';
import { TimerPille } from './bereiche/start/FokusTimer.jsx';

const BEREICH_NAMEN = { start: 'Übersicht', lernen: 'Lernplan', karten: 'Lernkarten', trainer: 'Üben', glossar: 'Glossar', hilfe: 'Hilfe' };

export function App() {
  const route = useRoute();
  const stand = useLernstand();
  const [leisteOffen, setLeisteOffen] = useState(false);

  // Ohne Raum in der Adresse: zuletzt gewählten Raum öffnen
  useEffect(() => {
    if (!route.raum) geheZu(einstellung('raum', 'AP1'), 'start', null, null, { ersetzen: true });
  }, [route.raum]);
  const raum = route.raum ?? einstellung('raum', 'AP1');
  useEffect(() => {
    document.documentElement.dataset.raum = raum;
    setzeEinstellung('raum', raum);
  }, [raum]);
  useEffect(() => {
    setLeisteOffen(false);
    window.scrollTo({ top: 0 });
  }, [route.raum, route.bereich, route.unter]);
  useEffect(() => {
    const { ladeFehler } = fehlerZustand();
    if (ladeFehler) melde(`Der gespeicherte Lernstand war beschädigt und wurde beiseitegelegt: ${ladeFehler}`, { fehler: true, dauer: 10000 });
  }, []);

  let titel = BEREICH_NAMEN[route.bereich] ?? '';
  if (route.bereich === 'trainer' && route.unter) titel = trainerById(route.unter)?.name ?? titel;
  if (route.bereich === 'karten' && route.unter === 'sitzung') titel = 'Lernkarten · Sitzung';
  let bereich;
  switch (route.bereich) {
    case 'lernen':
      bereich = <Lernen raum={raum} params={route.params} />;
      break;
    case 'karten':
      bereich = <Karten raum={raum} unter={route.unter} params={route.params} />;
      break;
    case 'trainer':
      bereich = <TrainerBereich raum={raum} trainerId={route.unter} params={route.params} />;
      break;
    case 'glossar':
      bereich = <Glossar raum={raum} params={route.params} />;
      break;
    case 'hilfe':
      bereich = <Hilfe raum={raum} />;
      break;
    default:
      bereich = <Start raum={raum} />;
  }

  return (
    <div class="app" data-leiste-offen={leisteOffen}>
      <Leiste raum={raum} route={route} stand={stand} />
      <div class="haupt">
        <header class="kopf">
          <SymbolKnopf class="kopf__menue" icon="panel-left-open" label="Menü" onClick={() => setLeisteOffen(!leisteOffen)} />
          <nav class="pfad" aria-label="Pfad">
            <a class="pfad__raum" href={link(raum)}>
              {inhalt.raeume.get(raum).name}
            </a>
            <span class="pfad__trenner">/</span>
            <span class="pfad__teil">{titel}</span>
          </nav>
          <div class="kopf__rechts">
            <TimerPille raum={raum} />
            <button class="kopf__status knopf knopf--geist knopf--s" onClick={() => window.dispatchEvent(new Event('palette-oeffnen'))}>
              <Icon name="search" groesse={14} /> Suchen <kbd class="kbd">Strg K</kbd>
            </button>
            <SicherungsKnopf />
          </div>
        </header>
        <main class="inhalt" id="inhalt">
          {bereich}
        </main>
      </div>
      {leisteOffen && <div class="leiste-schleier" onClick={() => setLeisteOffen(false)} />}
      <Meldungen />
      <BestaetigungsDialog />
      <Feier />
      <Befehlspalette raum={raum} />
    </div>
  );
}

function Leiste({ raum, route, stand }) {
  const raeume = [...inhalt.raeume.values()];
  const index = raeume.findIndex((r) => r.id === raum);
  const kartenIds = inhalt.kartenJeRaum.get(raum) ?? [];
  const karten = kartenZustand(stand, kartenIds);
  const faelligeBloecke = inhalt.raeume.get(raum).bloeckeListe.filter((b) => blockZustand(stand, b).faellig).length;
  const aktiv = (bereich, unter = null) => route.bereich === bereich && (unter === null || route.unter === unter);

  const NavPunkt = ({ bereich, unter, icon, text, zahl, zahlTon }) => (
    <a class="nav-punkt" href={link(raum, bereich, unter)} aria-current={aktiv(bereich, unter) ? 'page' : undefined}>
      <Icon name={icon} groesse={17} />
      <span>{text}</span>
      {zahl ? <span class={`nav-punkt__zahl ${zahlTon ? `nav-punkt__zahl--${zahlTon}` : ''}`}>{zahl}</span> : null}
    </a>
  );

  return (
    <aside class="leiste" aria-label="Navigation">
      <a class="marke-logo" href={link(raum)}>
        <span class="marke-logo__bild">
          <Icon name="layers" groesse={20} strich={2} />
        </span>
        <span>
          <div class="marke-logo__name">Lernstudio</div>
          <div class="marke-logo__zusatz">Fachinformatik</div>
        </span>
      </a>

      <div class="raumwahl" role="group" aria-label="Lernraum">
        <span class="raumwahl__schieber" style={{ transform: `translateX(calc(${index} * (100% + 2px)))` }} />
        {raeume.map((r) => (
          <button
            key={r.id}
            class="raumwahl__knopf"
            aria-pressed={r.id === raum}
            onClick={() => geheZu(r.id, route.bereich === 'trainer' ? 'start' : route.bereich, null, null)}
          >
            {r.name}
          </button>
        ))}
      </div>

      <nav class="nav-gruppe" aria-label="Arbeitsplatz">
        <div class="nav-gruppe__titel ueberschrift-klein">Dein Arbeitsplatz</div>
        <NavPunkt bereich="start" icon="layout-grid" text="Übersicht" />
        <NavPunkt bereich="lernen" icon="list-checks" text="Lernplan" zahl={faelligeBloecke || null} zahlTon="faellig" />
        <NavPunkt bereich="karten" icon="layers" text="Lernkarten" zahl={karten.faellig || null} zahlTon="faellig" />
      </nav>

      <nav class="nav-gruppe" aria-label="Üben">
        <div class="nav-gruppe__titel ueberschrift-klein">Üben &amp; Verstehen</div>
        {trainerIn(raum).map((t) => (
          <NavPunkt key={t.id} bereich="trainer" unter={t.id} icon={t.icon} text={t.kurz} />
        ))}
      </nav>

      <nav class="nav-gruppe" aria-label="Nachschlagen">
        <div class="nav-gruppe__titel ueberschrift-klein">Nachschlagen</div>
        <NavPunkt bereich="glossar" icon="book-open" text="Glossar" />
        <NavPunkt bereich="hilfe" icon="circle-question-mark" text="Hilfe" />
      </nav>

      <div class="leiste__fuss">
        <button class="rang-mini" onClick={() => window.dispatchEvent(new CustomEvent('raenge-zeigen'))} aria-label="Rangleiter anzeigen">
          <div class="rang-mini__kopf">
            <Icon name="award" groesse={15} />
            <span class="rang-mini__name">{stand.rang.name}</span>
            <span class="rang-mini__xp">{stand.xp} XP</span>
          </div>
          <Balken wert={stand.rang.anteil} label="Fortschritt zum nächsten Rang" />
        </button>
      </div>
    </aside>
  );
}
