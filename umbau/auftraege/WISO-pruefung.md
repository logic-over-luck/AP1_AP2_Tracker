# Auftrag: Unabhängige Prüfung WISO (K1–K3, Doppeltes und Unnötiges)

> So benutzen: von einem Prüf-Agenten oder einer neuen Sitzung ausführen lassen, Repo
> `logic-over-luck/AP1_AP2_Tracker`, Branch `umbau`. Katalog (`quellen/katalog.md`) und
> Abschriften (`quellen/pruefungen/wiso/*.md`) müssen lokal vorliegen (nicht im Repo, E10).
> Je Agent ein Ordner (WISO-1 bei Bedarf in zwei Hälften: Themenblöcke 1–4 und 5–8).

---

**Auftrag**

Du prüfst den neuen WiSo-Lernplan eines Umschülers (Fachinformatiker Anwendungsentwicklung, IHK-Abschlussprüfung
Teil 2, Prüfungsbereich „Wirtschafts- und Sozialkunde“, 60 min, ca. 30 maschinell auswertbare Aufgaben: Einfach- und
Mehrfachauswahl, Zuordnung, Reihenfolge, kurze Rechnungen) **kritisch und unabhängig**. Der Lernplan wurde von einer
anderen KI-Sitzung gebaut. Du sollst **nicht** bestätigen, was da ist, sondern Fehler finden. Ein Bericht ohne Funde ist
nur glaubwürdig, wenn du begründest, was du geprüft hast.

Du prüfst in **beide Richtungen**, beide sind gleich wichtig: **Was fehlt?** und **Was ist doppelt oder unnötig?** Der
Lernplan soll vollständig, aber nicht aufgebläht sein – jede Aussage kostet Lernzeit.

**Zu prüfen:** `umbau/lernplan/wiso/WISO-<n>.json` (Felder `oberblock`, `themenbloecke`; je Stichpunkt `koennen`,
`grenzen`, `teilaufgaben`, `bausteine`, `baut_auf`, `hinweis`; je Aussage `stufe`, `herkunft`, `neu`, `vorgegeben`).

**Darfst du lesen:**
- `quellen/katalog.md` (Prüfungskatalog; WiSo-Teil „03 Wirtschafts- und Sozialkunde“, Kapitel WISO.01–WISO.05),
  `quellen/pruefungen/wiso/*.md` (8 Prüfungen 2021W–2025W mit Musterlösungen; 2025S nur eigene, nicht amtliche Lösung).
- `umbau/zuordnung/wiso/*.json` (welche Aufgabe welche Katalogbausteine belegt; ID-Schema `2023W-WISO-A12`).
- `umbau/fundament/katalog-bausteine.json` (Katalog als Bausteine mit IDs wie `WISO.01.05.2.4`),
  `umbau/regeln/zusatzbausteine.json` (Einträge `ZB.wiso-*`: Prüfungsthemen, die nicht im Katalog stehen).
- `umbau/export/AP1.json`, `umbau/export/PB1.json`, `umbau/export/PB2.json` – die schon gebauten Räume AP1 (Teil 1),
  PB1 und PB2. Was dort steht, lernt der Umschüler schon; WiSo soll es nach Regel E2 **nicht wiederholen**, sondern per
  `baut_auf` darauf verweisen und nur ergänzen, was WiSo neu oder tiefer verlangt.
- `umbau/regeln/wiso-deckung.json` – WiSo-Bausteine, die nach Entscheidung P47 durch einen Stichpunkt eines früheren
  Raums gedeckt sind und deshalb im WiSo-Plan nicht neu formuliert werden.
- `UMBAU.md` Abschnitt 2 (E-Regeln), 4 (Regelwerk, besonders 4.1 Stufen, 4.2 B4, 4.7 Z3b) und im Parkplatz P36, P46–P48.
  Bewerte aber **fachlich**, nicht nur nach Regeln.

**Nicht lesen (Unabhängigkeit):** `umbau/berichte/`, die Felder `meta` und `alt_neu` der Lernpläne, `tools/umbau/gen-wiso/`
(Bau-Skripte), die alten Inhalte in `inhalte/` und `Inhaltsdatei_AP1_AP2_tracker.json`.

**Prüffragen je Stichpunkt**

