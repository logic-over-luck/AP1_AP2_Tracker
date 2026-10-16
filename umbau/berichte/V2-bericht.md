# Bericht Regelwerk v2.0/v2.1 – Lehrbuch als Tiefe (Branch `regelwerk-v2`)

Auftrag des Projektinhabers vom 16.10.2026 (D1–D11), nachgeschärft nach dem Überblick zu Schritt 2 (RK1–RK6, Regelwerk v2.1). Dieser Bericht ist die Fortsetzungsstelle: Eine Folgesitzung liest ihn und macht beim nächsten offenen Schritt weiter.

## Stand

| Schritt | Stand |
|---|---|
| 1 Regelwerk v2.0 | ✓ (Commit „V2 Schritt 1“) |
| 2 Kernpunkt-Listen | ✓ 298 Kapitel, Gegenprüfung je Abschnitt, Regel K v2.1 angewandt |
| 3 Räume erweitern | offen – beginnt jetzt |
| 4 Karten und Erklärungen | wird je Ordner zusammen mit Schritt 3 gebaut (die Tests verlangen zu jeder Aussage Karte und Erklärung) |
| 5 App | teilweise vorgezogen (Marke „Buch“, Lernprompt D10, Wichtigkeit D7); Build und Browser-Check offen |
| 6 Unabhängige Prüfung | Auftrag `umbau/auftraege/V2-pruefung.md` liegt vor |
| 7 Abschluss | offen |

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

