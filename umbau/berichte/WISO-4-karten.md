# WISO-4 Karten – Umweltschutz

Stand: 16.10.2026 · Vorgehen nach `umbau/auftraege/WISO-karten.md` · Ergebnis `umbau/karten/wiso/WISO-4.json`, Kurzfassung `umbau/kurz/wiso/WISO-4.json`

**WISO-4 Karten: 27 bleiben, 9 bearbeitet, 6 entfernt, 16 neu** (dazu 6 Karten gestrichener Aussagen) · Teaser 6, Erklärungen 25

## Zahlen

| Entscheidung | Karten |
|---|---|
| bleibt | 27 |
| bearbeitet | 9 |
| entfernt | 6 |
| neu | 16 |
| Karten gestrichener Aussagen (`alt_gestrichen`) | 6 |
| **alte Karten (Zielordner WISO-4)** | **48** |
| **Karten danach** | **52** |

Können-Aussagen: 25; mit Karte: 25; in `nicht_abgefragt`: 0. Je Aussage 1 bis 3 Karten.
Vorher ohne passende Karte: WISO-4-1-3-K3 (Recycling-Symbol, Fairtrade), WISO-4-1-3-K4 (Recyclingpapier), WISO-4-2-2-K3 (Verpackungsgrundsätze), dazu fehlten Karten zu den Distraktoren in WISO-4-1-2-K2, WISO-4-2-3-K2 und WISO-4-2-3-K3.

## Auffälligkeiten

- **Gestrichene Aussagen im Protokoll:** Die 6 Karten der gestrichenen Aussagen WISO-4-1-1-K2, WISO-4-1-2-K5 und WISO-4-1-2-K6 stehen wie verlangt in `alt_gestrichen`, zusätzlich aber als „entfernt“ im `protokoll`. Grund: Der Test „Neue Lernkarten WISO“ ordnet Karten gestrichener Aussagen dem Ordner ihres alten Stichpunkts zu und verlangt sie dort im Protokoll (anders als bei PB2). Die Zählung der Vorschau zeigt deshalb 12 „entfernt“.
- **Verschobene Stichpunkte:** Die alten Karten von WISO-4-3-2 (Blauer Engel) hängen jetzt an WISO-4-1-3, die von WISO-4-3-1 an WISO-4-2-2 und WISO-4-2-3; IDs bleiben.
- **Innerhalb des Ordners an eine andere Aussage gehängt (ID bleibt):** WISO-4-2-1-X1 (Karte zum ganzen Stichpunkt, fünf Stufen § 6 KrWG) → WISO-4-2-1-K1; WISO-4-2-1-K2-2 (Abfallgruppen im IT-Büro) → WISO-4-2-1-K4; WISO-4-3-1-K1-2 (Teilnahmepflicht) → WISO-4-2-2-K4 statt K1.
- **Entfernt:** die vierstufige Abfall-Rangfolge (WISO-4-2-1-K1-1, überholt durch § 6 KrWG), das CE-Zeichen (steht in WISO-3-3-2), Blauer Engel und EU-Energielabel (Energielabel in AP1-4-3-3), eine doppelte Auswahlkarte zum Blauen Engel, eine zu allgemeine Entsorgungskarte und eine in eine Unterscheidungskarte aufgegangene Faktenkarte (Roh-/Hilfsstoff).
- **Bearbeitet:** vor allem Rechtsstand und Distraktoren nach der Prüfung: Entsorgung gewerblicher Altgeräte (kein Wertstoffhof), Duales System (privatwirtschaftlich, mehrere Betreiber), Teilnahmepflicht (als Erster in Verkehr bringen, Verpackungsregister), Folgen von Verstößen (Stilllegung, Beseitigungspflicht), Blauer Engel „bedeutet nicht …“ ohne „Preis“. Die Antwort zu WISO-4-1-2-K2-1 begründete mit Kosten über die Nutzungsdauer (gestrichene Aussage) und begründet jetzt über Ressourcen.
- **Neue Karten** sind überwiegend Unterscheidungskarten zu den WiSo-Fallen („nicht …, sondern …“): Rohöl bleibt endlich, Herkunft allein macht nicht nachhaltig, Recycling-Symbol ist kein Umweltzeichen, Recyclingpapier senkt nicht den eigenen Verbrauch, höherer Schornstein statt Vermeiden, Sicherheitsbeauftragte nicht zuständig, Duales System nicht kommunal.
- Keine jährlich wechselnden Werte; keine Normen oder Sicherheitsstufen der Datenträgervernichtung und keine Inhalte der TA Lärm/TA Luft (Grenzen beachtet).

## Unsicher

- **WISO-4-1-2-K4-2:** Wasserverbrauch beim Lithiumabbau als Beispiel für Folgen des Rohstoffabbaus – allgemein bekannt, aber nicht für alle Rohstoffe gleich.
- **WISO-4-3-1-K1-1:** „private Endverbraucher (Haushalte und vergleichbare Stellen wie Büros)“ aus der Aussage übernommen; die Abgrenzung zu gewerblichen Verpackungen wird nicht abgefragt.
- **WISO-4-2-3-K2-1:** Notstromaggregat mit Schornstein als Beispiel; der Kern (Verteilen ist kein Vermeiden) hängt nicht davon ab.

**Nachtrag Hauptbearbeiter:** Die Abweichung (Karten gestrichener Aussagen zusätzlich als „entfernt“ im Protokoll) ist
behoben: Der Test in `tests/vorschau-ap1.test.mjs` ordnete solche Karten bei WiSo (gleiche ID-Präfixe alt/neu) fälschlich
einem Ordner zu. Er verlangt sie jetzt nur in `alt_gestrichen`; die sechs Doppeleinträge sind aus dem Protokoll entfernt
(Protokoll 64 → 58).
