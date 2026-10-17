# Generatoren WISO (Stand der Abnahme, 16.10.2026)

> **Stillgelegt (P52):** WISO ist abgenommen und eingefroren (E3). `lpw.py` bricht beim Schreiben ab, damit niemand
> den Lernplan versehentlich überschreibt. Änderungen nur über den Parkplatz (UMBAU.md 8), dann direkt in
> `umbau/lernplan/wiso/WISO-<n>.json`, Ordner- und Raum-Prüfung, Export neu erzeugen
> (`node tools/umbau/export-raum.mjs WISO`).

Die Skripte bilden den Lernplan zum Zeitpunkt der Abnahme genau ab (gleiche Ausgabe wie die eingecheckten
Dateien) und bleiben als Nachweis, wie er entstanden ist.

- `lpw.py` – Bibliothek (`LPW`, `tb`, `sp`, `k`, `grenze`, `kuer`, `kuer_pruefer` für P49, `a` für alt_neu, `meta`).
- `wiso_1.py` … `wiso_5.py` – erzeugten `umbau/lernplan/wiso/WISO-<n>.json` (Aufruf im Repo-Wurzelverzeichnis).

Nur wenn der Projektinhaber den Raum ausdrücklich wieder öffnet: `WISO_GENERATOR_ENTSPERRT=ja python3 tools/umbau/gen-wiso/wiso_1.py`.
