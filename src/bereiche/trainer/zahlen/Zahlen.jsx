import { useCallback } from 'preact/hooks';
import { TrainerSeite, Uebung } from '../rahmen/Uebung.jsx';
import { ERZEUGER } from './aufgaben.js';

const SPICKZETTEL = {
  zahlensysteme:
    '- Dezimal → andere Basis: fortlaufend durch die Basis teilen, Reste von unten nach oben lesen\n- Andere Basis → dezimal: Ziffer · Basis^Stelle aufsummieren (Stelle von rechts ab 0)\n- Binär ↔ Hex: 4 Bit = 1 Hex-Ziffer (A=10 … F=15)\n- Zweierpotenzen: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1.024',
  praefixe:
    '- Dezimalpräfixe: 1 kB = 1.000 Byte, 1 MB = 1.000² Byte, 1 GB = 1.000³ Byte\n- Binärpräfixe: 1 KiB = 1.024 Byte, 1 MiB = 1.024² Byte, 1 GiB = 1.024³ Byte\n- Datenmengen nach Katalog mit Binärpräfix, physikalische Größen mit Dezimalpräfix\n- 8 Bit = 1 Byte',
  datenmenge:
    '- Speicher (Bit) = Anzahl Werte · Bit je Wert\n- Bild: Breite · Höhe · Farbtiefe (Bit), dann ÷ 8 → Byte\n- Byte → KiB → MiB → GiB → TiB: jeweils ÷ 1.024\n- 1 Megapixel = 1.000.000 Bildpunkte\n- n Bit → 2^n mögliche Werte',
  uebertragung:
    '- Dauer = Datenmenge ÷ Übertragungsrate\n- Datenmenge in Bit umrechnen: Byte · 8, Binärpräfix beachten (1 MiB = 1.048.576 Byte)\n- Raten mit Dezimalpräfix: 1 Mbit/s = 1.000.000 bit/s',
  energie:
    '- P = U · I (W = V · A)\n- Energie W = P · t, 1 kWh = 1.000 Wh\n- Kosten = kWh · Preis je kWh\n- Wirkungsgrad η = P_ab ÷ P_auf → P_auf = P_ab ÷ η',
  rechte: '- r = 4, w = 2, x = 1, je Gruppe addieren\n- drei Gruppen: Besitzer, Gruppe, andere\n- Beispiel: 754 = rwx r-x r--',
  paritaet: '- Gerade Parität: Einsen insgesamt (mit Paritätsbit) gerade\n- Ungerade Parität: Einsen insgesamt ungerade\n- Erkennt einen einzelnen Bitfehler, berichtigt ihn nicht',
};

export function ZahlenTrainer({ raum, trainer, modi, params }) {
  return (
    <TrainerSeite raum={raum} trainer={trainer} modi={modi} modus={params.modus}>
      {(m) => <ZahlenUebung key={m.id} raum={raum} modus={m} />}
    </TrainerSeite>
  );
}

function ZahlenUebung({ raum, modus }) {
  const erzeuge = useCallback((rng) => ERZEUGER[modus.id](rng, raum), [modus.id, raum]);
  return <Uebung erzeuge={erzeuge} trainerId="zahlen" modusId={modus.id} spIds={modus.sp} spickzettel={SPICKZETTEL[modus.id]} />;
}
