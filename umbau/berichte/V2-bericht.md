# Bericht Regelwerk v2.0–v2.2 – Lehrbuch als Tiefe (Branch `regelwerk-v2`)

Auftrag des Projektinhabers vom 16.10.2026 (D1–D11), nachgeschärft nach dem Überblick zu Schritt 2 (RK1–RK6, Regelwerk v2.1). Dieser Bericht ist die Fortsetzungsstelle: Eine Folgesitzung liest ihn und macht beim nächsten offenen Schritt weiter.

## Stand

| Schritt | Stand |
|---|---|
| 1 Regelwerk v2.0 | ✓ (Commit „V2 Schritt 1“) |
| 2 Kernpunkt-Listen | ✓ 298 Kapitel, Gegenprüfung je Abschnitt, Regel K v2.1 angewandt |
| 3 Räume erweitern | ✓ alle 37 Ordner (AP1 8, PB1 12, PB2 6, WISO 5), je Ordner Commit; T10: kein Kernpunkt offen |
| 4 Karten und Erklärungen | ✓ je Ordner zusammen mit Schritt 3 (jede neue Aussage mit `kurz`, Erklärung und Karte) |
| 5 App | ✓ Build, Browser-Check aller vier Räume auf 1400 px und 390 px |
| 6 Unabhängige Prüfung | ✓ sechs Prüfer, 173 Funde, umgesetzt; Berichte `V2-<Raum>-pruefer.md` |
| 7 Abschluss | ✓ UMBAU.md (Checkliste, Parkplatz P57–P71), dieser Bericht |

**Wichtig für eine Folgesitzung:** Die Kernpunkt-Listen liegen nur lokal unter `quellen/lehrbuch/kern/` (D9). Im Repo stehen davon nur Kapitelnummern, Seiten, Stichpunkt-Zuordnung und Zählungen (`umbau/zuordnung/buch.json`). Geht der lokale Stand verloren, müssen die Listen mit `quellen.zip` neu erzeugt werden (Auftrag und Werkzeuge siehe „Vorgehen Schritt 2“).

## Schritt 1 – Regelwerk v2.0

- UMBAU.md Abschnitt 4.0 (D1–D10), alte Fassung als „bis v1.8“ darunter; E5, G3, F2, F3 mit Verweis angepasst; T10, K4, K5 in Abschnitt 5.
- `umbau/regeln/regelwerk.json` Version 2.0 → 2.1 mit Abschnitt `buch` (Regel K, Herkunftsformat `buch:<GS|FS|FS2>-<Kapitel>[-S<Seite>]`, Band-Kürzel, Lernfelder, Filter-Gründe, Form F3 3–10 / F4 3–8, Schärfung RK1–RK6).
- `tools/umbau/lernplan-pruefen.mjs`: Herkunft `buch:` (Format), F3 und F4 aus dem Regelwerk, Kür-Quelle `buch:` (Format).
- Neu: `tools/umbau/buch-pruefen.mjs` (T10, mit `--anlegen`/`--schreiben`), `tools/umbau/buch-wortlaut.mjs` (K5 maschinell: gleiche Wortfolgen gegen den OCR-Text), `tools/umbau/v2-einbauen.mjs` (Einbau eines Ordner-Patches: Aussagen, Stichpunkte, Blöcke, Kür, D6, Grenzen, Karten, Erklärungen, Kernpunkt-Status).
- Tests in `tests/umbau-fundament.test.mjs` (Regelwerk, Herkunft, F3, T10 mit Beispiel-Zuordnung und 8 Fehlerfällen).

## Schritt 2 – Kernpunkt-Listen

Vorgehen: Kapitelliste aus dem OCR-Inhaltsverzeichnis (FS-Seite 7 ohne Seitenzahlen → Seiten aus dem Fließtext), 298 Blatt-Kapitel (GS 150, FS 92, FS2 56) mit Seitenbereich (Einleitung eines Oberkapitels beim ersten Unterkapitel). 19 Subagenten je Buchabschnitt (Auftrag: Regel K, Wohnort-Regel E2, Urteil aussage/neu/filter, eigene Stichworte), je Abschnitt (GS LF1–2, GS LF3–5, FS LF6–7, FS LF8–9, FS2) ein Prüf-Subagent nur mit Regel K und Liste, Stichprobe 5 Kapitel am Text; Funde eingebaut (Prüfberichte lokal).

