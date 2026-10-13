# Nachprüfung AP1-6 (P16, K1–K3, Regelwerk v1.3)

Unabhängige Prüfung der geänderten Stichpunkte, 13.10.2026. Grundlage: Können-Aussagen, Grenzen, Kür und
Teilaufgaben im Lernplan, Katalogwortlaut, Abschriften mit Musterlösung. Bau- und Prüfberichte sowie
`meta.kerntest` wurden vor Abschluss der Funde nicht gelesen.

## Funde

| Stichpunkt | Art | Was fehlt oder falsch ist | Vorschlag |
|---|---|---|---|
| AP1-6-2-3 | K2 | K4 hat zwei nebengeordnete Operatoren („erkennen“, Stufe 1, und „erklären“, Stufe 2), F1 verlangt genau einen. | „Du kannst erklären, woran man eine verbindungslokale Adresse (fe80::) erkennt und warum sie ohne Konfiguration automatisch entsteht.“ (erklären, Stufe 2) |

## Ohne Befund

- AP1-6-1-2 ohne Befund (2025F-A4-eb auch in AP1-7-3-1)
- AP1-6-1-4 ohne Befund (2026H nicht amtlich; 2026H-A2-cc auch in AP1-3-2-2, 2026H-A4-a auch in AP1-4-1-1, 2025F-A1-c auch in AP1-4-1-4)
- AP1-6-2-2 ohne Befund (2025H-A3-f und 2026F-A2-a ohne Musterlösung, nachgerechnet: 172.16.10.254 / 255.255.255.0 / Gateway 172.16.10.1; /25 → 255.255.255.128, 126 Hosts, 192.168.16.0, 192.168.16.127; Gateway-Eintrag in 2025H-A3-f auch in AP1-6-2-1)
- AP1-6-2-4 ohne Befund (2022F-A3-fc auch in AP1-6-3-2)
- AP1-6-2-5 ohne Befund (2026F-A2-d ohne Musterlösung)
- AP1-6-3-1 ohne Befund
- AP1-6-3-2 ohne Befund (2026F-A2-b, 2026F-A3-db ohne Musterlösung, 2026H-A2-cd nicht amtlich; OSI-Schichten in 2022F-A3-d und 2026H-A2-cd deckt AP1-6-1-1)

**Summe:** 8 Stichpunkte geprüft, 1 Fund (K1 0, K2 1, K3 0), 7 ohne Befund.

## Abgleich mit `AP1-6-pruefer.md`

| Alter Fund | Stand |
|---|---|
| AP1-6-1-2 K1: serielle Verbindung in 2025F-A4-eb | behoben (in K3 ergänzt) |
| AP1-6-1-2 K2: K2 Herkunft nur Stufe-1-Beleg | behoben (`katalog:AP1.03.02.5` ergänzt) |
| AP1-6-1-2 K2: K4 „eintragen“ als Formoperator | behoben (jetzt „angeben“, Stufe 1) |
| AP1-6-1-4 K2: K4 „in Zusammenhang bringen“ | behoben (jetzt „erklären“) |
| AP1-6-1-4 K2: K2 Herkunft nur Stufe-1-Beleg | behoben (`katalog:AP1.03.03.1` ergänzt) |
| AP1-6-2-2 K2: K5 „umrechnen“ | behoben (jetzt „bestimmen“) |
| AP1-6-2-3 K2: K1 „sagen“, K2 „ausschreiben … kürzen“ | behoben (jetzt „nennen“ bzw. „darstellen“) |
| AP1-6-2-3 K2: K2, K3 Herkunft ohne Stufe 3 | behoben (`katalog:AP1.04.01.3` ergänzt) |
| AP1-6-2-4 K2: K7 „sagen“ | behoben (jetzt „nennen“) |
| AP1-6-2-5 K2: K2 Herkunft nur Stufe-1-Beleg | behoben (`katalog:ZB.ipv6-subnetting` ergänzt) |
| AP1-6-2-5 K2: K6 „hinschreiben“ | behoben (jetzt „bestimmen“) |
| AP1-6-3-1 K2: K1, K2, K7 Herkunft nur Stufe-1-Beleg | behoben (`katalog:AP1.04.05.5` ergänzt) |
| AP1-6-3-2 K1: ping-Ausgabe deuten (2026F-A3-db) | behoben (in K4 ergänzt: Paketverlust, hohe und schwankende Antwortzeiten) |
| AP1-6-3-2 K2: K5 „deuten“ | behoben (jetzt „interpretieren“) |
| AP1-6-3-2 K2: K7 „angeben“ mit Stufe 3 | behoben (jetzt Stufe 1) |

**Abgleich:** 15 alte Funde, 15 behoben, 0 nicht behoben.

## Nachtrag 14.10.2026 – Umsetzung nach Regelwerk v1.4

- AP1-6-2-3: K4 nur noch „erklären“ (deckt 2022F-A3-eb und 2022H-A3-f).

Alle Ordner- und Raum-Prüfungen danach grün.