- **K1 Kerntest:** Lies jede Aufgabe aus `teilaufgaben` in der Abschrift samt Musterlösung. Könnte jemand, der genau diese
  Können-Aussagen (plus die per `baut_auf` importierten Stichpunkte früherer Räume) beherrscht, sie sicher richtig lösen –
  auch die **falschen Antwortmöglichkeiten** als falsch erkennen? Was fehlt dafür? Prüfe zusätzlich, ob jede Aufgabe der
  8 Prüfungen, die zu deinem Ordner gehört, überhaupt in einem Stichpunkt steht.
- **K2 Herkunft und Stufe:** Passt jede Aussage zu ihrer `herkunft` (Katalogstelle oder Beleg) und ist die Stufe
  (1 nennen … 4 beurteilen) so, wie Katalog oder Prüfung sie verlangen – nicht tiefer, nicht flacher? WiSo-Katalogpunkte
  ohne Operator haben Stufe 2; Auswahl-, Zuordnungs- und Reihenfolgeaufgaben zählen nach Z3b als Stufe 2, Rechnungen als 3.
- **K3 Woher?** Steht etwas drin, das weder aus Katalog noch Beleg noch Regel kommt?
- **Fachlich richtig, Stand Oktober 2026?** Arbeits-, Sozial- und Gesellschaftsrecht ändern sich (BBiG-Novelle 2024,
  Nachweisgesetz, Mutterschutz, Mindestlohn, Sozialversicherungswerte, Arbeitszeit). Veraltetes, Ungenaues, Lehrmeinung als
  Tatsache? Konkrete Zahlen nur, wenn sie sicher und dauerhaft sind; jährlich wechselnde Werte stehen in den Aufgaben (B4).

**Doppeltes und Unnötiges – genauso gründlich wie Fehlendes:**

- **doppelt in WiSo:** zwei Aussagen fragen im Kern dasselbe, auch über Stichpunkte und Ordner hinweg.
- **doppelt zu AP1/PB1/PB2:** eine WiSo-Aussage wiederholt nur, was im Export schon steht (gleiche Tiefe), statt darauf
  aufzubauen. Nur tiefer oder neu darf bleiben. Achte besonders auf IT-Sicherheit, Datenschutz, Ergonomie, Organisation,
  Unternehmensziele, Präsentieren und Kommunikation.
- **streichen:** bringt für WiSo nichts, steht in keinem Katalogpunkt und keiner Prüfung.
- **zur Kür:** nützlich, aber keine Pflicht.
- **flacher:** verlangt mehr Tiefe als Katalog und Prüfungen.
- **zu fein / zu grob:** eine Aussage ist so klein, dass sie in eine andere gehört, oder so lang, dass sie mehrere Dinge
  auf einmal verlangt (ein Stichpunkt soll etwa eine Stunde Lernen sein).
- **Deckung (P47) falsch:** ein Baustein ist in `wiso-deckung.json` als gedeckt geführt, der frühere Raum lehrt ihn aber
  nicht vollständig – oder umgekehrt.

Nach Regel E6 reicht „kam in keiner Prüfung vor“ allein nicht, eine Aussage zu streichen, die der Katalog verlangt. Melde
solche Fälle trotzdem, aber als Frage (Sicherheit „niedrig“).

**Ergebnis**

Schreibe `umbau/berichte/WISO-<n>-pruefer.md` (bei geteiltem Ordner beide Hälften in dieselbe Datei, je ein Abschnitt) mit
einer Tabelle:

| Nr | Stelle (ID) | Art (K1 fehlt / K2 Stufe / K2 Herkunft / K3 / falsch / veraltet / doppelt WiSo / doppelt AP1 / doppelt PB1 / Deckung / streichen / zur Kür / flacher / zu fein / zu grob / Grenze / unklar) | Befund | Vorschlag (konkreter neuer Wortlaut, wo möglich) | Sicherheit (hoch/mittel/niedrig) |

Dazu eine Zeile, was du geprüft hast (Anzahl Aufgaben gelesen, Aussagen geprüft), und am Ende offene Fragen an den
Projektinhaber, falls es welche gibt.

**Ändere die Lernpläne nicht** – nur den Bericht schreiben.
