// Modus „Normalisierung" – Format: siehe ../README.md

export const spickzettel = `- **Redundanz**: dieselbe Information steht mehrfach, z. B. Name und Ort eines Kunden in jeder seiner Auftragszeilen
- **Änderungsanomalie**: ein mehrfach gespeicherter Wert wird nicht überall geändert → widersprüchliche Daten
- **Einfügeanomalie**: ein Datensatz lässt sich nicht anlegen, weil Angaben zu einem anderen Sachverhalt (Teil des Schlüssels) noch fehlen
- **Löschanomalie**: mit einem Datensatz gehen Informationen verloren, die man behalten wollte
- **1NF**: jede Zelle genau **ein** Wert – keine Listen, zusammengesetzte Angaben (Straße, PLZ, Ort) in eigene Spalten
- **2NF**: 1NF + jedes Nichtschlüsselattribut hängt vom **ganzen** Primärschlüssel ab – nur bei zusammengesetztem PK zu prüfen
- **3NF**: 2NF + kein Nichtschlüsselattribut hängt von einem **anderen Nichtschlüsselattribut** ab (keine transitive Abhängigkeit)`;

// Spalten: '#' vorn = Primärschlüssel, '>' vorn = Fremdschlüssel
const spalte = (s) => {
  const [, z, name] = s.match(/^([#>]*)(.*)$/);
  return { name, ...(z.includes('#') ? { pk: true } : {}), ...(z.includes('>') ? { fk: true } : {}) };
};
const tab = (id, x, y, name, spalten, extra = {}) => ({ id, typ: 'tabelle', x, y, name, spalten: spalten.map(spalte), ...extra });
const rel = (von, nach, a, b) => ({ von, nach, typ: 'assoziation', textVon: a, textNach: b });

export const notation = {
  text: 'Beispiel: Die Tabelle **Bestellung** (BestellNr, Datum, KundenNr, Kundenname, ArtikelNr, Bezeichnung, Menge) hat den zusammengesetzten Schlüssel BestellNr + ArtikelNr.\n- **2NF**: Datum, KundenNr und Kundenname hängen nur von der BestellNr ab, die Bezeichnung nur von der ArtikelNr → mit ihrem Schlüsselteil in eigene Tabellen. Übrig bleibt die Menge – sie braucht beide Teile.\n- **3NF**: Der Kundenname hängt von der KundenNr ab, also von einem Nichtschlüsselattribut → eigene Tabelle Kunde, in Bestellung bleibt die KundenNr als Fremdschlüssel.\nMerksatz: Jedes Nichtschlüsselattribut hängt vom Schlüssel ab, vom **ganzen** Schlüssel und von **nichts anderem** als dem Schlüssel.',
  bilder: [
    {
      titel: 'Ergebnis in 3. Normalform',
      diagramm: {
        breite: 780,
        hoehe: 170,
        knoten: [
          tab('kunde', 20, 40, 'Kunde', ['#KundenNr', 'Kundenname'], { w: 130 }),
          tab('bestellung', 210, 30, 'Bestellung', ['#BestellNr', 'Datum', '>KundenNr']),
          tab('pos', 400, 30, 'Bestellposition', ['#>BestellNr', '#>ArtikelNr', 'Menge'], { w: 150 }),
          tab('artikel', 620, 40, 'Artikel', ['#ArtikelNr', 'Bezeichnung']),
        ],
        kanten: [rel('kunde', 'bestellung', '1', 'n'), rel('bestellung', 'pos', '1', 'n'), rel('pos', 'artikel', 'n', '1')],
      },
    },
  ],
  punkte: [
    '**1. Normalform**: Jede Zelle enthält genau einen Wert. Listen wie „Excel, SQL" werden zu eigenen Zeilen (bzw. einer eigenen Tabelle), zusammengesetzte Angaben wie „Lindenweg 3, 50667 Köln" zu eigenen Spalten.',
    '**2. Normalform**: 1NF, und jedes Nichtschlüsselattribut hängt vom **ganzen** Primärschlüssel ab. Hat die Tabelle einen **einspaltigen** PK, ist sie in 1NF automatisch auch in 2NF.',
    '**3. Normalform**: 2NF, und kein Nichtschlüsselattribut hängt von einem anderen Nichtschlüsselattribut ab (z. B. KundenNr → Kundenname). Diese Gruppe kommt in eine eigene Tabelle.',
    '**Änderungsanomalie**: Ändert man einen mehrfach gespeicherten Wert nur in einer Zeile, widersprechen sich die Daten.',
    '**Einfügeanomalie**: Ein neuer Kunde ohne Bestellung lässt sich nicht speichern, weil der Schlüssel (BestellNr) fehlt.',
    '**Löschanomalie**: Löscht man die einzige Bestellung eines Kunden, sind auch die Angaben zum Kunden weg.',
  ],
};

const ANOMALIE = ['Änderungsanomalie', 'Einfügeanomalie', 'Löschanomalie'];
const NF = ['1. Normalform', '2. Normalform', '3. Normalform'];
const STIMMT = ['stimmt', 'stimmt nicht'];

export const aufgaben = [
  {
    id: 'nf-q1',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-4',
    titel: '1. Normalform: Kursanmeldungen',
    text: 'Ein Schulungsanbieter führt seine Anmeldungen in dieser Tabelle:',
    tabelle: {
      kopf: ['TeilnehmerNr', 'Name', 'Anschrift', 'Kurse'],
      zeilen: [
        ['T01', 'Berg', 'Lindenweg 3, 50667 Köln', 'Excel, SQL'],
        ['T02', 'Kraft', 'Ringstr. 12, 44135 Dortmund', 'SQL'],
        ['T03', 'Wolf', 'Am Markt 1, 50667 Köln', 'Python, Excel, SQL'],
      ],
    },
    felder: [
      { id: 'a', label: 'Welche Normalform ist als erste verletzt?', optionen: NF, erwartet: '1. Normalform' },
      { id: 'b', label: 'Welche Spalte enthält mehrere gleichartige Werte in einer Zelle?', optionen: ['TeilnehmerNr', 'Name', 'Kurse'], erwartet: 'Kurse' },
      {
        id: 'c',
        label: 'Wie stellst du für „Anschrift" die 1. Normalform her?',
        optionen: ['Anschrift als Primärschlüssel verwenden', 'in die Spalten Straße, PLZ und Ort zerlegen', 'Anschrift in eine Zeile je Wort aufteilen'],
        erwartet: 'in die Spalten Straße, PLZ und Ort zerlegen',
      },
      {
        id: 'd',
        label: 'Wie löst du die Spalte „Kurse" richtig auf?',
        optionen: ['Spalten Kurs1, Kurs2, Kurs3 anlegen', 'Kurse mit Semikolon statt Komma trennen', 'je Teilnehmer und Kurs eine eigene Zeile'],
        erwartet: 'je Teilnehmer und Kurs eine eigene Zeile',
      },
      { id: 'e', label: 'Wie viele Zeilen hat die Tabelle danach?', optionen: ['3', '5', '6', '7'], erwartet: '6' },
    ],
    loesung: [
      '1NF verlangt **atomare** Werte: genau ein Wert je Zelle. „Excel, SQL" sind zwei Werte → verletzt.',
      'Eine zusammengesetzte Angabe wie die Anschrift wird in ihre Bestandteile zerlegt, damit man z. B. nach Ort suchen kann.',
      'Spalten Kurs1, Kurs2, Kurs3 sind eine Wiederholungsgruppe: Die Zahl der Kurse wäre begrenzt und die Suche nach „SQL" müsste drei Spalten prüfen. Richtig ist eine Zeile je Teilnehmer und Kurs.',
      'Zeilen: T01 mit 2 Kursen, T02 mit 1, T03 mit 3 → **6** Zeilen. Dadurch stehen Name und Anschrift mehrfach – das beseitigen die nächsten Normalformen.',
    ],
  },
  {
    id: 'nf-q2',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-4',
    titel: '2. Normalform: Projektzeiten',
    text: 'In der Projektzeiterfassung bilden **PersonalNr und ProjektNr zusammen** den Primärschlüssel. Die Stunden sind die Summe je Mitarbeiter und Projekt.',
    tabelle: {
      kopf: ['PersonalNr (PK)', 'ProjektNr (PK)', 'Mitarbeitername', 'Projektname', 'Stunden'],
      zeilen: [
        ['P10', 'PR-1', 'Klein', 'Webshop', '12'],
        ['P10', 'PR-2', 'Klein', 'Intranet', '7'],
        ['P11', 'PR-1', 'Özdemir', 'Webshop', '20'],
        ['P12', 'PR-3', 'Hahn', 'Lager-App', '5'],
      ],
    },
    felder: [
      { id: 'a', label: 'Welche Spalte hängt vom ganzen Primärschlüssel ab?', optionen: ['Mitarbeitername', 'Projektname', 'Stunden'], erwartet: 'Stunden' },
      {
        id: 'b',
        label: 'Wovon hängt „Projektname" ab?',
        optionen: ['nur von PersonalNr', 'nur von ProjektNr', 'von PersonalNr und ProjektNr zusammen'],
        erwartet: 'nur von ProjektNr',
      },
      { id: 'c', label: 'Welche Normalform erfüllt die Tabelle höchstens?', optionen: ['keine', ...NF], erwartet: '1. Normalform' },
      {
        id: 'd',
        label: 'Welche Zerlegung bringt die Tabelle in die 2. Normalform?',
        optionen: [
          'Mitarbeiter (PersonalNr, Mitarbeitername, Stunden) und Projekt (ProjektNr, Projektname)',
          'Mitarbeiter (PersonalNr, Mitarbeitername), Projekt (ProjektNr, Projektname), Zeit (PersonalNr, ProjektNr, Stunden)',
          'Zeit (PersonalNr, ProjektNr, Mitarbeitername) und Projekt (ProjektNr, Projektname, Stunden)',
        ],
        erwartet: 'Mitarbeiter (PersonalNr, Mitarbeitername), Projekt (ProjektNr, Projektname), Zeit (PersonalNr, ProjektNr, Stunden)',
      },
    ],
    loesung: [
      'Die Stunden gelten für ein **Paar** aus Mitarbeiter und Projekt – sie brauchen beide Schlüsselteile.',
      'Der Mitarbeitername hängt nur von der PersonalNr ab, der Projektname nur von der ProjektNr. Das sind **teilweise** Abhängigkeiten → 2NF verletzt.',
      'Alle Zellen sind atomar → 1NF ist erfüllt, mehr nicht.',
      'Zur 2NF wandert jedes teilweise abhängige Attribut mit **seinem** Schlüsselteil in eine eigene Tabelle. In der Ausgangstabelle bleibt, was vom ganzen Schlüssel abhängt: die Stunden.',
    ],
  },
  {
    id: 'nf-q3',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-4',
    titel: '3. Normalform: Mitarbeiter und Abteilung',
    text: 'Die Tabelle Mitarbeiter hat den Primärschlüssel **PersonalNr**.',
    tabelle: {
      kopf: ['PersonalNr (PK)', 'Name', 'AbteilungsNr', 'Abteilungsname'],
      zeilen: [
        ['1001', 'Schulz', 'A1', 'Vertrieb'],
        ['1002', 'Yilmaz', 'A2', 'IT'],
        ['1003', 'Becker', 'A1', 'Vertrieb'],
        ['1004', 'Novak', 'A2', 'IT'],
      ],
    },
    felder: [
      { id: 'a', label: 'Welche Normalform erfüllt die Tabelle höchstens?', optionen: NF, erwartet: '2. Normalform' },
      {
        id: 'b',
        label: 'Warum ist sie sicher in der 2. Normalform?',
        optionen: ['Es gibt keine leeren Zellen.', 'Der Primärschlüssel besteht aus nur einer Spalte.', 'Jede Zeile ist anders.'],
        erwartet: 'Der Primärschlüssel besteht aus nur einer Spalte.',
      },
      {
        id: 'c',
        label: 'Welche Abhängigkeit verletzt die 3. Normalform?',
        optionen: ['Name hängt von PersonalNr ab', 'Abteilungsname hängt von AbteilungsNr ab', 'AbteilungsNr hängt von PersonalNr ab'],
        erwartet: 'Abteilungsname hängt von AbteilungsNr ab',
      },
      {
        id: 'd',
        label: 'Wie stellst du die 3. Normalform her?',
        optionen: [
          'Spalte Abteilungsname löschen',
          'Tabelle Abteilung (AbteilungsNr, Abteilungsname) abspalten; AbteilungsNr bleibt als FK in Mitarbeiter',
          'Spalte Name in eine eigene Tabelle auslagern',
        ],
        erwartet: 'Tabelle Abteilung (AbteilungsNr, Abteilungsname) abspalten; AbteilungsNr bleibt als FK in Mitarbeiter',
      },
    ],
    loesung: [
      'Bei einem **einspaltigen** PK kann nichts nur von einem Teil des Schlüssels abhängen → eine Tabelle in 1NF ist dann automatisch in 2NF.',
      'PersonalNr → AbteilungsNr → Abteilungsname: Der Abteilungsname hängt **transitiv** über ein Nichtschlüsselattribut vom PK ab → 3NF verletzt.',
      'Abhängigkeiten vom PK (Name, AbteilungsNr) sind erlaubt.',
      'Die abhängige Gruppe kommt in eine eigene Tabelle mit AbteilungsNr als PK. Löschen wäre falsch – die Information ginge verloren.',
    ],
  },
  {
    id: 'nf-q4',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-3',
    titel: 'Anomalien in der Werkstatt',
    text: 'Eine Werkstatt speichert ihre Aufträge in einer einzigen Tabelle (PK: AuftragsNr).',
    tabelle: {
      kopf: ['AuftragsNr (PK)', 'Datum', 'KundenNr', 'Kunde', 'Kundenort', 'Leistung'],
      zeilen: [
        ['A-301', '03.03.', 'K7', 'Lang', 'Bochum', 'Ölwechsel'],
        ['A-302', '03.03.', 'K9', 'Aydin', 'Essen', 'Bremsen'],
        ['A-303', '05.03.', 'K7', 'Lang', 'Bochum', 'Reifenwechsel'],
        ['A-304', '06.03.', 'K4', 'Roth', 'Herne', 'Inspektion'],
        ['A-305', '07.03.', 'K9', 'Aydin', 'Essen', 'Ölwechsel'],
      ],
    },
    felder: [
      {
        id: 'a',
        label: 'Welche Angabe ist redundant gespeichert?',
        optionen: ['Das Datum 03.03. in A-301 und A-302', 'Name und Ort von Kunde K7 in A-301 und A-303', 'Die Leistung „Ölwechsel" in A-301 und A-305'],
        erwartet: 'Name und Ort von Kunde K7 in A-301 und A-303',
      },
      { id: 'b', label: 'Frau Lang zieht nach Hattingen; geändert wird nur die Zeile A-301.', optionen: ANOMALIE, erwartet: 'Änderungsanomalie' },
      { id: 'c', label: 'Ein Neukunde K12 soll schon vor seinem ersten Auftrag gespeichert werden.', optionen: ANOMALIE, erwartet: 'Einfügeanomalie' },
      { id: 'd', label: 'Auftrag A-304 wird storniert und gelöscht.', optionen: ANOMALIE, erwartet: 'Löschanomalie' },
      { id: 'e', label: 'Welche Zeile führt beim Löschen zum Verlust von Kundendaten?', optionen: ['A-301', 'A-302', 'A-304', 'A-305'], erwartet: 'A-304' },
    ],
    loesung: [
      '**Redundanz**: Dass K7 „Lang" heißt und in Bochum wohnt, ist **eine** Information – sie steht aber zweimal. Gleiche Werte bei Datum oder Leistung sind dagegen verschiedene Fakten (zwei Aufträge am selben Tag).',
      '**Änderungsanomalie**: Nach der Änderung steht für K7 in A-301 Hattingen, in A-303 Bochum – die Daten widersprechen sich.',
      '**Einfügeanomalie**: Ohne Auftrag gibt es keine AuftragsNr, also keinen Primärschlüssel – der Kunde kann nicht angelegt werden.',
      '**Löschanomalie**: K4 (Roth, Herne) steht nur in A-304. Mit dem Auftrag ist der Kunde weg. Bei A-301, A-302 oder A-305 bleibt der Kunde in einer anderen Zeile erhalten.',
      'Ursache: Kunde und Kundenort hängen von der KundenNr ab, nicht vom Auftrag (3NF verletzt). Abhilfe: eigene Tabelle Kunde.',
    ],
  },
  {
    id: 'nf-q5',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-3',
    titel: 'Anomalien bei Kursbelegungen',
    text: 'Ein Schulungsanbieter speichert Belegungen mit Note. **TeilnehmerNr und KursNr zusammen** bilden den Primärschlüssel.',
    tabelle: {
      kopf: ['TeilnehmerNr (PK)', 'KursNr (PK)', 'Teilnehmer', 'Kurstitel', 'Kurspreis (€)', 'Note'],
      zeilen: [
        ['T01', 'K-SQL', 'Berg', 'SQL Grundlagen', '490', '2'],
        ['T02', 'K-SQL', 'Kraft', 'SQL Grundlagen', '490', '1'],
        ['T01', 'K-PY', 'Berg', 'Python Einstieg', '590', '3'],
        ['T03', 'K-NET', 'Wolf', 'Netzwerktechnik', '650', '2'],
      ],
    },
    felder: [
      {
        id: 'a',
        label: 'Konkretes Beispiel für Redundanz',
        optionen: ['Die Note 2 steht in zwei Zeilen.', 'Titel und Preis von K-SQL stehen in zwei Zeilen.', 'T01 ist Teil des Primärschlüssels.'],
        erwartet: 'Titel und Preis von K-SQL stehen in zwei Zeilen.',
      },
      {
        id: 'b',
        label: 'Der Preis von K-SQL steigt auf 520 €; geändert wird nur die erste Zeile. Folge?',
        optionen: ['Die Zeile T02/K-SQL passt sich automatisch an.', 'Für K-SQL stehen zwei verschiedene Preise in der Tabelle (Änderungsanomalie).', 'Die Änderung wird abgelehnt.'],
        erwartet: 'Für K-SQL stehen zwei verschiedene Preise in der Tabelle (Änderungsanomalie).',
      },
      { id: 'c', label: 'Ein neuer Kurs K-WEB soll angelegt werden, bevor sich jemand anmeldet.', optionen: ANOMALIE, erwartet: 'Einfügeanomalie' },
      {
        id: 'd',
        label: 'Wolf (T03) meldet sich von K-NET ab; die Zeile wird gelöscht. Was geht verloren?',
        optionen: ['Nur die Note von Wolf', 'Alle Angaben zu Wolf und zum Kurs K-NET (Löschanomalie)', 'Nichts, weil K-NET noch in einer anderen Zeile steht'],
        erwartet: 'Alle Angaben zu Wolf und zum Kurs K-NET (Löschanomalie)',
      },
      { id: 'e', label: 'Welche Normalform ist verletzt und verursacht diese Anomalien?', optionen: NF, erwartet: '2. Normalform' },
    ],
    loesung: [
      '**Redundanz**: Titel und Preis von K-SQL sind eine Information über den Kurs, stehen aber in jeder Belegung dieses Kurses. Die gleiche Note bei zwei Teilnehmern sind zwei verschiedene Fakten.',
      '**Änderungsanomalie**: Wird der Preis nicht in allen K-SQL-Zeilen geändert, widersprechen sich die Daten.',
      '**Einfügeanomalie**: Ohne Teilnehmer fehlt ein Teil des Primärschlüssels – der Kurs lässt sich nicht speichern.',
      '**Löschanomalie**: T03 und K-NET kommen nur in dieser Zeile vor – mit ihr verschwinden Teilnehmer- und Kursdaten.',
      'Ursache: Teilnehmer hängt nur von der TeilnehmerNr ab, Kurstitel und Kurspreis nur von der KursNr – teilweise Abhängigkeiten vom zusammengesetzten Schlüssel → **2NF** verletzt. Nur die Note hängt vom ganzen Schlüssel ab.',
    ],
  },
  {
    id: 'nf-q6',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-4',
    titel: 'Normalformen: stimmt das?',
    text: 'Entscheide bei jeder Aussage, ob sie stimmt.',
    felder: [
      { id: 'a', label: 'Eine Tabelle in 1NF mit einspaltigem Primärschlüssel ist automatisch in 2NF.', optionen: STIMMT, erwartet: 'stimmt' },
      { id: 'b', label: 'Eine Tabelle in 2NF ist automatisch auch in 3NF.', optionen: STIMMT, erwartet: 'stimmt nicht' },
      { id: 'c', label: 'Die 3NF verbietet, dass ein Nichtschlüsselattribut von einem anderen Nichtschlüsselattribut abhängt.', optionen: STIMMT, erwartet: 'stimmt' },
      { id: 'd', label: 'Die 2NF ist verletzt, wenn ein Nichtschlüsselattribut nur von einem Teil eines zusammengesetzten Primärschlüssels abhängt.', optionen: STIMMT, erwartet: 'stimmt' },
      { id: 'e', label: 'Eine Spalte „Telefonnummern" mit „0221 123, 0171 456" erfüllt die 1NF, solange die Werte durch Kommas getrennt sind.', optionen: STIMMT, erwartet: 'stimmt nicht' },
      { id: 'f', label: 'Normalisieren verringert Redundanz, indem Tabellen zerlegt und über Fremdschlüssel verbunden werden.', optionen: STIMMT, erwartet: 'stimmt' },
    ],
    loesung: [
      '[a] Ohne zusammengesetzten Schlüssel gibt es keinen „Teil" des Schlüssels – teilweise Abhängigkeiten sind unmöglich.',
      '[b] Eine 2NF-Tabelle kann noch transitive Abhängigkeiten haben (KundenNr → Kundenname in einer Auftragstabelle).',
      '[c] und [d] sind die Definitionen von 3NF und 2NF.',
      '[e] Zwei Telefonnummern in einer Zelle sind zwei Werte – das Trennzeichen ändert daran nichts.',
      '[f] Jede Information steht danach nur noch einmal; die Tabellen werden über Schlüssel wieder verknüpft.',
    ],
  },
  {
    id: 'nf-q7',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-4',
    titel: 'Termine einer Arztpraxis zerlegen',
    text: 'Die Termin-Tabelle einer Arztpraxis hat den Primärschlüssel **TerminNr**. Jeder Arzt hat genau eine Fachrichtung.',
    tabelle: {
      kopf: ['TerminNr (PK)', 'Datum', 'PatientenNr', 'Patient', 'ArztNr', 'Arzt', 'Fachrichtung'],
      zeilen: [
        ['T-1', '02.05.', 'P1', 'Weber', 'A1', 'Dr. Brandt', 'Allgemeinmedizin'],
        ['T-2', '02.05.', 'P2', 'Kaya', 'A2', 'Dr. Lim', 'Orthopädie'],
        ['T-3', '03.05.', 'P1', 'Weber', 'A2', 'Dr. Lim', 'Orthopädie'],
        ['T-4', '04.05.', 'P3', 'Fischer', 'A1', 'Dr. Brandt', 'Allgemeinmedizin'],
      ],
    },
    felder: [
      { id: 'a', label: 'Welche Normalform erfüllt die Tabelle höchstens?', optionen: NF, erwartet: '2. Normalform' },
      { id: 'b', label: 'Welche Spalten bilden die neue Tabelle Arzt?', optionen: ['ArztNr, Datum', 'ArztNr, Arzt, Fachrichtung', 'Arzt, Patient, Fachrichtung'], erwartet: 'ArztNr, Arzt, Fachrichtung' },
      {
        id: 'c',
        label: 'Welche Spalten bleiben in der Tabelle Termin?',
        optionen: ['TerminNr, Datum, PatientenNr, ArztNr', 'TerminNr, Datum, Patient, Arzt', 'TerminNr, Datum'],
        erwartet: 'TerminNr, Datum, PatientenNr, ArztNr',
      },
      { id: 'd', label: 'Wie viele Tabellen hat das Ergebnis in 3. Normalform?', optionen: ['2', '3', '4'], erwartet: '3' },
    ],
    loesung: [
      'Alle Werte sind atomar, der PK ist einspaltig → 2NF ist erfüllt.',
      'Patient hängt von der PatientenNr ab, Arzt und Fachrichtung von der ArztNr – beides Nichtschlüsselattribute → transitive Abhängigkeiten, 3NF verletzt.',
      'Jede Gruppe kommt mit ihrem bestimmenden Attribut als PK in eine eigene Tabelle: Patient (PatientenNr, Patient) und Arzt (ArztNr, Arzt, Fachrichtung).',
      'In Termin bleiben TerminNr, Datum und die beiden Fremdschlüssel PatientenNr und ArztNr – ohne sie wäre die Verbindung verloren. Ergebnis: **3** Tabellen.',
    ],
  },
  {
    id: 'nf-q8',
    art: 'fragen',
    raum: ['AP2'],
    sp: 'AP2-2-2-3',
    titel: 'Redundanz im Lager belegen',
    text: 'Ein IT-Händler speichert Artikel mit ihrem Lieferanten (PK: ArtikelNr). Jeder Artikel kommt von genau einem Lieferanten.',
    tabelle: {
      kopf: ['ArtikelNr (PK)', 'Bezeichnung', 'LieferantNr', 'Lieferant', 'Telefon Lieferant'],
      zeilen: [
        ['4711', 'USB-Stick 64 GB', 'L1', 'DataParts', '0211 5550'],
        ['4712', 'SSD 1 TB', 'L1', 'DataParts', '0211 5550'],
        ['4713', 'Monitorarm', 'L2', 'ErgoTec', '089 7712'],
        ['4714', 'HDMI-Kabel', 'L1', 'DataParts', '0211 5550'],
      ],
    },
    felder: [
      {
        id: 'a',
        label: 'Welche Aussage belegt die Redundanz richtig?',
        optionen: [
          'Name und Telefonnummer von L1 stehen dreimal: bei 4711, 4712 und 4714.',
          'Die LieferantNr L1 kommt mehrfach vor, deshalb muss die Spalte gelöscht werden.',
          'Jede ArtikelNr kommt nur einmal vor.',
        ],
        erwartet: 'Name und Telefonnummer von L1 stehen dreimal: bei 4711, 4712 und 4714.',
      },
      { id: 'b', label: 'DataParts bekommt eine neue Telefonnummer. In wie vielen Zeilen muss sie geändert werden?', optionen: ['1', '2', '3'], erwartet: '3' },
      { id: 'c', label: 'Artikel 4713 wird ausgelistet und gelöscht.', optionen: ANOMALIE, erwartet: 'Löschanomalie' },
      { id: 'd', label: 'Ein neuer Lieferant soll erfasst werden, bevor er einen Artikel liefert.', optionen: ANOMALIE, erwartet: 'Einfügeanomalie' },
      {
        id: 'e',
        label: 'Welche Abhängigkeit verursacht die Redundanz?',
        optionen: ['ArtikelNr → Bezeichnung', 'LieferantNr → Lieferant, Telefon Lieferant', 'Bezeichnung → ArtikelNr'],
        erwartet: 'LieferantNr → Lieferant, Telefon Lieferant',
      },
    ],
    loesung: [
      'Redundanz belegst du immer **konkret**: welcher Wert, in welchen Zeilen. Die Lieferantendaten von L1 stehen in drei Zeilen.',
      'Der Wert L1 selbst muss mehrfach vorkommen – er ist nach der Zerlegung der Fremdschlüssel. Redundant sind die Angaben, die man über ihn nachschlagen kann.',
      '**Änderung**: Alle drei L1-Zeilen müssen angepasst werden – vergisst man eine, widersprechen sich die Daten.',
      '**Löschanomalie**: 4713 ist der einzige Artikel von ErgoTec – mit ihm geht die Telefonnummer von ErgoTec verloren.',
      '**Einfügeanomalie**: Ohne Artikel keine ArtikelNr, also kein Primärschlüssel – der Lieferant kann nicht gespeichert werden.',
      'Ursache: Lieferant und Telefon hängen von der LieferantNr ab, einem Nichtschlüsselattribut (transitive Abhängigkeit). Abhilfe: Tabelle Lieferant abspalten.',
    ],
  },

  // ---------- Zeichnen ----------
  {
    id: 'nf-z1',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-2-4',
    titel: 'Kursanmeldungen bis zur 3NF',
    text: 'Ein Schulungsanbieter führt diese Liste. Jeder Kurs wird von genau einem Trainer geleitet; jeder Teilnehmer bucht einen Kurs höchstens einmal. Zerlege die Tabelle in Tabellen in **3. Normalform**. Kennzeichne Primär- und Fremdschlüssel und zeichne die Beziehungen mit Kardinalitäten.',
    tabelle: {
      kopf: ['TeilnehmerNr', 'Name', 'Anschrift', 'KursNr', 'Kurstitel', 'TrainerNr', 'Trainer', 'Buchungsdatum'],
      zeilen: [
        ['T01', 'Berg', 'Lindenweg 3, 50667 Köln', 'K-SQL, K-PY', 'SQL Grundlagen, Python Einstieg', 'TR2, TR5', 'Sommer, Haas', '02.03., 09.03.'],
        ['T02', 'Kraft', 'Ringstr. 12, 44135 Dortmund', 'K-SQL', 'SQL Grundlagen', 'TR2', 'Sommer', '04.03.'],
        ['T03', 'Wolf', 'Am Markt 1, 50667 Köln', 'K-PY', 'Python Einstieg', 'TR5', 'Haas', '10.03.'],
      ],
    },
    muster: {
      breite: 800,
      hoehe: 190,
      knoten: [
        tab('tn', 20, 40, 'Teilnehmer', ['#TeilnehmerNr', 'Name', 'Straße', 'PLZ', 'Ort'], { w: 150 }),
        tab('buchung', 230, 59, 'Buchung', ['#>TeilnehmerNr', '#>KursNr', 'Buchungsdatum'], { w: 150 }),
        tab('kurs', 450, 59, 'Kurs', ['#KursNr', 'Kurstitel', '>TrainerNr']),
        tab('trainer', 650, 69, 'Trainer', ['#TrainerNr', 'Trainer']),
      ],
      kanten: [rel('tn', 'buchung', '1', 'n'), rel('buchung', 'kurs', 'n', '1'), rel('kurs', 'trainer', 'n', '1')],
    },
    pruefliste: [
      '**1NF**: Anschrift in Straße, PLZ, Ort zerlegt; keine Listen mehr in einer Zelle',
      'Tabelle **Teilnehmer** mit PK TeilnehmerNr, Name und Anschriftsspalten',
      'Tabelle **Kurs** mit PK KursNr und Kurstitel',
      'Tabelle **Trainer** mit PK TrainerNr und Trainername; in Kurs der FK **TrainerNr** (3NF: Trainername hängt nicht am Kurs)',
      'Zwischentabelle **Buchung** mit zusammengesetztem PK aus TeilnehmerNr und KursNr (beide FK) und **Buchungsdatum**',
      'Beziehungen: Teilnehmer 1 – n Buchung, Kurs 1 – n Buchung, Trainer 1 – n Kurs',
      'Keine Angabe doppelt: Kurstitel nur in Kurs, Trainername nur in Trainer',
    ],
    hinweise: 'Streng genommen hängt der Ort von der PLZ ab. Meist bleiben PLZ und Ort trotzdem beim Teilnehmer; eine eigene Tabelle Ort (PLZ, Ort) ist aber ebenfalls richtig. Den Namen der Zwischentabelle („Buchung", „Anmeldung") wählst du selbst.',
  },
  {
    id: 'nf-z2',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-2-4',
    titel: 'Werkstattaufträge normalisieren',
    text: 'Eine Werkstatt erfasst ihre Aufträge so. Jedes Fahrzeug (Kennzeichen) gehört genau einem Kunden, jeder Auftrag betrifft genau ein Fahrzeug. Mehrere Teile je Auftrag sind durch Semikolon getrennt. Entwickle ein Modell in **3. Normalform** mit allen Schlüsseln und Kardinalitäten.',
    tabelle: {
      kopf: ['AuftragsNr', 'Datum', 'Kennzeichen', 'KundenNr', 'Kunde', 'TeilNr', 'Teil', 'Menge'],
      zeilen: [
        ['A-501', '02.06.', 'BO-LA 12', 'K7', 'Lang', 'T-11; T-40', 'Ölfilter; Motoröl 5 l', '1; 1'],
        ['A-502', '02.06.', 'E-MA 300', 'K9', 'Aydin', 'T-23', 'Bremsbeläge', '2'],
        ['A-503', '09.06.', 'BO-LA 12', 'K7', 'Lang', 'T-40', 'Motoröl 5 l', '1'],
      ],
    },
    muster: {
      breite: 600,
      hoehe: 330,
      knoten: [
        tab('kunde', 20, 50, 'Kunde', ['#KundenNr', 'Kunde']),
        tab('fzg', 210, 50, 'Fahrzeug', ['#Kennzeichen', '>KundenNr']),
        tab('auftrag', 430, 40, 'Auftrag', ['#AuftragsNr', 'Datum', '>Kennzeichen']),
        tab('pos', 422, 220, 'Auftragsposition', ['#>AuftragsNr', '#>TeilNr', 'Menge'], { w: 150 }),
        tab('teil', 210, 230, 'Teil', ['#TeilNr', 'Bezeichnung']),
      ],
      kanten: [rel('kunde', 'fzg', '1', 'n'), rel('fzg', 'auftrag', '1', 'n'), rel('auftrag', 'pos', '1', 'n'), rel('teil', 'pos', '1', 'n')],
    },
    pruefliste: [
      '**1NF**: je Auftrag und Teil eine eigene Zeile – keine Listen „T-11; T-40" mehr',
      '**2NF**: Teilbezeichnung hängt nur an TeilNr → eigene Tabelle **Teil**; Datum und Kennzeichen hängen nur an AuftragsNr → Tabelle **Auftrag**',
      'Zwischentabelle **Auftragsposition** mit PK aus AuftragsNr und TeilNr (beide FK) und der **Menge**',
      '**3NF**: KundenNr hängt am Kennzeichen → eigene Tabelle **Fahrzeug** (Kennzeichen, KundenNr), Auftrag behält nur den FK Kennzeichen',
      '**3NF**: Kundenname hängt an KundenNr → eigene Tabelle **Kunde**',
      'Alle PK und FK gekennzeichnet; Beziehungen Kunde 1 – n Fahrzeug 1 – n Auftrag 1 – n Auftragsposition n – 1 Teil',
      'Keine Angabe doppelt: Kundenname nur in Kunde, Teilbezeichnung nur in Teil',
    ],
    hinweise: 'Typischer Fehler: KundenNr zusätzlich in Auftrag. Sie lässt sich über das Kennzeichen ermitteln – das wäre wieder eine transitive Abhängigkeit (AuftragsNr → Kennzeichen → KundenNr).',
  },
  {
    id: 'nf-z3',
    art: 'zeichnen',
    raum: ['AP2'],
    sp: 'AP2-2-2-3',
    titel: 'Redundanz und Anomalien beschreiben',
    text: 'Eine Arztpraxis speichert Termine in dieser Tabelle (PK: TerminNr). Schreibe auf:\n- ein **konkretes** Beispiel für Redundanz in dieser Tabelle,\n- je ein Beispiel aus dieser Tabelle für die **Änderungs-**, die **Einfüge-** und die **Löschanomalie**.',
    tabelle: {
      kopf: ['TerminNr (PK)', 'Datum', 'PatientenNr', 'Patient', 'Krankenkasse', 'Arzt'],
      zeilen: [
        ['T-101', '02.05.', 'P1', 'Weber', 'AOK', 'Dr. Brandt'],
        ['T-102', '02.05.', 'P2', 'Kaya', 'TK', 'Dr. Lim'],
        ['T-103', '06.05.', 'P1', 'Weber', 'AOK', 'Dr. Lim'],
        ['T-104', '07.05.', 'P3', 'Fischer', 'DAK', 'Dr. Brandt'],
      ],
    },
    musterText: `- **Redundanz**: Name und Krankenkasse von Patient P1 (Weber, AOK) stehen zweimal – in T-101 und in T-103.
- **Änderungsanomalie**: Wechselt Frau Weber zur TK und wird nur T-101 geändert, steht in T-103 weiter AOK – die Daten widersprechen sich.
- **Einfügeanomalie**: Ein neuer Patient kann erst gespeichert werden, wenn er einen Termin hat – ohne TerminNr fehlt der Primärschlüssel.
- **Löschanomalie**: Wird Termin T-104 gelöscht, gehen alle Angaben zu Patient P3 (Fischer, DAK) verloren, weil er nur dort steht.
- **Ursache**: Patient und Krankenkasse hängen von der PatientenNr ab, nicht vom Termin. Abhilfe: Tabelle Patient (PatientenNr, Patient, Krankenkasse) abspalten.`,
    pruefliste: [
      'Redundanz mit **konkreten Zeilen** belegt (z. B. P1 in T-101 und T-103), nicht nur allgemein erklärt',
      '**Änderungsanomalie**: ein Wert, der mehrfach steht, wird nur in einer Zeile geändert → Widerspruch',
      '**Einfügeanomalie**: Patient ohne Termin nicht speicherbar, weil der Schlüssel TerminNr fehlt',
      '**Löschanomalie**: Löschen des einzigen Termins eines Patienten (T-104 oder T-102) löscht auch seine Stammdaten',
      'Jedes Beispiel nennt Zeilen bzw. Werte aus **dieser** Tabelle',
      'Ursache erkannt: Patientendaten hängen an der PatientenNr, nicht am Termin',
    ],
    hinweise: 'Für die Löschanomalie passt auch T-102 (einziger Termin von Kaya). T-101 passt nicht – Weber steht noch in T-103.',
  },
];

export default { spickzettel, notation, aufgaben };
