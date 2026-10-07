// Probeprüfung PB2 – eigene Aufgaben zu einer fiktiven Firma (keine Übernahme aus echten Prüfungen).

const KLASSEN_AUSLEIHE = `Ausleihe
---------------------------------------
- leserNr: String
- exemplarNr: String
- faelligAm: Date
- zurueckAm: Date        (null = noch nicht zurückgegeben)
---------------------------------------
+ getLeserNr(): String
+ getExemplarNr(): String
+ getFaelligAm(): Date
+ getZurueckAm(): Date

Mahnfall
---------------------------------------
- leserNr: String
- anzahlMedien: int
- gebuehr: double
---------------------------------------
+ Mahnfall(leserNr: String)   (anzahlMedien = 0, gebuehr = 0.0)
+ addMedium(betrag: double): void
+ getLeserNr(): String
+ getAnzahlMedien(): int
+ getGebuehr(): double`;

const TESTCODE = `public static int gesamtGebuehrCent(int[] tageUeberfaellig) {
    if (tageUeberfaellig == null || tageUeberfaellig.length == 0) {
        throw new IllegalArgumentException("Keine Ausleihen übergeben");
    }
    int summe = 0;
    for (int i = 0; i < tageUeberfaellig.length; i++) {
        int gebuehr = 0;
        if (tageUeberfaellig[i] >= 3) {
            gebuehr = tageUeberfaellig[i] * 25;
        }
        if (gebuehr > 600) {
            gebuehr = 600;
        }
        summe = gebuehr;
    }
    return summe;
}`;

