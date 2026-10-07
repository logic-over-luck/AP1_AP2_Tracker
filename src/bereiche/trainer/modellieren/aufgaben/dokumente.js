// Modus „Lasten- & Pflichtenheft" – Format: siehe ../README.md

export const spickzettel = `- **Lastenheft** schreibt der **Auftraggeber**: **WAS** soll die Lösung leisten und **WOFÜR** – fachlich, ohne Technik
- **Pflichtenheft** schreibt der **Auftragnehmer**: **WIE** und **WOMIT** jede Anforderung umgesetzt wird; nach Freigabe verbindliche Grundlage für Umsetzung und Abnahme
- **Funktionale Anforderung**: was das System tut – Funktion, Eingabe, Ausgabe, Daten
- **Nicht funktionale Anforderung** (Qualität): wie gut – Antwortzeit, Verfügbarkeit, Sicherheit, Benutzbarkeit
- **Gute Anforderung**: ein Satz, eindeutig, **prüfbar** (Zahl statt „schnell"), mit Nummer wie /LF10/
- **Gliederung**: Ausgangslage und Ziel – Produkteinsatz – funktionale Anforderungen – Qualitätsanforderungen – Rahmenbedingungen – Abnahmekriterien`;

export const notation = {
  text: 'Lastenheft und Pflichtenheft sind zwei Stufen derselben Sache: Der Auftraggeber beschreibt sein Problem und seine Anforderungen, der Auftragnehmer antwortet mit einer Lösungsbeschreibung. Jede Anforderung bekommt eine **Nummer** (z. B. /LF10/ für eine Funktion, /LQ10/ für eine Qualitätsanforderung), damit sich Pflichtenheft und Tests eindeutig darauf beziehen können.',
  punkte: [
    '**Lastenheft – WAS und WOFÜR:** vom Auftraggeber. Beschreibt Ausgangslage, Ziele und Anforderungen aus fachlicher Sicht. Auftragnehmer erstellen auf dieser Grundlage ihre Angebote.',
    '**Pflichtenheft – WIE und WOMIT:** vom Auftragnehmer. Greift jede Anforderung des Lastenhefts auf und beschreibt die Umsetzung: Abläufe, Masken, Datenhaltung, Plattform, Schnittstellen. Nach der Freigabe durch den Auftraggeber ist es verbindlich.',
    '**Typische Gliederung:** 1 Ausgangslage und Ziel · 2 Produkteinsatz (Nutzer, Einsatzumgebung) · 3 Funktionale Anforderungen · 4 Qualitätsanforderungen · 5 Rahmenbedingungen (Termine, Budget, vorhandene Technik, Gesetze) · 6 Abnahmekriterien.',
    '**Funktional** = eine Funktion des Systems: „Das System leitet einen Urlaubsantrag an die zuständige Teamleitung weiter." **Nicht funktional** = eine Eigenschaft: „Jede Seite lädt in höchstens 2 Sekunden."',
    '**Prüfbar formulieren:** statt „schnell" → „in höchstens 2 Sekunden"; statt „benutzerfreundlich" → „ein neuer Nutzer stellt ohne Schulung in höchstens 3 Minuten einen Antrag".',
    '**Abnahmekriterien** legen vorab fest, woran beide Seiten erkennen, dass die Lösung fertig ist – meist Testfälle mit erwartetem Ergebnis.',
    '**Nichts erfinden:** In das Lastenheft gehört, was der Auftraggeber verlangt. Eigene Ideen sind Vorschläge und müssen abgestimmt werden.',
  ],
};

const RAUM = ['AP2'];
const SP = 'AP2-1-1-2';
const OPT_ART = ['funktional', 'nicht funktional'];
const OPT_DOK = ['Lastenheft', 'Pflichtenheft'];
const OPT_GL = ['Ausgangslage und Ziel', 'Produkteinsatz', 'Funktionale Anforderungen', 'Qualitätsanforderungen', 'Rahmenbedingungen', 'Abnahmekriterien'];

