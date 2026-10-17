# Wichtigkeit – Prüfbericht

Erzeugt mit `npm run umbau:wichtigkeit` (tools/umbau/wichtigkeit-pruefen.mjs). Regeln: `src/daten/wichtigkeit.js`, Begründung: `wichtigkeit-vorschlag.md`.
Grundlage: die Zuordnungen in `umbau/zuordnung/` und `umbau/lernplan/` im aktuellen Stand. Nicht von Hand ändern – neu erzeugen.

**Ergebnis der Zweitrechnung:** App und Zweitrechnung stimmen für alle Stichpunkte überein.

**Quelle der Belege:** geprüfte Zuordnung `umbau/zuordnung/wichtigkeit.json` (P73, Stand 2026-10-17): Paare, die die Zuordnung beim Bau (A) und eine blinde Zweitzuordnung (B) beide nennen, dazu die vom Schiedsrichter bestätigten.

| Raum | Teilaufgaben | Paare A | Paare B | einig | strittig | davon bestätigt | verworfen | gezählt |
|---|---|---|---|---|---|---|---|---|
| AP1 | 301 | 232 | 271 | 216 | 71 | 16 | 55 | 232 |
| PB1 | 152 | 110 | 125 | 108 | 19 | 4 | 15 | 112 |
| PB2 | 107 | 84 | 88 | 76 | 20 | 10 | 10 | 86 |
| WISO | 240 | 183 | 211 | 182 | 30 | 6 | 24 | 188 |

## Überblick je Raum

| Raum | Prüfungen | davon aktueller Katalog | Stichpunkte | Sehr oft | Oft | Manchmal | Selten | Bisher nicht |
|---|---|---|---|---|---|---|---|---|
| AP1 | 11 | 4 | 124 | 7 | 27 | 45 | 19 | 26 |
| PB1 | 9 | 2 | 76 | 10 | 12 | 9 | 16 | 29 |
| PB2 | 9 | 2 | 22 | 11 | 3 | 3 | 4 | 1 |
| WISO | 8 | 2 | 70 | 27 | 14 | 8 | 5 | 16 |

## Zuordnung

| Raum | Teilaufgaben | zugeordnet | begründet außerhalb | zugeordnet, aber an keinem Stichpunkt | an Stichpunkten, aber nicht in der Zuordnung |
|---|---|---|---|---|---|
| AP1 | 301 | 288 | 13 | 0 | 0 |
| PB1 | 152 | 152 | 0 | 0 | 0 |
| PB2 | 107 | 107 | 0 | 10 (2021W-PB2-A3, 2022S-PB2-A3, 2022W-PB2-A3-a, 2022W-PB2-A3-b, 2023W-PB2-A3-b, 2024S-PB2-A1-ba, 2024S-PB2-A1-bb, 2024S-PB2-A1-ca, …) | 0 |
| WISO | 240 | 240 | 0 | 0 | 0 |

Teilaufgaben „an keinem Stichpunkt“ gehören zu Bausteinen, deren Stichpunkt in einem anderen Raum wohnt (importierte Bausteine) oder die nur Grenzen/Kür belegen. Sie zählen hier nicht für die Wichtigkeit.

## Wackeltest (je eine Prüfung weglassen)

| Raum | Wechsel je Lauf (Mittel) | Stichpunkte, die in weniger als 80 % der Läufe ihre Stufe halten | Sprung über mehr als 1 Stufe |
|---|---|---|---|
| AP1 | 14 % | 16 % | 11 % |
| PB1 | 14 % | 36 % | 5 % |
| PB2 | 12 % | 32 % | 14 % |
| WISO | 22 % | 40 % | 3 % |

## Rückwärtstest (rollierend: Prüfung t aus allen Prüfungen davor, ab der 4.)

AUC: 0,50 = Zufall, 1,00 = perfekt; Standardfehler je Prüfung etwa ±0,05. Brier und Log-Loss: kleiner ist besser. Treffer: Anteil der Stichpunkte mit Quote ab 40 %, die in der nächsten Prüfung wirklich dran waren.

| Raum | Gewicht alt | Läufe | AUC | AUC nur Prüfungen nach aktuellem Katalog | Brier | Log-Loss | Treffer „Sehr oft“ |
|---|---|---|---|---|---|---|---|
| AP1 | 0,00 | 3 | 0,57 | 0,57 | 0,186 | 0,562 | 31 % (68) |
| AP1 | 0,60 | 8 | 0,59 | 0,61 | 0,154 | 0,483 | 23 % (75) |
| AP1 | 1,00 | 8 | 0,59 | 0,61 | 0,153 | 0,484 | 23 % (92) |
| PB1 | 0,00 | 1 | 0,57 | 0,57 | 0,155 | 0,490 | 20 % (10) |
| PB1 | 0,60 | 6 | 0,72 | 0,80 | 0,131 | 0,420 | 27 % (73) |
| PB1 | 1,00 | 6 | 0,72 | 0,80 | 0,128 | 0,407 | 29 % (86) |
| PB2 | 0,00 | 1 | 0,63 | 0,63 | 0,244 | 0,687 | 60 % (10) |
| PB2 | 0,60 | 6 | 0,76 | 0,78 | 0,200 | 0,596 | 64 % (59) |
| PB2 | 1,00 | 6 | 0,76 | 0,79 | 0,202 | 0,613 | 66 % (61) |
| WISO | 0,00 | 1 | 0,72 | 0,72 | 0,191 | 0,570 | 65 % (26) |
| WISO | 0,60 | 5 | 0,74 | 0,72 | 0,188 | 0,552 | 55 % (113) |
| WISO | 1,00 | 5 | 0,74 | 0,71 | 0,190 | 0,555 | 51 % (139) |

Gewicht alt 0 lässt sich erst bewerten, wenn vor der Testprüfung schon eine Prüfung nach aktuellem Katalog liegt – deshalb weniger Läufe; die Zeilen sind nicht direkt vergleichbar.
Treffer „Sehr oft“ ist die ehrliche Probe auf die Namen: Die Stufen beschreiben, was bisher geprüft wurde. Wie oft ein „sehr oft geprüfter“ Stichpunkt in der nächsten Prüfung wirklich dran ist, steht hier – in AP1 deutlich seltener als der Name vermuten lässt.

Gilt nach der Aufnahmeregel (Vorschlag 3.6): Ein anderes Gewicht für alte Prüfungen kommt nur, wenn es den Log-Loss in mindestens 3 von 4 Räumen senkt und das Bootstrap-Intervall die 0 nicht enthält. Diese Tabelle ist die Vorstufe dazu.

## Vorher festgelegte Signale (Aufnahmeregel)

Verbesserung des Log-Loss gegenüber „nur Prüfungen, Gewicht alt 0,6“ (positiv = besser), je Raum gemittelt über die rollierenden Läufe, dazu gepoolt mit 95-%-Bootstrap-Intervall. Aufgenommen wird ein Signal nur, wenn es in mindestens 3 von 4 Räumen besser ist und das Intervall die 0 nicht enthält.

| Signal | AP1 | PB1 | PB2 | WISO | besser in | 95-%-Intervall gepoolt | aufgenommen |
|---|---|---|---|---|---|---|---|
| Gewicht alter Prüfungen 1 statt 0,6 | -0,0005 | +0,0131 | -0,0173 | -0,0027 | 1 von 4 | -0,0066 bis +0,0034 | nein |
| Gewicht alter Prüfungen 0,3 statt 0,6 | -0,0148 | -0,0326 | +0,0063 | -0,0082 | 1 von 4 | -0,0200 bis -0,0056 | nein |
| Pause: in der letzten Prüfung dran → 20 % Abschlag | +0,0083 | +0,0138 | +0,0089 | -0,0096 | 3 von 4 | -0,0019 bis +0,0140 | nein |
| Alterung: 20 % weniger Gewicht je Jahr Abstand | -0,0072 | -0,0139 | +0,0022 | -0,0005 | 1 von 4 | -0,0107 bis -0,0006 | nein |

