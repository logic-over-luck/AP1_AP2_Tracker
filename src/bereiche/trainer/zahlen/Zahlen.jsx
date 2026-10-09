// Zahlen-Trainer: zwei Räume – Verstehen (Lernweg: Zahlensysteme, Datenmengen, Bits, Strom) und Üben (Aufgaben
// nach Themen). Rahmen, Lernweg und Üben-Raum kommen aus lernweg/; hier stehen Inhalt und Spickzettel.

import { useCallback } from 'preact/hooks';
import { Uebung } from '../rahmen/Uebung.jsx';
import { RaumTrainer, VERSTEHEN, UEBEN } from '../lernweg/RaumTrainer.jsx';
import { Verstehen } from '../lernweg/Verstehen.jsx';
import { Ueben } from '../lernweg/Ueben.jsx';
import { LERNWEG } from './verstehen/lernweg.js';
import { CHECKS } from './verstehen/checks.js';
import { INHALT } from './verstehen/inhalt/index.js';
import { ERZEUGER, artenFuer } from './aufgaben.js';

const RAEUME = [VERSTEHEN, UEBEN];

const SPICKZETTEL = {
  zahlensysteme:
    '- Dezimal → andere Basis: fortlaufend durch die Basis teilen, Reste von unten nach oben lesen\n- Andere Basis → dezimal: Ziffer · Basis^Stelle aufsummieren (Stelle von rechts ab 0)\n- Binär ↔ Hex: 4 Bit = 1 Hex-Ziffer (A=10 … F=15)\n- Zweierpotenzen: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1.024',
  praefixe:
    '- Dezimalpräfixe: 1 kB = 1.000 Byte, 1 MB = 1.000² Byte, 1 GB = 1.000³ Byte\n- Binärpräfixe: 1 KiB = 1.024 Byte, 1 MiB = 1.024² Byte, 1 GiB = 1.024³ Byte\n- Datenmengen nach Katalog mit Binärpräfix, physikalische Größen mit Dezimalpräfix\n- 8 Bit = 1 Byte',
  datenmenge:
    '- Speicher (Bit) = Anzahl Werte · Bit je Wert\n- Bild: Breite · Höhe · Farbtiefe (Bit), dann ÷ 8 → Byte\n- Byte → KiB → MiB → GiB → TiB: jeweils ÷ 1.024\n- 1 Megapixel = 1.000.000 Bildpunkte\n- n Bit → 2^n mögliche Werte',
  uebertragung:
    '- Dauer = Datenmenge ÷ Übertragungsrate\n- Datenmenge in Bit umrechnen: Byte · 8, Binärpräfix beachten (1 MiB = 1.048.576 Byte)\n- Raten mit Dezimalpräfix: 1 Mbit/s = 1.000.000 bit/s',
  energie: '- P = U · I (W = V · A)\n- Energie W = P · t, 1 kWh = 1.000 Wh\n- Kosten = kWh · Preis je kWh\n- Wirkungsgrad η = P_ab ÷ P_auf → P_auf = P_ab ÷ η',
  rechte: '- r = 4, w = 2, x = 1, je Gruppe addieren\n- drei Gruppen: Besitzer, Gruppe, andere\n- Beispiel: 754 = rwx r-x r--',
  paritaet: '- Gerade Parität: Einsen insgesamt (mit Paritätsbit) gerade\n- Ungerade Parität: Einsen insgesamt ungerade\n- Erkennt einen einzelnen Bitfehler, berichtigt ihn nicht',
};

export function ZahlenTrainer({ raum, trainer, modi, params }) {
  return (
    <RaumTrainer
      raum={raum}
      trainer={trainer}
      modi={modi}
      params={params}
      raeume={RAEUME}
      kuerzel="zl"
      untertitel="Zahlensysteme, Datenmengen, Bits und Strom: verstehen und üben."
    >
      {(aktiv, { uebungen, oeffne, waehleUebung }) => (
        <>
          {aktiv.bereich === 'verstehen' && (
            <Verstehen
              raum={raum}
              lernweg={LERNWEG}
              checks={CHECKS}
              inhalt={INHALT}
              lektionId={params.lektion}
              onLektion={(id) => oeffne('verstehen', { lektion: id ?? undefined })}
            />
          )}
          {aktiv.bereich === 'ueben' && (
            <Ueben raum={raum} lernweg={LERNWEG} uebungen={uebungen} aktiv={aktiv} onWahl={waehleUebung}>
              <ZahlenUebung key={aktiv.id} raum={raum} modus={aktiv} />
            </Ueben>
          )}
        </>
      )}
    </RaumTrainer>
  );
}

function ZahlenUebung({ raum, modus }) {
  const erzeuge = useCallback((rng) => ERZEUGER[modus.id](rng, raum), [modus.id, raum]);
  return <Uebung erzeuge={erzeuge} trainerId="zahlen" modusId={modus.id} spIds={modus.sp} spickzettel={SPICKZETTEL[modus.id]} arten={artenFuer(modus.id, raum)} />;
}
