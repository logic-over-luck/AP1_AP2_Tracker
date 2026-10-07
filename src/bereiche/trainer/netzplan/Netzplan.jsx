// Netzplan-Trainer: Ausfüllen direkt in den Vorgangsknoten, Gantt-Diagramm, PSP.

import { useCallback } from 'preact/hooks';
import { TrainerSeite, Uebung, Tabelle } from '../rahmen/Uebung.jsx';
import { ERZEUGER, WERTE, WERT_NAME } from './aufgaben.js';
import { anordnen, pfeile } from './plan.js';

const SPICKZETTEL = {
  berechnen:
    '- Vorwärts: FAZ = größter FEZ der Vorgänger (Start 0) · FEZ = FAZ + Dauer\n- Rückwärts: SEZ = kleinster SAZ der Nachfolger (Ende = Projektdauer) · SAZ = SEZ − Dauer\n- GP = SAZ − FAZ = SEZ − FEZ\n- FP = kleinster FAZ der Nachfolger − FEZ\n- Kritischer Weg: alle Vorgänge mit GP = 0\n- GP nutzen verschiebt das Projektende nicht; FP nutzen verschiebt keinen Nachfolger',
  aufbauen: '- Für jeden Vorgang: Welche Vorgänge müssen direkt vorher fertig sein?\n- Dann vorwärts und rückwärts rechnen wie gewohnt\n- Kritischer Weg = längster Weg = Projektdauer',
  gantt: '- Balken = Vorgang, Länge = Dauer, frühestmöglich eingeplant\n- Beginn an Tag FAZ + 1, Ende mit Tag FEZ\n- Projektdauer = Ende des letzten Balkens\n- PSP: was zu tun ist · Gantt: wann es getan wird',
  psp: '- Ebene 1: Projekt · Ebene 2: Teilaufgaben · unterste Ebene: Arbeitspakete\n- Nummerierung z. B. 1, 1.1, 1.2, 2 …\n- Ein Arbeitspaket ist klar abgegrenzt und einem Verantwortlichen zuordenbar',
};

export function NetzplanTrainer({ raum, trainer, modi, params }) {
  return (
    <TrainerSeite raum={raum} trainer={trainer} modi={modi} modus={params.modus}>
      {(m) => <NUebung key={m.id} raum={raum} modus={m} />}
    </TrainerSeite>
  );
}

function NUebung({ raum, modus }) {
  const erzeuge = useCallback((rng) => ERZEUGER[modus.id](rng, raum), [modus.id, raum]);
  return <Uebung erzeuge={erzeuge} trainerId="netzplan" modusId={modus.id} spIds={modus.sp} spickzettel={SPICKZETTEL[modus.id]} ansicht={Bild} />;
}

function Bild(props) {
  const a = props.aufgabe;
  if (a.gantt) return <Gantt plan={a.plan} verdeckt={a.gantt.verdeckt} zeigeAlles={props.loesung} />;
  if (a.psp) return props.loesung ? <PspBaum psp={a.psp} /> : null;
  if (a.zeigePlanNachLoesung) return props.loesung ? <Netz {...props} alleGegeben /> : null;
  if (a.plan) return <Netz {...props} />;
  return null;
}

// ---------- Netzplan-Diagramm ----------

const KB = 176; // Knotenbreite
const KH = 112; // Knotenhöhe
const AX = 80; // Abstand Spalten
const AY = 32; // Abstand Zeilen