| Abschnitt | Funde | umgesetzt |
|---|---|---|
| GS LF1–2 | 74 (u. a. 27 „nicht im Buch“, 3 wörtlich) | 73, 1 teilweise |
| GS LF3–5 | 83 (11 wörtlich, 52 Vorschläge mit mehreren Operatoren) | 83 |
| FS LF6–7 | 43 (11 wörtlich) | 42, 1 teilweise |
| FS LF8–9 | 57 (14 wörtlich, 9 Filter falsch, 6 fehlt) | 55, 1 teilweise, 1 abgelehnt |
| FS2 | 38 (3 wörtlich, 9 Filter falsch) | 38 |

Danach (Überblick an den Projektinhaber) Regel K v2.1: alle neuen Kernpunkte von 7 Subagenten nach RK1 (a Prinzip, b Kriterium, c Katalogbegriff; sonst Kür oder raus), RK2 (Oberbegriff trägt eine Ebene), RK3 (prio für die Obergrenze) und RK6 (Zuordnung) neu eingestuft: 662 Pflicht, 872 Kür, 44 raus, 33 umgehängt.

### Ergebnis je Band (Stand nach v2.1)

| Band | Kapitel | davon ganz gefiltert | Kernpunkte | abgedeckt | neu Pflicht | neu Kür | Filter |
|---|---|---|---|---|---|---|---|
| GS | 150 | 3 | 1472 | 538 | 377 | 384 | 173 |
| FS | 92 | 0 | 912 | 289 | 182 | 303 | 138 |
| FS2 | 56 | 1 | 488 | 122 | 103 | 185 | 78 |
| **Summe** | 298 | 4 | 2872 | 949 | 662 | 872 | 389 |

Ganz gefilterte Kapitel: GS 2.1.3 (uebung: nur Umfrage und Rechercheauftrag), GS 3.4.1 (ausgeschlossen: Netzwerktopologie laut Katalog nur FI DV/SI), GS 5.7.2 (bedienung: erstes Programm in einer IDE), FS2 3.3.3 (nicht_ae: Wettermodelle, LF10c).

Erwartung Schritt 3 mit Obergrenze (je Ordner min(Obergrenze RK3, eindeutige Pflicht-Kernpunkte × 0,7)): AP1 ≈ 214, PB1 ≈ 134, PB2 ≈ 18, WISO ≈ 42, zusammen ≈ 408 neue Pflicht-Aussagen. An der Obergrenze gekappt: AP1-4 (44), PB1-5 (13), PB1-8 (8), PB1-11 (17), PB1-12 (14). **RK3 ist danach entfallen** (Projektinhaber bei der Freigabe von Schritt 3): ohne Obergrenze Erwartung etwa 460 neue Pflicht-Aussagen.

### RK6 – umgehängte Zuordnungen