Nicht getestet: Tiefe der Aussagen (teils aus denselben Prüfungen abgeleitet, der Test wäre zirkulär) und Katalogänderung AP1 (der alte Katalog liegt nicht vor).

## Abdeckungskurve (Fläche: mittlerer abgedeckter Anteil einer Prüfung nach aktuellem Katalog, wenn man die Stichpunkte der Reihe nach lernt)

| Raum | Prüfungen | nach Quote | mit Fundament (λ = 0,50) | Katalog-Reihenfolge | Zufall | Kosten „Grundlagen zuerst“ |
|---|---|---|---|---|---|---|
| AP1 | 4 | 0,550 | 0,557 | 0,452 | 0,503 | -1 % |
| PB1 | 2 | 0,734 | 0,712 | 0,655 | 0,508 | 3 % |
| PB2 | 2 | 0,647 | 0,647 | 0,525 | 0,527 | 0 % |
| WISO | 2 | 0,686 | 0,686 | 0,659 | 0,511 | 0 % |

Kosten = wie viel Fläche die Reihenfolge mit Fundament gegenüber „nur nach Quote“ verliert (negativ: sie gewinnt). Grenze laut Vorschlag: höchstens 5 %.

## Stichpunkte

### AP1 (11 Prüfungen: Herbst 2021 bis Herbst 2026)

