# WISO-2 Karten – Aufbau und Organisation des Ausbildungsbetriebes

Stand: 16.10.2026 · Vorgehen nach `umbau/auftraege/WISO-karten.md` · Ergebnis `umbau/karten/wiso/WISO-2.json`, Kurzfassung `umbau/kurz/wiso/WISO-2.json`

**WISO-2 Karten: 94 bleiben, 7 bearbeitet, 5 entfernt, 41 neu; Teaser 16, Erklärungen 69**

## Zahlen

| Entscheidung | Karten |
|---|---|
| bleibt | 94 |
| bearbeitet | 7 |
| entfernt | 5 |
| neu | 41 |
| **alte Karten im Protokoll (Zielordner WISO-2)** | **106** |
| **Karten danach** | **142** |

- Dazu kommen 11 alte Karten an gestrichenen Aussagen (WISO-2-1-1-K6, -2-2-3-K4, -2-3-1-K2, -2-3-1-K5, -2-3-2-K5, -2-4-2-K1, -2-4-2-K2, -2-5-2-K1, -2-5-2-K2). Sie entfallen und stehen nur unter `alt_gestrichen`, nicht im Protokoll (Regel 6).
- Nicht entschieden, weil der Zielordner WISO-1 ist: WISO-2-5-2-K5-1/-2 (→ WISO-1-5-3-K5) und die 8 Karten WISO-2-5-4-* (→ WISO-1-3/-4).
- Können-Aussagen: 69. Mit Karte: 69. In `nicht_abgefragt`: 0. Unsicher: 2.
- Die Karten ohne Aussage (`X1`) haben eine Aussage bekommen: WISO-2-2-1-X1 → K7 (Geschäftsführung GbR/OHG), WISO-2-5-1-X1 → K1 (Selbstständigkeit der Verbindungsformen). Der Text ist unverändert.
- Innerhalb des Ordners an eine andere Aussage gehängt als in `alt_neu` (ID bleibt): WISO-2-2-2-K3-2 (Rechtsformzusatz der Firma) → WISO-2-2-4-K4 und WISO-2-2-2-K4-2 (GmbH entsteht erst mit der Eintragung) → WISO-2-2-4-K2 statt K1.

## Auffälligkeiten

- **Entfernt** (5): Einliniensystem und Matrix am Organigramm erkennen sowie Vor- und Nachteil des Einliniensystems, weil das in AP1-2-4-2 steht (E2). Außerdem zwei doppelte Karten: die Definition der betrieblichen Arbeitsteilung und das Mindeststammkapital als eigene Karte.
- **Bearbeitet** (7):
  - Sektoren: Software und Geräte herstellen zählt zum sekundären Sektor.
  - Die alte Karte „Praxissoft GmbH“ war nach der IHK-Lösung falsch: Dort stand tertiär statt sekundär.
  - Risiken der Globalisierung: Sozial- und Umweltstandards ergänzt.
  - Aufgabenteilung: Fachbegriffe Verrichtung und Objekt ergänzt.
  - Produktivität: kann auch wertmäßig sein, deshalb die alte Karte „nur Mengen“ zur Unterscheidungskarte Produktivität gegen Wirtschaftlichkeit umgebaut.
  - Kartell: erlaubte Normen- und Typenabsprachen ergänzt, keine Anmeldepflicht mehr (Rechtsstand seit 2005).
- **Neu** (41): Karten für die neuen Stichpunkte Konjunktur (WISO-2-1-4), Kaufmann/Handelsregister (WISO-2-2-4) und ökonomisches Prinzip (WISO-2-4-3) sowie für die eG und die Rechtsformwahl. Dazu kleine Rechenfälle für alle Aussagen der Stufe 3 (Gewinnanteil, Produktivität mit Veränderung in Prozent, Wirtschaftlichkeitsvergleich, drei Rentabilitäten). Die übrigen neuen Karten sind Unterscheidungskarten zu den typischen Verwechslungen aus den Aussagen, zum Beispiel:
  - Leitzins: EZB, nicht der Staat
  - GmbH: Privatrecht, nicht öffentliches Recht
  - eG: Genossenschaftsregister
  - Gewerbeamt gegen Gewerbeaufsicht
  - Bitkom ist kein Tarifpartner
  - Stagnation gegen Rezession
  - Fall, in dem weder Maximal- noch Minimalprinzip vorliegt
- Vier Aussagen haben 4 Karten (WISO-2-1-1-K2, -2-1-2-K2, -2-1-4-K4, -2-2-5-K4). Das liegt knapp über der Richtzahl „etwa drei“, weil die alten Karten passten und verschiedene Fälle abdecken.
- Beträge mit dauerhafter gesetzlicher Grundlage werden gelernt: GmbH 25.000 € und 12.500 €, AG 50.000 €, eG mit drei Mitgliedern. Jährlich wechselnde Werte kommen nicht vor (B4). Alle Zahlen in den Rechenfällen sind selbst ausgedacht, nichts ist aus den Abschriften übernommen (E10).
- Kurzfassung: Formeln stehen als Text, nicht als `Code`. Die einzige Aussage mit `neu` (WISO-2-2-5-K4) beginnt mit dem Bezug auf AP1-2-4-2.

## Unsichere Stellen

- **WISO-2-1-1-K4-1 / K1:** Softwareentwicklung gilt als sekundärer Sektor. Das folgt der IHK-Lösung 2022S-WISO-A17 („erstellt Sicherheits-Software“ = sekundär) und der Aussage K1. Die amtliche Wirtschaftszweig-Statistik zählt Softwareentwicklung dagegen zu den Dienstleistungen.
- **WISO-2-5-2-K3-3:** Bitkom als Wirtschaftsverband ohne Tarifverträge entspricht der Aussage. Ob ein IT-Betrieb über einen anderen Verband tarifgebunden ist, hängt vom Einzelfall ab.

## Prüfung

`node --test tests/vorschau-ap1.test.mjs`: 79 bestanden, 0 fehlgeschlagen. Grün sind auch die Tests „WISO: Teaser und Erklärungen vollständig“ und „WISO-2: jede Aussage hat eine Karte …“.