| Kernpunkt | vorher | nachher | Grund |
|---|---|---|---|
| FS2-4.1.2#5 | AP1-1-1-1 | AP1-2-4-2 | Matrixorganisation gehört zur Aufbauorganisation (AP1.07.04.1), nicht zu Projektmerkmalen/SMART |
| GS-5.4.1#1 | AP1-1-1-2 | PB1-1-1-2 | Spiralmodell wohnt im AP2-Katalog (AP2b.04.02.1), PB1-1-1-2 |
| FS2-3.1.3#3 | AP1-1-3-3 | WISO-5-3-1 | Ethik von IT-Lösungen steht im WiSo-Baustein WISO.05.03.3, nicht unter KI-Unterstützung |
| GS-2.6.2#1 | AP1-2-2-1 | AP1-4-1-1 | mobile und stationäre Arbeitsplatzsysteme stehen in AP1.04.02.2 (AP1-4-1-1) |
| GS-2.9.1#1 | AP1-3-2-2 | AP1-3-1-4 | Ablauf mit Bestellung, Lieferung, Rechnung gehört zu ZB.rechnung (AP1-3-1-4) |
| FS-1.1.1#4 | AP1-3-3-2 | AP1-3-3-3 | Gewährleistung gehört zu Mängeln/Vertragsstörungen (AP1.07.06.2, AP1.07.01.6) |
| GS-2.1.4#7 | AP1-3-4-1 | AP1-3-4-3 | Lizenzbindung gehört zu den Lizenzmodellen in AP1-3-4-3 (dort FS-1.1.4#20, #24) |
| GS-2.2.2#1 | AP1-4-1-1 | AP1-2-2-1 | Ist- und Soll-Zustand ist Teil der Bedarfsanalyse |
| GS-3.9.1#14 | AP1-4-1-5 | WISO-3-3-3 | Elektrische Arbeiten gehören zum Arbeitsschutz (Gefahrenpotenziale) |
| FS-1.1.2#1 | AP1-5-1-1 | AP1-1-3-1 | ITIL ist IT-Service-Management, gehört zu Support und Service, nicht zu Softwarearten |
| FS-1.1.3#3 | AP1-5-1-1 | AP1-1-3-1 | IT-Service-Management gehört zu Support und Service |
| FS-1.1.3#5 | AP1-5-1-1 | AP1-1-3-1 | IT-Service-Management gehört zu Support und Service |
| FS-1.1.3#6 | AP1-5-1-1 | AP1-1-3-1 | IT-Service-Management gehört zu Support und Service |
| FS-1.1.3#7 | AP1-5-1-1 | AP1-1-3-1 | IT-Service-Management gehört zu Support und Service |
| FS-1.1.3#12 | AP1-5-1-1 | AP1-1-3-1 | IT-Service-Management gehört zu Support und Service |
| FS-3.4.1#8 | AP1-8-4-3 | AP1-2-4-1 | Corporate Identity/Design ist Thema des Unternehmens (Leitbild, Erscheinungsbild), nicht der Maske; die Maske nutzt es nur (AP1-8-4-3-K3) |
| FS2-1.3.4#11 | AP1-8-4-3 | AP1-2-4-1 | Corporate Identity/Design gehört zu Kunde, Markt und Unternehmen; mit FS-3.4.1#8 zusammenführen |
| GS-5.4.2#11 | PB1-1-1-1 | PB1-3-2-2 | DevOps gehört zu Automatisierung/CI-CD, wo die übrigen DevOps-Kernpunkte stehen |
| FS-1.1.2#11 | PB1-1-2-1 | PB1-12-2-2 | Change im IT-Betrieb gehört zum Service-Management neben Incident Management |
| FS-1.2.2#14 | PB1-1-2-1 | PB1-12-2-2 | Change im IT-Betrieb gehört zum Service-Management neben Incident Management |
| FS-1.3.3#12 | PB1-1-2-1 | PB1-12-2-2 | Change im IT-Betrieb gehört zum Service-Management neben Incident Management |
| FS-4.3.5#3 | PB1-1-2-1 | AP1-4-3-3 | Energieeffizienz von IT-Systemen steht in AP1-4-3-3, nicht in der Projektmachbarkeit |
| FS-4.4.3#6 | PB1-1-2-1 | AP1-4-3-3 | Energieeffizienz von IT-Systemen steht in AP1-4-3-3 |
| FS-4.4.3#7 | PB1-1-2-1 | AP1-4-3-3 | Energieeffizienz von IT-Systemen steht in AP1-4-3-3 |
| FS-4.4.3#8 | PB1-1-2-1 | AP1-4-3-3 | Energieeffizienz von IT-Systemen steht in AP1-4-3-3 |
| FS2-2.1.4#1 | PB1-1-2-4 | PB1-5-1-3 | Clean-Code-Praktiken stehen bei den Entwurfsprinzipien (KISS, DRY, SRP) |
| FS2-2.1.4#2 | PB1-1-2-4 | PB1-5-1-3 | Refactoring steht bei den Entwurfsprinzipien (KISS, DRY, SRP) |
| GS-2.9.4#6 | PB1-2-1-1 | AP1-3-3-1 | Kaufvertrag und seine Arten stehen bei Kauf, Miete, Leasing in AP1 |
| FS-3.3.7#14 | PB1-10-1-1 | PB1-10-2-3 | Protokollierung gehört zum Baustein Log Management (AP2a.04.06.4) |
| GS-3.8.3#8 | PB1-11-1-1 | PB1-11-2-2 | DMZ gehört zu „Sicherheitskonzepte und -risiken“ (AP2b.01.03.10) in PB1-11-2-2, dort stehen FS-4.2.3#3 und Dubletten |
| GS-1.4.2#1 | WISO-2-1-1 | AP1-2-1-1 | Marktarten gehören zur Markteinordnung in AP1-2-1-1 (früherer Raum) |
| GS-1.3.3#4 | WISO-2-4-2 | AP1-2-4-1 | Unternehmensziele stehen zuerst in AP1-2-4-1 (Wohnort-Regel) |
| GS-1.3.3#5 | WISO-2-4-2 | AP1-2-4-1 | Unternehmensziele stehen zuerst in AP1-2-4-1 (Wohnort-Regel) |