| Stichpunkt | Titel | Stufe | Prüfungen | Quote | plausibel | Termine | Grundlage für |
|---|---|---|---|---|---|---|---|
| AP1-2-3-1 | Englische Fachtexte verstehen | Sehr oft | 7 von 11 | 71 % | 5–10 | 2021H, 2022F, 2023H, 2025F, 2025H, 2026F, 2026H | 2 |
| AP1-4-2-1 | Zahlensysteme und Präfixe: binär, hexadezimal, kB und KiB | Sehr oft | 6 von 11 | 59 % | 4–9 | 2022F, 2022H, 2024F, 2025H, 2026F, 2026H | 1 |
| AP1-6-3-2 | Netzwerkbefehle und systematische Fehlersuche | Sehr oft | 6 von 11 | 54 % | 4–8 | 2022F, 2022H, 2024F, 2024H, 2026F, 2026H | 1 |
| AP1-3-1-2 | Kosten über die Nutzungsdauer berechnen | Sehr oft | 5 von 11 | 46 % | 3–7 | 2021H, 2024F, 2024H, 2025F, 2025H |  |
| AP1-8-4-1 | Einfache ER-Modelle | Sehr oft | 5 von 11 | 46 % | 3–7 | 2022H, 2023H, 2024H, 2026F, 2026H | 1 |
| AP1-6-2-2 | IPv4-Subnetting: Netzadresse, Broadcastadresse und Hostbereich | Sehr oft | 4 von 11 | 44 % | 3–7 | 2022F, 2025F, 2025H, 2026F | 1 |
| AP1-8-2-3 | Schreibtischtest | Sehr oft | 4 von 11 | 44 % | 3–7 | 2024H, 2025F, 2026F, 2026H | 3 |
| AP1-4-1-4 | Peripheriegeräte und Anschlüsse | Oft | 4 von 11 | 39 % | 2–7 | 2022F, 2024F, 2025F, 2026F |  |
| AP1-4-2-2 | Datenmengen und Speicherbedarf berechnen | Oft | 4 von 11 | 39 % | 2–7 | 2022H, 2024F, 2025H, 2026F | 1 |
| AP1-4-2-3 | Leistung, Energie, Wirkungsgrad und Stromkosten berechnen | Oft | 4 von 11 | 39 % | 2–7 | 2021H, 2024F, 2025H, 2026F |  |
| AP1-7-1-1 | Schutzziele: Vertraulichkeit, Integrität, Verfügbarkeit | Oft | 4 von 11 | 39 % | 2–7 | 2021H, 2023H, 2025F, 2026H | 2 |
| AP1-7-1-3 | Sicherheitsrichtlinien, Passwort-Policy und Sicherheitsbewusstsein: Security by Design, Security by Default | Oft | 4 von 11 | 39 % | 2–7 | 2021H, 2023H, 2025F, 2026F | 4 |
| AP1-7-3-2 | Hashwerte, Zertifikate und digitale Signatur | Oft | 4 von 11 | 39 % | 2–7 | 2021H, 2023H, 2025F, 2025H | 2 |
| AP1-7-5-1 | DSGVO und BDSG: personenbezogene Daten, Betroffenenrechte, Einwilligung | Oft | 4 von 11 | 39 % | 2–7 | 2021H, 2023H, 2025F, 2026H | 3 |
| AP1-2-4-1 | Unternehmensziele und Leitbild: ökonomisch, ökologisch, sozial | Oft | 4 von 11 | 34 % | 2–6 | 2023F, 2023H, 2024H, 2026F | 3 |
| AP1-3-2-3 | Qualitativer Angebotsvergleich mit der Nutzwertanalyse | Oft | 4 von 11 | 34 % | 2–6 | 2022H, 2023F, 2024F, 2025F |  |
| AP1-3-2-4 | Eigenleistung oder Fremdvergabe | Oft | 4 von 11 | 34 % | 2–6 | 2022F, 2022H, 2024H, 2026H | 1 |
| AP1-6-2-3 | IPv6-Adressen lesen und schreiben | Oft | 4 von 11 | 34 % | 2–6 | 2022F, 2022H, 2024F, 2026F |  |
| AP1-7-3-4 | Betriebssystem härten, Virenschutz und Personal Firewall | Oft | 4 von 11 | 34 % | 2–6 | 2021H, 2023F, 2024H, 2025H | 1 |
| AP1-7-4-3 | Sicher mobil und in Telearbeit arbeiten | Oft | 4 von 11 | 34 % | 2–6 | 2023H, 2024F, 2024H, 2026H | 2 |
| AP1-1-2-2 | Netzplan: Zeiten, Puffer und kritischen Weg berechnen | Oft | 3 von 11 | 32 % | 2–6 | 2021H, 2025F, 2026F |  |
| AP1-2-5-1 | Veränderungsprozesse: Schritte, Chancen und Einbeziehung der Mitarbeiter | Oft | 3 von 11 | 32 % | 2–6 | 2021H, 2025F, 2025H | 1 |
| AP1-5-1-4 | KI-Software auswählen, einrichten und einsetzen | Oft | 3 von 11 | 32 % | 2–6 | 2023F, 2025F, 2025H |  |
| AP1-6-2-1 | IPv4-Konfiguration: Adresse, Subnetzmaske, Gateway, statisch oder per DHCP | Oft | 3 von 11 | 32 % | 2–6 | 2024H, 2025H, 2026F |  |
| AP1-7-1-2 | TOM: technische, organisatorische und personelle Maßnahmen | Oft | 3 von 11 | 32 % | 2–6 | 2024H, 2025H, 2026H | 3 |
| AP1-7-5-3 | Datenschutz in der Praxis: Protokollierung, Videoaufnahmen, Gesundheitsdaten | Oft | 3 von 11 | 32 % | 2–6 | 2023F, 2025H, 2026F |  |
| AP1-3-2-2 | Quantitativer Angebotsvergleich und Preis-Leistungs-Verhältnis | Oft | 4 von 11 | 29 % | 1–6 | 2022H, 2023F, 2023H, 2024H |  |
| AP1-4-1-2 | Prozessor, Mainboard, Arbeitsspeicher, Grafikkarte und Netzteil | Oft | 3 von 11 | 27 % | 1–5 | 2022F, 2024H, 2026H |  |
| AP1-4-2-4 | Übertragungsraten und Übertragungszeiten berechnen | Oft | 3 von 11 | 27 % | 1–5 | 2022F, 2024F, 2026F |  |
| AP1-6-1-1 | OSI-Modell und Zuordnung | Oft | 3 von 11 | 27 % | 1–5 | 2022F, 2024F, 2026H | 1 |
| AP1-6-3-3 | VPN | Oft | 3 von 11 | 27 % | 1–5 | 2023H, 2024F, 2026H | 1 |
| AP1-7-3-3 | Authentifizierung, Zwei-Faktor-Verfahren, Zugangs- und Zugriffskontrolle | Oft | 3 von 11 | 27 % | 1–5 | 2023H, 2024H, 2025H | 2 |
| AP1-7-3-5 | Datensicherung und Verfügbarkeit: Backup-Verfahren, NAS | Oft | 3 von 11 | 27 % | 1–5 | 2021H, 2024F, 2026H | 3 |
| AP1-8-3-1 | Anwendungsfalldiagramm | Oft | 3 von 11 | 27 % | 1–5 | 2023H, 2024H, 2026H | 1 |
| AP1-1-3-3 | KI-Unterstützung in Arbeitsabläufen | Manchmal | 2 von 11 | 24 % | 1–5 | 2025F, 2025H |  |
| AP1-3-4-2 | Open Source und proprietäre Software | Manchmal | 2 von 11 | 24 % | 1–5 | 2025F, 2026H | 2 |
| AP1-8-4-2 | Redundanz erkennen und Datentypen wählen | Manchmal | 2 von 11 | 24 % | 1–5 | 2025F, 2026H | 2 |
| AP1-2-2-2 | Lastenheft und Pflichtenheft | Manchmal | 3 von 11 | 22 % | 1–5 | 2021H, 2023F, 2024H | 1 |
| AP1-3-1-3 | Machbarkeit mit Budgetvorgabe, Vor- und Nachkalkulation | Manchmal | 3 von 11 | 22 % | 1–5 | 2021H, 2022H, 2023H | 2 |
| AP1-3-3-1 | Kauf-, Miet- und Leasingvertrag; Vertragsbestandteile | Manchmal | 3 von 11 | 22 % | 1–5 | 2023F, 2024F, 2024H | 1 |
| AP1-6-2-4 | MAC-Adresse, ARP und DHCP | Manchmal | 3 von 11 | 22 % | 1–5 | 2022F, 2024F, 2024H | 2 |
| AP1-7-2-1 | IT-Grundschutz-Kompendium und Bausteine | Manchmal | 3 von 11 | 22 % | 1–5 | 2021H, 2023F, 2024H | 2 |
| AP1-1-1-1 | Projektmerkmale und SMART-Ziele | Manchmal | 2 von 11 | 20 % | 1–5 | 2021H, 2026H |  |
| AP1-1-1-2 | Vorgehen im Projekt: Projektphasen, Wasserfallmodell und Scrum | Manchmal | 2 von 11 | 20 % | 1–5 | 2022H, 2026H | 4 |
| AP1-1-2-3 | Meilensteine, Termintreue und Reaktion auf Terminprobleme | Manchmal | 2 von 11 | 20 % | 1–5 | 2021H, 2026H | 1 |
| AP1-3-3-3 | Vertragsstörungen und Mängelarten: Schlechtleistung, Falschlieferung, Minderlieferung | Manchmal | 2 von 11 | 20 % | 1–5 | 2024F, 2026F |  |
| AP1-4-1-5 | Hardware einbauen: Prozessor, Kühler, Arbeitsspeicher | Manchmal | 2 von 11 | 20 % | 1–5 | 2022F, 2026H |  |
| AP1-4-1-6 | Kennzeichnung, Sensoren und Kameras: Barcode, QR-Code, RFID | Manchmal | 2 von 11 | 20 % | 1–5 | 2022H, 2026F |  |
| AP1-4-3-1 | Ergonomie am Arbeitsplatz | Manchmal | 2 von 11 | 20 % | 1–5 | 2023H, 2026F | 1 |
| AP1-6-2-5 | IPv6 im Netz: Präfixe aufteilen, Adressen vergeben, mit IPv4 kombinieren | Manchmal | 2 von 11 | 20 % | 1–5 | 2022H, 2026F |  |
| AP1-7-2-2 | Schutzbedarfsanalyse und Schutzbedarfskategorien | Manchmal | 2 von 11 | 20 % | 1–5 | 2021H, 2026H | 3 |
| AP1-7-3-1 | Symmetrische, asymmetrische und hybride Verschlüsselung | Manchmal | 2 von 11 | 20 % | 1–5 | 2023H, 2025F | 2 |
| AP1-7-4-1 | Schadsoftware erkennen und abwehren | Manchmal | 2 von 11 | 20 % | 1–5 | 2024F, 2026H | 3 |
| AP1-8-1-3 | Skriptsprachen, Bibliotheken und Frameworks; Programmiersprache auswählen | Manchmal | 2 von 11 | 20 % | 1–5 | 2024H, 2025F | 3 |
| AP1-8-2-4 | Fehler im Quellcode finden: Debugging, formale und inhaltliche Fehler | Manchmal | 2 von 11 | 20 % | 1–5 | 2021H, 2026H | 4 |
| AP1-8-3-2 | Klassendiagramm | Manchmal | 2 von 11 | 20 % | 1–5 | 2023F, 2026F | 4 |
| AP1-8-4-5 | Relationale Tabellen: Primär- und Fremdschlüssel | Manchmal | 2 von 11 | 20 % | 1–5 | 2023H, 2025H | 3 |
| AP1-1-4-1 | Leistungserbringung vor Ort oder remote und Kundenvorgaben | Manchmal | 2 von 11 | 15 % | 1–4 | 2021H, 2023H |  |
| AP1-3-2-1 | Kostenvergleich rechnen: Kauf, Leasing, Finanzierung, Pay-per-Use | Manchmal | 2 von 11 | 15 % | 1–4 | 2023F, 2024H |  |
| AP1-4-1-1 | Geräteklassen und Arbeitsplatzsysteme auswählen | Manchmal | 2 von 11 | 15 % | 1–4 | 2023F, 2023H |  |
| AP1-4-1-3 | Datenspeicher: HDD und SSD | Manchmal | 2 von 11 | 15 % | 1–4 | 2022F, 2024H |  |
| AP1-4-3-3 | Energieeffizienz, Gütesiegel und ökologische Aspekte | Manchmal | 2 von 11 | 15 % | 1–4 | 2021H, 2024H | 3 |
| AP1-5-1-1 | Softwarearten: Anwendungs-, Standard-, Branchen- und Systemsoftware | Manchmal | 2 von 11 | 15 % | 1–4 | 2023F, 2024F | 1 |
| AP1-5-1-3 | Cloudlösungen, virtuelle Desktops und Kommunikationssysteme | Manchmal | 2 von 11 | 15 % | 1–4 | 2022F, 2024F | 1 |
| AP1-8-2-2 | Pseudocode: Kontrollstrukturen abbilden | Manchmal | 2 von 11 | 15 % | 1–4 | 2022F, 2022H | 3 |
| AP1-1-5-3 | Testprotokoll für einen eingerichteten Arbeitsplatz | Manchmal | 1 von 11 | 12 % | 0–4 | 2026H | 1 |
| AP1-2-5-2 | Rollen und Widerstände im Veränderungsprozess | Manchmal | 1 von 11 | 12 % | 0–4 | 2025H | 1 |
| AP1-2-5-3 | Umstellung einführen: Sofortumstellung oder Parallelbetrieb | Manchmal | 1 von 11 | 12 % | 0–4 | 2026F |  |
| AP1-3-1-4 | Rechnung prüfen: Positionen, Rabatt, Umsatzsteuer, Skonto | Manchmal | 1 von 11 | 12 % | 0–4 | 2025H |  |
| AP1-3-1-6 | Preisnachlässe und Bezahlen: Rabattgründe, GiroCode, digitale Rechnung | Manchmal | 1 von 11 | 12 % | 0–4 | 2025H |  |
| AP1-3-4-1 | Urheberrecht und Lizenzarten: EULA, OEM, GNU GPL | Manchmal | 1 von 11 | 12 % | 0–4 | 2026H | 2 |
| AP1-5-2-2 | Installation und Einrichtung: BIOS/UEFI, Partitionieren, Formatieren, Dateisysteme FAT32, NTFS, APFS, ext4 | Manchmal | 1 von 11 | 12 % | 0–4 | 2026H |  |
| AP1-6-1-2 | Protokolle und ihre Aufgaben | Manchmal | 1 von 11 | 12 % | 0–4 | 2025F | 2 |
| AP1-6-1-3 | Netzwerkkomponenten: Switch, Router, Access Point, Patchfeld | Manchmal | 1 von 11 | 12 % | 0–4 | 2025H | 2 |
| AP1-6-1-4 | Leitungen, Standards und Internetanbindung | Manchmal | 1 von 11 | 12 % | 0–4 | 2026H | 1 |
| AP1-6-1-5 | WLAN- und Ethernet-Standards, Power over Ethernet | Manchmal | 1 von 11 | 12 % | 0–4 | 2026F | 1 |
| AP1-6-3-4 | Was Testbefehle zeigen: ping, traceroute, Routingtabelle, nslookup | Manchmal | 1 von 11 | 12 % | 0–4 | 2026F |  |
| AP1-8-1-2 | Prozedurale und objektorientierte Programmierung: Klassen, Objekte, Attribute, Methoden, Sichtbarkeit | Manchmal | 1 von 11 | 12 % | 0–4 | 2026F | 2 |
| AP1-8-3-3 | Aktivitätsdiagramm | Manchmal | 1 von 11 | 12 % | 0–4 | 2025H | 3 |
| AP1-1-1-3 | Stakeholder und Risikoanalyse | Selten | 1 von 11 | 7 % | 0–3 | 2022H | 3 |
| AP1-1-2-1 | Projektstrukturplan und Gantt-Diagramm | Selten | 1 von 11 | 7 % | 0–3 | 2023H | 1 |
| AP1-1-3-1 | Support-Level, Ticketsystem und Bearbeitungsstatus | Selten | 1 von 11 | 7 % | 0–3 | 2023H | 1 |
| AP1-1-3-2 | Fehler- und Störungsmanagement, Kundenkommunikation im Service | Selten | 1 von 11 | 7 % | 0–3 | 2023H | 1 |
| AP1-1-4-2 | Abnahme, Übergabe und Einweisung: Abnahmeprotokoll | Selten | 1 von 11 | 7 % | 0–3 | 2021H | 2 |
| AP1-2-1-1 | Marktformen und Käufer-/Verkäufermarkt | Selten | 1 von 11 | 7 % | 0–3 | 2022H | 1 |
| AP1-2-2-1 | Bedarfsanalyse: Daten erheben und auswerten | Selten | 1 von 11 | 7 % | 0–3 | 2023H |  |
| AP1-2-2-3 | Kundenkommunikation und Kommunikationsmodelle: 4-Ohren-Modell, Sender-Empfänger-Modell | Selten | 1 von 11 | 7 % | 0–3 | 2023H | 1 |
| AP1-2-2-4 | Angebot unterbreiten: Informationen sammeln und Leistungen kundengerecht beschreiben | Selten | 1 von 11 | 7 % | 0–3 | 2022F |  |
| AP1-2-3-2 | Informationen beschaffen, Quellen auswerten und aufbereiten | Selten | 1 von 11 | 7 % | 0–3 | 2024F | 1 |
| AP1-2-3-3 | Präsentieren und Medienkompetenz | Selten | 1 von 11 | 7 % | 0–3 | 2022F | 2 |
| AP1-3-3-2 | Werkvertrag, Dienstvertrag, Servicevertrag und Service Level Agreement | Selten | 1 von 11 | 7 % | 0–3 | 2022H | 2 |
| AP1-4-1-8 | Wie ein Computer arbeitet: EVA, von Neumann, Prozessor und Speicher | Selten | 1 von 11 | 7 % | 0–3 | 2022F |  |
| AP1-5-2-1 | Betriebssysteme: Einsatzzweck, Dateiverwaltung, Freigaben und Gruppenrichtlinien | Selten | 1 von 11 | 7 % | 0–3 | 2023F |  |
| AP1-6-3-1 | WLAN-Zugang: Pre-shared Key und Enterprise | Selten | 1 von 11 | 7 % | 0–3 | 2022F | 1 |
| AP1-7-1-4 | IT-Sicherheitsbeauftragter, Datenschutzbeauftragter, ISMS und IT-Sicherheitsmanagement | Selten | 1 von 11 | 7 % | 0–3 | 2023F | 1 |
| AP1-7-4-2 | Phishing erkennen und abwehren | Selten | 1 von 11 | 7 % | 0–3 | 2024H | 3 |
| AP1-8-1-1 | Compiler, Linker, Interpreter und Entwicklungswerkzeuge | Selten | 1 von 11 | 7 % | 0–3 | 2024H | 1 |
| AP1-8-2-1 | Bausteine eines Programms: Variablen, Datentypen, Datenstrukturen, Kontrollstrukturen, Prozeduren und Funktionen | Selten | 1 von 11 | 7 % | 0–3 | 2022H | 2 |
| AP1-1-1-4 | Teamphasen und Reflexion: Feedback, Lessons Learned | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 1 |
| AP1-1-4-3 | Auftrag auswerten: Soll-Ist-Vergleich, Abweichungsanalyse, Lessons Learned, Nachfolgeaufträge | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 3 |
| AP1-1-5-1 | QM-Systeme, QS-Normen und Zertifizierung | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-1-5-2 | Qualitätsplanung, Qualitätslenkung und PDCA-Zyklus | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 2 |
| AP1-2-1-2 | Zielgruppen definieren und abgrenzen | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-2-1-3 | Vertriebsformen: direkter und indirekter Vertrieb | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-2-4-2 | Aufbauorganisation: Einlinien-, Mehrlinien-, Matrixorganisation | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 1 |
| AP1-2-4-3 | Handlungsspielräume und Vollmachten | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 1 |
| AP1-3-1-1 | Kostenarten: Anschaffung, Betrieb, Lizenz, Finanzierung, fix und variabel | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 1 |
| AP1-3-1-5 | Wertschöpfung | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-3-4-3 | Lizenzvertrag und Abrechnungsmodelle: Kauf, Abonnement, Pay-per-Use | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-4-1-7 | Leistung von Prozessor und Arbeitsspeicher beurteilen | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-4-2-5 | Zeichen und Zahlen binär kodieren: ASCII, Unicode, Dualzahlen | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-4-3-2 | Barrierefreiheit durch Hardware und Einstellungen | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 1 |
| AP1-5-1-2 | Standard- oder Individualsoftware auswählen: Anpassbarkeit, Wartbarkeit, Schnittstellen | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-5-1-5 | Cloud Computing: Merkmale, Cloud-Speicher und Schutz der Daten | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-5-2-3 | Kommandozeile: Befehle für Dateioperationen | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-5-2-4 | Software anpassen | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-5-2-5 | Client-Server-Systeme, Domäne und Remote-Desktop | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-6-1-6 | Netzwerkgeräte nach Leistungsdaten auswählen: Switch, Router, Netzwerkkarte, PoE | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-7-2-3 | Risiken klassifizieren mit der Risikomatrix | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 1 |
| AP1-7-5-2 | Anonymisierung und Pseudonymisierung | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 1 |
| AP1-8-2-5 | Datenstrukturen: Array, verkettete Liste, Stapel, Warteschlange, Hashtabelle | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-8-2-6 | Variablen, Datentypen und Ausdrücke: Gültigkeit, Konstanten, Zuweisung, Rangfolge | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |
| AP1-8-4-3 | Bildschirmmasken entwerfen: Softwareergonomie, Corporate Identity, Barrierefreiheit | Bisher nicht | 0 von 11 | 0 % | 0–2 | – | 3 |
| AP1-8-4-4 | Prozessdarstellungen lesen: EPK und BPMN | Bisher nicht | 0 von 11 | 0 % | 0–2 | – |  |

