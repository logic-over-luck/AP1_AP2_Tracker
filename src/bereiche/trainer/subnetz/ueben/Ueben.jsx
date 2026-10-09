// Raum „Üben“: die Aufgaben, gruppiert nach den Themen-Blöcken des Lernwegs.

import { useCallback } from 'preact/hooks';
import { Icon } from '../../../../ui/bausteine.jsx';
import { Uebung } from '../../rahmen/Uebung.jsx';
import { link } from '../../../../router.js';
import { BLOECKE, LEKTIONEN } from '../verstehen/lernweg.js';
import { ERZEUGER } from './aufgaben.js';

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

export function Ueben({ uebungen, aktiv, onWahl }) {
  const gruppen = BLOECKE.map((b) => ({ ...b, uebungen: uebungen.filter((m) => m.thema === b.id) })).filter((g) => g.uebungen.length);
  return (
    <div class="sn-ueben">
      <nav class="sn-themen" aria-label="Übungen nach Themen">
        {gruppen.map((g) => (
          <div key={g.id} class="sn-thema">
            <span class="sn-thema__titel">{g.titel}</span>
            <div class="sn-thema__liste" role="tablist" aria-label={g.titel}>
              {g.uebungen.map((m) => (
                <button key={m.id} type="button" role="tab" aria-selected={m.id === aktiv.id} class="trainer-modus" onClick={() => onWahl(m)}>
                  {m.name}
                  {m.zusatzIn && <span class="trainer-modus__zusatz">Zusatz</span>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
      {aktiv.hinweis && (
        <p class="trainer-hinweis">
          <Icon name="info" groesse={14} /> {aktiv.hinweis}
        </p>
      )}
      <SubnetzUebung key={aktiv.id} modus={aktiv} />
      <DazuImLernweg modus={aktiv} />
    </div>
  );
}

// Lektionen, die zu dieser Übung hinführen
function DazuImLernweg({ modus }) {
  const lektionen = LEKTIONEN.filter((l) => l.uebung === modus.id);
  if (!lektionen.length) return null;
  return (
    <div class="sn-dazu">
      <span class="ueberschrift-klein">
        <Icon name="lightbulb" groesse={13} /> Dazu im Lernweg
      </span>
      {lektionen.map((l) => (
        <a key={l.id} class="sn-baut__chip" href={link('AP1', 'trainer', 'subnetz', { modus: 'verstehen', lektion: l.id })}>
          {l.nr}. {l.begriff}
        </a>
      ))}
    </div>
  );
}

function SubnetzUebung({ modus }) {
  const erzeuge = useCallback((rng) => ERZEUGER[modus.id](rng), [modus.id]);
  return <Uebung erzeuge={erzeuge} trainerId="subnetz" modusId={modus.id} spIds={modus.sp} spickzettel={SPICKZETTEL[modus.id]} />;
}
