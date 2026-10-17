# Prüfbericht PB1-11 – Netzwerk (unabhängige Prüfung)

**Geprüft:** 8 Stichpunkte, 36 Können-Aussagen, 0 Grenzen, 1 Kür. 6 zugeordnete Teilaufgaben samt Lösungshinweis gelesen (2021W-A3-c; 2022W-A1-a; 2024W-A2-a, -ba, -bb, -c). Fünf Stichpunkte haben keine Teilaufgabe (PB1-11-1-2, -2-3, -2-4 ganz; -1-4 und -2-2 größtenteils). Sie wurden gegen Katalog AP2b.01.01–.07 und AP2b.02.06 Wort für Wort geprüft, auch auf Fachrichtungs-Vermerke in Klammern („FI AE“, „FI DV/FI SI“). AP1-Abgleich mit dem ganzen Block AP1-6 (OSI, Protokolle, Komponenten, Leitungen, IPv4/IPv6, Subnetting, MAC/ARP/DHCP, WLAN, VPN, Fehlersuche) sowie AP1-5-2-5 und AP1-7-3-5.

**Kerntest gesamt:** Alle 6 Teilaufgaben sind lösbar. 2021W-A3-c (Ursache von HTTP 404) löst PB1-11-1-3-K4 fachlich besser als die amtliche Lösung, die „Webserver aus“ und „DNS nicht auflösbar“ fälschlich als 404-Ursachen nennt. Kein Prüfungsinhalt fehlt. Der Ordner hat für die Fachrichtung AE nur wenige Belege, ist aber umfangreich (P10 offen) und wiederholt AP1-6 an vielen Stellen.