### PB1 (9 Prüfungen: Winter 2021 bis Winter 2025)

| Stichpunkt | Titel | Stufe | Prüfungen | Quote | plausibel | Termine | Grundlage für |
|---|---|---|---|---|---|---|---|
| PB1-1-2-1 | Machbarkeit, Risiken, Änderungen und Kosten | Sehr oft | 6 von 9 | 71 % | 4–8 | 2022S, 2023S, 2023W, 2024W, 2025S, 2025W | 1 |
| PB1-1-2-2 | Stakeholder und Akzeptanz im Softwareprojekt | Sehr oft | 6 von 9 | 65 % | 4–8 | 2022S, 2023S, 2023W, 2024S, 2024W, 2025S |  |
| PB1-8-1-3 | Oberflächen gestalten: Elemente, Darstellungsformen, Mock-ups und Prototypen | Sehr oft | 5 von 9 | 61 % | 3–7 | 2022W, 2023W, 2024S, 2025S, 2025W |  |
| PB1-1-1-1 | Klassisch oder agil: Kategorien von Vorgehensmodellen vergleichen | Sehr oft | 4 von 9 | 45 % | 2–6 | 2022S, 2022W, 2024W, 2025W | 1 |
| PB1-1-2-3 | Anforderungen ableiten, Lasten- und Pflichtenheft | Sehr oft | 4 von 9 | 45 % | 2–6 | 2022S, 2022W, 2023S, 2025S |  |
| PB1-4-1-1 | UML-Überblick und Anwendungsfalldiagramm | Sehr oft | 4 von 9 | 45 % | 2–6 | 2021W, 2023W, 2024S, 2025W |  |
| PB1-5-1-4 | Entwurfsmuster: Observer, Factory, Singleton, MVC und Schichten | Sehr oft | 4 von 9 | 45 % | 2–6 | 2022S, 2022W, 2024W, 2025S |  |
| PB1-6-1-1 | ER-Modell aus Anforderungen erstellen und erweitern | Sehr oft | 4 von 9 | 45 % | 2–6 | 2021W, 2023W, 2024S, 2025S | 1 |
| PB1-10-1-3 | Verschlüsselungsverfahren in Anwendungen wählen | Sehr oft | 4 von 9 | 45 % | 2–6 | 2021W, 2022W, 2023S, 2025W |  |
| PB1-10-1-4 | Integrität, Authentizität, Zertifikate und Passwortspeicherung | Sehr oft | 4 von 9 | 45 % | 2–6 | 2022S, 2022W, 2023S, 2025S | 1 |
| PB1-4-1-2 | Klassendiagramm in der Tiefe | Oft | 4 von 9 | 39 % | 2–6 | 2021W, 2022S, 2023S, 2024W | 1 |
| PB1-4-1-5 | Aktivitätsdiagramm für umfangreiche Abläufe | Oft | 3 von 9 | 35 % | 1–5 | 2022W, 2023W, 2025S | 1 |
| PB1-5-1-1 | Kapselung, Vererbung, Interfaces und Polymorphie | Oft | 3 von 9 | 35 % | 1–5 | 2022S, 2023S, 2025S |  |
| PB1-1-1-3 | Scrum: Elemente, Rollen und User Stories | Oft | 3 von 9 | 29 % | 1–5 | 2022W, 2023W, 2024W | 1 |
| PB1-2-1-2 | Compliance, Regelkonformität und Kundenbindung (CRM) | Oft | 3 von 9 | 29 % | 1–5 | 2022W, 2024S, 2024W | 1 |
| PB1-4-1-4 | Zustandsdiagramm | Oft | 3 von 9 | 29 % | 1–5 | 2022W, 2023S, 2024W | 1 |
| PB1-5-1-5 | Objektorientierte Methoden in Pseudocode umsetzen | Oft | 3 von 9 | 29 % | 1–5 | 2022S, 2023S, 2024S | 2 |
| PB1-6-1-4 | Relationale und NoSQL-Datenbanken | Oft | 3 von 9 | 29 % | 1–5 | 2022S, 2022W, 2023W |  |
| PB1-9-1-1 | Qualitätssicherung, KVP und Kennzahlen | Oft | 3 von 9 | 29 % | 1–5 | 2021W, 2023S, 2024S |  |
| PB1-6-1-3 | Redundanz, Anomalien und Normalisierung bis zur 3. Normalform | Oft | 2 von 9 | 26 % | 1–5 | 2023S, 2025W | 2 |
| PB1-7-1-1 | XML: wohlgeformt, gültig, DTD und Schema | Oft | 2 von 9 | 26 % | 1–5 | 2022W, 2025W | 1 |
| PB1-9-1-5 | Testkonzept, Testprozess, Test- und Abnahmeprotokoll | Oft | 2 von 9 | 26 % | 1–5 | 2023W, 2025S | 1 |
| PB1-1-2-4 | Qualitätsmerkmale von Software (ISO/IEC 9126 / 25010) | Manchmal | 2 von 9 | 19 % | 1–4 | 2021W, 2023S |  |
| PB1-3-2-1 | Bibliotheken, Frameworks und Open Source einsetzen | Manchmal | 2 von 9 | 19 % | 1–4 | 2021W, 2022W |  |
| PB1-3-2-2 | Abläufe automatisieren: Skripte und CI/CD | Manchmal | 2 von 9 | 19 % | 1–4 | 2022W, 2024W |  |
| PB1-4-1-3 | Sequenzdiagramm | Manchmal | 2 von 9 | 19 % | 1–4 | 2022S, 2024S | 1 |
| PB1-7-1-2 | JSON und CSV | Manchmal | 2 von 9 | 19 % | 1–4 | 2023W, 2024W |  |
| PB1-8-1-1 | Softwareergonomie, Usability und User Experience | Manchmal | 2 von 9 | 19 % | 1–4 | 2021W, 2024S |  |
| PB1-8-1-2 | Barrierefreiheit und inklusives Design | Manchmal | 2 von 9 | 19 % | 1–4 | 2021W, 2022W |  |
| PB1-10-2-1 | Authentifizierung, Autorisierung und Identity & Access Management | Manchmal | 2 von 9 | 19 % | 1–4 | 2022S, 2022W | 1 |
| PB1-7-1-5 | eRechnung: strukturierte Daten prüfen und validieren | Manchmal | 1 von 9 | 16 % | 0–4 | 2025W |  |
| PB1-1-1-2 | Wasserfall-, V- und Spiralmodell | Selten | 1 von 9 | 10 % | 0–3 | 2024W |  |
| PB1-2-1-3 | Tabellenkalkulation: Formeln, Verweise und Grenzen | Selten | 1 von 9 | 10 % | 0–3 | 2023S |  |
| PB1-3-1-1 | Programmiersprachen: Konzepte, Einsatz und Auswahl | Selten | 1 von 9 | 10 % | 0–3 | 2021W |  |
| PB1-3-1-2 | Entwicklungswerkzeuge aufgabenbezogen auswählen und anwenden | Selten | 1 von 9 | 10 % | 0–3 | 2021W |  |
| PB1-3-1-3 | Versionsverwaltung im Entwicklungsteam | Selten | 1 von 9 | 10 % | 0–3 | 2021W |  |
| PB1-6-1-5 | Transaktionen und Datenintegrität | Selten | 1 von 9 | 10 % | 0–3 | 2023W | 2 |
| PB1-7-1-4 | REST, SOAP und Schnittstellen festlegen | Selten | 1 von 9 | 10 % | 0–3 | 2024S | 1 |
| PB1-9-1-3 | Testverfahren: statisch und dynamisch, Black-Box und White-Box | Selten | 1 von 9 | 10 % | 0–3 | 2021W | 3 |
| PB1-9-1-6 | Handbücher und Dokumentation | Selten | 1 von 9 | 10 % | 0–3 | 2021W |  |
| PB1-10-1-1 | Schäden einschätzen und Sicherheitsanforderungen festlegen | Selten | 1 von 9 | 10 % | 0–3 | 2024S |  |
| PB1-11-1-1 | Schichtenmodelle, Ethernet-Frame und Netzwerkkomponenten | Selten | 1 von 9 | 10 % | 0–3 | 2024W |  |
| PB1-11-1-2 | Übertragungsprotokolle: TCP, UDP, HTTP, HTTPS | Selten | 1 von 9 | 10 % | 0–3 | 2021W |  |
| PB1-11-2-1 | Netzausdehnung, Verkabelung und Netzwerkplan | Selten | 1 von 9 | 10 % | 0–3 | 2024W |  |
| PB1-12-1-1 | Verfügbarkeit von Anwendungsdiensten beurteilen | Selten | 1 von 9 | 10 % | 0–3 | 2022W |  |
| PB1-12-1-2 | Ausfallrisiken, MTBF/AFR und Notfallkonzept | Selten | 1 von 9 | 10 % | 0–3 | 2022W |  |
| PB1-12-2-2 | Störungen bearbeiten: Incident Management, SLA, SOP, Eskalation | Selten | 1 von 9 | 10 % | 0–3 | 2022S |  |
| PB1-2-1-1 | Rechtlicher Rahmen: BGB, HGB, UWG und AGB | Bisher nicht | 0 von 9 | 0 % | 0–2 | – | 1 |
| PB1-2-1-4 | Daten interpretieren, visualisieren und präsentieren | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-3-2-3 | Cyber-physische Systeme: Sensoren, Aktoren, Abfragerhythmus | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-5-1-2 | Allgemeine Fehlerbehandlung in Programmen | Bisher nicht | 0 von 9 | 0 % | 0–2 | – | 2 |
| PB1-5-1-3 | Strukturierte und objektorientierte Analyse und Design | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-5-1-6 | Architekturmuster: Schichten, MVC und ereignisgesteuerte Oberflächen | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-6-1-2 | Relationales Modell: Tabellen, Schlüssel, Datentypen, Integrität | Bisher nicht | 0 von 9 | 0 % | 0–2 | – | 4 |
| PB1-7-1-3 | Daten heterogener Quellen zusammenführen: Data Lake, Open Data | Bisher nicht | 0 von 9 | 0 % | 0–2 | – | 1 |
| PB1-7-1-6 | REST und SOAP: Prinzipien, Nachrichtenaufbau und Auswahl | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-8-1-4 | Grundsätze der Dialoggestaltung an Beispielen | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-9-1-2 | Prüfverfahren: Parität und Redundanz | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-9-1-4 | Teststufen: vom Unit-Test bis zur Abnahme | Bisher nicht | 0 von 9 | 0 % | 0–2 | – | 1 |
| PB1-10-1-2 | Bedrohungsszenarien und präventive Maßnahmen | Bisher nicht | 0 von 9 | 0 % | 0–2 | – | 1 |
| PB1-10-2-2 | Datenschutz beim Entwurf von Anwendungen und Archivierung | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-10-2-3 | TOM prüfen und softwaretechnisch absichern | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-10-2-4 | Sicherheitsprüfung und Beratung | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-11-1-3 | Netzwerkdienste: DNS, DHCP und Proxy | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-11-1-4 | Firewall: Regelwerk, Prüftiefe und Einsatzort | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-11-2-2 | VLAN, Drahtlosnetze und Zugriffskontrolle im Netz | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-11-2-3 | Client-Server, Peer-to-Peer und Speicher im Netz | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-11-2-4 | Standortübergreifende Kommunikation: VPN-Modelle, Tunneling, IPsec | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-11-2-5 | Sicherheitskonzepte im Netz: DMZ, Segmentierung und Zero Trust | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-12-1-3 | Betrieb sicherstellen: USV, Redundanz, RAID und Backup | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-12-1-4 | Stromversorgung absichern: USV-Klassen, Leistung und Überbrückungszeit | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-12-1-5 | RAID vertieft: RAID 6, Hot-Spare, Hardware- oder Software-RAID | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-12-2-1 | Monitoring: Messdaten, Schwellwerte, SNMP, S.M.A.R.T., Systemlast | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-12-2-3 | Service- und Liefermodelle: On-Premises, Cloud, IaaS, PaaS, SaaS | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-12-2-4 | Messdaten sammeln und auswerten: Baseline, Logs und Alarmierung | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |
| PB1-12-2-5 | Hosting, Colocation und Managed Services auswählen | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |

### PB2 (9 Prüfungen: Winter 2021 bis Winter 2025)

| Stichpunkt | Titel | Stufe | Prüfungen | Quote | plausibel | Termine | Grundlage für |
|---|---|---|---|---|---|---|---|
| PB2-1-1-1 | Pseudocode und Aktivitätsdiagramm: Funktionen, Schleifengrenzen, Sonderfälle und Datentypen | Sehr oft | 9 von 9 | 100 % | 7–9 | 2021W, 2022S, 2022W, 2023S, 2023W, 2024S, 2024W, 2025S, 2025W |  |
| PB2-5-1-2 | Abfragen über mehrere Tabellen: JOIN | Sehr oft | 8 von 9 | 90 % | 6–9 | 2021W, 2022S, 2022W, 2023S, 2024S, 2024W, 2025S, 2025W |  |
| PB2-5-1-3 | Aggregatfunktionen, GROUP BY und HAVING | Sehr oft | 8 von 9 | 90 % | 6–9 | 2021W, 2022S, 2022W, 2023S, 2023W, 2024S, 2025S, 2025W |  |
| PB2-5-1-1 | SELECT: Spalten, Bedingungen, Ausdrücke und Sortieren | Sehr oft | 8 von 9 | 84 % | 5–9 | 2021W, 2022S, 2022W, 2023S, 2023W, 2024S, 2024W, 2025W |  |
| PB2-1-1-2 | Algorithmen über Arrays und Listen: filtern, zählen, Extremwerte, abgleichen, gruppieren | Sehr oft | 7 von 9 | 81 % | 5–8 | 2022S, 2023S, 2023W, 2024S, 2024W, 2025S, 2025W |  |
| PB2-6-1-2 | Datenpflege: INSERT, UPDATE, DELETE und Archivieren | Sehr oft | 7 von 9 | 81 % | 5–8 | 2021W, 2022S, 2022W, 2023W, 2024S, 2025S, 2025W |  |
| PB2-6-1-1 | Tabellenstruktur, Index und Datenbankobjekte: CREATE TABLE, ALTER TABLE, CREATE INDEX, Prozedur, Trigger | Sehr oft | 5 von 9 | 61 % | 3–7 | 2021W, 2022S, 2022W, 2025S, 2025W |  |
| PB2-3-1-1 | Schreibtischtest und Fehler im Algorithmus lokalisieren | Sehr oft | 5 von 9 | 55 % | 3–7 | 2021W, 2022S, 2022W, 2023S, 2025W |  |
| PB2-5-1-5 | Übung: Vorgegebenes Tabellenmodell lesen und den Weg der Abfrage finden | Sehr oft | 5 von 9 | 48 % | 2–6 | 2021W, 2022W, 2023S, 2023W, 2024W |  |
| PB2-4-1-1 | Testabdeckung: Anweisungs-, Zweig- und Pfadüberdeckung | Sehr oft | 4 von 9 | 45 % | 2–6 | 2022W, 2023S, 2024S, 2025W |  |
| PB2-5-1-4 | Unterabfragen und UNION | Sehr oft | 4 von 9 | 45 % | 2–6 | 2022S, 2023W, 2024S, 2025S |  |
| PB2-3-1-3 | Unit-Tests schreiben und prüfen, Regressionstests | Oft | 3 von 9 | 35 % | 1–5 | 2022S, 2024S, 2025W |  |
| PB2-4-1-2 | Testverfahren auswählen und Bestehenskriterien festlegen | Oft | 2 von 9 | 26 % | 1–5 | 2024S, 2025S |  |
| PB2-6-1-3 | Benutzer, Rollen und Rechte: CREATE USER, GRANT, REVOKE | Oft | 2 von 9 | 26 % | 1–5 | 2023S, 2025S |  |
| PB2-2-1-1 | Such- und Sortierverfahren: lineare und binäre Suche, Bubble, Selection und Insertion Sort, Quicksort, Mergesort und O-Notation | Manchmal | 2 von 9 | 19 % | 1–4 | 2022W, 2024S |  |
| PB2-2-1-4 | Generische Klassen und Funktionsobjekte | Manchmal | 2 von 9 | 19 % | 1–4 | 2022W, 2024S |  |
| PB2-3-1-2 | Debugging und Fehlerbehandlung | Manchmal | 1 von 9 | 16 % | 0–4 | 2025S |  |
| PB2-1-1-3 | Bestehende Funktionen und Klassen erweitern | Selten | 1 von 9 | 10 % | 0–3 | 2024W |  |
| PB2-2-1-3 | Rekursion und Iteration | Selten | 1 von 9 | 10 % | 0–3 | 2022W |  |
| PB2-4-1-3 | Testdaten auswählen und generieren: Äquivalenzklassen, Grenzwerte, Sonderfälle | Selten | 1 von 9 | 10 % | 0–3 | 2022S |  |
| PB2-6-1-5 | Datenqualität vor einem Import prüfen | Selten | 1 von 9 | 10 % | 0–3 | 2024W |  |
| PB2-6-1-6 | SQL-Sprachteile, Spaltenoptionen und Indexwahl | Bisher nicht | 0 von 9 | 0 % | 0–2 | – |  |