### RK5 – OCR-Lücken (nicht geraten)

- GS 5.5.3 S. 524–525: Definitionen Top-down/Bottom-up fehlen im OCR (Grafik); der Kernpunkt ist über den Kompetenzcheck erschlossen und durch PB1-5-1-3-K1 abgedeckt.
- FS 3.4.1: Liste der Punkte zur Barrierefreiheit fehlt (Grafik); nur der Fließtext ist bewertet.
- FS 3.7.4 S. 278–279: Regelbox zu Unterabfragen fehlt.
- FS2 1.3.4 S. 48: Seite gehört inhaltlich zu 1.4, im Kapitel nicht ausgewertet.
- Das in P54 als fehlend gemeldete Kapitel FS 2.2.1 (IoT-Protokolle) ist vorhanden, behandelt aber nur Funktechniken.

### Buchfehler und veraltete Stände (RK5, Auswahl; je Kernpunkt als `hinweis` vermerkt)

Über 100 Stellen, z. B.: 2^64 als 512 GB; DDR3 als Standard; RAID 1 Lese-/Schreibverhalten vertauscht; 99,9 % Verfügbarkeit ≠ „knapp 8 h“; differenzielle Rücksicherung; DSGVO nur Deutschland; Proxy auf Schicht 3; DNS/DHCP auf Schicht 3; IMAP versendet; 802.11ad als Wi-Fi 6; Diffie-Hellman als Verschlüsselung; DNSSEC „abhörsicher“; § 64 BDSG als TOM-Grundlage für Unternehmen (gilt für Strafverfolgung; für Unternehmen Art. 32 DSGVO); WPA2 als aktuell; Git als zentral; MD5 „zurückgerechnet“; SHA-256 ohne Salt für Passwörter; ISO 9241-110 als „Verordnung“; MVC mit Logik im Controller; „Transaktion“ statt Transition; Liste mit geringem Speicherbedarf; MoPeG 2024 (Gewinnverteilung), Entgeltfortzahlung, BR-Größe, JAV-Altersgrenze; veraltet: TMG/TTDSG (seit 2024 DDG/TDDDG), NIS-2, KI-Verordnung, E-Rechnung-Zustimmung, Scrum-Teamgröße.

### Auffälligkeiten im Tracker (nicht geändert, D6; auf dem Parkplatz)

- AP1-3-4-1-K2 nennt die OEM-Lizenz „an das Gerät gebunden“; in Deutschland ist der Weiterverkauf auch ohne Gerät zulässig.
- PB1-3-1-3-K1 spricht vom „zentralen Repository“ (Git ist verteilt; zentral ist nur der gemeinsame Server-Stand).


## Schritt 3 – Räume erweitern (fertig)

Ablauf je Ordner: Bau-Subagent schreibt einen Patch (Auftrag lokal `scratchpad/v2/auftrag-bau.md`; offene Kernpunkte je
Ordner aus den lokalen Listen), Einbau mit `node tools/umbau/v2-einbauen.mjs <patch>`, danach `lernplan-pruefen`,
`raum-pruefen`, `export-raum` (Export neu, E4), `umzug-erzeugen`, alle Ordner aller Räume (T7/T8), `buch-pruefen --anlegen`
(T10), `buch-wortlaut` (K5), `npm test`; Commit und Push je Ordner. Karten und Erklärungen (Schritt 4) entstehen im selben
Patch, weil die Tests zu jeder Aussage Karte und Erklärung verlangen. Bisherige Kür-Einträge, deren Inhalt jetzt Pflicht ist,
werden gestrichen oder gekürzt (`tools/umbau/v2-kuer-zu-pflicht.mjs`, Protokoll in `meta.v2`).

| Ordner | neue Aussagen | neue Stichpunkte | D6 | Kür | Bemerkung |
|---|---|---|---|---|---|
| AP1-5 | 19 | 1 (Cloud Computing) | 4 | 15 | |
| AP1-8 | 39 | 2 (Variablen/Ausdrücke, Datenstrukturen) | 1 | 19 | Kür „Weitere Datenstrukturen“ jetzt Pflicht |
| AP1-2 | 22 | 0 | 2 | 27 | Corporate Identity/Design nach RK6 in AP1-2-4-1 (der Bau-Subagent wollte es zurück nach AP1-8-4-3; Entscheidung des Projektinhabers gilt) |
| AP1-1 | 19 | 0 | 8 | 29 | RK5-Hinweise (ITIL, KI-VO) |
| AP1-4 | 46 | 3 (Wie ein Computer arbeitet; Leistung von CPU und RAM; Zeichen und Zahlen binär kodieren) | 7 | 33 | Block AP1-4-1 mit 8 Stichpunkten |
| AP1-7 | 35 | 0 | 3 | 24 | RK5: Art. 32 DSGVO statt § 64 BDSG, NIS-2/BSIG, DDG/TDDDG |
| AP1-3 | 28 | 0 | 5 | 31 | |
| AP1-6 | 26 | 2 (Geräteauswahl, Testbefehle) | 4 | 17 | |
| **AP1** | **234** | **8** | **34** | **195** | 604 → 838 Aussagen; Raum-Prüfung, T10 für AP1, K5 grün |

