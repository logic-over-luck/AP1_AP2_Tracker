# Generatoren PB2 (Arbeitsstand 14.10.2026)

> **Achtung (16.10.2026):** Die Lernpläne PB2-1 bis PB2-6 wurden danach direkt geändert (Prüfer-Funde, P36–P44) und die Ordner PB2-5/PB2-6 getauscht (P39). Die Generatoren erzeugen den alten Stand – nicht mehr ausführen, sonst gehen die Änderungen verloren.

Sicherung der Bau-Skripte aus der Sitzung, damit PB2 nach der Pause genauso weitergebaut werden kann.
Pfade in den Skripten sind absolut (`/home/claude/AP1_AP2_Tracker`, Scratchpad); bei Bedarf anpassen.

- `lp.py` – Bibliothek für Lernplan-Ordner (`LP`, `tb`, `sp`, `k`, `grenze`, `kuer`, `a` für alt_neu, `themen`, `meta`).
- `pb2_1.py` … `pb2_6.py` – erzeugen `umbau/lernplan/pb2/PB2-<n>.json` (Aufruf im Repo-Wurzelverzeichnis:
  `python3 tools/umbau/gen-pb2/pb2_1.py`). Danach `node tools/umbau/lernplan-pruefen.mjs PB2-<n>` und
  `node tools/umbau/raum-pruefen.mjs PB2`.
- `zuo_pb2.py` – erzeugte die Zuordnung `umbau/zuordnung/pb2/` (danach von Hand nachgebessert, siehe UMBAU.md).
- `edit_util.py` – kleine Hilfe zum Ändern von Lernplänen (rep/drop_k/save).
- `kurzlib2.py` – `schreibe(ordner, teaser, erklaerungen)` → `umbau/kurz/pb2/`.
- `kartenlib2.py` – `bau(ordner, entsch, neu, …)` → `umbau/karten/pb2/` + Bericht; braucht `altkarten2.json`,
  erzeugen mit `node tools/umbau/gen-pb2/altkarten2.mjs <pfad>/altkarten2.json` (Pfad in kartenlib2.py anpassen).
- `dump2.mjs PB2-<n> --karten` – kompakte Sicht auf einen Ordner mit den alten Karten.
