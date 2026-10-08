// Probeprüfung AP2 – Planen eines Softwareproduktes (eigene Aufgaben, fiktive Firmen)
export default {
  id: 'pb1-02',
  teil: 'PB1',
  titel: 'Tierarztkette PfotenPartner',
  situation:
    'Die Hollerbach & Demir Software GmbH in Bielefeld entwickelt Web- und App-Lösungen für Dienstleister im Gesundheitswesen. ' +
    'Neuer Kunde ist die PfotenPartner Tierarztpraxen GmbH. Sie betreibt in Ostwestfalen-Lippe zwölf Kleintierpraxen und eine Tierklinik ' +
    'mit Notdienst und beschäftigt rund 160 Personen, davon 55 Tierärztinnen und Tierärzte. Bisher führt jede Praxis ihren eigenen ' +
    'Terminkalender, Termine werden fast nur telefonisch vereinbart, und die Patientenakten der Tiere liegen in unterschiedlichen Altprogrammen. ' +
    'Befunde des externen Labors VetLab kommen per Fax oder als PDF per E-Mail. ' +
    'Mit dem neuen System „VetPlan“ sollen Tierhalterinnen und Tierhalter online Termine in allen Praxen buchen, alle Praxen auf eine gemeinsame ' +
    'Patientenverwaltung zugreifen und Laborbefunde automatisch in die Patientenakte übernommen werden. ' +
    'Sie sind Mitglied des Projektteams bei Hollerbach & Demir.',
  aufgaben: [
    // ------------------------------------------------------------------ Aufgabe 1
    {
      id: 'pb1-02-1',
      art: 'projekt',
      titel: 'Vorgehen und Terminplanung',
      punkte: 27,
      sp: ['AP2-1-1-4'],
      situation:
        'PfotenPartner hat ein Lastenheft übergeben. Vereinbart sind ein Festpreis und ein Pilotbetrieb in der Praxis Bielefeld-Mitte, ' +
        'bevor VetPlan in allen Praxen eingeführt wird. Die Anbindung an das Labor VetLab muss sich an dessen vorhandene Schnittstelle halten. ' +
        'Wie die Online-Buchung für die Tierhalter genau aussehen soll, ist dagegen noch offen.',
      teile: [
        {
          nr: 'a',
          punkte: 3,
          sp: ['AP2-1-1-1'],
          text: 'Die Projektleitung schlägt vor, das Projekt nach dem V-Modell durchzuführen.\n\nBeschreiben Sie den Grundgedanken des V-Modells.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            'Das V-Modell ist ein klassisches (sequenzielles) Vorgehensmodell. Auf dem linken Ast werden die Entwurfsphasen von oben nach unten immer feiner durchlaufen (z. B. Anforderungsdefinition, funktionaler Systementwurf, technischer Systementwurf, Komponentenentwurf), unten erfolgt die Programmierung.',
            'Auf dem rechten Ast folgen die Teststufen von unten nach oben (Komponententest, Integrationstest, Systemtest, Abnahmetest). **Jeder Entwurfsstufe steht eine Teststufe gegenüber**, die prüft, ob das Ergebnis dieser Stufe erfüllt ist; die Testfälle werden schon in der jeweiligen Entwurfsphase festgelegt. So wird früh an die Qualitätssicherung gedacht (Verifikation und Validierung).',
          ],
          bewertung: [
            '1 P: Entwurfsphasen absteigend, Programmierung an der unteren Spitze des V',
            '1 P: Teststufen aufsteigend',
            '1 P: Gegenüberstellung von Entwurfs- und Teststufe (Testfälle früh festgelegt)',
          ],
        },
        {
          nr: 'b',
          punkte: 4,
          sp: ['AP2-1-1-1'],
          text:
            'Ein Kollege hält ein agiles Vorgehen nach Scrum für besser geeignet.\n\n' +
            'Beurteilen Sie, ob das V-Modell oder ein agiles Vorgehen für dieses Projekt besser passt. Begründen Sie Ihre Entscheidung mit zwei Argumenten aus der Situation.',
          antwort: { art: 'text', zeilen: 7 },
          loesung: [
            'Beide Entscheidungen sind richtig, wenn sie mit der Situation begründet werden. Beispiele:',
            '**Für das V-Modell:**',
            '- Festpreis und Lastenheft verlangen einen früh festgelegten Leistungsumfang; das V-Modell plant Umfang, Kosten und Termine zu Beginn verbindlich.',
            '- Die Laborschnittstelle ist durch VetLab vorgegeben; diese Anforderungen ändern sich kaum und lassen sich vorab vollständig spezifizieren.',
            '- Patientendaten und Abrechnung erfordern eine nachweisbare Qualität; die festen Teststufen mit Abnahme passen dazu.',
            '**Für ein agiles Vorgehen:**',
            '- Die Gestaltung der Online-Buchung ist noch offen. In kurzen Sprints mit Sprint Reviews können PfotenPartner und Tierhalter früh Teilergebnisse sehen und Rückmeldung geben.',
            '- Änderungen der Anforderungen (z. B. nach dem Pilotbetrieb) lassen sich laufend über das Product Backlog einplanen, statt teure Änderungsanträge zu stellen.',
            '- Ein lauffähiges Teilprodukt (z. B. zuerst die Terminbuchung) kann früher in der Pilotpraxis genutzt werden.',
            'Ebenfalls richtig: eine begründete Mischform, z. B. Laboranbindung klassisch, Online-Buchung agil.',
          ],
          bewertung: [
            '1 P: eindeutige Entscheidung',
            'je Argument mit Bezug auf die Situation 1,5 P (max. 3 P)',
            'Argumente ohne Bezug zur Situation höchstens 0,5 P',
          ],
        },
        {
          nr: 'c',
          punkte: 3,
          sp: ['AP2-1-1-2'],
          text: 'Auf Grundlage des Lastenhefts erstellt Hollerbach & Demir ein Pflichtenheft.\n\nBeschreiben Sie drei Unterschiede zwischen Lastenheft und Pflichtenheft.',
          antwort: {
            art: 'tabelle',
            kopf: ['Merkmal', 'Lastenheft', 'Pflichtenheft'],
            zeilen: [
              [null, null, null],
              [null, null, null],
              [null, null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Merkmal', 'Lastenheft', 'Pflichtenheft'],
                zeilen: [
                  ['Verfasser', 'Auftraggeber (PfotenPartner)', 'Auftragnehmer (Hollerbach & Demir)'],
                  ['Inhalt', 'WAS und WOFÜR: Anforderungen und Ziele aus Sicht des Kunden', 'WIE und WOMIT: Umsetzung der Anforderungen, technische Lösung'],
                  ['Detailgrad', 'eher grob, fachliche Sprache', 'detailliert und prüfbar, auch technische Angaben (Architektur, Schnittstellen, Datenformate)'],
                  ['Zeitpunkt/Bedeutung', 'Grundlage für Ausschreibung und Angebot', 'entsteht danach; nach Freigabe durch den Kunden verbindliche Vertragsgrundlage und Maßstab der Abnahme'],
                ],
              },
            },
          ],
          bewertung: ['je richtig beschriebenem Unterschied 1 P (max. 3 P)', 'andere sinnvolle Unterschiede sind richtig'],
        },
        {
          nr: 'd',
          punkte: 12,
          text:
            'Für das Projekt soll ein Netzplan erstellt werden. Die Vorgänge sind unten beschrieben, Vorgang A ist bereits eingetragen.\n\n' +
            'Erstellen Sie den vollständigen Netzplan mit allen Vorgängen und Abhängigkeiten. Berechnen Sie für jeden Vorgang FAZ, FEZ, SAZ, SEZ, Gesamtpuffer (GP) und freien Puffer (FP).',
          vorgaben: [
            'Ablauf (Dauern in Arbeitstagen):\n' +
              '- Zuerst erfolgt die Anforderungsanalyse mit Erstellung des Pflichtenhefts (A, 8 Tage).\n' +
              '- Danach beginnen drei Vorgänge parallel: Datenmodell und Architektur entwerfen (B, 5 Tage), Mockups erstellen und mit Tierhaltern testen (C, 6 Tage) sowie Laborschnittstelle mit VetLab abstimmen (D, 4 Tage).\n' +
              '- Das Backend für Termine und Patientenverwaltung (E, 15 Tage) wird entwickelt, sobald das Datenmodell fertig ist.\n' +
              '- Die Web-Oberfläche für Tierhalter und Praxen (F, 12 Tage) kann erst beginnen, wenn das Datenmodell fertig ist und die Mockup-Tests abgeschlossen sind.\n' +
              '- Die Laboranbindung (G, 7 Tage) setzt das fertige Datenmodell und die abgestimmte Laborschnittstelle voraus.\n' +
              '- Der Integrations- und Systemtest (H, 6 Tage) beginnt, wenn E, F und G abgeschlossen sind.\n' +
              '- Zum Schluss folgen Schulung und Pilotbetrieb in Bielefeld-Mitte (I, 5 Tage).',
            {
              hinweis: 'Das Projekt beginnt zum Zeitpunkt 0. Es gilt FEZ = FAZ + Dauer; ein Nachfolger kann zum FEZ seines Vorgängers beginnen.',
            },
            {
              titel: 'Knotenlegende und Vorgang A',
              code:
                'Legende                    Vorgang A\n' +
                '+-------+-------+-------+  +-------+-------+-------+\n' +
                '|  FAZ  | Dauer |  FEZ  |  |   0   |   8   |   8   |\n' +
                '+-------+-------+-------+  +-------+-------+-------+\n' +
                '| Nr.  Bezeichnung      |  | A  Anforderungsanalyse|\n' +
                '+-----+-----+-----+-----+  +-----+-----+-----+-----+\n' +
                '| SAZ | GP  | FP  | SEZ |  |  0  |  0  |  0  |  8  |\n' +
                '+-----+-----+-----+-----+  +-----+-----+-----+-----+',
            },
          ],
          antwort: { art: 'papier' },
          loesung: [
            '**Abhängigkeiten (Pfeile):** A→B, A→C, A→D, B→E, B→F, C→F, B→G, D→G, E→H, F→H, G→H, H→I',
            {
              code:
                '        +--> B --+--> E -------+\n' +
                '        |        +--> F --+    |\n' +
                '  A ----+--> C ------^    +--> H ---> I\n' +
                '        |        +--> G --+    |\n' +
                '        +--> D --^             |\n' +
                '                 (B --> G)  (E, F, G --> H)',
              titel: 'Struktur (Skizze)',
            },
            {
              tabelle: {
                titel: 'Werte der Knoten',
                kopf: ['Vorgang', 'Dauer', 'FAZ', 'FEZ', 'SAZ', 'SEZ', 'GP', 'FP'],
                zeilen: [
                  ['A Anforderungsanalyse', '8', '0', '8', '0', '8', '0', '0'],
                  ['B Datenmodell/Architektur', '5', '8', '13', '8', '13', '0', '0'],
                  ['C Mockups und Tests', '6', '8', '14', '10', '16', '2', '0'],
                  ['D Laborschnittstelle abstimmen', '4', '8', '12', '17', '21', '9', '1'],
                  ['E Backend', '15', '13', '28', '13', '28', '0', '0'],
                  ['F Web-Oberfläche', '12', '14', '26', '16', '28', '2', '2'],
                  ['G Laboranbindung', '7', '13', '20', '21', '28', '8', '8'],
                  ['H Integrations-/Systemtest', '6', '28', '34', '28', '34', '0', '0'],
                  ['I Schulung/Pilotbetrieb', '5', '34', '39', '34', '39', '0', '0'],
                ],
              },
            },
            'Rechenweg: Vorwärts ist FAZ das Maximum der FEZ aller Vorgänger (z. B. F: max(13; 14) = 14; H: max(28; 26; 20) = 28). Rückwärts ist SEZ das Minimum der SAZ aller Nachfolger (z. B. B: min(13; 16; 21) = 13). GP = SAZ − FAZ; FP = kleinster FAZ der Nachfolger − eigener FEZ (z. B. D: 13 − 12 = 1; C: 14 − 14 = 0). Projektdauer: 39 Tage.',
          ],
          bewertung: [
            '2 P: alle Knoten vorhanden und alle Abhängigkeiten richtig (1 P bei höchstens zwei fehlenden oder falschen Pfeilen)',
            '4 P: FAZ und FEZ, je Knoten B bis I 0,5 P',
            '4 P: SAZ und SEZ, je Knoten B bis I 0,5 P',
            '2 P: GP und FP aller Knoten richtig (1 P bei höchstens zwei Fehlern)',
            'Folgefehler aus falschen Abhängigkeiten werden berücksichtigt',
          ],
        },
        {
          nr: 'e',
          punkte: 2,
          text: 'Geben Sie den kritischen Pfad an und erläutern Sie, was er für die Projektleitung bedeutet.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            'Kritischer Pfad: **A → B → E → H → I** (alle Vorgänge mit Gesamtpuffer 0; 8 + 5 + 15 + 6 + 5 = 39 Tage).',
            'Bedeutung: Jede Verzögerung eines Vorgangs auf diesem Pfad verschiebt das Projektende um dieselbe Zeit. Die Projektleitung muss diese Vorgänge besonders eng überwachen und bei Engpässen hier zuerst Ressourcen einsetzen.',
          ],
          bewertung: ['1 P kritischer Pfad (Folgefehler aus d berücksichtigen)', '1 P Bedeutung'],
        },
        {
          nr: 'f',
          punkte: 3,
          sp: ['AP2-1-1-4', 'AP2-1-1-3'],
          text:
            'Während der Planung werden zwei Risiken bekannt. Betrachten Sie die Fälle getrennt voneinander, ausgehend vom ursprünglichen Plan.\n\n' +
            '- Fall 1: VetLab teilt mit, dass die Abstimmung der Laborschnittstelle (D) 6 Tage länger dauert.\n' +
            '- Fall 2: Die Mockup-Tests mit Tierhaltern (C) dauern 3 Tage länger.\n\n' +
            'Ermitteln Sie die Projektdauer in Fall 1 und in Fall 2 sowie den Gesamtpuffer, der Vorgang D in Fall 1 noch bleibt.',
          antwort: {
            art: 'zahlen',
            felder: [
              { id: 'fall1', label: 'Projektdauer Fall 1', erwartet: 39, stellen: 0, einheit: 'Tage' },
              { id: 'fall2', label: 'Projektdauer Fall 2', erwartet: 40, stellen: 0, einheit: 'Tage' },
              { id: 'gpD', label: 'Gesamtpuffer von D in Fall 1', erwartet: 3, stellen: 0, einheit: 'Tage' },
            ],
          },
          loesung: [
            '**Fall 1:** D dauert 10 statt 4 Tage. D liegt nicht auf dem kritischen Pfad und hat 9 Tage Gesamtpuffer. Die Verzögerung von 6 Tagen wird vom Puffer aufgefangen: D endet am Tag 18, G läuft von 18 bis 25 und ist vor dem Beginn von H (Tag 28) fertig. Projektdauer bleibt **39 Tage**; D bleibt ein Gesamtpuffer von 9 − 6 = **3 Tagen**.',
            '**Fall 2:** C dauert 9 statt 6 Tage, endet also am Tag 17. C hat nur 2 Tage Gesamtpuffer. F beginnt damit erst am Tag 17 und endet am Tag 29; H läuft von 29 bis 35, I von 35 bis 40. Projektdauer: **40 Tage** (1 Tag später). Der kritische Pfad ist jetzt A → C → F → H → I.',
          ],
          bewertung: ['je richtigem Wert 1 P (max. 3 P)', 'Folgefehler aus d werden berücksichtigt'],
        },
      ],
    },

    // ------------------------------------------------------------------ Aufgabe 2
    {
      id: 'pb1-02-2',
      art: 'modell',
      titel: 'Datenmodell der Patientenverwaltung',
      punkte: 26,
      sp: ['AP2-2-2-1'],
      situation:
        'Für die gemeinsame Patientenverwaltung und Terminbuchung von VetPlan entwirft das Projektteam ein Datenmodell. ' +
        'Die folgenden Anforderungen stammen aus Gesprächen mit der Praxisleitung von PfotenPartner.',
      teile: [
        {
          nr: 'a',
          punkte: 16,
          text:
            'Erstellen Sie aus den Anforderungen ein ER-Modell mit Entitäten, Attributen, Beziehungen und Kardinalitäten (1:1, 1:n, m:n). Kennzeichnen Sie die Primärschlüssel. Fremdschlüssel werden im ER-Modell nicht angegeben. Die Entität `Tierhalter` ist bereits modelliert.\n\n' +
            '- Zu jedem Tierhalter werden Kundennummer, Name, Telefonnummer und E-Mail-Adresse gespeichert (bereits modelliert).\n' +
            '- Ein Tierhalter hat ein oder mehrere Tiere. Jedes Tier ist genau einem Tierhalter zugeordnet. Zu jedem Tier werden eine eindeutige Patientennummer, der Name, die Tierart, das Geburtsdatum und die Chipnummer gespeichert.\n' +
            '- Zu jeder Praxis werden Praxisnummer, Bezeichnung, Anschrift und Telefonnummer gespeichert.\n' +
            '- Jede Tierärztin bzw. jeder Tierarzt hat eine Personalnummer, einen Namen und ein Fachgebiet und gehört zu genau einer Stammpraxis. In einer Praxis arbeiten mehrere Tierärztinnen und Tierärzte. Bei Bedarf vertreten sie sich auch in anderen Praxen der Kette.\n' +
            '- Ein Termin hat eine Terminnummer, ein Datum, eine Uhrzeit, eine geplante Dauer und einen Anlass. Er gilt für genau ein Tier, findet in genau einer Praxis statt und wird von genau einer Tierärztin bzw. einem Tierarzt durchgeführt. Ein Tier kann viele Termine haben.\n' +
            '- Im Leistungskatalog hat jede Leistung eine Leistungsnummer, eine Bezeichnung und einen aktuellen Preis. Bei einem Termin können mehrere Leistungen erbracht werden (z. B. Allgemeinuntersuchung, Impfung); eine Leistung kommt bei vielen Terminen vor. Für jede bei einem Termin erbrachte Leistung werden die Anzahl und der tatsächlich berechnete Einzelpreis gespeichert.',
          vorgaben: [
            {
              titel: 'Vorgegebene Entität (Chen-Notation)',
              code:
                '  (Kundennummer)  (Name)  (Telefon)  (E-Mail)\n' +
                '        \\           |        |         /\n' +
                '         +----------------------------+\n' +
                '         |         Tierhalter         |\n' +
                '         +----------------------------+\n' +
                '  Primärschlüssel: Kundennummer (unterstrichen)',
            },
          ],
          antwort: { art: 'papier' },
          loesung: [
            'Musterlösung, Element für Element (Bezeichnungen der Beziehungen können sinnvoll abweichen; die Min-Max-Notation ist ebenfalls richtig, wenn sie dieselben Aussagen trifft):',
            {
              tabelle: {
                titel: 'Entitäten',
                kopf: ['Entität', 'Attribute (PK = Primärschlüssel, im Diagramm unterstrichen)'],
                zeilen: [
                  ['Tierhalter (vorgegeben)', 'Kundennummer (PK), Name, Telefon, E-Mail'],
                  ['Tier', 'Patientennummer (PK), Name, Tierart, Geburtsdatum, Chipnummer'],
                  ['Praxis', 'Praxisnummer (PK), Bezeichnung, Anschrift, Telefon'],
                  ['Tierarzt', 'Personalnummer (PK), Name, Fachgebiet'],
                  ['Termin', 'Terminnummer (PK), Datum, Uhrzeit, Dauer, Anlass'],
                  ['Leistung', 'Leistungsnummer (PK), Bezeichnung, Preis'],
                ],
              },
            },
            {
              tabelle: {
                titel: 'Beziehungen',
                kopf: ['Beziehung (Raute)', 'zwischen', 'Kardinalität'],
                zeilen: [
                  ['besitzt', 'Tierhalter – Tier', '1 : n (ein Tierhalter, viele Tiere)'],
                  ['gilt für', 'Tier – Termin', '1 : n'],
                  ['findet statt in', 'Praxis – Termin', '1 : n'],
                  ['führt durch', 'Tierarzt – Termin', '1 : n'],
                  ['ist Stammpraxis von', 'Praxis – Tierarzt', '1 : n'],
                  ['umfasst', 'Termin – Leistung', 'm : n, mit den Beziehungsattributen **Anzahl** und **Einzelpreis**'],
                ],
              },
            },
            'Wichtig: Die Praxis eines Termins darf nicht nur über die Stammpraxis des Tierarztes abgeleitet werden, weil Tierärztinnen und Tierärzte auch in anderen Praxen vertreten. Deshalb sind „findet statt in“ und „ist Stammpraxis von“ zwei eigene Beziehungen. Anzahl und Einzelpreis gehören weder zum Termin noch zur Leistung allein, sondern zur Kombination aus beiden; sie hängen an der Beziehung „umfasst“.',
          ],
          bewertung: [
            'je neuer Entität mit allen Attributen 1 P (5 Entitäten, 5 P)',
            '1 P: Primärschlüssel aller neuen Entitäten richtig gekennzeichnet',
            'je Beziehung zwischen den richtigen Entitäten 1 P (6 Beziehungen, 6 P)',
            'je richtiger Kardinalität 0,5 P (6 Beziehungen, 3 P)',
            '1 P: Anzahl und Einzelpreis als Attribute der Beziehung „umfasst“',
            'eine zusätzliche m:n-Beziehung „vertritt in“ zwischen Tierarzt und Praxis ist nicht gefordert, aber nicht falsch; sie ersetzt nicht die Beziehung Praxis – Termin',
          ],
        },
        {
          nr: 'b',
          punkte: 4,
          sp: ['AP2-2-2-2'],
          text:
            'Das ER-Modell wird in ein relationales Modell überführt.\n\n' +
            'Geben Sie die Tabellen `Termin`, `Leistung` und die Tabelle für die Beziehung zwischen Termin und Leistung mit allen Attributen an. Kennzeichnen Sie Primärschlüssel (PK) und Fremdschlüssel (FK).',
          antwort: { art: 'code', zeilen: 6 },
          loesung: [
            {
              code:
                'Termin (Terminnummer [PK], Datum, Uhrzeit, Dauer, Anlass,\n' +
                '        Patientennummer [FK], Praxisnummer [FK], Personalnummer [FK])\n' +
                'Leistung (Leistungsnummer [PK], Bezeichnung, Preis)\n' +
                'Termin_Leistung (Terminnummer [PK, FK], Leistungsnummer [PK, FK], Anzahl, Einzelpreis)',
            },
            'Die m:n-Beziehung wird zu einer eigenen Zuordnungstabelle. Ihr Primärschlüssel setzt sich aus den Primärschlüsseln der beiden beteiligten Tabellen zusammen, die zugleich Fremdschlüssel sind. Die 1:n-Beziehungen des Termins werden über Fremdschlüssel in der Tabelle auf der n-Seite (Termin) umgesetzt.',
          ],
          bewertung: [
            '1 P: eigene Zuordnungstabelle für die m:n-Beziehung',
            '1 P: zusammengesetzter Primärschlüssel aus Terminnummer und Leistungsnummer, beide auch als FK gekennzeichnet',
            '1 P: Anzahl und Einzelpreis in der Zuordnungstabelle',
            '1 P: Termin mit den drei Fremdschlüsseln Patientennummer, Praxisnummer, Personalnummer',
          ],
        },
        {
          nr: 'c',
          punkte: 3,
          sp: ['AP2-2-2-2', 'AP2-4-1-2'],
          text:
            'Ein Tier soll aus der Datenbank gelöscht werden. Zu diesem Tier sind noch Termine gespeichert.\n\n' +
            'Erläutern Sie den Begriff referenzielle Integrität und beschreiben Sie zwei Möglichkeiten, wie das Datenbanksystem auf diese Löschung reagieren kann.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '**Referenzielle Integrität:** Jeder Fremdschlüsselwert muss auf einen vorhandenen Primärschlüsselwert der referenzierten Tabelle verweisen (oder leer sein, wenn das erlaubt ist). Es darf also keinen Termin geben, dessen Patientennummer auf ein nicht vorhandenes Tier zeigt.',
            '**Mögliche Reaktionen** (zwei genügen):',
            '- **Löschen verweigern** (RESTRICT bzw. NO ACTION): Das DBMS bricht die Löschung mit einer Fehlermeldung ab, solange noch Termine auf das Tier verweisen.',
            '- **Weitergabe der Löschung** (CASCADE): Mit dem Tier werden auch alle seine Termine gelöscht (und damit ggf. die zugehörigen Zeilen in Termin_Leistung).',
            '- **Fremdschlüssel leeren** (SET NULL): Die Patientennummer in den Terminen wird auf NULL gesetzt; nur möglich, wenn die Spalte NULL zulässt.',
            'Für VetPlan ist „Löschen verweigern“ sinnvoll, weil Termine mit Leistungen für die Abrechnung aufbewahrt werden müssen.',
          ],
          bewertung: ['1 P Erläuterung referenzielle Integrität', 'je beschriebener Reaktion 1 P (max. 2 P)'],
        },
        {
          nr: 'd',
          punkte: 3,
          text: 'Begründen Sie, warum der Einzelpreis zusätzlich bei der erbrachten Leistung gespeichert wird, obwohl jede Leistung bereits einen Preis hat.',
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            'Der Preis in der Entität `Leistung` ist der **aktuelle** Katalogpreis. Er ändert sich im Laufe der Zeit, z. B. bei Preiserhöhungen.',
            'Für bereits erbrachte Leistungen muss aber der Preis erhalten bleiben, der damals tatsächlich berechnet wurde, damit Rechnungen später nachvollziehbar bleiben und Auswertungen (Umsatz) stimmen. Würde nur der Katalogpreis gespeichert, änderten sich bei einer Preisanpassung rückwirkend alle alten Termine.',
            'Außerdem kann der berechnete Preis im Einzelfall vom Katalogpreis abweichen, z. B. durch einen Notdienstzuschlag oder einen Rabatt.',
          ],
          bewertung: [
            '1 P: Katalogpreis ändert sich im Zeitverlauf',
            '2 P: historischer bzw. abweichender Preis muss für Rechnung/Nachvollziehbarkeit erhalten bleiben',
          ],
        },
      ],
    },

    // ------------------------------------------------------------------ Aufgabe 3
    {
      id: 'pb1-02-3',
      art: 'qualitaet',
      titel: 'Qualität der Online-Buchung',
      punkte: 23,
      sp: ['AP2-1-5-1'],
      situation:
        'Die Online-Terminbuchung ist der Teil von VetPlan, den die meisten Menschen nutzen werden. PfotenPartner legt deshalb großen Wert auf Qualität, ' +
        'einfache Bedienung und Barrierefreiheit. Sie wirken an Qualitätsanforderungen, Oberflächenentwurf und Testkonzept mit.',
      teile: [
        {
          nr: 'a',
          punkte: 5,
          sp: ['AP2-1-3-1'],
          text:
            'Im Pflichtenheft stehen die folgenden Anforderungen.\n\n' +
            'Ordnen Sie jeder Anforderung ein Qualitätsmerkmal nach ISO/IEC 25010 zu. Zur Auswahl stehen: Funktionale Eignung, Leistungseffizienz, Kompatibilität, Benutzbarkeit, Zuverlässigkeit, Sicherheit, Wartbarkeit, Übertragbarkeit.',
          antwort: {
            art: 'tabelle',
            kopf: ['Anforderung', 'Qualitätsmerkmal'],
            zeilen: [
              ['1. Auch wenn 500 Personen gleichzeitig buchen, werden freie Termine innerhalb von 2 Sekunden angezeigt.', null],
              ['2. Fällt ein Server aus, übernimmt ein zweiter innerhalb einer Minute; die Buchung ist zu 99,5 % der Zeit erreichbar.', null],
              ['3. VetPlan kann ohne Programmänderung vom Rechenzentrum von Hollerbach & Demir zu einem anderen Hosting-Anbieter umziehen.', null],
              ['4. Neue Tierhalter können ohne Anleitung in höchstens drei Minuten ihren ersten Termin buchen.', null],
              ['5. Neue Terminarten (z. B. Physiotherapie) lassen sich ergänzen, ohne bestehende Funktionen zu ändern.', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Anforderung', 'Qualitätsmerkmal'],
                zeilen: [
                  ['1. 500 gleichzeitige Nutzer, Antwort in 2 Sekunden', 'Leistungseffizienz (Zeitverhalten, Kapazität)'],
                  ['2. Server-Ausfall, 99,5 % Erreichbarkeit', 'Zuverlässigkeit (Verfügbarkeit, Fehlertoleranz)'],
                  ['3. Umzug zu einem anderen Hosting-Anbieter ohne Programmänderung', 'Übertragbarkeit (Anpassbarkeit, Installierbarkeit)'],
                  ['4. Buchung ohne Anleitung in drei Minuten', 'Benutzbarkeit (Erlernbarkeit, Bedienbarkeit)'],
                  ['5. Neue Terminarten leicht ergänzen', 'Wartbarkeit (Modifizierbarkeit)'],
                ],
              },
            },
            'In der Neufassung der Norm von 2023 heißen einige Merkmale anders, z. B. Interaktionsfähigkeit statt Benutzbarkeit und Flexibilität statt Übertragbarkeit; auch diese Bezeichnungen sind richtig.',
            'Abgrenzung: Kompatibilität meint in der Norm das Zusammenwirken mit anderen Systemen (Koexistenz, Interoperabilität, z. B. Datenaustausch mit VetLab), nicht den Betrieb in einer anderen Umgebung.',
          ],
          bewertung: ['je richtiger Zuordnung 1 P (max. 5 P)'],
        },
        {
          nr: 'b',
          punkte: 8,
          sp: ['AP2-1-5-1', 'AP2-1-5-2'],
          text:
            'Ein Praktikant hat das unten stehende Mockup für die Buchungsseite entworfen.\n\n' +
            'Beschreiben Sie vier Mängel des Entwurfs hinsichtlich Softwareergonomie und Usability und schlagen Sie jeweils eine Verbesserung vor.',
          vorgaben: [
            {
              titel: 'Mockup „Termin buchen“',
              code:
                '+--------------------------------------------------------------+\n' +
                '| PfotenPartner                              [  ABBRECHEN  ] ⑤ |\n' +
                '|--------------------------------------------------------------|\n' +
                '| ① [ Name des Tieres          ]                               |\n' +
                '|   [ Tierart                  ]                               |\n' +
                '|                                                              |\n' +
                '| ② Praxis: o BI-M o BI-S o BI-O o GT o HF o DT o LE o MI ...  |\n' +
                '|                                                              |\n' +
                '| ③ Datum: [__.__.__]   Uhrzeit: [__:__]                       |\n' +
                '|                                                              |\n' +
                '| ④ Anlass: [                                    ]             |\n' +
                '|                                                      [ok] ⑤  |\n' +
                '+--------------------------------------------------------------+',
            },
            {
              tabelle: {
                titel: 'Erläuterungen zum Entwurf',
                kopf: ['Nr.', 'Erläuterung'],
                zeilen: [
                  ['①', 'Die Feldnamen stehen nur als grauer Platzhaltertext im Feld und verschwinden, sobald man tippt. Die Tierart wird frei eingetippt.'],
                  ['②', 'Alle 13 Standorte stehen als Optionsfelder in einer Zeile, nur mit Kürzeln (z. B. „GT“ für Gütersloh).'],
                  ['③', 'Datum und Uhrzeit werden frei eingetippt. Ob der Termin frei ist, erfährt man erst nach dem Absenden. Ist er belegt, werden alle Eingaben gelöscht.'],
                  ['④', 'Fehlerhafte Felder werden nach dem Absenden nur rot umrandet, ohne Text.'],
                  ['⑤', '„ABBRECHEN“ ist eine große grüne Schaltfläche oben rechts, „ok“ eine kleine graue Schaltfläche unten rechts.'],
                ],
              },
            },
          ],
          antwort: {
            art: 'tabelle',
            kopf: ['Mangel', 'Verbesserung'],
            zeilen: [
              [null, null],
              [null, null],
              [null, null],
              [null, null],
            ],
          },
          loesung: [
            'Vier der folgenden Mängel (andere sinnvolle Antworten sind richtig):',
            {
              tabelle: {
                kopf: ['Mangel', 'Verbesserung'],
                zeilen: [
                  ['① Beschriftung nur als Platzhalter: Beim Tippen ist nicht mehr zu sehen, was in das Feld gehört; Screenreader lesen Platzhalter oft nicht vor.', 'Dauerhaft sichtbare Beschriftung über bzw. neben jedem Feld; Platzhalter höchstens als Beispiel.'],
                  ['① Tierart als Freitext: Tippfehler und uneinheitliche Angaben („Katze“, „Kater“, „Hauskatze“), mehr Aufwand für den Nutzer.', 'Auswahlliste (Dropdown) mit den Tierarten; besser noch: angemeldete Tierhalter wählen ihr bereits gespeichertes Tier aus.'],
                  ['② 13 Optionsfelder in einer Zeile mit unverständlichen Kürzeln: unübersichtlich, Kürzel nicht selbsterklärend, Zeile passt nicht auf ein Smartphone.', 'Auswahlliste mit vollen Praxisnamen und Ort, ggf. nach Entfernung sortiert oder mit Kartenansicht; Vorbelegung mit der zuletzt genutzten Praxis.'],
                  ['③ Freie Eingabe von Datum und Uhrzeit, Verfügbarkeit erst nach dem Absenden: viele vergebliche Versuche; zweistellige Jahreszahl missverständlich.', 'Kalender bzw. Liste, die nur freie Termine der gewählten Praxis zur Auswahl anbietet.'],
                  ['③ Eingaben werden bei belegtem Termin gelöscht: Der Nutzer muss alles erneut eingeben (fehlende Fehlertoleranz).', 'Eingaben beibehalten und nur den Termin neu auswählen lassen; Alternativtermine vorschlagen.'],
                  ['④ Fehler nur durch rote Umrandung: Ursache bleibt unklar; Menschen mit Rot-Grün-Schwäche erkennen die Markierung nicht (Information nur über Farbe).', 'Verständliche Fehlermeldung als Text direkt am Feld (z. B. „Bitte wählen Sie eine Praxis.“), zusätzlich Symbol; Prüfung möglichst schon während der Eingabe.'],
                  ['⑤ Gewichtung der Schaltflächen vertauscht: „Abbrechen“ ist auffälliger als die Hauptaktion; Grün wird mit „weiter/bestätigen“ verbunden; versehentliches Abbrechen wahrscheinlich.', 'Hauptaktion deutlich hervorgehoben und eindeutig beschriftet („Termin verbindlich buchen“) am Ende des Formulars; „Abbrechen“ zurückhaltend daneben.'],
                  ['Allgemein: keine Kennzeichnung von Pflichtfeldern, keine Zusammenfassung vor dem Buchen.', 'Pflichtfelder kennzeichnen; vor dem Absenden eine Übersicht zur Kontrolle anzeigen, nach dem Buchen eine Bestätigung.'],
                ],
              },
            },
          ],
          bewertung: [
            'je Zeile 2 P: Mangel mit Begründung 1 P, passende Verbesserung 1 P (max. 8 P)',
            'gewertet werden die ersten vier Zeilen',
          ],
        },
        {
          nr: 'c',
          punkte: 6,
          sp: ['AP2-5-1-2'],
          text:
            'Für VetPlan wird ein Testkonzept erstellt.\n\n' +
            'Geben Sie für jede Situation die passende Teststufe bzw. Testart an und begründen Sie Ihre Zuordnung kurz.',
          antwort: {
            art: 'tabelle',
            kopf: ['Situation', 'Teststufe/Testart', 'Begründung'],
            zeilen: [
              ['1. Die Methode, die aus Öffnungszeiten und gebuchten Terminen die freien Zeitfenster berechnet, wird automatisiert mit Grenzfällen geprüft, z. B. einem Termin, der genau zur Schließzeit endet.', null, null],
              ['2. Es wird geprüft, ob ein von VetLab gesendeter Befund beim Empfangsdienst ankommt, gespeichert und der richtigen Patientenakte zugeordnet wird.', null, null],
              ['3. Montags um 8 Uhr buchen erfahrungsgemäß viele Tierhalter gleichzeitig. Es werden 1.000 gleichzeitige Nutzer simuliert und die Antwortzeiten gemessen.', null, null],
              ['4. Die Praxisleitung in Bielefeld-Mitte prüft vor dem Pilotbetrieb anhand des Pflichtenhefts, ob alle vereinbarten Funktionen vorhanden sind, und unterschreibt ein Protokoll.', null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Situation', 'Teststufe/Testart', 'Begründung'],
                zeilen: [
                  ['1. Berechnung freier Zeitfenster', 'Komponententest (Unit-Test, Modultest)', 'Eine einzelne Methode wird isoliert vom übrigen System automatisiert geprüft.'],
                  ['2. Befund von VetLab ankommen lassen', 'Integrationstest', 'Geprüft wird das Zusammenspiel mehrerer Komponenten bzw. Systeme (VetLab, Empfangsdienst, Datenbank/Patientenakte) über ihre Schnittstellen.'],
                  ['3. 1.000 gleichzeitige Nutzer', 'Lasttest (Performancetest)', 'Geprüft wird das Verhalten und die Antwortzeit unter der erwarteten hohen Last; ein Stresstest ginge darüber hinaus.'],
                  ['4. Prüfung durch die Praxisleitung', 'Abnahmetest', 'Der Kunde prüft das fertige System gegen die vertraglich vereinbarten Anforderungen (Pflichtenheft) und bestätigt die Abnahme im Abnahmeprotokoll.'],
                ],
              },
            },
          ],
          bewertung: ['je Zeile 1,5 P: Teststufe/Testart 1 P, Begründung 0,5 P (max. 6 P)', 'bei Situation 2 ist auch „Systemintegrationstest“ bzw. „Schnittstellentest“ richtig; „End-to-End-Test“ nicht, weil kein Ablauf aus Sicht des Nutzers geprüft wird'],
        },
        {
          nr: 'd',
          punkte: 4,
          text:
            'Ein Tierhalter mit starker Sehbehinderung nutzt am Computer einen Screenreader, der Bildschirminhalte vorliest, und bedient ihn nur mit der Tastatur.\n\n' +
            'Beschreiben Sie zwei Anforderungen, die die Buchungsseite erfüllen muss, damit er selbstständig einen Termin buchen kann, und jeweils eine Maßnahme zur Umsetzung.',
          antwort: {
            art: 'tabelle',
            kopf: ['Anforderung', 'Maßnahme'],
            zeilen: [
              [null, null],
              [null, null],
            ],
          },
          loesung: [
            'Zwei der folgenden Zeilen (andere sinnvolle Antworten sind richtig):',
            {
              tabelle: {
                kopf: ['Anforderung', 'Maßnahme'],
                zeilen: [
                  ['Vollständige Bedienbarkeit mit der Tastatur', 'Alle Felder und Schaltflächen per Tabulator in logischer Reihenfolge erreichbar, sichtbarer Fokus, keine Funktionen nur per Maus (z. B. Ziehen im Kalender).'],
                  ['Eingabefelder müssen für den Screenreader eindeutig benannt sein', 'Jedes Feld mit einer im Code verknüpften Beschriftung (HTML-Element `label`) versehen.'],
                  ['Grafiken und Symbole brauchen eine Textalternative', 'Alternativtexte (`alt`) für Bilder, z. B. Praxisfotos und Symbole wie den Kalender.'],
                  ['Fehlermeldungen und Änderungen auf der Seite müssen wahrnehmbar sein', 'Fehlermeldungen als Text am Feld, der vom Screenreader vorgelesen wird (z. B. über ARIA-Live-Bereiche); nicht nur farbliche Markierung.'],
                  ['Seite muss logisch strukturiert sein', 'Semantisches HTML mit Überschriften, Listen und Landmarks, damit der Screenreader die Seite gliedern und der Nutzer springen kann.'],
                  ['Keine Hürden durch Sicherheitsabfragen', 'Kein reines Bild-CAPTCHA; barrierefreie Alternative anbieten.'],
                ],
              },
            },
          ],
          bewertung: ['je Zeile 2 P: Anforderung 1 P, passende Maßnahme 1 P (max. 4 P)'],
        },
      ],
    },

    // ------------------------------------------------------------------ Aufgabe 4
    {
      id: 'pb1-02-4',
      art: 'schnittstelle',
      titel: 'Anbindung des Labors VetLab',
      punkte: 24,
      sp: ['AP2-4-4-2'],
      situation:
        'Laborbefunde sollen künftig automatisch von VetLab an VetPlan übertragen und der Patientenakte des Tieres zugeordnet werden. ' +
        'VetLab bietet dafür eine Schnittstelle in Version 2 an, die Befunde im JSON-Format liefert; ältere Praxisprogramme nutzen noch Version 1 mit XML. ' +
        'Auszug aus der englischsprachigen Dokumentation von VetLab:',
      vorgaben: [
        {
          hinweis:
            '**VetLab Result Delivery API (v2)**\n\n' +
            'Clinics can receive laboratory results in two ways. With polling, the clinic system calls GET /v2/results?since={timestamp} at regular intervals ' +
            'and checks whether new results are available. Polling is easy to implement, but most requests return no new data, and a result may wait up to one ' +
            'full interval before it is noticed. Polling is therefore limited to one request per five minutes per clinic.\n\n' +
            'The recommended method is webhooks. The clinic registers an HTTPS endpoint once. As soon as a result has been approved by our laboratory staff, ' +
            'our server sends an HTTP POST request containing the result as JSON to this endpoint.\n\n' +
            'Your endpoint must confirm receipt with a status code in the 2xx range within 10 seconds. If no confirmation arrives, we retry the delivery up to ' +
            'eight times with increasing intervals (1 min, 5 min, 30 min, …). Because of these retries, the same event may arrive more than once. Every request ' +
            'contains a unique eventId, which you should store so that duplicates can be ignored. Do not perform time-consuming processing before answering: ' +
            'store the event first and process it afterwards.\n\n' +
            'Each request carries an X-VetLab-Signature header. It contains an HMAC-SHA256 value calculated over the request body with a secret that only ' +
            'VetLab and the clinic know. Reject every request whose signature does not match.',
        },
      ],
      teile: [
        {
          nr: 'aa',
          punkte: 4,
          sp: ['AP2-1-2-3', 'AP2-4-4-2'],
          text: 'Beschreiben Sie anhand des Textes, wie VetPlan beim Polling und wie beim Webhook von einem neuen Befund erfährt, und nennen Sie zwei im Text genannte Nachteile des Pollings.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '**Polling:** VetPlan fragt selbst in regelmäßigen Abständen bei VetLab nach (GET-Anfrage mit dem Zeitpunkt der letzten Abfrage), ob neue Befunde vorliegen. Die Initiative geht vom Client (VetPlan) aus.',
            '**Webhook:** VetPlan meldet einmal eine eigene HTTPS-Adresse (Endpunkt) bei VetLab an. Sobald ein Befund freigegeben ist, schickt VetLab ihn von sich aus per POST an diese Adresse. Die Initiative geht vom Server (VetLab) aus; VetPlan wird sofort benachrichtigt.',
            '**Nachteile des Pollings laut Text:**',
            '- Die meisten Anfragen liefern keine neuen Daten (unnötige Last und Datenverkehr).',
            '- Ein Befund kann bis zu einem vollen Abfrageintervall unbemerkt warten (Verzögerung).',
            '- Die Abfrage ist auf eine Anfrage je fünf Minuten und Praxis begrenzt.',
          ],
          bewertung: ['1 P Polling', '1 P Webhook', 'je Nachteil 1 P (max. 2 P)', 'Antworten auf Deutsch'],
        },
        {
          nr: 'ab',
          punkte: 6,
          sp: ['AP2-1-2-3', 'AP2-4-4-2', 'AP2-7-4-2'],
          text: 'Erläutern Sie drei Anforderungen, die der Webhook-Endpunkt von VetPlan laut Text erfüllen muss.',
          antwort: { art: 'text', zeilen: 8 },
          loesung: [
            'Drei der folgenden Anforderungen:',
            '- **Schnelle Empfangsbestätigung:** Der Endpunkt muss innerhalb von 10 Sekunden mit einem Statuscode 2xx antworten. Sonst wertet VetLab die Zustellung als gescheitert und sendet erneut. Deshalb soll VetPlan den Befund zuerst nur speichern und erst danach (asynchron) verarbeiten, z. B. der Patientenakte zuordnen.',
            '- **Doppelte Zustellungen erkennen:** Wegen der Wiederholungen kann derselbe Befund mehrfach ankommen. VetPlan speichert die eindeutige `eventId` und ignoriert Nachrichten, deren `eventId` schon verarbeitet wurde, damit kein Befund doppelt in der Akte steht.',
            '- **Signatur prüfen:** VetPlan berechnet selbst den HMAC-SHA256-Wert über den empfangenen Inhalt mit dem gemeinsamen Geheimnis und vergleicht ihn mit dem Header `X-VetLab-Signature`. Stimmt er nicht, wird die Anfrage abgelehnt. So ist sichergestellt, dass die Nachricht von VetLab stammt und unterwegs nicht verändert wurde.',
            '- **HTTPS-Endpunkt:** Die Adresse muss über HTTPS erreichbar sein, damit die Befunde verschlüsselt übertragen werden.',
          ],
          bewertung: ['je erläuterter Anforderung 2 P (max. 6 P)', 'nur Anforderungen aus dem Text werden gewertet'],
        },
        {
          nr: 'ba',
          punkte: 4,
          sp: ['AP2-4-4-1'],
          text:
            'Derselbe Befund wird über Version 1 als XML und über Version 2 als JSON geliefert.\n\n' +
            'Beschreiben Sie zwei Unterschiede zwischen XML und JSON am Beispiel der beiden Darstellungen.',
          vorgaben: [
            {
              titel: 'Version 1 (XML)',
              code:
                '<befund id="B-2026-48812">\n' +
                '  <tier patientennummer="T-10457">Bella</tier>\n' +
                '  <auftrag>Großes Blutbild</auftrag>\n' +
                '  <freigabe>2026-11-12T14:35:00</freigabe>\n' +
                '  <werte>\n' +
                '    <wert name="Leukozyten" einheit="G/l">11.2</wert>\n' +
                '    <wert name="Hämatokrit" einheit="l/l">0.41</wert>\n' +
                '  </werte>\n' +
                '</befund>',
            },
            {
              titel: 'Version 2 (JSON)',
              code:
                '{\n' +
                '  "befundId": "B-2026-48812",\n' +
                '  "patientennummer": "T-10457",\n' +
                '  "tiername": "Bella",\n' +
                '  "auftrag": "Großes Blutbild",\n' +
                '  "freigabe": "2026-11-12T14:35:00",\n' +
                '  "werte": [\n' +
                '    { "name": "Leukozyten", "einheit": "G/l", "wert": 11.2 },\n' +
                '    { "name": "Hämatokrit", "einheit": "l/l", "wert": 0.41 }\n' +
                '  ]\n' +
                '}',
            },
          ],
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            'Zwei der folgenden Unterschiede mit Bezug auf das Beispiel:',
            '- **Aufbau:** XML verwendet Elemente mit öffnendem und schließendem Tag (`<auftrag>…</auftrag>`); JSON verwendet Name-Wert-Paare in geschweiften Klammern (`"auftrag": "Großes Blutbild"`). JSON ist dadurch kürzer und braucht weniger Datenvolumen.',
            '- **Attribute:** XML kennt neben Elementen auch Attribute (`id="B-2026-48812"`, `einheit="G/l"`); man kann dieselbe Angabe also auf zwei Arten ablegen. JSON kennt nur Name-Wert-Paare.',
            '- **Datentypen:** In XML ist jeder Inhalt zunächst Text (`11.2` ist eine Zeichenkette, solange kein Schema den Typ festlegt). JSON unterscheidet Datentypen direkt: `11.2` ist eine Zahl, `"T-10457"` eine Zeichenkette; außerdem gibt es Wahrheitswerte und `null`.',
            '- **Listen:** In JSON werden Listen ausdrücklich als Array in eckigen Klammern dargestellt (`"werte": [ … ]`). In XML ergibt sich eine Liste nur aus wiederholten Elementen (`<wert>` mehrfach in `<werte>`).',
            '- **Weiterverarbeitung/Sprachumfang:** JSON lässt sich in JavaScript bzw. Web-Anwendungen direkt in Objekte umwandeln. XML bietet zusätzlich Namensräume und Kommentare, die JSON nicht kennt. (Zur Prüfung des Aufbaus gibt es für XML das XSD, für JSON das JSON Schema.)',
          ],
          bewertung: ['je beschriebenem Unterschied mit Bezug auf das Beispiel 2 P (max. 4 P)', 'ohne Bezug auf das Beispiel höchstens 1 P je Unterschied'],
        },
        {
          nr: 'bb',
          punkte: 3,
          sp: ['AP2-4-4-1'],
          text:
            'Für einen Test des Webhook-Endpunkts hat ein Kollege die folgende Nachricht von Hand geschrieben. VetPlan lehnt sie mit der Meldung „ungültiges JSON“ ab. Die Nachricht enthält drei Syntaxfehler.\n\n' +
            'Geben Sie für jeden Fehler die Zeile an und korrigieren Sie ihn.',
          vorgaben: [
            {
              code:
                '{\n' +
                '  "eventId": "evt_7731",\n' +
                '  "typ": "befund.freigegeben",\n' +
                "  'befundId': \"B-2026-48813\",\n" +
                '  "patientennummer": "T-10458",\n' +
                '  "kritisch": FALSE,\n' +
                '  "werte": [\n' +
                '    { "name": "Glukose", "einheit": "mmol/l", "wert": 6,1 }\n' +
                '  ]\n' +
                '}',
              nummern: true,
            },
          ],
          antwort: {
            art: 'tabelle',
            kopf: ['Zeile', 'korrigierte Schreibweise'],
            zeilen: [
              [null, null],
              [null, null],
              [null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Zeile', 'korrigierte Schreibweise', 'Erklärung'],
                zeilen: [
                  ['4', '`"befundId": "B-2026-48813",`', 'Namen (und Zeichenketten) stehen in JSON in doppelten Anführungszeichen, nicht in einfachen.'],
                  ['6', '`"kritisch": false,`', 'Wahrheitswerte werden klein geschrieben (`true`/`false`).'],
                  ['8', '`"wert": 6.1`', 'Dezimalzahlen verwenden einen Punkt; das Komma trennt in JSON die Einträge.'],
                ],
              },
            },
          ],
          bewertung: ['je gefundenem und richtig korrigiertem Fehler 1 P (max. 3 P)', 'nur Zeile richtig, Korrektur falsch: 0,5 P'],
        },
        {
          nr: 'c',
          punkte: 4,
          text:
            'VetLab kündigt Version 3 der Schnittstelle an. Darin wird das Feld `wert` keine Zahl mehr sein, sondern ein Objekt mit Messwert und Referenzbereich. Version 2 wird noch zwölf Monate weiter betrieben.\n\n' +
            'Erläutern Sie, warum VetLab die Schnittstelle versioniert, und beschreiben Sie zwei Möglichkeiten, wie ein Client die gewünschte Version angeben kann.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '**Grund:** Die Änderung von `wert` ist nicht abwärtskompatibel (Breaking Change). Programme wie VetPlan, die eine Zahl erwarten, würden bei einem Objekt fehlschlagen. Durch die Versionierung können vorhandene Clients unverändert bei Version 2 bleiben, während neue oder angepasste Clients Version 3 nutzen. Die Kunden haben so Zeit (hier zwölf Monate), ihre Programme umzustellen.',
            '**Möglichkeiten** (zwei genügen):',
            '- Version im **Pfad** der URL, z. B. `/v3/results` statt `/v2/results` (wie bei VetLab bereits üblich)',
            '- Version in einem **HTTP-Header**, z. B. ein eigener Header `API-Version: 3` oder über den Medientyp im `Accept`-Header (z. B. `application/vnd.vetlab.v3+json`)',
            '- Version als **Query-Parameter**, z. B. `/results?version=3`',
            '- Version in einer anderen **Subdomain**, z. B. `v3.api.vetlab.example`',
          ],
          bewertung: ['2 P Begründung (nicht abwärtskompatible Änderung, alte Clients laufen weiter)', 'je beschriebener Möglichkeit 1 P (max. 2 P)'],
        },
        {
          nr: 'd',
          punkte: 3,
          text:
            'VetLab stellt seine Schnittstelle zusätzlich als maschinenlesbare Schnittstellenbeschreibung im Format OpenAPI bereit.\n\n' +
            'Nennen Sie drei Angaben, die eine solche Beschreibung zu einem Endpunkt enthält.',
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            'Drei der folgenden Angaben (andere sinnvolle Antworten sind richtig):',
            '- Pfad des Endpunkts und Basisadresse des Servers (z. B. `/v2/results`)',
            '- erlaubte HTTP-Methode(n), z. B. GET',
            '- Parameter mit Name, Ort (Pfad, Query, Header), Datentyp und ob sie Pflicht sind (z. B. `since`)',
            '- Aufbau des Request-Bodys (Schema mit Feldern und Datentypen)',
            '- mögliche Antworten mit Statuscodes und Aufbau der Antwortdaten',
            '- Medientyp bzw. Datenformat (z. B. `application/json`)',
            '- Art der Authentifizierung (z. B. API-Schlüssel, Token)',
            '- Beschreibung und Beispiele für Anfragen und Antworten',
          ],
          bewertung: ['je Nennung 1 P (max. 3 P)', 'gewertet werden die ersten drei Nennungen'],
        },
      ],
    },
  ],
};
