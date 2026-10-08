import { useCallback } from 'preact/hooks';
import { TrainerSeite, Uebung } from '../rahmen/Uebung.jsx';
import { ERZEUGER } from './aufgaben.js';
import { SubnetzVisualizer } from './Visualizer.jsx';

const SPICKZETTEL = {
  analyse:
    '- Netzadresse: alle Hostbits 0 · Broadcast: alle Hostbits 1\n- Hostbereich: Netzadresse + 1 bis Broadcast − 1\n- Nutzbare Hosts: 2^(32 − Präfix) − 2\n- Blockgröße im letzten Oktett: 256 − Maskenwert (z. B. /26 → 256 − 192 = 64)\n- /31: RFC 3021 Punkt-zu-Punkt, /32: ein einzelner Host',
  maske: '- /24 = 255.255.255.0 · /25 = .128 · /26 = .192 · /27 = .224 · /28 = .240 · /29 = .248 · /30 = .252\n- Präfix = Anzahl der Einsen in der Maske',
  gleich: '- Beide Adressen mit der Maske verknüpfen (UND); gleiche Netzadresse = gleiches Netz\n- Verschiedene Netze brauchen einen Router (Standardgateway)',
  privat: '- 10.0.0.0/8\n- 172.16.0.0/12 (172.16.0.0 bis 172.31.255.255)\n- 192.168.0.0/16',
  ipv6: '- 128 Bit, 8 Gruppen à 4 Hex-Ziffern\n- Führende Nullen je Gruppe weglassen\n- Eine Folge von Nullgruppen einmal durch :: ersetzen (die längste)\n- /64: vordere 64 Bit Präfix, hintere 64 Bit Interface-Identifier\n- fe80::/10 = verbindungslokal (Link-Local)',
  aufteilen: '- Bedarf absteigend sortieren\n- Je Netz: kleinste Blockgröße 2^h mit 2^h − 2 ≥ Hosts → Präfix 32 − h\n- Netze lückenlos hintereinander vergeben',
};

export function SubnetzTrainer({ raum, trainer, modi, params }) {
  return (
    <TrainerSeite raum={raum} trainer={trainer} modi={modi} modus={params.modus}>
      {(m) => (m.id === 'visual' ? <SubnetzVisualizer /> : <SubnetzUebung key={m.id} modus={m} />)}
    </TrainerSeite>
  );
}

function SubnetzUebung({ modus }) {
  const erzeuge = useCallback((rng) => ERZEUGER[modus.id](rng), [modus.id]);
  return <Uebung erzeuge={erzeuge} trainerId="subnetz" modusId={modus.id} spIds={modus.sp} spickzettel={SPICKZETTEL[modus.id]} />;
}
