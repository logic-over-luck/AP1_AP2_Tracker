# Lerninhalte PB2

**Themengebiet:** Entwicklung und Umsetzung von Algorithmen – Fachrichtung Anwendungsentwicklung (2. bis 3. Ausbildungsjahr)

Gliederung: Ordner → Themenblock → Stichpunkt (eine Lerneinheit von etwa 30–90 Minuten) → „Das musst du können“.
„Baut auf“ heißt: Das Thema wurde in einem früheren Teil schon gelernt; hier steht nur, was neu dazukommt.
„Bewusst nicht enthalten“ sind gezogene Grenzen, „Zusatz“ ist freiwilliger Stoff.

## PB2-1 Programmlogik und Pseudocode

### PB2-1-1 Algorithmen in Pseudocode

_Lösungen als lesbaren Pseudocode oder als Aktivitätsdiagramm aufschreiben: Funktionen zur vorgegebenen Signatur, Schleifengrenzen, Sonderfälle und Datentypen, die Grundmuster über Arrays und Listen (filtern, zählen, Extremwerte, abgleichen, gruppieren, Gruppenwechsel) und bestehende Klassen erweitern. Variablen, Kontrollstrukturen und einfachen Pseudocode kennst du aus AP1._

#### PB2-1-1-1 Pseudocode und Aktivitätsdiagramm: Funktionen, Schleifengrenzen, Sonderfälle und Datentypen

**Ziel:** Eine Funktion zur vorgegebenen Signatur so aufschreiben, dass ein Dritter sie ohne Kenntnis der Sprache lesen kann: mit richtigen Schleifengrenzen, abgefangenen Sonderfällen, passenden Datentypen und nur den Methoden und Strukturen, die die Aufgabe vorgibt; dieselben Kontrollstrukturen auch als Aktivitätsdiagramm.

**Baut auf:** Bausteine eines Programms: Variablen, Datentypen, Datenstrukturen, Kontrollstrukturen, Prozeduren und Funktionen (AP1); Pseudocode: Kontrollstrukturen abbilden (AP1); Schreibtischtest (AP1); Fehler im Quellcode finden: Debugging, formale und inhaltliche Fehler (AP1); Aktivitätsdiagramm (AP1); Allgemeine Fehlerbehandlung in Programmen (PB1); Sequenzdiagramm (PB1); Zustandsdiagramm (PB1); Aktivitätsdiagramm für umfangreiche Abläufe (PB1)

**Das musst du können:**

1. Du kannst eine Funktion zur vorgegebenen Signatur (Name, Parameter mit Datentyp, Rückgabetyp) so in Pseudocode schreiben, dass ein Dritter sie ohne Kenntnis deiner Programmiersprache lesen kann, und dabei nur die vorgegebenen Klassen, Methoden und Datenstrukturen verwenden: Listen mit add, size und get, Getter von Objekten und vorgegebene Methoden wie getDay() oder getTimeTable(id), aber keine eigenen Hilfsfunktionen, die es nicht gibt.
2. Du kannst über die Pseudocode-Grundlagen aus AP1 hinaus Schleifengrenzen beim Schreiben richtig setzen (Index von 0 bis Länge − 1; greifst du auf das Nachbarelement i − 1 oder i + 1 zu, beginnt die Schleife eine Stelle später oder endet eine Stelle früher) und eine Schleife mit einer zusätzlichen Bedingung (Merker oder Zähler) vorzeitig beenden, sobald das Ergebnis feststeht.
3. Du kannst zweidimensionale Arrays verarbeiten: Zeile und Spalte über zwei Indizes ansprechen, eine Zeile anhand eines Schlüsselwerts (z. B. Monat und Tag) suchen und die Spalten dieser Zeile durchlaufen, auch wenn die Nutzdaten erst ab einer bestimmten Spalte beginnen (Zeitslot j steht in Spalte 2 + j).
4. Du kannst im Pseudocode Sonderfälle vor dem ersten Zugriff abfangen und dafür den festgelegten Rückgabewert liefern, zum Beispiel eine leere Liste vor get(0) (Rückgabe null), einen Sonderwert als Parameter (Zeitslot −1 heißt „beliebiger Slot“), keinen passenden Eintrag (Rückgabe false) oder eine Division durch null, wenn nichts gezählt wurde.
5. Du kannst bei Rechnungen im Pseudocode die Datentypen beachten: eine ungewollte Ganzzahldivision vermeiden (getMaxPersonen() / 2.0 statt / 2), eine Prozentschwelle mit ganzen Zahlen ohne Abschneiden formulieren (belegt * 100 > 80 * anzahlBetten statt belegt / anzahlBetten > 0.8) und Kommazahlen nicht in einer Integer-Variablen speichern.
6. Du kannst die Kontrollstrukturen eines Algorithmus statt in Pseudocode als Aktivitätsdiagramm abbilden und zwischen beiden Formen übertragen: eine Zählschleife mit Initialisierung, Prüfung und Schrittweite als eigene Aktionen, geschachtelte Schleifen und Verzweigungen, ohne dass Bedingungen fehlen oder sich überschneiden.

**Bewusst nicht enthalten:**

- Struktogramm und Programmablaufplan als eigene Darstellungsformen gehören nicht dazu.

#### PB2-1-1-2 Algorithmen über Arrays und Listen: filtern, zählen, Extremwerte, abgleichen, gruppieren

**Ziel:** Wiederkehrende Grundmuster sicher anwenden: Elemente filtern, zählen und summieren, Extremwerte bestimmen, Listen und Zeiträume abgleichen, Häufigkeiten in einem Ergebnisarray zählen, Nachbarelemente vergleichen und sortierte Daten gruppenweise auswerten.

**Das musst du können:**

1. Du kannst eine Liste oder ein Array durchlaufen und die Elemente, die eine oder mehrere Bedingungen erfüllen, in eine Ergebnisliste übernehmen und diese zurückgeben.
2. Du kannst zählen, summieren und einen Durchschnitt berechnen, auch nur für die Elemente, die eine Bedingung erfüllen, zum Beispiel die Tage, an denen ein Kurs besser als der Index war.
3. Du kannst das kleinste oder größte Element nach einem Kriterium bestimmen: mit dem ersten Element oder dem größten bzw. kleinsten möglichen Wert (z. B. Integer.MAX_VALUE, Double.MAX_VALUE) beginnen, jedes weitere vergleichen und neben dem bisher besten Wert auch seinen Index merken; auch das Element mit der kleinsten Abweichung von einem Zielwert und wiederholt, bis alle Elemente verbraucht sind (nächstgelegene Position wählen, übernehmen und aus der Liste entfernen).
4. Du kannst zwei Listen mit verschachtelten Schleifen abgleichen, zum Beispiel ob eine Reservierung denselben Tisch am selben Datum belegt, und über einen Datumsbereich Tag für Tag zählen (date = date + 1), wie viele Einträge einen Tag im Zeitraum von–bis enthalten; dabei setzt du die Grenzen genau (Aufnahmetag zählt, Entlassungstag nicht: datumVon <= tag < datumBis).
5. Du kannst Häufigkeiten je Schlüssel zählen: das Ergebnisarray vorher in passender Größe anlegen (ein- oder zweidimensional, z. B. new Integer[15] oder Tage des Monats × 10 Öffnungsstunden), den Index aus dem Fachwert berechnen (Tag − 1, Stunde − 9, Haltestelle − 1) und den Zähler an dieser Stelle erhöhen.
6. Du kannst aufeinanderfolgende Elemente miteinander verrechnen (Element i mit Element i − 1, wenn beide dasselbe Datum haben; Spalte m + 1 minus Spalte m) und auf nach einem Schlüssel sortierte Daten den Gruppenwechsel anwenden: bei Wechsel des Schlüssels das Ergebnis der Gruppe ausgeben oder übernehmen, die Gruppenwerte zurücksetzen und die letzte Gruppe nach der Schleife nicht vergessen.

