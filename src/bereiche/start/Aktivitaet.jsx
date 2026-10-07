// Aktivitätsübersicht der letzten 12 Wochen, Wochen als Spalten (Mo–So).

import { tagPlus, datumAusTag, datumMitWochentag } from '../../lernstand/zeit.js';

const WOCHEN = 12;

export function Aktivitaet({ stand, kompakt }) {
  const heute = stand.heute;
  const wochentag = (datumAusTag(heute).getDay() + 6) % 7; // Mo = 0
  const erster = tagPlus(heute, -(WOCHEN - 1) * 7 - wochentag);
  const spalten = [];
  let aktiveTage = 0;
  let xpSumme = 0;
  for (let w = 0; w < WOCHEN; w++) {
    const zellen = [];
    for (let d = 0; d < 7; d++) {
      const tag = tagPlus(erster, w * 7 + d);
      const eintrag = stand.tage.get(tag);
      const xp = eintrag?.xp ?? 0;
      const zukunft = tag > heute;
      if (!zukunft && eintrag?.n) {
        aktiveTage++;
        xpSumme += xp;
      }
      const stufe = zukunft || !eintrag?.n ? 0 : xp < 15 ? 1 : xp < 40 ? 2 : xp < 90 ? 3 : 4;
      zellen.push(
        <span
          key={tag}
          class={`aktiv-zelle aktiv-zelle--${stufe} ${tag === heute ? 'aktiv-zelle--heute' : ''} ${zukunft ? 'aktiv-zelle--zukunft' : ''}`}
          title={zukunft ? '' : `${datumMitWochentag(tag)}: ${eintrag?.n ? `${xp} XP, ${eintrag.n} Lernhandlungen` : 'keine Aktivität'}`}
        />,
      );
    }
    spalten.push(
      <div key={w} class="aktiv-spalte">
        {zellen}
      </div>,
    );
  }
  if (kompakt)
    return (
      <div class="aktiv aktiv--kompakt">
        <div class="aktiv__raster" role="img" aria-label={`${aktiveTage} aktive Tage in den letzten ${WOCHEN} Wochen`}>
          {spalten}
        </div>
        <div class="kachel__fuss gedaempft">
          {aktiveTage} aktive Tage in {WOCHEN} Wochen · beste Serie {stand.serie.beste}
        </div>
      </div>
    );
  return (
    <section class="flaeche flaeche--innen aktiv" aria-label="Aktivität">
      <div class="aktiv__kopf">
        <span>Dranbleiben zählt</span>
        <span class="gedaempft">Letzte {WOCHEN} Wochen</span>
      </div>
      <div class="aktiv__raster" role="img" aria-label={`${aktiveTage} aktive Tage in den letzten ${WOCHEN} Wochen`}>
        {spalten}
      </div>
      <div class="aktiv__fuss">
        <span>
          <strong>{aktiveTage}</strong> aktive Tage · <strong>{xpSumme}</strong> XP
        </span>
        <span class="aktiv__legende" aria-hidden="true">
          weniger
          {[0, 1, 2, 3, 4].map((s) => (
            <span key={s} class={`aktiv-zelle aktiv-zelle--${s}`} />
          ))}
          mehr
        </span>
      </div>
      <div class="aktiv__serie gedaempft">Beste Serie: {stand.serie.beste} {stand.serie.beste === 1 ? 'Tag' : 'Tage'}</div>
    </section>
  );
}
