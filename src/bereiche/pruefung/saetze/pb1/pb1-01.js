// Probeprüfung AP2 – Planen eines Softwareproduktes (eigene Aufgaben, fiktive Firmen)
export default {
  id: 'pb1-01',
  teil: 'PB1',
  titel: 'Carsharing RegioRoll',
  situation:
    'Die Fuchs & Arslan Software GmbH in Göttingen entwickelt Individualsoftware für Unternehmen aus der Region. ' +
    'Neuer Kunde ist die RegioRoll eG, eine Carsharing-Genossenschaft mit rund 3.800 Mitgliedern, 140 Fahrzeugen ' +
    '(davon 60 Elektroautos) und 45 Stationen in Südniedersachsen. Bisher werden Fahrzeuge telefonisch oder über ein ' +
    'veraltetes Webformular gebucht, die Schlüssel liegen in Schlüsseltresoren an den Stationen. ' +
    'Künftig sollen die Mitglieder über eine Smartphone-App buchen und das Fahrzeug mit dem Smartphone öffnen. ' +
    'Die App, eine Web-Oberfläche für die Verwaltung und die Telematikeinheiten in den Fahrzeugen kommunizieren über ' +
    'eine gemeinsame REST-API. Sie sind Mitglied des Projektteams bei Fuchs & Arslan.',
  aufgaben: [
    // ------------------------------------------------------------------ Aufgabe 1
    {
      id: 'pb1-01-1',
      art: 'projekt',
      titel: 'Projektvorbereitung',
      punkte: 24,
      sp: ['AP2-1-1-3'],
      situation:
        'RegioRoll hat Fuchs & Arslan um ein Angebot für die Buchungsplattform gebeten. Das Budget ist auf 180.000 EUR ' +
        'begrenzt, die Plattform soll zum Beginn der Sommersaison im Mai 2027 laufen. Die Telematikeinheiten stammen von ' +
        'einem externen Hersteller, dessen Schnittstelle bisher nur teilweise dokumentiert ist. Im Entwicklungsteam von ' +
        'Fuchs & Arslan hat noch niemand eine App mit Bluetooth-Anbindung umgesetzt.',
      teile: [
        {
          nr: 'a',
          punkte: 6,
          text:
            'Bevor Fuchs & Arslan den Auftrag annimmt, soll die Machbarkeit des Projekts geprüft werden.\n\n' +
            'Erläutern Sie zwei Kriterien einer Machbarkeitsanalyse jeweils mit Bezug auf dieses Projekt.',
          antwort: { art: 'text', zeilen: 8 },
          loesung: [
            'Zwei der folgenden Kriterien mit Projektbezug (andere sinnvolle Antworten sind richtig):',
            '- **Technische Machbarkeit:** Lässt sich das Vorhaben mit verfügbarer Technik umsetzen? Hier: Die Schnittstelle der Telematikeinheiten ist nur teilweise dokumentiert; vorab ist zu klären, ob das Öffnen per Smartphone über diese Schnittstelle überhaupt zuverlässig möglich ist (z. B. durch einen technischen Durchstich/Prototyp).',
            '- **Wirtschaftliche Machbarkeit:** Reicht das Budget von 180.000 EUR für Entwicklung, Tests und Betrieb, und lohnt sich der Auftrag für Fuchs & Arslan? Aufwand schätzen und mit dem Budget vergleichen; für RegioRoll: Einsparungen (weniger Telefonbuchungen, keine Schlüsseltresore) gegen die Kosten stellen.',
            '- **Zeitliche Machbarkeit:** Ist der Termin Mai 2027 mit dem geschätzten Aufwand und den verfügbaren Entwicklerinnen und Entwicklern erreichbar, einschließlich Freigabe in den App-Stores und Einbau/Konfiguration in 140 Fahrzeugen?',
            '- **Personelle Machbarkeit:** Sind genug Mitarbeitende mit dem nötigen Wissen verfügbar? Hier fehlt Erfahrung mit Bluetooth-Anbindung; Schulung, Einarbeitung oder externe Unterstützung muss eingeplant werden.',
            '- **Rechtliche Machbarkeit:** Können Vorgaben wie Datenschutz (Standort- und Fahrtdaten der Mitglieder) und Anforderungen an Bezahlung und Vertragsschluss in der App eingehalten werden?',
            '- **Organisatorische Machbarkeit:** Lassen sich die neuen Abläufe bei RegioRoll einführen (Kundenservice, Störungshilfe rund um die Uhr, Umstellung der Mitglieder)?',
          ],
          bewertung: [
            'je Kriterium 3 P: 1 P für das Kriterium, 2 P für die Erläuterung mit Projektbezug (max. 6 P)',
            'ohne Bezug zum Projekt höchstens 2 P je Kriterium',
            'gewertet werden die ersten zwei Kriterien; andere sinnvolle Antworten sind richtig',
          ],
        },
        {
          nr: 'b',
          punkte: 6,
          sp: ['AP2-1-1-1'],
          text:
            'Fuchs & Arslan schlägt vor, das Projekt nach Scrum durchzuführen.\n\n' +
            'Beschreiben Sie die folgenden Begriffe jeweils mit Bezug auf dieses Projekt.',
          antwort: {
            art: 'tabelle',
            kopf: ['Begriff', 'Beschreibung mit Bezug auf das Projekt'],
            zeilen: [
              ['Product Owner', null],
              ['Sprint', null],
              ['Sprint Review', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Begriff', 'Beschreibung mit Bezug auf das Projekt'],
                zeilen: [
                  [
                    'Product Owner',
                    'Verantwortlich für das Product Backlog: formuliert die Anforderungen (z. B. als User Stories) und legt ihre Reihenfolge nach dem Nutzen fest. Sinnvoll ist eine Person auf Seiten von RegioRoll, z. B. die Leitung des Mitgliederservice, weil sie die Abläufe und Wünsche der Mitglieder kennt und verbindlich entscheiden kann.',
                  ],
                  [
                    'Sprint',
                    'Fester, kurzer Zeitabschnitt (meist 1–4 Wochen), in dem das Team eine vorher ausgewählte Menge an Einträgen aus dem Backlog umsetzt, z. B. „Fahrzeuge einer Station anzeigen“ und „Buchung anlegen“. Am Ende steht ein lauffähiges, getestetes Teilprodukt.',
                  ],
                  [
                    'Sprint Review',
                    'Treffen am Ende eines Sprints: Das Team zeigt RegioRoll das Ergebnis (z. B. die Buchungsfunktion in der App), die Beteiligten geben Rückmeldung, und das Product Backlog wird bei Bedarf angepasst, etwa wenn das Öffnen per Bluetooth anders funktionieren soll als geplant.',
                  ],
                ],
              },
            },
          ],
          bewertung: ['je Begriff 2 P: 1 P allgemeine Beschreibung, 1 P Bezug auf das Projekt (max. 6 P)'],
        },
        {
          nr: 'c',
          punkte: 8,
          text:
            'Für das Projekt wird eine Stakeholderanalyse durchgeführt. Eine Zeile ist als Beispiel ausgefüllt.\n\n' +
            'Identifizieren Sie zwei weitere Stakeholder und beschreiben Sie jeweils eine mögliche Befürchtung und eine geeignete Maßnahme.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Beispielzeile',
                kopf: ['Stakeholder', 'Befürchtung', 'Maßnahme'],
                zeilen: [
                  [
                    'Mitarbeitende im telefonischen Buchungsservice von RegioRoll',
                    'Ihre Arbeitsplätze fallen weg, weil kaum noch telefonisch gebucht wird.',
                    'Früh informieren und neue Aufgaben aufzeigen, z. B. Störungshilfe und Betreuung von Mitgliedern, die die App nicht nutzen.',
                  ],
                ],
              },
            },
          ],
          antwort: {
            art: 'tabelle',
            kopf: ['Stakeholder', 'Befürchtung', 'Maßnahme'],
            zeilen: [
              [null, null, null],
              [null, null, null],
            ],
          },
          loesung: [
            'Zwei der folgenden Zeilen (andere sinnvolle Antworten sind richtig):',
            {
              tabelle: {
                kopf: ['Stakeholder', 'Befürchtung', 'Maßnahme'],
                zeilen: [
                  [
                    'Ältere oder technisch wenig erfahrene Mitglieder',
                    'Sie kommen mit der App nicht zurecht und können nicht mehr buchen.',
                    'Einfache, barrierearme Oberfläche; Einführungsveranstaltungen; telefonische Buchung für eine Übergangszeit beibehalten.',
                  ],
                  [
                    'Vorstand der Genossenschaft',
                    'Das Budget von 180.000 EUR wird überschritten oder der Termin Mai 2027 nicht gehalten.',
                    'Regelmäßige Statusberichte mit Kosten- und Terminplan, Meilensteine, Priorisierung der wichtigsten Funktionen.',
                  ],
                  [
                    'Hersteller der Telematikeinheiten',
                    'Zusätzlicher Aufwand und Haftungsrisiken durch Zugriffe der neuen Plattform auf seine Geräte.',
                    'Schnittstelle und Zuständigkeiten vertraglich festlegen, gemeinsame Tests vereinbaren.',
                  ],
                  [
                    'Datenschutzbeauftragte bzw. Datenschutzbeauftragter von RegioRoll',
                    'Es werden mehr Standort- und Fahrtdaten gespeichert als nötig.',
                    'Früh einbinden, Datenschutz-Folgenabschätzung, nur notwendige Daten erheben, Löschfristen festlegen.',
                  ],
                  [
                    'Entwicklungsteam von Fuchs & Arslan',
                    'Überlastung, weil Erfahrung mit Bluetooth fehlt.',
                    'Schulung, Prototyp vorab, realistische Aufwandsplanung.',
                  ],
                ],
              },
            },
          ],
          bewertung: [
            'je Zeile 4 P: Stakeholder 1 P, Befürchtung 1,5 P, Maßnahme 1,5 P (max. 8 P)',
            'die Maßnahme muss zur genannten Befürchtung passen',
            'die Beispielzeile (Buchungsservice) zählt nicht',
          ],
        },
        {
          nr: 'd',
          punkte: 4,
          sp: ['AP2-1-5-2', 'AP2-1-5-1'],
          text:
            'Bevor die App programmiert wird, sollen Mockups der wichtigsten Bildschirme erstellt und mit einigen Mitgliedern besprochen werden.\n\n' +
            'Beschreiben Sie zwei Vorteile dieses Vorgehens für das Projekt.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            'Zwei der folgenden Vorteile (andere sinnvolle Antworten sind richtig):',
            '- Missverständnisse über Anforderungen werden früh sichtbar; Änderungen an einer Skizze sind viel billiger als Änderungen an fertigem Code.',
            '- Die Mitglieder können Bedienung und Ablauf (z. B. Buchen in wenigen Schritten) beurteilen, bevor programmiert wird; Usability-Probleme werden früh erkannt.',
            '- Mockups sind eine anschauliche Gesprächsgrundlage zwischen RegioRoll und dem Entwicklungsteam, auch für Personen ohne IT-Kenntnisse.',
            '- Sie dienen später als Vorlage für Design und Umsetzung und können in das Pflichtenheft bzw. Product Backlog übernommen werden.',
            '- Die Akzeptanz steigt, weil die späteren Nutzerinnen und Nutzer beteiligt werden.',
          ],
          bewertung: ['je beschriebenem Vorteil 2 P (max. 4 P)', 'andere sinnvolle Antworten sind richtig'],
        },
      ],
    },

    // ------------------------------------------------------------------ Aufgabe 2
    {
      id: 'pb1-01-2',
      art: 'schnittstelle',
      titel: 'REST-API der Buchungsplattform',
      punkte: 26,
      sp: ['AP2-4-4-2'],
      situation:
        'App, Verwaltungsoberfläche und Telematikeinheiten der Carsharing-Plattform von RegioRoll greifen über eine REST-API ' +
        'auf die Buchungsdaten zu. Die API ist unter `https://api.regioroll.example/v1` erreichbar und tauscht Daten im JSON-Format aus. ' +
        'Sie arbeiten am Entwurf der Schnittstelle mit.',
      teile: [
        {
          nr: 'a',
          punkte: 2,
          text: 'Beschreiben Sie das Grundprinzip einer REST-Schnittstelle.',
          antwort: { art: 'text', zeilen: 3 },
          loesung: [
            'Bei REST wird jede Ressource (z. B. Fahrzeug, Station, Buchung) über eine eindeutige URL angesprochen. Der Client bearbeitet die Ressourcen mit den Standardmethoden von HTTP (GET, POST, PUT/PATCH, DELETE); übertragen werden nur Daten, z. B. als JSON. Client und Server sind lose gekoppelt.',
            'Weitere richtige Aspekte: zustandslose Kommunikation, einheitliche Schnittstelle, Antworten können zwischengespeichert werden.',
          ],
          bewertung: ['2 P für eine zutreffende Beschreibung (Ressource über URL + HTTP-Methoden), 1 P bei nur einem Aspekt'],
        },
        {
          nr: 'b',
          punkte: 6,
          text:
            'Die App soll die folgenden Anwendungsfälle über die API ausführen. Die erste Zeile ist als Beispiel ausgefüllt.\n\n' +
            'Ergänzen Sie für die übrigen Zeilen die passende HTTP-Methode und den Pfad des Endpunkts (relativ zur Basisadresse).',
          antwort: {
            art: 'tabelle',
            kopf: ['Anwendungsfall in der App', 'HTTP-Methode', 'Pfad'],
            zeilen: [
              ['Alle Stationen abrufen', 'GET', '/stationen'],
              ['Eine neue Buchung anlegen', null, null],
              ['Das Ende der Buchung 4711 auf einen späteren Zeitpunkt verschieben', null, null],
              ['Die Buchung 4711 stornieren', null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Anwendungsfall in der App', 'HTTP-Methode', 'Pfad'],
                zeilen: [
                  ['Eine neue Buchung anlegen', 'POST', '/buchungen'],
                  ['Das Ende der Buchung 4711 verschieben', 'PATCH (auch PUT, wenn die ganze Buchung neu übertragen wird)', '/buchungen/4711'],
                  ['Die Buchung 4711 stornieren', 'DELETE (auch PATCH mit Status „storniert“)', '/buchungen/4711'],
                ],
              },
            },
            'Bei POST wird die neue Buchung der Sammlung `/buchungen` hinzugefügt; der Server vergibt die Buchungsnummer. Bei Änderung und Storno wird die einzelne Ressource über ihre Nummer im Pfad angesprochen.',
          ],
          bewertung: [
            'je richtigem Feld 1 P (max. 6 P)',
            'Pfade mit anderer, aber sinnvoller Benennung (z. B. /bookings/4711) sind richtig, wenn Sammlung und einzelne Ressource unterschieden werden',
          ],
        },
        {
          nr: 'c',
          punkte: 5,
          text:
            'Die App sendet folgende Anfrage an die API.\n\n' +
            'Beschreiben Sie die Bedeutung der Bestandteile ① bis ⑤.',
          vorgaben: [
            {
              code:
                'GET /v1/fahrzeuge?station=17&beginn=2026-11-03T08:00&ende=2026-11-03T12:00&antrieb=elektro HTTP/1.1\n' +
                'Host: api.regioroll.example\n' +
                'Authorization: Bearer 7f3c9a1e…\n' +
                'Accept: application/json',
              titel: 'HTTP-Anfrage der App',
            },
            {
              tabelle: {
                kopf: ['Nr.', 'Bestandteil'],
                zeilen: [
                  ['①', '`GET`'],
                  ['②', '`/v1/fahrzeuge`'],
                  ['③', '`station=17&beginn=…&ende=…&antrieb=elektro`'],
                  ['④', '`Authorization: Bearer 7f3c9a1e…`'],
                  ['⑤', '`Accept: application/json`'],
                ],
              },
            },
          ],
          antwort: {
            art: 'tabelle',
            kopf: ['Nr.', 'Bedeutung'],
            zeilen: [
              ['①', null],
              ['②', null],
              ['③', null],
              ['④', null],
              ['⑤', null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Nr.', 'Bedeutung'],
                zeilen: [
                  ['①', 'HTTP-Methode: Daten werden nur gelesen, auf dem Server wird nichts verändert.'],
                  ['②', 'Pfad der Ressource: die Sammlung aller Fahrzeuge; `v1` ist die Version der API.'],
                  ['③', 'Query-Parameter, die das Ergebnis filtern: nur Elektrofahrzeuge der Station 17, die am 03.11.2026 von 8 bis 12 Uhr verfügbar sind.'],
                  ['④', 'Header mit dem Zugriffstoken: weist nach, welches Mitglied die Anfrage stellt (Authentifizierung), und ermöglicht dem Server die Prüfung der Berechtigung.'],
                  ['⑤', 'Header, mit dem der Client mitteilt, dass er die Antwort im JSON-Format erwartet.'],
                ],
              },
            },
          ],
          bewertung: ['je richtig beschriebenem Bestandteil 1 P (max. 5 P)'],
        },
        {
          nr: 'd',
          punkte: 4,
          text:
            'Die API meldet das Ergebnis jeder Anfrage mit einem HTTP-Statuscode. Die erste Zeile ist als Beispiel ausgefüllt.\n\n' +
            'Ergänzen Sie für jede Situation die Klasse des Statuscodes und einen passenden Statuscode.',
          antwort: {
            art: 'tabelle',
            kopf: ['Situation', 'Klasse', 'Statuscode'],
            zeilen: [
              ['Das angefragte Fahrzeug mit der ID 999 gibt es nicht.', '4xx', '404 Not Found'],
              ['Die Buchung wurde erfolgreich angelegt.', null, null],
              ['Das Zugriffstoken der App ist abgelaufen.', null, null],
              ['Das Fahrzeug ist im gewünschten Zeitraum bereits gebucht.', null, null],
              ['Der Datenbankserver der Plattform ist ausgefallen.', null, null],
            ],
          },
          loesung: [
            {
              tabelle: {
                kopf: ['Situation', 'Klasse', 'Statuscode'],
                zeilen: [
                  ['Buchung erfolgreich angelegt', '2xx (Erfolg)', '201 Created (200 OK ist ebenfalls richtig)'],
                  ['Zugriffstoken abgelaufen', '4xx (Fehler beim Client)', '401 Unauthorized'],
                  ['Fahrzeug bereits gebucht', '4xx (Fehler beim Client)', '409 Conflict (auch 400 Bad Request oder 422 Unprocessable Content)'],
                  ['Datenbankserver ausgefallen', '5xx (Fehler beim Server)', '500 Internal Server Error oder 503 Service Unavailable'],
                ],
              },
            },
          ],
          bewertung: ['je Zeile 1 P: Klasse 0,5 P, passender Statuscode 0,5 P (max. 4 P)'],
        },
        {
          nr: 'e',
          punkte: 6,
          sp: ['AP2-4-4-1', 'AP2-4-4-2'],
          text:
            'Zum Anlegen einer Buchung sendet die App im Datenteil (Body) der Anfrage ein JSON-Objekt. Die Mitgliedsnummer wird nicht übertragen, der Server ermittelt sie aus dem Zugriffstoken.\n\n' +
            'Erstellen Sie das JSON-Objekt für die unten beschriebene Buchung. Verwenden Sie die angegebenen Feldnamen und passende JSON-Datentypen.',
          vorgaben: [
            {
              tabelle: {
                titel: 'Daten der Buchung',
                kopf: ['Feldname', 'Inhalt', 'Wert'],
                zeilen: [
                  ['fahrzeugId', 'ganze Zahl', '214'],
                  ['beginn', 'Zeitpunkt im Format JJJJ-MM-TTThh:mm', '03.11.2026, 08:00 Uhr'],
                  ['ende', 'Zeitpunkt im Format JJJJ-MM-TTThh:mm', '03.11.2026, 12:00 Uhr'],
                  ['extras', 'Liste von Texten', 'Kindersitz, Dachbox'],
                  ['einwegfahrt', 'Wahrheitswert', 'nein (Rückgabe an der Startstation)'],
                ],
              },
            },
          ],
          antwort: { art: 'code', zeilen: 9 },
          loesung: [
            {
              code:
                '{\n' +
                '  "fahrzeugId": 214,\n' +
                '  "beginn": "2026-11-03T08:00",\n' +
                '  "ende": "2026-11-03T12:00",\n' +
                '  "extras": ["Kindersitz", "Dachbox"],\n' +
                '  "einwegfahrt": false\n' +
                '}',
            },
            'Zahl und Wahrheitswert stehen ohne Anführungszeichen, Texte und Zeitpunkte in doppelten Anführungszeichen, die Liste in eckigen Klammern. Die Reihenfolge der Felder ist beliebig.',
          ],
          bewertung: [
            '1 P: Objekt in geschweiften Klammern, Schlüssel in doppelten Anführungszeichen, Doppelpunkt und Kommas richtig',
            '1 P: alle fünf Felder mit richtigen Werten',
            '1 P: fahrzeugId als Zahl (ohne Anführungszeichen)',
            '1 P: beginn und ende als Zeichenketten im vorgegebenen Format',
            '1 P: extras als Array mit zwei Zeichenketten',
            '1 P: einwegfahrt als Wahrheitswert false (ohne Anführungszeichen)',
          ],
        },
        {
          nr: 'f',
          punkte: 3,
          sp: ['AP2-4-4-2', 'AP2-7-4-3'],
          text:
            'Die API arbeitet zustandslos.\n\n' +
            'Erläutern Sie, was das bedeutet und wie der Server trotzdem erkennt, für welches Mitglied eine Buchung angelegt werden soll.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            'Zustandslos bedeutet: Der Server speichert zwischen zwei Anfragen keine Sitzungsinformationen über den Client. Jede Anfrage muss alle Angaben enthalten, die zu ihrer Bearbeitung nötig sind, und wird unabhängig von vorherigen Anfragen bearbeitet. Das erleichtert z. B. die Lastverteilung auf mehrere Server.',
            'Damit der Server das Mitglied erkennt, sendet die App bei jeder Anfrage das bei der Anmeldung erhaltene Zugriffstoken im Header `Authorization` mit. Der Server prüft das Token (Gültigkeit, Signatur bzw. Abgleich) und liest daraus die Mitgliedsnummer.',
          ],
          bewertung: ['2 P Bedeutung von „zustandslos“', '1 P Token bzw. Anmeldedaten werden bei jeder Anfrage mitgeschickt'],
        },
      ],
    },

    // ------------------------------------------------------------------ Aufgabe 3
    {
      id: 'pb1-01-3',
      art: 'modell',
      titel: 'Fachklassenmodell',
      punkte: 27,
      sp: ['AP2-2-1-1'],
      situation:
        'Für die Buchungsplattform von RegioRoll, einer Carsharing-Genossenschaft mit Elektro- und Verbrennerfahrzeugen an mehreren Stationen, ' +
        'entwirft das Projektteam das Fachklassenmodell. Die Anforderungen wurden in Gesprächen mit RegioRoll gesammelt.',
      teile: [
        {
          nr: 'a',
          punkte: 16,
          text:
            'Erstellen Sie aus den folgenden Anforderungen ein UML-Klassendiagramm mit Attributen, Datentypen, Methoden, Sichtbarkeiten, Beziehungen und Multiplizitäten.\n\n' +
            '- Ein Mitglied hat eine Mitgliedsnummer, einen Namen, eine E-Mail-Adresse und das Datum, bis zu dem sein Führerschein als geprüft gilt. Die Methode `darfBuchen()` liefert, ob das Mitglied derzeit buchen darf.\n' +
            '- Ein Mitglied kann beliebig viele Buchungen haben. Jede Buchung gehört zu genau einem Mitglied.\n' +
            '- Eine Buchung hat eine Buchungsnummer, einen Beginn und ein Ende (jeweils Datum mit Uhrzeit) sowie einen Status als Text. Die Methode `berechnePreis()` liefert den Preis der Buchung als Kommazahl.\n' +
            '- Jede Buchung bezieht sich auf genau ein Fahrzeug. Ein Fahrzeug kann in beliebig vielen Buchungen vorkommen.\n' +
            '- Jedes Fahrzeug hat ein Kennzeichen, eine Modellbezeichnung und eine Anzahl an Sitzplätzen. Es gibt nur Elektrofahrzeuge und Verbrennerfahrzeuge; ein allgemeines Fahrzeug wird nie angelegt.\n' +
            '- Jedes Fahrzeug besitzt die Methode `istFahrbereit()`, die angibt, ob es vermietet werden kann. Jede Fahrzeugart prüft das auf eigene Weise.\n' +
            '- Ein Elektrofahrzeug kennt seinen Akkustand in Prozent und seine Restreichweite in Kilometern. Ein Verbrennerfahrzeug kennt seinen Tankfüllstand in Prozent.\n' +
            '- Jedes Fahrzeug gehört zu genau einer Heimatstation. An einer Station sind ein oder mehrere Fahrzeuge stationiert. Eine Station hat eine Stationsnummer, eine Bezeichnung sowie einen Breiten- und einen Längengrad.\n' +
            '- Alle Attribute sind privat, alle Methoden öffentlich. Konstruktoren, Getter und Setter müssen nicht angegeben werden.',
          antwort: { art: 'papier' },
          loesung: [
            'Musterlösung, Element für Element (Namen und Datentypen können sinnvoll abweichen, z. B. `Date` statt `DateTime`, `float` statt `double`):',
            {
              tabelle: {
                titel: 'Klassen',
                kopf: ['Klasse', 'Attribute', 'Methoden'],
                zeilen: [
                  [
                    'Mitglied',
                    '`- mitgliedsnummer: int`\n`- name: String`\n`- email: String`\n`- fuehrerscheinGeprueftBis: Date`',
                    '`+ darfBuchen(): boolean`',
                  ],
                  [
                    'Buchung',
                    '`- buchungsnummer: int`\n`- beginn: DateTime`\n`- ende: DateTime`\n`- status: String`',
                    '`+ berechnePreis(): double`',
                  ],
                  [
                    'Fahrzeug – abstrakt (Name kursiv oder mit `{abstract}`)',
                    '`- kennzeichen: String`\n`- modell: String`\n`- sitzplaetze: int`',
                    '`+ istFahrbereit(): boolean` – abstrakt (kursiv oder `{abstract}`)',
                  ],
                  ['Elektrofahrzeug', '`- akkustandProzent: int`\n`- reichweiteKm: int`', '`+ istFahrbereit(): boolean`'],
                  ['Verbrennerfahrzeug', '`- tankfuellstandProzent: int`', '`+ istFahrbereit(): boolean`'],
                  [
                    'Station',
                    '`- stationsnummer: int`\n`- bezeichnung: String`\n`- breitengrad: double`\n`- laengengrad: double`',
                    'keine',
                  ],
                ],
              },
            },
            {
              tabelle: {
                titel: 'Beziehungen',
                kopf: ['Beziehung', 'Art', 'Multiplizitäten'],
                zeilen: [
                  ['Elektrofahrzeug → Fahrzeug', 'Generalisierung (geschlossene, nicht gefüllte Pfeilspitze an Fahrzeug)', '–'],
                  ['Verbrennerfahrzeug → Fahrzeug', 'Generalisierung', '–'],
                  ['Mitglied – Buchung', 'Assoziation', 'Mitglied 1 — 0..* Buchung'],
                  ['Buchung – Fahrzeug', 'Assoziation (gerichtet von Buchung zu Fahrzeug ist ebenfalls richtig)', 'Buchung 0..* — 1 Fahrzeug'],
                  ['Fahrzeug – Station', 'Assoziation (eine Aggregation ist ebenfalls vertretbar)', 'Fahrzeug 1..* — 1 Station'],
                ],
              },
            },
            'Lesart der Multiplizitäten: Die Zahl steht jeweils an der Klasse, deren Anzahl sie angibt; z. B. steht „1..*“ an Fahrzeug, weil zu einer Station ein oder mehrere Fahrzeuge gehören.',
          ],
          bewertung: [
            'Mitglied mit 4 Attributen und Typen 1,5 P, Methode darfBuchen(): boolean 0,5 P',
            'Buchung mit 4 Attributen und Typen 1,5 P, Methode berechnePreis(): double 0,5 P',
            'Fahrzeug mit 3 Attributen 1 P, als abstrakt gekennzeichnet 1 P, abstrakte Methode istFahrbereit() 0,5 P',
            'Elektrofahrzeug mit 2 Attributen und istFahrbereit() 1 P',
            'Verbrennerfahrzeug mit Attribut und istFahrbereit() 1 P',
            'Station mit 4 Attributen und Typen 1,5 P',
            'beide Generalisierungen mit richtiger Pfeilrichtung 1 P',
            'je Assoziation 1,5 P: Linie zwischen den richtigen Klassen 0,5 P, beide Multiplizitäten richtig 1 P (3 Assoziationen, 4,5 P)',
            'Sichtbarkeiten durchgängig richtig (- für Attribute, + für Methoden) 0,5 P',
          ],
        },
        {
          nr: 'b',
          punkte: 3,
          sp: ['AP2-2-1-1', 'AP2-3-3-2'],
          text: 'Begründen Sie, warum die Klasse `Fahrzeug` als abstrakte Klasse modelliert wird, und beschreiben Sie, welche Folge die abstrakte Methode `istFahrbereit()` für die Unterklassen hat.',
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            'Laut Anforderung wird nie ein „allgemeines“ Fahrzeug angelegt, sondern immer ein Elektro- oder Verbrennerfahrzeug. Von einer abstrakten Klasse können keine Objekte erzeugt werden; sie fasst nur die gemeinsamen Attribute (Kennzeichen, Modell, Sitzplätze) und Methoden der Unterklassen zusammen.',
            'Die abstrakte Methode `istFahrbereit()` hat in `Fahrzeug` keinen Rumpf. Jede (nicht abstrakte) Unterklasse muss sie überschreiben und selbst implementieren, z. B. Elektrofahrzeug über den Akkustand, Verbrennerfahrzeug über den Tankfüllstand.',
          ],
          bewertung: ['2 P Begründung (keine Objekte von Fahrzeug, gemeinsame Merkmale zusammengefasst)', '1 P Unterklassen müssen die Methode implementieren'],
        },
        {
          nr: 'c',
          punkte: 4,
          sp: ['AP2-3-3-2'],
          text:
            'Die Verwaltungsoberfläche zeigt für eine Station alle Fahrzeuge mit dem Hinweis „fahrbereit“ oder „nicht fahrbereit“. Dazu wird für jedes Objekt in einer Liste vom Typ `List<Fahrzeug>` die Methode `istFahrbereit()` aufgerufen.\n\n' +
            'Erläutern Sie an diesem Beispiel den Begriff Polymorphie und einen Vorteil, den sie hier bietet.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '**Polymorphie:** Eine Variable vom Typ der Oberklasse (`Fahrzeug`) kann Objekte verschiedener Unterklassen aufnehmen. Beim Aufruf von `istFahrbereit()` wird erst zur Laufzeit anhand des tatsächlichen Objekts entschieden, welche Implementierung ausgeführt wird: bei einem Elektrofahrzeug die Prüfung von Akkustand bzw. Reichweite, bei einem Verbrennerfahrzeug die Prüfung des Tankfüllstands. Derselbe Aufruf führt so zu unterschiedlichem Verhalten.',
            '**Vorteil** (einer genügt): Die Verwaltungsoberfläche muss die Fahrzeugart nicht abfragen (keine Fallunterscheidung mit if/instanceof). Kommt später eine neue Fahrzeugart hinzu (z. B. Lastenrad oder Wasserstofffahrzeug), muss nur eine neue Unterklasse geschrieben werden; der Code der Liste bleibt unverändert. Das macht die Software leichter wartbar und erweiterbar.',
          ],
          bewertung: ['2 P Erläuterung Polymorphie mit Bezug auf das Beispiel', '2 P Vorteil mit Begründung'],
        },
        {
          nr: 'd',
          punkte: 4,
          text:
            'Eine Kollegin schlägt vor, die Beziehung zwischen `Mitglied` und `Buchung` als Komposition zu modellieren.\n\n' +
            'Erläutern Sie, was eine Komposition bedeutet, und beurteilen Sie, ob sie hier sinnvoll ist.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '**Komposition:** starke Teil-Ganzes-Beziehung (gefüllte Raute am Ganzen). Das Teil gehört genau zu einem Ganzen und kann ohne es nicht existieren; wird das Ganze gelöscht, werden auch seine Teile gelöscht.',
            '**Beurteilung:** Hier nicht sinnvoll. Tritt ein Mitglied aus der Genossenschaft aus und wird sein Objekt gelöscht, dürfen seine Buchungen nicht automatisch verschwinden: Sie werden für Abrechnung, Rechnungen mit gesetzlichen Aufbewahrungspflichten, Auswertungen der Fahrzeugauslastung und die Klärung von Schäden oder Bußgeldern weiter benötigt. Außerdem ist eine Buchung kein „Bestandteil“ eines Mitglieds, sondern bezieht sich gleichermaßen auf ein Fahrzeug. Eine einfache Assoziation ist daher passend.',
            'Eine gut begründete gegenteilige Beurteilung (z. B. Buchungen werden vorher archiviert oder anonymisiert) ist ebenfalls richtig.',
          ],
          bewertung: ['2 P Erläuterung Komposition (Existenzabhängigkeit, gemeinsames Löschen)', '2 P begründete Beurteilung mit Bezug zum Szenario'],
        },
      ],
    },

    // ------------------------------------------------------------------ Aufgabe 4
    {
      id: 'pb1-01-4',
      art: 'sicherheit',
      titel: 'Digitaler Fahrzeugschlüssel',
      punkte: 23,
      sp: ['AP2-7-4-3'],
      situation:
        'Mitglieder von RegioRoll sollen gebuchte Fahrzeuge mit dem Smartphone öffnen. Nach einer Buchung erzeugt der Server einen ' +
        'digitalen Schlüssel – einen Datensatz mit Fahrzeug, Buchungsnummer, Gültigkeitszeitraum und Gerätekennung des Smartphones – und ' +
        'signiert ihn digital. Zum Schlüssel gehört außerdem ein geheimer Wert, den außer dem Server nur die App und die Telematikeinheit kennen. Die App überträgt den signierten ' +
        'Datensatz per Bluetooth an die Telematikeinheit im Fahrzeug, die ihn prüft und daraufhin die Türen entriegelt.',
      teile: [
        {
          nr: 'a',
          punkte: 4,
          text: 'Erläutern Sie den Unterschied zwischen Authentifizierung und Autorisierung jeweils an einem Beispiel aus der Carsharing-Plattform.',
          antwort: { art: 'text', zeilen: 6 },
          loesung: [
            '**Authentifizierung:** Nachweis der Identität („Wer bist du?“). Beispiel: Das Mitglied meldet sich in der App mit E-Mail-Adresse und Passwort an und bestätigt zusätzlich einen Code auf dem Smartphone (Zwei-Faktor-Authentifizierung); die Telematikeinheit prüft, ob das Smartphone die im Schlüssel eingetragene Gerätekennung hat.',
            '**Autorisierung:** Prüfung, welche Rechte die bereits authentifizierte Person hat („Was darfst du?“). Beispiel: Das Mitglied darf nur das Fahrzeug öffnen, für das es im aktuellen Zeitraum eine gültige Buchung hat; nur Beschäftigte mit der Rolle „Flottenverwaltung“ dürfen in der Verwaltungsoberfläche Fahrzeuge sperren.',
          ],
          bewertung: ['je Begriff 2 P: 1 P Erläuterung, 1 P passendes Beispiel aus dem Szenario (max. 4 P)'],
        },
        {
          nr: 'ba',
          punkte: 3,
          sp: ['AP2-1-2-3', 'AP2-7-1-2'],
          text:
            'Ein Hersteller von Telematikeinheiten beschreibt sein System in folgendem Text.\n\n' +
            'Erläutern Sie, wie laut Text verhindert wird, dass aufgezeichnete Funknachrichten später erneut zum Öffnen des Fahrzeugs verwendet werden.',
          vorgaben: [
            {
              hinweis:
                'Phone-as-a-key systems allow users to unlock a vehicle with their smartphone via Bluetooth Low Energy (BLE). ' +
                'Instead of a physical key, the backend issues a short-lived digital key that is signed by the server and bound to one booking, ' +
                'one vehicle and one smartphone. When the user approaches the car, the telematics unit and the phone run a challenge-response ' +
                'protocol: the unit sends a random number, and the phone proves possession of the key by returning a value calculated from this ' +
                'number and the secret belonging to the key. Because the challenge is different every time, recorded messages cannot simply be replayed later.\n\n' +
                'However, a relay attack is still possible: two attackers forward the radio signals between a phone that is far away, for example ' +
                'in a café, and the car, so that the car believes the phone is right next to it. Common countermeasures are distance bounding, ' +
                'where the unit measures the round-trip time of the signal and rejects answers that arrive too late, and requiring an explicit ' +
                'user action in the app, such as tapping an "unlock" button, before the phone responds. In addition, digital keys should expire ' +
                'automatically at the end of the booking and must be revocable by the backend at any time, for example if a phone is reported stolen.',
            },
          ],
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            'Es wird ein Challenge-Response-Verfahren verwendet: Die Telematikeinheit schickt bei jedem Öffnungsversuch eine neue Zufallszahl (Challenge). Das Smartphone berechnet aus dieser Zahl und dem geheimen Wert des digitalen Schlüssels einen Antwortwert und sendet ihn zurück; damit beweist es, dass es den Schlüssel besitzt, ohne das Geheimnis selbst zu übertragen.',
            'Da die Zufallszahl jedes Mal anders ist, passt eine früher aufgezeichnete Antwort nicht zur neuen Challenge. Ein Wiedereinspielen (Replay) aufgezeichneter Nachrichten öffnet das Fahrzeug daher nicht.',
          ],
          bewertung: ['1 P Zufallszahl/Challenge von der Telematikeinheit', '1 P Antwort aus Zufallszahl und (geheimem) Schlüssel berechnet', '1 P Challenge ändert sich, alte Antwort ist wertlos'],
        },
        {
          nr: 'bb',
          punkte: 6,
          sp: ['AP2-1-2-3', 'AP2-7-1-2'],
          text: 'Beschreiben Sie den im Text genannten Relay-Angriff und erläutern Sie zwei Gegenmaßnahmen, die der Text dazu nennt.',
          antwort: { art: 'text', zeilen: 8 },
          loesung: [
            '**Relay-Angriff:** Zwei Angreifer leiten die Funksignale zwischen dem weit entfernten Smartphone des Mitglieds (z. B. in einem Café) und dem Fahrzeug weiter. Die Telematikeinheit „glaubt“, das berechtigte Smartphone sei direkt am Fahrzeug, und entriegelt – obwohl das Mitglied nicht dort ist. Der Angriff funktioniert trotz Challenge-Response, weil die echten Nachrichten nur in Echtzeit weitergereicht und nicht verändert werden.',
            '**Gegenmaßnahmen** (zwei genügen):',
            '- **Distance Bounding:** Die Telematikeinheit misst die Laufzeit zwischen Challenge und Antwort. Durch die Weiterleitung über die Angreifer dauert die Antwort länger; kommt sie später als bei einem Smartphone in unmittelbarer Nähe möglich, wird sie abgelehnt.',
            '- **Ausdrückliche Bestätigung in der App:** Das Smartphone antwortet erst, wenn das Mitglied in der App aktiv „Öffnen“ tippt. Ein Smartphone in der Tasche reagiert dann nicht unbemerkt auf weitergeleitete Anfragen.',
            '- **Begrenzte Gültigkeit und Sperrung:** Digitale Schlüssel laufen am Ende der Buchung automatisch ab und können vom Server jederzeit widerrufen werden, z. B. wenn ein Smartphone als gestohlen gemeldet wird. Das begrenzt den Zeitraum, in dem ein Angriff möglich ist.',
          ],
          bewertung: ['2 P Beschreibung des Relay-Angriffs', 'je Gegenmaßnahme 2 P (max. 4 P)', 'Antworten auf Deutsch; nur Maßnahmen aus dem Text werden gewertet'],
        },
        {
          nr: 'ca',
          punkte: 4,
          sp: ['AP2-7-4-2'],
          text: 'Beschreiben Sie, wie die Telematikeinheit mithilfe der digitalen Signatur prüfen kann, dass der digitale Schlüssel vom Server von RegioRoll stammt und nicht verändert wurde.',
          antwort: { art: 'text', zeilen: 7 },
          loesung: [
            '1. Der Server bildet einen Hashwert über die Daten des digitalen Schlüssels (Fahrzeug, Buchungsnummer, Gültigkeit, Gerätekennung).',
            '2. Er verschlüsselt diesen Hashwert mit seinem **privaten** Schlüssel; das Ergebnis ist die Signatur, die zusammen mit den Daten übertragen wird.',
            '3. In der Telematikeinheit ist der **öffentliche** Schlüssel des Servers hinterlegt (z. B. bei der Einrichtung). Sie entschlüsselt damit die Signatur und erhält den ursprünglichen Hashwert.',
            '4. Die Telematikeinheit berechnet selbst den Hashwert über die empfangenen Daten und vergleicht beide Werte. Stimmen sie überein, sind die Daten unverändert (Integrität) und stammen vom Inhaber des privaten Schlüssels, also vom Server (Authentizität). Weichen sie ab, wird das Öffnen verweigert.',
          ],
          bewertung: ['je richtigem Schritt 1 P (max. 4 P)', 'Vertauschen von privatem und öffentlichem Schlüssel: höchstens 2 P'],
        },
        {
          nr: 'cb',
          punkte: 3,
          sp: ['AP2-7-4-1'],
          text:
            'Die Verbindung zwischen App und REST-API wird mit TLS (HTTPS) verschlüsselt. Dabei kommt ein hybrides Verfahren zum Einsatz.\n\n' +
            'Erläutern Sie, warum ein hybrides Verfahren verwendet wird.',
          antwort: { art: 'text', zeilen: 5 },
          loesung: [
            'Ein hybrides Verfahren verbindet die Vorteile beider Verfahrensarten:',
            '- Mit einem **asymmetrischen** Verfahren (öffentlicher/privater Schlüssel) wird zu Beginn ein gemeinsamer Sitzungsschlüssel sicher vereinbart bzw. ausgetauscht. Dafür muss vorher kein geheimer Schlüssel auf einem sicheren Weg übergeben werden; das Schlüsselverteilungsproblem der symmetrischen Verfahren entfällt.',
            '- Die eigentlichen Daten werden mit diesem Sitzungsschlüssel **symmetrisch** verschlüsselt, weil symmetrische Verfahren deutlich schneller sind und weniger Rechenleistung brauchen als asymmetrische – wichtig bei vielen Anfragen und auf Smartphones.',
          ],
          bewertung: ['1 P asymmetrisch für Schlüsselaustausch', '1 P symmetrisch für die Nutzdaten', '1 P Begründung (kein sicherer Vorab-Austausch nötig und/oder Geschwindigkeit)'],
        },
        {
          nr: 'd',
          punkte: 3,
          sp: ['AP2-7-5-1'],
          text:
            'Die Telematikeinheit meldet der Plattform die Position des Fahrzeugs. Dadurch lassen sich Bewegungsprofile der Mitglieder erstellen.\n\n' +
            'Nennen Sie drei Maßnahmen, mit denen RegioRoll die Grundsätze des Datenschutzes bei diesen Standortdaten einhält.',
          antwort: { art: 'text', zeilen: 4 },
          loesung: [
            'Drei der folgenden Maßnahmen (andere sinnvolle Antworten sind richtig):',
            '- Datenminimierung: nur die Position bei Beginn und Ende der Buchung bzw. beim Abstellen speichern, nicht laufend während der Fahrt',
            '- Zweckbindung: Standortdaten nur für die Abrechnung, das Auffinden des Fahrzeugs oder die Klärung von Schäden verwenden',
            '- Speicherbegrenzung: feste Löschfristen festlegen und Fahrtdaten nach Abschluss der Abrechnung löschen oder anonymisieren',
            '- Transparenz: Mitglieder in der Datenschutzerklärung der App über Art, Zweck und Dauer der Speicherung informieren',
            '- Zugriffsschutz: Berechtigungskonzept, nur wenige Beschäftigte dürfen Standortdaten einsehen; Zugriffe protokollieren',
            '- Pseudonymisierung der Fahrtdaten für Auswertungen (z. B. Auslastung der Stationen)',
            '- verschlüsselte Übertragung und Speicherung der Standortdaten',
          ],
          bewertung: ['je Nennung 1 P (max. 3 P)', 'gewertet werden die ersten drei Nennungen'],
        },
      ],
    },
  ],
};