#### PB2-1-1-3 Bestehende Funktionen und Klassen erweitern

**Ziel:** Vorhandene Klassen nach einem Klassendiagramm um Methoden erweitern, die Attribute, fremde Objekte und statische Methoden nutzen, und dabei die vorgegebenen Schnittstellen einhalten. Methoden aus einem Klassendiagramm umsetzen kennst du aus PB1-5.

**Baut auf:** Objektorientierte Methoden in Pseudocode umsetzen (PB1); REST, SOAP und Schnittstellen festlegen (PB1)

**Das musst du können:**

1. Du kannst in einer vorhandenen Klasse eine Methode ergänzen, die über ein Attribut ein anderes Objekt nutzt (this.fahrplanService.getAbfahrten(…)), statische Methoden wie DateTime.now() aufruft und die Rückgabewerte weiterverarbeitet, auch mit einer vorgegebenen Vergleichsmethode wie compare(), deren Rückgabe −1, 0 oder 1 du nach der Beschreibung richtig deutest.
2. Du kannst eine Methode nach Vorgabe implementieren, die ein Objekt erzeugt, befüllt und zurückgibt, zum Beispiel eine HTTP-Antwort mit Statuscode, Kopfzeilen (Content-Type, Content-Length) und Body.
3. Du kannst eine private Hilfsmethode schreiben, die aus einer sortierten Liste von Objekten nur die Einträge ab einem Zeitpunkt übernimmt, das Ergebnisarray in der Größe der Höchstzahl anlegt und aufhört, sobald diese erreicht ist.

## PB2-2 Suchen, Sortieren, Rekursion und Generik

### PB2-2-1 Suchen, Sortieren und weiterführende Techniken

_Die klassischen Such- und Sortierverfahren erklären und einen Sortieralgorithmus schreiben, Rekursion verstehen und iterativ umsetzen und Algorithmen mit generischen Klassen und übergebenen Vergleichsfunktionen flexibel machen._

#### PB2-2-1-1 Such- und Sortierverfahren: lineare und binäre Suche, Bubble, Selection und Insertion Sort

**Ziel:** Die beiden Suchverfahren erklären und vergleichen, einen elementaren Sortieralgorithmus in Pseudocode schreiben, auch für Objekte nach einem Attribut, und die drei Sortierverfahren am Vorgehen unterscheiden.

**Baut auf:** Objektorientierte Methoden in Pseudocode umsetzen (PB1)

**Das musst du können:**

1. Du kannst die lineare Suche beschreiben: die Elemente der Reihe nach mit dem Gesuchten vergleichen, beim ersten Treffer abbrechen und das Element oder seinen Index zurückgeben, sonst einen festgelegten Wert wie −1 oder null; sie funktioniert auch auf unsortierten Daten.
2. Du kannst die binäre Suche beschreiben und mit der linearen vergleichen: In einer sortierten Folge das mittlere Element prüfen und die Hälfte verwerfen, in der das Gesuchte nicht liegen kann, bis es gefunden oder der Bereich leer ist; sie funktioniert nur auf sortierten Daten, braucht dafür aber nur etwa log₂(n) Vergleiche (bei 1.000 Elementen höchstens 10) statt bis zu n.
3. Du kannst einen Sortieralgorithmus deiner Wahl in Pseudocode schreiben, zum Beispiel Bubble Sort mit zwei verschachtelten Schleifen und dem Tausch zweier Elemente über eine Hilfsvariable, auch für ein Array von Objekten, die nach einem Attribut (über den Getter) sortiert werden.
4. Du kannst Bubble Sort (benachbarte Elemente vergleichen und bei falscher Reihenfolge tauschen, Durchläufe wiederholen, bis nichts mehr getauscht wird), Selection Sort (jeweils das kleinste restliche Element suchen und nach vorn tauschen) und Insertion Sort (jedes Element in den bereits sortierten Teil einfügen) am Vorgehen unterscheiden.

#### PB2-2-1-3 Rekursion und Iteration

**Ziel:** Rekursive Algorithmen nachvollziehen, mit iterativen vergleichen und in eine iterative Lösung umschreiben.

**Baut auf:** Zahlensysteme und Präfixe: binär, hexadezimal, kB und KiB (AP1); Bausteine eines Programms: Variablen, Datentypen, Datenstrukturen, Kontrollstrukturen, Prozeduren und Funktionen (AP1)

**Das musst du können:**

1. Du kannst Rekursion erklären: Eine Funktion ruft sich selbst mit einem kleineren Teilproblem auf, bis eine Abbruchbedingung erreicht ist; jeder Aufruf belegt einen eigenen Rahmen auf dem Aufrufstapel, deshalb bricht das Programm ohne erreichbare Abbruchbedingung mit einem Stapelüberlauf (Stack Overflow) ab.
2. Du kannst je einen Vor- und Nachteil der rekursiven gegenüber einer iterativen Lösung beschreiben: oft kürzer, eleganter und näher an der Problembeschreibung, aber mehr Speicher auf dem Aufrufstapel und durch die vielen Aufrufe meist langsamer.
3. Du kannst einen rekursiven Algorithmus iterativ umsetzen: die Selbstaufrufe durch eine Schleife mit derselben Bedingung ersetzen und das, was die Rekursion auf dem Rückweg erledigt, nachbilden, indem du die Zwischenergebnisse in einer Liste sammelst und danach in umgekehrter Reihenfolge ausgibst (z. B. die Reste aus modulo 2 und div 2 bei der Umrechnung dezimal → binär).
4. Du kannst erklären, wie die Stellung einer Anweisung vor oder nach dem Selbstaufruf die Reihenfolge bestimmt: Anweisungen davor laufen beim Abstieg in Aufrufreihenfolge, Anweisungen danach beim Rückweg in umgekehrter Reihenfolge; so gibt die Umrechnung von 11 mit der Ausgabe vor dem Aufruf 1101 statt 1011 aus.

