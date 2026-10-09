// Der Lernweg im Raum „Verstehen“: Themen-Blöcke und Lektionen in fester Reihenfolge.
// Rein und ohne Browser-Abhängigkeit, getestet in tests/subnetz.test.mjs.
//
// Eine Lektion = ein Begriff oder eine Idee. Felder:
//   id, block, begriff, leitfrage (kurz, für die Kachel)
//   braucht: frühere Lektionen, deren Begriffe hier benutzt werden (ein Test prüft: nur rückwärts)
//   kompetenzen: Können-IDs aus der Inhaltsdatei (AP1-6-2-1 … AP1-6-2-4), die diese Lektion abdeckt
//   definition: so, wie man es in der Prüfung sagt (Rich-Text: **fett**, `code`)
//   merksatz, fehler: [{ falsch, richtig }] – wo sie helfen
//   check: 2–3 Fragen (siehe CHECKS unten)
//   uebung: passende Übung im Raum „Üben“ (modus-ID)
// Erklärung und Ausprobieren (JSX) stehen je Block in inhalt/.

export const BLOECKE = [
  { id: 'adresse', titel: 'Die IPv4-Adresse', text: 'Vier Zahlen, zwei Teile, eine Grenze – und wie man sie in Bits sieht.' },
  { id: 'subnetting', titel: 'Subnetting', text: 'Wie groß ist ein Netz, wo beginnt und endet es, welche Adressen bekommen Geräte?' },
  { id: 'konfiguration', titel: 'Einen PC ins Netz bringen', text: 'Standardgateway, private Adressen, Konfiguration, DHCP und feste Adressen.' },
  { id: 'lokal', titel: 'Im lokalen Netz: MAC und ARP', text: 'Hexadezimalzahlen, die Hardware-Adresse und wie ein PC sie findet.' },
  { id: 'ipv6', titel: 'IPv6', text: 'Der Nachfolger: 128 Bit, Kurzschreibweise, Präfix und verbindungslokale Adresse.' },
];

