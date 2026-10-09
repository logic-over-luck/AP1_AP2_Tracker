// Kurz-Check am Ende jeder Lektion: 2–3 Fragen. Rein, getestet in tests/subnetz.test.mjs.
//
// Frage:
//   { frage, optionen: [...], richtig, tipp, erklaerung }                       – Auswahl
//   { frage, eingabe: 'zahl' | 'ipv4' | 'text' | 'ipv6kurz' | 'ipv6voll' | 'iid',
//     loesung, auch?: [...], platzhalter?, tipp, erklaerung, beleg? }           – Eingabe
// tipp erscheint nach einer falschen Antwort, erklaerung nach der richtigen.
// beleg: { ip, praefix, feld } – der Test rechnet die Lösung mit ip.js nach (feld aus netz()).

import { leseIp, leseZahl, ipv6Voll, istRichtigGekuerzt, gruppenVoll } from '../ip.js';

export const CHECKS = {
  // ---------- Block 1 ----------
  'ip-adresse': [
    {
      frage: 'Aus wie vielen Bit besteht eine IPv4-Adresse?',
      optionen: ['8', '16', '32', '64'],
      richtig: '32',
      tipp: 'Wie viele Oktette hat die Adresse, und wie viele Bit hat ein Oktett?',
      erklaerung: '4 Oktette × 8 Bit = 32 Bit.',
    },
    {
      frage: 'Welche dieser Angaben ist eine gültige IPv4-Adresse?',
      optionen: ['192.168.1.256', '10.0.300.1', '172.16.5.20', '192.168.1'],
      richtig: '172.16.5.20',
      tipp: 'Eine gültige Adresse hat genau vier Zahlen, jede von 0 bis 255.',
      erklaerung: '172.16.5.20 hat vier Oktette, alle zwischen 0 und 255. Bei den anderen ist ein Oktett zu groß (256, 300) oder es fehlt eins.',
    },
    {
      frage: 'Wie heißt jede der vier Zahlen einer IPv4-Adresse?',
      optionen: ['Bit', 'Oktett', 'Block', 'Ziffer'],
      richtig: 'Oktett',
      tipp: 'Der Name kommt von der Zahl 8 (lateinisch octo).',
      erklaerung: 'Jede Zahl steht für 8 Bit – ein Oktett (= 1 Byte).',
    },
  ],
  'netz-host': [
    {
      frage: 'Was gibt der Hostanteil einer IP-Adresse an?',
      optionen: ['das Netz', 'das einzelne Gerät im Netz', 'die Anzahl der Geräte', 'den Hersteller des Geräts'],
      richtig: 'das einzelne Gerät im Netz',
      tipp: 'Denk an die Anschrift: Straße und Hausnummer.',
      erklaerung: 'Der Hostanteil ist die „Hausnummer“ – er unterscheidet die Geräte innerhalb eines Netzes.',
    },
    {
      frage: 'Der Netzanteil sind hier die ersten drei Oktette. Welche Adresse liegt im selben Netz wie 10.20.30.40?',
      optionen: ['10.20.31.40', '10.20.30.99', '10.21.30.40', '11.20.30.40'],
      richtig: '10.20.30.99',
      tipp: 'Der Netzanteil – die ersten drei Oktette – muss gleich sein.',
      erklaerung: 'Netzanteil 10.20.30 ist gleich, nur der Hostanteil (40 bzw. 99) unterscheidet sich.',
    },
    {
      frage: 'Zwei Geräte im selben Netz haben …',
      optionen: ['denselben Hostanteil', 'denselben Netzanteil', 'dieselbe IP-Adresse'],
      richtig: 'denselben Netzanteil',
      tipp: 'Welcher Teil beschreibt das Netz?',
      erklaerung: 'Gleicher Netzanteil = gleiches Netz. Der Hostanteil muss sich unterscheiden, sonst hätten beide dieselbe Adresse.',
    },
  ],
  binaer: [
    {
      frage: 'Welche Bits ergeben die Zahl 192?',
      optionen: ['10000000', '10100000', '11000000', '11100000'],
      richtig: '11000000',
      tipp: 'Passt 128 in 192? Was bleibt übrig – passt dann 64?',
      erklaerung: '192 = 128 + 64 → die ersten beiden Bits sind 1: 11000000.',
    },
    {
      frage: 'Welche Dezimalzahl ist 00101000?',
      eingabe: 'zahl',
      loesung: '40',
      tipp: 'Schreib die Stellenwerte 128 64 32 16 8 4 2 1 darüber und addiere die unter den Einsen.',
      erklaerung: 'Die Einsen stehen bei 32 und 8: 32 + 8 = 40.',
    },
    {
      frage: 'Welchen Wert hat 11111111?',
      optionen: ['8', '128', '255', '256'],
      richtig: '255',
      tipp: 'Alle Stellenwerte zählen mit: 128 + 64 + … + 1.',
      erklaerung: '128 + 64 + 32 + 16 + 8 + 4 + 2 + 1 = 255 – die größte Zahl mit 8 Bit.',
    },
  ],
  praefix: [
    {
      frage: 'Wie viele Hostbits hat ein /27?',
      eingabe: 'zahl',
      loesung: '5',
      tipp: 'Eine Adresse hat 32 Bit. Wie viele bleiben nach den Netzbits?',
      erklaerung: '32 − 27 = 5 Hostbits.',
    },
    {
      frage: 'In welchem Oktett liegt die Grenze bei /20?',
      optionen: ['im 1. Oktett', 'im 2. Oktett', 'im 3. Oktett', 'im 4. Oktett'],
      richtig: 'im 3. Oktett',
      tipp: 'Zähl in Schritten von 8: Wie viele ganze Oktette passen in 20 Bit?',
      erklaerung: '8 + 8 = 16 Bit sind die ersten beiden Oktette, die restlichen 4 Netzbits liegen im 3. Oktett.',
    },
    {
      frage: 'Was bedeutet /24 hinter 192.168.1.10?',
      optionen: ['24 Geräte passen ins Netz', 'die ersten 24 Bit sind der Netzanteil', 'es ist das 24. Gerät im Netz', 'die Adresse hat 24 Oktette'],
      richtig: 'die ersten 24 Bit sind der Netzanteil',
      tipp: 'Der Präfix zählt Bits – von links.',
      erklaerung: '/24 = 24 Netzbits von links, also die ersten drei Oktette. Die übrigen 8 Bit sind der Hostanteil.',
    },
  ],
  subnetzmaske: [
    {
      frage: 'Welche Subnetzmaske gehört zu /27?',
      eingabe: 'ipv4',
      loesung: '255.255.255.224',
      platzhalter: 'z. B. 255.255.255.0',
      tipp: '27 = 8 + 8 + 8 + 3. Wie viel ergeben 3 Einsen von links?',
      erklaerung: 'Drei volle Oktette (255.255.255), dann 3 Einsen: 128 + 64 + 32 = 224.',
    },
    {
      frage: 'Welcher Präfix gehört zur Subnetzmaske 255.255.255.240?',
      optionen: ['/24', '/26', '/28', '/30'],
      richtig: '/28',
      tipp: 'Wie viele Einsen stecken in 240?',
      erklaerung: '240 = 128 + 64 + 32 + 16 → 4 Einsen. 24 + 4 = /28.',
    },
    {
      frage: 'Welche ist keine gültige Subnetzmaske?',
      optionen: ['255.255.255.0', '255.255.255.128', '255.255.255.100', '255.255.0.0'],
      richtig: '255.255.255.100',
      tipp: 'In einer Subnetzmaske stehen alle Einsen lückenlos links. Welcher Wert passt nicht in die Reihe 0, 128, 192, 224 …?',
      erklaerung: '100 = 01100100 – da stehen Nullen zwischen den Einsen. Das kann keine Grenze sein.',
    },
  ],

  // ---------- Block 2 ----------
  netzgroesse: [
    {
      frage: 'Wie viele Adressen hat ein /27-Netz?',
      eingabe: 'zahl',
      loesung: '32',
      tipp: 'Erst die Hostbits (32 − 27), dann 2 hoch Hostbits.',
      erklaerung: '5 Hostbits → 2⁵ = 32 Adressen.',
    },
    {
      frage: 'Wie viele Adressen hat ein /24-Netz?',
      eingabe: 'zahl',
      loesung: '256',
      tipp: '8 Hostbits – das ist ein ganzes Oktett.',
      erklaerung: '2⁸ = 256 Adressen (x.x.x.0 bis x.x.x.255).',
    },
    {
      frage: 'Der Präfix wird um 1 größer, z. B. /25 → /26. Was passiert mit der Netzgröße?',
      optionen: ['sie verdoppelt sich', 'sie halbiert sich', 'sie wird um 1 kleiner', 'sie bleibt gleich'],
      richtig: 'sie halbiert sich',
      tipp: 'Ein Netzbit mehr heißt ein Hostbit weniger.',
      erklaerung: 'Ein Hostbit weniger halbiert die Zahl der Möglichkeiten: /25 = 128 Adressen, /26 = 64.',
    },
  ],
  blockgroesse: [
    {
      frage: 'Wie groß ist die Blockgröße bei /27?',
      eingabe: 'zahl',
      loesung: '32',
      tipp: 'Subnetzmaske im 4. Oktett: 224. Dann 256 − 224.',
      erklaerung: '256 − 224 = 32 (oder 2⁵ bei 5 Hostbits).',
    },
    {
      frage: 'Bei welchen Zahlen im letzten Oktett beginnen /26-Netze?',
      optionen: ['0, 64, 128, 192', '0, 26, 52, 78', '1, 65, 129, 193', '0, 100, 200'],
      richtig: '0, 64, 128, 192',
      tipp: 'Blockgröße bei /26 = 256 − 192. Netze beginnen bei 0 und Vielfachen davon.',
      erklaerung: 'Blockgröße 64 → 0, 64, 128, 192.',
    },
    {
      frage: 'Subnetzmaske 255.255.255.248 – wie groß ist die Blockgröße?',
      eingabe: 'zahl',
      loesung: '8',
      tipp: '256 minus den Wert im 4. Oktett.',
      erklaerung: '256 − 248 = 8. Die Netze beginnen bei 0, 8, 16, 24 …',
    },
  ],
  netzadresse: [
    {
      frage: 'Wie lautet die Netzadresse von 172.16.8.100/27?',
      eingabe: 'ipv4',
      loesung: '172.16.8.96',
      beleg: { ip: '172.16.8.100', praefix: 27, feld: 'netz' },
      tipp: 'Blockgröße 256 − 224 = 32. Welches Vielfache von 32 liegt direkt unter 100?',
      erklaerung: '100 : 32 = 3 Rest 4 → 3 × 32 = 96. Die ersten drei Oktette abschreiben: 172.16.8.96.',
    },
    {
      frage: 'Wie lautet die Netzadresse von 192.168.5.200/26?',
      eingabe: 'ipv4',
      loesung: '192.168.5.192',
      beleg: { ip: '192.168.5.200', praefix: 26, feld: 'netz' },
      tipp: 'Blockgröße 64: 0, 64, 128, 192 … Welcher Anfang liegt direkt unter 200?',
      erklaerung: '192 ≤ 200 < 256 → Netzadresse 192.168.5.192.',
    },
    {
      frage: 'Was gilt für die Netzadresse?',
      optionen: ['Sie gehört dem ersten Gerät im Netz', 'Alle Hostbits sind 0', 'Alle Hostbits sind 1', 'Sie endet immer auf .0'],
      richtig: 'Alle Hostbits sind 0',
      tipp: 'Sie ist der Anfang des Blocks – wie sehen die Hostbits ganz am Anfang aus?',
      erklaerung: 'Alle Hostbits 0 = der erste Wert im Block. Sie bezeichnet das Netz; kein Gerät bekommt sie. Auf .0 endet sie nur, wenn der Block bei 0 beginnt.',
    },
  ],
  broadcast: [
    {
      frage: 'Wie lautet die Broadcastadresse von 172.16.8.100/27?',
      eingabe: 'ipv4',
      loesung: '172.16.8.127',
      beleg: { ip: '172.16.8.100', praefix: 27, feld: 'broadcast' },
      tipp: 'Netzadresse 172.16.8.96, Blockgröße 32. Wo beginnt das nächste Netz?',
      erklaerung: '96 + 32 = 128 ist schon das nächste Netz → Broadcast 127.',
    },
    {
      frage: 'Netz 10.0.0.128/26. Wie lautet die Broadcastadresse?',
      optionen: ['10.0.0.190', '10.0.0.191', '10.0.0.192', '10.0.0.255'],
      richtig: '10.0.0.191',
      tipp: '128 + 64 = 192 – gehört 192 noch dazu?',
      erklaerung: '192 ist schon der Anfang des nächsten Netzes, also endet dieses bei 191.',
    },
    {
      frage: 'Wozu dient die Broadcastadresse?',
      optionen: ['Ein Paket an sie erreicht alle Geräte im Netz', 'Sie bezeichnet das Netz selbst', 'Sie gehört dem letzten Gerät', 'Sie verbindet zwei Netze'],
      richtig: 'Ein Paket an sie erreicht alle Geräte im Netz',
      tipp: '„Broadcast“ heißt Rundruf.',
      erklaerung: 'An die Broadcastadresse geschickt, landet ein Paket bei allen Geräten im Netz – deshalb bekommt sie kein einzelnes Gerät.',
    },
  ],
  hostbereich: [
    {
      frage: 'Wie viele nutzbare Hosts hat ein /27-Netz?',
      eingabe: 'zahl',
      loesung: '30',
      tipp: 'Erst die Adressen (2⁵), dann zwei abziehen.',
      erklaerung: '32 Adressen − Netzadresse − Broadcast = 30 Hosts.',
    },
    {
      frage: 'Welche ist die erste nutzbare Adresse von 172.16.8.100/27?',
      eingabe: 'ipv4',
      loesung: '172.16.8.97',
      beleg: { ip: '172.16.8.100', praefix: 27, feld: 'erster' },
      tipp: 'Netzadresse + 1.',
      erklaerung: 'Netzadresse 172.16.8.96 + 1 = 172.16.8.97.',
    },
    {
      frage: 'Netz 192.168.1.64/26: Welche ist die vorletzte nutzbare Adresse?',
      eingabe: 'ipv4',
      loesung: '192.168.1.125',
      beleg: { ip: '192.168.1.64', praefix: 26, feld: 'vorletzter' },
      tipp: 'Broadcast = 64 + 64 − 1. Letzte nutzbare = Broadcast − 1, vorletzte = Broadcast − 2.',
      erklaerung: 'Broadcast 192.168.1.127, letzte 126, vorletzte 192.168.1.125.',
    },
  ],
  'gleiches-netz': [
    {
      frage: 'Liegen 192.168.1.60/26 und 192.168.1.70/26 im selben Netz?',
      optionen: ['ja', 'nein'],
      richtig: 'nein',
      tipp: 'Blockgröße 64: In welchem Block liegt 60, in welchem 70?',
      erklaerung: '60 liegt im Block 0–63, 70 im Block 64–127. Verschiedene Netzadressen (.0 und .64) → verschiedene Netze.',
    },
    {
      frage: 'Liegen 10.0.0.130/25 und 10.0.0.250/25 im selben Netz?',
      optionen: ['ja', 'nein'],
      richtig: 'ja',
      tipp: 'Blockgröße 128: Netze beginnen bei 0 und 128.',
      erklaerung: 'Beide liegen im Block 128–255, Netzadresse jeweils 10.0.0.128.',
    },
    {
      frage: 'Welche Adresse liegt im selben Netz wie 172.16.8.100/27?',
      optionen: ['172.16.8.90', '172.16.8.120', '172.16.8.130', '172.16.9.100'],
      richtig: '172.16.8.120',
      tipp: 'Das Netz von 172.16.8.100/27 reicht von .96 bis .127.',
      erklaerung: '120 liegt im Block 96–127. 90 liegt davor, 130 dahinter, und 172.16.9.100 hat schon ein anderes drittes Oktett.',
    },
  ],
  oktett3: [
    {
      frage: 'Wie lautet die Netzadresse von 10.4.7.20/23?',
      eingabe: 'ipv4',
      loesung: '10.4.6.0',
      beleg: { ip: '10.4.7.20', praefix: 23, feld: 'netz' },
      tipp: 'Subnetzmaske 255.255.254.0 → entscheidendes Oktett ist das 3., Blockgröße 256 − 254 = 2. Das 4. Oktett wird 0.',
      erklaerung: 'Blöcke 0, 2, 4, 6, 8 … – die 7 liegt im Block 6–7. Netzadresse 10.4.6.0.',
    },
    {
      frage: 'Wie lautet die Broadcastadresse von 10.4.7.20/23?',
      eingabe: 'ipv4',
      loesung: '10.4.7.255',
      beleg: { ip: '10.4.7.20', praefix: 23, feld: 'broadcast' },
      tipp: 'Block 6–7 im 3. Oktett. Das Ende ist 7, und das 4. Oktett wird beim Broadcast …?',
      erklaerung: 'Ende des Blocks im 3. Oktett: 7, dahinter 255 → 10.4.7.255.',
    },
    {
      frage: 'Darf ein PC im Netz 10.4.6.0/23 die Adresse 10.4.6.255 bekommen?',
      optionen: ['ja', 'nein'],
      richtig: 'ja',
      tipp: 'Wo endet das Netz 10.4.6.0/23?',
      erklaerung: 'Das Netz geht bis 10.4.7.255. 10.4.6.255 liegt mittendrin – ein ganz normaler Host.',
    },
  ],
  rechenweg: [
    {
      frage: '192.168.10.77/28: Wie lautet die Netzadresse?',
      eingabe: 'ipv4',
      loesung: '192.168.10.64',
      beleg: { ip: '192.168.10.77', praefix: 28, feld: 'netz' },
      tipp: 'Subnetzmaske im 4. Oktett 240 → Blockgröße 16.',
      erklaerung: 'Blöcke 0, 16, 32, 48, 64, 80 … – 77 liegt im Block 64–79.',
    },
    {
      frage: 'Und die Broadcastadresse von 192.168.10.77/28?',
      eingabe: 'ipv4',
      loesung: '192.168.10.79',
      beleg: { ip: '192.168.10.77', praefix: 28, feld: 'broadcast' },
      tipp: 'Nächstes Netz beginnt bei 64 + 16.',
      erklaerung: '64 + 16 = 80 ist das nächste Netz → Broadcast 192.168.10.79.',
    },
    {
      frage: 'Wie viele nutzbare Hosts hat dieses /28-Netz?',
      eingabe: 'zahl',
      loesung: '14',
      beleg: { ip: '192.168.10.77', praefix: 28, feld: 'hosts' },
      tipp: '2 hoch Hostbits, minus 2.',
      erklaerung: '2⁴ = 16 Adressen − 2 = 14 Hosts.',
    },
  ],

  // ---------- Block 3 ----------
  standardgateway: [
    {
      frage: 'Ein PC mit 172.16.8.100/27 schickt ein Paket an 172.16.8.130. Wie?',
      optionen: ['direkt', 'über das Standardgateway'],
      richtig: 'über das Standardgateway',
      tipp: 'Sein Netz reicht von .96 bis .127. Wo liegt .130?',
      erklaerung: '130 liegt im nächsten Block (128–159) – anderes Netz, also ans Standardgateway.',
    },
    {
      frage: 'Welches Standardgateway passt zu einem PC mit 192.168.1.20/24?',
      optionen: ['192.168.0.1', '192.168.1.1', '192.168.1.255', '192.168.2.1'],
      richtig: '192.168.1.1',
      tipp: 'Das Gateway muss im selben Netz liegen – und darf keine reservierte Adresse sein.',
      erklaerung: '192.168.1.1 liegt im Netz 192.168.1.0/24. .255 ist der Broadcast, die anderen liegen in fremden Netzen.',
    },
    {
      frage: 'Was ist ein Router?',
      optionen: [
        'ein Gerät, das verschiedene Netze verbindet und Pakete weiterleitet',
        'die erste Adresse eines Netzes',
        'ein Programm, das Namen in Adressen übersetzt',
        'ein Gerät, das nur im eigenen Netz arbeitet',
      ],
      richtig: 'ein Gerät, das verschiedene Netze verbindet und Pakete weiterleitet',
      tipp: 'Wozu braucht man ihn, wenn das Ziel in einem anderen Netz liegt?',
      erklaerung: 'Der Router verbindet Netze. Seine Adresse im eigenen Netz ist das Standardgateway.',
    },
  ],
  privat: [
    {
      frage: 'Welche dieser Adressen ist privat?',
      optionen: ['172.32.1.1', '172.20.5.1', '192.169.1.10', '11.0.0.1'],
      richtig: '172.20.5.1',
      tipp: 'Die Bereiche: 10.x.x.x, 172.16 bis 172.31, 192.168.x.x.',
      erklaerung: '172.20 liegt zwischen 172.16 und 172.31. 172.32 und 192.169 liegen knapp daneben, 11.x ist öffentlich.',
    },
    {
      frage: 'Was gilt für private IPv4-Adressen?',
      optionen: [
        'Sie dürfen im eigenen Netz frei genutzt werden und werden im Internet nicht weitergeleitet',
        'Sie müssen bei einer Behörde beantragt werden',
        'Sie gelten nur für ein einzelnes Gerät',
        'Mit ihnen erreicht man das Internet direkt',
      ],
      richtig: 'Sie dürfen im eigenen Netz frei genutzt werden und werden im Internet nicht weitergeleitet',
      tipp: 'Warum kann jedes Heimnetz 192.168.178.x benutzen, ohne dass es Streit gibt?',
      erklaerung: 'Private Adressen sind frei für lokale Netze. Ins Internet geht es nur über den Router, der dafür seine öffentliche Adresse nimmt.',
    },
    {
      frage: 'Bis wohin reicht der private Bereich 172.16.0.0/12?',
      optionen: ['172.16.255.255', '172.31.255.255', '172.32.255.255', '172.255.255.255'],
      richtig: '172.31.255.255',
      tipp: '/12: Grenze im 2. Oktett, 4 Netzbits darin → Subnetzmaske 255.240.0.0. Blockgröße?',
      erklaerung: 'Blockgröße 256 − 240 = 16 → Block 16 bis 31 im 2. Oktett, dahinter 255.255.',
    },
  ],
  konfiguration: [
    {
      frage: 'Welche Angabe trägt man bei einer IPv4-Konfiguration nicht ein?',
      optionen: ['IP-Adresse', 'Subnetzmaske', 'Standardgateway', 'Broadcastadresse'],
      richtig: 'Broadcastadresse',
      tipp: 'Welche dieser Adressen ergibt sich von selbst aus zwei anderen?',
      erklaerung: 'Die Broadcastadresse folgt aus IP-Adresse und Subnetzmaske. Eingetragen werden Adresse, Maske, Gateway und DNS-Server.',
    },
    {
      frage: 'Wozu dient der DNS-Server?',
      optionen: ['Er übersetzt Namen wie www.beispiel.de in IP-Adressen', 'Er verbindet das Netz mit dem Internet', 'Er verteilt IP-Adressen', 'Er speichert die Subnetzmaske'],
      richtig: 'Er übersetzt Namen wie www.beispiel.de in IP-Adressen',
      tipp: 'DNS = Domain Name System – es geht um Namen.',
      erklaerung: 'Der DNS-Server ist das „Telefonbuch“: Name rein, IP-Adresse raus.',
    },
    {
      frage: 'PC: 192.168.20.25, Subnetzmaske 255.255.255.0, Standardgateway 192.168.21.1. Was stimmt nicht?',
      optionen: ['die Subnetzmaske', 'das Standardgateway liegt in einem anderen Netz', 'die Adresse ist privat', 'nichts, alles passt'],
      richtig: 'das Standardgateway liegt in einem anderen Netz',
      tipp: 'Netz des PCs: 192.168.20.0/24. Und das Gateway?',
      erklaerung: '192.168.21.1 liegt im Netz 192.168.21.0 – der PC kann es nicht direkt erreichen. Richtig wäre z. B. 192.168.20.1.',
    },
  ],
  dhcp: [
    {
      frage: 'Was teilt ein DHCP-Server einem Client zu?',
      optionen: ['nur die IP-Adresse', 'IP-Adresse, Subnetzmaske, Standardgateway und DNS-Server', 'nur Subnetzmaske und Gateway', 'die Broadcastadresse'],
      richtig: 'IP-Adresse, Subnetzmaske, Standardgateway und DNS-Server',
      tipp: 'Alles, was man sonst von Hand eintragen würde.',
      erklaerung: 'Der Client bekommt die komplette Konfiguration – genau die vier Einträge der Eingabemaske.',
    },
    {
      frage: 'Ein PC zeigt die Adresse 169.254.12.34. Was bedeutet das?',
      optionen: [
        'Er hat keinen DHCP-Server erreicht und sich selbst eine Adresse gegeben',
        'Er hat eine Adresse vom Router bekommen',
        'Er ist direkt mit dem Internet verbunden',
        'Er hat eine statische Adresse',
      ],
      richtig: 'Er hat keinen DHCP-Server erreicht und sich selbst eine Adresse gegeben',
      tipp: '169.254 ist die Notlösung, wenn etwas ausbleibt.',
      erklaerung: 'Kein DHCP-Server hat geantwortet. Prüfen: Kabel bzw. WLAN, läuft der DHCP-Server, hat er noch freie Adressen?',
    },
    {
      frage: 'Warum schickt ein Client seine erste DHCP-Anfrage als Broadcast?',
      optionen: [
        'Er kennt den DHCP-Server noch nicht und hat selbst noch keine Adresse',
        'Damit alle Geräte dieselbe Adresse bekommen',
        'Weil der DHCP-Server im Internet steht',
        'Broadcasts sind schneller',
      ],
      richtig: 'Er kennt den DHCP-Server noch nicht und hat selbst noch keine Adresse',
      tipp: 'Wen soll er gezielt fragen, wenn er niemanden kennt?',
      erklaerung: 'Ohne Adresse und ohne den Server zu kennen, bleibt nur der Rundruf an alle: „Gibt es hier einen DHCP-Server?“',
    },
  ],
  statisch: [
    {
      frage: 'Netz 192.168.10.0/24, der DHCP-Server vergibt .100 bis .200. Welche Adresse eignet sich für einen Drucker?',
      optionen: ['192.168.10.150', '192.168.10.20', '192.168.10.255', '192.168.11.20'],
      richtig: '192.168.10.20',
      tipp: 'Richtiges Netz, nicht reserviert, nicht im DHCP-Bereich.',
      erklaerung: '.150 liegt im DHCP-Bereich, .255 ist der Broadcast, 192.168.11.20 liegt in einem anderen Netz. .20 passt.',
    },
    {
      frage: 'Für welches Gerät ist eine statische Adresse sinnvoll?',
      optionen: ['Laptop eines Gastes', 'Netzwerkdrucker', 'Smartphone', 'Arbeitsplatz-PC im Großraumbüro'],
      richtig: 'Netzwerkdrucker',
      tipp: 'Welches Gerät müssen andere immer unter derselben Adresse finden?',
      erklaerung: 'Alle PCs drucken auf den Drucker – er muss immer gleich erreichbar sein. Die anderen dürfen ihre Adresse per DHCP bekommen.',
    },
    {
      frage: 'Netz 10.0.0.0/26. Die letzte nutzbare Adresse hat der Router. Welche ist die vorletzte nutzbare Adresse (für den Server)?',
      eingabe: 'ipv4',
      loesung: '10.0.0.61',
      beleg: { ip: '10.0.0.0', praefix: 26, feld: 'vorletzter' },
      tipp: 'Broadcast = 0 + 64 − 1 = 63. Letzte nutzbare 62, vorletzte …?',
      erklaerung: 'Broadcast 10.0.0.63, Router 10.0.0.62, Server 10.0.0.61.',
    },
  ],

  // ---------- Block 4 ----------
  hex: [
    {
      frage: 'Wie viele Bit stellt eine Hexadezimalziffer dar?',
      optionen: ['2', '4', '8', '16'],
      richtig: '4',
      tipp: 'Wie viele Bit braucht man für die Zahlen 0 bis 15?',
      erklaerung: '4 Bit ergeben 2⁴ = 16 Möglichkeiten – genau die Ziffern 0 bis F.',
    },
    {
      frage: 'Wie schreibt man 1111 1111 hexadezimal?',
      eingabe: 'text',
      loesung: 'FF',
      auch: ['0xFF'],
      platzhalter: 'zwei Ziffern',
      tipp: 'Je 4 Bit eine Ziffer. 1111 = 15 = ?',
      erklaerung: '1111 = 15 = F, zweimal: FF (= 255).',
    },
    {
      frage: 'Welche Dezimalzahl ist hexadezimal 1A?',
      eingabe: 'zahl',
      loesung: '26',
      tipp: 'Die erste Ziffer zählt 16-fach: 1 · 16 + A.',
      erklaerung: '1 · 16 + 10 = 26.',
    },
  ],
  mac: [
    {
      frage: 'Wie lang ist eine MAC-Adresse?',
      optionen: ['32 Bit', '48 Bit', '64 Bit', '128 Bit'],
      richtig: '48 Bit',
      tipp: 'Sechs Bytes zu je 8 Bit.',
      erklaerung: '6 × 8 Bit = 48 Bit, geschrieben als 12 Hexadezimalziffern.',
    },
    {
      frage: 'Was gibt die vordere Hälfte einer MAC-Adresse an?',
      optionen: ['das Netz', 'den Hersteller', 'das Baujahr', 'den Standort'],
      richtig: 'den Hersteller',
      tipp: 'Wer vergibt MAC-Adressen?',
      erklaerung: 'Die ersten drei Bytes sind die Herstellerkennung; die hinteren drei vergibt der Hersteller selbst.',
    },
    {
      frage: 'Welche ist eine gültige MAC-Adresse?',
      optionen: ['00:1A:2B:3C:4D', '00-1A-2B-3C-4D-5E', '192.168.1.10', '00:1G:2B:3C:4D:5E'],
      richtig: '00-1A-2B-3C-4D-5E',
      tipp: 'Sechs Bytes, nur Hexadezimalziffern 0–9 und A–F.',
      erklaerung: 'Die erste hat nur fünf Bytes, G gibt es im Hexadezimalsystem nicht, und 192.168.1.10 ist eine IP-Adresse.',
    },
  ],
  arp: [
    {
      frage: 'Welche Aufgabe hat ARP?',
      optionen: [
        'zu einer IP-Adresse im lokalen Netz die MAC-Adresse ermitteln',
        'IP-Adressen automatisch verteilen',
        'Namen in IP-Adressen übersetzen',
        'Pakete zwischen Netzen weiterleiten',
      ],
      richtig: 'zu einer IP-Adresse im lokalen Netz die MAC-Adresse ermitteln',
      tipp: 'Address Resolution – welche Adresse wird „aufgelöst“?',
      erklaerung: 'ARP: IP-Adresse bekannt, MAC-Adresse gesucht. Das andere machen DHCP, DNS und der Router.',
    },
    {
      frage: '`arp -a` zeigt die Zeile „192.168.0.1   00-1a-2b-3c-4d-5e   dynamisch“. Was bedeutet sie?',
      optionen: [
        'Das Gerät 192.168.0.1 hat die MAC-Adresse 00-1a-2b-3c-4d-5e; der Eintrag wurde per ARP gelernt',
        'Der eigene PC hat die IP-Adresse 192.168.0.1',
        'Die Adresse 192.168.0.1 wurde per DHCP vergeben',
        'Das Gerät ist nicht erreichbar',
      ],
      richtig: 'Das Gerät 192.168.0.1 hat die MAC-Adresse 00-1a-2b-3c-4d-5e; der Eintrag wurde per ARP gelernt',
      tipp: 'Die Spalten heißen Internetadresse, Physische Adresse, Typ.',
      erklaerung: 'Internetadresse = IP, physische Adresse = MAC, „dynamisch“ = automatisch per ARP gelernt.',
    },
    {
      frage: 'Ein PC will Daten an einen Webserver im Internet schicken. Nach wessen MAC-Adresse fragt er per ARP?',
      optionen: ['nach der des Webservers', 'nach der seines Standardgateways', 'nach der des DNS-Servers', 'nach gar keiner'],
      richtig: 'nach der seines Standardgateways',
      tipp: 'ARP funktioniert nur im lokalen Netz. Wohin gehen Pakete für fremde Netze?',
      erklaerung: 'Pakete für fremde Netze gehen ans Standardgateway – also braucht der PC dessen MAC-Adresse.',
    },
  ],

  // ---------- Block 5 ----------
  ipv6: [
    {
      frage: 'Wie viele Bit hat eine IPv6-Adresse?',
      eingabe: 'zahl',
      loesung: '128',
      tipp: '8 Blöcke × 16 Bit.',
      erklaerung: '8 Blöcke × 4 Hexadezimalziffern × 4 Bit = 128 Bit.',
    },
    {
      frage: 'Wie wird eine IPv6-Adresse geschrieben?',
      optionen: ['4 Blöcke zu je 8 Hexadezimalziffern', '8 Blöcke zu je 4 Hexadezimalziffern', '6 Blöcke zu je 2 Hexadezimalziffern', '4 Dezimalzahlen mit Punkten'],
      richtig: '8 Blöcke zu je 4 Hexadezimalziffern',
      tipp: 'Getrennt durch Doppelpunkte, z. B. 2001:0db8:0000:…',
      erklaerung: '8 Blöcke, je 4 Hexadezimalziffern, getrennt durch Doppelpunkte. (6 Blöcke zu 2 Ziffern ist eine MAC-Adresse.)',
    },
    {
      frage: 'Warum wurde IPv6 eingeführt?',
      optionen: ['Der IPv4-Adressraum ist erschöpft', 'IPv4 ist zu langsam', 'IPv4 kann keine privaten Netze', 'IPv6 braucht keine Router'],
      richtig: 'Der IPv4-Adressraum ist erschöpft',
      tipp: 'Wie viele Adressen hat IPv4 – und wie viele Geräte gibt es?',
      erklaerung: 'Rund 4,3 Milliarden IPv4-Adressen reichen nicht für alle Geräte der Welt.',
    },
  ],
  'ipv6-kurz': [
    {
      frage: 'Kürze 2001:0db8:0000:0000:0000:0000:0000:0001 so weit wie möglich.',
      eingabe: 'ipv6kurz',
      loesung: '2001:db8::1',
      platzhalter: 'z. B. fe80::1',
      tipp: 'Erst die führenden Nullen in jedem Block weg, dann die Nullblöcke durch :: ersetzen.',
      erklaerung: '2001:db8:0:0:0:0:0:1 → die sechs Nullblöcke werden zu :: → 2001:db8::1.',
    },
    {
      frage: 'Schreibe fe80::1 vollständig aus.',
      eingabe: 'ipv6voll',
      loesung: 'fe80:0000:0000:0000:0000:0000:0000:0001',
      platzhalter: 'xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx',
      tipp: 'Zwei Blöcke stehen da (fe80 und 1). Wie viele Nullblöcke ersetzt ::? Jeden Block auf vier Ziffern auffüllen.',
      erklaerung: ':: ersetzt 6 Nullblöcke; 1 wird zu 0001: fe80:0000:0000:0000:0000:0000:0000:0001.',
    },
    {
      frage: 'Welche Schreibweise ist ungültig?',
      optionen: ['2001:db8::1', '2001:db8:0:0:1::1', '2001:db8::1::1', 'fe80::1'],
      richtig: '2001:db8::1::1',
      tipp: 'Wie oft darf :: vorkommen?',
      erklaerung: 'Zweimal :: – niemand weiß, wie viele Nullblöcke jede Lücke ersetzt. (2001:db8:0:0:1::1 ist gültig, nur nicht so kurz wie möglich.)',
    },
  ],
  'ipv6-praefix': [
    {
      frage: 'Bei /64: Wie viele Blöcke gehören zum Präfix?',
      optionen: ['2', '4', '6', '8'],
      richtig: '4',
      tipp: 'Ein Block hat 16 Bit.',
      erklaerung: '64 : 16 = 4 Blöcke Präfix, die anderen 4 Blöcke sind der Interface-Identifier.',
    },
    {
      frage: 'Wie lautet der Interface-Identifier von 2001:db8:abcd:12::5/64?',
      eingabe: 'iid',
      loesung: '0:0:0:5',
      platzhalter: 'vier Blöcke, z. B. 0:0:0:1',
      tipp: 'Erst ausschreiben: Wie viele Nullblöcke stehen für ::? Dann die letzten vier Blöcke nehmen.',
      erklaerung: 'Ausgeschrieben 2001:0db8:abcd:0012:0000:0000:0000:0005 → letzte vier Blöcke 0000:0000:0000:0005 (gekürzt ::5).',
    },
    {
      frage: 'Was bezeichnet der Interface-Identifier?',
      optionen: ['die Netzwerkschnittstelle des Geräts im Netz', 'das Netz', 'den Hersteller', 'den Router'],
      richtig: 'die Netzwerkschnittstelle des Geräts im Netz',
      tipp: 'Präfix = Netz. Und der Rest?',
      erklaerung: 'Wie der Hostanteil bei IPv4: Er unterscheidet die Geräte (genauer: ihre Schnittstellen) in einem Netz.',
    },
  ],
  'link-local': [
    {
      frage: 'Woran erkennt man eine verbindungslokale IPv6-Adresse?',
      optionen: ['sie beginnt mit fe80', 'sie endet mit ::1', 'sie beginnt mit 2001', 'sie beginnt mit 169.254'],
      richtig: 'sie beginnt mit fe80',
      tipp: 'Link-Local …',
      erklaerung: 'Verbindungslokale Adressen liegen in fe80::/10 – in der Praxis beginnen sie mit fe80.',
    },
    {
      frage: 'Wo gilt eine verbindungslokale Adresse?',
      optionen: ['weltweit', 'nur im lokalen Netzabschnitt; Router leiten sie nicht weiter', 'nur auf dem eigenen Gerät', 'im ganzen Firmennetz über alle Router hinweg'],
      richtig: 'nur im lokalen Netzabschnitt; Router leiten sie nicht weiter',
      tipp: '„verbindungslokal“ – lokal auf der Verbindung.',
      erklaerung: 'Sie reicht genau bis zum nächsten Router – für Gespräche im eigenen Netzabschnitt.',
    },
    {
      frage: 'Was unterscheidet fe80-Adressen von 169.254-Adressen bei IPv4?',
      optionen: [
        'fe80-Adressen hat jedes IPv6-Gerät immer; 169.254 ist eine Notlösung, wenn DHCP fehlt',
        'beide zeigen einen Fehler an',
        'fe80-Adressen vergibt der DHCP-Server',
        'es gibt keinen Unterschied',
      ],
      richtig: 'fe80-Adressen hat jedes IPv6-Gerät immer; 169.254 ist eine Notlösung, wenn DHCP fehlt',
      tipp: 'Wann bekommt ein IPv4-Gerät 169.254 – und wann ein IPv6-Gerät fe80?',
      erklaerung: 'Bei IPv6 ist die fe80-Adresse der Normalfall, zusätzlich zur globalen Adresse. 169.254 deutet auf ein Problem hin.',
    },
  ],
};