#### PB2-2-1-4 Generische Klassen und Funktionsobjekte

**Ziel:** Generische Klassen erklären und Algorithmen flexibel machen, indem eine Vergleichsfunktion als Parameter übergeben wird.

**Baut auf:** Klassendiagramm in der Tiefe (PB1)

**Das musst du können:**

1. Du kannst den Begriff generische Klasse erläutern: Die Klasse wird mit einem Typparameter geschrieben (z. B. List<T>) und erst bei der Verwendung für einen bestimmten Typ festgelegt, sodass derselbe Code für verschiedene Datentypen typsicher funktioniert.
2. Du kannst eine Vergleichsfunktion für zwei Objekte schreiben, die 0 bei Gleichheit, einen positiven Wert, wenn das erste größer ist, und sonst einen negativen Wert liefert; vergleicht sie Kommazahlen (z. B. ein Gehalt als Double), gibst du nicht die Differenz als Integer zurück, sondern über Verzweigungen 1, 0 oder −1, weil das Abschneiden eine Differenz wie 0,5 zu 0 macht.
3. Du kannst einen Sortieralgorithmus deiner Wahl so schreiben und benennen, dass er ein übergebenes Funktionsobjekt zum Vergleichen aufruft (ist f(a, b) > 0, wird getauscht), auch auf einer generischen Liste mit get, set und size statt auf einem Array, und damit dieselbe Sortierfunktion für verschiedene Kriterien nutzen (z. B. Kurs, Datum).

## PB2-3 Fehler finden, Debugging und Unit-Tests

### PB2-3-1 Code prüfen und Fehler beheben

_Fremden Code mit Testdaten von Hand durchgehen, Fehler eingrenzen und berichtigen, Debugger und print-Debugging gezielt einsetzen und Code mit selbst geschriebenen Unit-Tests absichern. Schreibtischtest und Fehlerarten kennst du aus AP1 (AP1-8-2-3, AP1-8-2-4), Ausnahmen und try/catch aus PB1-5-1-2._

#### PB2-3-1-1 Schreibtischtest und Fehler im Algorithmus lokalisieren

**Ziel:** Einen gegebenen, auch längeren oder rekursiven Algorithmus mit Testdaten von Hand ausführen, aus den Abweichungen den Fehler mit Zeilennummer bestimmen und den Code berichtigen oder ergänzen.

**Baut auf:** Pseudocode: Kontrollstrukturen abbilden (AP1); Schreibtischtest (AP1); Fehler im Quellcode finden: Debugging, formale und inhaltliche Fehler (AP1)

**Das musst du können:**

1. Du kannst über den Schreibtischtest aus AP1 hinaus eine Ablaufverfolgung für längeren Code mit einer vorgegebenen Datenverlaufstabelle durchführen und rekursive Aufrufe verfolgen: jeden Aufruf mit seinen eigenen Variablenwerten festhalten, bis zur Abbruchbedingung absteigen und die Rückkehr Aufruf für Aufruf nachvollziehen. _(neu gegenüber: Schreibtischtest (AP1) – rekursive Aufrufe und längerer Code mit vorgegebener Datenverlaufstabelle)_
2. Du kannst aus den Abweichungen zwischen erwartetem und tatsächlichem Ergebnis die Ursache im Code analysieren und die fehlerhafte Zeile mit Zeilennummer bestimmen, auch wenn zwei Fehler zusammenwirken.
3. Du kannst über das Korrigieren einzelner Zeilen aus AP1 hinaus mehrere Fehler in einem längeren Code zusammenhängend korrigieren und fehlende Code-Teile ergänzen, zum Beispiel Vergleichsoperatoren so anpassen, dass ein gegebener Unit-Test besteht, oder den vergessenen Verarbeitungsblock für die letzte Gruppe nach der Schleife einfügen (Gruppenwechsel: PB2-1). _(neu gegenüber: Pseudocode: Kontrollstrukturen abbilden (AP1), Fehler im Quellcode finden: Debugging, formale und inhaltliche Fehler (AP1) – mehrere zusammenhängende Korrekturen und fehlende Code-Teile ergänzen)_
4. Du kannst in gegebenem Code typische inhaltliche Fehler finden, die über die Fehlerquellen aus AP1-8-2-4 hinausgehen: falscher Startwert (z. B. 0 statt des ersten Elements beim Minimum), die letzte Gruppe wird nach der Schleife nicht mehr ausgewertet, falsche Variable im Ausdruck (Monats- statt Jahreszähler), überflüssige Anweisung, die ein Flag wieder zurücksetzt, fehlende Rückgabe (return), Ausgabe vor statt nach dem rekursiven Aufruf (Ergebnis in umgekehrter Reihenfolge). _(neu gegenüber: Fehler im Quellcode finden: Debugging, formale und inhaltliche Fehler (AP1) – PB2-typische Fehlerbilder: Startwert, letzte Gruppe, falsche Variable, überflüssige Anweisung, fehlende Rückgabe, Rekursionsreihenfolge)_

#### PB2-3-1-2 Debugging und Fehlerbehandlung

**Ziel:** Den Debugger und print-Debugging gezielt zur Fehlersuche einsetzen, die passende Technik wählen und festlegen, wie ein Programm unbrauchbare Eingaben bereinigt.

**Baut auf:** Allgemeine Fehlerbehandlung in Programmen (PB1); Fehler im Quellcode finden: Debugging, formale und inhaltliche Fehler (AP1)

**Das musst du können:**

1. Du kannst den Debugger gezielt einsetzen, um einen gegebenen Fehler einzugrenzen: einen Breakpoint vor die verdächtige Stelle setzen, im Einzelschritt weitergehen (Step over führt einen Methodenaufruf als Ganzes aus, Step into springt in die Methode hinein) und die Werte der Variablen beobachten, bis einer vom erwarteten Wert abweicht.
2. Du kannst über PB1-5-1-2 hinaus für unbrauchbare Texteingaben eine Vorgehensweise festlegen: die Eingabe zuerst bereinigen (z. B. mit trim führende und folgende Leerzeichen entfernen), eine danach leere Eingabe wie eine fehlende behandeln und eine festgelegte Ersatzregel anwenden, etwa ohne Vorgabe des Arztes die hinterlegte Standardmedikation verwenden, statt mit der unbrauchbaren Eingabe weiterzuarbeiten. _(neu gegenüber: Allgemeine Fehlerbehandlung in Programmen (PB1) – Eingabe bereinigen (trim) und eine nur aus Leerzeichen bestehende Eingabe wie eine fehlende behandeln)_
3. Du kannst für eine Fehlersuche begründet auswählen, ob du den Debugger oder print-Debugging (Zwischenwerte und Zustände gezielt ausgeben oder protokollieren) einsetzt: print-Debugging oder Logging, wenn kein Debugger zur Verfügung steht, der Fehler nur im Betrieb auftritt oder das Anhalten am Breakpoint den Ablauf verändert (z. B. Zeitabläufe); den Debugger, wenn sich der Fehler in der Entwicklungsumgebung nachstellen lässt und du Schritt für Schritt nachsehen willst.