const L = [
  // ---------- Block 1: Die IPv4-Adresse ----------
  {
    id: 'ip-adresse',
    block: 'adresse',
    begriff: 'IP-Adresse',
    leitfrage: 'Woran erkennt das Netz ein Gerät?',
    braucht: [],
    kompetenzen: [],
    definition:
      'Eine **IPv4-Adresse** ist eine 32 Bit lange logische Adresse, die ein Gerät in einem IP-Netz eindeutig bezeichnet. Man schreibt sie als vier Dezimalzahlen von 0 bis 255 (**Oktette**), getrennt durch Punkte, z. B. `192.168.1.10`.',
    merksatz: 'IPv4 = 4 Oktette × 8 Bit = 32 Bit. Jedes Oktett ist eine Zahl von 0 bis 255.',
    fehler: [{ falsch: '192.168.1.256 ist eine gültige Adresse.', richtig: 'Ein Oktett geht nur bis 255 – mehr passt nicht in 8 Bit.' }],
    uebung: 'maske',
  },
  {
    id: 'netz-host',
    block: 'adresse',
    begriff: 'Netzanteil und Hostanteil',
    leitfrage: 'Welcher Teil nennt das Netz, welcher das Gerät?',
    braucht: ['ip-adresse'],
    kompetenzen: [],
    definition:
      'Eine IP-Adresse besteht aus **Netzanteil** und **Hostanteil**. Der Netzanteil bezeichnet das Netz und ist bei allen Geräten im selben Netz gleich. Der Hostanteil bezeichnet das einzelne Gerät (den **Host**) in diesem Netz.',
    merksatz: 'Netzanteil = Straße, Hostanteil = Hausnummer. Gleiche Straße = gleiches Netz.',
    fehler: [{ falsch: 'Das Netz sind immer die ersten drei Zahlen.', richtig: 'Wo die Grenze liegt, steht in der Konfiguration des Geräts – sie kann an vielen Stellen liegen.' }],
  },
  {
    id: 'binaer',
    block: 'adresse',
    begriff: 'Binärzahl',
    leitfrage: 'Warum geht jedes Oktett nur bis 255?',
    braucht: ['ip-adresse'],
    kompetenzen: [],
    definition:
      'Eine **Binärzahl** besteht nur aus den Ziffern 0 und 1 (Bits). Jede Stelle hat einen festen **Stellenwert**, bei 8 Bit von links `128 64 32 16 8 4 2 1`. Der Wert ist die Summe der Stellenwerte, unter denen eine 1 steht. Mit 8 Bit lassen sich die Zahlen 0 bis 255 darstellen.',
    merksatz: 'Von links nach rechts: Passt der Stellenwert in den Rest? Ja → 1 und abziehen. Nein → 0.',
    fehler: [{ falsch: '11000000 = 1 + 1 = 2', richtig: 'Die Einsen zählen mit ihrem Stellenwert: 128 + 64 = 192.' }],
    uebung: 'binaer',
  },
  {
    id: 'praefix',
    block: 'adresse',
    begriff: 'Präfix',
    leitfrage: 'Wo liegt die Grenze zwischen Netz und Host?',
    braucht: ['netz-host', 'binaer'],
    kompetenzen: ['AP1-6-2-1-K3'],
    definition:
      'Die **Präfixlänge** (kurz Präfix) gibt an, wie viele Bits von links zum Netzanteil gehören. Man schreibt sie mit Schrägstrich hinter die Adresse, z. B. `192.168.1.10/24`. Die übrigen 32 − Präfix Bits sind **Hostbits**.',
    merksatz: 'Präfix = Anzahl der Netzbits. Hostbits = 32 − Präfix.',
    fehler: [{ falsch: 'Die Grenze liegt immer zwischen zwei Oktetten.', richtig: 'Bei /26 liegt sie mitten im 4. Oktett: 2 Bits Netz, 6 Bits Host.' }],
    uebung: 'maske',
  },
  {
    id: 'subnetzmaske',
    block: 'adresse',
    begriff: 'Subnetzmaske',
    leitfrage: 'Wie schreibt man die Grenze als Adresse?',
    braucht: ['praefix'],
    kompetenzen: ['AP1-6-2-1-K3', 'AP1-6-2-2-K5'],
    definition:
      'Die **Subnetzmaske** gibt an, welcher Teil der IP-Adresse das Netz und welcher den Host bezeichnet: Jedes Netzbit ist 1, jedes Hostbit 0, geschrieben wie eine IP-Adresse. Präfix `/24` entspricht `255.255.255.0`, `/26` entspricht `255.255.255.192`.',
    merksatz: 'Ein Oktett der Subnetzmaske kann nur 0, 128, 192, 224, 240, 248, 252, 254 oder 255 sein.',
    fehler: [{ falsch: '/27 → 255.255.255.27', richtig: '27 Einsen: 8 + 8 + 8 + 3. Drei Einsen im 4. Oktett = 128 + 64 + 32 = 224.' }],
    uebung: 'maske',
  },

  // ---------- Block 2: Subnetting ----------
  {
    id: 'netzgroesse',
    block: 'subnetting',
    begriff: 'Netzgröße',
    leitfrage: 'Wie viele Adressen hat ein Netz?',
    braucht: ['praefix'],
    kompetenzen: ['AP1-6-2-2-K1'],
    definition: 'Ein Netz mit Präfix /n hat 32 − n Hostbits und damit **2^(32 − n) Adressen**, z. B. `/26`: 2⁶ = 64 Adressen.',
    merksatz: 'Jedes Hostbit mehr verdoppelt das Netz. Ein Bit weniger halbiert es.',
    fehler: [{ falsch: '6 Hostbits → 6 × 2 = 12 Adressen', richtig: '2 hoch 6: 2 · 2 · 2 · 2 · 2 · 2 = 64 Adressen.' }],
    uebung: 'hosts',
  },
  {
    id: 'blockgroesse',
    block: 'subnetting',
    begriff: 'Blockgröße',
    leitfrage: 'In welchen Schritten liegen die Netze?',
    braucht: ['subnetzmaske', 'netzgroesse'],
    kompetenzen: ['AP1-6-2-2-K2'],
    definition:
      'Netze gleicher Größe liegen lückenlos hintereinander. Die **Blockgröße** ist der Abstand, in dem sie aufeinander folgen: **256 − Wert der Subnetzmaske** im Oktett, in dem die Grenze liegt. Netze beginnen bei 0 und bei jedem Vielfachen der Blockgröße.',
    merksatz: '/26 → 256 − 192 = 64 → Netze beginnen bei 0, 64, 128, 192.',
    fehler: [{ falsch: 'Ein /26-Netz kann bei 100 beginnen.', richtig: 'Nur bei Vielfachen von 64: 0, 64, 128, 192.' }],
    uebung: 'analyse',
  },
  {
    id: 'netzadresse',
    block: 'subnetting',
    begriff: 'Netzadresse',
    leitfrage: 'Mit welcher Adresse beginnt mein Netz?',
    braucht: ['blockgroesse'],
    kompetenzen: ['AP1-6-2-2-K2'],
    definition: 'Die **Netzadresse** ist die erste Adresse eines Netzes: Alle Hostbits sind 0. Sie bezeichnet das Netz selbst und wird keinem Gerät zugewiesen.',
    merksatz: 'Netzadresse = größtes Vielfaches der Blockgröße, das nicht größer als die Zahl ist.',
    fehler: [{ falsch: '192.168.1.100/26 → Netzadresse 192.168.1.100', richtig: '100 liegt im Block 64–127. Netzadresse 192.168.1.64.' }],
    uebung: 'analyse',
  },
  {
    id: 'broadcast',
    block: 'subnetting',
    begriff: 'Broadcastadresse',
    leitfrage: 'Wo endet mein Netz?',
    braucht: ['netzadresse'],
    kompetenzen: ['AP1-6-2-2-K2'],
    definition:
      'Die **Broadcastadresse** ist die letzte Adresse eines Netzes: Alle Hostbits sind 1. Was an sie geschickt wird, erreicht alle Geräte im Netz; einem einzelnen Gerät wird sie nicht zugewiesen.',
    merksatz: 'Broadcast = nächste Netzadresse − 1.',
    fehler: [{ falsch: 'Netz bei 64, Blockgröße 64 → Broadcast 128', richtig: '64 + 64 = 128 ist schon der Anfang des nächsten Netzes. Broadcast 127.' }],
    uebung: 'analyse',
  },
  {
    id: 'hostbereich',
    block: 'subnetting',
    begriff: 'Hostbereich',
    leitfrage: 'Welche Adressen bekommen Geräte?',
    braucht: ['netzgroesse', 'broadcast'],
    kompetenzen: ['AP1-6-2-2-K1', 'AP1-6-2-2-K3'],
    definition:
      'Der **Hostbereich** umfasst alle Adressen zwischen Netzadresse und Broadcastadresse; nur sie können Geräte bekommen. Erste nutzbare Adresse = Netzadresse + 1, letzte = Broadcastadresse − 1. Anzahl nutzbarer Hosts = **2^(32 − n) − 2**.',
    merksatz: 'Hosts = Adressen − 2 (Netzadresse und Broadcast). Vorletzte = Broadcast − 2.',
    fehler: [{ falsch: '/26 hat 64 nutzbare Hosts.', richtig: '64 Adressen, aber nur 62 Hosts – Netzadresse und Broadcast fallen weg.' }],
    uebung: 'analyse',
  },
  {
    id: 'gleiches-netz',
    block: 'subnetting',
    begriff: 'Gleiches Netz?',
    leitfrage: 'Können zwei Geräte direkt miteinander reden?',
    braucht: ['netzadresse'],
    kompetenzen: ['AP1-6-2-2-K6'],
    definition:
      'Zwei IPv4-Adressen liegen **im selben Subnetz**, wenn sie mit derselben Subnetzmaske dieselbe Netzadresse ergeben. Nur dann erreichen sich die Geräte direkt.',
    merksatz: 'Nicht auf die Zahlen schauen – die Netzadressen vergleichen.',
    fehler: [{ falsch: '192.168.1.60/26 und 192.168.1.70/26 – beide 192.168.1.x, also gleiches Netz.', richtig: '60 liegt im Block 0–63, 70 im Block 64–127: verschiedene Netze.' }],
    uebung: 'gleich',
  },
  {
    id: 'oktett3',
    block: 'subnetting',
    begriff: 'Entscheidendes Oktett',
    leitfrage: 'Was, wenn die Grenze im dritten Oktett liegt?',
    braucht: ['hostbereich', 'gleiches-netz'],
    kompetenzen: ['AP1-6-2-2-K2'],
    definition:
      'Das **entscheidende Oktett** ist das Oktett, in dem die Grenze zwischen Netz und Host liegt – das erste Oktett der Subnetzmaske, das nicht 255 ist. Nur dort wird mit der Blockgröße gerechnet. Oktette davor werden abgeschrieben, Oktette danach sind in der Netzadresse 0 und in der Broadcastadresse 255.',
    merksatz: 'Davor abschreiben · im entscheidenden Oktett rechnen · dahinter 0 bzw. 255.',
    fehler: [{ falsch: '10.4.6.255/23 ist eine Broadcastadresse.', richtig: 'Das Netz geht von 10.4.6.0 bis 10.4.7.255 – 10.4.6.255 liegt mittendrin und ist ein normaler Host.' }],
    uebung: 'analyse',
  },
  {
    id: 'rechenweg',
    block: 'subnetting',
    begriff: 'Rechenweg',
    leitfrage: 'In welcher Reihenfolge rechne ich?',
    braucht: ['oktett3'],
    kompetenzen: ['AP1-6-2-2-K1', 'AP1-6-2-2-K2', 'AP1-6-2-2-K3'],
    definition:
      'Eine Subnetz-Aufgabe löst man immer in derselben Reihenfolge: **1.** Subnetzmaske · **2.** entscheidendes Oktett und Blockgröße · **3.** Netzadresse · **4.** Broadcastadresse · **5.** erste und letzte Hostadresse · **6.** Anzahl der Hosts.',
    merksatz: 'Erst die Blockgröße, dann ist alles andere Abschreiben, Abrunden und ±1.',
    uebung: 'analyse',
  },

  // ---------- Block 3: Einen PC ins Netz bringen ----------
  {
    id: 'standardgateway',
    block: 'konfiguration',
    begriff: 'Standardgateway',
    leitfrage: 'Wohin schickt ein PC Pakete für fremde Netze?',
    braucht: ['hostbereich', 'gleiches-netz'],
    kompetenzen: ['AP1-6-2-1-K1'],
    definition:
      'Ein **Router** verbindet verschiedene Netze. Das **Standardgateway** ist die Adresse des Routers im eigenen Netz: An sie schickt ein Gerät alle Pakete für Ziele außerhalb des eigenen Netzes. Es muss im selben Netz liegen wie das Gerät.',
    merksatz: 'Ziel im eigenen Netz → direkt. Ziel woanders → ans Standardgateway.',
    fehler: [{ falsch: 'PC 192.168.1.20/24 mit Gateway 192.168.2.1', richtig: 'Das Gateway liegt in einem anderen Netz – der PC kann es gar nicht direkt erreichen.' }],
    uebung: 'konfig',
  },
  {
    id: 'privat',
    block: 'konfiguration',
    begriff: 'Private Adressen',
    leitfrage: 'Welche Adressen darf jeder intern nutzen?',
    braucht: ['oktett3', 'standardgateway'],
    kompetenzen: ['AP1-6-2-1-K5'],
    definition:
      '**Private IPv4-Adressen** sind für lokale Netze reserviert und dürfen dort frei verwendet werden; im Internet werden sie nicht weitergeleitet. Bereiche: `10.0.0.0/8`, `172.16.0.0/12` (172.16.0.0 bis 172.31.255.255) und `192.168.0.0/16`.',
    merksatz: '10 · 172.16 bis 172.31 · 192.168',
    fehler: [{ falsch: '172.32.0.1 ist privat.', richtig: '/12 hat im 2. Oktett die Blockgröße 16: 172.16 bis 172.31. Die 32 gehört nicht mehr dazu.' }],
    uebung: 'privat',
  },
  {
    id: 'konfiguration',
    block: 'konfiguration',
    begriff: 'IPv4-Konfiguration',
    leitfrage: 'Was trägt man an einem PC ein?',
    braucht: ['standardgateway'],
    kompetenzen: ['AP1-6-2-1-K1', 'AP1-6-2-1-K6'],
    definition:
      'Zur **IPv4-Konfiguration** eines Geräts gehören **IP-Adresse, Subnetzmaske, Standardgateway und DNS-Server**. Der **DNS-Server** übersetzt Namen wie www.beispiel.de in IP-Adressen. Dokumentiert werden zusätzlich die Art der Vergabe und der Anschluss (z. B. Netzwerkdose oder Switch-Port).',
    merksatz: 'Adresse, Maske, Gateway, DNS – vier Einträge, alle im passenden Netz.',
    fehler: [{ falsch: 'Ohne DNS-Server funktioniert gar nichts.', richtig: 'Adressen wie 8.8.8.8 gehen weiter; nur Namen wie www.beispiel.de lassen sich nicht mehr auflösen.' }],
    uebung: 'konfig',
  },
  {
    id: 'dhcp',
    block: 'konfiguration',
    begriff: 'DHCP',
    leitfrage: 'Wer verteilt die Einstellungen automatisch?',
    braucht: ['broadcast', 'konfiguration'],
    kompetenzen: ['AP1-6-2-1-K4', 'AP1-6-2-4-K4', 'AP1-6-2-4-K5'],
    definition:
      '**DHCP** (Dynamic Host Configuration Protocol) verteilt Netzwerkeinstellungen automatisch: Ein DHCP-Server teilt einem Client **IP-Adresse, Subnetzmaske, Standardgateway und DNS-Server** aus einem festgelegten Adressbereich zu. Erreicht der Client keinen DHCP-Server, gibt er sich selbst eine Adresse aus **169.254.x.x**.',
    merksatz: '169.254.x.x heißt: Kein DHCP-Server geantwortet – Kabel, WLAN und Server prüfen.',
    fehler: [{ falsch: '169.254.12.34 ist eine normale Adresse vom Router.', richtig: 'Die hat sich der PC selbst gegeben, weil kein DHCP-Server geantwortet hat. Ins Internet kommt er so nicht.' }],
    uebung: 'mac',
  },
  {
    id: 'statisch',
    block: 'konfiguration',
    begriff: 'Statische Adresse',
    leitfrage: 'Welche feste Adresse ist frei und erlaubt?',
    braucht: ['hostbereich', 'dhcp'],
    kompetenzen: ['AP1-6-2-1-K2', 'AP1-6-2-1-K4', 'AP1-6-2-2-K4'],
    definition:
      'Eine **statische Adresse** wird von Hand fest eingetragen. Sinnvoll ist sie für Geräte, die immer unter derselben Adresse erreichbar sein müssen (Server, Drucker, Router). Sie muss **im richtigen Netz** liegen, **frei** sein, darf **weder Netz- noch Broadcastadresse** sein und muss **außerhalb des DHCP-Bereichs** liegen.',
    merksatz: 'Richtiges Netz · nicht Netz/Broadcast · nicht vergeben · nicht im DHCP-Bereich.',
    fehler: [{ falsch: 'DHCP vergibt .100 bis .200, der Drucker bekommt fest .150.', richtig: 'Der DHCP-Server kann .150 auch einem anderen Gerät geben – Adresskonflikt. Eine Adresse außerhalb nehmen.' }],
    uebung: 'konfig',
  },

  // ---------- Block 4: Im lokalen Netz – MAC und ARP ----------
  {
    id: 'hex',
    block: 'lokal',
    begriff: 'Hexadezimalzahl',
    leitfrage: 'Wie schreibt man 4 Bit mit einem Zeichen?',
    braucht: ['binaer'],
    kompetenzen: [],
    definition:
      'Das **Hexadezimalsystem** hat die Basis 16 mit den Ziffern 0–9 und A–F (A = 10 … F = 15). Eine Hexadezimalziffer steht für genau **4 Bit**, zwei Ziffern für ein **Byte** (8 Bit, 00 bis FF = 0 bis 255).',
    merksatz: '1 Hex-Ziffer = 4 Bit · 2 Hex-Ziffern = 1 Byte.',
    fehler: [{ falsch: 'Hex 10 = zehn', richtig: 'Hex 10 = 1 · 16 + 0 = 16. Zehn ist A.' }],
    uebung: 'mac',
  },
  {
    id: 'mac',
    block: 'lokal',
    begriff: 'MAC-Adresse',
    leitfrage: 'Welche Adresse hat die Netzwerkkarte ab Werk?',
    braucht: ['netz-host', 'hex'],
    kompetenzen: ['AP1-6-2-4-K1'],
    definition:
      'Die **MAC-Adresse** ist die vom Hersteller vergebene Hardware-Adresse einer Netzwerkschnittstelle: **48 Bit**, geschrieben als **sechs Bytes in Hexadezimalschreibweise**, z. B. `00:1A:2B:3C:4D:5E`. Die vordere Hälfte ist die **Herstellerkennung**.',
    merksatz: 'IP-Adresse = logisch, vom Netz vergeben. MAC-Adresse = physisch, ab Werk.',
    fehler: [{ falsch: 'Eine MAC-Adresse hat 6 Zeichen.', richtig: 'Sechs Bytes zu je zwei Hex-Ziffern = 12 Ziffern = 48 Bit.' }],
    uebung: 'mac',
  },
  {
    id: 'arp',
    block: 'lokal',
    begriff: 'ARP',
    leitfrage: 'Wie findet ein PC zur IP-Adresse die MAC-Adresse?',
    braucht: ['broadcast', 'standardgateway', 'mac'],
    kompetenzen: ['AP1-6-2-4-K2', 'AP1-6-2-4-K3'],
    definition:
      '**ARP** (Address Resolution Protocol) ermittelt zu einer IP-Adresse im lokalen Netz die zugehörige MAC-Adresse: Der PC fragt per Broadcast alle „Wer hat diese IP-Adresse?“, das Gerät mit dieser Adresse antwortet mit seiner MAC-Adresse. Die Zuordnung landet im **ARP-Cache**; `arp -a` zeigt ihn an.',
    merksatz: 'ARP: IP-Adresse bekannt → MAC-Adresse gesucht. Für fremde Netze fragt der PC nach der MAC-Adresse des Gateways.',
    fehler: [{ falsch: 'Für einen Server im Internet fragt der PC per ARP nach dessen MAC-Adresse.', richtig: 'ARP gilt nur im lokalen Netz. Der PC fragt nach der MAC-Adresse seines Standardgateways.' }],
    uebung: 'mac',
  },

  // ---------- Block 5: IPv6 ----------
  {
    id: 'ipv6',
    block: 'ipv6',
    begriff: 'IPv6-Adresse',
    leitfrage: 'Warum IPv6, und wie sieht die Adresse aus?',
    braucht: ['ip-adresse', 'hex'],
    kompetenzen: ['AP1-6-2-3-K1', 'AP1-6-2-3-K5'],
    definition:
      '**IPv6** ist der Nachfolger von IPv4. Eine IPv6-Adresse ist **128 Bit** lang und wird in **acht Blöcken zu je vier Hexadezimalziffern** geschrieben, getrennt durch Doppelpunkte. Grund: Der IPv4-Adressraum (32 Bit, rund 4,3 Milliarden Adressen) ist erschöpft.',
    merksatz: '8 Blöcke × 4 Hex-Ziffern × 4 Bit = 128 Bit.',
    fehler: [{ falsch: 'IPv6 hat 4-mal so viele Adressen wie IPv4.', richtig: '4-mal so viele **Bits**. Adressen: 2¹²⁸ statt 2³² – unvorstellbar viel mehr.' }],
    uebung: 'ipv6',
  },
  {
    id: 'ipv6-kurz',
    block: 'ipv6',
    begriff: 'Kurzschreibweise',
    leitfrage: 'Wie kürzt man eine IPv6-Adresse – und zurück?',
    braucht: ['ipv6'],
    kompetenzen: ['AP1-6-2-3-K2'],
    definition:
      'Eine IPv6-Adresse kürzt man mit zwei Regeln: **1.** Führende Nullen in jedem Block weglassen (`0db8` → `db8`, `0000` → `0`). **2.** Eine zusammenhängende Folge von Nullblöcken **einmal** durch `::` ersetzen. Zum Ausschreiben füllt man `::` wieder mit Nullblöcken auf, bis es acht Blöcke sind.',
    merksatz: 'Nur vorne Nullen weg · :: nur einmal.',
    fehler: [
      { falsch: '0db0 → db', richtig: 'Nur führende Nullen fallen weg: 0db0 → db0.' },
      { falsch: '2001:db8::1::2', richtig: 'Zweimal :: ist verboten – niemand wüsste, wie viele Nullblöcke jede Lücke ersetzt.' },
    ],
    uebung: 'ipv6',
  },
  {
    id: 'ipv6-praefix',
    block: 'ipv6',
    begriff: 'Präfix und Interface-Identifier',
    leitfrage: 'Welcher Teil ist Netz, welcher Gerät?',
    braucht: ['praefix', 'ipv6-kurz'],
    kompetenzen: ['AP1-6-2-3-K3'],
    definition:
      'Auch bei IPv6 gibt die **Präfixlänge** an, wie viele Bits von links das Netz bezeichnen, meist `/64`. Die übrigen Bits sind der **Interface-Identifier**: Er bezeichnet die Netzwerkschnittstelle des Geräts in diesem Netz. Bei /64 sind das die ersten vier und die letzten vier Blöcke.',
    merksatz: '/64: vier Blöcke Netz, vier Blöcke Gerät.',
    fehler: [{ falsch: 'Interface-Identifier von fe80::1/64 ist 1.', richtig: 'Ausgeschrieben sind es die letzten 64 Bit: 0000:0000:0000:0001 (gekürzt ::1).' }],
    uebung: 'ipv6',
  },
  {
    id: 'link-local',
    block: 'ipv6',
    begriff: 'Verbindungslokale Adresse',
    leitfrage: 'Welche Adresse hat jedes Gerät von selbst?',
    braucht: ['dhcp', 'ipv6-praefix'],
    kompetenzen: ['AP1-6-2-3-K4'],
    definition:
      'Eine **verbindungslokale Adresse** (Link-Local-Adresse) beginnt mit `fe80` (Bereich `fe80::/10`). Jedes IPv6-Gerät gibt sie sich selbst. Sie gilt nur im lokalen Netzabschnitt und wird von Routern nicht weitergeleitet.',
    merksatz: 'fe80 = nur hier im Netzabschnitt.',
    fehler: [{ falsch: 'fe80-Adresse heißt: Es ist etwas kaputt, wie bei 169.254.', richtig: 'Bei IPv6 hat jedes Gerät immer eine fe80-Adresse – zusätzlich zu einer globalen.' }],
    uebung: 'ipv6',
  },
];

export const LEKTIONEN = L.map((l, i) => ({ ...l, nr: i + 1 }));

const NACH_ID = new Map(LEKTIONEN.map((l) => [l.id, l]));

export function lektion(id) {
  return NACH_ID.get(id) ?? null;
}

export function lektionenIn(blockId) {
  return LEKTIONEN.filter((l) => l.block === blockId);
}

export function blockVon(lektionId) {
  const l = lektion(lektionId);
  return l ? BLOECKE.find((b) => b.id === l.block) : null;
}

// Erste noch nicht verstandene Lektion in der festen Reihenfolge (null, wenn alle verstanden sind)
export function naechsteLektion(verstanden) {
  return LEKTIONEN.find((l) => !verstanden.has(l.id)) ?? null;
}

// 'verstanden' | 'naechste' | 'offen'
export function status(id, verstanden) {
  if (verstanden.has(id)) return 'verstanden';
  return naechsteLektion(verstanden)?.id === id ? 'naechste' : 'offen';
}

// Lektionen, auf die eine Lektion aufbaut und die noch nicht verstanden sind
export function luecken(id, verstanden) {
  return (lektion(id)?.braucht ?? []).filter((b) => !verstanden.has(b)).map(lektion);
}
