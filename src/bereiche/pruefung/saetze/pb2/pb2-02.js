// Probeprüfung PB2 – eigene Aufgaben zu einer fiktiven Firma (keine Übernahme aus echten Prüfungen).

const KLASSEN_AUFTRAG = `Werkstattauftrag
---------------------------------------
- auftragNr: String
- kennzeichen: String
- prioritaet: int        (1 = dringend, 2 = normal, 3 = nicht eilig)
- annahme: DateTime      (Zeitpunkt der Fahrzeugannahme)
---------------------------------------
+ getAuftragNr(): String
+ getKennzeichen(): String
+ getPrioritaet(): int
+ getAnnahme(): DateTime

DateTime
---------------------------------------
+ compareTo(anderer: DateTime): int
      (< 0: liegt vor anderer, 0: gleich, > 0: liegt nach anderer)

Ersatzteil
---------------------------------------
- teileNr: int
- bezeichnung: String
- lagerplatz: String
- bestand: int
---------------------------------------
+ getTeileNr(): int
+ getBezeichnung(): String
+ getLagerplatz(): String
+ getBestand(): int`;

const KULANZCODE = `public static int kulanzProzent(int alterMonate, int kmStand, boolean scheckheft) {
    if (alterMonate < 0 || kmStand < 0) {                      // E1
        throw new IllegalArgumentException("Ungültige Fahrzeugdaten");
    }
    int prozent = 0;
    if (alterMonate <= 72 && kmStand <= 150000) {               // E2
        if (alterMonate <= 48) {                                // E3
            prozent = 70;
        } else {
            prozent = 40;
        }
        if (scheckheft) {                                       // E4
            prozent = prozent + 10;
        }
    }
    return prozent;
}`;