#### PB2-3-1-3 Unit-Tests schreiben und prüfen, Regressionstests

**Ziel:** Aufbau und Eigenschaften guter Unit-Tests beschreiben, zu einer Anforderung selbst einen Unit-Test schreiben (auch testgetrieben), einen gegebenen Unit-Test gegen den Code prüfen und Regressionstests einordnen.

**Baut auf:** Teststufen: vom Unit-Test bis zur Abnahme (PB1)

**Das musst du können:**

1. Du kannst über PB1-9-1-4 hinaus Aufbau und Eigenschaften guter Unit-Tests beschreiben: Eine Testmethode prüft eine einzelne Einheit (Methode, Klasse) mit assertEquals(erwartet, tatsächlich); gute Unit-Tests folgen F.I.R.S.T. – schnell (Fast), unabhängig voneinander (Independent), wiederholbar mit gleichem Ergebnis (Repeatable), selbstprüfend ohne manuelle Kontrolle (Self-Validating), rechtzeitig vor dem Produktivcode geschrieben (Timely). _(neu gegenüber: Teststufen: vom Unit-Test bis zur Abnahme (PB1) – Aufbau einer Testmethode mit assertEquals und F.I.R.S.T.-Eigenschaften)_
2. Du kannst einen gegebenen Unit-Test gegen den Code überprüfen: jeden assertEquals-Aufruf mit der Methode von Hand nachrechnen und je Testfall eintragen, ob er besteht (OK) oder fehlschlägt (Fehler).
3. Du kannst den Zweck von Regressionstests erläutern: Nach jeder Änderung werden die vorhandenen Tests erneut ausgeführt, damit bereits funktionierende Teile nicht unbemerkt kaputtgehen.
4. Du kannst zu einer Anforderung einen Unit-Test schreiben: Testfälle für Normalfall, Grenzen und Fehlerfälle als assertEquals(erwartet, methode(...)) aufschreiben, auch bevor der Code existiert (Test Driven Development: erst ein fehlschlagender Test, dann gerade so viel Code, dass er besteht, dann aufräumen – Red, Green, Refactor).

## PB2-4 Testszenarien und Testdaten

### PB2-4-1 Testszenarien auswählen und Testdaten generieren

_Messen, wie gründlich Tests den Code durchlaufen, Pfade aufzählen und Testdaten für eine Überdeckung anpassen, das passende Testverfahren auswählen, Kriterien für bestandene Tests festlegen und Testdaten systematisch bilden. Black-Box- und White-Box-Test, Extremwertetest, Teststufen und Testprotokoll kennst du aus PB1-9._

#### PB2-4-1-1 Testabdeckung: Anweisungs-, Zweig- und Pfadüberdeckung

**Ziel:** Die Überdeckungsmaße des White-Box-Tests erläutern und abgrenzen, für einen Code die nötigen Testfälle bestimmen, alle Pfade aufzählen und Testdaten so anpassen, dass eine verlangte Überdeckung erreicht wird.

**Baut auf:** Testverfahren: statisch und dynamisch, Black-Box und White-Box (PB1)

**Das musst du können:**

1. Du kannst Testabdeckung (Code Coverage) erläutern: der Anteil des Codes, der von den Testfällen ausgeführt wird, meist in Prozent angegeben.
2. Du kannst Anweisungs-, Zweig- und Pfadüberdeckung erläutern und wie sie aufeinander aufbauen: jede Anweisung mindestens einmal ausgeführt; jede Verzweigung in jede Richtung mindestens einmal durchlaufen; jeder mögliche Weg vom Anfang bis zum Ende durchlaufen. Volle Pfadüberdeckung schließt volle Zweigüberdeckung ein, diese volle Anweisungsüberdeckung – nicht umgekehrt. Bei Schleifen wächst die Zahl der Pfade mit jedem möglichen Durchlauf, ohne feste Obergrenze unbegrenzt; volle Pfadüberdeckung ist dann praktisch nicht erreichbar. Die englischen Begriffe (statement, branch, path coverage) sind meist vorgegeben.
3. Du kannst für einen gegebenen Code die Anweisungen nennen, die mit vorgegebenen Testdaten nicht durchlaufen werden, und die Mindestzahl an Testfällen für Anweisungs- oder Zweigüberdeckung bestimmen.
4. Du kannst für einen kurzen Code alle Pfade ermitteln, die für eine vollständige Pfadüberdeckung durchlaufen werden müssen, und je Pfad die durchlaufenen Bedingungen und Anweisungen in der Reihenfolge ihrer Abarbeitung aufschreiben (z. B. B1, A1, B2, A3, B3, A4); hintereinanderliegende, voneinander unabhängige Verzweigungen multiplizieren dabei die Zahl der Pfade.
5. Du kannst Testdaten so anpassen, dass eine verlangte Überdeckung erreicht wird, und die Änderung begründen, zum Beispiel einen Wert so wählen, dass auch die bisher nicht durchlaufene Anweisung zum Setzen des Minimums ausgeführt wird.

#### PB2-4-1-2 Testverfahren auswählen und Bestehenskriterien festlegen

**Ziel:** Für eine Situation das passende Testverfahren und Überdeckungsmaß auswählen und begründen und festlegen, wann ein Testfall als bestanden gilt.

**Baut auf:** Testverfahren: statisch und dynamisch, Black-Box und White-Box (PB1); Testkonzept, Testprozess, Test- und Abnahmeprotokoll (PB1)

**Das musst du können:**

1. Du kannst über PB1-9-1-3 hinaus für eine konkrete Situation ein Testverfahren auswählen und die Wahl begründen: Black-Box-Test mit Äquivalenzklassen und Grenzwerten, wenn gegen die Anforderungen ohne Blick in den Code geprüft wird; White-Box-Test, wenn der Code systematisch abgedeckt werden soll; statischer Test (Review, Schreibtischtest), wenn Code ohne Ausführung geprüft werden soll oder noch nicht lauffähig ist. _(neu gegenüber: Testverfahren: statisch und dynamisch, Black-Box und White-Box (PB1) – Auswahl für eine konkrete Situation mit Begründung (Stufe 4), statt Verfahren nur zu kennen und einzusetzen)_
2. Du kannst ein Überdeckungsmaß für eine Vorgabe des Projektleiters nennen und begründen, zum Beispiel Zweigüberdeckung, weil sie anders als die Anweisungsüberdeckung auch leere Else-Zweige prüft, aber anders als die Pfadüberdeckung noch bezahlbar bleibt.
3. Du kannst Kriterien für Testergebnisse festlegen: zu jedem Testfall vorab das erwartete Ergebnis bestimmen, es in einer Testfalltabelle (Testdaten, erwartetes Ergebnis, tatsächliches Ergebnis) dem tatsächlichen Ergebnis gegenüberstellen – auch einem von Hand per Schreibtischtest ermittelten – und den Testfall nur als bestanden werten, wenn beide genau übereinstimmen, auch bei einer erwarteten Fehlermeldung oder Ausnahme.