K5-Treffer in AP1 (6 Wörter) sind Gesetzeswortlaut (Art. 5/32 DSGVO, § 38 BDSG – amtliche Werke) oder feste Fachbegriffe
(„Round Trip Time“, „Drei-Phasen-Modell nach Lewin“); echte Übernahmen (AP1-2-2-4-K6, AP1-1-5-1 Kür) umformuliert.

PB1, PB2 und WISO (nach v2.2, jede neue Aussage und Kür mit `kurz`; PB2 und WISO parallel zu PB1-11/-12 gebaut,
beim Einbau gegen das fertige PB1 auf Doppelungen geprüft – keine):

| Ordner | neue Aussagen | neue Stichpunkte | D6 | Kür |
|---|---|---|---|---|
| PB1-6 | 12 | 0 | 1 | 6 |
| PB1-9 | 16 | 0 | 3 | 11 |
| PB1-8 | 12 | Dialoggrundsätze an Beispielen | 4 | 13 |
| PB1-5 | 18 | Architekturmuster: Schichten, MVC, Ereignisse | 2 | 16 |
| PB1-10 | 14 | 0 | 1 | 8 |
| PB1-1 | 20 | 0 | 3 | 16 |
| PB1-3 | 15 | 0 | 2 | 25 |
| PB1-7 | 13 | REST und SOAP | 3 | 8 |
| PB1-2 | 7 | 0 | 1 | 3 |
| PB1-4 | 8 | 0 | 0 | 3 |
| PB1-11 | 32 | Firewall; Sicherheitskonzepte im Netz | 1 | 25 |
| PB1-12 | 32 | USV; RAID vertieft; Messdaten und Alarmierung; Hosting und Managed Services | 2 | 18 |
| **PB1** | **199** | **9** | **23** | **152** |
| PB2-1 … PB2-6 | 2 · 4 · 2 · 4 · 1 · 9 = **22** | 1 (SQL-Sprachteile, Spaltenoptionen, Index) | 3 | 19 |
| WISO-1 … WISO-5 | 36 · 18 · 4 · 1 · 0 = **59** | 0 | 2 | 37 |

Kür gekürzt oder gestrichen, wo ihr Inhalt jetzt Pflicht ist (u. a. BASE, Botnetze, Typisierung, Data Warehouse, WSDL,
UML-Diagramme, WEP/WPA, RAID 6/DAS, Cloud-Modelle). Kür in AP1, deren Inhalt in einem späteren Raum Pflicht wurde, bleibt als
Ausblick (AP1 eingefroren) – Liste auf dem Parkplatz (P68). Zwei Kernpunkte, die nach dem Bau ihres Ordners umgehängt wurden,
stehen als Quelle an bestehender Kür (GS-5.7.3 an AP1-8-2-1, FS2-1.4.3 an PB1-8-1-2; FS-4.1.2 SOI an der SOA-Kür PB1-5-1-6).

## Schritt 5 – App

Build `Lernstudio.html`; Browser-Check (`tools/browser-check.mjs`) für `#/ap1` `#/pb1` `#/pb2` `#/wiso` und das
Stichpunkt-Detail je Raum auf 1400 px und 390 px: keine Konsolenfehler, kein waagerechtes Scrollen, eine Zeile zugleich offen,
Marke „Buch“ an den neuen Aussagen, Kür eingeklappt.

## Schritt 6 – Unabhängige Prüfung

Sechs Prüfer ohne Kenntnis des Baus (AP1 und PB1 je in zwei Hälften), Auftrag `umbau/auftraege/V2-pruefung.md`; danach je Teil
ein Umsetzer mit festen Regeln (bestehende Aussagen nie ändern, Doppelungen per D6, Grundsatzfragen auf den Parkplatz).