### WISO (8 Prüfungen: Winter 2021 bis Winter 2025)

| Stichpunkt | Titel | Stufe | Prüfungen | Quote | plausibel | Termine | Grundlage für |
|---|---|---|---|---|---|---|---|
| WISO-1-4-1 | Betriebsrat: Wahl, Zusammensetzung, Mitbestimmungs- und Mitwirkungsrechte | Sehr oft | 8 von 8 | 100 % | 6–8 | 2021W, 2022S, 2022W, 2023S, 2023W, 2024S, 2025S, 2025W |  |
| WISO-2-2-2 | Kapitalgesellschaften GmbH und AG, Genossenschaft, gemeinnützige Organisationen, Wahl der Rechtsform | Sehr oft | 8 von 8 | 100 % | 6–8 | 2021W, 2022S, 2022W, 2023S, 2023W, 2024S, 2025S, 2025W |  |
| WISO-1-3-3 | Kündigung, Kündigungsfristen und Kündigungsschutz | Sehr oft | 7 von 8 | 89 % | 5–8 | 2021W, 2022W, 2023S, 2023W, 2024S, 2025S, 2025W |  |
| WISO-1-3-5 | Mutterschutz, Elternzeit, Gleichbehandlung und Schutz schwerbehinderter Menschen | Sehr oft | 7 von 8 | 89 % | 5–8 | 2021W, 2022W, 2023S, 2023W, 2024S, 2025S, 2025W |  |
| WISO-1-1-2 | Probezeit und Kündigung des Ausbildungsverhältnisses | Sehr oft | 6 von 8 | 79 % | 4–7 | 2021W, 2022S, 2023S, 2024S, 2025S, 2025W |  |
| WISO-1-3-6 | Arbeitsverhältnis: Einstellung, Probezeit, Befristung, Zeitarbeit, Urlaub und Zeugnis | Sehr oft | 6 von 8 | 79 % | 4–7 | 2022S, 2022W, 2023W, 2024S, 2025S, 2025W |  |
| WISO-1-2-3 | Zuständige Stelle und Ausbilder: Aufgaben der Kammer, Eignung | Sehr oft | 6 von 8 | 71 % | 4–7 | 2021W, 2022S, 2022W, 2023S, 2023W, 2025W |  |
| WISO-1-3-4 | Arbeitszeit und Jugendarbeitsschutz | Sehr oft | 5 von 8 | 68 % | 3–7 | 2022S, 2023S, 2023W, 2025S, 2025W |  |
| WISO-2-2-4 | Kaufmann, Firma und Handelsregister | Sehr oft | 5 von 8 | 68 % | 3–7 | 2022W, 2023W, 2024S, 2025S, 2025W |  |
| WISO-2-2-5 | Leitungssysteme: Stabliniensystem und Spartenorganisation | Sehr oft | 5 von 8 | 61 % | 3–7 | 2021W, 2022S, 2023W, 2024S, 2025W |  |
| WISO-3-1-1 | Arbeitsschutzvorschriften im Überblick und Unterweisung | Sehr oft | 5 von 8 | 61 % | 3–7 | 2021W, 2022S, 2023W, 2024S, 2025S |  |
| WISO-1-1-3 | Ende der Ausbildung, Prüfung, Zeugnis und Weiterbeschäftigung | Sehr oft | 4 von 8 | 57 % | 3–6 | 2022S, 2024S, 2025S, 2025W |  |
| WISO-1-3-2 | Rechtsquellen zuordnen: welches Gesetz regelt was | Sehr oft | 4 von 8 | 57 % | 3–6 | 2021W, 2023S, 2025S, 2025W |  |
| WISO-1-4-3 | Jugend- und Auszubildendenvertretung | Sehr oft | 4 von 8 | 57 % | 3–6 | 2022S, 2022W, 2025S, 2025W |  |
| WISO-1-5-2 | Tarifverhandlung, Schlichtung und Arbeitskampf: Streik und Aussperrung | Sehr oft | 4 von 8 | 57 % | 3–6 | 2021W, 2023W, 2025S, 2025W |  |
| WISO-2-2-3 | Gewinnverteilung in der GmbH berechnen | Sehr oft | 4 von 8 | 57 % | 3–6 | 2022S, 2024S, 2025S, 2025W |  |
| WISO-4-1-3 | Umweltzeichen: Blauer Engel und andere Kennzeichnungen | Sehr oft | 4 von 8 | 57 % | 3–6 | 2021W, 2023S, 2025S, 2025W |  |
| WISO-1-6-2 | Sozialversicherung: Zweige, Träger, Finanzierung, Leistungen | Sehr oft | 5 von 8 | 54 % | 2–6 | 2021W, 2022S, 2022W, 2023S, 2024S |  |
| WISO-2-4-1 | Produktivität, Wirtschaftlichkeit und Rentabilität berechnen | Sehr oft | 5 von 8 | 54 % | 2–6 | 2022S, 2022W, 2023S, 2023W, 2024S |  |
| WISO-1-4-2 | Zusammenarbeit von Arbeitgeber und Betriebsrat: Betriebsvereinbarung, Betriebsversammlung, Einigungsstelle | Sehr oft | 4 von 8 | 50 % | 2–6 | 2021W, 2023S, 2024S, 2025S |  |
| WISO-2-1-1 | Der Betrieb: Branche, Wirtschaftssektoren, erwerbswirtschaftliche Betriebe, Produktpalette und Märkte | Sehr oft | 4 von 8 | 50 % | 2–6 | 2022S, 2023S, 2024S, 2025S |  |
| WISO-2-5-1 | Wirtschaftliche Verflechtungen: Konzern, Kartell, Fusion | Sehr oft | 4 von 8 | 50 % | 2–6 | 2022S, 2023W, 2024S, 2025W |  |
| WISO-3-3-1 | Sicherheitszeichen, Flucht- und Rettungswege, Notausgänge und Sammelplätze | Sehr oft | 4 von 8 | 50 % | 2–6 | 2022S, 2022W, 2024S, 2025S |  |
| WISO-4-1-2 | Nachhaltigkeit: Einkauf und Lieferantenauswahl, Auswirkungen auf Umwelt, Pflanzen, Tiere und Lebensräume | Sehr oft | 4 von 8 | 50 % | 2–6 | 2021W, 2023W, 2024S, 2025S |  |
| WISO-2-1-4 | Konjunktur: Phasen, Merkmale und Maßnahmen | Sehr oft | 3 von 8 | 46 % | 2–6 | 2023S, 2025S, 2025W |  |
| WISO-1-5-1 | Tarifvertrag: Arten, Tarifautonomie, Tarifbindung, Geltungsbereich, Laufzeit | Sehr oft | 4 von 8 | 43 % | 2–5 | 2021W, 2022S, 2023W, 2024S |  |
| WISO-1-8-4 | Existenzgründung: Möglichkeiten und Grenzen | Sehr oft | 4 von 8 | 43 % | 2–5 | 2022W, 2023S, 2023W, 2024S |  |
| WISO-1-6-3 | Sozialversicherungsbeiträge berechnen | Oft | 3 von 8 | 39 % | 1–5 | 2023S, 2023W, 2025W |  |
| WISO-1-8-1 | Lebensbegleitendes Lernen, Fortbildung und Umschulung, staatliche Förderung | Oft | 3 von 8 | 39 % | 1–5 | 2022W, 2023S, 2025W |  |
| WISO-3-1-2 | Sicherheitsbeauftragte, Fachkraft für Arbeitssicherheit, Ersthelfer und Fürsorgepflicht | Oft | 3 von 8 | 39 % | 1–5 | 2021W, 2023W, 2025S |  |
| WISO-4-2-3 | Immissionsschutz, Verursacherprinzip und Rechtsfolgen | Oft | 3 von 8 | 39 % | 1–5 | 2022S, 2024S, 2025W |  |
| WISO-1-1-1 | Ausbildungsvertrag: Abschluss, Vertragspartner, Mindestinhalte, nichtige Vereinbarungen | Oft | 2 von 8 | 36 % | 1–5 | 2025S, 2025W |  |
| WISO-2-4-2 | Zielbeziehungen: Zielkonflikt, Zielharmonie, Zielneutralität | Oft | 2 von 8 | 36 % | 1–5 | 2025S, 2025W |  |
| WISO-1-3-1 | Individual- und Kollektivarbeitsrecht; Rechte und Pflichten im Arbeitsverhältnis | Oft | 3 von 8 | 32 % | 1–5 | 2021W, 2022S, 2022W |  |
| WISO-1-6-1 | Entgeltabrechnung: Lohn- und Gehaltsformen, Brutto und Netto, Lohn- und Kirchensteuer, vermögenswirksame Leistungen | Oft | 3 von 8 | 32 % | 1–5 | 2021W, 2023S, 2023W |  |
| WISO-3-1-3 | Gesetzliche Unfallversicherung: versicherte Personen und Fälle, Leistungen | Oft | 3 von 8 | 32 % | 1–5 | 2022W, 2023W, 2024S |  |
| WISO-3-4-4 | Verhalten im Brandfall und Brandschutzmittel: Brandmeldung, Feuerlöscher, Löschdecken, Brandklassen | Oft | 3 von 8 | 32 % | 1–5 | 2022S, 2022W, 2024S |  |
| WISO-1-1-4 | Rechte und Pflichten von Auszubildenden und Ausbildenden | Oft | 2 von 8 | 29 % | 1–4 | 2021W, 2025W |  |
| WISO-1-2-2 | Ausbildungsordnung, Ausbildungsrahmenplan, Rahmenlehrplan und betrieblicher Ausbildungsplan | Oft | 2 von 8 | 29 % | 1–4 | 2021W, 2025S |  |
| WISO-2-1-2 | Betriebliche und gesamtwirtschaftliche Arbeitsteilung, Globalisierung | Oft | 2 von 8 | 29 % | 1–4 | 2022S, 2025W |  |
| WISO-4-1-1 | Umweltrisiken von IT-Prozessen; Speicher- und Printmedien und Betriebsstoffe sparsam einsetzen | Oft | 2 von 8 | 29 % | 1–4 | 2021W, 2025S |  |
| WISO-1-5-3 | Gewerkschaften, Arbeitgeberverbände, Kammern und Wirtschaftsverbände | Manchmal | 2 von 8 | 21 % | 1–4 | 2022W, 2023S |  |
| WISO-1-8-3 | Lernen und Arbeiten in Europa: Europass, Mobilitätsprogramme, Auslandsaufenthalte, Europäische Sozialcharta | Manchmal | 2 von 8 | 21 % | 1–4 | 2021W, 2022S |  |
| WISO-3-4-2 | Arbeitsunfall melden | Manchmal | 2 von 8 | 21 % | 1–4 | 2022W, 2023S |  |
| WISO-4-2-1 | Abfall vermeiden, verringern, trennen und verwerten; IT-typische Abfälle erfassen, lagern und entsorgen | Manchmal | 2 von 8 | 21 % | 1–4 | 2022S, 2023S |  |
| WISO-4-2-2 | Verpackungen: Duales System, Teilnahmepflicht und Grundsätze | Manchmal | 2 von 8 | 21 % | 1–4 | 2022S, 2023S |  |
| WISO-5-3-2 | Compliance im Arbeitsalltag: allgemeine und betriebliche Regelungen einhalten | Manchmal | 2 von 8 | 21 % | 1–4 | 2021W, 2023S |  |
| WISO-2-1-3 | Soziale Marktwirtschaft: Merkmale, Möglichkeiten und Grenzen | Manchmal | 1 von 8 | 18 % | 0–4 | 2025W |  |
| WISO-2-4-3 | Ökonomisches Prinzip: Maximalprinzip und Minimalprinzip | Manchmal | 1 von 8 | 18 % | 0–4 | 2025S |  |
| WISO-1-7-2 | Arbeitstechniken: Zeitmanagement, Moderation, Planung, lernförderlicher Arbeitsplatz | Selten | 1 von 8 | 11 % | 0–3 | 2022W |  |
| WISO-2-2-1 | Einzelunternehmen, GbR und Personengesellschaften: OHG, KG, GmbH & Co. KG | Selten | 1 von 8 | 11 % | 0–3 | 2023S |  |
| WISO-3-4-1 | Verhalten bei Unfällen: Erste Hilfe, Notruf, Meldekette, Evakuierung und Dokumentation | Selten | 1 von 8 | 11 % | 0–3 | 2021W |  |
| WISO-5-2-1 | Sicherheitsbewusstsein, Social Engineering und IT-Sicherheit am Arbeitsplatz | Selten | 1 von 8 | 11 % | 0–3 | 2021W |  |
| WISO-5-3-1 | Diversity, Gender-Neutralität und ethische Verantwortung für IT-Lösungen | Selten | 1 von 8 | 11 % | 0–3 | 2022S |  |
| WISO-1-2-1 | Duales System: Lernorte, Zusammenwirken, Berufsschulpflicht | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-1-7-1 | Lerntechniken: visuell, auditiv, kommunikativ, motorisch | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-1-7-3 | Digitale Lernmedien: Internet, Apps, Plattformen, CBT, WBT | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-1-8-2 | Persönliche Weiterbildung, Kompetenzentwicklung und Karriereplanung | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-2-2-6 | Arbeitsabläufe und Aufgabenteilung: Ablauforganisation, Stelle und Abteilung | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-2-5-2 | Branchenorganisation, Wirtschaftsorganisationen, berufsständische Vertretungen und Ehrenamt | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-2-5-3 | Behörden und Verwaltungen: Ziele und Aufgaben | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-3-2-1 | Gefährdungsarten: mechanisch, elektrisch, thermisch, chemisch, ergonomisch, akustisch, psychisch | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-3-2-2 | Bildschirmarbeit, Vorsorgeuntersuchungen und psychische Belastung | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-3-2-3 | Gefährdungen einschätzen und Schutzmaßnahmen ableiten | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-3-3-2 | Elektrische Betriebsmittel: Schutzarten (IP-Code), Schutzklassen und Prüfzeichen wie das CE-Zeichen | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-3-3-3 | Verhaltensregeln und sachgerechter Umgang mit Gefahrenpotenzialen | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-3-4-3 | Vorbeugender Brandschutz: Brandursachen und Brandschutzordnung | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-5-2-2 | Dienstlich kommunizieren: E-Mail, Netiquette, Empfängersicht, Adressatenlisten und Zuständigkeiten | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-5-2-4 | Social Media und virtuelle Räume: Gefahren, Äußerungen über den Arbeitgeber, Kommunikation ohne direkten Kontakt | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
| WISO-5-3-3 | Wertschätzende Zusammenarbeit: interdisziplinär, interkulturell, gemeinsame Verantwortung, Unternehmenswerte und Ethikregeln | Bisher nicht | 0 von 8 | 0 % | 0–2 | – |  |