#### PB2-4-1-3 Testdaten auswählen und generieren: Äquivalenzklassen, Grenzwerte, Sonderfälle

**Ziel:** Testdaten systematisch bilden, die Normalfall, Grenzen, ungültige Eingaben und Sonderfälle abdecken, und wissen, wozu Testdatengeneratoren dienen.

**Baut auf:** Testverfahren: statisch und dynamisch, Black-Box und White-Box (PB1)

**Das musst du können:**

1. Du kannst Äquivalenzklassen bilden: Eingaben, die die Funktion gleich behandelt, in Klassen einteilen (gültige und ungültige) und je Klasse einen Vertreter testen, zum Beispiel Testdaten aus zwei weiteren Klassen, für die −1 erwartet wird.
2. Du kannst für eine Funktion Testdaten auswählen, die den Normalfall, die Grenzwerte und ungültige Eingaben abdecken, und die Auswahl begründen: an jeder Grenze den Grenzwert selbst sowie die Werte knapp darunter und darüber, weil Fehler wie < statt <= genau dort auffallen (in 2022S-PB2-A2-ba scheitern die Testfälle 120/120 und 0/0).
3. Du kannst aus den Sonderfällen eines Algorithmus gezielt Testdaten ableiten, die oft vergessen werden: leeres Array oder null, nur ein Element, nur positive bzw. nur negative Werte (je nach Startwert), das gesuchte Element an erster oder letzter Stelle.
4. Du kannst Testdatengeneratoren einsetzen: große Mengen passender, auch zufälliger oder grenznaher Testdaten nach festgelegten Regeln (Wertebereich, Format, Verteilung) automatisch erzeugen lassen, statt echte personenbezogene Daten zu verwenden.

## PB2-5 SQL: Daten abfragen

### PB2-5-1 Abfragen zur Gewinnung von Daten

_Mit SELECT Daten auswählen, filtern, berechnen und sortieren, Tabellen verknüpfen, gruppieren und zusammenfassen, Unterabfragen einsetzen und ein vorgegebenes Tabellenmodell für eine Abfrage lesen – immer passend zur verlangten Ergebnistabelle. Diese Abfragen sind die Grundlage für die Datenpflege in PB2-6._

#### PB2-5-1-1 SELECT: Spalten, Bedingungen, Ausdrücke und Sortieren

**Ziel:** Spalten auswählen und umbenennen, mit Bedingungen filtern, in der Ausgabe rechnen, Text- und Datumsfunktionen nutzen und sortieren.

**Das musst du können:**

1. Du kannst mit SELECT … FROM die verlangten Spalten in der Reihenfolge der Ergebnistabelle ausgeben und mit AS umbenennen, auch mit DISTINCT ohne doppelte Zeilen.
2. Du kannst mit WHERE filtern und Bedingungen mit AND, OR, NOT, Klammern, IN (Werteliste) und BETWEEN verknüpfen, zum Beispiel PLZ zwischen 50800 und 51999, Menge 100 oder 200 (AW.Menge = 100 OR AW.Menge = 200), einen Datumsbereich mit >= und <= oder eine Bedingung zwischen zwei Spalten (Plan-Ankunft < Ist-Ankunft).
3. Du kannst LIKE mit den Platzhaltern % und _ sowie IS NULL und IS NOT NULL einsetzen, zum Beispiel eine 3 an der vierten Stelle der PLZ: LIKE '___3%'.
4. Du kannst in der Ausgabe rechnen und Datumsfunktionen der SQL-Syntax einsetzen, zum Beispiel Menge * Preis, YEAR, MONTH, WEEKDAY, NOW() oder die Differenz zweier Zeitpunkte in Minuten mit DATEDIFF(minute, Plan, Ist).
5. Du kannst mit ORDER BY auf- und absteigend nach einer oder mehreren Spalten sortieren, zum Beispiel absteigend nach Datum und Uhrzeit oder erst nach Menge absteigend, dann nach Preis aufsteigend.
6. Du kannst Textfunktionen aus der SQL-Syntax einsetzen, LEFT(Text, n) und RIGHT(Text, n) für die ersten bzw. letzten n Zeichen (z. B. LEFT(PLZ, 2) für die Leitregion), und eine Zeichenkette mit der Funktion, die die Aufgabe vorgibt, am Leerzeichen in Vorname und Nachname zerlegen.

**Bewusst nicht enthalten:**

- Schreibweisen einzelner Datenbanksysteme aus IHK-Lösungen lernst du nicht als eigene Form: Aliasnamen in eckigen Klammern ([Name der Haltestelle]), Text in doppelten ("abc") oder typografischen Anführungszeichen, YEAR(TODAY) statt YEAR(NOW()), SUBSTRING mit Trennzeichen statt einer vorgegebenen Funktion. Du schreibst Text in einfachen Anführungszeichen ('abc') und Aliasnamen mit Leerzeichen in doppelten Anführungszeichen (AS "Name der Haltestelle").

#### PB2-5-1-2 Abfragen über mehrere Tabellen: JOIN

**Ziel:** Tabellen über Primär- und Fremdschlüssel verknüpfen, auch drei und mehr, mit LEFT JOIN alle Datensätze einer Seite behalten und eine Tabelle zweimal einbinden.

**Baut auf:** Relationales Modell: Tabellen, Schlüssel, Datentypen, Integrität (PB1)

**Das musst du können:**

1. Du kannst zwei Tabellen mit INNER JOIN … ON über Primär- und Fremdschlüssel verbinden (oder gleichwertig über FROM mit Komma und WHERE-Bedingung).
2. Du kannst drei und mehr Tabellen in einer Abfrage verketten, auch über eine Zwischentabelle einer m:n-Beziehung, und Tabellen mit Aliasnamen abkürzen, damit gleichnamige Spalten eindeutig sind.
3. Du kannst mit LEFT JOIN alle Datensätze der linken Tabelle ausgeben, auch wenn rechts kein passender Datensatz da ist (z. B. Mitarbeiter ohne Urlaub, Haushalte ohne Zähler), und schreibst eine Bedingung für die rechte Tabelle in ON statt in WHERE (… LEFT JOIN Fehlzeit Fz ON Ma.Ma_ID = Fz.Ma_ID AND Fz.FzA_ID = 2 AND YEAR(Fz.VonDat) = 2022), weil WHERE die Zeilen ohne Partner wieder entfernt; RIGHT JOIN ist das Spiegelbild.
4. Du kannst dieselbe Tabelle zweimal mit verschiedenen Aliasnamen einbinden, zum Beispiel die Zählerstände 2021 und 2022 je Zähler in einer Zeile gegenüberstellen und S22.ZSt_Stand - S21.ZSt_Stand berechnen; damit Zähler ohne Stand erhalten bleiben (Verbrauch NULL), verbindest du beide mit LEFT JOIN und der Jahresbedingung in ON (alternativ: zwei korrelierte Unterabfragen, PB2-5-1-4).