export default {
  id: 'pb2-02',
  teil: 'PB2',
  titel: 'Drehmoment Software – Werkstattsoftware „WerkstattLotse“',
  situation:
    'Die Drehmoment Software GmbH in Bielefeld entwickelt die Werkstattsoftware „WerkstattLotse“. ' +
    'Ihr größter Kunde ist die Teutoring Kfz-Service GmbH, eine Kette freier Kfz-Werkstätten mit zwölf Standorten in Ostwestfalen-Lippe. ' +
    'Mit „WerkstattLotse“ plant die Kette Werkstattaufträge und Termine, führt ein zentrales Ersatzteillager und verwaltet das Reifenhotel, in dem Kundinnen und Kunden ihre Saisonreifen einlagern. ' +
    'Sie arbeiten als Fachinformatikerin bzw. Fachinformatiker für Anwendungsentwicklung im Projektteam und setzen mehrere Erweiterungen um.',
  aufgaben: [
    // ---------------------------------------------------------------- 1 Modell
    {
      id: 'pb2-02-1',
      art: 'modell',
      titel: 'Reifenhotel normalisieren',
      punkte: 22,
      sp: ['AP2-2-2-4', 'AP2-2-2-2', 'AP2-2-2-3'],
      situation:
        'Bisher führt jede Werkstatt der Teutoring Kfz-Service GmbH ihr Reifenhotel in einer eigenen Tabellenkalkulation. ' +
        'Die Listen sollen in eine gemeinsame Datenbank von „WerkstattLotse“ übernommen werden. Der folgende Auszug zeigt den Aufbau der bisherigen Liste.',
      vorgaben: [
        {
          tabelle: {
            titel: 'Bisherige Liste „Reifenhotel“ (Auszug)',
            kopf: ['EinlNr', 'Eingelagert', 'Ausgelagert', 'KdNr', 'Kunde', 'Telefon', 'Kennzeichen', 'Reifengröße', 'Profil VL/VR/HL/HR (mm)', 'Leistungen (Preis EUR)', 'WNr', 'Werkstatt', 'Lagerplatz'],
            zeilen: [
              ['E-801', '2026-04-07', '', 'K-310', 'Ahlers, Petra', '0521 448812', 'BI-PA 512', '205/55 R16', '6,1/6,0/5,4/5,5', 'Räderwäsche (12,00), Auswuchten (24,00)', '1', 'Bielefeld-Mitte', 'R03-F12'],
              ['E-802', '2026-04-07', '2026-10-05', 'K-118', 'Brömmel, Jan', '05241 90233', 'GT-JB 88', '225/45 R17', '4,2/4,4/3,9/4,0', 'Räderwäsche (12,00)', '2', 'Gütersloh Nord', 'R01-F04'],
              ['E-803', '2026-04-09', '', 'K-310', 'Ahlers, Petra', '0521 448812', 'BI-PA 7', '185/65 R15', '7,0/7,0/6,8/6,9', '', '1', 'Bielefeld-Mitte', 'R03-F13'],
              ['E-804', '2026-04-10', '', 'K-245', 'Sander, Oleg', '05221 37719', 'HF-OS 301', '205/55 R16', '5,0/5,1/4,8/4,8', 'Auswuchten (24,00), Ventilwechsel (8,50)', '3', 'Herford', 'R01-F04'],
              ['E-805', '2026-10-05', '', 'K-118', 'Brömmel, Jan', '05241 90233', 'GT-JB 88', '225/45 R17', '6,8/6,9/7,1/7,0', 'Räderwäsche (12,00)', '2', 'Gütersloh Nord', 'R01-F04'],
              ['…', '…', '…', '…', '…', '…', '…', '…', '…', '…', '…', '…', '…'],
            ],
          },
        },
        'Zusätzliche Informationen aus Gesprächen mit der Kette:\n' +
          '- Eine Kundin bzw. ein Kunde kann mehrere Fahrzeuge haben; ein Fahrzeug gehört genau einer Kundin bzw. einem Kunden.\n' +
          '- Bei jeder Einlagerung wird genau ein Reifensatz (vier Räder) eines Fahrzeugs in einer Werkstatt auf einem Lagerplatz abgelegt. Die Lagerplatzbezeichnung ist nur innerhalb einer Werkstatt eindeutig.\n' +
          '- Die Profiltiefe wird bei der Einlagerung für jedes Rad einzeln gemessen (VL = vorn links usw.).\n' +
          '- Zu einer Einlagerung können beliebig viele Zusatzleistungen gebucht werden; jede Leistung hat einen festen Preis aus der Preisliste der Kette.',
      ],
      teile: [
        {
          nr: 'a',
          punkte: 6,
          sp: ['AP2-2-2-3'],
          text:
            'Die bisherige Liste enthält Redundanzen, die bei der Arbeit zu Anomalien führen. ' +
            'Erläutern Sie die **Einfüge-**, die **Änderungs-** und die **Löschanomalie** jeweils an einem konkreten Beispiel aus der Liste.',
          antwort: { art: 'text', zeilen: 9 },
          loesung: [
            '- **Einfügeanomalie:** Eine neue Leistung der Preisliste (z. B. „Reifen-Einlagerung mit Felgenreinigung“ für 18,00 EUR) oder eine neue Kundin ohne eingelagerte Reifen kann nicht erfasst werden, weil jede Zeile eine Einlagerung mit Einlagerungsnummer braucht. Auch eine neue Werkstatt lässt sich erst eintragen, wenn dort die erste Einlagerung stattfindet.\n' +
              '- **Änderungsanomalie:** Die Telefonnummer von Petra Ahlers steht in E-801 und E-803. Ändert sie sich und wird nur in einer Zeile angepasst, sind die Daten widersprüchlich. Ebenso der Preis „Räderwäsche 12,00“, der in vielen Zeilen steht – eine Preiserhöhung müsste überall nachgetragen werden.\n' +
              '- **Löschanomalie:** Wird die Einlagerung E-804 gelöscht (z. B. nach der Abholung), gehen alle Daten von Oleg Sander (Kundennummer, Telefon, Fahrzeug HF-OS 301) verloren, weil sie nur in dieser Zeile stehen. Gäbe es die Leistung „Ventilwechsel“ nur hier, ginge auch ihr Preis verloren.',
            'Andere passende Beispiele aus der Liste sind ebenfalls richtig.',
          ],
          bewertung: ['je Anomalie: zutreffende Erläuterung 1 P und passendes Beispiel aus der Liste 1 P (3 × 2 P)', 'eine rein allgemeine Erklärung ohne Bezug zur Liste: max. 1 P je Anomalie'],
        },
        {
          nr: 'b',
          punkte: 16,
          sp: ['AP2-2-2-4', 'AP2-2-2-2'],
          text:
            'Erstellen Sie aus der Liste und den zusätzlichen Informationen ein relationales Datenmodell in der **3. Normalform**. ' +
            'Geben Sie alle Tabellen mit ihren Attributen an, kennzeichnen Sie Primärschlüssel und Fremdschlüssel und zeichnen Sie die Beziehungen mit Kardinalitäten ein. ' +
            'Die Darstellung ist frei (Tabellenkästen mit Verbindungslinien oder Textform wie `Tabelle(PK, #FK, …)` mit unterstrichenem bzw. als „PK“ markiertem Primärschlüssel und einer Liste der Beziehungen).',
          antwort: { art: 'papier' },
          loesung: [
            'Musterlösung (PK unterstrichen bzw. „PK“, Fremdschlüssel mit #):',
            {
              tabelle: {
                titel: 'Tabellen',
                kopf: ['Tabelle', 'Attribute', 'Schlüssel'],
                zeilen: [
                  ['Kunde', 'KdNr, Nachname, Vorname, Telefon', 'PK KdNr'],
                  ['Fahrzeug', 'Kennzeichen, #KdNr', 'PK Kennzeichen; FK KdNr → Kunde'],
                  ['Werkstatt', 'WNr, Bezeichnung', 'PK WNr'],
                  ['Einlagerung', 'EinlNr, Eingelagert, Ausgelagert, #Kennzeichen, #WNr, Lagerplatz, Reifengroesse, Profil_VL, Profil_VR, Profil_HL, Profil_HR', 'PK EinlNr; FK Kennzeichen → Fahrzeug; FK WNr → Werkstatt'],
                  ['Leistung', 'LeistNr, Bezeichnung, Preis', 'PK LeistNr'],
                  ['Einlagerung_Leistung', '#EinlNr, #LeistNr', 'PK (EinlNr, LeistNr); FK EinlNr → Einlagerung; FK LeistNr → Leistung'],
                ],
              },
            },
            {
              tabelle: {
                titel: 'Beziehungen',
                kopf: ['Beziehung', 'Kardinalität'],
                zeilen: [
                  ['Kunde – Fahrzeug', '1 : n'],
                  ['Fahrzeug – Einlagerung', '1 : n'],
                  ['Werkstatt – Einlagerung', '1 : n'],
                  ['Einlagerung – Einlagerung_Leistung', '1 : n'],
                  ['Leistung – Einlagerung_Leistung', '1 : n (zusammen m : n zwischen Einlagerung und Leistung)'],
                ],
              },
            },
            'Begründung der Schritte: **1. NF** – „Kunde“ wird in Nachname/Vorname zerlegt, die vier Profiltiefen kommen in eigene Spalten, die Mehrfachwerte bei „Leistungen“ werden aufgelöst. ' +
              '**2. NF** – Nach der Auflösung der Leistungen ist der Schlüssel (EinlNr, Leistung). Bezeichnung und Preis einer Leistung hängen nur von der Leistung ab, alle übrigen Attribute nur von EinlNr, also jeweils nur von einem Teil des Schlüssels → eigene Tabellen Leistung und Einlagerung sowie die Zuordnungstabelle Einlagerung_Leistung. ' +
              '**3. NF** – Kundendaten hängen über das Kennzeichen (Fahrzeug → KdNr → Name, Telefon), der Werkstattname über WNr transitiv vom Schlüssel der Einlagerung ab → eigene Tabellen Kunde, Fahrzeug, Werkstatt.',
            'Gleichwertig: künstlicher Schlüssel FzNr für Fahrzeug (das Kennzeichen kann sich bei einer Ummeldung ändern) mit Kennzeichen als normalem Attribut; eigene Tabelle Profilmessung(#EinlNr, Radposition, Profiltiefe) statt vier Spalten; ' +
              'eigene Tabelle Lagerplatz(#WNr, Platz) mit Fremdschlüssel aus Einlagerung; zusätzlich ein Attribut „berechneter Preis“ in Einlagerung_Leistung, damit spätere Preisänderungen alte Einlagerungen nicht verändern. ' +
              'Die Reifengröße gehört zur Einlagerung, nicht zum Fahrzeug, weil Sommer- und Winterreifen eines Fahrzeugs unterschiedlich groß sein können; eine Zuordnung zum Fahrzeug wird nur bei schlüssiger Begründung gewertet.',
          ],
          bewertung: [
            'Tabelle Kunde mit PK und Attributen: 2 P',
            'Tabelle Fahrzeug mit PK und FK auf Kunde: 2 P',
            'Tabelle Werkstatt: 1 P',
            'Tabelle Einlagerung mit PK, beiden FK und den übrigen Attributen (Profil atomar): 3 P',
            'Tabelle Leistung mit Preis: 2 P',
            'Zwischentabelle Einlagerung_Leistung mit zusammengesetztem PK aus zwei FK: 3 P',
            'Beziehungen mit richtigen Kardinalitäten: 3 P',
            'andere fachgerechte Modelle in 3. NF werden voll bewertet',
          ],
        },
      ],
    },

    // ---------------------------------------------------------------- 2 Algorithmus
    {
      id: 'pb2-02-2',
      art: 'algorithmus',
      titel: 'Dispositionsliste und Teilesuche',
      punkte: 30,
      sp: ['AP2-3-2-3', 'AP2-3-3-1', 'AP2-3-2-1'],
      situation:
        'Jeden Morgen zeigt „WerkstattLotse“ in jeder Werkstatt eine Dispositionsliste der offenen Aufträge an. Die Aufträge liegen als Liste von Objekten der Klasse `Werkstattauftrag` vor und sollen sortiert werden. ' +
        'Außerdem sollen Mechanikerinnen und Mechaniker am Tablet schnell ein Ersatzteil im Lager finden.',
      vorgaben: [
        'Gegeben sind die folgenden Klassen (Auszug aus dem Klassendiagramm):',
        { code: KLASSEN_AUFTRAG, titel: 'Klassen Werkstattauftrag, DateTime und Ersatzteil' },
        {
          tabelle: {
            titel: 'Generische Liste List<T>',
            kopf: ['Methode', 'Beschreibung'],
            zeilen: [
              ['`new List<T>()`', 'erzeugt eine leere Liste für Objekte vom Typ T'],
              ['`add(element: T): void`', 'hängt ein Element am Ende an'],
              ['`size(): int`', 'liefert die Anzahl der Elemente'],
              ['`get(index: int): T`', 'liefert das Element an der Position index (erstes Element: Index 0)'],
              ['`set(index: int, element: T): void`', 'ersetzt das Element an der Position index durch element'],
            ],
          },
        },
        {
          hinweis:
            'Fertige Sortier- oder Suchfunktionen der Programmiersprache dürfen nicht verwendet werden. Die Division `/` zweier `int`-Werte liefert ein ganzzahliges Ergebnis (Nachkommastellen werden abgeschnitten, z. B. 7 / 2 = 3). ' +
            'Sie dürfen Pseudocode oder eine Ihnen bekannte Programmiersprache (z. B. Java, C#) verwenden.',
        },
        {
          tabelle: {
            titel: 'Beispieldaten: Liste auftraege (Werkstatt Bielefeld-Mitte, 07.10.2026)',
            kopf: ['Index', 'auftragNr', 'kennzeichen', 'prioritaet', 'annahme'],
            zeilen: [
              ['0', 'A-2611', 'BI-KT 418', '2', '2026-10-07 07:15'],
              ['1', 'A-2612', 'GT-MR 77', '1', '2026-10-07 07:40'],
              ['2', 'A-2613', 'HF-SU 2025', '3', '2026-10-06 16:50'],
              ['3', 'A-2614', 'BI-XL 903', '2', '2026-10-06 17:20'],
              ['4', 'A-2615', 'LIP-AB 12', '1', '2026-10-07 07:05'],
              ['5', 'A-2616', 'PB-RZ 640', '2', '2026-10-07 07:30'],
            ],
          },
        },
      ],
      teile: [
        {
          nr: 'a',
          punkte: 6,
          sp: ['AP2-3-3-1', 'AP2-3-2-1'],
          text:
            'Erstellen Sie die Methode `kommtVor`. Sie liefert `true`, wenn Auftrag `a` in der Dispositionsliste **vor** Auftrag `b` stehen muss, sonst `false`. Dabei gilt:\n' +
            '- Aufträge mit kleinerer Prioritätszahl stehen vorn (1 vor 2 vor 3).\n' +
            '- Bei gleicher Priorität steht der früher angenommene Auftrag vorn.\n' +
            '- Stimmen Priorität und Annahmezeitpunkt überein, liefert die Methode `false`.\n' +
            'Beispiel: `kommtVor(A-2614, A-2611)` liefert `true`, `kommtVor(A-2611, A-2612)` liefert `false`.',
          antwort: {
            art: 'code',
            zeilen: 8,
            rahmen: 'public boolean kommtVor(Werkstattauftrag a, Werkstattauftrag b) {\n    …\n}',
          },
          loesung: [
            {
              code: `public boolean kommtVor(Werkstattauftrag a, Werkstattauftrag b) {
    if (a.getPrioritaet() != b.getPrioritaet()) {
        return a.getPrioritaet() < b.getPrioritaet();
    }
    return a.getAnnahme().compareTo(b.getAnnahme()) < 0;
}`,
            },
            'Gleichwertig: ausführliche `if`/`else`-Kaskade mit `return true`/`return false`; eine Hilfsvariable `ergebnis`, die am Ende zurückgegeben wird.',
          ],
          bewertung: [
            'Vergleich der Prioritäten über die Getter, kleinere Zahl zuerst: 2 P',
            'bei gleicher Priorität Vergleich der Annahme mit compareTo, Auswertung < 0: 3 P',
            'Rückgabe false bei völliger Gleichheit: 1 P',
            'andere korrekte Lösungen werden voll bewertet',
          ],
        },
        {
          nr: 'b',
          punkte: 12,
          sp: ['AP2-3-2-3', 'AP2-3-2-1'],
          text:
            'Erstellen Sie die Methode `sortiere`. Sie sortiert die übergebene Liste mit einem **Sortierverfahren Ihrer Wahl** (z. B. Bubble Sort, Selection Sort oder Insertion Sort) so, dass sie anschließend in der Reihenfolge der Dispositionsliste vorliegt. ' +
            'Verwenden Sie die Methode `kommtVor` aus Teil a (Sie dürfen davon ausgehen, dass sie korrekt umgesetzt ist). Die Liste wird direkt verändert, es wird keine neue Liste angelegt. ' +
            'Nennen Sie außerdem den Namen des verwendeten Verfahrens.\n' +
            'Für die Beispieldaten ergibt sich die Reihenfolge A-2615, A-2612, A-2614, A-2611, A-2616, A-2613.',
          antwort: {
            art: 'code',
            zeilen: 16,
            rahmen: '// Verfahren: …\npublic void sortiere(List<Werkstattauftrag> auftraege) {\n    …\n}',
          },
          loesung: [
            'Musterlösung mit **Bubble Sort**:',
            {
              code: `// Verfahren: Bubble Sort
public void sortiere(List<Werkstattauftrag> auftraege) {
    int n = auftraege.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - 1 - i; j++) {
            if (kommtVor(auftraege.get(j + 1), auftraege.get(j))) {
                Werkstattauftrag tmp = auftraege.get(j);
                auftraege.set(j, auftraege.get(j + 1));
                auftraege.set(j + 1, tmp);
            }
        }
    }
}`,
            },
            'Nach dem ersten äußeren Durchlauf steht der Auftrag mit der höchsten Prioritätszahl (A-2613) am Ende: A-2612, A-2611, A-2614, A-2615, A-2616, A-2613. Nach allen Durchläufen ergibt sich A-2615, A-2612, A-2614, A-2611, A-2616, A-2613.',
            'Ebenfalls richtig, z. B. **Insertion Sort**:',
            {
              code: `// Verfahren: Insertion Sort
public void sortiere(List<Werkstattauftrag> auftraege) {
    for (int i = 1; i < auftraege.size(); i++) {
        Werkstattauftrag aktuell = auftraege.get(i);
        int j = i - 1;
        while (j >= 0 && kommtVor(aktuell, auftraege.get(j))) {
            auftraege.set(j + 1, auftraege.get(j));
            j = j - 1;
        }
        auftraege.set(j + 1, aktuell);
    }
}`,
            },
            'Auch Selection Sort (kleinstes Element des unsortierten Rests suchen und mit dem Element an Position i tauschen) ist richtig. Wichtig ist die Richtung des Vergleichs: getauscht wird, wenn das **hintere** Element vor das vordere gehört.',
          ],
          bewertung: [
            'Name des Verfahrens passend zum Code: 1 P',
            'äußere Schleife mit richtigen Grenzen: 2 P',
            'innere Schleife mit richtigen Grenzen (kein Zugriff außerhalb der Liste): 3 P',
            'Vergleich mit kommtVor in der richtigen Richtung: 2 P',
            'Tausch bzw. Verschieben über Hilfsvariable mit get/set: 3 P',
            'Liste wird direkt verändert (keine Rückgabe nötig): 1 P',
            'jedes korrekte Sortierverfahren wird voll bewertet',
          ],
        },
        {
          nr: 'c',
          punkte: 8,
          sp: ['AP2-3-2-3', 'AP2-3-3-1'],
          text:
            'Die Liste aller Ersatzteile ist **aufsteigend nach `teileNr` sortiert**. Erstellen Sie die Methode `findeTeil`, die das Ersatzteil mit der gesuchten Teilenummer mit der **binären Suche** ermittelt und zurückgibt. ' +
            'Ist die Teilenummer nicht vorhanden, liefert die Methode `null`.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Beispieldaten: Liste teile (Auszug, sortiert)',
                kopf: ['Index', 'teileNr', 'bezeichnung', 'lagerplatz', 'bestand'],
                zeilen: [
                  ['0', '10220', 'Ölfilter', 'A-01-03', '140'],
                  ['1', '10475', 'Luftfilter', 'A-01-07', '64'],
                  ['2', '11830', 'Bremsscheibe vorn', 'B-04-02', '22'],
                  ['3', '12004', 'Bremsbelagsatz vorn', 'B-04-05', '35'],
                  ['4', '13570', 'Zündkerze', 'A-02-01', '260'],
                  ['5', '14112', 'Wischerblatt', 'C-01-02', '48'],
                  ['6', '15890', 'Keilrippenriemen', 'C-03-04', '9'],
                ],
              },
            },
            'Beispiele: `findeTeil(teile, 13570)` liefert das Objekt „Zündkerze“ (geprüft werden die Indizes 3, 5, 4); `findeTeil(teile, 12000)` liefert `null` (Indizes 3, 1, 2).',
          ],
          antwort: {
            art: 'code',
            zeilen: 16,
            rahmen: 'public Ersatzteil findeTeil(List<Ersatzteil> teile, int gesuchteNr) {\n    …\n    return null;\n}',
          },
          loesung: [
            {
              code: `public Ersatzteil findeTeil(List<Ersatzteil> teile, int gesuchteNr) {
    int links = 0;
    int rechts = teile.size() - 1;
    while (links <= rechts) {
        int mitte = (links + rechts) / 2;
        Ersatzteil t = teile.get(mitte);
        if (t.getTeileNr() == gesuchteNr) {
            return t;
        } else if (t.getTeileNr() < gesuchteNr) {
            links = mitte + 1;
        } else {
            rechts = mitte - 1;
        }
    }
    return null;
}`,
            },
            'Ablauf für 13570: links 0, rechts 6 → mitte 3 (12004 < 13570) → links 4; mitte 5 (14112 > 13570) → rechts 4; mitte 4 → gefunden. ' +
              'Für 12000: mitte 3 (12004 > 12000) → rechts 2; mitte 1 (10475 <) → links 2; mitte 2 (11830 <) → links 3 > rechts 2 → Ende, Rückgabe null.',
            'Gleichwertig: rekursive Lösung mit den Grenzen als Parameter. Eine lineare Suche erfüllt die Aufgabe nicht (max. 2 P).',
          ],
          bewertung: [
            'Grenzen links/rechts richtig initialisiert: 1 P',
            'Schleife mit Bedingung links <= rechts: 2 P',
            'Mitte berechnen und Element über get holen: 1 P',
            'Treffer → Rückgabe des Objekts: 1 P',
            'Grenze je nach Vergleich auf mitte + 1 bzw. mitte − 1 setzen: 2 P',
            'nicht gefunden → null: 1 P',
          ],
        },
        {
          nr: 'd',
          punkte: 2,
          sp: ['AP2-3-2-3'],
          text:
            'Das zentrale Lager umfasst rund **4 000** Ersatzteile. Geben Sie an, wie viele Elemente die lineare Suche und die binäre Suche im ungünstigsten Fall höchstens prüfen müssen.',
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 'linear', label: 'lineare Suche', erwartet: 4000, stellen: 0, einheit: 'Elemente' },
              { id: 'binaer', label: 'binäre Suche', erwartet: 12, stellen: 0, einheit: 'Elemente' },
            ],
          },
          loesung: [
            'Lineare Suche: Im ungünstigsten Fall (Teil steht am Ende oder fehlt) werden alle **4 000** Elemente geprüft.',
            'Binäre Suche: Jeder Schritt halbiert den Suchbereich. 2¹¹ = 2 048 ≤ 4 000 < 4 096 = 2¹², also höchstens ⌊log₂ 4 000⌋ + 1 = 11 + 1 = **12** Elemente.',
          ],
          bewertung: ['je richtiger Anzahl 1 P'],
        },
        {
          nr: 'e',
          punkte: 2,
          sp: ['AP2-3-2-3'],
          text: 'Nennen Sie die Voraussetzung, damit die binäre Suche funktioniert, und beschreiben Sie, was daraus folgt, wenn ein neues Ersatzteil in die Liste aufgenommen wird.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            'Voraussetzung: Die Liste muss nach dem Suchkriterium (hier `teileNr`) **sortiert** sein. ' +
              'Folge: Ein neues Teil darf nicht einfach mit `add` ans Ende gehängt werden; es muss an der passenden Stelle einsortiert werden, oder die Liste wird danach neu sortiert. Sonst findet die binäre Suche vorhandene Teile unter Umständen nicht.',
          ],
          bewertung: ['Voraussetzung sortierte Liste: 1 P', 'Folge beim Einfügen (einsortieren bzw. neu sortieren): 1 P'],
        },
      ],
    },

    // ---------------------------------------------------------------- 3 Test
    {
      id: 'pb2-02-3',
      art: 'test',
      titel: 'Test der Kulanzberechnung',
      punkte: 21,
      sp: ['AP2-5-2-1', 'AP2-5-2-2', 'AP2-5-3-1'],
      situation:
        'Bei Schäden an Fahrzeugen außerhalb der Garantie beteiligt sich die Teutoring Kfz-Service GmbH auf Kulanz an den Reparaturkosten. ' +
        'Die Methode `kulanzProzent` berechnet den Kulanzanteil in Prozent. Spezifikation:\n' +
        '- Ist das Fahrzeugalter oder der Kilometerstand negativ, wird eine `IllegalArgumentException` ausgelöst.\n' +
        '- Fahrzeuge, die älter als 72 Monate sind oder mehr als 150 000 km haben, erhalten 0 %.\n' +
        '- Sonst gilt: bis einschließlich 48 Monate 70 %, darüber 40 %. Bei lückenlos geführtem Scheckheft kommen 10 Prozentpunkte hinzu.\n' +
        'Die Entscheidungen im Code sind mit E1 bis E4 markiert.',
      vorgaben: [{ code: KULANZCODE, nummern: true, titel: 'Java-Methode kulanzProzent' }],
      teile: [
        {
          nr: 'aa',
          punkte: 4,
          sp: ['AP2-5-2-1'],
          text:
            'Für einen Black-Box-Test sollen Äquivalenzklassen für den Parameter `alterMonate` gebildet werden (`kmStand` = 80 000, `scheckheft` = false bleiben fest). ' +
            'Tragen Sie für jede Klasse den Wertebereich, ob sie gültig oder ungültig ist, einen Repräsentanten und das erwartete Ergebnis ein.',
          antwort: {
            art: 'tabelle',
            kopf: ['Klasse', 'Wertebereich alterMonate', 'gültig/ungültig', 'Repräsentant', 'erwartetes Ergebnis'],
            zeilen: [
              ['K1', null, null, null, null],
              ['K2', null, null, null, null],
              ['K3', null, null, null, null],
              ['K4', null, null, null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Klasse', 'Wertebereich alterMonate', 'gültig/ungültig', 'Repräsentant', 'erwartetes Ergebnis'],
                zeilen: [
                  ['K1', 'alterMonate < 0', 'ungültig', 'z. B. −5', 'IllegalArgumentException'],
                  ['K2', '0 bis 48', 'gültig', 'z. B. 24', '70'],
                  ['K3', '49 bis 72', 'gültig', 'z. B. 60', '40'],
                  ['K4', 'größer als 72', 'gültig', 'z. B. 100', '0'],
                ],
              },
            },
            'Die Reihenfolge der Klassen ist beliebig. K4 ist gültig, weil die Eingabe zulässig ist – sie führt nur zum Ergebnis 0 %. Jeder Wert aus dem Bereich ist als Repräsentant richtig.',
          ],
          bewertung: ['je vollständig richtiger Klasse (Bereich, gültig/ungültig, Repräsentant, Ergebnis) 1 P'],
        },
        {
          nr: 'ab',
          punkte: 3,
          sp: ['AP2-5-2-1'],
          text: 'Geben Sie die Grenzwerte an, die für `alterMonate` zusätzlich getestet werden sollten, jeweils mit dem erwarteten Ergebnis (übrige Parameter wie in aa).',
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            '- −1 → Exception und 0 → 70 (Grenze ungültig/gültig)\n- 48 → 70 und 49 → 40\n- 72 → 40 und 73 → 0',
          ],
          bewertung: ['je Grenze mit beiden Werten und richtigem Ergebnis 1 P (3 × 1 P)'],
        },
        {
          nr: 'b',
          punkte: 5,
          sp: ['AP2-5-2-2'],
          text:
            'Ermitteln Sie eine **möglichst kleine** Menge von Testfällen, mit der für die Methode eine Zweigüberdeckung von 100 % erreicht wird. ' +
            'Geben Sie je Testfall die Eingabewerte, das erwartete Ergebnis und die durchlaufenen Zweige an (Schreibweise z. B. „E1 f, E2 w“, w = Bedingung wahr, f = falsch).',
          antwort: {
            art: 'tabelle',
            kopf: ['Nr.', 'alterMonate', 'kmStand', 'scheckheft', 'erwartetes Ergebnis', 'durchlaufene Zweige'],
            zeilen: [
              ['1', null, null, null, null, null],
              ['2', null, null, null, null, null],
              ['3', null, null, null, null, null],
              ['4', null, null, null, null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Nr.', 'alterMonate', 'kmStand', 'scheckheft', 'erwartetes Ergebnis', 'durchlaufene Zweige'],
                zeilen: [
                  ['1', '−3', '1 000', 'false', 'IllegalArgumentException', 'E1 w'],
                  ['2', '50', '160 000', 'true', '0', 'E1 f, E2 f'],
                  ['3', '30', '40 000', 'true', '80', 'E1 f, E2 w, E3 w, E4 w'],
                  ['4', '60', '90 000', 'false', '40', 'E1 f, E2 w, E3 f, E4 f'],
                ],
              },
            },
            'Weniger als vier Testfälle reichen nicht: E1 w und E2 f beenden den Durchlauf jeweils vorzeitig, und für E3 w und E3 f braucht man zwei weitere Durchläufe. E4 w und E4 f lassen sich mit diesen beiden kombinieren (auch E3 w/E4 f und E3 f/E4 w ist richtig).',
          ],
          bewertung: ['je richtigem Testfall (Eingaben, Ergebnis, Zweige) 1 P (4 P)', 'Menge minimal (4 Testfälle) und alle 8 Zweige abgedeckt: 1 P'],
        },
        {
          nr: 'c',
          punkte: 6,
          sp: ['AP2-5-2-2'],
          text:
            'Für eine vollständige Pfadüberdeckung reichen die Testfälle aus b nicht aus. Notieren Sie **alle** Pfade durch die Methode als Folge der Entscheidungen (Schreibweise wie in b). ' +
            'Zusammengesetzte Bedingungen werden dabei als eine Entscheidung betrachtet.',
          antwort: {
            art: 'tabelle',
            kopf: ['Nr.', 'Pfad'],
            zeilen: [
              ['1', null],
              ['2', null],
              ['3', null],
              ['4', null],
              ['5', null],
              ['6', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Nr.', 'Pfad', 'Ergebnis'],
                zeilen: [
                  ['1', 'E1 w', 'Exception'],
                  ['2', 'E1 f, E2 f', '0'],
                  ['3', 'E1 f, E2 w, E3 w, E4 w', '80'],
                  ['4', 'E1 f, E2 w, E3 w, E4 f', '70'],
                  ['5', 'E1 f, E2 w, E3 f, E4 w', '50'],
                  ['6', 'E1 f, E2 w, E3 f, E4 f', '40'],
                ],
              },
            },
            'Reihenfolge beliebig. Die Spalte „Ergebnis“ ist nicht gefordert. Mit den Testfällen aus b fehlen (je nach Wahl) zwei der Pfade 3 bis 6.',
          ],
          bewertung: ['je richtigem Pfad 1 P (max. 6 P)', 'doppelte oder unmögliche Pfade werden nicht gewertet'],
        },
        {
          nr: 'd',
          punkte: 3,
          sp: ['AP2-5-3-1'],
          text:
            'Die Geschäftsleitung ändert die Regel: Der Kulanzanteil darf künftig **höchstens 75 %** betragen. Die Änderung soll testgetrieben (TDD) umgesetzt werden. ' +
            'Beschreiben Sie das Vorgehen in den Schritten des TDD-Zyklus und nennen Sie einen konkreten ersten Testfall.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '- **Red:** Zuerst wird ein Test geschrieben, der die neue Regel prüft, z. B. `kulanzProzent(24, 80000, true)` erwartet 75. Er wird ausgeführt und schlägt fehl, weil die Methode noch 80 liefert.\n' +
              '- **Green:** Danach wird nur so viel Code geändert, dass der Test besteht, z. B. nach Zeile 13 `if (prozent > 75) { prozent = 75; }` bzw. Zeile 13 mit `Math.min(prozent + 10, 75)`. Alle Tests laufen erneut – auch die alten müssen grün bleiben.\n' +
              '- **Refactor:** Der Code wird aufgeräumt (z. B. Konstante `MAX_KULANZ = 75`), ohne das Verhalten zu ändern; die Tests sichern das ab. Dann beginnt der Zyklus mit dem nächsten Test (z. B. Kontrollfall 60 Monate mit Scheckheft → weiterhin 50, die Obergrenze greift hier nicht).',
          ],
          bewertung: ['Reihenfolge Test zuerst → fehlschlagend → minimaler Code → grün → Refactoring: 2 P', 'passender konkreter Testfall mit erwartetem Ergebnis: 1 P'],
        },
      ],
    },

    // ---------------------------------------------------------------- 4 SQL
    {
      id: 'pb2-02-4',
      art: 'sql',
      titel: 'Auftrags- und Teiledatenbank',
      punkte: 27,
      sp: ['AP2-4-2-2', 'AP2-4-2-4', 'AP2-4-3-1', 'AP2-4-3-2'],
      situation:
        '„WerkstattLotse“ speichert Aufträge und den Teileverbrauch in einer relationalen Datenbank. Gegeben sind Auszüge aus den Tabellen. ' +
        'Primärschlüssel stehen in der ersten Spalte, bei `Verbrauch` bilden A_Nr und ET_Nr zusammen den Primärschlüssel. V_Preis ist der Verkaufspreis je Stück zum Zeitpunkt des Einbaus. ' +
        'Ältere Aufträge wurden bereits in die Tabelle `Auftrag_Archiv` verschoben; dabei wurde die Summe der verbauten Teile gespeichert, die Verbrauchsdaten wurden gelöscht.',
      vorgaben: [
        {
          tabelle: {
            titel: 'Werkstatt',
            kopf: ['W_ID', 'W_Name', 'W_Ort', 'W_Hebebuehnen'],
            zeilen: [
              ['1', 'Bielefeld-Mitte', 'Bielefeld', '8'],
              ['2', 'Gütersloh Nord', 'Gütersloh', '6'],
              ['3', 'Herford', 'Herford', '5'],
              ['4', 'Detmold', 'Detmold', '4'],
              ['…', '…', '…', '…'],
            ],
          },
        },
        {
          tabelle: {
            titel: 'Ersatzteil',
            kopf: ['ET_Nr', 'ET_Bezeichnung', 'ET_Hersteller', 'ET_EK', 'ET_VK', 'ET_Bestand'],
            zeilen: [
              ['10220', 'Ölfilter', 'Filtrion', '4.80', '8.90', '140'],
              ['11830', 'Bremsscheibe vorn', 'Stoppa', '31.50', '54.90', '22'],
              ['12004', 'Bremsbelagsatz vorn', 'Stoppa', '18.50', '32.90', '35'],
              ['13570', 'Zündkerze', 'Funkel', '3.10', '7.50', '260'],
              ['14112', 'Wischerblatt', 'Klarblick', '6.40', '14.90', '48'],
              ['15890', 'Keilrippenriemen', 'Riemtex', '12.70', '27.50', '9'],
              ['16420', 'Bremssattel links', 'Stoppa', '84.00', '139.00', '3'],
              ['…', '…', '…', '…', '…', '…'],
            ],
          },
        },
        {
          tabelle: {
            titel: 'Auftrag',
            kopf: ['A_Nr', 'W_ID', 'A_Kennzeichen', 'A_Datum', 'A_Status'],
            zeilen: [
              ['5101', '1', 'BI-KT 418', '2026-01-14', 'abgerechnet'],
              ['5102', '3', 'HF-SU 2025', '2026-02-03', 'abgerechnet'],
              ['5103', '2', 'GT-MR 77', '2026-03-19', 'abgerechnet'],
              ['5104', '1', 'BI-KT 418', '2026-07-08', 'abgerechnet'],
              ['5105', '4', 'LIP-AB 12', '2026-09-22', 'abgerechnet'],
              ['5106', '2', 'BI-XL 903', '2026-10-06', 'in Arbeit'],
              ['…', '…', '…', '…', '…'],
            ],
          },
        },
        {
          tabelle: {
            titel: 'Verbrauch',
            kopf: ['A_Nr', 'ET_Nr', 'V_Menge', 'V_Preis'],
            zeilen: [
              ['5101', '10220', '1', '8.90'],
              ['5101', '13570', '4', '7.50'],
              ['5102', '11830', '2', '54.90'],
              ['5102', '12004', '1', '32.90'],
              ['5103', '10220', '1', '8.90'],
              ['5104', '12004', '1', '32.90'],
              ['5105', '15890', '1', '27.50'],
              ['5106', '11830', '2', '54.90'],
              ['…', '…', '…', '…'],
            ],
          },
        },
        {
          tabelle: {
            titel: 'Auftrag_Archiv',
            kopf: ['A_Nr', 'W_ID', 'A_Kennzeichen', 'A_Datum', 'A_Teilesumme'],
            zeilen: [
              ['4310', '1', 'BI-KT 418', '2025-06-30', '112.40'],
              ['4402', '2', 'GT-MR 77', '2025-08-12', '64.70'],
              ['4517', '3', 'BI-KT 418', '2025-11-21', '245.80'],
              ['4603', '4', 'LIP-AB 12', '2025-12-15', '18.90'],
              ['…', '…', '…', '…', '…'],
            ],
          },
        },
        {
          hinweis:
            '`ROUND(zahl, stellen)` rundet `zahl` kaufmännisch auf `stellen` Nachkommastellen, z. B. `ROUND(60.102, 2)` = 60.10. Die Ergebnisbeispiele zeigen nur die Daten der Auszüge.',
        },
      ],
      teile: [
        {
          nr: 'a',
          punkte: 6,
          sp: ['AP2-4-2-2', 'AP2-4-2-1'],
          text:
            'Das Lager soll Teile zurückgeben, die in keinem aktuellen Auftrag verbaut wurden (archivierte Aufträge bleiben unberücksichtigt). Erstellen Sie eine SQL-Abfrage, die alle Ersatzteile mit Bestand ausgibt, zu denen es keinen Eintrag in der Tabelle `Verbrauch` gibt. ' +
            'Der Lagerwert ist Bestand × Einkaufspreis. Sortieren Sie absteigend nach dem Lagerwert. Verwenden Sie einen **LEFT JOIN**.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Ergebnisbeispiel',
                kopf: ['Teilenummer', 'Bezeichnung', 'Bestand', 'Lagerwert'],
                zeilen: [
                  ['14112', 'Wischerblatt', '48', '307.20'],
                  ['16420', 'Bremssattel links', '3', '252.00'],
                ],
              },
            },
          ],
          antwort: { art: 'code', zeilen: 8 },
          loesung: [
            {
              code: `SELECT e.ET_Nr AS Teilenummer, e.ET_Bezeichnung AS Bezeichnung,
       e.ET_Bestand AS Bestand,
       e.ET_Bestand * e.ET_EK AS Lagerwert
FROM Ersatzteil e
  LEFT JOIN Verbrauch v ON e.ET_Nr = v.ET_Nr
WHERE v.ET_Nr IS NULL
  AND e.ET_Bestand > 0
ORDER BY Lagerwert DESC;`,
            },
            'Der LEFT JOIN behält alle Ersatzteile; wo es keinen passenden Verbrauch gibt, sind die Spalten von `Verbrauch` NULL. Genau diese Zeilen filtert `IS NULL` heraus. ' +
              'Die Prüfung muss auf eine Spalte von `Verbrauch` gehen (z. B. v.ET_Nr oder v.A_Nr), nicht auf e.ET_Nr. Mit `NOT IN (SELECT ET_Nr FROM Verbrauch)` oder `NOT EXISTS` entsteht dasselbe Ergebnis; da ein LEFT JOIN verlangt ist, dafür max. 4 P.',
          ],
          bewertung: [
            'Spalten mit Aliasnamen inkl. berechnetem Lagerwert: 2 P',
            'LEFT JOIN Ersatzteil – Verbrauch mit richtiger Verknüpfung: 2 P',
            'Bedingung IS NULL auf einer Spalte von Verbrauch und Bestand > 0: 1 P',
            'Sortierung absteigend nach Lagerwert: 1 P',
          ],
        },
        {
          nr: 'b',
          punkte: 5,
          sp: ['AP2-4-2-4', 'AP2-4-2-2'],
          text:
            'Der Hersteller Stoppa meldet einen möglichen Materialfehler bei seinen Teilen. Die Werkstätten sollen die betroffenen Kundinnen und Kunden anrufen. ' +
            'Erstellen Sie eine SQL-Abfrage, die alle Aufträge ausgibt, in denen mindestens ein Teil des Herstellers Stoppa verbaut wurde – **jeden Auftrag nur einmal**, nach Datum aufsteigend sortiert. ' +
            'Ermitteln Sie die betroffenen Aufträge mit einer **Unterabfrage**.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Ergebnisbeispiel',
                kopf: ['Auftrag', 'Kennzeichen', 'Datum', 'Werkstatt'],
                zeilen: [
                  ['5102', 'HF-SU 2025', '2026-02-03', 'Herford'],
                  ['5104', 'BI-KT 418', '2026-07-08', 'Bielefeld-Mitte'],
                  ['5106', 'BI-XL 903', '2026-10-06', 'Gütersloh Nord'],
                ],
              },
            },
          ],
          antwort: { art: 'code', zeilen: 10 },
          loesung: [
            {
              code: `SELECT a.A_Nr AS Auftrag, a.A_Kennzeichen AS Kennzeichen,
       a.A_Datum AS Datum, w.W_Name AS Werkstatt
FROM Auftrag a
  INNER JOIN Werkstatt w ON a.W_ID = w.W_ID
WHERE a.A_Nr IN (SELECT v.A_Nr
                 FROM Verbrauch v
                   INNER JOIN Ersatzteil e ON v.ET_Nr = e.ET_Nr
                 WHERE e.ET_Hersteller = 'Stoppa')
ORDER BY a.A_Datum;`,
            },
            'Auftrag 5102 enthält zwei Stoppa-Teile; durch die Unterabfrage mit IN erscheint er trotzdem nur einmal. Ein einfacher JOIN über Verbrauch und Ersatzteil würde ihn doppelt liefern. ' +
              'Gleichwertig: `EXISTS (SELECT * FROM Verbrauch v INNER JOIN Ersatzteil e ON v.ET_Nr = e.ET_Nr WHERE v.A_Nr = a.A_Nr AND e.ET_Hersteller = \'Stoppa\')`; ' +
              'Unterabfrage ohne JOIN: `v.ET_Nr IN (SELECT ET_Nr FROM Ersatzteil WHERE ET_Hersteller = \'Stoppa\')` geschachtelt. Eine Lösung nur mit JOIN und DISTINCT liefert dasselbe Ergebnis, erfüllt aber die Vorgabe nicht: max. 3 P.',
          ],
          bewertung: [
            'Spalten mit Aliasnamen und JOIN auf Werkstatt: 1 P',
            'Unterabfrage mit Verknüpfung Verbrauch – Ersatzteil und Filter Hersteller: 2 P',
            'Einbindung mit IN bzw. EXISTS (keine Duplikate): 1 P',
            'Sortierung nach Datum: 1 P',
          ],
        },
        {
          nr: 'c',
          punkte: 8,
          sp: ['AP2-4-2-4', 'AP2-4-2-3', 'AP2-4-2-2'],
          text:
            'Für das Fahrzeug **BI-KT 418** soll die vollständige Werkstatthistorie angezeigt werden – aus den aktuellen Aufträgen und aus dem Archiv. ' +
            'Bei aktuellen Aufträgen wird die Teilesumme aus der Tabelle `Verbrauch` berechnet (Menge × Preis); es genügen Aufträge, in denen Teile verbaut wurden. ' +
            'Die Spalte „Quelle“ zeigt, woher die Zeile stammt. Sortieren Sie die neuesten Aufträge zuerst. Erstellen Sie die SQL-Abfrage.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Ergebnisbeispiel',
                kopf: ['Datum', 'Werkstatt', 'Teilesumme', 'Quelle'],
                zeilen: [
                  ['2026-07-08', 'Bielefeld-Mitte', '32.90', 'aktuell'],
                  ['2026-01-14', 'Bielefeld-Mitte', '38.90', 'aktuell'],
                  ['2025-11-21', 'Herford', '245.80', 'Archiv'],
                  ['2025-06-30', 'Bielefeld-Mitte', '112.40', 'Archiv'],
                ],
              },
            },
          ],
          antwort: { art: 'code', zeilen: 16 },
          loesung: [
            {
              code: `SELECT a.A_Datum AS Datum, w.W_Name AS Werkstatt,
       SUM(v.V_Menge * v.V_Preis) AS Teilesumme, 'aktuell' AS Quelle
FROM Auftrag a
  INNER JOIN Werkstatt w ON a.W_ID = w.W_ID
  INNER JOIN Verbrauch v ON a.A_Nr = v.A_Nr
WHERE a.A_Kennzeichen = 'BI-KT 418'
GROUP BY a.A_Nr, a.A_Datum, w.W_Name
UNION ALL
SELECT r.A_Datum, w.W_Name, r.A_Teilesumme, 'Archiv'
FROM Auftrag_Archiv r
  INNER JOIN Werkstatt w ON r.W_ID = w.W_ID
WHERE r.A_Kennzeichen = 'BI-KT 418'
ORDER BY Datum DESC;`,
            },
            'Beide Teilabfragen müssen gleich viele Spalten mit passenden Datentypen liefern; die Spaltennamen kommen aus der ersten Abfrage, deshalb sortiert `ORDER BY Datum` das Gesamtergebnis (gleichwertig: `ORDER BY 1 DESC`). ' +
              'Auftrag 5101: 1 × 8.90 + 4 × 7.50 = 38.90. Gruppiert wird nach der Auftragsnummer, damit zwei Aufträge am selben Tag getrennt bleiben. ' +
              '`UNION` statt `UNION ALL` ist hier ebenfalls richtig (es gibt keine gleichen Zeilen), entfernt aber unnötig Duplikate. Gleichwertig: die aktuelle Teilesumme über eine Unterabfrage im SELECT.',
          ],
          bewertung: [
            'erste Teilabfrage: JOINs Auftrag – Werkstatt – Verbrauch: 2 P',
            'SUM(Menge × Preis) mit passendem GROUP BY: 2 P',
            'zweite Teilabfrage auf Auftrag_Archiv mit JOIN auf Werkstatt: 1 P',
            'Filter auf das Kennzeichen in beiden Teilen und konstante Spalte Quelle: 1 P',
            'Verbindung mit UNION ALL: 1 P',
            'Sortierung absteigend nach Datum für das Gesamtergebnis: 1 P',
          ],
        },
        {
          nr: 'd',
          punkte: 4,
          sp: ['AP2-4-3-1'],
          text:
            'Stoppa erhöht seine Einkaufspreise um **6 %**. Der Verkaufspreis von Stoppa-Teilen wird künftig mit einem Aufschlag von **80 %** auf den **neuen** Einkaufspreis kalkuliert. ' +
            'Beide Preise werden auf zwei Nachkommastellen gerundet. Erstellen Sie die SQL-Anweisung(en), die die Preise in der Tabelle `Ersatzteil` anpassen.',
          antwort: { art: 'code', zeilen: 8 },
          loesung: [
            {
              code: `UPDATE Ersatzteil
SET ET_EK = ROUND(ET_EK * 1.06, 2)
WHERE ET_Hersteller = 'Stoppa';

UPDATE Ersatzteil
SET ET_VK = ROUND(ET_EK * 1.8, 2)
WHERE ET_Hersteller = 'Stoppa';`,
            },
            'Ergebnis im Auszug: 11830 → EK 33.39, VK 60.10; 12004 → EK 19.61, VK 35.30; 16420 → EK 89.04, VK 160.27.',
            'Gleichwertig in einer Anweisung: `SET ET_EK = ROUND(ET_EK * 1.06, 2), ET_VK = ROUND(ET_EK * 1.06 * 1.8, 2)`. Nach SQL-Standard verwenden alle Ausdrücke in SET die **alten** Werte der Zeile – deshalb muss der Faktor 1.06 im VK-Ausdruck stehen. ' +
              '(Einige Systeme, z. B. MySQL, werten die Zuweisungen von links nach rechts mit den neuen Werten aus; die Lösung mit zwei Anweisungen ist daher die sicherste.) Die Reihenfolge der beiden Anweisungen ist wichtig: erst EK, dann VK.',
          ],
          bewertung: [
            'UPDATE mit WHERE auf den Hersteller: 1 P',
            'neuer EK = EK × 1,06 gerundet: 1 P',
            'neuer VK = neuer EK × 1,8 gerundet (Reihenfolge bzw. alte/neue Werte richtig beachtet): 2 P',
          ],
        },
        {
          nr: 'e',
          punkte: 4,
          sp: ['AP2-4-3-2'],
          text:
            'Für die Online-Terminbuchung wird die Tabelle `Termin` benötigt. Sie enthält eine eindeutige Termin-ID, die Werkstatt (Pflicht), das Kennzeichen (Pflicht, bis 12 Zeichen), Datum und Uhrzeit des Beginns (Pflicht), ' +
            'die geplante Dauer in Minuten (Pflicht), eine Beschreibung des Anliegens (bis 200 Zeichen) und die Nummer des Auftrags, der beim Eintreffen des Fahrzeugs angelegt wird (zunächst leer). ' +
            'Erstellen Sie die SQL-Anweisung zum Anlegen der Tabelle mit Primär- und Fremdschlüsseln.',
          antwort: { art: 'code', zeilen: 12 },
          loesung: [
            {
              code: `CREATE TABLE Termin (
  TE_ID          INTEGER      PRIMARY KEY,
  W_ID           INTEGER      NOT NULL,
  TE_Kennzeichen VARCHAR(12)  NOT NULL,
  TE_Beginn      TIMESTAMP    NOT NULL,
  TE_Dauer_Min   INTEGER      NOT NULL,
  TE_Anliegen    VARCHAR(200),
  A_Nr           INTEGER,
  FOREIGN KEY (W_ID) REFERENCES Werkstatt (W_ID),
  FOREIGN KEY (A_Nr) REFERENCES Auftrag (A_Nr)
);`,
            },
            'Gleichwertig: `DATETIME` statt `TIMESTAMP`; getrennte Spalten für Datum und Uhrzeit; `PRIMARY KEY (TE_ID)` als eigene Zeile; Fremdschlüssel direkt an der Spalte mit `REFERENCES`. ' +
              'A_Nr darf nicht NOT NULL sein, weil der Auftrag erst beim Eintreffen entsteht. Ein Fremdschlüssel auf ein Fahrzeug ist nicht möglich, da es im Auszug keine Fahrzeugtabelle gibt.',
          ],
          bewertung: [
            'Spalten mit passenden Datentypen und NOT NULL für Pflichtangaben: 2 P',
            'Primärschlüssel: 1 P',
            'beide Fremdschlüssel mit REFERENCES: 1 P',
          ],
        },
      ],
    },
  ],
};
