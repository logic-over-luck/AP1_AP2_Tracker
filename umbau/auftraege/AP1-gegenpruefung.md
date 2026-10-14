# Auftrag: Kritische Gegenprüfung AP1 (unabhängig)

> So benutzen: Neue Sitzung öffnen (Opus, hohe Denkstufe), Repo `logic-over-luck/AP1_AP2_Tracker`,
> Branch `vorschau-ap1`. Katalog (`quellen/katalog.md`) und Prüfungsabschriften
> (`quellen/pruefungen/ap1/*.md`) anhängen, falls vorhanden. Dann den Text ab „Auftrag“ einfügen.
> Am besten je Sitzung zwei bis drei Ordner, damit die Prüfung gründlich bleibt.

---

**Auftrag**

Du prüfst den neuen AP1-Lernplan eines Umschülers (Fachinformatiker Anwendungsentwicklung, IHK-Prüfung
Teil 1 „Einrichten eines IT-gestützten Arbeitsplatzes“) **kritisch und unabhängig**. Der Lernplan wurde
schon von anderen KI-Sitzungen gebaut und geprüft. Du sollst **nicht** bestätigen, was da ist, sondern
Fehler finden. Ein Bericht ohne Funde ist nur glaubwürdig, wenn du begründest, was du geprüft hast.

**Zu prüfen:** `umbau/lernplan/ap1/AP1-<n>.json` – Ordner: _____ (z. B. AP1-1 bis AP1-3)

**Unabhängigkeit:** Lies **nicht** `umbau/berichte/` (frühere Prüfberichte), nicht die Felder `meta`
und `alt_neu` der Lernpläne und nicht die alten Inhalte in `inhalte/`. Du darfst UMBAU.md Abschnitt 4
(Regelwerk) lesen, um die Begriffe Stufe, Kern, Puffer, Kür, Grenze zu verstehen – bewerte aber
**fachlich**, nicht nur nach Regeln.

**Prüffragen je Stichpunkt**

1. **Fachlich richtig?** Stimmt jede Können-Aussage, jede Grenze, jeder Kür-Eintrag inhaltlich
   (Stand Oktober 2026: Normen, Gesetze, Zahlen, Begriffe)? Veraltetes, Ungenaues, Lehrmeinung als Tatsache?
2. **Vollständig für die Prüfung?** Fehlt etwas, das in einer AP1-Prüfung zu diesem Thema typisch
   abgefragt wird? (Mit Abschriften: jede zugeordnete Teilaufgabe aus `teilaufgaben` gegen die Aussagen
   lesen – könnte man sie mit genau diesen Aussagen voll lösen?)
3. **Zu viel?** Steht etwas als Pflicht drin, das für AP1 zu tief oder fremd ist (gehört nach AP2/WiSo)?
4. **Grenzen sinnvoll?** Schneidet eine Grenze etwas weg, das man für die Prüfung doch braucht?
5. **Verständlich?** Versteht ein Umschüler ohne Vorwissen jede Aussage? Ist klar, was man am Ende
   *tun* können muss? Wirkt der Stichpunkt wie etwa eine Stunde Lernen?
6. **Gliederung:** Passen Stichpunkt und Themenblock zusammen, gibt es Doppelungen zwischen Ordnern?

**Ergebnis**

Schreibe je Ordner `umbau/berichte/AP1-<n>-gegenpruefung.md`:

| Nr | Stelle (ID) | Art (falsch / fehlt / zu viel / Grenze / unklar / Gliederung) | Befund | Vorschlag | Sicherheit (hoch/mittel/niedrig) |

Danach drei Sätze Gesamturteil. **Ändere die Lernpläne nicht** – nur der Bericht. Fragen, die der
Projektinhaber entscheiden muss, als Liste am Ende. Committen und auf `vorschau-ap1` pushen.
Am Ende nur eine Zeile melden: „AP1-x geprüft: N Funde (davon M hoch)“.