#### PB2-5-1-3 Aggregatfunktionen, GROUP BY und HAVING

**Ziel:** Werte mit COUNT, SUM, AVG, MIN und MAX zusammenfassen, je Gruppe ausgeben, Gruppen filtern und nach dem Ergebnis sortieren; die weiteren Aggregatfunktionen des SQL-Auszugs erkennen.

**Das musst du können:**

1. Du kannst COUNT, SUM, AVG, MIN und MAX einsetzen und COUNT(*) (alle Zeilen) von COUNT(Spalte) (nur Zeilen, in denen die Spalte nicht NULL ist) unterscheiden; nach einem LEFT JOIN zählst du mit COUNT(Spalte der rechten Tabelle), dann ergibt eine Zeile ohne Partner 0, SUM und AVG liefern dort NULL.
2. Du kannst mit GROUP BY je Gruppe ein Ergebnis ausgeben, auch gruppiert nach einem Ausdruck wie YEAR(AK_DatumZeit), und schreibst jede nicht aggregierte Spalte der Ausgabe auch ins GROUP BY; so ist die Abfrage in jedem Datenbanksystem richtig.
3. Du kannst mit HAVING Gruppen filtern und HAVING von WHERE unterscheiden: WHERE filtert Zeilen vor dem Gruppieren, HAVING filtert Gruppen danach, zum Beispiel Kunden mit mindestens drei Bestellungen.
4. Du kannst Aggregate mit JOIN verbinden und nach dem aggregierten Wert sortieren, zum Beispiel Umsatz je Kunde über mehrere Tabellen oder Verkaufsanzahl je Kategorie absteigend.
5. Du kannst die weiteren Aggregatfunktionen des SQL-Auszugs erkennen: STDDEV(Spalte) für die Standardabweichung, VARIANCE(Spalte) für die Varianz und CORR(Spalte1, Spalte2) für die Korrelation zweier Merkmale (nahe 1 oder −1 starker Zusammenhang, nahe 0 keiner); sie werden wie AVG nach der Beschreibung im Auszug eingesetzt.

#### PB2-5-1-4 Unterabfragen und UNION

**Ziel:** Unterabfragen in WHERE, in der SELECT-Liste und in FROM einsetzen, auch korreliert, und Ergebnisse zweier Abfragen mit UNION oder UNION ALL vereinigen.

**Das musst du können:**

1. Du kannst eine Unterabfrage in der WHERE-Bedingung mit IN oder NOT IN einsetzen, zum Beispiel Kunden ohne Bestellung: WHERE KID NOT IN (SELECT KID FROM Bestellungen), und weißt, dass NOT IN gar keine Zeile liefert, sobald die Unterabfrage einen NULL-Wert enthält; dann nimmst du NOT EXISTS (PB2-5-1-4-K6).
2. Du kannst eine Unterabfrage einsetzen, die genau einen Wert liefert, und damit vergleichen oder rechnen, zum Beispiel das teuerste Arzneimittel: WHERE Preis = (SELECT MAX(Preis) FROM Arzneimittel).
3. Du kannst eine Unterabfrage in FROM verwenden und ihr mit AS einen Namen geben, zum Beispiel erst die Anzahl je Patient zählen und davon den Durchschnitt bilden.
4. Du kannst die Ergebnisse zweier Abfragen vereinigen, mit UNION (doppelte Zeilen entfernt) oder UNION ALL (alle Zeilen bleiben), zum Beispiel aktuelle Tabelle und Archiv: Spaltenzahl und Datentypen müssen passen, die Spaltennamen kommen aus der ersten Abfrage, jede Teilabfrage wird für sich gruppiert und ORDER BY steht nur einmal am Ende.
5. Du kannst in der SELECT-Liste eine korrelierte Unterabfrage schreiben, die sich auf die aktuelle Zeile der äußeren Abfrage bezieht, zum Beispiel je Kunde (SELECT AVG(RP.RgPos_EinzelPreis * RP.RgPos_Mg) FROM RechnungPosition RP INNER JOIN Rechnung R ON R.Rg_IdKey = RP.RgPos_RgIdKey WHERE R.Rg_KdIdKey = Kunde.Kd_IdKey) AS Umsatz, und weißt, dass sie ohne passende Zeile NULL liefert (COUNT liefert 0).
6. Du kannst eine korrelierte Unterabfrage in WHERE einsetzen, mit EXISTS bzw. NOT EXISTS oder mit einem Vergleich, zum Beispiel Haushalte ohne Zähler (FROM Haushalte h): WHERE NOT EXISTS (SELECT * FROM Zaehler z WHERE z.Z_HHID = h.HH_ID) oder WHERE (SELECT COUNT(*) FROM Zaehler z WHERE z.Z_HHID = h.HH_ID) = 0.

#### PB2-5-1-5 Übung: Vorgegebenes Tabellenmodell lesen und den Weg der Abfrage finden

**Ziel:** In einem vorgegebenen relationalen Modell oder Tabellenauszug Primär- und Fremdschlüssel und den JOIN-Pfad für eine Abfrage finden, Datentypen in Bedingungen beachten und an der Ergebnistabelle ablesen, welche Tabellen und welcher JOIN nötig sind.

**Baut auf:** Relationales Modell: Tabellen, Schlüssel, Datentypen, Integrität (PB1); ER-Modell aus Anforderungen erstellen und erweitern (PB1); Redundanz, Anomalien und Normalisierung bis zur 3. Normalform (PB1); Relationale Tabellen: Primär- und Fremdschlüssel (AP1)

**Das musst du können:**

