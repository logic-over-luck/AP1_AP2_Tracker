# Auftrag: Unabhängige Prüfung Regelwerk v2.0 (K1–K5, Buch-Aussagen)

> So benutzen: von einem Prüf-Agenten ohne Kenntnis des Baus ausführen lassen, Repo
> `logic-over-luck/AP1_AP2_Tracker`, Branch `regelwerk-v2`. Katalog (`quellen/katalog.md`), Abschriften
> (`quellen/pruefungen/<raum>/*.md`) und Lehrbuch-OCR (`quellen/lehrbuch/*.txt`) müssen lokal vorliegen (E10).
> Je Agent ein Raum (bei großen Räumen in Ordnergruppen geteilt).

---

**Auftrag**

Du prüfst die **Erweiterung** des Lernplans eines Lernenden (Fachinformatiker Anwendungsentwicklung, IHK-Prüfung,
ohne Umschulung und ohne Dozenten) **kritisch und unabhängig**. Mit Regelwerk v2.0 ist das Lehrbuch (Westermann
„IT-Berufe“: GS = Grundstufe LF1–5, FS = Fachstufe LF6–9, FS2 = Fachstufe II AE LF10–12) die Quelle für die
**Tiefe** geworden. Eine andere Sitzung hat dafür Können-Aussagen mit Herkunft `buch:<Band>-<Kapitel>-S<Seite>`
ergänzt, einige Stichpunkte geteilt, reine Tiefen-Grenzen gestrichen und Buch-Themen ohne Katalogbezug als Kür
(Quelle `buch:…`) eingetragen. Du sollst **nicht** bestätigen, sondern Fehler finden. Ein Bericht ohne Funde ist nur
glaubwürdig, wenn du begründest, was du geprüft hast.

**Zu prüfen:** alle Aussagen deines Raums mit einer Herkunft `buch:` (`umbau/lernplan/<raum>/*.json`, Feld
`herkunft`), die Kür-Einträge mit Quelle `buch:`, neue Stichpunkte (stehen in `meta.v2[].neue_stichpunkte`) und die
gestrichenen Grenzen (`meta.v2[].grenzen_gestrichen`). Erklärungen (`umbau/kurz/<raum>/`) und Karten
(`umbau/karten/<raum>/`) zu diesen Aussagen stichprobenweise.

**Darfst du lesen:** die Lernpläne, Kurzfassungen und Karten des Raums, `umbau/export/*.md` (andere Räume),
`quellen/katalog.md`, `quellen/pruefungen/`, `quellen/lehrbuch/*.txt` (Seite N steht im OCR-Text im Abschnitt mit
Index N+1 zwischen Form-Feeds, ab 0 gezählt; du kannst auch nach der Kapitelnummer suchen), `umbau/regeln/regelwerk.json` (Abschnitt
`buch`), `UMBAU.md` Abschnitt 4.0 (Regelwerk v2.0) und 4.1–4.8.
**Nicht lesen (Unabhängigkeit):** `umbau/berichte/`, `quellen/lehrbuch/kern/` (Kernpunkt-Listen der Bauenden),
Patch- und Bau-Dateien.

**Regel K – Kernabschnitt eines Buchkapitels:** dazu gehören Begriffe und Definitionen; Aufbau und Funktionsweise
(das Prinzip); Vor- und Nachteile, Auswahlkriterien; typische Größenordnungen, wenn das Buch sie nennt. Nicht dazu:
Historie; Herstellernamen und Produkte; Bedienschritte und Bildschirmanleitungen; Exkurse und Infokästen;
Übungsaufgaben; Inhalte, die das Buch ausdrücklich Systemintegration oder digitaler Vernetzung zuordnet. Prüffrage:
„Braucht ein Anwendungsentwickler das, um einen Katalog-Baustein zu erklären oder eine Entscheidung zu begründen?“
Bei Zweifel: dazu.

**Prüffragen**

- **K1 Kerntest:** Deckt der Stichpunkt mit den neuen Aussagen den Kernabschnitt der genannten Buchkapitel ab?
  Lies für mindestens 5 Kapitel deines Raums den Kapiteltext und nenne fehlende Kernpunkte. Prüfungsaufgaben
  (`teilaufgaben`) müssen weiter voll lösbar sein.
- **K2 Herkunft und Stufe:** Steht der Inhalt der Aussage wirklich auf der genannten Buchseite? Passt der Operator
  (ein Operator, prüfbar; nach dem Katalog-Baustein, bei Gerüstwissen „erklären“) zur Stufe?
- **K3 Woher?** Steht etwas drin, das weder aus Katalog noch Beleg noch Regel noch Buch-Kernabschnitt kommt?
- **K4 Regel K:** Steht etwas drin, das Regel K ausschließt (Historie, Produkte, Bedienschritte, Exkurse,
  Übungen, Systemintegration)?
- **K5 Urheberrecht:** Ist eine Buch-Aussage, Erklärung oder Karte wörtlich oder nur umgestellt aus dem Buch
  übernommen? Stichprobe: mindestens 15 Aussagen, je markante Wortfolgen von 5 und mehr Wörtern im OCR-Text suchen.
- **Fachlich richtig?** Das Buch hat Fehler (z. B. 2^64 als 512 GB). Fachliche Richtigkeit geht vor Buchtext.
- **Doppelt:** Wiederholt eine neue Aussage eine bestehende desselben Raums oder eines früheren Raums (Export)?
  Nach D6 entfällt dann die neue, die alte bekommt die Buch-Herkunft.
- **Gestrichene Grenzen:** War die Grenze wirklich nur eine Tiefen-Grenze (D3)? Grenzen gegen andere Räume oder
  Katalog-Ausschlüsse müssen bleiben.
- **Kür:** Hat das Thema wirklich keinen Katalog-Baustein (D8)? Sonst gehört es als Pflicht-Aussage hinein.
- **Größe:** 3–10 Aussagen je Stichpunkt (F3 v2.0); neue Stichpunkte mit Katalog-Baustein.

**Ergebnis**

Schreibe `umbau/berichte/V2-<Raum>-pruefer.md` mit einer Tabelle:

| Nr | Stelle (ID) | Art (K1 fehlt / K2 Herkunft / K2 Stufe / K3 / K4 Regel K / K5 wörtlich / falsch / doppelt / Grenze / Kür / Größe / unklar) | Befund | Vorschlag (konkreter neuer Wortlaut in eigenen Worten) | Sicherheit (hoch/mittel/niedrig) |

Dazu eine Zeile, was du geprüft hast (Kapitel gelesen, Aussagen geprüft, K5-Stichproben), und am Ende offene Fragen
an den Projektinhaber, falls es welche gibt. Keine Buchzitate im Bericht.