| Nr | Stelle (ID) | Art | Befund | Vorschlag | Sicherheit |
|---|---|---|---|---|---|
| 1 | PB1-11-2-1-K3 | Grenze / streichen | Netzwerktopologien (Stern, Bus, Ring, Masche) gehen auf den Katalogpunkt „**Netzwerktopologie (FI DV/FI SI)**“ (AP2b.01.03.11) zurück. Der Klammervermerk beschränkt den Punkt auf die Fachrichtungen Daten- und Prozessanalyse und Systemintegration, genau wie „UML-Zustandsdiagramm (FI AE)“ einen Punkt auf AE beschränkt. Für FIAE ist das kein Prüfungsstoff. | Streichen und als Grenze mit Katalogstelle aufnehmen: „Netzwerktopologien gehören nicht dazu – AP2b.01.03.11 ist auf FI DV/FI SI beschränkt (E7)“. Höchstens als Kür. | hoch |
| 2 | PB1-11-1-1-K2 | doppelt AP1 | „IPv4/IPv6, MAC, ARP, Routing, Switching, TCP, UDP der richtigen Schicht zuordnen“ ist großenteils AP1-6-1-1-K2 (MAC/Ethernet → 2, IPv4/IPv6 → 3, TCP/UDP → 4, gleiche Stufe 2). Neu sind ARP, Routing, Switching und die Zuordnung im TCP/IP-Modell. | In K1 aufgehen lassen: „… TCP/IP-Modell benennen, dem OSI-Modell zuordnen und dabei auch ARP, Routing und Switching einordnen“. | hoch |
| 3 | PB1-11-1-1-K4 | doppelt AP1 | „MAC-Adresse: 6 Byte, hexadezimal, erste 3 Byte Hersteller (OUI), letzte 3 Byte Gerät“ = AP1-6-2-4-K1 („48 Bit, sechs Bytes hexadezimal, vom Hersteller vergeben, vordere Hälfte Herstellerkennung“). 2024W-A2-bb (3 P.) löst man mit AP1 allein. | Streichen; baut_auf AP1-6-2-4 ist gesetzt. „OUI“ höchstens als Halbsatz in K3 (Ethernet-Frame). | hoch |
| 4 | PB1-11-1-1-K5 | doppelt AP1 / doppelt PB1 | „Die Host-Adressen eines /24-Netzes von .1 bis .254 in einem Programm durchlaufen, ohne Netz- und Broadcastadresse“: Den Hostbereich bestimmen ist AP1-6-2-2-K1/K2/K3 (Stufe 3), das Skript dazu steht in PB1-3-2-2-K3 (gleicher Beleg 2024W-A2-c). | Streichen. | hoch |
| 5 | PB1-11-1-4-K4 | doppelt AP1 / K2 Herkunft | „Was ausfällt, wenn DNS oder DHCP ausfällt“ ist AP1-6-3-2-K4 (ping auf IP gelingt, Name scheitert → DNS; Stufe 4) und AP1-6-2-4-K5 (169.254.x.x → kein DHCP-Server; Stufe 4). Der angegebene Beleg 2021W-A3-c fragt aber nach HTTP 404, und ein DNS- oder DHCP-Ausfall erzeugt gar keinen 404. | Streichen. Den Beleg nur bei PB1-11-1-3-K4 führen. | hoch |
| 6 | PB1-11-2-2-K5 ↔ PB1-12-1-2-K1 | doppelt PB1 | Dieselbe Teilaufgabe 2022W-A1-a („Schwachstellen der IT-Infrastruktur“) mit fast denselben Beispielen (veraltete Infrastruktur, Abhängigkeit von Rechenzentren, Bandbreitenengpass, uneinheitliche Hardware) steht hier und in PB1-12-1-2-K1. Der Kontext der Aufgabe sind Dienstausfälle, also Betrieb und Verfügbarkeit. | Hier streichen; PB1-12-1-2-K1 bleibt der Wohnort. AP2b.01.03.10 („Sicherheitskonzepte und -risiken“) ist über K3 (Drahtlosrisiken) und PB1-10 abgedeckt. | hoch |
| 7 | PB1-11-1-2-K1 / K2 | doppelt AP1 (teilweise) / zu fein | Switch auf Schicht 2 mit MAC und Router auf Schicht 3 mit IP stehen in AP1-6-1-3-K1/K2. Neu sind MAC- und Routingtabelle sowie die Bridge. K1 (Switching/Routing) und K2 (Switch/Bridge/Router vergleichen) sagen fast dasselbe. | Zu einer Aussage zusammenfassen: „Switch, Bridge und Router vergleichen: Schicht, Adressart, Tabelle (MAC-/Routingtabelle)“. | mittel |
| 8 | PB1-11-1-2-K3 ↔ PB1-10-3-2-K1 | doppelt PB1 | Die Firewall als Paketfilter („Regeln nach Adressen und Ports“) steht hier und in PB1-10-3-2-K1 („erlaubt oder sperrt Verbindungen nach Adressen, Ports und Protokollen“). | Hier belassen (Komponenten, Paketfilter ↔ zustandsorientiert). PB1-10-3-2-K1 auf den Webfilter und das Einrichten von Regeln kürzen. | mittel |
| 9 | PB1-11-1-3-K3 ↔ PB1-10-2-2-K1 | doppelt PB1 | „HTTPS: verschlüsselte, authentifizierte Übertragung über TLS mit Zertifikat“ ist die Aussage zum TLS-Zertifikat in PB1-10-2-2-K1 (Server authentifiziert, Übertragung verschlüsselt, Integrität). Die Standardports stehen über die Porttabelle schon in AP1-6-1-2-K4/K5. | Streichen. | mittel |
| 10 | PB1-11-2-4-K3 | doppelt AP1 (teilweise) | „Tunneling: das Paket verschlüsselt in ein neues Paket verpackt“ ist AP1-6-3-3-K3 („Bild des Tunnels: Datenpakete verschlüsselt und in andere Pakete verpackt“). Neu sind IPsec und der Tunnelmodus. | Auf das Neue kürzen. | mittel |
| 11 | PB1-11-2-2-K4 | doppelt AP1 (teilweise) | RADIUS („zentrale Prüfung von Benutzern beim Netzzugang“) erklärt schon AP1-6-3-1-K7. Neu ist nur Kerberos. | Auf Kerberos kürzen; baut_auf AP1-6-3-1 ist gesetzt. | niedrig |
| 12 | PB1-11-2-3-K4 | doppelt AP1 (teilweise) | Was ein NAS ist, erklärt schon AP1-7-3-5-K4 (Stufe 2). Neu ist der Vergleich mit dem SAN. | Auf „NAS (dateibasiert) vom SAN (blockbasiert) unterscheiden“ kürzen. | niedrig |
| 13 | PB1-11 gesamt | Frage (P10, E6) | 36 Aussagen zu Netzwerk bei nur 6 Belegteilaufgaben in 9 FIAE-Prüfungen, davon 4 aus einer einzigen Aufgabe (2024W-A2). Die Tiefe für AE ist laut Hinweis offen (P10). Nach E6 darf deshalb nichts gestrichen werden, aber jede Aussage kostet Lernzeit. | Den Projektinhaber bitten, P10 zu entscheiden (z. B. Netzwerk für AE höchstens Stufe 2 außer Belegtem). | niedrig |

