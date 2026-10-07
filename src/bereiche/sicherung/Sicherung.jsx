// Sicherung des Lernstands als Datei und Wiederherstellen.

import { useRef, useState } from 'preact/hooks';
import { alleEreignisse, ersetzeAlle, useLernstand } from '../../lernstand/store.js';
import { sicherungErstellen, sicherungLesen, zusammenfuehren, SicherungsFehler } from '../../lernstand/speicher.js';
import { useEinstellung, alleEinstellungenLoeschen } from '../../lernstand/einstellungen.js';
import { tagVon, tageZwischen, datumKurz } from '../../lernstand/zeit.js';
import { Icon, Knopf } from '../../ui/bausteine.jsx';
import { Dialog, melde, bestaetige } from '../../ui/dialog.jsx';

export function herunterladen(dateiname, text, typ = 'application/json') {
  const blob = new Blob([text], { type: typ });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = dateiname;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function SicherungsKnopf() {
  const stand = useLernstand();
  const [offen, setOffen] = useState(false);
  const [letzte] = useEinstellung('letzteSicherung', null);
  const tage = letzte ? tageZwischen(tagVon(letzte), stand.heute) : null;
  const mahnen = alleEreignisse().length > 20 && (tage === null || tage >= 7);
  return (
    <>
      <button class={`knopf knopf--zweit knopf--s sicherung-knopf ${mahnen ? 'sicherung-knopf--mahnen' : ''}`} onClick={() => setOffen(true)} data-tip={letzte ? `Letzte Sicherung: ${datumKurz(tagVon(letzte))}` : 'Noch keine Sicherung'} data-tip-unten="">
        <Icon name="hard-drive-download" groesse={14} />
        Sicherung
        {mahnen && <span class="sicherung-knopf__punkt" aria-label="Sicherung empfohlen" />}
      </button>
      <SicherungsDialog offen={offen} onSchliessen={() => setOffen(false)} />
    </>
  );
}

function SicherungsDialog({ offen, onSchliessen }) {
  const [letzte, setLetzte] = useEinstellung('letzteSicherung', null);
  const datei = useRef(null);
  const [modus, setModus] = useState('ersetzen');
  const anzahl = alleEreignisse().length;

  const sichern = () => {
    const jetzt = new Date();
    herunterladen(`lernstudio-sicherung-${tagVon(jetzt)}.json`, JSON.stringify(sicherungErstellen(alleEreignisse(), jetzt)));
    setLetzte(jetzt.getTime());
    melde('Sicherung gespeichert. Leg die Datei an einen sicheren Ort.', { icon: 'hard-drive-download' });
  };

  const einlesen = async (e) => {
    const f = e.currentTarget.files?.[0];
    e.currentTarget.value = '';
    if (!f) return;
    try {
      const daten = sicherungLesen(await f.text());
      const ok = await bestaetige({
        titel: modus === 'ersetzen' ? 'Lernstand ersetzen?' : 'Lernstände zusammenführen?',
        text:
          modus === 'ersetzen'
            ? `Die Sicherung enthält ${daten.ereignisse.length} Lernhandlungen. Dein aktueller Lernstand (${anzahl}) wird dadurch ersetzt.`
            : `Die ${daten.ereignisse.length} Lernhandlungen der Sicherung werden mit deinen ${anzahl} zusammengeführt. Doppelte werden nur einmal übernommen.`,
        ja: modus === 'ersetzen' ? 'Ersetzen' : 'Zusammenführen',
        gefahr: modus === 'ersetzen',
      });
      if (!ok) return;
      ersetzeAlle(modus === 'ersetzen' ? daten.ereignisse : zusammenfuehren(alleEreignisse(), daten.ereignisse));
      melde('Lernstand eingelesen.', { icon: 'upload' });
      onSchliessen();
    } catch (fehler) {
      melde(fehler instanceof SicherungsFehler ? fehler.message : `Die Datei konnte nicht gelesen werden: ${fehler.message}`, { fehler: true, dauer: 8000 });
    }
  };

  const zuruecksetzen = async () => {
    const ok = await bestaetige({
      titel: 'Alles zurücksetzen?',
      text: `Dein gesamter Lernstand wird gelöscht: ${anzahl} Lernhandlungen – abgehakte Stichpunkte, Lernkarten, Trainer-Ergebnisse, Notizen, Prüfungstermine, Erfahrungspunkte und Serie. Das lässt sich nicht rückgängig machen. Lade vorher eine Sicherung herunter, wenn du den Stand behalten willst.`,
      ja: 'Alles löschen',
      gefahr: true,
    });
    if (!ok) return;
    ersetzeAlle([]);
    alleEinstellungenLoeschen();
    melde('Alles zurückgesetzt – du startest wieder bei „Hello World".', { icon: 'rotate-ccw' });
    onSchliessen();
  };

  return (
    <Dialog offen={offen} titel="Lernstand sichern" icon="hard-drive-download" onSchliessen={onSchliessen}>
      <div class="stapel stapel--4">
        <p>
          Dein Lernstand liegt nur in diesem Browser. Sichere ihn regelmäßig als Datei – dann ist er auch nach einem Browserwechsel, auf einem anderen
          Rechner oder nach einem Update sicher.
        </p>
        <div class="sicherung-zeile">
          <div class="wachsen">
            <div class="sicherung-zeile__titel">Sicherung herunterladen</div>
            <div class="gedaempft">
              {anzahl} Lernhandlungen · {letzte ? `zuletzt gesichert am ${datumKurz(tagVon(letzte))}` : 'noch nie gesichert'}
            </div>
          </div>
          <Knopf variante="primaer" icon="download" onClick={sichern}>
            Sichern
          </Knopf>
        </div>
        <div class="sicherung-zeile">
          <div class="wachsen">
            <div class="sicherung-zeile__titel">Sicherung einlesen</div>
            <div class="gedaempft">Auch Sicherungen aus älteren Versionen des Lernstudios.</div>
            <div class="sicherung-modus" role="radiogroup" aria-label="Art des Einlesens">
              <label>
                <input type="radio" name="modus" checked={modus === 'ersetzen'} onChange={() => setModus('ersetzen')} /> ersetzen
              </label>
              <label>
                <input type="radio" name="modus" checked={modus === 'zusammen'} onChange={() => setModus('zusammen')} /> mit aktuellem Stand zusammenführen
              </label>
            </div>
          </div>
          <Knopf icon="upload" onClick={() => datei.current?.click()}>
            Datei wählen
          </Knopf>
          <input ref={datei} type="file" accept=".json,application/json" hidden onChange={einlesen} />
        </div>
        <div class="sicherung-zeile sicherung-zeile--gefahr">
          <div class="wachsen">
            <div class="sicherung-zeile__titel">Alles zurücksetzen</div>
            <div class="gedaempft">Löscht deinen gesamten Lernstand in diesem Browser. Du fängst von vorn an.</div>
          </div>
          <Knopf variante="gefahr" icon="trash" onClick={zuruecksetzen}>
            Zurücksetzen
          </Knopf>
        </div>
      </div>
    </Dialog>
  );
}