1. Du kannst in einem vorgegebenen relationalen Modell oder Tabellenauszug für eine Abfrage den JOIN-Pfad bestimmen: an Primär- und Fremdschlüsseln ablesen, welche Tabellen über welche Spaltenpaare verbunden werden, auch über eine Zwischentabelle, von der keine Spalte ausgegeben wird (Wirkstoff – Arzneimittelwirkstoffe – Arzneimittel – Hersteller). _(neu gegenüber: Relationales Modell: Tabellen, Schlüssel, Datentypen, Integrität (PB1) – Ein fremdes, vorgegebenes Modell als Weg für eine Abfrage lesen und den JOIN-Pfad über Zwischentabellen bestimmen; in PB1-6-1-2 wird das Modell selbst erstellt.)_
2. Du kannst die passende JOIN-Bedingung festlegen, wenn eine Tabelle mehrere Fremdschlüssel auf dieselbe Tabelle hat (MID_Soll und MID_Ist in Pflegearbeit) oder zwei Wege zum Ziel bestehen: Ist-Zeiten werden über die Plan-ID (HStZ_HStPIdKey) verbunden, nicht nur über die Haltestelle, sonst entstehen falsche Kombinationen.
3. Du kannst den Datentyp einer Spalte aus Modell oder Aufgabentext in der Bedingung berücksichtigen: eine als Zeichenkette angelegte PLZ in einfachen Anführungszeichen und mit LIKE ('___3%', '508%'), einen Wahrheitswert (Boolean) mit = TRUE bzw. = FALSE (rezeptpflichtig = FALSE), ein Datum mit YEAR(…) oder einem Bereich. _(neu gegenüber: Relationales Modell: Tabellen, Schlüssel, Datentypen, Integrität (PB1) – Den Datentyp beim Formulieren von Bedingungen nutzen (Textvergleich mit LIKE, Wahrheitswert, Datum); in PB1-6-1-2 werden Datentypen nur beim Entwurf zugewiesen.)_
4. Du kannst aus der verlangten Ergebnistabelle und dem Modell ableiten, welche Tabellen die Abfrage braucht und ob ein INNER JOIN reicht: Zeilen mit 0 oder leerem Wert (Mitarbeiter ohne Urlaub, Kunde ohne Rechnung) zeigen Datensätze ohne Partner, dann brauchst du LEFT JOIN oder eine korrelierte Unterabfrage.

## PB2-6 SQL: Tabellen, Datenpflege und Rechte

### PB2-6-1 Datenbank aufbauen, pflegen und absichern

_Tabellen, Indizes und weitere Datenbankobjekte anlegen und ändern, Daten einfügen, ändern, löschen und archivieren, gleichzeitige Zugriffe absichern, Benutzer, Rollen und Rechte verwalten und Daten vor einem Import prüfen. Abfragen mit SELECT, JOIN und Unterabfragen kennst du aus PB2-5, Datenmodell, Normalisierung und Datentypen aus PB1-6._

#### PB2-6-1-1 Tabellenstruktur, Index und Datenbankobjekte: CREATE TABLE, ALTER TABLE, CREATE INDEX, Prozedur, Trigger

**Ziel:** Tabellen nach einem Datenmodell mit Datentypen und Schlüsseln anlegen, nachträglich ändern, Indizes begründet anlegen und Stored Procedures und Trigger als weitere Datenbankobjekte beschreiben.

**Baut auf:** Relationales Modell: Tabellen, Schlüssel, Datentypen, Integrität (PB1); Redundanz, Anomalien und Normalisierung bis zur 3. Normalform (PB1); Relationale Tabellen: Primär- und Fremdschlüssel (AP1); Datenmengen und Speicherbedarf berechnen (AP1)

**Das musst du können:**

1. Du kannst mit CREATE TABLE eine Tabelle nach dem relationalen Modell anlegen: Spalten mit Datentypen aus der SQL-Syntax (z. B. INTEGER, DECIMAL(8,2), DOUBLE, CHAR(5), VARCHAR(30), DATE; BOOLEAN, wenn die Aufgabe ihn vorgibt), den Primärschlüssel mit PRIMARY KEY (Spalte) und Fremdschlüssel mit FOREIGN KEY (Spalte) REFERENCES Tabelle (Primärschlüssel).
2. Du kannst mit ALTER TABLE … ADD COLUMN, DROP COLUMN und MODIFY COLUMN Spalten hinzufügen, entfernen oder ändern und einen Fremdschlüssel ergänzen, bei einem Umbau in der richtigen Reihenfolge (neue Spalten anlegen, Daten mit UPDATE übertragen, z. B. mit Textfunktionen aus PB2-5-1-1, alte Spalte löschen), und eine ganze Tabelle mit DROP TABLE löschen.
3. Du kannst eine Spalte einer gefüllten Tabelle nachträglich zum Pflichtfeld machen: zuerst fehlende Werte füllen (UPDATE Aerzte SET Email = 'info@fit.de' WHERE Email IS NULL), dann die Spalte ändern (ALTER TABLE Aerzte MODIFY COLUMN Email VARCHAR(100) NOT NULL; in der Form des SQL-Auszugs wird der Datentyp mit angegeben).
4. Du kannst erklären, wozu ein Index dient (schnelleres Suchen und Sortieren in großen Tabellen) und welchen Nachteil er hat (zusätzlicher Speicher, langsameres Einfügen und Ändern).
5. Du kannst mit CREATE INDEX einen benannten Index auf eine Spalte anlegen, zum Beispiel CREATE INDEX Idx_Datum ON Zaehlerstand (ZSt_Datum).
6. Du kannst beschreiben, was eine Stored Procedure ist: eine in der Datenbank gespeicherte Folge von SQL-Anweisungen mit Namen und Parametern, die von Anwendungen oder dem Datenbank-Client ausdrücklich aufgerufen wird.
7. Du kannst beschreiben, was ein Trigger ist: SQL-Anweisungen, die die Datenbank automatisch ausführt, wenn in einer Tabelle ein bestimmtes Ereignis eintritt (INSERT, UPDATE oder DELETE), zum Beispiel um Änderungen zu protokollieren – im Unterschied zur Stored Procedure, die ausdrücklich aufgerufen wird.

#### PB2-6-1-2 Datenpflege: INSERT, UPDATE, DELETE und Archivieren

**Ziel:** Datensätze einfügen, ändern und löschen, auch mit Unterabfragen über verknüpfte Tabellen, Daten in ein Archiv verschieben und gleichzeitige Zugriffe durch passendes Sperren absichern.

**Baut auf:** Transaktionen und Datenintegrität (PB1); Relationales Modell: Tabellen, Schlüssel, Datentypen, Integrität (PB1)

**Das musst du können:**