**Bilanz PB1-11:** 13 Funde (davon 6 hoch). Lücken: 0. Kann weg bzw. zusammengelegt: 8 Aussagen (Nr. 1, 2, 3, 4, 5, 6, 7, 9). Vorher 36 → nach Vorschlägen etwa 28.

## Umsetzung (bauende Sitzung, 14.10.2026, Entscheidungen P35)

| Nr | Umsetzung |
|---|---|
| 1 | umgesetzt: Topologie-Aussage gestrichen, Grenze mit Katalogstelle AP2b.01.03.11 (E7); im Raster `raeume-ap2.json` als Ausnahme „keiner“ |
| 2 | umgesetzt: in der TCP/IP-Aussage aufgegangen (neu nur ARP, Routing, Switching) |
| 3 | umgesetzt: gestrichen, OUI als Halbsatz beim Ethernet-Frame; Beleg 2024W-A2-bb hängt dort |
| 4 | umgesetzt: gestrichen; 2024W-A2-c steht nur in PB1-3, der Baustein AP2b.01.01.1 ist hier als Anteil markiert |
| 5 | umgesetzt: gestrichen, `baut_auf` AP1-6-3-2; Beleg 2021W-A3-c nur noch bei der 404-Aussage |
| 6 | umgesetzt: gestrichen; 2022W-A1-a wohnt in PB1-12, AP2b.01.03.10 hier als Anteil (Drahtlosrisiken) |
| 7 | umgesetzt: Switch, Bridge und Router in einer Aussage mit Schicht, Adresse und Tabelle |
| 8 | umgesetzt: Paketfilter bleibt hier; PB1-10 auf den Webfilter gekürzt |
| 9 | teilweise: eigene HTTPS-Aussage gestrichen, HTTPS einsetzen steht als Halbsatz in der Protokoll-Aussage, weil nur sie AP2b.01.05.2 in Stufe 3 erreicht (P35 Nr. 4) |
| 10 | umgesetzt: auf IPsec und Tunnel-/Transportmodus gekürzt |
| 11 | umgesetzt: auf Kerberos gekürzt, RADIUS aus AP1 |
| 12 | umgesetzt: auf den Unterschied NAS/SAN gekürzt |
| 13 | entschieden mit P10/P35: keine pauschale Obergrenze; der Ordner ist durch die Funde 1–12 von 36 auf 28 Aussagen geschrumpft |

Gliederung: Schichtenmodelle und Komponenten in einem Stichpunkt (F3). Ergebnis: 36 → 28 Aussagen.

## Doppelungen zu AP1 (16.10.2026, P36)

Abgleich jeder Aussage mit `umbau/export/AP1.json` und `umbau/lernplan/ap1/*.json` nach T7 (P36) und P35 Nr. 4 („tiefer heißt mehr Inhalt“). Importierte AP1-Bausteine stehen nur noch in `bausteine`, wenn eine Aussage mit `neu` sie betrifft; sonst genügt `baut_auf`.

| Aussage | gestrichen/gekürzt/neu begründet | AP1-Gegenstück | Grund |
|---|---|---|---|
| PB1-11-1-1-K2 | gekürzt | AP1-6-2-4-K1 | Aufbau der MAC-Adresse (2024W-PB1-A2-bb) ist vollständig AP1; Beleg aus der Herkunft genommen, Karte AP2-6-1-1-K3-2 entfernt. Bleibt: Felder des Ethernet-Frames (2024W-PB1-A2-ba). |
| PB1-11-1-1-K3 | gekürzt | AP1-6-1-3-K1/K2 | Schicht und Adressart von Switch und Router gestrichen; bleibt: Bridge, MAC-Tabelle, Routingtabelle. Karte AP2-6-1-2-K1-1 entfernt. |
