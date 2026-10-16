# Auftrag: Unabhängige Prüfung PB2 (K1–K3, Doppeltes und Unnötiges)

> So benutzen: von einem Prüf-Agenten oder einer neuen Sitzung ausführen lassen, Repo
> `logic-over-luck/AP1_AP2_Tracker`, Branch `umbau`. Katalog (`quellen/katalog.md`) und
> Abschriften (`quellen/pruefungen/pb2/*.md`) müssen lokal vorliegen (nicht im Repo, E10).

---

**Auftrag**

Du prüfst den neuen PB2-Lernplan eines Umschülers (Fachinformatiker Anwendungsentwicklung, IHK-Abschlussprüfung
Teil 2, Prüfungsbereich „Entwicklung und Umsetzung von Algorithmen“, 90 min) **kritisch und unabhängig**. Der
Lernplan wurde von einer anderen KI-Sitzung gebaut. Du sollst **nicht** bestätigen, was da ist, sondern Fehler finden.
Ein Bericht ohne Funde ist nur glaubwürdig, wenn du begründest, was du geprüft hast.

Du prüfst in **beide Richtungen**, beide sind gleich wichtig: **Was fehlt?** und **Was ist doppelt oder
unnötig?** Der Lernplan soll vollständig, aber nicht aufgebläht sein – jede Aussage kostet Lernzeit.

**Zu prüfen:** `umbau/lernplan/pb2/PB2-1.json` bis `PB2-6.json` (Felder `themenbloecke`; je Stichpunkt
`koennen`, `grenzen`, `kuer`, `teilaufgaben`, `bausteine`, `baut_auf`).

**Darfst du lesen:**
- `quellen/katalog.md` (Prüfungskatalog; AP2-Teil Kapitel AP2a/AP2b), `quellen/pruefungen/pb2/*.md` (9 Prüfungen
  mit Lösungshinweisen; 2025W nur Lösungshinweise ohne Aufgabentext – dort fehlt der Operator).
- `umbau/zuordnung/pb2/*.json` (welche Teilaufgabe welche Katalogbausteine belegt, Aufgabentyp).
- `umbau/export/AP1.json` und `umbau/export/PB1.json` – die Räume AP1 (Teil 1) und PB1 („Planen eines
  Softwareproduktes“). Was dort steht, lernt der Umschüler schon; PB2 soll es nach Regel E2 **nicht wiederholen**,
  sondern per `baut_auf` darauf verweisen und nur ergänzen, was PB2 neu oder tiefer verlangt.
- `umbau/regeln/raeume-ap2.json` – welcher AP2-Katalogpunkt in PB1, PB2 oder PROJEKT wohnt.
- `UMBAU.md` Abschnitt 2 (E-Regeln) und 4 (Regelwerk) für die Begriffe Stufe, Kern, Puffer, Kür, Grenze, Raum.
  Bewerte aber **fachlich**, nicht nur nach Regeln.

**Nicht lesen (Unabhängigkeit):** `umbau/berichte/`, die Felder `meta` und `alt_neu` der Lernpläne, die alten
Inhalte in `inhalte/` und `Inhaltsdatei_AP1_AP2_tracker.json`.

**Prüffragen je Stichpunkt**

- **K1 Kerntest:** Lies jede Teilaufgabe aus `teilaufgaben` in der Abschrift samt Lösungshinweis. Könnte jemand,
  der genau diese Können-Aussagen (plus die per `baut_auf` importierten AP1-/PB1-Stichpunkte) beherrscht, sie voll
  lösen? Was fehlt dafür? Bei Pseudocode- und SQL-Aufgaben: reichen die Aussagen, um die Musterlösung selbst zu
  schreiben (Schleifen, Felder, Rekursion, JOIN, GROUP BY, Unterabfragen …)?
- **K2 Herkunft und Stufe:** Passt jede Aussage zu ihrer `herkunft` (Katalogstelle oder Beleg) und ist die Tiefe
  (Stufe 1 nennen … 4 beurteilen/entwickeln) so, wie Prüfung oder Katalog sie verlangen – nicht tiefer, nicht flacher?
- **K3 Woher?** Steht etwas drin, das weder aus Katalog noch Beleg noch Regel kommt?
- **Fachlich richtig?** Stand Oktober 2026 (SQL-Standard, Begriffe). Veraltetes, Ungenaues, Lehrmeinung als Tatsache?
  Sind Beispiele (SQL, Pseudocode) korrekt?

**Doppeltes und Unnötiges – genauso gründlich wie Fehlendes:**

- **doppelt in PB2:** zwei Aussagen fragen im Kern dasselbe, auch über Stichpunkte und Ordner hinweg.
- **doppelt zu AP1/PB1:** eine PB2-Aussage wiederholt nur, was im AP1- oder PB1-Export schon steht (gleiche Tiefe),
  statt darauf aufzubauen. Nur tiefer oder neu darf bleiben.
- **gehört woanders hin:** Inhalt wohnt laut `raeume-ap2.json` in PB1 oder PROJEKT.
- **streichen:** bringt für PB2 nichts, steht in keinem Katalogpunkt und keiner Prüfung.
- **zur Kür / Kür entfernen:** nützlich, aber keine Pflicht – oder so randständig, dass es nur ablenkt.
- **flacher:** verlangt mehr Tiefe als Katalog und Prüfungen.
- **zu fein:** eine Aussage ist so klein, dass sie in eine andere gehört (Stichpunkt sollte etwa eine Stunde Lernen sein).

Nach Regel E6 reicht „kam in keiner Prüfung vor“ allein nicht, eine Aussage zu streichen, die der Katalog verlangt.
Melde solche Fälle trotzdem, aber als Frage (Sicherheit „niedrig“). Struktogramme sind gestrichen (Z4), Pseudocode
ist die Darstellungsform.

**Ergebnis**

Schreibe je Ordner `umbau/berichte/PB2-<n>-pruefer.md` mit einer Tabelle:

| Nr | Stelle (ID) | Art (K1 fehlt / K2 Stufe / K2 Herkunft / K3 / falsch / doppelt PB2 / doppelt AP1 / doppelt PB1 / anderer Raum / streichen / zur Kür / Kür entfernen / flacher / zu fein / Grenze / unklar) | Befund | Vorschlag | Sicherheit (hoch/mittel/niedrig) |

Dazu je Ordner eine Zeile, was du geprüft hast (Anzahl Teilaufgaben gelesen, Aussagen geprüft). Am Ende
`umbau/berichte/PB2-pruefer-bilanz.md`: Funde je Ordner und Art, Aussagen vorher (92) und nach deinen Vorschlägen,
die ordnerübergreifenden Doppelungen gesammelt, drei Sätze Gesamturteil, offene Fragen an den Projektinhaber.

**Ändere die Lernpläne nicht** – nur die Berichte schreiben.