1. Du kannst mit INSERT INTO … (Spaltenliste) VALUES … einen Datensatz einfügen und mit INSERT INTO … SELECT … Datensätze aus einer Abfrage übernehmen.
2. Du kannst mit UPDATE … SET … WHERE Werte ändern, auch berechnet aus der Spalte selbst (Preis = Preis * 1.05), und die Zeilen über Bedingungen in verknüpften Tabellen auswählen, in Standard-SQL mit Unterabfragen in WHERE: … WHERE HerstellerID = (SELECT HerstellerID FROM Hersteller WHERE Bezeichnung = 'CCC') oder je Bedingung eine IN-Unterabfrage, z. B. … WHERE RgPos_ArtIdKey IN (SELECT a.Art_IdKey FROM Artikel a INNER JOIN WeinArt w ON w.WA_IdKey = a.Art_WAIdKey WHERE w.WA_Weinart = 'Rotwein') AND RgPos_RgIdKey IN (SELECT Rg_IdKey FROM Rechnung WHERE YEAR(Rg_Datum) = 2023 AND MONTH(Rg_Datum) = 5).
3. Du kannst mit DELETE FROM … WHERE Datensätze löschen, auch mit einer Unterabfrage, z. B. Haushalte ohne Zähler: DELETE FROM Haushalte WHERE NOT EXISTS (SELECT * FROM Zaehler WHERE Zaehler.Z_HHID = Haushalte.HH_ID) oder WHERE HH_ID NOT IN (SELECT Z_HHID FROM Zaehler), solange Z_HHID nie NULL ist, und weißt, dass ohne WHERE alle Zeilen gelöscht werden.
4. Du kannst Datensätze in eine gleich aufgebaute Archivtabelle verschieben: mit INSERT INTO Archiv (Spaltenliste) SELECT … WHERE … kopieren (z. B. WHERE YEAR(AK_DatumZeit) < YEAR(NOW())) und mit DELETE … WHERE mit derselben Bedingung löschen, beides in einer Transaktion.
5. Du kannst bei gleichzeitigen Zugriffen begründen, ob Datensätze früh und lange gesperrt werden (pessimistisch, z. B. alle freien Termine eines Monats schon beim Anzeigen blockieren) oder spät und kurz (optimistisch: erst beim Bestätigen sperren und prüfen, ob der Termin noch frei ist, bei Konflikt neu anbieten): Lange Sperren blockieren andere Nutzer unnötig, kurze Sperren brauchen eine Konfliktbehandlung. _(neu gegenüber: Transaktionen und Datenintegrität (PB1) – Sperren bei gleichzeitigen Zugriffen und ihre Dauer begründet wählen (pessimistisch oder optimistisch); PB1-6-1-5 beschreibt nur ACID mit Isolation und wann eine Transaktion nötig ist.)_

**Bewusst nicht enthalten:**

- Herstellerspezifische Formen der Datenpflege aus IHK-Lösungen lernst du nicht als eigene Schreibweise: SELECT … INTO Tabelle zum Kopieren (SQL Server, legt eine neue Tabelle an) und UPDATE … SET … FROM … INNER JOIN (SQL Server). Du schreibst INSERT INTO … SELECT und UPDATE mit Unterabfrage in WHERE.

#### PB2-6-1-3 Benutzer, Rollen und Rechte: CREATE USER, GRANT, REVOKE

**Ziel:** Benutzer und Rollen anlegen und ihnen gezielt Lese- und Schreibrechte auf Tabellen oder Datenbanken geben und wieder entziehen.

**Baut auf:** Authentifizierung, Autorisierung und Identity & Access Management (PB1); Bedrohungsszenarien und präventive Maßnahmen (PB1); Schadsoftware erkennen und abwehren (AP1)

**Das musst du können:**

1. Du kannst mit CREATE USER einen Benutzer mit Passwort anlegen (CREATE USER Name IDENTIFIED BY 'Passwort').
2. Du kannst mit GRANT ein oder mehrere Rechte (durch Komma getrennt) gezielt vergeben, Leserecht = SELECT, Schreibrechte = INSERT, UPDATE, DELETE, auf eine Tabelle (Datenbank.Tabelle), alle Tabellen einer Datenbank (Datenbank.*) oder alles (*.*), zum Beispiel GRANT INSERT, UPDATE, DELETE ON NotaufnahmeManagement.Verschreibungen TO hhorner.
3. Du kannst mit REVOKE ein oder mehrere Rechte wieder entziehen, zum Beispiel die Schreibrechte: REVOKE INSERT, UPDATE, DELETE ON NotaufnahmeManagement.Verschreibungen FROM sklinkel.
4. Du kannst Rechte über Rollen vergeben: eine Rolle anlegen (CREATE ROLE Sachbearbeitung), ihr Rechte geben (GRANT SELECT ON Klinik.* TO Sachbearbeitung), die Rolle einem Benutzer zuweisen (GRANT Sachbearbeitung TO hhorner) und wieder entziehen (REVOKE Sachbearbeitung FROM hhorner); WITH GRANT OPTION erlaubt dem Empfänger, ein Recht weiterzugeben.

#### PB2-6-1-5 Datenqualität vor einem Import prüfen

**Ziel:** Einen gelieferten Datenbestand auf Qualitätsmängel prüfen, Folgen eines Imports benennen, einen Importweg aufzeigen und den Import beurteilen. Daten heterogener Quellen bereinigen und zusammenführen kennst du aus PB1-7-1-3.

**Baut auf:** Daten heterogener Quellen zusammenführen: Data Lake, Open Data (PB1); XML: wohlgeformt, gültig, DTD und Schema (PB1); Transaktionen und Datenintegrität (PB1)

**Das musst du können:**

1. Du kannst Qualitätsmängel in einem Datenbestand beschreiben und je eine Folge des Imports nennen, zum Beispiel uneinheitliche Formate (Datum), mehrere Werte in einem Feld, fehlende oder ungültige Werte, Dubletten, unterschiedliche Schreibweisen → falsche Auswertungen, abgelehnte Datensätze, verletzte Schlüssel. _(neu gegenüber: Daten heterogener Quellen zusammenführen: Data Lake, Open Data (PB1), XML: wohlgeformt, gültig, DTD und Schema (PB1) – Mängel in einem konkreten, gelieferten Bestand finden und je eine Folge des Imports benennen (abgebrochener Import, doppelt geführte Personen, erschwerte Auswertung); PB1-7-1-3 setzt beim Bereinigen voraus, dass die Mängel bekannt sind, PB1-7-1-1 prüft nur gegen ein Schema.)_
2. Du kannst Wege aufzeigen, mangelhafte Daten dennoch zu importieren: die Daten vorher von Hand verbessern oder ein Importprogramm mit allen nötigen Fehlerbehandlungen schreiben, das fehlerhafte Datensätze abweist und protokolliert; das Bereinigen und Vereinheitlichen selbst kennst du aus PB1-7-1-3. _(neu gegenüber: Daten heterogener Quellen zusammenführen: Data Lake, Open Data (PB1) – Den Importweg für einen mangelhaften Bestand wählen: manuell nachbessern oder Importprogramm mit Fehlerbehandlung und Protokoll abgewiesener Datensätze.)_
3. Du kannst beurteilen, ob ein Datenbestand ohne Nacharbeit importiert werden kann, und für oder gegen den Import argumentieren, etwa mit Aufwand der Bereinigung gegen Nutzen der Daten. _(neu gegenüber: Daten heterogener Quellen zusammenführen: Data Lake, Open Data (PB1) – Abwägen, ob sich der Import eines konkreten Bestands lohnt (Aufwand der Bereinigung gegen Wert der Daten); PB1-7-1-3 führt Daten zusammen, ohne diese Entscheidung.)_
