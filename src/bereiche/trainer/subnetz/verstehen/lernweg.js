// Der Lernweg im Raum „Verstehen“: Themen-Blöcke und Lektionen in fester Reihenfolge.
// Rein und ohne Browser-Abhängigkeit, getestet in tests/subnetz.test.mjs.

export const BLOECKE = [
  { id: 'adresse', titel: 'Die IPv4-Adresse', text: 'Vier Zahlen, zwei Teile, eine Grenze – und wie man sie in Bits sieht.' },
  { id: 'subnetting', titel: 'Subnetting', text: 'Wie groß ist ein Netz, wo beginnt und endet es, welche Adressen bekommen Geräte?' },
  { id: 'konfiguration', titel: 'Einen PC ins Netz bringen', text: 'Standardgateway, private Adressen, Konfiguration, DHCP und feste Adressen.' },
  { id: 'lokal', titel: 'Im lokalen Netz: MAC und ARP', text: 'Hexadezimalzahlen, die Hardware-Adresse und wie ein PC sie findet.' },
  { id: 'ipv6', titel: 'IPv6', text: 'Der Nachfolger: 128 Bit, Kurzschreibweise, Präfix und verbindungslokale Adresse.' },
];