// Prüft eine Antwort. Auswahl: Text der Option. Eingabe: je nach Art.
// → { ok, leer?, grund? }
export function pruefeAntwort(frage, eingabe) {
  const s = String(eingabe ?? '').trim();
  if (!s) return { ok: false, leer: true };
  if (frage.optionen) return { ok: s === frage.richtig };
  switch (frage.eingabe) {
    case 'zahl': {
      const z = leseZahl(s);
      return z === null ? { ok: false, grund: 'Bitte eine ganze Zahl eingeben.' } : { ok: z === Number(frage.loesung) };
    }
    case 'ipv4': {
      const ip = leseIp(s);
      return ip === null ? { ok: false, grund: 'Keine gültige IPv4-Adresse (vier Zahlen von 0 bis 255 mit Punkten).' } : { ok: ip === frage.loesung };
    }
    case 'text': {
      const norm = (x) => x.replace(/\s+/g, '').toLowerCase();
      return { ok: [frage.loesung, ...(frage.auch ?? [])].some((l) => norm(l) === norm(s)) };
    }
    case 'ipv6kurz': {
      const r = istRichtigGekuerzt(s, frage.loesung);
      return r.ok ? r : { ok: false, grund: r.grund };
    }
    case 'ipv6voll': {
      const gruppen = s.toLowerCase().split(':');
      if (gruppen.length !== 8 || gruppen.some((g) => g.length !== 4)) return { ok: false, grund: 'Ausgeschrieben heißt: acht Blöcke mit je vier Ziffern, ohne ::.' };
      return { ok: ipv6Voll(s) === ipv6Voll(frage.loesung) };
    }
    case 'iid': {
      const v = gruppenVoll(s, 4);
      return v === null ? { ok: false, grund: 'Vier Blöcke angeben (gekürzt oder ausgeschrieben).' } : { ok: v === gruppenVoll(frage.loesung, 4) };
    }
    default:
      return { ok: false };
  }
}