| Raum | Funde | umgesetzt | teilweise | abgelehnt | Parkplatz |
|---|---|---|---|---|---|
| AP1 | 58 | 45 | 5 | 6 | 2 |
| PB1 | 67 | 46 | 14 | 4 | 3 |
| PB2 | 21 | 13 | 3 | 2 | 3 |
| WISO | 27 | 22 | 1 | 0 | 1 |

Häufigste Arten: Doppelungen (33, meist D6 an bestehende Aussage), Stufe/Operator (29, nach D5 an den Baustein angepasst),
Herkunft (22), Kür statt Pflicht und umgekehrt (22). Wörtliche Übernahmen: 2 Treffer bei 173 Funden; K5 entfällt seit
16.10.2026 als Prüfung (Projektinhaber, P71). Berichte mit Umsetzung: `umbau/berichte/V2-<Raum>-pruefer.md`.

## Ergebnis

| Raum | Stichpunkte | Aussagen vor v2 | Aussagen jetzt | davon mit Buch-Herkunft | Kür |
|---|---|---|---|---|---|
| AP1 | 124 | 604 | 842 | 264 | 257 |
| PB1 | 76 | 265 | 465 | 221 | 167 |
| PB2 | 22 | 93 | 117 | 27 | 19 |
| WISO | 70 | 325 | 388 | 67 | 49 |
| **gesamt** | **292** | **1.287** | **1.812** | **579** | **492** |

Offene Grundsatzfragen: UMBAU.md Parkplatz P58–P70 (entschieden: P57 Operator über Bausteinstufe, P68 AP1-Kür bleibt; offen: LF10c/RK4, G6, RK2-Tiefe, Rechtsstand,
mögliche Fehler in bestehenden Aussagen).

## Zwischenschritt v2.2: Stichwort `kurz` (16.10.2026, fertig)

Vorgabe des Projektinhabers vor PB1: Jede Können-Aussage und jeder Kür-Eintrag bekommt ein Stichwort `kurz`
(3–8 Wörter, höchstens 60 Zeichen, Substantivstil, beginnt nicht mit „Du“). Die App zeigt im Stichpunkt nur noch das
Stichwort und klappt beim Antippen Satz, Erklärung, Stufe und Herkunft auf. Eine kurz vorgesehene Grenze von
200 Zeichen für Buch-Aussagen ist gestrichen (P56).

| Raum | Aussagen mit `kurz` | Kür mit `kurz` |
|---|---|---|
| AP1 | 838 | 262 |
| PB1 | 265 | 17 |
| PB2 | 93 | 0 |
| WISO | 325 | 13 |
| **gesamt** | **1.521** | **292** |

- **Erzeugung:** Subagenten je Ordner (AP1 einzeln, PB1 in drei Gruppen, PB2, WISO), eigene Worte aus dem vollen Satz.
  Eingetragen mit `tools/umbau/kurz-einbauen.mjs`. Formfehler maschinell: 1 (9 Wörter, AP1-4-2-3-K3), korrigiert.
- **Gegenprüfung** (vier Prüfer, Eindeutigkeit im Stichpunkt, Thema, Stil): 69 Funde (56 verwechselbar, 2 falsches
  Thema, 11 Stil), alle übernommen. Darunter zwei sachliche Korrekturen: Arbeitsschutzausschuss und
  Sicherheitsbeauftragte „bei mehr als 20 Beschäftigten“ statt „ab 20“ (WISO-3-1-1-K2, WISO-3-1-2 Kür).
- **Nachtrag AP1:** Kernpunkt GS-2.7.4#3 (Rollout-Ablauf) war nach dem Einbau von AP1-2 dorthin umgehängt worden und
  stand noch auf `neu`. Er liegt jetzt als Kür am vorhandenen Eintrag „Planung eines Rollouts“ in AP1-2-5-3. T10 für
  AP1 ist wieder vollständig grün.
- **Anzeige:** Browser-Check auf 1400 px und 390 px ohne Konsolenfehler und ohne waagerechtes Scrollen. Immer nur eine
  Zeile offen, Kür zugeklappt. Auf dem Handy werden lange Stichworte im schmalen Detailbereich mit „…“ gekürzt;
  aufgeklappt stehen sie vollständig, die Marken stehen dort ebenfalls.
- **P56 erledigt:** Die 200-Zeichen-Regel entfällt ganz (Projektinhaber: der Satz ist ohnehin einklappbar).
- **Danach Pause vor PB1** (Projektinhaber).