export default {
  id: 'pb2-01',
  teil: 'PB2',
  titel: 'Regalwerk Software – Bibliothekssoftware „Ausleihwerk“',
  situation:
    'Die Regalwerk Software GmbH in Fulda entwickelt die Bibliothekssoftware „Ausleihwerk“ für Stadtbibliotheken. ' +
    'Sie steuert die Ausleihe an Selbstverbuchungsterminals, verwaltet Vormerkungen und erzeugt Mahnungen automatisch. ' +
    'Die Stadtbibliothek Auenstadt (Hauptstelle und eine Zweigstelle, rund 9 000 aktive Leserinnen und Leser) führt „Ausleihwerk“ gerade ein ' +
    'und wünscht mehrere Erweiterungen. Sie arbeiten als Fachinformatikerin bzw. Fachinformatiker für Anwendungsentwicklung im Projektteam.',
  aufgaben: [
    // ---------------------------------------------------------------- 1 Algorithmus
    {
      id: 'pb2-01-1',
      art: 'algorithmus',
      titel: 'Mahnlauf',
      punkte: 30,
      sp: ['AP2-3-2-2', 'AP2-3-3-1', 'AP2-3-2-1'],
      situation:
        'Die Stadtbibliothek Auenstadt nutzt die Bibliothekssoftware „Ausleihwerk“. Einmal am Tag startet ein Mahnlauf. ' +
        'Er soll alle offenen, deutlich überfälligen Ausleihen finden und je Leserin bzw. Leser einen Mahnfall mit Gebühr anlegen. ' +
        'Die Ausleihen liegen als Liste von Objekten der Klasse `Ausleihe` vor.',
      vorgaben: [
        'Gegeben sind die folgenden Klassen (Auszug aus dem Klassendiagramm). `addMedium(betrag)` erhöht `anzahlMedien` um 1 und addiert `betrag` zur `gebuehr`.',
        { code: KLASSEN_AUSLEIHE, titel: 'Klassen Ausleihe und Mahnfall' },
        {
          tabelle: {
            titel: 'Generische Liste List<T>',
            kopf: ['Methode', 'Beschreibung'],
            zeilen: [
              ['`new List<T>()`', 'erzeugt eine leere Liste für Objekte vom Typ T'],
              ['`add(element: T): void`', 'hängt ein Element am Ende an'],
              ['`size(): int`', 'liefert die Anzahl der Elemente'],
              ['`get(index: int): T`', 'liefert das Element an der Position index (erstes Element: Index 0)'],
            ],
          },
        },
        {
          hinweis:
            '`Datum.tageZwischen(von: Date, bis: Date): int` liefert die Anzahl der Tage von `von` bis `bis` (negativ, wenn `bis` vor `von` liegt). ' +
            'Beispiel: `Datum.tageZwischen(2026-10-01, 2026-10-12)` liefert 11. Zeichenketten dürfen mit `==` verglichen werden. ' +
            'Sie dürfen Pseudocode oder eine Ihnen bekannte Programmiersprache (z. B. Java, C#) verwenden.',
        },
        {
          tabelle: {
            titel: 'Beispieldaten: Liste ausleihen (Stichtag 2026-10-12)',
            kopf: ['Index', 'leserNr', 'exemplarNr', 'faelligAm', 'zurueckAm'],
            zeilen: [
              ['0', 'L-1001', 'E-50211', '2026-10-01', 'null'],
              ['1', 'L-1002', 'E-50317', '2026-10-10', 'null'],
              ['2', 'L-1001', 'E-61045', '2026-09-02', 'null'],
              ['3', 'L-1003', 'E-50488', '2026-09-20', '2026-10-05'],
              ['4', 'L-1004', 'E-70031', '2026-10-08', 'null'],
              ['5', 'L-1003', 'E-61177', '2026-09-28', 'null'],
            ],
          },
        },
      ],
      teile: [
        {
          nr: 'a',
          punkte: 18,
          text:
            'Erstellen Sie die Methode `erstelleMahnfaelle`. Sie erhält die Liste aller Ausleihen und den Stichtag und liefert eine Liste von Mahnfällen. Dabei gilt:\n' +
            '- Eine Ausleihe wird nur berücksichtigt, wenn das Medium am Stichtag noch nicht zurückgegeben ist und der Stichtag **mehr als 3 Tage** nach dem Fälligkeitsdatum liegt.\n' +
            '- Die Gebühr für ein Medium beträgt 0,25 EUR je Tag zwischen Fälligkeitsdatum und Stichtag, **höchstens 6,00 EUR** je Medium.\n' +
            '- Je Leserin bzw. Leser gibt es in der Ergebnisliste genau einen Mahnfall. Existiert für die Lesernummer schon ein Mahnfall, wird das Medium dort mit `addMedium` ergänzt; sonst wird ein neuer Mahnfall angelegt und an die Ergebnisliste angehängt.\n' +
            'Für die Beispieldaten liefert die Methode die Mahnfälle L-1001 (2 Medien, 8,75 EUR), L-1004 (1 Medium, 1,00 EUR) und L-1003 (1 Medium, 3,50 EUR) in dieser Reihenfolge.',
          antwort: {
            art: 'code',
            zeilen: 22,
            rahmen:
              'public List<Mahnfall> erstelleMahnfaelle(List<Ausleihe> ausleihen, Date stichtag) {\n' +
              '    List<Mahnfall> ergebnis = new List<Mahnfall>();\n' +
              '    …\n' +
              '    return ergebnis;\n' +
              '}',
          },
          loesung: [
            'Musterlösung (Java-artiger Pseudocode; jede andere korrekte Lösung ist ebenfalls richtig):',
            {
              code: `public List<Mahnfall> erstelleMahnfaelle(List<Ausleihe> ausleihen, Date stichtag) {
    List<Mahnfall> ergebnis = new List<Mahnfall>();
    for (int i = 0; i < ausleihen.size(); i++) {
        Ausleihe a = ausleihen.get(i);
        int tage = Datum.tageZwischen(a.getFaelligAm(), stichtag);
        if (a.getZurueckAm() == null && tage > 3) {
            double betrag = tage * 0.25;
            if (betrag > 6.0) {
                betrag = 6.0;
            }
            // vorhandenen Mahnfall dieser Person suchen
            Mahnfall fall = null;
            for (int j = 0; j < ergebnis.size(); j++) {
                if (ergebnis.get(j).getLeserNr() == a.getLeserNr()) {
                    fall = ergebnis.get(j);
                }
            }
            if (fall == null) {
                fall = new Mahnfall(a.getLeserNr());
                ergebnis.add(fall);
            }
            fall.addMedium(betrag);
        }
    }
    return ergebnis;
}`,
            },
            'Durchlauf mit den Beispieldaten: Index 0 → 11 Tage → 2,75 EUR, neuer Mahnfall L-1001. Index 1 → 2 Tage → nicht berücksichtigt. ' +
              'Index 2 → 40 Tage → 10,00 EUR, gedeckelt auf 6,00 EUR, Mahnfall L-1001 gefunden → 2 Medien, 8,75 EUR. Index 3 → zurückgegeben → nicht berücksichtigt. ' +
              'Index 4 → 4 Tage → 1,00 EUR, neuer Mahnfall L-1004. Index 5 → 14 Tage → 3,50 EUR, neuer Mahnfall L-1003.',
            'Gleichwertig: Deckelung mit `Math.min(tage * 0.25, 6.0)`; Suche mit `while` und Abbruch, sobald der Mahnfall gefunden ist; Prüfung `zurueckAm == null` in einer eigenen `if`-Anweisung vor der Tagesberechnung.',
          ],
          bewertung: [
            'Schleife über alle Ausleihen mit Zugriff über get: 2 P',
            'Tage mit Datum.tageZwischen in der richtigen Reihenfolge (Fälligkeit → Stichtag) ermitteln: 2 P',
            'Bedingung „nicht zurückgegeben“ und „mehr als 3 Tage“ korrekt verknüpft: 3 P',
            'Gebühr berechnen und auf 6,00 EUR begrenzen: 3 P',
            'In der Ergebnisliste nach einem Mahnfall mit gleicher Lesernummer suchen (innere Schleife oder Hilfsmethode): 4 P',
            'Falls nicht vorhanden: neuen Mahnfall mit Lesernummer erzeugen und der Ergebnisliste hinzufügen: 2 P',
            'addMedium mit der berechneten Gebühr auf dem richtigen Mahnfall aufrufen: 2 P',
            'andere korrekte Lösungen und Notationen werden voll bewertet',
          ],
        },
        {
          nr: 'b',
          punkte: 12,
          sp: ['AP2-3-2-2', 'AP2-3-2-1'],
          text:
            'Für eine Übersicht an der Servicetheke wird der Mahnfall mit der höchsten Gebühr benötigt.\n' +
            'Erstellen Sie die Methode `hoechsterMahnfall`. Sie erhält eine Liste von Mahnfällen, z. B. das Ergebnis der Methode aus Teil a (Sie dürfen davon ausgehen, dass diese korrekt umgesetzt ist), und liefert den Mahnfall mit der höchsten Gebühr. ' +
            'Haben mehrere Mahnfälle dieselbe höchste Gebühr, wird der mit den meisten Medien geliefert. Ist die Liste `null` oder leer, liefert die Methode `null`.\n' +
            'Für das Ergebnis aus Teil a liefert die Methode den Mahnfall L-1001. Gebühren sind centgenau; der Vergleich mit `==` ist hier zulässig.',
          antwort: {
            art: 'code',
            zeilen: 14,
            rahmen: 'public Mahnfall hoechsterMahnfall(List<Mahnfall> faelle) {\n    …\n}',
          },
          loesung: [
            {
              code: `public Mahnfall hoechsterMahnfall(List<Mahnfall> faelle) {
    if (faelle == null || faelle.size() == 0) {
        return null;
    }
    Mahnfall max = faelle.get(0);
    for (int i = 1; i < faelle.size(); i++) {
        Mahnfall f = faelle.get(i);
        if (f.getGebuehr() > max.getGebuehr()
            || (f.getGebuehr() == max.getGebuehr()
                && f.getAnzahlMedien() > max.getAnzahlMedien())) {
            max = f;
        }
    }
    return max;
}`,
            },
            'Wichtig: Der Startwert ist das erste Element der Liste (nicht 0 oder ein erfundener Wert); die Schleife kann deshalb bei Index 1 beginnen. Bei völlig gleichen Mahnfällen bleibt der zuerst gefundene stehen.',
            'Für L-1001 (8,75 EUR), L-1004 (1,00 EUR), L-1003 (3,50 EUR) bleibt max bei L-1001.',
          ],
          bewertung: [
            'null oder leere Liste → Rückgabe null: 2 P',
            'Startwert: erstes Element der Liste: 2 P',
            'Schleife über die restlichen Elemente: 2 P',
            'Vergleich der Gebühr und Übernahme des größeren Mahnfalls: 3 P',
            'Regel bei Gleichstand (mehr Medien): 2 P',
            'Rückgabe des Mahnfall-Objekts: 1 P',
            'andere korrekte Lösungen werden voll bewertet',
          ],
        },
      ],
    },

    // ---------------------------------------------------------------- 2 Modell
    {
      id: 'pb2-01-2',
      art: 'modell',
      titel: 'Lebenszyklus eines Medienexemplars',
      punkte: 22,
      sp: ['AP2-2-1-5'],
      situation:
        'In der Bibliothekssoftware „Ausleihwerk“ hat jedes Medienexemplar (z. B. ein bestimmtes Buch mit eigener Exemplarnummer) einen Status. ' +
        'Damit Selbstverbuchungsterminal, Vormerksystem und Mahnwesen einheitlich arbeiten, soll das Verhalten eines Exemplars als UML-Zustandsdiagramm festgehalten werden.',
      vorgaben: [
        'Beschreibung des Verhaltens:\n' +
          '- Nach der Erfassung im Katalog ist ein Exemplar **verfügbar**.\n' +
          '- Ein verfügbares Exemplar kann ausgeliehen werden (Ereignis `ausleihen`). Dabei wird das Fälligkeitsdatum gesetzt (Aktion `faelligkeitSetzen()`). Das Exemplar ist dann **ausgeliehen**.\n' +
          '- Bei der Rückgabe (Ereignis `zurueckgeben`) wird das Exemplar wieder verfügbar, sofern für den Titel keine Vormerkung vorliegt. Liegt eine Vormerkung vor, wird es **zur Abholung bereitgestellt** und die vormerkende Person benachrichtigt (Aktion `benachrichtigen()`).\n' +
          '- Holt die vormerkende Person das Exemplar ab (Ereignis `abholen`), ist es ausgeliehen; das Fälligkeitsdatum wird gesetzt.\n' +
          '- Läuft die Abholfrist ab (Ereignis `abholfristAbgelaufen`), wird das Exemplar verfügbar, wenn keine weitere Vormerkung vorliegt. Liegt eine weitere Vormerkung vor, bleibt es bereitgestellt und die nächste Person wird benachrichtigt.\n' +
          '- Wird die Leihfrist überschritten (Ereignis `fristUeberschritten`), ist das Exemplar **überfällig**. Beim Eintritt in diesen Zustand wird eine Mahnung erzeugt (`mahnungErzeugen()`), solange der Zustand andauert, wird die Gebühr fortgeschrieben (`gebuehrFortschreiben()`).\n' +
          '- Ein überfälliges Exemplar wird an der Servicetheke zurückgenommen (Ereignis `zurueckgeben`); dabei wird die Gebühr gebucht (Aktion `gebuehrBuchen()`). Danach ist es – wie bei einer normalen Rückgabe – verfügbar oder bereitgestellt, je nachdem, ob eine Vormerkung vorliegt.\n' +
          '- Wird ein überfälliges Exemplar als verloren gemeldet (Ereignis `verlustGemeldet`), wird eine Ersatzrechnung erstellt (`ersatzrechnungErstellen()`) und das Exemplar scheidet aus dem Bestand aus.\n' +
          '- Wird an einem verfügbaren Exemplar ein Schaden festgestellt (Ereignis `schadenFestgestellt`), ist es **in Reparatur**. Nach der Reparatur (Ereignis `repariert`) ist es wieder verfügbar. Ist es nicht reparierbar (Ereignis `nichtReparierbar`), wird es ausgesondert (`aussondern()`) und scheidet aus dem Bestand aus.',
      ],
      teile: [
        {
          nr: 'a',
          punkte: 19,
          text:
            'Erstellen Sie zu der Beschreibung ein UML-Zustandsdiagramm. Beschriften Sie die Übergänge vollständig nach dem Schema `Ereignis [Bedingung] / Aktion` und tragen Sie die Aktionen innerhalb eines Zustands (entry, do) ein. Verwenden Sie Start- und Endzustand.',
          antwort: { art: 'papier' },
          loesung: [
            'Zustände: Verfügbar, Ausgeliehen, Bereitgestellt (zur Abholung), Überfällig (`entry / mahnungErzeugen()`, `do / gebuehrFortschreiben()`), In Reparatur; dazu ein Startzustand und ein Endzustand (zwei Endzustände sind ebenfalls richtig).',
            {
              tabelle: {
                titel: 'Übergänge der Musterlösung',
                kopf: ['von', 'nach', 'Beschriftung'],
                zeilen: [
                  ['Start', 'Verfügbar', '(ohne Beschriftung oder „erfasst“)'],
                  ['Verfügbar', 'Ausgeliehen', 'ausleihen / faelligkeitSetzen()'],
                  ['Ausgeliehen', 'Verfügbar', 'zurueckgeben [keine Vormerkung]'],
                  ['Ausgeliehen', 'Bereitgestellt', 'zurueckgeben [Vormerkung vorhanden] / benachrichtigen()'],
                  ['Bereitgestellt', 'Ausgeliehen', 'abholen / faelligkeitSetzen()'],
                  ['Bereitgestellt', 'Verfügbar', 'abholfristAbgelaufen [keine weitere Vormerkung]'],
                  ['Bereitgestellt', 'Bereitgestellt (Selbstübergang)', 'abholfristAbgelaufen [weitere Vormerkung] / benachrichtigen()'],
                  ['Ausgeliehen', 'Überfällig', 'fristUeberschritten'],
                  ['Überfällig', 'Verfügbar', 'zurueckgeben [keine Vormerkung] / gebuehrBuchen()'],
                  ['Überfällig', 'Bereitgestellt', 'zurueckgeben [Vormerkung vorhanden] / gebuehrBuchen(); benachrichtigen()'],
                  ['Überfällig', 'Ende', 'verlustGemeldet / ersatzrechnungErstellen()'],
                  ['Verfügbar', 'In Reparatur', 'schadenFestgestellt'],
                  ['In Reparatur', 'Verfügbar', 'repariert'],
                  ['In Reparatur', 'Ende', 'nichtReparierbar / aussondern()'],
                ],
              },
            },
            'Gleichwertig: Die beiden Rückgabe-Übergänge aus „Ausgeliehen“ bzw. „Überfällig“ führen zuerst in einen Entscheidungsknoten (Raute), von dem zwei Pfeile mit den Bedingungen [Vormerkung vorhanden] / [keine Vormerkung] abgehen. Die Benachrichtigung darf auch als `entry / benachrichtigen()` im Zustand „Bereitgestellt“ stehen.',
          ],
          bewertung: [
            'Start- und Endzustand(e) richtig eingesetzt: 1 P',
            'je Zustand (Verfügbar, Ausgeliehen, Bereitgestellt, Überfällig, In Reparatur) 1 P: 5 P',
            'entry- und do-Aktion im Zustand Überfällig: 1 P',
            'ausleihen / faelligkeitSetzen(): 1 P',
            'Rückgabe aus Ausgeliehen mit beiden Bedingungen (und Aktion): 2 P',
            'abholen / faelligkeitSetzen(): 1 P',
            'Ablauf der Abholfrist mit beiden Bedingungen inkl. Selbstübergang: 2 P',
            'fristUeberschritten: 1 P',
            'Rückgabe aus Überfällig mit gebuehrBuchen() und beiden Bedingungen: 2 P',
            'verlustGemeldet / ersatzrechnungErstellen() zum Endzustand: 1 P',
            'schadenFestgestellt und repariert: 1 P',
            'nichtReparierbar / aussondern() zum Endzustand: 1 P',
            'andere fachgerechte Darstellungen werden voll bewertet',
          ],
        },
        {
          nr: 'b',
          punkte: 3,
          text: 'Erläutern Sie an einem Übergang aus Ihrem Diagramm, was jeweils mit **Ereignis**, **Bedingung (Guard)** und **Aktion** gemeint ist.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            'Beispiel `zurueckgeben [Vormerkung vorhanden] / benachrichtigen()` von „Ausgeliehen“ nach „Bereitgestellt“:',
            '- **Ereignis** `zurueckgeben`: der Auslöser – etwas, das von außen eintritt (hier die Rückgabe am Terminal). Nur wenn es eintritt, kann der Übergang schalten.\n' +
              '- **Bedingung** `[Vormerkung vorhanden]`: wird beim Eintreten des Ereignisses geprüft; nur wenn sie wahr ist, wird genau dieser Übergang genommen. Sie unterscheidet hier zwischen den beiden möglichen Zielzuständen.\n' +
              '- **Aktion** `benachrichtigen()`: wird beim Schalten des Übergangs ausgeführt (hier wird die vormerkende Person informiert), bevor der neue Zustand erreicht ist.',
          ],
          bewertung: ['je richtig erläutertem Begriff 1 P (max. 3 P)', 'der Bezug auf einen eigenen Übergang ist erforderlich; andere passende Beispiele sind richtig'],
        },
      ],
    },

    // ---------------------------------------------------------------- 3 Test
    {
      id: 'pb2-01-3',
      art: 'test',
      titel: 'Test der Gebührenberechnung',
      punkte: 20,
      sp: ['AP2-5-2-3', 'AP2-5-1-2', 'AP2-5-2-2'],
      situation:
        'Bevor die Bibliothekssoftware „Ausleihwerk“ in der Stadtbibliothek Auenstadt in Betrieb geht, prüft das Projektteam die Gebührenberechnung. ' +
        'Ein Kollege hat dafür die unten stehende Java-Methode `gesamtGebuehrCent` geschrieben (Vorgaben zur Berechnung siehe Teil b).',
      vorgaben: [{ code: TESTCODE, nummern: true, titel: 'Java-Methode gesamtGebuehrCent' }],
      teile: [
        {
          nr: 'aa',
          punkte: 3,
          sp: ['AP2-5-1-2'],
          text: 'Beschreiben Sie, was ein Unit-Test ist und welchen Nutzen automatisierte Unit-Tests haben, wenn „Ausleihwerk“ später weiterentwickelt wird.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            'Ein Unit-Test (Komponenten- oder Modultest) prüft die kleinste testbare Einheit – meist eine einzelne Methode oder Klasse – isoliert vom Rest des Systems. Er ruft sie mit festgelegten Eingaben auf und vergleicht das tatsächliche mit dem erwarteten Ergebnis; Abhängigkeiten werden bei Bedarf durch Platzhalter (Mocks/Stubs) ersetzt.',
            'Nutzen bei der Weiterentwicklung (u. a.):\n' +
              '- Tests laufen automatisch und schnell bei jeder Änderung (z. B. im Build/CI) – Fehler fallen früh auf.\n' +
              '- Sie wirken als Regressionstest: eine Änderung, die bestehendes Verhalten zerstört, wird sofort erkannt.\n' +
              '- Fehler lassen sich genau einer Methode zuordnen; Umbauten (Refactoring) werden sicherer.\n' +
              '- Die Tests dokumentieren das erwartete Verhalten.',
          ],
          bewertung: ['Beschreibung Unit-Test (kleinste Einheit, isoliert, Soll-Ist-Vergleich): 2 P', 'ein Nutzen bei der Weiterentwicklung: 1 P', 'andere sinnvolle Antworten sind richtig'],
        },
        {
          nr: 'ab',
          punkte: 3,
          sp: ['AP2-5-2-2'],
          text: 'Für die Methode `gesamtGebuehrCent` wird eine Zweigüberdeckung von 100 % gefordert. Erläutern Sie diesen Begriff und grenzen Sie ihn von der Anweisungsüberdeckung ab.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            'Zweigüberdeckung (C1) von 100 % heißt: Die Testfälle sorgen dafür, dass jeder Zweig des Programms mindestens einmal durchlaufen wird – jede Entscheidung (if-Bedingung, Schleifenbedingung) muss also insgesamt mindestens einmal wahr und einmal falsch ausgewertet werden.',
            'Anweisungsüberdeckung (C0) verlangt nur, dass jede Anweisung mindestens einmal ausgeführt wird. Ein `if` ohne `else` ist damit schon abgedeckt, wenn die Bedingung einmal wahr ist; der leere „falsch“-Zweig wird nicht geprüft. 100 % Zweigüberdeckung schließt 100 % Anweisungsüberdeckung ein, aber nicht umgekehrt.',
          ],
          bewertung: ['Erläuterung Zweigüberdeckung: 2 P', 'Abgrenzung zur Anweisungsüberdeckung: 1 P'],
        },
        {
          nr: 'b',
          punkte: 10,
          sp: ['AP2-5-2-3', 'AP2-5-2-1'],
          text:
            'Die Methode `gesamtGebuehrCent` soll die Mahngebühr einer Leserin bzw. eines Lesers in Cent berechnen. Das Array enthält für jedes ausgeliehene Medium die Anzahl der Tage, um die es überfällig ist. Vorgaben:\n' +
            '- Für ein Medium fällt nur dann eine Gebühr an, wenn es **mehr als 3 Tage** überfällig ist. Sie beträgt dann 25 Cent je überfälligem Tag, **höchstens 600 Cent** je Medium.\n' +
            '- Das Ergebnis ist die Summe der Gebühren aller Medien.\n' +
            '- Ist das Array `null` oder leer, wird eine `IllegalArgumentException` ausgelöst.\n' +
            'Die Methode enthält zwei inhaltliche Fehler. Führen Sie einen Schreibtischtest durch: Tragen Sie für jeden Testfall das laut Vorgabe **erwartete** und das von der Methode **tatsächlich** gelieferte Ergebnis ein.',
          antwort: {
            art: 'tabelle',
            kopf: ['Nr.', 'tageUeberfaellig', 'erwartetes Ergebnis', 'tatsächliches Ergebnis'],
            zeilen: [
              ['1', '{5, 1}', null, null],
              ['2', '{3}', null, null],
              ['3', '{2, 40}', null, null],
              ['4', '{30, 3, 10}', null, null],
              ['5', 'null', null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Nr.', 'tageUeberfaellig', 'erwartetes Ergebnis', 'tatsächliches Ergebnis'],
                zeilen: [
                  ['1', '{5, 1}', '125', '0'],
                  ['2', '{3}', '0', '75'],
                  ['3', '{2, 40}', '600', '600'],
                  ['4', '{30, 3, 10}', '850', '250'],
                  ['5', 'null', 'IllegalArgumentException', 'IllegalArgumentException'],
                ],
              },
            },
            'Erläuterung: Nr. 1 – erwartet 5 · 25 = 125 + 0; die Methode überschreibt in Zeile 14 die Summe, nach dem zweiten Medium bleibt 0. ' +
              'Nr. 2 – genau 3 Tage sind nicht „mehr als 3“, erwartet 0; Zeile 8 prüft `>= 3` und liefert 75. ' +
              'Nr. 3 – erwartet 0 + 600 (40 · 25 = 1000, gedeckelt); zufällig richtig, weil das letzte Medium allein die ganze Gebühr trägt. ' +
              'Nr. 4 – erwartet 600 + 0 + 250 = 850; tatsächlich bleibt nur der letzte Wert 250 stehen. ' +
              'Nr. 5 – Zeile 2/3 lösen die Ausnahme korrekt aus.',
          ],
          bewertung: ['je richtig eingetragenem Wert 1 P (10 Felder)', 'statt „IllegalArgumentException“ genügt „Ausnahme/Exception“'],
        },
        {
          nr: 'c',
          punkte: 4,
          sp: ['AP2-5-2-3', 'AP2-5-3-1'],
          text: 'Geben Sie für beide Fehler die Zeilennummer an und notieren Sie jeweils die vollständig korrigierte Zeile.',
          antwort: {
            art: 'tabelle',
            kopf: ['Zeile', 'korrigierte Zeile'],
            zeilen: [
              [null, null],
              [null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Zeile', 'korrigierte Zeile'],
                zeilen: [
                  ['8', '`if (tageUeberfaellig[i] > 3) {`'],
                  ['14', '`summe = summe + gebuehr;` (oder `summe += gebuehr;`)'],
                ],
              },
            },
            'Gleichwertig für Zeile 8: `if (tageUeberfaellig[i] >= 4) {`.',
          ],
          bewertung: ['je Fehler: richtige Zeilennummer 1 P, korrekt berichtigte Zeile 1 P'],
        },
      ],
    },

    // ---------------------------------------------------------------- 4 SQL
    {
      id: 'pb2-01-4',
      art: 'sql',
      titel: 'Ausleihdatenbank',
      punkte: 28,
      sp: ['AP2-4-2-2', 'AP2-4-2-3', 'AP2-4-3-1'],
      situation:
        'Die Bibliothekssoftware „Ausleihwerk“ speichert ihre Daten in einer relationalen Datenbank. Für die Stadtbibliothek Auenstadt sollen Sie mehrere SQL-Anweisungen erstellen. ' +
        'Gegeben sind Auszüge aus den Tabellen (Primärschlüssel jeweils in der ersten Spalte; A_Rueckgabe ist NULL, solange das Exemplar nicht zurückgegeben ist).',
      vorgaben: [
        {
          tabelle: {
            titel: 'Leser',
            kopf: ['L_Nr', 'L_Nachname', 'L_Vorname', 'L_Ausweis_bis'],
            zeilen: [
              ['1001', 'Brandt', 'Jonas', '2027-03-31'],
              ['1002', 'Okafor', 'Amara', '2026-12-31'],
              ['1003', 'Lindqvist', 'Maren', '2027-08-31'],
              ['1004', 'Yilmaz', 'Deniz', '2026-11-30'],
              ['1005', 'Hoffmann', 'Clara', '2027-01-31'],
              ['…', '…', '…', '…'],
            ],
          },
        },
        {
          tabelle: {
            titel: 'Medium',
            kopf: ['M_ID', 'M_Titel', 'M_Art', 'M_Jahr'],
            zeilen: [
              ['11', 'Die Gezeiten von Hallig Nord', 'Buch', '2024'],
              ['12', 'Kochen ohne Strom', 'Buch', '2023'],
              ['13', 'Sternenstaub – Staffel 2', 'DVD', '2025'],
              ['14', 'Wege durch das Moor', 'Hörbuch', '2022'],
              ['15', 'Inselhopper', 'Spiel', '2025'],
              ['…', '…', '…', '…'],
            ],
          },
        },
        {
          tabelle: {
            titel: 'Exemplar',
            kopf: ['E_Nr', 'M_ID', 'E_Signatur', 'E_Standort'],
            zeilen: [
              ['50211', '11', 'Ro ARN', 'Hauptstelle'],
              ['50212', '11', 'Ro ARN', 'Zweigstelle Ost'],
              ['61002', '12', 'Hw MEI', 'Hauptstelle'],
              ['70015', '13', 'DVD STE', 'Hauptstelle'],
              ['50488', '14', 'HB BRE', 'Zweigstelle Ost'],
              ['61177', '15', 'Sp INS', 'Hauptstelle'],
              ['…', '…', '…', '…'],
            ],
          },
        },
        {
          tabelle: {
            titel: 'Ausleihe',
            kopf: ['A_ID', 'E_Nr', 'L_Nr', 'A_Ausleihdatum', 'A_Faellig', 'A_Rueckgabe'],
            zeilen: [
              ['9001', '50488', '1003', '2025-11-14', '2025-12-12', '2025-12-10'],
              ['9002', '61002', '1001', '2025-12-01', '2025-12-29', '2026-01-05'],
              ['9003', '50211', '1001', '2026-09-03', '2026-10-01', 'NULL'],
              ['9004', '61177', '1003', '2026-09-14', '2026-09-28', 'NULL'],
              ['9005', '70015', '1004', '2026-10-08', '2026-10-15', 'NULL'],
              ['9006', '61002', '1005', '2026-08-05', '2026-09-02', 'NULL'],
              ['…', '…', '…', '…', '…', '…'],
            ],
          },
        },
        {
          tabelle: {
            titel: 'Vormerkung',
            kopf: ['V_ID', 'M_ID', 'L_Nr', 'V_Datum', 'V_Status'],
            zeilen: [
              ['301', '11', '1002', '2026-09-20', 'offen'],
              ['302', '12', '1004', '2026-09-25', 'offen'],
              ['303', '11', '1005', '2026-10-02', 'offen'],
              ['304', '15', '1001', '2026-09-30', 'offen'],
              ['305', '12', '1003', '2026-10-05', 'offen'],
              ['306', '11', '1004', '2026-08-11', 'erledigt'],
              ['…', '…', '…', '…', '…'],
            ],
          },
        },
        {
          hinweis:
            '`CURRENT_DATE` liefert das aktuelle Datum. `DATEDIFF(datum1, datum2)` liefert die Anzahl der Tage von datum2 bis datum1, z. B. `DATEDIFF(\'2026-10-12\', \'2026-10-01\')` = 11. ' +
            'Datumswerte können mit <, > und = verglichen werden. Die Beispielergebnisse beziehen sich auf den 12.10.2026 und zeigen nur die Daten der Auszüge.',
        },
      ],
      teile: [
        {
          nr: 'a',
          punkte: 2,
          sp: ['AP2-4-3-1'],
          text: 'Jonas Brandt (L_Nr 1001) merkt am 12.10.2026 den Titel „Wege durch das Moor“ vor. Erstellen Sie eine SQL-Anweisung, die die Vormerkung mit der V_ID 307 und dem Status „offen“ speichert.',
          antwort: { art: 'code', zeilen: 3 },
          loesung: [
            {
              code: "INSERT INTO Vormerkung (V_ID, M_ID, L_Nr, V_Datum, V_Status)\nVALUES (307, 14, 1001, '2026-10-12', 'offen');",
            },
            'Gleichwertig: `CURRENT_DATE` statt des Datums; ohne Spaltenliste, wenn die Werte in der Reihenfolge der Tabellenspalten stehen.',
          ],
          bewertung: ['vollständig richtige Anweisung 2 P; M_ID 14 aus der Tabelle Medium entnommen'],
        },
        {
          nr: 'b',
          punkte: 6,
          sp: ['AP2-4-2-2', 'AP2-4-2-1'],
          text:
            'Für den täglichen Mahnlauf wird eine Liste aller noch nicht zurückgegebenen Exemplare benötigt, deren Fälligkeitsdatum vor dem aktuellen Datum liegt. ' +
            'Erstellen Sie eine SQL-Abfrage, die das folgende Ergebnis liefert – sortiert nach den überfälligen Tagen, die meisten zuerst.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Ergebnisbeispiel',
                kopf: ['Nachname', 'Vorname', 'Titel', 'Faellig_am', 'Tage_ueberfaellig'],
                zeilen: [
                  ['Hoffmann', 'Clara', 'Kochen ohne Strom', '2026-09-02', '40'],
                  ['Lindqvist', 'Maren', 'Inselhopper', '2026-09-28', '14'],
                  ['Brandt', 'Jonas', 'Die Gezeiten von Hallig Nord', '2026-10-01', '11'],
                ],
              },
            },
          ],
          antwort: { art: 'code', zeilen: 10 },
          loesung: [
            {
              code: `SELECT l.L_Nachname AS Nachname, l.L_Vorname AS Vorname, m.M_Titel AS Titel,
       a.A_Faellig AS Faellig_am,
       DATEDIFF(CURRENT_DATE, a.A_Faellig) AS Tage_ueberfaellig
FROM Ausleihe a
  INNER JOIN Leser l    ON a.L_Nr = l.L_Nr
  INNER JOIN Exemplar e ON a.E_Nr = e.E_Nr
  INNER JOIN Medium m   ON e.M_ID = m.M_ID
WHERE a.A_Rueckgabe IS NULL
  AND a.A_Faellig < CURRENT_DATE
ORDER BY Tage_ueberfaellig DESC;`,
            },
            'Gleichwertig: `ORDER BY a.A_Faellig ASC`; Verknüpfung über WHERE statt JOIN. Ausleihe 9005 erscheint nicht, weil sie erst am 15.10. fällig ist.',
          ],
          bewertung: [
            'Spalten mit Aliasnamen inkl. DATEDIFF in richtiger Reihenfolge der Parameter: 1 P',
            'Verknüpfung der vier Tabellen (Ausleihe – Leser, Ausleihe – Exemplar – Medium): 2 P',
            'Bedingung A_Rueckgabe IS NULL: 1 P',
            'Bedingung Fälligkeit vor dem aktuellen Datum: 1 P',
            'Sortierung absteigend nach überfälligen Tagen: 1 P',
          ],
        },
        {
          nr: 'c',
          punkte: 7,
          sp: ['AP2-4-2-3', 'AP2-4-2-2'],
          text:
            'Die Bibliothek will für stark nachgefragte Titel zusätzliche Exemplare kaufen. Erstellen Sie eine SQL-Abfrage, die alle Titel mit **mindestens zwei offenen** Vormerkungen ausgibt – mit Anzahl der offenen Vormerkungen und dem Datum der ältesten offenen Vormerkung. ' +
            'Sortieren Sie absteigend nach der Anzahl, bei gleicher Anzahl nach der ältesten Vormerkung (früheste zuerst).',
          vorgaben: [
            {
              tabelle: {
                titel: 'Ergebnisbeispiel',
                kopf: ['Titel', 'Anzahl_Vormerkungen', 'Aelteste_Vormerkung'],
                zeilen: [
                  ['Die Gezeiten von Hallig Nord', '2', '2026-09-20'],
                  ['Kochen ohne Strom', '2', '2026-09-25'],
                ],
              },
            },
          ],
          antwort: { art: 'code', zeilen: 9 },
          loesung: [
            {
              code: `SELECT m.M_Titel AS Titel,
       COUNT(*) AS Anzahl_Vormerkungen,
       MIN(v.V_Datum) AS Aelteste_Vormerkung
FROM Medium m
  INNER JOIN Vormerkung v ON m.M_ID = v.M_ID
WHERE v.V_Status = 'offen'
GROUP BY m.M_ID, m.M_Titel
HAVING COUNT(*) >= 2
ORDER BY Anzahl_Vormerkungen DESC, Aelteste_Vormerkung ASC;`,
            },
            'Die Vormerkung 306 („erledigt“) wird durch WHERE vor dem Gruppieren ausgeschlossen; „Inselhopper“ hat nur eine offene Vormerkung und fällt durch HAVING heraus. ' +
              'Gleichwertig: Gruppierung nur nach M_Titel; Filter über eine Unterabfrage (`WHERE M_ID IN (SELECT M_ID FROM Vormerkung WHERE V_Status = \'offen\' GROUP BY M_ID HAVING COUNT(*) >= 2)`).',
          ],
          bewertung: [
            'Spalten mit COUNT, MIN und Aliasnamen: 2 P',
            'JOIN Medium – Vormerkung: 1 P',
            'Filter auf offene Vormerkungen mit WHERE: 1 P',
            'GROUP BY: 1 P',
            'HAVING COUNT(*) >= 2: 1 P',
            'Sortierung nach beiden Kriterien: 1 P',
          ],
        },
        {
          nr: 'd',
          punkte: 8,
          sp: ['AP2-4-3-1', 'AP2-4-2-2'],
          text:
            'Aus Datenschutzgründen sollen abgeschlossene Ausleihen nicht dauerhaft mit dem Leserbezug gespeichert bleiben. Alle Ausleihen, die **vor dem 01.01.2026 zurückgegeben** wurden, sollen in die Tabelle `Ausleihe_Archiv` verschoben werden. ' +
            'Das Archiv enthält keine Lesernummer und kein Fälligkeitsdatum, dafür die M_ID des Titels, damit Statistiken auch nach dem Aussondern eines Exemplars möglich bleiben.\n' +
            'Erstellen Sie die SQL-Anweisungen, die die Datensätze ins Archiv übernehmen und anschließend aus der Tabelle `Ausleihe` löschen.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Ausleihe_Archiv (Auszug)',
                kopf: ['A_ID', 'E_Nr', 'M_ID', 'A_Ausleihdatum', 'A_Rueckgabe'],
                zeilen: [
                  ['8712', '50211', '11', '2025-03-02', '2025-03-27'],
                  ['8713', '61177', '15', '2025-03-04', '2025-03-18'],
                  ['…', '…', '…', '…', '…'],
                ],
              },
            },
          ],
          antwort: { art: 'code', zeilen: 10 },
          loesung: [
            {
              code: `INSERT INTO Ausleihe_Archiv (A_ID, E_Nr, M_ID, A_Ausleihdatum, A_Rueckgabe)
SELECT a.A_ID, a.E_Nr, e.M_ID, a.A_Ausleihdatum, a.A_Rueckgabe
FROM Ausleihe a
  INNER JOIN Exemplar e ON a.E_Nr = e.E_Nr
WHERE a.A_Rueckgabe < '2026-01-01';

DELETE FROM Ausleihe
WHERE A_Rueckgabe < '2026-01-01';`,
            },
            'Im Auszug wird nur Ausleihe 9001 archiviert (Rückgabe 2025-12-10); 9002 wurde erst 2026 zurückgegeben. Offene Ausleihen (A_Rueckgabe NULL) erfüllen die Bedingung nicht, weil ein Vergleich mit NULL nie wahr ist; ein zusätzliches `A_Rueckgabe IS NOT NULL` ist zulässig. ' +
              'Gleichwertig: `YEAR(a.A_Rueckgabe) < 2026`. Die Reihenfolge ist wichtig: erst einfügen, dann löschen (ideal in einer Transaktion).',
          ],
          bewertung: [
            'INSERT INTO Ausleihe_Archiv mit passender Spaltenliste (ohne L_Nr, A_Faellig): 2 P',
            'SELECT mit JOIN auf Exemplar zur Ermittlung der M_ID: 2 P',
            'richtige Bedingung für die Rückgabe vor 2026: 2 P',
            'DELETE mit derselben Bedingung (nach dem INSERT): 2 P',
          ],
        },
        {
          nr: 'e',
          punkte: 5,
          sp: ['AP2-4-3-2', 'AP2-4-2-4', 'AP2-4-3-1'],
          text:
            'Leserinnen und Leser, die ein Medium **mehr als 30 Tage** überfällig haben, dürfen an den Terminals nichts mehr ausleihen. ' +
            'Erweitern Sie die Tabelle `Leser` um die Spalte `L_Gesperrt` (ein Zeichen, Standardwert \'N\') und erstellen Sie eine Anweisung, die bei allen betroffenen Personen den Wert \'J\' einträgt.',
          antwort: { art: 'code', zeilen: 8 },
          loesung: [
            {
              code: `ALTER TABLE Leser ADD L_Gesperrt CHAR(1) DEFAULT 'N';

UPDATE Leser
SET L_Gesperrt = 'J'
WHERE L_Nr IN (SELECT a.L_Nr
               FROM Ausleihe a
               WHERE a.A_Rueckgabe IS NULL
                 AND DATEDIFF(CURRENT_DATE, a.A_Faellig) > 30);`,
            },
            'Am 12.10.2026 wird im Auszug nur Clara Hoffmann (1005, 40 Tage) gesperrt. Gleichwertig: `ADD COLUMN`; Spalte ohne Standardwert anlegen und alle übrigen mit einem zweiten UPDATE auf \'N\' setzen; `EXISTS` statt `IN`; Bedingung mit einer anderen passenden Datumsfunktion des verwendeten Datenbanksystems.',
          ],
          bewertung: [
            'ALTER TABLE … ADD mit Datentyp und Standardwert: 2 P',
            'UPDATE … SET L_Gesperrt = \'J\': 1 P',
            'Unterabfrage (oder JOIN) mit offenen Ausleihen und mehr als 30 Tagen: 2 P',
          ],
        },
      ],
    },
  ],
};
