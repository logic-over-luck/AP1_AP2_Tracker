# Auftrag Stufe 3: Lehrbuchkapitel lesen und mit dem Tracker vergleichen

Nur lesen, nichts im Repo ändern, nichts committen. Repo: /home/user/AP1_AP2_Tracker.

**Hintergrund:** Ein Umschüler (Fachinformatiker Anwendungsentwicklung, IHK) lernt mit einem Tracker. Dessen Inhalte sind
stark aus alten Prüfungen abgeleitet; bei offenen Sachthemen stehen oft nur Einzelfakten statt Verständnisgerüst. Ein
Abgleich der Inhaltsverzeichnisse der drei Westermann-Lehrbücher hat Kapitel als 🟡 zu schmal, 🔴 fehlt oder 🔵 nicht
im Katalog, aber wichtig markiert – nur nach dem Titel. Du prüfst jetzt am **echten Kapiteltext**, ob das stimmt und
was genau fehlt. Ziel: Der Lernende soll Gewissheit bekommen, wo der Tracker reicht und wo nicht.

**Dateien:**
- Deine Kapitelliste: siehe Gruppen-Datei (unten im Prompt genannt). Jede Zeile nennt die Datei mit dem Kapiteltext
  (OCR, enthält Fehler und Kopf-/Fußzeilen; einzelne Ausschnitte können Nachbarabschnitte mitenthalten), die Ampel und
  den Vorbefund.
- Tracker: build/extern/AP1.md, PB1.md, PB2.md, WISO.md (Pflicht = "Das musst du können"; "Zusatz (freiwillig)" zählt
  nicht als Pflicht; "Bewusst nicht enthalten" = Grenze) und dieselben Dateien mit -lang.md (zusätzlich Erklärungen
  "<details>" und Lernkarten "- Karte:"). Suche gezielt mit Grep (Synonyme!), lies die betroffenen Stichpunkte.
- Katalog: quellen/katalog.md (zur Frage, ob etwas prüfungsrelevant ist).

**Maßstab:** Das Buchkapitel ist der Maßstab für Breite und Tiefe – nicht dein eigenes Fachwissen. Nenne nur, was im
Kapitel tatsächlich steht. Filter, was ein Anwendungsentwickler nicht braucht: Historie, Hersteller-/Produktnamen,
Codenamen, Zahlenwerte, die veralten, Bedienschritte einzelner Programme, Fachrichtung Systemintegration/Elektrotechnik,
Lernsituationen und Arbeitsaufträge, Modellunternehmen. Leitfrage je Inhalt: „Braucht man das, um das Thema zu
verstehen und eine Aussage im Tracker begründen oder anwenden zu können?“

**Urteil je Kapitel (genau eins):**
- ✅ **reicht** – der Tracker deckt den Kern des Kapitels ab (Pflicht oder Erklärung); die Vorprüfung war zu streng.
- ➕ **kleine Ergänzung** – 1–3 konkrete Punkte fehlen, in bestehende Stichpunkte einzubauen.
- 🧱 **Gerüst fehlt** – ein wesentlicher Kern fehlt (mehrere Aussagen oder ein neuer Stichpunkt nötig).
- ⚪ **nicht nötig** – Kapitel ist für AE nicht relevant, nur Rabbit Hole, oder gehört zur Projektarbeit (Raum PROJEKT).

Gib zusätzlich an, ob ein fehlender Punkt im Katalog steht (K) oder nicht (–).

**Ausgabe:** Schreibe nach /tmp/claude-0/-home-user-AP1-AP2-Tracker/4734b32e-e5b0-55bd-9240-776cd4f31e70/scratchpad/stufe3-ergebnis-<GRUPPE>.md:

| Kapitel | Titel | Urteil | Was im Kapitel steht und im Tracker fehlt (eigene Stichworte, K/–) | bewusst weglassen (Rabbit Hole) | Tracker-Stelle(n) |

Keine Textauszüge aus dem Buch übernehmen (Urheberrecht) – nur eigene Stichworte. Darunter: Zählung je Urteil und die
5 wichtigsten 🧱 oder ➕ deiner Gruppe. Antworte am Ende nur mit der Zählung und diesen 5 Punkten.