const PH = [
  'Maske „Reservieren" mit Standort- und Datumsauswahl; beim Speichern prüft der Server, ob das Rad im Zeitraum noch frei ist.',
  'Nach dem Speichern verschickt der Server eine E-Mail mit Reservierungsnummer, Rad, Standort und Zeitraum.',
  'Responsives Layout ab 360 Pixel Breite, Schaltflächen mindestens 44 × 44 Pixel, getestet mit aktuellen Android- und iOS-Browsern.',
  'Übertragung nur per HTTPS, Passwörter nur als Hashwert gespeichert, Mitarbeiter-Funktionen erst nach Anmeldung mit Rolle.',
];

export const aufgaben = [
  {
    id: 'dk-q1',
    art: 'fragen',
    raum: RAUM,
    sp: SP,
    titel: 'Funktional oder nicht funktional?',
    text: 'Ein ambulanter Pflegedienst lässt eine App zur Zeiterfassung entwickeln. Ordne jede Anforderung ein.',
    felder: [
      { id: 'a', label: 'Mitarbeiter buchen per Smartphone ihren Arbeitsbeginn und ihr Arbeitsende.', optionen: OPT_ART, erwartet: 'funktional' },
      { id: 'b', label: 'Eine Buchung wird spätestens 2 Sekunden nach dem Antippen bestätigt.', optionen: OPT_ART, erwartet: 'nicht funktional' },
      { id: 'c', label: 'Die Teamleitung erzeugt für jeden Mitarbeiter eine Monatsübersicht als PDF.', optionen: OPT_ART, erwartet: 'funktional' },
      { id: 'd', label: 'Die App ist zu mindestens 99,5 % der Zeit eines Monats erreichbar.', optionen: OPT_ART, erwartet: 'nicht funktional' },
      { id: 'e', label: 'Ist nach 10 Stunden kein Arbeitsende gebucht, schickt die App eine Erinnerung.', optionen: OPT_ART, erwartet: 'funktional' },
      { id: 'f', label: 'Die App lässt sich vollständig mit einem Screenreader bedienen.', optionen: OPT_ART, erwartet: 'nicht funktional' },
    ],
    loesung: [
      '**Funktional** ist, was das System **tut**: buchen, PDF erzeugen, erinnern. Frage dich: Ist das eine Funktion, die ein Nutzer auslöst oder das System ausführt?',
      '**Nicht funktional** beschreibt, **wie gut** das System etwas tut: Antwortzeit, Verfügbarkeit, Barrierefreiheit.',
      'Achtung bei (e): Die Zahl „10 Stunden" macht daraus keine Qualitätsanforderung – beschrieben wird eine **Funktion** (Erinnerung schicken) mit ihrer Bedingung.',
    ],
  },
  {
    id: 'dk-q2',
    art: 'fragen',
    raum: RAUM,
    sp: SP,
    titel: 'Lastenheft oder Pflichtenheft?',
    text: 'Eine Physiotherapie-Praxis lässt eine Online-Terminbuchung entwickeln. Gehört die Aussage zum Lastenheft oder zum Pflichtenheft?',
    felder: [
      { id: 'a', label: 'Wird vom Auftraggeber geschrieben.', optionen: OPT_DOK, erwartet: 'Lastenheft' },
      { id: 'b', label: 'Beschreibt, wie und womit die Anforderungen umgesetzt werden.', optionen: OPT_DOK, erwartet: 'Pflichtenheft' },
      { id: 'c', label: '„Patienten sollen freie Termine online sehen und buchen können."', optionen: OPT_DOK, erwartet: 'Lastenheft' },
      { id: 'd', label: '„Die Terminbuchung wird als Web-App umgesetzt; die Termine liegen in einer PostgreSQL-Datenbank."', optionen: OPT_DOK, erwartet: 'Pflichtenheft' },
      { id: 'e', label: 'Auf seiner Grundlage erstellen mögliche Auftragnehmer ihre Angebote.', optionen: OPT_DOK, erwartet: 'Lastenheft' },
      { id: 'f', label: 'Wird nach der Freigabe durch den Auftraggeber zur verbindlichen Grundlage für Umsetzung und Abnahme.', optionen: OPT_DOK, erwartet: 'Pflichtenheft' },
      { id: 'g', label: '„Die Erinnerung an den Termin wird einen Tag vorher per SMS über die Schnittstelle eines SMS-Dienstes verschickt."', optionen: OPT_DOK, erwartet: 'Pflichtenheft' },
    ],
    loesung: [
      'Das **Lastenheft** kommt vom **Auftraggeber** und sagt, **was** gebraucht wird und **wofür** – ohne Technik. Damit holt er Angebote ein.',
      'Das **Pflichtenheft** kommt vom **Auftragnehmer** und sagt, **wie** und **womit** er jede Anforderung umsetzt: Plattform, Datenbank, Schnittstellen.',
      'Gibt der Auftraggeber das Pflichtenheft frei, ist es die verbindliche Grundlage – auch für die Abnahme.',
    ],
  },
  {
    id: 'dk-q3',
    art: 'fragen',
    raum: RAUM,
    sp: SP,
    titel: 'Gliederung: Wohin gehört der Abschnitt?',
    text: 'Aus dem Lastenheft für ein digitales Urlaubsantragsverfahren stammen die folgenden Abschnitte. Ordne jeden dem passenden Gliederungspunkt zu.',
    felder: [
      { id: 'a', label: 'Urlaubsanträge werden heute auf Papier gestellt und gehen oft verloren. Künftig soll jeder Antrag innerhalb von zwei Arbeitstagen entschieden sein.', optionen: OPT_GL, erwartet: 'Ausgangslage und Ziel' },
      { id: 'b', label: 'Nutzer sind 120 Beschäftigte und 12 Teamleitungen; genutzt wird das System im Büro am PC und unterwegs auf dem Smartphone.', optionen: OPT_GL, erwartet: 'Produkteinsatz' },
      { id: 'c', label: '/LF20/ Das System leitet einen gestellten Antrag automatisch an die zuständige Teamleitung weiter.', optionen: OPT_GL, erwartet: 'Funktionale Anforderungen' },
      { id: 'd', label: '/LQ10/ Bei 100 gleichzeitigen Nutzern lädt jede Seite in höchstens 2 Sekunden.', optionen: OPT_GL, erwartet: 'Qualitätsanforderungen' },
      { id: 'e', label: 'Betrieb auf dem vorhandenen Linux-Server; Fertigstellung bis 30.06.; Budget höchstens 25.000 €.', optionen: OPT_GL, erwartet: 'Rahmenbedingungen' },
      { id: 'f', label: 'Das System gilt als abgenommen, wenn alle Testfälle aus Anhang B ohne schweren Fehler durchlaufen.', optionen: OPT_GL, erwartet: 'Abnahmekriterien' },
    ],
    loesung: [
      '**Ausgangslage und Ziel:** das heutige Problem und was sich verbessern soll.',
      '**Produkteinsatz:** wer das System nutzt und wo bzw. auf welchen Geräten.',
      '**Funktionale Anforderungen:** was das System tun soll, nummeriert.',
      '**Qualitätsanforderungen:** wie gut es das tun soll – messbar.',
      '**Rahmenbedingungen:** Vorgaben, die nicht verhandelbar sind: vorhandene Technik, Termine, Budget, Gesetze.',
      '**Abnahmekriterien:** woran beide Seiten erkennen, dass der Auftrag erfüllt ist.',
    ],
  },
  {
    id: 'dk-q4',
    art: 'fragen',
    raum: RAUM,
    sp: SP,
    titel: 'Gut oder schlecht formuliert?',
    text: 'Wähle jeweils die Formulierung, die als Anforderung in ein Lastenheft taugt.',
    felder: [
      {
        id: 'a',
        label: 'Antwortzeit',
        optionen: ['Das System soll schnell reagieren.', 'Das System reagiert so schnell wie möglich.', 'Das System zeigt das Suchergebnis in höchstens 2 Sekunden an.', 'Das System soll performant sein.'],
        erwartet: 'Das System zeigt das Suchergebnis in höchstens 2 Sekunden an.',
      },
      {
        id: 'b',
        label: 'Benutzbarkeit',
        optionen: ['Die App ist benutzerfreundlich.', 'Ein neuer Nutzer bucht ohne Schulung in höchstens 3 Minuten einen Termin.', 'Die App ist intuitiv und modern.', 'Die App soll den Nutzern gefallen.'],
        erwartet: 'Ein neuer Nutzer bucht ohne Schulung in höchstens 3 Minuten einen Termin.',
      },
      {
        id: 'c',
        label: 'Verfügbarkeit',
        optionen: ['Das System ist möglichst immer erreichbar.', 'Das System hat kaum Ausfälle.', 'Das System ist werktags von 7 bis 19 Uhr zu mindestens 99 % erreichbar.', 'Das System ist zuverlässig.'],
        erwartet: 'Das System ist werktags von 7 bis 19 Uhr zu mindestens 99 % erreichbar.',
      },
      {
        id: 'd',
        label: 'Funktion',
        optionen: [
          'Das System erzeugt Rechnungen und verschickt und archiviert sie und mahnt eventuell.',
          'Das System erzeugt nach Abschluss eines Auftrags eine Rechnung als PDF.',
          'Rechnungen sind irgendwie zu erstellen.',
          'Das System kann alles rund um Rechnungen.',
        ],
        erwartet: 'Das System erzeugt nach Abschluss eines Auftrags eine Rechnung als PDF.',
      },
      {
        id: 'e',
        label: 'Was macht eine Anforderung prüfbar?',
        optionen: ['Sie ist möglichst ausführlich.', 'Sie enthält ein messbares Kriterium, das sich testen lässt.', 'Sie verwendet Fachbegriffe aus der Programmierung.', 'Sie nennt die Datenbanktabellen.'],
        erwartet: 'Sie enthält ein messbares Kriterium, das sich testen lässt.',
      },
    ],
    loesung: [
      'Wörter wie „schnell", „benutzerfreundlich", „zuverlässig" oder „möglichst" kann niemand testen – jeder versteht etwas anderes darunter.',
      'Prüfbar wird eine Anforderung durch eine **Zahl mit Einheit und Bedingung**: „höchstens 2 Sekunden", „mindestens 99 % werktags von 7 bis 19 Uhr".',
      'Pro Satz **eine** Anforderung. Ein Bandwurmsatz mit „und … und … eventuell" lässt sich nicht eindeutig abnehmen.',
    ],
  },
  {
    id: 'dk-q5',
    art: 'fragen',
    raum: RAUM,
    sp: SP,
    titel: 'Anforderungen aus dem Gespräch: Fahrradverleih',
    text: 'Herr Brand betreibt einen Fahrradverleih mit drei Standorten. Bisher reservieren Kunden telefonisch; oft sind Räder doppelt vergeben. Er wünscht sich: Kunden sollen online sehen, welche Räder an einem Standort an einem Tag frei sind, und ein Rad reservieren können. Nach der Reservierung soll eine Bestätigung per E-Mail kommen. Seine Mitarbeiter sollen am Tresen Ausgabe und Rückgabe erfassen. Die Seite muss auf Smartphones gut nutzbar sein, weil die meisten Kunden unterwegs buchen. Kundendaten dürfen nur auf Servern in Deutschland liegen. Fertig sein muss alles vor Saisonbeginn am 1. April.',
    felder: [
      {
        id: 'a',
        label: 'Welche funktionale Anforderung ergibt sich aus dem Text?',
        optionen: [
          'Das System zeigt für einen gewählten Standort und Tag die freien Räder an.',
          'Die Seite ist auf Smartphones gut nutzbar.',
          'Kundendaten liegen nur auf Servern in Deutschland.',
          'Das Projekt ist vor dem 1. April abgeschlossen.',
        ],
        erwartet: 'Das System zeigt für einen gewählten Standort und Tag die freien Räder an.',
      },
      { id: 'b', label: 'Zu welchem Gliederungspunkt gehört „fertig vor dem 1. April"?', optionen: OPT_GL, erwartet: 'Rahmenbedingungen' },
      {
        id: 'c',
        label: 'Wie wird „auf Smartphones gut nutzbar" prüfbar?',
        optionen: [
          'Die Seite sieht auf Smartphones modern aus.',
          'Alle Kundenfunktionen sind ab 360 Pixel Bildschirmbreite ohne waagerechtes Scrollen bedienbar.',
          'Die Seite ist schön responsiv.',
          'Die Seite soll auf Smartphones keine Probleme machen.',
        ],
        erwartet: 'Alle Kundenfunktionen sind ab 360 Pixel Bildschirmbreite ohne waagerechtes Scrollen bedienbar.',
      },
      {
        id: 'd',
        label: 'Welches Problem der Ausgangslage soll die Lösung beheben?',
        optionen: ['Räder werden doppelt vergeben, weil telefonisch reserviert wird.', 'Es gibt zu wenige Standorte.', 'Die Leihpreise sind zu hoch.', 'Die Mitarbeiter haben keine Smartphones.'],
        erwartet: 'Räder werden doppelt vergeben, weil telefonisch reserviert wird.',
      },
      {
        id: 'e',
        label: 'Welche Anforderung hat Herr Brand NICHT gestellt?',
        optionen: ['Bestätigung der Reservierung per E-Mail', 'Erfassen von Ausgabe und Rückgabe am Tresen', 'Online-Bezahlung der Reservierung', 'Anzeige freier Räder je Standort und Tag'],
        erwartet: 'Online-Bezahlung der Reservierung',
      },
    ],
    loesung: [
      'Lies das Gespräch zweimal: einmal nach **Tätigkeiten** (sehen, reservieren, bestätigen, erfassen → funktional), einmal nach **Eigenschaften und Vorgaben** (Smartphone, Serverstandort, Termin).',
      'Termin, Budget, gesetzliche oder technische Vorgaben sind **Rahmenbedingungen** – sie beschreiben keine Funktion.',
      '„Gut nutzbar" ist erst eine brauchbare Anforderung, wenn du ein **messbares Kriterium** daraus machst.',
      'Schreib nur auf, was der Auftraggeber verlangt. Online-Bezahlung wäre eine eigene Idee – die müsstest du erst mit Herrn Brand abstimmen.',
    ],
  },
  {
    id: 'dk-q6',
    art: 'fragen',
    raum: RAUM,
    sp: SP,
    titel: 'Vom Lastenheft zum Pflichtenheft',
    text: 'Für den Fahrradverleih liegt das Lastenheft vor. Ordne jeder Anforderung die passende Umsetzung aus dem Pflichtenheft zu und beantworte die Fragen.',
    tabelle: {
      kopf: ['Nr.', 'Anforderung im Lastenheft'],
      zeilen: [
        ['/LF10/', 'Kunden können ein freies Rad für einen Zeitraum online reservieren.'],
        ['/LF20/', 'Kunden erhalten eine Bestätigung der Reservierung.'],
        ['/LQ10/', 'Die Seite ist auf Smartphones gut nutzbar.'],
        ['/LQ20/', 'Kundendaten sind vor fremdem Zugriff geschützt.'],
      ],
    },
    felder: [
      { id: 'a', label: 'Umsetzung zu /LF10/', optionen: PH, erwartet: PH[0] },
      { id: 'b', label: 'Umsetzung zu /LF20/', optionen: PH, erwartet: PH[1] },
      { id: 'c', label: 'Umsetzung zu /LQ10/', optionen: PH, erwartet: PH[2] },
      { id: 'd', label: 'Umsetzung zu /LQ20/', optionen: PH, erwartet: PH[3] },
      {
        id: 'w',
        label: 'Was leistet das Pflichtenheft gegenüber dem Lastenheft?',
        optionen: [
          'Es wiederholt die Anforderungen wörtlich.',
          'Es beschreibt zu jeder Anforderung, wie und womit sie umgesetzt wird.',
          'Es ersetzt die Anforderungen durch eigene Wünsche des Auftragnehmers.',
          'Es enthält nur Termine und Kosten.',
        ],
        erwartet: 'Es beschreibt zu jeder Anforderung, wie und womit sie umgesetzt wird.',
      },
      {
        id: 'n',
        label: 'Warum übernimmt das Pflichtenheft die Nummern des Lastenhefts?',
        optionen: [
          'damit das Dokument einheitlich aussieht',
          'damit nachvollziehbar ist, welche Anforderung wie umgesetzt und später getestet wird',
          'weil der Auftraggeber so die Reihenfolge der Programmierung festlegt',
          'weil Nummern nur im Pflichtenheft erlaubt sind',
        ],
        erwartet: 'damit nachvollziehbar ist, welche Anforderung wie umgesetzt und später getestet wird',
      },
    ],
    loesung: [
      'Jede Lastenheft-Anforderung bekommt im Pflichtenheft eine **konkrete Lösung**: Maske und Prüfung für das Reservieren, E-Mail-Versand für die Bestätigung.',
      'Auch Qualitätsanforderungen werden umgesetzt und **prüfbar** gemacht: „gut nutzbar" wird zu Mindestbreite, Schaltflächengröße und Testgeräten; „geschützt" zu HTTPS, gehashten Passwörtern und Rollen.',
      'Über die **gleichen Nummern** lässt sich jede Anforderung vom Lastenheft über das Pflichtenheft bis zum Testfall verfolgen – so sieht man bei der Abnahme, ob nichts vergessen wurde.',
    ],
  },

  // ---------- Ausarbeiten ----------
  {
    id: 'dk-z1',
    art: 'zeichnen',
    raum: RAUM,
    sp: SP,
    titel: 'Anforderungen formulieren: Kantine',
    text: 'Die Kantine der Holm AG kocht täglich für rund 400 Beschäftigte und wirft viel Essen weg, weil sie nicht weiß, wie viele Portionen gebraucht werden. Beschäftigte sollen deshalb künftig ihr Mittagessen aus dem Wochenplan online vorbestellen – am PC oder auf dem Smartphone –, spätestens bis 10 Uhr am selben Tag. Die Kantine will morgens sehen, wie viele Portionen je Gericht bestellt sind. Bezahlt wird wie bisher an der Kasse mit dem Mitarbeiterausweis. Die Anmeldung soll mit dem vorhandenen Firmenkonto erfolgen. Kurz vor 10 Uhr bestellen viele gleichzeitig.\n- Formuliere für das Lastenheft **mindestens vier funktionale** und **drei nicht funktionale** Anforderungen – nummeriert, je ein Satz, prüfbar.',
    musterText: `**Funktionale Anforderungen**
- /LF10/ Das System zeigt angemeldeten Beschäftigten den Speiseplan der aktuellen und der nächsten Woche.
- /LF20/ Beschäftigte können für einen Tag genau ein Gericht aus dem Speiseplan vorbestellen.
- /LF30/ Beschäftigte können eine Bestellung bis 10:00 Uhr des jeweiligen Tages ändern oder stornieren; danach sperrt das System die Bestellung.
- /LF40/ Das System zeigt der Kantine für jeden Tag die Zahl der bestellten Portionen je Gericht.
- /LF50/ Beschäftigte melden sich mit ihrem vorhandenen Firmenkonto an.
**Nicht funktionale Anforderungen**
- /LQ10/ Bei 300 gleichzeitigen Bestellungen bestätigt das System jede Bestellung in höchstens 2 Sekunden.
- /LQ20/ Alle Funktionen für Beschäftigte sind am PC und auf Smartphones ab 360 Pixel Breite ohne waagerechtes Scrollen bedienbar.
- /LQ30/ Ein Beschäftigter bestellt ohne Schulung in höchstens 2 Minuten ein Gericht.
- /LQ40/ Das System ist werktags von 6 bis 14 Uhr zu mindestens 99 % erreichbar.`,
    pruefliste: [
      'Mindestens **vier funktionale** Anforderungen, die jeweils eine Funktion des Systems beschreiben',
      'Die Kernfunktionen sind dabei: Speiseplan anzeigen, Gericht vorbestellen, Bestellschluss 10 Uhr, Portionsübersicht für die Kantine',
      'Mindestens **drei nicht funktionale** Anforderungen (z. B. Antwortzeit bei vielen gleichzeitigen Bestellungen, Smartphone-Nutzung, Erreichbarkeit)',
      'Jede Anforderung ist **prüfbar** – Zahlen und Grenzen statt „schnell", „einfach", „gut"',
      '**Ein Satz – eine Anforderung**, keine Aufzählung mit „und … und …"',
      'Jede Anforderung hat eine **eindeutige Nummer** (z. B. /LF10/, /LQ10/)',
      'Aus Sicht des Auftraggebers formuliert (WAS), ohne technische Lösung wie Programmiersprache oder Datenbank',
      'Nichts erfunden – z. B. **keine Online-Bezahlung**, denn bezahlt wird weiter an der Kasse',
    ],
    hinweise: '„Das System muss …" ist genauso richtig wie „Beschäftigte können …". Die Anmeldung mit dem Firmenkonto darfst du auch als Rahmenbedingung einordnen. Die Zahlen in den Qualitätsanforderungen sind Vorschläge – im echten Projekt stimmst du sie mit dem Auftraggeber ab.',
  },
  {
    id: 'dk-z2',
    art: 'zeichnen',
    raum: RAUM,
    sp: SP,
    titel: 'Lastenheft gliedern: Werkstatttermine',
    text: 'Das Autohaus Kranz vergibt Werkstatttermine bisher nur telefonisch; zu Stoßzeiten ist die Leitung ständig besetzt und Kunden springen ab. Künftig sollen Kunden rund um die Uhr online einen Termin anfragen – mit Kennzeichen, gewünschter Leistung (Inspektion, Reifenwechsel, Reparatur) und Wunschtermin. Der Serviceberater sieht alle Termine des Tages und kann sie bestätigen oder verschieben; der Kunde erhält dann eine E-Mail. Die Lösung soll in die vorhandene Website eingebunden werden, bis Ende März fertig sein und höchstens 18.000 € kosten. Abgenommen wird nach einem gemeinsamen Test mit drei Serviceberatern.\n- Erstelle die **Gliederung eines Lastenhefts** mit den sechs üblichen Hauptpunkten und schreibe zu jedem Punkt ein bis drei passende Sätze aus dem Szenario.',
    musterText: `**1 Ausgangslage und Ziel** – Termine werden nur telefonisch vergeben; zu Stoßzeiten ist die Leitung besetzt und Kunden gehen verloren. Ziel: Kunden fragen Werkstatttermine jederzeit online an, das Telefon wird entlastet.
**2 Produkteinsatz** – Nutzer sind die Kunden des Autohauses (am PC oder Smartphone, rund um die Uhr) und die Serviceberater in der Werkstatt.
**3 Funktionale Anforderungen**
- /LF10/ Kunden fragen einen Termin mit Kennzeichen, Leistung (Inspektion, Reifenwechsel, Reparatur) und Wunschtermin an.
- /LF20/ Serviceberater sehen alle Termine eines Tages und können jeden Termin bestätigen oder verschieben.
- /LF30/ Nach dem Bestätigen oder Verschieben erhält der Kunde automatisch eine E-Mail.
**4 Qualitätsanforderungen** – /LQ10/ Die Terminanfrage ist auf Smartphones ab 360 Pixel Breite vollständig bedienbar. /LQ20/ Die Online-Anfrage ist zu mindestens 99 % der Zeit erreichbar.
**5 Rahmenbedingungen** – Einbindung in die vorhandene Website, Fertigstellung bis Ende März, Kosten höchstens 18.000 €.
**6 Abnahmekriterien** – Gemeinsamer Test mit drei Serviceberatern: Alle Anforderungen /LF10/ bis /LF30/ und /LQ10/ werden ohne Fehler durchgespielt.`,
    pruefliste: [
      'Alle **sechs Hauptpunkte** in sinnvoller Reihenfolge: Ausgangslage und Ziel, Produkteinsatz, funktionale Anforderungen, Qualitätsanforderungen, Rahmenbedingungen, Abnahmekriterien',
      '**Ausgangslage** nennt das Problem (Telefon besetzt, Kunden springen ab), **Ziel** die gewünschte Verbesserung',
      '**Produkteinsatz** nennt beide Nutzergruppen (Kunden, Serviceberater) und wie bzw. wann genutzt wird',
      '**Funktionale Anforderungen** nummeriert: Termin anfragen, Tagesübersicht mit Bestätigen/Verschieben, E-Mail an den Kunden',
      'Mindestens eine **prüfbare Qualitätsanforderung** (z. B. Smartphone-Nutzung, Erreichbarkeit)',
      '**Rahmenbedingungen** vollständig: Website-Einbindung, Termin Ende März, höchstens 18.000 €',
      '**Abnahmekriterien**: gemeinsamer Test mit drei Serviceberatern, bezogen auf die Anforderungen',
      'Keine technische Lösung (Programmiersprache, Datenbank) – die gehört ins Pflichtenheft',
    ],
    hinweise: 'Qualitätsanforderungen nennt das Szenario nur indirekt („rund um die Uhr", „online"). Du darfst sinnvolle, prüfbare Werte ergänzen – im echten Projekt stimmst du sie mit dem Auftraggeber ab.',
  },
  {
    id: 'dk-z3',
    art: 'zeichnen',
    raum: RAUM,
    sp: SP,
    titel: 'Pflichtenheft: Umsetzung beschreiben',
    text: 'Dein Team hat den Auftrag für die Essensvorbestellung der Holm AG erhalten. Ihr setzt die Lösung als Web-App mit Angular um, der Server läuft mit Java (Spring Boot), die Daten liegen in MariaDB; die Firmenkonten der Holm AG verwaltet ein Active Directory.\n- Beschreibe für die vier Anforderungen aus dem Lastenheft, **wie und womit** ihr sie umsetzt – so, wie es im Pflichtenheft stehen würde.',
    tabelle: {
      kopf: ['Nr.', 'Anforderung im Lastenheft'],
      zeilen: [
        ['/LF20/', 'Beschäftigte können für einen Tag genau ein Gericht aus dem Speiseplan vorbestellen.'],
        ['/LF30/', 'Bis 10:00 Uhr des Tages kann eine Bestellung geändert oder storniert werden, danach nicht mehr.'],
        ['/LF50/', 'Beschäftigte melden sich mit ihrem vorhandenen Firmenkonto an.'],
        ['/LQ10/', 'Bei 300 gleichzeitigen Bestellungen wird jede Bestellung in höchstens 2 Sekunden bestätigt.'],
      ],
    },
    musterTabelle: {
      kopf: ['Nr.', 'Umsetzung im Pflichtenheft (wie / womit)'],
      zeilen: [
        ['/LF20/', 'Maske „Bestellen" (Angular) zeigt den Speiseplan des Tages; das Gericht wird per Optionsfeld gewählt und mit „Bestellen" gesendet. Der Server speichert die Bestellung in der Tabelle Bestellung (MitarbeiterID, Datum, GerichtID); ein eindeutiger Schlüssel auf MitarbeiterID und Datum verhindert eine zweite Bestellung am selben Tag.'],
        ['/LF30/', 'Ändern und Stornieren über die Maske „Meine Bestellungen". Der Server prüft bei jeder Änderung die Serverzeit; ab 10:00 Uhr lehnt er die Änderung ab, und die Maske zeigt „Bestellschluss 10:00 Uhr erreicht".'],
        ['/LF50/', 'Anmeldung über das Active Directory der Holm AG per LDAP; die Anwendung speichert keine eigenen Passwörter.'],
        ['/LQ10/', 'Index auf Bestellung.Datum, Verbindungspool im Server. Nachweis durch einen Lasttest mit 300 parallelen Bestellungen vor der Abnahme: Jede Bestellung muss in höchstens 2 Sekunden bestätigt sein.'],
      ],
    },
    pruefliste: [
      'Jede Zeile greift die **Nummer** der Lastenheft-Anforderung auf',
      'Beschrieben ist **wie** (Maske, Ablauf, Prüfung) **und womit** (Angular, Spring Boot, MariaDB, Active Directory) umgesetzt wird',
      '/LF20/: Maske zum Bestellen, Speicherung, und eine zweite Bestellung am selben Tag wird **verhindert**',
      '/LF30/: Der Bestellschluss wird auf dem **Server** geprüft (nicht nur in der Maske), der Nutzer bekommt einen verständlichen Hinweis',
      '/LF50/: Anbindung an das vorhandene Firmenkonto, **keine eigene Passwortverwaltung**',
      '/LQ10/: konkrete Maßnahme **und** prüfbarer Nachweis (Lasttest mit 300 Bestellungen, höchstens 2 Sekunden)',
      'Keine Anforderung weggelassen oder stillschweigend geändert',
    ],
    hinweise: 'Die Einzelheiten (Tabellennamen, Index, Meldungstext) dürfen anders aussehen. Wichtig ist, dass jede Anforderung nachvollziehbar eine konkrete, überprüfbare Umsetzung bekommt.',
  },
];

export default { spickzettel, notation, aufgaben };