function Netz({ aufgabe, eingaben, setze, ergebnis, loesung, alleGegeben }) {
  const plan = aufgabe.plan;
  const anordnung = anordnen(plan.vorgaenge);
  const { pos, spalten, zeilen } = anordnung;
  const breite = spalten * KB + (spalten - 1) * AX;
  const hoehe = zeilen * KH + (zeilen - 1) * AY;
  const gegeben = new Set(alleGegeben ? plan.vorgaenge.map((v) => v.id) : aufgabe.gegeben);
  const kritisch = new Set(loesung ? plan.vorgaenge.filter((v) => v.kritisch).map((v) => v.id) : []);
  const xy = (id) => {
    const p = pos.get(id);
    const versatz = ((zeilen - p.anzahl) * (KH + AY)) / 2;
    return { x: p.x * (KB + AX), y: p.y * (KH + AY) + versatz };
  };

  const wert = (v, w) => {
    if (gegeben.has(v.id)) return <span class="nk__wert">{v[w]}</span>;
    const id = `${v.id}.${w}`;
    const r = ergebnis?.[id];
    return (
      <input
        class={`nk__eingabe ${r ? (r.ok ? 'nk__eingabe--richtig' : 'nk__eingabe--falsch') : ''}`}
        value={loesung && !(r?.ok) ? v[w] : (eingaben[id] ?? '')}
        readOnly={loesung && !(r?.ok)}
        inputMode="numeric"
        aria-label={`${v.id} ${WERT_NAME[w]}`}
        onInput={(e) => setze(id, e.currentTarget.value)}
      />
    );
  };

  return (
    <div class="netz">
      <Legende />
      <div class="netz__flaeche" style={{ width: `${breite}px`, height: `${hoehe}px` }}>
        <svg class="netz__pfeile" width={breite} height={hoehe} aria-hidden="true">
          <defs>
            <marker id="np-spitze" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill="currentColor" />
            </marker>
          </defs>
          {pfeile(anordnung, { KB, KH, AX, AY })
            .map((p) => ({ ...p, krit: kritisch.has(p.von) && kritisch.has(p.nach) && plan.vorgaenge.find((x) => x.id === p.von).fez === plan.vorgaenge.find((x) => x.id === p.nach).faz }))
            .sort((a, b) => a.krit - b.krit) // kritischer Weg zuletzt, damit er obenauf liegt
            .map(({ von, nach, d, krit }) => (
              <path key={`${von}-${nach}`} class={`netz__pfeil ${krit ? 'netz__pfeil--kritisch' : ''}`} d={d} marker-end="url(#np-spitze)" />
            ))}
        </svg>
        {plan.vorgaenge.map((v) => {
          const p = xy(v.id);
          return (
            <div key={v.id} class={`nk ${kritisch.has(v.id) ? 'nk--kritisch' : ''} ${gegeben.has(v.id) ? '' : 'nk--offen'}`} style={{ left: `${p.x}px`, top: `${p.y}px`, width: `${KB}px`, height: `${KH}px` }}>
              <div class="nk__zeile nk__zeile--zwei">
                {wert(v, "faz")}
                {wert(v, "fez")}
              </div>
              <div class="nk__zeile nk__titel">
                <span class="nk__nr">{v.id}</span>
                <span class="nk__name" title={v.name}>
                  <span>{v.name}</span>
                </span>
              </div>
              <div class="nk__zeile nk__zeile--drei">
                <span class="nk__wert nk__dauer">{v.dauer}</span>
                {wert(v, "gp")}
                {wert(v, "fp")}
              </div>
              <div class="nk__zeile nk__zeile--zwei">
                {wert(v, "saz")}
                {wert(v, "sez")}
              </div>
            </div>
          );
        })}
      </div>
      {aufgabe.felder.some((f) => f.imBild) && <p class="netz__tipp gedaempft">Trage die Werte direkt in die leeren Knoten ein. Mit Tab springst du von Feld zu Feld.</p>}
    </div>
  );
}

function Legende() {
  return (
    <div class="netz__legende" aria-label="Aufbau eines Vorgangsknotens">
      <div class="nk nk--legende">
        <div class="nk__zeile nk__zeile--zwei">
          <span>FAZ</span>
          <span>FEZ</span>
        </div>
        <div class="nk__zeile nk__titel">
          <span class="nk__nr">Nr.</span>
          <span class="nk__name">
            <span>Vorgang</span>
          </span>
        </div>
        <div class="nk__zeile nk__zeile--drei">
          <span>D</span>
          <span>GP</span>
          <span>FP</span>
        </div>
        <div class="nk__zeile nk__zeile--zwei">
          <span>SAZ</span>
          <span>SEZ</span>
        </div>
      </div>
      <div class="netz__legende-text">
        <strong>Legende</strong>
        <span>FAZ/FEZ: frühester Anfangs-/Endzeitpunkt</span>
        <span>SAZ/SEZ: spätester Anfangs-/Endzeitpunkt</span>
        <span>D: Dauer · GP: Gesamtpuffer · FP: freier Puffer</span>
      </div>
    </div>
  );
}

// ---------- Gantt ----------

function Gantt({ plan, verdeckt, zeigeAlles }) {
  const tage = plan.dauer;
  return (
    <div class="gantt" style={{ '--tage': tage }}>
      <div class="gantt__kopf">
        <span class="gantt__name" />
        {Array.from({ length: tage }, (_, i) => (
          <span key={i} class="gantt__tag">
            {i + 1}
          </span>
        ))}
      </div>
      {plan.vorgaenge.map((v) => (
        <div key={v.id} class="gantt__zeile">
          <span class="gantt__name">
            <span class="mono">{v.id}</span> {v.name}
          </span>
          {Array.from({ length: tage }, (_, i) => (
            <span key={i} class="gantt__zelle" />
          ))}
          {(v.id !== verdeckt || zeigeAlles) && (
            <span class={`gantt__balken ${v.kritisch ? 'gantt__balken--kritisch' : ''} ${v.id === verdeckt ? 'gantt__balken--neu' : ''}`} style={{ gridColumn: `${v.faz + 2} / span ${v.dauer}` }}>
              {v.dauer}
            </span>
          )}
        </div>
      ))}
      <div class="gantt__fuss gedaempft">Tage · kritische Vorgänge sind hervorgehoben</div>
    </div>
  );
}

// ---------- PSP ----------

function PspBaum({ psp }) {
  const teile = Object.keys(psp.teile);
  return (
    <div class="psp">
      <div class="psp__projekt">{psp.projekt}</div>
      <div class="psp__ebene" style={{ '--n': teile.length }}>
        {teile.map((t, i) => (
          <div key={t} class="psp__ast">
            <div class="psp__teil">
              <span class="mono">{i + 1}</span> {t}
            </div>
            {psp.teile[t].map((a, j) => (
              <div key={a} class="psp__paket">
                <span class="mono">
                  {i + 1}.{j + 1}
                </span>{' '}
                {a}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export { Tabelle, WERTE };
