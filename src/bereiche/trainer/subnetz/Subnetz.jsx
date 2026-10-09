// Subnetz-Trainer: drei Räume – Verstehen (Lernweg), Üben (Aufgaben nach Themen), Visualisieren (Visualizer).
// Rahmen, Lernweg und Üben-Raum kommen aus lernweg/; hier stehen Inhalt, Spickzettel und der Visualizer.

import { useCallback } from 'preact/hooks';
import { Uebung } from '../rahmen/Uebung.jsx';
import { RaumTrainer, VERSTEHEN, UEBEN } from '../lernweg/RaumTrainer.jsx';
import { Verstehen } from '../lernweg/Verstehen.jsx';
import { Ueben } from '../lernweg/Ueben.jsx';
import { SubnetzVisualizer } from './Visualizer.jsx';
import { LERNWEG } from './verstehen/lernweg.js';
import { CHECKS, SUBNETZ_TYPEN } from './verstehen/checks.js';
import { INHALT } from './verstehen/inhalt/index.js';
import { ERZEUGER } from './ueben/aufgaben.js';

const RAEUME = [VERSTEHEN, UEBEN, { id: 'visualisieren', name: 'Visualisieren', text: 'Eine Adresse zerlegt ansehen', icon: 'eye' }];

const SPICKZETTEL = {
  binaer:
    '- Stellenwerte: 128 · 64 · 32 · 16 · 8 · 4 · 2 · 1\n- Binär → dezimal: Stellenwerte über den Einsen addieren\n- Dezimal → binär: von links fragen „Passt der Stellenwert in den Rest?“ – ja → 1 und abziehen, nein → 0',
  hosts:
    '- Adressen: 2^(32 − Präfix) · nutzbare Hosts: Adressen − 2\n- Entscheidendes Oktett: das erste Oktett der Subnetzmaske, das nicht 255 ist\n- Blockgröße = 256 − Wert der Subnetzmaske in diesem Oktett',
  konfig:
    '- Einzutragen: IP-Adresse, Subnetzmaske, Standardgateway, DNS-Server\n- Statische Adresse: im richtigen Netz, nicht Netz-/Broadcastadresse, nicht vergeben, außerhalb des DHCP-Bereichs\n- Das Standardgateway liegt im selben Netz wie das Gerät',
  mac: '- MAC-Adresse: 48 Bit, 6 Bytes hexadezimal, vordere Hälfte = Herstellerkennung\n- ARP: zu einer IP-Adresse im lokalen Netz die MAC-Adresse ermitteln; `arp -a` zeigt den Cache\n- DHCP teilt zu: IP-Adresse, Subnetzmaske, Standardgateway, DNS-Server\n- 169.254.x.x: kein DHCP-Server erreicht',
  analyse:
    '- Netzadresse: alle Hostbits 0 · Broadcast: alle Hostbits 1\n- Hostbereich: Netzadresse + 1 bis Broadcast − 1\n- Nutzbare Hosts: 2^(32 − Präfix) − 2\n- Blockgröße im letzten Oktett: 256 − Maskenwert (z. B. /26 → 256 − 192 = 64)\n- /31: RFC 3021 Punkt-zu-Punkt, /32: ein einzelner Host',
  maske: '- /24 = 255.255.255.0 · /25 = .128 · /26 = .192 · /27 = .224 · /28 = .240 · /29 = .248 · /30 = .252\n- Präfix = Anzahl der Einsen in der Subnetzmaske',
  gleich: '- Beide Adressen mit der Subnetzmaske verknüpfen (UND); gleiche Netzadresse = gleiches Netz\n- Verschiedene Netze brauchen einen Router (Standardgateway)',
  privat: '- 10.0.0.0/8\n- 172.16.0.0/12 (172.16.0.0 bis 172.31.255.255)\n- 192.168.0.0/16',
  ipv6: '- 128 Bit, 8 Gruppen à 4 Hex-Ziffern\n- Führende Nullen je Gruppe weglassen\n- Eine Folge von Nullgruppen einmal durch :: ersetzen (die längste)\n- /64: vordere 64 Bit Präfix, hintere 64 Bit Interface-Identifier\n- fe80::/10 = verbindungslokal (Link-Local)',
  aufteilen: '- Bedarf absteigend sortieren\n- Je Netz: kleinste Blockgröße 2^h mit 2^h − 2 ≥ Hosts → Präfix 32 − h\n- Netze lückenlos hintereinander vergeben',
};

export function SubnetzTrainer({ raum, trainer, modi, params }) {
  return (
    <RaumTrainer raum={raum} trainer={trainer} modi={modi} params={params} raeume={RAEUME} kuerzel="sn" untertitel="IP-Adressen und Subnetting: verstehen, üben, ansehen.">
      {(aktiv, { uebungen, oeffne, waehleUebung }) => (
        <>
          {aktiv.bereich === 'verstehen' && (
            <Verstehen
              raum={raum}
              lernweg={LERNWEG}
              checks={CHECKS}
              inhalt={INHALT}
              typen={SUBNETZ_TYPEN}
              lektionId={params.lektion}
              onLektion={(id) => oeffne('verstehen', { lektion: id ?? undefined })}
            />
          )}
          {aktiv.bereich === 'ueben' && (
            <Ueben raum={raum} lernweg={LERNWEG} uebungen={uebungen} aktiv={aktiv} onWahl={waehleUebung}>
              <SubnetzUebung key={aktiv.id} modus={aktiv} />
            </Ueben>
          )}
          {aktiv.bereich === 'visualisieren' && <SubnetzVisualizer />}
        </>
      )}
    </RaumTrainer>
  );
}

function SubnetzUebung({ modus }) {
  const erzeuge = useCallback((rng) => ERZEUGER[modus.id](rng), [modus.id]);
  return <Uebung erzeuge={erzeuge} trainerId="subnetz" modusId={modus.id} spIds={modus.sp} spickzettel={SPICKZETTEL[modus.id]} />;
}
